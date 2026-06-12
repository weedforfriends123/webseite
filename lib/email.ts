import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM   = "WEEDFORFRIENDS <noreply@weedforfriends.com>"
const SITE   = process.env.NEXT_PUBLIC_SITE_URL ?? "https://weedforfriends-production.up.railway.app"

const BASE_STYLE = `
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #bcc0ca;
  color: #35383f;
  padding: 0;
  margin: 0;
`

function wrapper(content: string) {
  return `<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="${BASE_STYLE}">
  <div style="max-width:520px;margin:0 auto;padding:32px 20px">
    <div style="text-align:center;margin-bottom:32px">
      <img src="${SITE}/logo.webp" alt="WEEDFORFRIENDS" width="40" height="40"
        style="width:40px;height:auto;filter:brightness(0)" />
    </div>
    <div style="background:rgba(255,255,255,0.52);border-radius:20px;padding:clamp(24px,4vw,36px);border:1px solid rgba(255,255,255,0.68)">
      ${content}
    </div>
    <p style="text-align:center;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(53,56,63,0.45);margin-top:28px">
      WEEDFORFRIENDS · weedforfriends.com
    </p>
  </div>
</body></html>`
}

function btn(label: string, url: string) {
  return `<div style="text-align:center;margin-top:28px">
    <a href="${url}" style="display:inline-block;background:#35383f;color:#e8e4dc;font-size:12px;letter-spacing:0.22em;text-transform:uppercase;text-decoration:none;padding:15px 32px;border-radius:50px;font-weight:600">
      ${label}
    </a>
  </div>`
}

export async function sendAgeVerificationReminder(email: string, firstName?: string) {
  const name = firstName ? `, ${firstName}` : ""
  return resend.emails.send({
    from: FROM,
    to: [email],
    subject: "Verifiziere dein Alter – WEEDFORFRIENDS",
    html: wrapper(`
      <h1 style="font-size:22px;font-weight:900;text-transform:uppercase;letter-spacing:-0.02em;color:#35383f;margin:0 0 8px;line-height:1.1">
        Hey${name}!<br/>Verifiziere jetzt dein Alter.
      </h1>
      <p style="font-size:15px;color:rgba(53,56,63,0.65);line-height:1.75;margin:16px 0 0">
        Du hast dich erfolgreich bei WEEDFORFRIENDS registriert – Willkommen!
      </p>
      <p style="font-size:15px;color:rgba(53,56,63,0.65);line-height:1.75;margin:12px 0 0">
        Bevor du deine erste Bestellung aufgeben kannst, müssen wir kurz dein Alter bestätigen. Der Vorgang dauert nur wenige Sekunden direkt in deinem Browser – ganz ohne Datei-Upload.
      </p>
      <div style="margin-top:24px;padding:18px;background:rgba(53,56,63,0.07);border-radius:12px">
        <p style="margin:0;font-size:13px;color:rgba(53,56,63,0.55);line-height:1.7">
          🔒 <strong style="color:#35383f">DSGVO-Hinweis:</strong> Deine Ausweisbilder werden ausschließlich zur Altersüberprüfung temporär verarbeitet und werden <strong style="color:#35383f">nicht dauerhaft gespeichert</strong>.
        </p>
      </div>
      ${btn("Alter jetzt verifizieren", `${SITE}/account`)}
      <p style="text-align:center;font-size:12px;color:rgba(53,56,63,0.40);margin-top:20px;line-height:1.6">
        Du erhältst diese E-Mail, da du ein Konto bei WEEDFORFRIENDS erstellt hast.<br/>
        Falls du das nicht warst, kannst du diese Nachricht ignorieren.
      </p>
    `),
  })
}

export async function sendAgeVerificationConfirmation(email: string, firstName?: string) {
  const name = firstName ? `, ${firstName}` : ""
  return resend.emails.send({
    from: FROM,
    to: [email],
    subject: "Altersverifizierung abgeschlossen – WEEDFORFRIENDS",
    html: wrapper(`
      <div style="text-align:center;margin-bottom:20px">
        <div style="display:inline-flex;align-items:center;justify-content:center;width:60px;height:60px;border-radius:50%;background:#35383f">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e8e4dc" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
      </div>
      <h1 style="font-size:22px;font-weight:900;text-transform:uppercase;letter-spacing:-0.02em;color:#35383f;margin:0 0 8px;line-height:1.1;text-align:center">
        Verifizierung<br/>abgeschlossen.
      </h1>
      <p style="font-size:15px;color:rgba(53,56,63,0.65);line-height:1.75;margin:16px 0 0;text-align:center">
        Hey${name}, dein Alter wurde erfolgreich bestätigt. Du kannst ab sofort Bestellungen bei WEEDFORFRIENDS aufgeben.
      </p>
      <div style="margin-top:24px;padding:20px;background:rgba(53,56,63,0.07);border-radius:12px">
        <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:rgba(53,56,63,0.55)">
          DSGVO-Bestätigung
        </p>
        <p style="margin:0;font-size:13px;color:rgba(53,56,63,0.65);line-height:1.75">
          Deine Ausweisbilder und das Selfie wurden ausschließlich zur einmaligen Altersüberprüfung genutzt. Alle hochgeladenen Bilder wurden nach der Überprüfung <strong style="color:#35383f">unwiderruflich und vollständig gelöscht</strong> – sie werden weder gespeichert noch an Dritte weitergegeben.
        </p>
        <p style="margin:10px 0 0;font-size:13px;color:rgba(53,56,63,0.65);line-height:1.75">
          Diese Bestätigung dient als Nachweis deiner abgeschlossenen Altersverifizierung gemäß DSGVO.
        </p>
      </div>
      ${btn("Jetzt shoppen", `${SITE}/#hero`)}
      <p style="text-align:center;font-size:12px;color:rgba(53,56,63,0.40);margin-top:20px;line-height:1.6">
        Diese E-Mail wurde automatisch nach Abschluss deiner Altersverifizierung versandt.
      </p>
    `),
  })
}
