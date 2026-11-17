/**
 * 022 decision 12: `marker`. It has no role: a marker inserted into a log is
 * announced as the log's added node. The chat inserts one when a reply is
 * stopped: "Stopped", a separator line at the end of the log. The reader
 * says it whole (L1).
 *
 * The composer's status also says "Stopped" on a stop (`composer`), and no
 * page inserts a marker whose words no status repeats. So this test shows
 * the stop is heard, not which region said it. `hears` is the marker alone.
 * The reply runs about two seconds, so the stop comes at once after the
 * send, with no before window between them.
 */
import type { Page } from "@playwright/test";
import { appears, declared, test } from "./fixtures.ts";
import { L1 } from "./rules.ts";

const PATH = "/view/chat/";
const MARKER = "Stopped";

const textbox = (page: Page) => page.getByRole("textbox", { name: "Message" });

test(
  "a marker inserted into the log on a stop is spoken whole",
  declared("marker", ["L1"]),
  async ({ page, sr }) => {
    await sr.open(PATH);
    await textbox(page).focus();
    await page.keyboard.type("Add two numbers for me.");
    await page.keyboard.press("Enter");
    await appears(
      page.locator('[data-slot="chat-pane"][data-status="submitted"]'),
      "the chat pane, submitted",
    );
    const after = await sr.after(async () => {
      await page.keyboard.press("Escape");
      await appears(
        page.locator('[data-chat="marker"]', { hasText: MARKER }),
        `the "${MARKER}" marker`,
      );
    });
    await sr.judge(L1(after, MARKER));
  },
);
