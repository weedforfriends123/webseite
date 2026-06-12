"use client"

import { useRef, useEffect } from "react"
import { useScroll, useTransform, useSpring } from "framer-motion"

const BG_BAND  = "#35383f"
const TEXT_CLR = "#bcc0ca"
const COPY     = "BETTER VIBES.  ·  GOOD FRIENDS.  ·  "
const REPS     = 14

const ARC_D    = "M -200 460 A 3500 3500 0 0 1 1640 80"
const FULL_TXT = Array.from({ length: REPS }, () => COPY).join("")

export function ScrollBand() {
  // scrollYProgress = 0 (page top) → 1 (page bottom / end of Section 2)
  const { scrollYProgress } = useScroll()
  const textPathRef = useRef<SVGTextPathElement>(null)

  const rawOffset = useTransform(scrollYProgress, [0, 1], [0, -420])
  const offset = useSpring(rawOffset, { stiffness: 60, damping: 20, mass: 0.8 })

  useEffect(() => {
    let raf = 0
    const unsub = offset.on("change", (v) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        textPathRef.current?.setAttribute("startOffset", `${v}%`)
      })
    })
    return () => { unsub(); cancelAnimationFrame(raf) }
  }, [offset])

  return (
    <div
      style={{
        position: "relative",
        overflow: "visible",
        zIndex: 20,
        lineHeight: 0,
        marginTop:    "clamp(-200px,-13vw,-36px)",
        marginBottom: "clamp(-240px,-16vw,-44px)",
      }}
    >
      <svg
        viewBox="0 0 1440 500"
        width="100%"
        height="auto"
        style={{ display: "block", overflow: "visible" }}
      >
        <defs>
          <path id="wff-diag-arc" d={ARC_D} />
        </defs>

        <use
          href="#wff-diag-arc"
          fill="none"
          stroke={BG_BAND}
          strokeWidth="140"
        />

        <text
          className="font-druk-wide"
          fill={TEXT_CLR}
          fontSize="54"
          letterSpacing="-0.5"
          dominantBaseline="middle"
        >
          <textPath
            ref={textPathRef}
            href="#wff-diag-arc"
            startOffset="0%"
          >
            {FULL_TXT}
          </textPath>
        </text>
      </svg>

    </div>
  )
}
