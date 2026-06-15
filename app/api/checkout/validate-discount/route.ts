import { NextRequest, NextResponse } from "next/server"

type DiscountEntry = { type: "percent" | "fixed"; value: number; label?: string }

function getCodes(): Record<string, DiscountEntry> {
  try {
    const raw = process.env.DISCOUNT_CODES
    if (raw) return JSON.parse(raw)
  } catch { /* fallthrough */ }
  return {}
}

export async function POST(req: NextRequest) {
  const { code, subtotal } = await req.json() as { code: string; subtotal: number }
  if (!code) return NextResponse.json({ valid: false, error: "Kein Code" }, { status: 400 })

  const codes = getCodes()
  const entry = codes[code.trim().toUpperCase()]

  if (!entry) {
    return NextResponse.json({ valid: false, error: "Ungültiger Rabattcode" })
  }

  const discount = entry.type === "percent"
    ? Math.round(subtotal * entry.value) / 100
    : Math.min(entry.value, subtotal)

  const finalTotal = Math.max(0, subtotal - discount)

  return NextResponse.json({
    valid:      true,
    type:       entry.type,
    value:      entry.value,
    discount:   +discount.toFixed(2),
    finalTotal: +finalTotal.toFixed(2),
    label:      entry.label ?? (entry.type === "percent" ? `${entry.value}% Rabatt` : `−${discount.toFixed(2)} €`),
  })
}
