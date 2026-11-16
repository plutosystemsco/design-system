/**
 * 022 decision 11: `sign-in`, by the kinds its parts bring. An empty submit
 * inserts the error summary, whose title and messages are spoken whole and
 * once (L1, L3); a summary link moves focus to its field (F1); a valid
 * submit's status says "Signing in…" (L1).
 *
 * The summary's tests hear `error-summary`, not `alert`: the summary passes
 * `role={null}` to `Alert` and sets its own inner `role="alert"`.
 */
import type { Page } from "@playwright/test";
import { declared, test } from "./fixtures.ts";
import { F1, L1, L3 } from "./rules.ts";

const PATH = "/view/sign-in/";
const TITLE = "There is a problem";
const ERRORS = ["Enter your email address", "Enter your password"];

const signIn = (page: Page) => page.getByRole("button", { name: "Sign in" });
const summary = (page: Page) => page.locator('[data-slot="error-summary"]');

test(
  "an empty submit: the summary's title and messages spoken whole, none twice in a row",
  declared("sign-in", ["L1", "L3"], ["error-summary"]),
  async ({ page, sr }) => {
    await sr.open(PATH);
    await sr.after(() => signIn(page).focus(), "focus");
    const after = await sr.after(() => page.keyboard.press("Enter"));
    await sr.judge(
      [TITLE, ...ERRORS].flatMap((m) => [...L1(after, m), ...L3(after, m)]),
    );
  },
);

test(
  "a summary link moves focus to its field, and the field's name is spoken",
  declared("sign-in", ["F1"], ["error-summary"]),
  async ({ page, sr }) => {
    await sr.open(PATH);
    await sr.after(() => signIn(page).focus(), "focus");
    await sr.after(() => page.keyboard.press("Enter"), "insertion");
    await summary(page).waitFor();
    await sr.after(
      () => summary(page).getByRole("link", { name: ERRORS[0] }).focus(),
      "link",
    );
    const after = await sr.after(() => page.keyboard.press("Enter"));
    await sr.focused(page.locator("#sign-in-email"));
    await sr.judge(F1(after, "Email address"));
  },
);

test(
  "a valid submit: the status says Signing in",
  declared("sign-in", ["L1"]),
  async ({ page, sr }) => {
    await sr.open(PATH);
    await page.locator("#sign-in-email").fill("ada@example.com");
    await page.locator("#sign-in-password").fill("correct horse battery");
    await sr.after(() => signIn(page).focus(), "focus");
    const after = await sr.after(() => page.keyboard.press("Enter"));
    await sr.judge(L1(after, "Signing in"));
  },
);
