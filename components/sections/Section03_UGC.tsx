"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"

const BG    = "#bcc0ca"
const TEXT  = "#35383f"
const MUTED = "rgba(53,56,63,0.52)"

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } },
}
const fadeUpSlow = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
}

function PolaroidVideo({ src, rotate, zIndex, delay, width }: {
  src: string; rotate: number; zIndex: number; delay: number; width: string
}) {
  const noMotion = useReducedMotion()
  return (
    <motion.div
      initial={noMotion ? false : { opacity: 0, y: 80, rotate: rotate - 8, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, rotate, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1], scale: { duration: 0.9 } }}
      whileHover={{ y: -8, rotate: rotate * 0.6, transition: { duration: 0.35, ease: "easeOut" } }}
      style={{
        background: "#fff",
        padding: "10px 10px 48px",
        boxShadow: "0 28px 72px rgba(0,0,0,0.45), 0 4px 18px rgba(0,0,0,0.18)",
        borderRadius: 4,
        width, flexShrink: 0,
        zIndex, position: "relative",
        cursor: "default",
      }}
    >
      <video src={src} autoPlay muted loop playsInline
        style={{ display: "block", width: "100%", aspectRatio: "9/16", objectFit: "cover", borderRadius: 2 }} />
    </motion.div>
  )
}

