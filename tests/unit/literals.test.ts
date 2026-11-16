import { describe, expect, test } from "bun:test";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  itemFiles,
  itemProfiles,
  lintFiles,
  lintText,
  loadRules,
  SYNTAX_COLOUR,
} from "../../scripts/lint-literals.ts";

const rules = loadRules();

// L1 to L21 are the lint's rules, numbered in scripts/lint-literals.ts. R14 is
// a row of 002's rule table.

/**
 * 027b test 4: 373 files, as pagination (3), search-field (2) and tag (3) add 8.
 * 027a test 4: 359 files, as link, button-group and progress add 2 each.
 * 026 decision 1, test 40: 365 files, merged after 027a, as toast adds its six.
 * 020 decision 5: 353 files, as theme gains stored.ts.
 * 013 decisions 5 and 16: 352 files, as highlighter grows from 1 file to 29
 * (its 24 query files among them) and code-editor gains its highlighting.
 * "Frost only, no lens" (decisions.md, 2026-11-07): 323 files, as liquid-glass
 * loses glass-lens.svelte.
 * 011 decision 8: 324 files, 010's 321 plus liquid-glass (3).
 * 010 decision 1: 321 files, 009's 302 plus the nine compositions (two each)
 * and product-home's page (1).
 * 009 decision 10: 302 files, 007's 301 plus read-token (1).
 * 007 decision 7: 301 files, 006's 300 plus code-languages (1).
 * 006 decision 13: 300 files, 005's 286 plus the 14 of app-shell (9) and
 * chat (5).
 */
const FILE_COUNT = 373;

describe("the item files", () => {
  const files = itemFiles();

  // 026 test 40: the six toast files are linted.
  test("hold toast's six files", () => {
    for (const f of [
      "toast-queue.ts",
      "toast-words.ts",
      "toast.ts",
      "toaster.svelte",
      "toast.svelte",
      "index.ts",
    ])
      expect(files).toContain(`src/lib/registry/ui/toast/${f}`);
  });

  test(`are the ${FILE_COUNT} files items carry, with no repeats`, () => {
    expect(files).toHaveLength(FILE_COUNT);
    expect(new Set(files).size).toBe(FILE_COUNT);
    for (const file of files) expect(readFileSync(file, "utf8")).toBeTruthy();
  });

  // 011 criterion 7: zero violations, zero exceptions, and L24's one
  // counted allowance, in liquid-glass's pointer-light.ts.
  test("hold 0 literal colours or sizes, and 1 counted allowance (L24)", () => {
    const allowances: ReturnType<typeof lintFiles> = [];
    expect(lintFiles(files, rules, undefined, undefined, allowances)).toEqual(
      [],
    );
    expect(allowances.map((a) => [a.file, a.rule])).toEqual([
      ["src/lib/registry/ui/liquid-glass/pointer-light.ts", "L24"],
    ]);
  });
});

// 027b test 4: batch A's interactive items' eight files are in the lint's
// list, with 0 literals and 0 allowances.
describe("027b test 4: batch A's interactive files", () => {
  const BATCH_B_FILES = [
    "src/lib/registry/ui/pagination/pagination.svelte",
    "src/lib/registry/ui/pagination/pagination-pages.ts",
    "src/lib/registry/ui/pagination/index.ts",
    "src/lib/registry/ui/search-field/search-field.svelte",
    "src/lib/registry/ui/search-field/index.ts",
    "src/lib/registry/ui/tag/tag-group.svelte",
    "src/lib/registry/ui/tag/tag.svelte",
    "src/lib/registry/ui/tag/index.ts",
  ];

  test("are linted, with 0 literals and 0 allowances", () => {
    const files = itemFiles();
    for (const f of BATCH_B_FILES) expect(files, f).toContain(f);
    const allowances: ReturnType<typeof lintFiles> = [];
    expect(
      lintFiles(BATCH_B_FILES, rules, undefined, undefined, allowances),
    ).toEqual([]);
    expect(allowances).toEqual([]);
  });
});

