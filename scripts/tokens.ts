/**
 * The tokens: their files, their validation, and the lowering that reads them.
 *
 * The source is DTCG 2025.10 (021): a resolver, `tokens/kuiper.resolver.json`,
 * combines a base file with one file per scheme; the contrast rules sit in a
 * file of Kuiper's own. `lowerTokens` is pure: it validates the parsed files
 * and lowers them to the `Tokens` object the build has always read, throwing
 * a `TokenError` that names the file and the token path at fault.
 * `readTokens` reads the files under a root and lowers them. Scripts, tests
 * and the site's server loads all use these.
 */
import { readFileSync } from "node:fs";
import path from "node:path";

/** The base file. `src/app.css`'s first line names it. */
export const TOKENS_PATH = "tokens/kuiper.tokens.json";
export const TOKENS_DIR = "tokens";
export const RESOLVER_FILE = "kuiper.resolver.json";
export const BASE_FILE = "kuiper.tokens.json";
export const CONTRAST_FILE = "kuiper.contrast.json";
export const REMOVED_FILE = "kuiper.removed.json";
export const RESOLVER_PATH = `${TOKENS_DIR}/${RESOLVER_FILE}`;
export const CONTRAST_PATH = `${TOKENS_DIR}/${CONTRAST_FILE}`;
export const REMOVED_PATH = `${TOKENS_DIR}/${REMOVED_FILE}`;
/** Each scheme's own file, as the resolver names it. */
export const SCHEME_FILES = {
  light: "kuiper.light.tokens.json",
  dark: "kuiper.dark.tokens.json",
} as const;
export const LIGHT_PATH = `${TOKENS_DIR}/${SCHEME_FILES.light}`;
export const DARK_PATH = `${TOKENS_DIR}/${SCHEME_FILES.dark}`;

/** 021 decision 4: the one key Kuiper's extension data sits under. Permanent once shipped. */
export const VENDOR = "co.plutosystems.kuiper";
export const FORMAT_SCHEMA =
  "https://www.designtokens.org/schemas/2025.10/format.json";
export const RESOLVER_SCHEMA =
  "https://www.designtokens.org/schemas/2025.10/resolver.json";

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
  /** 021 decision 9: each role's and each code slot's job, its $description. */
  descriptions: { roles: Record<string, string>; code: Record<string, string> };
  /** 021 decision 6: the primitives the dark expressive mark aliases, in the mark's order. */
  expressiveDarkMarks: string[];
};

export class TokenError extends Error {
  constructor(key: string, problem: string) {
    super(`tokens: ${key}: ${problem}`);
    this.name = "TokenError";
  }
}

/** The parsed files, by name in `tokens/`: the resolver, the files it names, and the contrast rules. */
export type TokenFiles = Record<string, unknown>;

type Json = unknown;
type Node = Record<string, Json>;

