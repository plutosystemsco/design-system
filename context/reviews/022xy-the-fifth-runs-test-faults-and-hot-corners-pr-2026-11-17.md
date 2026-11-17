# Review of 022x and 022y — The fifth run's test faults, and the hot corners (built)

Reviews the built changes for two lane-E small changes:

- [`specifications/022x-the-fifth-runs-three-test-faults.md`](../specifications/022x-the-fifth-runs-three-test-faults.md);
- [`specifications/022y-the-voiceover-job-turns-the-hot-corners-off.md`](../specifications/022y-the-voiceover-job-turns-the-hot-corners-off.md).

Both rest on [the fifth matrix run](../research/2026-11-17-the-fifth-matrix-run.md) (*the memo*), §2, §3.2, §3.3 and §7. A small change has no spec review; this is its change review (constitution §5). This reviewer wrote neither the changes, nor the specifications, nor the memo.

Terms. A _window_ is one named capture of phrases (`sr.after`). A _walk_ is a run of the reader's `next()` steps. _VO chr_ is VoiceOver with Chromium; _VO wk_ is VoiceOver with WebKit. A _hot corner_ is a screen corner that runs a macOS action when the pointer reaches it.

- **Date:** 2026-11-17
- **Status:** dispositioned 2026-11-17 (see Disposition). Both land: `022y` after the first re-check, `022x` after the second, which found finding 7 fixed.
- **Reviewer:** a reviewer; not the author
- **Reviewed:** the worktree `.claude/worktrees/lane-e-run5`, branch `lane-e-run5`, from `71cb067`, uncommitted.
  - `git diff`: 7 files. `.github/workflows/matrix.yml`, `tests/e2e/bar-glass.spec.ts`, `tests/sr/chart.sr.ts`, `tests/sr/dropdown-menu.sr.ts`, `tests/sr/rules.ts`, `tests/unit/sr-rules.test.ts`, `tests/unit/workflow.test.ts`.
  - Untracked: the two specifications.
  - Read beside them:
    - `tests/sr/sr.ts` (`listen`, `steps`, `fact`, `judge`) and `tests/sr/fixtures.ts` (the `sr` fixture's teardown);
    - `@guidepup/playwright` 0.21.0, `screenReaderTest.js`;
    - `@guidepup/guidepup` 0.40.0: `macOS/VoiceOver/VoiceOver.js` (`stop`, `capture`), `VoiceOverClient.js` (`stop`, `#waitForAllActions`, `#processQueue`), `preferences/mountGuidepupPreferences.js`;
    - `@guidepup/setup`'s macOS steps;
    - `layerchart`'s `Tooltip.svelte` and `@layerstack/svelte-actions`' `portal.js`;
    - `src/lib/registry/ui/chart/*`, `theme-toggle.svelte`, `button.svelte`, and `src/lib/site/examples/dropdown-menu/keyboard.svelte`.
- **Before and after:**
  - `git diff | sha256sum` → `41e5e04e…16938e5`;
  - `git status --porcelain | sha256sum` → `369e329a…1b33164`, 9 entries;
  - the two specifications: `69227e89…4b98` (`022x`) and `ce219bf4…21aa` (`022y`).
  - The same after every probe. This review is the only new file.
  - Each file a probe changed was first copied to the scratchpad, then copied back. `sha256sum -c` passed for `rules.ts`, `dropdown-menu.sr.ts`, `bar-glass.spec.ts` and `matrix.yml`.
  - The one probe file in `tests/sr/` was deleted after each run.

## Re-ran

EXECUTED in this container, 4 cores, beside other agents' runs (load average 5 to 15). Browser runs used `E2E_PREBUILT=1 E2E_PORT=4252` against the worktree's existing build. There is no `src/` change, so the build is current.

- **(b), the unit tests.** `bun test tests/unit/sr-rules.test.ts` → **62 pass**. With `rules.ts` at `71cb067` → **5 fail, 57 pass**: the X0 case and four of the five new `022x` cases. The fifth new case ("run 5's VO chr walk") checks only C1 and the fixture's shape, so it passes on either `rules.ts`.
- **(b), probes.** A scratch test against the built `rules.ts`, with walks made up for each edge (findings 2 and 3).
- **(a), a probe.** A copy of the sub-menu test with End and ArrowUp removed, so focus stays on "Profile". `SR_DRY=1`, `chromium`, `--timeout=90000`, no retries. Result: **failed in 11.0 s**, "the sub-menu did not open within 10 s of ArrowRight; focus was not on the parent item "Invite users" but on [data-slot="dropdown-menu-item"] "Profile Shift Cmd P"", `[cause]: TimeoutError: waitFor: Timeout 10000ms exceeded`.
- **(c), the hover check.**
  - `/` at 1440, `webkit-light`, `--repeat-each=20`, two workers, at the real 250 ms: **20 passed** (57.8 s).
  - At 50 ms, standing in for a late transition, 10 repeats each:
    - with `transitionsDone`: **10 of 10 passed**;
    - without it: **7 of 10 failed**, each "hovering Dark theme".
- **(c), a probe of the animations.** Headless WebKit and Chromium on `/` at 1440. It hovered each control in the bar and listed every animation on the panel's subtree for 1 s:
  - the toggle's `background-color` transition, 200 ms, is the only one on a descendant. It ends at `rgb(233, 229, 219)`, the same colour as CI's `rgba(233, 229, 219, 0.173)`;
  - the panel's `::after` `opacity` transition, 600 ms, runs on every hover;
  - the toggle's transition is first seen *pending*, with no start time. It is created by the probe's first `getAnimations()`, which flushes style. So `getAnimations()` does see a transition that the page has not yet started.
- **`022y`.** `bun test tests/unit/workflow.test.ts` → **26 pass**. With `matrix.yml` at `71cb067` → **25 pass, 1 fail**, the new test: "Expected: >= 0, Received: -1".
- **The gate.**
  - `bun run check` → 2434 files, 0 errors, 0 warnings.
  - `bun run lint` → "All matched files use Prettier code style!".
  - `bun test ./tests/unit` → **1917 pass, 2 skip, 2 fail**, 68 files. Both failures are the highlighter's timing tests:
    - `highlight.test.ts`, "the 18 specimens in a fresh process" (1530 ms);
    - `highlight-session.test.ts`, "the streaming budget" (p95 per chunk).
    - The unchanged tree, `git archive 71cb067` in the scratchpad, fails the **same two** under the same load (1965 ms; 779 ms). The changed tree, re-run beside it, fails the same two. Neither touches this change.
  - `SR_DRY=1 bun run test:sr --project=chromium` → **87 passed** (1.7 m); `--project=webkit` → **87 passed** (1.8 m).
  - `bar-glass.spec.ts`, `chromium-light` and `webkit-light`, two workers → **54 passed, 8 skipped** (the blur tests, `onlyIn("chromium")`).
  - `SR_READER=voiceover … --list --shard=k/5`, k = 1 to 5 → **19, 17, 19, 16, 16** in webkit and in chromium. The chart is in shard 1 and the dropdown menu's three tests are in shard 2, as before.
- Not run: the full e2e suite, Firefox, any real reader, macOS.

## The check against evidence

- **`022x` (a)** — **met.** EXECUTED: the probe fails in 11.0 s with the cause named, where the unfixed body waits out the test's timeout (the builder's probe, READ; the code shows the same, since `waitFor()` had no timeout). The dry run passes, and its new fact holds.
- **`022x` (b)** — **met.** EXECUTED: 5 fail before, 62 pass after. The fixture's cell steps, 22 and 24, and the walk's order match the memo §3.2 (READ). The other steps are labelled as shaped.
- **`022x` (c)** — **met, with the limit the specification states.** EXECUTED: the 50 ms stand-in fails without the fix (7 of 10 here, 20 of 20 for the builder) and passes with it. At 250 ms it passes 20 of 20, as it did before the fix. CI's flake does not reproduce here.
- **`022y`** — **met as far as Linux can check.** EXECUTED: the unit test fails first and then passes. The step's effect on a macOS runner is for the next run (finding 4).

