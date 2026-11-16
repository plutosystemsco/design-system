/**
 * 027 decision 11: `tag`, under a screen reader. After a tag is removed,
 * the group moves focus to the next tag control, then the previous, then
 * its fallback, then the list itself, and the reader speaks where focus
 * lands.
 *
 * `hears` names the group, so the `tag-focus` mutation expects T1 to T3.
 */
import type { Page } from "@playwright/test";
import { declared, test } from "./fixtures.ts";
import { F1 } from "./rules.ts";

/** The tag's parts a test may hear (027 decision 11). */
export const PARTS = ["group"];

const REMOVABLE = "/example/tag/removable/";
const remove = (page: Page, label: string) =>
  page.getByRole("button", { name: `Remove ${label}`, exact: true });

/** Removes a tag by Enter on its remove button. */
async function removeTag(page: Page, label: string): Promise<void> {
  await remove(page, label).focus();
  await page.keyboard.press("Enter");
}

test(
  "T1 the next: removing the first tag speaks the next tag's remove button",
  declared("tag", ["F1"], ["tag:group"]),
  async ({ page, sr }) => {
    await sr.open(REMOVABLE);
    await remove(page, "Design").focus();
    const after = await sr.after(() => page.keyboard.press("Enter"));
    await sr.focused(remove(page, "Research"));
    await sr.judge(F1(after, "Remove Research"));
  },
);

test(
  "T2 the previous: removing the last tag speaks the new last tag's remove button",
  declared("tag", ["F1"], ["tag:group"]),
  async ({ page, sr }) => {
    await sr.open(REMOVABLE);
    await remove(page, "Writing").focus();
    const after = await sr.after(() => page.keyboard.press("Enter"));
    await sr.focused(remove(page, "Research"));
    await sr.judge(F1(after, "Remove Research"));
  },
);

test(
  "T3 the list: removing every tag speaks the list's name",
  declared("tag", ["F1"], ["tag:group"]),
  async ({ page, sr }) => {
    await sr.open(REMOVABLE);
    await removeTag(page, "Design");
    await removeTag(page, "Research");
    await remove(page, "Writing").focus();
    const after = await sr.after(() => page.keyboard.press("Enter"));
    await sr.focused(page.getByRole("list", { name: "Filters", exact: true }));
    await sr.judge(F1(after, "Filters"));
  },
);
