"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { MetalButton } from "@/components/ui/metal-button"

const BG   = "#35383f"
const TEXT = "#35383f"

const TIERS = [
  {
    name: "FRIEND",
    points: "0 – 499",
    perks: ["1 Punkt pro €1", "Gratis Versand ab €60", "Exklusiver Newsletter"],
    accent: "#35383f",
    textOnAccent: "#35383f",
  },
  {
    name: "GOOD FRIEND",
    points: "500 – 1499",
    perks: ["1,5 Punkte pro €1", "Gratis Versand ab €40", "Priority Support", "Birthday Drop"],
    accent: "#a0ba87",
    textOnAccent: "#0e0f11",
  },
  {
    name: "BEST FRIEND",
    points: "1500+",
    perks: ["2 Punkte pro €1", "Kostenloser Versand immer", "Exklusive Drops", "Gratis Probe bei jeder Order"],
    accent: "#c9a84c",
    textOnAccent: "#0e0f11",
  },
]

const HOW = [
  { step: "01", action: "Bestellen", detail: "Für jeden ausgegebenen Euro sammelst du Punkte." },
  { step: "02", action: "Sammeln", detail: "Punkte landen automatisch auf deinem Konto." },
  { step: "03", action: "Einlösen", detail: "100 Punkte = €5 Rabatt – wann immer du willst." },
]

