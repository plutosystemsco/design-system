/**
 * 005 decision 17, smoke: `add sidebar dropdown-menu dialog composer
 * message-log theme` into each of 001's two scratch apps, against this
 * repository's `vite dev`, with the locked CLI under Bun. Together the six
 * pull sheet, is-mobile, input, tooltip, skeleton, separator, button, kbd,
 * field, label, input-group, textarea, status, spinner, utils and
 * pluto-theme. Then the files, no style attribute, the groove utility once,
 * the app's prerendered build composing the provider, the sidebar, a menu and
 * the composer, its svelte-check, our lint, and a second add byte-identical.
 */
import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { lintFiles, loadRules } from "../../scripts/lint-literals.ts";
import {
  bin,
  freePort,
  run,
  startDevServer,
  waitFor200,
  type Result,
} from "./process.ts";

const REPO = process.cwd();
const scratch = mkdtempSync(path.join(tmpdir(), "pluto-smoke-navigation-"));
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

const ADDED = [
  "sidebar",
  "dropdown-menu",
  "dialog",
  "composer",
  "message-log",
  "theme",
];

/** Every item the six pull, with its file count from our registry. */
const EXPECTED: [item: string, count: number][] = [
  ["sidebar", 25],
  ["sheet", 11],
  ["dropdown-menu", 17],
  ["dialog", 11],
  ["composer", 2],
  ["message-log", 3],
  ["theme", 4],
  ["input", 2],
  ["tooltip", 6],
  ["skeleton", 2],
  ["separator", 2],
  ["button", 2],
  ["kbd", 3],
  ["field", 12],
  ["label", 2],
  ["input-group", 8],
  ["textarea", 2],
  ["status", 2],
  ["spinner", 2],
];
const registry = JSON.parse(
  readFileSync(path.join(REPO, "registry.json"), "utf8"),
);
const FILES: string[] = [
  ...EXPECTED.flatMap(([name, count]) => {
    const files = registry.items
      .find((i: { name: string }) => i.name === name)
      .files.map(
        (f: { path: string }) =>
          `src/lib/components/ui/${name}/${path.basename(f.path)}`,
      );
    if (files.length !== count)
      throw new Error(`${name}: ${files.length} files, expected ${count}`);
    return files;
  }),
  "src/lib/hooks/is-mobile.svelte.ts",
  "src/lib/utils.ts",
];

function hashTree(app: string): string {
  const hash = createHash("sha256");
  for (const file of FILES) hash.update(readFileSync(path.join(app, file)));
  hash.update(readFileSync(path.join(app, "src", "app.css")));
  return hash.digest("hex");
}

