"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"

const WORD      = "WEEDFORFRIENDS"
const LETTERS   = WORD.split("")   // 14 letters
const LETTER_MS = 200              // fixed 200 ms per letter → ~2.8 s total

type Phase = "writing" | "waiting" | "exiting" | "done"

export function LoadingScreen() {
  const [triggered, setTriggered] = useState(0)
  const [phase, setPhase]         = useState<Phase>("writing")

  const assetsReady = useRef(false)
  const writingDone = useRef(false)
  const isMobileRef = useRef(false)
  const exitY       = useRef(0)
  const exitScale   = useRef(1)

  useEffect(() => {
    isMobileRef.current = window.innerWidth < 768

    if (!isMobileRef.current) {
      // Desktop: text flies toward the navbar (top-left)
      const fh = Math.min(80, Math.max(36, window.innerWidth * 0.06))
      exitY.current     = -(window.innerHeight / 2 - 28)
      exitScale.current = 32 / fh
    }

    const tryExit = () => {
      if (assetsReady.current && writingDone.current) {
        setTimeout(() => setPhase("exiting"), 400)
      }
    }

    const markAssetsReady = () => { assetsReady.current = true; tryExit() }

    // Drain GLB in the background — doesn't affect letter timing
    fetch("/product.glb", { cache: "force-cache" })
      .then(res => {
        if (!res.body) { markAssetsReady(); return }
        const reader = res.body.getReader()
        const drain = (): Promise<void> =>
          reader.read().then(({ done: d }) => {
            if (d) { markAssetsReady(); return }
            return drain()
          }).catch(() => markAssetsReady())
        return drain()
      })
      .catch(() => markAssetsReady())

    const onLoad = () => markAssetsReady()
    if (document.readyState === "complete") onLoad()
    else window.addEventListener("load", onLoad)

    // Hard fallback — never block longer than 10 s
    const timeout = setTimeout(markAssetsReady, 10_000)

    // ── Fixed-pace pen writing — always plays fully ──────────────────────────
    // One letter every LETTER_MS regardless of connection speed.
    // Writing finishes, then waits for assets if needed, then exits.
    let count = 0
    const writeTimer = setInterval(() => {
      count++
      setTriggered(count)
      if (count >= LETTERS.length) {
        clearInterval(writeTimer)
        writingDone.current = true
        setPhase(p => p === "writing" ? "waiting" : p)
        tryExit()
      }
    }, LETTER_MS)

    return () => {
      clearInterval(writeTimer)
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
            // 6.5 vw keeps all 14 chars on one line even at 320 px viewport
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
                // clip-path sweeps left → right: pen-stroke reveal per letter
                clipPath: triggered > i ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
                // transition always defined — browser animates when clip changes
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
