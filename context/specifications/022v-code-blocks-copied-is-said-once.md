# 022v — The code block's "Copied" is said once

- **Status:** built 2026-11-17; change-reviewed ([`../reviews/022vw-the-copy-button-and-the-search-count-pr-2026-11-17.md`](../reviews/022vw-the-copy-button-and-the-search-count-pr-2026-11-17.md): does not land yet, 1 Medium, 5 Low); findings 1, 3, 4, 5 and 6 fixed; waits for the review's re-check. Lane I.
- **Date:** 2026-11-17
- **Author:** a lane-I builder
- **Kind:** small change (`context/README.md`: a fix with no interface change, no new token or dependency, in one item and its page). No research memo of its own and no spec review. Its check is seen failing first, and the built change is reviewed by someone who did not write it (constitution §5).
- **Depends on:** `004` (decision 8, the copy button); `022` (decision 12 and patch 7); `022q` (decision 7, L3 within one entry).
- **Found by:** the fifth `matrix` run, explained by [the fifth matrix run](../research/2026-11-17-the-fifth-matrix-run.md), §3.3 and §7. The memo was untracked in the main checkout when this was written.

## The defect

NVDA said "Copied. Copied. Copy code" after Enter on the copy button, in Chromium and in Firefox, on every attempt. VoiceOver with Chromium said "Copied button main. Copied." once, then passed on retry (READ, the memo §3.3). `022q`'s L3 within one entry faults it.

Two things say "Copied" at once (READ, `code-block-copy-button.svelte` before this change):

- the focused button's `aria-label` becomes "Copied" for two seconds (line 70);
- the status region beside it says "Copied" (line 84).

NVDA speaks the focused button's new name, then the status. A person hears "Copied" twice (INFERRED, with the memo). This is patch 7's witness (`022` decision 15). Unpatched, it fails under NVDA, so patch 7 cannot prove L3 there until the item says "Copied" once (READ, the memo §6).

## The fix

1. **The status speaks; the name stays.** The button's `aria-label` is always "Copy code". The status still says "Copied" for two seconds, or "Could not copy" where the write is refused. The check icon still shows for two seconds, and `data-copied` is still set.
2. **Why the status, not the name.** The item's documented contract says the outcome is announced by a status region beside the button, present from the first render (`004` decision 8; `022` decision 12; the item's page). `022`'s speech test reads the outcome from that status, and patch 7 doubles the status. Keeping the name and emptying the status would break both, and a reader need not speak a name change. A refused write already worked this way: the name stayed "Copy code", and the status said the outcome. Now success does too.
3. **No interface change.** No prop, slot, export, class or string an app passes changes. "Copy code" and "Copied" are the same words as before. The visible button is the same. What changes is behaviour an app could test: no button is named "Copied" any more. The changelog says so.
4. **The item's page.** Its sentence "named “Copy code”, then “Copied” for two seconds, which a status region beside it announces" now reads: "named “Copy code”. After a copy it shows a check for two seconds, and a status region beside it says “Copied”. The name stays “Copy code”, so “Copied” comes from the status alone." It says what the item does, not what a reader does (the change review, finding 4). The source's markup comment says the same, as the item's intent.
5. **The text it supersedes.** `004` is a landed record and is not edited. Read these in their new form:
   - Decision 8, the copy button: "with `aria-label` "Copy code", which becomes "Copied" for two seconds". Now: "with `aria-label` "Copy code", which it keeps; the check icon shows for two seconds".
   - Criterion 4, behaviours: "Enter on the copy button sets the status text to "Copied" and the button's name". Now: "sets the status text to "Copied", and the button keeps its name".
   - Criterion 6, C4: "the name is "Copied", and the status region's text is "Copied"; after 2 s the name is "Copy code" again". Now: "the name is still "Copy code", and the status region's text is "Copied"; after 2 s the status is empty".
6. **The changelog.** `code-block` has no bullet of its own in 0.13.0; it is only in the shared "doc comments on every prop" bullet. So it gets one: the copy button keeps its name, said in bold as `dropdown-menu`'s behaviour change is; the status is the one place "Copied" is said; and what an app's own test does instead.

## The check

- **Two e2e tests are restated**, on the page's clock. It is installed at a fixed time and paused 10 minutes ahead before Enter, as search-field's `clocked()` does, so the name is read while time stands still:
  - `code.spec.ts`, C4: after Enter, the status says "Copied", `data-copied` is set, and the name is "Copy code". At 1,999 ms of the clock `data-copied` is still set; at 2,000 ms it is gone, the status is empty, and the name is "Copy code".
  - `keyboard.spec.ts`, the code-block behaviour: after Enter, the status says "Copied", `data-copied` is set, and the name is "Copy code".
- **Why the clock.** Without it, the name assertion retries until the 2 s reset gives "Copy code", and passes on the unchanged item. That happened in the first draft (EXECUTED, below). Pausing on a running clock after Enter was flaky under load (the change review, finding 1).
- **The speech test is unchanged.** `code-block.sr.ts` still judges L1 and L3 on "Copied". Its next run in all four pairs is the check that a reader says it once.

## Landing notes

Built 2026-11-17 by a lane-I builder, in the worktree `lane-i-run5`, at `71cb067`. Not committed. Runs used `E2E_PREBUILT=1`, a rebuild after each source change, and Playwright's browsers in `/opt/pw-browsers`.

