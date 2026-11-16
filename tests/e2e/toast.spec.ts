/**
 * 026 tests 44 to 73: the toast, in the browser. The shell's parts of tests
 * 44, 61 and 74 wait for `app-shell`'s edit, which lands after `023`
 * (026 decision 24; the Landing notes hold the deferred step). Time is driven
 * with Playwright's clock where a test counts it; speech is read from the
 * announcers, logged by a MutationObserver with the page's own clock.
 */
import AxeBuilder from "@axe-core/playwright";
import type { Locator, Page } from "@playwright/test";
import { expect, test } from "../test.ts";
import { notIn } from "./engines.ts";
import { contrastRatio } from "../../scripts/contrast.ts";
import { open, VIEW_READY } from "./pages.ts";

const PAGE = "/components/toast/";
const T0 = new Date("2026-11-15T10:00:00Z");

const tag = (check: string) => ({
  annotation: [
    { type: "item", description: "toast" },
    { type: "check", description: check },
  ],
});

const example = (page: Page, id: string) =>
  page.locator(`[data-example="${id}"]`);
const button = (page: Page, id: string, name: string) =>
  example(page, id).getByRole("button", { name, exact: true });
/** The toasts in the stack, leaving ones aside. */
const toasts = (page: Page) =>
  page.locator(
    '[data-slot="toaster"] li[data-toast-id]:not([data-state="closed"])',
  );
const status = (page: Page) => page.locator('[data-slot="toaster-status"]');
const alert = (page: Page) => page.locator('[data-slot="toaster-alert"]');
const more = (page: Page) => page.locator('[data-slot="toaster-more"]');

type Write = { slot: string; text: string; t: number };

/**
 * Logs each change to the two announcers and to SvelteKit's announcer,
 * with the page's clock, and each toast drawn, with its kind.
 */
async function record(page: Page): Promise<void> {
  await page.evaluate(() => {
    const w = window as unknown as {
      __writes: { slot: string; text: string; t: number }[];
      __drawn: { id: string; kind: string; t: number }[];
      __modal: { open: boolean; t: number }[];
    };
    w.__writes = [];
    w.__drawn = [];
    w.__modal = [];
    const last = new Map<string, string>();
    const watched = () =>
      [
        [
          "toaster-status",
          document.querySelector('[data-slot="toaster-status"]'),
        ],
        [
          "toaster-alert",
          document.querySelector('[data-slot="toaster-alert"]'),
        ],
        ["svelte-announcer", document.getElementById("svelte-announcer")],
      ] as const;
    let modal = false;
    const look = () => {
      const t = performance.now();
      for (const [slot, el] of watched()) {
        const text = el?.textContent?.trim() ?? "";
        if (last.get(slot) !== text) {
          if (last.has(slot) || text) w.__writes.push({ slot, text, t });
          last.set(slot, text);
        }
      }
      for (const li of document.querySelectorAll<HTMLElement>(
        '[data-slot="toaster"] li[data-toast-id]',
      )) {
        const id = li.dataset.toastId!;
        const kind = li.dataset.kind!;
        const seen = w.__drawn.filter((d) => d.id === id).at(-1);
        if (!seen || seen.kind !== kind) w.__drawn.push({ id, kind, t });
      }
      const open = !!document.querySelector('[aria-modal="true"]');
      if (open !== modal) {
        modal = open;
        w.__modal.push({ open, t });
      }
    };
    for (const [, el] of watched()) last.set(el?.id ?? "", "");
    look();
    new MutationObserver(look).observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
    });
  });
}

const writes = (page: Page) =>
  page.evaluate(() => (window as unknown as { __writes: Write[] }).__writes);

/** Waits two frames, so the step-aside check and Svelte have both run. */
const frames = (page: Page) =>
  page.evaluate(
    () =>
      new Promise((r) =>
        requestAnimationFrame(() => requestAnimationFrame(() => r(null))),
      ),
  );

/** Opens the page on a paused clock: time moves only when a test runs it. */
async function clocked(page: Page, path = PAGE): Promise<void> {
  await page.clock.install({ time: T0 });
  await open(page, path);
  await page.clock.pauseAt(new Date(T0.getTime() + 60_000));
}

/** Runs the paused clock forward; its timers and animation frames fire on the way. */
const run = (page: Page, ms: number) => page.clock.runFor(ms);

const focusedSlot = (page: Page) =>
  page.evaluate(() => document.activeElement?.getAttribute("data-slot"));

