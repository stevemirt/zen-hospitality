/**
 * HTML email template for the OWNERS OUTREACH campaign.
 *
 * Sent to prospective property owners to introduce Zen Hospitality's
 * management + short-term rental program. Locale-aware. Distinct file from
 * leadEmails.ts (transactional confirmation) so marketing and transactional
 * copy can evolve independently.
 *
 * Shares NAVY/CYAN/CREAM/PUBLIC_URL/CONTACT/esc from emailShared.ts to keep
 * brand consistency across every email.
 */

import {
  NAVY,
  CYAN,
  CREAM,
  PUBLIC_URL,
  HERO_PHOTO_URL,
  CONTACT,
  esc,
} from "./emailShared";

type Locale = "en" | "es";

type Discipline = { n: string; title: string; body: string };

/* ─────────────────────────── COPY ─────────────────────────── */

type OutreachCopy = {
  subject: string;
  preheader: string;
  kicker: string;
  greeting: string;
  headlineLine1: string;
  headlineHighlight: string;
  opening: string;
  servicesLabel: string;
  servicesIntro: string;
  featuredKicker: string;
  featuredBadge: string;
  featuredName: string;
  featuredPrice: string;
  featuredPriceUnit: string;
  featuredIntro: string;
  featuredIncludes: string[];
  impactLine: string;
  ctaLabel: string;
  closingLine1: string;
  closingLine2: string;
  closingLine3: string;
  signature: string;
  signatureRole: string;
  whatsappLabel: string;
  emailLabel: string;
  seeFullOnline: string;
  footer: string;
  disciplinesCompact: string[]; // 6 top disciplines rendered as 2-col list
};

const COPY: Record<Locale, OutreachCopy> = {
  en: {
    subject: "Zen Hospitality · A refined operation for your Costa Rica residence",
    preheader:
      "A private management and short-term rental program designed for exceptional properties on the Pacific coast.",
    kicker: "For Property Owners",
    greeting: "Dear owner,",
    headlineLine1: "Your residence",
    headlineHighlight: "as an asset.",
    opening:
      "Your residence is more than a home. It is an asset. We would like to introduce a refined operation designed to protect its value while unlocking its potential as a short-term rental.",
    servicesLabel: "Ten disciplines · one operation",
    servicesIntro:
      "A single accountable team covering asset management, guest experience, housekeeping, maintenance, security, sales and reporting — engineered to run remotely so you can live anywhere.",
    featuredKicker: "Featured program",
    featuredBadge: "Most chosen",
    featuredName: "Zen Legacy",
    featuredPrice: "USD $1,659",
    featuredPriceUnit: "+ VAT / month",
    featuredIntro:
      "Our most chosen program aligns hospitality standards with commercial optimization to maximize net income.",
    featuredIncludes: [
      "Listing and optimization across OTAs",
      "Dynamic pricing and digital marketing",
      "End-to-end reservation management",
      "24/7 customer support center",
    ],
    impactLine:
      "Every managed residence contributes to three verified NGO partners in Guanacaste and Nicoya. True luxury is rooted in the positive impact we create.",
    ctaLabel: "Discover the potential of your property",
    closingLine1: "Quiet precision.",
    closingLine2: "Measurable returns.",
    closingLine3: "A standard, not a service.",
    signature: "Eduardo C.",
    signatureRole: "Zen Hospitality",
    whatsappLabel: "WhatsApp",
    emailLabel: "Email",
    seeFullOnline: "Read the full pitch online →",
    footer:
      "You are receiving this email because Zen Hospitality believes your residence may fit our management program. If this is not for you, please disregard this message.",
    disciplinesCompact: [
      "Property Management",
      "Concierge & Guest Operations",
      "Housekeeping",
      "Maintenance",
      "Sales & Marketing",
      "Monthly Reports",
    ],
  },
  es: {
    subject: "Zen Hospitality · Una operación refinada para su residencia en Costa Rica",
    preheader:
      "Un programa privado de administración y alquiler a corto plazo diseñado para propiedades excepcionales en la costa Pacífica.",
    kicker: "Para Propietarios",
    greeting: "Estimado propietario,",
    headlineLine1: "Su residencia",
    headlineHighlight: "como activo.",
    opening:
      "Su residencia es más que una casa. Es un activo. Le presentamos una operación refinada, diseñada para proteger su valor mientras libera su potencial como alquiler a corto plazo.",
    servicesLabel: "Diez disciplinas · una operación",
    servicesIntro:
      "Un único equipo responsable de administración, experiencia del huésped, limpieza, mantenimiento, seguridad, ventas e informes, diseñado para operar de forma remota, para que usted pueda vivir donde quiera.",
    featuredKicker: "Programa destacado",
    featuredBadge: "El más elegido",
    featuredName: "Zen Legacy",
    featuredPrice: "USD $1,659",
    featuredPriceUnit: "+ IVA / mes",
    featuredIntro:
      "Nuestro programa más elegido alinea los estándares de hospitalidad con la optimización comercial para maximizar el ingreso neto.",
    featuredIncludes: [
      "Listado y optimización en OTAs",
      "Precios dinámicos y marketing digital",
      "Gestión integral de reservas, de principio a fin",
      "Centro de soporte 24/7",
    ],
    impactLine:
      "Cada residencia gestionada contribuye a tres aliados verificados en Guanacaste y Nicoya. El verdadero lujo está enraizado en el impacto positivo que creamos.",
    ctaLabel: "Descubra el potencial de su propiedad",
    closingLine1: "Precisión silenciosa.",
    closingLine2: "Retornos medibles.",
    closingLine3: "Un estándar, no un servicio.",
    signature: "Eduardo C.",
    signatureRole: "Zen Hospitality",
    whatsappLabel: "WhatsApp",
    emailLabel: "Correo",
    seeFullOnline: "Leer la propuesta completa en línea →",
    footer:
      "Recibe este correo porque Zen Hospitality considera que su residencia puede encajar en nuestro programa de gestión. Si no es su caso, por favor ignore este mensaje.",
    disciplinesCompact: [
      "Gestión de propiedad",
      "Conserjería y huéspedes",
      "Limpieza",
      "Mantenimiento",
      "Ventas y marketing",
      "Informes mensuales",
    ],
  },
};

