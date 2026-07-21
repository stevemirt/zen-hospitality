"use client";

import { useTranslations, useLocale } from "next-intl";
import { Section } from "../Section";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Final CTA. The primary button deep-links to the /#join form on the
 * home page (locale-prefixed), with ?ref=owners for downstream analytics.
 */
export function OwnersFinalCta() {
  const t = useTranslations("owners.finalCta");
  const locale = useLocale();
  const formHref = `/${locale}?ref=owners#join`;

  return (
    <Section id="owners-cta" tone="midnight">
      <div className="text-center max-w-3xl mx-auto">
        <Reveal>
          <div className="h-kicker text-[#58c3e8] mb-8 inline-flex items-center gap-3">
            <span aria-hidden className="h-px w-10 bg-[#58c3e8]" />
            {t("kicker")}
            <span aria-hidden className="h-px w-10 bg-[#58c3e8]" />
          </div>
        </Reveal>
        <Reveal delayMs={100}>
          <h2 className="h-display text-[clamp(2.6rem,6vw,5.6rem)] text-[#eaf1f6] mb-8">
            {t("headline")}
            <br />
            <span className="h-italic text-[#58c3e8]">{t("headlineHighlight")}</span>
          </h2>
        </Reveal>
        <Reveal delayMs={180}>
          <p className="body-luxe text-base md:text-lg text-[#eaf1f6]/75 mb-12 max-w-xl mx-auto">
            {t("sub")}
          </p>
        </Reveal>

        <Reveal delayMs={280}>
          <a
            href={formHref}
            className="group inline-flex items-center gap-3 bg-[#58c3e8] hover:bg-[#eaf1f6] text-[#042b59] px-10 py-5 text-base md:text-lg font-medium tracking-[0.04em] rounded-full transition-all duration-300 shadow-[0_12px_40px_rgba(88,195,232,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#eaf1f6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#042b59]"
          >
            {t("primary")}
            <span
              aria-hidden
              className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#042b59] text-[#58c3e8] text-xs transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </a>
        </Reveal>

        {/* Secondary contact rail */}
        <Reveal delayMs={360}>
          <div className="mt-14 grid gap-6 md:grid-cols-2 max-w-2xl mx-auto pt-10 border-t border-[#58c3e8]/20">
            <a
              href="https://wa.me/50687291276"
              target="_blank"
              rel="noopener noreferrer"
              className="group text-left md:text-right md:pr-8 md:border-r md:border-[#58c3e8]/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#58c3e8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#042b59] rounded-sm"
            >
              <div className="h-kicker text-[#58c3e8]/75 mb-2">{t("secondaryWhatsapp")}</div>
              <div className="text-lg text-[#eaf1f6] group-hover:text-[#58c3e8] transition-colors">
                +506 8729 1276
              </div>
            </a>
            <a
              href="mailto:eduardoc@zen-hospitality.com"
              className="group text-left md:pl-8 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#58c3e8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#042b59] rounded-sm"
            >
              <div className="h-kicker text-[#58c3e8]/75 mb-2">{t("secondaryEmail")}</div>
              <div className="text-lg text-[#eaf1f6] group-hover:text-[#58c3e8] transition-colors break-all">
                eduardoc@zen-hospitality.com
              </div>
            </a>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
