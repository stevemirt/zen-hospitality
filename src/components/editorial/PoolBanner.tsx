"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

/**
 * Cinematic fullbleed pool banner with scroll-driven motion:
 * - Background scales 1.04 → 1.18 as you scroll through it
 * - Vertical parallax (slower than scroll)
 * - A swept gradient overlay that lights up
 * - Editorial caption that fades + slides in
 * - Coordinate overlay top-right, dimension top-left
 */
export function PoolBanner() {
  const tAlt = useTranslations("alt");
  const t = useTranslations("poolBanner");
  const wrap = useRef<HTMLDivElement | null>(null);
  const img = useRef<HTMLDivElement | null>(null);
  const captionRef = useRef<HTMLDivElement | null>(null);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const section = wrap.current;
    const el = img.current;
    const cap = captionRef.current;
    if (!section || !el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setArmed(true);
            obs.disconnect();
          }
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(section);

    let raf = 0;
    const update = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh;
      const seen = vh - rect.top;
      const progress = Math.max(0, Math.min(1, seen / total));

      // Scale: 1.04 → 1.18 linearly across the section
      const scale = 1.04 + progress * 0.14;
      // Vertical parallax: -80px to +20px
      const py = -80 + progress * 100;

      el.style.transform = `translate3d(0, ${py}px, 0) scale(${scale})`;

      // Caption fades in 20-70%
      if (cap) {
        const o = Math.max(0, Math.min(1, (progress - 0.18) / 0.4));
        cap.style.opacity = String(o);
        cap.style.transform = `translate3d(0, ${(1 - o) * 24}px, 0)`;
      }

      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      obs.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={wrap}
      className="relative z-10 h-[85vh] md:h-[95vh] w-full overflow-hidden bg-[#042b59]"
    >
      {/* Photo with parallax + scale */}
      <div ref={img} className="absolute inset-[-8%] will-change-transform">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/zen/hero-pool.jpg"
          alt={tAlt("pool")}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Soft cinematic veil — bottom-heavy for caption legibility */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.0) 30%, rgba(0,0,0,0.0) 60%, rgba(0,0,0,0.75) 100%)",
        }}
      />

      {/* Swept light line — cinematic flash */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none overflow-hidden"
      >
        <div
          className={armed ? "zen-sweep-flash" : ""}
          style={{
            position: "absolute",
            top: "30%",
            left: 0,
            right: 0,
            height: "40%",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)",
            transform: "translateX(-100%)",
          }}
        />
      </div>

      {/* Editorial overlays */}
      <div className="relative z-10 h-full flex flex-col justify-between p-8 md:p-12 lg:p-16">
        {/* Top — meta strip */}
        <div className="flex items-start justify-between">
          <div className="text-[#eaf1f6]">
            <div className="h-kicker opacity-65 mb-2">{t("frameLabel")}</div>
            <div className="h-italic text-base md:text-lg">{t("frameTitle")}</div>
          </div>
          <div className="text-right text-[#eaf1f6]">
            <div className="h-kicker opacity-65 mb-2">{t("coordsLabel")}</div>
            <div className="h-eyebrow text-[#58c3e8]">9°44′ N · 85°67′ W</div>
          </div>
        </div>

        {/* Bottom — drift caption */}
        <div
          ref={captionRef}
          className="max-w-3xl"
          style={{ opacity: 0, transform: "translate3d(0, 24px, 0)" }}
        >
          <h2 className="h-display text-[#eaf1f6] text-[clamp(2.5rem,6.5vw,6.5rem)] mb-4">
            {t("headlineLine1")}
            <br />
            <span className="h-italic text-[#58c3e8]">{t("headlineLine2")}</span>
          </h2>
          <p className="body-luxe text-[#eaf1f6]/85 text-base md:text-lg max-w-xl">
            {t("body")}
          </p>
        </div>
      </div>
    </section>
  );
}
