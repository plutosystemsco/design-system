/**
 * 022 decision 3: every browser test that runs in some engines or projects
 * only, as data. This file imports nothing, so `030`'s report code can read
 * it at any commit without loading Playwright.
 *
 * Each call of `onlyIn`, `notIn` or `onlyProjects` (`engines.ts`) has
 * exactly one entry here, with the same helper and arguments, and each
 * entry has one call (`tests/unit/engine-only.test.ts`).
 *
 * `title` is the title path, below the file, of the test the call skips:
 * its describes and its title, joined by " › ". A call made in a `describe`
 * or at the top of a file covers every test under it; its `title` is that
 * describe's title path, or "" for the whole file.
 */

export type Engine = "chromium" | "firefox" | "webkit";

export type EngineOnly = {
  file: string;
  title: string;
  helper: "onlyIn" | "notIn" | "onlyProjects";
  /** For `onlyIn` and `notIn`: the engine the call names. */
  engine?: Engine;
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
  // Six tests that read what the page wrote to the clipboard. Writing needs
  // no grant in Firefox, so the copy tests that only check the status still
  // run there (tests/e2e/pages.ts, `clipboard`).
  ...(
    [
      [
        "code.spec.ts",
        "the code block › with the clipboard granted › C4. the copy button: its name and size; Enter writes the code, says Copied, and resets after 2 s",
      ],
      [
        "keyboard.spec.ts",
        "017: the token page by keyboard › criterion 4: Tab reaches the first 3 copy buttons in order, and Enter on the first says Copied",
      ],
      [
        "nav.spec.ts",
        "018 criterion 10: page tools, previous and next › on Button, Copy page puts the twin's text on the clipboard and says Copied",
      ],
      [
        "nav.spec.ts",
        "018 criterion 10: page tools, previous and next › with the twin's request delayed by 1 s, it copies through one ClipboardItem written inside the click",
      ],
      [
        "search.spec.ts",
        "018 decision 8, criterion 11: search that finds what was meant › with the clipboard granted › with Button active and nothing selected, Command-C (Control-C) copies its add command and says so",
      ],
      [
        "search.spec.ts",
        "018 decision 8, criterion 11: search that finds what was meant › with the clipboard granted › with text selected, it copies the text",
      ],
    ] as const
  ).map(([file, title]): EngineOnly => ({
    file,
    title,
    helper: "notIn",
    engine: "firefox",
    reason:
      "clipboard: Playwright's Firefox has no clipboard-read permission, so a page cannot read what it wrote",
  })),
  {
    file: "bar-glass.spec.ts",
    // The call is in the body of the blur tests the loop makes.
    title: "the bar's glass blurs what lies under it",
    helper: "onlyIn",
    engine: "chromium",
    reason:
      "screenshots: Playwright's Firefox and WebKit capture a page without compositing its backdrop filters",
  },
  {
    file: "primitives.spec.ts",
    // The call is in the body of the three paste tests the loop makes.
    title: "the code input",
    helper: "notIn",
    engine: "firefox",
    // Firefox's DataTransfer is protected for an untrusted event: getData
    // returns "" to the page. A real paste needs clipboard-read.
    reason:
      "synthetic paste: Firefox keeps an untrusted paste event's DataTransfer empty, and Playwright's Firefox has no clipboard permission for a real one",
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
];
