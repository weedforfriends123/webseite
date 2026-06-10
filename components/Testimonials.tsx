"use client"

import { useRef, useState, useEffect } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"

const TESTIMONIALS = [
  {
    name:   "Lena K.",
    role:   "Stuttgart",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
    quote:  "hab ehrlich gesagt nicht viel erwartet aber wow. lieferung kam in 2 tagen, verpackung war richtig schick und der geschmack ist komplett anders als der billig kram den ich vorher hatte. bin gefixt",
    rating: 5,
    tag:    "Northern Lights",
  },
  {
    name:   "Tobias M.",
    role:   "Hamburg",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=face",
    quote:  "erstbestellung letzte woche. war skeptisch wegen dem preis aber man merkt sofort warum. kein plastik-nachgeschmack, zieht smooth. hab direkt nochmal bestellt lol",
    rating: 5,
    tag:    "Amnesia Haze",
  },
  {
    name:   "Sara J.",
    role:   "Berlin",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&crop=face",
    quote:  "endlich mal kein account anlegen müssen und trotzdem alles smooth gelaufen. kam schnell, war diskret verpackt. genau so wie mans sich wünscht",
    rating: 5,
    tag:    "Verified Buyer",
  },
  {
    name:   "Nico F.",
    role:   "Köln",
    avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=80&h=80&fit=crop&crop=face",
    quote:  "ich kauf hier jetzt seit 4 monaten. qualität ist jedes mal gleich, nie irgendwelche unangenehmen überraschungen. das schätze ich am meisten eigentlich",
    rating: 5,
    tag:    "Stammkunde",
  },
  {
    name:   "Maya R.",
    role:   "München",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
    quote:  "friends haben mich drauf gebracht und ich versteh jetzt warum die alle davon reden. der flavor ist einfach clean. hab noch nichts besseres gefunden bis jetzt",
    rating: 5,
    tag:    "Northern Lights",
  },
]

const DARK_BG = "#35383f"

