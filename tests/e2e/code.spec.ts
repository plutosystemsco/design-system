/**
 * 004 decision 17, browser file 6: the code block (C1 to C4), the editor (E1
 * to E4 and its motion), the chart (H1), the meter (M1), the popover (P1),
 * the accordion (A1) and the toggles (T1). Runs in both projects, light and
 * dark.
 */
import {
  expect,
  test,
  type APIRequestContext,
  type Browser,
  type Locator,
  type Page,
} from "@playwright/test";
import { cssVar, hexToRgb, open, settled } from "./pages.ts";

/**
 * True when a computed colour holds a token's colour: the same channels and
 * an alpha within 0.01. The production minifier may shorten the token's hex.
 */
function holdsColour(computed: string, hex: string): boolean {
  let d = hex.replace("#", "");
  if (d.length <= 4) d = [...d].map((c) => c + c).join("");
  const n = parseInt(d.slice(0, 6), 16);
  const want = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  const alpha = d.length === 8 ? parseInt(d.slice(6), 16) / 255 : 1;
  return [...computed.matchAll(/rgba?\(([^)]*)\)/g)].some((m) => {
    const parts = m[1].split(",").map((x) => parseFloat(x));
    const a = parts.length === 4 ? parts[3] : 1;
    return (
      parts[0] === want[0] &&
      parts[1] === want[1] &&
      parts[2] === want[2] &&
      Math.abs(a - alpha) < 0.01
    );
  });
}

async function computed(locator: Locator, property: string): Promise<string> {
  return locator.evaluate(
    (el, p) => getComputedStyle(el).getPropertyValue(p),
    property,
  );
}

/** Fetches a page's prerendered HTML and loads it with scripts off. */
async function rawPage(
  browser: Browser,
  request: APIRequestContext,
  path: string,
): Promise<{ raw: Page; html: string; close: () => Promise<void> }> {
  const response = await request.get(path);
  expect(response.status()).toBe(200);
  const html = await response.text();
  const context = await browser.newContext({ javaScriptEnabled: false });
  const raw = await context.newPage();
  await raw.setContent(html);
  return { raw, html, close: () => context.close() };
}

const PAGE = "/items/code-block/";
const python = (page: Page) =>
  page.getByTestId("keyboard-fixture").locator('[data-slot="code-block"]');

