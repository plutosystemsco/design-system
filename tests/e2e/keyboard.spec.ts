import { expect, test, type Page } from "@playwright/test";
import {
  BLOCKS,
  hexToRgb,
  ITEMS,
  open,
  openView,
  TABBABLE,
  VIEW_STOPS,
  VIEWS,
} from "./pages.ts";
import { BLOCK_VIEWS } from "../../src/lib/preview/blocks.ts";

type Stop = { tag: string; href: string | null; name: string };

async function focused(page: Page): Promise<Stop | null> {
  return page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return null;
    return {
      tag: el.tagName.toLowerCase(),
      href: el.getAttribute("href"),
      name: el.getAttribute("aria-label") ?? el.textContent?.trim() ?? "",
    };
  });
}

/**
 * The outlined element shows a solid 2 px outline in the ring colour. It is
 * the focused element, or the ancestor matching `drawnBy` where a container
 * draws the ring for its child (002 decision 8). The ring must be there at
 * once: no item transitions `outline-color`. Only 001's theme toggle, a
 * preview control, fades it in, so for it alone the check waits.
 */
async function expectRingOutline(
  page: Page,
  colour: string,
  drawnBy?: string,
): Promise<void> {
  const outline = await page.evaluate(async (selector) => {
    const focused = document.activeElement as HTMLElement;
    const el = (
      selector ? focused.closest(selector) : focused
    ) as HTMLElement | null;
    if (!el) return ["no element drawing the ring"];
    // Only 001's theme toggle fades its outline in; every item's focus is instant.
    if (el.matches("button[aria-pressed]"))
      await Promise.all(el.getAnimations().map((a) => a.finished));
    // CodeMirror marks the editor focused on its next measure frame.
    if (el.matches(".cm-editor") && !el.classList.contains("cm-focused"))
      await new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      );
    const style = getComputedStyle(el);
    return [style.outlineStyle, style.outlineWidth, style.outlineColor];
  }, drawnBy);
  expect(outline).toEqual(["solid", "2px", colour]);
}

async function ring(page: Page): Promise<string> {
  const hex = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue("--ring"),
  );
  return hexToRgb(hex);
}

test.describe("the catalogue", () => {
  test.beforeEach(async ({ page }) => {
    await open(page, "/");
  });

  // 006 decision 16: the site's footer adds one stop after the items, the
  // source link; its lockup is not a link.
  const SOURCE = "https://github.com/plutosystemsco/design-system";
  test(`Tab visits the ${3 + ITEMS.length} stops in order, each with the solid ring outline`, async ({
    page,
  }) => {
    const colour = await ring(page);
    const stops: Stop[] = [];
    for (let i = 0; i < 3 + ITEMS.length; i++) {
      await page.keyboard.press("Tab");
      const stop = await focused(page);
      expect(stop).not.toBeNull();
      stops.push(stop!);
      await expectRingOutline(page, colour);
    }
    expect(stops).toHaveLength(3 + ITEMS.length);
    expect(stops.map((s) => [s.tag, s.href])).toEqual([
      ["a", "/"],
      ["button", null],
      ...ITEMS.map((name) => ["a", `/items/${name}/`]),
      ["a", SOURCE],
    ]);
    expect(stops[0].name).toBe("Pluto Systems design system");
    expect(stops[1].name).toBe("Dark theme");
    expect(stops[stops.length - 1].name).toBe(
      "github.com/plutosystemsco/design-system",
    );

    // No further stop: the catalogue has no other focusable element.
    await page.keyboard.press("Tab");
    expect(await focused(page)).toBeNull();
  });

  test("Enter on the first item link opens /items/pluto-theme/", async ({
    page,
  }) => {
    for (let i = 0; i < 3; i++) await page.keyboard.press("Tab");
    expect((await focused(page))?.href).toBe("/items/pluto-theme/");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/items\/pluto-theme\/$/);
  });

  test("Space flips the theme toggle and Enter flips it back", async ({
    page,
  }) => {
    const toggle = page.getByRole("button", { name: "Dark theme" });
    const html = page.locator("html");
    const before = await toggle.getAttribute("aria-pressed");
    const wasDark = ((await html.getAttribute("class")) ?? "")
      .split(/\s+/)
      .includes("dark");
    expect(before).toBe(String(wasDark));

    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await expect(toggle).toBeFocused();

    await page.keyboard.press("Space");
    await expect(toggle).toHaveAttribute("aria-pressed", String(!wasDark));
    if (wasDark) await expect(html).not.toHaveClass(/(^|\s)dark(\s|$)/);
    else await expect(html).toHaveClass(/(^|\s)dark(\s|$)/);

    await page.keyboard.press("Enter");
    await expect(toggle).toHaveAttribute("aria-pressed", String(wasDark));
    if (wasDark) await expect(html).toHaveClass(/(^|\s)dark(\s|$)/);
    else await expect(html).not.toHaveClass(/(^|\s)dark(\s|$)/);
  });
});

test("on the four-dot page, Tab reaches the lockup link, with the same outline", async ({
  page,
}) => {
  await open(page, "/items/four-dot/");
  const colour = await ring(page);
  let reached = false;
  for (let i = 0; i < 20 && !reached; i++) {
    await page.keyboard.press("Tab");
    reached = await page.evaluate(
      () =>
        document.activeElement?.getAttribute("data-testid") === "lockup-link",
    );
  }
  expect(reached).toBe(true);
  await expectRingOutline(page, colour);
});

/**
 * 002 decision 23: each interactive item's keyboard fixture holds exactly
 * these stops. The test focuses the first with `locator.focus()`, then Tabs
 * through, checking the outline at each, and the next Tab leaves the fixture.
 */
