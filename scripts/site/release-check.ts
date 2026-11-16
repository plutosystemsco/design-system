/**
 * `bun scripts/site/release-check.ts`: run by the design lead before the
 * release is tagged. It exits 1 if any check fails:
 *
 * 1. The site's address no longer holds the `<account>` placeholder.
 * 2. (022 decision 19, Q3) The fault ledger, `tests/fault-ledger.ts`, is
 *    empty: no tag while a fault waits for its small change.
 * 3. (022 decision 19) A `matrix` push run qualifies for HEAD
 *    (`scripts/ci/qualify.ts`), read through `gh`, with the job names that
 *    `matrix.yml` declares at HEAD. Without `gh`, or signed out, it refuses:
 *    it never passes on missing evidence.
 * 4. (024, the change review's finding 3; the design lead's ruling at 024's
 *    landing) Every page template has the CI runner's LCP figure
 *    (`tests/e2e/budgets.ts`, `ci`). Until 024 build step 7 re-bases LCP on
 *    022's first three green runs, LCP is reported on CI and not gated, so
 *    the tag waits for that re-base.
 *
 * `--before-ci` (the design lead's ruling at 022's landing, 2026-11-15)
 * runs every check but those only CI's evidence can satisfy, the ledger,
 * the matrix run and the runner's LCP figures, names what it skipped, and
 * exits 0 if the rest pass. Landing gates use it until push B; the tag uses
 * the full check.
 *
 * A script, not a test, so a clean clone's test run never depends on these.
 * Every check runs, so one refusal names every reason.
 */
import { LEDGER } from "../../tests/fault-ledger.ts";
import type { LedgerLine } from "../../tests/ledger.ts";
import { SITE_ORIGIN } from "../../src/lib/site/site.ts";
import {
  TEMPLATE_IDS,
  TEMPLATES,
  type Template,
  type TemplateId,
} from "../../tests/e2e/budgets.ts";
import { matrixCheck } from "../ci/qualify.ts";
import { jobNames, readWorkflow } from "../ci/workflow.ts";

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

export function ledgerCheck(ledger: LedgerLine[]): Check {
  if (!ledger.length)
    return { ok: true, lines: ["release-check: the fault ledger is empty."] };
  return {
    ok: false,
    lines: [
      `release-check: the fault ledger holds ${ledger.length} open fault${ledger.length === 1 ? "" : "s"} (022 Q3: no tag until it is empty):`,
      ...ledger.map(
        (l) =>
          `  - ${l.change}: ${l.file} › ${l.title} (${"project" in l.where ? l.where.project : `${l.where.reader}-${l.where.browser}`})`,
      ),
    ],
  };
}

/** 4. Every template has a runner LCP figure. Pure, so a unit test calls it. */
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
  "release-check: skipped (--before-ci): the fault ledger, which waits on the small changes and push B's run (022 Q3).",
  "release-check: skipped (--before-ci): a green matrix push run of HEAD, which only CI can give (022 decision 19).",
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
    const ledger = ledgerCheck(LEDGER);
    print(ledger);
    ok &&= ledger.ok;

    const head = Bun.spawnSync(["git", "rev-parse", "HEAD"])
      .stdout.toString()
      .trim();
    const expected = jobNames(readWorkflow(".github/workflows/matrix.yml"));
    const matrix = await matrixCheck(head, expected);
    print(matrix);
    ok &&= matrix.ok;

    const ci = ciLcpCheck(TEMPLATES);
    print(ci);
    ok &&= ci.ok;

    // 025's cost step goes here, after 024's runner-figure step, when 025
    // lands; 030's status step follows it (030's release-check ordering).
  }

  process.exit(ok ? 0 : 1);
}
