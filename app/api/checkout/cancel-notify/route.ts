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

    // Only mark as cancelled if still pending (don't overwrite paid/failed)
    if (order.status === "pending") {
      await supabase
        .from("pending_orders")
        .update({ status: "cancelled" })
        .eq("id", token)
    }

    const firstName = (order.shipping_address as { first_name?: string })?.first_name
    const orderRef  = token.slice(0, 8).toUpperCase()

    sendPaymentFailed({ email: order.email, firstName, orderRef }).catch(
      e => console.error("[cancel-notify] email error:", e),
    )

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[cancel-notify]", err)
    return NextResponse.json({ ok: true })
  }
}
