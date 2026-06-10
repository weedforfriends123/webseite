"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export function BrandStory() {
  return (
    <section className="py-20 px-5 md:px-8 lg:px-14 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* drinksom: "Performance is Culture" heading + ANCIENT WISDOM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16 items-end">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            viewport={{ once: true }}
          >
            <h2
              className="font-druk text-cream uppercase"
              style={{
                fontSize: "clamp(2.5rem, 8vw, 7rem)",
                lineHeight: 0.88,
                letterSpacing: "-0.02em",
              }}
            >
              Quality<br />
              <span className="text-cream/10">is Culture.</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            viewport={{ once: true }}
          >
            <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-lime/60 mb-4">
              Ancient Wisdom
            </p>
            <p className="font-body text-sm text-cream/40 leading-relaxed mb-4 max-w-md">
              WFF is inspired by the ancient use of the cannabis plant — a sacred herb known to bring vitality and a higher state of mind. We've traveled from ancient traditions to modern labs to bottle this essence for the modern human.
            </p>
            <p className="font-body text-sm text-cream/30 leading-relaxed max-w-md">
              The result: products with PHC 96% purity — the best nature has to offer, rigorously tested and delivered to your door.
            </p>
          </motion.div>
        </div>

        {/* Origin images — drinksom style grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 gap-3 rounded-2xl overflow-hidden"
          style={{ maxHeight: "60vh" }}
        >
          <div className="relative rounded-xl overflow-hidden">
            <Image
              src="/origin-left.webp"
              alt="Origin"
              fill
              className="object-cover object-top"
            />
          </div>
          <div className="relative rounded-xl overflow-hidden">
            <Image
              src="/origin-right.webp"
              alt="Origin"
              fill
              className="object-cover object-top"
            />
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-cream/[0.05]"
        >
          {[
            { n: "5.000+", l: "Years of tradition" },
            { n: "PHC 96%", l: "Purity grade" },
            { n: "100%", l: "Third-party tested" },
            { n: "24h", l: "Delivery in Germany" },
          ].map((f) => (
            <div key={f.l}>
              <p className="font-druk text-2xl text-cream mb-1">{f.n}</p>
              <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-cream/25">{f.l}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
