"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { motion, useScroll, useTransform, MotionValue } from "framer-motion"
import { smoothScrollTarget } from "@/components/SmoothScroll"

const BG    = "#bcc0ca"
const TEXT  = "#35383f"
const LIGHT = "#e8e4dc"
const MUTED = "rgba(53,56,63,0.52)"

const FRAME_COUNT = 100

const FEATURES = [
  {
    side: "left"  as const,
    num:  "01",
    big:  "600",
    tag:  "PUFFS",
    desc: "Smooth bis zum letzten Zug.\nKein Absatz. Kein Nachlassen.",
  },
  {
    side: "right" as const,
    num:  "02",
    big:  "0%",
    tag:  "NIKOTIN",
    desc: "100% tabakfrei · nikotinfrei.\nEU-zertifiziert und laborgeprüft.",
  },
  {
    side: "left"  as const,
    num:  "03",
    big:  "ECHT",
    tag:  "TERPENE",
    desc: "Echter Geschmack. Echte Aromen.\nSmooth und aromatisch, Zug für Zug.",
  },
  {
    side: "right" as const,
    num:  "04",
    big:  "LAB",
    tag:  "TESTED",
    desc: "Apothekenqualität.\nStrenge EU-Standards. Kein Kompromiss.",
  },
  {
    side: "left"  as const,
    num:  "05",
    big:  "6",
    tag:  "FLAVOURS",
    desc: "Northern Lights · Purple Haze · Ice Cream Cookies\nAmnesia Haze · Gelato · Girl Scout Cookies",
  },
  {
    side: "right" as const,
    num:  "06",
    big:  "EU",
    tag:  "ZERTIFIZIERT",
    desc: "Hergestellt in der EU.\nKontrollierte Qualität. Kein Kompromiss.",
  },
] as const

// scroll layout: intro 0–0.10, 6×features each 13%, outro 0.88–1.00
const fStart = (i: number) => 0.10 + i * 0.13
const fEnd   = (i: number) => fStart(i) + 0.13
const RAMP   = 0.025

