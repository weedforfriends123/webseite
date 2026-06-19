"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion"
import dynamic from "next/dynamic"
const FloatingProduct = dynamic(
  () => import("@/components/FloatingProduct").then(m => m.FloatingProduct),
  { ssr: false }
)
import { useCart } from "@/lib/cart"
import { MetalButton } from "@/components/ui/metal-button"
import { HEADER_H } from "@/components/WFFHeader"

// ── Constants ─────────────────────────────────────────────────────────────────

const PAGE_BG  = "#35383f"
const TEXT_COL = "#35383f"

// ── Flavor data ───────────────────────────────────────────────────────────────

const VAPES = [
  { id: 0, key: "amnesia-haze",       lineA: "AMNESIA",    lineB: "HAZE",    desc: "Frisch, zitrusig, klar im Kopf.",   tags: { taste: "Citrus",  effect: "Uplifting", strength: 3 }, flavor: "Citrus · Earthy · Uplifting", bottom: "AMNESIA HAZE · HC 96% · SUPERIOR BLEND" },
  { id: 1, key: "purple-haze",        lineA: "PURPLE",     lineB: "HAZE",    desc: "Berry, süß, verspielt.",            tags: { taste: "Berry",   effect: "Euphoric",  strength: 3 }, flavor: "Berry · Sweet · Euphoric",    bottom: "PURPLE HAZE · HC 96% · SUPERIOR BLEND" },
  { id: 2, key: "northern-lights",    lineA: "NORTHERN",   lineB: "LIGHTS",  desc: "Ein Zug und du weißt Bescheid.",    tags: { taste: "Pine",    effect: "Relaxing",  strength: 4 }, flavor: "Earthy · Pine · Citrus",      bottom: "NORTHERN LIGHTS · HC 96% · SUPERIOR BLEND" },
  { id: 3, key: "ice-cream-cookies",  lineA: "ICE CREAM",  lineB: "COOKIES", desc: "Cremig, süß, smooth bis zum Ende.", tags: { taste: "Cream",   effect: "Smooth",    strength: 2 }, flavor: "Cream · Sweet · Smooth",      bottom: "ICE CREAM COOKIES · HC 96% · SUPERIOR BLEND" },
  { id: 4, key: "girl-scout-cookies", lineA: "GIRL SCOUT", lineB: "COOKIES", desc: "Earthy, süß – ein Klassiker.",      tags: { taste: "Earthy",  effect: "Classic",   strength: 3 }, flavor: "Earthy · Sweet · Classic",    bottom: "GIRL SCOUT COOKIES · HC 96% · SUPERIOR BLEND" },
  { id: 5, key: "gelato",             lineA: "",           lineB: "GELATO",  desc: "Dessert-Feeling mit jedem Zug.",    tags: { taste: "Vanilla", effect: "Dreamy",    strength: 2 }, flavor: "Sweet · Vanilla · Fruity",    bottom: "GELATO · HC 96% · SUPERIOR BLEND" },
]

const TAB_ACTIVE: [number, number][] = [
  [0.000, 0.167],
  [0.167, 0.333],
  [0.333, 0.500],
  [0.500, 0.667],
  [0.667, 0.833],
  [0.833, 1.000],
]

const TAB_JUMP = [0.083, 0.250, 0.417, 0.583, 0.750, 0.917]

const PACKS = [
  { label: "1×",  price: 29.99,  perUnit: 29.99 },
  { label: "3×",  price: 79.99,  perUnit: 26.66 },
  { label: "5×",  price: 119.99, perUnit: 24.00 },
]

// ── Left headline — identical to WFFHero ──────────────────────────────────────

