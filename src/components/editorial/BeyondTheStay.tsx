"use client";

import { useTranslations } from "next-intl";
import { Section } from "./Section";
import { Reveal } from "@/components/ui/Reveal";

type Partner = { name: string; body: string; est?: string };

const PARTNER_LOGOS: Record<string, string> = {
  CEPIA: "/zen/ngos/cepia.png",
  "The Clean Wave": "/zen/ngos/cleanwave.png",
  "Sibu Wildlife Sanctuary": "/zen/ngos/sibu.png",
};

const PARTNER_EST: Record<string, string> = {
  CEPIA: "2005",
  "The Clean Wave": "2017",
  "Sibu Wildlife Sanctuary": "2010",
};

const PARTNER_FOCUS_KEYS: Record<string, "focusCepia" | "focusCleanWave" | "focusSibu"> = {
  CEPIA: "focusCepia",
  "The Clean Wave": "focusCleanWave",
  "Sibu Wildlife Sanctuary": "focusSibu",
};

// Subtle thematic backdrop per partner — fades into the card from the right (desktop)
// or sits as a full-width banner top half (mobile).
const PARTNER_BACKDROPS: Record<string, string> = {
  CEPIA: "/zen/stock/mountain-pacific.jpg",
  "The Clean Wave": "/zen/stock/waterfall.jpg",
  "Sibu Wildlife Sanctuary": "/zen/stock/toucan.jpg",
};

// Subject focal point per backdrop so the framing keeps the key subject visible
// at any container width. Mobile string used when the photo fills the full card;
// desktop string used when the photo lives in the right-half strip.
const PARTNER_BACKDROP_POS: Record<string, { mobile: string; desktop: string }> = {
  CEPIA: { mobile: "50% 60%", desktop: "50% 50%" },
  "The Clean Wave": { mobile: "55% 45%", desktop: "50% 50%" },
  "Sibu Wildlife Sanctuary": { mobile: "35% 40%", desktop: "50% 50%" },
};

