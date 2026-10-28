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

  test("holds 22 primitives, each #RRGGBB or #RRGGBBAA", () => {
    const primitives = Object.entries(tokens.primitives);
    expect(primitives).toHaveLength(22);
    for (const [, hex] of primitives) expect(hex).toMatch(HEX);
  });

  test("writes each hex once", () => {
    const values = Object.values(tokens.primitives).map((h) => h.toUpperCase());
    expect(new Set(values).size).toBe(values.length);
  });

  test.each(["light", "dark"] as const)(
    "%s holds 45 names, each naming a primitive",
    (theme) => {
      const entries = Object.entries(tokens.themes[theme]);
      expect(entries).toHaveLength(45);
      for (const [, primitive] of entries)
        expect(Object.keys(tokens.primitives)).toContain(primitive);
    },
  );

  test("both themes name the same 45 tokens", () => {
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
});
