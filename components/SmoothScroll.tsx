"use client"

import { useEffect, useRef } from "react"
import { useAnimationFrame } from "framer-motion"

// Spring constants
const STIFFNESS = 120
const DAMPING   = 22
const MASS      = 0.85

// Exposed so FrameScrubber can read the pre-spring wheel target
export const smoothScrollTarget = { current: 0 }

export function SmoothScroll() {
  const isTouchRef  = useRef(false)
  const targetRef   = useRef(0)
  const currentRef  = useRef(0)
  const velRef      = useRef(0)
  const oursRef     = useRef(0)

  useEffect(() => {
    // Touch-primary devices (phones/tablets): native scroll is already smooth.
    // Our window.scrollTo() calls would fight the browser's momentum scroll → jank.
    isTouchRef.current = window.matchMedia("(hover: none) and (pointer: coarse)").matches

    const y0 = window.scrollY
    targetRef.current = currentRef.current = oursRef.current = smoothScrollTarget.current = y0

    if (isTouchRef.current) {
      // Just keep smoothScrollTarget synced so FrameScrubber works on mobile too
      const sync = () => { smoothScrollTarget.current = window.scrollY }
      window.addEventListener("scroll", sync, { passive: true })
      return () => window.removeEventListener("scroll", sync)
    }

    // Desktop: spring-driven smooth scroll via wheel
    const onWheel = (e: WheelEvent) => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      targetRef.current = Math.max(0, Math.min(max, targetRef.current + e.deltaY))
      smoothScrollTarget.current = targetRef.current
    }

    // Keyboard / programmatic navigation: snap spring to current position
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
    if (isTouchRef.current) return  // mobile: browser handles scroll, no interference

    const t = targetRef.current
    let c   = currentRef.current
    let v   = velRef.current

    if (Math.abs(t - c) < 0.05 && Math.abs(v) < 0.1) return

    const dt    = Math.min(delta, 50) / 1000
    const force = ((t - c) * STIFFNESS - v * DAMPING) / MASS
    v += force * dt
    c += v * dt

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
