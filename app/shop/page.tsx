"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { PRODUCTS, type Product } from "@/lib/products"
import { useCart } from "@/lib/cart"

// ── Per-product themes ────────────────────────────────────────────────────────

const THEMES: Record<string, {
  bgL:    string   // image panel bg
  bgR:    string   // info panel bg
  accent: string
  glow:   string   // rgba for radial glow behind product
  image:  string
}> = {
  "northern-lights": {
    bgL:    "#060e07",
    bgR:    "#080f09",
    accent: "#a0ba87",
    glow:   "rgba(160,186,135,0.18)",
    image:  "/pouches/northern-lights.webp",
  },
  "pure-juice": {
    bgL:    "#0e0900",
    bgR:    "#110b01",
    accent: "#c9a84c",
    glow:   "rgba(201,168,76,0.18)",
    image:  "/pouches/gelato.webp",
  },
  "taste-overload": {
    bgL:    "#08090e",
    bgR:    "#0a0b10",
    accent: "#bcc0ca",
    glow:   "rgba(188,192,202,0.14)",
    image:  "/pouches/girl-scout-cookies.webp",
  },
  "starter-pack": {
    bgL:    "#0b0a05",
    bgR:    "#0e0d07",
    accent: "#eddc8c",
    glow:   "rgba(237,220,140,0.16)",
    image:  "/pouches/purple-haze.webp",
  },
}

function t(id: string) {
  return THEMES[id] ?? THEMES["northern-lights"]
}

// ── Smooth mouse parallax (no React re-renders) ───────────────────────────────

function useParallax() {
  const containerRef = useRef<HTMLDivElement>(null)
  const innerRef     = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const inner     = innerRef.current
    if (!container || !inner) return

    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0

    function loop() {
      cx += (tx - cx) * 0.07
      cy += (ty - cy) * 0.07
      inner!.style.transform = `perspective(1000px) rotateY(${cx}deg) rotateX(${cy}deg) scale(1.03)`
      raf = requestAnimationFrame(loop)
    }

    function onMove(e: MouseEvent) {
      const r = container!.getBoundingClientRect()
      tx = -((e.clientX - r.left) / r.width  - 0.5) * 10
      ty =  ((e.clientY - r.top)  / r.height - 0.5) * 7
    }
    function onLeave() { tx = 0; ty = 0 }

    container.addEventListener("mousemove", onMove)
    container.addEventListener("mouseleave", onLeave)
    raf = requestAnimationFrame(loop)
    return () => {
      container.removeEventListener("mousemove", onMove)
      container.removeEventListener("mouseleave", onLeave)
      cancelAnimationFrame(raf)
    }
  }, [])

  return { containerRef, innerRef }
}

// ── Pack selector ─────────────────────────────────────────────────────────────

function PackSelector({
  packs, selected, onSelect, accent,
}: {
  packs: Product["packs"]
  selected: number
  onSelect: (i: number) => void
  accent: string
}) {
  const discount = (i: number) =>
    i > 0 ? Math.round(100 - (packs[i].perUnit / packs[0].perUnit) * 100) : 0

  return (
    <div className="flex gap-2">
      {packs.map((pk, i) => {
        const active = selected === i
        const pct    = discount(i)
        return (
          <button
            key={pk.label}
            onClick={() => onSelect(i)}
            className="relative flex flex-col items-center gap-1 px-4 py-3 transition-all duration-200"
            style={{
              border:     `1px solid ${active ? accent : "rgba(255,255,255,0.10)"}`,
              background: active ? accent : "rgba(255,255,255,0.025)",
              minWidth:   62,
            }}
          >
            {pct > 0 && (
              <span
                className="absolute -top-2.5 right-1 font-ekstra text-[7px] uppercase tracking-wider px-1.5 py-0.5"
                style={{ background: active ? "rgba(255,255,255,0.88)" : accent, color: "#0c0d0e" }}
              >
                −{pct}%
              </span>
            )}
            <span
              className="font-druk-wide uppercase leading-none"
              style={{ fontSize: "0.82rem", color: active ? "#0c0d0e" : "rgba(255,255,255,0.75)" }}
            >
              {pk.label}
            </span>
            <span
              className="font-ekstra uppercase"
              style={{ fontSize: 8, letterSpacing: "0.16em", color: active ? "rgba(0,0,0,0.50)" : "rgba(255,255,255,0.28)" }}
            >
              €{pk.price.toFixed(0)}
            </span>
          </button>
        )
      })}
    </div>
  )
}

// ── Single product section ────────────────────────────────────────────────────

