import { NextRequest, NextResponse } from "next/server"
import { sendShippingConfirmation } from "@/lib/email"

// Called from Shopify webhook or manually when order ships.
// Body: { email, firstName, orderRef, trackingNumber?, trackingUrl?, carrier?, lineItems, shippingAddress }
export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-webhook-secret") ?? req.nextUrl.searchParams.get("secret") ?? ""
  if (secret !== process.env.ZAPIER_CONFIRMED_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { email, firstName, orderRef, trackingNumber, trackingUrl, carrier, lineItems, shippingAddress } = body

    if (!email || !orderRef || !lineItems || !shippingAddress) {
      return NextResponse.json({ error: "Pflichtfelder fehlen" }, { status: 400 })
    }

    await sendShippingConfirmation({ email, firstName, orderRef, trackingNumber, trackingUrl, carrier, lineItems, shippingAddress })
    return NextResponse.json({ ok: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Fehler"
    console.error("[email/shipping]", msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
