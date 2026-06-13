"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useScroll, useTransform, MotionValue } from "framer-motion"
import dynamic from "next/dynamic"

// Loaded client-only — Three.js Canvas cannot run on the server
const Product3D = dynamic(
  () => import("./Product3D").then(m => ({ default: m.Product3D })),
  { ssr: false, loading: () => null },
)

const BG   = "#bcc0ca"
const CARD = "#6e7d6a"
const LIGHT = "#e8e4dc"

const RIBBON_D =
  "M 1720 -80 " +
  "C 1300 -20, 450 60, 100 280 " +
  "C -200 500, -180 700, 80 750 " +
  "C 340 800, 760 660, 960 490 " +
  "C 1160 320, 1020 130, 730 140 " +
  "C 440 150, 140 310, 110 550 " +
  "C 80 790, 360 940, 660 920"

const FEATURES = [
  {
    side: "right" as const,
    headline: "MEHR\nGESCHMACK",
    sub: "Echte Terpene. Echter Geschmack.\nSmooth und aromatisch, Zug für Zug.",
  },
  {
    side: "left" as const,
    headline: "KEIN\nNIKOTIN",
    sub: "100% tabakfrei · nikotinfrei.\nEU-zertifiziert und laborgeprüft.",
  },
  {
    side: "right" as const,
    headline: "600\nPUFFS",
    sub: "Smooth bis zum letzten Zug.\nKein Absatz. Kein Nachlassen.",
  },
  {
    side: "left" as const,
    headline: "EU\nGEMACHT",
    sub: "Hergestellt in der EU.\nKontrollierte Qualität. Kein Kompromiss.",
  },
]

