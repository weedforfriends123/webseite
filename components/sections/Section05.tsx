"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion"

const BG = "#bcc0ca"

const RIBBON_D =
  "M 1920 50 " +
  "C 1500 10, 300 220, 60 400 " +
  "C -180 580, -500 480, -500 560 " +
  "C -500 640, -180 720, 60 720 " +
  "C 300 720, 1100 500, 1440 560 " +
  "C 1780 620, 2000 660, 2000 780 " +
  "C 2000 900, 1780 940, 1440 880 " +
  "C 1100 820, 300 900, -60 880"

export function Section05() {
  const sectionRef   = useRef<HTMLElement>(null)
  const videoRef     = useRef<HTMLVideoElement>(null)
  const pauseTimer   = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const prevProgress = useRef(0)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end end"],
  })

  const pathLen = useTransform(scrollYProgress, [0, 0.96], [0, 1])

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const video = videoRef.current
    if (!video || !video.duration) return

    const target = v * video.duration
    const delta  = v - prevProgress.current
    prevProgress.current = v

    // If scroll jumped far (e.g. fast page load), hard-seek first
    if (Math.abs(video.currentTime - target) > 0.4) {
      video.currentTime = target
    }

    // Let the video play naturally while scrolling
    if (delta !== 0) {
      video.playbackRate = 1
      video.play().catch(() => {})
    }

    // Pause ~120 ms after scroll stops
    clearTimeout(pauseTimer.current)
    pauseTimer.current = setTimeout(() => video.pause(), 120)
  })

  return (
    <section ref={sectionRef} style={{ background: BG, minHeight: "250vh", position: "relative" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", zIndex: 10 }}>

        <svg
          viewBox="0 0 1440 900"
          overflow="hidden"
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            display: "block", pointerEvents: "none", zIndex: 1,
          }}
        >
          <motion.path
            d={RIBBON_D}
            fill="none"
            stroke="rgba(255,255,255,0.55)"
            strokeWidth="2.5"
            strokeLinecap="butt"
            style={{ pathLength: pathLen }}
          />
        </svg>

        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          pointerEvents: "none", zIndex: 5,
        }}>
          <video
            ref={videoRef}
            src="/product-anim.mp4"
            muted
            playsInline
            preload="auto"
            style={{
              height: "100vh",
              width: "auto",
              display: "block",
              mixBlendMode: "multiply",
            }}
          />
        </div>

      </div>
    </section>
  )
}
