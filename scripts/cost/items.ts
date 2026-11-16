/**
 * 025 decision 8: what the harness measures, read from the registry. Every
 * registry item is a floor item (the theme item, the fonts and any alias), a
 * block (measured at the route it installs), or has a fixture file.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

export const REPO = path.resolve(import.meta.dir, "..", "..");
export const COST_DIR = path.join(REPO, "scripts", "cost");
export const APP_DIR = path.join(COST_DIR, "app");
export const FIXTURES_DIR = path.join(COST_DIR, "fixtures");
export const STATIC_R = path.join(REPO, "static", "r");
export const STYLE_DIR = path.join("styles", "maia");

/** The theme item: the theme floor holds it, with its fonts. */
export const THEME_ITEM = "kuiper-theme";
/** `cn`'s item: the floor holds it (decision 1). Its base is the theme floor. */
export const UTILS = "utils";

export type RegistryItem = {
  name: string;
  type: string;
  registryDependencies?: string[];
  dependencies?: string[];
  devDependencies?: string[];
  font?: { dependency?: string };
  files?: { path?: string; type: string; target?: string; content?: string }[];
  meta?: { deprecated?: unknown };
};

/** The items of `registry.json`, in its order. */
export function registryItems(): RegistryItem[] {
  return JSON.parse(readFileSync(path.join(REPO, "registry.json"), "utf8"))
    .items;
}

/** An item as `static/r/` serves it: the JSON the CLI reads. */
export function servedPath(name: string, staticR = STATIC_R): string {
  return path.join(staticR, STYLE_DIR, `${name}.json`);
}

export function servedItem(name: string, staticR = STATIC_R): RegistryItem {
  return JSON.parse(readFileSync(servedPath(name, staticR), "utf8"));
}

/** The built items of `static/r/`, by name. */
export function servedItems(staticR = STATIC_R): Map<string, RegistryItem> {
  const dir = path.join(staticR, STYLE_DIR);
  const out = new Map<string, RegistryItem>();
  for (const f of readdirSync(dir).sort()) {
    if (!f.endsWith(".json") || f === "index.json") continue;
    const item = JSON.parse(readFileSync(path.join(dir, f), "utf8"));
    out.set(item.name, item);
  }
  return out;
}

export type Kinds = {
  /** The theme item, its fonts, and any deprecated alias: inside the theme floor. */
  floor: string[];
  /** Measured at the route each installs. */
  blocks: string[];
  /** Each has `fixtures/<item>.svelte`. */
  fixtures: string[];
  /** Each `fixtures/<item>.<case>.svelte`. */
  cases: { item: string; case: string }[];
  /** The items with a row of their own: the fixtures' and the blocks'. */
  measured: string[];
};

/** Sorts the registry into decision 8's kinds. */
export function classify(): Kinds {
  const floor: string[] = [];
  const blocks: string[] = [];
  const fixtures: string[] = [];
  for (const item of registryItems()) {
    if (
      item.name === THEME_ITEM ||
      item.type === "registry:font" ||
      item.meta?.deprecated
    )
      floor.push(item.name);
    else if (item.type === "registry:block") blocks.push(item.name);
    else fixtures.push(item.name);
  }
  const cases = readdirSync(FIXTURES_DIR)
    .filter((f) => f.endsWith(".svelte") && !f.startsWith("_"))
    .map((f) => f.slice(0, -".svelte".length))
    .filter((f) => f.includes("."))
    .map((f) => {
      const at = f.indexOf(".");
      return { item: f.slice(0, at), case: f.slice(at + 1) };
    })
    .sort((a, b) => `${a.item}.${a.case}`.localeCompare(`${b.item}.${b.case}`));
  return {
    floor,
    blocks,
    fixtures,
    cases,
    measured: [...fixtures, ...blocks],
  };
}

/**
 * The items the catalogue renders, and the alone figures it is set beside:
 * every measured item but the blocks and `utils`, whose figure is over the
 * theme floor while the catalogue's is over the floor.
 */
export function catalogueItems(): string[] {
  return classify().fixtures.filter((n) => n !== UTILS);
}

