/**
 * 022 decision 12: `popover`, a portal that is not modal. O1: opening speaks
 * its title; O3: Escape returns focus to the trigger, which is spoken.
 * Patch 3's witness is the O3 test (focus no longer returns on close).
 *
 * The trigger and the title are both "Fuel", so the trigger is focused in a
 * window of its own first: the opening window's action is the key alone.
 * No wait depends on where focus lands; O3 reads it.
 */
import type { Page } from "@playwright/test";
import { declared, test } from "./fixtures.ts";
import { O1, O3 } from "./rules.ts";

const PATH = "/example/popover/keyboard/";
const TITLE = "Fuel";

const trigger = (page: Page) =>
  page.getByTestId("keyboard-fixture").getByRole("button", { name: "Fuel" });

async function open(page: Page): Promise<void> {
  await page.keyboard.press("Enter");
  await page.locator('[data-slot="popover-content"]').waitFor();
}

test(
  "opening speaks the popover's title",
  declared("popover", ["O1"]),
  async ({ page, sr }) => {
    await sr.open(PATH);
    await sr.after(() => trigger(page).focus(), "focus");
    const after = await sr.after(() => open(page));
    await sr.judge(O1(after, TITLE));
  },
);

test(
  "Escape closes it; the trigger is spoken and has focus",
  declared("popover", ["O3"]),
  async ({ page, sr }) => {
    await sr.open(PATH);
    await sr.after(() => trigger(page).focus(), "focus");
    await sr.after(() => open(page), "open");
    const after = await sr.after(() => page.keyboard.press("Escape"), "escape");
    await sr.judge(O3(after, "Fuel", await sr.focused(trigger(page))));
  },
);
