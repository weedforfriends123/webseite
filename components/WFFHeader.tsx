"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingBag, Wind, Package, Candy, Flower2, Layers, User, Briefcase, LucideIcon } from "lucide-react"
import { useCart } from "@/lib/cart"

export const HEADER_H = 64

type SubItem = { name: string; url: string }
type NavItem = { name: string; url: string; icon: LucideIcon; num: string; sub?: SubItem[] }

const NAV_ITEMS: NavItem[] = [
  { name: "Vapes",   url: "/vapes",         icon: Wind,      num: "01" },
  { name: "Pods",    url: "/shop/pods",    icon: Package,   num: "02" },
  { name: "Edibles", url: "/shop/edibles", icon: Candy,     num: "03", sub: [
    { name: "Superior", url: "/shop/edibles/superior" },
    { name: "THC",      url: "/shop/edibles/thc" },
  ]},
  { name: "Blüten",  url: "/shop/blueten", icon: Flower2,   num: "04", sub: [
    { name: "CBD",      url: "/shop/blueten/cbd" },
    { name: "Superior", url: "/shop/blueten/superior" },
  ]},
  { name: "Hasch",   url: "/shop/hasch",   icon: Layers,    num: "05", sub: [
    { name: "CBD",      url: "/shop/hasch/cbd" },
    { name: "Superior", url: "/shop/hasch/superior" },
  ]},
  { name: "Konto",   url: "/account",      icon: User,      num: "06" },
  { name: "B2B",     url: "/b2b",          icon: Briefcase, num: "07" },
]

