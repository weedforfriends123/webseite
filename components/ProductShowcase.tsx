"use client"

import { motion } from "framer-motion"

const CATEGORIES = [
  {
    num: "01",
    name: "GOODBUDS",
    type: "Vapes",
    spec: "1ML · PHC 96% · Legal in Germany",
    uvp: "UVP 29,99€",
    desc: "Intensiver Geschmack, stylisches Design und ein sanftes Dampferlebnis. Jetzt brandneu erhältlich.",
    strains: [
      { name: "Purple Haze", note: "Fruchtig-würzig · Indica" },
      { name: "Ice Cream Cookies", note: "Cremig-süß · Hybrid" },
      { name: "Girl Scout Cookies", note: "Süß-erdig · Hybrid" },
      { name: "Northern Lights", note: "Frisch, leicht herb · Indica" },
      { name: "Amnesia Haze", note: "Zitronig-würzig · Sativa" },
      { name: "Gelato", note: "Süß, cremig · Sativa" },
    ],
    pricing: [
      ["10 St.", "14,00€"],
      ["50 St.", "13,00€"],
      ["100 St.", "12,00€"],
      ["300 St.", "11,00€"],
      ["500 St.", "10,00€"],
      ["1.000 St.", "9,00€"],
    ],
    accent: "#e8a87c",
    tag: "Flagship",
  },
  {
    num: "02",
    name: "POD'S",
    type: "Elfbar Pods",
    spec: "2ML · PHC 96% · Elfbar kompatibel",
    uvp: "UVP 24,99€",
    desc: "Entdecke die neueste Generation an Pods – kompatibel mit Elfbar, intensiv im Geschmack.",
    strains: [
      { name: "Cotton Candy", note: "Zuckerwatte · Süß" },
      { name: "London Pound", note: "Vanille, Gebäck, Beere" },
      { name: "Zkittelez", note: "Fruchtmix · Candy" },
      { name: "Runtz", note: "Süß-fruchtig · Tropical" },
      { name: "Cherry", note: "Saftige Kirsche · Frisch" },
    ],
    pricing: [
      ["10 St.", "13,00€"],
      ["50 St.", "12,00€"],
      ["100 St.", "11,00€"],
      ["300 St.", "10,00€"],
      ["500 St.", "9,00€"],
      ["1.000 St.", "8,00€"],
    ],
    accent: "#d29678",
    tag: "Kompatibel",
  },
  {
    num: "03",
    name: "PRE ROLL'S",
    type: "Pre-Rolls",
    spec: "King Size · PHC 40% · Smooth & Even Burn",
    uvp: "UVP 9,99€",
    desc: "Gleichmäßiger Smoke, hochwertiger Inhalt und purer Geschmack. Perfekt gerollt, sofort einsatzbereit.",
    strains: [
      { name: "Lemon Haze", note: "Frisch, zitronig · Sativa" },
      { name: "White Widow", note: "Erdig-würzig · Klassiker" },
      { name: "Cookies", note: "Süß-würzig · Vollmundig" },
    ],
    pricing: [
      ["10 St.", "6,00€"],
      ["50 St.", "5,00€"],
      ["100 St.", "4,50€"],
      ["300 St.", "4,00€"],
      ["500 St.", "3,50€"],
      ["1.000 St.", "3,00€"],
    ],
    accent: "#a58796",
    tag: "Hand-gerollt",
  },
  {
    num: "04",
    name: "BLÜTEN",
    type: "Premium Blüten",
    spec: "PHC 40% · Under 0,3% THC · Terps",
    uvp: "Ab 2,99€ / G",
    desc: "Sorgfältig ausgewählte Blüten für gleichbleibend hohe Qualität und intensiven, natürlichen Geschmack.",
    strains: [
      { name: "Blue Berry", note: "Reife Blaubeeren · Süß-erdig" },
      { name: "Amnesia Haze", note: "Zitrone, Gewürze · Lebendig" },
      { name: "Purple Haze", note: "Dunkle Beeren · Würzig" },
      { name: "Northern Lights", note: "Warm, erdig · Dezent süß" },
      { name: "Gelato", note: "Vanille, Beeren · Vollmundig" },
      { name: "Cookies", note: "Gebäck, Vanille · Aromatisch" },
    ],
    pricing: [
      ["1 G", "2,99€"],
      ["3 G", "7,99€"],
      ["5 G", "12,99€"],
    ],
    accent: "#5a1e3c",
    tag: "Naturprodukt",
  },
  {
    num: "05",
    name: "HASCH",
    type: "Haschisch",
    spec: "PHC 40% · Under 0,3% THC · Terps",
    uvp: "Ab 2,99€ / G",
    desc: "Traditionell verarbeitet für ein dichtes, langanhaltendes Geschmackserlebnis mit besonderer Intensität.",
    strains: [
      { name: "Afghan Hasch", note: "Harzig, warm · Vollmundig" },
      { name: "Ketama Hasch", note: "Erdig, dezent süß · Weich" },
      { name: "Dry Sift Hasch", note: "Klares Terpenprofil · Natürlich" },
    ],
    pricing: [
      ["1 G", "2,99€"],
      ["3 G", "7,99€"],
      ["5 G", "12,99€"],
    ],
    accent: "#875a3c",
    tag: "Traditionell",
  },
]

