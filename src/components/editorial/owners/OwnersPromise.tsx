"use client";

import { useTranslations } from "next-intl";
import { Section } from "../Section";
import { Reveal } from "@/components/ui/Reveal";

type Pillar = { title: string; body: string };

export function OwnersPromise() {
  const t = useTranslations("owners.promise");
  const pillars = t.raw("pillars") as Pillar[];

  return (
    <Section id="owners-promise" tone="light">
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-20 items-start">
        {/* Left — kicker + headline + body */}
        <div className="lg:col-span-5 lg:sticky lg:top-32">
          <Reveal>
            <div className="h-kicker text-[#58c3e8] mb-6 inline-flex items-center gap-3">
              <span aria-hidden className="h-px w-10 bg-[#58c3e8]" />
              {t("kicker")}
            </div>
          </Reveal>
          <Reveal delayMs={80}>
            <h2 className="h-display text-[clamp(2.4rem,5.4vw,5rem)] text-[#042b59] mb-8">
              {t("headline")}
              <br />
              <span className="h-italic text-[#58c3e8]">{t("headlineHighlight")}</span>
            </h2>
          </Reveal>
          <Reveal delayMs={160}>
            <p className="body-luxe text-base md:text-lg text-[#042b59]/75 leading-relaxed max-w-md">
              {t("body")}
            </p>
          </Reveal>
        </div>

        {/* Right — 3 pillars, numbered */}
        <div className="lg:col-span-7">
          <div className="grid gap-8 md:gap-10">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delayMs={200 + i * 120}>
                <article className="grid grid-cols-[64px_1fr] md:grid-cols-[88px_1fr] gap-5 md:gap-8 items-start pb-8 md:pb-10 border-b border-[#042b59]/12 last:border-b-0">
                  <div className="h-display text-4xl md:text-5xl text-[#58c3e8] tabular-nums leading-none">
                    0{i + 1}
                  </div>
                  <div>
                    <h3 className="h-title text-lg md:text-xl text-[#042b59] mb-3">{p.title}</h3>
                    <p className="body-luxe text-sm md:text-base text-[#042b59]/70 leading-relaxed max-w-xl">
                      {p.body}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