function LeftHeadline({ activeTab, reduced }: { activeTab: number; reduced: boolean | null }) {
  const vape = VAPES[activeTab]
  const lineVariants = {
    hidden: (c: number) => ({
      opacity: 0,
      y: reduced ? 0 : 20,
      filter: reduced ? "blur(0px)" : "blur(5px)",
      transition: { delay: c * 0.07 },
    }),
    visible: (c: number) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { delay: c * 0.07, duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
    }),
  }
  return (
    <div className="absolute z-[20] pointer-events-none select-none"
      style={{ bottom: "clamp(96px, 14vh, 120px)", left: "clamp(16px, 4vw, 80px)" }}>
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial="hidden" animate="visible"
          exit={{ opacity: 0, transition: { duration: 0.07 } }}>
          <motion.p custom={0} variants={lineVariants}
            className="font-adieu uppercase leading-none"
            style={{ fontSize: "clamp(0.8rem, 2vw, 2rem)", color: TEXT_COL, opacity: 0.5, letterSpacing: "0.04em" }}>
            {vape.lineA || " "}
          </motion.p>
          <motion.p custom={1} variants={lineVariants}
            className="font-adieu uppercase"
            style={{ fontSize: "clamp(1.8rem, 8vw, 10rem)", lineHeight: 0.82, letterSpacing: "-0.02em", color: TEXT_COL }}>
            {vape.lineB}
          </motion.p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ── Description tags — bottom-right ──────────────────────────────────────────

function DescriptionInfo({ activeTab }: { activeTab: number }) {
  const { tags } = VAPES[activeTab]
  return (
    <div className="hidden md:flex absolute z-[20] pointer-events-none select-none flex-col items-end"
      style={{ bottom: "clamp(70px, 12vh, 110px)", right: "clamp(20px, 5vw, 80px)", gap: 8 }}>
      <AnimatePresence mode="wait">
        <motion.div key={activeTab}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>

          {/* Geschmack */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="font-mono uppercase" style={{ fontSize: "7px", letterSpacing: "0.3em", color: "rgba(53,56,63,0.28)" }}>
              Geschmack
            </span>
            <span className="font-mono uppercase" style={{ fontSize: "8px", letterSpacing: "0.18em", padding: "3px 10px", border: "1px solid rgba(53,56,63,0.16)", color: TEXT_COL }}>
              {tags.taste}
            </span>
          </div>

          {/* Wirkung */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="font-mono uppercase" style={{ fontSize: "7px", letterSpacing: "0.3em", color: "rgba(53,56,63,0.28)" }}>
              Wirkung
            </span>
            <span className="font-mono uppercase" style={{ fontSize: "8px", letterSpacing: "0.18em", padding: "3px 10px", border: "1px solid rgba(160,186,135,0.40)", color: "#a0ba87" }}>
              {tags.effect}
            </span>
          </div>

          {/* Stärke — meter */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="font-mono uppercase" style={{ fontSize: "7px", letterSpacing: "0.3em", color: "rgba(53,56,63,0.28)" }}>
              Stärke
            </span>
            <div style={{ display: "flex", gap: 3 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: i < tags.strength ? 1 : 0.14 }}
                  transition={{ duration: 0.3, delay: i * 0.06 }}
                  style={{ width: 14, height: 3, background: TEXT_COL, borderRadius: 1 }}
                />
              ))}
            </div>
          </div>

        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ── Drag / rotate hint ────────────────────────────────────────────────────────

function DragHint() {
  const [visible, setVisible] = useState(true)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) { setVisible(false); return }
    const hide = () => setVisible(false)
    const timer = setTimeout(hide, 8000)
    window.addEventListener("mousemove", hide, { once: true, passive: true })
    window.addEventListener("touchmove", hide, { once: true, passive: true })
    return () => {
      clearTimeout(timer)
      window.removeEventListener("mousemove", hide)
      window.removeEventListener("touchmove", hide)
    }
  }, [reduced])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
          transition={{ delay: 1.4, duration: 0.7 }}
          className="absolute pointer-events-none select-none"
          style={{
            bottom: "clamp(110px, 24vh, 170px)",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 20,
            textAlign: "center",
          }}
        >
          <motion.p
            animate={{ rotate: [0, 18, -18, 0] }}
            transition={{ delay: 2, duration: 2.5, repeat: Infinity, repeatDelay: 2 }}
            style={{ fontSize: 20, color: TEXT_COL, opacity: 0.30, marginBottom: 6 }}
          >
            ↺
          </motion.p>
          <p className="font-mono uppercase" style={{ fontSize: "7.5px", letterSpacing: "0.35em", color: "rgba(53,56,63,0.28)" }}>
            Bewegen zum Drehen
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ── Cart panel — vertically centered, right of vape ──────────────────────────

function RightCartPanel({ activeTab }: { activeTab: number }) {
  const vape = VAPES[activeTab]
  const [sel, setSel] = useState(0)
  const [added, setAdded] = useState(false)
  const { dispatch } = useCart()

  useEffect(() => { setSel(0) }, [activeTab])
  const pack = PACKS[sel]

  function addToCart() {
    dispatch({ type: "ADD", item: {
      id: vape.key, name: `${vape.lineA} ${vape.lineB}`.trim(),
      tagline: vape.flavor, price: pack.price, pack: pack.label,
    }})
    setAdded(true)
    setTimeout(() => setAdded(false), 1600)
  }

  return (
    <div className="hidden md:block absolute z-[20] pointer-events-auto select-none"
      style={{
        left: "calc(50% + clamp(150px, 24vh, 280px))",
        top: "50%",
        transform: "translateY(-50%)",
        width: "clamp(200px, 20vw, 260px)",
      }}>

      {/* Top rule */}
      <div style={{ height: 1, background: "rgba(53,56,63,0.14)", marginBottom: 18 }} />

      {/* Quality badge */}
      <p className="font-mono uppercase"
        style={{ fontSize: "9px", letterSpacing: "0.4em", color: "rgba(53,56,63,0.30)", marginBottom: 16 }}>
        HC 96% · Vape
      </p>

      {/* Pack list — editorial radio rows */}
      <div style={{ marginBottom: 24 }}>
        {PACKS.map((pk, i) => (
          <button key={pk.label} onClick={() => setSel(i)}
            className="relative w-full flex items-center justify-between transition-colors"
            style={{
              background: "none", border: "none", cursor: "pointer",
              borderBottom: "1px solid rgba(53,56,63,0.07)",
              padding: "11px 0 11px 16px",
            }}>
            {/* Left accent bar */}
            <motion.div
              animate={{ scaleY: sel === i ? 1 : 0, opacity: sel === i ? 1 : 0 }}
              transition={{ duration: 0.18 }}
              style={{
                position: "absolute", left: 0, top: "15%", bottom: "15%",
                width: 2, background: TEXT_COL, transformOrigin: "top", borderRadius: 1,
              }}
            />
            <span className="font-adieu uppercase"
              style={{
                fontSize: "clamp(0.9rem, 1.15vw, 1.05rem)",
                letterSpacing: "0.04em",
                color: sel === i ? TEXT_COL : "rgba(53,56,63,0.38)",
                transition: "color 0.15s",
              }}>
              {pk.label}
            </span>
            <span className="font-mono"
              style={{
                fontSize: "11px", letterSpacing: "0.06em",
                color: sel === i ? TEXT_COL : "rgba(53,56,63,0.30)",
                transition: "color 0.15s",
              }}>
              €{pk.price.toFixed(0)}
            </span>
          </button>
        ))}
      </div>

      {/* Price — large editorial number */}
      <AnimatePresence mode="wait">
        <motion.div key={`price-${sel}-${activeTab}`}
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }} style={{ marginBottom: 20 }}>
          <p className="font-adieu" style={{
            fontSize: "clamp(2.2rem, 3.2vw, 3.8rem)",
            lineHeight: 1, letterSpacing: "-0.025em", color: TEXT_COL,
          }}>
            €{pack.price.toFixed(2)}
          </p>
          <p className="font-mono" style={{
            fontSize: "9px", letterSpacing: "0.25em",
            color: "rgba(53,56,63,0.30)", marginTop: 6,
          }}>
            €{pack.perUnit.toFixed(2)} / STÜCK
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Bottom rule */}
      <div style={{ height: 1, background: "rgba(53,56,63,0.08)", marginBottom: 14 }} />

      {/* Full-width kaufen */}
      <MetalButton variant="primary" onClick={addToCart}
        className="w-full"
        style={{ background: added ? "#a0ba87" : TEXT_COL, color: PAGE_BG, letterSpacing: "0.22em" }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={added ? "a" : "b"}
            initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.16 }}>
            {added ? "✓ IM KORB" : "KAUFEN"}
          </motion.span>
        </AnimatePresence>
      </MetalButton>

    </div>
  )
}

