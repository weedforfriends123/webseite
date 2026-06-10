"use client"

import { Suspense, useRef, useEffect, useMemo, useState, useCallback } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { useGLTF, Environment } from "@react-three/drei"
import { motion, useScroll, useTransform, useMotionValue, useSpring, useReducedMotion } from "framer-motion"
import * as THREE from "three"

const FLAVOR_MODELS = [
  "/amnesia-haze.glb",
  "/purple-haze.glb",
  "/northern-lights.glb",
  "/ice-cream-cookies.glb",
  "/girl-scout-cookies.glb",
  "/gelato.glb",
]

// ── 3D model ─────────────────────────────────────────────────────────────────

type ModelProps = {
  modelPath: string
  rotYRef:   { current: number }
  tiltXRef:  { current: number }
  tiltZRef:  { current: number }
  mouseRef:  { current: { x: number; y: number } }
  onLoaded:  () => void
}

function ProductModel({ modelPath, rotYRef, tiltXRef, tiltZRef, mouseRef, onLoaded }: ModelProps) {
  const { scene }  = useGLTF(modelPath)
  const groupRef   = useRef<THREE.Group>(null)
  const entryY     = useRef(1.2)   // starts above camera center, springs to 0

  useEffect(() => { onLoaded() }, [onLoaded])

  // Scale applied synchronously during render so Three.js never draws a wrong-sized frame.
  // useGLTF returns the same cached object on revisit, so we reset to identity first.
  useMemo(() => {
    if (!scene) return
    scene.scale.set(1, 1, 1)
    scene.position.set(0, 0, 0)
    const box    = new THREE.Box3().setFromObject(scene)
    const size   = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const s      = 1.8 / size.y          // lock to height — every vape the same visual height
    scene.scale.setScalar(s)
    scene.position.set(-center.x * s, -center.y * s, -center.z * s)
  }, [scene])

  // Entry animation + rotation snap after flavor swap
  useEffect(() => {
    if (!scene) return
    entryY.current   = 1.2
    rotYRef.current  *= 0.15
    tiltXRef.current *= 0.15
    tiltZRef.current *= 0.15
  }, [scene, rotYRef, tiltXRef, tiltZRef])

  useFrame(() => {
    if (!groupRef.current) return

    // Slow drift down into resting position (on mount + flavor change)
    entryY.current += (0 - entryY.current) * 0.032
    groupRef.current.position.y = entryY.current

    const mx = mouseRef.current.x
    const my = mouseRef.current.y

    rotYRef.current  += (mx * 0.38   - rotYRef.current)  * 0.04
    tiltXRef.current += (-my * 0.14  - tiltXRef.current) * 0.055
    tiltZRef.current += (mx * 0.04   - tiltZRef.current) * 0.055

    groupRef.current.rotation.y = rotYRef.current
    groupRef.current.rotation.x = tiltXRef.current
    groupRef.current.rotation.z = tiltZRef.current
  })

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function FloatingProduct({ alwaysVisible = false }: { alwaysVisible?: boolean }) {
  const rotYRef  = useRef(0)
  const tiltXRef = useRef(0)
  const tiltZRef = useRef(0)
  const mouseRef = useRef({ x: 0, y: 0 })

  const [loaded,      setLoaded]      = useState(false)
  const [flavorIndex, setFlavorIndex] = useState(0)
  const [isSmall,     setIsSmall]     = useState(false)

  const reduced     = useReducedMotion()
  const { scrollY } = useScroll()

  useEffect(() => {
    const check = () => setIsSmall(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check, { passive: true })
    return () => window.removeEventListener("resize", check)
  }, [])

  useEffect(() => {
    const handler = (e: Event) => setFlavorIndex((e as CustomEvent).detail.index)
    window.addEventListener("wff-flavor", handler)
    return () => window.removeEventListener("wff-flavor", handler)
  }, [])

  // 3D tilt: mouse / touch
  useEffect(() => {
    if (reduced) return
    const onMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX - window.innerWidth  / 2) / (window.innerWidth  / 2),
        y: (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2),
      }
    }
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0]
      if (!t) return
      mouseRef.current = {
        x: (t.clientX - window.innerWidth  / 2) / (window.innerWidth  / 2),
        y: (t.clientY - window.innerHeight / 2) / (window.innerHeight / 2),
      }
    }
    window.addEventListener("mousemove", onMove,     { passive: true })
    window.addEventListener("touchmove", onTouch,    { passive: true })
    window.addEventListener("touchend",  () => { mouseRef.current = { x: 0, y: 0 } }, { passive: true })
    return () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("touchmove", onTouch)
    }
  }, [reduced])

  // CSS parallax layer (mouse)
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const px   = useSpring(rawX, { stiffness: 90, damping: 26 })
  const py   = useSpring(rawY, { stiffness: 90, damping: 26 })

  useEffect(() => {
    if (reduced) return
    const onMove = (e: MouseEvent) => {
      rawX.set((e.clientX - window.innerWidth  / 2) * 0.016)
      rawY.set((e.clientY - window.innerHeight / 2) * 0.009)
    }
    window.addEventListener("mousemove", onMove, { passive: true })
    return () => window.removeEventListener("mousemove", onMove)
  }, [reduced, rawX, rawY])

  // On the home page: vape fades in as hero section exits (0.65→1.0×vh), fades out at end of WFFHero.
  // On pages with alwaysVisible=true (e.g. /vapes): skip the hero fade-in, show from scrollY=0.
  const vapeOpacity = useTransform(scrollY, (v) => {
    if (typeof window === "undefined") return 0
    const vh      = window.innerHeight
    const snapIn  = alwaysVisible ? 1 : Math.max(0, Math.min(1, (v - vh * 0.65) / (vh * 0.35)))
    const fadeOut = Math.max(0, Math.min(1, (v - vh * 5.4) / (vh * 0.5)))
    return snapIn * (1 - fadeOut)
  })

  const handleLoaded = useCallback(() => setLoaded(true), [])

  const floatTransition = {
    duration: 11,
    repeat: Infinity,
    ease: "easeInOut" as const,
    times: [0, 0.25, 0.5, 0.75, 1],
  }

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-[10] flex items-center justify-center"
      style={{ opacity: vapeOpacity }}
      aria-hidden
    >
      {/* CSS parallax layer */}
      <motion.div style={{ x: px, y: py }}>
        {/* Floating loop */}
        <motion.div
          animate={!reduced ? { y: [0, -7, 0, 7, 0] } : {}}
          transition={floatTransition}
        >
          <motion.div
            style={{
              height:    isSmall ? "clamp(220px, 56vh, 600px)" : "clamp(260px, 64vh, 1100px)",
              aspectRatio: "0.68 / 1",
              maxWidth:  isSmall ? "min(74vw, 400px)" : "min(68vw, 640px)",
              opacity:   loaded ? 1 : 0,
              filter:
                "drop-shadow(0 55px 95px rgba(14,12,9,0.30)) " +
                "drop-shadow(0 14px 30px rgba(14,12,9,0.14)) " +
                "drop-shadow(0 4px 8px rgba(14,12,9,0.08))",
            }}
          >
            <Canvas
              camera={{ position: [0, 0.05, 3.6], fov: 36, near: 0.01, far: 100 }}
              gl={{
                alpha: true,
                antialias: true,
                toneMapping: THREE.ACESFilmicToneMapping,
                toneMappingExposure: 0.75,
              }}
              style={{ width: "100%", height: "100%" }}
              onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
            >
              <Suspense fallback={null}>
                <Environment preset="warehouse" />
                <directionalLight position={[3, 5, 3]} intensity={0.55} color="#fff8f0" />
                {/* No key prop — model swaps in-place, no unmount/remount flicker */}
                <ProductModel
                  modelPath={FLAVOR_MODELS[flavorIndex]}
                  rotYRef={rotYRef}
                  tiltXRef={tiltXRef}
                  tiltZRef={tiltZRef}
                  mouseRef={mouseRef}
                  onLoaded={handleLoaded}
                />
              </Suspense>
            </Canvas>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

// Preload all flavour models
useGLTF.preload("/amnesia-haze.glb")
useGLTF.preload("/purple-haze.glb")
useGLTF.preload("/northern-lights.glb")
useGLTF.preload("/ice-cream-cookies.glb")
useGLTF.preload("/girl-scout-cookies.glb")
useGLTF.preload("/gelato.glb")
