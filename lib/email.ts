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
                width="120" height="120" alt="WEEDFORFRIENDS"
                style="display:block;margin:0 auto;width:58px;height:58px;" />
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

// ── Welcome ───────────────────────────────────────────────────────────────────

export async function sendWelcome(params: { email: string; firstName?: string }) {
  const { email, firstName } = params
  const name = firstName ? ` ${firstName}` : ""

  return getResend().emails.send({
    from: FROM,
    to: [email],
    subject: "Willkommen bei WEEDFORFRIENDS",
    html: emailBase(
      `Hey${name}, schön dass du dabei bist.`,
      `
      <div style="text-align:center;margin-bottom:24px;">
        <div style="display:inline-block;width:56px;height:56px;border-radius:50%;background:#35383f;line-height:56px;text-align:center;">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#eddc8c" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-top:-2px;">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
        </div>
      </div>

      <h1 style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:26px;font-weight:900;text-transform:uppercase;letter-spacing:-0.02em;color:#35383f;margin:0 0 12px;line-height:1.1;text-align:center;">
        Willkommen<br/>bei WFF.
      </h1>
      <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:15px;color:rgba(53,56,63,0.65);line-height:1.75;margin:16px 0 28px;text-align:center;">
        Hey${name}, schön dass du dabei bist. Entdecke unser Sortiment an Premium-CBD-Produkten — diskret, sicher und schnell geliefert.
      </p>

      ${card(`
        <p style="margin:0 0 6px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:rgba(53,56,63,0.45);">Nächster Schritt</p>
        <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:14px;color:#35383f;line-height:1.75;">
          Verifiziere kurz dein Alter — einmalig, dauert nur wenige Sekunden. Danach kannst du sofort bestellen.
        </p>
      `)}

      ${ctaBtn("Alter verifizieren & shoppen", `${SITE}/account`)}

      <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:12px;color:rgba(53,56,63,0.40);text-align:center;margin-top:20px;line-height:1.6;">
        Fragen? <a href="mailto:info@weedforfriends.com" style="color:rgba(53,56,63,0.55);text-decoration:none;">info@weedforfriends.com</a>
      </p>
      `
    ),
  })
}

// ── Shipping Confirmation ─────────────────────────────────────────────────────

