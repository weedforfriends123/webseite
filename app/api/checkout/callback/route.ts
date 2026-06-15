import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

// Zapier sendet plaintext in diesem Format:
// "Stripe Checkout URL: https://checkout.stripe.com/...\nOrder: <order_number>\nSession ID: cs_live_..."

export async function POST(req: NextRequest) {
  try {
    const rawText = await req.text()

    let paymentUrl   = ""
    let orderNumber  = ""
    let sessionId    = ""

    const contentType = req.headers.get("content-type") ?? ""

    if (contentType.includes("application/json")) {
      const body = JSON.parse(rawText) as Record<string, string>
      paymentUrl  = body.url ?? body.payment_url ?? body.checkout_url ?? body["Stripe Checkout URL"] ?? ""
      orderNumber = body.order_number ?? body.order ?? body.Order ?? ""
      sessionId   = body.session_id ?? body["Session ID"] ?? ""
    } else {
      for (const line of rawText.split("\n")) {
        const trimmed = line.trim()
        if (trimmed.startsWith("Stripe Checkout URL:")) {
          paymentUrl  = trimmed.replace("Stripe Checkout URL:", "").trim()
        } else if (trimmed.startsWith("Order:")) {
          orderNumber = trimmed.replace("Order:", "").trim()
        } else if (trimmed.startsWith("Session ID:")) {
          sessionId   = trimmed.replace("Session ID:", "").trim()
        }
      }
    }

    if (!paymentUrl || !orderNumber) {
      console.error("[checkout/callback] fehlende Felder. raw:", rawText)
      return NextResponse.json({ error: "order_number oder URL fehlen", raw: rawText }, { status: 400 })
    }

    // Stripe-URL für Frontend-Polling speichern
    const { error } = await supabase
      .from("payment_sessions")
      .upsert({ token: orderNumber, payment_url: paymentUrl })

    if (error) {
      console.error("[checkout/callback] supabase error:", error)
      return NextResponse.json({ error: "Speicherfehler" }, { status: 500 })
    }

    // Stripe Session ID in pending_orders speichern (für Webhook-Lookup)
    if (sessionId) {
      await supabase
        .from("pending_orders")
        .update({ stripe_session_id: sessionId })
        .eq("id", orderNumber)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unbekannter Fehler"
    console.error("[checkout/callback]", msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
