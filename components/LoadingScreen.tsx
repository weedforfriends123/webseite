"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"

const LoadingScene = dynamic(
  () => import("./LoadingScene").then(m => ({ default: m.LoadingScene })),
  { ssr: false, loading: () => null },
)

const MIN_MS = 2000    // always show at least 2 seconds
const MAX_MS = 12_000  // force-complete after 12 seconds (fallback)

export function LoadingScreen() {
  const [progress, setProgress] = useState(0)
  const [done, setDone]         = useState(false)

  useEffect(() => {
    const START   = Date.now()
    let glb       = 0   // 0–1 streaming GLB download progress
    let page      = 0   // 0 or 1 (window.load fired)
    let completed = false

    const finish = () => {
      if (completed) return
      completed = true
      setTimeout(() => setDone(true), 280)  // brief pause at 100%
    }

    const tick = () => {
      if (completed) return
      const elapsed = Math.min(1, (Date.now() - START) / MIN_MS)
      // 70% GLB · 20% page load · 10% time padding (ensures smooth progress)
      const raw = glb * 0.70 + page * 0.20 + elapsed * 0.10
      const pct = Math.min(100, Math.round(raw * 100))
      setProgress(pct)
      if (pct >= 100 && Date.now() - START >= MIN_MS) finish()
    }

    // ── Stream-track the GLB (heaviest asset at ~13 MB) ──
    fetch("/product.glb", { cache: "force-cache" })
      .then(res => {
        const total = parseInt(res.headers.get("content-length") || "") || 14_000_000
        if (!res.body) { glb = 1; tick(); return }
        const reader = res.body.getReader()
        let got = 0
        const pump = (): Promise<void> =>
          reader.read().then(({ done: d, value }) => {
            if (d) { glb = 1; tick(); return }
            got += value.byteLength
            glb  = Math.min(1, got / total)
            tick()
            return pump()
          }).catch(() => { glb = 1; tick() })
        return pump()
      })
      .catch(() => { glb = 1; tick() })

    // ── Page load event (images, fonts, etc.) ──
    const onLoad = () => { page = 1; tick() }
    if (document.readyState === "complete") onLoad()
    else window.addEventListener("load", onLoad)

    // ── Tick every 80ms to drive the time-based 10% increment ──
    const interval = setInterval(tick, 80)

    // ── Hard timeout fallback ──
    const timeout = setTimeout(() => { glb = 1; page = 1; tick() }, MAX_MS)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
      window.removeEventListener("load", onLoad)
    }
  }, [])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.025 }}
          transition={{ duration: 0.80, ease: [0.4, 0, 0.2, 1] }}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "#111212",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
          }}
        >
          {/* Logo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.webp"
            alt="WEEDFORFRIENDS"
            style={{
              width: "clamp(36px,5vw,52px)",
              filter: "brightness(0) invert(1)",
              opacity: 0.85,
              marginBottom: "clamp(28px,5vh,48px)",
            }}
          />

          {/* 3D spinning gem */}
          <div style={{
            width:  "clamp(140px,22vw,200px)",
            height: "clamp(140px,22vw,200px)",
          }}>
            <LoadingScene />
          </div>

          {/* Progress bar + percentage */}
          <div style={{ marginTop: "clamp(20px,3.5vh,36px)", width: "clamp(180px,28vw,300px)" }}>
            <div style={{
              width: "100%", height: 1,
              background: "rgba(255,255,255,0.10)",
              borderRadius: 99, overflow: "hidden", position: "relative",
            }}>
              <motion.div
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                style={{
                  position: "absolute", left: 0, top: 0,
                  height: "100%",
                  background: "rgba(232,228,220,0.80)",
                  borderRadius: 99,
                }}
              />
            </div>
            <p style={{
              marginTop: 10, textAlign: "center",
              fontSize: 10, letterSpacing: "0.28em",
              color: "rgba(232,228,220,0.30)",
              fontFamily: "var(--font-space-mono, monospace)",
              fontVariantNumeric: "tabular-nums",
            }}>
              {String(progress).padStart(3, "0")}%
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
