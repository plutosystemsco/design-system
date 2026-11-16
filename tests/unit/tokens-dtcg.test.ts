/**
 * 021 tests T1 to T6: the token source is DTCG 2025.10. A resolver names a
 * base file and one file per scheme; every token in them has the format's
 * shape; every alias resolves in each scheme; the two scheme files hold the
 * same paths; and every role, code slot and group says what it is for.
 *
 * The walk here is the test's own, written from the format, not imported
 * from the build, so a fault in the build's reader cannot hide one here.
 */
import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { THEMES } from "../../scripts/tokens.ts";

const DIR = "tokens";
const FORMAT = "https://www.designtokens.org/schemas/2025.10/format.json";
const RESOLVER = "https://www.designtokens.org/schemas/2025.10/resolver.json";
const VENDOR = "co.plutosystems.kuiper";
const BASE = "kuiper.tokens.json";
const SCHEME_FILE = (scheme: string) => `kuiper.${scheme}.tokens.json`;
const TOKEN_FILES = [BASE, ...THEMES.map(SCHEME_FILE)];

type Json = Record<string, unknown>;
const read = (file: string): Json =>
  existsSync(path.join(DIR, file))
    ? JSON.parse(readFileSync(path.join(DIR, file), "utf8"))
    : {};
const isObject = (v: unknown): v is Json =>
  typeof v === "object" && v !== null && !Array.isArray(v);

/** Every token in a tree, with its path, and every group, with its path. */
function walk(tree: Json, prefix: string[] = []) {
  const tokens: { path: string; token: Json }[] = [];
  const groups: { path: string; group: Json }[] = [];
  for (const [name, value] of Object.entries(tree)) {
    if (name.startsWith("$") || !isObject(value)) continue;
    const p = [...prefix, name];
    if ("$value" in value) tokens.push({ path: p.join("."), token: value });
    else {
      groups.push({ path: p.join("."), group: value });
      const inner = walk(value, p);
      tokens.push(...inner.tokens);
      groups.push(...inner.groups);
    }
  }
  return { tokens, groups };
}

/** The names in a tree that are neither `$`-properties nor valid names. */
function badNames(tree: Json, prefix = ""): string[] {
  const out: string[] = [];
  for (const [name, value] of Object.entries(tree)) {
    if (name.startsWith("$")) continue;
    if (!/^[^${}.][^{}.]*$/.test(name)) out.push(`${prefix}${name}`);
    if (isObject(value) && !("$value" in value))
      out.push(...badNames(value, `${prefix}${name}.`));
  }
  return out;
}

const files = Object.fromEntries(TOKEN_FILES.map((f) => [f, read(f)]));
const resolver = read("kuiper.resolver.json");

/** One scheme's base and scheme file, merged token by token, the later winning. */
function flatten(scheme: string): Json {
  const out: Json = {};
  const merge = (into: Json, from: Json) => {
    for (const [k, v] of Object.entries(from)) {
      if (isObject(v) && !("$value" in v) && isObject(into[k]))
        merge(into[k] as Json, v);
      else into[k] = structuredClone(v);
    }
  };
  merge(out, files[BASE]);
  merge(out, files[SCHEME_FILE(scheme)]);
  return out;
}

function lookup(tree: Json, p: string): Json | undefined {
  let at: unknown = tree;
  for (const part of p.split(".")) {
    if (!isObject(at)) return undefined;
    at = at[part];
  }
  return isObject(at) && "$value" in at ? at : undefined;
}

const ALIAS = /^\{([^{}]+)\}$/;
const aliasOf = (token: Json) =>
  typeof token.$value === "string" ? ALIAS.exec(token.$value)?.[1] : undefined;

const round4 = (n: number) => Math.round(n * 10000) / 10000;
function bytesOf(hex: string) {
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
}

