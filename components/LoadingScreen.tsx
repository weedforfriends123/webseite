"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"

const WORD     = "WEED4FRIENDS"
const LETTERS  = WORD.split("")
const INTERVAL = 155  // ms per letter  (~1.86s total)

type Phase = "typing" | "waiting" | "exiting" | "done"

export function LoadingScreen() {
  const [shown,  setShown]  = useState(0)
  const [cursor, setCursor] = useState(true)
  const [phase,  setPhase]  = useState<Phase>("typing")

  const glbReady    = useRef(false)
  const pageReady   = useRef(false)
  const typingDone  = useRef(false)
  const isMobileRef = useRef(false)
  // target for desktop exit: shrink + fly to navbar area
  const exitY       = useRef(-260)
  const exitScale   = useRef(0.18)

  useEffect(() => {
    isMobileRef.current = window.innerWidth < 768
    if (!isMobileRef.current) {
      // Adjust for viewport height — fly to top-left area
      const fh = Math.min(80, Math.max(36, window.innerWidth * 0.06))
      exitY.current     = -(window.innerHeight / 2 - 28)
      exitScale.current = 32 / fh
    }

    const tryExit = () => {
      if (glbReady.current && pageReady.current && typingDone.current) {
        setPhase("exiting")
      }
    }

    // Stream GLB to track real load progress
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

    // Page load event
    const onLoad = () => { pageReady.current = true; tryExit() }
    if (document.readyState === "complete") onLoad()
    else window.addEventListener("load", onLoad)

    // Hard fallback — never block longer than 10s
    const timeout = setTimeout(() => {
      glbReady.current = true; pageReady.current = true; tryExit()
    }, 10_000)

    // Typewriter
    let count = 0
    const typeTimer = setInterval(() => {
      count++
      setShown(count)
      if (count >= LETTERS.length) {
        clearInterval(typeTimer)
        typingDone.current = true
        setPhase(prev => prev === "typing" ? "waiting" : prev)
        tryExit()
      }
    }, INTERVAL)

    // Blinking cursor
    const cursorTimer = setInterval(() => setCursor(c => !c), 520)

    return () => {
      clearInterval(typeTimer)
      clearInterval(cursorTimer)
      clearTimeout(timeout)
      window.removeEventListener("load", onLoad)
    }
  }, [])

  if (phase === "done") return null

  const exiting = phase === "exiting"

  return (
    <>
      {/* Background — fades out after text starts moving */}
      <motion.div
        animate={exiting ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.55, delay: 0.15, ease: "easeIn" }}
        onAnimationComplete={() => { if (exiting) setPhase("done") }}
        style={{
          position: "fixed", inset: 0,
          zIndex: 9999,
          background: "#111212",
          pointerEvents: "none",
        }}
      />

      {/* Text — flies to navbar on desktop, fades on mobile */}
      <motion.div
        animate={exiting ? (isMobileRef.current
          ? { opacity: 0 }
          : { y: exitY.current, scale: exitScale.current, opacity: 0 }
        ) : {}}
        transition={{ duration: 0.60, ease: [0.4, 0, 0.2, 1] }}
        style={{
          position: "fixed", inset: 0,
          zIndex: 10000,
          display: "flex", alignItems: "center", justifyContent: "center",
          pointerEvents: "none",
          // On desktop: bias slightly left so it visually aims at logo
          paddingRight: isMobileRef.current ? 0 : "clamp(0px,10vw,120px)",
        }}
      >
        <p
          className="font-druk-wide uppercase"
          style={{
            fontSize: "clamp(36px,6vw,80px)",
            color: "#e8e4dc",
            letterSpacing: "0.06em",
            margin: 0,
            lineHeight: 1,
          }}
        >
          {WORD.slice(0, shown)}
          {!exiting && (
            <span
              style={{
                opacity: cursor ? 0.9 : 0,
                transition: "opacity 0.12s ease",
                display: "inline-block",
                width: "0.55em",
                verticalAlign: "baseline",
              }}
            >
              _
            </span>
          )}
        </p>
      </motion.div>
    </>
  )
}
