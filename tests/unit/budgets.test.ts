/**
 * 024 criteria 1, 2, 6 and 9: the page budgets, without a browser. Every
 * sitemap page has one template, and its route uses that template's layout
 * (decisions 1, 2); every budget is decision 4's arithmetic on recorded
 * figures, with a ruling (decision 4); CI's LCP budget is chosen by
 * `lcpBudget` (decision 8); and `perf.spec.ts` holds no budget of its own
 * (decision 7). The browser half is `tests/e2e/perf.spec.ts`.
 */
import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import {
  budgetOf,
  HEAVY,
  lcpBudget,
  LIVE_HIGHLIGHT,
  MARGIN,
  TEMPLATE_IDS,
  TEMPLATES,
  templateOf,
  templatesMatching,
  type Template,
} from "../e2e/budgets.ts";
import { componentPath, SITEMAP } from "../../src/lib/site/sitemap.ts";

const ROUTES = "src/routes/(site)";

/** The route file for a sitemap path (decision 2). */
const routeOf = (p: string) => path.join(ROUTES, p, "+page.svelte");

/** The `#lib/...svelte` files a route imports. */
function layoutsImported(file: string): string[] {
  const src = readFileSync(file, "utf8");
  return [...src.matchAll(/from\s+"#lib\/([^"]+\.svelte)"/g)].map((m) => m[1]);
}

const ALL_LAYOUTS = [
  ...new Set(Object.values(TEMPLATES).flatMap((t) => t.layouts)),
];

describe("024 criterion 1: every page has one template", () => {
  test("there are exactly decision 1's eight templates", () => {
    expect([...TEMPLATE_IDS].sort() as string[]).toEqual(
      [
        "brand",
        "component",
        "component-heavy",
        "component-live",
        "home",
        "index",
        "landing",
        "leaf",
      ].sort(),
    );
    expect(Object.keys(TEMPLATES).sort()).toEqual([...TEMPLATE_IDS].sort());
  });

  test("every SITEMAP page matches exactly one template's rule", () => {
    const bad = SITEMAP.map((p) => ({
      path: p.path,
      matches: templatesMatching(p),
    })).filter((r) => r.matches.length !== 1);
    expect(bad).toEqual([]);
  });

  test("every template has at least one page", () => {
    const used = new Set(SITEMAP.map(templateOf));
    expect(TEMPLATE_IDS.filter((t) => !used.has(t))).toEqual([]);
  });

  test("decision 1's fixed pages land where the table says", () => {
    const t = (p: string) => templateOf(SITEMAP.find((s) => s.path === p)!);
    expect(t("/")).toBe("home");
    expect(t("/components/")).toBe("index");
    expect(t("/start/")).toBe("landing");
    expect(t("/brand/")).toBe("landing");
    expect(t("/foundations/")).toBe("landing");
    expect(t("/components/button/")).toBe("component");
    expect(t("/changelog/")).toBe("leaf");
    expect(t("/changelog/0.13.0/upgrade/")).toBe("leaf");
    expect(t("/start/install/")).toBe("leaf");
    expect(t("/foundations/colour/")).toBe("leaf");
    expect(t("/brand/colour/")).toBe("brand");
  });

  test("each page's route imports its template's layout; home's imports none", () => {
    const bad: string[] = [];
    for (const page of SITEMAP) {
      const file = routeOf(page.path);
      if (!existsSync(file)) {
        bad.push(`${page.path}: no route at ${file}`);
        continue;
      }
      const id = templateOf(page);
      const imported = layoutsImported(file);
      const want = TEMPLATES[id].layouts;
      if (want.length === 0) {
        const shared = imported.filter((l) => ALL_LAYOUTS.includes(l));
        if (file !== routeOf("/") || shared.length > 0)
          bad.push(`${page.path} (${id}): imports ${shared.join(", ")}`);
      } else if (!imported.some((l) => want.includes(l))) {
        bad.push(
          `${page.path} (${id}): imports none of ${want.join(", ")}; has ${imported.join(", ")}`,
        );
      }
    }
    expect(bad).toEqual([]);
  });

  test("HEAVY and LIVE_HIGHLIGHT name only component pages in SITEMAP, and share none", () => {
    const paths = new Set(SITEMAP.map((p) => p.path));
    for (const name of [...HEAVY, ...LIVE_HIGHLIGHT]) {
      const p = SITEMAP.find((s) => s.path === componentPath(name));
      expect(paths.has(componentPath(name))).toBe(true);
      expect(p?.door).toBe("components");
      expect(p?.parent).toBe("/components/");
    }
    expect(HEAVY.filter((n) => LIVE_HIGHLIGHT.includes(n))).toEqual([]);
    expect(new Set(HEAVY).size).toBe(HEAVY.length);
    expect(new Set(LIVE_HIGHLIGHT).size).toBe(LIVE_HIGHLIGHT.length);
  });

  test("the listed pages map to their own templates", () => {
    for (const n of LIVE_HIGHLIGHT)
      expect(
        templateOf(SITEMAP.find((s) => s.path === componentPath(n))!),
      ).toBe("component-live");
    for (const n of HEAVY)
      expect(
        templateOf(SITEMAP.find((s) => s.path === componentPath(n))!),
      ).toBe("component-heavy");
  });
});

