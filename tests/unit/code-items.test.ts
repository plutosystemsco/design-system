import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

/**
 * 013 criteria 12, 13 and 16: what the code items' source holds. No code on
 * light `muted`; the body reads `--code-text`; the removed name appears in no
 * form; the inline-code rule takes `text-code-text`; and the highlighter
 * imports its engines and Node only dynamically.
 */

type Item = {
  name: string;
  files?: { path: string }[];
  css?: unknown;
  cssVars?: unknown;
};
const registry = JSON.parse(readFileSync("registry.json", "utf8")) as {
  items: Item[];
};
const item = (name: string) => registry.items.find((i) => i.name === name)!;
const files = (name: string) => (item(name).files ?? []).map((f) => f.path);
const read = (file: string) => readFileSync(file, "utf8");

describe("no code on light muted (criterion 13)", () => {
  test("0 bg-muted in code-block's and code-editor's files", () => {
    for (const file of [...files("code-block"), ...files("code-editor")])
      expect(read(file), file).not.toContain("bg-muted");
  });
});

describe("the body reads --code-text (criterion 16)", () => {
  test("code-block.svelte's default variant holds text-code-text and not text-foreground", () => {
    const source = read("src/lib/registry/ui/code-block/code-block.svelte");
    const variant = /default:\s*"([^"]*)"/.exec(source)![1]!;
    expect(variant).toContain("text-code-text");
    expect(variant).not.toContain("text-foreground");
  });

  test("code-editor-theme.ts holds var(--code-text) twice", () => {
    const source = read("src/lib/registry/ui/code-editor/code-editor-theme.ts");
    expect(source.match(/var\(--code-text\)/g)).toHaveLength(2);
  });

  test("the dropped name, code-foreground, in any form: 0 in every item file, in pluto-theme's css and cssVars, and in src/app.css", () => {
    const pattern = /code-foreground/;
    for (const i of registry.items)
      for (const file of (i.files ?? []).map((f) => f.path))
        expect(read(file), file).not.toMatch(pattern);
    const theme = item("pluto-theme");
    expect(JSON.stringify(theme.css)).not.toMatch(pattern);
    expect(JSON.stringify(theme.cssVars)).not.toMatch(pattern);
    expect(read("src/app.css")).not.toMatch(pattern);
  });

  test("the inline-code rule takes text-code-text; its link rule text-code-link", () => {
    const base = (
      item("pluto-theme").css as Record<string, Record<string, unknown>>
    )["@layer base"]!;
    expect(
      base["code:not(pre code, :is(h1, h2, h3, h4, h5, h6) code)"],
    ).toEqual({
      "@apply rounded border border-border bg-code-background px-1 text-code-text box-decoration-clone":
        {},
    });
    expect(
      base["a code:not(pre code, :is(h1, h2, h3, h4, h5, h6) code)"],
    ).toEqual({
      "@apply text-code-link": {},
    });
  });
});

describe("no engine where none is needed (criterion 12)", () => {
  test("no file of highlighter imports web-tree-sitter, shiki or a node: module statically", () => {
    const highlighter = files("highlighter").filter((f) => /\.ts$/.test(f));
    expect(highlighter.length).toBeGreaterThan(0);
    const statically =
      /^\s*import\s+(?!type\b)[^;]*?from\s+["'](web-tree-sitter|shiki[^"']*|node:[^"']*)["']/m;
    const bare =
      /^\s*import\s+["'](web-tree-sitter|shiki[^"']*|node:[^"']*)["']/m;
    for (const file of highlighter) {
      const source = read(file);
      expect(source, file).not.toMatch(statically);
      expect(source, file).not.toMatch(bare);
    }
  });
});
