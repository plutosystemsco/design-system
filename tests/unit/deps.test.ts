import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { buildRegistry } from "../../scripts/build-registry.ts";

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
// bun.lock is JSON with trailing commas.
const lock = JSON.parse(
  readFileSync("bun.lock", "utf8").replace(/,(\s*[}\]])/g, "$1"),
);

// 001 decision 4's 19 packages, 002 decision 2's 4, 004 decision 2's 9 and 007 decision 7's 2: the version bun.lock pins and the specifier package.json holds.
const PACKAGES: [name: string, version: string, specifier: string][] = [
  ["shadcn-svelte", "1.7.1", "^1.7.1"],
  ["@sveltejs/kit", "3.1.0", "3.1.0"],
  ["@sveltejs/adapter-static", "4.0.0", "4.0.0"],
  ["@sveltejs/vite-plugin-svelte", "7.3.1", "7.3.1"],
  ["svelte", "5.57.3", "5.57.3"],
  ["vite", "8.3.5", "8.3.5"],
  ["tailwindcss", "4.3.3", "4.3.3"],
  ["@tailwindcss/vite", "4.3.3", "4.3.3"],
  ["typescript", "6.0.3", "6.0.3"],
  ["svelte-check", "4.7.7", "4.7.7"],
  ["@types/bun", "1.3.14", "1.3.14"],
  ["cn", "0.5.0", "^0.5.0"],
  ["@fontsource-variable/geist", "5.3.0", "^5.3.0"],
  ["@fontsource-variable/ibm-plex-sans", "5.3.0", "^5.3.0"],
  ["@fontsource-variable/jetbrains-mono", "5.3.0", "^5.3.0"],
  ["@playwright/test", "1.64.1", "1.64.1"],
  ["@axe-core/playwright", "4.14.0", "4.14.0"],
  ["prettier", "3.9.10", "3.9.10"],
  ["prettier-plugin-svelte", "4.1.1", "4.1.1"],
  ["bits-ui", "2.20.2", "^2.20.2"],
  ["@internationalized/date", "3.12.4", "^3.12.4"],
  ["tailwind-variants", "3.3.1", "^3.3.1"],
  ["phosphor-svelte", "3.1.1", "^3.1.1"],
  // 004 decision 2, in its order.
  ["shiki", "4.5.0", "^4.5.0"],
  ["@codemirror/state", "6.7.6", "^6.7.6"],
  ["@codemirror/view", "6.43.15", "^6.43.15"],
  ["@codemirror/language", "6.13.1", "^6.13.1"],
  ["@codemirror/commands", "6.11.1", "^6.11.1"],
  ["@codemirror/autocomplete", "6.20.4", "^6.20.4"],
  ["@codemirror/lang-python", "6.2.1", "^6.2.1"],
  ["@lezer/highlight", "1.2.5", "^1.2.5"],
  ["layerchart", "2.9.2", "^2.9.2"],
  // 007 decision 7: the two packages of code-languages.
  ["@codemirror/language-data", "6.5.2", "^6.5.2"],
  ["@replit/codemirror-lang-svelte", "6.0.0", "^6.0.0"],
];

function split(dep: string): { name: string; range?: string } {
  const at = dep.lastIndexOf("@");
  if (at <= 0) return { name: dep };
  return { name: dep.slice(0, at), range: dep.slice(at + 1) };
}

describe("package.json and bun.lock", () => {
  test("name exactly the 34 packages, all devDependencies", () => {
    expect(PACKAGES).toHaveLength(34);
    expect(pkg.dependencies ?? {}).toEqual({});
    expect(Object.keys(pkg.devDependencies).sort()).toEqual(
      PACKAGES.map(([n]) => n).sort(),
    );
  });

  test.each(PACKAGES)(
    "%s: bun.lock resolves %s; package.json says %s",
    (name, version, spec) => {
      expect(pkg.devDependencies[name]).toBe(spec);
      expect(lock.workspaces[""].devDependencies[name]).toBe(spec);
      expect(lock.packages[name][0]).toBe(`${name}@${version}`);
    },
  );

  test("packageManager is bun@1.3.14", () => {
    expect(pkg.packageManager).toBe("bun@1.3.14");
  });

  test('engines is { bun: ">=1.3.14" }, with no node key', () => {
    expect(pkg.engines).toEqual({ bun: ">=1.3.14" });
    expect("node" in pkg.engines).toBe(false);
  });

  test("no .nvmrc exists", () => {
    expect(existsSync(".nvmrc")).toBe(false);
  });
});

