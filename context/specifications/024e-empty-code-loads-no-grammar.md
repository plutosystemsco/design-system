# 024e — Empty code loads no grammar

- **Status:** written; ready to build after `024` lands. Lands before `030`, with `024b`, `024c`, `024d` and one re-base sweep (`roadmap.md` §3, "`024` before `030`").
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

None yet.
