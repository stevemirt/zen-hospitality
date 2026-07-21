"use client";

import { useTranslations } from "next-intl";
import { Section } from "../Section";
import { Reveal } from "@/components/ui/Reveal";

export function OwnersFeaturedPackage() {
  const t = useTranslations("owners.featured");
  const includes = t.raw("includes") as string[];

  return (
    <Section id="owners-featured" tone="light">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <Reveal>
            <div className="h-kicker text-[#58c3e8] inline-flex items-center gap-3">
              <span aria-hidden className="h-px w-10 bg-[#58c3e8]" />
              {t("kicker")}
              <span aria-hidden className="h-px w-10 bg-[#58c3e8]" />
            </div>
          </Reveal>
        </div>

        {/* Highlighted card — luxury navy */}
        <Reveal>
          <article className="relative overflow-hidden bg-gradient-to-br from-[#0a3a73] via-[#042b59] to-[#0a3a73] p-8 md:p-14 lg:p-16 shadow-[0_24px_80px_rgba(4,43,89,0.25)]">
            {/* Top hairline glow */}
            <span
              aria-hidden
              className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#58c3e8] to-transparent opacity-70"
            />
            {/* Corner glow */}
            <span
              aria-hidden
              className="absolute -top-32 -right-24 w-96 h-96 rounded-full bg-[#58c3e8]/12 blur-3xl pointer-events-none"
            />

            <div className="grid gap-10 md:gap-16 md:grid-cols-12 items-start">
              {/* Left column — name + price + objective */}
              <div className="md:col-span-5 relative">
                {/* Badge */}
                <span className="inline-flex items-center gap-2 h-kicker text-[#042b59] bg-[#58c3e8] px-3 py-1.5 rounded-full mb-6">
                  <span aria-hidden className="w-1 h-1 rounded-full bg-[#042b59]" />
                  {t("badge")}
                </span>

                <h3 className="h-display text-4xl md:text-5xl text-[#eaf1f6] mb-6">
                  {t("name")}
                </h3>

                <div className="flex items-baseline gap-3 mb-6">
                  <span className="h-display text-[clamp(2.4rem,4vw,3.4rem)] text-[#58c3e8] tabular-nums">
                    {t("price")}
                  </span>
                  <span className="h-kicker text-[#eaf1f6]/65">{t("priceUnit")}</span>
                </div>

                <p className="body-luxe text-sm md:text-base text-[#eaf1f6]/80 leading-relaxed max-w-md">
                  {t("objective")}
                </p>

                <p className="mt-6 text-[11px] uppercase tracking-[0.28em] text-[#58c3e8]/70 leading-relaxed max-w-md">
                  {t("note")}
                </p>

                <div className="mt-10">
                  <a
                    href="#owners-cta"
                    className="group inline-flex items-center gap-3 bg-[#58c3e8] hover:bg-[#eaf1f6] text-[#042b59] px-8 py-3.5 text-sm md:text-base font-medium tracking-[0.04em] rounded-full transition-all duration-300 shadow-[0_8px_32px_rgba(88,195,232,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#eaf1f6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#042b59]"
                  >
                    {t("ctaLabel")}
                    <span
                      aria-hidden
                      className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#042b59] text-[#58c3e8] text-[10px] transition-transform duration-300 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </a>
                </div>
              </div>

              {/* Right column — includes */}
              <div className="md:col-span-7 md:border-l md:border-[#58c3e8]/20 md:pl-10 lg:pl-14">
                <div className="h-kicker text-[#58c3e8] mb-6">{t("includesLabel")}</div>
                <ul className="space-y-4">
                  {includes.map((line, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <svg
                        aria-hidden
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="#58c3e8"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mt-1 shrink-0"
                      >
                        <path d="M3 8l4 4 6-8" />
                      </svg>
                      <span className="body-luxe text-sm md:text-base text-[#eaf1f6]/85 leading-relaxed">
                        {line}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        </Reveal>
      </div>
    </Section>
  );
}
