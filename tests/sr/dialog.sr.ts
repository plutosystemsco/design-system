/**
 * 022 decision 12: `dialog`, a modal named by its title. O1 its title is
 * spoken on opening; O2 the page behind is never reached; O3 Escape returns
 * to the trigger, which is spoken and focused.
 */
import type { Page } from "@playwright/test";
import { declared, test } from "./fixtures.ts";
import { O1, O2, O3 } from "./rules.ts";

const PATH = "/example/dialog/keyboard/";
const TITLE = "Rename project";

const trigger = (page: Page) =>
  page
    .getByTestId("keyboard-fixture")
    .getByRole("button", { name: "Rename project" });

/**
 * The trigger is focused before the window, so the window's action is the
 * key press alone: the trigger's name, spoken on focus, never satisfies O1.
 */
async function open(page: Page): Promise<void> {
  await page.keyboard.press("Enter");
  await page.getByRole("dialog").waitFor();
}

test(
  "opening speaks the dialog's title",
  declared("dialog", ["O1"]),
  async ({ page, sr }) => {
    await sr.open(PATH);
    await sr.after(() => trigger(page).focus(), "focus");
    const after = await sr.after(() => open(page));
    await sr.judge(O1(after, TITLE));
  },
);

test(
  "the page behind the dialog is never reached in ten steps",
  declared("dialog", ["O2"]),
  async ({ page, sr }) => {
    await sr.open(PATH);
    const sentinel = await sr.sentinel();
    await sr.after(() => trigger(page).focus(), "focus");
    await sr.after(() => open(page), "open");
    const steps = await sr.steps(10);
    await sr.judge(O2(steps, sentinel, TITLE));
  },
);

test(
  "Escape closes it; the trigger is spoken and has focus",
  declared("dialog", ["O3"]),
  async ({ page, sr }) => {
    await sr.open(PATH);
    await sr.after(() => trigger(page).focus(), "focus");
    await sr.after(() => open(page), "open");
    const after = await sr.after(() => page.keyboard.press("Escape"), "escape");
    await sr.judge(O3(after, TITLE, await sr.focused(trigger(page))));
  },
);
