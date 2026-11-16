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

describe("023: the universal three are written from the markup", () => {
  const marked = (name: string) => apiTables(item(name), { marks: true });
  const fixture = (file: string) =>
    apiTables(
      {
        name: file,
        files: [
          {
            path: `tests/unit/fixtures/api/${file}.svelte`,
            type: "registry:ui",
          },
        ],
      },
      { marks: true },
    );
  const only = (file: string, name: string) =>
    fixture(file)[0].rows.find((r) => r.name === name);

  test("card's Card: ref, class and children, each generated", () => {
    const t = marked("card");
    expect(row(t, "Card", "ref")).toMatchObject({
      doc: "The rendered `<div>`. Bind it with `bind:ref`.",
      generated: true,
    });
    expect(row(t, "Card", "class")).toMatchObject({
      doc: "Classes for the `<div>`, added after Kuiper's by `cn`.",
      generated: true,
    });
    expect(row(t, "Card", "children")).toMatchObject({
      doc: "The content of the `<div>`.",
      generated: true,
    });
  });

  test("button's Button: two targets join with or", () => {
    expect(row(marked("button"), "Button", "ref")?.doc).toBe(
      "The rendered `<a>` or `<button>`. Bind it with `bind:ref`.",
    );
  });

  test("dialog's DialogContent: a bits-ui part by its public name", () => {
    expect(row(marked("dialog"), "DialogContent", "class")?.doc).toBe(
      "Classes for bits-ui's `Dialog.Content`, added after Kuiper's by `cn`.",
    );
  });

  test("input's Input: two <input> branches name it once", () => {
    expect(row(marked("input"), "Input", "ref")?.doc).toBe(
      "The rendered `<input>`. Bind it with `bind:ref`.",
    );
  });

  test("without the option, no row has a generated key", () => {
    for (const name of ["card", "button", "dialog", "utils"])
      for (const t of apiTables(item(name)))
        for (const r of t.rows) expect("generated" in r).toBe(false);
  });

  test("the fact behind the wording: cn keeps a theme utility beside an app's", async () => {
    const { cn } = await import("../../src/lib/utils.ts");
    expect(cn("rounded-action", "rounded-lg")).toBe(
      "rounded-action rounded-lg",
    );
  });

  test("showType: a non-base index and the variant keys keep their text; a re-declared base member is inherited", () => {
    expect(
      row(apiTables(item("accordion")), "AccordionTrigger", "level")?.type,
    ).toBe('AccordionPrimitive.HeaderProps["level"]');
    const b = apiTables(item("button"));
    expect(row(b, "Button", "variant")?.type).toBe(
      '"default" | "secondary" | "ghost" | "destructive" | "link"',
    );
    expect(row(b, "Button", "href")).toMatchObject({ type: "" });
    expect(row(b, "Button", "href")?.doc).not.toBe("");
  });

  test("fixtures: an own comment wins; the forms the generator leaves", () => {
    expect(only("own-comment", "children")).toMatchObject({
      doc: "The item's own sentence, which the generator keeps.",
      generated: false,
    });
    expect(only("child-snippet", "class")?.doc).toBe("");
    expect(only("class-first", "class")?.doc).toBe("");
    expect(only("class-alone", "class")?.doc).toBe(
      "Classes for the `<section>`.",
    );
    expect(only("three-targets", "ref")?.doc).toBe("");
    expect(only("dynamic-element", "ref")?.doc).toBe("");
    expect(only("third-party", "class")?.doc).toBe("");
    expect(only("namespaced", "class")?.doc).toBe(
      "Classes for the `Card`, added after Kuiper's by `cn`.",
    );
    expect(only("snippet-boundary", "children")?.doc).toBe("");
  });
});
