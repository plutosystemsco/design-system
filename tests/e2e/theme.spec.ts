import { expect, test, type Page } from "@playwright/test";
import {
  GROUND,
  open,
  openView,
  PAGES,
  VIEWS,
  type ThemeName,
} from "./pages.ts";

async function expectTheme(page: Page, theme: ThemeName): Promise<void> {
  const html = page.locator("html");
  if (theme === "dark") await expect(html).toHaveClass(/(^|\s)dark(\s|$)/);
  else await expect(html).not.toHaveClass(/(^|\s)dark(\s|$)/);
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    GROUND[theme],
  );
}

// 003 decision 20: 001's two checks on the 40 site pages and the 17 views.
for (const path of PAGES) {
  test(`${path} takes the theme from the system`, async ({ page }, info) => {
    await open(page, path);
    await expectTheme(page, info.project.name as ThemeName);
  });
}

for (const view of VIEWS) {
  test(`${view.path} takes the theme from the system`, async ({
    page,
  }, info) => {
    await openView(page, view.path);
    await expectTheme(page, info.project.name as ThemeName);
  });
}
