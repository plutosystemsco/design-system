import { beforeAll, describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { generateTokenOutputs } from "../../scripts/build-tokens.ts";
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
    expect(theme().cssVars.light["syntax-amber"]).toBe("#85600B");
    expect(theme().cssVars.dark["syntax-amber"]).toBe("#F0AE12");
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

  test("css holds @keyframes pluto-mark-dock with a from frame and no to", () => {
    expect(theme().css["@keyframes pluto-mark-dock"]).toEqual({
      from: {
        opacity: "0",
        transform:
          "translate(calc(var(--mark-orbit) * var(--_ox)), calc(var(--mark-orbit) * var(--_oy))) scale(0.4)",
      },
    });
  });

  test("css holds @utility mark-entrance: the dots' animation from the tokens, then 4 nth-child rules with the design book's offsets and staggered delays", () => {
    const utility = theme().css["@utility mark-entrance"] as CssTree;
    const keys = Object.keys(utility);
    expect(keys).toHaveLength(5);
    expect(utility['& > [data-slot="four-dot-dot"]']).toEqual({
      animation:
        "pluto-mark-dock calc(var(--motion-entrance) * var(--motion-entrance-dot)) var(--ease-entrance) both",
    });
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
    const theme = blocks(css).find((b) => b.prelude === "@theme inline")!;
    expect(theme.children.map((c) => c.prelude)).toContain(
      "@keyframes pluto-mark-dock",
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
      "transition-timing-function": "var(--ease-entrance)",
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
