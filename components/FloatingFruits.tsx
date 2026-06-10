"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

type Fruit = {
  emoji: string
  x: string        // offset from viewport center
  y: string
  size: string
  floatY: number   // float amplitude px
  dur: number      // float cycle seconds
  rot: number      // max rotation deg
  delay: number    // entrance + float delay
}

// Per-flavor fruit clusters
const FLAVORS: Fruit[][] = [
  // 0 — Amnesia Haze: citrus, lemon, fresh green
  [
    { emoji: "🍋", x: "-34vw", y: "-8vh",  size: "clamp(2.8rem,7vw,5.5rem)", floatY: 22, dur: 4.2, rot: 14, delay: 0    },
    { emoji: "🍊", x:  "28vw", y: "-22vh", size: "clamp(2rem,4.5vw,3.8rem)", floatY: 16, dur: 5.4, rot: 18, delay: 0.55 },
    { emoji: "🌿", x: "-20vw", y:  "18vh", size: "clamp(1.6rem,3.5vw,3rem)", floatY: 14, dur: 3.8, rot: 22, delay: 0.9  },
    { emoji: "🍋", x:  "22vw", y:  "14vh", size: "clamp(1.4rem,3vw,2.5rem)", floatY: 10, dur: 4.8, rot: 10, delay: 1.2  },
  ],
  // 1 — Purple Haze: blueberry, grape, lavender
  [
    { emoji: "🫐", x: "-32vw", y: "-10vh", size: "clamp(2.8rem,7vw,5.5rem)", floatY: 20, dur: 4.6, rot: 12, delay: 0    },
    { emoji: "🍇", x:  "26vw", y: "-18vh", size: "clamp(2rem,4.5vw,3.8rem)", floatY: 18, dur: 5.2, rot: 20, delay: 0.5  },
    { emoji: "💜", x:  "18vw", y:  "20vh", size: "clamp(1.6rem,3.5vw,3rem)", floatY: 14, dur: 4.0, rot: 28, delay: 0.8  },
    { emoji: "🫐", x: "-16vw", y:  "16vh", size: "clamp(1.4rem,3vw,2.5rem)", floatY: 12, dur: 5.8, rot: 16, delay: 1.1  },
  ],
  // 2 — Northern Lights: pine, ice, aurora
  [
    { emoji: "🌲", x: "-30vw", y:  "-6vh", size: "clamp(2.8rem,7vw,5.5rem)", floatY: 14, dur: 5.0, rot:  8, delay: 0    },
    { emoji: "❄️", x:  "25vw", y: "-20vh", size: "clamp(2rem,4.5vw,3.8rem)", floatY: 20, dur: 3.8, rot: 32, delay: 0.6  },
    { emoji: "⭐", x: "-18vw", y:  "20vh", size: "clamp(1.6rem,3.5vw,3rem)", floatY: 18, dur: 4.6, rot: 22, delay: 1.0  },
    { emoji: "❄️", x:  "20vw", y:  "12vh", size: "clamp(1.4rem,3vw,2.5rem)", floatY: 12, dur: 6.0, rot: 40, delay: 1.4  },
  ],
  // 3 — Ice Cream Cookies: ice cream, cookie, cold
  [
    { emoji: "🍦", x: "-32vw", y:  "-8vh", size: "clamp(2.8rem,7vw,5.5rem)", floatY: 22, dur: 4.8, rot: 10, delay: 0    },
    { emoji: "🍪", x:  "26vw", y: "-16vh", size: "clamp(2rem,4.5vw,3.8rem)", floatY: 18, dur: 5.2, rot: 22, delay: 0.5  },
    { emoji: "🧊", x:  "18vw", y:  "18vh", size: "clamp(1.6rem,3.5vw,3rem)", floatY: 14, dur: 4.2, rot: 30, delay: 0.9  },
    { emoji: "🍦", x: "-16vw", y:  "14vh", size: "clamp(1.4rem,3vw,2.5rem)", floatY: 10, dur: 5.6, rot: 14, delay: 1.3  },
  ],
  // 4 — Girl Scout Cookies: cookie, chocolate, mint
  [
    { emoji: "🍪", x: "-30vw", y: "-12vh", size: "clamp(2.8rem,7vw,5.5rem)", floatY: 20, dur: 4.5, rot: 18, delay: 0    },
    { emoji: "🍫", x:  "24vw", y:  "-8vh", size: "clamp(2rem,4.5vw,3.8rem)", floatY: 16, dur: 5.0, rot: 12, delay: 0.6  },
    { emoji: "🌿", x: "-18vw", y:  "18vh", size: "clamp(1.6rem,3.5vw,3rem)", floatY: 12, dur: 3.8, rot: 24, delay: 0.9  },
    { emoji: "🍪", x:  "20vw", y:  "16vh", size: "clamp(1.4rem,3vw,2.5rem)", floatY:  8, dur: 5.4, rot: 20, delay: 1.2  },
  ],
  // 5 — Gelato: strawberry, peach, ice cream
  [
    { emoji: "🍨", x: "-32vw", y:  "-6vh", size: "clamp(2.8rem,7vw,5.5rem)", floatY: 20, dur: 4.4, rot:  8, delay: 0    },
    { emoji: "🍓", x:  "26vw", y: "-18vh", size: "clamp(2rem,4.5vw,3.8rem)", floatY: 18, dur: 5.5, rot: 20, delay: 0.5  },
    { emoji: "🍑", x:  "18vw", y:  "16vh", size: "clamp(1.6rem,3.5vw,3rem)", floatY: 16, dur: 4.2, rot: 24, delay: 0.8  },
    { emoji: "🍓", x: "-16vw", y:  "20vh", size: "clamp(1.4rem,3vw,2.5rem)", floatY: 12, dur: 5.8, rot: 18, delay: 1.1  },
  ],
]

