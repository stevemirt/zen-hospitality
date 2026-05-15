"use client";

import Image from "next/image";
import { useEffect, useRef, type ReactNode } from "react";
import clsx from "clsx";

type Props = {
  src: string;
  alt: string;
  /** Sticky overlay text — appears centered on the photo */
  kicker?: string;
  headline: string;
  body?: string;
  /** Position of the editorial caption */
  align?: "left" | "right" | "center";
  /** "tall" = 120vh, "screen" = 100vh, "wide" = 80vh */
  height?: "tall" | "screen" | "wide";
  /** Optional children for additional content */
  children?: ReactNode;
};

/**
 * Cinematic photo storytelling section.
 * The image fills the section; scroll-driven parallax + soft scale.
 * Text overlay uses curtain reveal.
 */
export function PhotoStory({
  src,
  alt,
  kicker,
  headline,
  body,
  align = "left",
  height = "tall",
  children,
}: Props) {
  const imgWrapRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const img = imgWrapRef.current;
    const text = textRef.current;
    if (!section || !img) return;

    let raf = 0;
    const update = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when section center is at viewport bottom, 1 when at top
      const center = rect.top + rect.height / 2;
      const progress = 1 - (center - 0) / (vh + rect.height / 2);
      const clamped = Math.max(-0.4, Math.min(1.2, progress));
      // Photo translates slower than the section — classic parallax
      const py = (clamped - 0.5) * 60; // -30 .. +30 px
      const scale = 1.05 + clamped * 0.04;
      img.style.transform = `translate3d(0, ${py}px, 0) scale(${scale})`;
      if (text) {
        const ty = (clamped - 0.5) * -20;
        text.style.transform = `translate3d(0, ${ty}px, 0)`;
      }
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    // reveal text via observer
    if (text) {
      const obs = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              text.classList.add("is-in");
              obs.disconnect();
            }
          }
        },
        { threshold: 0.3 }
      );
      obs.observe(section);
    }
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const heightClass = {
    tall: "h-[120vh]",
    screen: "h-screen",
    wide: "h-[80vh]",
  }[height];

  const alignClass = {
    left: "items-start text-left",
    right: "items-end text-right",
    center: "items-center text-center",
  }[align];

  return (
    <section
      ref={sectionRef}
      className={clsx("relative z-10 w-full overflow-hidden", heightClass)}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          ref={imgWrapRef}
          className="absolute inset-[-5%] will-change-transform"
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.65) 100%)",
          }}
        />
      </div>

      <div className="sticky top-0 h-screen flex">
        <div
          ref={textRef}
          className={clsx(
            "reveal mx-auto max-w-[1400px] w-full px-6 lg:px-10 flex flex-col justify-center self-center",
            alignClass
          )}
        >
          {kicker && (
            <div className="mb-8 flex items-center gap-4 text-[10px] md:text-xs tracking-[0.42em] uppercase text-[#eaf1f6]/85">
              <span aria-hidden className="h-px w-10 bg-[#58c3e8]/70" />
              <span className="title">{kicker}</span>
            </div>
          )}
          <h2 className="title font-medium text-[clamp(2.4rem,6vw,6rem)] leading-[0.96] tracking-[-0.015em] max-w-4xl text-[#eaf1f6] drop-shadow-[0_2px_24px_rgba(0,0,0,0.55)]">
            {headline}
          </h2>
          {body && (
            <p className="mt-8 max-w-md text-base md:text-lg text-[#eaf1f6]/85 leading-relaxed">
              {body}
            </p>
          )}
          {children && <div className="mt-10">{children}</div>}
        </div>
      </div>
    </section>
  );
}
