"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"

const WORD    = "WEEDFORFRIENDS"
const LETTERS = WORD.split("")
const PACE_MS = 120

type Phase = "writing" | "waiting" | "exiting" | "done"

export function LoadingScreen() {
  const [letterCount, setLetterCount] = useState(0)
  const [phase, setPhase]             = useState<Phase>(() => {
    // Skip intro animation on checkout pages (user arrives from Stripe redirect)
    if (typeof window !== "undefined" && window.location.pathname.startsWith("/checkout/")) {
      return "done"
    }
    return "writing"
  })
  const [showVideo, setShowVideo]     = useState(false)

  const assetsReady    = useRef(false)
  const writingDone    = useRef(false)
  const exitInitiated  = useRef(false)
  const isMobileRef    = useRef(false)
  const exitY          = useRef(0)
  const exitScale      = useRef(1)

  useEffect(() => {
    isMobileRef.current = window.innerWidth < 768
    setShowVideo(true)
    if (!isMobileRef.current) {
      const fh = Math.min(80, Math.max(36, window.innerWidth * 0.06))
      exitY.current     = -(window.innerHeight / 2 - 28)
      exitScale.current = 32 / fh
    }

    const tryExit = () => {
      // Guard: once exit is initiated, never trigger it again (prevents hardTimeout re-flash)
      if (exitInitiated.current) return
      if (writingDone.current && assetsReady.current) {
        exitInitiated.current = true
        setTimeout(() => setPhase("exiting"), 350)
      }
    }

    const markReady = () => { assetsReady.current = true; tryExit() }
    if (document.readyState === "complete") markReady()
    else window.addEventListener("load", markReady)
    const hardTimeout = setTimeout(markReady, 3_000)

    let n = 0
    const timer = setInterval(() => {
      n++
      setLetterCount(n)
      if (n >= LETTERS.length) {
        clearInterval(timer)
        writingDone.current = true
        setPhase(p => p === "writing" ? "waiting" : p)
        tryExit()
      }
    }, PACE_MS)

    return () => {
      clearInterval(timer)
      clearTimeout(hardTimeout)
      window.removeEventListener("load", markReady)
    }
  }, [])

  if (phase === "done") return null
  const exiting = phase === "exiting"

  return (
    <>
      {/* Video background */}
      <motion.div
        animate={exiting ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.55, delay: 0.15, ease: "easeIn" }}
        onAnimationComplete={() => { if (exiting) setPhase("done") }}
        style={{
          position: "fixed", inset: 0,
          zIndex: 9999,
          overflow: "hidden",
          background: "#080a0e",
        }}
      >
        {showVideo && (
          <video
            autoPlay
            muted
            loop
            playsInline
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover",
            }}
          >
            <source src={isMobileRef.current ? "/loading-bg-mobile.mp4" : "/loading-bg.mp4"} type="video/mp4" />
          </video>
        )}

        {/* Dark overlay — really dark */}
        <div style={{
          position: "absolute", inset: 0,
          background: "rgba(0,0,0,0.82)",
        }} />
      </motion.div>

      {/* WEEDFORFRIENDS text */}
      <motion.div
        animate={exiting
          ? isMobileRef.current
            ? { opacity: 0, scale: 0.97 }
            : { y: exitY.current, scale: exitScale.current, opacity: 0 }
          : {}
        }
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        style={{
          position: "fixed", inset: 0,
          zIndex: 10000,
          display: "flex", alignItems: "center", justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <p
          className="font-druk-wide uppercase"
          style={{
            fontSize: isMobileRef.current ? "6.5vw" : "clamp(38px,6.2vw,82px)",
            color: "#e8e4dc",
            letterSpacing: isMobileRef.current ? "0.03em" : "0.06em",
            margin: 0, lineHeight: 1, whiteSpace: "nowrap",
          }}
        >
          {LETTERS.map((letter, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={letterCount > i ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
              transition={{ duration: 0.20, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: "inline-block" }}
            >
              {letter}
            </motion.span>
          ))}
        </p>
      </motion.div>
    </>
  )
}
