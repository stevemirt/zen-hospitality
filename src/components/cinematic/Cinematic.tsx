"use client";

import { useEffect, useRef, useState } from "react";
import { useScrollBus } from "@/three/ScrollBus";
import { detectTier, type GpuTier } from "@/lib/gpu";
import { prefersReducedMotion } from "@/lib/motion";

export function Cinematic() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [tier, setTier] = useState<GpuTier>("high");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const reduced = prefersReducedMotion();
      const t = await detectTier();
      if (cancelled) return;
      setTier(t);
      setEnabled(!reduced && t !== "low");
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Drive ScrollBus from window scroll. The cinematic spans roughly the
  // first ~500vh of the page (hero + a few editorial sections); after that,
  // progress is clamped to 1 and the canvas fades out.
  useEffect(() => {
    if (!enabled) return;
    let lastY = 0;
    let lastT = performance.now();
    let raf = 0;

    const onScrollOrFrame = () => {
      const y = window.scrollY;
      const cinematicSpan = Math.max(window.innerHeight, 800) * 5; // ~500vh
      const progress = Math.min(1, y / cinematicSpan);

      const now = performance.now();
      const dt = Math.max(1, now - lastT);
      const v = Math.max(-1, Math.min(1, ((y - lastY) / dt) * 0.05));
      lastY = y;
      lastT = now;

      useScrollBus.getState().setProgress(progress, v);
      raf = 0;
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(onScrollOrFrame);
    };

    onScrollOrFrame();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !mountRef.current) return;
    let stage: import("@/three/Stage").Stage | null = null;
    let disposed = false;

    (async () => {
      const { Stage } = await import("@/three/Stage");
      if (disposed || !mountRef.current) return;
      stage = new Stage(mountRef.current, tier);
    })();

    return () => {
      disposed = true;
      stage?.dispose();
    };
  }, [enabled, tier]);

  if (enabled === null) return null;

  if (!enabled) {
    return (
      <div
        aria-hidden
        className="cinematic-canvas"
        style={{
          background:
            "radial-gradient(ellipse at 50% 80%, #042b59 0%, #000000 75%)",
        }}
      />
    );
  }

  return <div ref={mountRef} aria-hidden className="cinematic-canvas" />;
}
