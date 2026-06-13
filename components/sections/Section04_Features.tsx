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
    big:  "600",
    tag:  "PUFFS",
    desc: "Smooth bis zum letzten Zug.\nKein Absatz. Kein Nachlassen.",
  },
  {
    side: "right" as const,
    big:  "0%",
    tag:  "NIKOTIN",
    desc: "100% tabakfrei · nikotinfrei.\nEU-zertifiziert und laborgeprüft.",
  },
  {
    side: "left"  as const,
    big:  "ECHT",
    tag:  "TERPENE",
    desc: "Echter Geschmack. Echte Aromen.\nSmooth und aromatisch, Zug für Zug.",
  },
  {
    side: "right" as const,
    big:  "LAB",
    tag:  "TESTED",
    desc: "Apothekenqualität.\nStrenge EU-Standards. Kein Kompromiss.",
  },
  {
    side: "left"  as const,
    big:  "6",
    tag:  "FLAVOURS",
    desc: "Northern Lights · Purple Haze · Ice Cream Cookies\nAmnesia Haze · Gelato · Girl Scout Cookies",
  },
  {
    side: "right" as const,
    big:  "EU",
    tag:  "ZERTIFIZIERT",
    desc: "Hergestellt in der EU.\nKontrollierte Qualität. Kein Kompromiss.",
  },
] as const

// scroll layout: intro 0–0.10, 6×features each 13%, outro 0.88–1.00
const fStart = (i: number) => 0.10 + i * 0.13
const fEnd   = (i: number) => fStart(i) + 0.13
const RAMP   = 0.025

// ── FeatureBlock ─────────────────────────────────────────────────────────────

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

  const opacity = useTransform(scrollYProgress, [s, s + RAMP, e - RAMP, e], [0, 1, 1, 0])
  const x       = useTransform(
    scrollYProgress, [s, s + RAMP, e - RAMP, e],
    isMobile ? [0, 0, 0, 0] : [isLeft ? -100 : 100, 0, 0, isLeft ? -60 : 60],
  )
  const y = useTransform(
    scrollYProgress, [s, s + RAMP, e - RAMP, e],
    isMobile ? [40, 0, 0, 40] : [0, 0, 0, 0],
  )

  // ── Mobile ──
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
          padding: "0 28px",
        }}
      >
        <p className="font-druk" style={{
          fontSize: "clamp(60px,17vw,100px)", color: TEXT,
          lineHeight: 0.85, letterSpacing: "-0.04em", margin: "0 0 2px",
        }}>
          {feature.big}
        </p>
        <p className="font-druk-wide uppercase" style={{
          fontSize: "clamp(15px,4.4vw,24px)", lineHeight: 1,
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

  // ── Desktop ──
  const edge = "clamp(32px,3.5vw,64px)"

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
        maxWidth: "clamp(190px,22vw,340px)",
        display: "flex",
        flexDirection: "column",
        alignItems: isLeft ? "flex-start" : "flex-end",
        gap: "clamp(8px,1vh,14px)",
      }}
    >
      {/* Big number + outline tag */}
      <div style={{ textAlign: isLeft ? "left" : "right" }}>
        <p className="font-druk" style={{
          fontSize: "clamp(72px,9.5vw,152px)",
          color: TEXT,
          lineHeight: 0.84,
          letterSpacing: "-0.04em",
          margin: "0 0 2px",
        }}>
          {feature.big}
        </p>
        <p className="font-druk-wide uppercase" style={{
          fontSize: "clamp(15px,1.9vw,32px)",
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
        gap: 10,
      }}>
        <div style={{
          width: 2, alignSelf: "stretch", minHeight: 28,
          background: "rgba(53,56,63,0.16)", borderRadius: 1,
          flexShrink: 0, marginTop: 3,
        }} />
        <p style={{
          color: MUTED,
          fontSize: "clamp(11px,0.8vw,13px)",
          lineHeight: 1.85, margin: 0,
          whiteSpace: "pre-line",
          textAlign: isLeft ? "left" : "right",
        }}>
          {feature.desc}
        </p>
      </div>
    </motion.div>
  )
}

