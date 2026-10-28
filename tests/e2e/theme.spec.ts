import { expect, test } from "@playwright/test";
import { GROUND, open, PAGES, type ThemeName } from "./pages.ts";

for (const path of PAGES) {
  test(`${path} takes the theme from the system`, async ({ page }, info) => {
    const theme = info.project.name as ThemeName;
    await open(page, path);
    const html = page.locator("html");
    if (theme === "dark") await expect(html).toHaveClass(/(^|\s)dark(\s|$)/);
    else await expect(html).not.toHaveClass(/(^|\s)dark(\s|$)/);
    await expect(page.locator("body")).toHaveCSS(
      "background-color",
      GROUND[theme],
    );
  });
}
