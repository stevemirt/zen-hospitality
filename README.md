# Zen Hospitality — Landing Page

Cinematic scroll-driven landing page for **Zen Hospitality**, a luxury residential operator in Costa Rica. Designed for property owners considering joining the Zen Reserve collection.

## Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **i18n**: next-intl (EN / ES)
- **Forms**: React Hook Form + Zod + Resend
- **Animations**: GSAP + custom CSS keyframes
- **Map**: D3-geo Mercator projection over real Natural Earth Costa Rica data

## Sections

1. Hero — aerial drone of Costa Rica resort
2. Who we are — brand promise + values + Roman-numeral Vision / Promise
3. Pool banner — infinity pool with scroll-driven Ken Burns
4. Why Costa Rica? — real country map with animated radar + Zen Reserve markers
5. Our Collection — three Zen Reserve residences (Guanacaste, Nosara, Papagayo)
6. Ten disciplines — services grid with dual-tone icons
7. Two paths — Property Management vs Vacation Rentals
8. Packages — Zen Care · Zen Preserve · Zen Legacy (highlighted)
9. Our Operations — aerial beach banner + nav cards
10. Your property journey — sticky photo + scrolling 5-step timeline
11. Locally rooted approach — Costa Rica community editorial cards
12. Guest experience — eight mini-card grid
13. Hospitality as legacy — verified NGO partners (CEPIA, The Clean Wave, Sibu Wildlife Sanctuary)
14. FAQs — categorized accordion with auto-syncing sidebar
15. Join our Collection — modernist form with floating labels

## Development

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build
pnpm typecheck
```

## Environment variables (production)

```env
RESEND_API_KEY=re_...                 # for /api/lead form submissions
LEAD_NOTIFY_EMAIL=hello@your-domain   # destination inbox
LEAD_FROM_EMAIL=Zen Hospitality <noreply@your-domain>
```

## Brand assets

- Palette: `#042b59` navy · `#58c3e8` cyan · `#eaf1f6` mist
- Fonts: Gotham (Light, Book, Medium, Medium Italic, Bold)
- Logo variants: `public/brand/logos/`
- NGO logos sourced from official sites: `public/zen/ngos/`
- Property photography: `public/zen/`
- Stock photography (Unsplash, royalty-free): `public/zen/stock/`

## Photography credits

Stock photography from [Unsplash](https://unsplash.com) — free for commercial use, no attribution required (attribution welcomed).

## Deploy

Hosted on [Vercel](https://vercel.com). Auto-deploys on push to `main`.
