"use client";

import { useState, type ReactNode } from "react";
import clsx from "clsx";

type Tab = {
  label: string;
  content: ReactNode;
};

export function Tabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div role="tablist" className="flex flex-wrap gap-2 border-b border-[#eaf1f6]/15 mb-10">
        {tabs.map((t, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={active === i}
            onClick={() => setActive(i)}
            className={clsx(
              "title px-5 py-3 text-sm md:text-base transition-colors duration-200 relative",
              active === i
                ? "text-[#58c3e8]"
                : "text-[#eaf1f6]/60 hover:text-[#eaf1f6]"
            )}
          >
            {t.label}
            {active === i && (
              <span className="absolute left-0 right-0 -bottom-px h-px bg-[#58c3e8]" />
            )}
          </button>
        ))}
      </div>
      <div role="tabpanel" key={active}>
        {tabs[active]?.content}
      </div>
    </div>
  );
}
