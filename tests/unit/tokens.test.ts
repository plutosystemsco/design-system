import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import {
  readTokens,
  validateTokens,
  TOKENS_PATH,
} from "../../scripts/tokens.ts";

const raw = JSON.parse(readFileSync(TOKENS_PATH, "utf8"));
const tokens = readTokens();
const HEX = /^#(?:[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/;

describe("the token file", () => {
  test("validates", () => {
    expect(() => validateTokens(raw)).not.toThrow();
  });

  test("holds 25 primitives, each #RRGGBB or #RRGGBBAA", () => {
    const primitives = Object.entries(tokens.primitives);
    expect(primitives).toHaveLength(25);
    for (const [, hex] of primitives) expect(hex).toMatch(HEX);
  });

  test("writes each hex once", () => {
    const values = Object.values(tokens.primitives).map((h) => h.toUpperCase());
    expect(new Set(values).size).toBe(values.length);
  });

  test.each(["light", "dark"] as const)(
    "%s holds 48 names, each naming a primitive",
    (theme) => {
      const entries = Object.entries(tokens.themes[theme]);
      expect(entries).toHaveLength(48);
      for (const [, primitive] of entries)
        expect(Object.keys(tokens.primitives)).toContain(primitive);
    },
  );

  test("both themes name the same 48 tokens", () => {
    expect(Object.keys(tokens.themes.dark).sort()).toEqual(
      Object.keys(tokens.themes.light).sort(),
    );
  });

  test("no semantic value is a raw hex", () => {
    for (const theme of ["light", "dark"]) {
      for (const value of Object.values(
        raw.themes[theme] as Record<string, string>,
      )) {
        expect(value.startsWith("#")).toBe(false);
      }
    }
  });

  test("fails with the key at fault", () => {
    const bad = structuredClone(raw);
    bad.themes.light.background = "#F7F7F4";
    expect(() => validateTokens(bad)).toThrow(/themes\.light\.background/);
    const badHex = structuredClone(raw);
    badHex.primitives.ink = "#12345";
    expect(() => validateTokens(badHex)).toThrow(/primitives\.ink/);
    const missing = structuredClone(raw);
    delete missing.spacing;
    expect(() => validateTokens(missing)).toThrow(/spacing/);
  });

  test("holds the ladder, the radius and the mark geometry", () => {
    expect(tokens.spacing.atom).toBe(4);
    expect(tokens.spacing.ladder).toEqual([4, 8, 12, 16, 24, 32, 48, 64, 96]);
    expect(tokens.radius.case).toBe(8);
    expect(tokens.mark).toEqual({
      dot: 0.3,
      gap: 0.08,
      rise: 0.38,
      lockupGap: 0.16,
    });
  });

  test("holds the elevation and scrim colours of 002 decision 7", () => {
    expect(tokens.primitives["ink-shadow"]).toBe("#14161C29");
    expect(tokens.primitives["ink-scrim"]).toBe("#14161C80");
    expect(tokens.primitives["ink-scrim-deep"]).toBe("#14161C99");
    expect(
      ["elevation-line", "elevation-shadow", "scrim"].map((n) => [
        tokens.themes.light[n],
        tokens.themes.dark[n],
      ]),
    ).toEqual([
      ["line", "paper-line-input"],
      ["ink-shadow", "clear"],
      ["ink-scrim", "ink-scrim-deep"],
    ]);
  });

  test("elevation holds 2 ladder steps", () => {
    expect(tokens.elevation).toEqual({ y: 12, blur: 32 });
    for (const px of [tokens.elevation.y, tokens.elevation.blur])
      expect(tokens.spacing.ladder).toContain(px);
  });

  test("contrast.scrim names only semantic colours", () => {
    const names = new Set(Object.keys(tokens.themes.light));
    expect(tokens.contrast.scrim).toHaveLength(6);
    for (const row of tokens.contrast.scrim) {
      for (const name of [row.edge, row.over, row.scrim])
        expect(names.has(name)).toBe(true);
      expect(row.min).toBe(3);
    }
  });

  test("rejects an elevation off the ladder and a scrim row with a raw colour", () => {
    const offLadder = structuredClone(raw);
    offLadder.elevation.y = 10;
    expect(() => validateTokens(offLadder)).toThrow(/elevation\.y/);
    const missing = structuredClone(raw);
    delete missing.elevation;
    expect(() => validateTokens(missing)).toThrow(/elevation/);
    const badScrim = structuredClone(raw);
    badScrim.contrast.scrim[0].edge = "raised";
    expect(() => validateTokens(badScrim)).not.toThrow();
    badScrim.contrast.scrim[0].edge = "ink";
    expect(() => validateTokens(badScrim)).toThrow(
      /contrast\.scrim\[0\]\.edge/,
    );
  });
});
