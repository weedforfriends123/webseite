import { Resend } from "resend"

const getResend = () => new Resend(process.env.RESEND_API_KEY)
const FROM = "WEEDFORFRIENDS <noreply@weedforfriends.com>"
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://weedforfriends-production.up.railway.app"

// ── Shared HTML building blocks ───────────────────────────────────────────────

function emailBase(previewText: string, body: string) {
  return `<!DOCTYPE html>
<html lang="de" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>WEEDFORFRIENDS</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
  <style>
    body { margin:0!important; padding:0!important; background:#bcc0ca!important; }
    table { border-collapse:collapse!important; }
    img { border:0; display:block; }
    a { color:#35383f; }
  </style>
</head>
<body style="margin:0;padding:0;background:#bcc0ca;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">

  <!-- Preview text -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${previewText}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>

  <!-- Outer wrapper -->
  <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="background:#bcc0ca;">
    <tr>
      <td align="center" style="padding:0;">

        <!-- Email container -->
        <table role="presentation" width="560" border="0" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- ── HEADER ── -->
          <tr>
            <td style="background:#35383f;padding:32px 40px 24px;border-radius:20px 20px 0 0;text-align:center;">
              <!--[if mso]><p style="font-family:Arial;font-size:18px;font-weight:900;text-transform:uppercase;letter-spacing:4px;color:#e8e4dc;text-align:center;margin:0;">WEEDFORFRIENDS</p><![endif]-->
              <!--[if !mso]><!-->
              <img src="${SITE}/branding/logo-email.png"
                width="180" height="49" alt="WEEDFORFRIENDS"
                style="display:block;margin:0 auto;width:180px;height:auto;max-width:180px;" />
              <!--<![endif]-->
            </td>
          </tr>

          <!-- Yellow accent line -->
          <tr>
            <td style="background:#35383f;padding:0 40px 28px;">
              <div style="height:2px;background:#eddc8c;border-radius:2px;"></div>
            </td>
          </tr>

          <!-- ── BODY ── -->
          <tr>
            <td style="background:#bcc0ca;padding:36px 28px 44px;">
              ${body}
            </td>
          </tr>

          <!-- ── FOOTER ── -->
          <tr>
            <td style="background:#bcc0ca;padding:0 28px 44px;">
              <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-top:1px solid rgba(53,56,63,0.15);padding-top:24px;">
                    <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(53,56,63,0.40);text-align:center;line-height:1.8;">
                      WEEDFORFRIENDS &middot; weedforfriends.com
                    </p>
                    <p style="margin:8px 0 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:11px;color:rgba(53,56,63,0.30);text-align:center;line-height:1.8;">
                      <a href="${SITE}/impressum" style="color:rgba(53,56,63,0.40);text-decoration:none;">Impressum</a>
                      &nbsp;&middot;&nbsp;
                      <a href="${SITE}/datenschutz" style="color:rgba(53,56,63,0.40);text-decoration:none;">Datenschutz</a>
                      &nbsp;&middot;&nbsp;
                      <a href="${SITE}/agb" style="color:rgba(53,56,63,0.40);text-decoration:none;">AGB</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function card(content: string) {
  return `<table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
    <tr>
      <td style="background:#d8dce3;border-radius:16px;padding:22px 24px;">
        ${content}
      </td>
    </tr>
  </table>`
}

function ctaBtn(label: string, url: string) {
  return `<table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-top:28px;">
    <tr>
      <td align="center">
        <a href="${url}" style="display:inline-block;background:#35383f;color:#e8e4dc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:12px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;text-decoration:none;padding:16px 36px;border-radius:50px;">
          ${label}
        </a>
      </td>
    </tr>
  </table>`
}

type OrderItem = { title: string; variant_title?: string; price: string; quantity: number }

function lineItemsTable(items: OrderItem[], shippingPrice: string, grandTotal: string) {
  const rows = items.map(i => {
    const lineTotal = (parseFloat(i.price) * i.quantity).toFixed(2).replace(".", ",")
    return `<tr>
      <td style="padding:10px 0;border-bottom:1px solid rgba(53,56,63,0.10);">
        <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:14px;font-weight:600;color:#35383f;">${i.title}</p>
        ${i.variant_title ? `<p style="margin:2px 0 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(53,56,63,0.45);">${i.variant_title}</p>` : ""}
      </td>
      <td style="padding:10px 0;border-bottom:1px solid rgba(53,56,63,0.10);text-align:right;white-space:nowrap;vertical-align:top;">
        <span style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:13px;color:rgba(53,56,63,0.45);">×${i.quantity}&nbsp;</span>
        <span style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:14px;font-weight:700;color:#35383f;">${lineTotal} €</span>
      </td>
    </tr>`
  }).join("")

  const ship = parseFloat(shippingPrice) === 0
    ? `<span style="color:#a0ba87;font-weight:700;">Gratis</span>`
    : `<span style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:13px;color:#35383f;">${parseFloat(shippingPrice).toFixed(2).replace(".", ",")} €</span>`

  return card(`
    <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
      ${rows}
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid rgba(53,56,63,0.10);">
          <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:13px;color:rgba(53,56,63,0.55);">Versand</p>
        </td>
        <td style="padding:10px 0;border-bottom:1px solid rgba(53,56,63,0.10);text-align:right;">${ship}</td>
      </tr>
      <tr>
        <td style="padding:14px 0 0;">
          <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:rgba(53,56,63,0.50);">Gesamt</p>
        </td>
        <td style="padding:14px 0 0;text-align:right;">
          <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:20px;font-weight:900;letter-spacing:-0.02em;color:#35383f;">${parseFloat(grandTotal).toFixed(2).replace(".", ",")} €</p>
        </td>
      </tr>
    </table>
  `)
}

