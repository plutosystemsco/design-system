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

export const LEDGER: LedgerLine[] = [
  { ...SUB_MENU_ESCAPE, where: { reader: "voiceover", browser: "webkit" } },
  { ...SUB_MENU_ESCAPE, where: { reader: "voiceover", browser: "chromium" } },
  { ...SUB_MENU_ESCAPE, where: { reader: "nvda", browser: "chromium" } },
  { ...SUB_MENU_ESCAPE, where: { reader: "nvda", browser: "firefox" } },
];
