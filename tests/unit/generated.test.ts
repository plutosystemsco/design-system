import { beforeAll, describe, expect, test } from "bun:test";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { generateTokenOutputs } from "../../scripts/build-tokens.ts";
import { classTokens } from "../../scripts/lint-literals.ts";
import { blocks, topLevelMap } from "../helpers/css.ts";

type CssTree = { [key: string]: string | CssTree };
type Item = { name: string; cssVars?: unknown; css?: CssTree; font?: unknown };

const TOKEN_ITEMS = [
  "pluto-theme",
  "font-geist",
  "font-heading-ibm-plex-sans",
  "font-jetbrains-mono",
];
let fresh: { registryJson: string; appCss: string };

beforeAll(async () => {
  fresh = await generateTokenOutputs();
});

function items(json: string): Map<string, Item> {
  return new Map((JSON.parse(json).items as Item[]).map((i) => [i.name, i]));
}

describe("generated files equal a fresh, prettier-formatted build:tokens run", () => {
  test.each(TOKEN_ITEMS)("registry.json's %s token fields", (name) => {
    const committed = items(readFileSync("registry.json", "utf8")).get(name);
    const built = items(fresh.registryJson).get(name);
    expect(committed).toBeDefined();
    expect(committed?.cssVars).toEqual(built?.cssVars);
    expect(committed?.css).toEqual(built?.css);
    expect(committed?.font).toEqual(built?.font);
  });

  test("registry.json, byte for byte", () => {
    expect(readFileSync("registry.json", "utf8")).toBe(fresh.registryJson);
  });

  test("src/app.css, byte for byte", () => {
    expect(readFileSync("src/app.css", "utf8")).toBe(fresh.appCss);
  });
});

describe("pluto-theme's css", () => {
  const theme = () =>
    items(readFileSync("registry.json", "utf8")).get("pluto-theme")!;

  function nestedSelectors(
    tree: CssTree,
    insideAtRule: boolean,
    out: string[],
  ) {
    for (const [key, value] of Object.entries(tree)) {
      if (typeof value === "string") continue;
      if (key.startsWith("@")) nestedSelectors(value, true, out);
      else {
        if (insideAtRule) out.push(key);
        nestedSelectors(value, insideAtRule, out);
      }
    }
    return out;
  }

  test("no rule nested in an at-rule uses :root or .dark", () => {
    const selectors = nestedSelectors(theme().css!, false, []);
    expect(selectors.length).toBeGreaterThan(0);
    const offending = selectors.filter((s) =>
      s.split(",").some((part) => [".dark", ":root"].includes(part.trim())),
    );
    expect(offending).toEqual([]);
  });

  // 001 criterion 5's two selectors, and 006 decision 4's third: the
  // entrance's dots carry no animation under reduce, so they are the
  // composed mark before any frame.
  test("the reduced-motion block holds exactly html:root, *, ::before, ::after, and the entrance's animation: none", () => {
    const block = theme().css![
      "@media (prefers-reduced-motion: reduce)"
    ] as CssTree;
    expect(Object.keys(block)).toEqual([
      "html:root",
      "*, ::before, ::after",
      '.mark-entrance [data-slot="four-dot-dot"]',
    ]);
    expect(block['.mark-entrance [data-slot="four-dot-dot"]']).toEqual({
      animation: "none",
    });
  });

  test("src/app.css nests no :root or .dark inside an at-rule either", () => {
    const css = readFileSync("src/app.css", "utf8");
    const nested = blocks(css)
      .filter((b) => b.prelude.startsWith("@"))
      .flatMap((b) => b.children.map((c) => c.prelude));
    const offending = nested.filter((s) =>
      s.split(",").some((part) => [".dark", ":root"].includes(part.trim())),
    );
    expect(offending).toEqual([]);
  });
});

describe("002's additions to pluto-theme", () => {
  const theme = () =>
    items(readFileSync("registry.json", "utf8")).get("pluto-theme") as Item & {
      cssVars: { theme: Record<string, string> };
      css: CssTree;
    };

  test.each([
    [
      "@utility focus-ring",
      {
        outline: "var(--focus-width) solid var(--ring)",
        "outline-offset": "var(--focus-offset)",
      },
    ],
    ["@utility focus-ring-none", { outline: "none" }],
    ["@keyframes pluto-enter", { from: { opacity: "0" } }],
    ["@keyframes pluto-exit", { to: { opacity: "0" } }],
  ] as const)("css holds %s", (key, value) => {
    expect(theme().css[key]).toEqual(value);
  });

  test.each([
    [
      "shadow-elevation",
      "0 0 0 var(--line-width) var(--elevation-line), 0 0.75rem 2rem 0 var(--elevation-shadow)",
    ],
    [
      "animate-enter",
      "pluto-enter var(--motion-micro) cubic-bezier(0.2, 0.7, 0.3, 1)",
    ],
    [
      "animate-exit",
      "pluto-exit var(--motion-micro) cubic-bezier(0.2, 0.7, 0.3, 1) forwards",
    ],
  ])("cssVars.theme holds %s", (key, value) => {
    expect(theme().cssVars.theme[key]).toBe(value);
  });
});

