# Review of 022i and 022j — the matrix workflow's two missing steps, and the editor's run keys on every platform (the built changes)

Reviews two small changes, each with its own specification:

- [`022i`](../specifications/022i-the-matrix-workflows-two-missing-steps.md), the matrix workflow's two missing steps (`.github/workflows/matrix.yml`);
- [`022j`](../specifications/022j-the-editors-run-keys-on-every-platform.md), the editor's run keys, tested on every platform (`tests/e2e/code.spec.ts`).

The research behind both is [the first matrix run](../research/2026-11-16-the-first-matrix-run.md), groups 1, 10 and 11. This reviewer wrote neither specification and none of the code (constitution §5).

- **Date:** 2026-11-16
- **Status:** dispositioned; both land
- **Reviewer:** a reviewer; not the author
- **Reviewed:** the uncommitted working tree on `release/0.13.0` at `e24a04b`: `git diff -- .github/workflows/matrix.yml tests/e2e/code.spec.ts` (+12 lines in the workflow, +2 −1 in the test). `bun.lock` and every other tracked file are unchanged.
- **Re-ran:** Bun 1.4.4, Linux, Chromium 153 from the scratch browsers path. `git status` was the same before and after: the two edits and the three new context files.
  - `bun test tests/unit/workflow.test.ts tests/unit/release-check.test.ts` → **32 pass, 0 fail**, 300 expects, exit 0.
  - `bun --bun prettier --check` on both files → clean, exit 0.
  - `playwright test --project=chromium-light --project=chromium-dark tests/e2e/code.spec.ts -g E4` (`E2E_PREBUILT=1`) → **2 passed**.
  - A scratch probe of E4's run keys (a config and spec in the scratchpad, Playwright under Node, the same `vite preview` of `build/`). It cut one binding at a time out of the served chunk (`page.route` on `C1P29TFK.js`), and it emulated a Mac platform (`navigator.platform` = `MacIntel`, by init script). Results, as "Ran n times" after two presses:
    - the old keys (`Control+Enter`, `Meta+Enter`), Linux → **1**: the defect, seen failing;
    - the new keys, Linux → **2**; with `Mod-Enter` cut → **2**; with `Ctrl-Enter` cut → **2** (finding 1);
    - `Control+Enter` then `Meta+Enter`, Mac platform → **2**; with `Mod-Enter` cut → **1**, and a blank line inserted; with `Ctrl-Enter` cut → **1**.
  - `SMOKE_BLOCKS= bun test ./tests/smoke/site-add.test.ts` with `build/` present → **10 pass, 0 fail**, exit 0. The same file from a directory with no `build/` → **0 pass, 1 fail**, "Ran 1 test", "build/ is missing" (finding 3).
  - `cd node_modules/ffmpeg-static && bun install.js`, with `FFMPEG_BIN`, `XDG_CACHE_HOME` and `npm_config_platform=darwin`, `npm_config_arch=arm64` pointed into the scratchpad → exit 0. It wrote a 45.6 MB "Mach-O 64-bit arm64 executable", SHA-256 `a90e3db6a3fd35f6074b013f948b1aa45b31c6375489d39e572bea3f18336584`. Run plainly, with the binary present → "ffmpeg is installed already.", exit 0.
  - `curl -I` of `ffmpeg-darwin-arm64.gz`, `ffmpeg-darwin-x64.gz` and `ffmpeg-linux-x64.gz` at tag `b6.1.1` → 200 each.
- **Not re-run:** GitHub Actions. Both specifications' final checks are the next `matrix` push run, which only the owner can start. No macOS, Firefox or WebKit run was possible here. The full smoke suite was not run; `site-add` alone was.

## Acceptance criteria against evidence

### 022i

1. `checks` takes `needs: build` without breaking its conditions — **met.**
   - READ: `checks`' `if` is `build`'s plus `!inputs.mutate` (`matrix.yml:68`). With `needs`, GitHub adds an implicit `success()`. On a same-repository pull request, both skip. On a fork's pull request, `build` runs, then `checks`. On a `mutate` dispatch, `build` runs and `checks` is skipped by its own `if`, as before. On a push, `inputs.mutate` is empty, so `checks` runs after `build`.
   - READ: `gate.ts` reads `NEEDS`. A full run fails on any skipped or failed job, so a failed `build` that now skips `checks` still fails the gate. A mutation run expects `checks` skipped, and it still is. `gate`'s `needs` already lists `checks` (`matrix.yml:310`). `report` does not need `checks`, and needs nothing from it.
   - READ: `workflow.ts` parses `needs` as a string or a list. `jobNames` is unchanged at 33, so the release check's expected list is unchanged. `bootstrap-matrix.yml` holds one echo job; it is unaffected.
   - EXECUTED: `workflow.test.ts` and `release-check.test.ts`, 32 pass.
