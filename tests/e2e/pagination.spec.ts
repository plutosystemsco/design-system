/**
 * 027b: pagination, tests 13 to 24 with 13a, 15a and 20a, on its example
 * views in the project's scheme. Link mode is `links`; button mode is
 * `buttons`, `narrow` and `small`. `ends` holds the fixtures a few tests
 * need: a one-page pager, hidden, and, with `?hooks`, pagers on the pages
 * beside the ends (with long words) and the width sweep's eighteen.
 */
import type { Locator, Page } from "@playwright/test";
import { expect, test } from "../test.ts";
import { adaptsIn, notIn, onlyIn } from "./engines.ts";
import { contrastRatio } from "../../scripts/contrast.ts";
import { settled } from "./pages.ts";
import {
  coloursOf,
  frames,
  openExample,
  schemeOf,
  transparent,
} from "./batch-a.ts";

const ITEM = "pagination";
const tag = (check: string) => ({
  annotation: { type: "check", description: check },
});

const nav = (page: Page) =>
  page.locator('main [data-slot="pagination"]').first();
const button = (scope: Locator | Page, name: string) =>
  scope.getByRole("button", { name, exact: true });
const link = (scope: Locator | Page, name: string) =>
  scope.getByRole("link", { name, exact: true });
/** The control focus is on: its accessible name's words, read from the DOM. */
const focusedText = (page: Page) =>
  page.evaluate(() => {
    const a = document.activeElement as HTMLElement | null;
    return a && a !== document.body
      ? (a.textContent ?? "").replace(/\s+/g, " ").trim()
      : "body";
  });

/** Opens an example with `?hooks`, so its client-only fixtures render. */
async function openHooks(
  page: Page,
  info: Parameters<typeof openExample>[1],
  id: string,
) {
  await page.goto(`/example/${ITEM}/${id}/?theme=${schemeOf(info)}&hooks`);
  await page.locator("body[data-view-ready]").waitFor();
  await page.locator('[data-testid="pagination-hooks"]').waitFor();
}

/** Presses a button-mode page by its number, by click or by Enter. */
async function press(
  page: Page,
  scope: Locator,
  n: number,
  by: "click" | "Enter",
) {
  const control = button(scope, `Page ${n}`);
  if (by === "click") await control.click();
  else {
    await control.focus();
    await page.keyboard.press("Enter");
  }
  await expect(button(scope, `Page ${n}`)).toHaveAttribute(
    "aria-current",
    "page",
  );
}

