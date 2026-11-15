/**
 * Benchmark, Pluto's own evidence: counts read from this repository at a
 * commit, and from the built site's Markdown twins. Feeds every scorecard
 * row that rests on what Pluto has, not on how a page loads.
 *
 *   bun scripts/bench/pluto.ts [--rev ea1f9bd] [--build build] [--json <file>]
 *
 * `--rev` reads source files with `git show <rev>:<path>` (default: the
 * working tree). The twins come from `--build` (default `build/`), so build
 * at the same commit first; the output prints the build's time to check.
 * Read-only. Not part of `bun run test`.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { args } from "./serve.ts";

const opt = args();
const rev = typeof opt.rev === "string" ? opt.rev : null;
const build = path.resolve(typeof opt.build === "string" ? opt.build : "build");

function read(p: string): string {
  if (rev) {
    const r = Bun.spawnSync(["git", "show", `${rev}:${p}`]);
    return r.exitCode === 0 ? r.stdout.toString() : "";
  }
  return existsSync(p) ? readFileSync(p, "utf8") : "";
}
function list(dir: string): string[] {
  if (rev) {
    const r = Bun.spawnSync(["git", "ls-tree", "-r", "--name-only", rev, dir]);
    return r.stdout.toString().split("\n").filter(Boolean);
  }
  const out: string[] = [];
  const walk = (d: string) => {
    if (!existsSync(d)) return;
    for (const f of readdirSync(d)) {
      const p = path.join(d, f);
      if (statSync(p).isDirectory()) walk(p);
      else out.push(p);
    }
  };
  walk(dir);
  return out;
}
const count = (s: string, re: RegExp) => (s.match(re) ?? []).length;
const grepFiles = (files: string[], re: RegExp) =>
  files.reduce((n, f) => n + count(read(f), re), 0);

// Tokens
const tokens = JSON.parse(read("tokens/pluto.tokens.json") || "{}");
const roles = Object.keys(tokens.themes?.light ?? {});
const words = read("src/lib/site/foundations/words.ts");
const described = roles.filter(
  (r) => words.includes(`"${r}":`) || words.includes(`  ${r}:`),
);
const tokenText = JSON.stringify(tokens);
const contrastPairs = Object.values(tokens.contrast ?? {}).reduce(
  (n: number, v) =>
    n + (Array.isArray(v) ? v.length : Object.keys(v as object).length),
  0,
);

// Theming and accessibility in the theme
const appCss = read("src/app.css");
const items = list("src/lib/registry").filter((f) =>
  /\.(svelte|ts|css)$/.test(f),
);
const itemText = items.map(read).join("\n");

// Tests
const e2e = list("tests/e2e").filter((f) => f.endsWith(".spec.ts"));
const pw = read("playwright.config.ts");
const pkg = JSON.parse(read("package.json") || "{}");

// Registry
const registry = JSON.parse(read("registry.json") || '{"items":[]}');
const byType: Record<string, number> = {};
for (const i of registry.items) byType[i.type] = (byType[i.type] ?? 0) + 1;
const deprecated = registry.items.filter(
  (i: { meta?: { deprecated?: unknown } }) => i.meta?.deprecated,
).length;

// Change communication
const changelog = read("CHANGELOG.md");
const routes = list("src/routes");

// Guidance depth, from the twins
type Twin = {
  name: string;
  examples: number;
  usage: boolean;
  doDont: boolean;
  anatomy: boolean;
  keyboardTable: boolean;
  content: boolean;
  a11yBullets: number;
  props: number;
  propsDescribed: number;
  updated: boolean;
  words: number;
};
const twins: Twin[] = [];
const compDir = path.join(build, "components");
if (existsSync(compDir)) {
  for (const name of readdirSync(compDir).sort()) {
    const f = path.join(compDir, name, "index.md");
    if (!existsSync(f)) continue;
    const md = readFileSync(f, "utf8");
    const section = (h: string) => {
      const m = md.split(/\n(?=## )/).find((s) => s.startsWith(`## ${h}`));
      return m ?? "";
    };
    const api = section("API");
    const rows = api
      .split("\n")
      .filter((l) => l.startsWith("| `"))
      // Cells split on unescaped pipes; a union type holds `\|`.
      .map((l) => l.split(/(?<!\\)\|/).map((c) => c.trim()));
    const a11y = section("Accessibility");
    const prose = md.replace(/```[\s\S]*?```/g, "");
    twins.push({
      name,
      examples: count(section("Examples"), /^### /gm),
      usage: section("Usage").length > 20,
      doDont: /### Do\n/.test(md) && /### Don't\n/.test(md),
      anatomy: /^##+ Anatomy/m.test(md),
      keyboardTable: /\|\s*(Key|Keys)\s*\|/.test(a11y),
      content: /^##+ (Content|Writing|Wording)/m.test(md),
      a11yBullets: count(a11y, /^- /gm),
      props: rows.length,
      propsDescribed: rows.filter((r) => (r[4] ?? "").length > 0).length,
      updated: /\*\*Updated\*\*/.test(md),
      words: prose.split(/\s+/).filter(Boolean).length,
    });
  }
}
const pct = (n: number, d: number) => (d ? Math.round((100 * n) / d) : 0);
const props = twins.reduce((n, t) => n + t.props, 0);
const propsDescribed = twins.reduce((n, t) => n + t.propsDescribed, 0);
const sorted = (xs: number[]) => [...xs].sort((a, b) => a - b);
const med = (xs: number[]) =>
  xs.length ? sorted(xs)[Math.floor(xs.length / 2)] : 0;

