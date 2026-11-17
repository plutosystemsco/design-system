/**
 * 022 decisions 12 and 16, 022q: `Sr`, one screen-reader test's windows,
 * sentinel and judgement, and what it reads from the page. The reader and
 * the dry mode are passed in (`SrOptions`), so this module resolves no
 * reader when it loads: `tests/unit/sr-harness.test.ts` drives it with a
 * fake reader, as NVDA and as VoiceOver, in any job.
 */
import { NVDAKeyCodeCommands } from "@guidepup/guidepup";
import type { ScreenReaderPlaywright } from "@guidepup/playwright";
import type { Locator, Page, TestInfo } from "@playwright/test";
import { expect } from "@playwright/test";
import { layCover, liftCover } from "./cover.ts";
import {
  AFTER_MS,
  BEFORE_MS,
  joinCaptures,
  needsBack,
  normalise,
  type Fault,
  type Overlay,
} from "./rules.ts";

/** Every example and view page sets this once it has hydrated. */
export const READY = "main[data-view-ready], body[data-view-ready]";

/**
 * 022aa: how long a wait in the suite may take unless it says otherwise.
 * A wait without a bound waited out the 5-minute test timeout, then 5 more
 * in teardown (the fifth matrix run, §3.3).
 */
export const WAIT_MS = 10_000;

type WaitState = "attached" | "detached" | "visible" | "hidden";

/** Each page's `Sr`, so `appears()` can record on the test that owns the page. */
const OWNERS = new WeakMap<Page, Sr>();

/**
 * 022aa: wait, with a bound, for `locator` to reach `state` ("visible" by
 * default). On a timeout the test records a false fact, then fails as X0
 * with what was waited for and where focus was (as `022x`'s sub-menu
 * wait). Inside a window, the failure waits for the window to end, so its
 * phrases are recorded first. Any error but a timeout is thrown on.
 * Resolves whether it came.
 */
export function appears(
  locator: Locator,
  what: string,
  options: { state?: WaitState; timeout?: number } = {},
): Promise<boolean> {
  const sr = OWNERS.get(locator.page());
  if (sr) return sr.appears(locator, what, options);
  const { state = "visible", timeout = WAIT_MS } = options;
  return locator.waitFor({ state, timeout }).then(() => true);
}

/** The focused element, by tag, `data-slot` and text. Runs in the page. */
function focusedElement(): string {
  const a = document.activeElement;
  if (!a || a === document.body) return "<body>";
  const text = (a.textContent ?? "").replace(/\s+/g, " ").trim();
  return `${a.tagName.toLowerCase()}[data-slot="${a.getAttribute("data-slot") ?? ""}"] "${text.length > 60 ? `${text.slice(0, 60)}…` : text}"`;
}

/** The reader `Sr` drives ("voiceover", "nvda", "orca" or "dry"), and whether the run is dry. */
export type SrOptions = { reader: string; dry: boolean };

/** The windows of one test, its sentinel, and its judgement. */
export class Sr {
  readonly windows: Record<string, string[]> = {};
  readonly faults: Fault[] = [];

  constructor(
    readonly page: Page,
    readonly reader: ScreenReaderPlaywright,
    readonly info: TestInfo,
    /**
     * Which reader drives this test, and whether it is a dry run: passed in,
     * never read at module load, so a unit test can drive `Sr` with a fake
     * reader as NVDA or as VoiceOver (the change review, finding 5).
     */
    readonly options: SrOptions,
  ) {
    OWNERS.set(page, this);
  }

  /** Whether a window's action is running, and the waits that timed out in it. */
  private inWindow = false;
  private late: Fault[] = [];

  /** `appears()`, on this test. */
  async appears(
    locator: Locator,
    what: string,
    {
      state = "visible",
      timeout = WAIT_MS,
    }: { state?: WaitState; timeout?: number } = {},
  ): Promise<boolean> {
    const came = await locator.waitFor({ state, timeout }).then(
      () => true,
      (e: unknown) => {
        if (e instanceof Error && e.name === "TimeoutError") return false;
        throw e;
      },
    );
    const bound = `${timeout / 1000} s`;
    this.fact(`${what} is ${state} within ${bound}`, came);
    if (came) return true;
    const where = await this.page
      .evaluate(focusedElement)
      .catch(() => "(the page did not answer)");
    const fault: Fault = {
      rule: "X0",
      message: `${what} was not ${state} within ${bound}; focus was on ${where}`,
    };
    if (this.inWindow) this.late.push(fault);
    else await this.judge([fault]);
    return false;
  }

