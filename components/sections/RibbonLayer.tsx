"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

// 4-pass serpentine — turns happen off-screen (x < 0 or x > 1440), clipped by SVG viewport
// Visible passes: L→R, R→L, L→R, R→L
const RIBBON_D =
  "M -60 780 " +
  "C 200 580, 600 400, 900 360 C 1200 320, 1420 150, 1760 30 " +           // pass 1 L→R
  "C 2050 -80, 2150 300, 1950 520 " +                                       // turn off right
  "C 1750 680, 1380 540, 1050 440 C 720 340, 420 460, 160 620 C -50 730, -200 650, -380 780 " + // pass 2 R→L
  "C -600 920, -620 560, -440 380 " +                                       // turn off left
  "C -220 180, 100 220, 400 280 C 700 340, 1000 220, 1320 160 C 1540 120, 1720 40, 1900 -20 " + // pass 3 L→R
  "C 2100 -100, 2200 250, 2000 500 " +                                      // turn off right
  "C 1800 750, 1520 580, 1200 460 C 880 340, 560 460, 240 620 C 40 730, -120 640, -300 760"     // pass 4 R→L

export function RibbonLayer({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  // Track scroll through the entire wrapped zone
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })

  // Direct 1:1 mapping — scroll paints ribbon without any lag
  const pathLen = useTransform(scrollYProgress, [0.01, 0.97], [0, 1])

  // Fade in/out at zone boundaries
  const opacity = useTransform(scrollYProgress, [0, 0.03, 0.96, 1], [0, 1, 1, 0])

  return (
    <div ref={ref} style={{ position: "relative" }}>

      {/* Fixed ribbon — one continuous path over all wrapped sections */}
      <motion.div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 3,
          opacity,
        }}
      >
        <svg
          viewBox="0 0 1440 900"
          style={{ width: "100%", height: "100%", display: "block", overflow: "hidden" }}
        >
          <motion.path
            d={RIBBON_D}
            fill="none"
            stroke="rgba(255,255,255,0.86)"
            strokeWidth="22"
            strokeLinecap="round"
            style={{ pathLength: pathLen }}
          />
        </svg>
      </motion.div>

      {children}
    </div>
  )
}
