"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { User } from "@supabase/supabase-js"
import type { Profile } from "@/lib/hooks/useUser"

const TEXT   = "#35383f"
const MUTED  = "rgba(53,56,63,0.55)"
const DIM    = "rgba(53,56,63,0.10)"
const ACCENT = "#eddc8c"

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
  pending:    "Ausstehend",
  paid:       "Bezahlt",
  processing: "In Bearbeitung",
  shipped:    "Unterwegs",
  delivered:  "Zugestellt",
  cancelled:  "Fehlgeschlagen",
  failed:     "Fehlgeschlagen",
}

type LineItem = { title: string; variant_title?: string; price: string; quantity: number }
type ShippingAddress = {
  first_name: string; last_name: string
  address1: string; address2?: string
  city: string; zip: string; country: string; phone?: string
}
type Order = {
  id: string; status: string; amount_cents: number
  line_items: LineItem[]; shipping_address: ShippingAddress
  shipping_price: string; created_at: string
  shopify_order_id?: number | null
}

interface Props { user: User | null; profile: Profile | null; signOut: () => void }
type RetryState = { status: "idle" } | { status: "loading"; msg: string } | { status: "error"; msg: string }

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("de-DE", { day: "numeric", month: "short", year: "numeric" })
}

function formatEur(cents: number) {
  return (cents / 100).toFixed(2).replace(".", ",") + " €"
}

