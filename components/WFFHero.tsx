"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion"
import { useStopHaptics }  from "@/hooks/useStopHaptics"
import { HEADER_H } from "@/components/WFFHeader"

// ── Constants ─────────────────────────────────────────────────────────────────
const PAGE_BG  = "#35383f"
const TEXT_COL = "#35383f"

// ── Tab data ──────────────────────────────────────────────────────────────────
const TABS = [
  { id: 0, label: "Amnesia Haze",       lineA: "AMNESIA",    lineB: "HAZE",    desc: "Frisch, zitrusig, klar im Kopf.",   bottom: "AMNESIA HAZE · HC 96% · SUPERIOR BLEND" },
  { id: 1, label: "Purple Haze",        lineA: "PURPLE",     lineB: "HAZE",    desc: "Berry, süß, verspielt.",            bottom: "PURPLE HAZE · HC 96% · SUPERIOR BLEND" },
  { id: 2, label: "Northern Lights",    lineA: "NORTHERN",   lineB: "LIGHTS",  desc: "Ein Zug und du weißt Bescheid.",    bottom: "NORTHERN LIGHTS · HC 96% · SUPERIOR BLEND" },
  { id: 3, label: "Ice Cream Cookies",  lineA: "ICE CREAM",  lineB: "COOKIES", desc: "Cremig, süß, smooth bis zum Ende.", bottom: "ICE CREAM COOKIES · HC 96% · SUPERIOR BLEND" },
  { id: 4, label: "Girl Scout Cookies", lineA: "GIRL SCOUT", lineB: "COOKIES", desc: "Earthy, süß – ein Klassiker.",      bottom: "GIRL SCOUT COOKIES · HC 96% · SUPERIOR BLEND" },
  { id: 5, label: "Gelato",             lineA: "",           lineB: "GELATO",  desc: "Dessert-Feeling mit jedem Zug.",    bottom: "GELATO · HC 96% · SUPERIOR BLEND" },
]

// Perfectly continuous — each flavor owns exactly 1/6 of the scroll range, no dead zones
const TAB_ACTIVE: [number, number][] = [
  [0.000, 0.167],
  [0.167, 0.333],
  [0.333, 0.500],
  [0.500, 0.667],
  [0.667, 0.833],
  [0.833, 1.000],
]

const TAB_JUMP = [0.083, 0.250, 0.417, 0.583, 0.750, 0.917]

