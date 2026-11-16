/**
 * 022 decision 12: `marketing-bar`. Below md its links fold into a `sheet`
 * opened by "Menu", so the sheet's rules apply: O1 the sheet's title (the
 * home label, "Pluto Systems") is spoken on opening; O2 the page behind is
 * never reached; O3 Escape returns to "Menu". Its focus move is the skip
 * link: Enter on "Skip to content" focuses `main#main`, whose first content,
 * the heading "Marketing bar", is spoken (F1).
 *
 * The sheet's modality and focus return are `sheet`'s, so the sheet's
 * tests hear `sheet` as well (patch 6 reaches the O2 test through it).
 */
import type { Page } from "@playwright/test";
import { declared, test, type Sr } from "./fixtures.ts";
import { F1, O1, O2, O3 } from "./rules.ts";

const PATH = "/view/compositions/marketing-bar/";
const NARROW = { width: 390, height: 844 };
const TITLE = "Pluto Systems";
const TRIGGER = "Menu";
const HEADING = "Marketing bar";

const trigger = (page: Page) =>
  page
    .locator('[data-slot="marketing-bar"]')
    .getByRole("button", { name: TRIGGER });

async function ready(page: Page, sr: Sr): Promise<void> {
  await page.setViewportSize(NARROW);
  await sr.open(PATH);
}

/** From the focused trigger: the key alone, then the panel by its slot. */
async function open(page: Page): Promise<void> {
  await page.keyboard.press("Enter");
  await page.locator('[data-slot="sheet-content"]').waitFor();
}

test(
  "the skip link moves focus to main, and its heading is spoken",
  declared("marketing-bar", ["F1"]),
  async ({ page, sr }) => {
    await ready(page, sr);
    await sr.after(
      () => page.locator('[data-slot="marketing-bar-skip-link"]').focus(),
      "skip link",
    );
    const after = await sr.after(() => page.keyboard.press("Enter"));
    await sr.focused(page.locator("main#main"));
    await sr.judge(F1(after, HEADING));
  },
);

test(
  "below md, opening the menu's sheet speaks its title",
  declared("marketing-bar", ["O1"], ["marketing-bar", "sheet"]),
  async ({ page, sr }) => {
    await ready(page, sr);
    await sr.after(() => trigger(page).focus(), "focus");
    const after = await sr.after(() => open(page));
    await sr.judge(O1(after, TITLE));
  },
);

test(
  "below md, the page behind the menu's sheet is never reached in ten steps",
  declared("marketing-bar", ["O2"], ["marketing-bar", "sheet"]),
  async ({ page, sr }) => {
    await ready(page, sr);
    const sentinel = await sr.sentinel();
    await sr.after(() => trigger(page).focus(), "focus");
    await sr.after(() => open(page), "open");
    const steps = await sr.steps(10);
    await sr.judge(O2(steps, sentinel, TITLE));
  },
);

test(
  "below md, Escape closes the menu's sheet; Menu is spoken and has focus",
  declared("marketing-bar", ["O3"], ["marketing-bar", "sheet"]),
  async ({ page, sr }) => {
    await ready(page, sr);
    await sr.after(() => trigger(page).focus(), "focus");
    await sr.after(() => open(page), "open");
    const after = await sr.after(() => page.keyboard.press("Escape"), "escape");
    await sr.judge(O3(after, TRIGGER, await sr.focused(trigger(page))));
  },
);