export function Testimonials() {
  const [active,  setActive]  = useState(0)
  const [dir,     setDir]     = useState(1)
  const [paused,  setPaused]  = useState(false)
  const touchStartX = useRef(0)
  const reduced     = useReducedMotion()
  const n = TESTIMONIALS.length
  const t = TESTIMONIALS[active]

  function goPrev() { setDir(-1); setActive(i => (i - 1 + n) % n) }
  function goNext() { setDir(1);  setActive(i => (i + 1) % n) }

  useEffect(() => {
    if (paused || reduced) return
    const timer = setTimeout(() => { setDir(1); setActive(i => (i + 1) % n) }, 5500)
    return () => clearTimeout(timer)
  }, [active, paused, reduced])

  const quoteVariants = {
    enter:  (d: number) => ({ opacity: 0, x: d > 0 ? 60 : -60, filter: "blur(8px)"  }),
    center: {              opacity: 1, x: 0,                    filter: "blur(0px)"  },
    exit:   (d: number) => ({ opacity: 0, x: d > 0 ? -40 : 40, filter: "blur(5px)"  }),
  }

  return (
    <section
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={e => { touchStartX.current = e.touches[0].clientX; setPaused(true) }}
      onTouchEnd={e => {
        const dx = e.changedTouches[0].clientX - touchStartX.current
        if (dx < -40) goNext()
        else if (dx > 40) goPrev()
        setPaused(false)
      }}
      style={{
        background:     DARK_BG,
        position:       "relative",
        overflow:       "hidden",
        minHeight:      "70vh",
        display:        "flex",
        flexDirection:  "column",
        justifyContent: "center",
      }}
    >
      {/* Ghost text */}
      <div
        className="absolute inset-0 flex flex-col justify-center pointer-events-none select-none"
        style={{ paddingLeft: "clamp(6px, 1vw, 24px)", zIndex: 1 }}
        aria-hidden
      >
        {["ECHTE", "STIMMEN."].map(word => (
          <p
            key={word}
            className="font-adieu leading-none uppercase"
            style={{
              fontSize:      "clamp(5.5rem, 21vw, 28rem)",
              letterSpacing: "-0.01em",
              lineHeight:    0.86,
              color:         "rgba(53,56,63,0.04)",
            }}
          >
            {word}
          </p>
        ))}
      </div>

      {/* Main content */}
      <div
        style={{
          position: "relative",
          zIndex:   10,
          padding:  "clamp(60px, 10vh, 110px) clamp(20px, 5vw, 80px)",
        }}
      >
        {/* Eyebrow */}
        <p
          className="font-mono uppercase"
          style={{ fontSize: "9px", letterSpacing: "0.45em", color: "rgba(53,56,63,0.25)", marginBottom: "clamp(32px, 5vh, 52px)" }}
        >
          Was die Community sagt
        </p>

        {/* Quote + author */}
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={active}
            custom={dir}
            variants={quoteVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 200, damping: 24, mass: 0.85 }}
            className="flex flex-col md:flex-row md:items-end gap-8 md:gap-16"
          >
            {/* Quote block */}
            <div className="flex-1 min-w-0">
              <div className="flex gap-1 mb-5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0.3 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.06, type: "spring", stiffness: 360, damping: 14 }}
                    style={{ color: "#a0ba87", fontSize: "clamp(13px, 1.2vw, 17px)" }}
                  >
                    ★
                  </motion.span>
                ))}
              </div>

              <p
                className="font-adieu uppercase leading-none"
                style={{
                  fontSize:      "clamp(1.5rem, 3.6vw, 4.5rem)",
                  letterSpacing: "-0.02em",
                  lineHeight:    0.92,
                  color:         "#35383f",
                }}
              >
                {t.quote}
              </p>
            </div>

            {/* Author block */}
            <div className="flex flex-col gap-4 shrink-0" style={{ minWidth: "clamp(160px, 18vw, 220px)" }}>
              <div className="flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  width={40}
                  height={40}
                  style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", outline: "1.5px solid rgba(53,56,63,0.18)", flexShrink: 0 }}
                />
                <div>
                  <p className="font-mono uppercase" style={{ fontSize: "9px", letterSpacing: "0.35em", color: "rgba(53,56,63,0.55)" }}>
                    {t.name}
                  </p>
                  <p className="font-mono uppercase" style={{ fontSize: "8px", letterSpacing: "0.25em", color: "rgba(53,56,63,0.25)", marginTop: 2 }}>
                    {t.role}
                  </p>
                </div>
              </div>

              <span
                className="inline-block font-mono tracking-[0.25em] uppercase"
                style={{ fontSize: "clamp(8px, 0.8vw, 11px)", padding: "5px 14px", color: "#a0ba87", border: "1px solid rgba(160,186,135,0.30)", alignSelf: "flex-start" }}
              >
                {t.tag}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation bar */}
        <div
          className="flex items-center gap-4 md:gap-6 mt-10 md:mt-14"
          style={{ borderTop: "1px solid rgba(53,56,63,0.06)", paddingTop: "clamp(16px, 2.5vh, 28px)" }}
        >
          {/* Pill progress */}
          <div className="flex gap-2 flex-1">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => { setDir(i > active ? 1 : -1); setActive(i) }}
                aria-label={`Testimonial ${i + 1}`}
                style={{
                  width:      i === active ? 24 : 6,
                  height:     6,
                  borderRadius: 9999,
                  background: i === active ? "#a0ba87" : "rgba(53,56,63,0.18)",
                  flexShrink: 0,
                  cursor:     "pointer",
                  border:     "none",
                  padding:    0,
                  transition: "width 0.35s ease, background 0.25s ease",
                }}
              />
            ))}
          </div>

          <p className="font-mono" style={{ fontSize: "9px", letterSpacing: "0.22em", color: "rgba(53,56,63,0.20)" }}>
            {String(active + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
          </p>

          <div className="flex gap-2">
            {([["←", goPrev], ["→", goNext]] as [string, () => void][]).map(([label, fn]) => (
              <button
                key={label}
                onClick={fn}
                aria-label={label === "←" ? "Vorherige" : "Nächste"}
                className="transition-all duration-200 active:scale-95"
                style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: "none", border: "1px solid rgba(53,56,63,0.15)",
                  color: "rgba(53,56,63,0.55)", fontSize: 14, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <p className="md:hidden font-mono uppercase" style={{ fontSize: "7px", letterSpacing: "0.3em", color: "rgba(53,56,63,0.18)" }}>
            Wischen
          </p>
        </div>
      </div>
    </section>
  )
}