export async function sendShippingConfirmation(params: {
  email: string
  firstName: string
  orderRef: string
  trackingNumber?: string
  trackingUrl?: string
  carrier?: string
  lineItems: OrderItem[]
  shippingAddress: { first_name: string; last_name: string; address1: string; address2?: string; city: string; zip: string; country: string }
}) {
  const { email, firstName, orderRef, trackingNumber, trackingUrl, carrier, lineItems, shippingAddress } = params
  const addr = shippingAddress
  const hasTracking = !!(trackingNumber || trackingUrl)

  return getResend().emails.send({
    from: FROM,
    to: [email],
    subject: `Dein Paket ist unterwegs #${orderRef} — WEEDFORFRIENDS`,
    html: emailBase(
      `Dein Paket ist auf dem Weg zu dir, ${firstName}!`,
      `
      <div style="text-align:center;margin-bottom:24px;">
        <div style="display:inline-block;width:56px;height:56px;border-radius:50%;background:#a0ba87;line-height:56px;text-align:center;">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-top:-2px;">
            <rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
          </svg>
        </div>
      </div>

      <h1 style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:26px;font-weight:900;text-transform:uppercase;letter-spacing:-0.02em;color:#35383f;margin:0 0 12px;line-height:1.1;text-align:center;">
        Auf dem<br/>Weg zu dir.
      </h1>
      <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:15px;color:rgba(53,56,63,0.65);line-height:1.75;margin:16px 0 28px;text-align:center;">
        Hey ${firstName}, dein Paket wurde übergeben und ist jetzt unterwegs. Erwarte deine Lieferung in 1–2 Werktagen.
      </p>

      ${card(`
        <p style="margin:0 0 4px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:rgba(53,56,63,0.45);">Bestellreferenz</p>
        <p style="margin:0 0 ${hasTracking ? "16px" : "0"};font-family:'Courier New',Courier,monospace;font-size:18px;font-weight:700;letter-spacing:0.10em;color:#35383f;">#${orderRef}</p>
        ${hasTracking ? `
        <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td style="border-top:1px solid rgba(53,56,63,0.12);padding-top:14px;">
              ${carrier ? `<p style="margin:0 0 4px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:rgba(53,56,63,0.45);">Versanddienstleister</p>
              <p style="margin:0 0 12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:14px;font-weight:600;color:#35383f;">${carrier}</p>` : ""}
              ${trackingNumber ? `<p style="margin:0 0 4px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:rgba(53,56,63,0.45);">Tracking-Nummer</p>
              <p style="margin:0;font-family:'Courier New',Courier,monospace;font-size:14px;font-weight:700;letter-spacing:0.08em;color:#35383f;">${trackingNumber}</p>` : ""}
            </td>
          </tr>
        </table>` : ""}
      `)}

      ${hasTracking && trackingUrl ? ctaBtn("Sendung verfolgen →", trackingUrl) : ""}

      <p style="margin:24px 0 10px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:rgba(53,56,63,0.45);">Lieferadresse</p>
      ${card(`
        <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:14px;color:#35383f;line-height:1.85;">
          ${addr.first_name} ${addr.last_name}<br/>
          ${addr.address1}${addr.address2 ? "<br/>" + addr.address2 : ""}<br/>
          ${addr.zip} ${addr.city}<br/>
          ${addr.country}
        </p>
      `)}

      <p style="margin:20px 0 10px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:rgba(53,56,63,0.45);">Deine Artikel</p>
      ${card(`
        <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
          ${lineItems.map(i => `<tr>
            <td style="padding:8px 0;border-bottom:1px solid rgba(53,56,63,0.08);">
              <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:13px;font-weight:600;color:#35383f;">${i.title}</p>
              ${i.variant_title ? `<p style="margin:1px 0 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(53,56,63,0.40);">${i.variant_title}</p>` : ""}
            </td>
            <td style="padding:8px 0;border-bottom:1px solid rgba(53,56,63,0.08);text-align:right;white-space:nowrap;vertical-align:top;">
              <span style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:12px;color:rgba(53,56,63,0.45);">×${i.quantity}</span>
            </td>
          </tr>`).join("")}
        </table>
      `)}

      ${!hasTracking || !trackingUrl ? ctaBtn("Zum Shop", `${SITE}/`) : ""}

      <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:12px;color:rgba(53,56,63,0.40);text-align:center;margin-top:20px;line-height:1.6;">
        Fragen zur Sendung? <a href="mailto:info@weedforfriends.com" style="color:rgba(53,56,63,0.55);text-decoration:none;">info@weedforfriends.com</a>
      </p>
      `
    ),
  })
}

// ── Cancellation Confirmation ─────────────────────────────────────────────────

