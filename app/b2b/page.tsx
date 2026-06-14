"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { createClient } from "@/lib/supabase/client"

const TEXT   = "#35383f"
const MUTED  = "rgba(53,56,63,0.55)"
const DIM    = "rgba(53,56,63,0.12)"
const ACCENT = "#eddc8c"

const STATS = [
  { value: "400+", label: "Aktive Partner" },
  { value: "12",   label: "EU-Länder" },
  { value: "24h",  label: "Lieferzeit" },
  { value: "A+",   label: "Labortest" },
]

const PERKS = [
  {
    num: "01",
    title: "Großhandel",
    body: "Staffelpreise ab 10 Einheiten. Flexible Zahlungskonditionen und dedizierter Account-Manager.",
  },
  {
    num: "02",
    title: "White Label",
    body: "Dein Branding auf unseren Produkten. EU-zertifiziert, laborgeprüft — unter deinem Label.",
  },
  {
    num: "03",
    title: "COA-Dokumentation",
    body: "Vollständige Laborberichte und Zertifikate direkt aus deinem Partner-Portal abrufbar.",
  },
  {
    num: "04",
    title: "Support & Marketing",
    body: "Persönlicher Ansprechpartner, 24h Reaktionszeit und vollständiges Marketing-Material.",
  },
]

const BUSINESS_TYPES = [
  "Einzelhandel (stationär)", "Online-Shop", "Gastronomie / Café",
  "Apotheke / Drogerie", "Großhandel / Distributor", "Sonstiges",
]
const VOLUMES = [
  "Bis 100 Einheiten / Monat", "100–500 Einheiten / Monat",
  "500–1.000 Einheiten / Monat", "1.000+ Einheiten / Monat",
]

type F = {
  company: string; contact: string; email: string; phone: string
  vat: string; type: string; volume: string; message: string; privacy: boolean
}
const INIT: F = {
  company: "", contact: "", email: "", phone: "",
  vat: "", type: "", volume: "", message: "", privacy: false,
}

const IS = {
  background: "rgba(255,255,255,0.72)",
  border: "1.5px solid rgba(53,56,63,0.20)",
  color: TEXT,
  fontFamily: "inherit",
  boxShadow: "inset 0 1px 2px rgba(53,56,63,0.04)",
  fontSize: "max(16px, 0.875rem)",
} as React.CSSProperties

const IFS = {
  background: "rgba(255,255,255,0.96)",
  border: "1.5px solid rgba(53,56,63,0.52)",
  color: TEXT,
  fontFamily: "inherit",
  outline: "none",
  boxShadow: "0 0 0 3px rgba(53,56,63,0.07)",
  fontSize: "max(16px, 0.875rem)",
} as React.CSSProperties

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-ekstra uppercase" style={{ fontSize: 11, letterSpacing: "0.30em", color: "rgba(53,56,63,0.40)" }}>
      {children}
    </p>
  )
}

