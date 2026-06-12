"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
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

export default function ResetPasswordPage() {
  const supabase = createClient()
  const router   = useRouter()

  const [password,  setPassword]  = useState("")
  const [password2, setPassword2] = useState("")
  const [showPass,  setShowPass]  = useState(false)
  const [foc,       setFoc]       = useState("")
  const [busy,      setBusy]      = useState(false)
  const [done,      setDone]      = useState(false)
  const [err,       setErr]       = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr("")
    if (password !== password2) {
      setErr("Die Passwörter stimmen nicht überein.")
      return
    }
    if (password.length < 6) {
      setErr("Das Passwort muss mindestens 6 Zeichen lang sein.")
      return
    }
    setBusy(true)
    const { error } = await supabase.auth.updateUser({ password })
    setBusy(false)
    if (error) {
      setErr(error.message === "Auth session missing!"
        ? "Dieser Link ist abgelaufen. Bitte fordere einen neuen an."
        : "Fehler beim Speichern. Bitte versuche es erneut.")
      return
    }
    setDone(true)
    setTimeout(() => router.push("/account"), 2500)
  }

  return (
    <div style={{ background: "#bcc0ca", minHeight: "100vh", overflowX: "hidden" }}>
      <Navbar />

      <div
        className="relative flex items-center justify-center"
        style={{ zIndex: 1, minHeight: "100vh", padding: "clamp(88px,14vh,140px) clamp(16px,5vw,60px) 80px" }}
      >
        <div className="w-full" style={{ maxWidth: 440 }}>

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
            {done ? (
              <motion.div
                key="done"
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
                  Passwort gesetzt.
                </h1>
                <p className="font-ekstra" style={{ fontSize: "0.92rem", color: MUTED, lineHeight: 1.75 }}>
                  Dein Passwort wurde erfolgreich geändert.<br />Du wirst weitergeleitet…
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="mb-10">
                  <h1 className="font-druk-wide uppercase leading-none" style={{ fontSize: "clamp(2rem, 6.5vw, 4.5rem)", color: TEXT, letterSpacing: "-0.03em" }}>
                    Neues<br />Passwort.
                  </h1>
                  <p className="font-ekstra mt-3.5" style={{ fontSize: "0.92rem", color: MUTED, lineHeight: 1.7 }}>
                    Wähle ein neues sicheres Passwort für dein Konto.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="flex flex-col gap-2">
                    <label className="font-ekstra uppercase" style={{ fontSize: 10, letterSpacing: "0.28em", color: MUTED }}>
                      Neues Passwort
                    </label>
                    <div className="relative">
                      <input
                        type={showPass ? "text" : "password"} required value={password}
                        placeholder="Mindestens 6 Zeichen" minLength={6}
                        onChange={e => setPassword(e.target.value)}
                        onFocus={() => setFoc("p1")} onBlur={() => setFoc("")}
                        className="w-full px-5 py-4 pr-12 rounded-xl placeholder:opacity-40 font-ekstra"
                        style={foc === "p1" ? IFS : IS}
                      />
                      <button
                        type="button" onClick={() => setShowPass(v => !v)}
                        className="absolute right-4 top-1/2 -translate-y-1/2"
                        style={{ color: "rgba(53,56,63,0.40)" }} tabIndex={-1}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                          {showPass
                            ? <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
                            : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                          }
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-ekstra uppercase" style={{ fontSize: 10, letterSpacing: "0.28em", color: MUTED }}>
                      Passwort bestätigen
                    </label>
                    <input
                      type={showPass ? "text" : "password"} required value={password2}
                      placeholder="Passwort wiederholen" minLength={6}
                      onChange={e => setPassword2(e.target.value)}
                      onFocus={() => setFoc("p2")} onBlur={() => setFoc("")}
                      className="w-full px-5 py-4 rounded-xl placeholder:opacity-40 font-ekstra"
                      style={foc === "p2" ? IFS : IS}
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
                    {busy ? "Speichern…" : "Passwort speichern"}
                  </button>
                </form>

                <p className="font-ekstra uppercase mt-8 text-center" style={{ fontSize: 11, letterSpacing: "0.20em", color: "rgba(53,56,63,0.40)" }}>
                  <Link href="/login" style={{ color: "rgba(53,56,63,0.50)", textDecoration: "underline" }}>
                    Zurück zur Anmeldung
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
