/**
 * 022 decision 15: the patch table. Each patch breaks one promise in one
 * item; each has a witness, a test no other patch in its set reaches with
 * the same fault. Patches are applied only in CI, on a `mutate` dispatch,
 * and never committed to item source.
 *
 * A patch's `target` is an item (`sheet`) or an item and one part
 * (`toast:assertive`). This file imports nothing but a type.
 */
import type { Patch } from "./derive.ts";

export const SETS = ["main", "double-read"] as const;

export const PATCHES: Patch[] = [
  {
    set: "main",
    patch: "1-alert.patch",
    target: "alert",
    fault: "L1",
    why: "its role map gives no live role to any variant",
    witness: {
      file: "alert.sr.ts",
      title:
        "a destructive alert inserted after load is spoken whole, and not before",
    },
  },
  {
    set: "main",
    patch: "2-dialog.patch",
    target: "dialog",
    fault: "O1",
    why: "the title no longer names the dialog",
    witness: {
      file: "dialog.sr.ts",
      title: "opening speaks the dialog's title",
    },
  },
  {
    set: "main",
    patch: "3-popover.patch",
    target: "popover",
    fault: "O3",
    why: "focus no longer returns to the trigger on close",
    witness: {
      file: "popover.sr.ts",
      title: "Escape closes it; the trigger is spoken and has focus",
    },
  },
  {
    set: "main",
    patch: "4-error-summary.patch",
    target: "error-summary",
    fault: "L1",
    why: "the inner alert is removed",
    witness: {
      file: "error-summary.sr.ts",
      title:
        "the insertion: the title and every message spoken whole, none twice in a row, none before",
    },
  },
  {
    set: "main",
    patch: "5-sign-up.patch",
    target: "sign-up",
    fault: "F1",
    why: "the new step's heading no longer takes focus",
    witness: {
      file: "sign-up.sr.ts",
      title: "the code step: its heading takes focus and is spoken",
    },
  },
  {
    set: "main",
    patch: "6-sheet.patch",
    target: "sheet",
    fault: "O2",
    why: "it is no longer modal, so the page behind is reachable",
    witness: {
      file: "sheet.sr.ts",
      title: "the page behind the sheet is never reached in ten steps",
    },
  },
  {
    set: "main",
    patch: "7-code-block.patch",
    target: "code-block",
    fault: "L3",
    why: "the copy button renders its status region twice",
    witness: {
      file: "code-block.sr.ts",
      title: "copy: the outcome is spoken whole, and not twice in a row",
    },
  },
  {
    // 026 decision 20 (D2, built at 022's merge): a div with no live role
    // and no aria-live is spoken by no reader when its text changes.
    set: "main",
    patch: "8-toast.patch",
    target: "toast:assertive",
    fault: "L1",
    why: 'the assertive announcer loses role="alert" and aria-live',
    witness: {
      file: "toast.sr.ts",
      title: "S2 assertive: the error is spoken whole",
    },
  },
  {
    set: "double-read",
    patch: "7b-error-summary.patch",
    target: "error-summary",
    fault: "L3",
    why: 'role="alert" goes back onto the root, 019\'s old structure',
    witness: {
      file: "error-summary.sr.ts",
      title:
        "the insertion: the title and every message spoken whole, none twice in a row, none before",
    },
  },
];
