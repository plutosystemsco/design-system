import { describe, expect, test } from "bun:test";
import {
  compositeTenths,
  contrastRatio,
  contrastTable,
  fieldRows,
  forbiddenRows,
  glassFallbackRows,
  glassRingRows,
  glassRows,
  scrimRows,
  glassOverGlassRows,
  compositeAlphaByte,
  deltaE,
  mix,
} from "../../scripts/contrast.ts";
import { deltaEUnder, oklch } from "../helpers/colour.ts";
import {
  readTokens,
  resolveColor,
  validateTokens,
} from "../../scripts/tokens.ts";
import { readFileSync } from "node:fs";

const tokens = readTokens();

type Row = [
  label: string,
  fg: string,
  bg: string,
  ratio: number,
  minimum: number,
  result: string,
];

// 001 decision 12's tables, held as expected data, on 011 decision 2's
// palette. Each row is recomputed from the token file.
const LIGHT: Row[] = [
  ["foreground on background", "#0B0F17", "#F3F0E8", 16.84, 4.5, "pass"],
  ["card-foreground on card", "#0B0F17", "#FFFFFF", 19.17, 4.5, "pass"],
  ["popover-foreground on popover", "#0B0F17", "#FFFFFF", 19.17, 4.5, "pass"],
  [
    "secondary-foreground on secondary",
    "#0B0F17",
    "#FFFFFF",
    19.17,
    4.5,
    "pass",
  ],
  ["foreground on muted", "#0B0F17", "#E9E5DB", 15.24, 4.5, "pass"],
  ["accent-foreground on accent", "#0B0F17", "#E9E5DB", 15.24, 4.5, "pass"],
  ["muted-foreground on background", "#505661", "#F3F0E8", 6.48, 4.5, "pass"],
  ["muted-foreground on card", "#505661", "#FFFFFF", 7.38, 4.5, "pass"],
  ["muted-foreground on muted", "#505661", "#E9E5DB", 5.86, 4.5, "pass"],
  ["primary-foreground on primary", "#FFFFFF", "#2D48D4", 7.02, 4.5, "pass"],
  ["primary on background", "#2D48D4", "#F3F0E8", 6.16, 4.5, "pass"],
  ["primary on card", "#2D48D4", "#FFFFFF", 7.02, 4.5, "pass"],
  ["primary on muted", "#2D48D4", "#E9E5DB", 5.58, 4.5, "pass"],
  ["destructive on background", "#C11E31", "#F3F0E8", 5.27, 4.5, "pass"],
  ["destructive on card", "#C11E31", "#FFFFFF", 6, 4.5, "pass"],
  ["destructive on muted", "#C11E31", "#E9E5DB", 4.77, 4.5, "pass"],
  [
    "destructive-foreground on destructive",
    "#FFFFFF",
    "#C11E31",
    6,
    4.5,
    "pass",
  ],
  ["success on background", "#007351", "#F3F0E8", 5.16, 4.5, "pass"],
  ["success on card", "#007351", "#FFFFFF", 5.88, 4.5, "pass"],
  ["success on muted", "#007351", "#E9E5DB", 4.67, 4.5, "pass"],
  ["success-foreground on success", "#FFFFFF", "#007351", 5.88, 4.5, "pass"],
  // 016 decision 1: the brand yellow, #E2B000 in light.
  ["caution-foreground on caution", "#0B0F17", "#E2B000", 9.53, 4.5, "pass"],
  ["sidebar-foreground on sidebar", "#0B0F17", "#F3F0E8", 16.84, 4.5, "pass"],
  [
    "sidebar-primary-foreground on sidebar-primary",
    "#FFFFFF",
    "#2D48D4",
    7.02,
    4.5,
    "pass",
  ],
  [
    "sidebar-accent-foreground on sidebar-accent",
    "#0B0F17",
    "#E9E5DB",
    15.24,
    4.5,
    "pass",
  ],
  ["sidebar-primary on sidebar", "#2D48D4", "#F3F0E8", 6.16, 4.5, "pass"],
  // 014 decision 8: the chrome on the code grounds.
  [
    "muted-foreground on syntax-ground",
    "#505661",
    "#FFFFFF",
    7.38,
    4.5,
    "pass",
  ],
  [
    "muted-foreground on syntax-active-line",
    "#505661",
    "#F3F0E8",
    6.48,
    4.5,
    "pass",
  ],
  ["success on syntax-active-line", "#007351", "#F3F0E8", 5.16, 4.5, "pass"],
  [
    "destructive on syntax-active-line",
    "#C11E31",
    "#F3F0E8",
    5.27,
    4.5,
    "pass",
  ],
  // 016 decision 3: the yellow for text, no weaker than amber-text was.
  ["caution-text on background", "#806200", "#F3F0E8", 5.03, 4.5, "pass"],
  ["caution-text on card", "#806200", "#FFFFFF", 5.73, 4.5, "pass"],
  ["caution-text on muted", "#806200", "#E9E5DB", 4.55, 4.5, "pass"],
  [
    "destructive on destructive/10 over background",
    "#C11E31",
    "#EEDBD6",
    4.5,
    4.5,
    "pass",
  ],
  [
    "destructive on destructive/10 over card",
    "#C11E31",
    "#F9E9EA",
    5.1,
    4.5,
    "pass",
  ],
  [
    "success on success/10 over background",
    "#007351",
    "#DBE4D9",
    4.51,
    4.5,
    "pass",
  ],
  ["success on success/10 over card", "#007351", "#E6F1EE", 5.09, 4.5, "pass"],
  ["input on background", "#857E70", "#F3F0E8", 3.53, 3, "pass"],
  ["input on card", "#857E70", "#FFFFFF", 4.02, 3, "pass"],
  ["input on muted", "#857E70", "#E9E5DB", 3.2, 3, "pass"],
  ["ring on background", "#2D48D4", "#F3F0E8", 6.16, 3, "pass"],
  ["ring on card", "#2D48D4", "#FFFFFF", 7.02, 3, "pass"],
  ["sidebar-ring on sidebar", "#2D48D4", "#F3F0E8", 6.16, 3, "pass"],
  ["destructive-fill on background", "#C92035", "#F3F0E8", 4.92, 3, "pass"],
  ["destructive-fill on card", "#C92035", "#FFFFFF", 5.61, 3, "pass"],
  ["success-fill on background", "#008058", "#F3F0E8", 4.36, 3, "pass"],
  ["success-fill on card", "#008058", "#FFFFFF", 4.96, 3, "pass"],
  ["chart-1 on background", "#2D48D4", "#F3F0E8", 6.16, 3, "pass"],
  ["chart-1 on card", "#2D48D4", "#FFFFFF", 7.02, 3, "pass"],
  ["chart-2 on background", "#C92035", "#F3F0E8", 4.92, 3, "pass"],
  ["chart-2 on card", "#C92035", "#FFFFFF", 5.61, 3, "pass"],
  ["chart-3 on background", "#E2B000", "#F3F0E8", 1.76, 3, "exception"],
  ["chart-3 on card", "#E2B000", "#FFFFFF", 2.01, 3, "exception"],
  ["chart-4 on background", "#008058", "#F3F0E8", 4.36, 3, "pass"],
  ["chart-4 on card", "#008058", "#FFFFFF", 4.96, 3, "pass"],
  ["chart-5 on background", "#505661", "#F3F0E8", 6.48, 3, "pass"],
  ["chart-5 on card", "#505661", "#FFFFFF", 7.38, 3, "pass"],
  ["primary on syntax-active-line", "#2D48D4", "#F3F0E8", 6.16, 3, "pass"],
];

