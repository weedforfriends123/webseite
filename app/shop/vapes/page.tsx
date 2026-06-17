"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "@/lib/cart"

// ── Per-flavor themes ─────────────────────────────────────────────────────────

const VAPES = [
  {
    key:      "amnesia-haze",
    name:     "Amnesia Haze",
    lineA:    "AMNESIA",
    lineB:    "HAZE",
    tagline:  "Uplifting & Citrus",
    desc:     "Frisch, zitrusig, klar im Kopf. Der Klassiker für alle, die einen energetischen, uplifting Vibe suchen — ohne Kompromisse beim Flavor.",
    flavor:   "Citrus · Earthy · Uplifting",
    bg:       "#060d08",
    accent:   "#a8c48a",
    glow:     "rgba(168,196,138,0.22)",
    img:      "/amnesia-vape.png",
  },
  {
    key:      "purple-haze",
    name:     "Purple Haze",
    lineA:    "PURPLE",
    lineB:    "HAZE",
    tagline:  "Euphoric & Berry",
    desc:     "Berry, süß, verspielt. Purple Haze bringt diesen euphorischen Feel — der Flavor ist komplex, tief und bleibt lange nach.",
    flavor:   "Berry · Sweet · Euphoric",
    bg:       "#09060f",
    accent:   "#c0a0d8",
    glow:     "rgba(192,160,216,0.20)",
    img:      "/purple-haze.png",
  },
  {
    key:      "northern-lights",
    name:     "Northern Lights",
    lineA:    "NORTHERN",
    lineB:    "LIGHTS",
    tagline:  "Relaxing & Deep",
    desc:     "Der absolute Klassiker. Ein Zug und du weißt Bescheid. Erdige Tiefe, ein Hauch Kiefer — entspannend, geerdet, pur.",
    flavor:   "Earthy · Pine · Citrus",
    bg:       "#040d14",
    accent:   "#8ab4cc",
    glow:     "rgba(138,180,204,0.20)",
    img:      "/pod-device.png",
  },
  {
    key:      "ice-cream-cookies",
    name:     "Ice Cream Cookies",
    lineA:    "ICE CREAM",
    lineB:    "COOKIES",
    tagline:  "Smooth & Creamy",
    desc:     "Cremig, süß, smooth bis zum Ende. Kein Kratzen, kein Nachlassen. Der Dessert-Vape für jeden Moment, der nach mehr schmeckt.",
    flavor:   "Cream · Sweet · Smooth",
    bg:       "#0e0c07",
    accent:   "#d4c4a4",
    glow:     "rgba(212,196,164,0.20)",
    img:      "/pod-device.png",
  },
  {
    key:      "girl-scout-cookies",
    name:     "Girl Scout Cookies",
    lineA:    "GIRL SCOUT",
    lineB:    "COOKIES",
    tagline:  "Classic & Complex",
    desc:     "Earthy, süß — ein echter Klassiker. Complex, balanciert und mit jedem Zug tiefer. Für die, die wissen was sie wollen.",
    flavor:   "Earthy · Sweet · Classic",
    bg:       "#100900",
    accent:   "#c4a868",
    glow:     "rgba(196,168,104,0.20)",
    img:      "/pod-device.png",
  },
  {
    key:      "gelato",
    name:     "Gelato",
    lineA:    "",
    lineB:    "GELATO",
    tagline:  "Dreamy & Sweet",
    desc:     "Dessert-Feeling mit jedem Zug. Vanilla trifft Frucht — smooth, warm, träumerisch. Gelato ist das Slow-Down nach einem langen Tag.",
    flavor:   "Sweet · Vanilla · Fruity",
    bg:       "#0e0705",
    accent:   "#e8b890",
    glow:     "rgba(232,184,144,0.20)",
    img:      "/pod-device.png",
  },
] as const

type Vape = typeof VAPES[number]

