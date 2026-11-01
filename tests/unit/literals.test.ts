import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import {
  itemFiles,
  lintFiles,
  lintText,
  loadRules,
} from "../../scripts/lint-literals.ts";

const rules = loadRules();

// L1 to L21 are the lint's rules, numbered in scripts/lint-literals.ts. R14 is
// a row of 002's rule table.

/**
 * 007 decision 7: 301 files, 006's 300 plus code-languages (1).
 * 006 decision 13: 300 files, 005's 286 plus the 14 of app-shell (9) and
 * chat (5).
 */
const FILE_COUNT = 301;

describe("the item files", () => {
  const files = itemFiles();

  test(`are the ${FILE_COUNT} files items carry, with no repeats`, () => {
    expect(files).toHaveLength(FILE_COUNT);
    expect(new Set(files).size).toBe(FILE_COUNT);
    for (const file of files) expect(readFileSync(file, "utf8")).toBeTruthy();
  });

  test("hold 0 literal colours or sizes", () => {
    expect(lintFiles(files, rules)).toEqual([]);
  });
});

/** A sample: raw text, or a class linted inside `<span class="…">`, with a file name. */
type Sample =
  string | { cls: string; file?: string } | { text: string; file?: string };

function lintSample(sample: Sample) {
  if (typeof sample === "string")
    return lintText(sample, "sample.svelte", rules);
  if ("text" in sample)
    return lintText(sample.text, sample.file ?? "sample.svelte", rules);
  return lintText(
    `<span class="${sample.cls}"></span>`,
    sample.file ?? "sample.svelte",
    rules,
  );
}

function label(sample: Sample): string {
  if (typeof sample === "string") return sample;
  const shown = "text" in sample ? sample.text : sample.cls;
  return sample.file ? `${shown} in ${sample.file}` : shown;
}

// 001 decision 25: 27 bad and 12 good.
const BAD_001: Sample[] = [
  "#14161C",
  "#abc",
  "oklch(0.5 0.2 264)",
  "rgb(0 0 0)",
  { cls: "bg-red-500" },
  { cls: "text-white" },
  { cls: "p-[13px]" },
  { cls: "text-[#fff]" },
  "<style>\n\tp { color: red; }\n</style>",
  '<span style="margin: 4px"></span>',
  { cls: "p-5" },
  { cls: "gap-1.5" },
  { cls: "mt-px" },
  { cls: "hover:-mx-7" },
  { cls: "font-black" },
  { cls: "leading-7" },
  { cls: "[margin:13px]" },
  { cls: "[color:red]" },
  { cls: "bg-[red]" },
  { cls: "bg-[color-mix(in_srgb,red,blue)]" },
  { cls: "bg-black/[.5]" },
  '<span {...{ style: "margin: 13px" }}></span>',
  'el.style.margin = "13px";',
  { cls: "inset-shadow-red-500" },
  { cls: "text-shadow-black" },
  { cls: "duration-300" },
  { cls: "delay-150" },
];
const GOOD_001: Sample[] = [
  { cls: "p-4" },
  { cls: "gap-(--mark-gap)" },
  { cls: "mx-auto" },
  { cls: "bg-mark-1" },
  { cls: "bg-current" },
  { cls: "size-(--mark-dot)" },
  { cls: "font-bold" },
  { cls: "leading-none" },
  { text: 'import { cn } from "#lib/utils";' },
  { text: "{#each items as item}{item}{/each}" },
  { cls: "space-x-reverse" },
  { cls: "duration-(--motion-micro)" },
];

// 002 decision 21: 32 new bad and 24 new good.
const BAD_002: Sample[] = [
  { cls: "focus-visible:ring-ring/50" },
  { cls: "bg-input/30" },
  { cls: "hover:bg-primary/80" },
  { cls: "text-foreground/60" },
  { cls: "border-destructive/50" },
  { cls: "dark:text-muted-foreground" },
  { cls: "dark:bg-destructive/10" },
  { cls: "bg-destructive/20" },
  { cls: "ring-1" },
  { cls: "ring-offset-2" },
  { cls: "outline-none" },
  { cls: "outline-hidden" },
  { cls: "shadow-2xl" },
  { cls: "shadow-sm" },
  { cls: "drop-shadow-md" },
  { cls: "supports-backdrop-filter:backdrop-blur-xs" },
  { cls: "h-9" },
  { cls: "size-3.5" },
  { cls: "min-w-36" },
  { cls: "w-px" },
  { cls: "text-lg" },
  { cls: "tracking-tight" },
  { cls: "animate-pulse" },
  { cls: "data-open:animate-in" },
  { cls: "zoom-in-95" },
  { cls: "animate-caret-blink" },
  { cls: "rounded-full", file: "card.svelte" },
  { cls: "cn-font-heading" },
  { cls: "focus-visible:focus-ring-none", file: "input.svelte" },
  { cls: "border-l-4" },
  { cls: "border-2" },
  { cls: "w-11" },
];
const GOOD_002: Sample[] = [
  { cls: "bg-destructive/10" },
  { cls: "dark:bg-destructive/20" },
  { cls: "bg-success/10" },
  { cls: "dark:bg-success/20" },
  { cls: "shadow-elevation" },
  { cls: "bg-scrim" },
  { cls: "has-[:focus-visible]:focus-ring", file: "input-otp.svelte" },
  { cls: "focus-visible:focus-ring-none", file: "input-group-input.svelte" },
  { cls: "h-lh" },
  { cls: "size-4" },
  { cls: "min-h-16" },
  { cls: "max-w-xs" },
  { cls: "w-full" },
  { cls: "text-5xl" },
  { cls: "tracking-section" },
  { cls: "data-open:animate-enter" },
  { cls: "data-closed:animate-exit" },
  { cls: "animate-spin" },
  { cls: "rounded-full", file: "four-dot.svelte" },
  { cls: "aria-invalid:border-destructive" },
  { cls: "text-destructive" },
  { cls: "h-(--line-width)" },
  { cls: "border-b-(length:--focus-width)" },
  { cls: "border-0" },
];

