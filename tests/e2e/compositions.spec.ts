/**
 * 010: the stage compositions and the product home, in the browser. Both
 * projects run every test, so each holds in the light and the dark theme.
 * Criteria 4 to 9, the item pages' frames, and the compositions' own views.
 */
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import {
  COMPOSITION_VIEW_LIST,
  COMPOSITIONS,
  GROUND,
  hexToRgb,
  open,
  openView,
  PAGES_010,
  PRODUCT_HOME_STOPS_NARROW,
  PRODUCT_HOME_STOPS_WIDE,
  settled,
  VIEW_READY,
  WIDTHS,
  waitForHighlight,
  type ThemeName,
} from "./pages.ts";

const HOME = "/view/product-home/";

const TAGS = [
  "wcag2a",
  "wcag2aa",
  "wcag21a",
  "wcag21aa",
  "wcag22aa",
  "best-practice",
];

async function expectNoViolations(page: Page, exclude?: string): Promise<void> {
  const builder = new AxeBuilder({ page }).withTags(TAGS);
  if (exclude) builder.exclude(exclude);
  const results = await builder.analyze();
  const violations = results.violations.map(
    (v) =>
      `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`,
  );
  expect(violations).toEqual([]);
  expect(results.passes.length).toBeGreaterThan(0);
}

/** The card that holds a Run button: the hero's Python card. */
const runCard = (page: Page) =>
  page
    .locator('[data-slot="stage-card"]')
    .filter({ has: page.getByRole("button", { name: "Run" }) });

/**
 * Holds every pending scripted run: a `setTimeout` of the block's fixed 900
 * ms is never scheduled, so the busy state stays for a scan.
 */
async function holdRuns(page: Page): Promise<void> {
  await page.evaluate(() => {
    const real = window.setTimeout.bind(window);
    (window as unknown as { setTimeout: unknown }).setTimeout = ((
      fn: TimerHandler,
      ms?: number,
      ...rest: unknown[]
    ) => (ms === 900 ? 0 : real(fn, ms, ...rest))) as typeof setTimeout;
  });
}

/** Records every text a node takes, in order, under `window.__said[key]`. */
async function recordText(page: Page, selector: string, key: string) {
  await page.locator(selector).evaluate((el, key) => {
    const w = window as unknown as { __said?: Record<string, string[]> };
    w.__said ??= {};
    const list: string[] = (w.__said[key] = []);
    new MutationObserver(() => list.push(el.textContent?.trim() ?? "")).observe(
      el,
      { childList: true, characterData: true, subtree: true },
    );
  }, key);
}

/** The recorded texts with repeats in a row collapsed. */
async function said(page: Page, key: string): Promise<string[]> {
  const list = await page.evaluate(
    (key) =>
      (window as unknown as { __said: Record<string, string[]> }).__said[key]!,
    key,
  );
  return list.filter((t, i) => i === 0 || t !== list[i - 1]);
}

