"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface Props {
  onDone: () => void
}

export function LoadingScreen({ onDone }: Props) {
  const [leftDigits, setLeftDigits] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
  const [rightDigits, setRightDigits] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    let ticks = 0
    const MAX = 90

    const interval = setInterval(() => {
      ticks++

      setLeftDigits((prev) => {
        const next = [...prev]
        next.unshift(next.pop()!)
        return next
      })

      if (ticks % 2 === 0) {
        setRightDigits((prev) => {
          const next = [...prev]
          next.unshift(next.pop()!)
          return next
        })
      }

      if (ticks >= MAX) {
        clearInterval(interval)
        setTimeout(() => {
          setVisible(false)
          setTimeout(onDone, 700)
        }, 300)
      }
    }, 40)

    return () => clearInterval(interval)
  }, [onDone])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: "#35383f" }}
        >
          <p
            className="font-sans text-[10px] tracking-[0.5em] uppercase mb-12"
            style={{ color: "rgba(14,15,17,0.25)" }}
          >
            Loading WFF Experience
          </p>

          {/* Slot machine digits */}
          <div className="flex gap-1 overflow-hidden" style={{ height: "0.95em" }}>
            <div className="relative overflow-hidden" style={{ width: "0.6em" }}>
              <motion.div
                animate={{ y: `${-leftDigits[0] * 10}%` }}
                transition={{ duration: 0.04, ease: "linear" }}
                className="flex flex-col"
              >
                {[...Array(10)].map((_, i) => (
                  <span
                    key={i}
                    className="font-sans font-extrabold leading-none"
                    style={{
                      fontSize: "clamp(5rem, 18vw, 14rem)",
                      lineHeight: 1,
                      color: "#0e0f11",
                    }}
                  >
                    {i}
                  </span>
                ))}
              </motion.div>
            </div>

            <div className="relative overflow-hidden" style={{ width: "0.6em" }}>
              <motion.div
                animate={{ y: `${-rightDigits[0] * 10}%` }}
                transition={{ duration: 0.08, ease: "linear" }}
                className="flex flex-col"
              >
                {[...Array(10)].map((_, i) => (
                  <span
                    key={i}
                    className="font-sans font-extrabold leading-none"
                    style={{
                      fontSize: "clamp(5rem, 18vw, 14rem)",
                      lineHeight: 1,
                      color: "#0e0f11",
                    }}
                  >
                    {i}
                  </span>
                ))}
              </motion.div>
            </div>
          </div>

          <p
            className="font-sans text-[10px] tracking-[0.4em] uppercase mt-16"
            style={{ color: "rgba(14,15,17,0.2)" }}
          >
            Weed For Friends ®
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
