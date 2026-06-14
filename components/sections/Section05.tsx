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
    label: "EU-zertifiziert",
    body:  "Jedes Produkt mit öffentlichem Prüfzeugnis (COA). Keine Geheimnisse über Wirkstoffe oder Inhaltsstoffe.",
  },
  {
    num:   "03",
    label: "Kein Nikotin. Kein Tabak.",
    body:  "Nur was reingehört. Echte Cannabinoide, echte Terpene — und sonst nichts.",
  },
  {
    num:   "04",
    label: "6 Sorten",
    body:  "Von mild bis intensiv. Handselektiert mit echten Terpenen — für jeden Charakter.",
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
const S     = 1 / STEPS
const T     = S * 0.28        // transition ramp

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
  // Alternate slide direction for visual variety
  const fromX   = index % 2 === 0 ? -48 : 48
  const x       = useTransform(progress, [enter, peak], [fromX, 0])
  const labelOp = useTransform(progress, [enter, peak + T * 0.6], [0, 1])

  return (
    <motion.div
      style={{
        opacity,
        position:       "absolute",
        inset:          0,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        pointerEvents:  "none",
        zIndex:         2,
      }}
    >
      {/* Decorative background number */}
      <div
        aria-hidden
        style={{
          position:       "absolute",
          inset:          0,
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          overflow:       "hidden",
          pointerEvents:  "none",
        }}
      >
        <span
          className="font-druk-wide select-none"
          style={{
            fontSize:         "clamp(42vw, 55vw, 70vw)",
            color:            "transparent",
            WebkitTextStroke: "1px rgba(232,228,220,0.055)",
            lineHeight:       1,
            letterSpacing:    "-0.04em",
            userSelect:       "none",
          }}
        >
          {point.num}
        </span>
      </div>

      {/* Content */}
      <motion.div
        style={{
          x,
          textAlign:     "center",
          padding:       "0 clamp(28px, 8vw, 140px)",
          position:      "relative",
          zIndex:        1,
          maxWidth:      680,
        }}
      >
        {/* Counter + line */}
        <motion.div
          style={{ opacity: labelOp }}
          className="flex items-center justify-center gap-4 mb-7"
        >
          <div style={{ flex: 1, height: 1, background: "rgba(232,228,220,0.18)", maxWidth: 48 }} />
          <span
            className="font-ekstra uppercase"
            style={{ fontSize: 10, letterSpacing: "0.48em", color: "rgba(232,228,220,0.40)" }}
          >
            {point.num} / {String(N).padStart(2, "0")}
          </span>
          <div style={{ flex: 1, height: 1, background: "rgba(232,228,220,0.18)", maxWidth: 48 }} />
        </motion.div>

        {/* Headline — mix solid + outline */}
        <h2
          className="font-druk-wide uppercase leading-none"
          style={{
            fontSize:      "clamp(2.4rem, 5.8vw, 6.2rem)",
            letterSpacing: "-0.025em",
            color:         "#e8e4dc",
            marginBottom:  "clamp(20px, 3vh, 32px)",
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
            lineHeight: 1.75,
            color:      "rgba(232,228,220,0.65)",
            maxWidth:   440,
            margin:     "0 auto",
          }}
        >
          {point.body}
        </p>

        {/* CTA on last card */}
        {point.cta && (
          <motion.a
            href="/shop"
            style={{
              opacity:        labelOp,
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
              width: 36, height: 36, borderRadius: "50%",
              background: "#23262d",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
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
    </motion.div>
  )
}

export function Section05() {
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target:  sectionRef,
    offset:  ["start start", "end end"],
  })

  // Seamless blend from Section04's #bcc0ca background — fades out over first 0.6 steps
  const entryBlend = useTransform(scrollYProgress, [0, S * 0.6], [1, 0])

  // Intro panel
  const introOpacity = useTransform(scrollYProgress, [S * 0.05, S * 0.3, S * 0.7, S], [0, 1, 1, 0])
  const introY       = useTransform(scrollYProgress, [S * 0.7, S], [0, -28])

  // Photo parallax
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])

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
            top:                "-20%",
            bottom:             "-20%",
            left:               0,
            right:              0,
            y:                  bgY,
            backgroundImage:    "url('/community.jpg')",
            backgroundSize:     "cover",
            backgroundPosition: "center 35%",
          }}
        />

        {/* Mood overlay: dark + lavender radial (lighter than before so photo shows) */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset:    0,
            zIndex:   1,
            background: [
              "radial-gradient(ellipse 80% 70% at 50% 42%, rgba(122,107,145,0.28) 0%, transparent 58%)",
              "rgba(22,24,30,0.58)",
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
            padding:        "0 clamp(28px, 8vw, 140px)",
            pointerEvents:  "none",
            zIndex:         2,
          }}
        >
          <p
            className="font-ekstra uppercase"
            style={{ fontSize: 10, letterSpacing: "0.48em", color: "rgba(232,228,220,0.38)", marginBottom: 24 }}
          >
            Das sind wir
          </p>
          <h2
            className="font-druk-wide uppercase leading-none"
            style={{
              fontSize:      "clamp(3rem, 7vw, 7.5rem)",
              letterSpacing: "-0.028em",
              color:         "#e8e4dc",
              marginBottom:  "clamp(14px, 2vh, 24px)",
            }}
          >
            WeedForFriends.
            <br />
            <span style={{ color: "transparent", WebkitTextStroke: "clamp(1.5px, 0.12vw, 2.5px) rgba(232,228,220,0.35)" }}>
              Mehr als ein Produkt.
            </span>
          </h2>
          <p
            className="font-ekstra"
            style={{ color: "rgba(232,228,220,0.35)", fontSize: "clamp(11px, 1vw, 14px)", letterSpacing: "0.08em" }}
          >
            scroll ↓
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
            background: "rgba(232,228,220,0.08)",
            zIndex:     10,
          }}
        >
          <motion.div style={{ height: "100%", width: barWidth, background: "rgba(232,228,220,0.45)" }} />
        </div>

        {/* ── Section04→05 blend: #bcc0ca fades out as you enter ── */}
        <motion.div
          aria-hidden
          style={{
            opacity:       entryBlend,
            position:      "absolute",
            inset:         0,
            zIndex:        20,
            background:    "#bcc0ca",
            pointerEvents: "none",
          }}
        />
      </div>
    </section>
  )
}
