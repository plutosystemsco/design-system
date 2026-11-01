/**
 * 005 decision 17, browser file 6: the menu (N1), the sheet (N2), the dialog
 * (N3), the breadcrumb (N4), the sidebar (N5) and the theme (N6). Runs in
 * both projects, light and dark.
 */
import {
  expect,
  test,
  type APIRequestContext,
  type Browser,
  type Locator,
  type Page,
} from "@playwright/test";
import {
  cssVar,
  hexToRgb,
  open,
  settled,
  TABBABLE,
  type ThemeName,
} from "./pages.ts";

/**
 * True when a computed colour holds a token's colour: the same channels and
 * an alpha within 0.01. The production minifier may shorten the token's hex.
 */
function holdsColour(computed: string, hex: string): boolean {
  let d = hex.replace("#", "");
  if (d.length <= 4) d = [...d].map((c) => c + c).join("");
  const n = parseInt(d.slice(0, 6), 16);
  const want = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  const alpha = d.length === 8 ? parseInt(d.slice(6), 16) / 255 : 1;
  return [...computed.matchAll(/rgba?\(([^)]*)\)/g)].some((m) => {
    const parts = m[1].split(",").map((x) => parseFloat(x));
    const a = parts.length === 4 ? parts[3] : 1;
    return (
      parts[0] === want[0] &&
      parts[1] === want[1] &&
      parts[2] === want[2] &&
      Math.abs(a - alpha) < 0.01
    );
  });
}

async function computed(locator: Locator, property: string): Promise<string> {
  return locator.evaluate(
    (el, p) => getComputedStyle(el).getPropertyValue(p),
    property,
  );
}

/** The elevation shadow's two drawn layers (002 decision 28's reading, as 004's P1). */
async function expectElevation(
  page: Page,
  locator: Locator,
  theme: ThemeName,
): Promise<void> {
  const shadow = await computed(locator, "box-shadow");
  const layers = shadow
    .split(/,(?![^(]*\))/)
    .map((l) => l.trim())
    .filter((l) => !/\) 0px 0px 0px 0px$/.test(l));
  expect(layers, shadow).toHaveLength(2);
  expect(holdsColour(layers[0], await cssVar(page, "--elevation-line"))).toBe(
    true,
  );
  expect(layers[0]).toMatch(/\b0px 0px 0px 1px$/);
  expect(layers[1]).toMatch(/\b0px 12px 32px 0px$/);
  if (theme === "light")
    expect(
      holdsColour(layers[1], await cssVar(page, "--elevation-shadow")),
    ).toBe(true);
  else expect(layers[1]).toMatch(/rgba\(\d+, \d+, \d+, 0\)/);
  expect(await computed(locator, "border-top-width")).toBe("0px");
}

/** The scrim: --scrim's colour with its alpha, and no blur (002's R11). */
async function expectScrim(page: Page, overlay: Locator): Promise<void> {
  expect(
    holdsColour(
      await computed(overlay, "background-color"),
      await cssVar(page, "--scrim"),
    ),
  ).toBe(true);
  expect(await computed(overlay, "backdrop-filter")).toBe("none");
}

/** The ring outline on the element, as 001 draws it. */
async function expectRing(page: Page, locator: Locator): Promise<void> {
  const ring = hexToRgb(await cssVar(page, "--ring"));
  const outline = await locator.evaluate((el) => {
    const s = getComputedStyle(el);
    return [s.outlineStyle, s.outlineWidth, s.outlineColor];
  });
  expect(outline).toEqual(["solid", "2px", ring]);
}

const size = async (locator: Locator) => {
  const b = await locator.boundingBox();
  return [b?.width, b?.height];
};

/** Fetches a page's prerendered HTML and loads it with scripts off. */
async function rawPage(
  browser: Browser,
  request: APIRequestContext,
  path: string,
): Promise<{ raw: Page; html: string; close: () => Promise<void> }> {
  const response = await request.get(path);
  expect(response.status()).toBe(200);
  const html = await response.text();
  const context = await browser.newContext({ javaScriptEnabled: false });
  const raw = await context.newPage();
  await raw.setContent(html);
  return { raw, html, close: () => context.close() };
}

const isDark = (page: Page) =>
  page.evaluate(() => document.documentElement.classList.contains("dark"));
const storedTheme = (page: Page) =>
  page.evaluate(() => localStorage.getItem("pluto-theme"));

