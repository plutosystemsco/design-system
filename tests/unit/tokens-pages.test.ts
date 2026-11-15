/**
 * 017 criterion 10: the Foundations pages' tables, generated from the token
 * file, from source. Their built pages are checked in build-output.spec.ts.
 */
import { describe, expect, test } from "bun:test";
import { contrastTable } from "../../scripts/contrast.ts";
import { readTokens, resolveColor } from "../../scripts/tokens.ts";
import { colourRows } from "../../src/lib/site/foundations/contrast-rows.server.ts";
import { codeRows, tokenRows } from "../../src/lib/site/foundations/tables.ts";

const tokens = readTokens();

describe("017: the tokens table", () => {
  const rows = tokenRows(tokens);
  const primitives = Object.keys(tokens.primitives);
  const roles = Object.keys(tokens.themes.light);

  test("lists every primitive and every theme role of the token file, each once", () => {
    expect(
      rows.filter((r) => r.kind === "primitive").map((r) => r.name),
    ).toEqual(primitives);
    expect(rows.filter((r) => r.kind === "role").map((r) => r.name)).toEqual(
      roles,
    );
    expect(new Set(rows.map((r) => r.id)).size).toBe(rows.length);
  });

  test("with both themes' values", () => {
    for (const r of rows) {
      if (r.kind === "primitive") {
        expect(r.light).toBe(tokens.primitives[r.name]);
        expect(r.dark).toBe(tokens.primitives[r.name]);
      } else {
        expect(r.light).toBe(resolveColor(tokens, "light", r.name));
        expect(r.dark).toBe(resolveColor(tokens, "dark", r.name));
      }
    }
  });

  test("every row has its job in words, and a role copies its custom property", () => {
    for (const r of rows) expect(r.words).toMatch(/^[A-Z].*\.$/);
    for (const r of rows.filter((r) => r.kind === "role"))
      expect(r.copy).toBe(`--${r.name}`);
  });
});

describe("017: the colour table", () => {
  test("lists every row of contrastTable for both themes, with its ratio", () => {
    const rows = colourRows(tokens);
    const want = [
      ...contrastTable(tokens, "light"),
      ...contrastTable(tokens, "dark"),
    ];
    expect(rows).toEqual(want);
    expect(rows.some((r) => r.theme === "light")).toBe(true);
    expect(rows.some((r) => r.theme === "dark")).toBe(true);
    for (const r of rows) expect(r.ratio).toBeGreaterThan(1);
  });
});

describe("017: the code table", () => {
  test("lists every role of the code map, with both themes' colours", () => {
    const rows = codeRows(tokens);
    expect(rows.map((r) => r.role)).toEqual(Object.keys(tokens.code));
    for (const r of rows) {
      expect(r.token).toBe(tokens.code[r.role as keyof typeof tokens.code]);
      expect(r.light).toBe(resolveColor(tokens, "light", r.token));
      expect(r.dark).toBe(resolveColor(tokens, "dark", r.token));
      expect(r.words).toMatch(/^[A-Z].*\.$/);
    }
  });
});