const FIXTURES: [item: string, stops: string[]][] = [
  [
    "button",
    [
      "button:Default",
      "button:Secondary",
      "button:Ghost",
      "button:Delete",
      "button:Link",
      "button:Copy",
      "button:Signing in…",
    ],
  ],
  ["tooltip", ["button:Copy"]],
  ["item", ["a:Read the variants The whole row is one link."]],
  ["collapsible", ["button:Environment variables"]],
  [
    "tabs",
    [
      "tab:Overview",
      "tabpanel:All 212 tests passed.",
      "tab:Overview",
      "tabpanel:All 212 tests passed.",
    ],
  ],
  ["field", ["input:Username", "input:Password"]],
  ["input", ["input:Plain", "input:Invalid"]],
  ["textarea", ["textarea:Plain", "textarea:Invalid"]],
  [
    "input-group",
    [
      "input:Invite by email",
      "button:Invite",
      "input:Password",
      "button:Show password",
    ],
  ],
  ["native-select", ["select:Plain", "select:Invalid"]],
  ["checkbox", ["checkbox:Runs", "checkbox:Deploys", "checkbox:Billing"]],
  ["radio-group", ["radio:Europe"]],
  ["switch", ["switch:Notifications", "switch:Public profile"]],
  ["input-otp", ["input:Code from your authenticator"]],
  ["alert-dialog", ["button:Delete project"]],
  // 003 decisions 8 and 9.
  ["status", ["button:Announce", "button:Clear"]],
  [
    "error-summary",
    ["input:Project name", "input:Owner email", "button:Create project"],
  ],
  // 004 decision 8: the copy button in the header, then the pre, whose ring
  // the root draws. A stop written `tag:*` matches any name: the pre's text
  // is the whole example.
  ["code-block", ["button:Copy code", "pre:*"]],
  // 004 decision 9: Tab in and out of the editor, whose ring the .cm-editor draws.
  [
    "code-editor",
    ["button:Before", "textbox:Keyboard example", "button:After"],
  ],
  // 004 decision 10: the bar chart's "Show as table" summary.
  ["chart", ["summary:Show as table"]],
  // 004 decisions 11 to 13.
  ["popover", ["button:Fuel"]],
  [
    "accordion",
    [
      "button:Your code is sent to the sandbox",
      "button:The sandbox runs it",
      "button:The result comes back",
    ],
  ],
  ["toggle", ["button:Bold", "button:Italic"]],
  // bits-ui parks the row's Tab stop on the first item until a selection moves
  // it, so the fixture's checked item is its first.
  ["toggle-group", ["radio:Today"]],
  // 005 decision 6: the theme toggle, a pressed button.
  ["theme", ["button:Dark theme"]],
  // 005 decisions 7 and 8: each overlay's trigger.
  ["dropdown-menu", ["button:Account"]],
  ["sheet", ["button:Open navigation"]],
  ["dialog", ["button:Rename project"]],
  // 005 decision 9: the first link and the ellipsis menu's trigger; the current page is no stop.
  ["breadcrumb", ["a:Home", "button:Show hidden pages"]],
  // 005 decision 10: the trigger in the bar above the sidebar, then its two rows.
  ["sidebar", ["button:Toggle sidebar", "a:Overview", "a:Runs"]],
  // 005 decision 11: the log's region (its button is hidden at the end).
  ["message-log", ["region:Keyboard messages"]],
  // 005 decision 13: the textarea and the send button.
  ["composer", ["textarea:Message", "button:Send message"]],
];

/** Where a container draws the ring for its focused child (002 decision 8). */
function drawnBy(
  item: string,
  focused: { slot: string | null; signature: string },
): string | undefined {
  // The composer's textarea is an input group's control (005 decision 13).
  if (
    (item === "input-group" || item === "composer") &&
    focused.slot === "input-group-control"
  )
    return '[data-slot="input-group"]';
  if (item === "input-otp") return '[data-slot="input-otp"]';
  if (item === "code-block" && focused.slot === "code-block-content")
    return '[data-slot="code-block"]';
  // 004 decision 9: the whole editor, gutter included, draws the ring.
  if (item === "code-editor" && focused.signature.startsWith("textbox:"))
    return ".cm-editor";
  return undefined;
}

/**
 * 003 check 27's rule, asked of every fixture stop (004 decision 17): no
 * ancestor between the ringed element and <main> computes overflow hidden or
 * clip, unless the element's rectangle grown by 4 px fits inside it.
 */
async function expectRingUnclipped(
  page: Page,
  drawnBy?: string,
): Promise<void> {
  const problem = await page.evaluate((selector) => {
    const focused = document.activeElement as HTMLElement;
    const ringed = (
      selector ? focused.closest(selector) : focused
    ) as HTMLElement | null;
    if (!ringed) return "no element drawing the ring";
    const r = ringed.getBoundingClientRect();
    const grown = {
      left: r.left - 4,
      right: r.right + 4,
      top: r.top - 4,
      bottom: r.bottom + 4,
    };
    const main = document.querySelector("main");
    for (
      let el = ringed.parentElement;
      el && el !== main;
      el = el.parentElement
    ) {
      const s = getComputedStyle(el);
      const clips = [s.overflowX, s.overflowY].some(
        (o) => o === "hidden" || o === "clip",
      );
      if (!clips) continue;
      const a = el.getBoundingClientRect();
      const fits =
        grown.left >= a.left - 0.5 &&
        grown.right <= a.right + 0.5 &&
        grown.top >= a.top - 0.5 &&
        grown.bottom <= a.bottom + 0.5;
      if (!fits)
        return `${el.getAttribute("data-slot") ?? el.tagName} clips it`;
    }
    return null;
  }, drawnBy);
  expect(problem).toBeNull();
}

// 005 decision 17: 32 fixtures and 64 stops when 005 lands; after its first
// run (steps 1 to 4), 004's 24 and 52 plus theme 1, dropdown-menu 1, sheet 1,
// dialog 1, breadcrumb 2 and sidebar 3.
const FIXTURE_COUNT = 32;
const STOP_COUNT = 64;
test(`the ${FIXTURE_COUNT} fixtures hold ${STOP_COUNT} stops`, () => {
  expect(FIXTURES).toHaveLength(FIXTURE_COUNT);
  expect(FIXTURES.reduce((n, [, stops]) => n + stops.length, 0)).toBe(
    STOP_COUNT,
  );
});

