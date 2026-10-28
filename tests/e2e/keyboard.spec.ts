import { expect, test, type Page } from "@playwright/test";
import {
  BLOCKS,
  hexToRgb,
  ITEMS,
  open,
  openView,
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

  test("Tab visits the 41 stops in order, each with the solid ring outline", async ({
    page,
  }) => {
    const colour = await ring(page);
    const stops: Stop[] = [];
    for (let i = 0; i < 2 + ITEMS.length; i++) {
      await page.keyboard.press("Tab");
      const stop = await focused(page);
      expect(stop).not.toBeNull();
      stops.push(stop!);
      await expectRingOutline(page, colour);
    }
    expect(stops).toHaveLength(41);
    expect(stops.map((s) => [s.tag, s.href])).toEqual([
      ["a", "/"],
      ["button", null],
      ...ITEMS.map((name) => ["a", `/items/${name}/`]),
    ]);
    expect(stops[0].name).toBe("Pluto Systems design system");
    expect(stops[1].name).toBe("Dark theme");

    // No 42nd stop: the catalogue has no other focusable element.
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
];

/** Where a container draws the ring for its focused child (002 decision 8). */
function drawnBy(
  item: string,
  focused: { slot: string | null },
): string | undefined {
  if (item === "input-group" && focused.slot === "input-group-control")
    return '[data-slot="input-group"]';
  if (item === "input-otp") return '[data-slot="input-otp"]';
  return undefined;
}

const TABBABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

test("the 17 fixtures hold 39 stops", () => {
  expect(FIXTURES).toHaveLength(17);
  expect(FIXTURES.reduce((n, [, stops]) => n + stops.length, 0)).toBe(39);
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
      expect(focused.signature, `stop ${i + 1} is the expected element`).toBe(
        expected[i],
      );
      await expectRingOutline(page, colour, drawnBy(item, focused));
    }
    await page.keyboard.press("Tab");
    const left = await page.evaluate(
      () =>
        !document.activeElement?.closest('[data-testid="keyboard-fixture"]'),
    );
    expect(left, "the next Tab leaves the fixture").toBe(true);
  });
}

/** 002 decision 23's 9 behaviours and 003 decision 20's 2. */
test.describe("behaviours", () => {
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

/** The signature of the focused element: its role and its name. */
async function signature(page: Page): Promise<string | null> {
  return page.evaluate(() => {
    const el = document.activeElement as
      (HTMLElement & { labels?: NodeListOf<HTMLLabelElement> }) | null;
    if (!el || el === document.body) return null;
    const role = el.getAttribute("role") ?? el.tagName.toLowerCase();
    const name = (
      el.getAttribute("aria-label") ??
      el.labels?.[0]?.textContent ??
      el.textContent ??
      ""
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
  const inOtp = await page.evaluate(
    () => !!document.activeElement?.closest('[data-slot="input-otp"]'),
  );
  return inOtp ? '[data-slot="input-otp"]' : undefined;
}

test("the 18 views hold 83 stops", () => {
  expect(VIEWS.map((v) => v.path)).toEqual(Object.keys(VIEW_STOPS));
  expect(
    Object.values(VIEW_STOPS).reduce((n, stops) => n + stops.length, 0),
  ).toBe(83);
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

test("the 5 viewer toolbars hold 42 stops", () => {
  const counts = BLOCKS.map((b) => {
    const n = (BLOCK_VIEWS[b] ?? []).length;
    return (n > 1 ? n : 0) + 5;
  });
  expect(counts).toEqual([5, 9, 9, 10, 9]);
  expect(counts.reduce((a, b) => a + b, 0)).toBe(42);
});
