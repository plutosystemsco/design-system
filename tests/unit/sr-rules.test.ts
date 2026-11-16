/**
 * 022 test 4, decision 12: the screen-reader rules on fixture windows.
 * Each rule returns its faults, each with a rule id. An empty window, or a
 * failed precondition, is X0: no rule passes on silence.
 */
import { describe, expect, test } from "bun:test";
import {
  C1,
  C2,
  F1,
  L1,
  L2,
  L3,
  L4,
  O1,
  O2,
  O3,
  O3s,
  T1,
  T2,
  normalise,
  spokenWhole,
} from "../sr/rules.ts";

const ids = (faults: { rule: string }[]) => faults.map((f) => f.rule);

/** 019 decision 12's insertion, as VoiceOver spoke it in the owner's listen. */
const TITLE = "There is a problem";
const ERRORS = [
  "Enter a project name",
  "Enter the owner's email address",
  "Choose who can see the project",
];
const PASS_019 = [
  "There is a problem, heading level 2",
  "Enter a project name, link",
  "Enter the owner’s email address, link",
  "Choose who can see the project, link",
];

describe("normalisation", () => {
  test("NFKC, lower case, quotes dropped, whitespace collapsed, one final mark dropped", () => {
    expect(normalise("  “Couldn’t  save.”  ")).toBe("couldnt save");
    expect(normalise("Ｓａｖｅｄ!")).toBe("saved");
    expect(normalise("Saved..")).toBe("saved.");
  });
  test("a curly apostrophe matches a straight one", () => {
    expect(
      spokenWhole(
        ["Enter the owner’s email address"],
        "Enter the owner's email address",
      ),
    ).toBe(true);
  });
  test("a message split across two adjacent phrases is spoken whole", () => {
    expect(
      spokenWhole(
        ["Enter the owner's", "email address"],
        "Enter the owner's email address",
      ),
    ).toBe(true);
  });
  test("a message split across two phrases with another between is not", () => {
    expect(
      spokenWhole(
        ["Enter the owner's", "link", "email address"],
        "Enter the owner's email address",
      ),
    ).toBe(false);
  });
});

describe("L1 to L4: a live message", () => {
  test("019's pass case: the title and every message spoken whole, the title once", () => {
    expect(ids(L1(PASS_019, TITLE))).toEqual([]);
    for (const m of ERRORS) expect(ids(L1(PASS_019, m))).toEqual([]);
    expect(ids(L3(PASS_019, TITLE))).toEqual([]);
  });
  test("019's fail case: the title read twice in a row fails L3", () => {
    const twice = [
      "There is a problem",
      "alert There is a problem",
      ...PASS_019.slice(1),
    ];
    expect(ids(L3(twice, TITLE))).toEqual(["L3"]);
  });
  test("a message cut off fails L1", () => {
    expect(ids(L1(["Enter the owner's email"], ERRORS[1]!))).toEqual(["L1"]);
  });
  test("an empty after window is X0 for every rule", () => {
    expect(ids(L1([], TITLE))).toEqual(["X0"]);
    expect(ids(L2([], [], TITLE))).toEqual(["X0"]);
    expect(ids(L3([], TITLE))).toEqual(["X0"]);
    expect(ids(L4([], TITLE, true))).toEqual(["X0"]);
    expect(ids(F1([], "Project name"))).toEqual(["X0"]);
    expect(ids(O1([], "Edit profile"))).toEqual(["X0"]);
    expect(ids(O3([], "Open", true))).toEqual(["X0"]);
    expect(ids(O3s([], "Share", true))).toEqual(["X0"]);
    expect(ids(T1([], "Add", "Add to library"))).toEqual(["X0"]);
    expect(ids(C1([], ["a", "b", "c"]))).toEqual(["X0"]);
  });
  test("L2: an empty before window passes while L1 holds; the message before the action fails", () => {
    expect(ids(L2([], PASS_019, TITLE))).toEqual([]);
    expect(ids(L2(["There is a problem"], PASS_019, TITLE))).toEqual(["L2"]);
  });
  test("L2's precondition: L1 must hold after", () => {
    expect(ids(L2([], ["something else"], TITLE))).toEqual(["X0"]);
  });
  test("L4: the promised repeat, spoken whole again", () => {
    expect(ids(L4(["Copied"], "Copied", true))).toEqual([]);
    expect(ids(L4(["Copy, button"], "Copied", true))).toEqual(["L4"]);
    expect(ids(L4(["Copied"], "Copied", false))).toEqual(["X0"]);
  });
});

describe("F1: a focus move", () => {
  test("the target's name spoken whole passes; another name fails", () => {
    expect(ids(F1(["Project name, edit text"], "Project name"))).toEqual([]);
    expect(ids(F1(["Owner, edit text"], "Project name"))).toEqual(["F1"]);
  });
});