// Criterion 4 (amended at the build's checkpoint 1): the bar overlays the
// first stage, and the hero beneath it fills the whole screen from the top
// of the page; the proof band starts below the fold.
test.describe("4. the fold", () => {
  for (const [width, height] of [
    [1440, 900],
    [390, 844],
    [320, 640],
  ] as const) {
    test(`at ${width}×${height} the hero starts under the bar, is at least ${height} px tall, and the proof band starts at or below ${height}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height });
      await openView(page, HOME);
      const hero = (await page
        .locator('[data-slot="stage-hero"]')
        .boundingBox())!;
      const bar = (await page
        .locator('[data-slot="marketing-bar"]')
        .boundingBox())!;
      expect(bar.y).toBe(0);
      expect(hero.y).toBe(0);
      expect(hero.height).toBeGreaterThanOrEqual(height - 0.5);
      // The hero's words clear the bar.
      const eyebrow = (await page
        .locator('[data-slot="stage-hero"] p')
        .first()
        .boundingBox())!;
      expect(eyebrow.y).toBeGreaterThanOrEqual(bar.height);
      const band = (await page
        .locator('[data-slot="proof-band"]')
        .boundingBox())!;
      expect(band.y).toBeGreaterThanOrEqual(height);
    });
  }

  // 010 decision 5: the strip sits at the bottom of the first screen.
  test("at 1440×900 the hero's strip ends on the first screen", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openView(page, HOME);
    const strip = (await page
      .locator('[data-slot="stage-hero-strip"]')
      .boundingBox())!;
    expect(strip.y + strip.height).toBeLessThanOrEqual(900);
  });
});

// Criterion 5: the hero card's run, announced each time; and the failure path.
// 012 decision 1: the bloom and `lit` are gone, so nothing lights.
test.describe("5. the stage card", () => {
  test('Run sets data-busy on the card and aria-busy on its output, then shows 2 lines and says "Ran. 2 lines."; a second run says it again', async ({
    page,
  }) => {
    await openView(page, HOME);
    const card = runCard(page);
    await expect(card).toHaveCount(1);
    const output = card.locator('[data-slot="stage-card-output"]');
    const status = card.locator('[data-stage-card="status"]');
    await expect(status).toHaveText("");
    await recordText(page, '[data-stage-card="status"]', "card");
    const run = card.getByRole("button", { name: "Run" });

    await run.click();
    await expect(
      page.locator('[data-slot="stage-card"][data-busy]'),
    ).toHaveCount(1);
    await expect(output).toHaveAttribute("aria-busy", "true");
    await expect(page.locator("[data-lit]")).toHaveCount(0);
    await expect(run).toBeFocused();
    await expect(output.locator("li")).toHaveCount(2);
    await expect(status).toHaveText("Ran. 2 lines.");
    await expect(
      page.locator('[data-slot="stage-card"][data-busy]'),
    ).toHaveCount(0);
    await expect(output).not.toHaveAttribute("aria-busy", "true");
    await expect(output).toHaveCSS("font-family", /JetBrains Mono Variable/);

    await run.click();
    await expect(
      page.locator('[data-slot="stage-card"][data-busy]'),
    ).toHaveCount(1);
    await expect(
      page.locator('[data-slot="stage-card"][data-busy]'),
    ).toHaveCount(0);
    await expect(status).toHaveText("Ran. 2 lines.");
    // Cleared between the two, so the polite region announces both.
    expect(await said(page, "card")).toEqual([
      "Ran. 2 lines.",
      "",
      "Ran. 2 lines.",
    ]);
  });

  test('a rejecting run ends busy, shows its message in one destructive line and says "Run failed."', async ({
    page,
  }) => {
    await openView(page, "/view/compositions/stage-card/failing/");
    const card = runCard(page);
    await card.getByRole("button", { name: "Run" }).click();
    const lines = card.locator('[data-slot="stage-card-output"] li');
    await expect(lines).toHaveCount(1);
    await expect(lines).toHaveText(
      "Could not reach the sandbox. Check the connection and run it again.",
    );
    const colours = await lines.evaluate((li) => [
      getComputedStyle(li).color,
      getComputedStyle(li).getPropertyValue("--destructive").trim(),
    ]);
    expect(colours[0]).toBe(hexToRgb(colours[1]!));
    await expect(card.locator('[data-stage-card="status"]')).toHaveText(
      "Run failed.",
    );
    await expect(card).not.toHaveAttribute("data-busy", /.*/);
  });
});

// Criterion 6: the count-up's states.
test.describe("6. the proof band", () => {
  const FINAL = ["4", "1", "0"];
  const values = (page: Page) =>
    page
      .locator('[data-slot="proof-band-value"]')
      .evaluateAll((els) => els.map((e) => e.textContent?.trim() ?? ""));
  const copies = (page: Page) =>
    page
      .locator('[data-slot="proof-band-text"]')
      .evaluateAll((els) => els.map((e) => e.textContent?.trim() ?? ""));

  /** Records every text each value takes, by index, from the first byte. */
  const recordFromLoad = (page: Page) =>
    page.addInitScript(() => {
      const w = window as unknown as { __proof: [number, string][] };
      w.__proof = [];
      new MutationObserver((records) => {
        for (const r of records) {
          const node =
            r.target.nodeType === Node.TEXT_NODE
              ? r.target.parentElement
              : (r.target as Element);
          const el = node?.closest?.('[data-slot="proof-band-value"]');
          if (!el) continue;
          const all = [
            ...document.querySelectorAll('[data-slot="proof-band-value"]'),
          ];
          w.__proof.push([all.indexOf(el), el.textContent?.trim() ?? ""]);
        }
      }).observe(document, {
        subtree: true,
        childList: true,
        characterData: true,
      });
    });
  const recorded = (page: Page) =>
    page.evaluate(
      () => (window as unknown as { __proof: [number, string][] }).__proof,
    );

  test("the prerendered HTML holds the final values, on screen and in the screen-reader copy", async ({
    page,
    request,
  }) => {
    const html = await (await request.get(HOME)).text();
    const found = await page.evaluate((html) => {
      const doc = new DOMParser().parseFromString(html, "text/html");
      const text = (selector: string) =>
        [...doc.querySelectorAll(selector)].map(
          (e) => e.textContent?.trim() ?? "",
        );
      return {
        shown: text('[data-slot="proof-band-value"]'),
        read: text('[data-slot="proof-band-text"]'),
        hidden: [...doc.querySelectorAll('[data-slot="proof-band-value"]')].map(
          (e) => e.getAttribute("aria-hidden"),
        ),
      };
    }, html);
    expect(found.shown).toEqual(FINAL);
    expect(found.read).toEqual(FINAL);
    expect(found.hidden).toEqual(["true", "true", "true"]);
  });

  test("below the fold it reads 0 out of sight, counts when scrolled into view and ends at the final values; the screen-reader copy holds them throughout", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await recordFromLoad(page);
    await openView(page, HOME);
    await expect.poll(() => values(page)).toEqual(["0", "0", "0"]);
    expect(await copies(page)).toEqual(FINAL);
    await page.locator('[data-slot="proof-band"]').scrollIntoViewIfNeeded();
    await expect.poll(() => values(page)).toEqual(FINAL);
    expect(await copies(page)).toEqual(FINAL);
    const first = (await recorded(page))
      .filter(([i]) => i === 0)
      .map(([, t]) => t);
    // It counted: a frame between 0 and 4.
    expect(first.some((t) => ["1", "2", "3"].includes(t))).toBe(true);
    expect(first.at(-1)).toBe("4");
    // Once per page load: scrolled away and back, nothing moves.
    const before = (await recorded(page)).length;
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.locator('[data-slot="proof-band"]').scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);
    expect((await recorded(page)).length).toBe(before);
  });

  test("in view at load (a link to it), it never changes", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await recordFromLoad(page);
    await page.goto(`${HOME}#layer`);
    await page.locator(VIEW_READY).waitFor();
    await page.waitForTimeout(900);
    expect(await values(page)).toEqual(FINAL);
    for (const [i, text] of await recorded(page)) expect(text).toBe(FINAL[i]);
  });

  // Change review finding 2: under reduced motion the zeros never show.
  test("under emulated reduced motion it shows the final values throughout: no zero, no frame between", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 1440, height: 900 });
    await recordFromLoad(page);
    await openView(page, HOME);
    expect(await values(page)).toEqual(FINAL);
    await page.locator('[data-slot="proof-band"]').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    expect(await values(page)).toEqual(FINAL);
    for (const [i, text] of await recorded(page)) expect(text).toBe(FINAL[i]);
    expect(await copies(page)).toEqual(FINAL);
  });

  // Change review finding 2: a printed page never says 0 search verbs.
  test("waiting out of sight, it shows the final values when the page is printed", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openView(page, HOME);
    await expect.poll(() => values(page)).toEqual(["0", "0", "0"]);
    await page.evaluate(() => window.dispatchEvent(new Event("beforeprint")));
    await expect.poll(() => values(page)).toEqual(FINAL);
  });

  // Change review finding 3: new items after mount show their own values.
  test("given new items after mount, the digits and the screen-reader copies follow them", async ({
    page,
  }) => {
    await openView(page, "/view/compositions/proof-band/");
    expect(await values(page)).toEqual(FINAL);
    await page.getByRole("button", { name: "Reverse the order" }).click();
    const reversed = [...FINAL].reverse();
    await expect.poll(() => values(page)).toEqual(reversed);
    expect(await copies(page)).toEqual(reversed);
    await page.getByRole("button", { name: "Reverse the order" }).click();
    await expect.poll(() => values(page)).toEqual(FINAL);
  });
});

