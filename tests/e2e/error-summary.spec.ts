/**
 * 019: the error summary. The alert inside, the label in view. Criteria 1 to
 * 7, 9, 11, 12 and 13, in both theme projects. Sizes are 1440 × 900 and
 * 390 × 844.
 *
 * "Clear": the element's box lies inside the visual viewport (for one taller
 * than the viewport, its top edge does), and the topmost element at its
 * centre is it, inside it, or holds it. "Lands": the question's top is within
 * 1 px of the bar's bottom, or the page is at its maximum scroll and the
 * question is clear.
 */
import AxeBuilder from "@axe-core/playwright";
import type {
  APIRequestContext,
  Browser,
  Locator,
  Page,
} from "@playwright/test";
import { expect, test } from "../test.ts";
import { componentPath, open, openView } from "./pages.ts";

const PAGE = componentPath("error-summary");
const EXAMPLE = "/example/error-summary/keyboard/";
const SIZES = [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
] as const;

/** The three links, their targets' questions and controls, in order. */
const LINKS = [
  {
    text: "Enter a project name",
    question: (s: Locator) => s.locator("label", { hasText: "Project name" }),
    control: (s: Locator) => s.locator("#project-name"),
  },
  {
    text: "Enter the owner's email address",
    question: (s: Locator) => s.locator("label", { hasText: "Owner email" }),
    control: (s: Locator) => s.locator("#owner-email"),
  },
  {
    text: "Choose who can see the project",
    question: (s: Locator) =>
      s.locator("legend", { hasText: "Who can see it" }),
    control: (s: Locator) => s.getByRole("radio", { name: "Only me" }),
  },
] as const;

/**
 * The links the summary holds. A regression guard (criterion 5) also runs on
 * the code before 019, whose example has no radio question.
 */
async function present(page: Page) {
  const out = [];
  for (const link of LINKS)
    if (
      (await summary(page).getByRole("link", { name: link.text }).count()) > 0
    )
      out.push(link);
  return out;
}

/** The term of art, read in the page. */
function isClear(locator: Locator): Promise<boolean> {
  return locator.evaluate((el) => {
    const r = el.getBoundingClientRect();
    const vv = window.visualViewport;
    const vw = vv ? vv.width : window.innerWidth;
    const vh = vv ? vv.height : window.innerHeight;
    const tall = r.height > vh;
    const inside =
      r.left >= -0.5 &&
      r.right <= vw + 0.5 &&
      r.top >= -0.5 &&
      (tall ? r.top <= vh : r.bottom <= vh + 0.5);
    if (!inside) return false;
    const y = tall ? r.top + Math.min(r.height, vh) / 2 : r.top + r.height / 2;
    const hit = document.elementFromPoint(r.left + r.width / 2, y);
    return !!hit && (hit === el || el.contains(hit) || hit.contains(el));
  });
}

const top = (locator: Locator) =>
  locator.evaluate((el) => el.getBoundingClientRect().top);

const scrollY = (page: Page) => page.evaluate(() => window.scrollY);

const atMaxScroll = (page: Page) =>
  page.evaluate(
    () =>
      Math.abs(
        window.scrollY +
          window.innerHeight -
          document.documentElement.scrollHeight,
      ) <= 1,
  );

/** The site bar's bottom, read live. */
const barBottom = (page: Page) =>
  page
    .locator('[data-slot="site-bar"]')
    .evaluate((el) => el.getBoundingClientRect().bottom);

/** Lands: within 1 px of the bar's bottom, or at the page's end and clear. */
async function expectLands(page: Page, question: Locator, at: number) {
  const t = await top(question);
  if (Math.abs(t - at) <= 1) return;
  expect(await atMaxScroll(page), `question at ${t}, wanted ${at}`).toBe(true);
  expect(await isClear(question)).toBe(true);
}

const fixture = (page: Page) => page.getByTestId("keyboard-fixture");
const summary = (page: Page) =>
  fixture(page).locator('[data-slot="error-summary"]');

async function submitEmpty(page: Page) {
  await fixture(page).getByRole("button", { name: "Create project" }).click();
  await expect(summary(page)).toBeFocused();
}

