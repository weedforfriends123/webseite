"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"

const WORD   = "WEEDFORFRIENDS"
const LETTERS = WORD.split("")   // 14 letters
const MIN_MS  = 2800             // minimum animation duration (~200 ms / letter)
const MAX_MS  = 12_000

type Phase = "writing" | "exiting" | "done"

export function LoadingScreen() {
  const [triggered, setTriggered] = useState(0)
  const [phase, setPhase]         = useState<Phase>("writing")

  const glbFrac        = useRef(0)      // 0–1 real byte progress
  const glbDone        = useRef(false)  // GLB finished or errored
  const streamWorks    = useRef(false)  // true once any bytes received
  const pageReady      = useRef(false)
  const finishing      = useRef(false)
  const tickRef        = useRef<ReturnType<typeof setInterval> | undefined>(undefined)
  const isMobileRef    = useRef(false)
  const exitY          = useRef(0)
  const exitScale      = useRef(1)
  const startRef       = useRef(0)

  useEffect(() => {
    isMobileRef.current = window.innerWidth < 768
    if (!isMobileRef.current) {
      const fh = Math.min(80, Math.max(36, window.innerWidth * 0.06))
      exitY.current     = -(window.innerHeight / 2 - 28)
      exitScale.current = 32 / fh
    }

    startRef.current = performance.now()

    const tryFinish = () => {
      if (finishing.current) return
      const timeFrac = (performance.now() - startRef.current) / MIN_MS
      if (timeFrac >= 1 && glbDone.current && pageReady.current) {
        finishing.current = true
        clearInterval(tickRef.current)
        setTriggered(LETTERS.length)
        setTimeout(() => setPhase("exiting"), 420)
      }
    }

    // ── Tick: advance letters at pace of whichever is slower ────────────────
    // streamWorks=true  → letterFrac = min(timeFrac, glbFrac)
    //   Fast/cached GLB: glbFrac=1 quickly, letters follow 2800ms time floor
    //   Slow GLB: glbFrac < timeFrac, letters follow download speed
    // streamWorks=false → letterFrac = timeFrac (TikTok/WebView fallback)
    tickRef.current = setInterval(() => {
      const timeFrac = (performance.now() - startRef.current) / MIN_MS
      const letterFrac = streamWorks.current
        ? Math.min(timeFrac, glbFrac.current)
        : Math.min(1, timeFrac)
      // +1 offset so first letter appears as soon as any progress > 0
      const count = letterFrac <= 0
        ? 0
        : Math.min(LETTERS.length, Math.floor(letterFrac * LETTERS.length) + 1)
      setTriggered(count)
      tryFinish()
    }, 50)

    // ── Stream GLB ────────────────────────────────────────────────────────
    fetch("/product.glb", { cache: "force-cache" })
      .then(res => {
        const total = parseInt(res.headers.get("content-length") || "") || 14_000_000
        if (!res.body) { glbDone.current = true; tryFinish(); return }
        const reader = res.body.getReader()
        let got = 0
        const pump = (): Promise<void> =>
          reader.read().then(({ done: d, value }) => {
            if (d) { glbFrac.current = 1; glbDone.current = true; tryFinish(); return }
            got += value.byteLength
            glbFrac.current    = Math.min(1, got / total)
            streamWorks.current = true
            return pump()
          }).catch(() => { glbDone.current = true; tryFinish() })
        return pump()
      })
      .catch(() => { glbDone.current = true; tryFinish() })

    // ── Window load ───────────────────────────────────────────────────────
    const onLoad = () => { pageReady.current = true; tryFinish() }
    if (document.readyState === "complete") onLoad()
    else window.addEventListener("load", onLoad)

    // ── Hard fallback ─────────────────────────────────────────────────────
    const timeout = setTimeout(() => {
      glbDone.current = true; pageReady.current = true; tryFinish()
    }, MAX_MS)

    return () => {
      clearInterval(tickRef.current)
      clearTimeout(timeout)
      window.removeEventListener("load", onLoad)
    }
  }, [])

  if (phase === "done") return null
  const exiting = phase === "exiting"

  return (
    <>
      {/* Background */}
      <motion.div
        animate={exiting ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.55, delay: 0.18, ease: "easeIn" }}
        onAnimationComplete={() => { if (exiting) setPhase("done") }}
        style={{
          position: "fixed", inset: 0,
          zIndex: 9999,
          background: "#111212",
          pointerEvents: "none",
        }}
      />

      {/* Text */}
      <motion.div
        animate={exiting ? (isMobileRef.current
          ? { opacity: 0, scale: 0.96 }
          : { y: exitY.current, scale: exitScale.current, opacity: 0 }
        ) : {}}
        transition={{ duration: 0.62, ease: [0.4, 0, 0.2, 1] }}
        style={{
          position: "fixed", inset: 0,
          zIndex: 10000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <p
          className="font-druk-wide uppercase"
          style={{
            fontSize: isMobileRef.current ? "6.5vw" : "clamp(38px,6.2vw,82px)",
            color: "#e8e4dc",
            letterSpacing: isMobileRef.current ? "0.03em" : "0.06em",
            margin: 0,
            lineHeight: 1,
            whiteSpace: "nowrap",
          }}
        >
          {LETTERS.map((letter, i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                clipPath: triggered > i ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
                transition: "clip-path 220ms cubic-bezier(0.4, 0, 0.4, 1)",
              }}
            >
              {letter}
            </span>
          ))}
        </p>
      </motion.div>
    </>
  )
}