for (const [item, expected] of FIXTURES) {
  const count = expected.length;
  test(`${item}: the keyboard fixture holds ${count} stops, each the expected element with the ring`, async ({
    page,
  }) => {
    await open(page, `/items/${item}/`);
    const colour = await ring(page);
    const fixture = page.getByTestId("keyboard-fixture");
    await fixture.locator(TABBABLE).first().focus();
    for (let i = 0; i < count; i++) {
      if (i > 0) await page.keyboard.press("Tab");
      const focused = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement & {
          labels?: NodeListOf<HTMLLabelElement>;
        };
        const role = el.getAttribute("role") ?? el.tagName.toLowerCase();
        const name = (
          el.getAttribute("aria-label") ??
          el.labels?.[0]?.textContent ??
          el.textContent ??
          ""
        )
          .trim()
          .replace(/\s+/g, " ");
        return {
          inside: !!el.closest('[data-testid="keyboard-fixture"]'),
          slot: el.getAttribute("data-slot"),
          signature: `${role}:${name}`,
        };
      });
      expect(focused.inside, `stop ${i + 1} is inside the fixture`).toBe(true);
      const want = expected[i];
      expect(
        want.endsWith(":*")
          ? focused.signature.split(":")[0] + ":*"
          : focused.signature,
        `stop ${i + 1} is the expected element`,
      ).toBe(want);
      await expectRingOutline(page, colour, drawnBy(item, focused));
      await expectRingUnclipped(page, drawnBy(item, focused));
    }
    await page.keyboard.press("Tab");
    const left = await page.evaluate(
      () =>
        !document.activeElement?.closest('[data-testid="keyboard-fixture"]'),
    );
    expect(left, "the next Tab leaves the fixture").toBe(true);
  });
}