test.describe("the code block", () => {
  test("C1. the server path: the raw HTML holds class-per-token spans, 0 style attributes in any block, and references 0 shiki chunks", async ({
    browser,
    request,
  }) => {
    const { raw, html, close } = await rawPage(browser, request, PAGE);
    const snippet = raw.getByTestId("install-snippet");
    const classes = await snippet
      .locator(
        '[data-slot="code-block-line-content"] > span[class*="text-code-"]',
      )
      .evaluateAll((all) => all.map((s) => s.getAttribute("class") ?? ""));
    expect(classes.length).toBeGreaterThan(0);
    for (const cls of classes) expect(cls).toMatch(/\btext-code-[a-z-]+\b/);
    // A foreground token carries no class at all.
    const bare = await snippet
      .locator('[data-slot="code-block-line-content"] > span:not([class])')
      .count();
    expect(bare).toBeGreaterThan(0);
    // 0 style attributes on or inside any code block.
    expect(
      await raw
        .locator(
          '[data-slot="code-block"] [style], [data-slot="code-block"][style]',
        )
        .count(),
    ).toBe(0);
    // No script the page references is Shiki: no chunk name says so, and no
    // referenced module holds Shiki core's `codeToHtml` (a property name the
    // minifier keeps, which our own wrapper never calls; the wrapper's
    // `codeToTokens` call is in the page's bundle, Shiki's definition is not).
    const urls = [
      ...new Set(
        [...html.matchAll(/\/_app\/immutable\/[^"'\s)]+\.js/g)].map(
          (m) => m[0],
        ),
      ),
    ];
    expect(urls.length).toBeGreaterThan(0);
    for (const url of urls) {
      expect(url).not.toMatch(/shiki|highlighter|shellscript|python/i);
      const js = await (await request.get(url)).text();
      expect(js, `${url} holds no Shiki`).not.toContain("codeToHtml");
    }
    await close();
  });

  test("C2. the palette in the browser: 4 of 4 slot colours, the function weight, the muted ground, and no class on =", async ({
    page,
  }) => {
    await open(page, PAGE);
    const block = python(page);
    const pairs: [cls: string, token: string][] = [
      ["text-code-keyword", "--primary"],
      ["text-code-string", "--success"],
      ["text-code-comment", "--muted-foreground"],
      ["text-code-function", "--foreground"],
    ];
    for (const [cls, token] of pairs) {
      const span = block.locator(`span.${cls}`).first();
      await expect(span, cls).toHaveCount(1);
      expect(await computed(span, "color"), cls).toBe(
        hexToRgb(await cssVar(page, token)),
      );
    }
    expect(
      await computed(
        block.locator("span.text-code-function").first(),
        "font-weight",
      ),
    ).toBe("500");
    // The checkpoint's call: a string's quotes take the string colour, so the
    // quoted literal is one span, quotes included (Shiki merges tokens of one
    // style). The puzzle string is the block's second line.
    const quoted = block.locator("span.text-code-string", {
      hasText: /^"530070000/,
    });
    await expect(quoted).toHaveCount(1);
    expect(await quoted.textContent()).toMatch(/^"\d+"$/);
    for (const text of await block
      .locator("span.text-code-string")
      .allTextContents())
      expect(text, "a string span holds its own quotes").toMatch(
        /^(["']).*\1$|^[^"']/,
      );
    const bareQuotes = block.locator(
      '[data-slot="code-block-line-content"] > span:not([class])',
      { hasText: /^["']$/ },
    );
    expect(await bareQuotes.count()).toBe(0);
    // The pre's ground: the nearest painted background behind it, which is
    // the block's root (the pre itself is transparent).
    const pre = block.locator('[data-slot="code-block-content"]');
    const ground = await pre.evaluate((el) => {
      for (let node: Element | null = el; node; node = node.parentElement) {
        const bg = getComputedStyle(node).backgroundColor;
        if (!/rgba\(0, 0, 0, 0\)|transparent/.test(bg))
          return [node.getAttribute("data-slot"), bg];
      }
      return [null, "none"];
    });
    expect(ground).toEqual([
      "code-block",
      hexToRgb(await cssVar(page, "--muted")),
    ]);
    // An assignment's `=` is a foreground token. Shiki merges neighbouring
    // tokens of one style, so it sits inside a classless span with the name
    // beside it (`puzzle = `), never in a span of its own with a class.
    const operators = block.locator(
      '[data-slot="code-block-line-content"] > span',
      { hasText: /(^|[^!=<>])=([^=]|$)/ },
    );
    expect(await operators.count()).toBeGreaterThan(0);
    for (const cls of await operators.evaluateAll((all) =>
      all.map((s) => s.getAttribute("class") ?? ""),
    ))
      expect(cls).not.toContain("text-code-");
  });

  test.describe("at 1280", () => {
    test.use({ viewport: { width: 1280, height: 900 } });

    test("C3. the chrome: the pre's stop, scrollbar and overflow; the ring on the root, unclipped; the groove; 3 of 3 emphasised lines", async ({
      page,
    }) => {
      await open(page, PAGE);
      const block = python(page);
      const pre = block.locator('[data-slot="code-block-content"]');
      await expect(pre).toHaveAttribute("tabindex", "0");
      expect(await computed(pre, "scrollbar-width")).toBe("thin");
      const scroll = await pre.evaluate((el) => [
        el.scrollWidth,
        el.clientWidth,
      ]);
      expect(
        scroll[0],
        `scrollWidth ${scroll[0]} > clientWidth ${scroll[1]}`,
      ).toBeGreaterThan(scroll[1]);

      await pre.focus();
      const ring = hexToRgb(await cssVar(page, "--ring"));
      const root = await block.evaluate((el) => {
        const s = getComputedStyle(el);
        return [s.outlineStyle, s.outlineWidth, s.outlineColor];
      });
      expect(root).toEqual(["solid", "2px", ring]);
      expect(await computed(pre, "outline-style")).toBe("none");
      const clipped = await block.evaluate((el) => {
        const r = el.getBoundingClientRect();
        const grown = {
          left: r.left - 4,
          right: r.right + 4,
          top: r.top - 4,
          bottom: r.bottom + 4,
        };
        const main = document.querySelector("main");
        for (let a = el.parentElement; a && a !== main; a = a.parentElement) {
          const s = getComputedStyle(a);
          if (
            ![s.overflowX, s.overflowY].some(
              (o) => o === "hidden" || o === "clip",
            )
          )
            continue;
          const b = a.getBoundingClientRect();
          const fits =
            grown.left >= b.left - 0.5 &&
            grown.right <= b.right + 0.5 &&
            grown.top >= b.top - 0.5 &&
            grown.bottom <= b.bottom + 0.5;
          if (!fits)
            return `${a.getAttribute("data-slot") ?? a.tagName} clips it`;
        }
        return null;
      });
      expect(clipped).toBeNull();

      // The groove between the header and the code.
      await expect(
        block.locator('[data-slot="code-block-header"]'),
      ).toHaveCount(1);
      expect(await computed(pre, "border-top-width")).toBe("1px");
      expect(
        holdsColour(
          await computed(pre, "border-top-color"),
          await cssVar(page, "--groove-line"),
        ),
      ).toBe(true);

      // The three emphasised lines: the opaque card step and a 2 px marker.
      const card = hexToRgb(await cssVar(page, "--card"));
      for (const [variant, token] of [
        ["highlighted", "--primary"],
        ["added", "--success"],
        ["removed", "--destructive"],
      ] as const) {
        const line = page
          .locator(`[data-slot="code-block-line"][data-variant="${variant}"]`)
          .first();
        await expect(line, variant).toHaveCount(1);
        expect(await computed(line, "background-color"), variant).toBe(card);
        expect(await computed(line, "border-left-width"), variant).toBe("2px");
        expect(await computed(line, "border-left-color"), variant).toBe(
          hexToRgb(await cssVar(page, token)),
        );
      }
      const minus = await page
        .locator('[data-slot="code-block-line"][data-variant="removed"]')
        .first()
        .evaluate((el) => getComputedStyle(el, "::after").content);
      expect(minus).toBe('"−"');
    });
  });

  test.describe("with the clipboard granted", () => {
    test.use({ permissions: ["clipboard-read", "clipboard-write"] });

    test("C4. the copy button: its name and size; Enter writes the code, says Copied, and resets after 2 s", async ({
      page,
    }) => {
      await open(page, PAGE);
      const block = python(page);
      // Located by its slot: its name changes on success.
      const button = block.locator('[data-slot="code-block-copy-button"]');
      await expect(button).toHaveCount(1);
      await expect(button).toHaveAccessibleName("Copy code");
      const box = await button.boundingBox();
      expect(
        box &&
          Math.abs(box.width - 32) <= 0.5 &&
          Math.abs(box.height - 32) <= 0.5,
        `${box?.width} × ${box?.height}`,
      ).toBe(true);
      // The code as the block shows it: one text per line, joined by newlines
      // (the lines are blocks, so the pre's textContent runs them together).
      const code = await block
        .locator('[data-slot="code-block-line-content"]')
        .evaluateAll((lines) =>
          lines.map((l) => (l.textContent ?? "").replace(/\n$/, "")).join("\n"),
        );
      await button.focus();
      await page.keyboard.press("Enter");
      await expect(button).toHaveAccessibleName("Copied");
      await expect(block.getByRole("status")).toHaveText("Copied");
      const clipboard = await page.evaluate(() =>
        navigator.clipboard.readText(),
      );
      expect(clipboard.split("\n")).toHaveLength(25);
      expect(clipboard).toBe(code);
      await expect(button).toHaveAccessibleName("Copy code", { timeout: 3000 });
    });
  });
});

/** 004 decision 9: the editor. */
const EDITOR_PAGE = "/items/code-editor/";

/** The grown-by-4-px clip check of 003 check 27, on an element. */
async function unclipped(locator: Locator): Promise<string | null> {
  return locator.evaluate((el) => {
    const r = el.getBoundingClientRect();
    const grown = {
      left: r.left - 4,
      right: r.right + 4,
      top: r.top - 4,
      bottom: r.bottom + 4,
    };
    const main = document.querySelector("main");
    for (let a = el.parentElement; a && a !== main; a = a.parentElement) {
      const s = getComputedStyle(a);
      if (
        ![s.overflowX, s.overflowY].some((o) => o === "hidden" || o === "clip")
      )
        continue;
      const b = a.getBoundingClientRect();
      const fits =
        grown.left >= b.left - 0.5 &&
        grown.right <= b.right + 0.5 &&
        grown.top >= b.top - 0.5 &&
        grown.bottom <= b.bottom + 0.5;
      if (!fits) return `${a.getAttribute("data-slot") ?? a.tagName} clips it`;
    }
    return null;
  });
}

test.describe("the code editor", () => {
  const editors = (page: Page) => page.locator(".cm-editor");
  const main = (page: Page) =>
    page.getByTestId("editor-main").locator(".cm-editor");
  const content = (page: Page) => main(page).locator(".cm-content");

  test("E1. prerendered: the raw HTML holds the fallback pre, a named group, with the example's first line and 0 editors; hydrated, 0 fallbacks and 4 editors", async ({
    browser,
    request,
    page,
  }) => {
    const { raw, close } = await rawPage(browser, request, EDITOR_PAGE);
    const fallbacks = raw.locator('pre[data-slot="code-editor-fallback"]');
    expect(await fallbacks.count()).toBeGreaterThanOrEqual(1);
    const first = fallbacks.first();
    // A bare pre may not carry a name; a group may, so the role goes with it.
    await expect(first).toHaveAttribute("role", "group");
    await expect(first).toHaveAttribute("aria-label", "Python example");
    expect(((await first.textContent()) ?? "").split("\n")[0]).toBe(
      "# Estimate pi by throwing darts at a square.",
    );
    expect(await raw.locator(".cm-editor").count()).toBe(0);
    await close();

    await open(page, EDITOR_PAGE);
    await expect(editors(page)).toHaveCount(4);
    await expect(
      page.locator('pre[data-slot="code-editor-fallback"]'),
    ).toHaveCount(0);
  });

  test("E2. name, role, value: 3 of 3 attribute sets", async ({ page }) => {
    await open(page, EDITOR_PAGE);
    const c = content(page);
    await expect(c).toHaveAttribute("role", "textbox");
    await expect(c).toHaveAttribute("aria-multiline", "true");
    await expect(c).toHaveAttribute("tabindex", "0");
    await expect(c).toHaveAttribute("aria-label", "Python example");
    const hintId = await c.getAttribute("aria-describedby");
    expect(hintId).toBeTruthy();
    const hint = page.locator(`[id="${hintId}"]`);
    await expect(hint).toBeVisible();
    await expect(hint).toHaveText(
      "Ctrl Enter runs the example. Tab leaves the editor.",
    );
    await expect(c).toHaveAccessibleDescription(
      "Ctrl Enter runs the example. Tab leaves the editor.",
    );
    const readonly = page.getByTestId("editor-readonly").locator(".cm-content");
    await expect(readonly).toHaveAttribute("aria-readonly", "true");
    await expect(readonly).toHaveAttribute("contenteditable", "true");
    await expect(readonly).toHaveAttribute("tabindex", "0");
    const disabled = page.getByTestId("editor-disabled").locator(".cm-content");
    await expect(disabled).toHaveAttribute("contenteditable", "false");
  });

  test("E3. the theme from tokens: the ring on the editor, unclipped; 5 of 5 computed values; the keyword; 12 rules of ours in the emitted sheet, 0 literals", async ({
    page,
  }) => {
    await open(page, EDITOR_PAGE);
    const editor = main(page);
    await content(page).focus();
    await expect(editor).toHaveClass(/cm-focused/);
    const ring = hexToRgb(await cssVar(page, "--ring"));
    const outline = await editor.evaluate((el) => {
      const s = getComputedStyle(el);
      return [s.outlineStyle, s.outlineWidth, s.outlineColor, s.outlineOffset];
    });
    expect(outline).toEqual(["solid", "2px", ring, "2px"]);
    expect(await computed(content(page), "outline-style")).toBe("none");
    expect(await unclipped(editor)).toBeNull();
    // The root has no overflow-hidden.
    const root = page
      .getByTestId("editor-main")
      .locator('[data-slot="code-editor"]');
    expect(await computed(root, "overflow-x")).toBe("visible");

    expect(await computed(editor, "background-color")).toBe(
      hexToRgb(await cssVar(page, "--muted")),
    );
    expect(await computed(editor.locator(".cm-gutters"), "color")).toBe(
      hexToRgb(await cssVar(page, "--muted-foreground")),
    );
    expect(
      await computed(
        editor.locator(".cm-activeLine").first(),
        "background-color",
      ),
    ).toBe(hexToRgb(await cssVar(page, "--card")));
    const scroller = editor.locator(".cm-scroller");
    expect(await computed(scroller, "font-family")).toContain("JetBrains Mono");
    expect(await computed(scroller, "font-size")).toBe("13.5px");
    expect(await computed(scroller, "font-variant-ligatures")).toBe("none");
    expect(await computed(scroller, "scrollbar-width")).toBe("thin");
    // A keyword, by its highlight class: the one whose colour is --code-keyword.
    const keyword = editor
      .locator(".cm-line span", { hasText: /^import$/ })
      .first();
    await expect(keyword).toHaveCount(1);
    expect(await computed(keyword, "color")).toBe(
      hexToRgb(await cssVar(page, "--primary")),
    );
    const fn = editor.locator(".cm-line span", { hasText: /^print$/ }).first();
    await expect(fn).toHaveCount(1);
    expect(await computed(fn, "font-weight")).toBe("500");

    // Our theme's rules, by the theme's own class: CodeMirror gives each theme
    // a `ͼ` class on .cm-editor, and ours is the one whose rules read
    // `--code-`. Every rule under that class is read, var() or not, and none
    // holds a hex colour or a px length. The base theme's literals sit under
    // its own classes. The count is the theme's: codeTheme defines 12 rules.
    const ours = await editor.evaluate((el) => {
      const rules = [...document.styleSheets]
        .flatMap((sheet) => {
          try {
            return [...sheet.cssRules];
          } catch {
            return [];
          }
        })
        .map((rule) => rule.cssText);
      const byClass = [...el.classList]
        .filter((c) => c.startsWith("ͼ"))
        .map((c) => ({
          cls: c,
          rules: rules.filter((text) =>
            new RegExp(`\\.${c}(?![0-9A-Za-z_-])`).test(text),
          ),
        }));
      const ours = byClass.filter(({ rules }) =>
        rules.some((text) => text.includes("var(--code-")),
      );
      return { classes: ours.map((o) => o.cls), rules: ours[0]?.rules ?? [] };
    });
    expect(ours.classes, "one theme class of ours").toHaveLength(1);
    expect(ours.rules).toHaveLength(12);
    for (const text of ours.rules) {
      expect(text, text).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
      expect(text, text).not.toMatch(/\b\d+(\.\d+)?px\b/);
    }
  });

  test("E4. editing and run: typing updates the bound value; Reset clears history; 2 of 2 run keys; readonly", async ({
    page,
  }) => {
    await open(page, EDITOR_PAGE);
    const c = content(page);
    const readout = page.getByTestId("bound-value");
    const runs = page.getByTestId("run-count");
    const lines = () => main(page).locator(".cm-line").count();
    const before = await lines();

    await c.focus();
    // To the document's end: Cmd-ArrowDown on a Mac, Ctrl-End elsewhere.
    await page.keyboard.press("Meta+ArrowDown");
    await page.keyboard.press("Control+End");
    await page.keyboard.press("End");
    await page.keyboard.type("\nx = 1");
    await expect(readout).toContainText("x = 1");
    expect(await lines()).toBe(before + 1);

    await page.getByRole("button", { name: "Reset" }).click();
    await expect(readout).not.toContainText("x = 1");
    expect(await lines()).toBe(before);
    await c.focus();
    await page.keyboard.press("Meta+z");
    await page.keyboard.press("Control+z");
    expect(await lines()).toBe(before);
    await expect(readout).not.toContainText("x = 1");

    await expect(runs).toHaveText(/Ran 0 times/);
    await page.keyboard.press("Control+Enter");
    await expect(runs).toHaveText(/Ran 1 time\b/);
    await page.keyboard.press("Meta+Enter");
    await expect(runs).toHaveText(/Ran 2 times/);
    expect(await lines()).toBe(before);
    await page.getByRole("button", { name: "Run" }).click();
    await expect(runs).toHaveText(/Ran 3 times/);

    const readonly = page.getByTestId("editor-readonly").locator(".cm-content");
    const text = await readonly.textContent();
    await readonly.focus();
    await page.keyboard.type("zzz");
    expect(await readonly.textContent()).toBe(text);
  });

  // The caret is the browser's own (no drawSelection), so CodeMirror draws no
  // cursor layer and runs no animation at all: 0 animated elements in a
  // focused editor, and under reduced motion 0 infinite iteration counts.
  test.describe("motion", () => {
    test("a focused editor runs 0 animations and holds no cursor layer", async ({
      page,
    }) => {
      await open(page, EDITOR_PAGE);
      await content(page).focus();
      await expect(main(page)).toHaveClass(/cm-focused/);
      await expect(main(page).locator(".cm-cursorLayer")).toHaveCount(0);
      expect(
        await main(page).evaluate(
          (el) =>
            document.getAnimations().filter((a) => {
              const target = (a.effect as KeyframeEffect | null)?.target;
              return target instanceof Element && el.contains(target);
            }).length,
        ),
      ).toBe(0);
    });

    test.describe("under prefers-reduced-motion: reduce", () => {
      test.use({ reducedMotion: "reduce" });
      test("0 elements in the editor compute an infinite iteration count", async ({
        page,
      }) => {
        await open(page, EDITOR_PAGE);
        await content(page).focus();
        await expect(main(page)).toHaveClass(/cm-focused/);
        expect(
          await main(page).evaluate(
            (el) =>
              [el, ...el.querySelectorAll("*")].filter(
                (node) =>
                  getComputedStyle(node).animationIterationCount === "infinite",
              ).length,
          ),
        ).toBe(0);
      });
    });
  });
});

/** 004 decision 11: the popover (P1, 002 decision 28's check). */
test.describe("the popover", () => {
  const PAGE = "/items/popover/";

  test("P1. elevation on a menu: 2 shadow layers, role dialog named by its title, 256 px wide, 0 border; 2 of 2 other popovers named", async ({
    page,
  }, info) => {
    await open(page, PAGE);
    await page.getByTestId("popover-fuel").click();
    const dialog = page.locator('[data-slot="popover-content"]');
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute("role", "dialog");
    const titleId = await dialog.getAttribute("aria-labelledby");
    expect(titleId).toBeTruthy();
    const title = page.locator(`[id="${titleId}"]`);
    await expect(title).toHaveText("Fuel");
    expect(await title.evaluate((el) => el.tagName.toLowerCase())).toMatch(
      /^h[1-6]$/,
    );
    await expect(dialog).toHaveAccessibleName("Fuel");
    expect(
      await dialog.evaluate((el) => el.getBoundingClientRect().width),
    ).toBe(256);
    expect(await computed(dialog, "border-top-width")).toBe("0px");
    await settled(page);
    const shadow = await computed(dialog, "box-shadow");
    // Tailwind composes shadow-elevation with four empty layers (inset, ring);
    // a layer with no geometry is not a layer drawn.
    const layers = shadow
      .split(/,(?![^(]*\))/)
      .map((l) => l.trim())
      .filter((l) => !/\) 0px 0px 0px 0px$/.test(l));
    expect(layers).toHaveLength(2);
    const line = await cssVar(page, "--elevation-line");
    expect(holdsColour(layers[0], line), `first layer ${layers[0]}`).toBe(true);
    expect(layers[0]).toMatch(/\b0px 0px 0px 1px$/);
    expect(layers[1]).toMatch(/\b0px 12px 32px 0px$/);
    if (info.project.name === "light") {
      expect(
        holdsColour(layers[1], await cssVar(page, "--elevation-shadow")),
        `second layer ${layers[1]}`,
      ).toBe(true);
    } else {
      expect(layers[1]).toMatch(/rgba\(\d+, \d+, \d+, 0\)/);
    }
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);

    for (const id of ["popover-form", "popover-start"]) {
      await page.getByTestId(id).click();
      const other = page.locator('[data-slot="popover-content"]');
      await expect(other).toBeVisible();
      await expect(other).toHaveAttribute("role", "dialog");
      expect(await other.getAttribute("aria-label")).toMatch(/\S/);
      expect(await other.getAttribute("aria-labelledby")).toBeNull();
      await page.keyboard.press("Escape");
      await expect(other).toHaveCount(0);
    }
  });
});

/** 004 decision 12: the accordion (A1). */
test.describe("the accordion", () => {
  test("A1. wiring: 3 of 3 triggers control a region labelled by them, level 3; the open caret turns; grooves on items 2 and 3", async ({
    page,
  }) => {
    await open(page, "/items/accordion/");
    const fixture = page.getByTestId("keyboard-fixture");
    const items = fixture.locator('[data-slot="accordion-item"]');
    await expect(items).toHaveCount(3);
    const triggers = fixture.locator('[data-slot="accordion-trigger"]');
    await expect(triggers).toHaveCount(3);
    for (let i = 0; i < 3; i++) {
      const trigger = triggers.nth(i);
      const triggerId = await trigger.getAttribute("id");
      const controls = await trigger.getAttribute("aria-controls");
      expect(triggerId).toBeTruthy();
      expect(controls).toBeTruthy();
      const region = page.locator(`[id="${controls}"]`);
      await expect(region).toHaveCount(1);
      await expect(region).toHaveAttribute("role", "region");
      await expect(region).toHaveAttribute("aria-labelledby", triggerId!);
      await expect(region).toHaveAttribute("data-slot", "accordion-content");
      const heading = trigger.locator("xpath=..");
      await expect(heading).toHaveAttribute("role", "heading");
      await expect(heading).toHaveAttribute("aria-level", "3");
      const expanded = (await trigger.getAttribute("aria-expanded")) === "true";
      expect(expanded).toBe(i === 0);
      const caret = trigger.locator("svg");
      await expect(caret).toHaveCount(1);
      await expect(caret).toHaveAttribute("aria-hidden", "true");
      // Tailwind 4's rotate-90 sets the rotate property, not transform.
      const rotate = await computed(caret, "rotate");
      if (expanded) expect(rotate).toBe("90deg");
      else expect(rotate).toBe("none");
      const item = items.nth(i);
      const borderTop = await computed(item, "border-top-width");
      if (i === 0) expect(borderTop).toBe("0px");
      else {
        expect(borderTop).toBe("1px");
        expect(
          holdsColour(
            await computed(item, "border-top-color"),
            await cssVar(page, "--groove-line"),
          ),
        ).toBe(true);
      }
      expect(await computed(item, "background-color")).toBe("rgba(0, 0, 0, 0)");
    }
  });
});

/** 004 decision 13: the toggles (T1). */
test.describe("the toggles", () => {
  test("T1. pressed state: a pressed toggle and the checked group item are inverted; an unpressed toggle is transparent; the group's role is group", async ({
    page,
  }) => {
    const foreground = () => cssVar(page, "--foreground").then(hexToRgb);
    const background = () => cssVar(page, "--background").then(hexToRgb);

    await open(page, "/items/toggle/");
    const pressed = page.getByTestId("toggle-pressed");
    await expect(pressed).toHaveAttribute("data-state", "on");
    await expect(pressed).toHaveAttribute("aria-pressed", "true");
    expect(await computed(pressed, "background-color")).toBe(
      await foreground(),
    );
    expect(await computed(pressed, "color")).toBe(await background());
    const unpressed = page.getByTestId("toggle-unpressed");
    await expect(unpressed).toHaveAttribute("data-state", "off");
    await expect(unpressed).toHaveAttribute("aria-pressed", "false");
    expect(await computed(unpressed, "background-color")).toBe(
      "rgba(0, 0, 0, 0)",
    );

    await open(page, "/items/toggle-group/");
    const group = page.getByTestId("toggle-group-single");
    await expect(group).toHaveAttribute("role", "group");
    const checked = group.locator('[data-state="on"]');
    await expect(checked).toHaveCount(1);
    await expect(checked).toHaveAttribute("aria-checked", "true");
    await expect(checked).toHaveAttribute("role", "radio");
    expect(await checked.getAttribute("aria-pressed")).toBeNull();
    expect(await computed(checked, "background-color")).toBe(
      await foreground(),
    );
    expect(await computed(checked, "color")).toBe(await background());
    const unchecked = group.locator('[data-state="off"]').first();
    expect(await computed(unchecked, "background-color")).toBe(
      "rgba(0, 0, 0, 0)",
    );
  });
});

/** 004 decision 10: the chart (H1). */
test.describe("the chart", () => {
  const PAGE = "/items/chart/";

  test("H1. raw: 2 figures labelled by their captions, 0 svg figures, 2 tables in details; hydrated: a figure svg each, fill and stroke from the chart tokens, stroke-width 0, 0 style attributes on chart slots, the tooltip's shadow, the muted hover band", async ({
    browser,
    request,
    page,
  }) => {
    const { raw, close } = await rawPage(browser, request, PAGE);
    const figures = raw.locator('figure[data-slot="chart"]');
    expect(await figures.count()).toBe(2);
    for (let i = 0; i < 2; i++) {
      const figure = figures.nth(i);
      const labelledBy = await figure.getAttribute("aria-labelledby");
      expect(labelledBy).toBeTruthy();
      const caption = figure.locator(`figcaption[id="${labelledBy}"]`);
      await expect(caption).toHaveCount(1);
      expect((await caption.textContent())?.trim()).toMatch(/\S/);
      await expect(figure.locator("details table")).toHaveCount(1);
    }
    expect(await raw.locator('svg[role="figure"]').count()).toBe(0);
    expect(await raw.locator("details table").count()).toBe(2);
    await close();

    await open(page, PAGE);
    const hydrated = page.locator('figure[data-slot="chart"]');
    await expect(hydrated).toHaveCount(2);
    for (let i = 0; i < 2; i++)
      await expect(
        hydrated.nth(i).locator('svg[role="figure"]').first(),
        `figure ${i + 1} draws`,
      ).toBeAttached();
    const bars = page.getByTestId("chart-bars");
    const rect = bars.locator("svg rect.lc-bar").first();
    await expect(rect).toBeAttached();
    expect(await computed(rect, "fill")).toBe(
      hexToRgb(await cssVar(page, "--chart-1")),
    );
    expect(await computed(rect, "stroke-width")).toBe("0px");
    const line = page
      .getByTestId("chart-two-series")
      .locator("svg path.lc-spline-path, svg path.lc-path")
      .first();
    await expect(line).toBeAttached();
    expect(await computed(line, "stroke")).toBe(
      hexToRgb(await cssVar(page, "--chart-2")),
    );
    expect(await page.locator('[data-slot^="chart"][style]').count()).toBe(0);

    // The tooltip: a pointer affordance, so a raw mouse move over a bar.
    await rect.scrollIntoViewIfNeeded();
    const box = await rect.boundingBox();
    expect(box).not.toBeNull();
    // layerchart listens for pointer movement over its hit layer, so the
    // pointer arrives in steps, as a hand would.
    await page.mouse.move(box!.x - 40, box!.y + box!.height / 2);
    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2, {
      steps: 8,
    });
    const panel = page.locator('[data-slot="chart-tooltip"]');
    await expect(panel).toBeVisible();
    // The hover band is the opaque muted inset, not layerchart's 5% tint:
    // an rgb() with no alpha channel is alpha 1.
    const band = bars.locator("svg rect.lc-highlight-area").first();
    await expect(band).toBeAttached();
    expect(await computed(band, "fill")).toBe(
      hexToRgb(await cssVar(page, "--muted")),
    );
    expect(
      holdsColour(
        await computed(panel, "box-shadow"),
        await cssVar(page, "--elevation-line"),
      ),
    ).toBe(true);
    expect(await panel.locator("[style]").count()).toBe(0);
  });
});

/** 004 decision 14: the meter (M1). */
test.describe("the meter", () => {
  const PAGE = "/items/meter/";

  /** The colour of one pixel of an element, at a fraction of its width and half its height. */
  async function pixel(page: Page, locator: Locator, fraction: number) {
    const png = (await locator.screenshot()).toString("base64");
    return page.evaluate(
      async ([data, f]) => {
        const img = new Image();
        img.src = `data:image/png;base64,${data}`;
        await img.decode();
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);
        const x = Math.round(img.naturalWidth * (f as number));
        const y = Math.round(img.naturalHeight / 2);
        const [r, g, b] = ctx.getImageData(x, y, 1, 1).data;
        return `rgb(${r}, ${g}, ${b})`;
      },
      [png, fraction] as const,
    );
  }

  test("M1. the fuel meter: name, value, max and valuetext; appearance none on the muted track, 8 px tall; a primary pixel at 8% and a muted one at 50%; the text beside it", async ({
    page,
  }) => {
    await open(page, PAGE);
    const meter = page.getByTestId("fuel-meter").locator("meter");
    await expect(meter).toHaveCount(1);
    await expect(meter).toHaveAccessibleName("Fuel");
    await expect(meter).toHaveAttribute("data-slot", "meter");
    await expect(meter).toHaveAttribute("value", "4.81");
    await expect(meter).toHaveAttribute("max", "30");
    await expect(meter).toHaveAttribute(
      "aria-valuetext",
      "4.81 billion instructions of 30 billion",
    );
    expect(await computed(meter, "appearance")).toBe("none");
    const muted = hexToRgb(await cssVar(page, "--muted"));
    const primary = hexToRgb(await cssVar(page, "--primary"));
    expect(await computed(meter, "background-color")).toBe(muted);
    const box = await meter.boundingBox();
    expect(box && Math.abs(box.height - 8) <= 0.5, `${box?.height}`).toBe(true);
    expect(await pixel(page, meter, 0.08)).toBe(primary);
    expect(await pixel(page, meter, 0.5)).toBe(muted);
    await expect(page.getByTestId("fuel-meter")).toContainText("of 30 billion");
  });
});
