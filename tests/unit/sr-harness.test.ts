/**
 * 022q, the change review's finding 5: `Sr` driven by a fake reader and a
 * fake page, as NVDA and as VoiceOver, so its reader-only paths are proven
 * before a runner reaches them. The fake logs one entry for each capture,
 * command or step, as guidepup does.
 *
 * Covered: the cover's two X0s (decision 3); the captures by reader and
 * VoiceOver's item text (decisions 7 and 8); the browse-mode step's three
 * outcomes (decision 2); the still-open X0 (decision 2); the
 * `previous()` step after a walk that ends on the trigger's name alone
 * (decision 1, step 4); and, for `022ad`, a web-content helper that stalls
 * or throws "VoiceOver not running".
 */
import { describe, expect, spyOn, test } from "bun:test";
import type { ScreenReaderPlaywright } from "@guidepup/playwright";
import type { Locator, Page, TestInfo } from "@playwright/test";
import { layCover, liftCover } from "../sr/cover.ts";
import {
  appears,
  HELPER_MS,
  readOverlay,
  RESTART_MS,
  Sr,
  type SrOptions,
} from "../sr/sr.ts";

const ORIGIN = "http://127.0.0.1:4173";

type Read = ReturnType<typeof readOverlay>;

const ALERT: Read = {
  open: true,
  title: "Delete this project?",
  descriptions: [
    "Its 412 runs and their logs are deleted. This cannot be undone.",
  ],
  texts: [
    "Delete this project?",
    "Its 412 runs and their logs are deleted. This cannot be undone.",
    "Cancel",
    "Delete project",
  ],
  focused: "Cancel",
};

/** A page that runs the suite's in-page functions by their identity. */
class FakePage {
  href = `${ORIGIN}/`;
  covered = false;
  hits = 0;
  overlay: Read = ALERT;
  async goto(path: string) {
    this.href = ORIGIN + path;
  }
  locator() {
    return { first: () => ({ waitFor: async () => undefined }) };
  }
  async bringToFront() {}
  url() {
    return this.href;
  }
  async waitForTimeout() {}
  async evaluate(fn: unknown): Promise<unknown> {
    if (fn === layCover) {
      this.covered = true;
      this.hits = 0;
      return undefined;
    }
    if (fn === liftCover) {
      const hit = this.covered && this.hits > 0;
      this.covered = false;
      return hit;
    }
    if (fn === readOverlay) return this.overlay;
    return undefined; // the sentinels
  }
  /** guidepup's NVDA helper: a click at the centre of `<body>`. */
  clickBody() {
    if (this.covered) this.hits++;
    else this.href = `${ORIGIN}/`; // the app shell's home link, at 360
  }
}

