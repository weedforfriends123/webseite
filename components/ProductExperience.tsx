"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
  AnimatePresence,
  type MotionValue,
} from "framer-motion"
import { useStopHaptics } from "@/hooks/useStopHaptics"

// ── Constants ─────────────────────────────────────────────────────────────────
// TO CUSTOMIZE: Change PAGE_BG / TEXT_COL here or in globals.css
const PAGE_BG = "#35383f"
const TEXT_COL = "#35383f"
const TOTAL_FRAMES = 30
// TO CUSTOMIZE: Replace /frames2/ with another folder if you swap the image sequence
const FRAME_PATH = (i: number) =>
  `/frames2/ezgif-frame-${String(i + 1).padStart(3, "0")}.png`

// ── Scroll-stop content ───────────────────────────────────────────────────────
// TO CUSTOMIZE: title / subtitle / tag / accent for each stop.
// 'accent' renders in Mindflow — use one evocative word only.
// opRange: [fade-in-start, full-visible, full-visible, fade-out-end]
// activeRange: when this stop counts as "active" (haptic + pulse fires)
const STOPS = [
  {
    id: 0,
    label: "01 / 04",
    title: "STRAIGHT FLAVOR",
    subtitle: "Ein Zug und du weißt Bescheid.",
    tag: "HC 96%",
    accent: "Clarity.",
    side: "left" as const,
    opRange:     [0.22, 0.28, 0.40, 0.45] as [number, number, number, number],
    activeRange: [0.28, 0.40] as [number, number],
  },
  {
    id: 1,
    label: "02 / 04",
    title: "PURE JUICE",
    subtitle: "Süß, fruchtig, fett – kein halbes Ding.",
    tag: "Premium Blend",
    accent: "Pure.",
    side: "right" as const,
    opRange:     [0.52, 0.57, 0.67, 0.72] as [number, number, number, number],
    activeRange: [0.57, 0.67] as [number, number],
  },
  {
    id: 2,
    label: "03 / 04",
    title: "TASTE OVERLOAD",
    subtitle: "Jeder Zug haut den vollen Geschmack raus.",
    tag: "Northern Lights",
    accent: "Daily.",
    side: "left" as const,
    opRange:     [0.73, 0.78, 0.86, 0.90] as [number, number, number, number],
    activeRange: [0.78, 0.86] as [number, number],
  },
  {
    id: 3,
    label: "04 / 04",
    title: "WEEDFORFRIENDS",
    subtitle: "Dein Daily. Jeden Tag aufs Neue.",
    tag: "WFF ®",
    accent: "Ritual.",
    side: "right" as const,
    opRange:     [0.91, 0.94, 0.98, 1.0] as [number, number, number, number],
    activeRange: [0.94, 0.98] as [number, number],
  },
]

// ── Frame-sequence pacing ─────────────────────────────────────────────────────
// Maps scroll progress [0..1] → frame index target [0..TOTAL_FRAMES-1]
// Slow sections = text-stop dwell; fast transitions = quick product spin between stops
// TO CUSTOMIZE: Adjust PACE_OUT to change how long each stop lingers
const TOTAL = TOTAL_FRAMES - 1
const PACE_IN  = [0.00, 0.05, 0.18, 0.24, 0.28, 0.45, 0.50, 0.55, 0.57, 0.70, 0.74, 0.79, 0.81, 0.89, 0.92, 0.96, 1.00]
const PACE_OUT = PACE_IN.map((_, i) => {
  // Piecewise values from 0 → TOTAL with fast/slow segments
  const raw = [0, 0, 0.33, 2.4, 2.6, 2.8, 5.0, 5.3, 5.4, 5.6, 7.5, 7.7, 7.8, 9.7, 9.85, 9.95, 10.0]
  return Math.round((raw[i] / 10) * TOTAL * 10) / 10
})

// ── StopText ──────────────────────────────────────────────────────────────────

