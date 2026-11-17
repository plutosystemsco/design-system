# 020d — 0.12.0 was never released

- **Status:** draft, 2026-11-17. Awaiting its spec review.
- **Date:** 2026-11-17
- **Author:** the design lead
- **Kind:** specification. Not a small change: it touches more than one item or page (the changelog, the upgrade guide, `static/`, the token files, one item's comment and a dozen tests). It changes no item's interface, and adds no token and no dependency.
- **Ruling:** the owner, 2026-11-17: "0.12.0 was never released; the next release is 0.13.0. The roadmap, the changelog, the README and the code that name a 0.12.0 release are amended by a change of their own (the roadmap row '0.12.0 was never released')" (`research/2026-11-17-structural-review.md`, "The owner's answers", L2 (c)).
- **Research:** [`research/2026-11-17-0-12-0-was-never-released.md`](../research/2026-11-17-0-12-0-was-never-released.md), the inventory. Section numbers below (§n) are the memo's.
- **Depends on:** `release/0.13.0` at `b01e754`. Ranked in `roadmap.md` §2, 0.13.0, as the row this specification adds (`020d`).
- **Lanes:** T (the token files' metadata), I (one comment in `field`), E (tests), and the ledger files `CHANGELOG.md`, the upgrade guide and `static/r/`. It lands alone, between other landings.
- **Blocks:** the `v0.13.0` tag.

## Intent

Make the repository say what happened: the last release is 0.11.0, and the next is 0.13.0. 0.12.0's work ships in 0.13.0. So an app on 0.11.0 gets one changelog entry, one upgrade guide and one update, in the right order. Today the guide tells that app to apply "0.12.0's notes" first. Those notes install the 0.13.0 theme before the guide's step 1, the keyframe rename, and the app's animations drop out silently (§6).

## Decisions

1. **0.12.0 is not a release.** Nothing outside the historical record calls it one. The 0.13.0 entry, the guide and the token metadata all count from 0.11.0. Precedent: `011` did the same for 0.9.0 and 0.10.0 (§2).

2. **The changelog folds 0.12.0's entry into 0.13.0's.** No `## 0.12.0` heading of any kind remains. The 0.13.0 entry's first paragraph reads: "0.12.0 was never released; its changes are folded in here, so this entry lists everything since 0.11.0." That is 0.11.0's own sentence for 0.9.0 and 0.10.0 (`CHANGELOG.md:64`).
   - _Why:_ every app is on 0.11.0 or older. It updates once, so it should read one list. Keep a Changelog moves unreleased work into the release that ships it, and keeps `[YANKED]` for versions that were released and pulled. GOV.UK Frontend notes a skipped version in one line under the next release. SemVer allows the gap. (§2)
   - _Rejected: a heading `## 0.12.0 — never released`._ It gives the page an anchor and a date line for a version with no tag, no registry and no install path. Three component pages would keep "Updated 0.12.0". A reader would have to merge two sets of update steps by hand, and that merge is exactly where the keyframe trap is.
   - _Rejected: `[YANKED]`._ That means released, then pulled. 0.12.0 was never released.

3. **The folded entry's order.** Each part keeps its words except where decision 4 says otherwise:
   1. The fold sentence (decision 2).
   2. 0.13.0's intro paragraph. Its first sentence becomes: "The design system is named the Kuiper Design System, and its code names now say Kuiper." A 0.11.0 app has not been told the name either.
   3. 0.12.0's first paragraph: highlighting, Tombaugh, the white code ground, the yellow.
   4. 0.12.0's design-site paragraph, with `/v0.12.0/r` → `/v0.13.0/r`.
   5. 0.13.0's bullets, unchanged and first. The rename has an order an app must follow, and `bullet(head)` in the tests takes the first match.
   6. One line: "Also since 0.11.0: code, the yellow, the font's spacing, the sticky bar, `kbd` and the error summary."
   7. 0.12.0's bullets, in their order.
   8. The update paragraph (decision 4).

   0.12.0's naming paragraph ("Its code names are unchanged in this release … 0.13.0 renames them", `CHANGELOG.md:37`) is deleted. It is false in 0.13.0, and step 2 replaces it.
   - _Why two lists, not one bullet per item:_ the 0.13.0 entry already names `kuiper-theme`, `app-shell`, `code-editor` and `use-highlighted-code` twice. Merging 0.12.0's long bullets into 0.13.0's would rewrite migration notes that the tests and the smoke test hold word for word. Two lists keep every note as it was checked.

4. **The folded text names what an app installs.** In 0.12.0's bullets and the update paragraph, `pluto-theme` becomes `kuiper-theme`. That is seven words: the theme bullet's head, three mentions in the `error-summary` and `app-shell` bullets, and three in the update paragraph. The section's other three `pluto` words go with the naming paragraph (decision 3), so none of its ten is left (§5). `CHANGELOG.md:10`'s "Rolled back to 0.12.0" becomes "Rolled back to 0.11.0". The update paragraph becomes:

   > An `add` from `v0.13.0` updates `kuiper-theme`, since every item names it. So rename your own uses of the four old keyframe names first (see `kuiper-theme`, above), then update the code items with the theme: `add kuiper-theme highlighter use-highlighted-code code-block code-editor` (and `code-languages` if you have it), then `bun install`.

   The rest of the paragraph, from "Otherwise an older highlighter paints half in the old palette", is kept, with `kuiper-theme` for `pluto-theme`.

5. **`static/v0.12.0/` is deleted, with no redirect.** It holds 76 files.
   - From GitHub, no pinned URL ever reached it: `v0.12.0` returns 404 (§1).
   - From the site, it was served only if the site was ever deployed. The record says it was not, and this session could not check (§1). If it was, the next deploy drops `/v0.12.0/`, and a pinned `add` fails with a 404.
   - No installed app breaks, since none reaches back (constitution §4.1).
   - A redirect to `/v0.13.0/` would hand a request pinned to 0.12.0 the rename's breaking changes without a word. That is the silent break constitution §6 forbids.
   - This supersedes `020`'s "`static/v0.4.0/` to `static/v0.12.0/`: historical; frozen" for `v0.12.0` alone.

6. **No token says 0.12.0.** Every `"since": "0.12.0"` in `tokens/` (27) and every `"removed": "0.12.0"` in `tokens/kuiper.removed.json` (24) reads `"0.13.0"`. `bun run build:tokens` rewrites the twelve published copies. The tokens-lifecycle test derives both fields from the `static/v*` folders, so decision 5 forces this, and checks it (§8). The built CSS stays byte-identical (§8). `registry.json` has no `meta.since` of 0.12.0 (§4). 0.13.0 is unreleased, so this changes no released file.

7. **The tests count releases from tags, and read the 0.13.0 entry.**
   - **The converse snapshot check.** "Released snapshots" (`registry.test.ts:2076`) gains a test: every `static/v<x>/` is either a tag's or the current version's. It fails today on exactly `v0.12.0` (§5). It catches an untagged snapshot on any clone that has tags. CI's unit job fetches them.
   - **The never-published test** (`generated.test.ts:1662`) adds `static/v0.12.0`.
   - **The tag-reading branch goes.** `registry.test.ts:1819` keeps "package.json reads 0.13.0, and `static/v0.13.0/` exists". It drops the `static/v0.12.0` existence check and the `git tag --list 'v0.12.0'` branch. A test must not change its result with a machine's local tags (L2).
   - **The 0.12.0 entry's tests read the 0.13.0 entry.** Each keeps its assertions about content. Where one counts "one `pluto-theme` bullet", it counts the one `kuiper-theme` bullet that holds "The code map is Meridian's roles". The 0.13.0 entry's own bullets stay the first match for each head.
   - **One entry reader, which fails loudly.** The tests that slice "the 0.13.0 entry" end it at `\n## 0.11.0`, through one shared helper that throws if either heading is missing. Today, five slices end at `\n## 0.12.0`. With the heading gone, they run to the file's end and still pass, untested (§5).
   - **The release order** test reads `["0.13.0", "0.11.0", "0.8.0"]`, with no 0.9.0, 0.10.0 or 0.12.0 heading. The changelog page's releases[1] is 0.11.0, 2026-11-07.
   - **Updated facts.** `kbd`, `error-summary` and `product-home` read 0.13.0. `meter` stands for an older release, 0.4.0, in `component-data.test.ts` and `site.spec.ts`, in place of `kbd`'s 0.12.0. No item has a change after its arrival in an older release, so the stand-in is an arrival (§5).
   - **The rename guard** (`tests/fixtures/pluto-allowed.json`) has history from `## 0.11.0`, count 28, and record from `## 0.13.0` to `## 0.11.0`, count 21. The `registry-comments.test.ts` history entry, count 2, goes with the test it allowed.
   - **`registry-comments.test.ts`'s 0.12.0-only release check** (l. 121–160) is deleted. It skips at every version but 0.12.0, so it can never run again. Its fixture stays, since the reworded-comments test reads it.
   - **The smoke test's upgrade case** keeps its behaviour, which is already 0.11.0 → this tree. Its labels say 0.13.0.

8. **The guide is the path from 0.11.0.**
   - `WHO[1]` becomes: "Coming from 0.11.0, as every app is: 0.12.0 was never released. This page is the whole path from 0.11.0, and the changelog's [0.13.0 entry](/changelog/#v0-13-0) lists every change."
   - `020`'s step 1 adds one sentence: rename your own class named `scrollbar-code`, if you have one, since the theme now defines it (`CHANGELOG.md:41`).
   - `020`'s step 2 adds the code items to the parts to update in the same command: `highlighter`, `use-highlighted-code`, `code-block`, `code-editor` and `code-languages`, with `kbd` and `error-summary`. The reason, in a clause: the theme updated alone paints code half in the old palette.
   - A new section follows `020`'s: `id: "from-0-11-0"`, `spec: "013"`, titled "From 0.11.0: code, the yellow and the sticky bar". It is for `013`, `014`, `016`, `019` and `019a`, the interface changes 0.12.0's work made, with no renames table. Its steps come after the update, each from the changelog's own words:
     1. `bun install`, for the highlighter's packages.
     2. Delete the stale lines from `app.css`: the twelve variables in `:root` and `.dark`, their `--color-` forms in `@theme inline`, and the derived `--code-…` lines.
     3. Delete the old unlayered `html:has([data-sticky-bar])` rule. With a sticky header of your own, set `scroll-padding-top` on `html`.
     4. Replace the removed exports: `codeHighlight`, `pythonLanguageConfigured` and `pythonRoles` from `code-editor`, and `codeTheme`, now `shikiTheme`, and `tokenClasses`, now `roleClasses`, from `highlighter`.
     5. `error-summary`: code or tests that found the alert on the root look for `[data-slot="error-summary-content"]`.
     6. `kbd`: `class="bg-muted"` keeps the old ground, and `class="select-none"` keeps a key unselectable.
     7. A strict Content Security Policy adds `'wasm-unsafe-eval'`.
   - `UNCHANGED.names` reads: "Every CSS variable, class, utility, prop, slot and export name the sections above do not name."
   - `UNTIL`, the alias window, is unchanged. Every aliased name shipped in 0.11.0 (§3).
   - _Why a section, not a pointer to the changelog:_ the changelog lists changes. Only the guide can set their order across `020`'s steps.

9. **Comments and examples say 0.13.0, or 0.11.0 where they mean an old item.**
   - `field-context.svelte.ts:14`: "The keys before 0.13.0", as its eight sibling controls say. That rebuilds `field.json` in `static/r/` and `static/v0.13.0/r/`. It is a comment only, and 0.13.0's `field` bullet already covers the item.
   - `src/lib/site/changelog.ts`'s doc-comment samples.
   - The field-keys test views and `field-keys.spec.ts`: "a 0.11.0 `Field`".
   - `generated.test.ts:1146`'s title: "today's value".
   - `literals.test.ts:414` and `lint-literals.ts:288`: "for 0.13.0".
   - `scripts/rename-kuiper.ts` is history and is not touched. It goes in 0.14.0 (`020`).

10. **The context: claims are corrected, and history is kept.**
    - `roadmap.md`:
      - §1's "(0.12.0, after `018`)" becomes "(the 0.12.0 tree, never released, after `018`)".
      - `020`'s "Depends on: the `v0.12.0` tag" becomes "`dad6f76`, 0.12.0's last commit, never tagged".
      - Q2's "`v0.12.0` was tagged on `dad6f76`" becomes "0.12.0's work ended at `dad6f76`, never tagged; the owner ruled on 2026-11-17 that 0.12.0 was never released (`020d`)".
      - A row for `020d` joins the 0.13.0 table.
    - `handoff.md:36` reads: "0.12.0 was never released (the owner, 2026-11-17; `020d`). The next tag is `v0.13.0`."
    - The scorecard is an instrument, completed in place. Its "What 'Pluto 0.12' means here" gains "(0.12.0 was never released; the tree's `package.json` read 0.12.0)". Row 11's evidence, "The 0.12.0 entry's 'delete these lines' list", says 0.13.0's at this specification's re-run. The run log is kept as written.
    - Landed specifications, reviews and memos are unchanged (`context/README.md`). That is 361 lines in 57 files (§7).
    - `README.md`, `AGENTS.md` and `context/README.md` need nothing (§7).

11. **A guard keeps it so.** A unit test runs `git grep` for `0\.12\.0`, `v0\.12\.0` and `v0-12-0` over tracked files. It excludes `context/`, `static/v0.4.0/` to `static/v0.11.0/`, `scripts/rename-kuiper.ts` and `*bun.lock`. Every match must sit in the test's own counted allowlist:
    - the fold sentence in `CHANGELOG.md`;
    - `WHO[1]`;
    - the absence assertions in the tests;
    - the test itself.

    Today it finds about 280 lines (§7, the live rows).

12. **No alias anchor.** The changelog page has no `id="v0-12-0"`. An old link to `/changelog/#v0-12-0` lands at the page's top. An anchor for a version that never existed would say it did.

13. **The owner's git state.** Agents never push or delete tags.
    - The landing notes ask the owner to run `git tag -l v0.12.0` on each machine they have tagged from. If the tag is there, `git tag -d v0.12.0` deletes it. It is local, and was never pushed (§1).
    - The remote branch `release/0.12.0` is Q1.

## Scope

**In:**

- `CHANGELOG.md`.
- The deletion of `static/v0.12.0/`.
- `tokens/kuiper.tokens.json`, `kuiper.light.tokens.json`, `kuiper.dark.tokens.json` and `kuiper.removed.json`, and their regenerated copies.
- `src/lib/registry/ui/field/field-context.svelte.ts` (the comment) and the regenerated `field.json` files.
- `src/lib/site/upgrade/0.13.0.ts`.
- `src/lib/site/changelog.ts` (comments) and the field-keys test views (comments).
- Tests: `tests/unit/registry.test.ts`, `registry-comments.test.ts`, `generated.test.ts`, `component-data.test.ts`, `changelog-page.test.ts`, `toast-site.test.ts` and `literals.test.ts`; the new guard test; `tests/fixtures/pluto-allowed.json`; `tests/e2e/site.spec.ts`, `upgrade.spec.ts` and `field-keys.spec.ts`; and `tests/smoke/code-add.test.ts` (labels).
- `scripts/lint-literals.ts` (a comment).
- `context/roadmap.md`, `context/handoff.md` and `context/research/benchmark-scorecard.md`, as decision 10 says.

**Out:**

- Landed specifications, reviews and memos.
- `scripts/rename-kuiper.ts`.
- `static/v0.4.0/` to `static/v0.11.0/`.
- Any item's behaviour or interface.
- GitHub's branches and tags (decision 13, Q1).
- A deploy.
- README's other stale lines (the structural review's X3, a small change of its own).

## Tests written first

Each is written, or changed, before the fix, and seen failing on `b01e754`. "Fails today" was run on a copy (§8) where marked EXECUTED. Elsewhere it is INFERRED from the source and confirmed by running it at build.

- **T1** (unit, `registry.test.ts`). No `## 0.9.0`, `## 0.10.0` or `## 0.12.0` heading. The versions begin `0.13.0, 0.11.0, 0.8.0`. The 0.13.0 entry's first paragraph is decision 2's sentence. _Fails today:_ 0.12.0 is the second heading.
- **T2** (unit). The 0.13.0 entry holds no `v0.12.0` and no `/v0.12.0/r`. Its site paragraph names `/v0.13.0/r`. It names "the Kuiper Design System". _Fails today._
- **T3** (unit). No bullet in the 0.13.0 entry is headed `pluto-theme`. The rename's `kuiper-theme` bullet comes before the code-map `kuiper-theme` bullet. The entry holds no "Its code names are unchanged". _Fails today:_ the entry, read to `## 0.11.0`, holds `` - `pluto-theme`: ``.
- **T4** (unit). The update paragraph names `v0.13.0` and `add kuiper-theme highlighter use-highlighted-code code-block code-editor`. Its "rename" comes before its first `add`. It still names the twelve removed variables (the smoke test's list). _Fails today._
- **T5** (unit, `generated.test.ts`). `static/v0.12.0` does not exist. _Fails today._
- **T6** (unit, "released snapshots"). Every `static/v<x>/` is a tag's or the current version's. _Fails today on `v0.12.0`_ (EXECUTED, §5).
- **T7** (unit). No `"0.12.0"` in any file under `tokens/` or `static/r/tokens/`. _Fails today:_ 51 and 81 matches (EXECUTED). The lifecycle tests T12 and T13 then hold the true values (EXECUTED, §8).
- **T8** (unit). The entry helper throws when a heading it names is missing. _Fails today:_ there is no helper, and the five slices return the file's tail.
- **T9** (unit, `component-data.test.ts`). `kbd`, `error-summary` and `product-home` read 0.13.0, and `meter` reads 0.4.0. _Fails today:_ the three read 0.12.0 (EXECUTED).
- **T10** (unit, guide data). `WHO` holds no "0.12.0" and no `#v0-12-0`, and says 0.12.0 was never released. `SECTIONS` ids are `020`, `from-0-11-0`, `026`, in that order. `020`'s step 2 names `code-block` and `error-summary`. The new section's steps name `bun install`, `--code-foreground`, `data-sticky-bar`, `shikiTheme`, `error-summary-content` and `wasm-unsafe-eval`. `UNCHANGED.names` holds "do not name". _Fails today._
- **T11** (unit, the guard, decision 11). _Fails today_ on every live line.
- **T12** (unit, the rename guard). The fixture's counts are as decision 7 says. _Fails_ once T1 to T4's fix is in and the fixture is not.
- **T13** (e2e, `upgrade.spec.ts`). Seven parts, with "From 0.11.0: code, the yellow and the sticky bar" third. Over the whole page and its twin, no add command comes before `020`'s step 1 (the existing test, kept). _Fails today._
- **T14** (e2e, `site.spec.ts`). `meter`'s facts link `/changelog/#v0-4-0`. The changelog page has `#v0-13-0`, `#v0-11-0` and `#v0-2-0`, and no `#v0-12-0`. _Fails today._

## Acceptance criteria

1. T1 to T12 pass in `bun run test:unit`. The only other failures allowed are the machine-timing tests that fail at the base (§8).
2. T13 and T14 pass in the Chromium projects. The rest of `upgrade.spec.ts` and `site.spec.ts` passes.
3. `bun run test:smoke`'s upgrade case passes, under its new labels.
4. `git diff b01e754` shows no change to `src/app.css`, `static/r/tokens/kuiper.css`, or any `static/r/styles/maia/*.json` but `field.json`, whose only change is its comment line.
5. `bun run build` leaves no `build/v0.12.0/`, and no built page holds `v0-12-0` or `/v0.12.0/`.
6. `bun run check` reports 0 errors. `bun run lint` passes.
7. `bun scripts/site/release-check.ts --before-ci` exits 0.
8. The roadmap and the handoff read as decision 10 says. A reviewer checks this by reading them.
9. The scorecard is re-run, and its movement is recorded. Expected: no row moves.
10. The change review, by a reviewer who wrote neither this specification nor the build, finds every live row of §7's table handled as its "Change" column says, or answered in writing.

## Build order

1. The tests first: T1 to T14, seen failing. Note which.
2. `static/v0.12.0/` deleted. The token metadata rewritten, then `bun run build:tokens`.
3. `CHANGELOG.md` folded.
4. The tests retargeted, and the fixture's counts set.
5. The guide.
6. The comments. Then `bun run build:registry`.
7. The context documents.
8. Then the whole check, and the scorecard.

## Risks

- **Branches in flight.** A build cut before this lands may add a 0.13.0 bullet, or a test that slices to `\n## 0.12.0`. After this lands, such a slice runs to the file's end and passes untested. T8's helper catches it only if the build uses the helper. So the landing notes tell each open lane to rebase onto this change, and to replace any `\n## 0.12.0` with the helper. The guard T11 catches the string itself.
- **The guide grows a third section** in a page that `020b` and `020c` fitted to its column. The new section has no renames table, so it adds no wide block. `upgrade.spec.ts`'s column tests cover it.
- **The site may have been deployed.** If it was, `/v0.12.0/r` goes from 200 to 404 at the next deploy. That is intended (decision 5).

## Open questions for the owner

**Q1. The public branch `release/0.12.0`.** It is at `dad6f76`, an ancestor of `release/0.13.0`, so deleting it loses no commit. GitHub serves a registry from it: `raw…/release/0.12.0/static/r/…` returns 200 (§1).

- **(a) Delete it when you push `v0.13.0` (recommended).** A public branch named for a release that never happened invites a pinned install from it, and this specification removes every other sign of one.
- **(b) Keep it.** Nothing in the repository links to it.

Only the owner pushes, so only the owner can do (a). Every other choice here is the design lead's, under the owner's delegation of 2026-11-17.

## Landing notes

_To be filled in when it lands: which tests were seen failing first, the review, the scorecard's movement, Q1's answer, and whether the owner found and deleted a local `v0.12.0` tag._
