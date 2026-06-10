"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react"
import { useRouter, usePathname } from "next/navigation"
import { motion, useAnimation } from "framer-motion"

// ── Context ───────────────────────────────────────────────────────────────────

type Ctx = { navigate: (href: string) => void }
const TransitionCtx = createContext<Ctx>({ navigate: () => {} })
export const useTransitionNav = () => useContext(TransitionCtx)

// ── Provider + Overlay ────────────────────────────────────────────────────────

type Phase = "idle" | "tv-off" | "iris"

export function PageTransition({ children }: { children: React.ReactNode }) {
  // Start idle — the useEffect below triggers iris after hydration.
  // Starting as "iris" in SSR would render a black overlay before JS loads,
  // causing a black screen for as long as the JS bundle takes to hydrate.
  const [phase, setPhase] = useState<Phase>("idle")
  const nextHref          = useRef("")
  const router            = useRouter()
  const path              = usePathname()
  const tvCtrl            = useAnimation()

  // Every route change → iris open
  useEffect(() => {
    setPhase("iris")
  }, [path])

  // Navigate with TV-off exit first
  const navigate = useCallback(
    (href: string) => {
      if (!href || href === path) return
      nextHref.current = href
      setPhase("tv-off")

      // Sequential TV off: squish Y → squish X → navigate
      tvCtrl
        .start({
          scaleY:     0.002,
          transition: { duration: 0.28, ease: [0.55, 0, 0.9, 0.5] },
        })
        .then(() =>
          tvCtrl.start({
            scaleX:     0,
            transition: { duration: 0.16, ease: "easeIn" },
          })
        )
        .then(() => {
          router.push(nextHref.current)
        })
    },
    [path, router, tvCtrl]
  )

  return (
    <TransitionCtx.Provider value={{ navigate }}>
      {children}

      {/* ── TV off overlay ── */}
      {phase === "tv-off" && (
        <motion.div
          animate={tvCtrl}
          style={{
            position:        "fixed",
            inset:           0,
            zIndex:          9999,
            background:      "#0a0a0a",
            transformOrigin: "50% 50%",
            pointerEvents:   "none",
          }}
        />
      )}

      {/* ── Iris open overlay (SVG mask: growing hole reveals page from center) ── */}
      {phase === "iris" && (
        <svg
          style={{
            position:      "fixed",
            inset:         0,
            width:         "100%",
            height:        "100%",
            zIndex:        9999,
            pointerEvents: "none",
          }}
          aria-hidden
        >
          <defs>
            {/*
              Mask: white = show black rect, black = punch transparent hole.
              Animated circle grows the hole from center outward,
              revealing the page like a camera iris opening.
            */}
            <mask id="wff-iris-mask">
              <rect width="100%" height="100%" fill="white" />
              <motion.circle
                cx="50%"
                cy="50%"
                initial={{ r: 0 } as never}
                animate={{ r: 3000 } as never}
                transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
                fill="black"
                onAnimationComplete={() => setPhase("idle")}
              />
            </mask>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="#0a0a0a"
            mask="url(#wff-iris-mask)"
          />
        </svg>
      )}
    </TransitionCtx.Provider>
  )
}
