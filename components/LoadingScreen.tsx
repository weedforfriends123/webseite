"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"

const WORD            = "WEED4FRIENDS"
const LETTERS         = WORD.split("")
const LETTER_DRAW_MS  = 210   // how long each letter "draws" (clip wipe)
const LETTER_DELAY_MS = 195   // gap between triggering each letter (~2.3s total)

type Phase = "writing" | "waiting" | "exiting" | "done"

export function LoadingScreen() {
  const [triggered, setTriggered] = useState(0)  // how many letters started drawing
  const [phase, setPhase]         = useState<Phase>("writing")

  const glbReady    = useRef(false)
  const pageReady   = useRef(false)
  const writeDone   = useRef(false)
  const isMobileRef = useRef(false)
  const exitY       = useRef(-260)
  const exitScale   = useRef(0.18)

  useEffect(() => {
    isMobileRef.current = window.innerWidth < 768
    if (!isMobileRef.current) {
      const fh = Math.min(80, Math.max(36, window.innerWidth * 0.06))
      exitY.current     = -(window.innerHeight / 2 - 28)
      exitScale.current = 32 / fh
    }

    const tryExit = () => {
      if (glbReady.current && pageReady.current && writeDone.current) {
        setTimeout(() => setPhase("exiting"), 320)  // brief hold at 100%
      }
    }

    // Stream GLB so real load drives the "waiting" phase
    fetch("/product.glb", { cache: "force-cache" })
      .then(res => {
        if (!res.body) { glbReady.current = true; tryExit(); return }
        const reader = res.body.getReader()
        const drain = (): Promise<void> => reader.read().then(({ done: d }) => {
          if (d) { glbReady.current = true; tryExit(); return }
          return drain()
        }).catch(() => { glbReady.current = true; tryExit() })
        return drain()
      })
      .catch(() => { glbReady.current = true; tryExit() })

    const onLoad = () => { pageReady.current = true; tryExit() }
    if (document.readyState === "complete") onLoad()
    else window.addEventListener("load", onLoad)

    const timeout = setTimeout(() => {
      glbReady.current = true; pageReady.current = true; tryExit()
    }, 10_000)

    // Trigger letters one by one — like a pen moving across
    let count = 0
    const writeTimer = setInterval(() => {
      count++
      setTriggered(count)
      if (count >= LETTERS.length) {
        clearInterval(writeTimer)
        writeDone.current = true
        setPhase(p => p === "writing" ? "waiting" : p)
        tryExit()
      }
    }, LETTER_DELAY_MS)

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
      {/* Background — fades out after text animates away */}
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

      {/* Text — flies toward navbar on desktop, fades on mobile */}
      <motion.div
        animate={exiting ? (isMobileRef.current
          ? { opacity: 0 }
          : { y: exitY.current, scale: exitScale.current, opacity: 0 }
        ) : {}}
        transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
        style={{
          position: "fixed", inset: 0,
          zIndex: 10000,
          display: "flex", alignItems: "center", justifyContent: "center",
          pointerEvents: "none",
          // slight left offset on desktop so it reads as heading toward the logo
          paddingRight: isMobileRef.current ? 0 : "clamp(0px,8vw,100px)",
        }}
      >
        <p
          className="font-druk-wide uppercase"
          style={{
            fontSize: "clamp(38px,6.2vw,82px)",
            color: "#e8e4dc",
            letterSpacing: "0.06em",
            margin: 0,
            lineHeight: 1,
          }}
        >
          {LETTERS.map((letter, i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                // clip sweeps from left to right — the "pen stroke" reveal
                clipPath: triggered > i ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
                // transition is always defined so the wipe animates when clip changes
                transition: `clip-path ${LETTER_DRAW_MS}ms cubic-bezier(0.4, 0, 0.4, 1)`,
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