const report = {
  script: "scripts/bench/pluto.ts",
  at: new Date().toISOString(),
  rev: rev ?? "working tree",
  build: existsSync(path.join(build, "index.html"))
    ? statSync(path.join(build, "index.html")).mtime.toISOString()
    : null,
  breadth: { items: registry.items.length, byType },
  tokens: {
    primitives: Object.keys(tokens.primitives ?? {}).length,
    themes: Object.keys(tokens.themes ?? {}),
    rolesPerTheme: roles.length,
    rolesWithWords: described.length,
    groups: Object.keys(tokens).length,
    dtcgValueKeys: count(tokenText, /"\$value"/g),
    dtcgTypeKeys: count(tokenText, /"\$type"/g),
    descriptionsInFile: count(tokenText, /"\$?description"/g),
    contrastPairs,
    modes: ["productive", tokens.expressive ? "expressive" : null].filter(
      Boolean,
    ),
  },
  theming: {
    lightDarkFn: count(appCss, /light-dark\(/g),
    prefersContrast: count(appCss + itemText, /prefers-contrast/g),
    dataScheme: count(appCss, /data-scheme/g),
    lightReset: count(appCss, /^\s*\.light\b/gm),
    darkIsland: count(appCss, /surface-ink/g) > 0,
    density: count(appCss + itemText, /data-density|density/g),
  },
  accessibility: {
    forcedColorsRulesTheme: count(appCss, /forced-colors/g),
    forcedColorsRulesItems: count(itemText, /forced-colors/g),
    axeSpec: e2e.some((f) => f.endsWith("axe.spec.ts")),
    keyboardSpec: e2e.some((f) => f.endsWith("keyboard.spec.ts")),
    forcedColorsSpec: e2e.some((f) => f.endsWith("forced-colors.spec.ts")),
    themeProjects: count(pw, /colorScheme:/g),
    screenReaderTooling: Boolean(pkg.devDependencies?.["@guidepup/guidepup"]),
    statusOnPages: twins.some((t) =>
      /Accessibility status/i.test(
        readFileSync(path.join(compDir, t.name, "index.md"), "utf8"),
      ),
    ),
    e2eSpecs: e2e.length,
  },
  depth: {
    pages: twins.length,
    examplesMedian: med(twins.map((t) => t.examples)),
    usagePct: pct(twins.filter((t) => t.usage).length, twins.length),
    doDontPct: pct(twins.filter((t) => t.doDont).length, twins.length),
    anatomyPct: pct(twins.filter((t) => t.anatomy).length, twins.length),
    keyboardTablePct: pct(
      twins.filter((t) => t.keyboardTable).length,
      twins.length,
    ),
    contentPct: pct(twins.filter((t) => t.content).length, twins.length),
    a11yBulletsMedian: med(twins.map((t) => t.a11yBullets)),
    propsRows: props,
    propsDescribedPct: pct(propsDescribed, props),
    updatedFactPct: pct(twins.filter((t) => t.updated).length, twins.length),
    proseWordsMedian: med(twins.map((t) => t.words)),
  },
  reach: {
    frameworks: ["svelte"],
    physicalSideClasses: count(
      itemText,
      /\b(ml|mr|pl|pr|left|right|border-l|border-r|rounded-l|rounded-r|text-left|text-right)-[\w[(]/g,
    ),
    logicalSideClasses: count(
      itemText,
      /\b(ms|me|ps|pe|start|end|border-s|border-e|rounded-s|rounded-e|text-start|text-end)-[\w[(]/g,
    ),
    rtlMentions: count(itemText, /\brtl\b|dir=/g),
    intlUses: count(itemText, /\bIntl\.|toLocale/g),
  },
  change: {
    releases: count(changelog, /^## /gm),
    interfaceChangeMarks: count(changelog, /interface change/gi),
    migrationPages: routes.filter((r) => /migrat|upgrade/i.test(r)).length,
    versionedRegistries: new Set(
      list("static")
        .map((f) => f.match(/^static\/(v[\d.]+)\/r\//)?.[1])
        .filter(Boolean),
    ).size,
    feed: routes.some((r) => /changelog\.xml|feed|rss|atom/i.test(r)),
  },
  tooling: {
    figma: grepFiles([...list("src/routes"), "README.md"], /figma/gi),
  },
  governance: {
    deprecatedItems: deprecated,
    contributing: Boolean(read("CONTRIBUTING.md")),
    specifications: list("context/specifications").filter((f) =>
      f.endsWith(".md"),
    ).length,
    reviews: list("context/reviews").filter((f) => /\d{3}-.*\.md$/.test(f))
      .length,
    license: pkg.license ?? null,
  },
};

if (typeof opt.json === "string")
  await Bun.write(opt.json, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
