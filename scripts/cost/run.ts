/**
 * `bun run cost`: 025's harness. It measures every item whose hashes differ
 * from the report's, writes `scripts/cost/report.json`, and exits 1 if any
 * figure is over budget. It writes nothing else in the repository, except
 * `budgets.json` when `--budget` or `--tighten` asks.
 *
 *   --full              measure everything, ignoring the cache
 *   --only a,b          consider only these items
 *   --sizes-only        build and size; no runtime phase; print, write nothing
 *   --out <file>        with --sizes-only, also write the figures there
 *   --budget <names>    write first budgets for these items (or `new`: every
 *                       measured item without one), or `instrument`
 *   --tighten           lower budgets with headroom over twice their margin
 *   --guard             run only the registry guard
 *   --registry <dir>    the built registry to guard and serve (static/r)
 *   --keep              keep the scratch folder
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import {
  breakdownOf,
  fontsByItem,
  Harness,
  pool,
  registryGuard,
  type Built,
} from "./build.ts";
import {
  BUDGETS_PATH,
  firstBudget,
  overBudget,
  readBudgets,
  SIZE_METRICS,
  type Budgets,
  type ItemBudget,
} from "./budgets.ts";
import { hashContext, runtimeHash, sizeHash } from "./hash.ts";
import { INTERACTIONS } from "./interactions.ts";
import {
  catalogueItems,
  classify,
  fixtureOf,
  REPO,
  STATIC_R,
  UTILS,
} from "./items.ts";
import {
  newestFullRun,
  readReport,
  REPORT_PATH,
  writeJson,
  writeReport,
  type CaseEntry,
  type Entry,
  type Report,
  type Run,
  type Size,
} from "./report.ts";
import { runBlocks, type RuntimeResult, type Subject } from "./runtime.ts";
import { SETTINGS } from "./settings.ts";
import { tenth } from "./stats.ts";

const args = process.argv.slice(2);
const flag = (name: string) => args.includes(name);
const value = (name: string) => {
  const at = args.indexOf(name);
  return at === -1 ? undefined : args[at + 1];
};
const log = (line: string) => console.log(line);

const staticR = path.resolve(value("--registry") ?? STATIC_R);

/** The machine's model string, as `budgets.json`'s `machine` names it. */
export function machineModel(): string {
  try {
    if (process.platform === "darwin") {
      const sys = (k: string) =>
        execFileSync("sysctl", ["-n", k], { encoding: "utf8" }).trim();
      return `${sys("hw.model")} (${sys("machdep.cpu.brand_string")})`;
    }
  } catch {
    // Fall through to the CPU's name.
  }
  return os.cpus()[0]?.model ?? "unknown";
}

function machine(): Run["machine"] {
  return {
    model: machineModel(),
    cores: os.cpus().length,
    os: `${process.platform} ${os.release()}`,
  };
}

function commit(): string {
  const git = (...a: string[]) =>
    execFileSync("git", a, { cwd: REPO, encoding: "utf8" }).trim();
  const head = git("rev-parse", "--short", "HEAD");
  return git("status", "--porcelain").length ? `${head}+dirty` : head;
}

const minus = (a: Built, b: Built): Size => ({
  js: a.sizes.js - b.sizes.js,
  css: a.sizes.css - b.sizes.css,
  lazy: a.sizes.lazy - b.sizes.lazy,
  assets: a.sizes.assets - b.sizes.assets,
  brotli: {
    js: a.sizes.brotli.js - b.sizes.brotli.js,
    css: a.sizes.brotli.css - b.sizes.brotli.css,
  },
});

async function guard(): Promise<void> {
  const differ = await registryGuard(staticR);
  if (differ.length) {
    console.error(
      `cost: ${path.relative(REPO, staticR) || staticR} differs from a fresh registry build in ${differ.length} file(s): ${differ.slice(0, 10).join(", ")}${differ.length > 10 ? ", …" : ""}. Run \`bun run build:registry\`.`,
    );
    process.exit(2);
  }
}

