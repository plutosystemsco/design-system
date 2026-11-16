/**
 * 022 decision 16: the one `test` and `expect` every browser spec imports.
 * It is Playwright's, with the fault ledger's automatic fixture, so a known
 * fault keeps the run green while a new one in the same test turns it red.
 */
import { expect, test as base } from "@playwright/test";
import { ledgerFixture } from "./ledger.ts";

export const test = base.extend<{ ledger: void }>({
  ledger: ledgerFixture((info) => ({ project: info.project.name })),
});

export { expect };
