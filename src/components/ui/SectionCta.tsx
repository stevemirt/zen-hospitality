import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/Reveal";
import clsx from "clsx";

type Props = {
  /** "request" — Solicitar información · "join" — Únase a nuestra colección */
  variant: "request" | "join";
  /** "dark" for midnight/veil sections, "light" for white/mist sections */
  tone: "dark" | "light";
};

/**
 * Closing CTA for an editorial section — hairline rule + centered pill that
 * carries the reader down to the lead form. Same pill as the Hero and the
 * form's submit button. Placed as the last child inside a <Section> so it
 * inherits the section background and container width.
 */
export function SectionCta({ variant, tone }: Props) {
  const t = useTranslations("cta");
  const isDark = tone === "dark";

  return (
    <div
      className={clsx(
        "mt-20 md:mt-28 pt-12 border-t flex justify-center",
        isDark ? "border-[#58c3e8]/25" : "border-[#042b59]/12"
      )}
    >
      <Reveal>
        <a
          href="#join"
          className={clsx(
            "group inline-flex items-center gap-3 bg-[#58c3e8] hover:bg-[#eaf1f6] text-[#042b59] px-9 py-4 text-sm md:text-base font-medium tracking-[0.04em] rounded-full transition-all duration-300 shadow-[0_8px_32px_rgba(88,195,232,0.18)] hover:shadow-[0_12px_48px_rgba(88,195,232,0.32)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#58c3e8] focus-visible:ring-offset-2",
            isDark ? "focus-visible:ring-offset-[#042b59]" : "focus-visible:ring-offset-white"
          )}
        >
          {variant === "request" ? t("requestInfo") : t("join")}
          <span
            aria-hidden
            className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#042b59] text-[#58c3e8] text-[11px] transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </span>
        </a>
      </Reveal>
    </div>
  );
}
