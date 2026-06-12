import { Resend } from "resend"
import { NextResponse } from "next/server"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  const { email, firstName } = await req.json()

  const { error } = await resend.emails.send({
    from: "WEED FOR FRIENDS <noreply@weedforfriends.com>",
    to: ["info@weedforfriends.com"],
    subject: "Neue Registrierung — WEED FOR FRIENDS",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#bcc0ca;padding:40px;border-radius:16px">
        <h2 style="font-size:24px;font-weight:900;text-transform:uppercase;color:#35383f;margin:0 0 16px">
          Neuer Kunde
        </h2>
        <p style="color:#35383f;opacity:0.65;margin:0 0 8px">Name: ${firstName || "—"}</p>
        <p style="color:#35383f;opacity:0.65;margin:0">E-Mail: ${email}</p>
      </div>
    `,
  })

  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ ok: true })
}
