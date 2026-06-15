"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"

const BG      = "#1e2025"
const TEXT    = "#e8e4dc"
const MUTED   = "rgba(232,228,220,0.32)"
const ACCENT  = "#eddc8c"
const DIVIDER = "rgba(232,228,220,0.07)"

const SHOP_LINKS = [
  { label: "Vapes",     href: "/shop/vapes"     },
  { label: "Pods",      href: "/shop/pods"      },
  { label: "Blüten",    href: "/shop/blüten"    },
  { label: "Pre Rolls", href: "/shop/pre-rolls" },
  { label: "Hasch",     href: "/shop/hasch"     },
  { label: "Edibles",   href: "/shop/edibles"   },
]

const COMPANY_LINKS = [
  { label: "B2B Partner",   href: "/b2b"     },
  { label: "Loyalty Club",  href: "/loyalty" },
  { label: "Kunden Login",  href: "/login"   },
]

const LEGAL_LINKS = [
  { label: "Impressum",      href: "/impressum"      },
  { label: "Datenschutz",    href: "/datenschutz"    },
  { label: "AGB",            href: "/agb"            },
  { label: "Widerrufsrecht", href: "/widerrufsrecht" },
]

function IconIG() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="20" height="20" rx="6" stroke="currentColor" strokeWidth="1.7"/>
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.7"/>
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor"/>
    </svg>
  )
}

function IconTT() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M9 12a4.5 4.5 0 1 0 4.5 4.5V4a5.5 5.5 0 0 0 5.5 5.5"
        stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <p className="font-ekstra uppercase" style={{
        fontSize: 9, letterSpacing: "0.5em", color: MUTED,
        marginBottom: 10,
      }}>{title}</p>
      {links.map(({ label, href }) => (
        <Link key={label} href={href} className="font-ekstra" style={{
          fontSize: "clamp(14px,1.1vw,16px)", color: TEXT,
          textDecoration: "none", opacity: 0.6,
          transition: "opacity 0.18s",
          display: "inline-block",
        }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "0.6")}
        >{label}</Link>
      ))}
    </div>
  )
}