test.describe("026: the announcers", () => {
  test(
    "44. both announcers are in the server HTML, empty, and no region",
    tag("live"),
    async ({ request }) => {
      const html = await (await request.get(PAGE)).text();
      const status =
        html.match(
          /<div[^>]*data-slot="toaster-status"[^>]*>([\s\S]*?)<\/div>/g,
        ) ?? [];
      const alert =
        html.match(
          /<div[^>]*data-slot="toaster-alert"[^>]*>([\s\S]*?)<\/div>/g,
        ) ?? [];
      expect(status).toHaveLength(1);
      expect(alert).toHaveLength(1);
      expect(status[0]).toContain('role="status"');
      expect(alert[0]).toContain('role="alert"');
      const text = (s: string) =>
        s
          .replace(/<!--[\s\S]*?-->/g, "")
          .replace(/<[^>]+>/g, "")
          .trim();
      expect(text(status[0]!)).toBe("");
      expect(text(alert[0]!)).toBe("");
      expect(html).not.toContain('data-slot="toaster"');
    },
  );

  test(
    "45. success speaks politely, then clears",
    tag("live"),
    async ({ page }) => {
      await open(page, PAGE);
      await record(page);
      await button(page, "raise", "Save").click();
      await expect(status(page)).toHaveText("Success: Project saved.");
      await expect(status(page)).toHaveText("", { timeout: 3000 });
      const w = await writes(page);
      const on = w.find((x) => x.slot === "toaster-status" && x.text)!;
      const off = w.find(
        (x) => x.slot === "toaster-status" && !x.text && x.t > on.t,
      )!;
      expect(off.t - on.t).toBeGreaterThanOrEqual(950);
      expect(off.t - on.t).toBeLessThan(1500);
      expect(w.filter((x) => x.slot === "toaster-alert")).toEqual([]);
    },
  );

  test("46. error speaks assertively", tag("live"), async ({ page }) => {
    await open(page, PAGE);
    await record(page);
    await button(page, "raise", "Save with an error").click();
    await expect(alert(page)).toHaveText(
      "Error: Couldn't save. Check your connection.",
    );
    await expect(alert(page)).toHaveText("", { timeout: 3000 });
    expect(
      (await writes(page)).filter((x) => x.slot === "toaster-status"),
    ).toEqual([]);
  });

  test(
    "47. one schedule: a success beside an error is written again",
    tag("live"),
    async ({ page }) => {
      await open(page, PAGE);
      await record(page);
      await button(page, "raise", "Save two records").click();
      await expect
        .poll(
          async () =>
            (await writes(page)).filter(
              (x) =>
                x.slot === "toaster-status" &&
                x.text === "Success: Record A saved.",
            ).length,
          { timeout: 5000 },
        )
        .toBe(2);
      const w = await writes(page);
      const alertOn = w.find((x) => x.slot === "toaster-alert" && x.text)!;
      expect(alertOn.text).toBe("Error: Couldn't save Record B.");
      const alertOff = w.find(
        (x) => x.slot === "toaster-alert" && !x.text && x.t > alertOn.t,
      )!;
      const again = w.filter(
        (x) =>
          x.slot === "toaster-status" && x.text === "Success: Record A saved.",
      );
      expect(again[0]!.t).toBeLessThanOrEqual(alertOn.t + 50);
      expect(again[1]!.t).toBeGreaterThanOrEqual(alertOff.t);
    },
  );
});

test.describe("026: not live, no stop", () => {
  test(
    "48. the stack is not live, and no toast is a stop",
    tag("keyboard"),
    async ({ page }) => {
      await open(page, PAGE);
      const check = async () => {
        const r = await page.evaluate(() => {
          const region = document.querySelector('[data-slot="toaster"]')!;
          const live = region.querySelectorAll(
            '[aria-live], [role="status"], [role="alert"], [role="log"], [role="marquee"], [role="timer"]',
          ).length;
          const lis = [...region.querySelectorAll("li[data-toast-id]")];
          const stops = lis.map(
            (li) =>
              [
                ...li.querySelectorAll<HTMLElement>(
                  "button, a[href], [tabindex]",
                ),
              ].filter((el) => el.tabIndex >= 0).length,
          );
          const buttons = lis.map((li) => li.querySelectorAll("button").length);
          return {
            live,
            liTabindex: lis.filter((li) => li.hasAttribute("tabindex")).length,
            stops,
            buttons,
            kinds: lis.map((li) => (li as HTMLElement).dataset.kind),
          };
        });
        expect(r.live).toBe(0);
        expect(r.liTabindex).toBe(0);
        expect(r.stops).toEqual(r.buttons);
        return r.kinds;
      };
      const seen = new Set<string | undefined>();
      for (const name of ["Save with an error", "Check storage", "Save"])
        await button(page, "raise", name).click();
      await expect(toasts(page)).toHaveCount(3);
      for (const k of await check()) seen.add(k);
      await page.keyboard.press("F8");
      await page.keyboard.press("Tab");
      for (let i = 0; i < 3; i++) await page.keyboard.press("Escape");
      await expect(toasts(page)).toHaveCount(0);
      await button(page, "raise", "Send invite").click();
      await button(page, "raise", "Start upload").click();
      await button(page, "action", "Delete message").click();
      await expect(toasts(page)).toHaveCount(3);
      for (const k of await check()) seen.add(k);
      expect([...seen].sort()).toEqual(
        ["caution", "error", "info", "loading", "success"].sort(),
      );
    },
  );

  test(
    "49. Dismiss is 32 px, named Dismiss, described by the title",
    tag("axe"),
    async ({ page }) => {
      await open(page, PAGE);
      await button(page, "raise", "Save").click();
      const dismiss = page
        .locator('[data-slot="toaster"]')
        .getByRole("button", { name: "Dismiss" });
      await expect(dismiss).toHaveCount(1);
      await expect(dismiss).toHaveAccessibleName("Dismiss");
      await expect(dismiss).toHaveAccessibleDescription("Project saved");
      const box = (await dismiss.boundingBox())!;
      expect(box.width).toBeGreaterThanOrEqual(24);
      expect(box.height).toBeGreaterThanOrEqual(24);
      expect(Math.round(box.width)).toBe(32);
      expect(Math.round(box.height)).toBe(32);
    },
  );
});