// ── Mobile buy bar ────────────────────────────────────────────────────────────

function MobileBuyBar({ activeTab }: { activeTab: number }) {
  const vape = VAPES[activeTab]
  const [sel, setSel] = useState(0)
  const [added, setAdded] = useState(false)
  const { dispatch } = useCart()

  useEffect(() => { setSel(0) }, [activeTab])
  const pack = PACKS[sel]

  function addToCart() {
    dispatch({ type: "ADD", item: {
      id: vape.key, name: `${vape.lineA} ${vape.lineB}`.trim(),
      tagline: vape.flavor, price: pack.price, pack: pack.label,
    }})
    setAdded(true)
    setTimeout(() => setAdded(false), 1600)
  }

  return (
    <div className="md:hidden absolute bottom-0 left-0 right-0 z-[20]"
      style={{
        background: "rgba(53,56,63,0.96)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderTop: "1px solid rgba(53,56,63,0.09)",
        paddingBottom: "env(safe-area-inset-bottom,0px)",
      }}>
      {/* Flavor label row */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}>
          <div className="flex items-center justify-between px-4 pt-2.5 pb-0">
            <p className="font-mono uppercase"
              style={{ fontSize: "7px", letterSpacing: "0.35em", color: "rgba(53,56,63,0.35)" }}>
              {vape.desc}
            </p>
            <p className="font-mono uppercase"
              style={{ fontSize: "7px", letterSpacing: "0.28em", color: "rgba(53,56,63,0.22)" }}>
              {vape.flavor}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
      {/* Controls row */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }} className="flex items-center gap-2 px-4 pt-2 pb-3">
          <div className="flex gap-1.5 flex-1">
            {PACKS.map((pk, i) => (
              <button key={pk.label} onClick={() => setSel(i)}
                className="flex-1 flex flex-col items-center transition-all"
                style={{
                  minHeight: 44,
                  justifyContent: "center",
                  border: `1px solid ${sel === i ? TEXT_COL : "rgba(53,56,63,0.14)"}`,
                  background: sel === i ? TEXT_COL : "transparent",
                  color: sel === i ? PAGE_BG : TEXT_COL,
                }}>
                <span className="font-adieu uppercase text-xs leading-none">{pk.label}</span>
                <span className="font-mono text-[7px] mt-0.5 opacity-60">€{pk.price.toFixed(0)}</span>
              </button>
            ))}
          </div>
          <div className="flex flex-col items-end px-1.5">
            <p className="font-adieu leading-none" style={{ fontSize: "1.1rem", color: TEXT_COL }}>
              €{pack.price.toFixed(2)}
            </p>
            <p className="font-mono" style={{ fontSize: "6.5px", letterSpacing: "0.2em",
              color: "rgba(53,56,63,0.28)", marginTop: 2 }}>
              €{pack.perUnit.toFixed(2)}/Stk
            </p>
          </div>
          <MetalButton variant="primary" onClick={addToCart}
            style={{ background: added ? "#a0ba87" : TEXT_COL, color: PAGE_BG,
              minWidth: 76, minHeight: 44 }}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={added ? "a" : "b"}
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.16 }}>
                {added ? "✓" : "Kaufen"}
              </motion.span>
            </AnimatePresence>
          </MetalButton>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ── Vape reviews ─────────────────────────────────────────────────────────────

