/**
 * `bun run cost`: 025's harness. It measures every item whose hashes differ
 * from the report's, writes `scripts/cost/report.json`, and exits 1 if any
 * figure is over budget. It writes nothing else in the repository, except
 * `budgets.json` when `--budget` or `--tighten` asks.
 *
 *   --full              measure everything, ignoring the cache (not with --only)
 *   --only a,b          consider only these items
 *   --sizes-only        rebuild size-stale items and write their sizes; keep
 *                       every runtime figure (the change review's finding 2(a))
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
  budgetWarnings,
  firstBudget,
  overBudget,
  readBudgets,
  SIZE_METRICS,
  type Budgets,
  type ItemBudget,
} from "./budgets.ts";
import { parseFlags } from "./flags.ts";
import { hashContext, runtimeHash, runtimeKeyOf, sizeHash } from "./hash.ts";
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

const log = (line: string) => console.log(line);
const opts = (() => {
  try {
    return parseFlags(process.argv.slice(2));
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
})();

const staticR = path.resolve(opts.registry ?? STATIC_R);

/** QB (the design lead, 2026-11-16): one Bun everywhere, the one `package.json` names. */
function pinnedBun(): string {
  const pkg = JSON.parse(readFileSync(path.join(REPO, "package.json"), "utf8"));
  return String(pkg.packageManager ?? "").replace(/^bun@/, "");
}

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

/**
 * Decision 12: the instrument check against the committed values. One-sided
 * (the change review's finding 6): contention only slows a run, so a run is
 * noisy when its floor or its no-op click is over the band, never under it.
 * The calibration bound is absolute, and two-sided.
 */
