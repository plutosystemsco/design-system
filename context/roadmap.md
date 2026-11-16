# Roadmap: Kuiper from 0.13.0 to 1.0

- **Status:** in force. Re-ranked after every specification lands (§4). Release contents past 0.13.0 and spec numbers past `031` are provisional.
- **Date:** 2026-11-15
- **Author:** the design lead
- **Stands on:** [the benchmark scorecard](research/benchmark-scorecard.md), [the component inventory](research/2026-11-15-component-inventory.md), [the page standard](research/2026-11-15-component-page-standard.md), [toasts](research/2026-11-15-toasts.md), [the older-rules audit](research/2026-11-15-older-rules-audit.md), [scoped schemes](research/2026-11-15-scoped-schemes-and-contrast.md), [the site-polish synthesis](research/2026-11-15-site-polish-synthesis.md), the `prior-art-*` memos, and [`handoff.md`](handoff.md)'s 0.13.0 list.
- **Governed by:** constitution §4.2. A component is added when this file ranks it. Its specification cites the rank and the evidence.

Two superseded readings. The inventory's toast advice ("keep it declined") and its §4.2 framing ("each specification names the app that needs it") no longer hold. The owner ruled toasts in, and breadth now follows this roadmap (the owner, 2026-11-15).

## 1. Where Kuiper stands

The first scorecard run is at `ea1f9bd` (0.12.0, after `018`). Scores run 0 to 4. "Best" is the highest of the seven references. The 1.0 target is what this roadmap commits to.

| # | Dimension | Kuiper now | Best reference | 1.0 target | How the target is reached |
|---|---|---|---|---|---|
| 1 | Component breadth | 3 | 4 (Spectrum) | **4** | Toast and batch A reach 35 of 40; batches B to E reach 39 |
| 2 | Guidance depth | 2 | 3 (four systems) | **4** | Doc comments, then the page standard on every page |
| 3 | Accessibility evidence | 1 | 3 (Carbon) | **4** | All eight criteria, from the test matrix |
| 4 | Theming | 2 | 4 (Material, Primer, Radix) | **4** | Scoped schemes, high contrast, a compact density |
| 5 | Tokens | 1 | 4 (Primer) | **4** | DTCG, descriptions in the file, a lifecycle record, two outputs |
| 6 | Navigation and search | 4 | 3 | **4** | Hold |
| 7 | The part first | 2 | 4 (Material, Radix, GOV.UK) | **3** | The stage above y = 500; 4 is a stretch (§5) |
| 8 | Page weight and paint | 4 | 4 (GOV.UK) | **4** | Hold, under per-template budgets |
| 9 | Code examples | 3 | 3 | **4** | A sandbox link and generated controls |
| 10 | Install and adoption | 3 | 4 (five systems) | **4** | A designer's way in, made of code |
| 11 | Change communication | 2 | 3 (Carbon, Primer, GOV.UK) | **4** | Migration guides, generated notes, a public "upcoming" list |
| 12 | Design tooling | 0 | 4 (Primer) | **2** | Tokens as design variables, and a theme lab. No library, by ruling |
| 13 | Reach | 1 | 3 (Carbon, Material, Spectrum) | **3** | Right-to-left and translatable strings. Components stay Svelte |
| 14 | Governance | 2 | 4 (Carbon, Primer) | **3** | A breaking-change rule and deprecation. No status mark, by ruling |
| 15 | Component cost (proposed) | 0 | not yet scored | **4** | Measured per item, budgeted, published (`025`) |
| | **Total of rows 1–14** | **30** | 41 (Primer) | **51** | |

Two rows are capped by the owner's rulings, not by effort. Design tooling stops at 2: there is no design-tool kit. Governance stops at 3: there is no lifecycle mark per item.

The scorecard reads only Button and Dialog for rows 2, 7 and 8. So the roadmap also tracks two whole-catalogue numbers: **page-standard coverage**, the share of each page's applicable sections that pass their check (about 30% today), and the **accessibility status pass count**, items with every check green.

## 2. The releases

Five releases. Each has one theme.

| Release | Theme | Specs | Rows 1–14 after |
|---|---|---|---|
| 0.13.0 | Kuiper, proven | `020`–`031` | 41 |
| 0.14.0 | The page standard, and choosing from lists | `032`–`040` | 43 |
| 0.15.0 | Data pages, guidance everywhere, governance | `041`–`050` | 46 |
| 0.16.0 | Reach, and a designer's way in | `051`–`057` | 51 |
| 1.0.0 | Stable | `058`–`061` | 51, held |

