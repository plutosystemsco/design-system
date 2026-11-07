/**
 * 010 criterion 10, smoke: `add product-home` into each of 001's two scratch
 * apps, against this repository's `vite dev`, with the locked CLI under Bun;
 * then the app's build, its svelte-check and our lint, on the pattern of
 * blocks-add.test.ts. Review finding 2: one more app adds `proof-band` alone,
 * whose only library is `read-token`, and builds.
 */
import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import {
  cpSync,
  existsSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  lintFiles,
  loadRules,
  type Mode,
  type Violation,
} from "../../scripts/lint-literals.ts";
import {
  bin,
  freePort,
  run,
  startDevServer,
  waitFor200,
  type Result,
} from "./process.ts";

const REPO = process.cwd();
const scratch = mkdtempSync(path.join(tmpdir(), "pluto-smoke-compositions-"));
const port = freePort();
let server: ReturnType<typeof startDevServer> | undefined;

beforeAll(async () => {
  server = startDevServer(REPO, port, path.join(scratch, "vite-dev.log"));
  await waitFor200(
    `http://localhost:${port}/r/styles/maia/index.json`,
    60_000,
    server,
  );
}, 70_000);

afterAll(async () => {
  server?.kill();
  await server?.exited;
  rmSync(scratch, { recursive: true, force: true });
});

const PLACEHOLDERS = ["$UTILS$", "$UI$", "$LIB$", "$HOOKS$", "$COMPONENTS$"];

type Item = {
  name: string;
  type: string;
  registryDependencies?: string[];
  files?: { path: string; type: string }[];
  meta?: { modes?: Mode[] };
};
const registry = JSON.parse(
  readFileSync(path.join(REPO, "registry.json"), "utf8"),
);
const byName = new Map<string, Item>(
  (registry.items as Item[]).map((i) => [i.name, i]),
);

/** Every item `names` pull, transitively, that carries files, themselves included. */
function closure(names: string[]): Item[] {
  const seen = new Set<string>();
  const visit = (name: string) => {
    if (seen.has(name)) return;
    seen.add(name);
    for (const dep of byName.get(name)?.registryDependencies ?? []) visit(dep);
  };
  names.forEach(visit);
  return [...seen]
    .map((n) => byName.get(n)!)
    .filter((i) => (i.files?.length ?? 0) > 0);
}

/** Where a file lands in an app with 001's aliases. */
function landed(item: Item, file: { path: string; type: string }): string {
  const base = path.basename(file.path);
  if (item.name === "utils") return "src/lib/utils.ts";
  if (file.type === "registry:page") return `src/routes/${item.name}/${base}`;
  if (file.type === "registry:component") return `src/lib/components/${base}`;
  if (file.type === "registry:hook") return `src/lib/hooks/${base}`;
  if (file.type === "registry:lib") return `src/lib/${base}`;
  return `src/lib/components/ui/${item.name}/${base}`;
}

/**
 * Each landed file with its item's lint profile: an installed app has no
 * registry, so the compositions are linted as the registry lints them,
 * expressive-only, and every other file as productive (009 decision 9).
 */
function filesOf(names: string[]) {
  const files: string[] = [];
  const profiles = new Map<string, readonly Mode[]>();
  // 012: each landed file's item, so L24's one allowance still applies to
  // liquid-glass's pointer-light.ts in an app that has no registry.
  const owners = new Map<string, string[]>();
  for (const item of closure(names))
    for (const file of item.files!) {
      const at = landed(item, file);
      files.push(at);
      profiles.set(at, item.meta?.modes ?? ["productive"]);
      owners.set(at, [item.name]);
    }
  return { files, profiles, owners };
}

/** The nine compositions and product-home's page, as the CLI lands them. */
const COMPOSITIONS = [
  "stage",
  "stage-card",
  "marketing-bar",
  "stage-hero",
  "proof-band",
  "live-console",
  "name-strip",
  "cta-band",
  "marketing-footer",
];

type Run = { app: string; add: Result; build: Result; check: Result };

async function install(fixture: string, folder: string, names: string[]) {
  const app = path.join(scratch, folder);
  cpSync(path.join(REPO, "tests", "smoke", "fixtures", fixture), app, {
    recursive: true,
    filter: (src) =>
      !/[\\/](node_modules|\.svelte-kit|build)([\\/]|$)/.test(src),
  });
  const setup = await run(
    [process.execPath, "install", "--frozen-lockfile"],
    app,
  );
  if (setup.code !== 0) throw new Error(`bun install failed:\n${setup.output}`);
  const sync = await run(bin(app, "svelte-kit", "sync"), app);
  if (sync.code !== 0)
    throw new Error(`svelte-kit sync failed:\n${sync.output}`);
  // -o is right here: the scratch app is fresh, with nothing to protect.
  const add = await run(
    bin(REPO, "shadcn-svelte", "add", ...names, "-y", "-o"),
    app,
    { REGISTRY_URL: `http://localhost:${port}/r` },
  );
  const build = await run(bin(app, "vite", "build"), app);
  const check = await run(
    bin(
      app,
      "svelte-check",
      "--tsconfig",
      "./tsconfig.json",
      "--output",
      "machine",
    ),
    app,
  );
  return { app, add, build, check } satisfies Run;
}

