import { NextResponse } from "next/server"
import { createClient as createServiceClient } from "@supabase/supabase-js"
import { createClient as createSessionClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const sessionSb = await createSessionClient()
    const { data: { user } } = await sessionSb.auth.getUser()
    if (!user) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 })

    const serviceSb = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    // Pending orders (checkout flow) — query by email
    const { data: pendingOrders } = await serviceSb
      .from("pending_orders")
      .select("id, status, email, line_items, shipping_address, shipping_price, amount_cents, created_at, shopify_order_id")
      .eq("email", user.email!)
      .in("status", ["pending", "cancelled", "failed"])
      .order("created_at", { ascending: false })
      .limit(20)

    return NextResponse.json({ pending: pendingOrders ?? [] })
  } catch (err) {
    console.error("[account/orders]", err)
    return NextResponse.json({ pending: [] })
  }
}
