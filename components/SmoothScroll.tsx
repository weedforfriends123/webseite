"use client"

import { useEffect, useRef } from "react"
import { useAnimationFrame } from "framer-motion"

// Spring constants — smooth/liquid feel, settles in ~280ms
const STIFFNESS = 95
const DAMPING   = 20
const MASS      = 0.9

// Exposed so other components can read the pre-spring scroll target
export const smoothScrollTarget = { current: 0 }

export function SmoothScroll() {
  const targetRef  = useRef(0)
  const currentRef = useRef(0)
  const velRef     = useRef(0)
  const oursRef    = useRef(0)   // last scrollY we wrote via scrollTo

  useEffect(() => {
    const y0 = window.scrollY
    targetRef.current = currentRef.current = oursRef.current = smoothScrollTarget.current = y0

    const onWheel = (e: WheelEvent) => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      targetRef.current = Math.max(0, Math.min(max, targetRef.current + e.deltaY))
      smoothScrollTarget.current = targetRef.current
    }

    // Detect external scrolls (touch, keyboard, programmatic Link clicks) and snap
    const onScroll = () => {
      if (Math.abs(window.scrollY - oursRef.current) > 10) {
        targetRef.current  = window.scrollY
        currentRef.current = window.scrollY
        velRef.current     = 0
        oursRef.current    = window.scrollY
      }
    }

    window.addEventListener("wheel",  onWheel,  { passive: true })
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("wheel",  onWheel)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  useAnimationFrame((_, delta) => {
    const t = targetRef.current
    let c   = currentRef.current
    let v   = velRef.current

    // Skip when at rest
    if (Math.abs(t - c) < 0.05 && Math.abs(v) < 0.1) return

    const dt    = Math.min(delta, 50) / 1000          // seconds, capped
    const force = ((t - c) * STIFFNESS - v * DAMPING) / MASS
    v += force * dt
    c += v * dt

    // Snap when settled
    if (Math.abs(t - c) < 0.05 && Math.abs(v) < 0.1) { c = t; v = 0 }

    currentRef.current = c
    velRef.current     = v

    if (Math.abs(c - window.scrollY) > 0.1) {
      oursRef.current = c
      window.scrollTo(0, c)
    }
  })

  return null
}
