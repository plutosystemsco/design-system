# Review of 020d — 0.12.0 was never released

Reviews [`specifications/020d-0-12-0-was-never-released.md`](../specifications/020d-0-12-0-was-never-released.md) before it is built. Its research is [`research/2026-11-17-0-12-0-was-never-released.md`](../research/2026-11-17-0-12-0-was-never-released.md). This reviewer wrote neither (constitution §5).

- **Date:** 2026-11-17
- **Status:** in review
- **Reviewer:** a reviewer; not the author
- **Reviewed:** the specification as drafted (199 lines) and the memo (166 lines), both untracked, on `release/0.13.0` at `b01e754`. Checked against:
  - `AGENTS.md`, the constitution, `roadmap.md` §2 ("Lanes"), the owner's L2 answer (`research/2026-11-17-structural-review.md:168`, `:322`);
  - `CHANGELOG.md`, `src/lib/site/upgrade/0.13.0.ts`, `src/lib/site/changelog.ts`, `src/lib/site/site.ts`, the changelog, install and upgrade routes, `llms.txt`;
  - `tests/unit/registry.test.ts`, `registry-comments.test.ts`, `generated.test.ts`, `changelog-page.test.ts`, `component-data.test.ts`, `toast-site.test.ts`, `tokens-lifecycle.test.ts`, `rename.test.ts`, `tests/fixtures/pluto-allowed.json`, `tests/e2e/upgrade.spec.ts`, `tests/smoke/upgrade.test.ts`, `tests/smoke/code-add.test.ts`;
  - `vite.config.ts` (`@sveltejs/adapter-static`), `wrangler.jsonc`, `static/_redirects`, `scripts/site/redirects-plugin.ts`, `scripts/site/release-check.ts`, `scripts/bench/kuiper.ts`, `.github/workflows/matrix.yml`;
  - the in-flight lanes: `022t` committed at `71cb067` in `.claude/worktrees/lane-i-attempt`; `022v` and `022w` uncommitted in `.claude/worktrees/lane-i-run5`; `022x` and `022y` in `.claude/worktrees/lane-e-run5`.
- **Re-ran:** nothing in the repository was written but this file. Every probe ran in a scratch folder of this session, from `git archive b01e754`, with `node_modules` linked and the tags fetched in.
  - The memo's greps, and the guard's own exclusions: **283 lines** today ("about 280" holds). Nothing live is missed but finding 9's lines. EXECUTED.
  - The token rewrite: `static/v0.12.0/` deleted, 51 `since`/`removed` values set to `0.13.0`, then `bun run build:tokens`. `src/app.css`, `static/r/tokens/kuiper.css` and `static/v0.13.0/r/tokens/kuiper.css` keep their sha256. The five `tokens-*.test.ts` files pass **57 of 57**. `bun run build:registry` then changes nothing. EXECUTED.
  - The fold, by a script that follows decisions 2 to 4 word for word. `bun test` over the seven changelog-reading files: **298 pass, 14 fail**, the fourteen the specification expects. The `[Pp]luto` counts: 21 in the folded 0.13.0 entry, 28 from `## 0.11.0`, as decision 7 says. `updatedIn`: 74 items read 0.13.0, `meter` 0.4.0, `kbd`, `error-summary` and `product-home` 0.13.0. The release order: 0.13.0, 0.11.0, 0.8.0. EXECUTED.
  - The heads in the folded entry: `kuiper-theme` 3 times, and `highlighter`, `code-editor`, `use-highlighted-code` and `app-shell` twice each (finding 1). EXECUTED.
  - `git merge-file` of the folded changelog with `022t`'s, and with `lane-i-run5`'s (which holds `022t`'s and `022v`'s): both merge clean. `022t`'s two bullets and `022v`'s one land in the 0.13.0 list, before "Also since 0.11.0". No bullet is lost. EXECUTED.
  - The guide defect, on a scratch app from `tests/smoke/fixtures/kit3`, with `static/` served read-only. A v0.11.0 install (`pluto-theme theme field input button four-dot`), with a component whose own style says `animation-name: pluto-enter`, builds with `@keyframes pluto-enter`. Then 0.12.0's notes' command, `add pluto-theme highlighter use-highlighted-code code-block code-editor`, against `/v0.13.0/r`, the only registry there is: the add exits 0, `app.css` still holds the four `@keyframes pluto-…` rules, the build exits 0, and its CSS holds `@keyframes kuiper-enter` and `animation-name:pluto-enter`, but no `@keyframes pluto-enter`. The animation is lost, silently. Renaming the use to `kuiper-enter` restores it. EXECUTED.
  - On the same app: `<span class="text-code-builtin">` compiles to `.text-code-builtin{color:var(--code-builtin)}`. Once the stale `--code-builtin` lines are deleted, as the new section's step 2 says, the build exits 0 and the class is gone (finding 2). EXECUTED.
  - "Released snapshots" with every tag deleted: "at least one released snapshot exists" fails. With the tags fetched back: 8 pass. EXECUTED.

