/**
 * 022 decision 11: `page-states`. The loading state's hidden status says
 * its label once the component has mounted (L1). The reader starts in the
 * empty state's view; the after window's action is the navigation to the
 * loading view. A reader command (such as `navigateToWebContent()`) never
 * runs inside a window: guidepup runs one command at a time, and a window
 * is itself a capture.
 */
import { READY, declared, test } from "./fixtures.ts";
import { L1 } from "./rules.ts";

test(
  "the loading state's status says Loading projects",
  declared("page-states", ["L1"]),
  async ({ page, sr }) => {
    await sr.open("/view/page-states/");
    const after = await sr.after(async () => {
      await page.goto("/view/page-states/loading/");
      await page.locator(READY).first().waitFor();
    });
    await sr.judge(L1(after, "Loading projects"));
  },
);