function isObject(value: Json): value is Node {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** 021 decision 12: a name may not start with `$`, `{` or `}`, nor hold `{`, `}` or `.`. */
const NAME = /^[^${}.][^{}.]*$/;
/** Today's rule for a primitive's, a role's and a code slot's name. */
const LOWER = /^[a-z][a-z0-9-]*$/;
/** Upper case, six digits: what registry.json's cssVars carry (decision 12). */
const HEX6 = /^#[0-9A-F]{6}$/;
const ALIAS = /^\{([^{}]+)\}$/;
const SEMVER = /^\d+\.\d+\.\d+$/;
const TYPES = new Set([
  "color",
  "dimension",
  "duration",
  "cubicBezier",
  "fontFamily",
  "fontWeight",
  "number",
]);
const TOKEN_KEYS = new Set([
  "$type",
  "$value",
  "$description",
  "$extensions",
  "$deprecated",
]);
const GROUP_KEYS = new Set(["$description", "$extensions", "$deprecated"]);

const round4 = (n: number) => Math.round(n * 10000) / 10000;
const byte = (hex: string, i: number) =>
  parseInt(hex.slice(1 + 2 * i, 3 + 2 * i), 16);

/** A colour value's fault, or null. Components equal the hex bytes ÷ 255 at 4 decimals. */
function colourFault(value: Json): string | null {
  if (!isObject(value)) return "a colour is an object or an alias";
  for (const key of Object.keys(value))
    if (!["colorSpace", "components", "alpha", "hex"].includes(key))
      return `a colour holds no "${key}"`;
  if (value.colorSpace !== "srgb") return 'its colorSpace must be "srgb"';
  const c = value.components;
  if (
    !Array.isArray(c) ||
    c.length !== 3 ||
    !c.every((n) => typeof n === "number" && n >= 0 && n <= 1)
  )
    return "its components must be three numbers from 0 to 1";
  if (
    "alpha" in value &&
    (typeof value.alpha !== "number" || value.alpha < 0 || value.alpha > 1)
  )
    return "its alpha must be a number from 0 to 1";
  // Decision 5: alpha is written only when the colour is translucent. An
  // alpha of 1 would lower to an `FF` suffix and change the CSS.
  if ("alpha" in value && value.alpha === 1)
    return "its alpha must be below 1; leave it out for an opaque colour";
  if (typeof value.hex !== "string" || !HEX6.test(value.hex))
    return `its hex ${JSON.stringify(value.hex)} must be #RRGGBB, six digits in upper case`;
  const want = [0, 1, 2].map((i) => round4(byte(value.hex as string, i) / 255));
  if (c.join() !== want.join())
    return `its components [${c.join(", ")}] disagree with ${value.hex}; write [${want.join(", ")}]`;
  if ("alpha" in value) {
    const a = value.alpha as number;
    if (round4(Math.round(a * 255) / 255) !== a)
      return `its alpha ${a} is not a byte ÷ 255 at 4 decimals; write ${round4(Math.round(a * 255) / 255)}`;
  }
  return null;
}

/** A value's fault for its `$type`, or null. An alias is checked when it resolves. */
function shapeFault(type: string, value: Json): string | null {
  if (typeof value === "string" && ALIAS.test(value)) return null;
  switch (type) {
    case "color":
      return colourFault(value);
    case "dimension":
      return isObject(value) &&
        Object.keys(value).length === 2 &&
        typeof value.value === "number" &&
        Number.isFinite(value.value) &&
        (value.unit === "px" || value.unit === "rem")
        ? null
        : "a dimension is { value, unit }, its unit px or rem";
    case "duration":
      return isObject(value) &&
        Object.keys(value).length === 2 &&
        typeof value.value === "number" &&
        value.value >= 0 &&
        (value.unit === "ms" || value.unit === "s")
        ? null
        : "a duration is { value, unit }, its unit ms or s";
    case "cubicBezier":
      return Array.isArray(value) &&
        value.length === 4 &&
        value.every((n) => typeof n === "number" && Number.isFinite(n)) &&
        value[0] >= 0 &&
        value[0] <= 1 &&
        value[2] >= 0 &&
        value[2] <= 1
        ? null
        : "a cubic Bézier is four numbers, x1 and x2 from 0 to 1";
    case "fontFamily":
      return (typeof value === "string" && value.length > 0) ||
        (Array.isArray(value) &&
          value.length > 0 &&
          value.every((s) => typeof s === "string" && s.length > 0))
        ? null
        : "a font family is a name, or an array of names";
    case "fontWeight":
      return typeof value === "number" && value >= 1 && value <= 1000
        ? null
        : "a font weight is a number from 1 to 1000";
    case "number":
      return typeof value === "number" && Number.isFinite(value)
        ? null
        : "a number";
    default:
      return `no token here has the type "${type}"`;
  }
}

/** The vendor data of a token or a group: only the vendor key, each field its shape. */
function vendorOf(node: Node, at: string, type?: string): Node {
  if (!("$extensions" in node)) return {};
  const ext = node.$extensions;
  if (!isObject(ext)) throw new TokenError(at, "$extensions must be an object");
  for (const key of Object.keys(ext))
    if (key !== VENDOR)
      throw new TokenError(
        at,
        `$extensions holds "${key}"; Kuiper's data sits under "${VENDOR}" only`,
      );
  const own = ext[VENDOR];
  if (own === undefined) return {};
  if (!isObject(own))
    throw new TokenError(at, `$extensions["${VENDOR}"] must be an object`);
  if ("since" in own && !SEMVER.test(String(own.since)))
    throw new TokenError(at, "since must be a version, such as 0.13.0");
  if ("cssVariable" in own && !/^--[a-z0-9-]+$/.test(String(own.cssVariable)))
    throw new TokenError(at, "cssVariable must be a custom property's name");
  if ("unit" in own) {
    // 021 decision 5: no 2025.10 type carries em or vw.
    if (own.unit !== "em" && own.unit !== "vw")
      throw new TokenError(at, 'unit must be "em" or "vw"');
    if (type !== "number")
      throw new TokenError(at, "a unit in the extension is for a number");
  }
  return own;
}

type Located = { file: string; path: string; token: Node };

/**
 * 021 decision 12: the format's rules for one file. Names, `$`-properties,
 * each token's own `$type` and its value's shape, and the vendor key alone.
 * Returns the file's tokens in order.
 */
function checkFile(file: string, raw: Json): Located[] {
  if (!isObject(raw)) throw new TokenError(file, "must be a JSON object");
  if (Object.keys(raw)[0] !== "$schema" || raw.$schema !== FORMAT_SCHEMA)
    throw new TokenError(
      file,
      `its first key must be "$schema": "${FORMAT_SCHEMA}"`,
    );
  const out: Located[] = [];
  const walk = (node: Node, at: string[], root: boolean) => {
    const where = at.length ? `${file}: ${at.join(".")}` : file;
    for (const [key, value] of Object.entries(node)) {
      if (key.startsWith("$")) {
        if (root && key === "$schema") continue;
        if (key === "$type")
          throw new TokenError(
            where,
            "a group sets no $type; each token states its own",
          );
        if (!GROUP_KEYS.has(key))
          throw new TokenError(
            where,
            `holds "${key}", which this file uses nowhere`,
          );
        if (key === "$description" && (typeof value !== "string" || !value))
          throw new TokenError(where, "$description must be words");
        if (
          key === "$deprecated" &&
          typeof value !== "boolean" &&
          typeof value !== "string"
        )
          throw new TokenError(
            where,
            "$deprecated must be true, false or words",
          );
        continue;
      }
      const p = [...at, key];
      const here = `${file}: ${p.join(".")}`;
      if (!NAME.test(key))
        throw new TokenError(here, "is not a name the format allows");
      if (!isObject(value))
        throw new TokenError(here, "must be a token or a group");
      if ("$value" in value) {
        for (const k of Object.keys(value))
          if (!TOKEN_KEYS.has(k))
            throw new TokenError(here, `a token holds no "${k}"`);
        const type = value.$type;
        if (typeof type !== "string" || !TYPES.has(type))
          throw new TokenError(
            here,
            `must state its own $type, one of ${[...TYPES].join(", ")}`,
          );
        const fault = shapeFault(type, value.$value);
        if (fault) throw new TokenError(here, fault);
        if (
          "$description" in value &&
          (typeof value.$description !== "string" || !value.$description)
        )
          throw new TokenError(here, "$description must be words");
        if (
          "$deprecated" in value &&
          typeof value.$deprecated !== "boolean" &&
          typeof value.$deprecated !== "string"
        )
          throw new TokenError(
            here,
            "$deprecated must be true, false or words",
          );
        vendorOf(value, here, type);
        out.push({ file, path: p.join("."), token: value });
      } else {
        if (typeof value.$description !== "string" || !value.$description)
          throw new TokenError(
            here,
            "a group must say what it holds, in $description",
          );
        vendorOf(value, here);
        walk(value, p, false);
      }
    }
  };
  if (typeof raw.$description !== "string" || !raw.$description)
    throw new TokenError(file, "must say what it holds, in $description");
  vendorOf(raw, file);
  walk(raw, [], true);
  return out;
}

/** A resolver's `{ "$ref": file }` list, checked. */
function refs(value: Json, at: string): string[] {
  if (!Array.isArray(value) || value.length === 0)
    throw new TokenError(at, 'must list sources, each { "$ref": file }');
  return value.map((source, i) => {
    if (
      !isObject(source) ||
      typeof source.$ref !== "string" ||
      Object.keys(source).length !== 1
    )
      throw new TokenError(`${at}[${i}]`, 'must be { "$ref": file }');
    return source.$ref;
  });
}

/** 021 decision 7: the resolver's shape, and the files each scheme context reads, in order. */
function contextFiles(resolver: Json): Record<Theme, string[]> {
  const at = RESOLVER_FILE;
  if (!isObject(resolver)) throw new TokenError(at, "must be a JSON object");
  if (
    Object.keys(resolver)[0] !== "$schema" ||
    resolver.$schema !== RESOLVER_SCHEMA
  )
    throw new TokenError(
      at,
      `its first key must be "$schema": "${RESOLVER_SCHEMA}"`,
    );
  if (resolver.version !== "2025.10")
    throw new TokenError(`${at}: version`, 'must be "2025.10"');
  const sets = resolver.sets;
  const modifiers = resolver.modifiers;
  if (!isObject(sets)) throw new TokenError(`${at}: sets`, "must be an object");
  if (!isObject(modifiers))
    throw new TokenError(`${at}: modifiers`, "must be an object");
  const scheme = modifiers.scheme;
  if (!isObject(scheme) || !isObject(scheme.contexts))
    throw new TokenError(`${at}: modifiers.scheme`, "must hold contexts");
  for (const t of THEMES)
    if (!(t in scheme.contexts))
      throw new TokenError(
        `${at}: modifiers.scheme.contexts`,
        `must hold a "${t}" context`,
      );
  if (
    typeof scheme.default !== "string" ||
    !(scheme.default in scheme.contexts)
  )
    throw new TokenError(
      `${at}: modifiers.scheme.default`,
      "must name a context",
    );
  const order = resolver.resolutionOrder;
  if (!Array.isArray(order) || order.length === 0)
    throw new TokenError(
      `${at}: resolutionOrder`,
      "must list sets and modifiers",
    );
  const out = {} as Record<Theme, string[]>;
  for (const t of THEMES) {
    const files: string[] = [];
    order.forEach((step, i) => {
      const ref = isObject(step) ? step.$ref : undefined;
      const m =
        typeof ref === "string"
          ? /^#\/(sets|modifiers)\/([^/]+)$/.exec(ref)
          : null;
      if (!m)
        throw new TokenError(
          `${at}: resolutionOrder[${i}]`,
          'must be { "$ref": "#/sets/<name>" } or a modifier',
        );
      if (m[1] === "sets") {
        const set = sets[m[2]];
        if (!isObject(set))
          throw new TokenError(
            `${at}: resolutionOrder[${i}]`,
            `names no set "${m[2]}"`,
          );
        files.push(...refs(set.sources, `${at}: sets.${m[2]}.sources`));
      } else {
        const modifier = modifiers[m[2]];
        if (!isObject(modifier) || !isObject(modifier.contexts))
          throw new TokenError(
            `${at}: resolutionOrder[${i}]`,
            `names no modifier "${m[2]}"`,
          );
        const context = m[2] === "scheme" ? t : String(modifier.default);
        files.push(
          ...refs(
            modifier.contexts[context],
            `${at}: modifiers.${m[2]}.contexts.${context}`,
          ),
        );
      }
    });
    out[t] = files;
  }
  return out;
}

/** Every file the resolver names, in first-seen order. */
function namedFiles(resolver: Json): string[] {
  const contexts = contextFiles(resolver);
  return [...new Set(THEMES.flatMap((t) => contexts[t]))];
}

/** Reads the resolver, the files it names and the contrast rules under `root`. Does not validate. */
export function readTokenFiles(root: string = process.cwd()): TokenFiles {
  const dir = path.join(path.resolve(root), TOKENS_DIR);
  const read = (file: string): Json => {
    let text: string;
    try {
      text = readFileSync(path.join(dir, file), "utf8");
    } catch {
      throw new TokenError(file, `is missing from ${TOKENS_DIR}/`);
    }
    try {
      return JSON.parse(text);
    } catch (error) {
      throw new TokenError(file, `is not JSON: ${(error as Error).message}`);
    }
  };
  const resolver = read(RESOLVER_FILE);
  const out: TokenFiles = { [RESOLVER_FILE]: resolver };
  for (const file of namedFiles(resolver)) out[file] = read(file);
  out[CONTRAST_FILE] = read(CONTRAST_FILE);
  return out;
}

/** A scheme's flattened index: every path, its file and its token, the later file winning. */
type Index = Map<string, Located>;

function lookupAlias(token: Node): string | undefined {
  return typeof token.$value === "string"
    ? ALIAS.exec(token.$value)?.[1]
    : undefined;
}

/** Resolves every alias in a scheme's index: it exists, has its token's type, and ends. */
function checkAliases(index: Index): void {
  for (const { file, path: p, token } of index.values()) {
    const seen = [p];
    let target = lookupAlias(token);
    while (target !== undefined) {
      if (seen.includes(target))
        throw new TokenError(
          `${file}: ${p}`,
          `an alias cycle: ${[...seen, target].join(" → ")}`,
        );
      seen.push(target);
      const next = index.get(target);
      if (!next)
        throw new TokenError(`${file}: ${p}`, `"{${target}}" names no token`);
      if (next.token.$type !== token.$type)
        throw new TokenError(
          `${file}: ${p}`,
          `"{${target}}" is a ${String(next.token.$type)}, not a ${String(token.$type)}`,
        );
      target = lookupAlias(next.token);
    }
  }
}

/** The 021 lowering's view of one scheme: typed reads that name the file and path at fault. */
class Scheme {
  constructor(
    readonly name: Theme,
    readonly index: Index,
    readonly files: TokenFiles,
  ) {}

  /** The file that holds a path, or the tokens under it, or its nearest group. */
  fileFor(p: string): string {
    const own = this.index.get(p);
    if (own) return own.file;
    const parts = p.split(".");
    for (let n = parts.length; n > 0; n--) {
      const prefix = `${parts.slice(0, n).join(".")}.`;
      for (const l of this.index.values())
        if (l.path.startsWith(prefix)) return l.file;
    }
    return BASE_FILE;
  }

  where(p: string): string {
    return `${this.fileFor(p)}: ${p}`;
  }

  located(p: string): Located {
    const at = this.index.get(p);
    if (!at) throw new TokenError(this.where(p), "is missing");
    return at;
  }

  /** The literal token an alias chain ends at. */
  final(p: string): Located {
    let at = this.located(p);
    for (
      let t = lookupAlias(at.token);
      t !== undefined;
      t = lookupAlias(at.token)
    )
      at = this.index.get(t)!;
    return at;
  }

  /** A group's own vendor data, read from the file that holds it. */
  groupVendor(group: string): Node {
    let at: Json = this.files[this.fileFor(group)];
    for (const part of group.split("."))
      at = isObject(at) ? at[part] : undefined;
    return isObject(at) ? vendorOf(at, this.where(group)) : {};
  }

  typed(p: string, type: string): Located {
    const at = this.located(p);
    if (at.token.$type !== type)
      throw new TokenError(this.where(p), `must be a ${type}`);
    return at;
  }

  /** The name a token aliases directly under `prefix`, or the fault. */
  alias(p: string, type: string, prefix: string, fault: string): string {
    const target = lookupAlias(this.typed(p, type).token);
    if (
      target === undefined ||
      !target.startsWith(prefix) ||
      target.slice(prefix.length).includes(".")
    )
      throw new TokenError(this.where(p), fault);
    return target.slice(prefix.length);
  }

  number(p: string): number {
    return this.final(this.typed(p, "number").path).token.$value as number;
  }

  /** A px dimension's value: Kuiper's sizes are px, which the CSS writes in rem. */
  px(p: string): number {
    const v = this.final(this.typed(p, "dimension").path).token.$value as Node;
    if (v.unit !== "px") throw new TokenError(this.where(p), "must be in px");
    return v.value as number;
  }

  ms(p: string): number {
    const v = this.final(this.typed(p, "duration").path).token.$value as Node;
    if (v.unit !== "ms") throw new TokenError(this.where(p), "must be in ms");
    return v.value as number;
  }

  bezier(p: string): [number, number, number, number] {
    return [
      ...(this.final(this.typed(p, "cubicBezier").path).token
        .$value as number[]),
    ] as [number, number, number, number];
  }

  weight(p: string): number {
    return this.final(this.typed(p, "fontWeight").path).token.$value as number;
  }

  positive(n: number, p: string): number {
    if (!(n > 0)) throw new TokenError(this.where(p), "must be greater than 0");
    return n;
  }

  fraction(n: number, p: string): number {
    this.positive(n, p);
    if (n >= 1)
      throw new TokenError(this.where(p), "must be a fraction below 1");
    return n;
  }

  unit(p: string, unit: "em" | "vw"): void {
    if (vendorOf(this.located(p).token, this.where(p), "number").unit !== unit)
      throw new TokenError(
        this.where(p),
        `must carry unit "${unit}" in its extension`,
      );
  }

  /** A group's member names, in order. */
  members(group: string): string[] {
    const out: string[] = [];
    for (const p of this.index.keys())
      if (p.startsWith(`${group}.`)) {
        const name = p.slice(group.length + 1).split(".")[0];
        if (!out.includes(name)) out.push(name);
      }
    if (!out.length) throw new TokenError(this.where(group), "is missing");
    return out;
  }
}

const PRIMITIVE = "must alias a primitive, never a literal";

/** A colour's string as today's file held it: its hex, then its alpha byte when translucent. */
function hexOf(value: Node): string {
  const hex = value.hex as string;
  if (!("alpha" in value)) return hex;
  const a = Math.round((value.alpha as number) * 255);
  return `${hex}${a.toString(16).toUpperCase().padStart(2, "0")}`;
}

/** 021 decision 5: a stack's string, each name quoted if it holds a space. */
function familyString(stack: Json): string {
  const names = typeof stack === "string" ? [stack] : (stack as string[]);
  return names.map((n) => (n.includes(" ") ? `'${n}'` : n)).join(", ");
}

/**
 * A tint alpha must be a whole number of tenths, so compositing stays exact
 * (001 decision 12).
 */
function tenths(value: Json, key: string): number {
  if (typeof value !== "number" || !(value > 0))
    throw new TokenError(key, "must be greater than 0");
  const k = value * 10;
  if (value >= 1 || Math.abs(k - Math.round(k)) > 1e-9)
    throw new TokenError(key, "must be a whole number of tenths below 1");
  return value;
}

/**
 * The files' Kuiper rules, then the lowering (021 decisions 3 to 7 and 12).
 * Every rule of the old validator is kept, each with its reason, on the DTCG
 * paths.
 */
export function lowerTokens(files: TokenFiles): Tokens {
  const contexts = contextFiles(files[RESOLVER_FILE]);
  const checked = new Map<string, Located[]>();
  for (const file of THEMES.flatMap((t) => contexts[t])) {
    if (checked.has(file)) continue;
    if (!(file in files))
      throw new TokenError(file, "is named by the resolver but not given");
    checked.set(file, checkFile(file, files[file]));
  }

  // 021 decision 2: the base set and each scheme file share no top-level group.
  const base = contexts.light[0];
  const groups = (file: string) =>
    Object.keys(files[file] as Node).filter((k) => !k.startsWith("$"));
  for (const group of [
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
  ])
    if (!groups(base).includes(group))
      throw new TokenError(`${base}: ${group}`, "is missing");
  for (const t of THEMES) {
    const own = contexts[t].at(-1)!;
    for (const group of ["role", "field", "glass", "expressive-mark"])
      if (!groups(own).includes(group))
        throw new TokenError(`${own}: ${group}`, "is missing");
    for (const group of groups(own))
      if (groups(base).includes(group))
        throw new TokenError(
          `${own}: ${group}`,
          `is also a group of ${base}; a scheme file shares none`,
        );
  }

  // The two scheme files hold the same paths in the same order.
  const [lightFile, darkFile] = THEMES.map((t) => contexts[t].at(-1)!);
  const lightPaths = checked.get(lightFile)!.map((l) => l.path);
  const darkPaths = checked.get(darkFile)!.map((l) => l.path);
  for (const p of lightPaths)
    if (!darkPaths.includes(p))
      throw new TokenError(
        `${darkFile}: ${p}`,
        `is missing; the schemes hold the same paths as ${lightFile}`,
      );
  for (const p of darkPaths)
    if (!lightPaths.includes(p))
      throw new TokenError(
        `${darkFile}: ${p}`,
        `is not in ${lightFile}; the schemes hold the same paths`,
      );
  darkPaths.forEach((p, i) => {
    if (lightPaths[i] !== p)
      throw new TokenError(
        `${darkFile}: ${p}`,
        `is out of order; the schemes hold their paths in the same order as ${lightFile}`,
      );
  });

  // Flatten each scheme, the later file winning, and resolve every alias.
  const schemes = {} as Record<Theme, Scheme>;
  for (const t of THEMES) {
    const index: Index = new Map();
    for (const file of contexts[t])
      for (const l of checked.get(file)!) index.set(l.path, l);
    checkAliases(index);
    schemes[t] = new Scheme(t, index, files);
  }
  const s = schemes.light;
  const words = (l: Located) =>
    (l.token.$description as string | undefined) ?? "";

  // primitive: literal colours, each hex and alpha once.
  const primitives: Record<string, string> = {};
  const seen = new Map<string, string>();
  for (const name of s.members("primitive")) {
    const p = `primitive.${name}`;
    const at = s.typed(p, "color");
    if (!LOWER.test(name))
      throw new TokenError(s.where(p), "is not a lowercase name");
    if (lookupAlias(at.token) !== undefined)
      throw new TokenError(
        s.where(p),
        "a primitive is a literal colour, never an alias",
      );
    const hex = hexOf(at.token.$value as Node);
    if (seen.has(hex))
      throw new TokenError(
        s.where(p),
        `repeats the hex and alpha of primitive.${seen.get(hex)}`,
      );
    seen.set(hex, name);
    primitives[name] = hex;
  }

  // role: each aliases a primitive, never a literal, in each scheme.
  const themes = { light: {}, dark: {} } as Record<
    Theme,
    Record<string, string>
  >;
  const roleWords: Record<string, string> = {};
  for (const t of THEMES) {
    const scheme = schemes[t];
    for (const name of scheme.members("role")) {
      const p = `role.${name}`;
      if (!LOWER.test(name))
        throw new TokenError(scheme.where(p), "is not a lowercase name");
      themes[t][name] = scheme.alias(p, "color", "primitive.", PRIMITIVE);
      if (t === "light") roleWords[name] = words(scheme.located(p));
      // 021 decision 9: a role's words are the same in both files.
      else if (words(scheme.located(p)) !== roleWords[name])
        throw new TokenError(
          scheme.where(p),
          `its $description must equal ${lightFile}'s`,
        );
    }
  }
  const semantic = new Set(Object.keys(themes.light));

  // code: each slot aliases a role, never a primitive or a literal, so the
  // theme switch carries through (004 decision 5).
  const code: Record<string, string> = {};
  const codeWords: Record<string, string> = {};
  for (const slot of s.members("code")) {
    const p = `code.${slot}`;
    if (!LOWER.test(slot))
      throw new TokenError(s.where(p), "is not a lowercase name");
    code[slot] = s.alias(
      p,
      "color",
      "role.",
      "must alias a role, never a primitive or a literal",
    );
    codeWords[slot] = words(s.located(p));
  }

  const radius = { case: s.positive(s.px("radius.case"), "radius.case") };

  // spacing: the atom, and ladder steps named by their count of atoms.
  const atom = s.positive(s.px("spacing.atom"), "spacing.atom");
  const ladder: number[] = [];
  for (const name of s.members("spacing.ladder")) {
    const p = `spacing.ladder.${name}`;
    if (lookupAlias(s.typed(p, "dimension").token) !== undefined)
      throw new TokenError(s.where(p), "a ladder step is a literal");
    const n = s.positive(s.px(p), p);
    if (!Number.isInteger(n / atom))
      throw new TokenError(s.where(p), "must be a whole number of atoms");
    if (String(n / atom) !== name)
      throw new TokenError(
        s.where(p),
        `is named ${name}, but is ${n / atom} atoms; a step is named by its count`,
      );
    ladder.push(n);
  }
  ladder.sort((a, b) => a - b);

  // font
  const families = {} as Record<"sans" | "heading" | "mono", Family>;
  for (const role of ["sans", "heading", "mono"] as const) {
    const p = `font.family.${role}`;
    const at = s.typed(p, "fontFamily");
    if (lookupAlias(at.token) !== undefined)
      throw new TokenError(s.where(p), "a family is a stack, never an alias");
    const own = vendorOf(at.token, s.where(p), "fontFamily");
    for (const field of ["cssVariable", "package", "item", "import"])
      if (typeof own[field] !== "string" || !own[field])
        throw new TokenError(
          s.where(p),
          `its extension must name its ${field}`,
        );
    if (!String(own.cssVariable).startsWith("--font-"))
      throw new TokenError(
        s.where(p),
        "its cssVariable must start with --font-",
      );
    if (
      "selector" in own &&
      (typeof own.selector !== "string" || !own.selector)
    )
      throw new TokenError(s.where(p), "its selector must be a selector");
    const family: Family = {
      variable: own.cssVariable as string,
      family: familyString(at.token.$value),
      package: own.package as string,
      item: own.item as string,
      import: own.import as string,
    };
    if ("selector" in own) family.selector = own.selector as string;
    families[role] = family;
  }
  const scale: Tokens["type"]["scale"] = {};
  const sizes = s.members("font.size");
  const heights = s.members("font.line-height");
  if (sizes.join() !== heights.join())
    throw new TokenError(
      s.where("font.line-height"),
      "must name the steps of font.size, in its order",
    );
  for (const step of sizes)
    scale[step] = {
      px: s.positive(s.px(`font.size.${step}`), `font.size.${step}`),
      lineHeight: s.positive(
        s.number(`font.line-height.${step}`),
        `font.line-height.${step}`,
      ),
    };
  const tracking: Record<string, number> = {};
  for (const name of s.members("font.tracking")) {
    s.unit(`font.tracking.${name}`, "em");
    tracking[name] = s.number(`font.tracking.${name}`);
  }
  const weight: Record<string, number> = {};
  for (const name of s.members("font.weight"))
    weight[name] = s.weight(`font.weight.${name}`);
  const leading: Record<string, number> = {};
  for (const name of s.members("font.leading"))
    leading[name] = s.number(`font.leading.${name}`);

  // motion. 006 decision 4: each share is a fraction of the budget, and the
  // last dot's end (start + 3 staggers + one dot) must not pass it.
  const motion = {
    entranceMs: s.positive(s.ms("motion.entrance"), "motion.entrance"),
    microMs: s.positive(s.ms("motion.micro"), "motion.micro"),
    easeEntrance: s.bezier("motion.ease-entrance"),
    entranceDot: s.fraction(
      s.number("motion.entrance-dot"),
      "motion.entrance-dot",
    ),
    entranceStart: s.fraction(
      s.number("motion.entrance-start"),
      "motion.entrance-start",
    ),
    entranceStagger: s.fraction(
      s.number("motion.entrance-stagger"),
      "motion.entrance-stagger",
    ),
  };
  if (
    motion.entranceStart + 3 * motion.entranceStagger + motion.entranceDot >
    1 + 1e-9
  )
    throw new TokenError(
      s.where("motion.entrance-dot"),
      "the last dot ends past the entrance budget (start + 3 × stagger + dot > 1)",
    );

  // mark: its geometry in em, and the lockup's scale (011 decision 7).
  for (const name of ["dot", "gap", "rise", "lockup-gap", "orbit"])
    s.unit(`mark.${name}`, "em");
  const markOf = (name: string) =>
    s.positive(s.number(`mark.${name}`), `mark.${name}`);
  const mark = {
    dot: markOf("dot"),
    gap: markOf("gap"),
    lockupScale: markOf("lockup-scale"),
    rise: markOf("rise"),
    lockupGap: markOf("lockup-gap"),
    orbit: markOf("orbit"),
  };

  const line = { width: s.positive(s.px("line.width"), "line.width") };
  const focus = {
    width: s.positive(s.px("focus.width"), "focus.width"),
    offset: s.px("focus.offset"),
  };

  // elevation: the shadow's offset and blur, each a ladder step (002
  // decision 7). The alias says so.
  const elevation = { y: 0, blur: 0 };
  for (const field of ["y", "blur"] as const) {
    const p = `elevation.${field}`;
    s.alias(p, "dimension", "spacing.ladder.", "must alias a ladder step");
    elevation[field] = s.px(p);
  }

  const expressive = lowerExpressive(schemes, primitives, families);

  // Kuiper's own contrast rules: every name they use is a role.
  const contrast = checkContrast(files[CONTRAST_FILE], semantic);

  // 021 decision 6: the light expressive mark is the light roles' copy, so
  // it cannot drift; the dark four are the lifted dots.
  const marks = {} as Record<Theme, string[]>;
  for (const t of THEMES) {
    const scheme = schemes[t];
    const names = scheme.members("expressive-mark");
    if (names.join() !== "mark-1,mark-2,mark-3,mark-4")
      throw new TokenError(
        scheme.where("expressive-mark.mark-1"),
        "the group must hold mark-1 to mark-4, and nothing else",
      );
    marks[t] = names.map((n) =>
      scheme.alias(`expressive-mark.${n}`, "color", "primitive.", PRIMITIVE),
    );
  }
  marks.light.forEach((primitive, i) => {
    if (primitive !== themes.light[`mark-${i + 1}`])
      throw new TokenError(
        schemes.light.where(`expressive-mark.mark-${i + 1}`),
        `must alias the same primitive as role.mark-${i + 1}, {primitive.${themes.light[`mark-${i + 1}`]}}`,
      );
  });

  return {
    primitives,
    themes,
    code,
    radius,
    spacing: { atom, ladder },
    type: { families, scale, tracking, weight, leading },
    motion,
    mark,
    line,
    focus,
    elevation,
    expressive,
    contrast,
    descriptions: { roles: roleWords, code: codeWords },
    expressiveDarkMarks: marks.dark,
  };
}

/** 009 decisions 3 to 7 and 011's brand: the expressive values, and the scheme files' fields and glass. */
function lowerExpressive(
  schemes: Record<Theme, Scheme>,
  primitives: Record<string, string>,
  families: Tokens["type"]["families"],
): Expressive {
  const s = schemes.light;
  /** 009 decision 5: a fluid size, its ends in px, the minimum below the maximum. */
  const fluid = (group: string): Fluid => {
    s.unit(`${group}.preferred`, "vw");
    const minPx = s.positive(s.px(`${group}.min`), `${group}.min`);
    const vw = s.positive(s.number(`${group}.preferred`), `${group}.preferred`);
    const maxPx = s.positive(s.px(`${group}.max`), `${group}.max`);
    if (minPx >= maxPx)
      throw new TokenError(s.where(group), "its min must be below its max");
    return { minPx, vw, maxPx };
  };

  // Decision 5: the display face names a family role, not a font of its own
  // (review finding 5).
  const family = s.alias(
    "expressive.display.family",
    "fontFamily",
    "font.family.",
    "must alias a family of font.family",
  );
  if (!(family in families))
    throw new TokenError(
      s.where("expressive.display.family"),
      `"${family}" must name a role of font.family`,
    );
  const steps = {} as Expressive["display"]["steps"];
  for (const step of ["display", "section", "proof", "poster"] as const) {
    const g = `expressive.display.${step}`;
    s.unit(`${g}.tracking`, "em");
    const entry: DisplayStep = {
      ...fluid(`${g}.size`),
      lineHeight: s.positive(s.number(`${g}.line-height`), `${g}.line-height`),
      tracking: s.number(`${g}.tracking`),
      weight: s.positive(s.weight(`${g}.weight`), `${g}.weight`),
    };
    const own = s.groupVendor(g);
    if ("tabular" in own) {
      if (typeof own.tabular !== "boolean")
        throw new TokenError(s.where(g), "tabular must be true or false");
      entry.tabular = own.tabular;
    }
    steps[step] = entry;
  }

  const m = "expressive.motion";
  const duration = (name: string) =>
    s.positive(s.ms(`${m}.${name}`), `${m}.${name}`);
  const pressScale = s.positive(
    s.number(`${m}.press-scale`),
    `${m}.press-scale`,
  );
  if (pressScale > 1)
    throw new TokenError(s.where(`${m}.press-scale`), "must be 1 or less");
  // 011 decision 10: an underdamped spring, settling within a fraction.
  const sp = `${m}.spring`;
  const samples = s.positive(s.number(`${sp}.samples`), `${sp}.samples`);
  if (!Number.isInteger(samples))
    throw new TokenError(s.where(`${sp}.samples`), "must be a whole number");
  const motion: Expressive["motion"] = {
    press: duration("press"),
    slide: duration("slide"),
    busy: duration("busy"),
    reveal: duration("reveal"),
    fill: duration("fill"),
    easeStandard: s.bezier(`${m}.ease-standard`),
    pressScale,
    spring: {
      dampingRatio: s.fraction(
        s.number(`${sp}.damping-ratio`),
        `${sp}.damping-ratio`,
      ),
      settle: s.fraction(s.number(`${sp}.settle`), `${sp}.settle`),
      samples,
    },
    light: duration("light"),
  };

  const sz = "expressive.size";
  const size = {
    bar: s.positive(s.px(`${sz}.bar`), `${sz}.bar`),
    action: s.positive(s.px(`${sz}.action`), `${sz}.action`),
    actionSmall: s.positive(s.px(`${sz}.action-small`), `${sz}.action-small`),
    track: s.positive(s.px(`${sz}.track`), `${sz}.track`),
  };

  // 011 decision 6: per scheme, exactly the four fields, each a fill and a
  // legend that alias primitives. 011 decision 8: the glass, each colour a
  // primitive or a literal; frost only, no lens (decisions.md, 2026-11-07).
  const field = {} as Expressive["field"];
  const glass = {} as Record<Theme, GlassTheme>;
  for (const t of THEMES) {
    const scheme = schemes[t];
    if (scheme.members("field").join() !== FIELDS.join())
      throw new TokenError(
        scheme.where("field"),
        "must hold field-1 to field-4, and nothing else",
      );
    field[t] = {} as Record<(typeof FIELDS)[number], FieldPair>;
    for (const name of FIELDS) {
      if (scheme.members(`field.${name}`).join() !== "fill,legend")
        throw new TokenError(
          scheme.where(`field.${name}`),
          "must hold fill and legend, and nothing else",
        );
      field[t][name] = [
        scheme.alias(`field.${name}.fill`, "color", "primitive.", PRIMITIVE),
        scheme.alias(`field.${name}.legend`, "color", "primitive.", PRIMITIVE),
      ];
    }
    const colour = (p: string): string => {
      const at = scheme.typed(p, "color");
      const target = lookupAlias(at.token);
      if (target === undefined) return hexOf(at.token.$value as Node);
      if (!target.startsWith("primitive.") || !(target.slice(10) in primitives))
        throw new TokenError(
          scheme.where(p),
          "must be a literal colour or alias a primitive",
        );
      return target.slice(10);
    };
    if (scheme.members("glass.shadow").join() !== "near,far")
      throw new TokenError(
        scheme.where("glass.shadow"),
        "must hold near and far, and nothing else",
      );
    glass[t] = {
      tint: colour("glass.tint"),
      rim: colour("glass.rim"),
      edge: colour("glass.edge"),
      fallback: colour("glass.fallback"),
      light: colour("glass.light"),
      shadow: [colour("glass.shadow.near"), colour("glass.shadow.far")],
    };
  }

  return {
    display: { family: family as Expressive["display"]["family"], steps },
    motion,
    size,
    gutter: fluid("expressive.gutter"),
    field,
    glass: {
      ...glass,
      blur: s.positive(s.px("expressive.glass-blur"), "expressive.glass-blur"),
    },
  };
}

/** The contrast rules (021 decision 2): today's `contrast` group, every name a role. */
function checkContrast(raw: Json, semantic: Set<string>): Tokens["contrast"] {
  const file = CONTRAST_FILE;
  if (!isObject(raw)) throw new TokenError(file, "must be a JSON object");
  const key = (k: string) => `${file}: ${k}`;
  const string = (value: Json, k: string) => {
    if (typeof value !== "string" || !value)
      throw new TokenError(key(k), "must be a non-empty string");
    return value;
  };
  const array = (value: Json, k: string): Json[] => {
    if (!Array.isArray(value)) throw new TokenError(key(k), "must be an array");
    return value;
  };
  const object = (value: Json, k: string): Node => {
    if (!isObject(value)) throw new TokenError(key(k), "must be an object");
    return value;
  };
  const theme = (value: Json, k: string): Theme => {
    if (value !== "light" && value !== "dark")
      throw new TokenError(key(k), 'must be "light" or "dark"');
    return value;
  };
  const positive = (value: Json, k: string) => {
    if (typeof value !== "number" || !(value > 0))
      throw new TokenError(key(k), "must be greater than 0");
  };
  for (const part of [
    "text",
    "tints",
    "nonText",
    "exceptions",
    "forbidden",
    "scrim",
    "field",
    "glass",
    "glassOverGlass",
  ])
    if (!(part in raw)) throw new TokenError(key(part), "is missing");
  const semanticName = (value: Json, k: string) => {
    const name = string(value, k);
    if (!semantic.has(name))
      throw new TokenError(key(k), `"${name}" is not a role`);
  };
  const pairs = (value: Json, k: string) =>
    array(value, k).forEach((pair, i) => {
      const p = array(pair, `${k}[${i}]`);
      if (p.length !== 2)
        throw new TokenError(key(`${k}[${i}]`), "must be a pair");
      semanticName(p[0], `${k}[${i}][0]`);
      semanticName(p[1], `${k}[${i}][1]`);
    });
  pairs(raw.text, "text");
  pairs(raw.nonText, "nonText");
  array(raw.tints, "tints").forEach((value, i) => {
    const k = `tints[${i}]`;
    const tint = object(value, k);
    for (const f of ["text", "tint", "over"])
      semanticName(tint[f], `${k}.${f}`);
    const alpha = object(tint.alpha, `${k}.alpha`);
    for (const t of THEMES) tenths(alpha[t], key(`${k}.alpha.${t}`));
  });
  array(raw.exceptions, "exceptions").forEach((value, i) => {
    const k = `exceptions[${i}]`;
    const exception = object(value, k);
    theme(exception.theme, `${k}.theme`);
    pairs([exception.pair], `${k}.pair`);
    string(exception.why, `${k}.why`);
  });
  const forbidden = object(raw.forbidden, "forbidden");
  for (const part of ["measured", "ruleOnly"] as const)
    array(forbidden[part], `forbidden.${part}`).forEach((value, i) => {
      const k = `forbidden.${part}[${i}]`;
      const row = object(value, k);
      theme(row.theme, `${k}.theme`);
      for (const f of ["text", "tint", "over"])
        semanticName(row[f], `${k}.${f}`);
      tenths(row.alpha, key(`${k}.alpha`));
      if (part === "measured") positive(row.ratio, `${k}.ratio`);
      else if ("ratio" in row)
        throw new TokenError(
          key(`${k}.ratio`),
          "a rule-only pair holds no ratio",
        );
      string(row.why, `${k}.why`);
    });
  array(raw.scrim, "scrim").forEach((value, i) => {
    const k = `scrim[${i}]`;
    const row = object(value, k);
    theme(row.theme, `${k}.theme`);
    for (const f of ["edge", "over", "scrim"])
      semanticName(row[f], `${k}.${f}`);
    positive(row.min, `${k}.min`);
  });
  // 011 decision 11: the field set names a field; the glass set a role's text
  // over the canvas, a field or (light only) the foreground.
  array(raw.field, "field").forEach((value, i) => {
    const k = `field[${i}]`;
    const row = object(value, k);
    theme(row.theme, `${k}.theme`);
    if (!(FIELDS as readonly Json[]).includes(row.field))
      throw new TokenError(key(`${k}.field`), "must name field-1 to field-4");
  });
  array(raw.glass, "glass").forEach((value, i) => {
    const k = `glass[${i}]`;
    const row = object(value, k);
    const t = theme(row.theme, `${k}.theme`);
    if (
      !["foreground", "muted-foreground", "primary"].includes(
        row.text as string,
      )
    )
      throw new TokenError(
        key(`${k}.text`),
        "must be foreground, muted-foreground or primary",
      );
    const grounds: Json[] = ["background", ...FIELDS];
    if (t === "light") grounds.push("foreground");
    if (!grounds.includes(row.over))
      throw new TokenError(
        key(`${k}.over`),
        "must be background, a field, or (light only) foreground",
      );
  });
  // 012 decision 4: the bar's text, foreground or primary, on its glass over
  // the hero's glass over the canvas or a field.
  array(raw.glassOverGlass, "glassOverGlass").forEach((value, i) => {
    const k = `glassOverGlass[${i}]`;
    const row = object(value, k);
    theme(row.theme, `${k}.theme`);
    if (!["foreground", "primary"].includes(row.text as string))
      throw new TokenError(key(`${k}.text`), "must be foreground or primary");
    if (!(["background", ...FIELDS] as Json[]).includes(row.over))
      throw new TokenError(key(`${k}.over`), "must be background or a field");
  });
  return raw as unknown as Tokens["contrast"];
}

/** Validates the files, by lowering them. Throws a `TokenError` naming the file and the path at fault. */
export function validateTokens(files: TokenFiles): void {
  lowerTokens(files);
}

/**
 * 021 decision 13: one scheme flattened into one standalone DTCG tree: the
 * base and the scheme's files merged token by token, the later winning,
 * aliases kept. The root's `$`-properties are the last file's.
 */
export function flattenScheme(files: TokenFiles, theme: Theme): Node {
  const order = contextFiles(files[RESOLVER_FILE])[theme];
  const root: Node = {};
  const groupsOut: Node = {};
  const merge = (into: Node, from: Node) => {
    for (const [k, v] of Object.entries(from)) {
      if (isObject(v) && !("$value" in v) && isObject(into[k]))
        merge(into[k] as Node, v);
      else into[k] = structuredClone(v);
    }
  };
  for (const file of order) {
    const tree = files[file] as Node;
    for (const [k, v] of Object.entries(tree)) {
      if (k.startsWith("$")) root[k] = structuredClone(v);
      else if (isObject(groupsOut[k]) && isObject(v))
        merge(groupsOut[k] as Node, v);
      else groupsOut[k] = structuredClone(v);
    }
  }
  const { $schema, $description, $extensions, ...restRoot } = root;
  return {
    $schema,
    ...($description !== undefined ? { $description } : {}),
    ...($extensions !== undefined ? { $extensions } : {}),
    ...restRoot,
    ...groupsOut,
  };
}

/** Reads the token files under `root` (default: the working directory) and lowers them. */
export function readTokens(root: string = process.cwd()): Tokens {
  return lowerTokens(readTokenFiles(root));
}

/** The hex an `expressive` colour takes: its primitive's, or its own literal. */
export function resolveExpressive(tokens: Tokens, value: string): string {
  return tokens.primitives[value] ?? value;
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
