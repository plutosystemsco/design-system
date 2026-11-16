/**
 * 027, tests 50 to 52, for each part's own items: nothing translucent, no
 * letter spacing, and axe on every example and pair. Also the page side of
 * test 5: each pair renders in its Usage list, each don't inside `inert`.
 * 027a's items are link, button-group and progress; 027b adds its three.
 */
import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";
import { expect, test } from "../test.ts";
import { open, componentPath, settled } from "./pages.ts";
import { openExample, PART_A, PART_B } from "./batch-a.ts";

const TAGS = [
  "wcag2a",
  "wcag2aa",
  "wcag21a",
  "wcag21aa",
  "wcag22aa",
  "best-practice",
];

/**
 * Slots of existing items whose own surfaces `031b` audits, as decision 13
 * leaves an existing item's inherited rules to it: the card's hairline edge
 * is one. An element with one of these slots is skipped; its descendants
 * are not. 031b removes this list when it makes `card`'s edge solid, so a
 * translucent edge that came back would fail here. 027b adds `table-row`,
 * whose row rule is the same hairline, under pagination's tables.
 */
const AUDITED_BY_031B = ["card", "table-row"];

/**
 * 027 decision 13: test 50 runs on the enabled examples. A disabled search
 * field keeps `input`'s own `disabled:opacity-50`, which `031b` audits;
 * test 26a checks that example's controls.
 */
const DISABLED_EXAMPLES = ["search-field/disabled"];

/** Every descendant of the view's main with a translucent fill or border, a backdrop filter or opacity below 1. */
function translucent(page: Page): Promise<string[]> {
  return page.evaluate((skip) => {
    /** A computed colour's alpha, in any syntax a browser computes. */
    const alpha = (c: string): number => {
      if (c === "transparent") return 0;
      const slash = /\/\s*([\d.]+)(%?)\s*\)$/.exec(c);
      if (slash) return Number(slash[1]) / (slash[2] ? 100 : 1);
      const rgba = /^rgba\([^,]+,[^,]+,[^,]+,\s*([\d.]+)\)$/.exec(c);
      if (rgba) return Number(rgba[1]);
      return 1;
    };
    const out: string[] = [];
    const main = document.querySelector("main")!;
    for (const el of Array.from(main.querySelectorAll("*"))) {
      if (skip.includes(el.getAttribute("data-slot") ?? "")) continue;
      const s = getComputedStyle(el);
      const name = `${el.tagName.toLowerCase()}[data-slot=${el.getAttribute("data-slot")}]`;
      for (const [prop, value] of [
        ["background-color", s.backgroundColor],
        ["border-top-color", s.borderTopColor],
        ["border-right-color", s.borderRightColor],
        ["border-bottom-color", s.borderBottomColor],
        ["border-left-color", s.borderLeftColor],
      ] as const) {
        const a = alpha(value);
        if (a > 0 && a < 1) out.push(`${name} ${prop} ${value}`);
      }
      const backdrop =
        s.backdropFilter ??
        (s as unknown as { webkitBackdropFilter?: string })
          .webkitBackdropFilter;
      if (backdrop && backdrop !== "none")
        out.push(`${name} backdrop-filter ${backdrop}`);
      if (Number(s.opacity) < 1) out.push(`${name} opacity ${s.opacity}`);
    }
    return out;
  }, AUDITED_BY_031B);
}

for (const { part, item, examples, pairs, axe } of [
  ...PART_A.map((p) => ({
    ...p,
    part: "027a",
    axe: {} as Record<string, string>,
  })),
  ...PART_B.map((p) => ({ ...p, part: "027b", axe: p.axe ?? {} })),
])
  test.describe(
    `${part}: ${item}, across its examples`,
    { annotation: { type: "item", description: item } },
    () => {
      test.use({ viewport: { width: 1440, height: 900 } });

      for (const id of examples.filter(
        (id) => !DISABLED_EXAMPLES.includes(`${item}/${id}`),
      ))
        test(
          `50. nothing in ${item}/${id} is translucent, at rest, hovered or focused`,
          { annotation: { type: "check", description: "depth" } },
          async ({ page }, info) => {
            await openExample(page, info, item, id);
            await settled(page);
            expect(await translucent(page), "at rest").toEqual([]);
            const controls = page.locator(
              "main a[href], main button, main input, main [tabindex='0']",
            );
            const n = await controls.count();
            for (let i = 0; i < n; i++) {
              const c = controls.nth(i);
              if (!(await c.isVisible())) continue;
              await c.hover();
              await settled(page);
              expect(await translucent(page), `hovering control ${i}`).toEqual(
                [],
              );
              await c.focus();
              await settled(page);
              expect(await translucent(page), `focusing control ${i}`).toEqual(
                [],
              );
            }
          },
        );

      for (const id of examples)
        test(
          `51. no letter spacing in ${item}/${id}`,
          { annotation: { type: "check", description: "type" } },
          async ({ page }, info) => {
            await openExample(page, info, item, id);
            const spaced = await page.evaluate(() =>
              Array.from(document.querySelectorAll("main *"))
                .filter((el) =>
                  Array.from(el.childNodes).some(
                    (n) =>
                      n.nodeType === Node.TEXT_NODE && n.textContent!.trim(),
                  ),
                )
                .map((el) => [el.tagName, getComputedStyle(el).letterSpacing])
                .filter(([, ls]) => ls !== "normal" && ls !== "0px"),
            );
            expect(spaced).toEqual([]);
          },
        );

      const views = [
        ...examples,
        ...pairs.flatMap((p) => [`do-${p}`, `dont-${p}`]),
      ];
      for (const width of [1440, 390])
        for (const id of views) {
          // A don't whose `meta.axe` names a rule reports exactly that rule;
          // every other view, and a don't broken in words, reports none.
          const breaks = id.startsWith("dont-")
            ? axe[id.slice("dont-".length)]
            : undefined;
          test(
            breaks
              ? `52. axe finds exactly ${breaks} on ${item}/${id} at ${width}`
              : `52. axe finds 0 violations on ${item}/${id} at ${width}`,
            { annotation: { type: "check", description: "axe" } },
            async ({ page }, info) => {
              await page.setViewportSize({ width, height: 900 });
              await openExample(page, info, item, id);
              await settled(page);
              const results = await new AxeBuilder({ page })
                .withTags(TAGS)
                .analyze();
              if (breaks)
                expect(results.violations.map((v) => v.id)).toEqual([breaks]);
              else
                expect(
                  results.violations.map(
                    (v) =>
                      `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`,
                  ),
                ).toEqual([]);
            },
          );
        }

      test(
        `5. ${item}'s page renders its ${pairs.length * 2} pair files in its Usage lists, each don't inside inert`,
        { annotation: { type: "check", description: "structure" } },
        async ({ page }) => {
          await open(page, componentPath(item));
          const usage = page.locator('section[aria-labelledby="usage"]');
          for (const pair of pairs)
            for (const kind of ["do", "dont"] as const) {
              const el = usage.locator(
                `[data-pair="${pair}"][data-pair-kind="${kind}"]`,
              );
              await expect(el, `${kind}-${pair}`).toHaveCount(1);
              expect(await el.evaluate((e) => !!e.closest("li"))).toBe(true);
              expect(
                await el.evaluate((e) => !!e.closest("[inert]")),
                `${kind}-${pair} inert`,
              ).toBe(kind === "dont");
            }
        },
      );
    },
  );
