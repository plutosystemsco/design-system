/**
 * 004 decision 17 and 013 decision 21, smoke: `add code-editor code-block
 * chart popover accordion toggle-group meter code-languages` into each of
 * 001's two scratch apps, against this repository's `vite dev`, with the
 * locked CLI under Bun. Together the eight pull use-highlighted-code,
 * highlighter (29 files, 21 dependencies), status, button, spinner, toggle,
 * utils and pluto-theme. Then, with the dev server STOPPED, the app's
 * prerendered build and its svelte-check, so nothing reaches back to this
 * repository; our lint; the theme's by-product; the client build's 21 WASM
 * files; and the built page's requests, which fetch the runtime and Python's
 * grammar alone.
 *
 * Two more apps: an upgrade from `v0.11.0`, whose app.css then holds exactly
 * the stale lines the changelog lists; and `kit3-node`, on adapter-node,
 * whose request-time `load` highlights after a production-only install.
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
import { chromium } from "@playwright/test";
import { lintFiles, loadRules } from "../../scripts/lint-literals.ts";
import { blocks, topLevelMap } from "../helpers/css.ts";
import {
  bin,
  freePort,
  run,
  startDevServer,
  waitFor200,
  type Result,
} from "./process.ts";

const REPO = process.cwd();
const scratch = mkdtempSync(path.join(tmpdir(), "pluto-smoke-code-"));
const port = freePort();
const REGISTRY = `http://localhost:${port}/r`;
let server: ReturnType<typeof startDevServer> | undefined;
let starts = 0;

/** Starts this repository's dev server, the registry the apps add from. */
async function startRegistry() {
  server = startDevServer(
    REPO,
    port,
    path.join(scratch, `vite-dev-${++starts}.log`),
  );
  await waitFor200(`${REGISTRY}/styles/maia/index.json`, 60_000, server);
}

/** Stops it, and proves it is gone: nothing an app builds can reach it. */
async function stopRegistry() {
  server?.kill();
  await server?.exited;
  server = undefined;
  const reached = await fetch(`${REGISTRY}/styles/maia/index.json`)
    .then(() => true)
    .catch(() => false);
  expect(reached, "the registry is unreachable").toBe(false);
}

afterAll(async () => {
  server?.kill();
  await server?.exited;
  rmSync(scratch, { recursive: true, force: true });
});

const PLACEHOLDERS = ["$UTILS$", "$UI$", "$LIB$", "$HOOKS$", "$COMPONENTS$"];

const registry = JSON.parse(
  readFileSync(path.join(REPO, "registry.json"), "utf8"),
);
const itemOf = (name: string) =>
  registry.items.find((i: { name: string }) => i.name === name);

/** The 77 files: each ui item's files, the highlighter's 29 at their targets, the hook, code-languages and utils. */
const EXPECTED: [item: string, count: number][] = [
  ["code-editor", 5],
  ["code-block", 9],
  ["status", 2],
  ["button", 2],
  ["spinner", 2],
  ["chart", 4],
  ["popover", 9],
  ["accordion", 5],
  ["toggle-group", 3],
  ["toggle", 2],
  ["meter", 2],
];
const HIGHLIGHTER_FILES: string[] = itemOf("highlighter").files.map(
  (f: { target: string }) => `src/lib/${f.target}`,
);
const FILES: string[] = [
  ...EXPECTED.flatMap(([name]) =>
    itemOf(name).files.map(
      (f: { path: string }) =>
        `src/lib/components/ui/${name}/${path.basename(f.path)}`,
    ),
  ),
  ...HIGHLIGHTER_FILES,
  "src/lib/hooks/use-highlighted-code.svelte.ts",
  "src/lib/code-languages.ts",
  "src/lib/utils.ts",
];

/** 013 decision 5: the highlighter's 21 dependencies. */
const DEPENDENCIES: string[] = itemOf("highlighter").dependencies;

/** The CodeMirror packages, 002's 4 and 007 decision 7's 2, at their ranges, wherever the app lists them. */
const PACKAGES: [string, string][] = [
  ["@codemirror/state", "^6.7.6"],
  ["@codemirror/view", "^6.43.15"],
  ["@codemirror/language", "^6.13.1"],
  ["@codemirror/commands", "^6.11.1"],
  ["@codemirror/autocomplete", "^6.20.4"],
  ["@codemirror/lang-python", "^6.2.1"],
  ["layerchart", "^2.9.2"],
  ["bits-ui", "^2.20.2"],
  ["@internationalized/date", "^3.12.4"],
  ["tailwind-variants", "^3.3.1"],
  ["phosphor-svelte", "^3.1.1"],
  ["@codemirror/language-data", "^6.5.2"],
  ["@replit/codemirror-lang-svelte", "^6.0.0"],
];

