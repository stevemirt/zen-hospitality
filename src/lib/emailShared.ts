/**
 * Shared primitives for every HTML email template.
 *
 * Kept in a single file so `leadEmails.ts` (transactional) and
 * `outreachEmails.ts` (marketing) never drift on brand colors, escape
 * behavior, or the absolute URL used for embedded assets and CTA links.
 */

export const NAVY = "#042b59";
export const CYAN = "#58c3e8";
export const CREAM = "#eaf1f6";

export const PUBLIC_URL = "https://web-zenhospitality.vercel.app";
export const HERO_PHOTO_URL = `${PUBLIC_URL}/zen/aerial-resort.jpg`;
export const POOL_PHOTO_URL = `${PUBLIC_URL}/zen/hero-pool.jpg`;
export const LOGO_LIGHT_URL = `${PUBLIC_URL}/brand/logos/logo-light.png`;

/** HTML-escape a string safely for interpolation into an email template. */
export const esc = (s: string | number) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

/** Public contact block reused across templates (visible to recipients). */
export const CONTACT = {
  whatsappPhone: "+506 8729 1276",
  whatsappHref: "https://wa.me/50687291276",
  emailAddress: "eduardoc@zen-hospitality.com",
  emailHref: "mailto:eduardoc@zen-hospitality.com",
  siteUrl: PUBLIC_URL,
} as const;
