/**
 * 003 decision 20, browser file 6: the blocks' behaviours, page states, the
 * hero's widths, and motion, reflow, targets and rings on every view. Runs in
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
  NEW_PAGES,
  open,
  openView,
  VIEW_STOPS,
  VIEWS,
} from "./pages.ts";

async function box(locator: Locator) {
  const b = await locator.boundingBox();
  if (!b) throw new Error("element has no box");
  return b;
}

/** Fetches a page's prerendered HTML and loads it with scripts off. */
async function rawPage(
  browser: Browser,
  request: APIRequestContext,
  path: string,
): Promise<{ raw: Page; close: () => Promise<void> }> {
  const response = await request.get(path);
  expect(response.status()).toBe(200);
  const context = await browser.newContext({ javaScriptEnabled: false });
  const raw = await context.newPage();
  await raw.setContent(await response.text());
  return { raw, close: () => context.close() };
}

const summary = (scope: Page | Locator) =>
  scope.locator('[data-slot="error-summary"]');

/** The element with keyboard focus, as a locator-free description. */
async function activeId(page: Page): Promise<string | null> {
  return page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return null;
    return el.id || el.getAttribute("data-slot") || el.tagName.toLowerCase();
  });
}

/** Types a code into the code input's one real input. */
async function typeCode(page: Page, code: string): Promise<void> {
  await page.locator("#sign-up-code").focus();
  await page.keyboard.type(code);
}

const CREDENTIALS =
  "That email address and password do not match an account. Check them and try again.";

test.describe("sign in", () => {
  test("1. an empty submit focuses a summary of 2 links that equal the 2 inline errors", async ({
    page,
  }) => {
    await openView(page, "/view/sign-in/");
    await page.getByRole("button", { name: "Sign in" }).click();
    const s = summary(page);
    await expect(s).toBeFocused();
    await expect(s).toHaveAttribute("role", "alert");
    const links = await s.getByRole("link").allTextContents();
    const inline = await page
      .locator('[data-slot="field-error"]')
      .allTextContents();
    expect(links.map((t) => t.trim())).toEqual([
      "Enter your email address",
      "Enter your password",
    ]);
    expect(inline.map((t) => t.trim())).toEqual(links.map((t) => t.trim()));
    for (const id of ["sign-in-email", "sign-in-password"]) {
      const input = page.locator(`[id="${id}"]`);
      await expect(input).toHaveAttribute("aria-invalid", "true");
      await expect(input).toHaveAttribute(
        "aria-describedby",
        new RegExp(`(^|\\s)${id}-error(\\s|$)`),
      );
    }
    expect(await page.title()).toMatch(/^Error: /);
  });

  test("2. Enter on each summary link focuses its field: 2 of 2", async ({
    page,
  }) => {
    await openView(page, "/view/sign-in/");
    await page.getByRole("button", { name: "Sign in" }).click();
    const links = summary(page).getByRole("link");
    for (const [i, id] of ["sign-in-email", "sign-in-password"].entries()) {
      await links.nth(i).focus();
      await page.keyboard.press("Enter");
      expect(await activeId(page)).toBe(id);
    }
  });

  test("3. a valid submit goes busy, keeps focus and says so, then shows the credential message", async ({
    page,
  }) => {
    await openView(page, "/view/sign-in/");
    await page.locator("#sign-in-email").fill("ada@example.com");
    await page.locator("#sign-in-password").fill("correct horse battery");
    const button = page.getByRole("button", { name: "Sign in" });
    const status = page.locator(
      '[data-slot="sign-in-form"] [data-slot="status"]',
    );
    await button.focus();
    await page.keyboard.press("Enter");
    await expect(button).toHaveAttribute("aria-busy", "true");
    await expect(button).toBeFocused();
    await expect(status).toHaveText("Signing in…");
    const s = summary(page);
    await expect(s).toBeFocused();
    await expect(s).toContainText(CREDENTIALS);
    await expect(s.getByRole("link")).toHaveCount(0);
    await expect(page.locator("#sign-in-password")).toHaveValue("");
    await expect(page.locator('input[aria-invalid="true"]')).toHaveCount(0);
    await expect(status).toHaveText("");
  });

  test("4. the errors view's summary has no role and takes no focus; the credentials view's footer links to /", async ({
    page,
  }) => {
    await openView(page, "/view/sign-in/errors/");
    await expect(summary(page)).toHaveCount(1);
    expect(await summary(page).getAttribute("role")).toBeNull();
    expect(await activeId(page)).toBeNull();
    await openView(page, "/view/sign-in/credentials/");
    await expect(
      page.getByRole("link", { name: "Create an account" }),
    ).toHaveAttribute("href", "/");
  });
});

