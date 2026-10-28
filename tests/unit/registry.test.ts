import { afterAll, beforeAll, describe, expect, test } from "bun:test";
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

const registry = JSON.parse(readFileSync("registry.json", "utf8"));
const version = JSON.parse(readFileSync("package.json", "utf8"))
  .version as string;

const CLI_VERSION = JSON.parse(
  readFileSync("node_modules/shadcn-svelte/package.json", "utf8"),
).version as string;

/** 001 decision 19's six. */
const ITEMS_001: [string, string][] = [
  ["pluto-theme", "registry:theme"],
  ["font-geist", "registry:font"],
  ["font-heading-ibm-plex-sans", "registry:font"],
  ["font-jetbrains-mono", "registry:font"],
  ["utils", "registry:lib"],
  ["four-dot", "registry:ui"],
];

/** 003 decision 5: the 39 items in order, each with its group. */
const GROUPS: [group: string, names: string[]][] = [
  ["foundation", ITEMS_001.map(([n]) => n)],
  ["actions", ["button", "tooltip", "kbd"]],
  [
    "surfaces",
    ["card", "separator", "item", "table", "tabs", "collapsible", "avatar"],
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
  ["blocks", ["hero", "sign-in", "sign-up", "page-states", "settings"]],
];
/** 003 decision 5: the 2 new components and the 5 blocks. */
const BLOCKS = ["hero", "sign-in", "sign-up", "page-states", "settings"];
const ITEMS_003 = ["status", "error-summary", ...BLOCKS];
/** The 26 items 002 added. */
const NEW_ITEMS = GROUPS.slice(1)
  .flatMap(([, names]) => names)
  .filter((n) => !ITEMS_003.includes(n));
const ITEMS: [string, string][] = [
  ...ITEMS_001,
  ...GROUPS.slice(1)
    .flatMap(([, names]) => names)
    .map(
      (n) =>
        [n, BLOCKS.includes(n) ? "registry:block" : "registry:ui"] as [
          string,
          string,
        ],
    ),
];

/** Decision 5's titles for the 7 new items. */
const TITLES: Record<string, string> = {
  status: "Status",
  "error-summary": "Error summary",
  hero: "Hero",
  "sign-in": "Sign in",
  "sign-up": "Sign up",
  "page-states": "Page states",
  settings: "Settings",
};

/** Decision 5: the page files and component files of each block. */
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
};
const GROUP_OF = new Map(
  GROUPS.flatMap(([group, names]) => names.map((n) => [n, group] as const)),
);

/** Decision 2's tailwind-variants row. */
const TV_ITEMS = [
  "button",
  "item",
  "tabs",
  "alert",
  "badge",
  "empty",
  "field",
  "input-group",
];

describe("registry.json", () => {
  test("parses with registrySchema", () => {
    expect(() => registrySchema.parse(registry)).not.toThrow();
  });

  test("holds the 39 items of 003 decision 5, in order, with their types (1, 3, 1, 29, 5)", () => {
    expect(ITEMS).toHaveLength(39);
    const types = ITEMS.map(([, t]) => t);
    expect(
      [
        "registry:theme",
        "registry:font",
        "registry:lib",
        "registry:ui",
        "registry:block",
      ].map((t) => types.filter((x) => x === t).length),
    ).toEqual([1, 3, 1, 29, 5]);
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
        "pluto-theme",
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
      ].sort(),
    );
    expect(deps.size).toBe(24);
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
    expect(ui).toHaveLength(29);
    for (const item of ui) expect(item.files.length).toBeGreaterThanOrEqual(2);
  });

  test("39 of 39 items carry a meta.group among the 6, as decision 5 orders them", () => {
    expect(GROUPS).toHaveLength(6);
    const groups = new Set(GROUPS.map(([g]) => g));
    for (const item of registry.items as {
      name: string;
      meta: { group: string };
    }[]) {
      expect(groups.has(item.meta?.group)).toBe(true);
      expect(item.meta.group).toBe(GROUP_OF.get(item.name)!);
    }
  });

  test("26 of 26 new items carry meta.since 0.2.0 and a 5-field meta.stock", () => {
    const byName = new Map(
      (registry.items as { name: string; meta: any }[]).map((i) => [i.name, i]),
    );
    expect(NEW_ITEMS).toHaveLength(26);
    for (const name of NEW_ITEMS) {
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

  test("7 of 7 new items carry meta.since 0.3.0, no meta.stock, and decision 5's titles", () => {
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
      expect(Object.keys(item.meta).sort()).toEqual(["group", "since"]);
      expect(item.title).toBe(TITLES[name]!);
    }
  });

  test("6 of 6 page files carry no target in registry.json", () => {
    const pages = (
      registry.items as {
        type: string;
        files: { type: string; target?: string }[];
      }[]
    )
      .filter((i) => i.type === "registry:block")
      .flatMap((i) => i.files)
      .filter((f) => f.type === "registry:page");
    expect(pages).toHaveLength(6);
    expect(pages.filter((f) => f.target !== undefined)).toEqual([]);
  });
});