### Lanes

A **lane** is a set of files that only one build may change at a time. Specs in different lanes run at once. Specs in the same lane run in sequence.

- **T, tokens:** `tokens/`, `scripts/build-tokens.ts`, `scripts/tokens.ts`, `src/app.css`, the theme item and the `theme` item.
- **I, existing items:** the source of an item that already exists, under `src/lib/registry/`.
- **S, site chrome:** `src/lib/site/page/`, `site.css`, the layout, `sitemap.ts`'s structure, the frames.
- **E, test harness:** `playwright.config.ts`, `scripts/a11y/`, CI, the bench and cost scripts.
- **N, new items:** a new item's own folder, examples and page. Two new-item specs never share a lane.

A **ledger file** is a file every spec appends to: `registry.json`, `CHANGELOG.md`, the sitemap's entries, the release's migration guide, the generated `static/r/`, and the generated `src/lib/site/listed-items.ts` (from `024b`: a conflict takes either side whole, then `bun run build:registry`). Builds may run at once. Their ledger edits land one at a time, in landing order, and `static/r/` is regenerated at each landing. Since `025`, `scripts/cost/report.json` and `scripts/cost/budgets.json` are ledger files too: never hand-merged. A landing takes the base's copies and regenerates them, with `bun run cost --sizes-only` for changed items, and with `bun run cost --only <item>` then `bun run cost --budget <item>` for a new item (`025`'s rulings at landing).

### 0.13.0: Kuiper, proven

The new name in code. Evidence across three engines and two screen readers. Tokens anyone can read. The toast.

