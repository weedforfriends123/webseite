"use client"

import * as React from "react"

// Shine sweep that trails across the button on hover/press
function ShineEffect({ isPressed }: { isPressed: boolean }) {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden"
    >
      {/* Sweep trail — charcoal-tinted highlight */}
      <span
        className="absolute inset-0 transition-transform duration-700 ease-in-out"
        style={{
          background:
            "linear-gradient(105deg, transparent 35%, rgba(53,56,63,0.18) 50%, rgba(53,56,63,0.08) 52%, transparent 65%)",
          transform: isPressed ? "translateX(120%) skewX(-12deg)" : "translateX(-120%) skewX(-12deg)",
          willChange: "transform",
        }}
      />
    </span>
  )
}

// ── Animated shine on hover ────────────────────────────────────────────────────
// Uses CSS animation so the sweep runs automatically on :hover without JS state.
// The charcoal sheen matches the brand text color (#35383f).

export interface MetalButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: "primary" | "ghost" | "outline"
}

export const MetalButton = React.forwardRef<HTMLButtonElement, MetalButtonProps>(
  ({ children, className = "", variant = "primary", style, ...props }, ref) => {

    const base: React.CSSProperties =
      variant === "primary"
        ? { background: "#35383f", color: "#35383f", border: "none" }
        : variant === "outline"
        ? { background: "transparent", color: "#35383f", border: "1px solid rgba(53,56,63,0.35)" }
        : { background: "rgba(53,56,63,0.06)", color: "#35383f", border: "1px solid rgba(53,56,63,0.10)" }

    return (
      <button
        ref={ref}
        className={[
          "relative overflow-hidden inline-flex items-center justify-center gap-2",
          "rounded-full px-8 py-3.5",
          "font-mono text-[11px] tracking-[0.15em] uppercase",
          "transition-all duration-200 ease-out",
          "hover:scale-[1.03] active:scale-[0.97]",
          "wff-metal-btn",
          className,
        ].join(" ")}
        style={{ ...base, ...style }}
        {...props}
      >
        {/* Sweep shine — triggers on hover via CSS */}
        <span
          aria-hidden
          className="wff-shine pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{
            background:
              "linear-gradient(105deg, transparent 35%, rgba(53,56,63,0.22) 50%, rgba(53,56,63,0.10) 52%, transparent 65%)",
            transform: "translateX(-130%) skewX(-12deg)",
            transition: "transform 0s",
          }}
        />
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </button>
    )
  },
)

MetalButton.displayName = "MetalButton"
