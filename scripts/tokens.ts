/**
 * The token file: its shape, its validation, and reading it from disk.
 *
 * `validateTokens` is pure. It checks the file by hand and throws a
 * `TokenError` that names the key at fault. `readTokens` reads the file and
 * validates it. Scripts, tests and the preview's server loads all use these.
 */
import { readFileSync } from "node:fs";
import path from "node:path";

export const TOKENS_PATH = "tokens/pluto.tokens.json";
export const THEMES = ["light", "dark"] as const;
export type Theme = (typeof THEMES)[number];

export type Family = {
  variable: string;
  family: string;
  package: string;
  item: string;
  import: string;
  selector?: string;
};

export type TintPair = {
  text: string;
  tint: string;
  over: string;
  alpha: Record<Theme, number>;
};

export type Exception = { theme: Theme; pair: [string, string]; why: string };

export type Forbidden = {
  theme: Theme;
  text: string;
  tint: string;
  over: string;
  alpha: number;
  ratio: number;
  why: string;
};

/** An elevated surface's edge against a ground under the scrim (002 decision 7). */
export type ScrimRow = {
  theme: Theme;
  edge: string;
  over: string;
  scrim: string;
  min: number;
};

export type Tokens = {
  primitives: Record<string, string>;
  themes: Record<Theme, Record<string, string>>;
  radius: { case: number };
  spacing: { atom: number; ladder: number[] };
  type: {
    families: Record<"sans" | "heading" | "mono", Family>;
    scale: Record<string, { px: number; lineHeight: number }>;
    tracking: Record<string, number>;
    weight: Record<string, number>;
    leading: Record<string, number>;
  };
  motion: {
    entranceMs: number;
    microMs: number;
    easeEntrance: [number, number, number, number];
  };
  mark: { dot: number; gap: number; rise: number; lockupGap: number };
  line: { width: number };
  focus: { width: number; offset: number };
  elevation: { y: number; blur: number };
  contrast: {
    text: [string, string][];
    tints: TintPair[];
    nonText: [string, string][];
    exceptions: Exception[];
    forbidden: Forbidden[];
    scrim: ScrimRow[];
  };
};

export class TokenError extends Error {
  constructor(key: string, problem: string) {
    super(`tokens: ${key}: ${problem}`);
    this.name = "TokenError";
  }
}

const HEX = /^#(?:[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/;
const NAME = /^[a-z][a-z0-9-]*$/;

type Json = unknown;

function isObject(value: Json): value is Record<string, Json> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function object(value: Json, key: string): Record<string, Json> {
  if (!isObject(value)) throw new TokenError(key, "must be an object");
  return value;
}

function number(value: Json, key: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new TokenError(key, "must be a number");
  }
  return value;
}

function positive(value: Json, key: string): number {
  const n = number(value, key);
  if (n <= 0) throw new TokenError(key, "must be greater than 0");
  return n;
}

function string(value: Json, key: string): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new TokenError(key, "must be a non-empty string");
  }
  return value;
}

function array(value: Json, key: string): Json[] {
  if (!Array.isArray(value)) throw new TokenError(key, "must be an array");
  return value;
}

function theme(value: Json, key: string): Theme {
  if (value !== "light" && value !== "dark")
    throw new TokenError(key, 'must be "light" or "dark"');
  return value;
}

/** A tint alpha must be a whole number of tenths, so compositing stays exact (decision 12). */
function tenths(value: Json, key: string): number {
  const n = positive(value, key);
  const k = n * 10;
  if (n >= 1 || Math.abs(k - Math.round(k)) > 1e-9) {
    throw new TokenError(key, "must be a whole number of tenths below 1");
  }
  return n;
}

