"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"

const TEXT  = "#35383f"
const MUTED = "rgba(53,56,63,0.55)"

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

function CancelContent() {
  const router  = useRouter()
  const params  = useSearchParams()
  const token   = params.get("token") ?? ""

  const [retrying,    setRetrying]    = useState(false)
  const [retryMsg,    setRetryMsg]    = useState("Zahlung neu starten …")
  const [retryError,  setRetryError]  = useState("")
  const [notified,    setNotified]    = useState(false)

  // Notify server once: mark order cancelled + send failure email
  useEffect(() => {
    if (!token || notified) return
    setNotified(true)
    fetch("/api/checkout/cancel-notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    }).catch(() => {})
  }, [token, notified])

  async function handleRetry() {
    if (!token) { router.push("/checkout"); return }
    setRetrying(true)
    setRetryError("")
    try {
      setRetryMsg("Neue Zahlung wird vorbereitet …")
      const res  = await fetch("/api/checkout/retry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_token: token }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Fehler")

      setRetryMsg("Checkout wird geöffnet …")
      const { order_token } = data
      let url: string | null = null
      for (let i = 0; i < 30; i++) {
        await new Promise(r => setTimeout(r, 1500))
        const s = await (await fetch(`/api/checkout/status?token=${order_token}`)).json()
        if (s.ready && s.url) { url = s.url; break }
      }
      if (!url) throw new Error("Zeitüberschreitung — bitte erneut versuchen.")
      window.location.href = url
    } catch (err) {
      setRetryError(err instanceof Error ? err.message : "Fehler")
      setRetrying(false)
    }
  }

  return (
    <div style={{ background: "#bcc0ca", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        style={card}
      >
        <div style={{
          width: 64, height: 64, borderRadius: "50%",
          background: "rgba(232,92,92,0.12)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 28px",
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e85c5c" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </div>

        <h1 className="font-druk-wide uppercase leading-none mb-4"
          style={{ fontSize: "clamp(1.8rem,5vw,3.2rem)", letterSpacing: "-0.03em", color: TEXT }}>
          Zahlung<br />fehlgeschlagen
        </h1>

        <p className="font-ekstra mb-2" style={{ fontSize: "0.95rem", color: MUTED, lineHeight: 1.75 }}>
          Der Zahlungsvorgang konnte nicht abgeschlossen werden.
        </p>

        {token && (
          <p className="font-ekstra mb-8" style={{ fontSize: "0.85rem", color: MUTED, lineHeight: 1.6 }}>
            Du kannst die Zahlung direkt hier oder jederzeit in deinem{" "}
            <span style={{ color: TEXT, fontWeight: 600 }}>Kundenkonto unter Bestellungen</span>{" "}
            erneut durchführen.
          </p>
        )}
        {!token && <div style={{ marginBottom: 32 }} />}

        {retryError && (
          <p className="font-ekstra mb-4" style={{ fontSize: "0.85rem", color: "#e85c5c", lineHeight: 1.6 }}>
            {retryError}
          </p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <button
            onClick={handleRetry}
            disabled={retrying}
            className="font-ekstra uppercase rounded-full"
            style={{
              background: retrying ? "rgba(53,56,63,0.45)" : TEXT,
              color: "#e8e4dc", padding: "14px 40px",
              fontSize: 13, letterSpacing: "0.20em",
              border: "none", cursor: retrying ? "not-allowed" : "pointer",
            }}
          >
            {retrying ? retryMsg : "Zahlung erneut versuchen →"}
          </button>

          <button
            onClick={() => router.push("/account")}
            disabled={retrying}
            className="font-ekstra uppercase rounded-full"
            style={{
              background: "transparent", color: TEXT,
              padding: "14px 40px", fontSize: 13, letterSpacing: "0.20em",
              border: `1.5px solid rgba(53,56,63,0.22)`,
              cursor: retrying ? "not-allowed" : "pointer",
            }}
          >
            Zum Kundenkonto
          </button>

          <button
            onClick={() => router.push("/")}
            disabled={retrying}
            className="font-ekstra uppercase rounded-full"
            style={{
              background: "transparent", color: MUTED,
              padding: "14px 40px", fontSize: 13, letterSpacing: "0.20em",
              border: `1.5px solid rgba(53,56,63,0.12)`,
              cursor: retrying ? "not-allowed" : "pointer",
            }}
          >
            Zur Startseite
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default function CheckoutCancelPage() {
  return (
    <Suspense fallback={
      <div style={{ background: "#bcc0ca", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ ...card }}>
          <div style={{ margin: "0 auto", width: 48, height: 48, borderRadius: "50%",
            border: "3px solid rgba(53,56,63,0.12)", borderTop: "3px solid #35383f",
            animation: "spin 1s linear infinite" }} />
        </div>
      </div>
    }>
      <CancelContent />
    </Suspense>
  )
}
