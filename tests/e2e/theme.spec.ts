import { expect, test, type Page } from "@playwright/test";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  COMPOSITION_VIEW_LIST,
  GROUND,
  open,
  openView,
  PAGES,
  TEST_VIEWS,
  VIEWS,
  type ThemeName,
} from "./pages.ts";

async function expectTheme(page: Page, theme: ThemeName): Promise<void> {
  const html = page.locator("html");
  if (theme === "dark") await expect(html).toHaveClass(/(^|\s)dark(\s|$)/);
  else await expect(html).not.toHaveClass(/(^|\s)dark(\s|$)/);
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    GROUND[theme],
  );
}

// 003 decision 20: 001's two checks on the 64 site pages and the 28 views.
for (const path of PAGES) {
  test(`${path} takes the theme from the system`, async ({ page }, info) => {
    await open(page, path);
    await expectTheme(page, info.project.name as ThemeName);
  });
}

for (const view of VIEWS) {
  test(`${view.path} takes the theme from the system`, async ({
    page,
  }, info) => {
    await openView(page, view.path);
    await expectTheme(page, info.project.name as ThemeName);
  });
}

// 013 decision 21: the test views.
for (const path of TEST_VIEWS) {
  test(`${path} takes the theme from the system`, async ({ page }, info) => {
    await openView(page, path);
    await expectTheme(page, info.project.name as ThemeName);
  });
}

/**
 * 005 decision 6: the theme item's head script. The preview app renders
 * `ThemeScript` in its root layout, so every prerendered page's <head> holds
 * one inline script that reads the key and sets the class before paint, and
 * `app.html` holds no script of its own.
 */
test.describe("the head script", () => {
  const inlineScripts = (html: string) =>
    [
      ...html
        .slice(0, html.indexOf("</head>"))
        .matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g),
    ].map((m) => m[1]);

  test("the home page's raw <head> holds the theme script exactly once, reading pluto-theme and toggling the dark class", async ({
    request,
  }) => {
    const html = await (await request.get("/")).text();
    const scripts = inlineScripts(html).filter((s) =>
      s.includes("pluto-theme"),
    );
    expect(scripts).toHaveLength(1);
    expect(scripts[0]).toContain('localStorage.getItem("pluto-theme")');
    expect(scripts[0]).toContain("(prefers-color-scheme: dark)");
    expect(scripts[0]).toContain('classList.toggle("dark"');
  });

  // The (site), (view) and (shell) layouts each render it; a page holds
  // exactly one (015 criterion 6: every page and every view in pages.ts).
  const ALL = [
    ...PAGES,
    ...VIEWS.map((v) => v.path),
    ...COMPOSITION_VIEW_LIST.map((v) => v.path),
    ...TEST_VIEWS,
  ];
  test(`every one of the ${ALL.length} prerendered pages and views holds the script exactly once`, async ({
    request,
  }) => {
    const counts: Record<string, number> = {};
    for (const path of ALL) {
      const html = await (await request.get(path)).text();
      counts[path] = inlineScripts(html).filter((s) =>
        s.includes('localStorage.getItem("pluto-theme")'),
      ).length;
    }
    expect(Object.values(counts).filter((n) => n !== 1)).toEqual([]);
    expect(Object.keys(counts)).toHaveLength(ALL.length);
  });

  // 015 criterion 6: an example view holds the frame's head script once,
  // and no ThemeScript.
  for (const item of [
    "button",
    "alert",
    "dropdown-menu",
    "chart",
    "code-block",
  ]) {
    test(`${item}'s first example view: 1 example head script, 0 ThemeScript`, async ({
      request,
    }) => {
      const pageHtml = await (await request.get(`/components/${item}/`)).text();
      const id =
        /data-slot="frame"[^>]*\bid="([^"]+)"|\bid="([^"]+)"[^>]*data-slot="frame"/.exec(
          pageHtml,
        );
      const example = id?.[1] ?? id?.[2];
      expect(example).toBeTruthy();
      const html = await (
        await request.get(`/example/${item}/${example}/`)
      ).text();
      const scripts = inlineScripts(html);
      expect(
        scripts.filter((s) => s.includes("URLSearchParams(location.search)")),
      ).toHaveLength(1);
      expect(
        scripts.filter((s) =>
          s.includes('localStorage.getItem("pluto-theme")'),
        ),
      ).toHaveLength(0);
    });
  }

  test("app.html holds no script of its own", () => {
    const appHtml = readFileSync("src/app.html", "utf8");
    expect(appHtml).not.toMatch(/<script/);
    expect(appHtml).not.toContain("pluto-preview-theme");
  });

  // An app with a Content Security Policy passes `nonce`. The item is
  // rendered on the server here, outside the preview site, since the site
  // passes none.
  test("a nonce passed to ThemeScript is written once onto the script in the rendered head", async () => {
    const { compile } = await import("svelte/compiler");
    const source = readFileSync(
      "src/lib/registry/ui/theme/theme-script.svelte",
      "utf8",
    );
    const { js } = compile(source, {
      generate: "server",
      filename: "theme-script.svelte",
    });
    const dir = path.resolve(".svelte-kit", "pluto-tests");
    mkdirSync(dir, { recursive: true });
    const file = path.join(dir, "theme-script.svelte.js");
    writeFileSync(file, js.code);
    const component = (await import(file)).default;
    const { render } = await import("svelte/server");
    const { head } = render(component, { props: { nonce: "n0nce" } });
    expect(head.match(/<script/g)).toHaveLength(1);
    expect(head.match(/nonce="n0nce"/g)).toHaveLength(1);
    expect(head).toContain('localStorage.getItem("pluto-theme")');
    const bare = render(component, { props: {} });
    expect(bare.head).not.toContain("nonce");
  });
});
