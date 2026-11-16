/**
 * 026 decision 20, step D2 (built at 022's merge, the review's finding 7):
 * `toast`, under a screen reader. Two announcers, rendered from the first
 * paint: the polite `toaster-status` (success, info, caution, neutral, the
 * promise's result) and the assertive `toaster-alert` (errors). F8 moves
 * focus into the region; Escape leaves it for the element that had focus.
 *
 * `hears` names the part each test judges, so the `toast-alert` mutation
 * expects exactly the tests that hear the assertive announcer (S2, S10).
 * A1, in `app-shell.sr.ts`, waits for 026's app-shell mount (D1).
 */
import type { Page } from "@playwright/test";
import { declared, test } from "./fixtures.ts";
import { B1, F1, L1, L2, L3, L4, U1 } from "./rules.ts";

/** The toast's parts a test may hear (026 decision 20). */
export const PARTS = ["assertive", "polite", "focus"];

const RAISE = "/example/toast/raise/";
const button = (page: Page, name: string) =>
  page.getByRole("button", { name, exact: true }).first();

/** Focus a control outside any window, so its name is not the message. */
async function ready(page: Page, name: string): Promise<void> {
  await button(page, name).focus();
}
const press = (page: Page) => page.keyboard.press("Enter");

test(
  "S1 polite: Save's success is spoken whole, once, and not before",
  declared("toast", ["L1", "L2", "L3"], ["toast:polite"]),
  async ({ page, sr }) => {
    await sr.open(RAISE);
    await ready(page, "Save");
    const before = await sr.before();
    const after = await sr.after(() => press(page));
    const message = "Success: Project saved";
    await sr.judge(
      L1(after, message),
      L2(before, after, message),
      L3(after, message),
    );
  },
);

test(
  "S2 assertive: the error is spoken whole",
  declared("toast", ["L1"], ["toast:assertive"]),
  async ({ page, sr }) => {
    await sr.open(RAISE);
    await ready(page, "Save with an error");
    const after = await sr.after(() => press(page));
    await sr.judge(L1(after, "Error: Couldn't save. Check your connection"));
  },
);

test(
  "S3 not the buttons: the action toast's words are spoken, and no Dismiss",
  declared("toast", ["L1", "U1"], ["toast:polite"]),
  async ({ page, sr }) => {
    await sr.open("/example/toast/action/");
    await ready(page, "Delete message");
    const after = await sr.after(() => press(page));
    await sr.judge(
      L1(
        after,
        "Message deleted. Press F8, or go to Notifications, to reach Undo",
      ),
      U1(after, "Dismiss"),
    );
  },
);

test(
  "S4 repeat: Save twice, 3 s apart, is spoken twice",
  declared("toast", ["L1", "L4"], ["toast:polite"]),
  async ({ page, sr }) => {
    await sr.open(RAISE);
    await ready(page, "Save");
    const message = "Success: Project saved";
    const first = await sr.after(() => press(page), "first");
    await ready(page, "Save");
    const second = await sr.after(() => press(page), "second");
    const l1 = L1(first, message);
    await sr.judge(l1, L4(second, message, l1.length === 0));
  },
);

test(
  "S5 F8: focus moves into the notifications, and Newest first is spoken",
  declared("toast", ["F1"], ["toast:focus"]),
  async ({ page, sr }) => {
    await sr.open("/example/toast/keyboard/");
    await ready(page, "Raise two");
    await sr.after(() => press(page), "raise");
    const after = await sr.after(() => page.keyboard.press("F8"), "f8");
    await sr.judge(F1(after, "Newest first"));
  },
);

test(
  "S6 Escape: F8, Tab, Escape twice returns to the trigger, which is spoken",
  declared("toast", ["F1"], ["toast:focus"]),
  async ({ page, sr }) => {
    await sr.open("/example/toast/keyboard/");
    await ready(page, "Raise two");
    await sr.after(() => press(page), "raise");
    await sr.after(async () => {
      await page.keyboard.press("F8");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Escape");
    }, "into");
    const after = await sr.after(() => page.keyboard.press("Escape"), "escape");
    await sr.focused(button(page, "Raise two"));
    await sr.judge(F1(after, "Raise two"));
  },
);

test(
  "S7 fast promise: Saving is never spoken, the result is",
  declared("toast", ["U1", "L1"], ["toast:polite"]),
  async ({ page, sr }) => {
    await sr.open("/example/toast/promise/");
    await ready(page, "Save quickly");
    const after = await sr.after(() => press(page));
    await sr.judge(U1(after, "Saving"), L1(after, "Success: Saved"));
  },
);

test(
  "S8 after the title: the next page's title comes before the toast",
  declared("toast", ["B1"], ["toast:polite"]),
  async ({ page, sr }) => {
    await sr.open("/example/toast/route/");
    await ready(page, "Create project");
    const after = await sr.after(() => press(page));
    const title = await page.title();
    await sr.judge(B1(after, title, "Success: Project created"));
  },
);

// `hears` holds `toast:polite` only: `alert-dialog` is no dependency of `toast`
// (022 decision 12), so 026's table entry for it is not kept.
test(
  "S9 a modal holds: focus returns to the trigger before the success",
  declared("toast", ["B1", "L1"], ["toast:polite"]),
  async ({ page, sr }) => {
    await sr.open("/example/toast/from-a-dialog/");
    await ready(page, "Delete project");
    await sr.after(async () => {
      await press(page);
      await page.getByRole("alertdialog").waitFor();
    }, "open");
    await page
      .getByRole("alertdialog")
      .getByRole("button", { name: "Delete project" })
      .focus();
    const after = await sr.after(() => press(page));
    const message = "Success: Project deleted";
    await sr.judge(B1(after, "Delete project", message), L1(after, message));
  },
);

test(
  "S10 both channels: the error and the success are each spoken whole",
  declared("toast", ["L1"], ["toast:assertive", "toast:polite"]),
  async ({ page, sr }) => {
    await sr.open(RAISE);
    await ready(page, "Save two records");
    const after = await sr.after(() => press(page));
    await sr.judge(
      L1(after, "Error: Couldn't save Record B"),
      L1(after, "Success: Record A saved"),
    );
  },
);