const DARK: Row[] = [
  ["foreground on background", "#F3F0E8", "#16140F", 16.16, 4.5, "pass"],
  ["card-foreground on card", "#F3F0E8", "#221F19", 14.42, 4.5, "pass"],
  ["popover-foreground on popover", "#F3F0E8", "#221F19", 14.42, 4.5, "pass"],
  [
    "secondary-foreground on secondary",
    "#F3F0E8",
    "#221F19",
    14.42,
    4.5,
    "pass",
  ],
  ["foreground on muted", "#F3F0E8", "#2C2821", 12.87, 4.5, "pass"],
  ["accent-foreground on accent", "#F3F0E8", "#2C2821", 12.87, 4.5, "pass"],
  ["muted-foreground on background", "#A39D90", "#16140F", 6.82, 4.5, "pass"],
  ["muted-foreground on card", "#A39D90", "#221F19", 6.08, 4.5, "pass"],
  ["muted-foreground on muted", "#A39D90", "#2C2821", 5.43, 4.5, "pass"],
  ["primary-foreground on primary", "#0B0F17", "#93B0FF", 9.03, 4.5, "pass"],
  ["primary on background", "#93B0FF", "#16140F", 8.67, 4.5, "pass"],
  ["primary on card", "#93B0FF", "#221F19", 7.74, 4.5, "pass"],
  ["primary on muted", "#93B0FF", "#2C2821", 6.9, 4.5, "pass"],
  ["destructive on background", "#FF9491", "#16140F", 8.67, 4.5, "pass"],
  ["destructive on card", "#FF9491", "#221F19", 7.74, 4.5, "pass"],
  ["destructive on muted", "#FF9491", "#2C2821", 6.9, 4.5, "pass"],
  [
    "destructive-foreground on destructive",
    "#0B0F17",
    "#FF9491",
    9.03,
    4.5,
    "pass",
  ],
  ["success on background", "#60C498", "#16140F", 8.62, 4.5, "pass"],
  ["success on card", "#60C498", "#221F19", 7.7, 4.5, "pass"],
  ["success on muted", "#60C498", "#2C2821", 6.87, 4.5, "pass"],
  ["success-foreground on success", "#0B0F17", "#60C498", 8.99, 4.5, "pass"],
  // 016 decision 1: the lifted yellow, #F8D874 in dark.
  ["caution-foreground on caution", "#0B0F17", "#F8D874", 13.75, 4.5, "pass"],
  ["sidebar-foreground on sidebar", "#F3F0E8", "#16140F", 16.16, 4.5, "pass"],
  [
    "sidebar-primary-foreground on sidebar-primary",
    "#0B0F17",
    "#93B0FF",
    9.03,
    4.5,
    "pass",
  ],
  [
    "sidebar-accent-foreground on sidebar-accent",
    "#F3F0E8",
    "#2C2821",
    12.87,
    4.5,
    "pass",
  ],
  ["sidebar-primary on sidebar", "#93B0FF", "#16140F", 8.67, 4.5, "pass"],
  // 014 decision 8: the chrome on the code grounds.
  [
    "muted-foreground on syntax-ground",
    "#A39D90",
    "#2C2821",
    5.43,
    4.5,
    "pass",
  ],
  [
    "muted-foreground on syntax-active-line",
    "#A39D90",
    "#221F19",
    6.08,
    4.5,
    "pass",
  ],
  ["success on syntax-active-line", "#60C498", "#221F19", 7.7, 4.5, "pass"],
  [
    "destructive on syntax-active-line",
    "#FF9491",
    "#221F19",
    7.74,
    4.5,
    "pass",
  ],
  // 016 decision 3: in dark the lifted yellow is text-safe.
  ["caution-text on background", "#F8D874", "#16140F", 13.2, 4.5, "pass"],
  ["caution-text on card", "#F8D874", "#221F19", 11.78, 4.5, "pass"],
  ["caution-text on muted", "#F8D874", "#2C2821", 10.51, 4.5, "pass"],
  [
    "destructive on destructive/20 over background",
    "#FF9491",
    "#452E29",
    5.9,
    4.5,
    "pass",
  ],
  [
    "destructive on destructive/20 over card",
    "#FF9491",
    "#4E3631",
    5.21,
    4.5,
    "pass",
  ],
  [
    "success on success/20 over background",
    "#60C498",
    "#25372A",
    5.93,
    4.5,
    "pass",
  ],
  ["success on success/20 over card", "#60C498", "#2E4032", 5.19, 4.5, "pass"],
  ["input on background", "#7A7366", "#16140F", 3.91, 3, "pass"],
  ["input on card", "#7A7366", "#221F19", 3.49, 3, "pass"],
  ["input on muted", "#7A7366", "#2C2821", 3.12, 3, "pass"],
  ["ring on background", "#93B0FF", "#16140F", 8.67, 3, "pass"],
  ["ring on card", "#93B0FF", "#221F19", 7.74, 3, "pass"],
  ["sidebar-ring on sidebar", "#93B0FF", "#16140F", 8.67, 3, "pass"],
  ["destructive-fill on background", "#FF9491", "#16140F", 8.67, 3, "pass"],
  ["destructive-fill on card", "#FF9491", "#221F19", 7.74, 3, "pass"],
  ["success-fill on background", "#60C498", "#16140F", 8.62, 3, "pass"],
  ["success-fill on card", "#60C498", "#221F19", 7.7, 3, "pass"],
  ["chart-1 on background", "#93B0FF", "#16140F", 8.67, 3, "pass"],
  ["chart-1 on card", "#93B0FF", "#221F19", 7.74, 3, "pass"],
  ["chart-2 on background", "#FF9491", "#16140F", 8.67, 3, "pass"],
  ["chart-2 on card", "#FF9491", "#221F19", 7.74, 3, "pass"],
  ["chart-3 on background", "#F8D874", "#16140F", 13.2, 3, "pass"],
  ["chart-3 on card", "#F8D874", "#221F19", 11.78, 3, "pass"],
  ["chart-4 on background", "#60C498", "#16140F", 8.62, 3, "pass"],
  ["chart-4 on card", "#60C498", "#221F19", 7.7, 3, "pass"],
  ["chart-5 on background", "#A39D90", "#16140F", 6.82, 3, "pass"],
  ["chart-5 on card", "#A39D90", "#221F19", 6.08, 3, "pass"],
  ["primary on syntax-active-line", "#93B0FF", "#221F19", 7.74, 3, "pass"],
];

describe("the arithmetic", () => {
  test.each([
    ["#000000", "#FFFFFF", 21.0],
    ["#767676", "#FFFFFF", 4.54],
    ["#777777", "#FFFFFF", 4.47],
  ])("%s on %s is %d", (fg, bg, ratio) => {
    expect(contrastRatio(fg, bg)).toBe(ratio);
  });

  test("composites at a decimal alpha in integer tenths, halves up", () => {
    // The green channel of light row 27 lands exactly on a half and rounds up.
    expect(compositeTenths("#C42A1F", "#F7F7F4", 0.1)).toBe("#F2E3DF");
    expect(compositeTenths("#FF7D73", "#1E2129", 0.2)).toBe("#4B3338");
  });
});

describe.each([
  ["light", LIGHT],
  ["dark", DARK],
] as const)("the %s theme", (theme, expected) => {
  const rows = contrastTable(tokens, theme);

  test("computes 58 pairs", () => {
    expect(rows).toHaveLength(58);
  });

  test.each(expected.map((row, i) => [i + 1, ...row] as const))(
    "row %d: %s",
    (n, label, fg, bg, ratio, minimum, result) => {
      const row = rows[n - 1];
      expect(row.label).toBe(label);
      expect(row.fg).toBe(fg);
      expect(row.bg).toBe(bg);
      expect(row.ratio).toBe(ratio);
      expect(row.minimum).toBe(minimum);
      expect(row.result as string).toBe(result);
    },
  );

  test("every pair meets its minimum, except the recorded exceptions", () => {
    for (const row of rows) {
      if (row.result === "exception")
        expect(row.ratio).toBeLessThan(row.minimum);
      else expect(row.ratio).toBeGreaterThanOrEqual(row.minimum);
    }
  });
});