function noisyBecause(r: RuntimeResult, budgets: Budgets | null): string[] {
  const out: string[] = [];
  if (budgets?.instrument) {
    const band = SETTINGS.instrumentBand;
    for (const [name, now, then] of [
      ["floorHydrateMs", r.floorHydrateMs, budgets.instrument.floorHydrateMs],
      ["noopMs", r.noopMs, budgets.instrument.noopMs],
    ] as const)
      if (now - then > band * then)
        out.push(`${name} ${now} is over ${then} + ${band * 100}%`);
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
  const asked = opts.budget;
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
  if (opts.tighten) {
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
  const { full, sizesOnly, only } = opts;
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
  const sizeStale = new Set(
    keys
      .filter(
        (k) => full || !entryOf(k) || entryOf(k)!.hash !== sizeHash(k.key, ctx),
      )
      .map((k) => k.key),
  );
  if (sizesOnly) {
    const unmeasured = keys.filter((k) => !entryOf(k)).map((k) => k.key);
    if (unmeasured.length) {
      console.error(
        `cost: --sizes-only keeps each item's runtime figures, and ${unmeasured.join(", ")} has none yet. Run \`bun run cost\`.`,
      );
      return 1;
    }
  }
  // A size-fresh item's output is the report's; its runtime key reads it.
  const recordedKey = (k: Key) =>
    old &&
    entryOf(k)?.outputHash &&
    (k.item === UTILS ? old.themeFloor : old.floor).outputHash
      ? runtimeKeyOf(k.key, old, ctx)
      : null;
  if (
    !full &&
    old &&
    sizeStale.size === 0 &&
    keys.every((k) => sizesOnly || recordedKey(k) === entryOf(k)!.runtimeHash)
  ) {
    log("cost: every figure is fresh");
    return gate(old, budgets);
  }

  // The size phase: the floors, then every size-stale item.
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
    const baseOf = (item: string) => (item === UTILS ? themeFloor! : floor!);
    const built = new Map<string, Built>();
    const failures: string[] = [];
    const buildAll = async (list: string[]) => {
      const done = await pool(list, SETTINGS.buildsAtOnce, async (key) => {
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
          failures.push(why);
          log(`cost: ${key} failed to build: ${why.split("\n")[0]}`);
          return null;
        }
      });
      for (const b of done) if (b) built.set(b.key, b);
    };
    const catalogueStale =
      full || !old || [...sizeStale].some((k) => catalogueItems().includes(k));
    await buildAll([...sizeStale, ...(catalogueStale ? ["_catalogue"] : [])]);

    // Runtime staleness, keyed on output (the change review's finding 2(c)).
    const keyOf = (k: Key) =>
      runtimeHash(k.key, ctx, {
        item: built.get(k.key)?.outputHash ?? entryOf(k)!.outputHash,
        base: baseOf(k.item).outputHash,
      });
    const runtimeStale = new Set(
      keys
        .filter(
          (k) => full || !entryOf(k) || entryOf(k)!.runtimeHash !== keyOf(k),
        )
        .map((k) => k.key),
    );
    log(
      `cost: ${keys.length} items and cases; ${sizeStale.size} size-stale, ${runtimeStale.size} runtime-stale${full ? " (--full)" : ""}${sizesOnly ? " (--sizes-only: runtime figures kept)" : ""}`,
    );
    if (!sizesOnly)
      await buildAll([...runtimeStale].filter((k) => !built.has(k)));
    if (failures.length) {
      for (const why of failures) console.error(why.slice(-3000));
      console.error(`cost: ${failures.length} build(s) failed`);
      return 1;
    }

    // The runtime phase.
    let runtime: RuntimeResult | null = null;
    const subjects: Subject[] = sizesOnly
      ? []
      : keys
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

    /** An entry from what this run built and measured, the rest kept. */
    const entryFor = (k: Key): CaseEntry => {
      const prev = entryOf(k);
      const app = built.get(k.key);
      const fig = runtime?.subjects[k.key];
      const ie = INTERACTIONS[k.key];
      return {
        hash: app ? sizeHash(k.key, ctx) : prev!.hash,
        runtimeHash: fig ? keyOf(k) : prev!.runtimeHash,
        outputHash: app ? app.outputHash : prev!.outputHash,
        run: fig ? runId : prev!.run,
        size: app ? minus(app, baseOf(k.item)) : prev!.size,
        hydrate: fig
          ? {
              ms: fig.hydrate.ms,
              spread: fig.hydrate.spread,
              settledMs: fig.hydrate.settledMs,
            }
          : prev!.hydrate,
        interaction: fig
          ? ie && fig.interaction
            ? {
                kind: ie.kind,
                start: ie.start,
                says: ie.says,
                ms: fig.interaction.ms,
                spread: fig.interaction.spread,
                ownMs: tenth(fig.interaction.ms - run.instrument.noopMs),
                pressGapMs:
                  ie.kind === "click" ? fig.interaction.pressGapMs : null,
                eventTimingMs:
                  ie.kind === "hover" ? null : fig.interaction.eventTimingMs,
              }
            : null
          : prev!.interaction,
      };
    };

    report = old
      ? structuredClone(old)
      : ({
          schema: 1,
          runs: {},
          empty: { js: 0, css: 0 },
          themeFloor: { js: 0, css: 0, assets: 0, fonts: {}, outputHash: "" },
          floor: {
            js: 0,
            css: 0,
            run: runId,
            hydrateMs: 0,
            noopMs: 0,
            outputHash: "",
          },
          catalogue: { js: 0, css: 0, sumOfAlone: { js: 0, css: 0 } },
          items: {},
        } as Report);
    if (runtime) report.runs[runId] = run;
    report.empty = { js: empty!.sizes.js, css: empty!.sizes.css };
    report.themeFloor = {
      js: themeFloor!.sizes.js,
      css: themeFloor!.sizes.css,
      assets: themeFloor!.sizes.assets,
      fonts: fontsByItem(themeFloor!.sizes),
      outputHash: themeFloor!.outputHash,
    };
    report.floor = {
      js: floor!.sizes.js,
      css: floor!.sizes.css,
      run: runtime ? runId : report.floor.run,
      hydrateMs: runtime ? runtime.floorHydrateMs : report.floor.hydrateMs,
      noopMs: runtime ? runtime.noopMs : report.floor.noopMs,
      outputHash: floor!.outputHash,
    };
    const write = (k: Key) => {
      const e = entryFor(k);
      if (k.kase) {
        report.items[k.item]!.cases[k.kase] = e;
        return;
      }
      const prev = old?.items[k.item];
      const app = built.get(k.key);
      report.items[k.item] = {
        ...e,
        route: app ? app.route : prev!.route,
        breakdown: app
          ? breakdownOf(k.item, app, baseOf(k.item), e.size.js)
          : prev!.breakdown,
        cases: report.items[k.item]?.cases ?? prev?.cases ?? {},
      } as Entry;
    };
    const touched = keys.filter(
      (k) => built.has(k.key) || runtime?.subjects[k.key],
    );
    for (const k of touched.filter((k) => !k.kase)) write(k);
    for (const k of touched.filter((k) => k.kase)) write(k);
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
      const runtimeOver = () =>
        overBudget(report, budgets).filter((line) =>
          /(hydrateMs|interactionMs)/.test(line),
        );
      const over = runtimeOver();
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
          write(keys.find((x) => x.key === k)!);
        }
        const still = runtimeOver();
        log(
          `cost: ${still.length} runtime figure(s) over budget after the re-measure${still.length ? `: ${still.join("; ")}` : ""}`,
        );
      }
    }
    run.seconds = Math.round((performance.now() - t0) / 1000);
    await writeReport(report);
    log(
      runtime
        ? `cost: wrote ${path.relative(REPO, REPORT_PATH)}: run ${runId}, ${run.seconds} s, load median ${run.load.median} max ${run.load.max}, floor ${run.instrument.floorHydrateMs} ms, no-op ${run.instrument.noopMs} ms, calibrate ${run.instrument.calibrateMs} ms${run.noisy ? ", noisy" : ""}`
        : `cost: wrote ${path.relative(REPO, REPORT_PATH)}: the sizes of ${built.size} app(s), ${run.seconds} s; runtime figures kept`,
    );
  } finally {
    await h.close();
    if (!opts.keep) rmSync(work, { recursive: true, force: true });
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
  for (const line of budgetWarnings(report, budgets))
    console.warn(`cost: over budget, not held: ${line}`);
  for (const line of over) console.error(`cost: over budget: ${line}`);
  return over.length ? 1 : 0;
}

if (import.meta.main) {
  if (Bun.version !== pinnedBun()) {
    console.error(
      `cost: this is Bun ${Bun.version}; package.json pins bun@${pinnedBun()}, and gzip's bytes follow the Bun build. Use that Bun.`,
    );
    process.exit(1);
  }
  await guard();
  if (opts.guard) {
    log("cost: the registry matches a fresh build");
    process.exit(0);
  }
  if (opts.budget || opts.tighten) {
    await budgetCommand();
    process.exit(0);
  }
  process.exit(await measure());
}
