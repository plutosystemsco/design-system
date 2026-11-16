/**
 * `bun scripts/site/release-check.ts`: run by the design lead before the
 * release is tagged. It exits 1 if any check fails:
 *
 * 1. The site's address no longer holds the `<account>` placeholder.
 * 2. (025 decision 16) The cost step: one full, quiet run of every item on
 *    the release machine, fresh and within budget (`scripts/cost/release.ts`).
 *
 * `--before-ci` runs every check but those only the tag's own evidence can
 * satisfy, names what it skipped, and exits 0 if the rest pass. Landing
 * gates and `headers.test.ts` use it; the tag uses the full check. (The
 * shape is `022`'s, on its branch at `2d9e852`; whichever of `022` and `025`
 * lands second merges the two lists of checks and skips.)
 *
 * A script, not a test, so a clean clone's test run never depends on these.
 * Every check runs, so one refusal names every reason.
 */
import { SITE_ORIGIN } from "../../src/lib/site/site.ts";
import { costCheck, SKIPPED_COST, type Check } from "../cost/release.ts";

/** 1. The site's address holds no placeholder. Pure, so a unit test calls it. */
export function addressCheck(origin: string): Check {
  return origin.includes("<account>")
    ? {
        ok: false,
        lines: [
          `release-check: SITE_ORIGIN is still ${origin}. Set the account in src/lib/site/site.ts before tagging.`,
        ],
      }
    : { ok: true, lines: [`release-check: SITE_ORIGIN is ${origin}.`] };
}

/** What `--before-ci` leaves out, named in its output. */
export const SKIPPED_BEFORE_CI = [SKIPPED_COST];

function print(c: Check): void {
  (c.ok ? console.log : console.error)(c.lines.join("\n"));
}

if (import.meta.main) {
  const beforeCi = process.argv.includes("--before-ci");
  const address = addressCheck(SITE_ORIGIN);
  print(address);
  let ok = address.ok;

  if (beforeCi) {
    for (const l of SKIPPED_BEFORE_CI) console.log(l);
  } else {
    const cost = costCheck();
    print(cost);
    ok &&= cost.ok;
  }

  process.exit(ok ? 0 : 1);
}
