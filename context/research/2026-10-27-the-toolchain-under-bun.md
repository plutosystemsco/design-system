# The toolchain under Bun

- **Status:** complete
- **Date:** 2026-10-27
- **Owner:** Clay Gendron (research executed by an agent, Claude, sub-agent of the orchestrating session)
- **Question:** Which of the tools specification `001` needs run under Bun 1.3.14 instead of Node, and how each is invoked. The tools are Vite 8.3.5 with SvelteKit 3.1.0, Tailwind 4.3.3 and adapter-static 4.0.0; svelte-check 4.7.7; Vitest 5.0.5 or Bun's own test runner; Playwright 1.64.1 with @axe-core/playwright 4.14.0; the shadcn-svelte 1.7.1 CLI; prettier 3.9.10 with prettier-plugin-svelte 4.1.1; and Bun scripts that spawn the CLI.
- **What it blocks:** the amendment of specification 001 after the owner's decision that Bun is the runtime.

## How to read this memo

Every claim carries a label.

- **EXECUTED**: we ran it and saw the result, on 2026-10-27, macOS (Darwin 25.5.0, arm64), Bun 1.3.14. The default `node` on `PATH` is 22.14.0 (nvm). Node 24.9.0 (Homebrew, `/opt/homebrew/opt/node@24/bin`) was used only for comparison runs.
- **READ**: a source says so. Each source is linked, and each was read on 2026-10-27.
- **INFERRED**: our reasoning.

All runs were in the session scratchpad, in a throwaway project named `bun-run` with the versions above pinned by its `bun.lock`. Nothing was written to this repository except this memo. We call that project **the scratch project** below.

Because the default `node` (22.14.0) is older than SvelteKit 3.1.0's `engines` (`>=22.17`), it was always visible which runtime ran. A small Vite plugin in `vite.config.ts` printed `process.versions.bun`, `process.version` and `process.execPath` each time Vite loaded its config. Tests printed the same from inside their workers.

Three terms of art:

- A **runtime** is the program that executes JavaScript: here, either Bun or Node.
- A **shebang** is the first line of a script, such as `#!/usr/bin/env node`. It tells the operating system which program runs the file. Every tool here ships its command-line entry point with `#!/usr/bin/env node` (EXECUTED: `head -1` of the bins of vite, vitest, svelte-check, `@playwright/test`, prettier, `@sveltejs/kit` and shadcn-svelte).
- **`--bun`** is a Bun flag that overrides that shebang, so the tool runs under Bun instead of Node.

## 1. How Bun decides which runtime runs a tool

This section applies to every tool below.

**Without `--bun`, Bun honours the shebang and starts Node.**

