"use client"

import { Suspense, useRef, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { useGLTF, Float, Environment } from "@react-three/drei"
import * as THREE from "three"

function Mesh({ mouseRef }: { mouseRef: React.RefObject<{ x: number; y: number }> }) {
  const { scene } = useGLTF("/product.glb")
  const groupRef  = useRef<THREE.Group>(null!)

  useEffect(() => {
    // Auto-scale to fit a 2.5-unit bounding sphere
    const box    = new THREE.Box3().setFromObject(scene)
    const center = box.getCenter(new THREE.Vector3())
    const size   = box.getSize(new THREE.Vector3())
    const s      = 2.5 / Math.max(size.x, size.y, size.z)
    scene.scale.setScalar(s)
    scene.position.sub(center.multiplyScalar(s))
  }, [scene])

  useFrame((_, delta) => {
    if (!groupRef.current) return
    // Continuous slow spin
    groupRef.current.rotation.y += delta * 0.45
    // Subtle tilt from mouse/touch
    const tiltX = mouseRef.current ? mouseRef.current.y * -0.28 : 0
    groupRef.current.rotation.x += (tiltX - groupRef.current.rotation.x) * 0.04
  })

  return (
    <Float speed={1.8} rotationIntensity={0} floatIntensity={0.55}>
      <group ref={groupRef}>
        <primitive object={scene} />
      </group>
    </Float>
  )
}

export function Product3D() {
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth  - 0.5) * 2
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0]
      mouseRef.current.x = (t.clientX / window.innerWidth  - 0.5) * 2
      mouseRef.current.y = (t.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener("mousemove", onMouse, { passive: true })
    window.addEventListener("touchmove", onTouch,  { passive: true })
    return () => {
      window.removeEventListener("mousemove", onMouse)
      window.removeEventListener("touchmove", onTouch)
    }
  }, [])

  return (
    <Canvas
      style={{ width: "100%", height: "100%" }}
      gl={{ alpha: true, antialias: true }}
      camera={{ position: [0, 0, 5], fov: 45 }}
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 8, 5]}  intensity={2.2} />
      <directionalLight position={[-3, -3, -3]} intensity={0.5} color="#b0c8e0" />
      <pointLight position={[0, 4, 2]} intensity={0.8} />
      <Environment preset="city" />
      <Suspense fallback={null}>
        <Mesh mouseRef={mouseRef} />
      </Suspense>
    </Canvas>
  )
}

useGLTF.preload("/product.glb")