/** A reader whose speech is scripted, one log entry for each capture, command or step. */
class FakeReader {
  log: string[] = [];
  items: string[] = [];
  calls: string[] = [];
  constructor(
    public said: string[] = [],
    public helper: (page: FakePage) => void = () => undefined,
    public page?: FakePage,
  ) {}
  private speak() {
    const entry = this.said.shift() ?? "";
    this.log.push(entry);
    this.items.push(`item: ${entry}`);
  }
  async capture(action: () => Promise<unknown>) {
    this.calls.push("capture");
    const result = await action();
    this.speak();
    return { result, spokenPhrase: "", itemText: "" };
  }
  async perform() {
    this.calls.push("perform");
    this.speak();
  }
  async next() {
    this.calls.push("next");
    this.speak();
  }
  async previous() {
    this.calls.push("previous");
    this.speak();
  }
  /**
   * 022ad: how each helper call ends, in turn; once none is left, as
   * `helper` says. "hang" is guidepup's item-chooser loop, which spins until
   * `stop()` sets guidepup's stopping flag and its next call throws "VoiceOver
   * not running". While it spins it says `stallSays`, each with its item
   * text, as the loop's VO-I presses do (the review, finding 1). "deaf"
   * hangs outside guidepup's guarded calls, so `stop()` does not end it
   * (finding 4a). A number throws "VoiceOver not running" after so many
   * milliseconds. An Error is thrown at once.
   */
  ends: ("hang" | "deaf" | number | Error)[] = [];
  stallSays: string[] = [];
  /** 022ad: `stop()` never ends, or throws; or `start()` throws. */
  stopHangs = false;
  stopFails?: Error;
  startFails?: Error;
  started: unknown[] = [];
  private stopping?: () => void;
  async navigateToWebContent() {
    this.calls.push("helper");
    const end = this.ends.shift();
    if (end === "hang" || end === "deaf") {
      for (const p of this.stallSays) {
        this.log.push(p);
        this.items.push(`item: ${p}`);
      }
      return new Promise<void>((_, reject) => {
        if (end === "hang")
          this.stopping = () => reject(new Error("VoiceOver not running"));
      });
    }
    if (typeof end === "number") {
      await new Promise((r) => setTimeout(r, end));
      throw new Error("VoiceOver not running");
    }
    if (end) throw end;
    if (this.page) this.helper(this.page);
  }
  async stop() {
    this.calls.push("stop");
    if (this.stopHangs) return new Promise<void>(() => undefined);
    if (this.stopFails) throw this.stopFails;
    this.stopping?.();
    this.stopping = undefined;
  }
  async start(options: unknown) {
    this.calls.push("start");
    this.started.push(options);
    if (this.startFails) throw this.startFails;
  }
  async clearSpokenPhraseLog() {
    this.log = [];
  }
  async clearItemTextLog() {
    this.items = [];
  }
  async spokenPhraseLog() {
    return [...this.log];
  }
  async itemTextLog() {
    return [...this.items];
  }
}

const info = { attach: async () => undefined } as unknown as TestInfo;

function make(
  reader: "nvda" | "voiceover",
  said: string[] = [],
  helper?: (page: FakePage) => void,
  more: Partial<SrOptions> = {},
) {
  const page = new FakePage();
  const fake = new FakeReader(said, helper, page);
  const sr = new Sr(
    page as unknown as Page,
    fake as unknown as ScreenReaderPlaywright,
    info,
    { reader, dry: false, ...more },
  );
  return { sr, page, fake };
}

const x0s = (sr: Sr) =>
  sr.faults.filter((f) => f.rule === "X0").map((f) => f.message);

describe("022q decision 3: open()'s cover, under a fake helper", () => {
  test("NVDA: the helper's click lands on the cover, and nothing faults", async () => {
    const { sr, page, fake } = make("nvda", [], (p) => p.clickBody());
    await sr.open("/view/app-shell/");
    expect(fake.calls).toEqual(["helper"]);
    expect(page.url()).toBe(`${ORIGIN}/view/app-shell/`);
    expect(page.covered).toBe(false); // lifted
    expect(sr.faults).toEqual([]);
  });
  test("NVDA: a helper that clicks nothing is X0, through judge()", async () => {
    const { sr } = make("nvda", [], () => undefined);
    await expect(sr.open("/view/app-shell/")).rejects.toThrow();
    expect(x0s(sr)).toEqual([
      expect.stringContaining("the cover took no click"),
    ]);
  });
  test("a helper that moves the page is X0, through judge()", async () => {
    const { sr } = make("voiceover", [], (p) => {
      p.href = `${ORIGIN}/`;
    });
    await expect(sr.open("/view/app-shell/")).rejects.toThrow();
    expect(x0s(sr)).toEqual([expect.stringContaining("moved the page from")]);
  });
  test("VoiceOver: the helper clicks nothing, and only the URL is checked", async () => {
    const { sr } = make("voiceover", [], () => undefined);
    await sr.open("/view/app-shell/");
    expect(sr.faults).toEqual([]);
  });
});

