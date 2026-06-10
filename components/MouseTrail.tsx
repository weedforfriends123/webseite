"use client"

import { useEffect, useRef } from "react"

export function MouseTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const isTouch = window.matchMedia("(hover: none)").matches
                 || window.matchMedia("(pointer: coarse)").matches
                 || ("ontouchstart" in window)
                 || navigator.maxTouchPoints > 0
    if (isTouch) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let W = window.innerWidth
    let H = window.innerHeight
    canvas.width = W
    canvas.height = H

    const onResize = () => {
      W = window.innerWidth
      H = window.innerHeight
      canvas.width = W
      canvas.height = H
    }
    window.addEventListener("resize", onResize)

    const MAX = 32
    const trail: { x: number; y: number }[] = []
    let hasMouse = false

    const onMove = (e: MouseEvent) => {
      hasMouse = true
      trail.push({ x: e.clientX, y: e.clientY })
      if (trail.length > MAX) trail.shift()
    }
    window.addEventListener("mousemove", onMove, { passive: true })

    type Spark = { x: number; y: number; vx: number; vy: number; life: number; r: number }
    const sparks: Spark[] = []
    let prevX = 0, prevY = 0, frame = 0
    let running = true

    const tick = () => {
      if (!running) return
      ctx.clearRect(0, 0, W, H)

      if (hasMouse && trail.length > 1) {
        const n = trail.length

        for (let i = 0; i < n; i++) {
          const t = i / (n - 1)
          const { x, y } = trail[i]
          const radius = t * 8 + 0.8
          const alpha  = t * 0.85

          const g = ctx.createRadialGradient(x, y, 0, x, y, radius)
          g.addColorStop(0,   `rgba(160,186,135,${alpha})`)
          g.addColorStop(0.5, `rgba(160,186,135,${alpha * 0.55})`)
          g.addColorStop(1,   `rgba(160,186,135,0)`)
          ctx.beginPath()
          ctx.arc(x, y, radius, 0, Math.PI * 2)
          ctx.fillStyle = g
          ctx.fill()

          if (i % 4 === 0 && t > 0.5) {
            ctx.beginPath()
            ctx.arc(x, y, radius * 0.28, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(53,56,63,${alpha * 0.75})`
            ctx.fill()
          }
        }

        const head = trail[n - 1]
        if (head && frame % 2 === 0) {
          const speed = Math.hypot(head.x - prevX, head.y - prevY)
          if (speed > 3) {
            const count = Math.min(Math.ceil(speed / 10), 3)
            for (let k = 0; k < count; k++) {
              sparks.push({
                x:   head.x + (Math.random() - 0.5) * 10,
                y:   head.y + (Math.random() - 0.5) * 10,
                vx:  (Math.random() - 0.5) * 2.2,
                vy:  (Math.random() - 0.5) * 2.2 - 0.5,
                life: 0.7 + Math.random() * 0.3,
                r:   Math.random() * 2.8 + 0.8,
              })
            }
          }
          prevX = head.x
          prevY = head.y
        }
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i]
        s.x  += s.vx
        s.y  += s.vy
        s.vy += 0.04
        s.vx *= 0.97
        s.life -= 0.028
        if (s.life <= 0) { sparks.splice(i, 1); continue }
        const r = s.r * s.life
        ctx.beginPath()
        ctx.arc(s.x, s.y, Math.max(r, 0.1), 0, Math.PI * 2)
        ctx.fillStyle = `rgba(160,186,135,${s.life * 0.6})`
        ctx.fill()
      }

      frame++
      requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)

    return () => {
      running = false
      window.removeEventListener("resize", onResize)
      window.removeEventListener("mousemove", onMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9999 }}
    />
  )
}
