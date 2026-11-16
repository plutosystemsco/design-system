/**
 * 024: every site page held to its template's budgets (`budgets.ts`).
 *
 * `015` decision 23's profile: Chromium at 1280 × 900, a cold cache, the
 * files served gzipped (`.wasm` too, 024 decision 7), the network at
 * 1.6 Mbps down, 750 kbps up and 150 ms round trip, the CPU slowed 4×.
 * Transfer counts the main frame only, without the search index; `.wasm`
 * requests are counted in every frame.
 *
 * Every run (024 decision 6):
 * - `024 transfer: <template>`: each page of the template, one cold load,
 *   unthrottled; every page at or under the template's transfer budget, and
 *   no `.wasm` outside `WASM_ALLOWED`.
 * - `024 paint: <template>: <page>`: each probe page, 3 cold loads under the
 *   profile; the medians against LCP (decision 8 chooses the figure) and
 *   CLS, and the throttled transfer against the unthrottled (criterion 4).
 *
 * On demand, `PERF_SWEEP=1` replaces both with the sweep: every page, 3
 * loads under the profile and one unthrottled, one test per page, written
 * to `test-results/perf-sweep.json`. Transfer gates on the unthrottled load
 * everywhere: a throttled load of a live page can stop before tree-sitter
 * is asked for (024 criterion 4; the change review's finding 2).
 *
 * Test titles name the template and page only, so a re-base renames no
 * test (`022`'s ledger keys on titles); the budgets are in the annotations.
 *
 * Run it alone: `bun --bun playwright test --project=perf --no-deps`.
 */
import type { Browser } from "@playwright/test";
import { expect, test } from "../test.ts";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { componentPath, SITEMAP } from "../../src/lib/site/sitemap.ts";
import {
  budgetOf,
  lcpBudget,
  LIVE_HIGHLIGHT,
  pagesOf,
  WASM_ALLOWED,
  TEMPLATE_IDS,
  TEMPLATES,
  templateOf,
  type TemplateId,
} from "./budgets.ts";

const BUILD = path.resolve("build");
const TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".woff2": "font/woff2",
  ".wasm": "application/wasm",
  ".svg": "image/svg+xml",
};
/** What the server gzips: text, and `.wasm` as `025` decision 4 does (024 decision 7). */
const GZIP = /text|javascript|json|svg|wasm/;

let server: ReturnType<typeof Bun.serve>;
let origin = "";
test.beforeAll(() => {
  server = Bun.serve({
    port: 0,
    async fetch(req) {
      let p = decodeURIComponent(new URL(req.url).pathname);
      if (p.endsWith("/")) p += "index.html";
      const file = path.join(BUILD, p);
      if (!existsSync(file) || !statSync(file).isFile())
        return new Response("not found", { status: 404 });
      const type = TYPES[path.extname(file)] ?? "application/octet-stream";
      if (GZIP.test(type)) {
        const body = Bun.gzipSync(new Uint8Array(readFileSync(file)));
        return new Response(body, {
          headers: { "content-type": type, "content-encoding": "gzip" },
        });
      }
      return new Response(Bun.file(file), {
        headers: { "content-type": type },
      });
    },
  });
  origin = `http://localhost:${server.port}`;
});
test.afterAll(() => server?.stop(true));

export type Run = {
  /** kB as sent, to 0.1 kB. */
  transfer: number;
  lcp: number;
  cls: number;
  /** `.wasm` requests, in every frame. */
  wasm: number;
  /** Each main-frame response, largest first: its path and kB as sent. */
  responses: { url: string; kB: number }[];
};

const kB = (bytes: number) => Math.round(bytes / 102.4) / 10;

/** One cold load, under the profile unless `throttle` is false. */
export async function measure(
  browser: Browser,
  url: string,
  { throttle = true }: { throttle?: boolean } = {},
): Promise<Run> {
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 900 },
  });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
  if (throttle) {
    await cdp.send("Network.emulateNetworkConditions", {
      offline: false,
      latency: 150,
      downloadThroughput: (1.6 * 1024 * 1024) / 8,
      uploadThroughput: (750 * 1024) / 8,
    });
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  }
  const urls = new Map<string, string>();
  const frames = new Map<string, string>();
  const sizes = new Map<string, number>();
  let transfer = 0;
  let wasm = 0;
  const tree = (await cdp.send("Page.getFrameTree")) as {
    frameTree: { frame: { id: string } };
  };
  const main = tree.frameTree.frame.id;
  cdp.on(
    "Network.requestWillBeSent",
    (e: { requestId: string; request: { url: string }; frameId?: string }) => {
      urls.set(e.requestId, e.request.url);
      frames.set(e.requestId, e.frameId ?? "");
    },
  );
  cdp.on(
    "Network.loadingFinished",
    (e: { requestId: string; encodedDataLength: number }) => {
      const u = urls.get(e.requestId) ?? "";
      if (new URL(u, origin).pathname.endsWith(".wasm")) wasm++;
      if (u.includes("/search.json") || frames.get(e.requestId) !== main)
        return;
      transfer += e.encodedDataLength;
      const key = u.startsWith(origin) ? u.slice(origin.length) : u;
      sizes.set(key, (sizes.get(key) ?? 0) + e.encodedDataLength);
    },
  );
  await page.addInitScript(() => {
    const w = window as unknown as { lcp: number; cls: number };
    w.lcp = 0;
    w.cls = 0;
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) w.lcp = e.startTime;
    }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((l) => {
      for (const e of l.getEntries() as unknown as {
        value: number;
        hadRecentInput: boolean;
      }[])
        if (!e.hadRecentInput) w.cls += e.value;
    }).observe({ type: "layout-shift", buffered: true });
  });
  await page.goto(url, { waitUntil: "networkidle", timeout: 120_000 });
  await page.waitForTimeout(500);
  const [lcp, cls] = (await page.evaluate(() => {
    const w = window as unknown as { lcp: number; cls: number };
    return [w.lcp, w.cls];
  })) as [number, number];
  await ctx.close();
  return {
    transfer: kB(transfer),
    lcp: Math.round(lcp),
    cls: Number(cls.toFixed(3)),
    wasm,
    responses: [...sizes]
      .map(([url, bytes]) => ({ url, kB: kB(bytes) }))
      .sort((a, b) => b.kB - a.kB),
  };
}

