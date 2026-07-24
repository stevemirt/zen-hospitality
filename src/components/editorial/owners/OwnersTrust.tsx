"use client";

import { useTranslations } from "next-intl";
import { Section } from "../Section";
import { Reveal } from "@/components/ui/Reveal";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

type Stat = { value: string; label: string };

export function OwnersTrust() {
  const t = useTranslations("owners.trust");
  const stats = t.raw("stats") as Stat[];
  const bullets = t.raw("guestBullets") as string[];

  return (
    <Section id="owners-trust" tone="midnight">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <Reveal>
            <div className="h-kicker text-[#58c3e8] inline-flex items-center gap-3">
              <span aria-hidden className="h-px w-10 bg-[#58c3e8]" />
              {t("kicker")}
              <span aria-hidden className="h-px w-10 bg-[#58c3e8]" />
            </div>
          </Reveal>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 border-b border-[#58c3e8]/25 pb-14 mb-14 max-w-3xl mx-auto">
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

        {/* 3 guest experience bullets */}
        <div className="grid gap-8 md:grid-cols-3">
          {bullets.map((b, i) => (
            <Reveal key={i} delayMs={i * 120}>
              <div className="text-center md:text-left">
                <div className="h-display text-3xl text-[#58c3e8] mb-4 tabular-nums">
                  0{i + 1}
                </div>
                <p className="body-luxe text-sm md:text-base text-[#eaf1f6]/75 leading-relaxed">
                  {b}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
