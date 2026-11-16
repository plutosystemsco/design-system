/**
 * 022 decision 11: the screen-reader candidates, re-derived from item
 * source. An item is a candidate when one of its own files (by
 * `registry.json`) holds a signal of a live region, a focus move or an
 * overlay. Every candidate must be in `SR_ITEMS` or `SR_EXCLUDED`.
 */
import { readFileSync } from "node:fs";

export type Signal =
  | "live role"
  | "aria-live"
  | "role map"
  | "Status import"
  | ".focus("
  | 'tabindex="-1"'
  | "portal, overlay or sheet"
  | "tooltip";

const SIGNALS: [Signal, RegExp][] = [
  ["live role", /\brole=["'](?:status|alert|log)["']/],
  ["aria-live", /\baria-live\b/],
  // A role chosen from a map, as alert.svelte's ROLE[variant] holds them.
  ["role map", /\b[A-Za-z_]+\s*:\s*["'](?:status|alert|log)["']\s*[,}\n]/],
  ["Status import", /import\s+(?:\{[^}]*\bStatus\b[^}]*\}|Status)\s+from/],
  [".focus(", /\.focus\(/],
  ['tabindex="-1"', /\btabindex=(?:["']-1["']|\{-1\})/i],
  ["portal, overlay or sheet", /\b(?:Portal|portal|Overlay|overlay|Sheet)\b/],
  // A pointer tooltip, such as layerchart's in `chart`.
  ["tooltip", /\bTooltip\b/],
];

type Item = { name: string; type: string; files?: { path: string }[] };

/** Each candidate item, with the signals its own files hold. */
export function candidates(
  registryPath = "registry.json",
): Map<string, Signal[]> {
  const registry = JSON.parse(readFileSync(registryPath, "utf8")) as {
    items: Item[];
  };
  const out = new Map<string, Signal[]>();
  for (const item of registry.items) {
    if (item.type !== "registry:ui" && item.type !== "registry:block") continue;
    const text = (item.files ?? [])
      .map((f) => readFileSync(f.path, "utf8"))
      .join("\n");
    const found = SIGNALS.filter(([, re]) => re.test(text)).map(([s]) => s);
    if (found.length) out.set(item.name, found);
  }
  return out;
}

/** An item's transitive registry dependencies, by `registry.json`. */
export function dependencies(
  name: string,
  registryPath = "registry.json",
): Set<string> {
  const registry = JSON.parse(readFileSync(registryPath, "utf8")) as {
    items: (Item & { registryDependencies?: string[] })[];
  };
  const by = new Map(registry.items.map((i) => [i.name, i]));
  const seen = new Set<string>();
  const walk = (n: string) => {
    for (const d of by.get(n)?.registryDependencies ?? [])
      if (!seen.has(d)) {
        seen.add(d);
        walk(d);
      }
  };
  walk(name);
  return seen;
}
