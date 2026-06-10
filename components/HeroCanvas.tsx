"use client"

import { useRef } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { MeshDistortMaterial, Stars, Float, Environment } from "@react-three/drei"
import * as THREE from "three"

function CameraRig() {
  const { camera, mouse } = useThree()
  useFrame(() => {
    camera.position.x += (mouse.x * 1.2 - camera.position.x) * 0.025
    camera.position.y += (mouse.y * 0.6 - camera.position.y) * 0.025
    camera.lookAt(0, 0, 0)
  })
  return null
}

function MainOrb() {
  const glowRef = useRef<THREE.PointLight>(null)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (glowRef.current) {
      glowRef.current.intensity = 1.8 + Math.sin(t * 1.5) * 0.5
    }
  })

  return (
    <Float speed={1.1} rotationIntensity={0.5} floatIntensity={0.9}>
      <mesh>
        <icosahedronGeometry args={[1.9, 10]} />
        <MeshDistortMaterial
          color="#0d0a2a"
          emissive="#190758"
          emissiveIntensity={0.7}
          metalness={1}
          roughness={0.06}
          distort={0.22}
          speed={1.6}
          envMapIntensity={2}
        />
      </mesh>
      <pointLight
        ref={glowRef}
        position={[0, 0, 2.5]}
        color="#a0ba87"
        intensity={2.2}
        distance={10}
      />
    </Float>
  )
}

function OrbitRing() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.18
      groupRef.current.rotation.z = clock.getElapsedTime() * 0.06
    }
  })

  const dots = [
    [3.2, 0.3, 0.2],
    [-3.0, -0.8, 0.6],
    [0.4, 3.0, -0.8],
    [-0.6, -2.8, 1.2],
    [2.2, -1.8, -0.4],
  ]

  return (
    <group ref={groupRef}>
      {dots.map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color="#a0ba87" transparent opacity={0.55} />
        </mesh>
      ))}
    </group>
  )
}

export default function HeroCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 52 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.1} color="#05040f" />
      <directionalLight position={[6, 6, 6]} intensity={0.3} color="#bcc0ca" />
      <pointLight position={[-6, -4, -6]} color="#190758" intensity={4} />
      <pointLight position={[6, -2, 4]} color="#a0ba87" intensity={1.8} />
      <Stars
        radius={120}
        depth={60}
        count={3500}
        factor={2.5}
        saturation={0}
        fade
        speed={0.3}
      />
      <MainOrb />
      <OrbitRing />
      <CameraRig />
      <Environment preset="night" />
    </Canvas>
  )
}
