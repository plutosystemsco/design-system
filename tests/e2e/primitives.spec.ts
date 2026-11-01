/**
 * 002 decision 23, browser file 6: heights and targets, the switch, invalid
 * borders, elevation and scrim, motion, the code input and field wiring.
 * Runs in both projects, light and dark.
 */
import { expect, test, type Locator, type Page } from "@playwright/test";
import {
  compositeAlphaByte,
  contrastRatio,
  parseHex,
} from "../../scripts/contrast.ts";
import {
  ITEMS_004,
  ITEMS_005,
  ITEMS_006,
  NEW_ITEMS,
  cssVar,
  open,
  settled,
} from "./pages.ts";

type Box = { x: number; y: number; width: number; height: number };

async function box(locator: Locator): Promise<Box> {
  const b = await locator.boundingBox();
  if (!b) throw new Error("element has no box");
  return b;
}

/** `rgb(…)` or `rgba(…)` as Chromium computes it, to channels and alpha. */
function parseRgb(value: string): {
  r: number;
  g: number;
  b: number;
  a: number;
} {
  const m = /^rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)$/.exec(
    value.trim(),
  );
  if (!m) throw new Error(`not an rgb colour: "${value}"`);
  return { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : +m[4] };
}

/** A token's hex (#rgb to #rrggbbaa, as the minifier writes it) to channels and alpha. */
function hexChannels(hex: string): {
  r: number;
  g: number;
  b: number;
  a: number;
} {
  let d = hex.replace("#", "");
  if (d.length <= 4) d = [...d].map((c) => c + c).join("");
  const c = parseHex(`#${d.toUpperCase()}`);
  return { r: c.r, g: c.g, b: c.b, a: c.a / 255 };
}

function toHex({ r, g, b }: { r: number; g: number; b: number }): string {
  return `#${[r, g, b].map((c) => Math.round(c).toString(16).padStart(2, "0")).join("")}`.toUpperCase();
}

function expectColour(actual: string, tokenHex: string): void {
  const a = parseRgb(actual);
  const e = hexChannels(tokenHex);
  expect([a.r, a.g, a.b]).toEqual([e.r, e.g, e.b]);
  expect(Math.abs(a.a - e.a)).toBeLessThan(0.01);
}

const near = (value: number, target: number, tolerance = 0.5) =>
  Math.abs(value - target) <= tolerance;

