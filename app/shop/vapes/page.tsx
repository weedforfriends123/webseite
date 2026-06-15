"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "@/lib/cart"

const BG    = "#bcc0ca"
const TEXT  = "#35383f"
const MUTED = "rgba(53,56,63,0.50)"
const LIGHT = "#e8e4dc"

// ── Flavor data ───────────────────────────────────────────────────────────────

const VAPES = [
  {
    key:     "amnesia-haze",
    name:    "Amnesia Haze",
    lineA:   "AMNESIA",
    lineB:   "HAZE",
    img:     "/amnesia-vape.png",
    desc:    "Frisch, zitrusig, klar im Kopf. Der Klassiker für alle, die einen energetischen, uplifting Vibe suchen — ohne Kompromisse beim Flavor.",
    flavor:  "Citrus · Earthy · Uplifting",
    effect:  "Uplifting",
    strength: 3,
    accent:  "#a8c48a",
  },
  {
    key:     "purple-haze",
    name:    "Purple Haze",
    lineA:   "PURPLE",
    lineB:   "HAZE",
    img:     "/purple-haze.png",
    desc:    "Berry, süß, verspielt. Purple Haze bringt diesen euphorischen Feel — der Flavor ist komplex, tief und bleibt lange nach.",
    flavor:  "Berry · Sweet · Euphoric",
    effect:  "Euphoric",
    strength: 3,
    accent:  "#c0a0d8",
  },
  {
    key:     "northern-lights",
    name:    "Northern Lights",
    lineA:   "NORTHERN",
    lineB:   "LIGHTS",
    img:     "/product-14.webp",
    desc:    "Der absolute Klassiker. Ein Zug und du weißt Bescheid. Erdige Tiefe, ein Hauch Kiefer — entspannend, geerdet, pur.",
    flavor:  "Earthy · Pine · Citrus",
    effect:  "Relaxing",
    strength: 4,
    accent:  "#8ab4cc",
  },
  {
    key:     "ice-cream-cookies",
    name:    "Ice Cream Cookies",
    lineA:   "ICE CREAM",
    lineB:   "COOKIES",
    img:     "/product-15.webp",
    desc:    "Cremig, süß, smooth bis zum Ende. Kein Kratzen, kein Nachlassen. Der Dessert-Vape für jeden Moment, der nach mehr schmeckt.",
    flavor:  "Cream · Sweet · Smooth",
    effect:  "Smooth",
    strength: 2,
    accent:  "#d4c4a4",
  },
  {
    key:     "girl-scout-cookies",
    name:    "Girl Scout Cookies",
    lineA:   "GIRL SCOUT",
    lineB:   "COOKIES",
    img:     "/product-16.webp",
    desc:    "Earthy, süß — ein echter Klassiker. Complex, balanciert und mit jedem Zug tiefer. Für die, die wissen was sie wollen.",
    flavor:  "Earthy · Sweet · Classic",
    effect:  "Classic",
    strength: 3,
    accent:  "#c4a868",
  },
  {
    key:     "gelato",
    name:    "Gelato",
    lineA:   "",
    lineB:   "GELATO",
    img:     "/product-17.webp",
    desc:    "Dessert-Feeling mit jedem Zug. Vanilla trifft Frucht — smooth, warm, träumerisch. Gelato ist das Slow-Down nach einem langen Tag.",
    flavor:  "Sweet · Vanilla · Fruity",
    effect:  "Dreamy",
    strength: 2,
    accent:  "#e8b890",
  },
] as const

const PACKS = [
  { label: "1×",  price: 29.99,  perUnit: 29.99,  savings: null    },
  { label: "3×",  price: 79.99,  perUnit: 26.66,  savings: "−11%"  },
  { label: "5×",  price: 119.99, perUnit: 24.00,  savings: "−20%"  },
]

// ── Hero + Buy ────────────────────────────────────────────────────────────────

