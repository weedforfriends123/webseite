"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment } from "@react-three/drei"
import * as THREE from "three"

function Gem() {
  const gemRef  = useRef<THREE.Mesh>(null!)
  const ringRef = useRef<THREE.Mesh>(null!)

  useFrame((_, delta) => {
    gemRef.current.rotation.x  += delta * 0.35
    gemRef.current.rotation.y  += delta * 0.55
    ringRef.current.rotation.z += delta * 0.25
  })

  return (
    <>
      {/* Core metallic icosahedron */}
      <mesh ref={gemRef}>
        <icosahedronGeometry args={[1.15, 1]} />
        <meshStandardMaterial
          color="#c8bfa8"
          metalness={0.92}
          roughness={0.08}
          envMapIntensity={1.8}
        />
      </mesh>

      {/* Thin orbit ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2.6, 0.4, 0]}>
        <torusGeometry args={[1.82, 0.009, 8, 80]} />
        <meshBasicMaterial color="#e8e4dc" opacity={0.35} transparent />
      </mesh>
    </>
  )
}

export function LoadingScene() {
  return (
    <Canvas
      style={{ width: "100%", height: "100%" }}
      gl={{ alpha: true, antialias: true }}
      camera={{ position: [0, 0, 3.6], fov: 42 }}
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[4, 6, 4]}   intensity={2.5} />
      <directionalLight position={[-4, -3, -4]} intensity={0.6} color="#6080c0" />
      <pointLight position={[0, 3, 2]} intensity={1.0} color="#ffffff" />
      <Environment preset="city" />
      <Gem />
    </Canvas>
  )
}
