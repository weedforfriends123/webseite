"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "@/lib/cart"

const BG     = "#bcc0ca"
const TEXT   = "#35383f"
const ACCENT = "#7ec8d3"
const MUTED  = "rgba(53,56,63,0.50)"
const LIGHT  = "#e8e4dc"

const PACKS = [
  { label: "1×",  price: 29.99,  perUnit: 29.99,  savings: null     },
  { label: "3×",  price: 79.99,  perUnit: 26.66,  savings: "−11%"   },
  { label: "5×",  price: 119.99, perUnit: 24.00,  savings: "−20%"   },
]

// ── Section 1: Hero + Buy ─────────────────────────────────────────────────────

function HeroBuy() {
  const [sel, setSel]   = useState(0)
  const [added, setAdded] = useState(false)
  const { dispatch }    = useCart()
  const pack            = PACKS[sel]

  function addToCart() {
    dispatch({ type: "ADD", item: {
      id: "waves", name: "Waves",
      tagline: "Ocean Mint · Fresh · Pure",
      price: pack.price, pack: pack.label,
    }})
    setAdded(true)
    setTimeout(() => setAdded(false), 1600)
  }

  return (
    <section style={{ background: BG, paddingTop: 80 }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        padding: "clamp(48px,8vh,100px) clamp(20px,5vw,80px) clamp(60px,10vh,120px)",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "clamp(32px,6vw,96px)",
        alignItems: "center",
      }} className="product-grid">

        {/* Left — product image */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: "relative", display: "flex", justifyContent: "center" }}
        >
          {/* Glow */}
          <div aria-hidden style={{
            position: "absolute", inset: "5%",
            background: `radial-gradient(ellipse 80% 70% at 50% 55%, rgba(126,200,211,0.30) 0%, transparent 70%)`,
            filter: "blur(28px)", zIndex: 0, pointerEvents: "none",
          }} />
          <Image
            src="/product-14.webp"
            alt="Waves Vape"
            width={520}
            height={520}
            priority
            style={{
              width: "100%", maxWidth: 480,
              height: "auto", objectFit: "contain",
              position: "relative", zIndex: 1,
              filter: "drop-shadow(0 24px 48px rgba(53,56,63,0.22))",
            }}
          />
          {/* Badge */}
          <div style={{
            position: "absolute", top: "8%", right: "8%",
            background: ACCENT, color: "#fff",
            padding: "5px 14px", borderRadius: 999,
            fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
            zIndex: 2,
          }} className="font-druk-wide uppercase">New Drop</div>
        </motion.div>

        {/* Right — info + buy */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: "flex", flexDirection: "column", gap: "clamp(16px,2.4vh,28px)" }}
        >
          {/* Eyebrow */}
          <p className="font-ekstra uppercase" style={{
            fontSize: 9, letterSpacing: "0.52em", color: MUTED,
          }}>HC 96% · Disposable Vape</p>

          {/* Name */}
          <div>
            <h1 className="font-druk-wide uppercase" style={{
              fontSize: "clamp(3rem,7vw,7rem)",
              lineHeight: 0.88, letterSpacing: "-0.03em",
              color: TEXT, margin: 0,
            }}>WAVES</h1>
            <p style={{
              fontSize: "clamp(15px,1.4vw,20px)", color: MUTED,
              marginTop: "clamp(8px,1vh,14px)", lineHeight: 1.55,
            }}>
              Smooth, clean, refresh. Ocean Mint trifft HC 96% —<br />
              jeder Zug fühlt sich an wie frische Luft.
            </p>
          </div>

          {/* Flavor tags */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["Ocean Mint", "Fresh Air", "Pure"].map(t => (
              <span key={t} style={{
                padding: "5px 14px", borderRadius: 999,
                border: `1px solid rgba(53,56,63,0.18)`,
                fontSize: 12, color: TEXT, letterSpacing: "0.04em",
              }} className="font-ekstra">{t}</span>
            ))}
          </div>

          {/* Pack selector */}
          <div>
            <p className="font-ekstra uppercase" style={{
              fontSize: 9, letterSpacing: "0.44em", color: MUTED, marginBottom: 10,
            }}>Menge wählen</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {PACKS.map((pk, i) => (
                <button
                  key={pk.label}
                  onClick={() => setSel(i)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "14px 18px",
                    border: `1.5px solid ${sel === i ? TEXT : "rgba(53,56,63,0.16)"}`,
                    background: sel === i ? TEXT : "transparent",
                    borderRadius: 12, cursor: "pointer",
                    transition: "all 0.18s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span className="font-druk-wide uppercase" style={{
                      fontSize: 14,
                      color: sel === i ? LIGHT : TEXT,
                    }}>{pk.label}</span>
                    {pk.savings && (
                      <span style={{
                        background: sel === i ? ACCENT : `rgba(126,200,211,0.25)`,
                        color: sel === i ? "#fff" : ACCENT,
                        borderRadius: 999, padding: "2px 10px",
                        fontSize: 11, fontWeight: 700,
                      }} className="font-druk-wide">{pk.savings}</span>
                    )}
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span className="font-druk" style={{
                      fontSize: 18,
                      color: sel === i ? LIGHT : TEXT,
                    }}>€{pk.price.toFixed(2)}</span>
                    <span style={{
                      display: "block", fontSize: 10, letterSpacing: "0.16em",
                      color: sel === i ? "rgba(232,228,220,0.55)" : MUTED,
                    }} className="font-ekstra uppercase">€{pk.perUnit.toFixed(2)} / Stk</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Price + CTA */}
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <AnimatePresence mode="wait">
              <motion.p key={sel}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="font-druk"
                style={{ fontSize: "clamp(2rem,3.5vw,3.2rem)", color: TEXT, lineHeight: 1 }}>
                €{pack.price.toFixed(2)}
              </motion.p>
            </AnimatePresence>
            <button
              onClick={addToCart}
              style={{
                flex: 1, padding: "16px 28px",
                background: added ? "#a0ba87" : TEXT,
                color: LIGHT, borderRadius: 9999,
                border: "none", cursor: "pointer",
                fontSize: 13, letterSpacing: "0.18em",
                fontWeight: 700, transition: "background 0.3s",
              }}
              className="font-druk-wide uppercase"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={added ? "a" : "b"}
                  initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.16 }} style={{ display: "block" }}>
                  {added ? "✓ Im Warenkorb" : "In den Warenkorb"}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>

          {/* Trust badges */}
          <div style={{
            display: "flex", gap: "clamp(12px,2vw,24px)", flexWrap: "wrap",
            paddingTop: "clamp(8px,1.2vh,16px)",
            borderTop: "1px solid rgba(53,56,63,0.12)",
          }}>
            {[
              { icon: "✓", label: "Lab Tested" },
              { icon: "✓", label: "EU Zertifiziert" },
              { icon: "✓", label: "0% Nikotin" },
              { icon: "✓", label: "Diskreter Versand" },
            ].map(({ icon, label }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{
                  width: 16, height: 16, borderRadius: "50%",
                  background: "#a0ba87", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  fontSize: 9, color: "#fff", flexShrink: 0,
                }}>{icon}</span>
                <span className="font-ekstra" style={{ fontSize: 12, color: MUTED, letterSpacing: "0.02em" }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .product-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}

// ── Section 2: Reviews ────────────────────────────────────────────────────────

const WAVES_REVIEWS = [
  { name: "Nico F.", city: "Köln",       rating: 5, date: "Juni 2025",
    text: "Waves ist von allen Sorten mein Favorit. Der Mint-Flavor trifft voll, kein plastik-Nachgeschmack. Genau das wollte ich." },
  { name: "Lena B.", city: "München",    rating: 5, date: "Mai 2025",
    text: "Sieht sick aus und schmeckt noch besser. Diskreter Versand, kam in 2 Tagen. Direkt nochmal bestellt." },
  { name: "Tom K.", city: "Berlin",      rating: 5, date: "Mai 2025",
    text: "600 Puffs, jeder gleichmäßig. Bei anderen Marken lässt das am Ende nach – hier nicht. Bin beeindruckt." },
  { name: "Sara J.", city: "Hamburg",    rating: 5, date: "Mai 2025",
    text: "Der Geschmack ist wirklich clean. Man merkt die Terpene sofort. Genau das, was ich von einem Premium-Vape erwarte." },
  { name: "Kai M.", city: "Frankfurt",   rating: 5, date: "April 2025",
    text: "Hab das 3er Pack bestellt und bereue es kein bisschen. Preis-Leistung ist unschlagbar, ehrlich gesagt." },
  { name: "Maya R.", city: "Stuttgart",  rating: 5, date: "April 2025",
    text: "Waves ist einfach smooth. Der Minz-Vibe ist nicht zu aufdringlich, genau richtig. Kommt immer wieder." },
  { name: "Phil D.", city: "Düsseldorf", rating: 5, date: "März 2025",
    text: "COA ist öffentlich, alles transparent. Endlich ein Laden, der zeigt was drinsteckt. Vertrauen verdient." },
  { name: "Kira V.", city: "Bremen",     rating: 4, date: "März 2025",
    text: "Sehr gut. Flavor ist top, Lieferung schnell. Ich würde mir noch eine zweite Sorte wünschen, aber so ist es schon perfekt." },
  { name: "Alex B.", city: "Leipzig",    rating: 5, date: "Februar 2025",
    text: "Habe viele Vapes probiert – das hier ist anders. Kein Kratzen im Hals, kein komischer Geruch. Qualität spürbar." },
  { name: "Jo W.", city: "Nürnberg",     rating: 5, date: "Februar 2025",
    text: "Waves ist mein Daily jetzt. Hab das 5er Pack, reicht lange und der Preis pro Stück ist fair. Klare Empfehlung." },
  { name: "Elena S.", city: "Hannover",  rating: 5, date: "Januar 2025",
    text: "Erster Kauf bei WFF und direkt überzeugt. Packaging ist hochwertig, das Produkt hält was der Name verspricht." },
  { name: "Ben L.", city: "Freiburg",    rating: 5, date: "Januar 2025",
    text: "Ocean Mint ist perfekt beschrieben. Frisch, clean, smooth. Nichts Künstliches. Meine neue Stamm-Sorte." },
]

const STAR_COUNTS = [12, 0, 0, 0, 1]  // 5→4→3→2→1 stars (12 five-star, 1 four-star)
const TOTAL = STAR_COUNTS.reduce((a, b) => a + b, 0)
const AVG   = (STAR_COUNTS.reduce((a, c, i) => a + c * (5 - i), 0) / TOTAL)

function ReviewCard({ name, city, rating, date, text }: typeof WAVES_REVIEWS[0]) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: "rgba(255,255,255,0.62)",
        borderRadius: "clamp(14px,1.2vw,20px)",
        padding: "clamp(18px,1.8vw,28px)",
        border: "1px solid rgba(255,255,255,0.85)",
        boxShadow: "0 2px 18px rgba(53,56,63,0.06), inset 0 1px 0 rgba(255,255,255,0.7)",
        display: "flex", flexDirection: "column", gap: 12,
      }}
    >
      {/* Stars */}
      <div style={{ display: "flex", gap: 3 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <svg key={i} width="13" height="13" viewBox="0 0 14 14"
            fill={i < rating ? "#c4983a" : "rgba(53,56,63,0.14)"}>
            <path d="M7 1.5l1.37 2.78 3.07.45-2.22 2.16.52 3.06L7 8.5l-2.74 1.44.52-3.06L2.56 4.73l3.07-.45L7 1.5z"/>
          </svg>
        ))}
      </div>

      {/* Text */}
      <p style={{ fontSize: "clamp(13px,1vw,15px)", lineHeight: 1.72, color: "rgba(53,56,63,0.74)", margin: 0 }}>
        "{text}"
      </p>

      {/* Author */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: "auto" }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          background: "rgba(126,200,211,0.20)",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <span className="font-druk" style={{ fontSize: 14, color: TEXT }}>{name.charAt(0)}</span>
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: TEXT, lineHeight: 1.3 }}>{name}</p>
          <p style={{ margin: 0, fontSize: 11, color: MUTED, lineHeight: 1.4 }}>{city} · {date}</p>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{
            width: 14, height: 14, borderRadius: "50%",
            background: "#a0ba87", display: "flex",
            alignItems: "center", justifyContent: "center", fontSize: 8, color: "#fff",
          }}>✓</span>
          <span className="font-ekstra" style={{ fontSize: 10, color: "#a0ba87", letterSpacing: "0.06em" }}>
            Verified
          </span>
        </div>
      </div>
    </motion.div>
  )
}