/** 11: the address does not change, and holds no hash. */
async function expectNoHash(page: Page, url: string) {
  expect(await page.evaluate(() => location.hash)).toBe("");
  expect(page.url()).toBe(url);
}

/** Fetches a page's prerendered HTML and loads it with scripts off. */
async function rawPage(
  browser: Browser,
  request: APIRequestContext,
  path: string,
) {
  const response = await request.get(path);
  expect(response.status()).toBe(200);
  const context = await browser.newContext({ javaScriptEnabled: false });
  const raw = await context.newPage();
  await raw.setContent(await response.text());
  return { raw, close: () => context.close() };
}

test.describe("019: the error summary", () => {
  // Criterion 1.
  test("1. the root is focused with no role or name; the alert is its content, holding the heading and the 3 links", async ({
    page,
  }) => {
    await open(page, PAGE);
    await submitEmpty(page);
    const root = summary(page);
    await expect(root).toHaveAttribute("tabindex", "-1");
    for (const attr of ["role", "aria-label", "aria-labelledby"])
      expect(await root.getAttribute(attr), attr).toBeNull();
    const content = root.locator('[data-slot="error-summary-content"]');
    await expect(content).toHaveCount(1);
    await expect(content).toHaveAttribute("role", "alert");
    await expect(
      content.getByRole("heading", { name: "There is a problem" }),
    ).toHaveCount(1);
    await expect(content.getByRole("link")).toHaveCount(3);
    const icon = root.locator(":scope > svg");
    await expect(icon).toHaveCount(1);
    await expect(icon).toHaveAttribute("aria-hidden", "true");
    expect(await content.locator("svg").count()).toBe(0);
    await expect(root).toMatchAriaSnapshot(`
      - alert:
        - heading "There is a problem" [level=2]
        - list:
          - listitem:
            - link "Enter a project name"
          - listitem:
            - link "Enter the owner's email address"
          - listitem:
            - link "Choose who can see the project"
    `);
  });

  test("1. the raw prerendered HTML: the 3 specimens hold 0 elements with a role", async ({
    browser,
    request,
  }) => {
    const { raw, close } = await rawPage(browser, request, PAGE);
    const specimens = raw.locator(
      '[data-testid="summary-specimens"] [data-slot="error-summary"]',
    );
    await expect(specimens).toHaveCount(3);
    // The icon is Phosphor's, an aria-hidden svg that carries role="img":
    // nothing under aria-hidden is in the accessibility tree, so it is not
    // counted.
    const roles = await specimens.evaluateAll(
      (all) =>
        all
          .flatMap((s) => [s, ...s.querySelectorAll("[role]")])
          .filter(
            (e) => e.hasAttribute("role") && !e.closest('[aria-hidden="true"]'),
          ).length,
    );
    expect(roles).toBe(0);
    await close();
  });

  for (const size of SIZES) {
    test.describe(`at ${size.width}`, () => {
      test.use({ viewport: size });

      // Criteria 2, 4 and 11.
      test("2. a field already in view: each link focuses its control and leaves it and its question clear; nothing moves if both were clear", async ({
        page,
      }) => {
        await open(page, PAGE);
        const url = page.url();
        await submitEmpty(page);
        const bottom = await barBottom(page);
        for (const link of LINKS) {
          const a = summary(page).getByRole("link", { name: link.text });
          await a.focus();
          const question = link.question(fixture(page));
          const control = link.control(fixture(page));
          const before = {
            clear: (await isClear(question)) && (await isClear(control)),
            y: await scrollY(page),
          };
          await page.keyboard.press("Enter");
          await expect(control, link.text).toBeFocused();
          expect(await isClear(question), `${link.text}: question`).toBe(true);
          expect(await isClear(control), `${link.text}: control`).toBe(true);
          await expectNoHash(page, url);
          if (before.clear) expect(await scrollY(page)).toBe(before.y);
          else await expectLands(page, question, bottom);
        }
      });

      // Criteria 3, 4 and 11.
      test("3. from under the bar: the label lands, and the label and the input are clear; the legend lands, and Only me is focused and clear", async ({
        page,
      }) => {
        await open(page, PAGE);
        const url = page.url();
        await submitEmpty(page);
        const bottom = await barBottom(page);
        for (const i of [1, 2]) {
          const link = LINKS[i]!;
          const question = link.question(fixture(page));
          const control = link.control(fixture(page));
          // Put the question's centre 20 px above the bar's bottom, under
          // the glass (the bar's last 8 px are its room, which takes no
          // pointer, so "clear" does not see it).
          const box = await question.evaluate((el) => {
            const r = el.getBoundingClientRect();
            return { t: r.top, h: r.height };
          });
          await page.evaluate(
            (d) => window.scrollBy(0, d),
            box.t + box.h / 2 - (bottom - 20),
          );
          expect(await isClear(question), "the question starts covered").toBe(
            false,
          );
          await summary(page)
            .getByRole("link", { name: link.text })
            .dispatchEvent("click");
          await expect(control).toBeFocused();
          await expectLands(page, question, bottom);
          expect(await isClear(question)).toBe(true);
          expect(await isClear(control)).toBe(true);
          await expectNoHash(page, url);
        }
      });

      // Criteria 5 and 11: regression guards, passing before and after.
      test.describe("5. an undeclared 64 px sticky bar", () => {
        async function withBar(page: Page) {
          await openView(page, EXAMPLE);
          await page.evaluate(() => {
            const bar = document.createElement("div");
            bar.setAttribute("data-test-bar", "");
            bar.style.cssText =
              "position:sticky;top:0;height:64px;z-index:1000;background:#808080";
            document.body.prepend(bar);
          });
          // Room below the form, so any field can be scrolled under the bar.
          await page.addStyleTag({
            content: "main { padding-bottom: 2000px !important; }",
          });
          expect(
            await page.evaluate(
              () => getComputedStyle(document.documentElement).scrollPaddingTop,
            ),
          ).toBe("auto");
          await submitEmpty(page);
          return page.url();
        }

        test("with the fields 1600 px below the summary, each link leaves its control focused and clear", async ({
          page,
        }) => {
          const url = await withBar(page);
          await page.addStyleTag({
            content:
              '[data-slot="error-summary"] { margin-bottom: 1600px !important; }',
          });
          for (const link of await present(page)) {
            await page.evaluate(() => window.scrollTo(0, 0));
            await summary(page)
              .getByRole("link", { name: link.text })
              .dispatchEvent("click");
            const control = link.control(fixture(page));
            await expect(control).toBeFocused();
            expect(await isClear(control), link.text).toBe(true);
            await expectNoHash(page, url);
          }
        });

        test("with the fields in view, a link whose question and control are clear moves nothing", async ({
          page,
        }) => {
          const url = await withBar(page);
          let checked = 0;
          for (const link of await present(page)) {
            const question = link.question(fixture(page));
            const control = link.control(fixture(page));
            const a = summary(page).getByRole("link", { name: link.text });
            await a.focus();
            const clear = (await isClear(question)) && (await isClear(control));
            const y = await scrollY(page);
            await page.keyboard.press("Enter");
            await expect(control).toBeFocused();
            await expectNoHash(page, url);
            if (!clear) continue;
            checked++;
            expect(await scrollY(page), link.text).toBe(y);
          }
          expect(checked).toBeGreaterThan(0);
        });

        test("with Owner email's label under the bar and its input clear, the link leaves the input focused and clear", async ({
          page,
        }) => {
          const url = await withBar(page);
          const question = LINKS[1].question(fixture(page));
          const control = LINKS[1].control(fixture(page));
          const t = await top(question);
          await page.evaluate((d) => window.scrollBy(0, d), t - 40);
          expect(await isClear(question)).toBe(false);
          expect(await isClear(control)).toBe(true);
          await summary(page)
            .getByRole("link", { name: LINKS[1].text })
            .dispatchEvent("click");
          await expect(control).toBeFocused();
          expect(await isClear(control)).toBe(true);
          await expectNoHash(page, url);
        });
      });

      // Criteria 6 and 11.
      test("6. under smooth scrolling, with a declared bar and the fields far down, each text link's label lands at 72 px", async ({
        page,
      }) => {
        await openView(page, EXAMPLE);
        await page.evaluate(() => {
          const bar = document.createElement("div");
          bar.setAttribute("data-sticky-bar", "");
          bar.style.cssText =
            "position:sticky;top:0;height:64px;z-index:1000;background:#808080";
          document.body.prepend(bar);
        });
        await page.addStyleTag({
          content:
            'html { scroll-behavior: smooth; } [data-slot="error-summary"] { margin-bottom: 1600px !important; } main { padding-bottom: 2000px !important; }',
        });
        await submitEmpty(page);
        const url = page.url();
        for (const link of LINKS.slice(0, 2)) {
          await page.evaluate(() =>
            window.scrollTo({ top: 0, behavior: "instant" }),
          );
          await summary(page)
            .getByRole("link", { name: link.text })
            .dispatchEvent("click");
          await page.waitForTimeout(1200);
          const question = link.question(fixture(page));
          const control = link.control(fixture(page));
          await expect(control).toBeFocused();
          expect(
            Math.abs((await top(question)) - 72),
            link.text,
          ).toBeLessThanOrEqual(1);
          expect(await isClear(question)).toBe(true);
          expect(await isClear(control)).toBe(true);
          await expectNoHash(page, url);
        }
      });

      // Criterion 9.
      test("9. axe reports 0 violations after the empty submit", async ({
        page,
      }) => {
        await open(page, PAGE);
        await submitEmpty(page);
        const results = await new AxeBuilder({ page })
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
      });
    });
  }

  // Criterion 7.
  test("7. the app shell with a sidebar declares its sticky header: 72 px; without, auto; an app's own value beats the default in 4 places", async ({
    page,
  }) => {
    const padding = () =>
      page.evaluate(
        () => getComputedStyle(document.documentElement).scrollPaddingTop,
      );
    await openView(page, "/view/app-shell/sidebar/");
    await expect(
      page.locator('header[data-slot="app-shell-header"]'),
    ).toHaveAttribute("data-sticky-bar", "");
    expect(await padding()).toBe("72px");
    await openView(page, "/view/app-shell/");
    expect(
      await page
        .locator('header[data-slot="app-shell-header"]')
        .getAttribute("data-sticky-bar"),
    ).toBeNull();
    expect(await padding()).toBe("auto");
    for (const [css, want] of [
      ["html { scroll-padding-top: 4rem; }", "64px"],
      ["@layer base { html { scroll-padding-top: 4rem; } }", "64px"],
      ["@layer components { html { scroll-padding-top: 4rem; } }", "64px"],
      ["@layer utilities { html { scroll-padding-top: 6rem; } }", "96px"],
    ] as const) {
      await openView(page, "/view/app-shell/sidebar/");
      await page.addStyleTag({ content: css });
      expect(await padding(), css).toBe(want);
    }
  });

  // Criterion 12.
  test("12. the look: each specimen's height and its title's and first link's offsets are as before, ± 0.5 px", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await open(page, PAGE);
    const got = await page.evaluate(() =>
      [
        ...document.querySelectorAll(
          '[data-testid="summary-specimens"] [data-slot="error-summary"]',
        ),
      ].map((s) => {
        const t = s.getBoundingClientRect().top;
        const a = s.querySelector("a");
        return [
          s.getBoundingClientRect().height,
          s
            .querySelector('[data-slot="error-summary-title"]')!
            .getBoundingClientRect().top - t,
          a ? a.getBoundingClientRect().top - t : null,
        ];
      }),
    );
    // Measured on the code before 019 (its Landing notes).
    const WANT = [
      [98.78, 13, null],
      [107.59, 13, 42.59],
      [109.19, 13, 72.19],
    ];
    expect(got).toHaveLength(3);
    got.forEach((row, i) =>
      row.forEach((v, j) => {
        const w = WANT[i]![j];
        if (w === null) expect(v).toBeNull();
        else
          expect(Math.abs((v as number) - w), `${i} ${j}`).toBeLessThanOrEqual(
            0.5,
          );
      }),
    );
  });

  // Criterion 13.
  test("13. the site's padding is the bar's height; the bar keeps data-sticky-bar; product-home keeps 72 px; a token row's fragment lands below the bar", async ({
    page,
  }) => {
    const padding = () =>
      page.evaluate(() =>
        parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop),
      );
    const barHeight = () =>
      page
        .locator('[data-slot="site-bar"]')
        .evaluate((el) => el.getBoundingClientRect().height);
    for (const path of [PAGE, "/"]) {
      await open(page, path);
      await expect(page.locator('[data-slot="site-bar"]')).toHaveAttribute(
        "data-sticky-bar",
        "",
      );
      expect(
        Math.abs((await padding()) - (await barHeight())),
        path,
      ).toBeLessThanOrEqual(0.5);
    }
    await openView(page, "/view/product-home/");
    expect(await padding()).toBe(72);
    await open(page, "/foundations/tokens/");
    const id = await page
      .locator("[data-token-row]")
      .nth(20)
      .getAttribute("id");
    expect(id).toBeTruthy();
    await page.goto(`/foundations/tokens/#${id}`);
    await page.locator("button[aria-pressed][data-ready]").first().waitFor();
    await page.waitForTimeout(300);
    const row = page.locator(`[id="${id}"]`);
    expect(
      Math.abs((await top(row)) - (await barBottom(page))),
    ).toBeLessThanOrEqual(1);
  });
});

