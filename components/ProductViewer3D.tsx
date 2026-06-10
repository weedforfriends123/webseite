"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function ProductViewer3D() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Inline viewer embedded in product row */}
      <section className="py-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-ember/[0.06] rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

            {/* 3D viewer */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="relative rounded-3xl overflow-hidden border border-cream/[0.08] bg-[#0c1124]"
              style={{ aspectRatio: "4/5" }}
            >
              <iframe
                src="/3d/northern-lights.html"
                className="w-full h-full border-0"
                title="Northern Lights Vape 3D"
                loading="lazy"
              />
              {/* Expand button */}
              <button
                onClick={() => setOpen(true)}
                className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-bg/80 border border-cream/10 backdrop-blur-sm flex items-center justify-center text-cream/40 hover:text-cream hover:border-cream/25 transition-all"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                </svg>
              </button>
              <div className="absolute bottom-4 left-4 pointer-events-none">
                <p className="font-mono text-[8px] tracking-widest uppercase text-cream/20">← Drehen</p>
              </div>
            </motion.div>

            {/* Product info */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
            >
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-lime/60 block mb-4">
                Flagship Product
              </span>
              <h2 className="font-sans font-extrabold text-5xl md:text-6xl text-cream leading-[0.9] tracking-tight mb-6">
                Northern
                <br />
                <span className="text-gradient">Lights.</span>
              </h2>

              <div className="divider mb-6" />

              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { label: "Format", value: "Vape" },
                  { label: "Inhalt", value: "1 ML" },
                  { label: "PHC", value: "96%" },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="font-sans font-extrabold text-xl text-cream">{s.value}</p>
                    <p className="font-mono text-[9px] tracking-widest uppercase text-cream/25 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              <p className="font-sans text-sm text-cream/40 leading-relaxed mb-8 max-w-sm">
                Frisch, leicht herb und ausgewogen. Ein zeitloser Klassiker mit sanftem Aroma und klarem Charakter. Nicotine &amp; THC Free · Legal in Germany.
              </p>

              <div className="flex gap-3">
                <a href="#waitlist" className="px-7 py-3.5 rounded-full bg-lime text-bg font-sans font-bold text-sm hover:scale-105 transition-transform glow-lime">
                  Vormerken →
                </a>
                <button
                  onClick={() => setOpen(true)}
                  className="px-7 py-3.5 rounded-full border border-cream/15 text-cream/60 font-sans font-bold text-sm hover:border-cream/30 hover:text-cream transition-all"
                >
                  3D ansehen
                </button>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Fullscreen modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-bg/95 backdrop-blur-xl flex items-center justify-center"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={e => e.stopPropagation()}
              className="relative w-full h-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden border border-cream/[0.08]"
            >
              <iframe
                src="/3d/northern-lights.html"
                className="w-full h-full border-0"
                title="Northern Lights Vape 3D"
              />
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-bg/80 border border-cream/10 backdrop-blur-sm flex items-center justify-center text-cream/50 hover:text-cream transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
