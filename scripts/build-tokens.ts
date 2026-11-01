/**
 * `bun run build:tokens`: turns the token file into
 *   (a) the token-owned fields of four items in `registry.json`
 *       (`pluto-theme`'s `cssVars` and `css`, and each font item's `font`), and
 *   (b) `src/app.css`, the stylesheet an app holds after `add pluto-theme`.
 * Both are formatted through prettier's API before they are written, and each
 * is written only when its formatted content changes (decision 15).
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import * as prettier from "prettier";
import {
  readTokens,
  THEMES,
  TOKENS_PATH,
  resolveColor,
  type Family,
  type Tokens,
} from "./tokens.ts";

export const REGISTRY_PATH = "registry.json";
export const APP_CSS_PATH = "src/app.css";

type CssTree = { [key: string]: string | CssTree };
type Vars = Record<string, string>;
type FontObject = {
  family: string;
  provider: "google";
  import: string;
  variable: string;
  subsets: string[];
  selector?: string;
  dependency: string;
};

const RADIUS_STEPS = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl"];

/**
 * 006 decision 4: where each dot starts, as multiples of `--mark-orbit`, in
 * the book's directions and reading order: blue from the lower left, red
 * from the upper right, amber from the upper left, green from the lower right.
 */
const ENTRANCE_OFFSETS: [x: number, y: number][] = [
  [-1, 0.6],
  [0.8, -0.8],
  [-0.6, -1],
  [1, 0.8],
];

/** Pixels become rem at the default 16 px root (decision 9). */
const rem = (px: number) => `${px / 16}rem`;
const em = (n: number) => `${n}em`;
const ms = (n: number) => `${n}ms`;
const px = (n: number) => `${n}px`;

function colours(tokens: Tokens, theme: (typeof THEMES)[number]): Vars {
  const out: Vars = {};
  for (const name of Object.keys(tokens.themes[theme]))
    out[name] = resolveColor(tokens, theme, name);
  return out;
}

/** `pluto-theme`'s `cssVars`: light, dark and Tailwind's `@theme inline`. */
export function themeCssVars(tokens: Tokens): {
  light: Vars;
  dark: Vars;
  theme: Vars;
} {
  const radius = rem(tokens.radius.case);
  const theme: Vars = { radius };
  for (const step of RADIUS_STEPS) theme[`radius-${step}`] = "var(--radius)";
  theme.spacing = rem(tokens.spacing.atom);
  for (const [step, { px: size, lineHeight }] of Object.entries(
    tokens.type.scale,
  )) {
    theme[`text-${step}`] = rem(size);
    theme[`text-${step}--line-height`] = String(lineHeight);
  }
  for (const [name, value] of Object.entries(tokens.type.tracking)) {
    theme[`tracking-${name}`] = em(value);
  }
  for (const [name, value] of Object.entries(tokens.type.weight)) {
    theme[`font-weight-${name}`] = String(value);
  }
  for (const [name, value] of Object.entries(tokens.type.leading)) {
    theme[`leading-${name}`] = String(value);
  }
  theme["ease-entrance"] =
    `cubic-bezier(${tokens.motion.easeEntrance.join(", ")})`;
  theme["default-transition-duration"] = ms(tokens.motion.microMs);

  // 002 decision 7: elevation is a hairline spread plus a shadow, both from tokens.
  theme["shadow-elevation"] =
    `0 0 0 var(--line-width) var(--elevation-line), 0 ${rem(tokens.elevation.y)} ${rem(tokens.elevation.blur)} 0 var(--elevation-shadow)`;
  // 002 decision 3: a fade in and out over the micro budget. The curve is written
  // out, because --ease-entrance lives in @theme inline and is never a variable.
  const curve = `cubic-bezier(${tokens.motion.easeEntrance.join(", ")})`;
  theme["animate-enter"] = `pluto-enter var(--motion-micro) ${curve}`;
  theme["animate-exit"] = `pluto-exit var(--motion-micro) ${curve} forwards`;

  // 004 decision 5: the twelve code slots. Each is a reference to a semantic
  // colour, so it lives in `light` only (`:root` cascades into `.dark`, which
  // redefines the referenced variable), and each becomes a utility.
  const code: Vars = {};
  for (const [slot, semantic] of Object.entries(tokens.code)) {
    code[`code-${slot}`] = `var(--${semantic})`;
    theme[`color-code-${slot}`] = `var(--code-${slot})`;
  }

  return {
    light: { radius, ...colours(tokens, "light"), ...code },
    dark: colours(tokens, "dark"),
    theme,
  };
}