const median = (xs: number[]) =>
  [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];

/** Pages whose main frame loads tree-sitter, so a throttled load may read lower. */
const LIVE = new Set(LIVE_HIGHLIGHT.map(componentPath));
/** Pages that may fetch `.wasm`, in any frame. */
const WASM = new Set(WASM_ALLOWED.map(componentPath));

/** Criterion 4: how far the throttled transfer may sit from the unthrottled, in kB. */
const THROTTLE_TOLERANCE = 2;

/** The largest files a page loaded, for a failure message. */
const largest = (r: Run, n = 6) =>
  r.responses
    .slice(0, n)
    .map((f) => `${f.url} ${f.kB} kB`)
    .join(", ");

/** The three throttled runs, without the per-response list. */
const brief = (runs: Run[]) =>
  runs.map(({ transfer, lcp, cls, wasm }) => ({ transfer, lcp, cls, wasm }));

/** Decision 8: the paint record, on every machine, gated or not. */
function annotateLcp(
  id: TemplateId,
  page: string,
  runs: Run[],
  lcp: ReturnType<typeof lcpBudget>,
) {
  test.info().annotations.push({
    type: "lcp",
    description: JSON.stringify({
      page,
      template: id,
      runs: runs.map((r) => r.lcp),
      median: median(runs.map((r) => r.lcp)),
      budget: lcp.ms,
      gated: lcp.gated,
    }),
  });
  if (!lcp.gated)
    test.info().annotations.push({
      type: "lcp-not-gated",
      description: "LCP reported, not gated: no runner figure (024 decision 8)",
    });
}

/**
 * Every budget a page must meet: transfer on its unthrottled load (`free`),
 * CLS and LCP on the throttled medians, `.wasm` on every load; and
 * criterion 4, the throttled transfer against the unthrottled. Used by the
 * paint tests and the sweep alike.
 */
function expectWithin(id: TemplateId, page: string, runs: Run[], free: Run) {
  const b = budgetOf(TEMPLATES[id]);
  const lcp = lcpBudget(TEMPLATES[id], process.env);
  test.info().annotations.push({
    type: "budget",
    description: JSON.stringify({ page, template: id, ...b, lcp: lcp.ms }),
  });
  expect
    .soft(
      free.transfer,
      `${page}: transfer ${free.transfer} kB; largest: ${largest(free)}`,
    )
    .toBeLessThanOrEqual(b.transfer);
  expect
    .soft(median(runs.map((r) => r.cls)), `${page}: CLS`)
    .toBeLessThanOrEqual(b.cls);
  if (lcp.gated && lcp.ms !== null)
    expect
      .soft(median(runs.map((r) => r.lcp)), `${page}: LCP (${lcp.source})`)
      .toBeLessThanOrEqual(lcp.ms);
  if (!WASM.has(page))
    expect
      .soft(
        [...runs, free].map((r) => r.wasm),
        `${page}: .wasm outside WASM_ALLOWED`,
      )
      .toEqual([...runs, free].map(() => 0));
  // Criterion 4: bytes do not depend on the throttle. On a live page
  // `networkidle` may fire before the grammar is asked for, so the
  // throttled figure may be lower, never higher; a report shows when.
  const t = median(runs.map((r) => r.transfer));
  const message = `${page}: throttled ${t} kB, unthrottled ${free.transfer}`;
  if (LIVE.has(page)) {
    expect
      .soft(t, message)
      .toBeLessThanOrEqual(free.transfer + THROTTLE_TOLERANCE);
    if (t < free.transfer - THROTTLE_TOLERANCE)
      test.info().annotations.push({
        type: "throttled-lower",
        description: `${message}: the throttled loads stopped before tree-sitter (${runs.map((r) => r.wasm).join(", ")} .wasm); transfer gates on the unthrottled load`,
      });
  } else
    expect
      .soft(Math.abs(t - free.transfer), message)
      .toBeLessThanOrEqual(THROTTLE_TOLERANCE);
}

