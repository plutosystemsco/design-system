/**
 * 022 decision 11: `app-shell`, by the kinds its parts bring. The skip link
 * moves focus to `<main id="main" tabindex="-1">`, and the reader speaks
 * what main starts with, the page's h1 (F1). At 360 px the menu button opens
 * a sheet named by the app, "Sandbox": named on opening (O1), modal (O2),
 * and Escape returns to the menu button (O3).
 *
 * The O2 test hears `sheet`, whose modality it judges.
 */
import type { Page } from "@playwright/test";
import { declared, test } from "./fixtures.ts";
import { F1, O1, O2, O3 } from "./rules.ts";

const PATH = "/view/app-shell/";
const NAME = "Sandbox";
const NARROW = { width: 360, height: 700 };

const menu = (page: Page) => page.getByRole("button", { name: "Menu" });

async function narrow(page: Page, sr: import("./fixtures.ts").Sr) {
  await page.setViewportSize(NARROW);
  await sr.open(PATH);
  await sr.after(() => menu(page).focus(), "focus");
}

const pressToOpen = async (page: Page) => {
  await page.keyboard.press("Enter");
  await page.getByRole("dialog").waitFor();
};

test(
  "the skip link moves focus to main, and its heading is spoken",
  declared("app-shell", ["F1"]),
  async ({ page, sr }) => {
    await sr.open(PATH);
    await sr.after(
      () => page.locator('[data-slot="app-shell-skip-link"]').focus(),
      "focus",
    );
    const after = await sr.after(() => page.keyboard.press("Enter"));
    await sr.focused(page.locator("main#main"));
    await sr.judge(F1(after, "Projects"));
  },
);

test(
  "at 360 the menu sheet: opening speaks its name",
  declared("app-shell", ["O1"]),
  async ({ page, sr }) => {
    await narrow(page, sr);
    const after = await sr.after(() => pressToOpen(page));
    await sr.judge(O1(after, NAME));
  },
);

test(
  "at 360 the menu sheet: the page behind is never reached in ten steps",
  declared("app-shell", ["O2"], ["sheet"]),
  async ({ page, sr }) => {
    await page.setViewportSize(NARROW);
    await sr.open(PATH);
    const sentinel = await sr.sentinel();
    await sr.after(() => menu(page).focus(), "focus");
    await sr.after(() => pressToOpen(page), "open");
    const steps = await sr.steps(10);
    await sr.judge(O2(steps, sentinel, NAME));
  },
);

test(
  "at 360 the menu sheet: Escape closes it; Menu is spoken and has focus",
  declared("app-shell", ["O3"]),
  async ({ page, sr }) => {
    await narrow(page, sr);
    await sr.after(() => pressToOpen(page), "open");
    const after = await sr.after(() => page.keyboard.press("Escape"), "escape");
    await sr.judge(O3(after, "Menu", await sr.focused(menu(page))));
  },
);
