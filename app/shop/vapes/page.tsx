"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "@/lib/cart"

// ── Brand tokens (Section01_Hero) ─────────────────────────────────────────────
const BG    = "#bcc0ca"
const TEXT  = "#35383f"
const MUTED = "rgba(53,56,63,0.50)"
const LIGHT = "#e8e4dc"
const GOLD  = "#eddc8c"

// ── Per-flavor data ───────────────────────────────────────────────────────────

const VAPES = [
  {
    key:     "amnesia-haze",
    lineA:   "AMNESIA",
    lineB:   "HAZE",
    tagline: "Citrus · Earthy · Uplifting",
    desc:    "Frisch, zitrusig, klar im Kopf. Der Klassiker für alle, die einen energetischen, uplifting Vibe suchen — ohne Kompromisse beim Flavor.",
    glow:    "rgba(168,196,138,0.30)",
    img:     "/amnesia-vape.png",
  },
  {
    key:     "purple-haze",
    lineA:   "PURPLE",
    lineB:   "HAZE",
    tagline: "Berry · Sweet · Euphoric",
    desc:    "Berry, süß, verspielt. Purple Haze bringt diesen euphorischen Feel — der Flavor ist komplex, tief und bleibt lange nach.",
    glow:    "rgba(192,160,216,0.28)",
    img:     "/purple-haze.png",
  },
  {
    key:     "northern-lights",
    lineA:   "NORTHERN",
    lineB:   "LIGHTS",
    tagline: "Earthy · Pine · Citrus",
    desc:    "Der absolute Klassiker. Ein Zug und du weißt Bescheid. Erdige Tiefe, ein Hauch Kiefer — entspannend, geerdet, pur.",
    glow:    "rgba(138,180,204,0.28)",
    img:     "/pod-device.png",
  },
  {
    key:     "ice-cream-cookies",
    lineA:   "ICE CREAM",
    lineB:   "COOKIES",
    tagline: "Cream · Sweet · Smooth",
    desc:    "Cremig, süß, smooth bis zum Ende. Kein Kratzen, kein Nachlassen. Der Dessert-Vape für jeden Moment, der nach mehr schmeckt.",
    glow:    "rgba(212,196,164,0.28)",
    img:     "/pod-device.png",
  },
  {
    key:     "girl-scout-cookies",
    lineA:   "GIRL SCOUT",
    lineB:   "COOKIES",
    tagline: "Earthy · Sweet · Classic",
    desc:    "Earthy, süß — ein echter Klassiker. Complex, balanciert und mit jedem Zug tiefer. Für die, die wissen was sie wollen.",
    glow:    "rgba(196,168,104,0.28)",
    img:     "/pod-device.png",
  },
  {
    key:     "gelato",
    lineA:   "",
    lineB:   "GELATO",
    tagline: "Sweet · Vanilla · Fruity",
    desc:    "Dessert-Feeling mit jedem Zug. Vanilla trifft Frucht — smooth, warm, träumerisch. Das Slow-Down nach einem langen Tag.",
    glow:    "rgba(232,184,144,0.28)",
    img:     "/pod-device.png",
  },
] as const

type Vape = typeof VAPES[number]

const PACKS = [
  { label: "1×",  price: 29.99,  perUnit: 29.99,  savings: null    },
  { label: "3×",  price: 79.99,  perUnit: 26.66,  savings: "−11%"  },
  { label: "5×",  price: 119.99, perUnit: 24.00,  savings: "−20%"  },
] as const

// ── Stat strip (like Section01) ───────────────────────────────────────────────