| Spec | Scope, in one line | Lanes | Depends on | Moves |
|---|---|---|---|---|
| `020` the Kuiper rename | `pluto` → `kuiper` in the registry name, the theme item, context keys, the token file, the storage key and the package; one "Upgrade to 0.13.0" guide page; a redirect for each moved URL | all | the `v0.12.0` tag | 11: 2 → 3 (migration page) |
| `020a` the site's CSS reads only code | Small change: `@source not "../context"` in `src/app.css`, so prose and exhibits never add rules to the site's CSS | T (one line) | `020`; lands before `021`, whose CSS check is byte-identical | 8: held |
| `020b` the guide's renames fit the column | Small change from `020`'s checkpoint: the upgrade guide's five-column rename table (1,053 px in a 608 px column) becomes one block per rename | S (one page) | `020a` | — |
| `023a` API types break between words | Small change from `027a`'s change review: the API table's Type cell uses `break-words`, not `wrap-anywhere`, so type names never break mid-word once `023` widens every table | S (one component) | `027a`; lands before `023` | — |
| `024b` the site stops shipping the whole registry | Found by `026`'s and `027a`'s builds: `sitemap.ts` and `items.ts` import `registry.json` whole, so every new item adds about 0.6–0.9 kB to every page. Small change ([spec](specifications/024b-the-site-stops-shipping-the-whole-registry.md)): `build:registry` writes a slim `listed-items.ts` (name, title, description, group), and `site.ts` reads `{ version }` from `package.json`. Measured: about 11.6 kB gzipped off every page | S | `024` | 8: held |
| `024c` two component page headers hold still | Small change from `024`'s change review, finding 4 ([spec](specifications/024c-component-headers-hold-still.md)): `label` (CLS 0.09) and `native-select` (0.087) re-wrap a header line after hydration, which sets `component`'s CLS budget at 0.108, above Core Web Vitals' 0.1 "good" line | S | `024`; before `030` | 8: held |
| `024d` the theme page loads no editor until it is used | Small change from `024`'s change review, finding 5 ([spec](specifications/024d-the-theme-page-loads-no-editor.md)): the theme page's ink-surface example mounted a `CodeEditor` on load, 268 kB of its 760 (CodeMirror and tree-sitter). **Landed:** a static highlighted specimen; the page 760.9 → 462.1 kB with no `.wasm`, in a ninth template of its own, `kuiper-theme` (510 kB, 1,490 ms) | the theme item's examples | `024`; before `030` | 8: held |
| `024e` empty code loads no grammar | Small change from `024`'s change review, finding 5 ([spec](specifications/024e-empty-code-loads-no-grammar.md)): `useHighlightedCode` loads its grammar for empty code, so the `highlighter` page fetches tree-sitter on load. Load at the first non-empty code. **Landed** 2026-11-16, with `022a` and `022e` in one merge: the page 532.1 → 359.3 kB, no `.wasm` on load | I | `024`; before `030` | 8: held |
| `024f` example source off the page's first paint | Found by `024d`'s review: each example's highlighted source is prerendered into the page's HTML and again into its hydration data, 44% of the theme page's gzipped HTML; first paint tracks those bytes. Keep the source findable as plain text (`hidden="until-found"`), fetch the highlighted fragment when its details first open, take the tokens out of the hydration data. About 35 kB gzipped and 150 ms of first paint off the theme page, less on every component page. A full spec in lane S; the code-line class string is a separate lane I item | S | `024b`–`024e`, the re-base sweep | 8: held |
| `024g` the theme's fonts fall back without a shift | Found by `024c`'s review: apps that install `kuiper-theme` still see a font swap shift (the site's own fix is a preload). Metric-matched fallback faces (`size-adjust` and the `-override` descriptors) for Geist, IBM Plex Sans and JetBrains Mono in the theme, calibrated on real text, not letter frequency (measured: 103% against the 105.49% the frequency method gives); its check is the face-missing variant on Linux. Changes `--font-sans` and the theme CSS apps install: a spec, not a small change | T | `031` (lane T order) | 8: held |
| `024h` the landings' face preload goes first | Found by `024c`'s review: the home page and the four landings preload IBM Plex after 51–52 module preloads, as component pages did before `024c`. CLS is 0–0.005 today, so nothing fails; move the preload ahead through `024c`'s `preloadFor` | S (one hook) | `024c` | — |
| `022h` the sidebar's content is a stop only when it scrolls | Small change from the lane-I change review, findings 3 and 4 ([spec](specifications/022h-the-sidebars-content-is-a-stop-only-when-it-scrolls.md)): since `022e` a text-only `SidebarContent` takes `tabindex="0"` even when it does not scroll; a `ResizeObserver` adds the overflow to the test | I | `022e`; after the re-base sweep | — |
| `023b` API names break between words | Small change from the lane-I merge ([spec](specifications/023b-api-names-break-between-words.md)): `022a`'s `escapeKeydownBehavior` widens `DropdownMenuSubContent`'s table to 628 px at 1440; a `<wbr>` between a camelCase name's words, then `WIDE_AT_1440` empties again | S (one component) | `023a` | — |
| `022i` the matrix workflow's two missing steps | Small change from the first `matrix` run ([memo](research/2026-11-16-the-first-matrix-run.md), groups 10 and 11; [spec](specifications/022i-the-matrix-workflows-two-missing-steps.md)): `checks` takes the built site for the smoke test; `voiceover` fetches and checks `ffmpeg-static`'s binary | E | `022` | — |
| `022j` the editor's run keys on every platform | Small change, group 1 ([spec](specifications/022j-the-editors-run-keys-on-every-platform.md)): E4 presses `Mod-Enter` on every platform, and a Mac-platform test tells the two run bindings apart | E (a test) | `022` | — |
| `022k` the editor's edits wait for the cursor | Small change, group 3 ([spec](specifications/022k-the-editors-edits-wait-for-the-cursor.md)): E6 types only once Ctrl+End has moved the cursor to the end | E (a test) | `022` | — |
| `022l` the screen-reader jobs in shards | A spec from the third matrix run ([memo](research/2026-11-16-the-third-matrix-run.md), §3; [spec](specifications/022l-the-screen-reader-jobs-in-shards.md)): three shards per reader and browser pair, a 40-minute deadline inside 45, the `list` reporter in CI. The owner chose shards (2026-11-16) | E | `022`, `022i` | 3: (h) waits on speech verdicts |
| `022m` the code editor binds Enter | Small change from the WebKit-on-Linux probes ([memo](research/2026-11-16-webkit-on-linux.md); [spec](specifications/022m-the-code-editor-binds-enter.md)): a read-only-safe newline at the lowest precedence, so WebKit no longer writes two line breaks | I | `022` | — |
| `022n` the search field hides WebKit's cancel button | Small change, same memo ([spec](specifications/022n-the-search-field-hides-webkits-cancel-button.md)): `display: none`, so Linux WebKit shows one clear button | I | `027b` | — |
| `022o` the WebKit tests that assumed macOS or a moment | Small change, same memo ([spec](specifications/022o-the-webkit-tests-that-assumed-macos-or-a-moment.md)): six tests; `onlyIn` and `adaptsIn` take a platform | E (tests) | `022` | — |
| `020c` the guide's inline code stays in its column | Small change from the fourth matrix run ([memo](research/2026-11-16-the-fourth-matrix-run.md), §2; [spec](specifications/020c-the-guides-measure-reads-line-fragments.md)): inline code's cloned padding ran up to 5 px past the column; it becomes `inline-block max-w-full wrap-anywhere` with a hairline's negative block margin, and the column test keeps its 1 px | S (one page) | `020b` | — |
| `022p` the keyboard walk waits for the editor's focus | Small change, same memo ([spec](specifications/022p-the-keyboard-walk-waits-for-the-editors-focus.md)): the ring check waits, up to 60 frames, for CodeMirror's `cm-focused` mark, set from a 10 ms timer after focus | E (a test) | `022` | — |
| `022q` the speech suite's own faults | A spec from the first speech verdicts ([memo](research/2026-11-16-the-first-speech-verdicts.md); [spec](specifications/022q-the-speech-suites-own-faults.md)): O2 judges got in, moved, the sentinel, then the stall; NVDA's walk enters browse mode by NVDA+Space; a cover takes the NVDA helper's click; commas normalise to spaces and rules take spoken forms; four tests expect what the items do; captures by reader; VoiceOver's item text recorded; five VoiceOver shards. The owner chose to fix the suite first (2026-11-16) | E | `022`, `022l` | 3: (h) waits on speech verdicts |
| `022r` the search field's repeated count is a change | Small change, same memo ([spec](specifications/022r-the-search-fields-repeated-count-is-a-change.md)): a count stays in the status for 1 s, and the next keystroke empties it sooner, so a repeated count is a change NVDA speaks | I | `027b` | — |
| `022s` the emptied tag list has a line NVDA can speak | Small change, same memo ([spec](specifications/022s-the-emptied-tag-list-has-a-line-nvda-can-speak.md)): while empty, the focused list holds its own name as visually hidden generated text | I | `027b` | — |
| `022t` the error summary speaks again on an unchanged submit | Found by the speech memo; not a small change: the lane-I build found no signal the item has that tells an unchanged failed submit from other updates, so it needs a prop or a rule apps follow. **The owner chose a prop (2026-11-16)**, from three options (a prop; a rule apps follow; defer to 0.14.0): an optional `attempt` number the app raises on each failed submit, the summary re-announcing on each new value; the five blocks and the example pass it. A full spec, additive | I | `022`, `022q` | — |
| `022u` a tag list named by `aria-labelledby` speaks its name when empty | Found by `022s`'s change review, finding 2: `022s`'s hidden name reads `aria-label` only, so a list named by `aria-labelledby` is still blank to NVDA once emptied. No example uses it; the page now says to use `aria-label`. Needs script in the item, so a spec of its own | I | `022s` | — |
| `021` tokens for everyone | The token file becomes DTCG with a `$description` per role (from `words.ts`), a record of renamed and removed names, and a plain CSS-variables file published beside the theme. Built CSS is byte-identical | T | `020` | 5: 1 → 4; 12: 0 → 1 |
| `022` the test matrix | Firefox and WebKit projects for every browser suite; scripted VoiceOver and NVDA runs, built on `019`'s script, for items with a live region, a focus move or an overlay; a tag waits on a green run | E | `020` | 3: row (h) recorded |
| `023` prop doc comments | A doc comment on every prop of every item; a unit test that the described list has no empty row; the undefined-`var()` test | I | `020`, `024` (Button's headroom) | 2: 2 → 3 |
| `024` budgets per template | One transfer, LCP and CLS budget per page template (eight templates; nine from `024d`), from its heaviest page plus a stated margin. A full spec: it needs owner answers and sets a rule for later specs | S (perf only) | `020` | 8: held |
| `025` component cost | Each item installed into a minimal SvelteKit app; its added JS and CSS (gzipped, with dependencies), hydration time and main-interaction latency under CPU throttle; per-item budgets that fail the build | E (new `scripts/cost/`) | `020` | 15: (b) budgets |
| `026` toast | Kuiper's own `toast` on `status`: two announcers, no tab stop per toast, F8, a ≥ 6 s floor for success and info, timed toasts only, pause rules, `timers="off"` | N; app-shell mount at landing | `020`; its app-shell edit after `023` | 1: one of 40 |
| `027a` batch A, quiet items | Link, button group, progress. Nothing spoken, no focus move. New items only, each fully described from birth | N | `020` | 1: 32 of 40 |
| `027b` batch A, interactive items | Pagination, search field, tag. Each has a live region or a focus move, so it joins `022`'s screen-reader set | N | `020`, `022`, `025`, `026` (its `unspoken` rule) | 1: 3 → 4 (35 of 40) |
| `028` forced colours | System-colour rules on every interactive item; a `forcedColors: "active"` check per item | I | `023`, `026`, `027a`, `027b` | 3: (e) |
| `029` scoped schemes | Option B: `light-dark()` tokens with a hex fallback, `data-scheme` on any element, `dark:` banned in items, `readToken` returns a resolved colour, alert's tints as tokens | T, then I (alert) | `021`, `023` (the owner's scoped-schemes answers are recorded in §6 Q4) | 4: 2 → 3 |
| `030` the accessibility status | Tests tagged by item and check; a committed report of the last full run; the status line and "What Kuiper provides" on each page; `025`'s cost on the facts line | S | `022`, `024`, `025`, `028` | 3: (d); 15: (a), (c) → 3 |
| `031` high contrast | `prefers-contrast: more` and a hand setting on `<html>`; text at 7:1; its own primitives (swatches ruled by the design lead under the owner's overnight delegation, 2026-11-15); glass solid; a toggle beside the theme toggle; every line at 4.5:1 | T | `029`, `028`, `031a`, `031b` (lane T order: `031a`, `031b`, `031`) | 3: (f) → 3; 4: → 4 |
| `031a` the index card redesign | The Components index card is redrawn: the owner found its thumbnail on the page's own paper, inside a white card on that paper, reads as background on background, and white examples sit white on white (the owner, 2026-11-15). Research how Carbon, Atlassian, Spectrum and Radix frame previews; a stage ground that differs from both the page and the card in every scheme; the thumbnails regenerated. Owner's answers: card B, the matted well; a public `sunken` role (`#DCD7CA` / `#0B0A07`) with restricted pairs, guarded by a lint and a browser test; `surface-sunken` for wells | T (first in the lane), S (index, thumbnails), I (lint test only) | `029` (scheme grounds); blocks `031b` and `031` | 6: held; 7: held |
| `031b` transparency signifies depth | Every item and site surface audited against the owner's rule: only a layer above other content (the bar, overlays, the scrim) is translucent; everything inside a layer is solid or unfilled. A lint forbids alpha fills, borders, `backdrop-filter` and container opacity outside the declared layers. Owner's answers: the hairline is solid; disabled controls take three solid roles; glass is always a layer. Adds `sunken-line` | T, I, S | `028`, `029`, `031a`; blocks `031` | 4: held |

Not a spec: **the Kuiper lockup mock-ups.** Drawn and put to the owner on 2026-11-15 ([`research/2026-11-15-kuiper-lockup.md`](research/2026-11-15-kuiper-lockup.md)). The owner's answer: the bar keeps the "pluto" lockup. Kuiper is Pluto's system, not a product with its own branding, so it gets no logo or wordmark; its name appears in the tab title and in text. Nothing is built.

### 0.14.0: The page standard, and choosing from lists

| Spec | Scope | Lanes | Depends on | Moves |
|---|---|---|---|---|
| `032a` the aliases go | 0.14.0's first landing, a small change (`020` decision 15): remove the `pluto-theme` entry, the old context keys, `OLD_THEME_KEY` and its carry-over, the search alias, the `/view/field-keys/` test view and its line in `blocks.test.ts`'s view guard, and `scripts/rename-kuiper.ts`. The redirects stay. The 0.14.0 guide, at `/changelog/0.14.0/upgrade/`, lists the removals | all (small) | the `v0.13.0` tag | 14: held |
| `032` the page standard platform | Guidance modules under `src/lib/site/guidance/`; live pairs with inert don'ts; anatomy on slots; keyboard data and its driver; "Test it" and "Your part"; a `source` field per entry; the voice checks that can be counted, as tests | S | `030` | — (machinery) |
| `033` the pilot | Guidance for `button`, `dialog`, `field`, `dropdown-menu`, `error-summary` | site guidance and examples | `032` | 2: 3 → 4 |
| `034` the part first | The frame's title and scheme switch on one row; the stage above y = 500 at 1440 | S (frames) | `032` | 7: 2 → 3 |
| `035` states in axe | Hover, pressed, disabled, invalid and open states driven and scanned, in both schemes | E | `022` | 3: (b) |
| `036` info, banner and count | An `info` tone (which `toast`'s `info` kind then takes; `toast.info` shipped with `026`); a page-level banner from `alert`; count and dot badges | T, then I | `031` | 1: held |
| `037` batch B | Custom select, combobox, multi-select, slider, choice cards, toggletip, context menu. Combobox gets a 1,000-option cost case | N | `027b` (tag) | 1: 37 of 40; 15: (d) → 4 |
| `038` the data palette | Eight categorical colours, sequential and diverging scales, each measured for contrast and colour-blind distance | T, then I (chart) | `036` | 4, 5: held |
| `039` motion | Motion tokens by size of change; sheets, drawers and toasts slide; accordions open by height; nothing moves under reduced motion | T, then I | `038` | — |
| `040` installs by npm and pnpm | The smoke test installs into one scratch app per manager (§4.5) | E (smoke) | `025` | 10: held |

### 0.15.0: Data pages, guidance everywhere, governance

| Spec | Scope | Lanes | Depends on | Moves |
|---|---|---|---|---|
| `041` density, type and section grounds | A compact control density; a 20 px title step; named section grounds for headers and toolbars | T | `039` | 4: (d) |
| `042` batch C | Data table (TanStack Table, named), toolbar, page header, description list, tab nav, copy button, relative time. Data table gets a 10,000-row cost case | N | `041`, `027a`, `027b` | 1: held |
| `043`–`047` the rollout | The page standard, one spec per group: forms; overlays and navigation; surfaces and feedback; actions, data and code; the reduced set for blocks, fonts and libraries. Each also completes its items' keyboard data | site guidance, one group each | `033` | 3: (c) → 4; coverage → about 90% |
| `048` governance | A written interface-change rule; `meta.deprecated` naming the replacement; a built-token diff in every change review. First deprecations, found inert by `023`: `FieldLegend.variant`, `ToggleGroupItem.size` and `ToggleGroupItem.variant` | registry meta, scripts | `021` | 14: 2 → 3 |
| `049` notes and upcoming | Release notes grouped by kind; a feed; an "Upcoming" page generated from this file | S, `CHANGELOG.md` | `048` | 11: 3 → 4 |
| `050` the lint reads classes | Svelte's parser finds classes; prose is never linted; lint exceptions declared in item `meta`. Also from `023`: Tailwind's scan reads an installed item's comments, so a doc comment's word ("hidden", "grid") can add CSS to an app; a test holds item comments to add no selector | lint scripts | — | — |

The five rollout specs touch disjoint guidance modules and pages. They run at once.

### 0.16.0: Reach, and a designer's way in

| Spec | Scope | Lanes | Depends on | Moves |
|---|---|---|---|---|
| `051` right to left | Logical classes in every item; a direction switch in the frames; an RTL test | I, S (frames) | `043`–`047` | 13: (b) |
| `052` translatable strings | Every built-in English string an app can replace, with a policy page | I | `051` | 13: (c) → 3 |
| `053` sandbox and controls | "Open in StackBlitz" per example; controls generated from union and boolean props | S | `023` | 9: 3 → 4 |
| `054` the designer's start | A design start page and a theme and mode lab that writes the token copy an app owns | S | `021`, `031` | 10: 3 → 4; 12: 1 → 2 |
| `055` batch D | Calendar, date picker, date range picker, date field, time field, on `@internationalized/date` | N | `052` | 1: 38 of 40 |
| `056` search finds sections | Section hits through `015` decision 18's hook | S | — | 6: held |
| `057` file upload | A native file input with a drop target, from batch E | N | — | 1: 39 of 40 |

### 1.0.0: Stable

| Spec | Scope | Depends on |
|---|---|---|
| `058` the interface review | Every item's props, slots and exports read once more. Awkward names are fixed now, because from 1.0 a removal needs a deprecation first | all of 0.16.0 |
| `059` batch E, by rank | Command palette, tree view, menubar, resizable panes, number input, as re-ranked then | `058` |
| `060` the part first, again | Try for 4 (S ≤ 350, P ≤ 500) without breaking the page standard's order | `034` |
| `061` the 1.0 bar | Every target in §1 met, every item at the page standard, every status green in the full matrix | all |

The deprecation rule takes effect with the 1.0 tag.

## 3. 0.13.0 in detail

### The rename goes first, alone

`020` lands before any other 0.13.0 build. The reasons:

- **Every other spec touches what it renames.** `021` reshapes the token file. `026` and `027b` add context keys. `029` rewrites the theme item. Renamed last, each would be written once with `pluto` and again with `kuiper`, in the same release.
- **New items would be born with old names.** Toast and batch A would need their own migration lines for names no app ever installed.
- **One guide, built up.** `020` creates the "Upgrade to 0.13.0" page. Each later spec with an interface change adds its section. The guide grows as a ledger file.
- **It is mechanical.** A script renames; the tests and the scorecard show nothing else moved. The queue costs days, not a release.

While `020` builds, the wave-1 specifications are written and reviewed. Those are `context/` files, so they conflict with nothing.

### The waves

| Wave | Runs at once | Why this order |
|---|---|---|
| 0 | `020`, alone. The lockup mock-ups, the spec writing and the owner's scoped-schemes questions run beside it | It touches every file |
| 1 | `021` (T), `022` (E), `023` (I), `024` (S, perf), `025` (E, new files), `026` (N), `027a` (N), `027b` (N, after `022`, `025`, `026`) | One spec per lane. `022` and `025` share lane E but not files: config and screen readers against a new `scripts/cost/` |
| 2 | `028` (I), `029` (T), `030` (S) | `028` waits for `023` and the new items. `029` waits for `021`, and its alert edit waits for `023`. `030` waits for the matrix, the budgets, the cost figures and the forced-colours check |
| 3 | `031a` (T, then S), `031b` (T, I, S), `031` (T), in that order in lane T | `031a` adds the public `sunken` ground that `031b`'s lines and `031`'s swatches are measured on. `031b` adds the solid line and disabled roles that `031` covers. `031` needs `029`'s attribute pattern. It is the first spec to slip to 0.14.0 if the lane runs long |

**Cross-lane landings.** `026` builds in lane N but mounts `<Toaster>` in `app-shell`. That one edit lands after `023`. Engine faults that `022` finds in item source become small changes in lane I, queued behind `023`.

**`024` before `030`.** The Button page has 0 kB of headroom under its 380 kB budget. The status line and the cost figure add bytes to every component page. Per-template budgets must exist first, or `030` breaks the build on arrival.

**`024b`, `024c`, `024d`, `024e`, then one re-base, before `030`** (the design lead, at `024`'s landing, 2026-11-16). The four small changes land one at a time, all lane S but `024e` (lane I) and `024d` (the theme item's examples). Then one sweep re-bases all nine templates (`024d` added `kuiper-theme`), taking every fall without a ruling (`024` decision 4). `030` lands after it, so its stated cost meets the real headroom, and `component`'s CLS guard is back at 0.02 before `030` adds a status line near the top of every component page. `030`'s per-page cost must fit `kuiper-theme`'s headroom as well as `component`'s: 47.9 kB (510 − 462.1) at `024d`, until the re-base. **The scorecard for this set** (the design lead, at `024d`'s change review, finding 7): `024b`, `024c`, `024d` and `024e` re-run the scorecard with the re-base sweep, once, not one by one; the run log row names all four.

### `025`, component cost

What an app pays for an item, measured where it is paid: in the app.

- **How.** Each item is added to a minimal SvelteKit app by the CLI, reusing `tests/smoke/`'s scratch-app harness. The build is compared with an empty app's.
- **What.** Added JS and CSS, gzipped, with dependencies. Hydration time. For an interactive item, the latency of its main interaction, measured as INP is, under a 4× CPU slowdown in Chromium. Large-data cases join when their items exist: combobox at 1,000 options (`037`), data table at 10,000 rows (`042`).
- **Budgets.** Each item has one, from its measurement plus a stated margin. Going over fails the build. A budget rises only by a recorded ruling.
- **Shown.** The figure goes on each component page's facts line, through `030`.
- **Scored.** A proposed row 15, "Component cost": (a) per-item size published; (b) size budgets enforced; (c) runtime cost published; (d) large-data cases. Every system is scored on it. Kuiper leads on page weight; this makes the lead evidence.
- **Prior art.** The references rarely publish a per-item cost. Primer is said to track bundle size with `size-limit`. No clone here uses it, and `primer/react` is not cloned. `025`'s research memo checks Primer, Carbon and Spectrum before the rubric is fixed.

## 4. The measurement loop

The loop runs after every specification lands. It also runs before every tag. The `024b`–`024e` small changes are the one exception: they run it once, with their re-base sweep (§3).

1. **Build and score.** `bun run build`, then `scripts/bench/` as the scorecard's §8 says: `pluto.ts --rev <commit>` always; `site.ts --only pluto` and `depth.ts` when a page changed; `breadth.ts` when an item was added. From `025`, the cost run too.
2. **Write it down.** Replace the scorecard's "In short" table and the changed cells. Append one row to its run log. Note there if a rubric changed, and re-score every system on that row.
3. **Cite it.** The change review states the movement: the rows, the before and after, and the run log row. A spec that moved less than §2 predicts says why.
4. **Re-rank.** The design lead updates this file: §1's "now" column, the release totals, and the order of what remains. A spec whose row is already at target drops in rank. A gap that widened rises.
5. **Re-check the references.** Every fourth run, or when a newer memo covers one. A `?` changes only with a source.

`scripts/bench/` is committed (since `45a5f5c`), so every run scores the same instrument. `020` renames it to `kuiper.ts`, with a fallback to the old token path so older commits still score.

**Page budgets (`024`).** Every site page is held to its template's transfer, LCP and CLS budgets, each from the template's heaviest or slowest page plus a stated margin (`tests/e2e/budgets.ts`). A specification that adds weight to every page of a template states the cost in kB per page; it must fit the template's headroom or ask for a ruling. A budget rises only by a ruling recorded with its measurement, and falls at a re-base without one. Before each tag, the sweep runs: `PERF_SWEEP=1 bun --bun playwright test --project=perf --no-deps`. This rule takes effect when `024` lands.

## 5. Risks

- **The matrix's first run is unknown.** No item has run in Firefox, WebKit or under a screen reader. Each fault becomes a small change. Many faults would lengthen 0.13.0.
- **The suite triples.** 2,981 browser tests (measured by `022`) become about 8,900 across three engines. `022` must shard them, or the loop slows.
- **Ledger contention.** Seven wave-1 specs land through the same five files. Landing one at a time is slow but safe.
- **The rollout is mostly writing.** About 280 hours across `043`–`047`. It decides 0.15.0's date.
- **Row 7's 4 may conflict with the standard.** The header and facts sit above the first example. Reaching y = 350 may mean moving the facts below it.
- **The owner gates five things:** the `019` listen, the lockup, the scoped-schemes questions, the high-contrast swatches, and the CI choice below. Each waits on a reply, not on work.
- **Two pages stand for the catalogue.** Rows 2, 7 and 8 read Button and Dialog. Coverage and the status count (§1) guard against a score that moves while 70 pages do not.

## 6. Questions for the owner

Recommended option first. Answered questions keep their answer and its source.

**Q1. Where does the full matrix run?** Answered: GitHub Actions on the public repository (`decisions.md` at `beeb67e`; `022`'s landing notes hold its nine detailed answers).

**Q2. When does 0.13.0's build start?** Answered by events: the owner's `019` listen passed, `v0.12.0` was tagged on `dad6f76`, and `release/0.13.0` starts from it.

**Q3. Do old names keep working for one release?** Answered: yes, for every old name, the context keys included (`decisions.md` at `beeb67e`; `020` decision 4). The exceptions the owner chose in `020`: the token file path and the four old keyframes are not kept (`020` Q3, Q5).

**Q4. The scoped-schemes questions.** Answered with the memo's recommendations (`decisions.md` at `beeb67e`): `light-dark()` with a generated hex fallback, `.dark` as an alias for two minor releases, high-contrast primitives measured to 7:1 with swatches the owner approves, and 4.5:1 for non-text in high contrast. `029` and `031` carry them.

**Q5. What is 1.0?**
1. **The bar in `061`:** every target in §1, every page at the standard, every status green. The date follows the bar.
2. **The release after 0.16.0,** whatever stands then.