function HeroBuy() {
  const [sel, setSel]     = useState(0)
  const [pack, setPack]   = useState(0)
  const [added, setAdded] = useState(false)
  const { dispatch }      = useCart()
  const vape              = VAPES[sel]
  const p                 = PACKS[pack]

  function addToCart() {
    dispatch({ type: "ADD", item: {
      id: vape.key, name: vape.name,
      tagline: vape.flavor, price: p.price, pack: p.label,
    }})
    setAdded(true)
    setTimeout(() => setAdded(false), 1600)
  }

  return (
    <section style={{ background: BG, minHeight: "100dvh", display: "flex", alignItems: "center" }}>
      {/* Full-width grid — image left (larger), info right */}
      <div
        style={{
          width: "100%", maxWidth: 1440, margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1.15fr 1fr",
          gap: "clamp(24px,4vw,72px)",
          alignItems: "center",
          padding: "clamp(96px,12vh,140px) clamp(24px,4.5vw,80px) clamp(60px,8vh,100px)",
        }}
        className="vapes-grid"
      >

        {/* ── Left: product image ── */}
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`glow-${sel}`}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              aria-hidden
              style={{
                position: "absolute", inset: "-8%",
                background: `radial-gradient(ellipse 72% 62% at 50% 54%, ${vape.accent}66 0%, transparent 65%)`,
                filter: "blur(52px)", zIndex: 0, pointerEvents: "none",
              }}
            />
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.div
              key={`img-${sel}`}
              initial={{ opacity: 0, scale: 0.93, y: 24 }}
              animate={{ opacity: 1, scale: 1,    y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -16 }}
              transition={{ duration: 0.5, ease: [0.16,1,0.3,1] }}
              style={{ position: "relative", zIndex: 1, width: "100%" }}
            >
              <Image
                src={vape.img}
                alt={vape.name}
                width={700}
                height={700}
                priority
                style={{
                  width: "100%", height: "auto",
                  objectFit: "contain", display: "block",
                  filter: "drop-shadow(0 48px 96px rgba(53,56,63,0.20)) drop-shadow(0 14px 28px rgba(53,56,63,0.12))",
                }}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Right: info + buy ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "clamp(14px,1.8vh,20px)" }}>

          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16,1,0.3,1] }}
            className="font-ekstra uppercase"
            style={{ fontSize: 9, letterSpacing: "0.52em", color: MUTED, margin: 0 }}
          >
            HC 96% · Disposable Vapes · 6 Sorten
          </motion.p>

          {/* Flavor selector */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.07, ease: [0.16,1,0.3,1] }}
            style={{ display: "flex", gap: "clamp(5px,0.6vw,9px)", flexWrap: "wrap" }}
          >
            {VAPES.map((v, i) => (
              <button
                key={v.key}
                onClick={() => { setSel(i); setPack(0) }}
                style={{
                  padding: "7px clamp(11px,1vw,16px)",
                  border: `1.5px solid ${sel === i ? TEXT : "rgba(53,56,63,0.20)"}`,
                  background: sel === i ? TEXT : "transparent",
                  borderRadius: 999, cursor: "pointer", transition: "all 0.2s",
                }}
              >
                <span className="font-druk-wide uppercase" style={{
                  fontSize: "clamp(9px,0.7vw,11px)", letterSpacing: "0.06em",
                  color: sel === i ? LIGHT : TEXT,
                }}>
                  {v.lineA ? `${v.lineA} ${v.lineB}` : v.lineB}
                </span>
              </button>
            ))}
          </motion.div>

          {/* Animated block: name + desc + tags (changes per flavor) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={sel}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.36, ease: [0.16,1,0.3,1] }}
              style={{ display: "flex", flexDirection: "column", gap: "clamp(10px,1.4vh,16px)" }}
            >
              <h1 className="font-druk-wide uppercase" style={{
                fontSize: "clamp(2.2rem,4.8vw,6rem)",
                lineHeight: 0.88, letterSpacing: "-0.03em",
                color: TEXT, margin: 0,
              }}>
                {vape.lineA && <span style={{ display: "block" }}>{vape.lineA}</span>}
                <span style={{ display: "block" }}>{vape.lineB}</span>
              </h1>

              <p style={{
                fontSize: "clamp(13px,1vw,16px)", color: MUTED,
                lineHeight: 1.7, margin: 0,
              }}>{vape.desc}</p>

              {/* Tags + strength in one row */}
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "clamp(5px,0.5vw,8px)" }}>
                {vape.flavor.split(" · ").map(t => (
                  <span key={t} style={{
                    padding: "3px 10px", borderRadius: 999,
                    border: "1px solid rgba(53,56,63,0.18)",
                    fontSize: 11, color: TEXT,
                  }} className="font-ekstra">{t}</span>
                ))}
                <span style={{
                  padding: "3px 10px", borderRadius: 999,
                  background: `${vape.accent}44`,
                  border: `1px solid ${vape.accent}88`,
                  fontSize: 11, color: TEXT,
                }} className="font-ekstra">{vape.effect}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 2 }}>
                  <span className="font-ekstra uppercase" style={{ fontSize: 9, letterSpacing: "0.42em", color: MUTED }}>Stärke</span>
                  <div style={{ display: "flex", gap: 3 }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} style={{
                        width: 16, height: 3, borderRadius: 2,
                        background: i < vape.strength ? TEXT : "rgba(53,56,63,0.14)",
                        transition: "background 0.3s",
                      }} />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Pack selector */}
          <div>
            <p className="font-ekstra uppercase" style={{ fontSize: 9, letterSpacing: "0.44em", color: MUTED, marginBottom: 7 }}>
              Menge
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {PACKS.map((pk, i) => (
                <button
                  key={pk.label}
                  onClick={() => setPack(i)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "13px 16px",
                    border: `1.5px solid ${pack === i ? TEXT : "rgba(53,56,63,0.16)"}`,
                    background: pack === i ? TEXT : "transparent",
                    borderRadius: 10, cursor: "pointer", transition: "all 0.16s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span className="font-druk-wide uppercase" style={{ fontSize: 13, color: pack === i ? LIGHT : TEXT }}>{pk.label}</span>
                    {pk.savings && (
                      <span style={{
                        background: pack === i ? "rgba(160,186,135,0.35)" : "rgba(160,186,135,0.22)",
                        color: "#7aaa6a", padding: "1px 9px", borderRadius: 999, fontSize: 11, fontWeight: 700,
                      }} className="font-druk">{pk.savings}</span>
                    )}
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span className="font-druk" style={{ fontSize: 16, color: pack === i ? LIGHT : TEXT }}>€{pk.price.toFixed(2)}</span>
                    <span style={{ display: "block", fontSize: 9, letterSpacing: "0.18em", color: pack === i ? "rgba(232,228,220,0.50)" : MUTED }} className="font-ekstra uppercase">€{pk.perUnit.toFixed(2)} / Stk</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Price + CTA */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <AnimatePresence mode="wait">
              <motion.p key={`${sel}-${pack}`}
                initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.16 }}
                className="font-druk"
                style={{ fontSize: "clamp(1.8rem,2.8vw,2.8rem)", color: TEXT, lineHeight: 1, flexShrink: 0 }}>
                €{PACKS[pack].price.toFixed(2)}
              </motion.p>
            </AnimatePresence>
            <button
              onClick={addToCart}
              style={{
                flex: 1, padding: "15px 24px",
                background: added ? "#a0ba87" : TEXT,
                color: LIGHT, borderRadius: 9999,
                border: "none", cursor: "pointer",
                fontSize: 12, letterSpacing: "0.18em",
                fontWeight: 700, transition: "background 0.3s",
              }}
              className="font-druk-wide uppercase"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={added ? "a" : "b"}
                  initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.14 }} style={{ display: "block" }}>
                  {added ? "✓ Im Warenkorb" : "In den Warenkorb"}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>

          {/* Trust badges */}
          <div style={{
            display: "flex", gap: "clamp(10px,1.4vw,18px)", flexWrap: "wrap",
            paddingTop: "clamp(8px,1vh,12px)",
            borderTop: "1px solid rgba(53,56,63,0.12)",
          }}>
            {["Lab Tested", "EU Zertifiziert", "0% Nikotin", "600 Puffs"].map(t => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{
                  width: 14, height: 14, borderRadius: "50%",
                  background: "#a0ba87", display: "flex",
                  alignItems: "center", justifyContent: "center", fontSize: 8, color: "#fff",
                }}>✓</span>
                <span className="font-ekstra" style={{ fontSize: 11, color: MUTED }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .vapes-grid {
            grid-template-columns: 1fr !important;
            padding-top: clamp(96px,14vh,140px) !important;
          }
        }
      `}</style>
    </section>
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
  { name: "Jonas W.",  city: "Leipzig",   flavor: "Amnesia Haze",       rating: 5, date: "März 2025",
    text: "Der Uplifting-Effekt ist real. Morgens ein Zug und du bist ready. Top Qualität." },
  { name: "Nina H.",   city: "Bremen",    flavor: "Purple Haze",        rating: 5, date: "Februar 2025",
    text: "Hab viel ausprobiert — hier stimmt einfach alles. Qualität, Verpackung, Geschmack. Nichts zu meckern." },
  { name: "Felix R.",  city: "Nürnberg",  flavor: "Gelato",             rating: 5, date: "Februar 2025",
    text: "Gelato ist Dessert im Vape. Süß, warm, smooth. Das 5er Pack ist eine Investition die sich lohnt." },
  { name: "Kira V.",   city: "Hannover",  flavor: "Northern Lights",    rating: 4, date: "Januar 2025",
    text: "Sehr gut. Northern Lights ist perfekt zum Entspannen nach der Arbeit. Lieferung war super schnell." },
  { name: "Ben L.",    city: "Düsseldorf", flavor: "Girl Scout Cookies", rating: 5, date: "Januar 2025",
    text: "Das erste Mal WFF und direkt Fan. GSC ist complex, tief, earthy. Sehr zu empfehlen." },
  { name: "Phil D.",   city: "Freiburg",  flavor: "Ice Cream Cookies",  rating: 5, date: "Dezember 2024",
    text: "COA gecheckt — alles sauber. Das gibt echtes Vertrauen. Qualität die man schmeckt." },
]

const RATING_AVG = 4.92
const RATING_TOTAL = 2400

function VapesReviews() {
  return (
    <section style={{ background: BG, padding: "clamp(60px,10vh,112px) clamp(20px,5vw,72px)" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16,1,0.3,1] }}
          style={{ marginBottom: "clamp(40px,6vh,64px)" }}
        >
          <p className="font-ekstra uppercase" style={{ fontSize: 9, letterSpacing: "0.52em", color: MUTED, marginBottom: 14 }}>Kundenstimmen</p>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "clamp(20px,4vw,56px)", flexWrap: "wrap" }}>
            <div>
              <p className="font-druk" style={{ fontSize: "clamp(3.5rem,7vw,8rem)", lineHeight: 1, letterSpacing: "-0.04em", color: TEXT, margin: 0 }}>
                {RATING_AVG.toFixed(1)}
              </p>
              <div style={{ display: "flex", gap: 3, margin: "6px 0 4px" }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} width="15" height="15" viewBox="0 0 14 14" fill="#c4983a">
                    <path d="M7 1.5l1.37 2.78 3.07.45-2.22 2.16.52 3.06L7 8.5l-2.74 1.44.52-3.06L2.56 4.73l3.07-.45L7 1.5z"/>
                  </svg>
                ))}
              </div>
              <p className="font-ekstra" style={{ fontSize: 12, color: MUTED }}>{RATING_TOTAL.toLocaleString("de-DE")} Bewertungen</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5, flex: 1, minWidth: 160, maxWidth: 300 }}>
              {[
                [5, 94], [4, 4], [3, 1], [2, 0], [1, 1],
              ].map(([stars, pct]) => (
                <div key={stars} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="font-ekstra" style={{ fontSize: 10, color: MUTED, width: 14, textAlign: "right" }}>{stars}</span>
                  <svg width="9" height="9" viewBox="0 0 14 14" fill="#c4983a">
                    <path d="M7 1.5l1.37 2.78 3.07.45-2.22 2.16.52 3.06L7 8.5l-2.74 1.44.52-3.06L2.56 4.73l3.07-.45L7 1.5z"/>
                  </svg>
                  <div style={{ flex: 1, height: 4, background: "rgba(53,56,63,0.10)", borderRadius: 99, overflow: "hidden" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, ease: [0.16,1,0.3,1] }}
                      style={{ height: "100%", background: "#c4983a", borderRadius: 99 }}
                    />
                  </div>
                  <span className="font-ekstra" style={{ fontSize: 10, color: MUTED, width: 22 }}>{pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <div style={{ height: 1, background: "rgba(53,56,63,0.12)", marginBottom: "clamp(28px,4.5vh,48px)" }} />

        {/* Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(clamp(240px,26vw,360px), 1fr))",
          gap: "clamp(10px,1.2vw,18px)",
        }}>
          {REVIEWS.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.06, ease: [0.16,1,0.3,1] }}
              style={{
                background: "rgba(255,255,255,0.60)",
                borderRadius: "clamp(12px,1.1vw,18px)",
                padding: "clamp(16px,1.6vw,24px)",
                border: "1px solid rgba(255,255,255,0.84)",
                boxShadow: "0 2px 16px rgba(53,56,63,0.06), inset 0 1px 0 rgba(255,255,255,0.7)",
                display: "flex", flexDirection: "column", gap: 10,
              }}
            >
              <div style={{ display: "flex", gap: 3 }}>
                {Array.from({ length: 5 }).map((_, si) => (
                  <svg key={si} width="12" height="12" viewBox="0 0 14 14"
                    fill={si < r.rating ? "#c4983a" : "rgba(53,56,63,0.14)"}>
                    <path d="M7 1.5l1.37 2.78 3.07.45-2.22 2.16.52 3.06L7 8.5l-2.74 1.44.52-3.06L2.56 4.73l3.07-.45L7 1.5z"/>
                  </svg>
                ))}
              </div>
              <p style={{ fontSize: "clamp(12px,0.92vw,14px)", lineHeight: 1.72, color: "rgba(53,56,63,0.72)", margin: 0 }}>
                "{r.text}"
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: "auto" }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: "rgba(53,56,63,0.09)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <span className="font-druk" style={{ fontSize: 12, color: TEXT }}>{r.name.charAt(0)}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: TEXT, lineHeight: 1.3 }}>{r.name}</p>
                  <p style={{ margin: 0, fontSize: 10, color: MUTED, lineHeight: 1.4 }}>{r.city} · {r.flavor}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                  <span style={{
                    width: 13, height: 13, borderRadius: "50%",
                    background: "#a0ba87", display: "flex",
                    alignItems: "center", justifyContent: "center", fontSize: 7, color: "#fff",
                  }}>✓</span>
                  <span className="font-ekstra" style={{ fontSize: 9, color: "#a0ba87" }}>Verified</span>
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
  { label: "Preis pro Stück",         wff: "ab €24.00",  b: "ab €32.00",  c: "ab €28.00"  },
  { label: "HC / Wirkstoffgehalt",    wff: "96%",        b: "k.A.",        c: "70–80%"     },
  { label: "COA (Prüfzeugnis)",       wff: true,         b: false,         c: false        },
  { label: "EU Zertifiziert",         wff: true,         b: false,         c: true         },
  { label: "0% Nikotin & Tabak",      wff: true,         b: true,          c: true         },
  { label: "Natürliche Terpene",      wff: true,         b: false,         c: false        },
  { label: "Puffs pro Gerät",         wff: "600",        b: "400",        c: "500"        },
  { label: "6 Sorten verfügbar",      wff: true,         b: false,         c: false        },
  { label: "Mengenrabatt bis",        wff: "−20%",       b: false,         c: "−10%"      },
  { label: "Lieferzeit DE",           wff: "2–4 Tage",   b: "5–10 Tage",  c: "3–7 Tage"  },
  { label: "Diskrete Verpackung",     wff: true,         b: true,          c: false        },
]

function CellVal({ val }: { val: string | boolean }) {
  if (typeof val === "boolean") {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{
          width: 20, height: 20, borderRadius: "50%",
          background: val ? "rgba(160,186,135,0.28)" : "transparent",
          border: val ? "none" : "1.5px solid rgba(53,56,63,0.16)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ color: val ? "#7aaa6a" : "rgba(53,56,63,0.28)", fontSize: val ? 10 : 12, lineHeight: 1 }}>
            {val ? "✓" : "−"}
          </span>
        </div>
      </div>
    )
  }
  return <span className="font-ekstra" style={{ fontSize: 13, color: MUTED }}>{val}</span>
}

function VapesComparison() {
  return (
    <section style={{ background: LIGHT, padding: "clamp(60px,10vh,112px) clamp(20px,5vw,72px)" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16,1,0.3,1] }}
          style={{ textAlign: "center", marginBottom: "clamp(40px,6vh,64px)" }}
        >
          <p className="font-ekstra uppercase" style={{ fontSize: 9, letterSpacing: "0.52em", color: MUTED, marginBottom: 14 }}>
            Warum WFF Vapes
          </p>
          <h2 className="font-druk-wide uppercase" style={{
            fontSize: "clamp(1.8rem,4.5vw,5.5rem)",
            letterSpacing: "-0.03em", lineHeight: 0.9,
            color: TEXT, margin: "0 0 clamp(12px,1.8vh,20px)",
          }}>
            <span style={{ display: "block" }}>Unser Vape</span>
            <span style={{ display: "block", color: "transparent", WebkitTextStroke: `clamp(1.5px,0.12vw,2px) ${TEXT}` }}>
              im Vergleich.
            </span>
          </h2>
          <p style={{ fontSize: "clamp(14px,1.1vw,17px)", color: MUTED, maxWidth: 460, margin: "0 auto", lineHeight: 1.65 }}>
            HC 96%, öffentliche COA, natürliche Terpene — und trotzdem günstiger pro Stück.
            Hier siehst du, warum WFF anders ist.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.75, ease: [0.16,1,0.3,1] }}
          style={{
            borderRadius: "clamp(16px,1.6vw,24px)", overflow: "hidden",
            boxShadow: "0 4px 40px rgba(53,56,63,0.10)",
            border: "1px solid rgba(53,56,63,0.10)",
          }}
        >
          {/* Column headers */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 0.8fr 0.8fr", background: TEXT, padding: "16px 0" }}>
            <div style={{ padding: "0 clamp(12px,1.8vw,24px)" }} />
            {[
              { label: "WFF Vapes",     sub: "HC 96% · Superior", hi: true  },
              { label: "Konkurrenz A",  sub: "Standard",          hi: false },
              { label: "Konkurrenz B",  sub: "Premium",           hi: false },
            ].map(({ label, sub, hi }) => (
              <div key={label} style={{
                padding: "0 clamp(8px,1.2vw,18px)", textAlign: "center",
                borderLeft: hi ? "2px solid #a0ba87" : "1px solid rgba(255,255,255,0.08)",
                background: hi ? "rgba(160,186,135,0.06)" : "transparent",
              }}>
                <p className="font-druk-wide uppercase" style={{
                  fontSize: "clamp(9px,0.85vw,12px)", letterSpacing: "0.06em",
                  color: hi ? "#a0ba87" : "rgba(255,255,255,0.45)",
                  margin: "0 0 2px",
                }}>{label}</p>
                <p className="font-ekstra" style={{ fontSize: 9, color: "rgba(255,255,255,0.25)" }}>{sub}</p>
              </div>
            ))}
          </div>

          {/* Rows */}
          {COMPARE_ROWS.map((row, i) => (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "1fr 1fr 0.8fr 0.8fr",
              background: i % 2 === 0 ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.40)",
              borderTop: "1px solid rgba(53,56,63,0.06)",
            }}>
              <div style={{ padding: "clamp(11px,1.3vh,16px) clamp(12px,1.8vw,24px)" }}>
                <span className="font-ekstra" style={{ fontSize: "clamp(11px,0.85vw,13px)", color: TEXT }}>{row.label}</span>
              </div>
              {[
                { val: row.wff, hi: true  },
                { val: row.b,   hi: false },
                { val: row.c,   hi: false },
              ].map(({ val, hi }, j) => (
                <div key={j} style={{
                  padding: "clamp(11px,1.3vh,16px) clamp(8px,1.2vw,18px)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  borderLeft: j === 0 ? "2px solid rgba(160,186,135,0.30)" : "1px solid rgba(53,56,63,0.06)",
                  background: j === 0 ? "rgba(160,186,135,0.04)" : "transparent",
                }}>
                  {hi && typeof val === "string"
                    ? <span className="font-ekstra" style={{ fontSize: 13, color: TEXT, fontWeight: 600 }}>{val}</span>
                    : <CellVal val={val} />
                  }
                </div>
              ))}
            </div>
          ))}

          {/* Footer */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 0.8fr 0.8fr", background: TEXT, padding: "clamp(14px,2vh,20px) 0" }}>
            <div style={{ padding: "0 clamp(12px,1.8vw,24px)" }}>
              <p className="font-ekstra" style={{ fontSize: 11, color: "rgba(255,255,255,0.30)" }}>Die Wahl ist klar.</p>
            </div>
            <div style={{
              padding: "0 clamp(8px,1.2vw,18px)", display: "flex", alignItems: "center", justifyContent: "center",
              borderLeft: "2px solid #a0ba87", background: "rgba(160,186,135,0.07)",
            }}>
              <a href="#" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }) }}
                className="font-druk-wide uppercase"
                style={{
                  display: "inline-block", background: "#a0ba87", color: "#fff",
                  padding: "7px 18px", borderRadius: 999, fontSize: 10, letterSpacing: "0.08em",
                  textDecoration: "none", transition: "opacity 0.18s",
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.8")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
              >Jetzt kaufen</a>
            </div>
            <div style={{ borderLeft: "1px solid rgba(255,255,255,0.06)" }} />
            <div style={{ borderLeft: "1px solid rgba(255,255,255,0.06)" }} />
          </div>
        </motion.div>

        <p className="font-ekstra" style={{ fontSize: 10, color: "rgba(53,56,63,0.28)", textAlign: "center", marginTop: 18, lineHeight: 1.7 }}>
          Vergleichswerte basieren auf öffentlich verfügbaren Produktinformationen. Stand: Juni 2025.
        </p>
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
