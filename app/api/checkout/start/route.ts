import { NextRequest, NextResponse } from "next/server"
import { randomUUID } from "crypto"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

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

    const grandTotalCheck = (
      body.line_items.reduce((s, i) => s + parseFloat(i.price) * i.quantity, 0) +
      parseFloat(body.shipping_price ?? "0")
    )
    if (grandTotalCheck < 0.50) {
      return NextResponse.json({ error: "Mindestbestellwert ist €0.50 (Stripe-Minimum)" }, { status: 400 })
    }

    const hookUrl = process.env.ZAPIER_PAYMENT_HOOK_URL
    if (!hookUrl) throw new Error("ZAPIER_PAYMENT_HOOK_URL nicht konfiguriert")

    const origin = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? ""
    const orderNumber = randomUUID()

    const grandTotal = (
      body.line_items.reduce((s, i) => s + parseFloat(i.price) * i.quantity, 0) +
      parseFloat(body.shipping_price ?? "0")
    ).toFixed(2)

    const amountCents = Math.round(parseFloat(grandTotal) * 100)

    // Bestelldaten in Supabase speichern — werden beim Stripe-Webhook abgerufen
    const { error: dbErr } = await supabase.from("pending_orders").insert({
      id:               orderNumber,
      status:           "pending",
      email:            body.email,
      phone:            body.phone ?? null,
      line_items:       body.line_items,
      shipping_address: body.shipping_address,
      shipping_price:   body.shipping_price ?? "0.00",
      amount_cents:     amountCents,
    })

    if (dbErr) {
      console.error("[checkout/start] supabase insert error:", dbErr)
      return NextResponse.json({ error: "Datenbankfehler" }, { status: 500 })
    }

    // Zapier: Stripe Checkout Session erstellen
    await fetch(hookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order_number:     orderNumber,
        order_price:      amountCents,
        email:            body.email,
        phone:            body.phone ?? "",
        currency:         "eur",
        line_items:       body.line_items,
        shipping_address: body.shipping_address,
        shipping_price:   body.shipping_price,
        success_url:      `${origin}/checkout/success?token=${orderNumber}`,
        cancel_url:       `${origin}/checkout/cancel`,
        callback_url:     `${origin}/api/checkout/callback`,
      }),
    })

    return NextResponse.json({ ok: true, order_token: orderNumber })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unbekannter Fehler"
    console.error("[checkout/start]", msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
