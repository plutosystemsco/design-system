/**
 * 022 decision 14: `report` merges every blob, from three operating systems,
 * into one HTML report and one JSON report. Playwright needs an explicit
 * merge config for blobs from different systems; `testDir` is the parent of
 * both suites' folders.
 */
export default {
  testDir: "tests",
  reporter: [
    ["html", { outputFolder: "matrix-report/html", open: "never" }],
    ["json", { outputFile: "matrix-report/report.json" }],
  ],
};