type Run = {
  app: string;
  add: Result;
  build: Result;
  check: Result;
  html: string;
  css: string;
  firstHash: string;
  again: Result;
  secondHash: string;
};

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

    // -o is right here: the scratch app has nothing to protect.
    const add = await run(
      bin(REPO, "shadcn-svelte", "add", ...ADDED, "-y", "-o"),
      app,
      { REGISTRY_URL: `http://localhost:${port}/r` },
    );
    const install2 = await run([process.execPath, "install"], app);
    if (install2.code !== 0)
      throw new Error(`bun install after add failed:\n${install2.output}`);
    const firstHash = existsSync(path.join(app, FILES[0])) ? hashTree(app) : "";

    const ui = `${alias}/components/ui`;
    const routes = path.join(app, "src", "routes");
    mkdirSync(routes, { recursive: true });
    writeFileSync(
      path.join(routes, "+layout.svelte"),
      `<script lang="ts">
  import "../app.css";
  import { ThemeScript } from "${ui}/theme";
  let { children } = $props();
</script>

<ThemeScript />
{@render children()}
`,
    );
    writeFileSync(
      path.join(routes, "+page.svelte"),
      `<script lang="ts">
  import { Composer } from "${ui}/composer";
  import * as Dialog from "${ui}/dialog";
  import * as DropdownMenu from "${ui}/dropdown-menu";
  import { MessageLog } from "${ui}/message-log";
  import * as Sidebar from "${ui}/sidebar";
  import { ThemeToggle } from "${ui}/theme";

  let value = $state("");
</script>

<Sidebar.Provider>
  <header class="flex h-16 items-center gap-4 px-4">
    <Sidebar.Trigger />
    <ThemeToggle />
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>Account</DropdownMenu.Trigger>
      <DropdownMenu.Content label="Account">
        <DropdownMenu.Item>Profile</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item variant="destructive">Sign out</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
    <Dialog.Root>
      <Dialog.Trigger>Rename project</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Rename project</Dialog.Title>
        <Dialog.Description>The new name shows everywhere.</Dialog.Description>
      </Dialog.Content>
    </Dialog.Root>
  </header>
  <div class="flex flex-1">
    <Sidebar.Root>
      <Sidebar.Content>
        <Sidebar.Group>
          <Sidebar.GroupLabel>Platform</Sidebar.GroupLabel>
          <Sidebar.GroupContent>
            <Sidebar.Menu>
              <Sidebar.MenuItem>
                <Sidebar.MenuButton isActive>Overview</Sidebar.MenuButton>
              </Sidebar.MenuItem>
            </Sidebar.Menu>
          </Sidebar.GroupContent>
        </Sidebar.Group>
      </Sidebar.Content>
    </Sidebar.Root>
    <Sidebar.Inset>
      <h1>Dart throws</h1>
      <MessageLog class="h-64">
        <p>A turn.</p>
      </MessageLog>
      <Composer bind:value onsend={() => {}} />
    </Sidebar.Inset>
  </div>
</Sidebar.Provider>
`,
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
    const htmlPath = path.join(app, "build", "index.html");
    const html = existsSync(htmlPath) ? readFileSync(htmlPath, "utf8") : "";
    const css = readFileSync(path.join(app, "src", "app.css"), "utf8");
    const again = await run(
      bin(REPO, "shadcn-svelte", "add", ...ADDED, "-y", "-o"),
      app,
      { REGISTRY_URL: `http://localhost:${port}/r` },
    );
    r = {
      app,
      add,
      build,
      check,
      html,
      css,
      firstHash,
      again,
      secondHash: hashTree(app),
    };
  }, 290_000);

  test("1. add exits 0 under Bun", () => {
    if (r.add.code !== 0) console.error(r.add.output);
    expect(r.add.code).toBe(0);
    expect(r.add.output).toContain(
      "You are currently using an unsupported runtime",
    );
  });

  test(`2. ${FILES.length} files land`, () => {
    const missing = FILES.filter((f) => !existsSync(path.join(r.app, f)));
    expect(missing).toEqual([]);
  });

  test("3. no style attribute in any landed file, and no placeholder", () => {
    for (const file of FILES) {
      const text = readFileSync(path.join(r.app, file), "utf8");
      expect(text, file).not.toMatch(/(^|\s)style(:[\w-]+)?\s*=/);
      for (const placeholder of ["$UTILS$", "$UI$", "$LIB$", "$HOOKS$"])
        expect(text, file).not.toContain(placeholder);
    }
  });

  test("4. app.css holds @utility groove-s once", () => {
    expect(r.css.split("@utility groove-s {").length - 1).toBe(1);
  });

  test("5. the app's vite build passes with the provider, the sidebar, a menu and the composer on a prerendered page, whose head holds the theme script once", () => {
    if (r.build.code !== 0) console.error(r.build.output);
    expect(r.build.code).toBe(0);
    expect(r.html).toContain('data-slot="sidebar-wrapper"');
    expect(r.html).toContain('data-slot="composer"');
    expect(r.html).toContain('data-slot="message-log"');
    expect(r.html).toContain('data-slot="dropdown-menu-trigger"');
    expect(r.html.split('localStorage.getItem("pluto-theme")').length - 1).toBe(
      1,
    );
  });

  test("6. the app's svelte-check reports 0 errors", () => {
    const completed = /COMPLETED \d+ FILES (\d+) ERRORS (\d+) WARNINGS/.exec(
      r.check.output,
    );
    if (!completed || Number(completed[1]) !== 0) console.error(r.check.output);
    expect(completed).not.toBeNull();
    expect(Number(completed![1])).toBe(0);
  });

  test(`7. our lint finds 0 violations in the ${FILES.length} installed files`, () => {
    expect(lintFiles(FILES, loadRules(REPO), r.app)).toEqual([]);
  });

  test("8. a second add of the same is byte-identical", () => {
    if (r.again.code !== 0) console.error(r.again.output);
    expect(r.again.code).toBe(0);
    expect(r.secondHash).toBe(r.firstHash);
  });
});
