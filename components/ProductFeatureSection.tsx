"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, useMotionTemplate } from "framer-motion"

export function ProductFeatureSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  const bgX     = useTransform(scrollYProgress, [0, 1], [8, 92])
  const bgPos   = useMotionTemplate`${bgX}% 22%`
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.0])

  return (
    <div ref={containerRef} style={{ height: "400vh" }}>
      <div className="sticky top-0 w-full overflow-hidden" style={{ height: "100svh" }}>

        {/* Background photo */}
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage:    "url(/bg-rein.jpg)",
            backgroundSize:     "cover",
            backgroundPosition: bgPos,
            backgroundRepeat:   "no-repeat",
            scale:              bgScale,
            transformOrigin:    "center center",
            filter:             "saturate(0) blur(4px) brightness(0.52)",
          }}
        />

        {/* Warm dark overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "linear-gradient(165deg, rgba(53,56,63,0.14) 0%, rgba(28,24,18,0.74) 58%, rgba(10,8,5,0.92) 100%)",
          zIndex: 1,
        }} />

        {/* Radial center clear */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 50% 58% at 50% 44%, rgba(53,56,63,0.06) 0%, rgba(10,8,5,0.28) 100%)",
          zIndex: 2,
        }} />

        {/* Top fade from hero cream to dark */}
        <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{
          height:     "22%",
          background: "linear-gradient(to bottom, #35383f 0%, rgba(53,56,63,0) 100%)",
          zIndex:     3,
        }} />

        {/* Grain */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.045]" style={{ zIndex: 4 }} aria-hidden>
          <filter id="pf-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="4" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#pf-grain)" />
        </svg>
      </div>
    </div>
  )
}
