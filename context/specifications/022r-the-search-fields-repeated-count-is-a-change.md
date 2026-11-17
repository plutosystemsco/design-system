# 022r — The search field's repeated count is a change a reader can hear

- **Status:** built 2026-11-16; change-reviewed ([`../reviews/022rs-the-search-field-and-tag-list-speech-fixes-pr-2026-11-16.md`](../reviews/022rs-the-search-field-and-tag-list-speech-fixes-pr-2026-11-16.md): lands, its findings 3 and 6 written in). Lane I.
- **Date:** 2026-11-16
- **Author:** a lane-I builder
- **Kind:** small change (`context/README.md`: a fix with no interface change, no new token or dependency, in one item). No research memo of its own and no spec review. Its check is seen failing first, and the built change is reviewed by someone who did not write it (constitution §5).
- **Depends on:** `022`; `027` (batch A, whose `027b` is the search field); `022n`, built before it in lane I.
- **Found by:** the first speech run, S2, explained by [the first speech verdicts](../research/2026-11-16-the-first-speech-verdicts.md), §7 (Family F). The memo was untracked in the main checkout when this was written.

## The defect

`027`'s S2 promises that one more letter with the same count is spoken again: "des", then "i", gives "3 results" twice. No reader said it twice. VoiceOver spoke the typed letter; NVDA spoke nothing (READ, the memo).

`search-field.svelte` emptied the status and wrote the count again one animation frame later (READ, the item before this change, lines 88–94). `status.svelte` warns that one text set twice is not announced. The memo measured the empty state at about 1 ms (EXECUTED by the memo). Test 29 below measured it at 3 ms under Playwright's clock, in both engines (EXECUTED). That is too short for a reader to see a change (INFERRED, with the memo). The toast clears its announcer 1 s after each message (READ, `toast-queue.ts`, `SPEECH_MS`), and NVDA hears its repeat (READ, the memo: S4 passed in both NVDA pairs). But S4 raises "Save" twice, 3 s apart (READ, `026`'s S4 row). So that repeat came after about 2 s of empty status, not 1 s, and not 750 ms. And `026` calls its 1,000 ms a first guess a run will tune, not a measurement (READ, `026`, "Not settled").

## The fix

