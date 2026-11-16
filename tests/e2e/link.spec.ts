/**
 * 027a: the link, tests 42 to 46. Each runs on an example view in the
 * project's scheme (`?theme=` from the project's name), at 1440 × 900.
 */
import { expect, test } from "@playwright/test";
import { contrastRatio } from "../../scripts/contrast.ts";
import { openExample, rgbToHex, token } from "./batch-a.ts";

const ITEM = "link";

test.describe(
  "027a: the link",
  { annotation: { type: "item", description: ITEM } },
  () => {
    test.use({ viewport: { width: 1440, height: 900 } });

    test(
      "42. always underlined, thicker on hover",
      { annotation: { type: "check", description: "structure" } },
      async ({ page }, info) => {
        await openExample(page, info, ITEM, "inline");
        const link = page.locator('[data-slot="link"]').first();
        await expect(link).toHaveCount(1);
        const read = () =>
          link.evaluate((a) => {
            const s = getComputedStyle(a);
            return {
              line: s.textDecorationLine,
              thickness: s.textDecorationThickness,
            };
          });
        const rest = await read();
        expect(rest.line).toBe("underline");
        // At rest the line is the font's own thickness (`auto`); on hover
        // it is Tailwind's 2 px step.
        expect(["auto", "from-font"]).toContain(rest.thickness);
        await link.hover();
        const hover = await read();
        expect(hover.line).toBe("underline");
        expect(hover.thickness).toBe("2px");
      },
    );

    test(
      "43. the primary colour reaches 4.5:1, and inherit takes the text's",
      { annotation: { type: "check", description: "contrast" } },
      async ({ page }, info) => {
        await openExample(page, info, ITEM, "inline");
        const link = page.locator('[data-slot="link"]').first();
        const colour = rgbToHex(
          await link.evaluate((a) => getComputedStyle(a).color),
        );
        expect(colour).toBe(await token(page, "--primary"));
        for (const ground of ["--background", "--card"])
          expect(
            contrastRatio(colour, await token(page, ground)),
            ground,
          ).toBeGreaterThanOrEqual(4.5);

        await openExample(page, info, ITEM, "inherit");
        const links = page.locator('[data-slot="link"]');
        expect(await links.count()).toBeGreaterThanOrEqual(2);
        for (const a of await links.all()) {
          const [own, parent] = await a.evaluate((el) => [
            getComputedStyle(el).color,
            getComputedStyle(el.parentElement!).color,
          ]);
          expect(own).toBe(parent);
        }
      },
    );

    test(
      "44. standalone is 24 px tall",
      { annotation: { type: "check", description: "layout" } },
      async ({ page }, info) => {
        await openExample(page, info, ITEM, "standalone");
        const links = page.locator('[data-slot="link"]');
        expect(await links.count()).toBeGreaterThanOrEqual(3);
        for (const a of await links.all())
          expect((await a.boundingBox())!.height).toBeGreaterThanOrEqual(24);
      },
    );

    test(
      "45. a new tab is said and safe",
      { annotation: { type: "check", description: "structure" } },
      async ({ page }, info) => {
        await openExample(page, info, ITEM, "new-tab");
        const links = page.locator('[data-slot="link"]');
        await expect(links).toHaveCount(2);
        const rel = async (i: number) =>
          ((await links.nth(i).getAttribute("rel")) ?? "").split(/\s+/);
        for (let i = 0; i < 2; i++) {
          await expect(links.nth(i)).toHaveAttribute("target", "_blank");
          expect(await rel(i)).toContain("noopener");
          expect(await rel(i)).toContain("noreferrer");
          await expect(links.nth(i)).toHaveAccessibleName(
            /\(opens in a new tab\)$/,
          );
          const icon = links.nth(i).locator('[data-slot="link-icon"]');
          await expect(icon).toHaveCount(1);
          await expect(icon).toHaveAttribute("aria-hidden", "true");
        }
        // The second passes rel="external": all three, each once.
        expect((await rel(1)).sort()).toEqual(
          ["external", "noopener", "noreferrer"].sort(),
        );
      },
    );

    test(
      "46. visited is opt-in, by its rule",
      { annotation: { type: "check", description: "structure" } },
      async ({ page }, info) => {
        // A page cannot read a visited link's colour, so the compiled rule is
        // read instead: every style rule whose selector ends in :visited,
        // nested ones included.
        await openExample(page, info, ITEM, "visited");
        const rules = () =>
          page.evaluate(() => {
            const out: { selector: string; color: string }[] = [];
            const walk = (list: CSSRuleList, parent = "") => {
              for (const rule of Array.from(list)) {
                if (rule instanceof CSSStyleRule) {
                  const sel = rule.selectorText.includes("&")
                    ? rule.selectorText.replaceAll("&", parent)
                    : parent && !rule.selectorText.startsWith(":")
                      ? `${parent} ${rule.selectorText}`
                      : parent + rule.selectorText;
                  out.push({ selector: sel, color: rule.style.color });
                  if (rule.cssRules?.length) walk(rule.cssRules, sel);
                } else if ("cssRules" in rule)
                  walk((rule as CSSGroupingRule).cssRules, parent);
              }
            };
            for (const sheet of Array.from(document.styleSheets))
              try {
                walk(sheet.cssRules);
              } catch {
                // A cross-origin sheet has no readable rules.
              }
            return out.filter((r) => /:visited\s*$/.test(r.selector));
          });
        const visitedRules = await rules();
        const own = visitedRules.filter((r) =>
          r.selector.includes("visited\\:text-foreground"),
        );
        expect(own.length).toBeGreaterThanOrEqual(1);
        for (const r of own)
          expect(r.color).toMatch(/^var\(--(color-)?foreground\)$/);
        // Each visited example link carries the class.
        const links = page.locator('[data-slot="link"]');
        expect(await links.count()).toBeGreaterThanOrEqual(3);
        for (const a of await links.all())
          expect(await a.getAttribute("class")).toContain(
            "visited:text-foreground",
          );

        // A link without `visited` carries no class any :visited rule names.
        await openExample(page, info, ITEM, "inline");
        const classes = await page
          .locator('[data-slot="link"]')
          .first()
          .evaluate((a) => Array.from(a.classList));
        const all = await rules();
        const named = await page.evaluate(
          (cs) => cs.map((c) => CSS.escape(c)),
          classes,
        );
        for (const r of all)
          for (const c of named)
            expect(
              r.selector.includes(`.${c}:`) || r.selector.endsWith(`.${c}`),
              `${c} in ${r.selector}`,
            ).toBe(false);
      },
    );
  },
);
