"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

type Tag = {
  text:    string
  sub?:    string       // optional second line
  x:       string       // offset from viewport center
  y:       string
  align:   "left" | "right"
  size:    "sm" | "md" | "lg"
  delay:   number
  floatY:  number
  dur:     number
  style?:  "pill" | "line" | "plain"
}

const FLAVORS: Tag[][] = [
  // 0 — Amnesia Haze
  [
    { text: "HC 96%",          x:  "28vw", y: "-24vh", align: "left",  size: "lg", delay: 0,    floatY: 10, dur: 5.2, style: "pill"  },
    { text: "Citrus",  sub: "& Pine",   x: "-36vw", y: "-10vh", align: "right", size: "md", delay: 0.2,  floatY: 14, dur: 4.6, style: "line"  },
    { text: "Sativa",          x: "-30vw", y:  "12vh", align: "right", size: "md", delay: 0.4,  floatY: 12, dur: 5.8, style: "plain" },
    { text: "500mg",           x:  "24vw", y:  "20vh", align: "left",  size: "sm", delay: 0.6,  floatY:  8, dur: 4.2, style: "pill"  },
    { text: "Lab Tested",      x:  "20vw", y:  "-6vh", align: "left",  size: "sm", delay: 0.8,  floatY: 10, dur: 6.0, style: "plain" },
  ],
  // 1 — Purple Haze
  [
    { text: "HC 96%",          x:  "28vw", y: "-24vh", align: "left",  size: "lg", delay: 0,    floatY: 10, dur: 5.4, style: "pill"  },
    { text: "Berry",   sub: "& Grape",  x: "-36vw", y: "-10vh", align: "right", size: "md", delay: 0.2,  floatY: 16, dur: 4.8, style: "line"  },
    { text: "Hybrid",          x: "-30vw", y:  "12vh", align: "right", size: "md", delay: 0.4,  floatY: 12, dur: 5.6, style: "plain" },
    { text: "500mg",           x:  "24vw", y:  "20vh", align: "left",  size: "sm", delay: 0.6,  floatY:  8, dur: 4.4, style: "pill"  },
    { text: "Premium Extract", x:  "20vw", y:  "-6vh", align: "left",  size: "sm", delay: 0.8,  floatY: 10, dur: 5.8, style: "plain" },
  ],
  // 2 — Northern Lights
  [
    { text: "HC 96%",          x:  "28vw", y: "-24vh", align: "left",  size: "lg", delay: 0,    floatY: 10, dur: 5.0, style: "pill"  },
    { text: "Earthy",  sub: "& Pine",   x: "-36vw", y: "-10vh", align: "right", size: "md", delay: 0.2,  floatY: 12, dur: 4.4, style: "line"  },
    { text: "Pure Indica",     x: "-30vw", y:  "12vh", align: "right", size: "md", delay: 0.4,  floatY: 10, dur: 5.2, style: "plain" },
    { text: "500mg",           x:  "24vw", y:  "20vh", align: "left",  size: "sm", delay: 0.6,  floatY:  8, dur: 4.0, style: "pill"  },
    { text: "Cold Pressed",    x:  "20vw", y:  "-6vh", align: "left",  size: "sm", delay: 0.8,  floatY: 10, dur: 6.2, style: "plain" },
  ],
  // 3 — Ice Cream Cookies
  [
    { text: "HC 96%",          x:  "28vw", y: "-24vh", align: "left",  size: "lg", delay: 0,    floatY: 10, dur: 5.2, style: "pill"  },
    { text: "Vanilla", sub: "& Cookie", x: "-36vw", y: "-10vh", align: "right", size: "md", delay: 0.2,  floatY: 14, dur: 4.8, style: "line"  },
    { text: "Hybrid",          x: "-30vw", y:  "12vh", align: "right", size: "md", delay: 0.4,  floatY: 12, dur: 5.6, style: "plain" },
    { text: "500mg",           x:  "24vw", y:  "20vh", align: "left",  size: "sm", delay: 0.6,  floatY:  8, dur: 4.2, style: "pill"  },
    { text: "Full Spectrum",   x:  "20vw", y:  "-6vh", align: "left",  size: "sm", delay: 0.8,  floatY: 10, dur: 5.8, style: "plain" },
  ],
  // 4 — Girl Scout Cookies
  [
    { text: "HC 96%",          x:  "28vw", y: "-24vh", align: "left",  size: "lg", delay: 0,    floatY: 10, dur: 5.4, style: "pill"  },
    { text: "Sweet",   sub: "& Earthy", x: "-36vw", y: "-10vh", align: "right", size: "md", delay: 0.2,  floatY: 14, dur: 4.6, style: "line"  },
    { text: "Hybrid",          x: "-30vw", y:  "12vh", align: "right", size: "md", delay: 0.4,  floatY: 12, dur: 5.0, style: "plain" },
    { text: "500mg",           x:  "24vw", y:  "20vh", align: "left",  size: "sm", delay: 0.6,  floatY:  8, dur: 4.4, style: "pill"  },
    { text: "Top Shelf",       x:  "20vw", y:  "-6vh", align: "left",  size: "sm", delay: 0.8,  floatY: 10, dur: 6.0, style: "plain" },
  ],
  // 5 — Gelato
  [
    { text: "HC 96%",          x:  "28vw", y: "-24vh", align: "left",  size: "lg", delay: 0,    floatY: 10, dur: 5.2, style: "pill"  },
    { text: "Fruity",  sub: "& Cream",  x: "-36vw", y: "-10vh", align: "right", size: "md", delay: 0.2,  floatY: 16, dur: 4.8, style: "line"  },
    { text: "Indica Hybrid",   x: "-30vw", y:  "12vh", align: "right", size: "md", delay: 0.4,  floatY: 12, dur: 5.6, style: "plain" },
    { text: "500mg",           x:  "24vw", y:  "20vh", align: "left",  size: "sm", delay: 0.6,  floatY:  8, dur: 4.2, style: "pill"  },
    { text: "Premium Select",  x:  "20vw", y:  "-6vh", align: "left",  size: "sm", delay: 0.8,  floatY: 10, dur: 5.8, style: "plain" },
  ],
]

