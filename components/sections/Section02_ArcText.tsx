"use client"

import Image from "next/image"
import { motion, useReducedMotion } from "framer-motion"

// ─── TOKENS (exact match with hero) ─────────────────────────────────────────
const BG     = "#bcc0ca"
const TEXT   = "#35383f"
const INDIGO = "#222058"
const MUTED  = "rgba(53,56,63,0.48)"

// SVG circle geometry (viewBox 0 0 300 300)
const CX = 150
const CY = 150
const R_TEXT  = 118   // radius text rides on
const R_RING  = 125   // thin outer ring
const R_BADGE = 66    // indigo badge circle
// circumference of text path ≈ 2π × 118 ≈ 741.4
const CIRC = Math.round(2 * Math.PI * R_TEXT)   // 741

// Enough text to fill the circumference with textLength forcing exact fit
const CIRCLE_COPY = "GOOD VAPES ONLY  ✦  GOOD VAPES ONLY  ✦  GOOD VAPES ONLY  ✦  "

export function Section02_ArcText() {
  const noMotion = useReducedMotion()

  return (
    <section
      id="vibe"
      style={{ background: BG, position: "relative", overflow: "hidden" }}
    >
      {/* ── CONTINUATION LINE from hero scroll cue ──────────────────────── */}
      <div aria-hidden style={{
        position: "absolute", top: 0, left: "50%",
        transform: "translateX(-50%)",
        width: 1,
        height: "clamp(48px,7vh,96px)",
        background: "linear-gradient(to bottom, rgba(53,56,63,0.30), transparent)",
        zIndex: 1,
        pointerEvents: "none",
      }} />

      {/* ── MAIN CONTENT ────────────────────────────────────────────────── */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "clamp(72px,12vh,140px) clamp(20px,4vw,64px) clamp(80px,13vh,150px)",
        gap: "clamp(48px,7vh,96px)",
        position: "relative",
        zIndex: 2,
      }}>

        {/* ── ROTATING CIRCLE ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.86 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: "clamp(240px,36vw,480px)",
            height: "clamp(240px,36vw,480px)",
            position: "relative",
            flexShrink: 0,
          }}
        >
          <svg
            viewBox="0 0 300 300"
            style={{ width: "100%", height: "100%", overflow: "visible" }}
            aria-hidden
          >
            <defs>
              {/* Text path — circle at center, radius R_TEXT */}
              <path
                id="wff-circle-path"
                d={`M ${CX},${CY} m -${R_TEXT},0 a ${R_TEXT},${R_TEXT} 0 1,1 ${R_TEXT * 2},0 a ${R_TEXT},${R_TEXT} 0 1,1 -${R_TEXT * 2},0`}
              />
            </defs>

            {/* Outer decorative ring */}
            <circle
              cx={CX} cy={CY} r={R_RING}
              fill="none"
              stroke={`rgba(53,56,63,0.12)`}
              strokeWidth="0.75"
            />

            {/* Inner decorative ring (outside badge) */}
            <circle
              cx={CX} cy={CY} r={R_BADGE + 14}
              fill="none"
              stroke={`rgba(53,56,63,0.08)`}
              strokeWidth="0.5"
            />

            {/* Rotating ring (no text) */}
            <g
              className={noMotion ? undefined : "wff-spin-22"}
              style={{ transformOrigin: `${CX}px ${CY}px` }}
            />

            {/* Badge background circle */}
            <circle cx={CX} cy={CY} r={R_BADGE} fill={INDIGO} />

            {/* Badge inner ring */}
            <circle
              cx={CX} cy={CY} r={R_BADGE - 6}
              fill="none"
              stroke="rgba(53,56,63,0.14)"
              strokeWidth="0.8"
            />

            {/* WFF logo image inside badge via SVG <image> */}
            <image
              href="/logo.webp"
              x={CX - 30} y={CY - 30}
              width="60" height="60"
              style={{ filter: "brightness(0) invert(1)", opacity: 0.88 }}
            />
          </svg>
        </motion.div>

      </div>

      {/* ── AMBIENT GLOW (mirrors hero) ─────────────────────────────────── */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(122,107,145,0.18) 0%, transparent 65%)",
      }} />

      {/* ── SPIN KEYFRAME + reduced-motion ──────────────────────────────── */}
      <style>{`
        .wff-spin-22 {
          animation: wff-circle-spin 22s linear infinite;
        }
        @keyframes wff-circle-spin {
          from { transform: rotate(0deg);   }
          to   { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .wff-spin-22 { animation: none !important; }
        }
      `}</style>
    </section>
  )
}
