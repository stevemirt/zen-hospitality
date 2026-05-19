/**
 * Small editorial "back" link rendered at the top of a destination section.
 * Used to return from Locally Rooted / Guest Experience / Beyond the Stay /
 * FAQs / Join Form to their entry point (Operations or Collection).
 *
 * Visual: cyan tracking kicker with a leading arrow. Subtle by default,
 * brightens on hover. Tone-aware: pass `tone="light"` when used on a light
 * section so colors flip for legibility.
 */
export function BackToSection({
  href,
  label,
  tone = "midnight",
}: {
  href: string;
  label: string;
  tone?: "midnight" | "light";
}) {
  const onMidnight = tone === "midnight";
  return (
    <a
      href={href}
      className={
        onMidnight
          ? "inline-flex items-center gap-2 mb-8 md:mb-10 text-[10px] md:text-xs uppercase tracking-[0.32em] text-[#58c3e8]/70 hover:text-[#eaf1f6] transition-colors duration-200 rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#58c3e8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#042b59] min-h-11 py-2"
          : "inline-flex items-center gap-2 mb-8 md:mb-10 text-[10px] md:text-xs uppercase tracking-[0.32em] text-[#58c3e8] hover:text-[#042b59] transition-colors duration-200 rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#58c3e8] focus-visible:ring-offset-2 focus-visible:ring-offset-white min-h-11 py-2"
      }
    >
      <span aria-hidden className="text-base leading-none">←</span>
      <span>{label}</span>
    </a>
  );
}