test.describe("026: keyboard and focus", () => {
  test("50. F8 goes to the list and back", tag("focus"), async ({ page }) => {
    await open(page, PAGE);
    const save = button(page, "raise", "Save");
    await save.focus();
    await page.keyboard.press("Enter");
    await expect(toasts(page)).toHaveCount(1);
    await page.keyboard.press("F8");
    const list = page.locator('[data-slot="toaster-list"]');
    await expect(list).toBeFocused();
    await expect(list).toHaveAccessibleName("Newest first");
    await expect(
      page
        .getByRole("region", { name: "Notifications" })
        .locator('[data-slot="toaster-list"]'),
    ).toHaveCount(1);
    await page.keyboard.press("F8");
    await expect(save).toBeFocused();
  });

  test(
    "51. Escape closes and focus moves on",
    tag("focus"),
    async ({ page }) => {
      await open(page, PAGE);
      const trigger = button(page, "keyboard", "Raise two");
      await trigger.focus();
      await page.keyboard.press("Enter");
      await expect(toasts(page)).toHaveCount(2);
      await page.keyboard.press("F8");
      // Newest first: "Message deleted" with Undo, then "Project saved".
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      expect(await focusedSlot(page)).toBe("toast-close");
      await page.keyboard.press("Escape");
      await expect(toasts(page)).toHaveCount(1);
      await expect(
        toasts(page).first().locator('[data-slot="toast-close"]'),
      ).toBeFocused();
      await page.keyboard.press("Escape");
      await expect(toasts(page)).toHaveCount(0);
      await expect(trigger).toBeFocused();
    },
  );

  test(
    "52. entered by F8, Tab past the end returns",
    tag("focus"),
    async ({ page }) => {
      await open(page, PAGE);
      const trigger = button(page, "keyboard", "Raise two");
      await trigger.focus();
      await page.keyboard.press("Enter");
      await expect(toasts(page)).toHaveCount(2);
      await page.keyboard.press("F8");
      // Undo, Dismiss, Dismiss: three stops; the fourth Tab returns.
      for (let i = 0; i < 3; i++) await page.keyboard.press("Tab");
      expect(await focusedSlot(page)).toBe("toast-close");
      await page.keyboard.press("Tab");
      await expect(trigger).toBeFocused();
      // Shift+Tab from the list returns too.
      await page.keyboard.press("F8");
      await page.keyboard.press("Shift+Tab");
      await expect(trigger).toBeFocused();
    },
  );

  test(
    "53. at 390, focus in a toast survives an arriving error",
    tag("focus"),
    async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await open(page, PAGE);
      await button(page, "raise", "Save").click();
      await expect(toasts(page)).toHaveCount(1);
      await page.keyboard.press("F8");
      await page.keyboard.press("Tab");
      const dismiss = toasts(page).first().locator('[data-slot="toast-close"]');
      await expect(dismiss).toBeFocused();
      await button(page, "raise", "Save with an error").dispatchEvent("click");
      await expect(toasts(page)).toHaveCount(1);
      await expect(toasts(page).first()).toHaveAttribute(
        "data-kind",
        "success",
      );
      await expect(dismiss).toBeFocused();
      await expect(more(page)).toHaveText("1 more");
      await page.keyboard.press("Enter");
      await expect(toasts(page).first()).toHaveAttribute("data-kind", "error");
      await expect(
        toasts(page).first().locator('[data-slot="toast-close"]'),
      ).toBeFocused();
    },
  );

  // The change review, finding 3: the pointer passing over a focused toast
  // must not free it.
  test(
    "53b. at 390, the pointer passing over a focused toast leaves it in place",
    tag("focus"),
    async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await open(page, PAGE);
      await button(page, "raise", "Save").click();
      await expect(toasts(page)).toHaveCount(1);
      await page.keyboard.press("F8");
      await page.keyboard.press("Tab");
      const dismiss = toasts(page).first().locator('[data-slot="toast-close"]');
      await expect(dismiss).toBeFocused();
      await toasts(page).first().hover();
      await page.mouse.move(10, 800);
      await button(page, "raise", "Save with an error").dispatchEvent("click");
      await expect(more(page)).toHaveText("1 more");
      await expect(toasts(page)).toHaveCount(1);
      await expect(toasts(page).first()).toHaveAttribute(
        "data-kind",
        "success",
      );
      await expect(dismiss).toBeFocused();
    },
  );

  test(
    "54. narrowing keeps the focused toast",
    tag("focus"),
    async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await open(page, PAGE);
      for (const name of [
        "Save with an error",
        "Check storage",
        "Start upload",
      ])
        await button(page, "raise", name).click();
      await expect(toasts(page)).toHaveCount(3);
      await page.keyboard.press("F8");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      const second = toasts(page).nth(1);
      const id = await second.getAttribute("data-toast-id");
      await expect(second.locator('[data-slot="toast-close"]')).toBeFocused();
      await page.setViewportSize({ width: 390, height: 844 });
      await expect(toasts(page)).toHaveCount(1);
      await expect(toasts(page).first()).toHaveAttribute("data-toast-id", id!);
      await expect(
        toasts(page).first().locator('[data-slot="toast-close"]'),
      ).toBeFocused();
    },
  );

  test(
    "55. a toast closed by a navigation while focused leaves focus on a connected element",
    tag("focus"),
    async ({ page }) => {
      await open(page, PAGE);
      await button(page, "route", "Create project").click();
      await expect(toasts(page)).toHaveCount(1);
      await page.keyboard.press("F8");
      await page.keyboard.press("Tab");
      await expect(
        toasts(page).first().locator('[data-slot="toast-close"]'),
      ).toBeFocused();
      await button(page, "route", "Back to projects").dispatchEvent("click");
      await expect(toasts(page)).toHaveCount(0);
      const r = await page.evaluate(() => ({
        connected: document.activeElement?.isConnected,
        inRegion: !!document.activeElement?.closest('[data-slot="toaster"]'),
        id: document.activeElement?.id,
        tag: document.activeElement?.tagName,
      }));
      expect(r.connected).toBe(true);
      expect(r.inRegion).toBe(false);
      // The remembered element, the clicked "Create project", left with its
      // view: focus goes to #main.
      expect(r.id === "main" || r.tag === "BODY").toBe(true);
    },
  );
});

