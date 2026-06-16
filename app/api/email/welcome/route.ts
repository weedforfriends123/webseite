import { NextResponse } from "next/server"
import { createClient as createSessionClient } from "@/lib/supabase/server"
import { createClient as createServiceClient } from "@supabase/supabase-js"
import { sendWelcome } from "@/lib/email"

const WELCOME_BONUS = 25

export async function POST(req: Request) {
  const { email, firstName } = await req.json()

  if (!email) return NextResponse.json({ error: "email fehlt" }, { status: 400 })

  // Welcome-E-Mail senden
  try {
    await sendWelcome({ email, firstName })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Fehler"
    console.error("[email/welcome]", msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }

  // Willkommensbonus gutschreiben (unkritisch — fehler stoppt den Request nicht)
  try {
    const sessionSb = await createSessionClient()
    const { data: { user: authUser } } = await sessionSb.auth.getUser()

    if (authUser?.id) {
      const serviceSb = createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
      )

      // Idempotenz: nur einmal pro Account
      const { count } = await serviceSb
        .from("loyalty_events")
        .select("id", { count: "exact", head: true })
        .eq("user_id", authUser.id)
        .eq("type", "welcome")

      if ((count ?? 0) === 0) {
        await serviceSb.from("loyalty_events").insert({
          user_id:     authUser.id,
          type:        "welcome",
          points:      WELCOME_BONUS,
          description: "Willkommensbonus",
        })
        await serviceSb
          .from("profiles")
          .update({ loyalty_points: WELCOME_BONUS })
          .eq("id", authUser.id)

        console.log(`[email/welcome] +${WELCOME_BONUS} Willkommenspunkte für ${authUser.email}`)
      }
    }
  } catch (e) {
    console.error("[email/welcome] loyalty bonus error:", e)
  }

  return NextResponse.json({ ok: true })
}
