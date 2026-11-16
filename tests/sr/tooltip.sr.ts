/**
 * 022 decision 12: `tooltip`, a portal opened on hover and focus. T1:
 * focusing its trigger speaks the trigger's name and the tooltip's text;
 * T2: after Escape the content is gone and focus stays on the trigger. A
 * tooltip never takes focus, so O3 does not apply.
 *
 * The page is the Open example: its trigger's name ("Deploy") and its text
 * ("Deploys main to production") differ, where the Keyboard example's are
 * both "Copy". Its tooltip is drawn in place, not in a portal.
 */
import type { Page } from "@playwright/test";
import { declared, test } from "./fixtures.ts";
import { T1, T2 } from "./rules.ts";

const PATH = "/example/tooltip/states/";
const NAME = "Deploy";
const TIP = "Deploys main to production";

const trigger = (page: Page) => page.getByRole("button", { name: NAME });
const content = (page: Page) => page.locator('[data-slot="tooltip-content"]');

/** Move focus off the trigger, outside any window, so focusing it is the action. */
async function away(page: Page): Promise<void> {
  await page.evaluate(() => (document.activeElement as HTMLElement)?.blur());
}

test(
  "focusing the trigger speaks its name and the tooltip's text, each whole",
  declared("tooltip", ["T1"]),
  async ({ page, sr }) => {
    await sr.open(PATH);
    await sr.after(() => away(page), "away");
    const after = await sr.after(() => trigger(page).focus());
    await sr.judge(T1(after, NAME, TIP));
  },
);

test(
  "Escape removes the tooltip's content and leaves focus on the trigger",
  declared("tooltip", ["T2"]),
  async ({ page, sr }) => {
    await sr.open(PATH);
    await sr.after(() => trigger(page).focus(), "focus");
    const wasOpen = sr.fact(
      "the tooltip is open on focus",
      (await content(page).count()) > 0,
    );
    await sr.after(() => page.keyboard.press("Escape"), "escape");
    // A bounded wait for the close to finish, which never throws: if the
    // content stays, T2 says so.
    await content(page)
      .first()
      .waitFor({ state: "detached", timeout: 2000 })
      .catch(() => undefined);
    const gone = sr.fact(
      "the tooltip's content is gone after Escape",
      (await content(page).count()) === 0,
    );
    const focused = await sr.focused(trigger(page));
    await sr.judge(T2({ wasOpen, gone, focused }));
  },
);