test.describe("026: timing", () => {
  test("56. a success leaves at 6 s", tag("timing"), async ({ page }) => {
    await clocked(page);
    await button(page, "raise", "Save").click();
    await expect(toasts(page)).toHaveCount(1);
    await run(page, 5999);
    await expect(toasts(page)).toHaveCount(1);
    await run(page, 1 + 240);
    await expect(toasts(page)).toHaveCount(0);
    await expect(page.locator('[data-slot="toaster"]')).toHaveCount(0);
  });

  const CAUSES: {
    name: string;
    hold: (page: Page) => Promise<void>;
    release: (page: Page) => Promise<void>;
  }[] = [
    {
      name: "hover",
      hold: async (page) => toasts(page).first().hover(),
      release: async (page) => page.mouse.move(10, 600),
    },
    {
      name: "focus in the region",
      hold: async (page) => page.keyboard.press("F8"),
      release: async (page) => page.keyboard.press("F8"),
    },
    {
      name: "window blur",
      hold: async (page) => {
        await page.evaluate(() => window.dispatchEvent(new Event("blur")));
      },
      release: async (page) => {
        await page.evaluate(() => window.dispatchEvent(new Event("focus")));
      },
    },
    {
      name: "the page hidden",
      hold: async (page) =>
        page.evaluate(() => {
          Object.defineProperty(document, "visibilityState", {
            configurable: true,
            get: () => "hidden",
          });
          document.dispatchEvent(new Event("visibilitychange"));
        }),
      release: async (page) =>
        page.evaluate(() => {
          Object.defineProperty(document, "visibilityState", {
            configurable: true,
            get: () => "visible",
          });
          document.dispatchEvent(new Event("visibilitychange"));
        }),
    },
    {
      name: "an open dialog",
      hold: async (page) => {
        await button(page, "from-a-dialog", "Delete project").click();
        await expect(page.getByRole("alertdialog")).toBeVisible();
      },
      release: async (page) => {
        await page.keyboard.press("Escape");
        await run(page, 400);
        await expect(page.getByRole("alertdialog")).toHaveCount(0);
      },
    },
  ];

  for (const cause of CAUSES)
    test(
      `57. ${cause.name} holds the clock`,
      tag("timing"),
      async ({ page }) => {
        await clocked(page);
        await button(page, "raise", "Save").focus();
        await page.keyboard.press("Enter");
        await expect(toasts(page)).toHaveCount(1);
        await cause.hold(page);
        await run(page, 20_000);
        await expect(toasts(page)).toHaveCount(1);
        await cause.release(page);
        await run(page, 6000 + 240);
        await expect(toasts(page)).toHaveCount(0);
      },
    );

  test("58. timers off keeps a success", tag("timing"), async ({ page }) => {
    await clocked(page);
    const keep = example(page, "setting").getByRole("switch");
    await keep.click();
    await expect(keep).toHaveAttribute("aria-checked", "true");
    await button(page, "setting", "Save settings").click();
    await expect(toasts(page)).toHaveCount(1);
    await page.mouse.move(10, 600);
    await run(page, 60_000);
    await expect(toasts(page)).toHaveCount(1);
    await keep.click();
    await run(page, 6000 + 240);
    await expect(toasts(page)).toHaveCount(0);
  });

  test(
    "59. errors, cautions, loading and action toasts stay",
    tag("timing"),
    async ({ page }) => {
      await clocked(page);
      await button(page, "raise", "Save with an error").click();
      await button(page, "raise", "Check storage").click();
      await button(page, "raise", "Start upload").click();
      await button(page, "action", "Delete message").click();
      await page.mouse.move(10, 600);
      await run(page, 600_000);
      await expect(toasts(page)).toHaveCount(3);
      await expect(more(page)).toHaveText("1 more");
      const kinds = await toasts(page).evaluateAll((els) =>
        els.map((e) => (e as HTMLElement).dataset.kind),
      );
      expect(kinds.sort()).toEqual(["caution", "error", "loading"].sort());
      // The fourth, the delete with Undo, waits; it shows when one is dismissed.
      await toasts(page).first().locator('[data-slot="toast-close"]').click();
      await run(page, 300);
      await expect(
        page.locator('[data-slot="toaster"] li[data-kind="info"]'),
      ).toHaveCount(1);
    },
  );
});

test.describe("026: the stack and its place", () => {
  test(
    "60. three show at 1440, one at 390",
    tag("layout"),
    async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await open(page, PAGE);
      for (const name of [
        "Save with an error",
        "Check storage",
        "Start upload",
        "Save",
        "Send invite",
      ])
        await button(page, "raise", name).click();
      await expect(toasts(page)).toHaveCount(3);
      await expect(more(page)).toHaveText("2 more");
      await page.setViewportSize({ width: 390, height: 844 });
      await expect(toasts(page)).toHaveCount(1);
      await expect(more(page)).toHaveText("4 more");
    },
  );

  test(
    "61. under a declared bar, and in from the corner",
    tag("layout"),
    async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      const place = () =>
        page.evaluate(() => {
          const r = document
            .querySelector('[data-slot="toaster"]')!
            .getBoundingClientRect();
          return { top: r.top, end: innerWidth - r.right };
        });
      await open(page, PAGE);
      await button(page, "raise", "Start upload").click();
      await expect(toasts(page)).toHaveCount(1);
      const site = await place();
      expect(Math.abs(site.top - 88)).toBeLessThanOrEqual(1);
      expect(Math.abs(site.end - 16)).toBeLessThanOrEqual(1);

      await page.goto("/example/toast/raise/");
      await page.locator(VIEW_READY).waitFor();
      await page.getByRole("button", { name: "Start upload" }).click();
      await expect(toasts(page)).toHaveCount(1);
      const view = await place();
      expect(Math.abs(view.top - 16)).toBeLessThanOrEqual(1);
      expect(Math.abs(view.end - 16)).toBeLessThanOrEqual(1);
    },
  );

  test(
    "62. a modal holds a new toast, and its speech waits",
    tag("live"),
    async ({ page }) => {
      await open(page, PAGE);
      await record(page);
      await button(page, "from-a-dialog", "Delete project").click();
      const dialog = page.getByRole("alertdialog");
      await expect(dialog).toBeVisible();
      await dialog.getByRole("button", { name: "Delete project" }).click();
      await expect(toasts(page)).toHaveCount(1);
      await expect(status(page)).toHaveText("Success: Project deleted.", {
        timeout: 3000,
      });
      const r = await page.evaluate(() => {
        const w = window as unknown as {
          __writes: Write[];
          __drawn: { id: string; kind: string; t: number }[];
          __modal: { open: boolean; t: number }[];
        };
        return { writes: w.__writes, drawn: w.__drawn, modal: w.__modal };
      });
      const closed = r.modal.find((m) => !m.open)!;
      expect(closed).toBeDefined();
      // Not shown while the dialog was open, and no speech then.
      expect(r.drawn[0]!.t).toBeGreaterThanOrEqual(closed.t);
      const said = r.writes.find(
        (x) =>
          x.slot === "toaster-status" && x.text === "Success: Project deleted.",
      )!;
      expect(said.t - closed.t).toBeGreaterThanOrEqual(1000 - 20);
      expect(said.t - closed.t).toBeLessThanOrEqual(1000 + 120);
      expect(
        r.writes.filter((x) => x.slot !== "svelte-announcer" && x.t < closed.t),
      ).toEqual([]);
    },
  );
});

