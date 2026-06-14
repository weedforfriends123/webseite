"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

const TEXT = "#35383f"
const MUTED = "rgba(53,56,63,0.48)"

const ROW1 = [
  {
    name:    "Tom K.",
    product: "Purple Haze",
    text:    "Endlich mal ein Produkt, das hält was es verspricht. Kein komischer Nachgeschmack, gleichmäßige Züge bis zum Schluss. Bestelle regelmäßig nach.",
  },
  {
    name:    "Sarah M.",
    product: "CBD Blüten",
    text:    "Die Qualität ist wirklich auf einem anderen Level. Man merkt, dass da Sorgfalt dahintersteckt — riecht intensiv, wirkt direkt. Top.",
  },
  {
    name:    "Felix R.",
    product: "Gelato Vape",
    text:    "Schon einige Sorten probiert. Gelato ist mein absoluter Favorit. Diskrete Lieferung, schnell da, Verpackung einwandfrei. 10/10.",
  },
  {
    name:    "Jonas W.",
    product: "HHC Edibles",
    text:    "Die Edibles sind der Wahnsinn. Dosierung passt, keine Überraschungen, einfach sauber. Hab direkt nochmal bestellt.",
  },
]

const ROW2 = [
  {
    name:    "Lena B.",
    product: "Ice Cream Cookies",
    text:    "Normalerweise bin ich skeptisch bei Online-Shops, aber hier hat mich alles überzeugt — Produkt, Verpackung, Lieferzeit. Nie wieder woanders.",
  },
  {
    name:    "Max S.",
    product: "Pods",
    text:    "Die Pods passen perfekt. Kein Lecken, kein Gurgle, sauber bis zum letzten Zug. Genau das, was ich gesucht hab.",
  },
  {
    name:    "Mia T.",
    product: "Northern Lights",
    text:    "Erste Bestellung lief reibungslos. Produkt 1A, Terpene riechen wirklich durch. Kommt definitiv wieder.",
  },
  {
    name:    "Phil D.",
    product: "Qualitätskontrolle",
    text:    "Hab extra die COA gecheckt — alles sauber, alles transparent. Das gibt echtes Vertrauen. Genau so muss das sein.",
  },
]

function Stars() {
  return (
    <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
      {[0,1,2,3,4].map(i => (
        <svg key={i} width="14" height="14" viewBox="0 0 14 14" fill="#c4983a">
          <path d="M7 1.5l1.37 2.78 3.07.45-2.22 2.16.52 3.06L7 8.5l-2.74 1.44.52-3.06L2.56 4.73l3.07-.45L7 1.5z"/>
        </svg>
      ))}
    </div>
  )
}

type Review = (typeof ROW1)[number]

function Card({ name, product, text }: Review) {
  return (
    <div style={{
      width:         300,
      flexShrink:    0,
      marginRight:   16,
      background:    "rgba(255,255,255,0.62)",
      borderRadius:  20,
      padding:       "22px 24px 20px",
      border:        "1px solid rgba(255,255,255,0.85)",
      boxShadow:     "0 2px 16px rgba(53,56,63,0.05), inset 0 1px 0 rgba(255,255,255,0.7)",
    }}>
      <Stars />
      <p style={{
        fontSize: 14, lineHeight: 1.68,
        color: "rgba(53,56,63,0.75)",
        margin: "0 0 18px",
      }}>
        "{text}"
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          background: "rgba(53,56,63,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <span className="font-druk" style={{ fontSize: 14, color: TEXT, lineHeight: 1 }}>
            {name.charAt(0)}
          </span>
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: TEXT, lineHeight: 1.3 }}>{name}</p>
          <p style={{ margin: 0, fontSize: 11, color: MUTED, letterSpacing: "0.01em", lineHeight: 1.4 }}>{product}</p>
        </div>
      </div>
    </div>
  )
}

const CARD_W = 316  // 300px card + 16px gap

function MarqueeRow({ reviews, reverse = false }: { reviews: Review[]; reverse?: boolean }) {
  const loopDist = reviews.length * CARD_W
  const duration = reviews.length * 5.5

  return (
    <div style={{ overflow: "hidden", width: "100%" }}>
      <motion.div
        initial={{ x: reverse ? -loopDist : 0 }}
        animate={{ x: reverse ? 0 : -loopDist }}
        transition={{ duration, repeat: Infinity, ease: "linear", repeatType: "loop" }}
        style={{ display: "flex", width: "max-content" }}
      >
        {[...reviews, ...reviews].map((r, i) => <Card key={i} {...r} />)}
      </motion.div>
    </div>
  )
}

export function Section06_Reviews() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] })
  const headerY = useTransform(scrollYProgress, [0, 1], [24, -24])

  return (
    <section
      ref={sectionRef}
      style={{
        background: "#bcc0ca",
        padding: "clamp(72px,11vh,130px) 0 clamp(80px,12vh,148px)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <motion.div style={{ y: headerY, textAlign: "center", padding: "0 clamp(20px,5vw,80px)", marginBottom: "clamp(44px,6vh,80px)" }}>
        <p className="font-ekstra uppercase" style={{
          fontSize: 9, letterSpacing: "0.52em",
          color: "rgba(53,56,63,0.38)", marginBottom: 18,
        }}>
          Echte Stimmen
        </p>
        <h2 className="font-druk-wide uppercase" style={{
          fontSize:      "clamp(2rem, 5.8vw, 7rem)",
          letterSpacing: "-0.03em",
          lineHeight:    0.95,
          color:         TEXT,
          margin:        0,
        }}>
          Was unsere Kunden<br />sagen.
        </h2>
      </motion.div>

      {/* Marquee rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <MarqueeRow reviews={ROW1} />
        <MarqueeRow reviews={ROW2} reverse />
      </div>
    </section>
  )
}
