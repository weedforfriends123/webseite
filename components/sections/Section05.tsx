"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, MotionValue } from "framer-motion"

const POINTS = [
  {
    num:   "01",
    label: "Für echte Freunde",
    body:  "Kein Konzern. Keine Massenware. Eine Community — und Produkte, die wir selbst lieben.",
  },
  {
    num:   "02",
    label: "EU-zertifiziert & transparent",
    body:  "Jedes Produkt trägt ein öffentliches Prüfzeugnis (COA). Keine Geheimnisse über Wirkstoffe oder Inhaltsstoffe.",
  },
  {
    num:   "03",
    label: "Kein Nikotin. Kein Tabak.",
    body:  "Nur was reingehört. Echte Cannabinoide, echte Terpene — und sonst nichts.",
  },
  {
    num:   "04",
    label: "6 einzigartige Sorten",
    body:  "Von mild bis intensiv. Handselektiert. Mit echten Terpenen. Für jeden Geschmack.",
  },
  {
    num:   "05",
    label: "Diskret & schnell",
    body:  "Lieferung in 2–4 Tagen. Unmarkierte Verpackung. Sicher und ohne Fragen.",
  },
  {
    num:   "06",
    label: "Qualität ohne Kompromisse",
    body:  "Hergestellt nach höchsten Standards. Jeden Tag. Für dich.",
    cta:   true,
  },
]

const N     = POINTS.length   // 6
const STEPS = N + 1           // 7 (intro + 6 points)
const S     = 1 / STEPS       // scroll fraction per step ≈ 0.143
const T     = S * 0.25        // transition ramp (25% of one step)

interface PointProps {
  point:    typeof POINTS[0]
  index:    number
  progress: MotionValue<number>
}

function PointCard({ point, index, progress }: PointProps) {
  const enter  = S * (index + 1)
  const peak   = enter + T
  const trough = S * (index + 2) - T
  const leave  = S * (index + 2)

  const opacity = useTransform(progress, [enter, peak, trough, Math.min(leave, 1)], [0, 1, 1, 0])
  const y       = useTransform(progress, [enter, peak], [72, 0])
  const tagOp   = useTransform(progress, [enter, peak + T * 0.5], [0, 1])

  return (
    <motion.div
      aria-hidden={false}
      style={{
        opacity,
        y,
        position:       "absolute",
        inset:          0,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        flexDirection:  "column",
        textAlign:      "center",
        padding:        "0 clamp(24px, 8vw, 140px)",
        pointerEvents:  "none",
        zIndex:         2,
      }}
    >
      {/* Counter */}
      <motion.p
        style={{ opacity: tagOp }}
        className="font-ekstra uppercase"
        aria-hidden
      >
        <span style={{ fontSize: 10, letterSpacing: "0.45em", color: "rgba(232,228,220,0.45)" }}>
          {point.num} / {String(N).padStart(2, "0")}
        </span>
      </motion.p>

      {/* Separator line */}
      <motion.div
        style={{
          opacity: tagOp,
          width: 32,
          height: 1,
          background: "rgba(232,228,220,0.30)",
          margin: "16px auto 24px",
        }}
      />

      {/* Headline */}
      <h2
        className="font-druk-wide uppercase leading-none"
        style={{
          fontSize:      "clamp(2.2rem, 5.5vw, 6rem)",
          letterSpacing: "-0.02em",
          color:         "#e8e4dc",
          marginBottom:  "clamp(18px, 2.8vh, 32px)",
          lineHeight:    1.0,
        }}
      >
        {point.label}
      </h2>

      {/* Body */}
      <p
        className="font-ekstra"
        style={{
          fontSize:   "clamp(14px, 1.4vw, 18px)",
          lineHeight: 1.7,
          color:      "rgba(232,228,220,0.70)",
          maxWidth:   480,
        }}
      >
        {point.body}
      </p>

      {/* CTA on last card */}
      {point.cta && (
        <motion.a
          href="/shop"
          style={{
            opacity:        tagOp,
            marginTop:      "clamp(28px, 4vh, 44px)",
            display:        "inline-flex",
            alignItems:     "center",
            gap:            12,
            background:     "#e8e4dc",
            color:          "#23262d",
            borderRadius:   9999,
            padding:        "14px 28px 14px 16px",
            textDecoration: "none",
            pointerEvents:  "auto",
          }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.18 }}
        >
          <span style={{
            width:          36,
            height:         36,
            borderRadius:   "50%",
            background:     "#23262d",
            display:        "inline-flex",
            alignItems:     "center",
            justifyContent: "center",
            flexShrink:     0,
          }}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path d="M2 12L12 2M12 2H4M12 2V10" stroke="#e8e4dc" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="font-druk-wide uppercase" style={{ fontSize: "clamp(11px, 0.9vw, 13px)", letterSpacing: "0.04em" }}>
            Jetzt entdecken
          </span>
        </motion.a>
      )}
    </motion.div>
  )
}

