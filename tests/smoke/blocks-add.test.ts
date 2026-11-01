/**
 * 003 decision 20, smoke: one `add` of the blocks into each of 001's two
 * scratch apps, against this repository's `vite dev`, with the locked CLI
 * under Bun; then the app's build, its svelte-check and our lint. 006
 * decision 14 widens it to seven blocks: the scratch apps get none of the
 * shell's vite.config.ts lines, so its footer shows no commit and no built row.
 *
 * `SMOKE_BLOCKS=sign-in` narrows the run to the named blocks; the counts are
 * asserted only for all seven.
 */
import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import {
  cpSync,
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
import { lintFiles, loadRules } from "../../scripts/lint-literals.ts";
import { blocks, childPreludes } from "../helpers/css.ts";
import {
  bin,
  freePort,
  run,
  startDevServer,
  waitFor200,
  type Result,
} from "./process.ts";

const REPO = process.cwd();
const ALL = [
  "hero",
  "sign-in",
  "sign-up",
  "page-states",
  "settings",
  "app-shell",
  "chat",
];
// An empty value is unset: `bun run test:smoke` clears it, so only a direct
// `bun test` run can narrow the install.
const BLOCKS = process.env.SMOKE_BLOCKS?.trim()
  ? process.env.SMOKE_BLOCKS.split(",").map((b) => b.trim())
  : ALL;
const FULL = BLOCKS.join() === ALL.join();

const scratch = mkdtempSync(path.join(tmpdir(), "pluto-smoke-blocks-"));
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
};
const registry = JSON.parse(
  readFileSync(path.join(REPO, "registry.json"), "utf8"),
);
const byName = new Map<string, Item>(
  (registry.items as Item[]).map((i) => [i.name, i]),
);

/** Every item the blocks pull, transitively, that carries files. */
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
    .filter((i) => (i.files?.length ?? 0) > 0 && !BLOCKS.includes(i.name));
}

/** Where a file lands in an app with 001's aliases (004: a hook under hooks/, a library under lib/). */
function landed(item: Item, file: { path: string; type: string }): string {
  const base = path.basename(file.path);
  if (item.name === "utils") return "src/lib/utils.ts";
  if (file.type === "registry:page") return `src/routes/${item.name}/${base}`;
  if (file.type === "registry:component") return `src/lib/components/${base}`;
  if (file.type === "registry:hook") return `src/lib/hooks/${base}`;
  if (file.type === "registry:lib") return `src/lib/${base}`;
  return `src/lib/components/ui/${item.name}/${base}`;
}

const BLOCK_FILES = BLOCKS.flatMap((name) => {
  const item = byName.get(name)!;
  return item.files!.map((f) => landed(item, f));
});
const DEP_ITEMS = closure(BLOCKS);
const DEP_FILES = DEP_ITEMS.flatMap((item) =>
  item.files!.map((f) => landed(item, f)),
);
const FILES = [...BLOCK_FILES, ...DEP_FILES];

/** 003 decision 20's 86 dependency files and 006's 115 more, item by item: 201. */
const EXPECTED_DEPS: Record<string, number> = {
  utils: 1,
  button: 2,
  spinner: 2,
  card: 8,
  field: 12,
  label: 2,
  separator: 2,
  input: 2,
  "input-group": 8,
  textarea: 2,
  alert: 5,
  "error-summary": 2,
  status: 2,
  "input-otp": 5,
  empty: 7,
  skeleton: 2,
  "native-select": 4,
  checkbox: 2,
  "radio-group": 3,
  "alert-dialog": 13,
  // 006: the shell's and the chat's.
  "four-dot": 3,
  theme: 4,
  sheet: 11,
  sidebar: 25,
  "is-mobile": 1,
  tooltip: 6,
  kbd: 3,
  breadcrumb: 8,
  "dropdown-menu": 17,
  avatar: 6,
  collapsible: 4,
  "message-log": 3,
  message: 7,
  marker: 4,
  composer: 2,
  "code-block": 9,
  highlighter: 1,
  "use-highlighted-code": 1,
};

/** The prerendered pages and their one h1. */
const H1: Record<string, string> = {
  hero: "Components you copy in and own",
  "sign-in": "Sign in",
  "sign-up": "Create an account",
  "page-states": "Projects",
  settings: "Settings",
  "app-shell": "Projects",
  chat: "Chat",
};

const PACKAGES: [string, string][] = [
  ["bits-ui", "^2.20.2"],
  ["@internationalized/date", "^3.12.4"],
  ["tailwind-variants", "^3.3.1"],
  ["phosphor-svelte", "^3.1.1"],
];

type Run = { app: string; add: Result; build: Result; check: Result };

