"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const ORDERS = [
  {
    id: "WFF-2026-005", date: "04.06.2026", total: "12,99€",
    status: "Neu", statusColor: "text-cream/50 bg-cream/[0.06] border-cream/10",
    items: [{ name: "Purple Haze Blüten", qty: "5G", price: "12,99€" }],
    tracking: null,
  },
  {
    id: "WFF-2026-004", date: "03.06.2026", total: "29,99€",
    status: "Versandbereit", statusColor: "text-gold bg-gold/10 border-gold/20",
    items: [{ name: "Girl Scout Cookies Vape", qty: "1× 1ML", price: "29,99€" }],
    tracking: null,
  },
  {
    id: "WFF-2026-003", date: "01.06.2026", total: "51,96€",
    status: "Unterwegs", statusColor: "text-lime bg-lime/10 border-lime/20",
    items: [
      { name: "Gelato Pod (Elfbar)", qty: "3×", price: "38,97€" },
      { name: "Afghan Hasch", qty: "5G", price: "12,99€" },
    ],
    tracking: "1Z999AA10123456784",
  },
  {
    id: "WFF-2026-002", date: "22.05.2026", total: "32,94€",
    status: "Geliefert", statusColor: "text-lime/60 bg-lime/[0.06] border-lime/10",
    items: [
      { name: "Amnesia Haze Blüten", qty: "3G", price: "7,99€" },
      { name: "Cookies Pre-Roll", qty: "5×", price: "24,95€" },
    ],
    tracking: "1Z999AA10123456785",
  },
  {
    id: "WFF-2026-001", date: "15.05.2026", total: "59,98€",
    status: "Geliefert", statusColor: "text-lime/60 bg-lime/[0.06] border-lime/10",
    items: [{ name: "Northern Lights Vape", qty: "2×", price: "59,98€" }],
    tracking: "1Z999AA10123456786",
  },
]

export function Orders() {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-lime/60 mb-2">Konto</p>
        <h1 className="font-sans font-extrabold text-4xl text-cream">Bestellungen</h1>
      </div>

      <div className="space-y-3">
        {ORDERS.map((order) => (
          <div key={order.id} className="rounded-2xl border border-cream/[0.08] bg-cream/[0.02] overflow-hidden">
            {/* Header row */}
            <button
              onClick={() => setExpanded(expanded === order.id ? null : order.id)}
              className="w-full flex items-center justify-between p-5 hover:bg-cream/[0.02] transition-colors"
            >
              <div className="flex items-center gap-5 min-w-0">
                <div className="text-left">
                  <p className="font-sans font-bold text-sm text-cream">{order.id}</p>
                  <p className="font-mono text-[9px] text-cream/25 mt-0.5">{order.date}</p>
                </div>
                <div className="hidden sm:block text-left min-w-0">
                  <p className="font-sans text-xs text-cream/40 truncate max-w-[200px]">
                    {order.items.map(i => i.name).join(", ")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0 ml-3">
                <p className="font-sans font-bold text-sm text-cream">{order.total}</p>
                <span className={`font-mono text-[9px] tracking-widest uppercase px-2.5 py-1 rounded-full border ${order.statusColor}`}>
                  {order.status}
                </span>
                <svg
                  width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  className={`text-cream/20 transition-transform ${expanded === order.id ? "rotate-180" : ""}`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </button>

            {/* Expanded detail */}
            <AnimatePresence>
              {expanded === order.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 border-t border-cream/[0.06] pt-4 space-y-4">
                    {/* Items */}
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.name} className="flex items-center justify-between">
                          <div>
                            <p className="font-sans text-sm text-cream/70">{item.name}</p>
                            <p className="font-mono text-[9px] text-cream/25">{item.qty}</p>
                          </div>
                          <p className="font-sans font-bold text-sm text-cream">{item.price}</p>
                        </div>
                      ))}
                    </div>

                    {/* Tracking */}
                    {order.tracking && (
                      <div className="p-3 rounded-xl bg-lime/[0.04] border border-lime/15 flex items-center gap-3">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a0ba87" strokeWidth="1.8" strokeLinecap="round">
                          <path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3" />
                          <rect x="9" y="11" width="14" height="10" rx="2" />
                          <path d="M16 11v-3" />
                        </svg>
                        <div>
                          <p className="font-mono text-[9px] text-lime/60 tracking-widest uppercase">Tracking</p>
                          <p className="font-sans text-xs text-cream/60 mt-0.5">{order.tracking}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3 pt-2">
                      <button className="px-4 py-2 rounded-full border border-cream/15 text-cream/50 text-xs font-sans hover:text-cream hover:border-cream/30 transition-all">
                        Erneut bestellen
                      </button>
                      <button className="px-4 py-2 rounded-full border border-cream/10 text-cream/30 text-xs font-sans hover:text-cream/60 transition-all">
                        Rechnung
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  )
}