/** 002 decision 23's 9 behaviours, 003 decision 20's 2, 004 decision 17's 8 and 005 decision 17's 12: 31. */
test.describe("behaviours", () => {
  // 005 decision 17, behaviour 1.
  test("Space on the theme toggle flips aria-pressed and the dark class; Space again restores both", async ({
    page,
  }) => {
    await open(page, "/items/theme/");
    const toggle = page
      .getByTestId("keyboard-fixture")
      .getByRole("button", { name: "Dark theme" });
    const html = page.locator("html");
    const wasDark = ((await html.getAttribute("class")) ?? "")
      .split(/\s+/)
      .includes("dark");
    await expect(toggle).toHaveAttribute("aria-pressed", String(wasDark));
    await toggle.focus();
    await page.keyboard.press("Space");
    await expect(toggle).toHaveAttribute("aria-pressed", String(!wasDark));
    if (wasDark) await expect(html).not.toHaveClass(/(^|\s)dark(\s|$)/);
    else await expect(html).toHaveClass(/(^|\s)dark(\s|$)/);
    await page.keyboard.press("Space");
    await expect(toggle).toHaveAttribute("aria-pressed", String(wasDark));
    if (wasDark) await expect(html).toHaveClass(/(^|\s)dark(\s|$)/);
    else await expect(html).not.toHaveClass(/(^|\s)dark(\s|$)/);
    await expect(toggle).toBeFocused();
  });

  // 005 decision 17, behaviours 2 and 3.
  test("Enter on the menu trigger opens the menu with focus on its first item; ArrowDown moves to the second", async ({
    page,
  }) => {
    await open(page, "/items/dropdown-menu/");
    const trigger = fixture(page).getByRole("button", { name: "Account" });
    await trigger.focus();
    await page.keyboard.press("Enter");
    const menu = page.getByRole("menu");
    await expect(menu).toBeVisible();
    const items = menu.locator(
      '[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]',
    );
    await expect(items.first()).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(items.nth(1)).toBeFocused();
    await expect(items.nth(1)).toHaveAttribute("data-highlighted", "");
  });

  test("Escape closes the menu and returns focus to the trigger; Tab from the open menu closes it and moves on", async ({
    page,
  }) => {
    await open(page, "/items/dropdown-menu/");
    const trigger = fixture(page).getByRole("button", { name: "Account" });
    const menu = page.getByRole("menu");
    // Tab first, from a fresh open: the menu closes and focus moves on to the
    // stop after the trigger (bits-ui closes only when such a stop exists).
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(menu).toBeVisible();
    await expect(menu.locator('[role="menuitem"]').first()).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(menu).toHaveCount(0);
    expect(
      await page.evaluate(
        () =>
          !document.activeElement?.closest('[data-testid="keyboard-fixture"]'),
      ),
      "Tab left the fixture",
    ).toBe(true);
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    // Then Escape, from a second open.
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(menu).toBeVisible();
    await expect(menu.locator('[role="menuitem"]').first()).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(menu).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  // 005 decision 17, behaviours 4 and 5.
  test("Enter on the sheet trigger opens it with focus on its first link; Tab loops through the close button back to the first link", async ({
    page,
  }) => {
    await open(page, "/items/sheet/");
    const trigger = fixture(page).getByRole("button", {
      name: "Open navigation",
    });
    await trigger.focus();
    await page.keyboard.press("Enter");
    const sheet = page.getByRole("dialog", { name: "Navigation" });
    await expect(sheet).toBeVisible();
    const first = sheet.locator("a[href]").first();
    await expect(first).toBeFocused();
    const stops = await sheet.locator(TABBABLE).count();
    for (let i = 1; i < stops; i++) await page.keyboard.press("Tab");
    await expect(sheet.getByRole("button", { name: "Close" })).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(first).toBeFocused();
  });

  test("Escape closes the sheet, focus returns to the trigger, and the content is gone after the fade", async ({
    page,
  }) => {
    await open(page, "/items/sheet/");
    const trigger = fixture(page).getByRole("button", {
      name: "Open navigation",
    });
    await trigger.focus();
    await page.keyboard.press("Enter");
    const sheet = page.locator('[data-slot="sheet-content"]');
    await expect(sheet).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(sheet).toHaveCount(0);
    await expect(trigger).toBeFocused();
    expect(await page.locator('[data-slot="sheet-overlay"]').count()).toBe(0);
  });

  // 005 decision 17, behaviours 7 and 8.
  test("Enter on the sidebar trigger sets aria-expanded false and makes the nav inert with 0 stops inside; Enter again restores both", async ({
    page,
  }) => {
    await open(page, "/items/sidebar/");
    const trigger = fixture(page).getByRole("button", {
      name: "Toggle sidebar",
    });
    const nav = fixture(page).locator("nav[data-slot=sidebar]");
    await trigger.focus();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(await nav.getAttribute("inert")).toBeNull();
    const stops = () =>
      nav.evaluate(
        (el, selector) =>
          [...el.querySelectorAll<HTMLElement>(selector)].filter(
            (s) => !s.closest("[inert]"),
          ).length,
        TABBABLE,
      );
    expect(await stops()).toBe(2);
    await page.keyboard.press("Enter");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(nav).toHaveAttribute("inert", "");
    expect(await stops()).toBe(0);
    await page.keyboard.press("Tab");
    expect(
      await page.evaluate(
        () => !!document.activeElement?.closest("nav[data-slot=sidebar]"),
      ),
    ).toBe(false);
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(await nav.getAttribute("inert")).toBeNull();
    expect(await stops()).toBe(2);
  });

  test.describe("at 360", () => {
    test.use({ viewport: { width: 360, height: 700 } });

    test("Enter on the sidebar trigger opens the sheet named Sidebar with focus on its first link; Escape returns focus to the trigger", async ({
      page,
    }) => {
      await open(page, "/items/sidebar/");
      const trigger = fixture(page).getByRole("button", {
        name: "Toggle sidebar",
      });
      await trigger.focus();
      await page.keyboard.press("Enter");
      const sheet = page.getByRole("dialog", { name: "Sidebar" });
      await expect(sheet).toBeVisible();
      await expect(sheet.locator("a[href]").first()).toBeFocused();
      await page.keyboard.press("Escape");
      await expect(sheet).toHaveCount(0);
      await expect(trigger).toBeFocused();
    });
  });

  // 005 decision 17, behaviours 9 and 10.
  test("End scrolls the log's region to its end; ArrowUp releases the follow, a streamed reply does not move it, and the button appears inside the region", async ({
    page,
  }) => {
    await open(page, "/items/message-log/");
    const region = fixture(page).getByRole("region", {
      name: "Keyboard messages",
    });
    const state = () =>
      region.evaluate((el) => ({
        top: el.scrollTop,
        atEnd: el.scrollHeight - el.clientHeight - el.scrollTop <= 8,
      }));
    await region.focus();
    await page.keyboard.press("Home");
    await expect.poll(async () => (await state()).top).toBe(0);
    // Chromium animates a keyboard scroll; a second key under it is overridden.
    await page.waitForTimeout(800);
    await page.keyboard.press("End");
    await expect.poll(async () => (await state()).atEnd).toBe(true);
    const button = fixture(page).getByRole("button", { name: "Scroll to end" });
    await expect(button).toBeHidden();
    // End while at the end moves nothing and releases nothing (review
    // finding 1): an appended turn is still followed.
    await page.waitForTimeout(800);
    await page.keyboard.press("End");
    await page.waitForTimeout(200);
    await page.getByTestId("kb-add").click();
    await expect.poll(async () => (await state()).atEnd).toBe(true);
    await expect(button).toBeHidden();
    // The click moved focus to that button; back to the region.
    await region.focus();
    await page.keyboard.press("ArrowUp");
    await expect.poll(async () => (await state()).atEnd).toBe(false);
    // Chromium animates a keyboard scroll with a long tail: let it end.
    await page.waitForTimeout(800);
    const before = (await state()).top;
    await page.getByTestId("kb-stream").click();
    await page.waitForTimeout(500);
    expect((await state()).top).toBe(before);
    await expect(button).toBeVisible();
    const r = (await region.boundingBox())!;
    const b = (await button.boundingBox())!;
    expect(b.y + b.height).toBeLessThanOrEqual(r.y + r.height + 0.5);
    expect(b.x + b.width).toBeLessThanOrEqual(r.x + r.width + 0.5);
  });

  test("Enter on the log's button returns to the end and hides it", async ({
    page,
  }) => {
    await open(page, "/items/message-log/");
    const region = fixture(page).getByRole("region", {
      name: "Keyboard messages",
    });
    await region.focus();
    await page.keyboard.press("ArrowUp");
    await page.keyboard.press("ArrowUp");
    const button = fixture(page).getByRole("button", { name: "Scroll to end" });
    await expect(button).toBeVisible();
    await page.keyboard.press("Tab");
    await expect(button).toBeFocused();
    // Tab moved nothing: the button is outside the scroll box.
    expect(
      await region.evaluate(
        (el) => el.scrollHeight - el.clientHeight - el.scrollTop <= 8,
      ),
    ).toBe(false);
    await page.keyboard.press("Enter");
    await expect
      .poll(() =>
        region.evaluate(
          (el) => el.scrollHeight - el.clientHeight - el.scrollTop <= 8,
        ),
      )
      .toBe(true);
    await expect(button).toBeHidden();
    await expect(region).toBeFocused();
  });

  // 005 decision 17, behaviours 11 and 12.
  test("in the composer, Enter sends and clears; Shift Enter adds a line and does not send; a keydown with isComposing does not send", async ({
    page,
  }) => {
    await open(page, "/items/composer/");
    const textarea = fixture(page).locator("textarea");
    const sent = page.getByTestId("kb-sent");
    await textarea.focus();
    await page.keyboard.type("First");
    await page.keyboard.press("Shift+Enter");
    await expect(textarea).toHaveValue("First\n");
    await expect(sent).toHaveText("");
    await page.keyboard.type("second");
    await textarea.evaluate((el) =>
      el.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "Enter",
          isComposing: true,
          bubbles: true,
          cancelable: true,
        }),
      ),
    );
    await expect(sent).toHaveText("");
    await page.keyboard.press("Enter");
    await expect(sent).toHaveText("First\nsecond");
    await expect(textarea).toHaveValue("");
    await expect(textarea).toBeFocused();
  });

  test("while streaming, Escape stops; the status reads Responding then Stopped", async ({
    page,
  }) => {
    await open(page, "/items/composer/");
    const textarea = fixture(page).locator("textarea");
    const button = fixture(page).locator('[data-slot="composer-send"]');
    const status = fixture(page).getByRole("status");
    await textarea.focus();
    await page.keyboard.type("Go");
    await page.keyboard.press("Enter");
    await expect(status).toHaveText("Responding");
    await expect(button).toHaveAccessibleName("Stop response");
    await page.keyboard.press("Escape");
    await expect(status).toHaveText("Stopped");
    await expect(button).toHaveAccessibleName("Send message");
    await expect(textarea).toBeFocused();
  });

  // 005 decision 17, behaviour 6.
  test("Enter on the dialog trigger opens it with focus on the input; Escape returns focus", async ({
    page,
  }) => {
    await open(page, "/items/dialog/");
    const trigger = fixture(page).getByRole("button", {
      name: "Rename project",
    });
    await trigger.focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog", { name: "Rename project" });
    await expect(dialog).toBeVisible();
    await expect(dialog.locator("input")).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });

  test("the busy button ignores Enter and clicks, keeps focus and aria-busy", async ({
    page,
  }) => {
    await open(page, "/items/button/");
    const busy = page.getByTestId("busy-button");
    const count = page.getByTestId("submit-count");
    await expect(count).toHaveText("0");
    await busy.focus();
    await page.keyboard.press("Enter");
    await busy.click();
    await busy.click();
    await expect(count).toHaveText("0");
    await expect(busy).toBeFocused();
    await expect(busy).toHaveAttribute("aria-busy", "true");
    await expect(busy.locator('[data-slot="spinner"]')).toHaveCount(1);
    // The positive control: once not busy, the same button submits.
    await page.getByTestId("busy-toggle").click();
    await expect(busy).not.toHaveAttribute("aria-busy", "true");
    await busy.click();
    await expect(count).toHaveText("1");
  });

  const fixture = (page: Page) => page.getByTestId("keyboard-fixture");

  test("Space flips the switch", async ({ page }) => {
    await open(page, "/items/switch/");
    const control = fixture(page).getByRole("switch").first();
    await control.focus();
    const before = await control.getAttribute("aria-checked");
    await page.keyboard.press("Space");
    await expect(control).toHaveAttribute(
      "aria-checked",
      before === "true" ? "false" : "true",
    );
  });

  test("Space flips the checkbox", async ({ page }) => {
    await open(page, "/items/checkbox/");
    const control = fixture(page).getByRole("checkbox").first();
    await control.focus();
    const before = await control.getAttribute("aria-checked");
    await page.keyboard.press("Space");
    await expect(control).toHaveAttribute(
      "aria-checked",
      before === "true" ? "false" : "true",
    );
  });

  test("ArrowRight moves focus and selection to the next tab", async ({
    page,
  }) => {
    await open(page, "/items/tabs/");
    const tabs = fixture(page).getByRole("tablist").first().getByRole("tab");
    await tabs.nth(0).focus();
    await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("ArrowRight");
    await expect(tabs.nth(1)).toBeFocused();
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
  });

  test("ArrowDown moves focus and the check to the next radio", async ({
    page,
  }) => {
    await open(page, "/items/radio-group/");
    const radios = fixture(page).getByRole("radio");
    await radios.nth(0).focus();
    await expect(radios.nth(0)).toHaveAttribute("aria-checked", "true");
    await page.keyboard.press("ArrowDown");
    await expect(radios.nth(1)).toBeFocused();
    await expect(radios.nth(1)).toHaveAttribute("aria-checked", "true");
  });

  test("Enter toggles the collapsible", async ({ page }) => {
    await open(page, "/items/collapsible/");
    const trigger = fixture(page).getByRole("button").first();
    await trigger.focus();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await page.keyboard.press("Enter");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    const controls = await trigger.getAttribute("aria-controls");
    await expect(page.locator(`[id="${controls}"]`)).toBeVisible();
  });

  test.describe("at 1280 × 900", () => {
    test.use({ viewport: { width: 1280, height: 900 } });

    test("Tab from the top opens the tooltip on the off-screen trigger, and Escape closes it", async ({
      page,
    }) => {
      await open(page, "/items/tooltip/");
      const trigger = fixture(page).getByRole("button").first();
      // The trigger starts below the fold; Tab scrolls it into view.
      expect(
        await trigger.evaluate((el) => el.getBoundingClientRect().top),
      ).toBeGreaterThan(900);
      for (let i = 0; i < 30; i++) {
        await page.keyboard.press("Tab");
        const inside = await page.evaluate(
          () =>
            !!document.activeElement?.closest(
              '[data-testid="keyboard-fixture"]',
            ),
        );
        if (inside) break;
      }
      await expect(trigger).toBeFocused();
      await page.waitForTimeout(300);
      await expect(trigger).toHaveAttribute("aria-describedby", /\S/);
      const id = await trigger.getAttribute("aria-describedby");
      const tooltip = page.locator(`[id="${id}"]`);
      await expect(tooltip).toBeVisible();
      await expect(tooltip).toHaveAttribute("role", "tooltip");
      await page.keyboard.press("Escape");
      await expect(tooltip).toHaveCount(0);
      await page.waitForTimeout(100);
      await expect(
        page.getByRole("tooltip").filter({ hasText: "Copy" }),
      ).toHaveCount(0);
    });
  });

  test("Enter on the password toggle flips the type and the name", async ({
    page,
  }) => {
    await open(page, "/items/input-group/");
    const toggle = fixture(page).locator(
      '[data-slot="input-group"] button[aria-controls]',
    );
    const input = page.locator(
      `[id="${await toggle.getAttribute("aria-controls")}"]`,
    );
    await expect(input).toHaveAttribute("type", "password");
    await expect(toggle).toHaveAccessibleName("Show password");
    await toggle.focus();
    await page.keyboard.press("Enter");
    await expect(input).toHaveAttribute("type", "text");
    await expect(toggle).toHaveAccessibleName("Hide password");
  });

  test("the alert dialog opens on Cancel, traps Tab, closes on Escape and returns focus", async ({
    page,
  }) => {
    await open(page, "/items/alert-dialog/");
    const trigger = fixture(page).getByTestId("dialog-trigger");
    await trigger.focus();
    await page.keyboard.press("Enter");
    const content = page.locator('[data-slot="alert-dialog-content"]');
    await expect(content).toBeVisible();
    const slot = () =>
      page.evaluate(() => document.activeElement?.getAttribute("data-slot"));
    await expect.poll(slot).toBe("alert-dialog-cancel");
    await page.keyboard.press("Tab");
    expect(await slot()).toBe("alert-dialog-action");
    await page.keyboard.press("Tab");
    expect(await slot()).toBe("alert-dialog-cancel");
    await page.keyboard.press("Escape");
    await expect(content).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });
  test("Space on Announce sets the status text", async ({ page }) => {
    await open(page, "/items/status/");
    const announce = fixture(page).getByRole("button", { name: "Announce" });
    await announce.focus();
    await page.keyboard.press("Space");
    const regions = page.getByTestId("status-specimens").getByRole("status");
    await expect(regions).toHaveCount(2);
    for (const region of await regions.all())
      await expect(region).toHaveText("Copied to the clipboard");
  });

  // 004 decision 8. The clipboard is granted, as the code spec grants it.
  test.describe("with the clipboard granted", () => {
    test.use({ permissions: ["clipboard-read", "clipboard-write"] });

    test("Enter on the copy button sets the status text to Copied and the button's name", async ({
      page,
    }) => {
      await open(page, "/items/code-block/");
      // Located by its slot: its name changes on success.
      const button = fixture(page).locator(
        '[data-slot="code-block-copy-button"]',
      );
      await expect(button).toHaveAccessibleName("Copy code");
      await button.focus();
      await page.keyboard.press("Enter");
      await expect(button).toHaveAccessibleName("Copied");
      await expect(fixture(page).getByRole("status")).toHaveText("Copied");
    });
  });

  // 004 decision 9.
  test("Tab lands in the editor and Tab again leaves it, document unchanged", async ({
    page,
  }) => {
    await open(page, "/items/code-editor/");
    const editor = fixture(page).locator(".cm-editor");
    const content = editor.locator(".cm-content");
    const before = await content.textContent();
    await fixture(page).getByRole("button", { name: "Before" }).focus();
    await page.keyboard.press("Tab");
    await expect(content).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(
      fixture(page).getByRole("button", { name: "After" }),
    ).toBeFocused();
    expect(await content.textContent()).toBe(before);
  });

  test("Control-Enter raises the run count and inserts no line", async ({
    page,
  }) => {
    await open(page, "/items/code-editor/");
    const editor = fixture(page).locator(".cm-editor");
    const content = editor.locator(".cm-content");
    const lines = () => editor.locator(".cm-line").count();
    const text = () => content.textContent();
    const before = { lines: await lines(), text: await text() };
    await content.focus();
    await expect(content).toBeFocused();
    const runs = fixture(page).getByTestId("kb-run-count");
    await expect(runs).toHaveText(/Ran 0 times/);
    await page.keyboard.press("Control+Enter");
    await expect(runs).toHaveText(/Ran 1 time\b/);
    expect(await lines()).toBe(before.lines);
    expect(await text()).toBe(before.text);
  });

  // 004 decision 10.
  test("Enter on Show as table shows a table with 7 rows", async ({ page }) => {
    await open(page, "/items/chart/");
    const summary = fixture(page).locator("summary");
    await expect(summary).toHaveCount(1);
    await expect(summary).toHaveText("Show as table");
    const details = fixture(page).locator("details");
    expect(
      await details.evaluate((el) => (el as HTMLDetailsElement).open),
    ).toBe(false);
    const table = fixture(page).locator("details table");
    await expect(table).toBeHidden();
    await summary.focus();
    await page.keyboard.press("Enter");
    await expect(table).toBeVisible();
    await expect(table.locator("tbody tr")).toHaveCount(7);
  });

  // 004 decision 11.
  test("Enter on the popover trigger opens a dialog named by its title with focus on its first stop; Escape closes it and returns focus", async ({
    page,
  }) => {
    await open(page, "/items/popover/");
    const trigger = fixture(page).getByRole("button", { name: "Fuel" });
    await trigger.focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog", { name: "Fuel" });
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute("data-slot", "popover-content");
    const first = dialog.locator(TABBABLE).first();
    await expect(first).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });

  // 004 decision 12.
  test("ArrowDown in the accordion moves focus to the second trigger; Enter expands it and shows the region its aria-controls names", async ({
    page,
  }) => {
    await open(page, "/items/accordion/");
    const triggers = fixture(page).locator('[data-slot="accordion-trigger"]');
    await triggers.nth(0).focus();
    await page.keyboard.press("ArrowDown");
    await expect(triggers.nth(1)).toBeFocused();
    await expect(triggers.nth(1)).toHaveAttribute("aria-expanded", "false");
    const controls = await triggers.nth(1).getAttribute("aria-controls");
    const region = page.locator(`[id="${controls}"]`);
    await expect(region).toBeHidden();
    await page.keyboard.press("Enter");
    await expect(triggers.nth(1)).toHaveAttribute("aria-expanded", "true");
    await expect(region).toBeVisible();
    await expect(region).toHaveAttribute("role", "region");
  });

  // 004 decision 13.
  test("Space flips the first toggle's aria-pressed", async ({ page }) => {
    await open(page, "/items/toggle/");
    const toggle = fixture(page).getByRole("button").first();
    await toggle.focus();
    const before = await toggle.getAttribute("aria-pressed");
    await page.keyboard.press("Space");
    await expect(toggle).toHaveAttribute(
      "aria-pressed",
      before === "true" ? "false" : "true",
    );
  });

  test("ArrowRight in the toggle group moves focus without changing aria-checked, and Space checks the focused item", async ({
    page,
  }) => {
    await open(page, "/items/toggle-group/");
    const items = fixture(page).getByRole("radio");
    const checked = fixture(page).locator(
      '[role="radio"][aria-checked="true"]',
    );
    await expect(checked).toHaveCount(1);
    await checked.focus();
    const index = await items.evaluateAll((all) =>
      all.findIndex((el) => el.getAttribute("aria-checked") === "true"),
    );
    const next = items.nth((index + 1) % (await items.count()));
    await page.keyboard.press("ArrowRight");
    await expect(next).toBeFocused();
    await expect(next).toHaveAttribute("aria-checked", "false");
    await expect(checked).toHaveCount(1);
    await page.keyboard.press("Space");
    await expect(next).toHaveAttribute("aria-checked", "true");
    await expect(
      fixture(page).locator('[role="radio"][aria-checked="true"]'),
    ).toHaveCount(1);
  });

  test("Enter on Create project inserts the error summary and focuses it; Enter on its first link focuses the field", async ({
    page,
  }) => {
    await open(page, "/items/error-summary/");
    const submit = fixture(page).getByRole("button", {
      name: "Create project",
    });
    await submit.focus();
    await page.keyboard.press("Enter");
    const summary = fixture(page).locator('[data-slot="error-summary"]');
    await expect(summary).toBeFocused();
    await expect(summary).toHaveAttribute("role", "alert");
    await page.keyboard.press("Tab");
    await expect(summary.getByRole("link").first()).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(fixture(page).getByLabel("Project name")).toBeFocused();
  });
});

