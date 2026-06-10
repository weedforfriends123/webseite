"use client"

import { motion } from "framer-motion"

const HISTORY = [
  { date: "04.06.2026", desc: "Bestellung WFF-2026-005", points: "+13", type: "earn" },
  { date: "03.06.2026", desc: "Bestellung WFF-2026-004", points: "+30", type: "earn" },
  { date: "01.06.2026", desc: "Bestellung WFF-2026-003", points: "+52", type: "earn" },
  { date: "25.05.2026", desc: "Prämie eingelöst: 5€ Rabatt", points: "-100", type: "redeem" },
  { date: "22.05.2026", desc: "Bestellung WFF-2026-002", points: "+33", type: "earn" },
  { date: "15.05.2026", desc: "Bestellung WFF-2026-001", points: "+60", type: "earn" },
  { date: "10.05.2026", desc: "Willkommensbonus", points: "+50", type: "earn" },
  { date: "10.05.2026", desc: "Registrierung", points: "+312", type: "earn" },
]

const REWARDS = [
  { name: "5€ Rabatt", points: 100, available: true },
  { name: "10€ Rabatt", points: 200, available: true },
  { name: "Gratis Pre-Roll", points: 300, available: true },
  { name: "Gratis Vape", points: 500, available: false },
]

export function Loyalty() {
  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-lime/60 mb-2">Konto</p>
        <h1 className="font-sans font-extrabold text-4xl text-cream">Treuepunkte</h1>
      </div>

      {/* Balance card */}
      <div className="p-6 rounded-2xl border border-lime/20 bg-lime/[0.04] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-lime/[0.06] rounded-full blur-[60px] pointer-events-none" />
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-lime/50 mb-2">Aktuelles Guthaben</p>
        <div className="flex items-end gap-3 mb-4">
          <span className="font-sans font-extrabold text-6xl text-cream leading-none">450</span>
          <span className="font-sans font-bold text-xl text-lime mb-1">WFF Points</span>
        </div>
        {/* Progress */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="font-mono text-[9px] text-cream/30">Nächste Stufe: 500 Punkte</span>
            <span className="font-mono text-[9px] text-lime/60">450 / 500</span>
          </div>
          <div className="h-1.5 rounded-full bg-cream/[0.08] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "90%" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="h-full bg-lime rounded-full"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Rewards */}
        <div className="p-6 rounded-2xl border border-cream/[0.08] bg-cream/[0.02]">
          <h2 className="font-sans font-bold text-base text-cream mb-5">Prämien einlösen</h2>
          <div className="space-y-3">
            {REWARDS.map((r) => (
              <div key={r.name} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${r.available ? "border-cream/[0.08] hover:border-lime/20" : "border-cream/[0.04] opacity-40"}`}>
                <div>
                  <p className="font-sans font-bold text-sm text-cream">{r.name}</p>
                  <p className="font-mono text-[9px] text-cream/25 mt-0.5">{r.points} Punkte</p>
                </div>
                <button
                  disabled={!r.available}
                  className={`px-4 py-1.5 rounded-full text-xs font-sans font-bold transition-all ${r.available ? "bg-lime text-bg hover:scale-105" : "bg-cream/[0.06] text-cream/20 cursor-not-allowed"}`}
                >
                  {r.available ? "Einlösen" : "Bald"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* History */}
        <div className="p-6 rounded-2xl border border-cream/[0.08] bg-cream/[0.02]">
          <h2 className="font-sans font-bold text-base text-cream mb-5">Punktehistorie</h2>
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {HISTORY.map((h, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-cream/[0.04] last:border-0">
                <div className="min-w-0">
                  <p className="font-sans text-xs text-cream/60 truncate">{h.desc}</p>
                  <p className="font-mono text-[8px] text-cream/20 mt-0.5">{h.date}</p>
                </div>
                <span className={`font-sans font-bold text-sm shrink-0 ml-3 ${h.type === "earn" ? "text-lime" : "text-red-400/60"}`}>
                  {h.points}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