// ── Left headline ─────────────────────────────────────────────────────────────
function LeftHeadline({
  activeTab,
  reduced,
}: {
  activeTab: number
  reduced: boolean | null
}) {
  const tab = TABS[activeTab]

  const lineVariants = {
    hidden: (custom: number) => ({
      opacity: 0,
      y: reduced ? 0 : 20,
      filter: reduced ? "blur(0px)" : "blur(5px)",
      transition: { delay: custom * 0.07 },
    }),
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        delay: custom * 0.07,
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  }

  return (
    <div
      className="absolute z-[20] pointer-events-none select-none"
      style={{
        bottom: "clamp(48px, 8vh, 100px)",
        left: "clamp(16px, 4vw, 80px)",
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0, transition: { duration: 0.07 } }}
        >
          <motion.p
            custom={0}
            variants={lineVariants}
            className="font-adieu uppercase leading-none"
            style={{
              fontSize: "clamp(0.8rem, 2vw, 2rem)",
              color: TEXT_COL,
              opacity: 0.5,
              letterSpacing: "0.04em",
            }}
          >
            {tab.lineA || " "}
          </motion.p>
          <motion.p
            custom={1}
            variants={lineVariants}
            className="font-adieu uppercase"
            style={{
              fontSize: "clamp(1.8rem, 8vw, 10rem)",
              lineHeight: 0.82,
              letterSpacing: "-0.02em",
              color: TEXT_COL,
            }}
          >
            {tab.lineB}
          </motion.p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ── Right counter + description ───────────────────────────────────────────────
function RightInfo({ activeTab }: { activeTab: number }) {
  const tab = TABS[activeTab]
  return (
    <div
      className="hidden md:block absolute z-[20] pointer-events-none select-none"
      style={{
        bottom: "clamp(70px, 12vh, 110px)",
        right: "clamp(20px, 5vw, 80px)",
        maxWidth: "clamp(160px, 18vw, 220px)",
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
        >
          <p
            className="font-ekstra leading-relaxed"
            style={{ fontSize: "clamp(14px, 1.4vw, 20px)", color: "rgba(53,56,63,0.80)" }}
          >
            {tab.desc}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ── Bottom strip ──────────────────────────────────────────────────────────────
function BottomStrip({ activeTab }: { activeTab: number }) {
  return (
    <div className="absolute bottom-4 left-0 right-0 flex justify-center z-[20] pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.p
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          className="font-mono text-[9px] md:text-[11px] tracking-[0.15em] md:tracking-[0.35em] uppercase px-4 text-center"
          style={{ color: "rgba(53,56,63,0.45)" }}
        >
          {TABS[activeTab].bottom}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export function WFFHero() {
  const containerRef  = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState(0)
  const activeTabRef  = useRef(0)
  const prevTabRef    = useRef(0)
  const reduced       = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  // Tab detection
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    for (let i = 0; i < TAB_ACTIVE.length; i++) {
      const [lo, hi] = TAB_ACTIVE[i]
      if (v >= lo && v <= hi) {
        if (activeTabRef.current !== i) {
          activeTabRef.current = i
          setActiveTab(i)
          window.dispatchEvent(new CustomEvent("wff-flavor", { detail: { index: i } }))
        }
        return
      }
    }
  })

  useStopHaptics(activeTab)
  useEffect(() => { prevTabRef.current = activeTab }, [activeTab])

  const handleTabClick = useCallback((i: number) => {
    const el = containerRef.current
    if (!el) return
    window.scrollTo({ top: el.offsetTop + TAB_JUMP[i] * el.offsetHeight, behavior: "smooth" })
  }, [])

  const tabProgress = useTransform(scrollYProgress, (v) => {
    const [lo, hi] = TAB_ACTIVE[activeTabRef.current] ?? [0, 1]
    return Math.min(Math.max((v - lo) / (hi - lo), 0), 1)
  })

  // Fade content to transparent (cream bg stays solid) before sticky releases
  const contentExit = useTransform(scrollYProgress, [0.86, 1.0], [1, 0])

  const innerH = `calc(100svh - ${HEADER_H}px)`

  return (
    <div ref={containerRef} style={{ height: "600vh", paddingTop: HEADER_H }}>
      <div
        className="sticky w-full overflow-hidden"
        style={{ top: HEADER_H, height: innerH, background: PAGE_BG }}
      >
        <motion.div className="absolute inset-0" style={{ opacity: contentExit }} aria-hidden={false}>

          {/* Grain texture */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              zIndex: 15,
              opacity: 0.045,
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat",
              backgroundSize: "200px 200px",
            }}
            aria-hidden
          />

          {/* Ambient glow — behind product */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              zIndex: 1,
              background:
                "radial-gradient(ellipse 55% 50% at 50% 46%, rgba(201,168,76,0.07) 0%, rgba(160,186,135,0.04) 45%, transparent 70%)",
            }}
          />

          {/* TIKTOK — left edge, vertically centered, desktop only */}
          <div
            className="hidden md:block absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none select-none"
            style={{ zIndex: 20 }}
          >
            <a
              href="https://tiktok.com/@weedforfriends"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono tracking-[0.28em] uppercase pointer-events-auto transition-colors"
              style={{ fontSize: "10px", color: "rgba(53,56,63,0.45)" }}
              onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(53,56,63,0.85)")}
              onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(53,56,63,0.45)")}
            >
              TIKTOK
            </a>
          </div>

          {/* INSTAGRAM — right edge, vertically centered, desktop only */}
          <div
            className="hidden md:block absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none select-none"
            style={{ zIndex: 20 }}
          >
            <a
              href="https://instagram.com/weedforfriends"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono tracking-[0.28em] uppercase pointer-events-auto transition-colors"
              style={{ fontSize: "10px", color: "rgba(53,56,63,0.45)" }}
              onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(53,56,63,0.85)")}
              onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(53,56,63,0.45)")}
            >
              INSTAGRAM
            </a>
          </div>

          {/* Headlines & info */}
          <LeftHeadline activeTab={activeTab} reduced={reduced} />
          <RightInfo activeTab={activeTab} />
          <BottomStrip activeTab={activeTab} />

          {/* Tab progress line (bottom edge) */}
          <div
            className="absolute bottom-0 left-0 right-0 h-px"
            style={{ zIndex: 20, background: "rgba(53,56,63,0.06)" }}
          >
            <motion.div
              className="h-full origin-left"
              style={{ scaleX: tabProgress, background: TEXT_COL, opacity: 0.18 }}
            />
          </div>

        </motion.div>

      </div>
    </div>
  )
}
