/**
 * 022 decision 12: `alert-dialog`, modal, on the scrim, starting on Cancel.
 * O1 its title is spoken on opening; O2 the page behind is never reached;
 * O3 Escape returns to the trigger, which is spoken and focused.
 */
import type { Page } from "@playwright/test";
import { declared, test } from "./fixtures.ts";
import { O1, O2, O3 } from "./rules.ts";

const PATH = "/example/alert-dialog/keyboard/";
const TITLE = "Delete pluto-sandbox?";
const TRIGGER = "Delete project";

const trigger = (page: Page) => page.getByTestId("dialog-trigger");

/** From the focused trigger: the key alone, then the dialog by role, unnamed. */
async function open(page: Page): Promise<void> {
  await page.keyboard.press("Enter");
  await page.getByRole("alertdialog").waitFor();
}

test(
  "opening speaks the alert dialog's title",
  declared("alert-dialog", ["O1"]),
  async ({ page, sr }) => {
    await sr.open(PATH);
    await sr.after(() => trigger(page).focus(), "focus");
    const after = await sr.after(() => open(page));
    await sr.judge(O1(after, TITLE));
  },
);

test(
  "the page behind the alert dialog is never reached in ten steps",
  declared("alert-dialog", ["O2"]),
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
  declared("alert-dialog", ["O3"]),
  async ({ page, sr }) => {
    await sr.open(PATH);
    await sr.after(() => trigger(page).focus(), "focus");
    await sr.after(() => open(page), "open");
    const after = await sr.after(() => page.keyboard.press("Escape"), "escape");
    await sr.judge(O3(after, TRIGGER, await sr.focused(trigger(page))));
  },
);
