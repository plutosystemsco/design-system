# 022n — The search field hides WebKit's cancel button on Linux

- **Status:** built 2026-11-16; waits for its change review. Lane I.
- **Date:** 2026-11-16
- **Author:** a lane-I builder
- **Kind:** small change (`context/README.md`: a fix with no interface change, no new token or dependency, in one item). No research memo of its own and no spec review. Its check is seen failing first, and the built change is reviewed by someone who did not write it (constitution §5).
- **Depends on:** `022`; `027` (batch A, whose `027b` is the search field).
- **Found by:** the `matrix` runs, `search-field.spec.ts` 28 in `webkit-*`, explained by [WebKit on Linux](../research/2026-11-16-webkit-on-linux.md), §2.2.

## The defect

`search-field`'s input hides WebKit's own cancel button with `[&::-webkit-search-cancel-button]:appearance-none` (READ, `search-field.svelte`). On macOS that removes the glyph, which is the native appearance. Linux WebKit loads the Adwaita user-agent sheet (`css/themeAdwaita.css`). It already sets `appearance: none` on the cancel button, then draws the glyph as a `mask-image` over `background-color: currentColor` (READ, by the memo). So `appearance: none` leaves it. A filled field in GNOME Web and other Linux WebKit browsers shows two clear buttons, the browser's and the field's own Clear button (EXECUTED by the memo).

Test 28 caught it: removing the item's classes changed no pixel, so "the bare input's cancel button shows" failed. Its third assertion took `-webkit-appearance: none` as its reference. That encodes the same macOS assumption: in Linux WebKit the reference shows the glyph too, so the assertion passes against a field that shows it.

## The fix

1. **The item.** The input's class becomes `[&::-webkit-search-cancel-button]:hidden`: Tailwind's `hidden`, `display: none`. That hides the glyph in both WebKit ports and in Chromium (EXECUTED by the memo, on a bare input). The decoration's `appearance-none` stays. No literal colour or size; no prop, slot or class an app passes changes. The comment above the markup says why.
2. **The test.** 28's reference rule hides the cancel button with `display: none`, and its message reads "the class draws what display: none draws". The first two assertions are unchanged.
3. **The changelog.** `search-field` is new in 0.13.0, and `027b` test 2 asks for one bullet per batch-A item. So the fix is a sentence in its existing bullet, not a bullet of its own: the browser's cancel button is hidden with `display: none`, so the field shows one clear button in every browser.

## The check

`search-field.spec.ts` 28 in `webkit-light`, failing first, passes; `chromium-light` passes before and after. The corrected third assertion fails on the unfixed item in `webkit-light`, where the old one passed.

## Landing notes

Built 2026-11-16 by a lane-I builder, after `022m` in the same worktree (`lane-i-webkit`, at `0933f1b`). Not committed. Runs used `E2E_PREBUILT=1`, one worker, a rebuild after each source change.

### Seen failing first (EXECUTED)

- **28 as it stood, on the unchanged item:** failed in `webkit-light` on "the bare input's cancel button shows" (Expected false, Received true); passed in `chromium-light`. As the memo said.
- **The third assertion, probed.** With the first assertion made soft for one run (not kept), on the unchanged item in `webkit-light`: with the old reference (`appearance: none`), the third assertion **passed**, so it measured nothing there; with the new reference (`display: none`), it **failed**. So the corrected test fails on two assertions against the unfixed item.

### After the fix (EXECUTED)

- 28: 2 of 2 passed (`chromium-light`, `webkit-light`).
- **The joint run**, `code.spec.ts` and `search-field.spec.ts` whole, with both changes, in `chromium-light` and `webkit-light`, one worker: **104 passed, 2 failed** of 106. The two are E7, the editor budgets, in both projects ("python p95 … Expected: <= 12, Received: 20.2" and "21"). That is `022f`'s fault: on a loaded machine the keystroke budget is missed in every engine. Compared on this machine, 3 runs each in `chromium-light`: with `022m`, Python p95 25.8, 16.7 and 16.9 ms (load average 7.8); at `0933f1b`, without it, 15.3, 17.2 and 15.5 ms (load 4.3). E7 failed 3 of 3 both ways. The gap is within the load's noise, but it is not ruled out; see `022m`'s notes. Rebuilt with both fixes after the comparison, `022m`'s two tests and 28: 6 of 6 passed in both projects.
- `bun scripts/lint-literals.ts`: 0 literals in registry item files (1 allowance, `liquid-glass`, as before).
- **The changelog:** a separate `search-field` bullet first failed `registry.test.ts`'s "027b test 2 … search-field: one bullet, new"; folded into the item's bullet, it passes.
- **The ledger:** no line names 28 (READ, `tests/fault-ledger.ts` at `0933f1b`).
- **The cost:** `bun run cost --sizes-only` (run once, for both changes) rewrote `search-field`: 13,411 → 13,417 B of JS (brotli 11,902 → 11,912), CSS 1,695 → 1,700 (brotli 1,476 → 1,478). The catalogue: JS 379,202 → 379,331, CSS 16,795 → 16,798. Runtime figures kept; the run reported 11 items runtime-stale, as the unit test only warns (`025`'s ruling (b)). `search-field` is interactive, so its change review runs `bun run cost --only search-field`.
- `static/r/` and `static/v0.13.0/r/` regenerated by the build (`search-field.json`). The thumbnails' manifest rewritten with `--hash-only` (`search-field`; no picture changed).
- `bun run check`: 0 errors. `bun run lint`: clean. `registry`, `cost` and `thumbnails` unit tests: 160 passed. The whole unit suite: 1,856 passed, 2 skipped, 2 failed under load (`highlight-session.test.ts`'s two timing budgets); that file alone, re-run: 10 of 10 passed. Nothing in it reads either item.
- **The scorecard** is not re-run for this change alone; it follows the batch's re-run when these land.

### Not settled

- `webkit-dark` and Firefox were not run here; 28 does not run in Firefox (`notIn("firefox")`). The next `matrix` run shows `webkit-dark`.
- macOS WebKit was not run; `display: none` hides the native glyph there too (INFERRED, as Chromium's and the memo's bare-input probe show for the other engines).
