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
      orbit: 0.5,
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

/** 004 decision 5: the `code` map, twelve slots, each a semantic colour. */
describe("the code map", () => {
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

  test("holds 12 slots, in decision 5's order, each naming its semantic colour", () => {
    expect(SLOTS).toHaveLength(12);
    expect(Object.entries(tokens.code)).toEqual(SLOTS);
  });

  test("12 of 12 values are among the 48 semantic names, and none is a primitive or a hex", () => {
    const semantic = new Set(Object.keys(tokens.themes.light));
    const values = Object.values(tokens.code);
    expect(values).toHaveLength(12);
    expect(values.filter((v) => semantic.has(v))).toHaveLength(12);
    for (const value of values) {
      expect(value.startsWith("#")).toBe(false);
      expect(value in tokens.primitives).toBe(false);
    }
  });

  test("rejects a slot that names a primitive, a raw hex, or nothing, and a missing map", () => {
    const primitive = structuredClone(raw);
    primitive.code.keyword = "blue";
    expect(() => validateTokens(primitive)).toThrow(/code\.keyword/);
    const hex = structuredClone(raw);
    hex.code.string = "#136E3E";
    expect(() => validateTokens(hex)).toThrow(/code\.string/);
    const unknown = structuredClone(raw);
    unknown.code.comment = "no-such-colour";
    expect(() => validateTokens(unknown)).toThrow(/code\.comment/);
    const missing = structuredClone(raw);
    delete missing.code;
    expect(() => validateTokens(missing)).toThrow(/code/);
  });
});

/** 006 decision 4: the orbit, in em, and the entrance's three shares of the budget. */
describe("the entrance", () => {
  test("mark.orbit is a number of em, the book's largest offset", () => {
    expect(typeof tokens.mark.orbit).toBe("number");
    expect(tokens.mark.orbit).toBe(0.5);
  });

  test("the three entrance numbers are fractions of the budget, and the last dot ends at exactly 1", () => {
    const { entranceDot, entranceStart, entranceStagger } = tokens.motion;
    for (const n of [entranceDot, entranceStart, entranceStagger]) {
      expect(n).toBeGreaterThan(0);
      expect(n).toBeLessThan(1);
    }
    expect(entranceStart + 3 * entranceStagger + entranceDot).toBeCloseTo(1, 9);
    // 495 ms per dot, delays 135 to 405, the last ending at 900 ms.
    expect(tokens.motion.entranceMs * entranceDot).toBeCloseTo(495, 9);
    expect(
      [0, 1, 2, 3].map((n) =>
        Math.round(
          tokens.motion.entranceMs * (entranceStart + n * entranceStagger),
        ),
      ),
    ).toEqual([135, 225, 315, 405]);
  });

  test("rejects a missing orbit, a share of 1 or more, and an entrance past the budget", () => {
    const noOrbit = structuredClone(raw);
    delete noOrbit.mark.orbit;
    expect(() => validateTokens(noOrbit)).toThrow(/mark\.orbit/);
    const whole = structuredClone(raw);
    whole.motion.entranceDot = 1;
    expect(() => validateTokens(whole)).toThrow(/motion\.entranceDot/);
    const over = structuredClone(raw);
    over.motion.entranceStagger = 0.2;
    expect(() => validateTokens(over)).toThrow(/budget/);
  });
});
