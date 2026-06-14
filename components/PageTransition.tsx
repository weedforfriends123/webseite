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
import { motion, AnimatePresence } from "framer-motion"

// ── Context ───────────────────────────────────────────────────────────────────

type Ctx = { navigate: (href: string) => void }
const TransitionCtx = createContext<Ctx>({ navigate: () => {} })
export const useTransitionNav = () => useContext(TransitionCtx)

// Wipe animation: overlay rises from bottom to cover screen, then drops away from top
const WIPE_EASE  = [0.76, 0, 0.24, 1] as const   // sharp cubic — feels deliberate
const COVER_DUR  = 0.38
const REVEAL_DUR = 0.44

export function PageTransition({ children }: { children: React.ReactNode }) {
  const [covering, setCovering] = useState(false)
  const [revealing, setRevealing] = useState(false)
  const nextHref    = useRef("")
  const router      = useRouter()
  const path        = usePathname()
  const isFirstPath = useRef(true)

  // Route change → play reveal (skip on initial mount — LoadingScreen handles that)
  useEffect(() => {
    if (isFirstPath.current) { isFirstPath.current = false; return }
    setRevealing(true)
  }, [path])

  const navigate = useCallback(
    (href: string) => {
      if (!href || href === path) return
      nextHref.current = href
      setCovering(true)
    },
    [path]
  )

  return (
    <TransitionCtx.Provider value={{ navigate }}>
      {children}

      {/* ── Cover: rises from bottom → then router.push ── */}
      <AnimatePresence>
        {covering && (
          <motion.div
            key="cover"
            initial={{ scaleY: 0, transformOrigin: "bottom center" }}
            animate={{ scaleY: 1, transformOrigin: "bottom center" }}
            transition={{ duration: COVER_DUR, ease: WIPE_EASE }}
            onAnimationComplete={() => {
              setCovering(false)
              router.push(nextHref.current)
            }}
            style={{
              position: "fixed", inset: 0,
              zIndex: 9998,
              background: "#111212",
              pointerEvents: "none",
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Reveal: drops away from top after navigation ── */}
      <AnimatePresence>
        {revealing && (
          <motion.div
            key="reveal"
            initial={{ scaleY: 1, transformOrigin: "top center" }}
            animate={{ scaleY: 0, transformOrigin: "top center" }}
            transition={{ duration: REVEAL_DUR, ease: WIPE_EASE, delay: 0.05 }}
            onAnimationComplete={() => setRevealing(false)}
            style={{
              position: "fixed", inset: 0,
              zIndex: 9998,
              background: "#111212",
              pointerEvents: "none",
            }}
          />
        )}
      </AnimatePresence>
    </TransitionCtx.Provider>
  )
}
