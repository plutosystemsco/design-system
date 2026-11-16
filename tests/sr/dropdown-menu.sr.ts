/**
 * 022 decision 12: `dropdown-menu`, a portal menu with a sub-menu. Not
 * modal: O1 opening speaks its first item; O3 Escape returns to the
 * trigger, spoken and focused; O3s a sub-menu's Escape speaks its parent
 * item, which has focus.
 */
import type { Page } from "@playwright/test";
import { declared, test } from "./fixtures.ts";
import { O1, O3, O3s } from "./rules.ts";

const PATH = "/example/dropdown-menu/keyboard/";
const TRIGGER = "Account";
const FIRST = "Profile";
const PARENT = "Invite users";

const trigger = (page: Page) =>
  page.getByTestId("keyboard-fixture").getByRole("button", { name: TRIGGER });
const menu = (page: Page) =>
  page.locator('[data-slot="dropdown-menu-content"]');

/** From the focused trigger: the key alone, then the menu by its slot. */
async function open(page: Page): Promise<void> {
  await page.keyboard.press("Enter");
  await menu(page).waitFor();
}

test(
  "opening speaks the menu's first item",
  declared("dropdown-menu", ["O1"]),
  async ({ page, sr }) => {
    await sr.open(PATH);
    await sr.after(() => trigger(page).focus(), "focus");
    const after = await sr.after(() => open(page));
    await sr.judge(O1(after, FIRST));
  },
);

test(
  "Escape closes it; the trigger is spoken and has focus",
  declared("dropdown-menu", ["O3"]),
  async ({ page, sr }) => {
    await sr.open(PATH);
    await sr.after(() => trigger(page).focus(), "focus");
    await sr.after(() => open(page), "open");
    const after = await sr.after(() => page.keyboard.press("Escape"), "escape");
    await sr.judge(O3(after, TRIGGER, await sr.focused(trigger(page))));
  },
);

test(
  "Escape in the sub-menu speaks its parent item, which has focus",
  declared("dropdown-menu", ["O3s"]),
  async ({ page, sr }) => {
    await sr.open(PATH);
    await sr.after(() => trigger(page).focus(), "focus");
    await sr.after(() => open(page), "open");
    // The parent item, by keyboard: the last item, then one up.
    await sr.after(async () => {
      await page.keyboard.press("End");
      await page.keyboard.press("ArrowUp");
    }, "parent");
    await sr.after(async () => {
      await page.keyboard.press("ArrowRight");
      await page.locator('[data-slot="dropdown-menu-sub-content"]').waitFor();
    }, "sub-menu");
    const after = await sr.after(() => page.keyboard.press("Escape"), "escape");
    // Read focus without waiting on the parent item: if Escape closed the
    // whole menu, it is gone, and the rule, not a timeout, must say so.
    const focused = sr.fact(
      `focus on the parent item "${PARENT}"`,
      await page.evaluate(
        () =>
          document.activeElement?.getAttribute("data-slot") ===
          "dropdown-menu-sub-trigger",
      ),
    );
    await sr.judge(O3s(after, PARENT, focused));
  },
);
