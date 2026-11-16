/**
 * 022 decision 16: the open faults the matrix found, one line each, until
 * the small change that fixes it lands. A ledgered test is expected to fail,
 * in its `where`, for the reason its `expect` names (`tests/ledger.ts`).
 *
 * The tag waits until this list is empty (022 Q3), and the release check
 * refuses while it is not. This file imports nothing but a type, so the
 * release check can read it without Playwright.
 */
import type { LedgerLine } from "./ledger.ts";

const FIREFOX = ["firefox-light", "firefox-dark"];

/** One line per project, for a fault seen in each. */
const inProjects = (
  line: Omit<LedgerLine, "where">,
  projects: string[],
): LedgerLine[] => projects.map((project) => ({ ...line, where: { project } }));

const BLOCKS = [
  "hero",
  "sign-in",
  "sign-up",
  "page-states",
  "settings",
  "app-shell",
  "chat",
  "product-home",
];

export const LEDGER: LedgerLine[] = [
  // 022b: the pressed theme segment in Firefox's forced palette. The test
  // runs in light projects only (onlyProjects).
  {
    file: "forced-colors.spec.ts",
    title: "axe finds 0 violations on /components/button/",
    where: { project: "firefox-light" },
    expect: { error: "/components/button/: color-contrast" },
    finding:
      "The frame's theme switch paints its pressed segment SelectedItem on SelectedItemText: 2.94:1 in Firefox's forced palette.",
    change: "022b",
  },
  // 022c: the viewer's theme copy loses to the frame's own code in Firefox.
  ...BLOCKS.flatMap((block) =>
    inProjects(
      {
        file: "viewer.spec.ts",
        title: `${block} › 4. the frame's <html> is dark exactly when the page's is: at load, after the toggle, and back`,
        expect: { error: "the frame's theme is the page's" },
        finding:
          "In Firefox the frame keeps its own theme: the viewer's copy runs before the frame's own theme code.",
        change: "022c",
      },
      FIREFOX,
    ),
  ),
  // 022d: the overflowing section nav is a Tab stop in Firefox.
  ...inProjects(
    {
      file: "keyboard.spec.ts",
      title:
        "at 1280 × 900 › the Components landing: Tab visits its 201 stops in order, each with the ring unclipped",
      expect: { error: "nav:Components pages" },
      finding:
        "Firefox makes the overflowing section nav a Tab stop of its own, before its first link.",
      change: "022d",
    },
    FIREFOX,
  ),
  // 022f: the code editor misses 013's budgets in Firefox.
  ...inProjects(
    {
      file: "code.spec.ts",
      title:
        "the editor agrees with the block › E7. the budgets, timed in the page: Python's first colour, 200 keystrokes in 5,000 lines; Ruby and Markdown in 2,000",
      expect: { error: "toBeLessThanOrEqual" },
      finding:
        "In Firefox the editor's first colour and keystroke times miss 013's budgets, which Chromium and WebKit meet.",
      change: "022f",
    },
    FIREFOX,
  ),
  // 022e: the overflowing sidebar content is a Tab stop in Firefox.
  ...inProjects(
    {
      file: "keyboard.spec.ts",
      title:
        "block views at 1280 › /view/app-shell/sidebar-icon/: 12 stops in order, each with the ring, then out of the document",
      expect: { error: "div:workspace" },
      finding:
        "Firefox makes the icon sidebar's overflowing content a Tab stop of its own, before its first link.",
      change: "022e",
    },
    FIREFOX,
  ),
];
