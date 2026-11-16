/**
 * Benchmark, site measurements: each system's Button page, cold, measured
 * the same way. Feeds the scorecard's rows "first example", "page weight"
 * and "navigation" (context/research/benchmark-scorecard.md).
 *
 *   bun scripts/bench/site.ts [--runs 3] [--only kuiper,carbon] [--build build]
 *                             [--layout-only] [--shots <dir>] [--json <file>]
 *
 * Desktop: 1440 × 900, a cold cache, the perf suite's profile (1.6 Mbps
 * down, 750 kbps up, 150 ms round trip, CPU slowed 4×; 015 decision 23).
 * Phone: 390 × 844, touch, unthrottled, position only.
 *
 * Measured per run:
 * - transfer: encoded bytes of every response until the network is quiet
 *   for 1.5 s (cap 60 s), all frames; and main frame only;
 * - requests; LCP and CLS (PerformanceObserver, buffered);
 * - h1 top and first example top, in page coordinates (px from the
 *   document's top), at 1440 and at 390, read on a second, unthrottled load;
 * - left navigation: links in the largest nav/aside docked at the left;
 * - whether a search control and a theme control are on the page.
 *
 * Live sites sit behind a real network as well as the throttle, and change
 * without notice. Treat LCP as ± 20%; transfer and positions are stable.
 * Not part of `bun run test`.
 */
import { chromium, type Browser } from "@playwright/test";
import { writeFileSync } from "node:fs";
import path from "node:path";
import { args, median, serveBuild } from "./serve.ts";
import { TARGETS, type Target } from "./targets.ts";

const opt = args();
const runs = Number(opt.runs ?? 1);
const only = typeof opt.only === "string" ? opt.only.split(",") : null;
const shots = typeof opt.shots === "string" ? opt.shots : null;
/** Skip the throttled loads; read positions and chrome only. */
const layoutOnly = opt["layout-only"] === true;

async function quiet(page: import("@playwright/test").Page, cap = 60_000) {
  let inflight = 0;
  let last = Date.now();
  const on = () => ((inflight += 1), (last = Date.now()));
  const off = () => (
    (inflight = Math.max(0, inflight - 1)),
    (last = Date.now())
  );
  page.on("request", on);
  page.on("requestfinished", off);
  page.on("requestfailed", off);
  const start = Date.now();
  while (Date.now() - start < cap) {
    if (inflight === 0 && Date.now() - last > 1500) break;
    await page.waitForTimeout(250);
  }
  page.off("request", on);
  page.off("requestfinished", off);
  page.off("requestfailed", off);
}

/** Hide cookie and consent banners (never accept them), as the 2026-11-15 teardowns did. */
async function hideConsent(page: import("@playwright/test").Page) {
  await page.evaluate(() => {
    for (const el of Array.from(document.querySelectorAll("body *"))) {
      const s = `${el.id} ${el.getAttribute("class") ?? ""} ${el.getAttribute("aria-label") ?? ""}`;
      if (/cookie|consent|onetrust|truste|gdpr/i.test(s) && !el.closest("main"))
        (el as HTMLElement).style.setProperty("display", "none", "important");
    }
  });
}

async function positions(page: import("@playwright/test").Page, t: Target) {
  await hideConsent(page);
  await page.evaluate(() => window.scrollTo(0, 0));
  const h1 = await page.evaluate(() => {
    const h = document.querySelector("h1");
    return h ? Math.round(h.getBoundingClientRect().top + scrollY) : null;
  });
  let example: number | null = null;
  if (t.example) {
    const loc = page.locator(t.example).first();
    if (await loc.count()) {
      example = await loc.evaluate((el) =>
        Math.round(el.getBoundingClientRect().top + scrollY),
      );
    }
  }
  return { h1, example };
}

async function chrome(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    // The left column's link list: the container left of 42% of the width,
    // at least 40 px wide and 300 px tall, that holds the most links. Not
    // every site wraps it in <nav>.
    let leftNav = 0;
    for (const el of Array.from(
      document.querySelectorAll("nav, aside, div, ul, [role=navigation]"),
    )) {
      const r = el.getBoundingClientRect();
      if (r.right > 0.42 * innerWidth || r.width < 40 || r.height < 300)
        continue;
      leftNav = Math.max(
        leftNav,
        el.querySelectorAll("a[href], [role=treeitem]").length,
      );
    }
    const named = (re: RegExp) =>
      Array.from(
        document.querySelectorAll("button, a, input, [role=button]"),
      ).some((el) => {
        const s = [
          el.getAttribute("aria-label"),
          el.getAttribute("title"),
          el.getAttribute("placeholder"),
          el.getAttribute("type"),
          (el.textContent || "").slice(0, 40),
        ].join(" ");
        return re.test(s);
      });
    return {
      leftNav,
      search:
        named(/search|find/i) || !!document.querySelector("[role=search]"),
      theme: named(/theme|dark|light|colou?r scheme|appearance/i),
    };
  });
}

