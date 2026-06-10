"use client"

import { motion } from "framer-motion"

const PILLARS = [
  {
    num: "I",
    title: "Mental Clarity",
    body: "Premium Terpene und Cannabinoide für einen schärferen, präsenteren Geist. Designed für Menschen, die mehr verlangen.",
  },
  {
    num: "II",
    title: "Body Balance",
    body: "Arbeite mit deinem Endocannabinoid-System, nicht dagegen. Natürliche Homöostase auf höchstem Niveau.",
  },
  {
    num: "III",
    title: "Deep Relaxation",
    body: "5000 Jahre alte Stressrelief-Weisheit — bottled und in 24 Stunden zu dir geliefert. Ohne Kompromisse.",
  },
  {
    num: "IV",
    title: "Immune Power",
    body: "CBG, CBC und seltene Cannabinoide zur Stärkung deiner natürlichen Abwehrkräfte. Ancient science, modern proof.",
  },
]

export function PillarsSection() {
  return (
    <section id="pillars" className="py-32 px-6 relative">
      {/* Ambient */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[800px] h-[400px] rounded-full bg-gold/[0.04] blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-lime/60 block mb-3">
            The Four Powers
          </span>
          <h2 className="font-sans font-extrabold text-5xl md:text-6xl text-cream tracking-tight">
            What the Plant
            <br />
            <span className="text-gradient">Gives You.</span>
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-cream/[0.06] rounded-2xl overflow-hidden">
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              whileHover={{ backgroundColor: "rgba(240,236,228,0.03)" }}
              className="p-10 bg-bg group transition-colors duration-500 cursor-default"
            >
              <div className="flex items-start gap-6">
                <span className="font-sans font-black text-5xl text-cream/[0.06] group-hover:text-lime/10 transition-colors duration-500 leading-none mt-1 select-none">
                  {p.num}
                </span>
                <div>
                  <h3 className="font-sans font-bold text-xl text-cream mb-3 tracking-tight">
                    {p.title}
                  </h3>
                  <p className="font-body text-sm text-cream/35 leading-relaxed">
                    {p.body}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom quote */}
        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <p className="font-sans font-extrabold text-3xl md:text-4xl text-cream/20 italic tracking-tight">
            "Consistency is the ritual.
            <br />
            <span className="text-gold/40">Ritual is everything."</span>
          </p>
        </motion.blockquote>
      </div>
    </section>
  )
}
