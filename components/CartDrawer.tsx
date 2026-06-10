"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ShoppingBag } from "lucide-react"
import { useCart } from "@/lib/cart"

export function CartDrawer() {
  const { state, dispatch, total, count } = useCart()

  return (
    <AnimatePresence>
      {state.open && (
        <>
          <motion.div
            key="bd"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[90]"
            style={{ background: "rgba(14,12,9,0.5)", backdropFilter: "blur(8px)" }}
            onClick={() => dispatch({ type: "CLOSE_CART" })}
          />

          <motion.aside
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 36, mass: 0.7 }}
            className="fixed right-0 top-0 h-full z-[91] flex flex-col"
            style={{ width: "min(380px, 100vw)", background: "#35383f" }}
          >
            {/* Top */}
            <div className="flex items-center justify-between px-8 pt-8 pb-6"
              style={{ borderBottom: "1px solid rgba(53,56,63,0.06)" }}>
              <p className="font-adieu uppercase"
                style={{ fontSize: "1.4rem", color: "#35383f", letterSpacing: "-0.02em" }}>
                Warenkorb {count > 0 && <span style={{ color: "#a0ba87" }}>({count})</span>}
              </p>
              <button
                onClick={() => dispatch({ type: "CLOSE_CART" })}
                style={{ color: "rgba(53,56,63,0.35)", fontSize: 18, lineHeight: 1 }}
              >
                ✕
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-8 py-6">
              {state.items.length === 0 ? (
                <p className="font-mono text-[10px] tracking-[0.35em] uppercase"
                  style={{ color: "rgba(53,56,63,0.18)", marginTop: 4 }}>
                  Noch leer.
                </p>
              ) : (
                <AnimatePresence initial={false}>
                  {state.items.map(item => (
                    <motion.div
                      key={`${item.id}__${item.pack}`}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0, overflow: "hidden", paddingTop: 0, paddingBottom: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center justify-between py-5"
                      style={{ borderBottom: "1px solid rgba(53,56,63,0.05)" }}
                    >
                      <div className="flex-1 min-w-0 pr-6">
                        <p className="font-adieu uppercase leading-none mb-1"
                          style={{ fontSize: "0.95rem", color: "#35383f", letterSpacing: "-0.01em" }}>
                          {item.name}
                        </p>
                        <p className="font-mono text-[9px] tracking-wider"
                          style={{ color: "rgba(53,56,63,0.25)" }}>
                          {item.pack}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => dispatch({ type: "SET_QTY", id: item.id, pack: item.pack, qty: item.qty - 1 })}
                            style={{ color: "rgba(53,56,63,0.3)", fontSize: 15, lineHeight: 1 }}
                          >−</button>
                          <span className="font-mono text-[11px]" style={{ color: "#35383f", minWidth: 12, textAlign: "center" }}>
                            {item.qty}
                          </span>
                          <button
                            onClick={() => dispatch({ type: "SET_QTY", id: item.id, pack: item.pack, qty: item.qty + 1 })}
                            style={{ color: "rgba(53,56,63,0.3)", fontSize: 15, lineHeight: 1 }}
                          >+</button>
                        </div>
                        <span className="font-mono text-[10px]" style={{ color: "rgba(53,56,63,0.4)", minWidth: 48, textAlign: "right" }}>
                          €{(item.price * item.qty).toFixed(2)}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {state.items.length > 0 && (
              <div className="px-8 py-7" style={{ borderTop: "1px solid rgba(53,56,63,0.06)" }}>
                <div className="flex justify-between items-baseline mb-6">
                  <span className="font-mono text-[9px] tracking-[0.35em] uppercase"
                    style={{ color: "rgba(53,56,63,0.25)" }}>Gesamt</span>
                  <span className="font-adieu text-[1.6rem]"
                    style={{ color: "#35383f", letterSpacing: "-0.02em" }}>
                    €{total.toFixed(2)}
                  </span>
                </div>
                <button
                  className="w-full py-4 font-mono text-[10px] tracking-[0.35em] uppercase"
                  style={{ background: "#35383f", color: "#1a1916" }}
                >
                  Zur Kasse →
                </button>
                <button
                  onClick={() => dispatch({ type: "CLOSE_CART" })}
                  className="w-full mt-4 font-mono text-[9px] tracking-[0.3em] uppercase"
                  style={{ color: "rgba(53,56,63,0.18)" }}
                >
                  Weiter einkaufen
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
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
      {/* Icon only on mobile, text on sm+ */}
      <ShoppingBag
        className="block sm:hidden shrink-0"
        size={16}
        style={{ color: "rgba(53,56,63,0.45)" }}
      />
      <span
        className="hidden sm:block font-adieu uppercase"
        style={{
          fontSize:      "clamp(0.82rem, 1.1vw, 1rem)",
          letterSpacing: "-0.01em",
          color:         "rgba(53,56,63,0.40)",
          lineHeight:    1,
          whiteSpace:    "nowrap",
        }}
      >
        Warenkorb
      </span>
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key="badge"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{   scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 440, damping: 22 }}
            className="flex items-center justify-center font-mono text-[9px] leading-none"
            style={{
              width: 20, height: 20,
              borderRadius: "50%",
              background:   "#35383f",
              color:        "#35383f",
            }}
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