describe("022q decisions 7 and 8: the captures by reader", () => {
  test("NVDA: one capture for the action and its wait; no item text", async () => {
    const { sr, fake } = make("nvda", ["Copy, button. Copied"]);
    const after = await sr.after(async () => undefined);
    expect(fake.calls).toEqual(["capture"]);
    expect(after).toEqual(["Copy, button. Copied"]);
    expect(Object.keys(sr.windows)).toEqual(["after"]);
  });
  test("VoiceOver: two captures, the stale repeat dropped at the join, and the item text beside", async () => {
    const { sr, fake } = make("voiceover", [
      "Page 6 of 12",
      "Page 6 of 12. You are currently on a button.",
    ]);
    const after = await sr.after(async () => undefined);
    expect(fake.calls).toEqual(["capture", "capture"]);
    expect(after).toEqual(["Page 6 of 12", "You are currently on a button."]);
    expect(sr.windows["after: item text"]).toEqual([
      "item: Page 6 of 12",
      "item: Page 6 of 12. You are currently on a button.",
    ]);
  });
});

describe("022q decision 2: the walk starts in browse mode under NVDA", () => {
  const TRIGGER = { trigger: "Delete project" };
  test("NVDA says Browse mode: one press, then the walk", async () => {
    const { sr, fake } = make("nvda", ["Browse mode", "button, Cancel"]);
    const steps = await sr.steps(1, TRIGGER);
    expect(fake.calls).toEqual(["perform", "next"]);
    expect(sr.windows["steps: browse mode"]).toEqual(["Browse mode"]);
    expect(steps).toEqual(["button, Cancel"]);
    expect(sr.faults).toEqual([]);
  });
  test("NVDA says Focus mode: a second press, then the walk", async () => {
    const { sr, fake } = make("nvda", [
      "Focus mode",
      "Browse mode",
      "button, Cancel",
    ]);
    await sr.steps(1, TRIGGER);
    expect(fake.calls).toEqual(["perform", "perform", "next"]);
    expect(sr.windows["steps: browse mode"]).toEqual([
      "Focus mode",
      "Browse mode",
    ]);
    expect(sr.faults).toEqual([]);
  });
  test("NVDA says Focus mode, then nothing on the second press: X0, through judge()", async () => {
    const { sr } = make("nvda", ["Focus mode", "", "button, Cancel"]);
    await expect(sr.steps(1, TRIGGER)).rejects.toThrow();
    expect(x0s(sr)).toEqual([
      expect.stringContaining(
        'the second NVDA+Space did not say "browse mode"',
      ),
    ]);
  });
  test("NVDA says neither: X0, through judge(), and no walk", async () => {
    const { sr, fake } = make("nvda", [""]);
    await expect(sr.steps(1, TRIGGER)).rejects.toThrow();
    expect(fake.calls).toEqual(["perform"]);
    expect(x0s(sr)).toEqual([
      expect.stringContaining('neither "focus mode" nor "browse mode"'),
    ]);
  });
  test("VoiceOver: no browse-mode step", async () => {
    const { sr, fake } = make("voiceover", ["Cancel button"]);
    await sr.steps(1, TRIGGER);
    expect(fake.calls).toEqual(["next"]);
  });
  test("the overlay closed before the walk: X0 in a real run, through judge()", async () => {
    const { sr, page } = make("voiceover", ["Cancel button"]);
    page.overlay = { ...ALERT, open: false };
    await expect(sr.steps(1, TRIGGER)).rejects.toThrow();
    expect(x0s(sr)).toEqual([
      expect.stringContaining("the overlay closed before the walk"),
    ]);
  });
});

