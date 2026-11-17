# 022aa — No screen-reader wait without a bound

- **Status:** built 2026-11-17; reviewed (`reviews/032c-022ab-022aa-three-harness-fixes-pr-2026-11-17.md`, lands); finding 5 fixed by the design lead's ruling. Lane E (tests and the speech config).
- **Date:** 2026-11-17
- **Author:** a lane-E builder
- **Kind:** small change (`context/README.md`: a fix with no interface change, no new token or dependency). It changes the speech suite's waits and its config, and no item. No research memo of its own and no spec review. Its checks are seen failing first, and the built change is reviewed by someone who did not write it (constitution §5).
- **Depends on:** `022q`, `022x`.
- **Found by:** `022x`'s change review (`reviews/022xy-the-fifth-runs-test-faults-and-hot-corners-pr-2026-11-17.md`), note 6.

Terms. A _window_ is one `sr.after()` or `sr.before()`: an action and the speech heard around it. A _bound_ is a wait's timeout.

## The defect

24 waits in `tests/sr/` have no timeout (the review counted 21): `sign-in:41`, `alert-dialog:19`, `marker:32` and `:35`, `spinner:36`, `code-editor:24`, `app-shell:33`, `popover:22`, `product-home:22`, `page-states:19`, `dropdown-menu:45`, `dialog:24`, `sheet:20`, `toast:185`, `composer:42`, `sign-up:50` and `:67`, `marketing-bar:35`, `sidebar:32`, `settings:39` and `:62`, `alert:33`, `message-log:41` (each `.sr.ts`), and `sr.ts:60`, the ready wait in `open()`. `actionTimeout` is unset, so a locator action (`focus()`, `click()`) waits without a bound too. One that never resolves waits out the 5-minute test timeout, then 5 more in teardown, and names no cause: the dropdown's sub-menu did this for 30 minutes in run 5 (the memo, §3.3).

## The fix

1. **One helper, `appears(locator, what, { state, timeout })`** in `tests/sr/sr.ts`, exported by `fixtures.ts`. It waits up to `WAIT_MS`, 10 s, as `022x`'s sub-menu wait. On a timeout it records a fact, "`what` is `state` within 10 s", false, and fails as X0: "`what` was not `state` within 10 s; focus was on" the focused element, by tag, `data-slot` and text. Inside a window the failure waits until the window ends, so its phrases are recorded first (`022x`'s finding 1). If the action then throws, the X0 is kept and `faults.json` attached before the error is thrown on (the change review, finding 5). A dry run fails on the fact, a real run on the X0, and `faults.json` carries it. Any error but a timeout is thrown on. `Sr` keeps each page's owner, so a helper that holds only the page (`open(page)`) needs no new argument.
2. **Every wait above goes through it**, and so does `chat.sr.ts`'s reply wait, which had a bound but no message. The waits that already had a bound and their own handling (`dropdown-menu`'s sub-menu, `tooltip`, `code-block`, `toast`'s raise and clear) are unchanged.
3. **The config bounds the rest.** `playwright.sr.config.ts` sets `actionTimeout` to `WAIT_MS` and `navigationTimeout` to three times it, as the review proposed. A web-first assertion is already bounded by `expect.timeout`, 5 s.

Nothing in `src/` or `static/` changes.

## The check

- `sr-static.test.ts`, "022aa": a scan of `tests/sr/` (not `mutations/`) for `waitFor`, `waitForSelector`, `waitForFunction`, `waitForURL`, `waitForEvent`, `waitForLoadState`, `waitForResponse`, `waitForRequest`, `expect.poll` and `toPass` calls whose arguments name no `timeout`, or `timeout: 0`. A fixture shows each form, a call over several lines among them.
- `matrix.test.ts`, "022aa": the speech config, loaded as a run sees it, locally and in CI, has a finite `actionTimeout` and `navigationTimeout`, and `expect.timeout` is not 0.
- `sr-harness.test.ts`, "022aa": `appears()` with a fake page: it comes; a timeout in a window, recorded and then X0; a timeout outside one; a dry run; a crash thrown on.

## Landing notes

Run in this worktree on `7ec5488`, Bun 1.4.4, Playwright 1.64.1, 4 cores; the site built once; browser runs are `E2E_PREBUILT=1 E2E_PORT=4261`.

**Failing first (EXECUTED).**

- The scan, before the fix: failed, listing the 24 waits above.
- The config test, before: 2 failed, `actionTimeout` `Received: "undefined"`.
- A throwaway `tests/sr/zz-022aa-throwaway.sr.ts`, `SR_DRY=1`, `chromium`, `--timeout=60000`, waiting in a window for an element that never comes. A bare `waitFor()`: failed after 1.0 min, "waitFor: Test timeout of 60000ms exceeded", naming only the locator. Through `appears()`: failed after 10.3 s on the fact "the menu is visible within 10 s". The file was deleted.

**After (EXECUTED).**

- `sr-static.test.ts` and `sr-harness.test.ts`: 25 of 25 pass. `matrix.test.ts`: 19 of 19.
- The dry speech run, `SR_DRY=1 bun run test:sr --project=chromium`: 87 of 87 (1.2 min); `--project=webkit`: 87 of 87 (1.6 min).
- `--list --shard=k/5`, `SR_READER=voiceover`, `webkit`: 19, 17, 19, 16 and 16 tests, as `022q` decision 9.

**Notes.**

- No reader ran here. The next matrix run is the first to hold the 10 s action bound under VoiceOver and NVDA; an action slower than that there would now fail, by name, where it passed slowly.
- The bespoke bounded waits keep their own handling. Moving them onto `appears()` is not needed for a bound.

**The gate** (shared with `032c` and `022ab`, after all three): `bun run check`, 2434 files, 0 errors; `bun run lint`, clean; `bun test ./tests/unit`, 1950 pass, 2 skip, 0 fail, at load average 8, and again with two busy loops added; `tests/e2e/upgrade.spec.ts` in `chromium-light`, 16 of 16; the dry speech run, 87 of 87 in each browser. Nothing under `src/` or `static/` changed.

**The scorecard:** no row moves; confirmed by the change review.

**After the change review (EXECUTED).** The same worktree, uncommitted.

- **The design lead's ruling (2026-11-17):** fix finding 5 in `listen()`, with a unit test seen failing first; leave finding 6 (the scan's false positives and misses, none live) and the nit, 9 (the config importing `sr.ts` for `WAIT_MS`).
- **Finding 5.** A new `sr-harness.test.ts` case: `appears()` times out inside `sr.after()`, then the action throws "click: Timeout 10000ms exceeded". Before the fix: failed, no X0 in `sr.faults` (`Expected - 3, Received + 1`). After: `listen()` catches the throw, moves the late faults into `sr.faults`, attaches `faults.json`, and throws the action's error on. `sr-harness.test.ts` and `sr-static.test.ts`: 26 of 26 pass.
- **The gate.** `bun test ./tests/unit`, at rest and with two busy loops: 1951 pass, 2 skip, 0 fail each. `bun run check`, 0 errors. `bun run lint`, clean. The dry speech run: 87 of 87 in `chromium` (1.2 min), 87 of 87 in `webkit` (1.5 min).
- **For the next matrix run** (the review's note 8): look for "within 10 s" and "Timeout 10000ms" in the speech jobs' logs.