/** The shape each `$type` used here takes, or a reason it does not. */
function shapeFault(type: unknown, value: unknown): string | null {
  if (typeof value === "string" && ALIAS.test(value)) return null;
  switch (type) {
    case "color": {
      if (!isObject(value)) return "a colour is an object";
      if (value.colorSpace !== "srgb") return "colorSpace is srgb";
      const c = value.components;
      if (
        !Array.isArray(c) ||
        c.length !== 3 ||
        !c.every((n) => typeof n === "number" && n >= 0 && n <= 1)
      )
        return "three components from 0 to 1";
      if (
        "alpha" in value &&
        (typeof value.alpha !== "number" || value.alpha < 0 || value.alpha > 1)
      )
        return "alpha from 0 to 1";
      if (typeof value.hex !== "string" || !/^#[0-9A-F]{6}$/.test(value.hex))
        return "hex is #RRGGBB, upper case";
      const want = bytesOf(value.hex).map((b) => round4(b / 255));
      if (c.join() !== want.join())
        return `components ${c.join(", ")} disagree with ${value.hex}: write ${want.join(", ")}`;
      return null;
    }
    case "dimension":
      return isObject(value) &&
        typeof value.value === "number" &&
        (value.unit === "px" || value.unit === "rem") &&
        Object.keys(value).length === 2
        ? null
        : "a dimension is { value, unit: px | rem }";
    case "duration":
      return isObject(value) &&
        typeof value.value === "number" &&
        (value.unit === "ms" || value.unit === "s")
        ? null
        : "a duration is { value, unit: ms | s }";
    case "cubicBezier":
      return Array.isArray(value) &&
        value.length === 4 &&
        value.every((n) => typeof n === "number") &&
        value[0] >= 0 &&
        value[0] <= 1 &&
        value[2] >= 0 &&
        value[2] <= 1
        ? null
        : "a cubic Bézier is four numbers, x1 and x2 from 0 to 1";
    case "fontFamily":
      return typeof value === "string" ||
        (Array.isArray(value) &&
          value.length > 0 &&
          value.every((s) => typeof s === "string" && s.length > 0))
        ? null
        : "a font family is a name or an array of names";
    case "fontWeight":
      return typeof value === "number" && value >= 1 && value <= 1000
        ? null
        : "a font weight is 1 to 1000";
    case "number":
      return typeof value === "number" ? null : "a number";
    default:
      return `no type ${String(type)} is used here`;
  }
}

describe("021 T1: the files declare 2025.10", () => {
  test("each token file's first key is $schema, the 2025.10 format", () => {
    for (const file of TOKEN_FILES) {
      expect(Object.keys(files[file])[0], file).toBe("$schema");
      expect(files[file].$schema, file).toBe(FORMAT);
    }
  });

  test("the resolver is 2025.10, with one modifier, scheme, defaulting to light", () => {
    expect(Object.keys(resolver)[0]).toBe("$schema");
    expect(resolver.$schema).toBe(RESOLVER);
    expect(resolver.version).toBe("2025.10");
    const modifiers = (resolver.modifiers ?? {}) as Json;
    expect(Object.keys(modifiers)).toEqual(["scheme"]);
    expect((modifiers.scheme as Json).default).toBe("light");
  });

  test("each THEMES value names a scheme context that lists its scheme file", () => {
    const contexts = ((resolver.modifiers as Json)?.scheme as Json)
      ?.contexts as Record<string, { $ref: string }[]> | undefined;
    expect(contexts).toBeDefined();
    for (const scheme of THEMES)
      expect(
        (contexts?.[scheme] ?? []).map((s) => s.$ref),
        scheme,
      ).toContain(SCHEME_FILE(scheme));
  });

  test("the base set lists the base file, and the order is base, then scheme", () => {
    const sets = (resolver.sets ?? {}) as Record<
      string,
      { sources: { $ref: string }[] }
    >;
    expect(sets.base?.sources.map((s) => s.$ref)).toEqual([BASE]);
    expect(resolver.resolutionOrder).toEqual([
      { $ref: "#/sets/base" },
      { $ref: "#/modifiers/scheme" },
    ]);
  });
});

describe("021 T2: every token conforms", () => {
  test("every name matches the format's pattern", () => {
    for (const file of TOKEN_FILES) {
      expect(Object.keys(files[file]).length, file).toBeGreaterThan(2);
      expect(badNames(files[file]), file).toEqual([]);
    }
  });

  test("every token has $value and its own $type; no group has $value or $type", () => {
    for (const file of TOKEN_FILES) {
      const { tokens, groups } = walk(files[file]);
      expect(tokens.length, file).toBeGreaterThan(0);
      for (const { path: p, token } of tokens)
        expect(typeof token.$type, `${file}: ${p}`).toBe("string");
      for (const { path: p, group } of groups) {
        expect("$value" in group, `${file}: ${p}`).toBe(false);
        expect("$type" in group, `${file}: ${p}`).toBe(false);
      }
    }
  });

  test("every value has its type's shape; each colour's components equal its hex bytes ÷ 255 at 4 decimals", () => {
    const faults: string[] = [];
    let n = 0;
    for (const file of TOKEN_FILES)
      for (const { path: p, token } of walk(files[file]).tokens) {
        n++;
        const fault = shapeFault(token.$type, token.$value);
        if (fault) faults.push(`${file}: ${p}: ${fault}`);
        const v = token.$value as Json;
        if (token.$type === "color" && isObject(v) && "alpha" in v) {
          const alpha = v.alpha as number;
          if (round4(Math.round(alpha * 255) / 255) !== alpha)
            faults.push(`${file}: ${p}: alpha ${alpha} is not a byte ÷ 255`);
        }
      }
    expect(faults).toEqual([]);
    expect(n).toBeGreaterThan(300);
  });

  test("no $ref in a token file; extension keys are only the vendor key", () => {
    for (const file of TOKEN_FILES) {
      const text = readFileSync(path.join(DIR, file), "utf8");
      expect(text.includes('"$ref"'), file).toBe(false);
      const keys = new Set<string>();
      const visit = (v: unknown) => {
        if (!isObject(v)) return;
        if (isObject(v.$extensions))
          for (const k of Object.keys(v.$extensions)) keys.add(k);
        for (const [k, inner] of Object.entries(v))
          if (k !== "$extensions") visit(inner);
      };
      visit(files[file]);
      expect([...keys], file).toEqual([VENDOR]);
    }
  });

  // 021 criterion 2: 48 primitives, 61 roles in each scheme, 16 code slots,
  // 8 field colours and 7 glass colours in each scheme, and the 4
  // expressive-mark colours in each scheme.
  test("holds 224 colours: 48 + 61 × 2 + 16 + 8 × 2 + 7 × 2 + 4 × 2", () => {
    const colours = (file: string, group: string) =>
      walk(files[file]).tokens.filter(
        (t) => t.token.$type === "color" && t.path.startsWith(`${group}.`),
      ).length;
    expect(colours(BASE, "primitive")).toBe(48);
    expect(colours(BASE, "code")).toBe(16);
    for (const scheme of THEMES) {
      const f = SCHEME_FILE(scheme);
      expect(colours(f, "role"), scheme).toBe(61);
      expect(colours(f, "field"), scheme).toBe(8);
      expect(colours(f, "glass"), scheme).toBe(7);
      expect(colours(f, "expressive-mark"), scheme).toBe(4);
    }
    const all = TOKEN_FILES.flatMap((f) =>
      walk(files[f]).tokens.filter((t) => t.token.$type === "color"),
    );
    expect(all).toHaveLength(48 + 61 * 2 + 16 + 8 * 2 + 7 * 2 + 4 * 2);
  });

  test("every role and code slot is an alias", () => {
    let n = 0;
    for (const { path: p, token } of walk(files[BASE]).tokens.filter((t) =>
      t.path.startsWith("code."),
    )) {
      n++;
      expect(aliasOf(token), p).toBeDefined();
    }
    for (const scheme of THEMES)
      for (const { path: p, token } of walk(
        files[SCHEME_FILE(scheme)],
      ).tokens.filter((t) => t.path.startsWith("role."))) {
        n++;
        expect(aliasOf(token), `${scheme}: ${p}`).toBeDefined();
      }
    expect(n).toBe(16 + 61 * 2);
  });

  // 021 decision 5 and criterion 3: no 2025.10 type carries em or vw, so each
  // is a number with its unit in the extension.
  test("exactly 18 tokens carry a unit extension: 13 em, 5 vw; no dimension is in another unit", () => {
    const units: Record<string, string[]> = {};
    for (const file of TOKEN_FILES)
      for (const { path: p, token } of walk(files[file]).tokens) {
        const unit = ((token.$extensions as Json)?.[VENDOR] as Json)?.unit;
        if (unit === undefined) continue;
        expect(token.$type, p).toBe("number");
        (units[unit as string] ??= []).push(p);
      }
    expect(Object.keys(units).sort()).toEqual(["em", "vw"]);
    expect(units.em).toHaveLength(13);
    expect(units.vw).toHaveLength(5);
    expect(units.em.sort()).toEqual(
      [
        "mark.dot",
        "mark.gap",
        "mark.rise",
        "mark.lockup-gap",
        "mark.orbit",
        "font.tracking.display",
        "font.tracking.section",
        "font.tracking.eyebrow",
        "font.tracking.mark",
        "expressive.display.display.tracking",
        "expressive.display.section.tracking",
        "expressive.display.proof.tracking",
        "expressive.display.poster.tracking",
      ].sort(),
    );
    expect(units.vw.sort()).toEqual(
      [
        "expressive.display.display.size.preferred",
        "expressive.display.section.size.preferred",
        "expressive.display.proof.size.preferred",
        "expressive.display.poster.size.preferred",
        "expressive.gutter.preferred",
      ].sort(),
    );
  });
});

describe("021 T3: aliases resolve", () => {
  test.each([...THEMES])(
    "%s: every alias resolves, to a token of its own type, with no cycle",
    (scheme) => {
      const tree = flatten(scheme);
      let aliases = 0;
      for (const { path: p, token } of walk(tree).tokens) {
        if (aliasOf(token) !== undefined) aliases++;
        const seen = new Set([p]);
        let at: Json | undefined = token;
        let target = aliasOf(token);
        while (target !== undefined) {
          expect(seen.has(target), `${p}: a cycle through ${target}`).toBe(
            false,
          );
          seen.add(target);
          at = lookup(tree, target);
          expect(at, `${p} → {${target}}`).toBeDefined();
          expect(at!.$type, `${p} → {${target}}`).toBe(token.$type);
          target = aliasOf(at!);
        }
      }
      expect(aliases).toBeGreaterThan(61 + 16);
    },
  );

  test.each([...THEMES])(
    "%s: roles alias primitives, code slots alias roles, elevation aliases ladder steps",
    (scheme) => {
      const tree = flatten(scheme);
      for (const { path: p, token } of walk(tree).tokens) {
        const target = aliasOf(token);
        if (p.startsWith("role."))
          expect(target, p).toMatch(/^primitive\.[^.]+$/);
        if (p.startsWith("code.")) expect(target, p).toMatch(/^role\.[^.]+$/);
        if (p === "elevation.y" || p === "elevation.blur")
          expect(target, p).toMatch(/^spacing\.ladder\.\d+$/);
      }
      expect(aliasOf(lookup(tree, "elevation.y") ?? {})).toBe(
        "spacing.ladder.3",
      );
      expect(aliasOf(lookup(tree, "elevation.blur") ?? {})).toBe(
        "spacing.ladder.8",
      );
    },
  );
});

describe("021 T4: the schemes match", () => {
  const scheme = (s: string) => walk(files[SCHEME_FILE(s)]).tokens;

  test("the light and dark files hold the same token paths in the same order", () => {
    const light = scheme("light").map((t) => t.path);
    expect(light.length).toBeGreaterThan(0);
    expect(scheme("dark").map((t) => t.path)).toEqual(light);
  });

  test("the base and scheme files share no top-level group", () => {
    const groups = (f: string) =>
      Object.keys(files[f]).filter((k) => !k.startsWith("$"));
    expect(groups(BASE)).toEqual([
      "primitive",
      "radius",
      "spacing",
      "font",
      "motion",
      "mark",
      "line",
      "focus",
      "elevation",
      "expressive",
      "code",
    ]);
    for (const s of THEMES) {
      expect(groups(SCHEME_FILE(s)), s).toEqual([
        "role",
        "field",
        "glass",
        "expressive-mark",
      ]);
    }
  });

  test("each role's $description is the same in both", () => {
    const words = (s: string) =>
      scheme(s)
        .filter((t) => t.path.startsWith("role."))
        .map((t) => [t.path, t.token.$description]);
    expect(words("light")).toHaveLength(61);
    expect(words("dark")).toEqual(words("light"));
  });

  test("each scheme file names its scheme in its root extension", () => {
    for (const s of THEMES)
      expect((files[SCHEME_FILE(s)].$extensions as Json)?.[VENDOR], s).toEqual({
        scheme: s,
        colorScheme: s,
      });
  });
});

describe("021 T5: roles and code are described", () => {
  const before = JSON.parse(
    readFileSync("tests/fixtures/021-before/words.json", "utf8"),
  ) as { roles: Record<string, string>; code: Record<string, string> };

  test("61 roles have a $description equal to the words the site held, verbatim", () => {
    for (const s of THEMES) {
      const roles = Object.fromEntries(
        walk(files[SCHEME_FILE(s)])
          .tokens.filter((t) => t.path.startsWith("role."))
          .map((t) => [t.path.slice("role.".length), t.token.$description]),
      );
      expect(Object.keys(roles), s).toHaveLength(61);
      expect(roles, s).toEqual(before.roles);
      for (const w of Object.values(roles)) expect(w).toMatch(/^[A-Z].*\.$/);
    }
  });

  test("16 code slots have a $description equal to the words the site held, verbatim", () => {
    const code = Object.fromEntries(
      walk(files[BASE])
        .tokens.filter((t) => t.path.startsWith("code."))
        .map((t) => [t.path.slice("code.".length), t.token.$description]),
    );
    expect(Object.keys(code)).toHaveLength(16);
    expect(code).toEqual(before.code);
    for (const w of Object.values(code)) expect(w).toMatch(/^[A-Z].*\.$/);
  });

  // 021 decision 9 and criteria 5 and 12: the words move into the files, and
  // the site's tables say what they said.
  test("words.ts is gone, and the tables read the same words from the files", async () => {
    expect(existsSync("src/lib/site/foundations/words.ts")).toBe(false);
    const { readTokens } = await import("../../scripts/tokens.ts");
    const { codeRows, tokenRows } =
      await import("../../src/lib/site/foundations/tables.ts");
    const tokens = readTokens();
    expect(
      Object.fromEntries(
        tokenRows(tokens)
          .filter((r) => r.kind === "role")
          .map((r) => [r.name, r.words]),
      ),
    ).toEqual(before.roles);
    expect(
      Object.fromEntries(codeRows(tokens).map((r) => [r.role, r.words])),
    ).toEqual(before.code);
  });
});

describe("021 T6: groups are described", () => {
  test("every file and every group has a non-empty $description", () => {
    for (const file of TOKEN_FILES) {
      expect(typeof files[file].$description, file).toBe("string");
      const { groups } = walk(files[file]);
      expect(groups.length, file).toBeGreaterThan(0);
      for (const { path: p, group } of groups) {
        expect(typeof group.$description, `${file}: ${p}`).toBe("string");
        expect((group.$description as string).length, p).toBeGreaterThan(0);
      }
    }
  });

  test("every number token with a unit extension names that unit in its $description", () => {
    let n = 0;
    for (const file of TOKEN_FILES)
      for (const { path: p, token } of walk(files[file]).tokens) {
        const unit = ((token.$extensions as Json)?.[VENDOR] as Json)?.unit as
          string | undefined;
        if (!unit) continue;
        n++;
        expect(token.$description, p).toMatch(new RegExp(`\\b${unit}\\b`));
      }
    expect(n).toBe(18);
  });
});
