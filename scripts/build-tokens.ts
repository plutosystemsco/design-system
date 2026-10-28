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

  return {
    light: { radius, ...colours(tokens, "light") },
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
      "--motion-entrance": ms(motion.entranceMs),
      "--motion-micro": ms(motion.microMs),
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
    },
    "@utility groove": {
      "border-top": "var(--line-width) solid var(--groove-line)",
      "box-shadow": "inset 0 var(--line-width) 0 var(--groove-light)",
    },
    "@layer base": {
      body: { "@apply bg-background text-foreground": {} },
      "h1, h2, h3, h4, h5, h6": { "@apply font-heading": {} },
      ":focus-visible": {
        outline: "var(--focus-width) solid var(--ring)",
        "outline-offset": "var(--focus-offset)",
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
  const base = {
    ...(rest["@layer base"] as CssTree),
    ...fontBaseRules(tokens),
  };
  const others: CssTree = { ...rest, "@layer base": base };

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
