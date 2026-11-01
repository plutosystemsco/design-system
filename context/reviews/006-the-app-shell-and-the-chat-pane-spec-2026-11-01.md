# Review of 006 — The app shell and the chat pane

- **Status:** complete; awaiting the author's disposition
- **Date:** 2026-11-01
- **Reviewer:** an agent (Claude), a fresh sub-agent of the orchestrating session; not the author
- **Reviewed:** the specification as drafted, 2026-11-01 (`specifications/006-the-app-shell-and-the-chat-pane.md`, 320 lines, untracked). Checked against the constitution, every entry of `decisions.md` dated 2026-11-01 and the `003` and `002` calls, `005` **as it stands on disk at review time** (amended after its own review the same morning; its status line now reads "fit to build"), `003` decisions 2 to 6, 15 to 17 and 20 and its Landing notes, `001` decisions 10, 13, 14, 16, 22 and 25, `002` decisions 3, 9, 10 and 25, `004` decisions 8 and 19, the five memos the header names, and the code at `b3d2a8e`.
- **Re-ran:** under Bun 1.3.14. Scratch files went in the session scratchpad, folder `review-006-spec/`. Nothing in this repository was written except this file.
  - **A scratch SvelteKit 3.1.0 app** (`app/`, a copy of `tests/smoke/fixtures/kit3` with its pinned packages installed, 66 packages) holding: `src/lib/x/+layout.server.ts` and `src/routes/x/+layout.server.ts`, each typed with `ServerLoadEvent` from `@sveltejs/kit`; `src/lib/shell/+layout.svelte` taking `children` and `data` and reading `version` from `$app/env` and `import.meta.env.VITE_BUILT_AT`; `src/routes/(shell)/view/app-shell/+page.svelte` rendering that layout as `<Layout data={{ sidebarOpen: true }}>{#snippet children()}…{/snippet}</Layout>`; `(view)/view/a` and `(shell)/view/b`; and `src/app.css` with the spec's `--mark-orbit`, the three entrance numbers, `@keyframes pluto-mark-dock` inside `@theme inline`, `@utility mark-entrance` with its four nested `:nth-child` rules, `@utility groove-b`, and the third reduce rule (EXECUTED):
    - `vite.config.ts` with the five lines **as decision 8 writes them** (`execSync("git rev-parse --short HEAD")`, unguarded): `git` answers "fatal: not a git repository" in the scratch folder and `vite build` exits 1 (finding 1).
    - The same config **guarded** (`try`/`catch`, `WORKERS_CI_COMMIT_SHA` first, a fallback value) and `process.env.VITE_BUILT_AT` set before `defineConfig`: `vite build` exits 0 and prerenders `index.html`, `x.html`, `view/a.html`, `view/b.html`, `view/app-shell.html`. The shell view's HTML holds the skip link first, `<main id="main" tabindex="-1" data-open="true">`, `<dd data-commit="">unknown</dd>` and `<time datetime="2026-11-01T00:00:00Z">`. So a layout component renders from a page with `data` and `children`, `$app/env`'s `version` and the `process.env` route both reach the prerendered HTML, and two groups may both hold a `view/` folder.
    - `svelte-check` over that app: **3 errors, all in `vite.config.ts`**: `Cannot find name 'process'` twice and `Cannot find name 'node:child_process'`. The kit3 fixture has no `@types/node` or `@types/bun`, and its `tsconfig` includes `*.ts` (finding 1). The two `+layout.server.ts` files and the layout type-check clean.
    - A first build with the layout's `#overview` and `#activity` links and no such ids on the page failed with `prerender_missing_id` (finding 16).
    - Adding `(view)/view/app-shell/+page.svelte` beside `(shell)/view/app-shell/+page.svelte`: `svelte-kit sync` exits 1 and `vite build` reports `route_conflict`: "The `/(shell)/view/app-shell` and `/(view)/view/app-shell` routes conflict with each other". So the `(shell)` group is safe only while no `(view)` route shares a path.
    - **Tailwind 4.3.3's built CSS** from that app: `@keyframes pluto-mark-dock{0%{opacity:0;transform:translate(calc(var(--mark-orbit) * var(--_ox)), …) scale(.4)}}` is emitted although no `--animate-*` variable names it; `.mark-entrance [data-slot=four-dot-dot]{animation:pluto-mark-dock calc(var(--motion-entrance) * var(--motion-entrance-dot)) var(--ease-entrance) both}` and the four `:nth-child` rules (the first printed as `:first-child` by the minifier) are emitted when the class is referenced; `.groove-b{border-bottom:…;box-shadow:0 var(--line-width) 0 var(--groove-light)}`; `.min-h-dvh{min-height:100dvh}`; the reduce block carries `.mark-entrance [data-slot=four-dot-dot]{animation:none}` after `001`'s two rules, outside any layer. `focus:not-sr-only` is printed before `focus:fixed`, which is printed before `focus:px-4`, so the skip link's `fixed` and padding win. **`aria-current:underline` compiles to `[aria-current=true]`**, not `page`; `aria-[current=page]:underline` compiles to `[aria-current=page]` (finding 2).
  - **The lint** (`lintText` with this repository's rules, EXECUTED): `animate-mark-dock` → "animation" (the bad sample works); `mark-entrance`, `groove-b`, the skip link's eleven classes, `aria-current:underline`, `aria-[current=page]:underline`, `min-h-dvh`, `h-16`, `max-w-5xl`, `max-w-prose`, `z-40`, `sticky top-0`, `scroll-pb-24`, `pt-12 pb-16`, `ms-auto`, `hidden md:flex`, `whitespace-pre-wrap` → 0 violations; the `+layout.server.ts` body and the `chat-types.ts` unions, linted as `.ts` item files → 0.
  - `0.15 + 3 * 0.1 + 0.55 === 1` is `true` in JavaScript (EXECUTED), so decision 14's equality test holds without `toBeCloseTo`.
  - **SvelteKit types** (READ): Kit 3.1.0's `types/index.d.ts` declares `$app/env` at line 2387 with `version: string` and declares no `$app/environment`; Kit 2.70.3's (from Bun's cache) declares both, `$app/env` with `version` at line 3183. `ServerLoadEvent` is exported (line 745) with defaulted generics. Kit's types reference `vite/client`, whose `ImportMetaEnv` has an index signature, so `import.meta.env.VITE_BUILT_AT` needs no declaration (confirmed by the clean `svelte-check` above).
  - **The CLI** at `6149e14` (READ): `build.ts` lines 119 to 139 nest `registry:page`, `registry:ui` and `registry:file` as `<item>/<base name>` for any extension, so `+layout.server.ts` lands at `app-shell/+layout.server.ts`; `deps-resolver.ts` line 80 puts `@sveltejs/kit` in `IGNORE_DEPS`, so the type import adds no dependency.
  - **The code** (READ): `viewer.spec.ts` line 76 counts "17 state switches" today, not 16; `keyboard.spec.ts` lines 71 to 92 assert the catalogue's stops are `2 + ITEMS.length` and that nothing follows; `registry-add.test.ts` line 209 asserts the app's reduce block holds only `html:root` and `*, ::before, ::after`; `axe.spec.ts` line 59 and `viewer.spec.ts` line 56 wait for `main[data-view-ready]`, as `pages.ts` does; `blocks.test.ts` check 4's regex is `(["'`])(\/[^"'`\n]*)\1`, so `#overview` is not matched and passes as written; `dev-loop.test.ts` lines 33 to 40 copy `git ls-files` output and no `.git`; `alert.svelte` gives `destructive` the role `alert`; `avatar.svelte`'s `sm` is `size-6` (24 px); `scripts/tokens.ts` validates `mark`'s four named fields and `motion`'s three, so `orbit` and the three entrance numbers need a schema line (the build order's step 1 names `tokens.ts`); `registry.json` names 27 distinct dependencies at `004`.
  - **`005` as amended** (READ): axe is **364** scans (its item pages at three widths, its review finding 6); `Sidebar` is a flex child `sticky top-0 h-svh self-start`, not a `fixed` panel, and `SidebarProvider` is `flex min-h-svh w-full`; `SidebarInset` takes an `element` prop (`main` by default); `SidebarContent` has no `tabindex`; its preview puts "a bar above its sidebar holding the trigger… so the trigger precedes the sidebar in the DOM, as `006`'s header will"; `ThemeScript` takes `nonce`; the composer's cap is `max-h-(--container-3xs)`; `registry.test.ts` counts 31 distinct dependency names.