export default function LoyaltyPage() {
  return (
    <div style={{ background: BG, minHeight: "100vh" }}>

      {/* Nav */}
      <div
        className="sticky top-0 z-[70] flex items-center justify-between px-5 md:px-10"
        style={{
          height: 60,
          background: "rgba(53,56,63,0.92)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(53,56,63,0.07)",
        }}
      >
        <Link href="/">
          <Image src="/logo.webp" alt="WFF" width={72} height={24} className="h-5 w-auto" style={{ filter: "brightness(0)" }} />
        </Link>
        <span className="font-mono text-[9px] tracking-[0.4em] uppercase" style={{ color: "rgba(53,56,63,0.35)" }}>
          Loyalty
        </span>
        <Link href="/" className="font-mono text-[9px] tracking-[0.25em] uppercase transition-opacity hover:opacity-100" style={{ color: "rgba(53,56,63,0.35)" }}>
          ← Zurück
        </Link>
      </div>

      {/* Hero */}
      <div
        className="relative overflow-hidden flex flex-col justify-end"
        style={{
          height: "clamp(260px, 38vh, 420px)",
          paddingLeft: "clamp(20px, 5vw, 80px)",
          paddingBottom: "clamp(36px, 6vh, 72px)",
        }}
      >
        <div className="absolute inset-0 flex items-center pointer-events-none select-none" style={{ paddingLeft: "clamp(6px, 1vw, 20px)" }} aria-hidden>
          <p className="font-adieu uppercase leading-none" style={{ fontSize: "clamp(5rem, 20vw, 28rem)", letterSpacing: "-0.03em", color: "rgba(53,56,63,0.05)" }}>
            PUNKTE.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 140, damping: 18 }}
          style={{ position: "relative", zIndex: 10 }}
        >
          <p className="font-mono uppercase mb-2" style={{ fontSize: "9px", letterSpacing: "0.45em", color: "rgba(53,56,63,0.30)" }}>
            Loyalty Program · WFF Friends Club
          </p>
          <p className="font-adieu uppercase leading-none" style={{ fontSize: "clamp(2.5rem, 6vw, 7rem)", letterSpacing: "-0.025em", lineHeight: 0.88, color: TEXT }}>
            Treue zahlt
            <br />
            sich aus.
          </p>
        </motion.div>
      </div>

      <div style={{ borderBottom: "1px solid rgba(53,56,63,0.07)" }} />

      {/* How it works */}
      <div
        style={{
          paddingTop: "clamp(56px, 10vh, 100px)",
          paddingBottom: "clamp(56px, 10vh, 100px)",
          paddingLeft: "clamp(20px, 5vw, 80px)",
          paddingRight: "clamp(20px, 5vw, 80px)",
        }}
      >
        <p className="font-mono uppercase mb-10" style={{ fontSize: "9px", letterSpacing: "0.45em", color: "rgba(53,56,63,0.30)" }}>
          So funktioniert's
        </p>
        <div className="grid gap-px" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(clamp(220px, 28vw, 340px), 1fr))", background: "rgba(53,56,63,0.07)" }}>
          {HOW.map((h, i) => (
            <motion.div
              key={h.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 130, damping: 18, delay: i * 0.07 }}
              viewport={{ once: true }}
              style={{ background: BG, padding: "clamp(28px, 4vw, 48px)" }}
            >
              <p className="font-mono mb-4" style={{ fontSize: "9px", letterSpacing: "0.4em", color: "rgba(53,56,63,0.28)" }}>
                {h.step}
              </p>
              <p className="font-adieu uppercase leading-none mb-3" style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)", letterSpacing: "-0.02em", color: TEXT }}>
                {h.action}
              </p>
              <p className="font-ekstra leading-relaxed" style={{ fontSize: "clamp(11px, 1vw, 13px)", color: "rgba(53,56,63,0.48)" }}>
                {h.detail}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <div style={{ borderBottom: "1px solid rgba(53,56,63,0.07)" }} />

      {/* Tiers */}
      <div
        style={{
          paddingTop: "clamp(56px, 10vh, 100px)",
          paddingBottom: "clamp(56px, 10vh, 100px)",
          paddingLeft: "clamp(20px, 5vw, 80px)",
          paddingRight: "clamp(20px, 5vw, 80px)",
        }}
      >
        <p className="font-mono uppercase mb-10" style={{ fontSize: "9px", letterSpacing: "0.45em", color: "rgba(53,56,63,0.30)" }}>
          Dein Status
        </p>
        <div className="grid gap-px" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(clamp(240px, 30vw, 360px), 1fr))", background: "rgba(53,56,63,0.07)" }}>
          {TIERS.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 130, damping: 18, delay: i * 0.08 }}
              viewport={{ once: true }}
              style={{ background: BG }}
            >
              {/* Tier header */}
              <div style={{ background: tier.accent, padding: "clamp(20px, 3vw, 32px)" }}>
                <p className="font-mono mb-1" style={{ fontSize: "8px", letterSpacing: "0.35em", color: `${tier.textOnAccent}88` }}>
                  {tier.points} Punkte
                </p>
                <p className="font-adieu uppercase leading-none" style={{ fontSize: "clamp(1.4rem, 2.8vw, 2.4rem)", letterSpacing: "-0.015em", color: tier.textOnAccent }}>
                  {tier.name}
                </p>
              </div>

              {/* Perks */}
              <div style={{ padding: "clamp(20px, 3vw, 32px)" }}>
                <ul className="flex flex-col gap-3">
                  {tier.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-3">
                      <span style={{ color: tier.accent, fontSize: 12, marginTop: 1, flexShrink: 0 }}>✦</span>
                      <span className="font-ekstra leading-relaxed" style={{ fontSize: "clamp(11px, 0.95vw, 13px)", color: "rgba(53,56,63,0.55)" }}>
                        {perk}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA strip */}
      <div style={{ borderTop: "1px solid rgba(53,56,63,0.07)", background: TEXT }}>
        <div
          className="relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          style={{
            paddingTop: "clamp(48px, 8vh, 80px)",
            paddingBottom: "clamp(48px, 8vh, 80px)",
            paddingLeft: "clamp(20px, 5vw, 80px)",
            paddingRight: "clamp(20px, 5vw, 80px)",
          }}
        >
          {/* Ghost */}
          <div className="absolute inset-0 flex items-center pointer-events-none select-none" aria-hidden style={{ paddingLeft: "clamp(6px, 1vw, 20px)" }}>
            <p className="font-adieu uppercase leading-none" style={{ fontSize: "clamp(4rem, 16vw, 20rem)", letterSpacing: "-0.03em", color: "rgba(53,56,63,0.04)" }}>
              FRIENDS.
            </p>
          </div>

          <div style={{ position: "relative", zIndex: 10 }}>
            <p className="font-mono uppercase mb-2" style={{ fontSize: "9px", letterSpacing: "0.45em", color: "rgba(53,56,63,0.28)" }}>
              Start heute
            </p>
            <p className="font-adieu uppercase leading-none" style={{ fontSize: "clamp(2rem, 5vw, 6rem)", letterSpacing: "-0.025em", lineHeight: 0.88, color: BG }}>
              Erste Punkte
              <br />
              warten schon.
            </p>
          </div>

          <div style={{ position: "relative", zIndex: 10, flexShrink: 0 }}>
            <Link href="/shop">
              <MetalButton variant="primary" style={{ background: "#c9a84c", color: "#0e0f11" }}>
                Jetzt bestellen →
              </MetalButton>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer strip */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 px-5 md:px-10 py-8" style={{ borderTop: "1px solid rgba(53,56,63,0.07)" }}>
        <p className="font-mono text-[8px] tracking-[0.25em] uppercase" style={{ color: "rgba(53,56,63,0.22)" }}>
          Punkte verfallen nach 12 Monaten Inaktivität
        </p>
        <p className="font-mono text-[8px] tracking-[0.25em] uppercase" style={{ color: "rgba(53,56,63,0.22)" }}>
          © WFF 2026 · hello@weedforfriends.com
        </p>
      </div>

    </div>
  )
}
