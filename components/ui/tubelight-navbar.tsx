"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  className?: string
}

export function NavBar({ items, className }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0].name)
  const [hovered, setHovered]     = useState<string | null>(null)

  return (
    <div
      className={cn(
        // Mobile: bottom center — Tablet/Desktop: top center
        "fixed bottom-5 sm:bottom-auto sm:top-6 left-1/2 -translate-x-1/2 z-[75]",
        // Prevent overflow on narrow screens
        "max-w-[calc(100vw-24px)]",
        className,
      )}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0,  opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 24, delay: 0.15 }}
        className="flex items-center"
        style={{
          background:           "rgba(53,56,63,0.92)",
          backdropFilter:       "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRadius:         9999,
          border:               "1px solid rgba(53,56,63,0.10)",
          boxShadow:            "0 8px 40px rgba(14,12,9,0.12), 0 2px 8px rgba(14,12,9,0.06)",
          padding:              "5px",
          gap:                  1,
        }}
      >
        {items.map((item) => {
          const Icon     = item.icon
          const isActive = activeTab === item.name
          const isHov    = hovered === item.name

          return (
            <Link
              key={item.name}
              href={item.url}
              onClick={() => setActiveTab(item.name)}
              onMouseEnter={() => setHovered(item.name)}
              onMouseLeave={() => setHovered(null)}
              className={cn(
                "relative flex items-center justify-center select-none cursor-pointer",
                "transition-colors duration-200 rounded-full",
                // Mobile: just icon, square-ish
                "p-[10px]",
                // Tablet (sm): icon + short label
                "sm:px-4 sm:py-3 sm:gap-1.5",
                // Desktop (lg): more breathing room
                "lg:px-5 lg:py-[13px] lg:gap-2",
              )}
            >
              {/* Sliding active/hover background */}
              {(isActive || isHov) && (
                <motion.div
                  layoutId={isActive ? "wff-active-bg" : undefined}
                  key={isActive ? "active" : `hover-${item.name}`}
                  className="absolute inset-0 rounded-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  style={{ background: isActive ? "#35383f" : "rgba(53,56,63,0.07)" }}
                />
              )}

              {/* Icon — always visible */}
              <Icon
                className="relative z-10 shrink-0 transition-colors duration-200"
                size={16}
                style={{ color: isActive ? "#35383f" : isHov ? "#35383f" : "rgba(53,56,63,0.45)" }}
              />

              {/* Label — hidden on mobile, shown sm+ */}
              <span
                className={cn(
                  "relative z-10 font-adieu uppercase leading-none transition-colors duration-200",
                  "hidden sm:block",
                  "text-[0.72rem] lg:text-[0.88rem]",
                )}
                style={{
                  letterSpacing: "-0.01em",
                  whiteSpace:    "nowrap",
                  color: isActive ? "#35383f" : isHov ? "#35383f" : "rgba(53,56,63,0.40)",
                }}
              >
                {item.name}
              </span>

              {/* Mobile tooltip on long-press / tap — aria label only, visually handled by icon */}
            </Link>
          )
        })}
      </motion.div>
    </div>
  )
}
