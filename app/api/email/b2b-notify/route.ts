import { NextResponse } from "next/server"
import { sendB2BConfirmation, sendB2BInternalNotification } from "@/lib/email"

export async function POST(req: Request) {
  const body = await req.json()
  const { company, contact, email, phone, business_type, volume, message, vat } = body

  if (!email || !company || !contact) {
    return NextResponse.json({ error: "Pflichtfelder fehlen" }, { status: 400 })
  }

  try {
    await Promise.all([
      sendB2BConfirmation({ email, contact, company }),
      sendB2BInternalNotification({ company, contact, email, phone, business_type, volume, message, vat }),
    ])
    return NextResponse.json({ ok: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Fehler"
    console.error("[b2b-notify]", msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
