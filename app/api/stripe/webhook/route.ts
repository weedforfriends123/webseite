import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"
import { createShopifyOrder } from "@/lib/shopify.server"

// Stripe erwartet den RAW body für Signaturprüfung — kein bodyParser
export const config = { api: { bodyParser: false } }

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-05-27.dahlia" })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const sig     = req.headers.get("stripe-signature") ?? ""
  const secret  = process.env.STRIPE_WEBHOOK_SECRET!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, secret)
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Webhook-Signatur ungültig"
    console.error("[stripe/webhook] signature error:", msg)
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ ok: true, skipped: true })
  }

  const session = event.data.object as Stripe.Checkout.Session

  // order_number kommt entweder aus client_reference_id oder metadata
  const orderNumber =
    session.client_reference_id ??
    (session.metadata?.order_number as string | undefined) ??
    null

  if (!orderNumber) {
    console.error("[stripe/webhook] keine order_number in session:", session.id)
    return NextResponse.json({ error: "order_number fehlt" }, { status: 400 })
  }

  // Bestelldaten aus Supabase holen
  const { data: order, error: fetchErr } = await supabase
    .from("pending_orders")
    .select("*")
    .eq("id", orderNumber)
    .single()

  if (fetchErr || !order) {
    console.error("[stripe/webhook] order nicht gefunden:", orderNumber, fetchErr)
    return NextResponse.json({ error: "Order nicht gefunden" }, { status: 404 })
  }

  if (order.status === "paid") {
    // Idempotenz: bereits verarbeitet
    return NextResponse.json({ ok: true, already_processed: true })
  }

  try {
    const addr = order.shipping_address as {
      first_name: string; last_name: string
      address1: string; address2?: string
      city: string; zip: string; country: string; phone?: string
    }

    const shopifyOrder = await createShopifyOrder({
      email:            order.email,
      phone:            order.phone ?? undefined,
      note:             `Stripe Session: ${session.id}`,
      financial_status: "paid",
      line_items:       order.line_items,
      shipping_address: {
        first_name: addr.first_name,
        last_name:  addr.last_name,
        address1:   addr.address1,
        address2:   addr.address2,
        city:       addr.city,
        zip:        addr.zip,
        country:    addr.country,
        phone:      addr.phone,
      },
      shipping_price: order.shipping_price,
      amount_cents:   order.amount_cents,
    })

    // Status auf "paid" setzen + Shopify Order ID speichern
    await supabase
      .from("pending_orders")
      .update({ status: "paid", shopify_order_id: shopifyOrder.id })
      .eq("id", orderNumber)

    console.log(`[stripe/webhook] Shopify Order #${shopifyOrder.order_number} erstellt für ${order.email}`)
    return NextResponse.json({ ok: true, shopify_order_number: shopifyOrder.order_number })

  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unbekannter Fehler"
    console.error("[stripe/webhook] Shopify Fehler:", msg)
    await supabase
      .from("pending_orders")
      .update({ status: "failed" })
      .eq("id", orderNumber)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