describe("across both themes", () => {
  const all = [
    ...contrastTable(tokens, "light"),
    ...contrastTable(tokens, "dark"),
  ];

  test("116 pairs: 114 pass, exactly 2 are the chart-3 exceptions, 0 fail", () => {
    expect(all).toHaveLength(116);
    expect(all.filter((r) => r.result === "pass")).toHaveLength(114);
    expect(all.filter((r) => r.result === "fail")).toHaveLength(0);
    const exceptions = all.filter((r) => r.result === "exception");
    expect(exceptions.map((r) => `${r.theme} ${r.label}`)).toEqual([
      "light chart-3 on background",
      "light chart-3 on card",
    ]);
    expect(tokens.contrast.exceptions).toHaveLength(2);
  });

  test("8 tint hexes equal the table", () => {
    const tints = all.filter((r) => r.label.includes("/")).map((r) => r.bg);
    expect(tints).toEqual([
      "#EEDBD6",
      "#F9E9EA",
      "#DBE4D9",
      "#E6F1EE",
      "#452E29",
      "#4E3631",
      "#25372A",
      "#2E4032",
    ]);
  });

  test("tints composite at 0.1 in light and 0.2 in dark", () => {
    for (const tint of tokens.contrast.tints)
      expect(tint.alpha).toEqual({ light: 0.1, dark: 0.2 });
  });
});

/**
 * 001 decision 8, kept by rule (011 decision 11): no state tint on muted. The
 * light row is the measured witness and must stay below 4.5; the two dark
 * pairs pass on the 0.11.0 palette and are forbidden by rule alone, so the
 * test reads them without a ratio.
 */
describe("the forbidden pairs", () => {
  const rows = forbiddenRows(tokens);

  test("3 pairs: 1 measured below 4.5 at its stated ratio, 2 by rule only", () => {
    expect(rows).toHaveLength(3);
    expect(rows.map((r) => [r.theme, r.label, r.ruleOnly])).toEqual([
      ["light", "destructive on destructive/10 over muted", false],
      ["dark", "destructive on destructive/20 over muted", true],
      ["dark", "success on success/20 over muted", true],
    ]);
    const measured = rows.filter((r) => !r.ruleOnly);
    expect(measured.map((r) => [r.theme, r.bg, r.ratio])).toEqual([
      ["light", "#E5D1CA", 4.08],
    ]);
    for (const row of measured) {
      expect(row.ratio).toBeLessThan(4.5);
      expect(row.ratio).toBe(row.stated!);
    }
    for (const row of rows.filter((r) => r.ruleOnly))
      expect(row.stated).toBeUndefined();
  });

  test("the token file holds 1 measured row and 2 rule-only pairs, each with its why", () => {
    expect(tokens.contrast.forbidden.measured).toHaveLength(1);
    expect(tokens.contrast.forbidden.ruleOnly).toHaveLength(2);
    for (const row of tokens.contrast.forbidden.ruleOnly) {
      expect("ratio" in row).toBe(false);
      expect(row.why).toContain("001 decision 8");
    }
  });
});

// 002 decision 7: the elevated surface's edge against each ground under the scrim.
const SCRIM: [
  theme: string,
  edge: string,
  edgeHex: string,
  over: string,
  scrimmed: string,
  ratio: number,
][] = [
  ["light", "popover", "#FFFFFF", "background", "#7F7F7F", 4],
  ["light", "popover", "#FFFFFF", "card", "#85878B", 3.59],
  ["light", "popover", "#FFFFFF", "muted", "#7A7A79", 4.29],
  ["dark", "elevation-line", "#7A7366", "background", "#0F1114", 4.02],
  ["dark", "elevation-line", "#7A7366", "card", "#141518", 3.88],
  ["dark", "elevation-line", "#7A7366", "muted", "#18191B", 3.74],
];

describe("edges over the scrim", () => {
  const rows = scrimRows(tokens);

  test("6 rows", () => {
    expect(rows).toHaveLength(6);
  });

  test.each(SCRIM.map((row, i) => [i + 1, ...row] as const))(
    "row %d: %s %s over %s",
    (n, theme, edge, edgeHex, over, scrimmed, ratio) => {
      const row = rows[n - 1];
      expect([row.theme, row.edge, row.edgeHex, row.over]).toEqual([
        theme,
        edge,
        edgeHex,
        over,
      ]);
      expect(row.scrimmed).toBe(scrimmed);
      expect(row.ratio).toBe(ratio);
    },
  );

  test("6 of 6 meet 3:1", () => {
    expect(rows.filter((r) => r.ratio >= r.min)).toHaveLength(6);
    for (const row of rows) expect(row.min).toBe(3);
  });
});

// 013 decision 12: every text role on every code ground, in each theme. The
// two grounds of the map (`background`, `active-line`) are not text. The rows
// are built from the token file, never from the specification's table.
// 014 decision 8: the grounds code is actually on. Light code is on its own
// white ground and the canvas active line; dark code is on those and on
// graphite, the ground inside an ink surface on a light page.
const GROUNDS = {
  light: ["syntax-ground", "syntax-active-line"],
  dark: ["syntax-ground", "syntax-active-line", "background"],
} as const;
const TEXT_ROLES = Object.keys(tokens.code).filter(
  (role) => role !== "background" && role !== "active-line",
);
/** Meridian's seven coloured roles and `number`: the eight that carry a hue of their own. */
const COLOURED = [
  "keyword",
  "function",
  "type",
  "string",
  "number",
  "constant",
  "meta",
  "special",
];
/** The coloured eight and the four that share their colours. */
const RANGED = [...COLOURED, "link", "inserted", "deleted", "changed"];
const ROLE_ROWS: [theme: "light" | "dark", role: string, ground: string][] = (
  ["light", "dark"] as const
).flatMap((theme) =>
  TEXT_ROLES.flatMap((role) =>
    GROUNDS[theme].map(
      (ground) => [theme, role, ground] as [typeof theme, string, string],
    ),
  ),
);

/** A role's colour in a theme, from the token file. */
const roleHex = (theme: "light" | "dark", role: string) =>
  resolveColor(tokens, theme, tokens.code[role]!).toUpperCase();

/** A role's ratio on a ground in a theme, from the token file. */
function roleRatio(theme: "light" | "dark", role: string, ground: string) {
  return contrastRatio(
    resolveColor(tokens, theme, tokens.code[role]!),
    resolveColor(tokens, theme, ground),
  );
}

