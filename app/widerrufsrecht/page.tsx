import Link from "next/link"

export const metadata = { title: "Widerrufsrecht — WeedForFriends" }

const TEXT  = "#35383f"
const MUTED = "rgba(53,56,63,0.55)"
const BG    = "#bcc0ca"

export default function WiderrufsrechtPage() {
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
        }}>Widerrufs&shy;recht</h1>

        <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>

          <Section title="Widerrufsbelehrung">
            <p className="font-druk" style={{ fontSize: "clamp(1rem,1.4vw,1.3rem)", color: TEXT, marginBottom: 10 }}>
              Widerrufsrecht
            </p>
            <p>
              Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag
              zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag, an dem Sie
              oder ein von Ihnen benannter Dritter, der nicht der Beförderer ist, die Waren
              in Besitz genommen haben bzw. hat.
            </p>
            <p style={{ marginTop: 10 }}>
              Um Ihr Widerrufsrecht auszuüben, müssen Sie uns (WeedForFriends GmbH,
              Musterstraße 12, 10115 Berlin, info@weedforfriends.de) mittels einer eindeutigen
              Erklärung (z.B. ein mit der Post versandter Brief oder eine E-Mail) über Ihren
              Entschluss, diesen Vertrag zu widerrufen, informieren. Sie können dafür das
              beigefügte Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.
            </p>
            <p style={{ marginTop: 10 }}>
              Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die
              Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.
            </p>
          </Section>

          <Section title="Folgen des Widerrufs">
            <p>
              Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von
              Ihnen erhalten haben, einschließlich der Lieferkosten (mit Ausnahme der zusätzlichen
              Kosten, die sich daraus ergeben, dass Sie eine andere Art der Lieferung als die von
              uns angebotene, günstigste Standardlieferung gewählt haben), unverzüglich und
              spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung
              über Ihren Widerruf dieses Vertrags bei uns eingegangen ist.
            </p>
            <p style={{ marginTop: 10 }}>
              Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der
              ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde
              ausdrücklich etwas anderes vereinbart; in keinem Fall werden Ihnen wegen dieser
              Rückzahlung Entgelte berechnet.
            </p>
            <p style={{ marginTop: 10 }}>
              Wir können die Rückzahlung verweigern, bis wir die Waren wieder zurückerhalten
              haben oder bis Sie den Nachweis erbracht haben, dass Sie die Waren zurückgesandt
              haben, je nachdem, welches der frühere Zeitpunkt ist.
            </p>
            <p style={{ marginTop: 10 }}>
              Sie haben die Waren unverzüglich und in jedem Fall spätestens binnen vierzehn Tagen
              ab dem Tag, an dem Sie uns über den Widerruf dieses Vertrags unterrichten,
              an uns zurückzusenden oder zu übergeben. Die Frist ist gewahrt, wenn Sie die
              Waren vor Ablauf der Frist von vierzehn Tagen absenden.
            </p>
            <p style={{ marginTop: 10 }}>
              Sie tragen die unmittelbaren Kosten der Rücksendung der Waren.
            </p>
          </Section>

          <Section title="Ausschluss des Widerrufsrechts">
            <p>
              Das Widerrufsrecht besteht nicht bei Verträgen zur Lieferung von Waren, die nicht
              vorgefertigt sind und für deren Herstellung eine individuelle Auswahl oder Bestimmung
              durch den Verbraucher maßgeblich ist oder die eindeutig auf die persönlichen
              Bedürfnisse des Verbrauchers zugeschnitten sind, sowie bei Waren, die aus
              Hygienegründen nicht zur Rückgabe geeignet sind, sofern deren Versiegelung nach
              der Lieferung entfernt wurde.
            </p>
          </Section>

          <Section title="Muster-Widerrufsformular">
            <p style={{ marginBottom: 16 }}>
              (Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses Formular
              aus und senden Sie es zurück.)
            </p>
            <div style={{
              background: "rgba(53,56,63,0.06)",
              borderRadius: 8, padding: "20px 24px",
              lineHeight: 1.9,
            }}>
              <p>An WeedForFriends GmbH, Musterstraße 12, 10115 Berlin,
                info@weedforfriends.de</p>
              <p style={{ marginTop: 12 }}>
                Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen
                Vertrag über den Kauf der folgenden Waren (*):
              </p>
              <p style={{ marginTop: 8 }}>Bestellt am (*) / erhalten am (*):</p>
              <p>Name des/der Verbraucher(s):</p>
              <p>Anschrift des/der Verbraucher(s):</p>
              <p>Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier):</p>
              <p>Datum:</p>
              <p style={{ marginTop: 12, fontSize: 11, opacity: 0.6 }}>(*) Unzutreffendes streichen.</p>
            </div>
          </Section>

        </div>

        <div style={{ marginTop: 48 }}>
          <Link href="/" className="font-ekstra" style={{
            fontSize: 13, color: MUTED, textDecoration: "none",
            display: "inline-flex", alignItems: "center", gap: 8,
            transition: "color 0.18s",
          }}
            onMouseEnter={e => (e.currentTarget.style.color = TEXT)}
            onMouseLeave={e => (e.currentTarget.style.color = MUTED)}
          >
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
