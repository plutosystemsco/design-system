/**
 * `bun scripts/site/release-check.ts`: run by the design lead before the
 * release is tagged. It exits 1 while the site's address still holds the
 * `<account>` placeholder, which the owner fills in when the worker's
 * address is known. A script, not a test, so a clean clone's test run never
 * depends on that answer.
 */
import { SITE_ORIGIN } from "../../src/lib/site/site.ts";

if (SITE_ORIGIN.includes("<account>")) {
  console.error(
    `release-check: SITE_ORIGIN is still ${SITE_ORIGIN}. Set the account in src/lib/site/site.ts before tagging.`,
  );
  process.exit(1);
}
console.log(`release-check: SITE_ORIGIN is ${SITE_ORIGIN}.`);
if (!(await import("../cost/release.ts")).costReleaseOk()) process.exit(1);
