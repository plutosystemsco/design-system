/**
 * 015 decision 14 and criterion 15: the API tables, generated from each
 * item's source.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { apiTables, type ApiTable } from "../../src/lib/site/api.server.ts";
import { citationsIn } from "../../src/lib/site/citations.ts";

type Item = { name: string; files: { path: string; type: string }[] };
const registry = JSON.parse(readFileSync("registry.json", "utf8")) as {
  items: Item[];
};
const item = (name: string) => registry.items.find((i) => i.name === name)!;
const row = (tables: ApiTable[], part: string, name: string) =>
  tables.find((t) => t.part === part)?.rows.find((r) => r.name === name);

describe("015: the API tables", () => {
  test("the module reads every .svelte and .ts file of every item, with 0 failures", () => {
    const failed: string[] = [];
    for (const i of registry.items) {
      try {
        apiTables(i);
      } catch (e) {
        failed.push(`${i.name}: ${(e as Error).message}`);
      }
    }
    expect(failed).toEqual([]);
  });

  test("button: variant, size and busy, the variants expanded to their keys", () => {
    const t = apiTables(item("button"));
    expect(row(t, "Button", "variant")).toMatchObject({
      type: '"default" | "secondary" | "ghost" | "destructive" | "link"',
      default: '"default"',
    });
    expect(row(t, "Button", "size")?.default).toBe('"default"');
    const busy = row(t, "Button", "busy");
    expect(busy?.default).toBe("false");
    expect(busy?.doc).toContain("spinner");
    expect(t.find((x) => x.part === "Button")?.inherits).toContain("<button>");
  });

  test("dialog: one table per part, in index.ts's order", () => {
    expect(apiTables(item("dialog")).map((t) => t.part)).toEqual([
      "Dialog",
      "DialogTitle",
      "DialogPortal",
      "DialogFooter",
      "DialogHeader",
      "DialogTrigger",
      "DialogOverlay",
      "DialogContent",
      "DialogDescription",
      "DialogClose",
    ]);
  });

  test("marketing-bar: its 8 props", () => {
    const t = apiTables(item("marketing-bar"));
    expect(t[0].rows.map((r) => r.name)).toEqual([
      "logo",
      "homeLabel",
      "links",
      "secondary",
      "primary",
      "label",
      "overlay",
      "class",
    ]);
  });

  test("0 API rows match a citation pattern", () => {
    const hits: string[] = [];
    for (const i of registry.items)
      for (const t of apiTables(i))
        for (const r of t.rows) {
          const text = [r.name, r.type, r.default, r.doc].join(" ");
          if (citationsIn(text).length)
            hits.push(`${i.name} ${t.part}.${r.name}`);
        }
    expect(hits).toEqual([]);
  });
});