export async function sendCancellationConfirmation(params: {
  email: string
  firstName: string
  orderRef: string
  reason?: string
  refundAmount?: string
}) {
  const { email, firstName, orderRef, reason, refundAmount } = params

  return getResend().emails.send({
    from: FROM,
    to: [email],
    subject: `Bestellung storniert #${orderRef} — WEEDFORFRIENDS`,
    html: emailBase(
      `Deine Bestellung #${orderRef} wurde storniert.`,
      `
      <div style="text-align:center;margin-bottom:24px;">
        <div style="display:inline-block;width:56px;height:56px;border-radius:50%;background:rgba(53,56,63,0.10);line-height:56px;text-align:center;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#35383f" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-top:-2px;">
            <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        </div>
      </div>

      <h1 style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:26px;font-weight:900;text-transform:uppercase;letter-spacing:-0.02em;color:#35383f;margin:0 0 12px;line-height:1.1;text-align:center;">
        Bestellung<br/>storniert.
      </h1>
      <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:15px;color:rgba(53,56,63,0.65);line-height:1.75;margin:16px 0 28px;text-align:center;">
        Hey ${firstName}, deine Bestellung wurde erfolgreich storniert.${refundAmount ? " Die Rückerstattung ist auf dem Weg." : ""}
      </p>

      ${card(`
        <p style="margin:0 0 4px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:rgba(53,56,63,0.45);">Stornierte Bestellung</p>
        <p style="margin:0 0 ${reason || refundAmount ? "16px" : "0"};font-family:'Courier New',Courier,monospace;font-size:18px;font-weight:700;letter-spacing:0.10em;color:#35383f;">#${orderRef}</p>
        ${reason || refundAmount ? `
        <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td style="border-top:1px solid rgba(53,56,63,0.12);padding-top:14px;">
              ${reason ? `<p style="margin:0 0 4px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:rgba(53,56,63,0.45);">Grund</p>
              <p style="margin:0 0 ${refundAmount ? "14px" : "0"};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:14px;color:#35383f;">${reason}</p>` : ""}
              ${refundAmount ? `<p style="margin:0 0 4px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:rgba(53,56,63,0.45);">Rückerstattung</p>
              <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:16px;font-weight:700;color:#a0ba87;">${refundAmount} €</p>` : ""}
            </td>
          </tr>
        </table>` : ""}
      `)}

      ${refundAmount ? card(`
        <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:13px;color:rgba(53,56,63,0.65);line-height:1.65;">
          Die Rückerstattung von <strong style="color:#35383f;">${refundAmount} €</strong> wird innerhalb von <strong style="color:#35383f;">5–10 Werktagen</strong> auf deinem ursprünglichen Zahlungsmittel gutgeschrieben.
        </p>
      `) : ""}

      ${ctaBtn("Zurück zum Shop", `${SITE}/`)}

      <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:12px;color:rgba(53,56,63,0.40);text-align:center;margin-top:20px;line-height:1.6;">
        Fragen zur Stornierung? <a href="mailto:info@weedforfriends.com" style="color:rgba(53,56,63,0.55);text-decoration:none;">info@weedforfriends.com</a>
      </p>
      `
    ),
  })
}

// ── Newsletter Confirmation ───────────────────────────────────────────────────

export async function sendNewsletterConfirmation(params: { email: string; firstName?: string }) {
  const { email, firstName } = params
  const name = firstName ? ` ${firstName}` : ""

  return getResend().emails.send({
    from: FROM,
    to: [email],
    subject: "Newsletter-Anmeldung bestätigt — WEEDFORFRIENDS",
    html: emailBase(
      `Du bist dabei${name} — willkommen im WFF-Newsletter.`,
      `
      <div style="text-align:center;margin-bottom:24px;">
        <div style="display:inline-block;width:56px;height:56px;border-radius:50%;background:#eddc8c;line-height:56px;text-align:center;">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#35383f" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-top:-2px;">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
          </svg>
        </div>
      </div>

      <h1 style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:26px;font-weight:900;text-transform:uppercase;letter-spacing:-0.02em;color:#35383f;margin:0 0 12px;line-height:1.1;text-align:center;">
        Du bist<br/>dabei.
      </h1>
      <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:15px;color:rgba(53,56,63,0.65);line-height:1.75;margin:16px 0 28px;text-align:center;">
        Hey${name}, deine Newsletter-Anmeldung ist bestätigt. Du bekommst als Erstes Neuheiten, exklusive Angebote und Einblicke direkt aus der WFF-Welt.
      </p>

      ${card(`
        <p style="margin:0 0 6px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:rgba(53,56,63,0.45);">Was dich erwartet</p>
        <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
          <tr><td style="padding:6px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:13px;color:#35383f;line-height:1.6;">🌿&nbsp; Neue Produkte &amp; Sorten als Erste</td></tr>
          <tr><td style="padding:6px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:13px;color:#35383f;line-height:1.6;">🎁&nbsp; Exklusive Rabatte &amp; Aktionen</td></tr>
          <tr><td style="padding:6px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:13px;color:#35383f;line-height:1.6;">📦&nbsp; Hinter-den-Kulissen-Einblicke</td></tr>
        </table>
      `)}

      ${ctaBtn("Zum Shop", `${SITE}/`)}

      <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:11px;color:rgba(53,56,63,0.30);text-align:center;margin-top:20px;line-height:1.6;">
        Du kannst dich jederzeit abmelden. Kein Spam, versprochen.
      </p>
      `
    ),
  })
}

// ── B2B Confirmation (to customer) ───────────────────────────────────────────

export async function sendB2BConfirmation(params: {
  email: string
  contact: string
  company: string
}) {
  const { email, contact, company } = params

  return getResend().emails.send({
    from: FROM,
    to: [email],
    subject: `B2B-Anfrage erhalten — WEEDFORFRIENDS`,
    html: emailBase(
      `Danke ${contact}, deine B2B-Anfrage ist bei uns eingegangen.`,
      `
      <div style="text-align:center;margin-bottom:24px;">
        <div style="display:inline-block;width:56px;height:56px;border-radius:50%;background:#eddc8c;line-height:56px;text-align:center;">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#35383f" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-top:-2px;">
            <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
          </svg>
        </div>
      </div>

      <h1 style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:26px;font-weight:900;text-transform:uppercase;letter-spacing:-0.02em;color:#35383f;margin:0 0 12px;line-height:1.1;text-align:center;">
        Anfrage<br/>eingegangen.
      </h1>
      <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:15px;color:rgba(53,56,63,0.65);line-height:1.75;margin:16px 0 28px;text-align:center;">
        Hey ${contact}, deine B2B-Anfrage für <strong style="color:#35383f;">${company}</strong> ist bei uns eingegangen. Unser Team meldet sich innerhalb von 24 Stunden bei dir.
      </p>

      ${card(`
        <p style="margin:0 0 6px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:rgba(53,56,63,0.45);">Was als Nächstes passiert</p>
        <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
          <tr><td style="padding:7px 0;border-bottom:1px solid rgba(53,56,63,0.08);">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr>
              <td width="28" style="vertical-align:top;padding-top:1px;"><span style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.1em;color:#eddc8c;background:#35383f;padding:2px 6px;border-radius:4px;">01</span></td>
              <td style="padding-left:10px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:13px;color:#35383f;line-height:1.6;">Unser B2B-Team prüft deine Anfrage</td>
            </tr></table>
          </td></tr>
          <tr><td style="padding:7px 0;border-bottom:1px solid rgba(53,56,63,0.08);">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr>
              <td width="28" style="vertical-align:top;padding-top:1px;"><span style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.1em;color:#eddc8c;background:#35383f;padding:2px 6px;border-radius:4px;">02</span></td>
              <td style="padding-left:10px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:13px;color:#35383f;line-height:1.6;">Wir melden uns innerhalb von 24 Stunden</td>
            </tr></table>
          </td></tr>
          <tr><td style="padding:7px 0;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr>
              <td width="28" style="vertical-align:top;padding-top:1px;"><span style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.1em;color:#eddc8c;background:#35383f;padding:2px 6px;border-radius:4px;">03</span></td>
              <td style="padding-left:10px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:13px;color:#35383f;line-height:1.6;">Individuelles Angebot &amp; Konditionen</td>
            </tr></table>
          </td></tr>
        </table>
      `)}

      ${ctaBtn("Mehr über WFF B2B", `${SITE}/b2b`)}

      <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:12px;color:rgba(53,56,63,0.40);text-align:center;margin-top:20px;line-height:1.6;">
        Direktkontakt: <a href="mailto:info@weedforfriends.com" style="color:rgba(53,56,63,0.55);text-decoration:none;">info@weedforfriends.com</a>
      </p>
      `
    ),
  })
}

// ── B2B Internal Notification ─────────────────────────────────────────────────

type B2BInternalParams = {
  company: string; contact: string; email: string; phone?: string
  business_type?: string; volume?: string; message?: string; vat?: string
}

export async function sendB2BInternalNotification(params: B2BInternalParams) {
  const { company, contact, email, phone, business_type, volume, message, vat } = params
  const rows: [string, string][] = [
    ["Unternehmen", company],
    ["Ansprechpartner", contact],
    ["E-Mail", email],
    ...(phone        ? [["Telefon",          phone]        as [string,string]] : []),
    ...(vat          ? [["UID / USt-IdNr.",  vat]          as [string,string]] : []),
    ...(business_type? [["Unternehmenstyp",  business_type]as [string,string]] : []),
    ...(volume       ? [["Monatsmenge",      volume]       as [string,string]] : []),
  ]

  return getResend().emails.send({
    from: FROM,
    to: ["info@weedforfriends.com"],
    replyTo: email,
    subject: `Neue B2B-Anfrage: ${company}`,
    html: emailBase(
      `Neue B2B-Anfrage von ${company}`,
      `
      <div style="text-align:center;margin-bottom:24px;">
        <div style="display:inline-block;width:56px;height:56px;border-radius:50%;background:#35383f;line-height:56px;text-align:center;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#eddc8c" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-top:-2px;">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
          </svg>
        </div>
      </div>

      <h1 style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:26px;font-weight:900;text-transform:uppercase;letter-spacing:-0.02em;color:#35383f;margin:0 0 12px;line-height:1.1;text-align:center;">
        Neue B2B-Anfrage.
      </h1>
      <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:15px;color:rgba(53,56,63,0.65);line-height:1.75;margin:16px 0 28px;text-align:center;">
        <strong style="color:#35383f;">${company}</strong> hat eine B2B-Partnerschaftsanfrage gestellt.
      </p>

      ${card(`
        <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
          ${rows.map(([k, v]) => `<tr>
            <td style="padding:9px 0;border-bottom:1px solid rgba(53,56,63,0.08);width:42%;vertical-align:top;">
              <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:rgba(53,56,63,0.45);">${k}</p>
            </td>
            <td style="padding:9px 0;border-bottom:1px solid rgba(53,56,63,0.08);vertical-align:top;">
              <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:13px;color:#35383f;">${v}</p>
            </td>
          </tr>`).join("")}
        </table>
      `)}

      ${message ? `
      <p style="margin:20px 0 10px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:rgba(53,56,63,0.45);">Nachricht</p>
      ${card(`<p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:14px;color:#35383f;line-height:1.75;">${message}</p>`)}
      ` : ""}

      ${ctaBtn(`${contact} antworten →`, `mailto:${email}`)}
      `
    ),
  })
}

