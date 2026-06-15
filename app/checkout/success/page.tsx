"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "@/lib/cart"

const TEXT  = "#35383f"
const MUTED = "rgba(53,56,63,0.55)"
const GREEN = "#a0ba87"

type OrderStatus = "checking" | "paid" | "failed" | "timeout"

function SuccessContent() {
  const router               = useRouter()
  const { dispatch }         = useCart()
  const params               = useSearchParams()
  const token                = params.get("token") ?? ""
  const [status, setStatus]  = useState<OrderStatus>("checking")
  const [orderRef, setOrderRef] = useState("")

  useEffect(() => {
    // Clear cart immediately when landing here (payment is done)
    dispatch({ type: "HYDRATE", items: [] })

    if (!token) {
      setStatus("paid")
      return
    }

    let cancelled = false

    async function poll() {
      for (let i = 0; i < 30; i++) {
        if (cancelled) return
        try {
          const res  = await fetch(`/api/checkout/order-status?token=${token}`)
          const data = await res.json()

          if (data.status === "paid") {
            if (!cancelled) {
              setOrderRef(data.order_ref ?? "")
              setStatus("paid")
              dispatch({ type: "HYDRATE", items: [] })
            }
            return
          }

          if (data.status === "failed") {
            if (!cancelled) setStatus("failed")
            return
          }
        } catch {
          // network hiccup — keep polling
        }
        await new Promise(r => setTimeout(r, 2000))
      }
      if (!cancelled) setStatus("timeout")
    }

    poll()
    return () => { cancelled = true }
  }, [token, dispatch])

  return (
    <div style={{ background: "#bcc0ca", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <AnimatePresence mode="wait">

        {/* ── Checking / Verifying ── */}
        {status === "checking" && (
          <motion.div
            key="checking"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.45 }}
            style={card}
          >
            <Spinner />
            <h1 className="font-druk-wide uppercase leading-none mb-4" style={{ fontSize: "clamp(1.6rem,4vw,2.8rem)", letterSpacing: "-0.03em", color: TEXT }}>
              Zahlung wird<br />verifiziert …
            </h1>
            <p className="font-ekstra" style={{ fontSize: "0.92rem", color: MUTED, lineHeight: 1.7 }}>
              Bitte warte einen Moment.
            </p>
          </motion.div>
        )}

        {/* ── Paid ── */}
        {status === "paid" && (
          <motion.div
            key="paid"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            style={card}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 360, damping: 24, delay: 0.1 }}
              style={{ width: 64, height: 64, borderRadius: "50%", background: GREEN,
                display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px" }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </motion.div>

            <h1 className="font-druk-wide uppercase leading-none mb-4"
              style={{ fontSize: "clamp(1.8rem,5vw,3.2rem)", letterSpacing: "-0.03em", color: TEXT }}>
              Zahlung<br />erfolgreich
            </h1>

            <p className="font-ekstra mb-2" style={{ fontSize: "0.95rem", color: MUTED, lineHeight: 1.75 }}>
              Deine Bestellung wurde erfolgreich aufgegeben.<br />
              Du erhältst in Kürze eine Bestätigungs-E-Mail.
            </p>

            {orderRef && (
              <p className="font-ekstra mt-1 mb-8"
                style={{ fontSize: "0.82rem", color: MUTED, letterSpacing: "0.06em" }}>
                Bestellnummer: <span style={{ color: TEXT, fontFamily: "monospace" }}>{orderRef}</span>
              </p>
            )}
            {!orderRef && <div style={{ marginBottom: 32 }} />}

            <button
              onClick={() => router.push("/")}
              className="font-ekstra uppercase rounded-full"
              style={{ background: TEXT, color: "#e8e4dc", padding: "14px 40px",
                fontSize: 13, letterSpacing: "0.20em", border: "none", cursor: "pointer" }}
            >
              Zur Startseite
            </button>
          </motion.div>
        )}

        {/* ── Failed ── */}
        {(status === "failed" || status === "timeout") && (
          <motion.div
            key="failed"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45 }}
            style={card}
          >
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(232,92,92,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e85c5c" strokeWidth="2.2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </div>

            <h1 className="font-druk-wide uppercase leading-none mb-4"
              style={{ fontSize: "clamp(1.8rem,5vw,3.2rem)", letterSpacing: "-0.03em", color: TEXT }}>
              {status === "timeout" ? "Zeitüberschreitung" : "Fehler"}
            </h1>

            <p className="font-ekstra mb-8" style={{ fontSize: "0.92rem", color: MUTED, lineHeight: 1.75 }}>
              {status === "timeout"
                ? "Die Zahlung konnte nicht bestätigt werden. Bitte kontaktiere uns, falls Geld abgebucht wurde."
                : "Bei der Bestellung ist ein Fehler aufgetreten. Bitte versuche es erneut."}
            </p>

            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={() => router.push("/checkout")}
                className="font-ekstra uppercase rounded-full"
                style={{ background: TEXT, color: "#e8e4dc", padding: "14px 32px",
                  fontSize: 13, letterSpacing: "0.20em", border: "none", cursor: "pointer" }}>
                Nochmal versuchen
              </button>
              <button onClick={() => router.push("/")}
                className="font-ekstra uppercase rounded-full"
                style={{ background: "transparent", color: TEXT, padding: "14px 32px",
                  fontSize: 13, letterSpacing: "0.20em",
                  border: `1.5px solid rgba(53,56,63,0.22)`, cursor: "pointer" }}>
                Startseite
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}

const card: React.CSSProperties = {
  background: "rgba(255,255,255,0.5)",
  borderRadius: 24,
  border: "1px solid rgba(255,255,255,0.75)",
  padding: "clamp(40px,6vh,72px) clamp(32px,6vw,64px)",
  maxWidth: 480,
  width: "100%",
  textAlign: "center",
  margin: "0 24px",
}

function Spinner() {
  return (
    <div style={{ margin: "0 auto 28px", width: 48, height: 48 }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        style={{ width: 48, height: 48, borderRadius: "50%",
          border: `3px solid rgba(53,56,63,0.12)`,
          borderTop: `3px solid ${TEXT}` }}
      />
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div style={{ background: "#bcc0ca", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ ...card }}>
          <div style={{ margin: "0 auto 28px", width: 48, height: 48,
            borderRadius: "50%", border: `3px solid rgba(53,56,63,0.12)`,
            borderTop: `3px solid ${TEXT}`, animation: "spin 1s linear infinite" }} />
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
