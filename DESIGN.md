# Design

## Color Palette

| Token    | Hex       | Use |
|----------|-----------|-----|
| cream    | `#f2f0e5` | Page background, primary surface |
| ink      | `#35383f` | Primary text, dark section bg |
| charcoal | `#28251f` | Deep dark section bg (BeyondSection, Footer) |
| near-black | `#0e0f11` | True black, max contrast text |
| white    | `#fafaf7` | Newsletter section bg |
| gold     | `#c9a84c` | CTA accent, warm highlights |
| sage     | `#a0ba87` | Success states, tags, eco accent |

Sections alternate: cream → dark (#28251f) → cream → dark (#35383f) → white → dark footer. Gradient dividers (12vh) blend between zones.

## Typography

### Typefaces

| Role    | Family      | Use |
|---------|-------------|-----|
| Display | Adieu Bold  | All hero/section headings. Uppercase, tracking -0.02em, line-height 0.82–0.85 |
| Body    | Ekstra Regular | Descriptions, body copy. Small sizes (9–11px), line-height 1.7–1.8 |
| Accent  | Mindflow    | Subtle italic accents, rotation indicators, floated script details |
| Mono    | ABC Diatype Mono | Labels, counters, tags. 7–10px, tracking 0.3–0.5em, uppercase |
| Heavy   | Druk Heavy  | CTAs only when maximum weight is needed |

### Scale

- Hero headline: `clamp(6rem, 14vw, 16rem)` — fills full viewport width
- Section headline: `clamp(3.5rem, 8vw, 9rem)`
- BeyondSection bg words: `clamp(10rem, 20vw, 25rem)` (REIN./IMMER.), `clamp(5rem, 9.5vw, 13rem)` (GOODVAPESONLY)
- Body: `clamp(9px, 0.9vw, 11px)`
- Labels/eyebrows: 8–9px, tracking 0.35–0.5em, uppercase

## Spacing

Consistent 5vw left-rail (`clamp(20px, 5vw, 80px)`) for all left-anchored content. Center stays open for the floating product canvas.

Section padding: `clamp(80px, 12vh, 140px)` top/bottom.

## Components

### FloatingProduct
Fixed, z-[10], centered, `position: fixed`. Canvas crop 680×1000 (portrait). CSS `rotateY` interpolation between 30 integer frames for smooth rotation. Mouse parallax ±18px X / ±10px Y via useSpring. Idle float 7px amplitude, 11s period.

### Tab Navigation (WFFHero)
4 tabs, pill-bordered active state. Tick bar progress at very top.

### Section Text Layout
Left-rail anchored (`paddingLeft: clamp(20px, 5vw, 80px)`), maxWidth clamp per section. Right side always open for product.

### Gradient Transitions
`height: 12vh` divs between sections, linear-gradient to smoothly blend section backgrounds.

### Grain Overlays
SVG feTurbulence filter, opacity 0.04–0.06, `z-[15]` to layer over product (z-[10]) but under text (z-[20]).

### Cards (Testimonials/Features)
1px border `rgba(...)`, no rounded corners beyond 4px. No box-shadow — sections use ambient drop-shadows on the canvas product instead.

## Motion

- Entrance: `opacity 0 → 1, y 40 → 0, blur 18px → 0`, 1.6s ease `[0.16, 1, 0.3, 1]`
- Section reveals: `opacity 0 → 1, x -20 → 0`, 0.55s, same ease
- Tab transitions: Framer Motion layoutId shared indicator
- Product rotation: canvas frame snap + CSS `perspective(1000px) rotateY(±6°)` interpolation, 60fps RAF
- Reduced motion: all animation disabled, product shown static

## Layout Architecture

```
<FloatingProduct />   fixed z-[10]  — floats over everything
<Navbar />            sticky z-[50]
<WFFHero />           500vh sticky, z-[20]+ for UI
gradient div          12vh cream→dark
<BeyondSection />     320vh sticky, giant bg typography
gradient div          12vh dark→cream
Features section      left-anchored, cream bg
gradient div          12vh cream→dark
<Testimonials />      dark bg, marquee
gradient div          12vh dark→white
<NewsletterCTA />     white bg, left-anchored
gradient div          10vh white→dark
<Footer />            dark bg
```
