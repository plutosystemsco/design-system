/**
 * 024c: a component page fetches its text face first.
 *
 * Text shows in the fallback until Geist arrives (`font-display: swap`).
 * Where a header line fits in one face and not the other, it re-wraps when
 * the face arrives, and everything under it moves: `label`'s frame header
 * and `native-select`'s facts line did, a CLS of 0.09 and 0.087.
 *
 * `018` preloaded the face from the page's `<svelte:head>`. SvelteKit puts
 * that after its own module preloads, 70 on a component page, so under the
 * perf profile the font waited for a connection behind them and came at
 * about 2.9 s, long after the first paint. SvelteKit's own font preload is
 * written before the module preloads, so the face arrives before the first
 * paint and nothing re-wraps.
 */

/** Geist's latin file, as SvelteKit names a font: its source path from the root. */
export const TEXT_FACE =
  "node_modules/@fontsource-variable/geist/files/geist-latin-wght-normal.woff2";

/** A component page's route: `/(site)/components/<name>`, not the index. */
const COMPONENT_ROUTE = /^\/\(site\)\/components\/[^/]+$/;

export type PreloadInput =
  | { type: "css" | "js" | "asset"; path: string }
  | { type: "font"; path: string; filename: string };

/**
 * `resolve`'s `preload` for a route: SvelteKit's default (scripts and
 * styles), and on a component page the text face too.
 */
export function preloadFor(
  routeId: string | null,
): (input: PreloadInput) => boolean {
  const component = routeId !== null && COMPONENT_ROUTE.test(routeId);
  return (input) =>
    input.type === "js" ||
    input.type === "css" ||
    (component && input.type === "font" && input.filename === TEXT_FACE);
}