  /**
   * Open an example or view, wait for it, and move the reader into it.
   *
   * 022q decision 3: guidepup's `navigateToWebContent()` clicks the centre
   * of `<body>` under NVDA, so a cover (`cover.ts`) takes that click while
   * the helper runs, and is lifted after. If the URL moved, or, under NVDA,
   * the cover took no click, the test fails as X0, recorded through
   * `judge()` in `faults.json`. The helper's Tab still leaves focus on the
   * page's first tab stop: a test that then `focus()`es that same element
   * hears an empty focus window, so it blurs first (tooltip T2). A dry run
   * calls no helper and lays no cover, so the check never fires there.
   */
  async open(path: string, ready = READY): Promise<void> {
    await this.page.goto(path);
    await this.appears(
      this.page.locator(ready).first(),
      `${path}'s ready mark`,
    );
    await this.page.bringToFront();
    if (this.options.dry) return;
    const url = this.page.url();
    await this.page.evaluate(layCover);
    let hit = false;
    try {
      await this.reader.navigateToWebContent();
    } finally {
      // A page the click took away has no cover to lift.
      hit = await this.page.evaluate(liftCover).catch(() => false);
    }
    const faults: Fault[] = [];
    if (this.page.url() !== url)
      faults.push({
        rule: "X0",
        message: `open: navigateToWebContent() moved the page from ${url} to ${this.page.url()}`,
      });
    if (this.options.reader === "nvda" && !hit)
      faults.push({
        rule: "X0",
        message:
          "open: the cover took no click, so navigateToWebContent()'s click may have reached the page",
      });
    if (faults.length) await this.judge(faults);
  }

  /**
   * A window. guidepup logs speech only around its own commands, so a
   * Playwright action and the wait after it run inside
   * `screenReader.capture()`. Found by the Orca rehearsal (022 Q9): a bare
   * `page.keyboard.press` and a wait left the log empty.
   *
   * 022q decision 7, by reader:
   * - NVDA: one capture for the action and its wait. NVDA's client listens
   *   during the action, and a second capture cancels speech mid-window.
   * - VoiceOver: two captures, the action's and the wait's, since guidepup
   *   polls VoiceOver only after an action ends. The wait capture's first
   *   phrase is dropped when it repeats the action capture's last
   *   (`joinCaptures`).
   * - Orca (the rehearsal) and a dry run: two captures, as before.
   *
   * 022q decision 8: under VoiceOver the item-text log is cleared at the
   * window's start and recorded after it, as `<name>: item text`, beside
   * the window: evidence of where VoiceOver's cursor was, not judged.
   */
  private async listen(
    name: string,
    ms: number,
    act?: () => Promise<unknown>,
  ): Promise<string[]> {
    await this.reader.clearSpokenPhraseLog();
    if (this.options.reader === "voiceover")
      await this.reader.clearItemTextLog();
    const start = Date.now();
    const wait = async () => {
      const left = (this.options.dry ? 200 : ms) - (Date.now() - start);
      if (left > 0) await this.page.waitForTimeout(left);
    };
    let phrases: string[];
    this.inWindow = true;
    try {
      phrases = await this.capture(act, wait);
    } catch (e) {
      // The change review, finding 5: a wait that timed out before the
      // action threw keeps its X0, attached, and the action's error is
      // thrown on.
      if (this.late.length) {
        this.faults.push(...this.late.splice(0));
        await this.info.attach("faults.json", {
          body: JSON.stringify(this.faults, null, 2),
          contentType: "application/json",
        });
      }
      throw e;
    } finally {
      this.inWindow = false;
    }
    if (this.options.dry) phrases = [];
    this.windows[name] = phrases;
    await this.itemText(name);
    // 022aa: a wait that timed out in the action fails once the window is recorded.
    if (this.late.length) await this.judge(this.late.splice(0));
    return phrases;
  }

  /** One window's captures, by reader (`listen`). */
  private async capture(
    act: (() => Promise<unknown>) | undefined,
    wait: () => Promise<void>,
  ): Promise<string[]> {
    let phrases: string[];
    if (this.options.reader === "nvda") {
      await this.reader.capture(
        async () => {
          if (act) await act();
          await wait();
        },
        { capture: true },
      );
      phrases = await this.reader.spokenPhraseLog();
    } else {
      if (act) await this.reader.capture(act, { capture: true });
      const action = [...(await this.reader.spokenPhraseLog())];
      await this.reader.capture(wait, { capture: true });
      const all = await this.reader.spokenPhraseLog();
      const rest = all.slice(action.length);
      phrases =
        this.options.reader === "voiceover"
          ? joinCaptures(action, rest)
          : [...action, ...rest];
    }
    return phrases;
  }

  /** 022q decision 8: VoiceOver's item text for a window, beside it. */
  private async itemText(name: string): Promise<void> {
    if (this.options.reader !== "voiceover") return;
    this.windows[`${name}: item text`] = [...(await this.reader.itemTextLog())];
  }