function TextBlock({ noMotion }: { noMotion: boolean | null }) {
  return (
    <motion.div
      variants={container}
      initial={noMotion ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      style={{ display: "flex", flexDirection: "column", gap: "clamp(16px,2.2vh,26px)" }}
    >
      <motion.p variants={fadeUpSlow}
        style={{ color: TEXT, fontSize: "clamp(20px,2.4vw,36px)", fontWeight: 700, lineHeight: 1.4, margin: 0 }}>
        Wir wollen echte Vibes zugänglich machen — für jeden Moment,
        jede Stimmung und jeden Style. Damit du dich besser fühlst
        und das Leben in vollen Zügen genießt.
      </motion.p>

      <motion.p variants={fadeUpSlow}
        style={{ color: MUTED, fontSize: "clamp(15px,1.5vw,22px)", lineHeight: 1.7, margin: 0 }}>
        Von echten Friends geliebt — von Vapes über Pouches bis zu unseren Drops.
        Alle Produkte enthalten sorgfältig ausgewählte Cannabinoide in
        Apothekenqualität, ohne Tabak und ohne Nikotin. Laborgeprüft,
        EU-zertifiziert. Kein Kompromiss.
      </motion.p>

      <motion.div variants={fadeUpSlow}
        style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <a href="/shop" className="font-druk-wide uppercase"
          style={{
            display: "inline-flex", alignItems: "center",
            background: TEXT, color: BG, borderRadius: 999,
            padding: "4px 26px 4px 4px",
            fontSize: "clamp(13px,1.1vw,16px)", letterSpacing: "0.02em",
            textDecoration: "none", fontWeight: 700,
          }}>
          <span style={{
            width: 40, height: 40, borderRadius: "50%",
            background: BG, display: "inline-flex",
            alignItems: "center", justifyContent: "center",
            marginRight: 14, flexShrink: 0,
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 12L12 2M12 2H4M12 2V10" stroke={TEXT} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          Jetzt bestellen
        </a>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: "clamp(20px,1.8vw,26px)", color: TEXT, letterSpacing: 3 }}>★★★★★</span>
          <span style={{ color: MUTED, fontSize: "clamp(14px,1vw,18px)" }}>2.400+ Reviews</span>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function Section03_UGC() {
  const noMotion = useReducedMotion()
  const PAD_X = "clamp(24px,5vw,80px)"
  const mobileRef     = useRef<HTMLDivElement>(null)
  const stripInnerRef = useRef<HTMLDivElement>(null)
  const [totalShift, setTotalShift] = useState(300)

  const { scrollYProgress } = useScroll({ target: mobileRef, offset: ["start end", "end start"] })

  useEffect(() => {
    const el = stripInnerRef.current
    if (!el) return
    const measure = () =>
      setTotalShift(Math.max(0, el.offsetWidth - (el.parentElement?.clientWidth ?? window.innerWidth)))
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [])

  // Complete translation by 70% scroll progress — all cards visible before section exits
  // No spring: direct follow so strip keeps up with the user's scroll
  const x = useTransform(scrollYProgress, [0.04, 0.70], [0, -totalShift])

  return (
    <section style={{ background: BG, position: "relative" }}>

      {/* ── HEADLINE ──────────────────────────────────────────────────────── */}
      <motion.div
        variants={container}
        initial={noMotion ? false : "hidden"}
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        style={{
          padding: `clamp(40px,5vh,80px) ${PAD_X} 0`,
          textAlign: "center",
          marginBottom: "clamp(80px,12vh,160px)",
        }}
      >
        <h2 className="font-druk-wide uppercase"
          style={{ lineHeight: 0.92, fontSize: "clamp(40px,7.5vw,130px)", margin: 0, letterSpacing: "-0.02em" }}>
          <motion.span variants={fadeUp} style={{ display: "block", color: "transparent", WebkitTextStroke: `clamp(1.5px,0.15vw,2px) ${TEXT}` }}>
            Real People.
          </motion.span>
          <motion.span variants={fadeUp} style={{ display: "block", color: TEXT }}>
            Real Vibes.
          </motion.span>
        </h2>
      </motion.div>

      {/* ── MOBILE LAYOUT ─────────────────────────────────────────────────── */}
      <div ref={mobileRef} className="md:hidden" style={{ background: BG }}>
        {/* Scroll-driven horizontal strip */}
        <div style={{ overflow: "hidden", padding: "20px 0 48px", background: BG }}>
          <motion.div
            ref={stripInnerRef}
            style={{
              display: "flex",
              gap: 16,
              paddingLeft: 24,
              paddingRight: 24,
              width: "max-content",
              x: noMotion ? 0 : x,
            }}
          >
            {[
              { src: "/ugc1.mp4", rotate: -8,  delay: 0    },
              { src: "/ugc3.mp4", rotate: -2,  delay: 0.1  },
              { src: "/ugc4.mp4", rotate: 5,   delay: 0.2  },
              { src: "/ugc2.mp4", rotate: 10,  delay: 0.3  },
            ].map(({ src, rotate, delay }) => (
              <motion.div
                key={src}
                initial={noMotion ? false : { opacity: 0, rotate }}
                whileInView={{ opacity: 1, rotate }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  background: "#fff",
                  padding: "8px 8px 36px",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.16)",
                  borderRadius: 4,
                  width: "clamp(140px,42vw,190px)",
                  flexShrink: 0,
                  originX: "50%",
                  originY: "50%",
                }}
              >
                <video src={src} autoPlay muted loop playsInline
                  style={{ display: "block", width: "100%", aspectRatio: "9/16", objectFit: "cover", borderRadius: 2 }} />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Mobile text content */}
        <div style={{ padding: `0 clamp(20px,6vw,40px) clamp(60px,10vh,100px)` }}>
          <TextBlock noMotion={noMotion} />
        </div>
      </div>

      {/* ── SCRIBBLE — bottom-right, at the Section2→Section3 boundary ────── */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.9, delay: 0.4 }}
        aria-hidden
        style={{
          position: "absolute",
          bottom: "-80px",
          right: "clamp(60px,10vw,180px)",
          transform: "rotate(3deg)",
          zIndex: 30, pointerEvents: "none", userSelect: "none",
          textAlign: "right",
        }}
      >
        <p className="font-mindflow" style={{ color: "#eddc8c", fontSize: "clamp(32px,5.5vw,88px)", lineHeight: 1.3 }}>
          Why People love<br />our products
        </p>
        <svg width="64" height="72" viewBox="0 0 64 72" style={{ marginTop: 6, display: "block", marginLeft: "auto" }}>
          <path d="M52 6 Q32 34 14 62" fill="none" stroke="#eddc8c" strokeWidth="2" strokeLinecap="round" />
          <path d="M14 62L10 46M14 62L28 56" fill="none" stroke="#eddc8c" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </motion.div>

      {/* ── DESKTOP LAYOUT ────────────────────────────────────────────────── */}
      <div
        className="hidden md:grid"
        style={{
          gridTemplateColumns: "1fr 1fr",
          alignItems: "center",
          padding: `0 ${PAD_X} clamp(80px,12vh,160px) clamp(140px,20vw,360px)`,
        }}
      >
        {/* Left: Polaroid stack */}
        <div style={{ position: "relative", minHeight: "clamp(380px,58vw,680px)" }}>
          <div style={{ position: "absolute", left: "2%",  bottom: "2%"  }}>
            <PolaroidVideo src="/ugc1.mp4" rotate={-12} zIndex={1} delay={0.10} width="clamp(200px,24vw,340px)" />
          </div>
          <div style={{ position: "absolute", left: "18%", bottom: "10%" }}>
            <PolaroidVideo src="/ugc3.mp4" rotate={-3}  zIndex={2} delay={0.22} width="clamp(210px,26vw,360px)" />
          </div>
          <div style={{ position: "absolute", left: "42%", bottom: "5%"  }}>
            <PolaroidVideo src="/ugc4.mp4" rotate={6}   zIndex={3} delay={0.34} width="clamp(200px,24vw,340px)" />
          </div>
          <div style={{ position: "absolute", left: "60%", bottom: "0%"  }}>
            <PolaroidVideo src="/ugc2.mp4" rotate={11}  zIndex={4} delay={0.46} width="clamp(200px,24vw,340px)" />
          </div>
        </div>

        {/* Right: Text */}
        <div style={{
          paddingTop: "clamp(40px,8vh,120px)",
          paddingLeft: "clamp(20px,4vw,80px)",
        }}>
          <TextBlock noMotion={noMotion} />
        </div>
      </div>

    </section>
  )
}
