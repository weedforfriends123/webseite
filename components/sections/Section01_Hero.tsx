"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion"

const BG    = "#bcc0ca"
const TEXT  = "#35383f"
const MUTED = "rgba(53,56,63,0.52)"

const STRAINS = [
  { key: "nl",  line1: "NORTHERN",  line2: "LIGHTS",  img: "/pouches/northern-lights.webp",  flavor: "Kiefer · Erde · Süße" },
  { key: "ph",  line1: "PURPLE",    line2: "HAZE",    img: "/pouches/purple-haze.webp",       flavor: "Beere · Blüte · Süße" },
  { key: "icc", line1: "ICE CREAM", line2: "COOKIES", img: "/pouches/ice-cream-cookies.webp", flavor: "Vanille · Cookie · Crème" },
]

function StatStrip() {
  const stats = [
    { value: "600", label: "PUFFS" },
    { value: "LAB", label: "TESTED" },
    { value: "EU",  label: "MADE"  },
  ]
  return (
    <div style={{ display: "inline-flex", alignItems: "stretch" }}>
      {stats.map(({ value, label }, i) => (
        <div key={value} style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 7,
          paddingLeft:  i > 0 ? "clamp(14px,2vw,30px)" : 0,
          marginLeft:   i > 0 ? "clamp(14px,2vw,30px)" : 0,
          borderLeft:   i > 0 ? "1px solid rgba(53,56,63,0.22)" : "none",
        }}>
          <span className="font-druk" style={{ fontSize: "clamp(20px,2.6vw,44px)", color: TEXT, lineHeight: 1, letterSpacing: "-0.03em" }}>
            {value}
          </span>
          <span className="font-ekstra" style={{ fontSize: "clamp(8px,0.58vw,9px)", color: MUTED, letterSpacing: "0.18em", textTransform: "uppercase" }}>
            {label}
          </span>
        </div>
      ))}
    </div>
  )
}