## The fix against the code

**(a) `dropdown-menu.sr.ts`.** Matches the specification.

- Before ArrowRight, `sr.fact` records whether `document.activeElement` is the sub-trigger, by its `data-slot`. The example has one sub-trigger, "Invite users" (`keyboard.svelte:63`), so the slot alone names it.
- The wait is `waitFor({ timeout: 10_000 })`. On a timeout it throws an error that says where focus was, by slot and text, with the `TimeoutError` as its `cause`.

**Does the 10 s bound the hang, teardown included?** Yes. READ:

- guidepup's fixture tears down with `screenReader.stop()` (`screenReaderTest.js`, `finally`).
- VoiceOver's `stop()` first calls the client's `stop()`, which awaits `#waitForAllActions()`: every queued capture, and the one in flight (`VoiceOverClient.js`).
- In run 5 the capture in flight was the sub-menu window's action. Its `waitFor()` had no timeout, and the page that could end it is torn down after `screenReader`, which depends on it. So `stop()` waited until the teardown's own timeout: the memo's 5 more minutes an attempt.
- Now the action rejects after 10 s. `#processQueue` rejects the capture and clears `#inFlight`, so `stop()` has nothing to wait for.

INFERRED from that code: the change ends the teardown wait as well as the test's. It does not say so; the review records it.

