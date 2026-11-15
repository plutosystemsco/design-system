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

A **ledger file** is a file every spec appends to: `registry.json`, `CHANGELOG.md`, the sitemap's entries, the release's migration guide, and the generated `static/r/`. Builds may run at once. Their ledger edits land one at a time, in landing order, and `static/r/` is regenerated at each landing.

### 0.13.0: Kuiper, proven

The new name in code. Evidence across three engines and two screen readers. Tokens anyone can read. The toast.

| Spec | Scope, in one line | Lanes | Depends on | Moves |
|---|---|---|---|---|
| `020` the Kuiper rename | `pluto` → `kuiper` in the registry name, the theme item, context keys, the token file, the storage key and the package; one "Upgrade to 0.13.0" guide page; a redirect for each moved URL | all | the `v0.12.0` tag | 11: 2 → 3 (migration page) |
| `021` tokens for everyone | The token file becomes DTCG with a `$description` per role (from `words.ts`), a record of renamed and removed names, and a plain CSS-variables file published beside the theme. Built CSS is byte-identical | T | `020` | 5: 1 → 4; 12: 0 → 1 |
| `022` the test matrix | Firefox and WebKit projects for every browser suite; scripted VoiceOver and NVDA runs, built on `019`'s script, for items with a live region, a focus move or an overlay; a tag waits on a green run | E | `020` | 3: row (h) recorded |
| `023` prop doc comments | A doc comment on every prop of every item; a unit test that the described list has no empty row; the undefined-`var()` test | I | `020` | 2: 2 → 3 |
| `024` budgets per template | One transfer budget per page template, from its heaviest page plus a stated margin. Small change | S (perf only) | `020` | 8: held |
| `025` component cost | Each item installed into a minimal SvelteKit app; its added JS and CSS (gzipped, with dependencies), hydration time and main-interaction latency under CPU throttle; per-item budgets that fail the build | E (new `scripts/cost/`) | `020` | 15: (b) budgets |
| `026` toast | Kuiper's own `toast` on `status`: two announcers, no tab stop per toast, F8, a ≥ 6 s floor for success and info, timed toasts only, pause rules, `timers="off"` | N; app-shell mount at landing | `020`; its app-shell edit after `023` | 1: one of 40 |
| `027` batch A | Pagination, search field, button group, tag, link, progress bar. New items only, each fully described from birth | N | `020` | 1: 3 → 4 (35 of 40) |
| `028` forced colours | System-colour rules on every interactive item; a `forcedColors: "active"` check per item | I | `023`, `026`, `027` | 3: (e) |
| `029` scoped schemes | Option B: `light-dark()` tokens with a hex fallback, `data-scheme` on any element, `dark:` banned in items, `readToken` returns a resolved colour, alert's tints as tokens | T, then I (alert) | `021`, `023`; the owner's four questions | 4: 2 → 3 |
| `030` the accessibility status | Tests tagged by item and check; a committed report of the last full run; the status line and "What Kuiper provides" on each page; `025`'s cost on the facts line | S | `022`, `024`, `025`, `028` | 3: (d); 15: (a), (c) → 3 |
| `031` high contrast | `prefers-contrast: more` and a hand setting on `<html>`; text at 7:1; its own primitives, approved by the owner | T | `029`, `028` | 3: (f) → 3; 4: → 4 |
| `031a` the index card redesign | The Components index card is redrawn: the owner found its thumbnail on the page's own paper, inside a white card on that paper, reads as background on background, and white examples sit white on white (the owner, 2026-11-15). Research how Carbon, Atlassian, Spectrum and Radix frame previews; a stage ground that differs from both the page and the card in every scheme; the thumbnails regenerated | S (index, thumbnails) | `029` (scheme grounds) | 6: held; 7: held |
| `031b` transparency signifies depth | Every item and site surface audited against the owner's rule: only a layer above other content (the bar, overlays, the scrim) is translucent; everything inside a layer is solid or unfilled. A lint forbids alpha fills, borders, `backdrop-filter` and container opacity outside the declared layers | I, S | `029` | 4: held |

Not a spec: **the Kuiper lockup mock-ups.** They are drawn in `research/` as an exhibit and put to the owner. They run beside everything. Once approved, a small spec changes the header (lane S) in whichever release is open.

### 0.14.0: The page standard, and choosing from lists

