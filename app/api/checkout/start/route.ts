import { NextRequest, NextResponse } from "next/server"
import { randomUUID } from "crypto"
import { createClient } from "@supabase/supabase-js"
import { createShopifyOrder } from "@/lib/shopify.server"
import { sendOrderConfirmation, sendPaymentConfirmation } from "@/lib/email"

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
  discount_cents?: number
}

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
  try {
    const body = await req.json() as CheckoutPayload

    if (!body.email || !body.line_items?.length || !body.shipping_address) {
      return NextResponse.json({ error: "Pflichtfelder fehlen" }, { status: 400 })
    }

    const origin      = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? ""
    const orderNumber = randomUUID()

    const subtotal = body.line_items.reduce((s, i) => s + parseFloat(i.price) * i.quantity, 0)
      + parseFloat(body.shipping_price ?? "0")

    const discountCents = body.discount_cents ?? 0
    const amountCents   = Math.max(0, Math.round(subtotal * 100) - discountCents)
    const grandTotal    = (amountCents / 100).toFixed(2)

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

    // Bestellbestätigung (fire & forget)
    sendOrderConfirmation({
      email:           body.email,
      firstName:       body.shipping_address.first_name,
      orderRef:        orderNumber.slice(0, 8).toUpperCase(),
      lineItems:       body.line_items,
      shippingAddress: body.shipping_address,
      shippingPrice:   body.shipping_price ?? "0.00",
      grandTotal,
    }).catch(e => console.error("[checkout/start] order-email error:", e))

    // ── Gratis-Order: Stripe überspringen ────────────────────────────────────
    if (amountCents === 0) {
      const addr = body.shipping_address
      try {
        const shopifyOrder = await createShopifyOrder({
          email:            body.email,
          phone:            body.phone,
          note:             "Gratis-Bestellung (100% Rabatt)",
          financial_status: "paid",
          line_items:       body.line_items,
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
          shipping_price: body.shipping_price,
          amount_cents:   0,
        })

        await supabase.from("pending_orders")
          .update({ status: "paid", shopify_order_id: shopifyOrder.id })
          .eq("id", orderNumber)

        sendPaymentConfirmation({
          email:              body.email,
          firstName:          addr.first_name,
          shopifyOrderNumber: shopifyOrder.order_number,
          lineItems:          body.line_items,
          shippingPrice:      body.shipping_price ?? "0.00",
          grandTotal:         "0.00",
        }).catch(e => console.error("[checkout/start] payment-email error:", e))

        console.log(`[checkout/start] Gratis-Order #${shopifyOrder.order_number} für ${body.email}`)
        return NextResponse.json({ ok: true, free: true, order_token: orderNumber })
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Shopify-Fehler"
        console.error("[checkout/start] free order shopify error:", msg)
        return NextResponse.json({ error: msg }, { status: 500 })
      }
    }

    // ── Paid-Order: Zapier → Stripe ──────────────────────────────────────────
    if (amountCents < 50) {
      return NextResponse.json({ error: "Mindestbetrag für Stripe ist €0.50" }, { status: 400 })
    }

    const hookUrl = process.env.ZAPIER_PAYMENT_HOOK_URL
    if (!hookUrl) throw new Error("ZAPIER_PAYMENT_HOOK_URL nicht konfiguriert")

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
