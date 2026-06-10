"use client"

import { motion } from "framer-motion"
import { MetalButton } from "@/components/ui/metal-button"
import Link from "next/link"

const PAGE_BG = "#35383f"
const TEXT_COL = "#35383f"

const PERKS = [
  "Wholesale-Konditionen ab 10 Einheiten",
  "Persönlicher Account-Manager",
  "Volle COA-Dokumentation",
  "Private-Label auf Anfrage",
]

export function B2BSection() {
  return (
    <section
      style={{
        background:    TEXT_COL,
        overflow:      "hidden",
        position:      "relative",
        paddingTop:    "clamp(80px, 12vh, 140px)",
        paddingBottom: "clamp(80px, 12vh, 140px)",
        paddingLeft:   "clamp(20px, 5vw, 80px)",
        paddingRight:  "clamp(20px, 5vw, 80px)",
      }}
    >
      {/* Ghost text */}
      <div
        className="absolute right-0 bottom-0 pointer-events-none select-none overflow-hidden"
        aria-hidden
        style={{ zIndex: 0, lineHeight: 0.8 }}
      >
        <p
          className="font-adieu uppercase leading-none"
          style={{ fontSize: "clamp(8rem, 28vw, 38rem)", letterSpacing: "-0.04em", color: "rgba(53,56,63,0.03)" }}
        >
          B2B
        </p>
      </div>

      {/* Content */}
      <div className="relative" style={{ zIndex: 1 }}>
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="font-mono uppercase"
          style={{ fontSize: "9px", letterSpacing: "0.45em", color: "rgba(53,56,63,0.28)", marginBottom: 20 }}
        >
          B2B · Partnerschaft
        </motion.p>

        {/* Headline */}
        <div style={{ overflow: "hidden", marginBottom: "clamp(32px, 5vh, 56px)" }}>
          <motion.p
            initial={{ y: "105%", opacity: 0 }}
            whileInView={{ y: "0%", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 110, damping: 16 }}
            className="font-adieu uppercase leading-none"
            style={{
              fontSize:      "clamp(3rem, 8vw, 11rem)",
              letterSpacing: "-0.025em",
              lineHeight:    0.88,
              color:         PAGE_BG,
            }}
          >
            DU WILLST<br />
            <span style={{ color: "rgba(53,56,63,0.30)" }}>WEITERVERKAUFEN?</span>
          </motion.p>
        </div>

        {/* Body */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.45 }}
          className="font-ekstra leading-relaxed"
          style={{ fontSize: "clamp(14px, 1.3vw, 18px)", color: "rgba(53,56,63,0.55)", maxWidth: 480, marginBottom: "clamp(28px, 4vh, 44px)" }}
        >
          Wir suchen Wiederverkäufer mit Haltung. Faire Konditionen, persönlicher Support und volle Transparenz — von Anfang an.
        </motion.p>

        {/* Perks */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.22, duration: 0.45 }}
          className="flex flex-col gap-2.5"
          style={{ marginBottom: "clamp(32px, 5vh, 52px)" }}
        >
          {PERKS.map((perk, i) => (
            <div key={i} className="flex items-center gap-3">
              <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#a0ba87", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "#fff", fontSize: 9 }}>✓</span>
              </div>
              <p className="font-mono uppercase" style={{ fontSize: "9px", letterSpacing: "0.22em", color: "rgba(53,56,63,0.50)" }}>
                {perk}
              </p>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <Link href="/b2b">
            <MetalButton style={{ background: PAGE_BG, color: TEXT_COL }}>
              B2B anfragen →
            </MetalButton>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
