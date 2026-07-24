import { z } from "zod";
import { leadSchema } from "./leadSchema";
import { QUOTE_SERVICE_IDS } from "./quoteServices";

/**
 * Quote calculator form schema. Reuses every lead field (name, email, phone,
 * location, rooms, bathrooms, amenities + honeypot + locale + utm_*) so the
 * form parity with JoinForm is guaranteed, and adds the calculator outputs.
 *
 * subtotal/vat/total are accepted from the client but recomputed
 * authoritatively on the server from `services` (anti-tamper).
 */
export const quoteSchema = leadSchema.extend({
  services: z.array(z.enum(QUOTE_SERVICE_IDS)).min(1, "Select at least one service"),
  subtotal: z.coerce.number().nonnegative(),
  vat: z.coerce.number().nonnegative(),
  total: z.coerce.number().nonnegative(),
});

export type QuoteInput = z.infer<typeof quoteSchema>;
