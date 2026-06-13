"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useScroll, useTransform, MotionValue } from "framer-motion"
import dynamic from "next/dynamic"

const Product3D = dynamic(
  () => import("./Product3D").then(m => ({ default: m.Product3D })),
  { ssr: false, loading: () => null },
)

const BG    = "#bcc0ca"
const TEXT  = "#35383f"
const LIGHT = "#e8e4dc"
const MUTED = "rgba(53,56,63,0.52)"

const FEATURES = [
  {
    side: "left"  as const,
    big: "600",
    tag: "PUFFS",
    desc: "Smooth bis zum letzten Zug.\nKein Absatz. Kein Nachlassen.",
  },
  {
    side: "right" as const,
    big: "0%",
    tag: "NIKOTIN",
    desc: "100% tabakfrei · nikotinfrei.\nEU-zertifiziert und laborgeprüft.",
  },
  {
    side: "left"  as const,
    big: "LAB",
    tag: "TESTED",
    desc: "Apothekenqualität.\nStrenge EU-Standards.",
  },
  {
    side: "right" as const,
    big: "EU",
    tag: "MADE",
    desc: "Hergestellt in der EU.\nKontrollierte Qualität.",
  },
] as const

// scroll window per feature: intro 0–0.12, f[0] 0.12–0.29, f[1] 0.29–0.46, f[2] 0.46–0.63, f[3] 0.63–0.80, outro 0.80–1.00
const fStart = (i: number) => 0.12 + i * 0.17
const fEnd   = (i: number) => fStart(i) + 0.17
const RAMP   = 0.028

function FeatureBlock({
  feature, index, isMobile, scrollYProgress,
}: {
  feature: typeof FEATURES[number]
  index: number
  isMobile: boolean
  scrollYProgress: MotionValue<number>
}) {
  const s     = fStart(index)
  const e     = fEnd(index)
  const isLeft = feature.side === "left"

  const opacity = useTransform(
    scrollYProgress,
    [s, s + RAMP, e - RAMP, e],
    [0, 1, 1, 0],
  )
  // desktop: slide in from the side; mobile: rise up from below
  const x = useTransform(
    scrollYProgress,
    [s, s + RAMP, e - RAMP, e],
    isMobile ? [0, 0, 0, 0] : [isLeft ? -140 : 140, 0, 0, isLeft ? -80 : 80],
  )
  const y = useTransform(
    scrollYProgress,
    [s, s + RAMP, e - RAMP, e],
    isMobile ? [52, 0, 0, 52] : [0, 0, 0, 0],
  )

  const bigSize    = isMobile ? "clamp(72px,20vw,120px)" : "clamp(80px,11.5vw,180px)"
  const tagSize    = isMobile ? "clamp(18px,5.5vw,28px)" : "clamp(20px,2.6vw,42px)"
  const descSize   = isMobile ? "clamp(11px,3vw,14px)"   : "clamp(12px,0.9vw,15px)"
  const maxW       = isMobile ? "none" : "clamp(200px,22vw,340px)"
  const edgePad    = "clamp(28px,4vw,72px)"

  if (isMobile) {
    return (
      <motion.div
        style={{
          position: "absolute",
          bottom: "clamp(32px,6vh,72px)",
          left: 0, right: 0,
          textAlign: "center",
          opacity, y,
          zIndex: 5,
          pointerEvents: "none",
          padding: "0 24px",
        }}
      >
        <p className="font-druk" style={{
          fontSize: bigSize, color: TEXT, lineHeight: 0.85,
          letterSpacing: "-0.04em", margin: "0 0 4px",
        }}>
          {feature.big}
        </p>
        <p className="font-druk-wide uppercase" style={{
          fontSize: tagSize, lineHeight: 1,
          color: "transparent", WebkitTextStroke: `clamp(1.2px,0.1vw,1.8px) ${TEXT}`,
          letterSpacing: "0.06em", margin: "0 0 10px",
        }}>
          {feature.tag}
        </p>
        <p style={{
          color: MUTED, fontSize: descSize, lineHeight: 1.65,
          margin: 0, whiteSpace: "pre-line",
        }}>
          {feature.desc}
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      style={{
        position: "absolute",
        top: "50%",
        translateY: "-50%",
        [isLeft ? "left" : "right"]: edgePad,
        opacity, x,
        zIndex: 5,
        pointerEvents: "none",
        maxWidth: maxW,
      }}
    >
      {/* BIG number — filled */}
      <p className="font-druk" style={{
        fontSize: bigSize,
        color: TEXT,
        lineHeight: 0.82,
        letterSpacing: "-0.04em",
        margin: "0 0 6px",
        textAlign: isLeft ? "left" : "right",
      }}>
        {feature.big}
      </p>
      {/* Tag — outline style like Section 1 */}
      <p className="font-druk-wide uppercase" style={{
        fontSize: tagSize,
        color: "transparent",
        WebkitTextStroke: `clamp(1.4px,0.11vw,2px) ${TEXT}`,
        letterSpacing: "0.06em",
        lineHeight: 1,
        margin: "0 0 clamp(12px,1.6vh,22px)",
        textAlign: isLeft ? "left" : "right",
      }}>
        {feature.tag}
      </p>
      {/* Divider */}
      <div style={{
        width: "clamp(40px,5vw,80px)",
        height: 1,
        background: `rgba(53,56,63,0.22)`,
        margin: `0 ${isLeft ? "0" : "auto"} clamp(10px,1.4vh,18px) ${isLeft ? "0" : "auto"}`,
      }} />
      {/* Description */}
      <p style={{
        color: MUTED,
        fontSize: descSize,
        lineHeight: 1.75,
        margin: 0,
        whiteSpace: "pre-line",
        textAlign: isLeft ? "left" : "right",
      }}>
        {feature.desc}
      </p>
    </motion.div>
  )
}

function FeatureCounter({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>
}) {
  const [active, setActive] = useState(-1)

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      let found = -1
      for (let i = 0; i < FEATURES.length; i++) {
        if (v >= fStart(i) && v < fEnd(i)) { found = i; break }
      }
      setActive(found)
    })
    return unsub
  }, [scrollYProgress])

  if (active < 0) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        position: "absolute",
        bottom: "clamp(28px,4vh,48px)",
        right: "clamp(28px,4vw,56px)",
        zIndex: 20,
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      {FEATURES.map((_, i) => (
        <motion.div
          key={i}
          animate={{
            width:   i === active ? 26 : 8,
            opacity: i === active ? 1 : 0.25,
          }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          style={{ height: 5, borderRadius: 99, background: TEXT }}
        />
      ))}
    </motion.div>
  )
}

