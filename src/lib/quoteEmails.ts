/**
 * HTML email templates for the "Customize Plan" quote calculator flow.
 *
 * - `renderQuoteConfirmationEmail()` — cinematic confirmation to the prospect,
 *   locale-aware, summarising the services they selected + the estimated total.
 * - `renderQuoteNotificationEmail()` — internal notification to the Zen team,
 *   with the full lead data plus a priced breakdown of the requested services.
 *
 * Inline-styled HTML (max-width 600–640px table layout) for cross-client
 * consistency. Figures are recomputed server-side before these are rendered.
 */

import { PRICE_BY_ID, SERVICE_NAMES, VAT_RATE } from "./quoteServices";

type QuoteData = {
  name: string;
  email: string;
  phone: string;
  location: string;
  rooms: number;
  bathrooms: number;
  amenities: string;
  locale?: "en" | "es";
  services: string[];
  subtotal: number;
  vat: number;
  total: number;
};

const PUBLIC_URL = "https://web-zenhospitality.vercel.app";
const HERO_PHOTO_URL = `${PUBLIC_URL}/zen/aerial-resort.jpg`;

const NAVY = "#042b59";
const CYAN = "#58c3e8";
const CREAM = "#eaf1f6";

const esc = (s: string | number) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const money = (n: number) =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const CONTACT = {
  whatsappPhone: "+506 8729 1276",
  whatsappHref: "https://wa.me/50687291276",
  emailAddress: "eduardoc@zen-hospitality.com",
  emailHref: "mailto:eduardoc@zen-hospitality.com",
  siteUrl: PUBLIC_URL,
};

/* ─────────────────────────── CONFIRMATION TO USER ─────────────────────────── */

type ConfirmationCopy = {
  subject: string;
  preheader: string;
  kicker: string;
  greeting: (firstName: string) => string;
  headline: string;
  italicHighlight: string;
  body1: string;
  planTitle: string;
  serviceCol: string;
  priceCol: string;
  subtotalLabel: string;
  vatLabel: string;
  totalLabel: string;
  estimateNote: string;
  body2: string;
  closingKicker: string;
  closingLine1: string;
  closingLine2: string;
  signature: string;
  signatureRole: string;
  whatsappLabel: string;
  emailLabel: string;
  footer: string;
};

const COPY: Record<"en" | "es", ConfirmationCopy> = {
  en: {
    subject: "Your Zen Hospitality plan request has been received",
    preheader:
      "We received your custom plan. An advisor will refine the details with you within 24 hours.",
    kicker: "Plan Request Received",
    greeting: (firstName) => `Dear ${firstName},`,
    headline: "Thank you.",
    italicHighlight: "Your custom plan is on its way.",
    body1:
      "We have received your custom plan request. A Zen Hospitality advisor will review your selection and reach out within the next 24 hours to refine the details and confirm your tailored proposal.",
    planTitle: "Your requested services",
    serviceCol: "Service",
    priceCol: "Price",
    subtotalLabel: "Subtotal",
    vatLabel: "VAT 13%",
    totalLabel: "Estimated total",
    estimateNote:
      "This estimate includes 13% VAT and is indicative — your advisor will confirm the final tailored figure.",
    body2:
      "From the warm light of the Pacific to the silence of dawn over the rainforest, every residence we manage carries a quiet promise: to be cared for as if it were our own.",
    closingKicker: "Soon, the conversation begins.",
    closingLine1: "Quiet precision.",
    closingLine2: "Measurable returns.",
    signature: "Eduardo C.",
    signatureRole: "Zen Hospitality",
    whatsappLabel: "WhatsApp",
    emailLabel: "Email",
    footer:
      "You are receiving this email because you requested a custom plan through web-zenhospitality.vercel.app. If this was not you, please disregard this message.",
  },
  es: {
    subject: "Hemos recibido su solicitud de plan personalizado — Zen Hospitality",
    preheader:
      "Recibimos su plan personalizado. Un asesor afinará los detalles con usted en un plazo de 24 horas.",
    kicker: "Solicitud de plan recibida",
    greeting: (firstName) => `Estimado ${firstName},`,
    headline: "Gracias.",
    italicHighlight: "Su plan personalizado está en camino.",
    body1:
      "Hemos recibido su solicitud de plan personalizado. Un asesor de Zen Hospitality revisará su selección y se pondrá en contacto con usted en las próximas 24 horas para afinar los detalles y confirmar su propuesta a la medida.",
    planTitle: "Servicios solicitados",
    serviceCol: "Servicio",
    priceCol: "Precio",
    subtotalLabel: "Subtotal",
    vatLabel: "IVA 13%",
    totalLabel: "Total estimado",
    estimateNote:
      "Este estimado incluye 13% de IVA y es indicativo — su asesor confirmará la cifra final a la medida.",
    body2:
      "Desde la luz cálida del Pacífico hasta el silencio del amanecer sobre la selva tropical, cada residencia que gestionamos lleva consigo una promesa silenciosa: ser cuidada como si fuera la nuestra.",
    closingKicker: "Pronto, comienza la conversación.",
    closingLine1: "Precisión silenciosa.",
    closingLine2: "Retornos medibles.",
    signature: "Eduardo C.",
    signatureRole: "Zen Hospitality",
    whatsappLabel: "WhatsApp",
    emailLabel: "Correo",
    footer:
      "Recibe este correo porque solicitó un plan personalizado a través de web-zenhospitality.vercel.app. Si no fue usted, por favor ignore este mensaje.",
  },
};

