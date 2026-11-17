/**
 * 022 decision 11: `sign-up`, by the kinds its parts bring. An empty submit
 * inserts the error summary, spoken whole and once (L1, L3). Valid details
 * replace the form with the code step, whose heading takes focus and is
 * spoken (F1): patch 5's witness. A resend's status is spoken (L1).
 *
 * The summary's test hears `error-summary`, not `alert` (decision 15).
 */
import type { Page } from "@playwright/test";
import { appears, declared, test } from "./fixtures.ts";
import { F1, L1, L3 } from "./rules.ts";

const PATH = "/view/sign-up/";
const TITLE = "There is a problem";
const ERRORS = ["Enter your email address", "Enter a password"];
const EMAIL = "ada@example.com";

const create = (page: Page) =>
  page.getByRole("button", { name: "Create account" });

/** Valid details, typed with no keystrokes, and the button focused in its own window. */
async function details(page: Page, sr: import("./fixtures.ts").Sr) {
  await page.locator("#sign-up-email").fill(EMAIL);
  await page.locator("#sign-up-password").fill("a long enough password");
  await sr.after(() => create(page).focus(), "focus");
}

test(
  "an empty submit: the summary's title and messages spoken whole, none twice in a row",
  declared("sign-up", ["L1", "L3"], ["error-summary"]),
  async ({ page, sr }) => {
    await sr.open(PATH);
    await sr.after(() => create(page).focus(), "focus");
    const after = await sr.after(() => page.keyboard.press("Enter"));
    await sr.judge(
      [TITLE, ...ERRORS].flatMap((m) => [...L1(after, m), ...L3(after, m)]),
    );
  },
);

test(
  "the code step: its heading takes focus and is spoken",
  declared("sign-up", ["F1"]),
  async ({ page, sr }) => {
    await sr.open(PATH);
    await details(page, sr);
    // The step's own field, not its heading's focus, says the step arrived.
    const after = await sr.after(async () => {
      await page.keyboard.press("Enter");
      await appears(page.locator("#sign-up-code"), "the code step's field");
    });
    await sr.focused(
      page.getByRole("heading", { level: 1, name: "Check your email" }),
    );
    await sr.judge(F1(after, "Check your email"));
  },
);

test(
  "a resend's status is spoken",
  declared("sign-up", ["L1"]),
  async ({ page, sr }) => {
    await sr.open(PATH);
    await details(page, sr);
    await sr.after(async () => {
      await page.keyboard.press("Enter");
      await appears(page.locator("#sign-up-code"), "the code step's field");
    }, "step");
    await sr.after(
      () => page.getByRole("button", { name: "Send a new code" }).focus(),
      "focus resend",
    );
    const after = await sr.after(() => page.keyboard.press("Enter"));
    // 022q decision 5: NVDA says the address aloud.
    await sr.judge(
      L1(after, [
        `We sent a new code to ${EMAIL}`,
        "We sent a new code to ada at example dot com",
      ]),
    );
  },
);
