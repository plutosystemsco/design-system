# Review of 019d and 024i — the long message and the digit hash (the built changes)

Reviews two small changes, each with its own specification:

- `019d`, a long error message wraps at 320 px (its spec as reviewed is in commit `c51b65b`; held back, to be rebuilt on the list markup);
- [`024i`](../specifications/024i-an-all-digit-commit-hash-is-still-a-commit.md), an all-digit commit hash is still a commit.

Both came from [`019b`'s change review](019b-the-error-summarys-messages-are-read-once-pr-2026-11-17.md), findings 2 and 1. This reviewer wrote neither specification and none of the code (constitution §5).

- **Date:** 2026-11-17
- **Status:** dispositioned; both land
- **Reviewer:** a reviewer; not the author of either specification or the build.
- **Reviewed:** the uncommitted diff in the worktree `lane-i-run8`, branch `lane-i-run8`, at `db8fb65` (`release/0.13.0`). Twelve changed files and three untracked: the two specifications and `tests/unit/commit-name.test.ts`.
- **Re-ran:** Bun, Linux, 4 cores, load average 2 to 3. Playwright with Chromium and WebKit from `/opt/pw-browsers`; Firefox is not installed. E2E runs used `E2E_PREBUILT=1` on port 4637. Probes ran on `vite preview` on port 4638, from scratch scripts outside the repository.
  - **Before the first probe,** the SHA-256 of `git diff` was `9cdd2f45…` and of `git status --porcelain` `81173ff5…`. The fifteen changed and untracked files went into a scratch archive.
  - **A fresh `bun run build`** left both hashes unchanged, so `static/r/` and `static/v0.13.0/r/` are this source's. `version.json` read `"db8fb65"`.
  - **The bases:** the item, then `vite.config.ts` and the app-shell page, set back to `HEAD`'s, rebuilt or re-run, and restored from the archive.
  - **Patches 4 and 7b:** each applied with `git apply`, built, probed, and reversed with `git apply -R`. After each, the item's blob is `3bba191` again.
  - **`bun run cost --sizes-only`** and **`bun scripts/site/thumbnails.ts --hash-only`:** each rewrote its file byte-identical to the builder's.
  - **After the last run,** both hashes are again `9cdd2f45…` and `81173ff5…`, and every archived file compares equal, the untracked ones included. `build/` and `.svelte-kit/` hold a normal build of the change. Playwright's ignored `test-results/` was rewritten by the runs.
  - **Not run:** Firefox; any screen reader; the full e2e suite; the scorecard (after landing).

## Seen failing

| Check | Base | Built |
| --- | --- | --- |
| `019d` 1, at 320 (`error-summary.spec.ts`) | fails, 2 of 2: page 654 px (Chromium), 653 (WebKit); summary right edge 654 and 652.69; link ends 525 and 527.53, title 637 and 635.67 | passes, 2 of 2: page 320; summary 24 to 296; link ends 277 and 277.98, title 274 and 273.61 |
| `commit-name.test.ts`, on the old lines of both copies | 8 of 13 fail, the same four per copy; the 5 that pass are the cases to keep | 13 of 13 |
| `blocks.spec.ts` A3, built with `WORKERS_CI_COMMIT_SHA=648273658dc0…` | fails, 2 of 2: `version.json` `"6482736"`; "`dd code` Expected: 1, Received: 0" | passes, 2 of 2: `version.json` `"648273658d"` |

EXECUTED, all of it. This is what the landing notes record. One detail: on the old lines, "the host's variable wins over git" fails on the name's length, not on precedence. Precedence is still guarded: "db8fb65 keeps 7" sets the variable to the lettered hash and git to the digit one, so a swap would fail it.

## The questions, answered

### 019d

1. **Does the class change the look of normal content?** No, where the summary takes its width from its container. EXECUTED: 108 screenshot pairs, base against change, byte-identical. Chromium and WebKit; light and dark; 1440 × 900, 390 × 844 and 320 × 700. At each: the keyboard example after an empty submit, the summary alone, each of its three links focused, the component page's first three specimens, and `/view/sign-in/errors/`. `019b` criterion 4 passes in both engines.
2. **Does it break a word that would have fit?** No. EXECUTED: a sweep at 320 and 390, in both engines. The first link read "Enter a project name " and a word of 4 to 48 letters; the title read "There is a " and the same word. Each was measured with the class and with `overflow-wrap: normal` forced on the content, the base's layout. Every word that fits the summary under `normal` (4 to 24 letters at 320, 4 to 32 at 390) gives the same line boxes, to 0.01 px, and the same link width. Every longer word wraps, and the page stays 320 or 390 wide. One context does differ: finding 1.
3. **The message paragraph** wraps too. EXECUTED: a 64-letter word in the component page's message specimen at 320: the page 320 wide, the text ending at 262 (Chromium) and 259.66 (WebKit), inside the box's 279. The test does not cover it (finding 5).
4. **axe:** the axe spec's error-summary and app-shell tests, `chromium-light` and `webkit-light`: **56 passed.** EXECUTED.
5. **`022t`'s keyed swap:** still swaps. EXECUTED: `022t` 1, 2, 3 and 6 pass in both engines. A probe after a second submit: a new content node, the old one disconnected, `role="alert"`, `overflow-wrap: anywhere`, in both engines.
6. **Patches 4 and 7b:** each applies to the changed item. Each carries the same edits as before, only the index, the line numbers and the context line changed (READ: their `+`/`-` lines diff equal against `HEAD`'s). Each still makes its fault. EXECUTED: patch 4 leaves no `role="alert"` in the summary (L1); patch 7b puts `role="alert"` on the root and none on the content (L3). Under each, `022t` 1 fails: "Expected: "alert", Received: """. `mutations.test.ts` passes.

### 024i

1. **The helper.** Correct for each case asked. EXECUTED, on the helper extracted from `vite.config.ts`:
   - 40 digits: the full hash, all digits, as the spec says;
   - `""` and `undefined`: no name, so SvelteKit's default follows;
   - `db8fb65…`: `db8fb65`; a letter at index 6: `123456a`;
   - `648273658dc0…`: `648273658d`; a letter at index 8: `12345678a`.
   - In this repository, 11 of 239 commits have an all-digit short hash (EXECUTED, `git rev-list --all`). Their names run from 8 to 18 characters, the longest `42670373253579440b`.
2. **The two copies.** The `commitName` function is byte-identical in `vite.config.ts` and in the page's snippet, once the page's template literal is evaluated (`\\d` is `\d`). The `const name` lines differ only in line breaks. EXECUTED. The unit test runs both copies, so they cannot drift apart unseen.
3. **An interface change?** No, by the changelog's own usage. Its line 3 marks "a change to an item's interface". No item changes: the readers' contract stays (all digits means no commit), and `static/r/` does not move for it (EXECUTED). The lines an app copied are the page's guidance, not an installed file. The sentence in `app-shell`'s bullet tells such an app what to do. It sits in a bullet already marked **interface change** for `toast`, and claims none of its own. That is right.
4. **`WORKERS_CI_COMMIT_SHA`:** still supported, and still wins over git. EXECUTED: the A3 builds above named the commit from it. The unit test covers both orders.
5. **A3 with an all-digit hash:** passes after the fix, 2 of 2 (the table above).
6. **Other places that assume 7 characters:** none that matter. READ: `scripts/rename-kuiper.ts` masks a 7-character hash in comparing two builds of one commit, and both builds name it alike. `scripts/cost/run.ts` labels its own report with `--short`, outside the name. The cost app fixes its name to `"0"`.

### 020d's guards

`registry.test.ts`, `never-released.test.ts` and `mutations.test.ts`: **171 pass, 0 fail.** EXECUTED. `020d` test 16 holds: each new sentence sits before its bullet's pointer to "Also since 0.11.0", and both bullets still end with it (READ). The new unit test reads no changelog entry.

### The ledgers

- `static/`: only `error-summary.json` changed, in `static/r/` and `static/v0.13.0/r/`. EXECUTED: a fresh build leaves the diff's hash unchanged, and `git status` lists only those two under `static/`.
- Cost: `bun run cost --sizes-only` says "every figure is fresh" and rewrites `report.json` byte-identical. The builder's figures stand: `error-summary` JS 11,875 → 11,882 B, CSS 906 → 926. READ, in the report.
- Thumbnails: `--hash-only` rewrites the manifest byte-identical. Four hashes moved against `HEAD`: `error-summary`, `sign-in`, `sign-up`, `settings`. The pictures did not change (question 1).

### The gate

All EXECUTED, on the change:

- `bun run check`: 0 errors, 0 warnings, 2,437 files.
- `bun run lint`: clean.
- `bun scripts/lint-literals.ts`: 0 literals, 1 allowance.
- `bun test ./tests/unit`: **1,990 pass, 0 fail**, 70 files. The highlighter's timing test passed in the full run, so it was not re-run alone.
- `bun scripts/site/release-check.ts --before-ci`: exit 0, with its four CI-only skips.
- `error-summary.spec.ts` and `blocks.spec.ts`, `chromium-light` and `webkit-light`: **171 passed, 1 skipped** (`019b` 3 in WebKit), 0 failed.
- The dry speech runs (`SR_DRY=1`), `error-summary.sr.ts` and `app-shell.sr.ts`, `chromium` and `webkit`: **16 passed.**

## Findings, most severe first

1. **Low (`019d`). In a layout that sizes the summary from its own content, ordinary words now break letter by letter.**
   - **Evidence:** `overflow-wrap: anywhere` lowers the summary's smallest width (_min-content_, the narrowest a box can get without overflowing) to about one letter. EXECUTED, at 1440 in both engines: the summary moved into a 200 px flex row beside a `flex: 1 1 2000px` sibling. With the class it shrinks to 76 px, and "There is a problem" takes 13 lines, the first link 12. Under `normal` it held at 125 px, 3 lines each. The spec's fix 3 says "a normal message lays out exactly as before". That holds where the summary's width comes from its container. Every shipped use is such a place: `sign-in`, `sign-up`, `sign-up-verify`, `settings-form` and `settings-delete` put it in a grid or a flex column (READ). So no block changes, and the 108 screenshots agree.
   - **Why not another class:** INFERRED, not probed. `break-words` keeps the smallest width. But the alert's `1fr` column then grows to the long word, and the page scrolls again. Adding `min-w-0` lets the column shrink below the word, and the squeeze is the same. Some trade-off comes with any fix for reflow.
   - **Fix:** no code change. Qualify fix 3 in the landing notes: "where the summary takes its container's width, as in every shipped block". Or add one sentence to the component page's usage: in a flex row, give the summary its own width or `shrink-0`.
2. **Low (`019d`). The roadmap row still names the review's first fix.**
   - **Evidence:** `019d`'s row ends "`wrap-anywhere` on the links fixes it". The built fix is on the content, because a fix on the links alone leaves the title at 654 px (the spec's landing notes, EXECUTED by the builder; this review's base run shows the title ending at 637).
   - **Fix:** "`wrap-anywhere` on the summary's content fixes it, title, message and links".
3. **Low (`024i`). The specification cites the small-change rule without its scope clause.**
   - **Evidence:** the Kind line quotes "a fix with no interface change, no new token or dependency". Constitution §5 and `context/README.md` add "and touches one item or one page". `024i` touches the site's `vite.config.ts` and the app-shell page, in lanes S and I. Its own words, "one fix in two copies", make a fair case. But that is a reading of the rule, and the builder made it. Lane S ran its own build at the same time. READ: `lane-s-run8`, at `4baae79` plus its working tree, touches neither `vite.config.ts`, the app-shell page, `CHANGELOG.md` nor the roadmap. So nothing collided.
   - **Fix:** quote the definition whole. The design lead rules, in the landing notes, that the config and the snippet it publishes count as one page for this rule. Or the design lead says why they do not.
4. **Note (`024i`). "CI's builds name their commit through that variable" is half right.**
   - **Evidence:** READ, `.github/workflows/matrix.yml`: the GitHub build runs `bun run build` after `actions/checkout` and sets no `WORKERS_CI_COMMIT_SHA`. It names the commit with `git rev-parse HEAD`. Workers CI, the deploy, sets the variable. Both paths go through `commitName`. The e2e evidence used the variable. The git path is covered by the unit test, with git stubbed, and by this review's normal build (`db8fb65`).
   - **Fix:** in the check's last bullet, "Workers CI names its build through that variable; the matrix build, through git."
5. **Note (`019d`). The test checks the title and a link, not the message.**
   - **Evidence:** the defect names all three. The message inherits the class and wraps (question 3, EXECUTED). The test would not catch a later class on the message that undoes it.
   - **Fix:** optional. Give the test a view with a message, or record that question 3 covered it.
6. **Note (`024i`). The full hash at worst is 40 characters, and that name overflows the footer at 320.**
   - **Evidence:** EXECUTED in the DOM at 320: a 40-character name in the footer's `dd code` makes `/view/app-shell/` 386 px wide and `/` 378. An 18-character name, the longest in this repository, fits: both pages 320. A name of about 30 or more, the point where it would overflow, needs 30 leading digits: about one commit in 1.3 million.
   - **Fix:** none. Record it beside the spec's "the full hash at worst".
7. **Note (`024i`, before this change). An empty `WORKERS_CI_COMMIT_SHA` gives no name, even with git.**
   - **Evidence:** `??` keeps `""`, and `commitName("")` gives `undefined`. Before the change, `"".slice(0, 7)` gave `""`, which is also falsy: no name. So nothing moves. The test asserts the empty variable only with no git.
   - **Fix:** none here. `||` would fall back to git, but that is a change of its own.
8. **Note (outside this change). "The layout reads<code>version</code>" lacks a space.**
   - **Evidence:** the page renders "The layout readsversion from $app/env". READ: `HEAD`'s line 163, and the built page. It sits in the paragraph this change edits.
   - **Fix:** add the space while here.

## Constitution checks

- **§4.1, source, not a package:** met. READ.
- **§4.3, tokens are the one source:** met. `wrap-anywhere` is a layout keyword, already used by four shipped items. EXECUTED: `lint-literals`.
- **§4.4, accessible and proven:** met for Reflow in what was run: Chromium and WebKit, light and dark, three sizes. Firefox was not run; CI runs it. Finding 1 is a trade-off in app layouts, not a failure in a shipped one.
- **§4.5 and §4.6:** met. No dependency changes. READ.
- **§5:**
  - Both are small changes. `019d` touches one item. For `024i`, see finding 3.
  - Each check was seen failing on the old code (EXECUTED, above).
  - The reviewer wrote neither.
  - The scorecard is not re-run. It follows the batch's landing, so this review cites no movement.
- **§6:**
  - Nothing was committed or pushed.
  - No prior art was copied. READ.
  - Neither change alters an item's interface. Each changelog sentence says what an app gains, and `024i`'s says what an app must copy.

## Verdict

- **`019d`: lands, once findings 1 and 2 are written in.** Both are words: a qualified sentence in the landing notes, and the roadmap row. The fix does what the spec says. Its test fails on the old item. The look is byte-identical in 108 pairs, words that fit are untouched, and `022t`'s swap and both mutation patches still work.
- **`024i`: lands, once finding 3 is ruled.** The helper is correct, the two copies match, A3 passes on `6482736`'s hash, and no shipped item moves. Finding 4 is a reworded sentence.

Findings 5 to 8 are records for the landing notes, and one optional space.

## Disposition

By the design lead, 2026-11-17. `019d`: findings 1 and 2 written in (the page's "Your part" line, the spec's claim qualified, the roadmap row). `024i`: finding 3 ruled a small change, in its landing notes. Notes 4 and 8 fixed; 5, 6 and 7 recorded. **Closing verdicts: both land.** Then, after run 8, `024i` landed alone and `019d` was held back (the review of `019e` and `024i`, `reviews/019e-024i-the-list-returns-and-the-digit-hash-pr-2026-11-17.md`).

**Afterwards, 2026-11-17.** `c51b65b` committed both, on a session branch, not a release branch. `019e` then reverted `019b` to the list markup (the design lead's ruling, [the eighth matrix run](../research/2026-11-17-the-eighth-matrix-run.md) §11, option (a)). `019d` styled `019b`'s links box, so it was held back, to be rebuilt on the list markup; its findings 1, 2 and 5 go with it. `024i` was re-applied alone, on `019e`, with note 8's space made to hold under Prettier (`024i`'s landing notes, "Re-applied alone"). This review's `019d` verdict and figures describe the box-markup build, and do not stand for the rebuild.