/** Decision 12: wait for the one-minute load average to fall below the core count. */
async function waitForQuiet(): Promise<void> {
  const cores = os.cpus().length;
  const until = Date.now() + SETTINGS.loadWait.maxMs;
  while (os.loadavg()[0]! >= cores && Date.now() < until) {
    log(
      `cost: load ${os.loadavg()[0]!.toFixed(1)} on ${cores} cores; waiting (at most ${Math.round((until - Date.now()) / 1000)} s more)`,
    );
    await sleep(SETTINGS.loadWait.sampleMs);
  }
}

/** Decision 12: the instrument check against the committed values. */
function noisyBecause(r: RuntimeResult, budgets: Budgets | null): string[] {
  const out: string[] = [];
  if (budgets?.instrument) {
    const band = SETTINGS.instrumentBand;
    for (const [name, now, then] of [
      ["floorHydrateMs", r.floorHydrateMs, budgets.instrument.floorHydrateMs],
      ["noopMs", r.noopMs, budgets.instrument.noopMs],
    ] as const)
      if (Math.abs(now - then) > band * then)
        out.push(`${name} ${now} is outside ±${band * 100}% of ${then}`);
  }
  const lo = SETTINGS.calibrateMs;
  const hi = SETTINGS.calibrateMs + r.noopMs + 16;
  if (r.calibrateMs < lo || r.calibrateMs > hi)
    out.push(`calibrateMs ${r.calibrateMs} is outside [${lo}, ${tenth(hi)}]`);
  return out;
}

/** `--budget` and `--tighten`: they act on the committed report. */
async function budgetCommand(): Promise<void> {
  const report = readReport();
  const budgets: Budgets = existsSync(BUDGETS_PATH)
    ? readBudgets()
    : { machine: "", instrument: { floorHydrateMs: 0, noopMs: 0 }, items: {} };
  const asked = value("--budget");
  if (asked === "instrument") {
    const ids = Object.keys(report.runs).sort();
    const run = report.runs[ids.at(-1)!]!;
    const problems: string[] = [];
    if (!run.full) problems.push("the newest run is not --full");
    if (budgets.machine && run.machine.model !== budgets.machine)
      problems.push(
        `the newest run is on ${run.machine.model}, not ${budgets.machine}`,
      );
    const hi = SETTINGS.calibrateMs + run.instrument.noopMs + 16;
    if (
      run.instrument.calibrateMs < SETTINGS.calibrateMs ||
      run.instrument.calibrateMs > hi
    )
      problems.push(
        `its calibrateMs ${run.instrument.calibrateMs} is outside its bound`,
      );
    if (problems.length) {
      console.error(
        `cost: --budget instrument refused: ${problems.join("; ")}`,
      );
      process.exit(1);
    }
    budgets.machine ||= run.machine.model;
    log(
      `cost: instrument ${JSON.stringify(budgets.instrument)} → floorHydrateMs ${run.instrument.floorHydrateMs}, noopMs ${run.instrument.noopMs}`,
    );
    budgets.instrument = {
      floorHydrateMs: run.instrument.floorHydrateMs,
      noopMs: run.instrument.noopMs,
    };
  } else if (asked) {
    const names =
      asked === "new"
        ? Object.keys(report.items).filter((n) => !budgets.items[n])
        : asked.split(",");
    for (const name of names) {
      const e = report.items[name];
      if (!e) throw new Error(`cost: ${name} is not in the report`);
      if (budgets.items[name]) {
        console.error(
          `cost: ${name} has a budget; a budget rises only by a ruling`,
        );
        process.exit(1);
      }
      const b: ItemBudget = {
        js: 0,
        css: 0,
        lazy: 0,
        assets: 0,
        hydrateMs: firstBudget("hydrateMs", e.hydrate.ms),
      };
      for (const m of SIZE_METRICS) b[m] = firstBudget(m, e.size[m]);
      if (e.interaction)
        b.interactionMs = Math.min(
          SETTINGS.ceilingMs,
          firstBudget("interactionMs", e.interaction.ms),
        );
      for (const [k, c] of Object.entries(e.cases)) {
        b.cases ??= {};
        b.cases[k] = { hydrateMs: firstBudget("hydrateMs", c.hydrate.ms) };
        if (c.interaction)
          b.cases[k]!.interactionMs = Math.min(
            SETTINGS.ceilingMs,
            firstBudget("interactionMs", c.interaction.ms),
          );
      }
      budgets.items[name] = b;
    }
    log(`cost: first budgets for ${names.length} item(s)`);
  }
  if (flag("--tighten")) {
    let lowered = 0;
    for (const [name, b] of Object.entries(budgets.items)) {
      const e = report.items[name];
      if (!e) continue;
      const run = report.runs[e.run];
      const quiet =
        run?.full && !run.noisy && run.machine.model === budgets.machine;
      for (const m of SIZE_METRICS) {
        const fresh = firstBudget(m, e.size[m]);
        const headroom = b[m] - e.size[m];
        const margin = fresh - Math.max(0, e.size[m]);
        if (headroom > 2 * margin && fresh < b[m]) {
          b[m] = fresh;
          lowered++;
        }
      }
      if (quiet) {
        const pairs: ["hydrateMs" | "interactionMs", number | undefined][] = [
          ["hydrateMs", e.hydrate.ms],
          ["interactionMs", e.interaction?.ms],
        ];
        for (const [m, measured] of pairs) {
          const budget = b[m];
          if (measured === undefined || budget === undefined) continue;
          const fresh = firstBudget(m, measured);
          if (
            budget - measured > 2 * (fresh - Math.max(0, measured)) &&
            fresh < budget
          ) {
            b[m] = fresh;
            lowered++;
          }
        }
      }
    }
    log(`cost: --tighten lowered ${lowered} budget(s)`);
  }
  await writeJson(BUDGETS_PATH, budgets);
}

