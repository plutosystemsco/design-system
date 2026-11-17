/**
 * 022 decisions 12, 13a and 16: the screen-reader suite's `test`, guidepup's
 * `screenReaderTest` extended with:
 *
 * - `capture: true`, so a live region and a tooltip's description, which
 *   speak after the first page of output, are captured (`"initial"`, the
 *   default, missed them: one reason `019`'s pass rested on the owner's ear);
 * - the fault ledger's automatic fixture, by reader and browser;
 * - `sr`, the windows, the sentinel and the judging, with each test's
 *   phrases and faults attached as `phrases.json` and `faults.json`.
 *
 * Every test declares `item`, `rules` and `hears` statically, through
 * `declared()` in its details. None is added at run time.
 */
import {
  screenReaderTest,
  type ScreenReaderPlaywright,
} from "@guidepup/playwright";
import { orcaKeyCodeCommands } from "@guidepup/guidepup";
import type { TestDetails } from "@playwright/test";
import { expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import path from "node:path";
import { LEDGER } from "../fault-ledger.ts";
import { ledgerFixture, type LedgerLine } from "../ledger.ts";
import { mutationLines, PAIRS, type Expected } from "./mutations/derive.ts";
import { reader } from "./reader.ts";
import type { RuleId } from "./rules.ts";
import { appears, READY, Sr } from "./sr.ts";

export { appears, expect, READY, Sr };

/** Local only: drive the steps with no reader. Nothing is judged. */
export const DRY = !process.env.CI && !!process.env.SR_DRY;

/**
 * A test's static details: the item it judges, the rules it applies, and
 * what those rules hear (by default its own item; `item:part` names one
 * region or element of an item).
 */
export function declared(
  item: string,
  rules: RuleId[],
  hears: string[] = [item],
): TestDetails {
  return {
    annotation: [
      { type: "item", description: item },
      { type: "rules", description: rules.join(",") },
      { type: "hears", description: hears.join(",") },
    ],
  };
}

/** A reader that hears nothing, for a dry run. */
function silent(): ScreenReaderPlaywright {
  const none = async () => undefined;
  return new Proxy({} as ScreenReaderPlaywright, {
    get: (_t, key) =>
      key === "spokenPhraseLog" || key === "itemTextLog"
        ? async () => []
        : key === "lastSpokenPhrase" || key === "itemText"
          ? async () => ""
          : key === "capture"
            ? async (action: () => Promise<unknown>) => ({
                result: await action(),
                spokenPhrase: "",
                itemText: "",
              })
            : none,
  });
}

const READER = reader();

/**
 * The review's finding 1: on a `mutate` dispatch (`MUTATE=true`), the set's
 * expected failures join the ledger, so a perfect mutation run's reader
 * jobs succeed and `gate` can pass. `report` still compares every test's
 * faults with `expected.json`.
 */
const MUTATION_LINES: LedgerLine[] =
  process.env.MUTATE === "true"
    ? PAIRS.filter((p) => p.reader === READER).flatMap((p) =>
        mutationLines(
          JSON.parse(
            readFileSync(
              path.join(
                import.meta.dir,
                "mutations",
                process.env.MUTATION_SET || "main",
                "expected.json",
              ),
              "utf8",
            ),
          ) as Expected,
          p.reader,
          p.browser,
        ),
      )
    : [];

/**
 * Orca only, for the container rehearsal (022 Q9), never evidence:
 * `@guidepup/playwright` 0.21.0 reads Orca's commands flat
 * (`orcaKeyCodeCommands.PresentTitle`), and guidepup 0.40.0 groups them by
 * service (`WhereAmIPresenter.PresentTitle`). Found by the rehearsal.
 * VoiceOver's and NVDA's commands are flat in both, so nothing changes for
 * them.
 */
if (READER === "orca") {
  const flat = orcaKeyCodeCommands as unknown as Record<string, unknown>;
  for (const group of Object.values(orcaKeyCodeCommands) as object[])
    for (const [name, command] of Object.entries(group))
      if (typeof command === "object" && command && "service" in command)
        flat[name] ??= command;
}

export const test = screenReaderTest.extend<{ ledger: void; sr: Sr }>({
  // 022q decision 2, amended after the change review (finding 1): NVDA
  // reports a mode change by a sound while `passThroughAudioIndication` is
  // on, its default. guidepup's NVDA `start()` merges `settings` into the
  // session's nvda.ini, so the mode is spoken. VoiceOver's `start()` would
  // write `settings` to its own preferences, so they go to NVDA only.
  screenReaderStartOptions:
    READER === "nvda"
      ? {
          capture: true,
          settings: { virtualBuffers: { passThroughAudioIndication: false } },
        }
      : { capture: true },
  ...(DRY
    ? {
        screenReader: async (
          {}: object,
          use: (r: ScreenReaderPlaywright) => Promise<void>,
        ) => use(silent()),
      }
    : {}),
  ledger: ledgerFixture(
    (info) => ({ reader: READER, browser: info.project.name }),
    [...LEDGER, ...MUTATION_LINES],
  ),
  // 022ad: a restart of VoiceOver inside `open()` starts it as this fixture did.
  sr: async ({ page, screenReader, screenReaderStartOptions }, use, info) => {
    const sr = new Sr(page, screenReader, info, {
      reader: READER,
      dry: DRY,
      start: screenReaderStartOptions,
    });
    await use(sr);
    await info.attach("phrases.json", {
      body: JSON.stringify(
        { reader: READER, browser: info.project.name, windows: sr.windows },
        null,
        2,
      ),
      contentType: "application/json",
    });
  },
});