const SHOP_NAV  = NAV_ITEMS.slice(0, 5)
const EXTRA_NAV = NAV_ITEMS.slice(5)

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <div className="flex flex-col justify-center items-center gap-[5px]" style={{ width: 20, height: 20 }}>
      <motion.span
        animate={{ rotate: open ? 45 : 0, y: open ? 7 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        className="block w-full origin-center"
        style={{ height: 1.5, borderRadius: 2, background: "#35383f" }}
      />
      <motion.span
        animate={{ opacity: open ? 0 : 1, scaleX: open ? 0.4 : 1 }}
        transition={{ duration: 0.18 }}
        className="block w-full"
        style={{ height: 1.5, borderRadius: 2, background: "#35383f" }}
      />
      <motion.span
        animate={{ rotate: open ? -45 : 0, y: open ? -7 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        className="block w-full origin-center"
        style={{ height: 1.5, borderRadius: 2, background: "#35383f" }}
      />
    </div>
  )
}

export function WFFHeader() {
  const pathname = usePathname()
  const [menuOpen,     setMenuOpen]     = useState(false)
  const [expandedItem, setExpandedItem] = useState<string | null>(null)
  const [atHero,       setAtHero]       = useState(true)
  const { dispatch, count } = useCart()

  // New landing page has its own nav — hide this header on the homepage
  if (pathname === "/") return null

  useEffect(() => {
    const onScroll = () => setAtHero(window.scrollY < window.innerHeight * 0.88)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [menuOpen])

  const closeMenu = () => { setMenuOpen(false); setExpandedItem(null) }

  // Hero section has its own integrated nav — hide header until user scrolls
  if (atHero) return null

  return (
    <>
      {/* ── Floating pill navbar (atHero) → flat navbar (scrolled) ── */}
      <header
        className="fixed z-[80] transition-all duration-300"
        style={atHero
          ? { top: 12, left: 16, right: 16 }
          : { top: 0, left: 0, right: 0, background: "rgba(214,236,194,0.96)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", borderBottom: "1px solid rgba(53,56,63,0.08)" }
        }
      >
        {/* Flat nav center — only shown when scrolled past hero */}
        {!atHero && (
          <nav
            className="hidden md:flex items-center justify-center gap-0.5 absolute left-0 right-0"
            style={{ top: 0, height: HEADER_H, pointerEvents: "none" }}
          >
            <div className="flex items-center gap-0.5" style={{ pointerEvents: "all" }}>
              {SHOP_NAV.map(item =>
                item.sub ? (
                  <div key={item.name} className="relative group">
                    <Link
                      href={item.url}
                      className="relative font-adieu uppercase rounded-full transition-all duration-200 inline-flex items-center gap-1"
                      style={{ fontSize: "clamp(0.70rem, 0.84vw, 0.86rem)", letterSpacing: "-0.01em", padding: "7px 12px", color: "rgba(53,56,63,0.50)" }}
                    >
                      <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ background: "rgba(53,56,63,0.06)" }} />
                      <span className="relative group-hover:text-[#35383f] transition-colors duration-200">{item.name}</span>
                      <span className="relative group-hover:text-[#35383f] transition-colors duration-200" style={{ fontSize: "0.5em", opacity: 0.40, lineHeight: 1 }}>▾</span>
                    </Link>
                    <div
                      className="absolute left-1/2 -translate-x-1/2 pt-3 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto transition-all duration-200"
                      style={{ top: "100%", zIndex: 200, minWidth: 130 }}
                    >
                      <div className="flex flex-col rounded-2xl overflow-hidden" style={{ background: "rgba(53,56,63,0.98)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: "1px solid rgba(53,56,63,0.09)", boxShadow: "0 8px 32px rgba(53,56,63,0.14)" }}>
                        {item.sub.map((sub, j) => (
                          <Link key={sub.name} href={sub.url} className="group/sub font-adieu uppercase px-5 py-3 transition-colors duration-150" style={{ fontSize: "clamp(0.70rem, 0.80vw, 0.84rem)", letterSpacing: "-0.01em", color: "rgba(53,56,63,0.40)", borderBottom: j < item.sub!.length - 1 ? "1px solid rgba(53,56,63,0.06)" : "none" }}>
                            <span className="group-hover/sub:text-[#35383f] transition-colors">{sub.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link key={item.name} href={item.url} className="relative group font-adieu uppercase rounded-full transition-all duration-200" style={{ fontSize: "clamp(0.70rem, 0.84vw, 0.86rem)", letterSpacing: "-0.01em", padding: "7px 12px", color: "rgba(53,56,63,0.50)" }}>
                    <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ background: "rgba(53,56,63,0.06)" }} />
                    <span className="relative group-hover:text-[#35383f] transition-colors duration-200">{item.name}</span>
                  </Link>
                )
              )}
            </div>
          </nav>
        )}

        <div
          className="flex items-center justify-between"
          style={atHero ? {} : { height: HEADER_H, paddingLeft: "clamp(20px,4vw,56px)", paddingRight: "clamp(20px,4vw,56px)" }}
        >

          {/* Left: dark pill (atHero) OR plain logo (scrolled) ── */}
          <div
            style={atHero ? {
              display:      "flex",
              alignItems:   "center",
              background:   "#35383f",
              borderRadius: 9999,
              padding:      "5px 6px",
              border:       "1px solid rgba(255,255,255,0.07)",
              boxShadow:    "0 2px 20px rgba(0,0,0,0.20)",
            } : {
              display:    "flex",
              alignItems: "center",
            }}
          >
            {/* Logo */}
            <Link
              href="/"
              onClick={closeMenu}
              style={atHero
                ? { padding: "0 10px 0 6px", flexShrink: 0, display: "flex", alignItems: "center" }
                : { flexShrink: 0, display: "flex", alignItems: "center" }
              }
            >
              <Image
                src="/logo.webp"
                alt="WFF"
                width={110}
                height={36}
                className="h-7 w-auto"
                style={{ filter: atHero ? "brightness(0) invert(1)" : "brightness(0)", opacity: atHero ? 0.88 : 1 }}
                priority
              />
            </Link>

            {/* Divider — only in pill */}
            {atHero && (
              <div
                className="hidden md:block shrink-0"
                style={{ width: 1, height: 18, background: "rgba(53,56,63,0.14)", marginRight: 4 }}
              />
            )}

            {/* Desktop nav links inside the pill — only at hero */}
            <nav className={atHero ? "hidden md:flex items-center gap-0.5" : "hidden"}>
              {SHOP_NAV.map(item =>
                item.sub ? (
                  <div key={item.name} className="relative group">
                    <Link
                      href={item.url}
                      className="relative font-adieu uppercase rounded-full transition-all duration-200 inline-flex items-center gap-1"
                      style={{
                        fontSize:      "clamp(0.70rem, 0.84vw, 0.86rem)",
                        letterSpacing: "-0.01em",
                        padding:       "7px 12px",
                        color:         "rgba(53,56,63,0.52)",
                      }}
                    >
                      <span
                        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        style={{ background: "rgba(53,56,63,0.09)" }}
                      />
                      <span className="relative group-hover:text-[#35383f] transition-colors duration-200">{item.name}</span>
                      <span className="relative group-hover:text-[#35383f] transition-colors duration-200" style={{ fontSize: "0.5em", opacity: 0.40, lineHeight: 1 }}>▾</span>
                    </Link>
                    {/* Dropdown panel */}
                    <div
                      className="absolute left-1/2 -translate-x-1/2 pt-3 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto transition-all duration-200"
                      style={{ top: "100%", zIndex: 200, minWidth: 130 }}
                    >
                      <div
                        className="flex flex-col rounded-2xl overflow-hidden"
                        style={{
                          background:          "rgba(53,56,63,0.98)",
                          backdropFilter:      "blur(20px)",
                          WebkitBackdropFilter:"blur(20px)",
                          border:              "1px solid rgba(53,56,63,0.09)",
                          boxShadow:           "0 8px 32px rgba(53,56,63,0.14)",
                        }}
                      >
                        {item.sub.map((sub, j) => (
                          <Link
                            key={sub.name}
                            href={sub.url}
                            className="group/sub font-adieu uppercase px-5 py-3 transition-colors duration-150"
                            style={{
                              fontSize:     "clamp(0.70rem, 0.80vw, 0.84rem)",
                              letterSpacing:"-0.01em",
                              color:        "rgba(53,56,63,0.40)",
                              borderBottom: j < item.sub!.length - 1 ? "1px solid rgba(53,56,63,0.06)" : "none",
                            }}
                          >
                            <span className="group-hover/sub:text-[#35383f] transition-colors">{sub.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    href={item.url}
                    className="relative group font-adieu uppercase rounded-full transition-all duration-200"
                    style={{
                      fontSize:      "clamp(0.70rem, 0.84vw, 0.86rem)",
                      letterSpacing: "-0.01em",
                      padding:       "7px 12px",
                      color:         "rgba(53,56,63,0.52)",
                    }}
                  >
                    <span
                      className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      style={{ background: "rgba(53,56,63,0.09)" }}
                    />
                    <span className="relative group-hover:text-[#35383f] transition-colors duration-200">{item.name}</span>
                  </Link>
                )
              )}
            </nav>
          </div>

          {/* ── Right group ── */}
          <div className="flex items-center gap-2">

            {/* Konto + B2B — only visible when flat (scrolled) */}
            {!atHero && (
              <div className="hidden md:flex items-center gap-1">
                {EXTRA_NAV.map(item => (
                  <Link
                    key={item.name}
                    href={item.url}
                    className="font-adieu uppercase transition-all duration-200 hover:opacity-80"
                    style={{
                      fontSize:      "clamp(0.68rem, 0.78vw, 0.82rem)",
                      letterSpacing: "-0.01em",
                      padding:       "8px 14px",
                      color:         "rgba(53,56,63,0.42)",
                      background:    "rgba(53,56,63,0.07)",
                      borderRadius:  9999,
                      border:        "1px solid rgba(53,56,63,0.09)",
                      boxShadow:     "0 1px 6px rgba(0,0,0,0.05)",
                      textDecoration:"none",
                      whiteSpace:    "nowrap",
                    }}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Primary CTA pill — md+ */}
            <Link
              href="/shop"
              className="hidden md:inline-flex items-center font-mono uppercase transition-opacity duration-200 hover:opacity-85"
              style={{
                fontSize:      "10px",
                letterSpacing: "0.28em",
                padding:       "11px 24px",
                background:    "#35383f",
                color:         "#35383f",
                borderRadius:  9999,
                border:        "1px solid rgba(255,255,255,0.07)",
                boxShadow:     "0 2px 14px rgba(0,0,0,0.16)",
                textDecoration:"none",
                whiteSpace:    "nowrap",
              }}
            >
              Zum Shop →
            </Link>

            {/* Cart */}
            <button
              onClick={() => dispatch({ type: "TOGGLE_CART" })}
              className="relative flex items-center justify-center rounded-full active:scale-95 transition-all duration-200"
              style={{
                width:      44,
                height:     44,
                background: "#35383f",
                boxShadow:  "0 2px 12px rgba(53,56,63,0.20)",
                border:     "1px solid rgba(255,255,255,0.07)",
                flexShrink: 0,
              }}
            >
              <ShoppingBag size={16} style={{ color: "rgba(53,56,63,0.82)" }} />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{   scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 22 }}
                    className="absolute flex items-center justify-center font-mono leading-none"
                    style={{
                      top: -3, right: -3,
                      width: 16, height: 16,
                      borderRadius: "50%",
                      fontSize: "8px",
                      background: "#a0ba87",
                      color: "#1a1c1f",
                      border: "1.5px solid #35383f",
                    }}
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="md:hidden relative flex items-center justify-center rounded-full active:scale-95 transition-transform duration-150"
              style={{
                width:      44,
                height:     44,
                background: menuOpen ? "#a0ba87" : "#35383f",
                boxShadow:  "0 2px 12px rgba(53,56,63,0.20)",
                border:     "1px solid rgba(255,255,255,0.07)",
                flexShrink: 0,
                transition: "background 0.25s ease",
              }}
              aria-label="Menü"
            >
              <HamburgerIcon open={menuOpen} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile full-screen overlay (separate fixed layer, header floats above) ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{   opacity: 0, y: -16 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="md:hidden fixed inset-0 flex flex-col"
            style={{ background: "#35383f", zIndex: 79, overflow: "auto" }}
          >
            {/* Ghost text watermark */}
            <div
              className="absolute inset-0 flex flex-col justify-end pointer-events-none select-none overflow-hidden"
              aria-hidden
            >
              <p
                className="font-adieu uppercase leading-none"
                style={{
                  fontSize:      "38vw",
                  letterSpacing: "-0.02em",
                  color:         "rgba(53,56,63,0.03)",
                  lineHeight:    0.85,
                }}
              >
                WFF
              </p>
            </div>

            {/* Nav links */}
            <nav
              className="flex-1 flex flex-col justify-start relative z-10"
              style={{ padding: "clamp(80px,15vh,120px) 28px clamp(24px,4vh,40px)" }}
            >
              {NAV_ITEMS.map((item, i) => {
                const hasSub     = !!item.sub?.length
                const isExpanded = expandedItem === item.name
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 + i * 0.055, type: "spring", stiffness: 380, damping: 30 }}
                  >
                    {hasSub ? (
                      <>
                        <button
                          onClick={() => setExpandedItem(isExpanded ? null : item.name)}
                          className="group flex items-center justify-between py-[14px] w-full"
                          style={{ borderBottom: isExpanded ? "none" : "1px solid rgba(53,56,63,0.06)" }}
                        >
                          <span
                            className="font-adieu uppercase leading-none transition-colors duration-200"
                            style={{
                              fontSize:      "clamp(1.5rem, 7vw, 2rem)",
                              letterSpacing: "-0.025em",
                              color:         isExpanded ? "#a0ba87" : "rgba(53,56,63,0.82)",
                            }}
                          >
                            {item.name}
                          </span>
                          <span
                            className="font-mono transition-all duration-200"
                            style={{
                              fontSize:  "0.75rem",
                              color:     "rgba(53,56,63,0.25)",
                              transform: isExpanded ? "rotate(90deg)" : "none",
                            }}
                          >
                            →
                          </span>
                        </button>

                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              key="sub"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{   opacity: 0, height: 0 }}
                              transition={{ type: "spring", stiffness: 360, damping: 32 }}
                              style={{ overflow: "hidden", borderBottom: "1px solid rgba(53,56,63,0.06)" }}
                            >
                              <div className="pl-4 pb-2">
                                {item.sub!.map(sub => (
                                  <Link
                                    key={sub.name}
                                    href={sub.url}
                                    onClick={closeMenu}
                                    className="group/sub flex items-center justify-between py-3"
                                    style={{ borderBottom: "1px solid rgba(53,56,63,0.04)" }}
                                  >
                                    <span
                                      className="font-adieu uppercase leading-none group-active/sub:text-[#a0ba87] transition-colors"
                                      style={{
                                        fontSize:      "clamp(1rem, 5vw, 1.4rem)",
                                        letterSpacing: "-0.02em",
                                        color:         "rgba(53,56,63,0.50)",
                                      }}
                                    >
                                      {sub.name}
                                    </span>
                                    <span style={{ fontSize: "0.65rem", color: "rgba(53,56,63,0.14)" }}>→</span>
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        href={item.url}
                        onClick={closeMenu}
                        className="group flex items-center justify-between py-[14px]"
                        style={{ borderBottom: "1px solid rgba(53,56,63,0.06)" }}
                      >
                        <span
                          className="font-adieu uppercase leading-none transition-colors duration-200 group-active:text-[#a0ba87]"
                          style={{
                            fontSize:      "clamp(1.5rem, 7vw, 2rem)",
                            letterSpacing: "-0.025em",
                            color:         "rgba(53,56,63,0.82)",
                          }}
                        >
                          {item.name}
                        </span>
                        <span
                          className="font-mono transition-all duration-200 group-active:translate-x-1"
                          style={{ fontSize: "0.75rem", color: "rgba(53,56,63,0.18)" }}
                        >
                          →
                        </span>
                      </Link>
                    )}
                  </motion.div>
                )
              })}
            </nav>

            {/* Bottom social bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.38 }}
              className="relative z-10 px-7 py-5 flex items-center justify-between"
              style={{ borderTop: "1px solid rgba(53,56,63,0.06)" }}
            >
              <div className="flex gap-6">
                {["TikTok", "Instagram"].map(s => (
                  <a
                    key={s}
                    href={`https://${s.toLowerCase()}.com/@weedforfriends`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono uppercase"
                    style={{ fontSize: "8px", letterSpacing: "0.3em", color: "rgba(53,56,63,0.25)" }}
                  >
                    {s}
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