/** Copies a fixture into the scratch folder, installs it from its lock and syncs it. */
async function prepare(fixture: string, name = fixture): Promise<string> {
  const app = path.join(scratch, name);
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
  return app;
}

/** Runs the locked CLI's `add` against a registry URL. */
const add = (app: string, url: string, ...items: string[]) =>
  run(bin(REPO, "shadcn-svelte", "add", ...items, "-y", "-o"), app, {
    REGISTRY_URL: url,
  });

/** Serves a static build, for the browser check. */
function serveStatic(dir: string) {
  return Bun.serve({
    port: 0,
    async fetch(request) {
      const url = new URL(request.url);
      let file = path.join(dir, decodeURIComponent(url.pathname));
      if (url.pathname.endsWith("/")) file = path.join(file, "index.html");
      const f = Bun.file(file);
      return (await f.exists())
        ? new Response(f)
        : new Response("not found", { status: 404 });
    },
  });
}

type Run = {
  app: string;
  add: Result;
  build: Result;
  check: Result;
  html: string;
  cssAfterFirst: string;
  theme: Result;
  cssAfterSecond: string;
  wasmRequests: string[];
};

/** The first app's stylesheet, a fresh 0.12.0 install, for the upgrade case. */
let freshCss = "";

describe.each([
  ["A, SvelteKit 3 with #lib", "kit3", "#lib"],
  ["B, SvelteKit 2 with $lib", "kit2", "$lib"],
])("app %s", (_label, fixture, alias) => {
  let r: Run;

  beforeAll(async () => {
    const app = await prepare(fixture);
    await startRegistry();
    // -o is right here: the scratch app has nothing to protect.
    const added = await add(
      app,
      REGISTRY,
      "code-editor",
      "code-block",
      "chart",
      "popover",
      "accordion",
      "toggle-group",
      "meter",
      "code-languages",
    );
    const css = () => readFileSync(path.join(app, "src", "app.css"), "utf8");
    const cssAfterFirst = css();
    const theme = await add(app, REGISTRY, "pluto-theme");
    const cssAfterSecond = css();
    // From here on the app is on its own: nothing reaches this repository.
    await stopRegistry();
    // The new packages must be installed before the app builds.
    const install2 = await run([process.execPath, "install"], app);
    if (install2.code !== 0)
      throw new Error(`bun install after add failed:\n${install2.output}`);

    const ui = `${alias}/components/ui`;
    const routes = path.join(app, "src", "routes");
    mkdirSync(routes, { recursive: true });
    writeFileSync(
      path.join(routes, "+page.server.ts"),
      `import { highlightCode } from "${alias}/highlighter";

export const load = async () => ({
  lines: await highlightCode("def add(a, b):\\n    return a + b  # sum\\n", "python"),
});
`,
    );
    writeFileSync(
      path.join(routes, "+page.svelte"),
      `<script lang="ts">
  import { Axis, Bars, Chart as LayerChart, Svg } from "layerchart";
  import * as Accordion from "${ui}/accordion";
  import * as Chart from "${ui}/chart";
  import * as CodeBlock from "${ui}/code-block";
  import { CodeEditor, pythonSetup } from "${ui}/code-editor";
  import { loadLanguage } from "${alias}/code-languages";
  import { Meter } from "${ui}/meter";
  import * as Popover from "${ui}/popover";
  import * as ToggleGroup from "${ui}/toggle-group";

  let { data } = $props();
  const rows = [
    { day: "Mon", runs: 12 },
    { day: "Tue", runs: 18 },
    { day: "Wed", runs: 9 },
  ];
  const python = pythonSetup();
  const rust = loadLanguage("rust");
  const unknown = loadLanguage("cobol");
</script>

<CodeEditor value={"print(1)"} label="Python" extensions={python} />
{#await Promise.all([rust, unknown]) then [support, none]}
  <p>{support ? "rust loaded" : "no rust"} {none === null ? "unknown is null" : "unknown loaded"}</p>
{/await}

<CodeBlock.Root data-testid="prerendered">
  <CodeBlock.Content lines={data.lines ?? undefined} lineNumbers />
</CodeBlock.Root>

<CodeBlock.Root data-testid="live">
  <CodeBlock.Content code={"def parse(line: str) -> int:\\n    return len(line)\\n"} language="python" />
</CodeBlock.Root>

<Chart.Container label="Runs per day" config={{ runs: { label: "Runs" } }}>
  <LayerChart data={rows} x="day" y="runs">
    {#snippet children()}
      <Svg>
        <Axis placement="left" />
        <Axis placement="bottom" />
        <Bars class="fill-chart-1" />
      </Svg>
    {/snippet}
  </LayerChart>
  {#snippet table()}
    <table>
      <tbody>
        {#each rows as row (row.day)}
          <tr><th scope="row">{row.day}</th><td>{row.runs}</td></tr>
        {/each}
      </tbody>
    </table>
  {/snippet}
</Chart.Container>

<Popover.Root>
  <Popover.Trigger>Fuel</Popover.Trigger>
  <Popover.Content label="About fuel">A run may spend 30 billion instructions.</Popover.Content>
</Popover.Root>

<Accordion.Root type="single">
  <Accordion.Item value="one">
    <Accordion.Trigger>One</Accordion.Trigger>
    <Accordion.Content>First</Accordion.Content>
  </Accordion.Item>
</Accordion.Root>

<ToggleGroup.Root type="single" value="today">
  <ToggleGroup.Item value="today">Today</ToggleGroup.Item>
  <ToggleGroup.Item value="week">7 days</ToggleGroup.Item>
</ToggleGroup.Root>

<label for="fuel">Fuel</label>
<Meter id="fuel" value={4.81} max={30} valuetext="4.81 billion instructions of 30 billion" />
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

    // The built page in a browser: which WASM files does it fetch?
    const wasmRequests: string[] = [];
    if (build.code === 0) {
      const site = serveStatic(path.join(app, "build"));
      const browser = await chromium.launch();
      const page = await browser.newPage();
      page.on("request", (req) => {
        if (/\.wasm(\?|$)/.test(req.url()))
          wasmRequests.push(path.basename(new URL(req.url()).pathname));
      });
      await page.goto(`http://localhost:${site.port}/`);
      await page
        .locator('[data-testid="live"] [data-highlight="settled"]')
        .waitFor({ timeout: 30_000 });
      await page.waitForTimeout(500);
      await browser.close();
      site.stop(true);
    }
    r = {
      app,
      add: added,
      build,
      check,
      html,
      cssAfterFirst,
      theme,
      cssAfterSecond,
      wasmRequests,
    };
    if (fixture === "kit3") freshCss = cssAfterFirst;
  }, 290_000);

  test("1. add exits 0 under Bun", () => {
    if (r.add.code !== 0) console.error(r.add.output);
    expect(r.add.code).toBe(0);
    expect(r.add.output).toContain(
      "You are currently using an unsupported runtime",
    );
  });

  test("2. 77 files land, the highlighter's 29 at their targets", () => {
    expect(HIGHLIGHTER_FILES).toHaveLength(29);
    expect(FILES).toHaveLength(77);
    const missing = FILES.filter((f) => !existsSync(path.join(r.app, f)));
    expect(missing).toEqual([]);
  });

  test("3. no placeholder is left; imports use the app's alias; the hook and the library sit in their folders", () => {
    for (const file of FILES) {
      const text = readFileSync(path.join(r.app, file), "utf8");
      for (const placeholder of PLACEHOLDERS)
        expect(text).not.toContain(placeholder);
    }
    const content = readFileSync(
      path.join(
        r.app,
        "src/lib/components/ui/code-block/code-block-content.svelte",
      ),
      "utf8",
    );
    expect(content).toMatch(new RegExp(`from ["']\\${alias}/utils["']`));
    expect(content).toMatch(
      new RegExp(
        `from ["']\\${alias}/hooks/use-highlighted-code\\.svelte(\\.js)?["']`,
      ),
    );
    const hook = readFileSync(
      path.join(r.app, "src/lib/hooks/use-highlighted-code.svelte.ts"),
      "utf8",
    );
    expect(hook).toMatch(new RegExp(`from ["']\\${alias}/highlighter["']`));
  });

  test("4. package.json holds the highlighter's 21 names under dependencies, and the other packages at their ranges; no @lezer/highlight, codemirror or tailwind-merge named", () => {
    const pkg = JSON.parse(
      readFileSync(path.join(r.app, "package.json"), "utf8"),
    );
    expect(DEPENDENCIES).toHaveLength(21);
    for (const spec of DEPENDENCIES) {
      const at = spec.lastIndexOf("@");
      expect(pkg.dependencies?.[spec.slice(0, at)], spec).toBe(
        spec.slice(at + 1),
      );
      expect(pkg.devDependencies?.[spec.slice(0, at)], spec).toBeUndefined();
    }
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    for (const [name, range] of PACKAGES) expect(deps[name]).toBe(range);
    expect(deps["@lezer/highlight"]).toBeUndefined();
    expect(deps.codemirror).toBeUndefined();
    expect(deps["tailwind-merge"]).toBeUndefined();
  });

  test("5. with the registry stopped, the app's vite build passes with every item on a prerendered page, whose HTML holds role-class spans and the editor's fallback pre", () => {
    if (r.build.code !== 0) console.error(r.build.output);
    expect(r.build.code).toBe(0);
    expect(r.html).toMatch(/<span class="[^"]*text-code-[a-z-]+/);
    expect(r.html).toContain("text-code-keyword");
    expect(r.html).toContain('data-slot="code-editor-fallback"');
    expect(r.html).toContain('data-slot="chart"');
    expect(r.html).toContain('data-slot="meter"');
  });

  test("6. with the registry stopped, the app's svelte-check reports 0 errors", () => {
    const completed = /COMPLETED \d+ FILES (\d+) ERRORS (\d+) WARNINGS/.exec(
      r.check.output,
    );
    if (!completed || Number(completed[1]) !== 0) console.error(r.check.output);
    expect(completed).not.toBeNull();
    expect(Number(completed![1])).toBe(0);
  });

  test("7. our lint finds 0 violations in the 77 installed files", () => {
    expect(lintFiles(FILES, loadRules(REPO), r.app)).toEqual([]);
  });

  test("8. app.css holds --color-code-keyword: var(--code-keyword) once, and a second add pluto-theme leaves it byte-identical", () => {
    const occurrences =
      r.cssAfterFirst.split("--color-code-keyword: var(--code-keyword)")
        .length - 1;
    expect(occurrences).toBe(1);
    if (r.theme.code !== 0) console.error(r.theme.output);
    expect(r.theme.code).toBe(0);
    expect(r.cssAfterSecond).toBe(r.cssAfterFirst);
  });

  // 007 decision 10: the surface's rules, the dark block's roles and the
  // by-product; 013 decision 12: 16 roles.
  test("9. app.css holds .surface-ink { and .dark .surface-ink { once each, .surface-ink { after .dark {, 16 --code- lines in :root and .dark on the syntax grounds, and 16 derived @theme inline lines", () => {
    const css = r.cssAfterFirst;
    const preludes = blocks(css).map((b) => b.prelude);
    expect(preludes.filter((p) => p === ".surface-ink")).toHaveLength(1);
    expect(preludes.filter((p) => p === ".dark .surface-ink")).toHaveLength(1);
    expect(preludes.filter((p) => p === ".dark")).toHaveLength(1);
    expect(preludes.indexOf(".dark")).toBeLessThan(
      preludes.indexOf(".surface-ink"),
    );
    for (const block of [":root", ".dark"]) {
      const vars = topLevelMap(css, block);
      expect(
        [...vars.keys()].filter((k) => k.startsWith("--code-")),
        block,
      ).toHaveLength(16);
      expect(vars.get("--code-text"), block).toBe("var(--syntax-ink)");
      expect(vars.get("--code-background"), block).toBe("var(--syntax-ground)");
      expect(vars.get("--code-active-line"), block).toBe(
        "var(--syntax-active-line)",
      );
    }
    const surface = topLevelMap(css, ".surface-ink");
    expect(surface.get("--code-background")).toBe("var(--background)");
    expect(surface.get("--code-active-line")).toBe("var(--muted)");
    expect(topLevelMap(css, ".dark .surface-ink").get("--background")).toBe(
      "var(--card)",
    );
    const inline = topLevelMap(css, "@theme inline");
    const derived = [...inline.entries()].filter(([name]) =>
      name.startsWith("--code-"),
    );
    expect(derived).toHaveLength(16);
    for (const [name, value] of derived) expect(value).toBe(`var(${name})`);
  });

  test("9b. the app's built CSS holds .scrollbar-code and the inline-code chip on the code ground; its code-block.svelte holds border-border", () => {
    const assets = path.join(r.app, "build", "_app", "immutable", "assets");
    const css = readdirSync(assets)
      .filter((f) => f.endsWith(".css"))
      .map((f) => readFileSync(path.join(assets, f), "utf8"))
      .join("\n");
    expect(css).toContain(".scrollbar-code");
    const flat = css.replace(/,\s+/g, ",");
    const chip = "code:not(pre code,:is(h1,h2,h3,h4,h5,h6) code){";
    const at = flat.indexOf(chip);
    expect(at, "the chip rule").toBeGreaterThan(-1);
    const body = flat.slice(at + chip.length, flat.indexOf("}", at));
    expect(body).toMatch(/background-color:\s*var\(--code-background\)/);
    const block = readFileSync(
      path.join(r.app, "src/lib/components/ui/code-block/code-block.svelte"),
      "utf8",
    );
    expect(block).toContain("border-border");
  });

  test("10. bun.lock resolves @lezer/highlight once, and the installed code-languages.ts imports the editor's highlighting through the app's alias", () => {
    const lock = readFileSync(path.join(r.app, "bun.lock"), "utf8");
    const entries =
      lock.match(/^\s+"@lezer\/highlight(?:@[^"]*)?": \[/gm) ?? [];
    expect(entries).toHaveLength(1);
    const languages = readFileSync(
      path.join(r.app, "src/lib/code-languages.ts"),
      "utf8",
    );
    expect(languages).toMatch(
      new RegExp(
        `from ["']\\${alias}/components/ui/code-editor/code-editor-highlighting(\\.js)?["']`,
      ),
    );
    expect(languages).toContain('import("@replit/codemirror-lang-svelte")');
  });

  test("11. the client build holds 21 .wasm files: 20 grammars and the runtime", () => {
    const assets = path.join(r.app, "build", "_app", "immutable", "assets");
    const wasm = readdirSync(assets).filter((f) => f.endsWith(".wasm"));
    expect(wasm).toHaveLength(21);
    expect(wasm.filter((f) => f.startsWith("web-tree-sitter"))).toHaveLength(1);
  });

  test("12. the built page requests 2 .wasm files: the runtime and Python's grammar", () => {
    expect(
      r.wasmRequests.map((f) => f.replace(/\.[^.]+\.wasm$/, "")).sort(),
    ).toEqual(["tree-sitter-python", "web-tree-sitter"]);
  });
});