/** Validates the token file by hand. Throws a `TokenError` naming the key at fault. */
export function validateTokens(raw: unknown): Tokens {
  const root = object(raw, "(root)");
  for (const key of [
    "primitives",
    "themes",
    "radius",
    "spacing",
    "type",
    "motion",
    "mark",
    "line",
    "focus",
    "elevation",
    "contrast",
  ]) {
    if (!(key in root)) throw new TokenError(key, "is missing");
  }

  // primitives: named hex colours, each hex once.
  const primitives = object(root.primitives, "primitives");
  const seen = new Map<string, string>();
  for (const [name, value] of Object.entries(primitives)) {
    const key = `primitives.${name}`;
    if (!NAME.test(name)) throw new TokenError(key, "is not a lowercase name");
    const hex = string(value, key);
    if (!HEX.test(hex))
      throw new TokenError(key, `"${hex}" is not #RRGGBB or #RRGGBBAA`);
    const upper = hex.toUpperCase();
    if (seen.has(upper))
      throw new TokenError(
        key,
        `repeats the hex of primitives.${seen.get(upper)}`,
      );
    seen.set(upper, name);
  }

  // themes: the same semantic names in each, each naming a primitive.
  const themes = object(root.themes, "themes");
  let names: string[] | undefined;
  for (const t of THEMES) {
    const map = object(themes[t], `themes.${t}`);
    for (const [name, value] of Object.entries(map)) {
      const key = `themes.${t}.${name}`;
      if (!NAME.test(name))
        throw new TokenError(key, "is not a lowercase name");
      const ref = string(value, key);
      if (!(ref in primitives)) {
        throw new TokenError(
          key,
          `"${ref}" must name a primitive, never a raw value`,
        );
      }
    }
    const keys = Object.keys(map).sort();
    if (names && keys.join() !== names.join()) {
      throw new TokenError(
        `themes.${t}`,
        "must hold the same names as themes.light",
      );
    }
    names = keys;
  }
  const semantic = new Set(names);

  const radius = object(root.radius, "radius");
  positive(radius.case, "radius.case");

  const spacing = object(root.spacing, "spacing");
  const atom = positive(spacing.atom, "spacing.atom");
  array(spacing.ladder, "spacing.ladder").forEach((step, i) => {
    const key = `spacing.ladder[${i}]`;
    const n = positive(step, key);
    if (!Number.isInteger(n / atom))
      throw new TokenError(key, "must be a multiple of the atom");
  });

  const type = object(root.type, "type");
  const families = object(type.families, "type.families");
  for (const role of ["sans", "heading", "mono"]) {
    const family = object(families[role], `type.families.${role}`);
    for (const field of ["variable", "family", "package", "item", "import"]) {
      string(family[field], `type.families.${role}.${field}`);
    }
    if (!String(family.variable).startsWith("--font-")) {
      throw new TokenError(
        `type.families.${role}.variable`,
        "must start with --font-",
      );
    }
    if ("selector" in family)
      string(family.selector, `type.families.${role}.selector`);
  }
  const scale = object(type.scale, "type.scale");
  for (const [step, value] of Object.entries(scale)) {
    const entry = object(value, `type.scale.${step}`);
    positive(entry.px, `type.scale.${step}.px`);
    positive(entry.lineHeight, `type.scale.${step}.lineHeight`);
  }
  for (const group of ["tracking", "weight", "leading"]) {
    const map = object(type[group], `type.${group}`);
    for (const [name, value] of Object.entries(map))
      number(value, `type.${group}.${name}`);
  }

  const motion = object(root.motion, "motion");
  positive(motion.entranceMs, "motion.entranceMs");
  positive(motion.microMs, "motion.microMs");
  const ease = array(motion.easeEntrance, "motion.easeEntrance");
  if (ease.length !== 4)
    throw new TokenError("motion.easeEntrance", "must hold 4 numbers");
  ease.forEach((n, i) => number(n, `motion.easeEntrance[${i}]`));

  const mark = object(root.mark, "mark");
  for (const field of ["dot", "gap", "rise", "lockupGap"])
    positive(mark[field], `mark.${field}`);

  positive(object(root.line, "line").width, "line.width");
  const focus = object(root.focus, "focus");
  positive(focus.width, "focus.width");
  number(focus.offset, "focus.offset");

  // elevation: the shadow's offset and blur, each a ladder step (002 decision 7).
  const ladder = new Set(spacing.ladder as number[]);
  const elevation = object(root.elevation, "elevation");
  for (const field of ["y", "blur"]) {
    const n = positive(elevation[field], `elevation.${field}`);
    if (!ladder.has(n))
      throw new TokenError(`elevation.${field}`, "must be a ladder step");
  }

  // contrast: every name it uses must be a semantic token.
  const contrast = object(root.contrast, "contrast");
  const semanticName = (value: Json, key: string) => {
    const name = string(value, key);
    if (!semantic.has(name))
      throw new TokenError(key, `"${name}" is not a semantic token`);
  };
  const pairs = (value: Json, key: string) =>
    array(value, key).forEach((pair, i) => {
      const p = array(pair, `${key}[${i}]`);
      if (p.length !== 2)
        throw new TokenError(`${key}[${i}]`, "must be a pair");
      semanticName(p[0], `${key}[${i}][0]`);
      semanticName(p[1], `${key}[${i}][1]`);
    });
  pairs(contrast.text, "contrast.text");
  pairs(contrast.nonText, "contrast.nonText");
  array(contrast.tints, "contrast.tints").forEach((value, i) => {
    const key = `contrast.tints[${i}]`;
    const tint = object(value, key);
    for (const field of ["text", "tint", "over"])
      semanticName(tint[field], `${key}.${field}`);
    const alpha = object(tint.alpha, `${key}.alpha`);
    for (const t of THEMES) tenths(alpha[t], `${key}.alpha.${t}`);
  });
  array(contrast.exceptions, "contrast.exceptions").forEach((value, i) => {
    const key = `contrast.exceptions[${i}]`;
    const exception = object(value, key);
    theme(exception.theme, `${key}.theme`);
    pairs([exception.pair], `${key}.pair`);
    string(exception.why, `${key}.why`);
  });
  array(contrast.forbidden, "contrast.forbidden").forEach((value, i) => {
    const key = `contrast.forbidden[${i}]`;
    const forbidden = object(value, key);
    theme(forbidden.theme, `${key}.theme`);
    for (const field of ["text", "tint", "over"])
      semanticName(forbidden[field], `${key}.${field}`);
    tenths(forbidden.alpha, `${key}.alpha`);
    positive(forbidden.ratio, `${key}.ratio`);
    string(forbidden.why, `${key}.why`);
  });
  array(contrast.scrim, "contrast.scrim").forEach((value, i) => {
    const key = `contrast.scrim[${i}]`;
    const row = object(value, key);
    theme(row.theme, `${key}.theme`);
    for (const field of ["edge", "over", "scrim"])
      semanticName(row[field], `${key}.${field}`);
    positive(row.min, `${key}.min`);
  });

  return root as unknown as Tokens;
}

/** Reads and validates the token file. Relative paths resolve against the working directory. */
export function readTokens(file: string = TOKENS_PATH): Tokens {
  const text = readFileSync(path.resolve(file), "utf8");
  return validateTokens(JSON.parse(text));
}

/** The hex a semantic token takes in a theme. */
export function resolveColor(
  tokens: Tokens,
  theme: Theme,
  name: string,
): string {
  const primitive = tokens.themes[theme][name];
  if (primitive === undefined)
    throw new TokenError(`themes.${theme}.${name}`, "is not defined");
  return tokens.primitives[primitive];
}