/** 005 decision 7: the menu (N1). */
test.describe("N1. the menu", () => {
  const PAGE = "/items/dropdown-menu/";

  test("the trigger promises a menu; open, the items carry their roles, 32 px each, with the highlighted item on accent and the focused item ringed; the separator is the hairline; the shortcut is hidden; 256 px wide; 0 style attributes of ours", async ({
    page,
  }, info) => {
    await open(page, PAGE);
    const trigger = page.getByTestId("menu-account");
    await expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await trigger.focus();
    await page.keyboard.press("Enter");
    const menu = page.locator('[data-slot="dropdown-menu-content"]');
    await expect(menu).toBeVisible();
    await expect(menu).toHaveAttribute("role", "menu");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(await trigger.getAttribute("aria-controls")).toBe(
      await menu.getAttribute("id"),
    );
    await settled(page);

    // Roles: items, a checkbox item, three radio items, separators, a group named by its heading, a sub-trigger.
    expect(await menu.getByRole("menuitem").count()).toBeGreaterThanOrEqual(4);
    await expect(menu.getByRole("menuitemcheckbox")).toHaveCount(1);
    await expect(menu.getByRole("menuitemradio")).toHaveCount(3);
    expect(await menu.getByRole("separator").count()).toBeGreaterThanOrEqual(2);
    const group = menu.getByRole("group", { name: "My account" });
    await expect(group).toHaveCount(1);
    const sub = menu.locator('[data-slot="dropdown-menu-sub-trigger"]');
    await expect(sub).toHaveAttribute("aria-haspopup", "menu");
    await expect(sub.locator("svg")).toHaveAttribute("aria-hidden", "true");
    // No stock label part: nothing names itself dropdown-menu-label.
    await expect(menu.locator('[data-slot="dropdown-menu-label"]')).toHaveCount(
      0,
    );

    // Heights: 32 px on every item kind.
    const rows = menu.locator(
      '[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]',
    );
    for (const row of await rows.all()) {
      const [, h] = await size(row);
      expect(h, "a row is 32 px").toBe(32);
    }

    // Focus on the first item: highlighted on accent, and the ring.
    const first = rows.first();
    await expect(first).toBeFocused();
    await expect(first).toHaveAttribute("data-highlighted", "");
    expect(await computed(first, "background-color")).toBe(
      hexToRgb(await cssVar(page, "--accent")),
    );
    expect(await computed(first, "color")).toBe(
      hexToRgb(await cssVar(page, "--accent-foreground")),
    );
    await expectRing(page, first);
    // An unhighlighted item has no ground.
    expect(await computed(rows.nth(1), "background-color")).toBe(
      "rgba(0, 0, 0, 0)",
    );
    // The destructive item: red text on the same accent, no tint.
    const destructive = menu.locator(
      '[data-slot="dropdown-menu-item"][data-variant="destructive"]',
    );
    await expect(destructive).toHaveCount(1);
    expect(await computed(destructive, "color")).toBe(
      hexToRgb(await cssVar(page, "--destructive")),
    );
    await expect(destructive.locator("svg")).toHaveCount(1);
    await destructive.hover();
    await expect(destructive).toHaveAttribute("data-highlighted", "");
    expect(await computed(destructive, "background-color")).toBe(
      hexToRgb(await cssVar(page, "--accent")),
    );
    expect(await computed(destructive, "color")).toBe(
      hexToRgb(await cssVar(page, "--destructive")),
    );

    // The separator: the hairline in --border, 1 px.
    const separator = menu.getByRole("separator").first();
    expect(await computed(separator, "border-top-width")).toBe("1px");
    expect(
      holdsColour(
        await computed(separator, "border-top-color"),
        await cssVar(page, "--border"),
      ),
    ).toBe(true);
    expect(await computed(separator, "background-color")).toBe(
      "rgba(0, 0, 0, 0)",
    );

    // The shortcut: words, hidden from the name.
    const shortcut = menu
      .locator('[data-slot="dropdown-menu-shortcut"]')
      .first();
    await expect(shortcut).toHaveAttribute("aria-hidden", "true");
    await expect(shortcut).toHaveText(/^[A-Za-z ]+$/);
    await expect(
      menu.getByRole("menuitem", { name: "Profile" }),
    ).toHaveAccessibleName("Profile");

    // Chrome: 256 px wide at least, the elevation, radius 8.
    const [w] = await size(menu);
    expect(w).toBeGreaterThanOrEqual(256);
    expect(await computed(menu, "min-width")).toBe("256px");
    expect(await computed(menu, "border-top-left-radius")).toBe("8px");
    expect(await computed(menu, "overflow-y")).toBe("auto");
    await expectElevation(page, menu, info.project.name as ThemeName);

    // 0 style attributes of ours: bits-ui's inline style sits on the content
    // (its floating variables) and nowhere else.
    expect(
      await menu
        .locator('[data-slot^="dropdown-menu-"][style]')
        .evaluateAll((all) => all.map((el) => el.getAttribute("data-slot"))),
    ).toEqual([]);
    await page.keyboard.press("Escape");
    await expect(menu).toHaveCount(0);
  });

  test("the menu named by label and the inset menu: aria-label on the content, ps-8 on an inset item, the check at the start", async ({
    page,
  }) => {
    await open(page, PAGE);
    await page.getByTestId("menu-more").click();
    const labelled = page.locator('[data-slot="dropdown-menu-content"]');
    await expect(labelled).toBeVisible();
    await expect(labelled).toHaveAccessibleName("More actions");
    expect(await labelled.getAttribute("aria-label")).toBe("More actions");
    await page.keyboard.press("Escape");
    await expect(labelled).toHaveCount(0);

    await page.getByTestId("menu-edit").click();
    const edit = page.locator('[data-slot="dropdown-menu-content"]');
    await expect(edit).toBeVisible();
    const inset = edit.locator('[data-slot="dropdown-menu-item"][data-inset]');
    expect(await inset.count()).toBeGreaterThan(0);
    expect(await computed(inset.first(), "padding-left")).toBe("32px");
    await page.keyboard.press("Escape");

    await page.getByTestId("menu-account").click();
    const checkbox = page.getByRole("menuitemcheckbox");
    await expect(checkbox).toHaveAttribute("aria-checked", "true");
    expect(await computed(checkbox, "padding-left")).toBe("32px");
    const indicator = checkbox.locator(
      '[data-slot="dropdown-menu-checkbox-item-indicator"]',
    );
    await expect(indicator.locator("svg")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    const [c, i] = await Promise.all([
      checkbox.boundingBox(),
      indicator.boundingBox(),
    ]);
    expect(i!.x - c!.x).toBeLessThan(16);
    await page.keyboard.press("Escape");
  });
});

/** 005 decision 8: the sheet (N2) and the dialog (N3). */
async function expectModal(
  page: Page,
  content: Locator,
  title: string,
): Promise<void> {
  await expect(content).toHaveAttribute("role", "dialog");
  await expect(content).toHaveAttribute("aria-modal", "true");
  const titleId = await content.getAttribute("aria-labelledby");
  expect(titleId).toBeTruthy();
  const heading = page.locator(`[id="${titleId}"]`);
  await expect(heading).toHaveText(title);
  await expect(heading).toHaveAttribute("role", "heading");
  await expect(heading).toHaveAttribute("aria-level", "2");
  await expect(content).toHaveAccessibleName(title);
  expect(await computed(heading, "font-weight")).toBe("700");
}

async function expectCloseLast(content: Locator): Promise<void> {
  const close = content
    .locator('[data-slot$="-close"] , button[aria-label="Close"]')
    .last();
  await expect(close).toHaveAccessibleName("Close");
  expect(await size(close)).toEqual([32, 32]);
  const last = content.locator(TABBABLE).last();
  expect(await last.getAttribute("aria-label")).toBe("Close");
}

test.describe("N2. the sheet", () => {
  const PAGE = "/items/sheet/";

  test("open: a modal dialog named by its title, 288 px wide at most the viewport, on the scrim with no blur and the elevation, the close button 32 px and last; the fade holds the node, then it is gone", async ({
    page,
  }, info) => {
    await open(page, PAGE);
    const trigger = page.getByTestId("sheet-end");
    await expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    await trigger.click();
    const content = page.locator('[data-slot="sheet-content"]');
    await expect(content).toBeVisible();
    await settled(page);
    await expectModal(page, content, "Navigation");
    const description = page.locator(
      `[id="${await content.getAttribute("aria-describedby")}"]`,
    );
    await expect(description).toHaveText("Where to go next.");
    const viewport = page.viewportSize()!;
    expect(await size(content)).toEqual([288, viewport.height]);
    expect(await computed(content, "max-width")).toBe("100%");
    expect(await computed(content, "position")).toBe("fixed");
    const box = (await content.boundingBox())!;
    expect(box.x + box.width).toBe(viewport.width);
    expect(await computed(content, "overflow-y")).toBe("auto");
    await expectScrim(page, page.locator('[data-slot="sheet-overlay"]'));
    await expectElevation(page, content, info.project.name as ThemeName);
    expect(await computed(content, "border-left-width")).toBe("0px");
    await expectCloseLast(content);
    await expect(content.locator("nav")).toHaveAttribute("aria-label", /\S/);

    // The fade: Escape leaves the node closed for the micro budget, then it goes.
    await page.keyboard.press("Escape");
    await expect(content).toHaveAttribute("data-state", "closed");
    await expect(content).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });

  test("the four sides and the one named by label", async ({ page }) => {
    await open(page, PAGE);
    const viewport = page.viewportSize()!;
    for (const [id, side, title] of [
      ["sheet-start", "start", "Filters"],
      ["sheet-bottom", "bottom", "Add a note"],
      ["sheet-top", "top", "Announcement"],
    ] as const) {
      await page.getByTestId(id).click();
      const content = page.locator('[data-slot="sheet-content"]');
      await expect(content).toBeVisible();
      await expect(content).toHaveAttribute("data-side", side);
      await expectModal(page, content, title);
      const box = (await content.boundingBox())!;
      if (side === "start") {
        expect([box.x, box.width, box.height]).toEqual([
          0,
          288,
          viewport.height,
        ]);
      } else {
        expect([box.x, box.width]).toEqual([0, viewport.width]);
        if (side === "top") expect(box.y).toBe(0);
        else expect(box.y + box.height).toBe(viewport.height);
      }
      await page.keyboard.press("Escape");
      await expect(content).toHaveCount(0);
    }
    await page.getByTestId("sheet-label").click();
    const content = page.locator('[data-slot="sheet-content"]');
    await expect(content).toBeVisible();
    expect(await content.getAttribute("aria-labelledby")).toBeNull();
    await expect(content).toHaveAccessibleName("Quick note");
    await page.keyboard.press("Escape");
    await expect(content).toHaveCount(0);
  });

  // A top or bottom sheet is capped at the viewport.
  test.describe("at 360", () => {
    test.use({ viewport: { width: 360, height: 700 } });

    test("a bottom sheet with a long body is at most the viewport tall, starts at or below the top, scrolls inside, and keeps its close button in view", async ({
      page,
    }) => {
      await open(page, PAGE);
      await page.getByTestId("sheet-long").click();
      const content = page.locator('[data-slot="sheet-content"]');
      await expect(content).toBeVisible();
      await settled(page);
      expect(await computed(content, "max-height")).toBe("100%");
      const box = (await content.boundingBox())!;
      expect(box.y).toBeGreaterThanOrEqual(0);
      expect(box.height).toBeLessThanOrEqual(700);
      expect(box.y + box.height).toBe(700);
      const [scrollHeight, clientHeight] = await content.evaluate((el) => [
        el.scrollHeight,
        el.clientHeight,
      ]);
      expect(scrollHeight).toBeGreaterThan(clientHeight);
      const close = content.getByRole("button", { name: "Close" });
      const c = (await close.boundingBox())!;
      expect(c.y).toBeGreaterThanOrEqual(0);
      expect(c.y + c.height).toBeLessThanOrEqual(700);
      await page.keyboard.press("Escape");
      await expect(content).toHaveCount(0);
    });
  });
});

test.describe("N3. the dialog", () => {
  const PAGE = "/items/dialog/";

  for (const width of [360, 1280] as const) {
    test.describe(`at ${width}`, () => {
      test.use({ viewport: { width, height: 900 } });

      test("the rename dialog: a modal named by its title, centred, 16 px from the edges at most 448 px wide, on the scrim and the elevation, rounded, the close button last; the long one scrolls inside", async ({
        page,
      }, info) => {
        await open(page, PAGE);
        const trigger = page.getByTestId("dialog-rename");
        await trigger.click();
        const content = page.locator('[data-slot="dialog-content"]');
        await expect(content).toBeVisible();
        await settled(page);
        await expectModal(page, content, "Rename project");
        await expect(content.locator("input")).toBeFocused();
        const box = (await content.boundingBox())!;
        expect(Math.round(box.x)).toBe(Math.round(width - box.x - box.width));
        expect(box.x).toBeGreaterThanOrEqual(16);
        expect(box.width).toBe(width === 360 ? 328 : 448);
        expect(box.y).toBeGreaterThanOrEqual(16);
        expect(box.y + box.height).toBeLessThanOrEqual(884);
        expect(Math.abs(box.y - (900 - box.y - box.height))).toBeLessThan(1.5);
        const positioner = content.locator("xpath=..");
        await expect(positioner).toHaveAttribute(
          "data-slot",
          "dialog-positioner",
        );
        expect(await computed(positioner, "position")).toBe("fixed");
        expect(await computed(positioner, "pointer-events")).toBe("none");
        expect(await computed(content, "max-height")).toBe("100%");
        expect(await computed(content, "pointer-events")).toBe("auto");
        // The close button is positioned by the content.
        expect(await computed(content, "position")).toBe("relative");
        expect(await computed(content, "overflow-y")).toBe("auto");
        expect(await computed(content, "border-top-left-radius")).toBe("8px");
        await expectScrim(page, page.locator('[data-slot="dialog-overlay"]'));
        await expectElevation(page, content, info.project.name as ThemeName);
        await expectCloseLast(content);
        await page.keyboard.press("Escape");
        await expect(content).toHaveCount(0);
        await expect(trigger).toBeFocused();

        await page.getByTestId("dialog-terms").click();
        const long = page.locator('[data-slot="dialog-content"]');
        await expect(long).toBeVisible();
        expect(await long.getAttribute("aria-labelledby")).toBeNull();
        await expect(long).toHaveAccessibleName("Terms of use");
        const scroll = await long.evaluate((el) => [
          el.scrollHeight,
          el.clientHeight,
          el.getBoundingClientRect().height,
        ]);
        expect(scroll[0]).toBeGreaterThan(scroll[1]);
        expect(scroll[2]).toBe(868);
        expect(await computed(long, "scrollbar-width")).toBe("thin");
        await page.keyboard.press("Escape");
        await expect(long).toHaveCount(0);
      });
    });
  }
});

/** 005 decision 9: the breadcrumb (N4). */
test.describe("N4. the breadcrumb", () => {
  const PAGE = "/items/breadcrumb/";

  test("a nav named Breadcrumb holding a list; the current page is a span with aria-current and no role; separators are hidden; the ellipsis opens a menu of the hidden pages from a 32 px button", async ({
    page,
  }) => {
    await open(page, PAGE);
    const basic = page.getByTestId("breadcrumb-basic");
    await expect(basic).toHaveAttribute("aria-label", "Breadcrumb");
    expect(await basic.evaluate((el) => el.tagName.toLowerCase())).toBe("nav");
    const list = basic.locator('[data-slot="breadcrumb-list"]');
    expect(await list.evaluate((el) => el.tagName.toLowerCase())).toBe("ol");
    await expect(basic.getByRole("link")).toHaveCount(2);
    const current = basic.locator('[data-slot="breadcrumb-page"]');
    expect(await current.evaluate((el) => el.tagName.toLowerCase())).toBe(
      "span",
    );
    await expect(current).toHaveAttribute("aria-current", "page");
    expect(await current.getAttribute("role")).toBeNull();
    expect(await current.getAttribute("aria-disabled")).toBeNull();
    expect(await computed(current, "color")).toBe(
      hexToRgb(await cssVar(page, "--foreground")),
    );
    const separators = basic.locator('[data-slot="breadcrumb-separator"]');
    await expect(separators).toHaveCount(2);
    for (const separator of await separators.all()) {
      await expect(separator).toHaveAttribute("aria-hidden", "true");
      await expect(separator).toHaveAttribute("role", "presentation");
    }
    expect(await size(separators.first().locator("svg"))).toEqual([16, 16]);
    expect(await computed(list, "gap")).toBe("8px");
    // No link is a disabled role=link: the current page is a span.
    await expect(basic.locator('[role="link"]')).toHaveCount(0);

    // A slash separator passed by the caller.
    const slash = page.getByTestId("breadcrumb-slash");
    await expect(slash).toHaveAttribute("aria-label", /\S/);
    await expect(
      slash.locator('[data-slot="breadcrumb-separator"]').first(),
    ).toHaveText("/");

    // The ellipsis and its menu.
    const long = page.getByTestId("breadcrumb-ellipsis");
    const trigger = long.getByRole("button", { name: "Show hidden pages" });
    expect(await size(trigger)).toEqual([32, 32]);
    await expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    await expect(
      trigger.locator('[data-slot="breadcrumb-ellipsis"] svg'),
    ).toHaveAttribute("aria-hidden", "true");
    await trigger.click();
    const menu = page.getByRole("menu");
    await expect(menu).toBeVisible();
    expect(await menu.getByRole("menuitem").count()).toBeGreaterThanOrEqual(2);
    await page.keyboard.press("Escape");
    await expect(menu).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });
});

/** 005 decision 10: the sidebar (N5). */
test.describe("N5. the sidebar", () => {
  const PAGE = "/items/sidebar/";

  test("landmarks: every nav and region on the page is labelled once, the insets are regions, and the site's main is the only main", async ({
    page,
  }) => {
    await open(page, PAGE);
    const navs = await page
      .locator("nav")
      .evaluateAll((all) => all.map((n) => n.getAttribute("aria-label")));
    expect(navs).toContain("Main");
    expect(navs).toContain("Icon example");
    expect(new Set(navs).size).toBe(navs.length);
    for (const label of navs) expect(label).toMatch(/\S/);
    const insets = page.locator('[data-slot="sidebar-inset"]');
    expect(await insets.count()).toBeGreaterThanOrEqual(2);
    const regions = await insets.evaluateAll((all) =>
      all.map((el) => [
        el.tagName.toLowerCase(),
        el.getAttribute("role"),
        el.getAttribute("aria-label"),
        el.getAttribute("id"),
      ]),
    );
    for (const [tag, role, label, id] of regions) {
      expect(tag).toBe("div");
      expect(role).toBe("region");
      expect(label).toMatch(/\S/);
      expect(id).not.toBe("main");
    }
    expect(new Set(regions.map((r) => r[2])).size).toBe(regions.length);
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("#main")).toHaveCount(0);
  });

  test("the first shell: a sticky nav 256 px wide on the sidebar ground, the trigger a disclosure that controls it, collapsed to 0 and inert on a press and restored on the next, the cookie written; the icon shell is 48 px", async ({
    page,
  }) => {
    await open(page, PAGE);
    const shell = page.getByTestId("shell-main");
    const nav = shell.locator('nav[aria-label="Main"]');
    const trigger = shell.locator('[data-slot="sidebar-trigger"]');
    await expect(trigger).toHaveAccessibleName("Toggle sidebar");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(await trigger.getAttribute("aria-haspopup")).toBeNull();
    expect(await trigger.getAttribute("aria-controls")).toBe(
      await nav.getAttribute("id"),
    );
    expect(await size(trigger)).toEqual([32, 32]);
    // The trigger precedes the nav in the DOM.
    expect(
      await page.evaluate(
        ([t, n]) =>
          !!(
            document
              .querySelector(t)!
              .compareDocumentPosition(document.querySelector(n)!) &
            Node.DOCUMENT_POSITION_FOLLOWING
          ),
        [
          '[data-testid="shell-main"] [data-slot="sidebar-trigger"]',
          '[data-testid="shell-main"] nav[aria-label="Main"]',
        ],
      ),
    ).toBe(true);

    expect(await computed(nav, "position")).toBe("sticky");
    expect(await computed(nav, "top")).toBe("0px");
    expect(await computed(nav, "background-color")).toBe(
      hexToRgb(await cssVar(page, "--sidebar")),
    );
    expect(await computed(nav, "box-shadow")).toBe("none");
    expect(await computed(nav, "border-right-width")).toBe("0px");
    expect((await size(nav))[0]).toBe(256);
    expect(await nav.getAttribute("inert")).toBeNull();
    // Nothing of the sidebar is fixed: the nav is a sticky flex child.
    expect(
      await shell
        .locator('[data-slot^="sidebar"]')
        .evaluateAll(
          (all) =>
            all.filter((el) => getComputedStyle(el).position === "fixed")
              .length,
        ),
    ).toBe(0);

    // The content box: a scroller with no stop of its own.
    const content = nav.locator('[data-slot="sidebar-content"]');
    expect(await computed(content, "overflow-y")).toBe("auto");
    expect(await computed(content, "scrollbar-width")).toBe("thin");
    expect(await content.getAttribute("tabindex")).toBeNull();

    // The current row: aria-current, the accent inset and the primary start edge.
    const current = nav.locator(
      '[data-sidebar="menu-button"][aria-current="page"]',
    );
    await expect(current).toHaveCount(1);
    expect(await computed(current, "background-color")).toBe(
      hexToRgb(await cssVar(page, "--sidebar-accent")),
    );
    expect(await computed(current, "border-left-width")).toBe("2px");
    expect(await computed(current, "border-left-color")).toBe(
      hexToRgb(await cssVar(page, "--sidebar-primary")),
    );
    const other = nav
      .locator('[data-sidebar="menu-button"]:not([aria-current])')
      .first();
    expect(await computed(other, "background-color")).toBe("rgba(0, 0, 0, 0)");
    // Every row carries the edge, transparent, so the text never shifts.
    expect(await computed(other, "border-left-width")).toBe("2px");
    expect(await computed(other, "border-left-color")).toBe("rgba(0, 0, 0, 0)");
    expect((await size(other))[1]).toBe(48);
    const sub = nav.locator('[data-sidebar="menu-sub-button"]').first();
    expect((await size(sub))[1]).toBe(32);
    const subList = nav.locator('[data-sidebar="menu-sub"]').first();
    expect(await computed(subList, "border-left-width")).toBe("1px");
    expect(
      holdsColour(
        await computed(subList, "border-left-color"),
        await cssVar(page, "--groove-line"),
      ),
    ).toBe(true);

    // A press: collapsed, 0 wide, inert, the cookie written.
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(nav).toHaveAttribute("inert", "");
    await expect(nav).toHaveAttribute("data-state", "collapsed");
    await settled(page);
    await expect
      .poll(async () => (await size(nav))[0], { timeout: 2000 })
      .toBe(0);
    expect(await nav.evaluate((el) => (el as HTMLElement).inert)).toBe(true);
    expect(await page.evaluate(() => document.cookie)).toContain(
      "sidebar_state=false",
    );
    expect(await computed(nav, "position")).toBe("sticky");
    // No groove while the sidebar is off-canvas.
    const inset = shell.locator('[data-slot="sidebar-inset"]');
    expect(await computed(inset, "border-inline-start-width")).toBe("0px");
    expect(await computed(inset, "box-shadow")).toBe("none");
    // Focus cannot enter an inert nav.
    await nav
      .locator("a[href]")
      .first()
      .evaluate((el) => (el as HTMLElement).focus());
    expect(
      await page.evaluate(
        () => !!document.activeElement?.closest('nav[aria-label="Main"]'),
      ),
    ).toBe(false);
    await expect(trigger).toBeFocused();

    // The next press restores it.
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(await nav.getAttribute("inert")).toBeNull();
    await expect
      .poll(async () => (await size(nav))[0], { timeout: 2000 })
      .toBe(256);
    expect(await page.evaluate(() => document.cookie)).toContain(
      "sidebar_state=true",
    );
    expect(await computed(inset, "border-inline-start-width")).toBe("1px");
    // The icon shell keeps its groove: a 48 px column is beside the page.
    expect(
      await computed(
        page.getByTestId("shell-icon").locator('[data-slot="sidebar-inset"]'),
        "border-inline-start-width",
      ),
    ).toBe("1px");

    // The icon shell: 48 px, collapsed, its rows 32 px icons with no sub-items.
    const icon = page.getByTestId("shell-icon");
    const iconNav = icon.locator('nav[aria-label="Icon example"]');
    expect((await size(iconNav))[0]).toBe(48);
    await expect(iconNav).toHaveAttribute("data-collapsible", "icon");
    expect(await iconNav.getAttribute("inert")).toBeNull();
    const iconRow = iconNav.locator('[data-sidebar="menu-button"]').first();
    expect(await size(iconRow)).toEqual([32, 32]);
    await expect(iconNav.locator('[data-sidebar="menu-sub"]')).toBeHidden();
    expect(
      await computed(
        iconNav.locator('[data-slot="sidebar-content"]'),
        "overflow-y",
      ),
    ).toBe("auto");
    await expect(icon.locator('[data-slot="sidebar-trigger"]')).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  test("the shortcut: Ctrl+B toggles from the page, and is ignored while a textarea has focus", async ({
    page,
  }) => {
    await open(page, PAGE);
    const shell = page.getByTestId("shell-main");
    const trigger = shell.locator('[data-slot="sidebar-trigger"]');
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    const notes = shell.locator("textarea");
    await notes.focus();
    await page.keyboard.press("Control+b");
    await page.waitForTimeout(100);
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(await notes.inputValue()).toBe("");
    await page.keyboard.press("Escape");
    await trigger.focus();
    await page.keyboard.press("Control+b");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await page.keyboard.press("Meta+b");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  test.describe("at 360", () => {
    test.use({ viewport: { width: 360, height: 700 } });

    test("the trigger opens a sheet named Sidebar holding the nav, which its aria-controls names; no tooltip inside; the desktop nav is not rendered", async ({
      page,
    }) => {
      await open(page, PAGE);
      const shell = page.getByTestId("shell-main");
      const trigger = shell.locator('[data-slot="sidebar-trigger"]');
      await expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      await expect(shell.locator("nav[data-slot=sidebar]")).toHaveCount(0);
      await trigger.click();
      const sheet = page.getByRole("dialog", { name: "Sidebar" });
      await expect(sheet).toBeVisible();
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      const nav = sheet.locator("nav");
      await expect(nav).toHaveCount(1);
      await expect(nav).toHaveAttribute("aria-label", "Main");
      expect(await trigger.getAttribute("aria-controls")).toBe(
        await nav.getAttribute("id"),
      );
      expect(
        await page.locator(`[id="${await nav.getAttribute("id")}"]`).count(),
      ).toBe(1);
      expect(await size(sheet)).toEqual([288, 700]);
      expect(await computed(sheet, "background-color")).toBe(
        hexToRgb(await cssVar(page, "--sidebar")),
      );
      await expect(sheet.locator('[data-slot="tooltip-trigger"]')).toHaveCount(
        0,
      );
      await expect(page.locator('[data-slot="tooltip-content"]')).toHaveCount(
        0,
      );
      expect(
        await sheet.locator('[data-sidebar="menu-button"]').count(),
      ).toBeGreaterThan(0);
      await expect(sheet.getByRole("button", { name: "Close" })).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(sheet).toHaveCount(0);
      await expect(trigger).toBeFocused();
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
    });
  });
});

/** 005 decision 6: the theme (N6). */
test.describe("N6. the theme", () => {
  const PAGE = "/items/theme/";

  test("the raw HTML holds the head script with the key, and the toggle carries no aria-pressed and no data-ready before hydration", async ({
    browser,
    request,
  }) => {
    const { raw, html, close } = await rawPage(browser, request, PAGE);
    const head = html.slice(0, html.indexOf("</head>"));
    expect(head.match(/localStorage\.getItem\("pluto-theme"\)/g)).toHaveLength(
      1,
    );
    const toggles = raw.getByRole("button", { name: "Dark theme" });
    expect(await toggles.count()).toBeGreaterThanOrEqual(3);
    for (const toggle of await toggles.all()) {
      expect(await toggle.getAttribute("aria-pressed")).toBeNull();
      expect(await toggle.getAttribute("data-ready")).toBeNull();
      await expect(toggle).toHaveAttribute("data-slot", "theme-toggle");
    }
    await close();
  });

  test("after hydration the toggle states aria-pressed; the system's theme is in force and nothing is stored", async ({
    page,
  }, info) => {
    await open(page, PAGE);
    const theme = info.project.name as ThemeName;
    expect(await storedTheme(page)).toBeNull();
    expect(await isDark(page)).toBe(theme === "dark");
    const toggle = page.getByTestId("keyboard-fixture").getByRole("button", {
      name: "Dark theme",
    });
    await expect(toggle).toHaveAttribute(
      "aria-pressed",
      String(theme === "dark"),
    );
    await expect(toggle).toHaveAttribute("data-ready", "");
  });

  test("a press writes the key and flips the class; System in the menu removes the key and follows the system again", async ({
    page,
  }, info) => {
    await open(page, PAGE);
    const dark = info.project.name === "dark";
    const toggle = page.getByTestId("keyboard-fixture").getByRole("button", {
      name: "Dark theme",
    });
    await toggle.click();
    expect(await storedTheme(page)).toBe(dark ? "light" : "dark");
    expect(await isDark(page)).toBe(!dark);
    await expect(toggle).toHaveAttribute("aria-pressed", String(!dark));
    // Every toggle on the page follows the one store.
    for (const other of await page
      .getByRole("button", { name: "Dark theme" })
      .all())
      await expect(other).toHaveAttribute("aria-pressed", String(!dark));

    // The three-way menu: the current preference is the checked radio item.
    await page.getByRole("button", { name: "Theme", exact: true }).click();
    const menu = page.getByRole("menu");
    await expect(menu).toBeVisible();
    await expect(
      menu.getByRole("menuitemradio", { name: dark ? "Light" : "Dark" }),
    ).toHaveAttribute("aria-checked", "true");
    await menu.getByRole("menuitemradio", { name: "System" }).click();
    expect(await storedTheme(page)).toBeNull();
    await page.keyboard.press("Escape");
    await expect(menu).toHaveCount(0);
    expect(await isDark(page)).toBe(dark);
    await expect(toggle).toHaveAttribute("aria-pressed", String(dark));
  });

  test("a storage event from another tab updates the preference, the class and the button", async ({
    page,
  }, info) => {
    await open(page, PAGE);
    const dark = info.project.name === "dark";
    const toggle = page.getByTestId("keyboard-fixture").getByRole("button", {
      name: "Dark theme",
    });
    const other = dark ? "light" : "dark";
    await page.evaluate((value) => {
      localStorage.setItem("pluto-theme", value);
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "pluto-theme",
          newValue: value,
          storageArea: localStorage,
        }),
      );
    }, other);
    await expect(toggle).toHaveAttribute("aria-pressed", String(!dark));
    expect(await isDark(page)).toBe(!dark);
    // The key removed elsewhere: back to the system.
    await page.evaluate(() => {
      localStorage.removeItem("pluto-theme");
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "pluto-theme",
          newValue: null,
          storageArea: localStorage,
        }),
      );
    });
    await expect(toggle).toHaveAttribute("aria-pressed", String(dark));
    expect(await isDark(page)).toBe(dark);
  });

  test("the two sizes are 48 and 32 px squares, and the preview header's toggle is the item", async ({
    page,
  }) => {
    await open(page, PAGE);
    const big = page.getByTestId("theme-toggle-icon");
    const small = page.getByTestId("theme-toggle-icon-sm");
    const b = await big.boundingBox();
    const s = await small.boundingBox();
    expect([b?.width, b?.height]).toEqual([48, 48]);
    expect([s?.width, s?.height]).toEqual([32, 32]);
    const header = page.locator("header").getByRole("button", {
      name: "Dark theme",
    });
    await expect(header).toHaveAttribute("data-slot", "theme-toggle");
    await expect(header).toHaveAttribute("aria-pressed", /true|false/);
  });
});
