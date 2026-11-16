/**
 * `bun scripts/rename-kuiper.ts [--write] [--verify <old build> <new build>]`
 *
 * 020 decision 9: the mechanical half of the Kuiper rename, run once. Its
 * rules are the rename table's rows (`src/lib/site/upgrade/renames.ts`) and
 * 020 decision 8's internal names. Each rule is an exact string or a bounded
 * pattern; none matches a bare `pluto` or `Pluto`, so "Pluto Systems", the
 * lockup word and sample content cannot be touched by accident.
 *
 * Dry by default: it prints each rule's count per file. `--write` applies
 * the rules and the moves; a second `--write` changes 0 files. A guard that
 * no longer matches its line fails the run. `--verify` is 020's check 20:
 * two builds, normalised, the new mapped back to the old names, compared.
 *
 * It goes in 0.14.0 with the aliases (020 decision 15).
 */
import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  statSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { RENAMES } from "../src/lib/site/upgrade/renames.ts";

const ROOT = path.resolve(import.meta.dir, "..");

type Rule = {
  name: string;
  /** A bounded pattern; global. */
  from: RegExp;
  to: string;
  /** Only in these files; every file when absent. */
  only?: (file: string) => boolean;
};

const row = (old: string) => {
  const r = RENAMES.find((x) => x.old === old);
  if (!r) throw new Error(`rename-kuiper: no row for ${old}`);
  return r.new;
};
const bench = (f: string) => f.startsWith("scripts/bench/");

/** The rules, in order: a longer name before any name it contains. */
export const RULES: Rule[] = [
  // The token file (decision 8).
  {
    name: "token file",
    from: /tokens\/pluto\.tokens\.json/g,
    to: row("tokens/pluto.tokens.json"),
  },
  {
    name: "token file, bare",
    from: /\bpluto\.tokens\.json/g,
    to: "kuiper.tokens.json",
  },
  // The theme item, its page, its examples, its thumbnails; the storage key
  // shares the string (decisions 3, 5, 8). Not followed by a letter.
  {
    name: "theme item and storage key",
    from: /\bpluto-theme(?![a-z])/g,
    to: row("pluto-theme"),
  },
  // The context keys, with their quote (decision 4).
  ...[
    "pluto:field-set",
    "pluto:field-label",
    "pluto:field",
    "pluto:tooltip",
    "pluto:item-group",
    "pluto:popover",
    "pluto:accordion-item",
  ].map((old): Rule => ({
    name: `context key ${old}`,
    from: new RegExp(`"${old}"`, "g"),
    to: `"${row(old)}"`,
  })),
  // The keyframes (decision 6).
  ...["pluto-enter", "pluto-exit", "pluto-mark-dock", "pluto-mark-fade"].map(
    (old): Rule => ({
      name: `keyframes ${old}`,
      from: new RegExp(`\\b${old}\\b`, "g"),
      to: row(old),
    }),
  ),
  // The Shiki theme (decision 7).
  { name: "Shiki theme", from: /\bpluto-code\b/g, to: row("pluto-code") },
  // The registry's name, in registry.json alone (decision 8).
  {
    name: "registry name",
    from: /^ {2}"name": "pluto",$/gm,
    to: `  "name": "${row("pluto")}",`,
    only: (f) => f === "registry.json",
  },
  // The package (decision 8).
  {
    name: "package name",
    from: /\bpluto-design-system\b/g,
    to: row("pluto-design-system"),
  },
  {
    name: "package description",
    from: /"description": "The Pluto Systems design system: tokens, styles and Svelte components, served as a shadcn-svelte registry\."/g,
    to: `"description": "The Kuiper Design System, Pluto Systems' design system: tokens, styles and Svelte components, served as a shadcn-svelte registry."`,
    only: (f) => f === "package.json",
  },
  // Scratch names: temp-dir prefixes, the plugin, the smoke fixtures'
  // packages, the tests' compile folder (decision 8).
  {
    name: "scratch names",
    from: /\bpluto-(smoke|registry|dev-loop|site-add|blocks|shadowed|deps|l22|thumbs|tests)\b/g,
    to: "kuiper-$1",
  },
  // System prose in shipped files and on the site (decision 11).
  {
    name: "prose: query captures",
    from: /Captures are Pluto code roles/g,
    to: "Captures are Kuiper code roles",
  },
  {
    name: "prose: query authorship",
    from: /written for the Pluto design system/g,
    to: "written for the Kuiper Design System",
  },
  {
    name: "prose: the theme's title",
    from: /"title": "Pluto theme"/g,
    to: '"title": "Kuiper theme"',
    only: (f) => f === "registry.json",
  },
  {
    name: "prose: the Start door",
    from: /a first Pluto (screen|button)/g,
    to: "a first Kuiper $1",
  },
  // The bench (decision 13).
  {
    name: "bench file",
    from: /scripts\/bench\/pluto\.ts/g,
    to: "scripts/bench/kuiper.ts",
  },
  {
    name: "bench target name",
    from: /name: "Pluto 0\.12 \(Kuiper\)"/g,
    to: 'name: "Kuiper 0.13"',
    only: bench,
  },
  {
    name: "bench origin",
    from: /\bPLUTO = "pluto:"/g,
    to: 'KUIPER = "kuiper:"',
    only: bench,
  },
  { name: "bench constant", from: /\bPLUTO\b/g, to: "KUIPER", only: bench },
  {
    name: "bench build",
    from: /\bplutoBuild\b/g,
    to: "kuiperBuild",
    only: bench,
  },
  {
    name: "bench id",
    from: /(id(?: ===)?:? )"pluto"/g,
    to: '$1"kuiper"',
    only: bench,
  },
  {
    name: "bench --only",
    from: /--only pluto\b/g,
    to: "--only kuiper",
    only: bench,
  },
  {
    name: "bench prose",
    from: /\bPluto(?! Systems)\b/g,
    to: "Kuiper",
    only: bench,
  },
];

