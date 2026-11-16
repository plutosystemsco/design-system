/**
 * 024: one transfer, LCP and CLS budget per page template, each from the
 * template's heaviest or slowest page plus a stated margin.
 *
 * Every page in `SITEMAP` belongs to one of eight templates (decision 1),
 * read from its sitemap entry alone (decision 2), so a new page is checked
 * from its first run with no edit here. `TEMPLATES` records the measured
 * medians and the ruling that set them; the budgets are computed from them
 * by `budgetOf`, never typed (decision 4). A budget rises only by a ruling
 * recorded with its measurement, and falls at a re-base without one
 * (`roadmap.md` §4).
 *
 * Transfer is in kB (1,024 bytes) as sent, the main frame only, without the
 * search index; LCP in ms under `015` decision 23's profile; CLS unitless.
 *
 * Imported by `perf.spec.ts` and by `tests/unit/budgets.test.ts`, so it
 * never imports `@playwright/test`.
 */
import {
  componentPath,
  SITEMAP,
  type SitePage,
} from "../../src/lib/site/sitemap.ts";

export const TEMPLATE_IDS = [
  "home",
  "index",
  "landing",
  "component",
  "component-live",
  "component-heavy",
  "kuiper-theme",
  "leaf",
  "brand",
] as const;
export type TemplateId = (typeof TEMPLATE_IDS)[number];

/** A template's heaviest (or slowest, or most shifting) page, and its median. */
export type Figure = { page: string; median: number };

export type Template = {
  /**
   * Medians from the sweep: the heaviest page by transfer, the slowest by
   * LCP, the worst by CLS. `lcp.margin` is the local LCP margin: 10%, or
   * wider where the sweep's spread passed 10% (the owner's Q2 answer), the
   * spread rounded up to 5%.
   */
  figures: {
    transfer: Figure;
    lcp: Figure & { margin: number };
    cls: Figure;
  };
  /**
   * The CI runner's LCP figure (decision 8): its slowest probe's median of
   * three runs' medians, and the measured margin (never under 20%). Null
   * until the re-base after `022`'s first three green runs; LCP is then
   * reported on CI, not gated.
   */
  ci: null | { median: number; margin: number; ruling: string };
  /** The pages measured for paint on every run (decision 6). */
  probes: string[];
  /** The shared layouts a route of this template imports, one at least (decision 2). None for `home`. */
  layouts: string[];
  /** Where the figures were recorded and who ruled them (decision 4). */
  ruling: string;
};

export type Budget = { transfer: number; lcp: number; cls: number };

/** The owner's Q2 answer. */
export const MARGIN = {
  transfer: 0.1,
  lcp: 0.1,
  lcpCiFloor: 0.2,
  cls: 0.2,
  clsFloor: 0.02,
} as const;

/**
 * Decision 5, split at the landing (024 landing notes, "Rulings at landing",
 * finding 1): the component pages whose **main frame** loads tree-sitter on
 * load. The template rule reads this list; `component-live`'s budget counts
 * the runtime and a grammar. `kuiper-theme` left at `024d`: its ink surface
 * shows a static specimen, so the page loads no editor and no tree-sitter.
 * `highlighter` and `use-highlighted-code` left at `024e`: the hook loads no
 * grammar for empty code, so their streaming examples fetch nothing until
 * Start.
 */
export const LIVE_HIGHLIGHT: readonly string[] = [
  "code-editor",
  "code-languages",
];

/**
 * Decision 5's `.wasm` rule: the pages that may fetch a `.wasm` file, in any
 * frame. Every `LIVE_HIGHLIGHT` page, and the four whose example frames
 * stream code through a live console. Those four count no `.wasm` bytes
 * (transfer is the main frame), so they stay in `component`. No other page
 * may fetch one.
 */
export const WASM_ALLOWED: readonly string[] = [
  ...LIVE_HIGHLIGHT,
  "live-console",
  "stage-card",
  "stage-hero",
  "product-home",
];

/**
 * Decision 3: the component pages that alone would push `component`'s
 * transfer budget past 500 kB (a median over about 455 kB), after
 * `LIVE_HIGHLIGHT` is ruled. Changes only by a ruling with its measurement.
 */
export const HEAVY: readonly string[] = ["chart"];

/**
 * The design lead's ruling at `024d` (024d landing notes): the theme item's
 * page has a template of its own, as `/` and `/components/` have. Over
 * `component`'s line at 462.1 kB, and at 1,348 ms too slow for
 * `component-heavy`'s LCP without unguarding `chart`.
 */
/**
 * Its template is named after the page, as `home` and `index` are, so a
 * report line cannot be read as the `theme` item's (024d's review, finding 1).
 */
