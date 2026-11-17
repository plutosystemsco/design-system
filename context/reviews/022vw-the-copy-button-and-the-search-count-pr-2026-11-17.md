# Review of 022v and 022w — the copy button's one "Copied", and the search count that stays

- **Date:** 2026-11-17
- **Status:** in review
- **Reviewer:** a reviewer; not the author
- **Reviewed:** the uncommitted diff in the worktree `lane-i-run5`, on `71cb067` (`git diff` and the two untracked specifications): [022v](../specifications/022v-code-blocks-copied-is-said-once.md) and [022w](../specifications/022w-the-search-fields-count-clears-only-on-a-keystroke.md), with [the fifth matrix run](../research/2026-11-17-the-fifth-matrix-run.md) §3.3, §3.5 and §7, `004` decision 8 and criteria 4 and 6, and `022r`.
- **Re-ran:** each item on a fresh `bun run build`, served with `E2E_PREBUILT=1` on a port of its own (`E2E_PORT=4391`), Playwright's browsers from `/opt/pw-browsers`.
  - **Before any probe**, the SHA-256 of `git diff` plus the untracked files' bytes was `69a988ed…`, and of `git status --porcelain` `8e60889a…`. A rebuild of the builder's tree left both unchanged, so `static/r` and `static/v0.13.0/r` are this source's.
  - `code.spec.ts` and `search-field.spec.ts`, `chromium-light` and `webkit-light` → **110 passed**.
  - `keyboard.spec.ts`, the code-block fixture test and the copy tests, both projects → 5 passed, **1 failed**: the copy test in WebKit, at `pauseAt` ("Cannot fast-forward to the past"). See finding 1.
  - **Seen failing, 022v:** `code-block-copy-button.svelte` put back to `71cb067`, then a rebuild. C4 and the keyboard copy test failed in both projects, **4 of 4**, at `toHaveAccessibleName`: Expected "Copy code", Received "Copied".
  - **Seen failing, 022w:** the copy button restored, `search-field.svelte` put back to `71cb067`, then a rebuild. 29b failed in both projects at the 5,000 ms hold (line 389): Expected "3 results", Received "". The other 22 passed.
  - **Mutation, 022w:** the fixed item without `said = ""` in `restart()`, then a rebuild. 29b failed in both projects at "the status is empty after i" (line 398: Expected "", Received "3 results"), and 29 at its `["", "3 results"]` write log. So 29b fails without the keystroke clear.
  - **Probes**, from a scratch spec in `tests/e2e/`, deleted after: the write log's first entry; the status after Clear and after Escape; the copy tests' clock pattern under load; a one-line fix for finding 2. See findings 1, 2 and 8.
  - Every file was then restored from a tar taken before the first change, and the site rebuilt. The two SHA-256s match the ones above (`69a988ed…`, `8e60889a…`).
  - The dry speech run, `SR_DRY=1`, `chromium` and `webkit`, `code-block.sr.ts` and `search-field.sr.ts` → **10 of 10 passed**. Dry mode drives the steps and judges no speech.
  - `bun run cost --only code-block,search-field --sizes-only` → "every figure is fresh". The report's hashes are this source's. To measure the sizes rather than trust the hashes, `71cb067`'s `report.json` was put in place and the same command run three times. See "Ledger files". `report.json` was restored byte for byte (`817df141…` before and after).
  - `bun run check` → 0 errors, 0 warnings. `bun run lint` → clean. `bun scripts/lint-literals.ts` → 0 literals in registry item files, 1 allowance (`liquid-glass`).
  - `bun test ./tests/unit`, twice → 1,912 passed, 2 skipped, 1 failed; then 2 failed. Every failure was a highlighter timing budget ("the 18 specimens … 50 ms or less warm", "the streaming budget … 4 ms or less per chunk"). Alone, `highlight.test.ts` failed 1 of 3 on this tree and 0 of 3 on `71cb067`'s tree (a `git archive` copy); `highlight-session.test.ts` failed 3 of 3 here and 1 of 3 there. The machine's load average was 5 to 22. Neither file, nor anything they import, is in the diff (READ). So the failures are the load, not these changes (INFERRED).
  - All eleven mutation patches still apply (`git apply --check`), patch 7 among them.
  - Not run: Firefox (not installed), `webkit-dark`, any reader.

## Acceptance criteria against evidence

### 022v