/** File and folder moves (decision 8), old → new. */
export const MOVES: [string, string][] = [
  ["tokens/pluto.tokens.json", "tokens/kuiper.tokens.json"],
  ["scripts/bench/pluto.ts", "scripts/bench/kuiper.ts"],
  ["src/lib/site/examples/pluto-theme", "src/lib/site/examples/kuiper-theme"],
  [
    "src/routes/(site)/components/pluto-theme",
    "src/routes/(site)/components/kuiper-theme",
  ],
  [
    "src/lib/site/thumbnails/pluto-theme-light.webp",
    "src/lib/site/thumbnails/kuiper-theme-light.webp",
  ],
  [
    "src/lib/site/thumbnails/pluto-theme-dark.webp",
    "src/lib/site/thumbnails/kuiper-theme-dark.webp",
  ],
];

/**
 * What the script never reads (decision 9): the frozen and generated trees,
 * the whole changelog (its 0.13.0 entry is written by hand), the frozen
 * fixtures, and the files written by hand to name the old names: the rename
 * table and the guide, the redirects, the field-keys view, the allowlist and
 * the tests of the aliases and the records, and this script.
 */
const NEVER = [
  /^static\/v0\./,
  /^static\/r\//,
  /^context\//,
  /^node_modules\//,
  /^build\//,
  /^\.svelte-kit\//,
  /^CHANGELOG\.md$/,
  /^AGENTS\.md$/,
  /^tests\/unit\/fixtures\//,
  /^tests\/fixtures\/pluto-allowed\.json$/,
  /^tests\/unit\/(rename|theme-stored|redirects)\.test\.ts$/,
  /^tests\/e2e\/(redirects|upgrade|field-keys)\.spec\.ts$/,
  /^tests\/smoke\/upgrade\.test\.ts$/,
  /^src\/lib\/site\/upgrade\//,
  /^src\/lib\/site\/redirects\.ts$/,
  /^src\/lib\/registry\/ui\/theme\/stored\.ts$/,
  /^src\/lib\/site\/test-views\/field-keys\//,
  /^src\/routes\/\(view\)\/view\/field-keys\//,
  /^src\/routes\/\(site\)\/changelog\/0\.13\.0\//,
  /^static\/_redirects$/,
  /^scripts\/rename-kuiper\.ts$/,
];

