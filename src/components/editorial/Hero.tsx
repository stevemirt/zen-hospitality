"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { useTranslations } from "next-intl";

/**
 * Hero — follows the PDF brief design.
 * - Fullbleed aerial drone photo of a Costa Rica resort (Timeline-3 image)
 * - Brand mark top-left, nav top-right
 * - Big white editorial headline bottom-left
 * - Cyan pill CTA "Form"
 * - Cinematic letterbox reveal + curtain text reveal + slow Ken Burns
 */
export function Hero() {
  const t = useTranslations("hero");
  const wrapRef = useRef<HTMLDivElement | null>(null);

  // Mouse-follow parallax on the photo for a luxury feel
  useEffect(() => {
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
      wrap.style.setProperty("--mx", `${cx * 14}px`);
      wrap.style.setProperty("--my", `${cy * 14}px`);
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
      className="relative z-10 h-[100svh] min-h-[680px] w-full overflow-hidden bg-[#042b59]"
      style={{ "--mx": "0px", "--my": "0px" } as CSSProperties}
    >
      {/* Fullbleed hero photo */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-[-5%] kenburns-hero"
          style={{ transform: "translate3d(calc(var(--mx) * -1), calc(var(--my) * -1), 0)" }}
        >
          {/* Plain img — bypasses next/image (which CSP-blocks inside preview iframes) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/zen/aerial-resort.jpg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            fetchPriority="high"
            decoding="async"
          />
        </div>
        {/* Fixed foreground hairlines — they stay put while photo drifts (parallax tension) */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
        >
          <span
            className="absolute bottom-[18%] left-[6%] block h-px w-[220px] bg-[#58c3e8]/45 origin-left"
            style={{ transform: "rotate(-22deg)" }}
          />
          <span
            className="absolute bottom-[18%] left-[6%] block w-2 h-2 rounded-full bg-[#58c3e8] shadow-[0_0_24px_rgba(88,195,232,0.8)] animate-zen-breath"
          />
        </div>

        {/* Cinematic gradient veil for legibility */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(4,43,89,0.30) 0%, rgba(4,43,89,0.05) 40%, rgba(0,0,0,0.65) 100%)",
          }}
        />
        {/* Side fade for editorial readability of left-aligned headline */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.05) 45%, rgba(0,0,0,0) 100%)",
          }}
        />
      </div>

      {/* Foreground layout */}
      <div className="relative z-10 h-full flex flex-col px-6 md:px-10 lg:px-16">
        {/* Top hairline strip (under nav) */}
        <div className="pt-28 md:pt-36">
          <div className="mx-auto max-w-[1700px] flex items-center justify-between">
            <div className="flex items-center gap-4 text-[10px] md:text-xs tracking-[0.42em] uppercase text-[#eaf1f6]/90">
              <span aria-hidden className="h-px w-12 bg-[#58c3e8]/80" />
              <span className="title">{t("eyebrow")} · Costa Rica</span>
            </div>
            <div className="hidden md:flex items-center gap-3 text-[10px] tracking-[0.42em] uppercase text-[#eaf1f6]/65">
              <span>N 10°37′</span>
              <span aria-hidden className="h-px w-6 bg-[#eaf1f6]/35" />
              <span>W 85°45′</span>
            </div>
          </div>
        </div>

        {/* Center / bottom — editorial headline */}
        <div className="flex-1 flex flex-col justify-end pb-12 md:pb-20 mx-auto max-w-[1700px] w-full">
          <h1 className="curtain-reveal h-display text-[clamp(2.6rem,8.6vw,9rem)] max-w-[16ch] text-[#eaf1f6] drop-shadow-[0_4px_36px_rgba(0,0,0,0.55)]">
            {t("headline")}
          </h1>

          <div
            className="mt-10 flex flex-wrap items-end gap-6"
            style={{ animation: "zen-curtain 1.4s cubic-bezier(0.7, 0, 0.3, 1) 1.85s both" }}
          >
            <a
              href="#join"
              className="group inline-flex items-center gap-3 bg-[#58c3e8] hover:bg-[#eaf1f6] text-[#042b59] px-9 py-4 text-sm md:text-base font-medium tracking-[0.04em] rounded-full transition-all duration-300 shadow-[0_8px_32px_rgba(88,195,232,0.35)]"
            >
              {t("cta")}
              <span
                aria-hidden
                className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#042b59] text-[#58c3e8] text-[10px] transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </a>
            <p className="max-w-md text-sm md:text-base text-[#eaf1f6]/90 leading-relaxed">
              {t("sub")}
            </p>
          </div>
        </div>

        {/* Bottom — scroll glyph */}
        <div className="pb-8 md:pb-10">
          <div className="mx-auto max-w-[1700px] flex items-end justify-between">
            <div className="text-[10px] tracking-[0.42em] uppercase text-[#eaf1f6]/55">
              <div className="opacity-60 mb-1">{t("eyebrow")}</div>
              <div className="title">— since 2024</div>
            </div>
            <div className="flex items-center gap-4 text-[10px] md:text-xs uppercase tracking-[0.32em] text-[#eaf1f6]/80">
              <span>{t("scrollHint")}</span>
              <span
                aria-hidden
                className="block w-px h-12 bg-gradient-to-b from-transparent via-[#eaf1f6] to-transparent animate-zen-breath"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
