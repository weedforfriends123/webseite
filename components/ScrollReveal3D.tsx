"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion"

const PHASES = [
  {
    range: [0.08, 0.22, 0.38, 0.46] as [number, number, number, number],
    content: (
      <div className="text-center">
        <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-lime/60 mb-4">Flagship · 2026</p>
        <h2 className="font-sans font-extrabold text-6xl md:text-8xl text-cream leading-[0.88] tracking-tight">
          Northern<br />
          <span className="text-gradient">Lights.</span>
        </h2>
      </div>
    ),
  },
  {
    range: [0.44, 0.56, 0.70, 0.78] as [number, number, number, number],
    content: (
      <div className="flex items-center justify-center gap-12 md:gap-20">
        {[
          { val: "PHC 96%", label: "Reinheit" },
          { val: "1 ML", label: "Inhalt" },
          { val: "0.0%", label: "THC / Nikotin" },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <p className="font-sans font-extrabold text-3xl md:text-5xl text-cream">{s.val}</p>
            <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-cream/30 mt-2">{s.label}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    range: [0.76, 0.86, 0.95, 1.0] as [number, number, number, number],
    content: (
      <div className="text-center">
        <p className="font-sans font-extrabold text-2xl md:text-4xl text-cream/60 italic mb-6">
          "Frisch. Herb. Klar."
        </p>
        <a
          href="#waitlist"
          className="inline-flex px-10 py-4 rounded-full bg-lime text-bg font-sans font-bold text-sm hover:scale-105 transition-transform glow-lime"
        >
          Jetzt vormerken →
        </a>
      </div>
    ),
  },
]

function Counter({ target }: { target: number }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let frame = 0
    const total = 60
    const tick = () => {
      frame++
      setCount(Math.round((frame / total) * target))
      if (frame < total) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target])
  return <>{count}</>
}

export function ScrollReveal3D() {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 20 })

  // Product scale: starts small, grows to full
  const productScale = useTransform(smoothProgress, [0, 0.12], [0.55, 1])
  const productOpacity = useTransform(smoothProgress, [0, 0.08], [0, 1])

  // Background blur/darkness shifts with scroll
  const bgOpacity = useTransform(smoothProgress, [0, 0.06, 0.94, 1], [1, 0.15, 0.15, 0.9])

  // Phase opacities — must be declared individually (no hooks in loops)
  const phase0Opacity = useTransform(smoothProgress, PHASES[0].range, [0, 1, 1, 0])
  const phase1Opacity = useTransform(smoothProgress, PHASES[1].range, [0, 1, 1, 0])
  const phase2Opacity = useTransform(smoothProgress, PHASES[2].range, [0, 1, 1, 0])
  const phaseOpacities = [phase0Opacity, phase1Opacity, phase2Opacity]

  // Loading counter: 0 → 100 at start
  const [loaded, setLoaded] = useState(false)
  const [showLoader, setShowLoader] = useState(true)
  useEffect(() => {
    const t1 = setTimeout(() => setLoaded(true), 800)
    const t2 = setTimeout(() => setShowLoader(false), 1600)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <div ref={containerRef} className="relative h-[280vh]">
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* Dark background overlay */}
        <motion.div
          style={{ opacity: bgOpacity }}
          className="absolute inset-0 bg-bg z-10 pointer-events-none"
        />

        {/* 3D product — only the vape, no UI chrome */}
        <motion.div
          style={{ scale: productScale, opacity: productOpacity }}
          className="absolute inset-0 z-0"
        >
          <iframe
            src="/3d/northern-lights-clean.html"
            className="w-full h-full border-0"
            title="Northern Lights Vape"
            style={{ background: "transparent" }}
          />
        </motion.div>

        {/* Vignette edges */}
        <div className="absolute inset-0 z-20 pointer-events-none"
          style={{ boxShadow: "inset 0 0 200px 60px rgba(10,11,14,0.75)" }}
        />

        {/* Loading counter — drinksom style */}
        <AnimatePresence>
          {showLoader && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 z-40 bg-bg flex flex-col items-center justify-center pointer-events-none"
            >
              <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-cream/20 mb-6">
                Loading WFF Experience
              </p>
              <p className="font-sans font-extrabold text-[12vw] text-cream/10 leading-none select-none">
                {loaded ? "100" : <Counter target={100} />}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Text phases — centered overlay */}
        <div className="absolute inset-x-0 z-30 pointer-events-none flex items-center justify-center"
          style={{ top: "50%", transform: "translateY(-50%)" }}
        >
          {PHASES.map(({ content }, i) => (
            <motion.div
              key={i}
              style={{ opacity: phaseOpacities[i] }}
              className="absolute inset-x-6 flex items-center justify-center"
            >
              {content}
            </motion.div>
          ))}
        </div>

        {/* Bottom scroll hint */}
        <motion.div
          style={{ opacity: useTransform(scrollYProgress, [0, 0.05, 0.12], [1, 1, 0]) }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 pointer-events-none"
        >
          <p className="font-mono text-[8px] tracking-[0.3em] uppercase text-cream/20">Scroll</p>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
            className="w-px h-8 bg-gradient-to-b from-cream/20 to-transparent"
          />
        </motion.div>

        {/* Progress bar — top edge */}
        <motion.div
          style={{ scaleX: smoothProgress, transformOrigin: "left" }}
          className="absolute top-0 inset-x-0 h-px bg-lime/40 z-30 pointer-events-none"
        />

      </div>
    </div>
  )
}
