/**
 * 027's browser helpers, shared by the batch A spec files: an example view
 * opened in the project's scheme, colours as hex, and one pixel of a
 * screenshot, decoded in the page so it reads the same in every engine.
 */
import type { Locator, Page, TestInfo } from "@playwright/test";
import { cssVar, hexToRgb } from "./pages.ts";
import { scheme } from "./scheme.ts";

/** 027a's items, with their page examples and pair files, in page order. */
export const PART_A: { item: string; examples: string[]; pairs: string[] }[] = [
  {
    item: "link",
    examples: ["inline", "standalone", "new-tab", "visited", "inherit"],
    pairs: ["words", "action"],
  },
  {
    item: "button-group",
    examples: ["attached", "with-menu", "vertical", "spaced"],
    pairs: ["weight", "state"],
  },
  {
    item: "progress",
    examples: ["upload", "states", "in-a-card"],
    pairs: ["numbers", "unknown"],
  },
];

/** The project's scheme, from its `use` (022 decision 2). */
export const schemeOf = (info: TestInfo): "light" | "dark" => scheme(info);

/** Opens one example view in the project's scheme, hydrated. */
export async function openExample(
  page: Page,
  info: TestInfo,
  item: string,
  id: string,
): Promise<void> {
  await page.goto(`/example/${item}/${id}/?theme=${schemeOf(info)}`);
  await page.locator("body[data-view-ready]").waitFor();
}

/** `rgb(r, g, b)` as `#rrggbb`. */
export function rgbToHex(rgb: string): string {
  const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(rgb);
  if (!m) throw new Error(`not an rgb colour: ${rgb}`);
  return (
    "#" +
    [m[1], m[2], m[3]]
      .map((c) => Number(c).toString(16).padStart(2, "0"))
      .join("")
  );
}

/** A custom property of the page's root, as `#rrggbb`. */
export async function token(page: Page, name: string): Promise<string> {
  return rgbToHex(hexToRgb(await cssVar(page, name)));
}

/** `#rrggbb` as its three channels. */
export function channels(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Two colours within `tolerance` per channel. */
export function near(a: string, b: string, tolerance = 2): boolean {
  const x = channels(a);
  const y = channels(b);
  return x.every((c, i) => Math.abs(c - y[i]) <= tolerance);
}

/**
 * The colour of one pixel of an element's screenshot, at a fraction of its
 * width and half its height, as `#rrggbb`. The PNG is decoded on a canvas
 * in the page.
 */
export async function pixelOf(
  page: Page,
  locator: Locator,
  fraction: number,
): Promise<string> {
  const png = (await locator.screenshot()).toString("base64");
  return decode(page, png, (w, h) => [
    Math.round(w * fraction),
    Math.floor(h / 2),
  ]);
}

/** The colour of the page's pixel at (x, y) in CSS px, as `#rrggbb`. */
export async function pixelAt(
  page: Page,
  x: number,
  y: number,
): Promise<string> {
  const png = (
    await page.screenshot({
      clip: { x: Math.round(x), y: Math.round(y), width: 1, height: 1 },
    })
  ).toString("base64");
  return decode(page, png, () => [0, 0]);
}

async function decode(
  page: Page,
  png: string,
  at: (w: number, h: number) => [number, number],
): Promise<string> {
  const [w, h, data] = await page.evaluate(async (src) => {
    const img = new Image();
    img.src = `data:image/png;base64,${src}`;
    await img.decode();
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);
    const all = ctx.getImageData(0, 0, img.naturalWidth, img.naturalHeight);
    return [img.naturalWidth, img.naturalHeight, Array.from(all.data)] as const;
  }, png);
  const [x, y] = at(w, h);
  const i = (Math.min(y, h - 1) * w + Math.min(x, w - 1)) * 4;
  return rgbToHex(`rgb(${data[i]}, ${data[i + 1]}, ${data[i + 2]})`);
}

/** 027b's items, with their page examples and pair files, in page order. */
export const PART_B: {
  item: string;
  examples: string[];
  pairs: string[];
  /** A don't's broken axe rule, by pair, where its `meta.axe` names one. */
  axe?: Record<string, string>;
}[] = [
  {
    item: "pagination",
    examples: ["links", "buttons", "in-a-footer", "ends", "narrow", "small"],
    pairs: ["urls", "steps"],
  },
  {
    item: "search-field",
    examples: [
      "filter",
      "from-a-server",
      "site",
      "in-a-field",
      "in-a-dialog",
      "disabled",
    ],
    pairs: ["label", "landmark"],
  },
  {
    item: "tag",
    examples: ["removable", "pressable", "mixed", "fallback", "static"],
    pairs: ["name", "role"],
    axe: { name: "button-name" },
  },
];

/**
 * An element's colours as `#rrggbb`: its text, its top border, its own
 * background (or its ground, when its own is transparent), and its ground,
 * the first opaque background above it.
 */
export async function coloursOf(locator: Locator): Promise<{
  text: string;
  border: string;
  background: string;
  ground: string;
}> {
  const raw = await locator.evaluate((el) => {
    const opaque = (c: string) =>
      c !== "transparent" && !/rgba\([^)]*,\s*0\)$/.test(c);
    let ground = "";
    for (let n = el.parentElement; n; n = n.parentElement) {
      const bg = getComputedStyle(n).backgroundColor;
      if (opaque(bg)) {
        ground = bg;
        break;
      }
    }
    const s = getComputedStyle(el);
    return {
      text: s.color,
      border: s.borderTopColor,
      background: opaque(s.backgroundColor) ? s.backgroundColor : ground,
      ground,
    };
  });
  return {
    text: rgbToHex(raw.text),
    border: rgbToHex(raw.border),
    background: rgbToHex(raw.background),
    ground: rgbToHex(raw.ground),
  };
}

/** Whether a computed colour is fully transparent. */
export function transparent(c: string): boolean {
  return c === "transparent" || /rgba\([^)]*,\s*0\)$/.test(c);
}

/**
 * Every change to the text of the elements `selector` matches, logged by a
 * MutationObserver from the page's first script, with the page's clock.
 * Read it back with `writes(page)`.
 */
export async function logWrites(page: Page, selector: string): Promise<void> {
  await page.addInitScript((sel) => {
    const log: { text: string; t: number }[] = [];
    (window as unknown as { __writes: typeof log }).__writes = log;
    const seen = new WeakSet<Element>();
    const attach = () => {
      for (const el of document.querySelectorAll(sel)) {
        if (seen.has(el)) continue;
        seen.add(el);
        new MutationObserver(() =>
          log.push({ text: (el.textContent ?? "").trim(), t: Date.now() }),
        ).observe(el, { childList: true, characterData: true, subtree: true });
      }
    };
    const watch = () => {
      attach();
      new MutationObserver(attach).observe(document.documentElement, {
        childList: true,
        subtree: true,
      });
    };
    if (document.readyState === "loading")
      document.addEventListener("DOMContentLoaded", watch);
    else watch();
  }, selector);
}

/** The writes `logWrites` saw, in order. */
export function writes(page: Page): Promise<{ text: string; t: number }[]> {
  return page.evaluate(
    () =>
      (window as unknown as { __writes?: { text: string; t: number }[] })
        .__writes ?? [],
  );
}

/** Waits `n` animation frames in the page. */
export function frames(page: Page, n = 2): Promise<void> {
  return page.evaluate(
    (count) =>
      new Promise<void>((resolve) => {
        let left = count;
        const step = () =>
          --left <= 0 ? resolve() : requestAnimationFrame(step);
        requestAnimationFrame(step);
      }),
    n,
  );
}