/** One cold, throttled load at 1440: weight and paint only. */
async function weight(browser: Browser, url: string) {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
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
  const frameOf = new Map<string, string>();
  let all = 0;
  let mainOnly = 0;
  let requests = 0;
  const tree = (await cdp.send("Page.getFrameTree")) as {
    frameTree: { frame: { id: string } };
  };
  const main = tree.frameTree.frame.id;
  cdp.on(
    "Network.requestWillBeSent",
    (e: { requestId: string; frameId?: string }) => {
      frameOf.set(e.requestId, e.frameId ?? "");
      requests++;
    },
  );
  cdp.on(
    "Network.loadingFinished",
    (e: { requestId: string; encodedDataLength: number }) => {
      all += e.encodedDataLength;
      if (frameOf.get(e.requestId) === main) mainOnly += e.encodedDataLength;
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
  const res = await page.goto(url, { waitUntil: "load", timeout: 120_000 });
  await quiet(page);
  const [lcp, cls] = (await page.evaluate(() => {
    const w = window as unknown as { lcp: number; cls: number };
    return [w.lcp, w.cls];
  })) as [number, number];
  const out = {
    status: res?.status() ?? 0,
    finalUrl: page.url(),
    transferKB: Math.round(all / 1024),
    mainFrameKB: Math.round(mainOnly / 1024),
    requests,
    lcp: Math.round(lcp),
    cls: Number(cls.toFixed(3)),
  };
  await ctx.close();
  return out;
}

/**
 * Layout, unthrottled, so slow script cannot hide or shift a part: the h1 and
 * the first example at this width, and at 1440 the page's chrome.
 */
async function layout(
  browser: Browser,
  url: string,
  t: Target,
  width: 1440 | 390,
  shot?: string,
) {
  const ctx = await browser.newContext(
    width === 390
      ? {
          viewport: { width: 390, height: 844 },
          isMobile: true,
          hasTouch: true,
          deviceScaleFactor: 2,
        }
      : { viewport: { width: 1440, height: 900 } },
  );
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "load", timeout: 120_000 });
  await quiet(page, 20_000);
  await page.waitForTimeout(1000);
  const pos = await positions(page, t);
  const c = width === 1440 ? await chrome(page) : null;
  if (shot) await page.screenshot({ path: shot });
  await ctx.close();
  return { ...pos, chrome: c };
}

const server = serveBuild(typeof opt.build === "string" ? opt.build : "build");
const browser = await chromium.launch();
const rows: Record<string, unknown>[] = [];
for (const t of TARGETS) {
  if (only && !only.includes(t.id)) continue;
  const url = server.resolve(t.button);
  const ds = [];
  for (let i = 0; i < (layoutOnly ? 0 : runs); i++) {
    try {
      ds.push(await weight(browser, url));
    } catch (e) {
      console.error(t.id, "weight run failed:", String(e).slice(0, 160));
    }
  }
  const at = async (w: 1440 | 390) => {
    try {
      return await layout(
        browser,
        url,
        t,
        w,
        shots ? path.join(shots, `${t.id}-${w}.png`) : undefined,
      );
    } catch (e) {
      console.error(t.id, w, "layout run failed:", String(e).slice(0, 160));
      return { h1: null, example: null, chrome: null };
    }
  };
  const wide = await at(1440);
  const narrow = await at(390);
  const d = ds[0];
  const row = {
    id: t.id,
    url: d?.finalUrl ?? url,
    status: d?.status,
    transferKB: median(ds.map((r) => r.transferKB)),
    mainFrameKB: median(ds.map((r) => r.mainFrameKB)),
    requests: median(ds.map((r) => r.requests)),
    lcp: median(ds.map((r) => r.lcp)),
    cls: median(ds.map((r) => r.cls)),
    h1At1440: wide.h1,
    exampleAt1440: wide.example,
    h1At390: narrow.h1,
    exampleAt390: narrow.example,
    leftNavLinks: wide.chrome?.leftNav ?? null,
    search: wide.chrome?.search ?? null,
    themeControl: wide.chrome?.theme ?? null,
    runs: ds.map((r) => ({ transferKB: r.transferKB, lcp: r.lcp })),
  };
  rows.push(row);
  console.error(JSON.stringify(row));
}
await browser.close();
server.stop();

const report = {
  script: "scripts/bench/site.ts",
  at: new Date().toISOString(),
  kuiperBuild: server.built,
  runs,
  rows,
};
if (typeof opt.json === "string")
  writeFileSync(opt.json, JSON.stringify(report, null, 2));
console.table(
  rows.map((r) => ({
    id: r.id,
    KB: r.transferKB,
    "KB main": r.mainFrameKB,
    req: r.requests,
    "LCP ms": r.lcp,
    "ex@1440": r.exampleAt1440,
    "ex@390": r.exampleAt390,
    "nav links": r.leftNavLinks,
    search: r.search,
    theme: r.themeControl,
  })),
);
