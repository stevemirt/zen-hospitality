"use client";

import { useTranslations } from "next-intl";
import { Section } from "../Section";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Impact / "Beyond the stay" quote block. Reuses the Beyond the Stay
 * headline quote to link the outreach message with the site's sustainability
 * story, and shows the 3 NGO partner logos as small trust marks.
 */
export function OwnersImpact() {
  const t = useTranslations("owners.impact");

  return (
    <Section id="owners-impact" tone="light" spacing="compact">
      <div className="max-w-4xl mx-auto text-center">
        <Reveal>
          <div className="h-kicker text-[#58c3e8] mb-8 inline-flex items-center gap-3">
            <span aria-hidden className="h-px w-10 bg-[#58c3e8]" />
            {t("kicker")}
            <span aria-hidden className="h-px w-10 bg-[#58c3e8]" />
          </div>
        </Reveal>
        <Reveal delayMs={100}>
          <blockquote className="h-italic text-[clamp(1.6rem,3vw,2.6rem)] text-[#042b59] leading-[1.3] mb-6">
            &ldquo;{t("quote")}&rdquo;
          </blockquote>
        </Reveal>
        <Reveal delayMs={180}>
          <div className="h-kicker text-[#58c3e8]/85 mb-12">{t("quoteAttr")}</div>
        </Reveal>

        <Reveal delayMs={240}>
          <p className="body-luxe text-base md:text-lg text-[#042b59]/70 max-w-2xl mx-auto mb-10">
            {t("closing")}
          </p>
        </Reveal>

        {/* NGO logos row */}
        <Reveal delayMs={320}>
          <div className="flex items-center justify-center gap-10 md:gap-14 flex-wrap">
            {[
              { src: "/zen/ngos/cepia.png", alt: "CEPIA" },
              { src: "/zen/ngos/cleanwave.png", alt: "The Clean Wave" },
              { src: "/zen/ngos/sibu.png", alt: "Sibu Wildlife Sanctuary" },
            ].map((ngo) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={ngo.alt}
                src={ngo.src}
                alt={ngo.alt}
                loading="lazy"
                decoding="async"
                className="h-12 md:h-16 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity duration-300 select-none"
                draggable={false}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
