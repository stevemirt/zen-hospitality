"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { Reveal } from "@/components/ui/Reveal";

type Props = {
  quote: string;
  attribution?: string;
  /** Optional fullbleed photo background */
  photo?: string;
  photoAlt?: string;
};

/**
 * Cinematic intermission — a quiet full-bleed pause between editorial blocks.
 * Optional photo background with soft parallax.
 */
export function Intermission({ quote, attribution, photo, photoAlt = "" }: Props) {
  const imgRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!photo) return;
    const section = sectionRef.current;
    const img = imgRef.current;
    if (!section || !img) return;
    let raf = 0;
    const update = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const center = rect.top + rect.height / 2;
      const progress = 1 - (center - 0) / (vh + rect.height / 2);
      const py = (Math.max(-0.4, Math.min(1.2, progress)) - 0.5) * 50;
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
  }, [photo]);

  return (
    <section ref={sectionRef} className="intermission">
      {photo && (
        <div className="photo-bed">
          <div ref={imgRef} className="absolute inset-[-6%] will-change-transform">
            <Image
              src={photo}
              alt={photoAlt}
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </div>
      )}
      <div className="relative mx-auto max-w-4xl text-center">
        <Reveal>
          <p className="title font-medium text-[clamp(1.9rem,4.5vw,3.8rem)] leading-[1.15] text-[#eaf1f6] tracking-[-0.012em] drop-shadow-[0_2px_20px_rgba(0,0,0,0.4)]">
            &ldquo;{quote}&rdquo;
          </p>
        </Reveal>
        {attribution && (
          <Reveal delayMs={200}>
            <div className="mt-10 text-[10px] md:text-xs uppercase tracking-[0.42em] text-[#58c3e8]">
              — {attribution}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
