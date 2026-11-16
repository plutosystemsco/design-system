import { readFileSync } from "node:fs";
import type { Locator, Page } from "@playwright/test";

import {
  BLOCK_VIEWS,
  COMPOSITION_VIEWS,
  COMPOSITIONS_ROOT,
  viewPath,
} from "../../src/lib/preview/blocks.ts";
import { DOORS } from "../../src/lib/site/doors.ts";
import {
  componentPath,
  doorPages,
  GROUPS,
  navOrder,
  SITEMAP,
  type SitePage,
} from "../../src/lib/site/sitemap.ts";

export { componentPath, SITEMAP, type SitePage };

const REGISTRY_ITEMS = (
  JSON.parse(readFileSync("registry.json", "utf8")) as {
    items: {
      name: string;
      title: string;
      description: string;
      meta: { modes: string[]; since: string };
    }[];
  }
).items;

/** The items in 005 decision 4's order: one site page each, plus the catalogue. */
export const ITEMS = [
  // foundation
  "kuiper-theme",
  "font-geist",
  "font-heading-ibm-plex-sans",
  "font-jetbrains-mono",
  "utils",
  "four-dot",
  "theme",
  // foundation (009)
  "read-token",
  // foundation (011)
  "liquid-glass",
  // actions
  "button",
  "tooltip",
  "kbd",
  "toggle",
  "toggle-group",
  // actions (027a)
  "button-group",
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
  // feedback (027a)
  "progress",
  // feedback (026)
  "toast",
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
  // code (007)
  "code-languages",
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
  // navigation (027a)
  "link",
  // chat (005)
  "message-log",
  "message",
  "marker",
  "composer",
  // compositions (010)
  "stage",
  "stage-card",
  "marketing-bar",
  "stage-hero",
  "proof-band",
  "live-console",
  "name-strip",
  "cta-band",
  "marketing-footer",
  // blocks
  "hero",
  "sign-in",
  "sign-up",
  "page-states",
  "settings",
  "app-shell",
  "chat",
  // blocks (010)
  "product-home",
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
/** 005's 11 items (005 decision 4), and their pages. */
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
/** 006's 2 blocks (006 decision 3), and their pages. */
export const ITEMS_006 = ["app-shell", "chat"];
/** 007 decision 7: 007's one item. */
export const ITEMS_007 = ["code-languages"];
/** 009 decision 10: 009's one item. */
export const ITEMS_009 = ["read-token"];
/** 011 decision 8: 011's one item. */
export const ITEMS_011 = ["liquid-glass"];
/** 027a decision 1: batch A's quiet items. */
export const ITEMS_027A = ["button-group", "progress", "link"];
/** 026's one item. */
export const ITEMS_026 = ["toast"];
/** 010 decision 1: the nine compositions, in registry order. */
export const COMPOSITIONS = [
  "stage",
  "stage-card",
  "marketing-bar",
  "stage-hero",
  "proof-band",
  "live-console",
  "name-strip",
  "cta-band",
  "marketing-footer",
];
/** 010 decision 1: the nine compositions and the block. */
export const ITEMS_010 = [...COMPOSITIONS, "product-home"];
/** The 26 items 002 adds: every item after the foundation (seven, and 009's read-token) that 003, 004, 005, 006, 007 and 010 did not. */
export const ITEMS_002 = ITEMS.slice(8).filter(
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
    !ITEMS_005.includes(name) &&
    !ITEMS_006.includes(name) &&
    !ITEMS_007.includes(name) &&
    !ITEMS_010.includes(name) &&
    !ITEMS_011.includes(name) &&
    !ITEMS_027A.includes(name) &&
    !ITEMS_026.includes(name),
);
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
/** The 8 blocks, in registry order (010 adds product-home). */
export const BLOCKS = [
  "hero",
  "sign-in",
  "sign-up",
  "page-states",
  "settings",
  ...ITEMS_006,
  "product-home",
];
/** The 7 item pages of 003. */
export const PAGES_003 = ITEMS_003.map(componentPath);
/** The 10 item pages of 004. */
export const PAGES_004 = ITEMS_004.map(componentPath);
/** The 11 item pages of 005. */
export const PAGES_005 = ITEMS_005.map(componentPath);
/** The 2 item pages of 006. */
export const PAGES_006 = ITEMS_006.map(componentPath);
/** The item page of 007. */
export const PAGES_007 = ITEMS_007.map(componentPath);
/** The item page of 009. */
export const PAGES_009 = ITEMS_009.map(componentPath);
/** The 10 item pages of 010. */
export const PAGES_010 = ITEMS_010.map(componentPath);
/** The item page of 011. */
export const PAGES_011 = ITEMS_011.map(componentPath);
/** 027a's 3 item pages. */
export const PAGES_027A = ITEMS_027A.map(componentPath);
/** 026's item page. */
export const PAGES_026 = ITEMS_026.map(componentPath);
/** Every page of the site, from the one list (015 decision 1). */
export const PAGES = SITEMAP.map((p) => p.path);
/**
 * Every component page, from the sitemap (023a's change review: a hand list
 * missed `toast`), so a new item cannot be left out. `ITEMS` keeps 005's
 * order for the specs that walk it; `pages-lists.test.ts` holds the two
 * equal as sets.
 */
export const COMPONENT_PAGES = doorPages("components").map((p) => p.path);
/** 002's 32 component pages. */
export const PAGES_002 = COMPONENT_PAGES.filter(
  (p) =>
    !PAGES_003.includes(p) &&
    !PAGES_004.includes(p) &&
    !PAGES_005.includes(p) &&
    !PAGES_006.includes(p) &&
    !PAGES_007.includes(p) &&
    !PAGES_009.includes(p) &&
    !PAGES_010.includes(p) &&
    !PAGES_011.includes(p) &&
    !PAGES_027A.includes(p) &&
    !PAGES_026.includes(p),
);

/** The views (003 decision 16; 006 decision 12), each with its block and label. */
export const VIEWS = BLOCKS.flatMap((block) =>
  (BLOCK_VIEWS[block] ?? []).map((view) => ({
    block,
    state: view.path,
    label: view.label,
    path: viewPath(block, view.path),
  })),
);

/**
 * 013 decision 21: test views that are not blocks. axe (at 1280) and the
 * theme check scan them; the keyboard walk does not.
 */
export const TEST_VIEWS = [
  "/view/code-agreement/",
  // 020 tests 7 and 8: the old and new context keys; goes in 0.14.0.
  "/view/field-keys/",
  // 026 decision 20: the shipped shell around one button that raises a toast.
  "/view/app-shell/toast/",
] as const;

/** 010 decision 10: each composition's views, under /view/compositions/. */
export const COMPOSITION_VIEW_LIST = COMPOSITIONS.flatMap((item) =>
  (COMPOSITION_VIEWS[item] ?? []).map((view) => ({
    item,
    label: view.label,
    path: viewPath(COMPOSITIONS_ROOT, view.path),
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
  "checkbox:When something fails",
  "checkbox:A weekly summary",
  "radio:Match the system",
];
/** 006 decision 14: the shell's stops. The sidebar's Preferences group is closed, so its sub-items are not stops. */
// 008 decision 8: the home link is the product's wordmark, "Sandbox"; the
// shipped layout has no source row, the views keep one.
const SHELL_TOP = ["a:Skip to main content", "a:Sandbox"];
const SHELL_NAV = ["a:Overview", "a:Activity", "a:Members"];
const SHELL_END = [
  "a:Go to the home page",
  "a:github.com/plutosystemsco/design-system",
];
/** 006 decision 14: the chat's stops; the pre inside the thread's code block is a stop (004 decision 8). */
const CHAT_READY = [
  "button:New chat",
  "region:Messages",
  "textarea:Message",
  "button:Send message",
];
const CHAT_BUSY = [
  "button:New chat",
  "region:Messages",
  "textarea:Message",
  "button:Stop response",
];
/**
 * Waits until the product home's Python card is highlighted: its pre's text
 * is then its four lines, one span each, with no newline between them, as
 * the stop list reads it.
 */
export async function waitForHighlight(page: Page): Promise<void> {
  await page
    .locator('[data-slot="stage-card"] [data-slot="code-block-line"]')
    .nth(4)
    .waitFor();
}

/**
 * 010 criterion 9: the product home's stops at md and wider, in DOM order.
 * The bar's skip link, home link, two links and two actions; the hero's two
 * actions; the shell card's copy button and code; the Python card's copy
 * button, Run and code; the console's active tab, its command and Run; the
 * call to action; the footer's three links. Each code block's pre is a stop
 * (004 decision 8); the console's tab panels are not (decisions.md, after
 * the 007 checkpoint).
 */
const PRODUCT_HOME_HERO = [
  "a:Read the docs",
  "a:See the source",
  "button:Copy code",
  "pre:pip install git+https://github.com/ClayGendron/vfs",
  "button:Copy code",
  "button:Run",
  'pre:db = DatabaseStorage(url=DATABASE_URL)fs = VirtualFileSystem(storage=db)result = await fs.grep("renewal")for path in result.paths: print(path)',
  "tab:Find renewals",
  'pre:await fs.grep("renewal")',
  "button:Run",
  "a:Read the docs",
  "a:Docs",
  "a:Source",
  "a:About",
];
export const PRODUCT_HOME_STOPS_WIDE = [
  "a:Skip to content",
  "a:Pluto Systems",
  "a:The layer",
  "a:Try it",
  "a:Read the docs",
  "a:See the source",
  ...PRODUCT_HOME_HERO,
];
/** Below md the links and the secondary action fold into the sheet (010 decision 4). */
export const PRODUCT_HOME_STOPS_NARROW = [
  "a:Skip to content",
  "a:Pluto Systems",
  "a:See the source",
  "button:Menu",
  ...PRODUCT_HOME_HERO,
];

export const VIEW_STOPS: Record<string, string[]> = {
  "/view/hero/": ["a:Go to the home page", "a:See what the page holds"],
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
  "/view/app-shell/": [
    ...SHELL_TOP,
    ...SHELL_NAV,
    "button:Dark theme",
    "a:Go to the home page",
  ],
  "/view/app-shell/sidebar/": [
    ...SHELL_TOP,
    "button:Toggle sidebar",
    "button:Dark theme",
    "input:Search",
    ...SHELL_NAV,
    "button:Preferences",
    "button:Ada Lovelace",
    "a:Home",
    ...SHELL_END,
  ],
  "/view/app-shell/sidebar-icon/": [
    ...SHELL_TOP,
    "button:Toggle sidebar",
    "button:Dark theme",
    ...SHELL_NAV,
    "button:Preferences",
    "button:Ada Lovelace",
    "a:Home",
    ...SHELL_END,
  ],
  "/view/app-shell/signed-in/": [
    ...SHELL_TOP,
    ...SHELL_NAV,
    "button:Dark theme",
    "button:Account menu",
    ...SHELL_END,
  ],
  "/view/app-shell/lockup/": [
    "a:Skip to main content",
    "a:Pluto Systems",
    ...SHELL_NAV,
    "button:Dark theme",
    ...SHELL_END,
  ],
  "/view/app-shell/endorsed/": [
    "a:Skip to main content",
    "a:Sandbox Analytics Workbench",
    ...SHELL_NAV,
    "button:Dark theme",
    ...SHELL_END,
  ],
  "/view/chat/": CHAT_READY,
  "/view/chat/thread/": [
    "button:New chat",
    "region:Messages",
    // 014 decision 11: m3, the second user turn, holds a block.
    "button:Copy code",
    "pre:add(2, 3)",
    "button:Copy code",
    'pre:def add(a, b): """Add two numbers.""" return a + b',
    "button:Latest reply",
    "textarea:Message",
    "button:Send message",
  ],
  "/view/chat/submitted/": CHAT_BUSY,
  "/view/chat/streaming/": CHAT_BUSY,
  "/view/chat/stopped/": CHAT_READY,
  "/view/chat/error/": [
    "button:New chat",
    "region:Messages",
    "button:Retry",
    "textarea:Message",
    "button:Send message",
  ],
  "/view/product-home/": PRODUCT_HOME_STOPS_WIDE,
};

/** The three widths the viewer and the tests use. */
export const WIDTHS = [360, 768, 1280] as const;

/**
 * Opens a view and waits until it has hydrated: the (view) layout marks its
 * <main>, the (shell) layout its <body> (006 decision 12).
 */
export const VIEW_READY = "main[data-view-ready], body[data-view-ready]";
export async function openView(page: Page, path: string): Promise<void> {
  await page.goto(path);
  await page.locator(VIEW_READY).waitFor();
}

/** The grounds, as Chromium computes them: the warm canvas and graphite (011 decision 2). */
export const GROUND = {
  light: "rgb(243, 240, 232)",
  dark: "rgb(22, 20, 15)",
} as const;

export type ThemeName = keyof typeof GROUND;

/**
 * 022: the clipboard permissions each engine knows, for `test.use({
 * permissions: clipboard })`. Chromium needs both to read and to write.
 * WebKit knows only `clipboard-read`, and writes without a grant. Playwright's
 * Firefox knows neither and refuses a context that asks; it writes without a
 * grant and cannot read, so a test that reads the clipboard takes
 * `notIn("firefox", …)`.
 */
const CLIPBOARD: Record<string, string[]> = {
  chromium: ["clipboard-read", "clipboard-write"],
  webkit: ["clipboard-read"],
  firefox: [],
};
export const clipboard = [
  async (
    { browserName }: { browserName: string },
    use: (permissions: string[]) => Promise<void>,
  ) => use(CLIPBOARD[browserName] ?? []),
  { scope: "test" },
] as never;

/**
 * 022's review, finding 5: what the clipboard holds, read the way a user
 * reads it, by pasting, in every engine. A scratch textarea goes beside the
 * focused element (inside an open dialog's focus trap, if there is one),
 * takes Control+V or Meta+V, gives back its text, and is removed; focus goes
 * back where it was. A keyboard paste needs no permission, so Firefox, which
 * has no `clipboard-read`, reads too.
 */
export async function readClipboard(page: Page): Promise<string> {
  await page.evaluate(() => {
    const w = window as unknown as { __clipFrom: HTMLElement | null };
    const from = document.activeElement as HTMLElement | null;
    w.__clipFrom = from;
    const box = document.createElement("textarea");
    box.setAttribute("data-clipboard-probe", "");
    box.setAttribute("aria-hidden", "true");
    box.style.cssText = "position:fixed;inset-block-start:0;opacity:0";
    const host =
      from?.closest('[role="dialog"], [role="alertdialog"]') ?? document.body;
    host.append(box);
    box.focus();
  });
  await page.keyboard.press("ControlOrMeta+V");
  return page.evaluate(() => {
    const w = window as unknown as { __clipFrom: HTMLElement | null };
    const box = document.querySelector<HTMLTextAreaElement>(
      "textarea[data-clipboard-probe]",
    )!;
    const text = box.value;
    box.remove();
    w.__clipFrom?.focus({ preventScroll: true });
    return text;
  });
}

/**
 * 022's review, finding 4: press a control by keyboard (focus, then Enter),
 * where a test then asserts focus. A click does not focus a button in
 * macOS WebKit (Safari's platform default), so a click-then-focus check
 * tests the platform there; the keyboard path is the one focus is about.
 */
export async function activate(control: Locator): Promise<void> {
  await control.focus();
  await control.press("Enter");
}

/** Put text on the clipboard as a page does, before a keyboard paste. */
export function writeClipboard(page: Page, text: string): Promise<void> {
  return page.evaluate((t) => navigator.clipboard.writeText(t), text);
}

/**
 * 022: an element's `scrollbar-width`. Playwright's Firefox computes `none`
 * for every element, even one with an inline `scrollbar-width: thin`, since
 * it hides scrollbars. Where the engine does that (a probe says so), the
 * value is read from the author's rules that match the element instead.
 */
export function scrollbarWidth(locator: Locator): Promise<string> {
  return locator.evaluate((el) => {
    const probe = document.createElement("div");
    probe.style.scrollbarWidth = "thin";
    document.body.append(probe);
    const honest = getComputedStyle(probe).scrollbarWidth === "thin";
    probe.remove();
    if (honest) return getComputedStyle(el).scrollbarWidth;
    let found = "auto";
    const walk = (rules: CSSRuleList) => {
      for (const r of rules) {
        if (r instanceof CSSStyleRule) {
          try {
            if (el.matches(r.selectorText) && r.style.scrollbarWidth)
              found = r.style.scrollbarWidth;
          } catch {
            // a selector this engine cannot match
          }
        }
        const inner = (r as CSSGroupingRule).cssRules;
        if (inner?.length) walk(inner);
      }
    };
    for (const s of document.styleSheets) {
      try {
        walk(s.cssRules);
      } catch {
        // a sheet from another origin
      }
    }
    return (el as HTMLElement).style.scrollbarWidth || found;
  });
}

/**
 * 022: Tab from the last stop, and what took focus in the document, if
 * anything. Chromium and WebKit move focus out to the body; Playwright's
 * headless Firefox has no browser chrome to take it, so focus stays on the
 * last stop. Either says no other element in the document is a stop: `other`
 * is null. `stayed` says focus is still on the last stop, so a walk back
 * starts there.
 */
export async function tabOut(
  page: Page,
): Promise<{ other: string | null; stayed: boolean }> {
  await page.evaluate(() => {
    (window as unknown as { __lastStop: Element | null }).__lastStop =
      document.activeElement;
  });
  await page.keyboard.press("Tab");
  return page.evaluate(() => {
    const el = document.activeElement;
    const last = (window as unknown as { __lastStop: Element | null })
      .__lastStop;
    const stayed = !!el && el === last && el !== document.body;
    if (!el || el === document.body || stayed) return { other: null, stayed };
    return { other: el.outerHTML.slice(0, 120), stayed };
  });
}

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

/**
 * 015 decision 5: the bar's stops at md and wider, on every page. The skip
 * link, the lockup, the four doors, search (rendered once scripts run) and
 * the theme toggle.
 */
export const BAR_STOPS = [
  "a:Skip to content",
  "a:pluto, Kuiper Design System",
  ...DOORS.map((d) => `a:${d.name}`),
  "button:Search",
  "button:Dark theme",
];

/**
 * The footer's stops: one link per door's landing and the door's pages (the
 * Components door lists its landing; its 79 pages are on it), the registry
 * group, then the source link.
 */
export const FOOTER_STOPS = [
  ...DOORS.flatMap((d) => [
    `a:${d.name}`,
    ...SITEMAP.filter(
      (p) => p.door === d.id && p.path !== d.path && d.id !== "components",
    ).map((p) => `a:${p.title}`),
  ]),
  "a:Latest registry",
  "a:This release's registry",
  "a:Changelog",
  "a:llms.txt",
  "a:Suggest a change on GitHub",
  "a:github.com/plutosystemsco/design-system",
];

/** 018 decision 1: the left nav's stops, in navOrder; the Components filter first where it shows. */
export function NAV_STOPS(
  door: Parameters<typeof navOrder>[0],
  filter = false,
): string[] {
  return [
    ...(filter ? ["input:Filter components"] : []),
    ...navOrder(door).map((p) => `a:${p.title}`),
  ];
}

/** A code block's two stops: its copy button, then its scrolling code. */
const CODE_BLOCK = ["button:Copy code", "region:*"];

/**
 * 015 decision 5: the home page's stops. The bar, the install block, the
 * four doors, what one command gives you (its block and the items it
 * brings), the four section indexes (each door's heading link, then its
 * rows: the Components door's are its eleven groups), and the footer.
 */
export const HOME_STOPS = [
  ...BAR_STOPS,
  ...CODE_BLOCK,
  // Each disc's name and its line, as its text reads.
  ...DOORS.map((d) => `a:${d.name} ${d.line}`),
  ...CODE_BLOCK,
  "a:utils",
  "a:kuiper-theme",
  "a:spinner",
  ...DOORS.flatMap((d) => [
    `a:${d.name}`,
    ...(d.id === "components"
      ? GROUPS.map((g) => `a:${g.title}`)
      : SITEMAP.filter((p) => p.door === d.id && p.path !== d.path).map(
          (p) => `a:${p.title}`,
        )),
  ]),
  ...FOOTER_STOPS,
];

/**
 * 015 decision 5: the Components landing's stops. The bar, the band's glass
 * (one block), the filter, every item's row link in registry order, and the
 * footer.
 */
export const COMPONENTS_STOPS = [
  ...BAR_STOPS,
  ...NAV_STOPS("components"),
  ...CODE_BLOCK,
  "input:Filter components",
  // 018 decision 13: a tile is one link, named by all its text.
  ...SITEMAP.filter((p) => p.parent === "/components/").map((p) => {
    const item = REGISTRY_ITEMS.find(
      (i) => `/components/${i.name}/` === p.path,
    )!;
    return `a:${item.title} ${item.description} ${item.meta.modes.join(", ")}. Since ${item.meta.since}`;
  }),
  ...FOOTER_STOPS,
];
