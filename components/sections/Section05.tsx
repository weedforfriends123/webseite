"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"

const BG   = "#bcc0ca"
const TEXT = "#35383f"
const DIM  = "rgba(53,56,63,0.10)"
const MUTED = "rgba(53,56,63,0.45)"

const ROWS = [
  "Lab-zertifiziert (COA)",
  "EU-zertifiziert",
  "Echter Wirkstoffgehalt",
  "Transparente Inhaltsstoffe",
  "Kein Nikotin · Kein Tabak",
  "Echte Terpene",
  "Gleichmäßige Dampfqualität",
]

function Check() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <polyline points="3 9 7 13 15 5" stroke={TEXT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Cross() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <line x1="3" y1="3" x2="13" y2="13" stroke={MUTED} strokeWidth="1.6" strokeLinecap="round" />
      <line x1="13" y1="3" x2="3" y2="13" stroke={MUTED} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

export function Section05() {
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const imgY    = useTransform(scrollYProgress, [0, 1], [-40, 40])
  const tableY  = useTransform(scrollYProgress, [0, 1], [24, -24])

  return (
    <section
      ref={sectionRef}
      style={{ background: BG, position: "relative", overflow: "hidden" }}
    >
      {/* Ghost text */}
      <div
        aria-hidden
        className="absolute bottom-0 left-0 pointer-events-none select-none overflow-hidden leading-none"
        style={{ zIndex: 0 }}
      >
        <p
          className="font-druk-wide uppercase"
          style={{
            fontSize: "clamp(7rem, 28vw, 40rem)",
            color: "rgba(53,56,63,0.034)",
            letterSpacing: "-0.04em",
            lineHeight: 0.85,
          }}
        >
          WFF
        </p>
      </div>

      <div
        className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[5fr_7fr] items-stretch"
        style={{ zIndex: 1, minHeight: "80vh" }}
      >

        {/* ── LEFT — product visual ── */}
        <motion.div
          style={{ y: imgY }}
          className="relative hidden lg:block overflow-hidden"
          aria-hidden
        >
          <Image
            src="/pouches/purple-haze.webp"
            alt=""
            fill
            sizes="40vw"
            className="object-cover object-center"
            style={{ filter: "saturate(0.9) brightness(0.96)" }}
          />
          {/* gradient overlay blending into section bg */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to right, transparent 70%, " + BG + " 100%)",
          }} />
        </motion.div>

        {/* ── RIGHT — comparison table ── */}
        <motion.div
          style={{
            y: tableY,
            padding: "clamp(64px,10vh,120px) clamp(24px,5vw,80px) clamp(64px,10vh,120px) clamp(32px,5vw,72px)",
          }}
          className="flex flex-col justify-center"
        >
          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="font-ekstra uppercase" style={{ fontSize: 11, letterSpacing: "0.30em", color: MUTED, marginBottom: 20 }}>
              Der Unterschied
            </p>
            <h2 className="font-druk-wide uppercase leading-none" style={{
              fontSize: "clamp(2.4rem, 5vw, 5.5rem)",
              letterSpacing: "-0.03em",
              color: TEXT,
              marginBottom: "clamp(36px,5vh,56px)",
            }}>
              Mehr für dich.<br />
              <span style={{ color: "transparent", WebkitTextStroke: `clamp(1.5px,0.12vw,2.5px) ${TEXT}` }}>
                Sieh den Unterschied.
              </span>
            </h2>
          </motion.div>

          {/* Table */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Column headers */}
            <div className="grid" style={{ gridTemplateColumns: "1fr 80px 80px", paddingBottom: 12, borderBottom: `1.5px solid ${TEXT}` }}>
              <span className="font-ekstra uppercase" style={{ fontSize: 10, letterSpacing: "0.26em", color: MUTED }}>Vorteile</span>
              <span className="font-druk-wide uppercase text-center" style={{ fontSize: "clamp(0.75rem,1.1vw,0.95rem)", color: TEXT, letterSpacing: "0.04em" }}>WFF</span>
              <span className="font-ekstra uppercase text-center" style={{ fontSize: 10, letterSpacing: "0.20em", color: MUTED }}>Andere</span>
            </div>

            {/* Rows */}
            {ROWS.map((label, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: 0.06 * i, ease: [0.16, 1, 0.3, 1] }}
                className="grid items-center"
                style={{
                  gridTemplateColumns: "1fr 80px 80px",
                  borderBottom: `1px solid ${DIM}`,
                  padding: "clamp(14px,1.8vh,20px) 0",
                }}
              >
                <span className="font-ekstra" style={{ fontSize: "clamp(0.82rem,0.95vw,0.95rem)", color: TEXT, lineHeight: 1.4 }}>
                  {label}
                </span>
                {/* WFF checkmark — pill background */}
                <div className="flex justify-center">
                  <span style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    width: 36, height: 36, borderRadius: "50%",
                    background: "rgba(53,56,63,0.09)",
                  }}>
                    <Check />
                  </span>
                </div>
                {/* Competitor X */}
                <div className="flex justify-center">
                  <Cross />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ marginTop: "clamp(28px,4vh,44px)" }}
          >
            <a
              href="/shop"
              className="font-druk-wide uppercase inline-flex items-center gap-3"
              style={{
                background: TEXT, color: "#e8e4dc",
                borderRadius: 999, paddingRight: 28,
                fontSize: "clamp(11px,0.9vw,13px)", letterSpacing: "0.04em",
                textDecoration: "none",
              }}
            >
              <span style={{
                width: 44, height: 44, borderRadius: "50%",
                background: "#e8e4dc", display: "inline-flex",
                alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 12L12 2M12 2H4M12 2V10" stroke={TEXT} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              Jetzt entdecken
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