**(b) `rules.ts` and `chart.sr.ts`.** Matches the specification.

- C1 and C2 share `inOrderAt`.
- C2 returns its X0 when the order is not found, and when the steps are empty.
- Otherwise it reads the steps before the header's phrase, plus the header's own phrase up to the header.
- The search for each text starts where the one before it ended. So the boundary is the "day" after the caption, never the one inside "weekday" in the figure's name (EXECUTED, the unit case).
- `chart.sr.ts` is the one caller (READ, `grep`), and no mutation patch names the chart.

**Is the boundary right against the memo's walk?** Yes. READ, the memo §3.2: the name, the 14 ticks, "Show as table", then "Day", with the cells at steps 22 and 24. Everything before "Day" is still read, and the table's rows are not.

**Does the boundary hide a tooltip a walk could reach?** No, for this item. READ:

- layerchart's `Tooltip` portals by default (`portal: portalProp = true`) to `.PortalTarget` or `document.body`.
- The chart sets no portal target (`grep`).
- So a shown tooltip sits at the end of `<body>`, after the table in reading order, and a 25-step walk from before the figure does not reach it.

INFERRED: C2 guards a regression, a tooltip back in the figure's flow. That would lie before the header, where C2 still reads.

**(c) `bar-glass.spec.ts`.** Matches the specification.

- After the 250 ms wait, `transitionsDone` loops. Each time round, it takes the panel's `getAnimations({ subtree: true })` and keeps those that are running, finite, and on a descendant element, not on the panel and not on a pseudo-element. It awaits their `finished`, swallowing a cancelled one, and looks again.

**Does skipping pseudo-elements miss what the check reads?** No. READ: `translucent()` walks `panel.querySelectorAll("*")` and calls `getComputedStyle(el)` with no pseudo-element. It reads neither the panel nor any `::before` or `::after`. So the filter waits for exactly what the check reads. Its comment says the same.

**Is the fix sound, given the flake does not reproduce at 250 ms?** Yes. EXECUTED (the probe above): `getAnimations()` flushes pending style, so a hover whose transition the page has not started yet is found, pending, and waited for. So whatever made the start late, the read now comes after the transition ends. The 50 ms stand-in exercises that path. A test that waits for the state it reads is the right shape for a timing flake. A longer fixed wait would only move the threshold.

**Is mid-fade still the best explanation?** Yes. EXECUTED:

- the toggle's transition is the only one on a descendant of the panel;
- CI's colour, `rgba(233, 229, 219, 0.173)`, is that transition's end colour at a partial alpha;
- the builder's 50 ms reads, alpha 0.11 to 0.18, are the same colour.

INFERRED: what is still not seen is *why* the transition started about 200 ms late on CI: a starved WebKit process, or a hover applied late. The fix covers both, provided the hover has been applied by the time of the read (finding 5).

**`022y`, `matrix.yml`.** Matches the specification.

- One unconditional step in `voiceover` (READ, lines 218–228). It comes after `sr:setup` and its `failure()` step, and before `sr:install`, the browser install, the site download and `test:sr`.
- `grep` finds `com.apple.dock` and `killall` in no other job.
- The job list stays at 45 (EXECUTED, `workflow.test.ts`).

**Does killing the Dock interfere with guidepup's VoiceOver set-up?** No. READ:

