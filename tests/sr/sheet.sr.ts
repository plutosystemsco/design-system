/**
 * 022 decision 12: `sheet`, a modal panel on one edge. O1 its title is
 * spoken on opening; O2 the page behind is never reached (patch 6's
 * witness: the sheet no longer modal); O3 Escape returns to the trigger.
 */
import type { Page } from "@playwright/test";
import { declared, test } from "./fixtures.ts";
import { O1, O2, O3 } from "./rules.ts";

const PATH = "/example/sheet/keyboard/";
const TITLE = "Navigation";
const TRIGGER = "Open navigation";

const trigger = (page: Page) =>
  page.getByTestId("keyboard-fixture").getByRole("button", { name: TRIGGER });

/** From the focused trigger: the key alone, then the panel by its slot. */
async function open(page: Page): Promise<void> {
  await page.keyboard.press("Enter");
  await page.locator('[data-slot="sheet-content"]').waitFor();
}

test(
  "opening speaks the sheet's title",
  declared("sheet", ["O1"]),
  async ({ page, sr }) => {
    await sr.open(PATH);
    await sr.after(() => trigger(page).focus(), "focus");
    const after = await sr.after(() => open(page));
    await sr.judge(O1(after, TITLE));
  },
);

test(
  "the page behind the sheet is never reached in ten steps",
  declared("sheet", ["O2"]),
  async ({ page, sr }) => {
    await sr.open(PATH);
    const sentinel = await sr.sentinel();
    await sr.after(() => trigger(page).focus(), "focus");
    await sr.after(() => open(page), "open");
    const steps = await sr.steps(10);
    await sr.judge(O2(steps, sentinel, TITLE, sr.inside));
  },
);

test(
  "Escape closes it; the trigger is spoken and has focus",
  declared("sheet", ["O3"]),
  async ({ page, sr }) => {
    await sr.open(PATH);
    await sr.after(() => trigger(page).focus(), "focus");
    await sr.after(() => open(page), "open");
    const after = await sr.after(() => page.keyboard.press("Escape"), "escape");
    await sr.judge(O3(after, TRIGGER, await sr.focused(trigger(page))));
  },
);
