/**
 * 022 decision 3: every browser test that runs in some engines or projects
 * only, as data. This file imports nothing, so `030`'s report code can read
 * it at any commit without loading Playwright.
 *
 * Each call of `onlyIn`, `notIn` or `onlyProjects` (`engines.ts`) has
 * exactly one entry here, with the same helper and arguments, a platform
 * included, and each entry has one call (`tests/unit/engine-only.test.ts`).
 *
 * `title` is the title path, below the file, of the test the call skips:
 * its describes and its title, joined by " › ". A call made in a `describe`
 * or at the top of a file covers every test under it; its `title` is that
 * describe's title path, or "" for the whole file.
 */

export type Engine = "chromium" | "firefox" | "webkit";

/** `process.platform` where a call applies only on one system (`022o`). */
export type Platform = "darwin" | "linux";

export type EngineOnly = {
  file: string;
  title: string;
  /** `adaptsIn` (022's review, finding 10): the test runs everywhere, and
   * checks less, or differently, in the named engine. */
  helper: "onlyIn" | "notIn" | "onlyProjects" | "adaptsIn";
  /** For `onlyIn`, `notIn` and `adaptsIn`: the engine the call names. */
  engine?: Engine;
  /** For `onlyIn` and `adaptsIn` only (`022o`): the call applies in the
   * engine on this platform alone. macOS WebKit and Linux WebKit keep
   * different defaults, such as whether a click focuses a button. */
  platform?: Platform;
  /** For `onlyProjects`: the projects the test runs in. */
  projects?: string[];
  /** What the skipped engines or projects lack, or do differently. */
  reason: string;
  /** `030` defines and reads these two. */
  gap?: string;
  shown?: string;
  /** A repository path to the ruling that allows the skip. */
  ruling?: string;
};

