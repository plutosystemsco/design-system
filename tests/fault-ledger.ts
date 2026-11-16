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

/** Every browser project: the six of 022 decision 1. */
const EVERY = [
  "chromium-light",
  "chromium-dark",
  "firefox-light",
  "firefox-dark",
  "webkit-light",
  "webkit-dark",
];

/** One line per project, for a fault seen in each. */
const inProjects = (
  line: Omit<LedgerLine, "where">,
  projects: string[],
): LedgerLine[] => projects.map((project) => ({ ...line, where: { project } }));

export const LEDGER: LedgerLine[] = [
  // 022f: the code editor misses 013's budgets on CI's runners, in every
  // engine (the owner, 2026-11-16: one fault; the budgets hold only on a
  // quiet machine, measured at the tag).
  ...inProjects(
    {
      file: "code.spec.ts",
      title:
        "the editor agrees with the block › E7. the budgets, timed in the page: Python's first colour, 200 keystrokes in 5,000 lines; Ruby and Markdown in 2,000",
      expect: { error: "toBeLessThanOrEqual" },
      finding:
        "On CI's two-core runners the editor misses 013's budgets in every engine (keystroke times; in Firefox also the first colour); the budgets were set on a quiet machine.",
      change: "022f",
    },
    EVERY,
  ),
];
