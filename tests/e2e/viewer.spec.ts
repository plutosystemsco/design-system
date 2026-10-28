/**
 * 003 decision 20, browser file 7: the viewer on each block's item page, in
 * both projects.
 */
import { expect, test, type Page } from "@playwright/test";
import { BLOCK_VIEWS, viewPath } from "../../src/lib/preview/blocks.ts";
import { readFileSync } from "node:fs";
import { toAppFiles } from "../../src/lib/server/built-item.ts";
import { BLOCKS, open } from "./pages.ts";

/** Decision 5's titles. */
const TITLES: Record<string, string> = {
  hero: "Hero",
  "sign-in": "Sign in",
  "sign-up": "Sign up",
  "page-states": "Page states",
  settings: "Settings",
};

/** Where each block's files land in an app (decision 17), in the item's order. */
const APP_PATHS: Record<string, string[]> = {
  hero: [
    "src/routes/hero/+page.svelte",
    "src/lib/components/hero-section.svelte",
    "src/lib/components/hero-features.svelte",
  ],
  "sign-in": [
    "src/routes/sign-in/+page.svelte",
    "src/lib/components/sign-in-form.svelte",
  ],
  "sign-up": [
    "src/routes/sign-up/+page.svelte",
    "src/lib/components/sign-up-form.svelte",
    "src/lib/components/sign-up-verify.svelte",
  ],
  "page-states": [
    "src/routes/page-states/+page.svelte",
    "src/routes/page-states/+error.svelte",
    "src/lib/components/page-states-message.svelte",
    "src/lib/components/page-states-error.svelte",
    "src/lib/components/page-states-loading.svelte",
  ],
  settings: [
    "src/routes/settings/+page.svelte",
    "src/lib/components/settings-form.svelte",
    "src/lib/components/settings-delete.svelte",
  ],
};

const frame = (page: Page) => page.locator('[data-testid="viewer"] iframe');

async function openBlock(page: Page, block: string): Promise<void> {
  await open(page, `/items/${block}/`);
  await page
    .frameLocator('[data-testid="viewer"] iframe')
    .locator("main[data-view-ready]")
    .waitFor();
}

const widthButton = (page: Page, px: number) =>
  page
    .getByRole("group", { name: "Width" })
    .getByRole("button", { name: `${px} px` });

const frameIsDark = (page: Page) =>
  frame(page).evaluate(
    (f) =>
      (
        f as HTMLIFrameElement
      ).contentDocument?.documentElement.classList.contains("dark") ?? null,
  );

const parentIsDark = (page: Page) =>
  page.evaluate(() => document.documentElement.classList.contains("dark"));

test("the tables cover the 5 blocks: 16 files, 17 state switches", () => {
  expect(Object.keys(APP_PATHS)).toEqual(BLOCKS);
  expect(Object.values(APP_PATHS).flat()).toHaveLength(16);
  expect(
    BLOCKS.map((b) => BLOCK_VIEWS[b]!.length)
      .filter((n) => n > 1)
      .reduce((a, b) => a + b, 0),
  ).toBe(17);
});