// Criterion 7: the console.
test("7. the console's Run fills each meter from 0 to its result and shows its lines; it is productive, every button with 8 px corners", async ({
  page,
}) => {
  await openView(page, HOME);
  const root = page.locator('[data-slot="live-console"]');
  await expect(root).toHaveAttribute("data-mode", "productive");
  await root.scrollIntoViewIfNeeded();
  const radii = await root
    .locator("button")
    .evaluateAll((els) =>
      els.map((b) => getComputedStyle(b).borderTopLeftRadius),
    );
  expect(radii.length).toBeGreaterThanOrEqual(2);
  expect(radii.filter((r) => r !== "8px")).toEqual([]);

  // Sample every meter's value on each frame from the click on.
  await page.evaluate(() => {
    const w = window as unknown as { __fill: number[][] };
    w.__fill = [];
    const sample = () => {
      w.__fill.push(
        [
          ...document.querySelectorAll<HTMLMeterElement>(
            '[data-slot="live-console"] meter',
          ),
        ].map((m) => m.value),
      );
      requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
  });
  await root.getByRole("button", { name: "Run" }).click();
  await expect(root).toHaveAttribute("data-busy", "");
  const meters = root.locator('[data-slot="live-console-meter"]');
  await expect(meters).toHaveCount(3);
  await expect(meters.locator("label")).toHaveText([
    "files searched",
    "permission checks",
    "results",
  ]);
  const FINAL = [12, 12, 2];
  await expect
    .poll(() =>
      root
        .locator("meter")
        .evaluateAll((els) => els.map((m) => (m as HTMLMeterElement).value)),
    )
    .toEqual(FINAL);
  await expect(meters.locator("[data-console=numbers]")).toHaveText([
    "12 / 12",
    "12 / 12",
    "2 / 12",
  ]);
  await expect(root).not.toHaveAttribute("data-busy", /.*/);
  await expect(
    root.locator('[data-slot="live-console-output"] li'),
  ).toHaveCount(2);
  await expect(root.locator('[data-console="status"]')).toHaveText(
    "Ran. 2 lines.",
  );
  // The fill moved: a frame strictly between 0 and the first meter's result.
  const fill = await page.evaluate(
    () => (window as unknown as { __fill: number[][] }).__fill,
  );
  expect(fill.some((f) => f[0]! > 0 && f[0]! < FINAL[0]!)).toBe(true);
  expect(fill.filter((f) => f.length).at(0)?.[0]).toBe(0);
});

test("7. a rejecting console run ends busy and shows an error line and 'Run failed.'", async ({
  page,
}) => {
  await openView(page, "/view/compositions/live-console/failing/");
  const root = page.locator('[data-slot="live-console"]');
  await root.getByRole("button", { name: "Run" }).click();
  await expect(
    root.locator('[data-slot="live-console-output"] li'),
  ).toHaveCount(1);
  await expect(root.locator('[data-console="status"]')).toHaveText(
    "Run failed.",
  );
  await expect(root).not.toHaveAttribute("data-busy", /.*/);
  await expect(root.locator('[data-slot="live-console-meter"]')).toHaveCount(0);
});

// Criterion 8: axe on every new view in both themes, and in the states the
// views reach only by use; no horizontal scroll at 320.
test.describe("8. axe and reflow", () => {
  for (const width of WIDTHS) {
    test.describe(`at ${width}`, () => {
      test.use({ viewport: { width, height: 900 } });
      for (const view of COMPOSITION_VIEW_LIST) {
        test(`axe finds 0 violations on ${view.path}`, async ({ page }) => {
          await openView(page, view.path);
          await expectNoViolations(page);
        });
      }
    });
  }

  test("axe finds 0 violations on the product home with both runs resolved", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await openView(page, HOME);
    await runCard(page).getByRole("button", { name: "Run" }).click();
    const root = page.locator('[data-slot="live-console"]');
    await root.getByRole("button", { name: "Run" }).click();
    await expect(
      runCard(page).locator('[data-stage-card="status"]'),
    ).toHaveText("Ran. 2 lines.");
    await expect(root.locator('[data-console="status"]')).toHaveText(
      "Ran. 2 lines.",
    );
    await settled(page);
    await expectNoViolations(page);
  });

  test("axe finds 0 violations on the product home with the card and the console busy", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await openView(page, HOME);
    await holdRuns(page);
    await runCard(page).getByRole("button", { name: "Run" }).click();
    const root = page.locator('[data-slot="live-console"]');
    await root.getByRole("button", { name: "Run" }).click();
    await expect(
      page.locator('[data-slot="stage-card"][data-busy]'),
    ).toHaveCount(1);
    await expect(root).toHaveAttribute("data-busy", "");
    await expectNoViolations(page);
  });

  test("axe finds 0 violations on the failing views after their runs reject", async ({
    page,
  }) => {
    for (const path of [
      "/view/compositions/stage-card/failing/",
      "/view/compositions/live-console/failing/",
    ]) {
      await openView(page, path);
      await page.getByRole("button", { name: "Run" }).click();
      await expect(page.getByText("Run failed.")).toHaveCount(1);
      await expectNoViolations(page);
    }
  });

  test.describe("at 360", () => {
    test.use({ viewport: { width: 360, height: 700 } });
    for (const path of [HOME, "/view/compositions/marketing-bar/"]) {
      test(`axe finds 0 violations on ${path} with the bar's sheet open`, async ({
        page,
      }) => {
        await openView(page, path);
        await page.getByRole("button", { name: "Menu" }).click();
        const sheet = page.getByRole("dialog", { name: "Pluto Systems" });
        await sheet.waitFor();
        await expect(
          sheet.getByRole("navigation", { name: "Main" }),
        ).toHaveCount(1);
        await settled(page);
        await expectNoViolations(page);
      });
    }
  });

  test("reflow: no horizontal scroll at 320 px on the 10 item pages, the 13 composition views and the product home", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    const wide: string[] = [];
    const paths = [
      ...PAGES_010,
      ...COMPOSITION_VIEW_LIST.map((v) => v.path),
      HOME,
    ];
    expect(paths).toHaveLength(24);
    for (const path of paths) {
      if (path.startsWith("/view/")) await openView(page, path);
      else await open(page, path);
      const width = await page.evaluate(
        () => document.documentElement.scrollWidth,
      );
      if (width > 320) wide.push(`${path}: ${width}`);
    }
    expect(wide).toEqual([]);
  });
});

