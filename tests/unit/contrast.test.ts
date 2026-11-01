import { describe, expect, test } from "bun:test";
import {
  compositeTenths,
  contrastRatio,
  contrastTable,
  forbiddenRows,
  scrimRows,
} from "../../scripts/contrast.ts";
import { readTokens, resolveColor } from "../../scripts/tokens.ts";

const tokens = readTokens();

type Row = [
  label: string,
  fg: string,
  bg: string,
  ratio: number,
  minimum: number,
  result: string,
];

// 001 decision 12's tables, held as expected data. Each row is recomputed from the token file.
const LIGHT: Row[] = [
  ["foreground on background", "#14161C", "#F7F7F4", 16.84, 4.5, "pass"],
  ["card-foreground on card", "#14161C", "#FFFFFF", 18.08, 4.5, "pass"],
  ["popover-foreground on popover", "#14161C", "#FFFFFF", 18.08, 4.5, "pass"],
  [
    "secondary-foreground on secondary",
    "#14161C",
    "#FFFFFF",
    18.08,
    4.5,
    "pass",
  ],
  ["foreground on muted", "#14161C", "#EAEAE7", 15.0, 4.5, "pass"],
  ["accent-foreground on accent", "#14161C", "#EAEAE7", 15.0, 4.5, "pass"],
  ["muted-foreground on background", "#4A4F5C", "#F7F7F4", 7.63, 4.5, "pass"],
  ["muted-foreground on card", "#4A4F5C", "#FFFFFF", 8.18, 4.5, "pass"],
  ["muted-foreground on muted", "#4A4F5C", "#EAEAE7", 6.79, 4.5, "pass"],
  ["primary-foreground on primary", "#FFFFFF", "#2456E6", 5.91, 4.5, "pass"],
  ["primary on background", "#2456E6", "#F7F7F4", 5.51, 4.5, "pass"],
  ["primary on card", "#2456E6", "#FFFFFF", 5.91, 4.5, "pass"],
  ["primary on muted", "#2456E6", "#EAEAE7", 4.9, 4.5, "pass"],
  ["destructive on background", "#C42A1F", "#F7F7F4", 5.29, 4.5, "pass"],
  ["destructive on card", "#C42A1F", "#FFFFFF", 5.67, 4.5, "pass"],
  ["destructive on muted", "#C42A1F", "#EAEAE7", 4.71, 4.5, "pass"],
  [
    "destructive-foreground on destructive",
    "#FFFFFF",
    "#C42A1F",
    5.67,
    4.5,
    "pass",
  ],
  ["success on background", "#136E3E", "#F7F7F4", 5.87, 4.5, "pass"],
  ["success on card", "#136E3E", "#FFFFFF", 6.31, 4.5, "pass"],
  ["success on muted", "#136E3E", "#EAEAE7", 5.23, 4.5, "pass"],
  ["success-foreground on success", "#FFFFFF", "#136E3E", 6.31, 4.5, "pass"],
  ["caution-foreground on caution", "#14161C", "#F0AE12", 9.27, 4.5, "pass"],
  ["sidebar-foreground on sidebar", "#14161C", "#F7F7F4", 16.84, 4.5, "pass"],
  [
    "sidebar-primary-foreground on sidebar-primary",
    "#FFFFFF",
    "#2456E6",
    5.91,
    4.5,
    "pass",
  ],
  [
    "sidebar-accent-foreground on sidebar-accent",
    "#14161C",
    "#EAEAE7",
    15.0,
    4.5,
    "pass",
  ],
  ["sidebar-primary on sidebar", "#2456E6", "#F7F7F4", 5.51, 4.5, "pass"],
  [
    "destructive on destructive/10 over background",
    "#C42A1F",
    "#F2E3DF",
    4.55,
    4.5,
    "pass",
  ],
  [
    "destructive on destructive/10 over card",
    "#C42A1F",
    "#F9EAE9",
    4.86,
    4.5,
    "pass",
  ],
  [
    "success on success/10 over background",
    "#136E3E",
    "#E0E9E2",
    5.08,
    4.5,
    "pass",
  ],
  ["success on success/10 over card", "#136E3E", "#E7F1EC", 5.46, 4.5, "pass"],
  ["input on background", "#7C808B", "#F7F7F4", 3.67, 3, "pass"],
  ["input on card", "#7C808B", "#FFFFFF", 3.94, 3, "pass"],
  ["input on muted", "#7C808B", "#EAEAE7", 3.27, 3, "pass"],
  ["ring on background", "#2456E6", "#F7F7F4", 5.51, 3, "pass"],
  ["ring on card", "#2456E6", "#FFFFFF", 5.91, 3, "pass"],
  ["sidebar-ring on sidebar", "#2456E6", "#F7F7F4", 5.51, 3, "pass"],
  ["destructive-fill on background", "#E23A2E", "#F7F7F4", 4.01, 3, "pass"],
  ["destructive-fill on card", "#E23A2E", "#FFFFFF", 4.3, 3, "pass"],
  ["success-fill on background", "#1E9E56", "#F7F7F4", 3.21, 3, "pass"],
  ["success-fill on card", "#1E9E56", "#FFFFFF", 3.45, 3, "pass"],
  ["chart-1 on background", "#2456E6", "#F7F7F4", 5.51, 3, "pass"],
  ["chart-1 on card", "#2456E6", "#FFFFFF", 5.91, 3, "pass"],
  ["chart-2 on background", "#E23A2E", "#F7F7F4", 4.01, 3, "pass"],
  ["chart-2 on card", "#E23A2E", "#FFFFFF", 4.3, 3, "pass"],
  ["chart-3 on background", "#F0AE12", "#F7F7F4", 1.81, 3, "exception"],
  ["chart-3 on card", "#F0AE12", "#FFFFFF", 1.95, 3, "exception"],
  ["chart-4 on background", "#1E9E56", "#F7F7F4", 3.21, 3, "pass"],
  ["chart-4 on card", "#1E9E56", "#FFFFFF", 3.45, 3, "pass"],
  ["chart-5 on background", "#4A4F5C", "#F7F7F4", 7.63, 3, "pass"],
  ["chart-5 on card", "#4A4F5C", "#FFFFFF", 8.18, 3, "pass"],
];

