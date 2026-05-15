type Props = {
  items: string[];
  tone?: "veil" | "navy";
};

/**
 * Infinite-scroll brand affirmation ticker. Doubled list so the CSS marquee
 * loops seamlessly. Uses CSS animation; no JS needed.
 */
export function Marquee({ items, tone = "veil" }: Props) {
  const list = [...items, ...items];
  return (
    <div
      aria-hidden
      className={
        tone === "navy"
          ? "relative z-10 bg-[#042b59] text-[#58c3e8] py-6 overflow-hidden border-y border-[#58c3e8]/15"
          : "relative z-10 py-6 overflow-hidden border-y border-[#eaf1f6]/10 bg-black/40 backdrop-blur-sm"
      }
    >
      <div className="flex w-max gap-12 animate-zen-marquee">
        {list.map((it, i) => (
          <span
            key={i}
            className="title text-xs md:text-sm tracking-[0.42em] uppercase whitespace-nowrap flex items-center gap-12"
          >
            <span aria-hidden className="inline-block w-1.5 h-1.5 rotate-45 border border-current" />
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}