/** The focused element's signature, as keyboard.spec.ts reads it. */
async function signature(page: Page): Promise<string | null> {
  return page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;
    if (!el || el === document.body) return null;
    const role = el.getAttribute("role") ?? el.tagName.toLowerCase();
    const clone = el.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('[aria-hidden="true"]').forEach((n) => n.remove());
    const name = (el.getAttribute("aria-label") ?? clone.textContent ?? "")
      .trim()
      .replace(/\s+/g, " ");
    return `${role}:${name}`;
  });
}

/**
 * The focused element shows a solid 2 px outline in the ring it sits in (a
 * code block's root draws it for its pre), and, outside the bar, it is not
 * fully hidden under the bar (WCAG 2.4.11).
 */
async function focusProblem(page: Page): Promise<string | null> {
  return page.evaluate(() => {
    const focused = document.activeElement as HTMLElement;
    const ringed = (
      focused.getAttribute("data-slot") === "code-block-content"
        ? focused.closest('[data-slot="code-block"]')
        : focused
    ) as HTMLElement;
    const style = getComputedStyle(ringed);
    const ring = style.getPropertyValue("--ring").trim();
    const probe = document.createElement("span");
    probe.style.color = ring;
    document.body.append(probe);
    const ringColour = getComputedStyle(probe).color;
    probe.remove();
    if (
      style.outlineStyle !== "solid" ||
      style.outlineWidth !== "2px" ||
      style.outlineColor !== ringColour
    )
      return `ring: ${style.outlineStyle} ${style.outlineWidth} ${style.outlineColor}, want ${ringColour}`;
    const bar = document.querySelector('[data-slot="marketing-bar"]')!;
    if (bar.contains(focused)) return null;
    const b = bar.getBoundingClientRect();
    const r = ringed.getBoundingClientRect();
    if (r.bottom <= b.bottom)
      return `hidden under the bar: ${r.bottom} ≤ ${b.bottom}`;
    return null;
  });
}

