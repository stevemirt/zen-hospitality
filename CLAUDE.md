# Zen Hospitality — Project Documentation

## What This Is

Cinematic scroll-driven landing page for **Zen Hospitality**, a luxury residential property operator in Costa Rica. The page targets property owners considering joining the Zen Reserve collection. It is a single-route Next.js App Router site with 15 editorial sections, bilingual (EN/ES), and a full lead-capture funnel backed by Resend transactional email.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2.6 (App Router, Turbopack) |
| UI | React 19.2.4 + TypeScript 5 (strict) |
| Styling | Tailwind CSS v4 + PostCSS |
| Animations | GSAP 3.13.0, CSS scroll-driven animations, Ken Burns |
| 3D / WebGL | Three.js 0.170.0 + postprocessing 6.36.0 |
| GPU detection | detect-gpu 5.0.55 (graceful degradation) |
| State | Zustand 5.0.2 (ScrollBus for scroll progress) |
| i18n | next-intl 4.12.0 (EN default, ES) |
| Forms | React Hook Form 7.54.2 + Zod 3.24.1 |
| Email | Resend 4.1.2 (dual email: team notify + client confirm) |
| Package manager | pnpm |
| Deployment | Vercel (auto-deploy on push to `main`) |

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx                     # Root layout (minimal)
│   ├── [locale]/
│   │   ├── layout.tsx                 # Locale layout (metadata, i18n, JSON-LD)
│   │   └── page.tsx                   # Main page — 15 section stack
│   └── api/
│       └── lead/route.ts              # POST /api/lead (Zod + Resend)
├── components/
│   ├── cinematic/
│   │   └── Cinematic.tsx              # Three.js canvas (Ocean, Mist, SkyDome)
│   ├── editorial/                     # 15+ page sections
│   │   ├── Hero.tsx
│   │   ├── WhoWeAre.tsx
│   │   ├── PoolBanner.tsx             # Ken Burns scroll animation
│   │   ├── CostaRicaMap.tsx           # D3-geo Mercator + radar markers
│   │   ├── Collection.tsx             # 3 regional property cards
│   │   ├── ServicesGrid.tsx           # 10 discipline icons
│   │   ├── TwoPaths.tsx               # PM vs Vacation Rentals
│   │   ├── Packages.tsx               # 3 tiers (Care / Preserve / Legacy)
│   │   ├── Operations.tsx
│   │   ├── Journey.tsx                # 5-step sticky-photo timeline
│   │   ├── LocallyRootedAndExperience.tsx
│   │   ├── BeyondTheStay.tsx          # NGO partners
│   │   ├── FAQs.tsx                   # Categorized accordion + sidebar
│   │   ├── JoinForm.tsx               # Lead capture
│   │   └── Footer.tsx
│   └── ui/                            # Reusable primitives
│       ├── Nav.tsx
│       ├── Accordion.tsx
│       ├── AnimatedNumber.tsx
│       ├── Button.tsx
│       ├── Tabs.tsx
│       ├── Reveal.tsx
│       ├── WordReveal.tsx
│       ├── WhatsAppButton.tsx
│       ├── ScrollToTop.tsx
│       └── BackToSection.tsx
├── three/
│   ├── Stage.ts                       # Three.js scene orchestration
│   ├── CameraRig.ts
│   ├── ScrollBus.ts                   # Zustand scroll store
│   └── scenes/
│       ├── Ocean.ts
│       ├── Mist.ts
│       └── SkyDome.ts
├── lib/
│   ├── leadSchema.ts                  # Zod validation schema
│   ├── leadEmails.ts                  # Resend HTML templates
│   ├── gpu.ts                         # GPU tier detection
│   └── motion.ts                      # prefers-reduced-motion
├── i18n/
│   ├── routing.ts                     # next-intl locale config
│   └── request.ts                     # Server locale resolution
└── content/
    ├── en.json                        # Full English copy
    └── es.json                        # Full Spanish copy
```

---

## Page Sections (in order)

1. **Hero** — Aerial drone shot, bold CTA
2. **Who We Are** — Brand promise, 3 core values, Vision/Promise
3. **Pool Banner** — Infinity pool, Ken Burns scroll animation
4. **Why Costa Rica?** — D3-rendered SVG map, 6 destinations, radar + markers
5. **Our Collection** — 3 regional cards (Guanacaste, Nosara, Papagayo)
6. **Services Grid** — 10 discipline icons + descriptions
7. **Two Paths** — Property Management vs Vacation Rentals comparison
8. **Packages** — 3 pricing tiers: Zen Care, Zen Preserve, Zen Legacy
   - **8b. Customize Plan** — Interactive à-la-carte quote calculator card embedded below Packages (`CustomizePlan.tsx`). Start-gated; 7 selectable services with a live subtotal → 13% IVA → total, then the lead form.
9. **Our Operations** — Aerial beach banner + 4 nav cards
10. **Property Journey** — 5-step sticky-photo timeline
11. **Locally Rooted** — Community editorial cards + surfer photo (Tamarindo)
12. **Guest Experience** — 8 mini-card grid
13. **Beyond the Stay** — NGO partners: CEPIA, The Clean Wave, Sibu Wildlife
14. **FAQs** — Categorized accordion, auto-syncing sidebar
15. **Join Our Collection** — Lead form with floating labels

---

## Lead Flow

- **Form** `JoinForm.tsx` → **POST** `/api/lead`
- Validated with Zod (`leadSchema.ts`), honeypot field `website`
- **Resend** sends 2 emails in parallel:
  - Internal to `LEAD_NOTIFY_EMAIL` (team alert)
  - Cinematic confirmation to the submitting user
- **Zapier webhook** fired in parallel with emails: `https://hooks.zapier.com/hooks/catch/16194264/4b2x74p/`
  - Payload includes `locale` field (`"en"` or `"es"`) for segmentation
  - Failure is silent — does not break the user flow
