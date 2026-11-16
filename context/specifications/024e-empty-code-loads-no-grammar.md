# 024e — Empty code loads no grammar

- **Status:** landed on `release/0.13.0` 2026-11-16, with `022a`, `022e` and `024e` in one merge. The change review (`reviews/022ae-024e-lane-i-small-changes-pr-2026-11-16.md`) said land; its findings are dispositioned there. The re-base sweep that follows `024b` to `024e` records the page's move, before `030` (`roadmap.md` §3, "`024` before `030`").
- **Date:** 2026-11-16
- **Author:** the design lead
- **Kind:** small change (AGENTS.md: a fix with no interface change, no new token or dependency, in one item). No research memo and no spec review. Its check is seen failing first, and the built change is reviewed by someone who did not write it (constitution §5).
- **Depends on:** `024` (budgets per template). Lane I: the `use-highlighted-code` item, `src/lib/registry/hooks/use-highlighted-code.svelte.ts`.
- **Found by:** `024`'s build sweep (Landing notes, ruling 1) and its change review, finding 5 (`reviews/024-budgets-per-template-pr-2026-11-16.md`).

## The defect

`useHighlightedCode` loads its language's grammar as soon as the language is set, even while the code is empty. Its effect calls `loadHighlighter(lang)` whenever `language()` changes, and never reads `value()` first (`use-highlighted-code.svelte.ts`, the first `$effect`, l. 40–56).