function WavesReviews() {
  return (
    <section style={{ background: BG, padding: "clamp(60px,10vh,120px) clamp(20px,5vw,80px)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: "clamp(40px,6vh,72px)" }}
        >
          <p className="font-ekstra uppercase" style={{
            fontSize: 9, letterSpacing: "0.52em", color: MUTED, marginBottom: 16,
          }}>Kundenstimmen</p>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "clamp(20px,4vw,56px)", flexWrap: "wrap" }}>
            {/* Big rating */}
            <div>
              <p className="font-druk" style={{
                fontSize: "clamp(4rem,8vw,9rem)", lineHeight: 1,
                letterSpacing: "-0.04em", color: TEXT, margin: 0,
              }}>{AVG.toFixed(1)}</p>
              <div style={{ display: "flex", gap: 4, margin: "6px 0 4px" }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} width="16" height="16" viewBox="0 0 14 14"
                    fill={i < Math.round(AVG) ? "#c4983a" : "rgba(53,56,63,0.16)"}>
                    <path d="M7 1.5l1.37 2.78 3.07.45-2.22 2.16.52 3.06L7 8.5l-2.74 1.44.52-3.06L2.56 4.73l3.07-.45L7 1.5z"/>
                  </svg>
                ))}
              </div>
              <p className="font-ekstra" style={{ fontSize: 12, color: MUTED }}>{TOTAL} Bewertungen</p>
            </div>

            {/* Star breakdown */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1, minWidth: 160, maxWidth: 320 }}>
              {STAR_COUNTS.map((count, i) => {
                const stars = 5 - i
                const pct   = TOTAL > 0 ? (count / TOTAL) * 100 : 0
                return (
                  <div key={stars} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span className="font-ekstra" style={{ fontSize: 11, color: MUTED, width: 14, textAlign: "right" }}>
                      {stars}
                    </span>
                    <svg width="10" height="10" viewBox="0 0 14 14" fill="#c4983a">
                      <path d="M7 1.5l1.37 2.78 3.07.45-2.22 2.16.52 3.06L7 8.5l-2.74 1.44.52-3.06L2.56 4.73l3.07-.45L7 1.5z"/>
                    </svg>
                    <div style={{
                      flex: 1, height: 5, background: "rgba(53,56,63,0.10)", borderRadius: 99, overflow: "hidden",
                    }}>
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                        style={{ height: "100%", background: "#c4983a", borderRadius: 99 }}
                      />
                    </div>
                    <span className="font-ekstra" style={{ fontSize: 11, color: MUTED, width: 20 }}>{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Divider */}
        <div style={{ height: 1, background: "rgba(53,56,63,0.12)", marginBottom: "clamp(32px,5vh,56px)" }} />

        {/* Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(clamp(260px,28vw,380px), 1fr))",
          gap: "clamp(12px,1.4vw,20px)",
        }}>
          {WAVES_REVIEWS.map((r, i) => (
            <ReviewCard key={i} {...r} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Section 3: Comparison ─────────────────────────────────────────────────────

const ROWS = [
  { label: "Preis pro Stück",        wff: "ab €24.00",    b: "ab €32.00",    c: "ab €28.00"   },
  { label: "HC Gehalt",              wff: "96%",           b: "k.A.",          c: "70–80%"      },
  { label: "Laborgeprüft (COA)",     wff: true,            b: false,           c: false         },
  { label: "EU Zertifiziert",        wff: true,            b: false,           c: true          },
  { label: "0% Nikotin",             wff: true,            b: true,            c: true          },
  { label: "Natürliche Terpene",     wff: true,            b: false,           c: false         },
  { label: "Puffs pro Gerät",        wff: "600",           b: "400",          c: "500"         },
  { label: "Mengenrabatt",           wff: "bis −20%",      b: false,           c: "bis −10%"   },
  { label: "Lieferzeit",             wff: "2–4 Tage",      b: "5–10 Tage",    c: "3–7 Tage"   },
  { label: "Diskrete Verpackung",    wff: true,            b: true,            c: false         },
]

function CellValue({ val, highlight }: { val: string | boolean; highlight: boolean }) {
  if (typeof val === "boolean") {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{
          width: 22, height: 22, borderRadius: "50%",
          background: val ? (highlight ? TEXT : "rgba(160,186,135,0.30)") : "transparent",
          border: val ? "none" : "1.5px solid rgba(53,56,63,0.18)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {val
            ? <span style={{ color: highlight ? LIGHT : "#a0ba87", fontSize: 11, lineHeight: 1 }}>✓</span>
            : <span style={{ color: "rgba(53,56,63,0.28)", fontSize: 13, lineHeight: 1 }}>−</span>
          }
        </div>
      </div>
    )
  }
  return (
    <span className="font-ekstra" style={{
      fontSize: 13, color: highlight ? TEXT : MUTED,
      fontWeight: highlight ? 600 : 400,
    }}>{val}</span>
  )
}

function WavesComparison() {
  return (
    <section style={{
      background: LIGHT,
      padding: "clamp(60px,10vh,120px) clamp(20px,5vw,80px)",
    }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: "center", marginBottom: "clamp(40px,6vh,64px)" }}
        >
          <p className="font-ekstra uppercase" style={{
            fontSize: 9, letterSpacing: "0.52em", color: MUTED, marginBottom: 16,
          }}>Warum Waves</p>
          <h2 className="font-druk-wide uppercase" style={{
            fontSize: "clamp(1.8rem,4.5vw,5.5rem)",
            letterSpacing: "-0.03em", lineHeight: 0.9,
            color: TEXT, margin: "0 0 clamp(12px,1.8vh,20px)",
          }}>
            <span style={{ display: "block" }}>Waves im</span>
            <span style={{ display: "block", color: "transparent", WebkitTextStroke: `clamp(1.5px,0.12vw,2px) ${TEXT}` }}>Vergleich.</span>
          </h2>
          <p style={{ fontSize: "clamp(14px,1.1vw,17px)", color: MUTED, maxWidth: 480, margin: "0 auto", lineHeight: 1.65 }}>
            Nicht jeder Vape ist gleich. Hier siehst du genau, warum Waves anders ist — und warum das wichtig ist.
          </p>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          style={{
            borderRadius: "clamp(16px,1.6vw,24px)",
            overflow: "hidden",
            boxShadow: "0 4px 40px rgba(53,56,63,0.10)",
            border: "1px solid rgba(53,56,63,0.10)",
          }}
        >
          {/* Column headers */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 0.85fr 0.85fr",
            background: TEXT, padding: "18px 0",
          }}>
            <div style={{ padding: "0 clamp(14px,2vw,28px)" }} />
            {[
              { label: "Waves by WFF", sub: "HC 96% · Superior", highlight: true },
              { label: "Konkurrenz A",  sub: "Standard Vape",      highlight: false },
              { label: "Konkurrenz B",  sub: "Premium Vape",       highlight: false },
            ].map(({ label, sub, highlight }) => (
              <div key={label} style={{
                padding: "0 clamp(10px,1.4vw,20px)",
                borderLeft: highlight ? `2px solid ${ACCENT}` : "1px solid rgba(255,255,255,0.08)",
                textAlign: "center",
              }}>
                <p className="font-druk-wide uppercase" style={{
                  fontSize: "clamp(10px,1vw,13px)", letterSpacing: "0.06em",
                  color: highlight ? ACCENT : "rgba(255,255,255,0.55)",
                  margin: "0 0 3px",
                }}>{label}</p>
                <p className="font-ekstra" style={{
                  fontSize: 10, color: "rgba(255,255,255,0.30)", letterSpacing: "0.04em",
                }}>{sub}</p>
              </div>
            ))}
          </div>

          {/* Rows */}
          {ROWS.map((row, i) => (
            <div key={i} style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 0.85fr 0.85fr",
              background: i % 2 === 0 ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.40)",
              borderTop: "1px solid rgba(53,56,63,0.06)",
            }}>
              <div style={{ padding: "clamp(12px,1.4vh,18px) clamp(14px,2vw,28px)" }}>
                <span className="font-ekstra" style={{ fontSize: "clamp(12px,0.9vw,14px)", color: TEXT }}>
                  {row.label}
                </span>
              </div>
              {[
                { val: row.wff, highlight: true },
                { val: row.b,   highlight: false },
                { val: row.c,   highlight: false },
              ].map(({ val, highlight }, j) => (
                <div key={j} style={{
                  padding: "clamp(12px,1.4vh,18px) clamp(10px,1.4vw,20px)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  borderLeft: j === 0
                    ? `2px solid rgba(126,200,211,0.35)`
                    : "1px solid rgba(53,56,63,0.06)",
                  background: j === 0 ? "rgba(126,200,211,0.06)" : "transparent",
                }}>
                  <CellValue val={val} highlight={highlight} />
                </div>
              ))}
            </div>
          ))}

          {/* Footer CTA row */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 0.85fr 0.85fr",
            background: TEXT, padding: "clamp(16px,2.4vh,24px) 0",
          }}>
            <div style={{ padding: "0 clamp(14px,2vw,28px)" }}>
              <p className="font-ekstra" style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
                Die Wahl ist klar.
              </p>
            </div>
            <div style={{
              padding: "0 clamp(10px,1.4vw,20px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              borderLeft: `2px solid ${ACCENT}`,
              background: "rgba(126,200,211,0.08)",
            }}>
              <a href="#" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }) }}
                className="font-druk-wide uppercase"
                style={{
                  display: "inline-block",
                  background: ACCENT, color: "#fff",
                  padding: "8px 20px", borderRadius: 999,
                  fontSize: 11, letterSpacing: "0.08em",
                  textDecoration: "none",
                  transition: "opacity 0.18s",
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.8")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
              >Waves kaufen</a>
            </div>
            <div style={{ borderLeft: "1px solid rgba(255,255,255,0.06)" }} />
            <div style={{ borderLeft: "1px solid rgba(255,255,255,0.06)" }} />
          </div>
        </motion.div>

        {/* Disclaimer */}
        <p className="font-ekstra" style={{
          fontSize: 10, color: "rgba(53,56,63,0.30)",
          textAlign: "center", marginTop: 20, lineHeight: 1.7,
        }}>
          Vergleichswerte basieren auf öffentlich verfügbaren Produktinformationen. Stand: Juni 2025.
        </p>
      </div>
    </section>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function WavesPage() {
  return (
    <>
      <HeroBuy />
      <WavesReviews />
      <WavesComparison />
    </>
  )
}
