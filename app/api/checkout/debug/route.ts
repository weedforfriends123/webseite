import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

export async function POST(req: NextRequest) {
  const rawText = await req.text()
  const headers = Object.fromEntries(req.headers.entries())

  await supabase.from("zapier_debug").upsert({
    id: Date.now().toString(),
    raw_body: rawText,
    content_type: headers["content-type"] ?? "",
    created_at: new Date().toISOString(),
  })

  return NextResponse.json({ ok: true })
}
