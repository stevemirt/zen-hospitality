"use client";

import { useEffect, useRef, type ReactNode } from "react";
import clsx from "clsx";

type Props = {
  children: ReactNode;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  delayMs?: number;
};

export function Reveal({ children, as = "div", className, delayMs = 0 }: Props) {
  const ref = useRef<HTMLElement | null>(null);
  // Cap cumulative stagger so the last item never starts later than 540ms after first
  const cappedDelay = Math.min(delayMs, 540);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let timeout: ReturnType<typeof setTimeout> | null = null;
    const reveal = () => {
      if (cappedDelay) {
        timeout = setTimeout(() => el.classList.add("is-in"), cappedDelay);
      } else {
        el.classList.add("is-in");
      }
    };
    const rect = el.getBoundingClientRect();
    const inView = rect.top < (window.innerHeight || 0) * 0.85 && rect.bottom > 0;
    if (inView) {
      reveal();
      return () => {
        if (timeout) clearTimeout(timeout);
      };
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            reveal();
            obs.disconnect();
          }
        }
      },
      { threshold: 0.18 }
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      if (timeout) clearTimeout(timeout);
    };
  }, [cappedDelay]);

  const Tag = as as React.ElementType;
  return (
    <Tag ref={ref as never} className={clsx("reveal", className)}>
      {children}
    </Tag>
  );
}
