/**
 * 027b: the search field, tests 25 to 31 with 26a, 27a and 29a, on its
 * example views in the project's scheme. Time is driven by Playwright's
 * clock where a test counts it; the status's writes are logged by a
 * MutationObserver. `in-a-field` holds a hidden fixture with an app's own
 * handlers, driven by synthetic events.
 */
import type { Page } from "@playwright/test";
import { expect, test } from "../test.ts";
import { notIn } from "./engines.ts";
import { logWrites, openExample, writes } from "./batch-a.ts";

const ITEM = "search-field";
const T0 = new Date("2026-11-16T10:00:00Z");
const tag = (check: string) => ({
  annotation: { type: "check", description: check },
});
const status = (page: Page) =>
  page.locator('[data-slot="search-field-status"]').first();
const clear = (page: Page) =>
  page.getByRole("button", { name: "Clear search", exact: true });

/** Opens an example on a paused clock: time moves only when a test runs it. */
async function clocked(
  page: Page,
  info: Parameters<typeof openExample>[1],
  id: string,
) {
  await page.clock.install({ time: T0 });
  await logWrites(page, '[data-slot="search-field-status"]');
  await openExample(page, info, ITEM, id);
  await page.clock.pauseAt(new Date(T0.getTime() + 60_000));
}
const run = (page: Page, ms: number) => page.clock.runFor(ms);
const said = async (page: Page) => (await writes(page)).map((w) => w.text);
/** The counts written, without the empty writes that only clear (022r). */
const counts = async (page: Page) => (await said(page)).filter((t) => t);

