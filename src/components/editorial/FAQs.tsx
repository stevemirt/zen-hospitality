"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Section } from "./Section";
import { Reveal } from "@/components/ui/Reveal";
import { BackToSection } from "@/components/ui/BackToSection";
import clsx from "clsx";

type Item = { q: string; a: string };

// Group the 19 questions into 4 thematic buckets by index
type CategoryKey = "returns" | "operations" | "income" | "legal";
const CATEGORY_DEFS: Array<{ key: CategoryKey; indices: number[] }> = [
  { key: "returns", indices: [0, 1, 2, 3] },
  { key: "operations", indices: [4, 5, 6, 7, 8] },
  { key: "income", indices: [9, 12, 13, 14, 15] },
  { key: "legal", indices: [10, 11, 16, 17, 18] },
];

export function FAQs() {
  const t = useTranslations("faqs");
  const nav = useTranslations("nav");
  const items = t.raw("items") as Item[];
  const categories = CATEGORY_DEFS.map((c) => ({
    ...c,
    label: t(`categories.${c.key}`),
  }));
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [activeCat, setActiveCat] = useState<string>("returns");
  const catRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Auto-sync sidebar to scroll position
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const key = e.target.getAttribute("data-cat");
            if (key) setActiveCat(key);
          }
        }
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    );
    Object.values(catRefs.current).forEach((el) => {
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <Section id="faqs" tone="midnight">
      <BackToSection href="#operations" label={nav("backToOperations")} tone="midnight" />
      {/* Header */}
      <div className="text-center mb-20 md:mb-24 max-w-3xl mx-auto">
        <Reveal>
          <div className="h-kicker text-[#58c3e8] mb-6 inline-flex items-center gap-3">
            <span aria-hidden className="h-px w-10 bg-[#58c3e8]" />
            {t("kicker")}
            <span aria-hidden className="h-px w-10 bg-[#58c3e8]" />
          </div>
        </Reveal>
        <Reveal delayMs={100}>
          <h2 className="h-display text-[clamp(2.4rem,5.4vw,4.8rem)] text-[#eaf1f6] mb-6">
            {t("headlineLine1")}
            <br />
            <span className="h-italic text-[#58c3e8]">{t("headlineLine2")}</span>
          </h2>
        </Reveal>
        <Reveal delayMs={180}>
          <p className="body-luxe text-base md:text-lg text-[#eaf1f6]/65">
            {t("descriptorTemplate", { count: items.length })}
          </p>
        </Reveal>
      </div>

      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        {/* Left — sticky category navigator */}
        <aside className="lg:col-span-3">
          <div className="lg:sticky lg:top-32">
            <div className="h-kicker text-[#58c3e8]/65 mb-5">{t("browseBy")}</div>
            <nav className="space-y-3">
              {categories.map((c, idx) => (
                <a
                  key={c.key}
                  href={`#cat-${c.key}`}
                  onClick={() => setActiveCat(c.key)}
                  className={clsx(
                    "group flex items-center justify-between gap-3 py-3 border-b transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#58c3e8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#042b59]",
                    activeCat === c.key
                      ? "border-[#58c3e8] text-[#58c3e8]"
                      : "border-[#eaf1f6]/12 text-[#eaf1f6]/75 hover:border-[#58c3e8]/60 hover:text-[#eaf1f6]"
                  )}
                >
                  <span className="h-title text-sm md:text-base">{c.label}</span>
                  <span className="h-kicker text-[#58c3e8]/70 tabular-nums">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Middle — categorized accordion */}
        <div className="lg:col-span-6">
          {categories.map((c, cIdx) => (
            <div
              key={c.key}
              id={`cat-${c.key}`}
              data-cat={c.key}
              ref={(el) => {
                catRefs.current[c.key] = el;
              }}
              className={clsx(
                "scroll-mt-28 md:scroll-mt-32",
                cIdx > 0 && "mt-14 md:mt-20"
              )}
            >
              <div className="flex items-center gap-4 mb-6">
                <span className="h-kicker text-[#58c3e8] tabular-nums">
                  {String(cIdx + 1).padStart(2, "0")} ·
                </span>
                <h3 className="h-display text-xl md:text-2xl text-[#eaf1f6]">{c.label}</h3>
                <span aria-hidden className="flex-1 h-px bg-[#58c3e8]/15" />
              </div>

              <div className="divide-y divide-[#eaf1f6]/10">
                {c.indices.map((qIdx) => {
                  const item = items[qIdx];
                  if (!item) return null;
                  const isOpen = openIdx === qIdx;
                  return (
                    <article key={qIdx}>
                      <button
                        type="button"
                        onClick={() => setOpenIdx(isOpen ? null : qIdx)}
                        className="w-full flex items-start gap-5 md:gap-7 py-7 text-left group transition-colors duration-200"
                        aria-expanded={isOpen}
                      >
                        <span
                          className={clsx(
                            "shrink-0 h-display text-2xl md:text-3xl tabular-nums transition-colors duration-300",
                            isOpen ? "text-[#58c3e8]" : "text-[#58c3e8]/40 group-hover:text-[#58c3e8]/80"
                          )}
                        >
                          {String(qIdx + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={clsx(
                            "flex-1 h-title text-base md:text-lg leading-snug transition-colors duration-300",
                            isOpen ? "text-[#58c3e8]" : "text-[#eaf1f6] group-hover:text-[#58c3e8]"
                          )}
                        >
                          {item.q}
                        </span>
                        <span
                          aria-hidden
                          className={clsx(
                            "shrink-0 w-9 h-9 inline-flex items-center justify-center rounded-full border transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                            isOpen
                              ? "border-[#58c3e8] bg-[#58c3e8] text-[#042b59] rotate-45"
                              : "border-[#eaf1f6]/25 text-[#eaf1f6]/75 group-hover:border-[#58c3e8] group-hover:text-[#58c3e8]"
                          )}
                        >
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.3" />
                          </svg>
                        </span>
                      </button>
                      <div
                        className={clsx(
                          "grid transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                          isOpen ? "grid-rows-[1fr] opacity-100 pb-7" : "grid-rows-[0fr] opacity-0"
                        )}
                      >
                        <div className="overflow-hidden">
                          <p className="ml-[3.6rem] md:ml-[4.2rem] body-luxe text-sm md:text-base text-[#eaf1f6]/70 leading-relaxed pr-6">
                            {item.a}
                          </p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Right — sticky contact photo */}
        <aside className="lg:col-span-3 hidden lg:block">
          <div className="lg:sticky lg:top-32">
            <div className="relative aspect-[3/4] overflow-hidden mb-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/zen/stock/sunset-pool.jpg"
                alt=""
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#042b59]/85 via-[#042b59]/15 to-transparent" />
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <span className="h-kicker text-[#eaf1f6]/85 inline-flex items-center gap-2">
                  <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-[#58c3e8] animate-pulse" />
                  {t("directContact")}
                </span>
                <div>
                  <p className="h-italic text-lg text-[#eaf1f6] mb-3 leading-tight">
                    {t("stillCurious")}
                  </p>
                  <a
                    href="mailto:hello@zenhospitality.com"
                    className="block h-title text-sm md:text-base text-[#58c3e8] hover:text-[#eaf1f6] transition-colors break-all"
                  >
                    hello@zenhospitality.com
                  </a>
                </div>
              </div>
            </div>
            <p className="body-luxe text-xs text-[#eaf1f6]/55 leading-relaxed">
              {t("contactBody")}
            </p>
          </div>
        </aside>
      </div>
    </Section>
  );
}
