import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
  const token = req.nextUrl.searchParams.get("token")
  if (!token) return NextResponse.json({ error: "token fehlt" }, { status: 400 })

  const { data, error } = await supabase
    .from("pending_orders")
    .select("status, shopify_order_id")
    .eq("id", token)
    .single()

  if (error || !data) {
    return NextResponse.json({ status: "not_found" }, { status: 404 })
  }

  return NextResponse.json({
    status:           data.status,           // "pending" | "paid" | "failed"
    shopify_order_id: data.shopify_order_id ?? null,
    order_ref:        token.slice(0, 8).toUpperCase(),
  })
}