/**
 * 022t: the error summary speaks again on an unchanged submit. Criteria 1,
 * 2, 3 and 6. Each watches the summary's root, which stays on these paths.
 * In the page, a watch logs, in order, each `MutationObserver` callback on
 * the root (the content nodes its `childList` records add and remove, and
 * its record count) and each `focusin` on the root itself.
 */
type Logged =
  | { kind: "mutations"; added: number; removed: number; records: number }
  | { kind: "focusin" };

const CONTENT = '[data-slot="error-summary-content"]';

/** Starts watching `root`; keeps it and its content node for later checks. */
function watch(root: Locator): Promise<void> {
  return root.evaluate((el, content) => {
    const log: unknown[] = [];
    const isContent = (n: Node) => n instanceof Element && n.matches(content);
    const record = (records: MutationRecord[]) => {
      let added = 0;
      let removed = 0;
      for (const r of records) {
        if (r.type !== "childList") continue;
        added += [...r.addedNodes].filter(isContent).length;
        removed += [...r.removedNodes].filter(isContent).length;
      }
      log.push({ kind: "mutations", added, removed, records: records.length });
    };
    const observer = new MutationObserver(record);
    observer.observe(el, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    });
    el.addEventListener("focusin", (e) => {
      if (e.target === el) log.push({ kind: "focusin" });
    });
    Object.assign(window, {
      __watch: {
        log,
        root: el,
        content: el.querySelector(content),
        height: el.getBoundingClientRect().height,
        // Records still queued are logged before the observer stops.
        stop: () => {
          const queued = observer.takeRecords();
          if (queued.length) record(queued);
          observer.disconnect();
        },
      },
    });
  }, CONTENT);
}

