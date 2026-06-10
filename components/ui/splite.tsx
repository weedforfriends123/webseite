"use client"

import { Suspense, lazy } from "react"

const Spline = lazy(() => import("@splinetool/react-spline"))

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          <div
            className="w-20 h-px"
            style={{ background: "rgba(53,56,63,0.08)" }}
          >
            <div
              className="h-full animate-pulse"
              style={{ width: "60%", background: "#a0ba87" }}
            />
          </div>
        </div>
      }
    >
      <Spline scene={scene} className={className} />
    </Suspense>
  )
}
