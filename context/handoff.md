# Handoff

- **Status:** replaced at each session's end.
- **Date:** 2026-11-01

## State

`004` is **built, committed and tagged** `v0.4.0` (`b3d2a8e`), pushed to `plutosystemsco/design-system` on GitHub, public since 2026-11-01. An app installs from GitHub with no server running:

```
REGISTRY_URL=https://raw.githubusercontent.com/plutosystemsco/design-system/v0.4.0/static/r bunx --bun shadcn-svelte@1.7.1 add code-editor -y
```

Nothing is deployed to `ui.plutosystems.co`; the owner does not want that.

**`005` is built, reviewed, committed and tagged** `v0.5.0` (`616b8a0`), pushed on 2026-11-01: the eleven items, the change review's nine findings fixed, the Landing notes written. `REGISTRY_URL=https://raw.githubusercontent.com/plutosystemsco/design-system/v0.5.0/static/r` installs them.

**`006` and `007` are specified and reviewed**, both "fit to build" once their predecessor is built: `006` (the app shell and the chat pane, the mark's entrance, the footer's furniture; 18 review findings fixed) and `007` (the full highlight palette of 21 slots across 26 languages, `code-languages`, the ink surface; 11 findings fixed). Their design calls are in `decisions.md`. The owner's rulings of 2026-11-01 bind `007`: syntax highlighting is a function outside the colour budget, across every major language.

The review checklist gained R23 (copy says what happens) and R24 (furniture carries information) on 2026-11-01 at the owner's word.

## Done this session (2026-11-01)

- The registry published through GitHub raw URLs; the repository made public; `static/r` tracked.
- Four research memos for `005` and `006`, the two specifications, their reviews, all 35 findings fixed.
- `005` run 1 built to its checkpoint and accepted; run 2 launched.
- Two research memos for `007` (the full palette; the ink surface), the specification, its review, 11 findings fixed.
- The owner's decisions recorded: the doc-ID scheme `PS-<series>-<NNNN>`, the public-benefit sentence as an empty-by-default prop, the theme mechanism left to the design lead, no deployment, the highlighting ruling, R23 and R24.

## Waiting on the owner

- **Commit and tag `v0.6.0` and `v0.7.0`** in turn when each lands; asked each time. The app pins the tag it needs; it asked for `006`'s and `007`'s work "in a tagged release".
- **Deployment** to `ui.plutosystems.co`: not wanted now.
- **The design book §03** gains one line for the highlighting ruling (the book's repository, the owner's).
- **Coloured dots on ink** for the icon (`006` leaves the favicon to the app's `app.html`).
- **`wasi-python-dev`:** its restyle waits on `v0.7.0`; `/admin`'s gate (`003` decision 25).

## Known risks

- **Chromium only.** The editor, the meter's pseudo-elements, `scrollbar-color` and SVG `fill="var()"` were checked in Chromium (the meter also in WebKit). Firefox and Safari are `004` decision 21's placeholder memo.
- **No screen reader has been heard** over any item; the tests prove the DOM contract. `003`'s placeholder memo widens to the editor, the meter and the chart's table.
- **`bun --bun vite dev` hung once on a first start** (no listening port after "(ssr) connected" for 90 s; up in 3 s on a retry). The smoke harness started it cleanly in every full run. `001`'s intermittent hang, not investigated.
- The browser suites run against the production build; the development walk (68 pages × 2 themes, 0 errors) was done by hand again. A later specification should make the walk a test (`002` Landing note 8, still open).
- layerchart draws nothing on the server: a prerendered `/admin` shows a chart's caption and table until hydration. The chart page costs about 125 KB gzipped of JavaScript; the home page needs no chart.
- Docstrings differ between engines: Shiki colours them as comments, the Lezer Python grammar as strings. Visible on the editor page; no decision covers it.

## Next

1. **Build `006`** in two runs with a checkpoint after step 3 (the entrance and the shell's header); change review; landing; 0.6.0.
2. **Build `007`** per its build order with the checkpoint after step 3 (the gallery's teal against cyan; the surface); change review; landing; 0.7.0.
3. **Placeholder memos when there is time:** Firefox and Safari over the code surfaces and the ink surface; a screen-reader pass; `ansi`.