1. "The button's `aria-label` is always "Copy code"" — met. READ: `aria-label="Copy code"`, a literal. An app's own `aria-label` still wins, through `{...restProps}` after it, as before.
2. "The status still says "Copied" for two seconds, or "Could not copy"" — met. READ: the `Status` line is unchanged. EXECUTED: C4's 2,000 ms of the clock empties it.
3. "The check icon still shows for two seconds, and `data-copied` is still set" — met. READ: `{#if copied}<Check …/>` is unchanged. EXECUTED: `data-copied="true"` after Enter, gone after 2 s.
4. "The tests read the name while time stands still" — met, but flaky. See finding 1.
5. "The page and the markup comment say the same" — met. READ. See finding 4 for one clause.
6. "`004`'s three sentences are named with their new form" — met. READ: decision 8, criterion 4 and C4 are `004`'s only sentences that say the name becomes "Copied" (lines 226, 367 and 373). Its other mentions (lines 147, 228 and 601) say the status speaks, which still holds.
7. "The changelog says the button keeps its name" — met. READ, and EXECUTED: `registry.test.ts` passes.
8. "The speech test is unchanged" — met. READ: `code-block.sr.ts` reads the outcome from the first status, which is the item's one source of "Copied" now. EXECUTED: patch 7 still applies; it adds a second status, so L3 still has a double to find.

### 022w

1. "`SPEECH_MS` and its timer go" — met. READ: no `hush`, no `SPEECH_MS`; `onDestroy` clears the one timer left.
2. "A count stays until the next keystroke that edits the field, which empties it at once" — met. READ: `restart()` runs on each `input` event and sets `said = ""`. EXECUTED: 29b, and the mutation above.
3. "Clear and Escape leave the status alone" — met as written. EXECUTED: a stale count stays. See finding 2.
4. "No interface change" — met. READ: `SPEECH_MS` was module-private; no prop, string, slot or class changes.
5. "The changelog's `022r` sentence is rewritten, not added to" — met. READ, and EXECUTED: `registry.test.ts` passes.
6. "29b fails on `022r`'s item and passes with the fix" — met. EXECUTED: both, in both projects.

### Ledger files

- `report.json` — **consistent for the items.** EXECUTED, measured from `71cb067`'s report:
  - `code-block`: JS 25,573 B, CSS 2,444, brotli 22,402 and 2,134. The builder's figures, exactly. JS was 25,587: −14 B.
  - `search-field`: JS 13,392 B, CSS 1,700, brotli 11,848 and 1,478. The builder's figures, exactly. JS was 13,416: −24 B.
  - **The catalogue is not deterministic.** Three runs on the same source gave JS 379,357, 379,373 and 379,366, and CSS 16,837, 16,842 and 16,838. The builder's 379,373 and 16,834 are within that spread. So the catalogue's CSS "16,843 → 16,834" is noise: no class changed. See finding 6.
  - Every figure is under its budget: the cost gate exits 0.
- `static/r` and `static/v0.13.0/r` — consistent. EXECUTED: rebuilds left `git diff` unchanged. Only `code-block.json` and `search-field.json` change, and `chat` and `stage-card` name `code-block` as a dependency, so they need no change (READ).
- **The thumbnails manifest** — consistent. EXECUTED, by a scratch script over `scripts/site/thumbnail-hash.ts`:
  - 82 entries. Every current hash equals a fresh `thumbnailHash`, so none is stale.
  - 70 changed. Each changed item has a changed file among its inputs; each kept item has none.
  - 68 changed through the copy button alone. `src/lib/site/page/component.svelte`, the component page template, imports it through `command.svelte` and `snippet.svelte`. Every example's hash walks that template. `code-block` also changed through its own page, and `search-field` through its item.
  - The 12 kept are the items whose stage is a view (`app-shell`, `settings`, `sign-in` and nine more). A view's hash walks its group's layout, not `component.svelte`.
  - No `.webp` is in the diff. The copy button renders the same: only its label is static now. So no picture changed (EXECUTED for the files; INFERRED for the pixels, from the diff).
  - The site's layout does not reach the copy button: `localGraph` of `src/routes/(site)/+layout.svelte` does not hold it (EXECUTED). See finding 5.
- `tests/fault-ledger.ts` — untouched, and rightly. READ: no line names the copy tests, 29 or 29b.

## The questions, answered

**1. Do the tests fail on the old code?** Yes, both. EXECUTED, above. One item file was reverted at a time, with a rebuild each time, and the diff hashes match afterwards.