test.describe("026: a toast never covers the keyboard focus", () => {
  /** True when a visible toast's box overlaps the focused element's. */
  const covered = (page: Page) =>
    page.evaluate(() => {
      const a = document.activeElement as HTMLElement | null;
      if (!a || a === document.body || a.closest('[data-slot="toaster"]'))
        return null;
      const f = a.getBoundingClientRect();
      // The item's own exemption (the review's finding 1): a focused element
      // whose visible part is wider than the region, or as tall as the
      // viewport, cannot be hidden by the stack, so nothing steps aside.
      const region = document
        .querySelector('[data-slot="toaster"]')!
        .getBoundingClientRect();
      const width = Math.min(f.right, innerWidth) - Math.max(f.left, 0);
      const height = Math.min(f.bottom, innerHeight) - Math.max(f.top, 0);
      if (width > region.width || height >= innerHeight) return null;
      for (const li of document.querySelectorAll<HTMLElement>(
        '[data-slot="toaster"] li[data-toast-id]',
      )) {
        if (getComputedStyle(li).visibility === "hidden") continue;
        const b = li.getBoundingClientRect();
        if (
          b.left < f.right &&
          f.left < b.right &&
          b.top < f.bottom &&
          f.top < b.bottom
        )
          return `${a.tagName} ${a.textContent?.trim().slice(0, 30)} under ${li.dataset.toastId}`;
      }
      return null;
    });

  for (const [width, height, count] of [
    [1440, 900, 3],
    [390, 844, 1],
  ] as const)
    test(
      `63. at ${width}, Tab through every stop: no visible toast covers it`,
      tag("keyboard"),
      async ({ page }) => {
        test.setTimeout(240_000);
        await page.setViewportSize({ width, height });
        await open(page, PAGE);
        const keep = example(page, "setting").getByRole("switch");
        await keep.click();
        for (const name of [
          "Save with an error",
          "Check storage",
          "Start upload",
        ])
          await button(page, "raise", name).click();
        await expect(toasts(page)).toHaveCount(count);
        await page.evaluate(() =>
          (document.activeElement as HTMLElement)?.blur(),
        );
        const wrong: string[] = [];
        let stops = 0;
        for (let i = 0; i < 600; i++) {
          await page.keyboard.press("Tab");
          await frames(page);
          const at = await page.evaluate(() => document.activeElement?.tagName);
          if (!at || at === "BODY") break;
          stops++;
          const c = await covered(page);
          if (c) wrong.push(c);
        }
        expect(stops).toBeGreaterThan(50);
        expect(wrong).toEqual([]);
      },
    );

  /** A button fixed under the first toast, inserted before `before` so Tab reaches it. */
  const under = (page: Page, before: Locator, label = "Under") =>
    before.evaluate((el, name) => {
      const b = document.createElement("button");
      b.textContent = name;
      b.id = "under";
      b.setAttribute(
        "style",
        "position: fixed; top: 100px; right: 40px; z-index: 1; height: 32px",
      );
      el.before(b);
    }, label);

  test(
    "64a. a covering toast steps aside, and comes back",
    tag("focus"),
    async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await clocked(page);
      const save = button(page, "raise", "Save");
      await save.click();
      await expect(toasts(page)).toHaveCount(1);
      await page.mouse.move(10, 600);
      await under(page, save);
      await save.focus();
      await page.keyboard.press("Shift+Tab");
      await expect(page.locator("#under")).toBeFocused();
      await run(page, 32);
      const toast = toasts(page).first();
      await expect(toast).toHaveAttribute("data-aside", "");
      expect(await toast.evaluate((e) => getComputedStyle(e).visibility)).toBe(
        "hidden",
      );
      await expect(more(page)).toHaveText("1 hidden");
      await run(page, 20_000);
      await expect(toasts(page)).toHaveCount(1);
      // Escape on the covered button closes nothing.
      await page.keyboard.press("Escape");
      await expect(toasts(page)).toHaveCount(1);
      // Tab to Save: it returns, and runs out its time.
      await page.keyboard.press("Tab");
      await expect(save).toBeFocused();
      await run(page, 32);
      await expect(toast).not.toHaveAttribute("data-aside", "");
      expect(await toast.evaluate((e) => getComputedStyle(e).visibility)).toBe(
        "visible",
      );
      await run(page, 6000 + 240);
      await expect(toasts(page)).toHaveCount(0);
    },
  );

  // The change review, finding 1: a container that takes focus, such as
  // `main` after a skip link, is larger than any toast. Nothing steps aside
  // for it, and the toasts keep their time.
  test(
    "64g. after the skip link, focus on #main: every toast stays in view and timing",
    tag("focus"),
    async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await clocked(page);
      const save = button(page, "raise", "Save");
      await save.focus();
      await page.keyboard.press("Enter");
      await expect(toasts(page)).toHaveCount(1);
      const skip = page.locator('a[href="#main"]').first();
      await skip.focus();
      await expect(skip).toBeFocused();
      await page.keyboard.press("Enter");
      await expect(page.locator("#main")).toBeFocused();
      await run(page, 48);
      await expect(toasts(page).first()).not.toHaveAttribute("data-aside", "");
      expect(
        await toasts(page)
          .first()
          .evaluate((e) => getComputedStyle(e).visibility),
      ).toBe("visible");
      await expect(more(page)).toHaveCount(0);
      await run(page, 6000 + 240);
      await expect(toasts(page)).toHaveCount(0);
    },
  );

  test(
    "64b. with a dialog open, Escape closes the dialog and no toast",
    tag("focus"),
    async ({ page }) => {
      await open(page, PAGE);
      await button(page, "raise", "Check storage").click();
      await button(page, "from-a-dialog", "Delete project").click();
      await expect(page.getByRole("alertdialog")).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(page.getByRole("alertdialog")).toHaveCount(0);
      await expect(toasts(page)).toHaveCount(1);
    },
  );

  test(
    "64c. a panel scrolls the focus under the stack",
    tag("focus"),
    async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await open(page, PAGE);
      const save = button(page, "raise", "Check storage");
      await save.click();
      await expect(toasts(page)).toHaveCount(1);
      await page.mouse.move(10, 600);
      await save.evaluate((el) => {
        const panel = document.createElement("div");
        panel.id = "panel";
        panel.setAttribute(
          "style",
          "position: fixed; top: 88px; right: 40px; width: 200px; height: 400px; overflow: auto; z-index: 1",
        );
        panel.innerHTML =
          '<div style="height: 1200px; padding-top: 300px"><button id="in-panel" style="height: 32px">In panel</button></div>';
        el.before(panel);
      });
      await save.focus();
      await page.keyboard.press("Shift+Tab");
      await expect(page.locator("#in-panel")).toBeFocused();
      await frames(page);
      await expect(toasts(page).first()).not.toHaveAttribute("data-aside", "");
      await page.evaluate(() => {
        document.getElementById("panel")!.scrollTop = 260;
      });
      await frames(page);
      await expect(toasts(page).first()).toHaveAttribute("data-aside", "");
    },
  );

  test(
    "64d. content pushes the focus under the stack",
    tag("focus"),
    async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await open(page, PAGE);
      const save = button(page, "raise", "Check storage");
      await save.click();
      await expect(toasts(page)).toHaveCount(1);
      await page.mouse.move(10, 600);
      await save.evaluate((el) => {
        const box = document.createElement("div");
        box.id = "box";
        box.setAttribute(
          "style",
          "position: fixed; top: 40px; right: 40px; width: 200px; z-index: 60",
        );
        box.innerHTML =
          '<div id="grow"></div><button id="pushed" style="height: 32px">Pushed</button>';
        el.before(box);
      });
      await save.focus();
      await page.keyboard.press("Shift+Tab");
      await expect(page.locator("#pushed")).toBeFocused();
      await frames(page);
      await expect(toasts(page).first()).not.toHaveAttribute("data-aside", "");
      await page.evaluate(() =>
        document.getElementById("grow")!.setAttribute("style", "height: 60px"),
      );
      await frames(page);
      await expect(toasts(page).first()).toHaveAttribute("data-aside", "");
    },
  );

  const placeSave = (page: Page) =>
    button(page, "raise", "Save").evaluate((el) =>
      el.setAttribute(
        "style",
        "position: fixed; top: 100px; right: 40px; z-index: 1",
      ),
    );

  test(
    "64e. a click does not hide its own toast",
    tag("focus"),
    async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await open(page, PAGE);
      await placeSave(page);
      await button(page, "raise", "Save").click({ force: true });
      await expect(toasts(page)).toHaveCount(1);
      await frames(page);
      await frames(page);
      await expect(toasts(page).first()).not.toHaveAttribute("data-aside", "");
      expect(
        await toasts(page)
          .first()
          .evaluate((e) => getComputedStyle(e).visibility),
      ).toBe("visible");
    },
  );

  test(
    "64f. the keyboard case: its toast shows stepped aside",
    tag("focus"),
    async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await open(page, PAGE);
      await placeSave(page);
      const save = button(page, "raise", "Save");
      await save.focus();
      await page.keyboard.press("Shift+Tab");
      await page.keyboard.press("Tab");
      await expect(save).toBeFocused();
      await page.keyboard.press("Enter");
      await expect(toasts(page)).toHaveCount(1);
      await frames(page);
      await expect(toasts(page).first()).toHaveAttribute("data-aside", "");
      await expect(more(page)).toHaveText("1 hidden");
    },
  );
});

