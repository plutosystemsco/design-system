import { expect, test } from "bun:test";
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
