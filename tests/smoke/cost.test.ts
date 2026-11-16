/**
 * 025, component cost: criteria 2 (targets), 15 to 19 and 22. The harness is
 * run on a few items, offline, and shown to measure what it says. Nothing
 * here reads the committed report's figures.
 */
import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { chromium } from "@playwright/test";
import {
  addItem,
  copyApp,
  fileHashes,
  Harness,
  OFFLINE_ENV,
  type Built,
} from "../../scripts/cost/build.ts";
import { INTERACTIONS } from "../../scripts/cost/interactions.ts";
import { STATIC_R } from "../../scripts/cost/items.ts";
import { runBlocks, serveBuild } from "../../scripts/cost/runtime.ts";
import { SETTINGS } from "../../scripts/cost/settings.ts";
import { bin, run } from "./process.ts";

const REPO = process.cwd();
const ITEMS = ["separator", "button", "dialog", "sign-in"];
const work = mkdtempSync(path.join(tmpdir(), "kuiper-smoke-cost-"));
/** Criterion 18: a class name the site's Tailwind never sees, built at run time. */
const STALE_CLASS = "bg-" + "fuchsia-950";
let h: Harness;
const built: Record<string, [Built, Built]> = {};

beforeAll(async () => {
  h = await Harness.prepare(path.join(work, "harness"));
  // Criterion 18: a stale build in the template, before any item is copied.
  mkdirSync(path.join(h.template, "build"), { recursive: true });
  writeFileSync(
    path.join(h.template, "build", "stale.html"),
    `<div class="${STALE_CLASS}"></div>`,
  );
}, 280_000);

afterAll(async () => {
  await h?.close();
  rmSync(work, { recursive: true, force: true });
});

describe("025 criterion 15: determinism, offline", () => {
  for (const name of ITEMS)
    test(`${name}: two builds from fresh folders, offline, give equal JS and CSS`, async () => {
      const a = await h.build(name, { folder: `${name}-a` });
      const b = await h.build(name, { folder: `${name}-b` });
      built[name] = [a, b];
      for (const app of [a, b]) {
        expect(app.add!.code, app.add!.output).toBe(0);
        expect(readFileSync(path.join(app.dir, "package.json"), "utf8")).toBe(
          readFileSync(path.join(h.template, "package.json"), "utf8"),
        );
      }
      const ha = fileHashes(a.dir);
      expect(Object.keys(ha).length).toBeGreaterThan(0);
      expect(fileHashes(b.dir)).toEqual(ha);
    }, 280_000);

  test("each built item's main interaction target matches one element (criterion 2)", async () => {
    const browser = await chromium.launch();
    try {
      for (const name of ITEMS) {
        const entry = INTERACTIONS[name];
        if (!entry) continue;
        const [app] = built[name]!;
        const server = serveBuild(path.join(app.dir, "build"));
        const page = await browser.newPage();
        await page.goto(`${server.url}${app.route}`);
        await page.waitForFunction(
          () => performance.getEntriesByName("cost:hydrated").length > 0,
        );
        expect(await page.locator(entry.target).count(), name).toBe(1);
        await page.close();
        server.stop();
      }
    } finally {
      await browser.close();
    }
  }, 120_000);
});

describe("025 criterion 16: the initial set", () => {
  test("for button, dialog and sign-in, the JS and CSS Chromium requests before hydration are the harness's initial set", async () => {
    const browser = await chromium.launch();
    try {
      for (const name of ["button", "dialog", "sign-in"]) {
        const [app] = built[name]!;
        const server = serveBuild(path.join(app.dir, "build"));
        const page = await browser.newPage();
        await page.goto(`${server.url}${app.route}`);
        await page.waitForFunction(
          () => performance.getEntriesByName("cost:hydrated").length > 0,
        );
        // The page's own resource timing: every JS and CSS file whose
        // request started before the hydration mark.
        const asked = await page.evaluate(() => {
          const mark = performance.getEntriesByName("cost:hydrated")[0]!;
          return performance
            .getEntriesByType("resource")
            .filter((r) => r.startTime <= mark.startTime)
            .map((r) => new URL(r.name).pathname.slice(1))
            .filter((p) => /\.(js|css)$/.test(p));
        });
        expect([...new Set(asked)].sort(), name).toEqual(
          [...app.sizes.initial].sort(),
        );
        await page.close();
        server.stop();
      }
    } finally {
      await browser.close();
    }
  }, 120_000);
});

