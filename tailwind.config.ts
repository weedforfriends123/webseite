import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0e0f11",        // drinksom --som-black exact match
        cream: "#bcc0ca",     // WFF --cream (direct from site CSS)
        lime: "#a0ba87",      // WFF --leaf sage green (cannabis leaf color)
        gold: "#7b6fd4",      // WFF --secondary lightened (#190758 → lighter purple)
        ember: "#190758",     // WFF --accent deep indigo/navy-purple
        charcoal: "#35383f",  // WFF --primary dark charcoal
        muted: "#aab0ba",     // WFF --cream-deep muted grey-blue
      },
      fontFamily: {
        sans:       ["Adieu", "var(--font-syne)", "system-ui", "sans-serif"],
        adieu:      ["Adieu", "var(--font-syne)", "system-ui", "sans-serif"],
        ekstra:     ["Ekstra", "var(--font-space-grotesk)", "system-ui", "sans-serif"],
        mindflow:   ["Mindflow", "Georgia", "serif"],
        druk:       ["Druk", "Impact", "system-ui", "sans-serif"],
        "druk-wide": ["Druk Wide", "Impact", "system-ui", "sans-serif"],
        body:       ["ABC Diatype", "var(--font-space-grotesk)", "system-ui", "sans-serif"],
        mono:       ["ABC Diatype Mono", "var(--font-space-mono)", "monospace"],
      },
    },
  },
  plugins: [],
}

export default config
