"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, MotionValue } from "framer-motion"

const POINTS = [
  {
    num:    "01",
    label:  "Für echte Freunde",
    body:   "Kein Konzern. Keine Massenware. Eine Community — und Produkte, die wir selbst lieben.",
    accent: "rgba(130,100,220,0.22)",
    stroke: "rgba(130,100,220,0.28)",
  },
  {
    num:    "02",
    label:  "EU-zertifiziert",
    body:   "Jedes Produkt mit öffentlichem Prüfzeugnis (COA). Keine Geheimnisse über Wirkstoffe oder Inhaltsstoffe.",
    accent: "rgba(70,190,100,0.18)",
    stroke: "rgba(70,190,100,0.26)",
  },
  {
    num:    "03",
    label:  "Rein & ehrlich.",
    body:   "Nur was reingehört: echte Cannabinoide, natürliche Terpene — keine künstlichen Zusatzstoffe. Bei jedem Produkt. Immer.",
    accent: "rgba(210,205,185,0.14)",
    stroke: "rgba(210,205,185,0.22)",
  },
  {
    num:    "04",
    label:  "Für jeden Moment.",
    body:   "Vapes, Pods, Edibles und Blüten — jedes Produkt für einen anderen Anlass, jeden Geschmack. Handselektiert, laborgeprüft.",
    accent: "rgba(200,158,55,0.20)",
    stroke: "rgba(200,158,55,0.28)",
  },
  {
    num:    "05",
    label:  "Diskret & schnell",
    body:   "Lieferung in 2–4 Tagen. Unmarkierte Verpackung. Sicher und ohne Fragen.",
    accent: "rgba(50,185,185,0.16)",
    stroke: "rgba(50,185,185,0.24)",
  },
  {
    num:    "06",
    label:  "Qualität ohne Kompromisse",
    body:   "Hergestellt nach höchsten Standards. Jeden Tag. Für dich.",
    accent: "rgba(210,85,75,0.16)",
    stroke: "rgba(210,85,75,0.24)",
    cta:    true,
  },
]