// 027a test 4: batch A's six files are in the lint's list, with 0 literals
// and 0 allowances.
describe("027a test 4: batch A's files", () => {
  const BATCH_A_FILES = [
    "src/lib/registry/ui/link/link.svelte",
    "src/lib/registry/ui/link/index.ts",
    "src/lib/registry/ui/button-group/button-group.svelte",
    "src/lib/registry/ui/button-group/index.ts",
    "src/lib/registry/ui/progress/progress.svelte",
    "src/lib/registry/ui/progress/index.ts",
  ];

  test("are linted, with 0 literals and 0 allowances", () => {
    const files = itemFiles();
    for (const f of BATCH_A_FILES) expect(files, f).toContain(f);
    const allowances: ReturnType<typeof lintFiles> = [];
    expect(
      lintFiles(BATCH_A_FILES, rules, undefined, undefined, allowances),
    ).toEqual([]);
    expect(allowances).toEqual([]);
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
// 008 decision 5: `mark-reveal`, the hover reveal, joins the list.
const GOOD_008: Sample[] = [
  { cls: "mark-reveal", file: "app-shell-footer.svelte" },
];

// 007 decision 3: L19, a syntax colour in any form; the code role's class
// stays allowed. 013 decision 12 moves the samples to its own names.
const BAD_007: Sample[] = [
  { cls: "text-syntax-violet" },
  { cls: "text-(--syntax-blue)" },
  { text: 'const theme = { color: "var(--syntax-navy)" };', file: "theme.ts" },
];
const GOOD_007: Sample[] = [{ cls: "text-code-number" }];

// 014 decision 9: L19 also names the two code grounds; an item reaches them
// through the code map's classes or variables alone.
const BAD_014: Sample[] = [
  { cls: "bg-syntax-ground" },
  { cls: "bg-(--syntax-active-line)" },
  {
    text: 'const theme = { background: "var(--syntax-ground)" };',
    file: "theme.ts",
  },
];
const GOOD_014: Sample[] = [
  { cls: "bg-code-background" },
  { cls: "bg-code-active-line" },
];

const BAD = [
  ...BAD_001,
  ...BAD_002,
  ...BAD_ADDED,
  ...BAD_004,
  ...BAD_006,
  ...BAD_007,
  ...BAD_014,
];
const GOOD = [
  ...GOOD_001,
  ...GOOD_002,
  ...GOOD_ADDED,
  ...GOOD_003,
  ...GOOD_004,
  ...GOOD_006,
  ...GOOD_008,
  ...GOOD_007,
  ...GOOD_014,
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

  test("77 bad samples flagged and 0 of 52 good ones", () => {
    expect(BAD).toHaveLength(77);
    expect(GOOD).toHaveLength(52);
    expect(BAD.filter((s) => lintSample(s).length > 0)).toHaveLength(77);
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

  // 013 decision 6: a query file is item source too, read by the text rules.
  test("a .scm query file is read: a syntax colour or a hex in one fails, a query of roles passes", () => {
    expect(
      lintText("; text-syntax-red\n(comment) @comment\n", "x.scm", rules).map(
        (v) => v.rule,
      ),
    ).toContain("syntax colour");
    expect(
      lintText("; #C4581B\n(comment) @comment\n", "x.scm", rules).map(
        (v) => v.rule,
      ),
    ).toContain("hex colour");
    expect(
      lintText(
        '(comment) @comment\n((identifier) @constant (#match? @constant "^[A-Z][A-Z0-9_]+$"))\n["if" "else"] @keyword\n',
        "x.scm",
        rules,
      ),
    ).toEqual([]);
  });

  // 014 decision 9: one pattern for 0.12.0, written once for 014's names and 013's.
  test("L19's pattern is 014 decision 9's, exactly, and names its rule on the 3 new samples", () => {
    expect(SYNTAX_COLOUR.source).toBe(
      "syntax-(?:orange|amber|purple|teal|cyan|violet|blue|navy|green|yellow|plum|red|grey|ink|ground|active-line)\\b",
    );
    expect(SYNTAX_COLOUR.flags).toBe("g");
    for (const sample of BAD_014)
      expect(lintSample(sample).map((v) => v.rule)).toContain("syntax colour");
  });
});

/**
 * 009 decision 9, criterion 5: L22, expressive volume. Its class tokens and
 * the attribute fail in a file of any item whose `meta.modes` is not exactly
 * ["expressive"], and pass in one that is. 012 decision 1 removes the stage
 * and its light from the list: `bloom`, `rim`, `energized`, `veil` and
 * `surface-stage` are no longer utilities.
 */
const L22_CLASSES = [
  "type-display",
  "type-section",
  "type-proof",
  "action-press",
  // 011 decisions 6, 8 and 9: the brand's expressive tools.
  "type-poster",
  "field-1",
  "field-2",
  "field-3",
  "field-4",
  "surface-plain",
  "glass",
  // 012 decision 5: the busy edge is expressive volume.
  "busy-edge",
];
const L22_SAMPLES: Sample[] = [
  ...L22_CLASSES.map((cls) => ({ cls })),
  { text: '<section data-mode="expressive"></section>' },
];

describe("L22, expressive volume", () => {
  const lint = (sample: Sample, modes: ("productive" | "expressive")[]) => {
    const [text, file] =
      typeof sample === "string"
        ? [sample, "sample.svelte"]
        : "text" in sample
          ? [sample.text, sample.file ?? "sample.svelte"]
          : [`<span class="${sample.cls}"></span>`, "sample.svelte"];
    return lintText(text, file, rules, modes);
  };

  test("12 class tokens and 1 attribute", () => {
    expect(L22_CLASSES).toHaveLength(12);
    expect(L22_SAMPLES).toHaveLength(13);
  });

  // 012 decision 1: the five removed names are plain words to the lint now.
  test.each(["bloom", "rim", "energized", "veil", "surface-stage"])(
    "passes %s in a productive item: it is no longer L22's",
    (cls) => {
      expect(lint({ cls }, ["productive"])).toEqual([]);
    },
  );

  test.each(L22_SAMPLES.map((s) => [label(s), s] as const))(
    "fails %s in a productive item",
    (_, sample) => {
      expect(lint(sample, ["productive"]).map((v) => v.rule)).toEqual([
        "expressive volume",
      ]);
    },
  );

  test.each(L22_SAMPLES.map((s) => [label(s), s] as const))(
    "fails %s in an item of both modes",
    (_, sample) => {
      expect(
        lint(sample, ["productive", "expressive"]).map((v) => v.rule),
      ).toEqual(["expressive volume"]);
    },
  );

  test.each(L22_SAMPLES.map((s) => [label(s), s] as const))(
    "passes %s in an expressive-only item",
    (_, sample) => {
      expect(lint(sample, ["expressive"])).toEqual([]);
    },
  );

  // Review finding 3: the ordinary ways round the rule. Each is a count of
  // L22 violations in a productive item, in an item of both modes, and none
  // in an expressive-only one.
  const BYPASSES: [string, string, number][] = [
    [
      "six names as keys of a class object",
      '<div class={{ glass: lit, "field-1": true, "surface-plain": open, "type-poster": busy, "type-display": big, \'action-press\': p }}></div>',
      6,
    ],
    ["an unquoted attribute", "<section data-mode=expressive></section>", 1],
    ["a spread object", '<div {...{ "data-mode": "expressive" }}></div>', 1],
    ["a braced string", '<div data-mode={"expressive"}></div>', 1],
    [
      "a setAttribute call",
      '<script>el.setAttribute("data-mode", mode);</script>',
      1,
    ],
    [
      "a dataset.mode assignment",
      '<script>el.dataset.mode = "expressive";</script>',
      1,
    ],
    [
      "a dataset.mode assignment from a variable",
      "<script>node.dataset.mode = mode;</script>",
      1,
    ],
  ];

  test.each(BYPASSES)("fails %s", (_, text, count) => {
    for (const modes of [
      ["productive"],
      ["productive", "expressive"],
    ] as const) {
      const rules = lint({ text }, [...modes]).map((v) => v.rule);
      expect(rules).toEqual(Array(count).fill("expressive volume"));
    }
    expect(lint({ text }, ["expressive"])).toEqual([]);
  });

  test("reading the mode, or setting it productive, passes", () => {
    for (const text of [
      '<script>const m = el.dataset.mode === "expressive";</script>',
      '<script>el.getAttribute("data-mode");</script>',
      '<div {...{ "data-mode": "productive" }}></div>',
      "<section data-mode=productive></section>",
      "<div class={{ hidden: !open }}></div>",
    ])
      expect(lint({ text }, ["productive"])).toEqual([]);
  });

  test("a variant does not hide a token: md:type-display and hover:glass fail", () => {
    for (const cls of ["md:type-display", "hover:glass", "!field-2"])
      expect(lint({ cls }, ["productive"]).map((v) => v.rule)).toEqual([
        "expressive volume",
      ]);
  });

  test("the default profile is productive, and the mode's own utility and the variable forms pass", () => {
    expect(lintText('<span class="glass"></span>', "x.svelte", rules)).toEqual([
      expect.objectContaining({ rule: "expressive volume", text: "glass" }),
    ] as never);
    for (const cls of [
      "rounded-action",
      // button's radius (review finding 1): neither L7 nor L22 reads it.
      "rounded-[var(--radius-action,var(--radius))]",
      "h-(--size-bar)",
      "duration-(--motion-press)",
      "px-(--gutter-stage)",
    ])
      expect(lint({ cls }, ["productive"])).toEqual([]);
    expect(
      lint({ text: '<div data-mode="productive"></div>' }, ["productive"]),
    ).toEqual([]);
  });

  test("the registry's profiles: every item file is linted with its item's modes", () => {
    const profiles = itemProfiles();
    expect(profiles.size).toBe(itemFiles().length);
    expect(profiles.get("src/lib/registry/ui/button/button.svelte")).toEqual([
      "productive",
      "expressive",
    ]);
    expect(
      profiles.get("src/lib/registry/ui/sidebar/sidebar-trigger.svelte"),
    ).toEqual(["productive"]);
  });
});

// 009 decision 9: an installed app has no registry.json; its files take the
// productive profile, so the smoke tests' lint of an app holds L22.
test("itemProfiles of a folder with no registry.json is empty, and lintFiles there holds L22", () => {
  const app = mkdtempSync(path.join(tmpdir(), "kuiper-l22-"));
  try {
    writeFileSync(path.join(app, "card.svelte"), '<div class="glass"></div>');
    expect(itemProfiles(app).size).toBe(0);
    expect(lintFiles(["card.svelte"], rules, app).map((v) => v.rule)).toEqual([
      "expressive volume",
    ]);
  } finally {
    rmSync(app, { recursive: true, force: true });
  }
});

/** 011 decision 10, L23: springs are for dots. */
describe("L23, the spring outside the dots", () => {
  const SAMPLES = [
    '<span class="ease-(--ease-spring)"></span>',
    "const curve = readToken('ease-spring');",
    "transition: transform 1s var(--ease-spring);",
  ];

  test.each(SAMPLES)("fails %s in a productive item's file", (text) => {
    expect(
      lintText(text, "sample.svelte", rules, ["productive"], ["card"]).map(
        (v) => v.rule,
      ),
    ).toEqual(["spring outside the dots"]);
  });

  test.each(SAMPLES)(
    "fails %s in an expressive-only item's file too",
    (text) => {
      expect(
        lintText(text, "sample.svelte", rules, ["expressive"], ["stage"]).map(
          (v) => v.rule,
        ),
      ).toEqual(["spring outside the dots"]);
    },
  );

  test.each(SAMPLES)("passes %s in four-dot and in kuiper-theme", (text) => {
    for (const item of ["four-dot", "kuiper-theme"])
      expect(
        lintText(text, "sample.svelte", rules, ["productive"], [item]),
      ).toEqual([]);
  });

  test("a file outside every item, or listed by four-dot and another item, fails", () => {
    const text = SAMPLES[0];
    expect(lintText(text, "x.svelte", rules).map((v) => v.rule)).toEqual([
      "spring outside the dots",
    ]);
    expect(
      lintText(
        text,
        "x.svelte",
        rules,
        ["productive"],
        ["four-dot", "card"],
      ).map((v) => v.rule),
    ).toEqual(["spring outside the dots"]);
  });
});

/** 011 decision 8, L24: the one style write, the glass's pointer light. */
describe("L24, the one style write", () => {
  const FILE = "src/lib/registry/ui/liquid-glass/pointer-light.ts";
  const CALL =
    'element.style.setProperty(`--glass-${name}`, value);\nnode.style.setProperty("--glass-lit", "0");';

  test("passes in liquid-glass's pointer-light.ts, counting each call as an allowance", () => {
    const allowances: ReturnType<typeof lintText> = [];
    expect(
      lintText(CALL, FILE, rules, ["expressive"], ["liquid-glass"], allowances),
    ).toEqual([]);
    expect(allowances.map((a) => [a.rule, a.line])).toEqual([
      ["L24", 1],
      ["L24", 2],
    ]);
  });

  test("fails the same call in any other file, or in a file of that name in another item", () => {
    for (const [file, items] of [
      ["src/lib/registry/ui/stage/light.ts", ["stage"]],
      ["src/lib/registry/ui/liquid-glass/index.ts", ["liquid-glass"]],
      ["src/lib/registry/ui/stage/pointer-light.ts", ["stage"]],
    ] as const)
      expect(
        lintText(CALL, file, rules, ["expressive"], items).map((v) => v.rule),
        file,
      ).toEqual(["style property", "style property"]);
  });

  test("allows no other style write in pointer-light.ts", () => {
    for (const text of [
      'element.style.setProperty("--x", "1");',
      'element.style.opacity = "1";',
      'element.style.removeProperty("--glass-lit");',
    ])
      expect(
        lintText(text, FILE, rules, ["expressive"], ["liquid-glass"]).map(
          (v) => v.rule,
        ),
        text,
      ).toEqual(["style property"]);
  });
});
