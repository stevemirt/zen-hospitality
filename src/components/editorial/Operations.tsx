"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import clsx from "clsx";

type Card = { title: string; cta: string; href: string };

/**
 * "Our Operations" — wide aerial beach banner with brand mark + tagline.
 * Below, 4 nav cards (alternating cyan / dark navy) per the PDF design.
 */
export function Operations() {
  const tNav = useTranslations("nav");
  const banner = useRef<HTMLDivElement | null>(null);
  const photo = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = banner.current;
    const img = photo.current;
    if (!section || !img) return;
    let raf = 0;
    const update = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = 1 - (rect.top + rect.height / 2) / (vh + rect.height / 2);
      const py = (Math.max(-0.4, Math.min(1.2, progress)) - 0.5) * 60;
      img.style.transform = `translate3d(0, ${py}px, 0) scale(1.08)`;
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

  const cards: Card[] = [
    { title: "A Locally Rooted Approach that Enriches Every Stay", cta: "Find perfect destination", href: "#locally-rooted" },
    { title: "What would your guest experience would look like?", cta: "Find perfect destination", href: "#guest-experience" },
    { title: "Beyond the Stay Program", cta: "Find perfect destination", href: "#beyond-the-stay" },
    { title: "FAQS", cta: "Find perfect destination", href: "#faqs" },
  ];

  return (
    <section id="operations" className="relative z-10">
      {/* Aerial beach banner with brand mark + tagline — explicit min-height locks reserved space against CLS */}
      <div
        ref={banner}
        className="relative h-[55vh] md:h-[68vh] min-h-[440px] md:min-h-[600px] w-full overflow-hidden bg-[#042b59]"
      >
        <div ref={photo} className="absolute inset-[-6%] will-change-transform">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/zen/aerial-beach.jpg"
            alt="Aerial of a Costa Rica Pacific beach"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, rgba(4,43,89,0.55) 0%, rgba(4,43,89,0.10) 60%, rgba(0,0,0,0.45) 100%)",
          }}
        />

        <div className="relative z-10 h-full mx-auto max-w-[1500px] px-6 lg:px-10 flex flex-col justify-between py-16 md:py-20">
          <div>
            <h2 className="h-display text-[clamp(2.6rem,6.8vw,6.6rem)] text-[#eaf1f6]">
              Our
              <br />
              <span className="h-italic text-[#58c3e8]">Operations.</span>
            </h2>
            <div className="mt-8 h-kicker text-[#58c3e8]">
              Zen Hospitality · Performance
            </div>
          </div>
          <div className="ml-auto text-right">
            <div className="h-kicker text-[#58c3e8] mb-3 opacity-80">Next chapter</div>
            <div className="h-title text-2xl md:text-3xl text-[#eaf1f6] mb-3">
              Your Property Journey with Zen Hospitality
            </div>
            <a
              href="#journey"
              className="inline-flex items-center gap-2 text-xs md:text-sm uppercase tracking-[0.28em] text-[#58c3e8] hover:text-[#eaf1f6] transition-colors duration-200"
            >
              Click to see more information
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </div>

      {/* 4 nav cards — alternating cyan / midnight */}
      <div className="grid grid-cols-1 md:grid-cols-2 bg-[#042b59]">
        {cards.map((c, i) => {
          const cyanCard = i === 0 || i === 3;
          return (
            <a
              key={i}
              href={c.href}
              className={clsx(
                "group block px-8 md:px-12 py-14 md:py-20 transition-colors duration-300",
                cyanCard
                  ? "bg-[#58c3e8] text-[#042b59] hover:bg-[#eaf1f6]"
                  : "bg-[#042b59] text-[#eaf1f6] hover:bg-[#0a3a73] border-l border-r border-[#58c3e8]/0"
              )}
            >
              <h3 className="h-title text-xl md:text-2xl mb-4 leading-tight max-w-md">
                {c.title}
              </h3>
              <span
                className={clsx(
                  "inline-flex items-center gap-3 text-xs uppercase tracking-[0.28em] transition-all duration-300",
                  cyanCard ? "text-[#042b59]/80" : "text-[#58c3e8]"
                )}
              >
                {c.cta}
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
