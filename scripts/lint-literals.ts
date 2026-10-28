/**
 * The literal lint (decision 25). It flags, in a registry item's files, any
 * colour or size that does not come from a token:
 *   - a hex colour, or a colour function;
 *   - a Tailwind palette colour class (`bg-red-500`, `text-white`), with the
 *     palette read from the pinned `tailwindcss/theme.css`;
 *   - an arbitrary value or an arbitrary property holding a length or a
 *     colour (`p-[13px]`, `bg-[red]`, `[margin:13px]`), named colours included;
 *   - a `<style>` block, a `style` attribute, or style set another way
 *     (`{ style: … }` spread as props, `.style.` access, `setAttribute("style")`);
 *   - a literal duration or delay (`duration-300`); the token form is allowed;
 *   - a spacing utility off the ladder (decision 10);
 *   - a `font-<name>` or `leading-<name>` the token file does not hold.
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
};

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
/** `el.style.margin = …`, `el.style.cssText`, `setAttribute("style", …)`. */
const STYLE_PROPERTY = /\.style\b|setAttribute\(\s*["'`]style["'`]/g;

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

/** Strips variant prefixes (`hover:`, `dark:`, `md:`) and the important and negative marks. */
function utilityOf(token: string): string {
  let depth = 0;
  let last = -1;
  for (let i = 0; i < token.length; i++) {
    const ch = token[i];
    if (ch === "[" || ch === "(") depth++;
    else if (ch === "]" || ch === ")") depth--;
    else if (ch === ":" && depth === 0) last = i;
  }
  return token
    .slice(last + 1)
    .replace(/^!/, "")
    .replace(/!$/, "")
    .replace(/^-/, "");
}

function classViolation(token: string, rules: Rules): string | undefined {
  const utility = utilityOf(token);

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

  return undefined;
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

  // Class-like tokens: split on whitespace, quotes and markup punctuation.
  const tokenPattern = /[^\s"'`{}<>=,;]+/g;
  for (const match of text.matchAll(tokenPattern)) {
    const rule = classViolation(match[0], rules);
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