export function FloatingFruits() {
  const [flavor, setFlavor] = useState(0)

  useEffect(() => {
    const handler = (e: Event) => setFlavor((e as CustomEvent).detail.index)
    window.addEventListener("wff-flavor", handler)
    return () => window.removeEventListener("wff-flavor", handler)
  }, [])

  const fruits = FLAVORS[flavor] ?? []

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 11 }}
      aria-hidden
    >
      <AnimatePresence mode="wait">
        <motion.div key={flavor} className="absolute inset-0">
          {fruits.map((f, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: "50%",
                top:  "50%",
                transform: `translate(calc(-50% + ${f.x}), calc(-50% + ${f.y}))`,
              }}
              initial={{ scale: 0, opacity: 0, rotate: f.rot * -1.5 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{    scale: 0, opacity: 0, rotate: f.rot }}
              transition={{
                delay:     f.delay,
                type:      "spring",
                stiffness: 260,
                damping:   18,
                mass:      0.8,
              }}
            >
              {/* Continuous float */}
              <motion.div
                animate={{
                  y:      [0, -f.floatY, 0, f.floatY * 0.5, 0],
                  rotate: [-f.rot * 0.4, f.rot * 0.4, -f.rot * 0.4],
                  scale:  [1, 1.06, 1, 0.97, 1],
                }}
                transition={{
                  delay:    f.delay + 0.3,
                  duration: f.dur,
                  repeat:   Infinity,
                  ease:     "easeInOut",
                }}
                style={{
                  fontSize:  f.size,
                  lineHeight: 1,
                  filter:
                    "drop-shadow(0 16px 28px rgba(14,12,9,0.28)) " +
                    "drop-shadow(0 5px 10px rgba(14,12,9,0.16)) " +
                    "drop-shadow(0 2px 4px rgba(14,12,9,0.10))",
                  // Subtle 3-D tilt via perspective
                  transform: "perspective(300px) rotateX(8deg)",
                }}
              >
                {f.emoji}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
