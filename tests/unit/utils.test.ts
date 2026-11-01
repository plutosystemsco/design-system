import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { tv } from "tailwind-variants/lite";
import { cn } from "../../src/lib/utils.ts";

test("a later padding wins", () => {
  expect(cn("p-2", "p-4")).toBe("p-4");
});

test("a later background colour wins", () => {
  expect(cn("bg-primary", "bg-destructive")).toBe("bg-destructive");
});

test("a text size and a text colour are both kept", () => {
  expect(cn("text-sm", "text-destructive")).toBe("text-sm text-destructive");
});

// 002 decision 2: cn is the one merge engine; tailwind-variants/lite does not merge.
const variants = tv({
  base: "px-3 text-base",
  variants: { size: { wide: "px-4" } },
});

test("(a) tailwind-variants/lite leaves both classes", () => {
  const out = variants({ size: "wide" }).split(/\s+/);
  expect(out).toContain("px-3");
  expect(out).toContain("px-4");
});

test("(b) cn of that string keeps only px-4", () => {
  const out = cn(variants({ size: "wide" })).split(/\s+/);
  expect(out).toContain("px-4");
  expect(out).not.toContain("px-3");
});

test("(c) cn keeps a text size and a later text colour", () => {
  const out = cn(variants(), "text-destructive").split(/\s+/);
  expect(out).toContain("text-base");
  expect(out).toContain("text-destructive");
});

test("(d) 11 of 11 items that use tv import it from tailwind-variants/lite", () => {
  const registry = JSON.parse(readFileSync("registry.json", "utf8"));
  const files: string[] = registry.items.flatMap(
    (i: { files?: { path: string }[] }) => (i.files ?? []).map((f) => f.path),
  );
  const users = new Set<string>();
  for (const file of files) {
    const text = readFileSync(file, "utf8");
    for (const m of text.matchAll(
      /^\s*import\s+(type\s+)?[^;]*?from\s+["']tailwind-variants(\/[\w-]+)?["']/gm,
    )) {
      const typeOnly = !!m[1];
      const entry = m[2] ?? "";
      if (!typeOnly)
        expect(entry, `${file} imports tv from lite`).toBe("/lite");
      // An item counts whether it imports tv or only its types: both must come from lite.
      if (entry === "/lite") users.add(file.split("/")[4]);
    }
  }
  expect([...users].sort()).toEqual(
    [
      "alert",
      "badge",
      "button",
      "code-block",
      "empty",
      "field",
      "input-group",
      "item",
      "tabs",
      "toggle",
      "toggle-group",
    ].sort(),
  );
});