// ── FeatureCounter (dot row — pure DOM, zero React re-renders) ────────────────

function FeatureCounter({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dots = containerRef.current?.children
    if (!dots) return

    const unsub = scrollYProgress.on("change", (v) => {
      let found = -1
      for (let i = 0; i < FEATURES.length; i++) {
        if (v >= fStart(i) && v < fEnd(i)) { found = i; break }
      }
      Array.from(dots).forEach((dot, i) => {
        const el = dot as HTMLElement
        el.style.width   = i === found ? "26px" : "8px"
        el.style.opacity = i === found ? "1" : "0.22"
      })
    })
    return unsub
  }, [scrollYProgress])

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        bottom: "clamp(24px,3.5vh,44px)",
        right: "clamp(24px,3.5vw,52px)",
        zIndex: 20,
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      {FEATURES.map((_, i) => (
        <div
          key={i}
          style={{
            height: 5, borderRadius: 99, background: TEXT,
            width: 8, opacity: 0.22,
            transition: "width 0.28s cubic-bezier(0.16,1,0.3,1), opacity 0.28s",
          }}
        />
      ))}
    </div>
  )
}

// ── FrameScrubber ─────────────────────────────────────────────────────────────

function FrameScrubber({
  sectionRef,
  isMobile,
  floatY,
}: {
  sectionRef: React.RefObject<HTMLElement | null>
  isMobile: boolean
  floatY: MotionValue<number>
}) {
  const wrapRef    = useRef<HTMLDivElement>(null)
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const imgsRef    = useRef<HTMLImageElement[]>([])
  const loadedRef  = useRef(new Set<number>())
  const currentRef = useRef(0)
  const rafRef     = useRef(0)

  const draw = useCallback((idx: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    let img: HTMLImageElement | null = null
    for (let d = 0; d < FRAME_COUNT; d++) {
      const a = idx - d
      const b = idx + d
      if (a >= 0 && loadedRef.current.has(a))             { img = imgsRef.current[a]; break }
      if (b !== a && b < FRAME_COUNT && loadedRef.current.has(b)) { img = imgsRef.current[b]; break }
    }
    if (!img) return
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = "high"
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const sc = Math.min(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight)
    const w  = img.naturalWidth  * sc
    const h  = img.naturalHeight * sc
    ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h)
  }, [])

  // Batched draw — only one canvas update per animation frame
  const scheduleDraw = useCallback((idx: number) => {
    currentRef.current = idx
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => draw(idx))
  }, [draw])

  const getIdx = useCallback((scrollY: number) => {
    const section = sectionRef.current
    if (!section) return 0
    const top       = section.offsetTop
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
        if (i === 0 || i === currentRef.current) scheduleDraw(currentRef.current)
      }
      img.src = `/frames/frame_${String(i).padStart(3, "0")}.webp`
      return img
    })
  }, [scheduleDraw])

  useEffect(() => {
    const wrap   = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const sync = () => {
      const dpr    = window.devicePixelRatio || 1
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
    const onWheel = () => {
      scheduleDraw(getIdx(smoothScrollTarget.current))
    }
    const onScroll = () => {
      // only fires for touch / keyboard — wheel already handled above
      scheduleDraw(getIdx(window.scrollY))
    }
    window.addEventListener("wheel",  onWheel,  { passive: true })
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("wheel",  onWheel)
      window.removeEventListener("scroll", onScroll)
    }
  }, [scheduleDraw, getIdx])

  return (
    <motion.div
      ref={wrapRef}
      style={{
        position: "absolute",
        left: "50%", top: "44%",
        translateX: "-50%", translateY: "-50%",
        y: floatY,
        width:     isMobile ? "52vh" : "80vh",
        height:    isMobile ? "52vh" : "80vh",
        maxWidth:  isMobile ? 420 : 920,
        maxHeight: isMobile ? 420 : 920,
        zIndex: 10,
        pointerEvents: "none",
      }}
    >
      {/* Ambient glow */}
      <div aria-hidden style={{
        position: "absolute",
        bottom: "-6%", left: "50%",
        transform: "translateX(-50%)",
        width: "110%", height: "32%",
        background: "radial-gradient(ellipse 100% 100% at 50% 50%, rgba(68,52,115,0.26) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0, filter: "blur(18px)",
      }} />
      <canvas
        ref={canvasRef}
        style={{
          width: "100%", height: "100%", display: "block",
          position: "relative", zIndex: 1,
          filter: "drop-shadow(0 48px 68px rgba(30,20,55,0.48)) drop-shadow(0 14px 26px rgba(30,20,55,0.22))",
        }}
      />
    </motion.div>
  )
}

