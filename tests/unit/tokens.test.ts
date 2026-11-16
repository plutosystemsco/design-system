/**
 * The tokens, as the lowering returns them, and the validator's faults.
 * 021 T15: each failure case is written on the DTCG files and throws a
 * `TokenError` that names the file and the token path at fault.
 */
import { describe, expect, test } from "bun:test";
import * as tokensModule from "../../scripts/tokens.ts";
import { readTokens, TokenError } from "../../scripts/tokens.ts";

const tokens = readTokens();
const HEX = /^#(?:[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/;

// The DTCG files, parsed, by file name; each case mutates a copy.
type Any = any;
const { lowerTokens, readTokenFiles } = tokensModule as unknown as {
  lowerTokens: (files: Record<string, unknown>) => unknown;
  readTokenFiles: (root?: string) => Record<string, unknown>;
};
const files: Record<string, Any> =
  typeof readTokenFiles === "function" ? readTokenFiles() : {};
const BASE = "kuiper.tokens.json";
const LIGHT = "kuiper.light.tokens.json";
const DARK = "kuiper.dark.tokens.json";
const CONTRAST = "kuiper.contrast.json";

/** A copy of the files with one change, and the lowering's verdict on it. */
function lowered(change: (f: Record<string, Any>) => void): () => unknown {
  const copy = structuredClone(files);
  change(copy);
  return () => lowerTokens(copy);
}

/** The lowering throws a TokenError naming `file: path`. */
function rejects(change: (f: Record<string, Any>) => void, at: string) {
  const run = lowered(change);
  let error: unknown;
  try {
    run();
  } catch (e) {
    error = e;
  }
  expect(error, at).toBeInstanceOf(TokenError);
  expect((error as Error).message, at).toContain(at);
  return (error as Error).message;
}

const colour = (hex: string) => ({
  colorSpace: "srgb",
  components: [1, 3, 5].map(
    (i) => Math.round((parseInt(hex.slice(i, i + 2), 16) / 255) * 1e4) / 1e4,
  ),
  hex,
});

