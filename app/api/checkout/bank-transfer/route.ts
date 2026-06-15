import { NextRequest, NextResponse } from "next/server"
import { randomUUID } from "crypto"
import { createClient } from "@supabase/supabase-js"
import { createShopifyOrder } from "@/lib/shopify.server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.email || !body.line_items?.length || !body.shipping_address) {
      return NextResponse.json({ error: "Pflichtfelder fehlen" }, { status: 400 })
    }

    const grandTotal = (
      body.line_items.reduce((s: number, i: { price: string; quantity: number }) =>
        s + parseFloat(i.price) * i.quantity, 0) +
      parseFloat(body.shipping_price ?? "0")
    )
    const amountCents = Math.round(grandTotal * 100)
    const orderNumber = randomUUID()
    const addr = body.shipping_address

    // In Supabase speichern
    await supabase.from("pending_orders").insert({
      id:               orderNumber,
      status:           "awaiting_payment",
      email:            body.email,
      phone:            body.phone ?? null,
      line_items:       body.line_items,
      shipping_address: addr,
      shipping_price:   body.shipping_price ?? "0.00",
      amount_cents:     amountCents,
    })

    // Shopify Order als ausstehend anlegen
    await createShopifyOrder({
      email:            body.email,
      phone:            body.phone,
      note:             `Banküberweisung — Ref: ${orderNumber.slice(0, 8).toUpperCase()}`,
      financial_status: "pending",
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
      amount_cents:   amountCents,
    })

    return NextResponse.json({
      ok:           true,
      order_token:  orderNumber,
      reference:    orderNumber.slice(0, 8).toUpperCase(),
      amount:       grandTotal.toFixed(2),
      bank: {
        iban:  process.env.BANK_IBAN  ?? "",
        bic:   process.env.BANK_BIC   ?? "",
        owner: process.env.BANK_OWNER ?? "",
        name:  process.env.BANK_NAME  ?? "",
      },
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unbekannter Fehler"
    console.error("[checkout/bank-transfer]", msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