describe("the npm packages items name", () => {
  let out: string;
  const named = new Map<string, string | undefined>();
  /** Every range any item states for each package, to catch two items that disagree. */
  const ranges = new Map<string, Set<string | undefined>>();
  const note = (name: string, range: string | undefined) => {
    named.set(name, range);
    if (!ranges.has(name)) ranges.set(name, new Set());
    ranges.get(name)!.add(range);
  };

  beforeAll(async () => {
    out = mkdtempSync(path.join(tmpdir(), "pluto-deps-"));
    await buildRegistry({ out, quiet: true });
    const dir = path.join(out, "r", "styles", "maia");
    const index = JSON.parse(
      readFileSync(path.join(dir, "index.json"), "utf8"),
    );
    for (const entry of index) {
      const item = JSON.parse(
        readFileSync(path.join(dir, `${entry.name}.json`), "utf8"),
      );
      for (const dep of [
        ...(item.dependencies ?? []),
        ...(item.devDependencies ?? []),
      ]) {
        const { name, range } = split(dep);
        note(name, range);
      }
      if (item.font?.dependency) note(item.font.dependency, undefined);
    }
  }, 60_000);

  afterAll(() => {
    if (out) rmSync(out, { recursive: true, force: true });
  });

  /** 004 decision 2: the 7 CodeMirror and Lezer packages code-editor names. */
  const CODEMIRROR = [
    "@codemirror/state",
    "@codemirror/view",
    "@codemirror/language",
    "@codemirror/commands",
    "@codemirror/autocomplete",
    "@codemirror/lang-python",
    "@lezer/highlight",
  ];

  /** 007 decision 7: the two packages code-languages names beside @codemirror/language. */
  const LANGUAGES = [
    "@codemirror/language-data",
    "@replit/codemirror-lang-svelte",
  ];

  // 004 decision 17: 18; 007 decision 7: 20.
  test("are 20: shadcn-svelte, cn, the 3 fonts, 002 decision 2's 4, shiki, the 7 of code-editor, layerchart and the 2 of code-languages", () => {
    expect([...named.keys()].sort()).toEqual(
      [
        "@fontsource-variable/geist",
        "@fontsource-variable/ibm-plex-sans",
        "@fontsource-variable/jetbrains-mono",
        "cn",
        "shadcn-svelte",
        "bits-ui",
        "@internationalized/date",
        "tailwind-variants",
        "phosphor-svelte",
        "shiki",
        ...CODEMIRROR,
        "layerchart",
        ...LANGUAGES,
      ].sort(),
    );
  });

  test("every item that names a package states the same range for it", () => {
    for (const [name, set] of ranges)
      expect([...set], `${name} has one range across items`).toHaveLength(1);
  });

  test("no item names tailwind-merge, tw-animate-css or codemirror", () => {
    expect(named.has("tailwind-merge")).toBe(false);
    expect(named.has("tw-animate-css")).toBe(false);
    expect(named.has("codemirror")).toBe(false);
  });

  // 005 decision 2: three packages weighed and not added.
  test("no item names mode-watcher, svelte-sonner or @shadcn-svelte/primitives, and package.json holds none", () => {
    for (const name of [
      "mode-watcher",
      "svelte-sonner",
      "@shadcn-svelte/primitives",
      "@lucide/svelte",
    ]) {
      expect(named.has(name)).toBe(false);
      expect(pkg.devDependencies[name]).toBeUndefined();
    }
  });

  test("each has a range in package.json", () => {
    for (const name of named.keys())
      expect(pkg.devDependencies[name]).toMatch(/^\^\d/);
  });

  test("where the item states a range, package.json's specifier equals it", () => {
    const stated = [...named].filter(([, range]) => range !== undefined);
    expect(stated.map(([name]) => name).sort()).toEqual(
      [
        "cn",
        "shadcn-svelte",
        "bits-ui",
        "@internationalized/date",
        "tailwind-variants",
        "phosphor-svelte",
        "shiki",
        ...CODEMIRROR,
        "layerchart",
        ...LANGUAGES,
      ].sort(),
    );
    for (const [name, range] of stated)
      expect(pkg.devDependencies[name]).toBe(range);
  });
});
