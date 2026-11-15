/**
 * `bun run build:tokens`: turns the token file into
 *   (a) the token-owned fields of four items in `registry.json`
 *       (`pluto-theme`'s `cssVars` and `css`, and each font item's `font`), and
 *   (b) `src/app.css`, the stylesheet an app holds after `add pluto-theme`.
 * Both are formatted through prettier's API before they are written, and each
 * is written only when its formatted content changes (001 decision 15).
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import * as prettier from "prettier";
import {
  FIELDS,
  readTokens,
  resolveColor,
  resolveExpressive,
  THEMES,
  TOKENS_PATH,
  type Family,
  type Fluid,
  type Theme,
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
 * 011 decision 3: the primitives the mark's four dots take on a dark
 * expressive ground, in the mark's order. The dark theme's product screens
 * keep paper (008).
 */
const EXPRESSIVE_DARK_MARKS = [
  "blue-lifted",
  "red-lifted",
  "amber",
  "green-lifted",
] as const;

/**
 * 011 decision 10: the step response of a damped spring as a `linear()`
 * easing. x(t) = 1 − e^(−ζωt) (cos(ω_d t) + ζ/√(1 − ζ²) sin(ω_d t)), with
 * ω_d = ω√(1 − ζ²), sampled at `samples + 1` even times from 0 to T, where
 * ωT = ln(1 / settle) / ζ; each value rounded to four decimals, the last 1.
 */
export function springEase({
  dampingRatio: zeta,
  settle,
  samples,
}: Tokens["expressive"]["motion"]["spring"]): string {
  const end = Math.log(1 / settle) / zeta;
  const damped = Math.sqrt(1 - zeta * zeta);
  const points = Array.from({ length: samples + 1 }, (_, k) => {
    if (k === samples) return 1;
    const u = (end * k) / samples;
    const x =
      1 -
      Math.exp(-zeta * u) *
        (Math.cos(damped * u) + (zeta / damped) * Math.sin(damped * u));
    return Math.round(x * 10000) / 10000;
  });
  return `linear(${points.join(", ")})`;
}

/** The roles a field sets to its legend, and that `surface-plain` restores (011 decision 6). */
const FIELD_ROLES = [
  "foreground",
  "muted-foreground",
  "card-foreground",
  "primary",
  "ring",
] as const;
/**
 * `--surface-*`'s roles: the field's, the primary fill's text, which a field
 * sets to its own colour, and the border, which it sets to its legend at 24%.
 */
const SURFACE_ROLES = [...FIELD_ROLES, "primary-foreground", "border"] as const;

/**
 * 011 decisions 6 and 8: the per-theme brand variables. A field's fill and
 * legend; the `--surface-*` copies, each `var(--<role>)` so that it is
 * substituted where it is declared, on `:root` or `.dark`, and inherits as
 * the theme's own value into a field that resets the role; and the glass.
 */
function brandTheme(tokens: Tokens, theme: Theme): Record<string, string> {
  const { field, glass } = tokens.expressive;
  const out: Record<string, string> = {};
  for (const name of FIELDS) {
    const [fill, legend] = field[theme][name];
    out[`--${name}`] = tokens.primitives[fill];
    out[`--${name}-foreground`] = tokens.primitives[legend];
  }
  for (const role of SURFACE_ROLES) out[`--surface-${role}`] = `var(--${role})`;
  const own = glass[theme];
  for (const part of ["tint", "rim", "edge", "fallback", "light"] as const)
    out[`--glass-${part}`] = resolveExpressive(tokens, own[part]);
  const [near, far] = own.shadow.map((c) => resolveExpressive(tokens, c));
  out["--glass-shadow"] = `0 1px 0 ${near}, 0 16px 32px -16px ${far}`;
  return out;
}

/** The roles of `surface-plain`, restored from the `--surface-*` copies. */
function surfacePlain(): Record<string, string> {
  return Object.fromEntries(
    SURFACE_ROLES.map((role) => [`--${role}`, `var(--surface-${role})`]),
  );
}

