"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"

const PAGE_BG = "#35383f"
const TEXT_COL = "#35383f"

const CATEGORIES = [
  { num: "01", name: "Vapes",   url: "/vapes",         sub: "HC 96% · Vape Pens",      desc: "Bereit zum Einatmen."     },
  { num: "02", name: "Pods",    url: "/shop/pods",     sub: "Liquid · Pod Systems",     desc: "Smooth bis zum Ende."     },
  { num: "03", name: "Edibles", url: "/shop/edibles",  sub: "Gummies · Schokolade",     desc: "Genuss zum Kauen."        },
  { num: "04", name: "Blüten",  url: "/shop/blueten",  sub: "CBD · Superior Qualität",  desc: "Das Original."            },
  { num: "05", name: "Hasch",   url: "/shop/hasch",    sub: "Solventless · Extrakte",   desc: "Konzentration pur."       },
]

function Tile({ cat, index }: { cat: (typeof CATEGORIES)[0]; index: number }) {
  const [hovered, setHovered] = useState(false)
  const bg  = hovered ? TEXT_COL : PAGE_BG
  const fg  = hovered ? PAGE_BG  : TEXT_COL
  const muted = hovered ? "rgba(53,56,63,0.40)" : "rgba(53,56,63,0.35)"

  return (
    <Link href={cat.url}>
      <motion.div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.45, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col justify-between cursor-pointer"
        style={{
          background:  bg,
          padding:     "clamp(18px, 3vh, 32px) clamp(16px, 2vw, 28px)",
          minHeight:   "clamp(150px, 20vh, 200px)",
          transition:  "background 0.22s ease",
        }}
      >
        {/* Number */}
        <span className="font-mono" style={{ fontSize: "9px", letterSpacing: "0.3em", color: muted, transition: "color 0.22s" }}>
          {cat.num}
        </span>

        {/* Main name */}
        <p className="font-adieu uppercase leading-none"
          style={{ fontSize: "clamp(1.6rem, 2.8vw, 2.6rem)", letterSpacing: "-0.025em", color: fg, transition: "color 0.22s", marginBlock: "auto" }}>
          {cat.name}
        </p>

        {/* Bottom row */}
        <div className="flex items-end justify-between gap-2">
          <p className="font-mono uppercase" style={{ fontSize: "7px", letterSpacing: "0.22em", color: muted, transition: "color 0.22s" }}>
            {cat.sub}
          </p>
          <motion.span
            animate={{ x: hovered ? 4 : 0 }}
            transition={{ duration: 0.18 }}
            style={{ color: muted, fontSize: 13, lineHeight: 1, flexShrink: 0, transition: "color 0.22s" }}
          >
            →
          </motion.span>
        </div>
      </motion.div>
    </Link>
  )
}

export function ProductGrid() {
  return (
    <section style={{ background: PAGE_BG, overflow: "hidden" }}>
      {/* Eyebrow */}
      <div style={{ padding: "clamp(40px, 7vh, 80px) clamp(20px, 5vw, 80px) clamp(20px, 3vh, 40px)" }}>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="font-mono uppercase"
          style={{ fontSize: "9px", letterSpacing: "0.45em", color: "rgba(53,56,63,0.30)" }}
        >
          Das Sortiment
        </motion.p>
      </div>

      {/* Grid — 1px gap = border illusion */}
      <div
        className="grid grid-cols-2 md:grid-cols-5"
        style={{ gap: 1, background: "rgba(53,56,63,0.09)" }}
      >
        {CATEGORIES.map((cat, i) => (
          <Tile key={cat.num} cat={cat} index={i} />
        ))}
      </div>
    </section>
  )
}
