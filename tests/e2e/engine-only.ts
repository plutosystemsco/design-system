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
