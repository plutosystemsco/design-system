/**
 * The literal lint (001 decision 25). It flags, in a registry item's files, any
 * colour or size that does not come from a token:
 *   - a hex colour, or a colour function;
 *   - a Tailwind palette colour class (`bg-red-500`, `text-white`), with the
 *     palette read from the pinned `tailwindcss/theme.css`;
 *   - an arbitrary value or an arbitrary property holding a length or a
 *     colour (`p-[13px]`, `bg-[red]`, `[margin:13px]`), named colours included;
 *   - a `<style>` block, a `style` attribute, or style set another way
 *     (`{ style: … }` spread as props, `.style.` access, `setAttribute("style")`);
 *   - a literal duration or delay (`duration-300`); the token form is allowed;
 *   - a spacing utility off the ladder (001 decision 10);
 *   - a `font-<name>` or `leading-<name>` the token file does not hold.
 * 002 decision 21 adds fourteen class rules, L1 to L14: translucent tints,
 * `dark:`, rings, outlines, shadows, backdrops, sizes off the ladder, type
 * steps and tracking off the token scale, animations, `rounded-full` and
 * `focus-ring-none` outside their allowlists, `cn-` markers, and numeric
 * border widths. 002 adds four more, L15 to L18: a `focus-ring` allowlist,
 * offsets off the ladder, palette colours through the variable form, and
 * `scale`. 007 decision 3 adds L19, a text rule: a
 * `syntax-<hue>` name anywhere in an item file. The five syntax colours exist
 * for the code slots alone; Tailwind also emits `text-(--syntax-orange)` and
 * `text-(--color-syntax-orange)`, and a `.ts` theme string may write
 * `var(--syntax-teal)`, so a class rule would miss them. 004 decision 15 adds
 * L20 and L21: an injected stylesheet (`<svelte:element this="style">`), and a
 * CSS length or named colour inside a quoted string of a `.ts` or `.svelte.ts`
 * item file, such as a CodeMirror theme object.
 * The CSS-variable form `-(--token)` is always allowed: its value is a token.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { readTokens, TOKENS_PATH } from "./tokens.ts";

export type Violation = {
  file: string;
  line: number;
  rule: string;
  text: string;
};

export type Rules = {
  palettes: string[];
  spacingSteps: Set<string>;
  families: Set<string>;
  weights: Set<string>;
  leadings: Set<string>;
  /** The semantic colour names, for L1. */
  colours: Set<string>;
  /** The type scale's keys, for L8. */
  textSteps: Set<string>;
  /** The tracking names, for L9. */
  tracking: Set<string>;
};

/** L11 and L13: the files, by name, in which one otherwise forbidden class is allowed. */
export const ALLOWLISTS = {
  "rounded-full": ["four-dot.svelte", "radio-group-item.svelte"],
  // 004 decision 8: the code block's root draws the ring for its `pre`.
  "focus-ring-none": [
    "input-group-input.svelte",
    "input-group-textarea.svelte",
    "code-block-content.svelte",
  ],
  // 002 decision 8: containers that draw the ring for a child.
  "focus-ring": ["input-group.svelte", "input-otp.svelte", "code-block.svelte"],
} as const;

/** L1: the four sanctioned state tints, and the one variant each may carry. */
const SANCTIONED_TINTS: Record<string, string> = {
  "bg-destructive/10": "",
  "bg-success/10": "",
  "bg-destructive/20": "dark",
  "bg-success/20": "dark",
};

/** L7: the size keywords allowed besides ladder steps, fractions and the token form. */
const SIZE_KEYWORDS = new Set([
  "auto",
  "full",
  "screen",
  "svh",
  "lvh",
  "dvh",
  "min",
  "max",
  "fit",
  "lh",
  "prose",
  "3xs",
  "2xs",
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "4xl",
  "5xl",
  "6xl",
  "7xl",
]);

const COLOUR_UTILITIES = [
  "bg",
  "text",
  "border",
  "border-x",
  "border-y",
  "border-t",
  "border-r",
  "border-b",
  "border-l",
  "border-s",
  "border-e",
  "outline",
  "ring",
  "ring-offset",
  "divide",
  "fill",
  "stroke",
  "accent",
  "caret",
  "decoration",
  "shadow",
  "inset-shadow",
  "inset-ring",
  "text-shadow",
  "drop-shadow",
  "from",
  "via",
  "to",
  "placeholder",
];

