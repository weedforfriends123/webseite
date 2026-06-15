import { NextRequest, NextResponse } from "next/server"
import { createShopifyOrder, type CreateOrderPayload } from "@/lib/shopify.server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as CreateOrderPayload

    // Basic validation
    if (!body.email || !body.line_items?.length || !body.shipping_address) {
      return NextResponse.json(
        { error: "email, line_items und shipping_address sind erforderlich" },
        { status: 400 },
      )
    }

    const order = await createShopifyOrder(body)
    return NextResponse.json({ ok: true, order_id: order.id, order_number: order.order_number })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unbekannter Fehler"
    console.error("[shopify/order]", msg)
    return NextResponse.json({ error: "Bestellung konnte nicht an Shopify übermittelt werden" }, { status: 500 })
  }
}