- Dev fallback: skips Resend but still fires Zapier so leads are captured

### Zapier Webhook Payload

```json
{
  "name": "...",
  "email": "...",
  "phone": "...",
  "location": "...",
  "rooms": 3,
  "bathrooms": 2,
  "amenities": "...",
  "locale": "en"
}
```

### Environment Variables

```env
RESEND_API_KEY=re_...
LEAD_NOTIFY_EMAIL=hello@zen-hospitality.com
LEAD_FROM_EMAIL=Zen Hospitality <noreply@zen-hospitality.com>
ZAPIER_QUOTE_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/.../...   # Customize Plan calculator (separate Zap)
```

---

## Custom Plan Quote Flow (Customize Plan calculator)

A **second, parallel** lead stream — deliberately kept separate from the normal
`JoinForm` flow so submissions never get mixed.

- **Component** `CustomizePlan.tsx` (rendered right after `<Packages />`) → **POST** `/api/quote`
- **Pricing source of truth** `src/lib/quoteServices.ts` — numeric prices + `computeQuote()`
  (`subtotal = Σ selected prices`, `vat = subtotal × 13%`, `total = subtotal + vat`, straight sum
  across monthly/quarterly cadence). Bilingual service labels live in `customizePlan.services` (content JSON).
- Validated with Zod (`quoteSchema.ts` = `leadSchema` + `services[]` + `subtotal/vat/total`), honeypot `website`.
- **Server recomputes** `subtotal/vat/total` from `services` before emailing/firing the webhook (anti-tamper) —
  client-sent figures are ignored.
- **Resend** sends 2 emails (`quoteEmails.ts`): team notification (with priced service breakdown) + client confirmation.
- **Separate Zapier webhook** via `ZAPIER_QUOTE_WEBHOOK_URL` (not the normal form's hardcoded hook). Skipped safely
  if the env var is unset. Payload adds `services`, `services_label`, `subtotal`, `vat`, `total` on top of the
  normal lead fields + `locale` + UTMs.
- **GTM event** `generate_quote` (PII-free) on success — distinct from the form's `generate_lead`.
- UTM capture + floating-label field are shared with `JoinForm` via `src/components/ui/UTMCapture.tsx`,
  `src/lib/utm.ts`, and `src/components/ui/FloatingField.tsx`.

### Quote Webhook Payload

```json
{
  "name": "...", "email": "...", "phone": "...", "location": "...",
  "rooms": 3, "bathrooms": 2, "amenities": "...", "locale": "en",
  "date": "2026-07-23T20:15:00.000Z",
  "utm_source": "...", "utm_medium": "...", "utm_campaign": "...", "utm_term": "...", "utm_content": "...",
  "services": ["pool", "housekeeping"],
  "services_label": "Pool Maintenance; Professional Housekeeping",
  "subtotal": 593.74, "vat": 77.19, "total": 670.93
}
```

---

## i18n

- **Locales:** `en` (default), `es`
- **Routing:** `/[locale]/` prefix — `/en`, `/es`
- **Content:** `src/content/en.json`, `src/content/es.json`
- **Metadata & JSON-LD:** Per-locale in `src/app/[locale]/layout.tsx`
- **Locale detection:** `next-intl` server-side via `src/i18n/request.ts`

---

## Brand

- **Colors:** `#042b59` (navy), `#58c3e8` (cyan), `#eaf1f6` (mist)
- **Font:** Gotham (Light, Book, Medium, Bold) — self-hosted in `public/brand/`
- **Photography:** Own collection + Unsplash royalty-free
- **NGO logos:** Official sources (CEPIA, Clean Wave, Sibu Wildlife)

---

## Development

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build
pnpm start
```

---

## Conventions

- All copy lives in `src/content/{en,es}.json` — never hardcode strings in components.
- GPU tier from `src/lib/gpu.ts` gates heavy Three.js effects.
- `prefers-reduced-motion` checked via `src/lib/motion.ts` before any animation.
- Scroll progress flows through `ScrollBus` (Zustand) → Cinematic canvas + section animations.
- LCP image (hero aerial) gets `fetchpriority="high"` and a `<link rel="preload">`.
- No `<img>` tags — always `next/image` or inline SVG.
- Tailwind v4: utility classes only, no `@apply` in component files.