const SIZE = {
  sm: { fontSize: "clamp(8px,  0.85vw, 11px)", letterSpacing: "0.32em" },
  md: { fontSize: "clamp(11px, 1.2vw,  16px)", letterSpacing: "0.18em" },
  lg: { fontSize: "clamp(16px, 2vw,    26px)", letterSpacing: "0.08em" },
}

export function FloatingInfo() {
  const [flavor, setFlavor] = useState(0)

  useEffect(() => {
    const h = (e: Event) => setFlavor((e as CustomEvent).detail.index)
    window.addEventListener("wff-flavor", h)
    return () => window.removeEventListener("wff-flavor", h)
  }, [])

  return (
    // hidden on mobile — only shown md+
    <div className="hidden md:block fixed inset-0 pointer-events-none" style={{ zIndex: 12 }} aria-hidden>
      <AnimatePresence mode="wait">
        <motion.div key={flavor} className="absolute inset-0">
          {FLAVORS[flavor].map((tag, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left:      "50%",
                top:       "50%",
                transform: `translate(calc(-50% + ${tag.x}), calc(-50% + ${tag.y}))`,
              }}
              initial={{ opacity: 0, y: tag.align === "left" ? 10 : -10, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{    opacity: 0, y: tag.align === "left" ? -6 : 6,  scale: 0.95 }}
              transition={{ delay: tag.delay, type: "spring", stiffness: 220, damping: 22 }}
            >
              <motion.div
                animate={{ y: [0, -tag.floatY * 0.5, 0, tag.floatY * 0.3, 0] }}
                transition={{ delay: tag.delay + 0.4, duration: tag.dur, repeat: Infinity, ease: "easeInOut" }}
              >
                {tag.style === "pill" && (
                  <span
                    className="inline-block font-mono uppercase whitespace-nowrap"
                    style={{
                      ...SIZE[tag.size],
                      color:         tag.size === "lg" ? "#35383f" : "rgba(53,56,63,0.55)",
                      background:    tag.size === "lg" ? "rgba(53,56,63,0.07)" : "transparent",
                      border:        tag.size === "lg" ? "1px solid rgba(53,56,63,0.14)" : "1px solid rgba(53,56,63,0.10)",
                      borderRadius:  9999,
                      padding:       tag.size === "lg" ? "6px 14px" : "4px 10px",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    {tag.text}
                  </span>
                )}

                {tag.style === "line" && (
                  <div
                    className="flex flex-col font-mono uppercase whitespace-nowrap"
                    style={{ textAlign: tag.align }}
                  >
                    <span style={{ ...SIZE[tag.size], color: "#35383f", lineHeight: 1.1 }}>
                      {tag.text}
                    </span>
                    {tag.sub && (
                      <span style={{ ...SIZE.sm, color: "rgba(53,56,63,0.38)", marginTop: 3 }}>
                        {tag.sub}
                      </span>
                    )}
                    {/* decorative line */}
                    <motion.div
                      className="mt-1.5"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: tag.delay + 0.2, duration: 0.5, ease: "easeOut" }}
                      style={{
                        height:      1,
                        background:  "rgba(53,56,63,0.16)",
                        transformOrigin: tag.align === "right" ? "right" : "left",
                      }}
                    />
                  </div>
                )}

                {tag.style === "plain" && (
                  <span
                    className="font-mono uppercase whitespace-nowrap"
                    style={{
                      ...SIZE[tag.size],
                      color: "rgba(53,56,63,0.35)",
                    }}
                  >
                    · {tag.text}
                  </span>
                )}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