/** Fills the details step validly and moves to the code step. */
async function toCodeStep(page: Page): Promise<void> {
  await openView(page, "/view/sign-up/");
  await page.locator("#sign-up-email").fill("ada@example.com");
  await page.locator("#sign-up-password").fill("a long enough password");
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(
    page.getByRole("heading", { level: 1, name: "Check your email" }),
  ).toBeFocused();
}

test.describe("sign up", () => {
  test("5. an empty submit focuses a summary of 2 links; Enter on each focuses its field", async ({
    page,
  }) => {
    await openView(page, "/view/sign-up/");
    await page.getByRole("button", { name: "Create account" }).click();
    const s = summary(page);
    await expect(s).toBeFocused();
    const links = s.getByRole("link");
    await expect(links).toHaveCount(2);
    for (const [i, id] of ["sign-up-email", "sign-up-password"].entries()) {
      await links.nth(i).focus();
      await page.keyboard.press("Enter");
      expect(await activeId(page)).toBe(id);
    }
  });

  test("6. the rules describe the password and sit above it; 14 characters are refused, 15 are not", async ({
    page,
  }) => {
    await openView(page, "/view/sign-up/");
    const input = page.locator("#sign-up-password");
    const rules = page.locator("#sign-up-password-description");
    await expect(input).toHaveAttribute(
      "aria-describedby",
      /(^|\s)sign-up-password-description(\s|$)/,
    );
    expect((await box(rules)).y).toBeLessThan((await box(input)).y);
    expect(await input.getAttribute("maxlength")).toBeNull();
    await page.locator("#sign-up-email").fill("ada@example.com");
    await input.fill("x".repeat(14));
    await page.getByRole("button", { name: "Create account" }).click();
    await expect(page.locator("#sign-up-password-error")).toHaveText(
      "Use at least 15 characters for your password",
    );
    await input.fill("x".repeat(15));
    await page.getByRole("button", { name: "Create account" }).click();
    await expect(page.locator("#sign-up-password-error")).toHaveCount(0);
  });

  test("7. valid details go busy and say so, then focus the code step's heading, which names the email", async ({
    page,
  }) => {
    await openView(page, "/view/sign-up/");
    await page.locator("#sign-up-email").fill("ada@example.com");
    await page.locator("#sign-up-password").fill("a long enough password");
    const button = page.getByRole("button", { name: "Create account" });
    await button.click();
    await expect(button).toHaveAttribute("aria-busy", "true");
    await expect(
      page.locator('[data-slot="sign-up-form"] [data-slot="status"]'),
    ).toHaveText("Creating your account…");
    const heading = page.getByRole("heading", {
      level: 1,
      name: "Check your email",
    });
    await expect(heading).toBeFocused();
    await expect(page.locator("main")).toContainText(
      "We sent a 6-digit code to ada@example.com.",
    );
  });

  test("8. a wrong code focuses a summary of 1 link; Enter on it focuses the code's real input", async ({
    page,
  }) => {
    await toCodeStep(page);
    await typeCode(page, "000000");
    await page.getByRole("button", { name: "Verify email" }).click();
    const s = summary(page);
    await expect(s).toBeFocused();
    await expect(s.getByRole("link")).toHaveCount(1);
    await s.getByRole("link").focus();
    await page.keyboard.press("Enter");
    expect(await activeId(page)).toBe("sign-up-code");
  });

  test("9. two resends pass through 4 status texts, each different from the one before", async ({
    page,
  }) => {
    await toCodeStep(page);
    const status = page.locator(
      '[data-slot="sign-up-verify"] [data-slot="status"]',
    );
    await status.evaluate((el) => {
      const seen: string[] = [];
      (window as unknown as { seen: string[] }).seen = seen;
      new MutationObserver(() => {
        const text = (el.textContent ?? "").trim();
        if (text && seen[seen.length - 1] !== text) seen.push(text);
      }).observe(el, { childList: true, characterData: true, subtree: true });
    });
    const resend = page.getByRole("button", { name: "Send a new code" });
    await resend.click();
    await expect(status).toHaveText("We sent a new code to ada@example.com.");
    await resend.click();
    await expect(status).toHaveText("We sent another code to ada@example.com.");
    const seen = await page.evaluate(
      () => (window as unknown as { seen: string[] }).seen,
    );
    expect(seen).toEqual([
      "Sending a new code…",
      "We sent a new code to ada@example.com.",
      "Sending a new code…",
      "We sent another code to ada@example.com.",
    ]);
  });

  test("10. Use a different email address returns to the details, the email kept, the heading focused", async ({
    page,
  }) => {
    await toCodeStep(page);
    await page
      .getByRole("button", { name: "Use a different email address" })
      .click();
    await expect(page.locator("#sign-up-email")).toHaveValue("ada@example.com");
    await expect(
      page.getByRole("heading", { level: 1, name: "Create an account" }),
    ).toBeFocused();
  });

  test("11. the right code focuses the done heading; Continue links to /; consent renders only with its links", async ({
    page,
  }) => {
    await toCodeStep(page);
    await typeCode(page, "123456");
    await page.getByRole("button", { name: "Verify email" }).click();
    await expect(
      page.getByRole("heading", { level: 1, name: "Your account is ready" }),
    ).toBeFocused();
    await expect(page.getByRole("link", { name: "Continue" })).toHaveAttribute(
      "href",
      "/",
    );
    await openView(page, "/view/sign-up/errors/");
    const consent = page.locator('[data-slot="sign-up-consent"]');
    expect(
      ((await consent.textContent()) ?? "").replace(/\s+/g, " ").trim(),
    ).toBe(
      "By creating an account, you agree to the terms of service and the privacy notice.",
    );
    await expect(consent.getByRole("link")).toHaveCount(2);
    for (const link of await consent.getByRole("link").all())
      await expect(link).toHaveAttribute("href", "/");
    await openView(page, "/view/sign-up/");
    await expect(page.locator('[data-slot="sign-up-consent"]')).toHaveCount(0);
  });
});

