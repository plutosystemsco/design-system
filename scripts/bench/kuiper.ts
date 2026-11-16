/**
 * Benchmark, Kuiper's own evidence: counts read from this repository at a
 * commit, and from the built site's Markdown twins. Feeds every scorecard
 * row that rests on what Kuiper has, not on how a page loads.
 *
 *   bun scripts/bench/kuiper.ts [--rev ea1f9bd] [--build build] [--json <file>]
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
// 021 decision 14: from 021 the source is DTCG, a resolver and the files it
// names; before it, one file of Kuiper's own shape, at `tokens/kuiper.tokens.json`
// or, before 020's rename (020 decision 13), at its old name, with
// the role words in `words.ts`. Each commit is scored in its own shape.
type TokenJson = Record<string, unknown>;
const tokenGroups = (tree: TokenJson) =>
  Object.keys(tree).filter((k) => !k.startsWith("$"));
const tokensIn = (group: unknown): TokenJson[] =>
  Object.entries((group ?? {}) as TokenJson)
    .filter(([k, v]) => !k.startsWith("$") && typeof v === "object" && v)
    .map(([, v]) => v as TokenJson)
    .filter((v) => "$value" in v);
const countContrast = (rules: unknown) =>
  Object.entries((rules ?? {}) as TokenJson)
    .filter(([k]) => !k.startsWith("$"))
    .reduce(
      (n: number, [, v]) =>
        n + (Array.isArray(v) ? v.length : Object.keys(v as object).length),
      0,
    );
const resolverText = read("tokens/kuiper.resolver.json");
let tokenShape: {
  file: string;
  primitives: number;
  themes: string[];
  roles: number;
  described: number;
  groups: number;
  text: string;
  contrastPairs: number;
  expressive: boolean;
};
if (resolverText) {
  const resolver = JSON.parse(resolverText);
  const contexts = (resolver.modifiers?.scheme?.contexts ?? {}) as Record<
    string,
    { $ref: string }[]
  >;
  const tokenFile = (ref: string | undefined) =>
    JSON.parse((ref && read(`tokens/${ref}`)) || "{}") as TokenJson;
  const base = tokenFile(resolver.sets?.base?.sources?.[0]?.$ref);
  const light = tokenFile(contexts.light?.at(-1)?.$ref);
  const dark = tokenFile(contexts.dark?.at(-1)?.$ref);
  const roleTokens = tokensIn(light.role);
  tokenShape = {
    file: "tokens/kuiper.resolver.json",
    primitives: tokensIn(base.primitive).length,
    themes: Object.keys(contexts),
    roles: roleTokens.length,
    described: roleTokens.filter(
      (t) => typeof t.$description === "string" && t.$description,
    ).length,
    groups: new Set([...tokenGroups(base), ...tokenGroups(light)]).size,
    text: [base, light, dark].map((t) => JSON.stringify(t)).join("\n"),
    contrastPairs: countContrast(
      JSON.parse(read("tokens/kuiper.contrast.json") || "{}"),
    ),
    expressive: "expressive" in base,
  };
} else {
  const oldText =
    read("tokens/kuiper.tokens.json") || read("tokens/pluto.tokens.json");
  const tokens = JSON.parse(oldText || "{}");
  const roles = Object.keys(tokens.themes?.light ?? {});
  const words = read("src/lib/site/foundations/words.ts");
  tokenShape = {
    file: oldText ? "the one token file" : "",
    primitives: Object.keys(tokens.primitives ?? {}).length,
    themes: Object.keys(tokens.themes ?? {}),
    roles: roles.length,
    described: roles.filter(
      (r) => words.includes(`"${r}":`) || words.includes(`  ${r}:`),
    ).length,
    groups: Object.keys(tokens).length,
    text: JSON.stringify(tokens),
    contrastPairs: countContrast(tokens.contrast),
    expressive: Boolean(tokens.expressive),
  };
}
// No count may read 0 silently (021 decision 14).
if (
  !tokenShape.file ||
  !tokenShape.primitives ||
  !tokenShape.roles ||
  !tokenShape.contrastPairs
) {
  console.error(
    `kuiper.ts: at ${rev ?? "the working tree"}, no token source was read: ${
      tokenShape.file
        ? `${tokenShape.file} gave ${tokenShape.primitives} primitives, ${tokenShape.roles} roles, ${tokenShape.contrastPairs} contrast pairs`
        : "no resolver, and no token file under either name, is there"
    }`,
  );
  process.exit(1);
}
const tokenText = tokenShape.text;

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
  script: "scripts/bench/kuiper.ts",
  at: new Date().toISOString(),
  rev: rev ?? "working tree",
  build: existsSync(path.join(build, "index.html"))
    ? statSync(path.join(build, "index.html")).mtime.toISOString()
    : null,
  breadth: { items: registry.items.length, byType },
  tokens: {
    primitives: tokenShape.primitives,
    themes: tokenShape.themes,
    rolesPerTheme: tokenShape.roles,
    rolesWithWords: tokenShape.described,
    groups: tokenShape.groups,
    dtcgValueKeys: count(tokenText, /"\$value"/g),
    dtcgTypeKeys: count(tokenText, /"\$type"/g),
    descriptionsInFile: count(tokenText, /"\$?description"/g),
    contrastPairs: tokenShape.contrastPairs,
    modes: ["productive", tokenShape.expressive ? "expressive" : null].filter(
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