/**
 * The signature of the focused element: its role and its name. Text under
 * aria-hidden is left out, as the accessible name leaves it out (006: the
 * sidebar's account row carries the avatar's initials, hidden).
 */
async function signature(page: Page): Promise<string | null> {
  return page.evaluate(() => {
    const el = document.activeElement as
      (HTMLElement & { labels?: NodeListOf<HTMLLabelElement> }) | null;
    if (!el || el === document.body) return null;
    const role = el.getAttribute("role") ?? el.tagName.toLowerCase();
    const visibleText = () => {
      const clone = el.cloneNode(true) as HTMLElement;
      clone.querySelectorAll('[aria-hidden="true"]').forEach((n) => n.remove());
      return clone.textContent ?? "";
    };
    const name = (
      el.getAttribute("aria-label") ??
      el.labels?.[0]?.textContent ??
      visibleText()
    )
      .trim()
      .replace(/\s+/g, " ");
    return `${role}:${name}`;
  });
}

/** Where a control's ring is drawn by a container (002 decision 8). */
async function drawnByContainer(page: Page): Promise<string | undefined> {
  const slot = await page.evaluate(() =>
    document.activeElement?.getAttribute("data-slot"),
  );
  if (slot === "input-group-control") return '[data-slot="input-group"]';
  // 004 decision 8: the code block's root draws the ring for its pre (006: the chat's blocks).
  if (slot === "code-block-content") return '[data-slot="code-block"]';
  const inOtp = await page.evaluate(
    () => !!document.activeElement?.closest('[data-slot="input-otp"]'),
  );
  return inOtp ? '[data-slot="input-otp"]' : undefined;
}