/** "rgb(r, g, b)" or "rgba(…)" as #rrggbb, and its alpha. */
function parse(colour: string): { hex: string; alpha: number } {
  const m = colour.match(/rgba?\(([^)]+)\)/);
  if (!m) return { hex: "#000000", alpha: colour === "transparent" ? 0 : 1 };
  const [r, g, b, a] = m[1]!
    .split(/[\s,/]+/)
    .filter(Boolean)
    .map(Number);
  const hex = `#${[r, g, b].map((n) => n!.toString(16).padStart(2, "0")).join("")}`;
  return { hex, alpha: a ?? 1 };
}

test.describe("026: the look", () => {
  test(
    "65. the kind's icon reaches 3:1, its text 4.5:1",
    tag("contrast"),
    async ({ page }) => {
      await open(page, PAGE);
      const rows = await example(page, "kinds")
        .locator('[data-slot="toast"]')
        .evaluateAll((els) =>
          els.map((el) => ({
            kind: (el as HTMLElement).dataset.kind!,
            ground: getComputedStyle(el).backgroundColor,
            icon: getComputedStyle(
              el.querySelector('[data-slot="toast-icon"]')!,
            ).color,
            title: getComputedStyle(
              el.querySelector('[data-slot="toast-title"]')!,
            ).color,
            description: el.querySelector('[data-slot="toast-description"]')
              ? getComputedStyle(
                  el.querySelector('[data-slot="toast-description"]')!,
                ).color
              : null,
          })),
        );
      expect(rows).toHaveLength(5);
      for (const r of rows) {
        const ground = parse(r.ground).hex;
        expect(
          contrastRatio(parse(r.icon).hex, ground),
          r.kind,
        ).toBeGreaterThanOrEqual(3);
        expect(
          contrastRatio(parse(r.title).hex, ground),
          r.kind,
        ).toBeGreaterThanOrEqual(4.5);
        if (r.description)
          expect(
            contrastRatio(parse(r.description).hex, ground),
            r.kind,
          ).toBeGreaterThanOrEqual(4.5);
      }
    },
  );

  test(
    "66. nothing in a toast is translucent",
    tag("depth"),
    async ({ page }) => {
      await open(page, PAGE);
      for (const name of ["Save with an error", "Check storage", "Save"])
        await button(page, "raise", name).click();
      await button(page, "raise", "Send invite").click();
      await button(page, "raise", "Start upload").click();
      await page.mouse.move(10, 600);
      await expect(toasts(page)).toHaveCount(3);
      const check = () =>
        toasts(page).evaluateAll(async (els) => {
          const bad: string[] = [];
          for (const li of els) {
            await Promise.all(li.getAnimations().map((a) => a.finished));
            for (const el of [li, ...li.querySelectorAll("*")]) {
              const s = getComputedStyle(el);
              const alpha = (c: string) => {
                const m = c.match(/rgba?\(([^)]+)\)/);
                if (!m) return 1;
                const parts = m[1]!.split(/[\s,/]+/).filter(Boolean);
                return parts.length > 3 ? Number(parts[3]) : 1;
              };
              for (const p of [
                "backgroundColor",
                "borderTopColor",
                "borderRightColor",
                "borderBottomColor",
                "borderLeftColor",
              ] as const) {
                const a = alpha(s[p]);
                if (a > 0 && a < 1) bad.push(`${el.tagName} ${p} ${s[p]}`);
              }
              if (s.backdropFilter !== "none")
                bad.push(`${el.tagName} backdrop`);
              if (s.opacity !== "1")
                bad.push(`${el.tagName} opacity ${s.opacity}`);
            }
          }
          return bad;
        });
      expect(await check()).toEqual([]);
      // The other two kinds.
      await page.keyboard.press("F8");
      await page.keyboard.press("Tab");
      for (let i = 0; i < 3; i++) await page.keyboard.press("Escape");
      await expect(toasts(page)).toHaveCount(2);
      await page.mouse.move(10, 600);
      expect(await check()).toEqual([]);
    },
  );

  for (const [width, height] of [
    [1440, 900],
    [390, 844],
  ] as const)
    test(
      `67. axe: 0 violations at ${width}, every kind showing`,
      tag("axe"),
      async ({ page }) => {
        await page.setViewportSize({ width, height });
        await open(page, PAGE);
        const keep = example(page, "setting").getByRole("switch");
        await keep.click();
        for (const name of [
          "Save with an error",
          "Check storage",
          "Save",
          "Send invite",
          "Start upload",
        ])
          await button(page, "raise", name).click();
        const scan = async () => {
          await page.mouse.move(10, height - 10);
          await toasts(page).evaluateAll((els) =>
            Promise.all(
              els.flatMap((e) => e.getAnimations().map((a) => a.finished)),
            ),
          );
          const results = await new AxeBuilder({ page })
            .include('[data-slot="toaster"]')
            .withTags([
              "wcag2a",
              "wcag2aa",
              "wcag21a",
              "wcag21aa",
              "wcag22aa",
              "best-practice",
            ])
            .analyze();
          return results.violations.map(
            (v) =>
              `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`,
          );
        };
        expect(await scan()).toEqual([]);
        // Dismiss what shows until each kind has had its turn.
        while ((await toasts(page).count()) > 0) {
          await toasts(page)
            .first()
            .locator('[data-slot="toast-close"]')
            .click();
          if ((await toasts(page).count()) > 0)
            expect(await scan()).toEqual([]);
        }
      },
    );

  test(
    "67b. axe: 0 violations on the specimens and the pairs",
    tag("axe"),
    async ({ page }) => {
      await open(page, PAGE);
      const results = await new AxeBuilder({ page })
        .include('[data-example="kinds"]')
        .include("[data-pair]")
        .withTags([
          "wcag2a",
          "wcag2aa",
          "wcag21a",
          "wcag21aa",
          "wcag22aa",
          "best-practice",
        ])
        .analyze();
      expect(
        results.violations.map(
          (v) =>
            `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`,
        ),
      ).toEqual([]);
      await expect(page.locator("[data-pair]")).toHaveCount(6);
    },
  );
});