/** An item and every item it pulls, transitively, sorted. */
export function closure(
  name: string,
  items: Map<string, RegistryItem> = servedItems(),
): string[] {
  const seen = new Set<string>();
  const visit = (n: string) => {
    if (seen.has(n)) return;
    seen.add(n);
    for (const d of items.get(n)?.registryDependencies ?? []) visit(d);
  };
  visit(name);
  return [...seen].sort();
}

/** A package name from a registry dependency such as `bits-ui@^2.20.2` or `@scope/x@1`. */
export function packageName(spec: string): string {
  const at = spec.indexOf("@", spec.startsWith("@") ? 1 : 0);
  return at === -1 ? spec : spec.slice(0, at);
}

/** The npm packages an item names: its dependencies, its devDependencies and its font's. */
export function packagesOf(item: RegistryItem): string[] {
  return [
    ...(item.dependencies ?? []),
    ...(item.devDependencies ?? []),
    ...(item.font?.dependency ? [item.font.dependency] : []),
  ].map(packageName);
}

/** Every package any built item in `static/r/` names, sorted (decision 2.1). */
export function packagesNamedByItems(staticR = STATIC_R): string[] {
  const all = new Set<string>();
  for (const item of servedItems(staticR).values())
    for (const p of packagesOf(item)) all.add(p);
  return [...all].sort();
}

/** The version a Bun lockfile resolves for each top-level package. */
export function lockVersions(lockfile: string): Map<string, string> {
  const text = readFileSync(
    path.isAbsolute(lockfile) ? lockfile : path.join(REPO, lockfile),
    "utf8",
  );
  const out = new Map<string, string>();
  const re =
    /^ {4}"((?:@[^/"]+\/)?[^/"@]+)": \["((?:@[^/"]+\/)?[^/"@]+)@([^"]+)"/gm;
  for (const m of text.matchAll(re)) if (m[1] === m[2]) out.set(m[1]!, m[3]!);
  return out;
}

/** A file's place in its item: the built registry's `target`, else its `path`. */
export function placeOf(file: { path?: string; target?: string }): string {
  return file.target ?? file.path ?? "";
}

/** Where an item's file lands in an app with the cost app's aliases, as an import path. */
function installedModule(file: {
  type: string;
  path?: string;
  target?: string;
}): string {
  const target = placeOf(file).replace(/\.ts$/, "");
  if (file.type === "registry:ui")
    return `#lib/components/ui/${target.split("/")[0]}`;
  if (file.type === "registry:hook") return `#lib/hooks/${target}`;
  if (file.type === "registry:lib") return `#lib/${target}`;
  if (file.type === "registry:component")
    return `#lib/components/${target.replace(/\.svelte$/, "")}`;
  return `#lib/${target}`;
}

/**
 * Decision 8: what a fixture of `name` may import. Its own item's installed
 * paths; `svelte`; and the packages its own item names, which a fixture needs
 * when the item is a container for them (`chart` draws with `layerchart`).
 */
export function allowedImports(name: string): (spec: string) => boolean {
  const item = servedItem(name);
  const modules = [...new Set((item.files ?? []).map(installedModule))];
  const packages = packagesOf(item);
  return (spec) =>
    spec === "svelte" ||
    spec.startsWith("svelte/") ||
    modules.some(
      (m) => spec === m || spec.startsWith(`${m}/`) || spec.startsWith(`${m}.`),
    ) ||
    packages.some((p) => spec === p || spec.startsWith(`${p}/`));
}

/** The route a block installs, as the browser asks for it; `/` for every other item. */
export function routeOf(name: string): string {
  const item = servedItem(name);
  if (item.type !== "registry:block") return "/";
  const page = (item.files ?? []).find((f) => f.type === "registry:page");
  return `/${placeOf(page!).split("/")[0]}`;
}

/** The fixture file of an item or a case (`<item>.<case>`), or null for a block. */
export function fixtureOf(key: string): string | null {
  const file = path.join(FIXTURES_DIR, `${key}.svelte`);
  return existsSync(file) ? file : null;
}
