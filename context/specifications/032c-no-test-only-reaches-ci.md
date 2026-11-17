# 032c — No `test.only` reaches CI

- **Status:** built 2026-11-17; reviewed (`reviews/032c-022ab-022aa-three-harness-fixes-pr-2026-11-17.md`, lands); finding 7 taken by the design lead's ruling. Lane E (tests and the two Playwright configs).
- **Date:** 2026-11-17
- **Author:** a lane-E builder
- **Kind:** small change (`context/README.md`: a fix with no interface change, no new token or dependency). It adds one line to each Playwright config and two checks to `tests/unit/matrix.test.ts`, and changes no item. No research memo of its own and no spec review. Its check is seen failing first, and the built change is reviewed by someone who did not write it (constitution §5).
- **Depends on:** `022`.
- **Found by:** [the structural review](../research/2026-11-17-structural-review.md), Q1 (High), and its open question on Bun's own `test.only`.

Terms. A _focused_ test is one marked `.only`: the runner then runs it, and the other focused tests, and skips the rest.

## The defect

Neither `playwright.config.ts` nor `playwright.sr.config.ts` sets `forbidOnly`. A committed `test.only` makes each CI shard run that test alone, and pass. The gate goes green, and the release check accepts the run as evidence (the review, Q1). EXECUTED below: with `CI=1`, a planted `test.only` turned the browser suite into one passing test.

## The fix

1. Both configs set `forbidOnly: CI`, the `CI` flag each already reads (`!!process.env.CI`). In CI a focused test fails the run before any test starts. Locally `.only` still works.
2. Bun 1.4.4 already refuses `.only` when `CI` is set (EXECUTED below). The unit suite gains a cheap guard anyway, for a local run and for `CI=false`: a scan of every `.ts`, `.js` and `.svelte` file under `tests/` for `test`, `it`, `describe` or `suite` followed by `.only(` or `.only.`. It covers all three suites, unit, browser and speech. After the change review (finding 7) it also sees `describe.serial` and `describe.parallel` before `.only`, and a call before it, as in `test.if(c)` or `test.skipIf(c)`. It still flags `.only(` in a string or a comment, and misses a call split over two lines, as ruled.

Nothing in `src/` or `static/` changes.

## The check

`matrix.test.ts`, "032c: no .only reaches CI": each config, loaded in a child process as a run sees it, has `forbidOnly` true under `CI=1` (the speech config under both readers) and unset locally. "032c: no .only in any suite's source": the scan finds nothing, and a fixture shows it sees each form and passes `--only` flags. Shown failing first, then a planted `test.only` shown failing a CI run.

## Landing notes

Run in this worktree on `7ec5488`, Bun 1.4.4, Playwright 1.64.1, 4 cores, the site built once; browser runs are `E2E_PREBUILT=1 E2E_PORT=4261`.

**Failing first (EXECUTED).**

- `matrix.test.ts`, the two config tests before the fix: 2 of 15 failed, `Expected: true`, `Received: undefined`.
- A throwaway `tests/e2e/zz-032c-throwaway.spec.ts`, one plain test and one `test.only`, unfixed configs, `CI=1`, `chromium-light`: "Running 1 test using 1 worker … 1 passed", exit 0. The whole project ran one test.
- Bun, in a scratch folder (two files, one with a `test.only`): without `CI`, 2 tests ran, the focused file's other test skipped, exit 0; with `CI=1`, `CI=true` or `GITHUB_ACTIONS=true`, "error: .only is disabled in CI environments to prevent accidentally skipping tests", exit 1. `matrix.yml`'s `checks` job runs on GitHub, which sets `CI`.
- The source guard, with a throwaway `tests/unit/zz-032c-throwaway.test.ts` holding a `test.only`, `CI` unset: failed, naming `unit/zz-032c-throwaway.test.ts:2`. Its first draft also named its own doc comment (`matrix.test.ts:163`), which was reworded.

**After (EXECUTED).**

- The same throwaway spec, `CI=1`: "Error: item focused with '.only' is not allowed due to the 'forbidOnly' option in '../../playwright.config.ts'", exit 1. Without `CI`: 1 passed, as before.
- A throwaway `tests/sr/zz-032c-throwaway.sr.ts`, `CI=1 SR_READER=voiceover`, `-c playwright.sr.config.ts --project=chromium`: the same error, exit 1, before any reader started.
- Every throwaway file was deleted.
- `matrix.test.ts`: 19 of 19 pass, with `022aa`'s two.

**The gate** (shared with `022ab` and `022aa`, after all three): `bun run check`, 2434 files, 0 errors; `bun run lint`, clean; `bun test ./tests/unit`, 1950 pass, 2 skip, 0 fail, at load average 8, and again with two busy loops added; `tests/e2e/upgrade.spec.ts` in `chromium-light`, 16 of 16, and 16 of 16 with `CI=1`; the dry speech run, 87 of 87 in `chromium` and in `webkit`. Nothing under `src/` or `static/` changed.

**The scorecard:** no row moves; confirmed by the change review.

**After the change review (EXECUTED).** The same worktree, uncommitted.

- **The design lead's ruling (2026-11-17):** extend the guard to `describe.serial.only`, `describe.parallel.only` and `test.if(...).only`; leave the strings, comments and split-call cases.
- **Finding 7.** Four fixture lines, seen failing first (`the check sees each form`, 1 fail): `test.describe.serial`, `test.describe.parallel`, `test.if(linux)` and `test.skipIf(mac)`, each before `.only(`. The pattern gains `serial` and `parallel` beside the runner names, and a closing parenthesis before `.only`. Its first draft's comment named the forms and was caught by the scan itself; it was reworded. After: `matrix.test.ts`, 19 of 19 pass.
- **The gate.** `bun test ./tests/unit`, at rest and with two busy loops: 1951 pass, 2 skip, 0 fail each. `bun run check`, 0 errors. `bun run lint`, clean. The dry speech run, 87 of 87 in each browser.
