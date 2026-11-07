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

/** A state tint on a ground that no item may draw (001 decision 8). */
export type ForbiddenRule = {
  theme: Theme;
  text: string;
  tint: string;
  over: string;
  alpha: number;
  why: string;
};

/** A forbidden pair with its measured ratio, which must stay below 4.5. */
export type Forbidden = ForbiddenRule & { ratio: number };

/**
 * 011 decision 11: the ban is kept as a rule. `measured` rows are its
 * witnesses, each recomputed and below 4.5; `ruleOnly` pairs are forbidden
 * whatever they measure.
 */
export type ForbiddenSet = { measured: Forbidden[]; ruleOnly: ForbiddenRule[] };

/** An elevated surface's edge against a ground under the scrim (002 decision 7). */
export type ScrimRow = {
  theme: Theme;
  edge: string;
  over: string;
  scrim: string;
  min: number;
};

/** 011 decision 11: a field's legend on its fill, as text and as a ring. */
export type FieldRow = { theme: Theme; field: string };

/**
 * 011 decision 11: a role's text on the glass's tint composited over a
 * ground: `background`, a field, or (light only) `foreground`.
 */
export type GlassRow = { theme: Theme; text: string; over: string };

/**
 * 012 decision 4: a role's text on the sticky bar's glass passing over the
 * hero's glass, which lies on the canvas or a field: the tint composited
 * twice over the ground. The bar's text is `foreground` or `primary`.
 */
export type GlassOverGlassRow = { theme: Theme; text: string; over: string };

/** 011 decision 6: a field's `[fill, legend]`, both primitives. */
export type FieldPair = [fill: string, legend: string];

/**
 * 011 decision 8: the glass in one theme. Each colour names a primitive or is
 * a hex literal; the shadow is the two layers' colours.
 */
export type GlassTheme = {
  tint: string;
  rim: string;
  edge: string;
  fallback: string;
  light: string;
  shadow: [string, string];
};

/** The four fields' names, in the mark's order. */
export const FIELDS = ["field-1", "field-2", "field-3", "field-4"] as const;

/** 009 decision 5: a fluid size, `clamp(min, vw, max)`, its ends in px. */
export type Fluid = { minPx: number; vw: number; maxPx: number };

/** 009 decision 5: a display step. The weight lives here, not in `type.weight`. */
export type DisplayStep = Fluid & {
  lineHeight: number;
  tracking: number;
  weight: number;
  tabular?: boolean;
};

/**
 * 009 decisions 3 to 7: expressive mode's values, every one emitted as a
 * runtime variable on `:root`. 012 decision 1 removes the stage, its light,
 * the stage radius and the veil's blur.
 */
export type Expressive = {
  display: {
    /** The family role whose string fills `--font-face-display`. */
    family: keyof Tokens["type"]["families"];
    /** 011 decision 9 adds `poster`, for launches only. */
    steps: Record<"display" | "section" | "proof" | "poster", DisplayStep>;
  };
  motion: {
    press: number;
    slide: number;
    busy: number;
    reveal: number;
    fill: number;
    easeStandard: [number, number, number, number];
    pressScale: number;
    /** 011 decision 10: the spring the dots dock on. */
    spring: { dampingRatio: number; settle: number; samples: number };
    /** 011 decision 8: how long the glass's rim stays lit after the pointer stops, in ms. */
    light: number;
  };
  size: { bar: number; action: number; actionSmall: number; track: number };
  gutter: Fluid;
  /** 011 decision 6: the four colour fields, per theme. */
  field: Record<Theme, Record<(typeof FIELDS)[number], FieldPair>>;
  /** 011 decision 8: the liquid glass. */
  glass: Record<Theme, GlassTheme> & { blur: number };
};

