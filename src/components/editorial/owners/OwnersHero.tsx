"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { useTranslations } from "next-intl";

/**
 * Full-bleed cinematic hero for the /owners outreach landing.
 * Reuses the same visual pattern as the homepage Hero component but with
 * copy focused on property owners rather than guests.
 */
export function OwnersHero() {
  const t = useTranslations("owners.hero");
  const wrapRef = useRef<HTMLDivElement | null>(null);

  // Mouse-follow parallax on the photo — desktop only
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) return;
    const wrap = wrapRef.current;
    if (!wrap) return;
    let raf = 0;
    let tx = 0,
      ty = 0,
      cx = 0,
      cy = 0;
    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      tx = (e.clientX - r.left - r.width / 2) / r.width;
      ty = (e.clientY - r.top - r.height / 2) / r.height;
    };
    const loop = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      wrap.style.setProperty("--mx", `${cx * 12}px`);
      wrap.style.setProperty("--my", `${cy * 12}px`);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("pointermove", onMove);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <section
      ref={wrapRef}
      className="relative z-10 h-[92svh] min-h-[640px] w-full overflow-hidden bg-[#042b59]"
      style={{ "--mx": "0px", "--my": "0px" } as CSSProperties}
    >
      {/* Fullbleed hero photo */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-[-5%] kenburns-hero"
          style={{ transform: "translate3d(calc(var(--mx) * -1), calc(var(--my) * -1), 0)" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/zen/aerial-resort.jpg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-[50%_32%] md:object-[50%_38%]"
            fetchPriority="high"
            decoding="async"
          />
        </div>
        {/* Cinematic veil */}
        <div
          className="absolute inset-0 pointer-events-none md:hidden"
          style={{
            background:
              "linear-gradient(180deg, rgba(4,43,89,0.55) 0%, rgba(4,43,89,0.15) 35%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0.92) 100%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none hidden md:block"
          style={{
            background:
              "linear-gradient(180deg, rgba(4,43,89,0.30) 0%, rgba(4,43,89,0.05) 40%, rgba(0,0,0,0.70) 100%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.10) 45%, rgba(0,0,0,0) 100%)",
          }}
        />
      </div>

      {/* Foreground */}
      <div className="relative z-10 h-full flex flex-col px-6 md:px-10 lg:px-16">
        <div className="pt-28 md:pt-36">
          <div className="mx-auto max-w-[1700px] flex items-center gap-4 text-[10px] md:text-xs tracking-[0.42em] uppercase text-[#eaf1f6]/90">
            <span aria-hidden className="h-px w-12 bg-[#58c3e8]/80" />
            <span>{t("eyebrow")} · Costa Rica</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-end pb-16 md:pb-24 mx-auto max-w-[1700px] w-full">
          <h1 className="curtain-reveal h-display text-[clamp(2.6rem,8vw,8.6rem)] max-w-[16ch] text-[#eaf1f6] drop-shadow-[0_4px_36px_rgba(0,0,0,0.55)]">
            {t("headlineLine1")}
            <br />
            <span className="h-italic text-[#58c3e8]">{t("headlineLine2")}</span>
          </h1>

          <div
            className="mt-10 flex flex-wrap items-end gap-6"
            style={{ animation: "zen-curtain 1.4s cubic-bezier(0.7, 0, 0.3, 1) 1.85s both" }}
          >
            <a
              href="#owners-cta"
              className="group inline-flex items-center gap-3 bg-[#58c3e8] hover:bg-[#eaf1f6] text-[#042b59] px-9 py-4 text-sm md:text-base font-medium tracking-[0.04em] rounded-full transition-all duration-300 shadow-[0_8px_32px_rgba(88,195,232,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#eaf1f6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#042b59]"
            >
              {t("ctaLabel")}
              <span
                aria-hidden
                className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#042b59] text-[#58c3e8] text-[10px] transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </a>
            <div className="max-w-md">
              <p className="text-sm md:text-base text-[#eaf1f6]/90 leading-relaxed mb-2">{t("sub")}</p>
              <p className="text-[10px] md:text-[11px] uppercase tracking-[0.32em] text-[#58c3e8]/85 font-medium">
                {t("trustLine")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