const PACKS = [
  { label: "1×",  price: 29.99,  perUnit: 29.99,  savings: null    },
  { label: "3×",  price: 79.99,  perUnit: 26.66,  savings: "−11%"  },
  { label: "5×",  price: 119.99, perUnit: 24.00,  savings: "−20%"  },
] as const

// ── Smooth mouse parallax (RAF, no re-renders) ────────────────────────────────

function useParallax() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const imgRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const img  = imgRef.current
    if (!wrap || !img) return

    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0

    function loop() {
      cx += (tx - cx) * 0.06
      cy += (ty - cy) * 0.06
      img!.style.transform = `perspective(900px) rotateY(${cx}deg) rotateX(${cy}deg) scale(1.04)`
      raf = requestAnimationFrame(loop)
    }
    function move(e: MouseEvent) {
      const r = wrap!.getBoundingClientRect()
      tx = -((e.clientX - r.left) / r.width  - 0.5) * 11
      ty =  ((e.clientY - r.top)  / r.height - 0.5) * 7
    }
    function leave() { tx = 0; ty = 0 }

    wrap.addEventListener("mousemove", move)
    wrap.addEventListener("mouseleave", leave)
    raf = requestAnimationFrame(loop)
    return () => {
      wrap.removeEventListener("mousemove", move)
      wrap.removeEventListener("mouseleave", leave)
      cancelAnimationFrame(raf)
    }
  }, [])

  return { wrapRef, imgRef }
}

// ── Grain overlay ─────────────────────────────────────────────────────────────

function Grain() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 pointer-events-none z-[990]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`,
        opacity: 0.030,
        mixBlendMode: "overlay",
      }}
    />
  )
}

// ── Image panel ───────────────────────────────────────────────────────────────

function ImagePanel({ vape }: { vape: Vape }) {
  const { wrapRef, imgRef } = useParallax()
  const words = [vape.lineA, vape.lineB].filter(Boolean)

  return (
    <div
      ref={wrapRef}
      className="relative flex items-center justify-center overflow-hidden"
      style={{ minHeight: "100dvh", cursor: "crosshair" }}
    >
      {/* Animated background on flavor switch */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${vape.key}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55 }}
          className="absolute inset-0"
          style={{
            background: [
              `radial-gradient(ellipse 65% 55% at 50% 40%, ${vape.glow}, transparent 68%)`,
              `radial-gradient(ellipse 35% 30% at 18% 75%, rgba(255,255,255,0.018), transparent 55%)`,
              `radial-gradient(ellipse 45% 38% at 82% 18%, rgba(255,255,255,0.012), transparent 55%)`,
              `linear-gradient(180deg, ${vape.bg} 0%, #05060a 100%)`,
            ].join(","),
          }}
        />
      </AnimatePresence>

      {/* Giant ghost product name */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none"
        aria-hidden
      >
        {words.map((w) => (
          <span
            key={w}
            className="font-druk-wide uppercase block text-center leading-none"
            style={{
              fontSize:      "clamp(4.5rem, 18vw, 22rem)",
              letterSpacing: "-0.045em",
              color:         vape.accent,
              opacity:       0.055,
            }}
          >
            {w}
          </span>
        ))}
      </div>

      {/* Floating flavor terms */}
      {vape.flavor.split(" · ").map((f, i) => (
        <motion.span
          key={`${vape.key}-${f}`}
          className="absolute font-ekstra uppercase pointer-events-none z-10"
          style={{
            fontSize:      "clamp(7px, 0.58vw, 8.5px)",
            letterSpacing: "0.34em",
            color:         vape.accent,
            opacity:       0.32,
            left:          `${12 + i * 29}%`,
            top:           `${20 + i * 24}%`,
          }}
          animate={{ y: [0, -9, 0] }}
          transition={{ duration: 6 + i * 1.5, repeat: Infinity, ease: "easeInOut", delay: i * 1.2 }}
        >
          {f}
        </motion.span>
      ))}

      {/* Product image with parallax */}
      <div
        ref={imgRef}
        className="relative z-10 will-change-transform"
        style={{ width: "clamp(160px, 30vw, 400px)", aspectRatio: "1 / 1.6" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`img-${vape.key}`}
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -14 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={vape.img}
              alt={vape.name}
              fill
              className="object-contain"
              style={{
                filter: [
                  "drop-shadow(0 60px 100px rgba(0,0,0,0.90))",
                  "drop-shadow(0 12px 36px rgba(0,0,0,0.60))",
                ].join(" "),
              }}
              sizes="(max-width: 768px) 70vw, 30vw"
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Accent ring under product */}
      <div
        className="absolute pointer-events-none z-0"
        style={{
          width:        "clamp(200px, 36vw, 480px)",
          aspectRatio:  "1 / 1",
          bottom:       "14%",
          left:         "50%",
          transform:    "translateX(-50%)",
          borderRadius: "50%",
          background:   `radial-gradient(ellipse at center, ${vape.glow}, transparent 70%)`,
          filter:       "blur(20px)",
          transition:   "background 0.6s ease",
        }}
      />

      {/* Bottom vignette */}
      <div
        className="absolute bottom-0 left-0 right-0 h-36 pointer-events-none z-20"
        style={{ background: `linear-gradient(to top, ${vape.bg}, transparent)` }}
      />
    </div>
  )
}

