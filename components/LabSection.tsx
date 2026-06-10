"use client"

import { motion } from "framer-motion"
import { MetalButton } from "@/components/ui/metal-button"
import Link from "next/link"

const PAGE_BG = "#35383f"
const TEXT_COL = "#35383f"

const PILLARS = [
  {
    num: "01",
    title: "COA-Zertifikat",
    body: "Vollständige Analysezertifikate für jeden Strain – herunterladbar, jederzeit. Kein Marketing-Bullshit.",
  },
  {
    num: "02",
    title: "Cannabinoid-Profil",
    body: "HC 96%, präzise gemessen. Wir verstecken keine Zahlen und runden nicht auf.",
  },
  {
    num: "03",
    title: "Unabhängige Labore",
    body: "Keine Haustests. Keine Gefälligkeitsgutachten. Externe akkreditierte Prüflabore, die niemandem etwas schulden.",
  },
]

export function LabSection() {
  return (
    <section
      style={{
        background:    PAGE_BG,
        overflow:      "hidden",
        paddingTop:    "clamp(80px, 12vh, 140px)",
        paddingBottom: "clamp(80px, 12vh, 140px)",
        paddingLeft:   "clamp(20px, 5vw, 80px)",
        paddingRight:  "clamp(20px, 5vw, 80px)",
      }}
    >
      {/* Eyebrow */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="font-mono uppercase"
        style={{ fontSize: "9px", letterSpacing: "0.45em", color: "rgba(53,56,63,0.30)", marginBottom: 20 }}
      >
        Transparenz · Lab Reports
      </motion.p>

      {/* Headline */}
      <div style={{ overflow: "hidden", marginBottom: "clamp(50px, 8vh, 90px)" }}>
        <motion.p
          initial={{ y: "110%", opacity: 0 }}
          whileInView={{ y: "0%", opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ type: "spring", stiffness: 100, damping: 16, mass: 1 }}
          className="font-adieu uppercase leading-none"
          style={{
            fontSize:      "clamp(3.5rem, 9vw, 12rem)",
            letterSpacing: "-0.025em",
            lineHeight:    0.88,
            color:         TEXT_COL,
          }}
        >
          KEIN SCHROTT.<br />
          <span style={{ color: "rgba(53,56,63,0.22)" }}>NUR ECHTES.</span>
        </motion.p>
      </div>

      {/* Three pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px"
        style={{ background: "rgba(53,56,63,0.09)", marginBottom: "clamp(40px, 6vh, 60px)" }}>
        {PILLARS.map((p, i) => (
          <motion.div
            key={p.num}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.5, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background:    PAGE_BG,
              padding:       "clamp(24px, 4vh, 40px) clamp(20px, 3vw, 36px)",
            }}
          >
            <p className="font-mono" style={{ fontSize: "9px", letterSpacing: "0.3em", color: "rgba(53,56,63,0.28)", marginBottom: 14 }}>
              {p.num}
            </p>
            <p className="font-adieu uppercase leading-none" style={{
              fontSize: "clamp(1.1rem, 1.6vw, 1.5rem)",
              color: TEXT_COL,
              letterSpacing: "-0.01em",
              marginBottom: 12,
            }}>
              {p.title}
            </p>
            <p className="font-ekstra leading-relaxed" style={{
              fontSize:  "clamp(13px, 1.1vw, 15px)",
              color:     "rgba(53,56,63,0.62)",
              maxWidth:  300,
            }}>
              {p.body}
            </p>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.45 }}
      >
        <Link href="/lab-reports">
          <MetalButton variant="outline">
            Lab Reports ansehen →
          </MetalButton>
        </Link>
      </motion.div>
    </section>
  )
}