describe("O1 to O3s: overlays", () => {
  test("O1: the dialog's title is spoken", () => {
    expect(ids(O1(["Edit profile, dialog"], "Edit profile"))).toEqual([]);
    expect(ids(O1(["dialog"], "Edit profile"))).toEqual(["O1"]);
  });
  const sentinel = "sentinel 0a1b2c3d";
  test("O2: ten steps that reach the sentinel fail", () => {
    const steps = [
      "Edit profile, dialog",
      "Name",
      "Save, button",
      "Close, button",
      sentinel,
    ];
    expect(ids(O2(steps, sentinel, "Edit profile"))).toEqual(["O2"]);
  });
  test("O2: ten steps that stay inside pass", () => {
    const steps = [
      "Edit profile, dialog",
      "Name, edit text",
      "Save, button",
      "Close, button",
      "Edit profile, dialog",
    ];
    expect(ids(O2(steps, sentinel, "Edit profile"))).toEqual([]);
    expect(ids(O2(steps, sentinel, "Edit profile", ["Save"]))).toEqual([]);
  });
  test("O2: a reader that never left the trigger, which bears the overlay's name, is X0", () => {
    // The Orca rehearsal's log: the reader stayed on the trigger and ran out.
    const steps = [
      "Example. heading 2",
      "Edit profile. expanded button. opens dialog",
      "No next.",
      "No next.",
    ];
    expect(ids(O2(steps, sentinel, "Edit profile", ["Save", "Name"]))).toEqual([
      "X0",
    ]);
  });
  test("O2: fewer than three distinct phrases is X0", () => {
    const steps = [
      "Edit profile, dialog",
      "Edit profile, dialog",
      "",
      "Close, button",
    ];
    expect(ids(O2(steps, sentinel, "Edit profile"))).toEqual(["X0"]);
  });
  test("O2: no phrase with the overlay's name is X0", () => {
    expect(ids(O2(["a", "b", "c"], sentinel, "Edit profile"))).toEqual(["X0"]);
  });
  test("O3: focus not returned fails", () => {
    expect(ids(O3(["Open, button"], "Open", false))).toEqual(["O3"]);
    expect(ids(O3(["body"], "Open", true))).toEqual(["O3"]);
    expect(ids(O3(["Open, button"], "Open", true))).toEqual([]);
  });
  test("O3s: a sub-menu's Escape speaks the parent item, focus on it", () => {
    expect(ids(O3s(["Share, submenu, menu item"], "Share", true))).toEqual([]);
    expect(ids(O3s(["Copy link, menu item"], "Share", true))).toEqual(["O3s"]);
  });
});

describe("T1, T2: a tooltip", () => {
  test("T1: the trigger's name and the tooltip's text, each whole", () => {
    expect(
      ids(T1(["Add, button", "Add to library"], "Add", "Add to library")),
    ).toEqual([]);
    expect(ids(T1(["Add, button"], "Add", "Add to library"))).toEqual(["T1"]);
  });
  test("T2: content gone after Escape and focus on the trigger; X0 if it never opened", () => {
    expect(ids(T2({ wasOpen: true, gone: true, focused: true }))).toEqual([]);
    expect(ids(T2({ wasOpen: true, gone: false, focused: true }))).toEqual([
      "T2",
    ]);
    expect(ids(T2({ wasOpen: false, gone: true, focused: true }))).toEqual([
      "X0",
    ]);
  });
});

describe("C1, C2: the chart", () => {
  const order = ["Monthly visitors", "Visitors by month", "Month"];
  test("C1: the figure's name, the caption, the first header, in that order", () => {
    const steps = [
      "Monthly visitors, figure",
      "table, Visitors by month",
      "Month, column header",
    ];
    expect(ids(C1(steps, order))).toEqual([]);
  });
  test("C1: the caption out of order fails", () => {
    const steps = [
      "table, Visitors by month",
      "Monthly visitors, figure",
      "Month, column header",
    ];
    expect(ids(C1(steps, order))).toEqual(["C1"]);
  });
  test("C2: a tooltip text in the steps fails; X0 unless C1 holds", () => {
    const steps = [
      "Monthly visitors, figure",
      "Desktop 186",
      "table, Visitors by month",
      "Month",
    ];
    expect(ids(C2(steps, ["Desktop 186"], true))).toEqual(["C2"]);
    expect(ids(C2(steps, ["Mobile 80"], true))).toEqual([]);
    expect(ids(C2(steps, ["Mobile 80"], false))).toEqual(["X0"]);
  });
});

describe("the two readers' wordings both pass", () => {
  test("a heading and a dialog, as VoiceOver and as NVDA say them", () => {
    const vo = [
      "heading level 2 There is a problem",
      "Edit profile, web dialog",
    ];
    const nvda = [
      "There is a problem, heading, level 2",
      "Edit profile  dialog",
    ];
    for (const log of [vo, nvda]) {
      expect(ids(L1(log, TITLE))).toEqual([]);
      expect(ids(O1(log, "Edit profile"))).toEqual([]);
    }
  });
  test("a status, as VoiceOver and as NVDA say it", () => {
    expect(ids(L1(["Copied"], "Copied"))).toEqual([]);
    expect(ids(L1(["status  Copied"], "Copied"))).toEqual([]);
  });
});
