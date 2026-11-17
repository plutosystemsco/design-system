/**
 * 022 decision 12: the screen-reader rules. Each takes captured phrases (a
 * window) and returns its faults, each with a rule id. Rules match
 * normalised text, never a whole log: VoiceOver and NVDA word the same thing
 * differently.
 *
 * X0, nothing to judge: every rule states the window it reads and a
 * positive precondition. If the window is empty, or the precondition fails,
 * the rule returns X0, and the test fails. No rule passes on silence.
 *
 * This file imports nothing, so unit tests and the report read it alone.
 */

export type RuleId =
  | "X0"
  | "L1"
  | "L2"
  | "L3"
  | "L4"
  | "F1"
  | "O1"
  | "O2"
  | "O3"
  | "O3s"
  | "T1"
  | "T2"
  | "C1"
  | "C2"
  | "U1"
  | "B1";

export const RULE_IDS: RuleId[] = [
  "L1",
  "L2",
  "L3",
  "L4",
  "F1",
  "O1",
  "O2",
  "O3",
  "O3s",
  "T1",
  "T2",
  "C1",
  "C2",
  "U1",
  "B1",
];

export type Fault = { rule: RuleId; message: string };

/** The before window: captured for 2 s after the page is ready, before the action. */
export const BEFORE_MS = 2000;
/** The after window: from the action, 6 s (019's SETTLE_MS). */
export const AFTER_MS = 6000;

/**
 * 1. Unicode NFKC. 2. Lower case. 3. Drop straight and curly quotes and
 * apostrophes. 4. Turn every comma into a space (022q decision 5: NVDA
 * joins speech chunks with commas, "Previous, page, button"; no expected
 * text needs one). 5. Collapse whitespace to one space, and trim. 6. Drop
 * one final `.`, `,`, `;`, `:`, `!` or `?`.
 */
