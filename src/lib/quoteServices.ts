/**
 * Pricing source of truth for the "Customize Plan" quote calculator.
 *
 * Numeric prices live here (used for the live total on the client AND the
 * authoritative recompute on the server). Bilingual UI labels live in the
 * content JSON (`customizePlan.services`); the English/Spanish name maps below
 * are used server-side (emails + webhook) where i18n content is not available.
 *
 * Prices are pre-IVA, taken from the Zen Hospitality services commercial doc.
 * Per the product decision, the total is a straight arithmetic sum of the
 * selected prices (regardless of monthly/quarterly cadence) + 13% IVA.
 */

export const VAT_RATE = 0.13;

export const QUOTE_SERVICE_IDS = [
  "landscaping",
  "pool",
  "hvac",
  "pest",
  "housekeeping",
  "emergency",
  "pm",
] as const;

export type QuoteServiceId = (typeof QUOTE_SERVICE_IDS)[number];

export type QuoteService = {
  id: QuoteServiceId;
  price: number;
  cadence: "monthly" | "quarterly";
};

export const QUOTE_SERVICES: QuoteService[] = [
  { id: "landscaping", price: 216.67, cadence: "monthly" },
  { id: "pool", price: 288.89, cadence: "monthly" },
  { id: "hvac", price: 115.56, cadence: "quarterly" },
  { id: "pest", price: 260.0, cadence: "quarterly" },
  { id: "housekeeping", price: 304.85, cadence: "monthly" },
  { id: "emergency", price: 130.0, cadence: "monthly" },
  { id: "pm", price: 389.0, cadence: "monthly" },
];

export const PRICE_BY_ID: Record<string, number> = Object.fromEntries(
  QUOTE_SERVICES.map((s) => [s.id, s.price])
);

/** Canonical service names for server-side use (emails + webhook label). */
export const SERVICE_NAMES: Record<"en" | "es", Record<string, string>> = {
  en: {
    landscaping: "Landscaping & Gardening",
    pool: "Pool Maintenance",
    hvac: "HVAC Preventive Maintenance",
    pest: "Pest Control Program",
    housekeeping: "Professional Housekeeping",
    emergency: "24/7 Emergency Coordination",
    pm: "PM Services (Property Management)",
  },
  es: {
    landscaping: "Jardinería y paisajismo",
    pool: "Mantenimiento de piscina",
    hvac: "Mantenimiento preventivo de HVAC",
    pest: "Programa de control de plagas",
    housekeeping: "Limpieza profesional (housekeeping)",
    emergency: "Coordinación de emergencias 24/7",
    pm: "Servicios de administración (PM)",
  },
};

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

/**
 * Authoritative quote math. Unknown ids contribute 0 (defensive).
 * subtotal = Σ(selected prices), vat = subtotal × 13%, total = subtotal + vat.
 */
export function computeQuote(ids: string[]): {
  subtotal: number;
  vat: number;
  total: number;
} {
  const subtotal = round2(
    ids.reduce((sum, id) => sum + (PRICE_BY_ID[id] ?? 0), 0)
  );
  const vat = round2(subtotal * VAT_RATE);
  const total = round2(subtotal + vat);
  return { subtotal, vat, total };
}

/** Human-readable list of selected services, e.g. "Pool Maintenance; Housekeeping". */
export function serviceLabel(ids: string[], locale: "en" | "es" = "en"): string {
  const names = SERVICE_NAMES[locale] ?? SERVICE_NAMES.en;
  return ids.map((id) => names[id] ?? id).join("; ");
}