describe("the code roles on the five code grounds (013 decision 12)", () => {
  test("70 rows: 14 text roles on 2 light grounds and 3 dark, 28 light and 42 dark", () => {
    expect(TEXT_ROLES).toHaveLength(14);
    expect(ROLE_ROWS).toHaveLength(70);
    expect(ROLE_ROWS.filter(([theme]) => theme === "light")).toHaveLength(28);
    expect(ROLE_ROWS.filter(([theme]) => theme === "dark")).toHaveLength(42);
  });

  test.each(ROLE_ROWS)(
    "%s: the %s role's colour on %s measures at least 4.5",
    (theme, role, ground) => {
      expect(roleRatio(theme, role, ground)).toBeGreaterThanOrEqual(4.5);
    },
  );

  test("70 of 70 at 4.5 or more, comments included; the lowest is light comment on syntax-active-line at 4.86", () => {
    const rows = ROLE_ROWS.map(([theme, role, ground]) => ({
      theme,
      role,
      ground,
      ratio: roleRatio(theme, role, ground),
    }));
    expect(rows.filter((r) => r.ratio >= 4.5)).toHaveLength(70);
    const min = rows.reduce((a, b) => (b.ratio < a.ratio ? b : a));
    expect(min).toEqual({
      theme: "light",
      role: "comment",
      ground: "syntax-active-line",
      ratio: 4.86,
    });
  });

  // Meridian's dark range, 6.5 to 9.5:1, on the ground a block normally sits on.
  test("12 of 12 dark rows on syntax-ground between 6.5 and 9.5", () => {
    const rows = RANGED.map((role) => [
      role,
      roleRatio("dark", role, "syntax-ground"),
    ]);
    expect(rows).toHaveLength(12);
    for (const [role, ratio] of rows) {
      expect(ratio as number, role as string).toBeGreaterThanOrEqual(6.5);
      expect(ratio as number, role as string).toBeLessThanOrEqual(9.5);
    }
  });

  test("24 of 24 light rows on syntax-ground and syntax-active-line at 15 or less", () => {
    const rows = RANGED.flatMap((role) =>
      GROUNDS.light.map((ground) => roleRatio("light", role, ground)),
    );
    expect(rows).toHaveLength(24);
    expect(rows.filter((ratio) => ratio <= 15)).toHaveLength(24);
  });

  // Decision 11's two rows over Meridian's 9.5, and decision 10's two against
  // its 6:1 comment ceiling, which this system does not use.
  test("the 4 named rows: dark number 10.41 on the active line and 11.66 on graphite; dark comment 6.55 and 7.33", () => {
    const named = [
      ["number", "syntax-active-line", 10.41],
      ["number", "background", 11.66],
      ["comment", "syntax-active-line", 6.55],
      ["comment", "background", 7.33],
    ] as const;
    for (const [role, ground, ratio] of named) {
      const measured = roleRatio("dark", role, ground);
      console.log(
        `dark ${role} on ${ground}: ${measured.toFixed(2)} (Meridian's ceiling ${role === "number" ? "9.5" : "6"})`,
      );
      expect(measured).toBe(ratio);
    }
  });

  // Decision 11's table, to the hundredth: each role on the light ground and
  // line, then the dark ground, line and graphite.
  test.each([
    ["keyword", 7.37, 6.47, 7.04, 7.89, 8.84],
    ["function", 6.66, 5.85, 6.75, 7.57, 8.48],
    ["type", 10.59, 9.3, 6.84, 7.67, 8.59],
    ["string", 6.03, 5.3, 7.1, 7.96, 8.92],
    ["number", 6.77, 5.94, 9.28, 10.41, 11.66],
    ["constant", 5.78, 5.08, 7.49, 8.4, 9.41],
    ["meta", 7.35, 6.46, 7.01, 7.86, 8.81],
    ["special", 6.47, 5.68, 6.5, 7.28, 8.16],
    ["comment", 5.53, 4.86, 5.84, 6.55, 7.33],
    ["text", 14.61, 12.83, 10.93, 12.26, 13.73],
  ] as const)(
    "%s measures decision 11's figures",
    (role, lightGround, lightLine, darkGround, darkLine, graphite) => {
      expect([
        roleRatio("light", role, "syntax-ground"),
        roleRatio("light", role, "syntax-active-line"),
        roleRatio("dark", role, "syntax-ground"),
        roleRatio("dark", role, "syntax-active-line"),
        roleRatio("dark", role, "background"),
      ]).toEqual([lightGround, lightLine, darkGround, darkLine, graphite]);
    },
  );

  test("distinctness: no two coloured roles under ΔE 5.0 in either theme, and dark function to keyword at 7.0 or more", () => {
    for (const theme of ["light", "dark"] as const) {
      const pairs = COLOURED.flatMap((a, i) =>
        COLOURED.slice(i + 1).map((b) => ({
          pair: `${a}–${b}`,
          deltaE: deltaE(roleHex(theme, a), roleHex(theme, b)),
        })),
      );
      expect(pairs).toHaveLength(28);
      const closest = pairs.reduce((x, y) => (y.deltaE < x.deltaE ? y : x));
      console.log(
        `${theme}: closest coloured pair ${closest.pair}, ΔE ${closest.deltaE.toFixed(1)}`,
      );
      expect(pairs.filter((p) => p.deltaE < 5)).toEqual([]);
    }
    expect(
      deltaE(roleHex("dark", "function"), roleHex("dark", "keyword")),
    ).toBeGreaterThanOrEqual(7);
  });

  // Decision 8: printed, not gated. Numbers are digits and constants words.
  test("number and constant under deuteranopia and protanopia, printed", () => {
    for (const theme of ["light", "dark"] as const) {
      const [n, c] = [roleHex(theme, "number"), roleHex(theme, "constant")];
      const figures = {
        typical: deltaE(n, c),
        deuteranopia: deltaEUnder(n, c, "deuteranopia"),
        protanopia: deltaEUnder(n, c, "protanopia"),
      };
      console.log(
        `${theme} number–constant ΔE: ${Object.entries(figures)
          .map(([k, v]) => `${k} ${v.toFixed(1)}`)
          .join(", ")}`,
      );
      expect(figures.typical).toBeGreaterThan(5);
    }
  });

  // The ten Tombaugh colours, as the primitives the text roles resolve to.
  test("the 14 text roles resolve to the 10 Tombaugh colours in each theme", () => {
    const research = JSON.parse(
      readFileSync(
        "context/research/2026-11-14-meridian-and-tombaugh.json",
        "utf8",
      ),
    ) as {
      candidates: {
        id: string;
        palette: { swatches: Record<string, { light: string; dark: string }> };
      }[];
    };
    const swatches = research.candidates.find((c) => c.id === "tombaugh")!
      .palette.swatches;
    const SWATCH: Record<string, string> = {
      text: "tombaugh-text",
      comment: "tombaugh-comment",
      keyword: "tombaugh-keyword",
      function: "tombaugh-function",
      type: "tombaugh-type",
      string: "tombaugh-string",
      number: "tombaugh-yellow",
      constant: "tombaugh-orange",
      meta: "tombaugh-meta",
      special: "tombaugh-special",
      link: "tombaugh-function",
      inserted: "tombaugh-string",
      deleted: "tombaugh-special",
      changed: "tombaugh-function",
    };
    expect(Object.keys(SWATCH)).toEqual(TEXT_ROLES);
    for (const theme of ["light", "dark"] as const) {
      expect(
        new Set(
          TEXT_ROLES.map((role) => tokens.themes[theme][tokens.code[role]!]),
        ).size,
      ).toBe(10);
      for (const role of TEXT_ROLES)
        expect(roleHex(theme, role), `${theme} ${role}`).toBe(
          swatches[SWATCH[role]!]![theme].toUpperCase(),
        );
    }
  });
});

// 005 decision 17: four pairs the navigation items put on the page, each
// read from the token file in both themes. The hexes equal rows 001 and 002
// already hold (accent is muted's hex; popover is card's).
const NAV_ROWS: [
  label: string,
  fg: string,
  bg: string,
  light: number,
  dark: number,
  minimum: number,
][] = [
  [
    "sidebar-accent-foreground on sidebar-accent (the current row)",
    "sidebar-accent-foreground",
    "sidebar-accent",
    15.24,
    12.87,
    4.5,
  ],
  [
    "sidebar-primary on sidebar (the current row's edge)",
    "sidebar-primary",
    "sidebar",
    6.16,
    8.67,
    3,
  ],
  [
    "destructive on accent (the destructive menu item)",
    "destructive",
    "accent",
    4.77,
    6.9,
    4.5,
  ],
  [
    "muted-foreground on popover (the menu's shortcut)",
    "muted-foreground",
    "popover",
    7.38,
    6.08,
    4.5,
  ],
];

