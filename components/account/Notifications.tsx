"use client"

import { useState } from "react"

const SETTINGS = [
  {
    group: "E-Mail",
    items: [
      { id: "order_confirm", label: "Bestellbestätigung", desc: "Bei jeder neuen Bestellung", default: true },
      { id: "shipping", label: "Versandbenachrichtigung", desc: "Wenn dein Paket unterwegs ist", default: true },
      { id: "delivery", label: "Lieferbestätigung", desc: "Wenn dein Paket angekommen ist", default: true },
      { id: "newsletter", label: "Newsletter & Angebote", desc: "Neue Produkte, Deals und Aktionen", default: false },
      { id: "points", label: "Treuepunkte", desc: "Wenn du Punkte sammelst oder einlöst", default: true },
    ],
  },
  {
    group: "Konto",
    items: [
      { id: "login", label: "Neue Anmeldung", desc: "Bei unbekannten Geräten oder Standorten", default: true },
      { id: "password_change", label: "Passwortänderung", desc: "Bei jeder Passwortänderung", default: true },
    ],
  },
]

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`relative w-10 h-5 rounded-full transition-colors duration-300 shrink-0 ${on ? "bg-lime" : "bg-cream/[0.12]"}`}
    >
      <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-bg transition-transform duration-300 ${on ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  )
}

export function Notifications() {
  const [state, setState] = useState<Record<string, boolean>>(
    Object.fromEntries(SETTINGS.flatMap(g => g.items.map(i => [i.id, i.default])))
  )

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-lime/60 mb-2">Konto</p>
        <h1 className="font-sans font-extrabold text-4xl text-cream">Benachrichtigungen</h1>
      </div>

      <div className="space-y-6">
        {SETTINGS.map((group) => (
          <div key={group.group} className="p-6 rounded-2xl border border-cream/[0.08] bg-cream/[0.02]">
            <h2 className="font-sans font-bold text-base text-cream mb-5">{group.group}</h2>
            <div className="space-y-5">
              {group.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-sans text-sm text-cream/80">{item.label}</p>
                    <p className="font-sans text-xs text-cream/30 mt-0.5">{item.desc}</p>
                  </div>
                  <Toggle on={state[item.id]} onChange={v => setState(s => ({ ...s, [item.id]: v }))} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