/**
 * What it never changes (decision 9): exact lines, and the hand-written
 * blocks of mixed files, from a first line to the end of the file. Each must
 * still match, or the run fails.
 */
const GUARD_LINES: [file: string, line: string][] = [
  // The 0.12.0 changelog guard: history (decision 2).
  ["tests/unit/registry-comments.test.ts", '      "`pluto-theme`",'],
  ["tests/unit/registry-comments.test.ts", '      "`pluto:`",'],
  // app.html's old preview script: history (decision 2).
  [
    "tests/e2e/theme.spec.ts",
    '    expect(appHtml).not.toContain("pluto-preview-theme");',
  ],
  // The search alias's fixture entry: a record of the old name.
  ["tests/fixtures/search-aliases.json", '    "alias": "pluto-theme",'],
  // Tests that read the 0.12.0 changelog entry, which names pluto-theme:
  // history (decision 2).
  [
    "tests/unit/registry.test.ts",
    '  test("the one 0.12.0 entry holds 016\'s summary line, and its one pluto-theme bullet names the yellows and --caution-text", () => {',
  ],
  [
    "tests/unit/registry.test.ts",
    '      .filter((line) => line.startsWith("- `pluto-theme`: "));',
  ],
  [
    "tests/unit/registry.test.ts",
    " * one pluto-theme bullet says the spacing is now the font's default, and",
  ],
  // code-add's upgrade case installs from v0.11.0, where the theme had its
  // old name: history.
  ["tests/smoke/code-add.test.ts", '      "pluto-theme",'],
  // The aliases, written by hand after the first --write (decisions 3 to 5
  // and 10); they go in 0.14.0. A second run must leave them.
  ["registry.json", '      "name": "pluto-theme",'],
  [
    "src/lib/site/search/aliases.ts",
    '  { alias: "pluto-theme", path: "/components/kuiper-theme/" },',
  ],
  [
    "src/lib/registry/ui/field/field-context.svelte.ts",
    'const OLD_FIELD_CONTEXT_KEY = "pluto:field";',
  ],
  [
    "src/lib/registry/ui/field/field-context.svelte.ts",
    'const OLD_FIELD_SET_CONTEXT_KEY = "pluto:field-set";',
  ],
  [
    "src/lib/registry/ui/field/field-context.svelte.ts",
    'const OLD_LABEL_TARGET_KEY = "pluto:field-label";',
  ],
  ...[
    "input/input",
    "textarea/textarea",
    "checkbox/checkbox",
    "switch/switch",
    "native-select/native-select",
    "input-otp/input-otp",
    "input-group/input-group-password",
  ].map((f): [string, string] => [
    `src/lib/registry/ui/${f}.svelte`,
    '    getContext<FieldContext | undefined>("pluto:field");',
  ]),
  [
    "src/lib/registry/ui/radio-group/radio-group.svelte",
    '    getContext<FieldSetContext | undefined>("pluto:field-set");',
  ],
  [
    "src/lib/registry/ui/tooltip/tooltip.svelte",
    '  setContext("pluto:tooltip", keyboard);',
  ],
  [
    "src/lib/registry/ui/item/item-group.svelte",
    '  setContext("pluto:item-group", true);',
  ],
  [
    "src/lib/registry/ui/popover/popover-content.svelte",
    '  const OLD_KEY = "pluto:popover";',
  ],
  [
    "src/lib/registry/ui/accordion/accordion-item.svelte",
    '  const OLD_KEY = "pluto:accordion-item";',
  ],
  [
    "src/lib/registry/ui/theme/theme-script.svelte",
    "   * or `dark` stored under the key before 0.13.0, `pluto-theme`, is carried",
  ],
  [
    "src/lib/registry/ui/theme/theme-script.svelte",
    `    '      var old = localStorage.getItem("pluto-theme");',`,
  ],
  [
    "src/lib/registry/ui/theme/theme-script.svelte",
    `    '    localStorage.removeItem("pluto-theme");',`,
  ],
  // The bench's fallback for commits before the rename: a record (decision 13).
  [
    "scripts/bench/kuiper.ts",
    '  read("tokens/kuiper.tokens.json") || read("tokens/pluto.tokens.json") || "{}",',
  ],
];
/** A block from its first line to the first line after it that equals `last`. */
const GUARD_BLOCKS: [file: string, first: string, last: string][] = [
  // The changelog's entries before 0.13.0 name pluto-theme: history.
  ["tests/unit/registry.test.ts", 'describe("CHANGELOG.md", () => {', "});"],
  [
    "tests/unit/registry.test.ts",
    `describe("0.12.0: the font's own letter spacing", () => {`,
    "});",
  ],
  [
    "tests/unit/registry.test.ts",
    'describe("019: the changelog", () => {',
    "});",
  ],
  // 020's own tests, written by hand before the script (decision 9).
  [
    "tests/unit/registry.test.ts",
    'describe("020 test 3: kuiper-theme is the theme", () => {',
    "});",
  ],
  [
    "tests/unit/registry.test.ts",
    'describe("020 test 4: the pluto-theme alias", () => {',
    "});",
  ],
  [
    "tests/unit/registry.test.ts",
    'describe("020 test 5: a deprecated item is not listed", () => {',
    "});",
  ],
  [
    "tests/unit/registry.test.ts",
    'describe("020 test 16: the 0.13.0 changelog", () => {',
    "});",
  ],
  [
    "tests/e2e/theme.spec.ts",
    'test.describe("020: the head script carries an old choice over", () => {',
    "});",
  ],
  [
    "tests/unit/generated.test.ts",
    `describe("020: the keyframes are Kuiper's", () => {`,
    "});",
  ],
  [
    "tests/unit/search.test.ts",
    "  // 020 test 18: a renamed item's old name finds its new page.",
    "  });",
  ],
];

