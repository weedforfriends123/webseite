"use client"

import { motion } from "framer-motion"

const STATS = [
  { label: "Bestellungen", value: "5", sub: "Gesamt" },
  { label: "Treuepunkte", value: "450", sub: "WFF Points" },
  { label: "Gespart", value: "12,99€", sub: "durch Rabatte" },
  { label: "Mitglied seit", value: "Mai 2026", sub: "Mitglied" },
]

const RECENT = [
  { id: "WFF-2026-005", date: "04.06.2026", items: "Purple Haze Blüten 5G", total: "12,99€", status: "Neu", color: "text-cream/50 bg-cream/[0.06]" },
  { id: "WFF-2026-004", date: "03.06.2026", items: "Girl Scout Cookies Vape", total: "29,99€", status: "Versandbereit", color: "text-gold bg-gold/10" },
  { id: "WFF-2026-003", date: "01.06.2026", items: "Gelato Pod ×3, Afghan Hasch 5G", total: "51,96€", status: "Unterwegs", color: "text-lime bg-lime/10" },
]

export function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-lime/60 mb-2">Konto</p>
        <h1 className="font-sans font-extrabold text-4xl text-cream">Willkommen zurück, Max.</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="p-5 rounded-2xl border border-cream/[0.08] bg-cream/[0.02]"
          >
            <p className="font-sans font-extrabold text-2xl text-cream mb-1">{s.value}</p>
            <p className="font-mono text-[9px] tracking-widest uppercase text-cream/30">{s.label}</p>
            <p className="font-sans text-xs text-cream/20 mt-0.5">{s.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-sans font-bold text-lg text-cream">Letzte Bestellungen</h2>
          <span className="font-mono text-[9px] tracking-widest uppercase text-lime/60 cursor-pointer hover:text-lime transition-colors">Alle ansehen →</span>
        </div>
        <div className="space-y-3">
          {RECENT.map((o) => (
            <div key={o.id} className="flex items-center justify-between p-4 rounded-xl border border-cream/[0.06] bg-cream/[0.01] hover:bg-cream/[0.03] transition-colors">
              <div className="flex items-center gap-4 min-w-0">
                <div>
                  <p className="font-sans font-bold text-sm text-cream">{o.id}</p>
                  <p className="font-sans text-xs text-cream/30 mt-0.5 truncate max-w-[220px]">{o.items}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0 ml-4">
                <p className="font-sans font-bold text-sm text-cream hidden sm:block">{o.total}</p>
                <span className={`font-mono text-[9px] tracking-widest uppercase px-2.5 py-1 rounded-full ${o.color}`}>
                  {o.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Points banner */}
      <div className="p-6 rounded-2xl border border-lime/15 bg-lime/[0.04] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="font-sans font-extrabold text-xl text-cream mb-1">50 Punkte bis zur nächsten Prämie</p>
          <p className="font-sans text-sm text-cream/40">Bestelle jetzt und sichere dir deinen Bonus.</p>
        </div>
        <a href="/" className="px-6 py-3 rounded-full bg-lime text-bg font-sans font-bold text-sm whitespace-nowrap hover:scale-105 transition-transform glow-lime">
          Jetzt shoppen →
        </a>
      </div>
    </div>
  )
}