function StatStrip() {
  return (
    <div style={{ display: "inline-flex", alignItems: "stretch", gap: 0 }}>
      {(["600 PUFFS", "LAB TESTED", "0% NIKOTIN"] as const).map((s, i) => {
        const [val, lbl] = s.split(" ")
        return (
          <div key={s} style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
            paddingLeft: i > 0 ? "clamp(12px,2vw,28px)" : 0,
            marginLeft:  i > 0 ? "clamp(12px,2vw,28px)" : 0,
            borderLeft:  i > 0 ? `1px solid rgba(53,56,63,0.18)` : "none",
          }}>
            <span className="font-druk" style={{ fontSize: "clamp(16px,2.2vw,36px)", color: TEXT, lineHeight: 1, letterSpacing: "-0.03em" }}>
              {val}
            </span>
            <span className="font-ekstra uppercase" style={{ fontSize: "clamp(7px,0.55vw,9px)", color: MUTED, letterSpacing: "0.18em" }}>
              {lbl}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ── Hero section ──────────────────────────────────────────────────────────────

function HeroBuy() {
  const [sel,   setSel]   = useState(0)
  const [pack,  setPack]  = useState(0)
  const [added, setAdded] = useState(false)
  const { dispatch } = useCart()
  const vape = VAPES[sel]
  const p    = PACKS[pack]

  const handleSel = useCallback((i: number) => { setSel(i); setPack(0) }, [])

  function addToCart() {
    dispatch({ type: "ADD", item: {
      id:      vape.key,
      name:    vape.lineA ? `${vape.lineA} ${vape.lineB}` : vape.lineB,
      tagline: vape.tagline,
      price:   p.price,
      pack:    p.label,
    }})
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <section style={{ background: BG, minHeight: "100dvh", position: "relative", overflow: "hidden" }}>

      {/* Animated radial glow per flavor */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`glow-${vape.key}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          aria-hidden
          style={{
            position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
            background: `radial-gradient(ellipse 65% 55% at 38% 54%, ${vape.glow}, transparent 65%)`,
          }}
        />
      </AnimatePresence>

      {/* ── Sticky header ── */}
      <div
        style={{
          position: "sticky", top: 0, zIndex: 50,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 clamp(16px,4vw,56px)",
          height: 54,
          background: "rgba(188,192,202,0.85)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderBottom: "1px solid rgba(53,56,63,0.09)",
        }}
      >
        <Link href="/">
          <Image src="/logo.webp" alt="WFF" width={64} height={20} className="h-4 w-auto" />
        </Link>

        {/* Flavor tabs */}
        <div className="hidden md:flex items-center gap-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {VAPES.map((v, i) => {
            const active = sel === i
            const label  = v.lineA ? `${v.lineA} ${v.lineB}` : v.lineB
            return (
              <button
                key={v.key}
                onClick={() => handleSel(i)}
                className="relative font-ekstra uppercase shrink-0 px-3 py-1.5 transition-all duration-200"
                style={{
                  fontSize:      8,
                  letterSpacing: "0.22em",
                  color:         active ? TEXT : MUTED,
                  background:    active ? "rgba(53,56,63,0.10)" : "transparent",
                  border:        `1px solid ${active ? "rgba(53,56,63,0.22)" : "transparent"}`,
                  whiteSpace:    "nowrap",
                }}
              >
                {label}
                {active && (
                  <motion.div layoutId="tab-underline"
                    className="absolute bottom-0 left-0 right-0"
                    style={{ height: 1.5, background: TEXT }}
                  />
                )}
              </button>
            )
          })}
        </div>

        <span className="font-ekstra uppercase" style={{ fontSize: 8, letterSpacing: "0.38em", color: MUTED }}>
          Vapes
        </span>
      </div>

      {/* ── Main grid ── */}
      <div
        className="grid grid-cols-1 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
        style={{
          position: "relative", zIndex: 1,
          maxWidth: 1400, margin: "0 auto",
          minHeight: "calc(100dvh - 54px)",
          alignItems: "center",
          padding: "clamp(24px,4vh,56px) clamp(16px,4vw,72px)",
          gap: "clamp(16px,2vw,40px)",
        }}
      >

        {/* ══ LEFT — product image ══ */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>

          {/* Mobile: all images in DOM */}
          <div className="block md:hidden" style={{ position: "relative", height: "46vh", width: "100%" }}>
            {VAPES.map((v, i) => (
              <motion.div
                key={v.key + "-m"}
                animate={{
                  opacity: i === sel ? 1 : 0,
                  x: i === sel ? 0 : i < sel ? -50 : 50,
                }}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: "absolute", inset: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  pointerEvents: i === sel ? "auto" : "none",
                }}
              >
                <img
                  src={v.img}
                  alt={`${v.lineA} ${v.lineB}`}
                  style={{
                    height: "46vh", width: "auto", objectFit: "contain",
                    filter: "drop-shadow(0 30px 60px rgba(53,56,63,0.28)) drop-shadow(0 8px 20px rgba(53,56,63,0.18))",
                    userSelect: "none", pointerEvents: "none", display: "block",
                  }}
                  draggable={false}
                />
              </motion.div>
            ))}

            {/* Mobile prev/next */}
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 8px", pointerEvents: "none", zIndex: 10 }}>
              {[
                { dir: -1, show: sel > 0 },
                { dir: 1,  show: sel < VAPES.length - 1 },
              ].map(({ dir, show }) => (
                <button
                  key={dir}
                  onClick={() => handleSel(sel + dir)}
                  style={{
                    pointerEvents: "all", width: 32, height: 32, borderRadius: "50%",
                    background: "rgba(255,255,255,0.60)",
                    border: "1px solid rgba(255,255,255,0.75)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    opacity: show ? 1 : 0, cursor: show ? "pointer" : "default",
                    transition: "opacity 0.2s",
                  }}
                >
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke={TEXT} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d={dir === -1 ? "M6 1.5L3 4.5L6 7.5" : "M3 1.5L6 4.5L3 7.5"} />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* Desktop: spring fly-in + float (exactly like Section01) */}
          <div className="hidden md:block">
            <AnimatePresence mode="wait">
              <motion.div
                key={vape.key + "-d"}
                initial={{ y: "-110%", rotate: -10, opacity: 0 }}
                animate={{ y: 0, rotate: 0, opacity: 1 }}
                exit={{ y: "55%", rotate: 8, opacity: 0, scale: 0.88 }}
                transition={{
                  y:       { type: "spring", stiffness: 200, damping: 22, mass: 0.9 },
                  rotate:  { type: "spring", stiffness: 180, damping: 20 },
                  opacity: { duration: 0.2 },
                }}
              >
                <motion.div
                  animate={{ y: [0, -18, 0] }}
                  transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <img
                    src={vape.img}
                    alt={`${vape.lineA} ${vape.lineB}`}
                    style={{
                      height: "clamp(340px,56vh,740px)", width: "auto", objectFit: "contain",
                      filter: "drop-shadow(0 50px 90px rgba(53,56,63,0.30)) drop-shadow(0 12px 28px rgba(53,56,63,0.20))",
                      userSelect: "none", pointerEvents: "none", display: "block",
                    }}
                    draggable={false}
                  />
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ══ RIGHT — info panel ══ */}
        <div style={{
          display: "flex", flexDirection: "column",
          background: "rgba(232,228,220,0.32)",
          backdropFilter: "blur(28px) saturate(130%)",
          WebkitBackdropFilter: "blur(28px) saturate(130%)",
          border: "1px solid rgba(255,255,255,0.52)",
          padding: "clamp(28px,4vh,48px) clamp(24px,3.5vw,52px)",
          gap: "clamp(16px,2.2vh,26px)",
        }}>

          {/* Eyebrow */}
          <p className="font-ekstra uppercase" style={{ fontSize: 8, letterSpacing: "0.52em", color: MUTED, margin: 0 }}>
            HC Disposable Vape · 96% · 1 ML · 600 Puffs
          </p>

          {/* Product name — line1 outline, line2 filled (Section01 style) */}
          <AnimatePresence mode="wait">
            <motion.h1
              key={`name-${vape.key}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="font-druk-wide uppercase"
              style={{ lineHeight: 0.86, letterSpacing: "-0.03em", margin: 0 }}
            >
              {vape.lineA && (
                <span
                  className="block"
                  style={{
                    fontSize: "clamp(2.4rem,4.6vw,6.5rem)",
                    color: "transparent",
                    WebkitTextStroke: `clamp(1.5px,0.13vw,2.2px) ${TEXT}`,
                  }}
                >
                  {vape.lineA}
                </span>
              )}
              <span
                className="block"
                style={{ fontSize: "clamp(2.4rem,4.6vw,6.5rem)", color: TEXT }}
              >
                {vape.lineB}
              </span>
            </motion.h1>
          </AnimatePresence>

          {/* Stat strip */}
          <StatStrip />

          {/* Description */}
          <AnimatePresence mode="wait">
            <motion.p
              key={`desc-${vape.key}`}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              style={{ fontSize: "clamp(11px,0.9vw,13px)", color: MUTED, lineHeight: 1.82, margin: 0 }}
            >
              {vape.desc}
            </motion.p>
          </AnimatePresence>

          <div style={{ height: 1, background: "rgba(53,56,63,0.10)" }} />

          {/* Mobile flavor selector */}
          <div className="block md:hidden">
            <p className="font-ekstra uppercase mb-2" style={{ fontSize: 8, letterSpacing: "0.46em", color: MUTED }}>Sorte</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {VAPES.map((v, i) => {
                const active = sel === i
                const label  = v.lineA ? `${v.lineA} ${v.lineB}` : v.lineB
                return (
                  <button key={v.key} onClick={() => handleSel(i)} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "7px 12px", textAlign: "left",
                    background: active ? "rgba(255,255,255,0.45)" : "transparent",
                    border: active ? "1px solid rgba(255,255,255,0.65)" : "1px solid transparent",
                    borderRadius: 8, cursor: "pointer", transition: "all 0.18s",
                  }}>
                    <span className="font-druk-wide uppercase" style={{
                      fontSize: 10, letterSpacing: "0.06em",
                      color: active ? TEXT : MUTED, transition: "color 0.18s",
                    }}>{label}</span>
                    {active && <motion.div layoutId="mob-dot" style={{ width: 5, height: 5, borderRadius: "50%", background: TEXT }} />}
                  </button>
                )
              })}
            </div>
            <div style={{ height: 1, background: "rgba(53,56,63,0.10)", marginTop: 12 }} />
          </div>

          {/* Menge label */}
          <p className="font-ekstra uppercase" style={{ fontSize: 8, letterSpacing: "0.46em", color: MUTED, margin: 0 }}>Menge</p>

          {/* Pack selector */}
          <div style={{ display: "flex", gap: 8 }}>
            {PACKS.map((pk, i) => (
              <button key={pk.label} onClick={() => setPack(i)} style={{
                position: "relative",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                padding: "10px 20px",
                background:     pack === i ? TEXT : "rgba(255,255,255,0.40)",
                backdropFilter: pack === i ? "none" : "blur(8px)",
                border: `1px solid ${pack === i ? "transparent" : "rgba(255,255,255,0.58)"}`,
                borderRadius: 10, cursor: "pointer", transition: "all 0.18s",
              }}>
                {pk.savings && (
                  <span style={{
                    position: "absolute", top: -8, right: 4,
                    fontSize: 8, color: pack === i ? "#b8d8a0" : "#5a8a44",
                    fontFamily: "inherit",
                  }} className="font-ekstra">{pk.savings}</span>
                )}
                <span className="font-druk-wide uppercase" style={{ fontSize: 14, lineHeight: 1, color: pack === i ? LIGHT : TEXT }}>
                  {pk.label}
                </span>
                <span className="font-ekstra" style={{ fontSize: 9, color: pack === i ? "rgba(232,228,220,0.55)" : MUTED }}>
                  €{pk.price.toFixed(0)}
                </span>
              </button>
            ))}
          </div>

          {/* Dots (desktop) */}
          <div className="hidden md:flex" style={{ gap: 8, alignItems: "center" }}>
            {VAPES.map((v, i) => (
              <button key={v.key} onClick={() => handleSel(i)}
                style={{ border: "none", cursor: "pointer", padding: "6px 4px", background: "none", display: "flex" }}>
                <motion.div
                  animate={{ width: i === sel ? 26 : 8, opacity: i === sel ? 1 : 0.28 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  style={{ height: 5, borderRadius: 99, background: TEXT }}
                />
              </button>
            ))}
          </div>

          {/* Price */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
            <AnimatePresence mode="wait">
              <motion.span
                key={`p-${pack}`}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.14 }}
                className="font-druk"
                style={{ fontSize: "clamp(2.2rem,3.6vw,4.8rem)", color: TEXT, lineHeight: 1 }}
              >
                €{p.price.toFixed(2)}
              </motion.span>
            </AnimatePresence>
            {pack > 0 && (
              <span className="font-ekstra" style={{ fontSize: 11, color: MUTED }}>
                €{p.perUnit.toFixed(2)} / Stk
              </span>
            )}
          </div>

          {/* CTA */}
          <button onClick={addToCart} style={{
            width: "100%", padding: "16px 24px",
            background: added ? "#a0ba87" : TEXT,
            color: LIGHT, border: "none", borderRadius: 9999, cursor: "pointer",
            fontSize: 11, letterSpacing: "0.24em",
            transition: "all 0.30s",
            boxShadow: added ? "none" : "0 8px 28px rgba(53,56,63,0.22)",
          }} className="font-druk-wide uppercase">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={added ? "y" : "n"}
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.13 }} style={{ display: "block" }}
              >
                {added ? "✓ Im Warenkorb" : "In den Warenkorb"}
              </motion.span>
            </AnimatePresence>
          </button>

          {/* Trust */}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {["Lab Tested", "EU Zertifiziert", "0% Nikotin"].map(t => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{
                  width: 13, height: 13, borderRadius: "50%",
                  background: "rgba(160,186,135,0.28)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="7" height="7" viewBox="0 0 8 8" fill="none">
                    <path d="M1.5 4l2 2 3-3" stroke="#5a9a4a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="font-ekstra" style={{ fontSize: 9, color: MUTED }}>{t}</span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Scribble — like Section01 */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.5 }}
        aria-hidden
        className="hidden md:block"
        style={{
          position: "absolute",
          top: "clamp(72px,11vh,170px)",
          left: "clamp(16px,12vw,200px)",
          transform: "rotate(-4deg)",
          zIndex: 10, pointerEvents: "none", userSelect: "none",
        }}
      >
        <p className="font-mindflow" style={{ color: GOLD, fontSize: "clamp(13px,1.6vw,24px)", lineHeight: 1.55 }}>
          Real Flavor,<br />Original Taste
        </p>
        <svg width="34" height="28" viewBox="0 0 46 38" style={{ marginTop: 4 }}>
          <path d="M5 5 Q18 22 38 32" fill="none" stroke={GOLD} strokeWidth="1.3" strokeLinecap="round" />
          <path d="M38 32L30 27M38 32L31 22" fill="none" stroke={GOLD} strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      </motion.div>
    </section>
  )
}

// ── Reviews ───────────────────────────────────────────────────────────────────

const REVIEWS = [
  { name: "Lena K.",   city: "Stuttgart", flavor: "Northern Lights",    rating: 5, text: "Hab nicht viel erwartet – aber wow. Kein Plastik-Nachgeschmack, zieht smooth. Bin gefixt." },
  { name: "Tobias M.", city: "Hamburg",   flavor: "Amnesia Haze",       rating: 5, text: "War skeptisch wegen dem Preis, aber man merkt sofort warum. Hab direkt nochmal bestellt lol" },
  { name: "Sara J.",   city: "Berlin",    flavor: "Purple Haze",        rating: 5, text: "Kein Account nötig, kam schnell, diskret verpackt. Genau so wie mans sich wünscht." },
  { name: "Nico F.",   city: "Köln",      flavor: "Gelato",             rating: 5, text: "Kauf hier jetzt seit 4 Monaten. Qualität ist jedes Mal gleich – das schätze ich am meisten." },
  { name: "Maya R.",   city: "München",   flavor: "Girl Scout Cookies", rating: 5, text: "Friends haben mich drauf gebracht und ich versteh jetzt warum. Der Flavor ist einfach clean." },
  { name: "Alex B.",   city: "Frankfurt", flavor: "Ice Cream Cookies",  rating: 5, text: "Ice Cream Cookies ist mein Favorit. Cremig, smooth, kein Kratzen. Bestelle regelmäßig." },
]

function VapesReviews() {
  return (
    <section style={{ background: BG, padding: "clamp(60px,10vh,100px) clamp(20px,5vw,72px)", borderTop: "1px solid rgba(53,56,63,0.10)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          style={{ marginBottom: "clamp(36px,5vh,56px)" }}>
          <p className="font-ekstra uppercase mb-3" style={{ fontSize: 9, letterSpacing: "0.50em", color: MUTED }}>Kundenstimmen</p>
          <h2 className="font-druk-wide uppercase leading-none"
            style={{ fontSize: "clamp(2rem,5vw,7rem)", letterSpacing: "-0.03em" }}>
            <span style={{ color: "transparent", WebkitTextStroke: `clamp(1.5px,0.13vw,2px) ${TEXT}`, display: "block" }}>Was sie</span>
            <span style={{ color: TEXT, display: "block" }}>sagen.</span>
          </h2>
        </motion.div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(clamp(240px,28vw,380px),1fr))", gap: "clamp(10px,1.2vw,18px)" }}>
          {REVIEWS.map((r, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.06 }}
              style={{
                background: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.80)",
                borderRadius: "clamp(12px,1.1vw,18px)",
                padding: "clamp(16px,1.6vw,24px)",
                boxShadow: "0 2px 16px rgba(53,56,63,0.06)",
                display: "flex", flexDirection: "column", gap: 10,
              }}>
              <div style={{ display: "flex", gap: 3 }}>
                {Array.from({ length: 5 }).map((_, si) => (
                  <svg key={si} width="12" height="12" viewBox="0 0 14 14" fill={si < r.rating ? "#c4983a" : "rgba(53,56,63,0.12)"}>
                    <path d="M7 1.5l1.37 2.78 3.07.45-2.22 2.16.52 3.06L7 8.5l-2.74 1.44.52-3.06L2.56 4.73l3.07-.45L7 1.5z"/>
                  </svg>
                ))}
              </div>
              <p style={{ fontSize: "clamp(12px,0.9vw,14px)", lineHeight: 1.72, color: "rgba(53,56,63,0.70)", margin: 0 }}>"{r.text}"</p>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: "auto" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(53,56,63,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span className="font-druk" style={{ fontSize: 12, color: TEXT }}>{r.name.charAt(0)}</span>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 12, color: TEXT, lineHeight: 1.3 }}>{r.name}</p>
                  <p style={{ margin: 0, fontSize: 9.5, color: MUTED }}>{r.city} · {r.flavor}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Comparison ────────────────────────────────────────────────────────────────

const COMPARE_ROWS = [
  { label: "Preis pro Stück",      wff: "ab €24.00", b: "ab €32.00", c: "ab €28.00" },
  { label: "HC / Wirkstoffgehalt", wff: "96%",        b: "k.A.",      c: "70–80%"   },
  { label: "COA Prüfzeugnis",      wff: true,         b: false,       c: false      },
  { label: "EU Zertifiziert",      wff: true,         b: false,       c: true       },
  { label: "0% Nikotin & Tabak",   wff: true,         b: true,        c: true       },
  { label: "Natürliche Terpene",   wff: true,         b: false,       c: false      },
  { label: "Puffs pro Gerät",      wff: "600",        b: "400",       c: "500"      },
  { label: "6 Sorten",             wff: true,         b: false,       c: false      },
  { label: "Mengenrabatt bis",     wff: "−20%",       b: false,       c: "−10%"    },
]

function VapesComparison() {
  const ACCENT = "#a0ba87"
  return (
    <section style={{ background: LIGHT, padding: "clamp(60px,10vh,100px) clamp(20px,5vw,72px)", borderTop: "1px solid rgba(53,56,63,0.08)" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: "clamp(40px,6vh,64px)" }}>
          <p className="font-ekstra uppercase mb-3" style={{ fontSize: 9, letterSpacing: "0.50em", color: MUTED }}>Warum WFF</p>
          <h2 className="font-druk-wide uppercase leading-none"
            style={{ fontSize: "clamp(2rem,5vw,7rem)", letterSpacing: "-0.03em" }}>
            <span style={{ color: "transparent", WebkitTextStroke: `clamp(1.5px,0.13vw,2px) ${TEXT}`, display: "block" }}>Unser Vape</span>
            <span style={{ color: TEXT, display: "block" }}>im Vergleich.</span>
          </h2>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.65 }}
          style={{ overflow: "hidden", borderRadius: "clamp(14px,1.4vw,22px)", border: "1px solid rgba(53,56,63,0.10)", boxShadow: "0 4px 40px rgba(53,56,63,0.09)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 0.8fr 0.8fr", background: TEXT, padding: "14px 0" }}>
            <div style={{ padding: "0 clamp(12px,1.8vw,24px)" }} />
            {[{ label: "WFF Vapes", sub: "HC 96%", hi: true }, { label: "Konkurrenz A", sub: "Standard", hi: false }, { label: "Konkurrenz B", sub: "Premium", hi: false }].map(({ label, sub, hi }) => (
              <div key={label} style={{ padding: "0 clamp(8px,1.2vw,16px)", textAlign: "center", borderLeft: `1px solid rgba(255,255,255,0.07)`, background: hi ? `${ACCENT}0a` : "transparent" }}>
                <p className="font-druk-wide uppercase" style={{ fontSize: 10, letterSpacing: "0.06em", color: hi ? ACCENT : "rgba(255,255,255,0.38)", margin: "0 0 2px" }}>{label}</p>
                <p className="font-ekstra" style={{ fontSize: 8.5, color: "rgba(255,255,255,0.22)" }}>{sub}</p>
              </div>
            ))}
          </div>
          {COMPARE_ROWS.map((row, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 0.8fr 0.8fr", background: i % 2 === 0 ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.42)", borderTop: "1px solid rgba(53,56,63,0.06)" }}>
              <div style={{ padding: "clamp(10px,1.2vh,15px) clamp(12px,1.8vw,24px)" }}>
                <span className="font-ekstra" style={{ fontSize: "clamp(11px,0.85vw,13px)", color: TEXT }}>{row.label}</span>
              </div>
              {[{ val: row.wff, hi: true }, { val: row.b, hi: false }, { val: row.c, hi: false }].map(({ val, hi }, j) => (
                <div key={j} style={{ padding: "clamp(10px,1.2vh,15px) clamp(8px,1.2vw,16px)", display: "flex", alignItems: "center", justifyContent: "center", borderLeft: `1px solid rgba(53,56,63,0.06)`, background: j === 0 ? `${ACCENT}06` : "transparent" }}>
                  {typeof val === "boolean" ? (
                    <div style={{ width: 18, height: 18, borderRadius: "50%", background: val ? "rgba(160,186,135,0.26)" : "transparent", border: val ? "none" : "1.5px solid rgba(53,56,63,0.14)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ color: val ? "#6aaa5a" : "rgba(53,56,63,0.22)", fontSize: val ? 9 : 12, lineHeight: 1 }}>{val ? "✓" : "−"}</span>
                    </div>
                  ) : (
                    <span className="font-ekstra" style={{ fontSize: 12, color: hi ? TEXT : MUTED }}>{val}</span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function VapesShopPage() {
  return (
    <>
      <HeroBuy />
      <VapesReviews />
      <VapesComparison />
    </>
  )
}