test.describe("heights and targets", () => {
  test("6 default controls are 48 px tall; the icon button and the cell are square", async ({
    page,
  }) => {
    await open(page, "/items/button/");
    const row = page.getByTestId("heights");
    const heights: Record<string, number> = {};
    for (const id of [
      "height-button",
      "height-icon",
      "height-input",
      "height-select",
      "height-input-group",
    ]) {
      heights[id] = (await box(row.getByTestId(id))).height;
    }
    const cell = await box(
      row
        .getByTestId("height-otp")
        .locator('[data-slot="input-otp-slot"]')
        .first(),
    );
    heights["height-otp-cell"] = cell.height;
    for (const [id, h] of Object.entries(heights))
      expect(near(h, 48), `${id} is ${h} px tall`).toBe(true);
    const icon = await box(row.getByTestId("height-icon"));
    expect(near(icon.width, 48), `icon button is ${icon.width} px wide`).toBe(
      true,
    );
    expect(near(cell.width, 48), `code cell is ${cell.width} px wide`).toBe(
      true,
    );
  });

  test("2 small buttons are 32 px tall, and icon-sm is square", async ({
    page,
  }) => {
    await open(page, "/items/button/");
    const row = page.getByTestId("heights");
    const sm = await box(row.getByTestId("height-sm"));
    const iconSm = await box(row.getByTestId("height-icon-sm"));
    expect(near(sm.height, 32), `sm is ${sm.height}`).toBe(true);
    expect(near(iconSm.height, 32), `icon-sm is ${iconSm.height}`).toBe(true);
    expect(near(iconSm.width, 32), `icon-sm is ${iconSm.width} wide`).toBe(
      true,
    );
  });

  // 004 decision 13: toggle heights on the ladder.
  test("a default toggle, a small toggle and a toggle-group item are 48, 32 and 48 px tall", async ({
    page,
  }) => {
    await open(page, "/items/toggle/");
    const toggle = await box(page.getByTestId("height-toggle"));
    const sm = await box(page.getByTestId("height-toggle-sm"));
    expect(near(toggle.height, 48), `toggle is ${toggle.height}`).toBe(true);
    expect(toggle.width).toBeGreaterThanOrEqual(48);
    expect(near(sm.height, 32), `sm toggle is ${sm.height}`).toBe(true);
    expect(sm.width).toBeGreaterThanOrEqual(32);
    await open(page, "/items/toggle-group/");
    const item = await box(
      page.getByTestId("toggle-group-single").locator("button").first(),
    );
    expect(near(item.height, 48), `group item is ${item.height}`).toBe(true);
  });

  // 005 decision 17: menu items 32, the close buttons 32, the send button 48.
  test("a menu item, the sheet's close button and the dialog's close button are 32 px; the send button is 48", async ({
    page,
  }) => {
    await open(page, "/items/composer/");
    const send = await box(
      page.getByTestId("composer-main").locator('[data-slot="composer-send"]'),
    );
    expect([near(send.width, 48), near(send.height, 48)]).toEqual([true, true]);
    await open(page, "/items/dropdown-menu/");
    await page.getByTestId("menu-account").click();
    const item = page.getByRole("menuitem").first();
    await expect(item).toBeVisible();
    expect(near((await box(item)).height, 32)).toBe(true);
    await page.keyboard.press("Escape");
    for (const [path, id, slot] of [
      ["/items/sheet/", "sheet-end", "sheet-content"],
      ["/items/dialog/", "dialog-rename", "dialog-content"],
    ] as const) {
      await open(page, path);
      await page.getByTestId(id).click();
      const close = page
        .locator(`[data-slot="${slot}"]`)
        .getByRole("button", { name: "Close" });
      await expect(close).toBeVisible();
      const b = await box(close);
      expect([near(b.width, 32), near(b.height, 32)]).toEqual([true, true]);
      await page.keyboard.press("Escape");
    }
  });

  // 005 decision 17: sidebar rows 48 and 32, the trigger 32.
  test("a sidebar row is 48 px, a sub-row 32 px, and the trigger 32 px", async ({
    page,
  }) => {
    await open(page, "/items/sidebar/");
    const shell = page.getByTestId("shell-main");
    const row = await box(
      shell.locator('[data-sidebar="menu-button"]:not([aria-current])').first(),
    );
    expect(near(row.height, 48), `row is ${row.height}`).toBe(true);
    const sub = await box(
      shell.locator('[data-sidebar="menu-sub-button"]').first(),
    );
    expect(near(sub.height, 32), `sub-row is ${sub.height}`).toBe(true);
    const trigger = await box(shell.locator('[data-slot="sidebar-trigger"]'));
    expect([near(trigger.width, 32), near(trigger.height, 32)]).toEqual([
      true,
      true,
    ]);
  });

  test("0 keyboard stops in the fixtures are under 24 × 24 px", async ({
    page,
  }) => {
    const small: string[] = [];
    for (const item of [
      "button",
      "tooltip",
      "item",
      "collapsible",
      "tabs",
      "field",
      "input",
      "textarea",
      "input-group",
      "native-select",
      "checkbox",
      "radio-group",
      "switch",
      "input-otp",
      "alert-dialog",
      // 004's fixtures.
      "code-block",
      "code-editor",
      "chart",
      "popover",
      "accordion",
      "toggle",
      "toggle-group",
      // 005's fixtures (decision 17).
      "theme",
      "dropdown-menu",
      "sheet",
      "dialog",
      "breadcrumb",
      "sidebar",
      "message-log",
      "composer",
    ]) {
      await open(page, `/items/${item}/`);
      const sizes = await page
        .getByTestId("keyboard-fixture")
        .evaluate((fixture) => {
          const tabbable = fixture.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])',
          );
          return (
            [...tabbable]
              .filter((el) => el.getAttribute("role") !== "tabpanel")
              // A hidden element is no stop: the log's button while at the end.
              .filter((el) => getComputedStyle(el).display !== "none")
              .map((el) => {
                const target =
                  el.closest('[data-slot="input-otp"]') ?? (el as Element);
                const r = target.getBoundingClientRect();
                return {
                  what: `${el.tagName.toLowerCase()}[data-slot=${el.getAttribute("data-slot")}]`,
                  w: r.width,
                  h: r.height,
                };
              })
          );
        });
      expect(sizes.length, `${item} has stops`).toBeGreaterThan(0);
      for (const s of sizes)
        if (s.w < 24 || s.h < 24)
          small.push(`${item}: ${s.what} ${s.w}×${s.h}`);
    }
    expect(small).toEqual([]);
  });
});

