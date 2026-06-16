import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { sendPaymentFailed } from "@/lib/email"

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json()
    if (!token) return NextResponse.json({ error: "token fehlt" }, { status: 400 })

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    const { data: order } = await supabase
      .from("pending_orders")
      .select("id, email, shipping_address, status")
      .eq("id", token)
      .single()

    if (!order) return NextResponse.json({ ok: true })

    // Mark as cancelled unless already paid (idempotent — safe to call multiple times)
    const wasActive = order.status === "pending"
    if (order.status !== "paid") {
      await supabase
        .from("pending_orders")
        .update({ status: "cancelled" })
        .eq("id", token)
    }

    const firstName = (order.shipping_address as { first_name?: string })?.first_name
    const orderRef  = token.slice(0, 8).toUpperCase()

    // Only send failure email on first failure / first retry failure (was pending → now cancelled)
    // Avoids duplicate emails when called multiple times in rapid succession
    if (wasActive) {
      sendPaymentFailed({ email: order.email, firstName, orderRef }).catch(
        e => console.error("[cancel-notify] email error:", e),
      )
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[cancel-notify]", err)
    return NextResponse.json({ ok: true })
  }
}
