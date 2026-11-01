/**
 * The real `add` into two scratch apps (decision 25): app A on SvelteKit 3
 * with `#lib`, app B on SvelteKit 2 with `$lib`. The CLI is this repository's
 * locked install, run under Bun, against this repository's `vite dev`.
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
import {
  childPreludes,
  blocks,
  declarations,
  topLevelMap,
} from "../helpers/css.ts";
import { readTokens } from "../../scripts/tokens.ts";
import {
  bin,
  freePort,
  run,
  startDevServer,
  waitFor200,
  type Result,
} from "./process.ts";

const REPO = process.cwd();
const scratch = mkdtempSync(path.join(tmpdir(), "pluto-smoke-"));
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
const FILES = [
  "src/lib/components/ui/four-dot/four-dot.svelte",
  "src/lib/components/ui/four-dot/lockup.svelte",
  "src/lib/components/ui/four-dot/index.ts",
  "src/lib/utils.ts",
];
const FONT_PACKAGES = [
  "@fontsource-variable/geist",
  "@fontsource-variable/ibm-plex-sans",
  "@fontsource-variable/jetbrains-mono",
];
const COLOURS = Object.keys(readTokens().themes.light).map(
  (name) => `--${name}`,
);

type Run = {
  app: string;
  first: Result;
  cssAfterFirst: string;
  second: Result;
  cssAfterSecond: string;
  build: Result;
  check: Result;
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

    const add = () =>
      run(bin(REPO, "shadcn-svelte", "add", "four-dot", "-y", "-o"), app, {
        REGISTRY_URL: `http://localhost:${port}/r`,
      });
    const css = () => readFileSync(path.join(app, "src", "app.css"), "utf8");

    const first = await add();
    const cssAfterFirst = css();
    const second = await add();
    const cssAfterSecond = css();

    writeFileSync(
      path.join(app, "src", "routes", "+page.svelte"),
      `<script lang="ts">\n  import { FourDot, Lockup } from "${alias}/components/ui/four-dot";\n</script>\n\n<h1><Lockup /></h1>\n<FourDot label="Pluto Systems" />\n`,
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
    r = { app, first, cssAfterFirst, second, cssAfterSecond, build, check };
  }, 280_000);

  test("1. the first add exits 0 under Bun", () => {
    expect(r.first.code).toBe(0);
    expect(r.first.output).toContain(
      "You are currently using an unsupported runtime",
    );
  });

  test("2. 4 files land", () => {
    for (const file of FILES)
      expect(existsSync(path.join(r.app, file))).toBe(true);
  });

  test("3. no placeholder is left, and imports use the app's alias", () => {
    for (const file of FILES) {
      const text = readFileSync(path.join(r.app, file), "utf8");
      for (const placeholder of PLACEHOLDERS)
        expect(text).not.toContain(placeholder);
    }
    for (const file of FILES.slice(0, 2)) {
      const text = readFileSync(path.join(r.app, file), "utf8");
      expect(text).toMatch(new RegExp(`from ["']\\${alias}/utils["']`));
    }
  });

  // 004 decision 5's by-product: the CLI's theme updater derives an inline
  // theme variable from every cssVars.light key, so the app's @theme inline
  // gains twelve lines `--code-<slot>: var(--code-<slot>)` beside our
  // `--color-code-<slot>`. They are harmless (the unlayered :root wins, and
  // `--code-` is no Tailwind namespace) and expected: exactly those twelve,
  // and nothing else beyond our own block.
  test("4. :root, .dark and @theme inline equal our src/app.css, but for the 12 derived code lines", () => {
    const ours = readFileSync(path.join(REPO, "src", "app.css"), "utf8");
    let equal = 0;
    for (const prelude of [":root", ".dark", "@theme inline"]) {
      const theirs = Object.fromEntries(topLevelMap(r.cssAfterFirst, prelude));
      if (prelude === "@theme inline") {
        const derived = Object.entries(theirs).filter(([name]) =>
          name.startsWith("--code-"),
        );
        expect(derived).toHaveLength(12);
        for (const [name, value] of derived) expect(value).toBe(`var(${name})`);
        for (const [name] of derived) delete theirs[name];
      }
      expect(theirs).toEqual(Object.fromEntries(topLevelMap(ours, prelude)));
      equal++;
    }
    expect(equal).toBe(3);
  });

  test("5. the font imports and base rules", () => {
    for (const pkg of FONT_PACKAGES)
      expect(r.cssAfterFirst).toContain(`@import "${pkg}"`);
    const base = blocks(r.cssAfterFirst).find(
      (b) => b.prelude === "@layer base",
    );
    expect(base).toBeDefined();
    const rule = (selector: string) =>
      base!.children.find((c) => c.prelude === selector)?.body ?? "";
    expect(rule("html")).toMatch(/@apply font-sans;?/);
    expect(rule("code, kbd, samp, pre")).toMatch(/@apply font-mono;?/);
  });

  test("6. package.json now names shadcn-svelte, cn and the 3 fonts", () => {
    const pkg = JSON.parse(
      readFileSync(path.join(r.app, "package.json"), "utf8"),
    );
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    expect(deps["shadcn-svelte"]).toBe("^1.7.1");
    expect(deps.cn).toBe("^0.5.0");
    for (const font of FONT_PACKAGES) expect(deps[font]).toMatch(/^\^\d/);
  });

  test("7. a second add exits 0 and leaves the CSS byte-identical", () => {
    expect(r.second.code).toBe(0);
    expect(r.cssAfterSecond).toBe(r.cssAfterFirst);
  });

  test("8. the reduced-motion block holds only html:root and *, ::before, ::after", () => {
    const prelude = "@media (prefers-reduced-motion: reduce)";
    expect(childPreludes(r.cssAfterSecond, prelude)).toEqual([
      "html:root",
      "*, ::before, ::after",
    ]);
    const block = blocks(r.cssAfterSecond).find((b) => b.prelude === prelude)!;
    for (const child of block.children) {
      for (const name of declarations(child.body).keys())
        expect(COLOURS).not.toContain(name);
    }
  });

  test("9. the app's vite build passes with FourDot and Lockup on a page", () => {
    if (r.build.code !== 0) console.error(r.build.output);
    expect(r.build.code).toBe(0);
  });

  test("10. the app's svelte-check reports 0 errors", () => {
    const completed = /COMPLETED \d+ FILES (\d+) ERRORS (\d+) WARNINGS/.exec(
      r.check.output,
    );
    if (!completed) console.error(r.check.output);
    expect(completed).not.toBeNull();
    expect(Number(completed![1])).toBe(0);
  });
});