- `sr:setup` (`guidepup setup --ci --macos-record`) runs before the step and is finished by then. It writes TCC rows, AppleScript control, Do Not Disturb (itself `killall usernoted && killall ControlCenter`), and the dictation and splash defaults. None of it is the Dock's.
- VoiceOver itself starts per test, in the fixture's `screenReader.start()`, which mounts guidepup's portable preferences and restarts `cfprefsd`. That is minutes later, after `sr:install`, the browser install and the download.
- `launchd` relaunches the Dock within seconds. `defaults write` has already handed the values to `cfprefsd`, and the Dock reads them on relaunch. So the later `cfprefsd` restart does not undo them. INFERRED; nothing here runs macOS.

**Should `wvous-*-modifier` be set too?** No. A modifier only gates a corner that has an action. With the action off, the modifier is never read. The default Quick Note corner needs no modifier, so leaving the modifiers unset changes nothing. INFERRED.

**Are `defaults write … -int 0` and `killall Dock` right on macOS 26 (Darwin 25)?**

- The keys are right. `wvous-{tl,tr,bl,br}-corner` in `com.apple.dock` are what Desktop & Dock's Hot Corners write, and a Dock restart is how a written value takes effect.
- The value is the open question: finding 4.

**Scope.** `git status -- src static` is empty, and `git diff --stat -- src static` prints nothing (EXECUTED). Every changed file is a test, a rule, a unit test or the workflow.

## Findings, most severe first

1. **Medium (`022x` (a)): when the sub-menu does not open, the evidence that would say why is thrown away** (`dropdown-menu.sr.ts:77–92`; `sr.ts`, `listen`).
   - READ:
     - the error is thrown inside the act. Under VoiceOver it leaves `this.reader.capture(act)` before the wait capture runs, and `listen` throws before `this.windows["sub-menu"] = phrases`;
     - so `phrases.json`, attached in the fixture's teardown, holds the focus, open and parent windows. It does not hold what VoiceOver said after ArrowRight, nor that window's item text, which `022q` decision 8 added as "evidence of where VoiceOver's cursor was";
     - `judge()` is never reached, so no `faults.json` is attached either.
   - The memo §3.3 says the cause "is not seen". The next VO chr run is the only place to see it. The DOM fact gives focus *before* ArrowRight; the lost window would give what the reader did *after* it. The specification's note ("INFERRED: enough") does not weigh that.
   - Fix (the test only, no rule change):
     - catch the timeout inside the act and set a message, so the window completes and is recorded;
     - after `sr.after`, if the message is set, record `sr.fact("the sub-menu opened within 10 s of ArrowRight", false)` and `await sr.judge([{ rule: "X0", message }])`. A dry run then fails on the fact and a real run on the X0, and `faults.json` carries it;
     - add focus *after* the timeout to the message, by slot and text, beside focus before;
     - re-run the probe; it should fail in about 11 s with the window present in `phrases.json`.
   - No `finally` is needed, because nothing is thrown out of the window. It costs nothing on a pass.

2. **Low (`022x` (b)): two or more silent steps at the start of a walk make C1 fail falsely, and C2 return its X0** (`rules.ts`, `inOrderAt`, the `starts` loop).
   - EXECUTED:
     - `C1(["", "", FIGURE, "Show as table", "Day column 1 of 2"], …)` → C1 ""Visitors per weekday, last week" was not spoken whole". One leading "" passes; none passes.
     - The same at `71cb067`'s C1 → the same fault. So `022q` brought this in, and `022x` moved it into the shared search.
   - Cause: while `joined` is still empty, the loop still adds 1 to each new phrase's start. Two empty phrases put the figure's name one phrase "later" than its first character. The name then seems to span three phrases and is skipped as not whole.
   - It is not seen in a log. But guidepup logs `""` for a `next()` that spoke nothing (`VoiceOverClient.js`, `#processQueue`), and `steps()` keeps the log raw.
   - Fix: take each start before appending, as `joined.length + (joined ? 1 : 0)`, with no later `+= 1`. Add unit cases with one, two and three leading `""`, seen failing first.

