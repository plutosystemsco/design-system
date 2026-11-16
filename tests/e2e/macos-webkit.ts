/**
 * 022's review, finding 4: every browser test that failed in macOS WebKit
 * (Playwright's build, 2026-11-15) for the platform's defaults, not for
 * Kuiper. It is data alone, and `tests/unit/macos-webkit.test.ts` keeps
 * each title in step with the listing.
 *
 * - `tab-to-links`: Tab skips links unless Safari's "Press Tab to highlight
 *   each item" is on. `tests/test.ts` presses Alt+Tab there, which reaches
 *   links, so these now run on macOS too.
 * - `click-focus`: a click does not focus a button. Each test now presses
 *   the control by keyboard (`activate()` in pages.ts) where focus is the
 *   point, or checks focus before the clicks.
 *
 * None is ledgered: CI runs Linux WebKit, which keeps neither default. After
 * push B, every test here must have passed on Linux; one that did not is a
 * fault, with a ledger line and a small change.
 */

export type MacosWebkit = {
  file: string;
  title: string;
  cause: "tab-to-links" | "click-focus";
};

export const MACOS_WEBKIT: MacosWebkit[] = [
  {
    file: "blocks.spec.ts",
    title:
      "settings › 16. Delete account confirms on Keep my account, Escape returns focus, and confirming says so",
    cause: "click-focus",
  },
  {
    file: "blocks.spec.ts",
    title:
      "the app shell › A1b. with a sidebar at 1280: the header is sticky (z-20), the sidebar starts 64 px down with 64 px of padding at its foot, the account row ends at or above the viewport's bottom at load, and both hold after a 400 px scroll",
    cause: "tab-to-links",
  },
  {
    file: "blocks.spec.ts",
    title:
      "the app shell › A1b. with a sidebar at 768: the header is sticky (z-20), the sidebar starts 64 px down with 64 px of padding at its foot, the account row ends at or above the viewport's bottom at load, and both hold after a 400 px scroll",
    cause: "tab-to-links",
  },
  {
    file: "code.spec.ts",
    title:
      "the ink surface › S1. the surface's grounds, its overlays' placement and theme",
    cause: "click-focus",
  },
  {
    file: "compositions.spec.ts",
    title:
      '5. the stage card › Run sets data-busy on the card and aria-busy on its output, then shows 2 lines and says "Ran. 2 lines."; a second run says it again',
    cause: "click-focus",
  },
  {
    file: "compositions.spec.ts",
    title:
      "9. the keyboard walk › at 1440: 20 stops in DOM order from the skip link, each ringed and clear of the bar, forward and back",
    cause: "tab-to-links",
  },
  {
    file: "compositions.spec.ts",
    title:
      "9. the keyboard walk › at 320: 18 stops in DOM order from the skip link, each ringed and clear of the bar, forward and back",
    cause: "tab-to-links",
  },
  {
    file: "compositions.spec.ts",
    title:
      "9. the keyboard walk › Enter on the skip link focuses main#main, whose first content sits below the bar",
    cause: "tab-to-links",
  },
  {
    file: "doors.spec.ts",
    title:
      "015 criterion 10: the doors, against the Google echo › a focused disc's outline is the theme's --surface-ring, 3:1 or more on the canvas",
    cause: "tab-to-links",
  },
  {
    file: "frames.spec.ts",
    title: "alert: the framed alert takes the other theme's card",
    cause: "click-focus",
  },
  {
    file: "frames.spec.ts",
    title:
      "alert: the other theme in a frame, held through the page's toggle and a system flip, and back inline",
    cause: "click-focus",
  },
  {
    file: "frames.spec.ts",
    title:
      "button: the other theme in a frame, held through the page's toggle and a system flip, and back inline",
    cause: "click-focus",
  },
  {
    file: "frames.spec.ts",
    title:
      "chart: the other theme in a frame, held through the page's toggle and a system flip, and back inline",
    cause: "click-focus",
  },
  {
    file: "frames.spec.ts",
    title:
      "code-block: the other theme in a frame, held through the page's toggle and a system flip, and back inline",
    cause: "click-focus",
  },
  {
    file: "frames.spec.ts",
    title:
      "dropdown-menu: the open menu in a frame takes the frame's theme and stays inside it",
    cause: "click-focus",
  },
  {
    file: "frames.spec.ts",
    title:
      "dropdown-menu: the other theme in a frame, held through the page's toggle and a system flip, and back inline",
    cause: "click-focus",
  },
  {
    file: "frames.spec.ts",
    title: "four-dot: the framed marks are the four in light and paper in dark",
    cause: "click-focus",
  },
  {
    file: "frames.spec.ts",
    title:
      "four-dot: the other theme in a frame, held through the page's toggle and a system flip, and back inline",
    cause: "click-focus",
  },
  {
    file: "keyboard.spec.ts",
    title:
      "017: the downloads by keyboard › criterion 4: Tab reaches the 6 download links in order",
    cause: "tab-to-links",
  },
  {
    file: "keyboard.spec.ts",
    title:
      "at 1280 × 900 › /changelog/: the bar's 8 stops come first, in order, each with the ring",
    cause: "tab-to-links",
  },
  {
    file: "keyboard.spec.ts",
    title:
      "at 1280 × 900 › /components/button/: the bar's 8 stops come first, in order, each with the ring",
    cause: "tab-to-links",
  },
  {
    file: "keyboard.spec.ts",
    title:
      "at 1280 × 900 › /start/: the bar's 8 stops come first, in order, each with the ring",
    cause: "tab-to-links",
  },
  {
    file: "keyboard.spec.ts",
    title:
      "at 1280 × 900 › the Components landing: Tab visits its 193 stops in order, each with the ring unclipped",
    cause: "tab-to-links",
  },
  {
    file: "keyboard.spec.ts",
    title:
      "at 1280 × 900 › the home page: Tab visits its 86 stops in order, each with the ring unclipped",
    cause: "tab-to-links",
  },
  {
    file: "keyboard.spec.ts",
    title:
      "behaviours › Enter on Create project inserts the error summary and focuses it; Enter on its first link focuses the field",
    cause: "tab-to-links",
  },
  {
    file: "keyboard.spec.ts",
    title:
      "behaviours › Enter on the sheet trigger opens it with focus on its first link; Tab loops through the close button back to the first link",
    cause: "tab-to-links",
  },
  {
    file: "keyboard.spec.ts",
    title:
      "behaviours › the busy button ignores Enter and clicks, keeps focus and aria-busy",
    cause: "click-focus",
  },
  {
    file: "keyboard.spec.ts",
    title:
      "block views at 1280 › /view/app-shell/: 7 stops in order, each with the ring, then out of the document",
    cause: "tab-to-links",
  },
  {
    file: "keyboard.spec.ts",
    title:
      "block views at 1280 › /view/app-shell/endorsed/: 8 stops in order, each with the ring, then out of the document",
    cause: "tab-to-links",
  },
  {
    file: "keyboard.spec.ts",
    title:
      "block views at 1280 › /view/app-shell/lockup/: 8 stops in order, each with the ring, then out of the document",
    cause: "tab-to-links",
  },
  {
    file: "keyboard.spec.ts",
    title:
      "block views at 1280 › /view/app-shell/sidebar-icon/: 12 stops in order, each with the ring, then out of the document",
    cause: "tab-to-links",
  },
  {
    file: "keyboard.spec.ts",
    title:
      "block views at 1280 › /view/app-shell/sidebar/: 13 stops in order, each with the ring, then out of the document",
    cause: "tab-to-links",
  },
  {
    file: "keyboard.spec.ts",
    title:
      "block views at 1280 › /view/app-shell/signed-in/: 9 stops in order, each with the ring, then out of the document",
    cause: "tab-to-links",
  },
  {
    file: "keyboard.spec.ts",
    title:
      "block views at 1280 › /view/hero/: 2 stops in order, each with the ring, then out of the document",
    cause: "tab-to-links",
  },
  {
    file: "keyboard.spec.ts",
    title:
      "block views at 1280 › /view/page-states/cannot-show/: 1 stops in order, each with the ring, then out of the document",
    cause: "tab-to-links",
  },
  {
    file: "keyboard.spec.ts",
    title:
      "block views at 1280 › /view/page-states/error/: 3 stops in order, each with the ring, then out of the document",
    cause: "tab-to-links",
  },
  {
    file: "keyboard.spec.ts",
    title:
      "block views at 1280 › /view/page-states/not-found/: 1 stops in order, each with the ring, then out of the document",
    cause: "tab-to-links",
  },
  {
    file: "keyboard.spec.ts",
    title:
      "block views at 1280 › /view/product-home/: 20 stops in order, each with the ring, then out of the document",
    cause: "tab-to-links",
  },
  {
    file: "keyboard.spec.ts",
    title:
      "block views at 1280 › /view/settings/errors/: 11 stops in order, each with the ring, then out of the document",
    cause: "tab-to-links",
  },
  {
    file: "keyboard.spec.ts",
    title:
      "block views at 1280 › /view/sign-in/credentials/: 5 stops in order, each with the ring, then out of the document",
    cause: "tab-to-links",
  },
  {
    file: "keyboard.spec.ts",
    title:
      "block views at 1280 › /view/sign-in/errors/: 6 stops in order, each with the ring, then out of the document",
    cause: "tab-to-links",
  },
  {
    file: "keyboard.spec.ts",
    title:
      "block views at 1280 › /view/sign-up/code-error/: 5 stops in order, each with the ring, then out of the document",
    cause: "tab-to-links",
  },
  {
    file: "keyboard.spec.ts",
    title:
      "block views at 1280 › /view/sign-up/errors/: 8 stops in order, each with the ring, then out of the document",
    cause: "tab-to-links",
  },
  {
    file: "keyboard.spec.ts",
    title:
      "on the four-dot page, Tab reaches the lockup link, with the same outline",
    cause: "tab-to-links",
  },
  {
    file: "keyboard.spec.ts",
    title:
      "sidebar: the keyboard fixture holds 3 stops, each the expected element with the ring",
    cause: "tab-to-links",
  },
  {
    file: "keyboard.spec.ts",
    title: "the shell › 1. Enter on the skip link focuses main#main",
    cause: "tab-to-links",
  },
  {
    file: "keyboard.spec.ts",
    title:
      "viewer toolbars › app-shell: 11 toolbar stops in order, each with the ring",
    cause: "tab-to-links",
  },
  {
    file: "keyboard.spec.ts",
    title:
      "viewer toolbars › chat: 11 toolbar stops in order, each with the ring",
    cause: "tab-to-links",
  },
  {
    file: "keyboard.spec.ts",
    title:
      "viewer toolbars › hero: 5 toolbar stops in order, each with the ring",
    cause: "tab-to-links",
  },
  {
    file: "keyboard.spec.ts",
    title:
      "viewer toolbars › page-states: 10 toolbar stops in order, each with the ring",
    cause: "tab-to-links",
  },
  {
    file: "keyboard.spec.ts",
    title:
      "viewer toolbars › product-home: 5 toolbar stops in order, each with the ring",
    cause: "tab-to-links",
  },
  {
    file: "keyboard.spec.ts",
    title:
      "viewer toolbars › settings: 9 toolbar stops in order, each with the ring",
    cause: "tab-to-links",
  },
  {
    file: "keyboard.spec.ts",
    title:
      "viewer toolbars › sign-in: 9 toolbar stops in order, each with the ring",
    cause: "tab-to-links",
  },
  {
    file: "keyboard.spec.ts",
    title:
      "viewer toolbars › sign-up: 9 toolbar stops in order, each with the ring",
    cause: "tab-to-links",
  },
  {
    file: "navigation.spec.ts",
    title:
      "N2. the sheet › open: a modal dialog named by its title, 288 px wide at most the viewport, on the scrim with no blur and the elevation, the close button 32 px and last; the fade holds the node, then it is gone",
    cause: "click-focus",
  },
  {
    file: "navigation.spec.ts",
    title:
      "N3. the dialog › at 1280 › the rename dialog: a modal named by its title, centred, 16 px from the edges at most 448 px wide, on the scrim and the elevation, rounded, the close button last; the long one scrolls inside",
    cause: "click-focus",
  },
  {
    file: "navigation.spec.ts",
    title:
      "N3. the dialog › at 360 › the rename dialog: a modal named by its title, centred, 16 px from the edges at most 448 px wide, on the scrim and the elevation, rounded, the close button last; the long one scrolls inside",
    cause: "click-focus",
  },
  {
    file: "on-brand.spec.ts",
    title:
      "4. the bar › a link focused below it is not hidden under it (WCAG 2.4.11)",
    cause: "tab-to-links",
  },
];
