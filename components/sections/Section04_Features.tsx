"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { motion, useScroll, useTransform, MotionValue } from "framer-motion"

const BG    = "#bcc0ca"
const TEXT  = "#35383f"
const LIGHT = "#e8e4dc"
const MUTED = "rgba(53,56,63,0.52)"

const FRAME_COUNT = 100

const FEATURES = [
  { side: "left"  as const, big: "600",  tag: "PUFFS",
    desc: "600 gleichmäßige Züge — kein Nachlassen, keine Überraschungen.\nVom ersten bis zum letzten Puff dieselbe Qualität.\nKompakt, diskret und für jeden Moment gemacht." },
  { side: "right" as const, big: "0%",   tag: "NIKOTIN",
    desc: "Kein Nikotin. Kein Tabak. Keine Sucht.\nWir glauben, dass echter Genuss frei sein sollte —\nvon Abhängigkeiten und Kompromissen." },
  { side: "left"  as const, big: "ECHT", tag: "TERPENE",
    desc: "Terpene geben jeder Sorte ihren einzigartigen Charakter —\nAroma, Tiefe und Wirkung in einem.\nNatürlich isoliert, authentisch zurückgeführt." },
  { side: "right" as const, big: "LAB",  tag: "TESTED",
    desc: "Jede Charge wird unabhängig getestet — auf Reinheit,\nWirkstoffgehalt und Konsistenz.\nDu weißt genau, was du in der Hand hältst." },
  { side: "left"  as const, big: "6",    tag: "FLAVOURS",
    desc: "Sechs Sorten mit eigenem Charakter.\nVon fruchtiger Frische bis zu erdiger Tiefe —\nNorthern Lights · Purple Haze · Ice Cream Cookies\nAmnesia Haze · Gelato · Girl Scout Cookies" },
  { side: "right" as const, big: "EU",   tag: "ZERTIFIZIERT",
    desc: "Entwickelt und produziert in der EU —\nnach den strengsten Qualitätsstandards Europas.\nKontrolliert, zertifiziert, transparent. Von hier, für euch." },
] as const

const fStart = (i: number) => 0.10 + i * 0.13
const fEnd   = (i: number) => fStart(i) + 0.13
const RAMP   = 0.04

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

  // Section05-style: enter from right with scale, simple fade out
  const opacity = useTransform(scrollYProgress, [s, s + RAMP, e - RAMP, e], [0, 1, 1, 0])
  const x       = useTransform(scrollYProgress, [s, s + RAMP], [isMobile ? 40 : 80, 0])
  const scale   = useTransform(scrollYProgress, [s, s + RAMP], [0.96, 1.0])

  if (isMobile) {
    return (
      <motion.div style={{
        position: "absolute", bottom: "clamp(44px,9dvh,110px)",
        left: 0, right: 0, textAlign: "center",
        opacity, x, scale,
        zIndex: 5, pointerEvents: "none", padding: "0 28px",
      }}>
        <p className="font-druk" style={{
          fontSize: "clamp(52px,15vw,88px)", color: TEXT,
          lineHeight: 0.85, letterSpacing: "-0.04em", margin: "0 0 2px",
        }}>{feature.big}</p>
        <p className="font-druk-wide uppercase" style={{
          fontSize: "clamp(14px,4.2vw,24px)", lineHeight: 1,
          color: "transparent", WebkitTextStroke: `1.2px ${TEXT}`,
          letterSpacing: "0.06em", margin: "0 0 10px",
        }}>{feature.tag}</p>
        <p style={{ color: MUTED, fontSize: "clamp(13px,3.6vw,16px)", lineHeight: 1.7, margin: 0, whiteSpace: "pre-line" }}>
          {feature.desc}
        </p>
      </motion.div>
    )
  }

  const edge = "clamp(24px,2.5vw,52px)"
  return (
    <motion.div style={{
      position: "absolute", top: "50%", translateY: "-50%",
      [isLeft ? "left" : "right"]: edge,
      opacity, x, scale,
      zIndex: 5, pointerEvents: "none",
      maxWidth: "clamp(180px,16vw,380px)",
      display: "flex", flexDirection: "column",
      alignItems: isLeft ? "flex-start" : "flex-end",
      gap: "clamp(6px,0.9vh,12px)",
    }}>
      <div style={{ textAlign: isLeft ? "left" : "right" }}>
        <p className="font-druk" style={{
          fontSize: "clamp(68px,9vw,148px)", color: TEXT,
          lineHeight: 0.84, letterSpacing: "-0.04em", margin: "0 0 2px",
        }}>{feature.big}</p>
        <p className="font-druk-wide uppercase" style={{
          fontSize: "clamp(14px,1.8vw,30px)", color: "transparent",
          WebkitTextStroke: `clamp(1.1px,0.08vw,1.5px) ${TEXT}`,
          letterSpacing: "0.08em", lineHeight: 1, margin: 0,
        }}>{feature.tag}</p>
      </div>
      <div style={{ display: "flex", flexDirection: isLeft ? "row" : "row-reverse", alignItems: "flex-start", gap: 10 }}>
        <div style={{ width: 2, alignSelf: "stretch", minHeight: 24, background: "rgba(53,56,63,0.16)", borderRadius: 1, flexShrink: 0, marginTop: 3 }} />
        <p style={{ color: MUTED, fontSize: "clamp(11px,0.88vw,13px)", lineHeight: 1.78, margin: 0, whiteSpace: "pre-line", textAlign: isLeft ? "left" : "right" }}>
          {feature.desc}
        </p>
      </div>
    </motion.div>
  )
}