test.describe("026: forced colours", () => {
  test.use({ forcedColors: "active" });

  test(
    "68. forced colours draw the edge, and the icons differ",
    tag("forced-colors"),
    async ({ page }) => {
      // The change review, finding 7: Playwright's WebKit does not emulate
      // forced colours, so every border stays transparent there. A harness
      // limit, not a fault: counted in ENGINE_ONLY, not in the ledger.
      notIn(
        "webkit",
        "forced colours: Playwright's WebKit does not emulate forcedColors",
      );
      await open(page, PAGE);
      const rows = await example(page, "kinds")
        .locator('[data-slot="toast"]')
        .evaluateAll((els) =>
          els.map((el) => {
            const s = getComputedStyle(el);
            return {
              kind: (el as HTMLElement).dataset.kind!,
              widths: [
                s.borderTopWidth,
                s.borderRightWidth,
                s.borderBottomWidth,
                s.borderLeftWidth,
              ],
              colours: [
                s.borderTopColor,
                s.borderRightColor,
                s.borderBottomColor,
                s.borderLeftColor,
              ],
              path: [...el.querySelectorAll('[data-slot="toast-icon"] path')]
                .map((p) => p.getAttribute("d"))
                .join(" "),
            };
          }),
        );
      expect(rows).toHaveLength(5);
      for (const r of rows) {
        for (const w of r.widths)
          expect(parseFloat(w), r.kind).toBeGreaterThanOrEqual(1);
        for (const c of r.colours) {
          expect(c, r.kind).not.toBe("rgba(0, 0, 0, 0)");
          expect(c, r.kind).not.toBe("transparent");
        }
      }
      expect(new Set(rows.map((r) => r.path)).size).toBe(5);
    },
  );
});

