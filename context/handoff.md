# Handoff

- **Status:** replaced at each session's end.
- **Date:** 2026-10-31

## State

Specification `004`, code and data, is **built, committed and tagged**: `29116f1` over `fb942f8` (`003`, `v0.3.0`), tag `v0.4.0`, pushed to `plutosystemsco/design-system` on GitHub, which the owner made public on 2026-11-01 (decisions.md). The built registry JSON is now tracked, so an app installs from GitHub with no server running:

```
REGISTRY_URL=https://raw.githubusercontent.com/plutosystemsco/design-system/v0.4.0/static/r bunx --bun shadcn-svelte@1.7.1 add code-editor -y
```

`main/static/r` follows the latest. The tree holds the ten items (`code-block`, `code-editor`, `highlighter`, `use-highlighted-code`, `chart`, `meter`, `popover`, `accordion`, `toggle`, `toggle-group`), the twelve `--code-*` tokens with the `scrollbar` utility and the meter's rules in `pluto-theme`, two lint rules, ten item pages, the 0.4.0 changelog, and the session's `context/` documents: three research memos of 2026-10-31, the specification, its two reviews, the design calls in `decisions.md`. All green under Bun 1.3.14: `bun run check` 1478 files 0/0, `bun run lint` and the literal lint, `bun run build` 50 + 50 registry files and 68 pages, `bun run test` unit 442, browser 870, smoke 68 (`specifications/004-code-and-data.md`, Landing notes). Nothing is deployed to `ui.plutosystems.co`; the owner does not want that yet.

## Done this session

- Three research memos run by sub-agents: Shiki and a token highlight palette; CodeMirror 6 under Svelte 5; the data items (chart, popover, accordion, toggles, scroll area, a meter). Each labelled EXECUTED / READ / INFERRED.
- `004` specified from them, reviewed (16 findings, all fixed in the specification), built in three runs with a checkpoint after the code block, reviewed again (9 findings, all fixed), verified twice.
- The design lead's calls are in `decisions.md` ("The design calls for `004`" and its three follow-up groups): the twelve-slot palette with no new hue, code on the `muted` inset with the groove, tokens as classes never `style`, the editor with no Tab binding and the browser's own selection, a chart that carries a name and a table, `scroll-area` dropped for a `scrollbar` utility, the native `<meter>` with square ends, inverted pressed toggles, the popover as a named dialog, the wired and grooved accordion, string quotes in the string colour, no ligatures on code surfaces, the editor's fallback as a named group, the chart's hover band as `muted`, one turned caret for every disclosure.
- `001` decision 15's "not emitted" is corrected to "not emitted unless referenced": Tailwind emits an `@theme inline` variable when a scanned source file names it (decisions.md, after the `004` spec review).

## Waiting on the owner

- **Deployment** to `ui.plutosystems.co`: not wanted now (2026-11-01). The registry is read from GitHub. A deployment specification would own the 404 (`003` decision 13) and the host's older versions.
- **Still open from the design book:** the doc-ID scheme (`006`, the footer) and coloured dots on ink for the icon. `mode-watcher` is `005`'s question.
- **Completion in the editor** (`python()` with `autocompletion()`): the owner's call if the home page wants it; one import and 4.6 KB (`004` decision 21).
- **`wasi-python-dev`:** whether `/admin` is gated by Cloudflare Access or by `sign-in` (`003` decision 25). Its home page (its `005`) can now be specified: the editor, the code block, the meter, the popover and the accordion are in the registry.

## Known risks

- **Chromium only.** The editor, the meter's pseudo-elements, `scrollbar-color` and SVG `fill="var()"` were checked in Chromium (the meter also in WebKit). Firefox and Safari are `004` decision 21's placeholder memo.
- **No screen reader has been heard** over any item; the tests prove the DOM contract. `003`'s placeholder memo widens to the editor, the meter and the chart's table.
- **`bun --bun vite dev` hung once on a first start** (no listening port after "(ssr) connected" for 90 s; up in 3 s on a retry). The smoke harness started it cleanly in every full run. `001`'s intermittent hang, not investigated.
- The browser suites run against the production build; the development walk (68 pages × 2 themes, 0 errors) was done by hand again. A later specification should make the walk a test (`002` Landing note 8, still open).
- layerchart draws nothing on the server: a prerendered `/admin` shows a chart's caption and table until hydration. The chart page costs about 125 KB gzipped of JavaScript; the home page needs no chart.
- Docstrings differ between engines: Shiki colours them as comments, the Lezer Python grammar as strings. Visible on the editor page; no decision covers it.

## Next

1. **`wasi-python-dev`'s home-page specification** (its `005`): installs `code-editor`, `code-block`, `meter`, `popover`, `accordion`, `hero` and `page-states` from this registry; closes `001` criterion 24, `002` criterion 25, `003` criterion 28 and `004` criterion 26. `004` Landing note 6 lists what the app should know.
2. **`005`, overlays and navigation:** dropdown-menu (on `popover`'s chrome), sheet, sidebar with `is-mobile` and the `scrollbar` utility, breadcrumb, sonner (and `mode-watcher`), the chat primitives, a `field-sizing` support memo for the composer.
3. **`006`, the app shell and the chat pane:** the lockup and the orbit-assemble entrance; the footer needs the doc-ID owner call; `code-block` at `sm` in messages and the hook for streamed code; the `status` item and the view machinery are ready.
4. **Placeholder memos when there is time:** Firefox and Safari over the code surfaces; a screen-reader pass; `ansi` output with its 32 slots if an app needs terminal colour.
