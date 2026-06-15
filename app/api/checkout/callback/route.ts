import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

export async function POST(req: NextRequest) {
  try {
    const rawText = await req.text()
    console.log("[checkout/callback] raw body:", rawText)

    let body: Record<string, string> = {}

    // 1. JSON versuchen
    try {
      body = JSON.parse(rawText)
    } catch {
      // 2. URL-encoded versuchen
      try {
        body = Object.fromEntries(new URLSearchParams(rawText))
      } catch {
        body = {}
      }
    }

    console.log("[checkout/callback] parsed body:", body)

    // Stripe URL aus allen bekannten Feldnamen extrahieren
    let paymentUrl =
      body.url ??
      body.payment_url ??
      body.checkout_url ??
      body["Stripe Checkout URL"] ??
      body.stripe_url ??
      body.session_url ??
      ""

    // Fallback: URL mit Regex aus dem gesamten Text suchen
    if (!paymentUrl) {
      const match = rawText.match(/https:\/\/checkout\.stripe\.com\/[^\s"']+/)
      paymentUrl = match?.[0] ?? ""
    }

    // Order-Token aus allen bekannten Feldnamen
    let orderNumber =
      body.order_number ??
      body.order ??
      body.Order ??
      body.token ??
      body.reference ??
      body.client_reference_id ??
      ""

    // Fallback: order_number mit Regex suchen
    if (!orderNumber) {
      const match = rawText.match(/order[_\s]?(?:number)?[:\s]+([a-zA-Z0-9_-]+)/i)
      orderNumber = match?.[1] ?? ""
    }

    if (!paymentUrl || !orderNumber) {
      console.error("[checkout/callback] fehlende Felder. body:", body, "raw:", rawText)
      return NextResponse.json(
        { error: "order_number oder URL fehlen", received: body },
        { status: 400 },
      )
    }

    const { error } = await supabase
      .from("payment_sessions")
      .upsert({ token: orderNumber, payment_url: paymentUrl })

    if (error) {
      console.error("[checkout/callback] supabase error:", error)
      return NextResponse.json({ error: "Speicherfehler" }, { status: 500 })
    }

    console.log("[checkout/callback] gespeichert:", orderNumber, paymentUrl)
    return NextResponse.json({ ok: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unbekannter Fehler"
    console.error("[checkout/callback]", msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
