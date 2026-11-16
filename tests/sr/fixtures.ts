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
import type { Locator, Page, TestDetails, TestInfo } from "@playwright/test";
import { expect } from "@playwright/test";
import { ledgerFixture } from "../ledger.ts";
import { reader } from "./reader.ts";
import { AFTER_MS, BEFORE_MS, type Fault, type RuleId } from "./rules.ts";

export { expect };

/** Local only: drive the steps with no reader. Nothing is judged. */
export const DRY = !process.env.CI && !!process.env.SR_DRY;

/** Every example and view page sets this once it has hydrated. */
export const READY = "main[data-view-ready], body[data-view-ready]";

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

/** The windows of one test, its sentinel, and its judgement. */
export class Sr {
  readonly windows: Record<string, string[]> = {};
  readonly faults: Fault[] = [];

  constructor(
    readonly page: Page,
    readonly reader: ScreenReaderPlaywright,
    readonly info: TestInfo,
  ) {}

  /** Open an example or view, wait for it, and move the reader into it. */
  async open(path: string, ready = READY): Promise<void> {
    await this.page.goto(path);
    await this.page.locator(ready).first().waitFor();
    await this.page.bringToFront();
    await this.reader.navigateToWebContent();
  }

  /**
   * A window. guidepup logs speech only around its own commands, so a
   * Playwright action and the wait after it each run inside
   * `screenReader.capture()`: Orca and NVDA hear what is spoken during it,
   * VoiceOver polls what is spoken after it. Found by the Orca rehearsal
   * (022 Q9): a bare `page.keyboard.press` and a wait left the log empty.
   */
  private async listen(
    name: string,
    ms: number,
    act?: () => Promise<unknown>,
  ): Promise<string[]> {
    await this.reader.clearSpokenPhraseLog();
    const start = Date.now();
    if (act) await this.reader.capture(act, { capture: true });
    const left = (DRY ? 200 : ms) - (Date.now() - start);
    if (left > 0)
      await this.reader.capture(() => this.page.waitForTimeout(left), {
        capture: true,
      });
    const phrases = DRY ? [] : await this.reader.spokenPhraseLog();
    this.windows[name] = phrases;
    return phrases;
  }

  /** The before window: 2 s, once the page is ready, before the action. */
  before(name = "before"): Promise<string[]> {
    return this.listen(name, BEFORE_MS);
  }

  /** The after window: it starts with the action and runs 6 s. */
  after(act: () => Promise<unknown>, name = "after"): Promise<string[]> {
    return this.listen(name, AFTER_MS, act);
  }

  /** `n` of the reader's `next()` steps, and what they spoke. */
  async steps(n = 10, name = "steps"): Promise<string[]> {
    await this.reader.clearSpokenPhraseLog();
    for (let i = 0; i < n; i++) await this.reader.next();
    await this.page.waitForTimeout(DRY ? 100 : 1000);
    const phrases = DRY ? [] : await this.reader.spokenPhraseLog();
    this.windows[name] = phrases;
    return phrases;
  }

  /**
   * O2's sentinel: a visible paragraph with unique text, the first child of
   * `<main>`, outside the overlay. Test code, injected; no site file changes.
   */
  async sentinel(): Promise<string> {
    const text = `sentinel ${Math.floor(Math.random() * 0xffffffff)
      .toString(16)
      .padStart(8, "0")}`;
    await this.page.evaluate((t) => {
      const p = document.createElement("p");
      p.setAttribute("data-sr-sentinel", "");
      p.textContent = t;
      const main = document.querySelector("main") ?? document.body;
      main.prepend(p);
    }, text);
    return text;
  }

  /** The page's facts a dry run still checks: focus and the DOM. */
  readonly dom: { fact: string; holds: boolean }[] = [];

  /** Whether `locator` is `document.activeElement`. */
  async focused(locator: Locator): Promise<boolean> {
    const holds = await locator.evaluate((el) => el === document.activeElement);
    this.dom.push({ fact: `focus on ${locator}`, holds });
    return holds;
  }

  /** A DOM fact a rule reads (T2's tooltip gone, say), recorded for a dry run. */
  fact(fact: string, holds: boolean): boolean {
    this.dom.push({ fact, holds });
    return holds;
  }

  /**
   * Record the faults of some rules, attach them, and fail on any. A dry run
   * judges no speech; it fails only on a DOM fact that does not hold.
   */
  async judge(...faults: Fault[][]): Promise<void> {
    this.faults.push(...faults.flat());
    await this.info.attach("faults.json", {
      body: JSON.stringify(this.faults, null, 2),
      contentType: "application/json",
    });
    if (DRY) {
      expect(this.dom.filter((d) => !d.holds).map((d) => d.fact)).toEqual([]);
      return;
    }
    expect(
      this.faults,
      `rule faults (phrases: ${JSON.stringify(this.windows)})`,
    ).toEqual([]);
  }
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
  screenReaderStartOptions: { capture: true },
  ...(DRY
    ? {
        screenReader: async (
          {}: object,
          use: (r: ScreenReaderPlaywright) => Promise<void>,
        ) => use(silent()),
      }
    : {}),
  ledger: ledgerFixture((info) => ({
    reader: READER,
    browser: info.project.name,
  })),
  sr: async ({ page, screenReader }, use, info) => {
    const sr = new Sr(page, screenReader, info);
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
