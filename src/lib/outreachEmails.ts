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
 *
 * Layout: compact editorial letter (560px container, tight paddings, capped
 * hero photo height) — fits comfortably in a Gmail preview pane without
 * overflowing or requiring heavy scroll on desktop.
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
  featuredKicker: string;
  featuredBadge: string;
  featuredName: string;
  featuredPrice: string;
  featuredPriceUnit: string;
  featuredIncludes: string[];
  impactLine: string;
  ctaLabel: string;
  closingLine: string;
  signature: string;
  signatureRole: string;
  whatsappLabel: string;
  emailLabel: string;
  seeFullOnline: string;
  footer: string;
  disciplinesCompact: string[]; // 6 items rendered as 2-col list
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
      "A refined management and short-term rental program for exceptional residences on the Pacific coast of Costa Rica. You keep the asset. We handle the operation.",
    servicesLabel: "Ten disciplines · one operation",
    featuredKicker: "Most chosen program",
    featuredBadge: "Most chosen",
    featuredName: "Zen Legacy",
    featuredPrice: "USD $1,659",
    featuredPriceUnit: "+ VAT / month",
    featuredIncludes: [
      "Listing and optimization across OTAs",
      "Dynamic pricing and digital marketing",
      "End-to-end reservation management",
      "24/7 customer support center",
    ],
    impactLine:
      "True luxury is rooted in the positive impact we create.",
    ctaLabel: "Discover the potential",
    closingLine: "Quiet precision. Measurable returns. A standard, not a service.",
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
      "Un programa refinado de administración y alquiler a corto plazo para residencias excepcionales en la costa Pacífica de Costa Rica. Usted conserva el activo. Nosotros operamos.",
    servicesLabel: "Diez disciplinas · una operación",
    featuredKicker: "Programa más elegido",
    featuredBadge: "El más elegido",
    featuredName: "Zen Legacy",
    featuredPrice: "USD $1,659",
    featuredPriceUnit: "+ IVA / mes",
    featuredIncludes: [
      "Listado y optimización en OTAs",
      "Precios dinámicos y marketing digital",
      "Gestión integral de reservas, de principio a fin",
      "Centro de soporte 24/7",
    ],
    impactLine:
      "El verdadero lujo está enraizado en el impacto positivo que creamos.",
    ctaLabel: "Descubra el potencial",
    closingLine: "Precisión silenciosa. Retornos medibles. Un estándar, no un servicio.",
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
      @media (max-width: 580px) {
        .container { width: 100% !important; }
        .px-lg { padding-left: 24px !important; padding-right: 24px !important; }
        .hero-headline { font-size: 30px !important; line-height: 1.05 !important; }
        .hero-italic { font-size: 22px !important; }
        .featured-price { font-size: 28px !important; }
        .disc-col { display: block !important; width: 100% !important; padding: 0 !important; }
        .hero-photo { height: 160px !important; }
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
        <td align="center" style="padding: 32px 12px;">

          <!-- Editorial card — 560px compact -->
          <table role="presentation" class="container" width="560" cellpadding="0" cellspacing="0" border="0" style="width:560px; max-width:560px; background-color:${NAVY}; border:1px solid rgba(88,195,232,0.20); box-shadow: 0 20px 60px rgba(0,0,0,0.55);">

            <!-- Hero photo — capped height so it acts as a banner, not a poster -->
            <tr>
              <td style="background-color:${NAVY}; padding:0;">
                <a href="${landingHref}" target="_blank" style="text-decoration:none; display:block; line-height:0;">
                  <img src="${HERO_PHOTO_URL}" alt="" width="560" height="200" class="hero-photo"
                    style="display:block; width:100%; max-width:560px; height:200px; object-fit:cover; object-position:center 40%; border:0; outline:none; text-decoration:none;" />
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
              <td class="px-lg" style="background-color:${NAVY}; padding:32px 40px 16px 40px;">

                <!-- Brand kicker -->
                <p style="margin:0 0 20px 0; font-size:10px; letter-spacing:3px; text-transform:uppercase; color:${CYAN}; font-weight:500;">
                  <span style="display:inline-block; width:24px; height:1px; background-color:${CYAN}; vertical-align:middle; margin-right:10px;">&nbsp;</span>
                  ${esc(copy.kicker)}
                </p>

                <!-- Greeting -->
                <p style="margin:0 0 14px 0; font-size:14px; line-height:1.6; color:${CREAM}; opacity:0.85;">
                  ${esc(copy.greeting)}
                </p>

                <!-- Hero headline -->
                <h1 class="hero-headline" style="margin:0 0 4px 0; font-size:38px; line-height:1.05; letter-spacing:-0.018em; color:${CREAM}; font-weight:500;">
                  ${esc(copy.headlineLine1)}
                </h1>
                <p class="hero-italic" style="margin:0 0 20px 0; font-family: Georgia, 'Times New Roman', serif; font-style:italic; font-size:26px; line-height:1.15; color:${CYAN}; font-weight:400;">
                  ${esc(copy.headlineHighlight)}
                </p>

                <!-- Opening body -->
                <p style="margin:0 0 24px 0; font-size:14px; line-height:1.65; color:${CREAM}; opacity:0.85;">
                  ${esc(copy.opening)}
                </p>
              </td>
            </tr>

            <!-- Services strip -->
            <tr>
              <td class="px-lg" style="background-color:${NAVY}; padding:0 40px 20px 40px;">
                <p style="margin:0 0 12px 0; font-size:10px; letter-spacing:3px; text-transform:uppercase; color:${CYAN}; font-weight:500;">
                  ${esc(copy.servicesLabel)}
                </p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td class="disc-col" style="width:50%; padding-right:14px; vertical-align:top;">
                      ${col1
                        .map(
                          (d) => `
                        <p style="margin:0 0 8px 0; font-size:13px; color:${CREAM}; opacity:0.9;">
                          <span style="color:${CYAN}; margin-right:8px;">·</span>${esc(d)}
                        </p>`
                        )
                        .join("")}
                    </td>
                    <td class="disc-col" style="width:50%; padding-left:0; vertical-align:top;">
                      ${col2
                        .map(
                          (d) => `
                        <p style="margin:0 0 8px 0; font-size:13px; color:${CREAM}; opacity:0.9;">
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
              <td class="px-lg" style="background-color:${NAVY}; padding: 20px 40px 0 40px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="border-top:1px solid rgba(88,195,232,0.15); height:1px; font-size:0; line-height:0;">&nbsp;</td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Featured Zen Legacy — compact -->
            <tr>
              <td class="px-lg" style="background-color:${NAVY}; padding:20px 40px 16px 40px;">
                <p style="margin:0 0 8px 0; font-size:10px; letter-spacing:3px; text-transform:uppercase; color:${CYAN}; font-weight:500;">
                  ${esc(copy.featuredKicker)} · <span style="color:${CREAM}; opacity:0.65;">${esc(copy.featuredBadge)}</span>
                </p>
                <h3 style="margin:0 0 8px 0; font-size:22px; line-height:1.1; letter-spacing:-0.01em; color:${CREAM}; font-weight:500;">
                  ${esc(copy.featuredName)}
                </h3>
                <p style="margin:0 0 16px 0;">
                  <span class="featured-price" style="font-size:32px; font-weight:500; color:${CYAN}; letter-spacing:-0.01em;">${esc(copy.featuredPrice)}</span>
                  <span style="font-size:10px; letter-spacing:2px; text-transform:uppercase; color:${CREAM}; opacity:0.65; margin-left:8px;">${esc(copy.featuredPriceUnit)}</span>
                </p>
                ${copy.featuredIncludes
                  .map(
                    (line) => `
                  <p style="margin:0 0 8px 0; font-size:13px; line-height:1.5; color:${CREAM}; opacity:0.9;">
                    <span style="color:${CYAN}; margin-right:10px;">✓</span>${esc(line)}
                  </p>`
                  )
                  .join("")}
              </td>
            </tr>

            <!-- Impact quote — brief -->
            <tr>
              <td class="px-lg" style="background-color:${NAVY}; padding:8px 40px 8px 40px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 16px 0 0 0; border-left:2px solid ${CYAN};">
                  <tr>
                    <td style="padding: 2px 0 2px 16px;">
                      <p style="margin:0; font-family: Georgia, 'Times New Roman', serif; font-style:italic; font-size:15px; line-height:1.45; color:${CREAM}; opacity:0.9;">
                        ${esc(copy.impactLine)}
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Primary CTA -->
            <tr>
              <td class="px-lg" align="center" style="background-color:${NAVY}; padding:20px 40px 12px 40px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td align="center" style="border-radius:32px; background-color:${CYAN};">
                      <a href="${formHref}" target="_blank"
                        style="display:inline-block; padding:14px 30px; font-size:14px; font-weight:500; letter-spacing:0.04em; color:${NAVY}; text-decoration:none; border-radius:32px;">
                        ${esc(copy.ctaLabel)} &nbsp;→
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="margin:12px 0 0 0; font-size:10px; letter-spacing:2px; text-transform:uppercase;">
                  <a href="${landingHref}" target="_blank" style="color:${CYAN}; text-decoration:none; opacity:0.85;">
                    ${esc(copy.seeFullOnline)}
                  </a>
                </p>
              </td>
            </tr>

            <!-- Closing italic line (single-row) + signature -->
            <tr>
              <td class="px-lg" style="background-color:${NAVY}; padding:20px 40px 24px 40px;">
                <p style="margin:0 0 16px 0; font-family: Georgia, 'Times New Roman', serif; font-style:italic; font-size:14px; line-height:1.5; color:${CREAM}; opacity:0.7; text-align:center;">
                  ${esc(copy.closingLine)}
                </p>
                <p style="margin:0; font-size:13px; line-height:1.5; color:${CREAM};">
                  ${esc(copy.signature)}
                </p>
                <p style="margin:0; font-size:10px; line-height:1.5; letter-spacing:3px; text-transform:uppercase; color:${CYAN}; opacity:0.75;">
                  ${esc(copy.signatureRole)}
                </p>
              </td>
            </tr>

            <!-- Divider -->
            <tr>
              <td class="px-lg" style="background-color:${NAVY}; padding:0 40px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="border-top:1px solid rgba(88,195,232,0.15); height:1px; font-size:0; line-height:0;">&nbsp;</td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Contact (compact 2-col) -->
            <tr>
              <td class="px-lg" style="background-color:${NAVY}; padding:20px 40px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td class="disc-col" style="width:50%; padding-right:14px; vertical-align:top;">
                      <p style="margin:0 0 4px 0; font-size:10px; letter-spacing:2px; text-transform:uppercase; color:${CYAN}; opacity:0.7; font-weight:500;">
                        ${esc(copy.whatsappLabel)}
                      </p>
                      <a href="${CONTACT.whatsappHref}" target="_blank" style="font-size:14px; color:${CREAM}; text-decoration:none;">
                        ${CONTACT.whatsappPhone}
                      </a>
                    </td>
                    <td class="disc-col" style="width:50%; padding-left:14px; vertical-align:top;">
                      <p style="margin:0 0 4px 0; font-size:10px; letter-spacing:2px; text-transform:uppercase; color:${CYAN}; opacity:0.7; font-weight:500;">
                        ${esc(copy.emailLabel)}
                      </p>
                      <a href="${CONTACT.emailHref}" target="_blank" style="font-size:14px; color:${CYAN}; text-decoration:none;">
                        ${CONTACT.emailAddress}
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td class="px-lg" style="background-color:${NAVY}; padding:16px 40px 28px 40px; border-top:1px solid rgba(88,195,232,0.10);">
                <p style="margin:0; font-size:9px; line-height:1.55; color:${CREAM}; opacity:0.4;">
                  ${esc(copy.footer)}
                </p>
                <p style="margin:12px 0 0 0; font-size:9px; letter-spacing:3px; text-transform:uppercase; color:${CYAN}; opacity:0.55;">
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
    ...copy.disciplinesCompact.map((d) => `  · ${d}`),
    "",
    `${copy.featuredKicker.toUpperCase()} — ${copy.featuredName}`,
    `${copy.featuredPrice} ${copy.featuredPriceUnit}`,
    ...copy.featuredIncludes.map((l) => `  ✓ ${l}`),
    "",
    copy.impactLine,
    "",
    `${copy.ctaLabel}: ${formHref}`,
    `${copy.seeFullOnline}: ${landingHref}`,
    "",
    copy.closingLine,
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
