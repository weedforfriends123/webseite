"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { PRODUCTS, type Product } from "@/lib/products"
import { useCart } from "@/lib/cart"
import { MetalButton } from "@/components/ui/metal-button"

const BG    = "#35383f"
const TEXT  = "#35383f"

// ── Product card ──────────────────────────────────────────────────────────────

function ProductCard({ p }: { p: Product }) {
  const [selectedPack, setSelectedPack] = useState(0)
  const [added, setAdded] = useState(false)
  const { dispatch } = useCart()

  const pack = p.packs[selectedPack]

  function addToCart() {
    dispatch({
      type:    "ADD",
      item: {
        id:      p.id,
        name:    p.name,
        tagline: p.tagline,
        price:   pack.price,
        pack:    pack.label,
      },
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1600)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 130, damping: 18 }}
      viewport={{ once: true, margin: "-40px" }}
      className="flex flex-col"
      style={{
        background: BG,
        border:     "1px solid rgba(53,56,63,0.09)",
        borderRadius: "2px",
      }}
    >
      {/* Visual area */}
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{
          height:     "clamp(200px, 28vw, 340px)",
          background: `linear-gradient(145deg, rgba(53,56,63,0.03) 0%, ${p.accent}18 100%)`,
          borderBottom: "1px solid rgba(53,56,63,0.06)",
        }}
      >
        {/* Badge */}
        {p.badge && (
          <span
            className="absolute top-4 left-4 font-mono text-[8px] tracking-[0.3em] uppercase px-2.5 py-1"
            style={{ background: p.accent, color: p.accent === "#35383f" ? "#35383f" : "#0e0f11" }}
          >
            {p.badge}
          </span>
        )}

        {/* Giant product name as visual */}
        <p
          className="font-adieu uppercase leading-none select-none pointer-events-none text-center px-4"
          style={{
            fontSize:      "clamp(2.2rem, 6vw, 5rem)",
            letterSpacing: "-0.03em",
            color:         p.accent,
            opacity:       0.18,
          }}
        >
          {p.name}
        </p>

        {/* HC label */}
        <div className="absolute bottom-4 right-4">
          <span
            className="font-mono text-[8px] tracking-[0.3em] uppercase px-2 py-0.5"
            style={{ color: TEXT, border: "1px solid rgba(53,56,63,0.14)", opacity: 0.5 }}
          >
            {p.tag}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-6 flex flex-col gap-4 flex-1">
        <div>
          <p
            className="font-mono text-[8px] tracking-[0.35em] uppercase mb-1"
            style={{ color: "rgba(53,56,63,0.32)" }}
          >
            {p.tagline}
          </p>
          <p
            className="font-adieu uppercase leading-none"
            style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)", letterSpacing: "-0.01em", color: TEXT }}
          >
            {p.name}
          </p>
        </div>

        <p
          className="font-ekstra leading-relaxed flex-1"
          style={{ fontSize: "clamp(10px, 0.9vw, 12px)", color: "rgba(53,56,63,0.48)" }}
        >
          {p.description}
        </p>

        {/* Flavor chips */}
        <p
          className="font-mono text-[8px] tracking-[0.2em] uppercase"
          style={{ color: "rgba(53,56,63,0.30)" }}
        >
          {p.flavor}
        </p>

        {/* Pack selector */}
        <div className="flex gap-2 flex-wrap">
          {p.packs.map((pk, i) => (
            <button
              key={pk.label}
              onClick={() => setSelectedPack(i)}
              className="flex flex-col items-center px-3 py-2 transition-all"
              style={{
                border:     `1px solid ${selectedPack === i ? TEXT : "rgba(53,56,63,0.14)"}`,
                background:  selectedPack === i ? TEXT : "transparent",
                color:       selectedPack === i ? BG : TEXT,
                minWidth:    56,
              }}
            >
              <span className="font-adieu uppercase text-sm leading-none">{pk.label}</span>
              <span className="font-mono text-[8px] mt-0.5 opacity-60">€{pk.price.toFixed(0)}</span>
            </button>
          ))}
        </div>

        {/* Price + CTA */}
        <div className="flex items-end justify-between gap-4 pt-1">
          <div>
            <p className="font-adieu text-2xl leading-none" style={{ color: TEXT }}>
              €{pack.price.toFixed(2)}
            </p>
            {p.packs.length > 1 && (
              <p className="font-mono text-[8px] tracking-wider mt-0.5" style={{ color: "rgba(53,56,63,0.30)" }}>
                €{pack.perUnit.toFixed(2)} / Stück
              </p>
            )}
          </div>

          <MetalButton
            variant="primary"
            onClick={addToCart}
            style={{
              background: added ? "#a0ba87" : TEXT,
              color:      BG,
              minWidth:   120,
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={added ? "added" : "add"}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
              >
                {added ? "✓ Im Korb" : "In den Korb"}
              </motion.span>
            </AnimatePresence>
          </MetalButton>
        </div>
      </div>
    </motion.div>
  )
}

