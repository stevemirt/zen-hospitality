"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Section } from "./Section";
import { Reveal } from "@/components/ui/Reveal";
import clsx from "clsx";

type Step = { n: string; title: string; when: string; body: string };

/**
 * Photo per step — cycles real Zen Hospitality photography as you scroll through steps.
 */
const STEP_PHOTOS = [
  "/zen/aerial-resort.jpg",
  "/zen/interior-living.jpg",
  "/zen/interior-bedroom.jpg",
  "/zen/stock/tamarindo-sunset.jpg",
  "/zen/hero-pool.jpg",
];

const STEP_ICONS: Record<number, React.ReactNode> = {
  0: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="16" r="11" />
      <circle cx="16" cy="16" r="7" />
      <circle cx="16" cy="16" r="3" />
      <circle cx="16" cy="16" r="1" fill="currentColor" />
    </svg>
  ),
  1: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <rect x="7" y="6" width="18" height="22" rx="1" />
      <path d="M11 4h10v4H11z" />
      <path d="M11 14l2 2 4-4M11 20l2 2 4-4" />
    </svg>
  ),
  2: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="10" width="24" height="16" rx="1" />
      <path d="M11 10l2-3h6l2 3" />
      <circle cx="16" cy="18" r="5" />
      <circle cx="16" cy="18" r="2" fill="currentColor" />
    </svg>
  ),
  3: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 3c5 3 7 8 7 14v4l-3 2-4-2-4 2-3-2v-4c0-6 2-11 7-14z" />
      <circle cx="16" cy="13" r="2" />
      <path d="M11 24l-3 4 4-2M21 24l3 4-4-2" />
    </svg>
  ),
  4: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 27h22" />
      <rect x="7" y="18" width="4" height="9" />
      <rect x="14" y="12" width="4" height="15" />
      <rect x="21" y="7" width="4" height="20" />
    </svg>
  ),
};