/** What the watch saw, and the watched root and content node as they are now. */
function watched(root: Locator) {
  return root.evaluate((el, content) => {
    const w = (
      window as unknown as {
        __watch: {
          log: Logged[];
          root: Element;
          content: Element | null;
          height: number;
          stop: () => void;
        };
      }
    ).__watch;
    w.stop();
    const now = el.querySelector(content);
    return {
      log: w.log,
      sameRoot: w.root === el,
      sameContent: !!now && w.content === now,
      oldConnected: !!w.content?.isConnected,
      heightMoved: Math.abs(el.getBoundingClientRect().height - w.height),
    };
  }, CONTENT);
}

/** Criterion 1 (a) and (b): one callback removes one content node and adds one, before the root's focusin. */
function expectOneInsertionBeforeFocus(log: Logged[]) {
  const swaps = log.flatMap((e, i) =>
    e.kind === "mutations" && (e.added || e.removed) ? [{ ...e, i }] : [],
  );
  expect(
    swaps.map(({ added, removed }) => ({ added, removed })),
    "one callback, removing one content node and adding one",
  ).toEqual([{ added: 1, removed: 1 }]);
  const focus = log.findIndex((e) => e.kind === "focusin");
  expect(focus, "the root's focusin").toBeGreaterThan(-1);
  expect(swaps[0]!.i, "the callback runs before the focusin").toBeLessThan(
    focus,
  );
}

