/**
 * 022 decision 11: the items a screen reader checks by script, and the
 * items excluded, each with a reason. `tests/unit/sr-items.test.ts`
 * re-derives the candidates from item source (`derive.ts`): every
 * candidate is in one list or the other. So a new item with a live region
 * cannot ship without a screen-reader run, or a stated reason.
 *
 * A focus move here means focus going where the user did not Tab or arrow
 * to: on open, close, insertion, a step change, or a link.
 *
 * This file imports nothing, so `030` reads it alone.
 */

export type Kind = "live" | "focus" | "overlay";

export const SR_ITEMS: Record<string, Kind[]> = {
  // ui items: a live region
  status: ["live"],
  alert: ["live"],
  spinner: ["live"],
  "error-summary": ["live", "focus"],
  "message-log": ["live", "focus"],
  marker: ["live"],
  "code-block": ["live"],
  composer: ["live", "focus"],
  "stage-card": ["live"],
  "live-console": ["live"],
  // ui items: a focus move
  message: ["focus"],
  "code-editor": ["focus"],
  // ui items: an overlay
  tooltip: ["overlay"],
  popover: ["overlay"],
  "alert-dialog": ["overlay"],
  dialog: ["overlay"],
  sheet: ["overlay"],
  "dropdown-menu": ["overlay"],
  chart: ["overlay"],
  sidebar: ["overlay", "focus"],
  "marketing-bar": ["overlay", "focus"],
  // blocks, by the kinds their parts bring
  "sign-in": ["live", "focus"],
  "sign-up": ["live", "focus"],
  settings: ["live", "focus", "overlay"],
  "page-states": ["live"],
  // 026 D1: the shell mounts the toaster, so it brings toast's live region.
  "app-shell": ["live", "focus", "overlay"],
  chat: ["live", "focus"],
  "product-home": ["live", "overlay"],
  // 026 decision 20 (D2, built at 022's merge): two announcers and F8.
  toast: ["live", "focus"],
};

export const SR_EXCLUDED: Record<string, string> = {
  breadcrumb:
    "it matched the overlay search only through a comment; it has no live region, focus move or layer",
  "toggle-group":
    "it matched the overlay search only through a comment; its roving focus is the keyboard walk's job",
  "input-group":
    "its addon click is a pointer convenience no screen-reader user makes, and its password toggle announces its own new name",
  tabs: "roving focus inside one widget: the keyboard walk's job",
  "radio-group": "roving focus inside one widget: the keyboard walk's job",
  accordion: "roving focus inside one widget: the keyboard walk's job",
  "input-otp": "roving focus inside one widget: the keyboard walk's job",
  "liquid-glass": "a surface, not a layer above other content",
  "proof-band": "no live region; its final numbers are static text",
  theme: "it announces its own state, through native or ARIA state",
  toggle: "it announces its own state, through native or ARIA state",
  collapsible: "it announces its own state, through native or ARIA state",
  switch: "it announces its own state, through native or ARIA state",
  checkbox: "it announces its own state, through native or ARIA state",
};
