import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

export async function POST(req: NextRequest) {
  try {
    let body: Record<string, string>

    const contentType = req.headers.get("content-type") ?? ""
    if (contentType.includes("application/json")) {
      body = await req.json()
    } else {
      // Zapier kann auch plain-text oder form-encoded schicken
      const text = await req.text()
      body = Object.fromEntries(new URLSearchParams(text))
    }

    // Stripe URL aus verschiedenen möglichen Feldnamen extrahieren
    const paymentUrl =
      body.url ??
      body.payment_url ??
      body.checkout_url ??
      body["Stripe Checkout URL"] ??
      // Fallback: URL aus dem Body mit Regex suchen
      (Object.values(body).find(v => v?.startsWith("https://checkout.stripe.com")) ?? "")

    const orderNumber =
      body.order_number ??
      body.order ??
      body["Order"] ??
      ""

    if (!paymentUrl || !orderNumber) {
      console.error("[checkout/callback] fehlende Felder:", body)
      return NextResponse.json({ error: "order_number oder URL fehlen" }, { status: 400 })
    }

    // In Supabase speichern — Frontend pollt /api/checkout/status
    const { error } = await supabase
      .from("payment_sessions")
      .upsert({ token: orderNumber, payment_url: paymentUrl })

    if (error) {
      console.error("[checkout/callback] supabase error:", error)
      return NextResponse.json({ error: "Speicherfehler" }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unbekannter Fehler"
    console.error("[checkout/callback]", msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
