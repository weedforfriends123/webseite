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
            <td style="background:#35383f;padding:28px 40px 0;border-radius:20px 20px 0 0;">
              <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:24px;">
                    <!-- Logo wordmark as inline SVG fallback text for Outlook -->
                    <!--[if mso]><p style="font-family:Arial;font-size:18px;font-weight:900;text-transform:uppercase;letter-spacing:4px;color:#e8e4dc;text-align:center;margin:0;">WEEDFORFRIENDS</p><![endif]-->
                    <!--[if !mso]><!-->
                    <img src="${SITE}/branding/logo-wordmark-figma.svg"
                      width="180" height="49" alt="WEEDFORFRIENDS"
                      style="display:block;margin:0 auto;width:180px;height:auto;max-width:180px;" />
                    <!--<![endif]-->
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Yellow accent line -->
          <tr>
            <td style="background:#35383f;padding:0 40px;">
              <div style="height:2px;background:#eddc8c;border-radius:2px;"></div>
            </td>
          </tr>

          <!-- Spacer under header -->
          <tr>
            <td style="background:#35383f;height:28px;border-radius:0;"></td>
          </tr>

          <!-- ── BODY ── -->
          <tr>
            <td style="background:#bcc0ca;padding:32px 24px 40px;">
              ${body}
            </td>
          </tr>

          <!-- ── FOOTER ── -->
          <tr>
            <td style="background:#bcc0ca;padding:0 24px 40px;">
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