function files(): string[] {
  return execFileSync(
    "git",
    ["ls-files", "--cached", "--others", "--exclude-standard"],
    { cwd: ROOT, encoding: "utf8", maxBuffer: 1 << 26 },
  )
    .split("\n")
    .filter(Boolean)
    .filter((f) => !NEVER.some((re) => re.test(f)))
    .filter((f) => existsSync(path.join(ROOT, f)));
}

/** A file's text with the rules applied outside its guarded lines and blocks; and the counts. */
function apply(
  file: string,
  text: string,
): { text: string; counts: Map<string, number> } {
  const counts = new Map<string, number>();
  const lines = text.split("\n");
  const guarded = new Set<number>();
  for (const [f, line] of GUARD_LINES)
    if (f === file) {
      const at = lines.indexOf(line);
      if (at === -1)
        throw new Error(
          `rename-kuiper: guard no longer matches: ${f}: ${line}`,
        );
      guarded.add(at);
    }
  for (const [f, first, last] of GUARD_BLOCKS)
    if (f === file) {
      const at = lines.indexOf(first);
      const end = at === -1 ? -1 : lines.indexOf(last, at + 1);
      if (at === -1 || end === -1)
        throw new Error(
          `rename-kuiper: guard no longer matches: ${f}: ${first}`,
        );
      for (let i = at; i <= end; i++) guarded.add(i);
    }
  const out = lines.map((line, i) => {
    if (guarded.has(i)) return line;
    let next = line;
    for (const rule of RULES) {
      if (rule.only && !rule.only(file)) continue;
      next = next.replace(rule.from, (...m) => {
        counts.set(rule.name, (counts.get(rule.name) ?? 0) + 1);
        return rule.to.replace(/\$(\d)/g, (_, n) => m[Number(n)] ?? "");
      });
    }
    return next;
  });
  return { text: out.join("\n"), counts };
}

