# Review of 016 — The brand yellow

Reviews [`specifications/016-the-brand-yellow.md`](../specifications/016-the-brand-yellow.md).

- **Date:** 2026-11-14
- **Status:** dispositioned; fit to build (confirmed 2026-11-14). All 7 findings are closed.
- **Reviewer:** a reviewer; not the author
- **Reviewed:** the specification as drafted (293 lines, untracked). It was checked against:
  - the constitution;
  - `decisions.md`, "A yellower yellow, in code and in the brand" (2026-11-14) and the 0.12.0 release entries;
  - `013` (fit to build), `014` (built in the working tree, awaiting its change review) and `015` (draft, for review);
  - the working tree, which holds `014`'s build.

  No code was touched.
- **Re-ran:** nothing in this repository was written except this file. Scratch work is in the session's scratch folder (`review-016/`).
  - **Every contrast table** (EXECUTED, `bun`). I ran `scripts/contrast.ts` (`contrastTable`, `fieldRows`, `glassRows`, `glassOverGlassRows`, `glassRingRows`, `glassFallbackRows`, `forbiddenRows`, `scrimRows`) and `scripts/tokens.ts`'s `validateTokens`, all on the working tree's token file with decision 1 applied in memory. The pre-`013` dark `syntax-amber` was pointed at a temporary copy of `#F19E20`, so the file validates.
    - `contrastTable` goes from 110 to 116 rows: 114 pass, 2 exceptions, 0 fail. Light: `caution-foreground` on `caution` 9.53; `caution-text` 5.03, 5.73 and 4.55; `chart-3` 1.76 and 2.01, the exceptions. Dark: 13.75; 13.20, 11.78 and 10.51; `chart-3` 13.20 and 11.78.
    - Fields: 16 of 16 pass. The `field-3` legend reads 9.53 light and 13.20 dark.
    - Glass: 33 of 33. Glass over glass: 20 of 20. Ring: 11 of 11. Fallback, forbidden and scrim rows are unchanged. All six of decision 5's `field-3` glass figures reproduce.
    - **The per-role minima move** in six places: glass, dark `foreground` 12.06 → 10.90, `muted-foreground` 5.09 → 4.60, `primary` 6.47 → 5.85; glass over glass, dark `foreground` 15.53 → 15.40, `primary` 8.33 → 8.26; ring, dark 6.47 → 5.85.
  - **Hues and the text shade** (EXECUTED, OKLCH through `palette.ts`'s `oklch`). `#E2B000` is 0.781, 0.160, 88.0. `#F8D874` is 0.889, 0.125, 92.0. `#806200` is 0.512, 0.105, 87.6. `amber-text` reads 4.98, 5.67 and 4.51 on paper, white and `muted`; `#806200` reads 5.03, 5.73 and 4.55.
  - **ΔE** (EXECUTED). `chart-3` against its neighbours, light 48.1, 31.2, 30.3, 37.5 and dark 27.2, 18.3, 19.8, 21.9, with the old figures as decision 5 gives them. `yellow-text` against `013`'s `#6C5A00` is 4.4; `yellow-lifted` against `#E5CD72` is 4.1.
  - **The mark** (EXECUTED). The third dot reads 1.76 on paper, 2.01 on white and 13.20 on graphite (was 8.45). On the four fields: light 3.49, 2.79, 1.00, 2.46; dark 1.52, 1.52, 1.00, 1.53. Over glass on each field the yellow dot keeps ΔE 18.1 or more in light and 57.1 or more in dark. Over the same glasses, the four dots together keep 18.1 in light and **43.6** in dark.
  - **The amber grep** (EXECUTED: `amber`, any case, `#F19E20`, `#915B00` and `rgb(241, 158, 32)`, over the tree outside `node_modules`, `.git` and `context/`). It hits 44 files: tokens, `build-tokens.ts`, `lint-literals.ts`, `src/app.css`, `registry.json`, `static/r/` and the versioned snapshots, two item comments, six item pages, the identity data, the workbench, five unit test files, two e2e files and the v0.8.0 fixture. The same sweep for the old figures found `15.53` on the `marketing-bar` page.
  - **What an app reads** (READ). `registry.json`'s `pluto-theme` gives hexes in `cssVars` and in the dark expressive rule (`"--mark-3": "#F19E20"`). `src/app.css` emits no primitive as a custom property. The item files read roles only: `four-dot.svelte:33` (`bg-mark-3`), `badge.svelte:14` (`bg-caution`, `border-caution`, `text-caution-foreground`), `alert.svelte:14` (`border-l-caution`).
  - **The neighbours' text** (READ). `015` decision 3, its checkpoint 0 and its door table. `014` decisions 12 and 13. `CHANGELOG.md`'s 0.12.0 entry as `014` built it.

## Acceptance criteria against evidence

1. **Tokens:** measurable. The counts are deltas over `013`'s landed file (READ).
2. **The hues:** measurable, but it names a helper that will not exist when this is built (finding 5).
3. **The text shade:** measurable. The figures reproduce (EXECUTED).
4. **The theme table:** measurable. The figures reproduce, and the count is `013`'s plus 6 (EXECUTED).
5. **The fields and the glass:** measurable. The figures reproduce (EXECUTED). It omits the minima pins that move (finding 2).
6. **`chart-3`'s neighbours:** measurable. The figures reproduce (EXECUTED for typical vision; the colour-vision figures were READ, not re-run).
7. **Emission:** measurable. `MOVED_016` matches `MOVED_011`'s entries for these names (READ, `generated.test.ts:831–898`).
8. **In the browser:** measurable. The stage grounds view is under `src/routes/(shell)/view/compositions/stage/grounds/` (READ).
9. **No amber left:** measurable, but its scope misses three places (finding 4).
10. **Lints and types:** measurable.
11. **The suites:** not met as written. Six minima pins change outside the listed groups (finding 2).
12. **The documents:** measurable. It does not cover the `marketing-bar` page's figure (finding 2).
13. **The mark's record:** measurable (EXECUTED).
14. **The checkpoint:** a checkpoint, not a count, as every specification's is.

## Findings, most severe first

1. **Medium — 016's place in the build order contradicts `015`'s** (`016:9`, `016:192–198`; `015:10–11`, `015:106–112`).
   - 016 says it blocks "`015`'s first checkpoint", and that "`015` … needs no change if its build starts first".
   - `015` decision 3 says otherwise: 015's build starts only when `013` and 016 are built and their change reviews dispositioned. Its first checkpoint, checkpoint 0, runs alongside `013`, before 016 can be built (016 waits on `013`), on scratch pages that read the repository's built stylesheet. `015` also says it "is designed and measured against `#E2B000` … and `#F8D874`".
   - 016 says the release "ships with `013`, `014` and `015`", with the tag after the reviews of `013`, `015` and 016. `015` adds `017` to both.

   Failure: checkpoint 0 judges the four doors, and the Google-echo risk `015` decision 6 says 016 raises, on amber. That is the stylesheet in the tree until 016 lands. The ruling it records is then made on the wrong yellow. Separately, the two specifications disagree on what ships and when the tag comes.
   Fix:
   - 016's Blocks line reads "`015`'s build (`015` decision 3)".
   - Drop "needs no change if its build starts first".
   - Say that checkpoint 0's scratch pages override `--mark-3`, `--field-3`, `--field-3-foreground`, `--chart-3` and `--caution` with decision 1's values, in the scratch stylesheet only. Ask `015`'s author to write the same into `015`'s checkpoint 0.
   - Add `017` to Ships with and to the tag's list.

2. **Medium — The sweep finds names, not figures: six minima pins and one published claim move unlisted** (`016:151–171`, `016:263–270`; `tests/unit/contrast.test.ts:687–708, 780–792`; `src/routes/(site)/items/marketing-bar/+page.svelte:39–40`).
   Decision 6 greps for the word and the hexes. But the dark `field-3` glass becomes the lowest row for three roles, so these change (EXECUTED):
   - the glass set's "lowest %s %s row" pins: dark `foreground` 12.06 → 10.90, `muted-foreground` 5.09 → 4.60, `primary` 6.47 → 5.85;
   - the glass-over-glass "lowest over a field" pins: dark `foreground` 15.53 → 15.40, `primary` 8.33 → 8.26;
   - the `marketing-bar` item page, which tells an app the bar's text measures "at least 15.53:1 and 5.98:1" on glass over glass over any field. After this change it is 15.40, so the published sentence is false.

   Failure: criterion 11 says expectations change "only in these groups", and its groups name the `field-3` figures, not the minima. The builder breaks the criterion or rewrites guards unreviewed. The page ships a figure the tokens no longer meet.
   Fix: criterion 11 lists the five pins with their new values. Decision 6 and criterion 12 add the `marketing-bar` sentence ("15.40:1 and 5.98:1"). Decision 6 adds a figure sweep: every figure decision 5 changes is grepped across `src/` and the tests, and the Landing notes record the hits.

3. **Low — `caution-text`: say why a new public role, and why this name** (`016:50`, `016:84–88`).
   - No item uses it, and once shipped the name is permanent: removing or renaming it later is an interface change (constitution §6).
   - The role family elsewhere is a colour (`destructive`, `success`), its `-fill`, and its `-foreground`. Here the base, `caution`, is already the fill, so the text shade cannot take the base name without renaming an app-facing role. `caution-text` is the one name left, a suffix no other role uses.

   Fix: add both reasons to decision 3. Note that `text-caution-text` is the utility an app writes. Name the first planned user, if there is one (`017`'s Brand colour page, or none).

4. **Low — Criterion 9's scope** (`016:261`, `016:167`).
   - It does not search `src/app.css`, which `build-tokens` writes with lowercase hexes (`#f19e20`), nor `src/routes/(view)/` or `src/lib/preview/`.
   - Only `amber` is matched "any case".
   - Decision 6's `pluto-theme` page row quotes "an amber series"; the page also says "Amber is the one known exception" (line 130). The criterion's grep catches it, but the table does not list it.

   Fix: search all of `src/` except `src/lib/identity/`, plus `src/app.css`. Match the hexes in any case. Add the second phrase to decision 6.

5. **Low — The colour helpers after `013`** (`016:12`, `016:248`, `016:252`).
   016 is built after `013`, which deletes `src/lib/workbench/palette.ts`. Its `oklch`, `fromOklch` and the colour-vision matrices move to `tests/helpers/colour.ts`, and `deltaE` and `mix` stay in `scripts/contrast.ts` (`013` decision 18). Criterion 2 says the OKLab matrices are the ones "`scripts/contrast.ts`'s `deltaE` uses". Criterion 6 names no helper for the colour-vision rows.
   Fix: criteria 2 and 6 import `oklch` and the matrices from `tests/helpers/colour.ts`, and `deltaE` from `scripts/contrast.ts`.

6. **Low — Light caution's non-text uses are not recorded** (`016:96–149`).
   The alert's caution bar (`border-l-caution`) on a light card falls from 2.17 to 2.01. The caution badge's fill edge on the page falls from 1.91 to 1.76. Neither is gated today, and both rely on the state being named in words (the alert's title, the badge's text), per the 2026-11-06 ruling on §4.4.
   Fix: add both to criterion 13's record, and say why neither needs 3:1.

7. **Low — For `015`'s author, two citations of 016 need correcting** (`015:136`, `015:140`).
   - `015` cites "`016` decision 6" for the mark on fields; it is decision 5.
   - It says "every dot ΔE 18.1 or more … 57.1 or more in dark". 57.1 is the yellow dot's figure. Over dark glass on the four fields, the four dots together keep 43.6 (EXECUTED).

   This is `015`'s text, not 016's. I record it so the coordinator can pass it on.

## Constitution checks

- **§4.1 source, not a package:** unchanged. No item gains a dependency.
- **§4.3 tokens are the one source:** held. Every new value is a primitive named by a role. The dark expressive marks stay in `EXPRESSIVE_DARK_MARKS` as primitive names. Each hex is written once (EXECUTED: `#806200`, `#F8D874` and `#E2B000` collide with no primitive, `013`'s `code-yellow` pair included).
- **§4.4 accessible by default:** every text row passes in both themes (EXECUTED). The light non-text exceptions (`chart-3`, and the unrecorded caution bar and fill edge of finding 6) are under 3:1, labelled or named in words. The mark is exempt by the 2026-11-06 ruling.
- **§4.5, §4.6 pinned:** nothing new to pin.
- **§6 never break an installed app silently:** the rename is invisible. An app receives role names with hexes (`registry.json`), never a primitive's name, and no item file reads a primitive (READ). The CLI's merge adds `--caution-text` and removes nothing, so no stale line is left. The only app-facing `amber` name, `syntax-amber`, is `013`'s to remove and to list. The `pluto-theme` bullet is already marked **interface change** by `013`'s part. 016's lines add one name and rename none, and say so.
- **§6 never copy prior art:** no prior art is used. The values are the owner's.

## Verdict

Does not land yet: findings 1 and 2 (Medium) stand. Both are text fixes: an order statement to align with `015`, and five test pins and one page sentence to name. Once they are fixed, a short confirmation is enough, with Lows 3 to 6 taken as write-ins. Finding 7 belongs to `015`'s author.

## Disposition

(Filled in after the design lead answers.)

The design lead's answers are in the specification's "Review dispositions" (`016:322–330`).

## Confirmation

- **Date:** 2026-11-14
- **Reviewer:** the same reviewer; not the author
- **Reviewed:** the specification as revised (333 lines), against its "Review dispositions" and the token file `014` left in the tree (uncommitted).
- **Re-ran:** decision 1 applied in memory to that file, through the same scratch script as the first pass (EXECUTED).
  - `validateTokens` passes.
  - `contrastTable` goes from 110 to 116 rows: 114 pass, 2 exceptions, 0 fail.
  - The fields pass 16 of 16, the glass rows 33 of 33, glass over glass 20 of 20, and the ring rows 11 of 11.
  - The six minima move exactly as the first pass found.

  Every figure of decisions 3 and 5 is unchanged, as the author says.

1. **Closed.**
   - The Blocks line names `015`'s build (`015` decision 3).
   - Checkpoint 0 takes decision 1's values in its scratch stylesheet only, by variable name (decision 9).
   - "Needs no change if its build starts first" is gone.
   - `017` is in Ships with, and the tag follows the change reviews of `013`, `015`, 016 and `017` (decision 9). Build step 7 lists the other three, which is the same set.
2. **Closed.**
   - Decision 6's figure sweep lists every moved number with its file and new value.
   - Criterion 11 names the five minima pins and the two `field-3` legend figures (9.53, 13.20).
   - The `marketing-bar` page reads 15.40:1 (decision 6). Criterion 12 checks it.
   - The ring set's dark minimum (6.47 → 5.85) is not pinned by any test (READ, `contrast.test.ts`), so it needs no listing.
3. **Closed.** Decision 3 states the need: after `013` no app-facing yellow is text-safe. It names the first reader, `017`'s generated colour page. It explains the name: the base `caution` is the fill and cannot be renamed.
4. **Closed.** Criterion 9 searches all of `src/` except `src/lib/identity/`, and matches `amber` and both hexes in any case. Decision 6 lists `src/app.css` and the `pluto-theme` page's second phrase.
5. **Closed.** Criteria 2 and 6 import `oklch` and the colour-vision matrices from `tests/helpers/colour.ts`, and `deltaE` from `scripts/contrast.ts`.
6. **Closed.** Decision 5 records the alert's bar (2.01) and the badge's fill edge (1.76), and says why neither needs 3:1. Criterion 13 records both.
7. **Passed on.** It is recorded for `015`'s author. Nothing in 016 depends on it.

### Verdict

Fit to build. Every finding is closed, and every figure holds on the token file `014` left in the tree.
