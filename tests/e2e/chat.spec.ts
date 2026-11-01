/**
 * 005 decision 17, browser file 7: the message log (L1), the message (L2),
 * the marker (L3) and the composer (L4). Runs in both projects, light and
 * dark.
 */
import {
  expect,
  test,
  type APIRequestContext,
  type Browser,
  type Locator,
  type Page,
} from "@playwright/test";
import { cssVar, hexToRgb, open } from "./pages.ts";

async function computed(locator: Locator, property: string): Promise<string> {
  return locator.evaluate(
    (el, p) => getComputedStyle(el).getPropertyValue(p),
    property,
  );
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
): Promise<{ raw: Page; close: () => Promise<void> }> {
  const response = await request.get(path);
  expect(response.status()).toBe(200);
  const html = await response.text();
  const context = await browser.newContext({ javaScriptEnabled: false });
  const raw = await context.newPage();
  await raw.setContent(html);
  return { raw, close: () => context.close() };
}

const scrollState = (region: Locator) =>
  region.evaluate((el) => ({
    top: el.scrollTop,
    height: el.scrollHeight,
    client: el.clientHeight,
    atEnd: el.scrollHeight - el.clientHeight - el.scrollTop <= 8,
  }));

/** 005 decision 11: the message log (L1). */
test.describe("L1. the message log", () => {
  const PAGE = "/items/message-log/";

  test("a region named Messages with a stop, holding a log named Conversation with aria-relevant additions; it opens at its end with the button hidden; scroll-padding-bottom is 96", async ({
    page,
  }) => {
    await open(page, PAGE);
    const region = page.getByTestId("log-main");
    await expect(region).toHaveAttribute("role", "region");
    await expect(region).toHaveAccessibleName("Messages");
    await expect(region).toHaveAttribute("tabindex", "0");
    const log = region.locator('[role="log"]');
    await expect(log).toHaveCount(1);
    await expect(log).toHaveAccessibleName("Conversation");
    await expect(log).toHaveAttribute("aria-relevant", "additions");
    expect(await log.getAttribute("aria-live")).toBeNull();
    expect(await computed(region, "overflow-y")).toBe("auto");
    expect(await computed(region, "scrollbar-width")).toBe("thin");
    expect(await computed(region, "overscroll-behavior-y")).toBe("contain");
    expect(await computed(region, "scroll-padding-bottom")).toBe("96px");
    const state = await scrollState(region);
    expect(state.height).toBeGreaterThan(state.client);
    expect(state.atEnd).toBe(true);
    const wrapper = region.locator("xpath=..");
    await expect(wrapper).toHaveAttribute("data-slot", "message-log");
    const button = wrapper.getByRole("button", { name: "Scroll to end" });
    await expect(button).toBeHidden();
    expect(
      await wrapper.locator('[data-slot="message-log-button"]').count(),
    ).toBe(1);
    expect(
      await wrapper
        .locator('[data-slot="message-log-button"]')
        .evaluate((el) => getComputedStyle(el).display),
    ).toBe("none");
  });

  test("it follows an appended turn and a streamed reply; a wheel up releases it and nothing moves it while released; the button appears inside the region, and returns to the end", async ({
    page,
  }) => {
    await open(page, PAGE);
    const region = page.getByTestId("log-main");
    const button = region
      .locator("xpath=..")
      .getByRole("button", { name: "Scroll to end" });
    // Append: the end stays in view.
    await page.getByTestId("log-add").click();
    await expect.poll(async () => (await scrollState(region)).atEnd).toBe(true);
    // Stream: the end stays in view through the growth.
    await page.getByTestId("log-stream").click();
    await page.waitForTimeout(600);
    expect((await scrollState(region)).atEnd).toBe(true);
    await expect(page.getByTestId("log-stream")).toHaveText("Stream a reply", {
      timeout: 10_000,
    });
    expect((await scrollState(region)).atEnd).toBe(true);
    await expect(button).toBeHidden();

    // A wheel towards the end while at the end moves nothing and releases
    // nothing: a stream is still followed.
    const box = (await region.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.wheel(0, 120);
    await page.waitForTimeout(200);
    expect((await scrollState(region)).atEnd).toBe(true);
    await page.getByTestId("log-stream").click();
    await page.waitForTimeout(600);
    expect((await scrollState(region)).atEnd).toBe(true);
    await expect(button).toBeHidden();
    await expect(page.getByTestId("log-stream")).toHaveText("Stream a reply", {
      timeout: 10_000,
    });
    expect((await scrollState(region)).atEnd).toBe(true);
    await expect(button).toBeHidden();
    // Wheel up: released; the button shows, inside the region. The click on
    // the stream button moved the mouse; back over the box first.
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.wheel(0, -300);
    await expect
      .poll(async () => (await scrollState(region)).atEnd)
      .toBe(false);
    await expect(button).toBeVisible();
    const b = (await button.boundingBox())!;
    expect(b.x).toBeGreaterThanOrEqual(box.x);
    expect(b.x + b.width).toBeLessThanOrEqual(box.x + box.width + 0.5);
    expect(b.y).toBeGreaterThanOrEqual(box.y);
    expect(b.y + b.height).toBeLessThanOrEqual(box.y + box.height + 0.5);
    expect(await computed(button, "position")).toBe("absolute");
    expect(await size(button)).toEqual([32, 32]);
    expect(await computed(button, "background-color")).toBe(
      hexToRgb(await cssVar(page, "--secondary")),
    );
    // Released: a stream does not move it.
    const before = (await scrollState(region)).top;
    await page.getByTestId("log-stream").click();
    await page.waitForTimeout(700);
    expect((await scrollState(region)).top).toBe(before);
    await expect(page.getByTestId("log-stream")).toHaveText("Stream a reply", {
      timeout: 10_000,
    });
    expect((await scrollState(region)).top).toBe(before);
    // The button returns to the end and hides.
    await button.click();
    await expect.poll(async () => (await scrollState(region)).atEnd).toBe(true);
    await expect(button).toBeHidden();
    // Growth past the end never releases: a further append is followed.
    await page.getByTestId("log-add").click();
    await expect.poll(async () => (await scrollState(region)).atEnd).toBe(true);
  });

  test("the sm log in a card keeps its names, and the raw HTML holds the region and the log", async ({
    page,
    browser,
    request,
  }) => {
    const { raw, close } = await rawPage(browser, request, PAGE);
    expect(await raw.locator('[role="region"][aria-label]').count()).toBe(3);
    expect(
      await raw.locator('[role="log"][aria-label="Conversation"]').count(),
    ).toBeGreaterThanOrEqual(2);
    await close();
    await open(page, PAGE);
    const small = page.getByTestId("log-small");
    await expect(small).toHaveAttribute("role", "region");
    await expect(small).toHaveAccessibleName("Last exchange");
    await expect(small.locator('[role="log"]')).toHaveCount(1);
  });
});

/** 005 decision 12: the message (L2) and the marker (L3). */
test.describe("L2. the message", () => {
  const PAGE = "/items/message/";

  test("the header is a heading with tabindex -1; the bubble is on muted, 8 px rounded, 80% wide at most; 0 style attributes", async ({
    page,
  }) => {
    await open(page, PAGE);
    const user = page.getByTestId("message-user");
    await expect(user).toHaveAttribute("data-align", "end");
    const header = user.locator('[data-slot="message-header"]');
    expect(await header.evaluate((el) => el.tagName.toLowerCase())).toBe("h3");
    await expect(header).toHaveAttribute("tabindex", "-1");
    await expect(header).toHaveText("you");
    expect(await computed(header, "font-family")).toContain("JetBrains Mono");
    const bubble = user.locator('[data-slot="message-content"]');
    await expect(bubble).toHaveAttribute("data-variant", "bubble");
    expect(await computed(bubble, "background-color")).toBe(
      hexToRgb(await cssVar(page, "--muted")),
    );
    expect(await computed(bubble, "border-top-left-radius")).toBe("8px");
    expect(await computed(bubble, "max-width")).toBe("80%");
    const avatar = user.locator('[data-slot="message-avatar"]');
    expect(await computed(avatar, "background-color")).toBe("rgba(0, 0, 0, 0)");
    expect(await computed(avatar, "border-top-left-radius")).toBe("0px");
    await expect(avatar.locator('[data-slot="avatar"]')).toHaveCount(1);

    const assistant = page.getByTestId("message-assistant");
    const plain = assistant.locator('[data-slot="message-content"]');
    await expect(plain).toHaveAttribute("data-variant", "plain");
    expect(await computed(plain, "background-color")).toBe("rgba(0, 0, 0, 0)");
    await expect(assistant.locator('[data-slot="code-block"]')).toHaveAttribute(
      "data-size",
      "sm",
    );
    const level = page
      .getByTestId("message-footer")
      .locator('[data-slot="message-header"]');
    expect(await level.evaluate((el) => el.tagName.toLowerCase())).toBe("h4");
    await expect(
      page
        .getByTestId("message-footer")
        .locator('[data-slot="message-footer"]'),
    ).toHaveCount(1);
    expect(await page.locator('[data-slot^="message"][style]').count()).toBe(0);
    // A heading can be focused by script, not by Tab.
    await header.evaluate((el) => (el as HTMLElement).focus());
    await expect(header).toBeFocused();
  });
});

test.describe("L3. the marker", () => {
  const PAGE = "/items/marker/";

  test("the separator's lines are borders in --border, the border variant's edge too; no role by default; the icon is hidden", async ({
    page,
  }) => {
    await open(page, PAGE);
    const separator = page.getByTestId("marker-separator");
    expect(await separator.getAttribute("role")).toBeNull();
    for (const pseudo of ["::before", "::after"]) {
      const [width, colour, bg] = await separator.evaluate((el, p) => {
        const s = getComputedStyle(el, p);
        return [s.borderTopWidth, s.borderTopColor, s.backgroundColor];
      }, pseudo);
      expect(width, pseudo).toBe("1px");
      expect(bg, pseudo).toBe("rgba(0, 0, 0, 0)");
      const border = await cssVar(page, "--border");
      let d = border.replace("#", "");
      if (d.length <= 4) d = [...d].map((c) => c + c).join("");
      const n = parseInt(d.slice(0, 6), 16);
      expect(colour).toContain(
        `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`,
      );
    }
    const bordered = page.getByTestId("marker-border");
    expect(await computed(bordered, "border-bottom-width")).toBe("1px");
    expect(
      await page.getByTestId("marker-default").getAttribute("role"),
    ).toBeNull();
    await expect(
      page.getByTestId("marker-default").locator('[data-slot="marker-icon"]'),
    ).toHaveAttribute("aria-hidden", "true");
    const status = page.getByTestId("marker-status");
    await expect(status.locator('[data-slot="spinner"]')).toHaveCount(1);
    await expect(page.getByTestId("marker-status-region")).toHaveAttribute(
      "role",
      "status",
    );
    await expect(page.getByTestId("marker-status-region")).toHaveText(
      "Responding",
    );
  });
});

/** 005 decision 13: the composer (L4). */
test.describe("L4. the composer", () => {
  const PAGE = "/items/composer/";
  const main = (page: Page) => page.getByTestId("composer-main");
  const textarea = (page: Page) => main(page).locator("textarea");
  const button = (page: Page) =>
    main(page).locator('[data-slot="composer-send"]');

  test("the textarea grows by field-sizing from 64 px, scrolls inside at 256; the hint is wired; the send button is 48 px, submit, named, never disabled", async ({
    page,
  }) => {
    await open(page, PAGE);
    const t = textarea(page);
    expect(await computed(t, "field-sizing")).toBe("content");
    await expect(t).toHaveAttribute("rows", "1");
    expect(await computed(t, "resize")).toBe("none");
    expect((await size(t))[1]).toBe(64);
    expect(await computed(t, "max-height")).toBe("256px");
    await expect(t).toHaveAccessibleName("Message");
    const described = await t.getAttribute("aria-describedby");
    expect(described).toBeTruthy();
    const hint = page.locator(`[id="${described}"]`);
    await expect(hint).toBeVisible();
    await expect(hint).toContainText("Enter to send");
    await expect(hint.locator("kbd")).toHaveCount(2);
    await expect(t).toHaveAccessibleDescription(/Enter to send/);
    const b = button(page);
    expect(await size(b)).toEqual([48, 48]);
    await expect(b).toHaveAttribute("type", "submit");
    await expect(b).toHaveAccessibleName("Send message");
    await expect(b).toHaveAttribute("data-state", "send");
    expect(await b.getAttribute("disabled")).toBeNull();
    expect(await computed(b, "background-color")).toBe(
      hexToRgb(await cssVar(page, "--primary")),
    );
    // Three lines: taller than one; twenty: capped at 256 and scrolling inside.
    await t.focus();
    await page.keyboard.type("one");
    await page.keyboard.press("Shift+Enter");
    await page.keyboard.type("two");
    await page.keyboard.press("Shift+Enter");
    await page.keyboard.type("three");
    const three = (await size(t))[1]!;
    expect(three).toBeGreaterThan(64);
    expect(three).toBeLessThan(256);
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press("Shift+Enter");
      await page.keyboard.type(`line ${i}`);
    }
    expect((await size(t))[1]).toBe(256);
    expect(await computed(t, "overflow-y")).toBe("auto");
    const [scrollHeight, clientHeight] = await t.evaluate((el) => [
      el.scrollHeight,
      el.clientHeight,
    ]);
    expect(scrollHeight).toBeGreaterThan(clientHeight);
    // An empty submit is ignored and focus stays.
    await page.getByTestId("composer-clear").click();
    await expect(t).toHaveValue("");
    await t.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByTestId("composer-sent")).toHaveText("");
    await expect(t).toBeFocused();
  });

  test("Enter sends and clears, keeping focus; Shift Enter adds a line; a composing Enter does not send; Stop is the same element, secondary and named; the status says Responding then Stopped, and Response complete on a full reply", async ({
    page,
  }) => {
    await open(page, PAGE);
    const t = textarea(page);
    const b = button(page);
    const status = main(page).getByRole("status");
    await expect(status).toHaveText("");
    await t.focus();
    await page.keyboard.type("Hello");
    await page.keyboard.press("Shift+Enter");
    await page.keyboard.type("there");
    await expect(t).toHaveValue("Hello\nthere");
    await expect(page.getByTestId("composer-sent")).toHaveText("");
    // A composing Enter: the IME's candidate, not the message.
    await t.evaluate((el) =>
      el.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "Enter",
          isComposing: true,
          bubbles: true,
          cancelable: true,
        }),
      ),
    );
    await expect(page.getByTestId("composer-sent")).toHaveText("");
    await t.evaluate((el) =>
      el.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "Enter",
          keyCode: 229,
          bubbles: true,
          cancelable: true,
        }),
      ),
    );
    await expect(page.getByTestId("composer-sent")).toHaveText("");
    await expect(t).toHaveValue("Hello\nthere");
    // Enter sends; the spinner shows while submitted (the page's first 700 ms).
    await page.keyboard.press("Enter");
    await expect(main(page).locator('[data-slot="spinner"]')).toHaveCount(1);
    await expect(page.getByTestId("composer-sent")).toHaveText("Hello\nthere");
    await expect(t).toHaveValue("");
    await expect(t).toBeFocused();
    // Stop: the same element, type button, secondary, named.
    await expect(b).toHaveAttribute("data-state", "stop");
    await expect(b).toHaveAttribute("type", "button");
    await expect(b).toHaveAccessibleName("Stop response");
    await expect(status).toHaveText("Responding");
    // The variant's colour transitions over the micro budget.
    await expect
      .poll(() => computed(b, "background-color"))
      .toBe(hexToRgb(await cssVar(page, "--secondary")));
    // Enter while a reply runs does nothing.
    await page.keyboard.type("more");
    await page.keyboard.press("Enter");
    await expect(page.getByTestId("composer-sent")).toHaveText("Hello\nthere");
    await expect(t).toHaveValue("more");
    // Escape stops: Stopped, then Send again with focus kept; the next ready is silent.
    await page.keyboard.press("Escape");
    await expect(status).toHaveText("Stopped");
    await expect(b).toHaveAttribute("data-state", "send");
    await expect(b).toHaveAccessibleName("Send message");
    await expect(t).toBeFocused();
    await page.waitForTimeout(300);
    await expect(status).toHaveText("Stopped");
    // A full reply: Responding, then Response complete.
    await page.getByTestId("composer-clear").click();
    await t.focus();
    await page.keyboard.type("Again");
    await page.keyboard.press("Enter");
    await expect(status).toHaveText("Responding");
    await expect(status).toHaveText("Response complete", { timeout: 15_000 });
    await expect(b).toHaveAttribute("data-state", "send");
    // The labelled one shows its label.
    await expect(
      page.getByTestId("composer-labelled").locator("label"),
    ).toBeVisible();
    expect(
      await page
        .locator(
          '[data-slot^="composer"] [disabled], [data-slot^="composer"][disabled]',
        )
        .count(),
    ).toBe(0);
  });
});