describe("the token file", () => {
  test("validates", () => {
    expect(typeof lowerTokens).toBe("function");
    expect(() => lowerTokens(files)).not.toThrow();
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
      "code-navy-lifted": "#A8C0D8",
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

  test("no semantic value is a raw hex: every role is an alias in both files", () => {
    for (const file of [LIGHT, DARK])
      for (const [name, role] of Object.entries(
        files[file].role as Record<string, Any>,
      )) {
        if (name.startsWith("$")) continue;
        expect(role.$value, `${file}: ${name}`).toMatch(
          /^\{primitive\.[^.]+\}$/,
        );
      }
    for (const theme of ["light", "dark"] as const)
      for (const value of Object.values(tokens.themes[theme]))
        expect(value.startsWith("#")).toBe(false);
  });

  test("fails with the file and the path at fault", () => {
    rejects((f) => {
      f[LIGHT].role.background.$value = colour("#F7F7F4");
    }, "kuiper.light.tokens.json: role.background");
    rejects((f) => {
      f[BASE].primitive.ink.$value.hex = "#12345";
    }, "kuiper.tokens.json: primitive.ink");
    rejects((f) => {
      delete f[BASE].spacing;
    }, "kuiper.tokens.json: spacing");
  });

  // 021 T15: the faults the DTCG shape adds.
  test("rejects a dark file missing a light path", () => {
    rejects((f) => {
      delete f[DARK].role.ring;
    }, "kuiper.dark.tokens.json: role");
  });

  test("rejects a 5-digit, an 8-digit and a lower-case hex, and components that disagree with the hex", () => {
    rejects((f) => {
      f[BASE].primitive.paper.$value.hex = "#F3F0E";
    }, "kuiper.tokens.json: primitive.paper");
    rejects((f) => {
      f[BASE].primitive.line.$value.hex = "#0B0F171A";
    }, "kuiper.tokens.json: primitive.line");
    rejects((f) => {
      f[BASE].primitive.paper.$value.hex = "#f3f0e8";
    }, "kuiper.tokens.json: primitive.paper");
    const message = rejects((f) => {
      f[BASE].primitive.paper.$value.components = [0.95, 0.9412, 0.9098];
    }, "kuiper.tokens.json: primitive.paper");
    // The fault prints the components to write.
    expect(message).toContain("0.9529, 0.9412, 0.9098");
  });

  // 021 review, finding 3: an alpha of 1 would lower to an `FF` suffix and
  // change the CSS with no change of colour. An opaque colour has no alpha.
  test("rejects an alpha of 1 on an opaque colour", () => {
    const message = rejects((f) => {
      f[BASE].primitive.ink.$value.alpha = 1;
    }, "kuiper.tokens.json: primitive.ink");
    expect(message).toContain("below 1");
  });

  test("rejects a light expressive mark that aliases another primitive than its role", () => {
    rejects((f) => {
      f[LIGHT]["expressive-mark"]["mark-1"].$value = "{primitive.red}";
    }, "kuiper.light.tokens.json: expressive-mark.mark-1");
  });

  test("rejects an em dimension, an alias to nothing and an alias cycle", () => {
    rejects((f) => {
      f[BASE].mark.dot.$type = "dimension";
      f[BASE].mark.dot.$value = { value: 0.3, unit: "em" };
    }, "kuiper.tokens.json: mark.dot");
    rejects((f) => {
      f[DARK].role.ring.$value = "{primitive.blu-lifted}";
    }, "kuiper.dark.tokens.json: role.ring");
    rejects((f) => {
      f[BASE].code.text.$value = "{code.comment}";
      f[BASE].code.comment.$value = "{code.text}";
    }, "kuiper.tokens.json: code.");
  });

  test("rejects a ladder step that is not a whole atom, or not named by its count", () => {
    rejects((f) => {
      f[BASE].spacing.ladder["3"].$value.value = 13;
    }, "kuiper.tokens.json: spacing.ladder.3");
    rejects((f) => {
      f[BASE].spacing.ladder["5"] = f[BASE].spacing.ladder["6"];
      delete f[BASE].spacing.ladder["6"];
    }, "kuiper.tokens.json: spacing.ladder.5");
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
    rejects((f) => {
      f[BASE].elevation.y.$value = { value: 10, unit: "px" };
    }, "kuiper.tokens.json: elevation.y");
    rejects((f) => {
      f[BASE].elevation.y.$value = "{radius.case}";
    }, "kuiper.tokens.json: elevation.y");
    rejects((f) => {
      delete f[BASE].elevation;
    }, "kuiper.tokens.json: elevation");
    expect(
      lowered((f) => {
        f[CONTRAST].scrim[0].edge = "raised";
      }),
    ).not.toThrow();
    rejects((f) => {
      f[CONTRAST].scrim[0].edge = "ink";
    }, "kuiper.contrast.json: scrim[0].edge");
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
    rejects((f) => {
      f[BASE].code.keyword.$value = "{primitive.blue}";
    }, "kuiper.tokens.json: code.keyword");
    rejects((f) => {
      f[BASE].code.string.$value = colour("#136E3E");
    }, "kuiper.tokens.json: code.string");
    rejects((f) => {
      f[BASE].code.comment.$value = "{role.no-such-colour}";
    }, "kuiper.tokens.json: code.comment");
    rejects((f) => {
      delete f[BASE].code;
    }, "kuiper.tokens.json: code");
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
    rejects((f) => {
      delete f[BASE].mark.orbit;
    }, "kuiper.tokens.json: mark.orbit");
    rejects((f) => {
      f[BASE].motion["entrance-dot"].$value = 1;
    }, "kuiper.tokens.json: motion.entrance-dot");
    const message = rejects((f) => {
      f[BASE].motion["entrance-stagger"].$value = 0.2;
    }, "kuiper.tokens.json: motion.entrance-dot");
    expect(message).toMatch(/budget/);
  });
});

/** 009 decisions 3 to 7: the `expressive` group, its own values beside today's palette. */
describe("the expressive group", () => {
  // 011 decisions 6 and 8 add the fields and the glass; decision 9 the
  // poster step. 012 decision 1 removes the stage, its light, the stage
  // radius and the veil's blur.
  test("validates, with its six parts", () => {
    expect(Object.keys(tokens.expressive)).toEqual([
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
      expect(part in tokens.expressive, part).toBe(false);
    for (const part of ["stage", "stage-light", "stage-radius", "veil-blur"])
      expect(part in (files[BASE]?.expressive ?? {}), part).toBe(false);
    expect("stage" in tokens.contrast).toBe(false);
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
    rejects((f) => {
      f[BASE].expressive.display.family.$value = "{font.family.display}";
    }, "kuiper.tokens.json: expressive.display.family");
    rejects((f) => {
      f[BASE].expressive.display.family.$value = ["Inter", "sans-serif"];
    }, "kuiper.tokens.json: expressive.display.family");
    rejects((f) => {
      f[BASE].expressive.display.section.size.min.$value.value = 80;
    }, "kuiper.tokens.json: expressive.display.section.size");
    rejects((f) => {
      f[BASE].expressive.motion["ease-standard"].$value = [0.2, 0.7];
    }, "kuiper.tokens.json: expressive.motion.ease-standard");
    rejects((f) => {
      delete f[BASE].expressive;
    }, "kuiper.tokens.json: expressive");
  });
});

/** 011 decisions 6, 8, 9 and 10: the shapes the brand adds to the expressive group. */
describe("011's expressive shapes", () => {
  test("decision 6: four fields per theme, each a [fill, legend] pair of primitives", () => {
    expect(tokens.expressive.field).toEqual({
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
    expect(tokens.expressive.glass).toEqual({
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
    expect(tokens.expressive.motion.light).toBe(600);
  });

  test("decision 9: the poster step, for launches only", () => {
    expect(tokens.expressive.display.steps.poster).toEqual({
      minPx: 56,
      vw: 12,
      maxPx: 160,
      lineHeight: 0.9,
      tracking: 0,
      weight: 600,
    });
  });

  // 019a decision 1 (the owner, 2026-11-15): every tracking value is the
  // font's default.
  test("every tracking value is 0: the four type tokens and the four expressive steps", () => {
    expect(tokens.type.tracking).toEqual({
      display: 0,
      section: 0,
      eyebrow: 0,
      mark: 0,
    });
    for (const [step, value] of Object.entries(tokens.expressive.display.steps))
      expect(value.tracking, step).toBe(0);
  });

  test("decision 10: the spring", () => {
    expect(tokens.expressive.motion.spring).toEqual({
      dampingRatio: 0.65,
      settle: 0.002,
      samples: 32,
    });
  });

  test("decision 11: the field and glass contrast sets name their rows", () => {
    expect(tokens.contrast.field).toHaveLength(8);
    expect(tokens.contrast.glass).toHaveLength(33);
    expect(
      tokens.contrast.glass.filter((r) => r.theme === "light"),
    ).toHaveLength(18);
  });

  // 012 decision 4: the bar's text on its glass over the hero's glass over
  // the canvas and each field, both themes: foreground and primary only.
  test("012 decision 4: glassOverGlass names 20 rows, and rejects a muted row or a ground that is not the canvas or a field", () => {
    expect(tokens.contrast.glassOverGlass).toHaveLength(20);
    rejects((f) => {
      f[CONTRAST].glassOverGlass[0].text = "muted-foreground";
    }, "kuiper.contrast.json: glassOverGlass[0].text");
    rejects((f) => {
      f[CONTRAST].glassOverGlass[0].over = "foreground";
    }, "kuiper.contrast.json: glassOverGlass[0].over");
  });

  test("rejects a field that is not a pair of primitives, a glass colour that is neither a primitive nor a hex, a fifth field, a spring ratio of 1 or more, and a fractional sample count", () => {
    rejects((f) => {
      delete f[LIGHT].field["field-1"].legend;
      delete f[DARK].field["field-1"].legend;
    }, "kuiper.light.tokens.json: field.field-1");
    rejects((f) => {
      f[DARK].field["field-2"].fill.$value = colour("#FF9491");
    }, "kuiper.dark.tokens.json: field.field-2.fill");
    rejects((f) => {
      for (const file of [LIGHT, DARK])
        f[file].field["field-5"] = structuredClone(f[file].field["field-4"]);
    }, "kuiper.light.tokens.json: field");
    rejects((f) => {
      f[LIGHT].glass.tint.$value = "frosted";
    }, "kuiper.light.tokens.json: glass.tint");
    rejects((f) => {
      delete f[LIGHT].glass.shadow.far;
      delete f[DARK].glass.shadow.far;
    }, "kuiper.light.tokens.json: glass.shadow");
    rejects((f) => {
      f[BASE].expressive.motion.spring["damping-ratio"].$value = 1;
    }, "kuiper.tokens.json: expressive.motion.spring.damping-ratio");
    rejects((f) => {
      f[BASE].expressive.motion.spring.samples.$value = 32.5;
    }, "kuiper.tokens.json: expressive.motion.spring.samples");
    rejects((f) => {
      delete f[BASE].expressive.display.poster;
    }, "kuiper.tokens.json: expressive.display.poster");
    rejects((f) => {
      delete f[BASE].mark["lockup-scale"];
    }, "kuiper.tokens.json: mark.lockup-scale");
    rejects((f) => {
      f[CONTRAST].glass[0].over = "nowhere";
    }, "kuiper.contrast.json: glass[0].over");
  });
});
