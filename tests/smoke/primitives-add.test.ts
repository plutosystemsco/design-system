/**
 * 002 decision 23, smoke: `add field alert-dialog input-otp tabs` into each of
 * 001's two scratch apps, against this repository's `vite dev`, with the
 * locked CLI under Bun. Together the four pull label, separator, button,
 * spinner, utils, pluto-theme and the fonts, and all four of decision 2's
 * packages.
 */
import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import {
  cpSync,
  existsSync,
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
const scratch = mkdtempSync(path.join(tmpdir(), "pluto-smoke-primitives-"));
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

/** The 44 files: each item's files from our registry, plus utils. */
const EXPECTED: [item: string, count: number][] = [
  ["field", 12],
  ["label", 2],
  ["separator", 2],
  ["alert-dialog", 13],
  ["button", 2],
  ["spinner", 2],
  ["input-otp", 5],
  ["tabs", 5],
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
  "src/lib/utils.ts",
];

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

    // -o is right here: the scratch app has nothing to protect.
    const add = await run(
      bin(
        REPO,
        "shadcn-svelte",
        "add",
        "field",
        "alert-dialog",
        "input-otp",
        "tabs",
        "-y",
        "-o",
      ),
      app,
      { REGISTRY_URL: `http://localhost:${port}/r` },
    );

    const ui = `${alias}/components/ui`;
    writeFileSync(
      path.join(app, "src", "routes", "+page.svelte"),
      `<script lang="ts">
  import * as AlertDialog from "${ui}/alert-dialog";
  import * as Field from "${ui}/field";
  import * as InputOTP from "${ui}/input-otp";
  import * as Tabs from "${ui}/tabs";
</script>

<Field.Field error="That code has expired.">
  <Field.Label>Verification code</Field.Label>
  <InputOTP.Root>
    {#snippet children({ cells })}
      <InputOTP.Group>
        {#each cells as cell, i (i)}
          <InputOTP.Slot {cell} />
        {/each}
      </InputOTP.Group>
    {/snippet}
  </InputOTP.Root>
</Field.Field>

<Tabs.Root value="one">
  <Tabs.List>
    <Tabs.Trigger value="one">One</Tabs.Trigger>
    <Tabs.Trigger value="two">Two</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="one">First</Tabs.Content>
  <Tabs.Content value="two">Second</Tabs.Content>
</Tabs.Root>

<AlertDialog.Root>
  <AlertDialog.Trigger>Delete</AlertDialog.Trigger>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Delete it?</AlertDialog.Title>
      <AlertDialog.Description>This cannot be undone.</AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action variant="destructive">Delete</AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
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
    r = { app, add, build, check };
  }, 280_000);

  test("1. add exits 0 under Bun", () => {
    if (r.add.code !== 0) console.error(r.add.output);
    expect(r.add.code).toBe(0);
    expect(r.add.output).toContain(
      "You are currently using an unsupported runtime",
    );
  });

  test("2. 44 files land", () => {
    expect(FILES).toHaveLength(44);
    const missing = FILES.filter((f) => !existsSync(path.join(r.app, f)));
    expect(missing).toEqual([]);
  });

  test("3. no placeholder is left, and imports use the app's alias", () => {
    for (const file of FILES) {
      const text = readFileSync(path.join(r.app, file), "utf8");
      for (const placeholder of PLACEHOLDERS)
        expect(text).not.toContain(placeholder);
    }
    const button = readFileSync(
      path.join(r.app, "src/lib/components/ui/button/button.svelte"),
      "utf8",
    );
    expect(button).toMatch(new RegExp(`from ["']\\${alias}/utils["']`));
    expect(button).toMatch(
      new RegExp(`from ["']\\${alias}/components/ui/spinner["']`),
    );
  });

  test("4. package.json names decision 2's 4 packages, and no tailwind-merge", () => {
    const pkg = JSON.parse(
      readFileSync(path.join(r.app, "package.json"), "utf8"),
    );
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    for (const [name, range] of PACKAGES) expect(deps[name]).toBe(range);
    expect(deps["tailwind-merge"]).toBeUndefined();
  });

  test("5. the app's vite build passes with Field, InputOTP, Tabs and AlertDialog on a prerendered page", () => {
    if (r.build.code !== 0) console.error(r.build.output);
    expect(r.build.code).toBe(0);
  });

  test("6. the app's svelte-check reports 0 errors", () => {
    const completed = /COMPLETED \d+ FILES (\d+) ERRORS (\d+) WARNINGS/.exec(
      r.check.output,
    );
    if (!completed || Number(completed[1]) !== 0) console.error(r.check.output);
    expect(completed).not.toBeNull();
    expect(Number(completed![1])).toBe(0);
  });

  test("7. our lint finds 0 violations in the 44 installed files", () => {
    expect(lintFiles(FILES, loadRules(REPO), r.app)).toEqual([]);
  });
});