export function Section04_Features() {
  const sectionRef = useRef<HTMLElement>(null)
  const isMobileRef = useRef(false)
  const [isMobile, setIsMobile] = useState(false)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  })

  useEffect(() => {
    const check = () => {
      isMobileRef.current = window.innerWidth < 768
      setIsMobile(isMobileRef.current)
    }
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  // Product entrance + exit scale
  const productScale = useTransform(
    scrollYProgress,
    [0, 0.08, 0.80, 0.94],
    [0.28, 1.0, 1.0, 0.45],
  )

  // Vertical parallax
  const productY = useTransform(scrollYProgress, [0, 1], [160, -120])

  // Horizontal dance: product shifts opposite to feature text
  const productX = useTransform(scrollYProgress, (v) => {
    if (isMobileRef.current) return 0
    const kf: [number, number][] = [
      [0,    0], [0.12, 0], [0.17,  52],
      [0.29, 52], [0.34, -52],
      [0.46,-52], [0.51,  52],
      [0.63, 52], [0.68, -52],
      [0.80, 0], [1,      0],
    ]
    for (let i = 0; i < kf.length - 1; i++) {
      const [t0, x0] = kf[i], [t1, x1] = kf[i + 1]
      if (v >= t0 && v <= t1) {
        return x0 + (x1 - x0) * ((v - t0) / (t1 - t0))
      }
    }
    return 0
  })

  // Intro text
  const introOpacity = useTransform(scrollYProgress, [0, 0.07, 0.13], [1, 1, 0])
  const introY       = useTransform(scrollYProgress, [0, 0.13], [0, -50])

  // CTA outro
  const outroOpacity = useTransform(scrollYProgress, [0.80, 0.88], [0, 1])
  const outroY       = useTransform(scrollYProgress, [0.80, 0.90], [64, 0])

  // Mobile: product sits in upper portion
  const productTop  = isMobile ? "38%" : "50%"

  return (
    <section
      ref={sectionRef}
      style={{ background: BG, minHeight: "550vh", position: "relative" }}
    >
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>

        {/* Radial glow — same as Section 1 */}
        <div aria-hidden style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
          background: "radial-gradient(ellipse 70% 60% at 60% 52%, rgba(122,107,145,0.26) 0%, transparent 65%)",
        }} />

        {/* ── INTRO ── */}
        <motion.div
          style={{
            position: "absolute",
            top: "50%", left: "50%",
            translateX: "-50%", translateY: "-50%",
            textAlign: "center",
            opacity: introOpacity,
            y: introY,
            zIndex: 5,
            pointerEvents: "none",
          }}
        >
          <p className="font-ekstra uppercase" style={{
            color: MUTED, fontSize: "clamp(9px,0.65vw,11px)",
            letterSpacing: "0.26em", margin: "0 0 16px",
          }}>
            Warum WEED FOR FRIENDS
          </p>
          <h2 className="font-druk-wide uppercase" style={{
            fontSize: "clamp(34px,5.4vw,88px)",
            lineHeight: 0.88,
            letterSpacing: "-0.03em",
            margin: 0,
          }}>
            <span style={{ display: "block", color: "transparent", WebkitTextStroke: `clamp(1.5px,0.12vw,2px) ${TEXT}` }}>
              DAS BESTE
            </span>
            <span style={{ display: "block", color: TEXT }}>
              ERLEBNIS
            </span>
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="font-ekstra"
            style={{
              color: MUTED,
              fontSize: "clamp(11px,0.85vw,14px)",
              letterSpacing: "0.04em",
              margin: "clamp(16px,2.4vh,28px) 0 0",
            }}
          >
            Scroll to explore
          </motion.p>
        </motion.div>

        {/* ── FEATURES ── */}
        {FEATURES.map((f, i) => (
          <FeatureBlock
            key={f.big + i}
            feature={f}
            index={i}
            isMobile={isMobile}
            scrollYProgress={scrollYProgress}
          />
        ))}

        {/* ── OUTRO / CTA ── */}
        <motion.div
          style={{
            position: "absolute",
            top: "50%", left: "50%",
            translateX: "-50%", translateY: "-50%",
            textAlign: "center",
            opacity: outroOpacity,
            y: outroY,
            zIndex: 5,
            pointerEvents: "none",
            width: "clamp(280px,60vw,680px)",
          }}
        >
          <h2 className="font-druk-wide uppercase" style={{
            fontSize: "clamp(32px,5vw,82px)",
            lineHeight: 0.88,
            letterSpacing: "-0.03em",
            margin: "0 0 clamp(24px,3.5vh,44px)",
          }}>
            <span style={{ display: "block", color: "transparent", WebkitTextStroke: `clamp(1.5px,0.12vw,2px) ${TEXT}` }}>
              ÜBERZEUG DICH
            </span>
            <span style={{ display: "block", color: TEXT }}>
              SELBST
            </span>
          </h2>
          <a
            href="/shop"
            className="font-druk-wide uppercase"
            style={{
              display: "inline-flex", alignItems: "center",
              background: TEXT, color: LIGHT, borderRadius: 999,
              padding: "4px 32px 4px 4px",
              fontSize: "clamp(12px,1vw,15px)", letterSpacing: "0.03em",
              textDecoration: "none",
              pointerEvents: "auto",
            }}
          >
            <span style={{
              width: 44, height: 44, borderRadius: "50%",
              background: LIGHT, display: "inline-flex",
              alignItems: "center", justifyContent: "center",
              marginRight: 16, flexShrink: 0,
            }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 12L12 2M12 2H4M12 2V10" stroke={TEXT} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            Jetzt bestellen
          </a>
        </motion.div>

        {/* ── PRODUCT — always in foreground ── */}
        <motion.div
          style={{
            position: "absolute",
            left: "50%",
            top: productTop,
            translateX: "-50%",
            translateY: "-50%",
            x: productX,
            y: productY,
            scale: productScale,
            zIndex: 15,
            pointerEvents: "none",
            width:  isMobile ? "clamp(200px,52vw,320px)" : "clamp(260px,32vw,480px)",
            height: isMobile ? "clamp(240px,48vh,400px)" : "clamp(300px,56vh,720px)",
          }}
        >
          <Product3D />
        </motion.div>

        {/* ── FEATURE DOTS (desktop only) ── */}
        {!isMobile && (
          <FeatureCounter scrollYProgress={scrollYProgress} />
        )}

      </div>
    </section>
  )
}
