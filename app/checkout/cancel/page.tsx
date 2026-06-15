"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

const TEXT  = "#35383f"
const MUTED = "rgba(53,56,63,0.55)"

export default function CheckoutCancelPage() {
  const router = useRouter()

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
          background: "rgba(232,92,92,0.18)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 28px",
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e85c5c" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </div>

        <h1
          className="font-druk-wide uppercase leading-none mb-4"
          style={{ fontSize: "clamp(1.8rem,5vw,3.2rem)", letterSpacing: "-0.03em", color: TEXT }}
        >
          Zahlung<br />abgebrochen
        </h1>

        <p className="font-ekstra mb-8" style={{ fontSize: "0.95rem", color: MUTED, lineHeight: 1.75 }}>
          Der Zahlungsvorgang wurde abgebrochen.<br />
          Dein Warenkorb ist noch gespeichert.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <button
            onClick={() => router.push("/checkout")}
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
            Nochmal versuchen
          </button>
          <button
            onClick={() => router.push("/")}
            className="font-ekstra uppercase rounded-full"
            style={{
              background: "transparent",
              color: MUTED,
              padding: "14px 40px",
              fontSize: 13,
              letterSpacing: "0.20em",
              border: `1.5px solid rgba(53,56,63,0.18)`,
              cursor: "pointer",
            }}
          >
            Zur Startseite
          </button>
        </div>
      </motion.div>
    </div>
  )
}