// ── FeatureCounter — zero React re-renders ────────────────────────────────────

function FeatureCounter({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      let found = -1
      for (let i = 0; i < FEATURES.length; i++) {
        if (v >= fStart(i) && v < fEnd(i)) { found = i; break }
      }
      const dots = containerRef.current?.children
      if (!dots) return
      Array.from(dots).forEach((dot, i) => {
        const el = dot as HTMLElement
        el.style.width   = i === found ? "26px" : "8px"
        el.style.opacity = i === found ? "1"    : "0.22"
      })
    })
    return unsub
  }, [scrollYProgress])

  return (
    <div ref={containerRef} style={{
      position: "absolute", bottom: "clamp(20px,3vh,40px)", right: "clamp(20px,3vw,48px)",
      zIndex: 20, pointerEvents: "none", display: "flex", alignItems: "center", gap: 8,
    }}>
      {FEATURES.map((_, i) => (
        <div key={i} style={{
          height: 5, borderRadius: 99, background: TEXT,
          width: 8, opacity: 0.22,
          transition: "width 0.28s cubic-bezier(0.16,1,0.3,1), opacity 0.28s",
        }} />
      ))}
    </div>
  )
}

// ── FrameScrubber ─────────────────────────────────────────────────────────────

const SMOOTH = 0.18

function FrameScrubber({
  sectionRef,
  isMobile,
  floatY,
}: {
  sectionRef: React.RefObject<HTMLElement | null>
  isMobile: boolean
  floatY: MotionValue<number>
}) {
  const wrapRef   = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgsRef   = useRef<HTMLImageElement[]>([])
  const readyRef  = useRef(false)      // true once all frames are decoded
  const targetRef = useRef(0)          // raw target from scroll
  const currentRef = useRef(0)         // lerp-smoothed position
  const rafRef    = useRef(0)

  const isMobileRef     = useRef(isMobile)
  const reducedMotion   = useRef(false)

  useEffect(() => { isMobileRef.current = isMobile }, [isMobile])
  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  }, [])

  // ── Draw with inter-frame blending (floor@1 + ceil@frac) ─────────────────
  const draw = useCallback((floatIdx: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx || !readyRef.current) return

    const clamped = Math.max(0, Math.min(FRAME_COUNT - 1, floatIdx))
    const lo      = Math.floor(clamped)
    const hi      = Math.min(FRAME_COUNT - 1, lo + 1)
    const frac    = clamped - lo

    const imgLo = imgsRef.current[lo]
    const imgHi = imgsRef.current[hi]
    if (!imgLo) return

    const { width: cw, height: ch } = canvas
    const zoom = isMobileRef.current ? 1.5 : 1.0
    const sc   = Math.min(cw / imgLo.naturalWidth, ch / imgLo.naturalHeight) * zoom
    const dw   = imgLo.naturalWidth  * sc
    const dh   = imgLo.naturalHeight * sc
    const dx   = (cw - dw) / 2
    const dy   = (ch - dh) / 2

    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = "high"

    ctx.clearRect(0, 0, cw, ch)

    ctx.globalAlpha = 1
    ctx.drawImage(imgLo, dx, dy, dw, dh)

    if (frac > 0 && imgHi && hi !== lo) {
      ctx.globalAlpha = frac
      ctx.drawImage(imgHi, dx, dy, dw, dh)
      ctx.globalAlpha = 1
    }
  }, [])

  // ── rAF loop — lerp current → target, then draw ──────────────────────────
  useEffect(() => {
    const tick = () => {
      if (readyRef.current) {
        currentRef.current = reducedMotion.current
          ? targetRef.current
          : currentRef.current + (targetRef.current - currentRef.current) * SMOOTH
        draw(currentRef.current)
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [draw])

  // ── Preload ALL frames + await decode() before enabling scrub ─────────────
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    let cancelled = false
    const dir = isMobile ? "frames-mobile" : "frames"

    const loadAll = async () => {
      const imgs: HTMLImageElement[] = Array.from({ length: FRAME_COUNT }, (_, i) => {
        const img = new Image()
        img.src = `/${dir}/frame_${String(i).padStart(3, "0")}.webp`
        return img
      })
      imgsRef.current = imgs

      await Promise.all(imgs.map(img => img.decode().catch(() => {})))

      if (!cancelled) {
        readyRef.current = true
        draw(0)
      }
    }

    // Start loading 1000px before section scrolls into view
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        obs.disconnect()
        loadAll()
      },
      { rootMargin: "1000px" }
    )
    obs.observe(section)

    return () => { cancelled = true; obs.disconnect() }
  }, [draw, sectionRef, isMobile])

  // ── Canvas resize — DPR capped at 2 ──────────────────────────────────────
  useEffect(() => {
    const wrap   = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return

    const sync = () => {
      const dpr     = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width  = wrap.offsetWidth  * dpr
      canvas.height = wrap.offsetHeight * dpr
      draw(currentRef.current)
    }
    sync()
    const ro = new ResizeObserver(sync)
    ro.observe(wrap)
    return () => ro.disconnect()
  }, [draw])

  // ── Scroll → target (never write currentRef here) ────────────────────────
  const getIdx = useCallback(() => {
    const section = sectionRef.current
    if (!section) return 0
    const scrollable = section.offsetHeight - window.innerHeight
    if (scrollable <= 0) return 0
    const scrolled = -section.getBoundingClientRect().top
    const v = Math.max(0, Math.min(1, scrolled / scrollable))
    return v * (FRAME_COUNT - 1)
  }, [sectionRef])

  useEffect(() => {
    const onScroll = () => { targetRef.current = getIdx() }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [getIdx])

  return (
    <motion.div
      ref={wrapRef}
      style={{
        position: "absolute",
        left: "50%", top: isMobile ? "34%" : "50%",
        translateX: "-50%", translateY: "-50%",
        y: floatY,
        width:     isMobile ? "78vw" : "min(86vh, 64vw)",
        height:    isMobile ? "78vw" : "min(86vh, 64vw)",
        maxWidth:  isMobile ? 380 : 960,
        maxHeight: isMobile ? 380 : 960,
        zIndex: 10,
        pointerEvents: "none",
      }}
    >
      <div aria-hidden style={{
        position: "absolute", bottom: "-10%", left: "50%",
        transform: "translateX(-50%)",
        width: "140%", height: "30%",
        background: "radial-gradient(ellipse 100% 100% at 50% 50%, rgba(68,52,115,0.22) 0%, transparent 70%)",
        zIndex: 0, filter: "blur(22px)", pointerEvents: "none",
      }} />
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", display: "block", position: "relative", zIndex: 1 }}
      />
    </motion.div>
  )
}