export default function B2BPage() {
  const supabase = createClient()
  const [f, setF]       = useState<F>(INIT)
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [err,  setErr]  = useState("")
  const [foc, setFoc]   = useState("")
  const set = (k: keyof F, v: string | boolean) => setF(p => ({ ...p, [k]: v }))

  const s = (name: string) => (foc === name ? IFS : IS)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr("")
    setBusy(true)
    const { error } = await supabase.from("b2b_requests").insert({
      company:       f.company,
      contact:       f.contact,
      email:         f.email,
      phone:         f.phone || null,
      vat:           f.vat   || null,
      business_type: f.type  || null,
      volume:        f.volume || null,
      message:       f.message || null,
    })
    setBusy(false)
    if (error) { setErr("Fehler beim Senden. Bitte erneut versuchen."); return }

    // Fire notification email (non-blocking)
    fetch("/api/email/b2b-notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company: f.company, contact: f.contact, email: f.email, phone: f.phone, business_type: f.type, volume: f.volume, message: f.message }),
    }).catch(() => {})

    setSent(true)
  }

  const sharedInput = "w-full px-5 py-4 rounded-xl text-sm placeholder:opacity-40"

  return (
    <div style={{ background: "#bcc0ca", minHeight: "100vh" }}>
      <Navbar />

      {/* Ghost decoration */}
      <div
        aria-hidden
        className="fixed bottom-0 right-0 pointer-events-none select-none overflow-hidden"
        style={{ zIndex: 0 }}
      >
        <p
          className="font-druk-wide uppercase leading-none"
          style={{ fontSize: "clamp(8rem, 42vw, 56rem)", color: "rgba(53,56,63,0.036)", letterSpacing: "-0.04em" }}
        >
          B2B
        </p>
      </div>

      <div className="relative" style={{ zIndex: 1 }}>
        <div
          className="max-w-7xl mx-auto"
          style={{ padding: "clamp(88px,14vh,160px) clamp(16px,5vw,80px) clamp(64px,10vh,140px)" }}
        >

          {/* ─── SECTION 1 — Headline ─── */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ paddingBottom: "clamp(44px,7vh,72px)" }}
          >
            <SectionLabel>B2B · Partnerschaft</SectionLabel>
            <h1
              className="font-druk-wide uppercase leading-none mt-5"
              style={{ fontSize: "clamp(3.8rem, 10vw, 10.5rem)", letterSpacing: "-0.03em", color: TEXT }}
            >
              Werde<br />Partner.
            </h1>
            <p
              className="font-ekstra mt-6"
              style={{ fontSize: "clamp(0.92rem, 1.15vw, 1.05rem)", color: MUTED, lineHeight: 1.82, maxWidth: 480 }}
            >
              Großhandel, White Label und Dropshipping — direkt vom Hersteller.
              EU-zertifiziert, laborgeprüft, diskret.
            </p>
          </motion.div>

          {/* ─── SECTION 2 — Stats ─── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.18, duration: 0.7 }}
          >
            <div
              className="grid grid-cols-2 sm:grid-cols-4"
              style={{
                borderTop: `1px solid ${DIM}`,
                borderBottom: `1px solid ${DIM}`,
              }}
            >
              {STATS.map((s, i) => (
                <div
                  key={s.label}
                  className={[
                    "flex flex-col py-6 sm:py-7 px-4 sm:px-8",
                    (i === 1 || i === 3) ? "border-l border-[rgba(53,56,63,0.12)]" : "",
                    i >= 2 ? "border-t border-[rgba(53,56,63,0.12)] sm:border-t-0" : "",
                    i >= 1 ? "sm:border-l sm:border-[rgba(53,56,63,0.12)]" : "",
                  ].join(" ")}
                  style={i === 0 ? { paddingLeft: 0 } : undefined}
                >
                  <span
                    className="font-druk-wide uppercase leading-none"
                    style={{ fontSize: "clamp(2rem, 4vw, 3.6rem)", color: TEXT }}
                  >
                    {s.value}
                  </span>
                  <span
                    className="font-ekstra uppercase mt-2"
                    style={{ fontSize: 10, letterSpacing: "0.24em", color: MUTED }}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ─── SECTION 3 — Two-column ─── */}
          <div
            className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-x-16 gap-y-12 items-start"
            style={{ paddingTop: "clamp(48px,8vh,88px)" }}
          >

            {/* LEFT — perks (shown second on mobile) */}
            <motion.div
              className="order-last lg:order-first"
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.22, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            >
              <SectionLabel>Was du bekommst</SectionLabel>

              <div className="mt-7">
                {PERKS.map((p, i) => (
                  <motion.div
                    key={p.num}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.28 + i * 0.07 }}
                    className="flex gap-7 py-7"
                    style={{ borderBottom: `1px solid ${DIM}` }}
                  >
                    <span
                      className="font-druk-wide leading-none shrink-0"
                      style={{ fontSize: "clamp(1.6rem, 2.2vw, 2.4rem)", color: "rgba(53,56,63,0.14)", marginTop: 3 }}
                    >
                      {p.num}
                    </span>
                    <div>
                      <p
                        className="font-druk-wide uppercase leading-none mb-2.5"
                        style={{ fontSize: "clamp(1rem, 1.4vw, 1.3rem)", color: TEXT }}
                      >
                        {p.title}
                      </p>
                      <p
                        className="font-ekstra"
                        style={{ fontSize: "clamp(0.88rem, 1vw, 0.95rem)", color: MUTED, lineHeight: 1.78 }}
                      >
                        {p.body}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Quote */}
              <div className="mt-10 pl-6" style={{ borderLeft: `2.5px solid ${ACCENT}` }}>
                <p
                  className="font-mindflow"
                  style={{ fontSize: "clamp(1rem, 1.3vw, 1.2rem)", color: "rgba(53,56,63,0.65)", lineHeight: 1.72 }}
                >
                  „Unser Umsatz hat sich in drei Monaten verdoppelt. Support und Dokumentation — erstklassig."
                </p>
                <p className="font-ekstra uppercase mt-3" style={{ fontSize: 10, letterSpacing: "0.22em", color: "rgba(53,56,63,0.32)" }}>
                  M. Fischer · GreenLeaf Store, Berlin
                </p>
              </div>
            </motion.div>

            {/* RIGHT — form (shown first on mobile) */}
            <motion.div
              className="order-first lg:order-last"
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.28, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            >
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div
                    key="ok"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-24"
                  >
                    <div
                      className="mx-auto mb-8 flex items-center justify-center"
                      style={{
                        width: 72, height: 72, borderRadius: "50%",
                        background: "rgba(255,255,255,0.65)",
                        border: `1.5px solid ${DIM}`,
                      }}
                    >
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={TEXT} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                    <h2 className="font-druk-wide uppercase leading-none mb-4" style={{ fontSize: "clamp(2rem, 3.2vw, 3rem)", color: TEXT }}>
                      Anfrage erhalten.
                    </h2>
                    <p className="font-ekstra mb-10" style={{ color: MUTED, fontSize: "0.95rem", lineHeight: 1.78 }}>
                      Dein persönlicher Account-Manager meldet sich innerhalb 24h.
                    </p>
                    <button
                      onClick={() => setSent(false)}
                      className="font-ekstra uppercase"
                      style={{ fontSize: 11, letterSpacing: "0.22em", color: MUTED }}
                    >
                      Weitere Anfrage senden →
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="form">
                    {/* Form header */}
                    <div className="mb-8">
                      <SectionLabel>Partneranfrage</SectionLabel>
                      <h2
                        className="font-druk-wide uppercase leading-none mt-3"
                        style={{ fontSize: "clamp(1.7rem, 2.5vw, 2.4rem)", color: TEXT }}
                      >
                        Jetzt anfragen.
                      </h2>
                      <p className="font-ekstra mt-2.5" style={{ fontSize: "0.9rem", color: MUTED, lineHeight: 1.7 }}>
                        Wir melden uns innerhalb 24 Stunden.
                      </p>
                    </div>

                    <form onSubmit={submit} className="space-y-4">

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          { key: "company", label: "Firmenname *", ph: "GmbH / KG / e.K.", type: "text" },
                          { key: "contact", label: "Ansprechpartner *", ph: "Vor- und Nachname", type: "text" },
                        ].map(({ key, label, ph, type }) => (
                          <div key={key} className="flex flex-col gap-2">
                            <label className="font-ekstra uppercase" style={{ fontSize: 10, letterSpacing: "0.28em", color: MUTED }}>
                              {label}
                            </label>
                            <input
                              type={type} required value={(f as unknown as Record<string, string>)[key]} placeholder={ph}
                              onChange={e => set(key as keyof F, e.target.value)}
                              onFocus={() => setFoc(key)} onBlur={() => setFoc("")}
                              className={sharedInput}
                              style={s(key)}
                            />
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          { key: "email", label: "E-Mail *", ph: "kontakt@firma.de", type: "email" },
                          { key: "phone", label: "Telefon *", ph: "+49 …", type: "tel" },
                        ].map(({ key, label, ph, type }) => (
                          <div key={key} className="flex flex-col gap-2">
                            <label className="font-ekstra uppercase" style={{ fontSize: 10, letterSpacing: "0.28em", color: MUTED }}>
                              {label}
                            </label>
                            <input
                              type={type} required value={(f as unknown as Record<string, string>)[key]} placeholder={ph}
                              onChange={e => set(key as keyof F, e.target.value)}
                              onFocus={() => setFoc(key)} onBlur={() => setFoc("")}
                              className={sharedInput}
                              style={s(key)}
                            />
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="font-ekstra uppercase" style={{ fontSize: 10, letterSpacing: "0.28em", color: MUTED }}>
                          USt-IdNr. / Steuernummer
                        </label>
                        <input
                          type="text" value={f.vat} placeholder="DE123456789 (optional)"
                          onChange={e => set("vat", e.target.value)}
                          onFocus={() => setFoc("vat")} onBlur={() => setFoc("")}
                          className={sharedInput}
                          style={s("vat")}
                        />
                      </div>

                      {/* Separator */}
                      <div style={{ height: 1, background: DIM, marginTop: 8, marginBottom: 4 }} />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          { key: "type", label: "Unternehmenstyp *", opts: BUSINESS_TYPES },
                          { key: "volume", label: "Monatsmenge *", opts: VOLUMES },
                        ].map(({ key, label, opts }) => (
                          <div key={key} className="flex flex-col gap-2">
                            <label className="font-ekstra uppercase" style={{ fontSize: 10, letterSpacing: "0.28em", color: MUTED }}>
                              {label}
                            </label>
                            <select
                              required value={(f as unknown as Record<string, string>)[key]}
                              onChange={e => set(key as keyof F, e.target.value)}
                              onFocus={() => setFoc(key)} onBlur={() => setFoc("")}
                              className={sharedInput + " appearance-none cursor-pointer"}
                              style={s(key)}
                            >
                              <option value="" disabled>Bitte wählen…</option>
                              {opts.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="font-ekstra uppercase" style={{ fontSize: 10, letterSpacing: "0.28em", color: MUTED }}>
                          Nachricht
                        </label>
                        <textarea
                          rows={4} value={f.message} placeholder="Beschreibung deines Unternehmens, besondere Anforderungen…"
                          onChange={e => set("message", e.target.value)}
                          onFocus={() => setFoc("msg")} onBlur={() => setFoc("")}
                          className={sharedInput + " resize-none"}
                          style={s("msg")}
                        />
                      </div>

                      {/* Privacy */}
                      <label className="flex items-start gap-3.5 cursor-pointer pt-1">
                        <div className="relative mt-0.5 shrink-0">
                          <input
                            type="checkbox" required checked={f.privacy}
                            onChange={e => set("privacy", e.target.checked)}
                            className="sr-only"
                          />
                          <div
                            className="w-[18px] h-[18px] rounded-md flex items-center justify-center transition-all duration-200"
                            style={{
                              background: f.privacy ? TEXT : "rgba(255,255,255,0.72)",
                              border: `1.5px solid ${f.privacy ? TEXT : "rgba(53,56,63,0.22)"}`,
                            }}
                          >
                            {f.privacy && (
                              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                                <polyline points="2 6 5 9 10 3" stroke="#e8e4dc" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                          </div>
                        </div>
                        <span className="font-ekstra" style={{ fontSize: "0.88rem", color: MUTED, lineHeight: 1.65 }}>
                          Ich habe die{" "}
                          <Link href="/datenschutz" style={{ color: TEXT, textDecoration: "underline" }}>Datenschutzerklärung</Link>
                          {" "}gelesen und akzeptiert.
                        </span>
                      </label>

                      {err && (
                        <p className="font-ekstra" style={{ fontSize: "0.88rem", color: "#c0392b" }}>{err}</p>
                      )}

                      <button
                        type="submit"
                        disabled={busy || !f.privacy}
                        className="w-full py-4 font-ekstra uppercase rounded-full transition-all duration-200 disabled:opacity-35"
                        style={{ background: TEXT, color: "#e8e4dc", letterSpacing: "0.22em", fontSize: 13, marginTop: 8 }}
                      >
                        {busy ? "Wird gesendet…" : "Partneranfrage absenden"}
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  )
}