// Criterion 9: the keyboard walk, forward and back, at 1440 and at 320.
test.describe("9. the keyboard walk", () => {
  for (const [width, stops] of [
    [1440, PRODUCT_HOME_STOPS_WIDE],
    [320, PRODUCT_HOME_STOPS_NARROW],
  ] as const) {
    test(`at ${width}: ${stops.length} stops in DOM order from the skip link, each ringed and clear of the bar, forward and back`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 800 });
      await openView(page, HOME);
      await waitForHighlight(page);
      const forward: string[] = [];
      for (let i = 0; i < stops.length; i++) {
        await page.keyboard.press("Tab");
        forward.push((await signature(page))!);
        expect(await focusProblem(page), `stop ${i + 1}`).toBeNull();
      }
      expect(forward).toEqual(stops);
      // DOM order: each stop follows the one before it.
      await page.keyboard.press("Tab");
      expect(await signature(page)).toBeNull();
      // Back up: focus moving upward is never hidden under the sticky bar.
      await page.keyboard.press("Shift+Tab");
      for (let i = stops.length - 1; i >= 0; i--) {
        expect(await signature(page), `back to stop ${i + 1}`).toBe(stops[i]);
        expect(await focusProblem(page), `back to stop ${i + 1}`).toBeNull();
        if (i > 0) await page.keyboard.press("Shift+Tab");
      }
    });
  }

  // Change review finding 7: after the skip, main's first content is clear
  // of the overlaying bar.
  test("Enter on the skip link focuses main#main, whose first content sits below the bar", async ({
    page,
  }) => {
    await openView(page, HOME);
    await page.keyboard.press("Tab");
    const skip = page.locator('[data-slot="marketing-bar-skip-link"]');
    await expect(skip).toBeFocused();
    await expect(skip).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(page.locator("main#main")).toBeFocused();
    const bar = (await page
      .locator('[data-slot="marketing-bar"]')
      .boundingBox())!;
    const first = (await page
      .locator('[data-slot="stage-hero"] p')
      .first()
      .boundingBox())!;
    expect(first.y).toBeGreaterThanOrEqual(bar.y + bar.height);
  });
});