**2a. Does the static name contradict `004` or the page?** No longer. `004` decision 8, criterion 4 and C4 said the name becomes "Copied". 022v supersedes them by name and leaves `004` unedited, as `022r` did for `027` (READ). The page's accessibility list now says the same as the item. The keyboard example's description ("sets the status to “Copied”") and `stage-card`'s page ("named “Copy code”") were true before and still are (READ). No other page, example or block says the name changes (READ, by search).

**2b. Is it an interface change?** By the changelog's own usage, no, and the changelog says enough.
- What an app passes is unchanged: no prop, slot, export, class or string. The changelog's header reserves **interface change** for those, as in the 0.13.0 bullets for `kuiper-theme`, `theme` and the context keys (READ).
- What changes is behaviour an app can observe. The changelog treats that as `dropdown-menu`'s Escape and `code-editor`'s Enter are treated: a bold headline, what changed, and what an app does instead (READ). 022v's bullet follows that form. It names the one thing that breaks, a test of an app's own that looks for a button named "Copied", and what to do: read the status's text.
- The upgrade guide carries only the rename's steps, not these behaviour notes (READ), so it needs no section.
- A static name is also better for voice control: "click Copy code" now works during the two seconds too (INFERRED).

**2c. Does a sighted keyboard user still get feedback, and a screen-reader user one "Copied"?**
- Sighted: yes. The check replaces the copy icon for two seconds, and focus stays on the button (READ; `data-copied` EXECUTED).
- Screen reader: the item now has one source of "Copied", the status (READ). That a reader says it once is INFERRED. NVDA's "Copied. Copied. Copy code" was the name change, then the status, then the name changing back (the memo §3.3); none of those name changes is left. The next `matrix` run's code-block test shows it in every pair.
- A second Enter within the two seconds says nothing: the status already holds "Copied". It said nothing before either, since the name was already "Copied" too (READ). See finding 9.

**2d. The page's text.** Accurate about the item. One clause states a reader's behaviour as fact. See finding 4.

