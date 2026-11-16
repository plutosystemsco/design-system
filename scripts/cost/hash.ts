/**
 * 025 decision 13, as the change review's finding 2 ruled it: two keys per
 * item and per case. The size hash covers everything that decides its size
 * figures; `bun run cost` rebuilds an item whose size hash differs from the
 * report's, and the unit gate fails on one. The runtime key covers what its
 * runtime figures were measured on: the item app's built output and its
 * base's (`outputHash`), the interaction, and the runtime's own files. A
 * rebuild that yields the same output keeps its runtime figures. The unit
 * gate warns on a stale runtime key; the release check refuses one.
 */
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { canonical, INTERACTIONS } from "./interactions.ts";
import {
  APP_DIR,
  closure,
  COST_DIR,
  FIXTURES_DIR,
  lockVersions,
  servedItems,
  servedPath,
  STATIC_R,
  THEME_ITEM,
  UTILS,
  type RegistryItem,
} from "./items.ts";

export type HashContext = {
  /** The compressor's version, as the report's newest full run names it. */
  zlib: string;
  /** The CLI's version, as the repository's `bun.lock` resolves it. */
  cli: string;
  /** Playwright's version, as the repository's `bun.lock` resolves it. */
  playwright: string;
  items: Map<string, RegistryItem>;
  staticR: string;
};

export function hashContext(zlib: string, staticR = STATIC_R): HashContext {
  const lock = lockVersions("bun.lock");
  return {
    zlib,
    cli: lock.get("shadcn-svelte")!,
    playwright: lock.get("@playwright/test")!,
    items: servedItems(staticR),
    staticR,
  };
}

/** Every file under a folder, sorted, without build output or installs. */
function filesUnder(dir: string): string[] {
  return readdirSync(dir)
    .sort()
    .flatMap((e) => {
      if (["node_modules", "build", ".svelte-kit"].includes(e)) return [];
      const full = path.join(dir, e);
      return statSync(full).isDirectory() ? filesUnder(full) : [full];
    });
}

function digest(parts: [string, string | Buffer][]): string {
  const h = createHash("sha256");
  for (const [label, content] of parts) {
    h.update(label);
    h.update("\0");
    h.update(content);
    h.update("\0");
  }
  return h.digest("hex");
}

const read = (file: string) => readFileSync(file);
const rel = (file: string) => path.relative(COST_DIR, file);

/** The size hash of an item, or of a case keyed `<item>.<case>`. */
export function sizeHash(key: string, ctx: HashContext): string {
  const [item, kase] = key.split(".") as [string, string | undefined];
  const parts: [string, string | Buffer][] = [];
  // The item's served JSON and every item it pulls, with the template's
  // theme and utils, which every item app is built on.
  const names = new Set([
    ...closure(item, ctx.items),
    ...closure(THEME_ITEM, ctx.items),
    UTILS,
  ]);
  for (const name of [...names].sort())
    parts.push([`item ${name}`, read(servedPath(name, ctx.staticR))]);
  // Its fixture and its case files; a block's route is in its JSON.
  const fixtures = readdirSync(FIXTURES_DIR).sort();
  const own = kase
    ? [`${item}.${kase}.svelte`]
    : fixtures.filter(
        (f) => f === `${item}.svelte` || f.startsWith(`${item}.`),
      );
  for (const f of [...own, "_floor.svelte", "_theme-floor.svelte"])
    if (fixtures.includes(f))
      parts.push([`fixture ${f}`, read(path.join(FIXTURES_DIR, f))]);
  for (const f of filesUnder(APP_DIR)) parts.push([rel(f), read(f)]);
  // `items.ts` decides closures and kinds, which reach this hash through
  // the served JSON and the fixture files (the change review's finding 10).
  for (const f of ["build.ts", "hash.ts", "settings.ts"])
    parts.push([f, read(path.join(COST_DIR, f))]);
  parts.push(["cli", ctx.cli], ["zlib", ctx.zlib]);
  return digest(parts);
}

/**
 * The runtime key of an item or a case: its app's output and its base's (the
 * floor, or for `utils` the theme floor), its interaction entry, and the
 * files and versions that decide how it is timed.
 */
export function runtimeHash(
  key: string,
  ctx: HashContext,
  output: { item: string; base: string },
): string {
  return digest([
    ["output", output.item],
    ["base output", output.base],
    ["interaction", canonical(INTERACTIONS[key])],
    ["_calibrate.svelte", read(path.join(FIXTURES_DIR, "_calibrate.svelte"))],
    ["runtime.ts", read(path.join(COST_DIR, "runtime.ts"))],
    ["stats.ts", read(path.join(COST_DIR, "stats.ts"))],
    ["settings.ts", read(path.join(COST_DIR, "settings.ts"))],
    ["playwright", ctx.playwright],
  ]);
}

/** The runtime key an entry of a report should carry, from the outputs it records. */
export function runtimeKeyOf(
  key: string,
  report: {
    items: Record<
      string,
      { outputHash: string; cases: Record<string, { outputHash: string }> }
    >;
    floor: { outputHash: string };
    themeFloor: { outputHash: string };
  },
  ctx: HashContext,
): string {
  const [item, kase] = key.split(".") as [string, string | undefined];
  const e = kase ? report.items[item]!.cases[kase]! : report.items[item]!;
  const base = item === UTILS ? report.themeFloor : report.floor;
  return runtimeHash(key, ctx, { item: e.outputHash, base: base.outputHash });
}
