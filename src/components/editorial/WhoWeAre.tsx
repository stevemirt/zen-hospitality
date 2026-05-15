"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Section } from "./Section";
import { Reveal } from "@/components/ui/Reveal";

export function WhoWeAre() {
  const t = useTranslations("whoWeAre");
  const values = t.raw("values") as Array<{ title: string; body: string }>;
  const vision = t.raw("vision") as { label: string; text: string };
  const promise = t.raw("promise") as { label: string; text: string };

  const banner = useRef<HTMLDivElement | null>(null);
  const photo = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const wrap = banner.current;
    const img = photo.current;
    if (!wrap || !img) return;
    let raf = 0;
    const update = () => {
      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh;
      const seen = vh - rect.top;
      const progress = Math.max(0, Math.min(1, seen / total));
      const py = -60 + progress * 80;
      const scale = 1.06 + progress * 0.08;
      img.style.transform = `translate3d(0, ${py}px, 0) scale(${scale})`;
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <Section id="who-we-are" tone="light">
      {/* Editorial header — centered, generous */}
      <div className="text-center mb-20 md:mb-28">
        <Reveal>
          <div className="h-kicker text-[#58c3e8] mb-8 inline-flex items-center gap-3">
            <span aria-hidden className="h-px w-10 bg-[#58c3e8]" />
            {t("kicker")}
            <span aria-hidden className="h-px w-10 bg-[#58c3e8]" />
          </div>
        </Reveal>
        <Reveal delayMs={100}>
          <h2 className="h-display text-[clamp(2.4rem,5.4vw,5rem)] text-[#042b59] max-w-5xl mx-auto mb-8">
            {t("headlineLine1")}
            <br />
            <span className="h-italic text-[#58c3e8]">{t("headlineLine2")}</span>
          </h2>
        </Reveal>
        <Reveal delayMs={180}>
          <p className="body-luxe text-base md:text-lg text-[#042b59]/70 max-w-3xl mx-auto">
            {t("lead")}
          </p>
        </Reveal>
      </div>

      {/* Banner photo with parallax + scale + editorial caption */}
      <Reveal>
        <div
          ref={banner}
          className="relative w-full overflow-hidden aspect-[4/3] md:aspect-[21/7] mb-24 md:mb-32"
        >
          <div ref={photo} className="absolute inset-[-8%] will-change-transform">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/zen/interior-living.jpg"
              alt="Open plan living room with ocean view at a Zen Reserve"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <div className="mx-auto max-w-[1400px] flex items-end justify-between text-[#eaf1f6]">
              <div>
                <div className="h-kicker opacity-65 mb-2">{t("bannerKicker")}</div>
                <div className="h-title text-xl md:text-2xl">{t("bannerTitle")}</div>
              </div>
              <div className="hidden md:block text-right">
                <div className="h-kicker opacity-65 mb-2">{t("bannerFrameLabel")}</div>
                <div className="h-eyebrow text-[#58c3e8]">01 / 03</div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Our values — numbered editorial cards */}
      <div className="mb-24 md:mb-32">
        <div className="flex items-baseline justify-between mb-12 md:mb-16">
          <Reveal>
            <h3 className="h-display text-[clamp(1.8rem,3.6vw,3rem)] text-[#042b59]">
              {t("valuesHeading")}
            </h3>
          </Reveal>
          <Reveal>
            <span className="h-kicker text-[#58c3e8]">{t("valuesSub")}</span>
          </Reveal>
        </div>
        <div className="grid gap-px bg-[#042b59]/10">
          {values.map((v, i) => (
            <Reveal key={i} delayMs={i * 120}>
              <article className="group bg-white py-10 md:py-14 transition-colors duration-300 hover:bg-[#eaf1f6]/40">
                <div className="grid gap-6 md:grid-cols-12 items-baseline">
                  <div className="md:col-span-2">
                    <div className="h-display text-4xl md:text-5xl text-[#58c3e8] tabular-nums">
                      0{i + 1}
                    </div>
                  </div>
                  <div className="md:col-span-3">
                    <h4 className="h-title text-xl md:text-2xl text-[#042b59]">
                      {v.title}
                    </h4>
                  </div>
                  <div className="md:col-span-7">
                    <p className="body-luxe text-base md:text-lg text-[#042b59]/70 max-w-2xl">
                      {v.body}
                    </p>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Vision + Promise — side-by-side with vertical hairline anchor */}
      <div className="grid gap-12 md:gap-16 md:grid-cols-2 max-w-6xl mx-auto items-start">
        {[vision, promise].map((q, i) => (
          <Reveal key={i} delayMs={i * 180}>
            <div className="relative pl-0 md:pl-14">
              {/* Desktop sidebar anchor: large numeral + tall cyan hairline */}
              <div className="hidden md:flex absolute left-0 top-0 bottom-2 flex-col items-center">
                <span className="h-display text-3xl text-[#58c3e8] mb-4 tabular-nums">
                  {i === 0 ? "I" : "II"}
                </span>
                <span
                  aria-hidden
                  className="flex-1 w-px bg-gradient-to-b from-[#58c3e8] via-[#58c3e8]/30 to-transparent"
                />
              </div>

              {/* Mobile-only numeral chip on top */}
              <div className="md:hidden inline-flex items-center justify-center w-12 h-12 rounded-full border border-[#58c3e8]/40 mb-6">
                <span className="h-display text-base text-[#58c3e8] tabular-nums">
                  {i === 0 ? "I" : "II"}
                </span>
              </div>

              <div className="h-kicker text-[#58c3e8] mb-5">{q.label}</div>
              <blockquote className="h-italic text-[clamp(1.4rem,2.4vw,2.1rem)] text-[#042b59] leading-[1.32]">
                {q.text}
              </blockquote>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
