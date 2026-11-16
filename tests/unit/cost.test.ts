/**
 * 025, component cost: criteria 1 to 11, 13 and 14. These read the committed
 * report and budgets and never build an app, so they take seconds. The smoke
 * test (`tests/smoke/cost.test.ts`) proves the harness measures what it says.
 */
import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import {
  budgetWarnings,
  checkRulings,
  missingBudgets,
  overBudget,
  readBudgets,
  type Budgets,
} from "../../scripts/cost/budgets.ts";
import { addItem, cliEnv, OFFLINE_ENV } from "../../scripts/cost/build.ts";
import { parseFlags } from "../../scripts/cost/flags.ts";
import {
  hashContext,
  runtimeKeyOf,
  sizeHash,
} from "../../scripts/cost/hash.ts";
import {
  INTERACTIONS,
  KINDS,
  STARTS,
  VERBS,
} from "../../scripts/cost/interactions.ts";
import {
  APP_DIR,
  FIXTURES_DIR,
  allowedImports,
  catalogueItems,
  classify,
  lockVersions,
  packagesNamedByItems,
  registryItems,
} from "../../scripts/cost/items.ts";
import {
  COST_NOTE_INPUT,
  costFacts,
  newestFullRun,
  readReport,
  type Entry,
  type Report,
} from "../../scripts/cost/report.ts";
import {
  hodgesLehmann,
  launchDifference,
  launchFigure,
  median,
} from "../../scripts/cost/stats.ts";

const report = readReport();
const budgets = readBudgets();
const kinds = classify();
const fixtureFiles = readdirSync(FIXTURES_DIR).filter((f) =>
  f.endsWith(".svelte"),
);
/** The harness's own pages, which are not items. */
const HARNESS = ["_floor.svelte", "_theme-floor.svelte", "_calibrate.svelte"];