describe("the built registry", () => {
  let out: string;
  const latest = () => path.join(out, "r", "styles", "maia");
  const versioned = () => path.join(out, `v${version}`, "r", "styles", "maia");

  beforeAll(async () => {
    out = mkdtempSync(path.join(tmpdir(), "pluto-registry-"));
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

  test("40 files under r/styles/maia and 40 byte-identical files under the versioned path", () => {
    const files = readdirSync(latest()).sort();
    expect(files).toEqual(
      ["index.json", ...ITEMS.map(([n]) => `${n}.json`)].sort(),
    );
    expect(files).toHaveLength(40);
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

  test("each of the 39 built items parses with registryItemSchema", () => {
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

  test("every target of the 29 registry:ui items starts <name>/", () => {
    const ui = ITEMS.filter(([, type]) => type === "registry:ui");
    expect(ui).toHaveLength(29);
    for (const [name] of ui) {
      const item = JSON.parse(
        readFileSync(path.join(latest(), `${name}.json`), "utf8"),
      );
      for (const file of item.files)
        expect(file.target.startsWith(`${name}/`)).toBe(true);
    }
  });

  test("8 of 8 tailwind-variants items name tailwind-variants@^3.3.1", () => {
    for (const name of TV_ITEMS) {
      const item = JSON.parse(
        readFileSync(path.join(latest(), `${name}.json`), "utf8"),
      );
      expect(item.devDependencies ?? []).toContain("tailwind-variants@^3.3.1");
    }
  });

  test("6 of 6 page files build to <block>/<base name>, 10 of 10 components to bare <block>- names, and 0 targets begin ~/ or src/", () => {
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
    expect([pages, components]).toEqual([6, 10]);
    expect(rooted).toEqual([]);
  });

  test("2 of 2 icon-importing new items name phosphor-svelte@^3.1.1; the other 5 name no package", () => {
    const built = (name: string) =>
      JSON.parse(readFileSync(path.join(latest(), `${name}.json`), "utf8"));
    for (const name of ["error-summary", "page-states"]) {
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

  test("0 of 40 built files carry $UTILS$.js or an /index.js import", () => {
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

  test("pluto-theme's devDependencies are exactly shadcn-svelte@^1.7.1", () => {
    const item = JSON.parse(
      readFileSync(path.join(latest(), "pluto-theme.json"), "utf8"),
    );
    expect(item.devDependencies).toEqual(["shadcn-svelte@^1.7.1"]);
  });
});

describe("wrangler.jsonc", () => {
  const config = JSON.parse(readFileSync("wrangler.jsonc", "utf8"));

  test("parses with JSON.parse", () => {
    expect(typeof config).toBe("object");
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

  test("has a 0.3.0 entry naming the 7 new items: 7 of 7", () => {
    const body = entry("0.3.0");
    for (const name of ITEMS_003) expect(body).toContain(`\`${name}\``);
  });

  test("has a 0.2.0 entry naming pluto-theme and the 26 new items: 27 of 27", () => {
    const body = entry("0.2.0");
    const names = ["pluto-theme", ...NEW_ITEMS];
    expect(names).toHaveLength(27);
    for (const name of names) expect(body).toContain(`\`${name}\``);
  });

  test("still has a 0.1.0 entry naming each of the 6 items", () => {
    const body = entry("0.1.0");
    for (const [name] of ITEMS_001) expect(body).toContain(`\`${name}\``);
  });
});