async function measure(): Promise<number> {
  const t0 = performance.now();
  const runId = new Date().toISOString();
  const full = flag("--full");
  const sizesOnly = flag("--sizes-only");
  const old: Report | null = existsSync(REPORT_PATH) ? readReport() : null;
  const budgets = existsSync(BUDGETS_PATH) ? readBudgets() : null;
  const zlib = process.versions.zlib!;
  const lastFull = old ? newestFullRun(old) : undefined;
  if (!full && lastFull && lastFull.tools.zlib !== zlib) {
    console.error(
      `cost: this Bun's zlib is ${zlib}; the report's newest full run used ${lastFull.tools.zlib}. Use that run's Bun (${lastFull.tools.bun}), or run --full.`,
    );
    return 1;
  }
  const ctx = hashContext(
    full || !lastFull ? zlib : lastFull.tools.zlib,
    staticR,
  );
  const kinds = classify();
  const only = value("--only")?.split(",");
  const considered = kinds.measured.filter((n) => !only || only.includes(n));
  const cases = kinds.cases.filter((c) => considered.includes(c.item));

  type Key = { key: string; item: string; kase?: string };
  const keys: Key[] = [
    ...considered.map((n) => ({ key: n, item: n })),
    ...cases.map((c) => ({
      key: `${c.item}.${c.case}`,
      item: c.item,
      kase: c.case,
    })),
  ];
  const entryOf = (k: Key): CaseEntry | undefined =>
    k.kase ? old?.items[k.item]?.cases[k.kase] : old?.items[k.item];
  const sizeStale = new Set<string>();
  const runtimeStale = new Set<string>();
  for (const k of keys) {
    const e = entryOf(k);
    if (full || !e || e.hash !== sizeHash(k.key, ctx)) sizeStale.add(k.key);
    if (full || !e || e.runtimeHash !== runtimeHash(k.key, ctx))
      runtimeStale.add(k.key);
  }
  const toBuild = keys.filter(
    (k) => sizeStale.has(k.key) || runtimeStale.has(k.key),
  );
  log(
    `cost: ${keys.length} items and cases; ${sizeStale.size} size-stale, ${runtimeStale.size} runtime-stale${full ? " (--full)" : ""}`,
  );
  if (toBuild.length === 0 && old) {
    log("cost: every figure is fresh");
    return gate(old, budgets);
  }

  // The size phase.
  const work = mkdtempSync(path.join(os.tmpdir(), "kuiper-cost-"));
  log(`cost: building in ${work}`);
  const h = await Harness.prepare(work, staticR);
  let report: Report;
  try {
    const [empty, themeFloor, floor, calibrate] = await pool(
      [
        ["_empty", "empty"],
        ["_theme-floor", "themeFloor"],
        ["_floor", "floor"],
        ["_calibrate", "calibrate"],
      ] as const,
      SETTINGS.buildsAtOnce,
      ([key, kind]) => h.build(key, { kind }),
    );
    const catalogueStale =
      full || !old || [...sizeStale].some((k) => catalogueItems().includes(k));
    const buildFailures: string[] = [];
    const builds = await pool(
      [...toBuild.map((k) => k.key), ...(catalogueStale ? ["_catalogue"] : [])],
      SETTINGS.buildsAtOnce,
      async (key) => {
        try {
          const b =
            key === "_catalogue"
              ? await h.build(key, { kind: "catalogue" })
              : await h.build(key);
          log(
            `cost: built ${key}: add ${b.add ? Math.round(b.add.ms) : 0} ms, build ${Math.round(b.buildMs)} ms`,
          );
          return b;
        } catch (error) {
          // Every failure is reported, not only the first.
          const why = error instanceof Error ? error.message : String(error);
          buildFailures.push(why);
          log(`cost: ${key} failed to build: ${why.split("\n")[0]}`);
          return null;
        }
      },
    );
    if (buildFailures.length) {
      for (const why of buildFailures) console.error(why.slice(-3000));
      console.error(`cost: ${buildFailures.length} build(s) failed`);
      return 1;
    }
    const built = new Map(builds.map((b) => [b!.key, b!]));
    const baseOf = (item: string) => (item === UTILS ? themeFloor! : floor!);

    if (sizesOnly) {
      const rows = toBuild.map((k) => ({
        key: k.key,
        ...minus(built.get(k.key)!, baseOf(k.item)),
      }));
      const out = {
        empty: empty!.sizes,
        themeFloor: themeFloor!.sizes,
        floor: floor!.sizes,
        rows,
      };
      for (const r of rows)
        log(
          `${r.key.padEnd(24)} js ${String(r.js).padStart(7)} css ${String(r.css).padStart(6)} lazy ${String(r.lazy).padStart(8)} assets ${String(r.assets).padStart(9)}`,
        );
      const file = value("--out");
      if (file) await Bun.write(file, JSON.stringify(out, null, 2));
      return 0;
    }

    // The runtime phase.
    let runtime: RuntimeResult | null = null;
    const subjects: Subject[] = toBuild
      .filter((k) => runtimeStale.has(k.key))
      .map((k) => ({
        key: k.key,
        app: built.get(k.key)!,
        base: baseOf(k.item),
        entry: INTERACTIONS[k.key] ?? null,
        settled:
          fixtureOf(k.key) !== null &&
          readFileSync(fixtureOf(k.key)!, "utf8").includes("cost:settled"),
      }));
    if (subjects.length) {
      subjects.push({
        key: "_calibrate",
        app: calibrate!,
        base: floor!,
        entry: null,
        calibrate: true,
        settled: false,
      });
      await waitForQuiet();
      log(
        `cost: runtime phase: ${subjects.length} blocks a launch, ${SETTINGS.launches} launches`,
      );
      runtime = await runBlocks(subjects, { floor: floor!, log });
      const failed = Object.entries(runtime.failed);
      if (failed.length) {
        for (const [k, why] of failed)
          console.error(`cost: ${k} failed:\n${why}`);
        return 1;
      }
    }

    const noisy = runtime ? noisyBecause(runtime, budgets) : [];
    if (noisy.length) log(`cost: the run is noisy: ${noisy.join("; ")}`);
    const run: Run = {
      commit: commit(),
      full,
      machine: machine(),
      tools: {
        bun: Bun.version,
        chromium: runtime?.chromium ?? lastFull?.tools.chromium ?? "",
        playwright: ctx.playwright,
        cli: ctx.cli,
        zlib,
      },
      settings: {
        cpu: SETTINGS.cpu,
        launches: SETTINGS.launches,
        block: SETTINGS.block,
        warmups: SETTINGS.warmups,
        gzipLevel: SETTINGS.gzipLevel,
      },
      load: runtime?.load ?? { median: 0, max: 0 },
      instrument: {
        floorHydrateMs: runtime?.floorHydrateMs ?? 0,
        noopMs: runtime?.noopMs ?? 0,
        calibrateMs: runtime?.calibrateMs ?? 0,
      },
      noisy: noisy.length > 0,
      seconds: 0,
    };

    const figuresOf = (k: Key, previous: CaseEntry | undefined) => {
      const app = built.get(k.key)!;
      const fig = runtime?.subjects[k.key];
      const entry = INTERACTIONS[k.key];
      const out: CaseEntry = {
        hash: sizeHash(k.key, ctx),
        runtimeHash: runtimeHash(k.key, ctx),
        run: fig ? runId : previous!.run,
        size: minus(app, baseOf(k.item)),
        hydrate: fig
          ? {
              ms: fig.hydrate.ms,
              spread: fig.hydrate.spread,
              settledMs: fig.hydrate.settledMs,
            }
          : previous!.hydrate,
        interaction:
          fig && entry && fig.interaction
            ? {
                kind: entry.kind,
                start: entry.start,
                says: entry.says,
                ms: fig.interaction.ms,
                spread: fig.interaction.spread,
                ownMs: tenth(fig.interaction.ms - run.instrument.noopMs),
                pressGapMs:
                  entry.kind === "click" ? fig.interaction.pressGapMs : null,
                eventTimingMs:
                  entry.kind === "hover" ? null : fig.interaction.eventTimingMs,
              }
            : fig
              ? null
              : previous!.interaction,
      };
      return out;
    };

    report = old
      ? structuredClone(old)
      : ({
          schema: 1,
          runs: {},
          empty: { js: 0, css: 0 },
          themeFloor: { js: 0, css: 0, assets: 0, fonts: {} },
          floor: { js: 0, css: 0, run: runId, hydrateMs: 0, noopMs: 0 },
          catalogue: { js: 0, css: 0, sumOfAlone: { js: 0, css: 0 } },
          items: {},
        } as Report);
    report.runs[runId] = run;
    report.empty = { js: empty!.sizes.js, css: empty!.sizes.css };
    report.themeFloor = {
      js: themeFloor!.sizes.js,
      css: themeFloor!.sizes.css,
      assets: themeFloor!.sizes.assets,
      fonts: fontsByItem(themeFloor!.sizes),
    };
    report.floor = {
      js: floor!.sizes.js,
      css: floor!.sizes.css,
      run: runtime ? runId : report.floor.run,
      hydrateMs: runtime ? runtime.floorHydrateMs : report.floor.hydrateMs,
      noopMs: runtime ? runtime.noopMs : report.floor.noopMs,
    };
    for (const k of toBuild.filter((k) => !k.kase)) {
      const app = built.get(k.key)!;
      const base = baseOf(k.item);
      const fig = figuresOf(k, old?.items[k.item]);
      report.items[k.item] = {
        ...fig,
        route: app.route,
        breakdown: breakdownOf(k.item, app, base, fig.size.js),
        cases: old?.items[k.item]?.cases ?? {},
      } as Entry;
    }
    for (const k of toBuild.filter((k) => k.kase))
      report.items[k.item]!.cases[k.kase!] = figuresOf(k, entryOf(k));
    // Drop items and cases the registry no longer has.
    for (const name of Object.keys(report.items))
      if (!kinds.measured.includes(name)) delete report.items[name];
    for (const [name, e] of Object.entries(report.items))
      for (const k of Object.keys(e.cases))
        if (!kinds.cases.some((c) => c.item === name && c.case === k))
          delete e.cases[k];
    const catalogue = built.get("_catalogue");
    if (catalogue) {
      const names = catalogueItems();
      report.catalogue = {
        js: catalogue.sizes.js - floor!.sizes.js,
        css: catalogue.sizes.css - floor!.sizes.css,
        sumOfAlone: {
          js: names.reduce((a, n) => a + report.items[n]!.size.js, 0),
          css: names.reduce((a, n) => a + report.items[n]!.size.css, 0),
        },
      };
    }

    // Decision 11: a runtime figure over budget is re-measured at once.
    if (runtime && budgets) {
      const over = overBudget(report, budgets).filter((line) =>
        /(hydrateMs|interactionMs)/.test(line),
      );
      const keysOver = [...new Set(over.map((l) => l.split(" ")[0]!))];
      log(
        `cost: ${over.length} runtime figure(s) over budget before the re-measure${over.length ? `: ${over.join("; ")}` : ""}`,
      );
      if (keysOver.length) {
        const again = subjects.filter((s) => keysOver.includes(s.key));
        again.push(subjects.find((s) => s.calibrate)!);
        const second = await runBlocks(again, { floor: floor!, log });
        for (const k of keysOver) {
          const fig = second.subjects[k];
          if (!fig) continue;
          runtime.subjects[k] = fig;
          const key = keys.find((x) => x.key === k)!;
          if (key.kase)
            report.items[key.item]!.cases[key.kase] = figuresOf(
              key,
              entryOf(key),
            );
          else {
            const e = report.items[key.item]!;
            const f = figuresOf(key, e);
            e.hydrate = f.hydrate;
            e.interaction = f.interaction;
          }
        }
        const still = overBudget(report, budgets).filter((line) =>
          /(hydrateMs|interactionMs)/.test(line),
        );
        log(
          `cost: ${still.length} runtime figure(s) over budget after the re-measure${still.length ? `: ${still.join("; ")}` : ""}`,
        );
      }
    }
    run.seconds = Math.round((performance.now() - t0) / 1000);
    await writeReport(report);
    log(
      `cost: wrote ${path.relative(REPO, REPORT_PATH)}: run ${runId}, ${run.seconds} s, load median ${run.load.median} max ${run.load.max}, floor ${run.instrument.floorHydrateMs} ms, no-op ${run.instrument.noopMs} ms, calibrate ${run.instrument.calibrateMs} ms${run.noisy ? ", noisy" : ""}`,
    );
  } finally {
    await h.close();
    if (!flag("--keep")) rmSync(work, { recursive: true, force: true });
  }
  return gate(report, budgets);
}

/** Decision 16: exit 1 if any figure is over budget, naming each. */
function gate(report: Report, budgets: Budgets | null): number {
  if (!budgets) {
    log("cost: no budgets.json yet; write first budgets with --budget new");
    return 0;
  }
  const over = overBudget(report, budgets);
  for (const line of over) console.error(`cost: over budget: ${line}`);
  return over.length ? 1 : 0;
}

if (import.meta.main) {
  await guard();
  if (flag("--guard")) {
    log("cost: the registry matches a fresh build");
    process.exit(0);
  }
  if (value("--budget") || flag("--tighten")) {
    await budgetCommand();
    process.exit(0);
  }
  process.exit(await measure());
}
