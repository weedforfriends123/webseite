import Link from "next/link"
import Image from "next/image"

const PAYMENT_LOGOS = [
  { src: "/pay-visa.svg",       alt: "Visa"        },
  { src: "/pay-mastercard.svg", alt: "Mastercard"  },
  { src: "/pay-applepay.svg",   alt: "Apple Pay"   },
  { src: "/pay-googlepay.svg",  alt: "Google Pay"  },
  { src: "/pay-amazonpay.svg",  alt: "Amazon Pay"  },
  { src: "/pay-revolut.svg",    alt: "Revolut Pay" },
  { src: "/pay-eps.svg",        alt: "eps"         },
  { src: "/pay-billie.svg",     alt: "Billie"      },
  { src: "/pay-sepa.svg",       alt: "SEPA"        },
  { src: "/pay-sepa-debit.svg", alt: "SEPA-Lastschrift" },
]

const NAV = [
  { label: "Shop",        href: "/vapes"       },
  { label: "Loyalty",     href: "/loyalty"     },
  { label: "Datenschutz", href: "/datenschutz" },
  { label: "Versand",     href: "/versand"     },
  { label: "AGB",         href: "/agb"         },
  { label: "Impressum",   href: "/impressum"   },
]

export function Footer() {
  return (
    <footer style={{ background: "#1c1e22" }}>

      {/* ── MAIN ── */}
      <div className="max-w-7xl mx-auto"
        style={{ padding: "clamp(56px,9vh,100px) clamp(20px,5vw,72px) 0" }}>

        {/* Top row: logo + nav + social */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-10 md:gap-16"
          style={{ paddingBottom: "clamp(40px,6vh,64px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>

          {/* Logo + tagline */}
          <div className="flex flex-col gap-6">
            <Image src="/logo.webp" alt="WeedForFriends" width={100} height={34}
              className="h-8 w-auto" style={{ filter: "brightness(0) invert(1) opacity(0.55)" }} />
            <p className="font-druk-wide uppercase leading-tight"
              style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.8rem)", color: "rgba(255,255,255,0.08)",
                letterSpacing: "-0.02em", maxWidth: 320 }}>
              Good vibes.<br />Always.
            </p>
          </div>

          {/* Nav */}
          <div className="flex flex-wrap gap-x-8 gap-y-3 md:justify-end md:pt-1">
            {NAV.map(({ label, href }) => (
              <Link key={label} href={href}
                className="font-ekstra uppercase transition-opacity hover:opacity-60"
                style={{ fontSize: 11, letterSpacing: "0.22em", color: "rgba(255,255,255,0.32)",
                  textDecoration: "none" }}>
                {label}
              </Link>
            ))}
          </div>

          {/* Social */}
          <div className="flex gap-3 md:pt-0.5 shrink-0">
            {[
              { href: "https://instagram.com/weedforfriends", label: "Instagram",
                icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg> },
              { href: "https://tiktok.com/@weedforfriends", label: "TikTok",
                icon: <svg width="14" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.29 6.29 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.03a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.46z"/></svg> },
            ].map(({ href, label, icon }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                className="flex items-center justify-center transition-opacity hover:opacity-60"
                style={{ width: 40, height: 40, borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,0.10)",
                  color: "rgba(255,255,255,0.32)" }}>
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* Payment logos */}
        <div style={{ padding: "clamp(28px,4vh,44px) 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <p className="font-ekstra uppercase mb-4"
            style={{ fontSize: 9, letterSpacing: "0.26em", color: "rgba(255,255,255,0.20)" }}>
            Zahlungsmethoden
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
            {PAYMENT_LOGOS.map(logo => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={logo.alt} src={logo.src} alt={logo.alt} title={logo.alt}
                style={{ height: 36, width: "auto", maxWidth: 68, objectFit: "contain",
                  borderRadius: 7, opacity: 0.75 }} />
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3"
          style={{ padding: "clamp(20px,3vh,32px) 0 clamp(28px,4vh,44px)" }}>
          <p className="font-ekstra" style={{ fontSize: 10, color: "rgba(255,255,255,0.18)", letterSpacing: "0.06em" }}>
            © WFF 2026 · Xenon Ventures Ltd. · Malta
          </p>
          <p className="font-ekstra" style={{ fontSize: 10, color: "rgba(255,255,255,0.12)", letterSpacing: "0.06em" }}>
            Jugendschutz · § 9 JuSchG · hello@weedforfriends.com
          </p>
        </div>
      </div>
    </footer>
  )
}