/** `pluto-theme`'s `css`. No rule nested in an at-rule may use `:root` or `.dark` (decision 14). */
export function themeCss(tokens: Tokens): CssTree {
  const { mark, motion, line, focus } = tokens;
  return {
    ":root": {
      "--mark-dot": em(mark.dot),
      "--mark-gap": em(mark.gap),
      "--mark-rise": em(mark.rise),
      "--mark-lockup-gap": em(mark.lockupGap),
      "--mark-lift":
        "calc(var(--mark-rise) + var(--mark-dot) + var(--mark-gap))",
      // 006 decision 4: how far a dot travels before it docks.
      "--mark-orbit": em(mark.orbit),
      "--motion-entrance": ms(motion.entranceMs),
      "--motion-micro": ms(motion.microMs),
      // 006 decision 4: the entrance's shares of the budget, unitless. The
      // last dot ends at start + 3 × stagger + dot = 1.00 of the budget.
      "--motion-entrance-dot": String(motion.entranceDot),
      "--motion-entrance-start": String(motion.entranceStart),
      "--motion-entrance-stagger": String(motion.entranceStagger),
      "--line-width": px(line.width),
      "--focus-width": px(focus.width),
      "--focus-offset": px(focus.offset),
      "color-scheme": "light",
    },
    ".dark": {
      "color-scheme": "dark",
    },
    "@media (prefers-reduced-motion: reduce)": {
      "html:root": {
        "--motion-entrance": "0ms",
        "--motion-micro": "0ms",
      },
      "*, ::before, ::after": {
        "animation-duration": "0.01ms !important",
        "animation-iteration-count": "1 !important",
        "transition-duration": "0.01ms !important",
        "scroll-behavior": "auto !important",
      },
      // 006 decision 4: with no animation the dots show their own style, the
      // composed mark, before any frame. Under the 0.01 ms catch-all alone,
      // `fill: both` would hold the first frame (hidden) for one paint.
      '.mark-entrance [data-slot="four-dot-dot"]': {
        animation: "none",
      },
    },
    "@utility groove": {
      "border-top": "var(--line-width) solid var(--groove-line)",
      "box-shadow": "inset 0 var(--line-width) 0 var(--groove-light)",
    },
    // 002 decision 8: a container draws the ring for a child; the one sanctioned drop.
    "@utility focus-ring": {
      outline: "var(--focus-width) solid var(--ring)",
      "outline-offset": "var(--focus-offset)",
    },
    "@utility focus-ring-none": {
      outline: "none",
    },
    // 004 decision 5: a native scroll box's bar from tokens, in place of scroll-area.
    "@utility scrollbar": {
      "scrollbar-color": "var(--input) var(--muted)",
      "scrollbar-width": "thin",
    },
    // 005 decision 5: the horizontal groove turned on its side. The inset
    // beside a sidebar owns it on its start edge: the hairline first, then
    // the light inside it, light from the top-left. An outer shadow on the
    // sidebar is painted over by its sibling and shows nothing.
    "@utility groove-s": {
      "border-inline-start": "var(--line-width) solid var(--groove-line)",
      "box-shadow": "inset var(--line-width) 0 0 var(--groove-light)",
    },
    // 006 decision 4: the groove as a bottom edge, for the shell's header:
    // the hairline, then the light just below it onto the next ground. In
    // dark the light is clear and the hairline alone remains.
    "@utility groove-b": {
      "border-bottom": "var(--line-width) solid var(--groove-line)",
      "box-shadow": "0 var(--line-width) 0 var(--groove-light)",
    },
    // 006 decision 4: the mark's one entrance, the four dots docking. Each
    // dot glides from its orbit offset at 0.4 scale over a share of the
    // budget, staggered; the end state is the dot's own style. A plain
    // animate-* utility cannot carry four delays and four offsets (R14).
    "@utility mark-entrance": {
      '& > [data-slot="four-dot-dot"]': {
        animation:
          "pluto-mark-dock calc(var(--motion-entrance) * var(--motion-entrance-dot)) var(--ease-entrance) both",
      },
      ...Object.fromEntries(
        ENTRANCE_OFFSETS.map(([ox, oy], i) => [
          `& > [data-slot="four-dot-dot"]:nth-child(${i + 1})`,
          {
            "--_ox": String(ox),
            "--_oy": String(oy),
            "animation-delay": `calc(var(--motion-entrance) * (var(--motion-entrance-start) + ${i} * var(--motion-entrance-stagger)))`,
          },
        ]),
      ),
    },
    // 002 decision 3: the keyframes behind animate-enter and animate-exit.
    "@keyframes pluto-enter": { from: { opacity: "0" } },
    "@keyframes pluto-exit": { to: { opacity: "0" } },
    // 006 decision 4: a dot's start, hidden and small at its orbit offset. No
    // `to`: the end state is the composed mark.
    "@keyframes pluto-mark-dock": {
      from: {
        opacity: "0",
        transform:
          "translate(calc(var(--mark-orbit) * var(--_ox)), calc(var(--mark-orbit) * var(--_oy))) scale(0.4)",
      },
    },
    "@layer base": {
      body: { "@apply bg-background text-foreground": {} },
      "h1, h2, h3, h4, h5, h6": { "@apply font-heading": {} },
      ":focus-visible": {
        outline: "var(--focus-width) solid var(--ring)",
        "outline-offset": "var(--focus-offset)",
      },
      // 004's checkpoint: code shows the characters that were typed. JetBrains
      // Mono's contextual ligatures drew `!=` as one glyph, which copy does
      // not return. The same rule sits on the editor's scroller.
      [monoSelector(tokens)]: { "font-variant-ligatures": "none" },
    },
    // 004 decision 5: the native meter on the muted track with a primary fill.
    // Pseudo-elements cannot be classes, and an item may hold no <style>. No
    // radius: the meter has square ends (decision 14). All three WebKit value
    // states take primary so an app that sets low/high/optimum gets no browser
    // green or yellow.
    "@layer components": {
      '[data-slot="meter"]': {
        appearance: "none",
        background: "var(--muted)",
      },
      '[data-slot="meter"]::-webkit-meter-bar': {
        background: "var(--muted)",
      },
      '[data-slot="meter"]::-webkit-meter-optimum-value': {
        background: "var(--primary)",
      },
      '[data-slot="meter"]::-webkit-meter-suboptimum-value': {
        background: "var(--primary)",
      },
      '[data-slot="meter"]::-webkit-meter-even-less-good-value': {
        background: "var(--primary)",
      },
      '[data-slot="meter"]::-moz-meter-bar': {
        background: "var(--primary)",
      },
    },
  };
}

