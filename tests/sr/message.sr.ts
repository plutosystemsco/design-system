/**
 * 022 decision 12: `message`. Its header is a `tabindex="-1"` heading, a
 * focus target. The chat's "Latest reply" moves focus to the last reply's
 * header, "assistant", which is spoken (F1).
 */
import { declared, test } from "./fixtures.ts";
import { F1 } from "./rules.ts";

const PATH = "/view/chat/thread/";
const HEADER = "assistant";

test(
  "Latest reply moves focus to the last reply's header, and its text is spoken",
  declared("message", ["F1"]),
  async ({ page, sr }) => {
    await sr.open(PATH);
    await page.getByRole("button", { name: "Latest reply" }).focus();
    const after = await sr.after(() => page.keyboard.press("Enter"));
    await sr.focused(
      page
        .locator('[data-role="assistant"] [data-slot="message-header"]')
        .last(),
    );
    await sr.judge(F1(after, HEADER));
  },
);
