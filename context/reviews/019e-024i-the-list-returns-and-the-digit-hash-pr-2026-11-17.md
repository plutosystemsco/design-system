# Review of 019e and 024i — the list returns, and the digit hash re-applied (the built changes)

Reviews two commits on `integrate-run8`, each a small change with its own specification:

- `258e5c7`, [`019e`](../specifications/019e-the-error-summarys-list-returns.md): the error summary's list returns, and `019b` is reverted;
- `a8f56e8`, [`024i`](../specifications/024i-an-all-digit-commit-hash-is-still-a-commit.md): an all-digit commit hash is still a commit, re-applied alone from `c51b65b`, which also carried `019d`.

This reviewer wrote neither specification and none of the code (constitution §5). `2f6b7b3` (`017a`) and `9f31084` (`022ad`), below them, were already reviewed and are not reviewed again.

- **Date:** 2026-11-17
- **Status:** dispositioned; both land
- **Reviewer:** a reviewer; not the author of either specification or either build.
- **Reviewed:** the worktree `.claude/worktrees/integrate`, branch `integrate-run8`, at `a8f56e8`. Read with `AGENTS.md`, the constitution, [the eighth matrix run](../research/2026-11-17-the-eighth-matrix-run.md) (untracked in the main checkout; see finding 1) §2, §10 and §11, `019b`'s specification and its new "Reverted" note, and [the review of `019d` and `024i`](019d-024i-the-long-message-and-the-digit-hash-pr-2026-11-17.md).
- **The ruling under review:** the design lead's, the memo's §11 option (a). `019b` is reverted to the list. Run 8 showed that without the list, NVDA in both browsers never speaks the title and reads each message three times. Under VoiceOver with Chrome each message is still doubled.
- **Re-ran:** Bun, Linux, 4 cores. Playwright with Chromium and WebKit from `/opt/pw-browsers`; Firefox is not installed. E2E runs used `E2E_PREBUILT=1` on port 4729, a free port. A page probe ran on `vite preview` on port 4731, from a scratch script outside the repository.
  - **Before the first probe,** `git status --porcelain` was empty: SHA-256 `e3b0c442…`.
  - **Probes, each restored with `git checkout --`:** the item set to `9f31084`'s (the box markup) and rebuilt; `vite.config.ts` and the app-shell page set to `db8fb65`'s; `scripts/cost/report.json` and the thumbnails manifest set to `9f31084`'s and regenerated, three times for the cost report.
  - **After the last probe,** `git status --porcelain` is empty again, `e3b0c442…`, apart from this file. `build/` and `.svelte-kit/` hold a normal build of `a8f56e8` (`version.json` `"a8f56e8"`). Playwright's ignored `test-results/` was rewritten. A `vite preview` on port 4173 was running from this worktree before the review and was left alone.
  - **Not run:** Firefox; any screen reader; the full e2e suite; the scorecard (after landing).

## Seen failing

| Check | Before | After |
| --- | --- | --- |
| `019` criterion 1's tree snapshot, `chromium-light` and `webkit-light` | the box markup (`9f31084`'s item, rebuilt): fails, 2 of 2. Received `- link "Enter a project name"` straight under `alert`; no `list`, no `listitem` | the list (`a8f56e8`, rebuilt): passes, 2 of 2 |
| `commit-name.test.ts`, on `db8fb65`'s `vite.config.ts` and app-shell page | 8 of 13 fail, the same four per copy | 13 of 13 |
| `blocks.spec.ts` A3, built with `WORKERS_CI_COMMIT_SHA=648273658dc0…` | not re-run on the old lines: the earlier review ran it (2 of 2 fail) | passes, 2 of 2: `version.json` `"648273658d"` |

EXECUTED, all of it. It matches both landing notes.

## The questions, answered

### 019e

