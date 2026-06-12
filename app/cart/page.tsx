"use client"

import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useCart } from "@/lib/cart"
import { Navbar } from "@/components/Navbar"

const TEXT   = "#35383f"
const MUTED  = "rgba(53,56,63,0.55)"
const DIM    = "rgba(53,56,63,0.12)"
const ACCENT = "#eddc8c"

const FREE_SHIPPING = 50

export default function CartPage() {
  const { state, dispatch, total, count } = useCart()
  const items    = state.items
  const shipping = total >= FREE_SHIPPING ? 0 : 4.99
  const grand    = total + shipping
  const missing  = FREE_SHIPPING - total

  return (
    <div style={{ background: "#bcc0ca", minHeight: "100vh", overflowX: "hidden" }}>
      <Navbar />

      <div
        className="max-w-6xl mx-auto"
        style={{ padding: "clamp(88px,14vh,156px) clamp(16px,5vw,80px) clamp(60px,10vh,120px)" }}
      >

        {/* ─── HEADER ─── */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{
            borderBottom: `1px solid ${DIM}`,
            paddingBottom: "clamp(18px,2.8vh,32px)",
            marginBottom: "clamp(24px,4vh,48px)",
          }}
        >
          <div className="flex items-baseline justify-between flex-wrap gap-3">
            <div className="flex items-baseline gap-3">
              <h1
                className="font-druk-wide uppercase leading-none"
                style={{ fontSize: "clamp(2rem, 8vw, 7.5rem)", letterSpacing: "-0.03em", color: TEXT }}
              >
                Warenkorb
              </h1>
              {count > 0 && (
                <span className="font-ekstra" style={{ fontSize: "clamp(0.78rem, 1vw, 0.9rem)", color: MUTED }}>
                  {count} Artikel
                </span>
              )}
            </div>
            <Link
              href="/vapes"
              className="font-ekstra uppercase"
              style={{ fontSize: 10, letterSpacing: "0.22em", color: MUTED, textDecoration: "none" }}
            >
              ← Weiter einkaufen
            </Link>
          </div>
        </motion.div>

        {items.length === 0 ? (

          /* ─── EMPTY STATE ─── */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="flex flex-col items-center justify-center text-center"
            style={{ paddingTop: "clamp(48px,8vh,100px)", paddingBottom: "clamp(48px,8vh,100px)" }}
          >
            <div
              className="mb-8 flex items-center justify-center"
              style={{
                width: 72, height: 72, borderRadius: "50%",
                background: "rgba(255,255,255,0.55)",
                border: `1.5px solid rgba(53,56,63,0.18)`,
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
            </div>
            <h2
              className="font-druk-wide uppercase leading-none mb-4"
              style={{ fontSize: "clamp(1.6rem, 4.5vw, 4rem)", letterSpacing: "-0.03em", color: TEXT }}
            >
              Noch leer.
            </h2>
            <p className="font-ekstra mb-8" style={{ fontSize: "0.9rem", color: MUTED, lineHeight: 1.75, maxWidth: 280 }}>
              Entdecke unsere Produkte und füge deine Favoriten hinzu.
            </p>
            <Link
              href="/vapes"
              className="font-ekstra uppercase rounded-full"
              style={{
                fontSize: 12, letterSpacing: "0.22em",
                background: TEXT, color: "#e8e4dc",
                padding: "14px 36px", textDecoration: "none",
              }}
            >
              Zum Shop
            </Link>
          </motion.div>

        ) : (

          /* ─── ITEMS + SUMMARY ─── */
          <div className="flex flex-col lg:grid lg:grid-cols-[1fr_320px] gap-6 lg:gap-12 items-start">

            {/* LEFT — items (renders first on mobile) */}
            <div>

              {/* Free shipping indicator */}
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.42)", border: `1px solid rgba(255,255,255,0.70)` }}
              >
                {total < FREE_SHIPPING ? (
                  <div className="flex flex-col gap-2.5">
                    <div className="flex justify-between items-center">
                      <p className="font-ekstra uppercase" style={{ fontSize: 10, letterSpacing: "0.20em", color: MUTED }}>
                        Kostenloser Versand
                      </p>
                      <p className="font-druk-wide" style={{ fontSize: "0.88rem", color: TEXT }}>
                        Noch {missing.toFixed(2).replace(".", ",")} €
                      </p>
                    </div>
                    <div style={{ height: 3, borderRadius: 9999, background: DIM, overflow: "hidden" }}>
                      <motion.div
                        style={{ height: "100%", background: ACCENT, borderRadius: 9999 }}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((total / FREE_SHIPPING) * 100, 100)}%` }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div
                      className="flex items-center justify-center shrink-0"
                      style={{ width: 24, height: 24, borderRadius: "50%", background: ACCENT }}
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={TEXT} strokeWidth="2.5" strokeLinecap="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                    <p className="font-ekstra uppercase" style={{ fontSize: 10, letterSpacing: "0.22em", color: TEXT }}>
                      Kostenloser Versand aktiviert
                    </p>
                  </div>
                )}
              </motion.div>

              {/* Item rows */}
              <p className="font-ekstra uppercase mb-3" style={{ fontSize: 10, letterSpacing: "0.26em", color: "rgba(53,56,63,0.35)" }}>
                Deine Artikel
              </p>
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.div
                    key={`${item.id}__${item.pack}`}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                    transition={{ duration: 0.22 }}
                    className="py-4"
                    style={{ borderBottom: `1px solid ${DIM}` }}
                  >
                    {/* Row 1: image + info */}
                    <div className="flex items-start gap-3">
                      {/* Image slot */}
                      <div
                        className="shrink-0 flex items-center justify-center"
                        style={{
                          width: 58, height: 58,
                          borderRadius: 12,
                          background: "rgba(255,255,255,0.60)",
                          border: `1px solid rgba(255,255,255,0.80)`,
                        }}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="1.4" strokeLinecap="round">
                          <rect x="3" y="3" width="18" height="18" rx="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                        </svg>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p
                          className="font-druk-wide uppercase leading-tight"
                          style={{ fontSize: "clamp(0.82rem, 1.2vw, 1rem)", color: TEXT, letterSpacing: "-0.01em" }}
                        >
                          {item.name}
                        </p>
                        <p className="font-ekstra uppercase mt-1" style={{ fontSize: 9, letterSpacing: "0.20em", color: MUTED }}>
                          {item.pack}
                        </p>
                        <p
                          className="font-druk-wide mt-1.5"
                          style={{ fontSize: "clamp(0.88rem, 1.1vw, 1rem)", color: TEXT }}
                        >
                          {(item.price * item.qty).toFixed(2).replace(".", ",")} €
                        </p>
                      </div>

                      {/* Remove (top right) */}
                      <button
                        onClick={() => dispatch({ type: "REMOVE", id: item.id, pack: item.pack })}
                        className="shrink-0 transition-opacity duration-150 hover:opacity-40"
                        style={{ color: MUTED, padding: 6 }}
                        aria-label="Entfernen"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                        </svg>
                      </button>
                    </div>

                    {/* Row 2: qty controls */}
                    <div className="flex items-center justify-end mt-3">
                      <div
                        className="flex items-center rounded-xl overflow-hidden"
                        style={{ border: `1px solid rgba(53,56,63,0.18)`, background: "rgba(255,255,255,0.60)" }}
                      >
                        <button
                          onClick={() => dispatch({ type: "SET_QTY", id: item.id, pack: item.pack, qty: item.qty - 1 })}
                          className="flex items-center justify-center transition-all duration-150"
                          style={{ width: 36, height: 36, color: TEXT, fontSize: 18, lineHeight: 1 }}
                        >
                          −
                        </button>
                        <span
                          className="font-ekstra"
                          style={{ minWidth: 28, textAlign: "center", color: TEXT, fontSize: "0.85rem", borderLeft: `1px solid rgba(53,56,63,0.12)`, borderRight: `1px solid rgba(53,56,63,0.12)`, height: 36, lineHeight: "36px" }}
                        >
                          {item.qty}
                        </span>
                        <button
                          onClick={() => dispatch({ type: "SET_QTY", id: item.id, pack: item.pack, qty: item.qty + 1 })}
                          className="flex items-center justify-center transition-all duration-150"
                          style={{ width: 36, height: 36, color: TEXT, fontSize: 18, lineHeight: 1 }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* RIGHT — order summary */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="lg:sticky w-full"
              style={{ top: "calc(64px + 24px)" }}
            >
              <div
                style={{
                  background: "rgba(255,255,255,0.48)",
                  borderRadius: 20,
                  border: `1px solid rgba(255,255,255,0.72)`,
                  padding: "clamp(22px,3vh,36px)",
                }}
              >
                <p className="font-ekstra uppercase mb-1" style={{ fontSize: 10, letterSpacing: "0.28em", color: "rgba(53,56,63,0.38)" }}>
                  Bestellübersicht
                </p>
                <div style={{ height: 1, background: DIM, marginBottom: 18, marginTop: 10 }} />

                <div className="space-y-3 mb-5">
                  <div className="flex justify-between">
                    <span className="font-ekstra" style={{ fontSize: "0.88rem", color: MUTED }}>Zwischensumme</span>
                    <span className="font-druk-wide" style={{ fontSize: "0.92rem", color: TEXT }}>
                      {total.toFixed(2).replace(".", ",")} €
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-ekstra" style={{ fontSize: "0.88rem", color: MUTED }}>Versand</span>
                    <span className="font-druk-wide" style={{ fontSize: "0.92rem", color: TEXT }}>
                      {shipping === 0 ? "Gratis" : `${shipping.toFixed(2).replace(".", ",")} €`}
                    </span>
                  </div>
                  <div style={{ height: 1, background: DIM }} />
                  <div className="flex justify-between items-baseline pt-1">
                    <span className="font-ekstra" style={{ fontSize: "0.88rem", color: TEXT }}>Gesamt</span>
                    <span className="font-druk-wide" style={{ fontSize: "clamp(1.2rem, 2vw, 1.6rem)", color: TEXT }}>
                      {grand.toFixed(2).replace(".", ",")} €
                    </span>
                  </div>
                  <p className="font-ekstra" style={{ fontSize: 9, letterSpacing: "0.16em", color: "rgba(53,56,63,0.32)", textTransform: "uppercase" }}>
                    inkl. MwSt.
                  </p>
                </div>

                {/* Coupon */}
                <div style={{ height: 1, background: DIM, marginBottom: 14 }} />
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="Gutscheincode"
                    className="flex-1 min-w-0 px-4 py-3 rounded-xl placeholder:opacity-40 font-ekstra"
                    style={{
                      fontSize: "max(16px, 0.875rem)",
                      background: "rgba(255,255,255,0.72)",
                      border: `1.5px solid rgba(53,56,63,0.20)`,
                      color: TEXT,
                      outline: "none",
                    }}
                  />
                  <button
                    className="font-ekstra uppercase rounded-xl shrink-0 transition-opacity"
                    style={{
                      padding: "0 14px",
                      background: "rgba(255,255,255,0.72)",
                      border: `1.5px solid rgba(53,56,63,0.20)`,
                      color: MUTED,
                      fontSize: 11,
                      letterSpacing: "0.16em",
                    }}
                  >
                    OK
                  </button>
                </div>

                {/* CTA */}
                <button
                  className="w-full py-4 font-ekstra uppercase rounded-full transition-all duration-200"
                  style={{ background: TEXT, color: "#e8e4dc", letterSpacing: "0.20em", fontSize: 13 }}
                >
                  Zur Kasse
                </button>

                {/* Trust */}
                <div className="flex justify-center gap-4 mt-5">
                  {["SSL gesichert", "Diskret", "EU-Versand"].map(t => (
                    <span key={t} className="font-ekstra uppercase" style={{ fontSize: 8, letterSpacing: "0.16em", color: "rgba(53,56,63,0.28)" }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

          </div>
        )}
      </div>
    </div>
  )
}
