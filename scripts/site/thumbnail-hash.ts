/**
 * 018 decision 13: what a component's thumbnail is made from, hashed. A
 * change to any of these stales the item's two pictures:
 *
 * - its first example (or its block's or composition's first view) and that
 *   file's local imports, walked transitively (relative, `#lib/…` and
 *   `scripts/…` imports; package imports are not followed);
 * - every file the item and its registry dependencies list;
 * - the stage: `frame.svelte` and `site.css`, and the block viewer's files
 *   for a block or a composition;
 * - the theme, `src/app.css`, and the site's root stylesheet that imports
 *   it, `src/routes/layout.css` (020a);
 * - the locked versions of the three font packages and of
 *   `@playwright/test`, which pins its Chromium;
 * - the thumbnails script itself.
 *
 * Pure over a root folder, so the unit test can hash a copy of the tree.
 */
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { firstStage } from "../../src/lib/site/example-order.ts";

export const THUMBNAILS = "src/lib/site/thumbnails";
export const MANIFEST = `${THUMBNAILS}/manifest.json`;
export const SCRIPT = "scripts/site/thumbnails.ts";
const PACKAGES = [
  "@fontsource-variable/geist",
  "@fontsource-variable/ibm-plex-sans",
  "@fontsource-variable/jetbrains-mono",
  "@playwright/test",
];

type Item = {
  name: string;
  files: { path: string }[];
  registryDependencies?: string[];
};

function file(root: string, rel: string): string | null {
  const full = path.join(root, rel);
  return existsSync(full) && statSync(full).isFile() ? full : null;
}

/** A local import's file, relative to the root, or null for a package. */
function resolve(root: string, spec: string, from: string): string | null {
  let base: string;
  if (spec.startsWith("#lib/")) base = path.join("src/lib", spec.slice(5));
  else if (spec === "#lib") base = "src/lib";
  else if (spec.startsWith(".")) base = path.join(path.dirname(from), spec);
  else return null;
  for (const c of [
    base,
    `${base}.ts`,
    `${base}.svelte`,
    path.join(base, "index.ts"),
    `${base}.js`,
  ])
    if (file(root, c)) return path.normalize(c);
  return null;
}

/** A file and every local file it imports, transitively, relative to the root. */
export function localGraph(root: string, start: string): string[] {
  const seen = new Set<string>();
  const walk = (f: string) => {
    if (seen.has(f) || !file(root, f)) return;
    seen.add(f);
    const text = readFileSync(path.join(root, f), "utf8");
    for (const m of text.matchAll(
      /(?:import|export)\s[^"';]*?from\s*["']([^"']+)["']|import\s*\(?\s*["']([^"']+)["']/g,
    )) {
      const next = resolve(root, (m[1] ?? m[2]).replace(/\?.*$/, ""), f);
      if (next) walk(next);
    }
  };
  walk(start);
  return [...seen];
}

/** The route file that renders a view's address. */
function viewFile(root: string, url: string): string | null {
  const rel = url.replace(/^\/|\/$/g, "");
  for (const group of readdirSync(path.join(root, "src/routes"))) {
    const f = path.join("src/routes", group, rel, "+page.svelte");
    if (file(root, f)) return f;
  }
  return null;
}

/** The locked version of a package, from bun.lock. */
function locked(root: string, name: string): string {
  const lock = readFileSync(path.join(root, "bun.lock"), "utf8");
  const key = `"${name}": ["`;
  const at = lock.indexOf(key);
  return at < 0
    ? `${name}@?`
    : lock.slice(at + key.length, lock.indexOf('"', at + key.length));
}

/** Every source a thumbnail of the item is made from, sorted. */
export function thumbnailInputs(root: string, name: string): string[] {
  const registry = JSON.parse(
    readFileSync(path.join(root, "registry.json"), "utf8"),
  ) as { items: Item[] };
  const byName = new Map(registry.items.map((i) => [i.name, i]));
  const items = new Set<string>();
  const walk = (n: string) => {
    if (items.has(n) || !byName.has(n)) return;
    items.add(n);
    for (const d of byName.get(n)!.registryDependencies ?? []) walk(d);
  };
  walk(name);
  const stage = firstStage(name);
  const start =
    stage?.kind === "example"
      ? `src/lib/site/examples/${name}/${stage.id}.svelte`
      : stage
        ? viewFile(root, stage.url)
        : null;
  const files = new Set<string>([
    ...(start ? localGraph(root, start) : []),
    ...[...items].flatMap((n) => byName.get(n)!.files.map((f) => f.path)),
    "src/lib/site/page/frame.svelte",
    "src/lib/site/site.css",
    "src/app.css",
    // 020a: the site's root stylesheet, the theme and the site's sources.
    "src/routes/layout.css",
    SCRIPT,
    "scripts/site/thumbnail-hash.ts",
    "src/lib/site/example-order.ts",
    ...(stage?.kind === "view"
      ? localGraph(root, "src/lib/preview/block-viewer.svelte")
      : []),
    // 018 change review: the page an example is photographed on. Its
    // route (which passes the example its data), the component template
    // that sizes the stage's column, and the site's layout with its chrome.
    ...(stage?.kind === "example"
      ? [
          ...["+page.svelte", "+page.server.ts", "+page.ts"].flatMap((f) =>
            localGraph(root, `src/routes/(site)/components/${name}/${f}`),
          ),
          ...localGraph(root, "src/lib/site/page/component.svelte"),
          ...localGraph(root, "src/routes/(site)/+layout.svelte"),
        ]
      : []),
    // A view: its group's layout, which every view renders inside.
    ...(stage?.kind === "view" && start
      ? localGraph(
          root,
          start.replace(/(src\/routes\/\([^)]+\)).*$/, "$1/+layout.svelte"),
        )
      : []),
  ]);
  return [...files].filter((f) => file(root, f)).sort();
}

/** The item's hash: its inputs' paths and bytes, then the locked versions. */
export function thumbnailHash(root: string, name: string): string {
  const h = createHash("sha256");
  for (const f of thumbnailInputs(root, name)) {
    h.update(f + "\0");
    h.update(readFileSync(path.join(root, f)));
    h.update("\0");
  }
  for (const p of PACKAGES) h.update(locked(root, p) + "\0");
  return h.digest("hex");
}

/** The locked versions the hash reads, for the test to name. */
export function lockedVersions(root: string): string[] {
  return PACKAGES.map((p) => locked(root, p));
}

/** What the test says of stale items: each item's two files, and the script to run. */
export function staleMessage(names: string[]): string {
  return [
    `${names.length} thumbnail pair${names.length === 1 ? " is" : "s are"} stale or missing:`,
    ...names.map(
      (n) => `  ${THUMBNAILS}/${n}-light.webp and ${THUMBNAILS}/${n}-dark.webp`,
    ),
    `Run: bun ${SCRIPT}`,
  ].join("\n");
}