/** Criterion 1 (d): the new node's role, heading and links. */
async function expectAlertContent(root: Locator, title: string, links: number) {
  const content = root.locator(CONTENT);
  await expect(content).toHaveCount(1);
  await expect(content).toHaveAttribute("role", "alert");
  await expect(content.getByRole("heading", { name: title })).toHaveCount(1);
  await expect(content.getByRole("link")).toHaveCount(links);
}

test.describe("022t: the error summary speaks again on an unchanged submit", () => {
  // Criterion 1.
  test("1. the second unchanged submit: one callback swaps the content node, before the root's focusin; the old node is gone, the new one an alert with the heading and 3 links; the same root, focused, its height unchanged", async ({
    page,
  }) => {
    await openView(page, EXAMPLE);
    await submitEmpty(page);
    const root = summary(page);
    await watch(root);
    await submitEmpty(page);
    const seen = await watched(root);
    expectOneInsertionBeforeFocus(seen.log);
    expect(seen.oldConnected, "the old content node is connected").toBe(false);
    await expectAlertContent(root, "There is a problem", 3);
    expect(seen.sameRoot, "the same root").toBe(true);
    await expect(root).toBeFocused();
    expect(seen.heightMoved).toBeLessThanOrEqual(0.5);
  });

  // Criterion 2: a guard, passing before and after.
  test("2. typing 3 letters into Project name after a failed submit records no mutation in the summary and keeps its content node", async ({
    page,
  }) => {
    await openView(page, EXAMPLE);
    await submitEmpty(page);
    const root = summary(page);
    await watch(root);
    await fixture(page).locator("#project-name").focus();
    await page.keyboard.type("abc");
    await expect(fixture(page).locator("#project-name")).toHaveValue("abc");
    const seen = await watched(root);
    expect(seen.log.filter((e) => e.kind === "mutations")).toEqual([]);
    expect(seen.sameContent).toBe(true);
  });

  // Criterion 3.
  test("3. on the test view: 5 letters in Notes record 0 mutations in A and keep its node; a second submit gives A a new content node; B keeps its node through both", async ({
    page,
  }) => {
    const form = page.getByTestId("attempt-fixture");
    const a = form.getByTestId("summary-a");
    const b = form.getByTestId("summary-b");
    const send = () => form.getByRole("button", { name: "Send" }).click();
    await openView(page, "/view/error-summary-attempt/");
    await expect(a).toHaveCount(0);
    await expect(b).toHaveCount(0);
    await send();
    await expect(a).toBeFocused();
    const bContent = await b.locator(CONTENT).elementHandle();
    await watch(a);
    await form.locator("#attempt-notes").focus();
    await page.keyboard.type("hello");
    await expect(form.locator("#attempt-notes")).toHaveValue("hello");
    const typed = await watched(a);
    const records = typed.log.reduce(
      (n, e) => n + (e.kind === "mutations" ? e.records : 0),
      0,
    );
    expect(records, "mutation records in A while typing").toBe(0);
    expect(typed.sameContent).toBe(true);
    await watch(a);
    await send();
    await expect(a).toBeFocused();
    const second = await watched(a);
    expectOneInsertionBeforeFocus(second.log);
    expect(second.oldConnected, "A's old content node is connected").toBe(
      false,
    );
    await expectAlertContent(a, "There is a problem (A)", 2);
    expect(second.sameRoot, "A's root is the same").toBe(true);
    expect(
      await bContent!.evaluate((n) => n.isConnected),
      "B's content node is the one from the first submit",
    ).toBe(true);
    expect(
      await b.locator(CONTENT).evaluate((n, old) => n === old, bContent!),
    ).toBe(true);
  });

  // Criterion 6.
  test("6. a summary present at load: the first empty submit on /view/sign-in/errors/ leaves a new content node with role alert, and the root focused", async ({
    page,
  }) => {
    await openView(page, "/view/sign-in/errors/");
    const root = page.locator('[data-slot="error-summary"]');
    await expect(root.locator(CONTENT)).toHaveCount(1);
    expect(await root.locator(CONTENT).getAttribute("role")).toBeNull();
    await watch(root);
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(root).toBeFocused();
    const seen = await watched(root);
    expect(seen.sameRoot, "the same root").toBe(true);
    expect(seen.oldConnected, "the old content node is connected").toBe(false);
    await expect(root.locator(CONTENT)).toHaveAttribute("role", "alert");
  });
});