// 5 more bad and 3 more good.
const BAD_ADDED: Sample[] = [
  { cls: "focus-visible:focus-ring", file: "button.svelte" },
  { cls: "inset-x-3.5" },
  { cls: "bg-(--color-red-500)" },
  { text: '<svg><path fill="red" /></svg>' },
  { cls: "data-open:scale-95" },
];
const GOOD_ADDED: Sample[] = [
  { cls: "active:translate-y-px" },
  { cls: "top-1/2" },
  { cls: "inset-0" },
];

// 003 decision 19: three block strings, each linted as a class.
const GOOD_003: Sample[] = [
  { cls: "Enter an email address like name@example.com" },
  { cls: "That code is not right. Check the email, or send a new code." },
  { cls: "Go to the home page" },
];

// 004 decision 15: L20, an injected stylesheet; L21, CSS values in a theme
// file; and the two allowlist additions for code-block's ring.
const BAD_004: Sample[] = [
  { text: '<svelte:element this="style" />' },
  { text: '<svelte:element this={"style"} />' },
  { text: 'const theme = { fontSize: "13px" };', file: "theme.ts" },
  { text: 'const theme = { color: "red" };', file: "theme.ts" },
  {
    cls: "has-[[data-slot=code-block-content]:focus-visible]:focus-ring",
    file: "card.svelte",
  },
  { cls: "focus-visible:focus-ring-none", file: "card.svelte" },
];
const GOOD_004: Sample[] = [
  {
    text: 'const theme = { outline: "var(--focus-width) solid var(--ring)" };',
    file: "theme.ts",
  },
  {
    text: 'const theme = { padding: "0 calc(var(--spacing) * 2)" };',
    file: "theme.ts",
  },
  {
    text: 'const theme = { textDecoration: "underline wavy" };',
    file: "theme.ts",
  },
  {
    cls: "has-[[data-slot=code-block-content]:focus-visible]:focus-ring",
    file: "code-block.svelte",
  },
  { cls: "focus-visible:focus-ring-none", file: "code-block-content.svelte" },
];

// 006 decision 4: 002's R14 list gains `mark-entrance`, a @utility of its own
// name, which the animate-* rule does not see; an animate-* spelling of the
// dock is still flagged.
const BAD_006: Sample[] = [{ cls: "animate-mark-dock" }];
const GOOD_006: Sample[] = [{ cls: "mark-entrance", file: "four-dot.svelte" }];

// 007 decision 3: L19, a syntax colour in any form; the code slot's class
// stays allowed.
const BAD_007: Sample[] = [
  { cls: "text-syntax-orange" },
  { cls: "text-(--syntax-orange)" },
  { text: 'const theme = { color: "var(--syntax-teal)" };', file: "theme.ts" },
];
const GOOD_007: Sample[] = [{ cls: "text-code-number" }];

const BAD = [
  ...BAD_001,
  ...BAD_002,
  ...BAD_ADDED,
  ...BAD_004,
  ...BAD_006,
  ...BAD_007,
];
const GOOD = [
  ...GOOD_001,
  ...GOOD_002,
  ...GOOD_ADDED,
  ...GOOD_003,
  ...GOOD_004,
  ...GOOD_006,
  ...GOOD_007,
];

describe("the lint itself", () => {
  test("reads the palette from tailwindcss/theme.css", () => {
    expect(rules.palettes).toContain("red");
    expect(rules.palettes).toContain("slate");
    expect(rules.palettes.length).toBeGreaterThanOrEqual(22);
  });

  test.each(BAD.map((s) => [label(s), s] as const))("flags %s", (_, sample) => {
    expect(lintSample(sample).length).toBeGreaterThan(0);
  });

  test.each(GOOD.map((s) => [label(s), s] as const))(
    "passes %s",
    (_, sample) => {
      expect(lintSample(sample)).toEqual([]);
    },
  );

  test("74 bad samples flagged and 0 of 49 good ones", () => {
    expect(BAD).toHaveLength(74);
    expect(GOOD).toHaveLength(49);
    expect(BAD.filter((s) => lintSample(s).length > 0)).toHaveLength(74);
    expect(GOOD.filter((s) => lintSample(s).length > 0)).toHaveLength(0);
  });

  // L19's three forms each name the rule, and `bg-syntax-orange/10` is L1's.
  test("L19 names its rule on the 3 forms; the tint form is a translucent tint", () => {
    for (const sample of BAD_007)
      expect(lintSample(sample).map((v) => v.rule)).toContain("syntax colour");
    expect(
      lintSample({ cls: "bg-syntax-orange/10" }).map((v) => v.rule),
    ).toEqual(["syntax colour", "translucent tint"]);
  });
});
