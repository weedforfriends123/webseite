"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { PRODUCTS, type Product } from "@/lib/products"
import { useCart } from "@/lib/cart"

// ── Per-product visual themes ────────────────────────────────────────────────

const THEMES: Record<string, {
  bg:         string
  bgRight:    string
  accent:     string
  accentDim:  string
  image:      string
  fruitImg:   string
  ghost:      string[]  // lines for the watermark text
}> = {
  "northern-lights": {
    bg:        "#081409",
    bgRight:   "#0a1a0b",
    accent:    "#a0ba87",
    accentDim: "rgba(160,186,135,0.12)",
    image:     "/pouches/northern-lights.webp",
    fruitImg:  "/fruits/northern-lights.webp",
    ghost:     ["NORTHERN", "LIGHTS"],
  },
  "pure-juice": {
    bg:        "#140f05",
    bgRight:   "#1a1308",
    accent:    "#c9a84c",
    accentDim: "rgba(201,168,76,0.12)",
    image:     "/pouches/gelato.webp",
    fruitImg:  "/fruits/gelato.webp",
    ghost:     ["PURE", "JUICE"],
  },
  "taste-overload": {
    bg:        "#0d0e14",
    bgRight:   "#11121a",
    accent:    "#bcc0ca",
    accentDim: "rgba(188,192,202,0.10)",
    image:     "/pouches/girl-scout-cookies.webp",
    fruitImg:  "/fruits/girl-scout-cookies.webp",
    ghost:     ["TASTE", "OVERLOAD"],
  },
  "starter-pack": {
    bg:        "#0b0c0d",
    bgRight:   "#0f1011",
    accent:    "#eddc8c",
    accentDim: "rgba(237,220,140,0.10)",
    image:     "/pouches/purple-haze.webp",
    fruitImg:  "/fruits/purple-haze.webp",
    ghost:     ["STARTER", "PACK"],
  },
}

function theme(id: string) {
  return THEMES[id] ?? THEMES["northern-lights"]
}

// ── Pack selector ────────────────────────────────────────────────────────────

function PackSelector({
  packs, selected, onSelect, accent,
}: {
  packs: Product["packs"]
  selected: number
  onSelect: (i: number) => void
  accent: string
}) {
  return (
    <div className="flex gap-2 flex-wrap">
      {packs.map((pk, i) => (
        <motion.button
          key={pk.label}
          onClick={() => onSelect(i)}
          whileTap={{ scale: 0.96 }}
          className="relative flex flex-col items-center gap-1 px-5 py-3"
          style={{
            border:     `1px solid ${selected === i ? accent : "rgba(255,255,255,0.12)"}`,
            background: selected === i ? accent : "rgba(255,255,255,0.03)",
            minWidth:   66,
            transition: "border-color 0.2s, background 0.2s",
          }}
        >
          <span
            className="font-druk-wide uppercase leading-none"
            style={{ fontSize: "0.85rem", color: selected === i ? "#0c0d0e" : "rgba(255,255,255,0.80)" }}
          >
            {pk.label}
          </span>
          <span
            className="font-ekstra uppercase"
            style={{ fontSize: 9, letterSpacing: "0.18em", color: selected === i ? "rgba(0,0,0,0.50)" : "rgba(255,255,255,0.30)" }}
          >
            €{pk.price.toFixed(0)}
          </span>
          {pk.perUnit < pk.price && (
            <span
              className="font-ekstra uppercase"
              style={{ fontSize: 8, color: selected === i ? "rgba(0,0,0,0.40)" : "rgba(255,255,255,0.20)" }}
            >
              −{Math.round(100 - (pk.perUnit / packs[0].price) * 100)}%
            </span>
          )}
        </motion.button>
      ))}
    </div>
  )
}

// ── Product section ──────────────────────────────────────────────────────────