function run(write: boolean) {
  const total = new Map<string, number>();
  let changed = 0;
  // The moves first, so the rules see the new paths.
  for (const [from, to] of MOVES) {
    const a = path.join(ROOT, from);
    const b = path.join(ROOT, to);
    if (!existsSync(a)) continue;
    console.log(`move ${from} → ${to}`);
    if (write) {
      mkdirSync(path.dirname(b), { recursive: true });
      renameSync(a, b);
    }
    changed++;
  }
  for (const file of files()) {
    const full = path.join(ROOT, file);
    if (!statSync(full).isFile()) continue;
    const buf = readFileSync(full);
    if (buf.includes(0)) continue;
    const text = buf.toString("utf8");
    const { text: next, counts } = apply(file, text);
    if (next === text) continue;
    changed++;
    const list = [...counts].map(([k, v]) => `${k} ${v}`).join(", ");
    console.log(`${file}: ${list}`);
    for (const [k, v] of counts) total.set(k, (total.get(k) ?? 0) + v);
    if (write) writeFileSync(full, next);
  }
  console.log("\nper rule:");
  for (const rule of RULES)
    console.log(`  ${rule.name}: ${total.get(rule.name) ?? 0}`);
  console.log(
    `\n${write ? "changed" : "would change"} ${changed} files and moves${write ? "" : " (dry; --write applies)"}`,
  );
}

// ——— check 20: nothing else moved ———

/** Every file of a build, by path relative to it. */
function walk(dir: string, base = dir, out: string[] = []): string[] {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, base, out);
    else out.push(path.relative(base, p));
  }
  return out;
}

const HASHED = "(?:js|css|webp|png|svg|woff2|json|wasm)";
/** 020 check 20's normaliser: hashes, the build's version and route indices become placeholders. */
export function normalise(text: string): string {
  return (
    text
      // A dotted hash: name.HASH.ext
      .replace(
        new RegExp(`([\\w@-]+)\\.[A-Za-z0-9_-]{8}\\.(${HASHED})\\b`, "g"),
        "$1.$2",
      )
      // A bare hash: chunks/HASH.js
      .replace(
        new RegExp(
          `(_app/immutable/[\\w/]*?/)[A-Za-z0-9_-]{8}\\.(${HASHED})\\b`,
          "g",
        ),
        "$1_.$2",
      )
      .replace(/__sveltekit_[a-z0-9]+/g, "__sveltekit_X")
      .replace(/version: "[^"]*"/g, 'version: "X"')
      .replace(/node_ids: \[[^\]]*\]/g, "node_ids: [X]")
      .replace(/nodes\/\d+\./g, "nodes/N.")
      // The footer's build stamp: the commit and its date, or neither when a
      // build has no git (as a tree exported from the tag).
      .replace(
        /(<dl class="flex flex-col gap-1 font-mono text-xs text-muted-foreground">)[\s\S]*?(<!--\[0--><div class="flex gap-2"><dt class="w-16">source)/g,
        "$1STAMP$2",
      )
      .replace(/\b[0-9a-f]{7}\b(?=[^<]*<\/(?:a|code|span)>)/g, "COMMIT")
      .replace(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}/g, "DATE")
  );
}

/** The new names mapped back to the old: every row of the table, longest first. */
export function mapBack(text: string): string {
  let out = text;
  const rows = [...RENAMES]
    .filter((r) => r.kind !== "registry name")
    .sort((a, b) => b.new.length - a.new.length);
  for (const r of rows) out = out.split(r.new).join(r.old);
  return (
    out
      .split("kuiper.tokens.json")
      .join("pluto.tokens.json")
      // 020 review, finding 7: the theme item's description is system prose.
      .split("Kuiper's tokens for light and dark")
      .join("The Pluto Systems tokens for light and dark")
      .split("Kuiper&#39;s tokens for light and dark")
      .join("The Pluto Systems tokens for light and dark")
      .split("Kuiper+theme")
      .join("Pluto+theme")
      .split("Kuiper theme")
      .join("Pluto theme")
      .split("Captures are Kuiper code roles")
      .join("Captures are Pluto code roles")
      .split("written for the Kuiper Design System")
      .join("written for the Pluto design system")
      .split("a first Kuiper screen")
      .join("a first Pluto screen")
      .split("a first Kuiper button")
      .join("a first Pluto button")
  );
}

