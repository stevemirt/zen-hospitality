"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Section } from "./Section";
import { Reveal } from "@/components/ui/Reveal";
import { BackToSection } from "@/components/ui/BackToSection";

// 5 symbolic icons for "A Locally Rooted Approach"
const LOCAL_ICONS = [
  // leaf network
  <svg key="leaf" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3c-5 0-9 4-9 9 0 5 4 9 9 9V3z" />
    <path d="M12 3v18M9 8l3 3 3-3M9 14l3 3 3-3" />
  </svg>,
  // sourcing — handshake
  <svg key="source" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12l4-4 3 1 3-3 4 2 4 4v6H3z" />
    <path d="M9 18v-3M15 18v-3" />
  </svg>,
  // local craft — basket
  <svg key="craft" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 9h16l-2 12H6L4 9z" />
    <path d="M8 9V5a4 4 0 0 1 8 0v4M4 14h16" />
  </svg>,
  // partnership ecosystem
  <svg key="eco" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <circle cx="5" cy="6" r="2" />
    <circle cx="19" cy="6" r="2" />
    <circle cx="5" cy="18" r="2" />
    <circle cx="19" cy="18" r="2" />
    <path d="M7 7l3 3M17 7l-3 3M7 17l3-3M17 17l-3-3" />
  </svg>,
  // depth — compass with heart
  <svg key="depth" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7c-2 0-3.5 1.5-3.5 3.5 0 3 3.5 5.5 3.5 5.5s3.5-2.5 3.5-5.5C15.5 8.5 14 7 12 7z" />
  </svg>,
];


// 8 guest experience cards
const GUEST_ICONS = [
  // welcome
  <svg key="welcome" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12h18M3 12l4-4M3 12l4 4M21 6v12" />
  </svg>,
  // check-in
  <svg key="checkin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <path d="M8 12l3 3 5-5" />
  </svg>,
  // concierge — chat bubble
  <svg key="concierge" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12c0-5 4-8 9-8s9 3 9 8-4 8-9 8H7l-4 2v-3c0-2 0-4 0-7z" />
    <circle cx="8" cy="12" r="1" fill="currentColor" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
    <circle cx="16" cy="12" r="1" fill="currentColor" />
  </svg>,
  // tours — map pin
  <svg key="tours" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21c-5-6-8-9-8-13a8 8 0 0 1 16 0c0 4-3 7-8 13z" />
    <circle cx="12" cy="8" r="2.5" />
  </svg>,
  // grocery
  <svg key="grocery" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 6h2l3 12h10l2-8H6" />
    <circle cx="10" cy="21" r="1.5" />
    <circle cx="17" cy="21" r="1.5" />
  </svg>,
  // housekeeping
  <svg key="house" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 21l3-15M19 21l-3-15" />
    <rect x="6" y="3" width="12" height="4" />
    <path d="M9 12h6M8 17h8" />
  </svg>,
  // amenities — diamond
  <svg key="amenities" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l5 6-5 12-5-12z" />
    <path d="M7 9h10" />
  </svg>,
  // security — eye
  <svg key="security" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" />
    <circle cx="12" cy="12" r="3" />
  </svg>,
];