// ── Info panel ────────────────────────────────────────────────────────────────

function InfoPanel({
  vape, vapeIdx, pack, setPack, addToCart, added,
}: {
  vape:       Vape
  vapeIdx:    number
  pack:       number
  setPack:    (i: number) => void
  addToCart:  () => void
  added:      boolean
}) {
  const p = PACKS[pack]
  const flavors = vape.flavor.split(" · ")

  return (
    <motion.div
      key={`info-${vape.key}`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col justify-center px-8 md:px-12 xl:px-16 py-20 md:py-0"
      style={{ minHeight: "100dvh" }}
    >
      <div className="max-w-xs">

        {/* Index + tag */}
        <div className="flex items-center justify-between mb-6">
          <span className="font-mono" style={{ fontSize: 9, letterSpacing: "0.44em", color: "rgba(255,255,255,0.14)" }}>
            0{vapeIdx + 1} / 0{VAPES.length}
          </span>
          <span className="font-ekstra uppercase px-3 py-1" style={{ fontSize: 7.5, letterSpacing: "0.26em", background: vape.accent, color: "#0a0b0e" }}>
            HC 96% · 600 Puffs
          </span>
        </div>

        {/* Product name */}
        <h1 className="font-druk-wide uppercase leading-none mb-2"
          style={{ fontSize: "clamp(2rem, 4vw, 5rem)", letterSpacing: "-0.03em", color: "#ede9e1" }}>
          {vape.lineA && <span className="block">{vape.lineA}</span>}
          <span className="block">{vape.lineB}</span>
        </h1>

        {/* Accent rule */}
        <motion.div
          key={`rule-${vape.key}`}
          initial={{ width: 0 }}
          animate={{ width: 32 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{ height: 1.5, background: vape.accent, marginBottom: 20 }}
        />

        {/* Description */}
        <p className="font-ekstra mb-7" style={{ fontSize: "clamp(11px, 0.88vw, 13px)", color: "rgba(255,255,255,0.35)", lineHeight: 1.85 }}>
          {vape.desc}
        </p>

        {/* Flavor chips */}
        <div className="flex flex-wrap gap-2 mb-8">
          {flavors.map(f => (
            <span key={f} className="font-ekstra uppercase"
              style={{
                fontSize: 7.5, letterSpacing: "0.20em",
                padding: "5px 11px",
                border: `1px solid ${vape.accent}28`,
                color: vape.accent,
                background: `${vape.accent}0c`,
              }}
            >
              {f}
            </span>
          ))}
        </div>

        {/* Menge label */}
        <p className="font-ekstra uppercase mb-2.5" style={{ fontSize: 8, letterSpacing: "0.38em", color: "rgba(255,255,255,0.18)" }}>
          Menge
        </p>

        {/* Pack selector */}
        <div className="flex gap-2 mb-7">
          {PACKS.map((pk, i) => {
            const active = pack === i
            return (
              <button
                key={pk.label}
                onClick={() => setPack(i)}
                className="relative flex flex-col items-center justify-center gap-1 py-3 px-4 transition-all duration-200"
                style={{
                  minWidth: 62,
                  border: `1px solid ${active ? vape.accent : "rgba(255,255,255,0.09)"}`,
                  background: active ? vape.accent : "rgba(255,255,255,0.03)",
                }}
              >
                {pk.savings && (
                  <span className="absolute -top-2.5 right-1 font-ekstra uppercase px-1.5 py-px"
                    style={{ fontSize: 7, letterSpacing: "0.14em", background: active ? "rgba(255,255,255,0.85)" : vape.accent, color: "#0a0b0e" }}>
                    {pk.savings}
                  </span>
                )}
                <span className="font-druk-wide uppercase leading-none"
                  style={{ fontSize: "0.78rem", color: active ? "#0a0b0e" : "rgba(255,255,255,0.7)" }}>
                  {pk.label}
                </span>
                <span className="font-ekstra uppercase"
                  style={{ fontSize: 7.5, letterSpacing: "0.14em", color: active ? "rgba(0,0,0,0.44)" : "rgba(255,255,255,0.24)" }}>
                  €{pk.price.toFixed(0)}
                </span>
              </button>
            )
          })}
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-3 mb-7">
          <AnimatePresence mode="wait">
            <motion.span
              key={`price-${pack}`}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.14 }}
              className="font-druk-wide leading-none"
              style={{ fontSize: "clamp(2rem, 3.2vw, 3.5rem)", color: "#ede9e1" }}
            >
              €{p.price.toFixed(2)}
            </motion.span>
          </AnimatePresence>
          {pack > 0 && (
            <span className="font-ekstra" style={{ fontSize: 10, color: "rgba(255,255,255,0.22)" }}>
              €{p.perUnit.toFixed(2)} / Stk
            </span>
          )}
        </div>

        {/* CTA */}
        <div className="relative overflow-hidden mb-4">
          <motion.button
            onClick={addToCart}
            whileTap={{ scale: 0.975 }}
            className="relative w-full py-4 font-druk-wide uppercase overflow-hidden"
            style={{
              fontSize:      "clamp(0.72rem, 0.95vw, 0.85rem)",
              letterSpacing: "0.18em",
              background:    added ? "#1c3319" : vape.accent,
              color:         added ? "#6dba66" : "#0a0b0e",
              transition:    "background 0.4s, color 0.4s",
            }}
          >
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ x: "-100%" }} whileHover={{ x: "100%" }}
              transition={{ duration: 0.48, ease: "easeInOut" }}
              style={{ background: "rgba(255,255,255,0.14)", transform: "skewX(-10deg)" }}
            />
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={added ? "y" : "n"}
                initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.13 }}
                className="relative"
              >
                {added ? "✓ Im Warenkorb" : "In den Warenkorb"}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Trust */}
        <div className="flex gap-4 flex-wrap">
          {["0% Nikotin", "EU Zertifiziert", "Lab Tested"].map(t => (
            <div key={t} className="flex items-center gap-1.5">
              <div className="flex items-center justify-center"
                style={{ width: 14, height: 14, borderRadius: "50%", background: `${vape.accent}22` }}>
                <svg width="7" height="7" viewBox="0 0 8 8" fill="none">
                  <path d="M1.5 4l2 2 3-3" stroke={vape.accent} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="font-ekstra" style={{ fontSize: 8.5, color: "rgba(255,255,255,0.20)" }}>{t}</span>
            </div>
          ))}
        </div>

      </div>
    </motion.div>
  )
}