// ── Section04_Features ────────────────────────────────────────────────────────

export function Section04_Features() {
  const sectionRef  = useRef<HTMLElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  })

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  // Intro
  const introOpacity = useTransform(scrollYProgress, [0, 0.06, 0.10], [1, 1, 0])
  const introY       = useTransform(scrollYProgress, [0, 0.10], [0, -40])

  // Canvas floats up as outro approaches
  const canvasFloat  = useTransform(scrollYProgress, [0.76, 1.0], [0, -110])

  // Outro CTA
  const outroOpacity = useTransform(scrollYProgress, [0.88, 0.95], [0, 1])
  const outroY       = useTransform(scrollYProgress, [0.88, 0.96], [50, 0])

  return (
    <section
      ref={sectionRef}
      style={{ background: BG, minHeight: "700vh", position: "relative" }}
    >
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>

        {/* Radial glow */}
        <div aria-hidden style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
          background: "radial-gradient(ellipse 70% 60% at 60% 52%, rgba(122,107,145,0.26) 0%, transparent 65%)",
        }} />

        {/* ── INTRO ── */}
        <motion.div style={{
          position: "absolute",
          top: "50%", left: "50%",
          translateX: "-50%", translateY: "-50%",
          textAlign: "center",
          opacity: introOpacity, y: introY,
          zIndex: 15,
          pointerEvents: "none",
        }}>
          <p className="font-ekstra uppercase" style={{
            color: MUTED, fontSize: "clamp(9px,0.65vw,11px)",
            letterSpacing: "0.26em", margin: "0 0 16px",
          }}>
            Warum WEED FOR FRIENDS
          </p>
          <h2 className="font-druk-wide uppercase" style={{
            fontSize: "clamp(34px,5.4vw,88px)",
            lineHeight: 0.88, letterSpacing: "-0.03em", margin: 0,
          }}>
            <span style={{ display: "block", color: "transparent", WebkitTextStroke: `clamp(1.5px,0.12vw,2px) ${TEXT}` }}>
              DAS BESTE
            </span>
            <span style={{ display: "block", color: TEXT }}>
              ERLEBNIS
            </span>
          </h2>
        </motion.div>

        {/* ── CENTER canvas — floats up toward outro ── */}
        <FrameScrubber sectionRef={sectionRef} isMobile={isMobile} floatY={canvasFloat} />

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

        {/* ── OUTRO / CTA — anchored below product ── */}
        <motion.div style={{
          position: "absolute",
          bottom: "clamp(52px,9vh,100px)",
          left: "50%",
          translateX: "-50%",
          textAlign: "center",
          opacity: outroOpacity, y: outroY,
          zIndex: 15,
          pointerEvents: "none",
          width: "clamp(260px,56vw,640px)",
        }}>
          <h2 className="font-druk-wide uppercase" style={{
            fontSize: "clamp(28px,4.4vw,72px)",
            lineHeight: 0.88, letterSpacing: "-0.03em",
            margin: "0 0 clamp(20px,3vh,38px)",
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
              textDecoration: "none", pointerEvents: "auto",
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
