/**
 * 025 decision 13: two hashes per item and per case. The size hash covers
 * everything that decides its size figures; the runtime hash, that plus what
 * decides its runtime figures. `bun run cost` rebuilds an item whose size
 * hash differs from the report's, and re-measures one whose runtime hash
 * differs. The unit gate holds every hash equal to the report's.
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
  for (const f of ["build.ts", "hash.ts", "items.ts", "settings.ts"])
    parts.push([f, read(path.join(COST_DIR, f))]);
  parts.push(["cli", ctx.cli], ["zlib", ctx.zlib]);
  return digest(parts);
}

/** The runtime hash: the size hash plus the interaction and the runtime's own files. */
export function runtimeHash(key: string, ctx: HashContext): string {
  return digest([
    ["size", sizeHash(key, ctx)],
    ["interaction", canonical(INTERACTIONS[key])],
    ["_calibrate.svelte", read(path.join(FIXTURES_DIR, "_calibrate.svelte"))],
    ["runtime.ts", read(path.join(COST_DIR, "runtime.ts"))],
    ["stats.ts", read(path.join(COST_DIR, "stats.ts"))],
    ["playwright", ctx.playwright],
  ]);
}
