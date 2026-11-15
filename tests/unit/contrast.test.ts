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
  ["caution-foreground on caution", "#0B0F17", "#F19E20", 8.81, 4.5, "pass"],
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
  ["chart-3 on background", "#F19E20", "#F3F0E8", 1.91, 3, "exception"],
  ["chart-3 on card", "#F19E20", "#FFFFFF", 2.17, 3, "exception"],
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
  ["caution-foreground on caution", "#0B0F17", "#F19E20", 8.81, 4.5, "pass"],
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
  ["chart-3 on background", "#F19E20", "#16140F", 8.45, 3, "pass"],
  ["chart-3 on card", "#F19E20", "#221F19", 7.55, 3, "pass"],
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

  test("computes 55 pairs", () => {
    expect(rows).toHaveLength(55);
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

  test("110 pairs: 108 pass, exactly 2 are the chart-3 exceptions, 0 fail", () => {
    expect(all).toHaveLength(110);
    expect(all.filter((r) => r.result === "pass")).toHaveLength(108);
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

// 007 decision 3: every text slot on every code ground, in each theme. The
// two grounds of the map (`background`, `active-line`) are not text. The rows
// are built from the token file, never from the specification's table.
// 014 decision 8: the grounds code is actually on. Light code is on its own
// white ground and the canvas active line; dark code is on those and on
// graphite, the ground inside an ink surface on a light page.
const GROUNDS = {
  light: ["syntax-ground", "syntax-active-line"],
  dark: ["syntax-ground", "syntax-active-line", "background"],
} as const;
const TEXT_SLOTS = Object.keys(tokens.code).filter(
  (slot) => slot !== "background" && slot !== "active-line",
);
const SLOT_ROWS: [theme: "light" | "dark", slot: string, ground: string][] = (
  ["light", "dark"] as const
).flatMap((theme) =>
  TEXT_SLOTS.flatMap((slot) =>
    GROUNDS[theme].map(
      (ground) => [theme, slot, ground] as [typeof theme, string, string],
    ),
  ),
);

/** A slot's ratio on a ground in a theme, from the token file. */
function slotRatio(theme: "light" | "dark", slot: string, ground: string) {
  return contrastRatio(
    resolveColor(tokens, theme, tokens.code[slot]),
    resolveColor(tokens, theme, ground),
  );
}

describe("the code slots on the five code grounds", () => {
  test("95 rows: 19 text slots on 2 light grounds and 3 dark", () => {
    expect(TEXT_SLOTS).toHaveLength(19);
    expect(SLOT_ROWS).toHaveLength(95);
  });

  test.each(SLOT_ROWS)(
    "%s: the %s slot's colour on %s measures at least 4.5",
    (theme, slot, ground) => {
      expect(slotRatio(theme, slot, ground)).toBeGreaterThanOrEqual(4.5);
    },
  );

  // 014 criterion 3: the tightest row is dark property on the dark code
  // ground; in light, number and escape (one colour, orange) on the canvas
  // active line tie.
  test("95 of 95 pass; the tightest is dark property on syntax-ground at 4.81, and light number and escape on syntax-active-line at 4.97", () => {
    const rows = SLOT_ROWS.map(([theme, slot, ground]) => ({
      theme,
      slot,
      ground,
      ratio: slotRatio(theme, slot, ground),
    }));
    expect(rows.filter((r) => r.ratio >= 4.5)).toHaveLength(95);
    const min = rows.reduce((a, b) => (b.ratio < a.ratio ? b : a));
    expect(min).toEqual({
      theme: "dark",
      slot: "property",
      ground: "syntax-ground",
      ratio: 4.81,
    });
    const light = rows.filter((r) => r.theme === "light");
    const lightMin = Math.min(...light.map((r) => r.ratio));
    expect(lightMin).toBe(4.97);
    expect(
      light
        .filter((r) => r.ratio === lightMin)
        .map((r) => `${r.slot} on ${r.ground}`),
    ).toEqual(["number on syntax-active-line", "escape on syntax-active-line"]);
  });

  // The ten families, as the primitives the text slots resolve to.
  test("the 19 text slots resolve to 10 families in each theme", () => {
    const families = (theme: "light" | "dark") =>
      [
        ...new Set(
          TEXT_SLOTS.map((slot) => tokens.themes[theme][tokens.code[slot]]),
        ),
      ].sort();
    expect(families("light")).toEqual(
      [
        "ink",
        "ink-soft",
        "blue",
        "green-text",
        "red-text",
        "orange-text",
        "amber-text",
        "purple-text",
        "teal-text",
        "cyan-text",
      ].sort(),
    );
    expect(families("dark")).toEqual(
      [
        "paper",
        "paper-soft",
        "blue-lifted",
        "green-lifted",
        "red-lifted",
        "orange-lifted",
        "amber",
        "purple-lifted",
        "teal-lifted",
        "cyan-lifted",
      ].sort(),
    );
  });

  // 004 decision 5's five rows, to the hundredth, on the 0.11.0 palette (011
  // decision 2), on the code ground (014 decision 8).
  test.each([
    ["light", "foreground", 19.17],
    ["light", "comment", 7.38],
    ["light", "keyword", 7.02],
    ["light", "string", 5.88],
    ["light", "deleted", 6],
    ["dark", "foreground", 12.87],
    ["dark", "comment", 5.43],
    ["dark", "keyword", 6.9],
    ["dark", "string", 6.87],
    ["dark", "deleted", 6.9],
  ] as const)(
    "%s: the %s slot on syntax-ground measures %d",
    (theme, slot, ratio) => {
      expect(slotRatio(theme, slot, "syntax-ground")).toBe(ratio);
    },
  );
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
    ["dark", "foreground", 15.53, 16.16],
    ["dark", "primary", 8.33, 8.67],
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
      ["light", "field-3-foreground on field-3", 8.81],
      ["light", "field-4-foreground on field-4", 4.96],
      ["dark", "field-1-foreground on field-1", 8.67],
      ["dark", "field-2-foreground on field-2", 8.67],
      ["dark", "field-3-foreground on field-3", 8.45],
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
    ["dark", "foreground", 12.06],
    ["dark", "muted-foreground", 5.09],
    ["dark", "primary", 6.47],
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
      ["code-foreground", code(theme, "foreground")],
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

  test("16 text rows, 16 of 16 at 4.5 or more; the lowest is Tombaugh's light link on white, 6.66", () => {
    expect(text).toHaveLength(16);
    expect(text.filter((r) => r.ratio >= 4.5)).toHaveLength(16);
    const min = text.reduce((a, b) => (b.ratio < a.ratio ? b : a));
    expect(min).toEqual({
      theme: "light",
      name: "tombaugh-function",
      bg: "#FFFFFF",
      ratio: 6.66,
    });
  });

  test("the chip's own text: code-foreground 19.17 and 12.87, code-link 7.02 and 6.90", () => {
    const at = (theme: string, name: string, bg: string) =>
      text.find((r) => r.theme === theme && r.name === name && r.bg === bg)!
        .ratio;
    expect(at("light", "code-foreground", "#FFFFFF")).toBe(19.17);
    expect(at("dark", "code-foreground", "#2C2821")).toBe(12.87);
    expect(at("light", "code-link", "#FFFFFF")).toBe(7.02);
    expect(at("dark", "code-link", "#2C2821")).toBe(6.9);
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