// 003's 83 stops over 18 views, and 006 decision 14's 70 over the shell's 4 and the chat's 6.
test("the 28 views hold 153 stops", () => {
  expect(VIEWS.map((v) => v.path)).toEqual(Object.keys(VIEW_STOPS));
  expect(
    Object.values(VIEW_STOPS).reduce((n, stops) => n + stops.length, 0),
  ).toBe(153);
});

/** 006 decision 14: the chat's four keyboard behaviours (5 to 8). */
test.describe("the chat", () => {
  const composerStatus = (page: Page) =>
    page.locator('[data-slot="composer"] [data-slot="status"]');

  test('5. Enter on Latest reply moves focus to the last h3 reading "assistant"', async ({
    page,
  }) => {
    await openView(page, "/view/chat/thread/");
    await page.getByRole("button", { name: "Latest reply" }).focus();
    await page.keyboard.press("Enter");
    const focused = page.locator(":focus");
    await expect(focused).toHaveText("assistant");
    expect(await focused.evaluate((el) => el.tagName.toLowerCase())).toBe("h3");
    expect(
      await focused.evaluate(
        (el) =>
          el ===
          [...document.querySelectorAll('[data-role="assistant"] h3')].at(-1),
      ),
    ).toBe(true);
  });

  test('6. typing and Enter appends a user turn and the status reads "Responding"; 7. Escape stops: a marker "Stopped" and the status "Stopped"', async ({
    page,
  }) => {
    await openView(page, "/view/chat/");
    await page.getByRole("textbox", { name: "Message" }).focus();
    await page.keyboard.type("Add two numbers for me.");
    await page.keyboard.press("Enter");
    const turns = page.locator('[data-chat="turn"]');
    await expect(turns).toHaveCount(1);
    await expect(turns.first()).toHaveAttribute("data-role", "user");
    await expect(turns.first()).toContainText("Add two numbers for me.");
    await expect(composerStatus(page)).toHaveText("Responding");
    await expect(page.locator('[data-chat="responding"]')).toHaveText(
      "Responding",
    );
    await expect(page.getByRole("textbox", { name: "Message" })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(page.locator('[data-chat="marker"]')).toHaveText("Stopped");
    await expect(composerStatus(page)).toHaveText("Stopped");
    await expect(
      page.getByRole("button", { name: "Send message" }),
    ).toHaveCount(1);
    await expect(page.getByRole("textbox", { name: "Message" })).toBeFocused();
  });

  test('8. Enter on Retry sets the status "Responding"', async ({ page }) => {
    await openView(page, "/view/chat/error/");
    await page.getByRole("button", { name: "Retry" }).focus();
    await page.keyboard.press("Enter");
    await expect(composerStatus(page)).toHaveText("Responding");
    await expect(page.locator('[data-chat="error"]')).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: "Stop response" }),
    ).toHaveCount(1);
  });
});

