# Review of 022x and 022y — The fifth run's test faults, and the hot corners (built)

Reviews the built changes for two lane-E small changes:

- [`specifications/022x-the-fifth-runs-three-test-faults.md`](../specifications/022x-the-fifth-runs-three-test-faults.md);
- [`specifications/022y-the-voiceover-job-turns-the-hot-corners-off.md`](../specifications/022y-the-voiceover-job-turns-the-hot-corners-off.md).

Both rest on [the fifth matrix run](../research/2026-11-17-the-fifth-matrix-run.md) (*the memo*), §2, §3.2, §3.3 and §7. A small change has no spec review; this is its change review (constitution §5). This reviewer wrote neither the changes, nor the specifications, nor the memo.

Terms. A _window_ is one named capture of phrases (`sr.after`). A _walk_ is a run of the reader's `next()` steps. _VO chr_ is VoiceOver with Chromium; _VO wk_ is VoiceOver with WebKit. A _hot corner_ is a screen corner that runs a macOS action when the pointer reaches it.

- **Date:** 2026-11-17
- **Status:** in review
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

## Disposition

