"use client"

import { useRef, useEffect, Suspense } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { useGLTF, Environment, Center } from "@react-three/drei"
import * as THREE from "three"

const TEXT_COLOR = new THREE.Color("#35383f")

function GoodVibesModel() {
  const { scene } = useGLTF("/good-vibes.glb")
  const groupRef   = useRef<THREE.Group>(null)

  useEffect(() => {
    if (!scene) return
    // Auto-fit
    const box    = new THREE.Box3().setFromObject(scene)
    const size   = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    const s      = 2.2 / maxDim
    scene.scale.setScalar(s)
    scene.position.set(-center.x * s, -center.y * s, -center.z * s)

    // Override all materials → website text color
    scene.traverse((node) => {
      const mesh = node as THREE.Mesh
      if (!mesh.isMesh) return
      mesh.material = new THREE.MeshStandardMaterial({
        color:     TEXT_COLOR,
        roughness: 0.18,
        metalness: 0.06,
      })
    })
  }, [scene])

  // Slow continuous auto-rotation
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.35
    }
  })

  return (
    <group ref={groupRef}>
      <Center>
        <primitive object={scene} />
      </Center>
    </group>
  )
}

useGLTF.preload("/good-vibes.glb")

export function GoodVibesCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0.1, 4.2], fov: 38, near: 0.01, far: 100 }}
      gl={{
        alpha:               true,
        antialias:           true,
        toneMapping:         THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.9,
      }}
      style={{ width: "100%", height: "100%" }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    >
      <Suspense fallback={null}>
        <Environment preset="warehouse" />
        <directionalLight position={[4, 6, 4]} intensity={0.65} color="#f8f4ec" />
        <GoodVibesModel />
      </Suspense>
    </Canvas>
  )
}