function ProductSection({
  product, index, onVisible,
}: {
  product: Product
  index: number
  onVisible: (i: number) => void
}) {
  const [selectedPack, setSelectedPack] = useState(0)
  const [added, setAdded]               = useState(false)
  const ref                             = useRef<HTMLElement>(null)
  const t                               = theme(product.id)
  const pack                            = product.packs[selectedPack]
  const { dispatch }                    = useCart()
  const isReversed                      = index % 2 !== 0
  const flavorTerms                     = product.flavor.split(" · ")

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting && e.intersectionRatio >= 0.45) onVisible(index) },
      { threshold: 0.45 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [index, onVisible])

  function addToCart() {
    dispatch({ type: "ADD", item: { id: product.id, name: product.name, tagline: product.tagline, price: pack.price, pack: pack.label } })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <section
      ref={ref}
      className={`relative flex flex-col md:flex-row ${isReversed ? "md:flex-row-reverse" : ""}`}
      style={{ minHeight: "100dvh" }}
    >
      {/* ── Image panel ─────────────────────────────────────── */}
      <div
        className="relative flex-1 flex items-center justify-center overflow-hidden"
        style={{ minHeight: "55dvh", background: t.bg }}
      >
        {/* Ghost typography watermark */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none"
          aria-hidden
        >
          {t.ghost.map((line) => (
            <span
              key={line}
              className="font-druk-wide uppercase block text-center"
              style={{
                fontSize:      "clamp(4.5rem, 13vw, 16rem)",
                lineHeight:    0.86,
                letterSpacing: "-0.04em",
                color:         t.accent,
                opacity:       0.05,
              }}
            >
              {line}
            </span>
          ))}
        </div>

        {/* Ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 60% 55% at 50% 50%, ${t.accentDim}, transparent 70%)` }}
        />

        {/* Product image */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.90 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 80, damping: 18, delay: 0.05 }}
          viewport={{ once: true, amount: 0.35 }}
          className="relative z-10"
          style={{ width: "clamp(180px, 34vw, 440px)", aspectRatio: "1 / 1.15" }}
        >
          <Image
            src={t.image}
            alt={product.name}
            fill
            className="object-contain"
            style={{ filter: "drop-shadow(0 40px 80px rgba(0,0,0,0.6))" }}
            sizes="(max-width: 768px) 65vw, 34vw"
            priority={index === 0}
          />
          {/* Bottom glow */}
          <div
            className="absolute -bottom-6 left-1/2 -translate-x-1/2 rounded-full blur-3xl pointer-events-none"
            style={{ width: "60%", height: 50, background: t.accent, opacity: 0.18 }}
          />
        </motion.div>

        {/* Fruit / flavor image (blurred background accent) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 1 }}
        >
          <Image
            src={t.fruitImg}
            alt=""
            fill
            className="object-cover opacity-[0.07] mix-blend-luminosity"
            sizes="50vw"
            aria-hidden
          />
        </div>

        {/* Floating flavor terms */}
        {flavorTerms.map((term, i) => (
          <motion.span
            key={term}
            className="absolute font-ekstra uppercase z-20"
            style={{
              fontSize:      "clamp(8px, 0.75vw, 10px)",
              letterSpacing: "0.28em",
              color:         t.accent,
              opacity:       0.45,
              left:          `${8 + i * 28}%`,
              top:           `${20 + i * 22}%`,
            }}
            animate={{ y: [0, -9, 0] }}
            transition={{ duration: 4.5 + i * 1.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.8 }}
          >
            {term}
          </motion.span>
        ))}

        {/* Section index */}
        <span
          className="absolute font-mono z-20"
          style={{
            top: 28, left: 24,
            fontSize: 10, letterSpacing: "0.4em",
            color: "rgba(255,255,255,0.14)",
          }}
        >
          0{index + 1} ─
        </span>

        {/* Badge */}
        {product.badge && (
          <motion.span
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            viewport={{ once: true }}
            className="absolute bottom-7 left-7 z-20 font-ekstra uppercase px-3 py-1.5"
            style={{ fontSize: 9, letterSpacing: "0.22em", background: t.accent, color: "#0c0d0e" }}
          >
            {product.badge}
          </motion.span>
        )}
      </div>

      {/* ── Info panel ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: isReversed ? -30 : 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 75, damping: 18, delay: 0.12 }}
        viewport={{ once: true, amount: 0.25 }}
        className="flex-1 flex flex-col justify-center px-8 md:px-12 xl:px-20 py-16 md:py-24"
        style={{
          background:  t.bgRight,
          borderLeft:  isReversed ? "none" : "1px solid rgba(255,255,255,0.04)",
          borderRight: isReversed ? "1px solid rgba(255,255,255,0.04)" : "none",
        }}
      >
        <div className="max-w-sm">
          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            viewport={{ once: true }}
            className="font-ekstra uppercase mb-4"
            style={{ fontSize: 9, letterSpacing: "0.40em", color: "rgba(255,255,255,0.28)" }}
          >
            {product.tagline}
          </motion.p>

          {/* Name */}
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            viewport={{ once: true }}
            className="font-druk-wide uppercase leading-none mb-7"
            style={{ fontSize: "clamp(2rem, 4.5vw, 4.4rem)", letterSpacing: "-0.02em", color: "#f0ece4" }}
          >
            {product.name}
          </motion.h2>

          {/* Thin accent rule */}
          <div style={{ width: 40, height: 1, background: t.accent, opacity: 0.5, marginBottom: 28 }} />

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.28 }}
            viewport={{ once: true }}
            className="font-ekstra leading-relaxed mb-8"
            style={{ fontSize: "clamp(11px, 0.95vw, 13px)", color: "rgba(255,255,255,0.42)", lineHeight: 1.75 }}
          >
            {product.description}
          </motion.p>

          {/* Flavor chips */}
          <div className="flex gap-2 flex-wrap mb-10">
            {flavorTerms.map((term) => (
              <span
                key={term}
                className="font-ekstra uppercase px-3 py-1.5"
                style={{
                  fontSize:    9,
                  letterSpacing: "0.20em",
                  border:      `1px solid ${t.accent}38`,
                  color:       t.accent,
                  background:  t.accentDim,
                }}
              >
                {term}
              </span>
            ))}
          </div>

          {/* Pack selector */}
          <div className="mb-8">
            <p
              className="font-ekstra uppercase mb-3"
              style={{ fontSize: 9, letterSpacing: "0.32em", color: "rgba(255,255,255,0.20)" }}
            >
              Menge
            </p>
            <PackSelector
              packs={product.packs}
              selected={selectedPack}
              onSelect={setSelectedPack}
              accent={t.accent}
            />
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-4 mb-8">
            <span
              className="font-druk-wide leading-none"
              style={{ fontSize: "clamp(1.8rem, 3.2vw, 3.2rem)", color: "#f0ece4" }}
            >
              €{pack.price.toFixed(2)}
            </span>
            {product.packs.length > 1 && (
              <span
                className="font-ekstra"
                style={{ fontSize: 10, color: "rgba(255,255,255,0.26)" }}
              >
                €{pack.perUnit.toFixed(2)} / Stück
              </span>
            )}
          </div>

          {/* CTA */}
          <motion.button
            onClick={addToCart}
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.975 }}
            className="w-full py-4 font-druk-wide uppercase relative overflow-hidden"
            style={{
              background:    added ? "#2e5a29" : t.accent,
              color:         added ? "#a8d4a0" : "#0c0d0e",
              letterSpacing: "0.14em",
              fontSize:      "clamp(0.75rem, 1.1vw, 0.9rem)",
              transition:    "background 0.35s, color 0.35s",
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={added ? "ok" : "go"}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="flex items-center justify-center gap-2"
              >
                {added ? "✓ Im Warenkorb" : "In den Korb"}
              </motion.span>
            </AnimatePresence>
          </motion.button>

          {/* Trust micro-copy */}
          <p
            className="font-ekstra uppercase text-center mt-4"
            style={{ fontSize: 8, letterSpacing: "0.28em", color: "rgba(255,255,255,0.14)" }}
          >
            HC 96% · Laborgeprüft · Diskret
          </p>
        </div>
      </motion.div>
    </section>
  )
}

