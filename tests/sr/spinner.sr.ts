/**
 * 022 decision 12: `spinner`. With a label it stands alone, and its label is
 * said from a status region. No page changes a labelled spinner's label
 * after load, so the test does: it empties the label (outside any window),
 * then sets it again as the action. The region is in the page throughout,
 * so its change is spoken whole (L1), and not before (L2). Test code only;
 * no site file changes.
 */
import type { Page } from "@playwright/test";
import { declared, test } from "./fixtures.ts";
import { L1, L2 } from "./rules.ts";

const PATH = "/example/spinner/variants/";
const LABEL = "Loading runs";

/** The labelled spinner's visually hidden label, inside its status region. */
const label = (page: Page) =>
  page.locator('span[data-slot="spinner"] .sr-only', { hasText: LABEL });

const setLabel = (page: Page, text: string) =>
  page.evaluate(
    ([t]) => {
      const el = [
        ...document.querySelectorAll('span[data-slot="spinner"] .sr-only'),
      ].find((e) => e.textContent === "" || e.textContent === "Loading runs");
      if (el) el.textContent = t!;
    },
    [text],
  );

test(
  "a labelled spinner's status region speaks its label when it changes, and not before",
  declared("spinner", ["L1", "L2"]),
  async ({ page, sr }) => {
    await sr.open(PATH);
    await label(page).waitFor({ state: "attached" });
    await setLabel(page, "");
    const before = await sr.before();
    const after = await sr.after(() => setLabel(page, LABEL));
    await sr.judge(L1(after, LABEL), L2(before, after, LABEL));
  },
);
