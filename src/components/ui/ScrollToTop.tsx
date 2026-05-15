"use client";

import { useEffect } from "react";

/**
 * Belt-and-braces backup for the pre-hydration inline script in
 * [locale]/layout.tsx. That script already pins scroll to 0 across the
 * load cycle and strips the hash on reload; this component covers the
 * bfcache restore case (iOS/Android swipe-back, app-switch return) which
 * the inline script can't see because the page wasn't really re-loaded.
 *
 * Rules — must match the inline script:
 *   - On reload OR bfcache restore: scroll to top + strip hash.
 *   - On fresh navigation with hash: respect deep link (no intervention).
 *   - On fresh navigation without hash: scroll to top.
 */
export function ScrollToTop() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    const stripHashAndPin = () => {
      if (window.location.hash) {
        try {
          history.replaceState(
            null,
            "",
            window.location.pathname + window.location.search
          );
        } catch (_) {
          /* noop */
        }
      }
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    };

    // Handle bfcache restore on iOS/Android — refresh-like behavior.
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        stripHashAndPin();
      }
    };
    window.addEventListener("pageshow", onPageShow);

    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  return null;
}
