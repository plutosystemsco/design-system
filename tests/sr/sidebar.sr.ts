/**
 * 022 decision 12: `sidebar`. Below 768 px it is a `sheet`, so the sheet's
 * rules apply to it: O1 the sheet's title, "Sidebar", is spoken on opening;
 * O2 the page behind is never reached; O3 Escape returns to the trigger.
 * Its focus move: opening the sheet puts focus on its first link (F1).
 *
 * The sheet's modality and focus return are `sheet`'s, so these tests hear
 * `sheet` as well as `sidebar` (patch 6 reaches the O2 test through it).
 */
import type { Page } from "@playwright/test";
import { declared, test, type Sr } from "./fixtures.ts";
import { F1, O1, O2, O3 } from "./rules.ts";

const PATH = "/example/sidebar/keyboard/";
const NARROW = { width: 360, height: 700 };
const TITLE = "Sidebar";
const TRIGGER = "Toggle sidebar";
const FIRST_LINK = "Overview";

const trigger = (page: Page) =>
  page.getByTestId("keyboard-fixture").getByRole("button", { name: TRIGGER });

/** At 360 px, so the sidebar is its sheet. */
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
  "at 360 px, opening the sheet speaks its title",
  declared("sidebar", ["O1"], ["sidebar", "sheet"]),
  async ({ page, sr }) => {
    await ready(page, sr);
    await sr.after(() => trigger(page).focus(), "focus");
    const after = await sr.after(() => open(page));
    await sr.judge(O1(after, TITLE));
  },
);

test(
  "at 360 px, opening the sheet moves focus to its first link, which is spoken",
  declared("sidebar", ["F1"], ["sidebar", "sheet"]),
  async ({ page, sr }) => {
    await ready(page, sr);
    await sr.after(() => trigger(page).focus(), "focus");
    const after = await sr.after(() => open(page));
    await sr.focused(
      page
        .locator('[data-slot="sheet-content"]')
        .getByRole("link", { name: FIRST_LINK }),
    );
    await sr.judge(F1(after, FIRST_LINK));
  },
);

test(
  "at 360 px, the page behind the sheet is never reached in ten steps",
  declared("sidebar", ["O2"], ["sidebar", "sheet"]),
  async ({ page, sr }) => {
    await ready(page, sr);
    const sentinel = await sr.sentinel();
    await sr.after(() => trigger(page).focus(), "focus");
    const opened = await sr.after(() => open(page), "open");
    const steps = await sr.steps(10, { trigger: TRIGGER, title: TITLE });
    await sr.judge(O2(opened, steps, sentinel, TITLE, sr.overlay, sr.back));
  },
);

test(
  "at 360 px, Escape closes the sheet; the trigger is spoken and has focus",
  declared("sidebar", ["O3"], ["sidebar", "sheet"]),
  async ({ page, sr }) => {
    await ready(page, sr);
    await sr.after(() => trigger(page).focus(), "focus");
    await sr.after(() => open(page), "open");
    const after = await sr.after(() => page.keyboard.press("Escape"), "escape");
    await sr.judge(O3(after, TRIGGER, await sr.focused(trigger(page))));
  },
);