## Verdict

Does not land yet: not fit to build. Findings 1 and 2 are High: the five lines fail every smoke run and the dev-loop test (no git repository, no `process` types), and the current-page underline never draws. Findings 3 to 15 are Medium: six counts are wrong or rest on `005`'s superseded numbers, the sidebar trigger has two homes and no context, `app-shell` omits a dependency it imports, the chat pane shows two busy controls and cannot scroll its log, and shipped copy is missing. Nothing needs the owner. Findings 6 and 8 need the design lead's word; the rest are the author's.

## Acceptance criteria against evidence

1. **Install, 32 packages:** countable. `@sveltejs/kit` is ignored by the dependency detector (READ). Met on paper.
2. **Checks:** `bun run check` is clean over the layout's `data` and `$app/env` imports (EXECUTED in the scratch). Met on paper.
3. **Tokens:** countable. The equality holds (EXECUTED); the keyframes and both utilities emit (EXECUTED). `tokens.ts` must gain the four fields (READ).
4. **Registry source, 62 (1, 3, 2, 2, 47, 7), 10 page files, 19 components:** 60 + 2, 5 + 2, 6 + 4, 10 + 9 recompute (READ). `blocks.test.ts`'s regexes accept neither `+layout.*` nor a `.ts` component today (finding 11).
5. **Registry build, 63 + 63:** countable. The layout's `.ts` page file nests under `app-shell/` (READ). Met on paper.
6. **Site build, 90 pages, the footer with the commit:** 61 + 2 + 18 + 9 = 90 (READ). **Not met as written** for `dev-loop.test.ts`, which starts `vite dev` in a copy with no `.git` (finding 1).
7. **Dev server, 62:** countable.
8. **Preview pages, 62:** countable.
9. **Lint, 300 files, 71 / 48, 30 block files:** 286 + 14 = 300; the samples recompute; every class string in the specification lints clean (EXECUTED).
10. **Blocks, checks 1 to 11:** **not met as written**: check 1 fails on `app-shell`'s `collapsible` import (finding 7); checks 5 and 9 need their regexes widened (finding 11).
11. **axe, 382:** **wrong.** `005` now counts 364, and block item pages scan at three widths: 364 + 12 + 54 + 4 = **434** (finding 3).
12. **Themes, 180:** 90 × 2 (READ). Met on paper.
13. **The entrance:** countable. The keyframes emit without an `--animate-*` variable, and `animation: none` lands in the reduce block outside any layer, so it beats the layered utility (EXECUTED). Met on paper.
14. **Keyboard, 64 catalogue stops, 7 behaviours:** **wrong.** 2 + 62 = 64 before the footer; the source link makes 65, and the footer's lockup may make 66 (finding 4). "7 behaviours" is not the number decision 14 lists (finding 15).
15. **The shell, A1 to A6:** A1 and A5 are countable. No check reads the current link's underline, which does not draw (finding 2). A1's "1 navigation" on `/view/app-shell/` holds only if the sheet's `nav` is not in the DOM while closed (bits-ui portals it on open; READ `005` decision 8). Not met as written for finding 2.
16. **The chat, C1 to C5:** C2 and C3 are countable. The log never scrolls inside a `min-h-dvh` column, so follow-bottom is untested by any C check (finding 9). The pane's heading structure is undecided (finding 10).
17. **Reflow, loops, targets, rings:** countable. The `submitted` state, the one with a spinner, has no view and is never scanned (finding 8).
18. **The viewer, 25 state buttons, 21 follows, 30 summaries:** **25 is wrong:** the suite counts 17 today, so 26 (finding 5). 21 = 7 × 3 and 30 recompute.
19. **Smoke, 20 of 20:** **not met as written:** the five lines exit 1 without a repository, and `svelte-check` reports 3 errors on `process` (finding 1, EXECUTED). "10 assertions" is not derivable from the list (finding 15).
20. **Test files, 9, 11, 6:** `005`'s counts, unchanged (READ).
21. **Release:** countable (4 of 4 recompute).
22. **The checkpoint and the walk, 180 loads:** 90 × 2 (READ).
23. **The site:** countable once finding 1 is fixed.
24. **In the app:** not checkable here, by design.