test.describe("the switch", () => {
  for (const state of ["off", "on"] as const) {
    test(`${state}: track 64 × 32, thumb 24 × 24, 4 px inside, no overflow`, async ({
      page,
    }) => {
      await open(page, "/items/switch/");
      const track = page.getByTestId(`switch-${state}`);
      const thumb = track.locator('[data-slot="switch-thumb"]');
      await settled(page);
      const t = await box(track);
      const h = await box(thumb);
      expect([near(t.width, 64), near(t.height, 32)]).toEqual([true, true]);
      expect([near(h.width, 24), near(h.height, 24)]).toEqual([true, true]);
      expect(near(h.y - t.y, 4), `top inset ${h.y - t.y}`).toBe(true);
      if (state === "off")
        expect(near(h.x - t.x, 4), `left inset ${h.x - t.x}`).toBe(true);
      else
        expect(
          near(t.x + t.width - (h.x + h.width), 4),
          `right inset ${t.x + t.width - (h.x + h.width)}`,
        ).toBe(true);
      expect(h.x >= t.x && h.x + h.width <= t.x + t.width).toBe(true);
      expect(h.y >= t.y && h.y + h.height <= t.y + t.height).toBe(true);
    });
  }
});

test.describe("invalid borders", () => {
  for (const item of ["input", "textarea", "native-select", "input-otp"]) {
    test(`${item}: the invalid border is --destructive, 3:1 on its ground`, async ({
      page,
    }) => {
      await open(page, `/items/${item}/`);
      const destructive = await cssVar(page, "--destructive");
      // The code input's border is on its cells, driven by the hidden input.
      const control =
        item === "input-otp"
          ? page
              .getByTestId("invalid")
              .locator('[data-slot="input-otp-slot"]')
              .first()
          : page.getByTestId("invalid");
      const { border, ground } = await control.evaluate((el) => {
        let parent = el.parentElement;
        let bg = "rgba(0, 0, 0, 0)";
        while (parent) {
          bg = getComputedStyle(parent).backgroundColor;
          if (!/rgba\(0, 0, 0, 0\)|transparent/.test(bg)) break;
          parent = parent.parentElement;
        }
        return { border: getComputedStyle(el).borderTopColor, ground: bg };
      });
      expectColour(border, destructive);
      const ratio = contrastRatio(
        toHex(parseRgb(border)),
        toHex(parseRgb(ground)),
      );
      expect(ratio).toBeGreaterThanOrEqual(3);
    });
  }
});

test.describe("elevation and scrim", () => {
  test("the open dialog's overlay is the scrim, unblurred, and its edge is elevation-line", async ({
    page,
  }, info) => {
    await open(page, "/items/alert-dialog/");
    await page.getByTestId("dialog-trigger").first().click();
    const overlay = page.locator('[data-slot="alert-dialog-overlay"]');
    const content = page.locator('[data-slot="alert-dialog-content"]');
    await expect(content).toBeVisible();
    await settled(page);
    const scrim = await cssVar(page, "--scrim");
    const line = await cssVar(page, "--elevation-line");
    const o = await overlay.evaluate((el) => ({
      bg: getComputedStyle(el).backgroundColor,
      filter: getComputedStyle(el).backdropFilter,
    }));
    expectColour(o.bg, scrim);
    expect(o.filter).toBe("none");
    const shadow = await content.evaluate(
      (el) => getComputedStyle(el).boxShadow,
    );
    const l = hexChannels(line);
    const colours = [...shadow.matchAll(/rgba?\([^)]*\)/g)].map((m) =>
      parseRgb(m[0]),
    );
    expect(
      colours.some(
        (c) =>
          c.r === l.r &&
          c.g === l.g &&
          c.b === l.b &&
          Math.abs(c.a - l.a) < 0.01,
      ),
      `box-shadow ${shadow} holds ${line}`,
    ).toBe(true);
    if (info.project.name === "dark") {
      const background = await cssVar(page, "--background");
      const s = hexChannels(scrim);
      const scrimHex = `${toHex(s)}${Math.round(s.a * 255)
        .toString(16)
        .padStart(2, "0")
        .toUpperCase()}`;
      const ground = compositeAlphaByte(
        scrimHex,
        toHex(hexChannels(background)),
      );
      expect(contrastRatio(toHex(l), ground)).toBeGreaterThanOrEqual(3);
    }
  });
});