test.describe(
  "027b: pagination",
  { annotation: { type: "item", description: ITEM } },
  () => {
    test.use({ viewport: { width: 1440, height: 900 } });

    test(
      "13. a named nav in three parts",
      tag("structure"),
      async ({ page }, info) => {
        await openExample(page, info, ITEM, "links");
        await expect(
          page.getByRole("navigation", { name: "Pagination" }),
        ).toHaveCount(1);
        const slots = await nav(page).evaluate((el) =>
          Array.from(el.children).map((c) => c.getAttribute("data-slot")),
        );
        expect(slots).toEqual([
          "pagination-previous",
          "pagination-list",
          "pagination-summary",
          "pagination-next",
        ]);
        // Page 5 of 12: 1 … 4 5 6 … 12. The ellipses are hidden, so the list
        // exposes the five pages only.
        const list = nav(page).getByRole("list");
        await expect(list.getByRole("listitem")).toHaveCount(5);
        await expect(
          nav(page).locator('[data-slot="pagination-ellipsis"]'),
        ).toHaveCount(2);
        for (const e of await nav(page)
          .locator('[data-slot="pagination-ellipsis"]')
          .all())
          await expect(e).toHaveAttribute("aria-hidden", "true");

        // The review's finding 2: an app's own name wins over the
        // translated default, so two pagers on a page can each be named.
        await openExample(page, info, ITEM, "buttons");
        const named = page.getByRole("navigation", {
          name: "Invoice pages",
          exact: true,
        });
        await expect(named).toHaveCount(1);
        await expect(named).toHaveAttribute("data-slot", "pagination");
        await openHooks(page, info, "ends");
        await expect(
          page
            .getByTestId("pagination-named")
            .getByRole("navigation", { name: "Article pages", exact: true }),
        ).toHaveCount(1);
      },
    );

    for (const width of [1440, 390])
      test(
        `13a. in a footer row it has its width, at ${width}`,
        tag("layout"),
        async ({ page }, info) => {
          await page.setViewportSize({ width, height: 900 });
          await openExample(page, info, ITEM, "in-a-footer");
          const n = nav(page);
          const facts = await n.evaluate((el) => {
            const row = el.parentElement!.getBoundingClientRect();
            const box = el.getBoundingClientRect();
            const controls = Array.from(
              el.querySelectorAll<HTMLElement>(
                "a, button, [data-slot=pagination-summary]",
              ),
            ).filter((c) => c.getClientRects().length > 0);
            return {
              width: box.width,
              fits: el.scrollWidth <= el.clientWidth,
              controls: controls.map((c) => {
                const r = c.getBoundingClientRect();
                return {
                  name: (c.textContent ?? "").trim(),
                  fits: c.scrollWidth <= c.clientWidth,
                  inside:
                    r.left >= row.left - 0.5 &&
                    r.right <= row.right + 0.5 &&
                    r.top >= row.top - 0.5 &&
                    r.bottom <= row.bottom + 0.5,
                };
              }),
            };
          });
          expect(facts.width).toBeGreaterThan(0);
          expect(facts.fits).toBe(true);
          expect(facts.controls.length).toBeGreaterThan(2);
          for (const c of facts.controls) {
            expect(c.fits, `${c.name} overflows`).toBe(true);
            expect(c.inside, `${c.name} leaves the row`).toBe(true);
          }
        },
      );

    test(
      "14. link mode renders links",
      tag("structure"),
      async ({ page }, info) => {
        await openExample(page, info, ITEM, "links");
        const n = nav(page);
        for (const p of [1, 4, 5, 6, 12])
          await expect(link(n, `Page ${p}`)).toHaveAttribute(
            "href",
            `?page=${p}`,
          );
        await expect(link(n, "Previous page")).toHaveAttribute(
          "href",
          "?page=4",
        );
        await expect(link(n, "Next page")).toHaveAttribute("href", "?page=6");
        await expect(link(n, "Previous page")).toHaveAttribute("rel", "prev");
        await expect(link(n, "Next page")).toHaveAttribute("rel", "next");
        await expect(link(n, "Page 5")).toHaveAttribute("aria-current", "page");
        for (const p of [1, 4, 6, 12])
          expect(
            await link(n, `Page ${p}`).getAttribute("aria-current"),
          ).toBeNull();
        await expect(n.locator("button")).toHaveCount(0);
      },
    );

    test(
      "15. button mode renders buttons",
      tag("structure"),
      async ({ page }, info) => {
        await openExample(page, info, ITEM, "buttons");
        const n = nav(page);
        for (const name of [
          "Page 1",
          "Page 4",
          "Page 5",
          "Page 6",
          "Page 12",
          "Previous page",
          "Next page",
        ])
          await expect(button(n, name)).toHaveAttribute("type", "button");
        await expect(n.locator("a")).toHaveCount(0);
        await expect(button(n, "Page 5")).toHaveAttribute(
          "aria-current",
          "page",
        );
        await expect(page.getByTestId("pagination-shown")).toContainText(
          "21 to 25",
        );
        await button(n, "Page 6").click();
        await expect(page.getByTestId("pagination-shown")).toContainText(
          "26 to 30",
        );
        await expect(button(n, "Page 6")).toHaveAttribute(
          "aria-current",
          "page",
        );
        expect(
          await button(n, "Page 5").getAttribute("aria-current"),
        ).toBeNull();
      },
    );

    for (const by of ["Enter", "click"] as const)
      test(
        `15a. focus stays on a pressed page across range changes, by ${by}`,
        tag("focus"),
        async ({ page }, info) => {
          await openExample(page, info, ITEM, "buttons");
          const n = nav(page);
          await press(page, n, 1, by);
          // By click, macOS WebKit focuses no button; the item then moves no
          // focus either. Linux WebKit focuses it, as Chromium does (022o).
          const macClick =
            by === "click" &&
            adaptsIn(
              "webkit",
              "focus on click: macOS WebKit does not focus a button on click, so the item moves no focus",
              "darwin",
            );
          for (const n2 of [5, 12, 1, 4, 3]) {
            const before = await focusedText(page);
            await press(page, n, n2, by);
            await frames(page);
            if (macClick)
              expect(await focusedText(page), `after ${n2}`).toBe(before);
            else
              await expect(
                button(n, `Page ${n2}`),
                `after ${n2}`,
              ).toBeFocused();
          }
        },
      );

    test(
      "16. the ends are omitted, and the slot keeps its width",
      tag("layout"),
      async ({ page }, info) => {
        await openHooks(page, info, "ends");
        const slotWidth = (id: string, slot: string) =>
          page
            .getByTestId(id)
            .locator(`[data-slot="${slot}"]`)
            .evaluate((el) => el.getBoundingClientRect().width);
        for (const words of ["plain", "long"]) {
          const first = page.getByTestId(`pagination-ends-1-${words}`);
          const last = page.getByTestId(`pagination-ends-12-${words}`);
          await expect(first.getByRole("button")).toHaveCount(0);
          await expect(
            first.getByRole("link", { name: /previous/i }),
          ).toHaveCount(0);
          await expect(last.getByRole("link", { name: /next/i })).toHaveCount(
            0,
          );
          // The first Tab stop of page 1 is Page 1; the last of page 12 is Page 12.
          const stops = (scope: Locator) =>
            scope.evaluate((el) =>
              Array.from(el.querySelectorAll<HTMLElement>("a[href], button"))
                .filter(
                  (c) =>
                    c.closest("[inert]") === null &&
                    getComputedStyle(c).visibility !== "hidden",
                )
                .map((c) => (c.textContent ?? "").replace(/\s+/g, " ").trim()),
            );
          expect((await stops(first))[0]).toBe("Page 1");
          expect((await stops(last)).at(-1)).toBe("Page 12");
          const prev1 = await slotWidth(
            `pagination-ends-1-${words}`,
            "pagination-previous",
          );
          const prev2 = await slotWidth(
            `pagination-ends-2-${words}`,
            "pagination-previous",
          );
          expect(
            Math.abs(prev1 - prev2),
            `previous, ${words}`,
          ).toBeLessThanOrEqual(1);
          const next12 = await slotWidth(
            `pagination-ends-12-${words}`,
            "pagination-next",
          );
          const next11 = await slotWidth(
            `pagination-ends-11-${words}`,
            "pagination-next",
          );
          expect(
            Math.abs(next12 - next11),
            `next, ${words}`,
          ).toBeLessThanOrEqual(1);
        }
        // The long words make the slots wider: the slot follows the words.
        expect(
          await slotWidth("pagination-ends-2-long", "pagination-previous"),
        ).toBeGreaterThan(
          (await slotWidth("pagination-ends-2-plain", "pagination-previous")) +
            20,
        );
      },
    );

    for (const id of ["buttons", "small"])
      test(
        `17. the list keeps its width as the page moves, on ${id}`,
        tag("layout"),
        async ({ page }, info) => {
          await openExample(page, info, ITEM, id);
          const n = nav(page);
          const list = n.locator('[data-slot="pagination-list"]');
          await button(n, "Page 1").click();
          const widths: number[] = [];
          for (let p = 1; p <= 12; p++) {
            if (p > 1) await button(n, "Next page").click();
            await expect(button(n, `Page ${p}`)).toHaveAttribute(
              "aria-current",
              "page",
            );
            widths.push(
              await list.evaluate((el) => el.getBoundingClientRect().width),
            );
          }
          expect(
            Math.max(...widths) - Math.min(...widths),
            widths.join(", "),
          ).toBeLessThanOrEqual(1);
        },
      );

    test(
      "18. focus survives the end, at 1440",
      tag("focus"),
      async ({ page }, info) => {
        await openExample(page, info, ITEM, "buttons");
        const n = nav(page);
        await press(page, n, 12, "Enter");
        await press(page, n, 11, "Enter");
        await button(n, "Next page").focus();
        await page.keyboard.press("Enter");
        await expect(button(n, "Next page")).toHaveCount(0);
        await expect(button(n, "Page 12")).toBeFocused();
        await expect(button(n, "Page 12")).toHaveAttribute(
          "aria-current",
          "page",
        );
        // And Previous onto page 1.
        await press(page, n, 1, "Enter");
        await press(page, n, 2, "Enter");
        await button(n, "Previous page").focus();
        await page.keyboard.press("Enter");
        await expect(button(n, "Previous page")).toHaveCount(0);
        await expect(button(n, "Page 1")).toBeFocused();
      },
    );

    test(
      "18. focus survives the end, narrow at 320",
      tag("focus"),
      async ({ page }, info) => {
        await page.setViewportSize({ width: 320, height: 900 });
        await openExample(page, info, ITEM, "narrow");
        const n = nav(page);
        await expect(n.locator('[data-slot="pagination-list"]')).toBeHidden();
        await expect(n.locator('[data-slot="pagination-summary"]')).toHaveText(
          "Page 5 of 12",
        );
        await button(n, "Next page").focus();
        for (let p = 6; p <= 11; p++) {
          await page.keyboard.press("Enter");
          await expect(
            n.locator('[data-slot="pagination-summary"]'),
          ).toHaveText(`Page ${p} of 12`);
        }
        await page.keyboard.press("Enter");
        await expect(button(n, "Next page")).toHaveCount(0);
        await expect(button(n, "Previous page")).toBeFocused();
        for (let p = 11; p >= 2; p--) {
          await page.keyboard.press("Enter");
          await expect(
            n.locator('[data-slot="pagination-summary"]'),
          ).toHaveText(`Page ${p} of 12`);
        }
        await page.keyboard.press("Enter");
        await expect(button(n, "Previous page")).toHaveCount(0);
        await expect(button(n, "Next page")).toBeFocused();
      },
    );

    test(
      "18. a WebKit click on Next onto the last page, from outside the nav, moves no focus",
      tag("focus"),
      async ({ page }, info) => {
        // 022o: Linux WebKit focuses the clicked button, as Chromium does.
        onlyIn(
          "webkit",
          "focus on click: only macOS WebKit leaves focus where it was when a button is clicked",
          "darwin",
        );
        await openExample(page, info, ITEM, "buttons");
        const n = nav(page);
        await button(n, "Page 12").click();
        await button(n, "Page 11").click();
        await page.evaluate(() =>
          (document.activeElement as HTMLElement | null)?.blur(),
        );
        await button(n, "Next page").click();
        await expect(button(n, "Page 12")).toHaveAttribute(
          "aria-current",
          "page",
        );
        expect(await focusedText(page)).toBe("body");
      },
    );

    test(
      "19. button mode says the page",
      tag("live"),
      async ({ page, request }, info) => {
        const html = await (
          await request.get(`/example/${ITEM}/buttons/`)
        ).text();
        const statuses = [
          ...html.matchAll(
            /<div[^>]*data-slot="pagination-status"[^>]*>([\s\S]*?)<\/div>/g,
          ),
        ];
        expect(statuses).toHaveLength(1);
        expect(statuses[0]![0]).toContain('role="status"');
        expect(statuses[0]![1]!.replace(/<!--[\s\S]*?-->/g, "").trim()).toBe(
          "",
        );
        await openExample(page, info, ITEM, "buttons");
        const status = page.locator('[data-slot="pagination-status"]');
        await expect(status).toHaveText("");
        await button(nav(page), "Next page").click();
        await frames(page, 2);
        expect((await status.textContent())?.trim()).toBe("Page 6 of 12");
        await openExample(page, info, ITEM, "links");
        await expect(
          page.locator('[data-slot="pagination-status"]'),
        ).toHaveCount(0);
      },
    );

    test(
      "20. narrow shows the summary",
      tag("layout"),
      async ({ page }, info) => {
        await openExample(page, info, ITEM, "buttons");
        const n = nav(page);
        const list = n.locator('[data-slot="pagination-list"]');
        const summary = n.locator('[data-slot="pagination-summary"]');
        await n.evaluate((el) => ((el as HTMLElement).style.width = "640px"));
        expect(await list.evaluate((el) => getComputedStyle(el).display)).toBe(
          "none",
        );
        await expect(summary).toBeVisible();
        await expect(summary).toHaveText("Page 5 of 12");
        await expect(button(n, "Previous page")).toBeVisible();
        await expect(button(n, "Next page")).toBeVisible();
        await n.evaluate((el) => ((el as HTMLElement).style.width = "700px"));
        await expect(list).toBeVisible();
        expect(
          await summary.evaluate((el) => getComputedStyle(el).display),
        ).toBe("none");
        await expect(button(n, "Previous page")).toBeVisible();
        await expect(button(n, "Next page")).toBeVisible();
      },
    );

    test(
      "20a. no overflow at any width",
      tag("layout"),
      async ({ page }, info) => {
        await openHooks(page, info, "ends");
        const bad = await page.evaluate(() => {
          const out: string[] = [];
          for (const el of document.querySelectorAll<HTMLElement>(
            '[data-testid^="pagination-sweep-"]',
          )) {
            const nav = el.querySelector<HTMLElement>(
              '[data-slot="pagination"]',
            )!;
            const list = nav.querySelector<HTMLElement>(
              '[data-slot="pagination-list"]',
            )!;
            for (let w = 320; w <= 1440; w += 16) {
              nav.style.width = `${w}px`;
              if (nav.scrollWidth > nav.clientWidth)
                out.push(
                  `${el.dataset.testid} nav at ${w}: ${nav.scrollWidth} > ${nav.clientWidth}`,
                );
              if (list.scrollWidth > list.clientWidth)
                out.push(
                  `${el.dataset.testid} list at ${w}: ${list.scrollWidth} > ${list.clientWidth}`,
                );
            }
          }
          return out;
        });
        expect(
          await page.locator('[data-testid^="pagination-sweep-"]').count(),
        ).toBe(18);
        expect(bad).toEqual([]);
      },
    );

    test(
      "21. one page renders nothing",
      tag("structure"),
      async ({ page }, info) => {
        await openExample(page, info, ITEM, "ends");
        const one = page.getByTestId("pagination-one-page");
        await expect(one).toHaveCount(1);
        await expect(one.locator("nav")).toHaveCount(0);
        expect(
          (await one.innerHTML()).replace(/<!--[\s\S]*?-->/g, "").trim(),
        ).toBe("");
      },
    );

    test("22. Tab only", tag("keyboard"), async ({ page }, info) => {
      await openExample(page, info, ITEM, "links");
      const five = link(nav(page), "Page 5");
      await five.focus();
      for (const key of ["ArrowRight", "ArrowLeft", "Home", "End"]) {
        await page.keyboard.press(key);
        await expect(five, key).toBeFocused();
      }
    });

    test(
      "23. the current page is a shape, and it reaches 3:1",
      tag("contrast"),
      async ({ page }, info) => {
        await openExample(page, info, ITEM, "links");
        await settled(page);
        const n = nav(page);
        const current = link(n, "Page 5");
        const style = (l: Locator) =>
          l.evaluate((el) => {
            const s = getComputedStyle(el);
            return {
              width: parseFloat(s.borderTopWidth),
              weight: Number(s.fontWeight),
              colour: s.borderTopColor,
            };
          });
        const c = await style(current);
        expect(c.width).toBeGreaterThanOrEqual(1);
        expect(c.weight).toBeGreaterThanOrEqual(600);
        const cc = await coloursOf(current);
        expect(
          contrastRatio(cc.border, cc.ground),
          `border ${cc.border} on ${cc.ground}`,
        ).toBeGreaterThanOrEqual(3);
        expect(contrastRatio(cc.text, cc.background)).toBeGreaterThanOrEqual(
          4.5,
        );
        for (const p of [1, 4, 6, 12]) {
          const other = link(n, `Page ${p}`);
          const o = await style(other);
          expect(transparent(o.colour), `Page ${p}'s border ${o.colour}`).toBe(
            true,
          );
          expect([400, 500]).toContain(o.weight);
          const oc = await coloursOf(other);
          expect(
            contrastRatio(oc.text, oc.background),
            `Page ${p}`,
          ).toBeGreaterThanOrEqual(4.5);
        }
        for (const name of ["Previous page", "Next page"]) {
          const oc = await coloursOf(link(n, name));
          expect(
            contrastRatio(oc.text, oc.background),
            name,
          ).toBeGreaterThanOrEqual(4.5);
        }
      },
    );

    test(
      "24. forced colours keep the current page",
      tag("forced-colors"),
      async ({ page }, info) => {
        notIn(
          "webkit",
          "forced colours: Playwright's WebKit does not emulate forcedColors",
        );
        await page.emulateMedia({ forcedColors: "active" });
        await openExample(page, info, ITEM, "links");
        const current = link(nav(page), "Page 5");
        const s = await current.evaluate((el) => {
          const c = getComputedStyle(el);
          return {
            width: parseFloat(c.borderTopWidth),
            style: c.borderTopStyle,
            colour: c.borderTopColor,
            weight: Number(c.fontWeight),
          };
        });
        expect(s.weight).toBeGreaterThanOrEqual(600);
        expect(s.width).toBeGreaterThanOrEqual(1);
        expect(s.style).toBe("solid");
        expect(transparent(s.colour), s.colour).toBe(false);

        // The review's finding 3: under forced colours every page draws a
        // border, so the current page needs a mark the others lack, not a
        // weight alone and not Highlight alone (028's note).
        const mark = (l: Locator) =>
          l.evaluate((el) => {
            const c = getComputedStyle(el);
            return {
              underline: c.textDecorationLine.includes("underline"),
              border: parseFloat(c.borderTopWidth),
            };
          });
        const here = await mark(current);
        const other = await mark(link(nav(page), "Page 4"));
        expect(
          here.underline !== other.underline || here.border !== other.border,
          `current ${JSON.stringify(here)}, Page 4 ${JSON.stringify(other)}`,
        ).toBe(true);
        expect(here.underline).toBe(true);
        expect(other.underline).toBe(false);
      },
    );
  },
);
