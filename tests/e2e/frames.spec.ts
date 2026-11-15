/**
 * 015 decision 12, criterion 14: an example in either theme, in a frame of
 * its own document.
 */
import { expect, test, type Locator, type Page } from "@playwright/test";
import {
  componentPath,
  GROUND,
  hexToRgb,
  open,
  type ThemeName,
} from "./pages.ts";

const other = (t: ThemeName): ThemeName => (t === "dark" ? "light" : "dark");

async function pageTheme(page: Page): Promise<ThemeName> {
  return (await page.locator("html").getAttribute("class"))
    ?.split(/\s+/)
    .includes("dark")
    ? "dark"
    : "light";
}

function firstFrame(page: Page): Locator {
  return page.locator('[data-slot="frame"]').first();
}

/** Picks a theme on the frame's switch, and returns the frame's iframe once ready. */
async function pick(page: Page, frame: Locator, theme: ThemeName) {
  const option = frame.getByRole("button", {
    name: theme === "dark" ? "Dark" : "Light",
    exact: true,
  });
  await option.click();
  await expect(option).toBeFocused();
  await expect(option).toHaveAttribute("aria-pressed", "true");
}

async function expectFramed(frame: Locator, theme: ThemeName) {
  const iframe = frame.locator("iframe");
  await expect(iframe).toHaveCount(1);
  await expect(iframe).toHaveAttribute("src", new RegExp(`\\?theme=${theme}$`));
  const doc = frame.frameLocator("iframe");
  await expect(doc.locator("body")).toHaveAttribute("data-view-ready", "");
  await expect(iframe).toBeVisible();
  const html = doc.locator("html");
  if (theme === "dark") await expect(html).toHaveClass(/(^|\s)dark(\s|$)/);
  else await expect(html).not.toHaveClass(/(^|\s)dark(\s|$)/);
  await expect(doc.locator("main")).toHaveCSS(
    "background-color",
    GROUND[theme],
  );
}

for (const item of [
  "button",
  "alert",
  "dropdown-menu",
  "four-dot",
  "chart",
  "code-block",
]) {
  test(`${item}: the other theme in a frame, held through the page's toggle and a system flip, and back inline`, async ({
    page,
  }, info) => {
    await open(page, componentPath(item));
    const start = info.project.name as ThemeName;
    const frame = firstFrame(page);
    await expect(frame.locator("iframe")).toHaveCount(0);
    await pick(page, frame, other(start));
    await expectFramed(frame, other(start));

    // The system flips: the page now matches the pick, and the frame keeps it.
    await page.emulateMedia({ colorScheme: other(start) });
    await expect.poll(() => pageTheme(page)).toBe(other(start));
    await expect(
      frame.getByRole("button", {
        name: other(start) === "dark" ? "Dark" : "Light",
        exact: true,
      }),
    ).toHaveAttribute("aria-pressed", "true");
    await page.emulateMedia({ colorScheme: start });
    await expect.poll(() => pageTheme(page)).toBe(start);
    await expectFramed(frame, other(start));

    // The page's own toggle: the frame keeps the pick.
    await page
      .locator('[data-slot="site-bar"] [data-slot="theme-toggle"]')
      .click();
    await expect.poll(() => pageTheme(page)).toBe(other(start));
    await expect(
      frame.getByRole("button", {
        name: other(start) === "dark" ? "Dark" : "Light",
        exact: true,
      }),
    ).toHaveAttribute("aria-pressed", "true");
    await page
      .locator('[data-slot="site-bar"] [data-slot="theme-toggle"]')
      .click();
    await expect.poll(() => pageTheme(page)).toBe(start);
    await expectFramed(frame, other(start));

    // Choosing back shows the example inline again.
    await pick(page, frame, start);
    await expect(frame.locator("iframe")).toHaveCount(0);
  });
}

test("alert: the framed alert takes the other theme's card", async ({
  page,
}, info) => {
  await open(page, componentPath("alert"));
  const start = info.project.name as ThemeName;
  const frame = firstFrame(page);
  await pick(page, frame, other(start));
  await expectFramed(frame, other(start));
  const doc = frame.frameLocator("iframe");
  const [bg, card] = await doc
    .locator('[data-slot="alert"]')
    .first()
    .evaluate((el) => [
      getComputedStyle(el).backgroundColor,
      getComputedStyle(document.documentElement)
        .getPropertyValue("--card")
        .trim(),
    ]);
  expect(bg).toBe(hexToRgb(card));
});

test("dropdown-menu: the open menu in a frame takes the frame's theme and stays inside it", async ({
  page,
}, info) => {
  await open(page, componentPath("dropdown-menu"));
  const start = info.project.name as ThemeName;
  const frame = firstFrame(page);
  await pick(page, frame, other(start));
  await expectFramed(frame, other(start));
  const doc = frame.frameLocator("iframe");
  await doc.getByTestId("menu-account").click();
  const menu = doc.locator('[data-slot="dropdown-menu-content"]');
  await menu.waitFor();
  const [bg, popover, bottom, height] = await menu.evaluate((el) => [
    getComputedStyle(el).backgroundColor,
    getComputedStyle(document.documentElement)
      .getPropertyValue("--popover")
      .trim(),
    el.getBoundingClientRect().bottom,
    window.innerHeight,
  ]);
  expect(bg).toBe(hexToRgb(popover as string));
  expect(bottom as number).toBeLessThanOrEqual(height as number);
});

test("four-dot: the framed marks are the four in light and paper in dark", async ({
  page,
}, info) => {
  await open(page, componentPath("four-dot"));
  const start = info.project.name as ThemeName;
  const frame = firstFrame(page);
  await pick(page, frame, other(start));
  await expectFramed(frame, other(start));
  const doc = frame.frameLocator("iframe");
  const colours = await doc
    .locator('[data-slot="four-dot"]')
    .first()
    .locator('[data-slot="four-dot-dot"]')
    .evaluateAll((ds) => ds.map((d) => getComputedStyle(d).backgroundColor));
  expect(new Set(colours).size).toBe(other(start) === "light" ? 4 : 1);
});

test("theme: the example has no switch, and says why", async ({ page }) => {
  await open(page, componentPath("theme"));
  const frame = firstFrame(page);
  await expect(
    frame.locator('[role="group"] button[aria-pressed]'),
  ).toHaveCount(0);
  await expect(frame).toContainText(
    "This example changes the page's theme, so it shows in the page's theme. Use the theme switch in the bar to see the other.",
  );
});
