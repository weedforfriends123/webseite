"use client"

import Image from "next/image"
import { motion } from "framer-motion"

const PAGE_BG  = "#d6ecc2"   // light sage — matches More Nutrition background
const CREAM    = "#35383f"   // cream — for card text
const DARK     = "#35383f"
const SAGE     = "#a0ba87"
const CARD_BG  = "#8aaa76"   // medium sage card — like More Nutrition

interface Feature {
  title: string
  body: string
  annotation: string
  side: "left" | "right"
  productFrame: string
  tilt: number
}

const FEATURES: Feature[] = [
  {
    title:        "ECHTER\nFLAVOR",
    body:         "Ursprüngliche Terpene. Smooth & cremig. Das Beste aus jeder Blüte — für dein ultimatives Vape-Erlebnis.",
    annotation:   "More flavor, less filler ♡",
    side:         "right",
    productFrame: "/frames2/ezgif-frame-001.png",
    tilt:         -6,
  },
  {
    title:        "DISKRET\nVERSAND",
    body:         "Anonym und schnell. Versandverschlüsselt, ohne Aufsehen. In 2 Tagen direkt an deine Tür.",
    annotation:   "*Anonym. Immer.",
    side:         "left",
    productFrame: "/frames2/ezgif-frame-005.png",
    tilt:         5,
  },
  {
    title:        "HC 96%\nREINHEIT",
    body:         "Klinisch geprüfte Reinheit. 96% HC pro Einheit — handverlesen für deinen bewussten Lifestyle.",
    annotation:   "Lab-tested. Guaranteed.",
    side:         "right",
    productFrame: "/frames2/ezgif-frame-009.png",
    tilt:         -4,
  },
  {
    title:        "KEIN\nFILLER",
    body:         "Kein Plastik-Nachgeschmack. Nur natürliche Inhaltsstoffe — von Anfang bis Ende.",
    annotation:   "*Nur das Echte. Nur WFF.",
    side:         "left",
    productFrame: "/frames2/ezgif-frame-013.png",
    tilt:         7,
  },
]

function SmileyIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="21" stroke={CREAM} strokeWidth="2" />
      <circle cx="17" cy="20" r="2.8" fill={CREAM} />
      <circle cx="31" cy="20" r="2.8" fill={CREAM} />
      <path d="M14 29 Q24 38 34 29" stroke={CREAM} strokeWidth="2.2" strokeLinecap="round" fill="none" />
    </svg>
  )
}

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  const isRight = feature.side === "right"

  return (
    <div
      id={index === 0 ? "features" : undefined}
      style={{
        position: "relative",
        minHeight: "100svh",
        background: PAGE_BG,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        padding: "clamp(80px, 12vw, 140px) clamp(24px, 5vw, 80px)",
      }}
    >
      {/* White ribbon stripe in background */}
      <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1 }}>
        <svg
          viewBox="0 0 1400 800"
          preserveAspectRatio="xMidYMid slice"
          style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
        >
          <path
            d={
              isRight
                ? "M -100,200 C 300,100 600,500 900,400 C 1100,320 1200,150 1500,250"
                : "M -100,600 C 200,700 500,300 800,400 C 1050,480 1200,650 1500,550"
            }
            fill="none"
            stroke="rgba(255,255,255,0.55)"
            strokeWidth="52"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Content row: card + product */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "clamp(32px, 6vw, 100px)",
          width: "100%",
          maxWidth: 1320,
          flexDirection: isRight ? "row" : "row-reverse",
        }}
      >
        {/* ── Feature card ── */}
        <motion.div
          initial={{ opacity: 0, x: isRight ? 50 : -50, scale: 0.95 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background: CARD_BG,
            borderRadius: "clamp(20px, 2.8vw, 36px)",
            padding: "clamp(28px, 3.5vw, 52px)",
            width: "clamp(260px, 32vw, 460px)",
            flexShrink: 0,
          }}
        >
          <div style={{ marginBottom: 22 }}>
            <SmileyIcon />
          </div>

          <h2
            className="font-adieu uppercase"
            style={{
              fontSize: "clamp(2rem, 4vw, 5.8rem)",
              letterSpacing: "-0.025em",
              lineHeight: 0.9,
              color: CREAM,
              marginBottom: "clamp(18px, 2.8vw, 32px)",
              whiteSpace: "pre-line",
              overflowWrap: "break-word",
            }}
          >
            {feature.title}
          </h2>

          <p
            className="font-ekstra"
            style={{
              fontSize: "clamp(13px, 1.05vw, 16px)",
              color: "rgba(53,56,63,0.82)",
              lineHeight: 1.65,
              textAlign: "center",
            }}
          >
            {feature.body}
          </p>

          <p
            className="font-mindflow"
            style={{
              fontSize: "clamp(13px, 1.05vw, 17px)",
              color: CREAM,
              marginTop: "clamp(16px, 2.2vw, 26px)",
              opacity: 0.75,
              transform: "rotate(-2deg)",
              display: "inline-block",
            }}
          >
            {feature.annotation}
          </p>
        </motion.div>

        {/* ── Product image — BIG like More Nutrition ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            flex: "1 1 auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minWidth: 0,
          }}
        >
          <Image
            src={feature.productFrame}
            alt="WFF Vape"
            width={300}
            height={700}
            style={{
              width: "clamp(200px, 38vw, 580px)",
              height: "auto",
              objectFit: "contain",
              filter: "drop-shadow(0 32px 80px rgba(53,56,63,0.18))",
              transform: `rotate(${feature.tilt}deg)`,
              display: "block",
            }}
          />
        </motion.div>
      </div>

      {/* Section counter */}
      <span
        className="font-mono"
        style={{
          position: "absolute",
          bottom: "clamp(20px, 3.5vw, 40px)",
          left: "clamp(20px, 4vw, 52px)",
          fontSize: "clamp(8px, 0.65vw, 10px)",
          letterSpacing: "0.35em",
          color: "rgba(53,56,63,0.28)",
          textTransform: "uppercase",
          zIndex: 10,
        }}
      >
        {String(index + 1).padStart(2, "0")} / {String(FEATURES.length).padStart(2, "0")}
      </span>
    </div>
  )
}

export function FeatureScrollSection() {
  return (
    <div>
      {FEATURES.map((feature, i) => (
        <FeatureCard key={i} feature={feature} index={i} />
      ))}
    </div>
  )
}
