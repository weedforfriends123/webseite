"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"

const WORD    = "WEEDFORFRIENDS"
const LETTERS = WORD.split("")  // 14 letters

type Phase = "writing" | "waiting" | "exiting" | "done"

export function LoadingScreen() {
  const [triggered, setTriggered] = useState(0)  // letters revealed so far
  const [phase, setPhase]         = useState<Phase>("writing")

  const glbProgress = useRef(0)   // 0–1 actual download fraction
  const glbReady    = useRef(false)
  const pageReady   = useRef(false)
  const isMobileRef = useRef(false)
  const exitY       = useRef(0)
  const exitScale   = useRef(1)

  useEffect(() => {
    isMobileRef.current = window.innerWidth < 768

    if (!isMobileRef.current) {
      // Desktop: text flies toward navbar (top-left)
      const fh = Math.min(80, Math.max(36, window.innerWidth * 0.06))
      exitY.current     = -(window.innerHeight / 2 - 28)
      exitScale.current = 32 / fh
    }

    const tryExit = () => {
      if (glbReady.current && pageReady.current) {
        // Ensure all letters are shown before exiting
        setTriggered(LETTERS.length)
        setTimeout(() => setPhase("exiting"), 480)
      }
    }

    // ── Stream GLB — letter reveal tracks actual download progress ──────────
    // Each letter unlocks when progress crosses its threshold
    // letter i unlocks at progress >= (i+1) / LETTERS.length * 0.85
    // (last 15% reserved for page load events)
    const updateLetters = () => {
      const p = glbProgress.current
      const count = Math.floor(p * LETTERS.length * (1 / 0.85))
      setTriggered(prev => Math.max(prev, Math.min(count, LETTERS.length)))
    }

    fetch("/product.glb", { cache: "force-cache" })
      .then(res => {
        const total = parseInt(res.headers.get("content-length") || "") || 14_000_000
        if (!res.body) { glbProgress.current = 1; glbReady.current = true; updateLetters(); tryExit(); return }
        const reader = res.body.getReader()
        let got = 0
        const pump = (): Promise<void> => reader.read().then(({ done: d, value }) => {
          if (d) { glbProgress.current = 1; glbReady.current = true; updateLetters(); tryExit(); return }
          got += value.byteLength
          glbProgress.current = Math.min(1, got / total)
          updateLetters()
          return pump()
        }).catch(() => { glbProgress.current = 1; glbReady.current = true; updateLetters(); tryExit() })
        return pump()
      })
      .catch(() => { glbProgress.current = 1; glbReady.current = true; tryExit() })

    // ── Page load ────────────────────────────────────────────────────────────
    const onLoad = () => {
      pageReady.current = true
      setTriggered(LETTERS.length)  // ensure all letters shown on page load
      tryExit()
    }
    if (document.readyState === "complete") onLoad()
    else window.addEventListener("load", onLoad)

    // ── Hard fallback — never block more than 10 s ───────────────────────────
    const timeout = setTimeout(() => {
      glbReady.current = true; pageReady.current = true
      setTriggered(LETTERS.length)
      tryExit()
    }, 10_000)

    // ── Minimum letter draw rate — even on very fast connections ─────────────
    // Ensures at least one letter every 200 ms so the writing feels deliberate
    let minCount = 0
    const minTimer = setInterval(() => {
      minCount++
      setTriggered(prev => Math.max(prev, Math.min(minCount, LETTERS.length)))
      if (minCount >= LETTERS.length) clearInterval(minTimer)
    }, 200)

    return () => {
      clearInterval(minTimer)
      clearTimeout(timeout)
      window.removeEventListener("load", onLoad)
    }
  }, [])

  if (phase === "done") return null

  const exiting = phase === "exiting"

  return (
    <>
      {/* Dark background — fades after text animates away */}
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
        {isMobileRef.current ? (
          // ── Mobile: two stacked lines so nothing gets clipped ──
          // "WEEDFOR" (outline) + "FRIENDS" (filled) — mirrors Section 1 style
          <div style={{ textAlign: "center", lineHeight: 0.88 }}>
            {(["WEEDFOR", "FRIENDS"] as const).map((word, lineIdx) => {
              const offset = lineIdx * 7  // letter indices 0–6 / 7–13
              const isOutline = lineIdx === 0
              return (
                <div key={lineIdx} className="font-druk-wide uppercase" style={{
                  display: "block",
                  fontSize: "clamp(44px,13.5vw,64px)",
                  letterSpacing: "0.04em",
                  color: isOutline ? "transparent" : "#e8e4dc",
                  WebkitTextStroke: isOutline ? "1.5px #e8e4dc" : undefined,
                  whiteSpace: "nowrap",
                }}>
                  {word.split("").map((letter, j) => {
                    const i = offset + j
                    return (
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
                    )
                  })}
                </div>
              )
            })}
          </div>
        ) : (
          // ── Desktop: single line ──
          <p
            className="font-druk-wide uppercase"
            style={{
              fontSize: "clamp(38px,6.2vw,82px)",
              color: "#e8e4dc",
              letterSpacing: "0.06em",
              margin: 0,
              lineHeight: 1,
              whiteSpace: "nowrap",
              paddingRight: "clamp(0px,8vw,100px)",
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
        )}
      </motion.div>
    </>
  )
}