function FeatureBlock({
  feature, index, isMobile, scrollYProgress,
}: {
  feature: typeof FEATURES[number]
  index: number
  isMobile: boolean
  scrollYProgress: MotionValue<number>
}) {
  const s      = fStart(index)
  const e      = fEnd(index)
  const isLeft = feature.side === "left"

  const opacity = useTransform(
    scrollYProgress,
    [s, s + RAMP, e - RAMP, e],
    [0, 1, 1, 0],
  )
  const x = useTransform(
    scrollYProgress,
    [s, s + RAMP, e - RAMP, e],
    isMobile ? [0, 0, 0, 0] : [isLeft ? -120 : 120, 0, 0, isLeft ? -70 : 70],
  )
  const y = useTransform(
    scrollYProgress,
    [s, s + RAMP, e - RAMP, e],
    isMobile ? [48, 0, 0, 48] : [0, 0, 0, 0],
  )

  if (isMobile) {
    return (
      <motion.div
        style={{
          position: "absolute",
          bottom: "clamp(36px,7vh,80px)",
          left: 0, right: 0,
          textAlign: "center",
          opacity, y,
          zIndex: 5,
          pointerEvents: "none",
          padding: "0 28px",
        }}
      >
        <p className="font-ekstra uppercase" style={{
          color: MUTED, fontSize: "clamp(9px,2.4vw,11px)",
          letterSpacing: "0.22em", margin: "0 0 6px",
        }}>
          {feature.num} / 06
        </p>
        <p className="font-druk" style={{
          fontSize: "clamp(64px,18vw,110px)", color: TEXT,
          lineHeight: 0.85, letterSpacing: "-0.04em", margin: "0 0 2px",
        }}>
          {feature.big}
        </p>
        <p className="font-druk-wide uppercase" style={{
          fontSize: "clamp(16px,4.8vw,26px)", lineHeight: 1,
          color: "transparent", WebkitTextStroke: `clamp(1.2px,0.1vw,1.6px) ${TEXT}`,
          letterSpacing: "0.06em", margin: "0 0 10px",
        }}>
          {feature.tag}
        </p>
        <p style={{
          color: MUTED, fontSize: "clamp(11px,2.8vw,14px)",
          lineHeight: 1.65, margin: 0, whiteSpace: "pre-line",
        }}>
          {feature.desc}
        </p>
      </motion.div>
    )
  }

  const edge = "clamp(36px,4vw,72px)"

  return (
    <motion.div
      style={{
        position: "absolute",
        top: "50%",
        translateY: "-50%",
        [isLeft ? "left" : "right"]: edge,
        opacity, x,
        zIndex: 5,
        pointerEvents: "none",
        maxWidth: "clamp(200px,24vw,360px)",
        display: "flex",
        flexDirection: "column",
        alignItems: isLeft ? "flex-start" : "flex-end",
        gap: "clamp(10px,1.2vh,16px)",
      }}
    >
      {/* Counter badge */}
      <div style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 10px 4px 8px",
        border: `1px solid rgba(53,56,63,0.22)`,
        borderRadius: 999,
        background: "rgba(53,56,63,0.06)",
      }}>
        <span style={{
          width: 6, height: 6, borderRadius: "50%",
          background: TEXT, opacity: 0.5, flexShrink: 0,
        }} />
        <span className="font-ekstra uppercase" style={{
          color: MUTED, fontSize: "clamp(8px,0.55vw,10px)",
          letterSpacing: "0.22em",
        }}>
          {feature.num} / 06
        </span>
      </div>

      {/* Big number + outline tag stacked */}
      <div style={{ lineHeight: 1, textAlign: isLeft ? "left" : "right" }}>
        <p className="font-druk" style={{
          fontSize: "clamp(76px,10vw,160px)",
          color: TEXT,
          lineHeight: 0.84,
          letterSpacing: "-0.04em",
          margin: "0 0 2px",
        }}>
          {feature.big}
        </p>
        <p className="font-druk-wide uppercase" style={{
          fontSize: "clamp(16px,2vw,34px)",
          color: "transparent",
          WebkitTextStroke: `clamp(1.2px,0.09vw,1.6px) ${TEXT}`,
          letterSpacing: "0.08em",
          lineHeight: 1,
          margin: 0,
        }}>
          {feature.tag}
        </p>
      </div>

      {/* Accent line + description */}
      <div style={{
        display: "flex",
        flexDirection: isLeft ? "row" : "row-reverse",
        alignItems: "flex-start",
        gap: 12,
      }}>
        <div style={{
          width: 2,
          alignSelf: "stretch",
          minHeight: 32,
          background: `rgba(53,56,63,0.18)`,
          borderRadius: 1,
          flexShrink: 0,
          marginTop: 3,
        }} />
        <p style={{
          color: MUTED,
          fontSize: "clamp(11px,0.82vw,13px)",
          lineHeight: 1.85,
          margin: 0,
          whiteSpace: "pre-line",
          textAlign: isLeft ? "left" : "right",
        }}>
          {feature.desc}
        </p>
      </div>
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
    <div style={{
      position: "absolute",
      bottom: "clamp(28px,4vh,48px)",
      right: "clamp(28px,4vw,56px)",
      zIndex: 20,
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      gap: 8,
    }}>
      {FEATURES.map((_, i) => (
        <motion.div
          key={i}
          animate={{
            width:   i === active ? 26 : 8,
            opacity: i === active ? 1 : 0.22,
          }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          style={{ height: 5, borderRadius: 99, background: TEXT }}
        />
      ))}
    </div>
  )
}