/** 004 decision 5 and 007 decisions 2 and 4: the 21 code tokens in both theme blocks, the scrollbar utility and the meter's rules. */
describe("004's additions to pluto-theme", () => {
  const SLOTS: [slot: string, semantic: string][] = [
    ["foreground", "foreground"],
    ["background", "muted"],
    ["comment", "muted-foreground"],
    ["keyword", "primary"],
    ["constant", "primary"],
    ["string", "success"],
    ["number", "syntax-orange"],
    ["escape", "syntax-orange"],
    ["function", "syntax-amber"],
    ["builtin", "syntax-purple"],
    ["type", "syntax-teal"],
    ["tag", "syntax-teal"],
    ["property", "syntax-cyan"],
    ["decorator", "syntax-purple"],
    ["self", "syntax-purple"],
    ["link", "primary"],
    ["invalid", "destructive"],
    ["inserted", "success"],
    ["deleted", "destructive"],
    ["changed", "primary"],
    ["active-line", "card"],
  ];
  const theme = () =>
    items(readFileSync("registry.json", "utf8")).get("pluto-theme") as Item & {
      cssVars: {
        light: Record<string, string>;
        dark: Record<string, string>;
        theme: Record<string, string>;
      };
      css: CssTree;
    };

  test("cssVars.light holds the 21 code-* variables, each var(--<semantic>)", () => {
    expect(SLOTS).toHaveLength(21);
    const light = theme().cssVars.light;
    const keys = Object.keys(light).filter((k) => k.startsWith("code-"));
    expect(keys).toEqual(SLOTS.map(([slot]) => `code-${slot}`));
    for (const [slot, semantic] of SLOTS)
      expect(light[`code-${slot}`]).toBe(`var(--${semantic})`);
  });

  // 007 decision 4: a subtree re-substitutes the references with its own values.
  test("cssVars.dark holds the same 21 code-* variables", () => {
    const dark = theme().cssVars.dark;
    const keys = Object.keys(dark).filter((k) => k.startsWith("code-"));
    expect(keys).toEqual(SLOTS.map(([slot]) => `code-${slot}`));
    for (const [slot, semantic] of SLOTS)
      expect(dark[`code-${slot}`]).toBe(`var(--${semantic})`);
  });

  test("cssVars.theme holds the 21 color-code-* utilities, each var(--code-<slot>)", () => {
    const vars = theme().cssVars.theme;
    const keys = Object.keys(vars).filter((k) => k.startsWith("color-code-"));
    expect(keys).toEqual(SLOTS.map(([slot]) => `color-code-${slot}`));
    for (const [slot] of SLOTS)
      expect(vars[`color-code-${slot}`]).toBe(`var(--code-${slot})`);
  });

  // 007 decision 3: the five syntax pairs sit in both theme blocks.
  test("cssVars.light and cssVars.dark each hold the 5 syntax-* names", () => {
    const names = [
      "syntax-orange",
      "syntax-amber",
      "syntax-purple",
      "syntax-teal",
      "syntax-cyan",
    ];
    for (const block of ["light", "dark"] as const) {
      const vars = theme().cssVars[block];
      expect(Object.keys(vars).filter((k) => k.startsWith("syntax-"))).toEqual(
        names,
      );
    }
    expect(theme().cssVars.light["syntax-amber"]).toBe("#915B00");
    expect(theme().cssVars.dark["syntax-amber"]).toBe("#F19E20");
  });

  test("css holds @utility scrollbar: the input thumb on the muted track, thin", () => {
    expect(theme().css["@utility scrollbar"]).toEqual({
      "scrollbar-color": "var(--input) var(--muted)",
      "scrollbar-width": "thin",
    });
  });

  test("css holds the meter's rules in @layer components, with 5 pseudo-elements and no radius", () => {
    const layer = theme().css["@layer components"] as CssTree;
    expect(layer).toBeDefined();
    expect(layer['[data-slot="meter"]']).toEqual({
      appearance: "none",
      background: "var(--muted)",
    });
    expect(layer['[data-slot="meter"]::-webkit-meter-bar']).toEqual({
      background: "var(--muted)",
    });
    for (const pseudo of [
      "::-webkit-meter-optimum-value",
      "::-webkit-meter-suboptimum-value",
      "::-webkit-meter-even-less-good-value",
      "::-moz-meter-bar",
    ])
      expect(layer[`[data-slot="meter"]${pseudo}`]).toEqual({
        background: "var(--primary)",
      });
    expect(Object.keys(layer).filter((k) => k.includes("::"))).toHaveLength(5);
    expect(JSON.stringify(layer)).not.toContain("radius");
  });

  // No ligatures on code surfaces.
  test("css's @layer base turns ligatures off for code, kbd, samp, pre; app.css carries the rule once, beside font-mono", () => {
    const base = theme().css["@layer base"] as CssTree;
    expect(base["code, kbd, samp, pre"]).toEqual({
      "font-variant-ligatures": "none",
    });
    const css = readFileSync("src/app.css", "utf8");
    const rule = /code,\s*kbd,\s*samp,\s*pre\s*\{([^}]*)\}/g;
    const bodies = [...css.matchAll(rule)].map((m) => m[1]);
    expect(bodies).toHaveLength(1);
    expect(bodies[0]).toContain("font-variant-ligatures: none;");
    expect(bodies[0]).toContain("@apply font-mono;");
  });

  test("src/app.css carries the 21 code variables in :root and in .dark, 21 color-code-* lines, 5 syntax-* per theme block, the utility and the meter rules", () => {
    const css = readFileSync("src/app.css", "utf8");
    for (const block of [":root", ".dark"]) {
      const vars = topLevelMap(css, block);
      const code = [...vars.keys()].filter((k) => k.startsWith("--code-"));
      expect(code, block).toEqual(SLOTS.map(([slot]) => `--code-${slot}`));
      for (const [slot, semantic] of SLOTS)
        expect(vars.get(`--code-${slot}`), block).toBe(`var(--${semantic})`);
      expect(
        [...vars.keys()].filter((k) => k.startsWith("--syntax-")),
        block,
      ).toHaveLength(5);
    }
    const inline = topLevelMap(css, "@theme inline");
    expect(
      [...inline.keys()].filter((k) => k.startsWith("--color-code-")),
    ).toHaveLength(21);
    expect(css).toContain("--color-code-keyword: var(--code-keyword);");
    expect(css).toContain("@utility scrollbar {");
    expect(css).toContain("@layer components {");
    expect(css).toContain('[data-slot="meter"]::-moz-meter-bar');
  });
});