// 005 decision 17: the elevation on the open menu and the scrim on the open sheet.
test.describe("elevation on the menu and the scrim on the sheet", () => {
  test("the open menu's shadow holds elevation-line; the open sheet's overlay is the scrim, unblurred", async ({
    page,
  }) => {
    await open(page, "/items/dropdown-menu/");
    await page.getByTestId("menu-account").click();
    const menu = page.locator('[data-slot="dropdown-menu-content"]');
    await expect(menu).toBeVisible();
    await settled(page);
    const line = await cssVar(page, "--elevation-line");
    const shadow = await menu.evaluate((el) => getComputedStyle(el).boxShadow);
    const l = hexChannels(line);
    const colours = [...shadow.matchAll(/rgba?\([^)]*\)/g)].map((m) =>
      parseRgb(m[0]),
    );
    expect(
      colours.some(
        (c) =>
          c.r === l.r &&
          c.g === l.g &&
          c.b === l.b &&
          Math.abs(c.a - l.a) < 0.01,
      ),
      `box-shadow ${shadow} holds ${line}`,
    ).toBe(true);
    await page.keyboard.press("Escape");

    await open(page, "/items/sheet/");
    await page.getByTestId("sheet-end").click();
    const overlay = page.locator('[data-slot="sheet-overlay"]');
    await expect(page.locator('[data-slot="sheet-content"]')).toBeVisible();
    await settled(page);
    const scrim = await cssVar(page, "--scrim");
    const o = await overlay.evaluate((el) => ({
      bg: getComputedStyle(el).backgroundColor,
      filter: getComputedStyle(el).backdropFilter,
    }));
    expectColour(o.bg, scrim);
    expect(o.filter).toBe("none");
  });
});

test.describe("motion", () => {
  test("0 infinitely looping animations outside a spinner on 002's 26 pages, 004's, 005's and 006's", async ({
    page,
  }) => {
    const loops: string[] = [];
    for (const item of [
      ...NEW_ITEMS,
      ...ITEMS_004,
      ...ITEMS_005,
      ...ITEMS_006,
    ]) {
      await open(page, `/items/${item}/`);
      const found = await page.evaluate(() =>
        [...document.querySelectorAll("*")]
          .filter(
            (el) =>
              getComputedStyle(el).animationIterationCount === "infinite" &&
              !el.closest('[data-slot="spinner"]'),
          )
          .map(
            (el) => `${el.tagName.toLowerCase()}.${el.getAttribute("class")}`,
          ),
      );
      for (const f of found) loops.push(`${item}: ${f}`);
    }
    expect(NEW_ITEMS).toHaveLength(26);
    expect(loops).toEqual([]);
  });
});

