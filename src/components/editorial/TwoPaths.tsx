"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import clsx from "clsx";
import { Section } from "./Section";
import { Reveal } from "@/components/ui/Reveal";

type TabData = {
  label: string;
  title: string;
  intro: string;
  blocks: Array<{ h: string; b: string }>;
};

const PATH_PHOTOS = ["/zen/interior-bedroom.jpg", "/zen/interior-living.jpg"];

export function TwoPaths() {
  const t = useTranslations("twoPaths");
  const tabs = t.raw("tabs") as TabData[];
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <Section id="two-paths" tone="midnight" spacing="compact">
      <div className="grid gap-6 md:grid-cols-2">
        {tabs.map((tab, i) => (
          <Reveal key={i} delayMs={i * 140}>
            <button
              type="button"
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              className="group relative w-full text-left overflow-hidden aspect-[4/3] md:aspect-[5/4] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#58c3e8] focus-visible:ring-offset-4 focus-visible:ring-offset-[#042b59]"
              aria-expanded={openIdx === i}
            >
              {/* Background photo */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={PATH_PHOTOS[i % 2]}
                alt={tab.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2500ms] ease-out group-hover:scale-105"
              />
              {/* Veil */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#042b59] via-[#042b59]/30 to-transparent" />
              {/* Cyan plate at the bottom */}
              <div className="absolute inset-x-0 bottom-0 bg-[#58c3e8] py-8 px-8 md:px-10 transition-colors duration-300 group-hover:bg-[#eaf1f6]">
                <h3 className="title font-medium text-2xl md:text-3xl text-[#042b59] mb-2">
                  {tab.title}
                </h3>
                <p className="text-xs md:text-sm uppercase tracking-[0.22em] text-[#042b59]/80">
                  {openIdx === i ? "Close" : "Click to see more information"}
                  <span aria-hidden className="ml-3 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                </p>
              </div>
            </button>

            {/* Expanded content */}
            <div
              className={clsx(
                "grid transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                openIdx === i ? "grid-rows-[1fr] opacity-100 mt-6" : "grid-rows-[0fr] opacity-0"
              )}
              aria-hidden={openIdx !== i}
            >
              <div className="overflow-hidden">
                <div className="pb-2">
                  <p className="text-sm md:text-base text-[#eaf1f6]/80 leading-relaxed mb-6">
                    {tab.intro}
                  </p>
                  <div className="grid gap-5">
                    {tab.blocks.map((b, j) => (
                      <div key={j} className="border-t border-[#58c3e8]/35 pt-3">
                        <h4 className="title font-medium text-sm text-[#58c3e8] mb-2">{b.h}</h4>
                        <p className="text-xs md:text-sm text-[#eaf1f6]/75 leading-relaxed">{b.b}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
