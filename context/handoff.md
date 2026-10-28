# Handoff

- **Status:** replaced at each session's end.
- **Date:** 2026-10-28

## State

Specification `002`, the primitives (forms, surfaces and feedback), is **built** and committed, in the commit that carries this handoff, tagged `v0.2.0` (the owner's decision of 2026-10-28). `001` is `33e94de`, tagged `v0.1.0`. The commit holds `002`'s 26 restyled items, the two new tokens, the stronger lint, 32 preview pages, the 0.2.0 release, and the five `context/` documents of this session (three research memos, the specification, its two reviews), all green under Bun 1.3.14: `bun run check` 1045 files 0/0, `bun run lint` pass, `bun run build` 33 + 33 + 33 pages, `bun run test` unit 348, browser 330, smoke 36 (`specifications/002-the-primitives-forms-surfaces-and-feedback.md`, Landing notes). Nothing is pushed; `plutosystemsco/design-system` does not exist on GitHub yet.

## Done this session

- `001` shown running (preview pages in both themes, a live `add` into a scratch app), then committed and tagged at the owner's request.
- The owner asked for pages and components to show: blocks. Decided with the owner (`decisions.md`, "Blocks, and they shape `002`"): blocks shape `002`, then both are built; the first set is the app shell, hero and call to action, sign in and sign up, the chat pane, plus page states and a settings form added by the session as design lead.
- Three research memos (`research/2026-10-28-*`): how blocks are declared, installed and previewed (a bare dependency never falls back to shadcn-svelte's own registry); the primitives the blocks and the home page need (41 stock items, the lint's gaps, bits-ui 2.20.2); the blocks' patterns and accessibility rules (the stock blocks' gaps; WCAG 2.2 by number; where the design book is silent).
- The split and the design calls (`decisions.md`, "The primitives split in two, and the design calls for `002`"): `002` to `006` scoped; thirteen design calls, then five after the spec review and four after the change review, all recorded with reasons. The owner may overturn any of them.
- `002` written, reviewed (15 findings, all dispositioned), amended, built with a checkpoint after the first three items, reviewed again (12 findings, all dispositioned), re-verified by the orchestrator, with two fixes of its own in the review's addendum (a flaky animation wait; a development-only error on the table page).

## Waiting on the owner

- **Deployment** to `ui.plutosystems.co`: unchanged from `001`; the owner runs the deploy under a deployment specification.
- **Still open from the design book:** the doc-ID scheme (`006`, the footer) and coloured dots on ink for the icon (whichever specification ships the icon files). `mode-watcher` is `005`'s question.
- **An upstream report to bits-ui** that a tooltip closes on the scroll that keyboard focus causes (`002` review finding 3), if the owner wants to file it.

## Known risks

- The browser suites run against the production build, so a development-only error (Svelte's dev checks) is invisible to them; the orchestrator walked every page on the dev server by hand. A later specification should make that walk a test (`002` Landing notes, note 8).
- The smoke harness's intermittent hang from `001` has not recurred (every run since the hardening clean, including all of this session's).
- Playwright's shared browser cache changed in the `001` session; other projects on an older Playwright re-download.
- `native-select`'s live stock JSON differs from the prior-art clone by one type line; provenance records the live hash.

## Next

1. **`003`, the first blocks:** hero and call to action with a feature grid, sign in, sign up, page states (empty, error, not found, loading), the settings form, and the block viewer (`/view/<block>` route with no chrome, an iframe with pixel-width presets, light and dark, a code view of the built item). Its research exists (the three memos of 2026-10-28); the blocks memo §5 lists the eight decisions it must make (item shape, page target rule, import rule, naming rule, where block source lives, `meta`, the preview route, the smoke test). The patterns memo §8 gives per-block structure, states and open questions. The `status` live-region component goes here (`002` decision 24).
2. **`004`, code and data:** `code-block` with the groove and a token highlight palette (needs a memo on Shiki's CSS-variables theme), `tabs` is done, chart, popover, accordion, toggle, toggle-group, scroll-area; the editor needs its own memo (CodeMirror 6 under Svelte 5). `wasi-python-dev`'s home page waits on this.
3. **`005`, overlays and navigation:** dropdown-menu, sheet, sidebar with `is-mobile`, breadcrumb, sonner (and the `mode-watcher` call), the chat primitives (`message-scroller` or our own).
4. **`006`, the app shell and the chat pane**, with the doc-ID owner call for the footer.
5. **`wasi-python-dev`'s home-page specification** closes `001` criterion 24 and `002` criterion 25.