2. `checks` downloads and unpacks `site` before `test:smoke`, with the same two `test -f` checks — **met, READ** (`matrix.yml:92–100`). The three steps match the browser jobs' text. They come after `check` and `lint`, so the unpacked trees cannot change what those read.
3. Nothing else in the smoke suite needs more than `build/` and `.svelte-kit/output` — **met.** READ: only `site-add.test.ts` reads the repository's `build/` (l. 23, 74, 195, 293). The other smoke files build their own scratch apps. EXECUTED: `site-add` passes with `build/` present, 10 of 10.
4. `voiceover` runs `ffmpeg-static`'s install script alone, and that is enough for `sr:setup --macos-record` — **met, by reading and a local run.**
   - READ: `guidepup setup --macos-record` requires `@guidepup/record` (an optional dependency of `@guidepup/setup`, in `bun.lock`). Its `common/record.js` spawns `require("ffmpeg-static")`, the hoisted `node_modules/ffmpeg-static`. Its `index.js` returns `node_modules/ffmpeg-static/ffmpeg`, and `install.js` writes there. No test in `tests/sr/` records; only the setup does.
   - READ: `bun.lock` is `configVersion: 1` with no `workspaces` in `package.json`, so the install is hoisted. EXECUTED: here, `node_modules/ffmpeg-static` is a real directory, not a link.
   - READ: `bun.lock` marks two packages `hasInstallScript`: `ffmpeg-static` and `tree-sitter`. The macOS job needs only the first. `tree-sitter`'s build is the one `022` Q9 keeps off.
   - EXECUTED: the script fetches the darwin-arm64 binary under Bun, and exits 0 when the binary is present. The macOS runner's default shell is bash; `cd` lasts for that step only, and the next step starts at the workspace. INFERRED: right.
   - INFERRED: `macos-26` is an arm64 image; the x64 asset exists too, so either architecture resolves.
5. The check: the next push run passes `test:smoke`, and both `voiceover` jobs pass `sr:setup` and reach `test:sr` — **not yet met: it has not run** (finding 2). Its count is wrong (finding 3).

### 022j

1. The defect is real — **met, EXECUTED.** With the old keys on Linux, the example runs once ("Ran 1 time"). READ: `code-editor.svelte:82–83` binds `Mod-Enter` and `Ctrl-Enter` at `Prec.highest`. CodeMirror's `normalizeKeyName` turns `Mod` into `Meta` on a Mac and `Ctrl` elsewhere; the platform comes from `navigator.platform` (`@codemirror/view`, `browser.mac`).
2. `ControlOrMeta+Enter` is the right key — **met, READ.** Playwright 1.64.1's `resolveSmartModifierString` returns `Meta` when `process.platform` is `darwin`, else `Control` (`playwright-core/lib/coreBundle.js:22436`); its `Keyboard.press` docs say the same. Playwright reads the runner's platform and CodeMirror reads the browser's. In the matrix both are the same machine, so they agree. INFERRED: a remote browser on another OS would split them; the matrix has none.
3. E4 passes after the fix in `chromium-light` and `chromium-dark` — **met, EXECUTED**, 2 passed.
4. E4 passes in every project of the next `matrix` run — **not yet met: it has not run.** INFERRED: Firefox and WebKit on Linux report a Linux `navigator.platform` (run 1 failed E4 the same way in all six projects), so the new press is Ctrl there too.
5. No other test presses `Meta+…` in the same macOS-only way — **met, READ.** The grep finds four presses:
   - `navigation.spec.ts:781` presses `Meta+b`. The sidebar accepts `metaKey || ctrlKey` on every platform (`sidebar/context.svelte.ts:66`).
   - `search.spec.ts:50` presses `Meta+k`. The site search accepts `ctrlKey || metaKey` (`search.svelte:61`).
   - `code.spec.ts:1066` and `:1077` press `Meta+ArrowDown` and `Meta+z`, each followed by its Linux twin (`Control+End`, `Control+z`). One of each pair is a no-op on each platform, by design.
   - The palette's platform-specific copy key (`search-palette.svelte:125`) is already pressed as `ControlOrMeta+c`. E6 uses `ControlOrMeta+End`.
   None of these is the run-keys defect, and none is in run 1's failures.

