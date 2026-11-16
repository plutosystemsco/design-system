/**
 * 022 decision 11: `chat`, by the kinds its parts bring. Enter in the
 * composer sends; the composer's status says "Responding", then "Response
 * complete" (L1). Once the reply ends, "Latest reply" moves focus to the
 * last reply's heading, which is spoken (F1).
 */
import type { Page } from "@playwright/test";
import { declared, test } from "./fixtures.ts";
import { F1, L1 } from "./rules.ts";

const PATH = "/view/chat/";

const message = (page: Page) => page.getByRole("textbox", { name: "Message" });
const latest = (page: Page) =>
  page.getByRole("button", { name: "Latest reply" });

/** The draft typed with no keystrokes; the box focused in its own window. */
async function draft(page: Page, sr: import("./fixtures.ts").Sr) {
  await message(page).fill("Add two numbers.");
  await sr.after(() => message(page).focus(), "focus");
}

test(
  "a send: the composer's status says Response complete",
  declared("chat", ["L1"], ["composer"]),
  async ({ page, sr }) => {
    await sr.open(PATH);
    await draft(page, sr);
    const after = await sr.after(() => page.keyboard.press("Enter"));
    await sr.judge(L1(after, "Response complete"));
  },
);

test(
  "Latest reply moves focus to the reply's heading, which is spoken",
  declared("chat", ["F1"]),
  async ({ page, sr }) => {
    await sr.open(PATH);
    await draft(page, sr);
    await sr.after(async () => {
      await page.keyboard.press("Enter");
      await latest(page).waitFor({ timeout: 10_000 });
    }, "reply");
    await sr.after(() => latest(page).focus(), "focus latest");
    const after = await sr.after(() => page.keyboard.press("Enter"));
    await sr.focused(
      page
        .locator('[data-role="assistant"] [data-slot="message-header"]')
        .last(),
    );
    await sr.judge(F1(after, "assistant"));
  },
);
