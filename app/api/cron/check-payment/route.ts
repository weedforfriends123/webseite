import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Zapier calls this on a schedule (e.g. every 15 minutes).
// Returns ONE pending order that needs Stripe verification.
// Zapier then calls Stripe's "Retrieve Checkout Session" and, if paid,
// calls /api/payment/confirmed with the order_number.
//
// Security: require x-cron-secret header matching CRON_SECRET env var.

export async function GET(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret") ?? req.nextUrl.searchParams.get("secret") ?? ""
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  // Find the oldest pending order that has a Stripe session ID
  // and was created more than 5 minutes ago (give Zapier time to call confirmed first)
  // but less than 24 hours ago (older ones are handled by Supabase pg_cron cleanup)
  const fiveMinutesAgo  = new Date(Date.now() - 5  * 60 * 1000).toISOString()
  const twentyFourHAgo  = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

  const { data: orders } = await supabase
    .from("pending_orders")
    .select("id, stripe_session_id, amount_cents, email, shipping_address, line_items")
    .eq("status", "pending")
    .not("stripe_session_id", "is", null)
    .lt("created_at",  fiveMinutesAgo)
    .gt("created_at",  twentyFourHAgo)
    .order("created_at", { ascending: true })
    .limit(1)

  if (!orders || orders.length === 0) {
    return NextResponse.json({ nothing: true })
  }

  const order = orders[0]
  const addr  = order.shipping_address as { first_name?: string; last_name?: string } | null

  return NextResponse.json({
    nothing:           false,
    order_id:          order.id,
    stripe_session_id: order.stripe_session_id,
    amount_cents:      order.amount_cents,
    email:             order.email,
    order_ref:         order.id.slice(0, 8).toUpperCase(),
    customer_name:     addr ? `${addr.first_name ?? ""} ${addr.last_name ?? ""}`.trim() : "",
  })
}