describe("the navigation pairs (005 decision 17)", () => {
  test("4 rows", () => {
    expect(NAV_ROWS).toHaveLength(4);
  });

  test.each(NAV_ROWS)(
    "%s measures %d light and %d dark, at least the minimum",
    (_label, fg, bg, light, dark, minimum) => {
      for (const [theme, expected] of [
        ["light", light],
        ["dark", dark],
      ] as const) {
        const measured = contrastRatio(
          resolveColor(tokens, theme, fg),
          resolveColor(tokens, theme, bg),
        );
        expect(measured).toBe(expected);
        expect(measured).toBeGreaterThanOrEqual(minimum);
      }
    },
  );
});

/**
 * 012 decision 4: the sticky bar's glass passes over the hero's glass (R25
 * forbids nesting, not passing; decisions.md, 2026-11-07). Its text,
 * foreground and primary only, on the bar's tint over the hero's tint over
 * the canvas and each field, both themes. 009's stage set is gone (012
 * decision 1).
 */
describe("glass over glass (012 decision 4)", () => {
  const rows = glassOverGlassRows(tokens);

  test("20 rows: 2 themes, 2 roles, the canvas and 4 fields", () => {
    expect(rows).toHaveLength(20);
    expect(rows.filter((r) => r.theme === "light")).toHaveLength(10);
    expect(rows.filter((r) => r.label.startsWith("primary"))).toHaveLength(10);
  });

  test("every row is text, at least 4.5", () => {
    for (const row of rows) {
      expect(row.kind).toBe("text");
      expect(row.minimum).toBe(4.5);
      expect(row.result).toBe("pass");
    }
  });

  test.each([
    ["light", "foreground", 16.34, 16.84],
    // contrast.ts rounds each composite to whole channels, so the light
    // primary rows read one hundredth below the spec review's 5.99 and 6.17;
    // over the canvas the light tint is the canvas, 011's primary on
    // background.
    ["light", "primary", 5.98, 6.16],
    // 016 decision 5: the lifted yellow's field is now the lowest in dark.
    ["dark", "foreground", 15.4, 16.16],
    ["dark", "primary", 8.26, 8.67],
  ] as const)(
    "%s %s: lowest over a field %d, over the canvas %d",
    (theme, role, field, canvas) => {
      const own = rows.filter(
        (r) => r.theme === theme && r.label.startsWith(`${role} on glass`),
      );
      expect(own).toHaveLength(5);
      const onCanvas = own.find((r) => r.label.endsWith("over background"))!;
      expect(onCanvas.ratio).toBe(canvas);
      expect(
        Math.min(...own.filter((r) => r !== onCanvas).map((r) => r.ratio)),
      ).toBe(field);
    },
  );

  test("the ground is the bar's tint over the hero's tint over the field", () => {
    const row = rows.find(
      (r) =>
        r.theme === "light" &&
        r.label === "primary on glass over glass over field-1",
    )!;
    const tint = tokens.expressive.glass.light.tint;
    const once = compositeAlphaByte(tint, tokens.primitives.blue);
    expect(row.bg).toBe(compositeAlphaByte(tint, once));
  });

  test("the stage set is gone", () => {
    expect("stage" in tokens.contrast).toBe(false);
  });
});

/**
 * 011 decision 11, criterion 3: the brand's sets. A field's legend on its
 * fill, as text (4.5) and as a ring (3); text in the theme's own roles on the
 * glass's tint composited over each ground it may lie on (4.5); the same
 * roles on the opaque fallback (4.5); and the ring on the glass (3).
 */
describe("the field set (011 criterion 3)", () => {
  const rows = fieldRows(tokens);

  test("16 rows: 2 themes, 4 fields, text and ring", () => {
    expect(rows).toHaveLength(16);
    expect(rows.filter((r) => r.kind === "text")).toHaveLength(8);
    expect(rows.filter((r) => r.kind === "non-text")).toHaveLength(8);
  });

  test("the legend on each fill measures as the specification records it", () => {
    const text = rows.filter((r) => r.kind === "text");
    expect(text.map((r) => [r.theme, r.label, r.ratio])).toEqual([
      ["light", "field-1-foreground on field-1", 7.02],
      ["light", "field-2-foreground on field-2", 5.61],
      ["light", "field-3-foreground on field-3", 9.53],
      ["light", "field-4-foreground on field-4", 4.96],
      ["dark", "field-1-foreground on field-1", 8.67],
      ["dark", "field-2-foreground on field-2", 8.67],
      ["dark", "field-3-foreground on field-3", 13.2],
      ["dark", "field-4-foreground on field-4", 8.62],
    ]);
  });

  test("every row meets its minimum", () => {
    for (const row of rows) {
      expect(row.minimum).toBe(row.kind === "text" ? 4.5 : 3);
      expect(row.result).toBe("pass");
    }
  });
});

describe("the glass set (011 criterion 3)", () => {
  const rows = glassRows(tokens);

  test("33 rows: 18 light (3 roles over 6 grounds) and 15 dark (3 over 5)", () => {
    expect(rows).toHaveLength(33);
    expect(rows.filter((r) => r.theme === "light")).toHaveLength(18);
    expect(rows.filter((r) => r.theme === "dark")).toHaveLength(15);
  });

  test("every row is text, at least 4.5", () => {
    for (const row of rows) {
      expect(row.minimum).toBe(4.5);
      expect(row.result).toBe("pass");
    }
  });

  test.each([
    ["light", "foreground", 12.43],
    ["light", "muted-foreground", 4.78],
    ["light", "primary", 4.55],
    // 016 decision 5: dark glass over the lifted yellow is lighter.
    ["dark", "foreground", 10.9],
    ["dark", "muted-foreground", 4.6],
    ["dark", "primary", 5.85],
  ] as const)("the lowest %s %s row is %d", (theme, role, ratio) => {
    const own = rows.filter(
      (r) => r.theme === theme && r.label.startsWith(`${role} on glass`),
    );
    expect(own.length).toBe(theme === "light" ? 6 : 5);
    expect(Math.min(...own.map((r) => r.ratio))).toBe(ratio);
  });

  test("a light glass over the light foreground is measured; dark glass never lies over a light ground", () => {
    expect(
      rows.some(
        (r) => r.theme === "light" && r.label.endsWith("over foreground"),
      ),
    ).toBe(true);
    expect(
      rows.filter(
        (r) => r.theme === "dark" && r.label.endsWith("over foreground"),
      ),
    ).toEqual([]);
  });
});

describe("the glass fallback and the ring on glass (011 criterion 3)", () => {
  test("6 fallback rows: the three roles on --glass-fallback in each theme", () => {
    const rows = glassFallbackRows(tokens);
    expect(rows.map((r) => [r.theme, r.label, r.ratio])).toEqual([
      ["light", "foreground on glass-fallback", 18.36],
      ["light", "muted-foreground on glass-fallback", 7.06],
      ["light", "primary on glass-fallback", 6.72],
      ["dark", "foreground on glass-fallback", 14.42],
      ["dark", "muted-foreground on glass-fallback", 6.08],
      ["dark", "primary on glass-fallback", 7.74],
    ]);
    for (const row of rows) expect(row.result).toBe("pass");
  });

  test("the ring on the glass over each ground the glass set names: 11 rows, each at least 3", () => {
    const rows = glassRingRows(tokens);
    expect(rows).toHaveLength(11);
    for (const row of rows) {
      expect(row.kind).toBe("non-text");
      expect(row.minimum).toBe(3);
      expect(row.result).toBe("pass");
    }
  });
});

