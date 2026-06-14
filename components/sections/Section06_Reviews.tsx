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
  {
    name:    "Nina H.",
    product: "Ice Cream Cookies",
    text:    "Hab viel ausprobiert — hier stimmt einfach alles. Qualität, Verpackung, Geschmack. Nichts zu meckern, wirklich.",
  },
  {
    name:    "Alex B.",
    product: "Northern Lights",
    text:    "Schnelle Lieferung, super Qualität. Die Northern Lights sind perfekt zum Entspannen. Kommt wieder.",
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
  {
    name:    "Kira V.",
    product: "Amnesia Haze",
    text:    "Amnesia Haze ist krass gut. Der Geruch, der Geschmack — so hab ich mir das vorgestellt. Keine Enttäuschung.",
  },
  {
    name:    "Ben L.",
    product: "Girl Scout Cookies",
    text:    "Lieferung kam schneller als erwartet. Verpackung top, Produkt noch besser. Hab direkt die nächste Sorte bestellt.",
  },
]

function Stars() {
  return (
    <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
      {[0,1,2,3,4].map(i => (
        <svg key={i} width="15" height="15" viewBox="0 0 14 14" fill="#c4983a">
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
      width:         "clamp(300px, 24vw, 460px)",
      flexShrink:    0,
      marginRight:   "clamp(14px, 1.4vw, 22px)",
      background:    "rgba(255,255,255,0.65)",
      borderRadius:  "clamp(16px, 1.4vw, 24px)",
      padding:       "clamp(20px, 1.8vw, 30px) clamp(22px, 2vw, 32px) clamp(18px, 1.6vw, 26px)",
      border:        "1px solid rgba(255,255,255,0.88)",
      boxShadow:     "0 2px 20px rgba(53,56,63,0.06), inset 0 1px 0 rgba(255,255,255,0.7)",
    }}>
      <Stars />
      <p style={{
        fontSize:   "clamp(13px, 1vw, 16px)",
        lineHeight: 1.72,
        color:      "rgba(53,56,63,0.72)",
        margin:     "0 0 clamp(16px, 1.6vw, 24px)",
      }}>
        "{text}"
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: "clamp(8px, 0.8vw, 12px)" }}>
        <div style={{
          width:           "clamp(34px, 2.6vw, 44px)",
          height:          "clamp(34px, 2.6vw, 44px)",
          borderRadius:    "50%",
          background:      "rgba(53,56,63,0.10)",
          display:         "flex",
          alignItems:      "center",
          justifyContent:  "center",
          flexShrink:      0,
        }}>
          <span className="font-druk" style={{ fontSize: "clamp(13px, 1vw, 16px)", color: TEXT, lineHeight: 1 }}>
            {name.charAt(0)}
          </span>
        </div>
        <div>
          <p style={{ margin: 0, fontSize: "clamp(12px, 0.85vw, 14px)", fontWeight: 600, color: TEXT, lineHeight: 1.3 }}>{name}</p>
          <p style={{ margin: 0, fontSize: "clamp(10px, 0.7vw, 12px)", color: MUTED, letterSpacing: "0.01em", lineHeight: 1.4 }}>{product}</p>
        </div>
      </div>
    </div>
  )
}

function MarqueeRow({ reviews, reverse = false }: { reviews: Review[]; reverse?: boolean }) {
  // Duplicate 3× so there are enough cards to fill ultra-wide screens without gaps
  const triple = [...reviews, ...reviews, ...reviews]
  const loopDist = reviews.length * 440  // rough estimate per card+gap; motion handles the rest
  const duration = reviews.length * 6

  return (
    <div style={{ overflow: "hidden", width: "100%" }}>
      <motion.div
        initial={{ x: reverse ? -loopDist : 0 }}
        animate={{ x: reverse ? 0 : -loopDist }}
        transition={{ duration, repeat: Infinity, ease: "linear", repeatType: "loop" }}
        style={{ display: "flex", width: "max-content" }}
      >
        {triple.map((r, i) => <Card key={i} {...r} />)}
      </motion.div>
    </div>
  )
}

export function Section06_Reviews() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] })
  const headerY = useTransform(scrollYProgress, [0, 1], [32, -32])

  return (
    <section
      ref={sectionRef}
      style={{
        background: "#bcc0ca",
        padding:    "clamp(80px,12vh,160px) 0 clamp(88px,14vh,180px)",
        overflow:   "hidden",
      }}
    >
      {/* Header */}
      <motion.div style={{
        y:            headerY,
        textAlign:    "center",
        padding:      "0 clamp(20px,5vw,80px)",
        marginBottom: "clamp(40px, 6vh, 72px)",
      }}>
        <p className="font-ekstra uppercase" style={{
          fontSize:      "clamp(8px, 0.55vw, 10px)",
          letterSpacing: "0.52em",
          color:         "rgba(53,56,63,0.38)",
          marginBottom:  "clamp(16px, 1.6vh, 24px)",
        }}>
          Echte Stimmen
        </p>
        <h2 className="font-druk-wide uppercase" style={{
          fontSize:      "clamp(2rem, 3.8vw, 4.8rem)",
          letterSpacing: "-0.03em",
          lineHeight:    0.95,
          color:         TEXT,
          margin:        0,
        }}>
          Was unsere Kunden sagen.
        </h2>
        {/* Divider line */}
        <div style={{
          width:        "clamp(36px, 3.5vw, 56px)",
          height:       2,
          background:   "rgba(53,56,63,0.18)",
          borderRadius: 1,
          margin:       "clamp(18px, 2vh, 28px) auto 0",
        }} />
      </motion.div>

      {/* Marquee rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: "clamp(14px, 1.4vw, 20px)" }}>
        <MarqueeRow reviews={ROW1} />
        <MarqueeRow reviews={ROW2} reverse />
      </div>
    </section>
  )
}