3. **Low (`022x` (b)): C2's boundary is "the start of `inOrder`'s last entry", and nothing holds the list to three** (`rules.ts`, `C2`).
   - EXECUTED:
     - `C2(steps, TOOLTIPS, [])` → `TypeError: undefined is not an object (evaluating 'header.phrase')`;
     - `C2([FIGURE, "Visitors 164", "Show as table", "Day"], TOOLTIPS, [FIGURE])` → `[]`. The boundary becomes the figure's name, so C2 reads only the speech before the chart and passes having read none of it.
   - So the two cases asked about come out like this. C2 cannot read *everything*: an order that is not found is X0. It *can* read nothing, if a caller passes a chart with no table as `[FIGURE]`. Only `chart.sr.ts` calls it today, and it passes three.
   - Fix, either:
     - return X0 ("C2: no header to bound the walk") when `inOrder` has fewer than three entries; or
     - take the header as its own argument, `C2(steps, tooltips, { order, header })`, and say in the doc comment that the boundary is the header's start.
   - Add the two cases above as unit tests.

4. **Low (`022y`): the corners are set to 0, a value macOS's own settings never write, and the log shows only the values before** (`matrix.yml:223–228`).
   - INFERRED, not checkable here (no macOS):
     - Hot Corners' "–" writes `1`, and the documented list (Apple's settings, nix-darwin's `wvous-*-corner` option) gives `1` as Disabled;
     - `0` is the old "no-op". It is widely used and probably works, but nothing in this repository shows that the Dock in macOS 26 does not fall back to its default, Quick Note, for an unknown value.
   - The step prints the corners *before* the writes. On a fresh runner with no `wvous` keys that prints nothing, and nothing shows what took effect.
   - A wrong value costs the chart's VO wk result for one more full run: 4 minutes of test time, and a run's wait.
   - Fix:
     - write `-int 1` for the four corners;
     - add `defaults read com.apple.dock | grep wvous || true` again after `killall Dock`, so the log shows the values before and after;
     - update the specification's Terms ("0 means no action") and the unit test's six lines.

5. **Low (`022x` (c), already in the old test): the read does not check that the hover took** (`bar-glass.spec.ts:326–333`).
   - INFERRED: if a loaded WebKit has not applied `:hover` when `transitionsDone` runs, there is nothing to wait for. The background is still clear, and the check passes without having seen the hover state.
   - The fix closes the failure CI saw. This is the opposite case, a silent pass, and the old test had it too.
   - Fix (optional, same pass): before `transitionsDone`, `expect.poll(() => control.evaluate((el) => el.matches(":hover"))).toBe(true)`.

6. **Note, out of scope: 21 other `waitFor()` calls inside screen-reader windows have no timeout** (`grep`, `tests/sr/*.sr.ts`: `alert-dialog.sr.ts:19`, `dialog.sr.ts:24`, `dropdown-menu.sr.ts:24` and others).
   - READ, the teardown above: any of them that never resolves gives the same 10 minutes an attempt, five in the test and five in `stop()`.
   - None has hung in five runs. It is not this change's defect.
   - Next: if one ever hangs, a lane-E small change to give the suite's waits one bound, such as an `actionTimeout` in `playwright.sr.config.ts`, rather than fixing them one by one.

**Checked, not findings.**

- C2's search starts after the caption, so the "day" in "weekday" is never the boundary.
- A tooltip text split over two phrases just before the header is still read (EXECUTED: `["…", "Visitors", "164 Day"]` → C2).
- Empty phrases in the middle of a walk keep every start right (EXECUTED).
- The `022x` (a) fact only feeds the message in a real run; `judge()` checks facts in a dry run alone. That is right: in a real run the rule, O3s, judges, and the fact explains.
- `transitionsDone`'s loop has no bound of its own. The test's timeout bounds it, and the only animation that repeats on hover, the panel's `::after` sheen, is filtered out.
- The memo §2's motion-page flake (`doors.spec.ts:618`) is untouched, as the specification says.

## Constitution checks

- §4.1 source, not a package; §4.3 tokens; §4.5 and §4.6 pins and dependencies: met. Test code, a rule, unit tests and one workflow step. No dependency, token or item changes.
- §4.4 accessible by default, and proven: met. C2 still faults a tooltip before the table (EXECUTED, three unit cases). The dropdown test fails sooner and says more. Finding 1 would make it say more still.
- §5 a small change: the defect, fix and check are each on one page. Each check was seen failing first: EXECUTED here for (a), (b), the (c) stand-in and `022y`. This is the review by someone who did not write it.
- §6 never: nothing committed or pushed, no prior art copied.

