"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { PRODUCTS, type Product } from "@/lib/products"
import { useCart } from "@/lib/cart"

const THEMES: Record<string, {
  bg:     string
  accent: string
  glow:   string
  image:  string
}> = {
  "northern-lights": { bg: "#060e07", accent: "#a0ba87", glow: "rgba(160,186,135,0.22)", image: "/pouches/northern-lights.webp" },
  "pure-juice":      { bg: "#0f0a02", accent: "#c9a84c", glow: "rgba(201,168,76,0.22)",   image: "/pouches/gelato.webp" },
  "taste-overload":  { bg: "#08090f", accent: "#bcc0ca", glow: "rgba(188,192,202,0.18)",  image: "/pouches/girl-scout-cookies.webp" },
  "starter-pack":    { bg: "#0c0b06", accent: "#eddc8c", glow: "rgba(237,220,140,0.20)",  image: "/pouches/purple-haze.webp" },
}

function th(id: string) { return THEMES[id] ?? THEMES["northern-lights"] }

// ── Smooth parallax on the product image ─────────────────────────────────────

function useParallax() {
  const sectionRef = useRef<HTMLElement>(null)
  const imgRef     = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const img     = imgRef.current
    if (!section || !img) return
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0

    function loop() {
      cx += (tx - cx) * 0.06
      cy += (ty - cy) * 0.06
      img!.style.transform = `perspective(900px) rotateY(${cx}deg) rotateX(${cy}deg) scale(1.04)`
      raf = requestAnimationFrame(loop)
    }
    function move(e: MouseEvent) {
      const r = section!.getBoundingClientRect()
      tx = -((e.clientX - r.left) / r.width  - 0.5) * 12
      ty =  ((e.clientY - r.top)  / r.height - 0.5) * 8
    }
    function leave() { tx = 0; ty = 0 }

    section.addEventListener("mousemove", move)
    section.addEventListener("mouseleave", leave)
    raf = requestAnimationFrame(loop)
    return () => {
      section.removeEventListener("mousemove", move)
      section.removeEventListener("mouseleave", leave)
      cancelAnimationFrame(raf)
    }
  }, [])

  return { sectionRef, imgRef }
}

// ── Film grain ────────────────────────────────────────────────────────────────

