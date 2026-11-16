/**
 * `bun scripts/site/release-check.ts`: run by the design lead before the
 * release is tagged. It exits 1 if any check fails:
 *
 * 1. The site's address no longer holds the `<account>` placeholder.
 * 2. (024, the change review's finding 3) Every page template has the CI
 *    runner's LCP figure (`tests/e2e/budgets.ts`, `ci`). Until 024 build
 *    step 7 re-bases LCP on `022`'s first three green runs, LCP is reported
 *    on CI and not gated, so the tag waits for that re-base.
 *
 * `--before-ci` runs every check but those only CI's evidence can satisfy,
 * names what it skipped, and exits 0 if the rest pass. Landing gates use
 * it; the tag uses the full check. The shape follows `022`'s release check
 * (a `Check` per step, `SKIPPED_BEFORE_CI`), so its merge folds the two
 * together: check 2 joins the CI-evidence steps there.
 *
 * A script, not a test, so a clean clone's test run never depends on these.
 * Every check runs, so one refusal names every reason.
 */
import { SITE_ORIGIN } from "../../src/lib/site/site.ts";
import {
  TEMPLATE_IDS,
  TEMPLATES,
  type TemplateId,
  type Template,
} from "../../tests/e2e/budgets.ts";

export type Check = { ok: boolean; lines: string[] };

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

/** 2. Every template has a runner LCP figure. Pure, so a unit test calls it. */
export function ciLcpCheck(templates: Record<TemplateId, Template>): Check {
  const missing = TEMPLATE_IDS.filter((id) => templates[id].ci === null);
  if (!missing.length)
    return {
      ok: true,
      lines: [
        "release-check: every page template has the CI runner's LCP figure (024 decision 8).",
      ],
    };
  return {
    ok: false,
    lines: [
      `release-check: ${missing.length} page template${missing.length === 1 ? " has" : "s have"} no CI runner LCP figure, so LCP is not gated on CI (024 build step 7: re-base on 022's first three green runs):`,
      ...missing.map((id) => `  - ${id}`),
    ],
  };
}

/** What `--before-ci` leaves out, named in its output. */
export const SKIPPED_BEFORE_CI = [
  "release-check: skipped (--before-ci): the CI runner's LCP figures for every page template, which only 022's green runs can give (024 build step 7).",
];

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
    const ci = ciLcpCheck(TEMPLATES);
    print(ci);
    ok &&= ci.ok;
  }

  process.exit(ok ? 0 : 1);
}