**The scorecard.** No row moves (READ, `context/research/benchmark-scorecard.md`). Row 3, accessibility evidence, scores what is published and recorded, and these are fixes to tests and a CI runner. The run-log entry waits for the next matrix run. This confirms both specifications' INFERRED "no row moves".

## Verdict

- **`022x`: lands once finding 1 is fixed.** (a), (b) and (c) each do what the memo asked, and each check was seen failing first. Finding 1 is a short change to one test: without it, the next run's one chance to see why VO chr's sub-menu does not open loses half its evidence. Findings 2 and 3 are one-line guards with unit cases, and belong in the same pass. Finding 5 is optional.
- **`022y`: lands.** The step is in the right job, in the right place, and comes before VoiceOver starts. Finding 4 is a one-line change and a read-back, worth taking before the next run, because the step's effect can only be seen there.

That was the verdict on the first build. The verdicts after the rebuild close the Disposition.

## Disposition

The builder fixed findings 1 to 5 in the same worktree, and added one change of its own: the hover read in (c) is now polled for up to 5 s. This re-check reads the rebuilt diff and both specifications' "after the change review" notes. Note 6 is not done; the design lead queues it, which is right for a note out of scope.

**State.**

- Before and after this re-check:
  - `git diff | sha256sum` → `b3b37b49…62374`;
  - `git status --porcelain | sha256sum` → `c3ef9137…c846d`, 10 entries, this review among them;
  - the specifications: `57376ff0…` (`022x`) and `b21c4791…` (`022y`).
- Every file a probe changed was copied to the scratchpad first and copied back. `sha256sum -c` passed for `rules.ts`, `dropdown-menu.sr.ts`, `bar-glass.spec.ts` and `matrix.yml`. The probe file in `tests/sr/` was deleted. Only this file was edited.

**Re-ran.** EXECUTED, `E2E_PREBUILT=1 E2E_PORT=4252`, at load averages of 1 to 7.

- `sr-rules.test.ts` and `workflow.test.ts` → **92 pass**.
- With the *first build's* `rules.ts` → **3 fail**: two and three leading silent steps, and fewer than three entries.
- With the first build's `matrix.yml` → **1 fail**, the `022y` test.
- My edge probe from the first review, on the rebuilt `rules.ts`:
  - one, two and three leading `""` now pass C1, and C2 still faults a tooltip text before the header;
  - empty phrases in the middle still pass;
  - `[]`, `[FIGURE]` and `[FIGURE, CAPTION]` each give "C2: no header to bound the walk".
- **(a), the probe.** Focus left on "Profile", `SR_DRY=1`, `chromium`, JSON reporter. It **failed in 10.9 s**.
  - `phrases.json`'s windows: `focus`, `open`, `parent`, `sub-menu`.
  - `faults.json`: one X0, "the sub-menu did not open within 10 s of ArrowRight; focus before it was on div[data-slot="dropdown-menu-item"] "Profile Shift Cmd P", and after the wait on div[data-slot="dropdown-menu-item"] "Profile Shift Cmd P"".
  - The dry run's failure lists the two facts that do not hold.
