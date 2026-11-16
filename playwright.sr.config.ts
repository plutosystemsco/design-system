import { withGuidepup } from "@guidepup/playwright";
import { defineConfig, devices } from "@playwright/test";
import { reader } from "./tests/sr/reader.ts";
import { BASE_URL, server } from "./tests/server.ts";

/**
 * 022 decision 10: the screen-reader suite. guidepup's `withGuidepup` makes
 * it serial and headed: one reader, one test at a time. The workflow picks
 * two browser projects per reader (VoiceOver: WebKit and Chromium; NVDA:
 * Chromium and Firefox).
 *
 * The reader is a config-level tag, `@reader-voiceover` or `@reader-nvda`,
 * so every record in the merged report names its reader beside its
 * `projectName` (the browser). In CI the job must say which reader it runs
 * (`tests/sr/reader.ts`).
 *
 * `SR_DRY=1`, local only, drives every step with no reader: phrases are
 * empty and nothing is judged. It proves a test's pages, locators and
 * actions, and nothing about speech.
 */
const CI = !!process.env.CI;

const VIEWPORT = { width: 1440, height: 900 };

const DRY = !CI && !!process.env.SR_DRY;
/** A dry run is headless: no reader listens. */
const dry = <T extends { use?: object }>(p: T): T =>
  DRY ? { ...p, use: { ...p.use, headless: true } } : p;

const config = withGuidepup({
  testDir: "tests/sr",
  // The suffix keeps Bun's own test runner from collecting these files.
  testMatch: /\.sr\.ts$/,
  tag: `@reader-${reader()}`,
  timeout: 5 * 60_000,
  // 022 decision 18: speech timing on shared runners. A retried pass is
  // listed as flaky; on a release run it is ledgered (Q2).
  retries: CI ? 2 : 0,
  reporter: CI ? [["blob"], ["dot"]] : "list",
  webServer: server(),
  use: { baseURL: BASE_URL, viewport: VIEWPORT },
  projects: [
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"], viewport: VIEWPORT },
    },
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], viewport: VIEWPORT },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"], viewport: VIEWPORT },
    },
  ],
});

export default defineConfig({
  ...dry(config),
  projects: config.projects?.map(dry),
});