/** 007 decision 8: the ink surface's two plain rules, after the theme blocks. */
describe("007's additions to pluto-theme", () => {
  const theme = () =>
    items(readFileSync("registry.json", "utf8")).get("pluto-theme") as Item & {
      css: CssTree;
    };

  test("css holds .surface-ink with its 4 declarations and .dark .surface-ink with 1", () => {
    expect(theme().css[".surface-ink"]).toEqual({
      "--code-background": "var(--background)",
      "--code-active-line": "var(--muted)",
      "background-color": "var(--background)",
      color: "var(--foreground)",
    });
    expect(theme().css[".dark .surface-ink"]).toEqual({
      "--background": "var(--card)",
    });
  });

  test("src/app.css carries each rule once, and .surface-ink { after .dark {", () => {
    const css = readFileSync("src/app.css", "utf8");
    expect(css.match(/^\.surface-ink \{/gm)).toHaveLength(1);
    expect(css.match(/^\.dark \.surface-ink \{/gm)).toHaveLength(1);
    expect(css.match(/^\.dark \{/gm)).toHaveLength(1);
    expect(css.indexOf("\n.dark {")).toBeLessThan(
      css.indexOf("\n.surface-ink {"),
    );
    const surface = topLevelMap(css, ".surface-ink");
    expect([...surface.entries()]).toEqual([
      ["--code-background", "var(--background)"],
      ["--code-active-line", "var(--muted)"],
      ["background-color", "var(--background)"],
      ["color", "var(--foreground)"],
    ]);
    expect([...topLevelMap(css, ".dark .surface-ink").entries()]).toEqual([
      ["--background", "var(--card)"],
    ]);
  });
});

/** 005 decision 5: the vertical groove, owned by the inset on its start edge. */
describe("005's addition to pluto-theme", () => {
  const theme = () =>
    items(readFileSync("registry.json", "utf8")).get("pluto-theme") as Item & {
      css: CssTree;
    };

  test("css holds @utility groove-s with its two declarations: the hairline first, the light inside it", () => {
    expect(theme().css["@utility groove-s"]).toEqual({
      "border-inline-start": "var(--line-width) solid var(--groove-line)",
      "box-shadow": "inset var(--line-width) 0 0 var(--groove-light)",
    });
    expect(Object.keys(theme().css["@utility groove-s"] as CssTree)).toEqual([
      "border-inline-start",
      "box-shadow",
    ]);
  });

  test("src/app.css carries @utility groove-s once", () => {
    const css = readFileSync("src/app.css", "utf8");
    expect(css.match(/@utility groove-s \{/g)).toHaveLength(1);
    expect(css).toContain(
      "border-inline-start: var(--line-width) solid var(--groove-line);",
    );
    expect(css).toContain(
      "box-shadow: inset var(--line-width) 0 0 var(--groove-light);",
    );
  });
});

/** 006 decision 4: the orbit token, the entrance's three numbers, its keyframes and utility, and groove-b. */
describe("006's additions to pluto-theme", () => {
  const theme = () =>
    items(readFileSync("registry.json", "utf8")).get("pluto-theme") as Item & {
      css: CssTree;
    };
  const root = () => theme().css[":root"] as CssTree;

  test(":root holds --mark-orbit: 0.5em beside the mark's em tokens, and the three unitless entrance numbers", () => {
    expect(root()["--mark-orbit"]).toBe("0.5em");
    expect(root()["--motion-entrance-dot"]).toBe("0.55");
    expect(root()["--motion-entrance-start"]).toBe("0.15");
    expect(root()["--motion-entrance-stagger"]).toBe("0.1");
    const keys = Object.keys(root());
    expect(keys.indexOf("--mark-orbit")).toBeGreaterThan(
      keys.indexOf("--mark-dot"),
    );
    expect(keys.indexOf("--mark-orbit")).toBeLessThan(
      keys.indexOf("--motion-entrance"),
    );
  });

  // 011 decision 10: the dock carries the transform alone, so it can take the
  // spring; the opacity is pluto-mark-fade's, on the entrance curve.
  test("css holds @keyframes pluto-mark-dock (the transform) and pluto-mark-fade (the opacity), each a from frame and no to", () => {
    expect(theme().css["@keyframes pluto-mark-dock"]).toEqual({
      from: {
        transform:
          "translate(calc(var(--mark-orbit) * var(--_ox)), calc(var(--mark-orbit) * var(--_oy))) scale(0.4)",
      },
    });
    expect(theme().css["@keyframes pluto-mark-fade"]).toEqual({
      from: { opacity: "0" },
    });
  });

  test("css holds @utility mark-entrance: the dots' animation from the tokens, then 4 nth-child rules with the design book's offsets and staggered delays", () => {
    const utility = theme().css["@utility mark-entrance"] as CssTree;
    const keys = Object.keys(utility);
    expect(keys).toHaveLength(5);
    // 011 decision 10: two animations. The shorthand names both, with no
    // timing in it, so Tailwind keeps their @keyframes (it reads names from
    // `animation` alone); the timing is a longhand after it, so an engine
    // without linear() runs both on the initial ease, never none.
    const D = "calc(var(--motion-entrance) * var(--motion-entrance-dot))";
    expect(utility['& > [data-slot="four-dot-dot"]']).toEqual({
      animation: `pluto-mark-dock ${D} both, pluto-mark-fade ${D} both`,
      "animation-timing-function": "var(--ease-spring), var(--ease-entrance)",
    });
    expect(
      Object.keys(utility['& > [data-slot="four-dot-dot"]'] as CssTree),
    ).toEqual(["animation", "animation-timing-function"]);
    const offsets = [
      ["-1", "0.6"],
      ["0.8", "-0.8"],
      ["-0.6", "-1"],
      ["1", "0.8"],
    ];
    const nth = keys.filter((k) => k.includes(":nth-child("));
    expect(nth).toHaveLength(4);
    nth.forEach((key, i) => {
      expect(key).toBe(`& > [data-slot="four-dot-dot"]:nth-child(${i + 1})`);
      expect(utility[key]).toEqual({
        "--_ox": offsets[i]![0],
        "--_oy": offsets[i]![1],
        "animation-delay": `calc(var(--motion-entrance) * (var(--motion-entrance-start) + ${i} * var(--motion-entrance-stagger)))`,
      });
    });
  });

  test("css holds @utility groove-b: the hairline on the bottom edge, then the light below it", () => {
    expect(theme().css["@utility groove-b"]).toEqual({
      "border-bottom": "var(--line-width) solid var(--groove-line)",
      "box-shadow": "0 var(--line-width) 0 var(--groove-light)",
    });
    expect(Object.keys(theme().css["@utility groove-b"] as CssTree)).toEqual([
      "border-bottom",
      "box-shadow",
    ]);
  });

  test("src/app.css carries the token, the numbers, the keyframes inside @theme inline, both utilities once, and the reduce rule", () => {
    const css = readFileSync("src/app.css", "utf8");
    expect(css).toContain("--mark-orbit: 0.5em;");
    expect(css).toContain("--motion-entrance-dot: 0.55;");
    expect(css).toContain("--motion-entrance-start: 0.15;");
    expect(css).toContain("--motion-entrance-stagger: 0.1;");
    expect(css.match(/@keyframes pluto-mark-dock \{/g)).toHaveLength(1);
    expect(css.match(/@keyframes pluto-mark-fade \{/g)).toHaveLength(1);
    const theme = blocks(css).find((b) => b.prelude === "@theme inline")!;
    expect(theme.children.map((c) => c.prelude)).toEqual(
      expect.arrayContaining([
        "@keyframes pluto-mark-dock",
        "@keyframes pluto-mark-fade",
      ]),
    );
    expect(css.match(/@utility mark-entrance \{/g)).toHaveLength(1);
    // Four on mark-entrance; 008 adds eight for mark-reveal (offsets and delays).
    expect(css.match(/:nth-child\([1-4]\)/g)).toHaveLength(12);
    expect(css.match(/@utility groove-b \{/g)).toHaveLength(1);
    expect(css).toContain(
      "box-shadow: 0 var(--line-width) 0 var(--groove-light);",
    );
    const reduce = blocks(css).find(
      (b) => b.prelude === "@media (prefers-reduced-motion: reduce)",
    )!;
    expect(reduce.children.map((c) => c.prelude)).toEqual([
      "html:root",
      "*, ::before, ::after",
      '.mark-entrance [data-slot="four-dot-dot"]',
    ]);
  });
});

/**
 * 008 decision 5, criterion 16: the hover reveal. One utility, the entrance's
 * offsets, its shares on the micro budget, the hover rules inside
 * `(hover: hover)`; the reduce block is unchanged.
 */
describe("008's mark-reveal", () => {
  const theme = () =>
    items(readFileSync("registry.json", "utf8")).get("pluto-theme") as Item & {
      css: CssTree;
    };
  const DOT = '[data-slot="four-dot-dot"]';
  test("css holds @utility mark-reveal (the rest state and the entrance's 4 offsets) and a top-level (hover: hover) block of its hover rules", () => {
    const reveal = theme().css["@utility mark-reveal"] as CssTree;
    const entrance = theme().css["@utility mark-entrance"] as CssTree;
    expect(reveal[`& > ${DOT}`]).toEqual({
      opacity: "0",
      transform:
        "translate(calc(var(--mark-orbit) * var(--_ox)), calc(var(--mark-orbit) * var(--_oy))) scale(0.4)",
      "transition-property": "opacity, transform",
      "transition-duration":
        "calc(var(--motion-micro) * var(--motion-entrance-dot))",
      // 011 decision 10: the opacity on the entrance curve, the transform on the spring.
      "transition-timing-function": "var(--ease-entrance), var(--ease-spring)",
    });
    for (let i = 1; i <= 4; i++) {
      const key = `& > ${DOT}:nth-child(${i})`;
      const e = entrance[key] as Record<string, string>;
      expect(reveal[key]).toEqual({ "--_ox": e["--_ox"], "--_oy": e["--_oy"] });
    }
    // The hover rules are top-level, outside the utility: the CLI flattens an
    // @media nested in an @utility.
    expect(Object.keys(reveal)).toHaveLength(5);
    const hover = theme().css["@media (hover: hover)"] as CssTree;
    const REVEAL = `:hover > .mark-reveal > ${DOT}`;
    expect(hover[REVEAL]).toEqual({ opacity: "1", transform: "none" });
    for (let i = 1; i <= 4; i++) {
      expect(hover[`${REVEAL}:nth-child(${i})`]).toEqual({
        "transition-delay": `calc(var(--motion-micro) * (var(--motion-entrance-start) + ${i - 1} * var(--motion-entrance-stagger)))`,
      });
    }
  });

  test("src/app.css holds @utility mark-reveal once", () => {
    const css = readFileSync("src/app.css", "utf8");
    expect(css.match(/@utility mark-reveal \{/g)).toHaveLength(1);
  });
});

/**
 * 009 decision 2, criterion 1: every variable 009 adds lives in
 * `pluto-theme`'s `css[":root"]`, beside `--mark-dot`, and so in `src/app.css`'s
 * `:root`. None is in `cssVars` (the CLI would make utilities of it) or in
 * `@theme inline` (a value there is not a runtime variable).
 */
const VARIABLES_009 = [
  // 012 decision 1: the stage, its light, --radius-stage and --blur-veil are
  // gone; the display, motion, size and gutter variables stay.
  // display
  "--font-face-display",
  "--type-display-size",
  "--type-display-leading",
  "--type-display-tracking",
  "--type-section-size",
  "--type-section-leading",
  "--type-section-tracking",
  "--type-proof-size",
  "--type-proof-leading",
  "--type-proof-tracking",
  // motion
  "--motion-press",
  "--motion-slide",
  "--motion-busy",
  "--motion-reveal",
  "--motion-fill",
  "--ease-standard",
  "--press-scale",
  // shape and size (011 decision 5: --radius-pill is no longer emitted)
  "--radius-action",
  "--size-bar",
  "--size-action",
  "--size-action-small",
  "--size-track",
  "--size-hero-fill",
  "--gutter-stage",
];

describe("009's variables (criterion 1)", () => {
  const theme = () =>
    items(readFileSync("registry.json", "utf8")).get("pluto-theme") as Item & {
      cssVars: Record<"light" | "dark" | "theme", Record<string, string>>;
      css: CssTree;
    };

  test("24 names, each once", () => {
    expect(VARIABLES_009).toHaveLength(24);
    expect(new Set(VARIABLES_009).size).toBe(24);
  });

  test("css[':root'] holds all 24", () => {
    const root = theme().css[":root"] as CssTree;
    expect(VARIABLES_009.filter((name) => name in root)).toEqual(VARIABLES_009);
  });

  test("cssVars holds none of them, in light, dark or theme", () => {
    for (const block of ["light", "dark", "theme"] as const) {
      const keys = Object.keys(theme().cssVars[block]).map((k) => `--${k}`);
      expect(
        VARIABLES_009.filter((name) => keys.includes(name)),
        block,
      ).toEqual([]);
    }
  });

  test("src/app.css declares all 24 in :root, and none in .dark or @theme inline", () => {
    const css = readFileSync("src/app.css", "utf8");
    const root = topLevelMap(css, ":root");
    expect(VARIABLES_009.filter((name) => root.has(name))).toEqual(
      VARIABLES_009,
    );
    for (const block of [".dark", "@theme inline"]) {
      const map = topLevelMap(css, block);
      expect(
        VARIABLES_009.filter((name) => map.has(name)),
        block,
      ).toEqual([]);
    }
  });

  // Decisions 3 to 7: each value from the token file, as the specification's tables give it.
  test.each([
    ["--font-face-display", "'IBM Plex Sans Variable', system-ui, sans-serif"],
    ["--type-display-size", "clamp(3rem, 6vw, 5.75rem)"],
    ["--type-display-leading", "0.95"],
    ["--type-display-tracking", "-0.045em"],
    ["--type-section-size", "clamp(2.25rem, 4vw, 3.5rem)"],
    ["--type-section-leading", "1.05"],
    ["--type-section-tracking", "-0.035em"],
    ["--type-proof-size", "clamp(3.5rem, 6vw, 6rem)"],
    ["--type-proof-leading", "1"],
    ["--type-proof-tracking", "-0.04em"],
    ["--motion-press", "160ms"],
    ["--motion-slide", "220ms"],
    ["--motion-busy", "400ms"],
    ["--motion-reveal", "600ms"],
    ["--motion-fill", "700ms"],
    ["--ease-standard", "cubic-bezier(0.2, 0.7, 0.2, 1)"],
    ["--press-scale", "0.98"],
    ["--radius-action", "var(--radius)"],
    ["--size-bar", "4.5rem"],
    ["--size-action", "3.25rem"],
    ["--size-action-small", "2.375rem"],
    ["--size-track", "0.375rem"],
    ["--size-hero-fill", "calc(100svh - var(--size-bar))"],
    ["--gutter-stage", "clamp(1rem, 4vw, 3.5rem)"],
  ])("css[':root'] sets %s to %s", (name, value) => {
    expect((theme().css[":root"] as CssTree)[name]).toBe(value);
  });

  // Decision 7: the mode sets one value; a nested productive island resets
  // it. 011 decision 5 (H1): the expressive value is the case radius too; the
  // rule stays so a later decision can move a value into the mode.
  test("css holds the two mode rules and @utility rounded-action with its fallback", () => {
    const css = theme().css;
    expect(css['[data-mode="productive"]']).toEqual({
      "--radius-action": "var(--radius)",
    });
    expect(css['[data-mode="expressive"]']).toEqual({
      "--radius-action": "var(--radius)",
    });
    expect(css["@utility rounded-action"]).toEqual({
      "border-radius": "var(--radius-action, var(--radius))",
    });
    const app = readFileSync("src/app.css", "utf8");
    expect([...topLevelMap(app, '[data-mode="expressive"]').entries()]).toEqual(
      [["--radius-action", "var(--radius)"]],
    );
    expect(app.match(/@utility rounded-action \{/g)).toHaveLength(1);
  });

  // 011 decision 3: in the dark theme an expressive subtree shows the mark's
  // four colours, as the lifted four; a productive island inside it goes back
  // to the dark theme's paper (009 decision 7). Plain rules, after the modes.
  test("css holds the dark expressive mark rule, then the productive reset, after the mode rules", () => {
    const css = theme().css;
    const EXPRESSIVE =
      '.dark [data-mode="expressive"], [data-mode="expressive"].dark';
    const PRODUCTIVE =
      '.dark [data-mode="productive"], [data-mode="productive"].dark';
    expect(css[EXPRESSIVE]).toEqual({
      "--mark-1": "#93B0FF",
      "--mark-2": "#FF9491",
      "--mark-3": "#F19E20",
      "--mark-4": "#60C498",
    });
    expect(css[PRODUCTIVE]).toEqual({
      "--mark-1": "#F3F0E8",
      "--mark-2": "#F3F0E8",
      "--mark-3": "#F3F0E8",
      "--mark-4": "#F3F0E8",
    });
    const keys = Object.keys(css);
    expect(keys.indexOf('[data-mode="expressive"]')).toBeLessThan(
      keys.indexOf(EXPRESSIVE),
    );
    expect(keys.indexOf(EXPRESSIVE)).toBe(keys.indexOf(PRODUCTIVE) - 1);
    const app = readFileSync("src/app.css", "utf8");
    const preludes = blocks(app).map((b) => b.prelude);
    expect(preludes.filter((p) => p === EXPRESSIVE)).toHaveLength(1);
    expect(preludes.filter((p) => p === PRODUCTIVE)).toHaveLength(1);
    expect(preludes.indexOf(".dark")).toBeLessThan(
      preludes.indexOf(EXPRESSIVE),
    );
    expect(preludes.indexOf(EXPRESSIVE)).toBeLessThan(
      preludes.indexOf(PRODUCTIVE),
    );
    expect([...topLevelMap(app, PRODUCTIVE).values()]).toEqual([
      "#f3f0e8",
      "#f3f0e8",
      "#f3f0e8",
      "#f3f0e8",
    ]);
  });

  // 011 criterion 1: the pill is gone from both outputs.
  test("--radius-pill is not emitted, in registry.json or src/app.css", () => {
    expect(JSON.stringify(theme())).not.toContain("--radius-pill");
    expect(readFileSync("src/app.css", "utf8")).not.toContain("--radius-pill");
  });
});

/**
 * 009 criterion 2: every custom property `v0.8.0`'s `src/app.css` declares in
 * `:root`, `.dark` and `@theme inline` keeps its value. The fixture was
 * extracted from `git show 6fbdf99:src/app.css` with `topLevelMap`.
 *
 * 011 decisions 2 to 4 move the colours: the palette of decision 2, the dark
 * canvas and sidebar on graphite (decision 3), and the light theme's flat
 * overlays and groove (decision 4). Each moved property is listed here with
 * its 0.11.0 value, transcribed from the specification's tables; every other
 * property keeps v0.8.0's value.
 */
const MOVED_011: Record<":root" | ".dark", Record<string, string>> = {
  ":root": {
    "--background": "#f3f0e8",
    "--foreground": "#0b0f17",
    "--card-foreground": "#0b0f17",
    "--popover-foreground": "#0b0f17",
    "--primary": "#2d48d4",
    "--secondary-foreground": "#0b0f17",
    "--muted": "#e9e5db",
    "--muted-foreground": "#505661",
    "--accent": "#e9e5db",
    "--accent-foreground": "#0b0f17",
    "--destructive": "#c11e31",
    "--border": "#0b0f171a",
    "--input": "#857e70",
    "--ring": "#2d48d4",
    "--chart-1": "#2d48d4",
    "--chart-2": "#c92035",
    "--chart-3": "#f19e20",
    "--chart-4": "#008058",
    "--chart-5": "#505661",
    "--sidebar": "#f3f0e8",
    "--sidebar-foreground": "#0b0f17",
    "--sidebar-primary": "#2d48d4",
    "--sidebar-accent": "#e9e5db",
    "--sidebar-accent-foreground": "#0b0f17",
    "--sidebar-border": "#0b0f171a",
    "--sidebar-ring": "#2d48d4",
    "--destructive-fill": "#c92035",
    "--success": "#007351",
    "--success-fill": "#008058",
    "--caution": "#f19e20",
    "--caution-foreground": "#0b0f17",
    "--mark-1": "#2d48d4",
    "--mark-2": "#c92035",
    "--mark-3": "#f19e20",
    "--mark-4": "#008058",
    "--groove-line": "#0b0f171a",
    "--groove-light": "#00000000",
    "--elevation-line": "#857e70",
    "--elevation-shadow": "#00000000",
    "--scrim": "#0b0f1780",
    "--syntax-amber": "#915b00",
    "--syntax-cyan": "#1a6c97",
    // Decision 7 (E6): the lockup's mark sits lower and closer.
    "--mark-rise": "0.36em",
    "--mark-lockup-gap": "0.1em",
  },
  ".dark": {
    "--background": "#16140f",
    "--foreground": "#f3f0e8",
    "--card": "#221f19",
    "--card-foreground": "#f3f0e8",
    "--popover": "#221f19",
    "--popover-foreground": "#f3f0e8",
    "--primary": "#93b0ff",
    "--primary-foreground": "#0b0f17",
    "--secondary": "#221f19",
    "--secondary-foreground": "#f3f0e8",
    "--muted": "#2c2821",
    "--muted-foreground": "#a39d90",
    "--accent": "#2c2821",
    "--accent-foreground": "#f3f0e8",
    "--destructive": "#ff9491",
    "--border": "#f3f0e81a",
    "--input": "#7a7366",
    "--ring": "#93b0ff",
    "--chart-1": "#93b0ff",
    "--chart-2": "#ff9491",
    "--chart-3": "#f19e20",
    "--chart-4": "#60c498",
    "--chart-5": "#a39d90",
    "--sidebar": "#16140f",
    "--sidebar-foreground": "#f3f0e8",
    "--sidebar-primary": "#93b0ff",
    "--sidebar-primary-foreground": "#0b0f17",
    "--sidebar-accent": "#2c2821",
    "--sidebar-accent-foreground": "#f3f0e8",
    "--sidebar-border": "#f3f0e81a",
    "--sidebar-ring": "#93b0ff",
    "--destructive-foreground": "#0b0f17",
    "--destructive-fill": "#ff9491",
    "--success": "#60c498",
    "--success-foreground": "#0b0f17",
    "--success-fill": "#60c498",
    "--caution": "#f19e20",
    "--caution-foreground": "#0b0f17",
    "--raised": "#221f19",
    "--mark-1": "#f3f0e8",
    "--mark-2": "#f3f0e8",
    "--mark-3": "#f3f0e8",
    "--mark-4": "#f3f0e8",
    "--groove-line": "#f3f0e81a",
    "--elevation-line": "#7a7366",
    "--scrim": "#0b0f1799",
    "--syntax-amber": "#f19e20",
  },
};
describe("v0.8.0's custom properties (criterion 2)", () => {
  const fixture = JSON.parse(
    readFileSync("tests/unit/fixtures/v0.8.0-custom-properties.json", "utf8"),
  ) as Record<string, Record<string, string> | string>;
  const css = readFileSync("src/app.css", "utf8");

  test("the fixture holds 89, 74 and 110 properties", () => {
    expect(
      [":root", ".dark", "@theme inline"].map(
        (b) => Object.keys(fixture[b] as Record<string, string>).length,
      ),
    ).toEqual([89, 74, 110]);
  });

  test("011 moves 44 properties of :root and 47 of .dark, none in @theme inline", () => {
    expect(Object.keys(MOVED_011[":root"])).toHaveLength(44);
    expect(Object.keys(MOVED_011[".dark"])).toHaveLength(47);
    for (const block of [":root", ".dark"] as const)
      for (const [name, value] of Object.entries(MOVED_011[block]))
        expect(
          (fixture[block] as Record<string, string>)[name],
          `${block} ${name}`,
        ).not.toBe(value);
  });

  test.each([":root", ".dark", "@theme inline"])(
    "%s keeps every v0.8.0 property at its value, but for those 011 moves, which read their 0.11.0 value",
    (block) => {
      const now = topLevelMap(css, block);
      const moved =
        block === "@theme inline" ? {} : MOVED_011[block as ":root" | ".dark"];
      const changed = Object.entries(fixture[block] as Record<string, string>)
        .map(([name, value]) => [name, moved[name] ?? value] as const)
        .filter(([name, value]) => now.get(name) !== value);
      expect(changed).toEqual([]);
    },
  );
});

/** 009 decisions 3 to 6 as 012 decision 1 leaves them: the utilities, reduced motion and the sticky bar. */
describe("009's rules and utilities", () => {
  const theme = () =>
    items(readFileSync("registry.json", "utf8")).get("pluto-theme") as Item & {
      css: CssTree;
    };
  const css = () => theme().css;

  // 012 decision 1: the stage, the veil, the bloom, the rim and energized
  // are gone; action-press stays.
  test("the stage, the veil, the bloom, the rim and energized are gone; action-press stays", () => {
    for (const key of [
      ".surface-stage",
      ".veil",
      "@utility bloom",
      "@utility rim",
      "@utility energized",
    ])
      expect(key in css(), key).toBe(false);
    expect(css()["@utility action-press"]).toEqual({
      transition: "transform var(--motion-press) var(--ease-standard)",
      "&:active": { transform: "scale(var(--press-scale))" },
    });
  });

  test.each(["display", "section", "proof", "poster"])(
    "@utility type-%s reads its step's variables and the display slot, at 600",
    (step) => {
      expect(css()[`@utility type-${step}`]).toEqual({
        "font-family": "var(--font-face-display)",
        "font-size": `var(--type-${step}-size)`,
        "line-height": `var(--type-${step}-leading)`,
        "letter-spacing": `var(--type-${step}-tracking)`,
        "font-weight": "600",
        ...(step === "proof" ? { "font-variant-numeric": "tabular-nums" } : {}),
      });
    },
  );

  test("reduced motion: the eight durations at 0ms (011 decision 8 adds --motion-light) and --press-scale at 1, in the same html:root block; the block's children are unchanged", () => {
    const block = css()["@media (prefers-reduced-motion: reduce)"] as CssTree;
    expect(block["html:root"]).toEqual({
      "--motion-entrance": "0ms",
      "--motion-micro": "0ms",
      "--motion-press": "0ms",
      "--motion-slide": "0ms",
      "--motion-busy": "0ms",
      "--motion-reveal": "0ms",
      "--motion-fill": "0ms",
      "--motion-light": "0ms",
      "--press-scale": "1",
    });
    expect(Object.keys(block)).toHaveLength(3);
  });

  test("a sticky bar that marks itself never hides focus", () => {
    expect(css()["html:has([data-sticky-bar])"]).toEqual({
      "scroll-padding-top": "var(--size-bar)",
    });
  });

  test("the theme adds no utility that L22 does not name, beyond rounded-action", () => {
    const utilities = Object.keys(css())
      .filter((k) => k.startsWith("@utility "))
      .map((k) => k.slice("@utility ".length));
    expect(utilities.slice(utilities.indexOf("rounded-action"))).toEqual([
      "rounded-action",
      "action-press",
      "type-display",
      "type-section",
      "type-proof",
      "type-poster",
      "field-1",
      "field-2",
      "field-3",
      "field-4",
      "surface-plain",
      "glass",
      // 012 decision 5: the busy edge of a flat card.
      "busy-edge",
    ]);
  });

  // 012 decision 5: a run answers with an edge drawn inside the card, in the
  // primary, against the card's own ground; none at rest.
  test("@utility busy-edge: a box-shadow transition at rest, an inset primary edge of twice the line width while busy", () => {
    expect(css()["@utility busy-edge"]).toEqual({
      transition: "box-shadow var(--motion-busy) var(--ease-standard)",
      "&[data-busy]": {
        "box-shadow": "inset 0 0 0 calc(2 * var(--line-width)) var(--primary)",
      },
    });
  });
});

/**
 * 011 criterion 1: every variable decisions 6 to 10 add, in `pluto-theme`'s
 * `css` and in `src/app.css`. The per-theme ones are in `:root` and `.dark`;
 * the rest in `:root` alone.
 */
const PER_THEME_011 = [
  ...[1, 2, 3, 4].flatMap((n) => [`--field-${n}`, `--field-${n}-foreground`]),
  "--surface-foreground",
  "--surface-muted-foreground",
  "--surface-card-foreground",
  "--surface-primary",
  "--surface-primary-foreground",
  "--surface-ring",
  "--surface-border",
  "--glass-tint",
  "--glass-rim",
  "--glass-edge",
  "--glass-fallback",
  "--glass-light",
  "--glass-shadow",
];
const ROOT_ONLY_011 = [
  "--glass-blur",
  "--motion-light",
  "--type-poster-size",
  "--type-poster-leading",
  "--type-poster-tracking",
  "--ease-spring",
  "--mark-lockup-scale",
  "--mark-lockup-size",
];

describe("011's variables (criterion 1)", () => {
  const theme = () =>
    items(readFileSync("registry.json", "utf8")).get("pluto-theme") as Item & {
      css: CssTree;
    };
  const root = () => theme().css[":root"] as CssTree;
  const dark = () => theme().css[".dark"] as CssTree;
  const app = () => readFileSync("src/app.css", "utf8");

  // The change review's finding 3 adds --surface-primary-foreground.
  // "Frost only, no lens" (decisions.md, 2026-11-07) removes the four lens
  // variables.
  test("21 per-theme names and 8 root-only names, each once", () => {
    expect(PER_THEME_011).toHaveLength(21);
    expect(ROOT_ONLY_011).toHaveLength(8);
    expect(new Set([...PER_THEME_011, ...ROOT_ONLY_011]).size).toBe(29);
  });

  test("css[':root'] holds all 29 and css['.dark'] the 21 per-theme ones; src/app.css the same", () => {
    expect(
      [...PER_THEME_011, ...ROOT_ONLY_011].filter((n) => !(n in root())),
    ).toEqual([]);
    expect(PER_THEME_011.filter((n) => !(n in dark()))).toEqual([]);
    expect(ROOT_ONLY_011.filter((n) => n in dark())).toEqual([]);
    const rootMap = topLevelMap(app(), ":root");
    const darkMap = topLevelMap(app(), ".dark");
    expect(
      [...PER_THEME_011, ...ROOT_ONLY_011].filter((n) => !rootMap.has(n)),
    ).toEqual([]);
    expect(PER_THEME_011.filter((n) => !darkMap.has(n))).toEqual([]);
  });

  test.each([
    ["--field-1", "#2D48D4", "#93B0FF"],
    ["--field-1-foreground", "#FFFFFF", "#16140F"],
    ["--field-2", "#C92035", "#FF9491"],
    ["--field-2-foreground", "#FFFFFF", "#16140F"],
    ["--field-3", "#F19E20", "#F19E20"],
    ["--field-3-foreground", "#0B0F17", "#16140F"],
    ["--field-4", "#008058", "#60C498"],
    ["--field-4-foreground", "#FFFFFF", "#16140F"],
    ["--surface-foreground", "var(--foreground)", "var(--foreground)"],
    [
      "--surface-muted-foreground",
      "var(--muted-foreground)",
      "var(--muted-foreground)",
    ],
    [
      "--surface-card-foreground",
      "var(--card-foreground)",
      "var(--card-foreground)",
    ],
    ["--surface-primary", "var(--primary)", "var(--primary)"],
    [
      "--surface-primary-foreground",
      "var(--primary-foreground)",
      "var(--primary-foreground)",
    ],
    ["--surface-ring", "var(--ring)", "var(--ring)"],
    ["--surface-border", "var(--border)", "var(--border)"],
    ["--glass-tint", "#F3F0E8DB", "#16140FD6"],
    ["--glass-rim", "#FFFFFFCC", "#FFFFFF1F"],
    ["--glass-edge", "#0B0F1714", "#FFFFFF14"],
    ["--glass-fallback", "#FBFAF6", "#221F19"],
    ["--glass-light", "#FFFFFF8C", "#FFFFFF33"],
    [
      "--glass-shadow",
      "0 1px 0 #0B0F170F, 0 16px 32px -16px #0B0F1747",
      "0 1px 0 #00000000, 0 16px 32px -16px #000000B3",
    ],
  ])("%s is %s in :root and %s in .dark", (name, light, darkValue) => {
    expect(root()[name]).toBe(light);
    expect(dark()[name]).toBe(darkValue);
  });

  test.each([
    ["--glass-blur", "16px"],
    ["--motion-light", "600ms"],
    ["--type-poster-size", "clamp(3.5rem, 12vw, 10rem)"],
    ["--type-poster-leading", "0.9"],
    ["--type-poster-tracking", "-0.05em"],
    ["--mark-lockup-scale", "0.87"],
    ["--mark-lockup-size", "calc(var(--mark-lockup-scale) * 1em)"],
    ["--mark-rise", "0.36em"],
    ["--mark-lockup-gap", "0.1em"],
  ])("css[':root'] sets %s to %s", (name, value) => {
    expect(root()[name]).toBe(value);
  });
});

/**
 * 011 decision 10, criterion 6: `--ease-spring` is the step response of a
 * damped spring, recomputed here from the token: x(t) = 1 − e^(−ζωt)
 * (cos(ω_d t) + ζ/√(1 − ζ²) sin(ω_d t)), sampled at samples + 1 even times
 * over ωT = ln(1 / settle) / ζ, rounded to four decimals, the last exactly 1.
 */
describe("the spring (011 criterion 6)", () => {
  const value = () =>
    (
      items(readFileSync("registry.json", "utf8")).get("pluto-theme")!
        .css as CssTree
    )[":root"] as CssTree;

  function spring(zeta: number, settle: number, samples: number): number[] {
    const end = Math.log(1 / settle) / zeta;
    const damped = Math.sqrt(1 - zeta * zeta);
    return Array.from({ length: samples + 1 }, (_, k) => {
      if (k === samples) return 1;
      const u = (end * k) / samples;
      const x =
        1 -
        Math.exp(-zeta * u) *
          (Math.cos(damped * u) + (zeta / damped) * Math.sin(damped * u));
      return Math.round(x * 10000) / 10000;
    });
  }

  test("is a linear() of 33 points, starting at 0, ending at exactly 1, peaking above 1.06", () => {
    const text = value()["--ease-spring"] as string;
    const match = /^linear\((.*)\)$/.exec(text);
    expect(match).not.toBeNull();
    const points = match![1].split(",").map((p) => Number(p.trim()));
    expect(points).toHaveLength(33);
    expect(points[0]).toBe(0);
    expect(points.at(-1)).toBe(1);
    expect(Math.max(...points)).toBeGreaterThan(1.06);
    expect(Math.max(...points)).toBeLessThan(1.07);
  });

  test("equals the step response recomputed from the token", () => {
    const tokens = JSON.parse(readFileSync("tokens/pluto.tokens.json", "utf8"));
    const { dampingRatio, settle, samples } = tokens.expressive.motion.spring;
    const points = /^linear\((.*)\)$/
      .exec(value()["--ease-spring"] as string)![1]
      .split(",")
      .map((p) => Number(p.trim()));
    expect(points).toEqual(spring(dampingRatio, settle, samples));
  });
});

/** 011 decisions 6, 8 and 9: the fields, the plain surface, the glass and its rules. */
describe("011's utilities and rules", () => {
  const css = () =>
    items(readFileSync("registry.json", "utf8")).get("pluto-theme")!
      .css as CssTree;
  const app = () => readFileSync("src/app.css", "utf8");
  const PLAIN = {
    "--foreground": "var(--surface-foreground)",
    "--muted-foreground": "var(--surface-muted-foreground)",
    "--card-foreground": "var(--surface-card-foreground)",
    "--primary": "var(--surface-primary)",
    "--primary-foreground": "var(--surface-primary-foreground)",
    "--ring": "var(--surface-ring)",
    "--border": "var(--surface-border)",
  };

  test.each([1, 2, 3, 4])(
    "@utility field-%d paints its fill and sets the roles to its legend",
    (n) => {
      expect(css()[`@utility field-${n}`]).toEqual({
        "background-color": `var(--field-${n})`,
        color: `var(--field-${n}-foreground)`,
        "--foreground": `var(--field-${n}-foreground)`,
        "--muted-foreground": `var(--field-${n}-foreground)`,
        "--card-foreground": `var(--field-${n}-foreground)`,
        "--primary": `var(--field-${n}-foreground)`,
        "--ring": `var(--field-${n}-foreground)`,
        "--border": `color-mix(in srgb, var(--field-${n}-foreground) 24%, transparent)`,
        // The change review's finding 3: a primary fill on the field inverts
        // to the one measured pair, the legend as fill and the field as text.
        "--primary-foreground": `var(--field-${n})`,
      });
    },
  );

  test("@utility surface-plain restores the seven roles from the --surface-* copies", () => {
    expect(css()["@utility surface-plain"]).toEqual(PLAIN);
  });

  test("@utility glass: the frosted tint, the edge, the case radius, the rim and its shadow, surface-plain's roles, and the masked specular rim", () => {
    const glass = css()["@utility glass"] as CssTree;
    const { "&::after": after, ...own } = glass;
    expect(own).toEqual({
      position: "relative",
      isolation: "isolate",
      "background-color": "var(--glass-tint)",
      "-webkit-backdrop-filter": "blur(var(--glass-blur))",
      "backdrop-filter": "blur(var(--glass-blur))",
      border: "var(--line-width) solid var(--glass-edge)",
      "border-radius": "var(--radius)",
      "box-shadow": "inset 0 1px 0 var(--glass-rim), var(--glass-shadow)",
      ...PLAIN,
      color: "var(--foreground)",
    });
    expect(after).toEqual({
      content: '""',
      position: "absolute",
      inset: "calc(-1 * var(--line-width))",
      padding: "var(--line-width)",
      "border-radius": "inherit",
      "pointer-events": "none",
      background:
        "radial-gradient(160px circle at var(--glass-x, 50%) var(--glass-y, 0%), var(--glass-light), transparent 70%)",
      "-webkit-mask":
        "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
      "-webkit-mask-composite": "xor",
      mask: "linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)",
      opacity: "var(--glass-lit, 0)",
      transition: "opacity var(--motion-reveal) var(--ease-standard)",
    });
    // The prefixed mask first, the standard one last (Firefox reads both).
    const keys = Object.keys(after as CssTree);
    expect(keys.indexOf("-webkit-mask")).toBeLessThan(keys.indexOf("mask"));
  });

  const OPAQUE = {
    "background-color": "var(--glass-fallback)",
    "-webkit-backdrop-filter": "none",
    "backdrop-filter": "none",
  };
  const SUPPORTS =
    "@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)))";

  test("the opaque fallbacks: no backdrop filter, reduced transparency, forced colours", () => {
    expect(css()[SUPPORTS]).toEqual({ ".glass": OPAQUE });
    expect(css()["@media (prefers-reduced-transparency: reduce)"]).toEqual({
      ".glass": OPAQUE,
    });
    expect(css()["@media (forced-colors: active)"]).toEqual({
      ".glass": { ...OPAQUE, "border-color": "CanvasText" },
    });
  });

  // The owner: "Frost only, no lens" (decisions.md, 2026-11-07). No rule,
  // variable or selector of the lens is left in the theme.
  test("frost only: the theme holds no lens rule, no lens variable and no url( backdrop", () => {
    const text = JSON.stringify(css());
    expect(text).not.toContain("lens");
    expect(text).not.toContain("url(");
    expect(app()).not.toContain("lens");
    expect((css()["@utility glass"] as CssTree)["backdrop-filter"]).toBe(
      "blur(var(--glass-blur))",
    );
  });

  test("src/app.css prints the three rules after @utility glass, each once", () => {
    // Prettier wraps a long @supports condition; read it without the spaces
    // just inside its parentheses.
    const preludes = blocks(app()).map((b) =>
      b.prelude.replace(/\(\s+/g, "(").replace(/\s+\)/g, ")"),
    );
    const glass = preludes.indexOf("@utility glass");
    expect(glass).toBeGreaterThan(-1);
    for (const prelude of [
      SUPPORTS,
      "@media (prefers-reduced-transparency: reduce)",
      "@media (forced-colors: active)",
    ]) {
      expect(
        preludes.filter((p) => p === prelude),
        prelude,
      ).toHaveLength(1);
      expect(preludes.indexOf(prelude), prelude).toBeGreaterThan(glass);
    }
  });
});

/**
 * 012 decision 1, criterion 1: the stage and its light are gone from the
 * theme, the registry, the built registry and every item file. Variables and
 * selectors are matched as text; the five class names as class tokens, read
 * through the literal lint's own tokeniser, so `--glass-rim` is not `rim`.
 */
describe("012 criterion 1: the stage is gone", () => {
  const VARIABLE_PREFIXES = [
    "--stage-",
    "--stage:",
    "--bloom-",
    "--rim-",
    "--energized-",
    "--veil:",
    "--radius-stage",
    "--blur-veil",
  ];
  const SELECTORS = [".surface-stage", ".veil"];
  const CLASS_TOKENS = ["bloom", "rim", "energized", "veil", "surface-stage"];

  function walk(dir: string): string[] {
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const full = path.join(dir, entry.name);
      return entry.isDirectory() ? walk(full) : [full];
    });
  }
  const files = () => [
    "src/app.css",
    "registry.json",
    ...walk("static/r"),
    ...walk("src/lib/registry"),
  ];

  test("the scope holds the theme, the registry, the built registry and the item files", () => {
    const all = files();
    expect(all.filter((f) => f.startsWith("static/r/")).length).toBeGreaterThan(
      70,
    );
    expect(
      all.filter((f) => f.startsWith("src/lib/registry/")).length,
    ).toBeGreaterThan(300);
  });

  test("no removed variable prefix or selector appears as text", () => {
    const found: string[] = [];
    for (const file of files()) {
      const text = readFileSync(file, "utf8");
      for (const needle of [...VARIABLE_PREFIXES, ...SELECTORS])
        if (text.includes(needle)) found.push(`${file}: ${needle}`);
    }
    expect(found).toEqual([]);
  });

  test("no removed class name appears as a class token", () => {
    const found: string[] = [];
    for (const file of files()) {
      const tokens = new Set(classTokens(readFileSync(file, "utf8")));
      for (const name of CLASS_TOKENS)
        if (tokens.has(name)) found.push(`${file}: ${name}`);
    }
    expect(found).toEqual([]);
  });

  test("the tokeniser reads a class name in a class list, a class object and a variant, and not inside a variable", () => {
    expect(classTokens('<div class="glass hover:rim p-2"></div>')).toContain(
      "rim",
    );
    expect(classTokens("<div class={{ bloom: lit }}></div>")).toContain(
      "bloom",
    );
    expect(classTokens("box-shadow: var(--glass-rim)")).not.toContain("rim");
  });

  test("the never-published snapshots static/v0.9.0 and static/v0.10.0 do not exist", () => {
    expect(existsSync("static/v0.9.0")).toBe(false);
    expect(existsSync("static/v0.10.0")).toBe(false);
  });
});
