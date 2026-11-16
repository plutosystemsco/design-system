# 024d — The theme page loads no editor until it is used

- **Status:** written; ready to build after `024` lands. Lands before `030`, with `024b`, `024c`, `024e` and one re-base sweep (`roadmap.md` §3, "`024` before `030`").
- **Date:** 2026-11-16
- **Author:** the design lead
- **Kind:** small change (AGENTS.md: a fix with no interface change, no new token or dependency, in one place). No research memo and no spec review. Its check is seen failing first, and the built change is reviewed by someone who did not write it (constitution §5).
- **Depends on:** `024` (budgets per template). Lane: the theme item's examples, `src/lib/site/examples/kuiper-theme/`.
- **Found by:** `024`'s build sweep (Landing notes, ruling 1) and its change review, finding 5 (`reviews/024-budgets-per-template-pr-2026-11-16.md`).

## The defect

`/components/kuiper-theme/` transfers **760 kB**, the heaviest page on the site (`024`'s sweep, EXECUTED). About a third of it is one example.

Its "An ink surface" example (`src/lib/site/examples/kuiper-theme/surface.svelte`, the `CodeEditor` import at l. 14 and its use at l. 44) mounts a live `CodeEditor` to show the editor's ground on the ink surface. On load that fetches the 117.7 kB CodeMirror chunk and 150.5 kB of tree-sitter: the runtime and the Python grammar (EXECUTED, the change review's probe).

The theme item's job is not live highlighting (`024` decision 5). So:

- The page sits in `LIVE_HIGHLIGHT` and `WASM_ALLOWED` by the design lead's ruling at `024`'s landing, **pending this change**.
- Its 760 kB sets `component-live`'s budget at 840 kB. That leaves `code-editor` 84 kB of headroom, `highlighter` 298 and `use-highlighted-code` 400.
- A reader pays for an editor they may never touch.

## The fix

The example shows the same thing without loading the editor on load. One of these, the builder's choice, recorded in the Landing notes:

1. **Mount on interaction.** The example shows the code as a static, prerendered, highlighted block on the surface (the code ground equals the surface, as now). The editor mounts when the reader focuses the block or presses an "Edit" button, and it then loads CodeMirror and the highlighter.
2. **A static specimen.** The example shows a prerendered highlighted block and a still picture of the editor's ground, with no editor on the page.

The example's words keep saying what the reader sees. The `keyboard-fixture` and the overlays inside the surface keep working; any browser test that reads the editor is updated to mount it first.

## The check

1. **Seen failing first:** in `tests/e2e/budgets.ts`, `kuiper-theme` leaves `LIVE_HIGHLIGHT` and `WASM_ALLOWED`. `024 transfer: component` (or `component-heavy`, see 3) fails, naming the page's 2 `.wasm` requests. The output goes in the Landing notes.
2. After the fix, the page fetches no `.wasm` on load, in any frame, and that transfer test passes on the `.wasm` rule.
3. **Its template.** The page should fall to about 490 to 610 kB (the change review's estimate). Over 455 kB it belongs in `HEAVY` (`024` decision 3), which changes only by a ruling with its measurement. If it lifts `component-heavy`'s budget far above `chart`'s 530 kB, the design lead may give it a one-page template, as `index` has. The Landing notes record the measurement and the ruling.
4. **The re-base.** `component-live`'s budget falls to its next heaviest page (`code-editor`, 655.8 kB, so about 725 kB) at the re-base sweep that follows `024b`, `024c`, `024d` and `024e`. A fall needs no ruling (`024` decision 4).

The perf project, `bun run check` and the `light` and `dark` browser projects stay green.

## Landing notes

None yet.
