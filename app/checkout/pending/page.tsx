"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"

const TEXT  = "#35383f"
const MUTED = "rgba(53,56,63,0.55)"

function Row({ label, value, mono = false, large = false }: {
  label: string; value: string; mono?: boolean; large?: boolean
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span className="font-ekstra uppercase" style={{ fontSize: 9, letterSpacing: "0.22em", color: MUTED }}>
        {label}
      </span>
      <span
        className={mono ? "font-mono" : "font-ekstra"}
        style={{
          fontSize: large ? "clamp(1.1rem,2.5vw,1.4rem)" : "0.92rem",
          color: TEXT,
          letterSpacing: mono ? "0.06em" : undefined,
          wordBreak: "break-all",
        }}
      >
        {value}
      </span>
    </div>
  )
}

function PendingContent() {
  const params = useSearchParams()
  const ref    = params.get("ref")    ?? "—"
  const amount = params.get("amount") ?? "—"
  const iban   = params.get("iban")   ?? "—"
  const bic    = params.get("bic")    ?? "—"
  const owner  = params.get("owner")  ?? "—"
  const bank   = params.get("bank")   ?? "—"

  return (
    <div style={{ background: "#bcc0ca", minHeight: "100vh" }}>
      <div
        className="max-w-xl mx-auto"
        style={{ padding: "clamp(88px,14vh,156px) clamp(16px,5vw,64px) clamp(60px,10vh,120px)" }}
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 340, damping: 26 }}
          style={{
            width: 64, height: 64, borderRadius: "50%",
            background: "rgba(53,56,63,0.10)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, marginBottom: 24,
          }}
        >
          🏦
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="font-druk-wide uppercase leading-none mb-4"
          style={{ fontSize: "clamp(1.8rem,7vw,4.5rem)", letterSpacing: "-0.03em", color: TEXT }}
        >
          Fast geschafft
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="font-ekstra mb-10"
          style={{ fontSize: "0.92rem", color: MUTED, lineHeight: 1.7 }}
        >
          Bitte überweise den Betrag auf folgendes Konto. Sobald die Zahlung eingegangen ist,
          wird deine Bestellung bearbeitet (1–3 Werktage).
        </motion.p>

        {/* Bank details card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background: "rgba(255,255,255,0.55)",
            borderRadius: 20,
            border: "1px solid rgba(255,255,255,0.80)",
            padding: "clamp(22px,3vh,32px)",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <Row label="Empfänger"      value={owner} />
          <Row label="Bank"           value={bank} />
          <Row label="IBAN"           value={iban}  mono />
          <Row label="BIC / SWIFT"    value={bic}   mono />
          <div style={{ height: 1, background: "rgba(53,56,63,0.10)" }} />
          <Row label="Betrag"         value={`€ ${amount}`} large />
          <Row label="Verwendungszweck (Pflicht)" value={`Bestellung ${ref}`} mono />
        </motion.div>

        {/* Warning */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="mt-6 flex gap-3 items-start"
          style={{
            background: "rgba(53,56,63,0.06)",
            borderRadius: 14,
            border: "1px solid rgba(53,56,63,0.10)",
            padding: "14px 16px",
          }}
        >
          <span style={{ fontSize: 18, flexShrink: 0 }}>⚠️</span>
          <p className="font-ekstra" style={{ fontSize: "0.82rem", color: MUTED, lineHeight: 1.65 }}>
            Bitte gib den Verwendungszweck <strong style={{ color: TEXT }}>Bestellung {ref}</strong> exakt an,
            damit wir deine Zahlung zuordnen können.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="mt-8 flex gap-4 flex-wrap"
        >
          <Link
            href="/"
            className="font-ekstra uppercase"
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              height: 48, padding: "0 28px", borderRadius: 9999,
              background: TEXT, color: "#e8e4dc",
              fontSize: 11, letterSpacing: "0.20em",
              textDecoration: "none",
            }}
          >
            Zurück zum Shop
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default function PendingPage() {
  return (
    <Suspense>
      <PendingContent />
    </Suspense>
  )
}
