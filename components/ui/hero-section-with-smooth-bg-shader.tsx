"use client"

import { MeshGradient } from "@paper-design/shaders-react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useEffect, useRef, useState } from "react"

interface HeroSectionShaderProps {
  title?: string
  highlightText?: string
  description?: string
  buttonText?: string
  onButtonClick?: () => void
  colors?: string[]
  distortion?: number
  swirl?: number
  speed?: number
  offsetX?: number
  className?: string
  titleClassName?: string
  descriptionClassName?: string
  buttonClassName?: string
  maxWidth?: string
  veilOpacity?: string
}

export function HeroSectionShader({
  title = "Nur das Beste.",
  highlightText = "Immer.",
  description = "Premium Produkte",
  buttonText = "Jetzt entdecken →",
  onButtonClick,
  // WFF warm earthy palette: cream, wheat, amber gold, sage green
  colors = ["#35383f", "#e6dfc4", "#c9a84c", "#a0ba87", "#d4c490", "#35383f"],
  distortion = 0.8,
  swirl = 0.55,
  speed = 0.32,
  offsetX = 0.06,
  className = "",
  titleClassName = "",
  descriptionClassName = "",
  buttonClassName = "",
  maxWidth = "max-w-5xl",
  veilOpacity = "bg-[#35383f]/30",
}: HeroSectionShaderProps) {
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 })
  const [mounted, setMounted]       = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setMounted(true)
    const update = () => setDimensions({ width: window.innerWidth, height: window.innerHeight })
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  // Section exit parallax — content fades & drifts upward as section scrolls away
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })
  const contentOpacity = useTransform(scrollYProgress, [0, 0.25, 0.65], [1, 1, 0])
  const contentY       = useTransform(scrollYProgress, [0, 0.65], ["0px", "-52px"])

  return (
    <section
      ref={sectionRef}
      className={`relative w-full min-h-screen overflow-hidden flex items-center justify-center ${className}`}
      style={{ background: "#35383f" }}
    >
      {/* ── Animated mesh gradient background ── */}
      <div className="absolute inset-0">
        {mounted && (
          <>
            <MeshGradient
              width={dimensions.width}
              height={dimensions.height}
              colors={colors}
              distortion={distortion}
              swirl={swirl}
              grainMixer={0}
              grainOverlay={0}
              speed={speed}
              offsetX={offsetX}
            />
            {/* Cream veil — keeps WFF's muted, editorial feel */}
            <div className={`absolute inset-0 pointer-events-none ${veilOpacity}`} />
          </>
        )}
      </div>

      {/* ── Bottom fade → blends into section 2 cream ── */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{ height: "28vh", background: "linear-gradient(to bottom, transparent, #35383f)", zIndex: 5 }}
      />

      {/* ── Content — fades & drifts up as section exits ── */}
      <motion.div
        className={`relative z-10 ${maxWidth} mx-auto px-6 w-full`}
        style={{ opacity: contentOpacity, y: contentY }}
      >
        <div className="text-center">

          {/* Social proof badge */}
          <div className="flex items-center justify-center mb-10">
            <div
              className="inline-flex items-center gap-3"
              style={{
                background:     "rgba(53,56,63,0.72)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border:         "1px solid rgba(53,56,63,0.10)",
                borderRadius:   9999,
                padding:        "6px 16px 6px 8px",
              }}
            >
              {/* Stacked avatars */}
              <div className="flex -space-x-2">
                {[
                  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=48&h=48&fit=crop&crop=face",
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&crop=face",
                  "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=48&h=48&fit=crop&crop=face",
                  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=48&h=48&fit=crop&crop=face",
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    width={24}
                    height={24}
                    alt=""
                    className="rounded-full"
                    style={{
                      width:  24,
                      height: 24,
                      outline: "2px solid rgba(53,56,63,0.9)",
                      objectFit: "cover",
                    }}
                  />
                ))}
              </div>
              {/* Text — short on mobile, full on sm+ */}
              <p
                className="font-mono uppercase sm:hidden"
                style={{ fontSize: "9px", letterSpacing: "0.12em", color: "rgba(53,56,63,0.55)" }}
              >
                <strong style={{ color: "#35383f", fontWeight: 600 }}>12.000+</strong> Kunden
              </p>
              <p
                className="font-mono uppercase hidden sm:block"
                style={{ fontSize: "9px", letterSpacing: "0.3em", color: "rgba(53,56,63,0.55)", whiteSpace: "nowrap" }}
              >
                Über <strong style={{ color: "#35383f", fontWeight: 600 }}>12.000</strong> zufriedene Kunden
              </p>
            </div>
          </div>

          {/* Headline — Adieu brand font */}
          <h1
            className={`font-adieu uppercase leading-none mb-6 ${titleClassName}`}
            style={{
              fontSize:      "clamp(3rem, 9vw, 10rem)",
              letterSpacing: "-0.03em",
              lineHeight:    0.88,
              color:         "#35383f",
            }}
          >
            {title}
            <br />
            <span style={{ color: "#c9a84c" }}>{highlightText}</span>
          </h1>

          {/* Description */}
          <p
            className={`font-ekstra leading-relaxed mb-10 mx-auto ${descriptionClassName}`}
            style={{
              fontSize:  "clamp(13px, 1.4vw, 18px)",
              color:     "rgba(53,56,63,0.62)",
              maxWidth:  480,
            }}
          >
            {description}
          </p>

          {/* CTA button — matches WFF MetalButton style */}
          <button
            onClick={onButtonClick}
            className={`font-mono uppercase tracking-[0.25em] transition-all duration-200 hover:opacity-80 active:scale-95 ${buttonClassName}`}
            style={{
              fontSize:     "11px",
              padding:      "14px 36px",
              background:   "#35383f",
              color:        "#35383f",
              border:       "1px solid rgba(53,56,63,0.18)",
              borderRadius: 9999,
              cursor:       "pointer",
            }}
          >
            {buttonText}
          </button>
        </div>
      </motion.div>
    </section>
  )
}