const SWEEP = !!process.env.PERF_SWEEP;

/**
 * Each page's unthrottled transfer, kept by the transfer tests so a paint
 * test need not load its probe again (the project runs in one worker, in
 * order). A paint test run alone, or after a worker restart, loads it.
 */
const unthrottled = new Map<string, Run>();
const SWEEP_FILE = path.resolve("test-results/perf-sweep.json");

test("024 decision 7: the server sends .wasm gzipped", async () => {
  const dir = path.join(BUILD, "_app/immutable/assets");
  const file = readdirSync(dir).find((f) => f.endsWith(".wasm"));
  expect(file, "a .wasm file in the build").toBeTruthy();
  const res = await fetch(`${origin}/_app/immutable/assets/${file}`);
  expect(res.headers.get("content-type")).toBe("application/wasm");
  expect(res.headers.get("content-encoding")).toBe("gzip");
});

if (!SWEEP) {
  test.describe("024: transfer, every page", () => {
    for (const id of TEMPLATE_IDS) {
      const pages = pagesOf(id);
      const b = budgetOf(TEMPLATES[id]);
      test(`024 transfer: ${id}`, async ({ browser }) => {
        test.setTimeout(30_000 + 5_000 * pages.length);
        const over: string[] = [];
        const wasm: string[] = [];
        const figures: Record<string, number> = {};
        for (const p of pages) {
          const r = await measure(browser, origin + p.path, {
            throttle: false,
          });
          figures[p.path] = r.transfer;
          unthrottled.set(p.path, r);
          console.log(`transfer ${p.path}: ${r.transfer} kB, ${r.wasm} .wasm`);
          if (r.transfer > b.transfer)
            over.push(
              `${p.path}: ${r.transfer} kB over ${b.transfer}; largest: ${largest(r)}`,
            );
          if (r.wasm > 0 && !WASM.has(p.path))
            wasm.push(`${p.path}: ${r.wasm} .wasm, not in WASM_ALLOWED`);
        }
        test.info().annotations.push({
          type: "transfer",
          description: JSON.stringify({
            template: id,
            budget: b.transfer,
            figures,
          }),
        });
        expect.soft(over, `pages over ${id}'s ${b.transfer} kB`).toEqual([]);
        expect.soft(wasm, `pages that fetch .wasm`).toEqual([]);
      });
    }
  });

  test.describe("024: paint, the probes", () => {
    for (const id of TEMPLATE_IDS) {
      const lcp = lcpBudget(TEMPLATES[id], process.env);
      for (const probe of TEMPLATES[id].probes) {
        test(`024 paint: ${id}: ${probe}`, async ({ browser }) => {
          test.setTimeout(180_000);
          const runs: Run[] = [];
          for (let i = 0; i < 3; i++)
            runs.push(await measure(browser, origin + probe));
          const free =
            unthrottled.get(probe) ??
            (await measure(browser, origin + probe, { throttle: false }));
          console.log(
            `perf ${probe}: ${JSON.stringify(brief(runs))}; unthrottled ${free.transfer} kB`,
          );
          annotateLcp(id, probe, runs, lcp);
          expectWithin(id, probe, runs, free);
        });
      }
    }
  });
} else {
  test.describe("024: the sweep", () => {
    for (const page of SITEMAP) {
      const id = templateOf(page);
      test(`024 sweep: ${id}: ${page.path}`, async ({ browser }) => {
        test.setTimeout(180_000);
        const runs: Run[] = [];
        for (let i = 0; i < 3; i++)
          runs.push(await measure(browser, origin + page.path));
        const free = await measure(browser, origin + page.path, {
          throttle: false,
        });
        console.log(
          `perf ${page.path}: ${JSON.stringify(brief(runs))}; unthrottled ${free.transfer} kB`,
        );
        // Each test adds its page, so a failure keeps the record of the rest.
        mkdirSync(path.dirname(SWEEP_FILE), { recursive: true });
        const all = existsSync(SWEEP_FILE)
          ? JSON.parse(readFileSync(SWEEP_FILE, "utf8"))
          : {};
        all[page.path] = {
          template: id,
          runs: brief(runs),
          median: {
            transfer: median(runs.map((r) => r.transfer)),
            lcp: median(runs.map((r) => r.lcp)),
            cls: median(runs.map((r) => r.cls)),
          },
          unthrottled: { transfer: free.transfer, wasm: free.wasm },
          largest: runs[0].responses.slice(0, 10),
        };
        writeFileSync(SWEEP_FILE, JSON.stringify(all, null, 2));
        annotateLcp(id, page.path, runs, lcpBudget(TEMPLATES[id], process.env));
        expectWithin(id, page.path, runs, free);
      });
    }
  });
}
