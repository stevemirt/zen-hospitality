import type { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

type Variant = "primary" | "ghost" | "outline";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  children: ReactNode;
};

export function Button({ variant = "primary", className, children, ...rest }: Props) {
  return (
    <button
      {...rest}
      className={clsx(
        "inline-flex items-center justify-center px-7 py-3.5 text-sm tracking-wide transition-all duration-200 ease-out rounded-none",
        "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#58c3e8]",
        variant === "primary" &&
          "bg-[#58c3e8] text-[#042b59] hover:bg-[#eaf1f6] hover:scale-[1.02]",
        variant === "ghost" &&
          "bg-transparent text-[#eaf1f6] hover:text-[#58c3e8]",
        variant === "outline" &&
          "border border-[#58c3e8] text-[#58c3e8] hover:bg-[#58c3e8] hover:text-[#042b59]",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
        className
      )}
    >
      {children}
    </button>
  );
}