/**
 * 013 decision 21: the upgrade case. An app installs the theme and the code
 * items from v0.11.0, then the five code items from v0.12.0; its app.css then
 * holds exactly the old lines the changelog tells it to delete.
 */
describe("the upgrade from v0.11.0", () => {
  let stale: Record<string, string[]>;
  let added: Result;

  beforeAll(async () => {
    const app = await prepare("kit3", "upgrade");
    await startRegistry();
    const old = await add(
      app,
      `http://localhost:${port}/v0.11.0/r`,
      "pluto-theme",
      "code-block",
      "code-editor",
    );
    if (old.code !== 0) throw new Error(`v0.11.0 add failed:\n${old.output}`);
    added = await add(
      app,
      REGISTRY,
      "pluto-theme",
      "highlighter",
      "use-highlighted-code",
      "code-block",
      "code-editor",
    );
    await stopRegistry();
    const css = readFileSync(path.join(app, "src", "app.css"), "utf8");
    stale = {};
    for (const block of [":root", ".dark", "@theme inline"]) {
      const fresh = topLevelMap(freshCss, block);
      stale[block] = [...topLevelMap(css, block).keys()]
        .filter((name) => !fresh.has(name))
        .sort();
    }
  }, 290_000);

  const REMOVED_CODE = [
    "--code-foreground",
    "--code-escape",
    "--code-builtin",
    "--code-tag",
    "--code-property",
    "--code-decorator",
    "--code-self",
    "--code-invalid",
  ];
  const REMOVED = [
    ...REMOVED_CODE,
    "--syntax-amber",
    "--syntax-purple",
    "--syntax-teal",
    "--syntax-cyan",
  ];

  test("the v0.12.0 add exits 0, and a fresh install's stylesheet is the reference", () => {
    if (added.code !== 0) console.error(added.output);
    expect(added.code).toBe(0);
    expect(freshCss).toContain("--code-text");
  });

  test("app.css holds exactly the changelog's listed old lines, no more and no fewer", () => {
    const changelog = readFileSync(path.join(REPO, "CHANGELOG.md"), "utf8");
    for (const name of REMOVED) expect(changelog).toContain(`\`${name}\``);
    expect(stale[":root"]).toEqual([...REMOVED].sort());
    expect(stale[".dark"]).toEqual([...REMOVED].sort());
    expect(stale["@theme inline"]).toEqual(
      [
        ...REMOVED.map((n) => n.replace(/^--/, "--color-")),
        ...REMOVED_CODE,
      ].sort(),
    );
  });
});

