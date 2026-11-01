/**
 * 003 decision 20, unit file 5: the blocks, statically, over registry.json,
 * the block and error-summary sources, and a registry built into a temporary
 * folder. 006 decision 14 widens it to 7 blocks and 30 files, with page files
 * that may be layouts or server loads, and components that may be .ts.
 */
import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import {
  existsSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { buildRegistry } from "../../scripts/build-registry.ts";
import { lintFiles, loadRules } from "../../scripts/lint-literals.ts";
import { BLOCK_VIEWS } from "../../src/lib/preview/blocks.ts";
import { toAppFiles, type BuiltFile } from "../../src/lib/server/built-item.ts";

type Item = {
  name: string;
  type: string;
  registryDependencies: string[];
  files: { path: string; type: string; target?: string }[];
};

const registry = JSON.parse(readFileSync("registry.json", "utf8"));
const items = registry.items as Item[];
const BLOCKS = [
  "hero",
  "sign-in",
  "sign-up",
  "page-states",
  "settings",
  "app-shell",
  "chat",
];
const blocks = items.filter((i) => i.type === "registry:block");
const blockFiles = blocks.flatMap((b) =>
  b.files.map((f) => ({ block: b.name, ...f })),
);
const read = (file: string) => readFileSync(file, "utf8");

let out: string;
const built = (name: string) =>
  JSON.parse(
    readFileSync(path.join(out, "r", "styles", "maia", `${name}.json`), "utf8"),
  ) as { files: BuiltFile[] };

beforeAll(async () => {
  out = mkdtempSync(path.join(tmpdir(), "pluto-blocks-"));
  await buildRegistry({ out, quiet: true });
}, 60_000);

afterAll(() => {
  if (out) rmSync(out, { recursive: true, force: true });
});

test("the registry holds the 7 blocks, in order, with 30 files", () => {
  expect(blocks.map((b) => b.name)).toEqual(BLOCKS);
  expect(blockFiles).toHaveLength(30);
});

describe("1. dependencies suffice", () => {
  test.each(BLOCKS)(
    "%s: every $UI$ import is a dependency, every $COMPONENTS$ import a file of its own",
    (name) => {
      const item = blocks.find((b) => b.name === name)!;
      const files = built(name).files;
      const own = new Set(files.map((f) => f.target));
      // A .ts component (chat-types) is imported without its extension.
      const shipped = (c: string) => own.has(c) || own.has(`${c}.ts`);
      const missing: string[] = [];
      for (const file of files) {
        const text = file.content ?? "";
        for (const [, ui] of text.matchAll(/\$UI\$\/([a-z0-9-]+)/g))
          if (!item.registryDependencies.includes(ui!))
            missing.push(`${file.target}: $UI$/${ui}`);
        for (const [, c] of text.matchAll(/\$COMPONENTS\$\/([^"'`\s]+)/g))
          if (!shipped(c!)) missing.push(`${file.target}: $COMPONENTS$/${c}`);
      }
      expect(missing).toEqual([]);
    },
  );
});

describe("2. no block uses another", () => {
  test("0 imports of #lib/registry/blocks in any item file", () => {
    const files = items.flatMap((i) => i.files.map((f) => f.path));
    expect(
      files.filter((f) => read(f).includes("#lib/registry/blocks")),
    ).toEqual([]);
  });

  test("0 $COMPONENTS$ imports of another block's file", () => {
    const crossing: string[] = [];
    for (const name of BLOCKS)
      for (const file of built(name).files)
        for (const [, c] of (file.content ?? "").matchAll(
          /\$COMPONENTS\$\/([^"'`\s]+)/g,
        ))
          if (!c!.startsWith(`${name}-`))
            crossing.push(`${name}: ${file.target} → ${c}`);
    expect(crossing).toEqual([]);
  });

  test("0 registry:block names among any block's dependencies", () => {
    expect(
      blocks.flatMap((b) =>
        b.registryDependencies.filter((d) => BLOCKS.includes(d)),
      ),
    ).toEqual([]);
  });
});

test("3. no unshipped file: 0 <img and 0 asset paths in the 30 block files", () => {
  const found: string[] = [];
  const asset =
    /(["'`])[^"'`\n]*\.(svg|png|jpg|jpeg|webp|gif|avif|ico|woff|woff2)\1/gi;
  for (const f of blockFiles) {
    const text = read(f.path);
    if (/<img\b/i.test(text)) found.push(`${f.path}: <img`);
    for (const m of text.matchAll(asset)) found.push(`${f.path}: ${m[0]}`);
  }
  expect(found).toEqual([]);
});

test('4. the link rule: every quoted string beginning with / in the 30 block files is "/"', () => {
  const found: string[] = [];
  for (const f of blockFiles)
    for (const m of read(f.path).matchAll(/(["'`])(\/[^"'`\n]*)\1/g))
      if (m[2] !== "/") found.push(`${f.path}: ${m[0]}`);
  expect(found).toEqual([]);
});

describe("5. the naming rule", () => {
  const components = blockFiles.filter((f) => f.type === "registry:component");
  const pages = blockFiles.filter((f) => f.type === "registry:page");

  // 10 from 003's blocks, 6 from app-shell, 4 from chat: 20.
  test("20 of 20 component files are src/lib/registry/components/<block>-*.(svelte|ts)", () => {
    expect(components).toHaveLength(20);
    for (const f of components)
      expect(f.path).toMatch(
        new RegExp(
          `^src/lib/registry/components/${f.block}-[a-z-]+\\.(svelte|ts)$`,
        ),
      );
  });

  test("10 of 10 page files are src/lib/registry/blocks/<block>/+(page|error|layout)(.server)?.(svelte|ts)", () => {
    expect(pages).toHaveLength(10);
    for (const f of pages)
      expect(f.path).toMatch(
        new RegExp(
          `^src/lib/registry/blocks/${f.block}/\\+(page|error|layout)(\\.server)?\\.(svelte|ts)$`,
        ),
      );
  });

  test("0 base names repeated across the component files", () => {
    const names = components.map((f) => path.basename(f.path));
    expect(new Set(names).size).toBe(names.length);
  });
});

test("6. the lint: 30 of 30 block files with 0 violations", () => {
  const files = blockFiles.map((f) => f.path);
  expect(files).toHaveLength(30);
  expect(lintFiles(files, loadRules())).toEqual([]);
});

test("7. the voice: 0 banned words in the 30 block files and the 2 error-summary files", () => {
  const banned =
    /\b(sorry|oops|whoops|something went wrong|on our side|signed in as|meets wcag)\b/i;
  const files = [
    ...blockFiles.map((f) => f.path),
    ...items.find((i) => i.name === "error-summary")!.files.map((f) => f.path),
  ];
  expect(files).toHaveLength(32);
  expect(files.filter((f) => banned.test(read(f)))).toEqual([]);
});

describe("8. the views", () => {
  const views = Object.entries(BLOCK_VIEWS).flatMap(([block, list]) =>
    list.map((v) => ({ block, ...v })),
  );
  // 006 decision 12: the shell's views live in the (shell) group, since the
  // shell renders its own main; every other view in (view).
  const GROUP: Record<string, string> = { "app-shell": "(shell)" };
  const routeFile = (block: string, state: string) =>
    path.join(
      `src/routes/${GROUP[block] ?? "(view)"}/view`,
      block,
      ...(state ? [state] : []),
      "+page.svelte",
    );

  test("BLOCK_VIEWS lists the 7 blocks in registry order, with 28 views", () => {
    expect(Object.keys(BLOCK_VIEWS)).toEqual(BLOCKS);
    expect(views).toHaveLength(28);
  });

  test("28 of 28 views have their route file, under (view) or (shell)", () => {
    expect(
      views.filter((v) => existsSync(routeFile(v.block, v.path))),
    ).toHaveLength(28);
  });

  test("0 other +page.svelte files under src/routes/(view)/view/ or src/routes/(shell)/view/", () => {
    const expected = new Set(views.map((v) => routeFile(v.block, v.path)));
    const found: string[] = [];
    const walk = (dir: string) => {
      if (!existsSync(dir)) return;
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(p);
        else if (entry.name === "+page.svelte") found.push(p);
      }
    };
    walk("src/routes/(view)/view");
    walk("src/routes/(shell)/view");
    expect(found.filter((f) => !expected.has(f))).toEqual([]);
  });
});

test("9. the code view maps 30 of 30 block files to an app path and leaves 0 placeholders", () => {
  const mapped = BLOCKS.flatMap((name) => toAppFiles(built(name).files));
  expect(mapped).toHaveLength(30);
  for (const file of mapped) {
    expect(file.appPath).toMatch(
      /^(src\/routes\/[a-z-]+\/\+(page|error|layout)(\.server)?\.(svelte|ts)|src\/lib\/components\/[a-z-]+\.(svelte|ts))$/,
    );
    expect(file.text).not.toMatch(/\$(COMPONENTS|UI|UTILS|HOOKS|LIB)\$/);
  }
});

test("10. the password floor: Math.max(15, in sign-up-form.svelte, and no maxlength", () => {
  const text = read("src/lib/registry/components/sign-up-form.svelte");
  expect(text).toContain("Math.max(15,");
  expect(text).not.toMatch(/maxlength/i);
});

// 006 decision 14, check 11: the shell's layout files as an app gets them.
test("11. app-shell's +layout.server.ts imports nothing from ./$types, and +layout.svelte reads data.sidebarOpen", () => {
  const server = read("src/lib/registry/blocks/app-shell/+layout.server.ts");
  expect(server).not.toContain("./$types");
  expect(server).toContain("ServerLoadEvent");
  expect(server).toContain("sidebar_state");
  const layout = read("src/lib/registry/blocks/app-shell/+layout.svelte");
  expect(layout).toContain("data.sidebarOpen");
  expect(layout).not.toContain("./$types");
  // Every block page file stays free of ./$types (003 decision 2).
  expect(blockFiles.filter((f) => read(f.path).includes("./$types"))).toEqual(
    [],
  );
});
