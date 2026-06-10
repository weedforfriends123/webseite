"use client"

import { motion } from "framer-motion"

// ── Whole lemon ───────────────────────────────────────────────────────────────
export function LemonWhole({ size = 140, rotate = -18, style }: {
  size?:   number
  rotate?: number
  style?:  React.CSSProperties
}) {
  const h = size * 0.74
  return (
    <svg
      width={size} height={h}
      viewBox="0 0 160 118"
      style={{ display: "block", filter: "drop-shadow(0 18px 36px rgba(14,12,9,0.38)) drop-shadow(0 6px 12px rgba(14,12,9,0.22))", transform: `rotate(${rotate}deg)`, ...style }}
    >
      <defs>
        {/* Main body gradient — lit from upper-left */}
        <radialGradient id="lw-body" cx="32%" cy="26%" r="72%" gradientUnits="objectBoundingBox">
          <stop offset="0%"   stopColor="#FFFDE7"/>
          <stop offset="18%"  stopColor="#FFF9C4"/>
          <stop offset="42%"  stopColor="#FFF176"/>
          <stop offset="68%"  stopColor="#FFEE58"/>
          <stop offset="85%"  stopColor="#FDD835"/>
          <stop offset="100%" stopColor="#F9A825"/>
        </radialGradient>

        {/* Darker underside gradient */}
        <linearGradient id="lw-under" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="rgba(0,0,0,0)"/>
          <stop offset="60%"  stopColor="rgba(0,0,0,0)"/>
          <stop offset="100%" stopColor="rgba(0,0,0,0.28)"/>
        </linearGradient>

        {/* Ambient occlusion rim */}
        <radialGradient id="lw-ao" cx="50%" cy="50%" r="50%">
          <stop offset="62%"  stopColor="rgba(0,0,0,0)"/>
          <stop offset="100%" stopColor="rgba(0,0,0,0.30)"/>
        </radialGradient>

        {/* Specular gloss */}
        <radialGradient id="lw-gloss" cx="34%" cy="24%" r="34%">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.72)"/>
          <stop offset="55%"  stopColor="rgba(255,255,255,0.18)"/>
          <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
        </radialGradient>

        {/* Skin texture — turbulence displacement */}
        <filter id="lw-skin" x="-2%" y="-2%" width="104%" height="104%" color-interpolation-filters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="1.8 1.1" numOctaves="6" seed="7" result="noise"/>
          <feColorMatrix type="saturate" values="0" in="noise" result="grey"/>
          <feColorMatrix type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.10 -0.02"
            in="grey" result="bump"/>
          <feComposite in="bump" in2="SourceGraphic" operator="in" result="masked"/>
          <feBlend in="SourceGraphic" in2="masked" mode="multiply" result="textured"/>
          <feGaussianBlur stdDeviation="0.4" in="textured"/>
        </filter>

        {/* Stem tip gradient */}
        <radialGradient id="lw-stem" cx="60%" cy="40%" r="70%">
          <stop offset="0%"   stopColor="#C5E067"/>
          <stop offset="100%" stopColor="#7BAD17"/>
        </radialGradient>

        {/* Blossom tip gradient */}
        <radialGradient id="lw-tip" cx="40%" cy="35%" r="70%">
          <stop offset="0%"   stopColor="#FFF9C4"/>
          <stop offset="100%" stopColor="#F4C430"/>
        </radialGradient>
      </defs>

      {/* ── Stem nub (left) ── */}
      <ellipse cx="11" cy="59" rx="10" ry="7"  fill="url(#lw-stem)"  transform="rotate(-8 11 59)"/>
      <ellipse cx=" 8" cy="59" rx=" 6" ry="4"  fill="#8DC63F"         transform="rotate(-8  8 59)"/>
      {/* tiny stem */}
      <line x1="5" y1="55" x2="-1" y2="48" stroke="#5A7A1A" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="4" y1="58" x2="-3" y2="54" stroke="#6A8A20" strokeWidth="1.5" strokeLinecap="round"/>

      {/* ── Blossom nub (right) ── */}
      <ellipse cx="149" cy="59" rx="9"  ry="6"  fill="url(#lw-tip)"   transform="rotate(6 149 59)"/>

      {/* ── Main body ── */}
      <path
        d="M17 59 C17 30 42 12 80 12 C118 12 143 30 143 59 C143 88 118 106 80 106 C42 106 17 88 17 59 Z"
        fill="url(#lw-body)"
        filter="url(#lw-skin)"
      />

      {/* Shadow underside */}
      <path
        d="M17 59 C17 30 42 12 80 12 C118 12 143 30 143 59 C143 88 118 106 80 106 C42 106 17 88 17 59 Z"
        fill="url(#lw-under)"
      />

      {/* Rim ambient occlusion */}
      <path
        d="M17 59 C17 30 42 12 80 12 C118 12 143 30 143 59 C143 88 118 106 80 106 C42 106 17 88 17 59 Z"
        fill="url(#lw-ao)"
      />

      {/* Specular highlight */}
      <ellipse cx="58" cy="32" rx="26" ry="13" fill="url(#lw-gloss)"  transform="rotate(-28 58 32)"/>

      {/* Secondary softer highlight */}
      <ellipse cx="48" cy="42" rx="10" ry="5" fill="rgba(255,255,255,0.22)" transform="rotate(-20 48 42)"/>
    </svg>
  )
}

