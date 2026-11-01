import type { Page } from "@playwright/test";

import { BLOCK_VIEWS, viewPath } from "../../src/lib/preview/blocks.ts";

/** The items in 005 decision 4's order: one site page each, plus the catalogue. */
export const ITEMS = [
  // foundation
  "pluto-theme",
  "font-geist",
  "font-heading-ibm-plex-sans",
  "font-jetbrains-mono",
  "utils",
  "four-dot",
  "theme",
  // actions
  "button",
  "tooltip",
  "kbd",
  "toggle",
  "toggle-group",
  // surfaces
  "card",
  "separator",
  "item",
  "table",
  "tabs",
  "collapsible",
  "avatar",
  "popover",
  "accordion",
  // feedback
  "alert",
  "alert-dialog",
  "badge",
  "empty",
  "skeleton",
  "spinner",
  "status",
  "error-summary",
  // forms
  "label",
  "field",
  "input",
  "textarea",
  "input-group",
  "native-select",
  "checkbox",
  "radio-group",
  "switch",
  "input-otp",
  // code (004)
  "code-block",
  "code-editor",
  "highlighter",
  "use-highlighted-code",
  // data (004)
  "chart",
  "meter",
  // navigation (005)
  "dropdown-menu",
  "sheet",
  "dialog",
  "breadcrumb",
  "sidebar",
  "is-mobile",
  // chat (005)
  "message-log",
  "message",
  "marker",
  "composer",
  // blocks
  "hero",
  "sign-in",
  "sign-up",
  "page-states",
  "settings",
];

/** 004's 10 items, and their pages. */
export const ITEMS_004 = [
  "toggle",
  "toggle-group",
  "popover",
  "accordion",
  "code-block",
  "code-editor",
  "highlighter",
  "use-highlighted-code",
  "chart",
  "meter",
];
/** 005's 11 items (decision 4), and their pages. */
export const ITEMS_005 = [
  "theme",
  "dropdown-menu",
  "sheet",
  "dialog",
  "breadcrumb",
  "sidebar",
  "is-mobile",
  "message-log",
  "message",
  "marker",
  "composer",
];
/** The 26 items 002 adds: every item after the foundation that 003, 004 and 005 did not. */
export const ITEMS_002 = ITEMS.slice(7).filter(
  (name) =>
    ![
      "status",
      "error-summary",
      "hero",
      "sign-in",
      "sign-up",
      "page-states",
      "settings",
    ].includes(name) &&
    !ITEMS_004.includes(name) &&
    !ITEMS_005.includes(name),
);
/** Kept for 002's checks: the 26 items 002 added. */
export const NEW_ITEMS = ITEMS_002;
/** The 7 items 003 adds. */
export const ITEMS_003 = [
  "status",
  "error-summary",
  "hero",
  "sign-in",
  "sign-up",
  "page-states",
  "settings",
];
/** The 5 blocks, in registry order. */
export const BLOCKS = ["hero", "sign-in", "sign-up", "page-states", "settings"];
/** The 7 new item pages of 003. */
export const NEW_PAGES = ITEMS_003.map((name) => `/items/${name}/`);
export const NEW_PAGES_004 = ITEMS_004.map((name) => `/items/${name}/`);
/** The 11 new item pages of 005. */
export const NEW_PAGES_005 = ITEMS_005.map((name) => `/items/${name}/`);
/** The site pages: the catalogue and one page per item. */
export const PAGES = ["/", ...ITEMS.map((name) => `/items/${name}/`)];
/** The catalogue and 002's 32 item pages. */
export const PAGES_002 = PAGES.filter(
  (p) =>
    !NEW_PAGES.includes(p) &&
    !NEW_PAGES_004.includes(p) &&
    !NEW_PAGES_005.includes(p),
);

/** The 17 views (003 decision 16), each with its block and label. */
export const VIEWS = BLOCKS.flatMap((block) =>
  (BLOCK_VIEWS[block] ?? []).map((view) => ({
    block,
    state: view.path,
    label: view.label,
    path: viewPath(block, view.path),
  })),
);