/** Decision 4, written out again here so the module is checked, not copied. */
const expected = {
  transfer: (kB: number) => Math.ceil((Math.round(kB * 10) * 11) / 500) * 5,
  lcp: (ms: number, margin: number) =>
    Math.ceil((Math.round(ms) * (100 + Math.round(margin * 100))) / 1000) * 10,
  cls: (v: number) =>
    Math.max(Math.ceil((Math.round(v * 1000) * 12) / 10) / 1000, 0.02),
  ci: (ms: number, margin: number) =>
    Math.ceil((Math.round(ms) * (100 + Math.round(margin * 100))) / 1000) * 10,
};

describe("024 criterion 2: budgets are derived and ruled", () => {
  test("the margins are the owner's Q2 answer", () => {
    expect(MARGIN).toEqual({
      transfer: 0.1,
      lcp: 0.1,
      lcpCiFloor: 0.2,
      cls: 0.2,
      clsFloor: 0.02,
    });
  });

  test("decision 9's worked figures come out as the spec says", () => {
    const t = (
      kB: number,
      ms: number,
      cls: number,
      margin = 0.1,
    ): Template => ({
      figures: {
        transfer: { page: "/", median: kB },
        lcp: { page: "/", median: ms, margin },
        cls: { page: "/", median: cls },
      },
      ci: null,
      probes: ["/"],
      layouts: [],
      ruling: "test",
    });
    expect(budgetOf(t(307, 868, 0.005))).toEqual({
      transfer: 340,
      lcp: 960,
      cls: 0.02,
    });
    expect(budgetOf(t(355, 2776, 0))).toEqual({
      transfer: 395,
      lcp: 3060,
      cls: 0.02,
    });
    expect(budgetOf(t(408, 1088, 0.05)).lcp).toBe(1200);
    expect(budgetOf(t(408, 1088, 0.05)).transfer).toBe(450);
    expect(budgetOf(t(408, 1088, 0.05)).cls).toBe(0.06);
    // Exact multiples stay put: 300 × 1.1 is 330, not 335.
    expect(budgetOf(t(300, 1000, 0)).transfer).toBe(330);
    expect(budgetOf(t(300, 1000, 0)).lcp).toBe(1100);
    // A widened margin (Q2): 1,104 ms × 1.15 is 1,269.6, so 1,270.
    expect(budgetOf(t(300, 1104, 0, 0.15)).lcp).toBe(1270);
  });

  for (const id of TEMPLATE_IDS) {
    test(`${id}: its budget is decision 4's arithmetic on its figures, and it has a ruling`, () => {
      const t = TEMPLATES[id];
      expect(Object.keys(t).sort()).toEqual(
        ["ci", "figures", "layouts", "probes", "ruling"].sort(),
      );
      const b = budgetOf(t);
      expect(b.transfer).toBe(expected.transfer(t.figures.transfer.median));
      expect(b.lcp).toBe(
        expected.lcp(t.figures.lcp.median, t.figures.lcp.margin),
      );
      expect(b.cls).toBe(expected.cls(t.figures.cls.median));
      expect(t.ruling.trim().length).toBeGreaterThan(0);
      expect(t.ruling).toMatch(/024|landing notes|ruling/i);
    });

    test(`${id}: its figures and probes are its own pages; the heaviest and slowest are probed`, () => {
      const t = TEMPLATES[id];
      const own = new Set(
        SITEMAP.filter((p) => templateOf(p) === id).map((p) => p.path),
      );
      for (const p of [
        t.figures.transfer.page,
        t.figures.lcp.page,
        t.figures.cls.page,
        ...t.probes,
      ])
        expect(own.has(p) ? p : `${p} is not a ${id} page`).toBe(p);
      expect(t.probes).toContain(t.figures.transfer.page);
      expect(t.probes).toContain(t.figures.lcp.page);
      // A CLS figure that sets the budget above the floor is probed too.
      if (budgetOf(t).cls > MARGIN.clsFloor)
        expect(t.probes).toContain(t.figures.cls.page);
    });

    test(`${id}: its local LCP margin is 10%, or wider in steps of 5% (Q2)`, () => {
      const { margin } = TEMPLATES[id].figures.lcp;
      expect(margin).toBeGreaterThanOrEqual(MARGIN.lcp);
      expect(Math.round(margin * 100) % 5).toBe(0);
    });

    test(`${id}: ci is null, or a runner figure with a margin of at least 20%`, () => {
      const { ci } = TEMPLATES[id];
      if (ci === null) return;
      expect(ci.median).toBeGreaterThan(0);
      expect(ci.margin).toBeGreaterThanOrEqual(MARGIN.lcpCiFloor);
      expect(Math.round(ci.margin * 100) % 5).toBe(0);
      expect(ci.ruling.trim().length).toBeGreaterThan(0);
    });
  }

  test("component's transfer budget is at most 500 kB (decision 3)", () => {
    expect(budgetOf(TEMPLATES.component).transfer).toBeLessThanOrEqual(500);
  });

  test("component probes Button, and component-live probes every live page (decision 6)", () => {
    expect(TEMPLATES.component.probes).toContain("/components/button/");
    for (const n of LIVE_HIGHLIGHT)
      expect(TEMPLATES["component-live"].probes).toContain(componentPath(n));
  });
});

