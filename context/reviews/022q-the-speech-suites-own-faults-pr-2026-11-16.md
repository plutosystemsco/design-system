# Review of 022q — The speech suite's own faults (built)

Reviews the built change for [`specifications/022q-the-speech-suites-own-faults.md`](../specifications/022q-the-speech-suites-own-faults.md), against that specification, its [spec review](022q-the-speech-suites-own-faults-spec-2026-11-16.md) (three dispositions, fit to build) and its research, [the first speech verdicts](../research/2026-11-16-the-first-speech-verdicts.md) (*the memo*). This reviewer wrote neither the change, nor the specification, nor its research (constitution §5).

- **Date:** 2026-11-16
- **Status:** dispositioned; lands (re-checked 2026-11-16 after the rebuild; see Disposition)
- **Reviewer:** a reviewer; not the author
- **Reviewed:** the worktree `.claude/worktrees/lane-e-speech`, branch `lane-e-speech`, from `c5cdd65`, uncommitted.
  - `git diff`: 26 files. `tests/sr/rules.ts`, `tests/sr/fixtures.ts`, the eight O2 files, `toast.sr.ts`, `pagination.sr.ts`, `chart.sr.ts`, `tooltip.sr.ts`, `sign-up.sr.ts`, `tests/unit/sr-rules.test.ts`, `tests/unit/workflow.test.ts`, the six `tests/fixtures/ci/*.json`, `tests/fixtures/pluto-allowed.json`, `.github/workflows/matrix.yml`, and a pointer line in `022`'s decision 12.
  - Untracked: `tests/sr/cover.ts`, `tests/e2e/sr-cover.spec.ts`, `context/notes-022q-build.md` (the builder's notes).
  - Read beside them:
    - `@guidepup/guidepup` 0.40.0: `windows/NVDA/NVDAClient.js` (`enqueueAndTap`, `#processQueue`), `NVDA.js` (`start`, `perform`, `capture`, `itemTextLog`), `keyCodeCommands.js`, `config/*`, `macOS/VoiceOver/VoiceOverClient.js` (`#pollForSpokenPhrases`), `manifest.json`;
    - `@guidepup/playwright` 0.21.0: `navigateNVDAtoWebContent.js`, `screenReaderTest.js`;
    - guidepup's portable NVDA's `nvda/userConfig/nvda.ini` (guidepup/nvda, `main`, the 0.2.1-2026.3 asset's source), fetched read-only;
    - NVDA's source (nvaccess/nvda, `master`): `config/configSpec.py`, `browseMode.py` (`reportPassThrough`), `globalCommands.py` (`script_toggleVirtualBufferPassThrough`), fetched read-only;
    - `tests/sr/mutations/main/expected.json` and `7-code-block.patch`; `playwright.sr.config.ts`; `tests/sr/reader.ts`.
- **Before and after:** `git diff | sha256sum` → `74431840…0c69af`; the three untracked files → `1dfcc09d…e99bb`; 29 status entries. The same after every probe. Each probe file was copied to the scratchpad first and copied back; `sha256sum` of `rules.ts`, `fixtures.ts` and `cover.ts` matched before and after.
- **Re-ran:** no file in the repository was written but this one. Scratch tests and scripts lived in the session's scratchpad and are deleted.
  - `bun test tests/unit/sr-rules.test.ts` with `rules.ts` at `c5cdd65` plus throwing stubs for `insideTexts`, `joinCaptures` and `lastStepPhrase` → **14 fail, 30 pass**, of 44. The 14 are the builder's 14. The two later description guards pass on the old O2, as guards. EXECUTED.
  - The same file with `insideTexts` not leaving out the description (the build before the design lead's ruling, emulated by one edit) → **3 fail, 41 pass**: the inside-texts case and the two description guards. EXECUTED.
  - `bun test` of `sr-rules`, `sr-static`, `mutations` and `workflow` with `fixtures.ts` at `c5cdd65` → **101 pass, 0 fail** (finding 5). EXECUTED.
  - `bun test` of `release-check`, `gate`, `workflow`, `mutations`, `sr-static`, `sr-rules` and `rename` → **137 pass, 0 fail**, 1083 expects. EXECUTED.
  - The six CI fixtures: each holds 45 names, 10 distinct `voiceover (…)` and 6 `nvda (…)`. EXECUTED.
  - `SR_READER=voiceover bun --bun playwright test -c playwright.sr.config.ts --project=webkit --list --shard=k/5`, k = 1 to 5 → **19, 17, 19, 16, 16**; `chart.sr.ts` only in shard 1. NVDA `--shard=1/3` → 32 tests. EXECUTED; no reader started.
  - `bun run check` → 2431 files, 0 errors, 0 warnings. `bun run lint` → "All matched files use Prettier code style!". EXECUTED.
  - `bun test ./tests/unit` → **1879 pass, 2 skip, 0 fail**, 67 files. `highlight-session.test.ts` passed in this run. EXECUTED.
  - `SR_DRY=1 E2E_PREBUILT=1 bun run test:sr --project=chromium` → **87 passed** (1.2 m); `--project=webkit` → **87 passed** (1.7 m). EXECUTED, against the worktree's existing build (no `src/` change).
  - `bun --bun playwright test tests/e2e/sr-cover.spec.ts --project=chromium-light --project=webkit-light` → **4 passed**. With `cover.ts` replaced by no-ops → "with the cover" **fails 2 of 2** (`Expected: "/view/app-shell/"`, `Received: "/"`), "without the cover" passes 2 of 2. EXECUTED.
  - A scratch O2 unit test with constructed phrase sequences (finding 3), and one for `joinCaptures` and `L3` (findings 2 and 4). EXECUTED.
  - A scratch Playwright script on `vite preview`: the helper's focus, click and blur on `body`, then Tab, with no cover, with the cover appended (as built) and with it prepended; `/example/dialog/keyboard/`, `/example/alert-dialog/keyboard/`, `/view/app-shell/` at 1440 and 360; headless Chromium and WebKit, and headed Chromium under Xvfb. With the cover, the URL holds in every case and Tab lands on the page's first tab stop (the trigger, or "Skip to main content"). Without it, at 360, Chromium and WebKit leave for `/`. EXECUTED. So the cover's place at the end of `<body>` does not send the Tab out of the page, in these engines. Real OS keys under NVDA are not seen here.
  - Not run: Firefox (not installed), any real reader.

## Acceptance criteria against evidence

1. `sr-rules.test.ts`: the memo's four walks pass, seen failing first; the five guards; the comma, spoken-form and join cases — **met as written, not sufficient.** EXECUTED: 14 of 44 fail on `c5cdd65`'s rules; the four memo walks are verbatim; their `open` windows are labelled constructed. But the guards leave the focused element out of every `open` window, which the specification says it always holds. With it in, a reader that never walked passes (finding 3). The join case covers only a one-phrase action capture (finding 4).
2. `workflow.test.ts` and the six fixtures hold 45 jobs; `release-check.test.ts` and `gate.test.ts` pass — **met.** EXECUTED: 137 pass; 45, 10 and 6 in each fixture; the new test holds each fixture's names to the workflow's, in order. Seen failing first: READ, the builder's notes (3 fail of 55); not re-run here.
3. The cover's browser check, seen failing first — **met in Chromium and WebKit.** EXECUTED: 4 pass; with a no-op cover the "with the cover" test fails in both. Firefox is CI's.
4. The dry run, every changed test — **met.** EXECUTED: 87 of 87 in each project, S6's wait and the overlay-open fact among them. The dry run cannot reach `open()`'s cover, `listen()`'s reader branches or `browseMode()` (finding 5).
5. `mutations.test.ts` and `sr-static.test.ts` — **met.** EXECUTED.
6. The next push run — **not met yet, and at risk.** INFERRED: under NVDA, seven of the eight O2 tests would walk in focus mode and return X0 (finding 1).
7. The next `mutate` dispatch — **not met yet, and at risk.** INFERRED: patch 6's NVDA rows (finding 1) and patch 7's NVDA rows (finding 2) cannot fault as expected.
8. Shard times, counts, scorecard row — **not met yet;** a landing step.

## Decisions against the code

1. **O2** — matches. READ, `rules.ts:279–315`: got in, moved, the sentinel, the stall, in that order; each stops with X0 or the O2 fault. The inside texts leave out the trigger's name, `name`, the DOM title, the descriptions, and any text the trigger's name contains, normalised (`rules.ts:239–248`). "Moved" leaves out the focused element's own texts (the build's deviation 3). `lastStepPhrase` skips empty entries and entries that begin "You are currently on". The gap is in the decision itself: finding 3.
2. **Browse mode** — the key is guidepup's real command (`NVDAKeyCodeCommands.toggleBetweenBrowseAndFocusMode`, Insert+Space, `keyCodeCommands.js:391`), sent with `perform` inside a capture, and `exitFocusMode` is not used. The read of "focus mode" cannot work with NVDA's configuration: finding 1.
3. **The cover** — matches. READ, `fixtures.ts:89–117`, `cover.ts`: laid before the helper, lifted in `finally`, URL and (NVDA only) hit checked, X0 through `judge()`, which records `faults.json` and fails the test; `if (DRY) return` comes before the cover. EXECUTED: the e2e check fails with a no-op cover.
4. **Tooltip T2** — matches: an `away` window, then the trigger's own focus.
5. **Normalisation and spoken forms** — matches. Commas become spaces before whitespace collapses. L1, L2, L3, L4, F1, U1 and B1 take `Spoken`; L1, L4, F1 and B1 pass on any form; L2 and U1 fault on any; L3 on adjacent phrases each holding any. Toast S3's and sign-up's lists are as stated.
6. **Four tests** — matches. S3's whole text as two forms; S6 waits at most 10 s for the success toast to detach, records it, and judges the Escape after F8 and Tab; P2 removes the normalised status text from each phrase; C1 takes 25 steps, and `test.describe.configure({ retries: 0, timeout: 7 * 60_000 })` sits at the top of `chart.sr.ts`, so it binds that file alone (READ; the builder's probe under `--retries=2` ran once at 420000 ms).
7. **Captures by reader** — matches as written: one capture under NVDA, two under VoiceOver with `joinCaptures`, two for Orca and dry. The consequence for NVDA is finding 2; the join's comparison is finding 4.
8. **Item text** — matches: VoiceOver only, cleared at each window's and the walk's start, recorded as `<name>: item text`.
9. **Shards** — matches: `voiceover` `shard: [1, 2, 3, 4, 5]` and `/5`; `nvda` keeps `[1, 2, 3]` and `/3`; 45 jobs.

**Scope.** Every changed file is in the Scope "In" list, `pluto-allowed.json` included. The builder's notes are a context file for the design lead, not code. Nothing under `src/` or `static/` is touched (READ, `git status`).

## Findings, most severe first

1. **High: NVDA does not speak "focus mode", so decision 2 presses NVDA+Space once, blind, and puts most walks into focus mode** (decision 2; `fixtures.ts:259–275`).
   - READ, NVDA's `globalCommands.py`: NVDA+Space ends in `browseMode.reportPassThrough(vbuf)`. READ, `browseMode.py:56–75`: when `virtualBuffers.passThroughAudioIndication` is on, that plays `focusMode.wav` or `browseMode.wav`, and says nothing. READ, `configSpec.py:223`: it is on by default. READ, guidepup's portable `nvda.ini`: its `[virtualBuffers]` section sets only `autoSayAllOnPageLoad = False`. So under CI's NVDA the toggle is a sound, and the capture holds no "focus mode".
   - So `said` never holds "focus mode", and the second press never comes. Every NVDA walk toggles the mode once.
   - INFERRED, with *the memo* §2: NVDA was in browse mode in the sheet and the alert dialog ("link, Components", "button, Delete project" by Down Arrow). Focus lands on a button or link in seven of the eight overlays, where NVDA stays in browse mode. One toggle puts each into focus mode. Down Arrow then goes to the page, nothing moves, nothing is spoken, and O2 returns X0 at "moved". Only the dialog, whose focus starts in the Name field in automatic focus mode, is toggled the right way.
   - Failure: seven O2 tests × two NVDA pairs return X0 in the next push run (criterion 6). Patch 6's NVDA rows return X0 in place of O2, which the mutation report rejects (criterion 7).
   - Fix (a specification change first, decision 2):
     - under NVDA, start the reader with `settings: { virtualBuffers: { passThroughAudioIndication: false } }` in `screenReaderStartOptions` (READ: `NVDA.start()` merges `options.settings` into the session's `nvda.ini` through `setConfig`, and `screenReaderTest.js` passes the start options through). NVDA then says "Focus mode" or "Browse mode".
     - read the reply: press again on "focus mode"; record X0 through `judge()` if neither phrase is heard, so a silent toggle cannot leave the mode unknown.
     - say in decision 2 that NVDA's automatic mode changes then speak too (for example on focusing a text field), and check that no rule reads those words.
     - Prove it on the next push run's NVDA rows; nothing here can.

2. **High: under NVDA, L3 can no longer fault, in any test** (decision 7; `fixtures.ts:150–158`; `rules.ts:164`).
   - READ, `NVDAClient.js` `#processQueue`: a capture's speech events are joined with ". " into one log entry. Decision 7 makes one NVDA capture per window, so every NVDA window is one entry.
   - L3 faults only when two adjacent entries each hold the message. EXECUTED: `L3(["Copied. Copied"], "Copied")` → `[]`; `L3(["Copied", "Copied"], "Copied")` → L3.
   - So no double reading under NVDA can fail: error-summary, sign-in, sign-up, settings, toast, pagination, search-field, app-shell and code-block all apply L3. Patch 7's two NVDA entries in `expected.json` cannot fault. Nor can `022`'s fallback, the `double-read` set, whose patch 7b also needs L3. `022` decision 15's step 4 then calls it a finding to fix.
   - The specification's advance statement names only VoiceOver's risk. Constitution §4.4: a rule that cannot fail proves nothing.
   - Fix: L3 also faults when one phrase holds the message whole twice, at two places that do not overlap (normalised). Add unit cases, seen failing first: NVDA's joined "Copied. Copied", and a message that holds a ". " of its own (toast S3's). Restate decision 7's advance statement to cover the NVDA pairs, and keep patch 7's NVDA expectations.

3. **Medium: "moved" and "the stall" count the title, the description and the trigger-named texts, so a reader that never walked can pass** (decision 1, steps 2 and 4; `rules.ts:294–313`).
   - EXECUTED, scratch O2 cases with the test file's overlays:
     - sheet: `open` = "Navigation, dialog, Where to go next.", "list, with 4 items, link, Overview"; ten "Open navigation button" → **pass**. "Overview" gets in from the `open` window. "Navigation", the title, inside "Open navigation", meets "moved" and the stall.
     - alert dialog: `open` = title, "Cancel button"; ten "Cancel, button, Delete pluto-sandbox?, alert dialog" → **pass**. The reader never moved, but its phrase carries the title.
     - alert dialog: `open` = title, "Cancel button"; ten "Delete project, button" → **pass**. This one cannot be told from *the memo*'s NVDA walk.
   - The specification says the `open` window always holds the focused element once focus lands inside. Criterion 1's guards leave it out, so none of them catches these.
   - The code follows decision 1 as written; the gap is in the decision.
   - Fix (decision 1 and criterion 1): "moved" counts the inside texts and an overlay text equal, normalised, to the trigger's name (the trigger-named action), and nothing else: not the title, not the description, not a text the trigger's name only contains. INFERRED: *the memo*'s four walks still pass (Cancel; "Delete project"; Components; "Delete project"), and the first two cases above return X0. For the third, the trigger-named action alone: after the walk, one `previous()` must speak an inside text. From the action it reaches Cancel; from the real trigger it reaches the page. Add all three cases to criterion 1 as guards that return X0, the third with that step's phrase.

4. **Medium: the VoiceOver join compares whole log entries, so a stale repeat survives when the action capture held two phrases** (decision 7; `rules.ts:126–134`; the build's deviation 6).
   - READ, `VoiceOverClient.js` `#pollForSpokenPhrases`: one entry per capture, its phrases joined with ". ". The skip of a stale phrase compares VoiceOver's last phrase with the previous *entry*. When that entry joins two phrases, they never match, and the stale phrase is logged at once.
   - EXECUTED: `joinCaptures(["Save, button. Success: Project saved."], ["Success: Project saved."])` keeps both, and L3 faults. `joinCaptures(["Page 6 of 12"], ["Page 6 of 12. You are currently on a button."])` keeps both, and L3 faults.
   - *The memo*'s P1 and toast S1 logs have a one-phrase action entry, so those two are fixed as seen. The decision says "phrase"; the code compares entries.
   - Fix: at ". " boundaries, drop the longest leading part of the wait entry that equals, normalised, a trailing part of the action entry. Add both cases above to criterion 1, seen failing first.

5. **Low: the fixture's new logic has no check that can fail before CI** (`fixtures.ts`).
   - EXECUTED: with `fixtures.ts` at `c5cdd65`, the unit files that touch the suite pass, 101 of 101.
   - The dry run returns before the cover, uses the two-capture branch, and never runs `browseMode()` or `itemText()`. So the cover's wiring, the captures by reader, the join's wiring, the item text and the browse-mode step are first exercised on a runner. Findings 1, 2 and 4 would show in such a test.
   - Fix: a unit test of `Sr` with a fake reader that returns guidepup's log shapes (one joined entry per capture). Run it as `nvda` and as `voiceover`; this needs the reader passed in, not read once at module load. Check:
     - one capture under NVDA;
     - the join under VoiceOver;
     - item text under VoiceOver only;
     - `browseMode()`'s second press, and its X0 on silence (finding 1);
     - `open()`'s two X0s through `judge()`.

6. **Low: in a real run, an overlay closed before the walk gives a misleading X0** (`fixtures.ts`, `steps()`).
   - READ: "the overlay is still open when the walk begins" is a DOM fact, judged in a dry run only. In CI a closed overlay leaves no texts, and O2 says "the overlay has no inside text to prove the reader got in".
   - Fix: when `read.open` is false outside a dry run, record X0 "the overlay closed before the walk" through `judge()`.

7. **Low: the trigger-name exclusion matches characters, not words** (`rules.ts:245`).
   - READ: "Name" is inside "Rename project", so the dialog's focused field is never an inside text. It is harmless today: the dialog gets in through Cancel, Save or Close.
   - Fix: compare on word boundaries, or say in decision 1 that the match is by characters.

8. **Low: S6's fact holds when the success toast never appeared** (`toast.sr.ts`, S6).
   - READ: `first().waitFor({ state: "detached" })` on a locator that matches nothing resolves at once. The builder's probe saw one match, so S6 is right today.
   - Fix: record that the success toast was attached after the raise, then wait for it to detach.

**Checked, not findings.**
- The cover sits last in `<body>`. EXECUTED: the helper's Tab still reaches the first tab stop in the engines run here.
- The chart's per-file settings bind that file alone.
- Shard 1 holds the chart test.
- `pluto-allowed.json`'s count of 17 passes `rename.test.ts`.
- `022`'s pointer line leaves its table as the record.

## Constitution checks

- §4.1 source, not a package; §4.3 tokens; §4.5, §4.6 pins and dependencies: met. Only test code, fixtures and the workflow change. No dependency is added; guidepup stays at 0.40.0 and 0.21.0.
- §4.4 accessible by default, and proven: **at risk.** Finding 2 leaves L3 unable to fail under NVDA. Finding 1 would turn NVDA's O2 rows into set-up errors. Finding 3 lets a reader that never walked pass O2.
- §5 the pipeline: research, spec, review and tests exist. Each new check was seen failing first (EXECUTED for criteria 1 and 3). The scorecard is re-run after landing, so it has no movement to cite yet.
- §6 never: nothing committed or pushed. No prior art copied. No item changes.

## Verdict

**Does not land yet.** Findings 1 and 2 (High) stand.
- Decision 2's read of NVDA's mode cannot work with NVDA's sound cues.
- Decision 7's one NVDA capture blinds L3 under NVDA.

Both are faults in the specification as much as in the build. The design lead amends decisions 1, 2 and 7 and criterion 1 first; the builder then fixes findings 1 to 4. Findings 5 to 8 are small and can go in the same pass.

That was the verdict on the first build. The verdict after the rebuild is at the end of the Disposition: **lands**.

## Disposition

The specification was amended (passages marked *amended after the change review*, and the boundary ruling of 2026-11-16 in decision 1, step 4). The change was rebuilt. This re-check reads the amended decisions 1, 2 and 7, criterion 1, the rebuilt diff and the builders' notes ("Rebuilt after the change review", "The boundary ruling, built").

**State.** The rebuilt worktree adds two untracked files: `tests/sr/sr.ts` and `tests/unit/sr-harness.test.ts`.
- Before and after this re-check:
  - `git diff | sha256sum` → `e048a14f…1066c`;
  - the five untracked files other than this one → `dc0d1cdc…1e84`.
- Every probe edit was copied to the scratchpad first and copied back. `sha256sum -c` passed for `sr.ts` and `rules.ts`.
- Scratch tests and scripts lived in the scratchpad and are deleted.

**Re-ran on the rebuild.** EXECUTED unless marked.

| Check | Result |
|---|---|
| The six named unit files | 143 pass, 0 fail, 792 expects |
| `sr-harness.test.ts` with `rename.test.ts` | 19 pass |
| `bun test ./tests/unit` | 1904 pass, 2 skip, 0 fail, 68 files |
| `bun run check` | 2433 files, 0 errors, 0 warnings |
| `bun run lint` | passes |
| Dry run, `chromium` | 87 passed |
| Dry run, `webkit` | 87 passed |
| Cover e2e, `chromium-light` and `webkit-light` | 4 passed |

**The tests are live.** Each fix was turned off by one edit, its tests run, and the edit restored.

| Fix turned off | What failed |
|---|---|
| The X0 when the toggle is silent | `sr-harness` 1 of 13: "NVDA says neither" |
| The still-open X0 | `sr-harness` 1 of 13 |
| L3 within one entry | `sr-rules` 2 of 56 |
| The `previous()` step (the trigger's name alone counts as the stall) | `sr-rules` 3: the change review's sheet guard, the trigger-phrase guard and the boundary ruling's sheet guard |

The builders' first-build counts are READ, not re-run: 8 of 54 failing, and the harness 10 of 13 under each reader. The first build is gone. But this review's own earlier run showed the three sequences passing on it, which agrees.

**The three sequences.** All three now give X0, with this build's `O2`:
1. The sheet's whole `open` window with its focused link, then ten "Open navigation button" → X0 at the `previous()` step. It is X0 both with no `back` and with `back` = "Keyboard, heading level 2".
2. The alert dialog's ten "Delete project, button" → X0 at the `previous()` step, with and without that `back`.
3. Ten "Cancel, button, Delete pluto-sandbox?, alert dialog" → X0 at "moved".

*The memo*'s walks still pass:
- NVDA's alert-dialog walk, with `back` = "button, Cancel";
- VoiceOver's alert-dialog walk, on its boundary phrase.

A DOM probe of the eight pages read what precedes each trigger: "Keyboard" on the example pages, "Dark theme" in app-shell, "See the source" in the two bars. None holds an inside text. So `previous()` from the real trigger cannot pass the stall on today's pages. The delete confirm was not probed (INFERRED, same shape).

**Findings 1 to 8.**

1. **Closed.**
   - READ: `fixtures.ts` starts NVDA alone with `settings: { virtualBuffers: { passThroughAudioIndication: false } }`. guidepup's `NVDA.start()` merges `settings` into the session's `nvda.ini` through `setConfig`.
   - `browseMode()` presses again on "focus mode", and records X0 through `judge()` if neither mode is heard. The harness proves all three outcomes.
   - Whether NVDA speaks the mode on a runner is criterion 6's to show. A residue is finding 10.
2. **Closed.**
   - EXECUTED: `L3(["Copied. Copied"], "Copied")` → L3. `L3(["Copied. Code block. Copied"], "Copied")` → L3.
   - The check matches characters, and accepts any "." between two readings. So "Copied, button. Copied" also faults, as two entries did before. That is the rule's old meaning, not a new risk.
3. **Closed**, by the three sequences above and the `previous()` step.
4. **Closed.**
   - EXECUTED: the two-part action entry drops the stale "Success: Project saved.".
   - "Page 6 of 12" followed by a hint keeps only the hint.
   - A toast-S3-like run of parts drops only the repeated part.
5. **Closed.**
   - `Sr` takes its reader and dry mode as `SrOptions`.
   - `sr-harness.test.ts` drives it as NVDA and as VoiceOver: the cover's X0s, captures by reader, item text, browse mode, the still-open X0 and the `previous()` step.
   - The CI `checks` job:
     - it runs `bun run test:unit`, `check`, `lint` and `lint-literals.ts`, with `CI` set and no `SR_READER`;
     - `sr.ts` imports neither `reader.ts` nor `fixtures.ts`, so nothing throws at load;
     - EXECUTED, `env -u SR_READER CI=true bun test` of `sr-harness`, `sr-rules`, `mutations` and `sr-static` → 101 pass;
     - `lint-literals.ts` reads registry items only;
     - so the move adds 13 unit tests and two type-checked files, and changes nothing else in that job.
   - `mutations.test.ts` still finds its two strings in `fixtures.ts`.
6. **Closed.** In a real run, `steps()` records "the overlay closed before the walk" as X0 through `judge()`. The harness proves it.
7. **Closed.**
   - `insideTexts` pads the trigger's name with spaces and matches whole words.
   - "Name" is an inside text for "Rename project" (unit case).
   - The dialog's walk now also gets in through its focused field. It still needs a step other than "Name" to count as moved.
8. **Closed.** S6 records "the success toast appeared on the raise" inside the raise action, then waits for it to go.

**New findings from the rebuild.** No High and no Medium finding.

9. **Low: the boundary rule takes any phrase that begins "end of" and holds the overlay's name, so a role word in a title makes landmarks count** (`rules.ts`, `isBoundary`).
   - EXECUTED, sheet (title "Navigation"):
     - `open` with the focused link, then "Open navigation button", "end of Site navigation" → **pass**;
     - with nine "end of navigation" → **pass**.
   - VoiceOver ends every navigation landmark with its role word, so a cursor left on the trigger meets the first landmark boundary behind it.
   - Not reachable today. A DOM probe of the eight pages found no visible container outside the overlay whose role or name holds the overlay's title. The trigger's own containers are an unnamed `main` or `banner`, and VoiceOver's "end of banner" gives X0 (EXECUTED, app-shell).
   - So this guards the next overlay, not today's.
   - Fix: require the normalised phrase to begin "end of <name>" and to hold "dialog", VoiceOver's word for the overlay ("web dialog", "alert dialog"). *The memo*'s phrase meets both. Add the two sequences above as X0 guards.
10. **Low: the second NVDA+Space is not read back** (`sr.ts`, `browseMode()`).
    - After "focus mode", the second press's reply is recorded but not judged. A press that missed would leave the walk in focus mode, and the X0 would come later, at "moved", under a vaguer message.
    - Fix: record X0 unless the second reply says "browse mode". Add a harness case.
11. **Low: `steps()` decides on the `previous()` step with the DOM's title, while O2 judges with the test's name** (`sr.ts:244`, `needsBack(phrases, this.overlay, this.overlay.title)`).
    - The two are equal on all eight pages (the build's deviation 4). Where they differ, `steps()` can skip a step that O2 then asks for, and O2 returns X0.
    - Fix: give `steps()` the overlay's name, as O2 has it, and pass that to `needsBack`.
12. **Low: three write-ins in the specification.**
    - The Scope "In" list does not name `tests/sr/sr.ts` or `tests/unit/sr-harness.test.ts`, though criterion 1 asks for the harness.
    - The inside-texts paragraph of decision 1 still ends "It counts for 'moved' and 'the stall'", which the amended steps 2 and 4 now limit to the trigger's name.
    - Decision 5's L3 line gives only the adjacent-phrase case; decision 7 adds the in-entry case.
    - Fix: amend the three lines.

**Criteria after the rebuild.**
- Criteria 1 to 5 are met here (EXECUTED above). Firefox's half of criterion 3 waits for CI's matrix.
- Criteria 6 to 8 wait for CI, as before. Findings 1 to 3 no longer put them at risk.
- The scorecard is re-run after landing, and its movement cited then.

**Verdict after the rebuild: lands.**
- Findings 1 to 8 are closed.
- Findings 9 to 12 are Low and can follow as a small change in lane E, or be folded in before the commit.
- Nothing is changed outside the Scope, apart from the two new files finding 12 names. Nothing is under `src/` or `static/`.

**Third block: findings 9 to 12, fixed by the coordinator (2026-11-16).** This reviewer did not write those fixes.

- **State.** Before and after:
  - `git diff | sha256sum` → `bba45e8e…fb23`;
  - the five untracked files other than this one → `ab4ae36d…da8a`.
  - Each probe edit was restored, checked by `sha256sum -c`, and the scratch files are deleted.
- **9. Closed.** `isBoundary` now needs the normalised phrase to begin "end of <name or DOM title>" and to hold "dialog".
  - EXECUTED, scratch O2 cases that now give X0:
    - "Open navigation button", "end of Site navigation";
    - "Open navigation button", then nine "end of navigation";
    - "end of main";
    - the title phrase without "end of".
  - EXECUTED, cases that still pass:
    - *the memo*'s VoiceOver alert-dialog walk, ending "end of Delete pluto-sandbox? … alert dialog";
    - a sheet walk ending "end of Navigation, web dialog";
    - *the memo*'s NVDA sheet walk, which ends on "button, Close", an inside text.
  - Without the "dialog" test, the new guard fails, 1 of 57.
  - What still passes: "end of navigation, dialog" or "end of Navigation drawer, web dialog" spoken from outside. Only another dialog, whose name begins with the title, could say that. No page has one. Not a finding.
- **10. Closed.** After "focus mode", a second reply without "browse mode" is an X0 through `judge()`. With that branch turned off, the new harness test fails, 1 of 15.
- **11. Closed.** `steps()` takes `title`, and decides the `previous()` step with it.
  - READ: each of the eight O2 files passes the same constant it gives O2 (`TITLE`, `NAME` or `CONFIRM`).
  - With `this.overlay.title` put back, the new harness test fails, 1 of 15.
- **12. Closed.** READ, the specification:
  - Scope names `sr.ts` and `sr-harness.test.ts`.
  - Decision 1's inside-texts paragraph now limits "moved" and the stall to the trigger's name, with the boundary as the one exception for the title.
  - Decision 5's L3 line has the within-entry case.
  - Decision 2 states findings 10 and 11.
- **Gate.** EXECUTED.

| Check | Result |
|---|---|
| The eight unit files (the six named, harness, rename) | 165 pass, 0 fail |
| `sr-harness` with `CI=true` and no `SR_READER` | 15 pass |
| `bun run check` | 2433 files, 0 errors |
| `bun run lint` | passes |
| `bun test ./tests/unit` | 1906 pass, 2 skip, 1 fail: `highlight-session.test.ts`'s streaming budget, under the dry runs' load; alone it passes 10 of 10 |
| Dry run, `chromium` | 87 passed |
| Dry run, `webkit` | 87 passed |
| Cover e2e | 4 passed |

- No new finding.

**Closing verdict: lands.** Findings 1 to 12 are closed. Criteria 1 to 5 are met here. Criteria 6 to 8, and Firefox's half of criterion 3, wait for CI and the landing notes.

