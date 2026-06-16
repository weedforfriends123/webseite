"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import type { Section } from "@/app/account/page"
import type { User } from "@supabase/supabase-js"
import type { Profile } from "@/lib/hooks/useUser"

const TEXT   = "#35383f"
const MUTED  = "rgba(53,56,63,0.45)"
const DIM    = "rgba(53,56,63,0.10)"
const ACCENT = "#eddc8c"

const NAV: { id: Section; label: string; icon: React.ReactNode }[] = [
  {
    id: "dashboard",
    label: "Übersicht",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    id: "orders",
    label: "Bestellungen",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>
    ),
  },
  {
    id: "profile",
    label: "Profil & Adresse",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    id: "loyalty",
    label: "Treuepunkte",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    id: "notifications",
    label: "Benachrichtigungen",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" />
      </svg>
    ),
  },
  {
    id: "password",
    label: "Passwort",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
      </svg>
    ),
  },
  {
    id: "ageverification",
    label: "Altersverifizierung",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
]

function Avatar({ initials, size = 44 }: { initials: string; size?: number }) {
  const hasInitials = !!initials
  return (
    <div
      className="shrink-0 flex items-center justify-center overflow-hidden"
      style={{ width: size, height: size, borderRadius: "50%", background: TEXT }}
    >
      {hasInitials ? (
        <span style={{ fontFamily: "var(--font-druk-wide, sans-serif)", fontSize: size * 0.32, fontWeight: 700, color: "#e8e4dc" }}>
          {initials}
        </span>
      ) : (
        <Image src="/logo.webp" alt="WFF" width={size} height={size}
          style={{ width: size * 0.68, height: size * 0.68, objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.85 }} />
      )}
    </div>
  )
}

interface Props {
  active: Section
  setActive: (s: Section) => void
  onSignOut: () => void
  user?: User | null
  profile?: Profile | null
}

export function AccountSidebar({ active, setActive, onSignOut, user, profile }: Props) {
  const initials = [profile?.first_name, profile?.last_name]
    .filter(Boolean).map(n => n![0].toUpperCase()).join("") || (user?.email?.[0].toUpperCase() ?? "")

  const displayName = [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || "Mein Konto"
  const points      = profile?.loyalty_points ?? 0
  const nextReward  = 500
  const progress    = Math.min((points / nextReward) * 100, 100)

  return (
    <div>

      {/* ═══════════════════════════════════════════
          MOBILE  (< md)
      ═══════════════════════════════════════════ */}
      <div className="block md:hidden">

        {/* User header row */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3 mb-4 px-1"
        >
          <Avatar initials={initials} size={40} />
          <div className="flex-1 min-w-0">
            <p className="font-druk-wide uppercase leading-none truncate"
              style={{ fontSize: "0.78rem", color: TEXT }}>{displayName}</p>
            <div className="flex items-center gap-1 mt-1">
              <svg width="8" height="8" viewBox="0 0 24 24" fill={ACCENT}>
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span className="font-ekstra" style={{ fontSize: 10, color: MUTED }}>{points} WFF Punkte</span>
            </div>
          </div>
          <button
            onClick={onSignOut}
            className="flex items-center justify-center shrink-0"
            style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.50)", border: "1px solid rgba(255,255,255,0.72)" }}
            aria-label="Abmelden"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={TEXT} strokeWidth="1.8" strokeLinecap="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </motion.div>

        {/* Nav grid — 2 columns */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          {NAV.map((item, i) => {
            const isActive = active === item.id
            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05 + i * 0.04, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                onClick={(e) => { setActive(item.id); (e.currentTarget as HTMLButtonElement).blur() }}
                className="flex flex-col items-center gap-2"
                style={{
                  padding: "14px 10px",
                  borderRadius: 14,
                  background: isActive ? TEXT : "rgba(255,255,255,0.42)",
                  border: `1px solid ${isActive ? TEXT : "rgba(255,255,255,0.68)"}`,
                  color: isActive ? "#e8e4dc" : TEXT,
                  transition: "all 0.2s ease",
                  textAlign: "center",
                }}
              >
                <span style={{ opacity: isActive ? 1 : 0.45 }}>{item.icon}</span>
                <span className="font-ekstra leading-tight" style={{ fontSize: "0.7rem", letterSpacing: "0.01em", wordBreak: "break-word", hyphens: "auto" } as React.CSSProperties}>
                  {item.label}
                </span>
              </motion.button>
            )
          })}
        </div>

      </div>

      {/* ═══════════════════════════════════════════
          DESKTOP  (md+)
      ═══════════════════════════════════════════ */}
      <div className="hidden md:block space-y-1.5">

        {/* User card */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6"
          style={{ padding: "clamp(20px,2.8vh,28px)", borderRadius: 18, background: "rgba(255,255,255,0.48)", border: "1px solid rgba(255,255,255,0.70)" }}
        >
          <div className="flex items-center gap-3">
            <Avatar initials={initials} size={44} />
            <div className="min-w-0">
              <p className="font-druk-wide uppercase leading-none truncate" style={{ fontSize: "0.82rem", color: TEXT }}>
                {displayName}
              </p>
              <p className="font-ekstra truncate mt-1" style={{ fontSize: 10, color: MUTED }}>{user?.email}</p>
            </div>
          </div>

          <div className="mt-5 pt-4 flex items-center justify-between" style={{ borderTop: `1px solid ${DIM}` }}>
            <span className="font-ekstra uppercase" style={{ fontSize: 9, letterSpacing: "0.22em", color: MUTED }}>Punkte</span>
            <div className="flex items-center gap-1.5">
              <svg width="10" height="10" viewBox="0 0 24 24" fill={ACCENT}>
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span className="font-druk-wide" style={{ fontSize: "0.88rem", color: TEXT }}>{points} WFF</span>
            </div>
          </div>
          <div className="mt-2">
            <div style={{ height: 3, borderRadius: 9999, background: DIM, overflow: "hidden" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                style={{ height: "100%", background: ACCENT, borderRadius: 9999 }}
              />
            </div>
            <p className="font-ekstra mt-1.5" style={{ fontSize: 8, letterSpacing: "0.16em", color: "rgba(53,56,63,0.30)" }}>
              {nextReward - points} Punkte bis zur nächsten Prämie
            </p>
          </div>
        </motion.div>

        {NAV.map((item, i) => {
          const isActive = active === item.id
          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.18 + i * 0.05, duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setActive(item.id)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left"
              style={{
                background: isActive ? "rgba(255,255,255,0.60)" : "transparent",
                border: `1px solid ${isActive ? "rgba(255,255,255,0.80)" : "transparent"}`,
                color: isActive ? TEXT : MUTED,
              }}
            >
              <span style={{ color: isActive ? TEXT : "rgba(53,56,63,0.36)" }}>{item.icon}</span>
              <span className="font-ekstra" style={{ fontSize: "0.82rem" }}>{item.label}</span>
            </motion.button>
          )
        })}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.60, duration: 0.35 }}
          className="pt-3 mt-1"
          style={{ borderTop: `1px solid ${DIM}` }}
        >
          <button
            onClick={onSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left hover:opacity-70"
            style={{ color: "rgba(53,56,63,0.35)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span className="font-ekstra" style={{ fontSize: "0.82rem" }}>Abmelden</span>
          </button>
        </motion.div>

      </div>
    </div>
  )
}
