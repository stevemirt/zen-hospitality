"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Section } from "./Section";
import { Reveal } from "@/components/ui/Reveal";

type PlaceLocalized = { region: string; subtitle: string; alt: string };

// Photos are locale-independent. Regions + subtitles + alts come from i18n.
// One photo per region, sourced from the brand team.
const PLACE_PHOTOS = [
  "/zen/collection/guanacaste.jpg",
  "/zen/collection/nicoya-peninsula.jpg",
  "/zen/collection/central-pacific.jpg",
];

export function Collection() {
  const t = useTranslations("collection");
  const placesI18n = t.raw("places") as PlaceLocalized[];
  const PLACES = placesI18n.map((place, i) => ({
    region: place.region,
    subtitle: place.subtitle,
    photo: PLACE_PHOTOS[i],
    alt: place.alt,
  }));

  return (
    <Section id="collection" tone="midnight">
      {/* Editorial header — centered, generous */}
      <div className="text-center mb-16 md:mb-24">
        <Reveal>
          <div className="h-kicker text-[#58c3e8] mb-6 inline-flex items-center gap-3">
            <span aria-hidden className="h-px w-10 bg-[#58c3e8]" />
            {t("kicker")}
            <span aria-hidden className="h-px w-10 bg-[#58c3e8]" />
          </div>
        </Reveal>
        <Reveal delayMs={100}>
          <h2 className="h-display text-[clamp(2.8rem,6.4vw,6rem)] text-[#eaf1f6] mb-6">
            {t("headlineLine1")}
            <br />
            <span className="h-italic text-[#58c3e8]">{t("headlineLine2")}</span>
          </h2>
        </Reveal>
        <Reveal delayMs={180}>
          <p className="body-luxe text-base md:text-lg text-[#eaf1f6]/65 max-w-xl mx-auto">
            {t("lead")}
          </p>
        </Reveal>
      </div>

      {/* Luxury cards */}
      <div className="grid gap-8 md:gap-10 md:grid-cols-3">
        {PLACES.map((place, i) => (
          <Reveal key={place.region} delayMs={i * 140}>
            <a href="#join" className="group block">
              <div className="relative overflow-hidden aspect-[3/4]">
                {/* Photo */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={place.photo}
                  alt={place.alt}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3000ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.08]"
                />
                {/* Soft mask veil */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#042b59]/85 via-[#042b59]/15 to-[#042b59]/40 transition-opacity duration-500 group-hover:opacity-50" />
                {/* Refined corner brackets */}
                <span className="absolute top-5 left-5 w-7 h-7 border-t border-l border-[#58c3e8]/80 transition-all duration-500 group-hover:w-9 group-hover:h-9" />
                <span className="absolute top-5 right-5 w-7 h-7 border-t border-r border-[#58c3e8]/80 transition-all duration-500 group-hover:w-9 group-hover:h-9" />
                <span className="absolute bottom-5 left-5 w-7 h-7 border-b border-l border-[#58c3e8]/80 transition-all duration-500 group-hover:w-9 group-hover:h-9" />
                <span className="absolute bottom-5 right-5 w-7 h-7 border-b border-r border-[#58c3e8]/80 transition-all duration-500 group-hover:w-9 group-hover:h-9" />

                {/* Top label */}
                <div className="absolute top-7 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.42em] uppercase text-[#eaf1f6]/85 text-center">
                  <div className="text-[10px] tracking-[0.42em] uppercase">{t("reserveLabel")}</div>
                </div>

                {/* Bottom content */}
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                  <div className="title font-medium text-3xl md:text-4xl text-[#eaf1f6] leading-[1.02] tracking-[-0.012em] mb-2">
                    {place.region}
                  </div>
                  <div className="text-[10px] tracking-[0.32em] uppercase text-[#58c3e8] mb-5">
                    {place.subtitle}
                  </div>
                  <div className="h-px bg-[#eaf1f6]/30 transition-all duration-500 group-hover:bg-[#58c3e8]" />
                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-[11px] tracking-[0.32em] uppercase text-[#eaf1f6]/70 group-hover:text-[#58c3e8] transition-colors">
                      {t("discoverCta")}
                    </span>
                    <span
                      aria-hidden
                      className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-[#eaf1f6]/30 text-[#eaf1f6] transition-all duration-500 group-hover:border-[#58c3e8] group-hover:bg-[#58c3e8] group-hover:text-[#042b59] group-hover:rotate-[-45deg]"
                    >
                      →
                    </span>
                  </div>
                </div>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