for (const block of BLOCKS) {
  test.describe(block, () => {
    test("1. the frame is titled, shows the page file, and is 360 px wide with 360 pressed", async ({
      page,
    }) => {
      await openBlock(page, block);
      await expect(frame(page)).toHaveAttribute(
        "title",
        `${TITLES[block]} preview`,
      );
      await expect(frame(page)).toHaveAttribute("src", `/view/${block}/`);
      await expect(widthButton(page, 360)).toHaveAttribute(
        "aria-pressed",
        "true",
      );
      expect((await frame(page).boundingBox())?.width).toBe(360);
      // Each group is named by its visible mono label (the orchestrator's call
      // after the change review); a label is not a stop.
      const groups =
        BLOCK_VIEWS[block]!.length > 1 ? ["state", "width"] : ["width"];
      for (const name of groups) {
        const group = page.getByRole("group", { name, exact: true });
        await expect(group).toHaveCount(1);
        const label = page.locator(
          `[id="${await group.getAttribute("aria-labelledby")}"]`,
        );
        await expect(label).toBeVisible();
        await expect(label).toHaveText(name);
      }
    });

    test("2. 768 px and 1280 px move the pressed state and set the width", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await openBlock(page, block);
      for (const px of [768, 1280]) {
        await widthButton(page, px).click();
        await expect(widthButton(page, px)).toHaveAttribute(
          "aria-pressed",
          "true",
        );
        for (const other of [360, 768, 1280].filter((w) => w !== px))
          await expect(widthButton(page, other)).toHaveAttribute(
            "aria-pressed",
            "false",
          );
        await expect
          .poll(async () => (await frame(page).boundingBox())?.width)
          .toBe(px);
      }
    });

    const views = BLOCK_VIEWS[block]!;
    if (views.length > 1) {
      test(`3. ${views.length} state buttons set the frame's src and Open alone's href`, async ({
        page,
      }) => {
        await openBlock(page, block);
        const group = page.getByRole("group", { name: "State" });
        for (const view of [...views.slice(1), views[0]!]) {
          await group.getByRole("button", { name: view.label }).click();
          const path = viewPath(block, view.path);
          await expect(
            group.getByRole("button", { name: view.label }),
          ).toHaveAttribute("aria-pressed", "true");
          await expect(frame(page)).toHaveAttribute("src", path);
          await expect(page.getByTestId("open-alone")).toHaveAttribute(
            "href",
            path,
          );
        }
      });
    }

    test("4. the frame's <html> is dark exactly when the page's is: at load, after the toggle, and back", async ({
      page,
    }) => {
      // Inside the frame only, storage is blocked and the system preference
      // reads the other way, so the frame's own head script picks the other
      // theme. Only the viewer's copy can make the two agree.
      await page.addInitScript(() => {
        if (window === window.top) return;
        const query = "(prefers-color-scheme: dark)";
        const dark = !window.matchMedia(query).matches;
        const real = window.matchMedia.bind(window);
        window.matchMedia = (q: string) =>
          q === query
            ? ({ ...real(q), matches: dark, media: q } as MediaQueryList)
            : real(q);
        Object.defineProperty(window, "localStorage", {
          get() {
            throw new Error("storage blocked in the frame");
          },
        });
      });
      await openBlock(page, block);
      const states: boolean[] = [];
      await expect.poll(() => frameIsDark(page)).toBe(await parentIsDark(page));
      // The frame's own choice was the other theme: the copy did this.
      const own = await frame(page).evaluate(
        (f) =>
          (f as HTMLIFrameElement).contentWindow!.matchMedia(
            "(prefers-color-scheme: dark)",
          ).matches,
      );
      expect(own).toBe(!(await parentIsDark(page)));
      states.push(await parentIsDark(page));
      const toggle = page.getByRole("button", { name: "Dark theme" });
      for (let i = 0; i < 2; i++) {
        await toggle.click();
        const dark = await parentIsDark(page);
        states.push(dark);
        await expect.poll(() => frameIsDark(page)).toBe(dark);
      }
      expect(states).toHaveLength(3);
      expect(states[1]).toBe(!states[0]);
      expect(states[2]).toBe(states[0]);
    });

    test(`5. the code view has ${APP_PATHS[block]!.length} files at their app paths, and the install command has no -o, with its note`, async ({
      page,
    }) => {
      await open(page, `/items/${block}/`);
      const summaries = await page
        .getByTestId("code-view")
        .locator("summary")
        .allTextContents();
      expect(summaries.map((s) => s.trim())).toEqual(APP_PATHS[block]);
      // Each body is the built file's text, exactly, with the app's aliases.
      const built = JSON.parse(
        readFileSync(`static/r/styles/maia/${block}.json`, "utf8"),
      );
      const bodies = await page
        .getByTestId("code-view")
        .locator("pre")
        .allTextContents();
      expect(bodies).toEqual(toAppFiles(built.files).map((f) => f.text));
      const commands = page.locator("code", {
        hasText: "bunx --bun shadcn-svelte@1.7.1 add",
      });
      await expect(commands).toHaveCount(2);
      for (const command of await commands.all()) {
        await expect(command).toHaveText(
          `bunx --bun shadcn-svelte@1.7.1 add ${block}`,
        );
        const note = await command.evaluate(
          (el) =>
            el.parentElement?.nextElementSibling?.getAttribute("data-testid") ??
            el.nextElementSibling?.getAttribute("data-testid") ??
            null,
        );
        expect(note).toBe("install-note");
      }
      await expect(page.getByTestId("install-note").first()).toContainText(
        "Leave out -o.",
      );
    });
  });
}