const discard = (page: Page) =>
  page.getByRole("button", { name: "Discard changes" });
const settingsStatus = (page: Page) =>
  page.locator('[data-slot="settings-form"] [data-slot="status"]');

test.describe("settings", () => {
  test("12. pristine shows no Discard; a change shows 1", async ({ page }) => {
    await openView(page, "/view/settings/");
    await expect(discard(page)).toHaveCount(0);
    await page.locator("#settings-name").pressSequentially(" Byron");
    await expect(discard(page)).toHaveCount(1);
  });

  test("13. Save goes busy, keeps focus and says Saving…, then Saved in --success, and Discard goes", async ({
    page,
  }) => {
    await openView(page, "/view/settings/");
    await page.locator("#settings-name").pressSequentially(" Byron");
    const save = page.getByRole("button", { name: "Save changes" });
    await save.focus();
    await page.keyboard.press("Enter");
    await expect(save).toHaveAttribute("aria-busy", "true");
    await expect(save).toBeFocused();
    await expect(settingsStatus(page)).toHaveText("Saving…");
    await expect(settingsStatus(page)).toHaveText("Saved");
    await expect(settingsStatus(page)).toBeVisible();
    await expect(settingsStatus(page)).toHaveCSS(
      "color",
      hexToRgb(await cssVar(page, "--success")),
    );
    await expect(discard(page)).toHaveCount(0);
  });

  test("14. beforeunload asks once when dirty, and not when pristine", async ({
    browser,
  }) => {
    for (const [dirty, expected] of [
      [true, 1],
      [false, 0],
    ] as const) {
      const context = await browser.newContext();
      const page = await context.newPage();
      await openView(page, "/view/settings/");
      // A user gesture first: a browser asks only on a page someone used.
      await page.locator("#settings-name").click();
      if (dirty) await page.keyboard.type(" Byron");
      const dialogs: string[] = [];
      page.on("dialog", async (dialog) => {
        dialogs.push(dialog.type());
        await dialog.accept();
      });
      await page.close({ runBeforeUnload: true });
      if (expected) await expect.poll(() => dialogs.length).toBe(1);
      else await new Promise((r) => setTimeout(r, 500));
      expect(dialogs).toEqual(expected ? ["beforeunload"] : []);
      await context.close();
    }
  });

  test("15. an empty name focuses a summary of 1 link; Enter on it focuses Name", async ({
    page,
  }) => {
    await openView(page, "/view/settings/");
    await page.locator("#settings-name").fill("");
    await page.getByRole("button", { name: "Save changes" }).click();
    const s = summary(page);
    await expect(s).toBeFocused();
    await expect(s.getByRole("link")).toHaveCount(1);
    await s.getByRole("link").focus();
    await page.keyboard.press("Enter");
    expect(await activeId(page)).toBe("settings-name");
  });

  test("16. Delete account confirms on Keep my account, Escape returns focus, and confirming says so", async ({
    page,
  }) => {
    await openView(page, "/view/settings/");
    const trigger = page.getByRole("button", { name: "Delete account" });
    await trigger.click();
    const dialog = page.getByRole("alertdialog");
    await expect(dialog).toBeVisible();
    await expect(
      dialog.getByRole("button", { name: "Keep my account" }),
    ).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await trigger.click();
    await dialog.getByRole("button", { name: "Delete account" }).click();
    await expect(dialog).toHaveCount(0);
    await expect(
      page.locator('[data-slot="settings-delete"] [data-slot="status"]'),
    ).toHaveText("Account deletion requested.");
  });

  test("17. Space on Discard restores the saved values, focuses Name and says Changes discarded.", async ({
    page,
  }) => {
    await openView(page, "/view/settings/");
    const name = page.locator("#settings-name");
    await name.fill("Someone else");
    await page.locator("#settings-email").fill("someone@example.com");
    await discard(page).focus();
    await page.keyboard.press("Space");
    await expect(name).toHaveValue("Ada Lovelace");
    await expect(page.locator("#settings-email")).toHaveValue(
      "ada@example.com",
    );
    await expect(name).toBeFocused();
    await expect(settingsStatus(page)).toHaveText("Changes discarded.");
  });
});