function ProductSection({
  product, index, onVisible,
}: {
  product: Product
  index: number
  onVisible: (i: number) => void
}) {
  const [pack, setPack]   = useState(0)
  const [added, setAdded] = useState(false)
  const sectionRef        = useRef<HTMLElement>(null)
  const theme             = t(product.id)
  const activePack        = product.packs[pack]
  const { dispatch }      = useCart()
  const flip              = index % 2 !== 0
  const flavors           = product.flavor.split(/ [·+] /)
  const { containerRef, innerRef } = useParallax()

  // Detect which section is in view for nav dots
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting && e.intersectionRatio >= 0.4) onVisible(index) },
      { threshold: 0.4 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [index, onVisible])

  function addToCart() {
    dispatch({ type: "ADD", item: { id: product.id, name: product.name, tagline: product.tagline, price: activePack.price, pack: activePack.label } })
    setAdded(true)
    setTimeout(() => setAdded(false), 2200)
  }

  const nameWords = product.name.split(" ")

  return (
    <section
      ref={sectionRef}
      className={`relative flex flex-col ${flip ? "md:flex-row-reverse" : "md:flex-row"}`}
      style={{ minHeight: "100dvh" }}
    >
      {/* Thin accent line at top of each section */}
      <div
        className="absolute top-0 left-0 right-0 z-20"
        style={{ height: 1.5, background: theme.accent, opacity: 0.35 }}
      />

      {/* ══ IMAGE PANEL ══════════════════════════════════════════════════════ */}
      <div
        ref={containerRef}
        className="relative flex-1 flex items-center justify-center overflow-hidden select-none"
        style={{ minHeight: "58dvh", background: theme.bgL, cursor: "crosshair" }}
      >
        {/* Studio lighting — layered radial gradients */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: [
              `radial-gradient(ellipse 65% 55% at 50% 38%, ${theme.glow}, transparent 68%)`,
              `radial-gradient(ellipse 35% 30% at 22% 72%, rgba(255,255,255,0.025), transparent 55%)`,
              `radial-gradient(ellipse 50% 40% at 82% 18%, rgba(255,255,255,0.015), transparent 55%)`,
            ].join(","),
          }}
        />

        {/* Giant section number watermark */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          aria-hidden
        >
          <span
            className="font-druk-wide leading-none select-none"
            style={{
              fontSize:      "clamp(12rem, 38vw, 52rem)",
              letterSpacing: "-0.05em",
              color:         theme.accent,
              opacity:       0.038,
              userSelect:    "none",
            }}
          >
            0{index + 1}
          </span>
        </div>

        {/* Product name behind image */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          aria-hidden
        >
          {nameWords.map((word) => (
            <span
              key={word}
              className="font-druk-wide uppercase leading-none block text-center"
              style={{
                fontSize:      "clamp(3.5rem, 9vw, 11rem)",
                letterSpacing: "-0.03em",
                color:         theme.accent,
                opacity:       0.08,
              }}
            >
              {word}
            </span>
          ))}
        </div>

        {/* Product image with parallax */}
        <div
          ref={innerRef}
          className="relative z-10 will-change-transform"
          style={{ width: "clamp(175px, 32vw, 420px)", aspectRatio: "1 / 1.18" }}
        >
          <Image
            src={theme.image}
            alt={product.name}
            fill
            className="object-contain"
            style={{ filter: "drop-shadow(0 50px 100px rgba(0,0,0,0.75)) drop-shadow(0 8px 24px rgba(0,0,0,0.50))" }}
            sizes="(max-width: 768px) 60vw, 32vw"
            priority={index === 0}
          />
        </div>

        {/* Floating flavor terms */}
        {flavors.map((flavor, i) => (
          <motion.span
            key={flavor}
            className="absolute font-ekstra uppercase z-20 pointer-events-none"
            style={{
              fontSize:      "clamp(7px, 0.68vw, 9px)",
              letterSpacing: "0.30em",
              color:         theme.accent,
              opacity:       0.38,
              left:          `${10 + i * 29}%`,
              top:           `${18 + i * 25}%`,
            }}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5 + i * 1.3, repeat: Infinity, ease: "easeInOut", delay: i * 1.1 }}
          >
            {flavor}
          </motion.span>
        ))}

        {/* Section index label */}
        <span
          className="absolute font-mono z-20"
          style={{ top: 24, left: 22, fontSize: 9, letterSpacing: "0.40em", color: "rgba(255,255,255,0.12)" }}
        >
          0{index + 1} ─────
        </span>

        {/* Badge */}
        {product.badge && (
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            viewport={{ once: true }}
            className="absolute bottom-7 left-7 z-20 font-ekstra uppercase px-3 py-1.5"
            style={{ fontSize: 8, letterSpacing: "0.24em", background: theme.accent, color: "#0c0d0e" }}
          >
            {product.badge}
          </motion.span>
        )}

        {/* Bottom vignette */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-10"
          style={{ background: `linear-gradient(to top, ${theme.bgL}, transparent)` }}
        />
      </div>

      {/* ══ INFO PANEL ═══════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
        className="flex-1 flex flex-col justify-center px-8 md:px-12 xl:px-16 py-16 md:py-20"
        style={{
          background:  theme.bgR,
          borderLeft:  flip ? "none" : `1px solid rgba(255,255,255,0.04)`,
          borderRight: flip ? `1px solid rgba(255,255,255,0.04)` : "none",
        }}
      >
        <div className="max-w-xs">

          {/* Tag line */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            className="font-ekstra uppercase mb-5"
            style={{ fontSize: 9, letterSpacing: "0.45em", color: "rgba(255,255,255,0.25)" }}
          >
            {product.tag} · {product.tagline}
          </motion.p>

          {/* Product name */}
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.55 }}
            viewport={{ once: true }}
            className="font-druk-wide uppercase leading-none mb-6"
            style={{ fontSize: "clamp(2.2rem, 4.2vw, 4.8rem)", letterSpacing: "-0.025em", color: "#ede9e1" }}
          >
            {product.name}
          </motion.h2>

          {/* Accent rule */}
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 36 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            viewport={{ once: true }}
            style={{ height: 1.5, background: theme.accent, marginBottom: 24 }}
          />

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.28, duration: 0.6 }}
            viewport={{ once: true }}
            className="font-ekstra leading-relaxed mb-8"
            style={{ fontSize: "clamp(11px, 0.9vw, 13px)", color: "rgba(255,255,255,0.38)", lineHeight: 1.80 }}
          >
            {product.description}
          </motion.p>

          {/* Flavor chips */}
          <div className="flex gap-2 flex-wrap mb-9">
            {flavors.map((f) => (
              <span
                key={f}
                className="font-ekstra uppercase"
                style={{
                  fontSize:      8,
                  letterSpacing: "0.22em",
                  padding:       "6px 12px",
                  border:        `1px solid ${theme.accent}30`,
                  color:         theme.accent,
                  background:    `${theme.accent}0d`,
                }}
              >
                {f}
              </span>
            ))}
          </div>

          {/* Pack selector */}
          <div className="mb-7">
            <p
              className="font-ekstra uppercase mb-2.5"
              style={{ fontSize: 8, letterSpacing: "0.34em", color: "rgba(255,255,255,0.18)" }}
            >
              Menge
            </p>
            <PackSelector
              packs={product.packs}
              selected={pack}
              onSelect={setPack}
              accent={theme.accent}
            />
          </div>

          {/* Price row */}
          <div className="flex items-baseline gap-3 mb-8">
            <span
              className="font-druk-wide leading-none"
              style={{ fontSize: "clamp(2rem, 3.2vw, 3.4rem)", color: "#ede9e1" }}
            >
              €{activePack.price.toFixed(2)}
            </span>
            {product.packs.length > 1 && pack > 0 && (
              <span className="font-ekstra" style={{ fontSize: 10, color: "rgba(255,255,255,0.22)" }}>
                €{activePack.perUnit.toFixed(2)} / Stück
              </span>
            )}
          </div>

          {/* CTA */}
          <div className="relative overflow-hidden" style={{ marginBottom: 14 }}>
            <motion.button
              onClick={addToCart}
              whileTap={{ scale: 0.985 }}
              className="relative w-full py-4 font-druk-wide uppercase overflow-hidden z-10"
              style={{
                letterSpacing: "0.16em",
                fontSize:      "clamp(0.72rem, 1vw, 0.88rem)",
                background:    added ? "#243d1f" : theme.accent,
                color:         added ? "#7dbf6f" : "#0c0d0e",
                transition:    "background 0.4s, color 0.4s",
              }}
            >
              {/* Sweep animation on hover */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.55, ease: "easeInOut" }}
                style={{ background: "rgba(255,255,255,0.12)", skewX: "-12deg" }}
              />
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={added ? "ok" : "go"}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.16 }}
                  className="relative flex items-center justify-center gap-2"
                >
                  {added ? "✓ Im Warenkorb" : "In den Korb"}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Trust line */}
          <p
            className="font-ekstra uppercase text-center"
            style={{ fontSize: 7.5, letterSpacing: "0.26em", color: "rgba(255,255,255,0.12)" }}
          >
            HC 96% · Laborgeprüft · Diskret versendet
          </p>

        </div>
      </motion.div>
    </section>
  )
}