export const ENGINE_ONLY: EngineOnly[] = [
  {
    file: "brand.spec.ts",
    title:
      "criterion 9: the glass and its opaque fallbacks › under reduced transparency (emulated through CDP) the backdrop is none and the ground is the fallback",
    helper: "onlyIn",
    engine: "chromium",
    // Playwright 1.64.1's emulateMedia offers colorScheme, reducedMotion,
    // forcedColors and contrast, not reduced transparency.
    reason: "CDP: Emulation.setEmulatedMedia for prefers-reduced-transparency",
  },
  {
    file: "forced-colors.spec.ts",
    title: "",
    helper: "onlyProjects",
    projects: ["chromium-light", "firefox-light", "webkit-light"],
    reason: "light schemes only",
    // WebKit's draw assertions are carried by 028's `no-user` gap, on 028's
    // entries (022 decision 2).
    ruling: "context/specifications/022-the-test-matrix.md",
  },
  {
    file: "bar-glass.spec.ts",
    // The call is in the body of the blur tests the loop makes.
    title: "the bar's glass blurs what lies under it",
    helper: "onlyIn",
    engine: "chromium",
    reason:
      "screenshots: Playwright's Firefox and WebKit capture a page without compositing its backdrop filters",
  },
  // 022's review, finding 10: checks that run everywhere and check less in
  // one engine. Firefox's scrollbar-width is read from the author's rules
  // (`scrollbarWidth()` in pages.ts), not from the engine.
  ...(
    [
      [
        "chat.spec.ts",
        "L1. the message log › a region named Messages with a stop, holding a log named Conversation with aria-relevant additions; it opens at its end with the button hidden; scroll-padding-bottom is 96",
      ],
      [
        "code.spec.ts",
        "the code block › at 1280 › C3. the chrome: the pre's stop, scrollbar and overflow; the ring on the root, unclipped; the groove; 3 of 3 emphasised lines",
      ],
      [
        "code.spec.ts",
        "the code editor › E3. the theme from tokens: the ring on the editor, unclipped; 5 of 5 computed values; the keyword; 5 role readings, the role span innermost; .cm-content and its caret in --code-text; 12 rules of ours in the emitted sheet, 0 literals",
      ],
      // One call in the body of the rename dialog's test, at 360 and 1280.
      ["navigation.spec.ts", "N3. the dialog"],
      [
        "navigation.spec.ts",
        "N5. the sidebar › the first shell: a sticky nav 256 px wide on the sidebar ground, the trigger a disclosure that controls it, collapsed to 0 and inert on a press and restored on the next, the cookie written; the icon shell is 48 px",
      ],
      [
        "tokens.spec.ts",
        "tokens in the browser › scrollbar computes scrollbar-color holding --input and --muted, thin",
      ],
    ] as const
  ).map(([file, title]): EngineOnly => ({
    file,
    title,
    helper: "adaptsIn",
    engine: "firefox",
    reason:
      "scrollbar-width: Playwright's Firefox computes none for every element, so the value is read from the author's rules",
  })),
  ...(
    [
      "018 criterion 17: Colour › each role row shows 2 swatches of at least 56 px, in the token file's light and dark values, each with its value",
      "018 criterion 17: Colour › the 16 px chips on Tokens are swatches too: forced-color-adjust none and a 1 px border",
    ] as const
  ).map((title): EngineOnly => ({
    file: "specimens.spec.ts",
    title,
    helper: "adaptsIn",
    engine: "webkit",
    reason:
      "forced-color-adjust: WebKit has no forced-colours mode and no such property, so a swatch's none holds there vacuously",
    // 028 decides how 030 reads WebKit's forced-colours gap.
  })),
  {
    file: "blocks.spec.ts",
    // One call in the body of A2, at 360 and 1280.
    title: "the app shell",
    helper: "adaptsIn",
    engine: "webkit",
    reason:
      "pixels: WebKit blends the translucent hairline up to 2 steps a channel off Chromium's exact values",
  },
  // 022's merge with 027a, 026 and 021.
  {
    file: "progress.spec.ts",
    title: "027a: the progress bar › 48. the classes draw it in every engine",
    helper: "adaptsIn",
    engine: "webkit",
    // The bar's own colours are checked in WebKit; the forced half is not.
    reason: "forced colours: Playwright's WebKit does not emulate forcedColors",
  },
  {
    file: "toast.spec.ts",
    title:
      "026: forced colours › 68. forced colours draw the edge, and the icons differ",
    helper: "notIn",
    engine: "webkit",
    reason: "forced colours: Playwright's WebKit does not emulate forcedColors",
  },
  {
    file: "site.spec.ts",
    title:
      "018 criteria 12 to 14: the measure, one h3, smoothing › criterion 14: the body is antialiased on every page",
    helper: "adaptsIn",
    engine: "firefox",
    // Firefox reads the moz property, and expects its value, grayscale.
    reason:
      "font smoothing: Firefox reads -webkit-font-smoothing as its -moz-osx-font-smoothing alias",
  },
  {
    file: "tokens-files.spec.ts",
    title: "021 T17: an app without Tailwind gets the colours",
    helper: "onlyProjects",
    projects: ["chromium-light", "firefox-light", "webkit-light"],
    reason:
      "the page sets its own scheme, so each engine's light project covers it",
  },
  {
    file: "spacing.spec.ts",
    title: "the font's own letter spacing",
    helper: "onlyProjects",
    projects: ["chromium-light", "firefox-light", "webkit-light"],
    // 019a decision 1: spacing does not depend on the scheme.
    reason: "letter spacing is the same in both schemes",
  },
  {
    file: "tokens.spec.ts",
    title: "flat product screens in the light theme (011 criterion 4)",
    helper: "onlyProjects",
    projects: ["chromium-light", "firefox-light", "webkit-light"],
    // 011 criterion 4 is stated for the light theme.
    reason: "light theme only",
  },
  // 027b: pagination, search field and tag.
  {
    file: "pagination.spec.ts",
    title:
      "027b: pagination › 15a. focus stays on a pressed page across range changes, by click",
    helper: "adaptsIn",
    engine: "webkit",
    // 027's re-review, R2: macOS WebKit focuses no button on click. 022o:
    // Linux WebKit does, as Chromium does, so it takes Chromium's check.
    platform: "darwin",
    reason:
      "focus on click: macOS WebKit does not focus a button on click, so the item moves no focus",
  },
  {
    file: "pagination.spec.ts",
    title: "027b: pagination › 24. forced colours keep the current page",
    helper: "notIn",
    engine: "webkit",
    reason: "forced colours: Playwright's WebKit does not emulate forcedColors",
  },
  {
    file: "search-field.spec.ts",
    title: "027b: the search field › 28. WebKit's cancel button is hidden",
    helper: "notIn",
    engine: "firefox",
    reason:
      "::-webkit-search-cancel-button: Firefox draws no cancel button on a search input",
  },
  {
    file: "tag.spec.ts",
    title:
      "027b: the tag › 40. a pressable tag keeps its check under forced colours",
    helper: "notIn",
    engine: "webkit",
    reason: "forced colours: Playwright's WebKit does not emulate forcedColors",
  },
  {
    file: "error-summary.spec.ts",
    title:
      "019b: the error summary's messages are read once › 3. in Chromium's tree, each link's nearest ancestor that is not ignored is the alert",
    helper: "onlyIn",
    engine: "chromium",
    // 019b criterion 3: the engine's own tree, which a reader reads. Firefox
    // and WebKit offer no CDP; Playwright's snapshot drops ignored nodes
    // and generic wrappers alike, so it cannot tell a wrapper apart.
    reason: "CDP: Accessibility.getFullAXTree",
    ruling:
      "context/specifications/019b-the-error-summarys-messages-are-read-once.md",
  },
];
