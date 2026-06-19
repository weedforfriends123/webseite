"use client"

import { useRef, useState } from "react"
import { motion, useScroll, useTransform, useMotionValueEvent, type MotionValue } from "framer-motion"

const BG    = "#bcc0ca"
const TEXT  = "#35383f"
const MUTED = "rgba(53,56,63,0.52)"
const N     = 6

const STRAINS = [
  { key: "gel", number: "01", line1: "GEL",         line2: "ATO",      img: "/pouches/gelato.webp",             flavor: "Beere · Sahne · Süße" },
  { key: "nl",  number: "02", line1: "NORTHERN",    line2: "LIGHTS",   img: "/pouches/northern-lights.webp",    flavor: "Kiefer · Erde · Süße" },
  { key: "icc", number: "03", line1: "ICE CREAM",   line2: "COOKIES",  img: "/pouches/ice-cream-cookies.webp",  flavor: "Vanille · Cookie · Crème" },
  { key: "ph",  number: "04", line1: "PURPLE",      line2: "HAZE",     img: "/pouches/purple-haze.webp",        flavor: "Beere · Blüte · Süße" },
  { key: "ah",  number: "05", line1: "AMNESIA",     line2: "HAZE",     img: "/pouches/amnesia-haze.webp",       flavor: "Zitrus · Erde · Würze" },
  { key: "gsc", number: "06", line1: "GIRL SCOUT",  line2: "COOKIES",  img: "/pouches/girl-scout-cookies.webp", flavor: "Minze · Erde · Süße" },
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
          display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
          paddingLeft: i > 0 ? "clamp(10px,1.6vw,22px)" : 0,
          marginLeft:  i > 0 ? "clamp(10px,1.6vw,22px)" : 0,
          borderLeft:  i > 0 ? "1px solid rgba(53,56,63,0.22)" : "none",
        }}>
          <span className="font-druk" style={{ fontSize: "clamp(16px,2.2vw,38px)", color: TEXT, lineHeight: 1, letterSpacing: "-0.03em" }}>
            {value}
          </span>
          <span className="font-ekstra" style={{ fontSize: "clamp(7px,0.52vw,8px)", color: MUTED, letterSpacing: "0.18em", textTransform: "uppercase" }}>
            {label}
          </span>
        </div>
      ))}
    </div>
  )
}

// ── LEFT PANEL ────────────────────────────────────────────────────────────────
function LeftPanel({
  strain, index, scrollY,
}: { strain: (typeof STRAINS)[0]; index: number; scrollY: MotionValue<number> }) {
  const chW  = 1 / N
  const fade = chW * 0.12
  const s    = index * chW
  const e    = s + chW

  const opacity = useTransform(scrollY,
    [Math.max(0, s - fade), s + fade, e - fade, Math.min(1, e)],
    [index === 0 ? 1 : 0, 1, 1, index === N - 1 ? 1 : 0],
  )
  const y = useTransform(scrollY,
    [Math.max(0, s - fade), s + fade, e - fade, Math.min(1, e)],
    [index === 0 ? 0 : 28, 0, 0, -28],
  )

  return (
    <motion.div
      style={{
        opacity, y,
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "0 clamp(24px,3.5vw,64px)",
        pointerEvents: "none",
      }}
    >
      {/* Collection number */}
      <div style={{ marginBottom: "clamp(18px,2.8vh,36px)" }}>
        <span className="font-ekstra" style={{
          fontSize: "clamp(8px,0.55vw,10px)", color: MUTED,
          letterSpacing: "0.24em", textTransform: "uppercase",
          display: "block", marginBottom: 8,
        }}>
          Collection
        </span>
        <span className="font-druk" style={{
          fontSize: "clamp(40px,5vw,84px)", color: TEXT,
          lineHeight: 0.92, letterSpacing: "-0.04em", display: "block",
        }}>
          #{strain.number}
        </span>
        <span className="font-ekstra" style={{
          fontSize: "clamp(8px,0.52vw,9px)", color: MUTED,
          letterSpacing: "0.2em", textTransform: "uppercase",
          display: "block", marginTop: 6,
        }}>
          of 06
        </span>
      </div>

      {/* Divider */}
      <div style={{ width: 32, height: 1, background: "rgba(53,56,63,0.18)", marginBottom: "clamp(16px,2.4vh,30px)" }} />

      {/* Stats */}
      <StatStrip />

      {/* Label */}
      <div style={{ marginTop: "clamp(14px,2vh,24px)" }}>
        <span className="font-ekstra" style={{
          fontSize: "clamp(8px,0.52vw,9px)", color: MUTED,
          letterSpacing: "0.22em", textTransform: "uppercase",
        }}>
          Superior Blend
        </span>
      </div>
    </motion.div>
  )
}