test.describe("page states", () => {
  test("18. loading: aria-busy, 3 hidden skeleton rows, the status empty raw and said after hydration, nothing focusable", async ({
    page,
    browser,
    request,
  }) => {
    const path = "/view/page-states/loading/";
    const region = '[data-slot="page-states-loading"]';
    const { raw, close } = await rawPage(browser, request, path);
    await expect(raw.locator(region)).toHaveAttribute("aria-busy", "true");
    expect(
      (
        (await raw
          .locator('[data-slot="page-states-loading"] + [data-slot="status"]')
          .textContent()) ?? ""
      ).trim(),
    ).toBe("");
    await close();

    await openView(page, path);
    await expect(page.locator(region)).toHaveAttribute("aria-busy", "true");
    const rows = page.locator(`${region} [data-slot="page-states-row"]`);
    await expect(rows).toHaveCount(3);
    for (const row of await rows.all())
      await expect(row).toHaveAttribute("aria-hidden", "true");
    await expect(
      page.locator('[data-slot="page-states-loading"] + [data-slot="status"]'),
    ).toHaveText("Loading projects");
    expect(
      await page
        .locator(region)
        .locator(
          'a[href], button, input, select, textarea, summary, [tabindex]:not([tabindex="-1"])',
        )
        .count(),
    ).toBe(0);
  });

  test("19. an unknown path answers 404 with one h1, Page not found; its view answers 200 with the same", async ({
    page,
  }) => {
    const missing = await page.goto("/no-such-page/");
    expect(missing?.status()).toBe(404);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveText("Page not found");
    const view = await page.goto("/view/page-states/not-found/");
    expect(view?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveText("Page not found");
  });

  test("20. no status number outside code on 18 pages, and no red text on the 5 page-states views", async ({
    page,
  }) => {
    const found: string[] = [];
    for (const path of [...VIEWS.map((v) => v.path), "/no-such-page/"]) {
      await page.goto(path);
      const text = await page.evaluate(() => {
        const clone = document.body.cloneNode(true) as HTMLElement;
        clone.querySelectorAll("code, script").forEach((c) => c.remove());
        return clone.textContent ?? "";
      });
      const match = text.match(/\b[1-5]\d\d\b/g);
      if (match) found.push(`${path}: ${match.join(", ")}`);
    }
    expect(found).toEqual([]);

    const red: string[] = [];
    for (const view of VIEWS.filter((v) => v.block === "page-states")) {
      await openView(page, view.path);
      const destructive = hexToRgb(await cssVar(page, "--destructive"));
      const hits = await page.evaluate(
        (colour) =>
          [...document.querySelectorAll("body *")]
            .filter(
              (el) =>
                [...el.childNodes].some(
                  (n) => n.nodeType === Node.TEXT_NODE && n.textContent?.trim(),
                ) && getComputedStyle(el).color === colour,
            )
            .map((el) => el.textContent?.trim() ?? ""),
        destructive,
      );
      for (const h of hits) red.push(`${view.path}: ${h}`);
    }
    expect(red).toEqual([]);
  });

  test("21. the error view's reference sits in a closed details whose summary is at least 24 px tall", async ({
    page,
  }) => {
    await openView(page, "/view/page-states/error/");
    const details = page.locator("details");
    await expect(details).toHaveCount(1);
    expect(await details.evaluate((d) => (d as HTMLDetailsElement).open)).toBe(
      false,
    );
    const sum = details.locator("summary");
    await expect(sum).toHaveText("Technical details");
    expect((await box(sum)).height).toBeGreaterThanOrEqual(24);
    await sum.click();
    await expect(details.locator("code", { hasText: "b7e2c41" })).toBeVisible();
  });

  test("22. cannot be shown: one h1, and 403 once, in code inside a mono line", async ({
    page,
  }) => {
    await openView(page, "/view/page-states/cannot-show/");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveText("This page cannot be shown");
    const text = (await page.locator("body").textContent()) ?? "";
    expect(text.match(/403/g)).toHaveLength(1);
    const code = page.locator("code", { hasText: "403" });
    await expect(code).toHaveCount(1);
    expect(
      await code.evaluate((c) => !!c.parentElement?.closest(".font-mono")),
    ).toBe(true);
  });
});

test.describe("hero", () => {
  for (const [width, size, tracks, full] of [
    [360, "28px", 1, true],
    [768, "44px", 2, false],
    [1280, "44px", 3, false],
  ] as const) {
    test(`23. at ${width}: the h1 is ${size}, the grid has ${tracks} column(s), the call to action ${full ? "fills" : "does not fill"} its row`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await openView(page, "/view/hero/");
      await expect(page.locator("h1")).toHaveCSS("font-size", size);
      const columns = await page
        .locator('[data-slot="hero-features"] ul')
        .evaluate((ul) => getComputedStyle(ul).gridTemplateColumns);
      expect(columns.trim().split(/\s+/)).toHaveLength(tracks);
      const cta = page.getByRole("link", { name: "Browse the components" });
      const ctaWidth = (await box(cta)).width;
      const rowWidth = await cta.evaluate(
        (el) => el.parentElement!.getBoundingClientRect().width,
      );
      if (full) expect(Math.abs(ctaWidth - rowWidth)).toBeLessThan(1);
      else expect(ctaWidth).toBeLessThan(rowWidth - 1);
    });
  }
});

