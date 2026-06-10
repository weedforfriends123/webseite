"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import {
  useTransform,
  motion,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion"

const TOTAL_FRAMES = 40
const PAGE_BG = "#35383f"
const NAV_H = 60 // px

const STAGES = [
  {
    range: [0, 0.04, 0.20, 0.26] as [number, number, number, number],
    step: "01",
    title: "STRAIGHT FLAVOR",
    subtitle: "Ein Zug und du weißt Bescheid.",
  },
  {
    range: [0.30, 0.34, 0.46, 0.52] as [number, number, number, number],
    step: "02",
    title: "PURE JUICE",
    subtitle: "Süß, fruchtig, fett – kein halbes Ding.",
  },
  {
    range: [0.55, 0.59, 0.76, 0.81] as [number, number, number, number],
    step: "03",
    title: "TASTE OVERLOAD",
    subtitle: "Jeder Zug haut den vollen Geschmack raus.",
  },
  {
    range: [0.85, 0.88, 0.96, 1.0] as [number, number, number, number],
    step: "04",
    title: "WEEDFORFRIENDS",
    subtitle: "Dein Daily. Jeden Tag aufs Neue.",
  },
]

// ── Stage text — right side, spring-bounce entrance + scroll lock feel ────────

function StageText({
  stage,
  progress,
}: {
  stage: (typeof STAGES)[number]
  progress: MotionValue<number>
}) {
  const [r0, r1, r2, r3] = stage.range
  const opacity = useTransform(progress, [r0, r1, r2, r3], [0, 1, 1, 0])
  const [snapped, setSnapped] = useState(false)
  const snappedRef = useRef(false)

  // useMotionValueEvent callback is set up once — use a ref to avoid stale closure
  useMotionValueEvent(opacity, "change", (v) => {
    if (v > 0.65 && !snappedRef.current) {
      snappedRef.current = true
      setSnapped(true)
    }
    if (v < 0.05 && snappedRef.current) {
      snappedRef.current = false
      setSnapped(false)
    }
  })

  return (
    <div
      className="absolute right-5 md:right-12 lg:right-20 z-10 pointer-events-none select-none"
      style={{ top: "50%", transform: "translateY(-50%)" }}
    >
      {/* Opacity driven by scroll */}
      <motion.div style={{ opacity }}>
        {/* Spring bounce driven by snapped state */}
        <motion.div
          animate={
            snapped
              ? { x: [10, -5, 3, -1, 0] }
              : { x: 12 }
          }
          transition={{
            duration: 0.45,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="text-left"
          style={{ maxWidth: "clamp(140px, 20vw, 260px)" }}
        >
          <p
            className="font-mono text-[8px] md:text-[9px] tracking-[0.45em] uppercase mb-2"
            style={{ color: "rgba(14,15,17,0.35)" }}
          >
            — {stage.step} / 04 —
          </p>
          <h2
            className="font-druk uppercase mb-2"
            style={{
              fontSize: "clamp(1.2rem, 3vw, 2.8rem)",
              lineHeight: 0.9,
              letterSpacing: "-0.01em",
              color: "#0e0f11",
            }}
          >
            {stage.title}
          </h2>
          <div
            className="w-5 h-px mb-2"
            style={{ background: "rgba(160,186,135,0.7)" }}
          />
          <p
            className="font-body leading-snug"
            style={{ fontSize: "clamp(9px, 1.1vw, 12px)", color: "rgba(14,15,17,0.45)" }}
          >
            {stage.subtitle}
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

// ── Scroll cue ────────────────────────────────────────────────────────────────

function ScrollCue({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0, 0.06], [1, 0])
  return (
    <motion.div
      style={{ opacity }}
      className="absolute bottom-6 right-5 flex items-center gap-2 z-10 pointer-events-none"
    >
      <p
        className="font-mono text-[8px] tracking-[0.4em] uppercase"
        style={{ writingMode: "vertical-rl", color: "rgba(14,15,17,0.22)" }}
      >
        Scroll
      </p>
      <motion.div
        animate={{ scaleY: [0.6, 1, 0.6] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="w-px h-8 origin-top"
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
      className="absolute bottom-0 left-0 z-10 origin-left"
      style={{
        scaleX,
        width: "100%",
        height: "1px",
        background: "rgba(14,15,17,0.12)",
      }}
    />
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

export function VapeCanvas({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const framesRef = useRef<HTMLImageElement[]>([])
  const [loaded, setLoaded] = useState(false)
  const [loadPct, setLoadPct] = useState(0)
  const rafRef = useRef<number | null>(null)
  const lastFrameRef = useRef(-1)
  // Float lerp value — stays between frames for sub-frame smoothness
  const lerpRef = useRef(0)

  // Preload all frames before scroll is enabled
  useEffect(() => {
    let count = 0
    const imgs: HTMLImageElement[] = Array.from({ length: TOTAL_FRAMES }, (_, i) => {
      const img = new Image()
      img.src = `/frames/ezgif-frame-${String(i + 1).padStart(3, "0")}.png`
      img.onload = img.onerror = () => {
        count++
        setLoadPct(Math.round((count / TOTAL_FRAMES) * 100))
        if (count === TOTAL_FRAMES) {
          framesRef.current = imgs
          lerpRef.current = scrollYProgress.get() * (TOTAL_FRAMES - 1)
          setLoaded(true)
        }
      }
      return img
    })
  }, [scrollYProgress])

  const drawFrame = useCallback((idx: number) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    const img = framesRef.current[idx]
    if (!canvas || !ctx || !img?.complete || !img.naturalWidth) return

    ctx.fillStyle = PAGE_BG
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // object-fit: contain — never cropped on any device
    const cw = canvas.width, ch = canvas.height
    const ir = img.naturalWidth / img.naturalHeight
    const cr = cw / ch
    let dw: number, dh: number, dx: number, dy: number
    if (ir > cr) {
      dw = cw; dh = cw / ir; dx = 0; dy = (ch - dh) / 2
    } else {
      dh = ch; dw = ch * ir; dx = (cw - dw) / 2; dy = 0
    }
    ctx.drawImage(img, dx, dy, dw, dh)
  }, [])

  // RAF loop — adaptive lerp:
  //   fast (0.22) when scrolling normally
  //   slow (0.06) within ±2 % of a stage snap-in point → creates the "Einhängen" pause
  useEffect(() => {
    if (!loaded) return

    const SNAP_POINTS = STAGES.map((s) => s.range[1])

    const tick = () => {
      const raw = scrollYProgress.get()
      const target = raw * (TOTAL_FRAMES - 1)

      const distToSnap = Math.min(...SNAP_POINTS.map((sp) => Math.abs(raw - sp)))
      const lerpFactor = distToSnap < 0.025 ? 0.06 : 0.22

      lerpRef.current += (target - lerpRef.current) * lerpFactor

      const fi = Math.min(Math.max(0, Math.round(lerpRef.current)), TOTAL_FRAMES - 1)
      if (fi !== lastFrameRef.current) {
        lastFrameRef.current = fi
        drawFrame(fi)
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [loaded, scrollYProgress, drawFrame])

  // DPR-aware resize
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = canvas.clientWidth * dpr
      canvas.height = canvas.clientHeight * dpr
      drawFrame(Math.max(lastFrameRef.current, 0))
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    return () => ro.disconnect()
  }, [drawFrame])

  const canvasH = `calc(100svh - ${NAV_H}px)`

  return (
    // Sticks BELOW the navbar (top-[60px]) so product is never hidden
    <div
      className="sticky w-full overflow-hidden"
      style={{ top: `${NAV_H}px`, height: canvasH, background: PAGE_BG }}
    >
      {/* Loading screen */}
      {!loaded && (
        <div
          className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-6"
          style={{ background: PAGE_BG }}
        >
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-px h-14"
              style={{ background: "linear-gradient(to bottom, transparent, rgba(160,186,135,0.5), rgba(160,186,135,0.9))" }}
            />
            <p className="font-mono text-[9px] tracking-[0.6em] uppercase" style={{ color: "rgba(14,15,17,0.38)" }}>
              Preparing
            </p>
          </div>
          <div className="w-44 h-px relative overflow-hidden" style={{ background: "rgba(14,15,17,0.08)" }}>
            <div
              className="h-full absolute top-0 left-0 transition-[width] duration-150 ease-out"
              style={{ width: `${loadPct}%`, background: "#a0ba87" }}
            />
          </div>
          <p className="font-mono text-[9px] tracking-widest tabular-nums" style={{ color: "rgba(14,15,17,0.22)" }}>
            {loadPct}%
          </p>
        </div>
      )}

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.8s ease" }}
      />

      {loaded && (
        <>
          {STAGES.map((stage, i) => (
            <StageText key={i} stage={stage} progress={scrollYProgress} />
          ))}
          <ScrollCue progress={scrollYProgress} />
          <ProgressBar progress={scrollYProgress} />
        </>
      )}
    </div>
  )
}
