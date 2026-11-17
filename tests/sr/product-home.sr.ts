/**
 * 022 decision 11: `product-home`, by the kinds its parts bring. The hero's
 * Python card's Run says its outcome in its status, "Ran. 2 lines." (L1,
 * hearing `stage-card`, whose status speaks). At 360 px the bar's menu
 * button opens a sheet named "Pluto Systems": named on opening (O1), modal
 * (O2, hearing `sheet`), and Escape returns to the menu button (O3).
 */
import type { Page } from "@playwright/test";
import { appears, declared, test } from "./fixtures.ts";
import { L1, O1, O2, O3 } from "./rules.ts";

const PATH = "/view/product-home/";
const NAME = "Pluto Systems";
const NARROW = { width: 360, height: 700 };

const run = (page: Page) =>
  page.locator('[data-slot="stage-card"]').getByRole("button", { name: "Run" });
const menu = (page: Page) => page.getByRole("button", { name: "Menu" });

const pressToOpen = async (page: Page) => {
  await page.keyboard.press("Enter");
  await appears(page.getByRole("dialog"), "the navigation dialog");
};

test(
  "the hero card's Run says Ran. 2 lines.",
  declared("product-home", ["L1"], ["stage-card"]),
  async ({ page, sr }) => {
    await sr.open(PATH);
    await sr.after(() => run(page).focus(), "focus");
    const after = await sr.after(() => page.keyboard.press("Enter"));
    await sr.judge(L1(after, "Ran. 2 lines."));
  },
);

test(
  "at 360 the bar's menu sheet: opening speaks its name",
  declared("product-home", ["O1"]),
  async ({ page, sr }) => {
    await page.setViewportSize(NARROW);
    await sr.open(PATH);
    await sr.after(() => menu(page).focus(), "focus");
    const after = await sr.after(() => pressToOpen(page));
    await sr.judge(O1(after, NAME));
  },
);

test(
  "at 360 the bar's menu sheet: the page behind is never reached in ten steps",
  declared("product-home", ["O2"], ["sheet"]),
  async ({ page, sr }) => {
    await page.setViewportSize(NARROW);
    await sr.open(PATH);
    const sentinel = await sr.sentinel();
    await sr.after(() => menu(page).focus(), "focus");
    const opened = await sr.after(() => pressToOpen(page), "open");
    const steps = await sr.steps(10, { trigger: "Menu", title: NAME });
    await sr.judge(O2(opened, steps, sentinel, NAME, sr.overlay, sr.back));
  },
);

test(
  "at 360 the bar's menu sheet: Escape closes it; Menu is spoken and has focus",
  declared("product-home", ["O3"]),
  async ({ page, sr }) => {
    await page.setViewportSize(NARROW);
    await sr.open(PATH);
    await sr.after(() => menu(page).focus(), "focus");
    await sr.after(() => pressToOpen(page), "open");
    const after = await sr.after(() => page.keyboard.press("Escape"), "escape");
    await sr.judge(O3(after, "Menu", await sr.focused(menu(page))));
  },
);
