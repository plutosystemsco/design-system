/**
 * 021 tests T12 to T14: the lifecycle. Each token says the release that first
 * shipped it; `tokens/kuiper.removed.json` lists every name that shipped and
 * is gone, checked against every release in the tree; and a deprecation
 * names a replacement that exists.
 */
import { describe, expect, test } from "bun:test";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const VERSION: string = JSON.parse(
  readFileSync("package.json", "utf8"),
).version;
const VENDOR = "co.plutosystems.kuiper";
const TOKEN_FILES = [
  "kuiper.tokens.json",
  "kuiper.light.tokens.json",
  "kuiper.dark.tokens.json",
];
const RECORD = "tokens/kuiper.removed.json";

type Json = Record<string, unknown>;
const isObject = (v: unknown): v is Json =>
  typeof v === "object" && v !== null && !Array.isArray(v);
const readJson = (file: string): Json =>
  existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : {};
const vendor = (node: Json) =>
  ((node.$extensions as Json)?.[VENDOR] ?? {}) as Json;

/** Semver order, so 0.4.0 comes before 0.11.0. */
const parts = (v: string) => v.split(".").map(Number);
function compare(a: string, b: string): number {
  const [x, y] = [parts(a), parts(b)];
  for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] - y[i];
  return 0;
}

/** Every token with its path and the CSS name it carries or its group does. */
function tokensOf(tree: Json) {
  const out: {
    path: string;
    token: Json;
    css?: string;
    groupSince?: string;
  }[] = [];
  const visit = (node: Json, at: string[], css?: string, since?: string) => {
    for (const [k, v] of Object.entries(node)) {
      if (k.startsWith("$") || !isObject(v)) continue;
      const own = vendor(v);
      if ("$value" in v)
        out.push({
          path: [...at, k].join("."),
          token: v,
          css: (own.cssVariable as string) ?? css,
          groupSince: since,
        });
      else
        visit(
          v,
          [...at, k],
          (own.cssVariable as string) ?? css,
          (own.since as string) ?? since,
        );
    }
  };
  visit(tree, []);
  return out;
}

/** The versioned registry folders under static/, in version order. */
const RELEASES = readdirSync("static")
  .filter((d) => /^v\d+\.\d+\.\d+$/.test(d))
  .map((d) => d.slice(1))
  .sort(compare);

/**
 * 021 decision 10: the names a theme item ships. A cssVars.light or .dark
 * key as --<key> and --color-<key>; a cssVars.theme key, and a -- key
 * anywhere in css, as itself.
 */
function shipped(item: Json): Set<string> {
  const out = new Set<string>();
  const vars = (item.cssVars ?? {}) as Record<string, Json>;
  for (const scheme of ["light", "dark"])
    for (const key of Object.keys(vars[scheme] ?? {})) {
      out.add(`--${key}`);
      out.add(`--color-${key}`);
    }
  for (const key of Object.keys(vars.theme ?? {})) out.add(`--${key}`);
  const visit = (node: unknown) => {
    if (!isObject(node)) return;
    for (const [k, v] of Object.entries(node)) {
      if (k.startsWith("--")) out.add(k);
      visit(v);
    }
  };
  visit(item.css);
  return out;
}

function themeItems(version: string): Json[] {
  const dir = path.join("static", `v${version}`, "r", "styles", "maia");
  return ["pluto-theme.json", "kuiper-theme.json"]
    .map((f) => path.join(dir, f))
    .filter(existsSync)
    .map(readJson);
}

/** The font items ship their family's variable (the CLI writes it into @theme). */
function fontVariables(version: string): Set<string> {
  const dir = path.join("static", `v${version}`, "r", "styles", "maia");
  const out = new Set<string>();
  if (!existsSync(dir)) return out;
  for (const f of readdirSync(dir).filter((f) => f.startsWith("font-"))) {
    const variable = (readJson(path.join(dir, f)).font as Json)?.variable;
    if (typeof variable === "string") out.add(variable);
  }
  return out;
}

const shippedBy = new Map<string, Set<string>>(
  RELEASES.map((v) => [
    v,
    new Set([
      ...themeItems(v).flatMap((item) => [...shipped(item)]),
      ...fontVariables(v),
    ]),
  ]),
);
const firstShipped = (name: string) =>
  RELEASES.find((v) => shippedBy.get(v)!.has(name));

const record = readJson(RECORD);
const entries = (record.removed ?? []) as Json[];
const today = shipped(readJson("static/r/styles/maia/kuiper-theme.json"));

describe("021 T12: since is true", () => {
  const all = TOKEN_FILES.flatMap((f) =>
    tokensOf(readJson(path.join("tokens", f))).map((t) => ({ ...t, file: f })),
  );

  test("every token has a since no later than package.json's version", () => {
    expect(all.length).toBeGreaterThan(300);
    for (const { file, path: p, token } of all) {
      const since = vendor(token).since;
      expect(typeof since, `${file}: ${p}`).toBe("string");
      expect(
        compare(since as string, VERSION),
        `${file}: ${p}`,
      ).toBeLessThanOrEqual(0);
    }
  });

  test("a token with a CSS name says the first release that shipped it", () => {
    let checked = 0;
    for (const { file, path: p, token, css } of all) {
      const since = vendor(token).since as string;
      if (!css) {
        // 021 decision 10: a token with no CSS name first ships as a path in 0.13.0.
        expect(since, `${file}: ${p}`).toBe("0.13.0");
        continue;
      }
      const first = firstShipped(css);
      expect(first, `${file}: ${p} (${css}) ships in no release`).toBeDefined();
      checked++;
      if (first === RELEASES[0])
        expect(
          compare(since, first!),
          `${file}: ${p} (${css}) since ${since}`,
        ).toBeLessThanOrEqual(0);
      else expect(since, `${file}: ${p} (${css})`).toBe(first!);
    }
    expect(checked).toBeGreaterThan(200);
  });

  test("a group with a CSS name carries the same since as its tokens", () => {
    let n = 0;
    for (const file of TOKEN_FILES)
      for (const t of tokensOf(readJson(path.join("tokens", file))))
        if (t.groupSince && !vendor(t.token).cssVariable) {
          n++;
          expect(vendor(t.token).since, `${file}: ${t.path}`).toBe(
            t.groupSince,
          );
        }
    // The four display sizes, the gutter, the spring and the glass shadow.
    expect(n).toBeGreaterThan(10);
  });
});

