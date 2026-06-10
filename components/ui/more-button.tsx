"use client"

const DARK  = "#35383f"
const CREAM = "#35383f"

interface MoreButtonProps {
  label: string
  href?: string
  onClick?: () => void
}

export function MoreButton({ label, href = "#", onClick }: MoreButtonProps) {
  const inner = (
    <span style={{ display: "inline-flex", alignItems: "center" }}>
      <span style={{
        width: 46,
        height: 46,
        borderRadius: "50%",
        background: DARK,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        zIndex: 2,
        position: "relative",
      }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path
            d="M4.5 13.5 L13.5 4.5 M6 4.5 H13.5 V12"
            stroke={CREAM}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span style={{
        background: DARK,
        borderRadius: "0 999px 999px 0",
        padding: "12px 24px 12px 16px",
        marginLeft: -8,
        display: "inline-block",
      }}>
        <span
          className="font-adieu"
          style={{ color: CREAM, fontSize: "1rem", letterSpacing: "0.02em", lineHeight: 1 }}
        >
          {label}
        </span>
      </span>
    </span>
  )

  if (onClick) {
    return (
      <button
        onClick={onClick}
        style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
      >
        {inner}
      </button>
    )
  }

  return (
    <a href={href} style={{ textDecoration: "none", display: "inline-block" }}>
      {inner}
    </a>
  )
}