function serviceRowsHtml(services: string[], locale: "en" | "es") {
  const names = SERVICE_NAMES[locale] ?? SERVICE_NAMES.en;
  return services
    .map(
      (id) => `
      <tr>
        <td style="padding:12px 0; border-bottom:1px solid rgba(88,195,232,0.15); font-size:14px; color:${CREAM};">
          ${esc(names[id] ?? id)}
        </td>
        <td style="padding:12px 0; border-bottom:1px solid rgba(88,195,232,0.15); font-size:14px; color:${CREAM}; text-align:right; white-space:nowrap;">
          ${esc(money(PRICE_BY_ID[id] ?? 0))}
        </td>
      </tr>`
    )
    .join("");
}

export function renderQuoteConfirmationEmail(quote: QuoteData): {
  subject: string;
  html: string;
  text: string;
} {
  const locale = quote.locale === "es" ? "es" : "en";
  const copy = COPY[locale];
  const firstName = (quote.name || "").trim().split(/\s+/)[0] || quote.name;
  const names = SERVICE_NAMES[locale] ?? SERVICE_NAMES.en;

  const html = `<!doctype html>
<html lang="${locale}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="only light" />
    <meta name="supported-color-schemes" content="light" />
    <title>${esc(copy.subject)}</title>
    <style>
      @media (max-width: 620px) {
        .container { width: 100% !important; }
        .px-lg { padding-left: 28px !important; padding-right: 28px !important; }
        .hero-headline { font-size: 38px !important; line-height: 1.05 !important; }
        .hero-italic { font-size: 24px !important; }
      }
    </style>
  </head>
  <body style="margin:0; padding:0; background-color:#0a0a0c; font-family: 'Helvetica Neue', Arial, sans-serif; color:${CREAM};">
    <div style="display:none; visibility:hidden; opacity:0; color:transparent; height:0; width:0; overflow:hidden; mso-hide:all;">
      ${esc(copy.preheader)}
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0a0a0c;">
      <tr>
        <td align="center" style="padding: 48px 16px;">
          <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px; max-width:600px; background-color:${NAVY}; border:1px solid rgba(88,195,232,0.20); box-shadow: 0 24px 80px rgba(0,0,0,0.55);">

            <!-- Hero photo -->
            <tr>
              <td style="background-color:${NAVY}; padding:0;">
                <a href="${CONTACT.siteUrl}" target="_blank" style="text-decoration:none; display:block;">
                  <img src="${HERO_PHOTO_URL}" alt="" width="600" height="320"
                    style="display:block; width:100%; max-width:600px; height:auto; border:0; outline:none; text-decoration:none;" />
                </a>
              </td>
            </tr>

            <!-- Cyan hairline -->
            <tr>
              <td style="background-color:${NAVY}; padding:0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="height:1px; line-height:1px; font-size:0; background-color:${CYAN}; opacity:0.6;">&nbsp;</td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Main content -->
            <tr>
              <td class="px-lg" style="background-color:${NAVY}; padding:56px 56px 24px 56px;">
                <p style="margin:0 0 32px 0; font-size:11px; letter-spacing:4px; text-transform:uppercase; color:${CYAN}; font-weight:500;">
                  <span style="display:inline-block; width:32px; height:1px; background-color:${CYAN}; vertical-align:middle; margin-right:12px;">&nbsp;</span>
                  ${esc(copy.kicker)}
                </p>
                <p style="margin:0 0 24px 0; font-size:15px; line-height:1.6; color:${CREAM}; opacity:0.85;">
                  ${esc(copy.greeting(firstName))}
                </p>
                <h1 class="hero-headline" style="margin:0 0 12px 0; font-size:52px; line-height:1.02; letter-spacing:-0.018em; color:${CREAM}; font-weight:500;">
                  ${esc(copy.headline)}
                </h1>
                <p class="hero-italic" style="margin:0 0 32px 0; font-family: Georgia, 'Times New Roman', serif; font-style:italic; font-size:28px; line-height:1.2; color:${CYAN}; font-weight:400;">
                  ${esc(copy.italicHighlight)}
                </p>
                <p style="margin:0 0 28px 0; font-size:15px; line-height:1.7; color:${CREAM}; opacity:0.85;">
                  ${esc(copy.body1)}
                </p>
              </td>
            </tr>

            <!-- Plan summary -->
            <tr>
              <td class="px-lg" style="background-color:${NAVY}; padding:0 56px 8px 56px;">
                <p style="margin:0 0 8px 0; font-size:10px; letter-spacing:3px; text-transform:uppercase; color:${CYAN}; font-weight:500;">
                  ${esc(copy.planTitle)}
                </p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="padding:8px 0; border-bottom:1px solid rgba(88,195,232,0.30); font-size:10px; letter-spacing:2px; text-transform:uppercase; color:${CYAN}; opacity:0.7;">${esc(copy.serviceCol)}</td>
                    <td style="padding:8px 0; border-bottom:1px solid rgba(88,195,232,0.30); font-size:10px; letter-spacing:2px; text-transform:uppercase; color:${CYAN}; opacity:0.7; text-align:right;">${esc(copy.priceCol)}</td>
                  </tr>
                  ${serviceRowsHtml(quote.services, locale)}
                  <tr>
                    <td style="padding:14px 0 4px 0; font-size:13px; color:${CREAM}; opacity:0.75;">${esc(copy.subtotalLabel)}</td>
                    <td style="padding:14px 0 4px 0; font-size:13px; color:${CREAM}; opacity:0.75; text-align:right;">${esc(money(quote.subtotal))}</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0; font-size:13px; color:${CREAM}; opacity:0.75;">${esc(copy.vatLabel)}</td>
                    <td style="padding:4px 0; font-size:13px; color:${CREAM}; opacity:0.75; text-align:right;">${esc(money(quote.vat))}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 0 0 0; border-top:1px solid rgba(88,195,232,0.30); font-size:16px; color:${CREAM}; font-weight:600;">${esc(copy.totalLabel)}</td>
                    <td style="padding:12px 0 0 0; border-top:1px solid rgba(88,195,232,0.30); font-size:18px; color:${CYAN}; font-weight:600; text-align:right;">USD ${esc(money(quote.total))}</td>
                  </tr>
                </table>
                <p style="margin:14px 0 0 0; font-size:11px; line-height:1.5; color:${CREAM}; opacity:0.5;">
                  ${esc(copy.estimateNote)}
                </p>
              </td>
            </tr>

            <!-- Body 2 + closing -->
            <tr>
              <td class="px-lg" style="background-color:${NAVY}; padding:28px 56px 32px 56px;">
                <p style="margin:0 0 32px 0; font-size:15px; line-height:1.7; color:${CREAM}; opacity:0.7;">
                  ${esc(copy.body2)}
                </p>
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 32px 0; border-left:2px solid ${CYAN};">
                  <tr>
                    <td style="padding: 6px 0 6px 20px;">
                      <p style="margin:0 0 6px 0; font-size:10px; letter-spacing:3px; text-transform:uppercase; color:${CYAN}; font-weight:500;">
                        ${esc(copy.closingKicker)}
                      </p>
                      <p style="margin:0; font-family: Georgia, 'Times New Roman', serif; font-style:italic; font-size:18px; line-height:1.4; color:${CREAM};">
                        ${esc(copy.closingLine1)}<br />
                        ${esc(copy.closingLine2)}
                      </p>
                    </td>
                  </tr>
                </table>
                <p style="margin:0; font-size:14px; line-height:1.5; color:${CREAM};">${esc(copy.signature)}</p>
                <p style="margin:0; font-size:11px; line-height:1.5; letter-spacing:3px; text-transform:uppercase; color:${CYAN}; opacity:0.75;">${esc(copy.signatureRole)}</p>
              </td>
            </tr>

            <!-- Contact block -->
            <tr>
              <td class="px-lg" style="background-color:${NAVY}; padding: 0 56px 32px 56px; border-top:1px solid rgba(88,195,232,0.15);">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="padding:24px 0 18px 0;">
                      <p style="margin:0 0 6px 0; font-size:10px; letter-spacing:3px; text-transform:uppercase; color:${CYAN}; opacity:0.7; font-weight:500;">${esc(copy.whatsappLabel)}</p>
                      <a href="${CONTACT.whatsappHref}" target="_blank" style="font-size:15px; color:${CREAM}; text-decoration:none;">${CONTACT.whatsappPhone}</a>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p style="margin:0 0 6px 0; font-size:10px; letter-spacing:3px; text-transform:uppercase; color:${CYAN}; opacity:0.7; font-weight:500;">${esc(copy.emailLabel)}</p>
                      <a href="${CONTACT.emailHref}" target="_blank" style="font-size:15px; color:${CYAN}; text-decoration:none;">${CONTACT.emailAddress}</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td class="px-lg" style="background-color:${NAVY}; padding: 24px 56px 40px 56px; border-top:1px solid rgba(88,195,232,0.10);">
                <p style="margin:0; font-size:10px; line-height:1.6; color:${CREAM}; opacity:0.4;">${esc(copy.footer)}</p>
                <p style="margin:16px 0 0 0; font-size:10px; letter-spacing:3px; text-transform:uppercase; color:${CYAN}; opacity:0.55;">
                  © ${new Date().getFullYear()} Zen Hospitality · Costa Rica
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = [
    copy.kicker.toUpperCase(),
    "",
    copy.greeting(firstName),
    "",
    `${copy.headline} ${copy.italicHighlight}`,
    "",
    copy.body1,
    "",
    copy.planTitle.toUpperCase(),
    ...quote.services.map(
      (id) => `- ${names[id] ?? id}: ${money(PRICE_BY_ID[id] ?? 0)}`
    ),
    `${copy.subtotalLabel}: ${money(quote.subtotal)}`,
    `${copy.vatLabel}: ${money(quote.vat)}`,
    `${copy.totalLabel}: USD ${money(quote.total)}`,
    copy.estimateNote,
    "",
    copy.body2,
    "",
    copy.closingKicker,
    `${copy.closingLine1} ${copy.closingLine2}`,
    "",
    copy.signature,
    copy.signatureRole,
    "",
    `${copy.whatsappLabel}: ${CONTACT.whatsappPhone}`,
    `${copy.emailLabel}: ${CONTACT.emailAddress}`,
    "",
    copy.footer,
  ].join("\n");

  return { subject: copy.subject, html, text };
}

/* ─────────────────────────── INTERNAL NOTIFICATION ─────────────────────────── */

export function renderQuoteNotificationEmail(quote: QuoteData): {
  subject: string;
  html: string;
  text: string;
} {
  const locale = quote.locale === "es" ? "es" : "en";
  const names = SERVICE_NAMES.en;
  const subject = `New Zen quote: ${quote.name} · USD ${money(quote.total)}`;

  const serviceRows = quote.services
    .map(
      (id) => `
      <tr>
        <td style="padding:12px 32px; border-bottom:1px solid rgba(4,43,89,0.08); font-size:14px; color:${NAVY};">${esc(names[id] ?? id)}</td>
        <td style="padding:12px 32px 12px 0; border-bottom:1px solid rgba(4,43,89,0.08); font-size:14px; color:${NAVY}; text-align:right; white-space:nowrap;">${esc(money(PRICE_BY_ID[id] ?? 0))}</td>
      </tr>`
    )
    .join("");

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${esc(subject)}</title>
  </head>
  <body style="margin:0; padding:24px; background-color:${CREAM}; font-family: 'Helvetica Neue', Arial, sans-serif; color:${NAVY};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:640px; margin:0 auto; background-color:#ffffff; border:1px solid rgba(4,43,89,0.12);">
      <tr>
        <td style="background-color:${NAVY}; padding: 24px 32px;">
          <p style="margin:0; font-size:10px; letter-spacing:4px; text-transform:uppercase; color:${CYAN}; font-weight:500;">
            New Quote · Customize Plan
          </p>
          <h1 style="margin:8px 0 0 0; font-size:26px; line-height:1.2; color:${CREAM}; font-weight:500;">${esc(quote.name)}</h1>
          <p style="margin:4px 0 0 0; font-size:13px; color:${CREAM}; opacity:0.7;">
            ${esc(quote.location)} · Submitted in ${locale.toUpperCase()} · Estimated USD ${esc(money(quote.total))}
          </p>
        </td>
      </tr>

      <!-- Lead data -->
      <tr>
        <td style="padding:0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;">
            ${[
              ["Name", quote.name],
              ["Email", quote.email],
              ["Phone", quote.phone],
              ["Property location", quote.location],
              ["Rooms", String(quote.rooms)],
              ["Bathrooms", String(quote.bathrooms)],
              ["Locale", locale],
            ]
              .map(
                ([label, val]) => `
              <tr>
                <td style="padding:14px 32px; border-bottom:1px solid rgba(4,43,89,0.08); width:160px;">
                  <span style="font-size:10px; letter-spacing:3px; text-transform:uppercase; color:${CYAN}; font-weight:500;">${esc(label)}</span>
                </td>
                <td style="padding:14px 32px 14px 0; border-bottom:1px solid rgba(4,43,89,0.08); font-size:14px; color:${NAVY};">
                  ${esc(val)}
                </td>
              </tr>`
              )
              .join("")}
            <tr>
              <td style="padding:14px 32px; vertical-align:top; width:160px;">
                <span style="font-size:10px; letter-spacing:3px; text-transform:uppercase; color:${CYAN}; font-weight:500;">Amenities</span>
              </td>
              <td style="padding:14px 32px 14px 0; font-size:14px; color:${NAVY}; line-height:1.6; white-space:pre-wrap;">${esc(quote.amenities)}</td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Requested services -->
      <tr>
        <td style="padding:24px 0 0 0; background-color:#ffffff; border-top:1px solid rgba(4,43,89,0.08);">
          <p style="margin:0 0 4px 32px; font-size:12px; letter-spacing:2px; text-transform:uppercase; color:${CYAN}; font-weight:500;">
            Requested services
          </p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;">
            ${serviceRows}
            <tr>
              <td style="padding:14px 32px 4px 32px; font-size:13px; color:${NAVY};">Subtotal</td>
              <td style="padding:14px 32px 4px 0; font-size:13px; color:${NAVY}; text-align:right;">${esc(money(quote.subtotal))}</td>
            </tr>
            <tr>
              <td style="padding:4px 32px; font-size:13px; color:${NAVY};">VAT (${Math.round(VAT_RATE * 100)}%)</td>
              <td style="padding:4px 32px 4px 0; font-size:13px; color:${NAVY}; text-align:right;">${esc(money(quote.vat))}</td>
            </tr>
            <tr>
              <td style="padding:10px 32px 18px 32px; font-size:15px; color:${NAVY}; font-weight:700; border-top:1px solid rgba(4,43,89,0.15);">Total</td>
              <td style="padding:10px 32px 18px 0; font-size:15px; color:${NAVY}; font-weight:700; text-align:right; border-top:1px solid rgba(4,43,89,0.15);">USD ${esc(money(quote.total))}</td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Quick reply -->
      <tr>
        <td style="padding:24px 32px 32px 32px; background-color:#ffffff; border-top:1px solid rgba(4,43,89,0.08);">
          <p style="margin:0 0 12px 0; font-size:12px; letter-spacing:2px; text-transform:uppercase; color:${CYAN}; font-weight:500;">Quick reply</p>
          <p style="margin:0 0 8px 0; font-size:14px; color:${NAVY};">
            <a href="mailto:${esc(quote.email)}" style="color:${NAVY}; text-decoration:underline;">Reply by email</a>
          </p>
          <p style="margin:0; font-size:14px; color:${NAVY};">
            <a href="https://wa.me/${encodeURIComponent(quote.phone.replace(/\D/g, ""))}" style="color:${NAVY}; text-decoration:underline;">Open WhatsApp chat (${esc(quote.phone)})</a>
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = [
    `NEW ZEN QUOTE (Customize Plan)`,
    ``,
    `Name: ${quote.name}`,
    `Email: ${quote.email}`,
    `Phone: ${quote.phone}`,
    `Property location: ${quote.location}`,
    `Rooms: ${quote.rooms}`,
    `Bathrooms: ${quote.bathrooms}`,
    `Locale: ${locale}`,
    ``,
    `Amenities:`,
    `${quote.amenities}`,
    ``,
    `REQUESTED SERVICES:`,
    ...quote.services.map((id) => `- ${names[id] ?? id}: ${money(PRICE_BY_ID[id] ?? 0)}`),
    `Subtotal: ${money(quote.subtotal)}`,
    `VAT ${Math.round(VAT_RATE * 100)}%: ${money(quote.vat)}`,
    `Total: USD ${money(quote.total)}`,
    ``,
    `Reply: mailto:${quote.email}`,
    `WhatsApp: https://wa.me/${quote.phone.replace(/\D/g, "")}`,
  ].join("\n");

  return { subject, html, text };
}
