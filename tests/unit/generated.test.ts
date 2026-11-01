import { beforeAll, describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { generateTokenOutputs } from "../../scripts/build-tokens.ts";
import { blocks } from "../helpers/css.ts";

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

  test("the reduced-motion block holds exactly html:root and *, ::before, ::after", () => {
    const block = theme().css![
      "@media (prefers-reduced-motion: reduce)"
    ] as CssTree;
    expect(Object.keys(block)).toEqual(["html:root", "*, ::before, ::after"]);
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

/** 004 decision 5: twelve code tokens, the scrollbar utility and the meter's rules. */
describe("004's additions to pluto-theme", () => {
  const SLOTS: [slot: string, semantic: string][] = [
    ["foreground", "foreground"],
    ["background", "muted"],
    ["keyword", "primary"],
    ["string", "success"],
    ["constant", "foreground"],
    ["function", "foreground"],
    ["comment", "muted-foreground"],
    ["link", "primary"],
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

  test("cssVars.light holds the 12 code-* variables, each var(--<semantic>)", () => {
    const light = theme().cssVars.light;
    const keys = Object.keys(light).filter((k) => k.startsWith("code-"));
    expect(keys).toEqual(SLOTS.map(([slot]) => `code-${slot}`));
    for (const [slot, semantic] of SLOTS)
      expect(light[`code-${slot}`]).toBe(`var(--${semantic})`);
  });

  test("cssVars.dark holds 0 code-* variables", () => {
    expect(
      Object.keys(theme().cssVars.dark).filter((k) => k.startsWith("code-")),
    ).toEqual([]);
  });

  test("cssVars.theme holds the 12 color-code-* utilities, each var(--code-<slot>)", () => {
    const vars = theme().cssVars.theme;
    const keys = Object.keys(vars).filter((k) => k.startsWith("color-code-"));
    expect(keys).toEqual(SLOTS.map(([slot]) => `color-code-${slot}`));
    for (const [slot] of SLOTS)
      expect(vars[`color-code-${slot}`]).toBe(`var(--code-${slot})`);
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

  // The checkpoint's call (decisions.md, "No ligatures on code surfaces").
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

  test("src/app.css carries the 12 :root code variables, the utility and the meter rules", () => {
    const css = readFileSync("src/app.css", "utf8");
    for (const [slot, semantic] of SLOTS)
      expect(css).toContain(`--code-${slot}: var(--${semantic});`);
    expect(css).toContain("--color-code-keyword: var(--code-keyword);");
    expect(css).toContain("@utility scrollbar {");
    expect(css).toContain("@layer components {");
    expect(css).toContain('[data-slot="meter"]::-moz-meter-bar');
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
