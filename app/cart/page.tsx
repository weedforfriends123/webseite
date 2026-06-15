"use client"

import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useCart } from "@/lib/cart"
import { Navbar } from "@/components/Navbar"

const TEXT   = "#35383f"
const MUTED  = "rgba(53,56,63,0.52)"
const DIM    = "rgba(53,56,63,0.10)"
const ACCENT = "#a0ba87"

const FREE_SHIPPING = 50

export default function CartPage() {
  const { state, dispatch, total, count } = useCart()
  const items    = state.items
  const shipping = total >= FREE_SHIPPING ? 0 : 4.99
  const grand    = total + shipping
  const progress = Math.min((total / FREE_SHIPPING) * 100, 100)
  const missing  = FREE_SHIPPING - total

  return (
    <div style={{ background: "#bcc0ca", minHeight: "100vh" }}>
      <Navbar />

      <div
        className="max-w-6xl mx-auto"
        style={{ padding: "clamp(100px,15vh,160px) clamp(20px,5vw,80px) clamp(80px,12vh,140px)" }}
      >

        {/* ─── HEADER ─── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-end justify-between flex-wrap gap-4"
          style={{ marginBottom: "clamp(32px,5vh,60px)" }}
        >
          <div className="flex items-baseline gap-4">
            <h1
              className="font-druk-wide uppercase leading-none"
              style={{ fontSize: "clamp(2.8rem, 9vw, 8rem)", letterSpacing: "-0.03em", color: TEXT }}
            >
              Warenkorb
            </h1>
            {count > 0 && (
              <span
                className="font-ekstra uppercase"
                style={{ fontSize: "clamp(0.9rem, 1.2vw, 1.1rem)", color: MUTED, letterSpacing: "0.12em" }}
              >
                {count} {count === 1 ? "Artikel" : "Artikel"}
              </span>
            )}
          </div>
          <Link
            href="/vapes"
            className="font-ekstra uppercase"
            style={{ fontSize: 12, letterSpacing: "0.22em", color: MUTED, textDecoration: "none" }}
          >
            ← Weiter einkaufen
          </Link>
        </motion.div>

        {items.length === 0 ? (

          /* ─── EMPTY STATE ─── */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="flex flex-col items-center justify-center text-center"
            style={{ paddingTop: "clamp(60px,10vh,120px)", paddingBottom: "clamp(60px,10vh,120px)" }}
          >
            <div
              className="mb-10 flex items-center justify-center"
              style={{
                width: 88, height: 88, borderRadius: "50%",
                background: "rgba(255,255,255,0.50)",
                border: "1.5px solid rgba(255,255,255,0.80)",
              }}
            >
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
            </div>
            <h2
              className="font-druk-wide uppercase leading-none mb-5"
              style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)", letterSpacing: "-0.03em", color: TEXT }}
            >
              Noch leer.
            </h2>
            <p className="font-ekstra mb-10" style={{ fontSize: "1rem", color: MUTED, lineHeight: 1.8, maxWidth: 300 }}>
              Entdecke unsere Produkte und füge deine Favoriten hinzu.
            </p>
            <Link
              href="/vapes"
              className="font-ekstra uppercase rounded-full"
              style={{
                fontSize: 13, letterSpacing: "0.22em",
                background: TEXT, color: "#e8e4dc",
                padding: "16px 40px", textDecoration: "none",
              }}
            >
              Zum Shop
            </Link>
          </motion.div>

        ) : (

          /* ─── ITEMS + SUMMARY ─── */
          <div className="flex flex-col lg:grid lg:grid-cols-[1fr_360px] gap-8 lg:gap-14 items-start">

            {/* LEFT — items */}
            <div>

              {/* Free shipping bar */}
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-5 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.48)", border: "1px solid rgba(255,255,255,0.76)" }}
              >
                {total < FREE_SHIPPING ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <p className="font-ekstra uppercase" style={{ fontSize: 11, letterSpacing: "0.20em", color: MUTED }}>
                        Kostenloser Versand
                      </p>
                      <p className="font-druk-wide" style={{ fontSize: "1rem", color: TEXT }}>
                        Noch {missing.toFixed(2).replace(".", ",")} €
                      </p>
                    </div>
                    <div style={{ height: 4, borderRadius: 9999, background: DIM, overflow: "hidden" }}>
                      <motion.div
                        style={{ height: "100%", background: ACCENT, borderRadius: 9999 }}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div
                      className="flex items-center justify-center shrink-0"
                      style={{ width: 28, height: 28, borderRadius: "50%", background: ACCENT }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2a3020" strokeWidth="2.5" strokeLinecap="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                    <p className="font-ekstra uppercase" style={{ fontSize: 12, letterSpacing: "0.22em", color: TEXT }}>
                      Kostenloser Versand aktiviert
                    </p>
                  </div>
                )}
              </motion.div>

              {/* Item rows */}
              <AnimatePresence initial={false}>
                {items.map((item, i) => (
                  <motion.div
                    key={`${item.id}__${item.pack}`}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                    transition={{ duration: 0.24, delay: i * 0.04 }}
                    style={{ borderBottom: `1.5px solid ${DIM}`, paddingBottom: 24, marginBottom: 24 }}
                  >
                    <div className="flex items-start gap-5">
                      {/* Image */}
                      <div
                        className="shrink-0 flex items-center justify-center"
                        style={{
                          width: 80, height: 80, borderRadius: 16,
                          background: "rgba(255,255,255,0.62)",
                          border: "1px solid rgba(255,255,255,0.90)",
                          fontSize: 28,
                        }}
                      >
                        🌿
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p
                          className="font-druk-wide uppercase leading-tight"
                          style={{ fontSize: "clamp(1rem, 1.6vw, 1.25rem)", color: TEXT, letterSpacing: "-0.01em" }}
                        >
                          {item.name}
                        </p>
                        <p className="font-ekstra uppercase mt-1.5" style={{ fontSize: 11, letterSpacing: "0.20em", color: MUTED }}>
                          {item.pack}
                        </p>
                        <p
                          className="font-druk-wide mt-3"
                          style={{ fontSize: "clamp(1.1rem, 1.8vw, 1.35rem)", color: TEXT }}
                        >
                          {(item.price * item.qty).toFixed(2).replace(".", ",")} €
                        </p>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => dispatch({ type: "REMOVE", id: item.id, pack: item.pack })}
                        className="shrink-0 hover:opacity-40 transition-opacity"
                        style={{ color: MUTED, padding: 6, marginTop: 2 }}
                        aria-label="Entfernen"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                        </svg>
                      </button>
                    </div>

                    {/* Qty */}
                    <div className="flex items-center justify-end mt-4">
                      <div
                        className="flex items-center rounded-2xl overflow-hidden"
                        style={{ border: "1.5px solid rgba(53,56,63,0.16)", background: "rgba(255,255,255,0.65)" }}
                      >
                        <button
                          onClick={() => dispatch({ type: "SET_QTY", id: item.id, pack: item.pack, qty: item.qty - 1 })}
                          className="flex items-center justify-center"
                          style={{ width: 44, height: 44, color: TEXT, fontSize: 20, lineHeight: 1 }}
                        >
                          −
                        </button>
                        <span
                          className="font-druk-wide"
                          style={{
                            minWidth: 36, textAlign: "center", color: TEXT,
                            fontSize: "1rem",
                            borderLeft: "1.5px solid rgba(53,56,63,0.10)",
                            borderRight: "1.5px solid rgba(53,56,63,0.10)",
                            height: 44, lineHeight: "44px",
                          }}
                        >
                          {item.qty}
                        </span>
                        <button
                          onClick={() => dispatch({ type: "SET_QTY", id: item.id, pack: item.pack, qty: item.qty + 1 })}
                          className="flex items-center justify-center"
                          style={{ width: 44, height: 44, color: TEXT, fontSize: 20, lineHeight: 1 }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* RIGHT — summary */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="lg:sticky w-full"
              style={{ top: "calc(72px + 28px)" }}
            >
              <div
                style={{
                  background: "rgba(255,255,255,0.50)",
                  borderRadius: 24,
                  border: "1px solid rgba(255,255,255,0.80)",
                  padding: "clamp(24px,3.5vh,40px)",
                }}
              >
                <p className="font-ekstra uppercase mb-5" style={{ fontSize: 11, letterSpacing: "0.28em", color: "rgba(53,56,63,0.38)" }}>
                  Bestellübersicht
                </p>

                {/* Line items recap */}
                <div style={{ marginBottom: 20, display: "flex", flexDirection: "column", gap: 12 }}>
                  {items.map(item => (
                    <div key={`${item.id}__${item.pack}`} className="flex justify-between items-start gap-3">
                      <div>
                        <p className="font-ekstra" style={{ fontSize: "0.92rem", color: TEXT, lineHeight: 1.4 }}>
                          {item.name}
                        </p>
                        <p className="font-ekstra uppercase" style={{ fontSize: 10, letterSpacing: "0.14em", color: MUTED }}>
                          {item.pack} · ×{item.qty}
                        </p>
                      </div>
                      <p className="font-druk-wide shrink-0" style={{ fontSize: "0.95rem", color: TEXT }}>
                        {(item.price * item.qty).toFixed(2).replace(".", ",")} €
                      </p>
                    </div>
                  ))}
                </div>

                <div style={{ height: 1.5, background: DIM, marginBottom: 16 }} />

                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                  <div className="flex justify-between items-center">
                    <span className="font-ekstra" style={{ fontSize: "0.95rem", color: MUTED }}>Zwischensumme</span>
                    <span className="font-druk-wide" style={{ fontSize: "1rem", color: TEXT }}>
                      {total.toFixed(2).replace(".", ",")} €
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-ekstra" style={{ fontSize: "0.95rem", color: MUTED }}>Versand</span>
                    <span className="font-druk-wide" style={{ fontSize: "1rem", color: shipping === 0 ? ACCENT : TEXT }}>
                      {shipping === 0 ? "Gratis" : `${shipping.toFixed(2).replace(".", ",")} €`}
                    </span>
                  </div>
                </div>

                <div style={{ height: 1.5, background: DIM, marginBottom: 20 }} />

                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-ekstra uppercase" style={{ fontSize: "0.95rem", color: TEXT, letterSpacing: "0.06em" }}>Gesamt</span>
                  <span className="font-druk-wide" style={{ fontSize: "clamp(1.6rem, 2.8vw, 2.1rem)", color: TEXT, letterSpacing: "-0.02em" }}>
                    {grand.toFixed(2).replace(".", ",")} €
                  </span>
                </div>
                <p className="font-ekstra mb-6" style={{ fontSize: 10, letterSpacing: "0.16em", color: "rgba(53,56,63,0.30)", textTransform: "uppercase" }}>
                  inkl. MwSt.
                </p>

                {/* Coupon */}
                <div className="flex gap-2 mb-6">
                  <input
                    type="text"
                    placeholder="Gutscheincode"
                    className="flex-1 min-w-0 rounded-xl placeholder:opacity-40 font-ekstra"
                    style={{
                      padding: "13px 16px",
                      fontSize: "max(16px, 0.9rem)",
                      background: "rgba(255,255,255,0.70)",
                      border: "1.5px solid rgba(53,56,63,0.18)",
                      color: TEXT, outline: "none",
                    }}
                  />
                  <button
                    className="font-ekstra uppercase rounded-xl shrink-0"
                    style={{
                      padding: "0 18px",
                      background: "rgba(255,255,255,0.70)",
                      border: "1.5px solid rgba(53,56,63,0.18)",
                      color: MUTED, fontSize: 12, letterSpacing: "0.16em",
                    }}
                  >
                    OK
                  </button>
                </div>

                {/* CTA */}
                <Link
                  href="/checkout"
                  className="flex items-center justify-center w-full font-ekstra uppercase rounded-full"
                  style={{
                    height: 58, background: TEXT, color: "#e8e4dc",
                    letterSpacing: "0.22em", fontSize: 14, textDecoration: "none",
                    boxShadow: "0 6px 24px rgba(53,56,63,0.18)",
                  }}
                >
                  Zur Kasse →
                </Link>

                <div className="flex justify-center gap-5 mt-5">
                  {["SSL gesichert", "Diskret", "EU-Versand"].map(t => (
                    <span key={t} className="font-ekstra uppercase" style={{ fontSize: 9, letterSpacing: "0.16em", color: "rgba(53,56,63,0.28)" }}>
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
