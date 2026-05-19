/**
 * HTML email templates for the lead form flow.
 *
 * - `renderConfirmationEmail()` — cinematic confirmation sent to the
 *    prospect right after they submit the contact form. Locale-aware.
 * - `renderLeadNotificationEmail()` — internal notification with the
 *    full lead data, sent to the Zen Hospitality team.
 *
 * Inline-styled HTML so it renders consistently across Gmail / Apple Mail /
 * Outlook / mobile clients. No external CSS, no JS. Uses a max-width 600px
 * table layout — the email industry standard.
 */

type LeadData = {
  name: string;
  email: string;
  phone: string;
  location: string;
  rooms: number;
  bathrooms: number;
  amenities: string;
  locale?: "en" | "es";
};

const PUBLIC_URL = "https://web-zenhospitality.vercel.app";
const HERO_PHOTO_URL = `${PUBLIC_URL}/zen/aerial-resort.jpg`;
const LOGO_URL = `${PUBLIC_URL}/brand/logos/logo-dark.png`;

const NAVY = "#042b59";
const CYAN = "#58c3e8";
const CREAM = "#eaf1f6";

const esc = (s: string | number) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

/* ─────────────────────────── CONFIRMATION TO USER ─────────────────────────── */

type ConfirmationCopy = {
  subject: string;
  preheader: string;
  kicker: string;
  greeting: (firstName: string) => string;
  headline: string;
  italicHighlight: string;
  body1: string;
  body2: string;
  meta: {
    label: string;
    value: string;
  }[];
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
    subject: "Welcome to Zen Hospitality, your inquiry has been received",
    preheader: "An advisor will be in touch within 24 hours. Thank you for trusting Zen Hospitality.",
    kicker: "Inquiry Received",
    greeting: (firstName) => `Dear ${firstName},`,
    headline: "Thank you.",
    italicHighlight: "Your residence has caught our attention.",
    body1:
      "We have received your inquiry, and a Zen Hospitality advisor will be in touch with you within the next 24 hours. The initial conversation is private, complimentary, and entirely focused on understanding the potential of your property.",
    body2:
      "From the warm light of the Pacific to the silence of dawn over the rainforest, every residence we manage carries a quiet promise: to be cared for as if it were our own. We look forward to beginning that conversation with you.",
    meta: [],
    closingKicker: "Soon, the conversation begins.",
    closingLine1: "Quiet precision.",
    closingLine2: "Measurable returns.",
    signature: "Eduardo C.",
    signatureRole: "Zen Hospitality",
    whatsappLabel: "WhatsApp",
    emailLabel: "Email",
    footer:
      "You are receiving this email because you submitted an inquiry through web-zenhospitality.vercel.app. If this was not you, please disregard this message.",
  },
  es: {
    subject: "Bienvenido a Zen Hospitality, hemos recibido su solicitud",
    preheader:
      "Un asesor se pondrá en contacto con usted en un plazo de 24 horas. Gracias por confiar en Zen Hospitality.",
    kicker: "Solicitud recibida",
    greeting: (firstName) => `Estimado ${firstName},`,
    headline: "Gracias.",
    italicHighlight: "Su residencia ha llamado nuestra atención.",
    body1:
      "Hemos recibido su consulta y un asesor de Zen Hospitality se pondrá en contacto con usted en las próximas 24 horas. La conversación inicial es privada, sin compromiso y enteramente enfocada en comprender el potencial de su propiedad.",
    body2:
      "Desde la luz cálida del Pacífico hasta el silencio del amanecer sobre la selva tropical, cada residencia que gestionamos lleva consigo una promesa silenciosa: ser cuidada como si fuera la nuestra. Esperamos comenzar esa conversación con usted.",
    meta: [],
    closingKicker: "Pronto, comienza la conversación.",
    closingLine1: "Precisión silenciosa.",
    closingLine2: "Retornos medibles.",
    signature: "Eduardo C.",
    signatureRole: "Zen Hospitality",
    whatsappLabel: "WhatsApp",
    emailLabel: "Correo",
    footer:
      "Recibe este correo porque envió una solicitud a través de web-zenhospitality.vercel.app. Si no fue usted, por favor ignore este mensaje.",
  },
};

const CONTACT = {
  whatsappPhone: "+506 8729 1276",
  whatsappHref: "https://wa.me/50687291276",
  emailAddress: "eduardoc@zen-hospitality.com",
  emailHref: "mailto:eduardoc@zen-hospitality.com",
  siteUrl: PUBLIC_URL,
};