/** The mark's four variables set from four hexes, in the mark's order. */
function marks(hexes: readonly string[]): Record<string, string> {
  return Object.fromEntries(hexes.map((hex, i) => [`--mark-${i + 1}`, hex]));
}

/**
 * 006 decision 4: where each dot starts, as multiples of `--mark-orbit`, in
 * the design book's directions and reading order: blue from the lower left,
 * red from the upper right, amber from the upper left, green from the lower
 * right.
 */
const ENTRANCE_OFFSETS: [x: number, y: number][] = [
  [-1, 0.6],
  [0.8, -0.8],
  [-0.6, -1],
  [1, 0.8],
];

/** 006 decision 4: one dot's share of the entrance budget. */
const ENTRANCE_DOT =
  "calc(var(--motion-entrance) * var(--motion-entrance-dot))";

/** Pixels become rem at the default 16 px root (001 decision 9). */
const rem = (px: number) => `${px / 16}rem`;
const em = (n: number) => `${n}em`;
const ms = (n: number) => `${n}ms`;
const px = (n: number) => `${n}px`;
/** 009 decision 5: a fluid size, its ends in rem. */
const clamp = ({ minPx, vw, maxPx }: Fluid) =>
  `clamp(${rem(minPx)}, ${vw}vw, ${rem(maxPx)})`;

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

  // 004 decision 5 and 007 decision 4: the code slots. Each is a reference to
  // a semantic colour and each becomes a utility. The references are written
  // into both theme blocks: a `var()` inside a custom property is substituted
  // on the element that declares it, so a slot declared on `:root` alone
  // computes to the light colour there and that colour inherits into a `.dark`
  // subtree. Repeated in `.dark`, the slot is re-substituted on the subtree's
  // root with the dark values.
  const code: Vars = {};
  for (const [slot, semantic] of Object.entries(tokens.code)) {
    code[`code-${slot}`] = `var(--${semantic})`;
    theme[`color-code-${slot}`] = `var(--code-${slot})`;
  }

  return {
    light: { radius, ...colours(tokens, "light"), ...code },
    dark: { ...colours(tokens, "dark"), ...code },
    theme,
  };
}

/**
 * 009 decision 2: expressive mode's runtime variables, every one in
 * `css[":root"]`. Not in `cssVars`, where the CLI would make each a utility
 * that L22 could not see; not in `@theme inline`, where a value is inlined
 * and a subtree could not set it again. 012 decision 1 removes the stage, its
 * light, the stage radius and the veil's blur.
 */
function expressiveRoot(tokens: Tokens): Record<string, string> {
  const { display, motion, size, gutter } = tokens.expressive;
  const out: Record<string, string> = {};
  // Decision 5: the display slot holds the heading family's string. A subtree
  // that sets it again changes every display line inside it.
  out["--font-face-display"] = tokens.type.families[display.family].family;
  for (const [step, value] of Object.entries(display.steps)) {
    out[`--type-${step}-size`] = clamp(value);
    out[`--type-${step}-leading`] = String(value.lineHeight);
    out[`--type-${step}-tracking`] = em(value.tracking);
  }
  // Decision 6: motion, shape and size.
  out["--motion-press"] = ms(motion.press);
  out["--motion-slide"] = ms(motion.slide);
  out["--motion-busy"] = ms(motion.busy);
  out["--motion-reveal"] = ms(motion.reveal);
  out["--motion-fill"] = ms(motion.fill);
  // 011 decision 8: how long the glass's rim stays lit after the pointer stops.
  out["--motion-light"] = ms(motion.light);
  out["--ease-standard"] = `cubic-bezier(${motion.easeStandard.join(", ")})`;
  // 011 decision 10: the spring, for the mark's dots only (L23).
  out["--ease-spring"] = springEase(motion.spring);
  out["--press-scale"] = String(motion.pressScale);
  // Decision 7: the mode's one value, productive on `:root`.
  out["--radius-action"] = "var(--radius)";
  out["--size-bar"] = rem(size.bar);
  out["--size-action"] = rem(size.action);
  out["--size-action-small"] = rem(size.actionSmall);
  out["--size-track"] = rem(size.track);
  // A hero under a sticky bar fills the screen.
  out["--size-hero-fill"] = "calc(100svh - var(--size-bar))";
  out["--gutter-stage"] = clamp(gutter);
  // 011 decisions 6 and 8: the light theme's fields, surface copies and glass,
  // then the glass's blur, the same in both themes. Frost only: no lens
  // (decisions.md, 2026-11-07).
  Object.assign(out, brandTheme(tokens, "light"));
  out["--glass-blur"] = px(tokens.expressive.glass.blur);
  return out;
}