1. **Is the revert complete and exact?** Yes. EXECUTED: `git diff 6482736 HEAD --` the item, its page, `tests/e2e/error-summary.spec.ts`, `tests/e2e/engine-only.ts`, `tests/unit/registry.test.ts`, and both `static/` copies of `error-summary.json`: empty. `258e5c7` touches the same twelve files as `331dd9d`, less `019b`'s change review (kept as the record), plus `019e`'s specification. No `error-summary-links` and no "not in a list" is left outside `context/` (EXECUTED, a grep of `src`, `tests`, `scripts`, `static` and `CHANGELOG.md`).
2. **`022t`'s `{#key attempt}` stays.** READ: the item's lines 151 to 184 wrap the content node, heading and list in it. EXECUTED: `022t` tests 1, 2, 3 and 6 pass in both engines. `git apply --check` passes for patches 4 and 7b, and `mutations.test.ts` passes, 29.
3. **The changelog.** `019b`'s bullet is gone. EXECUTED: `git diff 6482736 HEAD -- CHANGELOG.md` is one line, `024i`'s sentence in `app-shell`'s bullet, before its pointer. `020d`'s fold, split and pointers are untouched. `never-released.test.ts` (its guard and T16), `changelog-page.test.ts`, `registry.test.ts` and `engine-only.test.ts`: 161 pass, 0 fail. `onlyIn` is back to 2 calls (READ).
4. **The ledgers are regenerated, not hand-reverted.** EXECUTED:
   - A fresh `bun run build` leaves the tree clean, so both `error-summary.json` copies are this source's, and byte-identical to `6482736`'s (question 1). The box build's copy equals `9f31084`'s byte for byte, so the build is deterministic both ways.
   - `thumbnails.ts --hash-only` on `9f31084`'s manifest rewrites it byte-identical to `HEAD`'s, which equals `6482736`'s.
   - `bun run cost --sizes-only` on `9f31084`'s report: 4 items size-stale and the catalogue rebuilt, as the note says. Every item's figure equals `HEAD`'s exactly (`error-summary` JS 11,872, CSS 891, brotli JS 10,672). The catalogue does not: see finding 4.
5. **The check fails on the box markup and passes now.** Yes, in both engines (the table above). The CDP probe was not re-run: the snapshot is the kept check, and it pins the same tree.
6. **`019b`'s record.** The Status line reads "reverted 2026-11-17 by `019e`", and the "Reverted, 2026-11-17" note is honest: it cites run 8 per pair, says decisions 6 and 7 and open question 3 (a)'s reason are refuted, records the ruling, and names `019e`. Four sentences above it still read as current. See finding 2.

### 024i

1. **Exactly `c51b65b`'s `024i` parts.** Yes, with one gap. EXECUTED, `git diff c51b65b a8f56e8`:
   - `vite.config.ts` and `tests/unit/commit-name.test.ts`: empty.
   - The app-shell page: one line split, `<code>version</code>` on its own line.
   - `CHANGELOG.md`: one hunk, `019b`'s bullet removed (`019e`'s). The `app-shell` line, with `024i`'s sentence, is identical. `019d`'s sentence lived inside `019b`'s bullet and went with it.
   - The specification and the shared review: only the new "Re-applied alone" and "Afterwards" notes, and the Status line.
   - Nothing of `019d`'s: no `wrap-anywhere`, no `019d` test, specification, patch or page line (EXECUTED, the item and both patches equal `6482736`'s).
   - The gap: `c51b65b`'s roadmap edit for `024i`'s row (its spec link and "built") is left out. The note says the roadmap is the design lead's. See finding 5.
2. **`commit-name.test.ts`:** 13 pass. EXECUTED.
3. **A3 with an all-digit `WORKERS_CI_COMMIT_SHA`:** passes, 2 of 2, `version.json` `"648273658d"`. The build left `static/` unchanged. EXECUTED.
4. **The space before `version`.** Present. EXECUTED: the prerendered HTML, the client node and the Markdown twin read "The layout reads <code>version</code>" (or "reads `version`"). In the hydrated page, the paragraph's text is "The layout reads version from $app/env" in Chromium and in WebKit. `bun run lint` is clean, so Prettier keeps the line break.
5. **The shared review's dead link to `019d`'s specification.** Ruled in finding 3: remove the link now.

### The gate

EXECUTED, on `a8f56e8` after one `bun run build`:

