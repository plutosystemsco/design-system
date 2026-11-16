/**
 * 022 decision 12: `code-editor`. Its `focus()` moves focus into the editor:
 * CodeMirror's `view.focus()` focuses its content element. No page calls it,
 * so the test does what it does, from the "Before" button: the content is
 * focused, and the editor's name is spoken (F1).
 */
import type { Page } from "@playwright/test";
import { declared, test } from "./fixtures.ts";
import { F1 } from "./rules.ts";

const PATH = "/example/code-editor/keyboard/";
const NAME = "Keyboard example";

const content = (page: Page) =>
  page
    .getByTestId("keyboard-fixture")
    .locator('[data-slot="code-editor"] .cm-content');

test(
  "focus moves into the editor, and its name is spoken",
  declared("code-editor", ["F1"]),
  async ({ page, sr }) => {
    await sr.open(PATH);
    await content(page).waitFor();
    await page
      .getByTestId("keyboard-fixture")
      .getByRole("button", { name: "Before" })
      .focus();
    const after = await sr.after(() =>
      content(page).evaluate((el) => (el as HTMLElement).focus()),
    );
    await sr.focused(content(page));
    await sr.judge(F1(after, NAME));
  },
);
