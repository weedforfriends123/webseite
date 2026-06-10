"use client"

import { useRef, useEffect } from "react"

const SPOTLIGHT_R = 150 // spotlight radius px

export function PodBaggie() {
  const wrapRef    = useRef<HTMLDivElement>(null)
  const revealRef  = useRef<HTMLDivElement>(null)
  const ripplesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap    = wrapRef.current
    const reveal  = revealRef.current
    const ripples = ripplesRef.current
    if (!wrap || !reveal || !ripples) return

    let lx = 0, ly = 0
    let prevX = 0, prevY = 0, prevT = performance.now()
    let stillTimer: ReturnType<typeof setTimeout> | null = null
    let inside = false

    const applyMask = (x: number, y: number) => {
      const v = `radial-gradient(circle ${SPOTLIGHT_R}px at ${x}px ${y}px, rgba(0,0,0,1) 28%, rgba(0,0,0,0.5) 60%, transparent 100%)`
      reveal.style.maskImage = v
      ;(reveal.style as CSSStyleDeclaration & { webkitMaskImage: string }).webkitMaskImage = v
    }

    const hideMask = () => {
      const v = "radial-gradient(circle 0px at -999px -999px, black 0%, transparent 100%)"
      reveal.style.maskImage = v
      ;(reveal.style as CSSStyleDeclaration & { webkitMaskImage: string }).webkitMaskImage = v
    }

    const spawnRipple = (x: number, y: number) => {
      for (let i = 0; i < 2; i++) {
        const el = document.createElement("span")
        const size = 90 + i * 60
        el.style.cssText = [
          "position:absolute",
          `left:${x}px`,
          `top:${y}px`,
          `width:${size}px`,
          `height:${size}px`,
          "border-radius:50%",
          `border:1.5px solid rgba(255,255,200,${0.55 - i * 0.2})`,
          "transform:translate(-50%,-50%) scale(0.1)",
          "pointer-events:none",
          `animation:pod-ripple ${0.7 + i * 0.2}s ease-out ${i * 0.1}s forwards`,
        ].join(";")
        ripples.appendChild(el)
        el.addEventListener("animationend", () => el.remove(), { once: true })
      }
    }

    const onMove = (e: MouseEvent) => {
      const rect = wrap.getBoundingClientRect()
      const x    = e.clientX - rect.left
      const y    = e.clientY - rect.top
      lx = x; ly = y
      inside = true

      applyMask(x, y)

      const t   = performance.now()
      const dt  = Math.max(t - prevT, 1)
      prevX = x; prevY = y; prevT = t

      if (stillTimer) clearTimeout(stillTimer)
      stillTimer = setTimeout(() => {
        if (inside) spawnRipple(lx, ly)
      }, 240)
    }

    const onLeave = () => {
      inside = false
      hideMask()
      if (stillTimer) clearTimeout(stillTimer)
    }

    hideMask()
    wrap.addEventListener("mousemove", onMove, { passive: true })
    wrap.addEventListener("mouseleave", onLeave, { passive: true })

    return () => {
      wrap.removeEventListener("mousemove", onMove)
      wrap.removeEventListener("mouseleave", onLeave)
      if (stillTimer) clearTimeout(stillTimer)
    }
  }, [])

  return (
    <div
      ref={wrapRef}
      className="relative select-none"
      style={{
        width:    "clamp(200px, 22vw, 320px)",
        cursor:   "crosshair",
      }}
    >
      {/* ── Baggie (always visible) ── */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/baggie-amnesia.png"
        alt=""
        draggable={false}
        style={{
          width:      "100%",
          height:     "auto",
          display:    "block",
          mixBlendMode: "multiply",  // white bg disappears on cream/light backgrounds
          userSelect: "none",
          pointerEvents: "none",
        }}
      />

      {/* ── Pod device — hidden until cursor spotlight ── */}
      <div
        ref={revealRef}
        className="absolute inset-0 flex items-center justify-center"
        style={{
          zIndex:      2,
          padding:     "18% 28%",
          maskImage:   "radial-gradient(circle 0px at -999px -999px, black 0%, transparent 100%)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/pod-device.png"
          alt=""
          draggable={false}
          style={{
            width:      "100%",
            height:     "100%",
            objectFit:  "contain",
            userSelect: "none",
            filter:     "brightness(1.08)",
          }}
        />
      </div>

      {/* ── Ripple container ── */}
      <div
        ref={ripplesRef}
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ zIndex: 3 }}
      />
    </div>
  )
}