// ── Refund Confirmation ───────────────────────────────────────────────────────

export async function sendRefundConfirmation(params: {
  email: string
  firstName: string
  orderRef: string
  refundAmount: string
}) {
  const { email, firstName, orderRef, refundAmount } = params

  return getResend().emails.send({
    from: FROM,
    to: [email],
    subject: `Rückerstattung veranlasst #${orderRef} — WEEDFORFRIENDS`,
    html: emailBase(
      `Deine Rückerstattung von ${refundAmount} € ist auf dem Weg.`,
      `
      <div style="text-align:center;margin-bottom:24px;">
        <div style="display:inline-block;width:56px;height:56px;border-radius:50%;background:#a0ba87;line-height:56px;text-align:center;">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-top:-2px;">
            <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>
          </svg>
        </div>
      </div>

      <h1 style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:26px;font-weight:900;text-transform:uppercase;letter-spacing:-0.02em;color:#35383f;margin:0 0 12px;line-height:1.1;text-align:center;">
        Rückerstattung<br/>veranlasst.
      </h1>
      <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:15px;color:rgba(53,56,63,0.65);line-height:1.75;margin:16px 0 28px;text-align:center;">
        Hey ${firstName}, deine Rückerstattung wurde veranlasst und ist auf dem Weg zu dir.
      </p>

      ${card(`
        <p style="margin:0 0 4px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:rgba(53,56,63,0.45);">Bestellreferenz</p>
        <p style="margin:0 0 16px;font-family:'Courier New',Courier,monospace;font-size:18px;font-weight:700;letter-spacing:0.10em;color:#35383f;">#${orderRef}</p>
        <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td style="border-top:1px solid rgba(53,56,63,0.12);padding-top:14px;">
              <p style="margin:0 0 4px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:rgba(53,56,63,0.45);">Rückerstattungsbetrag</p>
              <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:22px;font-weight:900;letter-spacing:-0.02em;color:#a0ba87;">${refundAmount} €</p>
            </td>
          </tr>
        </table>
      `)}

      ${card(`
        <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:13px;color:rgba(53,56,63,0.65);line-height:1.65;">
          Die Rückerstattung erscheint innerhalb von <strong style="color:#35383f;">5–10 Werktagen</strong> auf deinem ursprünglichen Zahlungsmittel. Die genaue Laufzeit hängt von deiner Bank ab.
        </p>
      `)}

      ${ctaBtn("Zurück zum Shop", `${SITE}/`)}

      <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:12px;color:rgba(53,56,63,0.40);text-align:center;margin-top:20px;line-height:1.6;">
        Fragen? <a href="mailto:info@weedforfriends.com" style="color:rgba(53,56,63,0.55);text-decoration:none;">info@weedforfriends.com</a>
      </p>
      `
    ),
  })
}
