"use client"

import { useEffect, useRef } from "react"

// Progressive-enhancement haptics for scroll text-stops.
// Fires once per unique stop index. Safe no-op when vibration is unavailable.
export function useStopHaptics(activeStop: number | null) {
  const prevRef = useRef<number | null>(null)

  useEffect(() => {
    if (activeStop === null) return
    if (prevRef.current === activeStop) return
    prevRef.current = activeStop

    // Standard Vibration API (Android, some PWAs)
    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      navigator.vibrate([8])
      return
    }

    // Capacitor Haptics (if running in a native WebView)
    if (typeof window !== "undefined") {
      const cap = (window as unknown as Record<string, unknown>)["Capacitor"]
      if (cap && typeof (cap as Record<string, unknown>)["Plugins"] === "object") {
        const haptics = ((cap as Record<string, unknown>)["Plugins"] as Record<string, unknown>)["Haptics"]
        if (haptics && typeof (haptics as Record<string, unknown>)["impact"] === "function") {
          ;(haptics as { impact: (opts: Record<string, string>) => Promise<void> })
            .impact({ style: "LIGHT" })
            .catch(() => {})
        }
      }
    }
  }, [activeStop])
}
