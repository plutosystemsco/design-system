/**
 * 022 test 4, decision 12: the screen-reader rules on fixture windows.
 * Each rule returns its faults, each with a rule id. An empty window, or a
 * failed precondition, is X0: no rule passes on silence.
 */
import { describe, expect, test } from "bun:test";
import {
  B1,
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
  insideTexts,
  joinCaptures,
  lastStepPhrase,
  normalise,
  spokenWhole,
  U1,
  type Overlay,
} from "../sr/rules.ts";

const ids = (faults: { rule: string }[]) => faults.map((f) => f.rule);

/**
 * 022q: three overlays as `Sr.steps()` reads them. The texts, titles and
 * focused elements were read from the built example pages' DOM (Chromium,
 * 2026-11-16): an element's `aria-label` where it has one (the close
 * button's "Close"), else its text.
 */
/** The example project's name, in the alert dialog's title. */
const ALERT_TITLE = "Delete pluto-sandbox?";
const ALERT: Overlay = {
  trigger: "Delete project",
  title: ALERT_TITLE,
  descriptions: [
    "Its 412 runs and their logs are deleted. This cannot be undone.",
  ],
  focused: "Cancel",
  texts: [
    ALERT_TITLE,
    "Its 412 runs and their logs are deleted. This cannot be undone.",
    "Cancel",
    "Delete project",
  ],
};
const DIALOG: Overlay = {
  trigger: "Rename project",
  title: "Rename project",
  descriptions: ["The new name shows everywhere the project is listed."],
  focused: "Name",
  texts: [
    "Rename project",
    "The new name shows everywhere the project is listed.",
    "Name",
    "Cancel",
    "Save",
    "Close",
  ],
};
const SHEET: Overlay = {
  trigger: "Open navigation",
  title: "Navigation",
  descriptions: ["Where to go next."],
  focused: "Overview",
  texts: [
    "Navigation",
    "Where to go next.",
    "Overview",
    "Components",
    "Blocks",
    "Changelog",
    "Close",
  ],
};

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
  test("022q: an inner comma becomes a space, so NVDA's chunks join", () => {
    // NVDA in Firefox (the memo §4): "Previous, page, button".
    expect(normalise("Previous, page, button")).toBe("previous page button");
    expect(normalise("Page,12")).toBe("page 12");
    expect(spokenWhole(["Previous, page, button"], "Previous page")).toBe(true);
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

describe("022q: spoken forms, and VoiceOver's two captures", () => {
  // Toast S3's sentence, as NVDA split its key (the memo §4).
  const S3 = [
    `Message deleted. "Launch window moved" is in Trash. Press F8, or go to Notifications, to reach Undo`,
    `Message deleted. "Launch window moved" is in Trash. Press F 8, or go to Notifications, to reach Undo`,
  ];
  const NVDA_S3 = [
    "Message deleted. “Launch window moved” is in Trash. Press F 8, or go to Notifications, to reach Undo.",
  ];
  test("a spoken-form list passes L1 when any form is spoken whole", () => {
    expect(ids(L1(NVDA_S3, S3))).toEqual([]);
    expect(ids(L1(["Message deleted."], S3))).toEqual(["L1"]);
    expect(
      ids(
        L1(
          ["We sent a new code to ada at example dot com."],
          [
            "We sent a new code to ada@example.com",
            "We sent a new code to ada at example dot com",
          ],
        ),
      ),
    ).toEqual([]);
  });
  test("a spoken-form list faults L2 when any form is spoken before", () => {
    expect(ids(L2(NVDA_S3, NVDA_S3, S3))).toEqual(["L2"]);
    expect(ids(L2(["Delete message, button"], NVDA_S3, S3))).toEqual([]);
  });
  test("a spoken-form list faults L3 and U1 on any form", () => {
    const keys = ["F8", "F 8"];
    expect(ids(L3(["Press F8", "Press F 8"], keys))).toEqual(["L3"]);
    expect(ids(U1(["Press F 8"], keys))).toEqual(["U1"]);
  });
  test("the VoiceOver join drops P1's stale repeat, and only that", () => {
    // P1 under VoiceOver (the memo §6): the wait capture logged the action
    // capture's last phrase again, and L3 faulted.
    const joined = joinCaptures(["Page 6 of 12"], ["Page 6 of 12"]);
    expect(joined).toEqual(["Page 6 of 12"]);
    expect(ids(L3(joined, "Page 6 of 12"))).toEqual([]);
    expect(joinCaptures(["Next page, button"], ["Page 6 of 12."])).toEqual([
      "Next page, button",
      "Page 6 of 12.",
    ]);
    expect(joinCaptures([], ["Page 6 of 12"])).toEqual(["Page 6 of 12"]);
  });
});

describe("022q, after the change review: L3 within one entry, and the join by parts", () => {
  test("L3 faults when one entry holds the message twice, in two of its parts", () => {
    // guidepup joins one capture's speech with ". " (NVDA's one capture).
    expect(ids(L3(["Copied. Copied"], "Copied"))).toEqual(["L3"]);
    expect(ids(L3(["Copy, button. Copied"], "Copied"))).toEqual([]);
    expect(ids(L3(["Copied Copied"], "Copied"))).toEqual([]);
  });
  test("L3 within one entry, for a message that holds a full stop of its own", () => {
    const words =
      'Message deleted. "Launch window moved" is in Trash. Press F8, or go to Notifications, to reach Undo';
    expect(ids(L3([`${words}.`], words))).toEqual([]);
    expect(ids(L3([`${words}. ${words}.`], words))).toEqual(["L3"]);
  });
  test("the join drops a stale repeat when the action capture logged two parts", () => {
    const joined = joinCaptures(
      ["Save, button. Success: Project saved."],
      ["Success: Project saved."],
    );
    expect(joined).toEqual(["Save, button. Success: Project saved."]);
    expect(ids(L3(joined, "Success: Project saved"))).toEqual([]);
  });
  test("the join drops a stale repeat when a hint follows it in the wait capture", () => {
    const joined = joinCaptures(
      ["Page 6 of 12"],
      ["Page 6 of 12. You are currently on a button."],
    );
    expect(joined).toEqual(["Page 6 of 12", "You are currently on a button."]);
    expect(ids(L3(joined, "Page 6 of 12"))).toEqual([]);
  });
  test("the join keeps a wait entry that only begins like the action's last part", () => {
    expect(
      joinCaptures(["Next page, button"], ["Page 6 of 12. Next page, button"]),
    ).toEqual(["Next page, button", "Page 6 of 12. Next page, button"]);
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
  /** One overlay, as `Sr.steps()` reads it from the DOM. */
  const overlay = (o: Partial<Overlay> & { texts: string[] }): Overlay => ({
    trigger: "Edit profile",
    title: "Edit profile",
    descriptions: [],
    focused: "Name",
    ...o,
  });
  const PROFILE = overlay({
    texts: ["Edit profile", "Name", "Save", "Close"],
  });
  test("O2: a walk that reaches the sentinel faults", () => {
    const open = ["Edit profile, dialog", "Name, edit text"];
    const steps = ["Save, button", "Close, button", sentinel];
    expect(ids(O2(open, steps, sentinel, "Edit profile", PROFILE))).toEqual([
      "O2",
    ]);
  });
  test("O2: a walk that moves inside and stays there passes", () => {
    const open = ["Edit profile, dialog", "Name, edit text"];
    const steps = ["Save, button", "Close, button", "Close, button"];
    expect(ids(O2(open, steps, sentinel, "Edit profile", PROFILE))).toEqual([]);
  });
  test("O2: a reader that never left the trigger, which bears the overlay's name, is X0", () => {
    // The Orca rehearsal's log (022 Q9): the reader stayed on the trigger.
    const steps = [
      "Example. heading 2",
      "Edit profile. expanded button. opens dialog",
      "No next.",
      "No next.",
    ];
    expect(ids(O2([], steps, sentinel, "Edit profile", PROFILE))).toEqual([
      "X0",
    ]);
  });
  test("O2: the last step's phrase skips empty entries and VoiceOver's hints", () => {
    expect(
      lastStepPhrase([
        "Close button",
        "",
        "You are currently on a button. To click this button, press Control-Option-Space.",
        "",
      ]),
    ).toBe("Close button");
    expect(lastStepPhrase(["", ""])).toBeUndefined();
  });
  test("O2: inside texts leave out the trigger's name, the overlay's name and description, and any text the trigger's name holds", () => {
    expect(insideTexts(SHEET, "Navigation")).toEqual([
      "Overview",
      "Components",
      "Blocks",
      "Changelog",
      "Close",
    ]);
    expect(insideTexts(ALERT, ALERT_TITLE)).toEqual(["Cancel"]);
  });

  // 022q criterion 1: the memo's walks (§2), verbatim. The memo quotes no
  // `open` window, and run 4's job logs were not available to this build:
  // each `open` window below is CONSTRUCTED from the item's title and its
  // first control, in the reader's wording.
  test("O2, the memo's VoiceOver dialog walk passes", () => {
    const open = ["Rename project, web dialog", "Name, Dart throws, edit text"]; // constructed
    const steps = [
      "Cancel button",
      "Save button",
      ...Array<string>(8).fill("Close button"),
    ];
    expect(ids(O2(open, steps, sentinel, "Rename project", DIALOG))).toEqual(
      [],
    );
  });
  test("O2, the memo's VoiceOver alert-dialog walk passes", () => {
    const open = [`${ALERT_TITLE}, alert dialog`, "Cancel button"]; // constructed
    const steps = [
      "Delete project button",
      "end of Delete pluto-sandbox? … alert dialog",
      ...Array<string>(8).fill(""),
    ];
    expect(ids(O2(open, steps, sentinel, ALERT_TITLE, ALERT))).toEqual([]);
  });
  test("O2, the memo's NVDA sheet walk passes", () => {
    const open = ["Navigation, dialog", "list, with 4 items, link, Overview"]; // constructed
    const steps = [
      "link, Components",
      "link, Blocks",
      "link, Changelog",
      "out of list, button, Close",
      ...Array<string>(6).fill("button, Close"),
    ];
    expect(ids(O2(open, steps, sentinel, "Navigation", SHEET))).toEqual([]);
  });
  test("O2, the memo's NVDA alert-dialog walk passes", () => {
    const open = [`${ALERT_TITLE}, alert dialog`, "Cancel, button"]; // constructed
    const steps = Array<string>(10).fill("button, Delete project");
    // The walk ends on the trigger's name alone, so `steps()` takes one
    // `previous()` step (022q decision 1, step 4). CONSTRUCTED: the
    // element before the dialog's action is Cancel.
    const back = ["button, Cancel"];
    expect(ids(O2(open, steps, sentinel, ALERT_TITLE, ALERT, back))).toEqual(
      [],
    );
  });

  // 022q criterion 1's guards: today's O2 gives each the same verdict
  // (the build's notes run it), and so must the new one.
  test("O2 guard: a walk that enters, speaks two inside texts, then the sentinel, then the end of the document faults", () => {
    // The sheet made non-modal (patch 6), as VoiceOver would leave it.
    const open = ["Navigation, web dialog", "Overview, link"];
    const steps = [
      "Components, link",
      "Blocks, link",
      "end of Navigation, web dialog",
      sentinel,
      "end of web content",
      ...Array<string>(5).fill(""),
    ];
    expect(ids(O2(open, steps, sentinel, "Navigation", SHEET))).toEqual(["O2"]);
  });
  test("O2 guard: ten copies of the focused element's phrase, with a full open window, are X0", () => {
    const open = [
      `${ALERT_TITLE}, alert dialog`,
      "Its 412 runs and their logs are deleted. This cannot be undone.",
      "Cancel button",
    ];
    const steps = Array<string>(10).fill("Cancel button");
    expect(ids(O2(open, steps, sentinel, ALERT_TITLE, ALERT))).toEqual(["X0"]);
  });
  test("O2 guard: a walk that speaks only the trigger's name is X0", () => {
    const open = ["button, Delete project"];
    const steps = Array<string>(10).fill("button, Delete project");
    expect(ids(O2(open, steps, sentinel, ALERT_TITLE, ALERT))).toEqual(["X0"]);
  });
  test("O2 guard: an open window with only the title, then ten copies of the trigger's phrase, is X0", () => {
    const open = ["Navigation"];
    const steps = Array<string>(10).fill("Open navigation button");
    expect(ids(O2(open, steps, sentinel, "Navigation", SHEET))).toEqual(["X0"]);
  });
  // The design lead's ruling (022q decision 1): a reader announces the
  // overlay's description on opening, as it does the title, wherever its
  // cursor stays, so the description leaves "got in" too.
  test("O2 guard: the sheet's open window with its title and description, then ten copies of the trigger's phrase, is X0", () => {
    const open = ["Navigation, dialog, Where to go next."];
    const steps = Array<string>(10).fill("Open navigation button");
    expect(ids(O2(open, steps, sentinel, "Navigation", SHEET))).toEqual(["X0"]);
  });
  test("O2 guard: the alert dialog's open window with its title and description, then ten copies of the trigger's phrase, is X0", () => {
    const open = [
      `${ALERT_TITLE}, alert dialog, Its 412 runs and their logs are deleted. This cannot be undone.`,
    ];
    const steps = Array<string>(10).fill("Delete project, button");
    expect(ids(O2(open, steps, sentinel, ALERT_TITLE, ALERT))).toEqual(["X0"]);
  });
  // The change review's finding 3: three readers that never walked. Each
  // `open` window holds the focused element, as a real one does. The
  // `previous()` step from the real trigger is CONSTRUCTED: the element
  // before the trigger in `<main>` is the first sentinel.
  test("O2 guard (change review): the sheet's whole open window, then ten copies of the trigger's phrase, is X0", () => {
    const open = [
      "Navigation, dialog, Where to go next.",
      "list, with 4 items, link, Overview",
    ];
    const steps = Array<string>(10).fill("Open navigation button");
    expect(
      ids(O2(open, steps, sentinel, "Navigation", SHEET, [sentinel])),
    ).toEqual(["X0"]);
  });
  test("O2 guard (change review): ten copies of the focused button's phrase holding the title is X0", () => {
    const open = [`${ALERT_TITLE}, alert dialog`, "Cancel button"];
    const steps = Array<string>(10).fill(
      `Cancel, button, ${ALERT_TITLE}, alert dialog`,
    );
    expect(ids(O2(open, steps, sentinel, ALERT_TITLE, ALERT))).toEqual(["X0"]);
  });
  test("O2 guard (change review): ten copies of the trigger's phrase, with no inside text before it, is X0", () => {
    const open = [`${ALERT_TITLE}, alert dialog`, "Cancel button"];
    const steps = Array<string>(10).fill("Delete project, button");
    expect(
      ids(O2(open, steps, sentinel, ALERT_TITLE, ALERT, [sentinel])),
    ).toEqual(["X0"]);
  });
  test("O2 (change review): a walk that ends on the dialog's own Delete project, with Cancel before it, passes", () => {
    const open = [`${ALERT_TITLE}, alert dialog`, "Cancel button"];
    const steps = Array<string>(10).fill("Delete project, button");
    expect(
      ids(O2(open, steps, sentinel, ALERT_TITLE, ALERT, ["Cancel, button"])),
    ).toEqual([]);
  });
  test("O2 (change review): trigger-name containment is by whole words, so Name stays an inside text", () => {
    expect(insideTexts(DIALOG, "Rename project")).toEqual([
      "Name",
      "Cancel",
      "Save",
      "Close",
    ]);
  });
  // The rebuild's conflict, ruled 2026-11-16 (022q decision 1, step 4): the
  // last phrase also proves the stall when it is VoiceOver's boundary of
  // the overlay, beginning "end of" and holding the overlay's name. The
  // memo's VoiceOver alert-dialog walk (above) ends so. These two guards
  // keep the rule that narrow.
  test("O2 guard (the boundary ruling): a sheet walk ending on the trigger's phrase, which holds the title, is X0", () => {
    const open = [
      "Navigation, dialog, Where to go next.",
      "list, with 4 items, link, Overview",
    ];
    const steps = [
      "link, Components",
      "link, Blocks",
      ...Array<string>(8).fill("Open navigation button"),
    ];
    // "Navigation" is the title, but the phrase is not "end of" it, and
    // the `previous()` step speaks no inside text.
    expect(ids(O2(open, steps, sentinel, "Navigation", SHEET))).toEqual(["X0"]);
    expect(
      ids(O2(open, steps, sentinel, "Navigation", SHEET, [sentinel])),
    ).toEqual(["X0"]);
  });
  test("O2 guard (the boundary ruling): a last phrase of end of main, not the overlay's name, is X0", () => {
    const open = [`${ALERT_TITLE}, alert dialog`, "Cancel button"];
    const steps = [
      "Delete project button",
      "end of main",
      ...Array<string>(8).fill(""),
    ];
    expect(ids(O2(open, steps, sentinel, ALERT_TITLE, ALERT))).toEqual(["X0"]);
  });
  // 022q's change review, re-check finding 9: VoiceOver ends every
  // navigation landmark with the word "navigation", the sheet's title, so a
  // boundary must begin "end of" the overlay's name and be a dialog's.
  test("O2 guard (re-check finding 9): the end of a landmark that holds the title is X0", () => {
    const open = [
      "Navigation, dialog, Where to go next.",
      "list, with 4 items, link, Overview",
    ];
    const landmark = [
      "Open navigation button",
      "end of Site navigation",
      ...Array<string>(8).fill(""),
    ];
    expect(ids(O2(open, landmark, sentinel, "Navigation", SHEET))).toEqual([
      "X0",
    ]);
    const nine = [
      "Open navigation button",
      ...Array<string>(9).fill("end of navigation"),
    ];
    expect(ids(O2(open, nine, sentinel, "Navigation", SHEET))).toEqual(["X0"]);
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

describe("026 test 76: unspoken (U1) and before (B1)", () => {
  // The toast's phrases as VoiceOver and as NVDA say them (026 decision 20).
  const vo = [
    "Save, button",
    "Success: Project saved.",
    "Message deleted. Press F8, or go to Notifications, to reach Undo.",
  ];
  const nvda = [
    "Save  button",
    "Success: Project saved",
    "Message deleted. Press F8, or go to Notifications, to reach Undo",
  ];
  test("U1: a word never spoken passes; one spoken fails, in both readers", () => {
    for (const log of [vo, nvda]) {
      expect(ids(U1(log, "Dismiss"))).toEqual([]);
      expect(ids(U1([...log, "Dismiss, button"], "Dismiss"))).toEqual(["U1"]);
    }
    expect(ids(U1([], "Dismiss"))).toEqual(["X0"]);
  });
  test("B1: first, whole, then the message passes; the reverse fails; no message is X0", () => {
    for (const log of [vo, nvda]) {
      expect(ids(B1(log, "Save", "Success: Project saved"))).toEqual([]);
      expect(
        ids(B1([...log].reverse(), "Save", "Success: Project saved")),
      ).toEqual(["B1"]);
    }
    expect(
      ids(
        B1(
          ["Toast, heading level 1, Project created"],
          "Toast",
          "Project created",
        ),
      ),
    ).toEqual([]);
    expect(ids(B1(vo, "Save", "Success: Project deleted"))).toEqual(["X0"]);
  });
});
