"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import clsx from "clsx";

type Item = { q: string; a: string };

export function Accordion({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="divide-y divide-[#eaf1f6]/15">
      {items.map((it, i) => (
        <AccordionItem
          key={i}
          item={it}
          isOpen={open === i}
          onToggle={() => setOpen(open === i ? null : i)}
        />
      ))}
    </div>
  );
}

function AccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: Item;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!contentRef.current) return;
    setHeight(contentRef.current.scrollHeight);
  }, [isOpen, item.a]);

  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className={clsx(
          "w-full flex items-center justify-between gap-6 py-6 text-left transition-colors duration-200",
          isOpen ? "text-[#58c3e8]" : "text-[#eaf1f6] hover:text-[#58c3e8]"
        )}
        aria-expanded={isOpen}
      >
        <span className="title text-lg md:text-xl">{item.q}</span>
        <span
          className={clsx(
            "shrink-0 w-7 h-7 inline-flex items-center justify-center transition-transform duration-300",
            isOpen ? "rotate-45" : "rotate-0"
          )}
          aria-hidden
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </span>
      </button>
      <div
        style={{ maxHeight: isOpen ? height : 0 }}
        className="overflow-hidden transition-[max-height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        aria-hidden={!isOpen}
      >
        <div ref={contentRef} className="pb-6 pr-12 text-[#eaf1f6]/80 leading-relaxed">
          {item.a}
        </div>
      </div>
    </div>
  );
}

export function AccordionGroup({ children }: { children: ReactNode }) {
  return <div className="w-full">{children}</div>;
}
