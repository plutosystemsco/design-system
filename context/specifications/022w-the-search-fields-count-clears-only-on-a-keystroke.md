# 022w — The search field's count clears only on a keystroke

- **Status:** built 2026-11-17; change-reviewed ([`../reviews/022vw-the-copy-button-and-the-search-count-pr-2026-11-17.md`](../reviews/022vw-the-copy-button-and-the-search-count-pr-2026-11-17.md): lands, findings 2, 7 and 8 written in). Lane I.
- **Date:** 2026-11-17
- **Author:** a lane-I builder
- **Kind:** small change (`context/README.md`: a fix with no interface change, no new token or dependency, in one item). No research memo of its own and no spec review. Its check is seen failing first, and the built change is reviewed by someone who did not write it (constitution §5).
- **Depends on:** `027` (batch A, whose `027b` is the search field); `022r`, which this amends.
- **Found by:** the fifth `matrix` run, explained by [the fifth matrix run](../research/2026-11-17-the-fifth-matrix-run.md), §3.5 and §7. The memo was untracked in the main checkout when this was written.

## The defect

`022r` gave each count two ways out of the status: a timer that empties it 1,000 ms after the count, and the next keystroke, if that comes first. Run 5 is the first run with `022r` (READ, the memo):

- S1 and S2 failed 3 of 3 in VoiceOver with Chromium. VoiceOver spoke the typed letters, then nothing: "s. des. …", with no count. S1 passed in run 4, before `022r`.
- S2 was flaky in VoiceOver with WebKit: attempt 1 failed, its retry passed.
- Both NVDA pairs passed S1 and S2. They now hear the repeat.

INFERRED, with the memo: the timed clear empties the count before VoiceOver in Chromium reads it. A count gone a second after it lands is too short a hold, not too short a gap.

## The fix

1. **What it follows.** The design lead's ruling of 2026-11-17, in the landing notes: drop the timed clear, and keep the keystroke clear. The keystroke clear alone gives every count an empty status for at least 750 ms before it, the pause (`SEARCH_FIELD_SETTLE_MS`). A count needs a keystroke and then a whole pause.
2. **The item.** `SPEECH_MS` and its timer go. A count stays in the status until the field next changes. A keystroke that edits the field (a letter, Backspace, a paste) empties the status at once.
3. **Clear and Escape** empty the status too (the change review, finding 2). The query is gone, so its count goes with it. Under `022r` the 1 s clear did this by the way; before `022r` the count stayed. Neither writes a count, and an empty write says nothing.
4. **No interface change.** `SPEECH_MS` was private. No prop, string, slot or class changes.
5. **The changelog.** `search-field` is new in 0.13.0, so its bullet's `022r` sentence is rewritten, not added to: the spoken count stays until the field next changes, since a keystroke, Clear or Escape empties it. So a count waits for a screen reader that comes to it late, one more letter with the same count is heard again, and no count stays for a query that is gone.

### `022r`'s sentences this supersedes

`022r` has landed and is not edited. Read these in their new form:

- Fix 1, "A count stays in the status for 1,000 ms, then the status is emptied. … Typing again also empties the status at once, if it comes first." Now: "A count stays in the status until the next keystroke, which empties it at once."
- Fix 2, "Why both.", the whole item. Only the keystroke clear is left. The hole it closes is gone with the timer. Its last sentences, "With no typing, the count stays the full second" and "`SPEECH_MS` only decides how long a lone count stays", now read "With no typing, the count stays".
- Fix 3, "`SPEECH_MS` is a private constant, not exported." and "Clear and Escape leave the status alone; the timer empties it." Now: "No timer is left." and "Clear and Escape empty the status."
- Fix 4's new form of `027` decision 4, "It is emptied 1,000 ms later, or at the next keystroke if that comes first". Now: "It is emptied at the next keystroke, Clear or Escape". And "a count already there is emptied when its second is up". Now: "a count already there is emptied".
- Fix 5, the changelog sentence, "The spoken count is emptied a second later, or at the next keystroke". Now as fix 5 above.
- The check, 29b's second and third assertions: "left alone, the repeat is still in the status at 999 ms" and "the status is emptied at 1,000 ms". Now: "left alone, the count is still there 5 s later, and nothing is written".
- The landing notes' mutation "without the 1 s clear, 29b fails in both engines at "the status is emptied"". That mutation is now the item.
- "Not settled", "If S2 still fails, the gap is what to tune, not `SPEECH_MS`". Run 5 showed the hold too short, not the gap; the ruling above tunes the hold.

## The check

- **Test 29b is restated**, on `filter`, with Playwright's clock and the write log. It types "des" and waits for "3 results". Then:
  - 5,000 ms pass: the status still says "3 results", and nothing is written. This fails on `022r`'s item.
  - "i": the status is empty at once; after the pause, "3 results" again.
  - "gn" at once, 200 ms, then "e": after the pause, "1 result", still there 5,000 ms later.
  - The whole log is `""`, "3 results", `""`, "3 results", `""`, "1 result". Each count follows an empty write at least 750 ms before it.
