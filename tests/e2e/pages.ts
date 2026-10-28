import type { Page } from "@playwright/test";

/** The 32 items in 002 decision 6's order: 33 prerendered pages with the catalogue. */
export const ITEMS = [
  // foundation
  "pluto-theme",
  "font-geist",
  "font-heading-ibm-plex-sans",
  "font-jetbrains-mono",
  "utils",
  "four-dot",
  // actions
  "button",
  "tooltip",
  "kbd",
  // surfaces
  "card",
  "separator",
  "item",
  "table",
  "tabs",
  "collapsible",
  "avatar",
  // feedback
  "alert",
  "alert-dialog",
  "badge",
  "empty",
  "skeleton",
  "spinner",
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
];

/** The 26 items 002 adds. */
export const NEW_ITEMS = ITEMS.slice(6);
export const PAGES = ["/", ...ITEMS.map((name) => `/items/${name}/`)];

/** The grounds, as Chromium computes them. */
export const GROUND = {
  light: "rgb(247, 247, 244)",
  dark: "rgb(20, 22, 28)",
} as const;

export type ThemeName = keyof typeof GROUND;

/** Opens a page and waits until it has hydrated (the theme toggle marks itself ready). */
export async function open(page: Page, path: string): Promise<void> {
  await page.goto(path);
  await page.locator("button[aria-pressed][data-ready]").waitFor();
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
