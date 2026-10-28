import type { Page } from "@playwright/test";

/** The 7 prerendered pages (decision 24). */
export const ITEMS = [
  "pluto-theme",
  "font-geist",
  "font-heading-ibm-plex-sans",
  "font-jetbrains-mono",
  "utils",
  "four-dot",
];
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