// ── Shop page ─────────────────────────────────────────────────────────────────

export default function ShopPage() {
  return (
    <div style={{ background: BG, minHeight: "100vh" }}>

      {/* Nav bar */}
      <div
        className="sticky top-0 z-[70] flex items-center justify-between px-5 md:px-10"
        style={{
          height:     60,
          background: "rgba(53,56,63,0.92)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(53,56,63,0.07)",
        }}
      >
        <Link href="/">
          <Image src="/logo.webp" alt="WFF" width={72} height={24} className="h-5 w-auto" style={{ filter: "brightness(0)" }} />
        </Link>
        <span className="font-mono text-[9px] tracking-[0.4em] uppercase" style={{ color: "rgba(53,56,63,0.35)" }}>
          Shop
        </span>
        <Link
          href="/"
          className="font-mono text-[9px] tracking-[0.25em] uppercase transition-opacity hover:opacity-100"
          style={{ color: "rgba(53,56,63,0.35)" }}
        >
          ← Zurück
        </Link>
      </div>

      {/* Hero */}
      <div
        className="relative overflow-hidden flex flex-col justify-end"
        style={{
          height:      "clamp(220px, 32vh, 380px)",
          paddingLeft: "clamp(20px, 5vw, 80px)",
          paddingBottom: "clamp(32px, 5vh, 60px)",
        }}
      >
        {/* Ghost text background */}
        <div className="absolute inset-0 flex items-center" aria-hidden style={{ paddingLeft: "clamp(6px, 1vw, 20px)" }}>
          <p
            className="font-adieu uppercase leading-none select-none"
            style={{
              fontSize:      "clamp(6rem, 22vw, 30rem)",
              letterSpacing: "-0.03em",
              color:         "rgba(53,56,63,0.05)",
            }}
          >
            SHOP.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 140, damping: 18 }}
          style={{ position: "relative", zIndex: 10 }}
        >
          <p className="font-mono uppercase mb-2" style={{ fontSize: "9px", letterSpacing: "0.45em", color: "rgba(53,56,63,0.30)" }}>
            HC 96% · Laborgeprüft · Diskreter Versand
          </p>
          <p
            className="font-adieu uppercase leading-none"
            style={{ fontSize: "clamp(2.5rem, 6vw, 7rem)", letterSpacing: "-0.025em", lineHeight: 0.88, color: TEXT }}
          >
            Alle Drops.
          </p>
        </motion.div>
      </div>

      {/* Filter bar */}
      <div
        className="flex items-center justify-between px-5 md:px-10 py-4"
        style={{ borderBottom: "1px solid rgba(53,56,63,0.07)", borderTop: "1px solid rgba(53,56,63,0.07)" }}
      >
        <p className="font-mono text-[9px] tracking-[0.3em] uppercase" style={{ color: "rgba(53,56,63,0.30)" }}>
          {PRODUCTS.length} Produkte
        </p>
        <p className="font-mono text-[9px] tracking-[0.25em] uppercase" style={{ color: "rgba(53,56,63,0.25)" }}>
          HC 96% · Alle Flavors
        </p>
      </div>

      {/* Product grid */}
      <div
        className="grid gap-px"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(clamp(260px, 30vw, 380px), 1fr))",
          background: "rgba(53,56,63,0.07)",
          margin: "0",
        }}
      >
        {PRODUCTS.map((p) => (
          <div key={p.id} style={{ background: BG }}>
            <ProductCard p={p} />
          </div>
        ))}
      </div>

      {/* Footer strip */}
      <div
        className="flex flex-col md:flex-row items-center justify-between gap-3 px-5 md:px-10 py-8"
        style={{ borderTop: "1px solid rgba(53,56,63,0.07)" }}
      >
        <p className="font-mono text-[8px] tracking-[0.25em] uppercase" style={{ color: "rgba(53,56,63,0.22)" }}>
          Versandkostenfrei ab €80 · 2–3 Werktage Lieferzeit
        </p>
        <p className="font-mono text-[8px] tracking-[0.25em] uppercase" style={{ color: "rgba(53,56,63,0.22)" }}>
          © WFF 2026 · hello@weedforfriends.com
        </p>
      </div>

    </div>
  )
}