function FrameScrubber({
  sectionRef,
  isMobile,
}: {
  sectionRef: React.RefObject<HTMLElement | null>
  isMobile: boolean
}) {
  const wrapRef    = useRef<HTMLDivElement>(null)
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const imgsRef    = useRef<HTMLImageElement[]>([])
  const loadedRef  = useRef(new Set<number>())
  const currentRef = useRef(0)

  const draw = useCallback((idx: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    let img: HTMLImageElement | null = null
    for (let d = 0; d < FRAME_COUNT; d++) {
      const a = idx - d
      const b = idx + d
      if (a >= 0 && loadedRef.current.has(a)) { img = imgsRef.current[a]; break }
      if (b !== a && b < FRAME_COUNT && loadedRef.current.has(b)) { img = imgsRef.current[b]; break }
    }
    if (!img) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const sc = Math.min(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight)
    const w = img.naturalWidth * sc
    const h = img.naturalHeight * sc
    ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h)
  }, [])

  const getIdx = useCallback((scrollY: number) => {
    const section = sectionRef.current
    if (!section) return 0
    const top = section.offsetTop
    const scrollable = section.offsetHeight - window.innerHeight
    if (scrollable <= 0) return 0
    const v = Math.max(0, Math.min(1, (scrollY - top) / scrollable))
    return Math.max(0, Math.min(FRAME_COUNT - 1, Math.floor(v * FRAME_COUNT)))
  }, [sectionRef])

  useEffect(() => {
    imgsRef.current = Array.from({ length: FRAME_COUNT }, (_, i) => {
      const img = new Image()
      img.onload = () => {
        loadedRef.current.add(i)
        if (i === 0 || i === currentRef.current) draw(currentRef.current)
      }
      img.src = `/frames/frame_${String(i).padStart(3, "0")}.webp`
      return img
    })
  }, [draw])

  useEffect(() => {
    const wrap   = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const sync = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width  = wrap.offsetWidth  * dpr
      canvas.height = wrap.offsetHeight * dpr
      draw(currentRef.current)
    }
    sync()
    const ro = new ResizeObserver(sync)
    ro.observe(wrap)
    return () => ro.disconnect()
  }, [draw])

  useEffect(() => {
    // wheel → use pre-spring target for zero-lag response
    const onWheel = () => {
      const idx = getIdx(smoothScrollTarget.current)
      currentRef.current = idx
      draw(idx)
    }
    // scroll → fallback for touch / keyboard / programmatic
    const onScroll = () => {
      const idx = getIdx(window.scrollY)
      currentRef.current = idx
      draw(idx)
    }
    window.addEventListener("wheel",  onWheel,  { passive: true })
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("wheel",  onWheel)
      window.removeEventListener("scroll", onScroll)
    }
  }, [draw, getIdx])

  return (
    <div
      ref={wrapRef}
      style={{
        position: "absolute",
        left: "50%", top: "50%",
        transform: "translate(-50%, -50%)",
        width:  isMobile ? "42vh" : "68vh",
        height: isMobile ? "42vh" : "68vh",
        maxWidth:  isMobile ? 380 : 820,
        maxHeight: isMobile ? 380 : 820,
        zIndex: 10,
        pointerEvents: "none",
      }}
    >
      {/* Ambient glow behind product */}
      <div aria-hidden style={{
        position: "absolute",
        bottom: "-8%", left: "50%",
        transform: "translateX(-50%)",
        width: "120%", height: "35%",
        background: "radial-gradient(ellipse 100% 100% at 50% 50%, rgba(68,52,115,0.28) 0%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 0,
        filter: "blur(20px)",
      }} />
      <canvas
        ref={canvasRef}
        style={{
          width: "100%", height: "100%",
          display: "block",
          position: "relative",
          zIndex: 1,
          filter: "drop-shadow(0 50px 70px rgba(30,20,55,0.50)) drop-shadow(0 16px 28px rgba(30,20,55,0.25))",
        }}
      />
    </div>
  )
}

export function Section04_Features() {
  const sectionRef  = useRef<HTMLElement>(null)
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

  // Intro
  const introOpacity = useTransform(scrollYProgress, [0, 0.06, 0.11], [1, 1, 0])
  const introY       = useTransform(scrollYProgress, [0, 0.11], [0, -44])

  // Outro CTA
  const outroOpacity = useTransform(scrollYProgress, [0.88, 0.94], [0, 1])
  const outroY       = useTransform(scrollYProgress, [0.88, 0.96], [60, 0])

  return (
    <section
      ref={sectionRef}
      style={{ background: BG, minHeight: "700vh", position: "relative" }}
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
        </motion.div>

        {/* ── CENTER frame scrubber ── */}
        <FrameScrubber sectionRef={sectionRef} isMobile={isMobile} />

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

        {/* ── DOTS ── */}
        {!isMobile && <FeatureCounter scrollYProgress={scrollYProgress} />}

      </div>
    </section>
  )
}