export type Tokens = {
  primitives: Record<string, string>;
  themes: Record<Theme, Record<string, string>>;
  /** 004 decision 5: the highlight slots, each naming a semantic colour. */
  code: Record<string, string>;
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
    /** 006 decision 4: the entrance's shares of the budget, unitless. */
    entranceDot: number;
    entranceStart: number;
    entranceStagger: number;
  };
  /** 006 decision 4: `orbit` is how far a dot travels before it docks, in em. */
  mark: {
    dot: number;
    gap: number;
    /** 011 decision 7: the lockup's mark, as a fraction of the word. */
    lockupScale: number;
    rise: number;
    lockupGap: number;
    orbit: number;
  };
  line: { width: number };
  focus: { width: number; offset: number };
  elevation: { y: number; blur: number };
  expressive: Expressive;
  contrast: {
    text: [string, string][];
    tints: TintPair[];
    nonText: [string, string][];
    exceptions: Exception[];
    forbidden: ForbiddenSet;
    scrim: ScrimRow[];
    field: FieldRow[];
    glass: GlassRow[];
    glassOverGlass: GlassOverGlassRow[];
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

/**
 * A tint alpha must be a whole number of tenths, so compositing stays exact
 * (001 decision 12).
 */
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
    "code",
    "radius",
    "spacing",
    "type",
    "motion",
    "mark",
    "line",
    "focus",
    "elevation",
    "expressive",
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

  // code: each slot names a semantic colour, never a primitive or a raw value,
  // so the theme switch carries through (004 decision 5).
  const code = object(root.code, "code");
  for (const [slot, value] of Object.entries(code)) {
    const key = `code.${slot}`;
    if (!NAME.test(slot)) throw new TokenError(key, "is not a lowercase name");
    const ref = string(value, key);
    if (!semantic.has(ref)) {
      throw new TokenError(
        key,
        `"${ref}" must name a semantic colour, never a primitive or a raw value`,
      );
    }
  }

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
  // 006 decision 4: each share is a fraction of the budget, and the last
  // dot's end (start + 3 staggers + one dot) must not pass it.
  for (const field of ["entranceDot", "entranceStart", "entranceStagger"]) {
    const n = positive(motion[field], `motion.${field}`);
    if (n >= 1)
      throw new TokenError(`motion.${field}`, "must be a fraction below 1");
  }
  const entranceEnd =
    (motion.entranceStart as number) +
    3 * (motion.entranceStagger as number) +
    (motion.entranceDot as number);
  if (entranceEnd > 1 + 1e-9)
    throw new TokenError(
      "motion.entranceDot",
      "the last dot ends past the entrance budget (start + 3 × stagger + dot > 1)",
    );

  const mark = object(root.mark, "mark");
  for (const field of [
    "dot",
    "gap",
    "lockupScale",
    "rise",
    "lockupGap",
    "orbit",
  ])
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

  validateExpressive(root.expressive, primitives, families);

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
  const forbidden = object(contrast.forbidden, "contrast.forbidden");
  for (const part of ["measured", "ruleOnly"] as const) {
    array(forbidden[part], `contrast.forbidden.${part}`).forEach((value, i) => {
      const key = `contrast.forbidden.${part}[${i}]`;
      const row = object(value, key);
      theme(row.theme, `${key}.theme`);
      for (const field of ["text", "tint", "over"])
        semanticName(row[field], `${key}.${field}`);
      tenths(row.alpha, `${key}.alpha`);
      if (part === "measured") positive(row.ratio, `${key}.ratio`);
      else if ("ratio" in row)
        throw new TokenError(`${key}.ratio`, "a rule-only pair holds no ratio");
      string(row.why, `${key}.why`);
    });
  }
  array(contrast.scrim, "contrast.scrim").forEach((value, i) => {
    const key = `contrast.scrim[${i}]`;
    const row = object(value, key);
    theme(row.theme, `${key}.theme`);
    for (const field of ["edge", "over", "scrim"])
      semanticName(row[field], `${key}.${field}`);
    positive(row.min, `${key}.min`);
  });

  // 011 decision 11: the field set names a field; the glass set a role's text
  // over the canvas, a field or (light only) the foreground.
  array(contrast.field, "contrast.field").forEach((value, i) => {
    const key = `contrast.field[${i}]`;
    const row = object(value, key);
    theme(row.theme, `${key}.theme`);
    if (!(FIELDS as readonly Json[]).includes(row.field))
      throw new TokenError(`${key}.field`, "must name field-1 to field-4");
  });
  array(contrast.glass, "contrast.glass").forEach((value, i) => {
    const key = `contrast.glass[${i}]`;
    const row = object(value, key);
    const t = theme(row.theme, `${key}.theme`);
    if (
      !["foreground", "muted-foreground", "primary"].includes(
        row.text as string,
      )
    )
      throw new TokenError(
        `${key}.text`,
        "must be foreground, muted-foreground or primary",
      );
    const grounds: Json[] = ["background", ...FIELDS];
    if (t === "light") grounds.push("foreground");
    if (!grounds.includes(row.over))
      throw new TokenError(
        `${key}.over`,
        "must be background, a field, or (light only) foreground",
      );
  });

  // 012 decision 4: the bar's text, foreground or primary, on its glass over
  // the hero's glass over the canvas or a field.
  array(contrast.glassOverGlass, "contrast.glassOverGlass").forEach(
    (value, i) => {
      const key = `contrast.glassOverGlass[${i}]`;
      const row = object(value, key);
      theme(row.theme, `${key}.theme`);
      if (!["foreground", "primary"].includes(row.text as string))
        throw new TokenError(`${key}.text`, "must be foreground or primary");
      if (!(["background", ...FIELDS] as Json[]).includes(row.over))
        throw new TokenError(`${key}.over`, "must be background or a field");
    },
  );

  return root as unknown as Tokens;
}

/** A fluid size: positive ends, the minimum below the maximum. */
function fluid(value: Json, key: string): Record<string, Json> {
  const entry = object(value, key);
  const min = positive(entry.minPx, `${key}.minPx`);
  positive(entry.vw, `${key}.vw`);
  const max = positive(entry.maxPx, `${key}.maxPx`);
  if (min >= max) throw new TokenError(key, "minPx must be below maxPx");
  return entry;
}

