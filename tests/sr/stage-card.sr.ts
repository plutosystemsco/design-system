/**
 * 022 decision 12: `stage-card`. Its status says the run's outcome:
 * "Ran. 2 lines." on success, "Run failed." on a rejected run. Each is
 * spoken whole (L1), and not before (L2). Run keeps focus.
 */
import type { Page } from "@playwright/test";
import { declared, test, type Sr } from "./fixtures.ts";
import { L1, L2 } from "./rules.ts";

const run = (page: Page) =>
  page.locator('[data-slot="stage-card"]').getByRole("button", { name: "Run" });

async function outcome(page: Page, sr: Sr, path: string, message: string) {
  await sr.open(path);
  await run(page).focus();
  const before = await sr.before();
  const after = await sr.after(() => page.keyboard.press("Enter"));
  await sr.judge(L1(after, message), L2(before, after, message));
}

test(
  "a run: the status says the outcome, spoken whole, and not before",
  declared("stage-card", ["L1", "L2"]),
  ({ page, sr }) =>
    outcome(page, sr, "/view/compositions/stage-card/", "Ran. 2 lines."),
);

test(
  "a rejected run: the status says Run failed, spoken whole, and not before",
  declared("stage-card", ["L1", "L2"]),
  ({ page, sr }) =>
    outcome(page, sr, "/view/compositions/stage-card/failing/", "Run failed."),
);