| Spec | Scope | Lanes | Depends on | Moves |
|---|---|---|---|---|
| `032` the page standard platform | Guidance modules under `src/lib/site/guidance/`; live pairs with inert don'ts; anatomy on slots; keyboard data and its driver; "Test it" and "Your part"; a `source` field per entry; the voice checks that can be counted, as tests | S | `030` | — (machinery) |
| `033` the pilot | Guidance for `button`, `dialog`, `field`, `dropdown-menu`, `error-summary` | site guidance and examples | `032` | 2: 3 → 4 |
| `034` the part first | The frame's title and scheme switch on one row; the stage above y = 500 at 1440 | S (frames) | `032` | 7: 2 → 3 |
| `035` states in axe | Hover, pressed, disabled, invalid and open states driven and scanned, in both schemes | E | `022` | 3: (b) |
| `036` info, banner and count | An `info` tone; a page-level banner from `alert`; count and dot badges; `toast.info` | T, then I | `031` | 1: held |
| `037` batch B | Custom select, combobox, multi-select, slider, choice cards, toggletip, context menu. Combobox gets a 1,000-option cost case | N | `027` (tag) | 1: 37 of 40; 15: (d) → 4 |
| `038` the data palette | Eight categorical colours, sequential and diverging scales, each measured for contrast and colour-blind distance | T, then I (chart) | `036` | 4, 5: held |
| `039` motion | Motion tokens by size of change; sheets, drawers and toasts slide; accordions open by height; nothing moves under reduced motion | T, then I | `038` | — |
| `040` installs by npm and pnpm | The smoke test installs into one scratch app per manager (§4.5) | E (smoke) | `025` | 10: held |

### 0.15.0: Data pages, guidance everywhere, governance

| Spec | Scope | Lanes | Depends on | Moves |
|---|---|---|---|---|
| `041` density, type and section grounds | A compact control density; a 20 px title step; named section grounds for headers and toolbars | T | `039` | 4: (d) |
| `042` batch C | Data table (TanStack Table, named), toolbar, page header, description list, tab nav, copy button, relative time. Data table gets a 10,000-row cost case | N | `041`, `027` | 1: held |
| `043`–`047` the rollout | The page standard, one spec per group: forms; overlays and navigation; surfaces and feedback; actions, data and code; the reduced set for blocks, fonts and libraries. Each also completes its items' keyboard data | site guidance, one group each | `033` | 3: (c) → 4; coverage → about 90% |
| `048` governance | A written interface-change rule; `meta.deprecated` naming the replacement; a built-token diff in every change review | registry meta, scripts | `021` | 14: 2 → 3 |
| `049` notes and upcoming | Release notes grouped by kind; a feed; an "Upcoming" page generated from this file | S, `CHANGELOG.md` | `048` | 11: 3 → 4 |
| `050` the lint reads classes | Svelte's parser finds classes; prose is never linted; lint exceptions declared in item `meta` | lint scripts | — | — |

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

- **Every other spec touches what it renames.** `021` reshapes the token file. `026` and `027` add context keys. `029` rewrites the theme item. Renamed last, each would be written once with `pluto` and again with `kuiper`, in the same release.
- **New items would be born with old names.** Toast and batch A would need their own migration lines for names no app ever installed.
- **One guide, built up.** `020` creates the "Upgrade to 0.13.0" page. Each later spec with an interface change adds its section. The guide grows as a ledger file.
- **It is mechanical.** A script renames; the tests and the scorecard show nothing else moved. The queue costs days, not a release.

While `020` builds, the wave-1 specifications are written and reviewed. Those are `context/` files, so they conflict with nothing.

### The waves

| Wave | Runs at once | Why this order |
|---|---|---|
| 0 | `020`, alone. The lockup mock-ups, the spec writing and the owner's scoped-schemes questions run beside it | It touches every file |
| 1 | `021` (T), `022` (E), `023` (I), `024` (S, perf), `025` (E, new files), `026` (N), `027` (N) | One spec per lane. `022` and `025` share lane E but not files: config and screen readers against a new `scripts/cost/` |
| 2 | `028` (I), `029` (T), `030` (S) | `028` waits for `023` and the new items. `029` waits for `021`, and its alert edit waits for `023`. `030` waits for the matrix, the budgets, the cost figures and the forced-colours check |
| 3 | `031` (T) | It needs `029`'s attribute pattern and the owner's swatches. It is the first spec to slip to 0.14.0 if the lane runs long |

**Cross-lane landings.** `026` builds in lane N but mounts `<Toaster>` in `app-shell`. That one edit lands after `023`. Engine faults that `022` finds in item source become small changes in lane I, queued behind `023`.

**`024` before `030`.** The Button page has 0 kB of headroom under its 380 kB budget. The status line and the cost figure add bytes to every component page. Per-template budgets must exist first, or `030` breaks the build on arrival.

### `025`, component cost

What an app pays for an item, measured where it is paid: in the app.