function StopText({
  stop,
  progress,
  reduced,
}: {
  stop: (typeof STOPS)[number]
  progress: MotionValue<number>
  reduced: boolean | null
}) {
  const opacity = useTransform(progress, stop.opRange, [0, 1, 1, 0])
  const yVal    = useTransform(progress, stop.opRange, [reduced ? 0 : 26, 0, 0, reduced ? 0 : -16])

  const [entered, setEntered]  = useState(false)
  const enteredRef             = useRef(false)

  useMotionValueEvent(opacity, "change", (v) => {
    if (v > 0.75 && !enteredRef.current)  { enteredRef.current = true;  setEntered(true)  }
    if (v < 0.04 && enteredRef.current)   { enteredRef.current = false; setEntered(false) }
  })

  const isLeft = stop.side === "left"
  const shakeX: { x: number[] } | undefined = reduced
    ? undefined
    : { x: isLeft ? [-10, 5, -3, 1, 0] : [10, -5, 3, -1, 0] }

  return (
    <>
      {/* Desktop: left / right of product */}
      <div
        className={[
          "absolute z-10 pointer-events-none select-none hidden md:block",
          "top-1/2 -translate-y-1/2",
          isLeft
            ? "left-[4%] lg:left-[7%] xl:left-[10%] text-left"
            : "right-[4%] lg:right-[7%] xl:right-[10%] text-right",
        ].join(" ")}
        style={{ maxWidth: "clamp(155px, 20vw, 280px)" }}
      >
        <StopBlock stop={stop} opacity={opacity} y={yVal} entered={entered} shakeX={shakeX} centered={false} isLeft={isLeft} />
      </div>

      {/* Mobile: bottom-center */}
      <div
        className="absolute z-10 pointer-events-none select-none md:hidden"
        style={{ bottom: "7%", left: "50%", transform: "translateX(-50%)", width: "min(84vw, 340px)", textAlign: "center" }}
      >
        <StopBlock stop={stop} opacity={opacity} y={yVal} entered={entered} shakeX={shakeX} centered isLeft={null} />
      </div>
    </>
  )
}

