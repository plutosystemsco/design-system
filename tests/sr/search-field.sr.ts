/**
 * 027 decision 11: `search-field`, under a screen reader. Its hidden status
 * speaks the result count once typing pauses (750 ms) and the count is for
 * what is typed now; Clear empties the field and returns focus to the
 * input, whose name is spoken.
 *
 * S4 uses `026`'s `unspoken` rule (U1): the late server example must never
 * speak an older query's count.
 */
import type { Page } from "@playwright/test";
import { declared, test } from "./fixtures.ts";
import { F1, L1, L2, L3, U1 } from "./rules.ts";

/** The search field's parts a test may hear (027 decision 11). */
export const PARTS = ["status", "input"];

const FILTER = "/example/search-field/filter/";
const box = (page: Page) =>
  page.getByRole("searchbox", { name: "Search projects", exact: true });

test(
  "S1 the count: typing des speaks 3 results after the pause, once, and not before",
  declared("search-field", ["L1", "L2", "L3"], ["search-field:status"]),
  async ({ page, sr }) => {
    await sr.open(FILTER);
    await box(page).focus();
    const before = await sr.before();
    const after = await sr.after(() => page.keyboard.type("des"));
    const message = "3 results";
    await sr.judge(
      L1(after, message),
      L2(before, after, message),
      L3(after, message),
    );
  },
);

test(
  "S2 the count again: one more letter with the same count is spoken again",
  declared("search-field", ["L1"], ["search-field:status"]),
  async ({ page, sr }) => {
    await sr.open(FILTER);
    await box(page).focus();
    await sr.after(() => page.keyboard.type("des"), "first");
    const second = await sr.after(() => page.keyboard.type("i"), "second");
    await sr.judge(L1(second, "3 results"));
  },
);

test(
  "S3 Clear: focus returns to the input, whose name is spoken",
  declared("search-field", ["F1"], ["search-field:input"]),
  async ({ page, sr }) => {
    await sr.open(FILTER);
    await box(page).focus();
    await sr.after(() => page.keyboard.type("des"), "type");
    await page.getByRole("button", { name: "Clear search" }).focus();
    const after = await sr.after(() => page.keyboard.press("Enter"));
    await sr.focused(box(page));
    await sr.judge(F1(after, "Search projects"));
  },
);

test(
  "S4 the late count: the server's count is spoken when it arrives, and no older count",
  declared("search-field", ["L1", "U1"], ["search-field:status"]),
  async ({ page, sr }) => {
    await sr.open("/example/search-field/from-a-server/");
    await box(page).focus();
    const after = await sr.after(() => page.keyboard.type("des"));
    await sr.judge(L1(after, "3 results"), U1(after, "12 results"));
  },
);
