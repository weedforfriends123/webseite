"use client"

import { useEffect, useState } from "react"

// Renders a full-screen cover on SSR/initial paint, then removes itself through
// React state (not direct DOM manipulation) so React re-renders can never re-add it.
export function PreLoader() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (mounted) return null
  return (
    <div
      suppressHydrationWarning
      style={{ position: "fixed", inset: 0, background: "#000", zIndex: 10001 }}
    />
  )
}