test.describe("the code input", () => {
  async function filled(page: Page): Promise<number> {
    return page
      .getByTestId("otp-paste")
      .locator('[data-slot="input-otp-slot"]')
      .evaluateAll(
        (cells) => cells.filter((c) => /\d/.test(c.textContent ?? "")).length,
      );
  }

  test("the real input carries autocomplete, inputmode and a pattern", async ({
    page,
  }) => {
    await open(page, "/items/input-otp/");
    const input = page.getByTestId("otp-paste").locator("input");
    await expect(input).toHaveAttribute("autocomplete", "one-time-code");
    await expect(input).toHaveAttribute("inputmode", "numeric");
    await expect(input).toHaveAttribute("pattern", /.+/);
  });

  for (const text of ["123456", "123-456", "123456\n"]) {
    test(`pasting ${JSON.stringify(text)} fills 6 cells`, async ({ page }) => {
      await open(page, "/items/input-otp/");
      const input = page.getByTestId("otp-paste").locator("input");
      await input.focus();
      await input.evaluate((el, value) => {
        const data = new DataTransfer();
        data.setData("text/plain", value);
        el.dispatchEvent(
          new ClipboardEvent("paste", {
            clipboardData: data,
            bubbles: true,
            cancelable: true,
          }),
        );
      }, text);
      await expect.poll(() => filled(page)).toBe(6);
    });
  }

  test("typing a letter leaves the value and every cell empty", async ({
    page,
  }) => {
    await open(page, "/items/input-otp/");
    const input = page.getByTestId("otp-paste").locator("input");
    await input.focus();
    await page.keyboard.type("a");
    const cells = page
      .getByTestId("otp-paste")
      .locator('[data-slot="input-otp-slot"]');
    // Give a wrongly accepted letter time to land before reading.
    await page.waitForTimeout(200);
    await expect.poll(() => input.inputValue()).toBe("");
    expect(await cells.count()).toBe(6);
    expect(
      await cells.evaluateAll((all) =>
        all.map((c) => (c.textContent ?? "").trim()),
      ),
    ).toEqual(["", "", "", "", "", ""]);
  });
});

/** 002 decisions 11 and 16: the 7 controls that read the field context. */
const WIRED: [control: string, operable: string][] = [
  ["input", 'input[data-slot="input"]'],
  ["textarea", "textarea"],
  ["native-select", "select"],
  ["checkbox", '[role="checkbox"]'],
  ["switch", '[role="switch"]'],
  ["radio-group", '[role="radiogroup"]'],
  ["input-otp", "input"],
];

type Wiring = {
  control: string;
  labelledByLegend: boolean | null;
  id: string | null;
  named: boolean;
  invalid: string | null;
  describedBy: string | null;
  present: boolean[];
};

/** Reads the wiring of the 7 controls from the document the page holds. */
async function readWiring(page: Page): Promise<Wiring[]> {
  return page.evaluate((wired) => {
    return wired.map(([control, operable]) => {
      const box = document.querySelector(`[data-testid="wiring-${control}"]`);
      const el = box?.querySelector(operable) ?? null;
      const id = el?.getAttribute("id") ?? null;
      const named =
        control === "radio-group"
          ? !!el?.closest("fieldset")?.querySelector(":scope > legend")
          : !!(id && document.querySelector(`label[for="${CSS.escape(id)}"]`));
      const describedBy = el?.getAttribute("aria-describedby") ?? null;
      const labelledBy = el?.getAttribute("aria-labelledby");
      const named_ =
        control === "radio-group"
          ? !!(
              labelledBy &&
              el?.closest("fieldset")?.querySelector(":scope > legend")?.id ===
                labelledBy
            )
          : null;
      return {
        control,
        labelledByLegend: named_,
        id,
        named,
        invalid: el?.getAttribute("aria-invalid") ?? null,
        describedBy,
        present: (describedBy ?? "")
          .split(/\s+/)
          .filter(Boolean)
          .map((ref) => !!document.getElementById(ref)),
      };
    });
  }, WIRED);
}

function expectWired(wiring: Wiring[]): void {
  expect(wiring).toHaveLength(7);
  for (const w of wiring) {
    expect(w.id, `${w.control} has an id`).toBeTruthy();
    expect(w.named, `${w.control} is named by its label or legend`).toBe(true);
    expect(w.invalid, `${w.control} aria-invalid`).toBe("true");
    expect(w.describedBy, `${w.control} aria-describedby`).toBe(
      `${w.id}-description ${w.id}-error`,
    );
    expect(w.present, `${w.control}'s 2 ids exist`).toEqual([true, true]);
    if (w.control === "radio-group")
      expect(w.labelledByLegend, "the radio group is named by its legend").toBe(
        true,
      );
  }
}

