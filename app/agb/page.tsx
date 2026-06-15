import Link from "next/link"

export const metadata = { title: "AGB — WeedForFriends" }

const TEXT  = "#35383f"
const MUTED = "rgba(53,56,63,0.55)"
const BG    = "#bcc0ca"

export default function AGBPage() {
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
        }}>AGB</h1>

        <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>

          <Section title="§ 1 Geltungsbereich">
            <p>
              Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Bestellungen,
              die Sie als Verbraucher oder Unternehmer über unseren Online-Shop
              weedforfriends.de aufgeben. Verbraucher ist jede natürliche Person,
              die ein Rechtsgeschäft zu einem Zweck abschließt, der überwiegend weder
              ihrer gewerblichen noch ihrer selbständigen beruflichen Tätigkeit zugerechnet
              werden kann. Unternehmer ist eine natürliche oder juristische Person oder eine
              rechtsfähige Personengesellschaft, die bei Abschluss eines Rechtsgeschäfts
              in Ausübung ihrer gewerblichen oder selbständigen beruflichen Tätigkeit handelt.
            </p>
          </Section>

          <Section title="§ 2 Vertragsschluss">
            <p>
              Die Darstellung der Produkte im Online-Shop stellt kein rechtlich bindendes
              Angebot, sondern eine Aufforderung zur Bestellung dar. Mit dem Absenden der
              Bestellung geben Sie ein verbindliches Kaufangebot ab. Die Annahme erfolgt
              durch eine gesonderte Auftragsbestätigung per E-Mail oder durch Versand der Ware.
            </p>
          </Section>

          <Section title="§ 3 Altersverifikation">
            <p>
              Der Kauf unserer Produkte ist ausschließlich volljährigen Personen (ab 18 Jahren)
              gestattet. Sie versichern mit Ihrer Bestellung, dass Sie das 18. Lebensjahr
              vollendet haben. Wir behalten uns vor, eine Altersverifikation bei der Lieferung
              zu verlangen. Bei Verdacht auf Minderjährigkeit wird die Bestellung storniert.
            </p>
          </Section>

          <Section title="§ 4 Preise und Zahlungsbedingungen">
            <p>
              Alle angegebenen Preise sind Endpreise inkl. der gesetzlichen Umsatzsteuer.
              Hinzu kommen etwaige Versand- und Lieferkosten, die vor Abschluss der Bestellung
              ausgewiesen werden. Zahlung ist per Kreditkarte, PayPal, Vorkasse oder
              weiteren angezeigten Zahlungsmethoden möglich.
            </p>
          </Section>

          <Section title="§ 5 Lieferung und Versand">
            <p>
              Wir liefern innerhalb Deutschlands und ausgewählter EU-Länder. Die Lieferzeit
              beträgt 2–4 Werktage innerhalb Deutschlands. Alle Pakete werden diskret und
              ohne Produktkennzeichnung auf der Außenverpackung versendet.
              Ab einem Bestellwert von €50 ist der Versand kostenlos.
              Darunter fallen €4,99 Versandkosten an.
            </p>
          </Section>

          <Section title="§ 6 Widerrufsrecht">
            <p>
              Als Verbraucher steht Ihnen ein gesetzliches Widerrufsrecht zu. Näheres
              dazu entnehmen Sie bitte unserer Widerrufsbelehrung.
            </p>
          </Section>

          <Section title="§ 7 Eigentumsvorbehalt">
            <p>
              Die Ware bleibt bis zur vollständigen Bezahlung unser Eigentum.
            </p>
          </Section>

          <Section title="§ 8 Gewährleistung und Haftung">
            <p>
              Es gelten die gesetzlichen Gewährleistungsrechte. Bei Mängeln haben Sie
              das Recht auf Nacherfüllung (Reparatur oder Ersatzlieferung). Schlägt die
              Nacherfüllung fehl, können Sie Minderung oder Rücktritt verlangen.
              Unsere Haftung bei leichter Fahrlässigkeit ist auf vorhersehbare,
              vertragstypische Schäden beschränkt, sofern keine wesentliche Vertragspflicht
              verletzt wurde.
            </p>
          </Section>

          <Section title="§ 9 Produktinformationen und Haftungsausschluss">
            <p>
              Unsere Produkte sind keine Arzneimittel und ersetzen keine medizinische Beratung.
              Alle Produkte entsprechen den geltenden EU-Vorschriften. Der THC-Gehalt liegt
              unter den gesetzlich zulässigen Grenzwerten. Wir übernehmen keine Haftung für
              Schäden, die durch unsachgemäße Verwendung entstehen.
            </p>
          </Section>

          <Section title="§ 10 Anwendbares Recht und Gerichtsstand">
            <p>
              Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.
              Gerichtsstand für alle Streitigkeiten mit Kaufleuten ist Berlin.
            </p>
          </Section>

          <Section title="§ 11 Salvatorische Klausel">
            <p>
              Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, bleibt
              die Wirksamkeit der übrigen Bestimmungen unberührt. An die Stelle der unwirksamen
              Bestimmung tritt die gesetzliche Regelung.
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