// ── Section nav dots ──────────────────────────────────────────────────────────

function NavDots({ total, active }: { total: number; active: number }) {
  return (
    <div className="fixed right-5 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-4">
      {Array.from({ length: total }).map((_, i) => {
        const id     = PRODUCTS[i]?.id ?? ""
        const accent = THEMES[id]?.accent ?? "#fff"
        return (
          <motion.div
            key={i}
            animate={{
              height:     active === i ? 22 : 3,
              width:      3,
              background: active === i ? accent : "rgba(255,255,255,0.16)",
              opacity:    active === i ? 1 : 0.45,
            }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ borderRadius: 99 }}
          />
        )
      })}
    </div>
  )
}

// ── Film grain overlay ────────────────────────────────────────────────────────

function Grain() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[998]"
      aria-hidden
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.80' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        opacity:      0.028,
        mixBlendMode: "overlay",
      }}
    />
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ShopPage() {
  const [active, setActive] = useState(0)
  const onVisible = useCallback((i: number) => setActive(i), [])

  return (
    <div style={{ background: "#07080a", minHeight: "100dvh" }}>
      <Grain />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-[80] flex items-center justify-between px-5 md:px-10"
        style={{
          height:              56,
          background:          "rgba(7,8,10,0.92)",
          backdropFilter:      "blur(24px)",
          WebkitBackdropFilter:"blur(24px)",
          borderBottom:        "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <Link href="/">
          <Image src="/logo.webp" alt="WFF" width={72} height={24} className="h-5 w-auto" style={{ filter: "invert(1) brightness(2)" }} />
        </Link>
        <span className="font-ekstra uppercase" style={{ fontSize: 9, letterSpacing: "0.44em", color: "rgba(255,255,255,0.18)" }}>
          Shop
        </span>
        <Link href="/" className="font-ekstra uppercase hover:opacity-80 transition-opacity" style={{ fontSize: 9, letterSpacing: "0.26em", color: "rgba(255,255,255,0.25)" }}>
          ← Zurück
        </Link>
      </header>

      {/* ── Intro header ───────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden flex flex-col justify-end"
        style={{ height: "clamp(180px, 24vh, 300px)", background: "#07080a" }}
      >
        {/* Full-bleed ghost "SHOP" */}
        <div className="absolute inset-0 flex items-center pointer-events-none select-none" aria-hidden
          style={{ paddingLeft: "clamp(10px, 2vw, 40px)" }}>
          <span className="font-druk-wide uppercase leading-none"
            style={{ fontSize: "clamp(6rem, 22vw, 28rem)", letterSpacing: "-0.045em", color: "rgba(255,255,255,0.028)" }}>
            SHOP.
          </span>
        </div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 110, damping: 18, delay: 0.08 }}
          className="relative z-10 pb-9"
          style={{ paddingLeft: "clamp(22px, 5vw, 80px)" }}
        >
          <p className="font-ekstra uppercase mb-2"
            style={{ fontSize: 8.5, letterSpacing: "0.48em", color: "rgba(255,255,255,0.20)" }}>
            HC 96% · Laborgeprüft · {PRODUCTS.length} Drops
          </p>
          <h1 className="font-druk-wide uppercase leading-none"
            style={{ fontSize: "clamp(2rem, 5.2vw, 6.5rem)", letterSpacing: "-0.026em", color: "#ede9e1" }}>
            Alle Drops.
          </h1>
        </motion.div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "rgba(255,255,255,0.05)" }} />

      {/* ── Product sections ────────────────────────────────────────────────── */}
      {PRODUCTS.map((p, i) => (
        <ProductSection key={p.id} product={p} index={i} onVisible={onVisible} />
      ))}

      {/* ── Nav dots ────────────────────────────────────────────────────────── */}
      <NavDots total={PRODUCTS.length} active={active} />

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer
        className="flex flex-col md:flex-row items-center justify-between gap-2 px-6 md:px-10 py-7"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: "#07080a" }}
      >
        <p className="font-ekstra uppercase" style={{ fontSize: 7.5, letterSpacing: "0.28em", color: "rgba(255,255,255,0.12)" }}>
          Versandkostenfrei ab €80 · 2–3 Werktage Lieferzeit
        </p>
        <p className="font-ekstra uppercase" style={{ fontSize: 7.5, letterSpacing: "0.28em", color: "rgba(255,255,255,0.12)" }}>
          © WFF 2026
        </p>
      </footer>
    </div>
  )
}