function card(content: string, noPad = false) {
  return `<div style="background:rgba(255,255,255,0.55);border-radius:16px;border:1px solid rgba(255,255,255,0.75);${noPad ? "" : "padding:24px 28px;"}overflow:hidden;">
    ${content}
  </div>`
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

function label(text: string) {
  return `<p style="margin:0 0 4px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:rgba(53,56,63,0.45);">${text}</p>`
}

type OrderItem = { title: string; variant_title?: string; price: string; quantity: number }

function lineItemsTable(items: OrderItem[], shippingPrice: string, grandTotal: string) {
  const rows = items.map(i => {
    const lineTotal = (parseFloat(i.price) * i.quantity).toFixed(2).replace(".", ",")
    return `<tr>
      <td style="padding:12px 28px;border-bottom:1px solid rgba(53,56,63,0.07);">
        <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:14px;font-weight:600;color:#35383f;">${i.title}</p>
        ${i.variant_title ? `<p style="margin:2px 0 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(53,56,63,0.45);">${i.variant_title}</p>` : ""}
      </td>
      <td style="padding:12px 28px;border-bottom:1px solid rgba(53,56,63,0.07);text-align:right;white-space:nowrap;">
        <span style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:13px;color:rgba(53,56,63,0.45);">×${i.quantity}&nbsp;&nbsp;</span>
        <span style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:14px;font-weight:700;color:#35383f;">${lineTotal}&nbsp;€</span>
      </td>
    </tr>`
  }).join("")

  const ship = parseFloat(shippingPrice) === 0
    ? `<span style="color:#a0ba87;font-weight:700;">Gratis</span>`
    : `${parseFloat(shippingPrice).toFixed(2).replace(".", ",")} €`

  return card(`
    <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
      ${rows}
      <tr>
        <td style="padding:12px 28px;border-bottom:1px solid rgba(53,56,63,0.07);">
          <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:13px;color:rgba(53,56,63,0.55);">Versand</p>
        </td>
        <td style="padding:12px 28px;border-bottom:1px solid rgba(53,56,63,0.07);text-align:right;">
          <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:13px;">${ship}</p>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 28px;">
          <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:12px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:rgba(53,56,63,0.50);">Gesamt</p>
        </td>
        <td style="padding:16px 28px;text-align:right;">
          <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:22px;font-weight:900;letter-spacing:-0.02em;color:#35383f;">${parseFloat(grandTotal).toFixed(2).replace(".", ",")} €</p>
        </td>
      </tr>
    </table>
  `, true)
}

// ── Existing emails ───────────────────────────────────────────────────────────

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
      `<div style="text-align:center;margin-bottom:20px;">
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
    subject: `Bestellung erhalten #${orderRef} — WEEDFORFRIENDS`,
    html: emailBase(
      `Danke ${firstName}, wir haben deine Bestellung erhalten.`,
      `
      <h1 style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:28px;font-weight:900;text-transform:uppercase;letter-spacing:-0.03em;color:#35383f;margin:0 0 8px;line-height:1.05;">
        Bestellung<br/>erhalten.
      </h1>
      <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:15px;color:rgba(53,56,63,0.65);line-height:1.75;margin:14px 0 28px;">
        Hey ${firstName}, wir haben deine Bestellung erhalten und bereiten die Zahlung vor. Du erhältst eine weitere E-Mail sobald deine Zahlung bestätigt wurde.
      </p>

      ${label("Bestellreferenz")}
      <p style="font-family:'Courier New',Courier,monospace;font-size:15px;font-weight:700;letter-spacing:0.1em;color:#35383f;margin:0 0 24px;background:rgba(53,56,63,0.07);display:inline-block;padding:8px 14px;border-radius:8px;">#${orderRef}</p>

      <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:rgba(53,56,63,0.45);margin:0 0 8px;">Deine Artikel</p>
      ${lineItemsTable(lineItems, shippingPrice, grandTotal)}

      <div style="margin-top:20px;">
        ${card(`
          ${label("Lieferadresse")}
          <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:14px;color:#35383f;line-height:1.8;margin:6px 0 0;">
            ${addr.first_name} ${addr.last_name}<br/>
            ${addr.address1}${addr.address2 ? "<br/>" + addr.address2 : ""}<br/>
            ${addr.zip} ${addr.city}<br/>
            ${addr.country}
          </p>
        `)}
      </div>

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
        <div style="display:inline-block;width:64px;height:64px;border-radius:50%;background:#a0ba87;line-height:64px;text-align:center;">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-top:-2px;"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
      </div>

      <h1 style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:28px;font-weight:900;text-transform:uppercase;letter-spacing:-0.03em;color:#35383f;margin:0 0 8px;line-height:1.05;text-align:center;">
        Zahlung<br/>bestätigt.
      </h1>
      <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:15px;color:rgba(53,56,63,0.65);line-height:1.75;margin:14px 0 28px;text-align:center;">
        Hey ${firstName}, deine Zahlung ist eingegangen. Wir bearbeiten deine Bestellung und schicken sie so schnell wie möglich raus.
      </p>

      ${card(`
        <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:0 0 12px;">
              ${label("Shopify Bestellnummer")}
              <p style="font-family:'Courier New',Courier,monospace;font-size:18px;font-weight:700;letter-spacing:0.06em;color:#35383f;margin:4px 0 0;">#${shopifyOrderNumber}</p>
            </td>
          </tr>
          <tr>
            <td style="padding-top:16px;border-top:1px solid rgba(53,56,63,0.10);">
              ${label("Lieferzeit")}
              <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:14px;color:#35383f;margin:4px 0 0;font-weight:600;">2–4 Werktage &mdash; diskret verpackt</p>
            </td>
          </tr>
        </table>
      `)}

      <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:rgba(53,56,63,0.45);margin:24px 0 8px;">Deine Artikel</p>
      ${lineItemsTable(lineItems, shippingPrice, grandTotal)}

      ${card(`
        <div style="display:flex;align-items:center;gap:12px;">
          <div style="width:36px;height:36px;border-radius:50%;background:rgba(160,186,135,0.18);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:18px;text-align:center;line-height:36px;">📦</div>
          <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:13px;color:rgba(53,56,63,0.65);line-height:1.65;">
            Du erhältst eine <strong style="color:#35383f;">Versandbenachrichtigung</strong> per E-Mail sobald dein Paket unterwegs ist.
          </p>
        </div>
      `)}

      ${ctaBtn("Zum Shop", `${SITE}/`)}

      <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:12px;color:rgba(53,56,63,0.40);text-align:center;margin-top:20px;line-height:1.6;">
        Fragen zur Bestellung? <a href="mailto:info@weedforfriends.com" style="color:rgba(53,56,63,0.55);text-decoration:none;">info@weedforfriends.com</a>
      </p>
      `
    ),
  })
}
