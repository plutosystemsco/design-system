/**
 * 018 decision 13: each item's examples in the order its page renders them.
 * The item's route passes its examples in this order (a unit test holds
 * them equal); the thumbnails script and the build check read the first.
 * Blocks and compositions show views instead: `firstStage` gives the first.
 * Kept apart from `examples.ts`, which the example views load in the
 * browser, so no page carries the list.
 */
import { BLOCK_VIEWS, COMPOSITION_VIEWS } from "../preview/blocks.ts";

export const EXAMPLE_ORDER: Record<string, string[]> = {
  "kuiper-theme": [
    "colours",
    "contrast",
    "elevation",
    "type",
    "spacing",
    "radius",
    "groove",
    "code",
    "inline-code",
    "surface",
    "motion",
    "display",
    "modes",
    "fields",
    "glass",
    "spring",
    "measured",
    "expressive-motion",
  ],
  "font-geist": ["specimen"],
  "font-heading-ibm-plex-sans": ["specimen"],
  "font-jetbrains-mono": ["specimen"],
  utils: ["calls"],
  "four-dot": ["mark", "lockup", "mono", "clearspace", "geometry"],
  theme: ["variants", "states", "script", "keyboard"],
  "read-token": ["variants", "tween", "names"],
  "liquid-glass": ["variants"],
  button: ["variants", "states", "heights", "keyboard"],
  tooltip: ["variants", "states", "keyboard"],
  kbd: ["variants", "states"],
  toggle: ["variants", "states", "keyboard"],
  "toggle-group": ["variants", "states", "keyboard"],
  card: ["variants", "states"],
  separator: ["variants", "states"],
  item: ["variants", "states", "keyboard"],
  table: ["variants"],
  tabs: ["variants", "states", "keyboard"],
  collapsible: ["variants", "states", "keyboard"],
  avatar: ["variants", "states"],
  popover: ["variants", "keyboard"],
  accordion: ["variants", "states", "keyboard"],
  alert: ["variants", "states", "roles"],
  "alert-dialog": ["variants", "keyboard"],
  badge: ["variants", "states"],
  empty: ["variants", "states"],
  skeleton: ["variants"],
  spinner: ["variants", "states"],
  status: ["variants", "states"],
  "error-summary": ["variants", "keyboard"],
  label: ["variants", "states"],
  field: ["variants", "states", "wiring", "keyboard"],
  input: ["variants", "states", "keyboard"],
  textarea: ["variants", "states", "keyboard"],
  "input-group": ["variants", "states", "keyboard"],
  "native-select": ["variants", "states", "keyboard"],
  checkbox: ["variants", "states", "keyboard"],
  "radio-group": ["variants", "states", "keyboard"],
  switch: ["variants", "states", "keyboard"],
  "input-otp": ["variants", "states", "keyboard"],
  "code-block": ["variants", "states", "keyboard"],
  "code-editor": ["variants", "states", "keyboard"],
  highlighter: ["variants", "languages", "states"],
  "use-highlighted-code": ["variants", "states"],
  "code-languages": ["variants", "states"],
  chart: ["variants", "two-series", "colours"],
  meter: ["variants", "states"],
  "dropdown-menu": ["variants", "keyboard"],
  sheet: ["variants", "keyboard"],
  dialog: ["variants", "keyboard"],
  breadcrumb: ["variants", "keyboard"],
  sidebar: ["variants", "states", "cookie", "keyboard"],
  "is-mobile": ["variants"],
  "message-log": ["variants", "states", "keyboard"],
  message: ["variants"],
  marker: ["variants", "states"],
  composer: ["variants", "states", "keyboard"],
};

/** An item's example ids, in page order; empty for a block or a composition. */
export function exampleOrder(item: string): string[] {
  return EXAMPLE_ORDER[item] ?? [];
}

/** What an item's page shows first: an example, or a block's or composition's first view. */
export function firstStage(
  item: string,
):
  | { kind: "example"; id: string; url: string }
  | { kind: "view"; path: string; url: string }
  | null {
  const id = exampleOrder(item)[0];
  if (id) return { kind: "example", id, url: `/example/${item}/${id}/` };
  const block = BLOCK_VIEWS[item]?.[0];
  if (block) {
    const url = `/view/${item}/${block.path ? `${block.path}/` : ""}`;
    return { kind: "view", path: url, url };
  }
  const comp = COMPOSITION_VIEWS[item]?.[0];
  if (comp) {
    const url = `/view/compositions/${comp.path}/`;
    return { kind: "view", path: url, url };
  }
  return null;
}

/**
 * 018 checkpoint 2: a better state for an item's picture than its first
 * example at rest. An overlay is photographed open: the script clicks (or
 * points at) the first match of `trigger` in the first example's stage and
 * crops to `capture`. A font item shows a large "Aa" and a short line in
 * its own face, read from `face`, a custom property of the theme.
 */
export type ThumbState =
  | {
      open: {
        trigger: string;
        capture: string;
        hover?: boolean;
        /** Keep the overlay's top where it cannot fit whole: a sheet's content is at its top. */
        top?: boolean;
      };
    }
  | { face: string };

export const THUMB_STATE: Record<string, ThumbState> = {
  dialog: { open: { trigger: "button", capture: '[role="dialog"]' } },
  "alert-dialog": {
    open: { trigger: "button", capture: '[role="alertdialog"]' },
  },
  sheet: { open: { trigger: "button", capture: '[role="dialog"]', top: true } },
  popover: {
    open: { trigger: "button", capture: '[data-slot="popover-content"]' },
  },
  "dropdown-menu": { open: { trigger: "button", capture: '[role="menu"]' } },
  tooltip: {
    open: { trigger: "button", capture: '[role="tooltip"]', hover: true },
  },
  "font-geist": { face: "--font-sans" },
  "font-heading-ibm-plex-sans": { face: "--font-heading" },
  "font-jetbrains-mono": { face: "--font-mono" },
};