// ── RIGHT PANEL ───────────────────────────────────────────────────────────────
function RightPanel({
  strain, index, scrollY,
}: { strain: (typeof STRAINS)[0]; index: number; scrollY: MotionValue<number> }) {
  const chW  = 1 / N
  const fade = chW * 0.12
  const s    = index * chW
  const e    = s + chW

  const opacity = useTransform(scrollY,
    [Math.max(0, s - fade), s + fade, e - fade, Math.min(1, e)],
    [index === 0 ? 1 : 0, 1, 1, index === N - 1 ? 1 : 0],
  )
  const y = useTransform(scrollY,
    [Math.max(0, s - fade), s + fade, e - fade, Math.min(1, e)],
    [index === 0 ? 0 : 28, 0, 0, -28],
  )

  return (
    <motion.div
      style={{
        opacity, y,
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "0 clamp(24px,3.5vw,64px)",
        pointerEvents: "none",
      }}
    >
      {/* Strain name */}
      <h1
        className="font-druk-wide uppercase"
        style={{ lineHeight: 0.88, letterSpacing: "-0.02em", marginBottom: "clamp(14px,2vh,22px)" }}
      >
        <span style={{
          display: "block",
          fontSize: "clamp(22px,3.6vw,58px)",
          color: "transparent",
          WebkitTextStroke: `clamp(1.5px,0.12vw,2px) ${TEXT}`,
        }}>
          {strain.line1}
        </span>
        <span style={{
          display: "block",
          fontSize: "clamp(22px,3.6vw,58px)",
          color: TEXT,
        }}>
          {strain.line2}
        </span>
      </h1>

      {/* Flavor */}
      <p className="font-ekstra" style={{
        fontSize: "clamp(10px,0.72vw,12px)", color: MUTED, lineHeight: 1.8,
      }}>
        600 Puffs · Superior Blend · EU-zertifiziert
        <br />
        <span style={{ color: TEXT, opacity: 0.72 }}>{strain.flavor}</span>
      </p>
    </motion.div>
  )
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export function Section01_Hero() {
  const outerRef  = useRef<HTMLDivElement>(null)
  const videoRef  = useRef<HTMLVideoElement>(null)
  const activeRef = useRef(0)
  const swipeX    = useRef<number | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const { scrollYProgress } = useScroll({ target: outerRef, offset: ["start start", "end start"] })

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    // Update active dot / text panels via scroll
    const idx = Math.min(Math.floor(v * N), N - 1)
    if (idx !== activeRef.current) {
      activeRef.current = idx
      setActiveIndex(idx)
    }
  })

  // ── Mobile navigation ────────────────────────────────────────────────────
  const goTo = (idx: number) => {
    const i = Math.max(0, Math.min(idx, N - 1))
    if (i === activeRef.current) return
    activeRef.current = i
    setActiveIndex(i)
  }

  const dotClick = (idx: number) => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      goTo(idx)
    } else {
      const el = outerRef.current
      if (!el) return
      window.scrollTo({ top: el.offsetTop + (idx / N) * el.offsetHeight, behavior: "smooth" })
    }
  }

  const onTouchStart = (e: React.TouchEvent) => { swipeX.current = e.touches[0].clientX }
  const onTouchEnd   = (e: React.TouchEvent) => {
    if (swipeX.current === null) return
    const dx = swipeX.current - e.changedTouches[0].clientX
    if (Math.abs(dx) > 44) goTo(activeRef.current + (dx > 0 ? 1 : -1))
    swipeX.current = null
  }

  const strain = STRAINS[activeIndex]

  return (
    // Mobile: 100svh (no extra scroll) | Desktop: 600vh scroll container
    <div ref={outerRef} className="h-[100svh] md:h-[600vh] relative">
      <section
        id="hero"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{
          position: "sticky", top: 0, height: "100svh",
          background: BG, overflow: "hidden",
          touchAction: "pan-y",
        }}
      >
        {/* Radial glow */}
        <div aria-hidden style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
          background: "radial-gradient(ellipse 60% 55% at 50% 52%, rgba(122,107,145,0.26) 0%, transparent 68%)",
        }} />

        {/* Navbar spacer — mobile only (desktop uses absolute positioning below) */}
        <div className="block md:hidden" style={{ height: "clamp(72px,10vh,112px)", flexShrink: 0 }} />

        {/* ── DESKTOP: CENTER VIDEO + SIDE OVERLAYS ─────────────────────────── */}

        {/* Video — 16:9 container centred between the two text panels.
            Aspect-ratio container = no letterbox = no black bars. */}
        <div
          className="hidden md:block"
          style={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            left: "22vw", right: "22vw",
            aspectRatio: "16 / 9",
            maxHeight: "calc(100svh - clamp(72px,10vh,112px) - clamp(40px,6vh,72px))",
            zIndex: 1, pointerEvents: "none",
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            style={{
              width: "100%", height: "100%",
              objectFit: "fill",
              display: "block",
            }}
          >
            <source src="/video/section1-hero.webm" type="video/webm" />
            <source src="/video/section1-hero.mp4" type="video/mp4" />
          </video>
        </div>

        {/* LEFT overlay */}
        <div
          className="hidden md:block"
          style={{
            position: "absolute",
            top: "clamp(72px,10vh,112px)",
            bottom: "clamp(40px,6vh,72px)",
            left: 0, width: "22vw",
            zIndex: 5,
          }}
        >
          {STRAINS.map((s, i) => (
            <LeftPanel key={s.key} strain={s} index={i} scrollY={scrollYProgress} />
          ))}
        </div>

        {/* RIGHT overlay */}
        <div
          className="hidden md:block"
          style={{
            position: "absolute",
            top: "clamp(72px,10vh,112px)",
            bottom: "clamp(40px,6vh,72px)",
            right: 0, width: "22vw",
            zIndex: 5,
          }}
        >
          {STRAINS.map((s, i) => (
            <RightPanel key={s.key} strain={s} index={i} scrollY={scrollYProgress} />
          ))}
        </div>

        {/* ── MOBILE: STACKED ───────────────────────────────────────────────── */}
        <div
          className="flex md:hidden flex-col items-center"
          style={{
            flex: 1, height: "calc(100svh - clamp(72px,10vh,112px))",
            padding: "0 clamp(16px,4vw,32px) clamp(10px,2vh,24px)",
            gap: "clamp(6px,1.4vh,18px)",
            position: "relative", zIndex: 5,
          }}
        >
          {/* Pouch image carousel */}
          <div style={{ position: "relative", flex: 1, width: "100%", minHeight: 0 }}>
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
                  style={{ height: "100%", maxHeight: "42vh", width: "auto", objectFit: "contain",
                    userSelect: "none", pointerEvents: "none", display: "block" }}
                  draggable={false}
                />
              </motion.div>
            ))}

            {/* Prev / Next buttons */}
            <div style={{
              position: "absolute", inset: 0, zIndex: 10,
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "0 6px", pointerEvents: "none",
            }}>
              <button onClick={() => goTo(activeIndex - 1)} disabled={activeIndex === 0}
                style={{ pointerEvents: "all", width: 30, height: 30, borderRadius: "50%",
                  background: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.75)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  opacity: activeIndex === 0 ? 0 : 1, transition: "opacity 0.25s ease",
                  cursor: activeIndex === 0 ? "default" : "pointer" }}
                aria-label="Vorheriger Strain">
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke={TEXT} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 1.5L3 4.5L6 7.5"/>
                </svg>
              </button>
              <button onClick={() => goTo(activeIndex + 1)} disabled={activeIndex === N - 1}
                style={{ pointerEvents: "all", width: 30, height: 30, borderRadius: "50%",
                  background: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.75)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  opacity: activeIndex === N - 1 ? 0 : 1, transition: "opacity 0.25s ease",
                  cursor: activeIndex === N - 1 ? "default" : "pointer" }}
                aria-label="Nächster Strain">
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke={TEXT} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 1.5L6 4.5L3 7.5"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile strain info */}
          <div style={{ position: "relative", width: "100%", minHeight: "clamp(80px,14vh,120px)" }}>
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
                  textAlign: "center",
                }}
              >
                <h1 className="font-druk-wide uppercase" style={{ lineHeight: 0.88, letterSpacing: "-0.02em", marginBottom: "clamp(6px,1vh,12px)" }}>
                  <span className="block text-[9.5vw]"
                    style={{ color: "transparent", WebkitTextStroke: `clamp(1.5px,0.14vw,2px) ${TEXT}` }}>
                    {s.line1}
                  </span>
                  <span className="block text-[9.5vw]" style={{ color: TEXT }}>
                    {s.line2}
                  </span>
                </h1>
                <p className="font-ekstra" style={{ fontSize: "clamp(11px,1vw,14px)", color: MUTED, lineHeight: 1.7 }}>
                  600 Puffs · Superior Blend · EU-zertifiziert
                  <br />
                  <span style={{ color: TEXT, opacity: 0.72 }}>{s.flavor}</span>
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── NAVIGATION DOTS ───────────────────────────────────────────────── */}
        <div style={{
          position: "absolute",
          bottom: "clamp(16px,2.8vh,36px)",
          left: 0, right: 0,
          display: "flex", justifyContent: "center",
          gap: 8, alignItems: "center", zIndex: 20,
        }}>
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

        {/* ── DESKTOP SCRIBBLE ──────────────────────────────────────────────── */}
        <motion.div
          className="hidden md:block"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.6 }} aria-hidden
          style={{
            position: "absolute",
            top: "clamp(72px,13vh,210px)",
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

        {/* ── MOBILE SCRIBBLE ───────────────────────────────────────────────── */}
        <motion.div
          className="block md:hidden"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.5 }} aria-hidden
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

      </section>
    </div>
  )
}