// ── Age Verification ──────────────────────────────────────────────────────────

export async function sendAgeVerificationReminder(email: string, firstName?: string) {
  const name = firstName ? `, ${firstName}` : ""
  return getResend().emails.send({
    from: FROM,
    to: [email],
    subject: "Verifiziere dein Alter – WEEDFORFRIENDS",
    html: emailBase(
      "Bestätige dein Alter und starte mit WEEDFORFRIENDS.",
      `<h1 style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:26px;font-weight:900;text-transform:uppercase;letter-spacing:-0.02em;color:#35383f;margin:0 0 12px;line-height:1.1;">Hey${name}!<br/>Verifiziere jetzt dein Alter.</h1>
      <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:15px;color:rgba(53,56,63,0.65);line-height:1.75;margin:16px 0 24px;">
        Du hast dich erfolgreich bei WEEDFORFRIENDS registriert – Willkommen! Bestätige kurz dein Alter, der Vorgang dauert nur wenige Sekunden.
      </p>
      ${card(`<p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:13px;color:rgba(53,56,63,0.55);line-height:1.7;">
        🔒 <strong style="color:#35383f;">DSGVO-Hinweis:</strong> Deine Ausweisbilder werden ausschließlich zur Altersüberprüfung temporär verarbeitet und danach <strong style="color:#35383f;">unwiderruflich gelöscht</strong>.
      </p>`)}
      ${ctaBtn("Alter jetzt verifizieren", `${SITE}/account`)}`
    ),
  })
}

export async function sendAgeVerificationConfirmation(email: string, firstName?: string) {
  const name = firstName ? `, ${firstName}` : ""
  return getResend().emails.send({
    from: FROM,
    to: [email],
    subject: "Altersverifizierung abgeschlossen – WEEDFORFRIENDS",
    html: emailBase(
      "Dein Alter wurde bestätigt – du kannst jetzt bestellen.",
      `<div style="text-align:center;margin-bottom:24px;">
        <div style="display:inline-block;width:56px;height:56px;border-radius:50%;background:#35383f;line-height:56px;text-align:center;">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e8e4dc" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-top:-2px;"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
      </div>
      <h1 style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:26px;font-weight:900;text-transform:uppercase;letter-spacing:-0.02em;color:#35383f;margin:0 0 12px;line-height:1.1;text-align:center;">Verifizierung<br/>abgeschlossen.</h1>
      <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:15px;color:rgba(53,56,63,0.65);line-height:1.75;margin:16px 0 24px;text-align:center;">
        Hey${name}, dein Alter wurde bestätigt. Du kannst ab sofort Bestellungen aufgeben.
      </p>
      ${card(`<p style="margin:0 0 6px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:rgba(53,56,63,0.45);">DSGVO-Bestätigung</p>
      <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:13px;color:rgba(53,56,63,0.65);line-height:1.75;">
        Alle Ausweisbilder wurden nach der Überprüfung <strong style="color:#35383f;">unwiderruflich gelöscht</strong> – weder gespeichert noch weitergegeben.
      </p>`)}
      ${ctaBtn("Jetzt shoppen", `${SITE}/`)}`
    ),
  })
}

// ── Order Confirmation ────────────────────────────────────────────────────────

