import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { execSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { registryItemSchema, registrySchema } from "shadcn-svelte/schema";
import { buildRegistry } from "../../scripts/build-registry.ts";
import { listedItems } from "../../src/lib/site/items.ts";

// 020 decision 3: the tests below read the listed items, the 78 a person
// meets; the alias entry is read whole in 020's own tests, at the end.
const registryRaw = JSON.parse(readFileSync("registry.json", "utf8"));
const registry = { ...registryRaw, items: listedItems(registryRaw.items) };
const version = JSON.parse(readFileSync("package.json", "utf8"))
  .version as string;

const CLI_VERSION = JSON.parse(
  readFileSync("node_modules/shadcn-svelte/package.json", "utf8"),
).version as string;

/** 001 decision 19's six. */
const ITEMS_001: [string, string][] = [
  ["kuiper-theme", "registry:theme"],
  ["font-geist", "registry:font"],
  ["font-heading-ibm-plex-sans", "registry:font"],
  ["font-jetbrains-mono", "registry:font"],
  ["utils", "registry:lib"],
  ["four-dot", "registry:ui"],
];

/**
 * 003 decision 5's 39 items, 004 decision 4's 10, 005 decision 4's 11, 006
 * decision 3's 2, 007 decision 7's 1, 009 decision 10's 1 and 010 decision
 * 1's 10 and 011 decision 8's 1, in order, each with its group: 75 items
 * in 11 groups.
 */
const GROUPS: [group: string, names: string[]][] = [
  [
    "foundation",
    [...ITEMS_001.map(([n]) => n), "theme", "read-token", "liquid-glass"],
  ],
  // 027a decision 1: button-group, progress and link end their groups.
  [
    "actions",
    ["button", "tooltip", "kbd", "toggle", "toggle-group", "button-group"],
  ],
  [
    "surfaces",
    [
      "card",
      "separator",
      "item",
      "table",
      "tabs",
      "collapsible",
      "avatar",
      "popover",
      "accordion",
    ],
  ],
  [
    "feedback",
    [
      "alert",
      "alert-dialog",
      "badge",
      "empty",
      "skeleton",
      "spinner",
      "status",
      "error-summary",
      "progress",
      // 026 decision 1.
      "toast",
    ],
  ],
  [
    "forms",
    [
      "label",
      "field",
      "input",
      "textarea",
      "input-group",
      "native-select",
      "checkbox",
      "radio-group",
      "switch",
      "input-otp",
    ],
  ],
  [
    "code",
    [
      "code-block",
      "code-editor",
      "highlighter",
      "use-highlighted-code",
      "code-languages",
    ],
  ],
  ["data", ["chart", "meter"]],
  [
    "navigation",
    [
      "dropdown-menu",
      "sheet",
      "dialog",
      "breadcrumb",
      "sidebar",
      "is-mobile",
      "link",
    ],
  ],
  ["chat", ["message-log", "message", "marker", "composer"]],
  // 010 decision 1 and decision 10: the compositions before the blocks.
  [
    "compositions",
    [
      "stage",
      "stage-card",
      "marketing-bar",
      "stage-hero",
      "proof-band",
      "live-console",
      "name-strip",
      "cta-band",
      "marketing-footer",
    ],
  ],
  [
    "blocks",
    [
      "hero",
      "sign-in",
      "sign-up",
      "page-states",
      "settings",
      "app-shell",
      "chat",
      "product-home",
    ],
  ],
];
/** 006 decision 3: the two blocks, with their titles. */
const ITEMS_006: [name: string, title: string][] = [
  ["app-shell", "App shell"],
  ["chat", "Chat"],
];
/** 005 decision 4: the eleven items, with their types and titles. */
const ITEMS_005: [name: string, type: string, title: string][] = [
  ["theme", "registry:ui", "Theme"],
  ["dropdown-menu", "registry:ui", "Dropdown menu"],
  ["sheet", "registry:ui", "Sheet"],
  ["dialog", "registry:ui", "Dialog"],
  ["breadcrumb", "registry:ui", "Breadcrumb"],
  ["sidebar", "registry:ui", "Sidebar"],
  ["is-mobile", "registry:hook", "Is mobile"],
  ["message-log", "registry:ui", "Message log"],
  ["message", "registry:ui", "Message"],
  ["marker", "registry:ui", "Marker"],
  ["composer", "registry:ui", "Composer"],
];
const TYPE_005 = new Map(ITEMS_005.map(([n, t]) => [n, t]));
/** 007 decision 7: 007's one item, a library with no meta.stock. */
const ITEMS_007: [name: string, type: string, title: string][] = [
  ["code-languages", "registry:lib", "Code languages"],
];
const TYPE_007 = new Map(ITEMS_007.map(([n, t]) => [n, t]));
/** 005 decision 3: the 8 stock-derived items (theme, message-log and composer carry no meta.stock). */
const STOCK_005 = [
  "dropdown-menu",
  "sheet",
  "dialog",
  "breadcrumb",
  "sidebar",
  "is-mobile",
  "message",
  "marker",
];
/** 005 decision 3: the stock sha256 of sidebar, read on the install date. */
const SIDEBAR_STOCK_SHA =
  "dc3cee148f49114d285fd01659c8bbb72a297b161e6526f20cdeaa02e2d92e2a";
/** 004 decision 4: the ten items, with their types and titles. */
const ITEMS_004: [name: string, type: string, title: string][] = [
  ["toggle", "registry:ui", "Toggle"],
  ["toggle-group", "registry:ui", "Toggle group"],
  ["popover", "registry:ui", "Popover"],
  ["accordion", "registry:ui", "Accordion"],
  ["code-block", "registry:ui", "Code block"],
  ["code-editor", "registry:ui", "Code editor"],
  ["highlighter", "registry:lib", "Highlighter"],
  ["use-highlighted-code", "registry:hook", "Use highlighted code"],
  ["chart", "registry:ui", "Chart"],
  ["meter", "registry:ui", "Meter"],
];
/** 004 decision 4: each item's group where it is not `code`. */
const GROUP_004: Record<string, string> = {
  toggle: "actions",
  "toggle-group": "actions",
  popover: "surfaces",
  accordion: "surfaces",
  chart: "data",
  meter: "data",
};
const TYPE_004 = new Map(ITEMS_004.map(([n, t]) => [n, t]));
/** 004 decision 3: the stock-derived items of 004 (code-editor and meter carry no meta.stock); 013 decision 5 makes highlighter ours, so 8 become 7. */
const STOCK_004 = [
  "toggle",
  "toggle-group",
  "popover",
  "accordion",
  "code-block",
  "use-highlighted-code",
  "chart",
];
/** 004 decision 3: the stock sha256 of chart, read on the install date. */
const CHART_STOCK_SHA =
  "dccff6d1f478d5469fdd93e3ddca5eb8c42732ae1ca494da79028c5cdc422d51";
/** 004 decision 2: the CodeMirror packages code-editor names, at their ranges; 013 decision 16 drops @lezer/highlight. */
const CODE_EDITOR_PACKAGES = [
  "@codemirror/autocomplete@^6.20.4",
  "@codemirror/commands@^6.11.1",
  "@codemirror/lang-python@^6.2.1",
  "@codemirror/language@^6.13.1",
  "@codemirror/state@^6.7.6",
  "@codemirror/view@^6.43.15",
];
/** 013 decision 5: the highlighter's 21 dependencies, at decision 3's specifiers. */
const HIGHLIGHTER_DEPENDENCIES = [
  "web-tree-sitter@^0.27.2",
  "tree-sitter-typescript@^0.23.2",
  "tree-sitter-javascript@^0.25.0",
  "tree-sitter-python@^0.25.0",
  "tree-sitter-rust@^0.24.0",
  "tree-sitter-go@^0.25.0",
  "tree-sitter-java@^0.23.5",
  "tree-sitter-c-sharp@^0.23.5",
  "tree-sitter-ruby@^0.23.1",
  "tree-sitter-html@^0.23.2",
  "tree-sitter-css@^0.25.0",
  "tree-sitter-bash@^0.25.1",
  "tree-sitter-json@^0.24.8",
  "@tree-sitter-grammars/tree-sitter-yaml@^0.7.1",
  "@tree-sitter-grammars/tree-sitter-toml@^0.7.0",
  "@tree-sitter-grammars/tree-sitter-svelte@~1.0.2",
  "tree-sitter-c@^0.24.1",
  "tree-sitter-cpp@^0.23.4",
  "tree-sitter-php@^0.24.2",
  "@tree-sitter-grammars/tree-sitter-kotlin@~1.1.0",
  "shiki@^4.5.0",
];
/** 013 decision 5: the 24 query files. */
const QUERY_FILES = [
  "javascript",
  "jsx",
  "javascript.locals",
  "typescript",
  "typescript-assertion",
  "typescript.locals",
  "python",
  "rust",
  "go",
  "java",
  "c-sharp",
  "ruby",
  "ruby.locals",
  "html",
  "css",
  "bash",
  "json",
  "yaml",
  "toml",
  "svelte",
  "c",
  "cpp",
  "php",
  "kotlin",
];
/**
 * 010 decision 1: the nine compositions, each with its title and its
 * registry dependencies, and the block. Every one is expressive-only, since
 * 0.11.0 (released with 009 and 011); the compositions are in their own
 * group, the block in `blocks`.
 */
const ITEMS_010: [name: string, title: string, deps: string[]][] = [
  ["stage", "Stage", []],
  ["stage-card", "Stage card", ["code-block", "button", "status"]],
  // 012 decisions 3 and 4: the hero's words and the bar sit on glass.
  ["marketing-bar", "Marketing bar", ["button", "sheet", "liquid-glass"]],
  ["stage-hero", "Stage hero", ["button", "liquid-glass"]],
  ["proof-band", "Proof band", ["read-token"]],
  [
    "live-console",
    "Live console",
    ["tabs", "code-block", "button", "meter", "status", "read-token"],
  ],
  ["name-strip", "Name strip", []],
  ["cta-band", "Call to action band", ["button"]],
  ["marketing-footer", "Marketing footer", []],
  [
    "product-home",
    "Product home",
    [
      "stage",
      "stage-card",
      "marketing-bar",
      "stage-hero",
      "proof-band",
      "live-console",
      "name-strip",
      "cta-band",
      "marketing-footer",
      "four-dot",
      // 012 decision 7 and criterion 9: the block declares the glass its
      // hero and bar use.
      "liquid-glass",
    ],
  ],
];
const NAMES_010 = ITEMS_010.map(([n]) => n);
/** The items held to the expressive profile alone: 010's ten and 011's liquid-glass. */
const EXPRESSIVE_ONLY = [...NAMES_010, "liquid-glass"];
/** 003 decision 5: the 2 new components and the 5 blocks; 006's 2 and 010's 1 join BLOCKS. */
const BLOCKS_003 = ["hero", "sign-in", "sign-up", "page-states", "settings"];
const BLOCKS = [...BLOCKS_003, ...ITEMS_006.map(([n]) => n), "product-home"];
const ITEMS_003 = ["status", "error-summary", ...BLOCKS_003];
/** 027a decision 1: 0.13.0's batch A items, so far. */
const ITEMS_027A = ["button-group", "progress", "link"];
/** 026 decision 1: the toast. Its own checks are in toast-site.test.ts. */
const ITEMS_026 = ["toast"];
/** 002's 26 items. */
const ITEMS_002 = GROUPS.slice(1)
  .flatMap(([, names]) => names)
  .filter(
    (n) =>
      !ITEMS_003.includes(n) &&
      !ITEMS_026.includes(n) &&
      !TYPE_004.has(n) &&
      !TYPE_005.has(n) &&
      !ITEMS_006.some(([name]) => name === n) &&
      !TYPE_007.has(n) &&
      !NAMES_010.includes(n) &&
      !ITEMS_027A.includes(n),
  );
const ITEMS: [string, string][] = [
  ...ITEMS_001,
  ["theme", "registry:ui"],
  ["read-token", "registry:lib"],
  ["liquid-glass", "registry:ui"],
  ...GROUPS.slice(1)
    .flatMap(([, names]) => names)
    .map(
      (n) =>
        [
          n,
          TYPE_004.get(n) ??
            TYPE_005.get(n) ??
            TYPE_007.get(n) ??
            (BLOCKS.includes(n) ? "registry:block" : "registry:ui"),
        ] as [string, string],
    ),
];
const UI_COUNT = ITEMS.filter(([, t]) => t === "registry:ui").length;

/** 003 decision 5's titles for 003's 7 items. */
const TITLES: Record<string, string> = {
  status: "Status",
  "error-summary": "Error summary",
  hero: "Hero",
  "sign-in": "Sign in",
  "sign-up": "Sign up",
  "page-states": "Page states",
  settings: "Settings",
};

/** 003 decision 5: the page files and component files of each block. */
const BLOCK_FILES: Record<string, { pages: string[]; components: string[] }> = {
  hero: {
    pages: ["+page.svelte"],
    components: ["hero-section.svelte", "hero-features.svelte"],
  },
  "sign-in": { pages: ["+page.svelte"], components: ["sign-in-form.svelte"] },
  "sign-up": {
    pages: ["+page.svelte"],
    components: ["sign-up-form.svelte", "sign-up-verify.svelte"],
  },
  "page-states": {
    pages: ["+page.svelte", "+error.svelte"],
    components: [
      "page-states-message.svelte",
      "page-states-error.svelte",
      "page-states-loading.svelte",
    ],
  },
  settings: {
    pages: ["+page.svelte"],
    components: ["settings-form.svelte", "settings-delete.svelte"],
  },
  "app-shell": {
    pages: ["+layout.svelte", "+layout.server.ts", "+page.svelte"],
    components: [
      "app-shell-skip-link.svelte",
      "app-shell-header.svelte",
      "app-shell-nav.svelte",
      "app-shell-user-menu.svelte",
      "app-shell-sidebar.svelte",
      "app-shell-footer.svelte",
    ],
  },
  chat: {
    pages: ["+page.svelte"],
    components: [
      "chat-pane.svelte",
      "chat-turn.svelte",
      "chat-text.svelte",
      "chat-types.ts",
    ],
  },
  // 010 decision 1: one page file; its parts are the compositions, items of their own.
  "product-home": { pages: ["+page.svelte"], components: [] },
};
const GROUP_OF = new Map(
  GROUPS.flatMap(([group, names]) => names.map((n) => [n, group] as const)),
);

/** 002 decision 2's tailwind-variants row, 004's code-block, and 005's three. */
const TV_ITEMS = [
  "button",
  "code-block",
  "item",
  "tabs",
  "alert",
  "badge",
  "empty",
  "field",
  "input-group",
  "toggle",
  "toggle-group",
  "sidebar",
  "message",
  "marker",
];

describe("registry.json", () => {
  test("parses with registrySchema", () => {
    expect(() => registrySchema.parse(registry)).not.toThrow();
  });

  test("holds the 79 items of 006 decision 3, 007 decision 7, 009 decision 10, 010 decision 1, 011 decision 8 027a decision 1 and 026 decision 1, in order, with their types (1, 3, 4, 2, 61, 8)", () => {
    expect(ITEMS).toHaveLength(79);
    const types = ITEMS.map(([, t]) => t);
    expect(
      [
        "registry:theme",
        "registry:font",
        "registry:lib",
        "registry:hook",
        "registry:ui",
        "registry:block",
      ].map((t) => types.filter((x) => x === t).length),
    ).toEqual([1, 3, 4, 2, 61, 8]);
    expect(
      registry.items.map((i: { name: string; type: string }) => [
        i.name,
        i.type,
      ]),
    ).toEqual(ITEMS);
  });

  test("no registry dependency starts with local: or a scheme, and each names an item here", () => {
    const names = new Set(registry.items.map((i: { name: string }) => i.name));
    const deps = new Set<string>(
      registry.items.flatMap(
        (i: { registryDependencies: string[] }) => i.registryDependencies,
      ),
    );
    expect([...deps].sort()).toEqual(
      [
        "font-geist",
        "font-heading-ibm-plex-sans",
        "font-jetbrains-mono",
        "kuiper-theme",
        "utils",
        "spinner",
        "separator",
        "button",
        "label",
        "input",
        "textarea",
        // 003 decision 5's 13 more.
        "card",
        "field",
        "input-group",
        "alert",
        "error-summary",
        "status",
        "input-otp",
        "empty",
        "skeleton",
        "native-select",
        "checkbox",
        "radio-group",
        "alert-dialog",
        // 004 decision 4's 3.
        "use-highlighted-code",
        "highlighter",
        "toggle",
        // 005 decision 4's 4 (spinner was named already; tooltip is the fourth).
        "sheet",
        "is-mobile",
        "tooltip",
        "kbd",
        // 006 decision 3's 12.
        "four-dot",
        "theme",
        "sidebar",
        "breadcrumb",
        "dropdown-menu",
        "avatar",
        "collapsible",
        "message-log",
        "message",
        "marker",
        "composer",
        "code-block",
        // 007 decision 7's 1: code-languages names code-editor.
        "code-editor",
        // 010 decision 1's 12: read-token, tabs and meter, and the nine
        // compositions product-home names.
        "read-token",
        "tabs",
        "meter",
        "stage",
        "stage-card",
        "marketing-bar",
        "stage-hero",
        "proof-band",
        "live-console",
        "name-strip",
        "cta-band",
        "marketing-footer",
        // 012 decisions 3, 4 and 7: the hero, the bar and the block name the glass.
        "liquid-glass",
      ].sort(),
    );
    expect(deps.size).toBe(57);
    for (const dep of deps) {
      expect(dep).not.toMatch(/^local:/);
      expect(dep).not.toMatch(/^[a-z][a-z0-9+.-]*:/i);
      expect(names.has(dep)).toBe(true);
    }
  });

  test("every registry:ui item has at least 2 files", () => {
    const ui = registry.items.filter(
      (i: { type: string }) => i.type === "registry:ui",
    );
    expect(ui).toHaveLength(UI_COUNT);
    expect(UI_COUNT).toBe(61);
    for (const item of ui) expect(item.files.length).toBeGreaterThanOrEqual(2);
  });

  test("79 of 79 items carry a meta.group among the 11, in the order their specifications give", () => {
    expect(GROUPS).toHaveLength(11);
    const groups = new Set(GROUPS.map(([g]) => g));
    for (const item of registry.items as {
      name: string;
      meta: { group: string };
    }[]) {
      expect(groups.has(item.meta?.group)).toBe(true);
      expect(item.meta.group).toBe(GROUP_OF.get(item.name)!);
    }
  });

  // 009 decision 9, criterion 6: every item declares its lint profile. A
  // visual item is productive, but for button; an item with no markup is
  // mode-agnostic. A missing meta.modes fails here. 010 decision 1: its ten
  // items are expressive-only.
  test("every item carries meta.modes as 009 decision 9 and 010 decision 1 assign", () => {
    const BOTH = ["productive", "expressive"];
    const AGNOSTIC = [
      "kuiper-theme",
      "font-geist",
      "font-heading-ibm-plex-sans",
      "font-jetbrains-mono",
      "utils",
      "highlighter",
      "use-highlighted-code",
      "code-languages",
      "is-mobile",
      "read-token",
    ];
    const items = registry.items as {
      name: string;
      meta: { modes?: string[] };
    }[];
    const expected = (name: string) =>
      EXPRESSIVE_ONLY.includes(name)
        ? ["expressive"]
        : AGNOSTIC.includes(name) || name === "button"
          ? BOTH
          : ["productive"];
    for (const item of items)
      expect(item.meta.modes, item.name).toEqual(expected(item.name));
    expect(
      items.filter((i) => i.meta.modes?.includes("expressive")).length,
    ).toBe(AGNOSTIC.length + 1 + EXPRESSIVE_ONLY.length);
    // Only 010's ten and 011's liquid-glass are expressive-only: every other
    // item is held to L22.
    expect(
      items
        .filter((i) => i.meta.modes?.join() === "expressive")
        .map((i) => i.name)
        .sort(),
    ).toEqual([...EXPRESSIVE_ONLY].sort());
  });

  test("26 of 26 of 002's items carry meta.since 0.2.0 and a 5-field meta.stock", () => {
    const byName = new Map(
      (registry.items as { name: string; meta: any }[]).map((i) => [i.name, i]),
    );
    expect(ITEMS_002).toHaveLength(26);
    for (const name of ITEMS_002) {
      const meta = byName.get(name)?.meta;
      expect(meta?.since).toBe("0.2.0");
      expect(Object.keys(meta.stock).sort()).toEqual(
        ["cli", "date", "item", "registry", "sha256"].sort(),
      );
      expect(meta.stock.registry).toBe(
        "https://shadcn-svelte.com/registry/styles/maia",
      );
      expect(meta.stock.item).toBe(name);
      expect(meta.stock.cli).toBe(CLI_VERSION);
      expect(meta.stock.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(meta.stock.sha256).toMatch(/^[0-9a-f]{64}$/);
    }
    for (const [name] of ITEMS_001)
      expect(byName.get(name)?.meta.since).toBe("0.1.0");
  });

  test("10 of 10 004 items carry meta.since 0.4.0, 004 decision 4's titles and groups; 7 carry a 5-field meta.stock, code-editor, highlighter and meter none", () => {
    const byName = new Map(
      (registry.items as { name: string; title: string; meta: any }[]).map(
        (i) => [i.name, i],
      ),
    );
    expect(ITEMS_004).toHaveLength(10);
    expect(STOCK_004).toHaveLength(7);
    for (const [name, , title] of ITEMS_004) {
      const item = byName.get(name)!;
      expect(item.title).toBe(title);
      expect(item.meta?.since).toBe("0.4.0");
      expect(item.meta?.group).toBe(GROUP_004[name] ?? "code");
      if (!STOCK_004.includes(name)) {
        expect(item.meta?.stock).toBeUndefined();
        expect(Object.keys(item.meta).sort()).toEqual([
          "group",
          "modes",
          "since",
        ]);
        continue;
      }
      const stock = item.meta.stock;
      expect(Object.keys(stock).sort()).toEqual(
        ["cli", "date", "item", "registry", "sha256"].sort(),
      );
      expect(stock.registry).toBe(
        "https://shadcn-svelte.com/registry/styles/maia",
      );
      expect(stock.item).toBe(name);
      expect(stock.cli).toBe(CLI_VERSION);
      expect(stock.date).toBe("2026-10-31");
      expect(stock.sha256).toMatch(/^[0-9a-f]{64}$/);
      if (name === "chart") expect(stock.sha256).toBe(CHART_STOCK_SHA);
    }
  });

  test("11 of 11 005 items carry meta.since 0.5.0, 005 decision 4's titles and groups; 8 carry a 5-field meta.stock dated 2026-11-01, theme, message-log and composer none", () => {
    const byName = new Map(
      (
        registry.items as {
          name: string;
          title: string;
          meta: any;
          registryDependencies: string[];
        }[]
      ).map((i) => [i.name, i]),
    );
    expect(ITEMS_005).toHaveLength(11);
    expect(STOCK_005).toHaveLength(8);
    for (const [name, , title] of ITEMS_005) {
      const item = byName.get(name)!;
      expect(item.title).toBe(title);
      expect(item.meta?.since).toBe("0.5.0");
      expect(item.meta?.group).toBe(GROUP_OF.get(name)!);
      expect(item.registryDependencies.slice(0, 2)).toEqual([
        "utils",
        "kuiper-theme",
      ]);
      if (!STOCK_005.includes(name)) {
        expect(item.meta?.stock).toBeUndefined();
        expect(Object.keys(item.meta).sort()).toEqual([
          "group",
          "modes",
          "since",
        ]);
        continue;
      }
      const stock = item.meta.stock;
      expect(Object.keys(stock).sort()).toEqual(
        ["cli", "date", "item", "registry", "sha256"].sort(),
      );
      expect(stock.registry).toBe(
        "https://shadcn-svelte.com/registry/styles/maia",
      );
      expect(stock.item).toBe(name);
      expect(stock.cli).toBe(CLI_VERSION);
      expect(stock.date).toBe("2026-11-01");
      expect(stock.sha256).toMatch(/^[0-9a-f]{64}$/);
      if (name === "sidebar") expect(stock.sha256).toBe(SIDEBAR_STOCK_SHA);
    }
    // 41 stock-derived items in all: 002's 26, 004's 7 (013: highlighter is ours), 005's 8.
    const stocked = (registry.items as { meta: any }[]).filter(
      (i) => i.meta?.stock,
    );
    expect(stocked).toHaveLength(41);
    expect(ITEMS_002.length + STOCK_004.length + STOCK_005.length).toBe(41);
  });

  test("7 of 7 of 003's items carry meta.since 0.3.0, no meta.stock, and 003 decision 5's titles", () => {
    const byName = new Map(
      (registry.items as { name: string; title: string; meta: any }[]).map(
        (i) => [i.name, i],
      ),
    );
    expect(ITEMS_003).toHaveLength(7);
    for (const name of ITEMS_003) {
      const item = byName.get(name)!;
      expect(item.meta?.since).toBe("0.3.0");
      expect(item.meta?.stock).toBeUndefined();
      expect(Object.keys(item.meta).sort()).toEqual([
        "group",
        "modes",
        "since",
      ]);
      expect(item.title).toBe(TITLES[name]!);
    }
  });

  test("2 of 2 006 blocks carry meta.since 0.6.0, 006 decision 3's titles, the blocks group, no meta.stock, and utils then kuiper-theme first", () => {
    const byName = new Map(
      (
        registry.items as {
          name: string;
          title: string;
          type: string;
          meta: any;
          registryDependencies: string[];
        }[]
      ).map((i) => [i.name, i]),
    );
    expect(ITEMS_006).toHaveLength(2);
    for (const [name, title] of ITEMS_006) {
      const item = byName.get(name)!;
      expect(item.type).toBe("registry:block");
      expect(item.title).toBe(title);
      expect(item.meta?.since).toBe("0.6.0");
      expect(item.meta?.group).toBe("blocks");
      expect(item.meta?.stock).toBeUndefined();
      expect(Object.keys(item.meta).sort()).toEqual([
        "group",
        "modes",
        "since",
      ]);
      expect(item.registryDependencies.slice(0, 2)).toEqual([
        "utils",
        "kuiper-theme",
      ]);
    }
    expect(byName.get("four-dot")?.meta.since).toBe("0.1.0");
  });

  // 007 decision 7: the library, its three registry dependencies, no stock.
  test("code-languages is a registry:lib since 0.7.0 in group code with utils, kuiper-theme and code-editor, 1 file, no meta.stock", () => {
    const item = (
      registry.items as {
        name: string;
        type: string;
        title: string;
        registryDependencies: string[];
        files: { path: string; type: string }[];
        meta: {
          since: string;
          group: string;
          modes: string[];
          stock?: unknown;
        };
      }[]
    ).find((i) => i.name === "code-languages")!;
    expect(item.type).toBe("registry:lib");
    expect(item.title).toBe("Code languages");
    expect(item.registryDependencies).toEqual([
      "utils",
      "kuiper-theme",
      "code-editor",
    ]);
    expect(item.files).toEqual([
      { path: "src/lib/registry/lib/code-languages.ts", type: "registry:lib" },
    ]);
    expect(item.meta).toEqual({
      since: "0.7.0",
      group: "code",
      modes: ["productive", "expressive"],
    });
    expect(
      (registry.items as { meta: { since: string } }[]).filter(
        (i) => i.meta.since === "0.7.0",
      ),
    ).toHaveLength(1);
  });

  // 009 decision 10: the library, its two registry dependencies, no stock.
  // 011 decision 14: released with 009 to 012 as 0.11.0.
  test("read-token is a registry:lib since 0.11.0 in group foundation with utils and kuiper-theme, 1 file, no package, no meta.stock", () => {
    const item = (
      registry.items as {
        name: string;
        type: string;
        title: string;
        registryDependencies: string[];
        dependencies?: string[];
        devDependencies?: string[];
        files: { path: string; type: string }[];
        meta: { since: string; group: string; modes: string[] };
      }[]
    ).find((i) => i.name === "read-token")!;
    expect(item.type).toBe("registry:lib");
    expect(item.title).toBe("Read token");
    expect(item.registryDependencies).toEqual(["utils", "kuiper-theme"]);
    expect(item.dependencies ?? []).toEqual([]);
    expect(item.devDependencies ?? []).toEqual([]);
    expect(item.files).toEqual([
      { path: "src/lib/registry/lib/read-token.ts", type: "registry:lib" },
    ]);
    expect(item.meta).toEqual({
      since: "0.11.0",
      group: "foundation",
      modes: ["productive", "expressive"],
    });
  });

  // 010 decision 1: the ten items, their titles, types, groups, profile,
  // release and registry dependencies, exactly; the files under their folder.
  test("10 of 10 010 items carry meta.since 0.11.0, modes [expressive], their group, title and registry dependencies, and no meta.stock", () => {
    const byName = new Map(
      (
        registry.items as {
          name: string;
          type: string;
          title: string;
          registryDependencies: string[];
          files: { path: string; type: string; target?: string }[];
          meta: Record<string, unknown>;
        }[]
      ).map((i) => [i.name, i]),
    );
    expect(ITEMS_010).toHaveLength(10);
    for (const [name, title, deps] of ITEMS_010) {
      const item = byName.get(name)!;
      const block = name === "product-home";
      expect(item.type).toBe(block ? "registry:block" : "registry:ui");
      expect(item.title).toBe(title);
      expect(item.registryDependencies).toEqual([
        "utils",
        "kuiper-theme",
        ...deps,
      ]);
      expect(item.meta).toEqual({
        since: "0.11.0",
        group: block ? "blocks" : "compositions",
        modes: ["expressive"],
      });
      expect(item.files).toEqual(
        block
          ? [
              {
                path: "src/lib/registry/blocks/product-home/+page.svelte",
                type: "registry:page",
                target: "product-home/+page.svelte",
              },
            ]
          : [
              {
                path: `src/lib/registry/ui/${name}/${name}.svelte`,
                type: "registry:ui",
              },
              {
                path: `src/lib/registry/ui/${name}/index.ts`,
                type: "registry:ui",
              },
            ],
      );
    }
  });

  // 011 decision 8: the glass, an expressive-only foundation item.
  test("liquid-glass is a registry:ui since 0.11.0 in group foundation, expressive-only, with kuiper-theme and read-token, 2 files, no package, no meta.stock", () => {
    const item = (
      registry.items as {
        name: string;
        type: string;
        title: string;
        registryDependencies: string[];
        dependencies?: string[];
        devDependencies?: string[];
        files: { path: string; type: string }[];
        meta: Record<string, unknown>;
      }[]
    ).find((i) => i.name === "liquid-glass")!;
    expect(item.type).toBe("registry:ui");
    expect(item.title).toBe("Liquid glass");
    expect(item.registryDependencies).toEqual(["kuiper-theme", "read-token"]);
    expect(item.dependencies ?? []).toEqual([]);
    expect(item.devDependencies ?? []).toEqual([]);
    expect(item.files).toEqual(
      ["pointer-light.ts", "index.ts"].map((file) => ({
        path: `src/lib/registry/ui/liquid-glass/${file}`,
        type: "registry:ui",
      })),
    );
    expect(item.meta).toEqual({
      since: "0.11.0",
      group: "foundation",
      modes: ["expressive"],
    });
  });

  // 011 decision 14, criterion 14: 0.9.0 and 0.10.0 were never released;
  // every item they added, and 011's, says 0.11.0.
  test("12 of 12 items carry meta.since 0.11.0: read-token, 010's ten and liquid-glass; none says 0.9.0 or 0.10.0", () => {
    const since = (
      registry.items as { name: string; meta: { since: string } }[]
    )
      .filter((i) => i.meta.since === "0.11.0")
      .map((i) => i.name)
      .sort();
    expect(since).toEqual(["read-token", ...NAMES_010, "liquid-glass"].sort());
    expect(
      (registry.items as { meta: { since: string } }[]).filter((i) =>
        ["0.9.0", "0.10.0"].includes(i.meta.since),
      ),
    ).toEqual([]);
  });

  // 003 decision 3: build computes <block>/<base name> for a page file of a
  // block with more than one file. 010 decision 1: the CLI gives a one-file
  // item its bare base name, which would write an app's home page, so
  // product-home's one file, the one single-file block, names its target.
  test("10 of 11 page files carry no target in registry.json; product-home's, the one single-file block, is product-home/+page.svelte", () => {
    const pages = (
      registry.items as {
        name: string;
        type: string;
        files: { type: string; target?: string }[];
      }[]
    )
      .filter((i) => i.type === "registry:block")
      .flatMap((i) => i.files.map((f) => ({ block: i.name, ...f })))
      .filter((f) => f.type === "registry:page");
    expect(pages).toHaveLength(11);
    expect(
      pages
        .filter((f) => f.target !== undefined)
        .map((f) => [f.block, f.target]),
    ).toEqual([["product-home", "product-home/+page.svelte"]]);
  });
});

describe("the built registry", () => {
  let out: string;
  const latest = () => path.join(out, "r", "styles", "maia");
  const versioned = () => path.join(out, `v${version}`, "r", "styles", "maia");

  beforeAll(async () => {
    out = mkdtempSync(path.join(tmpdir(), "kuiper-registry-"));
    // A stale file from an earlier build, in both folders, must not survive.
    for (const dir of [latest(), versioned()]) {
      mkdirSync(dir, { recursive: true });
      writeFileSync(path.join(dir, "stale.json"), "{}");
    }
    await buildRegistry({ out, quiet: true });
  }, 60_000);

  afterAll(() => {
    if (out) rmSync(out, { recursive: true, force: true });
  });

  // 020 decision 3: the 79 items (with 027a's and 026's), and the one deprecated entry, which the
  // CLI must find in the index.
  test("81 files under r/styles/maia and 81 byte-identical files under the versioned path", () => {
    const files = readdirSync(latest()).sort();
    expect(files).toEqual(
      [
        "index.json",
        ...ITEMS.map(([n]) => `${n}.json`),
        ...registryRaw.items
          .filter(
            (i: { meta?: { deprecated?: unknown } }) => i.meta?.deprecated,
          )
          .map((i: { name: string }) => `${i.name}.json`),
      ].sort(),
    );
    expect(files).toHaveLength(81);
    expect(readdirSync(versioned()).sort()).toEqual(files);
    for (const file of files) {
      expect(readFileSync(path.join(versioned(), file))).toEqual(
        readFileSync(path.join(latest(), file)),
      );
    }
  });

  test("a stale file planted before the build does not survive it", () => {
    expect(existsSync(path.join(latest(), "stale.json"))).toBe(false);
    expect(existsSync(path.join(versioned(), "stale.json"))).toBe(false);
  });

  test("each of the 78 built items parses with registryItemSchema", () => {
    for (const [name] of ITEMS) {
      const item = JSON.parse(
        readFileSync(path.join(latest(), `${name}.json`), "utf8"),
      );
      expect(() => registryItemSchema.parse(item)).not.toThrow();
    }
  });

  test("no built file contains #lib", () => {
    for (const file of readdirSync(latest())) {
      expect(readFileSync(path.join(latest(), file), "utf8")).not.toContain(
        "#lib",
      );
    }
  });

  test("every target of the 61 registry:ui items starts <name>/", () => {
    const ui = ITEMS.filter(([, type]) => type === "registry:ui");
    expect(ui).toHaveLength(61);
    for (const [name] of ui) {
      const item = JSON.parse(
        readFileSync(path.join(latest(), `${name}.json`), "utf8"),
      );
      for (const file of item.files)
        expect(file.target.startsWith(`${name}/`)).toBe(true);
    }
  });

  test("the hook's target is use-highlighted-code.svelte.ts; highlighter carries 29 files at their targets, 21 dependencies, no devDependencies and no meta.stock", () => {
    const hook = JSON.parse(
      readFileSync(path.join(latest(), "use-highlighted-code.json"), "utf8"),
    );
    expect(hook.files.map((f: { target: string }) => f.target)).toEqual([
      "use-highlighted-code.svelte.ts",
    ]);
    expect([
      ...(hook.dependencies ?? []),
      ...(hook.devDependencies ?? []),
    ]).toEqual([]);
    const highlighter = JSON.parse(
      readFileSync(path.join(latest(), "highlighter.json"), "utf8"),
    );
    const targets = highlighter.files.map((f: { target: string }) => f.target);
    expect(targets).toHaveLength(29);
    expect(targets.slice(0, 5)).toEqual([
      "highlighter.ts",
      "highlight/roles.ts",
      "highlight/languages.ts",
      "highlight/tree-sitter.ts",
      "highlight/shiki.ts",
    ]);
    expect(targets.slice(5).sort()).toEqual(
      QUERY_FILES.map((q) => `highlight/queries/${q}.scm`).sort(),
    );
    for (const file of highlighter.files)
      expect(file.content, file.target).not.toContain("#lib");
    expect(highlighter.dependencies).toEqual(HIGHLIGHTER_DEPENDENCIES);
    expect(highlighter.devDependencies).toBeUndefined();
    expect(highlighter.meta?.stock).toBeUndefined();
    const content = (target: string) =>
      highlighter.files.find((f: { target: string }) => f.target === target)
        .content as string;
    // 007 decision 5: the strict engine, once; Shiki's 26 lazy languages.
    const all = highlighter.files
      .map((f: { content: string }) => f.content)
      .join("\n");
    expect(all.match(/forgiving: false/g)).toHaveLength(1);
    expect(all.match(/forgiving: true/g)).toBeNull();
    const languages = [
      ...content("highlight/languages.ts").matchAll(
        /import\("shiki\/langs\/([a-z]+)\.mjs"\)/g,
      ),
    ].map((m) => m[1]);
    expect(languages).toHaveLength(26);
  });

  // 007 decision 7: the library's target, its three packages and its import of the configured Python.
  test("code-languages' target is code-languages.ts; it names @codemirror/language-data, @codemirror/language and @replit/codemirror-lang-svelte, and imports $UI$/code-editor/code-editor-highlighting", () => {
    const item = JSON.parse(
      readFileSync(path.join(latest(), "code-languages.json"), "utf8"),
    );
    expect(item.files.map((f: { target: string }) => f.target)).toEqual([
      "code-languages.ts",
    ]);
    expect(
      [...(item.dependencies ?? []), ...(item.devDependencies ?? [])].sort(),
    ).toEqual([
      "@codemirror/language-data@^6.5.2",
      "@codemirror/language@^6.13.1",
      "@replit/codemirror-lang-svelte@^6.0.0",
    ]);
    expect(item.registryDependencies).toEqual([
      "utils",
      "kuiper-theme",
      "code-editor",
    ]);
    expect(item.files[0].content).toContain(
      'from "$UI$/code-editor/code-editor-highlighting"',
    );
  });

  test("code-editor names the 6 CodeMirror packages at their ranges, not @lezer/highlight, and depends on highlighter", () => {
    const item = JSON.parse(
      readFileSync(path.join(latest(), "code-editor.json"), "utf8"),
    );
    expect(
      [...(item.dependencies ?? []), ...(item.devDependencies ?? [])].sort(),
    ).toEqual(CODE_EDITOR_PACKAGES);
    expect(item.registryDependencies).toEqual([
      "utils",
      "kuiper-theme",
      "highlighter",
    ]);
    expect(item.files.map((f: { target: string }) => f.target)).toEqual([
      "code-editor/code-editor.svelte",
      "code-editor/code-editor-theme.ts",
      "code-editor/code-editor-python.ts",
      "code-editor/code-editor-highlighting.ts",
      "code-editor/index.ts",
    ]);
  });

  test("the 4 bits-ui items of 004 name bits-ui and @internationalized/date; toggle-group depends on toggle; accordion names phosphor-svelte", () => {
    const built = (name: string) =>
      JSON.parse(readFileSync(path.join(latest(), `${name}.json`), "utf8"));
    const packages = (item: {
      dependencies?: string[];
      devDependencies?: string[];
    }) =>
      [...(item.dependencies ?? []), ...(item.devDependencies ?? [])].sort();
    expect(packages(built("popover"))).toEqual([
      "@internationalized/date@^3.12.4",
      "bits-ui@^2.20.2",
    ]);
    expect(packages(built("accordion"))).toEqual([
      "@internationalized/date@^3.12.4",
      "bits-ui@^2.20.2",
      "phosphor-svelte@^3.1.1",
    ]);
    for (const name of ["toggle", "toggle-group"])
      expect(packages(built(name))).toEqual([
        "@internationalized/date@^3.12.4",
        "bits-ui@^2.20.2",
        "tailwind-variants@^3.3.1",
      ]);
    expect(built("toggle-group").registryDependencies).toEqual([
      "utils",
      "kuiper-theme",
      "toggle",
    ]);
    expect(built("popover").files).toHaveLength(9);
    expect(built("accordion").files).toHaveLength(5);
    expect(built("toggle").files).toHaveLength(2);
    expect(built("toggle-group").files).toHaveLength(3);
  });

  test("chart names layerchart@^2.9.2 with 4 files and no chart-style; meter names no package with 2 files", () => {
    const built = (name: string) =>
      JSON.parse(readFileSync(path.join(latest(), `${name}.json`), "utf8"));
    const chart = built("chart");
    expect(
      [...(chart.dependencies ?? []), ...(chart.devDependencies ?? [])].filter(
        (d: string) => d.startsWith("layerchart"),
      ),
    ).toEqual(["layerchart@^2.9.2"]);
    expect(chart.registryDependencies).toEqual(["utils", "kuiper-theme"]);
    expect(chart.files.map((f: { target: string }) => f.target)).toEqual([
      "chart/chart-container.svelte",
      "chart/chart-tooltip.svelte",
      "chart/chart-utils.ts",
      "chart/index.ts",
    ]);
    const meter = built("meter");
    expect([
      ...(meter.dependencies ?? []),
      ...(meter.devDependencies ?? []),
    ]).toEqual([]);
    expect(meter.registryDependencies).toEqual(["utils", "kuiper-theme"]);
    expect(meter.files.map((f: { target: string }) => f.target)).toEqual([
      "meter/meter.svelte",
      "meter/index.ts",
    ]);
  });

  test("14 of 14 tailwind-variants items name tailwind-variants@^3.3.1", () => {
    expect(TV_ITEMS).toHaveLength(14);
    for (const name of TV_ITEMS) {
      const item = JSON.parse(
        readFileSync(path.join(latest(), `${name}.json`), "utf8"),
      );
      expect(item.devDependencies ?? []).toContain("tailwind-variants@^3.3.1");
    }
  });

  // 20 components: 10 from 003's blocks, 6 from app-shell, 4 from chat.
  // 010's block adds one page file and no component.
  test("11 of 11 page files build to <block>/<base name>, 20 of 20 components to bare <block>- names, and 0 targets begin ~/ or src/", () => {
    let pages = 0;
    let components = 0;
    const rooted: string[] = [];
    for (const block of BLOCKS) {
      const item = JSON.parse(
        readFileSync(path.join(latest(), `${block}.json`), "utf8"),
      );
      for (const file of item.files as { type: string; target: string }[]) {
        if (/^(~\/|src\/)/.test(file.target)) rooted.push(file.target);
        if (file.type === "registry:page") {
          pages++;
          expect(BLOCK_FILES[block]!.pages).toContain(
            file.target.slice(block.length + 1),
          );
          expect(file.target.startsWith(`${block}/`)).toBe(true);
        } else {
          components++;
          expect(file.type).toBe("registry:component");
          expect(file.target).not.toContain("/");
          expect(file.target.startsWith(`${block}-`)).toBe(true);
          expect(BLOCK_FILES[block]!.components).toContain(file.target);
        }
      }
    }
    expect([pages, components]).toEqual([11, 20]);
    expect(rooted).toEqual([]);
  });

  test("4 of 4 icon-importing block items name phosphor-svelte@^3.1.1; the other 5 of 003 name no package", () => {
    const built = (name: string) =>
      JSON.parse(readFileSync(path.join(latest(), `${name}.json`), "utf8"));
    for (const name of ["error-summary", "page-states", "app-shell", "chat"]) {
      const item = built(name);
      expect([
        ...(item.dependencies ?? []),
        ...(item.devDependencies ?? []),
      ]).toEqual(["phosphor-svelte@^3.1.1"]);
    }
    for (const name of ["status", "hero", "sign-in", "sign-up", "settings"]) {
      const item = built(name);
      expect([
        ...(item.dependencies ?? []),
        ...(item.devDependencies ?? []),
      ]).toEqual([]);
    }
  });

  // 005 decision 4: an app that adds one item into an
  // empty project must get every file it imports.
  test("61 of 61 built registry:ui items import only $UI$ names in their own registryDependencies", () => {
    const ui = ITEMS.filter(([, type]) => type === "registry:ui");
    expect(ui).toHaveLength(61);
    const offending: string[] = [];
    for (const [name] of ui) {
      const item = JSON.parse(
        readFileSync(path.join(latest(), `${name}.json`), "utf8"),
      );
      const named = new Set<string>(item.registryDependencies ?? []);
      for (const file of item.files as { content?: string }[]) {
        for (const m of (file.content ?? "").matchAll(
          /from\s+["']\$UI\$\/([a-z0-9-]+)/g,
        )) {
          if (m[1] !== name && !named.has(m[1]))
            offending.push(`${name} imports ${m[1]}`);
        }
      }
    }
    expect(offending).toEqual([]);
  });

  // 010 decision 1 (review finding 2): a library or hook import is an item
  // the importer pulls, by its own dependencies or through theirs, so an app
  // that adds one item gets every file it imports. The `$UI$` check above is
  // direct; a lib or hook may arrive through a named item (code-block's
  // highlighter types come with use-highlighted-code).
  test("78 of 78 built items import only $LIB$ and $HOOKS$ files of items they pull", () => {
    const built = (name: string) =>
      JSON.parse(readFileSync(path.join(latest(), `${name}.json`), "utf8")) as {
        registryDependencies?: string[];
        files: { content?: string; target?: string }[];
      };
    const pulled = (name: string) => {
      const seen = new Set<string>();
      const visit = (n: string) => {
        if (seen.has(n)) return;
        seen.add(n);
        for (const d of built(n).registryDependencies ?? []) visit(d);
      };
      visit(name);
      return seen;
    };
    // A lib's or hook's file is named after its item.
    const owner = (file: string) =>
      file.replace(/\.svelte\.ts$|\.ts$|\.js$/, "").replace(/\.svelte$/, "");
    const offending: string[] = [];
    let imports = 0;
    for (const [name] of ITEMS) {
      const reach = pulled(name);
      for (const file of built(name).files)
        for (const m of (file.content ?? "").matchAll(
          /from\s+["']\$(LIB|HOOKS)\$\/([a-z0-9.-]+)["']/g,
        )) {
          imports++;
          if (!reach.has(owner(m[2]!)))
            offending.push(`${name} imports $${m[1]}$/${m[2]}`);
        }
    }
    expect(offending).toEqual([]);
    expect(imports).toBeGreaterThan(0);
  });

  // 010 decision 1: each of the ten names every item it imports, directly.
  test("10 of 10 010 items import only items in their own registryDependencies", () => {
    const offending: string[] = [];
    for (const name of NAMES_010) {
      const item = JSON.parse(
        readFileSync(path.join(latest(), `${name}.json`), "utf8"),
      );
      const named = new Set<string>(item.registryDependencies ?? []);
      for (const file of item.files as { content?: string }[])
        for (const m of (file.content ?? "").matchAll(
          /from\s+["']\$(UI|LIB|HOOKS)\$\/([a-z0-9-]+)/g,
        ))
          if (m[2] !== name && !named.has(m[2]!))
            offending.push(`${name} imports $${m[1]}$/${m[2]}`);
    }
    expect(offending).toEqual([]);
  });

  test("the hook is-mobile's target is is-mobile.svelte.ts; dropdown-menu has 17 files and sidebar 25, with 0 of the two dropped files; theme has 5", () => {
    const built = (name: string) =>
      JSON.parse(readFileSync(path.join(latest(), `${name}.json`), "utf8"));
    expect(
      built("is-mobile").files.map((f: { target: string }) => f.target),
    ).toEqual(["is-mobile.svelte.ts"]);
    const menu = built("dropdown-menu");
    expect(menu.files).toHaveLength(17);
    expect(JSON.stringify(menu)).not.toContain("dropdown-menu-label.svelte");
    const sidebar = built("sidebar");
    expect(sidebar.files).toHaveLength(25);
    expect(JSON.stringify(sidebar)).not.toContain("sidebar-rail.svelte");
    // 020 decision 5: stored.ts joins the theme item.
    expect(built("theme").files).toHaveLength(5);
    expect(built("message-log").files).toHaveLength(3);
    expect(built("composer").files).toHaveLength(2);
  });

  test("0 of 78 built files carry $UTILS$.js or an /index.js import", () => {
    const offending: string[] = [];
    for (const file of readdirSync(latest())) {
      const text = readFileSync(path.join(latest(), file), "utf8");
      const contents: string[] = (JSON.parse(text).files ?? []).map(
        (f: { content?: string }) => f.content ?? "",
      );
      if (
        text.includes("$UTILS$.js") ||
        contents.some((c) => c.includes('/index.js"'))
      )
        offending.push(file);
    }
    expect(offending).toEqual([]);
  });

  test("kuiper-theme's devDependencies are exactly shadcn-svelte@^1.7.1", () => {
    const item = JSON.parse(
      readFileSync(path.join(latest(), "kuiper-theme.json"), "utf8"),
    );
    expect(item.devDependencies).toEqual(["shadcn-svelte@^1.7.1"]);
  });
});

describe("wrangler.jsonc", () => {
  const config = JSON.parse(readFileSync("wrangler.jsonc", "utf8"));

  test("parses as an object and names no account_id", () => {
    expect(config).toBeObject();
    expect("account_id" in config).toBe(false);
  });

  test("serves ./build as static assets", () => {
    expect(config.assets.directory).toBe("./build");
  });

  test("has no main key", () => {
    expect("main" in config).toBe(false);
  });
});

describe("CHANGELOG.md", () => {
  const entry = (version: string) => {
    const text = readFileSync("CHANGELOG.md", "utf8");
    const match = text.match(
      new RegExp(
        `^## ${version.replaceAll(".", "\\.")}\\b[^\\n]*\\n([\\s\\S]*?)(?=^## |$(?![\\s\\S]))`,
        "m",
      ),
    );
    expect(match).not.toBeNull();
    return match![1];
  };

  // 011 decision 14, criterion 14: 0.9.0 and 0.10.0 were never released;
  // their entries fold into one 0.11.0 entry, which names decision 12's five
  // visible changes, and what 009, 010 and 011 add.
  // 014 decisions 12 and 13: 0.12.0, dated at its tag (2026-11-15); 0.11.0
  // follows it. 020, 0.13.0's first landing, opens 0.13.0 above them,
  // unreleased until its tag.
  test("has no 0.9.0 or 0.10.0 entry; 0.13.0 is the newest, unreleased, then 0.12.0, released, and 0.11.0", () => {
    const text = readFileSync("CHANGELOG.md", "utf8");
    expect(text).not.toMatch(/^## 0\.9\.0\b/m);
    expect(text).not.toMatch(/^## 0\.10\.0\b/m);
    const versions = [...text.matchAll(/^## (\d+\.\d+\.\d+)\b/gm)].map(
      (m) => m[1],
    );
    expect(versions.slice(0, 3)).toEqual(["0.13.0", "0.12.0", "0.11.0"]);
    expect(text).toMatch(/^## 0\.13\.0 — unreleased$/m);
    expect(text).toMatch(/^## 0\.12\.0 — 2026-11-15$/m);
  });

  // 014 criterion 13: one 0.12.0 entry, shared with 013; one bullet per item,
  // each of the three marked as an interface change.
  test("the one 0.12.0 entry marks pluto-theme, code-block and code-editor as interface changes and names the two roles, scrollbar-code and inline code", () => {
    const text = readFileSync("CHANGELOG.md", "utf8");
    expect(text.match(/^## 0\.12\.0\b/gm)).toHaveLength(1);
    const body = entry("0.12.0");
    for (const name of ["pluto-theme", "code-block", "code-editor"]) {
      const bullets = body
        .split("\n")
        .filter((line) => line.startsWith(`- \`${name}\`: `));
      expect(bullets, name).toHaveLength(1);
      expect(bullets[0], name).toContain("**interface change.**");
    }
    for (const name of [
      "`--syntax-ground`",
      "`--syntax-active-line`",
      "`scrollbar-code`",
      "Inline code",
    ])
      expect(body).toContain(name);
    expect(body).not.toContain("No variable is renamed or removed");
  });

  // 013 decision 17 and criterion 23: 013's lines in the shared entry, first
  // in each shared bullet; one bullet per item; every removed name listed.
  test("the one 0.12.0 entry holds 013's lines: one bullet per item, highlighter's marked interface change, 013's sentences before 014's, every removed name and the update line", () => {
    const body = entry("0.12.0");
    const bullet = (name: string) => {
      const found = body
        .split("\n")
        .filter((line) => line.startsWith(`- \`${name}\`: `));
      expect(found, name).toHaveLength(1);
      return found[0]!;
    };
    for (const name of [
      "pluto-theme",
      "highlighter",
      "code-block",
      "code-editor",
      "code-languages",
      "use-highlighted-code",
    ])
      bullet(name);
    expect(bullet("highlighter")).toContain("**interface change.**");
    const theme = bullet("pluto-theme");
    expect(theme.indexOf("Meridian's roles")).toBeLessThan(
      theme.indexOf("`--syntax-ground`"),
    );
    for (const removed of [
      "--code-foreground",
      "--code-escape",
      "--code-builtin",
      "--code-tag",
      "--code-property",
      "--code-decorator",
      "--code-self",
      "--code-invalid",
      "--syntax-amber",
      "--syntax-purple",
      "--syntax-teal",
      "--syntax-cyan",
    ])
      expect(body, removed).toContain(`\`${removed}\``);
    const editor = bullet("code-editor");
    for (const name of [
      "`codeHighlight`",
      "`pythonLanguageConfigured`",
      "`pythonRoles`",
      "`codeHighlighting(language)`",
    ])
      expect(editor, name).toContain(name);
    expect(body).toContain(
      "`add pluto-theme highlighter use-highlighted-code code-block code-editor`",
    );
    expect(body).toContain("tree-sitter");
  });

  test("the 0.11.0 entry names decision 12's five visible changes", () => {
    const body = entry("0.11.0");
    for (const text of [
      // 1. every colour, and the dark ground
      "`#F3F0E8`",
      "`graphite`",
      "`#16140F`",
      // 2. overlays in light lose their shadow, gain the input edge
      "no shadow",
      "`line-input`",
      // 3. grooves lose their light line
      "`groove-light`",
      // 4. the lockup's mark, and the footer endorsement
      "87%",
      "endorsement",
      // 5. the dots overshoot as they land
      "overshoot",
      "`--ease-spring`",
    ])
      expect(body, text).toContain(text);
  });

  test("the 0.11.0 entry names what 009, 010 and 011 add", () => {
    const body = entry("0.11.0");
    for (const name of [...NAMES_010, "read-token", "liquid-glass"])
      expect(body, name).toContain(`\`${name}\``);
    for (const text of [
      "`pluto-theme`",
      "`button`",
      "`rounded-action`",
      "`--radius-action`",
      "`rounded-[var(--radius-action,var(--radius))]`",
      "merges",
      "`meta.modes`",
      "L22",
      "L23",
      "L24",
      'data-mode="expressive"',
      "`--font-face-display`",
      "`compositions`",
      '`meta.modes: ["expressive"]`',
      "`run`",
      "`field-1`",
      "`surface-plain`",
      "`glass`",
      "`type-poster`",
      "`pointerLight`",
      // 012: the compositions as it leaves them.
      "`ground`",
      "`field`",
      "`poster`",
      "`busy-edge`",
      "glass panel",
    ])
      expect(body, text).toContain(text);
    // H1: no action is a pill.
    expect(body).not.toMatch(/\bpills?\b/);
  });

  // 012 decision 9: nothing of the stage appears in the one 0.11.0 entry.
  test("the 0.11.0 entry names nothing of the stage", () => {
    const body = entry("0.11.0");
    for (const word of [
      "surface-stage",
      "bloom",
      "rim",
      "energized",
      "veil",
      "--radius-stage",
      "lit object",
      // "Frost only, no lens" (decisions.md, 2026-11-07).
      "lens",
      "lit card",
      "darker than",
    ])
      expect(body, word).not.toMatch(
        new RegExp(`(^|[^\\w-])${word.replace(/-/g, "\\-")}($|[^\\w-])`),
      );
  });

  // 011 decision 14, criterion 14: R25 joins 002 decision 9's checklist.
  test("002's checklist holds R25, fields and glass, after R24", () => {
    const spec = readFileSync(
      "context/specifications/002-the-primitives-forms-surfaces-and-feedback.md",
      "utf8",
    );
    const r24 = spec.indexOf("| R24 |");
    const r25 = spec.indexOf("| R25 |");
    expect(r24).toBeGreaterThan(-1);
    expect(r25).toBeGreaterThan(r24);
    const row = spec.slice(r25, spec.indexOf("\n", r25));
    for (const text of [
      "expressive",
      "`surface-plain`",
      "never a control directly",
      "never inside glass",
      "`.dark`",
      "`paper`",
      "`raised`",
      "image",
    ])
      expect(row, text).toContain(text);
  });

  // 007 decision 11: the six things.
  // 008 decision 9: the release says the shell's change is an interface change and how to keep the lockup.
  test("has a 0.8.0 entry naming app-shell as an interface change, the restore, mark-reveal and the hero", () => {
    const body = entry("0.8.0");
    for (const text of [
      "`app-shell`: **interface change.**",
      "`appName`",
      "`logo`",
      "`endorsed`",
      '<Lockup entrance={place === "header"}',
      "A Pluto Systems product",
      "`mark-reveal`",
      "`hero`",
    ])
      expect(body).toContain(text);
  });

  test("has a 0.7.0 entry naming the palette, the languages, code-languages, the surface, the block's ground and the emission", () => {
    const body = entry("0.7.0");
    for (const text of [
      "`pluto-theme`",
      "`code-languages`",
      "`code-block`",
      "`code-editor`",
      "`highlighter`",
      "`.surface-ink`",
      "`bg-code-background`",
      "twenty-one",
      "twenty-six",
      "`cssVars.dark`",
    ])
      expect(body).toContain(text);
  });

  // 006 decision 15: app-shell, chat, pluto-theme (additive) and four-dot (changed, not an interface change).
  test("has a 0.6.0 entry naming the 2 blocks, pluto-theme and four-dot (4 of 4), the entrance and groove-b", () => {
    const body = entry("0.6.0");
    const names = [...ITEMS_006.map(([n]) => n), "pluto-theme", "four-dot"];
    expect(names).toHaveLength(4);
    for (const name of names) expect(body).toContain(`\`${name}\``);
    expect(body).toContain("`mark-entrance`");
    expect(body).toContain("`groove-b`");
    expect(body).toContain("`entrance`");
    expect(body).toContain("not an interface change");
  });

  test("has a 0.5.0 entry naming pluto-theme and 005's 11 items (12 of 12), the sonner line and the bubble line", () => {
    const body = entry("0.5.0");
    const names = ["pluto-theme", ...ITEMS_005.map(([n]) => n)];
    expect(names).toHaveLength(12);
    for (const name of names) expect(body).toContain(`\`${name}\``);
    expect(body).toContain("`groove-s`");
    expect(body).toContain("`sonner`");
    expect(body).toContain("`bubble`");
  });

  test("has a 0.4.0 entry naming pluto-theme and 004's 10 items (11 of 11), and the scroll-area line", () => {
    const body = entry("0.4.0");
    const names = ["pluto-theme", ...ITEMS_004.map(([n]) => n)];
    expect(names).toHaveLength(11);
    for (const name of names) expect(body).toContain(`\`${name}\``);
    expect(body).toContain("`scroll-area`");
    expect(body).toContain("`scrollbar`");
  });

  test("has a 0.3.0 entry naming 003's 7 items: 7 of 7", () => {
    const body = entry("0.3.0");
    for (const name of ITEMS_003) expect(body).toContain(`\`${name}\``);
  });

  test("has a 0.2.0 entry naming pluto-theme and 002's 26 items: 27 of 27", () => {
    const body = entry("0.2.0");
    const names = ["pluto-theme", ...ITEMS_002];
    expect(names).toHaveLength(27);
    for (const name of names) expect(body).toContain(`\`${name}\``);
  });

  test("still has a 0.1.0 entry naming each of the 6 items", () => {
    const body = entry("0.1.0");
    // The 0.1.0 entry names the theme by its name then (020: history).
    for (const [name] of ITEMS_001)
      expect(body).toContain(
        `\`${name === "kuiper-theme" ? "pluto-theme" : name}\``,
      );
  });
});

/** 014 criteria 7, 9 and 13: the white code ground, in the items' source, the version and the documents. */
describe("014: the white code ground", () => {
  const UI = "src/lib/registry/ui";
  const PAGES = "src/routes/(site)/components";
  // 015 decision 13: an item page's examples are files of their own, so a
  // page's text is its page file and its example files.
  const read = (file: string) => {
    const page = new RegExp(
      `^${PAGES.replace(/[()]/g, "\\$&")}/([^/]+)/\\+page\\.svelte$`,
    ).exec(file);
    const dir = page ? `src/lib/site/examples/${page[1]}` : "";
    const examples =
      dir && existsSync(dir)
        ? readdirSync(dir)
            .filter((f) => f.endsWith(".svelte"))
            .map((f) => readFileSync(`${dir}/${f}`, "utf8"))
        : [];
    return [readFileSync(file, "utf8"), ...examples].join("\n");
  };
  /** The class tokens of the first string literal after `key`. */
  const classesAfter = (text: string, key: RegExp) => {
    const match = key.exec(text);
    expect(match, String(key)).not.toBeNull();
    return match![1]!.split(/\s+/);
  };

  test("code-block's base classes hold border, border-border and bg-code-background", () => {
    const base = classesAfter(
      read(`${UI}/code-block/code-block.svelte`),
      /base:\s*"([^"]*)"/,
    );
    for (const cls of ["border", "border-border", "bg-code-background"])
      expect(base, cls).toContain(cls);
  });

  test("code-block-content holds scrollbar-code and not scrollbar as a class token", () => {
    const tokens = classesAfter(
      read(`${UI}/code-block/code-block-content.svelte`),
      /cn\(\s*"([^"]*)"/,
    );
    expect(tokens).toContain("scrollbar-code");
    expect(tokens).not.toContain("scrollbar");
  });

  test("code-editor's root holds border, border-border and bg-code-background, not bg-muted", () => {
    const root = classesAfter(
      read(`${UI}/code-editor/code-editor.svelte`),
      /data-slot="code-editor"\s*class=\{cn\("([^"]*)"/,
    );
    for (const cls of ["border", "border-border", "bg-code-background"])
      expect(root, cls).toContain(cls);
    expect(root).not.toContain("bg-muted");
  });

  test("code-editor-theme's scroller reads the code ground, and its focus offset adds the line width", () => {
    const theme = read(`${UI}/code-editor/code-editor-theme.ts`);
    expect(theme).toContain(
      'scrollbarColor: "var(--input) var(--code-background)"',
    );
    expect(theme).toContain(
      'outlineOffset: "calc(var(--focus-offset) + var(--line-width))"',
    );
    expect(theme).not.toContain("var(--muted)");
  });

  test('no file under src/lib/registry/ or the item pages contains class="bg-muted"', () => {
    const files = execSync(
      `git ls-files --cached --others --exclude-standard -- src/lib/registry "${PAGES}" src/lib/site/examples`,
      { encoding: "utf8" },
    )
      .split("\n")
      .filter((f) => f && existsSync(f));
    expect(files.length).toBeGreaterThan(100);
    const offenders = files.filter((f) => read(f).includes('class="bg-muted"'));
    expect(offenders).toEqual([]);
  });

  // The tag is made at release (2026-11-15): when it exists, the tagged
  // commit's package.json reads 0.12.0 and its changelog dates 0.12.0. 020
  // sets 0.13.0 at the start of 0.13.0, so static/v0.12.0 is left as tagged.
  test("package.json reads 0.13.0; the registry build has written static/v0.12.0/ and static/v0.13.0/; a v0.12.0 tag, if made, is a dated 0.12.0", () => {
    expect(JSON.parse(read("package.json")).version).toBe("0.13.0");
    expect(existsSync("static/v0.12.0/r/styles/maia/index.json")).toBe(true);
    expect(existsSync("static/v0.13.0/r/styles/maia/index.json")).toBe(true);
    const tags = execSync("git tag --list 'v0.12.0'", { encoding: "utf8" });
    if (tags.trim() === "") return;
    const show = (f: string) =>
      execSync(`git show v0.12.0:${f}`, { encoding: "utf8" });
    expect(JSON.parse(show("package.json")).version).toBe("0.12.0");
    expect(show("CHANGELOG.md")).toMatch(/^## 0\.12\.0 — \d{4}-\d{2}-\d{2}$/m);
  });

  test("registry.json's code-block description names the code ground and the hairline, not the muted inset", () => {
    const item = JSON.parse(read("registry.json")).items.find(
      (i: { name: string }) => i.name === "code-block",
    );
    expect(item.description).toBe(
      "Code, output or a diff on the code ground, edged by the hairline, highlighted from the code tokens, with line numbers, a copy button and a header divided by the groove.",
    );
    expect(item.description).not.toContain("muted inset");
  });

  test("no item page or comment names muted or card as the code ground", () => {
    const highlighter = read(`${PAGES}/highlighter/+page.svelte`);
    expect(highlighter).toContain(
      '["background", "syntax-ground", "bg-code-background"]',
    );
    expect(highlighter).toContain(
      '["active-line", "syntax-active-line", "bg-code-active-line"]',
    );
    expect(highlighter).not.toContain('["background", "muted"');
    expect(highlighter).not.toContain('["active-line", "card"');
    for (const file of [
      `${PAGES}/code-editor/+page.svelte`,
      `${UI}/code-block/code-block-line.svelte`,
      `${UI}/code-editor/code-editor.svelte`,
    ])
      expect(read(file), file).not.toContain("muted ground");
    expect(read(`${PAGES}/code-block/+page.svelte`)).not.toContain(
      "muted inset",
    );
    expect(read(`${UI}/code-block/code-block.svelte`)).not.toContain(
      "muted inset",
    );
    const theme = read(`${PAGES}/kuiper-theme/+page.svelte`);
    expect(theme).toContain("scrollbar-code");
    expect(theme).not.toContain('passes <code>class="bg-muted"</code>');
  });
});

/** 016 criteria 9 and 12: no amber left, and the yellow in the documents. */
describe("016: the brand yellow", () => {
  const PAGES = "src/routes/(site)/components";
  // 015 decision 13: an item page's examples are files of their own, so a
  // page's text is its page file and its example files.
  const read = (file: string) => {
    const page = new RegExp(
      `^${PAGES.replace(/[()]/g, "\\$&")}/([^/]+)/\\+page\\.svelte$`,
    ).exec(file);
    const dir = page ? `src/lib/site/examples/${page[1]}` : "";
    const examples =
      dir && existsSync(dir)
        ? readdirSync(dir)
            .filter((f) => f.endsWith(".svelte"))
            .map((f) => readFileSync(`${dir}/${f}`, "utf8"))
        : [];
    return [readFileSync(file, "utf8"), ...examples].join("\n");
  };

  test("no amber, #F19E20 or #915B00, in any case, in the tokens, build-tokens, src/, registry.json or static/r/", () => {
    const files = execSync(
      "git ls-files --cached --others --exclude-standard -- tokens scripts/build-tokens.ts src registry.json static/r",
      { encoding: "utf8" },
    )
      .split("\n")
      .filter(
        (f) => f && existsSync(f) && !/\.(png|jpe?g|webp|woff2?|ico)$/.test(f),
      );
    expect(files.length).toBeGreaterThan(300);
    // 021 decision 10: the record of removed names keeps the two names that
    // shipped, --syntax-amber and its --color- form, so that it can say what
    // replaces them. Only those two names are dropped; the rest is scanned.
    const text = (f: string) =>
      f.endsWith("/kuiper.removed.json")
        ? read(f).replace(/--(color-)?syntax-amber(?![\w-])/g, "")
        : read(f);
    const hits = files.filter((f) => /amber|#?f19e20|#?915b00/i.test(text(f)));
    expect(hits).toEqual([]);
  });

  test("the one 0.12.0 entry holds 016's summary line, and its one pluto-theme bullet names the yellows and --caution-text", () => {
    const text = read("CHANGELOG.md");
    const at = text.indexOf("## 0.12.0");
    const body = text.slice(at, text.indexOf("\n## ", at + 1));
    expect(body).toContain(
      "The brand's yellow is yellower and lifted in dark: `#E2B000` in light, `#F8D874` in dark, in place of `#F19E20`.",
    );
    const bullets = body
      .split("\n")
      .filter((line) => line.startsWith("- `pluto-theme`: "));
    expect(bullets).toHaveLength(1);
    for (const name of [
      "`#E2B000`",
      "`#F8D874`",
      "`#806200`",
      "`--caution-text`",
    ])
      expect(bullets[0], name).toContain(name);
  });

  test("the page texts and comments say yellow; marketing-bar reads 15.40:1", () => {
    for (const file of [
      `${PAGES}/alert/+page.svelte`,
      `${PAGES}/badge/+page.svelte`,
      `${PAGES}/chart/+page.svelte`,
      `${PAGES}/product-home/+page.svelte`,
      `${PAGES}/kuiper-theme/+page.svelte`,
      "src/lib/registry/ui/badge/badge.svelte",
      "src/lib/registry/blocks/product-home/+page.svelte",
    ]) {
      expect(read(file), file).not.toMatch(/amber/i);
      expect(read(file), file).toMatch(/yellow/i);
    }
    const flat = (file: string) => read(file).replace(/\s+(\/\/\s+)?/g, " ");
    expect(flat(`${PAGES}/kuiper-theme/+page.svelte`)).toContain(
      "Yellow is the one known exception: a yellow series is labelled directly",
    );
    expect(flat("src/lib/registry/ui/badge/badge.svelte")).toContain(
      "because the brand yellow is never text in light",
    );
    const bar = read(`${PAGES}/marketing-bar/+page.svelte`).replace(
      /\s+/g,
      " ",
    );
    expect(bar).toContain("at least 15.40:1 and 5.98:1");
  });
});

/**
 * 019 change review, finding 1: the error-summary page claims a screen-reader
 * listen only once 019's status line records one: "Criterion 19 passed",
 * heard with VoiceOver (decision 12).
 */
describe("019: no screen-reader claim without its record", () => {
  const page = readFileSync(
    "src/routes/(site)/components/error-summary/+page.svelte",
    "utf8",
  ).replace(/\s+/g, " ");
  const spec = readdirSync("context/specifications").find((f) =>
    f.startsWith("019-"),
  );
  const status =
    readFileSync(`context/specifications/${spec}`, "utf8")
      .split("\n")
      .find((l) => l.startsWith("- **Status:**")) ?? "";
  const recorded =
    /Criterion 19 passed/.test(status) && /VoiceOver/.test(status);

  test("the page claims a VoiceOver listen only when 019's status records one that passed", () => {
    const claims = /Heard with VoiceOver/i.test(page);
    if (claims) expect(recorded, "a recorded listen").toBe(true);
    else expect(page).toContain("Not yet heard with a screen reader.");
  });

  test("the page says NVDA and JAWS are not tested", () => {
    expect(page).toContain("NVDA and JAWS are not tested.");
  });
});

/**
 * 019a decision 1 (the owner, 2026-11-15): the
 * one pluto-theme bullet says the spacing is now the font's default, and
 * what an app that wants the old tightening does.
 */
describe("0.12.0: the font's own letter spacing", () => {
  test("the pluto-theme bullet says every tracking value is now the font's default, and how to keep the old tightening", () => {
    const text = readFileSync("CHANGELOG.md", "utf8");
    const at = text.indexOf("## 0.12.0");
    const body = text.slice(at, text.indexOf("\n## ", at + 1));
    const bullets = body
      .split("\n")
      .filter((l) => l.startsWith("- `pluto-theme`: "));
    expect(bullets).toHaveLength(1);
    const bullet = bullets[0]!;
    for (const name of [
      "letter spacing",
      "font's default",
      "`--tracking-display`",
      "`--type-display-tracking`",
      "`letter-spacing`",
    ])
      expect(bullet, name).toContain(name);
  });
});

/** 019 criterion 14: the error summary's and the app shell's interface lines. */
describe("019: the changelog", () => {
  const body = () => {
    const text = readFileSync("CHANGELOG.md", "utf8");
    const at = text.indexOf("## 0.12.0");
    return text.slice(at, text.indexOf("\n## ", at + 1));
  };
  const bullets = (name: string) =>
    body()
      .split("\n")
      .filter((line) => line.startsWith(`- \`${name}\`: `));

  test("the 0.12.0 entry holds 1 error-summary and 1 app-shell bullet, each an interface change, after kbd's, and still 1 pluto-theme bullet", () => {
    for (const name of ["error-summary", "app-shell", "pluto-theme"])
      expect(bullets(name), name).toHaveLength(1);
    for (const name of ["error-summary", "app-shell"])
      expect(bullets(name)[0], name).toContain("**interface change.**");
    const lines = body().split("\n");
    const at = (name: string) =>
      lines.findIndex((l) => l.startsWith(`- \`${name}\`: `));
    expect(at("error-summary")).toBe(at("kbd") + 1);
    expect(at("app-shell")).toBe(at("kbd") + 2);
  });

  test("they name the 11 names", () => {
    const summary = bullets("error-summary")[0]!;
    for (const name of [
      // Named as `data-slot="error-summary-content"`, as 019 decision 11 words it.
      'data-slot="error-summary-content"',
      "`announce`",
      "`scroll-padding-top`",
      "`data-sticky-bar`",
      "`add error-summary`",
    ])
      expect(summary, name).toContain(name);
    const shell = bullets("app-shell")[0]!;
    for (const name of [
      "`data-sticky-bar`",
      "`scroll-padding-top`",
      "`add app-shell`",
    ])
      expect(shell, name).toContain(name);
    const theme = bullets("pluto-theme")[0]!;
    for (const name of [
      "`@layer base`",
      "`:where(html:has([data-sticky-bar]))`",
      "`scroll-pt-*`",
    ])
      expect(theme, name).toContain(name);
    expect(theme.trimEnd()).toMatch(
      /After updating, delete the old unlayered `html:has\(\[data-sticky-bar\]\) \{ scroll-padding-top: var\(--size-bar\); \}` from your stylesheet: the CLI does not remove it, and while it stays it overrides your own value\.$/,
    );
  });
});

/**
 * 008 change review, finding 1: a released snapshot is frozen. Each tag's
 * `static/<tag>/` matches the tag, so a build under a stale version can never
 * rewrite one unseen.
 */
describe("released snapshots", () => {
  const tags = execSync("git tag --list 'v*'", { encoding: "utf8" })
    .split("\n")
    .filter(Boolean);
  const frozen = tags.filter((t) => existsSync(`static/${t}`));
  test("at least one released snapshot exists", () => {
    expect(frozen.length).toBeGreaterThan(0);
  });
  test.each(frozen)("static/%s matches its tag", (tag) => {
    const diff = execSync(`git diff --name-only ${tag} -- static/${tag}`, {
      encoding: "utf8",
    });
    const untracked = execSync(
      `git ls-files --others --exclude-standard -- static/${tag}`,
      { encoding: "utf8" },
    );
    expect(diff + untracked).toBe("");
  });
});

/** 020 tests 3 to 5 and 16: the Kuiper rename in the registry and the changelog. */
describe("020 test 3: kuiper-theme is the theme", () => {
  const all = registryRaw.items as {
    name: string;
    type: string;
    title: string;
    cssVars?: unknown;
    css?: unknown;
    registryDependencies?: string[];
    meta?: { deprecated?: unknown };
  }[];

  test("the registry's name is kuiper", () => {
    expect(registry.name).toBe("kuiper");
  });

  test('kuiper-theme is a registry:theme titled "Kuiper theme", with the cssVars and css', () => {
    const theme = all.find((i) => i.name === "kuiper-theme");
    expect(theme?.type).toBe("registry:theme");
    expect(theme?.title).toBe("Kuiper theme");
    expect(Object.keys(theme?.cssVars ?? {}).sort()).toEqual([
      "dark",
      "light",
      "theme",
    ]);
    expect(Object.keys(theme?.css ?? {}).length).toBeGreaterThan(10);
  });

  // 027a: link, button-group and progress name it too, and 026's toast.
  test("the 74 items that name the theme name kuiper-theme, and none names pluto-theme", () => {
    const naming = all.filter((i) =>
      (i.registryDependencies ?? []).includes("kuiper-theme"),
    );
    expect(naming.filter((i) => !i.meta?.deprecated)).toHaveLength(74);
    expect(
      all.filter((i) => (i.registryDependencies ?? []).includes("pluto-theme")),
    ).toEqual([]);
  });
});

describe("020 test 4: the pluto-theme alias", () => {
  const entries = (
    registryRaw.items as { name: string; meta?: { deprecated?: unknown } }[]
  ).filter((i) => i.name === "pluto-theme");

  test("exactly one pluto-theme entry, which installs kuiper-theme and holds nothing of its own", () => {
    expect(entries).toHaveLength(1);
    const alias = entries[0] as Record<string, unknown>;
    expect(alias.type).toBe("registry:theme");
    expect(alias.registryDependencies).toEqual(["kuiper-theme"]);
    expect(alias.files).toEqual([]);
    expect("cssVars" in alias).toBe(false);
    expect("css" in alias).toBe(false);
    expect((alias.meta as { deprecated: unknown }).deprecated).toEqual({
      replacement: "kuiper-theme",
      removedIn: "0.14.0",
    });
  });

  test("no other entry is deprecated", () => {
    expect(
      (registryRaw.items as { name: string; meta?: { deprecated?: unknown } }[])
        .filter((i) => i.meta?.deprecated)
        .map((i) => i.name),
    ).toEqual(["pluto-theme"]);
  });

  test("the built index lists it, and its own file exists", () => {
    const index = JSON.parse(
      readFileSync("static/r/styles/maia/index.json", "utf8"),
    ) as { name: string }[];
    expect(index.filter((i) => i.name === "pluto-theme")).toHaveLength(1);
    expect(index).toHaveLength(80);
    expect(existsSync("static/r/styles/maia/pluto-theme.json")).toBe(true);
    expect(existsSync("static/r/styles/maia/kuiper-theme.json")).toBe(true);
  });
});

describe("020 test 5: a deprecated item is not listed", () => {
  test("listedItems() returns the 79 items, without pluto-theme", async () => {
    const { listedItems } = await import("../../src/lib/site/items.ts");
    const listed = listedItems();
    expect(listed).toHaveLength(79);
    expect(listed.map((i) => i.name)).not.toContain("pluto-theme");
    expect(listed.map((i) => i.name)).toContain("kuiper-theme");
  });

  test("the sitemap, the search index, the thumbnails, the example order, the doors, the components index and the literal lint hold no pluto-theme", async () => {
    const { SITEMAP } = await import("../../src/lib/site/sitemap.ts");
    expect(SITEMAP.filter((p) => p.path.includes("pluto-theme"))).toEqual([]);
    expect(
      SITEMAP.filter((p) => p.path === "/components/kuiper-theme/"),
    ).toHaveLength(1);

    const { buildIndex } =
      await import("../../src/lib/site/search/build-index.ts");
    const dir = "src/lib/site/search/sources";
    const sources = await Promise.all(
      readdirSync(dir)
        .filter((f) => f.endsWith(".ts"))
        .map((f) => import(path.resolve(dir, f))),
    );
    const index = buildIndex(sources) as { path: string; title: string }[];
    expect(
      index.filter(
        (e) => e.path.includes("pluto-theme") || /pluto/i.test(e.title),
      ),
    ).toEqual([]);

    const manifest = JSON.parse(
      readFileSync("src/lib/site/thumbnails/manifest.json", "utf8"),
    );
    expect(Object.keys(manifest)).toHaveLength(79);
    expect(Object.keys(manifest)).not.toContain("pluto-theme");
    expect(Object.keys(manifest)).toContain("kuiper-theme");

    const { EXAMPLE_ORDER } =
      await import("../../src/lib/site/example-order.ts");
    expect(Object.keys(EXAMPLE_ORDER)).not.toContain("pluto-theme");
    expect(Object.keys(EXAMPLE_ORDER)).toContain("kuiper-theme");

    const { DOORS } = await import("../../src/lib/site/doors.ts");
    expect(DOORS.find((d) => d.id === "components")?.line).toBe("79 parts");

    // The components index's loader lists through listedItems; its
    // rendered cards are counted in upgrade.spec.ts.
    const layout = readFileSync(
      "src/routes/(site)/components/+layout.server.ts",
      "utf8",
    );
    expect(layout).toMatch(/of listedItems\(\s*registry\.items,?\s*\)\)/);

    const { itemOwners } = await import("../../scripts/lint-literals.ts");
    expect([...itemOwners().values()].flat()).not.toContain("pluto-theme");
  });
});

describe("020 test 16: the 0.13.0 changelog", () => {
  const log = readFileSync("CHANGELOG.md", "utf8");
  const entry = log.includes("## 0.13.0")
    ? log.slice(log.indexOf("## 0.13.0"), log.indexOf("\n## 0.12.0"))
    : "";
  const bullets = entry.split("\n").filter((l) => l.startsWith("- "));
  const bullet = (head: string) =>
    bullets.find((b) => b.startsWith(`- \`${head}\``)) ?? "";

  test("the entry links to the guide at /changelog/0.13.0/upgrade/", () => {
    expect(entry).toContain("workers.dev/changelog/0.13.0/upgrade/)");
  });

  test("its bullets are decision 16's five, each marked interface change", () => {
    for (const head of [
      "kuiper-theme",
      "theme",
      "field",
      "tooltip",
      "highlighter",
    ])
      expect(bullet(head), head).toContain("**interface change.**");
  });

  test("the kuiper-theme bullet says to rename the four keyframe uses before updating the theme", () => {
    const b = bullet("kuiper-theme");
    const rename = b.indexOf("rename your own uses");
    expect(rename).toBeGreaterThan(-1);
    expect(b.indexOf("before you update the theme")).toBeGreaterThan(rename);
    for (const name of [
      "pluto-enter",
      "pluto-exit",
      "pluto-mark-dock",
      "pluto-mark-fade",
    ])
      expect(b.indexOf(`\`${name}\``), name).toBeGreaterThan(rename);
  });

  test("each bullet names its rows' old and new names, 0.14.0 where they have an alias, and its exported constants", async () => {
    const { RENAMES } = await import("../../src/lib/site/upgrade/renames.ts");
    // The field-label key is the field's, so its bullet names it.
    const covers: Record<string, (r: (typeof RENAMES)[number]) => boolean> = {
      "kuiper-theme": (r) =>
        ["theme item", "keyframes", "token file"].includes(r.kind),
      theme: (r) => r.kind === "storage key",
      field: (r) =>
        r.kind === "context key, across items" || r.old === "pluto:field-label",
      tooltip: (r) =>
        r.kind === "context key, inside an item" &&
        r.old !== "pluto:field-label",
      highlighter: (r) => r.kind === "Shiki theme",
    };
    const constants: Record<string, string[]> = {
      theme: ["THEME_KEY", "THEME_SCRIPT"],
      field: ["FIELD_CONTEXT_KEY", "FIELD_SET_CONTEXT_KEY"],
      highlighter: ["shikiTheme.name"],
    };
    for (const [head, covered] of Object.entries(covers)) {
      const b = bullet(head);
      const rows = RENAMES.filter(covered);
      expect(rows.length, head).toBeGreaterThan(0);
      for (const r of rows) {
        expect(b, `${head}: ${r.old}`).toContain(`\`${r.old}\``);
        expect(b, `${head}: ${r.new}`).toContain(`\`${r.new}\``);
        if (r.alias === "0.14.0") expect(b, head).toContain("0.14.0");
      }
      for (const c of constants[head] ?? [])
        expect(b, `${head}: ${c}`).toContain(`\`${c}\``);
    }
  });
});

/**
 * 027a tests 1 and 2: batch A's quiet items, link, button group and
 * progress. Each is a registry:ui of its own, since 0.13.0, with no stock
 * origin; each has one bullet in the 0.13.0 entry.
 */
const BATCH_A_027A: {
  name: string;
  group: string;
  deps: string[];
  packages: string[];
  files: number;
}[] = [
  {
    name: "link",
    group: "navigation",
    deps: ["utils", "kuiper-theme"],
    packages: ["phosphor-svelte@^3.1.1"],
    files: 2,
  },
  {
    name: "button-group",
    group: "actions",
    deps: ["utils", "kuiper-theme", "button"],
    packages: [],
    files: 2,
  },
  {
    name: "progress",
    group: "feedback",
    deps: ["utils", "kuiper-theme"],
    packages: [],
    files: 2,
  },
];

describe("027a test 1: batch A's items are registry:ui items", () => {
  const byName = new Map(
    (
      registry.items as {
        name: string;
        type: string;
        registryDependencies?: string[];
        files: unknown[];
        meta: {
          since?: string;
          modes?: string[];
          group?: string;
          stock?: unknown;
        };
      }[]
    ).map((i) => [i.name, i]),
  );

  test.each(BATCH_A_027A)(
    "$name: registry:ui, since 0.13.0, productive, in $group, no meta.stock, its dependencies and $files files",
    ({ name, group, deps, files }) => {
      const item = byName.get(name);
      expect(item, name).toBeDefined();
      expect(item!.type).toBe("registry:ui");
      expect(item!.meta.since).toBe("0.13.0");
      expect(item!.meta.modes).toEqual(["productive"]);
      expect(item!.meta.group).toBe(group);
      expect("stock" in item!.meta).toBe(false);
      expect(item!.registryDependencies).toEqual(deps);
      expect(item!.files).toHaveLength(files);
    },
  );

  test.each(BATCH_A_027A)(
    "$name: the built item's packages are exactly its icons' package, or none",
    ({ name, packages }) => {
      const built = JSON.parse(
        readFileSync(`static/r/styles/maia/${name}.json`, "utf8"),
      ) as { dependencies?: string[]; devDependencies?: string[] };
      expect(
        [
          ...(built.dependencies ?? []),
          ...(built.devDependencies ?? []),
        ].sort(),
      ).toEqual(packages);
    },
  );
});

describe("027a test 2: the 0.13.0 entry has one bullet per built batch A item", () => {
  const log = readFileSync("CHANGELOG.md", "utf8");
  const entry = log.includes("## 0.13.0")
    ? log.slice(log.indexOf("## 0.13.0"), log.indexOf("\n## 0.12.0"))
    : "";
  const bullets = (name: string) =>
    entry.split("\n").filter((l) => l.startsWith(`- \`${name}\`: `));

  test.each([
    ["link", ["`newTab`", "`noopener", "`linkVariants`"]],
    ["button-group", ["`attached`", "`spaced`", "`aria-label`"]],
    ["progress", ["`<progress>`", "`valuetext`", "`spinner`"]],
  ] as const)("%s: one bullet, new, naming %p", (name, words) => {
    const found = bullets(name);
    expect(found, name).toHaveLength(1);
    expect(found[0]).toContain("new, a `registry:ui`");
    expect(found[0]).not.toContain("**interface change.**");
    for (const w of words) expect(found[0], w).toContain(w);
  });
});

describe("021 criterion 18: the 0.13.0 changelog's token bullets", () => {
  const log = readFileSync("CHANGELOG.md", "utf8");
  const entry = log.includes("## 0.13.0")
    ? log.slice(log.indexOf("## 0.13.0"), log.indexOf("\n## 0.12.0"))
    : "";
  const bullets = entry.split("\n").filter((l) => l.startsWith("- "));

  test("a kuiper-theme bullet says the source is DTCG and the CSS is unchanged", () => {
    const b =
      bullets.find(
        (l) =>
          l.startsWith("- `kuiper-theme`") &&
          l.includes("not an interface change"),
      ) ?? "";
    expect(b).toContain("DTCG 2025.10");
    expect(b).toContain("byte for byte");
  });

  test("a new-files bullet names the files, the folder, and the paths as an interface", () => {
    const b = bullets.find((l) => l.startsWith("- **New:**")) ?? "";
    for (const name of [
      "kuiper.css",
      "kuiper.resolver.json",
      "kuiper.removed.json",
      "/r/tokens/",
    ])
      expect(b, name).toContain(name);
    expect(b).toContain("DTCG token paths");
    expect(b).toContain("interface");
  });
});
