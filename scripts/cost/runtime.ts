/**
 * 025 decisions 5, 6, 11 and 12: the runtime phase. Each launch is one
 * Chromium process; each item gets one block per launch (floor, item, floor,
 * item, floor, item, floor) in a seeded order. Each trial is a new browser
 * context under a 4× CPU slowdown: the hydration mark minus the HTML's
 * arrival, then, after a pause, the main interaction from its trusted start
 * event to two frames after its state is seen.
 */
import { chromium, type Browser } from "@playwright/test";
import { existsSync, statSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { serveOnFreePort, within } from "./build.ts";
import type { Interaction } from "./interactions.ts";
import { SETTINGS, viewportOf } from "./settings.ts";
import {
  launchDifference,
  launchFigure,
  median,
  seeded,
  shuffled,
  tenth,
} from "./stats.ts";

/** Serves one built app at a time, from a root that can be switched between trials. */
export function serveBuild(root: string) {
  let current = root;
  const server = serveOnFreePort(async (req) => {
    let p = new URL(req.url).pathname;
    if (p.endsWith("/")) p += "index.html";
    const candidates = path.extname(p) ? [p] : [`${p}.html`, `${p}/index.html`];
    for (const c of candidates) {
      const file = within(current, c);
      if (file && existsSync(file) && statSync(file).isFile())
        return new Response(Bun.file(file));
    }
    return new Response("Not found", { status: 404 });
  });
  return {
    url: `http://127.0.0.1:${server.port}`,
    setRoot: (dir: string) => (current = dir),
    stop: () => server.stop(true),
  };
}

/**
 * Installed before any page script. It records the trusted timestamp of the
 * entry's start event once armed, the press gap, and Event Timing's entries
 * from an observer at its lowest threshold; `__cost.inside(selector)` is
 * true when an element matching the selector holds the focus.
 */
const INIT = `(() => {
  const c = (window.__cost = { armed: false, start: 0, startEvent: "click", down: 0, up: 0, events: [] });
  c.inside = (selector) => [...document.querySelectorAll(selector)].some((el) => el.contains(document.activeElement));
  for (const type of ["pointerdown", "pointerup", "click", "keydown", "pointerover"])
    addEventListener(type, (e) => {
      if (!e.isTrusted) return;
      if (type === "pointerdown" && !c.down && (c.armed || c.start)) c.down = e.timeStamp;
      if (type === "pointerup" && c.down && !c.up) c.up = e.timeStamp;
      if (c.armed && type === c.startEvent) { c.start = e.timeStamp; c.armed = false; }
    }, { capture: true });
  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) c.events.push({ name: e.name, start: e.startTime, duration: e.duration, id: e.interactionId || 0 });
  }).observe({ type: "event", durationThreshold: 16, buffered: true });
})();`;

/** Arms the measure. It ends in a plain value, never a promise (*cost* §5's fault). */
function arm(start: string, state: string): string {
  return `(() => {
  const c = window.__cost;
  c.startEvent = ${JSON.stringify(start)}; c.start = 0; c.down = 0; c.up = 0; c.armed = true;
  const done = () => { try { return !!(${state}); } catch { return false; } };
  window.__costDone = new Promise((resolve) => {
    const check = () => {
      if (c.start > 0 && done())
        requestAnimationFrame(() => requestAnimationFrame(() => resolve(performance.now() - c.start)));
      else requestAnimationFrame(check);
    };
    requestAnimationFrame(check);
  });
  return 0;
})()`;
}

/** The no-op click: on the floor's heading, done once the click is seen. */
const NOOP: Interaction = {
  kind: "click",
  start: "click",
  target: "h1",
  state: "true",
  says: "updates",
  viewport: SETTINGS.viewport,
};

/** `_calibrate.svelte`'s button, whose handler blocks for 50 ms. */
const CALIBRATE: Interaction = {
  kind: "click",
  start: "click",
  target: "button",
  state: `document.querySelector("output")?.textContent?.trim() === "1"`,
  says: "updates",
  viewport: SETTINGS.viewport,
};

type App = { dir: string; route: string };

export type Subject = {
  key: string;
  app: App;
  /** The app its floor trials load: the floor, or for `utils` the theme floor. */
  base: App;
  entry: Interaction | null;
  /** Its fixture sets `cost:settled`. */
  settled: boolean;
  /** `_calibrate.svelte`: its response time is the run's `calibrateMs`. */
  calibrate?: boolean;
};

type Trial = {
  hydrate: number;
  settled: number | null;
  ms: number | null;
  gap: number | null;
  eventTiming: number | null;
};

async function trial(
  browser: Browser,
  server: ReturnType<typeof serveBuild>,
  key: string,
  app: App,
  entry: Interaction | null,
  viewport: string,
  settled: boolean,
): Promise<Trial> {
  server.setRoot(path.join(app.dir, "build"));
  const context = await browser.newContext({
    viewport: viewportOf(viewport),
    permissions: ["clipboard-read", "clipboard-write"],
  });
  try {
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: SETTINGS.cpu });
    await page.addInitScript(INIT);
    const { loadMs, settledMs, pauseMs, measureMs } = SETTINGS.timeouts;
    await page.goto(`${server.url}${app.route}`, {
      waitUntil: "load",
      timeout: loadMs,
    });
    await page.waitForFunction(
      () => performance.getEntriesByName("cost:hydrated").length > 0,
      null,
      { timeout: loadMs },
    );
    const since = (mark: string) =>
      page.evaluate((name) => {
        const m = performance.getEntriesByName(name)[0]!.startTime;
        const nav = performance.getEntriesByType(
          "navigation",
        )[0] as PerformanceNavigationTiming;
        return m - nav.responseEnd;
      }, mark);
    const out: Trial = {
      hydrate: await since("cost:hydrated"),
      settled: null,
      ms: null,
      gap: null,
      eventTiming: null,
    };
    if (settled) {
      await page.waitForFunction(
        () => performance.getEntriesByName("cost:settled").length > 0,
        null,
        { timeout: settledMs },
      );
      out.settled = await since("cost:settled");
    }
    if (!entry) return out;
    await page.waitForTimeout(pauseMs);
    if (entry.prepare) await page.evaluate(entry.prepare);
    const target = page.locator(entry.target);
    if (entry.kind === "key") await target.focus();
    await page.evaluate(arm(entry.start, entry.state));
    if (entry.kind === "click") await target.click();
    else if (entry.kind === "key") await page.keyboard.press(entry.key!);
    else await target.hover();
    const ms = (await page.evaluate(
      `Promise.race([window.__costDone, new Promise((r) => setTimeout(() => r(-1), ${measureMs}))])`,
    )) as number;
    if (ms < 0) {
      const state = await page.evaluate(() => ({
        active: document.activeElement?.outerHTML.slice(0, 200),
        body: document.body.innerHTML.slice(0, 800),
      }));
      throw new Error(
        `${key}: the ${entry.kind} on ${entry.target} did not reach its state within ${measureMs} ms\nfocus: ${state.active}\nbody: ${state.body}`,
      );
    }
    out.ms = ms;
    await page.waitForTimeout(100);
    const after = await page.evaluate(() => {
      const c = (window as unknown as { __cost: Record<string, any> }).__cost;
      const events = (
        c.events as { start: number; duration: number; id: number }[]
      )
        .filter((e) => e.id > 0 && e.start >= c.start - 1)
        .map((e) => e.duration);
      return {
        gap: c.down && c.up ? c.up - c.down : null,
        eventTiming: events.length ? Math.max(...events) : null,
      };
    });
    out.gap = entry.kind === "click" ? after.gap : null;
    out.eventTiming = entry.kind === "hover" ? null : after.eventTiming;
    return out;
  } finally {
    await context.close();
  }
}

