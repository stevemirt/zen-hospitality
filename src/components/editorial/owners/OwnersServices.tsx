"use client";

import { useTranslations } from "next-intl";
import { Section } from "../Section";
import { Reveal } from "@/components/ui/Reveal";

type Discipline = { n: string; title: string; body: string };

export function OwnersServices() {
  const t = useTranslations("owners.services");
  const disciplines = t.raw("disciplines") as Discipline[];

  return (
    <Section id="owners-services" tone="midnight">
      <div className="text-center mb-20 md:mb-28 max-w-3xl mx-auto">
        <Reveal>
          <div className="h-kicker text-[#58c3e8] mb-6 inline-flex items-center gap-3">
            <span aria-hidden className="h-px w-10 bg-[#58c3e8]" />
            {t("kicker")}
            <span aria-hidden className="h-px w-10 bg-[#58c3e8]" />
          </div>
        </Reveal>
        <Reveal delayMs={80}>
          <h2 className="h-display text-[clamp(2.4rem,5.4vw,4.8rem)] text-[#eaf1f6] mb-6">
            {t("headline")}
            <br />
            <span className="h-italic text-[#58c3e8]">{t("headlineHighlight")}</span>
          </h2>
        </Reveal>
        <Reveal delayMs={160}>
          <p className="body-luxe text-base md:text-lg text-[#eaf1f6]/70 max-w-xl mx-auto">
            {t("sub")}
          </p>
        </Reveal>
      </div>

      {/* 10 disciplines · 5×2 grid, matching the site ServicesGrid visual */}
      <div className="grid gap-px bg-[#58c3e8]/15 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        {disciplines.map((d, i) => (
          <Reveal key={d.n} delayMs={i * 60}>
            <article className="group relative bg-[#042b59] p-6 md:p-7 h-full overflow-hidden hover:bg-[#0a3a73] transition-colors duration-300">
              <span
                aria-hidden
                className="absolute right-3 top-1 select-none pointer-events-none h-display text-[3.5rem] leading-none tabular-nums text-[#58c3e8]/10 group-hover:text-[#58c3e8]/20 transition-colors duration-500"
              >
                {d.n}
              </span>
              <h3 className="relative h-title text-sm md:text-base text-[#eaf1f6] leading-tight mb-2 mt-1">
                {d.title}
              </h3>
              <p
                className="relative body-luxe text-xs md:text-sm text-[#eaf1f6]/65 leading-relaxed overflow-hidden"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {d.body}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
