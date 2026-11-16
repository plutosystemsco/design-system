/**
 * 022 decision 11: `settings`, by the kinds its parts bring. A save with an
 * empty name inserts the error summary, spoken whole and once (L1, L3); its
 * link moves focus to Name (F1); a save says "Saved" (L1); the delete
 * confirm is an alert dialog, named on opening (O1), modal (O2), and
 * Escape returns to its trigger (O3).
 *
 * The summary's tests hear `error-summary`, not `alert` (decision 15). The
 * confirm's tests hear `alert-dialog`, which renders it.
 */
import type { Page } from "@playwright/test";
import { declared, test } from "./fixtures.ts";
import { F1, L1, L3, O1, O2, O3 } from "./rules.ts";

const PATH = "/view/settings/";
const TITLE = "There is a problem";
const ERROR = "Enter your name";
const CONFIRM = "Delete your account?";

const save = (page: Page) => page.getByRole("button", { name: "Save changes" });
const summary = (page: Page) => page.locator('[data-slot="error-summary"]');
/** The page's own Delete account button, outside the dialog. */
const trigger = (page: Page) =>
  page
    .locator('[data-slot="settings-delete"]')
    .getByRole("button", { name: "Delete account" });

async function emptyName(page: Page, sr: import("./fixtures.ts").Sr) {
  await page.locator("#settings-name").fill("");
  await sr.after(() => save(page).focus(), "focus");
}

async function openConfirm(page: Page, sr: import("./fixtures.ts").Sr) {
  await sr.after(() => trigger(page).focus(), "focus");
}

const pressToOpen = async (page: Page) => {
  await page.keyboard.press("Enter");
  await page.getByRole("alertdialog").waitFor();
};

test(
  "a save with an empty name: the summary's title and message spoken whole, none twice in a row",
  declared("settings", ["L1", "L3"], ["error-summary"]),
  async ({ page, sr }) => {
    await sr.open(PATH);
    await emptyName(page, sr);
    const after = await sr.after(() => page.keyboard.press("Enter"));
    await sr.judge(
      [TITLE, ERROR].flatMap((m) => [...L1(after, m), ...L3(after, m)]),
    );
  },
);

test(
  "the summary's link moves focus to Name, and Name is spoken",
  declared("settings", ["F1"], ["error-summary"]),
  async ({ page, sr }) => {
    await sr.open(PATH);
    await emptyName(page, sr);
    await sr.after(() => page.keyboard.press("Enter"), "insertion");
    await summary(page).waitFor();
    await sr.after(
      () => summary(page).getByRole("link", { name: ERROR }).focus(),
      "link",
    );
    const after = await sr.after(() => page.keyboard.press("Enter"));
    await sr.focused(page.locator("#settings-name"));
    await sr.judge(F1(after, "Name"));
  },
);

test(
  "a save says Saved",
  declared("settings", ["L1"]),
  async ({ page, sr }) => {
    await sr.open(PATH);
    await page.locator("#settings-name").fill("Ada Byron");
    await sr.after(() => save(page).focus(), "focus");
    const after = await sr.after(() => page.keyboard.press("Enter"));
    await sr.judge(L1(after, "Saved"));
  },
);

test(
  "the delete confirm: opening speaks its title",
  declared("settings", ["O1"], ["alert-dialog"]),
  async ({ page, sr }) => {
    await sr.open(PATH);
    await openConfirm(page, sr);
    const after = await sr.after(() => pressToOpen(page));
    await sr.judge(O1(after, CONFIRM));
  },
);

test(
  "the delete confirm: the page behind is never reached in ten steps",
  declared("settings", ["O2"], ["alert-dialog"]),
  async ({ page, sr }) => {
    await sr.open(PATH);
    const sentinel = await sr.sentinel();
    await openConfirm(page, sr);
    await sr.after(() => pressToOpen(page), "open");
    const steps = await sr.steps(10);
    await sr.judge(O2(steps, sentinel, CONFIRM));
  },
);

test(
  "the delete confirm: Escape closes it; Delete account is spoken and has focus",
  declared("settings", ["O3"], ["alert-dialog"]),
  async ({ page, sr }) => {
    await sr.open(PATH);
    await openConfirm(page, sr);
    await sr.after(() => pressToOpen(page), "open");
    const after = await sr.after(() => page.keyboard.press("Escape"), "escape");
    await sr.judge(
      O3(after, "Delete account", await sr.focused(trigger(page))),
    );
  },
);
