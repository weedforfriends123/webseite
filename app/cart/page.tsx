"use client"

import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useCart } from "@/lib/cart"
import { Navbar } from "@/components/Navbar"

const FREE_SHIPPING = 50

export default function CartPage() {
  const { state, dispatch, total, count } = useCart()
  const items    = state.items
  const shipping = total >= FREE_SHIPPING ? 0 : 4.99
  const grand    = total + shipping
  const progress = Math.min((total / FREE_SHIPPING) * 100, 100)

  return (
    <div style={{ background: "#bcc0ca", minHeight: "100vh" }}>
      <Navbar />

      <div className="max-w-6xl mx-auto" style={{ padding: "clamp(96px,13vh,148px) clamp(20px,5vw,72px) clamp(80px,12vh,140px)" }}>

        {/* ── HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-end justify-between flex-wrap gap-4"
          style={{ marginBottom: "clamp(40px,6vh,72px)" }}
        >
          <div className="flex items-baseline gap-5">
            <h1 className="font-druk-wide uppercase leading-none"
              style={{ fontSize: "clamp(3rem, 10vw, 9rem)", letterSpacing: "-0.035em", color: "#35383f" }}>
              Warenkorb
            </h1>
            {count > 0 && (
              <span className="font-ekstra"
                style={{ fontSize: "clamp(0.9rem, 1.4vw, 1.1rem)", color: "rgba(53,56,63,0.45)", letterSpacing: "0.08em" }}>
                {count} {count === 1 ? "Artikel" : "Artikel"}
              </span>
            )}
          </div>
          <Link href="/vapes" className="font-ekstra uppercase"
            style={{ fontSize: 11, letterSpacing: "0.22em", color: "rgba(53,56,63,0.45)", textDecoration: "none" }}>
            ← Shop
          </Link>
        </motion.div>

        {items.length === 0 ? (

          /* ── EMPTY ── */
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.65 }}
            className="flex flex-col items-center justify-center text-center"
            style={{ paddingTop: "clamp(64px,10vh,120px)", paddingBottom: "clamp(64px,10vh,120px)" }}>
            <h2 className="font-druk-wide uppercase leading-none mb-6"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)", letterSpacing: "-0.03em", color: "#35383f" }}>
              Noch leer.
            </h2>
            <p className="font-ekstra mb-10" style={{ fontSize: "1rem", color: "rgba(53,56,63,0.5)", lineHeight: 1.8 }}>
              Füge Produkte hinzu, um fortzufahren.
            </p>
            <Link href="/vapes" className="font-ekstra uppercase rounded-full"
              style={{ fontSize: 13, letterSpacing: "0.22em", background: "#35383f", color: "#e8e4dc", padding: "16px 44px", textDecoration: "none" }}>
              Zum Shop
            </Link>
          </motion.div>

        ) : (

          /* ── ITEMS + SUMMARY ── */
          <div className="flex flex-col lg:grid lg:grid-cols-[1fr_380px] gap-8 lg:gap-14 items-start">

            {/* ── LEFT: items ── */}
            <div>

              {/* Shipping progress */}
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-5 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.45)", border: "1px solid rgba(255,255,255,0.72)" }}>
                {total < FREE_SHIPPING ? (
                  <div>
                    <div className="flex justify-between items-baseline mb-3">
                      <span className="font-ekstra uppercase"
                        style={{ fontSize: 11, letterSpacing: "0.22em", color: "rgba(53,56,63,0.50)" }}>
                        Kostenloser Versand
                      </span>
                      <span className="font-druk-wide" style={{ fontSize: "1.05rem", color: "#35383f" }}>
                        noch {(FREE_SHIPPING - total).toFixed(2).replace(".", ",")} €
                      </span>
                    </div>
                    <div style={{ height: 5, borderRadius: 9999, background: "rgba(53,56,63,0.10)", overflow: "hidden" }}>
                      <motion.div style={{ height: "100%", background: "#a0ba87", borderRadius: 9999 }}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center shrink-0"
                      style={{ width: 28, height: 28, borderRadius: "50%", background: "#a0ba87" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2a3020" strokeWidth="2.5" strokeLinecap="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                    <p className="font-ekstra uppercase"
                      style={{ fontSize: 12, letterSpacing: "0.22em", color: "#35383f" }}>
                      Kostenloser Versand aktiviert
                    </p>
                  </div>
                )}
              </motion.div>

              {/* Item cards */}
              <AnimatePresence initial={false}>
                {items.map((item, i) => (
                  <motion.div
                    key={`${item.id}__${item.pack}`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, overflow: "hidden", marginBottom: 0 }}
                    transition={{ duration: 0.28, delay: i * 0.05 }}
                    className="mb-3 p-6 rounded-2xl"
                    style={{ background: "rgba(255,255,255,0.50)", border: "1px solid rgba(255,255,255,0.78)" }}
                  >
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-4 mb-5">
                      <div className="flex-1 min-w-0">
                        <p className="font-druk-wide uppercase leading-tight"
                          style={{ fontSize: "clamp(1.1rem, 2.2vw, 1.6rem)", color: "#35383f", letterSpacing: "-0.02em" }}>
                          {item.name}
                        </p>
                        <p className="font-ekstra uppercase mt-1.5"
                          style={{ fontSize: 11, letterSpacing: "0.20em", color: "rgba(53,56,63,0.45)" }}>
                          {item.pack}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-druk-wide" style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.7rem)", color: "#35383f", letterSpacing: "-0.02em" }}>
                          {(item.price * item.qty).toFixed(2).replace(".", ",")} €
                        </p>
                        <p className="font-ekstra mt-0.5" style={{ fontSize: 10, color: "rgba(53,56,63,0.40)" }}>
                          {item.price.toFixed(2).replace(".", ",")} € / Stk.
                        </p>
                      </div>
                    </div>

                    {/* Bottom row: qty + remove */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center rounded-2xl overflow-hidden"
                        style={{ background: "rgba(53,56,63,0.07)", border: "1.5px solid rgba(53,56,63,0.12)" }}>
                        <button
                          onClick={() => dispatch({ type: "SET_QTY", id: item.id, pack: item.pack, qty: item.qty - 1 })}
                          className="flex items-center justify-center"
                          style={{ width: 48, height: 48, color: "#35383f", fontSize: 22 }}>
                          −
                        </button>
                        <span className="font-druk-wide"
                          style={{ minWidth: 40, textAlign: "center", color: "#35383f", fontSize: "1.05rem",
                            borderLeft: "1.5px solid rgba(53,56,63,0.10)", borderRight: "1.5px solid rgba(53,56,63,0.10)",
                            height: 48, lineHeight: "48px" }}>
                          {item.qty}
                        </span>
                        <button
                          onClick={() => dispatch({ type: "SET_QTY", id: item.id, pack: item.pack, qty: item.qty + 1 })}
                          className="flex items-center justify-center"
                          style={{ width: 48, height: 48, color: "#35383f", fontSize: 22 }}>
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => dispatch({ type: "REMOVE", id: item.id, pack: item.pack })}
                        className="font-ekstra uppercase hover:opacity-60 transition-opacity"
                        style={{ fontSize: 10, letterSpacing: "0.18em", color: "rgba(53,56,63,0.38)", padding: "8px 4px" }}>
                        Entfernen
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* ── RIGHT: dark summary card ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="lg:sticky w-full"
              style={{ top: "calc(72px + 28px)" }}>
              <div style={{ background: "#35383f", borderRadius: 24, padding: "clamp(26px,4vh,40px)", boxShadow: "0 20px 60px rgba(53,56,63,0.22)" }}>

                <p className="font-ekstra uppercase mb-6"
                  style={{ fontSize: 10, letterSpacing: "0.30em", color: "rgba(232,228,220,0.35)" }}>
                  Bestellübersicht
                </p>

                {/* Items */}
                <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 22 }}>
                  {items.map(item => (
                    <div key={`${item.id}__${item.pack}`} className="flex justify-between items-start gap-3">
                      <div>
                        <p className="font-ekstra" style={{ fontSize: "0.92rem", color: "rgba(232,228,220,0.80)", lineHeight: 1.4 }}>
                          {item.name}
                        </p>
                        <p className="font-ekstra uppercase" style={{ fontSize: 9, letterSpacing: "0.16em", color: "rgba(232,228,220,0.35)" }}>
                          {item.pack} · ×{item.qty}
                        </p>
                      </div>
                      <p className="font-druk-wide shrink-0" style={{ fontSize: "0.95rem", color: "rgba(232,228,220,0.80)" }}>
                        {(item.price * item.qty).toFixed(2).replace(".", ",")} €
                      </p>
                    </div>
                  ))}
                </div>

                <div style={{ height: 1, background: "rgba(255,255,255,0.08)", marginBottom: 18 }} />

                <div className="flex justify-between items-center mb-3">
                  <span className="font-ekstra" style={{ fontSize: "0.9rem", color: "rgba(232,228,220,0.45)" }}>Versand</span>
                  <span className="font-druk-wide" style={{ fontSize: "0.95rem", color: shipping === 0 ? "#a0ba87" : "rgba(232,228,220,0.70)" }}>
                    {shipping === 0 ? "Gratis" : `${shipping.toFixed(2).replace(".", ",")} €`}
                  </span>
                </div>

                <div style={{ height: 1, background: "rgba(255,255,255,0.08)", marginBottom: 22 }} />

                <div className="mb-1">
                  <p className="font-ekstra uppercase mb-2" style={{ fontSize: 10, letterSpacing: "0.26em", color: "rgba(232,228,220,0.35)" }}>Gesamt</p>
                  <p className="font-druk-wide leading-none" style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", color: "#e8e4dc", letterSpacing: "-0.03em" }}>
                    {grand.toFixed(2).replace(".", ",")} €
                  </p>
                  <p className="font-ekstra mt-1.5" style={{ fontSize: 9, letterSpacing: "0.16em", color: "rgba(232,228,220,0.28)", textTransform: "uppercase" }}>
                    inkl. MwSt.
                  </p>
                </div>

                <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "22px 0" }} />

                {/* Coupon */}
                <div className="flex gap-2 mb-6">
                  <input type="text" placeholder="Gutscheincode"
                    className="flex-1 min-w-0 font-ekstra placeholder:opacity-30"
                    style={{ padding: "13px 16px", fontSize: "max(16px,0.88rem)", background: "rgba(255,255,255,0.07)",
                      border: "1.5px solid rgba(255,255,255,0.10)", borderRadius: 12, color: "#e8e4dc", outline: "none" }}/>
                  <button className="font-ekstra uppercase shrink-0"
                    style={{ padding: "0 18px", background: "rgba(255,255,255,0.09)", border: "1.5px solid rgba(255,255,255,0.10)",
                      borderRadius: 12, color: "rgba(232,228,220,0.45)", fontSize: 11, letterSpacing: "0.16em" }}>
                    OK
                  </button>
                </div>

                {/* CTA */}
                <Link href="/checkout"
                  className="flex items-center justify-center w-full font-ekstra uppercase rounded-full"
                  style={{ height: 60, background: "#e8e4dc", color: "#35383f", letterSpacing: "0.22em",
                    fontSize: 14, textDecoration: "none", boxShadow: "0 8px 28px rgba(232,228,220,0.18)" }}>
                  Zur Kasse →
                </Link>

                <div className="flex justify-center gap-5 mt-5">
                  {["SSL", "Diskret", "EU-Versand"].map(t => (
                    <span key={t} className="font-ekstra uppercase"
                      style={{ fontSize: 9, letterSpacing: "0.18em", color: "rgba(232,228,220,0.22)" }}>
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
