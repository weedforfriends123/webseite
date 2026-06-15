"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ShoppingBag } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/lib/cart"

const FREE_SHIPPING = 50

export function CartDrawer() {
  const { state, dispatch, total, count } = useCart()
  const shipping = total >= FREE_SHIPPING ? 0 : 4.99
  const grand    = total + shipping
  const progress = Math.min((total / FREE_SHIPPING) * 100, 100)

  return (
    <div className="md:hidden">
      <AnimatePresence>
        {state.open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="bd"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.28 }}
              className="fixed inset-0 z-[1050]"
              style={{ background: "rgba(6,6,8,0.75)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
              onClick={() => dispatch({ type: "CLOSE_CART" })}
            />

            {/* Sheet */}
            <motion.aside
              key="sheet"
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 34, mass: 0.95 }}
              className="fixed bottom-0 left-0 right-0 z-[1051] flex flex-col"
              style={{ maxHeight: "91vh", background: "#2e3138", borderRadius: "28px 28px 0 0",
                boxShadow: "0 -16px 64px rgba(0,0,0,0.60), 0 -1px 0 rgba(255,255,255,0.06)" }}
            >
              {/* Handle */}
              <div className="flex justify-center pt-4 pb-1 shrink-0">
                <div style={{ width: 44, height: 4, borderRadius: 9999, background: "rgba(255,255,255,0.12)" }} />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between shrink-0"
                style={{ padding: "14px 24px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center gap-3">
                  <p className="font-druk-wide uppercase"
                    style={{ fontSize: "1.5rem", color: "rgba(255,255,255,0.92)", letterSpacing: "-0.025em" }}>
                    Warenkorb
                  </p>
                  <AnimatePresence>
                    {count > 0 && (
                      <motion.span
                        initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 24 }}
                        className="flex items-center justify-center font-druk-wide"
                        style={{ width: 26, height: 26, borderRadius: "50%", background: "#a0ba87", color: "#2a3020", fontSize: 11 }}>
                        {count}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <button onClick={() => dispatch({ type: "CLOSE_CART" })}
                  className="flex items-center justify-center"
                  style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.45)", fontSize: 14 }}>
                  ✕
                </button>
              </div>

              {/* Free shipping bar */}
              {total > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="shrink-0 mx-5 mt-4"
                  style={{ background: "rgba(255,255,255,0.05)", borderRadius: 16,
                    border: "1px solid rgba(255,255,255,0.07)", padding: "14px 18px" }}>
                  {total < FREE_SHIPPING ? (
                    <>
                      <div className="flex justify-between mb-2.5">
                        <span className="font-ekstra uppercase" style={{ fontSize: 10, letterSpacing: "0.20em", color: "rgba(255,255,255,0.35)" }}>
                          Kostenloser Versand
                        </span>
                        <span className="font-druk-wide" style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.55)" }}>
                          noch {(FREE_SHIPPING - total).toFixed(2).replace(".", ",")} €
                        </span>
                      </div>
                      <div style={{ height: 4, borderRadius: 9999, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                        <motion.div style={{ height: "100%", background: "#a0ba87", borderRadius: 9999 }}
                          initial={{ width: 0 }} animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} />
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-2.5">
                      <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#a0ba87",
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#2a3020" strokeWidth="3" strokeLinecap="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </div>
                      <span className="font-ekstra uppercase" style={{ fontSize: 10, letterSpacing: "0.20em", color: "#a0ba87" }}>
                        Kostenloser Versand aktiviert
                      </span>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Items */}
              <div className="flex-1 overflow-y-auto px-5 py-4" style={{ overscrollBehavior: "contain" }}>
                {state.items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-5">
                    <ShoppingBag size={28} style={{ color: "rgba(255,255,255,0.14)" }} />
                    <p className="font-ekstra uppercase" style={{ fontSize: 11, letterSpacing: "0.28em", color: "rgba(255,255,255,0.18)" }}>
                      Noch leer
                    </p>
                  </div>
                ) : (
                  <AnimatePresence initial={false}>
                    {state.items.map((item, i) => (
                      <motion.div
                        key={`${item.id}__${item.pack}`}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                        transition={{ duration: 0.26, delay: i * 0.04 }}
                        className="mb-2 p-4 rounded-xl"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.06)" }}
                      >
                        {/* Name + price */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex-1 min-w-0">
                            <p className="font-druk-wide uppercase leading-tight"
                              style={{ fontSize: "1rem", color: "rgba(255,255,255,0.90)" }}>
                              {item.name}
                            </p>
                            <p className="font-ekstra uppercase mt-1"
                              style={{ fontSize: 10, letterSpacing: "0.18em", color: "rgba(255,255,255,0.30)" }}>
                              {item.pack}
                            </p>
                          </div>
                          <p className="font-druk-wide shrink-0"
                            style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.88)" }}>
                            €{(item.price * item.qty).toFixed(2)}
                          </p>
                        </div>

                        {/* Qty + remove */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center"
                            style={{ background: "rgba(255,255,255,0.09)", borderRadius: 9999, border: "1px solid rgba(255,255,255,0.08)" }}>
                            <button
                              onClick={() => dispatch({ type: "SET_QTY", id: item.id, pack: item.pack, qty: item.qty - 1 })}
                              style={{ width: 36, height: 36, color: "rgba(255,255,255,0.60)", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
                              −
                            </button>
                            <span className="font-druk-wide"
                              style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.88)", minWidth: 28, textAlign: "center" }}>
                              {item.qty}
                            </span>
                            <button
                              onClick={() => dispatch({ type: "SET_QTY", id: item.id, pack: item.pack, qty: item.qty + 1 })}
                              style={{ width: 36, height: 36, color: "rgba(255,255,255,0.60)", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => dispatch({ type: "REMOVE", id: item.id, pack: item.pack })}
                            className="font-ekstra uppercase hover:opacity-60 transition-opacity"
                            style={{ fontSize: 9, letterSpacing: "0.18em", color: "rgba(255,255,255,0.22)" }}>
                            Entfernen
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>

              {/* Footer */}
              {state.items.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06, duration: 0.28 }}
                  className="shrink-0 px-5 pt-5 pb-8"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>

                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-ekstra uppercase" style={{ fontSize: 10, letterSpacing: "0.18em", color: "rgba(255,255,255,0.28)" }}>
                      Versand
                    </span>
                    <span className="font-druk-wide" style={{ fontSize: "0.95rem", color: shipping === 0 ? "#a0ba87" : "rgba(255,255,255,0.50)" }}>
                      {shipping === 0 ? "Gratis" : `${shipping.toFixed(2).replace(".", ",")} €`}
                    </span>
                  </div>

                  <div className="flex justify-between items-baseline mb-6">
                    <span className="font-ekstra uppercase" style={{ fontSize: 11, letterSpacing: "0.18em", color: "rgba(255,255,255,0.38)" }}>
                      Gesamt
                    </span>
                    <span className="font-druk-wide"
                      style={{ fontSize: "2.2rem", color: "#e8e4dc", letterSpacing: "-0.025em" }}>
                      €{grand.toFixed(2).replace(".", ",")}
                    </span>
                  </div>

                  <Link href="/checkout"
                    onClick={() => dispatch({ type: "CLOSE_CART" })}
                    className="flex items-center justify-center w-full font-ekstra uppercase"
                    style={{ height: 58, borderRadius: 9999, background: "#e8e4dc", color: "#2e3138",
                      fontSize: 13, letterSpacing: "0.22em", textDecoration: "none",
                      boxShadow: "0 8px 28px rgba(232,228,220,0.14)" }}>
                    Zur Kasse →
                  </Link>

                  <button onClick={() => dispatch({ type: "CLOSE_CART" })}
                    className="w-full mt-3 font-ekstra uppercase"
                    style={{ fontSize: 10, letterSpacing: "0.20em", color: "rgba(255,255,255,0.18)" }}>
                    Weiter einkaufen
                  </button>
                </motion.div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export function CartButton() {
  const { dispatch, count } = useCart()
  return (
    <motion.button
      onClick={() => dispatch({ type: "TOGGLE_CART" })}
      initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 24, delay: 0.2 }}
      className="fixed top-5 right-4 sm:top-6 sm:right-6 z-[80] flex items-center gap-2"
      style={{ height: "clamp(40px,5vh,50px)", padding: "0 clamp(14px,2vw,24px)",
        background: "rgba(53,56,63,0.92)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderRadius: 9999, border: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 8px 32px rgba(0,0,0,0.16)" }}>
      <ShoppingBag size={16} style={{ color: "rgba(255,255,255,0.65)" }} />
      <AnimatePresence>
        {count > 0 && (
          <motion.span key="badge"
            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 440, damping: 22 }}
            className="flex items-center justify-center font-druk-wide"
            style={{ width: 20, height: 20, borderRadius: "50%", background: "#a0ba87", color: "#2a3020", fontSize: 9 }}>
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
