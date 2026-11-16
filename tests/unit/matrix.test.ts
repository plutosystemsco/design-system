/**
 * 022 tests 1 and 2: the seven browser projects, the screen-reader config's
 * reader tag, and the suite's project reads and imports.
 *
 * Each config is loaded in a child Bun process, so its environment
 * (`CI`, `SR_READER`) is read at import time as it is in a real run.
 */
import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

type Project = {
  name: string;
  use: Record<string, unknown>;
  testIgnore: string[];
  testMatch: string[];
  dependencies: string[];
  fullyParallel?: boolean;
};
type Loaded = {
  retries?: number;
  failOnFlakyTests?: boolean;
  tag?: string | string[];
  projects: Project[];
};

/** Load a config in a child process with `env`, as a run would see it. */
function load(
  file: string,
  env: Record<string, string | undefined>,
): Loaded | { error: string } {
  const script = `
    const c = (await import(${JSON.stringify(path.resolve(file))})).default;
    const arr = (x) => (x === undefined ? [] : Array.isArray(x) ? x : [x]).map(String);
    console.log(JSON.stringify({
      retries: c.retries,
      failOnFlakyTests: c.failOnFlakyTests,
      tag: c.tag,
      projects: (c.projects ?? []).map((p) => ({
        name: p.name,
        use: p.use ?? {},
        testIgnore: arr(p.testIgnore),
        testMatch: arr(p.testMatch),
        dependencies: p.dependencies ?? [],
        fullyParallel: p.fullyParallel,
      })),
    }));
  `;
  const base = { ...process.env };
  delete base.CI;
  delete base.SR_READER;
  for (const [k, v] of Object.entries(env)) {
    if (v === undefined) delete base[k];
    else base[k] = v;
  }
  const r = Bun.spawnSync(["bun", "-e", script], { env: base });
  if (r.exitCode !== 0) return { error: r.stderr.toString() };
  return JSON.parse(r.stdout.toString().trim().split("\n").pop()!);
}

const ok = (l: Loaded | { error: string }): Loaded => {
  if ("error" in l) throw new Error(l.error);
  return l;
};

/** Does a project's testIgnore or testMatch keep `file` out? */
function runs(p: Project, file: string): boolean {
  const re = (s: string) => {
    const m = s.match(/^\/(.*)\/([a-z]*)$/);
    return m ? new RegExp(m[1]!, m[2]) : null;
  };
  if (p.testIgnore.some((s) => re(s)?.test(file))) return false;
  if (p.testMatch.length && !p.testMatch.some((s) => re(s)?.test(file)))
    // A glob testMatch is Playwright's default spec pattern.
    return p.testMatch.some((s) => !re(s) && /\.spec\.ts$/.test(file));
  return true;
}

const ENGINES = { chromium: "chromium", firefox: "firefox", webkit: "webkit" };
const SEVEN = [
  "chromium-light",
  "chromium-dark",
  "firefox-light",
  "firefox-dark",
  "webkit-light",
  "webkit-dark",
  "perf",
];

describe("022 test 1: playwright.config.ts", () => {
  const local = ok(load("playwright.config.ts", {}));
  const ci = ok(load("playwright.config.ts", { CI: "1" }));

  test("declares exactly the seven projects of decision 2", () => {
    expect(local.projects.map((p) => p.name).sort()).toEqual([...SEVEN].sort());
  });

  test("each engine has a light and a dark project, the scheme in use.colorScheme", () => {
    for (const engine of Object.keys(ENGINES))
      for (const scheme of ["light", "dark"]) {
        const p = local.projects.find((x) => x.name === `${engine}-${scheme}`)!;
        expect(p.use.colorScheme).toBe(scheme);
        expect(p.use.defaultBrowserType).toBe(engine);
      }
  });

  test("perf is Chromium only, light, perf.spec.ts alone; it waits for Chromium locally only", () => {
    const perf = local.projects.find((p) => p.name === "perf")!;
    expect(perf.use.defaultBrowserType).toBe("chromium");
    expect(perf.use.colorScheme).toBe("light");
    expect(runs(perf, "perf.spec.ts")).toBe(true);
    expect(runs(perf, "axe.spec.ts")).toBe(false);
    expect(perf.fullyParallel).toBe(false);
    expect(perf.dependencies.sort()).toEqual([
      "chromium-dark",
      "chromium-light",
    ]);
    expect(ci.projects.find((p) => p.name === "perf")!.dependencies).toEqual(
      [],
    );
  });

  test("build-output runs only in chromium-light; perf.spec.ts in no engine project", () => {
    for (const p of local.projects.filter((x) => x.name !== "perf")) {
      expect(runs(p, "build-output.spec.ts")).toBe(p.name === "chromium-light");
      expect(runs(p, "perf.spec.ts")).toBe(false);
      expect(runs(p, "axe.spec.ts")).toBe(true);
    }
  });

  test("CI turns on retries: 1 and failOnFlakyTests; locally 0 and off", () => {
    expect(ci.retries).toBe(1);
    expect(ci.failOnFlakyTests).toBe(true);
    expect(local.retries ?? 0).toBe(0);
    expect(local.failOnFlakyTests ?? false).toBe(false);
  });
});

