import { describe, expect, test } from "bun:test";
import {
  compositeTenths,
  contrastRatio,
  contrastTable,
  forbiddenRows,
} from "../../scripts/contrast.ts";
import { readTokens } from "../../scripts/tokens.ts";

const tokens = readTokens();

type Row = [
  label: string,
  fg: string,
  bg: string,
  ratio: number,
  minimum: number,
  result: string,
];

// Decision 12's tables, held as expected data. Each row is recomputed from the token file.
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
