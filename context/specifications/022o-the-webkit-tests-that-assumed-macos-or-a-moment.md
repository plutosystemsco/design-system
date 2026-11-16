# 022o — The WebKit tests that assumed macOS, or a moment

- **Status:** built 2026-11-16; reviewed (`reviews/022o-the-webkit-tests-that-assumed-macos-or-a-moment-pr-2026-11-16.md`, does not land yet), its three findings fixed; waits for the review's re-check. Lane E (tests only).
- **Date:** 2026-11-16
- **Author:** a lane-E builder
- **Kind:** small change (`context/README.md`: a fix with no interface change, no new token or dependency). It changes tests only: six specs and the engine helpers, as the memo groups them, and no item. No spec review. Its checks are seen failing first where they fail here, and the built change is reviewed by someone who did not write it (constitution §5).
- **Depends on:** `022`.
- **Found by:** the `matrix` runs 1 to 3 and [WebKit on Linux](../research/2026-11-16-webkit-on-linux.md) (§1, §2.1, §3, §5, §6, §7). Search field 28 (§2.2) is the item fault lane I fixes in `022n`; this change leaves it alone.

Terms. **Linux WebKit** is the GTK and WPE ports Playwright runs on Linux, as CI does; **macOS WebKit** is the Mac port. The **starting point** is the place Tab and Shift+Tab search from; a click sets it. **DSF** is the device scale factor, device pixels per CSS pixel.

## The defect

1. **Toast 64a, 64c, 64d.** Each raises its toast with a click on the button, then calls `focus()` on it and presses Shift+Tab. In Linux WebKit the click focuses the button and leaves the starting point on the text inside it, so `focus()` changes nothing and Shift+Tab stays on the button (memo §1). The tests held only where a click focuses nothing, as on macOS. READ.
2. **Pagination 15a (by click) and 18.** They branch on the engine: `adaptsIn("webkit", …)` and `onlyIn("webkit", …)` expect that a click focuses no button. That is macOS's default; Linux WebKit focuses the button, as Chromium does (memo §2.1). The helpers could not name a platform. READ.
3. **Chat L1** ("it follows an appended turn…"). The test reads `before` once the log is 8 px from its end. Linux WebKit eases a wheel scroll out over about 200 ms, so the scroll is still moving when it reads (memo §3). READ.
4. **Bar glass, `bar-glass.spec.ts:140`.** The panel's screenshot is in device pixels. WebKit's projects run at DSF 2, so the image is twice the CSS box each way, and the boxes the test measures in CSS pixels index the wrong pixels. Four times the pixels also make the decode slow enough to time out on CI (memo §5). READ.
5. **Compositions 604, the keyboard walk.** `focusProblem()` reads the focus's box straight after the key press. WebKit scrolls a focused element into view on a zero-delay timer, so on a loaded runner the read can come before the scroll (memo §6). READ.
6. **Primitives 426,** the looping-animation sweep. It opens 50 pages under the default 30 s time-out. It took 19.5 s in WebKit here, and timed out once on CI (memo §7). READ.

## The fix