/** `pluto-theme`'s `css`. No rule nested in an at-rule may use `:root` or `.dark` (001 decision 14). */
export function themeCss(tokens: Tokens): CssTree {
  const { mark, motion, line, focus } = tokens;
  const steps = tokens.expressive.display.steps;
  const darkMark = [1, 2, 3, 4].map((n) =>
    resolveColor(tokens, "dark", `mark-${n}`),
  );
  return {
    ":root": {
      "--mark-dot": em(mark.dot),
      "--mark-gap": em(mark.gap),
      "--mark-rise": em(mark.rise),
      "--mark-lockup-gap": em(mark.lockupGap),
      // 011 decision 7: the lockup sets its mark at a fraction of the word.
      // The em is resolved where the size is used: on the lockup's mark,
      // against the word around it.
      "--mark-lockup-scale": String(mark.lockupScale),
      "--mark-lockup-size": "calc(var(--mark-lockup-scale) * 1em)",
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
      ...expressiveRoot(tokens),
      "color-scheme": "light",
    },
    ".dark": {
      ...brandTheme(tokens, "dark"),
      "color-scheme": "dark",
    },
    "@media (prefers-reduced-motion: reduce)": {
      // 009 decision 6: the five new durations join the two at 0ms, so a
      // script that reads them sees 0, and a press never scales.
      "html:root": {
        "--motion-entrance": "0ms",
        "--motion-micro": "0ms",
        "--motion-press": "0ms",
        "--motion-slide": "0ms",
        "--motion-busy": "0ms",
        "--motion-reveal": "0ms",
        "--motion-fill": "0ms",
        "--motion-light": "0ms",
        "--press-scale": "1",
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
    // 014 decision 5: the same bar for a scroll box inside code, its track the
    // code ground, so a white block carries no wash stripe.
    "@utility scrollbar-code": {
      "scrollbar-color": "var(--input) var(--code-background)",
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
    // animate-* utility cannot carry four delays and four offsets (002
    // decision 9's motion rule, R14).
    "@utility mark-entrance": {
      // 011 decision 10: two animations, the dock on the spring and the fade
      // on the entrance curve, since colour and light never bounce. The
      // shorthand names both with no timing, so Tailwind keeps their
      // @keyframes (it reads names from `animation` alone); the timing is a
      // longhand after it, so an engine without linear() runs both on the
      // initial ease instead of dropping the animation.
      '& > [data-slot="four-dot-dot"]': {
        animation: `pluto-mark-dock ${ENTRANCE_DOT} both, pluto-mark-fade ${ENTRANCE_DOT} both`,
        "animation-timing-function": "var(--ease-spring), var(--ease-entrance)",
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
    // 008 decision 5: the mark's hover reveal, a response, not an entrance.
    // The entrance's path and shares on the micro budget: each dot glides in
    // from its orbit offset when the parent is hovered, the last at its place
    // at 200 ms, and leaves at the same pace with no delay. Only where the
    // primary pointer can hover, as Tailwind's own `hover:` variant does.
    "@utility mark-reveal": {
      '& > [data-slot="four-dot-dot"]': {
        opacity: "0",
        transform:
          "translate(calc(var(--mark-orbit) * var(--_ox)), calc(var(--mark-orbit) * var(--_oy))) scale(0.4)",
        "transition-property": "opacity, transform",
        "transition-duration":
          "calc(var(--motion-micro) * var(--motion-entrance-dot))",
        // 011 decision 10: the opacity on the entrance curve, the transform
        // on the spring.
        "transition-timing-function":
          "var(--ease-entrance), var(--ease-spring)",
      },
      ...Object.fromEntries(
        ENTRANCE_OFFSETS.map(([ox, oy], i) => [
          `& > [data-slot="four-dot-dot"]:nth-child(${i + 1})`,
          { "--_ox": String(ox), "--_oy": String(oy) },
        ]),
      ),
    },
    // 008 decision 5: the reveal's hover rules, as plain rules in a top-level
    // media query. The CLI writes an `@media` nested in an `@utility` as a
    // selector and flattens its rules out of it, so they live here, unlayered,
    // where they also win over the utility's rest state.
    "@media (hover: hover)": {
      ':hover > .mark-reveal > [data-slot="four-dot-dot"]': {
        opacity: "1",
        transform: "none",
      },
      ...Object.fromEntries(
        ENTRANCE_OFFSETS.map((_, i) => [
          `:hover > .mark-reveal > [data-slot="four-dot-dot"]:nth-child(${i + 1})`,
          {
            "transition-delay": `calc(var(--motion-micro) * (var(--motion-entrance-start) + ${i} * var(--motion-entrance-stagger)))`,
          },
        ]),
      ),
    },
    // 007 decision 8: the ink surface, `class="dark surface-ink"` on any
    // element. Two plain rules, not an `@utility`: a utility is layered and
    // loses to the unlayered `.dark` on the same element. The first rule wins
    // over `.dark` by source order (equal specificity), so it is printed after
    // the theme blocks; the second wins by specificity. The code ground and
    // the editor's ground go flush with the surface; the active line is
    // `muted`, one step above the ground on either page. On a dark page the
    // surface is `card`, the raised step, since ink on ink is invisible.
    ".surface-ink": {
      "--code-background": "var(--background)",
      "--code-active-line": "var(--muted)",
      "background-color": "var(--background)",
      color: "var(--foreground)",
    },
    ".dark .surface-ink": {
      "--background": "var(--card)",
    },
    // 009 decision 7: the mode. `data-mode="expressive"` sets the mode's
    // values for its subtree and `data-mode="productive"` resets them, so a
    // productive island inside a stage stays productive: a variable inherits
    // from its nearest ancestor. 011 decision 5 (H1): the action radius is the
    // case radius in both modes; the rule stays, so a later decision can move
    // a value into the mode.
    '[data-mode="productive"]': {
      "--radius-action": "var(--radius)",
    },
    '[data-mode="expressive"]': {
      "--radius-action": "var(--radius)",
    },
    // 011 decision 3: in the dark theme an expressive subtree shows the four
    // colours as the lifted four; after it, a productive island goes back to
    // the dark theme's paper. Plain rules at (0,2,0): they beat the `.dark`
    // block on the element that carries both.
    '.dark [data-mode="expressive"], [data-mode="expressive"].dark': marks(
      EXPRESSIVE_DARK_MARKS.map((name) => tokens.primitives[name]),
    ),
    '.dark [data-mode="productive"], [data-mode="productive"].dark':
      marks(darkMark),
    // 009 decision 7: the action radius. The fallback keeps 8 px corners in
    // an app that re-installs button but declines the theme update.
    "@utility rounded-action": {
      "border-radius": "var(--radius-action, var(--radius))",
    },
    // 009 decision 6: a sticky bar that marks itself never hides focus
    // (WCAG 2.4.11).
    "html:has([data-sticky-bar])": {
      "scroll-padding-top": "var(--size-bar)",
    },
    // 009 decision 6: an action that gives under the finger. Under reduced
    // motion `--press-scale` is 1.
    "@utility action-press": {
      transition: "transform var(--motion-press) var(--ease-standard)",
      "&:active": { transform: "scale(var(--press-scale))" },
    },
    // 009 decision 5: the display steps, `type-*`, since `cn` reads a
    // `text-<word>` as a colour and would drop the step. Each reads the
    // display slot and its step's fluid size; the weight lives here.
    ...Object.fromEntries(
      Object.entries(steps).map(([step, value]) => [
        `@utility type-${step}`,
        {
          "font-family": "var(--font-face-display)",
          "font-size": `var(--type-${step}-size)`,
          "line-height": `var(--type-${step}-leading)`,
          "letter-spacing": `var(--type-${step}-tracking)`,
          "font-weight": String(value.weight),
          ...(value.tabular ? { "font-variant-numeric": "tabular-nums" } : {}),
        },
      ]),
    ),
    // 011 decision 6: the four colour fields. Each paints its fill and sets
    // the roles its text, links and ring read to its legend, the only colour
    // measured on it. A field never shares an element with `.dark`: the
    // unlayered `.dark` would win over this layered utility.
    ...Object.fromEntries(
      FIELDS.map((name) => [
        `@utility ${name}`,
        {
          "background-color": `var(--${name})`,
          color: `var(--${name}-foreground)`,
          ...Object.fromEntries(
            FIELD_ROLES.map((role) => [
              `--${role}`,
              `var(--${name}-foreground)`,
            ]),
          ),
          "--border": `color-mix(in srgb, var(--${name}-foreground) 24%, transparent)`,
          // A primary fill on the field (a badge, a meter) inverts to the one
          // pair measured on it: the legend as fill, the field as its text.
          "--primary-foreground": `var(--${name})`,
        },
      ]),
    ),
    // 011 decision 6: an opaque surface inside a field takes the theme's own
    // roles back. The item that paints the ground carries it.
    "@utility surface-plain": surfacePlain(),
    // 011 decision 8 (I9): liquid glass, expressive only. A frosted tint, a
    // lit edge, the case radius, and the theme's own roles (surface-plain's)
    // with the text colour set from them. The specular rim is the ::after,
    // masked to the border ring so light never falls on the text; it shows
    // only while `pointerLight` sets --glass-lit.
    "@utility glass": {
      position: "relative",
      isolation: "isolate",
      "background-color": "var(--glass-tint)",
      "-webkit-backdrop-filter": "blur(var(--glass-blur))",
      "backdrop-filter": "blur(var(--glass-blur))",
      border: "var(--line-width) solid var(--glass-edge)",
      "border-radius": "var(--radius)",
      "box-shadow": "inset 0 1px 0 var(--glass-rim), var(--glass-shadow)",
      ...surfacePlain(),
      color: "var(--foreground)",
      "&::after": {
        content: '""',
        position: "absolute",
        inset: "calc(-1 * var(--line-width))",
        padding: "var(--line-width)",
        "border-radius": "inherit",
        "pointer-events": "none",
        background:
          "radial-gradient(160px circle at var(--glass-x, 50%) var(--glass-y, 0%), var(--glass-light), transparent 70%)",
        // The prefixed pair first: Firefox reads -webkit-mask as mask, so the
        // standard declaration must come last.
        "-webkit-mask":
          "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
        "-webkit-mask-composite": "xor",
        mask: "linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)",
        opacity: "var(--glass-lit, 0)",
        transition: "opacity var(--motion-reveal) var(--ease-standard)",
      },
    },
    // 011 decision 8: the glass turns opaque where blur is unsupported, under
    // reduced transparency and under forced colours. Plain rules printed
    // after the utility, so they win over it.
    "@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)))":
      { ".glass": glassOpaque() },
    "@media (prefers-reduced-transparency: reduce)": {
      ".glass": glassOpaque(),
    },
    "@media (forced-colors: active)": {
      ".glass": { ...glassOpaque(), "border-color": "CanvasText" },
    },
    // 012 decision 5: a flat card answers a run with an edge drawn inside it,
    // in the primary, against its own ground; no shadow at rest. A utility,
    // since L3 bans ring-* classes.
    "@utility busy-edge": {
      transition: "box-shadow var(--motion-busy) var(--ease-standard)",
      "&[data-busy]": {
        "box-shadow": "inset 0 0 0 calc(2 * var(--line-width)) var(--primary)",
      },
    },
    // 002 decision 3: the keyframes behind animate-enter and animate-exit.
    "@keyframes pluto-enter": { from: { opacity: "0" } },
    "@keyframes pluto-exit": { to: { opacity: "0" } },
    // 006 decision 4: a dot's start, small at its orbit offset. No `to`: the
    // end state is the composed mark. 011 decision 10 splits the opacity
    // into its own keyframes, so the dock alone takes the spring.
    "@keyframes pluto-mark-dock": {
      from: {
        transform:
          "translate(calc(var(--mark-orbit) * var(--_ox)), calc(var(--mark-orbit) * var(--_oy))) scale(0.4)",
      },
    },
    "@keyframes pluto-mark-fade": { from: { opacity: "0" } },
    "@layer base": {
      body: { "@apply bg-background text-foreground": {} },
      "h1, h2, h3, h4, h5, h6": { "@apply font-heading": {} },
      ":focus-visible": {
        outline: "var(--focus-width) solid var(--ring)",
        "outline-offset": "var(--focus-offset)",
      },
      // Code shows the characters that were typed (004). JetBrains Mono's
      // contextual ligatures drew `!=` as one glyph, which copy does not
      // return. The same rule sits on the editor's scroller.
      [monoSelector(tokens)]: { "font-variant-ligatures": "none" },
      // 014 decision 15: inline code, a code element outside a pre and a
      // heading, is a chip on the code ground edged by the hairline, as a
      // block is: the case radius, one atom of side padding and none above
      // or below, so the line height holds. Inside a link it takes the link
      // colour. In the base layer, a class an item sets on its code wins.
      "code:not(pre code, :is(h1, h2, h3, h4, h5, h6) code)": {
        "@apply rounded border border-border bg-code-background px-1 text-code-text box-decoration-clone":
          {},
      },
      "a code:not(pre code, :is(h1, h2, h3, h4, h5, h6) code)": {
        "@apply text-code-link": {},
      },
    },
    // 004 decision 5: the native meter on the muted track with a primary fill.
    // Pseudo-elements cannot be classes, and an item may hold no <style>. No
    // radius: the meter has square ends (004 decision 14). All three WebKit
    // value states take primary so an app that sets low/high/optimum gets no
    // browser green or yellow.
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

/** 011 decision 8: the glass's opaque fallback. */
function glassOpaque(): Record<string, string> {
  return {
    "background-color": "var(--glass-fallback)",
    "-webkit-backdrop-filter": "none",
    "backdrop-filter": "none",
  };
}

/** A font item's `font` object (001 decision 17). */
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

/**
 * The `@layer base` rules the CLI writes for the font items (§4 of
 * `context/research/2026-10-27-the-foundation-run-kit-3-fonts-and-the-theme-item.md`).
 */
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
  // A colour utility for each theme variable. The code slots' utilities are
  // already in `vars.theme`, which the registry item carries, so they are
  // not written a second time.
  const colourTheme: Vars = {};
  for (const name of Object.keys(vars.dark))
    if (!(`color-${name}` in vars.theme))
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
  // The CLI places an item's @keyframes inside the app's @theme inline
  // (https://github.com/huntabyte/shadcn-svelte/blob/shadcn-svelte%401.7.1/packages/cli/src/utils/updaters/update-css.ts),
  // so the preview's CSS does too.
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
