import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { createShopifyOrder } from "@/lib/shopify.server"
import { sendPaymentConfirmation } from "@/lib/email"

// Zapier ruft diesen Endpunkt auf wenn Stripe checkout.session.completed feuert.
// Body: { order_number: string, stripe_session_id?: string }
export async function POST(req: NextRequest) {
  // Secret akzeptieren: URL-Parameter (?secret=...) oder Header (x-webhook-secret)
  const secret =
    req.nextUrl.searchParams.get("secret") ??
    req.headers.get("x-webhook-secret") ??
    ""
  if (secret !== process.env.ZAPIER_CONFIRMED_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  let body: { order_number?: string; stripe_session_id?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Ungültiger Body" }, { status: 400 })
  }

  const orderNumber = body.order_number
  if (!orderNumber) {
    return NextResponse.json({ error: "order_number fehlt" }, { status: 400 })
  }

  // Bestelldaten aus Supabase holen
  const { data: order, error: fetchErr } = await supabase
    .from("pending_orders")
    .select("*")
    .eq("id", orderNumber)
    .single()

  if (fetchErr || !order) {
    console.error("[payment/confirmed] order nicht gefunden:", orderNumber)
    return NextResponse.json({ error: "Order nicht gefunden" }, { status: 404 })
  }

  // Idempotenz: bereits verarbeitet
  if (order.status === "paid") {
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
      note:             body.stripe_session_id ? `Stripe: ${body.stripe_session_id}` : undefined,
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

    await supabase
      .from("pending_orders")
      .update({
        status:          "paid",
        shopify_order_id: shopifyOrder.id,
        ...(body.stripe_session_id ? { stripe_session_id: body.stripe_session_id } : {}),
      })
      .eq("id", orderNumber)

    // Zahlungsbestätigung per E-Mail (fire & forget)
    sendPaymentConfirmation({
      email:              order.email,
      firstName:          (order.shipping_address as { first_name?: string }).first_name ?? "",
      shopifyOrderNumber: shopifyOrder.order_number,
      lineItems:          order.line_items,
      shippingPrice:      order.shipping_price,
      grandTotal:         (order.amount_cents / 100).toFixed(2),
    }).catch(e => console.error("[payment/confirmed] email error:", e))

    console.log(`[payment/confirmed] Shopify Order #${shopifyOrder.order_number} für ${order.email}`)
    return NextResponse.json({ ok: true, shopify_order_number: shopifyOrder.order_number })

  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unbekannter Fehler"
    console.error("[payment/confirmed] Shopify Fehler:", msg)
    await supabase
      .from("pending_orders")
      .update({ status: "failed" })
      .eq("id", orderNumber)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