- **(c), as built, `webkit-light`, 20 repeats each:** `/` at 1440 → **20 passed**; `/` at 390 → **20 passed**.
- **(c), stand-ins, `/` at 1440, `webkit-light`, no retries:**
  - **E.** The toggle's `:hover` background forced to alpha 0.5 → **3 of 3 failed** after 5 s, "hovering Dark theme", `rgba(233, 229, 219, 0.5)`.
  - **F.** `hover()` replaced by `scrollIntoViewIfNeeded()` → **3 of 3 failed**, "pluto, Kuiper Design System is hovered" (finding 5's guard).
  - **A.** The hover *lost* right after `transitionsDone` (the mouse moved off the toggle), as built with the poll → **5 of 5 passed**.
  - **B.** The same, with the first build's single read → **2 of 5 failed**, at `rgba(233, 229, 219, 0.99)` and `0.996`: a fade-*out*, read as it starts.
  - **C.** The same lost hover, with a poll that holds `:hover` and the read together → **5 of 5 failed**.
  - **D.** C's combined poll with no lost hover → **5 of 5 passed**.
- **(c), a hunt for the cause.** A scratch WebKit script at 390, 40 page loads, six busy loops beside it. After the same wait as the test, it read the toggle every 25 ms for 500 ms, with listeners for pointer and transition events. **0 of 40** showed a late fade, a lost `:hover`, or any event after the wait.
- **The gate, for what the rebuild touched:**
  - `bun run check` → 0 errors;
  - `bun run lint` → clean;
  - the dry run of `dropdown-menu.sr.ts` and `chart.sr.ts` → 4 of 4 in `chromium` and in `webkit`;
  - `bar-glass.spec.ts`, `chromium-light` and `webkit-light` → **54 passed, 8 skipped**;
  - VoiceOver `--list --shard=k/5` → 19, 17, 19, 16, 16.

**The findings.**

1. **Fixed.** The timeout is caught inside the action (`.then(() => true, () => false)`), so the window ends and is recorded. Then a false fact and an X0 through `judge()` name focus before and after. EXECUTED above.
   - A note, not a condition: the catch takes any error as "did not open", a crashed page included. Rethrowing anything but a `TimeoutError` would keep the message true. Optional.
2. **Fixed.** Each phrase's start is taken before it is appended. EXECUTED: failing first, then passing.
3. **Fixed.** Fewer than three entries is X0. EXECUTED: failing first, then passing.
4. **Fixed.** `022y` writes `-int 1` and reads the corners again after `killall Dock`. Its Terms and the unit test say the same. EXECUTED: failing first, then passing.
5. **Fixed, and then weakened by the polled read** (finding 7). EXECUTED: stand-in F fails at the guard.
6. **Not done; queued by the design lead.** Out of scope, as the first review said.

**The polled read: is it the right fix, or does it hide a defect?**

- **A poll is the right shape.** The check judges *states*: a control at rest, and a control hovered (019a decision 3, "at rest or on hover"). A colour fade from clear to solid passes through every alpha between them, by its nature. A frame of that fade is not a state the decision is about. So waiting for the fade to end is what the check means, and a fixed wait only moves the threshold. A real defect, a hover state that stays translucent, still fails, with its value (stand-in E).
- **As built, it does hide one defect: a hover lost after the wait.**
  - Stand-in A: the toggle loses `:hover` after `transitionsDone`. The poll waits out the fade-*out* and passes on a clear control that is no longer hovered: the silent pass that finding 5 closed. The first build's single read caught it 2 of 5 times (B).
  - CI's residual value, `rgba(233, 229, 219, 0.886)`, fits both stories: near the end of a fade-in, or early in a fade-out (B read 0.99 and 0.996 at the start of one). INFERRED: the builder's "a fade that started after `transitionsDone` looked" is one of two readings, and a lost hover is the other. The poll passes either way. So it may be absorbing exactly the case nobody has explained.
- **Should the cause be found first?** Not as a condition of landing. About 300 runs have not repeated it: the builder's 220, my 40 probe loads and my 40 test repeats. More hunting here is unlikely to pay. But the poll should not erase the signal. Each time the first read is translucent, the test should say so, so CI's report keeps collecting the cases the poll forgives.

7. **Medium (new, the polled read): the poll accepts a read in which the control is no longer hovered** (`bar-glass.spec.ts`, the second `expect.poll`).
   - Evidence: stand-ins A to D above.
   - Fix:
     - poll the hover and the read together, so a pass is a read of the hover state. Stand-in C's form: the polled value is `"not hovered"` when `control.matches(":hover")` is false, followed by `translucent(page)`'s list, and it must equal `[]`, with the same message and 5 s timeout. EXECUTED: it fails a lost hover 5 of 5 (C) and passes the real test 5 of 5 (D);
     - recommended in the same pass: when the first read is not `[]`, add a test annotation with that first value and the running animations' targets and properties, and keep polling. The test still passes on a late fade, and the report says it happened, so the cause can be found from CI's own runs;
     - in the landing notes, record both readings of 0.886, not only the late fade.

**Verdicts after the rebuild.**

- **`022x`: lands once finding 7 is fixed.**
  - Findings 1, 2, 3 and 5 are fixed and verified, each seen failing first.
  - (a) bounds the hang, the teardown's included, and now keeps the window's evidence. (b) reads the right speech, with no silent-step or short-order holes.
  - (c) is right in shape. Its poll must also hold the hover, or it can pass a control nobody is hovering. That is a one-expression change, with stand-ins A and C as its check. The annotation is recommended, not required.
- **`022y`: lands.** Finding 4 is fixed and verified. The step writes the value System Settings writes, and the next run's log shows the corners before and after.

**The second re-check, of finding 7 and finding 1's note.** It reads only those two changes and the landing note on 0.886.

- **State.** Before and after:
  - `git diff | sha256sum` → `33bf1986…74436f`;
  - `git status --porcelain | sha256sum` → `c3ef9137…c846d`.
  - Each probed file was copied to the scratchpad first and copied back; `sha256sum -c` passed for `bar-glass.spec.ts` and `dropdown-menu.sr.ts`.
  - The probe files in `tests/sr/` were deleted. Only this file was edited.
- **What changed.**
  - `bar-glass.spec.ts`: one polled function, `hovered`. It returns `["not hovered"]` when the control does not match `:hover`, and `translucent(page)` when it does. It must equal `[]` within 5 s. A non-empty first read adds a "022x: a translucent first read" annotation, holding the value and the panel's running animations (`running()`, by target, property and current time).
  - `dropdown-menu.sr.ts`: the catch returns `false` only for an `Error` named `TimeoutError`, and throws anything else on.
  - `022x`'s landing notes give both readings of 0.886.
- **Re-ran.** EXECUTED, `webkit-light`, `/` at 1440, no retries, JSON reporter.
  - **A, my lost-hover probe.** The mouse moves off the toggle right after `transitionsDone` → **5 of 5 failed**, "hovering Dark theme". Each was annotated `["not hovered"]`, with the toggle's `background-color` fade-out running at 22 to 37 ms. In the first re-check this probe passed 5 of 5.
  - **As built:** **20 of 20 passed**, with no annotation.
  - **A late fade-in.** The toggle's background was forced clear for 400 ms after `transitionsDone`, then released, so a fade-in starts just before the read → **5 of 5 passed**. Three were annotated, at alpha 0.004 to 0.01, with the toggle's fade at 34 to 39 ms.
  - **E, a hover state that stays translucent** (alpha 0.5) → **3 of 3 failed** after 5 s, with that value, annotated.
  - **Finding 1's note, (a).**
    - The probe with focus left on "Profile" → **failed in 10.8 s** as the X0, with the `sub-menu` window in `phrases.json`.
    - A stand-in with a malformed selector, a non-timeout error → **failed in 0.9 s**, with Playwright's own "Unexpected token … while parsing css selector" thrown on. Before, it would have been "did not open".

8. **Low (new, optional): a fade read at its very first frame passes as "clear"** (`bar-glass.spec.ts`, `hovered`).
   - EXECUTED: in the late fade-in stand-in, 2 of the 5 passes had no annotation. INFERRED: their first read came before the fade had moved, at alpha 0. `translucent()` counts alpha 0 as clear, so the poll passed at once, before the hover's end state existed.
   - That is the same in every version of this test, and it needs a fade that starts between `transitionsDone` and the read. It cannot fail a good control. Rarely, it could pass a bad one, if the hover state were translucent and its fade restarted in that window.
   - The comment's "a pass is a read of the hovered control, settled" is not quite true: nothing checks "settled".
   - Fix (optional): have `hovered` also return `"still fading"` while a finite transition runs on a descendant (`transitionsDone`'s filter), or drop "settled" from the comment.

**Closing verdicts.**

- **`022x`: lands.**
  - Findings 1, 2, 3, 5 and 7 are fixed and verified, each against a stand-in that fails without the fix. Finding 1's note is taken.
  - The polled read is now what the check means: the hovered control's state, within 5 s. A lost hover fails, a lasting translucent hover fails with its value, and a late fade passes with a record in CI's report.
  - Finding 8 is optional. Note 6 is the design lead's to queue.
- **`022y`: lands**, as at the first re-check.


- **Finding 8, by the design lead (2026-11-17):** taken the simpler way: the test comment no longer calls a pass "settled", and names the alpha-0 first read. The poll is unchanged; the gap is as old as the test.
