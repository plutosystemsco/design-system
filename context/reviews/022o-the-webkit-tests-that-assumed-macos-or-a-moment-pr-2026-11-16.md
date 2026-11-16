# Review of 022o — the WebKit tests that assumed macOS, or a moment (the built change)

Reviews the small change [`022o`](../specifications/022o-the-webkit-tests-that-assumed-macos-or-a-moment.md). Its research is [WebKit on Linux](../research/2026-11-16-webkit-on-linux.md) (§1, §2.1, §3, §5, §6, §7). This reviewer wrote neither the specification nor the code (constitution §5).

- **Date:** 2026-11-16
- **Status:** dispositioned; lands
- **Reviewer:** a reviewer; not the author
- **Reviewed:** the uncommitted working tree of the worktree `lane-e-webkit`, on `0933f1b`. Ten files, +185 −37: `tests/e2e/{bar-glass,chat,compositions,pagination,primitives,toast}.spec.ts`, `tests/e2e/engines.ts`, `tests/e2e/engine-only.ts`, `tests/unit/engine-only-check.ts`, `tests/unit/engine-only.test.ts`. No file under `src/` changes.
- **Re-ran:** Bun 1.4.4, Linux, 4 cores, load average 4 to 6 (another builder's WebKit runs beside these). Playwright 1.64.1, browsers from `/opt/pw-browsers`, `E2E_PREBUILT=1` on the worktree's `build/`, one worker.
  - `bun test tests/unit/engine-only.test.ts tests/unit/fault-ledger.test.ts tests/unit/macos-webkit.test.ts` → **24 pass, 0 fail**, 102 expects. `ENGINE_ONLY`: 3 `onlyIn`, 4 `notIn`, 4 `onlyProjects`, 12 `adaptsIn`.
  - Toast 64 (all eight) and pagination 15a and 18 (all four), `webkit-light` and `chromium-light` → **24 passed, 2 skipped** (18's WebKit click, in both), exit 0.
  - The same five at `0933f1b`, from a scratch copy of its `tests/` against the same build, `webkit-light` → **5 failed**: 64a, 64c, 64d "toBeFocused … Received: inactive"; 15a "after 5", expected "Page 1", received "Page 5"; 18 expected "body", received "Page 12". CI's errors.
  - Chat L1, `--repeat-each=8`, both projects → **16 passed**. At `0933f1b`, `webkit-light` → **4 of 8 failed**: `before` 412, 413, 455, 469 against 410.
  - Bar glass at 1440 (four pages), the compositions walk (three tests) and the primitives sweep, both projects → **16 passed**, exit 0. WebKit's lowest readings 12.96, 12.46, 12.46, 12.93; Chromium's 16.43, 13.46, 13.55, 16.69. The sweep took 21.7 s in WebKit and 10.6 s in Chromium, against its new 80 s.
  - Three mutations of the unit check, on a scratch copy of `tests/`: each adds the two expected faults (criterion 7).
  - Three probes against the built site (pager guard, log settle, glass sampling), in both engines. Kept in the scratchpad, not here.
  - `bun --bun prettier --check` on the ten files and the specification → clean. `tsc --noEmit` on the ten files, with a scratch tsconfig whose `rootDirs` are the worktree's → 0 errors.
- **Not re-run:** macOS, Firefox, the dark projects, GitHub Actions. The specs in full (the builder ran 448 tests). No mutation of `src/` (the toast's 026 mutation sets B and C were not re-applied).

## Acceptance criteria against evidence

A small change states its defect, fix and check, not counted criteria. Its claims are taken one at a time.

1. **Toast 64a, 64c, 64d raise by keyboard, and still test what 026 test 64 is for** — met.
   - EXECUTED: fails first at `0933f1b` (3 of 3), passes after (both projects).
   - READ: 026 test 64 is about the steps after the raise. A button under the stack is focused by Tab, or a panel scroll or inserted content moves the focus under it. How the toast is raised is not part of it. 64g already raises by `focus()` and Enter.
   - INFERRED: every step after `raise()` is unchanged, so 026's mutation sets B (64a) and C (64c, 64d) still meet the same assertions. The keyboard raise leaves `:focus-visible` focus on the raise button. But that button is clear of the stack, and 64a's "Tab back to Save: visible" step shows nothing is aside there.
2. **15a and 18 take a platform: macOS WebKit keeps its check, Linux WebKit is checked as Chromium** — met for 15a; for 18, see finding 1.
   - EXECUTED: 15a by click fails first in `webkit-light` (the macOS branch), and passes after under Chromium's expectation: focus on each pressed page. Linux WebKit is now checked, not adapted, so it carries no `adapts` annotation there.
   - READ: on macOS `onPlatform("darwin")` is true, so both calls behave as before. `tests/test.ts:17` is the precedent for `process.platform`. No `connectOptions` in `playwright.config.ts`, so the worker's system is the browser's.
   - INFERRED: the macOS branches were not run here. They are the old WebKit branches, unchanged.
   - EXECUTED: 18 now skips in `webkit-light`, as in `chromium-light`. It runs in no CI configuration (finding 1).
3. **Chat L1 waits for `scrollTop` to hold still; `stillScroll()` hides no scroll fault** — met.
   - EXECUTED: fails first (4 of 8), passes after (8 of 8 in each project).
   - EXECUTED, the log probe: after the wheel of −300, Linux WebKit eases over four or five frames (383, 277, 154, 117, 110) and holds at 110. Chromium is at 110 on the first frame. Both settle 300 px from the end, released.
   - INFERRED: a log the item kept moving would never hold still, and `expect.poll` would time out. A fault that moves it on a stream still shows, since the stream comes after the wait. A settle that lands at the end would pass unseen (finding 3).
4. **Bar glass screenshots with `scale: "css"`; the reading stays meaningful** — met.
   - EXECUTED: 4 of 4 in each project. Before, at DSF 2, each CSS box indexed the top-left quarter of a twice-size image: the wrong glass.
   - EXECUTED, the glass probe on `/components/button/` at 1440, `webkit-light`, at four scroll positions. Lowest reading from the `css` image against the device image with each box doubled (the right pixels at full resolution): 12.46 and 12.46; 16.66 and 16.66; 12.46 and 13.72; 12.96 and 12.93. Two device screenshots taken back to back are not identical (66 to 96 % of bytes equal), so the glass itself varies by this much between shots. The `css` image is no more lenient than that variation.
5. **The compositions walk reads two frames after the key press** — met.
   - EXECUTED: 3 of 3 in each project. Not reproduced here, before or after, as the builder found.
   - READ: memo §6 shows WebKit scrolls on a zero-delay timer after `focusin`; the builder's probe saw the box move by the second frame. `toast.spec.ts`'s `frames()` is the precedent.
   - INFERRED: SC 2.4.11 judges the focus as the person sees it, after the reveal. Two frames later is that state. Chromium has scrolled before `focusin`, so it reads the same as before.
6. **The primitives sweep's time-out grows with its pages** — met.
   - EXECUTED: 21.7 s in WebKit, 10.6 s in Chromium, against 80 s.
   - READ: `perf.spec.ts:314`, `30_000 + 5_000 * pages.length`, is the same shape. The sweep finds loops by evaluation, not by time, so a longer limit hides no loop.
7. **`ENGINE_ONLY` and the calls stay in step, a platform included** — met.
   - EXECUTED: 12 of 12 in `engine-only.test.ts`, two new fixtures among them.
   - EXECUTED, by mutation on a scratch copy: (a) 18's entry without `platform`; (b) 15a's call without `"darwin"`; (c) 18's call with `"linux"`. Each gives "a … call has no ENGINE_ONLY entry" and "an ENGINE_ONLY entry with no … call". The copy's baseline has one unrelated fault, a `ruling` path its folder lacks. The worktree's own tree passes.
   - READ: the run-time check (`engines.ts`, `requireListed`) also compares `e.platform === platform`, so a mismatch throws in the browser run too.
8. **Nothing in `src/` changes** — met, EXECUTED (`git status --short src` is empty).
9. **Scorecard: no row moves** — met, INFERRED. Tests only; no item, page, token or rendered text changes. The run log's 2026-11-16 row for `022i`, `022j` and `022k` is the precedent. A row for `022o` is due at landing.

## Findings, most severe first

1. **Medium. Test 18 now runs in no CI configuration, and `030` will fault it in all six** (`tests/e2e/pagination.spec.ts:418–441`, `tests/e2e/engine-only.ts:197–207`).
   The test is the only evidence for 027 decision 3's guard, negative case: a press that starts outside the `nav` moves no focus (027 test 18, second bullet). CI runs Linux only. Linux WebKit now skips it, as Chromium and Firefox already did. So the guarantee is proven only on a developer's Mac, never in the run that publishes evidence (constitution §4.4). `030` sharpens this. Its coverage test subtracts each entry "by engine" (`030` decision 3, l. 226), so it expects 18 in both WebKit cells. And it grades a skip by any entry without `gap: "no-user"` as a fault (decision 5, l. 281). The specification's "skips in Linux WebKit as it does in Chromium" reads a loss as neutral.
   Failure: CI on Linux, any project → 18 skipped; the guard could be deleted and every CI run stays green. Under `030`: "focus on pagination: 18 … did not run in webkit-light", in every cell.
   Evidence, EXECUTED (probe, both engines, Linux): on the buttons example, page 11, focus blurred to `body`, a script click on Next (`el.click()`) → page 12 current, focus stays on `body`. The same script click with focus on Next → focus moves to "Page 12". So a script click separates the two states in every engine.
   Fix (recommended): make 18 engine-neutral. Blur, then press Next by `button(n, "Next page").evaluate((el) => (el as HTMLElement).click())`, and assert `body`. Drop the `onlyIn` call and its entry (`onlyIn` 3 → 2). Retitle it "18. a press on Next onto the last page, from outside the nav, moves no focus". It then runs in all six projects. macOS keeps a real-click check of the guard through 15a's `adaptsIn(…, "darwin")` branch. Prove it by mutation: with the guard removed in a build copy, the new 18 fails in Chromium. The item's guard reads focus in the `nav`'s click handler (027 landing notes, deviation 3), so a script click meets the same code a real one does.
   Other option: keep 18 as built, and say in the landing notes that it runs on macOS only and that `030` must subtract by platform. This leaves the guarantee unproven in CI.
2. **Low. `platform` is a field `030` does not know** (`tests/e2e/engine-only.ts:29–32`; `030` decision 3, l. 219 and 226).
   `030` describes an entry as "either `engine` … or `projects`" and subtracts by engine. An entry with `platform: "darwin"` applies nowhere on CI's Linux. A reader of `engine` alone counts it wrong. With finding 1's recommended fix, only 15a's `adaptsIn` carries a platform. `030` reads `adapts` from the run's annotations, which are right on each system, so no count goes wrong today.
   Fix: one line in 022o's landing notes, for `030`'s builder: "`ENGINE_ONLY` entries may carry `platform`; such an entry applies only on that system, so on CI's Linux an `onlyIn` with `darwin` runs nowhere and an `adaptsIn` with `darwin` adapts nowhere. `030`'s coverage test subtracts by engine and platform." The design lead carries it into `030` decision 3 before that build.
3. **Low. `stillScroll()` does not say where the log came to rest** (`tests/e2e/chat.spec.ts:175`).
   A log that eased back to its end would pass as "held still". It would then be followed again, not released. The test would catch that only if the stream moved it, and says nothing about why. The probe shows it rests 300 px from the end today.
   Fix, after `await stillScroll(region);`:
   ```ts
   // Still released once it rests: the wheel's ease-out did not reach the end.
   expect((await scrollState(region)).atEnd).toBe(false);
   await expect(button).toBeVisible();
   ```

## Constitution checks

- §4.1 source, not a package: unaffected. No registry item or `static/r/` file changes.
- §4.3 tokens are the one source: unaffected. No colour or size is added. `bar-glass` still reads colours from computed styles.
- §4.4 accessible, and proven in three engines: the five fixed tests now pass in Linux WebKit, where CI runs. Pagination 18 is the exception (finding 1). The toast's Linux WebKit Shift+Tab fault after a click is an engine bug (memo §1), not an item's. The tests now step around it, as memo §1 recommends.
- §4.5 and §4.6 pinned inputs, named dependencies: no dependency added; `bun.lock` unchanged.
- §5 small change: tests only, one lane, no interface change, no token, no dependency. Checks seen failing first for fixes 1 to 3, re-seen here. Fixes 4 to 6 are shown by size, by timing and by time against a limit, as the specification says.
- §6 never: nothing committed or pushed. No prior art copied. No installed app can break: nothing it installs changes.

## Verdict

Does not land yet: finding 1 (Medium), pagination 18 now runs in no CI configuration though an engine-neutral check is at hand; findings 2 and 3 are write-ins.

## Disposition

By the design lead, 2026-11-16, with the builder's fixes. The design lead did not write `022o`, and re-checked the fixes.

1. **Fixed** by the builder, as the finding recommends. Test 18 runs in every engine: Enter to page 11, focus blurred to `body`, a script click on Next; page 12 is current and focus stays on `body`. Its `onlyIn` and `ENGINE_ONLY` entry are gone (`onlyIn` 3 → 2), and it is retitled. The builder's mutation (027 decision 3's guard made always true, in a scratch copy) failed it in `chromium-light` and `webkit-light` ("Page 12" where `body`). The spec says macOS WebKit still checks the guard with real clicks through 15a. EXECUTED by the design lead: 18 passes in `chromium-light` and `webkit-light`.
2. **Fixed.** The spec's landing notes tell `030`'s builder to subtract `ENGINE_ONLY` entries by engine and platform.
3. **Fixed.** Chat L1 asserts, after `stillScroll()`, that the log is not at its end and the scroll button is visible. EXECUTED by the design lead: L1's three tests pass in both projects; the builder's `--repeat-each=8`, 16 of 16.

After the fixes (the builder's figures): `pagination.spec.ts` and `chat.spec.ts` whole, both projects, 53 passed and 1 skipped (pagination 24, `notIn("webkit")`); the `ENGINE_ONLY` unit tests, 24 of 24; lint clean.

Closing verdict: lands.