- `bun run check`: 0 errors, 0 warnings, 2,437 files.
- `bun run lint`: clean.
- `bun scripts/lint-literals.ts`: 0 literals, 1 allowance.
- `bun test ./tests/unit`: 2,000 pass, 0 fail, 70 files.
- `bun scripts/site/release-check.ts --before-ci`: exit 0, its four CI-only checks skipped.
- `mutations.test.ts`: 29 pass.
- `error-summary.spec.ts` and `blocks.spec.ts`, `chromium-light` and `webkit-light`: 162 pass, app-shell A3 among them.
- The dry runs (`SR_DRY=1`), `chromium` and `webkit`: error-summary, app-shell, sign-in, sign-up and settings, 40 pass.

## Findings

Most severe first.

1. **Medium (both). The memo that holds the ruling's evidence is not in the tree.**
   - **Evidence:** EXECUTED, a check of every relative link in the four records these commits touch. `../research/2026-11-17-the-eighth-matrix-run.md` is dead in `019e`'s specification ("Found by" and the ruling), `019b`'s "Reverted" note, `024i`'s "Re-applied alone" note and the shared review's "Afterwards" note. The memo is untracked in the main checkout and absent from `integrate-run8`. `019e`'s defect is "READ, *run 8's memo* §2". Without the memo, the revert's evidence is not in the repository (`AGENTS.md`: "All project knowledge lives in this repository").
   - **Fix:** land the memo in the same batch, before or with `258e5c7`.
2. **Low (`019e`). Four sentences in `019b`'s record still read as current.**
   - **Evidence:** READ, `019b`'s specification:
     - line 214, "Not committed. It waits for its change review." It was committed as `331dd9d` and reviewed;
     - line 306, "Criterion 4's fallback to the old `ul` stays until the next change to this item, which drops it." The test that held the fallback is gone;
     - line 308, "Waiting on others", with five open bullets. The "Reverted" note closes the list, but names only criterion 11 and decisions 6 and 7. Decision 9's dispatches and criteria 12, 13 and 14 are left to inference;
     - line 184, "NVDA with Firefox is fixed either way, so a VoiceOver double opens research, not a revert." Run 8 refutes it. The note refutes open question 3 (a)'s reason, which is the same claim, but this sentence is not pointed at.
   - **Fix:** leave the record as written, and add one pointer at each place, such as "(Superseded: see 'Reverted, 2026-11-17'.)". In the note, name decision 9 and criteria 12 to 14 as moot.
3. **Low (`024i`). The shared review links to `019d`'s specification, which is not in the tree. Ruled: remove the link now.**
   - **Evidence:** EXECUTED: `../specifications/019d-a-long-error-message-wraps-at-320-px.md`, line 5 of `reviews/019d-024i-…-pr-2026-11-17.md`, is dead. `024i`'s line 42 also sends the reader to "`019d`'s landing notes, 'The gate'", which is not in the tree either; line 74 says the gate is now the re-applied one.
   - **Why remove, not wait:** a dead link would land on `release/0.13.0`. And when `019d` is rebuilt, the link would lead to a specification this review never read. The "Afterwards" note already says this review's `019d` verdict does not stand for the rebuild. The specification as reviewed lives in `c51b65b`.
   - **Fix:** in the review, write `019d` without a link: "`019d` (a long error message wraps at 320 px; held back, its specification as reviewed is in `c51b65b`)". In `024i`'s line 42, name `c51b65b` beside "`019d`'s landing notes". The rebuilt `019d` links back to this review, not the other way.
4. **Low (`019e`). The landing note explains the catalogue's movement by `017a` and `022ad`, but neither touched an item. The catalogue's figure is noise.**
   - **Evidence:**
     - The note: "The catalogue reads JS 379,373 B and CSS 16,839 B, against 379,356 and 16,838 at `6482736`: `017a` and `022ad` landed since."
     - EXECUTED: `git diff 6482736 9f31084 -- src/lib/registry` touches only the error summary, which this change returns byte for byte. `017a` changed a site file, `022ad` the speech harness.
     - EXECUTED: three `cost --sizes-only` runs from `9f31084`'s report, on the same source, gave the catalogue JS 379,351, 379,358 and 379,364, and CSS 16,839, 16,838 and 16,844. Every item's figure repeated exactly. [The `022v`/`022w` review](022vw-the-copy-button-and-the-search-count-pr-2026-11-17.md), finding 6, found the same spread.
     - So the committed report is a true regeneration. Only the sentence's reason is wrong.
   - **Fix:** reword it: the catalogue moved within its run-to-run noise (the `022vw` review, finding 6). Every item's figure is its `6482736` figure.
