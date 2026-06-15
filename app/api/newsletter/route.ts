import { NextRequest, NextResponse } from "next/server"
import { appendFileSync, mkdirSync } from "fs"
import { join } from "path"
import { syncShopifyCustomer } from "@/lib/shopify.server"
import { sendNewsletterConfirmation } from "@/lib/email"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const email = String(body.email ?? "")
      .trim()
      .toLowerCase()

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: "Ungültige E-Mail-Adresse." },
        { status: 400 }
      )
    }

    // ── Shopify customer sync (fire-and-forget — never blocks the response) ──
    syncShopifyCustomer({ email, accepts_marketing: true }).catch(e =>
      console.error("[newsletter] shopify sync error:", e),
    )

    // ── Confirmation email ────────────────────────────────────────────────────
    sendNewsletterConfirmation({ email }).catch(e =>
      console.error("[newsletter] confirmation email error:", e),
    )

    // ── Brevo integration (set BREVO_API_KEY in .env.local) ──────────────────
    if (process.env.BREVO_API_KEY) {
      const r = await fetch("https://api.brevo.com/v3/contacts", {
        method: "POST",
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "content-type": "application/json",
        },
        body: JSON.stringify({ email, updateEnabled: true }),
      })

      if (!r.ok) {
        const err = await r.json().catch(() => ({}))
        // DUPLICATE_PARAMETER = already subscribed — treat as success
        if ((err as { code?: string }).code !== "DUPLICATE_PARAMETER") {
          console.error("Brevo error:", err)
          return NextResponse.json(
            { error: "Newsletter-Dienst nicht erreichbar." },
            { status: 502 }
          )
        }
      }

      return NextResponse.json({ ok: true })
    }

    // ── Local fallback — appends to data/subscribers.txt (dev / no-API) ──────
    const dir = join(process.cwd(), "data")
    mkdirSync(dir, { recursive: true })
    appendFileSync(join(dir, "subscribers.txt"), `${email}\n`)
    console.log(`[newsletter] saved: ${email}`)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[newsletter] error:", err)
    return NextResponse.json({ error: "Serverfehler." }, { status: 500 })
  }
}
