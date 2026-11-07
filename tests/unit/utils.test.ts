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

test("(d) 14 of 14 items that use tv import it from tailwind-variants/lite", () => {
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
      "sidebar",
      "message",
      "marker",
    ].sort(),
  );
});

// The sidebar's outline row writes its start width after
// the border shorthand, so the merge keeps it.
test("(e) a start border width written after the border shorthand survives cn; written before, it is dropped", () => {
  const kept = cn(
    "border-s-(length:--focus-width) border-transparent",
    "border border-input border-s-(length:--focus-width)",
  ).split(/\s+/);
  expect(kept).toContain("border");
  expect(kept).toContain("border-s-(length:--focus-width)");
  const dropped = cn("border-s-(length:--focus-width)", "border").split(/\s+/);
  expect(dropped).not.toContain("border-s-(length:--focus-width)");
});

// 009 decision 8, after the build's review (finding 1): button's radius is
// the arbitrary `rounded-[var(--radius-action,var(--radius))]`, which cn
// reads as a radius, so an app's own `rounded-*` on button merges and wins.
const BUTTON_RADIUS = "rounded-[var(--radius-action,var(--radius))]";

test("(f) cn merges button's radius with an app's rounded-*: the app's class wins", () => {
  expect(cn(BUTTON_RADIUS, "rounded-none")).toBe("rounded-none");
  expect(cn(BUTTON_RADIUS, "rounded-[4px]")).toBe("rounded-[4px]");
  expect(cn(BUTTON_RADIUS, "rounded-(--chip-radius)")).toBe(
    "rounded-(--chip-radius)",
  );
});

// Review finding 1: the fallback lives in the component, so an app whose
// stylesheet has no `@utility rounded-action` still gets 8 px corners.
test("button's classes compile to its radius with Tailwind alone, no theme", async () => {
  const { compile } = await import("tailwindcss");
  const source = readFileSync(
    "src/lib/registry/ui/button/button.svelte",
    "utf8",
  );
  const base = /base:\s*"([^"]+)"/.exec(source)?.[1] ?? "";
  expect(base.split(/\s+/)).toContain(BUTTON_RADIUS);
  const css = (await compile("@tailwind utilities;", {})).build(
    base.split(/\s+/),
  );
  expect(css).toContain("border-radius: var(--radius-action,var(--radius));");
});
