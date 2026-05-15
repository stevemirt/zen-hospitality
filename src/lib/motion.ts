export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isTouchDevice(): boolean {
  if (typeof window === "undefined") return false;
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

export function isSaveData(): boolean {
  if (typeof navigator === "undefined") return false;
  // @ts-expect-error - non-standard but widely supported
  return Boolean(navigator.connection?.saveData);
}
