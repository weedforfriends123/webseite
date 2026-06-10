"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, useMotionTemplate } from "framer-motion"

export function BeyondSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  const bgX   = useTransform(scrollYProgress, [0, 1], [8, 92])
  const bgPos = useMotionTemplate`${bgX}% 22%`
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.0])

  return (
    <div ref={containerRef} style={{ height: "160vh" }}>
      <div
        className="sticky top-0 w-full overflow-hidden"
        style={{ height: "100svh" }}
      >
        {/* ── Background photo — pans L→R on scroll ─────────────────────── */}
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: "url(/bg-rein.jpg)",
            backgroundSize: "cover",
            backgroundPosition: bgPos,
            backgroundRepeat: "no-repeat",
            scale: bgScale,
            transformOrigin: "center center",
            // Heavy desaturate + blur: photo text/branding disappears, only silhouette remains
            filter: "saturate(0) blur(4px) brightness(0.55)",
          }}
        />

        {/* ── Warm cream tint — WFF palette over the silhouette ─────────── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            // Warm cream from top, deep dark at bottom — matches WFF section flow
            background:
              "linear-gradient(165deg, rgba(53,56,63,0.18) 0%, rgba(28,24,18,0.72) 60%, rgba(14,10,6,0.88) 100%)",
            zIndex: 1,
          }}
        />

        {/* ── Radial center clear — product sits in a lighter zone ─────── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 55% 60% at 50% 44%, rgba(53,56,63,0.06) 0%, rgba(14,10,6,0.30) 100%)",
            zIndex: 2,
          }}
        />


        {/* Top fade to match previous section bg */}
        <div
          className="absolute top-0 left-0 right-0 pointer-events-none"
          style={{
            height: "18%",
            background: "linear-gradient(to top, transparent, #28251f)",
            zIndex: 2,
          }}
        />

        {/* ── Grain ──────────────────────────────────────────────────────── */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.05]"
          style={{ zIndex: 3 }}
          aria-hidden
        >
          <filter id="beyond-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.66" numOctaves="4" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#beyond-grain)" />
        </svg>
      </div>
    </div>
  )
}
