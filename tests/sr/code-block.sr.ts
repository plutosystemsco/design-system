/**
 * 022 decision 12: `code-block`. Its copy button's status region, in the
 * page from the first render, says "Copied" (or "Could not copy" where the
 * write is refused). The outcome is spoken whole (L1), and not read twice
 * in a row (L3). This is patch 7's witness (decision 15): a status region
 * rendered twice reads the outcome twice.
 *
 * The status regions are never counted: patch 7 renders two, and the rule
 * must fail, not the set-up. The outcome is read from the first.
 */
import type { Page } from "@playwright/test";
import { declared, test } from "./fixtures.ts";
import { L1, L3 } from "./rules.ts";

const PATH = "/example/code-block/keyboard/";

const fixture = (page: Page) => page.getByTestId("keyboard-fixture");
const copyButton = (page: Page) =>
  fixture(page).locator('[data-slot="code-block-copy-button"]');
const status = (page: Page) =>
  fixture(page)
    .locator('[data-slot="code-block-copy-button"] ~ [data-slot="status"]')
    .first();

test(
  "copy: the outcome is spoken whole, and not twice in a row",
  declared("code-block", ["L1", "L3"]),
  async ({ page, sr }) => {
    // Where the engine grants it, the write succeeds and the outcome is
    // "Copied"; where it does not, "Could not copy". Either is judged.
    await page
      .context()
      .grantPermissions(["clipboard-read", "clipboard-write"])
      .catch(() => undefined);
    await sr.open(PATH);
    await copyButton(page).focus();
    let outcome = "";
    const after = await sr.after(async () => {
      await page.keyboard.press("Enter");
      await status(page)
        .filter({ hasText: /\S/ })
        .waitFor({ timeout: 2000 })
        .catch(() => undefined);
      outcome = ((await status(page).textContent()) ?? "").trim();
    });
    sr.fact(
      `the copy status said something (${JSON.stringify(outcome)})`,
      !!outcome,
    );
    const message = outcome || "Copied";
    await sr.judge(L1(after, message), L3(after, message));
  },
);