## Findings table

| # | Severity | Finding | Where |
|---|---|---|---|
| 1 | High | The five `vite.config.ts` lines fail without a git repository and without `process` types; three suites break | decisions 8, 14, 16; criteria 6, 19 |
| 2 | High | `aria-current:underline` targets `aria-current="true"`, so the current page is never underlined, and nothing tests it | decision 7; A1 to A6 |
| 3 | Medium | The axe count stands on `005`'s superseded 320 and omits the item pages' three widths: 434, not 382 | decision 14; criterion 11 |
| 4 | Medium | The catalogue's stops: 2 + 62 is 64 before the footer, 65 with the source link; the footer's lockup is a link or not | decisions 8, 14, 16; criterion 14 |
| 5 | Medium | The viewer counts 17 state buttons today, so 26, not 25 | decision 14; criterion 18 |
| 6 | Medium | The sidebar trigger has two homes, neither inside the provider's context, and `005` expects it before the sidebar | decisions 6, 9 |
| 7 | Medium | `app-shell` imports `collapsible` and does not name it; `kbd` is named and unused; its "Packages" column is undetectable | decisions 3, 9 |
| 8 | Medium | Two spinners at `submitted`, and "Responding" said twice | decision 10 |
| 9 | Medium | A `min-h-dvh` column never scrolls its log, so follow-bottom, "Scroll to end" and the pinned composer do not happen | decision 10 |
| 10 | Medium | The chat page's `h1` is unwritten, and `level` 1 on the pane skips a heading rank | decisions 10, 11, 14 |
| 11 | Medium | Three tests the specification does not name must change: the smoke reduce-block count, two `main[data-view-ready]` selectors, `blocks.test.ts`'s file regexes | decisions 4, 12, 14 |
| 12 | Medium | Decision 8 names two date mechanisms, and decision 6 a third name for it | decisions 6, 8 |
| 13 | Medium | Shipped copy is missing from the copy table | decisions 6, 7, 9, 10, 11 |
| 14 | Medium | The views copy the layout's markup, so the shipped layout is never rendered on our site | decision 12 |
| 15 | Low | Counts left to landing that can be fixed now, and two counts not derivable | decisions 14, 19 |
| 16 | Low | Anchors in a root layout fail the build of every other page | decisions 2, 5 |
| 17 | Low | Small contracts against `005` and `002`: the menu's name, the alert's assertive role, the sticky header under a sticky sidebar, the doubled head script, the version default | decisions 6, 7, 10 |
| 18 | Low | Citations and wording | decisions 10, 14, 19 |

## Findings, most severe first