  /** The before window: 2 s, once the page is ready, before the action. */
  before(name = "before"): Promise<string[]> {
    return this.listen(name, BEFORE_MS);
  }

  /** The after window: it starts with the action and runs 6 s. */
  after(act: () => Promise<unknown>, name = "after"): Promise<string[]> {
    return this.listen(name, AFTER_MS, act);
  }

  /**
   * What `steps()` read from the DOM of the open overlay before it walked:
   * O2's overlay texts, the trigger and the focused element (022q
   * decision 1).
   */
  overlay: Overlay = {
    trigger: "",
    title: "",
    descriptions: [],
    texts: [],
    focused: "",
  };

  /**
   * `n` of the reader's `next()` steps, and what they spoke. With a sentinel
   * set, a second copy goes at the end of `<body>` first, after the portal
   * the overlay opened into: a reader leaving a non-modal overlay forward
   * meets it there, as one leaving backward meets the first.
   *
   * 022q decisions 1 and 2, for an overlay's walk (`trigger` given):
   * - `overlay` records the overlay texts, the overlay's title, the
   *   trigger's name and the accessible text of the element focused when
   *   the walk begins, for O2;
   * - under NVDA the walk starts in browse mode: NVDA+Space inside a
   *   capture, read back, and pressed again if NVDA says "focus mode".
   *   guidepup's `exitFocusMode` is a plain Escape, which NVDA passes to
   *   the page in browse mode and which closes the overlay: it is not used
   *   here. Under VoiceOver this step does nothing. NVDA is started with
   *   its mode spoken (`fixtures.ts`); if neither "focus mode" nor "browse
   *   mode" is heard, the test fails as X0, through `judge()`, and so it
   *   does if a second press, after "focus mode", does not say "browse
   *   mode" (the re-check's finding 10);
   * - a check then holds the overlay still open: a DOM fact in a dry run,
   *   and its own X0 in a real one, so the walk's X0 names the cause (the
   *   change review, finding 6);
   * - after the walk, if its last phrase holds the trigger's name and no
   *   inside text, one `previous()` step is taken and recorded apart, as
   *   `back` and `<name>: back` (decision 1, step 4). It decides by
   *   `title`, the overlay's name O2 is judged with, and falls back to the
   *   DOM's title (the re-check's finding 11).
   */
  async steps(
    n = 10,
    {
      trigger,
      title,
      name = "steps",
    }: { trigger?: string; title?: string; name?: string } = {},
  ): Promise<string[]> {
    await this.page.evaluate((sentinel) => {
      if (!sentinel) return;
      const p = document.createElement("p");
      p.setAttribute("data-sr-sentinel", "");
      p.textContent = sentinel;
      document.body.append(p);
    }, this.sentinelText);
    if (trigger !== undefined) {
      await this.browseMode(name);
      const read = await this.page.evaluate(readOverlay);
      this.fact("the overlay is still open when the walk begins", read.open);
      if (!this.options.dry && !read.open)
        await this.judge([
          {
            rule: "X0",
            message:
              "steps: the overlay closed before the walk, so it judges nothing",
          },
        ]);
      this.overlay = {
        trigger,
        title: read.title,
        descriptions: read.descriptions,
        texts: read.texts,
        focused: read.focused,
      };
      // Beside the steps in phrases.json.
      this.windows[`${name}: overlay`] = read.texts;
      this.windows[`${name}: focused`] = [read.focused];
    }
    await this.reader.clearSpokenPhraseLog();
    if (this.options.reader === "voiceover")
      await this.reader.clearItemTextLog();
    for (let i = 0; i < n; i++) await this.reader.next();
    await this.page.waitForTimeout(this.options.dry ? 100 : 1000);
    const phrases = this.options.dry ? [] : await this.reader.spokenPhraseLog();
    this.windows[name] = phrases;
    await this.itemText(name);
    if (
      trigger !== undefined &&
      !this.options.dry &&
      needsBack(phrases, this.overlay, title ?? this.overlay.title)
    ) {
      await this.reader.clearSpokenPhraseLog();
      if (this.options.reader === "voiceover")
        await this.reader.clearItemTextLog();
      await this.reader.previous();
      await this.page.waitForTimeout(1000);
      this.back = [...(await this.reader.spokenPhraseLog())];
      this.windows[`${name}: back`] = this.back;
      await this.itemText(`${name}: back`);
    }
    return phrases;
  }

  /**
   * The one `previous()` step `steps()` took after a walk that ended on the
   * trigger's name alone, for O2's stall (022q decision 1, step 4); empty
   * when none was needed.
   */
  back: string[] = [];

