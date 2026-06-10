"use client"

import { useRef, useState } from "react"
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion"

const PAGE_BG = "#35383f"

const FEATURES = [
  {
    num: "01",
    title: "Always in Stock",
    body: "Deine Flavors immer verfügbar – niemals ausverkauft. Wir halten Lager, damit du nie leer ausgehst.",
    tag: "24 / 7 Supply",
  },
  {
    num: "02",
    title: "Diskreter Versand",
    body: "Neutrale Verpackung, kein Logo außen drauf. Anonym und sicher – genau so, wie du es willst.",
    tag: "Anonymous Shipping",
  },
  {
    num: "03",
    title: "Easy Checkout",
    body: "Bestellen in unter 60 Sekunden. Kein Account-Zwang, keine langen Formulare. Click, pay, done.",
    tag: "< 60 Seconds",
  },
  {
    num: "04",
    title: "Treue zahlt sich aus",
    body: "Sammel Punkte bei jedem Drop und hol dir Rabatte. Je öfter du bestellst, desto günstiger wird's.",
    tag: "Loyalty Points",
  },
]

// Each feature occupies an equal slice of the scroll range
const SLICE = 1 / FEATURES.length

function activeFeature(v: number) {
  return Math.min(Math.floor(v / SLICE), FEATURES.length - 1)
}

// Within-feature progress 0→1 (entry → hold → exit)
function sliceProgress(v: number, idx: number) {
  return Math.min(Math.max((v - idx * SLICE) / SLICE, 0), 1)
}

export function FeaturesSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  // Drive active feature index from scroll
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(activeFeature(v))
  })

  // Subtle horizontal drift for the ghost text — ties it visually to product rotation
  const ghostX = useTransform(scrollYProgress, [0, 1], ["-3%", "3%"])
  // Dissolve to cream before sticky releases
  const exitOverlay = useTransform(scrollYProgress, [0.88, 1.0], [0, 1])

  return (
    <div ref={containerRef} style={{ height: `${FEATURES.length * 100}vh` }}>
      <div
        className="sticky top-0 w-full overflow-hidden"
        style={{ height: "100svh", background: "#35383f" }}
      >
        {/* ── Giant ghost text — drifts subtly as product rotates ── */}
        <motion.div
          className="absolute inset-0 flex flex-col justify-center pointer-events-none select-none"
          style={{ x: ghostX, paddingLeft: "clamp(6px, 1vw, 24px)", zIndex: 1 }}
          aria-hidden
        >
          {["GOOD", "VAPES", "ONLY."].map((word) => (
            <p
              key={word}
              className="font-mindflow leading-none"
              style={{
                fontSize:      "clamp(5.5rem, 21vw, 28rem)",
                letterSpacing: "-0.01em",
                lineHeight:    0.86,
                color:         "rgba(53,56,63,0.055)",
              }}
            >
              {word}
            </p>
          ))}
        </motion.div>

        {/* ── Progress dots ── */}
        <div
          className="absolute right-5 md:right-10 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3"
          style={{ zIndex: 20 }}
        >
          {FEATURES.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-500"
              style={{
                width:      i === active ? 6 : 4,
                height:     i === active ? 28 : 8,
                background: i === active ? "#35383f" : "rgba(53,56,63,0.20)",
              }}
            />
          ))}
        </div>

        {/* ── Eyebrow ── */}
        <div
          className="absolute top-0 left-0 right-0"
          style={{ paddingTop: "clamp(24px, 4vh, 48px)", paddingLeft: "clamp(20px, 5vw, 80px)", zIndex: 10 }}
        >
          <span
            className="font-mono uppercase"
            style={{ fontSize: "9px", letterSpacing: "0.45em", color: "rgba(53,56,63,0.28)" }}
          >
            Warum WFF
          </span>
        </div>

        {/* ── Active feature text — animates in from alternating sides ── */}
        <div
          className="absolute inset-0 flex flex-col justify-end"
          style={{
            paddingBottom: "clamp(80px, 10vh, 100px)",
            paddingLeft:   "clamp(20px, 5vw, 80px)",
            paddingRight:  "clamp(20px, 5vw, 80px)",
            zIndex:        10,
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              {/* Title — big, like hero headline */}
              <p
                className="font-adieu uppercase leading-none mb-5"
                style={{
                  fontSize:      "clamp(2.8rem, 7vw, 9rem)",
                  letterSpacing: "-0.025em",
                  lineHeight:    0.85,
                  color:         "#35383f",
                  maxWidth:      "clamp(280px, 52vw, 680px)",
                }}
              >
                {FEATURES[active].title}
              </p>

              {/* Body */}
              <p
                className="font-ekstra leading-relaxed mb-5"
                style={{
                  fontSize: "clamp(15px, 1.4vw, 20px)",
                  color:    "rgba(53,56,63,0.78)",
                  maxWidth: 460,
                }}
              >
                {FEATURES[active].body}
              </p>

              {/* Tag */}
              <span
                className="inline-block font-mono tracking-[0.25em] uppercase"
                style={{
                  fontSize:     "clamp(10px, 1vw, 13px)",
                  padding:      "clamp(6px, 0.8vh, 10px) clamp(14px, 1.8vw, 22px)",
                  color:        "#a0ba87",
                  border:       "1px solid rgba(160,186,135,0.35)",
                  letterSpacing: "0.25em",
                }}
              >
                {FEATURES[active].tag}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Scroll progress bar (bottom edge) ── */}
        <motion.div
          className="absolute bottom-0 left-0 h-[2px] origin-left"
          style={{
            scaleX:     scrollYProgress,
            background: "#35383f",
            opacity:    0.14,
            zIndex:     20,
            width:      "100%",
          }}
        />

        {/* Exit overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 35, opacity: exitOverlay, background: PAGE_BG }}
          aria-hidden
        />
      </div>
    </div>
  )
}