export function Section05() {
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target:  sectionRef,
    offset:  ["start start", "end end"],
  })

  // Intro: fades out during first step
  const introOpacity = useTransform(scrollYProgress, [0, S * 0.55, S], [1, 1, 0])
  const introY       = useTransform(scrollYProgress, [S * 0.55, S], [0, -28])

  // Photo parallax
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"])

  // Progress bar
  const barWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

  return (
    <section
      ref={sectionRef}
      style={{ height: `${STEPS * 100}vh`, position: "relative" }}
    >
      {/* ── Sticky viewport ── */}
      <div
        style={{
          position: "sticky",
          top:       0,
          height:    "100vh",
          overflow:  "hidden",
        }}
      >
        {/* Background photo with parallax */}
        <motion.div
          aria-hidden
          style={{
            position:           "absolute",
            top:                "-18%",
            bottom:             "-18%",
            left:               0,
            right:              0,
            y:                  bgY,
            backgroundImage:    "url('/community.jpg')",
            backgroundSize:     "cover",
            backgroundPosition: "center 30%",
          }}
        />

        {/* Section01-style overlay: dark base + lavender radial tint */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset:    0,
            zIndex:   1,
            background: [
              "radial-gradient(ellipse 75% 65% at 50% 45%, rgba(122,107,145,0.30) 0%, transparent 60%)",
              "rgba(30,33,40,0.72)",
            ].join(", "),
          }}
        />

        {/* ── Intro panel ── */}
        <motion.div
          style={{
            opacity:        introOpacity,
            y:              introY,
            position:       "absolute",
            inset:          0,
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            flexDirection:  "column",
            textAlign:      "center",
            padding:        "0 clamp(24px, 8vw, 140px)",
            pointerEvents:  "none",
            zIndex:         2,
          }}
        >
          <p className="font-ekstra uppercase" style={{ fontSize: 10, letterSpacing: "0.45em", color: "rgba(232,228,220,0.45)", marginBottom: 20 }}>
            Das sind wir
          </p>
          <h2
            className="font-druk-wide uppercase leading-none"
            style={{
              fontSize:      "clamp(2.8rem, 6.5vw, 7rem)",
              letterSpacing: "-0.025em",
              color:         "#e8e4dc",
              marginBottom:  "clamp(16px, 2.5vh, 28px)",
            }}
          >
            WeedForFriends.
            <br />
            <span style={{ color: "transparent", WebkitTextStroke: "clamp(1.5px, 0.12vw, 2.5px) rgba(232,228,220,0.40)" }}>
              Mehr als ein Produkt.
            </span>
          </h2>
          <p className="font-ekstra" style={{ color: "rgba(232,228,220,0.40)", fontSize: "clamp(12px, 1.1vw, 15px)", letterSpacing: "0.06em" }}>
            Scroll ↓
          </p>
        </motion.div>

        {/* ── Point cards ── */}
        {POINTS.map((point, i) => (
          <PointCard key={point.num} point={point} index={i} progress={scrollYProgress} />
        ))}

        {/* ── Progress bar ── */}
        <div
          aria-hidden
          style={{
            position:   "absolute",
            bottom:     0,
            left:       0,
            right:      0,
            height:     2,
            background: "rgba(232,228,220,0.10)",
            zIndex:     10,
          }}
        >
          <motion.div style={{ height: "100%", width: barWidth, background: "rgba(232,228,220,0.55)" }} />
        </div>
      </div>
    </section>
  )
}