/**
 * 009 decisions 5 to 7 and 011's brand: the `expressive` group. Its display
 * face names a family role, not a font of its own (review finding 5).
 */
function validateExpressive(
  value: Json,
  primitives: Record<string, Json>,
  families: Record<string, Json>,
): void {
  const group = object(value, "expressive");

  const display = object(group.display, "expressive.display");
  const family = string(display.family, "expressive.display.family");
  if (!(family in families))
    throw new TokenError(
      "expressive.display.family",
      `"${family}" must name a role of type.families`,
    );
  const steps = object(display.steps, "expressive.display.steps");
  for (const step of ["display", "section", "proof", "poster"]) {
    const key = `expressive.display.steps.${step}`;
    const entry = fluid(steps[step], key);
    positive(entry.lineHeight, `${key}.lineHeight`);
    number(entry.tracking, `${key}.tracking`);
    positive(entry.weight, `${key}.weight`);
    if ("tabular" in entry && typeof entry.tabular !== "boolean")
      throw new TokenError(`${key}.tabular`, "must be true or false");
  }

  const motion = object(group.motion, "expressive.motion");
  for (const field of ["press", "slide", "busy", "reveal", "fill"])
    positive(motion[field], `expressive.motion.${field}`);
  const ease = array(motion.easeStandard, "expressive.motion.easeStandard");
  if (ease.length !== 4)
    throw new TokenError(
      "expressive.motion.easeStandard",
      "must hold 4 numbers",
    );
  ease.forEach((n, i) => number(n, `expressive.motion.easeStandard[${i}]`));
  const scale = positive(motion.pressScale, "expressive.motion.pressScale");
  if (scale > 1)
    throw new TokenError("expressive.motion.pressScale", "must be 1 or less");
  // 011 decision 10: an underdamped spring, settling within a fraction.
  const spring = object(motion.spring, "expressive.motion.spring");
  for (const field of ["dampingRatio", "settle"]) {
    const n = positive(spring[field], `expressive.motion.spring.${field}`);
    if (n >= 1)
      throw new TokenError(
        `expressive.motion.spring.${field}`,
        "must be a fraction below 1",
      );
  }
  const samples = positive(spring.samples, "expressive.motion.spring.samples");
  if (!Number.isInteger(samples))
    throw new TokenError(
      "expressive.motion.spring.samples",
      "must be a whole number",
    );
  positive(motion.light, "expressive.motion.light");

  const size = object(group.size, "expressive.size");
  for (const field of ["bar", "action", "actionSmall", "track"])
    positive(size[field], `expressive.size.${field}`);
  fluid(group.gutter, "expressive.gutter");
  validateField(group.field, primitives);
  validateGlass(group.glass, primitives);
}

/** 011 decision 6: per theme, exactly the four fields, each a [fill, legend] of primitives. */
function validateField(value: Json, primitives: Record<string, Json>): void {
  const field = object(value, "expressive.field");
  for (const t of THEMES) {
    const map = object(field[t], `expressive.field.${t}`);
    if (Object.keys(map).sort().join() !== [...FIELDS].join())
      throw new TokenError(
        `expressive.field.${t}`,
        "must hold field-1 to field-4, and nothing else",
      );
    for (const name of FIELDS) {
      const key = `expressive.field.${t}.${name}`;
      const pair = array(map[name], key);
      if (
        pair.length !== 2 ||
        !pair.every((p) => typeof p === "string" && p in primitives)
      )
        throw new TokenError(
          key,
          "must be a [fill, legend] pair of primitives",
        );
    }
  }
}

/**
 * 011 decision 8: the glass's colours per theme and its blur. Frost only: the
 * lens is removed (decisions.md, 2026-11-07).
 */
function validateGlass(value: Json, primitives: Record<string, Json>): void {
  const glass = object(value, "expressive.glass");
  const colour = (v: Json, key: string) => {
    const ref = string(v, key);
    if (!(ref in primitives) && !HEX.test(ref))
      throw new TokenError(
        key,
        `"${ref}" must name a primitive or be #RRGGBB or #RRGGBBAA`,
      );
  };
  for (const t of THEMES) {
    const own = object(glass[t], `expressive.glass.${t}`);
    for (const field of ["tint", "rim", "edge", "fallback", "light"])
      colour(own[field], `expressive.glass.${t}.${field}`);
    const shadow = array(own.shadow, `expressive.glass.${t}.shadow`);
    if (shadow.length !== 2)
      throw new TokenError(
        `expressive.glass.${t}.shadow`,
        "must hold two colours",
      );
    shadow.forEach((c, i) => colour(c, `expressive.glass.${t}.shadow[${i}]`));
  }
  positive(glass.blur, "expressive.glass.blur");
}

/** The hex an `expressive` colour takes: its primitive's, or its own literal. */
export function resolveExpressive(tokens: Tokens, value: string): string {
  return tokens.primitives[value] ?? value;
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
