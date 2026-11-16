/**
 * 019 decision 12, moved here by 022 decision 13: what the reader says when
 * the error summary appears, on the second submit, and when each of its
 * links is followed. The pass rule, in 022's rules: the title and every
 * message are spoken whole (L1), and none is read twice in a row (L3), on
 * the insertion and on the second submit; each link's field is spoken (F1).
 * A dry run checks the second submit's mechanism (022t decision 11): the old
 * content node is gone, and the root is focused.
 *
 * `hears` omits `alert`: the summary passes `role={null}` to `Alert` and
 * sets its own inner `role="alert"`, so a change to alert's role map does
 * not reach it (022 decision 15).
 */
import { declared, test } from "./fixtures.ts";
import { L1, L2, L3, F1 } from "./rules.ts";

const PATH = "/example/error-summary/keyboard/";
const TITLE = "There is a problem";
const ERRORS = [
  "Enter a project name",
  "Enter the owner's email address",
  "Choose who can see the project",
];
const LINKS = [
  { text: ERRORS[0]!, field: "Project name" },
  { text: ERRORS[1]!, field: "Owner email" },
  { text: ERRORS[2]!, field: "Only me" },
];

const fixture = (page: import("@playwright/test").Page) =>
  page.getByTestId("keyboard-fixture");

/** Focus the submit button, outside any window: its name is not the message. */
const ready = (page: import("@playwright/test").Page) =>
  fixture(page).getByRole("button", { name: "Create project" }).focus();

/** Submit, from the focused button. */
const submit = (page: import("@playwright/test").Page) =>
  page.keyboard.press("Enter");

/** L1 and L3 for the title and each message, in one window. */
const whole = (after: string[]) =>
  [TITLE, ...ERRORS].flatMap((m) => [...L1(after, m), ...L3(after, m)]);

test(
  "the insertion: the title and every message spoken whole, none twice in a row, none before",
  declared("error-summary", ["L1", "L2", "L3"]),
  async ({ page, sr }) => {
    await sr.open(PATH);
    await ready(page);
    const before = await sr.before();
    const after = await sr.after(() => submit(page));
    await sr.judge(whole(after), L2(before, after, TITLE));
  },
);

test(
  "the second submit, unchanged: spoken whole again, none twice in a row",
  declared("error-summary", ["L1", "L3"]),
  async ({ page, sr }) => {
    await sr.open(PATH);
    await ready(page);
    await sr.after(() => submit(page), "first");
    await ready(page);
    // 022t decision 11: the example raises `attempt`, so the second submit
    // renders the content anew, and focus lands on the root that stays.
    const old = await fixture(page)
      .locator('[data-slot="error-summary-content"]')
      .elementHandle();
    const after = await sr.after(() => submit(page), "second");
    sr.fact(
      "the old content node is disconnected",
      !(await old!.evaluate((n) => n.isConnected)),
    );
    await sr.focused(fixture(page).locator('[data-slot="error-summary"]'));
    await sr.judge(whole(after));
  },
);

test(
  "each link moves focus to its field, and the field's name is spoken",
  declared("error-summary", ["F1"]),
  async ({ page, sr }) => {
    await sr.open(PATH);
    await ready(page);
    await sr.after(() => submit(page), "insertion");
    const summary = fixture(page).locator('[data-slot="error-summary"]');
    const faults = [];
    for (const link of LINKS) {
      await summary.getByRole("link", { name: link.text }).focus();
      const after = await sr.after(
        () => page.keyboard.press("Enter"),
        `link: ${link.text}`,
      );
      faults.push(...F1(after, link.field));
    }
    await sr.judge(faults);
  },
);