/** 003 decisions 10 to 14: each view's stops, in order. */
const SIGN_IN = [
  "input:Email address",
  "input:Password",
  "button:Show password",
  "button:Sign in",
];
const SIGN_UP = [
  "input:Email address",
  "input:Create a password",
  "button:Show password",
  "button:Create account",
];
const VERIFY = [
  "input:Verification code",
  "button:Verify email",
  "button:Send a new code",
  "button:Use a different email address",
];
const SETTINGS_CONTROLS = [
  "input:Name",
  "input:Email address",
  "select:Time zone",
  "checkbox:When a run fails",
  "checkbox:A weekly summary",
  "radio:Match the system",
];
export const VIEW_STOPS: Record<string, string[]> = {
  "/view/hero/": ["a:Browse the components", "a:See what is included"],
  "/view/sign-in/": SIGN_IN,
  "/view/sign-in/errors/": [
    "a:Enter your email address",
    "a:Enter your password",
    ...SIGN_IN,
  ],
  "/view/sign-in/credentials/": [...SIGN_IN, "a:Create an account"],
  "/view/sign-in/busy/": SIGN_IN,
  "/view/sign-up/": SIGN_UP,
  "/view/sign-up/errors/": [
    "a:Enter an email address like name@example.com",
    "a:Use at least 15 characters for your password",
    ...SIGN_UP,
    "a:terms of service",
    "a:privacy notice",
  ],
  "/view/sign-up/verify/": VERIFY,
  "/view/sign-up/code-error/": [
    "a:That code is not right. Check the email, or send a new code.",
    ...VERIFY,
  ],
  "/view/page-states/": ["button:Create a project"],
  "/view/page-states/loading/": [],
  "/view/page-states/error/": [
    "button:Try again",
    "a:Go to the home page",
    "summary:Technical details",
  ],
  "/view/page-states/not-found/": ["a:Go to the home page"],
  "/view/page-states/cannot-show/": ["a:Go to the home page"],
  "/view/settings/": [
    ...SETTINGS_CONTROLS,
    "button:Save changes",
    "button:Delete account",
  ],
  "/view/settings/errors/": [
    "a:Enter your name",
    "a:Enter an email address like name@example.com",
    ...SETTINGS_CONTROLS,
    "button:Save changes",
    "button:Discard changes",
    "button:Delete account",
  ],
  "/view/settings/saved/": [
    ...SETTINGS_CONTROLS,
    "button:Save changes",
    "button:Delete account",
  ],
  "/view/settings/failed/": [
    ...SETTINGS_CONTROLS,
    "button:Save changes",
    "button:Delete account",
  ],
};

/** The three widths the viewer and the tests use. */
export const WIDTHS = [360, 768, 1280] as const;

/** Opens a view and waits until it has hydrated (its <main> marks itself ready). */
export async function openView(page: Page, path: string): Promise<void> {
  await page.goto(path);
  await page.locator("main[data-view-ready]").waitFor();
}

/** The grounds, as Chromium computes them. */
export const GROUND = {
  light: "rgb(247, 247, 244)",
  dark: "rgb(20, 22, 28)",
} as const;

export type ThemeName = keyof typeof GROUND;

/**
 * Opens a page and waits until it has hydrated (the theme toggle marks itself
 * ready). The theme item's page holds several toggles; the header's is first.
 */
export async function open(page: Page, path: string): Promise<void> {
  await page.goto(path);
  await page.locator("button[aria-pressed][data-ready]").first().waitFor();
}

/**
 * A hex colour as Chromium writes a computed colour. It reads #rgb, #rgba,
 * #rrggbb and #rrggbbaa, because the production minifier shortens hex
 * (`#fff`, `#0000`). Alpha is ignored: the ring is opaque.
 */
export function hexToRgb(hex: string): string {
  let digits = hex.trim().replace("#", "");
  if (digits.length === 3 || digits.length === 4) {
    digits = [...digits].map((d) => d + d).join("");
  }
  if (!/^[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(digits)) {
    throw new Error(`not a hex colour: "${hex}"`);
  }
  const n = parseInt(digits.slice(0, 6), 16);
  return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`;
}

/** The value of a CSS custom property on <html>, as written. */
export async function cssVar(page: Page, name: string): Promise<string> {
  return page.evaluate(
    (n) =>
      getComputedStyle(document.documentElement).getPropertyValue(n).trim(),
    name,
  );
}

/**
 * Waits for the page's animations to end. A cancelled animation rejects its
 * `finished` promise (an AbortError), which is not a failure here: the element
 * left before its animation ended. An infinite animation, such as a spinner,
 * never finishes and is skipped.
 */
export async function settled(page: Page): Promise<void> {
  await page.evaluate(async () => {
    const finite = document.getAnimations().filter((a) => {
      const timing = a.effect?.getComputedTiming();
      return timing ? timing.iterations !== Infinity : true;
    });
    await Promise.all(finite.map((a) => a.finished.catch(() => undefined)));
  });
}

/**
 * Tabbable: in the tab order, so not a roving group's parked items (tabindex
 * -1). A details' summary is a native stop (004 decision 10's "Show as table").
 */
export const TABBABLE =
  'a[href]:not([tabindex="-1"]), button:not([disabled]):not([tabindex="-1"]), input:not([disabled]):not([type="hidden"]):not([tabindex="-1"]), select:not([disabled]):not([tabindex="-1"]), textarea:not([disabled]):not([tabindex="-1"]), summary:not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])';