export type SubjectFigures = {
  hydrate: {
    ms: number;
    spread: [number, number];
    launches: number[];
    settledMs: number | null;
  };
  interaction: {
    ms: number;
    spread: [number, number];
    launches: number[];
    pressGapMs: number | null;
    eventTimingMs: number | null;
  } | null;
};

export type RuntimeResult = {
  subjects: Record<string, SubjectFigures>;
  /** Subjects whose trials failed, with the reason; they have no figures. */
  failed: Record<string, string>;
  floorHydrateMs: number;
  noopMs: number;
  calibrateMs: number;
  load: { median: number; max: number };
  chromium: string;
  seconds: number;
};

const medianOrNull = (xs: (number | null)[]) => {
  const v = xs.filter((x): x is number => typeof x === "number");
  return v.length ? tenth(median(v)) : null;
};

/**
 * Decision 11: `launches` launches; in each, one discarded warm-up load of
 * the floor, then one block per subject, in a seeded order.
 */
export async function runBlocks(
  subjects: Subject[],
  options: {
    launches?: number;
    floor?: App;
    log?: (line: string) => void;
    measure?: boolean;
  } = {},
): Promise<RuntimeResult> {
  const launches = options.launches ?? SETTINGS.launches;
  const floor = options.floor ?? subjects[0]!.base;
  const log = options.log ?? (() => {});
  const server = serveBuild(path.join(floor.dir, "build"));
  const started = performance.now();
  type Block = { floor: Trial[]; item: Trial[]; base: App };
  const blocks = new Map<string, Block[]>(subjects.map((s) => [s.key, []]));
  const failed: Record<string, string> = {};
  const loads: number[] = [];
  let version = "";
  try {
    for (let launch = 0; launch < launches; launch++) {
      loads.push(os.loadavg()[0]!);
      const browser = await chromium.launch();
      version = browser.version();
      try {
        for (let w = 0; w < SETTINGS.warmups; w++)
          await trial(
            browser,
            server,
            "warm-up",
            floor,
            null,
            SETTINGS.viewport,
            false,
          );
        const order = shuffled(subjects, seeded(SETTINGS.seed + launch));
        let n = 0;
        for (const s of order) {
          n++;
          if (failed[s.key]) continue;
          const entry = s.calibrate ? CALIBRATE : s.entry;
          const viewport = entry?.viewport ?? SETTINGS.viewport;
          const block: Block = { floor: [], item: [], base: s.base };
          try {
            for (const slot of SETTINGS.block) {
              if (slot === "F")
                block.floor.push(
                  await trial(
                    browser,
                    server,
                    s.key,
                    s.base,
                    NOOP,
                    viewport,
                    false,
                  ),
                );
              else
                block.item.push(
                  await trial(
                    browser,
                    server,
                    s.key,
                    s.app,
                    entry,
                    viewport,
                    s.settled,
                  ),
                );
            }
            blocks.get(s.key)!.push(block);
          } catch (error) {
            failed[s.key] =
              error instanceof Error ? error.message : String(error);
            log(`cost: ${s.key} failed: ${failed[s.key]!.split("\n")[0]}`);
          }
          if (n % 10 === 0 || n === order.length)
            log(
              `cost: launch ${launch + 1} of ${launches}, ${n} of ${order.length} blocks, ${Math.round((performance.now() - started) / 1000)} s`,
            );
        }
      } finally {
        await browser.close();
      }
    }
  } finally {
    server.stop();
  }

  const figures: Record<string, SubjectFigures> = {};
  for (const s of subjects) {
    if (failed[s.key]) continue;
    const bs = blocks.get(s.key)!;
    const diffs = bs.map((b) =>
      launchDifference({
        floor: b.floor.map((t) => t.hydrate),
        item: b.item.map((t) => t.hydrate),
      }),
    );
    const h = launchFigure(diffs);
    const entry = s.calibrate ? CALIBRATE : s.entry;
    let interaction: SubjectFigures["interaction"] = null;
    if (entry) {
      const perLaunch = bs.map((b) => median(b.item.map((t) => t.ms!)));
      const f = launchFigure(perLaunch);
      const trials = bs.flatMap((b) => b.item);
      interaction = {
        ms: tenth(f.ms),
        spread: [tenth(f.spread[0]), tenth(f.spread[1])],
        launches: perLaunch.map(tenth),
        pressGapMs: medianOrNull(trials.map((t) => t.gap)),
        eventTimingMs: medianOrNull(trials.map((t) => t.eventTiming)),
      };
    }
    figures[s.key] = {
      hydrate: {
        ms: tenth(h.ms),
        spread: [tenth(h.spread[0]), tenth(h.spread[1])],
        launches: diffs.map(tenth),
        settledMs: s.settled
          ? medianOrNull(bs.flatMap((b) => b.item.map((t) => t.settled)))
          : null,
      },
      interaction,
    };
  }

  // The instrument: the floor's own hydration and the no-op click, from
  // every floor trial on the floor, a launch median each, then their median.
  const onFloor = (launch: number) =>
    subjects.flatMap((s) => {
      const b = blocks.get(s.key)![launch];
      return b && b.base.dir === floor.dir ? b.floor : [];
    });
  const perLaunch = (pick: (t: Trial) => number) =>
    Array.from({ length: launches }, (_, l) => onFloor(l))
      .filter((ts) => ts.length > 0)
      .map((ts) => median(ts.map(pick)));
  const hydrations = perLaunch((t) => t.hydrate);
  const noops = perLaunch((t) => t.ms!);
  const calibrate = subjects.find((s) => s.calibrate);
  return {
    subjects: figures,
    failed,
    floorHydrateMs: hydrations.length ? tenth(median(hydrations)) : 0,
    noopMs: noops.length ? tenth(median(noops)) : 0,
    calibrateMs:
      calibrate && figures[calibrate.key]?.interaction
        ? figures[calibrate.key]!.interaction!.ms
        : 0,
    load: {
      median: tenth(median(loads)),
      max: tenth(Math.max(...loads)),
    },
    chromium: version,
    seconds: Math.round((performance.now() - started) / 1000),
  };
}