const N     = POINTS.length
const STEPS = N + 1
const S     = 1 / STEPS
const T     = S * 0.30

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
  const x       = useTransform(progress, [enter, peak], [80, 0])
  const scale   = useTransform(progress, [enter, peak], [0.96, 1.0])
  const labelOp = useTransform(progress, [enter, peak + T * 0.4], [0, 1])
  const numOp   = useTransform(progress, [enter, peak], [0, 1])

  return (
    <motion.div
      style={{
        opacity,
        position:       "absolute",
        inset:          0,
        display:        "flex",
        alignItems:     "flex-end",
        justifyContent: "center",
        paddingBottom:  "clamp(56px, 10dvh, 140px)",
        pointerEvents:  "none",
        zIndex:         2,
      }}
    >
      {/* Per-card radial accent glow */}
      <div aria-hidden style={{
        position:   "absolute",
        inset:      0,
        background: `radial-gradient(ellipse 75% 65% at 50% 52%, ${point.accent} 0%, transparent 62%)`,
        pointerEvents: "none",
      }} />

      {/* Giant background number */}
      <div aria-hidden style={{
        position:       "absolute",
        inset:          0,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        overflow:       "hidden",
        pointerEvents:  "none",
        transform:      "translateY(6%)",
      }}>
        <motion.span
          className="font-druk-wide select-none"
          style={{
            opacity:          numOp,
            fontSize:         "clamp(60vw, 67vw, 74vw)",
            color:            "transparent",
            WebkitTextStroke: `1.4px ${point.stroke}`,
            lineHeight:       1,
            letterSpacing:    "-0.04em",
            userSelect:       "none",
          }}
        >
          {point.num}
        </motion.span>
      </div>

      {/* Content */}
      <motion.div
        style={{
          x,
          scale,
          textAlign: "center",
          padding:   "0 clamp(24px, 5vw, 110px)",
          position:  "relative",
          zIndex:    1,
          maxWidth:  740,
          width:     "100%",
        }}
      >
        {/* Headline */}
        <h2
          className="font-druk-wide uppercase"
          style={{
            fontSize:      "clamp(2rem, 6.8vw, 8.5rem)",
            letterSpacing: "-0.03em",
            lineHeight:    1.0,
            color:         "#e8e4dc",
            marginBottom:  "clamp(14px, 2.2vh, 30px)",
          }}
        >
          {point.label}
        </h2>

        {/* Accent line */}
        <div style={{
          width:        "clamp(28px, 3.5vw, 52px)",
          height:       2,
          margin:       "0 auto clamp(12px, 1.8vh, 24px)",
          borderRadius: 1,
          background:   point.stroke.replace(/[\d.]+\)$/, "0.85)"),
        }} />

        {/* Body */}
        <p className="font-ekstra" style={{
          fontSize:   "clamp(13px, 1.2vw, 17px)",
          lineHeight: 1.88,
          color:      "rgba(232,228,220,0.60)",
          maxWidth:   460,
          margin:     "0 auto",
        }}>
          {point.body}
        </p>

        {/* CTA — last card only */}
        {point.cta && (
          <motion.a
            href="/shop"
            style={{
              opacity:        labelOp,
              marginTop:      "clamp(24px, 3.5vh, 48px)",
              display:        "inline-flex",
              alignItems:     "center",
              gap:            12,
              background:     "#e8e4dc",
              color:          "#23262d",
              borderRadius:   9999,
              padding:        "14px 30px 14px 16px",
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
            <span className="font-druk-wide uppercase" style={{ fontSize: "clamp(11px, 0.85vw, 13px)", letterSpacing: "0.04em" }}>
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
    target: sectionRef,
    offset: ["start start", "end end"],
  })

  // S04→S05 entry: full-step blend — photo reveals as you scroll in
  const entryBlend  = useTransform(scrollYProgress, [0, S], [1, 0])
  const bgScale     = useTransform(scrollYProgress, [0, S * 0.85], [1.06, 1.0])

  // Parallax via backgroundPosition — no element translation, no gray areas possible
  const bgPosY = useTransform(scrollYProgress, [0, 1], ["35%", "50%"])

  // Intro
  const introOpacity = useTransform(scrollYProgress, [S * 0.06, S * 0.32, S * 0.70, S], [0, 1, 1, 0])
  const introY       = useTransform(scrollYProgress, [S * 0.70, S], [0, -36])
  const introScale   = useTransform(scrollYProgress, [S * 0.06, S * 0.32], [0.95, 1.0])

  // Progress bar
  const barWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

  return (
    <section ref={sectionRef} style={{ height: `${STEPS * 100}vh`, position: "relative" }}>
      <div style={{ position: "sticky", top: 0, height: "100dvh", overflow: "hidden" }}>

        {/* Background photo — inset:0 so no gray area, backgroundPosition for parallax */}
        <motion.div
          aria-hidden
          style={{
            position:           "absolute",
            inset:              0,
            scale:              bgScale,
            backgroundImage:    "url('/community.jpg')",
            backgroundSize:     "cover",
            backgroundPositionX: "50%",
            backgroundPositionY: bgPosY,
          }}
        />

        {/* Cinematic overlay */}
        <div aria-hidden style={{
          position: "absolute", inset: 0, zIndex: 1,
          background: [
            "radial-gradient(ellipse 85% 75% at 50% 46%, rgba(95,72,150,0.24) 0%, transparent 55%)",
            "linear-gradient(to bottom, rgba(10,12,16,0.55) 0%, rgba(10,12,16,0.08) 35%, rgba(10,12,16,0.08) 60%, rgba(10,12,16,0.65) 100%)",
            "rgba(12,14,18,0.65)",
          ].join(", "),
        }} />

        {/* Intro panel */}
        <motion.div style={{
          opacity:        introOpacity,
          y:              introY,
          scale:          introScale,
          position:       "absolute",
          inset:          0,
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          flexDirection:  "column",
          textAlign:      "center",
          padding:        "0 clamp(24px, 6vw, 120px)",
          pointerEvents:  "none",
          zIndex:         2,
        }}>
          <p className="font-ekstra uppercase" style={{
            fontSize: 9, letterSpacing: "0.56em",
            color: "rgba(232,228,220,0.32)", marginBottom: 32,
          }}>
            Das sind wir
          </p>
          <h2 className="font-druk-wide uppercase" style={{
            fontSize:      "clamp(1.9rem, 7.8vw, 9rem)",
            letterSpacing: "-0.03em",
            lineHeight:    0.96,
            color:         "#e8e4dc",
            marginBottom:  "clamp(8px, 1.2vh, 16px)",
          }}>
            WeedForFriends.
          </h2>
          <h2 className="font-druk-wide uppercase" style={{
            fontSize:         "clamp(1.9rem, 7.8vw, 9rem)",
            letterSpacing:    "-0.03em",
            lineHeight:       0.96,
            color:            "transparent",
            WebkitTextStroke: "clamp(1.5px, 0.1vw, 2.5px) rgba(232,228,220,0.25)",
            marginBottom:     "clamp(32px, 5dvh, 56px)",
          }}>
            Mehr als ein Produkt.
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 1, height: 32, background: "rgba(232,228,220,0.18)" }} />
            <p className="font-ekstra uppercase" style={{
              fontSize: 9, letterSpacing: "0.52em",
              color: "rgba(232,228,220,0.28)",
            }}>scroll</p>
            <div style={{ width: 1, height: 32, background: "rgba(232,228,220,0.18)" }} />
          </div>
        </motion.div>

        {/* Point cards */}
        {POINTS.map((point, i) => (
          <PointCard key={point.num} point={point} index={i} progress={scrollYProgress} />
        ))}

        {/* Progress bar */}
        <div aria-hidden style={{
          position:   "absolute",
          bottom:     0, left: 0, right: 0,
          height:     2,
          background: "rgba(232,228,220,0.07)",
          zIndex:     10,
        }}>
          <motion.div style={{ height: "100%", width: barWidth, background: "rgba(232,228,220,0.42)" }} />
        </div>

        {/* S04→05 entry blend */}
        <motion.div aria-hidden style={{
          opacity:       entryBlend,
          position:      "absolute",
          inset:         0,
          zIndex:        20,
          background:    "#bcc0ca",
          pointerEvents: "none",
        }} />
      </div>
    </section>
  )
}