/** The compared files of a build: what check 20 reads. */
function compared(build: string): Map<string, string> {
  const out = new Map<string, string>();
  for (const rel of walk(build)) {
    if (rel === "_app/version.json") continue;
    if (rel.startsWith("_app/immutable/") && rel.endsWith(".js")) continue;
    if (/^v\d/.test(rel)) continue;
    if (!/\.(html|md|json|txt|xml|css)$/.test(rel) && rel !== "_redirects")
      continue;
    const text = readFileSync(path.join(build, rel), "utf8");
    // A source line one character longer can be re-wrapped by the formatter;
    // in HTML a run of whitespace renders as one space.
    out.set(
      normalise(rel),
      rel.endsWith(".html") ? text.replace(/\s+/g, " ") : text,
    );
  }
  return out;
}

/** Check 20's allowed differences: the files 020 adds. */
const ALIAS_FILE = /^r\/styles\/maia\/pluto-theme\.json$/;
const ALLOWED_PATHS = [
  /^_redirects$/,
  /^changelog\/0\.13\.0\/upgrade\//,
  /^view\/field-keys\//,
  /^r\/styles\/maia\/pluto-theme\.json \(the alias\)$/,
];

/** The items the 0.13.0 entry names at a bullet's head: their pages read "Updated 0.13.0". */
const CHANGED = [
  "pluto-theme",
  "theme",
  "field",
  "input",
  "textarea",
  "checkbox",
  "switch",
  "native-select",
  "input-otp",
  "input-group",
  "radio-group",
  "tooltip",
  "item",
  "popover",
  "accordion",
  "highlighter",
];

/**
 * The known differences, written back on the new side once mapped back, so
 * that what is left must be byte-identical: the version, the head script's
 * carry-over, and the "Updated" fact of the items the 0.13.0 entry names.
 * Each is one of the spec's allowed differences.
 */
function rewriteKnown(rel: string, text: string): string {
  let out = text;
  // The head script's carry-over (decision 5), back to the 0.12.0 lines.
  out = out.replace(
    /if \(stored !== "light" && stored !== "dark"\) \{\s*var old = localStorage\.getItem\("pluto-theme"\);\s*if \(old === "light" \|\| old === "dark"\) \{\s*localStorage\.setItem\("pluto-theme", old\);\s*stored = old;\s*\}\s*\}\s*localStorage\.removeItem\("pluto-theme"\);\s*dark = stored === "light" \|\| stored === "dark"\s*\? stored === "dark"\s*: matchMedia\(query\)\.matches;/g,
    'dark = stored ? stored === "dark" : matchMedia(query).matches;',
  );
  const item = /^components\/([\w-]+)\/index\.(html|md)$/.exec(rel)?.[1];
  if (item && CHANGED.includes(item))
    out = out
      .replace(
        /(href="\/changelog\/#)v0-13-0("[^>]*>)0\.13\.0(<)/g,
        "$1UPDATED$2U$3",
      )
      .replace(/updated:"0\.13\.0"/g, 'updated:"U"')
      .replace(
        /\*\*Updated\*\*: \[0\.13\.0\]\([^)]*#v0-13-0\)/g,
        "**Updated**: U",
      );
  // The release: every other 0.13.0 outside the changelog is the version.
  if (!/^changelog\//.test(rel))
    out = out
      .replace(/(?<![\d.])0\.13\.0(?![\d.])/g, "0.12.0")
      .replace(/v0-13-0/g, "v0-12-0");
  // The guide's one new utility, on its table's cells (decision 12).
  if (rel.endsWith(".css"))
    out = out.replace(".whitespace-normal{white-space:normal}", "");
  return out;
}

/** The same "Updated" placeholder on the old side. */
function rewriteOld(rel: string, text: string): string {
  const item = /^components\/([\w-]+)\/index\.(html|md)$/.exec(rel)?.[1];
  if (!item || !CHANGED.includes(item)) return text;
  return text
    .replace(
      /(href="\/changelog\/#)v\d+-\d+-\d+("[^>]*>)\d+\.\d+\.\d+(<)/g,
      "$1UPDATED$2U$3",
    )
    .replace(/updated:"[\d.]+"/g, 'updated:"U"')
    .replace(/\*\*Updated\*\*: \[\d+\.\d+\.\d+\]\([^)]*\)/g, "**Updated**: U");
}