/** A font item's `font` object (decision 17). */
export function fontObject(family: Family): FontObject {
  const font: FontObject = {
    family: family.family,
    provider: "google",
    import: family.import,
    variable: family.variable,
    subsets: ["latin"],
    dependency: family.package,
  };
  if (family.selector) {
    const { dependency, ...rest } = font;
    return { ...rest, selector: family.selector, dependency };
  }
  return font;
}

/** The selector the mono family applies to: the code surfaces. */
function monoSelector(tokens: Tokens): string {
  const mono = Object.values(tokens.type.families).find(
    (family) => family.variable === "--font-mono",
  );
  return mono?.selector ?? "code, kbd, samp, pre";
}

/** The `@layer base` rules the CLI writes for the font items (run memo §4). */
function fontBaseRules(tokens: Tokens): CssTree {
  const groups = new Map<string, string[]>();
  for (const family of Object.values(tokens.type.families)) {
    if (family.variable === "--font-heading") continue;
    const selector = family.selector ?? "html";
    groups.set(selector, [
      ...(groups.get(selector) ?? []),
      family.variable.replace(/^--/, ""),
    ]);
  }
  const out: CssTree = {};
  for (const [selector, classes] of groups)
    out[selector] = { [`@apply ${classes.join(" ")}`]: {} };
  return out;
}

function declarationsOf(vars: Vars): string[] {
  return Object.entries(vars).map(([name, value]) => `--${name}: ${value};`);
}

function printTree(tree: CssTree, indent: string): string[] {
  const lines: string[] = [];
  for (const [key, value] of Object.entries(tree)) {
    if (typeof value === "string") {
      lines.push(`${indent}${key}: ${value};`);
    } else if (key.startsWith("@") && Object.keys(value).length === 0) {
      lines.push(`${indent}${key};`);
    } else {
      lines.push(
        `${indent}${key} {`,
        ...printTree(value, `${indent}  `),
        `${indent}}`,
      );
    }
  }
  return lines;
}

