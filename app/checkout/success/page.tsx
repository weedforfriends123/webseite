"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useCart } from "@/lib/cart"

const TEXT  = "#35383f"
const MUTED = "rgba(53,56,63,0.55)"

export default function CheckoutSuccessPage() {
  const router = useRouter()
  const { dispatch } = useCart()

  useEffect(() => {
    dispatch({ type: "HYDRATE", items: [] })
  }, [dispatch])

  return (
    <div style={{ background: "#bcc0ca", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: "rgba(255,255,255,0.5)",
          borderRadius: 24,
          border: "1px solid rgba(255,255,255,0.75)",
          padding: "clamp(40px,6vh,72px) clamp(32px,6vw,64px)",
          maxWidth: 480,
          width: "100%",
          textAlign: "center",
          margin: "0 24px",
        }}
      >
        <div style={{
          width: 64, height: 64, borderRadius: "50%",
          background: "#a0ba87",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 28px",
        }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>

        <h1
          className="font-druk-wide uppercase leading-none mb-4"
          style={{ fontSize: "clamp(1.8rem,5vw,3.2rem)", letterSpacing: "-0.03em", color: TEXT }}
        >
          Zahlung<br />erfolgreich
        </h1>

        <p className="font-ekstra mb-8" style={{ fontSize: "0.95rem", color: MUTED, lineHeight: 1.75 }}>
          Deine Bestellung wurde erfolgreich bezahlt.<br />
          Du erhältst in Kürze eine Bestätigungs-E-Mail.
        </p>

        <button
          onClick={() => router.push("/")}
          className="font-ekstra uppercase rounded-full"
          style={{
            background: TEXT,
            color: "#e8e4dc",
            padding: "14px 40px",
            fontSize: 13,
            letterSpacing: "0.20em",
            border: "none",
            cursor: "pointer",
          }}
        >
          Zur Startseite
        </button>
      </motion.div>
    </div>
  )
}