const PAGES_24 = [...VIEWS.map((v) => v.path), ...NEW_PAGES];

async function load(page: Page, path: string): Promise<void> {
  if (path.startsWith("/view/")) await openView(page, path);
  else await open(page, path);
}

test.describe("all blocks", () => {
  test("24. no infinite animation outside a spinner on the 18 views and 7 new item pages", async ({
    page,
  }) => {
    const loops: string[] = [];
    for (const path of PAGES_24) {
      await load(page, path);
      const found = await page.evaluate(() =>
        [...document.querySelectorAll("*")]
          .filter(
            (el) =>
              getComputedStyle(el).animationIterationCount === "infinite" &&
              !el.closest('[data-slot="spinner"]'),
          )
          .map((el) => el.tagName.toLowerCase()),
      );
      for (const f of found) loops.push(`${path}: ${f}`);
    }
    expect(PAGES_24).toHaveLength(25);
    expect(loops).toEqual([]);
  });

  test("25. reflow: no horizontal scroll at 320 px on 25 of 25 pages", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    const wide: string[] = [];
    for (const path of PAGES_24) {
      await load(page, path);
      const width = await page.evaluate(
        () => document.documentElement.scrollWidth,
      );
      if (width > 320) wide.push(`${path}: ${width}`);
    }
    expect(wide).toEqual([]);
  });

  test("26. targets: each of the 83 view stops is at least 24 × 24 px at 360", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 900 });
    const small: string[] = [];
    let counted = 0;
    for (const view of VIEWS) {
      const stops = VIEW_STOPS[view.path] ?? [];
      await openView(page, view.path);
      for (let i = 0; i < stops.length; i++) {
        await page.keyboard.press("Tab");
        const size = await page.evaluate(() => {
          const r = document.activeElement!.getBoundingClientRect();
          return [r.width, r.height];
        });
        counted++;
        if (size[0] < 24 || size[1] < 24)
          small.push(`${view.path} ${stops[i]}: ${size.join(" × ")}`);
      }
    }
    expect(small).toEqual([]);
    expect(counted).toBe(83);
  });

  test("27. rings are not clipped: 40 of 40 sign-in and sign-up stops at 360", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 900 });
    const clipped: string[] = [];
    let counted = 0;
    for (const view of VIEWS.filter((v) =>
      ["sign-in", "sign-up"].includes(v.block),
    )) {
      const stops = VIEW_STOPS[view.path] ?? [];
      await openView(page, view.path);
      for (let i = 0; i < stops.length; i++) {
        await page.keyboard.press("Tab");
        const problem = await page.evaluate(() => {
          const focused = document.activeElement as HTMLElement;
          // The input group draws the ring for its text control, and the code
          // input's root for its hidden input (002 decision 8); a button in a
          // group draws its own.
          const ringed = (
            focused.getAttribute("data-slot") === "input-group-control"
              ? focused.closest('[data-slot="input-group"]')
              : (focused.closest('[data-slot="input-otp"]') ?? focused)
          ) as HTMLElement;
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
        });
        counted++;
        if (problem) clipped.push(`${view.path} ${stops[i]}: ${problem}`);
      }
    }
    expect(clipped).toEqual([]);
    expect(counted).toBe(40);
  });
});

