import { NextRequest, NextResponse } from "next/server"
import { createShopifyOrder, type CreateOrderPayload } from "@/lib/shopify.server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as CreateOrderPayload

    if (!body.email || !body.line_items?.length || !body.shipping_address) {
      return NextResponse.json({ error: "Pflichtfelder fehlen" }, { status: 400 })
    }

    // 1. Shopify Draft Order anlegen (pending payment)
    const order = await createShopifyOrder(body)

    // 2. Stripe Checkout Session via Zapier Webhook erstellen
    const hookUrl = process.env.ZAPIER_PAYMENT_HOOK_URL
    if (!hookUrl) throw new Error("ZAPIER_PAYMENT_HOOK_URL nicht konfiguriert")

    const origin = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? ""
    const successUrl = `${origin}/checkout/success?order_id=${order.id}`
    const cancelUrl  = `${origin}/checkout/cancel?order_id=${order.id}`

    const grandTotal = (
      body.line_items.reduce((s, i) => s + parseFloat(i.price) * i.quantity, 0) +
      parseFloat(body.shipping_price ?? "0")
    ).toFixed(2)

    const hookRes = await fetch(hookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order_id:       String(order.id),
        order_number:   order.order_number,
        customer_email: body.email,
        amount_eur:     grandTotal,
        currency:       "eur",
        line_items:     body.line_items,
        success_url:    successUrl,
        cancel_url:     cancelUrl,
      }),
    })

    if (!hookRes.ok) {
      throw new Error(`Zapier Webhook Fehler: ${hookRes.status}`)
    }

    const hookData = await hookRes.json()
    // Stripe Checkout Session gibt das URL-Feld direkt zurück
    const paymentUrl: string | undefined =
      hookData.url ?? hookData.payment_url ?? hookData.checkout_url

    if (!paymentUrl) {
      throw new Error("Keine Zahlungs-URL von Zapier erhalten")
    }

    return NextResponse.json({ ok: true, url: paymentUrl, order_id: order.id })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unbekannter Fehler"
    console.error("[checkout/start]", msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
