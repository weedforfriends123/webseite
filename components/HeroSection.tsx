"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { MoreButton } from "@/components/ui/more-button"

const SAGE  = "#a0ba87"   // medium sage — splash background
const LIGHT = "#d6ecc2"   // light sage — product hero background
const DARK  = "#35383f"
const CREAM = "#35383f"

function WFFWordmark() {
  return (
    <svg
      viewBox="0 0 109.892 30.0167"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "clamp(260px, 74vw, 1100px)", height: "auto", display: "block" }}
      aria-label="WeedForFriends"
    >
      <path
        fill={DARK}
        d="M53.297 6.13682C59.8295 6.13682 64.0279 7.30677 66.6996 9.02065C67.4823 9.52277 68.7032 9.00101 68.7032 8.07105V7.62373C68.7032 7.05926 69.1608 6.60166 69.7253 6.60166L83.5445 6.60166C83.9233 6.60166 84.271 6.81114 84.448 7.14599L88.6737 15.138C89.0539 15.8571 90.081 15.8655 90.4729 15.1528L94.8837 7.13127C95.0633 6.80462 95.4065 6.60166 95.7793 6.60166L108.87 6.60166C109.434 6.60166 109.892 7.05926 109.892 7.62373L109.892 28.5347C109.892 29.0991 109.434 29.5567 108.87 29.5567L99.2516 29.5567C98.6872 29.5567 98.2296 29.0991 98.2296 28.5347L98.2296 22.2233C98.2296 21.1636 96.8155 20.8041 96.3095 21.7352L92.3489 29.0227C92.17 29.3518 91.8255 29.5567 91.4509 29.5567L87.0839 29.5567C86.7086 29.5567 86.3634 29.351 86.1849 29.0208L82.2562 21.7551C81.7516 20.8219 80.335 21.1804 80.335 22.2412L80.335 28.5347C80.335 29.0991 79.8774 29.5567 79.313 29.5567L69.7253 29.5567C69.1608 29.5567 68.7032 29.0991 68.7032 28.5347V27.9982C68.7032 27.0638 67.4708 26.5434 66.6892 27.0556C64.0157 28.8078 59.8188 30.0167 53.297 30.0167L51.755 30.0167C43.8923 30.0167 39.4067 28.2525 36.8968 25.8976C36.1493 25.1961 34.1062 25.4745 33.4363 26.2504C31.5478 28.4378 27.4659 30.0137 19.2218 30.0138L15.1798 30.0138C1.26518 30.0138 0.000103244 24.9542 8.01852e-05 21.9923C8.01852e-05 21.8558 0.110697 21.7452 0.247151 21.7452L12.7075 21.7452C13.272 21.7452 13.6928 22.2254 13.9215 22.7414C14.2599 23.5052 15.1509 24.2139 17.3702 24.214C20.085 24.214 20.8876 23.4424 20.8878 22.6095V22.5167C20.8878 21.7454 20.5791 21.0362 16.63 20.8819L11.7862 20.7276C2.34516 20.3883 0.370197 17.0552 0.370197 13.4454L0.370197 13.1681C0.370276 8.84876 3.82593 6.19546 14.9327 6.19541L19.3145 6.19541C31.6246 6.19549 34.4942 9.46599 34.4942 13.4151C34.4942 13.5004 34.4251 13.5694 34.3399 13.5694L21.9443 13.5694C21.4289 13.5694 21.0412 13.1495 20.7453 12.7274C20.37 12.1921 19.52 11.7179 17.5245 11.7179C14.7175 11.7179 13.7299 12.1499 13.7296 12.921L13.7296 12.9835C13.7299 13.8163 14.6254 14.2787 18.1729 14.3712L22.8009 14.4952C28.6794 14.6574 32.054 15.6452 33.6773 17.6252C33.7465 17.7096 33.8907 17.662 33.8907 17.5528C33.8907 12.7398 36.2359 6.13682 51.755 6.13682L53.297 6.13682ZM52.4952 13.4493C47.4046 13.4493 45.9543 15.732 45.9542 17.7374V18.1075C45.9542 20.1747 47.5587 22.6437 52.4952 22.6437C57.493 22.6436 59.0662 20.2679 59.0665 18.17V17.7374C59.0664 15.732 57.524 13.4493 52.4952 13.4493Z"
      />
      <path fill={DARK} d="M44.5469 4.43452V0H60.9109V4.43452H44.5469Z" />
    </svg>
  )
}

