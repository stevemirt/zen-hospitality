"use client";

import { useTranslations } from "next-intl";
import { Section } from "./Section";
import { Reveal } from "@/components/ui/Reveal";
import clsx from "clsx";

type Card = {
  name: string;
  price: string;
  unit: string;
  objective: string;
  includes: string[];
  highlight?: boolean;
};

export function Packages() {
  const t = useTranslations("packages");
  const cards = t.raw("cards") as Card[];

  return (
    <Section id="packages" tone="midnight">
      {/* Editorial header — centered, big */}
      <div className="text-center mb-20 md:mb-28">
        <Reveal>
          <div className="h-kicker text-[#58c3e8] mb-6 inline-flex items-center gap-3">
            <span aria-hidden className="h-px w-10 bg-[#58c3e8]" />
            {t("kicker")}
            <span aria-hidden className="h-px w-10 bg-[#58c3e8]" />
          </div>
        </Reveal>
        <Reveal delayMs={100}>
          <h2 className="h-display text-[clamp(2.6rem,6vw,5.6rem)] text-[#eaf1f6] mb-6">
            Choose how Zen Hospitality
            <br />
            <span className="h-italic text-[#58c3e8]">serves your asset.</span>
          </h2>
        </Reveal>
        <Reveal delayMs={180}>
          <p className="body-luxe text-base md:text-lg text-[#eaf1f6]/65 max-w-xl mx-auto">
            Three engagements, each calibrated to a different ambition for your residence.
          </p>
        </Reveal>
      </div>

      {/* Luxury pricing cards */}
      <div className="grid gap-6 md:gap-8 md:grid-cols-3 items-stretch">
        {cards.map((c, i) => (
          <Reveal key={c.name} delayMs={i * 140}>
            <article
              className={clsx(
                "group relative h-full flex flex-col overflow-hidden p-8 md:p-10 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                c.highlight
                  ? "bg-gradient-to-br from-[#0a3a73] via-[#042b59] to-[#0a3a73] md:scale-[1.03] md:-translate-y-2 shadow-[0_24px_80px_rgba(88,195,232,0.25)]"
                  : "bg-[#042b59]/50 backdrop-blur-sm hover:bg-[#0a3a73] md:hover:-translate-y-1",
                "hover:shadow-[0_24px_80px_rgba(88,195,232,0.30)]"
              )}
            >
              {/* Animated cyan border for highlighted card */}
              {c.highlight && (
                <>
                  <div
                    aria-hidden
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(135deg, #58c3e8, transparent 30%, transparent 70%, #58c3e8) border-box",
                      WebkitMask:
                        "linear-gradient(#000 0 0) padding-box, linear-gradient(#000 0 0)",
                      WebkitMaskComposite: "xor",
                      maskComposite: "exclude",
                      padding: "1px",
                      borderRadius: "1px",
                    }}
                  />
                  <span
                    aria-hidden
                    className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#58c3e8] to-transparent"
                  />
                </>
              )}
              {!c.highlight && (
                <span
                  aria-hidden
                  className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#58c3e8]/40 to-transparent transition-opacity duration-500 group-hover:via-[#58c3e8]"
                />
              )}

              {/* Glow blob for highlighted — breathing */}
              {c.highlight && (
                <div
                  aria-hidden
                  className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#58c3e8]/18 blur-3xl pointer-events-none zen-glow-breath"
                />
              )}

              {/* Top — index + Most chosen */}
              <div className="flex items-start justify-between mb-8">
                <div className="h-kicker text-[#58c3e8]">№ 0{i + 1}</div>
                {c.highlight && (
                  <span className="inline-flex items-center gap-2 h-kicker text-[#042b59] bg-[#58c3e8] px-3 py-1.5 rounded-full">
                    <span aria-hidden className="w-1 h-1 rounded-full bg-[#042b59]" />
                    Most chosen
                  </span>
                )}
              </div>

              {/* Name */}
              <h3 className="h-display text-3xl md:text-4xl text-[#eaf1f6] mb-3">
                {c.name}
              </h3>

              {/* Price */}
              <div className="flex items-baseline gap-2 mb-8">
                <span className="h-display text-4xl md:text-5xl text-[#58c3e8]">
                  {c.price}
                </span>
                <span className="h-kicker text-[#eaf1f6]/55">{c.unit}</span>
              </div>

              {/* Hairline */}
              <div className="h-px bg-gradient-to-r from-[#58c3e8]/40 via-[#58c3e8]/15 to-transparent mb-8" />

              {/* Objective */}
              <p className="body-luxe text-sm text-[#eaf1f6]/75 mb-8 leading-relaxed">
                {c.objective}
              </p>

              {/* Includes */}
              <ul className="space-y-3 text-sm text-[#eaf1f6]/90 mb-10 flex-1">
                {c.includes.map((it, j) => (
                  <li key={j} className="flex gap-3 items-start">
                    <span
                      aria-hidden
                      className="mt-1.5 inline-flex items-center justify-center w-4 h-4 shrink-0"
                    >
                      <svg viewBox="0 0 16 16" fill="none" stroke="#58c3e8" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 8.5l3 3 7-8" />
                      </svg>
                    </span>
                    {it}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href="#join"
                className={clsx(
                  "mt-auto inline-flex items-center justify-between gap-3 px-6 py-4 text-xs uppercase tracking-[0.28em] transition-all duration-300 rounded-full",
                  c.highlight
                    ? "bg-[#58c3e8] text-[#042b59] hover:bg-[#eaf1f6]"
                    : "border border-[#58c3e8]/50 text-[#58c3e8] hover:bg-[#58c3e8] hover:text-[#042b59] hover:border-[#58c3e8]"
                )}
              >
                <span>Talk to us</span>
                <span
                  aria-hidden
                  className={clsx(
                    "inline-flex items-center justify-center w-7 h-7 rounded-full transition-transform duration-300 group-hover:translate-x-1",
                    c.highlight ? "bg-[#042b59] text-[#58c3e8]" : "bg-[#58c3e8]/15 text-[#58c3e8]"
                  )}
                >
                  →
                </span>
              </a>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
