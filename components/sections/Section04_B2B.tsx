"use client"

import { useState } from "react"
import { motion, useReducedMotion } from "framer-motion"

const BG     = "#35383f"
const TEXT   = "#bcc0ca"
const DIM    = "rgba(188,192,202,0.42)"
const ACCENT = "#eddc8c"

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.04 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } },
}
const fadeIn = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 1, ease: "easeOut" } },
}

const STATS = [
  { value: "400+", label: "Aktive Händler" },
  { value: "12",   label: "EU-Länder"      },
  { value: "24h",  label: "Lieferzeit"     },
  { value: "A+",   label: "Labortest"      },
]

const BENEFITS = [
  {
    num: "01",
    title: "Großhandel",
    body: "Günstige Einkaufspreise ab Mindestbestellmenge. Staffelpreise und flexible Zahlungskonditionen.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="12" y1="22.08" x2="12" y2="12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    num: "02",
    title: "White Label",
    body: "Dein Branding auf unseren Produkten. Apothekenqualität, EU-zertifiziert — unter deinem Label.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 20h9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    num: "03",
    title: "Support",
    body: "Persönlicher Ansprechpartner, schnelle Reaktionszeiten und vollständiges Marketing-Material.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    num: "04",
    title: "Compliance",
    body: "Vollständige Dokumentation, Laborberichte und EU-konforme Zertifizierung für den rechtssicheren Handel.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="9 12 11 14 15 10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
]

function BenefitCard({ num, title, body, icon }: typeof BENEFITS[0]) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      variants={fadeUp}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -6, transition: { duration: 0.3, ease: "easeOut" } }}
      style={{
        background: hovered ? "rgba(188,192,202,0.09)" : "rgba(188,192,202,0.05)",
        border: `1px solid ${hovered ? "rgba(188,192,202,0.16)" : "rgba(188,192,202,0.09)"}`,
        borderRadius: 18,
        padding: "clamp(20px,2.4vw,36px)",
        display: "flex", flexDirection: "column",
        gap: "clamp(14px,1.8vh,22px)",
        cursor: "default",
        transition: "background 0.25s, border-color 0.25s",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span className="font-druk" style={{ fontSize: 12, color: "rgba(188,192,202,0.22)", letterSpacing: "0.1em" }}>
          {num}
        </span>
        <span style={{ color: ACCENT, opacity: 0.85 }}>{icon}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <p className="font-druk" style={{ color: TEXT, fontSize: "clamp(16px,1.3vw,21px)", margin: 0, letterSpacing: "-0.01em" }}>
          {title}
        </p>
        <p className="font-ekstra" style={{ color: DIM, fontSize: "clamp(13px,0.9vw,15px)", lineHeight: 1.7, margin: 0 }}>
          {body}
        </p>
      </div>
    </motion.div>
  )
}

