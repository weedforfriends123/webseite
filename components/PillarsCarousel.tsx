"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

const PILLARS = [
  {
    num: "01",
    icon: "/branding/pillar-icon-1.svg",
    title: "MENTAL\nCLARITY",
    sub: "PROVIDES MENTAL FOCUS, CLARITY, AND SHARPNESS FOR THE MODERN HUMAN",
    body: "A vial of clarity. Designed to help you be sharper and stay present in a world that constantly asks for more.",
  },
  {
    num: "02",
    icon: "/branding/pillar-icon-2.svg",
    title: "BODY\nBALANCE",
    sub: "WORKS WITH YOUR ENDOCANNABINOID SYSTEM, NOT AGAINST IT",
    body: "Natural homeostasis at its highest level. Cannabinoide working in harmony with your body.",
  },
  {
    num: "03",
    icon: "/branding/pillar-icon-3.svg",
    title: "DEEP\nRELAXATION",
    sub: "ANCIENT STRESS RELIEF, BOTTLED AND DELIVERED IN 24 HOURS",
    body: "5000 years of wellness wisdom, distilled into a single product. Unwind without compromise.",
  },
  {
    num: "04",
    icon: "/branding/pillar-icon-4.svg",
    title: "IMMUNE\nPOWER",
    sub: "CBG, CBC AND RARE CANNABINOIDS FOR YOUR NATURAL DEFENSES",
    body: "Fortify from within. Rare minor cannabinoids working alongside your body's natural defense systems.",
  },
]

export function PillarsCarousel() {
  const [active, setActive] = useState(0)
  const p = PILLARS[active]

  return (
    <section id="pillars" className="min-h-screen flex flex-col justify-center py-20 px-5 md:px-8 lg:px-14 relative">
      <div className="max-w-7xl mx-auto w-full">

        {/* Counter + arrows — drinksom exact style */}
        <div className="flex items-center justify-between mb-12 md:mb-16">
          <div className="flex items-baseline gap-2">
            <span
              className="font-druk text-cream"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1 }}
            >
              {p.num}
            </span>
            <span
              className="font-druk text-cream/15"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1 }}
            >
              /{PILLARS.length.toString().padStart(2, "0")}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActive((a) => (a - 1 + PILLARS.length) % PILLARS.length)}
              className="w-10 h-10 rounded-full border border-cream/15 text-cream/40 hover:border-cream/40 hover:text-cream transition-all flex items-center justify-center font-body text-sm"
            >
              ↑
            </button>
            <button
              onClick={() => setActive((a) => (a + 1) % PILLARS.length)}
              className="w-10 h-10 rounded-full border border-cream/15 text-cream/40 hover:border-cream/40 hover:text-cream transition-all flex items-center justify-center font-body text-sm"
            >
              ↓
            </button>
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10 items-end">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Pillar icon */}
              <div className="mb-6 opacity-60">
                <Image src={p.icon} alt={p.title} width={32} height={40} className="h-10 w-auto" />
              </div>

              {/* Big Druk headline */}
              <h2
                className="font-druk text-cream uppercase whitespace-pre-line mb-5"
                style={{
                  fontSize: "clamp(2.8rem, 9vw, 7.5rem)",
                  lineHeight: 0.88,
                  letterSpacing: "-0.02em",
                }}
              >
                {p.title}
              </h2>

              {/* Sub — mono uppercase */}
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-lime/60 mb-4">
                {p.sub}
              </p>
              <p className="font-body text-sm text-cream/35 leading-relaxed max-w-md">
                {p.body}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Pillar selector pills */}
          <div className="flex md:flex-col gap-2 flex-wrap">
            {PILLARS.map((pl, i) => (
              <button
                key={pl.num}
                onClick={() => setActive(i)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full border font-mono text-[9px] tracking-[0.2em] uppercase transition-all duration-300 ${
                  i === active
                    ? "border-lime/40 bg-lime/10 text-lime"
                    : "border-cream/[0.08] text-cream/20 hover:border-cream/20 hover:text-cream/40"
                }`}
              >
                <Image src={pl.icon} alt="" width={14} height={18} className={`h-4 w-auto ${i === active ? "opacity-80" : "opacity-20"}`} />
                {pl.num}
              </button>
            ))}
          </div>
        </div>

        {/* Progress line */}
        <div className="mt-12 h-px bg-cream/[0.06] relative overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-lime/50"
            animate={{ width: `${((active + 1) / PILLARS.length) * 100}%` }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>
    </section>
  )
}
