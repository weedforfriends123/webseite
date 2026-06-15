import { NextRequest, NextResponse } from "next/server"
import { randomUUID } from "crypto"

type LineItem = {
  title: string
  variant_title?: string
  price: string
  quantity: number
}

type ShippingAddress = {
  first_name: string
  last_name: string
  address1: string
  address2?: string
  city: string
  zip: string
  country: string
  phone?: string
}

type CheckoutPayload = {
  email: string
  phone?: string
  line_items: LineItem[]
  shipping_address: ShippingAddress
  shipping_price: string
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as CheckoutPayload

    if (!body.email || !body.line_items?.length || !body.shipping_address) {
      return NextResponse.json({ error: "Pflichtfelder fehlen" }, { status: 400 })
    }

    const hookUrl = process.env.ZAPIER_PAYMENT_HOOK_URL
    if (!hookUrl) throw new Error("ZAPIER_PAYMENT_HOOK_URL nicht konfiguriert")

    const origin = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? ""
    const orderToken = randomUUID()

    const grandTotal = (
      body.line_items.reduce((s, i) => s + parseFloat(i.price) * i.quantity, 0) +
      parseFloat(body.shipping_price ?? "0")
    ).toFixed(2)

    // Alle Bestelldaten + Token an Zapier schicken.
    // Zapier speichert sie (Storage by Zapier) und erstellt die Stripe Session.
    // Nach erfolgreicher Zahlung holt Zapier die Daten und legt die Shopify Order an.
    const hookRes = await fetch(hookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order_token:      orderToken,
        customer_email:   body.email,
        phone:            body.phone ?? "",
        amount_eur:       grandTotal,
        // Betrag in Cent für Stripe (z.B. 29.99 → 2999)
        amount_cents:     Math.round(parseFloat(grandTotal) * 100),
        currency:         "eur",
        line_items:       body.line_items,
        shipping_address: body.shipping_address,
        shipping_price:   body.shipping_price,
        success_url:      `${origin}/checkout/success?token=${orderToken}`,
        cancel_url:       `${origin}/checkout/cancel`,
      }),
    })

    if (!hookRes.ok) throw new Error(`Zapier Webhook Fehler: ${hookRes.status}`)

    const hookData = await hookRes.json()
    const paymentUrl: string | undefined =
      hookData.url ?? hookData.payment_url ?? hookData.checkout_url

    if (!paymentUrl) throw new Error("Keine Zahlungs-URL von Zapier erhalten")

    return NextResponse.json({ ok: true, url: paymentUrl })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unbekannter Fehler"
    console.error("[checkout/start]", msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
