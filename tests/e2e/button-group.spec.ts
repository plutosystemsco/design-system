/**
 * 027a: the button group, tests 32 to 36, on its example views in the
 * project's scheme.
 */
import { expect, test, type Locator, type Page } from "@playwright/test";
import { near, openExample, pixelAt, token } from "./batch-a.ts";

const ITEM = "button-group";

const group = (page: Page) =>
  page.locator('[data-slot="button-group"]').first();
const children = (g: Locator) => g.locator(":scope > *");

test.describe(
  "027a: the button group",
  { annotation: { type: "item", description: ITEM } },
  () => {
    test.use({ viewport: { width: 1440, height: 900 } });

    test(
      "32. a named group, a stop per button",
      { annotation: { type: "check", description: "keyboard" } },
      async ({ page }, info) => {
        await openExample(page, info, ITEM, "attached");
        await expect(
          page.getByRole("group", { name: "Clipboard" }),
        ).toHaveCount(1);
        const buttons = page
          .getByRole("group", { name: "Clipboard" })
          .getByRole("button");
        await expect(buttons).toHaveCount(3);
        for (let i = 0; i < 3; i++) {
          await page.keyboard.press("Tab");
          await expect(buttons.nth(i)).toBeFocused();
        }
        await buttons.first().focus();
        await page.keyboard.press("ArrowRight");
        await expect(buttons.first()).toBeFocused();
      },
    );

    for (const [id, vertical] of [
      ["attached", false],
      ["with-menu", false],
      ["vertical", true],
    ] as const)
      test(
        `33. attached shares one edge: ${id}`,
        { annotation: { type: "check", description: "layout" } },
        async ({ page }, info) => {
          await openExample(page, info, ITEM, id);
          const g = group(page);
          await expect(g).toHaveAttribute("data-variant", "attached");
          await expect(g).toHaveAttribute(
            "data-orientation",
            vertical ? "vertical" : "horizontal",
          );
          const kids = await children(g).evaluateAll(
            (els, v) =>
              els.map((el) => {
                const s = getComputedStyle(el);
                const r = el.getBoundingClientRect();
                return {
                  start: v ? r.top : r.left,
                  end: v ? r.bottom : r.right,
                  startBorder: parseFloat(
                    v ? s.borderTopWidth : s.borderInlineStartWidth,
                  ),
                  // Corners as [start-start, start-end, end-start, end-end]
                  // along the run: for a row, top-left, bottom-left, top-right,
                  // bottom-right; for a column, top-left, top-right,
                  // bottom-left, bottom-right.
                  corners: (v
                    ? [
                        s.borderTopLeftRadius,
                        s.borderTopRightRadius,
                        s.borderBottomLeftRadius,
                        s.borderBottomRightRadius,
                      ]
                    : [
                        s.borderTopLeftRadius,
                        s.borderBottomLeftRadius,
                        s.borderTopRightRadius,
                        s.borderBottomRightRadius,
                      ]
                  ).map((c) => parseFloat(c)),
                  slot: el.getAttribute("data-slot"),
                };
              }),
            vertical,
          );
          expect(kids.length).toBeGreaterThanOrEqual(3);
          if (id === "with-menu")
            expect(kids.at(-1)!.slot).toBe("dropdown-menu-trigger");
          kids.forEach((k, i) => {
            const first = i === 0;
            const last = i === kids.length - 1;
            if (!first) {
              expect(k.startBorder, `child ${i} start border`).toBe(0);
              expect(
                Math.abs(k.start - kids[i - 1].end),
                `child ${i} meets child ${i - 1}`,
              ).toBeLessThanOrEqual(0.5);
            }
            const [ss, se, es, ee] = k.corners;
            if (first) {
              expect(ss).toBeGreaterThan(0);
              expect(se).toBeGreaterThan(0);
            } else {
              expect(ss).toBe(0);
              expect(se).toBe(0);
            }
            if (last) {
              expect(es).toBeGreaterThan(0);
              expect(ee).toBeGreaterThan(0);
            } else {
              expect(es).toBe(0);
              expect(ee).toBe(0);
            }
          });
        },
      );

    test(
      "34. the focused button's ring is never covered",
      { annotation: { type: "check", description: "focus" } },
      async ({ page }, info) => {
        await openExample(page, info, ITEM, "attached");
        const ring = await token(page, "--ring");
        const kids = children(group(page));
        const n = await kids.count();
        for (let i = 0; i < n; i++) {
          await page.keyboard.press("Tab");
          await expect(kids.nth(i)).toBeFocused();
          const s = await kids
            .nth(i)
            .evaluate((el) => [
              getComputedStyle(el).zIndex,
              getComputedStyle(el).position,
            ]);
          expect(s).toEqual(["10", "relative"]);
          // The ring is a 2 px outline 2 px outside the border: 3 px out
          // from the end edge, at its middle, is the ring, over the next
          // button where there is one.
          const box = (await kids.nth(i).boundingBox())!;
          const at = await pixelAt(
            page,
            box.x + box.width + 3,
            box.y + box.height / 2,
          );
          expect(near(at, ring), `child ${i}: ${at} vs ${ring}`).toBe(true);
        }
      },
    );

    test(
      "35. spaced wraps, then stacks",
      { annotation: { type: "check", description: "layout" } },
      async ({ page }, info) => {
        await openExample(page, info, ITEM, "spaced");
        const g = group(page);
        await expect(g).toHaveAttribute("data-variant", "spaced");
        const kids = children(g);
        const a = (await kids.nth(0).boundingBox())!;
        const b = (await kids.nth(1).boundingBox())!;
        expect(b.x - (a.x + a.width)).toBeGreaterThanOrEqual(8);
        await page.setViewportSize({ width: 390, height: 844 });
        await expect(g).toHaveCSS("flex-direction", "column");
        const width = (await g.boundingBox())!.width;
        for (const k of await kids.all())
          expect(
            Math.abs((await k.boundingBox())!.width - width),
          ).toBeLessThanOrEqual(0.5);
      },
    );

    test(
      "36. with a menu",
      { annotation: { type: "check", description: "keyboard" } },
      async ({ page }, info) => {
        await openExample(page, info, ITEM, "with-menu");
        const g = group(page);
        const last = children(g).last();
        await expect(last).toHaveAttribute(
          "data-slot",
          "dropdown-menu-trigger",
        );
        await expect(last).toHaveAccessibleName("More");
        await last.focus();
        await page.keyboard.press("Enter");
        await expect(page.getByRole("menu")).toBeVisible();
        await page.keyboard.press("Escape");
        await expect(page.getByRole("menu")).toHaveCount(0);
        await expect(last).toBeFocused();
      },
    );
  },
);
