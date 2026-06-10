"use client"

import { motion } from "framer-motion"

const PAGE_BG = "#35383f"
const TEXT_COL = "#35383f"

const ITEMS = [
  { icon: "✓", text: "Laborgeprüft",     sub: "COA-zertifiziert"    },
  { icon: "✓", text: "Diskreter Versand", sub: "Neutrale Verpackung" },
  { icon: "✓", text: "In 2 Tagen da",    sub: "Express verfügbar"   },
  { icon: null, text: "VISA · MC · KLARNA · PAYPAL", sub: null },
  { icon: "18+", text: "Altersverifiziert", sub: null },
]

export function TrustBar() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      style={{
        background:    PAGE_BG,
        borderTop:    "1px solid rgba(53,56,63,0.07)",
        borderBottom: "1px solid rgba(53,56,63,0.07)",
        paddingBlock:  12,
      }}
    >
      <div className="flex items-center justify-center flex-wrap gap-x-0 gap-y-2 px-4">
        {ITEMS.map((item, i) => (
          <div key={i} className="flex items-center">
            {i > 0 && (
              <div style={{ width: 1, height: 14, background: "rgba(53,56,63,0.10)", margin: "0 20px", flexShrink: 0 }} />
            )}
            <div className="flex items-center gap-2">
              {item.icon && (
                <span className="font-mono" style={{ fontSize: "9px", color: "#a0ba87", fontWeight: 700 }}>
                  {item.icon}
                </span>
              )}
              <span className="font-mono uppercase" style={{ fontSize: "8px", letterSpacing: "0.22em", color: "rgba(53,56,63,0.52)" }}>
                {item.text}
              </span>
              {item.sub && (
                <span className="font-mono hidden md:inline" style={{ fontSize: "7px", letterSpacing: "0.15em", color: "rgba(53,56,63,0.24)" }}>
                  · {item.sub}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  )
}
