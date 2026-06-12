"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import type { Profile } from "@/lib/hooks/useUser"

const TEXT   = "#35383f"
const MUTED  = "rgba(53,56,63,0.55)"
const DIM    = "rgba(53,56,63,0.10)"
const ACCENT = "#eddc8c"

const STATUS_STYLE: Record<string, React.CSSProperties> = {
  pending:    { background: "rgba(53,56,63,0.08)", color: MUTED },
  processing: { background: "rgba(237,220,140,0.22)", color: "#8a7b2a" },
  shipped:    { background: "rgba(53,56,63,0.12)", color: TEXT },
  delivered:  { background: "rgba(110,125,106,0.18)", color: "#4a5f46" },
  cancelled:  { background: "rgba(192,57,43,0.10)", color: "#c0392b" },
}
const STATUS_LABEL: Record<string, string> = {
  pending: "Neu", processing: "In Bearbeitung", shipped: "Unterwegs", delivered: "Geliefert", cancelled: "Storniert",
}

type OrderItem = { id: string; name: string; pack: string | null; price: number; qty: number }
type Order = {
  id: string; status: string; total: number; shipping_cost: number
  created_at: string; tracking_code: string | null
  order_items: OrderItem[]
}

interface Props { user: User | null; profile: Profile | null; signOut: () => void }

export function Orders({ user }: Props) {
  const supabase = createClient()
  const [orders,   setOrders]   = useState<Order[]>([])
  const [loading,  setLoading]  = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    supabase
      .from("orders")
      .select("id, status, total, shipping_cost, created_at, tracking_code, order_items(id, name, pack, price, qty)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => { setOrders(data ?? []); setLoading(false) })
  }, [user])

  return (
    <div className="space-y-8">

      <div>
        <p className="font-ekstra uppercase mb-2" style={{ fontSize: 11, letterSpacing: "0.30em", color: "rgba(53,56,63,0.40)" }}>Konto</p>
        <h1 className="font-druk-wide uppercase leading-none" style={{ fontSize: "clamp(2rem, 5vw, 4rem)", color: TEXT }}>
          Bestellungen
        </h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 rounded-full border-2 border-[#35383f] border-t-transparent animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="font-druk-wide uppercase" style={{ fontSize: "1.5rem", color: TEXT, marginBottom: 8 }}>Noch keine Bestellung.</p>
          <p className="font-ekstra" style={{ fontSize: "0.92rem", color: MUTED }}>Deine Bestellungen erscheinen hier.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const statusStyle = STATUS_STYLE[order.status] ?? STATUS_STYLE.pending
            const date = new Date(order.created_at).toLocaleDateString("de-DE")
            return (
              <div
                key={order.id}
                style={{ borderRadius: 16, background: "rgba(255,255,255,0.42)", border: "1px solid rgba(255,255,255,0.65)", overflow: "hidden" }}
              >
                <button
                  onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                  className="w-full flex items-center justify-between px-5 py-4"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="text-left">
                      <p className="font-druk-wide uppercase" style={{ fontSize: "0.82rem", color: TEXT }}>
                        {order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="font-ekstra mt-0.5" style={{ fontSize: 10, color: MUTED }}>{date}</p>
                    </div>
                    <p className="hidden sm:block font-ekstra truncate max-w-[200px]" style={{ fontSize: "0.82rem", color: MUTED }}>
                      {order.order_items?.map(i => i.name).join(", ") || "—"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-3">
                    <p className="font-druk-wide" style={{ fontSize: "0.92rem", color: TEXT }}>
                      {Number(order.total).toFixed(2).replace(".", ",")} €
                    </p>
                    <span
                      className="font-ekstra uppercase px-2.5 py-1 rounded-full"
                      style={{ fontSize: 9, letterSpacing: "0.16em", ...statusStyle }}
                    >
                      {STATUS_LABEL[order.status] ?? order.status}
                    </span>
                    <svg
                      width="13" height="13" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                      style={{ color: MUTED, transition: "transform 0.2s", transform: expanded === order.id ? "rotate(180deg)" : "none" }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </button>

                <AnimatePresence>
                  {expanded === order.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      style={{ overflow: "hidden" }}
                    >
                      <div className="px-5 pb-5 space-y-4" style={{ borderTop: `1px solid ${DIM}`, paddingTop: 16 }}>
                        {order.order_items?.map((item) => (
                          <div key={item.id} className="flex items-center justify-between">
                            <div>
                              <p className="font-ekstra" style={{ fontSize: "0.88rem", color: TEXT }}>{item.name}</p>
                              {item.pack && <p className="font-ekstra uppercase mt-0.5" style={{ fontSize: 9, letterSpacing: "0.18em", color: MUTED }}>{item.pack}{item.qty > 1 ? ` × ${item.qty}` : ""}</p>}
                            </div>
                            <p className="font-druk-wide" style={{ fontSize: "0.88rem", color: TEXT }}>
                              {(item.price * item.qty).toFixed(2).replace(".", ",")} €
                            </p>
                          </div>
                        ))}

                        {order.tracking_code && (
                          <div
                            className="flex items-center gap-3 p-3 rounded-xl"
                            style={{ background: "rgba(237,220,140,0.18)", border: `1px solid rgba(237,220,140,0.35)` }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={TEXT} strokeWidth="1.8" strokeLinecap="round">
                              <path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3" />
                              <rect x="9" y="11" width="14" height="10" rx="2" />
                            </svg>
                            <div>
                              <p className="font-ekstra uppercase" style={{ fontSize: 9, letterSpacing: "0.20em", color: MUTED }}>Tracking</p>
                              <p className="font-ekstra mt-0.5" style={{ fontSize: "0.82rem", color: TEXT }}>{order.tracking_code}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