1. **Toast:** a `raise()` helper presses the button by keyboard (`focus()`, then Enter, as 64g does) and waits for the toast. 64a, 64c and 64d use it in place of the click.
2. **Pagination:** `onlyIn` and `adaptsIn` take an optional third argument, a platform (`"darwin"` or `"linux"`, matched against `process.platform`, which is the browser's system). An `ENGINE_ONLY` entry carries it as `platform`, and the unit check matches it as part of the call's arguments. No new helper: the two existing ones gain the argument, and an entry without it reads as before. 15a's click check is `adaptsIn("webkit", …, "darwin")`: macOS WebKit keeps today's expectation, and Linux WebKit takes Chromium's. Its reason now says "macOS WebKit". 18 is rewritten to run in every engine (the change review, finding 1): from page 11, with focus blurred to `body`, a script click on Next (`el.click()`) reaches the nav's click handler as a real click does and focuses nothing in any engine. The test asserts that page 12 is current and focus stays on `body`. Its `onlyIn` call and `ENGINE_ONLY` entry are gone, and it is retitled "18. a press on Next onto the last page, from outside the nav, moves no focus".
3. **Chat L1:** before reading `before`, the test polls until `scrollTop` holds still across two frames. Then it asserts the log is still released where it rests: not at its end, and the scroll button visible (the change review, finding 3).
4. **Bar glass:** the screenshot takes `scale: "css"`.
5. **Compositions:** `focusProblem()` waits two animation frames before it reads the box.
6. **Primitives:** the sweep's time-out grows with its pages: 30 s plus 1 s a page, 80 s for 50.

Nothing in `src/` changes.

## The check

Fixes 1 to 3 reproduce here, in `webkit-light`, and are seen failing first. Fixes 4 to 6 were expected to fail only on CI's loaded runners. So each defect is also shown another way: the screenshot's size, when the box moves, and the sweep's time against its limit. Under this machine's load on the day, bar glass also timed out as on CI. After the fix, the six specs pass in `webkit-light` and `chromium-light`, and the unit check holds `ENGINE_ONLY` and the calls in step, a platform included.

## Landing notes

Run in this container on `0933f1b` (`release/0.13.0`), Playwright 1.64.1, 4 cores, one or two workers, beside another builder's WebKit runs. Each command is `E2E_PREBUILT=1 E2E_PORT=4230 bun --bun playwright test --project=<project> <files> -g <titles> --trace off --workers=<n>`.

**Failing first (EXECUTED).**

- Toast 64a, 64c, 64d, and pagination 15a by click and 18, `webkit-light`, one worker: 5 of 5 failed. Toast: `expect(locator).toBeFocused()` on `#under`, `#in-panel` and `#pushed`, "Received: inactive". 15a: "after 5", expected "Page 1", received "Page 5". 18: expected "body", received "Page 12". These are CI's errors.
- Chat L1, `--repeat-each=8`, `webkit-light`: 4 of 8 failed, `before` 411, 412, 466 and 413 against 410 after.
- Bar glass, shown by size: a probe on `/components/button/` at 1440 in `webkit-light`, `devicePixelRatio` 2: the panel's box is 1168 × 72; the default screenshot is 2336 × 144 (49 935 bytes), and with `scale: "css"` 1168 × 72 (18 012 bytes). In `chromium-light`, DSF 1, both are 1168 × 72.
- Bar glass at 1440, the four dense pages, two workers, load average 8 (another builder's WebKit run beside it): in `webkit-light`, 2 of 4 failed with "Test timeout of 30000ms exceeded" (`/components/button/` 33.4 s, `/components/` 34.6 s), and the others took 29.9 and 23.0 s. That is CI's failure. The lowest readings were 12.93 and 16.66, CI's to the hundredth. In `chromium-light`, 4 of 4 passed, 6.8 to 9.1 s.
- Compositions walk, not reproduced; shown by when the box moves: a probe on `/view/product-home/` at 1440 in `webkit-light` recorded the focus's box at `focusin`, in a zero-delay task queued from it, and two frames later, walking back with a pause between keys. The page scrolled on 4 of the 19 back steps, and on each the box at `focusin` and in the task was the unscrolled one. The step to the hero's code block read −825.8125 at `scrollY` 1384, CI's figure exactly, and 492.1875 at `scrollY` 66 two frames later. In `chromium-light` no back step's box moved after `focusin`. The test's own read, straight after the press resolved, matched the box two frames later in 19 of 19 back steps here: the timer wins the race on this machine, and lost it on CI's.
- Primitives sweep, not reproduced; shown by its time against its 30 s limit. The unchanged test, two workers under the same load: 27.0 s in `webkit-light` and 12.1 s in `chromium-light`. In the full run below, at two workers, the same sweep took 31.7 s in `webkit-light`, past the old limit; only its new 80 s let it pass.

**After (EXECUTED).**

- The same five, `webkit-light`, as first built: 4 passed, 1 skipped (18, then macOS WebKit only). After the review's finding 1, 18 runs and passes in both projects (below).
- Chat L1, `--repeat-each=8`, `webkit-light`: 8 of 8 passed.
- The six specs in full (`toast`, `pagination`, `chat`, `bar-glass`, `compositions`, `primitives`), `webkit-light` and `chromium-light`, two workers, as first built: 448 tests, 436 passed, 12 skipped, 0 failed, in 8.7 minutes. The skips are each listed in `ENGINE_ONLY`: 18 in both projects, and in `webkit-light` the 8 bar-glass blur tests (`onlyIn("chromium")`), pagination 24 and toast 68 (`notIn("webkit")`). In that run: toast 64a 15.5 s in WebKit and 8.0 s in Chromium; the walk at 1440 6.2 and 2.0 s, at 320 4.0 and 1.8 s; chat L1 13.9 and 11.8 s.
- Bar glass at 1440, the same four pages, two workers, the same load: 4 of 4 passed in `webkit-light`, 9.6 to 13.7 s, and in `chromium-light`, 5.6 to 7.3 s. WebKit's lowest readings are now 12.96, 12.46, 12.93 and 12.46, beside Chromium's 16.43, 13.46, 16.69 and 13.55. They moved because the boxes now sample the glass behind the text. All are far above 4.5.
- Primitives sweep, the same run: 21.8 s in `webkit-light` and 10.5 s in `chromium-light`, against its new 80 s.
- `bun test tests/unit/engine-only.test.ts`: 12 of 12 pass, two of them new fixtures: a platform call matches only an entry with the same platform, and only `onlyIn` and `adaptsIn` take one. `ENGINE_ONLY`: 3 `onlyIn`, 4 `notIn`, 4 `onlyProjects`, 12 `adaptsIn`, unchanged; two entries now carry `platform: "darwin"`.
- `bun test tests/unit/engine-only.test.ts tests/unit/fault-ledger.test.ts tests/unit/macos-webkit.test.ts`: 24 of 24 pass.
- `bun run lint`: clean. `bun run check`: 0 errors, with one change to how it ran (see the notes below).

**Notes.**

- The memo's fix for pagination needs a helper that can name a platform. The smallest that lists "the same way" is an optional argument on the two helpers that need it, carried as an optional field on the entry. An entry without it, and `030`'s reading of `engine`, are unchanged. INFERRED.
- **The change review's fixes (EXECUTED).**
  - Finding 1, 18 in every engine. `pagination.spec.ts` and `chat.spec.ts` in full, `webkit-light` and `chromium-light`, two workers: 54 tests, 53 passed, 1 skipped (24, `notIn("webkit")`). 18 passed in both. `ENGINE_ONLY` is now 2 `onlyIn`, 4 `notIn`, 4 `onlyProjects`, 12 `adaptsIn`. No unit test pins the per-helper count; `engine-only.test.ts` logs it and checks the sum. Only 15a's entry carries `platform` now.
  - Finding 1, by mutation. In a scratch copy of the worktree (not its `src/`), 027 decision 3's guard in `pagination.svelte`'s `go()` was broken: `const inside = true;` in place of `ref.contains(document.activeElement)`. With that copy built and served, 18 failed in both `chromium-light` and `webkit-light`: expected "body", received "Page 12". 15a passed in both. The copy was then deleted; the worktree's build was never changed.
  - Finding 1, macOS. macOS WebKit still checks the guard with real clicks, through 15a's `adaptsIn("webkit", …, "darwin")` branch: there a click focuses no button, and the item must move no focus either.
  - Finding 3. Chat L1, `--repeat-each=8`, both projects: 16 of 16 passed with the two new assertions.
  - `bun test tests/unit/engine-only.test.ts tests/unit/fault-ledger.test.ts tests/unit/macos-webkit.test.ts`: 24 of 24 pass. `bun run lint`: clean.
- **For `030`'s builder (the change review, finding 2).** `ENGINE_ONLY` entries may carry `platform`. Such an entry applies only on that system, so on CI's Linux an `onlyIn` with `darwin` runs nowhere and an `adaptsIn` with `darwin` adapts nowhere. `030`'s coverage test must subtract `ENGINE_ONLY` entries by engine and platform, not by engine alone. The design lead carries this into `030` decision 3 before that build.
- The macOS branches were not run here: this container has no macOS. They are today's WebKit branches, unchanged but for the platform. INFERRED.
- **`bun run check` in a worktree.** The worktree shares the main checkout's `node_modules` through a symlink. `tsconfig.json` extends `$app/tsconfig`, which SvelteKit writes into `node_modules/$app` with `rootDirs` relative to that folder, so the worktree's `./$types` imports resolved against the main checkout. `bun run check` reported 110 errors there: missing `./$types` modules, and the implicit `any` types they leave in `src/routes`. The same `svelte-check` run with a temporary tsconfig whose `rootDirs` are the worktree's own (`[".", "./.svelte-kit/types"]`) checked 2430 files and found 0 errors. The temporary file was removed. EXECUTED.
- **The scorecard:** no row moves; these are fixes to tests. INFERRED, to be confirmed at the change review.
