import { describe, expect, test } from "bun:test";
import {
  itemFiles,
  lintFiles,
  lintText,
  loadRules,
} from "../../scripts/lint-literals.ts";

const rules = loadRules();

describe("the item files", () => {
  const files = itemFiles();

  test("are the 4 files items carry", () => {
    expect(files.sort()).toEqual(
      [
        "src/lib/registry/ui/four-dot/four-dot.svelte",
        "src/lib/registry/ui/four-dot/index.ts",
        "src/lib/registry/ui/four-dot/lockup.svelte",
        "src/lib/utils.ts",
      ].sort(),
    );
  });

  test("hold 0 literal colours or sizes", () => {
    expect(lintFiles(files, rules)).toEqual([]);
  });
});

describe("the lint itself", () => {
  const BAD = [
    "#14161C",
    "#abc",
    "oklch(0.5 0.2 264)",
    "rgb(0 0 0)",
    '<span class="bg-red-500"></span>',
    '<span class="text-white"></span>',
    '<span class="p-[13px]"></span>',
    '<span class="text-[#fff]"></span>',
    "<style>\n\tp { color: red; }\n</style>",
    '<span style="margin: 4px"></span>',
    '<span class="p-5"></span>',
    '<span class="gap-1.5"></span>',
    '<span class="mt-px"></span>',
    '<span class="hover:-mx-7"></span>',
    '<span class="font-black"></span>',
    '<span class="leading-7"></span>',
    '<span class="[margin:13px]"></span>',
    '<span class="[color:red]"></span>',
    '<span class="bg-[red]"></span>',
    '<span class="bg-[color-mix(in_srgb,red,blue)]"></span>',
    '<span class="bg-black/[.5]"></span>',
    '<span {...{ style: "margin: 13px" }}></span>',
    'el.style.margin = "13px";',
    '<span class="inset-shadow-red-500"></span>',
    '<span class="text-shadow-black"></span>',
    '<span class="duration-300"></span>',
    '<span class="delay-150"></span>',
  ];
  const GOOD = [
    '<span class="p-4"></span>',
    '<span class="gap-(--mark-gap)"></span>',
    '<span class="mx-auto"></span>',
    '<span class="bg-mark-1"></span>',
    '<span class="bg-current"></span>',
    '<span class="size-(--mark-dot)"></span>',
    '<span class="font-bold"></span>',
    '<span class="leading-none"></span>',
    'import { cn } from "#lib/utils";',
    "{#each items as item}{item}{/each}",
    '<span class="space-x-reverse"></span>',
    '<span class="duration-(--motion-micro)"></span>',
  ];

  test("reads the palette from tailwindcss/theme.css", () => {
    expect(rules.palettes).toContain("red");
    expect(rules.palettes).toContain("slate");
    expect(rules.palettes.length).toBeGreaterThanOrEqual(22);
  });

  test.each(BAD)("flags %s", (sample) => {
    expect(lintText(sample, "<sample>", rules).length).toBeGreaterThan(0);
  });

  test.each(GOOD)("passes %s", (sample) => {
    expect(lintText(sample, "<sample>", rules)).toEqual([]);
  });

  test("27 bad samples and 12 good ones", () => {
    expect(
      BAD.filter((s) => lintText(s, "<sample>", rules).length > 0),
    ).toHaveLength(27);
    expect(
      GOOD.filter((s) => lintText(s, "<sample>", rules).length > 0),
    ).toHaveLength(0);
  });
});
