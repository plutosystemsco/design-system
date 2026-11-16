/**
 * 022 decision 12: `message-log`. Its log announces what is added whole: a
 * turn added to the log is spoken (L1), and not before (L2). "Scroll to
 * end", shown once the reader has scrolled away, returns focus to the log's
 * region, whose name is spoken (F1).
 */
import type { Page } from "@playwright/test";
import { declared, test } from "./fixtures.ts";
import { F1, L1, L2 } from "./rules.ts";

const PATH = "/example/message-log/keyboard/";
const TURN = "And with a hundred thousand?";
const REGION = "Keyboard messages";

const fixture = (page: Page) => page.getByTestId("keyboard-fixture");
const region = (page: Page) =>
  fixture(page).getByRole("region", { name: REGION });

test(
  "a turn added to the log is spoken whole, and not before",
  declared("message-log", ["L1", "L2"]),
  async ({ page, sr }) => {
    await sr.open(PATH);
    await page.getByTestId("kb-add").focus();
    const before = await sr.before();
    const after = await sr.after(() => page.keyboard.press("Enter"));
    await sr.judge(L1(after, TURN), L2(before, after, TURN));
  },
);

test(
  "Scroll to end returns focus to the log's region, and its name is spoken",
  declared("message-log", ["F1"]),
  async ({ page, sr }) => {
    await sr.open(PATH);
    // A wheel up releases the follow in every engine (WebKit does not
    // scroll a focused box by arrow keys under Playwright).
    await region(page).hover();
    await page.mouse.wheel(0, -400);
    const button = fixture(page).getByRole("button", { name: "Scroll to end" });
    await button.waitFor();
    await button.focus();
    const after = await sr.after(() => page.keyboard.press("Enter"));
    await sr.focused(region(page));
    await sr.judge(F1(after, REGION));
  },
);
