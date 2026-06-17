"use client"

import { Suspense, useMemo, useEffect, useRef } from "react"
import { Canvas, useThree, useFrame } from "@react-three/fiber"
import {
  useGLTF, Environment, Float, ContactShadows, OrbitControls,
} from "@react-three/drei"
import * as THREE from "three"
import { cdn } from "@/lib/cdn"

useGLTF.preload(cdn("/meshy-product.glb"))

// ── Clone the loaded model so multiple instances don't share the same scene ──

function Model({ scale = 2.0 }: { scale?: number }) {
  const { scene } = useGLTF(cdn("/meshy-product.glb"))
  const clone = useMemo(() => {
    const c = scene.clone(true)
    c.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const m = obj as THREE.Mesh
        if (Array.isArray(m.material)) {
          m.material = m.material.map(mat => mat.clone())
        } else {
          m.material = (m.material as THREE.Material).clone()
        }
        m.castShadow    = true
        m.receiveShadow = true
      }
    })
    return c
  }, [scene])

  return <primitive object={clone} scale={scale} position={[0, -0.25, 0]} />
}

// ── Lights that smoothly transition when accent color changes ────────────────

function DynamicLights({ accent }: { accent: string }) {
  const rimA  = useRef<THREE.PointLight>(null)
  const rimB  = useRef<THREE.PointLight>(null)
  const target = useMemo(() => new THREE.Color(accent), [accent])

  useFrame(() => {
    if (rimA.current) rimA.current.color.lerp(target, 0.06)
    if (rimB.current) rimB.current.color.lerp(target, 0.06)
  })

  return (
    <>
      {/* Key light — front top */}
      <spotLight
        position={[2.5, 5, 3.5]}
        intensity={3.5}
        penumbra={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      {/* Fill — left soft */}
      <pointLight position={[-4, 1, 2]} intensity={1.0} color="#d0e0ff" />
      {/* Accent rim — bottom back (color-animated) */}
      <pointLight ref={rimA} position={[0, -2, -3]} intensity={8} color={accent} />
      {/* Accent fill — side (color-animated) */}
      <pointLight ref={rimB} position={[-3.5, 2.5, -1]} intensity={3.5} color={accent} />
    </>
  )
}

// ── Filmic tone mapping ───────────────────────────────────────────────────────

function ToneMap() {
  const { gl } = useThree()
  useEffect(() => {
    gl.toneMapping         = THREE.ACESFilmicToneMapping
    gl.toneMappingExposure = 1.2
  }, [gl])
  return null
}

// ── Public component ─────────────────────────────────────────────────────────

interface Vape3DProps {
  accent:  string
  scale?:  number
  rotate?: boolean
}

export function Vape3D({ accent, scale = 2.0, rotate = true }: Vape3DProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0.4, 4.8], fov: 32 }}
      gl={{ alpha: true, antialias: true }}
      style={{ width: "100%", height: "100%", touchAction: "none" }}
    >
      <ToneMap />

      <ambientLight intensity={0.45} />
      <DynamicLights accent={accent} />

      <Suspense fallback={null}>
        <Float speed={1.6} rotationIntensity={0.28} floatIntensity={0.55}>
          <Model scale={scale} />
        </Float>

        <ContactShadows
          position={[0, -1.85, 0]}
          opacity={0.22}
          scale={6}
          blur={3.5}
          color="#1a1a1a"
        />

        <Environment preset="studio" />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={rotate}
          autoRotateSpeed={2.8}
          maxPolarAngle={Math.PI / 1.65}
          minPolarAngle={Math.PI / 3.2}
          dampingFactor={0.07}
          enableDamping
        />
      </Suspense>
    </Canvas>
  )
}