const DARK: Row[] = [
  ["foreground on background", "#F7F7F4", "#14161C", 16.84, 4.5, "pass"],
  ["card-foreground on card", "#F7F7F4", "#1E2129", 14.99, 4.5, "pass"],
  ["popover-foreground on popover", "#F7F7F4", "#1E2129", 14.99, 4.5, "pass"],
  [
    "secondary-foreground on secondary",
    "#F7F7F4",
    "#1E2129",
    14.99,
    4.5,
    "pass",
  ],
  ["foreground on muted", "#F7F7F4", "#2B2D32", 12.83, 4.5, "pass"],
  ["accent-foreground on accent", "#F7F7F4", "#2B2D32", 12.83, 4.5, "pass"],
  ["muted-foreground on background", "#A9ADB8", "#14161C", 8.05, 4.5, "pass"],
  ["muted-foreground on card", "#A9ADB8", "#1E2129", 7.17, 4.5, "pass"],
  ["muted-foreground on muted", "#A9ADB8", "#2B2D32", 6.13, 4.5, "pass"],
  ["primary-foreground on primary", "#14161C", "#7A9BFF", 6.85, 4.5, "pass"],
  ["primary on background", "#7A9BFF", "#14161C", 6.85, 4.5, "pass"],
  ["primary on card", "#7A9BFF", "#1E2129", 6.1, 4.5, "pass"],
  ["primary on muted", "#7A9BFF", "#2B2D32", 5.22, 4.5, "pass"],
  ["destructive on background", "#FF7D73", "#14161C", 7.26, 4.5, "pass"],
  ["destructive on card", "#FF7D73", "#1E2129", 6.46, 4.5, "pass"],
  ["destructive on muted", "#FF7D73", "#2B2D32", 5.53, 4.5, "pass"],
  [
    "destructive-foreground on destructive",
    "#14161C",
    "#FF7D73",
    7.26,
    4.5,
    "pass",
  ],
  ["success on background", "#4CC982", "#14161C", 8.59, 4.5, "pass"],
  ["success on card", "#4CC982", "#1E2129", 7.65, 4.5, "pass"],
  ["success on muted", "#4CC982", "#2B2D32", 6.55, 4.5, "pass"],
  ["success-foreground on success", "#14161C", "#4CC982", 8.59, 4.5, "pass"],
  ["caution-foreground on caution", "#14161C", "#F0AE12", 9.27, 4.5, "pass"],
  ["sidebar-foreground on sidebar", "#F7F7F4", "#14161C", 16.84, 4.5, "pass"],
  [
    "sidebar-primary-foreground on sidebar-primary",
    "#14161C",
    "#7A9BFF",
    6.85,
    4.5,
    "pass",
  ],
  [
    "sidebar-accent-foreground on sidebar-accent",
    "#F7F7F4",
    "#2B2D32",
    12.83,
    4.5,
    "pass",
  ],
  ["sidebar-primary on sidebar", "#7A9BFF", "#14161C", 6.85, 4.5, "pass"],
  [
    "destructive on destructive/20 over background",
    "#FF7D73",
    "#432B2D",
    5.19,
    4.5,
    "pass",
  ],
  [
    "destructive on destructive/20 over card",
    "#FF7D73",
    "#4B3338",
    4.6,
    4.5,
    "pass",
  ],
  [
    "success on success/20 over background",
    "#4CC982",
    "#1F3A30",
    5.85,
    4.5,
    "pass",
  ],
  ["success on success/20 over card", "#4CC982", "#27433B", 5.11, 4.5, "pass"],
  ["input on background", "#787C8A", "#14161C", 4.34, 3, "pass"],
  ["input on card", "#787C8A", "#1E2129", 3.86, 3, "pass"],
  ["input on muted", "#787C8A", "#2B2D32", 3.31, 3, "pass"],
  ["ring on background", "#7A9BFF", "#14161C", 6.85, 3, "pass"],
  ["ring on card", "#7A9BFF", "#1E2129", 6.1, 3, "pass"],
  ["sidebar-ring on sidebar", "#7A9BFF", "#14161C", 6.85, 3, "pass"],
  ["destructive-fill on background", "#FF7D73", "#14161C", 7.26, 3, "pass"],
  ["destructive-fill on card", "#FF7D73", "#1E2129", 6.46, 3, "pass"],
  ["success-fill on background", "#4CC982", "#14161C", 8.59, 3, "pass"],
  ["success-fill on card", "#4CC982", "#1E2129", 7.65, 3, "pass"],
  ["chart-1 on background", "#7A9BFF", "#14161C", 6.85, 3, "pass"],
  ["chart-1 on card", "#7A9BFF", "#1E2129", 6.1, 3, "pass"],
  ["chart-2 on background", "#FF7D73", "#14161C", 7.26, 3, "pass"],
  ["chart-2 on card", "#FF7D73", "#1E2129", 6.46, 3, "pass"],
  ["chart-3 on background", "#F0AE12", "#14161C", 9.27, 3, "pass"],
  ["chart-3 on card", "#F0AE12", "#1E2129", 8.25, 3, "pass"],
  ["chart-4 on background", "#4CC982", "#14161C", 8.59, 3, "pass"],
  ["chart-4 on card", "#4CC982", "#1E2129", 7.65, 3, "pass"],
  ["chart-5 on background", "#A9ADB8", "#14161C", 8.05, 3, "pass"],
  ["chart-5 on card", "#A9ADB8", "#1E2129", 7.17, 3, "pass"],
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

  test("computes 50 pairs", () => {
    expect(rows).toHaveLength(50);
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

  test("100 pairs: 98 pass and exactly 2 are the chart-3 exceptions", () => {
    expect(all).toHaveLength(100);
    expect(all.filter((r) => r.result === "pass")).toHaveLength(98);
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
      "#F2E3DF",
      "#F9EAE9",
      "#E0E9E2",
      "#E7F1EC",
      "#432B2D",
      "#4B3338",
      "#1F3A30",
      "#27433B",
    ]);
  });

  test("tints composite at 0.1 in light and 0.2 in dark", () => {
    for (const tint of tokens.contrast.tints)
      expect(tint.alpha).toEqual({ light: 0.1, dark: 0.2 });
  });
});