/** 006 decision 14: the shell's four keyboard behaviours. */
test.describe("the shell", () => {
  test("1. Enter on the skip link focuses main#main", async ({ page }) => {
    await openView(page, "/view/app-shell/");
    await page.keyboard.press("Tab");
    expect(await signature(page)).toBe("a:Skip to main content");
    const link = page.locator('[data-slot="app-shell-skip-link"]');
    await expect(link).toBeFocused();
    await expect(link).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(page.locator("main#main")).toBeFocused();
    expect(await page.locator("main#main").getAttribute("tabindex")).toBe("-1");
  });

  test.describe("at 360", () => {
    test.use({ viewport: { width: 360, height: 700 } });
    test('2. Enter on the menu button opens the sheet named "Pluto app" with focus on its first link; Escape returns focus', async ({
      page,
    }) => {
      await openView(page, "/view/app-shell/");
      const menu = page.getByRole("button", { name: "Menu" });
      await expect(menu).toHaveAttribute("aria-haspopup", "dialog");
      await expect(menu).toHaveAttribute("aria-expanded", "false");
      await menu.focus();
      await page.keyboard.press("Enter");
      const sheet = page.getByRole("dialog", { name: "Pluto app" });
      await expect(sheet).toBeVisible();
      await expect(menu).toHaveAttribute("aria-expanded", "true");
      await expect(sheet.getByRole("link").first()).toBeFocused();
      expect(await signature(page)).toBe("a:Overview");
      await page.keyboard.press("Escape");
      await expect(sheet).toHaveCount(0);
      await expect(menu).toBeFocused();
    });
  });

  test("3. Enter on the account menu opens it with focus on its first item; Escape returns focus", async ({
    page,
  }) => {
    await openView(page, "/view/app-shell/signed-in/");
    const trigger = page.getByRole("button", { name: "Account menu" });
    await trigger.focus();
    await page.keyboard.press("Enter");
    const menu = page.getByRole("menu");
    await expect(menu).toBeVisible();
    const items = menu.getByRole("menuitem");
    await expect(items).toHaveCount(2);
    await expect(items.first()).toBeFocused();
    expect(await signature(page)).toBe("menuitem:Settings");
    await page.keyboard.press("Escape");
    await expect(menu).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });

  test('4. Enter on the trigger sets aria-expanded="false" and makes the nav inert; Enter again restores', async ({
    page,
  }) => {
    await openView(page, "/view/app-shell/sidebar/");
    const trigger = page.getByRole("button", { name: "Toggle sidebar" });
    const nav = page.locator('nav[aria-label="Main"]');
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(await nav.getAttribute("inert")).toBeNull();
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(nav).toHaveAttribute("inert", "");
    await expect(trigger).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(await nav.getAttribute("inert")).toBeNull();
  });
});