1. **High — The five `vite.config.ts` lines exit 1 wherever there is no git repository, and fail `svelte-check` wherever there is no `@types/node`** (decision 8, "`vite.config.ts` sets `sveltekit({ version: { name: execSync("git rev-parse --short HEAD") } })`… names Cloudflare's `WORKERS_CI_COMMIT_SHA` as the fallback where `git` is absent"; decision 14, "The scratch app's `vite.config.ts` is given the five lines"; decision 16, "`vite.config.ts` gains the five lines").
   - **What is wrong, three ways** (EXECUTED, the scratch app):
     - The smoke test copies a fixture to a temporary folder outside the repository (`001` decision 25). `git rev-parse` there prints "fatal: not a git repository" and the config throws before Vite starts: `vite build` exits 1. The entrance memo saw this and ran `git` in this repository instead (§4.2, "the scratch copy has no commits").
     - The kit3 fixture holds no `@types/node` or `@types/bun`, and its `tsconfig` includes `*.ts`. `svelte-check` reports 3 errors: `process` twice and `node:child_process`. Criterion 19's "`svelte-check` 0 errors" cannot pass.
     - `dev-loop.test.ts` copies **this** repository's tracked files, with no `.git`, and starts `vite dev` in the copy (READ, lines 33 to 40). Decision 16 puts the unguarded lines in this repository's `vite.config.ts`, so that server fails to start and `001`'s smoke file breaks. Criterion 19's "`001`'s to `005`'s smoke files pass" cannot pass.
   - **Why it matters:** a named fallback is written in the item page, not in the lines; the lines themselves have none. Every build outside a clone, including the app's CI image when `git` is missing, dies at config time.
   - **Fix:**
     - Make the lines guarded, and show the guarded form on the item page: `const git = (args) => { try { return execSync(…).toString().trim() } catch { return undefined } }`; `name` is `WORKERS_CI_COMMIT_SHA?.slice(0, 7) ?? git("rev-parse --short HEAD") ?? "unknown"`; `VITE_BUILT_AT` is `git("log -1 --format=%cI")`, else unset. The footer already omits a row with no value; say that `commit` "unknown" is shown as given, or omitted too. This form built and prerendered in the scratch (EXECUTED, "Re-ran").
     - Do not give the smoke scratch app the lines. Assert instead that the shell builds with Kit's default `version` and no `built` row. If the smoke test must see a commit, add `@types/node` to both fixtures' pinned packages and say so (a fixture change, with its `bun.lock`).
     - Put the guarded form in this repository's `vite.config.ts`, and say `dev-loop.test.ts` is why.

2. **High — `aria-current:underline` never matches `aria-current="page"`** (decision 7, "the current one with `aria-current="page"` set by the app… and an underline (`aria-current:underline`), so the state is shape, not colour (R19)").
   - **What is wrong:** Tailwind 4.3.3's `aria-current:` variant compiles to `[aria-current="true"]` (EXECUTED: `.aria-current\:underline[aria-current=true]`). The attribute the shell sets is `page`. So no current link is ever underlined, the state is told by nothing, and R19 is broken in silence. No check in A1 to A6 reads the underline.
   - **Fix:** `aria-[current=page]:underline`, which compiles to `[aria-current=page]` and passes the lint (EXECUTED). Add to A5 or a new A7: on `/view/app-shell/`, the link with `aria-current="page"` computes `text-decoration-line: underline` and the others do not. Note that the sidebar's current row (`005` decision 10) is told by `isActive`, not by this variant, so it is unaffected.

3. **Medium — The axe count is wrong twice** (decision 14, "`005`'s 320 + 2 pages × 2 + 9 views × 3 widths × 2 + 2 states × 2 = 382 scans"; criterion 11).
   - `005` as amended counts **364**, not 320: its review found that the suite scans every new item page at three widths (`005` decision 17, READ). The same suite (`axe.spec.ts`, the `WIDTHS` loop over `NEW_PAGES`) scans a block's item page at 360, 768 and 1280, as it does `003`'s. The decision's own words say so ("the 2 new item pages and the 9 views at 360, 768 and 1280") and then multiply the pages by 2.
   - **Fix:** 364 + 2 × 3 × 2 + 9 × 3 × 2 + 2 × 2 = **434**. Say "`005`'s 364". If the item pages are to be scanned at one width, say so and change the suite, which is the larger change.