## Findings, most severe first

1. **Medium: on Linux, E4 cannot tell the two run bindings apart, and no CI job runs it on a Mac** (`tests/e2e/code.spec.ts:1083–1087`; `022j`, "The fix").
   On Linux, `Mod-Enter` and `Ctrl-Enter` both normalise to `Ctrl-Enter`, and CodeMirror pushes both handlers into one binding. So the two presses are one key, pressed twice. Every e2e job runs on `ubuntu-24.04`; only the screen-reader jobs run on macOS. The specification says that elsewhere "it checks that `Mod-Enter` runs, which it could not before". It does not.
   Failure: delete `{ key: "Mod-Enter", run }` → E4 still passes on Linux (EXECUTED, "Ran 2 times"). On a Mac, Cmd+Enter then falls through to the default `insertBlankLine` and adds a line (EXECUTED under the Mac platform: "Ran 1 time", one line more). The whole matrix stays green. The same holds for deleting `Ctrl-Enter`.
   Fix: in E4, or a new E4b, run the two keys once more under a Mac platform. Add `await page.addInitScript(() => Object.defineProperty(Navigator.prototype, "platform", { get: () => "MacIntel" }))` before `open`, press `Control+Enter` and then `Meta+Enter`, and expect "Ran 2 times" with no new line. The probe saw that check catch both deletions. It is a test only, so it fits this small change. If it waits for a later lane-E small change, correct the specification's sentence (finding 6) and name the gap in the landing notes.
2. **Medium: neither fix has CI evidence yet** (`022i` and `022j`, "The check").
   Both checks are the next `matrix` push run. This review could not run GitHub Actions or a macOS runner. The ffmpeg step is proven here only for its download, not for `guidepup setup` on `macos-26`.
   Failure: if the setup's recording fails on the runner for another reason (for example, ffmpeg cannot capture the screen there), both `voiceover` jobs still stop before `test:sr`.
   Fix: none before the merge. The push run is the evidence. The landing notes record its counts. READ: if the recording itself fails, `@guidepup/record` throws "ffmpeg recording failed", which is a different error from run 1's ENOENT, and a new small change can drop `--macos-record`.
3. **Low: `022i`'s expected smoke count is wrong** (`022i`, "The check": "142 pass").
   In run 1, `site-add`'s `beforeAll` threw, and Bun counts that as one failing test and runs none of the file's ten. So run 1's 142 were 141 passes and 1 failure. Fixed, the file adds ten passes.
   Failure: the push run reports 151 pass, 0 fail, and the check's figure does not match it.
   Fix: "`checks` passes `test:smoke`: 151 pass, 0 fail (run 1's 141, and `site-add`'s 10)."
4. **Low: no unit test holds either workflow fix** (`tests/unit/workflow.test.ts:142`).
   `TEST_JOBS` lists `browsers`, `perf`, `voiceover` and `nvda`, not `checks`. Nothing asserts the ffmpeg step. A later edit could remove either, and only a push run would show it. INFERRED, by reading: both tests pass on HEAD's workflow as well as on the change.
   Fix: assert that `checks` needs `build` and unpacks the site, with both `test -f` checks, before its `test:smoke` step. Assert that `voiceover` runs `cd node_modules/ffmpeg-static && bun install.js` before `sr:setup --macos-record`. Both can be seen failing on HEAD's `matrix.yml` (`git show e24a04b:.github/workflows/matrix.yml`, through `parseWorkflow`).
