import type { ReactNode } from "react";
import clsx from "clsx";

/**
 * Floating-label field used by the lead form and the quote calculator form.
 * Renders a numbered index in the left margin and an animated label that
 * floats up when the field is filled or focused.
 */
export function FloatingField({
  label,
  value,
  error,
  index,
  textarea,
  noBottomBorder,
  children,
}: {
  label: string;
  value?: string;
  error?: string;
  index: string;
  textarea?: boolean;
  noBottomBorder?: boolean;
  children: ReactNode;
}) {
  const filled = Boolean(value && value.length > 0);
  return (
    <div
      className={clsx(
        "relative group",
        !noBottomBorder &&
          "border-b border-[#58c3e8]/15 hover:border-[#58c3e8]/50 focus-within:border-[#58c3e8] transition-colors duration-300",
        noBottomBorder && "bg-[#042b59]"
      )}
    >
      {/* Index in left margin */}
      <span
        aria-hidden
        className="absolute top-5 left-0 text-[9px] tracking-[0.42em] uppercase text-[#58c3e8]/55 font-medium"
      >
        {index}
      </span>
      <label
        className={clsx(
          "absolute left-10 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-none origin-left",
          filled
            ? "top-2 text-[10px] tracking-[0.32em] uppercase text-[#58c3e8]"
            : "top-6 text-base text-[#eaf1f6]/55",
          "group-focus-within:top-2 group-focus-within:text-[10px] group-focus-within:tracking-[0.32em] group-focus-within:uppercase group-focus-within:text-[#58c3e8]"
        )}
      >
        {label}
      </label>
      <div className={clsx("pl-10", textarea ? "pt-7 pb-3" : "")}>{children}</div>
      {error && (
        <span className="block pl-10 pb-2 text-[10px] tracking-[0.22em] uppercase text-[#ff9a82]">
          {error}
        </span>
      )}
    </div>
  );
}

export function floatingInputCls(error: boolean) {
  return clsx(
    "w-full bg-transparent text-[#eaf1f6] pt-7 pb-3 outline-none border-0 placeholder-transparent text-base",
    error && "text-[#ff9a82]"
  );
}
