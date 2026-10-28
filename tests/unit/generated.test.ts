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