describe("022q decision 1, step 4: one previous() step after a walk that ends on the trigger's name", () => {
  test("the last phrase holds only the trigger's name: one previous() step, recorded apart", async () => {
    const { sr, fake } = make("nvda", [
      "Browse mode",
      "button, Delete project",
      "button, Delete project",
      "button, Cancel",
    ]);
    const steps = await sr.steps(2, { trigger: "Delete project" });
    expect(fake.calls).toEqual(["perform", "next", "next", "previous"]);
    expect(steps).toEqual(["button, Delete project", "button, Delete project"]);
    expect(sr.back).toEqual(["button, Cancel"]);
    expect(sr.windows["steps: back"]).toEqual(["button, Cancel"]);
  });
  // Re-check finding 11: steps() decides by the name O2 judges with, which
  // the test passes, not the DOM's title.
  test("the test's title, not the DOM's, decides the previous() step", async () => {
    const { sr, fake } = make("nvda", [
      "Browse mode",
      "end of Remove the project? alert dialog Delete project",
    ]);
    await sr.steps(1, {
      trigger: "Delete project",
      title: "Remove the project?",
    });
    expect(fake.calls).toEqual(["perform", "next"]);
  });
  test("the last phrase holds an inside text: no previous() step", async () => {
    const { sr, fake } = make("nvda", [
      "Browse mode",
      "button, Delete project",
      "button, Cancel",
    ]);
    await sr.steps(2, { trigger: "Delete project" });
    expect(fake.calls).toEqual(["perform", "next", "next"]);
    expect(sr.back).toEqual([]);
  });
});

describe("022aa: a wait with a bound", () => {
  /** A locator on `page` whose wait ends as `ends` says. */
  const waiting = (page: FakePage, ends: "came" | "timeout" | "crash") =>
    ({
      page: () => page,
      waitFor: async (o: { timeout?: number }) => {
        if (!o.timeout) throw new Error("waited without a bound");
        if (ends === "came") return;
        const e = new Error(ends === "timeout" ? "Timeout exceeded" : "crash");
        if (ends === "timeout") e.name = "TimeoutError";
        throw e;
      },
    }) as unknown as Locator;

  test("it comes: true, and the fact holds", async () => {
    const { sr, page } = make("voiceover");
    expect(await appears(waiting(page, "came"), "the dialog")).toBe(true);
    expect(sr.faults).toEqual([]);
  });
  test("a timeout inside a window: the window is recorded first, then X0 names what and where focus was", async () => {
    const { sr, page } = make("voiceover", ["Dialog"]);
    let ran = false;
    await expect(
      sr.after(async () => {
        await appears(waiting(page, "timeout"), "the dialog");
        ran = true;
      }, "open"),
    ).rejects.toThrow();
    expect(ran).toBe(true);
    expect(Object.keys(sr.windows)).toEqual(["open", "open: item text"]);
    expect(x0s(sr)).toEqual([
      expect.stringMatching(
        /^the dialog was not visible within 10 s; focus was on /,
      ),
    ]);
  });
  test("a timeout inside a window, and then a throw: the X0 is kept and attached (the change review, finding 5)", async () => {
    const page = new FakePage();
    const attached: string[] = [];
    const sr = new Sr(
      page as unknown as Page,
      new FakeReader([], undefined, page) as unknown as ScreenReaderPlaywright,
      {
        attach: async (name: string, o: { body: string }) => {
          attached.push(`${name}: ${o.body}`);
        },
      } as unknown as TestInfo,
      { reader: "voiceover", dry: false },
    );
    await expect(
      sr.after(async () => {
        await appears(waiting(page, "timeout"), "the dialog");
        throw new Error("click: Timeout 10000ms exceeded");
      }, "open"),
    ).rejects.toThrow("click: Timeout 10000ms exceeded");
    expect(x0s(sr)).toEqual([
      expect.stringMatching(/^the dialog was not visible within 10 s/),
    ]);
    expect(attached.at(-1)).toContain("faults.json");
    expect(attached.at(-1)).toContain("the dialog was not visible");
  });
  test("a timeout outside a window fails at once; its own bound is named", async () => {
    const { sr, page } = make("nvda");
    await expect(
      appears(waiting(page, "timeout"), "the summary", { timeout: 2000 }),
    ).rejects.toThrow();
    expect(x0s(sr)).toEqual([
      expect.stringContaining("the summary was not visible within 2 s"),
    ]);
  });
  test("a dry run fails on the fact", async () => {
    const page = new FakePage();
    const sr = new Sr(
      page as unknown as Page,
      new FakeReader() as unknown as ScreenReaderPlaywright,
      info,
      { reader: "dry", dry: true },
    );
    await expect(
      appears(waiting(page, "timeout"), "the menu", { state: "attached" }),
    ).rejects.toThrow(/the menu is attached within 10 s/);
  });
  test("any error but a timeout is thrown on, unchanged", async () => {
    const { sr, page } = make("voiceover");
    await expect(appears(waiting(page, "crash"), "the menu")).rejects.toThrow(
      "crash",
    );
    expect(sr.faults).toEqual([]);
  });
});