// 010 decisions 4 and 9: the bar is top-level, so it stays at the top over
// the whole page; it marks itself so focus stays clear. 012 decision 4: its
// links are the theme's foreground, on its glass.
test("the bar stays at the top over the proof band and the footer, marked data-sticky-bar, its links in the foreground", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await openView(page, HOME);
  const bar = page.locator('[data-slot="marketing-bar"]');
  await expect(bar).toHaveAttribute("data-sticky-bar", "");
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollPaddingTop,
    ),
  ).toBe("72px");
  for (const target of ['[data-slot="proof-band"]', "footer"]) {
    await page.locator(target).scrollIntoViewIfNeeded();
    expect((await bar.boundingBox())!.y).toBe(0);
  }
  expect((await bar.boundingBox())!.height).toBe(72);
  const [link, foreground] = await bar
    .getByRole("navigation", { name: "Main" })
    .getByRole("link")
    .first()
    .evaluate((a) => [
      getComputedStyle(a).color,
      getComputedStyle(document.documentElement)
        .getPropertyValue("--foreground")
        .trim(),
    ]);
  expect(link).toBe(hexToRgb(foreground!));
});

// 010 decision 9 and review finding 5: one h1, the hero's; the rest h2.
test("the product home's headings: one h1, then h2 for the proof band, the console, the call to action and the footer's 2 groups", async ({
  page,
}) => {
  await openView(page, HOME);
  const headings = await page
    .locator("h1, h2, h3, h4, h5, h6")
    .evaluateAll((els) =>
      els.map((h) => `${h.tagName.toLowerCase()}:${h.textContent?.trim()}`),
    );
  expect(headings).toEqual([
    "h1:Work runs on data.",
    "h2:One layer under every app",
    "h2:Try the layer",
    "h2:Start with the data you already have.",
    "h2:Product",
    "h2:Company",
  ]);
  // Landmarks: the bar's banner, one main, the footer's contentinfo.
  await expect(page.getByRole("banner")).toHaveCount(1);
  await expect(page.getByRole("main")).toHaveCount(1);
  await expect(page.getByRole("contentinfo")).toHaveCount(1);
});

