/**
 * 023a: where an API table's type may break. The pieces re-join to the
 * type, and no break falls inside a name, a number, a spread or a string.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { apiTables } from "../../src/lib/site/api.server.ts";
import { withListedItems } from "../../src/lib/site/items.ts";
import { typePieces } from "../../src/lib/site/type-pieces.ts";

describe("023a: typePieces", () => {
  test.each([
    ['"attached" | "spaced"', ['"attached" |', ' "spaced"']],
    ["HTMLDivElement | null", ["HTMLDivElement |", " null"]],
    [
      "WithoutChildrenOrChild<ComponentProps<typeof PopoverPortal>>",
      ["WithoutChildrenOrChild<", "ComponentProps<", "typeof PopoverPortal>>"],
    ],
    [
      'AccordionPrimitive.HeaderProps["level"]',
      ["AccordionPrimitive.", "HeaderProps", '["level"]'],
    ],
    ["(value: string) => void", ["(", "value: string) =>", " void"]],
    // `()` and `[]` stay whole.
    ["() => void", ["() =>", " void"]],
    ["AppShellLink[]", ["AppShellLink[]"]],
    // No break before a `[` that follows white space.
    ["Snippet<\n  [string]\n>", ["Snippet<", "\n  [string]\n>"]],
  ])("%p", (type, want) => {
    expect(typePieces(type)).toEqual(want);
  });

  test("a number, a spread and a string literal hold whole at their dots", () => {
    expect(typePieces("0.5")).toEqual(["0.5"]);
    expect(typePieces("...rest")).toEqual(["...rest"]);
    expect(typePieces('"a.b"')).toEqual(['"a.b"']);
    expect(typePieces('"a.b" | "c<d"')).toEqual(['"a.b" |', ' "c<d"']);
    expect(typePieces("(...args: unknown[]) => void")).toEqual([
      "(",
      "...args: unknown[]) =>",
      " void",
    ]);
  });

  test("every type in the API data re-joins from its pieces, none empty", () => {
    const registry = withListedItems(
      JSON.parse(readFileSync("registry.json", "utf8")),
    ) as { items: { name: string }[] };
    let typed = 0;
    for (const item of registry.items)
      for (const table of apiTables(item as never))
        for (const row of table.rows) {
          if (!row.type) continue;
          typed++;
          const pieces = typePieces(row.type);
          expect(pieces.join("")).toBe(row.type);
          expect(pieces.filter((p) => p.trim() === "")).toEqual([]);
        }
    expect(typed).toBeGreaterThan(900);
  });
});
