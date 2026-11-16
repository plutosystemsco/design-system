/**
 * 020 tests 7 and 8 (decision 4): guards. A 0.12.0 `field` sets only
 * `pluto:field`; a 0.13.0 control under it still wires up. A 0.13.0 setter
 * still serves a reader of an old key. Read from the prerendered HTML of
 * `/view/field-keys/`, with scripts off, so only the server render counts.
 */
import type { Browser, Page } from "@playwright/test";
import { expect, test } from "../test.ts";

const VIEW = "/view/field-keys/";

let raw: Page;
let close: () => Promise<void>;

async function prerendered(browser: Browser, html: string) {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.setContent(html);
  return { page, close: () => context.close() };
}

test.beforeEach(async ({ browser, request }) => {
  const response = await request.get(VIEW);
  expect(response.status()).toBe(200);
  ({ page: raw, close } = await prerendered(browser, await response.text()));
});
test.afterEach(async () => close());

test.describe("020 test 7: an old field still wires a new control", () => {
  for (const name of [
    "input",
    "textarea",
    "checkbox",
    "switch",
    "native-select",
    "input-otp",
  ]) {
    test(`${name} takes the old field's id, description, error and invalid state`, async () => {
      const id = `old-${name}`;
      const box = raw.locator(`[data-case="${name}"]`);
      await expect(box.locator(`[id="${id}"]`)).toHaveCount(1);
      const wired = box.locator(
        `[aria-describedby="${id}-description ${id}-error"]`,
      );
      await expect(wired).toHaveCount(1);
      await expect(wired).toHaveAttribute("aria-invalid", "true");
    });
  }

  test("the password input takes the old field's id", async () => {
    const box = raw.locator('[data-case="input-group-password"]');
    await expect(box.locator("input#old-input-group-password")).toHaveCount(1);
    await expect(
      box.locator('[aria-controls="old-input-group-password"]'),
    ).toHaveCount(1);
  });

  test("the radio group takes the old set's id, description, error, invalid state and legend", async () => {
    const group = raw.locator('[data-case="radio-group"] #old-radio-group');
    await expect(group).toHaveCount(1);
    await expect(group).toHaveAttribute(
      "aria-describedby",
      "old-radio-group-description old-radio-group-error",
    );
    await expect(group).toHaveAttribute("aria-invalid", "true");
    await expect(group).toHaveAttribute(
      "aria-labelledby",
      "old-radio-group-legend",
    );
  });
});

test.describe("020 test 8: a new setter still serves an old reader", () => {
  const found = (testid: string) =>
    raw.getByTestId(testid).getAttribute("data-found");

  test("inside the new Field, pluto:field finds the control's id and pluto:field-label the label's target", async () => {
    expect(await found("reads-field")).toBe("new-field");
    expect(await found("reads-field-label")).toBe("new-field");
  });

  test("inside the new FieldSet, pluto:field-set finds its context", async () => {
    expect(await found("reads-field-set")).toBe("new-set");
  });

  test("inside the new Tooltip root, pluto:tooltip finds its context", async () => {
    expect(await found("reads-tooltip")).toBe("set");
  });

  test("inside the new Item.Group, pluto:item-group finds true", async () => {
    expect(await found("reads-item-group")).toBe("true");
  });

  test("inside the new Accordion.Item, pluto:accordion-item finds the trigger's id", async () => {
    const id = await found("reads-accordion-item");
    expect(id).toBeTruthy();
    await expect(raw.locator(`[id="${id}"]`)).toHaveCount(1);
  });
});
