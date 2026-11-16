# Review of 027a — Batch A's quiet items: link, button group, progress (the built change)

Reviews the `027a` part of [`specifications/027-batch-a.md`](../specifications/027-batch-a.md), with its Landing notes under "027a" as the builder wrote them on its branch. This reviewer wrote neither the specification nor the code (constitution §5).

- **Date:** 2026-11-15
- **Status:** in review. Land after fixes: findings 1, 3, 4, 5 and 6 are settled before the merge (finding 1 by the design lead at the checkpoint), with the Landing-note corrections of findings 7 and 9; finding 2 is lane S's and should land before `023`; findings 8, 10 and 11 are write-ins; 12 holds notes.
- **Reviewer:** a reviewer; not the author
- **Reviewed:** branch `worktree-agent-afa5790b77ad7169d` (worktree `.claude/worktrees/agent-afa5790b77ad7169d`): `9395b46` (the build), `02adc64` (scorecard), `3bc5185` (merge of `release/0.13.0` at `421cea7`), `e820a95` (landing notes). The net change is `git diff 421cea7 e820a95`: 82 files, +3,151 / −166.
- **Re-ran:** Bun, 2026-11-15, the machine at a load average of 70 to 85. Nothing in the repository was written but this file. The worktree's `git status` was clean before and after. Browser runs used a `git clone --shared` of `e820a95` in the session scratchpad (`review-027a/tree`, the same tree byte for byte; its own `bun run build` left `git status` clean, so `build:registry` is idempotent), served by `vite preview` on **5741**; the base `421cea7` was built the same way and served on **5761**; mutations ran against `vite dev` on **5751**. 5199 was not used. Scratch config, scripts, logs and screenshots are in `review-027a/`.
  - `bun run check`, **in the worktree** → 2,230 files, **0 errors, 0 warnings**.
  - Unit, the ten touched files (`registry`, `breadth`, `registry-comments`, `examples`, `literals`, `search`, `sitemap`, `component-data`, `files-you-own`, `previews`) → **464 pass, 2 skip, 0 fail**.
  - The four new spec files and `build-output.spec.ts`, Chromium `light` and `dark` → **207 passed**, 0 failed (39 s). The builder's figure.
  - The four new spec files in `firefox-light`, `firefox-dark`, `webkit-light` and `webkit-dark` (a scratch config; `022`'s projects do not exist yet) → **360 passed**, 0 failed (4.9 min). Test 48 carries the "not emulated" annotation in both WebKit projects. With the Chromium run, **567 of 567** across three engines and both schemes; the builder reports 540, which is the same four files without `build-output.spec.ts`.
  - `keyboard.spec.ts`'s three 027a rows in `light`, `dark`, `firefox-light` and `webkit-light` → **12 passed**. `expressive.spec.ts` on the three new pages and `meter` → 8 passed in Chromium; 8 failed in Firefox and WebKit on font-family quoting (`"Geist Variable"` against `Geist Variable`), `meter` included, so it is the pre-existing engine fault of a Chromium-born test, for `022`'s ledger (note 12), not `027a`'s.
  - **axe on the three pages** (`/components/{link,button-group,progress}/`, `wcag2a` to `wcag22aa` and best-practice, at 1440 and 390) → **0 violations** in `light`, `dark` and `webkit-dark` (18 of 18), and in `firefox-light` (6 of 6; the first Firefox run timed out waiting for `networkidle` under load, and passed on two workers waiting for `load`).
  - **Page weight,** every response gzipped at level 9, base `421cea7` against `e820a95`: Button 368,518 → 369,460 B (**+942**: HTML +57, JS +629, CSS +256); home +888; the Components index +1,446; Meter +980; Dialog +916. The builder's "about 0.9 kB on every page" holds. My compressor is not the perf project's, so the absolute figures are lower than its 374 kB; the delta is what is checked.
  - **Failing first, against the base build:** the four new spec files in `light` against `421cea7` (served on 5761) → **90 failed, 0 passed**. With `keyboard.spec.ts`'s three rows, that is the builder's 93 a scheme.
  - **Mutations** (nine, each applied in the scratch copy, the named test run, then reverted; the tree was clean after each): see "The tests" below.
  - **Screenshots:** the three pages, Button and Meter, full page at 1440 and 390 in light and dark (`review-027a/shots/`), and hover, focus, press and forced-colour states (`review-027a/shots2/`).
  - **Not run by me:** the full unit, e2e and smoke suites, `release-check.ts`, the perf project and the bench scripts. Their figures are the builder's.

## Acceptance criteria against evidence (part a)

1. **The items** — met. READ: six files; `registry.json`'s three entries match decision 1 (name, title, description, group, `meta.since`, `meta.modes`, no `meta.stock`, `registryDependencies`). EXECUTED: tests 1 and 4 pass. The published `link.json` lists `phosphor-svelte@^3.1.1` under `devDependencies`, as every other icon item does; `button-group` and `progress` list none.
2. **Names and breadth** — met. EXECUTED: test 6 passes; 31 of 40, 32 with `026`'s toast.
3. to 5. part b.
6. **Button group** — met. EXECUTED: tests 32 to 36 in three engines, both schemes. Finding 1 bears on test 32's names.
7. part b.
8. **Link** — met. EXECUTED: tests 42 to 46, three engines.
9. **Progress** — met. EXECUTED: tests 47 to 49, test 48 in three engines; its forced-colours half in Chromium and Firefox, WebKit "not emulated". Its Firefox half is weak (finding 7).
10. **Depth, type and axe** — met, with deviation 6's `card` skip (sound; finding 9 asks for a hook). EXECUTED.
11. **Keyboard** — met. EXECUTED: the three rows, four projects.
12. **Described** — met as tested. EXECUTED: test 3. But a reader of the pages cannot see the variant values (finding 4).
13. **The pages** — met as tested; below Button and Meter in polish (findings 1, 2, 3, 4). READ: decision 12's examples in order, two pairs per page, each don't inside `inert`, "Your part" holds decision 12's musts. The `meter` page's "when" and its don't now link to `/components/progress/`.
14. **The changelog** — met. READ: three bullets in decision 16's words under 0.13.0. EXECUTED: test 2.
15. **Three engines** — met for the four spec files and the keyboard rows (EXECUTED, above).
16. part b.
17. **The cost** — moved to `027b` by decision 15, since `025` has not landed. Recorded (deviation 10).
18. **The suites** — `check` and the touched unit files EXECUTED; the rest the builder's. Expectations moved outside the named files only by counts, and by `expressive.spec.ts`'s exemption (finding 5).
19. **Tests first** — credible. The red runs are not in history (one build commit), but the Landing notes give counts by test, and the base build reproduces them (above). Of nine mutations, seven are killed in every engine run (one by a timeout), one in Chromium only, and one nowhere (below).
20. **The checkpoint** — not walked. Waits for the design lead; finding 1 is for it.
21. **The scorecard** — met at `9395b46`; stale at the landing tree (finding 6).

## The items, read against the specification

- **Link** (`link/link.svelte`). An `<a href>` with `data-slot="link"`. `underline underline-offset-4`, `hover:decoration-2`; `text-primary` or `text-current`; `standalone` adds `inline-flex min-h-6 items-center`; `visited` adds `visited:text-foreground`. `newTab` forces `target="_blank"`, merges `noopener noreferrer` into the app's `rel` once each, and adds an `aria-hidden` `ArrowSquareOut` and a `sr-only` " (opens in a new tab)". The accessible name ends with the words (test 45). Focus is the theme's ring (seen). No disabled form. As decision 7 says. Under forced colours the link takes `LinkText` and keeps its underline (seen).
- **Button group** (`button-group/button-group.svelte`). A `div` with `role="group"`, `data-variant`, `data-orientation`; named by the app's `aria-label`. Attached styles its direct children: inner corners squared, every child after the first loses its start border (top when vertical), and a focused child is `relative z-10`. Spaced is a column below `sm` and a wrapping row above. No roving focus, no context, `button` untouched. As decision 5 says. The ring is never covered (test 34; seen in both schemes: it sits over the neighbours' edges).
- **Progress** (`progress/progress.svelte`). A native `<progress>` (`progressbar`), `value` clamped and never missing, `aria-valuetext` from `valuetext`, no `aria-valuemax`. `block h-2 w-full appearance-none rounded-none border-0 bg-muted forced-color-adjust-none`, the WebKit and Mozilla pseudo-element fills as arbitrary variants. Not a live region; the `upload` example announces through `Status`. The meter distinction is drawn on both pages: progress for a task towards done, meter for a measurement in a range, spinner for an unknown wait. As decision 8 says.
  - The clamp is load-bearing beyond the indeterminate rule: with `value={value}` and a `null` from untyped code, the `states` view never hydrates (mutation M5, below), so the guard also keeps the page alive.

