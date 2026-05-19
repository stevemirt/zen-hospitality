import { useTranslations } from "next-intl";
import { Section } from "./Section";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Dual-tone service icons — adapted for dark-navy backdrop.
 * - Base shape: cream (#eaf1f6) at 1px stroke
 * - Cyan accents (#58c3e8) at 1.4px for highlights/details
 * - 80×80 viewBox with compositional detail per icon
 */
const ICONS: Record<number, React.ReactNode> = {
  0: ( // Property Management — house with lit windows
    <svg viewBox="0 0 80 80" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 36L40 16l26 20" stroke="#eaf1f6" strokeWidth="1" />
      <path d="M18 34v32h44V34" stroke="#eaf1f6" strokeWidth="1" />
      <rect x="32" y="46" width="16" height="20" stroke="#eaf1f6" strokeWidth="1" />
      <rect x="24" y="42" width="4" height="6" fill="#58c3e8" />
      <rect x="52" y="42" width="4" height="6" fill="#58c3e8" />
      <rect x="32" y="50" width="3" height="4" fill="#58c3e8" />
      <rect x="45" y="50" width="3" height="4" fill="#58c3e8" />
      <path d="M16 66h48" stroke="#58c3e8" strokeWidth="1.4" />
    </svg>
  ),
  1: ( // Concierge — bell with sound waves
    <svg viewBox="0 0 80 80" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M40 20v-6M28 64h24" stroke="#eaf1f6" strokeWidth="1" />
      <path d="M18 64c0-12 10-22 22-22s22 10 22 22" stroke="#eaf1f6" strokeWidth="1" />
      <circle cx="40" cy="66" r="2.5" fill="#58c3e8" />
      <path d="M34 20h12" stroke="#eaf1f6" strokeWidth="1" />
      <path d="M14 36c2-3 5-5 8-6M66 36c-2-3-5-5-8-6" stroke="#58c3e8" strokeWidth="1.4" />
      <path d="M10 28c2-2 4-3 6-4M70 28c-2-2-4-3-6-4" stroke="#58c3e8" strokeWidth="1.4" opacity="0.6" />
    </svg>
  ),
  2: ( // Housekeeping — folded linens stack
    <svg viewBox="0 0 80 80" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x="14" y="46" width="52" height="20" stroke="#eaf1f6" strokeWidth="1" />
      <rect x="18" y="34" width="44" height="12" stroke="#eaf1f6" strokeWidth="1" />
      <rect x="22" y="22" width="36" height="12" stroke="#eaf1f6" strokeWidth="1" />
      <path d="M22 30h10M22 42h10M22 54h10" stroke="#58c3e8" strokeWidth="1.4" />
      <circle cx="62" cy="56" r="2" fill="#58c3e8" />
    </svg>
  ),
  3: ( // Maintenance — wrench with bolt
    <svg viewBox="0 0 80 80" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M52 14a10 10 0 0 1-12 12L20 46l10 10 20-20a10 10 0 0 1 12-12z" stroke="#eaf1f6" strokeWidth="1" />
      <circle cx="24" cy="56" r="1.5" fill="#58c3e8" />
      <path d="M50 16l-2 6 6-2" stroke="#58c3e8" strokeWidth="1.4" />
      <circle cx="58" cy="22" r="2" stroke="#58c3e8" strokeWidth="1.4" />
    </svg>
  ),
  4: ( // Emergencies — shield with check
    <svg viewBox="0 0 80 80" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M40 12l20 5v14c0 12-8 22-20 28-12-6-20-16-20-28V17z" stroke="#eaf1f6" strokeWidth="1" />
      <path d="M30 40l7 7 14-14" stroke="#58c3e8" strokeWidth="1.6" />
    </svg>
  ),
  5: ( // Sales & Marketing — chart growth + arrow + dots
    <svg viewBox="0 0 80 80" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 66h54" stroke="#eaf1f6" strokeWidth="1" />
      <path d="M18 56l12-12 10 7 18-22" stroke="#eaf1f6" strokeWidth="1" />
      <path d="M52 29h6v6" stroke="#58c3e8" strokeWidth="1.4" />
      <circle cx="30" cy="44" r="2" fill="#58c3e8" />
      <circle cx="40" cy="51" r="2" fill="#58c3e8" />
      <circle cx="58" cy="29" r="2.4" fill="#58c3e8" />
    </svg>
  ),
  6: ( // Monthly Reports — document with chart inside
    <svg viewBox="0 0 80 80" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h26l10 10v46H22z" stroke="#eaf1f6" strokeWidth="1" />
      <path d="M48 12v10h10" stroke="#eaf1f6" strokeWidth="1" />
      <rect x="30" y="38" width="4" height="14" fill="#58c3e8" />
      <rect x="38" y="32" width="4" height="20" fill="#58c3e8" />
      <rect x="46" y="42" width="4" height="10" fill="#58c3e8" />
      <path d="M28 60h24" stroke="#58c3e8" strokeWidth="1.4" />
    </svg>
  ),
  7: ( // Security — lock with keyhole
    <svg viewBox="0 0 80 80" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x="18" y="34" width="44" height="32" stroke="#eaf1f6" strokeWidth="1" />
      <path d="M26 34v-8a14 14 0 0 1 28 0v8" stroke="#eaf1f6" strokeWidth="1" />
      <circle cx="40" cy="48" r="3" fill="#58c3e8" />
      <path d="M40 51v6" stroke="#58c3e8" strokeWidth="1.6" />
      <circle cx="40" cy="48" r="6" stroke="#58c3e8" strokeWidth="1" opacity="0.5" />
    </svg>
  ),
  8: ( // Quality Management — diamond with rays
    <svg viewBox="0 0 80 80" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M40 20l8 12 12 8-12 8-8 12-8-12-12-8 12-8z" stroke="#eaf1f6" strokeWidth="1" />
      <circle cx="40" cy="40" r="2" fill="#58c3e8" />
      <path d="M40 8v6M40 66v6M8 40h6M66 40h6M18 18l4 4M58 58l4 4M58 22l4-4M18 62l4-4" stroke="#58c3e8" strokeWidth="1.4" />
    </svg>
  ),
  9: ( // Special Projects — compass
    <svg viewBox="0 0 80 80" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="40" cy="40" r="28" stroke="#eaf1f6" strokeWidth="1" />
      <circle cx="40" cy="40" r="22" stroke="#58c3e8" strokeWidth="0.6" opacity="0.5" />
      <path d="M48 28l-6 18-12 6 6-18z" fill="#58c3e8" stroke="#eaf1f6" strokeWidth="1" />
      <circle cx="40" cy="40" r="2" fill="#eaf1f6" />
      <text x="40" y="18" textAnchor="middle" fontSize="7" fill="#58c3e8" fontFamily="Gotham, sans-serif" fontWeight="500" letterSpacing="2">N</text>
    </svg>
  ),
};

export function ServicesGrid() {
  const t = useTranslations("services");
  const items = t.raw("items") as string[];
  const descriptors = t.raw("descriptors") as string[] | undefined;

  return (
    <Section id="services" tone="midnight">
      <div className="text-center mb-20 md:mb-28">
        <Reveal>
          <div className="h-kicker text-[#58c3e8] mb-6 inline-flex items-center gap-3">
            <span aria-hidden className="h-px w-10 bg-[#58c3e8]" />
            {t("kicker")}
            <span aria-hidden className="h-px w-10 bg-[#58c3e8]" />
          </div>
        </Reveal>
        <Reveal delayMs={100}>
          <h2 className="h-display text-[clamp(2.4rem,5.4vw,4.8rem)] text-[#eaf1f6] mb-6">
            {t("headlineLine1")}
            <br />
            <span className="h-italic text-[#58c3e8]">{t("headlineLine2")}</span>
          </h2>
        </Reveal>
        <Reveal delayMs={180}>
          <p className="body-luxe text-base md:text-lg text-[#eaf1f6]/65 max-w-xl mx-auto">
            {t("descriptor")}
          </p>
        </Reveal>
      </div>

      <div className="grid gap-px bg-[#58c3e8]/15 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        {items.map((label, i) => (
          <Reveal key={label} delayMs={i * 60}>
            <article className="group relative bg-[#042b59] p-6 md:p-7 h-full overflow-hidden hover:bg-[#0a3a73] transition-colors duration-300">
              {/* Ghost number — top-right, matches Guest Experience treatment */}
              <span
                aria-hidden
                className="absolute right-3 top-1 select-none pointer-events-none h-display text-[3.5rem] leading-none tabular-nums text-[#58c3e8]/10 group-hover:text-[#58c3e8]/20 transition-colors duration-500"
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Icon */}
              <div className="relative w-10 h-10 md:w-12 md:h-12 mb-5 transition-transform duration-500 group-hover:-translate-y-1">
                {ICONS[i]}
              </div>

              {/* Label + descriptor */}
              <h3 className="relative h-title text-sm md:text-base text-[#eaf1f6] leading-tight mb-2">
                {label}
              </h3>
              {descriptors?.[i] && (
                <p
                  className="relative body-luxe text-xs md:text-sm text-[#eaf1f6]/65 leading-relaxed overflow-hidden"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {descriptors[i]}
                </p>
              )}
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
