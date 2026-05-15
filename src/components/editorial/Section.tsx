import type { ReactNode } from "react";
import clsx from "clsx";

type Props = {
  id?: string;
  kicker?: string;
  className?: string;
  children: ReactNode;
  /**
   * "veil" — translucent black gradient, lets cinematic bleed through.
   * "midnight" — solid navy bg, cyan accents (Why Costa Rica, Form).
   * "light" — white bg with navy text (Who We Are, Vision/Promise).
   * "mist" — very pale cool grey, navy text.
   * "bone" — warm cream, navy text (form).
   * "void" — solid black.
   */
  tone?: "veil" | "midnight" | "light" | "mist" | "bone" | "void";
  /** "default" full padding, "compact" tighter, "edge" no padding */
  spacing?: "default" | "compact" | "edge";
};

const TONE_CLASS = {
  veil: "text-[#eaf1f6]",
  midnight: "text-[#eaf1f6]",
  light: "bg-white text-[#042b59]",
  mist: "bg-[#eaf1f6] text-[#042b59]",
  bone: "bg-[#f4efe6] text-[#042b59]",
  void: "bg-black text-[#eaf1f6]",
} as const;

const PADDING = {
  default: "py-28 md:py-40",
  compact: "py-20 md:py-28",
  edge: "py-0",
} as const;

export function Section({
  id,
  kicker,
  className,
  children,
  tone = "veil",
  spacing = "default",
}: Props) {
  const isDark = tone === "veil" || tone === "midnight" || tone === "void";
  return (
    <section
      id={id}
      className={clsx("relative z-10", TONE_CLASS[tone], className)}
      style={
        tone === "veil"
          ? {
              backgroundImage:
                "linear-gradient(to bottom, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.78) 14%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0.78) 86%, rgba(0,0,0,0.0) 100%)",
            }
          : tone === "midnight"
            ? {
                background:
                  "radial-gradient(ellipse at 20% 0%, rgba(88,195,232,0.10) 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(88,195,232,0.08) 0%, transparent 55%), linear-gradient(180deg, #042b59 0%, #03244a 50%, #042b59 100%)",
              }
            : undefined
      }
    >
      <div className={clsx("mx-auto max-w-[1400px] px-6 lg:px-10", PADDING[spacing])}>
        {kicker && (
          <div
            className={clsx(
              "flex items-center gap-4 mb-12 text-xs md:text-sm tracking-[0.32em] uppercase",
              isDark ? "text-[#58c3e8]" : "text-[#58c3e8]"
            )}
          >
            <span
              aria-hidden
              className={clsx(
                "w-10 h-px",
                isDark ? "bg-[#58c3e8]/50" : "bg-[#58c3e8]"
              )}
            />
            <span className="title font-medium">{kicker}</span>
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
