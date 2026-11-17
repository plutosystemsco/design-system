# 020d — 0.12.0 was never released

- **Status:** built; waits for its change review (lane S, 2026-11-17, in `.claude/worktrees/lane-s-020d` on `7ec5488`, uncommitted). Fit to build after the spec review's re-check (2026-11-17; its two wording notes written in by the design lead). The review ([`reviews/020d-0-12-0-was-never-released-spec-2026-11-17.md`](../reviews/020d-0-12-0-was-never-released-spec-2026-11-17.md)) said "does not land yet", with 1 High, 2 Medium and 8 Low findings. "Review", below, maps each finding to its fix.
- **Date:** 2026-11-17
- **Author:** the design lead
- **Kind:** specification. Not a small change: it touches more than one item or page (the changelog, the upgrade guide, `static/`, the token files, one item's comment and a dozen tests). It changes no item's interface, and adds no token and no dependency.
- **Ruling:** the owner, 2026-11-17: "0.12.0 was never released; the next release is 0.13.0. The roadmap, the changelog, the README and the code that name a 0.12.0 release are amended by a change of their own (the roadmap row '0.12.0 was never released')" (`research/2026-11-17-structural-review.md`, "The owner's answers", L2 (c)).
- **Research:** [`research/2026-11-17-0-12-0-was-never-released.md`](../research/2026-11-17-0-12-0-was-never-released.md), the inventory. Section numbers below (§n) are the memo's. §10 holds the new base's figures.
- **Drawn on:** `71cb067` (`022t` landed, in `.claude/worktrees/lane-i-attempt`), plus `lane-i-run5`'s `CHANGELOG.md` as it stands now (`022v`'s `code-block` bullet and `022w`'s reworded `search-field` bullet, uncommitted). Every count below is that base's.
- **Depends on:** the current batch landing on `release/0.13.0`. That is `022t`, `022v` and `022w` in lane I, and `022x`, `022y` and `022z` in lane E (the design lead's ruling, 2026-11-17). **The build re-reads the landed base and re-takes every count there.** That covers the bullets in each list, the slices, the live lines, the `pluto` counts and the bench counts. A count that differs is recorded in the landing notes, with its cause. Ranked in `roadmap.md` §2, 0.13.0, as the row this specification adds (`020d`).
- **Lane:** S. The changelog and the guide are site pages (the design lead's ruling, 2026-11-17). The token metadata and the one `field` comment ride along: no lane-T build is running, and lane I is free once its batch lands. The ledger files are `CHANGELOG.md`, the guide and `static/r/`.
- **Blocks:** the `v0.13.0` tag.

## Intent

Make the repository say what happened: the last release is 0.11.0, and the next is 0.13.0. 0.12.0's work ships in 0.13.0. So an app on 0.11.0 gets one changelog entry, one upgrade guide and one update, in a safe order.

Today the guide tells that app to apply "0.12.0's notes" first. Those notes install the 0.13.0 theme before the guide's step 1, the keyframe rename, and the app's animations drop out silently. The spec review ran that path on a scratch app and saw it happen (§6).

## Decisions

1. **0.12.0 is not a release.** Nothing outside the historical record calls it one. The 0.13.0 entry, the guide and the token metadata all count from 0.11.0. Precedent: `011` did the same for 0.9.0 and 0.10.0 (§2).

2. **The changelog folds 0.12.0's entry into 0.13.0's.** No `## 0.12.0` heading of any kind remains. The 0.13.0 entry's first paragraph reads: "0.12.0 was never released; its changes are folded in here, so this entry lists everything since 0.11.0." That is 0.11.0's own sentence for 0.9.0 and 0.10.0 (`CHANGELOG.md:64`).
   - _Why:_ every app is on 0.11.0 or older. It updates once, so it should read one entry. Keep a Changelog moves unreleased work into the release that ships it, and keeps `[YANKED]` for versions that were released and pulled. GOV.UK Frontend notes a skipped version in one line under the next release. SemVer allows the gap. (§2)
   - _Rejected: a heading `## 0.12.0 — never released`._ It gives the page an anchor and a date line for a version with no tag, no registry and no install path. Three component pages would keep "Updated 0.12.0".
   - _Rejected: `[YANKED]`._ That means released, then pulled. 0.12.0 was never released.

3. **The folded entry has two parts, split at one line.**

   **The first part** is 0.13.0's entry as the base holds it, with three changes:
   1. The fold sentence (decision 2) comes first.
   2. The intro's first sentence becomes "The design system is named the Kuiper Design System, and its code names now say Kuiper." A 0.11.0 app has not been told the name either.
   3. The edits of decision 4.

   Its 26 bullets keep their order. The rename's bullets come first, because an app must follow their order.

   **The split line** is a paragraph of its own: "Also since 0.11.0: code, the yellow, the font's spacing, the sticky bar, `kbd` and the error summary. A bullet below adds to any bullet above for the same item." It appears once.

   **The second part** is 0.12.0's entry as the base holds it, in its order, less its heading and its naming paragraph. That is:
   1. its first paragraph: highlighting, Tombaugh, the white code ground, the yellow;
   2. its design-site paragraph, with `/v0.12.0/r` → `/v0.13.0/r`;
   3. its 18 bullets;
   4. its update paragraph, with decision 4's edits.

   The naming paragraph ("Its code names are unchanged in this release … 0.13.0 renames them", `CHANGELOG.md:40` at the base) is deleted. It is false in 0.13.0, and the first part's intro replaces it.

   - _Why whole parts:_ each part is a release's text, as its own tests checked it. Tests from `013` to `019` read the second part and keep every count and position they hold today. Tests from `020` on read the first (decision 7). Merging bullets per item would rewrite migration notes that the tests and the smoke test hold word for word.

   **A head in both parts gets a pointer.** A bullet's head is its code spans before the first colon. Seven single heads in the first part also head a bullet in the second: `kuiper-theme` (twice), `highlighter`, `app-shell`, `use-highlighted-code`, `code-editor`, `code-block` (from `022v`) and `error-summary` (from `022t`). Each of those eight bullets ends with one more sentence:
   - `code-block`, `code-editor`, `highlighter`, `use-highlighted-code`, `app-shell` and `error-summary` end with "See also `<name>` under "Also since 0.11.0", below."
   - Both `kuiper-theme` bullets end with "See also the code-map `kuiper-theme` bullet under "Also since 0.11.0", below."
   - The first part's doc-comment bullet, headed by 61 names, names 14 that also head a second-part bullet: `code-block`, `code-editor`, `highlighter`, `code-languages`, `use-highlighted-code`, `liquid-glass`, `live-console`, `marketing-bar`, `marketing-footer`, `proof-band`, `stage`, `stage-card`, `stage-hero` and `app-shell`. It ends with "Of these, `code-block`, … and `app-shell` also have a bullet under "Also since 0.11.0", below."
   - `022t`'s "`error-summary`: a new optional prop, `attempt`; nothing to change." reads "nothing to change for it." `022t`'s test (`toContain("nothing to change")`) still passes.
   - The second part's bullets keep their words, but for decision 4.

   _Why:_ without the pointers, a 0.11.0 reader meets "`error-summary` … nothing to change" or "`code-block`: … no prop, slot or export changes" before the interface change below. That is the merge-by-hand trap that decision 2 avoids.

4. **The folded text names what an app installs.** In the second part, `pluto-theme` becomes `kuiper-theme` in seven places:
   - the theme bullet's head;
   - "so `pluto-theme` gives the page" in `app-shell`;
   - the two "(see `pluto-theme`)" pointers in `error-summary` and `app-shell`, which become "(see the code-map `kuiper-theme` bullet)";
   - three mentions in the update paragraph.

   The section's other three `pluto` words go with the naming paragraph. So none of its ten is left (§5), and the 0.13.0 entry's count stays 21 (§10).

   `CHANGELOG.md:10`'s "Rolled back to 0.12.0" becomes "Rolled back to 0.11.0".

   The update paragraph becomes:

   > An `add` from `v0.13.0` updates `kuiper-theme`, since every item names it. So first rename your own uses of the four old keyframe names (the first `kuiper-theme` bullet, at the top of this entry), then update the code items with the theme: `add kuiper-theme highlighter use-highlighted-code code-block code-editor` (and `code-languages` if you have it), then `bun install`.

   The rest of the paragraph, from "Otherwise an older highlighter paints half in the old palette", is kept, with `kuiper-theme` for `pluto-theme`.

5. **`static/v0.12.0/` is deleted, with no redirect.** It holds 76 files.
   - From GitHub, no pinned URL ever reached it: `v0.12.0` returns 404 (§1).
   - From the site, it was served only if the site was ever deployed. The record says it was not, and this session could not check (§1). If it was, the next deploy drops `/v0.12.0/`, and a pinned `add` fails with a 404. The review read the adapter, `wrangler.jsonc` and `_redirects`: nothing redirects a version.
   - No installed app breaks, since none reaches back (constitution §4.1).
   - A redirect to `/v0.13.0/` would hand a request pinned to 0.12.0 the rename's breaking changes without a word. That is the silent break constitution §6 forbids.
   - This supersedes `020`'s "`static/v0.4.0/` to `static/v0.12.0/`: historical; frozen" for `v0.12.0` alone.

6. **No token says 0.12.0.** Every `"since": "0.12.0"` in `tokens/` (27) and every `"removed": "0.12.0"` in `tokens/kuiper.removed.json` (24) reads `"0.13.0"`. `bun run build:tokens` rewrites the twelve published copies.
   - The tokens-lifecycle test derives both fields from the `static/v*` folders, so decision 5 forces this, and checks it (§8).
   - The built CSS stays byte-identical. The review confirmed it by sha256, with the five `tokens-*` files passing 57 of 57.
   - `registry.json` has no `meta.since` of 0.12.0 (§4).
   - 0.13.0 is unreleased, so this changes no released file.

7. **The tests count releases from tags, and read the folded entry through one helper.**
   - **The helper.** `tests/helpers/changelog.ts` exports two functions:
     - `releaseEntry(log, version)` returns the text from `## <version>` to the next `\n## `. It throws, naming the heading, if either is missing.
     - `foldedParts(log)` returns `{ first, second }`: the 0.13.0 entry, split at the "Also since 0.11.0" line. It throws if that line is missing, or appears more than once.

     Every test that reads the 0.13.0 or the folded 0.12.0 entry by text uses one of them; `registry.test.ts`'s older regex `entry()` helper, for 0.11.0 and before, stays, since it already fails loudly on a missing heading (the re-check's note). The guard (decision 11) bans the open-ended `indexOf` slice anywhere else in `tests/`.
   - **What each reader reads.** At the base there are 16 heading `indexOf` calls in 11 readers (§10), plus `entry("0.12.0")`:

     | Test, at the base | Spec | Reads | Its counts, after |
     |---|---|---|---|
     | `registry.test.ts:1459`, the releases' order | `011`, `014` | headings | decision 7, "The release order" |
     | `registry.test.ts:1473`, "marks pluto-theme, code-block and code-editor as interface changes" | `014` | `second` | one bullet each for `kuiper-theme`, `code-block`, `code-editor`; `## 0.12.0` absent, the split line once |
     | `registry.test.ts:1496`, "holds 013's lines" | `013` | `second` | one bullet each for `kuiper-theme`, `highlighter`, `code-block`, `code-editor`, `code-languages`, `use-highlighted-code`; the update line reads `add kuiper-theme highlighter …` |
     | `registry.test.ts:1909`, "016's summary line, and its one pluto-theme bullet" | `016` | `second` | the summary line, in its first paragraph; one `kuiper-theme` bullet |
     | `registry.test.ts:1995`, "the font's own letter spacing" | `019a` | `second` | one `kuiper-theme` bullet |
     | `registry.test.ts:2028`, "1 error-summary and 1 app-shell bullet … after kbd's" | `019` | `second` | one each; `error-summary` at `kbd` + 1, `app-shell` at `kbd` + 2, as today |
     | `registry.test.ts`, "they name the 11 names" | `019` | `second` | `bullets("error-summary")[0]` is `019`'s bullet, with `data-slot`; the theme bullet's end (`…overrides your own value.$`, l. 2065) holds, since the bullet keeps its words |
     | `registry-comments.test.ts:231`, the reworded comments | `015` | `second` | the same items |
     | `registry-comments.test.ts`, the site's paragraph | `015` | `second` | `/v0.13.0/r` in place of `/v0.12.0/r` |
     | `registry-comments.test.ts:259`, "018: … code names wait for 0.13.0" | `018` | `first` | rewritten: the intro names "the Kuiper Design System" and says its code names now say Kuiper. Its paragraph is gone, so it cannot read `second` |
     | `registry.test.ts:2238`, 020 test 16 | `020` | `first` | unchanged |
     | `registry.test.ts:2394`, 027a test 2 | `027a` | `first` | unchanged |
     | `registry.test.ts:2490`, 027b test 2 | `027b` | `first` | unchanged |
     | `registry.test.ts:2514`, 021 criterion 18 | `021` | `first` | unchanged |
     | `registry.test.ts:2589`, "022t: the changelog" | `022t` | `first` | unchanged; "nothing to change" still holds |
     | `toast-site.test.ts:125`, "026: the changelog" | `026` | `first` | unchanged |

     The six slices that end at `\n## 0.12.0` (2238, 2394, 2490, 2514, 2589 and `toast-site.test.ts:125`) are what the throw is for. With the heading gone, `indexOf` returns −1, and each slice would run to the file's end and still pass (§5, §10).
   - **The converse snapshot check.** "Released snapshots" (`registry.test.ts:2076`) gains a test: every `static/v<x>/` is a tag's, or the current version's. It fails today on exactly `v0.12.0` (§5).
     - It first asserts that the clone has tags, and fails with one message: "this clone has no tags: run `git fetch --tags`". So a clone without tags gets one failure, not one per folder.
     - CI's unit job fetches tags (`matrix.yml:76-77`).
   - **The never-published test** (`generated.test.ts:1662`) adds `static/v0.12.0`.
   - **The tag-reading branch goes.** `registry.test.ts:1819` keeps "package.json reads 0.13.0, and `static/v0.13.0/` exists". It drops the `static/v0.12.0` existence check and the `git tag --list 'v0.12.0'` branch. A test must not change its result with a machine's local tags (L2).
   - **The release order** test reads `["0.13.0", "0.11.0", "0.8.0"]`, with no 0.9.0, 0.10.0 or 0.12.0 heading. `changelog-page.test.ts:148`'s comment says "above 0.11.0". Its releases[1] is 0.11.0, 2026-11-07, and its releases[2] is 0.8.0, 2026-11-01.
   - **`changelog-page.test.ts:28`'s example**, `hrefs("[a](#v0-12-0)")`, uses `#v0-13-0`.
   - **Updated facts.** `kbd`, `error-summary` and `product-home` read 0.13.0. `meter` stands for an older release, 0.4.0, in `component-data.test.ts` and `site.spec.ts`, in place of `kbd`'s 0.12.0. No item has a change after its arrival in an older release, so the stand-in is an arrival (§5). The `pluto-theme` alias entry reads 0.11.0. Its page redirects, so no page shows it (the review).
   - **The rename guard** (`tests/fixtures/pluto-allowed.json`):
     - history runs from `## 0.11.0`, count 28;
     - record runs from `## 0.13.0` to `## 0.11.0`, count 21;
     - the `registry-comments.test.ts` history entry, count 2, goes with the test it allowed.
   - **`registry-comments.test.ts`'s 0.12.0-only release check** (l. 121–160) is deleted. It skips at every version but 0.12.0, so it can never run again. Its fixture stays: the reworded-comments test reads it.
   - **The smoke test's upgrade case** keeps its behaviour, which is already 0.11.0 → this tree. Its labels say 0.13.0.
   - **The fold keeps every bullet** (T15).
     - At build, the base's two entries are diffed against the folded parts, line by line. Every base line is there, in order, changed only as decisions 3 and 4 say. The diff goes in the landing notes.
     - Permanently, `tests/fixtures/020d-fold-heads.json` records the base's bullet heads, in order, for each part. `kuiper-theme` stands for `pluto-theme`. A unit test holds each part's heads to it, as an ordered subsequence. A later bullet may be added, or its text edited, but a base bullet cannot be dropped unseen. The fixture is written from the landed base and checked by the change review against `git show`.

8. **The guide is the path from 0.11.0.**
   - `WHO[1]` becomes: "Coming from 0.11.0, as every app is: 0.12.0 was never released. This page is the whole path from 0.11.0, and the changelog's [0.13.0 entry](/changelog/#v0-13-0) lists every change."
   - `020`'s step 1 adds one sentence: rename your own class named `scrollbar-code`, if you have one, since the theme now defines it (`CHANGELOG.md:44` at the base).
   - **`020`'s step 2.** Its command has two lines: `add kuiper-theme -o`, then the parts, without `-o`. The code items go on **the second line**, with the parts: `highlighter`, `use-highlighted-code`, `code-block`, `code-editor` and `code-languages`, with `kbd` and `error-summary`. Without `-o`, the CLI asks before it overwrites an app's own edits to them. The text says so, and adds why they go in the same sitting: the theme updated alone paints code half in the old palette. The first line stays `kuiper-theme` alone. The example second line stays `field input`, since the text tells the app to name its own parts.
   - **A new section follows `020`'s.** It has `id: "from-0-11-0"` and `spec: "013"`, and is titled "From 0.11.0: code, the yellow and the sticky bar". It covers `013`, `014`, `016`, `019` and `019a`: the interface changes 0.12.0's work made. It has no renames table. Its steps come after the update, in this order, each from the changelog's own words:
     1. `bun install`, for the highlighter's packages.
     2. **Find and replace your own uses of the twelve removed names, before step 3 deletes them.** That covers their `text-code-*`, `--color-` and `syntax-*` forms, and a `var()` of any of them. The step's command:

        `grep -rn -e code-foreground -e code-escape -e code-builtin -e code-tag -e code-property -e code-decorator -e code-self -e code-invalid -e syntax-amber -e syntax-purple -e syntax-teal -e syntax-cyan src`

        Matches inside the theme's own block in `app.css` are the lines step 3 deletes. Replace `--code-foreground` with `--code-text`. Give each other use one of the roles that are left (the code-map `kuiper-theme` bullet lists them). _Why:_ the review saw an app's own `text-code-builtin` vanish, with no error, once the stale lines went. That is the keyframe trap again.
     3. Delete the stale lines from `app.css`: the twelve variables in `:root` and `.dark`, their `--color-` forms in `@theme inline`, and the derived `--code-…` lines.
     4. Delete the old unlayered `html:has([data-sticky-bar])` rule. With a sticky header of your own, set `scroll-padding-top` on `html`.
     5. Replace the removed and renamed exports. From `code-editor`: `codeHighlight`, `pythonLanguageConfigured` and `pythonRoles`. From `highlighter`: `codeTheme`, now `shikiTheme`, and `tokenClasses`, now `roleClasses`.
     6. `error-summary`: code or tests that found the alert on the root look for `[data-slot="error-summary-content"]`.
     7. `kbd`: `class="bg-muted"` keeps the old ground, and `class="select-none"` keeps a key unselectable.
     8. A strict Content Security Policy adds `'wasm-unsafe-eval'`.
   - **`UNCHANGED.names`** reads: "Every CSS variable, class, utility, prop, slot and export name the sections above do not name."
   - **`UNCHANGED.values`'s `shikiTheme.name` row** keeps its name cell, so `upgrade.spec.ts`'s five constants hold. Its value reads: "`kuiper-code`. In 0.11.0 the export was `codeTheme`; "From 0.11.0", step 5, renames it."
   - **`UNTIL`, the alias window, is unchanged.** Every aliased name shipped in 0.11.0 (§3).
   - _Why a section, not a pointer to the changelog:_ the changelog lists changes. Only the guide can order them against `020`'s steps. With these steps the order is safe:
     - `scrollbar-code` is renamed before any update;
     - the code items update with the theme;
     - each deletion follows its grep;
     - no `add` comes before step 1.

9. **Comments and examples say 0.13.0, or 0.11.0 where they mean an old item.**
   - `field-context.svelte.ts:14`: "The keys before 0.13.0", as its eight sibling controls say. That rebuilds `field.json` in `static/r/` and `static/v0.13.0/r/`. It is a comment only, and 0.13.0's `field` bullet already covers the item.
   - `src/lib/site/changelog.ts`'s doc-comment samples.
   - The field-keys test views and `field-keys.spec.ts`: "a 0.11.0 `Field`".
   - `generated.test.ts:1146`'s title: "today's value".
   - `literals.test.ts:414` and `lint-literals.ts:288`: "for 0.13.0".
   - `changelog-page.test.ts:28` and `:148` (decision 7).
   - `scripts/rename-kuiper.ts` is history and is not touched. It goes in 0.14.0 (`020`).

10. **The context: claims are corrected, and history is kept.**
    - `roadmap.md`:
      - §1's "(0.12.0, after `018`)" becomes "(the 0.12.0 tree, never released, after `018`)".
      - `020`'s "Depends on: the `v0.12.0` tag" becomes "`dad6f76`, 0.12.0's last commit, never tagged".
      - Q2's "`v0.12.0` was tagged on `dad6f76`" becomes "0.12.0's work ended at `dad6f76`, never tagged; the owner ruled on 2026-11-17 that 0.12.0 was never released (`020d`)".
      - A row for `020d` joins the 0.13.0 table, in lane S.
    - `handoff.md:36` reads: "0.12.0 was never released (the owner, 2026-11-17; `020d`). The next tag is `v0.13.0`."
    - The scorecard is an instrument, completed in place.
      - Its "What 'Pluto 0.12' means here" gains "(0.12.0 was never released; the tree's `package.json` read 0.12.0)".
      - Row 11's evidence, "The 0.12.0 entry's 'delete these lines' list", says 0.13.0's at this specification's re-run.
      - The run log is kept as written.
    - Landed specifications, reviews and memos are unchanged (`context/README.md`). That is 361 lines in 57 files (§7).
    - `README.md`, `AGENTS.md` and `context/README.md` need nothing (§7).

11. **A guard keeps it so.** One unit test, `tests/unit/never-released.test.ts`, has two checks. Both are counted per file, in a fixture of their own, `tests/fixtures/0-12-0-allowed.json`. The fixture takes `pluto-allowed.json`'s shape: `files` (a glob), `pattern`, `count`, `reason`. So an allowed line that moves within its file changes nothing; only a new match does.
    - **No 0.12.0.** `git grep` for `0\.12\.0`, `v0\.12\.0` and `v0-12-0` over tracked files. It excludes `context/`, `static/v0.4.0/` to `static/v0.11.0/`, `scripts/rename-kuiper.ts` and `*bun.lock`. The allowed entries:
      - the fold sentence (`CHANGELOG.md`, 1);
      - `WHO[1]` (`src/lib/site/upgrade/0.13.0.ts`, 1);
      - the absence assertions, one entry per test file that holds them;
      - the guard test and its fixture.

      At the base it finds 284 lines (§10).
    - **No open-ended changelog slice.** In `tests/`, the pattern `indexOf\(\s*["'`](\\n)?## ` is allowed only in `tests/helpers/changelog.ts`. At the base it matches 16 times in 3 files (§10). After the build it matches only in the helper. So a branch cut before this lands cannot bring the slice back.

12. **No alias anchor.** The changelog page has no `id="v0-12-0"`. An old link to `/changelog/#v0-12-0` lands at the page's top. An anchor for a version that never existed would say it did.

13. **The owner's git state.** Agents never push or delete tags. The landing notes give the owner two steps, in this order:
    1. Before the `v0.13.0` push, run `git tag -l v0.12.0` on each machine they have tagged from. If the tag is there, `git tag -d v0.12.0` deletes it. It is local, and was never pushed (§1).
    2. Push the new tag by name: `git push origin v0.13.0`. Never `git push --tags`, which would publish any local `v0.12.0` that survived. GitHub would then serve a release that never happened, and T6 would read it.

    The remote branch `release/0.12.0` is Q1.

## Scope

**In:**

- `CHANGELOG.md`.
- The deletion of `static/v0.12.0/`.
- `tokens/kuiper.tokens.json`, `kuiper.light.tokens.json`, `kuiper.dark.tokens.json` and `kuiper.removed.json`, and their regenerated copies.
- `src/lib/registry/ui/field/field-context.svelte.ts` (the comment) and the regenerated `field.json` files.
- `src/lib/site/upgrade/0.13.0.ts`.
- `src/lib/site/changelog.ts` (comments) and the field-keys test views (comments).
- Tests:
  - `tests/helpers/changelog.ts` (new);
  - `tests/unit/registry.test.ts`, `registry-comments.test.ts`, `generated.test.ts`, `component-data.test.ts`, `changelog-page.test.ts`, `toast-site.test.ts` and `literals.test.ts`;
  - `tests/unit/never-released.test.ts` (new) and the fold-heads test;
  - `tests/fixtures/pluto-allowed.json`, `0-12-0-allowed.json` (new) and `020d-fold-heads.json` (new);
  - `tests/e2e/site.spec.ts`, `upgrade.spec.ts` and `field-keys.spec.ts`;
  - `tests/smoke/code-add.test.ts` (labels).
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
- A smoke case that walks the new guide section end to end (the review's optional suggestion under finding 2). See "Review".

## Tests written first

Each is written, or changed, before the fix, and seen failing on the landed base. "Fails today" means at the base this specification is drawn on. Where marked EXECUTED, it was run on a copy (§8, §10, or the review's probes). Elsewhere it is INFERRED from the source, and confirmed by running it at build.

- **T1** (unit, `registry.test.ts`). No `## 0.9.0`, `## 0.10.0` or `## 0.12.0` heading. The versions begin `0.13.0, 0.11.0, 0.8.0`. `first` begins with decision 2's sentence. _Fails today:_ 0.12.0 is the second heading.
- **T2** (unit). The 0.13.0 entry holds no `v0.12.0` and no `/v0.12.0/r`. `second`'s site paragraph names `/v0.13.0/r`. `first`'s intro names "the Kuiper Design System". _Fails today._
- **T3** (unit). `first` has no bullet headed `pluto-theme`. `second` has exactly one bullet headed `kuiper-theme`, and it holds "The code map is Meridian's roles". No part holds "Its code names are unchanged". _Fails today:_ there is no split line, so `foldedParts` throws.
- **T4** (unit). `second`'s update paragraph names `v0.13.0`. Its "rename" comes before "`add kuiper-theme highlighter`". It still names the twelve removed variables (the smoke test's list). _Fails today._
- **T5** (unit, `generated.test.ts`). `static/v0.12.0` does not exist. _Fails today._
- **T6** (unit, "released snapshots"). The clone has tags, or the test fails with one message. Every `static/v<x>/` is a tag's or the current version's. _Fails today on `v0.12.0`_ (EXECUTED, §5).
- **T7** (unit). No `"0.12.0"` in any file under `tokens/` or `static/r/tokens/`. _Fails today:_ 51 and 81 lines (EXECUTED). The lifecycle tests T12 and T13 then hold the true values (EXECUTED, §8).
- **T8** (unit). `releaseEntry` and `foldedParts` throw when a heading or the split line is missing, and `foldedParts` throws when the split line appears twice. _Fails today:_ there is no helper, and the six slices return the file's tail.
- **T9** (unit, `component-data.test.ts`). `kbd`, `error-summary` and `product-home` read 0.13.0, and `meter` reads 0.4.0. _Fails today:_ the three read 0.12.0 (EXECUTED).
- **T10** (unit, the guide's data). Fails today. It checks:
  - `WHO` holds no "0.12.0's notes" and no `#v0-12-0`;
  - `WHO[1]` holds "0.12.0 was never released" and `#v0-13-0`;
  - `SECTIONS`' ids are `020`, `from-0-11-0`, `026`, in that order;
  - `020`'s step 2 text names `code-block`, `error-summary` and "second line";
  - the first line of step 2's command holds no `code-block`;
  - the new section's steps name `bun install`, `code-foreground` in a `grep` command, `--code-text`, `data-sticky-bar`, `shikiTheme`, `error-summary-content` and `wasm-unsafe-eval`;
  - the `grep` step comes before the deletion step;
  - `UNCHANGED.names` holds "do not name";
  - the `shikiTheme.name` row's value names `codeTheme`.
- **T11** (unit, the guard, decision 11). Both checks, per file. _Fails today:_ 284 lines of 0.12.0, and 16 slices outside the helper (EXECUTED, §10).
- **T12** (unit, the rename guard). The fixture's counts are as decision 7 says. _Fails_ once the fold is in and the fixture is not (EXECUTED, the review: 21 and 28).
- **T13** (e2e, `upgrade.spec.ts`). Seven parts, with "From 0.11.0: code, the yellow and the sticky bar" **fourth**, after "Who this is for", "Before you start" and `020`'s. Over the whole page and its twin, no add command comes before `020`'s step 1 (the existing test, kept). _Fails today._
- **T14** (e2e, `site.spec.ts`). `meter`'s facts link `/changelog/#v0-4-0`. The changelog page has `#v0-13-0`, `#v0-11-0` and `#v0-2-0`, and no `#v0-12-0`. _Fails today._
- **T15** (the fold keeps every bullet, decision 7). The build's line diff, and the unit test of `020d-fold-heads.json`: `first`'s heads hold the base's 26 in order, and `second`'s hold its 18. _Fails today:_ there is no split line.
- **T16** (unit). Each of the eight first-part bullets of decision 3, and the doc-comment bullet, ends with its "See also" or "Of these" sentence. _Fails today._

## Acceptance criteria

1. T1 to T12, T15 and T16 pass in `bun run test:unit`. The only other failures allowed are the machine-timing tests that fail at the base (§8).
2. T13 and T14 pass in the Chromium projects. The rest of `upgrade.spec.ts` and `site.spec.ts` passes.
3. `bun run test:smoke`'s upgrade case passes, under its new labels. It proves the stale-line list of step 3. The grep of step 2 is checked by T10's text, and its need by the review's probe.
4. `git diff <landed base>` shows no change to `src/app.css`, `static/r/tokens/kuiper.css`, `static/v0.13.0/r/tokens/kuiper.css`, or any `static/r/styles/maia/*.json` but `field.json`, whose only change is its comment line.
5. `bun run build` leaves no `build/v0.12.0/`, and no built page holds `v0-12-0` or `/v0.12.0/`. Today it holds five links to `#v0-12-0`.
6. `bun run check` reports 0 errors. `bun run lint` passes.
7. `bun scripts/site/release-check.ts --before-ci` exits 0.
8. The roadmap and the handoff read as decision 10 says. A reviewer checks this by reading them.
9. The scorecard is re-run, and its movement is recorded. Expected:
   - `scripts/bench/kuiper.ts`'s raw counts move: releases 12 → 11, and versioned registries 9 → 8;
   - the interface marks are unchanged;
   - no row moves, since row 11's rubric counts neither.
10. The change review, by a reviewer who wrote neither this specification nor the build, finds every live row of §7's and §10's tables handled as its "Change" column says, or answered in writing.
11. The landing notes hold T15's line diff, every count re-taken at the landed base, and the owner's two git steps (decision 13).

## Build order

1. Re-read the landed base. Re-take every count. Write `020d-fold-heads.json` from it.
2. The tests first: T1 to T16, seen failing. Note which.
3. Delete `static/v0.12.0/`. Rewrite the token metadata, then run `bun run build:tokens`.
4. Fold `CHANGELOG.md`, with the pointers. Diff it against the base (T15).
5. Write the helper. Retarget the tests, per decision 7's table. Set the fixtures' counts.
6. The guide.
7. The comments. Then `bun run build:registry`.
8. The context documents.
9. Then the whole check, and the scorecard.

## Risks

- **A landing between the draw and the build.** The batch may land with words other than those read here. The build re-reads the base (Depends on), and T15 catches a lost bullet.
- **Branches cut before this lands.** One may add a 0.13.0 bullet, or a test that slices to `\n## 0.12.0`. Such a slice would run to the file's end and pass, untested. The guard's slice check fails it in any file but the helper, so the rebase must use the helper. A new bullet whose head is in `second` needs its pointer, and T16's list grows with it.
- **The guide grows a third section** in a page that `020b` and `020c` fitted to its column. The new section has no renames table, so it adds no wide block. Its one long `grep` command sits in a code block, as `020`'s step 1 does. `upgrade.spec.ts`'s column tests cover it.
- **The site may have been deployed.** If it was, `/v0.12.0/r` goes from 200 to 404 at the next deploy. That is intended (decision 5).

## Open questions for the owner

**Q1. The public branch `release/0.12.0`.** It is at `dad6f76`, an ancestor of `release/0.13.0`, so deleting it loses no commit. GitHub serves a registry from it: `raw…/release/0.12.0/static/r/…` returns 200 (§1).

- **(a) Delete it when you push `v0.13.0` (recommended).** A public branch named for a release that never happened invites a pinned install from it, and this specification removes every other sign of one.
- **(b) Keep it.** Nothing in the repository links to it.

Only the owner pushes, so only the owner can do (a). Every other choice here is the design lead's, under the owner's delegation of 2026-11-17.

## Review

The spec review, 2026-11-17: [`reviews/020d-0-12-0-was-never-released-spec-2026-11-17.md`](../reviews/020d-0-12-0-was-never-released-spec-2026-11-17.md). Its verdict was "does not land yet". Each finding and its fix:

1. **High: one item, two or three bullets, and no rule for the tests or the reader.** Fixed.
   - Decision 3: two whole parts, split at the "Also since 0.11.0" line. The line says a bullet below adds to any above for the same item. The second part holds all of 0.12.0's entry, its prose too, so its tests keep their counts and positions.
   - Pointers: the eight first-part bullets whose head also heads a second-part bullet, and the doc-comment bullet, end with "See also" or "Of these". `022t`'s "nothing to change" reads "nothing to change for it". The second part's "(see `pluto-theme`)" reads "(see the code-map `kuiper-theme` bullet)".
   - Decision 7's table names each retargeted test and the part it reads. That includes `registry.test.ts:1473`, `:1496` and `:2028`, and 019's "11 names". T3 and T16 hold the split and the pointers.
2. **Medium: the guide deletes the stale lines before it says to replace an app's own uses.** Fixed. Decision 8's new step 2 is the `grep` and the replacement, before step 3's deletion. T10 checks its command and its order.
   - Not taken: the optional smoke case that walks the section end to end. The review's own probe showed the loss, and T10 holds the step's text and order. A smoke case would extend the existing upgrade smoke test on the `kit3` fixture (`tests/smoke/`, in no lane); it is left to a later change because the probe already proved the need and T10 holds the step (the re-check's note corrects the earlier reason). It is noted for `030`'s re-base sweep.
3. **Medium: drawn on `b01e754`, with three builds landing first.** Fixed.
   - The spec is drawn on `71cb067` plus `lane-i-run5`'s changelog. It builds after the batch lands, re-reads that base and re-takes its counts (Depends on, Build order step 1, criterion 11).
   - There are six slices, `022t`'s at `registry.test.ts:2589` among them.
   - T15 holds the fold to its sources: a line diff at build, and a heads fixture after.
   - The guard bans the open-ended slice outside the helper (decision 11).
   - Lane S, by the design lead's ruling, in place of the review's "T, I and the ledger".
   - Criterion 4 diffs from the landed base.
4. **Low: T10 contradicts decision 8.** Fixed. T10 bans "0.12.0's notes", not "0.12.0", and requires "0.12.0 was never released" and `#v0-13-0` in `WHO[1]`.
5. **Low: T13 counts the new section third.** Fixed: fourth of seven.
6. **Low: T4's order fails against decision 4's words.** Fixed. "rename" comes before "`add kuiper-theme highlighter`". Decision 4's paragraph now says "first rename", ahead of that command.
7. **Low: `UNCHANGED.values` and step 2's line.** Fixed.
   - The `shikiTheme.name` row keeps its name cell, and its value names `codeTheme` and the step that renames it.
   - The code items go on step 2's second line, without `-o`. T10 checks that the first line has no `code-block`.
8. **Low: the push is not guarded.** Fixed. Decision 13 puts the local-tag check before the `v0.13.0` push, and asks for `git push origin v0.13.0` by name, never `--tags`.
9. **Low: the inventory misses three lines.** Fixed. `changelog-page.test.ts:28` (an example, `#v0-13-0`), `changelog-page.test.ts:148` (a comment) and `022t`'s slice are in decision 7, decision 9 and the memo's §10.
10. **Low: the scorecard's raw counts move.** Fixed. Criterion 9 names releases 12 → 11 and versioned registries 9 → 8. The interface marks are unchanged, and no row moves.
11. **Low: the snapshot check and the guard need shape.** Fixed.
    - The converse check asserts tags first, with one message.
    - The guard counts per file, in `0-12-0-allowed.json`, in `pluto-allowed.json`'s shape.

## Landing notes

Built by the lane-S builder, 2026-11-17, in `.claude/worktrees/lane-s-020d` (branch `lane-s-020d`), uncommitted. To be completed at landing: the change review, Q1's answer, and the owner's two git steps.

### The landed base, and every count re-taken there

The base is `7ec5488` ("Context: the run-5 batch landed"): `release/0.13.0` with `022t`, `022v`, `022w`, `022x`, `022y` and `022z` landed. No lane-T build was running (`git worktree list`: only `lane-e-small` beside this one). Every figure below was EXECUTED at `7ec5488`.

| Count | The specification (§10) | At `7ec5488` |
|---|---|---|
| `## 0.13.0`, `## 0.12.0`, the naming paragraph, 0.12.0's theme bullet | lines 5, 36, 40, 44 | the same |
| Bullets in the 0.13.0 and the 0.12.0 entries | 26 and 18 | the same |
| First-part bullets whose single head also heads a second-part bullet | 8 bullets, 7 heads (`kuiper-theme` twice, `highlighter`, `app-shell`, `use-highlighted-code`, `code-editor`, `code-block`, `error-summary`) | the same |
| The doc-comment bullet's names, and those that head a second-part bullet | 61, of which 14 | the same |
| `[Pp]luto` in the 0.13.0 entry, the 0.12.0 entry, and from `## 0.11.0` | 21, 10, 28 | the same |
| The guard's grep (decision 11's exclusions) | 284 lines | 284; `static/v0.12.0/` holds none of them |
| The open-ended slice in `tests/` | 16 in 3 files, 6 ending at `\n## 0.12.0` | the same: `registry.test.ts` 11, `registry-comments.test.ts` 3, `toast-site.test.ts` 1; the six at `registry.test.ts:2238`, `:2394`, `:2490`, `:2514`, `:2589` and `toast-site.test.ts:125` |
| The retargeted tests' lines (decision 7's table, decision 9) | as listed | the same lines |
| `"since": "0.12.0"` and `"removed": "0.12.0"` in `tokens/` | 27 and 24 | the same; 81 lines in each of `static/r/tokens/` and `static/v0.13.0/r/tokens/` |
| Files in `static/v0.12.0/` | 76 | 76 |
| The bench's releases and versioned registries | 12 and 9 | the same |
| Links to `#v0-12-0` in the built site (criterion 5) | 5, at `b01e754` | **4**: `/changelog/#v0-12-0` on the `kbd`, `product-home` and upgrade pages, and `#v0-12-0` on the changelog, beside its `id`. The cause: `022t`'s `error-summary` bullet already made that page read 0.13.0. No decision changes |
| The unit suite | 1,905 pass, 2 skip, 2 fail (§8, at `b01e754`) | 1,937 pass, 2 skip, 0 fail |

The builder's choice on the re-check's write-in: `registry.test.ts`'s regex `entry()` stays for 0.11.0 and older, as decision 7 now says.

Two counts moved that decision 7 does not name:

- `pluto-allowed.json`'s `tests/unit/registry.test.ts` `pluto-theme` history entry, **25 → 13**. The 0.12.0 entry's tests now read the folded part, which names `kuiper-theme`; test 3 adds one absence check of the old head. Its reason says so.
- `016`'s "no amber" test (`registry.test.ts`, "016: the brand yellow") gains one exception: in `src/lib/site/upgrade/0.13.0.ts` it drops the name `syntax-amber` in any of its forms, as it already does in `kuiper.removed.json`. Decision 8's step names the removed `--syntax-amber`, and its `grep` names `syntax-amber`, so the test could not pass with the step as written.

`tests/fixtures/static-r-amendments.json` is deleted (the change review, finding 3). It was read only by the deleted 0.12.0-only release check; decision 7's "its fixture stays" means `reworded-comments.json`, which the kept tests read.

### Tests seen failing first

The tests were written, then run on the base tree: the changelog, `static/v0.12.0/`, the tokens and the guide as at `7ec5488`. The builder had folded the changelog before writing the tests; that file was set aside and the base's restored, byte for byte (`cmp`), before this run.

- **Unit**, the nine changed and new files: **26 fail, 8 errors, 503 pass**, 529 tests (corrected to the change review's re-run; the builder's first record said 28 and 501).
  - T1, T2, T3, T4 and T16 (`registry.test.ts`): fail.
  - The retargeted `013`, `014`, `016`, `019a` and `019` tests (5 tests), and `018`'s rewritten test: fail, since `foldedParts` throws: the entry has no "Also since 0.11.0" line.
  - The six first-part readers (`020` test 16, `027a` test 2, `027b` test 2, `021` criterion 18, `022t`, and `toast-site`'s `026`), and `registry-comments.test.ts`'s folded-part describe: 7 of the 8 errors. Each now throws where its slice ran to the file's end and passed.
  - T15: the eighth error, the same throw.
  - T5 (`static/v0.12.0` exists), T6 (`v0.12.0` has no tag), T7 (3 of 3 folders), T9 (`kbd`, `error-summary`, `product-home`), T10 (5 of 5), T11's first check ("no 0.12.0", on the base's content), T12 (the rename guard, with the fixture at 28 and 21 and the comments entry gone), and `changelog-page.test.ts`'s releases: fail.
  - T11's second check, "no open-ended changelog slice", passes in that setup, since the new tests hold no slice. It fails only with the base's test files beside the new guard and helper: `registry.test.ts` 11 lines, `registry-comments.test.ts` 3, `toast-site.test.ts` 1 (the change review's setup B).
  - T8 passed in that run, since the helper was already written. With the helper moved aside, `never-released.test.ts` fails to load: "Cannot find module '../helpers/changelog.ts'".
- **e2e**, against `bun run build` of the base tree, `chromium-light`: T13 ("in seven parts") and T14 (`#v0-12-0` present) fail, 2 of 2.

### The build

- **`static/v0.12.0/`**: deleted, 76 files, no redirect. `build/v0.12.0/` is gone.
- **The tokens.** 51 values in `tokens/` read `"0.13.0"`. `bun run build:tokens` rewrote the twelve copies. The diff is exactly 213 lines, each a `since` or a `removed` value: 51 in `tokens/`, 81 in each published tree.
- **The CSS is byte-identical.** sha256 before and after `build:tokens`, `build:registry` and `bun run build`:
  - `src/app.css`: `e72d42224b27b29d3b349f78c701647faa0bf3704887fa95fa1b0d97bc487e76`;
  - `static/r/tokens/kuiper.css` and `static/v0.13.0/r/tokens/kuiper.css`: `3111eac47c612e4f3e9bff1dca478465d01871fe96d28f85b8ba18c129ee3bee`.
  - Every `static/r/styles/maia/*.json` and `static/v0.13.0/r/styles/maia/*.json` keeps its sha256, but the two `field.json` files. Their only change is one content line, the comment: "The 0.12.0 keys." → "The keys before 0.13.0." (criterion 4).
- **The built site** (criterion 5), against the base's build, with asset hashes normalised: four pages change, and their Markdown twins and data. They are the changelog, the upgrade guide, `kbd` and `product-home` (Updated 0.12.0 → 0.13.0). No other page, and no other file under `r/`, `v0.13.0/r/` or `v0.4.0/` to `v0.11.0/`, changes. No built file holds `v0-12-0` or `/v0.12.0/`. `meter` links `#v0-4-0`; `error-summary` already linked `#v0-13-0`.

### T15: the fold's line diff

The fold was checked in reverse. Each edit decisions 2 to 4 name was undone on the folded parts. The result equals the base's entries byte for byte (EXECUTED):

- **The first part** equals the base's 0.13.0 entry once its 14 edits are undone:
  - the fold sentence, its own paragraph;
  - the intro's first sentence;
  - the rename bullet's "keep their names, except the twelve code colours the code-map `kuiper-theme` bullet removes" (the change review, finding 2);
  - "Rolled back to 0.11.0";
  - the two `kuiper-theme` pointers;
  - the six "See also" pointers;
  - "nothing to change for it";
  - the doc-comment bullet's "Of these".
- **The second part** equals the base's 0.12.0 entry once its 7 edits are undone, with the heading and the naming paragraph put back:
  - `/v0.13.0/r`;
  - the theme bullet's head;
  - "so `kuiper-theme` gives";
  - the two "(see the code-map `kuiper-theme` bullet)";
  - the update paragraph's first sentence;
  - "Update `kuiper-theme`, `code-block` and `code-editor` together".
- The rest of `CHANGELOG.md` is unchanged.

Line by line (`difflib` over each part):

- **The first part.** The base entry has 28 lines that are not blank. 17 are kept as they were. Nine bullets are kept with one sentence appended, and the rename bullet's "keep their names" is qualified; the `error-summary` bullet also reads "for it". The `theme` bullet reads "Rolled back to 0.11.0". The intro's first sentence is replaced, and the fold sentence's paragraph comes before it.
- **The second part.** The base entry has 23 lines that are not blank. 16 are kept as they were. The heading and the naming paragraph go. Five lines change by decision 4's words: the site paragraph, the theme bullet, `error-summary`, `app-shell` and the update paragraph.
- The split line stands alone, between blank lines. The builder's first fold had no blank line before it, which would have made it part of the `sign-in` bullet; that was fixed before any test ran green.

`tests/fixtures/020d-fold-heads.json` was written from `7ec5488` by the helper's `headOf`, with `kuiper-theme` for `pluto-theme`: 26 and 18 heads. Its `base` field names the commit, for the change review's `git show`.

### The gate

- `bun run check`: 0 errors, 0 warnings, 2,436 files.
- `bun run lint`: passes.
- `bun scripts/lint-literals.ts`: 0 literals, 1 allowance, as before.
- `bun test ./tests/unit`, at the first build: **1,959 pass, 1 fail, 0 skip**, 1,960 tests in 69 files.
  - The fail is the highlighter's streaming budget (`highlight-session.test.ts`), a machine timing. Run alone, it passes.
  - The base's 2 skips were the deleted 0.12.0-only release check.
- `bun scripts/site/release-check.ts --before-ci`: exit 0, with its four named skips.
- e2e, `E2E_PREBUILT=1` on the new build, `chromium-light` and `webkit-light`: `upgrade.spec.ts`, `site.spec.ts`, `tokens.spec.ts`, `tokens-files.spec.ts`, and `build-output.spec.ts` (`chromium-light` only, by the config), which reads the Markdown twins. **234 of 234 pass.**
- The smoke test's upgrade case, `tests/smoke/code-add.test.ts`, run with app A, which writes its reference stylesheet (`-t "app A|the upgrade from v0.11.0"`): **15 of 15 pass**. That is app A's 13 and the upgrade case's 2, under their new labels: "the v0.13.0 add exits 0", and the stylesheet holds exactly the changelog's listed old lines (criterion 3). `tests/smoke/upgrade.test.ts` (`020` test 11) was not run; this specification does not touch it.
- Ledgers:
  - `bun run cost --sizes-only`: 6 items size-stale, by hash only: `field`, and `composer`, `sign-in`, `sign-up`, `settings` and `chat`, which hold it. No item's size moves. The catalogue, rebuilt with them, reads js 379,377 → 379,356 and css 16,842 → 16,838.
  - The catalogue's move has no cause found: both inputs that changed are comments, and the change review's re-run reproduces the same figures.
  - `bun scripts/site/thumbnails.ts --hash-only`: 69 of the manifest's 82 hashes move against `7ec5488`, from two comment-only inputs, `src/lib/site/changelog.ts` (65 items) and `field-context.svelte.ts` (6 items). No picture changes, so `--hash-only` wrote the manifest and the pictures stand. (The builder's first record said the manifest was unchanged; a filter hid it.)

### The scorecard's movement

`scripts/bench/kuiper.ts` on the working tree, against `--rev 7ec5488`: **releases 12 → 11** and **versioned registries 9 → 8**, as criterion 9 expects. Interface marks stay 15, migration pages 2, and nothing else moves. No row moves. The run log has the row, and row 11's evidence reads the 0.13.0 entry.

### Where the tests live

- T1 to T4, T6 and T16 are in `registry.test.ts`, beside the tests they join.
- T7, T8, T10 and T15 are in `never-released.test.ts`, after the guard's two checks. That makes one file for what is `020d`'s alone.
- T7 also reads `static/v0.13.0/r/tokens/`.
- The guard reads tracked and untracked files, as the rename guard does, so a new file is caught before it is committed.
- Its fixture has one entry per file. The slice check's helper entry counts 2: the slice, and the doc comment that names the form it replaces.

### The change review

[`reviews/020d-0-12-0-was-never-released-pr-2026-11-17.md`](../reviews/020d-0-12-0-was-never-released-pr-2026-11-17.md): lands once its six Low findings are dispositioned. The design lead's rulings (2026-11-17), and what the builder did:

1. **Step 2's example second line goes back to `addCommand("field input")`, as decision 8 says.** The builder's reading would install the highlighter, about 350 MB of packages, and the code editor into apps that never had them. The code items, `kbd` and `error-summary` get a sentence of their own in step 2's text: name them on the same line if your app has them, and only then, since an `add` installs an item an app lacks. T10 now requires line 2 to end `add field input -y`, with no `-o`. Seen failing first: "Expected to end with: " add field input -y"".
2. **The first `kuiper-theme` bullet** now reads "every variable and utility, keep their names, except the twelve code colours the code-map `kuiper-theme` bullet removes". T3 holds the sentence; seen failing first. T15's reverse check counts it among the first part's edits (14).
3. **`tests/fixtures/static-r-amendments.json` is deleted.** Nothing in `tests/`, `scripts/` or `src/` reads it.
4. **The seen-failing record is corrected**, above: 26 fail, 8 errors, 503 pass, and T11's slice check fails only with the base's test files.
5. **The thumbnail note is corrected**, above.
6. **Roadmap Q2** ends "`release/0.13.0` starts from `dad6f76`".
7. **Note 8 taken:** `020`'s step 1 grep adds `-e scrollbar-code`, and its text says the command finds the class too. T10 checks the command; seen failing first: "Expected to contain: "-e scrollbar-code"". No other test pins the grep's text.

Re-run after the fixes: `bun run build`; `cost --sizes-only` ("every figure is fresh"); `thumbnails --hash-only` (the manifest unchanged since the first build); `check` (0 errors), `lint`, `lint-literals` (0 literals); `bun test ./tests/unit` (**1,960 pass, 0 fail**); `release-check --before-ci` (exit 0); and the e2e specs above in `chromium-light` and `webkit-light` (**234 of 234 pass**).

### Left as they are

- The guide's lead paragraph ("0.13.0 renames the system's code names to Kuiper …") and the page's comment "the five parts" were not touched; decision 8 names neither.

### The owner's steps, before the `v0.13.0` push (decision 13)

1. On each machine you have tagged from, run `git tag -l v0.12.0`. If it prints `v0.12.0`, delete it with `git tag -d v0.12.0`: it is local and was never pushed. This session's clone has no `v0.12.0` tag (`git tag -l`: `v0.1.0` to `v0.11.0`).
2. Push the new tag by name: `git push origin v0.13.0`. Never `git push --tags`, which would publish a `v0.12.0` that survived.

Q1, the public branch `release/0.12.0`, is still open. The recommended answer is (a): delete it when you push `v0.13.0`.

_Still to come at landing:_

- _Q1's answer;_
- _whether a local `v0.12.0` tag was found and deleted, and that `v0.13.0` was pushed by name._
