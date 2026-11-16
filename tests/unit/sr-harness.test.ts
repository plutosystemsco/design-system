/**
 * 022q, the change review's finding 5: `Sr` driven by a fake reader and a
 * fake page, as NVDA and as VoiceOver, so its reader-only paths are proven
 * before a runner reaches them. The fake logs one entry for each capture,
 * command or step, as guidepup does.
 *
 * Covered: the cover's two X0s (decision 3); the captures by reader and
 * VoiceOver's item text (decisions 7 and 8); the browse-mode step's three
 * outcomes (decision 2); the still-open X0 (decision 2); and the
 * `previous()` step after a walk that ends on the trigger's name alone
 * (decision 1, step 4).
 */
import { describe, expect, test } from "bun:test";
import type { ScreenReaderPlaywright } from "@guidepup/playwright";
import type { Page, TestInfo } from "@playwright/test";
import { layCover, liftCover } from "../sr/cover.ts";
import { readOverlay, Sr } from "../sr/sr.ts";

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
  async navigateToWebContent() {
    this.calls.push("helper");
    if (this.page) this.helper(this.page);
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
) {
  const page = new FakePage();
  const fake = new FakeReader(said, helper, page);
  const sr = new Sr(
    page as unknown as Page,
    fake as unknown as ScreenReaderPlaywright,
    info,
    { reader, dry: false },
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
