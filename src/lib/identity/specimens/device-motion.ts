/**
 * Motion helpers for the device board (question F). Every device that moves
 * shows its composed end state under `prefers-reduced-motion: reduce`, and
 * anything that plays on its own pauses while it is off-screen.
 */

/** Calls `on` now and whenever the reduced-motion preference changes. */
export function watchReducedMotion(on: (reduced: boolean) => void): () => void {
  if (typeof window === "undefined" || !window.matchMedia) {
    on(false);
    return () => {};
  }
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  const handler = () => on(query.matches);
  handler();
  query.addEventListener("change", handler);
  return () => query.removeEventListener("change", handler);
}

/** Calls `on` with whether the node is on screen. */
export function watchVisible(
  node: Element,
  on: (visible: boolean) => void,
): () => void {
  if (typeof IntersectionObserver === "undefined") {
    on(true);
    return () => {};
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) on(entry.isIntersecting);
    },
    { threshold: 0.15 },
  );
  io.observe(node);
  return () => io.disconnect();
}

/** A small seeded random source, so a drawing is the same on every load. */
export function seeded(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export const clamp01 = (t: number) => Math.max(0, Math.min(1, t));
