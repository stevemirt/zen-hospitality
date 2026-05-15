"use client";

import { useEffect, useRef } from "react";
import clsx from "clsx";

type Props = {
  text: string;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
};

export function WordReveal({ text, className, as = "h1" }: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // If already in view at mount, trigger immediately (hero case).
    const rect = el.getBoundingClientRect();
    const inView =
      rect.top < (window.innerHeight || 0) * 0.85 && rect.bottom > 0;
    if (inView) {
      el.classList.add("is-in");
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add("is-in");
            obs.disconnect();
          }
        }
      },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const Tag = as as React.ElementType;
  const words = text.split(" ");

  return (
    <Tag ref={ref as never} className={clsx("word-reveal", className)}>
      {words.map((w, i) => (
        <span
          key={i}
          style={{ transitionDelay: `${i * 60}ms` }}
        >
          {w}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}
