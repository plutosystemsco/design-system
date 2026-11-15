/**
 * 015 decision 23, criterion 25: the budgets, measured. Chromium at
 * 1280 × 900, a cold cache, the files served gzipped, the network at
 * 1.6 Mbps down, 750 kbps up and 150 ms round trip, the CPU slowed 4×.
 * Light project only (playwright.config.ts), one worker, 3 runs each; the
 * median is checked and every run recorded. Transfer excludes iframes and
 * the search index.
 */
import { expect, test, type Browser } from "@playwright/test";
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

test.describe.configure({ mode: "serial" });

/** Each budget: transfer in kB (1,024 bytes), LCP in ms, CLS. Tightened after 015's step 2. */
export const BUDGETS: Record<
  string,
  { transfer: number; lcp: number; cls: number }
> = {
  "/": { transfer: 355, lcp: 1027, cls: 0.02 },
  "/components/": { transfer: 320, lcp: 1138, cls: 0.02 },
  // Ruled 365 kB after 015 step 3, then 370 kB after its change review, when
  // each example view came to load only its own example (decisions.md, "The
  // Button page's transfer budget is 365 kB", "Raised again to 370 kB").
  "/components/button/": { transfer: 370, lcp: 1157, cls: 0.02 },
  "/components/code-block/": { transfer: 360, lcp: 1186, cls: 0.02 },
};

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
      if (/text|javascript|json|svg/.test(type)) {
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

/** One cold load under the profile. */
export async function measure(browser: Browser, url: string) {
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 900 },
  });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
  await cdp.send("Network.emulateNetworkConditions", {
    offline: false,
    latency: 150,
    downloadThroughput: (1.6 * 1024 * 1024) / 8,
    uploadThroughput: (750 * 1024) / 8,
  });
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  const urls = new Map<string, string>();
  const frames = new Map<string, string>();
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
      if (u.endsWith(".wasm")) wasm++;
      if (u.includes("/search.json") || frames.get(e.requestId) !== main)
        return;
      transfer += e.encodedDataLength;
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
    transfer: Math.round(transfer / 1024),
    lcp: Math.round(lcp),
    cls: Number(cls.toFixed(3)),
    wasm,
  };
}

const median = (xs: number[]) =>
  [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];

test.describe("015: the budgets", () => {
  for (const [page, budget] of Object.entries(BUDGETS)) {
    test(`${page}: transfer ≤ ${budget.transfer} kB, LCP ≤ ${budget.lcp} ms, CLS ≤ ${budget.cls}, 0 .wasm`, async ({
      browser,
    }) => {
      test.setTimeout(180_000);
      const runs = [];
      for (let i = 0; i < 3; i++)
        runs.push(await measure(browser, origin + page));
      console.log(`perf ${page}: ${JSON.stringify(runs)}`);
      expect(median(runs.map((r) => r.transfer))).toBeLessThanOrEqual(
        budget.transfer,
      );
      expect(median(runs.map((r) => r.lcp))).toBeLessThanOrEqual(budget.lcp);
      expect(median(runs.map((r) => r.cls))).toBeLessThanOrEqual(budget.cls);
      for (const r of runs) expect(r.wasm).toBe(0);
    });
  }
});

// 017 decision 11: the heaviest Brand page. Its budget started as the home
// page's, borrowed and INFERRED; measured at 017's checkpoint (3 runs,
// medians 289 kB, LCP 820 ms, CLS 0.002), it is the median plus 20%, within
// the home page's. CLS is max(median × 1.2, 0.02), checkpoint 1's rule.
const COLOUR_BUDGET = { transfer: 347, lcp: 984, cls: 0.02 };

test.describe("017: the Colour page's budget", () => {
  test(`/brand/colour/: transfer ≤ ${COLOUR_BUDGET.transfer} kB, LCP ≤ ${COLOUR_BUDGET.lcp} ms, CLS ≤ ${COLOUR_BUDGET.cls}, 0 .wasm`, async ({
    browser,
  }) => {
    test.setTimeout(180_000);
    const runs = [];
    for (let i = 0; i < 3; i++)
      runs.push(await measure(browser, origin + "/brand/colour/"));
    console.log(`perf /brand/colour/: ${JSON.stringify(runs)}`);
    expect(median(runs.map((r) => r.transfer))).toBeLessThanOrEqual(
      COLOUR_BUDGET.transfer,
    );
    expect(median(runs.map((r) => r.lcp))).toBeLessThanOrEqual(
      COLOUR_BUDGET.lcp,
    );
    expect(median(runs.map((r) => r.cls))).toBeLessThanOrEqual(
      COLOUR_BUDGET.cls,
    );
    for (const r of runs) expect(r.wasm).toBe(0);
  });
});