describe("022ad: a stalled web-content helper fails fast, by name", () => {
  /** The fixture's start options, and bounds short enough for a unit test. */
  const START = { capture: true };
  const FAST = { start: START, helperMs: 50, restartMs: 50 };
  /** `open()` under VoiceOver, its helper ending as `ends` says, timed. */
  async function opened(
    ends: FakeReader["ends"],
    more: Partial<SrOptions> = FAST,
    set: (fake: FakeReader) => void = () => undefined,
    reader: "nvda" | "voiceover" = "voiceover",
  ) {
    const made = make(reader, [], (p) => p.clickBody(), more);
    made.fake.ends = ends;
    set(made.fake);
    const t0 = Date.now();
    const result = await made.sr.open("/example/chart/variants/").then(
      () => "opened",
      (e: Error) => e.message,
    );
    return { ...made, result, ms: Date.now() - t0 };
  }

  test("the helper stalls, and the restarted helper ends: VoiceOver is restarted once, with the fixture's options, and the test goes on", async () => {
    const { sr, fake, page, result } = await opened(["hang"]);
    expect(result).toBe("opened");
    expect(fake.calls).toEqual(["helper", "stop", "start", "helper"]);
    expect(fake.started).toEqual([START]);
    expect(sr.faults).toEqual([]);
    expect(page.covered).toBe(false);
    expect(sr.windows["open: restart"]).toEqual([
      expect.stringContaining("did not end within 0.05 s"),
    ]);
  });
  test("it stalls again after the restart: X0 within the bounds, naming both", async () => {
    const { sr, fake, page, result, ms } = await opened(["hang", "hang"]);
    expect(result).toContain("rule faults");
    expect(ms).toBeLessThan(2000);
    expect(fake.calls).toEqual(["helper", "stop", "start", "helper"]);
    expect(page.covered).toBe(false);
    expect(x0s(sr)).toEqual([
      expect.stringMatching(
        /^open: navigateToWebContent\(\) did not end within 0\.05 s, and again after VoiceOver was restarted: did not end within 0\.05 s/,
      ),
    ]);
  });
  test('it throws "VoiceOver not running" after a delay: restarted, and it recovers', async () => {
    const { sr, fake, result } = await opened([20]);
    expect(result).toBe("opened");
    expect(fake.calls).toEqual(["helper", "stop", "start", "helper"]);
    expect(sr.windows["open: restart"]).toEqual([
      expect.stringContaining('threw "VoiceOver not running" after'),
    ]);
  });
  test('it throws "VoiceOver not running" twice: X0 names the cause', async () => {
    const { sr, result } = await opened([20, 20]);
    expect(result).toContain("rule faults");
    expect(x0s(sr)).toEqual([
      expect.stringMatching(
        /^open: navigateToWebContent\(\) threw "VoiceOver not running" after .* s, and again after VoiceOver was restarted: threw "VoiceOver not running"/,
      ),
    ]);
  });
  test("the restart's start() fails: X0 names the stall and the restart", async () => {
    const { sr, fake, result } = await opened(["hang"], FAST, (f) => {
      f.startFails = new Error("VoiceOver cannot be started");
    });
    expect(result).toContain("rule faults");
    expect(fake.calls).toEqual(["helper", "stop", "start"]);
    expect(x0s(sr)).toEqual([
      expect.stringMatching(
        /^open: navigateToWebContent\(\) did not end within 0\.05 s; VoiceOver's restart failed: VoiceOver cannot be started/,
      ),
    ]);
  });
  test("the restart's stop() never ends: X0 within its bound, and no start()", async () => {
    const { sr, fake, result, ms } = await opened(["hang"], FAST, (f) => {
      f.stopHangs = true;
    });
    expect(result).toContain("rule faults");
    expect(ms).toBeLessThan(2000);
    expect(fake.calls).toEqual(["helper", "stop"]);
    expect(x0s(sr)).toEqual([
      expect.stringContaining("VoiceOver's restart did not end within 0.05 s"),
    ]);
  });
  // The review, finding 1: what VoiceOver said while the helper stalled is kept.
  test("what VoiceOver said in the stall is kept: the open: stalled window, the last phrase in the X0, and the times on the [sr] line", async () => {
    const log = spyOn(console, "log").mockImplementation(() => undefined);
    try {
      const { sr, result } = await opened(["hang", "hang"], FAST, (f) => {
        f.stallSays = ["Safari", "Notification Centre", "Safari"];
      });
      expect(result).toContain("rule faults");
      expect(sr.windows["open: stalled"]).toEqual([
        "Notification Centre",
        "Safari",
      ]);
      expect(sr.windows["open: stalled: item text"]).toEqual([
        "item: Notification Centre",
        "item: Safari",
      ]);
      expect(x0s(sr)).toEqual([
        expect.stringContaining('; VoiceOver last said "Safari"'),
      ]);
      const line = log.mock.calls.map((c) => String(c[0])).join("\n");
      expect(line).toMatch(
        /\[sr\] .*stall \d+\.\d s, restart \d+\.\d s, helper again \d+\.\d s/,
      );
    } finally {
      log.mockRestore();
    }
  });
  // The review, finding 4a: no second helper, and no start, while the first lives.
  test("the stalled helper does not end on stop(): no start(), and X0 names the restart's bound", async () => {
    const { sr, fake, result, ms } = await opened(["deaf"]);
    expect(result).toContain("rule faults");
    expect(ms).toBeLessThan(2000);
    expect(fake.calls).toEqual(["helper", "stop"]);
    expect(x0s(sr)).toEqual([
      expect.stringContaining("VoiceOver's restart did not end within 0.05 s"),
    ]);
  });
  // The review, finding 4b: a failed stop() starts nothing.
  test("the restart's stop() throws: X0 names it, and no start()", async () => {
    const { sr, fake, result } = await opened(["hang"], FAST, (f) => {
      f.stopFails = new Error(
        "Timed out waiting for VoiceOver to not be running",
      );
    });
    expect(result).toContain("rule faults");
    expect(fake.calls).toEqual(["helper", "stop"]);
    expect(x0s(sr)).toEqual([
      expect.stringContaining(
        "VoiceOver's restart failed: Timed out waiting for VoiceOver to not be running",
      ),
    ]);
  });
  test("NVDA: a stalled helper is X0 at its bound, with no restart, and the cover is lifted", async () => {
    const { sr, fake, page, result, ms } = await opened(
      ["hang"],
      FAST,
      undefined,
      "nvda",
    );
    expect(result).toContain("rule faults");
    expect(ms).toBeLessThan(2000);
    expect(fake.calls).toEqual(["helper"]);
    expect(page.covered).toBe(false);
    expect(x0s(sr)).toEqual([
      "open: navigateToWebContent() did not end within 0.05 s",
    ]);
  });
  test("any other helper error is thrown on, unchanged, with no restart", async () => {
    const { sr, fake, result } = await opened([
      new Error("Unable to focus the application window"),
    ]);
    expect(result).toBe("Unable to focus the application window");
    expect(fake.calls).toEqual(["helper"]);
    expect(sr.faults).toEqual([]);
  });
  test("a helper that ends in time is called once, as before", async () => {
    const { sr, fake, result } = await opened([]);
    expect(result).toBe("opened");
    expect(fake.calls).toEqual(["helper"]);
    expect(sr.windows).toEqual({});
  });
  test("the bounds: a whole stall, restart and second stall fit inside the suite's 5-minute timeout", () => {
    expect(HELPER_MS).toBe(60_000);
    expect(RESTART_MS).toBe(60_000);
    expect(2 * HELPER_MS + RESTART_MS).toBeLessThan(5 * 60_000);
  });
});