### Seen failing first (EXECUTED)

- **The first draft** asserted the name with no clock. On the unchanged item it passed, 4 of 4: the retrying assertion waited out the 2 s reset. That is why the tests take the clock.
- **With the clock, on the unchanged item:** C4 and the keyboard test failed in `chromium-light` and `webkit-light`, **4 of 4**, each at "toHaveAccessibleName: Expected "Copy code", Received "Copied"". Seen twice: before the fix, and again with the original source restored after it.

### After the fix (EXECUTED)

- `code.spec.ts` and `search-field.spec.ts`, `chromium-light` and `webkit-light`, `--repeat-each=2`: **220 passed**, 0 failed. E7, the editor's budgets, is marked to fail here; it failed as expected and counts as passed.
- `keyboard.spec.ts`, its three code-block and copy tests, both projects, twice: **12 passed**.
- **The dry speech run** (`SR_DRY=1`), `code-block.sr.ts` and `search-field.sr.ts`: 5 of 5 in Chromium, 5 of 5 in WebKit. Dry mode drives the steps and does not judge speech.
- **Patch 7** still applies (`git apply --check`), as do the other mutation patches. Its context lines are unchanged.
- **The cost**, `bun run cost --sizes-only`, run once for this change and `022w`: `code-block` JS 25,587 → 25,573 B (brotli 22,414 → 22,402), CSS 2,444 unchanged. Its importers moved by a few bytes: `stage-card` 26,989 → 26,983, `chat` 38,632 → 38,600, `product-home` 53,950 → 53,941. The catalogue was rewritten too, but its figures move by up to about 16 B of JS and 8 B of CSS between runs on one source (the change review, finding 6), so they are not this change's. Runtime figures kept.
- `static/r/` and `static/v0.13.0/r/` were regenerated by the build: `code-block.json` alone for this change. `chat` and `stage-card` name `code-block` as a dependency, so their files did not change.
- **The thumbnails' manifest**, `--hash-only`, run once for this change and `022w`: 70 hashes changed. An example's hash walks the component page template, `component.svelte`, which imports the copy button through `command.svelte` and `snippet.svelte` (the change review, finding 5). The 12 items whose stage is a view kept theirs. No picture changed: the button looks the same.
- `bun run check`, `bun run lint`, `bun scripts/lint-literals.ts`, `bun test ./tests/unit`: see `022w`'s landing notes, run once for both.
- **The ledger:** no line names the copy tests (READ, `tests/fault-ledger.ts`). Not touched.
- **The scorecard** is not re-run for this change alone. It follows the batch's re-run when these land.

### After the change review (EXECUTED)

The review: [`../reviews/022vw-the-copy-button-and-the-search-count-pr-2026-11-17.md`](../reviews/022vw-the-copy-button-and-the-search-count-pr-2026-11-17.md), "does not land yet". Findings 1, 3, 4, 5 and 6 written in.

- **Finding 1, the flaky copy tests.** Both now install the clock at a fixed time and pause it 10 minutes ahead before Enter. C4 also pins the reset: still set at 1,999 ms, gone at 2,000.
  - **Seen failing on the old item:** `code-block-copy-button.svelte` put back to `71cb067`, then a rebuild. Both tests failed in `chromium-light` and `webkit-light`, **4 of 4**, at the name: Expected "Copy code", Received "Copied". The item was then restored and rebuilt.
  - **Under load:** both tests, both projects, `--repeat-each=25`, 4 workers, load average 25 to 31: **100 of 100 passed**.
- **Finding 3:** the tokens page's double "Copied" is queued as a roadmap row in lane S (below).
- **Finding 4:** the page and the changelog say what the item does: "Copied" comes from the status alone, the one place it is said.
- **Finding 5:** the thumbnails' reason names `component.svelte`, above.
- **Finding 6:** the catalogue's figures are no longer claimed, above.
- **The runs, on one fresh build with `022w`'s review fix:**
  - `code.spec.ts` and `search-field.spec.ts`, `chromium-light` and `webkit-light`, `--repeat-each=2`: **220 passed**, 0 failed (E7 failed as expected).
  - `keyboard.spec.ts`, its three code-block and copy tests, both projects, twice: **12 passed**.
  - The dry speech run, `code-block.sr.ts` and `search-field.sr.ts`: 5 of 5 in Chromium, 5 of 5 in WebKit.
  - `bun run check`: 0 errors, 0 warnings. `bun run lint`: clean. `bun scripts/lint-literals.ts`: 0 literals, 1 allowance. All mutation patches apply, patch 7 among them.
  - `bun run build`, then the cost `--sizes-only` and the thumbnails `--hash-only`: `code-block` 25,573 B, as above; still 70 hashes changed against `71cb067`.

### Not settled

- **The same double on the site.** The tokens page's copy buttons (`src/lib/site/foundations/copy-name.svelte`) rename themselves "Copied" and say "Copied" in a status too, and `keyboard.spec.ts`'s 017 criterion 4 test pins the name. The fix is queued as a roadmap row, a small change in lane S: the same fix, and that test restated on a paused clock.
- **No reader has heard the fix.** That NVDA now says "Copied" once is INFERRED. The next `matrix` run's code-block test shows it, in every pair, and then patch 7 can prove L3 under NVDA (`022q` criterion 7).
