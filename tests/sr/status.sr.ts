/**
 * 022 decision 12: `status`, a polite live region, empty from the first
 * render. Announce sets its text: the reader says it whole (L1), and not
 * before (L2). The example holds two regions with the same text, hidden and
 * visible, so L3 is not applied here.
 */
import type { Page } from "@playwright/test";
import { declared, test } from "./fixtures.ts";
import { L1, L2 } from "./rules.ts";

const PATH = "/example/status/variants/";
const MESSAGE = "Copied to the clipboard";

const announce = (page: Page) =>
  page
    .getByTestId("keyboard-fixture")
    .getByRole("button", { name: "Announce" });

test(
  "Announce sets the region's text: it is spoken whole, and not before",
  declared("status", ["L1", "L2"]),
  async ({ page, sr }) => {
    await sr.open(PATH);
    // Focus the trigger outside any window: its name is not the message.
    await announce(page).focus();
    const before = await sr.before();
    const after = await sr.after(() => page.keyboard.press("Enter"));
    await sr.judge(L1(after, MESSAGE), L2(before, after, MESSAGE));
  },
);
