import { Resend } from "resend"
import { NextResponse } from "next/server"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  const body = await req.json()
  const { company, contact, email, phone, business_type, volume, message } = body

  const { error } = await resend.emails.send({
    from: "WEEDFORFRIENDS <noreply@weedforfriends.com>",
    to: ["info@weedforfriends.com"],
    subject: `Neue B2B-Anfrage: ${company}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#bcc0ca;padding:40px;border-radius:16px">
        <h2 style="font-size:24px;font-weight:900;text-transform:uppercase;color:#35383f;margin:0 0 24px;letter-spacing:-0.02em">
          Neue B2B-Anfrage
        </h2>
        <table style="width:100%;border-collapse:collapse">
          ${[
            ["Unternehmen", company],
            ["Ansprechpartner", contact],
            ["E-Mail", email],
            ["Telefon", phone || "—"],
            ["Unternehmenstyp", business_type || "—"],
            ["Monatsmenge", volume || "—"],
          ].map(([k, v]) => `
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid rgba(53,56,63,0.12);font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(53,56,63,0.55);width:40%">${k}</td>
              <td style="padding:10px 0;border-bottom:1px solid rgba(53,56,63,0.12);font-size:14px;color:#35383f">${v}</td>
            </tr>
          `).join("")}
        </table>
        ${message ? `
          <div style="margin-top:24px;padding:20px;background:rgba(255,255,255,0.52);border-radius:12px">
            <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(53,56,63,0.55)">Nachricht</p>
            <p style="margin:0;font-size:14px;color:#35383f;line-height:1.7">${message}</p>
          </div>
        ` : ""}
      </div>
    `,
  })

  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ ok: true })
}
