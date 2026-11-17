# 022x — The fifth run's three test faults

- **Status:** built 2026-11-17; waits for its change review. Lane E (tests only).
- **Date:** 2026-11-17
- **Author:** a lane-E builder
- **Kind:** small change (`context/README.md`: a fix with no interface change, no new token or dependency). It changes three tests and one rule's helper, and no item. No research memo of its own and no spec review. Its checks are seen failing first, and the built change is reviewed by someone who did not write it (constitution §5).
- **Depends on:** `022`, `022q`.
- **Found by:** [the fifth matrix run](../research/2026-11-17-the-fifth-matrix-run.md), cited as *the memo*: §2 (bar glass), §3.2 (the chart), §3.3 (the dropdown menu), and §7's rows for each.

Terms. A _walk_ is a run of the reader's `next()` steps. _VO chr_ is VoiceOver with Chromium.

## The defect

1. **(a) The dropdown menu's sub-menu Escape test** (`tests/sr/dropdown-menu.sr.ts`). Under VO chr the sub-menu never opened after ArrowRight. The test's `waitFor` of the sub-menu has no timeout, so each attempt waited out the 5-minute test timeout, then 5 more in teardown: 30 minutes over three attempts, which pushed VO chr's shard 2 past its deadline. Nothing recorded whether the sub-trigger had focus, so the log names no cause (the memo §3.3). READ.
2. **(b) Chart C2** (`tests/sr/rules.ts`, `tests/sr/chart.sr.ts`). `022q` decision 6 gave the walk 25 steps. They now reach the data table's cells. VoiceOver reads a cell with its column header, "Visitors 412 column 2 of 2", which holds the tooltip's text, "Visitors 412". C2 read every step, so it faulted the table's own speech at steps 22 and 24 (the memo §3.2). READ.
3. **(c) The bar-glass hover check** (`tests/e2e/bar-glass.spec.ts`, "every descendant of the bar's panel is solid or clear, at rest and on hover"). It hovers each control, waits 250 ms, and reads every computed background. The theme toggle's background fades in over 200 ms. On a loaded runner it was read mid-fade, at an alpha of 0.173, and the test was flaky in `webkit-light` (the memo §2). INFERRED there; the fade is EXECUTED below.

## The fix

1. **(a)** Before ArrowRight the test records a DOM fact: focus is on the parent item, the sub-trigger. The sub-menu's `waitFor` takes a 10 s timeout. On a timeout the test throws an error that names the cause: focus was on the parent item, or it was on another element, named by its `data-slot` and text.
2. **(b)** C2 reads only the speech before the first header, where C1 finds it in order. C1 and C2 share one search, `inOrderAt`, so the boundary is the header after the caption, never an earlier "day" (the figure's name holds "weekday"). Within the header's own phrase, only the speech before the header is read. C2's third argument is now C1's order list, not a boolean; it returns its X0 when that order is not found. Only `chart.sr.ts` calls it.
3. **(c)** After the 250 ms wait, the test waits until every finite running animation on the panel's descendants has finished, and again if one started meanwhile. The panel's own `::after` sheen (600 ms) is not waited for: the check reads no pseudo-element, and waiting for it more than doubled the test's time.

Nothing in `src/` or `static/` changes.

## The check

(a) A throwaway probe, the test's steps with the sub-menu unable to open, waits the whole test timeout before the fix and fails in about 10 s after it, with the cause named. The real test passes in the dry run. (b) Unit tests with run 5's phrases fail before the fix and pass after. (c) Shown with the wait cut to 50 ms, standing in for a late transition: CI's error before the fix, a pass after. Then 20 runs in `webkit-light` at 250 ms, before and after.

## Landing notes

Run in this container on `71cb067`, Playwright 1.64.1, 4 cores, beside other agents' runs (load average up to 12). The site was built once in the worktree; each browser run is `E2E_PREBUILT=1 E2E_PORT=4251`.

**Failing first (EXECUTED).**

- (a) The probe, `SR_DRY=1`, `chromium`, `--timeout=90000`, the test's unfixed body with focus left on "Profile": "waitFor: Test timeout of 90000ms exceeded", after 1.5 min, naming only the locator.
- (b) `tests/unit/sr-rules.test.ts`: 5 of 62 failed. The run-5 walk gave CI's two faults: "the pointer tooltip's "Visitors 412" was spoken" and "… "Visitors 538" …". The X0 case failed because the old C2 took any truthy third argument as "C1 holds".
- (c) The hover check at `/` at 1440, wait cut to 50 ms, `--repeat-each=20`: 20 of 20 failed, "hovering Dark theme", `button[theme-toggle] background rgba(233, 229, 219, 0.11)` to `0.18`. That is CI's message. A probe read the toggle 0 to 250 ms after hover: `transition-duration` 0.2 s; alpha 0.08 at 30 ms, 0.57 at 60, 0.98 at 150, solid at 250.
- (c) At the real 250 ms: 20 of 20 passed, two workers. Under load (six busy loops beside four workers, load average 19): 20 of 20 passed. CI's flake does not reproduce here, as the memo found (0 of 36).

**After (EXECUTED).**

- (a) The probe, the fixed body, two cases, each failed in 10.7 s. Focus on "Profile": "the sub-menu did not open within 10 s of ArrowRight; focus was not on the parent item "Invite users" but on [data-slot="dropdown-menu-item"] "Profile Shift Cmd P"". Focus on the parent, ArrowRight swallowed: "… focus was on the parent item "Invite users"". The probe file was deleted.
- (b) `tests/unit/sr-rules.test.ts`: 62 of 62 pass.
- (c) Wait cut to 50 ms: 20 of 20 passed. At 250 ms: 20 of 20 passed, 55.7 s for the 20 (44.8 s before, on a busier machine; 1.8 min while it still waited for the sheen).
- `bar-glass.spec.ts` in full, `chromium-light` and `webkit-light`, two workers: 54 passed, 8 skipped (the blur tests, `onlyIn("chromium")`).
- The dry speech run, `SR_DRY=1 bun run test:sr --project=chromium`, then `--project=webkit`: 87 of 87 passed in each. The sub-menu test's new fact holds.
- `--list --shard=k/5`, `SR_READER=voiceover`, both browsers: 19, 17, 19, 16 and 16 tests, as `022q` decision 9.

- The gate, with `022y`: `bun run check`, 2434 files, 0 errors; `bun run lint`, clean; `bun test ./tests/unit`, 1918 pass and 1 fail, `highlight.test.ts`'s "the 18 specimens in a fresh process" timing. Alone it passed once and failed once (1125 ms) under load, and passed alone without this change too. It times the highlighter, which this change does not touch.

**Notes.**

- (b)'s fixture: the two cells' phrases, their step numbers and the walk's order are READ from the memo. Its other steps (the ticks' words, the header row's phrases) are shaped to fit, since passing steps' phrases were not in the log.
- C2 still judges no speech in a dry run; its proof is the unit tests and the next run's VO chr chart walk.
- In (a), the window named `sub-menu` is not recorded when the wait throws: the error leaves `sr.after` before its phrases are kept. The thrown message carries the cause. INFERRED: enough for the next run's log.
- **The scorecard:** no row moves; these are fixes to tests. INFERRED, to be confirmed at the change review.
