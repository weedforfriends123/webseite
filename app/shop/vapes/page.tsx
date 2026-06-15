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
    <section style={{ background: BG, minHeight: "100dvh", position: "relative", overflow: "hidden" }}>

      {/* Glow */}
      <AnimatePresence mode="wait">
        <motion.div key={`glow-${sel}`}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 1 }} aria-hidden
          style={{
            position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
            background: `radial-gradient(ellipse 60% 70% at 38% 50%, ${vape.accent}44 0%, transparent 68%)`,
            filter: "blur(48px)",
          }}
        />
      </AnimatePresence>

      <div style={{
        position: "relative", zIndex: 1,
        maxWidth: 1280, margin: "0 auto",
        minHeight: "100dvh",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        padding: "0 clamp(24px,5vw,80px)",
      }} className="vapes-grid">

        {/* ══ LEFT — image ══ */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "clamp(90px,12vh,130px) clamp(24px,3vw,56px) clamp(60px,8vh,90px) 0",
          position: "relative",
        }}>
          <AnimatePresence mode="wait">
            <motion.div key={`img-${sel}`}
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1,    y: 0  }}
              exit={{ opacity: 0, scale: 0.97, y: -14 }}
              transition={{ duration: 0.48, ease: [0.16,1,0.3,1] }}
              style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <Image src={vape.img} alt={vape.name} width={360} height={360} priority
                style={{
                  height: "clamp(200px,32vh,360px)", width: "auto",
                  objectFit: "contain", display: "block",
                  filter: "drop-shadow(0 32px 64px rgba(53,56,63,0.22)) drop-shadow(0 8px 20px rgba(53,56,63,0.12))",
                }}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ══ RIGHT — info ══ */}
        <div style={{
          display: "flex", flexDirection: "column", justifyContent: "center",
          padding: "clamp(90px,12vh,130px) 0 clamp(60px,8vh,90px) clamp(40px,4vw,64px)",
          borderLeft: "1px solid rgba(53,56,63,0.09)",
        }}>

          {/* Eyebrow */}
          <p className="font-ekstra uppercase" style={{ fontSize: 9, letterSpacing: "0.5em", color: MUTED, marginBottom: "clamp(10px,1.4vh,16px)" }}>
            Disposable Vape · HC 96% · 1 ML
          </p>

          {/* Name */}
          <AnimatePresence mode="wait">
            <motion.h1 key={`name-${sel}`}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.16,1,0.3,1] }}
              className="font-druk-wide uppercase"
              style={{
                fontSize: "clamp(2.2rem,4.2vw,6rem)",
                lineHeight: 0.86, letterSpacing: "-0.03em",
                color: TEXT, margin: 0,
              }}>
              {vape.lineA && <span style={{ display: "block" }}>{vape.lineA}</span>}
              <span style={{ display: "block" }}>{vape.lineB}</span>
            </motion.h1>
          </AnimatePresence>

          {/* Description */}
          <AnimatePresence mode="wait">
            <motion.p key={`desc-${sel}`}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.28 }}
              style={{ fontSize: "clamp(12px,0.9vw,14px)", color: MUTED, lineHeight: 1.8, margin: "clamp(14px,2vh,20px) 0 0" }}>
              {vape.desc}
            </motion.p>
          </AnimatePresence>

          {/* Divider */}
          <div style={{ height: 1, background: "rgba(53,56,63,0.09)", margin: "clamp(20px,3vh,32px) 0" }} />

          {/* Flavor list */}
          <p className="font-ekstra uppercase" style={{ fontSize: 8, letterSpacing: "0.48em", color: MUTED, marginBottom: 10 }}>Sorte</p>
          <div style={{ display: "flex", flexDirection: "column", marginBottom: "clamp(20px,3vh,28px)" }}>
            {VAPES.map((v, i) => {
              const active = sel === i
              const label = v.lineA ? `${v.lineA} ${v.lineB}` : v.lineB
              return (
                <button key={v.key} onClick={() => { setSel(i); setPack(0) }} style={{
                  background: "none", border: "none", cursor: "pointer",
                  textAlign: "left", padding: "8px 0",
                  borderBottom: "1px solid rgba(53,56,63,0.07)",
                  display: "flex", alignItems: "center", gap: 12,
                }}>
                  <motion.span
                    animate={{ width: active ? 18 : 8, background: active ? TEXT : "rgba(53,56,63,0.20)" }}
                    style={{ height: 1.5, borderRadius: 99, flexShrink: 0, display: "block" }}
                    transition={{ duration: 0.22 }}
                  />
                  <span className="font-druk-wide uppercase" style={{
                    fontSize: "clamp(10px,0.82vw,12px)",
                    letterSpacing: "0.04em",
                    color: active ? TEXT : "rgba(53,56,63,0.28)",
                    transition: "color 0.2s",
                  }}>{label}</span>
                </button>
              )
            })}
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "rgba(53,56,63,0.09)", marginBottom: "clamp(20px,3vh,28px)" }} />

          {/* Pack */}
          <p className="font-ekstra uppercase" style={{ fontSize: 8, letterSpacing: "0.48em", color: MUTED, marginBottom: 10 }}>Menge</p>
          <div style={{ display: "flex", gap: 8, marginBottom: "clamp(20px,3vh,28px)" }}>
            {PACKS.map((pk, i) => (
              <button key={pk.label} onClick={() => setPack(i)} style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                padding: "9px 18px",
                border: `1.5px solid ${pack === i ? TEXT : "rgba(53,56,63,0.15)"}`,
                background: pack === i ? TEXT : "transparent",
                borderRadius: 8, cursor: "pointer", transition: "all 0.14s",
              }}>
                <span className="font-druk-wide uppercase" style={{ fontSize: 13, color: pack === i ? LIGHT : TEXT, lineHeight: 1 }}>
                  {pk.label}
                </span>
                {pk.savings && (
                  <span style={{ fontSize: 9, color: pack === i ? "#b0d498" : "#6fa05e" }} className="font-druk">{pk.savings}</span>
                )}
              </button>
            ))}
          </div>

          {/* Price row */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: "clamp(14px,2vh,20px)" }}>
            <AnimatePresence mode="wait">
              <motion.span key={`p-${pack}`}
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.13 }}
                className="font-druk"
                style={{ fontSize: "clamp(2.2rem,3.4vw,4.2rem)", color: TEXT, lineHeight: 1 }}>
                €{PACKS[pack].price.toFixed(2)}
              </motion.span>
            </AnimatePresence>
            <span className="font-ekstra" style={{ fontSize: 11, color: MUTED }}>
              €{PACKS[pack].perUnit.toFixed(2)} / Stk
            </span>
          </div>

          {/* CTA */}
          <button onClick={addToCart} style={{
            width: "100%", padding: "16px 24px",
            background: added ? "#a0ba87" : TEXT,
            color: LIGHT, borderRadius: 9999,
            border: "none", cursor: "pointer",
            fontSize: 11, letterSpacing: "0.22em",
            transition: "background 0.28s",
          }} className="font-druk-wide uppercase">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={added ? "a" : "b"}
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.13 }} style={{ display: "block" }}>
                {added ? "✓ Im Warenkorb" : "In den Warenkorb"}
              </motion.span>
            </AnimatePresence>
          </button>

          {/* Trust badges */}
          <div style={{ display: "flex", gap: 20, marginTop: "clamp(18px,2.5vh,26px)", flexWrap: "wrap" }}>
            {["Lab Tested", "EU Zertifiziert", "0% Nikotin", "600 Puffs"].map(t => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 14, height: 14, borderRadius: "50%", background: "rgba(160,186,135,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M1.5 4l2 2 3-3" stroke="#6fa05e" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="font-ekstra" style={{ fontSize: 10, color: "rgba(53,56,63,0.40)" }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .vapes-grid { grid-template-columns: 1fr !important; padding: 0 20px !important; }
          .vapes-grid > *:first-child { padding-left: 0 !important; padding-bottom: 0 !important; min-height: 52vw; }
          .vapes-grid > *:last-child  { border-left: none !important; padding-left: 0 !important; border-top: 1px solid rgba(53,56,63,0.09); }
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
