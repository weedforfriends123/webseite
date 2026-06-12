"use client"

import { useReducedMotion, motion } from "framer-motion"

/* ── colours (BG matches Hero exactly for seamless continuation) ── */
const BG     = "#bcc0ca"
const CARD   = "#2E2C52"   // dark muted purple — readable, tone-on-tone with BG purple undertone
const CREAM  = "#F2F0E5"
const INDIGO = "#222058"
const YELLOW = "#EDDC8C"
const SUB    = "rgba(242,240,229,0.65)"

/* ── row data ─────────────────────────────────────────────────────── */
type Row = {
  id: string
  img: string
  alt: string
  badge?: string         // optional yellow badge text
  headline: string
  sub: string
  flip: boolean          // flip=false → product L / card R
}

const ROWS: Row[] = [
  {
    id: "row-flavour",
    img: "/pouches/amnesia-haze.png",
    alt: "Amnesia Haze Pouch",
    headline: "MORE\nFLAVOUR",
    sub: "Gelato — cremig, fruchtig, dessert-soft.\nEchte Terpene. Echter Geschmack.",
    flip: false,
  },
  {
    id: "row-puffs",
    img: "/pouches/northern-lights.png",
    alt: "Northern Lights Pouch",
    badge: "600×",
    headline: "600\nPUFFS",
    sub: "Pro Sachet. Smooth bis zum letzten Zug.\nKein Absatz, kein Nachlassen.",
    flip: true,
  },
  {
    id: "row-eu",
    img: "/pouches/ice-cream-cookies.png",
    alt: "Ice Cream Cookies Pouch",
    headline: "EU MADE\nLAB-TESTED",
    sub: "Hergestellt in der EU, laborgeprüft.\nNicotine & THC free.",
    flip: false,
  },
]

/* ── W-badge sticker ──────────────────────────────────────────────── */
function WBadge({ accent }: { accent?: string }) {
  return (
    <div style={{
      position: "absolute",
      top: -30, left: "50%",
      transform: "translateX(-50%)",
      width: 60, height: 60,
      borderRadius: "50%",
      background: accent ? YELLOW : INDIGO,
      border: `3px solid ${CREAM}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: "0 6px 20px rgba(0,0,0,0.38)",
      zIndex: 10, flexShrink: 0,
    }}>
      <span
        className="font-druk-wide uppercase"
        style={{
          color: accent ? INDIGO : CREAM,
          fontSize: accent ? 13 : 22,
          lineHeight: 1,
          letterSpacing: accent ? "0.01em" : undefined,
        }}
      >
        {accent ?? "W"}
      </span>
    </div>
  )
}

/* ── single feature row ───────────────────────────────────────────── */
function FeatureRow({ row, noMotion }: { row: Row; noMotion: boolean | null }) {
  const fromProduct = row.flip ? 72 : -72
  const fromCard    = row.flip ? -72 : 72

  const productAnim = {
    hidden: { opacity: 0, x: fromProduct },
    show:   { opacity: 1, x: 0, transition: { duration: 0.95, ease: [0.16, 1, 0.3, 1] } },
  }
  const cardAnim = {
    hidden: { opacity: 0, x: fromCard },
    show:   { opacity: 1, x: 0, transition: { duration: 0.95, delay: 0.1, ease: [0.16, 1, 0.3, 1] } },
  }

  const Product = (
    <motion.div
      variants={noMotion ? undefined : productAnim}
      initial={noMotion ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      /* ribbon anchor — a ref/data-attr for the Schweif to dock to later */
      data-ribbon-anchor={row.id}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", zIndex: 2,
        /* product laps slightly over the card on its near side */
        ...(row.flip
          ? { marginLeft: "clamp(-48px,-4vw,-24px)" }
          : { marginRight: "clamp(-48px,-4vw,-24px)" }),
      }}
    >
      <motion.img
        src={row.img}
        alt={row.alt}
        animate={noMotion ? {} : { y: [0, -16, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        draggable={false}
        style={{
          height: "clamp(200px,34vh,460px)",
          width: "auto", objectFit: "contain",
          filter: "drop-shadow(0 28px 44px rgba(0,0,0,0.52)) drop-shadow(0 6px 18px rgba(0,0,0,0.26))",
          userSelect: "none", pointerEvents: "none",
        }}
      />
    </motion.div>
  )

  const Card = (
    <motion.div
      variants={noMotion ? undefined : cardAnim}
      initial={noMotion ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      style={{ position: "relative", zIndex: 1 }}
    >
      <WBadge accent={row.badge} />
      <div style={{
        background: CARD,
        borderRadius: 28,
        padding: "clamp(52px,7vh,88px) clamp(28px,4vw,52px) clamp(40px,5.5vh,72px)",
        display: "flex", flexDirection: "column", justifyContent: "center",
      }}>
        <h3
          className="font-druk-wide uppercase"
          style={{
            color: CREAM,
            fontSize: "clamp(38px,5.5vw,90px)",
            lineHeight: 0.88,
            margin: "0 0 clamp(14px,2vh,24px)",
            whiteSpace: "pre-line",
          }}
        >
          {row.headline}
        </h3>
        <p style={{
          color: SUB,
          fontSize: "clamp(14px,1.15vw,18px)",
          lineHeight: 1.72,
          margin: 0,
          whiteSpace: "pre-line",
        }}>
          {row.sub}
        </p>
      </div>
    </motion.div>
  )

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2"
      style={{
        alignItems: "center",
        minHeight: "78vh",
        gap: "clamp(0px,2vw,0px)",   // gap handled by product overlap margins
        padding: "clamp(48px,7vh,100px) clamp(24px,6vw,100px)",
      }}
    >
      {/* mobile order: product always on top */}
      <div className={row.flip ? "order-2 md:order-2" : "order-1 md:order-1"}>
        {row.flip ? Card : Product}
      </div>
      <div className={row.flip ? "order-1 md:order-1" : "order-2 md:order-2"}>
        {row.flip ? Product : Card}
      </div>
    </div>
  )
}

/* ── section export ───────────────────────────────────────────────── */
export function SectionFeatures() {
  const noMotion = useReducedMotion()

  return (
    <section style={{ background: BG, position: "relative" }}>
      {ROWS.map((row) => (
        <FeatureRow key={row.id} row={row} noMotion={noMotion} />
      ))}
    </section>
  )
}