export function Section04_B2B() {
  const noMotion = useReducedMotion()

  return (
    <section style={{ background: BG, position: "relative", overflow: "hidden" }}>

      {/* Background watermark */}
      <div aria-hidden className="hidden md:block" style={{
        position: "absolute", bottom: "-8%", right: "-2%",
        fontSize: "clamp(160px,28vw,480px)", lineHeight: 1,
        color: "transparent",
        WebkitTextStroke: "1.5px rgba(188,192,202,0.055)",
        fontFamily: "'Druk Wide', sans-serif",
        letterSpacing: "-0.04em",
        pointerEvents: "none", userSelect: "none", whiteSpace: "nowrap",
      }}>B2B</div>

      <div style={{
        position: "relative", zIndex: 1,
        padding: "clamp(60px,10vh,140px) clamp(20px,6vw,96px) 0",
        maxWidth: 1400, margin: "0 auto",
      }}>

        {/* ── HEADER ──────────────────────────────────────────────────────── */}
        <motion.div
          variants={container}
          initial={noMotion ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="flex flex-col md:grid md:grid-cols-[1.1fr_1fr]"
          style={{ gap: "clamp(28px,5vw,80px)", alignItems: "end", marginBottom: "clamp(40px,7vh,90px)" }}
        >
          {/* Headline */}
          <div>
            <motion.div variants={fadeIn} style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: "clamp(14px,2.2vh,24px)" }}>
              <span style={{ width: 22, height: 1, background: ACCENT, display: "block" }} />
              <span className="font-ekstra" style={{ color: ACCENT, fontSize: "clamp(10px,0.8vw,12px)", letterSpacing: "0.28em", textTransform: "uppercase" }}>
                Für Händler &amp; Partner
              </span>
            </motion.div>
            <motion.h2 variants={fadeUp} className="font-druk-wide uppercase"
              style={{ lineHeight: 0.88, letterSpacing: "-0.02em", fontSize: "clamp(52px,7.5vw,128px)", margin: 0 }}>
              <span style={{ display: "block", color: "transparent", WebkitTextStroke: `2px ${TEXT}` }}>Werde</span>
              <span style={{ display: "block", color: TEXT }}>Partner.</span>
            </motion.h2>
          </div>

          {/* Pitch + CTA */}
          <motion.div variants={fadeUp} style={{ display: "flex", flexDirection: "column", gap: "clamp(18px,2.8vh,30px)" }}>
            <p className="font-ekstra" style={{ color: DIM, fontSize: "clamp(15px,1.35vw,22px)", lineHeight: 1.72, margin: 0 }}>
              Bring WEEDFORFRIENDS in deinen Store. Wir bieten Großhandelspreise,
              White-Label-Optionen und persönlichen Support — damit du dich auf
              dein Business konzentrieren kannst.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <a href="/b2b" className="font-druk-wide uppercase" style={{
                display: "inline-flex", alignItems: "center",
                background: ACCENT, color: BG, borderRadius: 999,
                padding: "4px 28px 4px 4px",
                fontSize: "clamp(12px,0.95vw,14px)", letterSpacing: "0.05em",
                textDecoration: "none",
              }}>
                <span style={{
                  width: 40, height: 40, borderRadius: "50%", background: BG,
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  marginRight: 14, flexShrink: 0,
                }}>
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                    <path d="M2 12L12 2M12 2H4M12 2V10" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                Jetzt anfragen
              </a>
              <a href="mailto:b2b@weedforfriends.com" className="font-ekstra" style={{
                color: DIM, fontSize: "clamp(13px,0.95vw,15px)", textDecoration: "none", transition: "color .2s",
              }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = TEXT}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = DIM}
              >
                b2b@weedforfriends.com
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* ── STATS ───────────────────────────────────────────────────────── */}
        {/* gap-as-border: container bg = divider color, cells bg = section bg */}
        <motion.div
          variants={container}
          initial={noMotion ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-2 md:grid-cols-4"
          style={{
            gap: "1px",
            background: "rgba(188,192,202,0.1)",
            borderTop: "1px solid rgba(188,192,202,0.1)",
            borderBottom: "1px solid rgba(188,192,202,0.1)",
            marginBottom: "clamp(40px,7vh,90px)",
          }}
        >
          {STATS.map(({ value, label }) => (
            <motion.div key={label} variants={fadeUp}
              style={{ background: BG, padding: "clamp(20px,3.2vh,38px) clamp(14px,1.8vw,28px)", display: "flex", flexDirection: "column", gap: 6 }}>
              <span className="font-druk" style={{ fontSize: "clamp(30px,4vw,60px)", lineHeight: 1, letterSpacing: "-0.03em", color: ACCENT }}>
                {value}
              </span>
              <span className="font-ekstra" style={{ color: DIM, fontSize: "clamp(11px,0.8vw,13px)", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                {label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* ── BENEFIT CARDS ───────────────────────────────────────────────── */}
        <motion.div
          variants={container}
          initial={noMotion ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4"
          style={{ gap: "clamp(10px,1.2vw,16px)", paddingBottom: "clamp(60px,10vh,140px)" }}
        >
          {BENEFITS.map(b => <BenefitCard key={b.title} {...b} />)}
        </motion.div>

      </div>
    </section>
  )
}