5. **Low (both). The roadmap still says `019b` landed, and has no `019e` row.**
   - **Evidence:** READ, `context/roadmap.md`:
     - line 102, `019b`: "**Landed** 2026-11-17, after run 7 …";
     - no row for `019e`;
     - line 113, `019d`: still "`wrap-anywhere` on the links fixes it", built on `019b`;
     - line 114, `024i`: without the spec link and "built" that `c51b65b` gave it.
     - `024i`'s note leaves "the roadmap's two rows" to the design lead. `019e` says nothing of the roadmap.
   - **Fix:** the design lead's context commit, in the same batch. Mark `019b` reverted by `019e`. Add `019e`'s row in lane I. Re-base `019d` on the list and mark it held back. Give `024i` its link and status.
6. **Note (`024i`). "`c51b65b` landed both" overstates it.**
   - **Evidence:** EXECUTED: `git branch -a --contains c51b65b` names only a remote session branch, not `release/0.13.0`. `024i`'s Landing notes also keep "Not committed." (line 42), from the first build.
   - **Fix:** "`c51b65b` committed both" in the review's "Afterwards" note and `024i`'s "Why". For line 42, the same pointer as in finding 2.

## Constitution checks

- **§4.1, source, not a package:** met. READ.
- **§4.3, tokens are the one source:** met. `019e` returns the item to its earlier classes. EXECUTED: `lint-literals`.
- **§4.4, accessible and proven:** `019e` goes back to the state run 7 heard: N-chr passing, the title spoken under NVDA in both browsers. N-ff's list double and VO chr's double are findings to fix, not limits. `019e`'s "What stays open" and the memo's §10 send them to research. Firefox and the readers were not run here. The first `matrix` push run carrying this change judges them, as `019e`'s "Waiting on others" says.
- **§5:**
  - Both are small changes. `019e` touches one item and its page. It reverts an interface change that no release carries: 0.13.0 is unreleased, so against 0.11.0, `019b` and `019e` together change nothing. `024i` was ruled a small change in its first review (finding 3 there).
  - Each check was seen failing first (EXECUTED, above).
  - The ruling is in `019e`'s header and in `019b`'s landing notes.
  - The reviewer wrote neither change.
  - The scorecard is re-run after landing, so this review cites no movement.
- **§6:**
  - Nothing was committed or pushed by this review.
  - No prior art was copied. READ.
  - No installed app breaks silently. No release has the box markup, and `024i`'s changelog sentence says what an app must copy.

## Verdict

- **`019e` (`258e5c7`): lands, once finding 1 is met and findings 2 and 4 are written in.** The revert is exact: every reverted file, and the error summary's two `static/` copies, equal `6482736`'s byte for byte. `022t`'s keyed block stays, and `020d`'s guards hold. The ledgers regenerate to the committed bytes, apart from the catalogue's known noise. The kept snapshot fails on the box markup and passes on the list, in both engines.
- **`024i` (`a8f56e8`): lands, once finding 3 is written in.** It is `c51b65b`'s `024i` byte for byte, apart from the page's line break, and has nothing of `019d`'s. The test fails on the old lines and passes. A3 passes on an all-digit hash. The rendered page has the space.

Finding 5 is the design lead's context commit, in the same batch. Finding 6 is two words and a pointer.

## Disposition

By the design lead, 2026-11-17, in the batch's context commit. Finding 1: the run-8 memo lands in the same push. Finding 2: `019b`'s four sentences carry "Superseded" pointers, and its "Waiting on others" is marked moot. Finding 3, ruled: the dead link is removed now; `019d` is named with its spec in `c51b65b`, and `024i`'s pointer names `c51b65b` too. Finding 4: `019e`'s catalogue sentence calls it noise. Finding 5: the roadmap rows are updated. Note 6: "committed", not "landed". **Closing verdicts: both land.**

