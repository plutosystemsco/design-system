# Review of 027b — Batch A's interactive items: pagination, search field, tag (the built change)

Reviews the `027b` part of [`specifications/027-batch-a.md`](../specifications/027-batch-a.md), with its Landing notes under "027b" as the builder wrote them on its branch (14 deviations). This reviewer wrote neither the specification nor the code (constitution §5).

- **Date:** 2026-11-16
- **Status:** in review. Land after fixes: findings 1 to 6 are settled before the merge; findings 7 to 10 are write-ins; finding 11 is the design lead's at the checkpoint; 12 holds notes. The merge notes below apply because `023` is now on `release/0.13.0`.
- **Reviewer:** a reviewer; not the author
- **Reviewed:** branch `worktree-agent-ad07a920cc7526ca7` (worktree `.claude/worktrees/agent-ad07a920cc7526ca7`): `98b7fe3` (the build), `7575cd0` (merge of `release/0.13.0` at `70336f4`), `07f029b` (the gate's fixes, the Landing notes, the scorecard). The net change is `git diff 70336f4 07f029b`: 110 files, +5,786 / −193.
- **Re-ran:** Bun, 2026-11-16, the machine at a load average of 40 to 90 on 10 cores. Nothing in the repository was written but this file. The worktree's `git status` was clean before and after. `bun run check` ran in the worktree. Everything else ran in `git clone --shared` copies in the session scratchpad (`review-027b/tree` at `07f029b`, `review-027b/base` at `70336f4`, `review-027b/merge`, a trial merge with `release/0.13.0` at `5971a1a`). Servers: `vite preview` on **5741** (the build), **5761** (the base), **5771** (the trial merge); `vite dev` on **5751** for mutations. 5199 was not used. Scripts, logs and screenshots are in `review-027b/`.
  - `bun run check`, **in the worktree** → 2,408 files, **0 errors, 0 warnings**.
  - Unit, the ten touched files (`pagination-pages`, `registry`, `registry-comments`, `examples`, `mutations`, `sr-items`, `cost`, `breadth`, `search`, `literals`) → **484 pass, 2 skip, 0 fail**.
  - The three new spec files in `chromium-light`, `chromium-dark`, `firefox-light` and `webkit-dark` → **158 passed, 6 skipped** (each skip an `ENGINE_ONLY` entry), 0 failed (28.8 s).
  - `batch-a.spec.ts` and `keyboard.spec.ts`, the 027b rows, in `chromium-light` and `chromium-dark` → **222 passed** (tests 5, 50, 51, 52 and 53).
  - **axe on the three pages** (`axe.spec.ts`, `/components/{pagination,search-field,tag}/`, `wcag2a` to `wcag22aa` and best-practice, at 360, 768 and 1280) in `chromium-light`, `chromium-dark`, `firefox-light` and `webkit-dark` → **36 of 36, 0 violations**.
  - **Screen readers, dry** (`SR_DRY=1`, `playwright.sr.config.ts`, the three files, `webkit`, `chromium`, `firefox`) → **30 of 30**, the builder's figure. What that proves is below ("The screen-reader tests").
  - **Failing first, against the base build** (`70336f4`, the three spec files copied in, `chromium-light`) → **40 failed, 1 skipped** (test 18's WebKit-only case), **0 passed** (note 12 says what that shows).
  - **Mutations,** five of mine, each on `vite dev` with the one test file named and `--retries=0`, the source restored after each (`git status` clean): see "The tests".
  - **The trial merge with `023`** (`release/0.13.0` at `5971a1a`, which holds `667b1cf`, "Merge 023"): four conflicts, then `023`'s `api-described.test.ts` fails three tests on 027b's files (finding 4). `api-table.spec.ts`, `build-output.spec.ts` and the three new spec files on its build: 83 passed, 1 failed, the failure an artefact of the scratch commit's author name ("author r"), not of either branch.
  - **Screenshots** for the checkpoint: 80 full-page shots (the three pages and their 17 example views, at 1440 and 390, light and dark), plus state, zoom and forced-colour shots, in `review-027b/shots/`.
  - **Not run by me:** the full unit, e2e and smoke suites, `release-check.ts`, the perf project, the cost run and the bench scripts. Their figures are the builder's.

## Acceptance criteria against evidence (part b)

1. **The items** — met. READ: eight files; `registry.json`'s three entries match decision 1. EXECUTED: tests 1 and 4.
2. **Names and breadth** — met. EXECUTED: test 6; 35 of 40.
3. **Pagination's range** — met. EXECUTED: tests 8 to 12.
4. **Pagination** — met as tested, in three engines. Test 24 has no teeth under forced colours (finding 3), and the focus restore it was written for cannot run (finding 9).
5. **Search field** — met as tested. Clearing before the pause is untested (finding 5).
6. n/a (part a).
7. **Tag** — met as tested, but test 38 cannot tell the owner's "next, then previous" from Primer's "previous, then next" (finding 1).
8. and 9. n/a.
10. **Depth, type and axe** — met. EXECUTED. Deviation 9's `table-row` skip is sound and hooked to `031b`. Deviation 7's `meta.axe` is read by nothing (finding 7).
11. **Keyboard** — met. EXECUTED: the 027b rows, both schemes.
12. **Described** — met for `023`'s absence; **not met after `023`'s merge** (finding 4).
13. **The pages** — met. READ: decision 12's examples in order, two pairs per page, each don't inside `inert`, "Your part" holds decision 12's musts. The pagination page's must about naming each pager points at `strings.label` (finding 2).
14. **The changelog** — met. READ and EXECUTED (test 2).
15. **Three engines** — met for the three spec files (EXECUTED in one Firefox and one WebKit project, both schemes in Chromium; the builder ran all six: 902 passed).
16. **Screen readers** — not yet: waits for the owner's push. The dry run proves pages, locators and focus only; two of the ten tests cannot fail on the fault they name (finding 6).
17. **The cost** — met. READ: three fixtures, three entries, three budgets; each response under 200 ms. The overage is acceptable (below).
18. **The suites** — `check` and the touched unit files EXECUTED; the rest the builder's. Expectations moved outside the named files by count only (deviation 14), checked: each moves by three items.
19. **Tests first** — credible for presence, weak as evidence of teeth (note 12). The mutations below are the better proof, and two survive.
20. **The checkpoint** — not walked. Waits for the design lead; the screenshots are ready (below), and finding 11 is for it.
21. **The scorecard** — met at `7575cd0`: row 1 moves 3 → 4 (35 of 40), rows 1 to 14 total 36. It must be re-run at the landing tree, after `023` (merge notes).

## The items, read against the specification and the references

**Pagination** (`pagination/pagination.svelte`, `pagination-pages.ts`).

- *Semantics.* A `nav` named "Pagination", a `ul` of pages, `aria-current="page"` on the current one, each page named "Page N" by a visually hidden prefix, the ends "Previous page" and "Next page" with `rel="prev"` and `rel="next"` on links. This is GOV.UK's pagination, nearly word for word, and better than Primer's in one way: the hidden "Page " prefix instead of a bare number. The ellipsis is `aria-hidden`; test 13 sees five list items for `1 … 4 5 6 … 12`.
- *Links or buttons.* Link mode when `href` is given, button mode otherwise, both through `buttonVariants`, so they look the same. The current page is `secondary` plus `font-bold`: a border and a weight, not a colour. In both schemes this reads well (`ex-pagination-*`).
- *Keyboard.* Tab only. No arrow keys (test 22). bits-ui's arrow keys were rightly declined.
- *The ends.* Omitted, with the slot held by an `invisible`, `inert`, `aria-hidden` copy as wide as the translated word. The pages do not move between page 1 and page 2 (test 16; seen in `ex-pagination-ends-1440-*`).
- *Focus.* Kept on the pressed control; moved to the current page, or narrow to the other end, when the pressed end vanishes (test 18 in three engines). The guard on "focus was inside the nav" is live: removing it fails test 15a's click case and test 18's WebKit case (M3).
- *Speech.* A `Status`, present from the first render in button mode, is written one frame after the page changes. P1's rule is right. It also speaks when an app changes `page` itself (a filter that resets to page 1): decision 3 says "after `page` changes", so this is as designed.
- *The switch.* Static class maps by size and siblings; test 20a sweeps 18 pagers from 320 to 1440 px. The narrow row is honest (`ex-pagination-narrow-*`, `ex-pagination-small-390-*`).
- *Not as the references:* under forced colours the current page loses its border as a mark (finding 3), and an app's own `aria-label` is dropped (finding 2).

**Search field** (`search-field/search-field.svelte`).

- *Semantics.* An `input type="search"` (`searchbox`) in an `input-group`, the magnifier `aria-hidden`, WebKit's own cancel button hidden. No landmark of its own: the `site` example wraps it in `<search>`, the filter does not, and the `landmark` pair teaches it. That is the right placement: a `search` landmark belongs to the site's search, not to every filter box.
- *Clear.* Shown while there is text and the field is editable; a Tab stop; named "Clear search" with `aria-controls`; sets the DOM value, then `value`, dispatches `input`, calls `onclear`, and returns focus. Carbon's and Spectrum's model. Test 26 holds the order of the values when the event fires.
- *Escape.* Clears a filled, editable, non-composing field and stops propagation, so a bits-ui dialog stays open (test 27; M-stop killed by the builder). Passes on otherwise (26a, 27a).
- *The count.* Spoken at the later of the 750 ms pause and a string `results`, through an empty frame so an unchanged count is heard again (test 29, S2). `resultsFor` drops a late answer to an older query (29a). Primer's rule, built in. The design is careful and the two-variable contract is documented on the page, in the doc comment and in the changelog.
- *The settle time.* 750 ms is INFERRED and stays to be tuned by the screen-reader run, as the specification says. Nothing here argues against it.
- *Not as specified:* "Clearing the field cancels the timer, and nothing is written" holds in the code, twice over, but no test sees it (finding 5).

**Tag** (`tag/tag.svelte`, `tag-group.svelte`).

- *Removable.* A 24 px ghost `Button` named "Remove Design" (Primer's rule; Carbon's bare "Dismiss" is the worse reference). Enter, Space, Delete and Backspace remove. Focus after a removal: the control now at the removed control's index, then the one before, then `fallback`, then the list, counted among `[data-tag-control]` only, so static tags hold no place.
- *A WebKit click.* I checked whether the group steals focus from the add input when a tag is removed by mouse. It does not: WebKit blurs the input at mousedown, as it does for any button, so focus is already on `body` when the group moves it (EXECUTED in three engines; `review-probes/probe.ts`). No finding.
- *Pressable.* One `button` with `aria-pressed`, a check while pressed, the primary fill. Carbon's selectable tag, with a shape for the state. Test 40 runs the check under forced colours too (deviation 13).
- *The group.* A `ul` with an explicit `role="list"` (WebKit), named by the app, `tabindex="-1"` so it can take focus when it empties. Sound.
- *Not as decided:* the owner's Q7 rule is untested where it matters (finding 1).

## The deviations

1. **`from-a-server`** — sound; SvelteKit's `server_only_import` is real.
2. **No `tailwind-variants` import of its own** — sound, `027a`'s deviation 2. The items still pay for `tv` through `buttonVariants` (cost, below).
3. **The guard reads focus in the click handler** — sound, but its text should say one more thing. A WebKit click blurs the focused element at mousedown, so at `click` the guard sees `body` even when focus was on another page of the same pager. Decision 3's `pointerdown` reading would have seen the old page and moved focus to the pressed one; the build leaves it on `body`, as WebKit does for every button (EXECUTED: Tab to "Page 5", click "Page 12": WebKit `body`; Chromium and Firefox "Page 12", natively). Add that sentence to the deviation.
4. **A small page is `min-w-8 px-1`** — sound. Half steps are off the spacing ladder, so `px-1.5` was not open, and `px-1` keeps one and two digits at 32 px. Three digits grow to about 35 px and four to about 43, so "still fits 1000" holds; at 100 pages and more the row's width moves by a few pixels as the page moves, well inside the switch table's 48 to 88 px margins. Recorded for the checkpoint, not a finding.
5. **Each example's pager is named through `strings.label`** — the need is real (several `nav`s named "Pagination" on one page fail `landmark-unique`), but the mechanism is wrong (finding 2).
6. **`data-slot="tag-toggle"`** — sound.
7. **`meta.axe` on a don't** — the idea is sound, but nothing reads it (finding 7).
8. **The `label` don't breaks in words** — sound: axe's `label` rule passes an input with a non-empty placeholder, so axe cannot be the witness. `dont-landmark` names its three landmarks so `landmark-unique` stays quiet; acceptable, since the fault it teaches is the landmark per filter, not the missing name.
9. **Test 50 skips `table-row` and `search-field/disabled`** — sound, the same rule as `027a`'s `card`, and hooked to `031b`.
10. **Hidden fixtures** — sound, `027a`'s test 45a precedent.
11. **The cost targets are the item's own slots** — sound: a fixture cannot mark a node the item draws. Pagination's state check finds "Page 6" in the list before Next's `data-pagination-to="6"`, so it reads the right node.
12. **Engine helpers** — sound; each skip carries its reason.
13. **Test 40's forced-colours half** — sound, and better than the specification asked.
14. **Counts outside the named files** — checked: each moves by the three items.

## The tests

**Failing first.** The three spec files against the base build: 40 failed, 1 skipped, 0 passed, in line with the Landing notes. But they fail because the example pages do not exist, so the red run proves presence, not teeth (note 12). The mutations are the real evidence.

**Mutations.** Five of mine, run here (M1 to M5), and two rows that report the builder's (M6, M7).

| # | The break | Test | Result |
|---|---|---|---|
| M1 | the group focuses the previous control before the next (`controls[index - 1] ?? controls[index]`, Primer's order) | 38, all five ways, Chromium and WebKit | **survives** (finding 1). A probe that removes the middle tag sees "Remove Design" instead of "Remove Writing" |
| M2 | Clear and Escape no longer cancel the pending count (no `clearTimeout`, no `spoken = true` in `clear()`) | `search-field.spec.ts` and the keyboard rows, 16 tests | **survives** (finding 5). A probe that types "des" and presses Escape within 200 ms hears "16 results" written to the status |
| M3 | the pagination guard removed (`if (!ref) return;`) | 15a, 18 | killed in WebKit: 15a's click case and 18's WebKit case. Chromium and Firefox focus on click, so they cannot see it, rightly |
| M4 | `9-pagination-status.patch` | P1, dry | **passes dry**: the dry run judges no speech (finding 6) |
| M5 | `10-tag-focus.patch` | T1 to T3, dry | killed: the three record focus facts |
| M6 | the builder's: no focus restore for a pressed page | 15a | survives, and cannot be killed (finding 9) |
| M7 | the builder's other five (no focus move at the end, `resultsFor` ignored, no empty frame, no `stopPropagation`, the status patch on test 19) | as the Landing notes | killed, as reported; not re-run |

**The screen-reader tests.** `022`'s fixtures judge a dry run only by DOM facts (`sr.focused`, `sr.fact`), and a dry window lasts 200 ms. So under `SR_DRY`:

- P2, P3, S3 and T1 to T3 check where focus lands: real evidence of the focus half.
- **P1, S1, S2 and S4 assert nothing** but that the page loads and the locators resolve. Their windows close at 200 ms, before the search field's 750 ms pause, so the count is not even written inside them. M4 passes dry. This is `026`'s precedent (toast's live tests record no facts either), so it is not the builder's fault, but "30 of 30" should be read as "6 focus facts and 30 smoke runs".

Read as tests a reader will run:

- P1, S1, S2, S3, P3 and T1 to T3 are well formed: each phrase can only come from the behaviour it names.
- **P2 cannot fail on a lost focus.** Its rule is F1 "Page 12". The status says "Page 12 of 12" in the same window, and `spokenAt` matches a phrase that contains the text. So a pager whose focus fell to `body` would still pass P2 (finding 6). The real run ignores `sr.focused()`.
- **S4's `unspoken` half is vacuous.** S4 types "des" in one go. The example asks its server only after its own 750 ms pause, so only "des" is ever asked, and "12 results" never exists to be spoken. Only test 29a's second run makes a late answer to an older query (finding 6).
- T1 and T2 inherit finding 1: neither removes a tag that has both neighbours.

## Doc comments (`023`'s rules)

Every prop, every `Strings` member and the context member has one comment block, in the house voice, variant unions inline. Read against what the code does:

- `Pagination.href` does not say it is read once, at the first render (`pagination.svelte:114`). An `href` that arrives after hydration is ignored, and one removed later leaves buttons whose clicks do nothing (`onclick` returns while `buttonMode` is false). Finding 10.
- `Pagination.onpagechange` says "Called after a page or end button is pressed". It is not called when the current page is pressed (`go()`, `to !== current`). Finding 10.
- `Pagination.page` says "Clamped to 1 to `pages`". What is shown is clamped; the bound value is not. Finding 10.
- `Pagination.strings` is the place deviation 5 names landmarks. That changes with finding 2.
- `SearchField.results` is 66 words; `023`'s V4 allows 40 (finding 4).
- `PaginationItem`'s members (`type`, `page`, `key`) have no comments; `023`'s test 3 requires them (finding 4).
- The code comment above `oninput` (`search-field.svelte:117`) says "a preventDefault there stops the item". `input` is not cancelable, so `defaultPrevented` is always false there. True for `onkeydown`, not for `oninput`. Finding 10.
- `Tag`'s "and every attribute of an element" lands on the `li` or `span`, not on a pressable tag's button. An app's `aria-describedby` meant for the toggle goes to the list item. Say so in the `Tag` doc comment or the page. Finding 10.
- The rest are accurate: `endSuffix` says it starts with a space; `fallback` says what happens without it; `resultsFor` and `onclear` say exactly what the code does.

## The cost

| Item | JS alone | Of which: runtime, `tailwind-variants`, own | Estimate | Budget |
|---|---|---|---|---|
| `pagination` | 12.6 kB | 5.1, 4.1, 1.9 | 9 to 12 | 13.6 |
| `search-field` | 13.4 kB | 4.2, 4.2, 0.9 | 12 to 15 | 14.5 |
| `tag` | 13.8 kB | 5.8, 4.1, 1.0 | 10 to 13 | 14.8 |

(READ, `scripts/cost/report.json`'s breakdowns, gzipped.) **Acceptable.** The estimates were INFERRED. The overage is Svelte's runtime and `button`'s `tv` recipe, which an app that already has `button` pays once; each item's own code is 0.9 to 1.9 kB. Hydration is 27 to 40 ms and each response 43 to 44 ms, far under 200. One saving is open and optional: `Tag` renders Kuiper's `Button`, which brings `spinner` (0.2 kB) and `Button`'s component code; a plain `<button>` with `buttonVariants`, as pagination does, would save about 0.7 kB. Not asked.

## The pages, seen

Screenshots at 1440 and 390, light and dark, of each page and each example (`review-027b/shots/page-*`, `ex-*`), and of the states the checkpoint names (`state-*`, `zoom-*`, `forced-*`).

- **The parts are at the house standard.** The pager's current page reads as a shape in both schemes; the ends hold their width; the footer row and the narrow card are clean; `sm` under the dense table sits right. The search field's Clear is quiet until focused, and its ring sits inside the group's edge. Tags have solid `border-input` edges and a clear pressed state with its check.
- **Three things for the design lead** (finding 11): the remove button's ring crosses the tag's own border; a pressed tag grows by its check and pushes the row; under forced colours the current page is marked by weight alone (finding 3).

**The three files to look at first:**

1. `/private/tmp/claude-501/-Users-claygendron-Git-Repos-design-system/7b613866-3b2d-4829-bdd1-f2b35ebc0fd1/scratchpad/review-027b/shots/forced-pagination-links-1440-light.png` — finding 3: every page has a border under forced colours.
2. `/private/tmp/claude-501/-Users-claygendron-Git-Repos-design-system/7b613866-3b2d-4829-bdd1-f2b35ebc0fd1/scratchpad/review-027b/shots/zoom-tag-remove-focus-light.png` — finding 11: the remove button's focus ring over the tag's edge.
3. `/private/tmp/claude-501/-Users-claygendron-Git-Repos-design-system/7b613866-3b2d-4829-bdd1-f2b35ebc0fd1/scratchpad/review-027b/shots/ex-pagination-ends-390-light.png` — the narrow form in link mode: the ends, the summary, and what a 390 px reader gets.

## Findings, most severe first

1. **Medium. The owner's Q7 rule, "next, then previous", has no witness.** (`tests/e2e/tag.spec.ts:59–99`, test 38; `tests/sr/tag.sr.ts`, T1 and T2; `tag-group.svelte:55`)
   - **The defect.** Every removal in test 38 takes the first tag, the last tag, or the only removable tag. In each case only one neighbour exists, so "next first" and "previous first" give the same focus. The specification's own test 38 and T1 have the same gap; the builder followed them.
   - **Evidence.** M1, Primer's order, passes test 38 by all five ways in Chromium and WebKit. A probe removing "Research" from Design, Research, Writing focuses "Remove Writing" as built, and "Remove Design" under M1 (EXECUTED, `review-probes/middle.ts`).
   - **Fix.** Add a case to test 38 on `removable`: remove "Research", the middle tag, and focus is on "Remove Writing". Change T1 to remove the middle tag ("Remove Writing" is spoken), keep T2, and regenerate `expected.json` with `write-expected.ts` (T1's title changes). Seen failing under M1.

2. **Medium. Pagination drops an app's own `aria-label`, so deviation 5 names landmarks through `strings`.** (`pagination.svelte:269–276`; the six example files; the page's "Your part", `+page.svelte:131–134`)
   - **The defect.** `aria-label={s.label}` comes after `{...restProps}`, so it wins. `PaginationProps` accepts `aria-label` (it extends `HTMLAttributes`), and the item silently replaces it with "Pagination" (EXECUTED: `<Pagination aria-label="Article pages" …>` renders `aria-label="Pagination"` in all three engines). `027a`'s finding 10 was the same kind of defect: an attribute passed through `...rest` that the item quietly overrides.
   - **Why it matters.** A page with two pagers (above and below a table) is the common case. The natural code fails `landmark-unique`, and the page tells apps to name a landmark through a translation table. `strings` is for words a translator changes once per locale; a landmark's name changes per instance. GOV.UK keeps the two apart: its pagination takes the landmark's name as its own parameter (`landmarkLabel`, default "Pagination").
   - **Fix.** Let the app's name win: `aria-label={restProps["aria-labelledby"] ? undefined : (restProps["aria-label"] ?? s.label)}`, or place `aria-label={s.label}` before the spread. Name the examples with `aria-label`; keep `strings.label` as the translated default. Change the "Your part" bullet to "name each with `aria-label`". Add a line to test 13: a pager given `aria-label` is the one `navigation` of that name. Update deviation 5's text.

3. **Medium. Under forced colours the current page is marked by weight alone, and test 24 cannot see it.** (`pagination.svelte:236–241`; `tests/e2e/pagination.spec.ts:594–622`, test 24)
   - **The defect.** Every page is a ghost button with a transparent border. Under forced colours, Chromium paints transparent borders in the system colour, so every page, Previous and Next draw the same 1 px `LinkText` border (EXECUTED: each page's `border-top-color` is `rgb(0, 0, 159)` in light and `rgb(255, 255, 0)` in dark; seen in `forced-pagination-links-1440-*`). The current page differs only by 700 against 500. Decision 13 promised "keeps its bold weight and border"; it keeps its border, but the border no longer marks it.
   - **Why test 24 passes.** It asserts the current page has a solid, non-transparent border, and never compares it with another page. That is `027a`'s finding 7 again, in kind: presence asserted where distinction is the guarantee.
   - **Fix.** Give the current page a mark the others lack under forced colours, from the ladder or recorded sizes: `forced-colors:border-2`, or `forced-colors:underline forced-colors:decoration-2 forced-colors:underline-offset-4` (sizes already recorded by `027a`). System colours stay `028`'s. Test 24 then asserts the current page's mark differs from "Page 4"'s (border width, or `text-decoration-line`), in Chromium and Firefox. Seen failing on today's code first.

4. **Medium. After `023`'s merge, three of `023`'s tests fail on 027b's files.** (`pagination-pages.ts:6–7`; `search-field.svelte:21`; EXECUTED on the trial merge with `5971a1a`)
   - **The failures.** `api-described.test.ts` test 3, "pagination has 0 bare type members": `PaginationItem.type`, `.page` and `.key` have no comments. Test 4's V1 lists the same members. Test 4's V4: `SearchField.results` is 66 words, and the limit is 40.
   - **Why it slipped.** The Landing notes say "`023`'s tests should hold on its merge". 027b's own test 3 checks the `Strings` types only, not `PaginationItem`, and no test of 027b's counts words.
   - **Fix.** One comment per member of `PaginationItem` (for instance "A page: its number, counted from 1." on `page`; "Which ellipsis: before the current page's run, or after it." on `key`; on `type`, what the slot is). Shorten `results` to 40 words or fewer, keeping its contract, for instance: "The count for what is typed now, such as "3 results". Spoken once typing pauses and it is a string. Set it to `undefined` while a server's count is on its way. Unset, nothing is spoken." (36 words.) The long form already lives on the page and in the changelog.

5. **Medium. Clearing before the pause, which must silence the count, is untested.** (`search-field.svelte:100–115`; `tests/e2e/search-field.spec.ts:331–354`, test 29)
   - **The defect.** Decision 4: "Clearing the field cancels the timer, and nothing is written." Test 29 presses Clear only after the count was spoken, when nothing is pending. M2 removes both cancels and passes every search-field test; under it, typing "des" and pressing Escape within 200 ms writes "16 results" to the status (EXECUTED, `review-probes/quickclear.ts`: "" as built, "16 results" under M2).
   - **Fix.** In test 29, a last step: type "x", run 200 ms, press Escape, run 2,000 ms, and the `MutationObserver` saw no write. Seen failing under M2.

6. **Medium. Two screen-reader tests cannot fail on the fault they name.** (`tests/sr/pagination.sr.ts:46–58`, P2; `tests/sr/search-field.sr.ts:64–73`, S4)
   - **P2.** F1 "Page 12" is met by the status's "Page 12 of 12" in the same window, so a pager that dropped focus to `body` still passes. A real run does not judge `sr.focused()`. **Fix:** judge F1 over the phrases that are not the status: `F1(after.filter((p) => !normalise(p).includes("of 12")), "Page 12")`.
   - **S4.** Typing "des" in one go never produces a "12 results" to suppress, so `U1(after, "12 results")` is vacuous; the late-answer case exists only in test 29a's second run. **Fix:** S4 does what 29a does, inside its after window: type "de", wait 900 ms (the example asks at 750 and answers at 1,150), type "s". Then "12 results" (`resultsFor` "de") arrives after "s" and must stay unspoken, and "3 results" must be spoken.
   - **And the dry run.** P1, S1, S2 and S4 record no DOM fact, so M4 passes dry. Optional, beyond `026`'s precedent: after each window, `sr.fact("the status says …", …)` read from the status, waiting with `expect(...).toHaveText` first, so a dry run checks the DOM half. A harness note for `022` (lane E): a real run ignores `sr.focused()`; judging it there too would have caught P2's weakness.

7. **Low. `meta.axe` is read by nothing.** (`src/lib/site/examples/tag/dont-name.svelte`; `tests/e2e/batch-a.ts:155`; `batch-a.spec.ts:151`)
   - Test 52 takes the expected rule from `PART_B`'s hard-coded `axe: { name: "button-name" }`. The file's `meta.axe` is decoration, and the spec's comment ("A don't whose `meta.axe` names a rule") is not what it does. The two can drift.
   - **Fix:** add to `examples.test.ts`' test 5 that each don't's `meta.axe` equals `PART_B`'s entry for its pair (and is absent where `PART_B` has none); or read the rule from the file in `batch-a.ts`. Or drop `meta.axe` and say in deviation 7 that the rule lives in `PART_B`.

8. **Low. Two Do captions repeat their leads.** ("Use it for pages of results. Pages of search results, any one of which a person may jump to."; "Let the tag draw its own remove button. Its remove button is named for its tag: Remove Design.") `027a`'s finding 11 again, lighter. **Fix:** let the caption add, not restate: "…any one of which a person may jump to" becomes "A person can jump to any page of them"; or drop the lead's second half. For the design lead.

9. **Low. The pressed page's focus restore cannot run; remove it, or say why it stays.** (`pagination.svelte:150–160`)
   - **Why it cannot run,** read and run: `paginationPages`' keys keep one total order, `1 < "start" < 2 … n−1 < "end" < n`, on every page and every `siblings`; Svelte 5.57.3's keyed `reconcile` (`each.js`) then only inserts and removes, and moves no surviving node. A keyboard press keeps its node; a Chromium or Firefox click focuses the button natively; a WebKit click blurs at mousedown, so the guard sees `body` and returns (deviation 3). The `same.focus()` branch for a surviving end control is unreachable for the same reasons. M6 survives because nothing can kill it.
   - **Recommendation: remove both branches, keep the vanish branch,** and add a unit test to `pagination-pages.test.ts`: for `pages` 1 to 30, every `siblings`, and every pair of pages, the keys the two rows share appear in the same order. Then the invariant is held in the suite, and test 15a by Enter becomes a real witness of Svelte's behaviour: if a later Svelte moved nodes, 15a would fail instead of being masked. If the design lead prefers to keep the guard, keep it with a comment that names the invariant and says it is unreachable on Svelte 5.57.3.

10. **Low. Doc and code comments that say more or less than the code does.** (see "Doc comments")
    - `href`: add "Read once, at the first render: render the pager when you know whether it has URLs."
    - `onpagechange`: "Called when a press in button mode changes the page, with the new page."
    - `page`: "Shown clamped to 1 to `pages`."
    - The `oninput` code comment: "The app's own handler runs first." (Drop the `preventDefault` clause there, or drop the `defaultPrevented` test from `oninput`, since `input` cannot be cancelled.)
    - `Tag`: one sentence in its component comment or page: "Other attributes go on the tag's `li` (or `span`), not on its button."

11. **Low, for the design lead at the checkpoint.**
    - **The remove button's ring crosses the tag's edge.** The ring is a 2 px outline at a 2 px offset on a 24 px button that sits 4 px inside a 32 px tag, so it covers the tag's top, end and bottom border and touches the label (`zoom-tag-remove-focus-*`; EXECUTED: the button's box ends 5 px inside the tag's, its top 4 px below). Choices: draw the ring on the tag while its remove button is focused (`has-[[data-slot=tag-remove]:focus-visible]:` on the tag, the button's own outline off), or accept it as Primer does. A ruling either way.
    - **A pressed tag grows by its check** (about 20 px), and the tags after it move (`state-tag-pressable-focus-*`). Carbon's selectable tag does not move. Accept, or reserve the check's space.
    - **Forced colours** (finding 3).
    - **Deviation 4's three-digit `sm` pages** (about 35 px wide), if the design lead wants to see them.

12. **Notes, no change asked.**
    - **Failing first is credible but thin.** The 304 browser failures are mostly missing pages: the examples did not exist at the base. That is what "seen failing first" can mean for a new item. The Landing notes give the counts but not the reasons; the mutations are the evidence of teeth, and findings 1 and 5 are where they were missing.
    - **The API tables end "and every attribute of an element"** for `Pagination` (a `nav`) and `Tag` (an `li` or `span`). `023`'s generator maps `HTMLAttributes<HTMLElement>` to "an element", and HTML has no `HTMLNavElement`. The hook to `023` in the Landing notes stands; after `023`'s merge it is a lane I question, not 027b's.
    - **`in-a-footer` gives the pager `sm:flex-1`,** not `flex-1`, because the row stacks below 640 px. Right, and the intro says `flex-1`; fine.
    - **The `from-a-server` example keeps the last list when the field is emptied.** An example nit; the field itself is correct.
    - **The tag page's two inline links** use hand-written link classes, as `027a`'s pages do. Moving them to `Link` is the later lane I small change.

## Merge notes: landing after `023`

`023` is already on `release/0.13.0` (`667b1cf`, "Merge 023: prop doc comments"; the head is `5971a1a`). A trial merge of `5971a1a` into `07f029b`, in the scratchpad, gives:

1. **Four conflicts.**
   - `context/research/benchmark-scorecard.md`: keep both run-log rows (`023`'s and `027b`'s), and rewrite "In short" from the landing tree's run, not from either side.
   - `scripts/cost/report.json`: a ledger file. Take the release's copy, then `bun run cost --sizes-only` (`023` changed many items' sources) and `bun run cost --only pagination,search-field,tag`; `budgets.json` merged cleanly, so keep 027b's three budgets unless the run puts an item over them.
   - `src/lib/site/thumbnails/manifest.json`: take either side, then `bun scripts/site/thumbnails.ts --hash-only` (`023` changed the registry and sources, so every hash moves; regenerate the six 027b pictures only if `thumbnails.test.ts` says a picture differs).
   - `tests/unit/component-data.test.ts`: take `023`'s form of the test and move its count from 79 to **82**. With that, the file passes.
2. **Then `bun run build:registry`** for `static/r/`, `static/v0.13.0/r/` and `listed-items.ts` (ledger files: never hand-merged).
3. **Fix finding 4 before the merge commit:** with the trial merge resolved as above, `api-described.test.ts` fails exactly three tests, all 027b's, and passes 115. `registry-comments.test.ts`, `api.test.ts`, `component-data.test.ts` and `css-vars.test.ts` pass.
4. **027b's own test 3** (`registry-comments.test.ts`, "027b test 3") overlaps `023`'s suite, which the specification says absorbs it. Keep only its `inherits` assertions ("every attribute of an element", "of `<input>`", "of `<ul>`"), which `023`'s suite does not make, or move them into `api.test.ts`.
5. **Re-run at the merge:** `bun run check`; `bun run test:unit`; `api-table.spec.ts` and `build-output.spec.ts` (both changed by `023`; on the trial merge they pass but for an artefact of my scratch commit's author name); the three spec files and the 027b keyboard and `batch-a` rows; axe on the three pages; the SR dry run; and the measurement loop at the landing commit (`kuiper.ts --rev`, `site.ts --only kuiper`, `breadth.ts`), with one run-log row. Row 1 should still read 35 of 40, score 4.
6. **Counts `023` also moves**, which auto-merged here: `tests/fixtures/pluto-allowed.json` and `tests/e2e/site.spec.ts`. Check each by its test, not by eye.

## Cross-lane hooks

- **`028`** — finding 3's forced-colours mark is 027b's to give now; system colours (`Highlight` for the current page) stay `028`'s.
- **`022`** (lane E) — a real run ignores `sr.focused()` (finding 6's note).
- **`031b`** — removes `table-row` and puts `search-field/disabled` back in test 50, as the Landing notes say.
- **`023`** (lane I) — "an element" for a `nav` (note 12).

## The scorecard's movement

Row 1, component breadth: 32 → **35 of 40**, score **3 → 4** (`breadth.ts --only kuiper --rev 7575cd0`, the run-log row of 2026-11-16; EXECUTED here through test 6). `pagination`, `search` and `tag / chip` hit; still missing are combobox, date picker, file upload, slider and number input. Rows 1 to 14 total 35 → **36**. Row 8 holds (Button 365 kB, the builder's `site.ts`). Row 15 holds at 2, with three more measured and budgeted items. The prediction of decision 17 is met. The row must be re-run at the landing tree after `023` (merge note 5).

## Constitution checks

- **§4.1 Source, not a package:** holds. Plain Svelte; nothing reaches back.
- **§4.3 Tokens are the one source:** holds. EXECUTED: the literal lint, 0 literals and 0 allowances on the eight files (test 4). Finding 3's fix stays on the ladder or on recorded sizes.
- **§4.4 Accessible, in three engines, with a reader:** holds for the engines (EXECUTED, four projects; the builder's six). Forced colours fall short for the pager (finding 3). The screen-reader evidence waits for the owner's push, and two of its tests need the fixes of finding 6 to mean what they say.
- **§4.5 and §4.6 Inputs pinned, dependencies named:** holds. No package added; `phosphor-svelte` is named in each item.
- **§6 Never break an installed app silently:** holds. No existing item's source changes; three "new" bullets.
- **§6 Never commit without the owner:** the build's commits are on its own branch; nothing is merged or pushed.

## Verdict

Land after fixes. In this file's form: does not land yet: findings 1 to 6 (the tag's next-before-previous test, the pager's own `aria-label`, the current page under forced colours, `023`'s three failures, the cancel-before-pause test, and P2 and S4), with the Landing notes' corrections of deviations 3, 5 and 7. The items themselves are correct, close to GOV.UK, Carbon and Primer where those are right, and tested with teeth in three engines everywhere but the two places the mutations found.