describe.each([
  ["A, SvelteKit 3 with #lib", "kit3", "#lib"],
  ["B, SvelteKit 2 with $lib", "kit2", "$lib"],
])("app %s", (_label, fixture, alias) => {
  let r: Run;

  beforeAll(async () => {
    const app = path.join(scratch, fixture);
    cpSync(path.join(REPO, "tests", "smoke", "fixtures", fixture), app, {
      recursive: true,
      filter: (src) =>
        !/[\\/](node_modules|\.svelte-kit|build)([\\/]|$)/.test(src),
    });
    const install = await run(
      [process.execPath, "install", "--frozen-lockfile"],
      app,
    );
    if (install.code !== 0)
      throw new Error(`bun install failed:\n${install.output}`);
    const sync = await run(bin(app, "svelte-kit", "sync"), app);
    if (sync.code !== 0)
      throw new Error(`svelte-kit sync failed:\n${sync.output}`);

    // -o is right here: the scratch app is fresh, with nothing to protect.
    const add = await run(
      bin(REPO, "shadcn-svelte", "add", ...BLOCKS, "-y", "-o"),
      app,
      { REGISTRY_URL: `http://localhost:${port}/r` },
    );

    // The components no shipped page renders, on a route of their own.
    if (BLOCKS.includes("page-states")) {
      const dir = path.join(app, "src", "routes", "smoke-states");
      mkdirSync(dir, { recursive: true });
      const c = `${alias}/components`;
      writeFileSync(
        path.join(dir, "+page.svelte"),
        `<script lang="ts">
  import PageStatesLoading from "${c}/page-states-loading.svelte";
  import PageStatesError from "${c}/page-states-error.svelte";
</script>

<h1>States</h1>
<PageStatesLoading loading>
  <p>Loaded</p>
</PageStatesLoading>
<PageStatesError status={404} level={2} />
<PageStatesError status={403} level={2} />
<PageStatesError status={500} level={2} />
`,
      );
    }

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
    r = { app, add, build, check };
  }, 280_000);

  test("1. one add exits 0 under Bun", () => {
    if (r.add.code !== 0) console.error(r.add.output);
    expect(r.add.code).toBe(0);
    expect(r.add.output).toContain(
      "You are currently using an unsupported runtime",
    );
  });

  test(`2. ${FULL ? 231 : FILES.length} files land: the block files at their app paths and every dependency's`, () => {
    if (FULL) {
      expect(BLOCK_FILES).toHaveLength(30);
      expect(
        Object.fromEntries(
          DEP_ITEMS.map((i) => [i.name, i.files!.length]).sort(),
        ),
      ).toEqual(
        Object.fromEntries(Object.entries(EXPECTED_DEPS).sort()) as Record<
          string,
          number
        >,
      );
      expect(DEP_FILES).toHaveLength(201);
      expect(FILES).toHaveLength(231);
    }
    const missing = FILES.filter((f) => !existsSync(path.join(r.app, f)));
    expect(missing).toEqual([]);
    // What add wrote, counted on disk: two blocks writing one path would
    // leave fewer block files than the registry lists.
    const written = [
      ...BLOCKS.flatMap((block) =>
        readdirSync(path.join(r.app, "src", "routes", block)).map(
          (f) => `src/routes/${block}/${f}`,
        ),
      ),
      ...readdirSync(path.join(r.app, "src", "lib", "components"), {
        withFileTypes: true,
      })
        .filter((e) => e.isFile())
        .map((e) => `src/lib/components/${e.name}`),
    ].sort();
    expect(written).toEqual([...BLOCK_FILES].sort());
    if (FULL) expect(written).toHaveLength(30);
  });

  test("3. no placeholder; the app's alias; each page imports its components from <alias>/components/<block>-…, with 0 relative imports", () => {
    for (const file of FILES) {
      const text = readFileSync(path.join(r.app, file), "utf8");
      for (const placeholder of PLACEHOLDERS)
        expect(text).not.toContain(placeholder);
    }
    for (const file of BLOCK_FILES)
      expect(readFileSync(path.join(r.app, file), "utf8")).not.toMatch(
        /from\s+["']\.\.?\//,
      );
    for (const block of BLOCKS) {
      // The block's page files together (006: the shell's layout imports its parts, its page none).
      const page = readdirSync(path.join(r.app, "src", "routes", block))
        .filter((f) => f.endsWith(".svelte"))
        .map((f) =>
          readFileSync(path.join(r.app, "src", "routes", block, f), "utf8"),
        )
        .join("\n");
      const imports = [
        ...page.matchAll(/from\s+["']([^"']*\/components\/[^"']+)["']/g),
      ]
        .map((m) => m[1]!)
        .filter((spec) => !spec.includes("/components/ui/"));
      expect(imports.length).toBeGreaterThan(0);
      for (const spec of imports)
        expect(spec.startsWith(`${alias}/components/${block}-`)).toBe(true);
    }
  });

  test("4. package.json names the 4 packages, and no tailwind-merge", () => {
    const pkg = JSON.parse(
      readFileSync(path.join(r.app, "package.json"), "utf8"),
    );
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    for (const [name, range] of PACKAGES) expect(deps[name]).toBe(range);
    expect(deps["tailwind-merge"]).toBeUndefined();
  });

  test("5. the app's vite build passes, every route prerendered and crawled", () => {
    if (r.build.code !== 0) console.error(r.build.output);
    expect(r.build.code).toBe(0);
  });

  test("6. each block's prerendered page holds exactly one h1, with its text", () => {
    const pages: [string, string][] = BLOCKS.map((b) => [b, H1[b]!]);
    if (BLOCKS.includes("page-states")) pages.push(["smoke-states", "States"]);
    if (FULL) expect(pages).toHaveLength(8);
    for (const [name, text] of pages) {
      const file = path.join(r.app, "build", `${name}.html`);
      expect(existsSync(file)).toBe(true);
      const html = readFileSync(file, "utf8");
      const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)];
      expect(h1s).toHaveLength(1);
      expect(h1s[0]![1]!.replace(/<[^>]+>/g, "").trim()).toBe(text);
    }
  });

  // 006 decision 14, assertions 3 and 4: no vite lines in the scratch app,
  // so the shell's footer shows no commit (Kit's default name is all digits)
  // and no built row; the skip link is the first element of body.
  test("6b. the shell's page holds the skip link first in body, a footer, and no commit or built row; its vite.config.ts has no git line", () => {
    if (!BLOCKS.includes("app-shell")) {
      // A narrowed run without app-shell: say so, and prove the narrowing.
      console.log(`6b: SMOKE_BLOCKS=${BLOCKS.join()} leaves out app-shell`);
      expect(FULL).toBe(false);
      return;
    }
    const html = readFileSync(
      path.join(r.app, "build", "app-shell.html"),
      "utf8",
    );
    const body = html.slice(html.indexOf("<body"));
    const firstTag =
      /<body[^>]*>(?:\s|<div[^>]*>|<!--[^>]*-->)*<([a-z]+)[^>]*data-slot="([a-z-]+)"/.exec(
        body,
      );
    expect(firstTag?.[1]).toBe("a");
    expect(firstTag?.[2]).toBe("app-shell-skip-link");
    expect(body).toContain("<footer");
    expect(body).not.toMatch(/<dt[^>]*>commit<\/dt>/);
    expect(body).not.toMatch(/<dt[^>]*>built<\/dt>/);
    expect(body).toMatch(/<dt[^>]*>source<\/dt>/);
    // No word stands in for a missing commit.
    expect(body).not.toContain("unknown");
    expect(
      readFileSync(path.join(r.app, "vite.config.ts"), "utf8"),
    ).not.toContain("git");
  });

  test("7. the app's svelte-check reports 0 errors", () => {
    const completed = /COMPLETED \d+ FILES (\d+) ERRORS (\d+) WARNINGS/.exec(
      r.check.output,
    );
    if (!completed || Number(completed[1]) !== 0) console.error(r.check.output);
    expect(completed).not.toBeNull();
    expect(Number(completed![1])).toBe(0);
  });

  test(`8. our lint finds 0 violations in the ${FULL ? 231 : FILES.length} installed files`, () => {
    expect(lintFiles(FILES, loadRules(REPO), r.app)).toEqual([]);
  });

  // 006 decision 14, assertion 8: the CLI's merge of the theme's nested rules.
  test("9. app.css holds @utility mark-entrance with its 4 nested nth-child rules, @utility groove-b, the keyframes, and a reduce block of exactly 3 selectors", () => {
    const css = readFileSync(path.join(r.app, "src", "app.css"), "utf8");
    const entrance = blocks(css).find(
      (b) => b.prelude === "@utility mark-entrance",
    );
    expect(entrance).toBeDefined();
    expect(
      entrance!.children.filter((c) => /:nth-child\([1-4]\)/.test(c.prelude)),
    ).toHaveLength(4);
    expect(entrance!.children.length).toBeGreaterThanOrEqual(5);
    expect(css.match(/@utility mark-entrance\s*\{/g)).toHaveLength(1);
    expect(
      blocks(css).filter((b) => b.prelude === "@utility groove-b"),
    ).toHaveLength(1);
    expect(css).toContain("@keyframes pluto-mark-dock");
    expect(
      childPreludes(css, "@media (prefers-reduced-motion: reduce)"),
    ).toEqual([
      "html:root",
      "*, ::before, ::after",
      '.mark-entrance [data-slot="four-dot-dot"]',
    ]);
  });

  // 006 decision 14, assertion 10: a second add is byte-identical.
  test("10. a second add changes 0 of the block files", async () => {
    const before = Object.fromEntries(
      BLOCK_FILES.map((f) => [f, readFileSync(path.join(r.app, f), "utf8")]),
    );
    const again = await run(
      bin(REPO, "shadcn-svelte", "add", ...BLOCKS, "-y", "-o"),
      r.app,
      { REGISTRY_URL: `http://localhost:${port}/r` },
    );
    expect(again.code).toBe(0);
    const changed = BLOCK_FILES.filter(
      (f) => readFileSync(path.join(r.app, f), "utf8") !== before[f],
    );
    expect(changed).toEqual([]);
  });
});