test.describe("026: reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("69. reduced motion: nothing moves", tag("motion"), async ({ page }) => {
    await open(page, PAGE);
    await button(page, "raise", "Start upload").click();
    const li = toasts(page).first();
    await expect(li).toHaveCount(1);
    const r = await li.evaluate((el) => ({
      duration: getComputedStyle(el).animationDuration,
      spin: getComputedStyle(el.querySelector('[data-slot="toast-icon"] svg')!)
        .animationIterationCount,
    }));
    expect(
      parseFloat(r.duration) * (r.duration.endsWith("ms") ? 1 : 1000),
    ).toBeLessThanOrEqual(0.0101);
    expect(r.spin).toBe("1");
  });
});

test.describe("026: exits", () => {
  test(
    "70. a closing toast leaves even without animationend",
    tag("motion"),
    async ({ page }) => {
      await clocked(page);
      await button(page, "raise", "Save").click();
      await expect(toasts(page)).toHaveCount(1);
      await page.mouse.move(10, 600);
      await page
        .locator('[data-slot="toaster"]')
        .evaluate((el) => el.setAttribute("style", "display: none"));
      await run(page, 6000);
      await expect(
        page.locator('[data-slot="toaster"] li[data-state="closed"]'),
      ).toHaveCount(1);
      // Its animation is 200 ms; the fallback is that plus one frame.
      await run(page, 200 + 16 + 16);
      await expect(
        page.locator('[data-slot="toaster"] li[data-toast-id]'),
      ).toHaveCount(0);
    },
  );
});

test.describe("026: navigation, promises and repeats", () => {
  test(
    "71. a timed toast survives one navigation",
    tag("live"),
    async ({ page }) => {
      await open(page, PAGE);
      await record(page);
      await button(page, "route", "Create project").click();
      await expect(
        example(page, "route").getByText("pluto-sandbox, created just now.", {
          exact: true,
        }),
      ).toBeVisible();
      await expect(toasts(page)).toHaveCount(1);
      await expect(status(page)).toHaveText("Success: Project created.", {
        timeout: 3000,
      });
      const w = await writes(page);
      const title = w.find((x) => x.slot === "svelte-announcer" && x.text)!;
      const said = w.find(
        (x) =>
          x.slot === "toaster-status" && x.text === "Success: Project created.",
      )!;
      expect(title).toBeDefined();
      expect(said.t).toBeGreaterThan(title.t);
    },
  );

  test(
    "72. a fast promise never draws a loading toast",
    tag("live"),
    async ({ page }) => {
      await open(page, PAGE);
      await record(page);
      await button(page, "promise", "Save quickly").click();
      await expect(toasts(page)).toHaveCount(1);
      await expect(toasts(page).first()).toHaveAttribute(
        "data-kind",
        "success",
      );
      const drawn = () =>
        page.evaluate(
          () =>
            (window as unknown as { __drawn: { id: string; kind: string }[] })
              .__drawn,
        );
      expect((await drawn()).filter((d) => d.kind === "loading")).toEqual([]);
      await toasts(page).first().locator('[data-slot="toast-close"]').click();
      await button(page, "promise", "Save slowly").click();
      await expect(
        page.locator('[data-slot="toaster"] li[data-kind="loading"]'),
      ).toHaveCount(1);
      await expect(
        page.locator('[data-slot="toaster"] li[data-kind="success"]'),
      ).toHaveCount(1, { timeout: 3000 });
      const slow = (await drawn()).slice(-2);
      expect(slow.map((d) => d.kind)).toEqual(["loading", "success"]);
      expect(slow[0]!.id).toBe(slow[1]!.id);
    },
  );

  test(
    "73. a plain repeat is one toast, spoken twice; two deletes are two toasts",
    tag("live"),
    async ({ page }) => {
      // On the paused clock, so the first toast cannot run out while the
      // count is read: it is counted once, not polled.
      await clocked(page);
      await record(page);
      const save = button(page, "raise", "Save");
      await save.click();
      await run(page, 3000);
      await save.click();
      await run(page, 32);
      expect(await toasts(page).count()).toBe(1);
      await run(page, 2500);
      expect(
        (await writes(page)).filter(
          (x) =>
            x.slot === "toaster-status" && x.text === "Success: Project saved.",
        ),
      ).toHaveLength(2);
      await page.clock.resume();
      await toasts(page).first().locator('[data-slot="toast-close"]').click();
      await expect(toasts(page)).toHaveCount(0);
      const del = button(page, "action", "Delete message");
      await del.click();
      await del.click();
      await expect(toasts(page)).toHaveCount(2);
      await expect(
        page
          .locator('[data-slot="toaster"]')
          .getByRole("button", { name: "Undo" }),
      ).toHaveCount(2);
    },
  );
});