## The deviations

1. **Registry position** — sound. Precedent: `003`'s `status` and `004`'s `toggle` joined their groups in place, and `registry.test.ts`'s `GROUPS` reads group order.
2. **No `tailwind-variants`** — sound for the stated reason: the build derives a package from every import, every published item that uses `tv` lists `tailwind-variants@^3.3.1` (`button.json`, `alert.json`, `field.json`), and test 1 asks for no package on `button-group` and `progress` and exactly `phosphor-svelte` on `link`. Class maps without `tv` have precedent (`stage`'s `GROUNDS`, `stage-hero`'s `FIELDS`, `proof-band`'s `COLUMNS`). One consequence is new: `linkVariants` is the only `*Variants` in the registry that is not a `tv` function, and it takes no `class` (finding 8).
3. **`index.ts` exports the house set** — sound; `button` and `meter` do the same.
4. **`border-0` on the bar** — harmless, but its evidence does not hold in this site (finding 7). Keep the class.
5. **Pair files carry a `title`** — sound: each pair file is its own example view, and axe's `document-title` needs it.
6. **Test 50 skips `card`'s own edge** — sound. `card` draws `border-border`, and `--border` is `#0b0f171a` (light) and `#f3f0e81a` (dark): a translucent hairline, an existing item's rule that `031b` owns, exactly as decision 13 leaves the inherited disabled opacity to `031b`. The skip is narrow: one slot, the element only, its descendants still checked. The alternative, drawing `in-a-card` without Kuiper's card, would show a card that is not the system's. It needs a hook so it is removed when `031b` lands (finding 9).
7. **Where tests 3 and 6 live** — sound, as the specification directs while `023`'s test is absent.
8. **Example links go to real pages** — sound; the prerender crawls every link.
9. **The attached example, flagged** — the flag is right, and it should be acted on (finding 1).
10. **The cost fixtures move to `027b`** — as decision 15 provides.
11. **Expectations outside the named files** — the count moves are mechanical and each matches three items. The `expressive.spec.ts` exemption is sound in kind, with precedent (the check already exempts a button that sets its own radius), but broader than it needs to be (finding 5).

## The tests

**Failing first.** One commit holds the tests and the code, so history cannot show the red runs. The Landing notes give them by test (26 of 28 unit, 186 of 186 browser), with the two unit passes explained (they read only `REFERENCE_PARTS`). Against the base build, the browser files fail as stated (above).

**Mutations,** each against the dev server of the scratch copy, the one test named, `--retries=0`:

| # | The break | Test | Result |
|---|---|---|---|
| M1 | `newTab` merges `noopener` only | 45 | killed: "Expected value: noreferrer" |
| M2 | no `hover:decoration-2` | 42 | killed: thickness not `2px` |
| M3 | no `*:focus-visible:relative *:focus-visible:z-10` | 34 | killed: `z-index`, `position` |
| M4 | attached children keep their start border (horizontal) | 33 | killed on `attached` and `with-menu`; `vertical` passes, rightly, since it uses `border-t-0` |
| M5 | `value={value}`, no clamp | 47 | killed, but by a timeout: the `states` view never hydrates, so the assertion is never reached |
| M6 | no `forced-color-adjust-none` | 48 | killed in Chromium; **survives in Firefox** (finding 7) |
| M7 | no `border-0` | 48 | **survives** in Chromium and Firefox: the bar is 8 px either way (finding 7) |
| M8 | spaced never stacks | 35 | killed: `flex-direction` |
| M9 | `visited` adds no class | 46 | killed |

Six are killed by their assertion, one by a timeout, one in Chromium only, and one survives everywhere. The suite has teeth where the specification put them; finding 7 is about the two that slip.

## The pages, seen

Screenshots at 1440 and 390, light and dark, beside Button and Meter.

- **The parts themselves are at the house standard.** The progress bars match Meter's bar exactly (8 px, square ends, muted track, primary fill), and the destructive bar and its "Failed at 40%" read well in both schemes. The attached groups share one solid edge, the vertical group is as wide as its widest button, the "More" trigger joins as the last button, and the focus ring sits clear of its neighbours. Links are underlined in both variants; the new-tab icon sits after the text without an underline; the `inherit` footer band is solid. Spaced stacks full width at 390.
- **The empty track in dark** ("Not started") is faint against the stage. Meter's track is the same, and 3:1 is owed only between fill and track, so this is not a finding.
- **The API tables are the visible weakness** (finding 2), and the variant types say nothing (finding 4).
- **The Usage prose repeats itself** in places (note 11).

## Findings, most severe first

1. **Medium. The stage example teaches the pattern the page's own don't forbids.** (`src/lib/site/examples/button-group/attached.svelte`; test 32 and test 53's rows in `button-group.spec.ts` and `keyboard.spec.ts`; deviation 9)
   - **The defect.** The page's first frame, and its thumbnail on the Components index, is a group named "Text alignment" holding Left, Center and Right. Text alignment is a choice of state. The same page's don't, `dont-state`, says: "Use it for toggles. It says nothing is pressed. Use a toggle group." Its do shows B, I, U in a `toggle-group`. Decision 5 sends a choice of state to `toggle-group` too.
   - **Why the workaround does not save it.** The builder made each button a one-shot action ("Each button aligns this paragraph once. None stays pressed."). That is honest, but a reader sees an alignment control with no pressed state, which is the don't. The stage is what a team copies.
   - **Why it happened.** The specification's own test 32 names the group "Text alignment" (decision 10's screen-reader row too). The builder followed it and flagged the conflict.
   - **Fix,** a checkpoint ruling recorded in the Landing notes: rename the stage to three actions of equal weight with no state, such as "Clipboard": Cut, Copy, Paste. Move tests 32 and 53 and decision 10's row with it, and regenerate the two `button-group` thumbnails. If the design lead keeps "Text alignment", record why the stage may differ from the don't.
2. **Medium, in lane S. The API tables break types inside words at 768 px and wider, so the three new pages read worse than Button and Meter.** (`src/lib/site/page/api-table.svelte:62`, the Type cell's `wrap-anywhere`)
   - **Seen at 1440.** Link: `strin` / `g`, `HTMLAn` / `chorEl` / `ement`. Button group: `stri` / `ng`, `HTML` / `DivE` / `leme` / `nt |` / `nul` / `l`, `Butt` / `onGr` / `oupV` / `aria` / `nt`. Progress: `HTMLPro` / `gressEl` / `ement`, `Progres` / `sVarian` / `t`. Button's and Meter's tables wrap only at spaces. At 390 the table is a grid and reads well.
   - **Cause.** `wrap-anywhere` (`overflow-wrap: anywhere`) makes the Type cell's min-content width one character, so the auto table layout gives the width to the "What it does" column. These are the first pages with a long description in every row; Button has one described row, Meter short ones.
   - **Why it matters beyond `027a`.** `023` gives every row of every page a description. When it lands, every API table on the site squeezes the same way.
   - **Fix,** a lane S small change, before `023` and before the tag: `break-words` (`overflow-wrap: break-word`) on the Type cell in place of `wrap-anywhere`, so a word breaks only when it alone is wider than the column; its check measures that no Type cell's `code` breaks inside `string` on the three new pages at 1440. It need not block `027a`'s merge, since the file is not `027a`'s, but the design lead should queue it now.
3. **Low. The progress page's API table ends "and the props of `HTMLProgressAttributes`".** (`src/lib/site/api.server.ts:195–211`, `ELEMENTS`)
   - **The defect.** The table names a TypeScript type where every other native-element item says "every attribute of `<meter>`" or "`<a>`". On a page born "fully described", that is the one row a reader cannot use.
   - **The lane is misnamed.** The Landing notes file this under lane S. `api.server.ts` is not in lane S's list (`src/lib/site/page/`, `site.css`, the layout, the sitemap's structure, the frames). The spec that edits it is `023`, in lane I (`023`'s header and its file table).
   - **Recommendation: land the one line with `027a`.** No build holds the file today (`023` has no worktree), the edit is one added row in a lookup map, and `023`'s edits are to the generator and `showType()`, so a merge with it costs at most a one-line conflict. EXECUTED in the scratch copy: with `HTMLProgressAttributes: "progress",` after the `meter` row, `apiTables()` gives "and every attribute of `<progress>`", and the Link, Button group and Meter tables are unchanged. Record it as a checkpoint ruling in the Landing notes, add one assertion to test 3 (`progress`'s `inherits` reads "every attribute of `<progress>`"), and correct the hook's lane to "`023`'s file (lane I)". Leaving it for `023` is the second option: acceptable, but the page ships the TypeScript name until then.
4. **Low. The variant types show as alias names, so no page says what values they take.** (`link.svelte:7`, `:50`; `button-group.svelte:6`, `:8`, `:15`, `:17`; `progress.svelte:5`, `:18`)
   - **The defect.** The Type cells read `LinkVariant`, `ButtonGroupVariant`, `ButtonGroupOrientation` and `ProgressVariant`. `showType()` expands only `VariantProps<…>`; a plain union alias is shown by name (EXECUTED: `apiTables()` returns those four names). Decision 7's and decision 5's tables give the unions, `"default" | "inherit"` and the rest. Only the Default column hints at one value, and none of the four doc comments names the other.
   - **Precedent.** Older items show the same (`SheetSide`, `CodeBlockSize`, `FourDotTone`), so it is the generator's limit, not a new fault. A new item can avoid it in one line each.
   - **Fix:** type each prop with its union inline (`variant?: "default" | "inherit"`), keeping the exported alias for apps; or name the values in each doc comment ("`inherit` takes the surrounding text's colour"). The first makes the page match the specification's API tables.
5. **Low. `expressive.spec.ts`'s exemption also skips the one corner it could still check.** (`tests/e2e/expressive.spec.ts:37–44`)
   - The check reads each button's `borderTopLeftRadius`. In an attached group, horizontal or vertical, the first child keeps that corner's house radius; only later children square it. The exemption skips every direct child, so a group that squared its first child's outer corner would pass.
   - **Fix:** exempt only a child with a previous element sibling: `el.parentElement?.matches('[data-slot="button-group"][data-variant="attached"]') && el.previousElementSibling`. Seen passing on the three pages with that change is the check.
6. **Low. The scorecard records the superseded build.** (`context/research/benchmark-scorecard.md:42`, `:238`, `:419`)
   - The run log's row and row 8's table cite `9395b46` on `0372323`: Button 383 kB, "the 382 kB budget was already exceeded". The "In short" prose now says "383 kB". The landing tree is the merge, where the Landing notes measure Button at **374 kB of 382**, and `020a`'s 9 kB is in it.
   - §4 of the roadmap and constitution §2.6 want the movement at the landing. **Fix:** run `site.ts --only kuiper` at the landing commit, add a run-log row for it, and set row 8 and the prose to that figure. Row 1's 31 of 40 stands.
7. **Low. Two of test 48's guarantees have no teeth.** (`tests/e2e/progress.spec.ts:67`, `:85–90`; Landing notes deviation 4)
   - **Forced colours in Firefox.** Test 48 asserts only that the 10% and 90% pixels differ. Without `forced-color-adjust-none`, Firefox repaints the bar in two system colours that still differ, so M6 survives there. The item's promise is that the bar keeps its colours. **Fix:** under `forcedColors: "active"`, assert the 10% pixel is still `--primary`'s colour and the 90% pixel `--muted`'s, ± 2, in Chromium and Firefox. Both hold today (seen).
   - **`border-0`.** The deviation says Firefox would draw a 1 px border and test 48 holds 8 px. In this site the theme's preflight already sets every border to 0, so the bar is 8 px in Firefox without the class (EXECUTED: computed `border-top-width` `0px`, height 8, with `border-0` removed; M7 survives). The class guards an app without preflight. **Fix:** keep `border-0`, and correct the deviation's text to say what it guards and that test 48 cannot see it.
8. **Low. `linkVariants` is the registry's only `*Variants` that is not a `tv` function, and it takes no `class`.** (`link.svelte:26–41`)
   - The other fifteen `*Variants` exports (`buttonVariants`, `toggleVariants`, `alertVariants` and twelve more) are each `tv(…)`, which accepts `class`. An app that writes `linkVariants({ variant: "inherit", class: "font-medium" })`, as it would `buttonVariants`, gets a type error.
   - **Fix,** while the interface is new: accept `class?: string` and pass it last to `cn`. Or say in the doc comment that it takes only the three options. `058`'s interface review would otherwise meet it.
9. **Low. Test 50's `card` skip has no owner.** (`tests/e2e/batch-a.spec.ts:27`, `AUDITED_BY_031B`)
   - When `031b` makes `card`'s hairline solid, the skip must go, or it would hide a translucent card edge that came back. **Fix:** add a line to the Landing notes' "Hooks for other lanes": "`031b`: remove `AUDITED_BY_031B` from `tests/e2e/batch-a.spec.ts` when `card`'s edge is solid."
10. **Low. A new tab opened through `...rest` is silent.** (`link.svelte:107–112`)
    - `target` passes through when `newTab` is false, as decision 7 allows. So `<Link href="…" target="_blank">` opens a new tab with no icon, no words for a screen reader and no merged `rel` (browsers imply `noopener` for `_blank`; not `noreferrer`). **Fix,** either: treat `target="_blank"` as `newTab`; or end `newTab`'s doc comment with "Use this, not `target`, so the new tab is said." The second is enough for now.
11. **Low, for the design lead. The guidance prose.** (the three `+page.svelte` files; the pair captions)
    - Several Do items read the lead, then a caption that says it again: "Use a button for an action. An action is a button: it does something where you are." "Keep one primary at most, first, in a spaced group. One primary, first, spaced from the rest." "Write link text that makes sense alone. Link words that say where they go, read alone."
    - The link page says "`visited` changes only the colour, so it is never the only sign." It is not clear what it is the sign of. Suggested: "`visited` changes only the colour; the underline stays, so a link still reads as a link."
    - The progress page's "when" names `meter` and `spinner` as code, while the meter page now links to the progress page. Link both.
    - The failed bar's `valuetext` is "Failed at 40 of 100" while its visible words say "Failed at 40%". Make them agree.
12. **Notes, no change asked.**
    - `spaced` with `orientation="vertical"` stretches each button to the container's width at every size, since only `attached` sets `w-fit`. No example or test uses the pair. If it is meant, say so in `orientation`'s doc comment.
    - A pressed button in an attached group moves down 1 px (`button`'s `active:translate-y-px`), so its top edge parts from its neighbours while pressed. It is `button`'s rule, for the checkpoint's look at the hover.
    - `expressive.spec.ts` fails in Firefox and WebKit on every page, `meter` included, because those engines serialise `font-family` without quotes. It is not `027a`'s; it belongs in `022`'s fault ledger.

## Cross-lane hooks

- **`api.server.ts`** — recommended to land with `027a` (finding 3).
- **`api-table.svelte`** — a lane S small change before `023` (finding 2).
- **`031b`** — removes test 50's `card` skip (finding 9).
- **`025` / `027b` B8** — the three fixtures and budgets, as recorded.
- **`022`** — the four spec files carry `item` and `check` annotations and need no list; test 48's WebKit "not emulated" annotation is in place. `expressive.spec.ts`'s quoting fault is for its ledger (note 12).

## The scorecard's movement

Row 1, component breadth: 29 → **31 of 40**, score 3 held (`breadth.ts`, the run-log row at `9395b46`; EXECUTED here through test 6). `link` and `button group` each add a part; `progress` matches "progress / meter", which `meter` holds. With `026`'s toast it reads 32, as criterion 21 predicts; `027b` brings 35 and the score 4. Rows 1 to 14 hold at 32. Row 8 holds at 4, with the Button figure to be restated at the landing tree (finding 6). Page-standard coverage rises by three pages born with described props and live pairs.

## Constitution checks

- **§4.1 Source, not a package:** holds. Three items, plain Svelte; `linkVariants` is exported source; nothing reaches back.
- **§4.3 Tokens are the one source:** holds. Every colour is a role (`primary`, `muted`, `destructive`, `foreground`, `input` through `button`). Sizes are on the ladder or recorded in decision 7 (`decoration-2`, `underline-offset-4`). EXECUTED: test 4, 0 literals and 0 allowances on the six files.
- **§4.4 Accessible, in three engines:** holds for what `027a` owns. EXECUTED: the four spec files in Chromium, Firefox and WebKit, both schemes; axe 0 on every example, pair and page. Forced colours checked for `progress` in Chromium and Firefox; `link` and `button-group` under forced colours were looked at here and are `028`'s to test. None of the three has a live region, a focus move or an overlay of its own, so none joins the screen-reader set (decision 11).
- **§4.5 and §4.6 Inputs pinned, dependencies named:** holds. No package added; `phosphor-svelte` is already pinned and is named in `link.json`.
- **§6 Never break an installed app silently:** holds. No existing item's source changes; the changelog has three "new" bullets and no interface change.
- **§6 Never commit without the owner:** the build's commits are on its own branch, as the coordinator's workflow asks; nothing is merged or pushed.

## Verdict

Land after fixes. Before the merge: the design lead rules on the stage example (finding 1); the `api.server.ts` line lands with `027a` or is deferred to `023` by a recorded ruling (finding 3); the variant unions show on the pages (finding 4); the exemption narrows (finding 5); the scorecard is restated at the landing tree (finding 6); and the Landing notes correct deviation 4's evidence, the hook's lane and the `031b` hook (findings 3, 7, 9). Finding 2 is lane S's and should be queued before `023`. The items themselves are correct, tested with teeth in three engines, and at the house standard where it counts: the parts.
