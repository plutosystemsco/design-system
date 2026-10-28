# Handoff

- **Status:** replaced at each session's end.
- **Date:** 2026-10-28

## State

Specification `003`, the first blocks, is **built** and committed, in the commit that carries this handoff, tagged `v0.3.0` (the owner's decision of 2026-10-28). `002` is `7857ea4` (`v0.2.0`); `001` is `33e94de` (`v0.1.0`). The commit holds `003`'s five blocks (`hero`, `sign-in`, `sign-up`, `page-states`, `settings`), two new items (`status`, `error-summary`), the block viewer, 58 prerendered pages, the 0.3.0 release, and this session's `context/` documents for `003` (the specification, its two reviews, the decisions), all green under Bun 1.3.14: `bun run check` 1120 files 0/0, `bun run lint` and the literal lint pass, `bun run build` 40 + 40 registry files and 58 pages, `bun run test` unit 384, browser 716, smoke 52, twice in a row (`specifications/003-the-first-blocks.md`, Landing notes). Nothing is pushed; `plutosystemsco/design-system` does not exist on GitHub.

## Done this session

- `001` shown running, committed and tagged. `002` (26 primitives, two tokens, the stronger lint, 0.2.0) specified, reviewed twice, built, verified and committed and tagged, all at the owner's request. See `decisions.md` for the owner's and the design lead's calls.
- `003` specified from the three memos of 2026-10-28, reviewed (14 findings), amended, built with a checkpoint after the viewer and sign-in, reviewed again (7 findings), fixed, re-verified by the orchestrator (two full runs, a dev-mode walk of 80 page loads with 0 errors, and a visual pass of the views at 360, 768 and 1280 in both themes).
- Design-lead calls for `003` are in `decisions.md` ("The design calls for `003`, the first blocks"), including those made after each review: the password minimum of 15, the 32 px code cells on phones, `error-summary` as one item, honest copy, failures named per form, the caret on the details toggle, heading ranks, the settings delete as `secondary`, the inverted pressed preset.
- Blocks install without `-o` (`003` decision 3); the site, the README and the block pages say so.

## Waiting on the owner

- **Deployment** to `ui.plutosystems.co`: unchanged; the owner runs the deploy under a deployment specification. Note that a real 404 status on the host needs `not_found_handling` in `wrangler.jsonc` and the adapter's fallback, which that specification decides (`003` decision 13).
- **Still open from the design book:** the doc-ID scheme (`006`, the footer) and coloured dots on ink for the icon. `mode-watcher` is `005`'s question.
- **`wasi-python-dev`:** whether `/admin` is gated by Cloudflare Access or by the `sign-in` block is that app's call (`003` decision 25).
- **An upstream report to bits-ui** about tooltips closing on keyboard-caused scroll (`002`), if wanted.

## Known risks

- The browser suites run against the production build and cannot see a development-only Svelte error; the orchestrator walked every page on the dev server by hand after `002` and `003`. A later specification should make that walk a test (`002` Landing note 8).
- A screen-reader pass (VoiceOver, NVDA) of the blocks has not been done; `003` leaves it as a placeholder memo. axe and the keyboard suites pass; they are not a screen-reader test.
- The smoke harness's intermittent hang from `001` has not recurred.
- `native-select`'s live stock JSON differs from the prior-art clone by one type line; provenance records the live hash.

## Next

1. **`004`, code and data:** `code-block` with the groove and a token highlight palette (a memo on Shiki's CSS-variables theme first), chart, popover, accordion, toggle, toggle-group, scroll-area; the editor needs its own memo (CodeMirror 6 under Svelte 5). `wasi-python-dev`'s home page waits on this.
2. **`005`, overlays and navigation:** dropdown-menu, sheet, sidebar with `is-mobile`, breadcrumb, sonner (and `mode-watcher`), the chat primitives (`message-scroller` or our own), a `field-sizing` support memo for the composer.
3. **`006`, the app shell and the chat pane:** the lockup and the orbit-assemble entrance live here; the footer needs the doc-ID owner call. The hero (`003`) lands at `/hero` and the error page under `/page-states`; the app moves them to its root.
4. **`wasi-python-dev`'s home-page specification** closes `001` criterion 24, `002` criterion 25 and `003` criterion 28.