export function LocallyRootedAndExperience() {
  const local = useTranslations("locallyRooted");
  const guest = useTranslations("guestExperience");
  const nav = useTranslations("nav");
  const localBullets = local.raw("bullets") as string[];
  const guestBullets = guest.raw("bullets") as string[];
  const localTitles = local.raw("iconLabels") as string[];
  const guestTitles = guest.raw("iconLabels") as string[];

  // Photo parallax for Block A
  const photoBlock = useRef<HTMLDivElement | null>(null);
  const photoInner = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const wrap = photoBlock.current;
    const img = photoInner.current;
    if (!wrap || !img) return;
    let raf = 0;
    const update = () => {
      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh;
      const seen = vh - rect.top;
      const progress = Math.max(0, Math.min(1, seen / total));
      const py = -40 + progress * 60;
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

  return (
    <>
      {/* Block A — Locally Rooted (light) */}
      <Section id="locally-rooted" tone="light">
        <BackToSection href="#operations" label={nav("backToOperations")} tone="light" />
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-20 items-start">
          {/* Left — photo */}
          <div className="lg:col-span-5">
            <Reveal>
              <div className="h-kicker text-[#58c3e8] mb-6 inline-flex items-center gap-3">
                <span aria-hidden className="h-px w-10 bg-[#58c3e8]" />
                {local("kicker")}
              </div>
            </Reveal>
            <Reveal delayMs={80}>
              <h2 className="h-display text-[clamp(2.2rem,4.8vw,4.2rem)] text-[#042b59] mb-8">
                {local("headlineLine1")}
                <br />
                <span className="h-italic text-[#58c3e8]">{local("headlineLine2")}</span>
              </h2>
            </Reveal>
            <Reveal delayMs={140}>
              <div ref={photoBlock} className="relative aspect-[4/5] overflow-hidden mt-10">
                <div ref={photoInner} className="absolute inset-[-6%] will-change-transform">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/zen/stock/mountain-pacific.jpg"
                    alt={local("photoAlt")}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between text-[#eaf1f6]">
                  <div>
                    <div className="h-kicker opacity-65 mb-1">{local("photoLocale")}</div>
                    <div className="h-title text-base">{local("photoLocation")}</div>
                  </div>
                  <div className="h-kicker opacity-65">10°37′ N</div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right — editorial cards */}
          <div className="lg:col-span-7">
            <div className="space-y-px bg-[#042b59]/10">
              {localBullets.map((b, i) => (
                <Reveal key={i} delayMs={i * 110}>
                  <article className="group bg-white p-6 md:p-8 flex items-start gap-5 md:gap-6 hover:bg-[#eaf1f6]/50 transition-colors duration-300">
                    <div className="shrink-0 w-12 h-12 rounded-full bg-[#042b59]/5 inline-flex items-center justify-center text-[#58c3e8] group-hover:bg-[#58c3e8] group-hover:text-[#042b59] transition-colors duration-300">
                      <div className="w-6 h-6">{LOCAL_ICONS[i]}</div>
                    </div>
                    <div className="flex-1">
                      <h3 className="h-title text-base md:text-lg text-[#042b59] mb-2">
                        {localTitles[i]}
                      </h3>
                      <p className="body-luxe text-sm md:text-base text-[#042b59]/70 leading-relaxed">
                        {b}
                      </p>
                    </div>
                    <span aria-hidden className="shrink-0 h-display text-2xl text-[#58c3e8]/40 tabular-nums">
                      0{i + 1}
                    </span>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Block B — Guest Experience (midnight) */}
      <Section id="guest-experience" tone="midnight">
        <BackToSection href="#operations" label={nav("backToOperations")} tone="midnight" />
        <div className="text-center mb-16 md:mb-20 max-w-3xl mx-auto">
          <Reveal>
            <div className="h-kicker text-[#58c3e8] mb-6 inline-flex items-center gap-3">
              <span aria-hidden className="h-px w-10 bg-[#58c3e8]" />
              {guest("kicker")}
              <span aria-hidden className="h-px w-10 bg-[#58c3e8]" />
            </div>
          </Reveal>
          <Reveal delayMs={80}>
            <h2 className="h-display text-[clamp(2.2rem,5vw,4.6rem)] text-[#eaf1f6] mb-6">
              {guest("headlineLine1")}
              <br />
              <span className="h-italic text-[#58c3e8]">{guest("headlineLine2")}</span>
            </h2>
          </Reveal>
          <Reveal delayMs={160}>
            <p className="body-luxe text-base md:text-lg text-[#eaf1f6]/65">
              {guest("subhead")}
            </p>
          </Reveal>
        </div>

        <div className="grid gap-px bg-[#58c3e8]/15 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {guestBullets.map((b, i) => (
            <Reveal key={i} delayMs={i * 70}>
              <article className="group relative bg-[#042b59] p-6 md:p-7 h-full overflow-hidden hover:bg-[#0a3a73] transition-colors duration-300">
                <span
                  aria-hidden
                  className="absolute right-3 top-1 h-display text-[3.5rem] leading-none tabular-nums text-[#58c3e8]/10 group-hover:text-[#58c3e8]/20 transition-colors duration-500"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="relative w-10 h-10 mb-5 text-[#58c3e8] transition-transform duration-500 group-hover:-translate-y-1">
                  {GUEST_ICONS[i]}
                </div>
                <h3 className="relative h-title text-sm md:text-base text-[#eaf1f6] mb-2 leading-tight">
                  {guestTitles[i]}
                </h3>
                <p className="relative body-luxe text-xs md:text-sm text-[#eaf1f6]/65 leading-relaxed">
                  {b}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