/* ─────────────────────────── RENDER ─────────────────────────── */

export function renderOwnersOutreachEmail(locale: Locale = "en"): {
  subject: string;
  html: string;
  text: string;
} {
  const copy = COPY[locale];
  const landingHref = `${PUBLIC_URL}/${locale}/owners?ref=outreach-email`;
  const formHref = `${PUBLIC_URL}/${locale}?ref=outreach-email#join`;

  // Split the 6 compact disciplines into 2 columns of 3 for the email
  const col1 = copy.disciplinesCompact.slice(0, 3);
  const col2 = copy.disciplinesCompact.slice(3, 6);

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
        .hero-headline { font-size: 40px !important; line-height: 1.05 !important; }
        .hero-italic { font-size: 26px !important; }
        .featured-price { font-size: 36px !important; }
        .disc-col { display: block !important; width: 100% !important; padding-right: 0 !important; }
      }
    </style>
  </head>
  <body style="margin:0; padding:0; background-color:#0a0a0c; font-family: 'Helvetica Neue', Arial, sans-serif; color:${CREAM};">
    <!-- Preheader (hidden in inbox preview) -->
    <div style="display:none; visibility:hidden; opacity:0; color:transparent; height:0; width:0; overflow:hidden; mso-hide:all;">
      ${esc(copy.preheader)}
    </div>

    <!-- Outer canvas -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0a0a0c;">
      <tr>
        <td align="center" style="padding: 48px 16px;">

          <!-- Editorial card -->
          <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px; max-width:600px; background-color:${NAVY}; border:1px solid rgba(88,195,232,0.20); box-shadow: 0 24px 80px rgba(0,0,0,0.55);">

            <!-- Hero photo -->
            <tr>
              <td style="background-color:${NAVY}; padding:0;">
                <a href="${landingHref}" target="_blank" style="text-decoration:none; display:block;">
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
              <td class="px-lg" style="background-color:${NAVY}; padding:52px 56px 24px 56px;">

                <!-- Brand kicker -->
                <p style="margin:0 0 32px 0; font-size:11px; letter-spacing:4px; text-transform:uppercase; color:${CYAN}; font-weight:500;">
                  <span style="display:inline-block; width:32px; height:1px; background-color:${CYAN}; vertical-align:middle; margin-right:12px;">&nbsp;</span>
                  ${esc(copy.kicker)}
                </p>

                <!-- Greeting -->
                <p style="margin:0 0 24px 0; font-size:15px; line-height:1.6; color:${CREAM}; opacity:0.85;">
                  ${esc(copy.greeting)}
                </p>

                <!-- Hero headline -->
                <h1 class="hero-headline" style="margin:0 0 8px 0; font-size:52px; line-height:1.02; letter-spacing:-0.018em; color:${CREAM}; font-weight:500;">
                  ${esc(copy.headlineLine1)}
                </h1>
                <p class="hero-italic" style="margin:0 0 32px 0; font-family: Georgia, 'Times New Roman', serif; font-style:italic; font-size:32px; line-height:1.15; color:${CYAN}; font-weight:400;">
                  ${esc(copy.headlineHighlight)}
                </p>

                <!-- Opening body -->
                <p style="margin:0 0 36px 0; font-size:15px; line-height:1.7; color:${CREAM}; opacity:0.85;">
                  ${esc(copy.opening)}
                </p>
              </td>
            </tr>

            <!-- Services block -->
            <tr>
              <td class="px-lg" style="background-color:${NAVY}; padding:0 56px 12px 56px;">
                <p style="margin:0 0 6px 0; font-size:10px; letter-spacing:3px; text-transform:uppercase; color:${CYAN}; font-weight:500;">
                  ${esc(copy.servicesLabel)}
                </p>
                <p style="margin:0 0 18px 0; font-size:14px; line-height:1.65; color:${CREAM}; opacity:0.75;">
                  ${esc(copy.servicesIntro)}
                </p>
                <!-- 2-col disciplines -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td class="disc-col" style="width:50%; padding-right:16px; vertical-align:top;">
                      ${col1
                        .map(
                          (d) => `
                        <p style="margin:0 0 10px 0; font-size:13px; color:${CREAM}; opacity:0.9;">
                          <span style="color:${CYAN}; margin-right:8px;">·</span>${esc(d)}
                        </p>`
                        )
                        .join("")}
                    </td>
                    <td class="disc-col" style="width:50%; padding-left:0; vertical-align:top;">
                      ${col2
                        .map(
                          (d) => `
                        <p style="margin:0 0 10px 0; font-size:13px; color:${CREAM}; opacity:0.9;">
                          <span style="color:${CYAN}; margin-right:8px;">·</span>${esc(d)}
                        </p>`
                        )
                        .join("")}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Divider before featured -->
            <tr>
              <td class="px-lg" style="background-color:${NAVY}; padding: 28px 56px 0 56px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="border-top:1px solid rgba(88,195,232,0.15); height:1px; font-size:0; line-height:0;">&nbsp;</td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Featured Zen Legacy -->
            <tr>
              <td class="px-lg" style="background-color:${NAVY}; padding:28px 56px 24px 56px;">
                <p style="margin:0 0 10px 0; font-size:10px; letter-spacing:3px; text-transform:uppercase; color:${CYAN}; font-weight:500;">
                  ${esc(copy.featuredKicker)} · <span style="color:${CREAM}; opacity:0.65;">${esc(copy.featuredBadge)}</span>
                </p>
                <h3 style="margin:0 0 12px 0; font-size:30px; line-height:1.1; letter-spacing:-0.01em; color:${CREAM}; font-weight:500;">
                  ${esc(copy.featuredName)}
                </h3>
                <p style="margin:0 0 20px 0;">
                  <span class="featured-price" style="font-size:44px; font-weight:500; color:${CYAN}; letter-spacing:-0.01em;">${esc(copy.featuredPrice)}</span>
                  <span style="font-size:11px; letter-spacing:3px; text-transform:uppercase; color:${CREAM}; opacity:0.65; margin-left:10px;">${esc(copy.featuredPriceUnit)}</span>
                </p>
                <p style="margin:0 0 20px 0; font-size:14px; line-height:1.65; color:${CREAM}; opacity:0.8;">
                  ${esc(copy.featuredIntro)}
                </p>
                <!-- includes bullets -->
                ${copy.featuredIncludes
                  .map(
                    (line) => `
                  <p style="margin:0 0 10px 0; font-size:13px; line-height:1.5; color:${CREAM}; opacity:0.9;">
                    <span style="color:${CYAN}; margin-right:10px;">✓</span>${esc(line)}
                  </p>`
                  )
                  .join("")}
              </td>
            </tr>

            <!-- Impact quote -->
            <tr>
              <td class="px-lg" style="background-color:${NAVY}; padding:12px 56px 28px 56px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 20px 0 0 0; border-left:2px solid ${CYAN};">
                  <tr>
                    <td style="padding: 4px 0 4px 20px;">
                      <p style="margin:0; font-family: Georgia, 'Times New Roman', serif; font-style:italic; font-size:17px; line-height:1.5; color:${CREAM}; opacity:0.9;">
                        ${esc(copy.impactLine)}
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Primary CTA -->
            <tr>
              <td class="px-lg" align="center" style="background-color:${NAVY}; padding:16px 56px 44px 56px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td align="center" style="border-radius:32px; background-color:${CYAN};">
                      <a href="${formHref}" target="_blank"
                        style="display:inline-block; padding:16px 36px; font-size:15px; font-weight:500; letter-spacing:0.04em; color:${NAVY}; text-decoration:none; border-radius:32px;">
                        ${esc(copy.ctaLabel)} &nbsp;→
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="margin:16px 0 0 0; font-size:11px; letter-spacing:2px; text-transform:uppercase;">
                  <a href="${landingHref}" target="_blank" style="color:${CYAN}; text-decoration:none; opacity:0.85;">
                    ${esc(copy.seeFullOnline)}
                  </a>
                </p>
              </td>
            </tr>

            <!-- Closing italic block + signature -->
            <tr>
              <td class="px-lg" style="background-color:${NAVY}; padding:0 56px 32px 56px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-left:2px solid ${CYAN};">
                  <tr>
                    <td style="padding:6px 0 6px 20px;">
                      <p style="margin:0; font-family: Georgia, 'Times New Roman', serif; font-style:italic; font-size:18px; line-height:1.4; color:${CREAM};">
                        ${esc(copy.closingLine1)}<br />
                        ${esc(copy.closingLine2)}<br />
                        ${esc(copy.closingLine3)}
                      </p>
                    </td>
                  </tr>
                </table>
                <p style="margin:24px 0 0 0; font-size:14px; line-height:1.5; color:${CREAM};">
                  ${esc(copy.signature)}
                </p>
                <p style="margin:0; font-size:11px; line-height:1.5; letter-spacing:3px; text-transform:uppercase; color:${CYAN}; opacity:0.75;">
                  ${esc(copy.signatureRole)}
                </p>
              </td>
            </tr>

            <!-- Divider -->
            <tr>
              <td class="px-lg" style="background-color:${NAVY}; padding:0 56px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="border-top:1px solid rgba(88,195,232,0.15); height:1px; font-size:0; line-height:0;">&nbsp;</td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Contact -->
            <tr>
              <td class="px-lg" style="background-color:${NAVY}; padding:28px 56px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="padding-bottom:16px;">
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
              <td class="px-lg" style="background-color:${NAVY}; padding:24px 56px 40px 56px; border-top:1px solid rgba(88,195,232,0.10);">
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

  const text = [
    copy.kicker.toUpperCase(),
    "",
    copy.greeting,
    "",
    `${copy.headlineLine1} ${copy.headlineHighlight}`,
    "",
    copy.opening,
    "",
    copy.servicesLabel.toUpperCase(),
    copy.servicesIntro,
    "",
    `${copy.featuredKicker.toUpperCase()} — ${copy.featuredName}`,
    `${copy.featuredPrice} ${copy.featuredPriceUnit}`,
    copy.featuredIntro,
    ...copy.featuredIncludes.map((l) => `  · ${l}`),
    "",
    copy.impactLine,
    "",
    `${copy.ctaLabel}: ${formHref}`,
    `${copy.seeFullOnline}: ${landingHref}`,
    "",
    `${copy.closingLine1} ${copy.closingLine2} ${copy.closingLine3}`,
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