function SmileyBadge() {
  return (
    <div style={{
      position: "absolute", top: -32, left: "50%",
      transform: "translateX(-50%)",
      width: 64, height: 64, borderRadius: "50%",
      background: LIGHT,
      border: `3px solid ${CARD}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: "0 6px 20px rgba(0,0,0,0.18)",
      zIndex: 10,
    }}>
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="18" r="16" stroke={CARD} strokeWidth="1.5" />
        <circle cx="12" cy="15"  r="2.5" fill={CARD} />
        <circle cx="24" cy="15"  r="2.5" fill={CARD} />
        <path d="M11 22.5 Q18 29 25 22.5" stroke={CARD} strokeWidth="2" strokeLinecap="round" fill="none" />
      </svg>
    </div>
  )
}

function FeatureCard({
  feature,
  index,
  scrollYProgress,
  isMobile,
}: {
  feature: typeof FEATURES[number]
  index: number
  scrollYProgress: MotionValue<number>
  isMobile: boolean
}) {
  const span  = 0.80 / FEATURES.length
  const base  = 0.10 + index * span
  const fadeW = 0.04

  const fromX = feature.side === "right" ?  1200 : -1200
  const exitX = feature.side === "right" ?  -800 :   800

  const x = useTransform(
    scrollYProgress,
    [base, base + fadeW, base + span - fadeW, base + span],
    [fromX, 0, 0, exitX],
  )
  const opacity = useTransform(
    scrollYProgress,
    [base, base + fadeW, base + span - fadeW, base + span],
    [0, 1, 1, 0],
  )

  const isRight = feature.side === "right"
  const edgeStyle = isRight ? { right: 0 } : { left: 0 }

  // Mobile: right cards at top, left cards at bottom → product center always clear
  // Desktop: vertically centered
  const topPos     = isMobile ? (isRight ? "6%"  : "58%") : "50%"
  const translateY = isMobile ? "0%"                      : "-50%"

  const r = isMobile ? "10px" : "clamp(14px,1.4vw,22px)"
  const borderRadius = isRight ? `${r} 0 0 ${r}` : `0 ${r} ${r} 0`

  return (
    <motion.div
      style={{
        position: "absolute",
        top: topPos,
        translateY,
        x,
        opacity,
        // Cards sit behind product (zIndex 15) so product is always in the foreground
        zIndex: 8,
        ...edgeStyle,
      }}
    >
      <div style={{ position: "relative" }}>
        <SmileyBadge />
        <div style={{
          background: CARD,
          borderRadius,
          padding: isMobile
            ? "clamp(28px,4.5vh,44px) clamp(16px,4vw,28px) clamp(22px,3.5vh,36px)"
            : "clamp(48px,6vh,80px) clamp(32px,4.5vw,68px) clamp(40px,5.5vh,68px)",
          width: isMobile
            ? "clamp(190px,76vw,280px)"
            : "clamp(300px,38vw,540px)",
        }}>
          <h3
            className="font-druk-wide uppercase"
            style={{
              color: LIGHT,
              fontSize: isMobile ? "clamp(22px,6vw,34px)" : "clamp(32px,4.8vw,76px)",
              lineHeight: 0.88,
              margin: `0 0 ${isMobile ? "clamp(8px,1.2vh,14px)" : "clamp(12px,1.6vh,22px)"}`,
              whiteSpace: "pre-line",
            }}
          >
            {feature.headline}
          </h3>
          <p style={{
            color: "rgba(232,228,220,0.72)",
            fontSize: isMobile ? "clamp(11px,2.8vw,14px)" : "clamp(13px,1.05vw,16px)",
            lineHeight: 1.75,
            margin: 0,
            whiteSpace: "pre-line",
          }}>
            {feature.sub}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export function Section04_Features() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  })

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  const pathLen      = useTransform(scrollYProgress, [0, 0.45], [0, 1])
  const ribbonY      = useTransform(scrollYProgress, [0, 1], [-50, 90])
  const productScale = useTransform(scrollYProgress, [0, 0.08, 0.92, 1], [0.45, 1, 1, 0.55])
  const productY     = useTransform(scrollYProgress, [0, 1], [100, -100])
  const introOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0])

  return (
    <section
      ref={sectionRef}
      style={{ background: BG, minHeight: "500vh", position: "relative" }}
    >
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>

        {/* ── Thick white Schweif ── */}
        <motion.svg
          viewBox="0 0 1440 900"
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            display: "block",
            pointerEvents: "none",
            zIndex: 1,
            overflow: "visible" as const,
            y: ribbonY,
          }}
        >
          <motion.path
            d={RIBBON_D}
            fill="none"
            stroke="rgba(255,255,255,0.70)"
            strokeWidth="110"
            strokeLinecap="round"
            style={{ pathLength: pathLen }}
          />
        </motion.svg>

        {/* ── Section intro label ── */}
        <motion.div
          style={{
            position: "absolute",
            top: "clamp(60px,10vh,120px)",
            right: "clamp(32px,6vw,100px)",
            textAlign: "right",
            opacity: introOpacity,
            zIndex: 5,
            pointerEvents: "none",
          }}
        >
          <p className="font-mindflow" style={{
            color: "#35383f",
            fontSize: "clamp(16px,2vw,30px)",
            lineHeight: 1.4,
            margin: 0,
          }}>
            Warum sie<br />es lieben
          </p>
          <svg width="38" height="32" viewBox="0 0 46 38" style={{ marginTop: 6 }}>
            <path d="M38 5 Q28 22 8 32" fill="none" stroke="#35383f" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M8 32L16 27M8 32L15 22" fill="none" stroke="#35383f" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </motion.div>

        {/* ── Product — 3D model (replaces canvas frame scrubber) ── */}
        <motion.div
          style={{
            position: "absolute",
            left: "50%", top: "50%",
            translateX: "-50%", translateY: "-50%",
            y: productY,
            scale: productScale,
            zIndex: 15,
            pointerEvents: "none",
            width: "clamp(260px,38vw,540px)",
            height: "clamp(300px,56vh,760px)",
          }}
        >
          <Product3D />
        </motion.div>

        {/* ── Feature cards ── */}
        {FEATURES.map((f, i) => (
          <FeatureCard
            key={f.headline}
            feature={f}
            index={i}
            scrollYProgress={scrollYProgress}
            isMobile={isMobile}
          />
        ))}

      </div>
    </section>
  )
}
