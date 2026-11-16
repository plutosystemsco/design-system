/**
 * 022q decision 3, criterion 3: the screen-reader suite's cover. guidepup's
 * NVDA helper (`navigateToWebContent()`) focuses `<body>`, clicks its
 * centre and blurs it. At 360 px on `/view/app-shell/` that click lands on
 * the page's "Go to the home page" link, and the page leaves (the memo
 * §3). `Sr.open()` lays a cover over the page for the helper's duration;
 * this checks it, in every engine, with the helper's own three calls.
 *
 * The cover is test code (`tests/sr/cover.ts`); no site file changes.
 */
import type { Page } from "@playwright/test";
import { expect, test } from "../test.ts";
import { layCover, liftCover } from "../sr/cover.ts";

const PATH = "/view/app-shell/";
const READY = "main[data-view-ready], body[data-view-ready]";

/** As `navigateNVDAtoWebContent` does: focus, click at the centre, blur. */
async function helperClick(page: Page): Promise<void> {
  await page.locator("body").focus();
  await page.locator("body").click();
  await page.locator("body").blur();
}

/** Long enough for a click's navigation to start and land. */
const SETTLE_MS = 1000;

test.describe("022q: the cover under the NVDA helper's click", () => {
  test.use({ viewport: { width: 360, height: 700 } });

  test.beforeEach(async ({ page }) => {
    await page.goto(PATH);
    await page.locator(READY).first().waitFor();
  });

  test("without the cover, the click leaves the page for /", async ({
    page,
  }) => {
    await helperClick(page);
    await page.waitForURL((url) => url.pathname === "/");
  });

  test("with the cover, the click keeps the URL and the cover records its hit", async ({
    page,
  }) => {
    await page.evaluate(layCover);
    await helperClick(page);
    await page.waitForTimeout(SETTLE_MS);
    const hit = await page.evaluate(liftCover);
    expect(new URL(page.url()).pathname).toBe(PATH);
    expect(hit).toBe(true);
    // Lifted: nothing of the cover is left in the page.
    await expect(page.locator("[data-sr-cover]")).toHaveCount(0);
  });
});