type SetWiring = {
  box: string;
  setDescribedBy: string | null;
  setIdsPresentInside: boolean[];
  boxIds: (string | null)[];
  invalid: (string | null)[];
  describedBy: (string | null)[];
};

/** 002 decisions.md, finding 1: a set wires itself; its checkboxes never take its ids. */
async function readSetWiring(page: Page): Promise<SetWiring[]> {
  return page.evaluate(() =>
    ["wiring-checkbox-set-bare", "wiring-checkbox-set-fields"].map((box) => {
      const root = document.querySelector(`[data-testid="${box}"]`);
      const set = root?.querySelector("fieldset") ?? null;
      const setDescribedBy = set?.getAttribute("aria-describedby") ?? null;
      const boxes = [...(root?.querySelectorAll('[role="checkbox"]') ?? [])];
      return {
        box,
        setDescribedBy,
        setIdsPresentInside: (setDescribedBy ?? "")
          .split(/\s+/)
          .filter(Boolean)
          .map((ref) => !!set?.querySelector(`[id="${ref}"]`)),
        boxIds: boxes.map((b) => b.getAttribute("id")),
        invalid: boxes.map((b) => b.getAttribute("aria-invalid")),
        describedBy: boxes.map((b) => b.getAttribute("aria-describedby")),
      };
    }),
  );
}

function expectSetWired(wiring: SetWiring[]): void {
  expect(wiring).toHaveLength(2);
  for (const w of wiring) {
    expect(w.setDescribedBy, `${w.box}: the fieldset is described`).toMatch(
      /^\S+-description \S+-error$/,
    );
    expect(w.setIdsPresentInside, `${w.box}: its 2 ids are in the set`).toEqual(
      [true, true],
    );
    expect(w.boxIds.length, `${w.box}: 2 checkboxes`).toBe(2);
    expect(w.boxIds.every(Boolean), `${w.box}: each checkbox has an id`).toBe(
      true,
    );
    expect(new Set(w.boxIds).size, `${w.box}: the ids are distinct`).toBe(2);
    expect(w.invalid, `${w.box}: no checkbox takes the set's invalid`).toEqual([
      null,
      null,
    ]);
    const setIds = (w.setDescribedBy ?? "").split(/\s+/);
    for (const d of w.describedBy)
      expect(
        (d ?? "").split(/\s+/).some((ref) => setIds.includes(ref)),
        `${w.box}: no checkbox is described by the set`,
      ).toBe(false);
  }
}

test.describe("field wiring", () => {
  test("7 of 7 controls are wired in the raw prerendered HTML", async ({
    browser,
    request,
  }) => {
    const response = await request.get("/items/field/");
    expect(response.status()).toBe(200);
    const html = await response.text();
    const context = await browser.newContext({ javaScriptEnabled: false });
    const raw = await context.newPage();
    await raw.setContent(html);
    expectWired(await readWiring(raw));
    expectSetWired(await readSetWiring(raw));
    await context.close();
  });

  test("7 of 7 controls are wired after hydration", async ({ page }) => {
    await open(page, "/items/field/");
    expectWired(await readWiring(page));
    expectSetWired(await readSetWiring(page));
  });

  test("the keyboard fixture's inputs are described by their description, and the invalid one by its error", async ({
    page,
  }) => {
    await open(page, "/items/field/");
    const fixture = page.getByTestId("keyboard-fixture");
    await expect(fixture.locator("#kb-valid")).toHaveAccessibleDescription(
      "Lowercase letters and numbers.",
    );
    await expect(fixture.locator("#kb-invalid")).toHaveAccessibleDescription(
      "At least twelve characters. Too short.",
    );
  });
});

/** 002 decision 19: each alert variant's role, and role={null} giving none. */
test.describe("alert roles", () => {
  test("inserted alerts take none, alert, status and status, and role={null} none", async ({
    page,
  }) => {
    await open(page, "/items/alert/");
    await page.getByTestId("insert-alerts").click();
    const roles = await page
      .getByTestId("inserted-alerts")
      .locator('[data-slot="alert"]')
      .evaluateAll((all) =>
        all.map((a) => [
          a.getAttribute("data-variant"),
          a.getAttribute("role"),
        ]),
      );
    expect(roles).toEqual([
      ["default", null],
      ["destructive", "alert"],
      ["success", "status"],
      ["caution", "status"],
      ["destructive", null],
    ]);
  });
});

