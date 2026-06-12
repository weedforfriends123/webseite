import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sendAgeVerificationReminder } from "@/lib/email"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/account"

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Send age verification reminder if this is a new/unverified user
      // Only on signup/login flows, not on password reset
      if (next !== "/passwort-zuruecksetzen") {
        const { data: { user } } = await supabase.auth.getUser()
        if (
          user?.email &&
          !user.user_metadata?.age_verified &&
          !user.user_metadata?.age_reminder_sent
        ) {
          const firstName = user.user_metadata?.first_name ?? user.user_metadata?.full_name?.split(" ")[0]
          // Fire and forget — don't delay the redirect
          sendAgeVerificationReminder(user.email, firstName).catch(() => {})
          // Mark as sent so we don't spam on every login
          supabase.auth.updateUser({ data: { age_reminder_sent: true } }).catch(() => {})
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=link_invalid`)
}
