"use client"

import { motion } from "framer-motion"
import { MoreButton } from "@/components/ui/more-button"

const LIGHT = "#d6ecc2"
const DARK  = "#35383f"
const CREAM = "#35383f"
const SAGE  = "#a0ba87"

// Arc ring math:
// Upward arc: M -200,700 A 1100,1100 0 0,0 1640,700
// Circle center: (720, 1303), radius 1100
// Arc peak at y = 1303 - 1100 = 203
// Ring stroke 180px → outer edge at y ≈ 113, inner edge at y ≈ 293 at center
// Text path at r=1040 → center circle y = 700 + √(1040²-920²) = 700 + 480 = 1180
// Text top at y = 1180 - 1040 = 140 ← rides along upper surface of ring

const RING_PATH = "M -200,700 A 1100,1100 0 0,0 1640,700"
const TEXT_PATH = "M -200,700 A 1040,1040 0 0,0 1640,700"

const RING_TEXT =
  "NUR DAS BESTE · NUR DAS BESTE · NUR DAS BESTE · NUR DAS BESTE · "

export function ArcTextSection() {
  return (
    <section style={{ background: LIGHT, overflow: "hidden" }}>

      {/* Arc ring band */}
      <div
        style={{
          position: "relative",
          height: "clamp(400px, 56vh, 580px)",
          overflow: "hidden",
          background: LIGHT,
        }}
      >
        <svg
          viewBox="0 0 1440 700"
          preserveAspectRatio="xMidYMid slice"
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
          aria-hidden
        >
          <defs>
            <path id="wff-ring" d={RING_PATH} />
            <path id="wff-ring-text" d={TEXT_PATH} />
          </defs>

          {/* Thick dark arc band (the ring rim) */}
          <use
            href="#wff-ring"
            fill="none"
            stroke={DARK}
            strokeWidth="180"
            strokeLinecap="butt"
          />

          {/* Cream text riding the upper outer surface of the ring */}
          <text
            fill={CREAM}
            fontSize="64"
            fontWeight="900"
            fontFamily="Adieu, sans-serif"
            letterSpacing="8"
          >
            <textPath href="#wff-ring-text" startOffset="2%">
              {RING_TEXT}
            </textPath>
          </text>
        </svg>
      </div>

      {/* Mission text below the ring */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          textAlign: "center",
          padding:
            "clamp(56px,9vh,120px) clamp(20px,7vw,120px) clamp(64px,10vh,140px)",
        }}
      >
        <p
          className="font-mono uppercase"
          style={{
            fontSize: "clamp(8px,0.62vw,10px)",
            letterSpacing: "0.44em",
            color: "rgba(53,56,63,0.36)",
            marginBottom: "clamp(22px,3.5vh,44px)",
          }}
        >
          Warum Menschen WFF lieben
        </p>

        <h2
          className="font-adieu"
          style={{
            fontSize: "clamp(2.2rem,5vw,7rem)",
            color: DARK,
            lineHeight: 1.04,
            letterSpacing: "-0.025em",
            maxWidth: "18ch",
            margin: "0 auto clamp(28px,4vh,52px)",
          }}
        >
          Du verdienst das Beste.
          <br />
          Du verdienst{" "}
          <span style={{ color: SAGE }}>WFF:</span>
          <br />
          Northern Lights.
        </h2>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: "clamp(18px,2.8vh,32px)" }}>
          <MoreButton label="Jetzt kaufen" href="/shop" />
        </div>

        <p
          className="font-mindflow"
          style={{
            fontSize: "clamp(14px,1.3vw,20px)",
            color: SAGE,
            marginTop: "clamp(8px,1.2vh,16px)",
            display: "inline-block",
            transform: "rotate(-1.5deg)",
          }}
        >
          Handverlesen. Lab-getestet. Dein Standard.
        </p>
      </motion.div>
    </section>
  )
}