function Grain() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 pointer-events-none z-[990]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`,
        opacity: 0.030,
        mixBlendMode: "overlay",
      }}
    />
  )
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
  const pct = (i: number) =>
    i > 0 ? Math.round(100 - (packs[i].perUnit / packs[0].perUnit) * 100) : 0

  return (
    <div className="flex gap-2">
      {packs.map((pk, i) => {
        const active = selected === i
        const p      = pct(i)
        return (
          <button
            key={pk.label}
            onClick={() => onSelect(i)}
            className="relative flex flex-col items-center justify-center gap-1 py-3 px-4 transition-all duration-200"
            style={{
              minWidth:   64,
              border:     `1px solid ${active ? accent : "rgba(255,255,255,0.09)"}`,
              background: active ? accent : "rgba(255,255,255,0.03)",
            }}
          >
            {p > 0 && (
              <span
                className="absolute -top-2.5 right-1 font-ekstra uppercase px-1.5 py-px"
                style={{ fontSize: 7, letterSpacing: "0.16em", background: active ? "rgba(255,255,255,0.88)" : accent, color: "#0c0d0e" }}
              >
                −{p}%
              </span>
            )}
            <span className="font-druk-wide uppercase leading-none"
              style={{ fontSize: "0.78rem", color: active ? "#0c0d0e" : "rgba(255,255,255,0.7)" }}>
              {pk.label}
            </span>
            <span className="font-ekstra uppercase"
              style={{ fontSize: 7.5, letterSpacing: "0.14em", color: active ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.24)" }}>
              €{pk.price.toFixed(0)}
            </span>
          </button>
        )
      })}
    </div>
  )
}

// ── Product section ───────────────────────────────────────────────────────────

function ProductSection({
  product, index, onVisible,
}: {
  product: Product
  index: number
  onVisible: (i: number) => void
}) {
  const [pack, setPack]   = useState(0)
  const [added, setAdded] = useState(false)
  const theme             = th(product.id)
  const active            = product.packs[pack]
  const { dispatch }      = useCart()
  const flavors           = product.flavor.split(/ [·+] /)
  const words             = product.name.toUpperCase().split(" ")
  const { sectionRef, imgRef } = useParallax()

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting && e.intersectionRatio >= 0.4) onVisible(index) },
      { threshold: 0.4 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [index, onVisible, sectionRef])

  function addToCart() {
    dispatch({ type: "ADD", item: { id: product.id, name: product.name, tagline: product.tagline, price: active.price, pack: active.label } })
    setAdded(true)
    setTimeout(() => setAdded(false), 2400)
  }

  return (
    <section
      ref={sectionRef}
      className="relative flex flex-col"
      style={{ minHeight: "100dvh", background: theme.bg, overflow: "hidden" }}
    >
      {/* Top accent rule */}
      <div style={{ height: 1, background: theme.accent, opacity: 0.30 }} />

      {/* ── Header bar ── */}
      <div className="flex items-center justify-between px-6 md:px-10" style={{ paddingTop: 20, paddingBottom: 18 }}>
        <span className="font-mono" style={{ fontSize: 9, letterSpacing: "0.44em", color: "rgba(255,255,255,0.14)" }}>
          0{index + 1} / 0{PRODUCTS.length}
        </span>
        {product.badge && (
          <span
            className="font-ekstra uppercase px-3 py-1"
            style={{ fontSize: 7.5, letterSpacing: "0.26em", background: theme.accent, color: "#0c0d0e" }}
          >
            {product.badge}
          </span>
        )}
        <span className="font-ekstra uppercase" style={{ fontSize: 9, letterSpacing: "0.44em", color: "rgba(255,255,255,0.14)" }}>
          {product.tag}
        </span>
      </div>

      {/* ── Giant name behind image ── */}
      <div
        className="absolute inset-0 flex flex-col justify-center items-start pointer-events-none select-none"
        aria-hidden
        style={{ paddingLeft: "clamp(16px, 3vw, 48px)", paddingTop: "8vh" }}
      >
        {words.map((word) => (
          <span
            key={word}
            className="font-druk-wide block leading-none"
            style={{
              fontSize:      "clamp(5.5rem, 21vw, 26rem)",
              letterSpacing: "-0.045em",
              color:         theme.accent,
              opacity:       0.055,
            }}
          >
            {word}
          </span>
        ))}
      </div>

      {/* ── Product image — centered, large ── */}
      <div className="flex-1 flex items-center justify-center relative z-10 px-4"
        style={{ paddingTop: "clamp(8px, 2vh, 24px)", paddingBottom: "clamp(8px, 2vh, 16px)" }}>

        {/* Studio glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: [
              `radial-gradient(ellipse 60% 55% at 50% 44%, ${theme.glow}, transparent 65%)`,
              `radial-gradient(ellipse 30% 28% at 28% 72%, rgba(255,255,255,0.022), transparent 55%)`,
              `radial-gradient(ellipse 40% 35% at 76% 20%, rgba(255,255,255,0.015), transparent 55%)`,
            ].join(","),
          }}
        />

        {/* Floating flavor terms */}
        {flavors.map((f, i) => (
          <motion.span
            key={f}
            className="absolute font-ekstra uppercase pointer-events-none z-20"
            style={{
              fontSize:      "clamp(7px, 0.62vw, 9px)",
              letterSpacing: "0.32em",
              color:         theme.accent,
              opacity:       0.35,
              left:          `${14 + i * 28}%`,
              top:           `${20 + i * 22}%`,
            }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6 + i * 1.4, repeat: Infinity, ease: "easeInOut", delay: i * 1.2 }}
          >
            {f}
          </motion.span>
        ))}

        {/* Image with parallax */}
        <div
          ref={imgRef}
          className="relative will-change-transform z-10"
          style={{ width: "clamp(180px, 38vw, 480px)", aspectRatio: "1 / 1.22" }}
        >
          <Image
            src={theme.image}
            alt={product.name}
            fill
            className="object-contain"
            style={{
              filter: [
                "drop-shadow(0 60px 100px rgba(0,0,0,0.85))",
                "drop-shadow(0 12px 32px rgba(0,0,0,0.55))",
              ].join(" "),
            }}
            sizes="(max-width: 768px) 72vw, 38vw"
            priority={index === 0}
          />
        </div>
      </div>

      {/* ── Product name + description ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true, amount: 0.2 }}
        className="relative z-10 px-6 md:px-10 pb-6"
      >
        <h2
          className="font-druk-wide uppercase leading-none mb-2"
          style={{ fontSize: "clamp(1.8rem, 4.5vw, 5.5rem)", letterSpacing: "-0.025em", color: "#ede9e1" }}
        >
          {product.name}
        </h2>
        <p
          className="font-ekstra leading-relaxed max-w-lg"
          style={{ fontSize: "clamp(10px, 0.85vw, 12px)", color: "rgba(255,255,255,0.32)", lineHeight: 1.85 }}
        >
          {product.description}
        </p>
      </motion.div>

      {/* ── Bottom action strip ── */}
      <div
        className="relative z-10 flex flex-col md:flex-row md:items-center gap-4 px-6 md:px-10 pb-8 md:pb-0"
        style={{
          borderTop:    `1px solid rgba(255,255,255,0.055)`,
          paddingTop:   20,
          paddingBottom: 24,
        }}
      >
        {/* Pack selector */}
        <div className="flex flex-col gap-2">
          <p className="font-ekstra uppercase" style={{ fontSize: 8, letterSpacing: "0.38em", color: "rgba(255,255,255,0.18)" }}>
            Menge
          </p>
          <PackSelector packs={product.packs} selected={pack} onSelect={setPack} accent={theme.accent} />
        </div>

        {/* Divider */}
        <div className="hidden md:block" style={{ width: 1, height: 56, background: "rgba(255,255,255,0.07)", margin: "0 8px" }} />

        {/* Flavor chips */}
        <div className="flex gap-2 flex-wrap">
          {flavors.map((f) => (
            <span
              key={f}
              className="font-ekstra uppercase"
              style={{
                fontSize:      7.5,
                letterSpacing: "0.20em",
                padding:       "5px 10px",
                border:        `1px solid ${theme.accent}28`,
                color:         theme.accent,
                background:    `${theme.accent}0a`,
              }}
            >
              {f}
            </span>
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Price + CTA */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-druk-wide leading-none" style={{ fontSize: "clamp(1.6rem, 2.8vw, 3rem)", color: "#ede9e1" }}>
              €{active.price.toFixed(2)}
            </p>
            {pack > 0 && (
              <p className="font-ekstra" style={{ fontSize: 8.5, color: "rgba(255,255,255,0.22)" }}>
                €{active.perUnit.toFixed(2)} / Stück
              </p>
            )}
          </div>

          <motion.button
            onClick={addToCart}
            whileTap={{ scale: 0.97 }}
            className="relative overflow-hidden font-druk-wide uppercase"
            style={{
              padding:       "16px 28px",
              fontSize:      "clamp(0.68rem, 0.95vw, 0.85rem)",
              letterSpacing: "0.18em",
              background:    added ? "#1c3319" : theme.accent,
              color:         added ? "#6dba66" : "#0c0d0e",
              transition:    "background 0.4s, color 0.4s",
              minWidth:      148,
              whiteSpace:    "nowrap",
            }}
          >
            {/* Hover sweep */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              style={{ background: "rgba(255,255,255,0.14)", transform: "skewX(-10deg)" }}
            />
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={added ? "y" : "n"}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.14 }}
                className="relative"
              >
                {added ? "✓ Hinzugefügt" : "In den Korb"}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </section>
  )
}

// ── Nav dots ──────────────────────────────────────────────────────────────────

function NavDots({ count, active }: { count: number; active: number }) {
  return (
    <div className="fixed right-5 top-1/2 -translate-y-1/2 z-[80] hidden md:flex flex-col gap-3.5">
      {Array.from({ length: count }).map((_, i) => {
        const accent = th(PRODUCTS[i]?.id ?? "")?.accent ?? "#fff"
        return (
          <motion.div
            key={i}
            animate={{
              height:     active === i ? 24 : 3,
              width:      3,
              background: active === i ? accent : "rgba(255,255,255,0.15)",
              opacity:    active === i ? 1 : 0.4,
            }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            style={{ borderRadius: 99 }}
          />
        )
      })}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ShopPage() {
  const [active, setActive] = useState(0)
  const onVisible = useCallback((i: number) => setActive(i), [])

  return (
    <div style={{ background: "#07080a", minHeight: "100dvh" }}>
      <Grain />

      {/* ── Sticky nav ── */}
      <header
        className="sticky top-0 z-[999] flex items-center justify-between px-5 md:px-10"
        style={{
          height:               54,
          background:           "rgba(7,8,10,0.90)",
          backdropFilter:       "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom:         "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <Link href="/">
          <Image src="/logo.webp" alt="WFF" width={72} height={24} className="h-5 w-auto"
            style={{ filter: "invert(1) brightness(2)" }} />
        </Link>
        <span className="font-ekstra uppercase" style={{ fontSize: 8.5, letterSpacing: "0.46em", color: "rgba(255,255,255,0.18)" }}>
          Shop
        </span>
        <Link href="/" className="font-ekstra uppercase transition-opacity hover:opacity-70"
          style={{ fontSize: 8.5, letterSpacing: "0.26em", color: "rgba(255,255,255,0.22)" }}>
          ← Zurück
        </Link>
      </header>

      {/* ── Intro section ── */}
      <div
        className="relative overflow-hidden flex flex-col justify-end"
        style={{ height: "clamp(160px, 22vh, 260px)", background: "#07080a" }}
      >
        {/* Ghost SHOP word */}
        <div className="absolute inset-0 flex items-end pointer-events-none select-none" aria-hidden
          style={{ paddingLeft: "clamp(12px, 2.5vw, 48px)", paddingBottom: 0 }}>
          <span className="font-druk-wide uppercase leading-none"
            style={{ fontSize: "clamp(7rem, 26vw, 36rem)", letterSpacing: "-0.05em", color: "rgba(255,255,255,0.025)", lineHeight: 0.82 }}>
            SHOP.
          </span>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 pb-8"
          style={{ paddingLeft: "clamp(22px, 4vw, 60px)" }}
        >
          <p className="font-ekstra uppercase mb-2"
            style={{ fontSize: 8.5, letterSpacing: "0.46em", color: "rgba(255,255,255,0.18)" }}>
            HC 96% · Laborgeprüft · {PRODUCTS.length} Drops
          </p>
          <h1 className="font-druk-wide uppercase leading-none"
            style={{ fontSize: "clamp(2rem, 5vw, 7rem)", letterSpacing: "-0.028em", color: "#ede9e1" }}>
            Alle Drops.
          </h1>
        </motion.div>
      </div>

      <div style={{ height: 1, background: "rgba(255,255,255,0.05)" }} />

      {/* ── Products ── */}
      {PRODUCTS.map((p, i) => (
        <ProductSection key={p.id} product={p} index={i} onVisible={onVisible} />
      ))}

      <NavDots count={PRODUCTS.length} active={active} />

      {/* ── Footer ── */}
      <footer
        className="flex flex-col md:flex-row items-center justify-between gap-2 px-6 md:px-10 py-7"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: "#07080a" }}
      >
        <p className="font-ekstra uppercase" style={{ fontSize: 7.5, letterSpacing: "0.28em", color: "rgba(255,255,255,0.12)" }}>
          Versandkostenfrei ab €80 · 2–3 Werktage
        </p>
        <p className="font-ekstra uppercase" style={{ fontSize: 7.5, letterSpacing: "0.28em", color: "rgba(255,255,255,0.12)" }}>
          © WFF 2026
        </p>
      </footer>
    </div>
  )
}
