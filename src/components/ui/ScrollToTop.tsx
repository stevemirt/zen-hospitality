"use client";

import { useEffect } from "react";

/**
 * Forces every fresh load / refresh to land on the Hero — disables the
 * browser's automatic scroll restoration and resets scroll to (0,0).
 * Hash-anchored URLs (#join etc.) are honored after a tick so deep links keep working.
 */
export function ScrollToTop() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    const hash = window.location.hash;
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    } else {
      // Allow deep links to scroll to the target after layout settles
      requestAnimationFrame(() => {
        const target = document.querySelector(hash);
        if (target) target.scrollIntoView({ behavior: "auto", block: "start" });
      });
    }
  }, []);

  return null;
}
