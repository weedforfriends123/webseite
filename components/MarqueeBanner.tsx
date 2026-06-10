"use client"

import { motion } from "framer-motion"

const ITEMS = [
  { text: "Ancient Wisdom", accent: false },
  { text: "◆", accent: true },
  { text: "Modern Science", accent: false },
  { text: "◆", accent: true },
  { text: "HC 96% Reinheit", accent: false },
  { text: "◆", accent: true },
  { text: "Laborgeprüft", accent: false },
  { text: "◆", accent: true },
  { text: "5000 Jahre Tradition", accent: false },
  { text: "◆", accent: true },
  { text: "THC Free", accent: false },
  { text: "◆", accent: true },
  { text: "Blitzschnell", accent: false },
  { text: "◆", accent: true },
  { text: "Diskret Verpackt", accent: false },
  { text: "◆", accent: true },
]

export function MarqueeBanner() {
  const doubled = [...ITEMS, ...ITEMS]

  return (
    <div className="py-4 border-y border-cream/[0.05] overflow-hidden relative bg-cream/[0.01]">
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-bg to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-bg to-transparent z-10 pointer-events-none" />

      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, ease: "linear", repeat: Infinity }}
        className="flex items-center gap-8 whitespace-nowrap w-max"
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className={`font-mono text-[10px] tracking-[0.25em] uppercase ${
              item.accent ? "text-gold/50" : "text-cream/25"
            }`}
          >
            {item.text}
          </span>
        ))}
      </motion.div>
    </div>
  )
}
