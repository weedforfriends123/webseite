"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

// Pre-crafted prompts using the actual WFF product as reference
const QUICK_PROMPTS = [
  "3D product render of a premium vape sachet, powder blue metallic foil packaging, cream and light blue abstract blob pattern, yellow banana-curve accents, dark navy W badge logo, text NORTHERN LIGHTS VAPE HC 96%, floating on pure black background, dramatic studio lighting, 15 degree angle, photorealistic, 4K",
  "Premium CBD vape sachet packaging flat-lay on dark marble surface, soft powder blue and cream colors, golden light reflections, luxury brand aesthetic, professional product photography, 4K",
  "Macro photo of premium cannabis hemp flower buds, powder blue and cream color palette, dark luxury studio background, shallow depth of field, cinematic lighting, 4K ultra sharp",
  "Abstract 3D render of cannabis terpene molecules, powder blue crystalline structures floating in dark space, golden light rays, scientific visualization meets luxury brand, 4K",
]

interface Img {
  id: number
  data: string
  mime: string
  prompt: string
}

function Spinner({ size = 16 }: { size?: number }) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      style={{ width: size, height: size }}
      className="rounded-full border-2 border-bg/20 border-t-bg"
    />
  )
}

export function ImageGenerator() {
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<Img[]>([])
  const [error, setError] = useState<string | null>(null)
  const [idx, setIdx] = useState(0)

  async function generate() {
    if (!prompt.trim() || loading) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? "Fehler"); return }
      setImages((p) => [{ id: idx, data: data.imageData, mime: data.mimeType, prompt }, ...p])
      setIdx((n) => n + 1)
    } catch {
      setError("Netzwerkfehler — bitte erneut versuchen.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="ai-studio" className="py-32 px-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-lime/[0.04] rounded-full blur-[130px]" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-lime/70">
              AI Image Studio
            </span>
            <span className="px-2.5 py-1 rounded border border-lime/25 bg-lime/[0.06] text-lime font-mono text-[9px] tracking-widest uppercase">
              Nano Banana Pro
            </span>
          </div>
          <h2 className="font-sans font-extrabold text-5xl md:text-6xl text-cream leading-tight tracking-tight">
            Generate Visuals.
            <br />
            <span className="text-gradient">In Seconds.</span>
          </h2>
          <p className="font-body text-cream/30 text-sm mt-4 max-w-lg leading-relaxed">
            Powered by Gemini 3 Pro Image (Nano Banana Pro). Erstelle professionelle Produktbilder für Weed For Friends — direkt aus deinem Browser.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Input */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) generate()
              }}
              placeholder="Beschreibe dein Bild... oder wähle einen Quick-Prompt"
              rows={5}
              className="w-full px-5 py-4 rounded-xl bg-cream/[0.03] border border-cream/[0.08] text-cream/80 text-sm placeholder:text-cream/20 focus:outline-none focus:border-lime/30 resize-none transition-colors font-body leading-relaxed"
            />

            <button
              onClick={generate}
              disabled={loading || !prompt.trim()}
              className="w-full py-4 rounded-xl bg-lime text-bg font-sans font-extrabold text-sm hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-30 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Spinner />
                  Nano Banana Pro generiert...
                </>
              ) : (
                "Bild generieren →"
              )}
            </button>

            {error && (
              <p className="font-mono text-[10px] text-red-400/70 tracking-wide">{error}</p>
            )}

            {/* Quick prompts */}
            <div>
              <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-cream/20 mb-3">
                Quick-Prompts
              </p>
              <div className="space-y-2">
                {QUICK_PROMPTS.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => setPrompt(p)}
                    className="w-full text-left px-4 py-3 rounded-lg bg-cream/[0.02] border border-cream/[0.06] text-cream/30 text-xs hover:text-cream/60 hover:border-lime/20 transition-all font-body leading-relaxed"
                  >
                    {p.length > 90 ? p.slice(0, 90) + "…" : p}
                  </button>
                ))}
              </div>
            </div>

            <p className="font-mono text-[9px] text-cream/15 tracking-wide">
              ⌘ + Enter zum Generieren · $0.134 pro Bild · SynthID Wasserzeichen
            </p>
          </motion.div>

          {/* Output */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            {images.length === 0 && !loading ? (
              <div className="min-h-[460px] rounded-xl border border-dashed border-cream/[0.07] flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full border border-cream/[0.08] flex items-center justify-center">
                  <span className="text-cream/15 text-xl">◈</span>
                </div>
                <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-cream/15">
                  Noch keine Bilder
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="rounded-xl bg-lime/[0.04] border border-lime/15 aspect-square flex flex-col items-center justify-center gap-3"
                  >
                    <Spinner size={24} />
                    <span className="font-mono text-[9px] tracking-widest uppercase text-lime/50">
                      Generating…
                    </span>
                  </motion.div>
                )}
                <AnimatePresence>
                  {images.map((img) => (
                    <motion.div
                      key={img.id}
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.92 }}
                      transition={{ duration: 0.4 }}
                      className="relative rounded-xl overflow-hidden group aspect-square cursor-pointer"
                    >
                      <img
                        src={`data:${img.mime};base64,${img.data}`}
                        alt={img.prompt}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-bg/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                        <p className="text-cream/60 text-[10px] font-body line-clamp-4 leading-relaxed">
                          {img.prompt}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