/** Every import specifier in a Svelte or TS file. */
function importsOf(text: string): string[] {
  return [
    ...text.matchAll(/\bimport\s+(?:[^"';]*?\s+from\s+)?["']([^"']+)["']/g),
    ...text.matchAll(/\bimport\(\s*["']([^"']+)["']\s*\)/g),
  ].map((m) => m[1]!);
}

describe("025 criterion 1: fixtures and routes", () => {
  test("every item is a floor item, a block, or has a fixture file", () => {
    const names = registryItems().map((i) => i.name);
    const covered = [...kinds.floor, ...kinds.blocks, ...kinds.fixtures];
    expect([...covered].sort()).toEqual([...names].sort());
    expect(new Set(covered).size).toBe(covered.length);
    for (const name of kinds.fixtures)
      expect(fixtureFiles, name).toContain(`${name}.svelte`);
    for (const name of [...kinds.floor, ...kinds.blocks])
      expect(fixtureFiles, name).not.toContain(`${name}.svelte`);
    // The bracketed counts at landing: 4 floor items and the theme's alias,
    // 8 blocks, 63 fixture files; 71 measured.
    console.info(
      `cost: ${names.length} items: ${kinds.floor.length} floor, ${kinds.blocks.length} blocks, ${kinds.fixtures.length} fixtures; ${kinds.measured.length} measured`,
    );
  });

  test("every case file names an item that has a fixture, and every fixture file is an item, a case or the harness's", () => {
    expect(kinds.cases.length).toBeGreaterThan(0);
    for (const c of kinds.cases) expect(kinds.fixtures).toContain(c.item);
    const known = new Set([
      ...kinds.fixtures.map((n) => `${n}.svelte`),
      ...kinds.cases.map((c) => `${c.item}.${c.case}.svelte`),
      ...HARNESS,
    ]);
    expect(fixtureFiles.filter((f) => !known.has(f))).toEqual([]);
    for (const f of HARNESS) expect(fixtureFiles).toContain(f);
  });

  test("each fixture and case imports only from its own item's installed path, its own packages, and svelte", () => {
    const bad: string[] = [];
    const files = [
      ...kinds.fixtures.map((item) => ({ item, file: `${item}.svelte` })),
      ...kinds.cases.map((c) => ({
        item: c.item,
        file: `${c.item}.${c.case}.svelte`,
      })),
    ];
    for (const { item, file } of files) {
      const text = readFileSync(path.join(FIXTURES_DIR, file), "utf8");
      const allowed = allowedImports(item);
      for (const spec of importsOf(text))
        if (!allowed(spec)) bad.push(`${file}: ${spec}`);
    }
    expect(bad).toEqual([]);
  });
});

describe("025 criterion 2: interactions", () => {
  const entries = Object.entries(INTERACTIONS);

  test("one entry per decision 9 item, and one per case that has an interaction [35]", () => {
    for (const [key] of entries) {
      const [item, kase] = key.split(".");
      expect(kinds.measured, key).toContain(item!);
      if (kase)
        expect(
          existsSync(path.join(FIXTURES_DIR, `${item}.${kase}.svelte`)),
          key,
        ).toBe(true);
    }
    expect(entries.map(([k]) => k).sort()).toEqual(
      [
        "button",
        "theme",
        "tooltip",
        "toggle",
        "toggle-group",
        "tabs",
        "collapsible",
        "popover",
        "accordion",
        "alert-dialog",
        "dialog",
        "sheet",
        "dropdown-menu",
        "error-summary",
        "checkbox",
        "radio-group",
        "switch",
        "input-otp",
        "input-group",
        "code-block",
        "code-editor",
        "chart",
        "sidebar",
        "composer",
        "stage-card",
        "marketing-bar",
        "live-console",
        "sign-in",
        "sign-up",
        "settings",
        "app-shell",
        "chat",
        // 026 decision 25: the toast and its two cases.
        "toast",
        "toast.burst",
        "toast.progress",
      ].sort(),
    );
  });

  test("each entry has its six fields, a start and a verb from the lists, and only strings", () => {
    for (const [key, e] of entries) {
      for (const field of [
        "kind",
        "start",
        "target",
        "state",
        "says",
        "viewport",
      ] as const)
        expect(typeof e[field], `${key}.${field}`).toBe("string");
      for (const value of Object.values(e))
        expect(typeof value, key).toBe("string");
      expect(KINDS, key).toContain(e.kind);
      expect(STARTS, key).toContain(e.start);
      expect(VERBS, key).toContain(e.says);
      expect(e.viewport, key).toMatch(/^\d+x\d+$/);
      if (e.kind === "key") expect(typeof e.key, key).toBe("string");
    }
  });

  test("the target marker, data-cost set to target, appears only in fixture and case files, at most once each", () => {
    const marker = 'data-cost="' + 'target"';
    const files = (dir: string): string[] =>
      readdirSync(dir).flatMap((e) => {
        const full = path.join(dir, e);
        if (e === "node_modules" || e.startsWith(".")) return [];
        return statSync(full).isDirectory() ? files(full) : [full];
      });
    const hits = ["src", "scripts", "static/r", "tests"]
      .flatMap(files)
      .filter((f) => !/\.(png|wasm|woff2?|jpg|webp)$/.test(f))
      .map((f) => ({ f, n: readFileSync(f, "utf8").split(marker).length - 1 }))
      .filter((h) => h.n > 0);
    for (const h of hits) {
      expect(h.f.startsWith(path.relative(".", FIXTURES_DIR)), h.f).toBe(true);
      expect(h.n, h.f).toBe(1);
    }
  });
});

describe("025 criterion 3: the cost app's packages", () => {
  const pkg = JSON.parse(
    readFileSync(path.join(APP_DIR, "package.json"), "utf8"),
  );
  const kit3 = JSON.parse(
    readFileSync("tests/smoke/fixtures/kit3/package.json", "utf8"),
  );
  const listed: Record<string, string> = {
    ...pkg.dependencies,
    ...pkg.devDependencies,
  };
  const named = packagesNamedByItems();
  const locked = lockVersions("bun.lock");

  test("it names every package an item names, at the exact version the repository's lock resolves", () => {
    expect(named.length).toBeGreaterThan(0);
    for (const name of named) {
      expect(listed[name], name).toBeDefined();
      expect(listed[name], name).toBe(locked.get(name)!);
    }
  });

  test("and no package beyond those and the kit3 fixture's", () => {
    const allowed = new Set([...named, ...Object.keys(kit3.devDependencies)]);
    expect(Object.keys(listed).filter((n) => !allowed.has(n))).toEqual([]);
    for (const [name, version] of Object.entries(
      kit3.devDependencies as Record<string, string>,
    ))
      expect(listed[name], name).toBe(version);
    for (const version of Object.values(listed))
      expect(version).toMatch(/^\d+\.\d+\.\d+(-[\w.]+)?$/);
  });

  test("its bun.lock agrees", () => {
    const appLock = lockVersions(path.join(APP_DIR, "bun.lock"));
    for (const [name, version] of Object.entries(listed))
      expect(appLock.get(name), name).toBe(version);
    // The lock is JSONC; its workspace lists each package as package.json does.
    const lockText = readFileSync(path.join(APP_DIR, "bun.lock"), "utf8");
    for (const name of Object.keys(listed))
      expect(lockText, name).toContain(`"${name}": "${listed[name]}"`);
  });

  test("its .gitignore lists build/, .svelte-kit/ and node_modules/", () => {
    const ignore = readFileSync(path.join(APP_DIR, ".gitignore"), "utf8")
      .split("\n")
      .map((l) => l.trim());
    for (const line of ["build/", ".svelte-kit/", "node_modules/"])
      expect(ignore).toContain(line);
  });
});

describe("025 criterion 4: the report's shape", () => {
  test("runs, the floors, the catalogue, and one entry per measured item with its cases", () => {
    expect(report.schema).toBe(1);
    for (const key of [
      "runs",
      "empty",
      "themeFloor",
      "floor",
      "catalogue",
      "items",
    ] as const)
      expect(report[key], key).toBeDefined();
    expect(Object.keys(report.items).sort()).toEqual(
      [...kinds.measured].sort(),
    );
    for (const c of kinds.cases)
      expect(
        Object.keys(report.items[c.item]!.cases),
        `${c.item}.${c.case}`,
      ).toContain(c.case);
    for (const [name, e] of Object.entries(report.items))
      for (const k of Object.keys(e.cases))
        expect(
          kinds.cases.some((c) => c.item === name && c.case === k),
          `${name}.${k}`,
        ).toBe(true);
  });

  test("every run named exists, and each run has its fields", () => {
    expect(report.runs[report.floor.run]).toBeDefined();
    const all = Object.entries(report.items).flatMap(([name, e]) => [
      [name, e] as const,
      ...Object.entries(e.cases).map(([k, c]) => [`${name}.${k}`, c] as const),
    ]);
    for (const [key, e] of all) {
      expect(report.runs[e.run], key).toBeDefined();
      expect(typeof e.hash, key).toBe("string");
      expect(typeof e.runtimeHash, key).toBe("string");
      for (const metric of ["js", "css", "lazy", "assets"] as const)
        expect(typeof e.size[metric], `${key} ${metric}`).toBe("number");
      expect(typeof e.size.brotli.js, key).toBe("number");
      expect(typeof e.hydrate.ms, key).toBe("number");
      expect(e.hydrate.spread, key).toHaveLength(2);
    }
    for (const [id, run] of Object.entries(report.runs)) {
      expect(typeof run.commit, id).toBe("string");
      expect(typeof run.full, id).toBe("boolean");
      expect(typeof run.noisy, id).toBe("boolean");
      expect(typeof run.machine.model, id).toBe("string");
      for (const tool of [
        "bun",
        "chromium",
        "playwright",
        "cli",
        "zlib",
      ] as const)
        expect(typeof run.tools[tool], `${id} ${tool}`).toBe("string");
      expect(typeof run.instrument.noopMs, id).toBe("number");
    }
  });

  test("an entry with an interaction has one, with its start and verb; every other has null", () => {
    const all = Object.entries(report.items).flatMap(([name, e]) => [
      [name, e] as const,
      ...Object.entries(e.cases).map(([k, c]) => [`${name}.${k}`, c] as const),
    ]);
    for (const [key, e] of all) {
      const entry = INTERACTIONS[key];
      if (!entry) {
        expect(e.interaction, key).toBeNull();
        continue;
      }
      expect(e.interaction, key).not.toBeNull();
      expect(e.interaction!.start, key).toBe(entry.start);
      expect(e.interaction!.says, key).toBe(entry.says);
      expect(e.interaction!.kind, key).toBe(entry.kind);
      if (entry.kind === "click")
        expect(typeof e.interaction!.pressGapMs, key).toBe("number");
      else expect(e.interaction!.pressGapMs, key).toBeNull();
      if (entry.kind === "hover")
        expect(e.interaction!.eventTimingMs, key).toBeNull();
    }
  });
});

describe("025 criterion 5: fresh", () => {
  // The change review's finding 2, as the design lead ruled it (2026-11-16):
  // a stale size fails here, at every landing; a stale runtime figure is
  // named here and refused by the release check, at the tag.
  const full = newestFullRun(report);
  const ctx = hashContext(full?.tools.zlib ?? process.versions.zlib!);
  const all = Object.entries(report.items).flatMap(([name, e]) => [
    [name, e] as const,
    ...Object.entries(e.cases).map(([k, c]) => [`${name}.${k}`, c] as const),
  ]);

  test("every item's and case's size hash equals the report's", () => {
    expect(full, "a full run in the report").toBeDefined();
    if (Bun.version !== full!.tools.bun)
      console.warn(
        `cost: the local Bun is ${Bun.version}; the report's newest full run used ${full!.tools.bun}`,
      );
    if (process.versions.zlib !== full!.tools.zlib)
      console.warn(
        `cost: the local zlib is ${process.versions.zlib}; the report's newest full run used ${full!.tools.zlib}`,
      );
    const stale = all
      .filter(([key, e]) => sizeHash(key, ctx) !== e.hash)
      .map(([key]) => key);
    if (stale.length)
      throw new Error(
        `stale sizes: run \`bun run cost --sizes-only\` (minutes) or \`bun run cost\`. ${stale.length} stale: ${stale.join(", ")}`,
      );
  });

  test("a stale runtime key is named, not failed: the release check holds it", () => {
    for (const [key, e] of all) expect(typeof e.outputHash, key).toBe("string");
    expect(typeof report.floor.outputHash).toBe("string");
    expect(typeof report.themeFloor.outputHash).toBe("string");
    const stale = all
      .filter(([key, e]) => runtimeKeyOf(key, report, ctx) !== e.runtimeHash)
      .map(([key]) => key);
    if (stale.length)
      console.warn(
        `cost: ${stale.length} runtime figure(s) were measured on other builds: ${stale.join(", ")}. The tag's \`bun run cost --full\` re-measures them; \`bun run cost --only <items>\` does it now.`,
      );
  });
});

describe("025 criterion 6: within budget", () => {
  test("every figure is within its budget, and every response time within 200 ms", () => {
    expect(overBudget(report, budgets)).toEqual([]);
    for (const line of budgetWarnings(report, budgets))
      console.warn(`cost: over budget, not held: ${line}`);
  });

  test("every item and case has a budget for each figure it has, and none for a figure it lacks", () => {
    expect(missingBudgets(report, budgets)).toEqual([]);
  });

  test("budgets.json names the release machine and the instrument", () => {
    expect(budgets.machine.length).toBeGreaterThan(0);
    expect(budgets.instrument.floorHydrateMs).toBeGreaterThan(0);
    expect(budgets.instrument.noopMs).toBeGreaterThan(0);
  });
});

/** Reads a specification by its link, for the ruling check. */
function readSpec(link: string): string | null {
  const file = link.split("#")[0]!;
  return existsSync(file) ? readFileSync(file, "utf8") : null;
}

describe("025 criterion 7: rulings", () => {
  test("every rise in budgets.json's history and working tree has a ruling, and no record changes", () => {
    const shallow = execFileSync(
      "git",
      ["rev-parse", "--is-shallow-repository"],
      { encoding: "utf8" },
    ).trim();
    if (shallow === "true")
      throw new Error(
        "cost: this clone is shallow, so budgets.json's history cannot be read. Fetch with full history (`git fetch --unshallow`).",
      );
    const file = "scripts/cost/budgets.json";
    const commits = execFileSync(
      "git",
      ["log", "--reverse", "--format=%H", "--", file],
      { encoding: "utf8" },
    )
      .split("\n")
      .filter(Boolean);
    const versions: { label: string; budgets: Budgets }[] = [];
    for (const commit of commits) {
      let text: string;
      try {
        text = execFileSync("git", ["show", `${commit}:${file}`], {
          encoding: "utf8",
        });
      } catch {
        continue; // deleted at that commit
      }
      versions.push({ label: commit.slice(0, 7), budgets: JSON.parse(text) });
    }
    versions.push({ label: "the working tree", budgets });
    expect(checkRulings(versions, readSpec)).toEqual([]);
  });
});

describe("025 criterion 8: the breakdown", () => {
  // A group names the package its code is in: one the cost app lists, or one
  // its lock pins beneath them (bits-ui's svelte-toolbelt).
  const named = new Set(lockVersions(path.join(APP_DIR, "bun.lock")).keys());
  const items = new Set(registryItems().map((i) => i.name));

  test("for every item, the groups sum to its initial JS within a byte per group, from known sources, and never cn", () => {
    for (const [name, e] of Object.entries(report.items)) {
      const sum = e.breakdown.reduce((a, g) => a + g.js, 0);
      expect(
        Math.abs(sum - e.size.js),
        `${name}: ${sum} against ${e.size.js}`,
      ).toBeLessThanOrEqual(Math.max(1, e.breakdown.length));
      for (const g of e.breakdown) {
        expect(g.source, name).not.toBe("package:cn");
        const ok =
          g.source === "own" ||
          g.source === "runtime" ||
          (g.source.startsWith("item:") && items.has(g.source.slice(5))) ||
          (g.source.startsWith("package:") && named.has(g.source.slice(8)));
        expect(ok, `${name}: ${g.source}`).toBe(true);
      }
    }
  });
});

describe("025 criterion 9: statistics", () => {
  test("medians", () => {
    expect(median([3, 1, 2])).toBe(2);
    expect(median([4, 1, 3, 2])).toBe(2.5);
  });

  test("a fixed 6-launch table of blocks: the launch-level differences and their median", () => {
    // Each launch's block: 4 floor trials and 3 item trials (FIFIFIF).
    const blocks = [
      { floor: [100, 104, 98, 102], item: [130, 128, 135] }, // 101, 130: 29
      { floor: [110, 106, 108, 112], item: [140, 138, 139] }, // 109, 139: 30
      { floor: [95, 97, 99, 93], item: [120, 125, 122] }, // 96, 122: 26
      { floor: [120, 118, 119, 121], item: [151, 149, 160] }, // 119.5, 151: 31.5
      { floor: [101, 103, 105, 99], item: [128, 129, 127] }, // 102, 128: 26
      { floor: [99, 101, 100, 98], item: [133, 131, 129] }, // 99.5, 131: 31.5
    ];
    expect(blocks.map(launchDifference)).toEqual([29, 30, 26, 31.5, 26, 31.5]);
    expect(launchFigure(blocks.map(launchDifference))).toEqual({
      ms: 29.5,
      spread: [26, 31.5],
    });
  });

  test("Hodges–Lehmann: the median of the Walsh averages", () => {
    // The ten averages of [1, 2, 3, 10] taken in pairs, each with itself
    // included: 1, 1.5, 2, 2, 2.5, 3, 5.5, 6, 6.5, 10. Their median is 2.75
    // (025's criterion 9 said 2.5, the lower median; see its landing notes).
    expect(hodgesLehmann([1, 2, 3, 10])).toBe(2.75);
    expect(hodgesLehmann([5])).toBe(5);
  });
});

/** A report entry for costFacts, with every figure but the ones under test at 0. */
function entry(over: Partial<Entry>): Entry {
  return {
    hash: "",
    runtimeHash: "",
    outputHash: "",
    run: "",
    route: "/",
    size: { js: 0, css: 0, lazy: 0, assets: 0, brotli: { js: 0, css: 0 } },
    breakdown: [],
    hydrate: { ms: 0, spread: [0, 0], settledMs: null },
    interaction: null,
    cases: {},
    ...over,
  };
}

function interaction(
  start: "click" | "pointerdown" | "keydown" | "pointerover",
  says: string,
  ms: number,
) {
  const kind =
    start === "keydown" ? "key" : start === "pointerover" ? "hover" : "click";
  return {
    kind,
    start,
    says,
    ms,
    spread: [ms, ms] as [number, number],
    ownMs: ms - 41,
    pressGapMs: kind === "click" ? 0 : null,
    eventTimingMs: null,
  } as Entry["interaction"];
}

describe("025 criterion 10: the facts strings", () => {
  test("a dialog-like entry: its size and its verb", () => {
    const f = costFacts(
      entry({
        size: {
          js: 37_777,
          css: 1_635,
          lazy: 0,
          assets: 0,
          brotli: { js: 0, css: 0 },
        },
        interaction: interaction("click", "opens", 96.2),
      }),
    );
    expect(f.size).toBe("39.4 kB");
    expect(f.onDemand).toBeNull();
    expect(f.time).toBe("opens in 96 ms");
    expect(f.note).toContain("from the click");
    expect(f.note).toContain("an empty click measures 41 ms");
  });

  test("static entries: hydration, and under 5 ms", () => {
    expect(
      costFacts(
        entry({ hydrate: { ms: 36.4, spread: [30, 40], settledMs: null } }),
      ).time,
    ).toBe("hydrates in 36 ms");
    expect(
      costFacts(
        entry({ hydrate: { ms: 1.0, spread: [0, 2], settledMs: null } }),
      ).time,
    ).toBe("hydrates in under 5 ms");
    expect(costFacts(entry({})).note).toBe(
      "Alone, gzipped. Hydration under a 4× slower CPU, over an empty page's.",
    );
  });

  test("a lazy-heavy entry: initial bytes only, and what loads on demand", () => {
    const f = costFacts(
      entry({
        size: {
          js: 20_000,
          css: 1_000,
          lazy: 40_000,
          assets: 93_000,
          brotli: { js: 0, css: 0 },
        },
      }),
    );
    expect(f.size).toBe("21.0 kB");
    expect(f.onDemand).toBe("+ 133 kB on demand");
  });

  test("each note names its input, and no key or hover note says click before an empty click", () => {
    const note = (start: "click" | "pointerdown" | "keydown" | "pointerover") =>
      costFacts(entry({ interaction: interaction(start, "opens", 90) })).note;
    expect(note("click")).toContain("from the click");
    expect(note("pointerdown")).toContain("from the click");
    expect(note("keydown")).toContain("from the key press");
    expect(note("pointerover")).toContain("from the hover");
    for (const start of ["keydown", "pointerover"] as const) {
      const n = note(start);
      expect(n.indexOf("click")).toBe(n.indexOf("an empty click") + 9);
    }
    expect(COST_NOTE_INPUT).toEqual({
      click: "click",
      pointerdown: "click",
      keydown: "key press",
      pointerover: "hover",
    });
  });
});

describe("025 criterion 11: the catalogue", () => {
  test("the catalogue costs less than its items' alone figures summed, both positive, over the same items", () => {
    expect(report.catalogue.js).toBeGreaterThan(0);
    expect(report.catalogue.sumOfAlone.js).toBeGreaterThan(0);
    expect(report.catalogue.js).toBeLessThan(report.catalogue.sumOfAlone.js);
    const sum = catalogueItems().reduce(
      (a, n) => a + report.items[n]!.size.js,
      0,
    );
    expect(report.catalogue.sumOfAlone.js).toBe(sum);
    for (const b of kinds.blocks) expect(catalogueItems()).not.toContain(b);
  });
});

/** A deep copy of the committed report, to break in a test. */
function copyOf(r: Report): Report {
  return structuredClone(r);
}

describe("025 criterion 13: the gate fails", () => {
  const releaseRun = (r: Report, model: string) => {
    const id = "2099-01-01T00:00:00.000Z";
    const base = Object.values(r.runs)[0]!;
    r.runs[id] = {
      ...structuredClone(base),
      full: true,
      noisy: false,
      machine: { ...base.machine, model },
    };
    return id;
  };

  test("button's js one byte over names button and js", () => {
    const r = copyOf(report);
    r.items.button!.size.js = budgets.items.button!.js + 1;
    const over = overBudget(r, budgets);
    expect(over.length).toBe(1);
    expect(over[0]).toContain("button");
    expect(over[0]).toContain("js");
  });

  test("dialog's response time over its budget, on the release machine, names dialog and interactionMs", () => {
    const r = copyOf(report);
    const id = releaseRun(r, budgets.machine);
    r.items.dialog!.run = id;
    r.items.dialog!.interaction!.ms = budgets.items.dialog!.interactionMs! + 1;
    const over = overBudget(r, budgets);
    expect(over.length).toBe(1);
    expect(over[0]).toContain("dialog");
    expect(over[0]).toContain("interactionMs");
  });

  test("the same figure from another machine, under 200 ms, passes", () => {
    const r = copyOf(report);
    const id = releaseRun(r, "Another machine");
    r.items.dialog!.run = id;
    r.items.dialog!.interaction!.ms = Math.min(
      199,
      budgets.items.dialog!.interactionMs! + 1,
    );
    expect(overBudget(r, budgets)).toEqual([]);
  });
});

describe("025 criterion 14: a rise without a ruling fails", () => {
  const base = (js: number, raised: unknown[] = []): Budgets =>
    ({
      machine: "M",
      instrument: { floorHydrateMs: 100, noopMs: 40 },
      items: {
        dialog: {
          js,
          css: 2000,
          lazy: 1000,
          assets: 1000,
          hydrateMs: 40,
          interactionMs: 120,
          raised,
        },
      },
    }) as Budgets;
  const ruling = {
    metric: "js",
    from: 40_000,
    to: 41_000,
    date: "2026-11-15",
    ruling: "context/specifications/025-component-cost.md#landing-notes",
  };
  const specs = (link: string) =>
    link.startsWith("context/specifications/025-component-cost.md")
      ? "## Landing notes\n\nRuling: `dialog`'s js rises.\n"
      : null;

  test("a→b with its record and b→c without one names dialog, js, b and c", () => {
    const problems = checkRulings(
      [
        { label: "a", budgets: base(40_000) },
        { label: "b", budgets: base(41_000, [ruling]) },
        { label: "c", budgets: base(42_000, [ruling]) },
      ],
      specs,
    );
    expect(problems.length).toBe(1);
    for (const word of ["dialog", "js", "41000", "42000"])
      expect(problems[0]).toContain(word);
  });

  test("a deleted budget added back higher is still a rise", () => {
    const gone = base(40_000);
    delete (gone.items as Record<string, unknown>).dialog;
    const problems = checkRulings(
      [
        { label: "a", budgets: base(40_000) },
        { label: "b", budgets: gone },
        { label: "c", budgets: base(45_000) },
      ],
      specs,
    );
    expect(problems.length).toBe(1);
    expect(problems[0]).toContain("45000");
  });

  test("a removed or changed record fails", () => {
    const problems = checkRulings(
      [
        { label: "b", budgets: base(41_000, [ruling]) },
        { label: "c", budgets: base(41_000, []) },
      ],
      specs,
    );
    expect(problems.join("\n")).toContain("removed or changed");
  });
});

describe("025 change review, finding 5: hydration is held like response time", () => {
  test("a hydration figure over budget from another machine is a warning, not a failure", () => {
    const r = copyOf(report);
    const id = "2099-01-02T00:00:00.000Z";
    const base = Object.values(r.runs)[0]!;
    r.runs[id] = {
      ...structuredClone(base),
      machine: { ...base.machine, model: "Another machine" },
    };
    r.items.button!.run = id;
    r.items.button!.hydrate.ms = budgets.items.button!.hydrateMs + 1;
    expect(overBudget(r, budgets)).toEqual([]);
    expect(budgetWarnings(r, budgets).join("\n")).toContain("button hydrateMs");
  });

  test("and from a noisy run on the release machine, the same", () => {
    const r = copyOf(report);
    const id = "2099-01-03T00:00:00.000Z";
    const base = Object.values(r.runs)[0]!;
    r.runs[id] = {
      ...structuredClone(base),
      machine: { ...base.machine, model: budgets.machine },
      noisy: true,
    };
    r.items.button!.run = id;
    r.items.button!.hydrate.ms = budgets.items.button!.hydrateMs + 1;
    expect(overBudget(r, budgets)).toEqual([]);
  });
});

describe("025 change review, finding 4: the flags", () => {
  test("--full with --only is refused; each alone parses", () => {
    expect(() => parseFlags(["--full", "--only", "button"])).toThrow(
      "takes no --only",
    );
    expect(parseFlags(["--full"]).full).toBe(true);
    expect(parseFlags(["--only", "button,dialog"]).only).toEqual([
      "button",
      "dialog",
    ]);
    expect(parseFlags(["--sizes-only"]).sizesOnly).toBe(true);
  });
});

describe("025 change review, finding 8: every CLI run is offline", () => {
  test("cliEnv is OFFLINE_ENV and the registry's address, and nothing else", () => {
    expect(Object.keys(OFFLINE_ENV).sort()).toEqual([
      "BUN_CONFIG_REGISTRY",
      "npm_config_fetch_retries",
      "npm_config_registry",
    ]);
    expect(OFFLINE_ENV.npm_config_fetch_retries).toBe("0");
    expect(cliEnv("http://127.0.0.1:1/r")).toEqual({
      ...OFFLINE_ENV,
      REGISTRY_URL: "http://127.0.0.1:1/r",
    });
    // addItem takes no environment of its own: it always passes cliEnv.
    expect(addItem.length).toBe(3);
  });

  test("the harness runs the CLI in one place, addItem, under cliEnv", () => {
    const dir = "scripts/cost";
    const sources = readdirSync(dir)
      .filter((f) => f.endsWith(".ts"))
      .map((f) => ({ f, text: readFileSync(path.join(dir, f), "utf8") }));
    const calls = sources.flatMap(({ f, text }) =>
      [...text.matchAll(/"shadcn-svelte",\s*"add"/g)].map(() => f),
    );
    expect(calls).toEqual(["build.ts"]);
    const build = sources.find((s) => s.f === "build.ts")!.text;
    const body = build.slice(
      build.indexOf("export async function addItem("),
      build.indexOf("/** The package names a package.json lists. */"),
    );
    expect(body).toContain('"shadcn-svelte"');
    expect(body).toContain("cliEnv(registryUrl)");
  });
});

describe("025 change review, finding 12: a ruling names its item exactly", () => {
  test("notes that name only `button-group` are no ruling for `button`", () => {
    const b = (js: number, raised: unknown[] = []) =>
      ({
        machine: "M",
        instrument: { floorHydrateMs: 100, noopMs: 40 },
        items: {
          button: {
            js,
            css: 1000,
            lazy: 1000,
            assets: 1000,
            hydrateMs: 30,
            raised,
          },
        },
      }) as Budgets;
    const record = {
      metric: "js",
      from: 10_000,
      to: 11_000,
      date: "2026-11-16",
      ruling: "context/specifications/025-component-cost.md#landing-notes",
    };
    const notes = (text: string) => () => `## Landing notes\n\n${text}\n`;
    const versions = [
      { label: "a", budgets: b(10_000) },
      { label: "b", budgets: b(11_000, [record]) },
    ];
    expect(
      checkRulings(versions, notes("`button-group`'s js rises.")),
    ).toHaveLength(1);
    expect(checkRulings(versions, notes("`button`'s js rises."))).toEqual([]);
  });
});