// ── Flavor nav bar ────────────────────────────────────────────────────────────

function FlavorNav({ sel, setSel }: { sel: number; setSel: (i: number) => void }) {
  return (
    <div
      className="sticky top-0 z-[999] flex items-center justify-between px-5 md:px-10 overflow-x-auto"
      style={{
        height:               54,
        background:           "rgba(8,9,12,0.92)",
        backdropFilter:       "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom:         "1px solid rgba(255,255,255,0.05)",
        gap:                  8,
      }}
    >
      {/* Logo / back */}
      <Link href="/" className="shrink-0 mr-4">
        <Image src="/logo.webp" alt="WFF" width={64} height={20} className="h-4 w-auto"
          style={{ filter: "invert(1) brightness(2)" }} />
      </Link>

      {/* Flavor tabs */}
      <div className="flex items-center gap-1 flex-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {VAPES.map((v, i) => {
          const active = sel === i
          const label  = v.lineA ? `${v.lineA} ${v.lineB}` : v.lineB
          return (
            <button
              key={v.key}
              onClick={() => setSel(i)}
              className="relative shrink-0 font-ekstra uppercase transition-all duration-200 px-3 py-1.5"
              style={{
                fontSize:      8.5,
                letterSpacing: "0.22em",
                color:         active ? v.accent : "rgba(255,255,255,0.22)",
                background:    active ? `${v.accent}14` : "transparent",
                border:        `1px solid ${active ? `${v.accent}40` : "transparent"}`,
                whiteSpace:    "nowrap",
              }}
            >
              {label}
              {active && (
                <motion.div
                  layoutId="flavor-underline"
                  className="absolute bottom-0 left-0 right-0"
                  style={{ height: 1.5, background: v.accent }}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Cart / section label */}
      <span className="font-ekstra uppercase shrink-0 ml-4" style={{ fontSize: 8.5, letterSpacing: "0.40em", color: "rgba(255,255,255,0.14)" }}>
        Vapes
      </span>
    </div>
  )
}

// ── Reviews ───────────────────────────────────────────────────────────────────

const REVIEWS = [
  { name: "Lena K.",   city: "Stuttgart", flavor: "Northern Lights",    rating: 5, date: "Juni 2025",
    text: "Hab nicht viel erwartet – aber wow. Kein Plastik-Nachgeschmack, zieht smooth. Bin gefixt." },
  { name: "Tobias M.", city: "Hamburg",   flavor: "Amnesia Haze",       rating: 5, date: "Mai 2025",
    text: "War skeptisch wegen dem Preis, aber man merkt sofort warum. Hab direkt nochmal bestellt lol" },
  { name: "Sara J.",   city: "Berlin",    flavor: "Purple Haze",        rating: 5, date: "Mai 2025",
    text: "Kein Account nötig, kam schnell, diskret verpackt. Genau so wie mans sich wünscht." },
  { name: "Nico F.",   city: "Köln",      flavor: "Gelato",             rating: 5, date: "April 2025",
    text: "Kauf hier jetzt seit 4 Monaten. Qualität ist jedes Mal gleich – das schätze ich am meisten." },
  { name: "Maya R.",   city: "München",   flavor: "Girl Scout Cookies", rating: 5, date: "April 2025",
    text: "Friends haben mich drauf gebracht und ich versteh jetzt warum. Der Flavor ist einfach clean." },
  { name: "Alex B.",   city: "Frankfurt", flavor: "Ice Cream Cookies",  rating: 5, date: "März 2025",
    text: "Ice Cream Cookies ist mein Favorit. Cremig, smooth, kein Kratzen. Bestelle regelmäßig." },
]

function VapesReviews() {
  const TEXT  = "#ede9e1"
  const MUTED = "rgba(237,233,225,0.38)"
  return (
    <section style={{ background: "#07080a", padding: "clamp(60px,10vh,100px) clamp(20px,5vw,72px)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          style={{ marginBottom: "clamp(36px,5vh,56px)" }}>
          <p className="font-ekstra uppercase mb-3" style={{ fontSize: 8.5, letterSpacing: "0.50em", color: "rgba(255,255,255,0.18)" }}>Kundenstimmen</p>
          <h2 className="font-druk-wide uppercase leading-none" style={{ fontSize: "clamp(2rem,5vw,6rem)", letterSpacing: "-0.03em", color: TEXT }}>
            Was sie sagen.
          </h2>
        </motion.div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(clamp(240px,28vw,380px),1fr))", gap: "clamp(10px,1vw,16px)" }}>
          {REVIEWS.map((r, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.06 }}
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", padding: "clamp(16px,1.6vw,24px)", display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", gap: 3 }}>
                {Array.from({ length: 5 }).map((_, si) => (
                  <svg key={si} width="11" height="11" viewBox="0 0 14 14" fill={si < r.rating ? "#c4983a" : "rgba(255,255,255,0.1)"}>
                    <path d="M7 1.5l1.37 2.78 3.07.45-2.22 2.16.52 3.06L7 8.5l-2.74 1.44.52-3.06L2.56 4.73l3.07-.45L7 1.5z"/>
                  </svg>
                ))}
              </div>
              <p style={{ fontSize: "clamp(12px,0.9vw,13px)", lineHeight: 1.72, color: MUTED, margin: 0 }}>"{r.text}"</p>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: "auto" }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span className="font-druk-wide" style={{ fontSize: 11, color: TEXT }}>{r.name.charAt(0)}</span>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 11, color: TEXT, lineHeight: 1.3 }}>{r.name}</p>
                  <p style={{ margin: 0, fontSize: 9, color: MUTED, lineHeight: 1.4 }}>{r.city} · {r.flavor}</p>
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
  { label: "Mengenrabatt",         wff: "−20%",       b: false,       c: "−10%"    },
]