So any `CodeBlock` given a `language` and empty `code` fetches the tree-sitter runtime and a grammar on load. The `highlighter` page shows it. Its "In the browser" example says "Nothing here moves until you press Start" and "Python's grammar loads on first use" (`src/lib/site/examples/highlighter/variants.svelte`, the `intro` and the comment above `shown`). Both are false: the example renders `CodeBlock.Content` with `language="python"` and `code` empty, and the page fetches the runtime and the Python grammar on load, 150.5 kB of its 542 (EXECUTED, the change review's probe).

The effects:

- **An app pays for a grammar before it has code to colour.** A streaming block that waits for its first chunk loads the grammar at mount, not at the chunk.
- **The `highlighter` page sits in `LIVE_HIGHLIGHT`** by the design lead's ruling at `024`'s landing, **pending this change**. Without the two files it is about 392 kB, inside `component`.
- **The example's words are untrue.**

## The fix

The hook loads nothing while the code is empty. Its effect reads `value()`, and calls `loadHighlighter(lang)` only once the code is non-empty for that language. After that, emptying the code again does not unload anything, and a change of language with non-empty code loads the new grammar as now. The hook's return value and its types do not change. The changelog says what an installed app sees: the grammar now loads at the first non-empty code, not at mount.

## The check

1. **A unit or browser test of the hook,** seen failing first: mounted with a language and empty code, it requests no grammar; given non-empty code, it requests the grammar once. The output goes in the Landing notes.
2. **The page, seen failing first:** in `tests/e2e/budgets.ts`, `highlighter` leaves `LIVE_HIGHLIGHT` and `WASM_ALLOWED`. `024 transfer: component` fails, naming the page (its 2 `.wasm` requests and its 542 kB). After the fix, the page fetches no `.wasm` on load, joins `component`, and passes.
3. **The re-base.** Nothing in `component-live`'s budget moves (`kuiper-theme` sets it until `024d`). The page's move is recorded at the re-base sweep that follows `024b`, `024c`, `024d` and `024e`. A fall needs no ruling (`024` decision 4).

The perf project, `bun run check`, the `light` and `dark` browser projects and the smoke test stay green.

## Landing notes

Built 2026-11-16 by a lane-I builder, on `release/0.13.0` at `1a116a4`, with `022a` and `022e` after it in the same worktree, one commit each. The owner was asleep; no question was asked.

### The fix

`useHighlightedCode` derives `empty` (`value() === ""`), and its load effect returns before `loadHighlighter(lang)` while `empty` is true. The effect reads the derived boolean, not the code, so it re-runs when the code starts or stops being empty and at a change of language, not at every streamed chunk (a re-run at each chunk would cancel the load in flight). Emptying the code again unloads nothing: `loaded` is kept, and `loadHighlighter` returns its cached promise. `settled` is also true while the code is empty, since nothing then loads; without that a block with a language and no code would stay `data-highlight="pending"` until its first chunk. The hook's signature and types do not change. The changelog's 0.13.0 entry has a `use-highlighted-code` bullet.

### Seen failing first, on the build of `1a116a4`

1. **The browser test** (`code.spec.ts`, "the gallery", "024e. on load the highlighter page fetches no .wasm; Start fetches the runtime and Python's grammar once each, and the block colours"), written first: failed in `chromium-light`, `firefox-light` and `webkit-light`, each on its soft check, ".wasm requests on load": received `["web-tree-sitter.dvFfgEi9.wasm", "tree-sitter-python.BlcJAWGl.wasm"]`, expected `[]`. The rest of the test passed: after Start, those two files, once each.
2. **The page** (check 2): with `highlighter` out of `LIVE_HIGHLIGHT` and `WASM_ALLOWED`, the perf project (`E2E_PREBUILT=1 bun --bun playwright test --project=perf --no-deps`) failed `024 transfer: component` alone, naming the page twice: "pages over component's 445 kB: /components/highlighter/: 532.1 kB over 445; largest: web-tree-sitter.dvFfgEi9.wasm 82.6 kB, tree-sitter-python.BlcJAWGl.wasm 67.9 kB, …" and "pages that fetch .wasm: /components/highlighter/: 2 .wasm, not in WASM_ALLOWED". 24 passed.

### After the fix

- The browser test passes in all six projects. `code.spec.ts` whole, in all six projects (4 workers): **234 passed**, 0 failed. The two that failed are `022f`'s ledgered E7 lines in `firefox-light` and `firefox-dark`, which failed as their lines say.
- **The highlighter page: 532.1 kB with 2 `.wasm` → 359.3 kB with 0** (−172.8 kB; the review's estimate was about 392). It joins `component`, under its 445 kB.
- **`use-highlighted-code` also fetches no `.wasm` on load now: 429.1 kB with 2 → 323.7 kB with 0.** Its page streams JSON from empty code on Start, as the highlighter page does, so the same defect put it in `LIVE_HIGHLIGHT`. **The builder's ruling:** it leaves `LIVE_HIGHLIGHT` and `WASM_ALLOWED` with `highlighter`, since decision 5 names the pages whose main frame loads tree-sitter on load, and its paint (868 to 900 ms) and weight fit `component`. A fall, so no ruling is needed by `024` decision 4; the design lead may reverse it at the re-base. `LIVE_HIGHLIGHT` is now `code-editor` and `code-languages`.
- **`component-live` falls, with no ruling, and is not re-based** (as at `024d`). The unit test that a template's figures are its own pages forced its LCP figure off `highlighter`: it takes the next slowest page of `024`'s same build sweep, `code-editor`'s **912 ms**, so its LCP budget goes 1,260 → **1,010 ms**. Transfer (`code-editor` 655.8 kB, 725) and CLS (`code-editor` 0.003, 0.02) do not move. No page was re-measured to set it; the re-base sweep after `024b`, `024c`, `024d` and `024e` re-measures every template, and records the two pages' move.
- **The perf project** on the fixed build, with both pages moved: **24 passed**, 0 failed (5.2 minutes; one paint test fewer, since `use-highlighted-code` is no longer a probe). `code-editor` 645.8 kB, LCP 916 to 920 ms; `code-languages` 643.4 kB, 880 to 912 ms, both under 1,010. `sidebar` 395.3 kB is still `component`'s heaviest.
- `bun test tests/unit/budgets.test.ts`: 60 pass, 0 fail. `bun run check`: 0 errors, 0 warnings (2,377 files). Lint clean. The unit suite (`bun test ./tests/unit --timeout 120000`): **1,801 pass, 0 fail**.
- **The cost** (`025`'s Landing notes, ruling (a)): the cost unit test named 6 size-stale items (`code-block`, `use-highlighted-code`, `stage-card`, `live-console`, `chat`, `product-home`), and `bun run cost --sizes-only` rewrote their sizes, runtime figures kept. Each grows by about 20 bytes of JS: `use-highlighted-code` 11,171 → 11,194 (brotli 9,963 → 9,984), `code-block` 25,566 → 25,587. The cost test then passed, 40 of 40.
- `static/r/` and `static/v0.13.0/r/` regenerated by the build (`use-highlighted-code.json`); the thumbnails' manifest rewritten with `--hash-only` (6 hashes; no picture changed).
- **The scorecard** is not re-run for this change alone: the design lead's ruling at `024d` (its review, finding 7) runs it with the re-base sweep for the `024b`–`024e` set.

### The merge, for `024e`, `022a` and `022e` (2026-11-16)

The three landed together, after their change review (`reviews/022ae-024e-lane-i-small-changes-pr-2026-11-16.md`), in one merge of `worktree-agent-a3f878ca5d391520b` into `release/0.13.0` at `48c85ca`. The merge ran in a cloud session: Linux, 4 cores, Chromium 153 through a scratch browsers path, since the pinned Playwright 1.64.1 expects Chromium 156. Firefox and WebKit were not run; push B's `matrix` run gives them.

- **Three conflicts, each ledger-ruled.** `tests/fault-ledger.ts` takes both removals: the release had removed `022b` to `022d`'s lines, this branch `022a`'s and `022e`'s. It now holds `022f`'s 2 lines. `scripts/cost/report.json` takes the release's copy, then `bun run cost --sizes-only` rewrote the 9 size-stale items (`sidebar` 45,687 B, `app-shell` 85,452 with the toaster, `use-highlighted-code` 11,194; runtime figures kept). The writer's compact JSON replaces the release copy's expanded form; the values differ only in those items and the catalogue (379,006 → 379,202 B). `src/lib/site/thumbnails/manifest.json` takes the release's copy, then `thumbnails.ts --hash-only` rewrote it (83 items; no picture changed).
- **One test the merge broke, and its answer.** `api-table.spec.ts`, "at 1440 › no API table scrolls sideways", failed on `/components/dropdown-menu/ DropdownMenuSubContent: 628`. `022a` re-declares `escapeKeydownBehavior`, and the Name cell never breaks. The builder's base had the test, but `022a`'s run did not include it. The table joins `WIDE_AT_1440` with its reason, and `023b` (a small change in lane S) lets a name break between its words and empties the list again.
- **On the merged tree:** `bun run build` exit 0; `bun run check` 0 errors, 0 warnings, 2,429 files; lint clean; `bun test ./tests/unit` 1,855 pass, 2 skip, 1 fail. The fail was `highlight-session.test.ts`'s streaming budget, 4.56 ms against 4 under the full suite's load; alone it passed 3 of 3. `release-check --before-ci` exit 0, skipping its four CI and instrument checks by name.
- **Browser runs, `chromium-light` and `chromium-dark`:** `keyboard`, `code`, `navigation`, `api-table` and `primitives`, 4 workers, after the `api-table` answer: **494 passed, 6 failed.** The 6 are `code.spec.ts`'s E4 (the run keys: "Ran 1 time" for 2), E6 at full height (the editor and the block disagree after the edits) and E7 (the editor's budgets), in both schemes. **They fail the same way on the release before the merge** (`48c85ca`, built in a scratch worktree, run alone), so nothing here causes them. This machine is slower than the instrument and runs an older Chromium. E4 may still be a Linux fault: the run keys are `Mod-Enter`, which is Ctrl on Linux. Push B's `matrix` run, on Linux, decides whether they are ledger lines.
- **Not re-measured:** the perf project and the runtime cost figures. Both are kept to one machine; the re-base sweep and the tag's cost run measure them there.