// 010 decision 9 and 006 decision 5: the header's lockup is the page's one
// entrance; the item page's frames pass none.
test("the lockup enters in the bar only, and the marketing bar's own view has no entrance", async ({
  page,
}) => {
  await openView(page, HOME);
  await expect(page.locator(".mark-entrance")).toHaveCount(1);
  await expect(
    page.locator('[data-slot="marketing-bar"] .mark-entrance'),
  ).toHaveCount(1);
  await openView(page, "/view/compositions/marketing-bar/");
  await expect(page.locator(".mark-entrance")).toHaveCount(0);
  await openView(page, "/view/compositions/marketing-footer/");
  await expect(page.locator(".mark-entrance")).toHaveCount(0);
});

// 010 decision 10: each composition's page shows its views in the viewer.
test.describe("the item pages' frames", () => {
  for (const item of COMPOSITIONS) {
    const views = COMPOSITION_VIEW_LIST.filter((v) => v.item === item);
    test(`${item}: the frame shows /view/compositions/${item}/ and the state buttons switch among ${views.length}`, async ({
      page,
    }) => {
      await open(page, `/items/${item}/`);
      const frame = page.locator('[data-testid="viewer"] iframe');
      await expect(frame).toHaveAttribute("src", views[0]!.path);
      await expect(frame).toHaveAttribute("title", /preview$/);
      await page
        .frameLocator('[data-testid="viewer"] iframe')
        .locator(VIEW_READY)
        .waitFor();
      if (views.length > 1) {
        const group = page.getByRole("group", { name: "State" });
        for (const view of [...views.slice(1), views[0]!]) {
          await group
            .getByRole("button", { name: view.label, exact: true })
            .click();
          await expect(frame).toHaveAttribute("src", view.path);
        }
      } else {
        await expect(page.getByRole("group", { name: "State" })).toHaveCount(0);
      }
    });
  }
});

// 001's theme check on the new views: the body takes the system's theme, and
// each view holds the theme script once.
test.describe("the composition views' theme", () => {
  for (const view of COMPOSITION_VIEW_LIST) {
    test(`${view.path} takes the theme from the system and holds the theme script once`, async ({
      page,
      request,
    }, info) => {
      await openView(page, view.path);
      const theme = info.project.name as ThemeName;
      await expect(page.locator("body")).toHaveCSS(
        "background-color",
        GROUND[theme],
      );
      const html = await (await request.get(view.path)).text();
      expect(html.split('localStorage.getItem("pluto-theme")').length - 1).toBe(
        1,
      );
    });
  }
});