- READ ([bun run](https://bun.com/docs/cli/run)): "By default, Bun respects this shebang and executes the script with `node`." "The `--bun` flag overrides it: the CLI runs with Bun instead of Node.js." The CLI reference describes it as "via symlinking node".
- READ ([bunx](https://bun.com/docs/pm/bunx)): the flag "must occur *before* the executable name". So `bunx --bun my-cli` works and `bunx my-cli --bun` does not.
- EXECUTED: `bun vite dev` ran `node .../node_modules/.bin/vite dev` (seen in `ps`), with `execPath` Node 22.14.0. `bun run build`, with the script `vite build`, also ran Node 22.14.0.

**Under `--bun`, Bun reports itself as Node 24.3.0.**

- EXECUTED: every `--bun` run printed `process.version=v24.3.0`, `process.versions.node=24.3.0`, `process.versions.bun=1.3.14` and `execPath=/Users/claygendron/.bun/bin/bun`.
- INFERRED: any version check a tool makes against `process.versions.node` sees 24.3.0. That satisfies every `engines` range in the set.

**`bun --bun run <script>` and `bun --bun <bin>` put a `node` shim first on `PATH`.**

- EXECUTED: under both, `PATH` began with `/private/tmp/bun-node-0d9b296af`. That folder held two symlinks, `node` and `bun`, both pointing at `/Users/claygendron/.bun/bin/bun`.
- So every child process that calls `node`, or runs a bin with a `node` shebang, also runs under Bun (EXECUTED, section 9).
- `bun --bun file.ts`, `bun test` and `bun --bun test` do **not** add the shim (EXECUTED, section 9).

**`bunfig.toml` can make `--bun` the default for `bun run` and `bun <bin>`, but not for `bunx`.**

- READ ([bunfig](https://bun.com/docs/runtime/bunfig), "`run.bun` - auto alias `node` to `bun`"): it applies "for all scripts or executables invoked by `bun run` or `bun`". The page does not mention `bunx`.
- EXECUTED: with `[run]` `bun = true` in `bunfig.toml`, `bun run build` and `bun vite build` both ran under Bun, and `bun run` added the `node` shim to `PATH`.
- EXECUTED: with the same file, `bunx shadcn-svelte@1.7.1 registry build` still ran under Node (the CLI's Bun warning, section 7, did not appear).

**`bunx pkg@version` ignores the local install.**

- READ ([bunx](https://bun.com/docs/pm/bunx)): with a version, `bunx` "does not use the local package" and installs that version into Bun's global cache.
- EXECUTED: `bunx --bun shadcn-svelte@1.7.1 add`, run in an app with `shadcn-svelte` 1.7.1 installed, ran from `/private/var/folders/.../T/bunx-501-shadcn-svelte@1.7.1/node_modules/shadcn-svelte/dist/` (seen in a stack trace).
- INFERRED: a copy run from the global cache is not pinned by the project's `bun.lock` (constitution §4.5). `bun --bun shadcn-svelte ...` runs the local, locked bin (section 7).

## 2. `bun install` and `engines`

Bun does not enforce `engines` at install, for dependencies or for the root package.

- EXECUTED: the installed `engines` fields are `@sveltejs/kit` `node >=22.17`; `vite` `^20.19.0 || >=22.12.0`; `vitest` `^22.12.0 || ^24.0.0 || >=26.0.0`; `@axe-core/playwright` `>=22.12.0`; `@playwright/test` `>=20`; `svelte-check` `>= 18.0.0`; `prettier` `>=14`; `cn` `>=22`; `shadcn-svelte` none.
- EXECUTED: `bun install` exited 0 ("97 packages installed") with no warning. So did `bun install --frozen-lockfile` after deleting `node_modules`.
- EXECUTED: with the root `package.json` set to `"engines": { "node": ">=99", "bun": ">=9.0.0" }`, both `bun install` and `bun install --frozen-lockfile` still exited 0 with no warning.
- READ ([bunfig](https://bun.com/docs/runtime/bunfig)): the package-manager section does not mention `engines`.
- INFERRED: `"engines": { "bun": ">=1.3.14" }` in `package.json` documents intent but enforces nothing. `"packageManager": "bun@1.3.14"` is the same.

## 3. Vite 8.3.5 with SvelteKit 3.1.0, Tailwind 4.3.3 and adapter-static 4.0.0

**Works under Bun.**

The scratch project: Kit config in `vite.config.ts` as `sveltekit({ adapter: adapter() })`, Tailwind through `@tailwindcss/vite`, `+layout.ts` with `prerender = true`, two pages, a `#lib` import, and `static/r/test.json`.

| Command | Exit | Runtime | Result |
|---|---|---|---|
| `bun --bun vite build` | 0 | Bun 1.3.14 | Prerendered `build/index.html` and `build/about.html`; copied `build/r/test.json`; ended `Wrote site to "build"` and `✔ done` |
| `bun --bun vite dev --port 5301 --strictPort` | (server) | Bun 1.3.14 | `VITE v8.3.5 ready in 555 ms`. `GET /` answered 200 `text/html` with `<h1 class="p-4">Hello from Kit 3</h1>`. `GET /r/test.json` answered 200 `application/json` |
| `bun vite dev --port 5302` (no `--bun`) | (server) | Node 22.14.0 | `GET /` 200; Tailwind CSS served |
| `bun vite build` (no `--bun`) | 0 | Node 22.14.0 | Same output as under Bun |
| `bun run build` (script `vite build`) | 0 | Node 22.14.0 | |
| `bun --bun run build` | 0 | Bun 1.3.14 | |

All EXECUTED. The first lines of `bun --bun vite build`:

```
[runtime] command=build bun=1.3.14 process.version=v24.3.0 versions.node=24.3.0 execPath=/Users/claygendron/.bun/bin/bun
vite v8.3.5 building ssr environment for production...
transforming...
✓ 139 modules transformed.
```

**SvelteKit makes no runtime version check.**

- EXECUTED: Kit 3.1.0 built and served under Node 22.14.0, below its own `engines` (`>=22.17`).
- READ: a search of `node_modules/@sveltejs/kit/src` for `process.version`, `versions.node`, `versions.bun` and `engines` found nothing outside type files.
- READ: Vite does check. `vite/dist/node/cli.js` line 642 warns "You are using Node.js ${process.versions.node}. Vite requires Node.js version 20.19+ or 22.12+." It reads `process.versions.node`, which under Bun is 24.3.0, so it stayed silent in every run.

**One warning came from our config, not from Bun.** Kit printed `tsconfig_invalid: "types" was overwritten. It must include "$app/types"` while our `tsconfig.json` set `"types": ["bun"]`. With `"types": ["$app/types", "bun"]` it stopped (EXECUTED).

## 4. svelte-check 4.7.7

**Works under Bun. It also finds a real problem with `#lib` that is not Bun's.**

| Command | Exit | Runtime | Result |
|---|---|---|---|
| `bun --bun svelte-check` | 1, then 0 after the fix below | Bun 1.3.14 (the Vite config's runtime line printed `bun=1.3.14`) | see below |
| `bunx --bun svelte-check` | same as above | Bun | same errors as `bun --bun svelte-check` on the same config |
| `node_modules/.bin/svelte-check` under Node 24.9.0 | 1 | Node 24.9.0 | the same single error |

All EXECUTED. What the runs found:

1. **Without `include`, it checks `build/`.** A `tsconfig.json` that extends `$app/tsconfig` and sets no `include` gave 1344 errors, nearly all in `build/_app/immutable/` (EXECUTED). Kit's own suggested shape is `include: ['src', 'test', '*']` and `exclude: ['src/service-worker']` (READ: `kit/src/core/sync/write_tsconfig/index.js`). With `"include": ["src", "tests", "scripts", "*.ts"]` the count fell to 1.
2. **Extensionless `#lib/utils` does not type-check** with the `imports` shape of decision 2 (`"#lib/*": "./src/lib/*"`). The error, the same under Bun and under Node 24.9.0:
   ```
   ERROR "src/routes/+page.svelte" 2:29 "Cannot find module '#lib/utils' or its corresponding type declarations."
   COMPLETED 315 FILES 1 ERRORS 0 WARNINGS 1 FILES_WITH_PROBLEMS
   ```
   - Kit writes `paths: {}` into `$app/tsconfig`. Its `get_paths` reads only `config.alias`, not `package.json` `imports` (READ: same file). So TypeScript resolves `#lib/*` through `imports` alone, and it does not add `.ts` to a target that has no extension (INFERRED from the error).
   - Kit's docs import with an extension: `import Component from '#lib/Component.svelte'`, and `$lib/foo.js` becomes `#lib/foo.js` (READ: [svelte.dev/docs/kit/$lib](https://svelte.dev/docs/kit/$lib)). Their example `imports` is `"#lib": "./src/lib/index.js", "#lib/*": "./src/lib/*"`.
   - **This hits shadcn-svelte.** The CLI writes `import { cn } from '#lib/utils'`, without an extension. A component installed by `add` failed svelte-check with the same error (EXECUTED, in a scratch app). So did the item source in the scratch project, `src/lib/registry/hello/hello.svelte`.
3. **Two fixes passed** (EXECUTED, under `bun --bun svelte-check`):
   - **A.** Write `#lib/utils.js` in the importing file: 0 errors. But in a registry item's source, `registry build` turned `#lib/utils.js` into `$UTILS$.js`, so the extension travels into every app.
   - **B.** Give the `imports` pattern fallback targets: `"#lib": "./src/lib/index.ts"`, `"#lib/*": ["./src/lib/*", "./src/lib/*.ts", "./src/lib/*/index.ts"]`. With extensionless `#lib/utils`: svelte-check 0 errors in the scratch project; `vite build` exited 0; `registry build` still wrote a clean `$UTILS$`; and in a scratch Kit 3 app with the same `imports`, `add` exited 0, placed files correctly, and both svelte-check (0 errors) and `vite build` passed.
   - **Limit of B.** Bun's and Node's own module resolvers do not use the fallbacks. Under fix B, `bun -e "import('#lib/utils')"` failed with `Cannot find module '#lib/utils'`, and Node 24.9.0 failed with `ERR_MODULE_NOT_FOUND`. `#lib/utils.ts` loaded under Bun (EXECUTED). Only Vite and TypeScript read the array (INFERRED).

INFERRED: this is the first run of svelte-check against Kit 3 with `#lib`, which the run memo left unknown (its §10). Acceptance criterion 2 (`bun run check` reports 0 errors) cannot pass with decision 2's `imports` shape and extensionless `#lib` imports. It is a specification question, not a runtime one.

## 5. Tests: Vitest 5.0.5 and `bun test`

**Both work under Bun.**

The test files (EXECUTED):

- `node-modules.test.ts` reads `package.json` through `node:fs` and `node:path`, and prints the runtime.
- `schema.test.ts` parses a two-item `registry.json` with `registrySchema` from `shadcn-svelte/schema`, and runs two `test.each` cases against `cn`.
- A smoke placeholder under a second config.

### 5.1 Vitest under Bun

| Command | Exit | Runtime | Result |
|---|---|---|---|
| `bun --bun vitest run --reporter verbose` | 0 | Bun, in the workers too: `[runtime] bun=1.3.14 node=v24.3.0` | `Test Files 2 passed (2)`, `Tests 5 passed (5)` |
| `bun --bun vitest run -c vitest.smoke.config.ts` | 0 | Bun | `1 passed` |
| `bun vitest run` (no `--bun`) | 0 | Node 22.14.0 | 5 passed |

All EXECUTED. One run first failed because our `registry.json` item lacked `registryDependencies`; the schema requires it. That was our data, not Bun.

### 5.2 `bun test`

- **It runs Vitest-written files unchanged.** `bun test tests/unit`, on the same two files that import from `vitest`: `5 pass`, `0 fail`, exit 0 (EXECUTED).
- **It does so without the `vitest` package.** With `node_modules/vitest` moved away, the same command still passed 5 of 5. `import { vi } from 'vitest'` with `vi.fn` and `toHaveBeenCalledWith` also passed (EXECUTED). Bun's migration guide names only `@jest/globals` as rewritten to `bun:test` (READ: [Migrate from Jest](https://bun.com/docs/guides/test/migrate-from-jest)). INFERRED: the `vitest` mapping is real but not in the docs we read, so it should not be relied on; write `bun:test` imports.
- **`bun:test` versions of the files** used `describe`, `test`, `expect`, `beforeAll` and `test.each` with `%s`. `bun test tests/bun/unit` passed 5 of 5 (EXECUTED).
- **`#lib` under Bun's resolver.** `import('#lib/utils')` failed: `Cannot find module '#lib/utils' from '.../tests/bun/unit/node-modules.test.ts'`. `#lib/utils.js` also failed. `#lib/utils.ts` and relative `../../src/lib/utils.ts` loaded (EXECUTED). Vitest, which resolves through Vite, loads extensionless `#lib/utils` (INFERRED from section 3, where Vite built it).
- **`.svelte` files.** A `bun test` that imported `hello.svelte` got a module whose `default` was a string (a file path), not a component (EXECUTED). INFERRED: `bun test` cannot render or compile Svelte without a plugin. Unit tests must import `.ts` only, and never a `.ts` that imports a `.svelte` file (such as an item's `index.ts`). Decision 25's eight unit files import `.ts` only, and need not change.

**Choosing a directory or a smoke set** (all EXECUTED):

| Command | What ran |
|---|---|
| `bun test unit` | 4 files: a bare argument is a substring filter, and matched both `tests/unit/` and `tests/bun/unit/` |
| `bun test ./tests/unit` | 2 files: an argument starting `./` is a path |
| `bun test` (no argument) | Every `*.test.ts` **and every `*.spec.ts`**, so it loaded the Playwright specs and failed, exit 1: `error: Playwright Test did not expect test() to be called here.` |
| `bun test --path-ignore-patterns='tests/e2e/**'` | exit 0; the Playwright specs skipped |
| `bunfig.toml` `[test]` `pathIgnorePatterns = ["tests/e2e/**"]` | exit 0; the same |
| `bunfig.toml` `[test]` `root = "tests/bun/unit"`, then `bun test` | only that folder; an explicit `bun test ./tests/bun/smoke` still ran the smoke folder |
| `bun --config=bunfig.smoke.toml test` and `bun test --config=bunfig.smoke.toml` | both used the alternate file's `root`; `bun -c bunfig.smoke.toml test` failed: `error: Cannot run ".../bunfig.smoke.toml"` |

READ ([bun test](https://bun.com/docs/test)): files matching `*.test.*`, `*_test.*`, `*.spec.*` and `*_spec.*` are discovered; "Filters are commonly file or directory names; glob patterns are not yet supported"; a single file needs a path starting `./` or `/`. READ ([bunfig](https://bun.com/docs/runtime/bunfig)): `test.root` and `test.pathIgnorePatterns` exist; the CLI flag overrides the bunfig value.

**Timeouts** (all EXECUTED):

- `bun test --timeout 100` failed a test that slept 300 ms: `(fail) waits 300 ms (default timeout) [100.92ms]  ^ this test timed out after 100ms.`, exit 1.
- In the same run, a test given `1000` as its third argument passed. A per-test timeout wins over the flag.
- `[test]` `timeout = 100` in `bunfig.toml` was **not honoured**: the 300 ms test passed. READ: the bunfig page documents no `timeout` key.
- A whole-suite hook can take a timeout too: `beforeAll(fn, 70_000)` ran (section 9).

READ ([Writing tests](https://bun.com/docs/test/writing-tests), [bun test](https://bun.com/docs/test)): the default timeout is 5000 ms; a number as `test`'s third argument sets one test's timeout; `test.each` and `describe.each` take `%p %s %d %i %f %j %o %#`; `test.if`, `test.skipIf`, `test.todo`, `test.failing` and a `retry` option exist; `beforeAll`, `beforeEach`, `afterEach`, `afterAll` exist; "Bun aims for compatibility with Jest, but not everything is implemented"; only `.addSnapshotSerializer()` is listed as not yet implemented among matchers. The migration guide says "Replace `testTimeout` with the `--timeout` CLI flag."

## 6. Playwright 1.64.1 with @axe-core/playwright 4.14.0

**Works under Bun, end to end. It is not an exception.**

| Command | Exit | Runtime | Result |
|---|---|---|---|
| `bunx --bun playwright install chromium` | 0 (13.9 s) | Bun | Downloaded "Chrome for Testing 156.0.8078.4 (playwright chromium v1248)" and "Chrome Headless Shell 156.0.8078.4 (playwright chromium-headless-shell v1248)" to `~/Library/Caches/ms-playwright/` |
| `bun --bun playwright test` | 0 | Bun in the config process, the workers and the web server | `4 passed (4.2s)` |
| the same, 3 runs then 5 runs, 10 tests in 2 projects | 0 each time | Bun | `10 passed` every run (2.3 to 2.4 s) |
| `bunx playwright test` (no `--bun`) | 0 | Node 22.14.0 | `10 passed (2.4s)` |
| `node_modules/.bin/playwright test` under Node 24.9.0 | 0 | Node 24.9.0 | `10 passed (2.5s)` |

All EXECUTED. The first lines of `bun --bun playwright test`:

```
[runtime] playwright-config bun=1.3.14 node=v24.3.0
[WebServer] [runtime] command=serve bun=1.3.14 process.version=v24.3.0 versions.node=24.3.0 execPath=/Users/claygendron/.bun/bin/bun
[WebServer]   ➜  Local:   http://localhost:4173/
Running 4 tests using 2 workers
[runtime] worker bun=1.3.14 node=v24.3.0
[axe] / violations=0 passes=24
  ✓  1 [light] › tests/e2e/axe.spec.ts:5:1 › axe on / (748ms)
```

The setup (EXECUTED):

- `playwright.config.ts` had `webServer.command: 'bun --bun vite preview --port 4173 --strictPort'`, and two projects, `light` and `dark`, set by `colorScheme`, as decision 25 has.
- `axe.spec.ts` scanned `/` and `/about` with `AxeBuilder` and the tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa` and `best-practice`. 0 violations, and 24 and 21 passing rules, so axe ran.
- `features.spec.ts` covered what the other browser files of decision 25 need: `page.keyboard.press('Tab')` then `Enter` (focus reached the link and navigated), `page.evaluate` and `getComputedStyle` (`padding-top` read `16px`), `test.use({ reducedMotion: 'reduce' })` (`matchMedia` matched), and `getByRole`.
- **The failure path works.** A spec that expected the wrong heading failed with `Error: expect(locator).toHaveText(expected) failed`, and the run exited 1.
- **axe reports violations.** An image with no `alt`, set with `page.setContent`, produced `image-alt` under Bun.

One of our tests was wrong at first, not Bun. Planting the image into the live page with `page.evaluate` gave an empty violation list, and sometimes did not, under Bun **and under Node 24.9.0** (EXECUTED). INFERRED: Svelte's hydration replaced the planted node. `page.setContent` fixed it.

**A side effect on the owner's machine.** `playwright install` removed `chromium-1234`, `chromium_headless_shell-1234` and `ffmpeg-1011` from the shared cache, `~/Library/Caches/ms-playwright/`, as unused (EXECUTED: its first output lines). The cache now holds `chromium-1248`, `chromium_headless_shell-1248` and `ffmpeg-1013`. INFERRED: another project on an older Playwright would download its browsers again.

## 7. The shadcn-svelte 1.7.1 CLI

**Works under Bun, with the same output as under Node. It prints a warning.**

The warning, printed under every `--bun` run (EXECUTED):

```
▲  You are currently using an unsupported runtime. Only Node.js v22 or higher is officially supported. Continue at your own risk.
```

It comes from `typeof Bun<"u"||typeof Deno<"u"` in the CLI's start-up banner (READ: `node_modules/shadcn-svelte/dist/index.mjs`). It does not stop the CLI.

**`registry build`** (EXECUTED):

| Command | Exit | Runtime |
|---|---|---|
| `bunx --bun shadcn-svelte@1.7.1 registry build -o static/r/styles/maia` | 0 | Bun (warning printed) |
| `bun --bun shadcn-svelte registry build -o static/r/styles/maia` (the local bin) | 0 | Bun (warning printed) |
| `bunx shadcn-svelte@1.7.1 registry build -o static/r/styles/maia` | 0 | Node 22.14.0 (no warning) |

- Both wrote `index.json`, `hello.json` and `utils.json`, and `diff -r` found the Bun and Node outputs identical.
- `#lib/utils` became `$UTILS$`, and `cn` was listed as `cn@^0.5.0` from the scratch project's `package.json`, as the run memo found under Node.

**`add`, against a dev server running under Bun** (EXECUTED):

- The registry project ran `bun --bun vite dev --port 5310`. `GET /r/styles/maia/index.json` answered 200.
- The scratch app was Kit 3.1.0 with `#lib` imports and aliases, a `components.json` naming the published URL `https://ui.plutosystems.co/r`, and `shadcn-svelte` 1.7.1 installed.
- The first attempt failed, exit 1: `CLI Error: Failed to fetch registry from http://localhost:5310/r/styles/nova/index.json: 404 Not Found`. **The CLI's default style is `nova`.** Adding `"style": "maia"` to `components.json` fixed it. That is configuration, not Bun.
- `REGISTRY_URL=http://localhost:5310/r bunx --bun shadcn-svelte@1.7.1 add hello -y -o` then exited 0:
  ```
  ▲  You are currently using an unsupported runtime. ...
  ◇  Components to install:
  │  hello
  ◇  hello installed at src/lib/components/ui/hello
  ◇  utils installed at src/lib/utils
  ◇  Installing dependencies with bun...
  ◆  Successfully installed dependencies
  └  Success! Components added.
  ```
- Files landed at `src/lib/components/ui/hello/hello.svelte`, `.../index.ts` and `src/lib/utils.ts`. The import read `import { cn } from '#lib/utils'`. `package.json` gained `"cn": "^0.5.0"` under devDependencies, and `bun.lock` held `cn`. `bun --bun vite build` in the app exited 0.
- The same `add` with `bunx shadcn-svelte@1.7.1` (Node 22.14.0) into a clean copy of the app: `diff -r` found `src/` identical and `package.json` identical.

**The smoke flow runs inside `bun test`.** A `bun:test` file did what decision 25's `registry-add.test.ts` does (EXECUTED: `1 pass`, `5 expect() calls`, 4.40 s, exit 0):

- `beforeAll` started `bun --bun vite dev --port 5320` with `Bun.spawn` and polled `/r/styles/maia/index.json` until it answered.
- The test copied a scratch app and ran `bunx --bun shadcn-svelte@1.7.1 add hello -y -o` with `REGISTRY_URL` in `env`. It asserted exit 0, the Bun warning, the file, and the `#lib/utils` import, then ran `bun --bun vite build` in the app (exit 0).
- `afterAll` killed the server; no `vite dev` process was left.

## 8. prettier 3.9.10 with prettier-plugin-svelte 4.1.1

**Works under Bun.**

| Command | Exit | Result |
|---|---|---|
| `bun --bun prettier --check .` (fresh files) | 1 | `[warn]` for 7 unformatted files, then `Code style issues found in 7 files.`: expected, the files had not been formatted |
| `bun --bun prettier --write .`, then `bun --bun prettier --check .` | 0, 0 | `All matched files use Prettier code style!` |
| `bun --bun prettier --check src/routes/Ugly.svelte` (a badly spaced `.svelte` file) | 1 | flagged |
| `bun --bun prettier src/routes/Ugly.svelte` | 0 | printed `let x = 1;` and `<p class="a">{x}</p>`: the Svelte plugin parsed it |
| the same check and the final `--check .` under Node 24.9.0 | 1, 0 | identical results |

All EXECUTED. `.prettierrc` set `"plugins": ["prettier-plugin-svelte"]`, and `.prettierignore` listed `build/`, `.svelte-kit/`, `static/r/`, `node_modules/`, `test-results/` and `bun.lock`.

## 9. A Bun script that spawns the CLI

**The child runs under Node unless it is told otherwise, or unless the parent came from `bun --bun run` or `bun --bun <bin>`.**

`scripts/spawn-probe.ts` spawned the CLI five ways and judged each child by the CLI's Bun-only warning. It also spawned `node -e`. Each row is one way of starting the parent (all EXECUTED; every child exited 0):

| Child spawned as | `bun scripts/spawn-probe.ts` | `bun --bun scripts/spawn-probe.ts` | `bun run probe` | `bun --bun run probe` |
|---|---|---|---|---|
| `Bun.spawn(['node_modules/.bin/shadcn-svelte', ...])` | Node | Node | Node | **Bun** |
| `Bun.spawn(['bunx', 'shadcn-svelte@1.7.1', ...])` | Node | Node | Node | **Bun** |
| `Bun.spawn(['bunx', '--bun', 'shadcn-svelte@1.7.1', ...])` | **Bun** | **Bun** | **Bun** | **Bun** |
| `Bun.spawn([process.execPath, '--bun', 'node_modules/.bin/shadcn-svelte', ...])` | **Bun** | **Bun** | **Bun** | **Bun** |
| `Bun.spawn(['node', '-e', ...])` | Node | Node | Node | **Bun** |
| `spawnSync('node_modules/.bin/shadcn-svelte', ...)` from `node:child_process` | Node | Node | Node | **Bun** |

- With `bunfig.toml` `[run]` `bun = true`, `bun run probe` matched the `bun --bun run probe` column, and `bun scripts/spawn-probe.ts` matched the first column (EXECUTED).
- **A child does not inherit `--bun` as a flag.** It inherits the `node` shim on `PATH`, and only `bun --bun run` and `bun --bun <bin>` add that shim (section 1).
- **Two ways force Bun whatever started the parent:** put `--bun` in the child's argv, as `[process.execPath, '--bun', <bin>, ...]` (local, locked bin) or `['bunx', '--bun', <pkg>, ...]` (global cache, section 1).

**Children of test runners** (a test spawned `node -e` and `node_modules/.bin/vite --version`; all EXECUTED):

| Runner started as | Child `node` | Child `vite --version` |
|---|---|---|
| `bun test ./tests/probe` | Node 22.14.0 | `node-v22.14.0` |
| `bun --bun test ./tests/probe` | Node 22.14.0 | `node-v22.14.0` |
| `bun run t:bun` (script `bun test ./tests/probe`) | Node 22.14.0 | `node-v22.14.0` |
| `bun --bun run t:bun` | Bun | `bun-v24.3.0` |
| `bun --bun vitest run` | Bun | `bun-v24.3.0` |
| `bun --bun playwright test` (a worker) | Bun | |

INFERRED: a smoke test under `bun test` that spawns tools must put `--bun` in each child's argv, as section 7's smoke test did. Under `bun --bun run test` it would not need to.

## 10. Summary

| Tool | Works under Bun? | Command | Exception? |
|---|---|---|---|
| `bun install` | Yes; `engines` never enforced | `bun install --frozen-lockfile` | No |
| Vite 8.3.5 + Kit 3.1.0 + Tailwind 4.3.3 + adapter-static 4.0.0 | Yes: dev, `static/`, build, prerender, preview | `bun --bun vite dev`, `bun --bun vite build`, `bun --bun vite preview` | No |
| svelte-check 4.7.7 | Yes; same results as Node 24 | `bun --bun svelte-check` | No. But extensionless `#lib/...` fails under both runtimes (section 4) |
| Vitest 5.0.5 | Yes, workers included | `bun --bun vitest run [-c vitest.smoke.config.ts]` | No |
| `bun test` | Yes; runs Vitest-style and `bun:test` files | `bun test ./tests/unit`, `bun test ./tests/smoke --timeout 120000` | No. Needs `./` paths or an ignore pattern to keep out `*.spec.ts`; resolves only `#lib/x.ts`; no `[test] timeout` in bunfig |
| Playwright 1.64.1 + axe 4.14.0 | Yes: install, runner, workers, `webServer`, axe; 8 of 8 repeat runs green | `bunx --bun playwright install chromium`, `bun --bun playwright test` | No |
| shadcn-svelte 1.7.1 CLI | Yes; output identical to Node; prints an "unsupported runtime" warning | `bun --bun shadcn-svelte registry build`; in an app, `bunx --bun shadcn-svelte@1.7.1 add <item> -y -o` | No |
| prettier 3.9.10 + svelte plugin 4.1.1 | Yes; same as Node 24 | `bun --bun prettier --check .` | No |
| Bun script spawning the CLI | Yes, if the child's argv says `--bun` | `Bun.spawn([process.execPath, '--bun', 'node_modules/.bin/shadcn-svelte', ...])` | No |

No tool needed Node in this run.

## 11. Recommendation

This memo commits to nothing. These are the options it supports for amending specification `001`.

- **Every tool can run under Bun.** Decision 1 could name Bun as the only runtime, with no exception. The evidence is sections 3 to 9 (INFERRED from EXECUTED).
- **Two ways to say `--bun` once, not in every script:**
  - Write `bun --bun run <script>` in each composite script and in the docs. Children then inherit Bun through the shim (section 9).
  - Or commit a `bunfig.toml` with `[run]` `bun = true`. Then `bun run dev` and `bun run test` run Bun everywhere. It does not cover `bunx`, so `bunx` calls still need `--bun` (section 1).
  - Either way, a child spawned from a script started as `bun file.ts`, or from `bun test`, still needs `--bun` in its argv (section 9).
- **Run the CLI from the local bin, not `bunx pkg@version`.** `bun --bun shadcn-svelte ...`, or `[process.execPath, '--bun', 'node_modules/.bin/shadcn-svelte']` from a script, uses the copy `bun.lock` pins. `bunx shadcn-svelte@1.7.1` uses a copy outside it (section 1). Apps such as `wasi-python-dev` keep using `bunx --bun shadcn-svelte@1.7.1 add`, as decision 23 says, with `--bun` added.
- **Vitest or `bun test`.** Both worked.
  - `bun test` drops one dependency (`vitest`, 20 packages become 19). It runs the unit and smoke files, takes `--timeout`, and has `beforeAll`, `test.each` and the matchers decision 25 uses. Its costs: unit tests must import `#lib/x.ts` or relative paths; a bare `bun test` picks up the Playwright specs, so the scripts must pass `./tests/unit` and `./tests/smoke`, or set `pathIgnorePatterns`; and a smoke config file becomes a folder plus a `--timeout` flag.
  - Vitest keeps Vite's resolver (extensionless `#lib/...` works, INFERRED) and decision 25 as written, at the cost of one dependency and the `--bun` flag.
  - On fewer dependencies, `bun test` wins. On compatibility with what decision 25 already says, Vitest wins. Both are supported by evidence.
- **Decision 2 needs its own amendment, whatever the runtime.** With `"#lib/*": "./src/lib/*"`, extensionless `#lib/...` imports fail svelte-check, and the CLI writes extensionless imports. Fix B, fallback targets in `imports`, passed svelte-check, `vite build`, `registry build` and `add` (section 4). This is a finding for the spec's author, not a choice made here.
- **Small things for the spec.** `components.json` needs `"style": "maia"` (section 7). `tsconfig.json` needs an `include` and `"types": ["$app/types", ...]` (sections 3 and 4). `"engines"` and `"packageManager"` name Bun but enforce nothing (section 2). `@types/bun` 1.3.14 typed `Bun.spawn` and `Bun.sleep` in our scripts (EXECUTED: it installed and svelte-check reported no errors in `scripts/` or `tests/`).

## 12. What is still unknown

- Whether `bun test`'s mapping of `vitest` imports is intended. Bun's docs that we read name only `@jest/globals`.
- Whether `bun test` can load `.svelte` through a Bun plugin (`--preload`). Not tried; decision 25 does not need it.
- Whether a Kit 2.70.3 app (decision 25's scratch app B) installs and builds the same under `bunx --bun add`. Only Kit 3 apps were run under Bun.
- Whether fix B's array targets work with every `add` path: items with nested `#lib/components/...` imports, hooks, or a bare `#lib` import. Only `#lib/utils` and `#lib/components/ui` were exercised.
- Whether an item whose source says `#lib/utils.js` (fix A, which travels as `$UTILS$.js`) builds in a Kit 2 app with `$lib/utils.js`.
- The dev loop's Vite-plugin watcher (decision 23) under Bun. Vite's own file watcher was not exercised beyond dev start-up.
- Speed. No timing comparison of Bun and Node was made beyond the durations printed.
- Whether the `node` shim folder (`/private/tmp/bun-node-<hash>`) behaves the same in CI on Linux.
