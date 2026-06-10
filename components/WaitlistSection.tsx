"use client"

import { useState } from "react"
import { motion } from "framer-motion"

export function WaitlistSection() {
  const [email, setEmail] = useState("")
  const [accepted, setAccepted] = useState(false)
  const [done, setDone] = useState(false)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (email && accepted) setDone(true)
  }

  return (
    <section id="waitlist" className="min-h-screen flex flex-col justify-center py-20 px-5 md:px-8 lg:px-14 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[800px] h-[400px] bg-lime/[0.04] rounded-full blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto w-full relative">

        {/* drinksom: "BECOME SOMEONE POWERFUL" in Druk */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2
            className="font-druk text-cream uppercase"
            style={{
              fontSize: "clamp(2.5rem, 10vw, 9rem)",
              lineHeight: 0.88,
              letterSpacing: "-0.02em",
            }}
          >
            BECOME<br />
            <span className="text-cream/12">SOMEONE</span><br />
            POWERFUL.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Left — drinksom copy */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-cream/30 mb-2">
              Don't just watch.
            </p>
            <p className="font-mono text-[11px] tracking-[0.15em] uppercase text-cream/50 leading-relaxed max-w-sm">
              Command the herb. Join the waitlist for priority access to the first ritual.
            </p>

            {/* Orange divider — drinksom element */}
            <div className="mt-6 h-px bg-lime/30 max-w-[200px]" />
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            viewport={{ once: true }}
          >
            {!done ? (
              <form onSubmit={submit} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full px-5 py-3.5 rounded-full bg-cream/[0.04] border border-cream/[0.1] text-cream font-body text-sm placeholder:text-cream/20 focus:outline-none focus:border-lime/30 transition-colors"
                />

                <label className="flex items-start gap-3 cursor-pointer">
                  <div
                    onClick={() => setAccepted(!accepted)}
                    className={`w-4 h-4 rounded border mt-0.5 shrink-0 transition-all ${accepted ? "bg-lime border-lime" : "border-cream/20"}`}
                  />
                  <span className="font-body text-xs text-cream/25 leading-relaxed">
                    I accept the Privacy Policy and want to receive WFF news.
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={!accepted}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-lime text-bg font-druk text-[13px] tracking-[0.15em] uppercase hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-30 glow-lime"
                >
                  Join Waitlist →
                </button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-4 px-6 rounded-full border border-lime/25 bg-lime/[0.07]"
              >
                <p className="font-druk text-lime text-[13px] tracking-widest uppercase">
                  ✓ You're on the list.
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
