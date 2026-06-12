"use client"

import Image from "next/image"
import type { Section } from "@/app/account/page"
import type { User } from "@supabase/supabase-js"
import type { Profile } from "@/lib/hooks/useUser"

const TEXT   = "#35383f"
const MUTED  = "rgba(53,56,63,0.50)"
const DIM    = "rgba(53,56,63,0.10)"
const ACCENT = "#eddc8c"

const NAV: { id: Section; label: string; icon: React.ReactNode }[] = [
  {
    id: "dashboard",
    label: "Übersicht",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    id: "orders",
    label: "Bestellungen",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>
    ),
  },
  {
    id: "profile",
    label: "Profil & Adresse",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    id: "loyalty",
    label: "Treuepunkte",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    id: "payments",
    label: "Zahlungsmethoden",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
  },
  {
    id: "notifications",
    label: "Benachrichtigungen",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" />
      </svg>
    ),
  },
  {
    id: "password",
    label: "Passwort",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
      </svg>
    ),
  },
]

interface Props {
  active: Section
  setActive: (s: Section) => void
  onSignOut: () => void
  user?: User | null
  profile?: Profile | null
}

export function AccountSidebar({ active, setActive, onSignOut, user, profile }: Props) {
  const initials = [profile?.first_name, profile?.last_name]
    .filter(Boolean)
    .map(n => n![0].toUpperCase())
    .join("") || (user?.email?.[0].toUpperCase() ?? "?")

  const displayName = [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || "Mein Konto"
  const points = profile?.loyalty_points ?? 0
  const nextReward = 500
  const progress = Math.min((points / nextReward) * 100, 100)

  return (
    <div className="space-y-1.5">

      {/* User card */}
      <div
        className="mb-6"
        style={{
          padding: "clamp(18px,2.5vh,24px)",
          borderRadius: 18,
          background: "rgba(255,255,255,0.48)",
          border: "1px solid rgba(255,255,255,0.70)",
        }}
      >
        <div className="flex justify-center mb-5">
          <Image src="/logo.webp" alt="WFF" width={80} height={28} style={{ height: 28, width: "auto", filter: "brightness(0)", opacity: 0.7 }} />
        </div>
        <div className="flex items-center gap-3">
          <div
            className="shrink-0 flex items-center justify-center"
            style={{
              width: 44, height: 44, borderRadius: "50%",
              background: TEXT, color: "#e8e4dc",
              fontFamily: "var(--font-druk-wide, sans-serif)",
              fontSize: 14, fontWeight: 700,
            }}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p className="font-druk-wide uppercase leading-none truncate" style={{ fontSize: "0.82rem", color: TEXT }}>
              {displayName}
            </p>
            <p className="font-ekstra truncate mt-0.5" style={{ fontSize: 10, color: MUTED }}>
              {user?.email}
            </p>
          </div>
        </div>

        {/* Points */}
        <div
          className="mt-5 pt-4 flex items-center justify-between"
          style={{ borderTop: `1px solid ${DIM}` }}
        >
          <span className="font-ekstra uppercase" style={{ fontSize: 9, letterSpacing: "0.22em", color: MUTED }}>
            Punkte
          </span>
          <div className="flex items-center gap-1.5">
            <svg width="10" height="10" viewBox="0 0 24 24" fill={ACCENT}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
            <span className="font-druk-wide" style={{ fontSize: "0.88rem", color: TEXT }}>{points} WFF</span>
          </div>
        </div>
        <div className="mt-2">
          <div style={{ height: 3, borderRadius: 9999, background: DIM, overflow: "hidden" }}>
            <div style={{ height: "100%", background: ACCENT, borderRadius: 9999, width: `${progress}%`, transition: "width 0.6s" }} />
          </div>
          <p className="font-ekstra mt-1.5" style={{ fontSize: 8, letterSpacing: "0.16em", color: "rgba(53,56,63,0.30)" }}>
            {nextReward - points} Punkte bis zur nächsten Prämie
          </p>
        </div>
      </div>

      {/* Nav */}
      {NAV.map((item) => {
        const isActive = active === item.id
        return (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 text-left"
            style={{
              background: isActive ? "rgba(255,255,255,0.60)" : "transparent",
              border: `1px solid ${isActive ? "rgba(255,255,255,0.80)" : "transparent"}`,
              color: isActive ? TEXT : MUTED,
            }}
          >
            <span style={{ color: isActive ? TEXT : "rgba(53,56,63,0.36)" }}>{item.icon}</span>
            <span className="font-ekstra" style={{ fontSize: "0.82rem" }}>{item.label}</span>
          </button>
        )
      })}

      {/* Logout */}
      <div className="pt-3 mt-1" style={{ borderTop: `1px solid ${DIM}` }}>
        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 text-left"
          style={{ color: "rgba(53,56,63,0.35)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span className="font-ekstra" style={{ fontSize: "0.82rem" }}>Abmelden</span>
        </button>
      </div>
    </div>
  )
}
