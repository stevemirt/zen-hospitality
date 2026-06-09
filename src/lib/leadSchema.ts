import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().min(2, "Please enter your full name").max(120),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(6, "Please enter a valid phone").max(40),
  location: z.string().min(2).max(200),
  rooms: z.coerce.number().int().min(1).max(50),
  bathrooms: z.coerce.number().int().min(1).max(50),
  amenities: z.string().min(5).max(2000),
  // honeypot — must be empty
  website: z.string().max(0).optional(),
  locale: z.enum(["en", "es"]).optional(),
  // UTM parameters for marketing attribution
  utm_source: z.string().max(200).optional(),
  utm_medium: z.string().max(200).optional(),
  utm_campaign: z.string().max(200).optional(),
  utm_term: z.string().max(200).optional(),
  utm_content: z.string().max(200).optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;