  /** 022q decision 2: NVDA's walk starts in browse mode, by a key NVDA keeps. */
  private async browseMode(name: string): Promise<void> {
    if (this.options.reader !== "nvda") return;
    const toggle = async () => {
      await this.reader.clearSpokenPhraseLog();
      await this.reader.perform(
        NVDAKeyCodeCommands.toggleBetweenBrowseAndFocusMode,
        { capture: true },
      );
      return [...(await this.reader.spokenPhraseLog())];
    };
    const says = (phrases: string[], mode: string) =>
      phrases.some((p) => normalise(p).includes(mode));
    const said = await toggle();
    const again = says(said, "focus mode") ? await toggle() : [];
    this.windows[`${name}: browse mode`] = [...said, ...again];
    if (!says(said, "focus mode") && !says(said, "browse mode"))
      await this.judge([
        {
          rule: "X0",
          message: `steps: NVDA+Space spoke neither "focus mode" nor "browse mode" (${JSON.stringify(said)}), so NVDA's mode is unknown`,
        },
      ]);
    else if (says(said, "focus mode") && !says(again, "browse mode"))
      await this.judge([
        {
          rule: "X0",
          message: `steps: NVDA said "focus mode", and the second NVDA+Space did not say "browse mode" (${JSON.stringify(again)}), so NVDA's mode is unknown`,
        },
      ]);
    await this.reader.clearSpokenPhraseLog();
  }

  /**
   * O2's sentinel: a visible paragraph with unique text, the first child of
   * `<main>`, outside the overlay. Test code, injected; no site file changes.
   */
  private sentinelText: string | null = null;

  async sentinel(): Promise<string> {
    const text = `sentinel ${Math.floor(Math.random() * 0xffffffff)
      .toString(16)
      .padStart(8, "0")}`;
    this.sentinelText = text;
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
    if (this.options.dry) {
      expect(this.dom.filter((d) => !d.holds).map((d) => d.fact)).toEqual([]);
      return;
    }
    expect(
      this.faults,
      `rule faults (phrases: ${JSON.stringify(this.windows)})`,
    ).toEqual([]);
  }
}

/**
 * 022q decision 1: read the open overlay from the DOM. Runs in the page.
 * The overlays are the visible dialogs, alert dialogs and modals. Their
 * texts are found by containment, plus the elements their
 * `aria-labelledby` and `aria-describedby` name (bits-ui renders a
 * dialog's title and description as `div`s). An element with an
 * `aria-label` (a close button's "Close") gives that, else its text.
 */
export function readOverlay(): {
  open: boolean;
  title: string;
  descriptions: string[];
  texts: string[];
  focused: string;
} {
  const clean = (t: string | null | undefined) =>
    (t ?? "").replace(/\s+/g, " ").trim();
  const named = (el: Element, attr: string) =>
    (el.getAttribute(attr) ?? "")
      .split(/\s+/)
      .filter(Boolean)
      .map((id) => document.getElementById(id))
      .filter((e): e is HTMLElement => !!e);
  const textOf = (el: Element) =>
    clean(el.getAttribute("aria-label")) || clean(el.textContent);
  const overlays = [
    ...document.querySelectorAll(
      '[role="dialog"], [role="alertdialog"], [aria-modal="true"]',
    ),
  ].filter((el) => el.getClientRects().length > 0);
  const texts = new Set<string>();
  const titles: string[] = [];
  const descriptions: string[] = [];
  for (const o of overlays) {
    const labels = named(o, "aria-labelledby");
    titles.push(
      labels.length
        ? labels.map(textOf).join(" ")
        : clean(o.getAttribute("aria-label")),
    );
    const described = named(o, "aria-describedby");
    descriptions.push(...described.map(textOf).filter(Boolean));
    for (const el of [
      ...o.querySelectorAll(
        'h1, h2, h3, h4, [role="heading"], p, label, button, a, li',
      ),
      ...labels,
      ...described,
    ]) {
      const t = textOf(el);
      if (t.length >= 3) texts.add(t);
    }
  }
  // The focused element's accessible text: its label, else its text.
  const a = document.activeElement;
  let focused = "";
  if (a && a !== document.body) {
    const byIds = named(a, "aria-labelledby").map(textOf).join(" ");
    const labels =
      "labels" in a && a.labels
        ? [...(a.labels as NodeListOf<HTMLLabelElement>)].map(textOf).join(" ")
        : "";
    focused =
      clean(a.getAttribute("aria-label")) ||
      clean(byIds) ||
      clean(labels) ||
      clean(a.textContent);
  }
  return {
    open: overlays.length > 0,
    title: titles.filter(Boolean).join(" "),
    descriptions,
    texts: [...texts],
    focused,
  };
}
