/**
 * 022 decision 12: `alert`. Its role follows the variant, from a role map:
 * alert for destructive, status for success and caution. The roles example
 * inserts the alerts after load, as an app inserts them. The destructive
 * one, with role alert, is spoken whole on insertion (L1), and not before
 * (L2). This is patch 1's witness (decision 15): with no live role in the
 * map, nothing is spoken.
 *
 * The waits never ask for a role: a mutation that removes the role must
 * fail the rule, not time out the set-up.
 */
import type { Page } from "@playwright/test";
import { declared, test } from "./fixtures.ts";
import { L1, L2 } from "./rules.ts";

const PATH = "/example/alert/roles/";
const DESTRUCTIVE = "Error: role alert";

const insert = (page: Page) => page.getByTestId("insert-alerts");

test(
  "a destructive alert inserted after load is spoken whole, and not before",
  declared("alert", ["L1", "L2"]),
  async ({ page, sr }) => {
    await sr.open(PATH);
    await insert(page).focus();
    const before = await sr.before();
    const after = await sr.after(async () => {
      await page.keyboard.press("Enter");
      await page
        .getByTestId("inserted-alerts")
        .locator('[data-slot="alert"]', { hasText: DESTRUCTIVE })
        .waitFor();
    });
    await sr.judge(L1(after, DESTRUCTIVE), L2(before, after, DESTRUCTIVE));
  },
);