export function Journey() {
  const t = useTranslations("journey");
  const steps = t.raw("steps") as Step[];
  const stepRefs = useRef<Array<HTMLElement | null>>([]);
  const [activeStep, setActiveStep] = useState(0);

  // Track which step is in the viewport center
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio > 0.55) {
            const idx = Number(e.target.getAttribute("data-step"));
            setActiveStep(idx);
          }
        }
      },
      {
        threshold: [0.55],
        rootMargin: "-30% 0px -30% 0px",
      }
    );
    stepRefs.current.forEach((el) => {
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <Section id="journey" tone="mist">
      {/* Editorial header */}
      <div className="text-center mb-20 md:mb-28 max-w-3xl mx-auto">
        <Reveal>
          <div className="h-kicker text-[#58c3e8] mb-6 inline-flex items-center gap-3">
            <span aria-hidden className="h-px w-10 bg-[#58c3e8]" />
            {t("kicker")} · {t("stagesLabel")}
            <span aria-hidden className="h-px w-10 bg-[#58c3e8]" />
          </div>
        </Reveal>
        <Reveal delayMs={100}>
          <h2 className="h-display text-[clamp(2.6rem,6vw,5.6rem)] text-[#042b59] mb-6">
            {t("headlineLine1")}
            <br />
            <span className="h-italic text-[#58c3e8]">{t("headlineLine2")}</span>
          </h2>
        </Reveal>
        <Reveal delayMs={180}>
          <p className="body-luxe text-base md:text-lg text-[#042b59]/65">
            {t("introBody")}
          </p>
        </Reveal>
      </div>

      {/* Sticky photo + scrolling steps */}
      <div className="relative grid gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Sticky photo column */}
        <div className="lg:col-span-5 hidden lg:block">
          <div className="sticky top-32">
            <div className="relative aspect-[4/5] overflow-hidden bg-[#042b59]">
              {STEP_PHOTOS.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt=""
                  // eslint-disable-next-line jsx-a11y/alt-text
                  className={clsx(
                    "absolute inset-0 w-full h-full object-cover transition-all duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                    activeStep === i ? "opacity-100 scale-100" : "opacity-0 scale-110"
                  )}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-[#042b59]/40 via-transparent to-transparent" />
              <div className="absolute top-6 left-6 right-6 flex items-start justify-between text-[#eaf1f6]">
                <div>
                  <div className="h-kicker opacity-65 mb-1">{t("activeStepLabel")}</div>
                  <div className="h-display text-3xl tabular-nums">{steps[activeStep]?.n}</div>
                </div>
                <span aria-hidden className="inline-flex items-center gap-2 h-kicker">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#58c3e8] animate-pulse" />
                  {t("liveLabel")}
                </span>
              </div>
              {/* Step flash ribbon — animates each time activeStep changes */}
              <div
                key={`flash-${activeStep}`}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 zen-step-flash pointer-events-none"
              >
                <div className="bg-[#042b59]/85 backdrop-blur-sm border border-[#58c3e8]/40 px-6 py-3 rounded-full">
                  <span className="h-kicker text-[#58c3e8] tabular-nums">
                    {t("stepBadge")} {activeStep + 1} / {steps.length}
                  </span>
                </div>
              </div>
              <div className="absolute bottom-6 left-6 right-6 text-[#eaf1f6]">
                <div className="h-kicker opacity-65 mb-1">{steps[activeStep]?.when}</div>
                <div className="h-title text-lg">{steps[activeStep]?.title}</div>
              </div>
            </div>
            {/* Progress bar */}
            <div className="mt-6 flex items-center gap-2">
              {steps.map((_, i) => (
                <span
                  key={i}
                  className={clsx(
                    "h-px flex-1 transition-colors duration-500",
                    i <= activeStep ? "bg-[#58c3e8]" : "bg-[#042b59]/15"
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Scrolling steps column */}
        <div className="lg:col-span-7 relative">
          {/* Vertical curve connector */}
          <svg
            className="absolute left-9 md:left-11 top-0 h-full w-2 pointer-events-none hidden md:block"
            viewBox="0 0 4 1200"
            preserveAspectRatio="none"
            aria-hidden
          >
            <line
              x1="2"
              y1="0"
              x2="2"
              y2="1200"
              stroke="#58c3e8"
              strokeOpacity="0.20"
              strokeDasharray="2 4"
            />
          </svg>

          <ol className="space-y-20 md:space-y-28">
            {steps.map((s, i) => (
              <li
                key={s.n}
                ref={(el) => {
                  stepRefs.current[i] = el;
                }}
                data-step={i}
                className="relative"
              >
                <Reveal>
                  <article className="flex items-start gap-6 md:gap-8">
                    {/* Step circle with icon */}
                    <div
                      className={clsx(
                        "shrink-0 relative w-20 h-20 md:w-24 md:h-24 rounded-full inline-flex items-center justify-center transition-all duration-500",
                        activeStep === i
                          ? "bg-[#042b59] text-[#58c3e8] scale-100 shadow-[0_8px_32px_rgba(4,43,89,0.25)]"
                          : "bg-white text-[#042b59]/35 scale-95 border border-[#042b59]/15"
                      )}
                    >
                      <div className="w-10 h-10 md:w-12 md:h-12">{STEP_ICONS[i]}</div>
                      {activeStep === i && (
                        <span
                          aria-hidden
                          className="absolute -top-2 -right-2 inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#58c3e8] text-[#042b59] text-[10px] font-medium tabular-nums shadow-[0_4px_12px_rgba(88,195,232,0.4)]"
                        >
                          {s.n}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-2">
                      <div
                        className={clsx(
                          "inline-flex items-center gap-3 px-4 py-1.5 rounded-full mb-4 transition-colors duration-500",
                          activeStep === i
                            ? "bg-[#58c3e8] text-[#042b59]"
                            : "bg-[#042b59]/8 text-[#042b59]/65"
                        )}
                      >
                        <span aria-hidden className="w-1 h-1 rounded-full bg-current" />
                        <span className="h-kicker">{s.when}</span>
                      </div>
                      <h3
                        className={clsx(
                          "h-display mb-4 transition-colors duration-500",
                          "text-[clamp(1.8rem,3.8vw,3rem)]",
                          activeStep === i ? "text-[#042b59]" : "text-[#042b59]/55"
                        )}
                      >
                        {s.title}
                      </h3>
                      <p className="body-luxe text-base md:text-lg text-[#042b59]/75 max-w-xl leading-relaxed">
                        {s.body}
                      </p>
                      <div className="mt-6 inline-flex items-center gap-2 h-kicker text-[#58c3e8]">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M2 7l3 3 7-7" />
                        </svg>
                        {t("approvedMilestone")}
                      </div>
                    </div>
                  </article>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
