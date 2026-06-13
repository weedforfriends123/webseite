"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"

const WORD   = "WEEDFORFRIENDS"
const LETTERS = WORD.split("")          // 14 letters
const MIN_MS  = 2500                    // always at least 2.5 s even on cache hits
const MAX_MS  = 12_000                  // hard fallback

type Phase = "writing" | "exiting" | "done"

export function LoadingScreen() {
  const [triggered, setTriggered] = useState(0)
  const [phase, setPhase]         = useState<Phase>("writing")

  const glbFrac     = useRef(0)     // 0–1 real download fraction
  const pageReady   = useRef(false)
  const finishing   = useRef(false)
  const tickRef     = useRef<ReturnType<typeof setInterval> | undefined>(undefined)
  const isMobileRef = useRef(false)
  const exitY       = useRef(0)
  const exitScale   = useRef(1)

  useEffect(() => {
    isMobileRef.current = window.innerWidth < 768
    if (!isMobileRef.current) {
      const fh = Math.min(80, Math.max(36, window.innerWidth * 0.06))
      exitY.current     = -(window.innerHeight / 2 - 28)
      exitScale.current = 32 / fh
    }

    const START = performance.now()

    // Called on every tick and on every load event — completes only once
    const tryFinish = () => {
      if (finishing.current) return
      const elapsed  = performance.now() - START
      const timeFrac = elapsed / MIN_MS
      // Progress = whichever is further along: real download or time floor
      const frac = Math.min(1, Math.max(timeFrac, glbFrac.current))
      if (frac >= 1 && pageReady.current) {
        finishing.current = true
        clearInterval(tickRef.current)
        setTriggered(LETTERS.length)
        setTimeout(() => setPhase("exiting"), 420)
      }
    }

    // ── Tick every 50 ms — advances letters in sync with load progress ──────
    tickRef.current = setInterval(() => {
      const elapsed  = performance.now() - START
      const timeFrac = elapsed / MIN_MS
      // Letters follow whichever is slower: real download vs 2.5 s minimum
      const frac  = Math.min(1, Math.max(timeFrac, glbFrac.current))
      const count = frac >= 1 ? LETTERS.length : Math.floor(frac * LETTERS.length)
      setTriggered(count)
      tryFinish()
    }, 50)

    // ── Stream GLB — updates glbFrac as bytes arrive ──────────────────────
    fetch("/product.glb", { cache: "force-cache" })
      .then(res => {
        const total = parseInt(res.headers.get("content-length") || "") || 14_000_000
        if (!res.body) { glbFrac.current = 1; tryFinish(); return }
        const reader = res.body.getReader()
        let got = 0
        const pump = (): Promise<void> =>
          reader.read().then(({ done: d, value }) => {
            if (d) { glbFrac.current = 1; tryFinish(); return }
            got += value.byteLength
            glbFrac.current = Math.min(1, got / total)
            return pump()
          }).catch(() => { glbFrac.current = 1; tryFinish() })
        return pump()
      })
      .catch(() => { glbFrac.current = 1; tryFinish() })

    // ── Window load (fonts, images, etc.) ────────────────────────────────
    const onLoad = () => { pageReady.current = true; tryFinish() }
    if (document.readyState === "complete") onLoad()
    else window.addEventListener("load", onLoad)

    // ── Hard fallback ─────────────────────────────────────────────────────
    const timeout = setTimeout(() => {
      glbFrac.current = 1; pageReady.current = true; tryFinish()
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
