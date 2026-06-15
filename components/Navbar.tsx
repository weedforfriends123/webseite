"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "@/lib/cart"

const BG   = "#bcc0ca"
const TEXT = "#35383f"

const NAV_ITEMS = ["Vapes", "Pods", "Blüten", "Pre Rolls", "Hasch", "Edibles"] as const
const DROPDOWNS: Record<string, string[]> = {
  "Blüten":  ["Superior", "CBD"],
  "Hasch":   ["Superior", "CBD"],
  "Edibles": ["THC", "Superior"],
}

function IconUser({ color = TEXT }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
function IconCart({ color = TEXT }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="3" y1="6" x2="21" y2="6" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M16 10a4 4 0 0 1-8 0" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
function IconIG({ color = TEXT }: { color?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="20" height="20" rx="6" stroke={color} strokeWidth="1.7" />
      <circle cx="12" cy="12" r="4.2" stroke={color} strokeWidth="1.7" />
      <circle cx="17.4" cy="6.6" r="1.1" fill={color} />
    </svg>
  )
}
function IconTT({ color = TEXT }: { color?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M9 12a4.5 4.5 0 1 0 4.5 4.5V4a5.5 5.5 0 0 0 5.5 5.5"
        stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function NavDropdown({ label, items }: { label: string; items: string[] }) {
  const [open, setOpen] = useState(false)
  const slug = label.toLowerCase().replace(" ", "-")
  return (
    <div style={{ position: "relative" }} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button className="font-ekstra" style={{
        color: open ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.55)",
        fontSize: "clamp(15px,1.3vw,19px)", padding: "7px 14px",
        borderRadius: 9999, background: open ? "rgba(255,255,255,0.07)" : "none", border: "none",
        cursor: "pointer", whiteSpace: "nowrap",
        display: "flex", alignItems: "center", gap: 5,
        transition: "color 0.2s, background 0.2s",
      }}>
        {label}
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
          <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "absolute", top: "calc(100% + 6px)", left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(53,56,63,0.96)",
              backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
              borderRadius: 14,
              boxShadow: "0 12px 40px rgba(0,0,0,0.28), 0 1px 0 rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
              overflow: "hidden", minWidth: 140, zIndex: 100,
            }}
          >
            {items.map((item, i) => (
              <Link key={item} href={`/shop/${slug}/${item.toLowerCase()}`} className="font-ekstra"
                style={{
                  display: "block", padding: "14px 26px",
                  color: "rgba(255,255,255,0.82)", fontSize: 17, textDecoration: "none",
                  borderBottom: i < items.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                  whiteSpace: "nowrap", transition: "background 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >{item}</Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function NavLink({ href, children }: { href: string; children: string }) {
  const [hov, setHov] = useState(false)
  return (
    <Link
      href={href}
      className="font-ekstra"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        fontSize: "clamp(15px,1.3vw,19px)",
        padding: "7px 14px",
        textDecoration: "none",
        whiteSpace: "nowrap",
        display: "inline-block",
        borderRadius: 9999,
        transition: "color 0.2s, background 0.2s",
        color: hov ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.55)",
        background: hov ? "rgba(255,255,255,0.14)" : "transparent",
      }}
    >{children}</Link>
  )
}

export function Navbar() {
  const [menuOpen, setMenuOpen]             = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
  const { count, dispatch } = useCart()

  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      padding: "clamp(8px,1.4vh,16px) clamp(12px,3vw,48px) 0",
      pointerEvents: "none",
    }}>
      {/* Pill */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center"
        style={{
          background: "rgba(53,56,63,0.92)",
          backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
          borderRadius: 9999,
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 8px 40px rgba(53,56,63,0.18), inset 0 1px 0 rgba(255,255,255,0.06)",
          padding: "0 clamp(10px,1.2vw,20px) 0 clamp(8px,0.8vw,14px)",
          gap: 0,
          width: "100%",
          maxWidth: 1080,
          margin: "0 auto",
          pointerEvents: "all",
          height: "clamp(56px,7vh,88px)",
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
          <div style={{
            width: "clamp(50px,4.5vw,68px)", height: "clamp(50px,4.5vw,68px)",
            borderRadius: "50%", background: "rgba(255,255,255,0.08)",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <Image src="/logo.webp" alt="WFF" width={56} height={56} style={{
              width: "clamp(42px,3.2vw,50px)", height: "clamp(42px,3.2vw,50px)",
              objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.9,
            }} priority />
          </div>
          <span className="font-druk hidden sm:block" style={{ color: "rgba(255,255,255,0.9)", fontSize: "clamp(12px,1.4vw,20px)", letterSpacing: "0.08em" }}>
            WEEDFORFRIENDS
          </span>
        </Link>

        {/* Divider — desktop only */}
        <div className="hidden md:block" style={{ width: 1, height: 22, background: "rgba(255,255,255,0.1)", flexShrink: 0, margin: "0 clamp(8px,1vw,18px)" }} />

        {/* Center Nav — desktop only */}
        <nav className="hidden md:flex" style={{ alignItems: "center", flex: 1 }}>
          {NAV_ITEMS.map((name) => {
            const items = DROPDOWNS[name]
            if (!items) return (
              <NavLink key={name} href={`/shop/${name.toLowerCase().replace(" ", "-")}`}>{name}</NavLink>
            )
            return <NavDropdown key={name} label={name} items={items} />
          })}
        </nav>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0, marginLeft: "auto" }}>

          {/* B2B pill — desktop only */}
          <Link href="/b2b" className="font-druk hidden md:inline-flex" style={{
            alignItems: "center",
            color: "#35383f", fontSize: "clamp(10px,0.85vw,12px)", padding: "6px 14px",
            borderRadius: 9999, textDecoration: "none", whiteSpace: "nowrap",
            background: "#eddc8c", letterSpacing: "0.07em",
            transition: "opacity .2s",
          }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = "0.8"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = "1"}
          >B2B</Link>

          <div className="hidden md:block" style={{ width: 1, height: 20, background: "rgba(255,255,255,0.1)", margin: "0 2px" }} />

          {/* Login */}
          <Link href="/login" aria-label="Login" style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            background: "rgba(255,255,255,0.08)", borderRadius: "50%",
            width: "clamp(36px,3.2vw,52px)", height: "clamp(36px,3.2vw,52px)",
            textDecoration: "none", flexShrink: 0, transition: "background .2s",
          }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.15)"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)"}
          >
            <IconUser color="rgba(255,255,255,0.8)" />
          </Link>

          {/* Cart */}
          <button
            onClick={() => dispatch({ type: "OPEN_CART" })}
            aria-label="Warenkorb"
            style={{
              position: "relative",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              background: BG, borderRadius: "50%",
              width: "clamp(36px,3.2vw,52px)", height: "clamp(36px,3.2vw,52px)",
              border: "none", flexShrink: 0, cursor: "pointer", transition: "opacity .2s",
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = "0.75"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = "1"}
          >
            <IconCart color={TEXT} />
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  key="nav-badge"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 440, damping: 22 }}
                  style={{
                    position: "absolute", top: -4, right: -4,
                    width: 18, height: 18, borderRadius: "50%",
                    background: "#35383f", color: "#e8e4dc",
                    fontSize: 9, fontFamily: "var(--font-space-mono)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    lineHeight: 1,
                  }}
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Hamburger — mobile only */}
          <button
            className="flex items-center justify-center md:hidden"
            onClick={() => { setMenuOpen(v => !v); setMobileExpanded(null) }}
            aria-label={menuOpen ? "Menü schließen" : "Menü öffnen"}
            style={{
              width: 42, height: 42, borderRadius: 9999,
              background: menuOpen ? "rgba(255,255,255,0.1)" : "none",
              border: "none", cursor: "pointer", flexShrink: 0,
              transition: "background 0.2s",
            }}
          >
            <div style={{ position: "relative", width: 18, height: 13 }}>
              {[
                { top: 0,  open: "translateY(6.5px) rotate(45deg)" },
                { top: 6,  open: "scaleX(0)" },
                { top: 12, open: "translateY(-6.5px) rotate(-45deg)" },
              ].map(({ top, open }, i) => (
                <span key={i} style={{
                  position: "absolute", left: 0, right: 0, top, height: 1.7,
                  borderRadius: 2, background: "rgba(255,255,255,0.85)",
                  transition: "transform 0.26s cubic-bezier(0.16,1,0.3,1), opacity 0.18s ease",
                  transform: menuOpen ? open : "none",
                  opacity: (menuOpen && i === 1) ? 0 : 1,
                  transformOrigin: "center",
                }} />
              ))}
            </div>
          </button>
        </div>
      </motion.div>

      {/* ── MOBILE MENU ─────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, clipPath: "inset(0 0 100% 0 round 20px)" }}
              animate={{ opacity: 1, clipPath: "inset(0 0 0% 0 round 20px)" }}
              exit={{ opacity: 0, clipPath: "inset(0 0 100% 0 round 20px)" }}
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden"
              style={{
                marginTop: 8, marginLeft: 20, marginRight: 20,
                background: "rgba(53,56,63,0.97)",
                backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)",
                borderRadius: 20,
                border: "1px solid rgba(255,255,255,0.07)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
                overflow: "hidden", zIndex: 200,
                pointerEvents: "all",
              }}
            >
              {NAV_ITEMS.map((name, i) => {
                const items = DROPDOWNS[name]
                const isExpanded = mobileExpanded === name
                const isLast = i === NAV_ITEMS.length - 1

                if (!items) return (
                  <Link key={name} href={`/shop/${name.toLowerCase().replace(" ", "-")}`}
                    onClick={() => setMenuOpen(false)}
                    className="font-ekstra"
                    style={{
                      display: "block", padding: "18px 24px",
                      color: "rgba(255,255,255,0.82)", fontSize: 18, textDecoration: "none",
                      borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.06)",
                    }}
                  >{name}</Link>
                )

                return (
                  <div key={name}>
                    <button
                      className="font-ekstra"
                      onClick={() => setMobileExpanded(isExpanded ? null : name)}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        width: "100%", padding: "18px 24px",
                        color: isExpanded ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.82)",
                        fontSize: 18, background: isExpanded ? "rgba(255,255,255,0.04)" : "none",
                        border: "none", borderBottom: "1px solid rgba(255,255,255,0.06)",
                        cursor: "pointer", textAlign: "left",
                      }}
                    >
                      {name}
                      <svg width="14" height="14" viewBox="0 0 10 10" fill="none"
                        style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }}>
                        <path d="M2 3.5L5 6.5L8 3.5" stroke="rgba(255,255,255,0.55)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: "auto" }}
                          exit={{ height: 0 }}
                          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                          style={{ overflow: "hidden", background: "rgba(0,0,0,0.12)" }}
                        >
                          {items.map((item, j) => (
                            <Link key={item}
                              href={`/shop/${name.toLowerCase().replace(" ", "-")}/${item.toLowerCase()}`}
                              onClick={() => setMenuOpen(false)}
                              className="font-ekstra"
                              style={{
                                display: "block", padding: "15px 24px 15px 42px",
                                color: "rgba(255,255,255,0.55)", fontSize: 16, textDecoration: "none",
                                borderBottom: j < items.length - 1
                                  ? "1px solid rgba(255,255,255,0.04)"
                                  : "1px solid rgba(255,255,255,0.06)",
                              }}
                            >{item}</Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}

              {/* B2B */}
              <Link href="/b2b" onClick={() => setMenuOpen(false)} className="font-druk"
                style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "18px 24px",
                  color: "#eddc8c", fontSize: 18, textDecoration: "none",
                  borderTop: "1px solid rgba(255,255,255,0.06)", letterSpacing: "0.06em",
                }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#eddc8c", flexShrink: 0 }} />
                B2B Partner
              </Link>

              {/* Login */}
              <Link href="/login" onClick={() => setMenuOpen(false)} className="font-ekstra"
                style={{
                  display: "flex", alignItems: "center", gap: 14, padding: "18px 24px",
                  color: "rgba(255,255,255,0.82)", fontSize: 18, textDecoration: "none",
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                }}>
                <IconUser color="rgba(255,255,255,0.7)" />
                Kunden Login
              </Link>

              {/* Social */}
              <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "18px 24px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <a href="https://instagram.com/weedforfriends" target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", opacity: 0.55 }}>
                  <IconIG color="rgba(255,255,255,1)" />
                </a>
                <a href="https://tiktok.com/@weedforfriends" target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", opacity: 0.55 }}>
                  <IconTT color="rgba(255,255,255,1)" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
