/**
 * `bun tests/sr/mutations/write-expected.ts`: writes each set's
 * `expected.json` from the patch table and the tests' declarations, keeping
 * its `notProvable` list (022 decision 15). The file is derived; never edit
 * its `expected` list by hand. `tests/unit/mutations.test.ts` fails when it
 * is stale.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { declaredTests } from "../declared.ts";
import { derive, type Expected } from "./derive.ts";
import { PATCHES, SETS } from "./table.ts";

const DIR = "tests/sr/mutations";
const tests = declaredTests();
for (const set of SETS) {
  const file = path.join(DIR, set, "expected.json");
  const old: Expected | null = existsSync(file)
    ? JSON.parse(readFileSync(file, "utf8"))
    : null;
  const next = derive(set, PATCHES, tests, old?.notProvable ?? []);
  writeFileSync(file, JSON.stringify(next, null, 2) + "\n");
  console.log(`${file}: ${next.expected.length} expected failures`);
}