/**
 * 013 decision 21: request time, in production. The kit3 fixture on
 * adapter-node, with its own bun.lock; one route renders per request and
 * highlights in its load. Built, reinstalled with --production, served.
 */
describe("request time, in production (kit3-node)", () => {
  let app: string;
  let first: { status: number; html: string; warnings: string[] };
  let control: { status: number; html: string; warnings: string[] };
  let build: Result;

  /** Serves the built app, fetches the live route, and reads its log. */
  async function serve() {
    const appPort = freePort();
    const child = Bun.spawn([process.execPath, "build/index.js"], {
      cwd: app,
      env: { ...process.env, PORT: String(appPort), HOST: "127.0.0.1" },
      stdout: "pipe",
      stderr: "pipe",
    });
    const url = `http://127.0.0.1:${appPort}/live`;
    let response: Response | undefined;
    for (let i = 0; i < 100 && !response; i++) {
      response = await fetch(url).catch(() => undefined);
      if (!response) await Bun.sleep(100);
    }
    const html = response ? await response.text() : "";
    await Bun.sleep(200);
    child.kill();
    const [out, err] = await Promise.all([
      new Response(child.stdout).text(),
      new Response(child.stderr).text(),
    ]);
    const warnings = `${out}\n${err}`
      .split("\n")
      .filter((l) => l.includes("highlighter:"));
    return { status: response?.status ?? 0, html, warnings };
  }

  beforeAll(async () => {
    app = await prepare("kit3-node");
    await startRegistry();
    const added = await add(app, REGISTRY, "code-block");
    if (added.code !== 0) throw new Error(`add failed:\n${added.output}`);
    await stopRegistry();
    const install = await run([process.execPath, "install"], app);
    if (install.code !== 0)
      throw new Error(`bun install failed:\n${install.output}`);
    const live = path.join(app, "src", "routes", "live");
    mkdirSync(live, { recursive: true });
    writeFileSync(
      path.join(live, "+page.server.ts"),
      `import { highlightCode } from "#lib/highlighter";

export const prerender = false;

export const load = async () => ({
  lines: await highlightCode("def parse(line: str) -> Body | None:\\n    return None\\n", "python"),
});
`,
    );
    writeFileSync(
      path.join(live, "+page.svelte"),
      `<script lang="ts">
  import * as CodeBlock from "#lib/components/ui/code-block";
  let { data } = $props();
</script>

<CodeBlock.Root>
  <CodeBlock.Content lines={data.lines ?? undefined} />
</CodeBlock.Root>
`,
    );
    build = await run(bin(app, "vite", "build"), app);
    // A production-only install: devDependencies go.
    rmSync(path.join(app, "node_modules"), { recursive: true, force: true });
    const production = await run(
      [process.execPath, "install", "--production"],
      app,
    );
    if (production.code !== 0)
      throw new Error(`bun install --production failed:\n${production.output}`);
    first = await serve();
    rmSync(path.join(app, "node_modules", "tree-sitter-python"), {
      recursive: true,
      force: true,
    });
    control = await serve();
  }, 290_000);

  test("the build passes", () => {
    if (build.code !== 0) console.error(build.output);
    expect(build.code).toBe(0);
  });

  test("after bun install --production, a request-time load gives tree-sitter's Body as type, with 0 warnings", () => {
    expect(first.status).toBe(200);
    expect(first.html).toMatch(/<span class="text-code-type">Body<\/span>/);
    expect(first.warnings).toEqual([]);
  });

  test("with Python's package deleted, the response is 200, Body is no longer type (Shiki), and the server logs exactly 1 warning", () => {
    expect(control.status).toBe(200);
    expect(control.html).toContain("Body");
    expect(control.html).not.toMatch(
      /<span class="text-code-type">Body<\/span>/,
    );
    expect(control.warnings).toHaveLength(1);
    expect(control.warnings[0]).toContain("python");
  });
});