describe("025 criterion 17: A/A, the no-op and calibration", () => {
  test("the floor against itself within ±8 ms; the no-op under 60 ms; calibration within its bound", async () => {
    const floor = await h.build("_floor", { kind: "floor" });
    const calibrate = await h.build("_calibrate", { kind: "calibrate" });
    const result = await runBlocks(
      [
        { key: "aa", app: floor, base: floor, entry: null, settled: false },
        {
          key: "_calibrate",
          app: calibrate,
          base: floor,
          entry: null,
          calibrate: true,
          settled: false,
        },
      ],
      { launches: SETTINGS.launches, measure: true },
    );
    const aa = result.subjects.aa!.hydrate;
    console.info(
      `cost A/A: hydration ${aa.ms} ms [${aa.spread}]; no-op ${result.noopMs} ms; calibrate ${result.calibrateMs} ms; load ${JSON.stringify(result.load)}`,
    );
    expect(Math.abs(aa.ms)).toBeLessThanOrEqual(8);
    expect(result.noopMs).toBeLessThan(60);
    expect(result.calibrateMs).toBeGreaterThanOrEqual(SETTINGS.calibrateMs);
    expect(result.calibrateMs).toBeLessThanOrEqual(
      SETTINGS.calibrateMs + result.noopMs + 16,
    );
  }, 290_000);
});

describe("025 criterion 18: a stale build cannot leak", () => {
  test("no item's CSS holds the class written into the template's build folder", () => {
    for (const name of ITEMS) {
      const [app] = built[name]!;
      const dir = path.join(app.dir, "build", "_app", "immutable", "assets");
      const css = readdirSync(dir)
        .filter((f) => f.endsWith(".css"))
        .map((f) => readFileSync(path.join(dir, f), "utf8"))
        .join("");
      expect(css.length, name).toBeGreaterThan(0);
      expect(css, name).not.toContain("fuchsia");
    }
  });
});

describe("025 criterion 19: the registry guard, and the fixtures type-check", () => {
  test("a static/r one byte off a fresh build exits 2 and says to run build:registry", async () => {
    const copy = path.join(work, "static-r");
    cpSync(STATIC_R, copy, { recursive: true });
    const file = path.join(copy, "styles", "maia", "separator.json");
    writeFileSync(file, readFileSync(file, "utf8") + " ");
    const r = await run(
      [process.execPath, "scripts/cost/run.ts", "--guard", "--registry", copy],
      REPO,
    );
    expect(r.code, r.output).toBe(2);
    expect(r.output).toContain("bun run build:registry");
    expect(r.output).toContain("separator.json");
  }, 120_000);

  test("svelte-check reports 0 errors in the dialog and sign-in item apps", async () => {
    for (const name of ["dialog", "sign-in"]) {
      const [app] = built[name]!;
      const r = await run(
        bin(
          app.dir,
          "svelte-check",
          "--tsconfig",
          "./tsconfig.json",
          "--output",
          "machine",
        ),
        app.dir,
      );
      expect(r.output, name).toMatch(/COMPLETED \d+ FILES 0 ERRORS/);
    }
  }, 120_000);
});

describe("025 criterion 22: an offline add is fast", () => {
  test("add separator, offline, in a fresh copy of the template, exits 0 in under 10 s", async () => {
    const dir = path.join(work, "add-timed");
    copyApp(h.template, dir, h.nodeModules);
    expect(existsSync(path.join(dir, "node_modules"))).toBe(true);
    const t = performance.now();
    const r = await addItem(dir, ["separator"], h.registryUrl, OFFLINE_ENV);
    const ms = performance.now() - t;
    console.info(`cost: an offline add took ${Math.round(ms)} ms`);
    expect(r.code, r.output).toBe(0);
    expect(ms).toBeLessThan(SETTINGS.timeouts.addMs);
  }, 60_000);
});