describe("022 test 1: playwright.sr.config.ts tags every test with its reader", () => {
  test("CI, SR_READER=voiceover: @reader-voiceover", () => {
    const c = ok(
      load("playwright.sr.config.ts", { CI: "1", SR_READER: "voiceover" }),
    );
    expect([c.tag].flat()).toEqual(["@reader-voiceover"]);
  });
  test("CI, SR_READER=nvda: @reader-nvda", () => {
    const c = ok(
      load("playwright.sr.config.ts", { CI: "1", SR_READER: "nvda" }),
    );
    expect([c.tag].flat()).toEqual(["@reader-nvda"]);
  });
  test("CI, SR_READER unset: the import throws", () => {
    expect("error" in load("playwright.sr.config.ts", { CI: "1" })).toBe(true);
  });
  test("CI, SR_READER=orca: the import throws", () => {
    const r = load("playwright.sr.config.ts", { CI: "1", SR_READER: "orca" });
    expect("error" in r).toBe(true);
  });
  test("three browser projects, serial, retries 2 in CI", () => {
    const c = ok(
      load("playwright.sr.config.ts", { CI: "1", SR_READER: "nvda" }),
    );
    expect(c.projects.map((p) => p.name).sort()).toEqual([
      "chromium",
      "firefox",
      "webkit",
    ]);
    expect(c.retries).toBe(2);
  });
});

const E2E = "tests/e2e";
const SR = "tests/sr";
const files = (dir: string) => {
  try {
    return readdirSync(dir, { recursive: true })
      .map(String)
      .filter((f) => f.endsWith(".ts"))
      .map((f) => path.join(dir, f));
  } catch {
    return [];
  }
};

/** A value import of `test` or `expect` from a module, types aside. */
export function importsTestFrom(source: string, modules: string[]): boolean {
  const re = /import\s+(type\s+)?\{([^}]*)\}\s+from\s+["']([^"']+)["']/g;
  for (const m of source.matchAll(re)) {
    if (m[1] || !modules.includes(m[3]!)) continue;
    const names = m[2]!
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s && !s.startsWith("type "))
      .map((s) => s.split(/\s+as\s+/)[0]!.trim());
    if (names.some((n) => n === "test" || n === "expect")) return true;
  }
  return false;
}

describe("022 test 2: project reads and imports", () => {
  test("no file in tests/e2e/ but scheme.ts reads .project.name", () => {
    const readers = files(E2E).filter(
      (f) =>
        path.basename(f) !== "scheme.ts" &&
        /\.project\.name\b/.test(readFileSync(f, "utf8")),
    );
    expect(readers).toEqual([]);
  });

  test("no spec file imports test or expect from @playwright/test or @guidepup/playwright", () => {
    const specs = [...files(E2E), ...files(SR)].filter((f) =>
      /\.(spec|sr)\.ts$/.test(f),
    );
    expect(specs.length).toBeGreaterThan(0);
    const direct = specs.filter((f) =>
      importsTestFrom(readFileSync(f, "utf8"), [
        "@playwright/test",
        "@guidepup/playwright",
      ]),
    );
    expect(direct).toEqual([]);
  });

  test("the import check sees a direct import, and lets a type import through", () => {
    expect(
      importsTestFrom(`import { expect, test } from "@playwright/test";`, [
        "@playwright/test",
      ]),
    ).toBe(true);
    expect(
      importsTestFrom(`import { type Page } from "@playwright/test";`, [
        "@playwright/test",
      ]),
    ).toBe(false);
    expect(
      importsTestFrom(`import type { Page } from "@playwright/test";`, [
        "@playwright/test",
      ]),
    ).toBe(false);
  });
});
