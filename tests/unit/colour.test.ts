import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { deltaE } from "../../scripts/contrast.ts";
import { deltaEUnder, fromOklch, oklch } from "../helpers/colour.ts";

/**
 * 013 decision 18: the colour helper the tests keep once the workbench is
 * gone. ΔE, `mix` and the WCAG ratio have one home, `scripts/contrast.ts`.
 */

type Swatches = Record<string, { light: string; dark: string }>;
const research = JSON.parse(
  readFileSync(
    "context/research/2026-11-14-meridian-and-tombaugh.json",
    "utf8",
  ),
) as { candidates: { id: string; palette: { swatches: Swatches } }[] };
const swatches = research.candidates.find((c) => c.id === "tombaugh")!.palette
  .swatches;
const NOT_TEXT = ["code-ground", "code-active-line", "tombaugh-selection"];
const HEXES = Object.entries(swatches)
  .filter(([name]) => !NOT_TEXT.includes(name))
  .flatMap(([, { light, dark }]) => [light, dark]);

describe("oklch and fromOklch", () => {
  test("round-trip the 20 Tombaugh hexes", () => {
    expect(HEXES).toHaveLength(20);
    for (const hex of HEXES) {
      const { l, c, h } = oklch(hex);
      expect(fromOklch(l, c, h), hex).toBe(hex.toUpperCase());
    }
  });
});

describe("colour-vision deficiency (Machado 2009)", () => {
  const r1 = (n: number) => Math.round(n * 10) / 10;
  const pair = (theme: "light" | "dark") =>
    [
      swatches["tombaugh-yellow"]![theme],
      swatches["tombaugh-orange"]![theme],
    ] as const;

  // 013 decision 8's number–constant figures.
  test("number and constant: deuteranopia 5.4 light and 5.1 dark; protanopia 0.5 light and 9.5 dark", () => {
    expect(r1(deltaEUnder(...pair("light"), "deuteranopia"))).toBe(5.4);
    expect(r1(deltaEUnder(...pair("dark"), "deuteranopia"))).toBe(5.1);
    expect(r1(deltaEUnder(...pair("light"), "protanopia"))).toBe(0.5);
    expect(r1(deltaEUnder(...pair("dark"), "protanopia"))).toBe(9.5);
    // And for typical vision, 10.8 and 11.0.
    expect(r1(deltaE(...pair("light")))).toBe(10.8);
    expect(r1(deltaE(...pair("dark")))).toBe(11);
  });
});

describe("one home for the arithmetic", () => {
  /** Every .ts file under a folder. */
  const walk = (dir: string): string[] =>
    readdirSync(dir).flatMap((name) => {
      const file = path.join(dir, name);
      if (statSync(file).isDirectory())
        return name === "fixtures" && dir.endsWith("smoke") ? [] : walk(file);
      return /\.ts$/.test(name) ? [file] : [];
    });

  test("deltaE, mix and contrastRatio are defined only in scripts/contrast.ts", () => {
    const definition =
      /\b(?:function|const|let)\s+(deltaE|mix|contrastRatio)\b/;
    const defining = [...walk("tests"), ...walk("src"), ...walk("scripts")]
      .filter((file) => definition.test(readFileSync(file, "utf8")))
      .sort();
    expect(defining).toEqual(["scripts/contrast.ts"]);
  });
});
