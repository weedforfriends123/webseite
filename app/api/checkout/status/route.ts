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
    .from("payment_sessions")
    .select("payment_url")
    .eq("token", token)
    .single()

  if (error || !data?.payment_url) {
    return NextResponse.json({ ready: false })
  }

  return NextResponse.json({ ready: true, url: data.payment_url })
}