describe("the forbidden pairs", () => {
  const rows = forbiddenRows(tokens);

  test("3 pairs, each below 4.5 at its stated ratio", () => {
    expect(rows).toHaveLength(3);
    expect(rows.map((r) => [r.theme, r.bg, r.ratio])).toEqual([
      ["light", "#E6D7D3", 4.06],
      ["dark", "#553D3F", 3.96],
      ["dark", "#324C42", 4.44],
    ]);
    for (const row of rows) {
      expect(row.ratio).toBeLessThan(4.5);
      expect(row.ratio).toBe(row.stated);
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
  ["light", "popover", "#FFFFFF", "background", "#858688", 3.64],
  ["light", "popover", "#FFFFFF", "card", "#898A8D", 3.45],
  ["light", "popover", "#FFFFFF", "muted", "#7F8081", 3.95],
  ["dark", "elevation-line", "#787C8A", "background", "#14161C", 4.34],
  ["dark", "elevation-line", "#787C8A", "card", "#181A21", 4.17],
  ["dark", "elevation-line", "#787C8A", "muted", "#1D1F25", 3.95],
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
const GROUNDS = ["muted", "card", "background"] as const;
const TEXT_SLOTS = Object.keys(tokens.code).filter(
  (slot) => slot !== "background" && slot !== "active-line",
);
const SLOT_ROWS: [theme: "light" | "dark", slot: string, ground: string][] = (
  ["light", "dark"] as const
).flatMap((theme) =>
  TEXT_SLOTS.flatMap((slot) =>
    GROUNDS.map(
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

describe("the code slots on the six code grounds", () => {
  test("114 rows: 19 text slots, 2 themes, 3 grounds", () => {
    expect(TEXT_SLOTS).toHaveLength(19);
    expect(SLOT_ROWS).toHaveLength(114);
  });

  test.each(SLOT_ROWS)(
    "%s: the %s slot's colour on %s measures at least 4.5",
    (theme, slot, ground) => {
      expect(slotRatio(theme, slot, ground)).toBeGreaterThanOrEqual(4.5);
    },
  );

  test("114 of 114 pass; the tightest is the property slot (cyan) on dark muted at 4.52", () => {
    const rows = SLOT_ROWS.map(([theme, slot, ground]) => ({
      theme,
      slot,
      ground,
      ratio: slotRatio(theme, slot, ground),
    }));
    expect(rows.filter((r) => r.ratio >= 4.5)).toHaveLength(114);
    const min = rows.reduce((a, b) => (b.ratio < a.ratio ? b : a));
    expect(min).toEqual({
      theme: "dark",
      slot: "property",
      ground: "muted",
      ratio: 4.52,
    });
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

  // 004 decision 5's five rows still hold, to the hundredth.
  test.each([
    ["light", "foreground", 15.0],
    ["light", "comment", 6.79],
    ["light", "keyword", 4.9],
    ["light", "string", 5.23],
    ["light", "deleted", 4.71],
    ["dark", "foreground", 12.83],
    ["dark", "comment", 6.13],
    ["dark", "keyword", 5.22],
    ["dark", "string", 6.55],
    ["dark", "deleted", 5.53],
  ] as const)(
    "%s: the %s slot on muted still measures %d",
    (theme, slot, ratio) => {
      expect(slotRatio(theme, slot, "muted")).toBe(ratio);
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
    15.0,
    12.83,
    4.5,
  ],
  [
    "sidebar-primary on sidebar (the current row's edge)",
    "sidebar-primary",
    "sidebar",
    5.51,
    6.85,
    3,
  ],
  [
    "destructive on accent (the destructive menu item)",
    "destructive",
    "accent",
    4.71,
    5.53,
    4.5,
  ],
  [
    "muted-foreground on popover (the menu's shortcut)",
    "muted-foreground",
    "popover",
    8.18,
    7.17,
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