const VAPE_REVIEWS = [
  { name: "Lena K.",   city: "Stuttgart", flavor: "Northern Lights",    rating: 5,
    quote: "Hab nicht viel erwartet – aber wow. Kein Plastik-Nachgeschmack, zieht smooth. Bin gefixt." },
  { name: "Tobias M.", city: "Hamburg",   flavor: "Amnesia Haze",       rating: 5,
    quote: "War skeptisch wegen dem Preis, aber man merkt sofort warum. Hab direkt nochmal bestellt lol" },
  { name: "Sara J.",   city: "Berlin",    flavor: "Purple Haze",        rating: 5,
    quote: "Kein Account nötig, kam schnell, diskret verpackt. Genau so wie mans sich wünscht." },
  { name: "Nico F.",   city: "Köln",      flavor: "Gelato",             rating: 5,
    quote: "Kauf hier jetzt seit 4 Monaten. Qualität ist jedes Mal gleich – das schätze ich am meisten." },
  { name: "Maya R.",   city: "München",   flavor: "Girl Scout Cookies", rating: 5,
    quote: "Friends haben mich drauf gebracht und ich versteh jetzt warum. Der Flavor ist einfach clean." },
]

function VapeTestimonials() {
  const [idx, setIdx] = useState(0)
  const [dir, setDir] = useState(1)
  const [paused, setPaused] = useState(false)
  const touchStartX = useRef(0)
  const n = VAPE_REVIEWS.length
  const r = VAPE_REVIEWS[idx]

  function goPrev() { setDir(-1); setIdx(i => (i - 1 + n) % n) }
  function goNext() { setDir(1);  setIdx(i => (i + 1) % n) }

  useEffect(() => {
    if (paused) return
    const t = setTimeout(() => { setDir(1); setIdx(i => (i + 1) % n) }, 6000)
    return () => clearTimeout(t)
  }, [idx, paused])

  const quoteVariants = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? 70 : -70, filter: "blur(10px)" }),
    center: { opacity: 1, x: 0, filter: "blur(0px)" },
    exit:  (d: number) => ({ opacity: 0, x: d > 0 ? -45 : 45, filter: "blur(6px)" }),
  }

  return (
    <section
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={e => { touchStartX.current = e.touches[0].clientX; setPaused(true) }}
      onTouchEnd={e => {
        const dx = e.changedTouches[0].clientX - touchStartX.current
        if (dx < -40) goNext()
        else if (dx > 40) goPrev()
        setPaused(false)
      }}
      style={{
        position: "relative", zIndex: 20,
        background: PAGE_BG,
        borderTop: "1px solid rgba(53,56,63,0.07)",
        overflow: "hidden",
      }}
    >
      {/* Giant ghost number */}
      <div aria-hidden className="absolute pointer-events-none select-none"
        style={{ right: "-2%", bottom: "-18%", zIndex: 0 }}>
        <AnimatePresence mode="wait">
          <motion.p key={idx} className="font-adieu"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontSize: "clamp(10rem, 44vw, 52rem)", lineHeight: 0.78,
              color: "rgba(53,56,63,0.030)", letterSpacing: "-0.06em",
            }}>
            {String(idx + 1).padStart(2, "0")}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Grain */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden style={{
        zIndex: 1, opacity: 0.03,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat", backgroundSize: "200px 200px",
      }} />

      {/* Main layout */}
      <div
        className="relative flex flex-col md:flex-row md:items-center"
        style={{
          zIndex: 2,
          gap: "clamp(24px, 4vw, 60px)",
          padding: "clamp(40px, 7vh, 90px) clamp(20px, 5vw, 80px) clamp(48px, 8vh, 100px)",
        }}
      >
        {/* LEFT: editorial quote */}
        <div className="flex-1 min-w-0">

          {/* Eyebrow rule */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
            <p className="font-mono uppercase"
              style={{ fontSize: "9px", letterSpacing: "0.45em", color: "rgba(53,56,63,0.28)",
                flexShrink: 0 }}>
              Kundenstimmen
            </p>
            <div style={{ flex: 1, height: 1, background: "rgba(53,56,63,0.09)" }} />
          </div>

          {/* Stars */}
          <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
            {Array.from({ length: r.rating }).map((_, si) => (
              <motion.span
                key={`${idx}-s${si}`}
                initial={{ opacity: 0, scale: 0.3, rotate: -25 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: si * 0.07, type: "spring", stiffness: 380, damping: 12 }}
                style={{ color: "#a0ba87", fontSize: "clamp(14px, 1.5vw, 21px)", display: "block" }}>
                ★
              </motion.span>
            ))}
          </div>

          {/* Big sliding quote */}
          <AnimatePresence mode="wait" custom={dir}>
            <motion.p
              key={idx}
              custom={dir}
              variants={quoteVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 210, damping: 26, mass: 0.9 }}
              className="font-adieu uppercase"
              style={{
                fontSize: "clamp(1.8rem, 3.8vw, 4.8rem)",
                letterSpacing: "-0.025em",
                lineHeight: 0.92,
                color: TEXT_COL,
              }}
            >
              „{r.quote}"
            </motion.p>
          </AnimatePresence>
        </div>

        {/* RIGHT: author + navigation */}
        <div
          className="border-t pt-5 md:border-t-0 md:pt-0 md:border-l flex flex-col"
          style={{
            borderColor: "rgba(53,56,63,0.09)",
            paddingLeft: "clamp(0px, 3vw, 48px)",
            gap: "clamp(12px, 1.8vh, 20px)",
            flexShrink: 0,
            minWidth: "clamp(160px, 19vw, 230px)",
          }}
        >
          {/* Author info */}
          <AnimatePresence mode="wait">
            <motion.div key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}>
              <p className="font-adieu uppercase"
                style={{ fontSize: "clamp(0.88rem, 1.1vw, 1.15rem)",
                  color: TEXT_COL, letterSpacing: "0.02em" }}>
                {r.name}
              </p>
              <p className="font-mono uppercase"
                style={{ fontSize: "8px", letterSpacing: "0.28em",
                  color: "rgba(53,56,63,0.32)", marginTop: 4 }}>
                {r.city}
              </p>
              <p className="font-mono uppercase"
                style={{ fontSize: "7.5px", letterSpacing: "0.22em",
                  color: "rgba(53,56,63,0.22)", marginTop: 3 }}>
                {r.flavor}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10 }}>
                <div style={{ width: 14, height: 14, borderRadius: "50%",
                  background: "#a0ba87", display: "flex", alignItems: "center",
                  justifyContent: "center" }}>
                  <span style={{ color: "#fff", fontSize: 9, lineHeight: 1 }}>✓</span>
                </div>
                <span className="font-mono uppercase"
                  style={{ fontSize: "7px", letterSpacing: "0.28em", color: "#a0ba87" }}>
                  Verified Buyer
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Counter + nav row */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <p className="font-mono" style={{
              fontSize: "11px", letterSpacing: "0.18em", color: "rgba(53,56,63,0.18)",
            }}>
              {String(idx + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              {([["←", goPrev], ["→", goNext]] as [string, () => void][]).map(([label, fn]) => (
                <button key={label} onClick={fn}
                  className="transition-all duration-200 active:scale-95"
                  style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: "none", border: "1px solid rgba(53,56,63,0.18)",
                    color: TEXT_COL, fontSize: 14, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    WebkitTapHighlightColor: "transparent",
                  }}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Progress segments */}
          <div style={{ display: "flex", gap: 4 }}>
            {VAPE_REVIEWS.map((_, pi) => (
              <motion.div key={pi}
                animate={{ scaleX: pi === idx ? 1 : 0.28, opacity: pi === idx ? 1 : 0.18 }}
                style={{ flex: 1, height: 2, background: TEXT_COL,
                  borderRadius: 1, transformOrigin: "left" }}
                transition={{ duration: 0.35 }}
              />
            ))}
          </div>

          {/* Swipe hint — mobile only */}
          <p className="md:hidden font-mono uppercase"
            style={{ fontSize: "7px", letterSpacing: "0.3em", color: "rgba(53,56,63,0.20)" }}>
            ← Wischen →
          </p>
        </div>
      </div>
    </section>
  )
}

