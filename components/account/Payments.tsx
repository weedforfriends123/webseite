"use client"

import { useState } from "react"

const METHODS = [
  { id: "1", type: "Visa", last4: "4242", expiry: "09/27", default: true },
  { id: "2", type: "SEPA", last4: "DE89 3704 0044 0532 0130 00", expiry: "—", default: false },
]

export function Payments() {
  const [methods, setMethods] = useState(METHODS)

  function setDefault(id: string) {
    setMethods(m => m.map(p => ({ ...p, default: p.id === id })))
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-lime/60 mb-2">Konto</p>
        <h1 className="font-sans font-extrabold text-4xl text-cream">Zahlungsmethoden</h1>
      </div>

      <div className="space-y-3">
        {methods.map((m) => (
          <div key={m.id} className={`p-5 rounded-2xl border transition-all ${m.default ? "border-lime/25 bg-lime/[0.03]" : "border-cream/[0.08] bg-cream/[0.02]"}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Card icon */}
                <div className="w-12 h-8 rounded-lg border border-cream/[0.1] bg-cream/[0.05] flex items-center justify-center">
                  <span className="font-sans font-bold text-[9px] text-cream/50 tracking-wider">{m.type}</span>
                </div>
                <div>
                  <p className="font-sans font-bold text-sm text-cream">
                    {m.type === "Visa" ? `•••• •••• •••• ${m.last4}` : m.last4}
                  </p>
                  <p className="font-mono text-[9px] text-cream/25 mt-0.5">
                    {m.type === "Visa" ? `Läuft ab ${m.expiry}` : "SEPA Lastschrift"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {m.default ? (
                  <span className="font-mono text-[9px] tracking-widest uppercase px-2.5 py-1 rounded-full text-lime bg-lime/10 border border-lime/20">
                    Standard
                  </span>
                ) : (
                  <button
                    onClick={() => setDefault(m.id)}
                    className="font-mono text-[9px] tracking-widest uppercase px-2.5 py-1 rounded-full text-cream/30 border border-cream/10 hover:text-cream/60 hover:border-cream/20 transition-all"
                  >
                    Als Standard
                  </button>
                )}
                <button className="text-cream/20 hover:text-red-400/50 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                    <path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="flex items-center gap-2 px-6 py-3 rounded-full border border-cream/[0.12] text-cream/40 text-sm font-sans hover:text-cream/70 hover:border-cream/25 transition-all">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Zahlungsmethode hinzufügen
      </button>
    </div>
  )
}
