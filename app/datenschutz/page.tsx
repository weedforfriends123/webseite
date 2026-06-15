import Link from "next/link"

export const metadata = { title: "Datenschutz — WeedForFriends" }

const TEXT  = "#35383f"
const MUTED = "rgba(53,56,63,0.55)"
const BG    = "#bcc0ca"

export default function DatenschutzPage() {
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
        }}>Datenschutz</h1>

        <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>

          <Section title="1. Verantwortlicher">
            <p>
              Verantwortlicher im Sinne der DSGVO ist die WeedForFriends GmbH,
              Musterstraße 12, 10115 Berlin (info@weedforfriends.de).
            </p>
          </Section>

          <Section title="2. Erhebung und Verarbeitung personenbezogener Daten">
            <p>
              Wir erheben personenbezogene Daten nur, soweit dies zur Erbringung unserer
              Leistungen erforderlich ist. Dies umfasst insbesondere:
            </p>
            <ul style={{ paddingLeft: 20, marginTop: 10 }}>
              <li>Bestelldaten (Name, Anschrift, E-Mail, Zahlungsdaten)</li>
              <li>Kontaktdaten bei Anfragen über das Kontaktformular</li>
              <li>Technische Daten (IP-Adresse, Browser-Typ, Zugriffszeiten)</li>
            </ul>
            <p style={{ marginTop: 10 }}>
              Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) sowie
              Art. 6 Abs. 1 lit. f DSGVO (berechtigte Interessen).
            </p>
          </Section>

          <Section title="3. Bestellabwicklung">
            <p>
              Ihre Bestelldaten werden ausschließlich zur Abwicklung der Bestellung verwendet,
              einschließlich Versand, Rechnungsstellung und Kundenservice.
              Eine Weitergabe an Dritte erfolgt nur soweit für die Vertragserfüllung notwendig
              (z.B. Versanddienstleister, Zahlungsabwickler).
            </p>
          </Section>

          <Section title="4. Cookies">
            <p>
              Unsere Website verwendet technisch notwendige Cookies sowie optionale Analyse-Cookies.
              Technisch notwendige Cookies gewährleisten grundlegende Funktionen wie den Warenkorb
              und Login-Status. Optionale Cookies werden nur nach Ihrer ausdrücklichen Einwilligung gesetzt.
            </p>
          </Section>

          <Section title="5. Weitergabe von Daten">
            <p>
              Eine Übermittlung Ihrer Daten an Dritte findet nur statt, wenn dies zur
              Vertragserfüllung notwendig ist, Sie eingewilligt haben oder eine gesetzliche
              Verpflichtung besteht. Wir geben Ihre Daten nicht für Werbezwecke an Dritte weiter.
            </p>
          </Section>

          <Section title="6. Speicherdauer">
            <p>
              Personenbezogene Daten werden nur so lange gespeichert, wie es für den jeweiligen
              Zweck notwendig ist oder gesetzliche Aufbewahrungsfristen bestehen
              (handelsrechtlich: 10 Jahre, steuerrechtlich: 10 Jahre).
            </p>
          </Section>

          <Section title="7. Ihre Rechte">
            <p>Sie haben das Recht auf:</p>
            <ul style={{ paddingLeft: 20, marginTop: 10 }}>
              <li>Auskunft über gespeicherte Daten (Art. 15 DSGVO)</li>
              <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
              <li>Löschung Ihrer Daten (Art. 17 DSGVO)</li>
              <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
              <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
              <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
            </ul>
            <p style={{ marginTop: 10 }}>
              Zur Ausübung Ihrer Rechte wenden Sie sich an: info@weedforfriends.de
            </p>
          </Section>

          <Section title="8. Beschwerderecht">
            <p>
              Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die
              Verarbeitung Ihrer personenbezogenen Daten durch uns zu beschweren.
              Zuständig ist die Berliner Beauftragte für Datenschutz und Informationsfreiheit.
            </p>
          </Section>

          <Section title="9. Aktualität und Änderung dieser Datenschutzerklärung">
            <p>
              Diese Datenschutzerklärung hat den Stand Juni 2025. Durch die Weiterentwicklung
              unserer Website oder aufgrund geänderter gesetzlicher oder behördlicher Vorgaben
              kann es notwendig werden, diese Erklärung zu aktualisieren.
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
