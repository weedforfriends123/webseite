import Link from "next/link"

export const metadata = { title: "Impressum — WeedForFriends" }

const TEXT  = "#35383f"
const MUTED = "rgba(53,56,63,0.55)"
const BG    = "#bcc0ca"

export default function ImpressumPage() {
  return (
    <main style={{ background: BG, minHeight: "100vh", paddingTop: 96 }}>
      <div style={{
        maxWidth: 760, margin: "0 auto",
        padding: "clamp(40px,6vh,80px) clamp(20px,5vw,48px) clamp(80px,12vh,140px)",
      }}>

        <p className="font-ekstra uppercase" style={{
          fontSize: 9, letterSpacing: "0.52em", color: MUTED, marginBottom: 20,
        }}>Rechtliches</p>

        <h1 className="font-druk-wide uppercase" style={{
          fontSize: "clamp(2.2rem,5vw,5rem)",
          letterSpacing: "-0.03em", lineHeight: 0.9,
          color: TEXT, margin: "0 0 clamp(32px,5vh,56px)",
        }}>Impressum</h1>

        <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>

          <Section title="Angaben gemäß § 5 TMG">
            <p>WeedForFriends GmbH</p>
            <p>Musterstraße 12</p>
            <p>10115 Berlin</p>
          </Section>

          <Section title="Vertreten durch">
            <p>Geschäftsführer: [Name des Geschäftsführers]</p>
          </Section>

          <Section title="Kontakt">
            <p>Telefon: +49 (0) 30 000 000 00</p>
            <p>E-Mail: info@weedforfriends.de</p>
          </Section>

          <Section title="Registereintrag">
            <p>Eintragung im Handelsregister</p>
            <p>Registergericht: Amtsgericht Berlin-Charlottenburg</p>
            <p>Registernummer: HRB 000000 B</p>
          </Section>

          <Section title="Umsatzsteuer-Identifikationsnummer">
            <p>USt-IdNr. gemäß § 27a UStG: DE000000000</p>
          </Section>

          <Section title="Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV">
            <p>[Name, Adresse wie oben]</p>
          </Section>

          <Section title="Hinweis zu Cannabinoiden">
            <p>
              Alle von WeedForFriends angebotenen Produkte enthalten Cannabinoide (u.a. HHC, CBD)
              in Konzentrationen, die den geltenden EU-Vorschriften entsprechen. Der THC-Gehalt liegt
              bei allen Produkten unter dem gesetzlich zulässigen Grenzwert. Die Produkte sind nicht
              als Arzneimittel zugelassen und ersetzen keine medizinische Beratung oder Behandlung.
              Verkauf ausschließlich an Personen ab 18 Jahren.
            </p>
          </Section>

          <Section title="Streitschlichtung">
            <p>
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
              https://ec.europa.eu/consumers/odr. Unsere E-Mail-Adresse finden Sie oben im Impressum.
            </p>
            <p style={{ marginTop: 10 }}>
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </Section>

          <Section title="Haftung für Inhalte">
            <p>
              Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten
              nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als
              Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
              Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
              Tätigkeit hinweisen.
            </p>
          </Section>

        </div>

        <div style={{ marginTop: 48 }}>
          <Link href="/" className="font-ekstra legal-back-link" style={{
            fontSize: 13, color: MUTED, textDecoration: "none",
            display: "inline-flex", alignItems: "center", gap: 8,
            transition: "color 0.18s",
          }}>
            ← Zurück zur Startseite
          </Link>
        </div>

      </div>
    </main>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-druk-wide uppercase" style={{
        fontSize: "clamp(13px,1.1vw,16px)", letterSpacing: "0.06em",
        color: TEXT, marginBottom: 12,
      }}>{title}</h2>
      <div className="font-ekstra" style={{
        fontSize: "clamp(14px,1.05vw,16px)", color: MUTED,
        lineHeight: 1.78,
        borderLeft: "2px solid rgba(53,56,63,0.15)",
        paddingLeft: 20,
      }}>
        {children}
      </div>
    </div>
  )
}