export async function sendOrderConfirmation(params: {
  email: string
  firstName: string
  orderRef: string
  lineItems: OrderItem[]
  shippingAddress: { first_name: string; last_name: string; address1: string; address2?: string; city: string; zip: string; country: string }
  shippingPrice: string
  grandTotal: string
}) {
  const { email, firstName, orderRef, lineItems, shippingAddress, shippingPrice, grandTotal } = params
  const addr = shippingAddress

  return getResend().emails.send({
    from: FROM,
    to: [email],
    subject: `Bestellung eingegangen #${orderRef} — WEEDFORFRIENDS`,
    html: emailBase(
      `Danke ${firstName}, wir haben deine Bestellung erhalten.`,
      `
      <div style="text-align:center;margin-bottom:24px;">
        <div style="display:inline-block;width:56px;height:56px;border-radius:50%;background:#eddc8c;line-height:56px;text-align:center;">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#35383f" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-top:-2px;">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
          </svg>
        </div>
      </div>

      <h1 style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:26px;font-weight:900;text-transform:uppercase;letter-spacing:-0.02em;color:#35383f;margin:0 0 12px;line-height:1.1;text-align:center;">
        Bestellung<br/>eingegangen.
      </h1>
      <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:15px;color:rgba(53,56,63,0.65);line-height:1.75;margin:16px 0 28px;text-align:center;">
        Hey ${firstName}, deine Bestellung ist bei uns eingegangen. Sobald deine Zahlung bestätigt ist, bearbeiten wir sie sofort.
      </p>

      ${card(`
        <p style="margin:0 0 4px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:rgba(53,56,63,0.45);">Bestellreferenz</p>
        <p style="margin:0;font-family:'Courier New',Courier,monospace;font-size:18px;font-weight:700;letter-spacing:0.10em;color:#35383f;">#${orderRef}</p>
      `)}

      <p style="margin:24px 0 10px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:rgba(53,56,63,0.45);">Deine Artikel</p>
      ${lineItemsTable(lineItems, shippingPrice, grandTotal)}

      <p style="margin:20px 0 10px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:rgba(53,56,63,0.45);">Lieferadresse</p>
      ${card(`
        <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:14px;color:#35383f;line-height:1.85;">
          ${addr.first_name} ${addr.last_name}<br/>
          ${addr.address1}${addr.address2 ? "<br/>" + addr.address2 : ""}<br/>
          ${addr.zip} ${addr.city}<br/>
          ${addr.country}
        </p>
      `)}

      ${ctaBtn("Zum Shop", `${SITE}/`)}

      <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:12px;color:rgba(53,56,63,0.40);text-align:center;margin-top:20px;line-height:1.6;">
        Fragen? <a href="mailto:info@weedforfriends.com" style="color:rgba(53,56,63,0.55);text-decoration:none;">info@weedforfriends.com</a>
      </p>
      `
    ),
  })
}

// ── Payment Confirmation ──────────────────────────────────────────────────────

export async function sendPaymentConfirmation(params: {
  email: string
  firstName: string
  shopifyOrderNumber: number
  lineItems: OrderItem[]
  shippingPrice: string
  grandTotal: string
}) {
  const { email, firstName, shopifyOrderNumber, lineItems, shippingPrice, grandTotal } = params

  return getResend().emails.send({
    from: FROM,
    to: [email],
    subject: `Zahlung bestätigt #${shopifyOrderNumber} — WEEDFORFRIENDS`,
    html: emailBase(
      `Zahlung eingegangen – Bestellung #${shopifyOrderNumber} wird bearbeitet.`,
      `
      <div style="text-align:center;margin-bottom:24px;">
        <div style="display:inline-block;width:56px;height:56px;border-radius:50%;background:#a0ba87;line-height:56px;text-align:center;">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-top:-2px;"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
      </div>

      <h1 style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:26px;font-weight:900;text-transform:uppercase;letter-spacing:-0.02em;color:#35383f;margin:0 0 12px;line-height:1.1;text-align:center;">
        Zahlung<br/>bestätigt.
      </h1>
      <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:15px;color:rgba(53,56,63,0.65);line-height:1.75;margin:16px 0 28px;text-align:center;">
        Hey ${firstName}, deine Zahlung ist eingegangen. Wir bearbeiten deine Bestellung und schicken sie so schnell wie möglich raus.
      </p>

      ${card(`
        <p style="margin:0 0 4px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:rgba(53,56,63,0.45);">Bestellnummer</p>
        <p style="margin:0 0 16px;font-family:'Courier New',Courier,monospace;font-size:18px;font-weight:700;letter-spacing:0.10em;color:#35383f;">#${shopifyOrderNumber}</p>
        <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td style="border-top:1px solid rgba(53,56,63,0.12);padding-top:14px;">
              <p style="margin:0 0 4px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:rgba(53,56,63,0.45);">Lieferzeit</p>
              <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:14px;font-weight:600;color:#35383f;">2–4 Werktage &mdash; diskret verpackt</p>
            </td>
          </tr>
        </table>
      `)}

      <p style="margin:24px 0 10px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:rgba(53,56,63,0.45);">Deine Artikel</p>
      ${lineItemsTable(lineItems, shippingPrice, grandTotal)}

      ${card(`
        <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td width="44" style="vertical-align:middle;padding-right:14px;">
              <div style="width:36px;height:36px;border-radius:50%;background:#c8d9be;text-align:center;line-height:36px;font-size:18px;">📦</div>
            </td>
            <td style="vertical-align:middle;">
              <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:13px;color:rgba(53,56,63,0.65);line-height:1.65;">
                Du erhältst eine <strong style="color:#35383f;">Versandbenachrichtigung</strong> per E-Mail sobald dein Paket unterwegs ist.
              </p>
            </td>
          </tr>
        </table>
      `)}

      ${ctaBtn("Zum Shop", `${SITE}/`)}

      <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:12px;color:rgba(53,56,63,0.40);text-align:center;margin-top:20px;line-height:1.6;">
        Fragen zur Bestellung? <a href="mailto:info@weedforfriends.com" style="color:rgba(53,56,63,0.55);text-decoration:none;">info@weedforfriends.com</a>
      </p>
      `
    ),
  })
}
