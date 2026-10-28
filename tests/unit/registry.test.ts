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

const ITEMS: [string, string][] = [
  ["pluto-theme", "registry:theme"],
  ["font-geist", "registry:font"],
  ["font-heading-ibm-plex-sans", "registry:font"],
  ["font-jetbrains-mono", "registry:font"],
  ["utils", "registry:lib"],
  ["four-dot", "registry:ui"],
];

describe("registry.json", () => {
  test("parses with registrySchema", () => {
    expect(() => registrySchema.parse(registry)).not.toThrow();
  });

  test("holds the 6 items of decision 19, in order, with their types", () => {
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
    expect(ui).toHaveLength(1);
    for (const item of ui) expect(item.files.length).toBeGreaterThanOrEqual(2);
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

  test("7 files under r/styles/maia and 7 byte-identical files under the versioned path", () => {
    const files = readdirSync(latest()).sort();
    expect(files).toEqual([
      "font-geist.json",
      "font-heading-ibm-plex-sans.json",
      "font-jetbrains-mono.json",
      "four-dot.json",
      "index.json",
      "pluto-theme.json",
      "utils.json",
    ]);
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

  test("each of the 6 built items parses with registryItemSchema", () => {
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

  test("four-dot's 3 targets start four-dot/", () => {
    const item = JSON.parse(
      readFileSync(path.join(latest(), "four-dot.json"), "utf8"),
    );
    expect(item.files).toHaveLength(3);
    for (const file of item.files)
      expect(file.target.startsWith("four-dot/")).toBe(true);
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
  test("has a 0.1.0 entry naming each of the 6 items", () => {
    const text = readFileSync("CHANGELOG.md", "utf8");
    const match = text.match(
      /^## 0\.1\.0\b[^\n]*\n([\s\S]*?)(?=^## |$(?![\s\S]))/m,
    );
    expect(match).not.toBeNull();
    for (const [name] of ITEMS) expect(match![1]).toContain(`\`${name}\``);
  });
});