export const THEME_PAGE = componentPath("kuiper-theme");

const live = new Set(LIVE_HIGHLIGHT.map(componentPath));
const heavy = new Set(HEAVY.map(componentPath));
const isComponent = (p: SitePage) =>
  p.door === "components" &&
  p.parent === "/components/" &&
  p.path !== THEME_PAGE;

/** Decision 1's mapping, one rule per template. */
const RULES: Record<TemplateId, (p: SitePage) => boolean> = {
  home: (p) => p.path === "/",
  index: (p) => p.path === "/components/",
  landing: (p) =>
    p.parent === "/" && p.door !== null && p.path !== "/components/",
  component: (p) => isComponent(p) && !live.has(p.path) && !heavy.has(p.path),
  "component-live": (p) => isComponent(p) && live.has(p.path),
  "component-heavy": (p) => isComponent(p) && heavy.has(p.path),
  "kuiper-theme": (p) => p.path === THEME_PAGE,
  leaf: (p) =>
    (p.door === null && p.path !== "/") ||
    ((p.door === "start" || p.door === "foundations") &&
      p.parent === `/${p.door}/`),
  brand: (p) => p.door === "brand" && p.parent === "/brand/",
};

/** Every template whose rule takes the page. Exactly one, for every page (criterion 1). */
export function templatesMatching(page: SitePage): TemplateId[] {
  return TEMPLATE_IDS.filter((id) => RULES[id](page));
}

/** The page's template, by its `path`, `door` and `parent`, then the two lists. */
export function templateOf(page: SitePage): TemplateId {
  const ids = templatesMatching(page);
  if (ids.length !== 1)
    throw new Error(
      `024: ${page.path} matches ${ids.length} templates (${ids.join(", ")})`,
    );
  return ids[0];
}

/** The sitemap's pages of one template, in sitemap order. */
export function pagesOf(id: TemplateId): SitePage[] {
  return SITEMAP.filter((p) => templateOf(p) === id);
}

/**
 * Decision 4's arithmetic. Integer steps throughout, so an exact multiple
 * is not pushed up by a floating-point remainder (300 × 1.1 is 330).
 */
export function budgetOf(t: Template): Budget {
  const tenths = Math.round(t.figures.transfer.median * 10);
  const ms = Math.round(t.figures.lcp.median);
  const pct = Math.round(t.figures.lcp.margin * 100);
  const milli = Math.round(t.figures.cls.median * 1000);
  return {
    // × 1.1, rounded up to 5 kB.
    transfer: Math.ceil((tenths * 11) / 500) * 5,
    // × (1 + margin), rounded up to 10 ms.
    lcp: Math.ceil((ms * (100 + pct)) / 1000) * 10,
    // × 1.2, never under 0.02.
    cls: Math.max(Math.ceil((milli * 12) / 10) / 1000, MARGIN.clsFloor),
  };
}

/** True when the `CI` variable is set to something other than an off value. */
const onCi = (env: Record<string, string | undefined>) =>
  !!env.CI && !["0", "false"].includes(env.CI.toLowerCase());

/**
 * Decision 8: the LCP budget for this machine. Locally, the release
 * machine's figure plus 10%. On CI, the runner's figure plus its measured
 * margin, rounded up to 10 ms; with no runner figure, null, and not gated.
 */
export function lcpBudget(
  t: Template,
  env: Record<string, string | undefined>,
): { ms: number | null; gated: boolean; source: "local" | "ci" } {
  if (!onCi(env)) return { ms: budgetOf(t).lcp, gated: true, source: "local" };
  if (!t.ci) return { ms: null, gated: false, source: "ci" };
  const pct = Math.round(t.ci.margin * 100);
  return {
    ms: Math.ceil((Math.round(t.ci.median) * (100 + pct)) / 1000) * 10,
    gated: true,
    source: "ci",
  };
}

const COMPONENT_LAYOUTS = [
  "site/page/component.svelte",
  "preview/block-page.svelte",
  "preview/composition-page.svelte",
];

/**
 * The sweep of 2026-11-16 on `874c5da`'s tree, ruled at the checkpoint by
 * the builder under the owner's delegation (024 landing notes).
 */
const SWEEP = "024 landing notes, the sweep of 2026-11-16 and its checkpoint";