export function BeyondTheStay() {
  const t = useTranslations("beyondTheStay");
  const partners = t.raw("partners") as Partner[];

  return (
    <Section id="beyond-the-stay" tone="midnight">
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
        {/* Sticky left — header + brand promise */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <Reveal>
              <div className="h-kicker text-[#58c3e8] mb-6 inline-flex items-center gap-3">
                <span aria-hidden className="h-px w-10 bg-[#58c3e8]" />
                {t("kicker")}
              </div>
            </Reveal>
            <Reveal delayMs={100}>
              <h2 className="h-display text-[clamp(2.4rem,5.4vw,5rem)] text-[#eaf1f6] mb-8">
                {t("headlineLine1")}
                <br />
                <span className="h-italic text-[#58c3e8]">{t("headlineLine2")}</span>
              </h2>
            </Reveal>
            <Reveal delayMs={180}>
              <p className="body-luxe text-base md:text-lg text-[#eaf1f6]/75 leading-relaxed max-w-md mb-10">
                {t("intro")}
              </p>
            </Reveal>
            <Reveal delayMs={240}>
              <blockquote className="border-l-2 border-[#58c3e8] pl-6 max-w-md">
                <p className="h-italic text-lg md:text-xl text-[#eaf1f6] leading-snug">
                  &ldquo;{t("quote")}&rdquo;
                </p>
                <footer className="mt-4 h-kicker text-[#58c3e8]/85">
                  {t("quoteAttr")}
                </footer>
              </blockquote>
            </Reveal>
          </div>
        </div>

        {/* Right — NGO cards stacked vertically */}
        <div className="lg:col-span-7 space-y-8 md:space-y-10">
          {partners.map((p, i) => {
            const logo = PARTNER_LOGOS[p.name];
            const est = p.est ?? PARTNER_EST[p.name];
            const focusKey = PARTNER_FOCUS_KEYS[p.name];
            const focus = focusKey ? t(focusKey) : undefined;
            const backdrop = PARTNER_BACKDROPS[p.name];
            const bgPos = PARTNER_BACKDROP_POS[p.name] ?? { mobile: "50% 50%", desktop: "50% 50%" };
            return (
              <Reveal key={p.name} delayMs={i * 130}>
                <article className="group relative overflow-hidden">
                  <div className="relative bg-gradient-to-br from-[#0a3a73]/60 to-[#042b59]/30 backdrop-blur-sm border border-[#58c3e8]/20 hover:border-[#58c3e8]/50 transition-all duration-500 p-5 sm:p-8 md:p-12 overflow-hidden">
                    {/* Thematic photo backdrop — mobile: full-bleed top banner above content
                        so the iconic subject (tucán / catarata / horizonte) reads cleanly.
                        Desktop: right-half fade like before. Background-position tuned per
                        subject so the focal point never gets cropped. */}
                    {backdrop && (
                      <>
                        {/* Mobile-only: full card backdrop with strong vertical fade */}
                        <div
                          aria-hidden
                          className="md:hidden absolute inset-0 opacity-55 group-hover:opacity-75 transition-opacity duration-700 pointer-events-none"
                          style={{
                            backgroundImage: `linear-gradient(180deg, rgba(4,43,89,0.10) 0%, rgba(4,43,89,0.55) 45%, #042b59 92%), url(${backdrop})`,
                            backgroundSize: "cover",
                            backgroundPosition: bgPos.mobile,
                          }}
                        />
                        {/* Desktop-only: right-half strip fading toward the card content on the left */}
                        <div
                          aria-hidden
                          className="hidden md:block absolute inset-y-0 right-0 w-3/5 opacity-50 group-hover:opacity-75 transition-opacity duration-700 pointer-events-none"
                          style={{
                            backgroundImage: `linear-gradient(to right, #042b59 0%, rgba(4,43,89,0.4) 35%, transparent 100%), url(${backdrop})`,
                            backgroundSize: "cover",
                            backgroundPosition: bgPos.desktop,
                          }}
                        />
                      </>
                    )}
                    {/* Top hairline cyan */}
                    <span
                      aria-hidden
                      className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#58c3e8] to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500"
                    />
                    {/* Glow on hover */}
                    <span
                      aria-hidden
                      className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#58c3e8]/0 group-hover:bg-[#58c3e8]/15 blur-3xl transition-all duration-700 pointer-events-none"
                    />

                    <div className="grid gap-5 sm:gap-8 md:gap-10 grid-cols-[96px_1fr] sm:grid-cols-[140px_1fr] md:grid-cols-[220px_1fr] items-center">
                      {/* Logo — bigger, lit, refined */}
                      <div className="shrink-0 flex items-center justify-start">
                        <div
                          className="w-24 h-24 sm:w-32 sm:h-32 md:w-52 md:h-52 rounded-xl md:rounded-2xl p-3 sm:p-5 md:p-8 flex items-center justify-center ring-1 ring-[#58c3e8]/30 group-hover:ring-[#58c3e8]/70 shadow-[0_8px_24px_rgba(4,43,89,0.45)] md:shadow-[0_12px_40px_rgba(4,43,89,0.45)] group-hover:shadow-[0_20px_60px_rgba(88,195,232,0.35)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1"
                          style={{
                            background:
                              "radial-gradient(circle at 30% 30%, #ffffff 0%, #eaf1f6 100%)",
                          }}
                        >
                          {logo && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={logo}
                              alt={`${p.name} logo`}
                              className="max-w-full max-h-full object-contain"
                            />
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="md:border-l md:border-[#58c3e8]/15 md:pl-10">
                        <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-3 md:mb-4">
                          <span className="inline-flex items-center gap-2 h-kicker text-[#58c3e8] text-[9px] md:text-[10px]">
                            <svg
                              width="11"
                              height="11"
                              viewBox="0 0 12 12"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M2 6l3 3 5-6" />
                            </svg>
                            {t("verifiedPartner")}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-3">
                          {est && (
                            <span className="h-kicker text-[#58c3e8]/85 text-[9px] md:text-[10px]">{t("estLabel")} {est}</span>
                          )}
                          {focus && (
                            <>
                              <span aria-hidden className="text-[#58c3e8]/40">·</span>
                              <span className="h-kicker text-[#eaf1f6]/55 text-[9px] md:text-[10px]">{focus}</span>
                            </>
                          )}
                        </div>
                        <h3 className="h-display text-xl sm:text-2xl md:text-4xl text-[#eaf1f6] mb-3 md:mb-4">
                          {p.name}
                        </h3>
                        <p className="body-luxe text-xs sm:text-sm md:text-base text-[#eaf1f6]/75 leading-relaxed max-w-xl mb-4 md:mb-6">
                          {p.body}
                        </p>
                        <a
                          href="#join"
                          className="inline-flex items-center gap-3 h-kicker text-[#58c3e8] hover:text-[#eaf1f6] transition-colors duration-200 group/cta"
                        >
                          {t("donateCta")}
                          <span
                            aria-hidden
                            className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-[#58c3e8]/40 text-[#58c3e8] group-hover/cta:bg-[#58c3e8] group-hover/cta:text-[#042b59] group-hover/cta:border-[#58c3e8] transition-all duration-300"
                          >
                            →
                          </span>
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}

          {/* Closing caption */}
          <Reveal delayMs={500}>
            <div className="mt-12 pt-8 border-t border-[#58c3e8]/15 text-center md:text-left">
              <p className="h-italic text-base md:text-lg text-[#eaf1f6]/65">
                {t("closing")}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