// ── Bottom strip — identical to WFFHero ───────────────────────────────────────

function BottomStrip({ activeTab }: { activeTab: number }) {
  return (
    <div className="hidden md:flex absolute bottom-4 left-0 right-0 justify-center z-[20] pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.p key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          className="font-mono text-[9px] md:text-[11px] tracking-[0.15em] md:tracking-[0.35em] uppercase px-4 text-center"
          style={{ color: "rgba(53,56,63,0.45)" }}>
          {VAPES[activeTab].bottom}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function VapesPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState(0)
  const activeTabRef = useRef(0)
  const prevTabRef   = useRef(0)
  const reduced      = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    for (let i = 0; i < TAB_ACTIVE.length; i++) {
      const [lo, hi] = TAB_ACTIVE[i]
      if (v >= lo && v <= hi) {
        if (activeTabRef.current !== i) {
          activeTabRef.current = i
          setActiveTab(i)
          window.dispatchEvent(new CustomEvent("wff-flavor", { detail: { index: i } }))
        }
        return
      }
    }
  })

  useEffect(() => { prevTabRef.current = activeTab }, [activeTab])

  const handleTabClick = useCallback((i: number) => {
    const el = containerRef.current
    if (!el) return
    window.scrollTo({ top: el.offsetTop + TAB_JUMP[i] * el.offsetHeight, behavior: "smooth" })
  }, [])

  const tabProgress = useTransform(scrollYProgress, (v) => {
    const [lo, hi] = TAB_ACTIVE[activeTabRef.current] ?? [0, 1]
    return Math.min(Math.max((v - lo) / (hi - lo), 0), 1)
  })

  const contentExit = useTransform(scrollYProgress, [0.86, 1.0], [1, 0])
  const innerH = `calc(100svh - ${HEADER_H}px)`

  return (
    <>
      <FloatingProduct alwaysVisible />

      <div ref={containerRef} style={{ height: "600vh", paddingTop: HEADER_H }}>
        <div className="sticky w-full overflow-hidden"
          style={{ top: HEADER_H, height: innerH, background: PAGE_BG }}>
          <motion.div className="absolute inset-0" style={{ opacity: contentExit }} aria-hidden={false}>

            {/* Grain — identical to WFFHero */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden
              style={{
                zIndex: 15, opacity: 0.045,
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
                backgroundRepeat: "repeat", backgroundSize: "200px 200px",
              }} />

            {/* Ambient glow */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ zIndex: 1, background: "radial-gradient(ellipse 55% 50% at 50% 46%, rgba(201,168,76,0.07) 0%, rgba(160,186,135,0.04) 45%, transparent 70%)" }} />

            {/* TIKTOK */}
            <div className="hidden md:block absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none select-none"
              style={{ zIndex: 20 }}>
              <a href="https://tiktok.com/@weedforfriends" target="_blank" rel="noopener noreferrer"
                className="font-mono tracking-[0.28em] uppercase pointer-events-auto transition-colors"
                style={{ fontSize: "10px", color: "rgba(53,56,63,0.45)" }}
                onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(53,56,63,0.85)")}
                onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(53,56,63,0.45)")}>
                TIKTOK
              </a>
            </div>

            {/* Drag hint — fades out on first move */}
            <DragHint />

            {/* Flavor name — bottom-left */}
            <LeftHeadline activeTab={activeTab} reduced={reduced} />

            {/* Description — bottom-right */}
            <DescriptionInfo activeTab={activeTab} />

            {/* Cart — right of vape, vertically centered */}
            <RightCartPanel activeTab={activeTab} />

            {/* Buy bar — mobile */}
            <MobileBuyBar activeTab={activeTab} />

            {/* Bottom strip */}
            <BottomStrip activeTab={activeTab} />

            {/* Tab progress line */}
            <div className="hidden md:block absolute bottom-0 left-0 right-0 h-px"
              style={{ zIndex: 20, background: "rgba(53,56,63,0.06)" }}>
              <motion.div className="h-full origin-left"
                style={{ scaleX: tabProgress, background: TEXT_COL, opacity: 0.18 }} />
            </div>

          </motion.div>
        </div>
      </div>

      <VapeTestimonials />
    </>
  )
}
