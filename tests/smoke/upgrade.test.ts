/**
 * 020 tests 11 to 13: the upgrade from v0.11.0, as the guide says, against
 * this repository's `vite dev`, with the locked CLI under Bun. Test 11 proves
 * the guide's order (decision 6): an app that renames its own keyframe uses
 * first keeps its animation, and an app that skips that step loses it
 * silently. Test 12 is a guard: one control updated alone still finds an old
 * field. Test 13: the alias installs the theme.
 */
import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import {
  cpSync,
  existsSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { blocks, declarations } from "../helpers/css.ts";
import {
  bin,
  freePort,
  run,
  startDevServer,
  waitFor200,
  type Result,
} from "./process.ts";

const REPO = process.cwd();
const scratch = mkdtempSync(path.join(tmpdir(), "kuiper-smoke-upgrade-"));
const port = freePort();
let server: ReturnType<typeof startDevServer> | undefined;
const OLD_R = () => `http://localhost:${port}/v0.11.0/r`;
const NEW_R = () => `http://localhost:${port}/r`;
const SET = ["theme", "field", "input", "button", "four-dot"];
const OLD_FRAMES = [
  "pluto-enter",
  "pluto-exit",
  "pluto-mark-dock",
  "pluto-mark-fade",
];

beforeAll(async () => {
  server = startDevServer(REPO, port, path.join(scratch, "vite-dev.log"));
  await waitFor200(`${NEW_R()}/styles/maia/index.json`, 60_000, server);
}, 70_000);

afterAll(async () => {
  server?.kill();
  await server?.exited;
  rmSync(scratch, { recursive: true, force: true });
});

/** A fresh copy of the SvelteKit 3 scratch app, installed and synced. */
async function freshApp(name: string): Promise<string> {
  const app = path.join(scratch, name);
  cpSync(path.join(REPO, "tests", "smoke", "fixtures", "kit3"), app, {
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

const add = (app: string, registry: string, names: string[]) =>
  run(bin(REPO, "shadcn-svelte", "add", ...names, "-y", "-o"), app, {
    REGISTRY_URL: registry,
  });

const appCss = (app: string) =>
  readFileSync(path.join(app, "src", "app.css"), "utf8");

/** Every CSS file the build wrote, joined. */
function builtCss(app: string): string {
  const out: string[] = [];
  const walk = (dir: string) => {
    if (!existsSync(dir)) return;
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith(".css")) out.push(readFileSync(p, "utf8"));
    }
  };
  walk(path.join(app, "build"));
  return out.join("\n");
}

/** Removes each `@keyframes <name> { … }` rule whose name starts with `prefix`. */
function deleteKeyframes(css: string, prefix: string): string {
  let out = css;
  for (;;) {
    const at = out.search(new RegExp(`[ \\t]*@keyframes ${prefix}[\\w-]* \\{`));
    if (at === -1) return out;
    let depth = 0;
    let end = out.indexOf("{", at);
    for (; end < out.length; end++) {
      if (out[end] === "{") depth++;
      else if (out[end] === "}" && --depth === 0) break;
    }
    out = out.slice(0, at) + out.slice(end + 1).replace(/^\n/, "");
  }
}

/** The custom property names of a top-level block. */
const varNames = (css: string, prelude: string) =>
  [
    ...declarations(
      blocks(css).find((b) => b.prelude === prelude)?.body ?? "",
    ).keys(),
  ].sort();

/** The scratch page: the theme's own animation and a component's own use of an old name. */
function writePage(app: string, frame: string) {
  writeFileSync(
    path.join(app, "src", "lib", "Fade.svelte"),
    `<div class="fade">Fades in.</div>\n\n<style>\n  .fade {\n    animation-name: ${frame};\n    animation-duration: 1s;\n  }\n</style>\n`,
  );
  writeFileSync(
    path.join(app, "src", "routes", "+page.svelte"),
    `<script lang="ts">
  import Fade from "#lib/Fade.svelte";
  import { Button } from "#lib/components/ui/button";
  import * as Field from "#lib/components/ui/field";
  import { Lockup } from "#lib/components/ui/four-dot";
  import { Input } from "#lib/components/ui/input";
</script>

<h1><Lockup /></h1>
<div class="animate-enter">Enters.</div>
<Fade />
<Field.Field>
  <Field.Label>Name</Field.Label>
  <Input />
</Field.Field>
<Button>Save</Button>
`,
  );
}

type Upgraded = {
  before: { css: string; build: Result; built: string };
  add: Result;
  build: Result;
  check: Result;
  css: string;
  built: string;
};

/** A v0.11.0 app, built, then updated by `steps`, then built again. */
async function upgrade(
  name: string,
  steps: (app: string) => Promise<Result>,
): Promise<Upgraded> {
  const app = await freshApp(name);
  const old = await add(app, OLD_R(), ["pluto-theme", ...SET]);
  if (old.code !== 0) throw new Error(`v0.11.0 add failed:\n${old.output}`);
  writePage(app, "pluto-enter");
  const firstBuild = await run(bin(app, "vite", "build"), app);
  const before = {
    css: appCss(app),
    build: firstBuild,
    built: builtCss(app),
  };
  const updated = await steps(app);
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
  return {
    before,
    add: updated,
    build,
    check,
    css: appCss(app),
    built: builtCss(app),
  };
}

describe("020 test 11: the upgrade from v0.11.0, as the guide says", () => {
  let follows: Upgraded;
  let skips: Upgraded;

  beforeAll(async () => {
    [follows, skips] = await Promise.all([
      upgrade("follows", async (app) => {
        // Step 1: rename the app's own uses first.
        writePage(app, "kuiper-enter");
        // Step 2: update the theme and the parts.
        const r = await add(app, NEW_R(), ["kuiper-theme", ...SET]);
        // Step 4: delete the four dead rules.
        writeFileSync(
          path.join(app, "src", "app.css"),
          deleteKeyframes(appCss(app), "pluto-"),
        );
        return r;
      }),
      upgrade("skips", (app) => add(app, NEW_R(), ["kuiper-theme", ...SET])),
    ]);
  }, 290_000);

  test("both v0.11.0 apps build, and their built CSS holds @keyframes pluto-enter", () => {
    for (const r of [follows, skips]) {
      expect(r.before.build.code, r.before.build.output).toBe(0);
      expect(r.before.built).toMatch(/@keyframes\s*pluto-enter\b/);
    }
  });

  test("the app that follows the guide: the add exits 0, svelte-check reports 0 errors, and it builds", () => {
    expect(follows.add.code, follows.add.output).toBe(0);
    const completed = /COMPLETED \d+ FILES (\d+) ERRORS/.exec(
      follows.check.output,
    );
    expect(completed?.[1], follows.check.output).toBe("0");
    expect(follows.build.code, follows.build.output).toBe(0);
  });

  test("its built CSS holds kuiper-enter and kuiper-mark-dock, its component names kuiper-enter, and no pluto- keyframe is left", () => {
    expect(follows.built).toMatch(/@keyframes\s*kuiper-enter\b/);
    expect(follows.built).toMatch(/@keyframes\s*kuiper-mark-dock\b/);
    expect(follows.built).toMatch(/animation-name:\s*kuiper-enter\b/);
    expect(follows.built).not.toMatch(/@keyframes\s*pluto-/);
  });

  test("its app.css holds each @keyframes kuiper- once, names kuiper-enter in --animate-enter, and keeps every :root and .dark variable", () => {
    for (const frame of OLD_FRAMES.map((f) => f.replace("pluto-", "kuiper-")))
      expect(
        follows.css.match(new RegExp(`@keyframes ${frame} \\{`, "g")),
        frame,
      ).toHaveLength(1);
    expect(follows.css).not.toMatch(/@keyframes pluto-/);
    expect(follows.css).toMatch(/--animate-enter:\s*kuiper-enter\b/);
    for (const block of [":root", ".dark"]) {
      const after = new Set(varNames(follows.css, block));
      expect(
        varNames(follows.before.css, block).filter((n) => !after.has(n)),
        block,
      ).toEqual([]);
    }
  });

  test("the app that skips step 1: the add exits 0 and it builds, but its own pluto-enter has left the built CSS, silently", () => {
    expect(skips.add.code, skips.add.output).toBe(0);
    expect(skips.build.code, skips.build.output).toBe(0);
    for (const frame of OLD_FRAMES)
      expect(skips.css, frame).toContain(`@keyframes ${frame} {`);
    expect(skips.built).not.toMatch(/@keyframes\s*pluto-enter\b/);
    expect(skips.built).toMatch(/animation-name:\s*pluto-enter\b/);
  });
});

describe("020 test 12: one control at a time", () => {
  let r: { add: Result; build: Result; html: string };

  beforeAll(async () => {
    const app = await freshApp("one-control");
    const old = await add(app, OLD_R(), ["pluto-theme", ...SET]);
    if (old.code !== 0) throw new Error(`v0.11.0 add failed:\n${old.output}`);
    writePage(app, "pluto-enter");
    const updated = await add(app, NEW_R(), ["input"]);
    const build = await run(bin(app, "vite", "build"), app);
    const index = path.join(app, "build", "index.html");
    r = {
      add: updated,
      build,
      html: existsSync(index) ? readFileSync(index, "utf8") : "",
    };
  }, 200_000);

  test("only add input from /r: the app builds, and the old field's label names the new input", () => {
    expect(r.add.code, r.add.output).toBe(0);
    expect(r.build.code, r.build.output).toBe(0);
    // An attribute's value may hold ">" (a class such as has-[>…]), and the
    // server render puts hydration markers inside the label.
    const attrs = `(?:[^>"]|"[^"]*")*`;
    const label = new RegExp(
      `<label${attrs}\\sfor="([^"]+)"${attrs}>(?:\\s|<!--[^>]*-->)*Name`,
    ).exec(r.html)?.[1];
    expect(label, r.html.slice(0, 4000)).toBeTruthy();
    expect(r.html).toMatch(new RegExp(`<input${attrs}\\sid="${label}"`));
  });
});

describe("020 test 13: the alias installs the theme", () => {
  let viaAlias: { add: Result; css: string };
  let direct: { add: Result; css: string };

  beforeAll(async () => {
    const [a, b] = await Promise.all([freshApp("alias"), freshApp("direct")]);
    const [ra, rb] = await Promise.all([
      add(a, NEW_R(), ["pluto-theme"]),
      add(b, NEW_R(), ["kuiper-theme"]),
    ]);
    viaAlias = { add: ra, css: appCss(a) };
    direct = { add: rb, css: appCss(b) };
  }, 200_000);

  test("add pluto-theme exits 0, and app.css is byte-identical to add kuiper-theme's", () => {
    expect(viaAlias.add.code, viaAlias.add.output).toBe(0);
    expect(direct.add.code, direct.add.output).toBe(0);
    expect(viaAlias.css).toBe(direct.css);
    expect(viaAlias.css).toContain("@keyframes kuiper-enter");
  });
});
