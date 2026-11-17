/**
 * 022 tests 1 and 2: the seven browser projects, the screen-reader config's
 * reader tag, and the suite's project reads and imports. 032c: neither
 * config lets a `.only` through in CI.
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
  forbidOnly?: boolean;
  use?: Record<string, unknown>;
  expect?: { timeout?: number };
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
      forbidOnly: c.forbidOnly,
      use: c.use ?? {},
      expect: c.expect ?? {},
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

describe("032c: no .only reaches CI", () => {
  // A committed `test.only` would make every shard run that test alone and
  // pass, and the gate would go green on almost nothing.
  test("playwright.config.ts forbids .only in CI, and allows it locally", () => {
    expect(ok(load("playwright.config.ts", { CI: "1" })).forbidOnly).toBe(true);
    expect(ok(load("playwright.config.ts", {})).forbidOnly ?? false).toBe(
      false,
    );
  });
  test("playwright.sr.config.ts forbids .only in CI, and allows it locally", () => {
    for (const r of ["voiceover", "nvda"])
      expect(
        ok(load("playwright.sr.config.ts", { CI: "1", SR_READER: r }))
          .forbidOnly,
      ).toBe(true);
    expect(ok(load("playwright.sr.config.ts", {})).forbidOnly ?? false).toBe(
      false,
    );
  });
});

/** `file:line` of each focused test or suite (a `.only` call) in `source`. */
function focused(source: string, file = ""): string[] {
  // A runner name, or a call such as `test.if(c)`, then `.only` and a call.
  const re =
    /\b(?:test|it|describe|suite|serial|parallel)\s*\.\s*only\s*[.(]|\)\s*\.\s*only\s*[.(]/;
  return source
    .split("\n")
    .flatMap((line, i) => (re.test(line) ? [`${file}:${i + 1}`] : []));
}

describe("032c: no .only in any suite's source", () => {
  // Bun 1.4 refuses `.only` when CI is set, and Playwright now does too; this
  // also catches one locally, and under `CI=false`, before a push.
  test("no file under tests/ focuses a test or a suite", () => {
    const files = readdirSync("tests", { recursive: true })
      .map(String)
      .filter((f) => /\.(ts|js|svelte)$/.test(f));
    expect(
      files.flatMap((f) =>
        focused(readFileSync(path.join("tests", f), "utf8"), f),
      ),
    ).toEqual([]);
  });
  test("the check sees each form (fixture)", () => {
    const only = ".on" + "ly";
    expect(focused(`test${only}("x", () => {});`)).toEqual([":1"]);
    expect(focused(`\n  describe${only}("x", () => {});`)).toEqual([":2"]);
    expect(focused(`it${only}.each([1])("x", () => {});`)).toEqual([":1"]);
    expect(focused(`test ${only.slice(1)}`)).toEqual([]);
    expect(focused(`parseFlags(["--only", "button"]).only`)).toEqual([]);
    // The change review, finding 7.
    expect(focused(`test.describe.serial${only}("x", () => {});`)).toEqual([
      ":1",
    ]);
    expect(focused(`test.describe.parallel${only}("x", () => {});`)).toEqual([
      ":1",
    ]);
    expect(focused(`test.if(linux)${only}("x", () => {});`)).toEqual([":1"]);
    expect(focused(`test.skipIf(mac)${only}("x", () => {});`)).toEqual([":1"]);
  });
});

describe("022aa: every screen-reader action and assertion has a bound", () => {
  // `appears()` bounds the suite's waits (`sr-static.test.ts`). These bound
  // the rest: a locator action (`focus()`, `click()`) and a navigation,
  // which Playwright otherwise lets run to the 5-minute test timeout, and a
  // web-first assertion, which `expect.timeout` bounds (5 s unless set).
  for (const env of [{}, { CI: "1", SR_READER: "voiceover" }])
    test(`actionTimeout, navigationTimeout and expect.timeout are set and finite (${"CI" in env ? "CI" : "local"})`, () => {
      const c = ok(load("playwright.sr.config.ts", env));
      for (const key of ["actionTimeout", "navigationTimeout"]) {
        expect(typeof c.use?.[key], key).toBe("number");
        expect(c.use?.[key] as number, key).toBeGreaterThan(0);
        expect(c.use?.[key] as number, key).toBeLessThanOrEqual(60_000);
      }
      expect(c.expect?.timeout ?? 5000).toBeGreaterThan(0);
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
