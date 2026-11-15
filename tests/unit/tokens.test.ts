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

  // 007 decision 3: 004's 25 plus the nine text-safe hue primitives; 011
  // decision 2 adds graphite, the dark canvas; 013 decision 12 removes 007's
  // nine and adds Tombaugh's twenty: 35 becomes 46.
  // 016 decision 1: amber goes; yellow, yellow-lifted and yellow-text come: 48.
  test("holds 48 primitives, each #RRGGBB or #RRGGBBAA", () => {
    const primitives = Object.entries(tokens.primitives);
    expect(primitives).toHaveLength(48);
    for (const [, hex] of primitives) expect(hex).toMatch(HEX);
  });

  // 013 decision 12: one pair per Tombaugh colour, `code-<hue>` (light) and
  // `code-<hue>-lifted` (dark), at decision 11's values.
  test("holds the 20 code-* primitives of 013 decision 12 at their hexes, and none of 007's nine", () => {
    expect(
      Object.fromEntries(
        Object.entries(tokens.primitives).filter(([name]) =>
          name.startsWith("code-"),
        ),
      ),
    ).toEqual({
      "code-violet": "#7032B9",
      "code-violet-lifted": "#C4A4FE",
      "code-blue": "#3350CB",
      "code-blue-lifted": "#91AEFD",
      "code-navy": "#243B7A",
      "code-navy-lifted": "#9FB1DD",
      "code-green": "#007150",
      "code-green-lifted": "#5CC89A",
      "code-yellow": "#6C5A00",
      "code-yellow-lifted": "#E5CD72",
      "code-orange": "#A34D15",
      "code-orange-lifted": "#FFA373",
      "code-plum": "#922F6E",
      "code-plum-lifted": "#EB9BC8",
      "code-red": "#B81C2E",
      "code-red-lifted": "#FC8D8A",
      "code-grey": "#636972",
      "code-grey-lifted": "#9EA4AE",
      "code-ink": "#25292F",
      "code-ink-lifted": "#D9DFE8",
    });
    for (const name of [
      "amber-text",
      "orange-text",
      "orange-lifted",
      "purple-text",
      "purple-lifted",
      "teal-text",
      "teal-lifted",
      "cyan-text",
      "cyan-lifted",
    ])
      expect(name in tokens.primitives, name).toBe(false);
  });

  // 013 decision 12: ten syntax colours, reached only through the code map,
  // then 014's two grounds: twelve syntax-* roles.
  test("holds 12 syntax-* roles: the 10 colours, light code-<hue> and dark code-<hue>-lifted, then 014's 2 grounds", () => {
    const names = Object.keys(tokens.themes.light).filter((n) =>
      n.startsWith("syntax-"),
    );
    const HUES = [
      "violet",
      "blue",
      "navy",
      "green",
      "yellow",
      "orange",
      "plum",
      "red",
      "grey",
      "ink",
    ];
    expect(names).toEqual([
      ...HUES.map((hue) => `syntax-${hue}`),
      "syntax-ground",
      "syntax-active-line",
    ]);
    expect(
      HUES.map((hue) => [
        tokens.themes.light[`syntax-${hue}`],
        tokens.themes.dark[`syntax-${hue}`],
      ]),
    ).toEqual(HUES.map((hue) => [`code-${hue}`, `code-${hue}-lifted`]));
    for (const gone of ["amber", "purple", "teal", "cyan"])
      expect(`syntax-${gone}` in tokens.themes.light, gone).toBe(false);
  });

  // 016 decisions 1 to 3: the brand yellow, its lifted tone and its text
  // shade; amber is gone, and no app-facing name changes.
  test("016: no primitive or role is named amber; the three yellows and the roles that name them", () => {
    for (const names of [
      Object.keys(tokens.primitives),
      Object.keys(tokens.themes.light),
      Object.keys(tokens.themes.dark),
    ])
      expect(names.filter((n) => /amber/i.test(n))).toEqual([]);
    expect([
      tokens.primitives.yellow,
      tokens.primitives["yellow-lifted"],
      tokens.primitives["yellow-text"],
    ]).toEqual(["#E2B000", "#F8D874", "#806200"]);
    const { light, dark } = tokens.themes;
    expect([light["chart-3"], light.caution, light["mark-3"]]).toEqual([
      "yellow",
      "yellow",
      "yellow",
    ]);
    expect([dark["chart-3"], dark.caution]).toEqual([
      "yellow-lifted",
      "yellow-lifted",
    ]);
    expect([light["caution-text"], dark["caution-text"]]).toEqual([
      "yellow-text",
      "yellow-lifted",
    ]);
    expect(dark["mark-3"]).toBe("paper");
    expect([light["caution-foreground"], dark["caution-foreground"]]).toEqual([
      "ink",
      "ink",
    ]);
    const roles = Object.keys(light);
    expect(roles.indexOf("caution-text")).toBe(
      roles.indexOf("caution-foreground") + 1,
    );
  });

  test("writes each hex once", () => {
    const values = Object.values(tokens.primitives).map((h) => h.toUpperCase());
    expect(new Set(values).size).toBe(values.length);
  });

  // 007 decision 3: 48 becomes 53; 014 decision 1: 53 becomes 55; 013
  // decision 12: 55 becomes 60.
  test.each(["light", "dark"] as const)(
    "%s holds 61 names, each naming a primitive",
    (theme) => {
      const entries = Object.entries(tokens.themes[theme]);
      expect(entries).toHaveLength(61);
      for (const [, primitive] of entries)
        expect(Object.keys(tokens.primitives)).toContain(primitive);
    },
  );

  test("both themes name the same 61 tokens", () => {
    expect(Object.keys(tokens.themes.dark).sort()).toEqual(
      Object.keys(tokens.themes.light).sort(),
    );
  });

  // 014 decision 1: two code-only roles carry the code grounds; no primitive
  // is added, and `muted` and `card` are not retuned.
  test("syntax-ground names raised and ink-wash; syntax-active-line names paper and ink-raised", () => {
    expect(tokens.themes.light["syntax-ground"]).toBe("raised");
    expect(tokens.themes.dark["syntax-ground"]).toBe("ink-wash");
    expect(tokens.themes.light["syntax-active-line"]).toBe("paper");
    expect(tokens.themes.dark["syntax-active-line"]).toBe("ink-raised");
  });

  test("muted and card resolve as before: #E9E5DB, #FFFFFF in light; #2C2821, #221F19 in dark", () => {
    const hex = (theme: "light" | "dark", role: string) =>
      tokens.primitives[tokens.themes[theme][role]!]!.toUpperCase();
    expect([hex("light", "muted"), hex("light", "card")]).toEqual([
      "#E9E5DB",
      "#FFFFFF",
    ]);
    expect([hex("dark", "muted"), hex("dark", "card")]).toEqual([
      "#2C2821",
      "#221F19",
    ]);
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
    // 011 decision 7 (E6): the lockup's mark at 0.87 of the word, lower and
    // closer; the standalone mark's dot and gap are unchanged (N1).
    expect(tokens.mark).toEqual({
      dot: 0.3,
      gap: 0.08,
      lockupScale: 0.87,
      rise: 0.36,
      lockupGap: 0.1,
      orbit: 0.5,
    });
  });

  // 011 decision 2: the ink-* colours follow ink. Decision 4 (I5, flat
  // product screens): the light theme's overlays lose their shadow and take
  // the input-strength edge, and its groove loses its white line.
  test("holds the elevation and scrim colours of 002 decision 7, flat in both themes (011 decision 4)", () => {
    expect(tokens.primitives["ink-shadow"]).toBe("#0B0F1729");
    expect(tokens.primitives["ink-scrim"]).toBe("#0B0F1780");
    expect(tokens.primitives["ink-scrim-deep"]).toBe("#0B0F1799");
    expect(
      ["elevation-line", "elevation-shadow", "groove-light", "scrim"].map(
        (n) => [tokens.themes.light[n], tokens.themes.dark[n]],
      ),
    ).toEqual([
      ["line-input", "paper-line-input"],
      ["clear", "clear"],
      ["clear", "clear"],
      ["ink-scrim", "ink-scrim-deep"],
    ]);
  });

  // 011 decision 2: the palette of 0.11.0, every primitive the decision names.
  test("holds 011 decision 2's palette and the new graphite", () => {
    expect(
      Object.fromEntries(
        [
          "ink",
          "ink-soft",
          "paper",
          "raised",
          "wash",
          "line",
          "line-input",
          "blue",
          "red",
          "yellow",
          "green",
          "red-text",
          "green-text",
          "ink-raised",
          "ink-wash",
          "paper-soft",
          "paper-line",
          "paper-line-input",
          "blue-lifted",
          "red-lifted",
          "green-lifted",
          "ink-shadow",
          "ink-scrim",
          "ink-scrim-deep",
          "graphite",
        ].map((name) => [name, tokens.primitives[name]]),
      ),
    ).toEqual({
      ink: "#0B0F17",
      "ink-soft": "#505661",
      paper: "#F3F0E8",
      raised: "#FFFFFF",
      wash: "#E9E5DB",
      line: "#0B0F171A",
      "line-input": "#857E70",
      blue: "#2D48D4",
      red: "#C92035",
      // 016 decision 1: the brand yellow in place of amber.
      yellow: "#E2B000",
      green: "#008058",
      "red-text": "#C11E31",
      "green-text": "#007351",
      "ink-raised": "#221F19",
      "ink-wash": "#2C2821",
      "paper-soft": "#A39D90",
      "paper-line": "#F3F0E81A",
      "paper-line-input": "#7A7366",
      "blue-lifted": "#93B0FF",
      "red-lifted": "#FF9491",
      "green-lifted": "#60C498",
      "ink-shadow": "#0B0F1729",
      "ink-scrim": "#0B0F1780",
      "ink-scrim-deep": "#0B0F1799",
      graphite: "#16140F",
    });
  });

  // 011 decision 3: the dark canvas is graphite; ink stays the foreground
  // that sits on light fills.
  test("the dark theme's background and sidebar are graphite; every other role keeps its primitive", () => {
    expect([tokens.themes.dark.background, tokens.themes.dark.sidebar]).toEqual(
      ["graphite", "graphite"],
    );
    expect(tokens.themes.dark["primary-foreground"]).toBe("ink");
    expect(tokens.themes.light.background).toBe("paper");
    expect(
      Object.entries(tokens.themes.dark).filter(([, p]) => p === "graphite"),
    ).toHaveLength(2);
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

/** 004 decision 5; 013 decision 12: the `code` map, Meridian's roles, 16 entries, each a semantic colour; 014 decision 1's two grounds. */
describe("the code map", () => {
  const ROLES: [role: string, semantic: string][] = [
    ["text", "syntax-ink"],
    ["comment", "syntax-grey"],
    ["keyword", "syntax-violet"],
    ["function", "syntax-blue"],
    ["type", "syntax-navy"],
    ["string", "syntax-green"],
    ["number", "syntax-yellow"],
    ["constant", "syntax-orange"],
    ["meta", "syntax-plum"],
    ["special", "syntax-red"],
    ["link", "syntax-blue"],
    ["inserted", "syntax-green"],
    ["deleted", "syntax-red"],
    ["changed", "syntax-blue"],
    ["background", "syntax-ground"],
    ["active-line", "syntax-active-line"],
  ];

  test("holds 16 entries, in 013 decision 12's order, each naming its semantic colour", () => {
    expect(ROLES).toHaveLength(16);
    expect(Object.entries(tokens.code)).toEqual(ROLES);
  });

  test("16 of 16 values are among the 61 semantic names, and none is a primitive or a hex", () => {
    const semantic = new Set(Object.keys(tokens.themes.light));
    const values = Object.values(tokens.code);
    expect(values).toHaveLength(16);
    expect(values.filter((v) => semantic.has(v))).toHaveLength(16);
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
  test("mark.orbit is a number of em, the design book's largest offset", () => {
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

/** 009 decisions 3 to 7: the `expressive` group, its own values beside today's palette. */
describe("the expressive group", () => {
  // 011 decisions 6 and 8 add the fields and the glass; decision 9 the
  // poster step. 012 decision 1 removes the stage, its light, the stage
  // radius and the veil's blur.
  test("validates, with its six parts", () => {
    expect(Object.keys(raw.expressive)).toEqual([
      "display",
      "motion",
      "size",
      "gutter",
      "field",
      "glass",
    ]);
    expect(Object.keys(tokens.expressive.display.steps)).toEqual([
      "display",
      "section",
      "proof",
      "poster",
    ]);
  });

  // 012 decision 1: the stage, its light, the stage radius and the veil's
  // blur leave the file, the type and the validator.
  test("holds no stage, light, radius or blur, and the validator does not ask for them", () => {
    for (const part of ["stage", "light", "radius", "blur"])
      expect(part in raw.expressive, part).toBe(false);
    expect("stage" in raw.contrast).toBe(false);
  });

  test("adds no primitive and no theme role", () => {
    // 011 decision 2 adds one, graphite; the theme roles are 53, and 55
    // since 014 decision 1's two code grounds; 013 decision 12 makes them 46
    // primitives and 60 roles; 016 decisions 1 and 3, 48 and 61.
    expect(Object.keys(tokens.primitives)).toHaveLength(48);
    expect(Object.keys(tokens.themes.light)).toHaveLength(61);
  });

  test("display names the heading family; each step is 600", () => {
    expect(tokens.expressive.display.family).toBe("heading");
    for (const step of Object.values(tokens.expressive.display.steps))
      expect(step.weight).toBe(600);
  });

  test("rejects a display family that is not a role, a step past its max, and a missing group", () => {
    const family = structuredClone(raw);
    family.expressive.display.family = "display";
    expect(() => validateTokens(family)).toThrow(/expressive\.display\.family/);
    const step = structuredClone(raw);
    step.expressive.display.steps.section.minPx = 80;
    expect(() => validateTokens(step)).toThrow(
      /expressive\.display\.steps\.section/,
    );
    const ease = structuredClone(raw);
    ease.expressive.motion.easeStandard = [0.2, 0.7];
    expect(() => validateTokens(ease)).toThrow(
      /expressive\.motion\.easeStandard/,
    );
    const missing = structuredClone(raw);
    delete missing.expressive;
    expect(() => validateTokens(missing)).toThrow(/expressive/);
  });
});

/** 011 decisions 6, 8, 9 and 10: the shapes the brand adds to the expressive group. */
describe("011's expressive shapes", () => {
  test("decision 6: four fields per theme, each a [fill, legend] pair of primitives", () => {
    expect(raw.expressive.field).toEqual({
      light: {
        "field-1": ["blue", "raised"],
        "field-2": ["red", "raised"],
        "field-3": ["yellow", "ink"],
        "field-4": ["green", "raised"],
      },
      dark: {
        "field-1": ["blue-lifted", "graphite"],
        "field-2": ["red-lifted", "graphite"],
        "field-3": ["yellow-lifted", "graphite"],
        "field-4": ["green-lifted", "graphite"],
      },
    });
  });

  // The owner: "Frost only, no lens" (decisions.md, 2026-11-07).
  test("decision 8: the glass per theme and its blur; no lens", () => {
    expect(raw.expressive.glass).toEqual({
      light: {
        tint: "#F3F0E8DB",
        rim: "#FFFFFFCC",
        edge: "#0B0F1714",
        fallback: "#FBFAF6",
        light: "#FFFFFF8C",
        shadow: ["#0B0F170F", "#0B0F1747"],
      },
      dark: {
        tint: "#16140FD6",
        rim: "#FFFFFF1F",
        edge: "#FFFFFF14",
        fallback: "ink-raised",
        light: "#FFFFFF33",
        shadow: ["#00000000", "#000000B3"],
      },
      blur: 16,
    });
    expect(raw.expressive.motion.light).toBe(600);
  });

  test("decision 9: the poster step, for launches only", () => {
    expect(raw.expressive.display.steps.poster).toEqual({
      minPx: 56,
      vw: 12,
      maxPx: 160,
      lineHeight: 0.9,
      tracking: -0.05,
      weight: 600,
    });
  });

  test("decision 10: the spring", () => {
    expect(raw.expressive.motion.spring).toEqual({
      dampingRatio: 0.65,
      settle: 0.002,
      samples: 32,
    });
  });

  test("decision 11: the field and glass contrast sets name their rows", () => {
    expect(raw.contrast.field).toHaveLength(8);
    expect(raw.contrast.glass).toHaveLength(33);
    expect(
      raw.contrast.glass.filter((r: { theme: string }) => r.theme === "light"),
    ).toHaveLength(18);
  });

  // 012 decision 4: the bar's text on its glass over the hero's glass over
  // the canvas and each field, both themes: foreground and primary only.
  test("012 decision 4: glassOverGlass names 20 rows, and rejects a muted row or a ground that is not the canvas or a field", () => {
    expect(raw.contrast.glassOverGlass).toHaveLength(20);
    const muted = structuredClone(raw);
    muted.contrast.glassOverGlass[0].text = "muted-foreground";
    expect(() => validateTokens(muted)).toThrow(
      /contrast\.glassOverGlass\[0\]\.text/,
    );
    const ground = structuredClone(raw);
    ground.contrast.glassOverGlass[0].over = "foreground";
    expect(() => validateTokens(ground)).toThrow(
      /contrast\.glassOverGlass\[0\]\.over/,
    );
  });

  test("rejects a field that is not a pair of primitives, a glass colour that is neither a primitive nor a hex, a fifth field, a spring ratio of 1 or more, and a fractional sample count", () => {
    const pair = structuredClone(raw);
    pair.expressive.field.light["field-1"] = ["blue"];
    expect(() => validateTokens(pair)).toThrow(
      /expressive\.field\.light\.field-1/,
    );
    const hex = structuredClone(raw);
    hex.expressive.field.dark["field-2"] = ["#FF9491", "graphite"];
    expect(() => validateTokens(hex)).toThrow(
      /expressive\.field\.dark\.field-2/,
    );
    const fifth = structuredClone(raw);
    fifth.expressive.field.light["field-5"] = ["blue", "raised"];
    expect(() => validateTokens(fifth)).toThrow(/expressive\.field\.light/);
    const tint = structuredClone(raw);
    tint.expressive.glass.light.tint = "frosted";
    expect(() => validateTokens(tint)).toThrow(
      /expressive\.glass\.light\.tint/,
    );
    const shadow = structuredClone(raw);
    shadow.expressive.glass.dark.shadow = ["#000000B3"];
    expect(() => validateTokens(shadow)).toThrow(
      /expressive\.glass\.dark\.shadow/,
    );
    const ratio = structuredClone(raw);
    ratio.expressive.motion.spring.dampingRatio = 1;
    expect(() => validateTokens(ratio)).toThrow(
      /expressive\.motion\.spring\.dampingRatio/,
    );
    const samples = structuredClone(raw);
    samples.expressive.motion.spring.samples = 32.5;
    expect(() => validateTokens(samples)).toThrow(
      /expressive\.motion\.spring\.samples/,
    );
    const poster = structuredClone(raw);
    delete poster.expressive.display.steps.poster;
    expect(() => validateTokens(poster)).toThrow(
      /expressive\.display\.steps\.poster/,
    );
    const scale = structuredClone(raw);
    delete scale.mark.lockupScale;
    expect(() => validateTokens(scale)).toThrow(/mark\.lockupScale/);
    const row = structuredClone(raw);
    row.contrast.glass[0].over = "nowhere";
    expect(() => validateTokens(row)).toThrow(/contrast\.glass\[0\]\.over/);
  });
});
