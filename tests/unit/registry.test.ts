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

/** 002 decision 6: the 32 items in order, each with its group. */
const GROUPS: [group: string, names: string[]][] = [
  ["foundation", ITEMS_001.map(([n]) => n)],
  ["actions", ["button", "tooltip", "kbd"]],
  [
    "surfaces",
    ["card", "separator", "item", "table", "tabs", "collapsible", "avatar"],
  ],
  [
    "feedback",
    ["alert", "alert-dialog", "badge", "empty", "skeleton", "spinner"],
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
];
const NEW_ITEMS = GROUPS.slice(1).flatMap(([, names]) => names);
const ITEMS: [string, string][] = [
  ...ITEMS_001,
  ...NEW_ITEMS.map((n) => [n, "registry:ui"] as [string, string]),
];
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

  test("holds the 32 items of 002 decision 6, in order, with their types", () => {
    expect(ITEMS).toHaveLength(32);
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
      ].sort(),
    );
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
    expect(ui).toHaveLength(27);
    for (const item of ui) expect(item.files.length).toBeGreaterThanOrEqual(2);
  });

  test("32 of 32 items carry a meta.group among the 5, as decision 6 orders them", () => {
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

  test("33 files under r/styles/maia and 33 byte-identical files under the versioned path", () => {
    const files = readdirSync(latest()).sort();
    expect(files).toEqual(
      ["index.json", ...ITEMS.map(([n]) => `${n}.json`)].sort(),
    );
    expect(files).toHaveLength(33);
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

  test("each of the 32 built items parses with registryItemSchema", () => {
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

  test("every target of the 27 registry:ui items starts <name>/", () => {
    const ui = ITEMS.filter(([, type]) => type === "registry:ui");
    expect(ui).toHaveLength(27);
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

  test("0 of 33 built files carry $UTILS$.js or an /index.js import", () => {
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