// ── Section04_Features ────────────────────────────────────────────────────────

export function Section04_Features() {
  const sectionRef = useRef<HTMLElement>(null)
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

  const canvasFloat  = useTransform(scrollYProgress, [0.76, 1.0], [0, -110])
  const outroOpacity = useTransform(scrollYProgress, [0.88, 0.95], [0, 1])
  const outroY       = useTransform(scrollYProgress, [0.88, 0.96], [48, 0])

  return (
    <section
      ref={sectionRef}
      style={{ background: BG, minHeight: "700vh", position: "relative" }}
    >
      <div style={{ position: "sticky", top: 0, height: "100dvh", overflow: "hidden", background: BG }}>

        {/* Radial glow */}
        <div aria-hidden style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
          background: "radial-gradient(ellipse 70% 60% at 60% 52%, rgba(122,107,145,0.26) 0%, transparent 65%)",
        }} />

        {/* ── PRODUCT ANIMATION ── */}
        <FrameScrubber sectionRef={sectionRef} isMobile={isMobile} floatY={canvasFloat} />

        {/* ── FEATURES ── */}
        {FEATURES.map((f, i) => (
          <FeatureBlock key={f.big + i} feature={f} index={i} isMobile={isMobile} scrollYProgress={scrollYProgress} />
        ))}

        {/* ── OUTRO CTA — below the floating product ── */}
        <motion.div style={{
          position: "absolute",
          bottom: isMobile ? "clamp(44px,9dvh,110px)" : "clamp(48px,8vh,96px)",
          left: "50%",
          translateX: "-50%",
          textAlign: "center", opacity: outroOpacity, y: outroY,
          zIndex: 15, pointerEvents: "none",
          width: isMobile ? "clamp(220px,85vw,340px)" : "clamp(240px,52vw,600px)",
        }}>
          <h2 className="font-druk-wide uppercase" style={{
            fontSize: isMobile ? "clamp(26px,8vw,40px)" : "clamp(26px,4vw,68px)",
            lineHeight: 0.88, letterSpacing: "-0.03em",
            margin: "0 0 clamp(14px,2.2vh,28px)",
          }}>
            <span style={{ display: "block", color: "transparent", WebkitTextStroke: `clamp(1.5px,0.12vw,2px) ${TEXT}` }}>
              ÜBERZEUG DICH
            </span>
            <span style={{ display: "block", color: TEXT }}>SELBST</span>
          </h2>
          <a href="/shop" className="font-druk-wide uppercase" style={{
            display: "inline-flex", alignItems: "center",
            background: TEXT, color: LIGHT, borderRadius: 999,
            padding: "4px 32px 4px 4px",
            fontSize: "clamp(12px,1vw,15px)", letterSpacing: "0.03em",
            textDecoration: "none", pointerEvents: "auto",
          }}>
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
