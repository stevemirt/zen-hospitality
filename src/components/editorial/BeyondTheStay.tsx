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

const PARTNER_FOCUS: Record<string, string> = {
  CEPIA: "Children · Education · Community",
  "The Clean Wave": "Coastal · Marine · Conservation",
  "Sibu Wildlife Sanctuary": "Wildlife · Rescue · Rehabilitation",
};

// Subtle thematic backdrop per partner — fades into the card from the right
const PARTNER_BACKDROPS: Record<string, string> = {
  CEPIA: "/zen/stock/mountain-pacific.jpg",
  "The Clean Wave": "/zen/stock/waterfall.jpg",
  "Sibu Wildlife Sanctuary": "/zen/stock/toucan.jpg",
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
                Hospitality
                <br />
                <span className="h-italic text-[#58c3e8]">as legacy.</span>
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
                  &ldquo;True luxury is rooted in the positive impact we create.&rdquo;
                </p>
                <footer className="mt-4 h-kicker text-[#58c3e8]/85">
                  — Zen Hospitality
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
            const focus = PARTNER_FOCUS[p.name];
            const backdrop = PARTNER_BACKDROPS[p.name];
            return (
              <Reveal key={p.name} delayMs={i * 130}>
                <article className="group relative overflow-hidden">
                  <div className="relative bg-gradient-to-br from-[#0a3a73]/60 to-[#042b59]/30 backdrop-blur-sm border border-[#58c3e8]/20 hover:border-[#58c3e8]/50 transition-all duration-500 p-6 md:p-12 overflow-hidden">
                    {/* Thematic photo backdrop — clearly visible, not just decorative */}
                    {backdrop && (
                      <div
                        aria-hidden
                        className="absolute inset-y-0 right-0 w-1/2 md:w-3/5 opacity-50 group-hover:opacity-75 transition-opacity duration-700 pointer-events-none"
                        style={{
                          backgroundImage: `linear-gradient(to right, #042b59 0%, rgba(4,43,89,0.4) 35%, transparent 100%), url(${backdrop})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />
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

                    <div className="grid gap-10 md:grid-cols-[220px_1fr] items-center">
                      {/* Logo — bigger, lit, refined */}
                      <div className="shrink-0 flex items-center justify-center md:justify-start">
                        <div
                          className="w-36 h-36 md:w-52 md:h-52 rounded-2xl p-5 md:p-8 flex items-center justify-center ring-1 ring-[#58c3e8]/30 group-hover:ring-[#58c3e8]/70 shadow-[0_12px_40px_rgba(4,43,89,0.45)] group-hover:shadow-[0_20px_60px_rgba(88,195,232,0.35)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1"
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
                        <div className="flex flex-wrap items-center gap-4 mb-4">
                          <span className="inline-flex items-center gap-2 h-kicker text-[#58c3e8]">
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 12 12"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M2 6l3 3 5-6" />
                            </svg>
                            Verified Partner · Zen Hospitality
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 mb-3">
                          {est && (
                            <span className="h-kicker text-[#58c3e8]/85">Est. {est}</span>
                          )}
                          {focus && (
                            <>
                              <span aria-hidden className="text-[#58c3e8]/40">·</span>
                              <span className="h-kicker text-[#eaf1f6]/55">{focus}</span>
                            </>
                          )}
                        </div>
                        <h3 className="h-display text-3xl md:text-4xl text-[#eaf1f6] mb-4">
                          {p.name}
                        </h3>
                        <p className="body-luxe text-sm md:text-base text-[#eaf1f6]/75 leading-relaxed max-w-xl mb-6">
                          {p.body}
                        </p>
                        <a
                          href="#join"
                          className="inline-flex items-center gap-3 h-kicker text-[#58c3e8] hover:text-[#eaf1f6] transition-colors duration-200 group/cta"
                        >
                          Donate · Learn more
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
                Together with our guests, since 2024 — every stay contributes.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
