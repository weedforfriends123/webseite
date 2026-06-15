import { NextRequest, NextResponse } from "next/server"
import { createClient as createServiceClient } from "@supabase/supabase-js"
import { createClient as createSessionClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  try {
    const { order_token } = await req.json()
    if (!order_token) return NextResponse.json({ error: "order_token fehlt" }, { status: 400 })

    // Verify caller is authenticated
    const sessionSb = await createSessionClient()
    const { data: { user } } = await sessionSb.auth.getUser()
    if (!user) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 })

    const serviceSb = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    // Fetch original order
    const { data: order } = await serviceSb
      .from("pending_orders")
      .select("*")
      .eq("id", order_token)
      .single()

    if (!order) return NextResponse.json({ error: "Bestellung nicht gefunden" }, { status: 404 })

    // Security: order email must match authenticated user's email
    if (!user.email || order.email.toLowerCase() !== user.email.toLowerCase()) {
      return NextResponse.json({ error: "Keine Berechtigung" }, { status: 403 })
    }

    if (!["pending", "cancelled", "failed"].includes(order.status)) {
      return NextResponse.json({ error: "Bestellung kann nicht wiederholt werden" }, { status: 400 })
    }

    // Reset order status to pending so polling works again
    await serviceSb
      .from("pending_orders")
      .update({ status: "pending" })
      .eq("id", order_token)

    // Delete old payment session so polling can pick up the new URL
    await serviceSb.from("payment_sessions").delete().eq("token", order_token)

    const origin  = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? ""
    const hookUrl = process.env.ZAPIER_PAYMENT_HOOK_URL
    if (!hookUrl) throw new Error("ZAPIER_PAYMENT_HOOK_URL nicht konfiguriert")

    await fetch(hookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order_number:     order_token,
        order_price:      order.amount_cents,
        email:            order.email,
        phone:            order.phone ?? "",
        currency:         "eur",
        line_items:       order.line_items,
        shipping_address: order.shipping_address,
        shipping_price:   order.shipping_price,
        success_url:      `${origin}/checkout/success?token=${order_token}`,
        cancel_url:       `${origin}/checkout/cancel?token=${order_token}`,
        callback_url:     `${origin}/api/checkout/callback`,
      }),
    })

    return NextResponse.json({ ok: true, order_token })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Fehler"
    console.error("[checkout/retry]", msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