## Acceptance criteria against evidence

A specification review asks whether each criterion can be counted, and whether together they prove the intent.

1. T1 to T12 pass. **Countable, but three tests are wrong as written.** T10 contradicts decision 8 (finding 4). T4's order test fails against decision 4's own text (finding 6). The retargeted 0.12.0 tests cannot keep "one bullet per item" (finding 1). T1, T2, T3, T5, T6, T7, T9 and T12 fail at the base, or will once changed first (EXECUTED for T6, T7, T9 and T12's counts; INFERRED for the rest).
2. T13 and T14 pass in Chromium. **T13 is wrong:** the new section is the page's fourth part, not its third (finding 5).
3. The smoke test's upgrade case. **Countable.** It proves the stale-line list. Nothing proves the new section's other steps end to end (finding 2).
4. `git diff b01e754` shows no change to the CSS or the styles. **Countable, wrong base.** Built after `022t` or `022v`, the diff from `b01e754` holds their `error-summary.json` and `code-block.json` changes (finding 3).
5. `bun run build` leaves no `/v0.12.0/` and no `v0-12-0`. **Countable.** Today the build holds five `href`s to `#v0-12-0` (EXECUTED, grep of `build/`).
6. and 7. `check`, `lint` and the release check. **Countable.**
8. The roadmap and the handoff, by reading. **Countable by a reader.** Fine for prose.
9. The scorecard, "no row moves". **Countable, but the raw counts it cites will move** (finding 10).
10. The change review against §7's table. **Countable.** The table needs finding 9's lines.

Together they prove the intent, once findings 1 to 3 are fixed.

## Findings, most severe first

1. **High: the fold gives one item two or three bullets, and decision 7 does not say how the tests or the reader tell them apart** (decisions 3 and 7; `registry.test.ts:1473`, `:1496`, `:1909`, `:1995`, `:2028`).
   - EXECUTED, the folded entry at `b01e754`: `kuiper-theme` heads 3 bullets; `highlighter`, `code-editor`, `use-highlighted-code` and `app-shell` head 2 each. With `022t` and `022v`, `error-summary` and `code-block` do too (`lane-i-attempt/CHANGELOG.md:32`, `lane-i-run5/CHANGELOG.md:32`).
   - READ, the tests decision 7 retargets:
     - `:1473` and `:1496` assert one bullet each for `code-block`, `code-editor`, `highlighter` and `use-highlighted-code` (`toHaveLength(1)`).
     - `:2028` asserts one `app-shell` bullet, and that it sits at `kbd`'s index + 2. The first `app-shell` bullet is now 0.13.0's toast bullet, line 19 of the entry; `kbd`'s is line 51.
     - "They name the 11 names" reads `bullets("error-summary")[0]`. With `022t`, that is `attempt`'s bullet, which holds no `data-slot`.
   - Decision 7 says only that "one `pluto-theme` bullet" becomes the code-map `kuiper-theme` bullet. Read at the 0.13.0 entry, the other counts and positions cannot pass. The builder would have to choose a rule.
   - The reader meets the same split. With `022t`, a 0.11.0 app reads "`error-summary`: a new optional prop, `attempt`; nothing to change", and only later, below "Also since 0.11.0", that `role="alert"` moved. With `022v`, "`code-block`: … no prop, slot or export changes" comes before `code-block`'s interface change. The folded bullets' "(see `kuiper-theme`)" now points first at the rename bullet, not the code map. That is the merge-by-hand trap that decision 2 rejects a separate heading to avoid.
   - Fix:
     - Decision 7: the shared helper returns the entry's two lists, split at the "Also since 0.11.0" line. Tests from `013`, `014`, `016`, `018` and `019` read the second list and keep every count and position. Tests from `020` on read the first. T3 then says: the first list has no `pluto-theme` head, and the second list's one `kuiper-theme` bullet holds "The code map is Meridian's roles".
     - Decision 3 adds a rule for a head that appears in both lists. The second list's bullet keeps its words. The first list's bullet ends with "; see also `<name>` below". `022t`'s "nothing to change" becomes "nothing to change for it", which `022t`'s `toContain("nothing to change")` still passes. The folded "(see `kuiper-theme`)" becomes "(see the code-map `kuiper-theme` bullet)".
     - The "Also since 0.11.0" line says that its bullets add to any bullet above for the same item.

2. **Medium: the "From 0.11.0" section deletes the stale lines before it tells the app to replace its own uses of them** (decision 8, the new section's step 2).
   - EXECUTED: an app's own `text-code-builtin` compiles while the stale lines stay, in the old colour, as the changelog says. Once they are deleted, the build exits 0 and the class is gone. The same holds for any of the twelve names and their `--color-` forms, and for a `var(--code-foreground)` in the app's own CSS.
   - This is the keyframe trap a second time: a step that loses styling with no error. `020`'s step 1 handles the keyframes with a grep. The new section has no grep for the twelve.
   - READ: the changelog gives the replacements. `--code-text` replaces `--code-foreground` (`CHANGELOG.md:41`). The rest are removed, with the `syntax-*` and `--code-*` roles that are left.
   - Fix: a step before the deletion. "Find your own uses of the twelve removed names, and their `text-code-*`, `--color-` and `syntax-*` forms: `grep -rn -e code-foreground -e code-escape -e code-builtin -e code-tag -e code-property -e code-decorator -e code-self -e code-invalid -e syntax-amber -e syntax-purple -e syntax-teal -e syntax-cyan src`. Replace `--code-foreground` with `--code-text`. Give each other use one of the roles that are left." T10 names `code-foreground` in that step. Criterion 3 says the smoke case proves the list. Optionally, `tests/smoke/upgrade.test.ts`'s "follows" app also installs `code-block`, uses one removed class, and follows the new section, so one smoke case walks the guide end to end.

3. **Medium: the specification is drawn on `b01e754`, but three builds in its lanes will land first** (Depends on, Lanes, Risks, criterion 4).
   - READ: `022t` adds a sixth slice to `\n## 0.12.0` (`lane-i-attempt/tests/unit/registry.test.ts:2586`, `describe("022t: the changelog")`). The specification counts five. After the fold that slice runs to the file's end. Its assertions are tied to their content, so it still passes. That is the vacuous kind of pass the specification means to end.
   - READ: `022t` and `022v` add three bullets to the 0.13.0 entry, and both regenerate `static/r/` items. Criterion 4's diff from `b01e754` would then show their `error-summary.json`, `code-block.json` and other changes.
   - EXECUTED: the fold merges clean with both. Merging cleanly does not prove nothing was dropped. A rebase resolved by hand could drop a bullet.
   - READ: `roadmap.md` §2 defines lane E as the harness (Playwright config, `scripts/a11y/`, CI, the bench and cost scripts). `tests/unit/` is in no lane. Lane I is held by `lane-i-run5` (`022v`, `022w`). Lane E is held by `lane-e-run5` (`022x`, `022y`).
   - Fix:
     - Depends on: `release/0.13.0` after `022t`, `022v` and `022w` land. Criterion 4 diffs from that base.
     - The six slices are named.
     - Lanes: T, I and the ledger files; drop E. It builds once lane I is free.
     - A unit check (T15) holds the fold to its sources. Every `- ` line of the base's 0.13.0 entry is in the folded entry's first list, in order, with only the "Rolled back" edit. Every line of the base's 0.12.0 entry is in the second list, in order, with only decision 4's edits.
     - The guard (decision 11) also fails on `indexOf("\n## 0.` in `tests/`, outside the helper. Then a branch cut before this lands cannot bring back the open-ended slice. T8 alone does not catch that.

4. **Low: T10 contradicts decision 8** (T10).
   T10 says "`WHO` holds no "0.12.0"". Decision 8's `WHO[1]` reads "0.12.0 was never released". T10 can never pass.
   Fix: "`WHO` holds no "0.12.0's notes" and no `#v0-12-0`; `WHO[1]` holds "0.12.0 was never released" and `#v0-13-0`."

5. **Low: T13 counts the new section third. It is fourth** (T13; `tests/e2e/upgrade.spec.ts:26`).
   READ: the page's parts are "Who this is for", "Before you start", then each of `SECTIONS`. With `SECTIONS` as `020`, `from-0-11-0`, `026`, the new title is part 4 of 7.
   Fix: "Seven parts, with 'From 0.11.0: code, the yellow and the sticky bar' fourth, after `020`'s."

6. **Low: T4's order assertion fails against decision 4's own words** (T4, decision 4).
   The paragraph begins "An `add` from `v0.13.0`", so a code span `add` comes before "rename".
   Fix: T4 says "rename" comes before "`add kuiper-theme highlighter`".

7. **Low: decision 8 leaves `UNCHANGED.values` and step 2's command unsettled** (`0.13.0.ts:148`; decision 8).
   - READ: `UNCHANGED.values` holds `shikiTheme.name`, under "keep their names and change their values". A 0.11.0 app knows that export as `codeTheme` (`CHANGELOG.md:44`). The memo flags it (§6). The specification does not.
     Fix: the row reads "`shikiTheme.name` (was `codeTheme.name`)", or the row moves to the new section's step 4.
   - Step 2 has two lines: `add kuiper-theme -o`, then the parts with no `-o`. "In the same command" does not say which line takes the code items.
     Fix: the second line, the parts', so the CLI asks before it overwrites an app's own edits to them. T10 checks that the first line has no `code-block`.

8. **Low: decision 13 does not guard the push** (decision 13).
   INFERRED: a local `v0.12.0` tag that survives goes to GitHub the first time the owner runs `git push --tags`, perhaps for `v0.13.0`. Then T6 reads it, and GitHub serves a release that never happened.
   Fix: the landing notes put the `git tag -d v0.12.0` check before the `v0.13.0` push. They ask for `git push origin v0.13.0` by name.

9. **Low: the inventory misses three lines** (memo §7).
   - READ: `tests/unit/changelog-page.test.ts:28`, `hrefs("[a](#v0-12-0)")`, is an example in a parser test. `changelog-page.test.ts:148` is a comment, "above 0.12.0 and 0.11.0". `022t`'s slice is the third (finding 3). The guard would catch the first two, but §7's table is what criterion 10 checks.
   - Fix: add them as "example: `#v0-13-0`" and "comment".
   - Everything else the brief named was checked and holds:
     - The site builds every registry and install URL from `VERSION`: `site.ts:23`, `:25`, `footer.svelte:66`, `llms.txt/+server.ts:27`, the install page.
     - There is no version picker. The changelog route has only `0.13.0/upgrade`.
     - `scripts/` holds only `lint-literals.ts` and `rename-kuiper.ts`. `release-check.ts` reads no tag or snapshot.
     - The workflow names no version. The Markdown twins are built from the pages.

10. **Low: "no row moves" will be checked against counts that do move** (criterion 9).
    READ: `scripts/bench/kuiper.ts` counts `releases` as `^## ` headings and `versionedRegistries` as `static/v*/r/` folders. The fold takes them from 12 to 11 and from 9 to 8. Row 11's rubric (dated releases, marks, the Updated fact, a migration page, notes or a feed, an upcoming list) counts neither, so no score moves. INFERRED.
    Fix: criterion 9 says "12 → 11 releases and 9 → 8 versioned registries; interface marks unchanged; no row moves".

11. **Low: the converse snapshot check and the guard need a little shape** (decisions 7 and 11).
    - The converse check is sound. CI's `checks` job checks out with `fetch-depth: 0` and `fetch-tags: true` (`matrix.yml:76–77`). Without tags, the suite already fails: "at least one released snapshot exists" (EXECUTED). But without tags, a naive converse check also fails once for each of eight folders.
      Fix: it asserts the tag list first, with one message ("this clone has no tags; fetch them").
    - The guard, line by line, churns whenever an allowed line moves.
      Fix: it takes `pluto-allowed.json`'s shape (a glob, a pattern, a count, a reason), in a fixture of its own. Then only a new match changes it.

### What holds

- **The ruling and the kind.** It is the owner's (c), recorded with its source. It is a full specification, rightly: it touches the changelog, the guide, `static/`, the tokens and a dozen tests.
- **History against live.** The calls are right. Landed specifications, reviews and memos stay as written. `scripts/rename-kuiper.ts` stays, and goes in 0.14.0. The scorecard's run log is kept and its definition completed. `README.md`, `AGENTS.md` and `context/README.md` hold no 0.12.0 (EXECUTED).
- **The guide defect is real** (EXECUTED, above). The "From 0.11.0" section is the right fix. Only the guide can put 0.12.0's steps in order against `020`'s. The changelog cannot, since it lists changes. With finding 2, the order is safe:
  - `scrollbar-code` is renamed before the update;
  - the code items go with the theme in step 2;
  - everything else follows the update, and the deletions follow their greps;
  - no `add` precedes step 1, and `upgrade.spec.ts`'s existing test keeps that.
- **Deleting `static/v0.12.0/`.** `@sveltejs/adapter-static` copies `static/` into `build/`, and `wrangler.jsonc` serves `./build` as Workers assets with `not_found_handling: "404-page"` (READ). `static/_redirects` holds only the six theme-page rules, and nothing redirects a version. Only `registry.test.ts:1821` and `tokens-lifecycle.test.ts:71` read the folder, and the bench counts it (READ). No redirect is right: a pinned request should fail loudly, not get the rename's breaking changes.
- **The tokens.** The built CSS stays byte-identical (EXECUTED). The DTCG record stays true. The 24 removed names have `since` 0.4.0 or 0.7.0, so each shipped in 0.11.0 and is absent from 0.13.0: "removed in 0.13.0" is what a released app sees. The 27 `since` values name the first release that ships them. No entry would read `since` and `removed` both 0.13.0 (EXECUTED).
- **The helper's throw** ends the vacuous pass for the slices it serves. A missing heading throws, and the slice no longer runs to the file's end (INFERRED from §8 and this review's fold: the five slices pass on the folded file today).
- **The counts.** The rename guard's 28 and 21 (EXECUTED). `meter` stands in at 0.4.0 (EXECUTED). One side effect: the `pluto-theme` alias entry's `updatedIn` reads 0.11.0, where it read 0.12.0. Its page redirects, so no page shows it. INFERRED.
- **Q1** is framed with two options, the recommended one first, and the reason. No other question belongs to the owner. Whether the site was ever deployed changes nothing decided here. The local tag is an action for the owner, rightly placed in the landing notes. Every other choice is the design lead's, under the owner's delegation.

## Constitution checks

- §1 and §2: the change makes the release record true. §2.4 ("the release is tagged") gets one tag line, `v0.11.0` then `v0.13.0`.
- §3 not a package, not a CLI: untouched.
- §4.1 source, not a package: no item reaches back. A deployed `/v0.12.0/r` going 404 breaks no installed app.
- §4.3 tokens are the one source: the sources change, and the published copies follow. The CSS is byte-identical.
- §4.4 accessible and proven: untouched. No item's behaviour changes.
- §4.5 and §4.6: no new input or dependency.
- §5 the pipeline: research exists and is labelled. It is a full specification, for a stated reason. The ruling is recorded. The scorecard re-run is a criterion (finding 10).
- §6 never break an installed app silently: this is what the guide defect, finding 1's reader split and finding 2 are about. Once they are fixed, the 0.11.0 → 0.13.0 path names every step in a safe order.
- §6 never commit or push: nothing committed or pushed. Agents push no tags (decision 13; finding 8).

## Verdict

Does not land yet. Finding 1: the fold's repeated heads leave the retargeted tests without a rule, and show a 0.11.0 reader "nothing to change" before an interface change. Finding 2: the new guide section loses an app's own code colours silently. Finding 3: the specification must be drawn on the base that `022t`, `022v` and `022w` leave, with a check that the fold loses no bullet. Findings 4 to 6 are test texts that cannot pass as written.

## Disposition

