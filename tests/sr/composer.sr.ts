/**
 * 022 decision 12: `composer`. Its status says "Responding" on a send (L1),
 * not before (L2). Stop, from the button, moves focus back to the textarea,
 * whose name is spoken (F1). The keyboard example's reply is submitted for
 * 700 ms, then streams for 4 s.
 */
import type { Page } from "@playwright/test";
import { appears, declared, test } from "./fixtures.ts";
import { F1, L1, L2 } from "./rules.ts";

const PATH = "/example/composer/keyboard/";

const fixture = (page: Page) => page.getByTestId("keyboard-fixture");
const textbox = (page: Page) =>
  fixture(page).getByRole("textbox", { name: "Message" });
const button = (page: Page) =>
  fixture(page).locator('[data-slot="composer-send"]');

test(
  "a send: the status says Responding, spoken whole, and not before",
  declared("composer", ["L1", "L2"]),
  async ({ page, sr }) => {
    await sr.open(PATH);
    await textbox(page).focus();
    await page.keyboard.type("Estimate pi");
    const before = await sr.before();
    const after = await sr.after(() => page.keyboard.press("Enter"));
    await sr.judge(L1(after, "Responding"), L2(before, after, "Responding"));
  },
);

test(
  "Stop from the button moves focus to the textarea, and its name is spoken",
  declared("composer", ["F1"]),
  async ({ page, sr }) => {
    await sr.open(PATH);
    await textbox(page).focus();
    await page.keyboard.type("Estimate pi");
    await page.keyboard.press("Enter");
    await appears(
      fixture(page).locator('[data-slot="composer"][data-status="streaming"]'),
      "the composer, streaming",
    );
    await button(page).focus();
    const after = await sr.after(() => page.keyboard.press("Enter"));
    await sr.focused(textbox(page));
    await sr.judge(F1(after, "Message"));
  },
);