function VapesComparison() {
  const TEXT  = "#ede9e1"
  const MUTED = "rgba(237,233,225,0.35)"
  const ACCENT = "#a0ba87"
  return (
    <section style={{ background: "#05060a", padding: "clamp(60px,10vh,100px) clamp(20px,5vw,72px)", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          style={{ marginBottom: "clamp(40px,6vh,64px)", textAlign: "center" }}>
          <p className="font-ekstra uppercase mb-3" style={{ fontSize: 8.5, letterSpacing: "0.50em", color: "rgba(255,255,255,0.18)" }}>Warum WFF</p>
          <h2 className="font-druk-wide uppercase leading-none" style={{ fontSize: "clamp(2rem,5vw,6rem)", letterSpacing: "-0.03em", color: TEXT }}>
            Im Vergleich.
          </h2>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.65 }}
          style={{ overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)" }}>
          {/* Header */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 0.8fr 0.8fr", background: "rgba(255,255,255,0.04)", padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ padding: "0 20px" }} />
            {[
              { label: "WFF Vapes", sub: "HC 96%", hi: true },
              { label: "Konkurrenz A", sub: "Standard", hi: false },
              { label: "Konkurrenz B", sub: "Premium", hi: false },
            ].map(({ label, sub, hi }) => (
              <div key={label} style={{ padding: "0 12px", textAlign: "center", borderLeft: `1px solid rgba(255,255,255,0.05)`, background: hi ? `${ACCENT}08` : "transparent" }}>
                <p className="font-druk-wide uppercase" style={{ fontSize: 10, letterSpacing: "0.06em", color: hi ? ACCENT : "rgba(255,255,255,0.28)", margin: "0 0 2px" }}>{label}</p>
                <p className="font-ekstra" style={{ fontSize: 8.5, color: "rgba(255,255,255,0.16)" }}>{sub}</p>
              </div>
            ))}
          </div>
          {COMPARE_ROWS.map((row, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 0.8fr 0.8fr", borderTop: "1px solid rgba(255,255,255,0.04)", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)" }}>
              <div style={{ padding: "13px 20px" }}>
                <span className="font-ekstra" style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>{row.label}</span>
              </div>
              {[{ val: row.wff, hi: true }, { val: row.b, hi: false }, { val: row.c, hi: false }].map(({ val, hi }, j) => (
                <div key={j} style={{ padding: "13px 12px", display: "flex", alignItems: "center", justifyContent: "center", borderLeft: `1px solid rgba(255,255,255,0.04)`, background: j === 0 ? `${ACCENT}06` : "transparent" }}>
                  {typeof val === "boolean" ? (
                    <div style={{ width: 18, height: 18, borderRadius: "50%", background: val ? `${ACCENT}22` : "transparent", border: val ? "none" : "1px solid rgba(255,255,255,0.10)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ color: val ? ACCENT : "rgba(255,255,255,0.20)", fontSize: val ? 9 : 11, lineHeight: 1 }}>{val ? "✓" : "−"}</span>
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
  const [sel,   setSel]   = useState(0)
  const [pack,  setPack]  = useState(0)
  const [added, setAdded] = useState(false)
  const { dispatch } = useCart()

  const vape = VAPES[sel]

  const handleFlavorChange = useCallback((i: number) => {
    setSel(i)
    setPack(0)
  }, [])

  function addToCart() {
    dispatch({ type: "ADD", item: {
      id: vape.key, name: vape.name,
      tagline: vape.flavor,
      price: PACKS[pack].price,
      pack: PACKS[pack].label,
    }})
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div style={{ background: "#07080a", minHeight: "100dvh" }}>
      <Grain />

      {/* Animated page background per flavor */}
      <motion.div
        key={`page-bg-${vape.key}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(ellipse 50% 40% at 25% 50%, ${vape.glow}, transparent 65%)`,
        }}
      />

      {/* Flavor nav */}
      <FlavorNav sel={sel} setSel={handleFlavorChange} />

      {/* Main hero: image left + info right */}
      <div
        className="relative z-10 flex flex-col md:flex-row"
        style={{ minHeight: "calc(100dvh - 54px)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        {/* Left: product image */}
        <div className="flex-1 md:w-[55%]" style={{ minHeight: "60dvh" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`panel-${vape.key}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <ImagePanel vape={vape} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Thin divider */}
        <div className="hidden md:block" style={{ width: 1, background: "rgba(255,255,255,0.04)", alignSelf: "stretch" }} />

        {/* Right: info */}
        <div className="flex-1 md:w-[45%] relative z-10" style={{ background: vape.bg, transition: "background 0.6s" }}>
          <AnimatePresence mode="wait">
            <InfoPanel
              key={`info-${vape.key}`}
              vape={vape}
              vapeIdx={sel}
              pack={pack}
              setPack={setPack}
              addToCart={addToCart}
              added={added}
            />
          </AnimatePresence>
        </div>
      </div>

      {/* Reviews + Comparison below */}
      <VapesReviews />
      <VapesComparison />

      {/* Footer */}
      <footer className="flex flex-col md:flex-row items-center justify-between gap-2 px-6 md:px-10 py-7"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: "#05060a" }}>
        <p className="font-ekstra uppercase" style={{ fontSize: 7.5, letterSpacing: "0.28em", color: "rgba(255,255,255,0.12)" }}>
          HC 96% · 600 Puffs · 1ml · 0% Nikotin
        </p>
        <p className="font-ekstra uppercase" style={{ fontSize: 7.5, letterSpacing: "0.28em", color: "rgba(255,255,255,0.12)" }}>
          © WFF 2026
        </p>
      </footer>
    </div>
  )
}
