import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  reporter: "list",
  fullyParallel: true,
  webServer: {
    command: "bun run build && bun --bun vite preview --port 4173 --strictPort",
    url: "http://localhost:4173/",
    reuseExistingServer: false,
    timeout: 180_000,
  },
  use: { baseURL: "http://localhost:4173" },
  projects: [
    {
      name: "light",
      use: { ...devices["Desktop Chrome"], colorScheme: "light" },
      testIgnore: /perf/,
    },
    {
      name: "dark",
      use: { ...devices["Desktop Chrome"], colorScheme: "dark" },
      // 015 decision 24: the build's output and the budgets are read once,
      // in the light project.
      testIgnore: /build-output|perf/,
    },
    // 015 decision 23: the budgets, in the light theme, alone: this project
    // starts once the others have finished, so CPU throttling shares the
    // machine with no other test.
    {
      name: "perf",
      use: { ...devices["Desktop Chrome"], colorScheme: "light" },
      testMatch: /perf\.spec\.ts/,
      dependencies: ["light", "dark"],
      fullyParallel: false,
    },
  ],
});
