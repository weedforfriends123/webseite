"use client"

import { motion, useReducedMotion } from "framer-motion"

const PAGE_BG = "#35383f"
const TEXT_COL = "#35383f"

const ITEMS = [
  { text: "GOOD VAPES ONLY.", accent: false },
  { text: "◆",               accent: true  },
  { text: "HC 96%",           accent: false },
  { text: "◆",               accent: true  },
  { text: "SUPERIOR BLEND",  accent: false },
  { text: "◆",               accent: true  },
  { text: "PURE JUICE",      accent: false },
  { text: "◆",               accent: true  },
  { text: "KEIN SCHROTT.",   accent: false },
  { text: "◆",               accent: true  },
  { text: "WFF",             accent: false },
  { text: "◆",               accent: true  },
]

export function GoodVapesSection() {
  const reduced = useReducedMotion()
  const doubled = [...ITEMS, ...ITEMS]

  if (reduced) {
    return (
      <section
        style={{
          background:    PAGE_BG,
          borderTop:    "1px solid rgba(53,56,63,0.07)",
          borderBottom: "1px solid rgba(53,56,63,0.07)",
          paddingBlock:  "clamp(40px, 7vh, 80px)",
          paddingInline: "clamp(20px, 5vw, 80px)",
          overflow:      "hidden",
        }}
      >
        <div className="flex flex-wrap gap-x-10 gap-y-2 items-center">
          {ITEMS.filter(i => !i.accent).map((item, i) => (
            <p
              key={i}
              className="font-adieu uppercase leading-none"
              style={{ fontSize: "clamp(2rem, 5vw, 7rem)", letterSpacing: "-0.025em", color: TEXT_COL }}
            >
              {item.text}
            </p>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section
      style={{
        background:    PAGE_BG,
        borderTop:    "1px solid rgba(53,56,63,0.07)",
        borderBottom: "1px solid rgba(53,56,63,0.07)",
        paddingBlock:  "clamp(28px, 5vh, 60px)",
        overflow:      "hidden",
        position:      "relative",
      }}
    >
      {/* Fade edges */}
      <div
        className="absolute inset-y-0 left-0 pointer-events-none"
        style={{ width: "clamp(40px, 8vw, 120px)", background: `linear-gradient(to right, ${PAGE_BG}, transparent)`, zIndex: 10 }}
      />
      <div
        className="absolute inset-y-0 right-0 pointer-events-none"
        style={{ width: "clamp(40px, 8vw, 120px)", background: `linear-gradient(to left, ${PAGE_BG}, transparent)`, zIndex: 10 }}
      />

      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, ease: "linear", repeat: Infinity }}
        className="flex items-center whitespace-nowrap w-max"
        style={{ gap: "clamp(28px, 4vw, 56px)" }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="font-adieu uppercase leading-none"
            style={{
              fontSize:      "clamp(3rem, 8vw, 10rem)",
              letterSpacing: item.accent ? "normal" : "-0.025em",
              lineHeight:    1,
              color:         item.accent ? "rgba(53,56,63,0.18)" : TEXT_COL,
            }}
          >
            {item.text}
          </span>
        ))}
      </motion.div>
    </section>
  )
}