/** 014 decision 8: the two colour functions, written to the published formulas. */
describe("deltaE and mix (014 decision 8)", () => {
  test("deltaE, the OKLab distance × 100: white to the canvas is 4.61", () => {
    expect(Math.round(deltaE("#FFFFFF", "#F3F0E8") * 100) / 100).toBe(4.61);
    expect(deltaE("#2D48D4", "#2D48D4")).toBe(0);
    expect(deltaE("#FFFFFF", "#F3F0E8")).toBe(deltaE("#F3F0E8", "#FFFFFF"));
  });

  test("mix, t of the way in sRGB, each channel rounded: 13% of primary over white is #E4E7F9", () => {
    expect(mix("#FFFFFF", "#2D48D4", 0.13)).toBe("#E4E7F9");
    expect(mix("#FFFFFF", "#2D48D4", 0)).toBe("#FFFFFF");
    expect(mix("#FFFFFF", "#2D48D4", 1)).toBe("#2D48D4");
  });
});

/**
 * 014 decision 8 and criterion 5: Tombaugh, the palette 013 ships, on this
 * specification's grounds and the 13% selection. It reads the research file,
 * which is never edited after the fact, so the group stays valid once 013
 * lands; 013 may remove it once its own rows measure the same colours.
 */
describe("Tombaugh on the code grounds (014 criterion 5)", () => {
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
  const text = Object.keys(swatches).filter((n) => !NOT_TEXT.includes(n));

  const ground = (theme: "light" | "dark", role: string) =>
    resolveColor(tokens, theme, role).toUpperCase();
  const selection = (theme: "light" | "dark") =>
    mix(ground(theme, "syntax-ground"), ground(theme, "primary"), 0.13);
  const GROUND_SETS = {
    light: [
      ground("light", "syntax-ground"),
      ground("light", "syntax-active-line"),
      selection("light"),
    ],
    dark: [
      ground("dark", "syntax-ground"),
      ground("dark", "syntax-active-line"),
      ground("dark", "background"),
      selection("dark"),
    ],
  };
  const rows = (["light", "dark"] as const).flatMap((theme) =>
    text.flatMap((name) =>
      GROUND_SETS[theme].map((bg) => ({
        theme,
        name,
        bg,
        ratio: contrastRatio(swatches[name]![theme], bg),
      })),
    ),
  );

  test("10 text colours; the selection is #E4E7F9 in light and #393A3E in dark", () => {
    expect(text).toHaveLength(10);
    expect(selection("light")).toBe("#E4E7F9");
    expect(selection("dark")).toBe("#393A3E");
  });

  test("its code-ground and code-active-line swatches equal syntax-ground and syntax-active-line in both themes", () => {
    for (const theme of ["light", "dark"] as const) {
      expect(swatches["code-ground"]![theme].toUpperCase()).toBe(
        ground(theme, "syntax-ground"),
      );
      expect(swatches["code-active-line"]![theme].toUpperCase()).toBe(
        ground(theme, "syntax-active-line"),
      );
    }
  });

  test("70 of 70 rows at 4.5 or more; the lowest is light comment on #E4E7F9, 4.50", () => {
    expect(rows).toHaveLength(70);
    expect(rows.filter((r) => r.theme === "light")).toHaveLength(30);
    expect(rows.filter((r) => r.ratio >= 4.5)).toHaveLength(70);
    const min = rows.reduce((a, b) => (b.ratio < a.ratio ? b : a));
    expect(min).toEqual({
      theme: "light",
      name: "tombaugh-comment",
      bg: "#E4E7F9",
      ratio: 4.5,
    });
  });
});

/**
 * 014 decision 4 and criterion 6: the block's edge reads on every surround.
 * The hairline is composited over the code ground, since it is drawn inside
 * the block's border box; the edge reads when the ground or the hairline is at
 * least ΔE 3 from the surround.
 */
describe("the edge reads (014 criterion 6)", () => {
  const hex = (theme: "light" | "dark", role: string) =>
    resolveColor(tokens, theme, role).toUpperCase();
  const hairline = (theme: "light" | "dark", under: string) =>
    compositeAlphaByte(resolveColor(tokens, theme, "border"), under);
  const glassFallback = tokens.expressive.glass.light.fallback;

  // [label, theme, the ground term, the hairline's ground, the surround]
  const SURROUNDS: [string, "light" | "dark", string, string, string][] = [
    [
      "light background",
      "light",
      hex("light", "syntax-ground"),
      hex("light", "syntax-ground"),
      hex("light", "background"),
    ],
    [
      "light background beside the active line",
      "light",
      hex("light", "syntax-active-line"),
      hex("light", "syntax-ground"),
      hex("light", "background"),
    ],
    [
      "light card",
      "light",
      hex("light", "syntax-ground"),
      hex("light", "syntax-ground"),
      hex("light", "card"),
    ],
    [
      "light muted",
      "light",
      hex("light", "syntax-ground"),
      hex("light", "syntax-ground"),
      hex("light", "muted"),
    ],
    [
      "light glass fallback",
      "light",
      hex("light", "syntax-ground"),
      hex("light", "syntax-ground"),
      String(glassFallback).toUpperCase(),
    ],
    [
      "dark background",
      "dark",
      hex("dark", "syntax-ground"),
      hex("dark", "syntax-ground"),
      hex("dark", "background"),
    ],
    [
      "dark card",
      "dark",
      hex("dark", "syntax-ground"),
      hex("dark", "syntax-ground"),
      hex("dark", "card"),
    ],
    [
      "dark muted",
      "dark",
      hex("dark", "syntax-ground"),
      hex("dark", "syntax-ground"),
      hex("dark", "muted"),
    ],
    // Inside an ink surface the code ground is the surface (007 decision 8):
    // graphite on a light page, card on a dark one.
    [
      "the ink surface on a light page",
      "dark",
      hex("dark", "background"),
      hex("dark", "background"),
      hex("dark", "background"),
    ],
    [
      "the ink surface on a dark page",
      "dark",
      hex("dark", "card"),
      hex("dark", "card"),
      hex("dark", "card"),
    ],
  ];
  const round2 = (n: number) => Math.round(n * 100) / 100;
  const edges = SURROUNDS.map(
    ([label, theme, groundTerm, under, surround]) => ({
      label,
      ground: round2(deltaE(groundTerm, surround)),
      hairline: round2(deltaE(hairline(theme, under), surround)),
    }),
  ).map((e) => ({ ...e, edge: Math.max(e.ground, e.hairline) }));

  test("10 surrounds", () => {
    expect(edges).toHaveLength(10);
  });

  test.each(SURROUNDS.map(([label], i) => [label, i] as const))(
    "%s: the ground or the hairline is at least ΔE 3 from it",
    (_, i) => {
      expect(edges[i]!.edge).toBeGreaterThanOrEqual(3);
    },
  );

  test("the lowest is light background beside the active line, the hairline alone at 3.03", () => {
    const min = edges.reduce((a, b) => (b.edge < a.edge ? b : a));
    expect(min).toEqual({
      label: "light background beside the active line",
      ground: 0,
      hairline: 3.03,
      edge: 3.03,
    });
  });

  test("the table's figures, to one decimal", () => {
    expect(
      edges.map((e) => [
        e.label,
        Math.round(e.ground * 10) / 10,
        Math.round(e.hairline * 10) / 10,
      ]),
    ).toEqual([
      ["light background", 4.6, 3],
      ["light background beside the active line", 0, 3],
      ["light card", 0, 7.3],
      ["light muted", 7.9, 1.5],
      ["light glass fallback", 1.6, 5.8],
      ["dark background", 8.7, 16.6],
      ["dark card", 3.8, 11.7],
      ["dark muted", 0, 7.9],
      ["the ink surface on a light page", 0, 9.5],
      ["the ink surface on a dark page", 0, 8.6],
    ]);
  });
});

