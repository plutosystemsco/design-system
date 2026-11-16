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
 * apostrophes. 4. Collapse whitespace to one space, and trim. 5. Drop one
 * final `.`, `,`, `;`, `:`, `!` or `?`.
 */
export function normalise(s: string): string {
  return s
    .normalize("NFKC")
    .toLowerCase()
    .replace(/['"‘’“”]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[.,;:!?]$/, "");
}

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

/** An expected text is spoken whole in a window. */
export function spokenWhole(phrases: string[], text: string): boolean {
  return spokenAt(phrases, text) >= 0;
}

const nonEmpty = (w: string[]) => w.some((p) => normalise(p) !== "");
const x0 = (why: string): Fault[] => [{ rule: "X0", message: why }];
const fault = (rule: RuleId, message: string): Fault[] => [{ rule, message }];

/** L1. The message is spoken whole (after). */
export function L1(after: string[], message: string): Fault[] {
  if (!nonEmpty(after)) return x0("L1: the after window is empty");
  return spokenWhole(after, message)
    ? []
    : fault("L1", `"${message}" was not spoken whole`);
}

/** L2. The message is not spoken before the action (before), while L1 holds. */
export function L2(
  before: string[],
  after: string[],
  message: string,
): Fault[] {
  if (!nonEmpty(after) || !spokenWhole(after, message))
    return x0(
      "L2: L1 does not hold, so the reader's silence before proves nothing",
    );
  return spokenWhole(before, message)
    ? fault("L2", `"${message}" was spoken before the action`)
    : [];
}

/** L3. No two adjacent phrases each contain the message whole (after). */
export function L3(after: string[], message: string): Fault[] {
  if (!nonEmpty(after) || !spokenWhole(after, message))
    return x0("L3: L1 does not hold");
  const want = normalise(message);
  const n = after.map(normalise);
  for (let i = 1; i < n.length; i++)
    if (n[i - 1]!.includes(want) && n[i]!.includes(want))
      return fault(
        "L3",
        `"${message}" was read twice in a row (phrases ${i} and ${i + 1})`,
      );
  return [];
}

/** L4. A promised repeat: spoken whole again on the identical second trigger. */
export function L4(
  second: string[],
  message: string,
  firstHeld: boolean,
): Fault[] {
  if (!firstHeld) return x0("L4: L1 did not hold on the first trigger");
  if (!nonEmpty(second)) return x0("L4: the second after window is empty");
  return spokenWhole(second, message)
    ? []
    : fault("L4", `"${message}" was not spoken again on the second trigger`);
}

/** F1. The focus target's accessible name (for a heading, its text) is spoken whole. */
export function F1(after: string[], name: string): Fault[] {
  if (!nonEmpty(after)) return x0("F1: the after window is empty");
  return spokenWhole(after, name)
    ? []
    : fault("F1", `the focus target "${name}" was not spoken whole`);
}

/** O1. The overlay's name is spoken whole: a dialog's title, a menu's first item. */
export function O1(after: string[], name: string): Fault[] {
  if (!nonEmpty(after)) return x0("O1: the after window is empty");
  return spokenWhole(after, name)
    ? []
    : fault("O1", `the overlay's name "${name}" was not spoken whole`);
}

/**
 * O2. Modal containment: the sentinel is never spoken in ten `next()`
 * steps. Precondition: at least three distinct non-empty phrases, one of
 * them containing the overlay's name.
 */
export function O2(
  steps: string[],
  sentinel: string,
  overlayName: string,
  inside: string[] = [],
): Fault[] {
  const distinct = new Set(steps.map(normalise).filter(Boolean));
  if (distinct.size < 3)
    return x0(
      `O2: ${distinct.size} distinct phrases in the steps; 3 are needed`,
    );
  if (!spokenWhole(steps, overlayName))
    return x0(`O2: no step spoke the overlay's name "${overlayName}"`);
  // A trigger often bears the overlay's name, so a reader that never left
  // it would meet the precondition. Where the test knows texts found only
  // inside the overlay (`Sr.steps()` reads them from the DOM), one of them
  // must be spoken too. Found by the Orca rehearsal (022 Q9).
  if (inside.length && !inside.some((t) => spokenWhole(steps, t)))
    return x0(
      `O2: no step reached inside the overlay (none of ${inside.map((t) => `"${t}"`).join(", ")} was spoken)`,
    );
  return spokenWhole(steps, sentinel)
    ? fault(
        "O2",
        "the page behind the modal was reached: the sentinel was spoken",
      )
    : [];
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
 * C1. The chart: within the steps, the figure's name, the table's caption
 * and its first column header are spoken whole, in that order.
 */
export function C1(steps: string[], inOrder: string[]): Fault[] {
  if (!nonEmpty(steps)) return x0("C1: the steps are empty");
  // The log as one string, each phrase's start known, so "in that order"
  // compares positions in speech, not phrase numbers.
  const n = steps.map(normalise);
  const starts: number[] = [];
  let joined = "";
  for (const p of n) {
    starts.push(joined.length);
    joined += (joined ? " " : "") + p;
    if (starts.length > 1) starts[starts.length - 1]! += 1;
  }
  const phraseAt = (pos: number) => {
    let i = 0;
    while (i + 1 < starts.length && starts[i + 1]! <= pos) i++;
    return i;
  };
  let from = 0;
  for (const text of inOrder) {
    const want = normalise(text);
    let at = joined.indexOf(want, from);
    // Spoken whole: within one phrase, or two adjacent ones.
    while (at >= 0 && phraseAt(at + want.length - 1) - phraseAt(at) > 1)
      at = joined.indexOf(want, at + 1);
    if (!want || at < 0)
      return fault(
        "C1",
        `"${text}" was not spoken whole${from ? " after the one before it" : ""}`,
      );
    from = at + want.length;
  }
  return [];
}

/** C2. None of the chart's tooltip texts is spoken in those steps, while C1 holds. */
export function C2(
  steps: string[],
  tooltipTexts: string[],
  c1Held: boolean,
): Fault[] {
  if (!c1Held) return x0("C2: C1 does not hold");
  return tooltipTexts
    .filter((t) => spokenWhole(steps, t))
    .map((t) => ({
      rule: "C2" as const,
      message: `the pointer tooltip's "${t}" was spoken`,
    }));
}

/**
 * U1 (026 decision 20, `unspoken`): a fault for each phrase that holds
 * `phrase`. Precondition: the window is not empty (a silent reader would
 * pass any "never said").
 */
export function U1(window: string[], phrase: string): Fault[] {
  if (!nonEmpty(window)) return x0("U1: the window is empty");
  const want = normalise(phrase);
  return window
    .filter((p) => normalise(p).includes(want))
    .map((p) => ({
      rule: "U1" as const,
      message: `"${phrase}" was spoken: "${p}"`,
    }));
}

/**
 * B1 (026 decision 20, `before`): `first` is spoken whole and ends before
 * `then` begins. Precondition: `then` is spoken whole.
 */
export function B1(window: string[], first: string, then: string): Fault[] {
  if (!nonEmpty(window)) return x0("B1: the window is empty");
  const at = spokenAt(window, then);
  if (at < 0) return x0(`B1: "${then}" was not spoken, so nothing comes after`);
  // `first` must be whole within the phrases before `then`'s, or in the same
  // phrase before it.
  const n = window.map(normalise);
  const before = [...n.slice(0, at), n[at]!.split(normalise(then))[0]!];
  return spokenWhole(before, first)
    ? []
    : fault("B1", `"${first}" was not spoken whole before "${then}"`);
}
