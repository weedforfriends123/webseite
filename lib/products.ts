export type Product = {
  id:           string
  name:         string
  tagline:      string
  description:  string
  badge:        string | null
  flavor:       string
  tag:          string
  accent:       string   // CSS color for card accent
  packs:        { label: string; price: number; perUnit: number }[]
}

export const PRODUCTS: Product[] = [
  {
    id:          "northern-lights",
    name:        "Northern Lights",
    tagline:     "Straight Flavor",
    description: "Der klassische Hit. HC 96%, sauber destilliert, ohne Zusätze. Ein Zug und du weißt Bescheid.",
    badge:       "Bestseller",
    flavor:      "Earthy · Pine · Citrus",
    tag:         "HC 96%",
    accent:      "#a0ba87",
    packs: [
      { label: "1×",  price: 29.99,  perUnit: 29.99 },
      { label: "3×",  price: 79.99,  perUnit: 26.66 },
      { label: "5×",  price: 119.99, perUnit: 24.00 },
    ],
  },
  {
    id:          "pure-juice",
    name:        "Pure Juice",
    tagline:     "Sweet & Fruity",
    description: "Süß, fruchtig, fett – kein halbes Ding. Der Flavor trifft dich voll im Gesicht.",
    badge:       "New Drop",
    flavor:      "Mango · Passion · Sweet",
    tag:         "HC 96%",
    accent:      "#c9a84c",
    packs: [
      { label: "1×",  price: 29.99,  perUnit: 29.99 },
      { label: "3×",  price: 79.99,  perUnit: 26.66 },
      { label: "5×",  price: 119.99, perUnit: 24.00 },
    ],
  },
  {
    id:          "taste-overload",
    name:        "Taste Overload",
    tagline:     "Maximum Flavor",
    description: "Jeder Zug haut den vollen Geschmack raus. Terpene auf Maximum – schmeckst jeden Layer.",
    badge:       null,
    flavor:      "Complex · Deep · Rich",
    tag:         "HC 96%",
    accent:      "#bcc0ca",
    packs: [
      { label: "1×",  price: 29.99,  perUnit: 29.99 },
      { label: "3×",  price: 79.99,  perUnit: 26.66 },
      { label: "5×",  price: 119.99, perUnit: 24.00 },
    ],
  },
  {
    id:          "starter-pack",
    name:        "Starter Pack",
    tagline:     "Alle 3 Flavors",
    description: "Das beste Intro zu WFF. Alle drei Flavors auf einmal – finde deinen Daily.",
    badge:       "Bundle −11%",
    flavor:      "Northern Lights + Pure Juice + Taste Overload",
    tag:         "3× HC 96%",
    accent:      "#35383f",
    packs: [
      { label: "Bundle",  price: 79.99,  perUnit: 26.66 },
      { label: "2× Bundle", price: 149.99, perUnit: 25.00 },
    ],
  },
]
