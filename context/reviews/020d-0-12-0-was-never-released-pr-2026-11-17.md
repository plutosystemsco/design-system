# Review of 020d — 0.12.0 was never released

- **Date:** 2026-11-17
- **Status:** dispositioned; lands
- **Reviewer:** a reviewer; not the author of the specification or the build
- **Reviewed:** the uncommitted diff in the worktree `lane-s-020d`, on `release/0.13.0` at `7ec5488`. That is 44 changed files, 4 new files and 76 deletions under `static/v0.12.0/`. Against [020d](../specifications/020d-0-12-0-was-never-released.md) and its Landing notes, [the memo](../research/2026-11-17-0-12-0-was-never-released.md) and [the spec review](020d-0-12-0-was-never-released-spec-2026-11-17.md).
- **Re-ran:** everything below is EXECUTED unless it says READ. Browsers from `/opt/pw-browsers`.
  - **Before the first probe,** the SHA-256 of `git diff` was `0d7fc40d…` and of `git status --porcelain` `afebf5fe…`. The binary diff, the 44 changed files and the 4 new files were saved to a scratch archive.
  - **Seen failing, in place** (see "Seen failing"). The base's files were checked out from `7ec5488`, the tests run, and the tree restored with `git checkout -- .`, `git apply --binary` of the saved diff, and the new files moved back. Both hashes matched again. Each new file matched the archive by `cmp`.
  - **A fresh `bun run build`** of the base tree and of the built tree. The built tree's build left both hashes unchanged, so `static/r/` and `static/v0.13.0/r/` are this source's.
  - `bun run check` → 2,436 files, 0 errors, 0 warnings. `bun run lint` → clean. `bun scripts/lint-literals.ts` → 0 literals, 1 allowance (`liquid-glass`).
  - `bun test ./tests/unit` → **1,960 pass, 0 fail**, across 69 files. The highlighter's timing tests passed on the first run.
  - `bun scripts/site/release-check.ts --before-ci` → exit 0, with its four named skips.
  - e2e, `E2E_PREBUILT=1` on the fresh build, `chromium-light` and `webkit-light`: `upgrade.spec.ts`, `site.spec.ts`, `tokens.spec.ts`, `tokens-files.spec.ts` and `build-output.spec.ts` (`chromium-light` only, by the config) → **234 of 234 pass**.
  - **The guide, walked** on a scratch copy of the smoke fixture `kit3`, installed from `v0.11.0` (see question 3).
  - **The changelog page,** rendered from the fresh build in Chromium at 1440 px, and the guide at 390 px (see question 2).
  - **The guard,** with five plants, each removed (see question 6).
  - `bun run cost --sizes-only` → "every figure is fresh", and `report.json` byte for byte the builder's. `bun scripts/site/thumbnails.ts --hash-only` → the manifest byte for byte the builder's.
  - `scripts/bench/kuiper.ts` on the working tree, and with `--rev 7ec5488 --build` the base's build.
  - **After the last run,** both hashes are again `0d7fc40d…` and `afebf5fe…`. The index is clean. `git worktree list` shows the same three worktrees.
  - **Not run:** Firefox and the dark projects; the full e2e suite; the speech runs; `bun run test:smoke` (criterion 3's 15 of 15 is READ from the notes; the walk below covers more of the same path).

## Seen failing

Two setups, each restored afterwards.

**A. The base's changelog, tokens, `static/v0.12.0/` and guide, with the new tests.** The builder's setup. The nine files are the seven changed unit files, `never-released.test.ts` and `rename.test.ts`.

- **26 fail, 8 errors, 503 pass**, 529 tests. The notes say 28 fail and 501 pass, also 529 (finding 4).
- Failing, as the notes list them: T1 to T4 and T16; the retargeted `013`, `014`, `016`, `019a` and both `019` tests; `018`'s rewritten test; T5; T6; T7 (3 of 3); T9; T10 (5 of 5); T12; and `changelog-page.test.ts`'s releases.
- The 8 errors are the six first-part readers, `registry-comments.test.ts`'s folded-part describe and T15. Each throws "the 0.13.0 entry has no "Also since 0.11.0:" line" where its slice used to run to the file's end.
- T11 fails on its first check alone: "no 0.12.0", 25 files. **Its second check, "no open-ended changelog slice", passes**, since the new tests hold no slice.

**B. The base's unit test files, with the new guard and helper.** The slice check fails: `registry.test.ts` 11 lines, `registry-comments.test.ts` 3, `toast-site.test.ts` 1. So each check was seen failing, in one setup or the other.

**C. The whole base, built, with the new `site.spec.ts` and `upgrade.spec.ts`,** `chromium-light`: 2 fail, 54 pass. The two are T13 ("in seven parts") and T14 (the five named items' releases, with `#v0-12-0` present). As the notes say.

## The questions, answered

**1. Do the tests fail on the base?** Yes. See "Seen failing". The counts differ from the notes by two, and the slice check needs setup B (finding 4).

**2. The fold.**

- **As a 0.11.0 app reads it, it is correct and clear.** It reads one entry, from the fold sentence down. The rename's bullets come first, in the order an app must follow. The split line says that a bullet below adds to any bullet above. Every first-part bullet that a second-part bullet contradicts points down to it. The update paragraph renames the keyframes before any `add`. One sentence still overclaims (finding 2).
- **Every bullet survives (T15).** I wrote my own check, not the builder's helper. The base's heads from `git show 7ec5488:CHANGELOG.md` are 26 and 18, and they equal `020d-fold-heads.json` and the folded parts' heads. Undoing the 13 named edits in the first part gives the base's 0.13.0 entry, byte for byte. Undoing the 7 named edits in the second part leaves one difference by `difflib`: the naming paragraph, which decision 3 deletes.
- **The pointers are right.** The eight single-head bullets each point to a second-part bullet that exists. The doc-comment bullet's "Of these" names exactly the 14 of its 61 names that head a second-part bullet. The other four second-part heads, `kuiper-theme`, `product-home`, `kbd` and `error-summary`, are not in its list. No multi-head bullet shares a head with the second part.
- **"Rolled back to 0.11.0" is right for that reader.** 0.11.0's `theme` reads the key `pluto-theme` (`static/v0.11.0/r/styles/maia/theme.json`: `THEME_KEY = "pluto-theme"`). The update's carry-over removes that key. So an app rolled back to 0.11.0 finds no choice, and each visitor's choice resets once.
- **The page renders it.** `/changelog/` in Chromium:
  - 44 bullets in the 0.13.0 section (26 and 18);
  - the split line, a `<p>` of its own;
  - the anchors `v0-13-0`, `v0-11-0`, `v0-8-0` … `v0-1-0`, with no `v0-12-0`;
  - no console error.
  - A fresh load of `/changelog/#v0-12-0` sits at `scrollY` 0, the page's top (decision 12).
  - The split line looks like the prose paragraphs under it (note 10).

**3. The guide, walked.** A scratch `kit3` app, with the worktree's `static/` served as the registry:

- `add pluto-theme code-block code-editor field input kbd error-summary` from `/v0.11.0/r`.
- The app's own uses, planted: `text-code-builtin`, `var(--syntax-amber)` and `bg-syntax-purple` in a page; and, in `app.css`, `var(--code-foreground)`, `var(--color-syntax-teal)`, `animation: pluto-enter` and a class of its own named `scrollbar-code`.
- `020`'s steps 1 to 4, then the new section's steps 1 to 4, each from the guide's own data. Step 2's second line was run with `-o`, since the walk has no terminal to answer the CLI's question.

What it showed:

- **The order is safe.** No `add` comes before step 1. The code items update in step 2, with the theme. The new section's `bun install` exits 0. Its grep runs while the removed names still compile.
- **The grep is before the deletion, and finds every planted use.** It lists all five planted lines: three in the page and two in `app.css`. It also lists the 44 theme lines that step 3 deletes, as the step's text warns. Step 3 deleted exactly 44 lines: 12 in `:root`, 12 in `.dark`, 12 `--color-` forms and 8 derived `--code-*` lines. After that the grep found nothing.
- **The walked app keeps every replacement.** Its build exits 0. Its CSS holds `.text-code-function`, `.bg-syntax-violet`, `--color-syntax-blue`, `kuiper-enter` and the renamed own class. It holds no `pluto-enter`.
- **A control proves the step is needed.** A copy with the same deletion and no replacement silently loses `.text-code-builtin` and `.bg-syntax-purple`. It keeps a `var(--code-foreground)` that points at nothing. Its build exits 0.
- **Twelve is the whole list.** A set difference of every name 0.11.0's theme ships against today's: 8 `--code-*` names, 4 `--syntax-*` names (with their `--color-` forms) and the 4 keyframes, which `020`'s step 1 covers. The grep names all twelve.
- **Step 4 is right for 0.11.0.** 0.11.0's theme ships the unlayered `html:has([data-sticky-bar])` rule, and the walked app held it.
- The guide fits 390 px: no element in `main` overflows, and the page has no sideways scroll.

**4. Tokens.**

- The diff is exactly 213 lines, each a `since` or a `removed` value changed from `0.12.0` to `0.13.0`: 141 `since` lines and 72 `removed` lines.
- **The CSS is byte-identical.** The two fresh builds give the same SHA-256 for `src/app.css` (`e72d4222…`) and `kuiper.css` (`3111eac4…`), in `static/r/`, `static/v0.13.0/r/`, `build/r/` and `build/v0.13.0/r/`. All 14 CSS files in `build/` are the same. Every `static/r/styles/maia/*.json` and `static/v0.13.0/r/styles/maia/*.json` has the same hash, except the two `field.json` files. Their only change is the comment, "The 0.12.0 keys." → "The keys before 0.13.0.".
- **The lifecycle record is true.** `tokens-lifecycle.test.ts` derives `since` and `removed` from the `static/v*` folders, and passes in the unit run. With `v0.12.0` gone, a token first built in the 0.12.0 tree first ships in 0.13.0.

**5. The deviations.**

- **The "no amber" exception is narrow. Keep it.** It covers one file, `src/lib/site/upgrade/0.13.0.ts`, and one name, `syntax-amber`, bare or with `--` or `--color-`. A probe added each of these to that file's text, and the test caught every one: "the old amber yellow", `text-amber-500`, `--amber-500`, `syntax-ambers`, `#F19E20` and `syntax-amber-2`. Decision 8's grep must name `syntax-amber`, so the exception is needed.
- **The orphaned fixture should go** (finding 3).
- **The step-2 reading is not the specification's** (finding 1).
- **The order of work is acceptable.** The fold was set aside and the base's changelog restored before the tests ran, and setup A reproduces that. The tests were seen failing.

**6. The guard.** It counts per file, and fails on each plant:

- a new file, `src/lib/zz-probe.ts`, with one "0.12.0" → "1 lines, none allowed";
- a second "v0.12.0" line in `CHANGELOG.md` → "allowed 1, found 2";
- the fold sentence moved to the file's end → passes, as decision 11 wants;
- an open-ended slice in a new file under `tests/` → the slice check fails, "none allowed";
- `#v0-12-0` in a new file under `static/r/` → fails.

A recreated `static/v0.12.0/` with no version text in its files is not this guard's to catch. T5 and T6 catch the folder itself.

**7. Scope and ledgers.**

- **The built site.** Base build against new build, ignoring hashed asset names:
  - only 76 files go, all `v0.12.0/`, and no file is added;
  - 26 files change: the changelog, the upgrade guide, `kbd` and `product-home` (each with its `index.md` twin and `__data.json`), the two `field.json` files, and the 12 published token files.
  - No built file holds `v0-12-0` or `/v0.12.0/`. The base held them in 8 files, on the same four pages.
  - The `kbd` and `product-home` twins differ only in the Updated line, `0.12.0` → `0.13.0`.
- **The cost ledger's six items are explained.** `field`, and `composer`, `sign-in`, `sign-up`, `settings` and `chat`, which hold it, move their source hash only. Their `runtimeHash` and `outputHash` are unchanged. The catalogue's figures also move (note 9).
- **The thumbnails are unchanged; the manifest is not** (finding 5). No picture is in the diff. 69 of the manifest's 82 hashes move against `7ec5488`. The two inputs that moved are comment-only: `src/lib/site/changelog.ts` (65 items) and `field-context.svelte.ts` (6 items).

**8. The gate.** All green; see "Re-ran".

## Acceptance criteria against evidence

1. **T1 to T12, T15 and T16 pass in the unit run** — met. 1,960 pass, 0 fail.
2. **T13 and T14 pass in Chromium; the rest of the two specs passes** — met, in `chromium-light` and `webkit-light`.
3. **The smoke upgrade case** — READ from the notes, 15 of 15. The walk in question 3 covers the same path, and more.
4. **No change to the CSS or the styles but `field.json`'s comment** — met (question 4).
5. **No `build/v0.12.0/`, and no `v0-12-0` or `/v0.12.0/` in the build** — met (question 7).
6. **`check` and `lint`** — met.
7. **`release-check --before-ci`** — met, exit 0.
8. **The roadmap and the handoff read as decision 10 says** — met, READ. The `020d` row was already in the base's 0.13.0 table. See finding 6 for one sentence in Q2.
9. **The scorecard** — met. The bench gives releases 12 → 11 and versioned registries 9 → 8, and every other count is the same. The run log has the row, and row 11's evidence reads the 0.13.0 entry.
10. **Every live row of §7 and §10 is handled** — met. Each of §7's rows is handled as its "Change" column says (READ). For tracked files outside `context/`, the guard passing is the proof (EXECUTED). The owner's rows, the branch and a local tag, are in the Landing notes.
11. **The Landing notes hold T15's diff, the re-taken counts and the owner's two git steps** — met, with findings 4 and 5 to correct.

## Findings

1. **Low. Step 2's example second line is not the specification's.**
   - Decision 8 says: "The example second line stays `field input`, since the text tells the app to name its own parts."
   - The build's second line is `add field input highlighter use-highlighted-code code-block code-editor code-languages kbd error-summary`. The builder flags this as a reading.
   - `add` installs an item the app does not have. So an app that pastes the example gets `code-editor`, the `highlighter` (19 grammar packages, about 350 MB on disk, by the changelog), `code-languages`, `kbd` and `error-summary`, whether it had them or not.
   - The text already names the code items, says to put them on the second line, and says why. The spec review settled this line (its finding 7).
   - The builder's T10 pins its own reading: it requires `field input` and the seven names on line 2.
   - **Fix:** go back to `addCommand("field input")`, and to "The second line is an example for an app with `field` and `input`; name yours instead." Keep the rest of the new text. T10 then requires `field input` and no `-o` on line 2. If the design lead prefers the builder's line, record that as a ruling in the Landing notes instead.

2. **Low. The first `kuiper-theme` bullet still says "every variable and utility, keep their names".**
   - A 0.11.0 app reads that sentence first. The code-map bullet below removes twelve variables and their utilities.
   - The bullet's pointer and the split line soften this. But it is the same overclaim decision 8 fixed in the guide's `UNCHANGED.names` ("the sections above do not name").
   - **Fix:** scope it, for example "… and every variable and utility, keep their names in the rename", and add that edit to T15's list in the Landing notes. Or record that the pointer is enough.

3. **Low. `tests/fixtures/static-r-amendments.json` should go.**
   - Decision 7's "Its fixture stays: the reworded-comments test reads it" means `reworded-comments.json`, which the kept tests read. `static-r-amendments.json` was the deleted check's second fixture (`AMENDMENTS`).
   - Nothing reads it now (`grep` over `tests/`, `scripts/` and `src/`). Its own rule, "Each entry must be used", cannot be enforced.
   - No guard counts it: it holds no `pluto` line and no "0.12.0" line. Specifications `019`, `019a` and `020` name it as history.
   - **Fix:** delete it, and say so in the Landing notes.

4. **Low. The "Tests seen failing first" record does not match a re-run.**
   - Setup A gives 26 fail, 8 errors and 503 pass. The notes say 28 and 501.
   - In that setup, T11's slice check passes, since the new tests hold no slice. It fails only with the base's test files (setup B: 11, 3 and 1 lines).
   - **Fix:** correct the bullet. Say that T11's "no 0.12.0" check fails on the base's content, and its slice check fails on the base's tests.

5. **Low. The ledger note says "the manifest is unchanged (83 items)".**
   - Against `7ec5488`, 69 of the manifest's 82 hashes move. "83" is the registry's count, alias included.
   - The two inputs are comment-only, `changelog.ts` (decision 9's samples, 65 items) and `field-context.svelte.ts` (6 items). So `--hash-only` is the right tool, and no picture needs to be taken again. The re-run reproduces the builder's file byte for byte.
   - **Fix:** the note says 69 hashes moved, from those two comment-only inputs; the pictures stand; `--hash-only` wrote the manifest.

6. **Low. Roadmap Q2 now ends "… (`020d`), and `release/0.13.0` starts from it".** "It" now reads as `020d`.
   - **Fix:** "… starts from `dad6f76`".

7. **Note. The "no amber" exception stays.** It is narrow (question 5). Its ruling is in the Landing notes already.

8. **Note. `020`'s step 1 asks for a rename of an own `scrollbar-code` class, and its grep does not look for one.** In the walk, the step's command did not list the planted class. A missed class takes the theme's track colour, a small visual change. Optional: add `-e scrollbar-code` to the command.

9. **Note. The cost catalogue moves on comment-only changes:** JS 379,377 → 379,356 and CSS 16,842 → 16,838. The re-run reproduces it, and the notes record it, but neither says why. Give the cause in the Landing notes, or say it is unexplained.

10. **Note. The split line renders as a plain paragraph,** the same as the prose under it (Chromium, 1440 px). That is decision 3's design, and the line says what it is. A later change could set it apart. Bold would break `foldedParts`, which matches the line's start.

11. **Note. Left for landing.**
    - The specification's Status line.
    - The handoff's run-5 paragraph still lists `020d` as "specified and fit to build".
    - The guide's lead paragraph ("0.13.0 renames the system's code names to Kuiper") is now incomplete for a 0.11.0 app, though not false. The builder left it, since decision 8 does not name it.

## Constitution checks

- **§4.1, source, not a package:** met. Nothing an app installs changes but one comment. READ.
- **§4.3, tokens are the one source:** met. The CSS is byte-identical, and `lint-literals` is clean (EXECUTED).
- **§4.4, accessible and proven:** no item's behaviour changes. The site's changed pages pass their specs in Chromium and WebKit. Firefox was not run; CI runs it.
- **§4.5 and §4.6:** met. No dependency changes. READ.
- **§5:**
  - The specification had research and a spec review.
  - Each new check was seen failing on the base (EXECUTED, with finding 4's correction).
  - The reviewer wrote neither the specification nor the build.
  - The scorecard was re-run, and the bench agrees (EXECUTED).
- **§6:**
  - Nothing was committed or pushed.
  - No prior art was copied.
  - No installed app breaks: `static/v0.12.0/` was never reachable from a tag, and the guide is now the safe path from 0.11.0 (EXECUTED, the walk).

## Verdict

**Lands, once findings 1 to 6 are dispositioned.** None blocks it. All six are Low:

- finding 1 is one command line and one sentence in the guide, with T10;
- finding 2 is one phrase in the changelog, or a recorded ruling;
- finding 3 deletes a file nothing reads;
- findings 4 to 6 correct the record.

The fold, the deletion, the tokens, the guide's order and the guard all hold under my own runs.

## Disposition

By the design lead and the builder, 2026-11-17. Re-checked by this reviewer in `lane-s-020d`. Findings 1, 2 and 7 were checked by my own runs. The rest were checked by reading the diff and the Landing notes.

- **Before the re-check,** the SHA-256 of `git diff` was `5fc2724d…` and of `git status --porcelain` `ac2f91a0…`.
- **After the re-check,** both hashes are the same. The one probe swapped in the pre-fix `CHANGELOG.md` and guide from my archive, then copied the current files back.

1. **Fixed (the design lead's ruling).** Step 2's command is back to `add kuiper-theme -y -o`, then `add field input -y`, with no `-o` on the second line.
   - The text gives the code items, `kbd` and `error-summary` a sentence of their own: name them on the same line only if the app has them, since an `add` installs an item the app lacks. The example sentence again reads "an app with `field` and `input`".
   - T10 now requires line 2 to end with " add field input -y". EXECUTED: on the pre-fix guide, T10 fails. The old line 2 does not meet the new assertion.
2. **Fixed.** The rename bullet now reads "… and every variable and utility, keep their names, except the twelve code colours the code-map `kuiper-theme` bullet removes."
   - EXECUTED: T3's new assertion fails on the pre-fix `CHANGELOG.md` and passes now.
   - My own T15 script, given the 14th edit, still turns the first part back into the base's 0.13.0 entry byte for byte. The heads still match `020d-fold-heads.json`.
3. **Fixed.** `tests/fixtures/static-r-amendments.json` is deleted. Nothing in `tests/`, `scripts/` or `src/` names it (READ). The unit suite and the rename guard pass (EXECUTED).
4. **Fixed.** The Landing notes now say 26 fail, 8 errors and 503 pass. They also say that T11's slice check fails only with the base's test files (READ).
5. **Fixed.** The Landing notes now say 69 of 82 hashes moved, from the two comment-only inputs, and that the pictures stand (READ).
6. **Fixed.** Roadmap Q2 ends "`release/0.13.0` starts from `dad6f76`" (READ).
7. **Kept, as advised.** The "no amber" test is unchanged by the fixes. EXECUTED: the current guide passes it. The same six plants are still each caught.
8. **Taken (the design lead's ruling).** `020`'s step 1 grep adds `-e scrollbar-code`, and its text says the command finds the class too. A 0.11.0 theme has no `scrollbar-code`, so before the update every match is the app's own. EXECUTED: T10 fails on the pre-fix guide with "Expected to contain: "-e scrollbar-code"".
9. **Recorded.** The Landing notes say no cause was found for the catalogue's move, and that the re-run gives the same figures (READ).
10. and 11. **Noted** for a later change and for landing.

**Re-run after the fixes (EXECUTED):**
- `bun test ./tests/unit`: 1,960 pass, 0 fail.
- `prettier --check .`: clean.
- The pre-fix swap, for findings 1, 2 and 8.
- The amber probe, and the T15 reversal.

**Read from the builder's notes, not re-run:** the rebuild, `release-check --before-ci` (exit 0) and the e2e specs (234 of 234). The fixes change only the guide's text and one changelog sentence. My earlier e2e run covered the same specs.

**Closing verdict: lands.**