/** The files whose content may still differ, and why: each is a spec's allowed difference. */
const ALLOWED_CONTENT: [RegExp, string][] = [
  [/^r\/styles\/maia\/index\.json$/, "the alias entry; stored.ts joins theme"],
  [
    /^r\/styles\/maia\/(field|input|textarea|checkbox|switch|native-select|input-otp|input-group|radio-group|tooltip|item|popover|accordion|theme)\.json$/,
    "the old context keys and the storage carry-over, in item source (decisions 4, 5)",
  ],
  [
    new RegExp(`^components/(${CHANGED.join("|")})/__data\\.json$`),
    "the page data's Updated fact: the item is named in the 0.13.0 entry",
  ],
  [
    /^components\/theme\/(index\.(html|md)|__data\.json)$/,
    "the theme item's page shows its head script, which carries the old key over, and its API (decision 5)",
  ],
  [/^changelog\/index\.(html|md)$/, "the changelog page: the 0.13.0 entry"],
  [/^changelog\/__data\.json$/, "the changelog page's data: the 0.13.0 entry"],
  [
    /^(sitemap\.xml|search\.json|llms\.txt)$/,
    "the guide's entries, the search alias",
  ],
  [/^start\/install\/index\.(html|md)$/, "the link to the guide"],
];

function verify(oldBuild: string, newBuild: string) {
  const a = new Map(
    [...compared(path.resolve(oldBuild))].map(
      ([k, v]) => [k, rewriteOld(k, v)] as const,
    ),
  );
  const b = compared(path.resolve(newBuild));
  const bMapped = new Map(
    [...b].map(([k, v]) => {
      // The alias's own file keeps its path: the renamed theme's file maps
      // back onto it.
      const rel = ALIAS_FILE.test(k) ? `${k} (the alias)` : mapBack(k);
      return [rel, rewriteKnown(rel, mapBack(normalise(v)))] as const;
    }),
  );
  let same = 0;
  const report: string[] = [];
  const unexplained: string[] = [];
  for (const [k, v] of bMapped) {
    if (!a.has(k)) {
      if (ALLOWED_PATHS.some((re) => re.test(k)))
        report.push(`added (allowed): ${k}`);
      else unexplained.push(`added: ${k}`);
      continue;
    }
    const before = normalise(a.get(k)!);
    if (before === v) {
      same++;
      continue;
    }
    const why = ALLOWED_CONTENT.find(([re]) => re.test(k));
    const diff = firstDiff(before, v);
    (why ? report : unexplained).push(
      `${why ? `differs (allowed: ${why[1]})` : "differs"}: ${k}\n      old: ${diff[0]}\n      new: ${diff[1]}`,
    );
  }
  for (const k of a.keys())
    if (!bMapped.has(k)) unexplained.push(`removed: ${k}`);
  // `src/app.css`, mapped back, equals the old tree's byte for byte.
  const oldCss = path.resolve(oldBuild, "../src/app.css");
  const newCss = path.resolve(newBuild, "../src/app.css");
  if (existsSync(oldCss) && existsSync(newCss)) {
    const same =
      mapBack(readFileSync(newCss, "utf8")) === readFileSync(oldCss, "utf8");
    console.log(
      `  src/app.css, mapped back: ${same ? "identical" : "differs"}`,
    );
    if (!same) unexplained.push("differs: src/app.css");
  }
  console.log(
    `check 20: ${a.size} files before, ${b.size} after; ${same} identical once mapped back.`,
  );
  for (const r of report) console.log(`  ${r}`);
  if (unexplained.length) {
    console.log("\nunexplained:");
    for (const u of unexplained) console.log(`  ${u}`);
    process.exit(1);
  }
}

function firstDiff(a: string, b: string): [string, string] {
  let i = 0;
  while (i < a.length && a[i] === b[i]) i++;
  return [
    a.slice(Math.max(0, i - 60), i + 100),
    b.slice(Math.max(0, i - 60), i + 100),
  ];
}

if (import.meta.main) {
  const args = process.argv.slice(2);
  const v = args.indexOf("--verify");
  if (v !== -1) verify(args[v + 1]!, args[v + 2]!);
  else run(args.includes("--write"));
}