function StopBlock({
  stop, opacity, y, entered, shakeX, centered, isLeft,
}: {
  stop: (typeof STOPS)[number]
  opacity: MotionValue<number>
  y: MotionValue<number>
  entered: boolean
  shakeX: { x: number[] } | undefined
  centered: boolean
  isLeft: boolean | null
}) {
  return (
    <motion.div style={{ opacity, y }}>
      <motion.div
        animate={entered ? shakeX : undefined}
        transition={{ duration: 0.44, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Mindflow accent — single evocative word */}
        <p
          className="font-mindflow leading-none mb-1"
          style={{ fontSize: "clamp(0.65rem, 1vw, 0.85rem)", color: "rgba(53,56,63,0.28)", letterSpacing: "0.02em" }}
        >
          {stop.accent}
        </p>

        {/* Overline */}
        <p
          className="font-mono text-[8px] md:text-[9px] tracking-[0.4em] uppercase mb-2.5"
          style={{ color: "rgba(53,56,63,0.35)" }}
        >
          — {stop.label} —
        </p>

        {/* Headline — Adieu */}
        <h2
          className="font-adieu uppercase mb-3"
          style={{ fontSize: "clamp(1.2rem, 2.8vw, 2.5rem)", lineHeight: 0.88, letterSpacing: "-0.01em", color: TEXT_COL }}
        >
          {stop.title}
        </h2>

        {/* Divider */}
        <div
          className={`w-5 h-px mb-2.5 ${centered ? "mx-auto" : isLeft ? "" : "ml-auto"}`}
          style={{ background: "rgba(160,186,135,0.6)" }}
        />

        {/* Subtitle — Ekstra */}
        <p
          className="font-ekstra leading-relaxed"
          style={{ fontSize: "clamp(9px, 0.95vw, 11.5px)", color: "rgba(53,56,63,0.48)" }}
        >
          {stop.subtitle}
        </p>

        {/* Tag */}
        <span
          className="inline-block mt-3 font-mono text-[7px] tracking-[0.35em] uppercase px-2 py-0.5"
          style={{ color: "rgba(160,186,135,0.85)", border: "1px solid rgba(160,186,135,0.28)" }}
        >
          {stop.tag}
        </span>
      </motion.div>
    </motion.div>
  )
}

// ── Scroll cue ────────────────────────────────────────────────────────────────

function ScrollCue({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0, 0.05], [1, 0])
  return (
    <motion.div
      style={{ opacity }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none flex flex-col items-center gap-2"
    >
      <p className="font-mono text-[8px] tracking-[0.45em] uppercase" style={{ color: "rgba(53,56,63,0.28)" }}>
        Scroll
      </p>
      <motion.div
        animate={{ scaleY: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
        className="w-px h-7 origin-top"
        style={{ background: "linear-gradient(to bottom, rgba(160,186,135,0.7), transparent)" }}
      />
    </motion.div>
  )
}

// ── Progress bar ──────────────────────────────────────────────────────────────

function ProgressBar({ progress }: { progress: MotionValue<number> }) {
  const scaleX = useTransform(progress, [0, 1], [0, 1])
  return (
    <motion.div
      className="absolute bottom-0 left-0 z-10 w-full h-px origin-left"
      style={{ scaleX, background: "rgba(53,56,63,0.1)" }}
    />
  )
}

// ── Stop glow pulse (visual haptic on stop entry) ─────────────────────────────

function StopGlowPulse({ activeStop }: { activeStop: number | null }) {
  return (
    <AnimatePresence>
      {activeStop !== null && (
        <motion.div
          key={`glow-${activeStop}`}
          className="absolute inset-0 z-0 pointer-events-none"
          initial={{ opacity: 0.65, scale: 0.85 }}
          animate={{ opacity: 0, scale: 1.35 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          style={{
            background:
              "radial-gradient(ellipse 55% 45% at 50% 50%, rgba(201,168,76,0.13), rgba(160,186,135,0.05) 55%, transparent 75%)",
          }}
        />
      )}
    </AnimatePresence>
  )
}

// ── Stage counter (top-right) ─────────────────────────────────────────────────

function StageCounter({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const [label, setLabel] = useState("·")
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    for (const s of STOPS) {
      if (v >= s.activeRange[0] && v <= s.activeRange[1]) { setLabel(s.label); return }
    }
    setLabel("·")
  })
  return (
    <div className="absolute top-6 right-6 z-10 pointer-events-none" aria-hidden>
      <AnimatePresence mode="wait">
        <motion.p
          key={label}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.2 }}
          className="font-mono text-[8px] tracking-[0.4em] uppercase tabular-nums"
          style={{ color: "rgba(53,56,63,0.22)" }}
        >
          {label}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}

// ── Loading overlay ───────────────────────────────────────────────────────────

function LoadingOverlay({ pct }: { pct: number }) {
  return (
    <div
      className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-5"
      style={{ background: PAGE_BG }}
    >
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-px h-12"
          style={{ background: "linear-gradient(to bottom, transparent, rgba(160,186,135,0.5), rgba(160,186,135,0.9))" }}
        />
        <p className="font-mono text-[9px] tracking-[0.6em] uppercase" style={{ color: "rgba(53,56,63,0.38)" }}>
          Preparing
        </p>
      </div>
      <div className="w-40 h-px relative overflow-hidden" style={{ background: "rgba(53,56,63,0.08)" }}>
        <div
          className="h-full absolute top-0 left-0 transition-[width] duration-150 ease-out"
          style={{ width: `${pct}%`, background: "#a0ba87" }}
        />
      </div>
      <p className="font-mono text-[9px] tracking-widest tabular-nums" style={{ color: "rgba(53,56,63,0.22)" }}>
        {pct}%
      </p>
    </div>
  )
}

// ── Canvas draw helper ────────────────────────────────────────────────────────

function drawContain(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cw: number,
  ch: number
) {
  ctx.fillStyle = PAGE_BG
  ctx.fillRect(0, 0, cw, ch)
  if (!img.complete || !img.naturalWidth) return
  const ir = img.naturalWidth / img.naturalHeight
  const cr = cw / ch
  let dw: number, dh: number, dx: number, dy: number
  if (ir > cr) { dw = cw; dh = cw / ir; dx = 0;          dy = (ch - dh) / 2 }
  else          { dh = ch; dw = ch * ir; dy = 0;          dx = (cw - dw) / 2 }
  ctx.drawImage(img, dx, dy, dw, dh)
}

// ── Main component ─────────────────────────────────────────────────────────────

export function ProductExperience() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const framesRef    = useRef<HTMLImageElement[]>([])
  const rafRef       = useRef<number | null>(null)
  const lastFrameRef = useRef(-1)
  const lerpRef      = useRef(0)

  const [loaded,    setLoaded]    = useState(false)
  const [loadPct,   setLoadPct]   = useState(0)
  const [activeStop, setActiveStop] = useState<number | null>(null)
  const [pulseKey,   setPulseKey]   = useState(0)
  const [revealed,   setRevealed]   = useState(false)

  const activeStopRef = useRef<number | null>(null)
  const prevStopRef   = useRef<number | null>(null)
  const reduced       = useReducedMotion()

  // Scroll progress for the 400 vh container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  // Smoothed progress for paced frame target (spring adds pleasant organic lag)
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 160, damping: 34, mass: 0.6 })

  // Frame target from piecewise easing (variable speed)
  const frameTarget = useTransform(smoothProgress, PACE_IN, PACE_OUT)

  // Background parallax
  const bgTextY = useTransform(smoothProgress, [0, 1], [0, reduced ? 0 : -55])

  // ── Preload all frames ─────────────────────────────────────────────────────
  useEffect(() => {
    let count = 0
    const imgs: HTMLImageElement[] = Array.from({ length: TOTAL_FRAMES }, (_, i) => {
      const img = new Image()
      img.src = FRAME_PATH(i)
      img.onload = img.onerror = () => {
        count++
        setLoadPct(Math.round((count / TOTAL_FRAMES) * 100))
        if (count === TOTAL_FRAMES) {
          framesRef.current = imgs
          lerpRef.current = frameTarget.get()
          setLoaded(true)
          setTimeout(() => setRevealed(true), 80)
        }
      }
      return img
    })
    return () => { imgs.forEach(img => { img.onload = null; img.onerror = null }) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Draw frame ────────────────────────────────────────────────────────────
  const drawFrame = useCallback((idx: number) => {
    const canvas = canvasRef.current
    const ctx    = canvas?.getContext("2d")
    const img    = framesRef.current[idx]
    if (!canvas || !ctx) return
    drawContain(ctx, img, canvas.width, canvas.height)
  }, [])

  // ── RAF loop — adaptive lerp (slows at text-stop zones for "Einhängen") ───
  useEffect(() => {
    if (!loaded) return

    // Snap points = center of each active range
    const SNAPS = STOPS.map(s => (s.activeRange[0] + s.activeRange[1]) / 2)

    const tick = () => {
      const target  = frameTarget.get()
      const rawProg = scrollYProgress.get()
      const distToSnap = Math.min(...SNAPS.map(sp => Math.abs(rawProg - sp)))

      // Adaptive factor: very slow near stops → feel of "docking in"
      const factor = distToSnap < 0.022 ? 0.055 : 0.20

      lerpRef.current += (target - lerpRef.current) * factor
      const fi = Math.min(Math.max(0, Math.round(lerpRef.current)), TOTAL_FRAMES - 1)

      if (fi !== lastFrameRef.current) {
        lastFrameRef.current = fi
        drawFrame(fi)
      }

      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [loaded, drawFrame, frameTarget, scrollYProgress])

  // ── DPR-aware resize ──────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width  = canvas.clientWidth  * dpr
      canvas.height = canvas.clientHeight * dpr
      drawFrame(Math.max(lastFrameRef.current, 0))
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    return () => ro.disconnect()
  }, [drawFrame])

  // ── Track active stop ─────────────────────────────────────────────────────
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    let found: number | null = null
    for (const s of STOPS) {
      if (v >= s.activeRange[0] && v <= s.activeRange[1]) { found = s.id; break }
    }
    if (found !== activeStopRef.current) {
      activeStopRef.current = found
      setActiveStop(found)
    }
  })

  // ── Haptic + visual pulse on stop entry ───────────────────────────────────
  useStopHaptics(activeStop)
  useEffect(() => {
    if (activeStop !== null && activeStop !== prevStopRef.current) {
      prevStopRef.current = activeStop
      setPulseKey(k => k + 1)
    }
  }, [activeStop])

  // ── Idle float (CSS animation — avoids RAf conflict with canvas loop) ─────
  // Applied via a motion.div wrapping the canvas with slow keyframe animation

  return (
    // 400 vh scroll spacer — generous dwell time between stops
    // TO CUSTOMIZE: change height for more/less scroll distance
    <div ref={containerRef} className="relative" style={{ height: "400vh" }}>

      {/* Sticky viewport */}
      <div
        className="sticky top-0 w-full overflow-hidden"
        style={{ height: "100svh", background: PAGE_BG }}
      >

        {/* Noise grain */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-[2] opacity-[0.032]" aria-hidden>
          <filter id="wff-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="4" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#wff-grain)" />
        </svg>

        {/* Ambient radial glow */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background:
              "radial-gradient(ellipse 58% 52% at 50% 48%, rgba(201,168,76,0.08) 0%, rgba(160,186,135,0.05) 45%, transparent 72%)",
          }}
        />

        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none z-[3]"
          style={{
            background:
              "radial-gradient(ellipse 110% 100% at 50% 50%, transparent 42%, rgba(53,56,63,0.09) 100%)",
          }}
        />

        {/* Background Adieu typography — graphic depth layer */}
        <motion.div
          style={{ y: bgTextY }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 select-none overflow-hidden"
          aria-hidden
        >
          <p
            className="font-adieu uppercase absolute whitespace-nowrap"
            style={{
              fontSize: "clamp(5rem, 17vw, 17rem)",
              letterSpacing: "-0.04em",
              color: TEXT_COL,
              opacity: 0.026,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            WEEDFORFRIENDS
          </p>
          <p
            className="font-adieu uppercase absolute"
            style={{
              fontSize: "clamp(2rem, 6.5vw, 6.5rem)",
              letterSpacing: "0.1em",
              color: TEXT_COL,
              opacity: 0.038,
              top: "18%",
              right: "6%",
              transform: "rotate(-28deg)",
            }}
          >
            HC 96%
          </p>
          <p
            className="font-adieu uppercase absolute"
            style={{
              fontSize: "clamp(1rem, 3.2vw, 3.2rem)",
              letterSpacing: "0.2em",
              color: TEXT_COL,
              opacity: 0.030,
              bottom: "14%",
              left: "4%",
            }}
          >
            NORTHERN LIGHTS
          </p>
        </motion.div>

        {/* Stop glow pulse */}
        <StopGlowPulse activeStop={activeStop} />

        {/* Text stops */}
        {STOPS.map(stop => (
          <StopText key={stop.id} stop={stop} progress={scrollYProgress} reduced={reduced} />
        ))}

        {/* ── Canvas — frame sequence center stage ─────────────────────── */}
        <div className="absolute inset-0 flex items-center justify-center z-[5]">
          {/* Micro scale pulse on stop entry (visual haptic) */}
          <motion.div
            key={`pulse-${pulseKey}`}
            animate={pulseKey > 0 && !reduced ? { scale: [1, 1.014, 1] } : { scale: 1 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {/* Idle float wrapper */}
            <motion.div
              animate={!reduced ? { y: [0, -9, 0, 9, 0] } : {}}
              transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut", times: [0, 0.25, 0.5, 0.75, 1] }}
            >
              {/* Canvas reveal — fades in after frames are loaded */}
              <motion.div
                initial={reduced ? false : { opacity: 0, scale: 0.84, y: 56, filter: "blur(16px) brightness(0.9)" }}
                animate={revealed ? { opacity: 1, scale: 1, y: 0, filter: "blur(0px) brightness(1)" } : {}}
                transition={{ duration: 1.75, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Ground shadow */}
                <div
                  className="absolute pointer-events-none"
                  style={{
                    bottom: "-8%",
                    left: "10%",
                    right: "10%",
                    height: "20%",
                    background: "radial-gradient(ellipse, rgba(53,56,63,0.16), transparent 70%)",
                    filter: "blur(16px)",
                  }}
                  aria-hidden
                />
                {/* The canvas — sized via CSS, resolution via DPR in JS */}
                <canvas
                  ref={canvasRef}
                  className="block relative z-10"
                  style={{
                    height: "clamp(300px, 54vh, 600px)",
                    // maintain 16:9 aspect of source frames
                    width:  "clamp(533px, 96vh, 1067px)",
                    maxWidth: "92vw",
                  }}
                  aria-label="WEEDFORFRIENDS Northern Lights Vape — 1 ML, HC 96%"
                  role="img"
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Loading overlay */}
        {!loaded && <LoadingOverlay pct={loadPct} />}

        {/* UI chrome */}
        <ProgressBar progress={scrollYProgress} />
        <ScrollCue progress={scrollYProgress} />

        {/* Section label */}
        <div className="absolute top-6 left-6 z-10 pointer-events-none" aria-hidden>
          <p className="font-mono text-[8px] tracking-[0.4em] uppercase" style={{ color: "rgba(53,56,63,0.22)" }}>
            Northern Lights · HC 96%
          </p>
        </div>

        {/* Stage counter */}
        <StageCounter scrollYProgress={scrollYProgress} />
      </div>
    </div>
  )
}
