import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import {
  PAGES_003,
  PAGES_004,
  PAGES_005,
  PAGES_006,
  PAGES_007,
  PAGES_002,
  VIEW_READY,
  VIEWS,
  WIDTHS,
  open,
  openView,
  settled,
} from "./pages.ts";

const TAGS = [
  "wcag2a",
  "wcag2aa",
  "wcag21a",
  "wcag21aa",
  "wcag22aa",
  "best-practice",
];

async function expectNoViolations(page: Page, exclude?: string): Promise<void> {
  const builder = new AxeBuilder({ page }).withTags(TAGS);
  if (exclude) builder.exclude(exclude);
  const results = await builder.analyze();
  const violations = results.violations.map(
    (v) =>
      `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`,
  );
  expect(violations).toEqual([]);
  expect(results.passes.length).toBeGreaterThan(0);
}

// 003 decision 20: the catalogue and 002's 32 item pages at 1280: 33 per theme.
test.describe("at 1280", () => {
  test.use({ viewport: { width: 1280, height: 900 } });
  for (const path of PAGES_002) {
    test(`axe finds 0 violations on ${path}`, async ({ page }) => {
      await open(page, path);
      await expectNoViolations(page);
    });
  }
});

// 003's 7 item pages, 004's, 005's, 006's and 007's item pages and the
// 28 views at 360, 768 and 1280 (006 decision 14 and 007 decision 10).
for (const width of WIDTHS) {
  test.describe(`at ${width}`, () => {
    test.use({ viewport: { width, height: 900 } });
    for (const path of [
      ...PAGES_003,
      ...PAGES_004,
      ...PAGES_005,
      ...PAGES_006,
      ...PAGES_007,
    ]) {
      test(`axe finds 0 violations on ${path}`, async ({ page }) => {
        await open(page, path);
        // A block's page holds the viewer; let its frame hydrate first.
        if ((await page.locator("iframe").count()) > 0)
          await page
            .frameLocator("iframe")
            .first()
            .locator(VIEW_READY)
            .waitFor();
        // The frame is scanned at its own URL, as a view, at each width; here
        // its <main> would be a second main landmark of the item page.
        await expectNoViolations(page, '[data-testid="viewer"] iframe');
      });
    }
    for (const view of VIEWS) {
      test(`axe finds 0 violations on ${view.path}`, async ({ page }) => {
        await openView(page, view.path);
        await expectNoViolations(page);
      });
    }
  });
}

// 004 decision 11: the popover page with each of its three popovers open
// (aria-dialog-name: every popover has a name).
for (const id of ["popover-fuel", "popover-form", "popover-start"]) {
  test(`axe finds 0 violations with the ${id} popover open`, async ({
    page,
  }) => {
    await open(page, "/items/popover/");
    await page.getByTestId(id).click();
    const dialog = page.locator('[data-slot="popover-content"]');
    await dialog.waitFor();
    await expect(dialog).toHaveAttribute("role", "dialog");
    await settled(page);
    await expectNoViolations(page);
  });
}

// 005 decision 17: the open states of the overlays (aria-dialog-name on
// every sheet and dialog; the menu's roles).
for (const [path, id, slot] of [
  ["/items/dropdown-menu/", "menu-account", "dropdown-menu-content"],
  ["/items/sheet/", "sheet-end", "sheet-content"],
  ["/items/sheet/", "sheet-start", "sheet-content"],
  ["/items/dialog/", "dialog-rename", "dialog-content"],
  ["/items/dialog/", "dialog-terms", "dialog-content"],
] as const) {
  test(`axe finds 0 violations on ${path} with ${id} open`, async ({
    page,
  }) => {
    await open(page, path);
    await page.getByTestId(id).click();
    await page.locator(`[data-slot="${slot}"]`).waitFor();
    await settled(page);
    await expectNoViolations(page);
  });
}

// 007 decision 10: the ink surface on the pluto-theme page at 1280, with its
// popover open (inside the surface) and with its dialog open (under body).
test.describe("at 1280", () => {
  test.use({ viewport: { width: 1280, height: 900 } });
  for (const [id, slot] of [
    ["surface-popover", "popover-content"],
    ["surface-dialog", "dialog-content"],
  ] as const) {
    test(`axe finds 0 violations on /items/pluto-theme/ with ${id} open`, async ({
      page,
    }) => {
      await open(page, "/items/pluto-theme/");
      await page.getByTestId(id).click();
      await page.locator(`[data-slot="${slot}"]`).waitFor();
      await settled(page);
      await expectNoViolations(page);
    });
  }
});

// 005 decision 10: the sidebar page at 360 with its sheet open.
test.describe("at 360", () => {
  test.use({ viewport: { width: 360, height: 700 } });
  test("axe finds 0 violations on /items/sidebar/ with the sheet open", async ({
    page,
  }) => {
    await open(page, "/items/sidebar/");
    await page
      .getByTestId("shell-main")
      .locator('[data-slot="sidebar-trigger"]')
      .click();
    await page.getByRole("dialog", { name: "Sidebar" }).waitFor();
    await settled(page);
    await expectNoViolations(page);
  });
});

// 006 decision 14: the shell's nav sheet open at 360, and its account menu
// open on the signed-in view (the menu renders in place, inside the banner).
test.describe("at 360", () => {
  test.use({ viewport: { width: 360, height: 700 } });
  test("axe finds 0 violations on /view/app-shell/ with the nav sheet open", async ({
    page,
  }) => {
    await openView(page, "/view/app-shell/");
    await page.getByRole("button", { name: "Menu" }).click();
    await page.getByRole("dialog", { name: "Pluto app" }).waitFor();
    await settled(page);
    await expectNoViolations(page);
  });
});

test("axe finds 0 violations on /view/app-shell/signed-in/ with the account menu open", async ({
  page,
}) => {
  await openView(page, "/view/app-shell/signed-in/");
  await page.getByRole("button", { name: "Account menu" }).click();
  await page.getByRole("menu").waitFor();
  await settled(page);
  await expectNoViolations(page);
});

// 002 decision 23: the alert-dialog page again, with its dialog open.
test("axe finds 0 violations with the alert dialog open", async ({ page }) => {
  await open(page, "/items/alert-dialog/");
  await page.getByTestId("dialog-trigger").first().click();
  await page.locator('[data-slot="alert-dialog-content"]').waitFor();
  await settled(page);
  await expectNoViolations(page);
});

// 003 decision 20: the settings view with its delete dialog open.
test("axe finds 0 violations with the settings delete dialog open", async ({
  page,
}) => {
  await openView(page, "/view/settings/");
  await page.getByRole("button", { name: "Delete account" }).click();
  await page.locator('[data-slot="alert-dialog-content"]').waitFor();
  await settled(page);
  await expectNoViolations(page);
});
