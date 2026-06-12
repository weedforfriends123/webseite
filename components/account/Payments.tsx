"use client"

import type { User } from "@supabase/supabase-js"
import type { Profile } from "@/lib/hooks/useUser"

const TEXT  = "#35383f"
const MUTED = "rgba(53,56,63,0.55)"
const DIM   = "rgba(53,56,63,0.10)"

interface Props { user: User | null; profile: Profile | null; signOut: () => void }

export function Payments({ }: Props) {
  return (
    <div className="space-y-8">
      <div>
        <p className="font-ekstra uppercase mb-2" style={{ fontSize: 11, letterSpacing: "0.30em", color: "rgba(53,56,63,0.40)" }}>Konto</p>
        <h1 className="font-druk-wide uppercase leading-none" style={{ fontSize: "clamp(1.1rem, 4.5vw, 4rem)", color: TEXT }}>
          Zahlungsmethoden
        </h1>
      </div>

      <div
        className="flex flex-col items-center justify-center text-center py-16"
        style={{ borderRadius: 18, background: "rgba(255,255,255,0.42)", border: "1px solid rgba(255,255,255,0.68)" }}
      >
        <div
          className="flex items-center justify-center mb-6"
          style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(255,255,255,0.60)", border: `1px solid ${DIM}` }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="1.5" strokeLinecap="round">
            <rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" />
          </svg>
        </div>
        <p className="font-druk-wide uppercase" style={{ fontSize: "1.2rem", color: TEXT, marginBottom: 8 }}>
          Demnächst verfügbar.
        </p>
        <p className="font-ekstra" style={{ fontSize: "0.9rem", color: MUTED, lineHeight: 1.72, maxWidth: 300 }}>
          Zahlungsmethoden-Verwaltung wird mit dem nächsten Update eingeführt.
        </p>
      </div>
    </div>
  )
}