// Stat bubbles + C-arch SVG connector (like More Nutrition)
function StatBubbles() {
  return (
    <div
      style={{
        position: "relative",
        width: "clamp(180px, 22vw, 270px)",
        height: "clamp(260px, 32vw, 360px)",
        flexShrink: 0,
      }}
    >
      {/* White C-arch looping left between bubbles */}
      <svg
        viewBox="0 0 270 360"
        preserveAspectRatio="xMidYMid meet"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          overflow: "visible",
          pointerEvents: "none",
        }}
        aria-hidden
      >
        <path
          d="M 210,60 C -30,60 -30,300 210,300"
          fill="none"
          stroke="rgba(255,255,255,0.90)"
          strokeWidth="36"
          strokeLinecap="round"
        />
      </svg>

      {/* Top bubble — HC 96% */}
      <div
        style={{
          position: "absolute",
          top: 24,
          right: 0,
          background: "rgba(255,255,255,0.93)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderRadius: 999,
          padding: "clamp(8px,1.2vw,14px) clamp(16px,2.2vw,28px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minWidth: "clamp(100px,13vw,155px)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        }}
      >
        <span
          className="font-adieu"
          style={{ fontSize: "clamp(1.4rem,2.4vw,2.2rem)", color: DARK, lineHeight: 1 }}
        >
          96%
        </span>
        <span
          className="font-ekstra"
          style={{ fontSize: "clamp(9px,0.72vw,11px)", color: "rgba(53,56,63,0.55)", letterSpacing: "0.05em", marginTop: 3 }}
        >
          HC Reinheit
        </span>
      </div>

      {/* Bottom bubble — 2 Tage */}
      <div
        style={{
          position: "absolute",
          bottom: 24,
          right: 0,
          background: "rgba(255,255,255,0.93)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderRadius: 999,
          padding: "clamp(8px,1.2vw,14px) clamp(16px,2.2vw,28px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minWidth: "clamp(100px,13vw,155px)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        }}
      >
        <span
          className="font-adieu"
          style={{ fontSize: "clamp(1.4rem,2.4vw,2.2rem)", color: DARK, lineHeight: 1 }}
        >
          2T
        </span>
        <span
          className="font-ekstra"
          style={{ fontSize: "clamp(9px,0.72vw,11px)", color: "rgba(53,56,63,0.55)", letterSpacing: "0.05em", marginTop: 3 }}
        >
          Lieferung
        </span>
      </div>
    </div>
  )
}

// Section 1: full-viewport wordmark splash
function SplashSection() {
  return (
    <section
      style={{
        background: SAGE,
        minHeight: "100svh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(40px, 6vw, 80px)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 36 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "clamp(16px,2.4vw,30px)" }}
      >
        <Image
          src="/logo.webp"
          alt="WFF"
          width={130}
          height={130}
          style={{ width: "clamp(72px,11vw,130px)", height: "auto", objectFit: "contain" }}
          priority
        />
        <WFFWordmark />
      </motion.div>
    </section>
  )
}

// Section 2: product hero — large product + stats left + headline right
function ProductHeroSection() {
  return (
    <section
      style={{
        background: LIGHT,
        minHeight: "100svh",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(80px, 10vh, 120px) clamp(32px, 5vw, 80px)",
        gap: "clamp(12px, 2vw, 36px)",
      }}
    >
      {/* Headline — absolute top-right */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "absolute",
          top: "clamp(48px, 8vh, 88px)",
          right: "clamp(32px, 5vw, 80px)",
          textAlign: "right",
          zIndex: 10,
        }}
      >
        <h1
          className="font-adieu uppercase"
          style={{
            fontSize: "clamp(2rem, 5vw, 7.5rem)",
            color: DARK,
            lineHeight: 0.88,
            letterSpacing: "-0.025em",
            marginBottom: "clamp(20px, 3vh, 40px)",
          }}
        >
          VAPES
          <br />
          MEETS
          <br />
          REINHEIT
        </h1>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <MoreButton label="Jetzt kaufen" href="/shop" />
        </div>
      </motion.div>

      {/* Stat bubbles — left */}
      <motion.div
        initial={{ opacity: 0, x: -28 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{ flexShrink: 0 }}
      >
        <StatBubbles />
      </motion.div>

      {/* Product — HUGE, center */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        style={{ flexShrink: 0 }}
      >
        <Image
          src="/frames2/ezgif-frame-001.png"
          alt="WFF Northern Lights Vape"
          width={300}
          height={700}
          style={{
            width: "clamp(160px, 24vw, 380px)",
            height: "auto",
            objectFit: "contain",
            filter: "drop-shadow(0 40px 80px rgba(53,56,63,0.22))",
            display: "block",
          }}
          priority
        />
      </motion.div>
    </section>
  )
}

export function HeroSection({ onScrollDown }: { onScrollDown?: () => void }) {
  return (
    <>
      <SplashSection />
      <ProductHeroSection />
    </>
  )
}
