"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import type { User } from "@supabase/supabase-js"
import type { Profile } from "@/lib/hooks/useUser"

const TEXT   = "#35383f"
const MUTED  = "rgba(53,56,63,0.55)"
const DIM    = "rgba(53,56,63,0.10)"

const STATUS_STYLE: Record<string, React.CSSProperties> = {
  pending:    { background: "rgba(237,220,140,0.22)", color: "#8a7b2a" },
  paid:       { background: "rgba(110,125,106,0.18)", color: "#3d6639" },
  processing: { background: "rgba(237,220,140,0.22)", color: "#8a7b2a" },
  shipped:    { background: "rgba(53,56,63,0.12)", color: TEXT },
  delivered:  { background: "rgba(110,125,106,0.18)", color: "#4a5f46" },
  cancelled:  { background: "rgba(192,57,43,0.10)", color: "#c0392b" },
  failed:     { background: "rgba(192,57,43,0.10)", color: "#c0392b" },
}
const STATUS_LABEL: Record<string, string> = {
  pending: "Ausstehend", paid: "Bezahlt", processing: "In Bearbeitung",
  shipped: "Unterwegs", delivered: "Zugestellt", cancelled: "Fehlgeschlagen", failed: "Fehlgeschlagen",
}

type Order = {
  id: string; status: string; amount_cents: number; created_at: string
  line_items: { title: string; quantity: number }[]
}

interface Props { user: User | null; profile: Profile | null; signOut: () => void }

export function Dashboard({ user, profile }: Props) {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    if (!user) return
    fetch("/api/account/orders")
      .then(r => r.json())
      .then(data => setOrders((data?.orders ?? []).slice(0, 5)))
      .catch(() => {})
  }, [user])

  const firstName = profile?.first_name || user?.email?.split("@")[0] || "zurück"

  const STATS = [
    { label: "Bestellungen",  value: String(orders.length) },
    { label: "Treuepunkte",   value: String(profile?.loyalty_points ?? 0) + " WFF" },
    { label: "Mitglied seit", value: user ? new Date(user.created_at).toLocaleDateString("de-DE", { month: "short", year: "numeric" }) : "—" },
  ]

  return (
    <div className="space-y-10">

      <div>
        <p className="font-ekstra uppercase mb-2" style={{ fontSize: 11, letterSpacing: "0.30em", color: "rgba(53,56,63,0.40)" }}>
          Konto
        </p>
        <h1 className="font-druk-wide uppercase leading-none" style={{ fontSize: "clamp(0.85rem, 3.6vw, 4rem)", color: TEXT }}>
          Willkommen zurück, {firstName}.
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            style={{
              padding: "clamp(18px,3vh,28px)",
              borderRadius: 16,
              background: "rgba(255,255,255,0.48)",
              border: "1px solid rgba(255,255,255,0.70)",
            }}
          >
            <p className="font-druk-wide leading-none" style={{ fontSize: "clamp(1.5rem, 2.8vw, 2.2rem)", color: TEXT }}>
              {s.value}
            </p>
            <p className="font-ekstra uppercase mt-2" style={{ fontSize: 9, letterSpacing: "0.22em", color: MUTED }}>
              {s.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Recent orders */}
      <div>
        <div
          className="flex items-center justify-between mb-5"
          style={{ borderBottom: `1px solid ${DIM}`, paddingBottom: 14 }}
        >
          <h2 className="font-druk-wide uppercase" style={{ fontSize: "clamp(1.1rem, 1.8vw, 1.5rem)", color: TEXT }}>
            Letzte Bestellungen
          </h2>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-druk-wide uppercase" style={{ fontSize: "1.5rem", color: TEXT, marginBottom: 8 }}>
              Noch keine Bestellung.
            </p>
            <p className="font-ekstra" style={{ fontSize: "0.92rem", color: MUTED, lineHeight: 1.7 }}>
              Deine Bestellungen erscheinen hier sobald du etwas bestellt hast.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((o) => {
              const itemSummary = o.line_items?.map(i => i.quantity > 1 ? `${i.title} ×${i.quantity}` : i.title).join(", ") || "—"
              const style = STATUS_STYLE[o.status] ?? STATUS_STYLE.pending
              return (
                <div
                  key={o.id}
                  className="flex items-center gap-4 py-4 px-5 rounded-2xl"
                  style={{ background: "rgba(255,255,255,0.42)", border: "1px solid rgba(255,255,255,0.65)" }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-druk-wide uppercase" style={{ fontSize: "0.82rem", color: TEXT }}>
                      #{o.id.slice(0, 6).toUpperCase()}
                    </p>
                    <p className="font-ekstra mt-0.5 truncate" style={{ fontSize: "0.82rem", color: MUTED }}>
                      {itemSummary}
                    </p>
                  </div>
                  <p className="font-druk-wide shrink-0" style={{ fontSize: "0.92rem", color: TEXT }}>
                    {(o.amount_cents / 100).toFixed(2).replace(".", ",")} €
                  </p>
                  <span
                    className="font-ekstra uppercase shrink-0 hidden sm:inline-block px-3 py-1 rounded-full"
                    style={{ fontSize: 9, letterSpacing: "0.18em", ...style }}
                  >
                    {STATUS_LABEL[o.status] ?? o.status}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
