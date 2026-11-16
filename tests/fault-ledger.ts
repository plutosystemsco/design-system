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

const SUB_MENU_ESCAPE = {
  file: "dropdown-menu.sr.ts",
  title: "Escape in the sub-menu speaks its parent item, which has focus",
  expect: { fault: "O3s" },
  finding:
    "Escape in a sub-menu closes the whole menu and focus goes to the trigger, not the parent item.",
  change: "022a",
} as const;

const FIREFOX = ["firefox-light", "firefox-dark"];

/** One line per project, for a fault seen in each. */
const inProjects = (
  line: Omit<LedgerLine, "where">,
  projects: string[],
): LedgerLine[] => projects.map((project) => ({ ...line, where: { project } }));

export const LEDGER: LedgerLine[] = [
  // 022a: dropdown-menu's sub-menu, under every reader and browser pair.
  { ...SUB_MENU_ESCAPE, where: { reader: "voiceover", browser: "webkit" } },
  { ...SUB_MENU_ESCAPE, where: { reader: "voiceover", browser: "chromium" } },
  { ...SUB_MENU_ESCAPE, where: { reader: "nvda", browser: "chromium" } },
  { ...SUB_MENU_ESCAPE, where: { reader: "nvda", browser: "firefox" } },
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
