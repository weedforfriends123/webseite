"use client"

import { Suspense, useRef, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { useGLTF, Float, Environment } from "@react-three/drei"
import * as THREE from "three"

function NLModel({
  mouseRef,
}: {
  mouseRef: { current: { x: number; y: number } }
}) {
  const { scene } = useGLTF("/northern-lights.glb")
  const groupRef = useRef<THREE.Group>(null)
  const rotYRef = useRef(0)
  const tiltXRef = useRef(0)

  // Normalize + center model on load
  useRef(() => {
    if (!scene) return
    scene.scale.set(1, 1, 1)
    scene.position.set(0, 0, 0)
    const box = new THREE.Box3().setFromObject(scene)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const s = 1.8 / size.y
    scene.scale.setScalar(s)
    scene.position.set(-center.x * s, -center.y * s, -center.z * s)
  })

  useEffect(() => {
    if (!scene) return
    const box = new THREE.Box3().setFromObject(scene)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const s = 1.8 / size.y
    scene.scale.setScalar(s)
    scene.position.set(-center.x * s, -center.y * s, -center.z * s)
  }, [scene])

  useFrame(() => {
    if (!groupRef.current) return
    const mx = mouseRef.current.x
    const my = mouseRef.current.y
    rotYRef.current += (mx * 0.4 - rotYRef.current) * 0.05
    tiltXRef.current += (-my * 0.12 - tiltXRef.current) * 0.05
    groupRef.current.rotation.y = rotYRef.current
    groupRef.current.rotation.x = tiltXRef.current
  })

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  )
}

export function NorthernLights3D() {
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2),
        y: (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2),
      }
    }
    window.addEventListener("mousemove", onMove, { passive: true })
    return () => window.removeEventListener("mousemove", onMove)
  }, [])

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        filter:
          "drop-shadow(0 28px 60px rgba(0,0,0,0.70)) drop-shadow(0 0 32px rgba(120,60,220,0.45))",
      }}
    >
      <Canvas
        camera={{ position: [0, 0.05, 3.6], fov: 36, near: 0.01, far: 100 }}
        gl={{
          alpha: true,
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.85,
        }}
        style={{ width: "100%", height: "100%" }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.7} color="#35383f" />
          <directionalLight position={[3, 5, 3]} intensity={1.0} color="#ffffff" />
          <pointLight position={[-3, -2, 3]} color="#2f4537" intensity={2.0} distance={12} />
          <pointLight position={[3, 3, 2]} color="#35383f" intensity={1.4} distance={10} />
          <Environment preset="warehouse" />
          <Float speed={1.4} rotationIntensity={0.12} floatIntensity={0.6}>
            <NLModel mouseRef={mouseRef} />
          </Float>
        </Suspense>
      </Canvas>
    </div>
  )
}

useGLTF.preload("/northern-lights.glb")