1. **The item.** A count stays in the status for 1,000 ms, then the status is emptied. That is the toast's `SPEECH_MS`, so the system's two announcers keep a message for the same time. It is a choice for consistency, not a measured time: `026` calls it a first guess. Typing again also empties the status at once, if it comes first. The one-frame empty write goes.
2. **Why both.** A clear on a timer alone leaves a hole. The next count comes at least 750 ms after the last one, since it needs a new keystroke and a whole pause (INFERRED, from the item: `restart()` sets `spoken = false`, and only the pause's timer sets `paused`). A letter typed within 250 ms of a count makes the next count land before the 1 s clear, and the old 1-frame gap comes back. Emptying at the keystroke closes that hole. The status is then empty for at least the whole pause, 750 ms, before every count. With no typing, the count stays the full second. So when typing is quick, as in S2, the gap a reader gets is set by the 750 ms pause (`SEARCH_FIELD_SETTLE_MS`), not by `SPEECH_MS`. `SPEECH_MS` only decides how long a lone count stays.
3. **No interface change.** `SPEECH_MS` is a private constant, not exported. No prop, string, slot or class changes. Clear and Escape leave the status alone; the timer empties it.
4. **`027`'s text it supersedes.** `027` is a landed record and is not edited. These sentences describe the item before this change; read them in their new form:
   - Decision 4, "To speak, the status is set to `""`, then, one frame later, to `results`. … the empty frame between is the fix it names." Now: "To speak, the status is set to `results`. It is emptied 1,000 ms later, or at the next keystroke if that comes first, so it is empty for at least the 750 ms pause before every count, and an unchanged count is a change."
   - Decision 4, "Clearing the field cancels the timer, and nothing is written." Now: "Clearing the field cancels the timer, and no count is written; a count already there is emptied when its second is up."
   - Criterion 29, third bullet, "Clear: the status is not written." Now: "Clear: no count is written." (Test 29 filters out the empty writes.)
   - The landing notes' mutation list, "no empty frame before the count: test 29 fails (the unchanged count is not written again)." Now: "no empty status before the count: tests 29 and 29b fail (the unchanged count is not written again)." The mutations in "After the fix" are this form.
5. **The changelog.** `search-field` is new in 0.13.0, so this is a sentence in its existing bullet: the spoken count is emptied a second later, or at the next keystroke, so one more letter with the same count is heard again.

## The check

- **New test 29b** in `tests/e2e/search-field.spec.ts`, on `filter`, with Playwright's clock and a `MutationObserver` logging each write with its time. It types "des" and waits for "3 results". Then it types "i" at once and waits for the same count. It asserts three things:
  - the status was emptied before the repeat, and stayed empty for at least 750 ms;
  - left alone, the repeat is still in the status at 999 ms;
  - the status is emptied at 1,000 ms.
- **Tests 29 and 29a are restated.** Their "nothing is written" now means "no count is written". The status's own empty writes say nothing, and they are this fix. The test 29 MutationObserver still sees `""`, then "3 results" again. This narrows `027`'s criterion 29 text "Clear: the status is not written" to "no count is written"; no assertion on a count is loosened.

## Landing notes

Built 2026-11-16 by a lane-I builder, in the worktree `lane-i-speech`, at `c5cdd65`. Not committed. Runs used `E2E_PREBUILT=1`, one worker, a rebuild after each source change.

### Seen failing first (EXECUTED)

- **29b, on the unchanged item:** failed in `chromium-light` and `webkit-light`, on "the status stays empty for the whole pause before the repeat" (Expected ≥ 750, Received 3). The other 29 tests passed (6 of 8).

### After the fix (EXECUTED)

- **Tests 29 and 29a as they stood** failed in both engines: the empty write at the keystroke, or the 1 s clear, was logged where they expected none. Restated as above, `search-field.spec.ts` passes: 24 of 24 in `chromium-light` and `webkit-light`.
- **Proven by mutation**, each on a rebuilt item, restored after:
  - without the clear at the keystroke, 29b fails in both engines ("3 results" written once: the repeat was not a change). Test 29 fails too.
  - without the 1 s clear, 29b fails in both engines at "the status is emptied" (Received "3 results").
- **The joint run**, the three touched specs (`search-field`, `tag`, `error-summary`) with `022s`, in `chromium-light` and `webkit-light`: **87 passed, 1 skipped** of 88. The skip is tag 40 in WebKit (Playwright's WebKit does not emulate forced colours), as before.
- **The dry screen-reader run** (`SR_DRY=1`, Chromium), `search-field.sr.ts`, `tag.sr.ts` and `error-summary.sr.ts`: 10 of 10 passed. Dry mode drives the steps and does not judge speech.
- **The cost:** `bun run cost --sizes-only`, run once for this change and `022s`, rewrote `search-field`: JS 13,417 → 13,416 B (brotli 11,912 → 11,844); CSS 1,700 unchanged (brotli 1,478). The catalogue, with `022s`: JS 379,344 → 379,379, CSS 16,795 → 16,873. Runtime figures kept: the run reported 12 runtime-stale, which the unit test only warns of (`025`'s ruling (b)). `search-field` is interactive, so its change review runs `bun run cost --only search-field`.
- `static/r/` and `static/v0.13.0/r/` were regenerated by the build (`search-field.json`). The thumbnails' manifest was rewritten with `--hash-only`; no picture changed.
- `bun run check`: 0 errors, 0 warnings. `bun run lint`: clean. `bun scripts/lint-literals.ts`: 0 literals in registry item files (1 allowance, `liquid-glass`, as before). Unit tests `registry`, `registry-comments`, `build-registry`, `cost` and `thumbnails`: 185 passed. The whole unit suite: 1,863 passed, 2 skipped, 0 failed.
- **The ledger:** no line names test 29 or 29b (READ, `tests/fault-ledger.ts` at `c5cdd65`). Not touched.
- **The scorecard** is not re-run for this change alone. It follows the batch's re-run when these land.

### After the change review (EXECUTED)

- **Finding 3:** "The defect" and fix 1 now say S4's repeat followed about 2 s of empty status, and that 1,000 ms is `026`'s first guess. Fix 2 says the 750 ms pause sets the gap when typing is quick. **Finding 6:** fix 4 names `027`'s four superseded sentences with their new form. No code changed for 022r.
- The runs after both specs' review fixes (`022s` changed its rule and its test), on one fresh build:
  - `search-field.spec.ts` and `tag.spec.ts`, `chromium-light` and `webkit-light`: **49 passed, 1 skipped** of 50. The skip is tag 40 in WebKit (forced colours not emulated), as before.
  - The dry screen-reader run (`SR_DRY=1`, Chromium), `search-field.sr.ts` and `tag.sr.ts`: 7 of 7 passed.
  - `bun run check`: 0 errors, 0 warnings. `bun run lint`: clean. `bun scripts/lint-literals.ts`: 0 literals, 1 allowance. `bun test ./tests/unit`: 1,863 passed, 2 skipped, 0 failed.
  - The build changed nothing in `static/r/` beyond the four item files already in the diff. `search-field`'s sizes did not move in the second cost run (JS 13,416, CSS 1,700).

### Not settled

- **No reader has heard a repeat after 750 ms of empty status.** The toast's NVDA repeat followed about 2 s. That 750 ms is enough is INFERRED; the next speech run's S2 shows it, in every pair. **If S2 still fails, the gap is what to tune, not `SPEECH_MS`:** for example, by holding the count back until the status has been empty for a set time, longer than the pause. That would be a ruling in these landing notes, as `026` and `027` tune their times.
- `webkit-dark` and Firefox were not run here. Test 29b runs in every engine; the next `matrix` run shows them.

### Superseded in part (2026-11-17)

The design lead ruled, from run 5 (`research/2026-11-17-the-fifth-matrix-run.md`, §3.5): the 1,000 ms timed clear is dropped. VoiceOver in Chromium missed S1 and S2 with it. A count now stays until the next editing keystroke, Clear or Escape. `022w` carries the change and names this spec's superseded sentences.

