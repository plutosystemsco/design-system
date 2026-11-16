/**
 * 022 decision 16: the one `test` and `expect` every browser spec imports.
 * It is Playwright's, with the fault ledger's automatic fixture, so a known
 * fault keeps the run green while a new one in the same test turns it red.
 */
import { expect, test as base } from "@playwright/test";
import { ledgerFixture } from "./ledger.ts";

/**
 * 022's review, finding 4: macOS WebKit keeps the platform's default that
 * Tab skips links (Safari's "Press Tab to highlight each item" is off), so
 * every walk that meets a link fails there and nowhere else. Holding Alt
 * flips that default, so on macOS WebKit this fixture presses Alt+Tab where
 * a test presses Tab. Linux WebKit (CI's) and the other engines are
 * untouched, and no macOS setting changes.
 */
const TAB_TO_LINKS = process.platform === "darwin";

export const test = base.extend<{ ledger: void }>({
  ledger: ledgerFixture((info) => ({ project: info.project.name })),
  page: async ({ page, browserName }, use) => {
    if (TAB_TO_LINKS && browserName === "webkit") {
      const keyboard = page.keyboard;
      const press = keyboard.press.bind(keyboard);
      keyboard.press = (key, options) =>
        press(
          key === "Tab"
            ? "Alt+Tab"
            : key === "Shift+Tab"
              ? "Alt+Shift+Tab"
              : key,
          options,
        );
    }
    await use(page);
  },
});

export { expect };