/** Fetches a page's prerendered HTML and loads it with scripts off. */
async function rawPage(
  browser: import("@playwright/test").Browser,
  request: import("@playwright/test").APIRequestContext,
  path: string,
): Promise<{ raw: Page; close: () => Promise<void> }> {
  const response = await request.get(path);
  expect(response.status()).toBe(200);
  const html = await response.text();
  const context = await browser.newContext({ javaScriptEnabled: false });
  const raw = await context.newPage();
  await raw.setContent(html);
  return { raw, close: () => context.close() };
}

/** 003 decision 8: the status item. */
test.describe("status", () => {
  test("S1. the raw prerendered HTML holds 2 empty regions with role, aria-live and aria-atomic", async ({
    browser,
    request,
  }) => {
    const { raw, close } = await rawPage(browser, request, "/items/status/");
    const regions = await raw
      .locator('[data-testid="status-specimens"] [data-slot="status"]')
      .evaluateAll((all) =>
        all.map((r) => [
          r.getAttribute("role"),
          r.getAttribute("aria-live"),
          r.getAttribute("aria-atomic"),
          (r.textContent ?? "").trim(),
        ]),
      );
    expect(regions).toEqual([
      ["status", "polite", "true", ""],
      ["status", "polite", "true", ""],
    ]);
    await close();
  });

  test("S2. Announce sets the text in both regions, and Clear empties both", async ({
    page,
  }) => {
    await open(page, "/items/status/");
    const regions = page
      .getByTestId("status-specimens")
      .locator('[data-slot="status"]');
    await page.getByRole("button", { name: "Announce" }).click();
    for (const r of await regions.all())
      await expect(r).toHaveText("Copied to the clipboard");
    await page.getByRole("button", { name: "Clear" }).click();
    for (const r of await regions.all()) await expect(r).toHaveText("");
  });

  test("S3. the hidden region is a 1 × 1 px clip, and the visible one is wider", async ({
    page,
  }) => {
    await open(page, "/items/status/");
    await page.getByRole("button", { name: "Announce" }).click();
    const hidden = page.getByTestId("status-hidden");
    const visible = page.getByTestId("status-visible");
    const h = await box(hidden);
    expect(near(h.width, 1) && near(h.height, 1)).toBe(true);
    await expect(hidden).toHaveCSS("overflow", "hidden");
    expect((await box(visible)).width).toBeGreaterThan(1);
  });
});

/** 003 decision 9: the error-summary item. */
test.describe("error summary", () => {
  test("E1. the raw prerendered HTML holds 3 specimens with no role", async ({
    browser,
    request,
  }) => {
    const { raw, close } = await rawPage(
      browser,
      request,
      "/items/error-summary/",
    );
    const roles = await raw
      .locator('[data-testid="summary-specimens"] [data-slot="error-summary"]')
      .evaluateAll((all) => all.map((s) => s.getAttribute("role")));
    expect(roles).toEqual([null, null, null]);
    await close();
  });

  test("E2. the inserted summary has role alert, tabindex -1, its heading, and 2 links at least 24 px tall", async ({
    page,
  }) => {
    await open(page, "/items/error-summary/");
    const fixture = page.getByTestId("keyboard-fixture");
    await fixture.getByRole("button", { name: "Create project" }).click();
    const summary = fixture.locator('[data-slot="error-summary"]');
    await expect(summary).toBeFocused();
    await expect(summary).toHaveAttribute("role", "alert");
    await expect(summary).toHaveAttribute("tabindex", "-1");
    await expect(
      summary.getByRole("heading", { name: "There is a problem" }),
    ).toHaveCount(1);
    const links = summary.getByRole("link");
    await expect(links).toHaveText([
      "Enter a project name",
      "Enter the owner's email address",
    ]);
    for (const link of await links.all())
      expect((await box(link)).height).toBeGreaterThanOrEqual(24);
  });
});
