"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import clsx from "clsx";

/**
 * Floating WhatsApp button — bottom-right, brand-cyan (not WhatsApp green
 * — integrates with the site's palette). Modern: shows label tooltip on
 * hover, breathes subtly, hides on form section to avoid overlap.
 *
 * Raised vertically (bottom-24 / md:bottom-28) so it stacks ABOVE the
 * Pipedrive LeadBooster launcher, which anchors itself to the bottom-right
 * corner. Same right edge → the two floating widgets read as one column.
 * See PipedriveChat.tsx.
 */
export function WhatsAppButton() {
  const t = useTranslations("whatsapp");
  const [armed, setArmed] = useState(false);
  const [overForm, setOverForm] = useState(false);

  // Reveal after 1.2s so it doesn't fight the hero's first-impression
  useEffect(() => {
    const t = setTimeout(() => setArmed(true), 1200);
    return () => clearTimeout(t);
  }, []);

  // Hide when the join form is in viewport (its own CTA + form serve that intent)
  useEffect(() => {
    const join = document.getElementById("join");
    if (!join) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          setOverForm(e.isIntersecting && e.intersectionRatio > 0.3);
        }
      },
      { threshold: [0.3, 0.6] }
    );
    obs.observe(join);
    return () => obs.disconnect();
  }, []);

  const phone = (t("phone") || "+50600000000").replace(/[^\d+]/g, "");
  const message = encodeURIComponent(t("message") || "");
  const href = `https://wa.me/${phone.replace(/^\+/, "")}${message ? `?text=${message}` : ""}`;

  const hidden = !armed || overForm;
  return (
    <div
      aria-hidden={hidden}
      className={clsx(
        "fixed z-40 bottom-24 right-5 md:bottom-28 md:right-8 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
        armed && !overForm
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-6 pointer-events-none"
      )}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("aria")}
        tabIndex={hidden ? -1 : 0}
        className="group relative flex items-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#58c3e8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#042b59]"
      >
        {/* Pulsing halo */}
        <span
          aria-hidden
          className="absolute inset-0 m-auto w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#58c3e8]/40 blur-xl group-hover:bg-[#58c3e8]/60 transition-colors duration-500 animate-zen-breath"
        />

        {/* Label — slides out on hover */}
        <span
          className={clsx(
            "absolute right-full mr-3 whitespace-nowrap rounded-full bg-[#042b59] text-[#eaf1f6] h-kicker px-4 py-2.5",
            "shadow-[0_6px_24px_rgba(4,43,89,0.45)] border border-[#58c3e8]/30",
            "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0",
            "transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-none"
          )}
        >
          <span className="text-[#58c3e8] mr-2">●</span>
          {t("label")}
        </span>

        {/* Main button */}
        <span
          className={clsx(
            "relative inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full",
            "bg-[#58c3e8] text-[#042b59] shadow-[0_8px_32px_rgba(88,195,232,0.45)]",
            "group-hover:bg-[#eaf1f6] group-hover:scale-105 group-active:scale-95",
            "transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
          )}
        >
          {/* WhatsApp glyph */}
          <svg
            viewBox="0 0 32 32"
            className="w-7 h-7 md:w-8 md:h-8"
            fill="currentColor"
            aria-hidden
          >
            <path d="M16 3C8.82 3 3 8.82 3 16c0 2.3.6 4.46 1.66 6.34L3 29l6.83-1.62A12.94 12.94 0 0 0 16 29c7.18 0 13-5.82 13-13S23.18 3 16 3zm0 23.6c-2 0-3.86-.54-5.46-1.48l-.4-.24-4.06.96 1-3.96-.26-.42A10.6 10.6 0 0 1 5.4 16C5.4 10.15 10.15 5.4 16 5.4S26.6 10.15 26.6 16 21.85 26.6 16 26.6zm5.74-7.94c-.32-.16-1.88-.92-2.16-1.04-.3-.1-.5-.16-.72.16-.2.32-.82 1.04-1 1.24-.18.2-.36.22-.68.08-.32-.16-1.34-.5-2.56-1.58-.94-.84-1.58-1.88-1.76-2.2-.18-.32-.02-.5.14-.66.14-.14.32-.36.48-.54.16-.2.22-.32.32-.54.1-.22.04-.4-.04-.56-.08-.16-.72-1.72-1-2.36-.26-.62-.52-.54-.72-.54l-.62-.02c-.22 0-.56.08-.86.4-.3.32-1.12 1.1-1.12 2.66s1.14 3.08 1.3 3.3c.16.2 2.26 3.46 5.48 4.84 2.7 1.18 3.26 1 3.84.94.58-.06 1.88-.78 2.14-1.52.26-.74.26-1.38.18-1.52-.08-.14-.3-.22-.62-.36z"/>
          </svg>
        </span>
      </a>
    </div>
  );
}
