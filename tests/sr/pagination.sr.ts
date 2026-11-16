/**
 * 027 decision 11: `pagination`, under a screen reader. In button mode a
 * hidden status says the new page, "Page 6 of 12", since focus stays on the
 * pressed control; when an end control vanishes, focus moves to the current
 * page, or, narrow, to the other end control.
 *
 * `hears` names the part each test judges, so the `pagination-status`
 * mutation expects exactly P1, which hears the status.
 */
import type { Page } from "@playwright/test";
import { declared, test } from "./fixtures.ts";
import { F1, L1, L2, L3, normalise } from "./rules.ts";

/** The pagination's parts a test may hear (027 decision 11). */
export const PARTS = ["status", "pages"];

const BUTTONS = "/example/pagination/buttons/";
const button = (page: Page, name: string) =>
  page
    .locator('[data-slot="pagination"]')
    .getByRole("button", { name, exact: true });

/** Presses a control by Enter, with focus on it, as a reader's user would. */
async function press(page: Page, name: string): Promise<void> {
  await button(page, name).focus();
  await page.keyboard.press("Enter");
}

test(
  "P1 a page is said: Next on page 5 speaks Page 6 of 12, once, and not before",
  declared("pagination", ["L1", "L2", "L3"], ["pagination:status"]),
  async ({ page, sr }) => {
    await sr.open(BUTTONS);
    await button(page, "Next page").focus();
    const before = await sr.before();
    const after = await sr.after(() => page.keyboard.press("Enter"));
    const message = "Page 6 of 12";
    await sr.judge(
      L1(after, message),
      L2(before, after, message),
      L3(after, message),
    );
  },
);

test(
  "P2 the end: Next onto the last page moves focus to Page 12, which is spoken",
  declared("pagination", ["F1"], ["pagination:pages"]),
  async ({ page, sr }) => {
    await sr.open(BUTTONS);
    await press(page, "Page 12");
    await press(page, "Page 11");
    await button(page, "Next page").focus();
    const after = await sr.after(() => page.keyboard.press("Enter"));
    await sr.focused(button(page, "Page 12"));
    // The review's finding 6: the status's "Page 12 of 12" also holds
    // "Page 12". 022q decision 6: the status's text is taken out of each
    // phrase, not the phrase, since NVDA may speak it and the focus
    // announcement as one ("Page 12 of 12. list, with 6 items, Page, 12,
    // button, current page").
    const status = normalise("Page 12 of 12");
    await sr.judge(
      F1(
        after.map((p) => normalise(p).replaceAll(status, " ")),
        "Page 12",
      ),
    );
  },
);

test(
  "P3 the end, narrow: Next onto the last page moves focus to Previous page, which is spoken",
  declared("pagination", ["F1"], ["pagination:pages"]),
  async ({ page, sr }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await sr.open("/example/pagination/narrow/");
    await button(page, "Next page").focus();
    for (let i = 0; i < 6; i++) await page.keyboard.press("Enter");
    const after = await sr.after(() => page.keyboard.press("Enter"));
    await sr.focused(button(page, "Previous page"));
    await sr.judge(F1(after, "Previous page"));
  },
);