- **How.** Each item is added to a minimal SvelteKit app by the CLI, reusing `tests/smoke/`'s scratch-app harness. The build is compared with an empty app's.
- **What.** Added JS and CSS, gzipped, with dependencies. Hydration time. For an interactive item, the latency of its main interaction, measured as INP is, under a 4× CPU slowdown in Chromium. Large-data cases join when their items exist: combobox at 1,000 options (`037`), data table at 10,000 rows (`042`).
- **Budgets.** Each item has one, from its measurement plus a stated margin. Going over fails the build. A budget rises only by a recorded ruling.
- **Shown.** The figure goes on each component page's facts line, through `030`.
- **Scored.** A proposed row 15, "Component cost": (a) per-item size published; (b) size budgets enforced; (c) runtime cost published; (d) large-data cases. Every system is scored on it. Kuiper leads on page weight; this makes the lead evidence.
- **Prior art.** The references rarely publish a per-item cost. Primer is said to track bundle size with `size-limit`. No clone here uses it, and `primer/react` is not cloned. `025`'s research memo checks Primer, Carbon and Spectrum before the rubric is fixed.

## 4. The measurement loop

The loop runs after every specification lands. It also runs before every tag.

1. **Build and score.** `bun run build`, then `scripts/bench/` as the scorecard's §8 says: `pluto.ts --rev <commit>` always; `site.ts --only pluto` and `depth.ts` when a page changed; `breadth.ts` when an item was added. From `025`, the cost run too.
2. **Write it down.** Replace the scorecard's "In short" table and the changed cells. Append one row to its run log. Note there if a rubric changed, and re-score every system on that row.
3. **Cite it.** The change review states the movement: the rows, the before and after, and the run log row. A spec that moved less than §2 predicts says why.
4. **Re-rank.** The design lead updates this file: §1's "now" column, the release totals, and the order of what remains. A spec whose row is already at target drops in rank. A gap that widened rises.
5. **Re-check the references.** Every fourth run, or when a newer memo covers one. A `?` changes only with a source.

`scripts/bench/` is committed (since `45a5f5c`), so every run scores the same instrument. `020` renames it to `kuiper.ts`, with a fallback to the old token path so older commits still score.

## 5. Risks

- **The matrix's first run is unknown.** No item has run in Firefox, WebKit or under a screen reader. Each fault becomes a small change. Many faults would lengthen 0.13.0.
- **The suite triples.** About 2,000 browser tests become about 6,000. `022` must shard them, or the loop slows.
- **Ledger contention.** Seven wave-1 specs land through the same five files. Landing one at a time is slow but safe.
- **The rollout is mostly writing.** About 280 hours across `043`–`047`. It decides 0.15.0's date.
- **Row 7's 4 may conflict with the standard.** The header and facts sit above the first example. Reaching y = 350 may mean moving the facts below it.
- **The owner gates five things:** the `019` listen, the lockup, the scoped-schemes questions, the high-contrast swatches, and the CI choice below. Each waits on a reply, not on work.
- **Two pages stand for the catalogue.** Rows 2, 7 and 8 read Button and Dialog. Coverage and the status count (§1) guard against a score that moves while 70 pages do not.

## 6. Questions for the owner

Recommended option first.

**Q1. Where does the full matrix run?** The repository has no CI. NVDA runs only on Windows.
1. **GitHub Actions on the public repository.** Linux runs the three engines. A macOS runner drives VoiceOver; a Windows runner drives NVDA. A tag waits on a green run. Public repositories run free. It needs the owner to push.
2. **Locally, on the release machine,** with NVDA in a Windows virtual machine. No push needed. One machine gates every tag.
3. **Engines in CI, screen readers locally.**

**Q2. When does 0.13.0's build start?** The `v0.12.0` tag waits on your `019` listen. `020` renames `error-summary`'s files too.
1. **Run the listen first.** `020` starts at the tag. Specs are written meanwhile.
2. **Branch `release/0.13.0` now.** If the listen fails, the fix lands on both branches.

**Q3. Do old names keep working for one release?**
1. **Yes, for the item and the storage key only.** A `pluto-theme` stub installs `kuiper-theme`. The theme script reads the old key once. Context keys break, with the guide.
2. **A clean break.** The guide covers every name. Deprecation is not owed before 1.0.

**Q4. The scoped-schemes questions,** asked when `029` starts. Its [memo](research/2026-11-15-scoped-schemes-and-contrast.md) §8 holds the alternatives; the recommended answers are:
1. **Browser floor:** `light-dark()` with a generated hex fallback until Safari 17.5.
2. **`.dark`:** an alias of `data-scheme="dark"` for two minor releases, then removed.
3. **High-contrast colours:** new primitives in the brand's hues, measured to 7:1, swatches approved by you.
4. **Non-text target in high contrast:** 4.5:1, as Primer uses.

Its third question, whether high contrast is needed, is settled: yes.

**Q5. What is 1.0?**
1. **The bar in `061`:** every target in §1, every page at the standard, every status green. The date follows the bar.
2. **The release after 0.16.0,** whatever stands then.
