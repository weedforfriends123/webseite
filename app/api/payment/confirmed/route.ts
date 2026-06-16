import { NextRequest, NextResponse } from "next/server"
import { createClient, SupabaseClient } from "@supabase/supabase-js"
import { createShopifyOrder } from "@/lib/shopify.server"
import { sendOrderConfirmation, sendPaymentConfirmation } from "@/lib/email"

// 1 Punkt pro €1 — atomisch via read+write (race condition unwahrscheinlich da 1 User = 1 Order)
async function awardLoyaltyPoints(
  supabase: SupabaseClient,
  userId: string,
  orderId: string,
  amountCents: number,
) {
  const points = Math.floor(amountCents / 100)
  if (points <= 0) return

  // Idempotenz: bereits gutgeschrieben?
  const { count } = await supabase
    .from("loyalty_events")
    .select("id", { count: "exact", head: true })
    .eq("order_id", orderId)
    .eq("type", "order")
  if ((count ?? 0) > 0) return

  // Event einfügen
  await supabase.from("loyalty_events").insert({
    user_id:     userId,
    type:        "order",
    points,
    description: `Bestellung #${orderId.slice(0, 8).toUpperCase()} — ${(amountCents / 100).toFixed(2).replace(".", ",")} €`,
    order_id:    orderId,
  })

  // Punkte-Kontostand aktualisieren
  const { data: profile } = await supabase
    .from("profiles")
    .select("loyalty_points")
    .eq("id", userId)
    .single()

  await supabase
    .from("profiles")
    .update({ loyalty_points: (profile?.loyalty_points ?? 0) + points })
    .eq("id", userId)

  console.log(`[loyalty] +${points} WFF Punkte für User ${userId} (Order ${orderId.slice(0, 8).toUpperCase()})`)
}

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

    // Bestellbestätigung (fire & forget) — erst nach echter Zahlung senden
    sendOrderConfirmation({
      email:           order.email,
      firstName:       addr.first_name,
      orderRef:        orderNumber.slice(0, 8).toUpperCase(),
      lineItems:       order.line_items,
      shippingAddress: addr,
      shippingPrice:   order.shipping_price,
      grandTotal:      (order.amount_cents / 100).toFixed(2),
    }).catch(e => console.error("[payment/confirmed] order-confirmation-email error:", e))

    // Zahlungsbestätigung per E-Mail (fire & forget)
    sendPaymentConfirmation({
      email:              order.email,
      firstName:          (order.shipping_address as { first_name?: string }).first_name ?? "",
      shopifyOrderNumber: shopifyOrder.order_number,
      lineItems:          order.line_items,
      shippingPrice:      order.shipping_price,
      grandTotal:         (order.amount_cents / 100).toFixed(2),
    }).catch(e => console.error("[payment/confirmed] email error:", e))

    // Treuepunkte gutschreiben: 1 Punkt pro €1 (nur wenn Bestellung einem Konto zugeordnet)
    if (order.user_id) {
      awardLoyaltyPoints(supabase, order.user_id, orderNumber, order.amount_cents)
        .catch(e => console.error("[payment/confirmed] loyalty error:", e))
    }

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