test.describe(
  "027b: the search field",
  { annotation: { type: "item", description: ITEM } },
  () => {
    test.use({ viewport: { width: 1440, height: 900 } });

    test(
      "25. a named searchbox with a hidden icon",
      tag("structure"),
      async ({ page }, info) => {
        for (const [id, name] of [
          ["filter", "Search projects"],
          ["site", "Search the site"],
          ["in-a-field", "Search the docs"],
        ] as const) {
          await openExample(page, info, ITEM, id);
          await expect(page.getByRole("searchbox"), id).toHaveCount(1);
          await expect(
            page.getByRole("searchbox", { name, exact: true }),
            id,
          ).toHaveCount(1);
          await expect(page.getByRole("searchbox")).toHaveAttribute(
            "type",
            "search",
          );
          const icon = page
            .locator('main [data-slot="search-field-icon"]')
            .first();
          await expect(icon).toHaveAttribute("aria-hidden", "true");
        }
        const description = page
          .locator('main [data-slot="field-description"]')
          .first();
        const descId = await description.getAttribute("id");
        expect(descId).toBeTruthy();
        expect(
          (
            (await page
              .getByRole("searchbox")
              .getAttribute("aria-describedby")) ?? ""
          ).split(/\s+/),
        ).toContain(descId);
      },
    );

    test(
      "26. Clear shows with text, is a stop, and returns focus",
      tag("focus"),
      async ({ page }, info) => {
        await openExample(page, info, ITEM, "filter");
        const box = page.getByRole("searchbox", { name: "Search projects" });
        const results = page.getByTestId("search-results").locator("li");
        const all = await results.count();
        expect(all).toBeGreaterThan(3);
        await expect(clear(page)).toHaveCount(0);
        await box.click();
        await page.keyboard.type("des");
        await expect(clear(page)).toHaveCount(1);
        await expect(clear(page)).toHaveAttribute(
          "aria-controls",
          (await box.getAttribute("id"))!,
        );
        await expect(results).toHaveCount(3);
        await page.keyboard.press("Tab");
        await expect(clear(page)).toBeFocused();
        await page.keyboard.press("Enter");
        await expect(box).toHaveValue("");
        await expect(results).toHaveCount(all);
        await expect(box).toBeFocused();
        await expect(clear(page)).toHaveCount(0);

        // The app's side, on the hidden fixture: when the input event fires,
        // the DOM value and the bound value are both "", and onclear runs once.
        await openExample(page, info, ITEM, "in-a-field");
        const log = await page
          .getByTestId("search-hooks")
          .evaluate(async (root) => {
            const input = root.querySelector<HTMLInputElement>(
              'input[aria-label="Hooks"]',
            )!;
            input.value = "des";
            input.dispatchEvent(new Event("input", { bubbles: true }));
            await new Promise((r) => setTimeout(r, 50));
            const button = root.querySelector<HTMLButtonElement>(
              '[data-slot="search-field-clear"]',
            )!;
            button.click();
            await new Promise((r) => setTimeout(r, 50));
            return root.querySelector('[data-testid="search-hooks-log"]')!
              .textContent;
          });
        expect(log).toBe("input des|des;input |;clear");
      },
    );

    test(
      "26a. disabled and read-only fields have no Clear and pass Escape on",
      tag("keyboard"),
      async ({ page }, info) => {
        await openExample(page, info, ITEM, "disabled");
        const disabled = page.getByRole("searchbox", {
          name: "Search the archive",
        });
        const readonly = page.getByRole("searchbox", {
          name: "Search your history",
        });
        await expect(disabled).toHaveValue("design");
        await expect(disabled).toBeDisabled();
        await expect(readonly).toHaveValue("design");
        await expect(readonly).toHaveAttribute("readonly", "");
        await expect(clear(page)).toHaveCount(0);
        await page.evaluate(() => {
          (window as unknown as { __seen: string[] }).__seen = [];
          document.addEventListener("keydown", (e) =>
            (window as unknown as { __seen: string[] }).__seen.push(e.key),
          );
        });
        await readonly.focus();
        await page.keyboard.press("Escape");
        await expect(readonly).toHaveValue("design");
        expect(
          await page.evaluate(
            () => (window as unknown as { __seen: string[] }).__seen,
          ),
        ).toContain("Escape");
      },
    );

    test(
      "27. Escape clears a filled field and stops",
      tag("keyboard"),
      async ({ page }, info) => {
        await openExample(page, info, ITEM, "in-a-dialog");
        const trigger = page.getByRole("button", { name: "Add members" });
        // By keyboard: WebKit focuses no button on a click, so the dialog
        // would have no trigger to return focus to.
        await trigger.focus();
        await page.keyboard.press("Enter");
        const dialog = page.getByRole("dialog");
        await expect(dialog).toBeVisible();
        const box = dialog.getByRole("searchbox", { name: "Search members" });
        await box.click();
        await page.keyboard.type("des");
        await page.keyboard.press("Escape");
        await expect(box).toHaveValue("");
        await expect(box).toBeFocused();
        await expect(dialog).toBeVisible();
        await page.keyboard.press("Escape");
        await expect(dialog).toHaveCount(0);
        await expect(trigger).toBeFocused();
      },
    );

    test(
      "27a. Escape during composition, and the app's handlers",
      tag("keyboard"),
      async ({ page }, info) => {
        await openExample(page, info, ITEM, "in-a-field");
        const facts = await page
          .getByTestId("search-hooks")
          .evaluate(async (root) => {
            const tick = () => new Promise((r) => setTimeout(r, 50));
            const input = root.querySelector<HTMLInputElement>(
              'input[aria-label="Hooks"]',
            )!;
            const prevented = root.querySelector<HTMLInputElement>(
              'input[aria-label="Prevented"]',
            )!;
            const log = () =>
              root.querySelector('[data-testid="search-hooks-log"]')!
                .textContent;
            const seen: string[] = [];
            document.addEventListener("keydown", (e) =>
              seen.push(
                `${e.key}${e.isComposing ? " composing" : ""}${e.keyCode === 229 ? " 229" : ""}`,
              ),
            );
            input.value = "design";
            input.dispatchEvent(new Event("input", { bubbles: true }));
            await tick();
            const escape = (
              target: HTMLInputElement,
              init: KeyboardEventInit,
              code?: number,
            ) => {
              const e = new KeyboardEvent("keydown", {
                key: "Escape",
                bubbles: true,
                cancelable: true,
                ...init,
              });
              if (code !== undefined)
                Object.defineProperty(e, "keyCode", { get: () => code });
              target.dispatchEvent(e);
              return e.defaultPrevented;
            };
            const composing = escape(input, { isComposing: true });
            await tick();
            const afterComposing = input.value;
            const ime = escape(input, { isComposing: false }, 229);
            await tick();
            const afterIme = input.value;
            const logBefore = log();
            const plain = escape(input, {});
            await tick();
            const afterPlain = input.value;
            const logAfter = log();
            prevented.dispatchEvent(
              new KeyboardEvent("keydown", {
                key: "Escape",
                bubbles: true,
                cancelable: true,
              }),
            );
            await tick();
            return {
              composing,
              afterComposing,
              ime,
              afterIme,
              plain,
              afterPlain,
              logBefore,
              logAfter,
              seen,
              preventedValue: prevented.value,
            };
          });
        expect(facts.composing).toBe(false);
        expect(facts.afterComposing).toBe("design");
        expect(facts.ime).toBe(false);
        expect(facts.afterIme).toBe("design");
        // Both reached the document: not stopped.
        expect(facts.seen.slice(0, 2)).toEqual([
          "Escape composing",
          "Escape 229",
        ]);
        // Once per event: one input, then three keydowns, each logged once.
        expect(facts.logBefore).toBe("input design|design;keydown;keydown");
        expect(facts.plain).toBe(true);
        expect(facts.afterPlain).toBe("");
        expect(facts.logAfter).toBe(
          "input design|design;keydown;keydown;keydown;input |;clear",
        );
        // A plain Escape on a filled field stops: the document never saw it.
        expect(facts.seen).toHaveLength(3);
        expect(facts.preventedValue).toBe("design");
      },
    );

    test(
      "28. WebKit's cancel button is hidden",
      tag("structure"),
      async ({ page }, info) => {
        notIn(
          "firefox",
          "::-webkit-search-cancel-button: Firefox draws no cancel button on a search input",
        );
        await openExample(page, info, ITEM, "filter");
        const box = page.getByRole("searchbox", { name: "Search projects" });
        await box.click();
        await page.keyboard.type("des");
        const end = async () => {
          const r = (await box.boundingBox())!;
          return page.screenshot({
            clip: {
              x: r.x + r.width - 40,
              y: r.y,
              width: 40,
              height: r.height,
            },
          });
        };
        const item = await end();
        await box.evaluate((el) => {
          for (const c of Array.from(el.classList))
            if (c.includes("::-webkit-search")) el.classList.remove(c);
        });
        const bare = await end();
        expect(bare.equals(item), "the bare input's cancel button shows").toBe(
          false,
        );
        // 022n: the reference hides the button with display: none. Linux
        // WebKit's Adwaita sheet draws the glyph as a mask under
        // appearance: none, so an appearance rule would hide nothing there.
        await page.addStyleTag({
          content:
            'input[type="search"]::-webkit-search-cancel-button { display: none; } input[type="search"]::-webkit-search-decoration { -webkit-appearance: none; appearance: none; }',
        });
        const styled = await end();
        expect(
          styled.equals(item),
          "the class draws what display: none draws",
        ).toBe(true);
      },
    );

    test(
      "29. the count waits for the pause, and is written again",
      tag("live"),
      async ({ page }, info) => {
        await clocked(page, info, "filter");
        const box = page.getByRole("searchbox", { name: "Search projects" });
        await box.focus();
        await page.keyboard.type("des");
        await run(page, 749);
        await expect(status(page)).toHaveText("");
        await run(page, 1);
        await run(page, 17);
        await expect(status(page)).toHaveText("3 results");
        const first = (await said(page)).length;
        await page.keyboard.type("i");
        await run(page, 750);
        await run(page, 17);
        await expect(status(page)).toHaveText("3 results");
        expect((await said(page)).slice(first)).toEqual(["", "3 results"]);
        // 022r: a keystroke empties the status, and that empty write says
        // nothing. What must not be written is a count.
        const before = (await counts(page)).length;
        await clear(page).click();
        await run(page, 2000);
        expect((await counts(page)).slice(before)).toEqual([]);
        // 022w: Clear empties the status too, so no count for a query that
        // is gone stays in it.
        await expect(status(page)).toHaveText("");

        // The review's finding 5: Escape within the pause cancels the
        // pending count, so nothing is written.
        await box.focus();
        await page.keyboard.type("x");
        await run(page, 200);
        await page.keyboard.press("Escape");
        await expect(box).toHaveValue("");
        await run(page, 2000);
        expect((await counts(page)).slice(before)).toEqual([]);

        // 022w: Escape after a count empties the status, as Clear does.
        await page.keyboard.type("des");
        await run(page, 750);
        await run(page, 17);
        await expect(status(page)).toHaveText("3 results");
        await page.keyboard.press("Escape");
        await expect(box).toHaveValue("");
        await run(page, 2000);
        await expect(status(page)).toHaveText("");
      },
    );

    test(
      "29b. every count follows an empty status that lasts the pause, and stays until the next keystroke (022r, 022w)",
      tag("live"),
      async ({ page }, info) => {
        await clocked(page, info, "filter");
        const box = page.getByRole("searchbox", { name: "Search projects" });
        await box.focus();
        await page.keyboard.type("des");
        await run(page, 750);
        await run(page, 17);
        await expect(status(page)).toHaveText("3 results");
        // 022w: left alone, the count stays. No timer empties it, so a
        // reader that comes to it late still finds it.
        const settled = (await writes(page)).length;
        await run(page, 5000);
        await expect(status(page)).toHaveText("3 results");
        expect(
          (await writes(page)).slice(settled),
          "nothing is written while no key is pressed",
        ).toEqual([]);
        // The next letter empties the status at once. Its count is the
        // same, so only the empty status between the two makes the second
        // a change a reader hears.
        await page.keyboard.type("i");
        await expect(status(page)).toHaveText("");
        await run(page, 750);
        await run(page, 17);
        await expect(status(page)).toHaveText("3 results");
        // And again at once, before the count has been there a second:
        // "designe" is in one project's name.
        await page.keyboard.type("gn");
        await run(page, 200);
        await page.keyboard.type("e");
        await run(page, 750);
        await run(page, 17);
        await expect(status(page)).toHaveText("1 result");
        await run(page, 5000);
        await expect(status(page)).toHaveText("1 result");
        const log = await writes(page);
        expect(
          log.map((w) => w.text),
          "each count is written once, after an empty status",
        ).toEqual(["", "3 results", "", "3 results", "", "1 result"]);
        // The first count's empty write is the page's own, from hydration,
        // so its gap holds trivially; the other two are the keystrokes'.
        for (const [i, w] of log.entries()) {
          if (!w.text) continue;
          const empty = log[i - 1]!;
          expect(empty.text, `the status is emptied before "${w.text}"`).toBe(
            "",
          );
          expect(
            w.t - empty.t,
            `the status stays empty for the whole pause before "${w.text}"`,
          ).toBeGreaterThanOrEqual(750);
        }
      },
    );

    test(
      "29a. a late count is spoken once, at its arrival",
      tag("live"),
      async ({ page }, info) => {
        await clocked(page, info, "from-a-server");
        const box = page.getByRole("searchbox", { name: "Search projects" });
        await box.focus();
        await page.keyboard.type("de");
        await run(page, 1200);
        await expect(status(page)).toHaveText("12 results");
        const mark = (await said(page)).length;
        await page.keyboard.type("s");
        await run(page, 750);
        await run(page, 17);
        // At the pause the count is on its way: no count is written. The
        // keystroke emptied the status (022r), which says nothing.
        expect((await said(page)).slice(mark).filter((t) => t)).toEqual([]);
        await run(page, 400);
        await run(page, 34);
        await expect(status(page)).toHaveText("3 results");
        expect((await said(page)).slice(mark)).not.toContain("12 results");
        expect(
          (await said(page)).slice(mark).filter((t) => t === "3 results"),
        ).toHaveLength(1);
      },
    );

    test(
      "29a. a stale count is never spoken: the answer to an older query comes late",
      tag("live"),
      async ({ page }, info) => {
        await clocked(page, info, "from-a-server");
        const box2 = page.getByRole("searchbox", { name: "Search projects" });
        await box2.focus();
        await page.keyboard.type("de");
        await run(page, 900);
        await page.keyboard.type("s");
        await run(page, 300);
        await run(page, 17);
        expect(await said(page)).not.toContain("12 results");
        await run(page, 1200);
        await expect(status(page)).toHaveText("3 results");
        expect(await said(page)).not.toContain("12 results");
      },
    );

    test(
      "30. the status is in the server HTML, empty",
      tag("live"),
      async ({ request }) => {
        const html = await (
          await request.get(`/example/${ITEM}/filter/`)
        ).text();
        const found = [
          ...html.matchAll(
            /<div[^>]*data-slot="search-field-status"[^>]*>([\s\S]*?)<\/div>/g,
          ),
        ];
        expect(found).toHaveLength(1);
        expect(found[0]![0]).toContain('role="status"');
        expect(found[0]![1]!.replace(/<!--[\s\S]*?-->/g, "").trim()).toBe("");
      },
    );

    test(
      "31. one landmark in the site example",
      tag("structure"),
      async ({ page }, info) => {
        await openExample(page, info, ITEM, "site");
        const search = page.getByRole("search");
        await expect(search).toHaveCount(1);
        await expect(
          search.getByRole("searchbox", { name: "Search the site" }),
        ).toHaveCount(1);
        await expect(
          search.getByRole("button", { name: "Search", exact: true }),
        ).toHaveCount(1);
        await openExample(page, info, ITEM, "filter");
        await expect(page.getByRole("search")).toHaveCount(0);
      },
    );
  },
);
