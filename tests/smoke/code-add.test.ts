/**
 * 004 decision 17, smoke: `add code-editor code-block chart popover accordion
 * toggle-group meter code-languages` into each of 001's two scratch apps,
 * against this repository's `vite dev`, with the locked CLI under Bun.
 * Together the eight pull use-highlighted-code, highlighter, status, button,
 * spinner, toggle, utils and pluto-theme, all 9 packages of decision 2 and
 * the 2 of 007 decision 7. Then the app's prerendered build, its
 * svelte-check, our lint, the theme's by-product (decision 5), and 007
 * decision 10's checks: one `@lezer/highlight` in the lock, the surface's two
 * rules in order, 21 `.dark` lines, 21 by-product lines, and a second
 * `add pluto-theme` that leaves app.css byte-identical.
 */
import { afterAll, beforeAll, describe, expect, test } from "bun:test";
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

/** The 48 files: each item's files from our registry, plus the hook, the two libraries and utils. */
const EXPECTED: [item: string, count: number][] = [
  ["code-editor", 4],
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
const registry = JSON.parse(
  readFileSync(path.join(REPO, "registry.json"), "utf8"),
);
const FILES: string[] = [
  ...EXPECTED.flatMap(([name]) =>
    registry.items
      .find((i: { name: string }) => i.name === name)
      .files.map(
        (f: { path: string }) =>
          `src/lib/components/ui/${name}/${path.basename(f.path)}`,
      ),
  ),
  "src/lib/hooks/use-highlighted-code.svelte.ts",
  "src/lib/highlighter.ts",
  "src/lib/code-languages.ts",
  "src/lib/utils.ts",
];

/** 004 decision 2's 9 packages at their ranges, 002's 4, and 007 decision 7's 2. */
const PACKAGES: [string, string][] = [
  ["shiki", "^4.5.0"],
  ["@codemirror/state", "^6.7.6"],
  ["@codemirror/view", "^6.43.15"],
  ["@codemirror/language", "^6.13.1"],
  ["@codemirror/commands", "^6.11.1"],
  ["@codemirror/autocomplete", "^6.20.4"],
  ["@codemirror/lang-python", "^6.2.1"],
  ["@lezer/highlight", "^1.2.5"],
  ["layerchart", "^2.9.2"],
  ["bits-ui", "^2.20.2"],
  ["@internationalized/date", "^3.12.4"],
  ["tailwind-variants", "^3.3.1"],
  ["phosphor-svelte", "^3.1.1"],
  ["@codemirror/language-data", "^6.5.2"],
  ["@replit/codemirror-lang-svelte", "^6.0.0"],
];

type Run = {
  app: string;
  add: Result;
  build: Result;
  check: Result;
  html: string;
  cssAfterFirst: string;
  theme: Result;
  cssAfterSecond: string;
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
      bin(
        REPO,
        "shadcn-svelte",
        "add",
        "code-editor",
        "code-block",
        "chart",
        "popover",
        "accordion",
        "toggle-group",
        "meter",
        "code-languages",
        "-y",
        "-o",
      ),
      app,
      { REGISTRY_URL: `http://localhost:${port}/r` },
    );
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
  const unknown = loadLanguage("brainfuck");
</script>

<CodeEditor value={"print(1)"} label="Python" extensions={python} />
{#await Promise.all([rust, unknown]) then [support, none]}
  <p>{support ? "rust loaded" : "no rust"} {none === null ? "unknown is null" : "unknown loaded"}</p>
{/await}

<CodeBlock.Root>
  <CodeBlock.Content lines={data.lines ?? undefined} lineNumbers />
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
    const css = () => readFileSync(path.join(app, "src", "app.css"), "utf8");
    const cssAfterFirst = css();
    const theme = await run(
      bin(REPO, "shadcn-svelte", "add", "pluto-theme", "-y", "-o"),
      app,
      { REGISTRY_URL: `http://localhost:${port}/r` },
    );
    r = {
      app,
      add,
      build,
      check,
      html,
      cssAfterFirst,
      theme,
      cssAfterSecond: css(),
    };
  }, 290_000);

  test("1. add exits 0 under Bun", () => {
    if (r.add.code !== 0) console.error(r.add.output);
    expect(r.add.code).toBe(0);
    expect(r.add.output).toContain(
      "You are currently using an unsupported runtime",
    );
  });

  test("2. 48 files land", () => {
    expect(FILES).toHaveLength(48);
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

  test("4. package.json names the 9 packages of decision 2, 002's 4 and 007's 2 at their ranges; no codemirror, no tailwind-merge", () => {
    const pkg = JSON.parse(
      readFileSync(path.join(r.app, "package.json"), "utf8"),
    );
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    for (const [name, range] of PACKAGES) expect(deps[name]).toBe(range);
    expect(deps.codemirror).toBeUndefined();
    expect(deps["tailwind-merge"]).toBeUndefined();
  });

  test("5. the app's vite build passes with every item on a prerendered page, whose HTML holds text-code- spans and the editor's fallback pre", () => {
    if (r.build.code !== 0) console.error(r.build.output);
    expect(r.build.code).toBe(0);
    expect(r.html).toMatch(/<span class="[^"]*text-code-[a-z-]+/);
    expect(r.html).toContain('data-slot="code-editor-fallback"');
    expect(r.html).toContain('data-slot="chart"');
    expect(r.html).toContain('data-slot="meter"');
  });

  test("6. the app's svelte-check reports 0 errors", () => {
    const completed = /COMPLETED \d+ FILES (\d+) ERRORS (\d+) WARNINGS/.exec(
      r.check.output,
    );
    if (!completed || Number(completed[1]) !== 0) console.error(r.check.output);
    expect(completed).not.toBeNull();
    expect(Number(completed![1])).toBe(0);
  });

  test("7. our lint finds 0 violations in the 48 installed files", () => {
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

  // 007 decision 10: the surface's rules, the dark block's slots, the
  // by-product and one @lezer/highlight.
  test("9. app.css holds .surface-ink { and .dark .surface-ink { once each, .surface-ink { after .dark {, 21 --code- lines in .dark and 21 derived @theme inline lines", () => {
    const css = r.cssAfterFirst;
    // By block, not by line: the CLI indents a plain rule it appends.
    const preludes = blocks(css).map((b) => b.prelude);
    expect(preludes.filter((p) => p === ".surface-ink")).toHaveLength(1);
    expect(preludes.filter((p) => p === ".dark .surface-ink")).toHaveLength(1);
    expect(preludes.filter((p) => p === ".dark")).toHaveLength(1);
    expect(preludes.indexOf(".dark")).toBeLessThan(
      preludes.indexOf(".surface-ink"),
    );
    const dark = topLevelMap(css, ".dark");
    expect(
      [...dark.keys()].filter((k) => k.startsWith("--code-")),
    ).toHaveLength(21);
    expect(dark.get("--code-background")).toBe("var(--muted)");
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
    expect(derived).toHaveLength(21);
    for (const [name, value] of derived) expect(value).toBe(`var(${name})`);
  });

  // The page's {#await} over loadLanguage is pending at prerender, so the
  // build (test 5) and svelte-check (test 6) are what prove the item resolves.
  test("10. bun.lock resolves @lezer/highlight once, and the installed code-languages.ts imports the configured Python through the app's alias", () => {
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
        `from ["']\\${alias}/components/ui/code-editor/code-editor-python(\\.js)?["']`,
      ),
    );
    expect(languages).toContain('import("@replit/codemirror-lang-svelte")');
  });
});