// ── Side navigation dots ─────────────────────────────────────────────────────

function NavDots({ total, active }: { total: number; active: number }) {
  const productIds = PRODUCTS.map(p => p.id)
  return (
    <div className="fixed right-5 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-3.5">
      {Array.from({ length: total }).map((_, i) => {
        const accent = THEMES[productIds[i]]?.accent ?? "#fff"
        const isActive = active === i
        return (
          <motion.div
            key={i}
            animate={{
              width:      isActive ? 22 : 3,
              background: isActive ? accent : "rgba(255,255,255,0.18)",
              opacity:    isActive ? 1 : 0.5,
            }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{ height: 3, borderRadius: 99 }}
          />
        )
      })}
    </div>
  )
}

// ── Hero intro section ───────────────────────────────────────────────────────

function HeroIntro() {
  return (
    <section
      className="relative flex flex-col justify-end overflow-hidden"
      style={{ height: "clamp(200px, 28vh, 320px)", background: "#0a0b0c" }}
    >
      {/* Giant background text */}
      <div
        className="absolute inset-0 flex items-center pointer-events-none select-none"
        style={{ paddingLeft: "clamp(16px, 3vw, 60px)" }}
        aria-hidden
      >
        <span
          className="font-druk-wide uppercase leading-none"
          style={{
            fontSize:      "clamp(5rem, 20vw, 26rem)",
            letterSpacing: "-0.04em",
            color:         "rgba(255,255,255,0.035)",
          }}
        >
          SHOP.
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 18, delay: 0.1 }}
        className="relative z-10 pb-10"
        style={{ paddingLeft: "clamp(24px, 5vw, 80px)" }}
      >
        <p
          className="font-ekstra uppercase mb-2"
          style={{ fontSize: 9, letterSpacing: "0.45em", color: "rgba(255,255,255,0.22)" }}
        >
          HC 96% · Laborgeprüft · {PRODUCTS.length} Produkte
        </p>
        <h1
          className="font-druk-wide uppercase leading-none"
          style={{ fontSize: "clamp(2rem, 5.5vw, 6rem)", letterSpacing: "-0.025em", color: "#f0ece4" }}
        >
          Alle Drops.
        </h1>
      </motion.div>
    </section>
  )
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function ShopPage() {
  const [activeIndex, setActiveIndex] = useState(0)

  const handleVisible = useCallback((i: number) => setActiveIndex(i), [])

  return (
    <div style={{ background: "#0a0b0c", minHeight: "100dvh" }}>

      {/* Header */}
      <header
        className="sticky top-0 z-[80] flex items-center justify-between px-5 md:px-10"
        style={{
          height:         56,
          background:     "rgba(10,11,12,0.90)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom:   "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <Link href="/">
          <Image
            src="/logo.webp"
            alt="WFF"
            width={72}
            height={24}
            className="h-5 w-auto"
            style={{ filter: "invert(1) brightness(2)" }}
          />
        </Link>
        <span
          className="font-ekstra uppercase"
          style={{ fontSize: 9, letterSpacing: "0.45em", color: "rgba(255,255,255,0.20)" }}
        >
          Shop
        </span>
        <Link
          href="/"
          className="font-ekstra uppercase transition-opacity hover:opacity-80"
          style={{ fontSize: 9, letterSpacing: "0.28em", color: "rgba(255,255,255,0.28)" }}
        >
          ← Zurück
        </Link>
      </header>

      {/* Intro */}
      <HeroIntro />

      {/* Separator */}
      <div style={{ height: 1, background: "rgba(255,255,255,0.05)" }} />

      {/* Product sections */}
      {PRODUCTS.map((product, i) => (
        <ProductSection
          key={product.id}
          product={product}
          index={i}
          onVisible={handleVisible}
        />
      ))}

      {/* Nav dots */}
      <NavDots total={PRODUCTS.length} active={activeIndex} />

      {/* Footer */}
      <footer
        className="flex flex-col md:flex-row items-center justify-between gap-3 px-6 md:px-10 py-8"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: "#0a0b0c" }}
      >
        <p
          className="font-ekstra uppercase"
          style={{ fontSize: 8, letterSpacing: "0.30em", color: "rgba(255,255,255,0.14)" }}
        >
          Versandkostenfrei ab €80 · 2–3 Werktage Lieferzeit
        </p>
        <p
          className="font-ekstra uppercase"
          style={{ fontSize: 8, letterSpacing: "0.30em", color: "rgba(255,255,255,0.14)" }}
        >
          © WFF 2026 · hello@weedforfriends.com
        </p>
      </footer>

    </div>
  )
}