/** decisions.md, after the change review: each failed callback names what failed. */
const FAILED = {
  signIn: "We could not sign you in. Try again.",
  save: "We could not save your changes. Try again.",
  remove: "We could not delete your account. Try again.",
};

/**
 * Makes the page file's stand-in server fail: its stubs wait with
 * `setTimeout(resolve, 800)` or `400`, and a throw inside a promise's
 * executor rejects that promise.
 */
async function failStubs(page: Page): Promise<void> {
  await page.evaluate(() => {
    const original = window.setTimeout;
    window.setTimeout = ((
      fn: TimerHandler,
      ms?: number,
      ...rest: unknown[]
    ) => {
      if (ms === 800 || ms === 400)
        throw new Error("The stand-in server failed.");
      return original(fn, ms, ...rest);
    }) as typeof window.setTimeout;
  });
}

/** decisions.md, after the change review, finding 2: a callback that rejects. */
test.describe("a callback that rejects", () => {
  test("28. sign in: onsubmit rejects; a focused summary and the status say so, and nothing typed is lost", async ({
    page,
  }) => {
    await openView(page, "/view/sign-in/");
    await page.locator("#sign-in-email").fill("ada@example.com");
    await page.locator("#sign-in-password").fill("correct horse battery");
    await failStubs(page);
    await page.getByRole("button", { name: "Sign in" }).click();
    const s = summary(page);
    await expect(s).toBeFocused();
    await expect(s).toHaveAttribute("role", "alert");
    await expect(s).toContainText(FAILED.signIn);
    await expect(
      page.locator('[data-slot="sign-in-form"] [data-slot="status"]'),
    ).toHaveText(FAILED.signIn);
    await expect(page.locator("#sign-in-email")).toHaveValue("ada@example.com");
    await expect(page.locator("#sign-in-password")).toHaveValue(
      "correct horse battery",
    );
  });

  test("29. sign up: onresend rejects; the status says the code was not sent", async ({
    page,
  }) => {
    await toCodeStep(page);
    await failStubs(page);
    await page.getByRole("button", { name: "Send a new code" }).click();
    await expect(
      page.locator('[data-slot="sign-up-verify"] [data-slot="status"]'),
    ).toHaveText("We could not send a new code. Try again.");
  });

  test("30. settings: onsave rejects; a focused summary and the status say so, and the change is kept", async ({
    page,
  }) => {
    await openView(page, "/view/settings/failed/");
    await page.locator("#settings-name").fill("Ada King");
    await page.getByRole("button", { name: "Save changes" }).click();
    const s = page.locator(
      '[data-slot="settings-form"] [data-slot="error-summary"]',
    );
    await expect(s).toBeFocused();
    await expect(s).toHaveAttribute("role", "alert");
    await expect(s).toContainText(FAILED.save);
    await expect(settingsStatus(page)).toHaveText(FAILED.save);
    await expect(page.locator("#settings-name")).toHaveValue("Ada King");
  });

  test("31. settings: ondelete rejects; a focused summary and the status say so", async ({
    page,
  }) => {
    await openView(page, "/view/settings/failed/");
    await page.getByRole("button", { name: "Delete account" }).click();
    await page
      .getByRole("alertdialog")
      .getByRole("button", { name: "Delete account" })
      .click();
    const section = page.locator('[data-slot="settings-delete"]');
    const s = section.locator('[data-slot="error-summary"]');
    await expect(s).toBeFocused();
    await expect(s).toHaveAttribute("role", "alert");
    await expect(s).toContainText(FAILED.remove);
    await expect(section.locator('[data-slot="status"]')).toHaveText(
      FAILED.remove,
    );
  });
});