4. **Medium — The catalogue's stops are miscounted, and the footer's lockup is undecided** (decision 14, "the catalogue's **63 stops** (the lockup, the toggle, 62 links) plus the footer's source link, **64**, no 65th"; decision 16, "The catalogue's stops become 64"; criterion 14).
   - The lockup, the toggle and 62 links are **64**, not 63; with the source link, **65**. `keyboard.spec.ts` asserts `2 + ITEMS.length` and that no stop follows (READ, lines 71 to 92), so the test changes in two places.
   - Decision 8 gives the footer's `Lockup` a `label` ("Pluto Systems") and no `href`. Without `href` the lockup is a `span` and `label` does nothing (`001` decision 22; READ `lockup.svelte`). If it is meant as a home link, it is a 66th stop and every shell view gains one.
   - **Fix:** decide. The recommendation is no link (the header's lockup is the home link; a second one per page is a second thing) and drop `label` from the footer. Write 65 in decisions 14 and 16 and criterion 14.

5. **Medium — The viewer's state buttons are 26, not 25** (decision 14, "`003`'s 16 + 4 + 5 = **25**"; criterion 18).
   - `viewer.spec.ts` counts "17 state switches" today: sign-in 4, sign-up 4, page-states 5, settings 4 (READ, line 76). `003`'s 16 is the file count, not the switch count.
   - **Fix:** 17 + 4 + 5 = **26**.

6. **Medium — The sidebar trigger has two homes, and neither sits inside the provider's context** (decision 6, item 3: "`SidebarProvider open={data.sidebarOpen}` holding `AppShellSidebar` and `SidebarInset`…, the inset's page header holding the `SidebarTrigger` and a `Breadcrumb`"; decision 9, "the header's menu button then opens **the sidebar's sheet**… the trigger is `SidebarTrigger`").
   - **What is wrong:**
     - Decision 6 renders the header (item 2) before and outside the provider (item 3). `SidebarTrigger` reads the provider's context (`005` decision 10: "the provider makes the id with `$props.id()` and shares it by context"). A trigger in the banner header has no context and throws.
     - Decision 6 puts the trigger in the inset's page header, after the sidebar in the DOM. Decision 9 puts it in the banner header, before. `005`'s preview is built on the second: "a bar above its sidebar holding the trigger… so the trigger precedes the sidebar in the DOM, as `006`'s header will" (READ, `005` decision 10 as amended).
     - `005` makes the provider `flex min-h-svh w-full`, a row, and the sidebar a `sticky top-0 h-svh` flex child. A banner header and a footer cannot be children of that row. The specification does not say what element holds what.
   - **Fix (the design lead's call on where the trigger lives):** state the DOM. The recommendation: `SidebarProvider` wraps the whole shell when `SIDEBAR` is set (skip link, header, a `flex` row of `AppShellSidebar` and `SidebarInset`, footer), and the banner header's `md:hidden` menu button **is** `SidebarTrigger` at every width, with no second trigger in the inset. That needs one change in `005`: the provider's `flex` row becomes a wrapper the shell draws, or the provider takes `flex-col` and the shell adds the row. Say which, and amend `005` decision 10 before either is built. Then A1's landmark counts and the sidebar view's stops follow from one DOM order.

7. **Medium — `app-shell` imports an item it does not name, names one it does not import, and lists packages the build cannot detect** (decision 3's table; decision 9, "one `Collapsible` group of sub-items").
   - `app-shell-sidebar` imports `#lib/registry/ui/collapsible` for the sub-items group. `collapsible` is not in `app-shell`'s `registryDependencies`, so `blocks.test.ts` check 1 fails and an app that lacks `collapsible` fails to build after `add app-shell`.
   - `kbd` is named. No shell component imports it: the shortcut's `Kbd` is inside `sidebar`'s trigger tooltip (`005` decision 10).
   - The "Packages" column gives `bits-ui` and `@internationalized/date`. `registry build` detects a package only from a file's own imports (READ, `deps-resolver.ts`). The shell's files import `#lib/registry/ui/*` and `phosphor-svelte`, so the built item carries `phosphor-svelte` alone, as `003`'s blocks do.
   - **Fix:** add `collapsible`, drop `kbd` (or name what imports it), write `phosphor-svelte` alone. Recount the distinct dependency names for `registry.test.ts`: `005`'s 31 plus `four-dot`, `theme`, `sidebar`, `breadcrumb`, `dropdown-menu`, `avatar`, `collapsible`, `message-log`, `message`, `marker`, `composer`, `code-block` = **43** (EXECUTED against `registry.json`'s 27 at `004`; `sheet`, `kbd`, `spinner`, `empty`, `alert`, `button` are already named).

8. **Medium — At `submitted` the pane shows two spinners, and says "Responding" twice** (decision 10, item 2: "a `Marker` at the end with a `Spinner` and the text "Responding" (the one busy control…)").
   - `005` decision 13 (as read): at `submitted` the composer's own button "also shows the `Spinner` (the one busy control, allowed)". The marker adds a second. The split decision allows "a spinner on the one control that is busy"; a marker is not a control.
   - The composer's `Status` sets "Responding" at `submitted` (`005` decision 13). The marker is inserted whole into the `log`, which announces additions (`005` decision 11), so a reader hears "Responding" from the log and from the status.
   - **Fix (the design lead's call):** the marker carries the text alone, no icon; or the marker is dropped and the composer's status and button are the whole state. The recommendation is the first: a static line in the log shows where the reply will land. Either way, decision 10's "the one busy control" should name the composer's button as that control.

9. **Medium — A `min-h-dvh` column never scrolls its log** (decision 10, "renders a column `flex min-h-dvh flex-col`…; `MessageLog`… `class="flex-1"`"; "Phones: full-bleed, `min-h-dvh`, the composer at the bottom").
   - **What is wrong (INFERRED from CSS):** `min-height` lets the column grow with its content. A `flex-1` child of a column with no fixed height takes its content height, so the log's `overflow-y-auto` box never overflows. The page scrolls instead. Then follow-bottom never engages, "Scroll to end" is never shown, `scroll-pb-24` protects nothing, and the composer is not at the viewport's bottom but at the page's. `005`'s L1 proved the log on its own page with a bounded box; C1 to C5 never check the pane's scrolling.
   - **Fix:** the pane is `h-dvh` (or `h-full` under a shell whose `main` sizes it), the log is `min-h-0 flex-1` (a flex child's default `min-height: auto` also stops it shrinking), and the composer keeps `shrink-0`. Add to C2: on `/view/chat/thread/` at 360 × 640 the region's `scrollHeight` exceeds its `clientHeight` and the composer's bottom equals the viewport's. Keep the iOS placeholder.

10. **Medium — The chat page's `h1` is unwritten, and `level` 1 skips a rank** (decision 10, "the title as `<h2 …>` by default, with `level` (1 for a page that is the conversation)"; decision 14, "`build/chat.html` with one `h1`"; the turns are `MessageHeader level={3}`).
    - The smoke test asserts one `h1` in the prerendered chat page, but no decision gives that heading's text, and the copy table has none.
    - If the page passes `level={1}`, the turns' `h3` sit under an `h1` with no `h2`. axe's `heading-order` is under the `best-practice` tag the suite runs (READ, `axe.spec.ts` `TAGS`). If the page keeps the pane's `h2`, it needs an `h1` of its own above it.
    - **Fix:** the page file renders `<h1>` with written copy ("Chat", or the app's name is the lockup, so not that) above the pane; the pane stays `h2`; the turns stay `h3`. Add the string to decision 11's table. Say that `level` 1 is for an app whose turns are set to `level` 2.

11. **Medium — Three tests change that the specification does not name** (decision 4, "`generated.test.ts`'s "exactly 2 selectors in the reduce block"… becomes 3"; decision 12, "`pages.ts`'s `openView` waits for `[data-view-ready]` on `main` or `body`"; decision 14, `blocks.test.ts` checks 5 and 9).
    - `registry-add.test.ts` assertion 8 asserts the **installed app's** reduce block "holds only `html:root` and `*, ::before, ::after`" (READ, line 209). It becomes 3 selectors too, or `001`'s smoke file fails.
    - `axe.spec.ts` line 59 and `viewer.spec.ts` line 56 wait for `main[data-view-ready]` inside the viewer's frame, not only `pages.ts`. A shell view that marks `body` never satisfies them.
    - `blocks.test.ts` check 5 matches page files against `\+(page|error)\.svelte$` and components against `<block>-[a-z-]+\.svelte$`; check 9's `appPath` regex requires `.svelte`. `+layout.svelte`, `+layout.server.ts` and `chat-types.ts` fail all three as written.
    - **Fix:** name the three in decision 14. For the second, the simpler route is to mark the shell views' own `<main id="main">` with `data-view-ready` (the views copy the markup, so they can), and leave every selector alone; if finding 14 is taken, mark `body` and change the three selectors.

12. **Medium — Decision 8 gives two mechanisms for the date, and decision 6 a third name** (decision 8: "`define: { __BUILT_AT__: JSON.stringify(execSync("git log -1 --format=%cI")) }`… **The date is read through `import.meta.env.VITE_BUILT_AT`**, set in the same `vite.config.ts` through `process.env`"; decision 6: "the footer from `$app/env`'s `version` and the `__BUILT_AT__` constant").
    - A builder cannot write both. The `process.env` route works and needs no declaration (EXECUTED: the value reached the prerendered HTML; `svelte-check` was clean on the layout). The memo ran only `define` (§4.2) and said so.
    - **Fix:** one mechanism, `VITE_BUILT_AT`, in decisions 6 and 8 and the Design tree; drop `define` and `__BUILT_AT__`; mark the `process.env` route EXECUTED by this review. Say what the footer shows when the variable is unset (no `built` row) and when `version` is Kit's default (a 13-digit timestamp, `001`'s memo §4.2): the recommendation is to pass `commit` only when the name is not all digits, so a bare app never prints a timestamp as a commit.

13. **Medium — Shipped copy is missing from the table** (decision 11; `003` decision 15: every string a block ships is written in the specification).
    - Not written: the example page's `h1` and its two section headings (decision 6, "the example page with two sections"); the three nav labels in `LINKS`; the sidebar's section name, the "Search" input's label, the two group labels, the menu items and the sub-items (decision 9); the breadcrumb's items; the sheet's visually hidden title (the app's name: give the shipped value); the account menu's example name and email (`003` says Ada Lovelace and `example.com`); the chat page's `h1` (finding 10); the stub's reply text with its Python fence, and the "Stopped" marker's full text (decision 10 says "Stopped: out of fuel" once and "Stopped" elsewhere); the `appName` the shipped layout passes.
    - **Fix:** add each to decision 11's table, lint them (`003` decision 15's rule), and keep "Ada Lovelace" and `ada@example.com`.

14. **Medium — The views copy the layout's markup, so the shipped `+layout.svelte` is never rendered on our site** (decision 12, "Each view composes the layout component with the page… (the views compose `AppShellHeader`, `AppShellSidebar`, `AppShellFooter` directly inside a copy of the layout's markup…)").
    - The sentence says both "composes the layout component" and "a copy of the layout's markup". If a copy, the shipped layout and its server load are rendered only by the smoke test, and A1 to A6 test four copies, not the file an app installs. `003`'s page-file view imports the page file itself.
    - A layout component renders from a page with `data` and `children` (EXECUTED: `<Layout data={{ sidebarOpen: true }}>{#snippet children()}…{/snippet}</Layout>` prerendered). So the default view can render the shipped layout around the shipped page.
    - **Fix:** `/view/app-shell/` imports and renders the shipped `+layout.svelte` with `data={{ sidebarOpen: true }}` and the shipped `+page.svelte` as children; the three state views copy the markup, as `003`'s state views do. Then A6 reads the installed file, and finding 11's `data-view-ready` goes on `body` for that one view, or on a wrapper the view adds.

15. **Low — Counts left to landing that can be fixed now, and two that are not derivable** (decision 14; decision 19).
    - The shell and chat views' keyboard stops are "fixed by the builder… and recorded in the Landing notes". `003` wrote every view's stops in its specification (`VIEW_STOPS`). The views are written here in enough detail to do the same: `/view/app-shell/` at 1280 is the skip link, the lockup, 3 nav links, the toggle, the page's links (say how many), the source link; and so on. Write them, with the total.
    - "7 of 7 behaviours": decision 14 lists eight (the skip link, the sheet, the account menu, "Latest reply", send, stop, the status words, Retry). "10 assertions × 2": the smoke paragraph lists six to eight depending on how they are split. Number each.
    - The deferrable list (decision 19) drops a view: say the counts then fall by 1 view, 1 page, 6 scans, 2 themes, 1 state button, and that the Landing notes record which.
    - The smoke test should assert that the installed `app.css` holds `@utility mark-entrance` with its four nested rules, `@utility groove-b`, and the three-selector reduce block once: the CLI's merge of a utility with nested rules was not executed by the memo or by this review.

16. **Low — Anchors in a root layout fail the build of every other page** (decision 2, "The shell's example links and the sidebar's items point at same-page anchors"; decision 5's "moved to the app's root by hand").
    - SvelteKit's prerenderer fails on a fragment link whose id is not on the page (`003` decision 4). A layout's links are on every page under it. In the scratch, a layout linking `#overview` with no such id failed with `prerender_missing_id` (EXECUTED). At `/app-shell` the example page carries the ids, so the shipped block builds. Moved to the root as shipped, every other page of the app fails.
    - **Fix:** the item page's "one line" about moving the files says to replace `LINKS` and the sidebar's hrefs first, and why. The `(shell)` views each render the example page, so they are safe.

17. **Low — Small contracts against `005` and `002`.**
    - **The menu's name** (decision 7): "the menu is named by a `DropdownMenuGroupHeading`". In `005` decision 7 the heading names the **group**; the menu is named by its trigger ("Account menu") or a `label`. Reword.
    - **Link items**: "Settings" and "Sign out" are hrefs. `005` decision 7 says nothing of link items; say they render through the item's `child` snippet as `<a>`, so the role stays `menuitem` and the link rule's `/` holds.
    - **The alert's role** (decision 10, item 3): `002`'s destructive alert carries `role="alert"` by default (READ, `alert.svelte`), an assertive region inside the polite log. The patterns memo allows assertive for an error that halts the conversation. Say so, or pass `role={null}` and let the log announce it; "announced as an added node" describes only the second.
    - **A sticky header under a sticky sidebar** (decision 6, `STICKY`): `005`'s sidebar is `sticky top-0 h-svh`. With `STICKY` set, the sidebar's top 64 px sit under the header once the page scrolls. The item page's sticky line should add `top-16` for the sidebar, or say `STICKY` is for the no-sidebar shell.
    - **The head script twice** (decision 6; decision 12): the root layout renders `ThemeScript` (`005` decision 16); a shell view that copies the layout's markup renders it again. Say the views omit it.
    - **"Latest reply"** (decision 10, item 4): shown "when the last turn is an assistant's and `status` is `ready`" is permanent after every reply. The chat memo §5.4 shows it "while the last reply is not the one in view". Either is defensible; say which and why.
    - **The `submitted` state** has no view, so the marker and the composer's spinner are never seen by C1 to C9 or axe. Add `/view/chat/submitted/` or say why not.

18. **Low — Citations and wording.**
    - Decision 10: "decision 21's placeholder" — there is no decision 21; the placeholder is decision 20.
    - Decision 14, unit file 3: "`003`'s 6 plus …: **10**" lists four names after "plus"; fine, but "the changelog's `0.6.0` entry naming 4 of 4" belongs with decision 15's list, which it matches.
    - Decision 8: "The memo ran `define`; `import.meta.env` is its mechanism 3, documented and not run" is now run (this review); relabel.
    - Decision 4: the memo's selector is `.mark-entrance > [data-slot…]` (child); the specification's is a descendant. Either works; say the descendant form was chosen for the lockup's nesting.
    - Decision 14, browser file 4: "`/view/app-shell/signed-in/`: the account menu" is a stop, not a behaviour; the behaviour is "opens and returns", listed later. One list.
    - Decision 2's "which the item page says in one line" and decision 5's "The item page names the three things" are item-page copy; the sentences themselves should be written (finding 13).

## Constitution checks

- **§4.1 source, not a package:** holds. The layout reads `$app/env` and `import.meta.env`, which are the app's framework, not this repository. The footer's values are the app's. The five lines are the app's, once guarded (finding 1).
- **§4.2 in tandem:** holds. Criterion 24 is in `wasi-python-dev`.
- **§4.3 tokens are the one source:** holds. Every class string in the specification lints clean (EXECUTED); the entrance's numbers become tokens; `--_ox`/`--_oy` are unitless multipliers, which L16 passes.
- **§4.4 accessible by default:** findings 2, 6, 8, 9 and 10 are defects; finding 17's alert role is a choice to write down. The skip link, landmarks, two `nav` labels, the sheet's name, the log's names and the `tabindex="-1"` heading match the patterns memo.
- **§4.5, §4.6:** hold. No new package; `phosphor-svelte` is named.
- **§6, break an installed app silently:** finding 7 (`collapsible` missing) and finding 16 (the anchors after the move) are the two ways an installed app breaks; both are fixable in the specification. `four-dot`'s optional prop is correctly "not an interface change".
- **`decisions.md`, the `006` calls:** six of seven match (the entrance from tokens with the third reduce rule; the layout as the page file with the cookie load; the 64 px grooved header; the footer's rows and tagline; no avatar and no markdown; the `(shell)` group). The seventh, "the shell's header is the one place that sets" the entrance, holds. The `005` call "the sidebar is a `nav` landmark… the trigger is a disclosure" is bent by finding 6 until the DOM is written.
- **`005`'s decisions, as amended:** `theme`, `sheet`, `breadcrumb`, `message-log`, `message`, `marker` and `composer` are used as defined. `sidebar` is used as defined except finding 6. `dropdown-menu` except finding 17's naming. No `005` item is edited.

## Disposition

Written by the author (the orchestrating session, as design lead), 2026-11-01. Every finding is fixed in the specification; two reach back into `005` (findings 6 and 17), whose text was amended the same day and whose builder was told mid-run.

| # | Disposition |
|---|---|
| 1 | Fixed. One guarded `git()` helper; `version.name` from `WORKERS_CI_COMMIT_SHA`, then `git`, then "unknown"; `VITE_BUILT_AT` only when `git` answers; the smoke scratch gets no lines and asserts no `commit` and no `built` row; this repository's `vite.config.ts` takes the guarded form because `dev-loop.test.ts` runs a copy without `.git` (decisions 8, 14, 16). |
| 2 | Fixed. `aria-[current=page]:underline`; A7 reads the underline (decisions 7, 14). |
| 3 | Fixed. 440 scans, on `005`'s 364, the item pages and views at three widths, and now 10 views (decision 14, criterion 11). |
| 4 | Fixed. 65 catalogue stops; the footer's lockup has no `href` and no `label` (decisions 8, 14, 16). |
| 5 | Fixed. 27 state buttons, with the `submitted` view (decision 14, criterion 18). |
| 6 | Fixed, as a design call: `SidebarProvider` wraps the whole shell and is a column; the sidebar's row is the consumer's `div`; one trigger, in the header, at every width; `005` decision 10 amended accordingly (decisions 6, 7, 9). |
| 7 | Fixed. `collapsible` named, `kbd` dropped, packages `phosphor-svelte` alone; 43 distinct names (decision 3). |
| 8 | Fixed. The marker carries text alone; the composer's button is the one busy control (decision 10). |
| 9 | Fixed. The pane is `h-dvh` (or `h-full`), the log `min-h-0 flex-1`, the composer `shrink-0`; C2 checks the scroll and the composer's bottom at 360 × 640 (decision 10). |
| 10 | Fixed. The page renders a visually hidden `h1` "Chat"; the pane's `level` is for an app whose turns are `level` 2 too (decisions 10, 11). |
| 11 | Fixed. The three tests are named: `registry-add.test.ts`'s reduce count, the two frame waits, `blocks.test.ts`'s regexes (decisions 12, 14). |
| 12 | Fixed. One mechanism, `VITE_BUILT_AT` through `process.env`, marked EXECUTED by the review; `commit` passed only when not all digits (decisions 6, 8). |
| 13 | Fixed. The copy table holds every shipped string, with Ada Lovelace and `ada@example.com` (decision 11). |
| 14 | Fixed. `/view/app-shell/` renders the shipped layout with `data` and the shipped page as `children`; the state views copy the markup without `ThemeScript` (decision 12). |
| 15 | Fixed. The views' stops are written (70 over 10 views; 153 over 28); 8 behaviours and 10 smoke assertions numbered; the deferral's deltas stated; the smoke asserts the merged utilities (decisions 14, 19). |
| 16 | Fixed. The moving instruction is written and says to replace the anchors first (decisions 2, 6). |
| 17 | Fixed. The trigger names the menu; link items through `child`; the alert is `role={null}`; `STICKY` is for the shell without a sidebar; the preview's `ThemeScript` moves to the `(site)` and `(view)` layouts (`005` decision 16 amended); "Latest reply" follows a `newReply` flag the app sets; a `submitted` view is added (decisions 6, 7, 10, 12). |
| 18 | Fixed: decision 20; the mechanism relabelled; the descendant selector explained; the stop and behaviour lists separated. |

**Verdict after disposition: fit to build, once `005` is built.**
