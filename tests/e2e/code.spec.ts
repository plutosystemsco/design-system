/**
 * 004 decision 17, browser file 6: the code block (C1 to C4), the editor (E1
 * to E4 and its motion), the chart (H1), the meter (M1), the popover (P1),
 * the accordion (A1) and the toggles (T1). Runs in both projects, light and
 * dark.
 */
import type {
  APIRequestContext,
  Browser,
  Locator,
  Page,
} from "@playwright/test";
import { expect, test } from "../test.ts";
import { scheme } from "./scheme.ts";
import {
  cssVar,
  hexToRgb,
  open,
  openView,
  settled,
  componentPath,
} from "./pages.ts";

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

/** A custom property resolved as a colour, by a probe element on the page. */
async function resolvedColour(page: Page, name: string): Promise<string> {
  return page.evaluate((n) => {
    const probe = document.createElement("span");
    probe.style.color = `var(${n})`;
    document.body.append(probe);
    const colour = getComputedStyle(probe).color;
    probe.remove();
    return colour;
  }, name);
}

async function computed(locator: Locator, property: string): Promise<string> {
  return locator.evaluate(
    (el, p) => getComputedStyle(el).getPropertyValue(p),
    property,
  );
}

/**
 * 014 decision 4: a 1 px hairline on 4 of 4 sides, in the `--border` the
 * element itself computes (an ink surface sets the dark theme's).
 */
async function expectHairline(locator: Locator, what: string): Promise<void> {
  const sides = await locator.evaluate((el) => {
    const s = getComputedStyle(el);
    return {
      border: s.getPropertyValue("--border").trim(),
      sides: (["top", "right", "bottom", "left"] as const).map((side) => [
        s.getPropertyValue(`border-${side}-style`),
        s.getPropertyValue(`border-${side}-width`),
        s.getPropertyValue(`border-${side}-color`),
      ]),
    };
  });
  expect(sides.sides, what).toHaveLength(4);
  for (const [style, width, colour] of sides.sides) {
    expect(style, what).toBe("solid");
    expect(width, what).toBe("1px");
    expect(holdsColour(colour!, sides.border), `${what}: ${colour}`).toBe(true);
  }
}

/** 014 decision 1: the code ground and the active line, as Chromium computes them. */
const CODE_GROUND = {
  light: "rgb(255, 255, 255)",
  dark: "rgb(44, 40, 33)",
} as const;
const ACTIVE_LINE = {
  light: "rgb(243, 240, 232)",
  dark: "rgb(34, 31, 25)",
} as const;

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

const PAGE = componentPath("code-block");

const python = (page: Page) =>
  page.getByTestId("keyboard-fixture").locator('[data-slot="code-block"]');