function expectCheckClean(r: Run) {
  const completed = /COMPLETED \d+ FILES (\d+) ERRORS (\d+) WARNINGS/.exec(
    r.check.output,
  );
  if (!completed || Number(completed[1]) !== 0) console.error(r.check.output);
  expect(completed).not.toBeNull();
  expect(Number(completed![1])).toBe(0);
}

describe.each([
  ["A, SvelteKit 3 with #lib", "kit3"],
  ["B, SvelteKit 2 with $lib", "kit2"],
])("product-home into app %s", (_label, fixture) => {
  let r: Run;
  const { files, profiles, owners } = filesOf(["product-home"]);

  beforeAll(async () => {
    r = await install(fixture, `${fixture}-home`, ["product-home"]);
  }, 280_000);

  test("1. one add exits 0 under Bun", () => {
    if (r.add.code !== 0) console.error(r.add.output);
    expect(r.add.code).toBe(0);
  });

  test("2. the route, the nine compositions, four-dot, read-token and every dependency land", () => {
    expect(files).toContain("src/routes/product-home/+page.svelte");
    for (const name of COMPOSITIONS)
      expect(files).toContain(`src/lib/components/ui/${name}/${name}.svelte`);
    expect(files).toContain("src/lib/read-token.ts");
    expect(files).toContain("src/lib/components/ui/four-dot/lockup.svelte");
    expect(files).toContain("src/lib/components/ui/tabs/tabs.svelte");
    expect(files).toContain("src/lib/components/ui/meter/meter.svelte");
    // 012 decisions 3, 4 and 7: the glass lands with the hero, the bar and the block.
    expect(files).toContain(
      "src/lib/components/ui/liquid-glass/pointer-light.ts",
    );
    // "Frost only, no lens": the item has no lens file.
    expect(files).not.toContain(
      "src/lib/components/ui/liquid-glass/glass-lens.svelte",
    );
    const missing = files.filter((f) => !existsSync(path.join(r.app, f)));
    expect(missing).toEqual([]);
    // The block writes one page file and no component of its own.
    expect(
      readdirSync(path.join(r.app, "src", "routes", "product-home")),
    ).toEqual(["+page.svelte"]);
  });

  test("3. no placeholder in any landed file, and no relative import in the page", () => {
    for (const file of files) {
      const text = readFileSync(path.join(r.app, file), "utf8");
      for (const placeholder of PLACEHOLDERS)
        expect(text).not.toContain(placeholder);
    }
    expect(
      readFileSync(
        path.join(r.app, "src/routes/product-home/+page.svelte"),
        "utf8",
      ),
    ).not.toMatch(/from\s+["']\.\.?\//);
  });

  test("4. the app's vite build passes, the page prerendered with one h1", () => {
    if (r.build.code !== 0) console.error(r.build.output);
    expect(r.build.code).toBe(0);
    const html = readFileSync(
      path.join(r.app, "build", "product-home.html"),
      "utf8",
    );
    const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)];
    expect(h1s).toHaveLength(1);
    expect(h1s[0]![1]!.replace(/<[^>]+>/g, "").trim()).toBe(
      "Work runs on data.",
    );
  });

  // 012 criterion 9: the hero's field class is written out in its file, so
  // the app's Tailwind emits the theme's field utility (review finding 9).
  test("4b. the app's built CSS holds the field, glass, surface-plain and busy-edge rules", () => {
    const assets = path.join(r.app, "build", "_app", "immutable", "assets");
    const css = readdirSync(assets)
      .filter((f) => f.endsWith(".css"))
      .map((f) => readFileSync(path.join(assets, f), "utf8"))
      .join("\n");
    for (const selector of [
      ".field-1",
      ".field-3",
      ".field-4",
      ".glass",
      ".surface-plain",
      ".busy-edge",
    ])
      expect(css, selector).toContain(selector);
  });

  test("5. the app's svelte-check reports 0 errors", () => {
    expectCheckClean(r);
  });

  test("6. our lint finds 0 violations in the landed files, each with its item's profile, and L24's one allowance", () => {
    const allowances: Violation[] = [];
    expect(
      lintFiles(files, loadRules(REPO), r.app, profiles, allowances, owners),
    ).toEqual([]);
    expect(allowances.map((a) => [a.file, a.rule])).toEqual([
      ["src/lib/components/ui/liquid-glass/pointer-light.ts", "L24"],
    ]);
  });
});

describe("proof-band alone into app A", () => {
  let r: Run;
  const { files } = filesOf(["proof-band"]);

  beforeAll(async () => {
    r = await install("kit3", "kit3-proof", ["proof-band"]);
  }, 280_000);

  test("its file and read-token land, the add and the build pass, and svelte-check reports 0 errors", () => {
    if (r.add.code !== 0) console.error(r.add.output);
    expect(r.add.code).toBe(0);
    expect(files.sort()).toEqual(
      [
        "src/lib/components/ui/proof-band/index.ts",
        "src/lib/components/ui/proof-band/proof-band.svelte",
        "src/lib/read-token.ts",
        "src/lib/utils.ts",
      ].sort(),
    );
    for (const f of files) expect(existsSync(path.join(r.app, f))).toBe(true);
    if (r.build.code !== 0) console.error(r.build.output);
    expect(r.build.code).toBe(0);
    expectCheckClean(r);
  });
});