// ── Half lemon (cross-section) ────────────────────────────────────────────────
export function LemonHalf({ size = 120, rotate = 12, style }: {
  size?:   number
  rotate?: number
  style?:  React.CSSProperties
}) {
  const cx = 60, cy = 60, r = 52

  // 8 segments — divide circle into 8 slices
  const SEG = 8
  const segPaths = Array.from({ length: SEG }, (_, i) => {
    const a1 = ((i     / SEG) * 360 - 90) * (Math.PI / 180)
    const a2 = (((i+1) / SEG) * 360 - 90) * (Math.PI / 180)
    const ir = 9   // inner radius (pith)
    const or = r - 8  // flesh radius (inside rind)
    return {
      d: `M ${cx + ir*Math.cos(a1)} ${cy + ir*Math.sin(a1)}
          L ${cx + or*Math.cos(a1)} ${cy + or*Math.sin(a1)}
          A ${or} ${or} 0 0 1 ${cx + or*Math.cos(a2)} ${cy + or*Math.sin(a2)}
          L ${cx + ir*Math.cos(a2)} ${cy + ir*Math.sin(a2)}
          A ${ir} ${ir} 0 0 0 ${cx + ir*Math.cos(a1)} ${cy + ir*Math.sin(a1)} Z`,
      midAngle: ((a1 + a2) / 2),
    }
  })

  return (
    <svg
      width={size} height={size}
      viewBox="0 0 120 120"
      style={{ display: "block", filter: "drop-shadow(0 14px 28px rgba(14,12,9,0.40)) drop-shadow(0 4px 10px rgba(14,12,9,0.24))", transform: `rotate(${rotate}deg)`, ...style }}
    >
      <defs>
        {/* Rind outer gradient */}
        <radialGradient id="lh-rind" cx="35%" cy="28%" r="72%">
          <stop offset="0%"   stopColor="#FFFDE7"/>
          <stop offset="40%"  stopColor="#FFF176"/>
          <stop offset="75%"  stopColor="#FFEE58"/>
          <stop offset="100%" stopColor="#F9A825"/>
        </radialGradient>

        {/* Flesh gradient per segment — lit from upper-left */}
        <radialGradient id="lh-flesh" cx="30%" cy="25%" r="80%">
          <stop offset="0%"   stopColor="#FFFCE0"/>
          <stop offset="35%"  stopColor="#FFFAA0"/>
          <stop offset="70%"  stopColor="#FFF176"/>
          <stop offset="100%" stopColor="#FFE57F"/>
        </radialGradient>

        {/* Pith center */}
        <radialGradient id="lh-pith" cx="40%" cy="38%" r="65%">
          <stop offset="0%"   stopColor="#FFFFFF"/>
          <stop offset="60%"  stopColor="#F5F5DC"/>
          <stop offset="100%" stopColor="#E8DCC8"/>
        </radialGradient>

        {/* Overall gloss */}
        <radialGradient id="lh-gloss" cx="33%" cy="22%" r="40%">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.68)"/>
          <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
        </radialGradient>

        {/* Wet sheen across flesh */}
        <radialGradient id="lh-wet" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.12)"/>
          <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
        </radialGradient>

        {/* Rind shadow inner edge */}
        <radialGradient id="lh-rind-inner" cx="50%" cy="50%" r="50%">
          <stop offset="70%"  stopColor="rgba(0,0,0,0)"/>
          <stop offset="100%" stopColor="rgba(0,0,0,0.18)"/>
        </radialGradient>

        <filter id="lh-skin" x="-2%" y="-2%" width="104%" height="104%" color-interpolation-filters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="2.2 1.6" numOctaves="4" seed="11" result="noise"/>
          <feColorMatrix type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.06 0"
            in="noise" result="bump"/>
          <feComposite in="bump" in2="SourceGraphic" operator="in" result="masked"/>
          <feBlend in="SourceGraphic" in2="masked" mode="multiply"/>
        </filter>
      </defs>

      {/* ── Outer rind circle ── */}
      <circle cx={cx} cy={cy} r={r}   fill="url(#lh-rind)" filter="url(#lh-skin)"/>
      <circle cx={cx} cy={cy} r={r}   fill="url(#lh-rind-inner)"/>

      {/* ── White pith ring ── */}
      <circle cx={cx} cy={cy} r={r-4} fill="#F5F0E0"/>
      <circle cx={cx} cy={cy} r={r-7} fill="#FFFDE7"/>

      {/* ── Flesh segments ── */}
      {segPaths.map(({ d, midAngle }, i) => (
        <g key={i}>
          <path d={d} fill="url(#lh-flesh)" opacity={0.92 + (i % 2) * 0.05}/>
          {/* Juice vesicle dots in each segment */}
          {Array.from({ length: 5 }, (_, j) => {
            const dist = 16 + j * 5
            const ang  = midAngle + (j - 2) * 0.08
            return (
              <ellipse
                key={j}
                cx={cx + dist * Math.cos(ang)}
                cy={cy + dist * Math.sin(ang)}
                rx={1.4} ry={1.0}
                fill="rgba(255,240,80,0.55)"
                transform={`rotate(${midAngle * 180/Math.PI} ${cx + dist*Math.cos(ang)} ${cy + dist*Math.sin(ang)})`}
              />
            )
          })}
        </g>
      ))}

      {/* ── Segment membrane lines ── */}
      {Array.from({ length: SEG }, (_, i) => {
        const a = ((i / SEG) * 360 - 90) * (Math.PI / 180)
        return (
          <line
            key={i}
            x1={cx + 9  * Math.cos(a)} y1={cy + 9  * Math.sin(a)}
            x2={cx + (r-8) * Math.cos(a)} y2={cy + (r-8) * Math.sin(a)}
            stroke="rgba(255,255,255,0.75)" strokeWidth="1.2"
          />
        )
      })}

      {/* ── Center pith dot ── */}
      <circle cx={cx} cy={cy} r={9}  fill="url(#lh-pith)"/>
      <circle cx={cx} cy={cy} r={4}  fill="rgba(255,255,255,0.6)"/>
      <circle cx={cx} cy={cy} r={2}  fill="rgba(255,255,255,0.9)"/>

      {/* ── Wet flesh sheen ── */}
      <circle cx={cx} cy={cy} r={r-8} fill="url(#lh-wet)"/>

      {/* ── Top gloss (rind) ── */}
      <ellipse cx={45} cy={32} rx={16} ry={8} fill="url(#lh-gloss)" transform="rotate(-30 45 32)"/>
    </svg>
  )
}