export function Section01_Hero() {
  const outerRef  = useRef<HTMLDivElement>(null)
  const activeRef = useRef(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check, { passive: true })
    return () => window.removeEventListener("resize", check)
  }, [])

  const { scrollYProgress } = useScroll({ target: outerRef, offset: ["start start", "end start"] })

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(Math.floor(v * STRAINS.length), STRAINS.length - 1)
    if (idx !== activeRef.current) { activeRef.current = idx; setActiveIndex(idx) }
  })

  const jumpToStrain = (idx: number) => {
    const el = outerRef.current
    if (!el) return
    window.scrollTo({ top: el.offsetTop + (idx / STRAINS.length) * el.offsetHeight, behavior: "smooth" })
  }

  const strain = STRAINS[activeIndex]

  return (
    <div ref={outerRef} style={{ height: "400vh", position: "relative" }}>
      <section id="hero" style={{
        position: "sticky", top: 0, height: "100svh",
        background: BG, overflow: "hidden",
        display: "flex", flexDirection: "column",
      }}>
        {/* Radial glow */}
        <div aria-hidden style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
          background: "radial-gradient(ellipse 70% 60% at 65% 55%, rgba(122,107,145,0.30) 0%, transparent 65%)",
        }} />

        {/* spacer so hero content clears the fixed Navbar */}
        <div style={{ height: "clamp(80px,10.5vh,124px)", flexShrink: 0 }} />

        {/* ── MAIN GRID ────────────────────────────────────────────────────── */}
        <div
          className="grid grid-cols-1 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
          style={{
            flex: 1,
            alignItems: "center",
            padding: "clamp(4px,0.8vh,16px) clamp(16px,4vw,72px) clamp(12px,2.5vh,36px)",
            gap: "clamp(4px,1.5vw,32px)",
            position: "relative", zIndex: 5,
            overflow: "hidden",
          }}
        >
          {/* ── POUCH COLUMN ────────────────────────────────────────────────── */}
          <div className="flex items-center justify-center relative" style={{ height: "100%", minHeight: 0 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={strain.key}
                initial={isMobile ? { opacity: 0 } : { y: "-110%", rotate: -10, opacity: 0 }}
                animate={isMobile ? { opacity: 1 } : { y: 0, rotate: 0, opacity: 1 }}
                exit={isMobile ? { opacity: 0 } : { y: "60%", rotate: 8, opacity: 0, scale: 0.88 }}
                transition={isMobile
                  ? { duration: 0.22, ease: "easeOut" }
                  : {
                      y: { type: "spring", stiffness: 200, damping: 22, mass: 0.9 },
                      rotate: { type: "spring", stiffness: 180, damping: 20 },
                      opacity: { duration: 0.2 },
                    }
                }
                className="mt-10 md:mt-0"
                style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <motion.div
                  className="hidden md:block"
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <img
                    src={strain.img}
                    alt={`${strain.line1} ${strain.line2}`}
                    className="h-[40vh] md:h-[68vh]"
                    style={{ maxHeight: 820, width: "auto", objectFit: "contain", userSelect: "none", pointerEvents: "none" }}
                    draggable={false}
                  />
                </motion.div>
                <img
                  src={strain.img}
                  alt={`${strain.line1} ${strain.line2}`}
                  className="block md:hidden h-[40vh]"
                  style={{ width: "auto", objectFit: "contain", userSelect: "none", pointerEvents: "none" }}
                  draggable={false}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── INFO COLUMN ─────────────────────────────────────────────────── */}
          <div className="flex flex-col items-center md:items-start" style={{ gap: "clamp(10px,1.6vh,24px)" }}>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.85, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}>
              <StatStrip />
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={strain.key + "-text"}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                style={{ width: "100%" }}
              >
                <h1 className="font-druk-wide uppercase text-center md:text-left"
                  style={{ lineHeight: 0.88, letterSpacing: "-0.02em", marginBottom: "clamp(8px,1.2vh,16px)" }}>
                  <span className="block text-[9.5vw] md:text-[5.8vw]"
                    style={{ color: "transparent", WebkitTextStroke: `clamp(1.5px,0.14vw,2.5px) ${TEXT}` }}>
                    {strain.line1}
                  </span>
                  <span className="block text-[9.5vw] md:text-[5.8vw]" style={{ color: TEXT }}>
                    {strain.line2}
                  </span>
                </h1>
                <p className="font-ekstra text-center md:text-left" style={{
                  fontSize: "clamp(12px,1vw,15px)", color: MUTED,
                  lineHeight: 1.7,
                }}>
                  600 Puffs · Superior Blend · EU-zertifiziert
                  <br />
                  <span style={{ color: TEXT, opacity: 0.72 }}>{strain.flavor}</span>
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Strain dots */}
            <div className="flex justify-center md:justify-start" style={{ gap: 10, alignItems: "center" }}>
              {STRAINS.map((s, i) => (
                <button key={s.key} onClick={() => jumpToStrain(i)} aria-label={`${s.line1} ${s.line2}`}
                  style={{ border: "none", cursor: "pointer", padding: 4, background: "none", display: "flex" }}>
                  <motion.div
                    animate={{ width: i === activeIndex ? 28 : 8, opacity: i === activeIndex ? 1 : 0.32 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    style={{ height: 6, borderRadius: 99, background: TEXT }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── SCRIBBLE ─────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.6 }} aria-hidden
          style={{
            position: "absolute",
            top: "clamp(72px,12vh,200px)",
            left: "clamp(16px,14vw,240px)",
            transform: "rotate(-4deg)",
            zIndex: 10, pointerEvents: "none", userSelect: "none",
          }}
        >
          <p className="font-mindflow" style={{ color: "#eddc8c", fontSize: "clamp(14px,1.8vw,28px)", lineHeight: 1.55 }}>
            Real Flavor,<br />Original Taste
          </p>
          <svg width="38" height="32" viewBox="0 0 46 38" style={{ marginTop: 4 }}>
            <path d="M5 5 Q18 22 38 32" fill="none" stroke="#eddc8c" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M38 32L30 27M38 32L31 22" fill="none" stroke="#eddc8c" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </motion.div>

      </section>
    </div>
  )
}