**3a. With no timed clear, can a count be skipped?** No path found that writes a count without an empty status before it.
- A count is written only when `paused` and not `spoken`. Only `restart()` resets `spoken`, and it empties the status first (READ). So every count follows at least the 750 ms pause of empty status (EXECUTED: 29b's loop, and its whole write log).
- The same count twice, and quick typing ("gn", 200 ms, "e"): one empty write, then one count, after the pause (EXECUTED: 29b).
- A paste, an undo or a composition step fires `input`, so it restarts like a letter (READ). A key that does not edit, such as an arrow, leaves the count, which is still true.
- On the reader's side, a count now stays until the person types again. A reader that comes to the region late finds it, which `022r`'s 1 s clear did not allow (INFERRED, with the memo §3.5).

**3b. Does S1 still announce?** As far as anything here can show, yes. The first count follows the empty status the page hydrates with, and 022w changes only what happens after a count (READ). S1 passed under VoiceOver with Chromium in run 4, before `022r` added the clear (READ, the memo §3.5). EXECUTED: the dry run drives S1 to its end in both engines. No reader ran.

**3c. After Clear or Escape?** The count stays in the hidden status. EXECUTED: after "des", then Clear, the status says "3 results" while the list shows all 16 projects; after Escape, the same, with the field empty. A screen reader in browse mode that reads past the field meets a count for a query that is gone. It is not spoken, since nothing is written. See finding 2.

**3d. Is 29b sound?** Yes.
- It fails on `022r`'s item, at the hold, and without the keystroke clear, at the empty status after "i" (EXECUTED, both engines).
- Its whole-log equality, `"", "3 results", "", "3 results", "", "1 result"`, pins every write. A timed clear shorter than 5 s, an extra count or a missing empty write each breaks it (READ).
- The first count's 750 ms check is vacuous: its empty write is the page's own, about 60 s earlier on the test's clock. It is true, not a fault. See finding 8.

**4. The 70 thumbnail hashes.** Expected, and fresh; no picture changed. See "Ledger files". The cause is the component page template, not the site's layout (finding 5).

**5. The cost figures.** The items' figures are the builder's, exactly; the catalogue's are within its noise. See "Ledger files" and finding 6.

**6. The gate.** Green, except finding 1's flake and the highlighter's timing budgets, which fail on the unchanged tree too. See "Re-ran".

## Findings, most severe first

1. **Medium (022v). The two restated copy tests are flaky** (`tests/e2e/code.spec.ts:481`, `tests/e2e/keyboard.spec.ts:1147`). Each installs a running clock, reads `Date.now()` in the page, and then pauses 100 ms past it. If more than 100 ms pass between the read and the pause, `pauseAt` throws "Cannot fast-forward to the past".
   - EXECUTED: the keyboard copy test failed in WebKit in the gate run (1 of 2), and 1 of 30 in a repeat. Both tests, both projects, `--repeat-each=25`, 4 workers: **3 of 100 failed**, each at `pauseAt` (C4 in WebKit, the keyboard test in Chromium and in WebKit). The machine's load average was about 22.
   - In CI a flaky browser test fails the run (`playwright.config.ts`, `failOnFlakyTests`; `022` decision 18). So the change's own check would fail release runs now and then.
   - The race also has a second edge: a stall of 2 s between Enter and the pause lets the reset pass before the name is read (INFERRED).
   - **Fix:** stop the clock before Enter, at a fixed time far ahead, as search-field's `clocked()` does. Then run the reset on the paused clock:
     ```ts
     await page.clock.install({ time: T0 });
     await open(page, PAGE);
     // … the name, the size and the code, as now …
     await page.clock.pauseAt(new Date(T0.getTime() + 600_000));
     await button.focus();
     await page.keyboard.press("Enter");
     await expect(block.getByRole("status")).toHaveText("Copied");
     await expect(button).toHaveAttribute("data-copied", "true");
     await expect(button).toHaveAccessibleName("Copy code");
     await page.clock.runFor(1999);
     await expect(button).toHaveAttribute("data-copied", "true");
     await page.clock.runFor(1);
     await expect(button).not.toHaveAttribute("data-copied", /.*/);
     ```
   - EXECUTED, as a scratch test on the keyboard fixture, the same page C4 opens: **100 of 100 passed**, both projects, 4 workers, at the same load. On the old item it failed in both projects at the name (Expected "Copy code", Received "Copied"). The clipboard write resolves on a paused clock, in both engines. It also pins the reset to 2,000 ms exactly.
   - **Check:** both tests restated this way, seen failing on the old item again, then `--repeat-each=25` under load with no failure.

2. **Low (022w). After Clear or Escape, a count for a query that is gone stays in the hidden status** (`search-field.svelte`, `clear()`). EXECUTED: "3 results" beside an empty field and 16 projects, after Clear and after Escape, 10 s later. Under `022r` the 1 s clear emptied it; before `022r` it stayed too. So 022w brings back what `022r` had incidentally fixed.
   - The harm is small: nothing is spoken. But a browse-mode reader that reads past the field hears a count that contradicts the list.
   - The changelog promises the count is "for what is typed now". After Clear, nothing is typed.
   - The specification records it under "Not settled" as a limit. Constitution §4.4 asks for a finding to fix, never a limit to record.
   - **Fix, recommended, in this change:** `said = "";` in `clear()`, beside `spoken = true`. Clear and Escape are edits of the field, so emptying there keeps the ruling's rule: the count stays until the field changes. An empty write says nothing, which `022r` already allows (test 29 filters empty writes; 022rs, question 2c).
     - EXECUTED, as a scratch build: the status is "" after Clear and after Escape, in both engines. `search-field.spec.ts` passed 24 of 24 in both projects, 29 and 29b included.
     - **Check, seen failing first:** in test 29, `await expect(status(page)).toHaveText("")` after Clear's 2,000 ms, and again after Escape's. Both fail on this build (EXECUTED by the probe: "3 results").
   - **Fix, alternative:** leave the item, and replace the "Not settled" line with a row in `context/roadmap.md` for a lane-I small change.
   - The same holds for a count that changes without a keystroke (an app that refines `results` for the same query): the first count stays, since `spoken` blocks a second (READ). That was so before `022r` too. One line in "Not settled" would say it.

3. **Low (022v). The tokens page's copy buttons still say "Copied" twice, and a test pins it** (`src/lib/site/foundations/copy-name.svelte:45` and `:52`; `tests/e2e/keyboard.spec.ts:1620` asserts `aria-label` "Copied"). The specification names it under "Not settled", as "a small change in lane S if wanted". It is the same double read, on a public page, so it is wanted (constitution §4.4).
   - **Fix:** add a row to `context/roadmap.md` for a lane-S small change: the same fix, and 017 criterion 4's test restated on a paused clock, as finding 1's. Point at the row from "Not settled".

4. **Low (022v). The page and the changelog state a reader's behaviour no reader has heard.** The page: "The name stays “Copy code”, so a screen reader says “Copied” once." The changelog: "so a screen reader says it once." Both are INFERRED (the specification's own "Not settled"). This is 022rs's finding 5 again.
   - **Fix:** say what the item does. Page: "The name stays “Copy code”, so “Copied” comes from the status alone." Changelog: "and the status beside it says "Copied", the one place it is said." The markup comment can keep its wording: it is the intent, not a claim about a reader. Or keep both, and confirm them at the next `matrix` run.