describe("021 T13: the record is complete", () => {
  test("the record's custom properties are exactly the shipped names today's theme lacks: 24", () => {
    const gone = new Set<string>();
    for (const v of RELEASES)
      for (const name of shippedBy.get(v)!)
        if (!today.has(name) && !fontVariables(VERSION).has(name))
          gone.add(name);
    const listed = entries
      .filter((e) => e.kind === "css-variable")
      .map((e) => e.name as string);
    expect(listed.sort()).toEqual([...gone].sort());
    expect(listed).toHaveLength(24);
  });

  test("each entry is well formed, and its since and removed agree with the releases", () => {
    expect(typeof record.$description).toBe("string");
    expect(entries.length).toBeGreaterThan(0);
    for (const e of entries) {
      const at = String(e.name);
      expect(["css-variable", "token"], at).toContain(e.kind as string);
      expect(["removed", "renamed", "retyped"], at).toContain(
        (e.change ?? "removed") as string,
      );
      if (e.change === "renamed")
        expect(typeof e.replacement, at).toBe("string");
      expect(typeof e.by, at).toBe("string");
      expect(typeof e.note, at).toBe("string");
      expect(compare(e.removed as string, VERSION), at).toBeLessThanOrEqual(0);
      if (e.kind === "css-variable") {
        const first = firstShipped(at)!;
        if (first === RELEASES[0])
          expect(compare(e.since as string, first), at).toBeLessThanOrEqual(0);
        else expect(e.since, at).toBe(first);
        const last = [...RELEASES]
          .reverse()
          .find((v) => shippedBy.get(v)!.has(at))!;
        expect(e.removed, at).toBe(
          RELEASES[RELEASES.indexOf(last) + 1] ?? VERSION,
        );
      }
    }
  });

  test("each replacement exists in today's theme", () => {
    const replaced = entries.filter((e) => e.replacement !== undefined);
    // --code-foreground and its --color- form became --code-text's.
    expect(replaced.length).toBeGreaterThan(0);
    for (const e of replaced)
      expect(today.has(e.replacement as string), String(e.name)).toBe(true);
  });

  test("no record name is in src/app.css or kuiper.css", () => {
    const app = readFileSync("src/app.css", "utf8");
    const plain = existsSync("static/r/tokens/kuiper.css")
      ? readFileSync("static/r/tokens/kuiper.css", "utf8")
      : null;
    expect(plain).not.toBeNull();
    for (const e of entries.filter((e) => e.kind === "css-variable")) {
      const re = new RegExp(`(?<![\\w-])${e.name}(?![\\w-])`);
      expect(re.test(app), String(e.name)).toBe(false);
      expect(re.test(plain!), String(e.name)).toBe(false);
    }
  });

  test("the record's token paths are exactly the DTCG paths a release shipped and today lacks", () => {
    const paths = (dir: string) =>
      new Set(
        TOKEN_FILES.flatMap((f) =>
          existsSync(path.join(dir, f))
            ? tokensOf(readJson(path.join(dir, f))).map((t) => t.path)
            : [],
        ),
      );
    const now = paths("tokens");
    expect(now.size).toBeGreaterThan(200);
    const gone = new Set<string>();
    for (const v of RELEASES)
      for (const p of paths(path.join("static", `v${v}`, "r", "tokens")))
        if (!now.has(p)) gone.add(p);
    expect(
      entries
        .filter((e) => e.kind === "token")
        .map((e) => e.name)
        .sort(),
    ).toEqual([...gone].sort());
  });
});

describe("021 T14: deprecations name their replacement", () => {
  test("every $deprecated string holds a {path} that resolves; 0 today", () => {
    for (const f of TOKEN_FILES)
      expect(existsSync(path.join("tokens", f)), f).toBe(true);
    const base = readJson("tokens/kuiper.tokens.json");
    let deprecated = 0;
    for (const scheme of ["light", "dark"]) {
      const own = readJson(`tokens/kuiper.${scheme}.tokens.json`);
      const tree = { ...base, ...own };
      const resolves = (p: string) => {
        let at: unknown = tree;
        for (const k of p.split(".")) at = isObject(at) ? at[k] : undefined;
        return isObject(at) && "$value" in at;
      };
      for (const { path: p, token } of tokensOf(tree)) {
        if (!("$deprecated" in token)) continue;
        deprecated++;
        const d = token.$deprecated;
        if (typeof d !== "string") continue;
        const m = /\{([^{}]+)\}/.exec(d);
        expect(m, `${p}: ${d}`).not.toBeNull();
        expect(resolves(m![1]), `${p}: ${d}`).toBe(true);
      }
    }
    expect(deprecated).toBe(0);
  });
});