export const TEMPLATES: Record<TemplateId, Template> = {
  home: {
    figures: {
      transfer: { page: "/", median: 300.8 },
      lcp: { page: "/", median: 780, margin: 0.1 },
      cls: { page: "/", median: 0.005 },
    },
    ci: null,
    probes: ["/"],
    layouts: [],
    ruling: SWEEP,
  },
  index: {
    figures: {
      transfer: { page: "/components/", median: 349.5 },
      lcp: { page: "/components/", median: 2472, margin: 0.1 },
      cls: { page: "/components/", median: 0 },
    },
    ci: null,
    probes: ["/components/"],
    layouts: ["site/page/landing.svelte"],
    ruling: SWEEP,
  },
  landing: {
    figures: {
      transfer: { page: "/start/", median: 300.7 },
      // Spread 14.2% on /brand/ (844 to 964 ms): widened to 15%.
      lcp: { page: "/brand/", median: 944, margin: 0.15 },
      cls: { page: "/start/", median: 0 },
    },
    ci: null,
    probes: ["/start/", "/brand/"],
    layouts: ["site/page/landing.svelte"],
    ruling: SWEEP,
  },
  component: {
    figures: {
      transfer: { page: "/components/sidebar/", median: 403.8 },
      // Spread 10.9% on marketing-footer (844 to 936 ms): widened to 15%.
      lcp: { page: "/components/sidebar/", median: 1104, margin: 0.15 },
      // A shift in the page header after hydration, small change `024c`
      // (lane S). The budget it gives, 0.108, is above Core Web Vitals'
      // 0.1 "good" line: accepted until `024c`, not a target. It falls to
      // the floor at the re-base after the fix.
      cls: { page: "/components/label/", median: 0.09 },
    },
    ci: null,
    probes: [
      "/components/sidebar/",
      "/components/button/",
      "/components/label/",
    ],
    layouts: COMPONENT_LAYOUTS,
    ruling: SWEEP,
  },
  "component-live": {
    // `kuiper-theme` (760 kB, 1,352 ms, 0.004) set all three until it left
    // at `024d`; `highlighter` (1,140 ms) set LCP until it left at `024e`,
    // with `use-highlighted-code` (932 ms).
    // Falls, so no ruling: the next pages of the same sweep, not a re-base.
    // The re-base sweep after `024b` to `024e` re-measures.
    figures: {
      transfer: { page: "/components/code-editor/", median: 655.8 },
      lcp: { page: "/components/code-editor/", median: 912, margin: 0.1 },
      cls: { page: "/components/code-editor/", median: 0.003 },
    },
    ci: null,
    probes: LIVE_HIGHLIGHT.map(componentPath),
    layouts: COMPONENT_LAYOUTS,
    ruling: `${SWEEP}; kuiper-theme's fall at 024d (024d landing notes); highlighter's and use-highlighted-code's at 024e (024e landing notes)`,
  },
  "component-heavy": {
    figures: {
      transfer: { page: "/components/chart/", median: 479.9 },
      lcp: { page: "/components/chart/", median: 912, margin: 0.1 },
      cls: { page: "/components/chart/", median: 0 },
    },
    ci: null,
    probes: ["/components/chart/"],
    layouts: COMPONENT_LAYOUTS,
    ruling: SWEEP,
  },
  "kuiper-theme": {
    // One page, measured at `024d` without its editor (024d landing
    // notes): 462.1 kB unthrottled, LCP 1,348 ms (1,348, 1,332, 1,348),
    // CLS 0.004. Its LCP is not the editor's: it was 1,352 with it.
    figures: {
      transfer: { page: THEME_PAGE, median: 462.1 },
      lcp: { page: THEME_PAGE, median: 1348, margin: 0.1 },
      cls: { page: THEME_PAGE, median: 0.004 },
    },
    ci: null,
    probes: [THEME_PAGE],
    layouts: COMPONENT_LAYOUTS,
    ruling:
      "024d landing notes, the design lead's ruling of 2026-11-16 (a ninth template)",
  },
  leaf: {
    figures: {
      transfer: { page: "/changelog/", median: 332.3 },
      lcp: { page: "/changelog/", median: 1008, margin: 0.1 },
      cls: { page: "/changelog/", median: 0.001 },
    },
    ci: null,
    probes: ["/changelog/"],
    layouts: ["site/page/leaf.svelte"],
    ruling: SWEEP,
  },
  brand: {
    figures: {
      transfer: { page: "/brand/downloads/", median: 299.6 },
      // Spread 15.03% on imagery (772 to 888 ms), rounded up to 5%: 20%
      // (the change review's finding 6).
      lcp: { page: "/brand/type/", median: 788, margin: 0.2 },
      cls: { page: "/brand/imagery/", median: 0.012 },
    },
    ci: null,
    probes: ["/brand/downloads/", "/brand/type/"],
    layouts: ["site/brand/page.svelte"],
    ruling: `${SWEEP}; LCP margin 20% by the design lead's ruling at landing (2026-11-16, finding 6)`,
  },
};
