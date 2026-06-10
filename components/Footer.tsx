import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer style={{ background: "#28251f" }}>
      <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-14 pt-14 pb-28 md:pb-14">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-8">
          <Image
            src="/logo.webp"
            alt="WFF"
            width={80}
            height={28}
            className="h-7 w-auto"
            style={{ filter: "brightness(0) invert(1) opacity(0.35)" }}
          />

          <div
            className="flex flex-wrap gap-5 font-mono text-[9px] tracking-[0.2em] uppercase"
            style={{ color: "rgba(53,56,63,0.28)" }}
          >
            <Link href="/shop" className="transition-colors hover:opacity-80" style={{ color: "inherit" }}>
              Shop
            </Link>
            <Link href="/loyalty" className="transition-colors hover:opacity-80" style={{ color: "inherit" }}>
              Loyalty
            </Link>
            <Link href="/datenschutz" className="transition-colors hover:opacity-80" style={{ color: "inherit" }}>
              Datenschutz
            </Link>
            <span>Versand</span>
            <span>AGB</span>
          </div>

          <div className="flex gap-2.5">
            {[
              {
                href: "https://instagram.com",
                label: "IG",
                icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                ),
              },
              {
                href: "https://tiktok.com",
                label: "TK",
                icon: (
                  <svg width="12" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.29 6.29 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.03a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.46z" />
                  </svg>
                ),
              },
            ].map(({ href, label, icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
                style={{ border: "1px solid rgba(53,56,63,0.1)", color: "rgba(53,56,63,0.28)" }}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        <div className="h-px mb-6" style={{ background: "rgba(53,56,63,0.06)" }} />

        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <p
            className="font-adieu uppercase leading-none"
            style={{
              fontSize: "clamp(0.8rem, 1.5vw, 1.2rem)",
              letterSpacing: "0.02em",
              color: "rgba(53,56,63,0.06)",
            }}
          >
            Consistency is the ritual. Ritual is WFF.
          </p>
          <div className="text-right">
            <p
              className="font-mono text-[9px] tracking-[0.2em] uppercase"
              style={{ color: "rgba(53,56,63,0.2)" }}
            >
              © WFF 2026 · Xenon Ventures Ltd. · Malta
            </p>
            <p
              className="font-mono text-[8px] tracking-[0.15em] uppercase mt-0.5"
              style={{ color: "rgba(53,56,63,0.12)" }}
            >
              Jugendschutz · § 9 JuSchG · hello@weedforfriends.com
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
