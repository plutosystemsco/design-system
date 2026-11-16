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
 *
 * A script, not a test, so a clean clone's test run never depends on these.
 * Every check runs, so one refusal names every reason.
 */
import { LEDGER } from "../../tests/fault-ledger.ts";
import type { LedgerLine } from "../../tests/ledger.ts";
import { SITE_ORIGIN } from "../../src/lib/site/site.ts";
import { matrixCheck } from "../ci/qualify.ts";
import { jobNames, readWorkflow } from "../ci/workflow.ts";

export function ledgerCheck(ledger: LedgerLine[]): {
  ok: boolean;
  lines: string[];
} {
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

if (import.meta.main) {
  let ok = true;
  if (SITE_ORIGIN.includes("<account>")) {
    console.error(
      `release-check: SITE_ORIGIN is still ${SITE_ORIGIN}. Set the account in src/lib/site/site.ts before tagging.`,
    );
    ok = false;
  } else console.log(`release-check: SITE_ORIGIN is ${SITE_ORIGIN}.`);

  const ledger = ledgerCheck(LEDGER);
  (ledger.ok ? console.log : console.error)(ledger.lines.join("\n"));
  ok &&= ledger.ok;

  const head = Bun.spawnSync(["git", "rev-parse", "HEAD"])
    .stdout.toString()
    .trim();
  const expected = jobNames(readWorkflow(".github/workflows/matrix.yml"));
  const matrix = await matrixCheck(head, expected);
  (matrix.ok ? console.log : console.error)(matrix.lines.join("\n"));
  ok &&= matrix.ok;

  process.exit(ok ? 0 : 1);
}
