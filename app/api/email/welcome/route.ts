import { NextResponse } from "next/server"
import { sendWelcome } from "@/lib/email"

export async function POST(req: Request) {
  const { email, firstName } = await req.json()

  if (!email) return NextResponse.json({ error: "email fehlt" }, { status: 400 })

  try {
    await sendWelcome({ email, firstName })
    return NextResponse.json({ ok: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Fehler"
    console.error("[email/welcome]", msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
