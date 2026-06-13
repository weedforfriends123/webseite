"use client"

import { useRef, useState } from "react"
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion"

const BG   = "#bcc0ca"
const TEXT = "#35383f"
const MUTED = "rgba(53,56,63,0.52)"

const STRAINS = [
  { key: "nl",  line1: "NORTHERN",  line2: "LIGHTS",  img: "/pouches/northern-lights.webp",  flavor: "Kiefer · Erde · Süße" },
  { key: "ph",  line1: "PURPLE",    line2: "HAZE",    img: "/pouches/purple-haze.webp",       flavor: "Beere · Blüte · Süße" },
  { key: "icc", line1: "ICE CREAM", line2: "COOKIES", img: "/pouches/ice-cream-cookies.webp", flavor: "Vanille · Cookie · Crème" },
  { key: "ah",  line1: "AMNESIA",   line2: "HAZE",    img: "/pouches/amnesia-haze.webp",      flavor: "Zitrus · Erde · Würze" },
  { key: "gel", line1: "GEL",       line2: "ATO",     img: "/pouches/gelato.webp",            flavor: "Beere · Sahne · Süße" },
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
          display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
          paddingLeft: i > 0 ? "clamp(12px,2vw,28px)" : 0,
          marginLeft:  i > 0 ? "clamp(12px,2vw,28px)" : 0,
          borderLeft:  i > 0 ? "1px solid rgba(53,56,63,0.22)" : "none",
        }}>
          <span className="font-druk" style={{ fontSize: "clamp(18px,2.6vw,44px)", color: TEXT, lineHeight: 1, letterSpacing: "-0.03em" }}>
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
  const swipeX    = useRef<number | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  // ── Desktop: scroll position drives the active strain ──────────────────────
  const { scrollYProgress } = useScroll({ target: outerRef, offset: ["start start", "end start"] })
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    // Mobile uses swipe/tap — scroll only changes strains on desktop
    if (typeof window !== "undefined" && window.innerWidth < 768) return
    const idx = Math.min(Math.floor(v * STRAINS.length), STRAINS.length - 1)
    if (idx !== activeRef.current) { activeRef.current = idx; setActiveIndex(idx) }
  })

  // ── Shared navigation ────────────────────────────────────────────────────
  const goTo = (idx: number) => {
    const i = Math.max(0, Math.min(idx, STRAINS.length - 1))
    if (i === activeRef.current) return
    activeRef.current = i
    setActiveIndex(i)
  }

  // Dots: direct state on mobile, smooth scroll on desktop
  const dotClick = (idx: number) => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      goTo(idx)
    } else {
      const el = outerRef.current
      if (!el) return
      window.scrollTo({ top: el.offsetTop + (idx / STRAINS.length) * el.offsetHeight, behavior: "smooth" })
    }
  }

  // ── Swipe gesture (mobile only) ──────────────────────────────────────────
  const onTouchStart = (e: React.TouchEvent) => { swipeX.current = e.touches[0].clientX }
  const onTouchEnd   = (e: React.TouchEvent) => {
    if (swipeX.current === null) return
    const dx = swipeX.current - e.changedTouches[0].clientX
    if (Math.abs(dx) > 44) goTo(activeRef.current + (dx > 0 ? 1 : -1))
    swipeX.current = null
  }

  const strain = STRAINS[activeIndex]

  return (
    // Mobile: exactly one viewport height — no extra scroll space, fast paint.
    // Desktop: 400vh so scroll drives the strain carousel via useScroll.
    <div ref={outerRef} className="h-[100svh] md:h-[400vh] relative">
      <section
        id="hero"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{
          position: "sticky", top: 0, height: "100svh",
          background: BG, overflow: "hidden",
          display: "flex", flexDirection: "column",
          // Allow vertical page scroll; capture horizontal for swipe
          touchAction: "pan-y",
        }}
      >
        {/* Radial glow */}
        <div aria-hidden style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
          background: "radial-gradient(ellipse 70% 60% at 65% 55%, rgba(122,107,145,0.28) 0%, transparent 65%)",
        }} />

        {/* Spacer clears the fixed Navbar */}
        <div style={{ height: "clamp(72px,10vh,112px)", flexShrink: 0 }} />

        {/* ── MAIN GRID ────────────────────────────────────────────────────── */}
        <div
          className="grid grid-cols-1 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
          style={{
            flex: 1,
            alignItems: "center",
            alignContent: "center",
            padding: "0 clamp(16px,4vw,72px) clamp(10px,2vh,32px)",
            gap: "clamp(6px,1.6vw,28px)",
            position: "relative", zIndex: 5,
            overflow: "hidden",
          }}
        >

          {/* ── POUCH COLUMN ────────────────────────────────────────────────── */}
          <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 0 }}>

            {/* ── MOBILE IMAGE — alle 3 immer im DOM, damit sie beim Laden schon da sind ── */}
            <div className="block md:hidden" style={{ position: "relative", height: "42vh", width: "100%" }}>
              {STRAINS.map((s, i) => (
                <motion.div
                  key={s.key + "-m"}
                  initial={{ opacity: i === 0 ? 1 : 0, x: i === 0 ? 0 : 64 }}
                  animate={{
                    opacity: i === activeIndex ? 1 : 0,
                    x: i === activeIndex ? 0 : i < activeIndex ? -64 : 64,
                  }}
                  transition={{ duration: 0.30, ease: [0.16, 1, 0.3, 1] as const }}
                  style={{
                    position: "absolute", inset: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    pointerEvents: i === activeIndex ? "auto" : "none",
                  }}
                >
                  <img
                    src={s.img}
                    alt={`${s.line1} ${s.line2}`}
                    fetchPriority={i === 0 ? "high" : "low"}
                    style={{ height: "42vh", width: "auto", objectFit: "contain",
                      userSelect: "none", pointerEvents: "none", display: "block" }}
                    draggable={false}
                  />
                </motion.div>
              ))}
            </div>

            {/* ── MOBILE PREV / NEXT BUTTONS ─────────────────────────────── */}
            <div className="block md:hidden" style={{
              position: "absolute", inset: 0, zIndex: 10,
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "0 6px", pointerEvents: "none",
            }}>
              {/* Prev */}
              <button
                onClick={() => goTo(activeIndex - 1)}
                disabled={activeIndex === 0}
                style={{
                  pointerEvents: "all",
                  width: 30, height: 30, borderRadius: "50%",
                  background: "rgba(255,255,255,0.55)",
                  border: "1px solid rgba(255,255,255,0.75)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  opacity: activeIndex === 0 ? 0 : 1,
                  transition: "opacity 0.25s ease",
                  cursor: activeIndex === 0 ? "default" : "pointer",
                }}
                aria-label="Vorheriger Strain"
              >
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke={TEXT} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 1.5L3 4.5L6 7.5"/>
                </svg>
              </button>

              {/* Next */}
              <button
                onClick={() => goTo(activeIndex + 1)}
                disabled={activeIndex === STRAINS.length - 1}
                style={{
                  pointerEvents: "all",
                  width: 30, height: 30, borderRadius: "50%",
                  background: "rgba(255,255,255,0.55)",
                  border: "1px solid rgba(255,255,255,0.75)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  opacity: activeIndex === STRAINS.length - 1 ? 0 : 1,
                  transition: "opacity 0.25s ease",
                  cursor: activeIndex === STRAINS.length - 1 ? "default" : "pointer",
                }}
                aria-label="Nächster Strain"
              >
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke={TEXT} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 1.5L6 4.5L3 7.5"/>
                </svg>
              </button>
            </div>

            {/* ── DESKTOP IMAGE (spring fly-in + ambient float) ───────────── */}
            <div className="hidden md:block">
              <AnimatePresence mode="wait">
                <motion.div
                  key={strain.key + "-d"}
                  initial={{ y: "-110%", rotate: -10, opacity: 0 }}
                  animate={{ y: 0, rotate: 0, opacity: 1 }}
                  exit={{ y: "60%", rotate: 8, opacity: 0, scale: 0.88 }}
                  transition={{
                    y: { type: "spring", stiffness: 200, damping: 22, mass: 0.9 },
                    rotate: { type: "spring", stiffness: 180, damping: 20 },
                    opacity: { duration: 0.2 },
                  }}
                >
                  <motion.div
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <img
                      src={strain.img}
                      alt={`${strain.line1} ${strain.line2}`}
                      style={{ height: "68vh", maxHeight: 820, width: "auto", objectFit: "contain",
                        userSelect: "none", pointerEvents: "none", display: "block" }}
                      draggable={false}
                    />
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>

          {/* ── INFO COLUMN ─────────────────────────────────────────────────── */}
          <div className="flex flex-col items-center md:items-start" style={{ gap: "clamp(8px,1.4vh,22px)" }}>

            {/* Stats — no entrance animation delay on mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35, delay: 0.05 }}
            >
              <StatStrip />
            </motion.div>

            {/* Strain name + flavour — alle 3 immer im DOM, kein AnimatePresence-Delay */}
            <div style={{ position: "relative", width: "100%" }}>
              {STRAINS.map((s, i) => (
                <motion.div
                  key={s.key + "-text"}
                  initial={{ opacity: i === 0 ? 1 : 0, x: i === 0 ? 0 : 28 }}
                  animate={{
                    opacity: i === activeIndex ? 1 : 0,
                    x: i === activeIndex ? 0 : i < activeIndex ? -28 : 28,
                  }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] as const }}
                  style={{
                    position: i === 0 ? "relative" : "absolute",
                    top: i === 0 ? undefined : 0,
                    width: "100%",
                    pointerEvents: i === activeIndex ? "auto" : "none",
                  }}
                >
                  <h1
                    className="font-druk-wide uppercase text-center md:text-left"
                    style={{ lineHeight: 0.88, letterSpacing: "-0.02em", marginBottom: "clamp(8px,1.2vh,16px)" }}
                  >
                    <span className="block text-[9.5vw] md:text-[5.8vw]"
                      style={{ color: "transparent", WebkitTextStroke: `clamp(1.5px,0.14vw,2.5px) ${TEXT}` }}>
                      {s.line1}
                    </span>
                    <span className="block text-[9.5vw] md:text-[5.8vw]" style={{ color: TEXT }}>
                      {s.line2}
                    </span>
                  </h1>
                  <p className="font-ekstra text-center md:text-left"
                    style={{ fontSize: "clamp(11px,1vw,15px)", color: MUTED, lineHeight: 1.7 }}>
                    600 Puffs · Superior Blend · EU-zertifiziert
                    <br />
                    <span style={{ color: TEXT, opacity: 0.72 }}>{s.flavor}</span>
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Navigation dots */}
            <div className="flex justify-center md:justify-start" style={{ gap: 8, alignItems: "center" }}>
              {STRAINS.map((s, i) => (
                <button
                  key={s.key}
                  onClick={() => dotClick(i)}
                  aria-label={`${s.line1} ${s.line2}`}
                  style={{ border: "none", cursor: "pointer", padding: "8px 4px", background: "none", display: "flex" }}
                >
                  <motion.div
                    animate={{ width: i === activeIndex ? 26 : 8, opacity: i === activeIndex ? 1 : 0.30 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    style={{ height: 5, borderRadius: 99, background: TEXT }}
                  />
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* ── SCRIBBLE ─────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.5 }} aria-hidden
          className="block md:hidden"
          style={{
            position: "absolute",
            top: "calc(clamp(72px,10vh,112px) + 6px)",
            left: "clamp(14px,4vw,32px)",
            transform: "rotate(-4deg)",
            zIndex: 20, pointerEvents: "none", userSelect: "none",
          }}
        >
          <p className="font-mindflow" style={{ color: "#eddc8c", fontSize: "clamp(13px,3.8vw,18px)", lineHeight: 1.5 }}>
            Real Flavor,<br />Original Taste
          </p>
          <svg width="28" height="22" viewBox="0 0 46 38" style={{ marginTop: 3 }}>
            <path d="M5 5 Q18 22 38 32" fill="none" stroke="#eddc8c" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M38 32L30 27M38 32L31 22" fill="none" stroke="#eddc8c" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </motion.div>
        {/* Desktop scribble — original top-left position */}
        <motion.div
          className="hidden md:block"
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
