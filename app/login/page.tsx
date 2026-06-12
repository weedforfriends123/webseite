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

const IS = {
  background: "rgba(255,255,255,0.72)",
  border: "1.5px solid rgba(53,56,63,0.20)",
  color: TEXT,
  boxShadow: "inset 0 1px 2px rgba(53,56,63,0.04)",
  fontSize: "max(16px, 0.875rem)",
} as React.CSSProperties

const IFS = {
  background: "rgba(255,255,255,0.96)",
  border: "1.5px solid rgba(53,56,63,0.52)",
  color: TEXT,
  outline: "none",
  boxShadow: "0 0 0 3px rgba(53,56,63,0.07)",
  fontSize: "max(16px, 0.875rem)",
} as React.CSSProperties

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [tab,  setTab]  = useState<"login" | "register">("login")
  const [foc,  setFoc]  = useState("")
  const [err,  setErr]  = useState("")

  const [email,    setEmail]    = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const [first, setFirst] = useState("")
  const [last,  setLast]  = useState("")
  const [rMail, setRMail] = useState("")
  const [rPass, setRPass] = useState("")

  const [busy, setBusy]           = useState(false)
  const [registered, setRegistered] = useState(false)

  const s   = (name: string) => (foc === name ? IFS : IS)
  const cls = "w-full px-5 py-4 rounded-xl text-sm placeholder:opacity-40 font-ekstra"

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr("")
    setBusy(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setBusy(false)
    if (error) {
      setErr(
        error.message === "Invalid login credentials"
          ? "E-Mail oder Passwort ungültig."
          : error.message,
      )
      return
    }
    router.push("/account")
    router.refresh()
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr("")
    setBusy(true)
    const { error } = await supabase.auth.signUp({
      email: rMail,
      password: rPass,
      options: {
        data: { first_name: first, last_name: last },
      },
    })
    setBusy(false)
    if (error) {
      setErr(error.message)
      return
    }
    setRegistered(true)
  }

  return (
    <div style={{ background: "#bcc0ca", minHeight: "100vh", overflowX: "hidden" }}>
      <Navbar />

      <div
        className="relative flex items-center justify-center"
        style={{ zIndex: 1, minHeight: "100vh", padding: "clamp(88px,14vh,140px) clamp(16px,5vw,60px) 80px" }}
      >
        {/* Ghost text — absolute so it's clipped by the container */}
        <div
          aria-hidden
          className="absolute inset-0 flex items-end pointer-events-none select-none overflow-hidden"
          style={{ zIndex: 0 }}
        >
          <p
            className="font-druk-wide uppercase leading-none w-full text-right"
            style={{ fontSize: "clamp(8rem, 30vw, 52rem)", color: "rgba(53,56,63,0.034)", letterSpacing: "-0.04em" }}
          >
            WFF
          </p>
        </div>
        <div className="w-full" style={{ maxWidth: 496 }}>

          {/* ─── Logo ─── */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center mb-12"
          >
            <Link href="/">
              <Image
                src="/logo.webp"
                alt="Weed For Friends"
                width={52}
                height={52}
                style={{ height: 52, width: "auto", filter: "brightness(0)" }}
              />
            </Link>
          </motion.div>

          {/* ─── Tab toggle ─── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="flex justify-center gap-10 mb-12"
            style={{ borderBottom: `1px solid ${DIM}` }}
          >
            {(["login", "register"] as const).map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setErr("") }}
                className="font-ekstra uppercase transition-all duration-200"
                style={{
                  fontSize: 12,
                  letterSpacing: "0.28em",
                  color: tab === t ? TEXT : "rgba(53,56,63,0.38)",
                  paddingBottom: 14,
                  borderBottom: tab === t ? `2px solid ${TEXT}` : "2px solid transparent",
                  marginBottom: -1,
                }}
              >
                {t === "login" ? "Anmelden" : "Registrieren"}
              </button>
            ))}
          </motion.div>

          {/* ─── Forms ─── */}
          <AnimatePresence mode="wait">
            {tab === "login" ? (

              <motion.div
                key="login"
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 14 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="mb-10">
                  <h1
                    className="font-druk-wide uppercase leading-none"
                    style={{ fontSize: "clamp(2rem, 6.5vw, 5rem)", color: TEXT, letterSpacing: "-0.03em" }}
                  >
                    Willkommen<br />zurück.
                  </h1>
                  <p className="font-ekstra mt-3.5" style={{ fontSize: "0.95rem", color: MUTED, lineHeight: 1.7 }}>
                    Melde dich an, um fortzufahren.
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">

                  <div className="flex flex-col gap-2">
                    <label className="font-ekstra uppercase" style={{ fontSize: 10, letterSpacing: "0.28em", color: MUTED }}>
                      E-Mail
                    </label>
                    <input
                      type="email" required value={email} placeholder="deine@email.de"
                      onChange={e => setEmail(e.target.value)}
                      onFocus={() => setFoc("em")} onBlur={() => setFoc("")}
                      className={cls} style={s("em")}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <label className="font-ekstra uppercase" style={{ fontSize: 10, letterSpacing: "0.28em", color: MUTED }}>
                        Passwort
                      </label>
                      <Link
                        href="/passwort-vergessen"
                        className="font-ekstra uppercase"
                        style={{ fontSize: 10, letterSpacing: "0.20em", color: "rgba(53,56,63,0.40)", textDecoration: "none" }}
                      >
                        Vergessen?
                      </Link>
                    </div>
                    <div className="relative">
                      <input
                        type={showPass ? "text" : "password"} required value={password}
                        placeholder="••••••••"
                        onChange={e => setPassword(e.target.value)}
                        onFocus={() => setFoc("pw")} onBlur={() => setFoc("")}
                        className={cls + " pr-12"} style={s("pw")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(v => !v)}
                        className="absolute right-4 top-1/2 -translate-y-1/2"
                        style={{ color: "rgba(53,56,63,0.40)" }}
                        tabIndex={-1}
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

                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative shrink-0">
                      <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="sr-only" />
                      <div
                        className="w-[18px] h-[18px] rounded-md flex items-center justify-center transition-all duration-200"
                        style={{
                          background: remember ? TEXT : "rgba(255,255,255,0.72)",
                          border: `1.5px solid ${remember ? TEXT : "rgba(53,56,63,0.22)"}`,
                        }}
                      >
                        {remember && (
                          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                            <polyline points="2 6 5 9 10 3" stroke="#e8e4dc" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="font-ekstra" style={{ fontSize: "0.88rem", color: MUTED }}>Angemeldet bleiben</span>
                  </label>

                  {/* Error */}
                  {err && (
                    <p className="font-ekstra" style={{ fontSize: "0.88rem", color: "#c0392b" }}>{err}</p>
                  )}

                  <div style={{ height: 1, background: DIM }} />

                  <button
                    type="submit" disabled={busy}
                    className="w-full py-4 font-ekstra uppercase rounded-full transition-all duration-200 disabled:opacity-40"
                    style={{ background: TEXT, color: "#e8e4dc", letterSpacing: "0.22em", fontSize: 13 }}
                  >
                    {busy ? "Einen Moment…" : "Anmelden"}
                  </button>
                </form>

                <p className="font-ekstra uppercase mt-8 text-center" style={{ fontSize: 11, letterSpacing: "0.20em", color: "rgba(53,56,63,0.40)" }}>
                  Neu hier?{" "}
                  <button
                    onClick={() => { setTab("register"); setErr("") }}
                    style={{ color: TEXT, textDecoration: "underline", background: "none", border: "none", cursor: "pointer", fontSize: "inherit", letterSpacing: "inherit" }}
                  >
                    Jetzt registrieren
                  </button>
                </p>
              </motion.div>

            ) : (

              <motion.div
                key="register"
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -14 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              >
                {registered ? (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-16"
                  >
                    <div
                      className="mx-auto mb-8 flex items-center justify-center"
                      style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(255,255,255,0.65)", border: `1.5px solid ${DIM}` }}
                    >
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={TEXT} strokeWidth="2" strokeLinecap="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                    <h2 className="font-druk-wide uppercase leading-none mb-4" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: TEXT }}>
                      Fast fertig.
                    </h2>
                    <p className="font-ekstra" style={{ fontSize: "0.95rem", color: MUTED, lineHeight: 1.75 }}>
                      Wir haben dir eine Bestätigungs-E-Mail geschickt.<br />
                      Klicke auf den Link, um dein Konto zu aktivieren.
                    </p>
                  </motion.div>
                ) : (
                  <>
                    <div className="mb-10">
                      <h1
                        className="font-druk-wide uppercase leading-none"
                        style={{ fontSize: "clamp(2rem, 6.5vw, 5rem)", color: TEXT, letterSpacing: "-0.03em" }}
                      >
                        Konto<br />erstellen.
                      </h1>
                      <p className="font-ekstra mt-3.5" style={{ fontSize: "0.95rem", color: MUTED, lineHeight: 1.7 }}>
                        Jetzt anmelden und Treuepunkte sammeln.
                      </p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-5">

                      <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        {[
                          { label: "Vorname", val: first, set: setFirst, key: "fn" },
                          { label: "Nachname", val: last,  set: setLast,  key: "ln" },
                        ].map(({ label, val, set: s2, key }) => (
                          <div key={key} className="flex flex-col gap-2">
                            <label className="font-ekstra uppercase" style={{ fontSize: 10, letterSpacing: "0.28em", color: MUTED }}>
                              {label}
                            </label>
                            <input
                              type="text" required value={val} placeholder={label}
                              onChange={e => s2(e.target.value)}
                              onFocus={() => setFoc(key)} onBlur={() => setFoc("")}
                              className={cls} style={s(key)}
                            />
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="font-ekstra uppercase" style={{ fontSize: 10, letterSpacing: "0.28em", color: MUTED }}>E-Mail</label>
                        <input
                          type="email" required value={rMail} placeholder="deine@email.de"
                          onChange={e => setRMail(e.target.value)}
                          onFocus={() => setFoc("rm")} onBlur={() => setFoc("")}
                          className={cls} style={s("rm")}
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="font-ekstra uppercase" style={{ fontSize: 10, letterSpacing: "0.28em", color: MUTED }}>Passwort</label>
                        <input
                          type="password" required value={rPass} placeholder="Mindestens 6 Zeichen"
                          minLength={6}
                          onChange={e => setRPass(e.target.value)}
                          onFocus={() => setFoc("rp")} onBlur={() => setFoc("")}
                          className={cls} style={s("rp")}
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
                        {busy ? "Einen Moment…" : "Konto erstellen"}
                      </button>
                    </form>

                    <p className="font-ekstra uppercase mt-8 text-center" style={{ fontSize: 11, letterSpacing: "0.20em", color: "rgba(53,56,63,0.40)" }}>
                      Bereits Konto?{" "}
                      <button
                        onClick={() => { setTab("login"); setErr("") }}
                        style={{ color: TEXT, textDecoration: "underline", background: "none", border: "none", cursor: "pointer", fontSize: "inherit", letterSpacing: "inherit" }}
                      >
                        Anmelden
                      </button>
                    </p>
                  </>
                )}
              </motion.div>

            )}
          </AnimatePresence>

          <p className="font-ekstra uppercase mt-12 text-center" style={{ fontSize: 10, letterSpacing: "0.22em", color: "rgba(53,56,63,0.28)" }}>
            Händler?{" "}
            <Link href="/b2b" style={{ color: "rgba(53,56,63,0.48)", textDecoration: "underline" }}>
              B2B-Partneranfrage
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}
