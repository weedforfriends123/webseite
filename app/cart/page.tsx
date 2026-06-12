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
    <div style={{ background: "#bcc0ca", minHeight: "100vh" }}>
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
          className="flex items-baseline justify-between flex-wrap gap-4"
          style={{
            borderBottom: `1px solid ${DIM}`,
            paddingBottom: "clamp(24px,3.5vh,36px)",
            marginBottom: "clamp(32px,5vh,56px)",
          }}
        >
          <div className="flex items-baseline gap-5">
            <h1
              className="font-druk-wide uppercase leading-none"
              style={{ fontSize: "clamp(2.8rem, 9vw, 7.5rem)", letterSpacing: "-0.03em", color: TEXT }}
            >
              Warenkorb
            </h1>
            {count > 0 && (
              <span className="font-ekstra" style={{ fontSize: "clamp(0.88rem, 1.2vw, 1rem)", color: MUTED }}>
                {count} {count === 1 ? "Artikel" : "Artikel"}
              </span>
            )}
          </div>
          <Link
            href="/vapes"
            className="font-ekstra uppercase"
            style={{ fontSize: 10, letterSpacing: "0.26em", color: MUTED, textDecoration: "none" }}
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
                width: 84, height: 84, borderRadius: "50%",
                background: "rgba(255,255,255,0.55)",
                border: `1.5px solid rgba(53,56,63,0.18)`,
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
            </div>
            <h2
              className="font-druk-wide uppercase leading-none mb-4"
              style={{ fontSize: "clamp(2rem, 4.5vw, 4rem)", letterSpacing: "-0.03em", color: TEXT }}
            >
              Noch leer.
            </h2>
            <p className="font-ekstra mb-10" style={{ fontSize: "0.95rem", color: MUTED, lineHeight: 1.78, maxWidth: 320 }}>
              Entdecke unsere Produkte und füge deine Favoriten hinzu.
            </p>
            <Link
              href="/vapes"
              className="font-ekstra uppercase rounded-full"
              style={{
                fontSize: 12, letterSpacing: "0.22em",
                background: TEXT, color: "#e8e4dc",
                padding: "15px 40px", textDecoration: "none",
              }}
            >
              Zum Shop
            </Link>
          </motion.div>

        ) : (

          /* ─── ITEMS + SUMMARY ─── */
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 lg:gap-14 items-start">

            {/* LEFT — items */}
            <div className="order-2 lg:order-1">

              {/* Free shipping indicator */}
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-5 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.42)", border: `1px solid rgba(255,255,255,0.70)` }}
              >
                {total < FREE_SHIPPING ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <p className="font-ekstra uppercase" style={{ fontSize: 11, letterSpacing: "0.24em", color: MUTED }}>
                        Kostenloser Versand
                      </p>
                      <p className="font-druk-wide" style={{ fontSize: "0.92rem", color: TEXT }}>
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
                      style={{ width: 26, height: 26, borderRadius: "50%", background: ACCENT }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={TEXT} strokeWidth="2.5" strokeLinecap="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                    <p className="font-ekstra uppercase" style={{ fontSize: 11, letterSpacing: "0.24em", color: TEXT }}>
                      Kostenloser Versand aktiviert
                    </p>
                  </div>
                )}
              </motion.div>

              {/* Item rows */}
              <p className="font-ekstra uppercase mb-4" style={{ fontSize: 10, letterSpacing: "0.28em", color: "rgba(53,56,63,0.35)" }}>
                Deine Artikel
              </p>
              <div>
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.div
                      key={`${item.id}__${item.pack}`}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                      transition={{ duration: 0.22 }}
                      className="flex items-start gap-3 sm:gap-5 py-5 sm:py-6"
                      style={{ borderBottom: `1px solid ${DIM}` }}
                    >
                      {/* Image slot */}
                      <div
                        className="shrink-0 flex items-center justify-center"
                        style={{
                          width: "clamp(56px,7vw,80px)", height: "clamp(56px,7vw,80px)",
                          borderRadius: 14,
                          background: "rgba(255,255,255,0.60)",
                          border: `1px solid rgba(255,255,255,0.80)`,
                        }}
                      >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="1.4" strokeLinecap="round">
                          <rect x="3" y="3" width="18" height="18" rx="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                        </svg>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p
                          className="font-druk-wide uppercase leading-none"
                          style={{ fontSize: "clamp(0.88rem, 1.25vw, 1.1rem)", color: TEXT, letterSpacing: "-0.01em" }}
                        >
                          {item.name}
                        </p>
                        <p className="font-ekstra uppercase mt-1.5" style={{ fontSize: 10, letterSpacing: "0.22em", color: MUTED }}>
                          {item.pack}
                        </p>
                        <p
                          className="font-druk-wide mt-2"
                          style={{ fontSize: "clamp(0.92rem, 1.1vw, 1.05rem)", color: TEXT }}
                        >
                          {(item.price * item.qty).toFixed(2).replace(".", ",")} €
                        </p>
                      </div>

                      {/* Qty */}
                      <div
                        className="flex items-center gap-0 shrink-0 rounded-xl overflow-hidden"
                        style={{ border: `1px solid rgba(53,56,63,0.18)`, background: "rgba(255,255,255,0.60)" }}
                      >
                        <button
                          onClick={() => dispatch({ type: "SET_QTY", id: item.id, pack: item.pack, qty: item.qty - 1 })}
                          className="flex items-center justify-center transition-all duration-150"
                          style={{ width: 40, height: 40, color: TEXT, fontSize: 18, lineHeight: 1 }}
                        >
                          −
                        </button>
                        <span
                          className="font-ekstra"
                          style={{ minWidth: 28, textAlign: "center", color: TEXT, fontSize: "0.88rem", borderLeft: `1px solid rgba(53,56,63,0.12)`, borderRight: `1px solid rgba(53,56,63,0.12)`, height: 40, lineHeight: "40px" }}
                        >
                          {item.qty}
                        </span>
                        <button
                          onClick={() => dispatch({ type: "SET_QTY", id: item.id, pack: item.pack, qty: item.qty + 1 })}
                          className="flex items-center justify-center transition-all duration-150"
                          style={{ width: 40, height: 40, color: TEXT, fontSize: 18, lineHeight: 1 }}
                        >
                          +
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => dispatch({ type: "REMOVE", id: item.id, pack: item.pack })}
                        className="shrink-0 transition-opacity duration-150 hover:opacity-40"
                        style={{ color: MUTED, marginLeft: 4 }}
                        aria-label="Entfernen"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                        </svg>
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* RIGHT — order summary */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="lg:sticky order-1 lg:order-2"
              style={{ top: "calc(64px + 24px)" }}
            >
              <div
                style={{
                  background: "rgba(255,255,255,0.48)",
                  borderRadius: 22,
                  border: `1px solid rgba(255,255,255,0.72)`,
                  padding: "clamp(28px,3.5vh,40px)",
                }}
              >
                <p className="font-ekstra uppercase mb-1" style={{ fontSize: 10, letterSpacing: "0.30em", color: "rgba(53,56,63,0.38)" }}>
                  Bestellübersicht
                </p>
                <div style={{ height: 1, background: DIM, marginBottom: 20, marginTop: 12 }} />

                <div className="space-y-3.5 mb-6">
                  <div className="flex justify-between">
                    <span className="font-ekstra" style={{ fontSize: "0.9rem", color: MUTED }}>Zwischensumme</span>
                    <span className="font-druk-wide" style={{ fontSize: "0.95rem", color: TEXT }}>
                      {total.toFixed(2).replace(".", ",")} €
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-ekstra" style={{ fontSize: "0.9rem", color: MUTED }}>Versand</span>
                    <span className="font-druk-wide" style={{ fontSize: "0.95rem", color: TEXT }}>
                      {shipping === 0 ? "Gratis" : `${shipping.toFixed(2).replace(".", ",")} €`}
                    </span>
                  </div>
                  <div style={{ height: 1, background: DIM }} />
                  <div className="flex justify-between items-baseline pt-1">
                    <span className="font-ekstra" style={{ fontSize: "0.9rem", color: TEXT }}>Gesamt</span>
                    <span
                      className="font-druk-wide"
                      style={{ fontSize: "clamp(1.3rem, 2vw, 1.7rem)", color: TEXT }}
                    >
                      {grand.toFixed(2).replace(".", ",")} €
                    </span>
                  </div>
                  <p className="font-ekstra" style={{ fontSize: 9, letterSpacing: "0.18em", color: "rgba(53,56,63,0.32)", textTransform: "uppercase" }}>
                    inkl. MwSt.
                  </p>
                </div>

                {/* Coupon */}
                <div style={{ height: 1, background: DIM, marginBottom: 16 }} />
                <div className="flex gap-2 mb-5">
                  <input
                    type="text"
                    placeholder="Gutscheincode"
                    className="flex-1 px-4 py-3 rounded-xl text-sm placeholder:opacity-40 font-ekstra"
                    style={{
                      background: "rgba(255,255,255,0.72)",
                      border: `1.5px solid rgba(53,56,63,0.20)`,
                      color: TEXT,
                      outline: "none",
                      boxShadow: "inset 0 1px 2px rgba(53,56,63,0.04)",
                    }}
                    onFocus={e => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.96)"
                      e.currentTarget.style.border = "1.5px solid rgba(53,56,63,0.52)"
                      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(53,56,63,0.07)"
                    }}
                    onBlur={e => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.72)"
                      e.currentTarget.style.border = "1.5px solid rgba(53,56,63,0.20)"
                      e.currentTarget.style.boxShadow = "inset 0 1px 2px rgba(53,56,63,0.04)"
                    }}
                  />
                  <button
                    className="font-ekstra uppercase rounded-xl transition-opacity"
                    style={{
                      padding: "0 18px",
                      background: "rgba(255,255,255,0.72)",
                      border: `1.5px solid rgba(53,56,63,0.20)`,
                      color: MUTED,
                      fontSize: 11,
                      letterSpacing: "0.18em",
                    }}
                  >
                    OK
                  </button>
                </div>

                {/* CTA */}
                <button
                  className="w-full py-4 font-ekstra uppercase rounded-full transition-all duration-200"
                  style={{ background: TEXT, color: "#e8e4dc", letterSpacing: "0.22em", fontSize: 13 }}
                >
                  Zur Kasse
                </button>

                {/* Trust */}
                <div className="flex justify-center gap-5 mt-6">
                  {["SSL gesichert", "Diskret", "EU-Versand"].map(t => (
                    <span key={t} className="font-ekstra uppercase" style={{ fontSize: 8, letterSpacing: "0.18em", color: "rgba(53,56,63,0.28)" }}>
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
