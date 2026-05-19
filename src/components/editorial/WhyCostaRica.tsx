"use client";

import { useTranslations } from "next-intl";
import { Section } from "./Section";
import { Reveal } from "@/components/ui/Reveal";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { CostaRicaMap } from "./CostaRicaMap";

export function WhyCostaRica() {
  const t = useTranslations("whyCostaRica");
  const paragraphs = t.raw("paragraphs") as string[];
  const stats = t.raw("stats") as Array<{ value: string; label: string }>;

  return (
    <Section id="why-costa-rica" tone="midnight">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-center">
        {/* Left — title + copy */}
        <div className="lg:col-span-5">
          <Reveal>
            <div className="h-kicker text-[#58c3e8] mb-5 inline-flex items-center gap-3">
              <span aria-hidden className="h-px w-10 bg-[#58c3e8]" />
              {t("locationKicker")}
            </div>
          </Reveal>
          <Reveal delayMs={80}>
            <h2 className="h-display text-[clamp(2.4rem,5.6vw,5rem)] text-[#eaf1f6] mb-8">
              {t("headlineLine1")}
              <br />
              <span className="h-italic text-[#58c3e8]">{t("headlineLine2")}</span>
            </h2>
          </Reveal>
          {paragraphs.map((p, i) => (
            <Reveal key={i} delayMs={i * 120}>
              <p className="body-luxe text-base md:text-lg text-[#eaf1f6]/80 mb-6 max-w-md">
                {p}
              </p>
            </Reveal>
          ))}
        </div>

        {/* Right — animated radar map */}
        <div className="lg:col-span-7">
          <Reveal>
            <CostaRicaMap />
          </Reveal>
        </div>
      </div>

      {/* Stats row — large cyan numbers, two metrics centered */}
      <div className="mt-20 md:mt-28 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 border-t border-[#58c3e8]/25 pt-12 max-w-3xl mx-auto">
        {stats.map((s, i) => (
          <Reveal key={i} delayMs={i * 100}>
            <div className="flex flex-col items-center text-center">
              <AnimatedNumber
                value={s.value}
                className="h-display text-5xl md:text-7xl text-[#58c3e8] tabular-nums"
              />
              <div className="mt-4 h-kicker text-[#eaf1f6]/75">{s.label}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
