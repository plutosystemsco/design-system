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

/** 013 decision 3: 20 packages, carets but for the two 1.x grammars' tildes. */
const TREE_SITTER: [name: string, version: string, specifier: string][] = [
  ["web-tree-sitter", "0.27.2", "^0.27.2"],
  ["tree-sitter-typescript", "0.23.2", "^0.23.2"],
  ["tree-sitter-javascript", "0.25.0", "^0.25.0"],
  ["tree-sitter-python", "0.25.0", "^0.25.0"],
  ["tree-sitter-rust", "0.24.0", "^0.24.0"],
  ["tree-sitter-go", "0.25.0", "^0.25.0"],
  ["tree-sitter-java", "0.23.5", "^0.23.5"],
  ["tree-sitter-c-sharp", "0.23.5", "^0.23.5"],
  ["tree-sitter-ruby", "0.23.1", "^0.23.1"],
  ["tree-sitter-html", "0.23.2", "^0.23.2"],
  ["tree-sitter-css", "0.25.0", "^0.25.0"],
  ["tree-sitter-bash", "0.25.1", "^0.25.1"],
  ["tree-sitter-json", "0.24.8", "^0.24.8"],
  ["@tree-sitter-grammars/tree-sitter-yaml", "0.7.1", "^0.7.1"],
  ["@tree-sitter-grammars/tree-sitter-toml", "0.7.0", "^0.7.0"],
  ["@tree-sitter-grammars/tree-sitter-svelte", "1.0.2", "~1.0.2"],
  ["tree-sitter-c", "0.24.1", "^0.24.1"],
  ["tree-sitter-cpp", "0.23.4", "^0.23.4"],
  ["tree-sitter-php", "0.24.2", "^0.24.2"],
  ["@tree-sitter-grammars/tree-sitter-kotlin", "1.1.0", "~1.1.0"],
];

// 001 decision 4's 19 packages, 002 decision 2's 4, 004 decision 2's 9, and 007 decision 7's 2 (the identity exhibit's 6 left with it, 015 decision 11): the version bun.lock pins and the specifier package.json holds.
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
  // 013 decision 3: the runtime and 19 grammar packages, in its table's order.
  ...TREE_SITTER,
];

/** How many of PACKAGES this file names before any appended block adds to it. */
const PACKAGES_015 = PACKAGES.length;

function split(dep: string): { name: string; range?: string } {
  const at = dep.lastIndexOf("@");
  if (at <= 0) return { name: dep };
  return { name: dep.slice(0, at), range: dep.slice(at + 1) };
}

/** 015 decision 11: the six typeface packages only the exhibit imported. */
const EXHIBIT = [
  "@fontsource-variable/figtree",
  "@fontsource-variable/funnel-display",
  "@fontsource-variable/funnel-sans",
  "@fontsource-variable/geist-mono",
  "@fontsource-variable/instrument-sans",
  "@fontsource/ibm-plex-mono",
];

describe("015: the identity exhibit's packages are gone", () => {
  test("0 of the six in package.json or bun.lock", () => {
    const named = EXHIBIT.filter(
      (n) =>
        n in pkg.devDependencies ||
        n in (lock.workspaces[""].devDependencies ?? {}) ||
        n in lock.packages,
    );
    expect(named).toEqual([]);
  });
});

describe("package.json and bun.lock", () => {
  // The set is PACKAGES as a later specification extends it: its own block,
  // appended to this file, pushes its packages onto PACKAGES before any test
  // runs. 015's own count stays 54.
  test("name exactly the packages of PACKAGES, all devDependencies; 015's are 54", () => {
    expect(PACKAGES.slice(0, PACKAGES_015)).toHaveLength(54);
    expect(pkg.dependencies ?? {}).toEqual({});
    expect(Object.keys(pkg.devDependencies).sort()).toEqual(
      PACKAGES.map(([n]) => n).sort(),
    );
  });

  // 013 criterion 1: 18 carets and 2 tildes.
  test("the 20 of 013 decision 3: 18 carets and 2 tildes", () => {
    expect(TREE_SITTER).toHaveLength(20);
    const specs = TREE_SITTER.map(([name]) => pkg.devDependencies[name]);
    expect(specs.filter((s) => s.startsWith("^"))).toHaveLength(18);
    expect(specs.filter((s) => s.startsWith("~"))).toHaveLength(2);
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
    out = mkdtempSync(path.join(tmpdir(), "kuiper-deps-"));
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

  /** 004 decision 2: the CodeMirror packages code-editor names; 013 decision 16 drops @lezer/highlight, which no file of ours imports. */
  const CODEMIRROR = [
    "@codemirror/state",
    "@codemirror/view",
    "@codemirror/language",
    "@codemirror/commands",
    "@codemirror/autocomplete",
    "@codemirror/lang-python",
  ];
  /** 013 decision 5: the runtime and the grammars highlighter names. */
  const GRAMMARS = TREE_SITTER.map(([name]) => name);

  /** 007 decision 7: the two packages code-languages names beside @codemirror/language. */
  const LANGUAGES = [
    "@codemirror/language-data",
    "@replit/codemirror-lang-svelte",
  ];

  // 004 decision 17: 18; 007 decision 7: 20; 013: 39.
  test("are 39: shadcn-svelte, cn, the 3 fonts, 002 decision 2's 4, shiki, the 6 of code-editor, layerchart, the 2 of code-languages and the 20 of highlighter", () => {
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
        ...GRAMMARS,
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

  test("each has a range in package.json: a caret, or 013 decision 3's tilde for the two 1.x grammars", () => {
    for (const name of named.keys())
      expect(pkg.devDependencies[name]).toMatch(
        GRAMMARS.includes(name) ? /^[\^~]\d/ : /^\^\d/,
      );
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
        ...GRAMMARS,
      ].sort(),
    );
    for (const [name, range] of stated)
      expect(pkg.devDependencies[name]).toBe(range);
  });
});

// 017 decision 4: the two packages that outline the downloads' word, exact.
const PACKAGES_017: [name: string, version: string, specifier: string][] = [
  ["fontkit", "2.0.4", "2.0.4"],
  ["wawoff2", "2.0.1", "2.0.1"],
];
PACKAGES.push(...PACKAGES_017);

describe("017: the downloads' two packages", () => {
  test.each(PACKAGES_017)(
    "%s: bun.lock resolves %s; package.json says %s, exact, in devDependencies",
    (name, version, spec) => {
      expect(pkg.devDependencies[name]).toBe(spec);
      expect(lock.workspaces[""].devDependencies[name]).toBe(spec);
      expect(lock.packages[name][0]).toBe(`${name}@${version}`);
    },
  );
});

// 019 decision 12: the screen-reader check's one package, dev-only, exact.
// It ships in no item, and no suite runs the script that uses it.
const PACKAGES_019: [name: string, version: string, specifier: string][] = [
  ["@guidepup/guidepup", "0.40.0", "0.40.0"],
];
PACKAGES.push(...PACKAGES_019);

describe("019: the screen-reader check's package", () => {
  test.each(PACKAGES_019)(
    "%s: bun.lock resolves %s; package.json says %s, exact, in devDependencies",
    (name, version, spec) => {
      expect(pkg.devDependencies[name]).toBe(spec);
      expect(lock.workspaces[""].devDependencies[name]).toBe(spec);
      expect(lock.packages[name][0]).toBe(`${name}@${version}`);
    },
  );
});