/**
 * 014 decision 15 and criterion 16: inline code, a chip on the code ground
 * edged by the hairline. Its text on its ground, and its edge on every
 * surround it may sit on, the hairline composited over the chip's ground.
 */
describe("inline code (014 criterion 16)", () => {
  type Swatches = Record<string, { light: string; dark: string }>;
  const research = JSON.parse(
    readFileSync(
      "context/research/2026-11-14-meridian-and-tombaugh.json",
      "utf8",
    ),
  ) as { candidates: { id: string; palette: { swatches: Swatches } }[] };
  const tombaugh = research.candidates.find((c) => c.id === "tombaugh")!.palette
    .swatches;
  const hex = (theme: "light" | "dark", role: string) =>
    resolveColor(tokens, theme, role).toUpperCase();
  const code = (theme: "light" | "dark", slot: string) =>
    hex(theme, tokens.code[slot]!);

  // The chip's grounds: the code ground in each theme, and inside an ink
  // surface the surface itself, graphite on a light page and card on a dark one.
  const CHIP_GROUNDS: ["light" | "dark", string][] = [
    ["light", code("light", "background")],
    ["dark", code("dark", "background")],
    ["dark", hex("dark", "background")],
    ["dark", hex("dark", "card")],
  ];
  const text = CHIP_GROUNDS.flatMap(([theme, bg]) =>
    [
      ["code-text", code(theme, "text")],
      ["code-link", code(theme, "link")],
      ["tombaugh-text", tombaugh["tombaugh-text"]![theme]],
      ["tombaugh-function", tombaugh["tombaugh-function"]![theme]],
    ].map(([name, fg]) => ({
      theme,
      name,
      bg,
      ratio: contrastRatio(fg!, bg),
    })),
  );

  test("16 text rows, 16 of 16 at 4.5 or more; the lowest is the light link on white, 6.66", () => {
    expect(text).toHaveLength(16);
    expect(text.filter((r) => r.ratio >= 4.5)).toHaveLength(16);
    const min = text.reduce((a, b) => (b.ratio < a.ratio ? b : a));
    // 013: code-link is Tombaugh's function colour, so it ties with it.
    expect(min).toEqual({
      theme: "light",
      name: "code-link",
      bg: "#FFFFFF",
      ratio: 6.66,
    });
  });

  test("the chip's own text: code-text 14.61 and 10.93, code-link 6.66 and 6.75", () => {
    const at = (theme: string, name: string, bg: string) =>
      text.find((r) => r.theme === theme && r.name === name && r.bg === bg)!
        .ratio;
    expect(at("light", "code-text", "#FFFFFF")).toBe(14.61);
    expect(at("dark", "code-text", "#2C2821")).toBe(10.93);
    expect(at("light", "code-link", "#FFFFFF")).toBe(6.66);
    expect(at("dark", "code-link", "#2C2821")).toBe(6.75);
  });

  const field = (theme: "light" | "dark", name: string) => {
    const [fill] =
      tokens.expressive.field[theme][
        name as keyof (typeof tokens.expressive.field)["light"]
      ];
    return tokens.primitives[fill]!.toUpperCase();
  };
  const glassOver = (theme: "light" | "dark", under: string) =>
    compositeAlphaByte(
      String(tokens.expressive.glass[theme].tint),
      under,
    ).toUpperCase();
  const fallback = (theme: "light" | "dark") => {
    const value = String(tokens.expressive.glass[theme].fallback);
    return (
      value.startsWith("#") ? value : tokens.primitives[value]!
    ).toUpperCase();
  };
  const FIELD_NAMES = ["field-1", "field-2", "field-3", "field-4"];

  // [label, theme, the chip's ground, the surround]
  const SURROUNDS: [string, "light" | "dark", string, string][] = (
    ["light", "dark"] as const
  ).flatMap((theme) => {
    const ground = code(theme, "background");
    const rows: [string, "light" | "dark", string, string][] = [
      [`${theme} page`, theme, ground, hex(theme, "background")],
      [`${theme} card`, theme, ground, hex(theme, "card")],
      [`${theme} muted`, theme, ground, hex(theme, "muted")],
      ...FIELD_NAMES.map(
        (f) =>
          [`${theme} ${f}`, theme, ground, field(theme, f)] as [
            string,
            "light" | "dark",
            string,
            string,
          ],
      ),
      [
        `${theme} glass over the canvas`,
        theme,
        ground,
        glassOver(theme, hex(theme, "background")),
      ],
      ...FIELD_NAMES.map(
        (f) =>
          [
            `${theme} glass over ${f}`,
            theme,
            ground,
            glassOver(theme, field(theme, f)),
          ] as [string, "light" | "dark", string, string],
      ),
      [`${theme} glass fallback`, theme, ground, fallback(theme)],
    ];
    if (theme === "dark")
      rows.push(
        [
          "the ink surface on a light page",
          "dark",
          hex("dark", "background"),
          hex("dark", "background"),
        ],
        [
          "the ink surface on a dark page",
          "dark",
          hex("dark", "card"),
          hex("dark", "card"),
        ],
      );
    return rows;
  });
  const round2 = (n: number) => Math.round(n * 100) / 100;
  const edges = SURROUNDS.map(([label, theme, ground, surround]) => {
    const hairline = compositeAlphaByte(
      resolveColor(tokens, theme, "border"),
      ground,
    );
    const g = round2(deltaE(ground, surround));
    const h = round2(deltaE(hairline, surround));
    return { label, ground: g, hairline: h, edge: Math.max(g, h) };
  });

  test("28 surrounds: 13 light, 15 dark", () => {
    expect(edges).toHaveLength(28);
    expect(SURROUNDS.filter(([, t]) => t === "light")).toHaveLength(13);
  });

  test("28 of 28 read, by ground or hairline at 3.0 or more; the lowest is the light page, 4.61", () => {
    expect(edges.filter((e) => e.edge >= 3)).toHaveLength(28);
    const min = edges.reduce((a, b) => (b.edge < a.edge ? b : a));
    expect(min.label).toBe("light page");
    expect(min.edge).toBe(4.61);
  });

  test("decision 15's figures: the page, a card, a user's turn and the ink surface", () => {
    const at = (label: string) => {
      const e = edges.find((x) => x.label === label)!;
      return [e.ground, e.hairline];
    };
    expect(at("light page")).toEqual([4.61, 3.03]);
    expect(at("light card")).toEqual([0, 7.28]);
    expect(at("light muted")).toEqual([7.9, 1.53]);
    expect(at("dark page")).toEqual([8.71, 16.62]);
    expect(at("dark card")).toEqual([3.83, 11.74]);
    expect(at("dark muted")).toEqual([0, 7.91]);
    expect(at("light glass fallback")).toEqual([1.62, 5.78]);
    expect(at("the ink surface on a light page")).toEqual([0, 9.47]);
    expect(at("the ink surface on a dark page")).toEqual([0, 8.56]);
  });
});

/**
 * 016: the brand yellow. #E2B000 in light and #F8D874 in dark in place of
 * amber #F19E20, with a text shade, #806200, as `caution-text`.
 */
