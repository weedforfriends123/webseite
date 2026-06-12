"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import type { Profile } from "@/lib/hooks/useUser"

const TEXT  = "#35383f"
const MUTED = "rgba(53,56,63,0.55)"
const DIM   = "rgba(53,56,63,0.10)"

const SETTINGS = [
  {
    group: "E-Mail",
    items: [
      { id: "order_confirm", label: "Bestellbestätigung",     desc: "Bei jeder neuen Bestellung",              default: true },
      { id: "shipping",      label: "Versandbenachrichtigung", desc: "Wenn dein Paket unterwegs ist",           default: true },
      { id: "delivery",      label: "Lieferbestätigung",       desc: "Wenn dein Paket angekommen ist",          default: true },
      { id: "newsletter",    label: "Newsletter & Angebote",   desc: "Neue Produkte, Deals und Aktionen",       default: true },
      { id: "points",        label: "Treuepunkte",             desc: "Wenn du Punkte sammelst oder einlöst",    default: true },
    ],
  },
  {
    group: "Konto",
    items: [
      { id: "login",           label: "Neue Anmeldung",    desc: "Bei unbekannten Geräten oder Standorten", default: true },
      { id: "password_change", label: "Passwortänderung",  desc: "Bei jeder Passwortänderung",              default: true },
    ],
  },
]

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className="relative shrink-0 transition-colors duration-300"
      style={{ width: 40, height: 22, borderRadius: 9999, background: on ? TEXT : DIM }}
    >
      <div
        style={{
          position: "absolute", top: 3, left: 3,
          width: 16, height: 16, borderRadius: "50%",
          background: on ? "#e8e4dc" : MUTED,
          transition: "transform 0.25s",
          transform: on ? "translateX(18px)" : "translateX(0)",
        }}
      />
    </button>
  )
}

interface Props { user: User | null; profile: Profile | null; signOut: () => void }

export function Notifications({ user }: Props) {
  const supabase = createClient()
  const defaultState = Object.fromEntries(SETTINGS.flatMap(g => g.items.map(i => [i.id, i.default])))
  const savedPrefs = (user?.user_metadata?.notification_prefs as Record<string, boolean>) ?? {}
  const [state, setState] = useState<Record<string, boolean>>({ ...defaultState, ...savedPrefs })
  const [saving, setSaving] = useState(false)

  const toggle = async (id: string, v: boolean) => {
    const newState = { ...state, [id]: v }
    setState(newState)
    setSaving(true)
    await supabase.auth.updateUser({ data: { notification_prefs: newState } })
    setSaving(false)
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="font-ekstra uppercase mb-2" style={{ fontSize: 11, letterSpacing: "0.30em", color: "rgba(53,56,63,0.40)" }}>Konto</p>
        <div className="flex items-center gap-3">
          <h1 className="font-druk-wide uppercase leading-none" style={{ fontSize: "clamp(0.85rem, 3.6vw, 4rem)", color: TEXT }}>
            Benachrichtigungen
          </h1>
          {saving && (
            <div className="w-3.5 h-3.5 rounded-full border border-[#35383f] border-t-transparent animate-spin opacity-40" />
          )}
        </div>
      </div>

      <div className="space-y-4">
        {SETTINGS.map((group) => (
          <div
            key={group.group}
            style={{ padding: "clamp(20px,3vh,28px)", borderRadius: 16, background: "rgba(255,255,255,0.42)", border: "1px solid rgba(255,255,255,0.68)" }}
          >
            <p className="font-ekstra uppercase mb-5" style={{ fontSize: 10, letterSpacing: "0.28em", color: MUTED }}>
              {group.group}
            </p>
            <div className="space-y-5">
              {group.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-ekstra" style={{ fontSize: "0.9rem", color: TEXT }}>{item.label}</p>
                    <p className="font-ekstra mt-0.5" style={{ fontSize: "0.82rem", color: MUTED }}>{item.desc}</p>
                  </div>
                  <Toggle on={state[item.id]} onChange={v => toggle(item.id, v)} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