/** `src/app.css`: the CSS an app holds after `add pluto-theme`, unformatted. */
export function appCss(tokens: Tokens): string {
  const vars = themeCssVars(tokens);
  const css = themeCss(tokens);
  const families = Object.values(tokens.type.families);
  const fontTheme: Vars = {};
  for (const family of families)
    fontTheme[family.variable.replace(/^--/, "")] = family.family;
  const colourTheme: Vars = {};
  for (const name of Object.keys(vars.dark))
    colourTheme[`color-${name}`] = `var(--${name})`;

  const { ":root": rootRules, ".dark": darkRules, ...rest } = css;
  // A font rule on a selector the theme already styles joins that rule.
  const base: CssTree = { ...(rest["@layer base"] as CssTree) };
  for (const [selector, rule] of Object.entries(fontBaseRules(tokens))) {
    const existing = base[selector];
    base[selector] = {
      ...(typeof existing === "object" ? existing : {}),
      ...(rule as CssTree),
    };
  }
  // The CLI places an item's @keyframes inside the app's @theme inline (READ:
  // cli/src/utils/updaters/update-css.ts), so the preview's CSS does too.
  const keyframes: CssTree = {};
  const others: CssTree = {};
  for (const [key, value] of Object.entries({ ...rest, "@layer base": base })) {
    if (key.startsWith("@keyframes ")) keyframes[key] = value;
    else others[key] = value;
  }

  const lines = [
    "/* Generated by scripts/build-tokens.ts from tokens/pluto.tokens.json. Do not edit. */",
    '@import "tailwindcss";',
    ...families.map((f) => `@import "${f.package}";`),
    '@import "shadcn-svelte/tailwind.css";',
    "",
    "@custom-variant dark (&:is(.dark *));",
    "",
    ":root {",
    ...declarationsOf(vars.light),
    ...printTree(rootRules as CssTree, ""),
    "}",
    "",
    ".dark {",
    ...declarationsOf(vars.dark),
    ...printTree(darkRules as CssTree, ""),
    "}",
    "",
    "@theme inline {",
    ...declarationsOf(vars.theme),
    ...declarationsOf(fontTheme),
    ...declarationsOf(colourTheme),
    ...printTree(keyframes, ""),
    "}",
    ...Object.entries(others).flatMap(([key, value]) => [
      "",
      ...printTree({ [key]: value }, ""),
    ]),
  ];
  return `${lines.join("\n")}\n`;
}

type RegistryItem = {
  name: string;
  cssVars?: unknown;
  css?: unknown;
  font?: unknown;
  [key: string]: unknown;
};

/** `registry.json` with its token-owned fields replaced, everything else as written. */
export function registryWithTokens(
  tokens: Tokens,
  registryText: string,
): string {
  const registry = JSON.parse(registryText) as { items: RegistryItem[] };
  const byName = new Map(registry.items.map((item) => [item.name, item]));
  const theme = byName.get("pluto-theme");
  if (!theme) throw new Error("registry.json: no pluto-theme item");
  theme.cssVars = themeCssVars(tokens);
  theme.css = themeCss(tokens);
  for (const family of Object.values(tokens.type.families)) {
    const item = byName.get(family.item);
    if (!item) throw new Error(`registry.json: no ${family.item} item`);
    item.font = fontObject(family);
  }
  return JSON.stringify(registry, null, 2);
}

async function format(text: string, file: string): Promise<string> {
  const config = (await prettier.resolveConfig(file)) ?? {};
  return prettier.format(text, { ...config, filepath: file });
}

/** Both outputs, formatted by prettier, without writing anything. */
export async function generateTokenOutputs(
  root: string = process.cwd(),
): Promise<{ registryJson: string; appCss: string }> {
  const tokens = readTokens(path.join(root, TOKENS_PATH));
  const registryFile = path.join(root, REGISTRY_PATH);
  const cssFile = path.join(root, APP_CSS_PATH);
  const registryText = readFileSync(registryFile, "utf8");
  return {
    registryJson: await format(
      registryWithTokens(tokens, registryText),
      registryFile,
    ),
    appCss: await format(appCss(tokens), cssFile),
  };
}

function writeIfChanged(file: string, content: string): boolean {
  let current: string | undefined;
  try {
    current = readFileSync(file, "utf8");
  } catch {
    current = undefined;
  }
  if (current === content) return false;
  writeFileSync(file, content);
  return true;
}

/** Writes both outputs, each only when its content changes. Returns the files written. */
export async function buildTokens(
  root: string = process.cwd(),
): Promise<{ changed: string[] }> {
  const outputs = await generateTokenOutputs(root);
  const changed: string[] = [];
  if (writeIfChanged(path.join(root, REGISTRY_PATH), outputs.registryJson))
    changed.push(REGISTRY_PATH);
  if (writeIfChanged(path.join(root, APP_CSS_PATH), outputs.appCss))
    changed.push(APP_CSS_PATH);
  return { changed };
}

if (import.meta.main) {
  const { changed } = await buildTokens();
  console.log(
    changed.length
      ? `build:tokens wrote ${changed.join(", ")}`
      : "build:tokens: no changes",
  );
}