export function normalise(s: string): string {
  return s
    .normalize("NFKC")
    .toLowerCase()
    .replace(/['"‘’“”]/g, "")
    .replace(/,/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[.,;:!?]$/, "");
}

/**
 * 022q decision 5: a text a rule looks for, or a list of its spoken forms,
 * where a reader says a symbol or a key aloud ("ada at example dot com",
 * "F 8"). Each test that needs a list states its forms; no rule guesses one.
 */
export type Spoken = string | readonly string[];

const formsOf = (text: Spoken): string[] =>
  typeof text === "string" ? [text] : [...text];
const shown = (text: Spoken): string =>
  formsOf(text)
    .map((f) => `"${f}"`)
    .join(" or ");

/**
 * Where `text` is spoken whole in `phrases`: the index of the first phrase
 * whose normalised form holds it, or which, joined to the next by one
 * space, holds it. -1 if it is not.
 */
export function spokenAt(phrases: string[], text: string): number {
  const want = normalise(text);
  if (!want) return -1;
  const n = phrases.map(normalise);
  for (let i = 0; i < n.length; i++) {
    if (n[i]!.includes(want)) return i;
    if (i + 1 < n.length && `${n[i]} ${n[i + 1]}`.includes(want)) return i;
  }
  return -1;
}

/** An expected text, or any of its spoken forms, is spoken whole in a window. */
export function spokenWhole(phrases: string[], text: Spoken): boolean {
  return formsOf(text).some((f) => spokenAt(phrases, f) >= 0);
}

/** Whether one phrase holds the text, or any of its forms, normalised. */
const holds = (phrase: string, text: Spoken): boolean => {
  const n = normalise(phrase);
  return formsOf(text).some((f) => {
    const want = normalise(f);
    return want !== "" && n.includes(want);
  });
};

/** guidepup joins one capture's speech into one log entry, its parts joined by ". ". */
const partsOf = (entry: string): string[] => entry.split(". ");

/**
 * 022q decision 7: VoiceOver's window is two captures, the action's and
 * the wait's. guidepup logs VoiceOver's last phrase again once its skip of
 * the previous phrase ends. Amended after the change review (finding 4):
 * the drop compares parts, not entries. It removes the longest run of
 * parts at the start of the wait capture's first entry that equals,
 * normalised, the run at the end of the action capture's last entry. A
 * real repeat at that join is then not counted.
 */
export function joinCaptures(action: string[], wait: string[]): string[] {
  const last = action.at(-1);
  const first = wait[0];
  if (last === undefined || first === undefined) return [...action, ...wait];
  const tail = partsOf(last).map(normalise);
  const head = partsOf(first);
  const headN = head.map(normalise);
  let k = Math.min(tail.length, head.length);
  for (; k > 0; k--)
    if (
      tail
        .slice(tail.length - k)
        .every((part, i) => part !== "" && part === headN[i])
    )
      break;
  if (k === 0) return [...action, ...wait];
  const rest = head.slice(k).join(". ");
  return [...action, ...(rest === "" ? [] : [rest]), ...wait.slice(1)];
}

const nonEmpty = (w: string[]) => w.some((p) => normalise(p) !== "");
const x0 = (why: string): Fault[] => [{ rule: "X0", message: why }];
const fault = (rule: RuleId, message: string): Fault[] => [{ rule, message }];

/** L1. The message, in any of its spoken forms, is spoken whole (after). */
export function L1(after: string[], message: Spoken): Fault[] {
  if (!nonEmpty(after)) return x0("L1: the after window is empty");
  return spokenWhole(after, message)
    ? []
    : fault("L1", `${shown(message)} was not spoken whole`);
}

/** L2. No form of the message is spoken before the action (before), while L1 holds. */
export function L2(
  before: string[],
  after: string[],
  message: Spoken,
): Fault[] {
  if (!nonEmpty(after) || !spokenWhole(after, message))
    return x0(
      "L2: L1 does not hold, so the reader's silence before proves nothing",
    );
  return spokenWhole(before, message)
    ? fault("L2", `${shown(message)} was spoken before the action`)
    : [];
}

/**
 * Whether one entry holds the message, in any form, whole twice, in two of
 * its parts: two places that do not overlap, with a part boundary (the
 * ". " guidepup joins parts with) between them. Compared normalised.
 */
const heldTwice = (entry: string, message: Spoken): boolean => {
  const n = normalise(entry);
  const at: { start: number; end: number }[] = [];
  for (const form of formsOf(message)) {
    const want = normalise(form);
    if (!want) continue;
    for (let i = n.indexOf(want); i >= 0; i = n.indexOf(want, i + 1))
      at.push({ start: i, end: i + want.length });
  }
  return at.some((a) =>
    at.some((b) => a.end <= b.start && n.slice(a.end, b.start).includes(".")),
  );
};

/**
 * L3. No two adjacent phrases each contain the message, in any form, whole
 * (after). Amended after the change review (finding 2): nor does one entry
 * hold it whole twice, in two of its parts. Under NVDA's one capture every
 * window is one entry, so without this L3 could never fault there.
 */
export function L3(after: string[], message: Spoken): Fault[] {
  if (!nonEmpty(after) || !spokenWhole(after, message))
    return x0("L3: L1 does not hold");
  for (let i = 1; i < after.length; i++)
    if (holds(after[i - 1]!, message) && holds(after[i]!, message))
      return fault(
        "L3",
        `${shown(message)} was read twice in a row (phrases ${i} and ${i + 1})`,
      );
  const twice = after.findIndex((p) => heldTwice(p, message));
  if (twice >= 0)
    return fault(
      "L3",
      `${shown(message)} was read twice within phrase ${twice + 1}`,
    );
  return [];
}

/** L4. A promised repeat: spoken whole again on the identical second trigger. */
export function L4(
  second: string[],
  message: Spoken,
  firstHeld: boolean,
): Fault[] {
  if (!firstHeld) return x0("L4: L1 did not hold on the first trigger");
  if (!nonEmpty(second)) return x0("L4: the second after window is empty");
  return spokenWhole(second, message)
    ? []
    : fault(
        "L4",
        `${shown(message)} was not spoken again on the second trigger`,
      );
}

/** F1. The focus target's accessible name (for a heading, its text) is spoken whole. */
export function F1(after: string[], name: Spoken): Fault[] {
  if (!nonEmpty(after)) return x0("F1: the after window is empty");
  return spokenWhole(after, name)
    ? []
    : fault("F1", `the focus target ${shown(name)} was not spoken whole`);
}

/** O1. The overlay's name is spoken whole: a dialog's title, a menu's first item. */
export function O1(after: string[], name: string): Fault[] {
  if (!nonEmpty(after)) return x0("O1: the after window is empty");
  return spokenWhole(after, name)
    ? []
    : fault("O1", `the overlay's name "${name}" was not spoken whole`);
}

/**
 * 022q decision 1: what `Sr.steps()` reads from the DOM before it walks an
 * open overlay.
 */
export type Overlay = {
  /** The trigger's accessible name, as the test gives it. */
  trigger: string;
  /** The overlay's own name in the DOM: its `aria-labelledby` text, or `aria-label`. */
  title: string;
  /** The overlay's description: its `aria-describedby` texts. */
  descriptions: string[];
  /**
   * The overlay texts: the visible texts of elements inside the overlay,
   * found by DOM containment (`h1`–`h4`, `[role="heading"]`, `p`, `label`,
   * `button`, `a`, `li`, and the elements its `aria-labelledby` and
   * `aria-describedby` name). An element with an `aria-label` gives that.
   */
  texts: string[];
  /** The accessible text of the element focused when the walk began. */
  focused: string;
};

/**
 * 022q decision 1: the inside texts, the overlay texts less four kinds:
 * the trigger's name; the overlay's own name (`name`, and its title in the
 * DOM); its description (`aria-describedby`); and any text the trigger's
 * name contains as whole words. A reader announces the title and the description as the
 * overlay opens wherever its cursor stays, and a phrase on the trigger
 * holds every word of the trigger's name: none proves the cursor went in.
 * Compared normalised.
 */
export function insideTexts(overlay: Overlay, name: string): string[] {
  // Amended after the change review (finding 7): by whole words, so "Name"
  // inside "Rename project" stays an inside text.
  const trigger = ` ${normalise(overlay.trigger)} `;
  const own = new Set(
    [name, overlay.title, ...overlay.descriptions].map(normalise),
  );
  return overlay.texts.filter((t) => {
    const n = normalise(t);
    return n !== "" && !own.has(n) && !trigger.includes(` ${n} `);
  });
}

/** VoiceOver's hint after a move ("You are currently on a button…"), not the item. */
const isHint = (p: string) => normalise(p).startsWith("you are currently on");

/**
 * 022q decision 1: the last step's phrase, the last non-empty step entry
 * that is not a VoiceOver hint. Undefined if there is none.
 */
export function lastStepPhrase(steps: string[]): string | undefined {
  return steps.findLast((p) => normalise(p) !== "" && !isHint(p));
}

/**
 * 022q decision 1, step 4 (the rebuild's conflict, ruled 2026-11-16):
 * VoiceOver's boundary of the overlay itself, a phrase that begins "end of"
 * and then the overlay's name (`name`, or its title in the DOM), and names a
 * dialog, compared normalised. VoiceOver speaks it only at the end of the container its
 * cursor is in. The title alone, which a phrase on the trigger can hold,
 * proves nothing.
 */
const isBoundary = (phrase: string, overlay: Overlay, name: string) => {
  const n = normalise(phrase);
  return (
    // The re-check's finding 9: "end of" the overlay's name itself, and a
    // dialog's, since VoiceOver ends a navigation landmark with the word
    // "navigation", which can be the title.
    n.includes("dialog") &&
    [name, overlay.title].some(
      (t) => normalise(t) !== "" && n.startsWith(`end of ${normalise(t)}`),
    )
  );
};

/**
 * The last step's phrase, and whether it holds an inside text or the
 * trigger's name, or is VoiceOver's boundary of the overlay.
 */
function stall(steps: string[], overlay: Overlay, name: string) {
  const last = lastStepPhrase(steps);
  const inside = insideTexts(overlay, name);
  return {
    last,
    inside: last !== undefined && inside.some((t) => holds(last, t)),
    boundary: last !== undefined && isBoundary(last, overlay, name),
    trigger: last !== undefined && holds(last, overlay.trigger),
  };
}

/**
 * 022q decision 1, step 4: the walk ended on the trigger's name and no
 * inside text, so `Sr.steps()` takes one `previous()` step after it.
 */
export function needsBack(
  steps: string[],
  overlay: Overlay,
  name: string,
): boolean {
  const s = stall(steps, overlay, name);
  return s.trigger && !s.inside && !s.boundary;
}

/**
 * O2. Modal containment: the sentinel is never spoken in ten `next()`
 * steps. 022q decision 1: it judges in this order, and stops at the first
 * that decides.
 *
 * 1. Got in: the `open` window or a step speaks an inside text. Else X0.
 * 2. Moved: a step speaks an inside text other than the focused element's,
 *    or the trigger's name. Else X0. Amended after the change review
 *    (finding 3): the title, the description and texts inside the
 *    trigger's name no longer count, since a reader speaks them from the
 *    trigger or as the overlay opens. The `open` window always holds
 *    speech once focus lands inside, so it cannot prove a walk.
 * 3. The sentinel: a step speaks it, and O2 faults. A non-modal overlay
 *    faults here, before any stall evidence is asked for.
 * 4. The stall: the last step's phrase holds an inside text or the
 *    trigger's name, so the walk ended inside. Else X0. If it holds the
 *    trigger's name and no inside text, `back`, the one `previous()` step
 *    taken after the walk, must speak an inside text, else X0: inside an
 *    alert dialog whose action is named as its trigger is, the real
 *    trigger and the action read the same, and only the element before
 *    the action tells them apart. The last phrase also proves the stall
 *    when it is VoiceOver's boundary of the overlay: it begins "end of"
 *    and holds the overlay's name (ruled 2026-11-16).
 */
export function O2(
  open: string[],
  steps: string[],
  sentinel: string,
  name: string,
  overlay: Overlay,
  back: string[] = [],
): Fault[] {
  const inside = insideTexts(overlay, name);
  const spokeInside = (w: string[]) => inside.some((t) => spokenWhole(w, t));
  if (!spokeInside(open) && !spokeInside(steps))
    return x0(
      inside.length
        ? `O2: neither the open window nor a step spoke an inside text (${inside.map((t) => `"${t}"`).join(", ")})`
        : "O2: the overlay has no inside text to prove the reader got in",
    );
  // Every inside text the focused element's own text holds is its.
  const focused = normalise(overlay.focused);
  const others = inside.filter((t) => {
    const n = normalise(t);
    return !(focused !== "" && focused.includes(n));
  });
  const moved = steps.some(
    (p) => others.some((t) => holds(p, t)) || holds(p, overlay.trigger),
  );
  if (!moved)
    return x0(
      `O2: no step spoke an inside text other than the focused element's ("${overlay.focused}"), or the trigger's name, so the walk never moved`,
    );
  if (spokenWhole(steps, sentinel))
    return fault(
      "O2",
      "the page behind the modal was reached: the sentinel was spoken",
    );
  const end = stall(steps, overlay, name);
  if (end.inside || end.boundary) return [];
  if (end.trigger)
    return spokeInside(back)
      ? []
      : x0(
          `O2: the walk ended on the trigger's name ("${end.last}"), and the step before it (${back.length ? back.map((p) => `"${p}"`).join(", ") : "none"}) spoke no inside text`,
        );
  return x0(
    `O2: the last step's phrase (${end.last === undefined ? "none" : `"${end.last}"`}) holds no inside text and not the trigger's name, and is not VoiceOver's end of the overlay, so the walk did not end inside`,
  );
}

/** O3. Escape returns: the trigger's name is spoken whole, and it has focus. */
export function O3(
  after: string[],
  triggerName: string,
  triggerFocused: boolean,
): Fault[] {
  if (!nonEmpty(after)) return x0("O3: the after window is empty");
  const out: Fault[] = [];
  if (!spokenWhole(after, triggerName))
    out.push({
      rule: "O3",
      message: `the trigger "${triggerName}" was not spoken after Escape`,
    });
  if (!triggerFocused)
    out.push({
      rule: "O3",
      message: `focus is not on the trigger "${triggerName}"`,
    });
  return out;
}

/** O3s. A sub-menu's Escape speaks its parent item's name, and focus is on it. */
export function O3s(
  after: string[],
  parentName: string,
  parentFocused: boolean,
): Fault[] {
  if (!nonEmpty(after)) return x0("O3s: the after window is empty");
  const out: Fault[] = [];
  if (!spokenWhole(after, parentName))
    out.push({
      rule: "O3s",
      message: `the parent item "${parentName}" was not spoken after Escape`,
    });
  if (!parentFocused)
    out.push({
      rule: "O3s",
      message: `focus is not on the parent item "${parentName}"`,
    });
  return out;
}

/** T1. Focusing a tooltip's trigger speaks its name and the tooltip's text, each whole. */
export function T1(
  after: string[],
  triggerName: string,
  tipText: string,
): Fault[] {
  if (!nonEmpty(after)) return x0("T1: the after window is empty");
  const out: Fault[] = [];
  if (!spokenWhole(after, triggerName))
    out.push({
      rule: "T1",
      message: `the trigger "${triggerName}" was not spoken whole`,
    });
  if (!spokenWhole(after, tipText))
    out.push({
      rule: "T1",
      message: `the tooltip "${tipText}" was not spoken whole`,
    });
  return out;
}

/** T2. After Escape, the tooltip's content is gone from the DOM, and focus is on its trigger. */
export function T2(dom: {
  wasOpen: boolean;
  gone: boolean;
  focused: boolean;
}): Fault[] {
  if (!dom.wasOpen) return x0("T2: the tooltip never opened");
  const out: Fault[] = [];
  if (!dom.gone)
    out.push({
      rule: "T2",
      message: "the tooltip is still in the DOM after Escape",
    });
  if (!dom.focused) out.push({ rule: "T2", message: "focus left the trigger" });
  return out;
}

/**
 * Where each of `inOrder` is spoken whole in `steps`, in that order: its
 * position in the steps' normalised speech, joined by one space, and its
 * phrase. Spoken whole is within one phrase, or two adjacent ones. On the
 * first that is not, its index in `inOrder`.
 */
function inOrderAt(
  steps: string[],
  inOrder: string[],
): { found: { at: number; phrase: number }[] } | { missing: number } {
  // The log as one string, each phrase's start known, so "in that order"
  // compares positions in speech, not phrase numbers.
  const n = steps.map(normalise);
  const starts: number[] = [];
  let joined = "";
  // Each start is taken before its phrase is appended: after the space,
  // if one goes in. The change review's finding 2: silent steps ("") at the
  // start add no space, so they move no position.
  for (const p of n) {
    starts.push(joined.length + (joined ? 1 : 0));
    joined += (joined ? " " : "") + p;
  }
  const phraseAt = (pos: number) => {
    let i = 0;
    while (i + 1 < starts.length && starts[i + 1]! <= pos) i++;
    return i;
  };
  const found: { at: number; phrase: number }[] = [];
  let from = 0;
  for (const [k, text] of inOrder.entries()) {
    const want = normalise(text);
    let at = joined.indexOf(want, from);
    while (at >= 0 && phraseAt(at + want.length - 1) - phraseAt(at) > 1)
      at = joined.indexOf(want, at + 1);
    if (!want || at < 0) return { missing: k };
    found.push({ at: at - starts[phraseAt(at)]!, phrase: phraseAt(at) });
    from = at + want.length;
  }
  return { found };
}

/**
 * C1. The chart: within the steps, the figure's name, the table's caption
 * and its first column header are spoken whole, in that order. 022q
 * decision 6: the walk takes 25 steps, room for the name, `004`'s fourteen
 * tick labels, the caption and a header.
 */
export function C1(steps: string[], inOrder: string[]): Fault[] {
  if (!nonEmpty(steps)) return x0("C1: the steps are empty");
  const r = inOrderAt(steps, inOrder);
  if ("missing" in r)
    return fault(
      "C1",
      `"${inOrder[r.missing]}" was not spoken whole${r.missing ? " after the one before it" : ""}`,
    );
  return [];
}

/**
 * C2. None of the chart's tooltip texts is spoken before the table, while
 * C1 holds. `inOrder` is C1's: the figure's name, the caption, and the
 * first header last. Fewer than three entries is X0: no header bounds it.
 *
 * 022x (b): the walk reads only the speech before that header, where C1
 * found it in order. 25 steps reach the table's cells, and VoiceOver reads
 * a cell with its column header, "Visitors 412 column 2 of 2": the
 * tooltip's words, but the table's speech (the fifth matrix run, §3.2).
 */
export function C2(
  steps: string[],
  tooltipTexts: string[],
  inOrder: string[],
): Fault[] {
  // The change review's finding 3: the boundary is the last entry, the
  // first header; with fewer than three there is none.
  if (inOrder.length < 3) return x0("C2: no header to bound the walk");
  const r = nonEmpty(steps) ? inOrderAt(steps, inOrder) : { missing: 0 };
  if ("missing" in r) return x0("C2: C1 does not hold");
  const header = r.found[r.found.length - 1]!;
  const before = [
    ...steps.slice(0, header.phrase),
    normalise(steps[header.phrase]!).slice(0, header.at),
  ];
  return tooltipTexts
    .filter((t) => spokenWhole(before, t))
    .map((t) => ({
      rule: "C2" as const,
      message: `the pointer tooltip's "${t}" was spoken`,
    }));
}

/**
 * U1 (026 decision 20, `unspoken`): a fault for each phrase that holds
 * `phrase`, in any of its spoken forms. Precondition: the window is not
 * empty (a silent reader would pass any "never said").
 */
export function U1(window: string[], phrase: Spoken): Fault[] {
  if (!nonEmpty(window)) return x0("U1: the window is empty");
  return window
    .filter((p) => holds(p, phrase))
    .map((p) => ({
      rule: "U1" as const,
      message: `${shown(phrase)} was spoken: "${p}"`,
    }));
}

/**
 * B1 (026 decision 20, `before`): `first` is spoken whole and ends before
 * `then` begins. Precondition: `then` is spoken whole. Either may be a
 * list of spoken forms; `then` is read where its first form is spoken.
 */
export function B1(window: string[], first: Spoken, then: Spoken): Fault[] {
  if (!nonEmpty(window)) return x0("B1: the window is empty");
  const found = formsOf(then)
    .map((form) => ({ form, at: spokenAt(window, form) }))
    .filter((f) => f.at >= 0)
    .sort((a, b) => a.at - b.at)[0];
  if (!found)
    return x0(`B1: ${shown(then)} was not spoken, so nothing comes after`);
  // `first` must be whole within the phrases before `then`'s, or in the same
  // phrase before it.
  const n = window.map(normalise);
  const before = [
    ...n.slice(0, found.at),
    n[found.at]!.split(normalise(found.form))[0]!,
  ];
  return spokenWhole(before, first)
    ? []
    : fault(
        "B1",
        `${shown(first)} was not spoken whole before "${found.form}"`,
      );
}
