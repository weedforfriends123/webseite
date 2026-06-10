"use client"

import { motion } from "framer-motion"

export function LaunchSection() {
  return (
    <section className="py-20 px-5 md:px-8 lg:px-14 overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* drinksom: "GET SŌM(E) POWER" / "COMING SOON" / "2026" */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="font-mono text-[10px] tracking-[0.5em] uppercase text-lime/50 mb-4">
            Get WFF
          </p>
          <h2
            className="font-druk text-cream uppercase mb-0"
            style={{ fontSize: "clamp(2.5rem, 8vw, 7rem)", lineHeight: 0.88, letterSpacing: "-0.02em" }}
          >
            COMING SOON
          </h2>
          <p
            className="font-druk text-cream/[0.07]"
            style={{ fontSize: "clamp(5rem, 20vw, 16rem)", lineHeight: 0.82 }}
          >
            2026
          </p>
        </motion.div>

        {/* drinksom: "PERFORMANCE IS CULTURE //" marquee style */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-8 pt-8 border-t border-cream/[0.05]"
        >
          <p
            className="font-druk text-cream/[0.05] uppercase whitespace-nowrap overflow-hidden"
            style={{ fontSize: "clamp(1.5rem, 5vw, 4rem)", letterSpacing: "-0.01em" }}
          >
            QUALITY IS THE RITUAL // QUALITY IS THE RITUAL // QUALITY IS THE RITUAL //
          </p>
        </motion.div>
      </div>
    </section>
  )
}