export function ProductShowcase() {
  return (
    <section id="products" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-lime/70 block mb-3">
            The Herb
          </span>
          <h2 className="font-sans font-extrabold text-5xl md:text-6xl text-cream leading-tight tracking-tight">
            Fünf Formen.
            <br />
            <span className="text-gradient">Eine Reinheit.</span>
          </h2>
        </motion.div>

        {/* Product rows */}
        <div className="space-y-0 divide-y divide-cream/[0.05]">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.num}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, margin: "-80px" }}
              className="group py-12"
            >
              <div className="grid grid-cols-12 gap-6 items-start">

                {/* Number + Category */}
                <div className="col-span-12 md:col-span-3">
                  <div className="flex items-start gap-4 mb-3">
                    <span className="font-mono text-[10px] text-cream/20 tracking-widest mt-1">
                      {cat.num}
                    </span>
                    <div>
                      <span
                        className="font-mono text-[9px] tracking-[0.25em] uppercase mb-1 block"
                        style={{ color: cat.accent }}
                      >
                        {cat.type}
                      </span>
                      <h3 className="font-sans font-extrabold text-3xl md:text-4xl text-cream tracking-tight leading-none">
                        {cat.name}
                      </h3>
                    </div>
                  </div>
                  <p className="font-mono text-[9px] text-cream/25 tracking-wide mt-3 leading-relaxed ml-8">
                    {cat.spec}
                  </p>
                </div>

                {/* Description + Strains */}
                <div className="col-span-12 md:col-span-5">
                  <p className="font-body text-sm text-cream/40 mb-6 leading-relaxed">
                    {cat.desc}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {cat.strains.map((s) => (
                      <div
                        key={s.name}
                        className="group/strain px-3 py-2 rounded-lg border border-cream/[0.07] bg-cream/[0.02] hover:border-cream/[0.15] transition-all cursor-default"
                      >
                        <p className="font-sans font-semibold text-xs text-cream/80 leading-tight">
                          {s.name}
                        </p>
                        <p className="font-mono text-[9px] text-cream/25 mt-0.5">
                          {s.note}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing */}
                <div className="col-span-12 md:col-span-3 md:col-start-10">
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="font-mono text-[9px] tracking-[0.2em] uppercase"
                      style={{ color: cat.accent }}
                    >
                      B2B Preise
                    </span>
                    <span className="font-mono text-[9px] text-cream/30">{cat.uvp}</span>
                  </div>
                  <div className="space-y-1.5">
                    {cat.pricing.map(([qty, price]) => (
                      <div
                        key={qty}
                        className="flex items-center justify-between py-1.5 border-b border-cream/[0.04]"
                      >
                        <span className="font-mono text-[10px] text-cream/30">{qty}</span>
                        <span
                          className="font-sans font-bold text-sm"
                          style={{ color: cat.accent }}
                        >
                          {price}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <span
                      className="inline-block px-3 py-1 rounded-full border text-[9px] font-mono tracking-widest uppercase"
                      style={{ borderColor: `${cat.accent}30`, color: `${cat.accent}` }}
                    >
                      {cat.tag}
                    </span>
                  </div>
                </div>

              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mt-16 pt-12 border-t border-cream/[0.06] flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          <div>
            <p className="font-sans font-extrabold text-2xl text-cream">
              Alle Preise zzgl. MwSt.
            </p>
            <p className="font-body text-sm text-cream/30 mt-1">
              Staffelpreise auf Anfrage · Mindestbestellung 10 Stück · Versand nur in Deutschland
            </p>
          </div>
          <a
            href="#waitlist"
            className="px-8 py-4 rounded-full bg-lime text-bg font-sans font-extrabold text-sm hover:scale-105 active:scale-95 transition-transform glow-lime whitespace-nowrap"
          >
            Jetzt vormerken →
          </a>
        </motion.div>

      </div>
    </section>
  )
}