test.describe("block views at 1280", () => {
  test.use({ viewport: { width: 1280, height: 900 } });
  for (const view of VIEWS) {
    const expected = VIEW_STOPS[view.path] ?? [];
    test(`${view.path}: ${expected.length} stops in order, each with the ring, then out of the document`, async ({
      page,
    }) => {
      await openView(page, view.path);
      const colour = await ring(page);
      for (let i = 0; i < expected.length; i++) {
        await page.keyboard.press("Tab");
        expect(await signature(page), `stop ${i + 1}`).toBe(expected[i]);
        await expectRingOutline(page, colour, await drawnByContainer(page));
      }
      await page.keyboard.press("Tab");
      expect(await signature(page), "the next Tab leaves the document").toBe(
        null,
      );
    });
  }
});

/** 003 decision 20: the viewer toolbar's stops on each block's item page. */
test.describe("viewer toolbars", () => {
  for (const block of BLOCKS) {
    const views = BLOCK_VIEWS[block] ?? [];
    const expected = [
      ...(views.length > 1 ? views.map((v) => `button:${v.label}`) : []),
      "button:360 px",
      "button:768 px",
      "button:1280 px",
      "a:Open alone",
      "region:Preview frame",
    ];
    test(`${block}: ${expected.length} toolbar stops in order, each with the ring`, async ({
      page,
    }) => {
      await open(page, `/items/${block}/`);
      const colour = await ring(page);
      await page
        .getByTestId("viewer-toolbar")
        .locator("button, a")
        .first()
        .focus();
      for (let i = 0; i < expected.length; i++) {
        if (i > 0) await page.keyboard.press("Tab");
        expect(await signature(page), `stop ${i + 1}`).toBe(expected[i]);
        await expectRingOutline(page, colour);
      }
    });
  }
});

// 003's 42, plus app-shell (4 states, 3 widths, Open alone, the frame: 9) and
// chat (6 states and the same 5: 11): 62. (006 decision 14 wrote 58, adding
// 7 and 9; the frame and Open alone are stops on every toolbar.)
test("the 7 viewer toolbars hold 62 stops", () => {
  const counts = BLOCKS.map((b) => {
    const n = (BLOCK_VIEWS[b] ?? []).length;
    return (n > 1 ? n : 0) + 5;
  });
  expect(counts).toEqual([5, 9, 9, 10, 9, 9, 11]);
  expect(counts.reduce((a, b) => a + b, 0)).toBe(62);
});