export function renderConfirmationEmail(lead: LeadData): {
  subject: string;
  html: string;
  text: string;
} {
  const locale = lead.locale === "es" ? "es" : "en";
  const copy = COPY[locale];
  const firstName = (lead.name || "").trim().split(/\s+/)[0] || lead.name;

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
    <!-- Preheader (hidden in inbox preview) -->
    <div style="display:none; visibility:hidden; opacity:0; color:transparent; height:0; width:0; overflow:hidden; mso-hide:all;">
      ${esc(copy.preheader)}
    </div>

    <!-- Outer canvas: near-black so the navy container floats like a printed card -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0a0a0c;">
      <tr>
        <td align="center" style="padding: 48px 16px;">

          <!-- Outer container — navy editorial card -->
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

            <!-- Cinematic veil overlay (table for email compatibility) -->
            <tr>
              <td style="background-color:${NAVY}; padding:0;">
                <!-- Cyan hairline -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="height:1px; line-height:1px; font-size:0; background-color:${CYAN}; opacity:0.6;">&nbsp;</td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Main content -->
            <tr>
              <td class="px-lg" style="background-color:${NAVY}; padding:56px 56px 32px 56px;">

                <!-- Brand kicker -->
                <p style="margin:0 0 32px 0; font-family:'Helvetica Neue', Arial, sans-serif; font-size:11px; letter-spacing:4px; text-transform:uppercase; color:${CYAN}; font-weight:500;">
                  <span style="display:inline-block; width:32px; height:1px; background-color:${CYAN}; vertical-align:middle; margin-right:12px;">&nbsp;</span>
                  ${esc(copy.kicker)}
                </p>

                <!-- Greeting -->
                <p style="margin:0 0 24px 0; font-size:15px; line-height:1.6; color:${CREAM}; opacity:0.85;">
                  ${esc(copy.greeting(firstName))}
                </p>

                <!-- Hero headline -->
                <h1 class="hero-headline" style="margin:0 0 12px 0; font-family:'Helvetica Neue', Arial, sans-serif; font-size:52px; line-height:1.02; letter-spacing:-0.018em; color:${CREAM}; font-weight:500;">
                  ${esc(copy.headline)}
                </h1>
                <p class="hero-italic" style="margin:0 0 32px 0; font-family: Georgia, 'Times New Roman', serif; font-style:italic; font-size:28px; line-height:1.2; color:${CYAN}; font-weight:400;">
                  ${esc(copy.italicHighlight)}
                </p>

                <!-- Body copy -->
                <p style="margin:0 0 20px 0; font-size:15px; line-height:1.7; color:${CREAM}; opacity:0.85;">
                  ${esc(copy.body1)}
                </p>
                <p style="margin:0 0 36px 0; font-size:15px; line-height:1.7; color:${CREAM}; opacity:0.7;">
                  ${esc(copy.body2)}
                </p>

                <!-- Closing italic block -->
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 8px 0 32px 0; border-left:2px solid ${CYAN};">
                  <tr>
                    <td style="padding: 6px 0 6px 20px;">
                      <p style="margin:0 0 6px 0; font-family:'Helvetica Neue', Arial, sans-serif; font-size:10px; letter-spacing:3px; text-transform:uppercase; color:${CYAN}; font-weight:500;">
                        ${esc(copy.closingKicker)}
                      </p>
                      <p style="margin:0; font-family: Georgia, 'Times New Roman', serif; font-style:italic; font-size:18px; line-height:1.4; color:${CREAM};">
                        ${esc(copy.closingLine1)}<br />
                        ${esc(copy.closingLine2)}
                      </p>
                    </td>
                  </tr>
                </table>

                <!-- Signature -->
                <p style="margin:0; font-size:14px; line-height:1.5; color:${CREAM};">
                  ${esc(copy.signature)}
                </p>
                <p style="margin:0; font-size:11px; line-height:1.5; letter-spacing:3px; text-transform:uppercase; color:${CYAN}; opacity:0.75;">
                  ${esc(copy.signatureRole)}
                </p>
              </td>
            </tr>

            <!-- Divider -->
            <tr>
              <td class="px-lg" style="background-color:${NAVY}; padding: 0 56px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="border-top:1px solid rgba(88,195,232,0.15); height:1px; font-size:0; line-height:0;">&nbsp;</td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Contact block -->
            <tr>
              <td class="px-lg" style="background-color:${NAVY}; padding: 32px 56px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="padding-bottom:18px;">
                      <p style="margin:0 0 6px 0; font-size:10px; letter-spacing:3px; text-transform:uppercase; color:${CYAN}; opacity:0.7; font-weight:500;">
                        ${esc(copy.whatsappLabel)}
                      </p>
                      <a href="${CONTACT.whatsappHref}" target="_blank" style="font-size:15px; color:${CREAM}; text-decoration:none;">
                        ${CONTACT.whatsappPhone}
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p style="margin:0 0 6px 0; font-size:10px; letter-spacing:3px; text-transform:uppercase; color:${CYAN}; opacity:0.7; font-weight:500;">
                        ${esc(copy.emailLabel)}
                      </p>
                      <a href="${CONTACT.emailHref}" target="_blank" style="font-size:15px; color:${CYAN}; text-decoration:none;">
                        ${CONTACT.emailAddress}
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td class="px-lg" style="background-color:${NAVY}; padding: 24px 56px 40px 56px; border-top:1px solid rgba(88,195,232,0.10);">
                <p style="margin:0; font-size:10px; line-height:1.6; color:${CREAM}; opacity:0.4;">
                  ${esc(copy.footer)}
                </p>
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

  // Plain text fallback
  const text = [
    copy.kicker.toUpperCase(),
    "",
    copy.greeting(firstName),
    "",
    `${copy.headline} ${copy.italicHighlight}`,
    "",
    copy.body1,
    "",
    copy.body2,
    "",
    `${copy.closingKicker}`,
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

export function renderLeadNotificationEmail(lead: LeadData): {
  subject: string;
  html: string;
  text: string;
} {
  const locale = lead.locale === "es" ? "es" : "en";
  const subject = `New Zen lead: ${lead.name} · ${lead.location}`;

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${esc(subject)}</title>
  </head>
  <body style="margin:0; padding:24px; background-color:${CREAM}; font-family: 'Helvetica Neue', Arial, sans-serif; color:${NAVY};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:640px; margin:0 auto; background-color:#ffffff; border:1px solid rgba(4,43,89,0.12);">
      <!-- Top bar -->
      <tr>
        <td style="background-color:${NAVY}; padding: 24px 32px;">
          <p style="margin:0; font-size:10px; letter-spacing:4px; text-transform:uppercase; color:${CYAN}; font-weight:500;">
            New Lead · Zen Hospitality
          </p>
          <h1 style="margin:8px 0 0 0; font-size:26px; line-height:1.2; color:${CREAM}; font-weight:500;">
            ${esc(lead.name)}
          </h1>
          <p style="margin:4px 0 0 0; font-size:13px; color:${CREAM}; opacity:0.7;">
            ${esc(lead.location)} · Submitted in ${locale.toUpperCase()}
          </p>
        </td>
      </tr>

      <!-- Data table -->
      <tr>
        <td style="padding:0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;">
            ${[
              ["Name", lead.name],
              ["Email", lead.email],
              ["Phone", lead.phone],
              ["Property location", lead.location],
              ["Rooms", String(lead.rooms)],
              ["Bathrooms", String(lead.bathrooms)],
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
              <td style="padding:14px 32px 14px 0; font-size:14px; color:${NAVY}; line-height:1.6; white-space:pre-wrap;">${esc(lead.amenities)}</td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Quick reply -->
      <tr>
        <td style="padding:24px 32px 32px 32px; background-color:#ffffff; border-top:1px solid rgba(4,43,89,0.08);">
          <p style="margin:0 0 12px 0; font-size:12px; letter-spacing:2px; text-transform:uppercase; color:${CYAN}; font-weight:500;">
            Quick reply
          </p>
          <p style="margin:0 0 8px 0; font-size:14px; color:${NAVY};">
            <a href="mailto:${esc(lead.email)}" style="color:${NAVY}; text-decoration:underline;">Reply by email</a>
          </p>
          <p style="margin:0; font-size:14px; color:${NAVY};">
            <a href="https://wa.me/${encodeURIComponent(lead.phone.replace(/\D/g, ""))}" style="color:${NAVY}; text-decoration:underline;">Open WhatsApp chat (${esc(lead.phone)})</a>
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = [
    `NEW ZEN LEAD`,
    ``,
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    `Phone: ${lead.phone}`,
    `Property location: ${lead.location}`,
    `Rooms: ${lead.rooms}`,
    `Bathrooms: ${lead.bathrooms}`,
    `Locale: ${locale}`,
    ``,
    `Amenities:`,
    `${lead.amenities}`,
    ``,
    `Reply: mailto:${lead.email}`,
    `WhatsApp: https://wa.me/${lead.phone.replace(/\D/g, "")}`,
  ].join("\n");

  return { subject, html, text };
}