const SPACING_UTILITIES = [
  "px",
  "py",
  "pt",
  "pr",
  "pb",
  "pl",
  "ps",
  "pe",
  "p",
  "mx",
  "my",
  "mt",
  "mr",
  "mb",
  "ml",
  "ms",
  "me",
  "m",
  "gap-x",
  "gap-y",
  "gap",
  "space-x",
  "space-y",
];

const HEX =
  /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})\b/g;
const COLOUR_FUNCTION =
  /\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color|color-mix|light-dark|device-cmyk)\(/g;
const STYLE_BLOCK = /<style[\s>]/g;
const STYLE_ATTRIBUTE = /(?:^|\s)style(?::[\w-]+)?\s*=/g;
/** `{ style: … }` as an object key, which a spread turns into the attribute. */
const STYLE_KEY = /[{,]\s*["']?style["']?\s*:/g;
/** A named colour in an SVG paint attribute, such as `fill="red"`. */
const PAINT_ATTRIBUTE =
  /\b(?:fill|stroke|stop-color|flood-color|lighting-color|color)\s*=\s*["']([a-zA-Z]+)["']/g;
/** `el.style.margin = …`, `el.style.cssText`, `setAttribute("style", …)`. */
const STYLE_PROPERTY = /\.style\b|setAttribute\(\s*["'`]style["'`]/g;
/**
 * 004 decision 15, L20: a `<style>` element written past the STYLE_BLOCK
 * pattern as `<svelte:element this="style">` or `this={"style"}`, the way
 * stock's `chart-style.svelte` injected a stylesheet.
 */
const INJECTED_STYLE =
  /<svelte:element\b[^>]*\bthis\s*=\s*(?:["']style["']|\{\s*["']style["']\s*\})/g;
/**
 * 004 decision 15, L21: inside a quoted string of a `.ts` item file, a number
 * followed by a length unit. `0`, `var(--…)`, `calc(…)` with unitless numbers
 * and keywords such as `solid` or `wavy` carry no unit and pass.
 */
const TS_LENGTH = /\d(?:px|rem|em|%|vh|vw|ch|pt)(?![a-zA-Z])/i;
/** A quoted string in a `.ts` file: double, single or a backtick with no `${`. */
const TS_STRING =
  /"((?:[^"\\\n]|\\.)*)"|'((?:[^'\\\n]|\\.)*)'|`((?:[^`\\$]|\\.)*)`/g;

/**
 * The CSS Color 4 named colours. `transparent` and `currentcolor` are not
 * listed: they carry no colour of their own and stay allowed.
 */
const NAMED_COLOURS = new Set(
  (
    "aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue " +
    "blueviolet brown burlywood cadetblue chartreuse chocolate coral cornflowerblue cornsilk " +
    "crimson cyan darkblue darkcyan darkgoldenrod darkgray darkgreen darkgrey darkkhaki " +
    "darkmagenta darkolivegreen darkorange darkorchid darkred darksalmon darkseagreen " +
    "darkslateblue darkslategray darkslategrey darkturquoise darkviolet deeppink deepskyblue " +
    "dimgray dimgrey dodgerblue firebrick floralwhite forestgreen fuchsia gainsboro ghostwhite " +
    "gold goldenrod gray green greenyellow grey honeydew hotpink indianred indigo ivory khaki " +
    "lavender lavenderblush lawngreen lemonchiffon lightblue lightcoral lightcyan " +
    "lightgoldenrodyellow lightgray lightgreen lightgrey lightpink lightsalmon lightseagreen " +
    "lightskyblue lightslategray lightslategrey lightsteelblue lightyellow lime limegreen linen " +
    "magenta maroon mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen " +
    "mediumslateblue mediumspringgreen mediumturquoise mediumvioletred midnightblue mintcream " +
    "mistyrose moccasin navajowhite navy oldlace olive olivedrab orange orangered orchid " +
    "palegoldenrod palegreen paleturquoise palevioletred papayawhip peachpuff peru pink plum " +
    "powderblue purple rebeccapurple red rosybrown royalblue saddlebrown salmon sandybrown " +
    "seagreen seashell sienna silver skyblue slateblue slategray slategrey snow springgreen " +
    "steelblue tan teal thistle tomato turquoise violet wheat white whitesmoke yellow yellowgreen"
  ).split(" "),
);
/** 007 decision 3, L19: one of the five syntax colours, in any form. */
const SYNTAX_COLOUR = /syntax-(?:orange|amber|purple|teal|cyan)\b/g;
const LENGTH =
  /\d(?:px|rem|em|ex|ch|vh|vw|vmin|vmax|svh|lvh|dvh|cm|mm|in|pt|pc|q|%)(?![a-z])/i;
const VAR_FORM = /^\(--[\w-]+\)$/;

/** True when an arbitrary value or property holds a length, a hex, a colour function or a named colour. */
function holdsLiteral(value: string): boolean {
  HEX.lastIndex = 0;
  COLOUR_FUNCTION.lastIndex = 0;
  if (LENGTH.test(value) || HEX.test(value) || COLOUR_FUNCTION.test(value))
    return true;
  return (value.toLowerCase().match(/[a-z]+/g) ?? []).some((word) =>
    NAMED_COLOURS.has(word),
  );
}

/** Reads the rules from the token file and the pinned Tailwind theme. */
export function loadRules(root: string = process.cwd()): Rules {
  const tokens = readTokens(path.join(root, TOKENS_PATH));
  const theme = readFileSync(
    path.join(root, "node_modules", "tailwindcss", "theme.css"),
    "utf8",
  );
  const palettes = new Set<string>();
  for (const match of theme.matchAll(/--color-([a-z]+)-\d+\s*:/g))
    palettes.add(match[1]);
  const steps = new Set<string>(["0"]);
  for (const px of tokens.spacing.ladder)
    steps.add(String(px / tokens.spacing.atom));
  return {
    palettes: [...palettes].sort(),
    spacingSteps: steps,
    families: new Set(Object.keys(tokens.type.families)),
    weights: new Set(Object.keys(tokens.type.weight)),
    leadings: new Set(Object.keys(tokens.type.leading)),
    colours: new Set(Object.keys(tokens.themes.light)),
    textSteps: new Set(Object.keys(tokens.type.scale)),
    tracking: new Set(Object.keys(tokens.type.tracking)),
  };
}

/** The files registry items carry, from `registry.json`. */
export function itemFiles(root: string = process.cwd()): string[] {
  const registry = JSON.parse(
    readFileSync(path.join(root, "registry.json"), "utf8"),
  );
  return registry.items.flatMap((item: { files?: { path: string }[] }) =>
    (item.files ?? []).map((f) => f.path),
  );
}

/**
 * Splits a class token into its variant prefixes (`hover:`, `dark:`, `md:`)
 * and its utility, without the important and negative marks. A bracket that
 * closes with none open (the token began inside an arbitrary variant that the
 * tokeniser split at `=`) resets the depth, so the utility is still found.
 */
function splitClass(token: string): { variants: string[]; utility: string } {
  let depth = 0;
  const colons: number[] = [];
  for (let i = 0; i < token.length; i++) {
    const ch = token[i];
    if (ch === "[" || ch === "(") depth++;
    else if (ch === "]" || ch === ")") depth = Math.max(0, depth - 1);
    else if (ch === ":" && depth === 0) colons.push(i);
  }
  const variants: string[] = [];
  let start = 0;
  for (const colon of colons) {
    variants.push(token.slice(start, colon));
    start = colon + 1;
  }
  const utility = token
    .slice(start)
    .replace(/^!/, "")
    .replace(/!$/, "")
    .replace(/^-/, "");
  return { variants, utility };
}

/** 002's class rules, L1 to L18. */
function classRule002(
  variants: string[],
  utility: string,
  file: string,
  rules: Rules,
): string | undefined {
  const base = path.basename(file);

  // L1, translucent tint: a colour utility on a token colour with an opacity modifier.
  const tint = new RegExp(
    `^(?:${COLOUR_UTILITIES.join("|")})-([a-z][a-z0-9-]*)/(.+)$`,
  ).exec(utility);
  if (tint && rules.colours.has(tint[1])) {
    const allowed = SANCTIONED_TINTS[utility];
    if (allowed === undefined || variants.join(":") !== allowed)
      return "translucent tint";
    return undefined;
  }

  // L2, a dark: variant, outside the two sanctioned dark tints.
  if (variants.includes("dark")) return "dark variant";

  // L3, ring.
  if (/^(?:ring|inset-ring)(?:-|$)/.test(utility)) return "ring";

  // L4, outline.
  if (/^outline(?:-|$)/.test(utility)) return "outline";

  // L5, shadow: only shadow-elevation.
  if (
    /^(?:shadow|inset-shadow|drop-shadow|text-shadow)(?:-|$)/.test(utility) &&
    utility !== "shadow-elevation"
  )
    return "shadow";

  // L6, backdrop.
  if (/^backdrop-/.test(utility)) return "backdrop";

  // L7, size off the ladder.
  const size = /^(?:min-h|min-w|max-h|max-w|size|h|w)-(.+)$/.exec(utility);
  if (size) {
    const value = size[1];
    const allowed =
      rules.spacingSteps.has(value) ||
      SIZE_KEYWORDS.has(value) ||
      /^\d+\/\d+$/.test(value) ||
      VAR_FORM.test(value) ||
      value.startsWith("[");
    if (!allowed) return "size off the ladder";
  }

  // L8, type step.
  const text = /^text-(xs|sm|base|lg|xl|\d+xl)$/.exec(utility);
  if (text && !rules.textSteps.has(text[1])) return "type step";

  // L9, tracking.
  const tracking = /^tracking-(.+)$/.exec(utility);
  if (
    tracking &&
    !rules.tracking.has(tracking[1]) &&
    !VAR_FORM.test(tracking[1])
  )
    return "tracking";

  // L10, animation. 002 decision 9's motion list (R14): animate-enter,
  // animate-exit, the spinner's animate-spin, and (006 decision 4) the mark's
  // `mark-entrance`, a @utility of its own name that this rule does not see:
  // four delays and four offsets fit no single animate-* utility. 008 decision
  // 5 adds `mark-reveal`, the hover reveal, a @utility for the same reason.
  const animate = /^animate-(.+)$/.exec(utility);
  if (animate && !["enter", "exit", "spin"].includes(animate[1]))
    return "animation";
  if (/^(?:fade|zoom|slide|spin)-(?:in|out)(?:-|$)/.test(utility))
    return "animation";

  // L11, rounded-full outside its allowlist.
  if (
    /^rounded(?:-[trblsexy]{1,2})?-full$/.test(utility) &&
    !(ALLOWLISTS["rounded-full"] as readonly string[]).includes(base)
  )
    return "rounded-full";

  // L12, a maia cn- marker.
  if (/^cn-/.test(utility)) return "cn- marker";

  // L13, focus-ring-none outside its allowlist.
  if (
    utility === "focus-ring-none" &&
    !(ALLOWLISTS["focus-ring-none"] as readonly string[]).includes(base)
  )
    return "focus-ring-none";

  // L14, a numeric border width.
  const border = /^border(?:-[xytrblse])?-(\d+)$/.exec(utility);
  if (border && border[1] !== "0") return "border width";

  // L15, focus-ring outside its allowlist.
  if (
    utility === "focus-ring" &&
    !(ALLOWLISTS["focus-ring"] as readonly string[]).includes(base)
  )
    return "focus-ring";

  // L16, a position or translate offset off the ladder (px, the hairline, is allowed).
  const offset =
    /^(?:inset-x|inset-y|inset|top|right|bottom|left|start|end|translate-x|translate-y)-(.+)$/.exec(
      utility,
    );
  // Only a number can be off the ladder; a word such as "left" in prose is not a value.
  if (
    offset &&
    /^[\d.]+$/.test(offset[1]) &&
    !rules.spacingSteps.has(offset[1])
  )
    return "offset off the ladder";

  // L17, a palette colour through the variable form.
  if (new RegExp(`\\(--color-(?:${rules.palettes.join("|")})-`).test(utility))
    return "palette colour";

  // L18, scale: the zoom "fake depth" 002 decision 3 removed.
  if (/^scale(?:-[xyz])?-/.test(utility)) return "scale";

  return undefined;
}

function classViolation(
  token: string,
  rules: Rules,
  file: string,
): string | undefined {
  const { variants, utility } = splitClass(token);

  // A whole-token arbitrary property, such as `[margin:13px]`.
  const property = /^\[([\w-]+):(.+)\]$/.exec(utility);
  if (property)
    return holdsLiteral(property[2]) ? "arbitrary property" : undefined;
  if (!/^[a-z]/.test(utility)) return undefined;

  for (const arbitrary of utility.matchAll(/\[([^\]]*)\]/g)) {
    if (holdsLiteral(arbitrary[1])) return "arbitrary value";
  }

  const palettes = rules.palettes.join("|");
  const colour = new RegExp(
    `^(?:${COLOUR_UTILITIES.join("|")})-(?:(?:${palettes})-\\d{2,3}|black|white)(?:/(?:\\d+|\\[[^\\]]*\\]|\\([^)]*\\)))?$`,
  );
  if (colour.test(utility)) return "palette colour";

  const spacing = new RegExp(`^(${SPACING_UTILITIES.join("|")})-(.+)$`).exec(
    utility,
  );
  if (spacing) {
    const [, name, value] = spacing;
    const margin = name.startsWith("m");
    const allowed =
      rules.spacingSteps.has(value) ||
      VAR_FORM.test(value) ||
      (margin && value === "auto") ||
      (name.startsWith("space-") && value === "reverse");
    if (!allowed) return "spacing off the ladder";
  }

  const motion = /^(?:duration|delay)-(.+)$/.exec(utility);
  if (motion && !VAR_FORM.test(motion[1])) return "literal duration";

  const font = /^font-(.+)$/.exec(utility);
  if (font && !rules.families.has(font[1]) && !rules.weights.has(font[1]))
    return "font";

  const leading = /^leading-(.+)$/.exec(utility);
  if (leading && !rules.leadings.has(leading[1])) return "line height";

  return classRule002(variants, utility, file, rules);
}

function lineOf(text: string, index: number): number {
  return text.slice(0, index).split("\n").length;
}

/** Lints one file's text. */
export function lintText(
  text: string,
  file = "<text>",
  rules: Rules = loadRules(),
): Violation[] {
  const found: Violation[] = [];
  const add = (rule: string, index: number, match: string) =>
    found.push({ file, line: lineOf(text, index), rule, text: match.trim() });

  for (const [pattern, rule] of [
    [HEX, "hex colour"],
    [COLOUR_FUNCTION, "colour function"],
    [STYLE_BLOCK, "style block"],
    [STYLE_ATTRIBUTE, "style attribute"],
    [STYLE_KEY, "style object key"],
    [STYLE_PROPERTY, "style property"],
  ] as const) {
    pattern.lastIndex = 0;
    for (const match of text.matchAll(pattern))
      add(rule, match.index ?? 0, match[0]);
  }

  PAINT_ATTRIBUTE.lastIndex = 0;
  for (const match of text.matchAll(PAINT_ATTRIBUTE))
    if (NAMED_COLOURS.has(match[1].toLowerCase()))
      add("named colour attribute", match.index ?? 0, match[0]);

  // L20 (004): an injected stylesheet.
  INJECTED_STYLE.lastIndex = 0;
  for (const match of text.matchAll(INJECTED_STYLE))
    add("injected stylesheet", match.index ?? 0, match[0]);

  // L19 (007): a syntax colour named outside the code slots.
  SYNTAX_COLOUR.lastIndex = 0;
  for (const match of text.matchAll(SYNTAX_COLOUR))
    add("syntax colour", match.index ?? 0, match[0]);

  // L21 (004): CSS values in a theme file. Only a `.ts` or `.svelte.ts` file;
  // a `.svelte` file's classes are read by the class rules below.
  if (/\.ts$/.test(file)) {
    TS_STRING.lastIndex = 0;
    for (const match of text.matchAll(TS_STRING)) {
      const value = match[1] ?? match[2] ?? match[3] ?? "";
      if (TS_LENGTH.test(value))
        add("css length in a theme file", match.index ?? 0, match[0]);
      else if (
        (value.toLowerCase().match(/[a-z]+/g) ?? []).some((word) =>
          NAMED_COLOURS.has(word),
        )
      )
        add("css named colour in a theme file", match.index ?? 0, match[0]);
    }
  }

  // Class-like tokens: split on whitespace, quotes and markup punctuation.
  const tokenPattern = /[^\s"'`{}<>=,;]+/g;
  for (const match of text.matchAll(tokenPattern)) {
    const rule = classViolation(match[0], rules, file);
    if (rule) add(rule, match.index ?? 0, match[0]);
  }
  return found;
}

/** Lints files, by path relative to `root`. */
export function lintFiles(
  files: string[],
  rules: Rules = loadRules(),
  root: string = process.cwd(),
): Violation[] {
  return files.flatMap((file) =>
    lintText(readFileSync(path.join(root, file), "utf8"), file, rules),
  );
}

if (import.meta.main) {
  const violations = lintFiles(itemFiles());
  for (const v of violations)
    console.log(`${v.file}:${v.line}  ${v.rule}  ${v.text}`);
  console.log(`${violations.length} literal(s) in registry item files`);
  process.exit(violations.length ? 1 : 0);
}
