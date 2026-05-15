"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  /** A value like "87%", "1,250+", "24/7", "99.9%" */
  value: string;
  durationMs?: number;
  className?: string;
};

/**
 * Counts up to a target value when scrolled into view. Parses the numeric
 * portion of the string and preserves prefix/suffix (%, +, etc).
 */
export function AnimatedNumber({ value, durationMs = 1800, className }: Props) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState(parseInitial(value));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const target = parseNumeric(value);
    if (target === null) {
      setDisplay(value);
      return;
    }

    let raf = 0;
    let started = false;
    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / durationMs);
        const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
        const current = target * eased;
        setDisplay(formatLike(value, current));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const rect = el.getBoundingClientRect();
    const inView = rect.top < (window.innerHeight || 0) * 0.85 && rect.bottom > 0;
    if (inView) {
      started = true;
      run();
    } else {
      const obs = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting && !started) {
              started = true;
              run();
              obs.disconnect();
            }
          }
        },
        { threshold: 0.4 }
      );
      obs.observe(el);
      return () => {
        obs.disconnect();
        if (raf) cancelAnimationFrame(raf);
      };
    }
    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [value, durationMs]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}

function parseInitial(v: string): string {
  const target = parseNumeric(v);
  if (target === null) return v;
  return formatLike(v, 0);
}

function parseNumeric(v: string): number | null {
  // Strip commas, find first number; if it includes "/" (like 24/7), bail out
  if (v.includes("/")) return null;
  const m = v.replace(/,/g, "").match(/-?\d+(\.\d+)?/);
  return m ? parseFloat(m[0]) : null;
}

function formatLike(template: string, current: number): string {
  if (template.includes("/")) return template;
  const target = parseNumeric(template);
  if (target === null) return template;

  const isInteger = !template.includes(".");
  const value = isInteger ? Math.round(current) : Number(current.toFixed(1));
  // Preserve thousand separator if present in original
  const withSep = template.includes(",")
    ? value.toLocaleString("en-US")
    : String(value);
  return template.replace(/-?\d[\d,]*(\.\d+)?/, withSep);
}