describe("the brand yellow (016)", () => {
  const P = tokens.primitives;
  const hex = (theme: "light" | "dark", role: string) =>
    resolveColor(tokens, theme, role).toUpperCase();
  const r1 = (n: number) => Math.round(n * 10) / 10;

  // Criterion 2.
  test("the hues: yellow at 88.0, yellow-text at 87.6, yellow-lifted's chroma 0.125", () => {
    expect(Math.abs(oklch(P.yellow!).h - 88.0)).toBeLessThanOrEqual(0.5);
    expect(Math.abs(oklch(P["yellow-text"]!).h - 87.6)).toBeLessThanOrEqual(
      0.5,
    );
    expect(Math.abs(oklch(P["yellow-lifted"]!).c - 0.125)).toBeLessThanOrEqual(
      0.005,
    );
  });

  // Criterion 3: amber-text read 4.98, 5.67 and 4.51.
  test("the text shade loses nothing to amber-text: 5.03 on paper, 5.73 on white, 4.55 on muted", () => {
    const text = P["yellow-text"]!;
    expect(contrastRatio(text, P.paper!)).toBe(5.03);
    expect(contrastRatio(text, P.raised!)).toBe(5.73);
    expect(contrastRatio(text, hex("light", "muted"))).toBe(4.55);
    expect(contrastRatio(text, P.paper!)).toBeGreaterThanOrEqual(4.98);
    expect(contrastRatio(text, P.raised!)).toBeGreaterThanOrEqual(5.67);
    expect(contrastRatio(text, hex("light", "muted"))).toBeGreaterThanOrEqual(
      4.51,
    );
  });

  test("the text shade is ΔE 4.4 from code-yellow and 27.4 from yellow", () => {
    const d = deltaE(P["yellow-text"]!, P["code-yellow"]!);
    expect(d).toBeGreaterThanOrEqual(3);
    expect(r1(d)).toBe(4.4);
    expect(r1(deltaE(P["yellow-text"]!, P.yellow!))).toBe(27.4);
  });

  // Criterion 4's reason.
  test("the two light chart-3 exceptions give the yellow series' reason", () => {
    for (const e of tokens.contrast.exceptions)
      expect(e.why).toBe(
        "yellow series are labelled directly (the design book §03; WCAG 1.4.11)",
      );
  });

  // Criterion 5: decision 5's field-3 figures.
  test.each([
    ["light", "foreground on glass over field-3", 15.52],
    ["light", "muted-foreground on glass over field-3", 5.97],
    ["light", "primary on glass over field-3", 5.68],
    ["dark", "foreground on glass over field-3", 10.9],
    ["dark", "muted-foreground on glass over field-3", 4.6],
    ["dark", "primary on glass over field-3", 5.85],
  ] as const)("%s %s reads %d", (theme, label, ratio) => {
    const row = glassRows(tokens).find(
      (r) => r.theme === theme && r.label === label,
    )!;
    expect(row.ratio).toBe(ratio);
  });

  test.each([
    ["light", "foreground on glass over glass over field-3", 16.68],
    ["light", "primary on glass over glass over field-3", 6.11],
    ["dark", "foreground on glass over glass over field-3", 15.4],
    ["dark", "primary on glass over glass over field-3", 8.26],
  ] as const)("%s %s reads %d", (theme, label, ratio) => {
    const row = glassOverGlassRows(tokens).find(
      (r) => r.theme === theme && r.label === label,
    )!;
    expect(row.ratio).toBe(ratio);
  });

  test("the ring on glass over field-3 reads 5.68 in light and 5.85 in dark; 11 of 11 ring rows pass", () => {
    const rows = glassRingRows(tokens);
    const at = (theme: string) =>
      rows.find(
        (r) => r.theme === theme && r.label === "ring on glass over field-3",
      )!.ratio;
    expect([at("light"), at("dark")]).toEqual([5.68, 5.85]);
    expect(rows.filter((r) => r.result === "pass")).toHaveLength(11);
    expect(glassFallbackRows(tokens)).toHaveLength(6);
    expect(forbiddenRows(tokens)).toHaveLength(3);
    expect(scrimRows(tokens)).toHaveLength(6);
  });

  // Criterion 6: chart-3 against its neighbours.
  test("chart-3 is ΔE 18.0 or more from its neighbours in both themes; the lowest is dark chart-2, 18.3", () => {
    const rows = (["light", "dark"] as const).flatMap((theme) =>
      ["chart-1", "chart-2", "chart-4", "chart-5"].map((n) => ({
        theme,
        n,
        d: r1(deltaE(hex(theme, "chart-3"), hex(theme, n))),
      })),
    );
    expect(rows.map((r) => r.d)).toEqual([
      48.1, 31.2, 30.3, 37.5, 27.2, 18.3, 19.8, 21.9,
    ]);
    expect(Math.min(...rows.map((r) => r.d))).toBe(18.3);
  });

  test("under protanopia and deuteranopia, 12.0 or more; the lowest is dark chart-4 under protanopia, 12.1", () => {
    const rows = (["light", "dark"] as const).flatMap((theme) =>
      ["chart-1", "chart-2", "chart-4", "chart-5"].flatMap((n) =>
        (["protanopia", "deuteranopia"] as const).map((vision) => ({
          label: `${theme} ${n} ${vision}`,
          d: r1(deltaEUnder(hex(theme, "chart-3"), hex(theme, n), vision)),
        })),
      ),
    );
    expect(rows.every((r) => r.d >= 12)).toBe(true);
    const min = rows.reduce((a, b) => (b.d < a.d ? b : a));
    expect(min).toEqual({ label: "dark chart-4 protanopia", d: 12.1 });
  });

  // Criterion 13: recorded, not gated. Each figure is asserted to match.
  test("the record: the third dot on paper 1.76, on white 2.01, on graphite in expressive dark 13.20", () => {
    const yellow = hex("light", "mark-3");
    expect(yellow).toBe("#E2B000");
    expect(contrastRatio(yellow, P.paper!)).toBe(1.76);
    expect(contrastRatio(yellow, P.raised!)).toBe(2.01);
    expect(contrastRatio(P["yellow-lifted"]!, P.graphite!)).toBe(13.2);
  });

  test("the record: the yellow dot on each field, as decision 5's table has it", () => {
    const fill = (theme: "light" | "dark", f: string) =>
      P[
        tokens.expressive.field[theme][
          f as keyof (typeof tokens.expressive.field)["light"]
        ][0]
      ]!;
    const dot = { light: P.yellow!, dark: P["yellow-lifted"]! };
    const read = (theme: "light" | "dark") =>
      ["field-1", "field-2", "field-3", "field-4"].map((f) => [
        contrastRatio(dot[theme], fill(theme, f)),
        r1(deltaE(dot[theme], fill(theme, f))),
      ]);
    expect(read("light")).toEqual([
      [3.49, 48.1],
      [2.79, 31.2],
      [1, 0],
      [2.46, 30.3],
    ]);
    expect(read("dark")).toEqual([
      [1.52, 27.2],
      [1.52, 18.3],
      [1, 0],
      [1.53, 19.8],
    ]);
  });

  test("the record: light caution's bar on a card 2.01 (was 2.17), its badge fill on the page 1.76 (was 1.91)", () => {
    expect(contrastRatio(hex("light", "caution"), hex("light", "card"))).toBe(
      2.01,
    );
    expect(
      contrastRatio(hex("light", "caution"), hex("light", "background")),
    ).toBe(1.76);
    expect(contrastRatio("#F19E20", hex("light", "card"))).toBe(2.17);
    expect(contrastRatio("#F19E20", hex("light", "background"))).toBe(1.91);
  });
});
