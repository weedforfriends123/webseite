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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[1050]"
              style={{ background: "rgba(10,10,12,0.65)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
              onClick={() => dispatch({ type: "CLOSE_CART" })}
            />

            {/* Bottom Sheet */}
            <motion.aside
              key="sheet"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 38, mass: 0.8 }}
              className="fixed bottom-0 left-0 right-0 z-[1051] flex flex-col"
              style={{
                maxHeight:         "88vh",
                background:        "#35383f",
                borderRadius:      "28px 28px 0 0",
                boxShadow:         "0 -8px 60px rgba(0,0,0,0.45), 0 -1px 0 rgba(255,255,255,0.06)",
              }}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1 shrink-0">
                <div style={{ width: 36, height: 4, borderRadius: 9999, background: "rgba(255,255,255,0.18)" }} />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-3 pb-4 shrink-0"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-center gap-3">
                  <p className="font-adieu uppercase"
                    style={{ fontSize: "1.25rem", color: "rgba(255,255,255,0.90)", letterSpacing: "-0.02em", lineHeight: 1 }}>
                    Warenkorb
                  </p>
                  <AnimatePresence>
                    {count > 0 && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 24 }}
                        className="flex items-center justify-center font-mono leading-none"
                        style={{ width: 22, height: 22, borderRadius: "50%", background: "#a0ba87", color: "#2a3020", fontSize: 10 }}
                      >
                        {count}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <button
                  onClick={() => dispatch({ type: "CLOSE_CART" })}
                  className="flex items-center justify-center"
                  style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.55)", fontSize: 14 }}
                >
                  ✕
                </button>
              </div>

              {/* Gratis-Versand Progress */}
              {total > 0 && total < FREE_SHIPPING && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mx-6 mt-4 px-4 py-3 shrink-0"
                  style={{ background: "rgba(255,255,255,0.06)", borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <div className="flex justify-between mb-2">
                    <span className="font-ekstra uppercase" style={{ fontSize: 9, letterSpacing: "0.22em", color: "rgba(255,255,255,0.40)" }}>
                      Kostenloser Versand
                    </span>
                    <span className="font-mono" style={{ fontSize: 9, color: "rgba(255,255,255,0.40)" }}>
                      noch {(FREE_SHIPPING - total).toFixed(2).replace(".", ",")} €
                    </span>
                  </div>
                  <div style={{ height: 3, borderRadius: 9999, background: "rgba(255,255,255,0.10)", overflow: "hidden" }}>
                    <motion.div
                      style={{ height: "100%", background: "#a0ba87", borderRadius: 9999 }}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </motion.div>
              )}

              {total >= FREE_SHIPPING && total > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mx-6 mt-4 px-4 py-3 flex items-center gap-2 shrink-0"
                  style={{ background: "rgba(160,186,135,0.12)", borderRadius: 14, border: "1px solid rgba(160,186,135,0.20)" }}
                >
                  <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#a0ba87", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#2a3020" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <span className="font-ekstra uppercase" style={{ fontSize: 9, letterSpacing: "0.22em", color: "#a0ba87" }}>
                    Kostenloser Versand aktiviert
                  </span>
                </motion.div>
              )}

              {/* Items */}
              <div className="flex-1 overflow-y-auto px-6 py-4" style={{ overscrollBehavior: "contain" }}>
                {state.items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-4">
                    <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <ShoppingBag size={20} style={{ color: "rgba(255,255,255,0.20)" }} />
                    </div>
                    <p className="font-ekstra uppercase" style={{ fontSize: 9, letterSpacing: "0.28em", color: "rgba(255,255,255,0.20)" }}>
                      Noch leer
                    </p>
                  </div>
                ) : (
                  <AnimatePresence initial={false}>
                    {state.items.map((item, i) => (
                      <motion.div
                        key={`${item.id}__${item.pack}`}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0, overflow: "hidden" }}
                        transition={{ duration: 0.28, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                        className="flex items-center gap-4 py-4"
                        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                      >
                        {/* Thumbnail placeholder */}
                        <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(255,255,255,0.07)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ fontSize: 18 }}>🌿</span>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-adieu uppercase leading-none mb-0.5"
                            style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.88)", letterSpacing: "-0.01em" }}>
                            {item.name}
                          </p>
                          <p className="font-mono" style={{ fontSize: 9, color: "rgba(255,255,255,0.28)", letterSpacing: "0.08em" }}>
                            {item.pack}
                          </p>
                          <p className="font-mono mt-1" style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.55)" }}>
                            €{item.price.toFixed(2)}
                          </p>
                        </div>

                        {/* Qty + price */}
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <p className="font-adieu" style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.90)" }}>
                            €{(item.price * item.qty).toFixed(2)}
                          </p>
                          <div className="flex items-center"
                            style={{ background: "rgba(255,255,255,0.08)", borderRadius: 9999, border: "1px solid rgba(255,255,255,0.08)" }}>
                            <button
                              onClick={() => dispatch({ type: "SET_QTY", id: item.id, pack: item.pack, qty: item.qty - 1 })}
                              style={{ width: 28, height: 28, color: "rgba(255,255,255,0.50)", fontSize: 16, lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center" }}
                            >−</button>
                            <span className="font-mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.85)", minWidth: 18, textAlign: "center" }}>
                              {item.qty}
                            </span>
                            <button
                              onClick={() => dispatch({ type: "SET_QTY", id: item.id, pack: item.pack, qty: item.qty + 1 })}
                              style={{ width: 28, height: 28, color: "rgba(255,255,255,0.50)", fontSize: 16, lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center" }}
                            >+</button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>

              {/* Footer */}
              {state.items.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                  className="px-6 pt-4 pb-8 shrink-0"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
                >
                  {/* Totals */}
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-ekstra uppercase" style={{ fontSize: 9, letterSpacing: "0.22em", color: "rgba(255,255,255,0.30)" }}>Versand</span>
                    <span className="font-mono" style={{ fontSize: "0.82rem", color: shipping === 0 ? "#a0ba87" : "rgba(255,255,255,0.55)" }}>
                      {shipping === 0 ? "Gratis" : `${shipping.toFixed(2).replace(".", ",")} €`}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline mb-5">
                    <span className="font-ekstra uppercase" style={{ fontSize: 9, letterSpacing: "0.22em", color: "rgba(255,255,255,0.30)" }}>Gesamt</span>
                    <span className="font-adieu" style={{ fontSize: "1.5rem", color: "rgba(255,255,255,0.92)", letterSpacing: "-0.02em" }}>
                      €{grand.toFixed(2).replace(".", ",")}
                    </span>
                  </div>

                  {/* CTA */}
                  <Link
                    href="/checkout"
                    onClick={() => dispatch({ type: "CLOSE_CART" })}
                    className="flex items-center justify-center w-full font-ekstra uppercase"
                    style={{
                      height: 52, borderRadius: 9999,
                      background: "#e8e4dc", color: "#35383f",
                      fontSize: 12, letterSpacing: "0.22em",
                      textDecoration: "none",
                      boxShadow: "0 4px 20px rgba(232,228,220,0.15)",
                    }}
                  >
                    Zur Kasse →
                  </Link>
                  <button
                    onClick={() => dispatch({ type: "CLOSE_CART" })}
                    className="w-full mt-3 font-ekstra uppercase"
                    style={{ fontSize: 9, letterSpacing: "0.22em", color: "rgba(255,255,255,0.22)" }}
                  >
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
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0,  opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 24, delay: 0.2 }}
      className="fixed top-5 right-4 sm:top-6 sm:right-6 z-[80] flex items-center gap-2"
      style={{
        height:               "clamp(40px, 5vh, 50px)",
        padding:              "0 clamp(14px, 2vw, 24px)",
        background:           "rgba(53,56,63,0.92)",
        backdropFilter:       "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRadius:         9999,
        border:               "1px solid rgba(53,56,63,0.10)",
        boxShadow:            "0 8px 40px rgba(14,12,9,0.12), 0 2px 8px rgba(14,12,9,0.06)",
      }}
    >
      <ShoppingBag size={16} style={{ color: "rgba(255,255,255,0.65)" }} />
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key="badge"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{   scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 440, damping: 22 }}
            className="flex items-center justify-center font-mono leading-none"
            style={{ width: 20, height: 20, borderRadius: "50%", background: "#a0ba87", color: "#2a3020", fontSize: 9 }}
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