export function WFFFooter() {
  return (
    <footer style={{ background: BG, position: "relative", overflow: "hidden" }}>

      {/* ── Orbs ── */}
      <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <motion.div
          animate={{ x: [0, 30, -20, 0], y: [0, -40, 20, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", width: "50vw", height: "50vw",
            maxWidth: 700, maxHeight: 700,
            top: "-20%", left: "-10%",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(126,200,211,0.09) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <motion.div
          animate={{ x: [0, -40, 15, 0], y: [0, 30, -20, 0] }}
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          style={{
            position: "absolute", width: "40vw", height: "40vw",
            maxWidth: 560, maxHeight: 560,
            bottom: "5%", right: "-8%",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(237,220,140,0.07) 0%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />
        <motion.div
          animate={{ x: [0, 20, -30, 0], y: [0, -20, 40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 8 }}
          style={{
            position: "absolute", width: "30vw", height: "30vw",
            maxWidth: 420, maxHeight: 420,
            top: "30%", left: "40%",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(160,186,135,0.06) 0%, transparent 70%)",
            filter: "blur(45px)",
          }}
        />
      </div>

      {/* ── Grain ── */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, zIndex: 1, opacity: 0.025, pointerEvents: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat", backgroundSize: "200px 200px",
      }} />

      <div style={{ position: "relative", zIndex: 2 }}>

        {/* ── Giant brand name ── */}
        <div style={{
          padding: "clamp(56px,8vh,100px) clamp(20px,5vw,80px) 0",
          overflow: "hidden",
        }}>
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="font-druk-wide uppercase select-none"
            style={{
              fontSize: "clamp(2.8rem, 9.5vw, 12rem)",
              lineHeight: 0.88,
              letterSpacing: "-0.03em",
              margin: 0,
              color: "transparent",
              WebkitTextStroke: `clamp(1px,0.1vw,1.8px) rgba(232,228,220,0.12)`,
            }}
          >
            WeedForFriends
          </motion.h2>
        </div>

        {/* ── Main content row ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: "clamp(32px,6vw,80px)",
          padding: "clamp(40px,6vh,72px) clamp(20px,5vw,80px)",
          alignItems: "start",
        }} className="footer-grid">

          {/* Left — mission + social */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: "flex", flexDirection: "column", gap: "clamp(20px,3vh,32px)", maxWidth: 400 }}
          >
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
              <div style={{
                width: 44, height: 44, borderRadius: "50%",
                background: "rgba(232,228,220,0.08)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Image src="/logo.webp" alt="WFF" width={36} height={36}
                  style={{ objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.85 }}
                />
              </div>
              <span className="font-druk" style={{ color: TEXT, fontSize: "clamp(13px,1.2vw,17px)", letterSpacing: "0.08em", opacity: 0.9 }}>
                WEEDFORFRIENDS
              </span>
            </Link>

            <p className="font-ekstra" style={{
              fontSize: "clamp(14px,1.1vw,16px)", color: MUTED,
              lineHeight: 1.75, margin: 0,
            }}>
              Echte Cannabinoide in Apothekenqualität —<br />
              laborgeprüft, EU-zertifiziert, ohne Tabak und Nikotin.<br />
              Für echte Friends.
            </p>

            {/* Trust chips */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["Lab Tested", "EU Zertifiziert", "0% Nikotin"].map(t => (
                <span key={t} className="font-ekstra" style={{
                  padding: "4px 12px", borderRadius: 999,
                  border: "1px solid rgba(232,228,220,0.12)",
                  fontSize: 11, color: MUTED, letterSpacing: "0.04em",
                }}>{t}</span>
              ))}
            </div>

            {/* Social */}
            <div style={{ display: "flex", gap: 12 }}>
              {[
                { href: "https://instagram.com/weedforfriends", icon: <IconIG />, label: "Instagram" },
                { href: "https://tiktok.com/@weedforfriends",   icon: <IconTT />, label: "TikTok"    },
              ].map(({ href, icon, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  aria-label={label}
                  style={{
                    width: 40, height: 40, borderRadius: "50%",
                    background: "rgba(232,228,220,0.07)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: TEXT, opacity: 0.55, transition: "opacity 0.18s, background 0.18s",
                    textDecoration: "none",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; (e.currentTarget as HTMLElement).style.background = "rgba(232,228,220,0.13)" }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "0.55"; (e.currentTarget as HTMLElement).style.background = "rgba(232,228,220,0.07)" }}
                >{icon}</a>
              ))}
            </div>
          </motion.div>

          {/* Right — link columns */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "clamp(24px,4vw,64px)",
            }}
            className="footer-cols"
          >
            <FooterCol title="Shop"         links={SHOP_LINKS}    />
            <FooterCol title="Unternehmen"  links={COMPANY_LINKS} />
            <FooterCol title="Rechtliches"  links={LEGAL_LINKS}   />
          </motion.div>
        </div>

        {/* ── Age warning banner ── */}
        <div style={{
          margin: "0 clamp(20px,5vw,80px)",
          padding: "clamp(14px,1.8vh,20px) clamp(20px,2.5vw,32px)",
          background: "rgba(237,220,140,0.07)",
          border: "1px solid rgba(237,220,140,0.14)",
          borderRadius: 12,
          display: "flex", alignItems: "center", gap: 14,
          marginBottom: "clamp(32px,5vh,56px)",
        }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>⚠️</span>
          <p className="font-ekstra" style={{
            fontSize: "clamp(11px,0.85vw,13px)", color: "rgba(237,220,140,0.65)",
            lineHeight: 1.6, margin: 0,
          }}>
            Unsere Produkte sind ausschließlich für Erwachsene ab 18 Jahren bestimmt. Kein Verkauf an Minderjährige.
            Alle Cannabinoide sind EU-konform und enthalten ≤ 0,2% THC. Kein Ersatz für medizinische Beratung.
          </p>
        </div>

        {/* ── Divider ── */}
        <div style={{
          height: 1, background: DIVIDER,
          margin: "0 clamp(20px,5vw,80px)",
        }} />

        {/* ── Bottom bar ── */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 16,
          padding: "clamp(20px,3vh,32px) clamp(20px,5vw,80px) clamp(28px,4vh,44px)",
        }}>
          <p className="font-ekstra" style={{ fontSize: 12, color: MUTED, margin: 0 }}>
            © {new Date().getFullYear()} WeedForFriends. Alle Rechte vorbehalten.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "clamp(16px,2vw,28px)", flexWrap: "wrap" }}>
            {LEGAL_LINKS.map(({ label, href }) => (
              <Link key={label} href={href} className="font-ekstra" style={{
                fontSize: 12, color: MUTED, textDecoration: "none",
                transition: "color 0.18s",
              }}
                onMouseEnter={e => (e.currentTarget.style.color = TEXT)}
                onMouseLeave={e => (e.currentTarget.style.color = MUTED)}
              >{label}</Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .footer-grid { grid-template-columns: 1fr !important; }
          .footer-cols { grid-template-columns: 1fr 1fr !important; gap: 32px 24px !important; }
        }
      `}</style>
    </footer>
  )
}
