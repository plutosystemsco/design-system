/**
 * 027a: the progress bar, tests 47 to 49, on its example views in the
 * project's scheme. Test 48 runs in every engine; its forced-colours half
 * runs where Playwright emulates forced colours, Chromium and Firefox.
 */
import { expect, test } from "@playwright/test";
import { contrastRatio } from "../../scripts/contrast.ts";
import { near, openExample, pixelOf, token } from "./batch-a.ts";

const ITEM = "progress";

test.describe(
  "027a: the progress bar",
  { annotation: { type: "item", description: ITEM } },
  () => {
    test.use({ viewport: { width: 1440, height: 900 } });

    test(
      "47. a named progressbar with its text, and no valuemax",
      {
        annotation: [
          { type: "check", description: "structure" },
          { type: "check", description: "contrast" },
        ],
      },
      async ({ page }, info) => {
        await openExample(page, info, ITEM, "upload");
        const bar = page.getByRole("progressbar", { name: "Upload" });
        await expect(bar).toHaveCount(1);
        await expect(bar).toHaveAttribute("data-slot", "progress");
        await expect(bar).toHaveAttribute("value", "3");
        await expect(bar).toHaveAttribute("max", "12");
        await expect(bar).toHaveAttribute("aria-valuetext", "3 of 12 files");
        expect(await bar.getAttribute("aria-valuemax")).toBeNull();
        expect(
          contrastRatio(
            await token(page, "--primary"),
            await token(page, "--muted"),
          ),
        ).toBeGreaterThanOrEqual(3);

        // A null value from untyped code renders as 0, never indeterminate.
        await openExample(page, info, ITEM, "states");
        const untyped = page
          .getByTestId("progress-untyped")
          .locator("progress");
        await expect(untyped).toHaveCount(1);
        await expect(untyped).toHaveAttribute("value", "0");
        expect(
          await untyped.evaluate((el) => el.matches(":indeterminate")),
        ).toBe(false);
      },
    );

    test(
      "48. the classes draw it in every engine",
      {
        annotation: [
          { type: "check", description: "structure" },
          { type: "check", description: "forced-colors" },
        ],
      },
      async ({ page, browserName }, info) => {
        await openExample(page, info, ITEM, "states");
        const bar = page.getByTestId("progress-40").locator("progress");
        const failed = page.getByTestId("progress-failed").locator("progress");
        expect((await bar.boundingBox())!.height).toBe(8);
        const primary = await token(page, "--primary");
        const muted = await token(page, "--muted");
        const destructive = await token(page, "--destructive");
        const at10 = await pixelOf(page, bar, 0.1);
        const at90 = await pixelOf(page, bar, 0.9);
        expect(near(at10, primary), `10%: ${at10} vs ${primary}`).toBe(true);
        expect(near(at90, muted), `90%: ${at90} vs ${muted}`).toBe(true);
        const bad = await pixelOf(page, failed, 0.1);
        expect(near(bad, destructive), `${bad} vs ${destructive}`).toBe(true);

        if (browserName === "webkit") {
          info.annotations.push({
            type: "not emulated",
            description: "Playwright does not emulate forced colours in WebKit",
          });
          return;
        }
        await page.emulateMedia({ forcedColors: "active" });
        // The bar keeps its own colours: the system does not repaint it.
        const f10 = await pixelOf(page, bar, 0.1);
        const f90 = await pixelOf(page, bar, 0.9);
        expect(near(f10, primary), `forced 10%: ${f10} vs ${primary}`).toBe(
          true,
        );
        expect(near(f90, muted), `forced 90%: ${f90} vs ${muted}`).toBe(true);
      },
    );

    test(
      "49. silent by design",
      { annotation: { type: "check", description: "live" } },
      async ({ page }, info) => {
        await page.clock.install();
        await openExample(page, info, ITEM, "upload");
        const bar = page.locator('[data-slot="progress"]');
        const live = await bar.evaluate((el) => {
          const found: string[] = [];
          for (let n: Element | null = el; n; n = n.parentElement) {
            const role = n.getAttribute("role");
            if (n.hasAttribute("aria-live"))
              found.push(`${n.tagName} aria-live`);
            if (
              role &&
              ["status", "alert", "log", "marquee", "timer"].includes(role)
            )
              found.push(`${n.tagName} role=${role}`);
          }
          if (el.querySelector("[aria-live], [role=status], [role=alert]"))
            found.push("a live descendant");
          return found;
        });
        expect(live).toEqual([]);
        const status = page.locator('[data-slot="status"]');
        await expect(status).toHaveText("");
        await page.getByRole("button", { name: "Upload 12 files" }).click();
        await expect(status).toHaveText("Uploading 12 files");
        await page.clock.runFor(12 * 400 + 100);
        await expect(bar).toHaveAttribute("value", "12");
        await expect(status).toHaveText("Upload complete");
      },
    );
  },
);