5. **Low: `022i` changes a rule of `022` without saying so** (`022-the-test-matrix.md:703`, "`checks` … needs no build"; and l. 705's peak of 30 jobs ready at once).
   With `needs: build`, `checks` starts only after `build`. A failed build now also withholds the unit tests, `check` and `lint`, which before still reported. INFERRED: the run's wall time barely moves, since every browser job already waits for `build`.
   Fix: add to `022i`'s fix: "This replaces `022`'s 'needs no build' (l. 703). `checks` now waits for `build`, and a failed build skips it. The gate already fails on a skipped job. At most 29 jobs are ready at once."
6. **Low: `022j`'s fix overstates what a Linux run proves** (`022j`, "The fix", last sentence; E4's title, "2 of 2 run keys").
   Fix, if finding 1's Mac press is added now: "Elsewhere the two presses are one key, because CodeMirror folds `Mod-Enter` into `Ctrl-Enter`. The Mac-platform presses check each binding on its own." If it is not: "Elsewhere it presses Ctrl+Enter twice, which proves that one of the two bindings runs, not which. Neither is checked alone in CI until a Mac-platform press is added."
7. **Low: the ffmpeg binary is fetched with no integrity check** (`matrix.yml:195`).
   The locked `ffmpeg-static` fixes the release tag, `b6.1.1`, but `install.js` checks no hash. A replaced release asset would run on the runner, which `guidepup setup` grants screen-capture rights. Constitution §4.5 pins every input through `bun.lock`; this input is pinned only by tag.
   Fix: a step after it: `echo "a90e3db6a3fd35f6074b013f948b1aa45b31c6375489d39e572bea3f18336584  node_modules/ffmpeg-static/ffmpeg" | shasum -a 256 -c`. That is the darwin-arm64 binary's hash, EXECUTED here. Or record in the landing notes that the tag is the pin, and why.
8. **Low: no scorecard row is named for either change** (AGENTS.md, "Re-run the benchmark scorecard after each specification lands").
   Neither change touches an item, page, token or rendered text. INFERRED: no row moves.
   Fix: at landing, add one row to `benchmark-scorecard.md` for both: "No row moves: a workflow step and a test key; no item, page or token changes", as `025`'s row does.

## Constitution checks

- §4.1 source, not a package: no installed file changes. Met.
- §4.3 tokens are the one source: no colour or size is added. Met.
- §4.4 accessible by default, and proven: `022i` lets VoiceOver's suite run at all, and `022j` turns E4 from red to a real check on Linux. Met, with finding 1's gap on the Mac binding.
- §4.5 every input pinned: `bun.lock` is unchanged, and every install stays `--frozen-lockfile --ignore-scripts`. One locked package's own script now runs, by hand. Its binary is pinned by tag, not hash (finding 7).
- §4.6 dependencies named and pinned: no dependency is added. `ffmpeg-static` and `@guidepup/record` were already in `bun.lock`. Met.
- §5, the small-change kind: `022i` touches one workflow file, and `022j` one test. Neither changes an interface or adds a token or dependency. `022j`'s check was seen failing first (EXECUTED here, too). `022i`'s defects were seen failing in run 1 (READ, the memo). Met.
- §6: nothing committed or pushed; no code copied; no interface changes, so no changelog line is owed. Met.

## Verdict

- **022i:** Lands: both steps are sound by reading and by a local run, its check waits on the push run (finding 2), and findings 3, 4, 5, 7 and 8 are write-ins.
- **022j:** Lands: E4 now passes on Linux and failed before the fix, but finding 1's Mac-platform press is wanted, in this change or the next lane-E small change, and finding 6's sentence is corrected either way.

## Disposition

By the design lead, the author, 2026-11-16.

1. **Fixed.** A new test beside E4 runs both keys under a Mac platform. Proven by mutation: with `Mod-Enter` deleted, it fails ("Ran 1 time") and E4 still passes. `022j`'s fix and check say so.
2. **Not fixed now.** The next push run is the evidence, as the finding says. `022i`'s check names the fallback if the recording itself fails.
3. **Fixed.** `022i`'s check reads 151 pass, 0 fail.
4. **Fixed.** Two unit tests in `workflow.test.ts`. On `e24a04b`'s workflow they fail (2 fail, 19 pass); on the change, 34 pass with `release-check.test.ts`.
5. **Fixed.** `022i`'s fix states the rule it replaces, the skip and the peak of 29.
6. **Fixed,** with the wording for the case where finding 1's press is added.
7. **Fixed.** The `shasum -a 256 -c` step follows the install script, with the hash this review measured, and a unit test holds the order.
8. **Fixed.** One run-log row for `022i`, `022j` and `022k`: no row moves.

Closing verdict: both land.