- **Test 29** asserts the status is empty after Clear, and after Escape once a count is there. Its comment now says a keystroke empties the status. Its other assertions are unchanged: they filter out empty writes.
- **The speech tests are unchanged.** S1 and S2 in the next run, in all four pairs, are the check that a reader hears the count.

## Landing notes

**Ruled, 2026-11-17, the design lead:** drop `022r`'s timed clear, and keep the keystroke clear, which alone gives every count an empty status at least 750 ms before it (the pause). It follows the fifth `matrix` run's S1 and S2 under VoiceOver with Chromium (the memo, §3.5 and §7). `022r`'s "Not settled" expected a ruling here to tune the gap; run 5 showed the hold, not the gap, too short. The one-line pointer in `022r`'s landing notes is the design lead's edit.

Built 2026-11-17 by a lane-I builder, in the worktree `lane-i-run5`, at `71cb067`, with `022v`. Not committed. Runs used `E2E_PREBUILT=1`, a rebuild after each source change, and Playwright's browsers in `/opt/pw-browsers`.

### Seen failing first (EXECUTED)

- **29b, on `022r`'s item:** failed in `chromium-light` and `webkit-light`, **2 of 2**, at the 5,000 ms hold: "toHaveText: Expected "3 results", Received """. Seen twice: before the fix, and again with the original source restored after the test's last edit.

### After the fix (EXECUTED)

- **Proven by mutation**, on a rebuilt item, restored after: without the keystroke clear, 29b fails in both engines (the status is not empty after "i"), and so does test 29 (the unchanged count is not written again).
- `search-field.spec.ts` with `code.spec.ts`, `chromium-light` and `webkit-light`, `--repeat-each=2`: **220 passed**, 0 failed (E7, marked to fail here, failed as expected).
- **The dry speech run** (`SR_DRY=1`), `search-field.sr.ts` and `code-block.sr.ts`: 5 of 5 in Chromium, 5 of 5 in WebKit.
- **The cost**, `bun run cost --sizes-only`, once for both changes: `search-field` JS 13,416 → 13,392 B (brotli 11,844 → 11,848), CSS 1,700 unchanged.
- `static/r/` and `static/v0.13.0/r/`: `search-field.json` regenerated by the build. The thumbnails' manifest: see `022v`.
- `bun run check`: 0 errors, 0 warnings. `bun run lint`: clean. `bun scripts/lint-literals.ts`: 0 literals in registry item files, 1 allowance (`liquid-glass`), as before.
- `bun test ./tests/unit`, three whole runs: 1,912 passed, 2 skipped, 1 failed; then 1,911, 2, 2 twice. Each failure was a timing budget, "the 18 specimens … 50 ms or less warm" in `highlight.test.ts` (65 ms) or "the streaming budget … 4 ms or less per chunk" in `highlight-session.test.ts` (4.1 ms). Neither change touches the highlighter. Alone, `highlight-session.test.ts` passed 2 of 2 runs (10 of 10 each), and `highlight.test.ts` 3 of 5 here and 1 of 1 on the unchanged tree.
- **The ledger:** no line names test 29 or 29b (READ, `tests/fault-ledger.ts`). Not touched.
- **The scorecard** is not re-run for this change alone. It follows the batch's re-run when these land.

### After the change review (EXECUTED)

The review: [`../reviews/022vw-the-copy-button-and-the-search-count-pr-2026-11-17.md`](../reviews/022vw-the-copy-button-and-the-search-count-pr-2026-11-17.md), "lands". Findings 2, 7 and 8 written in.

- **Finding 2, a stale count after Clear or Escape.** Test 29 gained two assertions: the status is empty after Clear, and after Escape once "3 results" is there. On the build before the fix, both failed in `chromium-light` and `webkit-light` (run as soft assertions, so both were seen): Expected "", Received "3 results", 4 of 4. Then `clear()` sets `said = ""`. On the rebuilt item, tests 29, 29a and 29b passed in both projects.
- **Finding 7:** the ruling is the landing note above.
- **Finding 8:** 29b says in a comment that the first count's empty write is the page's own.
- **The runs, on one fresh build with `022v`'s review fixes:**
  - `code.spec.ts` and `search-field.spec.ts`, `chromium-light` and `webkit-light`, `--repeat-each=2`: **220 passed**, 0 failed (E7 failed as expected, as before).
  - The dry speech run, `search-field.sr.ts` and `code-block.sr.ts`: 5 of 5 in Chromium, 5 of 5 in WebKit.
  - `bun run check`: 0 errors, 0 warnings. `bun run lint`: clean. `bun scripts/lint-literals.ts`: 0 literals, 1 allowance.
  - The cost, `--sizes-only`: `search-field` JS 13,416 → 13,393 B (brotli 11,844 → 11,868), CSS 1,700 unchanged. `static/r/`: `search-field.json` regenerated.

### Not settled

- **A count can go stale without a keystroke.** An app that refines `results` for the same query keeps the first count, since a count is written once a pause. That was so before `022r` too. No test or run has faulted it.
- **No reader has heard a count held this way.** That VoiceOver with Chromium reads it now is INFERRED. The next `matrix` run's S1 and S2 show it, in every pair.