// ── Order Detail View ──────────────────────────────────────────────────────
function OrderDetail({
  order,
  onBack,
  retryState,
  onRetry,
}: {
  order: Order
  onBack: () => void
  retryState: RetryState
  onRetry: () => void
}) {
  const isFailed = order.status === "cancelled" || order.status === "failed"
  const addr = order.shipping_address
  const subtotalCents = order.line_items.reduce(
    (sum, i) => sum + Math.round(parseFloat(i.price) * 100 * i.quantity), 0
  )
  const shippingCents = Math.round(parseFloat(order.shipping_price || "0") * 100)

  return (
    <motion.div
      key="detail"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="flex items-center justify-center shrink-0"
          style={{
            width: 38, height: 38, borderRadius: "50%",
            background: "rgba(255,255,255,0.50)", border: "1px solid rgba(255,255,255,0.72)",
          }}
          aria-label="Zurück"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={TEXT} strokeWidth="2" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div>
          <p className="font-ekstra uppercase" style={{ fontSize: 11, letterSpacing: "0.30em", color: "rgba(53,56,63,0.40)" }}>
            Konto · Bestellungen
          </p>
          <h1 className="font-druk-wide uppercase leading-none" style={{ fontSize: "clamp(0.85rem, 3.6vw, 3rem)", color: TEXT }}>
            #{order.id.slice(0, 8).toUpperCase()}
          </h1>
        </div>
      </div>

      <div className="space-y-4">
        {/* Meta */}
        <div
          className="flex items-center justify-between px-5 py-4 rounded-2xl"
          style={{ background: "rgba(255,255,255,0.48)", border: "1px solid rgba(255,255,255,0.70)" }}
        >
          <div>
            <p className="font-ekstra uppercase" style={{ fontSize: 9, letterSpacing: "0.22em", color: MUTED }}>
              Bestelldatum
            </p>
            <p className="font-ekstra mt-1" style={{ fontSize: "0.9rem", color: TEXT }}>
              {formatDate(order.created_at)}
            </p>
          </div>
          <span
            className="font-ekstra uppercase px-3 py-1.5 rounded-full"
            style={{ fontSize: 9, letterSpacing: "0.18em", ...(STATUS_STYLE[order.status] ?? STATUS_STYLE.pending) }}
          >
            {STATUS_LABEL[order.status] ?? order.status}
          </span>
        </div>

        {/* Products */}
        <div
          style={{ borderRadius: 16, background: "rgba(255,255,255,0.48)", border: "1px solid rgba(255,255,255,0.70)", overflow: "hidden" }}
        >
          <div className="px-5 pt-4 pb-2" style={{ borderBottom: `1px solid ${DIM}` }}>
            <p className="font-ekstra uppercase" style={{ fontSize: 9, letterSpacing: "0.22em", color: MUTED }}>
              Produkte
            </p>
          </div>
          <div className="px-5 py-4 space-y-3">
            {order.line_items.map((item, idx) => (
              <div key={idx} className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-ekstra" style={{ fontSize: "0.9rem", color: TEXT }}>{item.title}</p>
                  {item.variant_title && (
                    <p className="font-ekstra uppercase mt-0.5" style={{ fontSize: 9, letterSpacing: "0.18em", color: MUTED }}>
                      {item.variant_title}
                      {item.quantity > 1 && ` · ${item.quantity}×`}
                    </p>
                  )}
                  {!item.variant_title && item.quantity > 1 && (
                    <p className="font-ekstra uppercase mt-0.5" style={{ fontSize: 9, letterSpacing: "0.18em", color: MUTED }}>
                      {item.quantity}×
                    </p>
                  )}
                </div>
                <p className="font-druk-wide shrink-0" style={{ fontSize: "0.9rem", color: TEXT }}>
                  {(parseFloat(item.price) * item.quantity).toFixed(2).replace(".", ",")} €
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping address */}
        {addr && (
          <div
            style={{ borderRadius: 16, background: "rgba(255,255,255,0.48)", border: "1px solid rgba(255,255,255,0.70)", overflow: "hidden" }}
          >
            <div className="px-5 pt-4 pb-2" style={{ borderBottom: `1px solid ${DIM}` }}>
              <p className="font-ekstra uppercase" style={{ fontSize: 9, letterSpacing: "0.22em", color: MUTED }}>
                Lieferadresse
              </p>
            </div>
            <div className="px-5 py-4">
              <p className="font-ekstra" style={{ fontSize: "0.9rem", color: TEXT, lineHeight: 1.7 }}>
                {addr.first_name} {addr.last_name}<br />
                {addr.address1}{addr.address2 ? `, ${addr.address2}` : ""}<br />
                {addr.zip} {addr.city}<br />
                {addr.country}
              </p>
              {addr.phone && (
                <p className="font-ekstra mt-2" style={{ fontSize: "0.82rem", color: MUTED }}>{addr.phone}</p>
              )}
            </div>
          </div>
        )}

        {/* Totals */}
        <div
          style={{ borderRadius: 16, background: "rgba(255,255,255,0.48)", border: "1px solid rgba(255,255,255,0.70)", overflow: "hidden" }}
        >
          <div className="px-5 pt-4 pb-2" style={{ borderBottom: `1px solid ${DIM}` }}>
            <p className="font-ekstra uppercase" style={{ fontSize: 9, letterSpacing: "0.22em", color: MUTED }}>
              Zusammenfassung
            </p>
          </div>
          <div className="px-5 py-4 space-y-2">
            <div className="flex justify-between">
              <p className="font-ekstra" style={{ fontSize: "0.88rem", color: MUTED }}>Zwischensumme</p>
              <p className="font-ekstra" style={{ fontSize: "0.88rem", color: TEXT }}>{formatEur(subtotalCents)}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-ekstra" style={{ fontSize: "0.88rem", color: MUTED }}>Versand</p>
              <p className="font-ekstra" style={{ fontSize: "0.88rem", color: TEXT }}>
                {shippingCents === 0 ? "Kostenlos" : formatEur(shippingCents)}
              </p>
            </div>
            <div className="flex justify-between pt-2" style={{ borderTop: `1px solid ${DIM}` }}>
              <p className="font-druk-wide uppercase" style={{ fontSize: "0.88rem", color: TEXT }}>Gesamt</p>
              <p className="font-druk-wide" style={{ fontSize: "0.88rem", color: TEXT }}>{formatEur(order.amount_cents)}</p>
            </div>
          </div>
        </div>

        {/* Failed — retry */}
        {isFailed && (
          <div className="space-y-2 pt-1">
            {retryState.status === "error" && (
              <p className="font-ekstra px-1" style={{ fontSize: "0.82rem", color: "#e85c5c" }}>{retryState.msg}</p>
            )}
            <button
              onClick={onRetry}
              disabled={retryState.status === "loading"}
              className="w-full font-ekstra uppercase rounded-full"
              style={{
                background: retryState.status === "loading" ? "rgba(53,56,63,0.35)" : TEXT,
                color: "#e8e4dc",
                padding: "14px 24px",
                fontSize: 12,
                letterSpacing: "0.20em",
                border: "none",
                cursor: retryState.status === "loading" ? "not-allowed" : "pointer",
              }}
            >
              {retryState.status === "loading" ? retryState.msg : "Erneut bezahlen →"}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ── Order Row (list item) ──────────────────────────────────────────────────
function OrderRow({ order, onClick }: { order: Order; onClick: () => void }) {
  const isFailed = order.status === "cancelled" || order.status === "failed"
  const productSummary = order.line_items?.map(i =>
    i.quantity > 1 ? `${i.title} ×${i.quantity}` : i.title
  ).join(", ") || "—"

  return (
    <button
      onClick={onClick}
      className="w-full text-left"
      style={{
        borderRadius: 16,
        background: "rgba(255,255,255,0.42)",
        border: isFailed ? "1px solid rgba(232,92,92,0.25)" : "1px solid rgba(255,255,255,0.65)",
        overflow: "hidden",
        display: "block",
      }}
    >
      <div className="flex items-center gap-4 px-5 py-4">
        {/* Left: order # + date */}
        <div className="shrink-0 text-left" style={{ minWidth: 72 }}>
          <p className="font-druk-wide uppercase" style={{ fontSize: "0.82rem", color: TEXT }}>
            #{order.id.slice(0, 6).toUpperCase()}
          </p>
          <p className="font-ekstra mt-0.5" style={{ fontSize: 10, color: MUTED }}>
            {formatDate(order.created_at)}
          </p>
        </div>

        {/* Middle: product summary */}
        <p className="font-ekstra flex-1 min-w-0 truncate" style={{ fontSize: "0.82rem", color: MUTED }}>
          {productSummary}
        </p>

        {/* Right: price + status + chevron */}
        <div className="flex items-center gap-3 shrink-0">
          <p className="font-druk-wide" style={{ fontSize: "0.92rem", color: TEXT }}>
            {formatEur(order.amount_cents)}
          </p>
          <span
            className="font-ekstra uppercase hidden sm:inline-block px-2.5 py-1 rounded-full"
            style={{ fontSize: 9, letterSpacing: "0.16em", ...(STATUS_STYLE[order.status] ?? STATUS_STYLE.pending) }}
          >
            {STATUS_LABEL[order.status] ?? order.status}
          </span>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="2" strokeLinecap="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </div>
    </button>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────
export function Orders({ user }: Props) {
  const [orders,      setOrders]      = useState<Order[]>([])
  const [loading,     setLoading]     = useState(true)
  const [selectedId,  setSelectedId]  = useState<string | null>(null)
  const [retryStates, setRetryStates] = useState<Record<string, RetryState>>({})

  useEffect(() => {
    if (!user) return
    fetch("/api/account/orders")
      .then(r => r.json())
      .then(data => setOrders(data?.orders ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user])

  async function handleRetry(orderId: string) {
    setRetryStates(s => ({ ...s, [orderId]: { status: "loading", msg: "Neue Zahlung wird vorbereitet …" } }))
    try {
      const res  = await fetch("/api/checkout/retry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_token: orderId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Fehler")

      setRetryStates(s => ({ ...s, [orderId]: { status: "loading", msg: "Checkout wird geöffnet …" } }))
      let url: string | null = null
      for (let i = 0; i < 30; i++) {
        await new Promise(r => setTimeout(r, 1500))
        const s = await (await fetch(`/api/checkout/status?token=${data.order_token}`)).json()
        if (s.ready && s.url) { url = s.url; break }
      }
      if (!url) throw new Error("Zeitüberschreitung — bitte erneut versuchen.")
      window.location.href = url
    } catch (err) {
      setRetryStates(s => ({ ...s, [orderId]: { status: "error", msg: err instanceof Error ? err.message : "Fehler" } }))
    }
  }

  const selectedOrder = selectedId ? orders.find(o => o.id === selectedId) ?? null : null

  return (
    <div>
      <AnimatePresence mode="wait">
        {selectedOrder ? (
          <OrderDetail
            key={`detail-${selectedOrder.id}`}
            order={selectedOrder}
            onBack={() => setSelectedId(null)}
            retryState={retryStates[selectedOrder.id] ?? { status: "idle" }}
            onRetry={() => handleRetry(selectedOrder.id)}
          />
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-8">
              <p className="font-ekstra uppercase mb-2" style={{ fontSize: 11, letterSpacing: "0.30em", color: "rgba(53,56,63,0.40)" }}>
                Konto
              </p>
              <h1 className="font-druk-wide uppercase leading-none" style={{ fontSize: "clamp(0.85rem, 3.6vw, 4rem)", color: TEXT }}>
                Bestellungen
              </h1>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-6 h-6 rounded-full border-2 border-[#35383f] border-t-transparent animate-spin" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-druk-wide uppercase" style={{ fontSize: "1.5rem", color: TEXT, marginBottom: 8 }}>
                  Noch keine Bestellung.
                </p>
                <p className="font-ekstra" style={{ fontSize: "0.92rem", color: MUTED }}>
                  Deine Bestellungen erscheinen hier.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order, i) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <OrderRow order={order} onClick={() => setSelectedId(order.id)} />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