test.describe("the code block", () => {
  test("C1. the server path: role-class spans, 0 style attributes and 0 font-medium in its blocks, every block settled, 0 tree-sitter, .wasm or Shiki assets and 0 modulepreload links to them", async ({
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
    // A body token carries no class at all.
    const bare = await snippet
      .locator('[data-slot="code-block-line-content"] > span:not([class])')
      .count();
    expect(bare).toBeGreaterThan(0);
    // 0 style attributes and 0 font-medium on or inside any code block.
    expect(
      await raw
        .locator(
          '[data-slot="code-block"] [style], [data-slot="code-block"][style]',
        )
        .count(),
    ).toBe(0);
    expect(
      await raw
        .locator('[data-slot="code-block-line-content"] .font-medium')
        .count(),
    ).toBe(0);
    // 013 decision 14: every block on the page is settled as rendered.
    const states = await raw
      .locator('[data-slot="code-block-content"]')
      .evaluateAll((all) => all.map((p) => p.getAttribute("data-highlight")));
    expect(states.length).toBeGreaterThan(0);
    expect(states.filter((s) => s !== "settled")).toEqual([]);
    // No asset the page references, and no module it preloads, is an engine.
    expect(html).not.toMatch(/\.wasm/);
    const preloads = [
      ...html.matchAll(/<link[^>]*rel="modulepreload"[^>]*href="([^"]+)"/g),
    ].map((m) => m[1]!);
    for (const href of preloads)
      expect(href).not.toMatch(/tree-sitter|shiki|wasm/i);
    const urls = [
      ...new Set(
        [...html.matchAll(/\/_app\/immutable\/[^"'\s)]+\.js/g)].map(
          (m) => m[0],
        ),
      ),
    ];
    expect(urls.length).toBeGreaterThan(0);
    for (const url of urls) {
      expect(url).not.toMatch(/shiki|tree-sitter|shellscript|python/i);
      const js = await (await request.get(url)).text();
      // Shiki core's `codeToHtml` and the runtime's `ts_parser_new` are names
      // the minifier keeps; our own wrappers never define either.
      expect(js, `${url} holds no Shiki`).not.toContain("codeToHtml");
      expect(js, `${url} holds no tree-sitter runtime`).not.toContain(
        "ts_parser_new",
      );
    }
    await close();
  });

  test("C1. the built client chunks hold 0 node: imports", async () => {
    const { readdirSync, readFileSync } = await import("node:fs");
    const dir = "build/_app/immutable";
    const files = readdirSync(dir, { recursive: true })
      .map(String)
      .filter((f) => f.endsWith(".js"));
    expect(files.length).toBeGreaterThan(0);
    // Minified code writes an import with no space (`}from"node:x"`,
    // `import("node:x")`); a code sample's text keeps its spaces. Vite's stub
    // for a Node built-in in the browser is named for it.
    const imports = /(?:\}from|\bimport\(|\brequire\()["'`]node:/;
    const found = files.filter((f) => {
      const js = readFileSync(`${dir}/${f}`, "utf8");
      return imports.test(js) || js.includes("__vite-browser-external");
    });
    expect(found).toEqual([]);
  });

  // 013 decision 20 and criterion 18: the sizes, gzipped at level 9, over the
  // site's built client (the browser suite's build).
  test("C6. sizes: the runtime's WASM and chunk at 125 kB or less; 20 of 20 grammar files within decision 3's figure + 5% and 320 kB; every query chunk at 6 kB or less", async () => {
    const { readdirSync, readFileSync } = await import("node:fs");
    const dir = "build/_app/immutable";
    const gz = (data: Buffer | string) =>
      Bun.gzipSync(
        new Uint8Array(typeof data === "string" ? Buffer.from(data) : data),
        { level: 9 },
      ).length / 1000;
    const FIGURE: Record<string, number> = {
      typescript: 133,
      tsx: 136,
      javascript: 49,
      python: 64,
      rust: 114,
      go: 38,
      java: 50,
      c_sharp: 315,
      ruby: 162,
      html: 7,
      css: 21,
      bash: 177,
      json: 2,
      yaml: 34,
      toml: 7,
      svelte: 13,
      c: 72,
      cpp: 274,
      php: 105,
      kotlin: 294,
    };
    const wasm = readdirSync(`${dir}/assets`).filter((f) =>
      f.endsWith(".wasm"),
    );
    expect(wasm).toHaveLength(21);
    const grammars = wasm.filter((f) => f.startsWith("tree-sitter-"));
    expect(grammars).toHaveLength(20);
    for (const file of grammars) {
      const name = /^tree-sitter-([a-z_]+)\./.exec(file)![1]!;
      const size = gz(readFileSync(`${dir}/assets/${file}`));
      // Decision 3's figures are whole kB, so the size is compared at that precision.
      expect(Math.round(size), file).toBeLessThanOrEqual(FIGURE[name]! * 1.05);
      expect(size, file).toBeLessThanOrEqual(320);
    }
    const chunks = readdirSync(`${dir}/chunks`).filter((f) =>
      f.endsWith(".js"),
    );
    const runtimeJs = chunks.filter((f) =>
      readFileSync(`${dir}/chunks/${f}`, "utf8").includes("ts_parser_new"),
    );
    expect(runtimeJs).toHaveLength(1);
    const runtime =
      gz(
        readFileSync(
          `${dir}/assets/${wasm.find((f) => f.startsWith("web-tree-sitter"))}`,
        ),
      ) + gz(readFileSync(`${dir}/chunks/${runtimeJs[0]}`, "utf8"));
    expect(runtime).toBeLessThanOrEqual(125);
    const queries = chunks.filter((f) =>
      readFileSync(`${dir}/chunks/${f}`, "utf8").includes(
        "written for the Kuiper Design System",
      ),
    );
    expect(queries).toHaveLength(24);
    for (const file of queries)
      expect(
        gz(readFileSync(`${dir}/chunks/${file}`, "utf8")),
        file,
      ).toBeLessThanOrEqual(6);
  });

  // 013 decision 21: seven roles on the sudoku example, the body in the
  // code's own ink, and no weight or slant anywhere.
  test("C2. the roles in the browser: 7 of 7 role colours, the body computes --code-text, every token weight 400 and upright, the code ground, and no class on =", async ({
    page,
  }) => {
    await open(page, PAGE);
    const block = python(page);
    const pairs: [cls: string, token: string][] = [
      ["text-code-keyword", "--code-keyword"],
      ["text-code-string", "--code-string"],
      ["text-code-number", "--code-number"],
      ["text-code-constant", "--code-constant"],
      ["text-code-function", "--code-function"],
      ["text-code-type", "--code-type"],
      ["text-code-comment", "--code-comment"],
    ];
    for (const [cls, token] of pairs) {
      const span = block.locator(`span.${cls}`).first();
      await expect(span, cls).toHaveCount(1);
      expect(await computed(span, "color"), cls).toBe(
        await resolvedColour(page, token),
      );
    }
    const body = block
      .locator('[data-slot="code-block-line-content"] > span:not([class])')
      .first();
    expect(await computed(body, "color")).toBe(
      await resolvedColour(page, "--code-text"),
    );
    for (const [weight, style] of await block
      .locator('[data-slot="code-block-line-content"] > span')
      .evaluateAll((all) =>
        all.map((s) => [
          getComputedStyle(s).fontWeight,
          getComputedStyle(s).fontStyle,
        ]),
      )) {
      expect(weight).toBe("400");
      expect(style).toBe("normal");
    }
    // The pre's ground: the nearest painted background behind it.
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
      hexToRgb(await cssVar(page, "--syntax-ground")),
    ]);
    // An assignment's `=` is a body token: it never carries a class.
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
      // 014 decision 5: the track is the code ground.
      expect(await computed(pre, "scrollbar-color")).toBe(
        `${hexToRgb(await cssVar(page, "--input"))} ${hexToRgb(await cssVar(page, "--syntax-ground"))}`,
      );
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

      // The three emphasised lines: the active line, one opaque step from
      // the code ground, and a 2 px marker (014 decision 2).
      const card = hexToRgb(await cssVar(page, "--syntax-active-line"));
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

/** 007 decision 10: S2, the highlighter page's gallery of twenty-six languages. */
test.describe("the gallery", () => {
  test("S2. 26 of 26 blocks, each with at least 2 distinct text-code-* classes (diff: 2 of inserted, deleted, comment), 0 style attributes, the 16-row role table", async ({
    page,
  }) => {
    await open(page, componentPath("highlighter"));
    const gallery = page.getByTestId("gallery");
    const blocks = gallery.locator('[data-slot="code-block"]');
    await expect(blocks).toHaveCount(26);
    const found = await blocks.evaluateAll((all) =>
      all.map((block) => ({
        language: block.getAttribute("data-language"),
        classes: [
          ...new Set(
            [...block.querySelectorAll("span[class*='text-code-']")].flatMap(
              (s) => [...s.classList].filter((c) => c.startsWith("text-code-")),
            ),
          ),
        ],
      })),
    );
    expect(new Set(found.map((f) => f.language)).size).toBe(26);
    for (const { language, classes } of found) {
      expect(
        classes.length,
        `${language}: ${classes.join(" ")}`,
      ).toBeGreaterThanOrEqual(2);
      if (language === "diff")
        expect(
          classes.filter((c) =>
            [
              "text-code-inserted",
              "text-code-deleted",
              "text-code-comment",
            ].includes(c),
          ).length,
        ).toBeGreaterThanOrEqual(2);
    }
    expect(await gallery.locator("[style]").count()).toBe(0);
    // 013 decision 12: the 16-row role table, 14 roles and the two grounds.
    await expect(
      page.getByTestId("role-table").locator("tbody tr"),
    ).toHaveCount(16);
  });
});

/** Each non-whitespace character of a block, with the role class its span carries. */
async function roleString(block: Locator): Promise<string> {
  return block.evaluate((root) => {
    const out: string[] = [];
    for (const line of root.querySelectorAll(
      '[data-slot="code-block-line-content"]',
    )) {
      const walk = (node: Node, cls: string) => {
        if (node.nodeType === Node.TEXT_NODE) {
          for (const ch of node.textContent ?? "")
            if (!/\s/.test(ch)) out.push(`${ch}${cls}`);
          return;
        }
        const el = node as Element;
        const own =
          [...(el.classList ?? [])].find((c) => c.startsWith("text-code-")) ??
          cls;
        for (const child of el.childNodes) walk(child, own);
      };
      walk(line, "");
      out.push("\n");
    }
    return out.join("|");
  });
}

/** 013 decision 21: prerender against the browser, on the agreement view. */
test.describe("prerender agrees with the browser", () => {
  const VIEW = "/view/code-agreement/";

  test("C5. every gallery sample's live copy settles with the prerendered copy's role on every non-whitespace character", async ({
    page,
  }) => {
    await openView(page, VIEW);
    const live = page.locator(
      '[data-copy="live"] [data-slot="code-block-content"]',
    );
    await expect(live).toHaveCount(26);
    await expect(page.locator('[data-highlight="pending"]')).toHaveCount(0, {
      timeout: 30_000,
    });
    const samples = page.locator("[data-sample]");
    const shown = 26;
    let compared = 0;
    for (const sample of await samples.all()) {
      const language = await sample.getAttribute("data-sample");
      const before = await roleString(
        sample.locator('[data-copy="prerendered"]'),
      );
      const after = await roleString(sample.locator('[data-copy="live"]'));
      expect(after, language!).toBe(before);
      expect(before, `${language} is highlighted`).toContain("text-code-");
      compared++;
    }
    expect(compared).toBe(shown);
  });

  test("C5. the late grammar: with Python's grammar held back, the Markdown copy is pending with its fence plain, then settles to the prerendered classes", async ({
    page,
  }) => {
    let release!: () => void;
    const held = new Promise<void>((resolve) => (release = resolve));
    await page.route(/tree-sitter-python[^/]*\.wasm/, async (route) => {
      await held;
      await route.continue();
    });
    await openView(page, VIEW);
    const sample = page.locator('[data-sample="markdown"]');
    const copy = sample.locator(
      '[data-copy="live"] [data-slot="code-block-content"]',
    );
    await expect(copy).toHaveAttribute("data-highlight", "pending", {
      timeout: 30_000,
    });
    const fence = sample
      .locator('[data-copy="live"] [data-slot="code-block-line"]')
      .filter({ hasText: "print(run.fuel)" });
    expect(await fence.locator('span[class*="text-code-"]').count()).toBe(0);
    release();
    await expect(copy).toHaveAttribute("data-highlight", "settled", {
      timeout: 30_000,
    });
    expect(await roleString(sample.locator('[data-copy="live"]'))).toBe(
      await roleString(sample.locator('[data-copy="prerendered"]')),
    );
    expect(
      await fence.locator('span[class*="text-code-"]').count(),
    ).toBeGreaterThan(0);
  });
});

/** 007 decision 10: L1, the twenty-six languages in the editor. */
test.describe("the languages", () => {
  const PAGE = componentPath("code-languages");

  test("L1. 26 of 26 languages load in the editor with at least 2 role colours besides the body's (diff: inserted and deleted); in HTML, typing <div> inserts </div>", async ({
    page,
  }) => {
    test.setTimeout(120_000);
    await open(page, PAGE);
    const fixture = page.getByTestId("keyboard-fixture");
    const select = fixture.locator("select");
    const content = fixture.locator(".cm-content");
    const body = await resolvedColour(page, "--code-text");
    const inserted = await resolvedColour(page, "--code-inserted");
    const deleted = await resolvedColour(page, "--code-deleted");
    const ids = await select
      .locator("option")
      .evaluateAll((all) => all.map((o) => (o as HTMLOptionElement).value));
    expect(ids).toHaveLength(26);
    const { CODE_SAMPLES } =
      await import("../../src/lib/preview/code-samples.ts");
    const sampleOf = (id: string) =>
      CODE_SAMPLES.find((s) => s.language === id)!;
    for (const id of ids) {
      const sample = sampleOf(id);
      await select.selectOption(id);
      await expect(fixture.getByTestId("language-loaded")).toHaveText(
        `${sample.title} loaded`,
      );
      const firstLine = sample.code.split("\n")[0];
      await expect(content.locator(".cm-line").first()).toHaveText(firstLine);
      // The distinct computed token colours other than the body's. The
      // highlighter parses on a timer, so the reading is polled.
      const read = () =>
        content.evaluate((el, body) => {
          const set = new Set<string>();
          for (const span of el.querySelectorAll(".cm-line span")) {
            const c = getComputedStyle(span).color;
            if (c !== body && (span.textContent ?? "").trim()) set.add(c);
          }
          return [...set];
        }, body);
      const required = 2;
      await expect
        .poll(async () => (await read()).length, {
          message: id,
          timeout: 10_000,
        })
        .toBeGreaterThanOrEqual(required);
      const colours = await read();
      if (id === "diff") {
        expect(colours).toContain(inserted);
        expect(colours).toContain(deleted);
      }
    }
    // One behaviour check: the language support is whole, so HTML closes a tag.
    await select.selectOption("html");
    await expect(fixture.getByTestId("language-loaded")).toHaveText(
      "HTML loaded",
    );
    await content.click();
    await page.keyboard.press("ControlOrMeta+End");
    await page.keyboard.press("Enter");
    await page.keyboard.type("<div>");
    await expect(content).toContainText("<div></div>");
  });
});

/** 007 decision 10: S1, the ink surface on the kuiper-theme page. */
test.describe("the ink surface", () => {
  const PAGE = componentPath("kuiper-theme");
  const surface = (page: Page) => page.getByTestId("keyboard-fixture");
  // 011 decisions 2 and 3: the dark ground is graphite, the raised step and
  // the wash are warm.
  const INK = "rgb(22, 20, 15)";
  const INK_RAISED = "rgb(34, 31, 25)";
  const INK_WASH = "rgb(44, 40, 33)";
  const PAPER_RAISED = "rgb(255, 255, 255)";

  test("S1. the surface's grounds, its overlays' placement and theme", async ({
    page,
  }, info) => {
    const light = scheme(info) === "light";
    await open(page, PAGE);
    const s = surface(page);
    await expect(s).toHaveClass(/\bdark\b/);
    await expect(s).toHaveClass(/\bsurface-ink\b/);
    const editor = s.locator(".cm-editor");
    await editor.locator(".cm-content").focus();
    const ground = light ? INK : INK_RAISED;
    // The 8 light-page readings (the first 2 are also the dark page's).
    expect(await computed(s, "background-color")).toBe(ground);
    expect(await computed(editor, "background-color")).toBe(ground);
    expect(
      await computed(editor.locator(".cm-gutters"), "background-color"),
    ).toBe(ground);
    expect(
      await computed(s.locator('[data-slot="code-block"]'), "background-color"),
    ).toBe(ground);
    // 014 decision 6: the block and the editor gain the hairline there too.
    await expectHairline(s.locator('[data-slot="code-block"]'), "the block");
    await expectHairline(s.locator('[data-slot="code-editor"]'), "the editor");
    expect(
      await computed(
        editor.locator(".cm-activeLine").first(),
        "background-color",
      ),
    ).toBe(INK_WASH);
    expect(
      await computed(s.locator("span.text-code-keyword").first(), "color"),
      // 013 decision 11: Tombaugh's dark keyword, #C4A4FE.
    ).toBe("rgb(196, 164, 254)");
    expect(
      await computed(s.locator('[data-slot="tabs-list"]'), "background-color"),
    ).toBe(INK_WASH);
    expect(await computed(s.locator("meter"), "background-color")).toBe(
      INK_WASH,
    );
    expect(await computed(s, "color-scheme")).toBe("dark");

    // The popover opens inside the surface, in the surface's theme.
    await page.getByTestId("surface-popover").click();
    const popover = page.locator('[data-slot="popover-content"]');
    await expect(popover).toBeVisible();
    expect(await popover.evaluate((el) => !!el.closest(".surface-ink"))).toBe(
      true,
    );
    expect(await computed(popover, "background-color")).toBe(INK_RAISED);
    await page.keyboard.press("Escape");
    await expect(popover).toHaveCount(0);
    await expect(page.getByTestId("surface-popover")).toBeFocused();

    // The dialog opens under body, in the page's theme.
    await page.getByTestId("surface-dialog").click();
    const dialog = page.locator('[data-slot="dialog-content"]');
    await expect(dialog).toBeVisible();
    // Portalled to body: the nearest of the surface or body above it is body.
    expect(
      await dialog.evaluate((el) => [
        !!el.closest(".surface-ink"),
        el.closest(".surface-ink, body")?.tagName,
      ]),
    ).toEqual([false, "BODY"]);
    expect(await computed(dialog, "background-color")).toBe(
      light ? PAPER_RAISED : INK_RAISED,
    );
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
  });
});

/** 004 decision 9: the editor. */
const EDITOR_PAGE = componentPath("code-editor");

/**
 * The grown-by-4-px clip check of 003 check 27, on an element. 014 decision 7
 * passes the editor's 5 px: the focus offset, the focus width and the line
 * width, so the whole ring is checked.
 */
async function unclipped(locator: Locator, by = 4): Promise<string | null> {
  return locator.evaluate((el, by) => {
    const r = el.getBoundingClientRect();
    const grown = {
      left: r.left - by,
      right: r.right + by,
      top: r.top - by,
      bottom: r.bottom + by,
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
  }, by);
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
      '"""A fuel ledger: a decorated class, annotations and an f-string."""',
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

  test("E3. the theme from tokens: the ring on the editor, unclipped; 5 of 5 computed values; the keyword; 5 role readings, the role span innermost; .cm-content and its caret in --code-text; 12 rules of ours in the emitted sheet, 0 literals", async ({
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
    // 014 decision 7: the ring sits 2 px outside the root's hairline, so its
    // offset is the focus offset plus the line width.
    expect(outline).toEqual(["solid", "2px", ring, "3px"]);
    expect(await computed(content(page), "outline-style")).toBe("none");
    const grow = await editor.evaluate((el) => {
      const s = getComputedStyle(el);
      return ["--focus-offset", "--focus-width", "--line-width"]
        .map((n) => parseFloat(s.getPropertyValue(n)))
        .reduce((a, b) => a + b, 0);
    });
    expect(grow).toBe(5);
    expect(await unclipped(editor, grow)).toBeNull();
    // The root has no overflow-hidden.
    const root = page
      .getByTestId("editor-main")
      .locator('[data-slot="code-editor"]');
    expect(await computed(root, "overflow-x")).toBe("visible");

    // 014 decision 1: the root and the editor on the code ground.
    const codeGround = hexToRgb(await cssVar(page, "--syntax-ground"));
    expect(await computed(root, "background-color")).toBe(codeGround);
    expect(await computed(editor, "background-color")).toBe(codeGround);
    expect(await computed(editor.locator(".cm-gutters"), "color")).toBe(
      hexToRgb(await cssVar(page, "--muted-foreground")),
    );
    expect(
      await computed(
        editor.locator(".cm-activeLine").first(),
        "background-color",
      ),
    ).toBe(hexToRgb(await cssVar(page, "--syntax-active-line")));
    const scroller = editor.locator(".cm-scroller");
    expect(await computed(scroller, "font-family")).toContain("JetBrains Mono");
    expect(await computed(scroller, "font-size")).toBe("13.5px");
    expect(await computed(scroller, "font-variant-ligatures")).toBe("none");
    expect(await computed(scroller, "scrollbar-width")).toBe("thin");
    expect(await computed(scroller, "scrollbar-color")).toBe(
      `${hexToRgb(await cssVar(page, "--input"))} ${codeGround}`,
    );
    // 013 decision 16: the text and the caret are the code's own ink.
    const ink = await resolvedColour(page, "--code-text");
    expect(await computed(content(page), "color")).toBe(ink);
    expect(await computed(content(page), "caret-color")).toBe(ink);
    // A keyword, by its role class.
    const keyword = editor
      .locator(".cm-line span.text-code-keyword", { hasText: /^import$/ })
      .first();
    await expect(keyword).toHaveCount(1, { timeout: 10_000 });
    expect(await computed(keyword, "color")).toBe(
      await resolvedColour(page, "--code-keyword"),
    );
    // The 5 role readings on the class sample, through the roles: `print` a
    // function, `self` a keyword, the docstring a string, `str` a type and
    // `dataclass` after `@` meta.
    const readings: [cls: string, text: RegExp, token: string][] = [
      ["text-code-function", /^print$/, "--code-function"],
      ["text-code-keyword", /^self$/, "--code-keyword"],
      ["text-code-string", /^.{3}A fuel ledger/, "--code-string"],
      ["text-code-type", /^str$/, "--code-type"],
      ["text-code-meta", /^@dataclass/, "--code-meta"],
    ];
    for (const [cls, text, token] of readings) {
      const span = editor
        .locator(`.cm-line span.${cls}`, { hasText: text })
        .first();
      await expect(span, `${cls} ${text}`).toHaveCount(1);
      expect(await computed(span, "color"), cls).toBe(
        await resolvedColour(page, token),
      );
      // The mechanism: the role mark is the innermost span.
      expect(await span.locator("span").count()).toBe(0);
    }
    // No weight and no slant on any token.
    for (const [weight, style] of await editor
      .locator(".cm-line span")
      .evaluateAll((all) =>
        all.map((s) => [
          getComputedStyle(s).fontWeight,
          getComputedStyle(s).fontStyle,
        ]),
      )) {
      expect(weight).toBe("400");
      expect(style).toBe("normal");
    }

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

  // The roles plugin rebuilds when the tree grows; a docstring after a
  // comment; a keyword argument's name.
  test("E5. Python's roles on a long file and on the edge cases: line 30's print is a function; docstrings after a shebang and a def-line comment read as strings; keyword arguments named like built-ins stay in the body", async ({
    page,
  }) => {
    await open(page, EDITOR_PAGE);
    const editor = main(page);
    const select = page.getByTestId("example-select");
    const fn = await resolvedColour(page, "--code-function");
    const body = await resolvedColour(page, "--code-text");
    const string = await resolvedColour(page, "--code-string");

    await select.selectOption("long");
    const lines = editor.locator(".cm-line");
    // CodeMirror renders the lines in and around the viewport, so the line
    // is found by its text, not its index.
    const thirty = lines.filter({ hasText: 'print("line 30"' });
    await expect(thirty).toHaveCount(1);
    const line30 = thirty.locator("span.text-code-function", {
      hasText: /^print$/,
    });
    await expect(line30).toHaveCount(1, { timeout: 10_000 });
    expect(await computed(line30, "color")).toBe(fn);
    expect(await thirty.locator("span.text-code-function").count()).toBe(3);

    await select.selectOption("edge");
    await expect(lines.first()).toHaveText("#!/usr/bin/env python");
    const shebangDoc = lines.nth(1).locator("span.text-code-string");
    await expect(shebangDoc).toHaveText('"""A docstring after a shebang."""', {
      timeout: 10_000,
    });
    expect(await computed(shebangDoc, "color")).toBe(string);
    const notedDoc = lines.nth(4).locator("span.text-code-string");
    await expect(notedDoc).toHaveText('"""A docstring after a comment."""');
    const kwargs = lines.nth(5);
    await expect(kwargs).toContainText('f(type="x", id=3)');
    // A body token carries no role class; it takes the editor's ink.
    for (const name of ["type", "id"])
      await expect(
        kwargs.locator('span[class*="text-code-"]', {
          hasText: new RegExp(`^${name}$`),
        }),
      ).toHaveCount(0);
    expect(await computed(kwargs, "color")).toBe(body);
    const sortedLine = lines.nth(7);
    await expect(sortedLine).toContainText("sorted(items, key=len)");
    await expect(sortedLine.locator("span.text-code-function")).toHaveText([
      "sorted",
      "len",
    ]);
    await expect(
      sortedLine.locator('span[class*="text-code-"]', { hasText: /^key$/ }),
    ).toHaveCount(0);
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
/** 013 decision 21: the editor and the block on the agreement view. */
test.describe("the editor agrees with the block", () => {
  const VIEW = "/view/code-agreement/";
  type Which = "full" | "windowed";

  /** Each rendered line of an editor: its number and its role string. */
  async function editorLines(page: Page, which: Which) {
    return page.evaluate((w) => {
      const api = (window as any).agreement;
      const view = api.view(w);
      const out: Record<number, string> = {};
      for (const el of view.contentDOM.querySelectorAll(".cm-line")) {
        const at = view.posAtDOM(el);
        // Only the visible lines: CodeMirror also keeps the cursor's line
        // rendered while it is scrolled away, outside the visible ranges.
        if (
          !view.visibleRanges.some(
            (r: { from: number; to: number }) => at >= r.from && at <= r.to,
          )
        )
          continue;
        const number = view.state.doc.lineAt(at).number;
        const parts: string[] = [];
        const walk = (node: Node, cls: string) => {
          if (node.nodeType === Node.TEXT_NODE) {
            for (const ch of node.textContent ?? "")
              if (!/\s/.test(ch)) parts.push(`${ch}${cls}`);
            return;
          }
          const own =
            [...((node as Element).classList ?? [])].find((c) =>
              c.startsWith("text-code-"),
            ) ?? cls;
          for (const child of node.childNodes) walk(child, own);
        };
        walk(el, "");
        out[number] = parts.join("|");
      }
      return out;
    }, which);
  }

  /** The mirror block's lines, by number. */
  async function blockLines(page: Page, which: Which) {
    const block = page.locator(`[data-mirror="${which}"]`);
    await expect(
      block.locator('[data-slot="code-block-content"]'),
    ).toHaveAttribute("data-highlight", "settled", { timeout: 30_000 });
    return block.evaluate((root) => {
      const out: Record<number, string> = {};
      root
        .querySelectorAll('[data-slot="code-block-line-content"]')
        .forEach((line, i) => {
          const parts: string[] = [];
          const walk = (node: Node, cls: string) => {
            if (node.nodeType === Node.TEXT_NODE) {
              for (const ch of node.textContent ?? "")
                if (!/\s/.test(ch)) parts.push(`${ch}${cls}`);
              return;
            }
            const own =
              [...((node as Element).classList ?? [])].find((c) =>
                c.startsWith("text-code-"),
              ) ?? cls;
            for (const child of node.childNodes) walk(child, own);
          };
          walk(line, "");
          out[i + 1] = parts.join("|");
        });
      return out;
    });
  }

  /** The editor agrees with its mirror on every rendered line; returns how many lines were compared. */
  async function agree(page: Page, which: Which, what: string) {
    let compared = 0;
    await expect
      .poll(
        async () => {
          const editor = await editorLines(page, which);
          const block = await blockLines(page, which);
          const wrong = Object.entries(editor).filter(
            ([n, roles]) => block[Number(n)] !== roles,
          );
          compared = Object.keys(editor).length;
          return wrong.map(([n]) => n);
        },
        { message: what, timeout: 15_000 },
      )
      .toEqual([]);
    return compared;
  }

  const load = (page: Page, which: Which, language: string, code: string) =>
    page.evaluate(([w, l, c]) => (window as any).agreement.set(w, l, c), [
      which,
      language,
      code,
    ] as const);

  test.describe("at full height", () => {
    test.use({ viewport: { width: 1280, height: 7000 } });

    test("E6. 44 of 44 texts agree on every non-whitespace character; 3 of 3 edited texts and a new Markdown fence agree after the edits", async ({
      page,
    }) => {
      test.setTimeout(300_000);
      await openView(page, VIEW);
      await page.locator("[data-editors-ready]").waitFor();
      await page.evaluate(() => (window as any).agreement.mirror(true));
      const { SPECIMENS } = await import("../fixtures/highlight/specimens.ts");
      const { CODE_SAMPLES } =
        await import("../../src/lib/preview/code-samples.ts");
      const texts = [
        ...SPECIMENS.map((s) => [s.id, s.language, s.code] as const),
        ...CODE_SAMPLES.map(
          (s) => [`gallery ${s.language}`, s.language, s.code] as const,
        ),
      ];
      expect(texts).toHaveLength(44);
      await page.locator('[data-editor="full"]').scrollIntoViewIfNeeded();
      for (const [what, language, code] of texts) {
        await load(page, "full", language, code);
        await page
          .locator('[data-editor="full"]')
          .evaluate((el) => el.scrollIntoView({ block: "start" }));
        // Until the editor has rendered every line, not at one moment: on a
        // loaded machine its last lines can arrive after the first agree.
        await expect
          .poll(() => agree(page, "full", what), {
            message: `${what}: every line rendered`,
            timeout: 30_000,
          })
          .toBe(code.split("\n").length);
      }
      // The scripted edits, on three texts.
      const view = "window.agreement.view('full')";
      for (const id of ["python", "svelte", "markdown"]) {
        const specimen = SPECIMENS.find((s) => s.id === id)!;
        await load(page, "full", specimen.language, specimen.code);
        await agree(page, "full", `${id} before`);
        await page.locator('[data-editor="full"] .cm-content').click();
        await page.keyboard.press("ControlOrMeta+End");
        await page.keyboard.type(
          id === "markdown" ? "\n\n```python\nprint(1)\n```" : "\nvalue = 1",
        );
        await page.evaluate(
          `(() => { const v = ${view}; v.dispatch({ changes: { from: 10, to: 40 } }); })()`,
        );
        await page.evaluate(
          `(() => { const v = ${view}; v.dispatch({ changes: { from: v.state.doc.line(4).from, insert: "if x:\\n    y = [1, 2]\\n" }, userEvent: "input.paste" }); })()`,
        );
        await agree(page, "full", `${id} after the edits`);
      }
    });
  });

  test("E6. the windowed case: in the 20-line editor on a 2,000-line Ruby file, line 1,000 agrees before and after 50 off-screen edits", async ({
    page,
  }) => {
    test.setTimeout(120_000);
    await openView(page, VIEW);
    await page.locator("[data-editors-ready]").waitFor();
    await page.evaluate(() => (window as any).agreement.mirror(true));
    await page
      .locator('[data-editor="windowed"]')
      .evaluate((el) => el.scrollIntoView({ block: "center" }));
    const toLine = (n: number) =>
      page.evaluate((line) => {
        const v = (window as any).agreement.view("windowed");
        v.scrollDOM.scrollTop = v.lineBlockAt(v.state.doc.line(line).from).top;
        return new Promise((r) =>
          requestAnimationFrame(() => requestAnimationFrame(r)),
        );
      }, n);
    await toLine(1000);
    const seen = await editorLines(page, "windowed");
    expect(Object.keys(seen).map(Number)).toContain(1000);
    expect(Object.keys(seen).length).toBeLessThan(200);
    await agree(page, "windowed", "line 1,000");
    await page.evaluate(() => {
      const v = (window as any).agreement.view("windowed");
      for (let i = 0; i < 50; i++) {
        const line = v.state.doc.line(10 + (i % 31));
        const insert = i % 5 === 0 ? `\n  count = ${i}` : ` # e${i}`;
        v.dispatch({ changes: { from: line.to, insert } });
      }
    });
    await toLine(1000);
    await agree(page, "windowed", "line 1,000 after 50 edits");
  });

  /** p95 and max of a list. */
  const stats = (times: number[]) => {
    const sorted = [...times].sort((a, b) => a - b);
    return {
      p95: sorted[Math.ceil(0.95 * sorted.length) - 1]!,
      max: sorted.at(-1)!,
    };
  };

  /** Types 200 characters into the 20-line editor and times each transaction in the page. */
  async function typeTimed(page: Page) {
    await page.evaluate(() => {
      const v = (window as any).agreement.view("windowed");
      const times: number[] = [];
      const events: number[] = [];
      (window as any).timings = { times, events };
      const dispatch = v.dispatch.bind(v);
      v.dispatch = (...args: unknown[]) => {
        const t0 = performance.now();
        dispatch(...args);
        times.push(performance.now() - t0);
      };
      new PerformanceObserver((list) => {
        for (const e of list.getEntries() as PerformanceEventTiming[])
          if (e.name === "keydown") events.push(e.processingEnd - e.startTime);
      }).observe({
        type: "event",
        durationThreshold: 16,
        buffered: false,
      } as PerformanceObserverInit);
      v.dispatch({
        selection: {
          anchor: v.state.doc.line(Math.floor(v.state.doc.lines / 2)).to,
        },
      });
      v.focus();
      times.length = 0;
    });
    await page.keyboard.type("x = 1 + 2 # typed ".repeat(12).slice(0, 200));
    return page.evaluate(async () => {
      const v = (window as any).agreement.view("windowed");
      const frames: number[] = [];
      for (let i = 0; i < 10; i++) {
        const t0 = performance.now();
        v.dispatch({
          changes: { from: v.state.selection.main.head, insert: "y" },
        });
        await new Promise((r) => requestAnimationFrame(r));
        frames.push(performance.now() - t0);
      }
      const { times, events } = (window as any).timings;
      return { times: times.slice(0, 200), events, frames };
    });
  }

  test("E7. the budgets, timed in the page: Python's first colour, 200 keystrokes in 5,000 lines; Ruby and Markdown in 2,000", async ({
    page,
  }) => {
    test.setTimeout(180_000);
    await openView(page, VIEW);
    await page.locator("[data-editors-ready]").waitFor();
    const { SPECIMENS } = await import("../fixtures/highlight/specimens.ts");
    const repeat = (id: string, lines: number) => {
      const code = SPECIMENS.find((s) => s.id === id)!.code.split("\n");
      return Array.from(
        { length: lines },
        (_, i) => code[i % code.length],
      ).join("\n");
    };
    // The grammar first, then the 5,000-line document's first colour.
    await load(page, "windowed", "python", "x = 1");
    await expect(
      page.locator('[data-editor="windowed"] .text-code-number'),
    ).toHaveCount(1, { timeout: 15_000 });
    const firstColour = await page.evaluate(
      async (code) => {
        const root = document.querySelector('[data-editor="windowed"]')!;
        const t0 = performance.now();
        const done = new Promise<number>((resolve) => {
          const seen = () => root.querySelector(".cm-line .text-code-keyword");
          const observer = new MutationObserver(() => {
            if (
              seen() &&
              (window as any).agreement.view("windowed").state.doc.lines > 4000
            ) {
              observer.disconnect();
              resolve(performance.now() - t0);
            }
          });
          observer.observe(root, {
            subtree: true,
            childList: true,
            attributes: true,
          });
        });
        await (window as any).agreement.set("windowed", "python", code);
        return done;
      },
      repeat("python", 5000),
    );
    const python = await typeTimed(page);
    const p = stats(python.times);
    await load(page, "windowed", "ruby", repeat("ruby", 2000));
    await expect(
      page.locator('[data-editor="windowed"] .text-code-keyword').first(),
    ).toBeVisible({ timeout: 15_000 });
    const ruby = stats((await typeTimed(page)).times);
    await load(page, "windowed", "markdown", repeat("markdown", 2000));
    await expect(
      page.locator('[data-editor="windowed"] [class*="text-code-"]').first(),
    ).toBeVisible({ timeout: 15_000 });
    const markdown = stats((await typeTimed(page)).times);
    console.log(
      `E7: python first colour ${firstColour.toFixed(0)} ms; python p95 ${p.p95.toFixed(2)} ms, max ${p.max.toFixed(2)} ms; ruby p95 ${ruby.p95.toFixed(2)} ms; markdown p95 ${markdown.p95.toFixed(2)} ms; keydown events over 16 ms: ${python.events.length}; next frame ${stats(python.frames).p95.toFixed(1)} ms p95`,
    );
    expect(python.times).toHaveLength(200);
    expect(firstColour).toBeLessThanOrEqual(250);
    // Reset at checkpoint 2 from 8 ms to 12 ms (decisions.md, "After the `013` build's checkpoint 2").
    expect(p.p95).toBeLessThanOrEqual(12);
    expect(p.max).toBeLessThanOrEqual(50);
    expect(ruby.p95).toBeLessThanOrEqual(16);
    expect(markdown.p95).toBeLessThanOrEqual(16);
  });
});

/** 013 criterion 13: the editor before it mounts. */
test("the editor before mount: with scripts off, the prerendered root computes the code ground and its fallback pre the --code-text colour", async ({
  browser,
}, info) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    colorScheme: info.project.use.colorScheme,
    baseURL: info.project.use.baseURL,
  });
  const raw = await context.newPage();
  await raw.goto(EDITOR_PAGE);
  const root = raw.locator('[data-slot="code-editor"]').first();
  const fallback = root.locator('[data-slot="code-editor-fallback"]');
  await expect(fallback).toHaveCount(1);
  const [ground, colour, wantGround, wantColour] = await root.evaluate((el) => {
    const probe = (prop: string, value: string) => {
      const p = document.createElement("span");
      p.style.setProperty(prop, value);
      el.append(p);
      const c = getComputedStyle(p).getPropertyValue(prop);
      p.remove();
      return c;
    };
    return [
      getComputedStyle(el).backgroundColor,
      getComputedStyle(el.querySelector('[data-slot="code-editor-fallback"]')!)
        .color,
      probe("background-color", "var(--code-background)"),
      probe("color", "var(--code-text)"),
    ];
  });
  expect(ground).toBe(wantGround);
  expect(colour).toBe(wantColour);
  await context.close();
});

test.describe("the popover", () => {
  const PAGE = componentPath("popover");

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
    if (scheme(info) === "light") {
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
    await open(page, componentPath("accordion"));
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

    await open(page, componentPath("toggle"));
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

    await open(page, componentPath("toggle-group"));
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
  const PAGE = componentPath("chart");

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
  const PAGE = componentPath("meter");

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

/**
 * 014 criterion 8: the white code ground and the hairline, on every surface
 * the release puts code on, read as literal colours in each theme.
 */
test.describe("the code ground and its edge (014)", () => {
  test("G1. code-block: the root on the code ground with the hairline on 4 sides; 3 emphasised lines on the active line; the track on the code ground", async ({
    page,
  }, info) => {
    const theme = scheme(info);
    await open(page, PAGE);
    const block = python(page);
    expect(await computed(block, "background-color")).toBe(CODE_GROUND[theme]);
    await expectHairline(block, "the block");
    const lines = page.locator(
      '[data-slot="code-block-line"]:is([data-variant="highlighted"], [data-variant="added"], [data-variant="removed"])',
    );
    expect(await lines.count()).toBe(3);
    for (const line of await lines.all())
      expect(await computed(line, "background-color")).toBe(ACTIVE_LINE[theme]);
    const pre = block.locator('[data-slot="code-block-content"]');
    expect(
      (await computed(pre, "scrollbar-color")).endsWith(CODE_GROUND[theme]),
    ).toBe(true);
  });

  test("G2. code-editor: the root and .cm-editor on the code ground, the root with the hairline; the active line; the track; the ring 3 px out", async ({
    page,
  }, info) => {
    const theme = scheme(info);
    await open(page, EDITOR_PAGE);
    const host = page.getByTestId("editor-main");
    const root = host.locator('[data-slot="code-editor"]');
    const editor = host.locator(".cm-editor");
    expect(await computed(root, "background-color")).toBe(CODE_GROUND[theme]);
    expect(await computed(editor, "background-color")).toBe(CODE_GROUND[theme]);
    await expectHairline(root, "the editor's root");
    expect(
      await computed(
        editor.locator(".cm-activeLine").first(),
        "background-color",
      ),
    ).toBe(ACTIVE_LINE[theme]);
    expect(
      (
        await computed(editor.locator(".cm-scroller"), "scrollbar-color")
      ).endsWith(CODE_GROUND[theme]),
    ).toBe(true);
    await editor.locator(".cm-content").focus();
    await expect(editor).toHaveClass(/cm-focused/);
    expect(await computed(editor, "outline-offset")).toBe("3px");
    expect(await unclipped(editor, 5)).toBeNull();
  });

  test("G3. product-home: each stage-card's block and live-console's block on the code ground with the hairline", async ({
    page,
  }, info) => {
    const theme = scheme(info);
    await openView(page, "/view/product-home/");
    const blocks = page.locator(
      '[data-slot="stage-card"] [data-slot="code-block"], [data-slot="live-console"] [data-slot="code-block"]',
    );
    const cards = await page
      .locator('[data-slot="stage-card"] [data-slot="code-block"]')
      .count();
    const consoles = await page
      .locator('[data-slot="live-console"] [data-slot="code-block"]')
      .count();
    expect(cards, "stage-card blocks").toBeGreaterThanOrEqual(2);
    expect(consoles, "live-console blocks").toBeGreaterThanOrEqual(1);
    for (const block of await blocks.all()) {
      expect(await computed(block, "background-color")).toBe(
        CODE_GROUND[theme],
      );
      await expectHairline(block, "a composition's block");
    }
  });

  test("G4. the chat thread: the block in m3's user bubble on the code ground with the hairline", async ({
    page,
  }, info) => {
    const theme = scheme(info);
    await openView(page, "/view/chat/thread/");
    const turn = page
      .locator('[data-slot="message"][data-align="end"]')
      .filter({ hasText: "adds two numbers" });
    await expect(turn).toHaveCount(1);
    const block = turn.locator('[data-slot="code-block"]');
    await expect(block).toHaveCount(1);
    await expect(block.locator("pre")).toHaveText("add(2, 3)");
    expect(await computed(block, "background-color")).toBe(CODE_GROUND[theme]);
    await expectHairline(block, "the user turn's block");
  });
});

/**
 * 014 decision 15, criterion 17: inline code is a chip on the code ground,
 * edged by the hairline; in a heading it is not; the install line and the
 * block's own code are unchanged by the chip.
 */
test.describe("inline code (014)", () => {
  const THEME_PAGE = componentPath("kuiper-theme");
  const own = (locator: Locator, name: string) =>
    locator.evaluate(
      (el, n) => getComputedStyle(el).getPropertyValue(n).trim(),
      name,
    );

  test("I1. the chip: ground, hairline, code colour, 4 px side padding and none above, the case radius, cloned on a wrap", async ({
    page,
  }, info) => {
    const theme = scheme(info);
    await open(page, THEME_PAGE);
    const chip = page.getByTestId("inline-p").locator("code").first();
    expect(await computed(chip, "background-color")).toBe(CODE_GROUND[theme]);
    await expectHairline(chip, "the chip");
    expect(await computed(chip, "color")).toBe(
      hexToRgb(await own(chip, "--code-text")),
    );
    expect(await computed(chip, "padding-inline-start")).toBe("4px");
    expect(await computed(chip, "padding-inline-end")).toBe("4px");
    expect(await computed(chip, "padding-block-start")).toBe("0px");
    expect(await computed(chip, "padding-block-end")).toBe("0px");
    // --radius is written in rem; a probe resolves it to the px the chip computes.
    const radius = await chip.evaluate((el) => {
      const probe = document.createElement("span");
      probe.style.borderTopLeftRadius = "var(--radius)";
      el.parentElement!.append(probe);
      const px = getComputedStyle(probe).borderTopLeftRadius;
      probe.remove();
      return px;
    });
    expect(radius).toBe("8px");
    expect(await computed(chip, "border-top-left-radius")).toBe(radius);
    expect(await computed(chip, "box-decoration-break")).toBe("clone");
  });

  test("I2. rendered line heights: a one-line paragraph with a chip is as tall as its twin with a mono span, in text-xs, text-sm and text-base", async ({
    page,
  }) => {
    await open(page, THEME_PAGE);
    for (const size of ["xs", "sm", "base"]) {
      const withChip = page.getByTestId(`inline-line-${size}`);
      const twin = page.getByTestId(`inline-twin-${size}`);
      await expect(withChip.locator("code")).toHaveCount(1);
      await expect(twin.locator("span.font-mono")).toHaveCount(1);
      expect(await withChip.getAttribute("class")).toBe(
        await twin.getAttribute("class"),
      );
      const [a, b] = [
        (await withChip.boundingBox())!.height,
        (await twin.boundingBox())!.height,
      ];
      expect(Math.abs(a - b), `${size}: ${a} vs ${b}`).toBeLessThanOrEqual(0.5);
    }
  });

  test("I3. in a link the code colour is the link's; in a card the same chip; in an h3 no chip; in the ink surface flush with the surface", async ({
    page,
  }, info) => {
    const theme = scheme(info);
    await open(page, THEME_PAGE);
    const link = page.getByTestId("inline-link").locator("code");
    await expect(page.getByTestId("inline-link")).toHaveAttribute(
      "href",
      "#inline-code",
    );
    expect(await computed(link, "color")).toBe(
      hexToRgb(await own(link, "--code-link")),
    );
    const card = page.getByTestId("inline-card").locator("code");
    expect(await computed(card, "background-color")).toBe(CODE_GROUND[theme]);
    await expectHairline(card, "the card's chip");
    const heading = page.getByTestId("inline-h3");
    const inHeading = heading.locator("code");
    expect(await computed(inHeading, "background-color")).toBe(
      "rgba(0, 0, 0, 0)",
    );
    expect(await computed(inHeading, "border-top-width")).toBe("0px");
    expect(await computed(inHeading, "font-family")).toContain(
      "JetBrains Mono",
    );
    expect(await computed(inHeading, "color")).toBe(
      await computed(heading, "color"),
    );
    const surface = page.getByTestId("keyboard-fixture");
    const inSurface = page.getByTestId("inline-surface").locator("code");
    expect(await computed(inSurface, "background-color")).toBe(
      await computed(surface, "background-color"),
    );
  });

  test("I4. the install line on an item page takes the code ground, the hairline and the code colour", async ({
    page,
  }, info) => {
    const theme = scheme(info);
    await open(page, componentPath("button"));
    // 015 decision 16: the install line is a code block; 018 decision 3
    // moves it from the facts card to the Install section.
    const line = page
      .locator('section[aria-labelledby="install"] [data-slot="code-block"]')
      .first();
    expect(await computed(line, "background-color")).toBe(CODE_GROUND[theme]);
    await expectHairline(line, "the install line");
    expect(await computed(line, "color")).toBe(
      hexToRgb(await own(line, "--code-text")),
    );
  });

  // decisions.md, "kbd sits on the code ground and can be selected"
  // (2026-11-15): the owner's word amends 014's muted inset for kbd.
  test("I5. a block's pre code takes no chip; kbd sits on the code ground, with its hairline and muted text", async ({
    page,
  }, info) => {
    const theme = scheme(info);
    await open(page, PAGE);
    const inner = python(page).locator("pre code").first();
    expect(await computed(inner, "background-color")).toBe("rgba(0, 0, 0, 0)");
    expect(await computed(inner, "border-top-width")).toBe("0px");
    await open(page, componentPath("kbd"));
    const kbd = page.locator('main [data-slot="kbd"]').first();
    expect(await computed(kbd, "background-color")).toBe(CODE_GROUND[theme]);
    expect(await computed(kbd, "border-top-width")).toBe("1px");
    expect(await computed(kbd, "color")).toBe(
      hexToRgb(await cssVar(page, "--muted-foreground")),
    );
  });

  test("I5b. kbd's text can be selected by mouse, and it takes pointer events", async ({
    page,
  }) => {
    await open(page, componentPath("kbd"));
    const kbd = page.locator('main [data-slot="kbd"]').first();
    expect(await computed(kbd, "user-select")).not.toBe("none");
    expect(await computed(kbd, "pointer-events")).toBe("auto");
    await kbd.scrollIntoViewIfNeeded();
    const box = (await kbd.boundingBox())!;
    const text = (await kbd.textContent())!.trim();
    // Drag across it from just outside its start to just outside its end.
    await page.mouse.move(box.x - 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width + 2, box.y + box.height / 2, {
      steps: 5,
    });
    await page.mouse.up();
    expect(
      await page.evaluate(() => getSelection()?.toString() ?? ""),
    ).toContain(text);
  });
});
