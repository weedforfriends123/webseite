"use client"

export const dynamic = "force-dynamic"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Navbar } from "@/components/Navbar"
import { createClient } from "@/lib/supabase/client"

const TEXT  = "#35383f"
const MUTED = "rgba(53,56,63,0.55)"
const DIM   = "rgba(53,56,63,0.12)"

const IS: React.CSSProperties = {
  background: "rgba(255,255,255,0.72)",
  border: "1.5px solid rgba(53,56,63,0.20)",
  color: TEXT,
  boxShadow: "inset 0 1px 2px rgba(53,56,63,0.04)",
  fontSize: "max(16px, 0.875rem)",
}

const IFS: React.CSSProperties = {
  background: "rgba(255,255,255,0.96)",
  border: "1.5px solid rgba(53,56,63,0.52)",
  color: TEXT,
  outline: "none",
  boxShadow: "0 0 0 3px rgba(53,56,63,0.07)",
  fontSize: "max(16px, 0.875rem)",
}

export default function ForgotPasswordPage() {
  const supabase = createClient()
  const [email, setEmail] = useState("")
  const [foc,   setFoc]   = useState(false)
  const [busy,  setBusy]  = useState(false)
  const [sent,  setSent]  = useState(false)
  const [err,   setErr]   = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr("")
    setBusy(true)
    const origin = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/callback?next=/passwort-zuruecksetzen`,
    })
    setBusy(false)
    if (error) {
      setErr("Fehler beim Senden. Bitte versuche es erneut.")
      return
    }
    setSent(true)
  }

  return (
    <div style={{ background: "#bcc0ca", minHeight: "100vh", overflowX: "hidden" }}>
      <Navbar />

      <div
        className="relative flex items-center justify-center"
        style={{ zIndex: 1, minHeight: "100vh", padding: "clamp(88px,14vh,140px) clamp(16px,5vw,60px) 80px" }}
      >
        <div className="w-full" style={{ maxWidth: 440, position: "relative", zIndex: 1 }}>

          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center mb-12"
          >
            <Link href="/">
              <Image src="/logo.webp" alt="Weed For Friends" width={48} height={48}
                style={{ height: 48, width: "auto", filter: "brightness(0)" }} />
            </Link>
          </motion.div>

          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="sent"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-10"
              >
                <div
                  className="mx-auto mb-8 flex items-center justify-center"
                  style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(255,255,255,0.65)", border: `1.5px solid ${DIM}` }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={TEXT} strokeWidth="2" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h1 className="font-druk-wide uppercase leading-none mb-4" style={{ fontSize: "clamp(1.6rem, 5vw, 3rem)", color: TEXT }}>
                  E-Mail gesendet.
                </h1>
                <p className="font-ekstra" style={{ fontSize: "0.92rem", color: MUTED, lineHeight: 1.75 }}>
                  Wir haben dir einen Link zum Zurücksetzen deines Passworts an <strong style={{ color: TEXT }}>{email}</strong> gesendet.
                  Bitte überprüfe auch deinen Spam-Ordner.
                </p>
                <Link
                  href="/login"
                  className="font-ekstra uppercase inline-block mt-8"
                  style={{ fontSize: 11, letterSpacing: "0.24em", color: MUTED, textDecoration: "none" }}
                >
                  ← Zurück zur Anmeldung
                </Link>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="mb-10">
                  <h1 className="font-druk-wide uppercase leading-none" style={{ fontSize: "clamp(2rem, 6.5vw, 4.5rem)", color: TEXT, letterSpacing: "-0.03em" }}>
                    Passwort<br />vergessen.
                  </h1>
                  <p className="font-ekstra mt-3.5" style={{ fontSize: "0.92rem", color: MUTED, lineHeight: 1.7 }}>
                    Gib deine E-Mail-Adresse ein. Wir senden dir einen Link.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="flex flex-col gap-2">
                    <label className="font-ekstra uppercase" style={{ fontSize: 10, letterSpacing: "0.28em", color: MUTED }}>
                      E-Mail
                    </label>
                    <input
                      type="email" required value={email} placeholder="deine@email.de"
                      onChange={e => setEmail(e.target.value)}
                      onFocus={() => setFoc(true)} onBlur={() => setFoc(false)}
                      className="w-full px-5 py-4 rounded-xl placeholder:opacity-40 font-ekstra"
                      style={foc ? IFS : IS}
                    />
                  </div>

                  {err && (
                    <p className="font-ekstra" style={{ fontSize: "0.88rem", color: "#c0392b" }}>{err}</p>
                  )}

                  <div style={{ height: 1, background: DIM }} />

                  <button
                    type="submit" disabled={busy}
                    className="w-full py-4 font-ekstra uppercase rounded-full transition-all duration-200 disabled:opacity-40"
                    style={{ background: TEXT, color: "#e8e4dc", letterSpacing: "0.22em", fontSize: 13 }}
                  >
                    {busy ? "Einen Moment…" : "Link senden"}
                  </button>
                </form>

                <p className="font-ekstra uppercase mt-8 text-center" style={{ fontSize: 11, letterSpacing: "0.20em", color: "rgba(53,56,63,0.40)" }}>
                  <Link href="/login" style={{ color: TEXT, textDecoration: "underline" }}>
                    ← Zurück zur Anmeldung
                  </Link>
                </p>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  )
}
