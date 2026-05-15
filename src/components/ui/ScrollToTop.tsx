"use client";

import { useEffect } from "react";

/**
 * Forces every fresh load / refresh to land on the Hero — disables the
 * browser's automatic scroll restoration and resets scroll to (0,0).
 *
 * The pre-hydration inline script in [locale]/layout.tsx already pins scroll
 * to 0 before React mounts. This component layers two more guarantees:
 *   1. Re-apply on the next two animation frames so the 100svh URL-bar
 *      collapse on mobile can't slip a scroll-restoration past us.
 *   2. Listen for `pageshow` with `event.persisted === true` — fires when
 *      iOS/Android bfcache restores the page; without this, swipe-back +
 *      revisit lands on the old scroll position.
 *
 * Hash-anchored URLs (#join etc.) are honored after a tick so deep links
 * keep working.
 */
export function ScrollToTop() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    const hash = window.location.hash;

    const scrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    };

    const scrollToHash = () => {
      const target = document.querySelector(hash);
      if (target) target.scrollIntoView({ behavior: "auto", block: "start" });
    };

    if (!hash) {
      // Double-RAF: first frame settles 100svh URL-bar collapse on mobile,
      // second frame ensures any browser restoration has already fired.
      scrollToTop();
      requestAnimationFrame(() => {
        requestAnimationFrame(scrollToTop);
      });
    } else {
      requestAnimationFrame(scrollToHash);
    }

    // Handle bfcache restore on iOS/Android (swipe-back, app-switch return).
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        if (!window.location.hash) scrollToTop();
      }
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  return null;
}
