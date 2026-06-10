"use client"

import Image from "next/image"
import type { Section } from "@/app/account/page"

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
    id: "payments",
    label: "Zahlungsmethoden",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" />
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
]

interface Props {
  active: Section
  setActive: (s: Section) => void
}

export function AccountSidebar({ active, setActive }: Props) {
  return (
    <div className="space-y-2">
      {/* User card */}
      <div className="p-5 rounded-2xl border border-cream/[0.08] bg-cream/[0.02] mb-6">
        <div className="flex justify-center mb-4">
          <Image src="/logo.webp" alt="WFF" width={80} height={28} className="h-7 w-auto opacity-80" />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-ember flex items-center justify-center font-sans font-bold text-sm text-cream shrink-0">
            MM
          </div>
          <div className="min-w-0">
            <p className="font-sans font-bold text-cream text-sm truncate">Max Müller</p>
            <p className="font-mono text-[9px] text-cream/30 tracking-wide truncate">max@email.de</p>
          </div>
        </div>
        {/* Points teaser */}
        <div className="mt-4 pt-4 border-t border-cream/[0.06] flex items-center justify-between">
          <span className="font-mono text-[9px] tracking-widest uppercase text-cream/30">Punkte</span>
          <div className="flex items-center gap-1.5">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="#a0ba87"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
            <span className="font-sans font-bold text-lime text-sm">450 WFF</span>
          </div>
        </div>
        {/* Progress to next reward */}
        <div className="mt-2">
          <div className="h-1 rounded-full bg-cream/[0.06] overflow-hidden">
            <div className="h-full bg-lime rounded-full" style={{ width: "90%" }} />
          </div>
          <p className="font-mono text-[8px] text-cream/20 mt-1.5 tracking-wide">50 Punkte bis zur nächsten Prämie</p>
        </div>
      </div>

      {/* Nav items */}
      {NAV.map((item) => (
        <button
          key={item.id}
          onClick={() => setActive(item.id)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 text-left ${
            active === item.id
              ? "bg-lime/10 border border-lime/20 text-lime"
              : "border border-transparent text-cream/40 hover:text-cream/70 hover:bg-cream/[0.03]"
          }`}
        >
          <span className={active === item.id ? "text-lime" : "text-cream/30"}>
            {item.icon}
          </span>
          <span className="font-sans text-xs tracking-wide">{item.label}</span>
        </button>
      ))}

      {/* Logout */}
      <div className="pt-4 mt-2 border-t border-cream/[0.06]">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-cream/25 hover:text-red-400/60 transition-colors text-left">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span className="font-sans text-xs">Abmelden</span>
        </button>
      </div>
    </div>
  )
}