5. **Low (022v). The thumbnails' reason names the wrong file** (the specification's landing notes: "An example's hash reads the site's component page and layout, which import the copy button"). EXECUTED: `src/routes/(site)/+layout.svelte`'s import graph does not reach the copy button. `src/lib/site/page/component.svelte` does, through `command.svelte` and `snippet.svelte`. The count, 70, and the 12 views kept, are right.
   - **Fix:** "An example's hash walks the component page template, `component.svelte`, which imports the copy button through `command.svelte` and `snippet.svelte`."

6. **Low (022v, 022w). The catalogue's figures are stated as this change's movement, but are within its noise** (both landing notes: "JS 379,404 → 379,373, CSS 16,843 → 16,834"). EXECUTED: three runs on one source, JS 379,357 to 379,373 and CSS 16,837 to 16,842. No class changed, so the CSS figure cannot have moved by these changes. The items' own figures are exact.
   - **Fix:** in `022v`'s cost line, say the catalogue was rewritten and moves by up to about 16 B of JS and 8 B of CSS between runs on one source. The items' figures are the change's.

7. **Low (022w). The ruling is not in a landing note** (the specification's fix 1). AGENTS.md puts checkpoint rulings in the specification's landing notes. The design lead's ruling sits in "The fix", and "Not settled" says `022r`'s landing notes do not have it yet.
   - **Fix:** a landing-notes entry in 022w: who ruled, when, and what (drop the timed clear; keep the keystroke clear). Then the design lead adds the one-line pointer to `022r`'s landing notes, as the memo's §7 asks.

8. **Note (022w test). 29b's first gap is the page's own.** EXECUTED: the write log's first entry is the empty status at hydration, about 0.2 to 0.4 s after the clock's start; the first count comes 60 s later, once the test pauses the clock there. So the loop's "at least 750 ms" holds trivially for the first count. The other two are real gaps. It also holds only 5 s: a timed clear longer than that would pass. Neither is a fault. A comment saying so would help the next reader of 29b.

9. **Note (022v). A second copy within two seconds is silent.** READ: the status holds "Copied" while `copied` is true, and a second press keeps it. It was silent before as well (READ). Not a regression; not asked of this change. If wanted, the same lesson as `022r` applies: empty the status at the press, so the same word is a change.

## Constitution checks

- §4.1 source, not a package: met. READ.
- §4.3 tokens are the one source: met. No colour or size is added. EXECUTED: `lint-literals`.
- §4.4 accessible and proven in three engines: partly. Chromium and Linux WebKit were run; Firefox and `webkit-dark` were not, and both specifications defer them to the next `matrix` run. No reader has run either change; both name it. Findings 2 and 3 are recorded as limits where §4.4 asks for findings to fix.
- §4.5 and §4.6: met. No new dependency. READ.
- §5 the small-change track: both checks were seen failing first (EXECUTED), and the reviewer wrote neither change. Both stay small changes: 022v touches one item and its page, 022w one item. Finding 2's fix keeps 022w one. The scorecard is not re-run per change; both defer it to the batch's re-run when these land, as `022r` and `022s` did.
- §6 never: nothing was committed or pushed, and no prior art was copied. No installed app breaks silently: 022v's bullet names the one behaviour an app's test could rely on, and what to do instead. `search-field` is new in 0.13.0.

## Verdict

- **022v:** Does not land yet: finding 1 (Medium: its check is flaky, and CI fails on a flaky test). Findings 3, 4 and 5 should go in with it; finding 6 is a write-in.
- **022w:** Lands. Finding 2's one-line fix is recommended in this change, with its check seen failing first; if it is deferred, it becomes a roadmap row, not a limit. Finding 7 is a write-in; finding 8 a note.

## Disposition
