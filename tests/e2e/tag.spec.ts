/**
 * 027b: the tag, tests 37 to 41, on its example views in the project's
 * scheme. Focus after a removal is checked by each of the five ways to
 * remove: Enter, Space, Delete, Backspace and a click.
 */
import type { Locator, Page } from "@playwright/test";
import { expect, test } from "../test.ts";
import { notIn } from "./engines.ts";
import { contrastRatio } from "../../scripts/contrast.ts";
import { coloursOf, openExample } from "./batch-a.ts";
import { settled } from "./pages.ts";

const ITEM = "tag";
const tag = (check: string) => ({
  annotation: { type: "check", description: check },
});
const remove = (scope: Page | Locator, label: string) =>
  scope.getByRole("button", { name: `Remove ${label}`, exact: true });

type Way = "Enter" | "Space" | "Delete" | "Backspace" | "click";
const WAYS: Way[] = ["Enter", "Space", "Delete", "Backspace", "click"];

async function removeBy(page: Page, control: Locator, way: Way) {
  if (way === "click") return control.click();
  await control.focus();
  await page.keyboard.press(way === "Space" ? " " : way);
}

test.describe(
  "027b: the tag",
  { annotation: { type: "item", description: ITEM } },
  () => {
    test.use({ viewport: { width: 1440, height: 900 } });

    test(
      "37. a named list of tags",
      tag("structure"),
      async ({ page }, info) => {
        await openExample(page, info, ITEM, "removable");
        const list = page.getByRole("list", { name: "Filters", exact: true });
        await expect(list).toHaveCount(1);
        await expect(list).toHaveAttribute("role", "list");
        await expect(list).toHaveAttribute("tabindex", "-1");
        const items = list.getByRole("listitem");
        await expect(items).toHaveCount(3);
        for (const [i, label] of ["Design", "Research", "Writing"].entries()) {
          const item = items.nth(i);
          await expect(item.getByRole("button")).toHaveCount(1);
          const b = remove(item, label);
          await expect(b).toHaveCount(1);
          const box = (await b.boundingBox())!;
          expect(box.width).toBeGreaterThanOrEqual(24);
          expect(box.height).toBeGreaterThanOrEqual(24);
        }
      },
    );

    for (const way of WAYS)
      test(
        `38. focus goes to the next control, then the previous, then the list, by ${way}`,
        tag("focus"),
        async ({ page }, info) => {
          await openExample(page, info, ITEM, "removable");
          const list = page.getByRole("list", { name: "Filters", exact: true });
          await removeBy(page, remove(page, "Design"), way);
          await expect(remove(page, "Design")).toHaveCount(0);
          await expect(remove(page, "Research")).toBeFocused();
          await removeBy(page, remove(page, "Writing"), way);
          await expect(remove(page, "Writing")).toHaveCount(0);
          await expect(remove(page, "Research")).toBeFocused();
          await removeBy(page, remove(page, "Research"), way);
          await expect(list.getByRole("listitem")).toHaveCount(0);
          await expect(list).toBeFocused();

          // The fallback: the add input takes focus when the last tag goes.
          await openExample(page, info, ITEM, "fallback");
          const labels = page.getByRole("list", {
            name: "Labels",
            exact: true,
          });
          await removeBy(page, remove(labels, "Bug"), way);
          await expect(remove(labels, "Docs")).toBeFocused();
          await removeBy(page, remove(labels, "Docs"), way);
          await expect(
            page.getByRole("textbox", { name: "Add a label" }),
          ).toBeFocused();

          // Mixed: static Owner: me between Design and Research.
          await openExample(page, info, ITEM, "mixed");
          const mixed = page.getByRole("list", {
            name: "Filters",
            exact: true,
          });
          await removeBy(page, remove(mixed, "Research"), way);
          await expect(remove(mixed, "Design")).toBeFocused();
          await removeBy(page, remove(mixed, "Design"), way);
          await expect(mixed).toBeFocused();
          await expect(mixed.getByRole("listitem")).toHaveCount(1);
        },
      );

    test(
      "39. tags reach 4.5:1 and their marks 3:1",
      tag("contrast"),
      async ({ page }, info) => {
        await openExample(page, info, ITEM, "removable");
        await settled(page);
        const t = page.locator('[data-slot="tag"]').first();
        const c = await coloursOf(t);
        const label = await coloursOf(t.locator('[data-slot="tag-label"]'));
        expect(
          contrastRatio(label.text, c.background),
          "label",
        ).toBeGreaterThanOrEqual(4.5);
        expect(
          contrastRatio(c.border, c.ground),
          `border ${c.border} on ${c.ground}`,
        ).toBeGreaterThanOrEqual(3);
        const icon = await coloursOf(t.locator('[data-slot="tag-remove"] svg'));
        expect(
          contrastRatio(icon.text, c.background),
          "remove icon",
        ).toBeGreaterThanOrEqual(3);

        await openExample(page, info, ITEM, "pressable");
        const first = page.getByRole("button", { name: "Archived" });
        await first.click();
        await expect(first).toHaveAttribute("aria-pressed", "true");
        await page.mouse.move(0, 0);
        await settled(page);
        const p = await coloursOf(first);
        expect(
          contrastRatio(p.text, p.background),
          "pressed text",
        ).toBeGreaterThanOrEqual(4.5);
        const check = await coloursOf(first.locator('[data-slot="tag-check"]'));
        expect(
          contrastRatio(check.text, p.background),
          "check",
        ).toBeGreaterThanOrEqual(3);
        const off = await coloursOf(
          page.getByRole("button", { name: "Starred" }),
        );
        expect(
          contrastRatio(off.text, off.background),
          "unpressed text",
        ).toBeGreaterThanOrEqual(4.5);
        expect(
          contrastRatio(off.border, off.ground),
          "unpressed border",
        ).toBeGreaterThanOrEqual(3);
      },
    );

    test(
      "40. a pressable tag is a toggle with a check",
      tag("keyboard"),
      async ({ page }, info) => {
        await openExample(page, info, ITEM, "pressable");
        const group = page.getByRole("list", { name: "Show" });
        const buttons = group.getByRole("button");
        await expect(buttons).toHaveCount(4);
        for (const b of await buttons.all())
          await expect(b).toHaveAttribute("aria-pressed", "false");
        const first = buttons.first();
        await first.focus();
        await page.keyboard.press(" ");
        await expect(first).toHaveAttribute("aria-pressed", "true");
        await expect(first.locator('svg[data-slot="tag-check"]')).toHaveCount(
          1,
        );
        await expect(first.locator('[data-slot="tag-check"]')).toHaveAttribute(
          "aria-hidden",
          "true",
        );
        await page.keyboard.press(" ");
        await expect(first).toHaveAttribute("aria-pressed", "false");
        await expect(first.locator('[data-slot="tag-check"]')).toHaveCount(0);

        // onpressedchange, on the hidden fixture: once per press, with the new state.
        const log = await page
          .getByTestId("tag-hooks")
          .evaluate(async (root) => {
            const b = root.querySelector<HTMLButtonElement>("button")!;
            b.click();
            await new Promise((r) => setTimeout(r, 50));
            const one = root.querySelector(
              '[data-testid="tag-hooks-log"]',
            )!.textContent;
            b.click();
            await new Promise((r) => setTimeout(r, 50));
            return [
              one,
              root.querySelector('[data-testid="tag-hooks-log"]')!.textContent,
            ];
          });
        expect(log).toEqual(["true", "true,false"]);
      },
    );

    test(
      "40. a pressable tag keeps its check under forced colours",
      tag("forced-colors"),
      async ({ page }, info) => {
        notIn(
          "webkit",
          "forced colours: Playwright's WebKit does not emulate forcedColors",
        );
        await page.emulateMedia({ forcedColors: "active" });
        await openExample(page, info, ITEM, "pressable");
        const first = page.getByRole("button", { name: "Archived" });
        await first.click();
        const check = first.locator('[data-slot="tag-check"]');
        await expect(check).toBeVisible();
        const box = (await check.boundingBox())!;
        expect(box.width).toBeGreaterThan(8);
        const [ink, ground] = await first.evaluate((el) => [
          getComputedStyle(el.querySelector('[data-slot="tag-check"]')!).color,
          getComputedStyle(el).backgroundColor,
        ]);
        expect(ink).not.toBe(ground);
      },
    );

    test(
      "41. a static tag has no button",
      tag("structure"),
      async ({ page }, info) => {
        for (const id of ["static", "mixed"]) {
          await openExample(page, info, ITEM, id);
          const statics = page.locator(
            'main [data-slot="tag"][data-kind="static"]',
          );
          expect(await statics.count(), id).toBeGreaterThan(0);
          for (const s of await statics.all()) {
            await expect(s.locator("button")).toHaveCount(0);
            await expect(s.locator("[data-tag-control]")).toHaveCount(0);
            expect(
              await s.evaluate((el) => el.matches("[data-tag-control]")),
            ).toBe(false);
            expect(
              await s.evaluate((el) => (el as HTMLElement).tabIndex),
            ).toBeLessThan(0);
          }
        }
        // Tab never stops on Owner: me.
        await openExample(page, info, ITEM, "mixed");
        const stops: string[] = [];
        for (let i = 0; i < 4; i++) {
          await page.keyboard.press("Tab");
          stops.push(
            await page.evaluate(
              () =>
                document.activeElement?.getAttribute("aria-label") ??
                document.activeElement?.tagName ??
                "",
            ),
          );
        }
        expect(stops.slice(0, 2)).toEqual(["Remove Design", "Remove Research"]);
      },
    );
  },
);