describe("024 criterion 6: the LCP budget CI reads (decision 8)", () => {
  const base = TEMPLATES.component;
  const withCi = (median: number, margin: number): Template => ({
    ...base,
    ci: { median, margin, ruling: "test" },
  });

  test("locally, LCP gates on the local figure", () => {
    expect(lcpBudget(base, {})).toEqual({
      ms: budgetOf(base).lcp,
      gated: true,
      source: "local",
    });
  });

  test("on CI with no runner figure, LCP is reported, not gated", () => {
    expect(lcpBudget({ ...base, ci: null }, { CI: "1" })).toEqual({
      ms: null,
      gated: false,
      source: "ci",
    });
    expect(lcpBudget({ ...base, ci: null }, { CI: "true" }).gated).toBe(false);
  });

  test("on CI with a runner figure, LCP gates on it plus its margin", () => {
    expect(lcpBudget(withCi(1500, 0.25), { CI: "1" })).toEqual({
      ms: expected.ci(1500, 0.25),
      gated: true,
      source: "ci",
    });
    expect(lcpBudget(withCi(1500, 0.25), { CI: "1" }).ms).toBe(1880);
  });

  test("an empty or false CI variable is local", () => {
    expect(lcpBudget(withCi(1500, 0.25), { CI: "" }).source).toBe("local");
    expect(lcpBudget(withCi(1500, 0.25), { CI: "false" }).source).toBe("local");
    expect(lcpBudget(withCi(1500, 0.25), { CI: "0" }).source).toBe("local");
  });
});

describe("024 criterion 9: the old budgets are gone", () => {
  const spec = readFileSync("tests/e2e/perf.spec.ts", "utf8");

  test("perf.spec.ts holds no per-page budget", () => {
    expect(spec).not.toMatch(/\bBUDGETS\b/);
    expect(spec).not.toMatch(/\bCOLOUR_BUDGET\b/);
    expect(spec).not.toMatch(/\b(transfer|lcp|cls)\s*:\s*\d/);
    expect(spec).not.toMatch(/toBeLessThanOrEqual\(\s*\d/);
  });

  test("perf.spec.ts reads its budgets from budgets.ts", () => {
    expect(spec).toMatch(/from\s+"\.\/budgets\.ts"/);
    expect(spec).toMatch(/\bbudgetOf\b/);
    expect(spec).toMatch(/\blcpBudget\b/);
  });

  test("budgets.ts never imports @playwright/test", () => {
    expect(readFileSync("tests/e2e/budgets.ts", "utf8")).not.toMatch(
      /(from|import)\s+"@playwright\/test"/,
    );
  });
});
