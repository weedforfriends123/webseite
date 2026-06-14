"use client"

import { useEffect } from "react"

// Exposed so FrameScrubber can read the current scroll position
export const smoothScrollTarget = { current: 0 }

export function SmoothScroll() {
  useEffect(() => {
    const sync = () => { smoothScrollTarget.current = window.scrollY }
    sync()
    window.addEventListener("scroll", sync, { passive: true })
    return () => window.removeEventListener("scroll", sync)
  }, [])

  return null
}
