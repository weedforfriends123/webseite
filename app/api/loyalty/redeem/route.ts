import { NextRequest, NextResponse } from "next/server"
import { createClient as createSessionClient } from "@/lib/supabase/server"
import { createClient as createServiceClient } from "@supabase/supabase-js"

// Kunden klicken "Einlösen" → wir schreiben die Anfrage in die DB und benachrichtigen
// intern per E-Mail damit das Team den Rabattcode manuell zuschickt.
// (Vollautomatische Gutschein-Erstellung kann später über Shopify API ergänzt werden)

export async function POST(req: NextRequest) {
  try {
    const sessionSb = await createSessionClient()
    const { data: { user } } = await sessionSb.auth.getUser()
    if (!user) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 })

    const { reward_name, reward_points } = await req.json()
    if (!reward_name || !reward_points) {
      return NextResponse.json({ error: "reward_name und reward_points fehlen" }, { status: 400 })
    }

    const serviceSb = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    // Punktestand prüfen
    const { data: profile } = await serviceSb
      .from("profiles")
      .select("loyalty_points, first_name, last_name")
      .eq("id", user.id)
      .single()

    if (!profile || profile.loyalty_points < reward_points) {
      return NextResponse.json({ error: "Nicht genug Punkte" }, { status: 400 })
    }

    // Einlösung eintragen (negative Punkte)
    await serviceSb.from("loyalty_events").insert({
      user_id:     user.id,
      type:        "redemption",
      points:      -reward_points,
      description: `Eingelöst: ${reward_name}`,
    })

    // Punkte abziehen
    await serviceSb
      .from("profiles")
      .update({ loyalty_points: profile.loyalty_points - reward_points })
      .eq("id", user.id)

    // Interne Benachrichtigung per E-Mail (Resend direkt, kein Template nötig)
    const resendKey = process.env.RESEND_API_KEY
    if (resendKey) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${resendKey}` },
        body: JSON.stringify({
          from:    "WFF <noreply@weedforfriends.com>",
          to:      ["info@solovya-labs.com"],
          subject: `WFF Punkte-Einlösung: ${reward_name}`,
          html:    `<p>Kunde: <b>${profile.first_name ?? ""} ${profile.last_name ?? ""}</b> (${user.email})</p>
                   <p>Prämie: <b>${reward_name}</b> (${reward_points} Punkte)</p>
                   <p>Bitte Rabattcode per E-Mail zusenden.</p>`,
        }),
      }).catch(e => console.error("[loyalty/redeem] notify email error:", e))
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[loyalty/redeem]", err)
    return NextResponse.json({ error: "Fehler" }, { status: 500 })
  }
}
