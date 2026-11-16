import { defineConfig, devices } from "@playwright/test";
import { BASE_URL, server } from "./tests/server.ts";

/**
 * 022 decisions 1 and 2: every browser suite in Chromium, Firefox and
 * WebKit, in light and dark. Projects are `<engine>-<scheme>`; a test reads
 * its scheme through `tests/e2e/scheme.ts`, never from the project's name.
 */
const ENGINES = {
  chromium: devices["Desktop Chrome"],
  firefox: devices["Desktop Firefox"],
  webkit: devices["Desktop Safari"],
} as const;
const SCHEMES = ["light", "dark"] as const;
const CI = !!process.env.CI;

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  // 022 decision 18: a flaky browser test fails the run in CI.
  retries: CI ? 1 : 0,
  failOnFlakyTests: CI,
  reporter: CI ? [["blob"], ["dot"]] : "list",
  webServer: server(),
  use: { baseURL: BASE_URL },
  projects: [
    ...Object.entries(ENGINES).flatMap(([engine, device]) =>
      SCHEMES.map((scheme) => ({
        name: `${engine}-${scheme}`,
        use: { ...device, colorScheme: scheme },
        // 015 decision 24, 022 decision 1: the build's output is read once,
        // in chromium-light. The budgets run in their own project.
        testIgnore:
          engine === "chromium" && scheme === "light"
            ? /perf/
            : /build-output|perf/,
      })),
    ),
    // 015 decision 23: the budgets, Chromium only (they throttle through
    // CDP), light, alone. Locally the project starts once Chromium's two
    // have finished, so CPU throttling shares the machine with no other
    // test. In CI it is a job on its own runner (022 decision 8).
    {
      name: "perf",
      use: { ...ENGINES.chromium, colorScheme: "light" },
      testMatch: /perf\.spec\.ts/,
      dependencies: CI ? [] : ["chromium-light", "chromium-dark"],
      fullyParallel: false,
    },
  ],
});
