# Review of 022 — The test matrix

Reviews [`specifications/022-the-test-matrix.md`](../specifications/022-the-test-matrix.md).

- **Date:** 2026-11-15
- **Status:** in review; does not land yet
- **Reviewer:** a reviewer; not the author
- **Reviewed:** the specification as drafted, 2026-11-15 (592 lines), and its memo, `research/2026-11-15-test-matrix-and-screen-readers.md` (237 lines). They were checked against these:
  - the constitution, `AGENTS.md`, `README.md` step 4 (proof by mutation), and `roadmap.md` row `022`, §5 and §6 Q1;
  - the owner's rulings the brief carries: the full matrix runs on GitHub Actions on the public repository; a tag waits on a green run; agents never push; the owner changes no macOS setting;
  - the tree at `beeb67e` plus its uncommitted work.

  In the tree I read:
  - `playwright.config.ts`, `package.json`, `bunfig.toml`, `vite.config.ts`;
  - `scripts/site/release-check.ts`, `scripts/site/markdown.ts`, `scripts/a11y/voiceover-error-summary.ts`, `scripts/bench/serve.ts`;
  - every `tests/e2e/` read of the project, and the files that use CDP, clipboard permissions and forced colours;
  - `registry.json`, and the source of `status`, `alert`, `marker`, `stage-card`, `live-console`, `input-group`, `breadcrumb` and `message`;
  - `node_modules/@sveltejs/kit/src/exports/vite/preview/index.js` (SvelteKit 3.1.0);
  - `tests/unit/registry.test.ts` lines 1890–1916.
- **Re-ran:** nothing in the repository was written but this file. `git status --porcelain` hashed the same before and after.
  - `bun --bun playwright test --list --output=<scratch>` → "Total: 2981 tests in 28 files": `light` 1,501, `dark` 1,475, `perf` 5 (EXECUTED). This matches the memo.
  - `grep` of `tests/e2e/` for `\.project\.name` → 42 reads in 15 files (EXECUTED). The memo's 46 in 16 is off (finding 10).
  - npm registry, 2026-11-15 (EXECUTED): `@guidepup/guidepup` 0.40.0 (2026-11-01, MIT); `@guidepup/setup` 0.29.3 (2026-10-14, MIT, binary `guidepup`, no install scripts in it or its five dependencies); `@guidepup/playwright` 0.21.0 (2026-10-25, MIT, peers `@playwright/test` ≥ 1.62.1 and `@guidepup/guidepup` ≥ 0.38.0); `@playwright/test` 1.65.1 (2026-11-13). No npm package is named plain `guidepup`.
  - GitHub's API, 2026-11-15 (EXECUTED): all five action tags resolve to the SHAs the specification pins, and each is that action's latest release.
  - `guidepup/guidepup-playwright` at `main` (EXECUTED, raw files): the VoiceOver workflow runs `macos-15`, `macos-26` and `xcode-27`; the NVDA workflow runs `windows-2022` and `windows-2025`. Both use `npx … @guidepup/setup@0.29.2 setup --ci` (with `--macos-record` on macOS), then install, then `… install`. Its README says capture "defaults to `"initial"`".
  - `guidepup/setup-action` README (EXECUTED): "This GitHub action is no longer supported. Please use the `@guidepup/setup` CLI directly."
  - GitHub docs (READ, fetched 2026-11-15):
    - the runners page lists `ubuntu-24.04`, `windows-2025` and `macos-26` (arm64, 3 CPU, 7 GB) for public repositories, and says "Use of the standard GitHub-hosted runners is free and unlimited on public repositories";
    - the limits page gives Free 20 concurrent jobs, 5 of them macOS. It does not say the limits differ for public repositories. The plan that counts is the `plutosystemsco` account's;
    - the events page says of `workflow_dispatch`: "This event will only trigger a workflow run if the workflow file exists on the default branch";
    - the concurrency page says a pending run in the group is cancelled when a newer one queues, unless `queue: max` is set.
  - `gh repo view` → public, default branch `main`. `git ls-remote --heads origin` → only `main` (EXECUTED).
  - `gh run list --json` → its fields include `event`, `headSha`, `attempt` and `displayTitle`, but no workflow inputs (EXECUTED, gh 2.103.3).
  - `which docker` → `/usr/local/bin/docker` (EXECUTED). I did not start it.

## Findings table

| # | Severity | Finding | Where |
|---|---|---|---|
| 1 | High | The `site` artifact holds `build/` alone, but `vite preview` serves `.svelte-kit/output/`. Every test job's server would find no build | decision 6; the workflow |
| 2 | High | A `workflow_dispatch` run needs `matrix.yml` on `main`. The plan's mutation run, "one click, no push", cannot start while the workflow lives only on a release branch | decision 15; build step 8; Q7 |
| 3 | Medium | The shard estimate is off by a factor of two. The slowest shard lands near 20 minutes, not 12, before the first run's failures and retries | decision 7; memo §1 |
| 4 | Medium | The release check cannot tell a mutation run from a release run as written. It also accepts pull-request runs, which test a merge commit, and re-run attempts | decision 19 |
| 5 | Medium | "A release commit's run always finishes" is false. GitHub cancels the pending run when a third push arrives | decision 5; the workflow |
| 6 | Medium | The fault ledger's `test.fail()` accepts any failure. A new regression in a ledgered test passes green | decision 16; criterion 18 |
| 7 | Medium | The phrase rules leave the capture mode, the text matching and the negative clauses undefined. Several clauses pass on an empty log | decision 12; test 4 |
| 8 | Medium | Mutation proves 2 of the 3 rules on 4 items. The patches will rot under `023`, and "no other test fails" ignores the items that depend on them | decision 15; criterion 15 |
| 9 | Medium | No screen-reader test runs before the owner's first push. A local dry run is possible without touching a macOS setting | build steps 4–9; Q8 |
| 10 | Low | 42 project-name reads in 15 files, not 46 in 16. The memo's grep counted the string "project name" | decision 2; criterion 2 |
| 11 | Low | Clipboard permissions are granted in 4 files, not 2 | memo §4 |
| 12 | Low | The list of 29 holds, with three write-ins: `breadcrumb`, `input-group` and how `alert` is derived | decision 11 |
| 13 | Low | Workflow write-ins: `bun x --no-install`, `needs` passed through `env`, the empty `mutate` input, the setup version, Bun 1.3.14 against the local 1.4.4 | decisions 10, 17, 19 |
| 14 | Low | `handoff.md` still refers to the script that decision 13 deletes. The page's "NVDA and JAWS are not tested" line is pinned by a unit test | decision 13 |
| 15 | Low | Two retries let a race in a live region pass on a release commit | decision 18; Q2 |
| 16 | Low | The `019` listen may tick row 3 (h) before `022` lands | decision 20; criterion 23 |

## Findings, most severe first

1. **The prebuilt site leaves out what `vite preview` serves** (decision 6; the workflow's `build` job, `path: build/`; `playwright.config.ts:8`).
   - SvelteKit's preview reads `.svelte-kit/output/server/manifest.js`, and stops with `preview_build_missing` if it is absent. It serves assets from `output/client` and pages from `output/prerendered`. It never reads the adapter's `build/` (READ, `node_modules/@sveltejs/kit/src/exports/vite/preview/index.js` lines 30–33, 86, 127, 149). Locally all three folders exist after a build (EXECUTED, `ls .svelte-kit/output`).
   - `build-output.spec.ts` reads `build/`, so both trees are needed.
   - `upload-artifact` drops hidden paths by default (`include-hidden-files`, default `'false'`, READ, its `action.yml` line 43 at the pinned SHA). So adding `.svelte-kit/output/` is not enough without that flag.
   - Failure: every `browsers`, `perf`, `voiceover` and `nvda` job downloads `build/`, sets `E2E_PREBUILT=1`, and starts `vite preview` against a missing `.svelte-kit/output`. The first run fails everywhere, and the cause looks like a harness bug.
   - Fix:
     - The `site` artifact holds `build/` and `.svelte-kit/output/`, uploaded with `include-hidden-files: true` (or packed into one tar first). Each test job restores both to the same paths.
     - Criterion 7 and `workflow.test.ts` check both paths.
     - Or serve `build/` with a static server (`scripts/bench/serve.ts` does this for the bench), both locally and in CI. That changes what the suite serves, and the specification would have to say so. The first option is smaller.
     - Note that `build/<page>/index.md`, which `scripts/site/markdown.ts` writes, is not under `.svelte-kit/output`. Today's preview does not serve it either, so nothing changes. Say so, so nobody "fixes" it.

2. **The mutation run cannot be dispatched as planned** (decision 15; build step 8; criterion 15; Q7 "One click on GitHub's Actions page; no push").
   - GitHub: "This event will only trigger a workflow run if the workflow file exists on the default branch" (READ, the events page). The default branch is `main`. The remote has only `main` (EXECUTED). `022` builds on a release branch, so `matrix.yml` reaches `main` only when that branch merges.
   - Failure: after owner push 1, the Actions page offers no "Run workflow" button for `matrix`. Criterion 15 cannot be met inside the plan. The owner answered Q7 on a premise that is wrong.
   - Fix:
     - Push 1 includes `matrix.yml` reaching `main`: the owner pushes the workflow file to `main` first, or merges a bootstrap commit. Q7 and Q8 then count that push.
     - Say that the dispatch picks the release branch as its ref, so the run uses that branch's workflow file and patches.
     - Or drop `workflow_dispatch` for the mutation run. Trigger it on a push to a `mutation/**` branch the owner pushes. That costs a push, and Q7 must say so.

3. **The shard estimate's arithmetic is off by two** (decision 7; memo §1, "Sizing the shards").
   - The memo takes 2.2 s per test on a runner, and 2,950 tests per engine. 2,950 × 2.2 s = 6,490 s, which is **108 worker-minutes, not 54**. Firefox and WebKit, at 1.5×, are about 162 (INFERRED, the memo's own inputs).
   - With 5 shards of 2 workers, a Chromium shard is about 11 minutes of tests and a Firefox or WebKit shard about 16. Add the memo's 4 minutes of set-up: **about 15 and 20 minutes, not 12.** That sits on decision 7's own 20-minute threshold.
   - The first run will have failures. A failing test waits out its assertion timeouts, and `retries: 1` runs it again. The `browsers` job's `timeout-minutes: 30` is then within reach. A timed-out shard uploads no blob, and the run's evidence has a hole.
   - The 2-worker figure also assumes 4 vCPUs is 4 cores. A runner's vCPUs are hardware threads, and each worker drives a full browser beside `vite preview` (INFERRED). So 2.2 s is optimistic, not conservative.
   - Fix:
     - Correct memo §1 and decision 7.
     - Raise the shard count for Firefox and WebKit, for example to 8 per engine (Chromium 5 or 8). Raise `timeout-minutes` to 45 for the first run.
     - Say that jobs over the 20-at-once limit queue; they do not fail. Then the peak-concurrency paragraph no longer constrains the count.
     - Keep criterion 21's rule.

4. **The release check, as written, can pass on the wrong run** (decision 19; test 8; criterion 19).
   - **Mutation runs.** `gh run list --json` returns no workflow inputs (EXECUTED, its field list). A mutation run's `gate` *succeeds* when the comparison passes. It has the same `headSha` as a release run on that commit. "Non-mutation" is required, but nothing says how it is told apart.
   - **Pull-request runs.** For `pull_request`, "`GITHUB_SHA` … is the last merge commit of the pull request merge branch" (READ, the events page). A green PR run has tested the merge result, not `HEAD`.
   - **Re-runs.** "Re-run failed jobs" makes a new attempt of the same run, and its conclusion replaces the old one. A browser test that failed once, which decision 18 says must fail the run, becomes green with one click. `gh` exposes `attempt`.
   - Fix:
     - Accept a run only if all of these hold: `event` is `push`; `headSha` equals `HEAD`; `gate` succeeded; and every `browsers`, `checks` and `perf` job succeeded rather than being skipped. Skipped jobs mark a mutation run.
     - Belt and braces: set `run-name: ${{ inputs.mutate && 'matrix (mutation)' || 'matrix' }}` and reject a `displayTitle` that says mutation.
     - Say what happens when `attempt > 1`. Recommended: allowed, but the check prints it, and the design lead records it in the release's landing notes.
     - Test 8 gains three fixtures: a PR run, a mutation run whose `gate` succeeded, and a re-run attempt.

5. **A release commit's run can be cancelled before it starts** (decision 5, "never on `main` or `release/**`, so a release commit's run always finishes"; the workflow's `concurrency`).
   - With `cancel-in-progress: false`, a run already going is safe. But "any existing `pending` job or workflow in the same concurrency group will be canceled" when a newer one queues (READ, GitHub's concurrency docs). With three pushes to `release/0.13.0`, the middle commit never gets a run.
   - The landing plan (`roadmap.md` §2, "Ledger file") lands seven wave-1 specs one at a time on that branch. Close pushes are likely.
   - Also: a pull request from a branch in this repository triggers both a `push` run and a `pull_request` run on the same commit. That is 42 jobs and 8 macOS jobs at once, against limits of 20 and 5.
   - Fix:
     - For pushes and dispatches, group by commit: `group: matrix-${{ github.event_name == 'pull_request' && github.ref || github.sha }}`. Then no release commit's run is ever replaced. Keep cancellation for pull requests.
     - `workflow.test.ts` checks the expression.
     - Say whether a pull request from a branch in this repository also runs. Recommended: no; its push run is the evidence. Pull requests from forks still run.

6. **A ledgered test hides any new failure in the same test** (decision 16; criterion 18).
   - `test.fail()` expects *a* failure, not *the* failure. The first failed assertion also ends the test, so nothing after it is checked while the line stands.
   - Failure: `axe.spec.ts` checks every rule on one page per test. Say `/components/x/` fails `color-contrast` in WebKit and is ledgered. A later change adds an `aria-required-children` violation on that page in WebKit. The test still fails "as expected", and the run stays green. The same holds for a screen-reader test ledgered for one rule.
   - Q3's recommended answer, an empty ledger before a tag, catches it at the latest when the line is removed. But between landings, `gate` is green over a real regression. Under Q3's option 2 the regression could ship.
   - Building it: Playwright has no hook in the config that runs per test. A fixture works only for files that import the extended `test`. Today all 28 spec files import `test` from `@playwright/test`. The Scope lists only the 16 files' scheme reads.
   - Fix:
     - Each ledger line carries a matcher for its expected failure: a substring of the error, an axe rule id, or a rule fault from `rules.ts`. It names exactly one project, or one reader and browser pair.
     - An automatic fixture marks the test `test.fail()`. After the test, it checks that each recorded error matches the line. If one does not, it fails the test with "a ledgered test failed for a reason the ledger does not name".
     - Scope: every `tests/e2e/*.spec.ts` and `tests/sr/*.sr.ts` imports `test` from one shared module.
     - Criterion 18 gains a third case: a ledgered test that fails for a different reason turns the run red.

7. **The phrase rules are not yet specific enough to judge, and three clauses pass on silence** (decision 12; test 4; the memo §2's "assertions should test for a phrase's text").
   - **The capture mode.** guidepup's default `capture` is `"initial"`, which "captures the first page of output, but not subsequent content" (READ, guidepup's VoiceOver API page; the `@guidepup/playwright` README). A live region speaks after the action's first output. VoiceOver speaks a tooltip's description after a pause, like a hint. Under `"initial"`, both can be missing from the log while a listener hears them. `019`'s script used the default, and only the owner's ear passed it.
   - **Matching.** "Spoken whole" does not say what counts:
     - one phrase, or the joined log;
     - with case, whitespace and punctuation normalised or not. "Enter the owner's email address" has an apostrophe a reader may echo differently;
     - with the reader's own words ("status", "alert", "heading level 2") allowed around it.
     `019`'s `judge` matches inside one phrase (`p.includes(message)`, `scripts/a11y/voiceover-error-summary.ts:45–49`). VoiceOver can split a long message across phrases.
   - **Silence passes three clauses.** "Not spoken before the change", "not read twice in a row" and "ten `next()` steps never speak a phrase from the page behind" are all true of an empty log. NVDA in focus mode, or a `next()` that does not move, produces exactly that.
   - **"A phrase from the page behind"** has no definition. Words like "Close", "Cancel" or "button" are on both sides.
   - **Escape returns to the trigger** does not fit every overlay. A tooltip never takes focus, so nothing is re-spoken. A sub-menu's Escape returns to its parent item, not to the menu's trigger.
   - **`chart`'s** "no tooltip text interrupts them" has no test you could write from the text.
   - Fix:
     - Every screen-reader test starts its reader with `capture: true`. Say so in decision 12, and pin it in `fixtures.ts`.
     - `rules.ts` states one normalisation: lower case; collapse whitespace; drop quotes, apostrophes and final punctuation. A message is "spoken whole" if its normalised text is a substring of one normalised phrase, or of two adjacent phrases joined by a space. Test 4's fixtures include a split message and a curly apostrophe.
     - Each negative clause has a positive precondition, or the test fails as "nothing to judge":
       - the "before" window is captured separately, and the capture after the change is not empty;
       - for a modal, the ten steps produce at least three distinct phrases from inside the dialog.
     - "The page behind" is a sentinel: before opening, the test inserts a visible paragraph with unique text outside the overlay's subtree. That is test code, not a site edit. The rule fails if the sentinel is ever spoken.
     - The Escape clause applies to overlays that take focus: dialog, alert-dialog, sheet, popover, dropdown-menu. Tooltip: after Escape, the tooltip is gone and focus is still on its trigger. Sub-menus: Escape speaks the parent item's name.
     - `chart`: list exactly what is checked. For example, `next()` from the figure reaches its caption and then the table's first header, and no tooltip text appears in that log.

8. **The mutation proof is narrow, and it will rot** (decision 15; criterion 15; `README.md` step 4).
   - The four patches exercise the live rule (`status`, `error-summary`), the overlay's name (`dialog`) and the return of focus (`popover`). Three clauses are never shown to fail:
     - the focus rule;
     - modal containment;
     - "not read twice", which was `019`'s actual risk.
     The clauses most likely to be vacuous (finding 7) are the ones left unproven.
   - "Each named test fails … and no other" ignores the dependency graph (READ, `registry.json`):
     - removing `status`'s role also breaks `code-block`, `composer`, `stage-card`, `live-console`, `sign-in`, `sign-up`, `settings`, `page-states`, `chat` and `product-home`, wherever their tests hear a status (EXECUTED, the transitive `registryDependencies`);
     - the `error-summary` patch reaches `sign-in`, `sign-up` and `settings`.
     A hand-written `expected.json` will be wrong on the first try.
   - The patches are `git apply` diffs against item source. `023` runs in the same wave, in lane I, and puts a doc comment on every prop of every item, including these four. Their context lines change, and `git apply` fails in `build`. Nothing local notices, because nothing local applies them.
   - "Fails" is also too weak. A test can fail because its set-up locator timed out (`getByRole("status")` no longer exists), not because a rule caught the fault.
   - Fix:
     - Add three patches: (5) `message`'s header loses `tabindex="-1"`, or `sign-up` stops focusing the new step's heading (the focus rule); (6) the dialog loses its modality, so the sentinel behind is reachable (containment); (7) `error-summary`'s `role="alert"` goes back onto the root, `019`'s old structure (read twice).
     - `expected.json` names each test, reader, browser and the rule fault it expects. `report` compares the fault, not only the failure.
     - A unit test derives the affected tests from the registry graph and `SR_ITEMS`, and checks `expected.json` against it.
     - A unit test runs `git apply --check` on every patch, which writes nothing. A rotted patch then fails `bun run test:unit` locally, and in `checks`, not on the owner's dispatch.

9. **Nothing in the screen-reader half runs before the owner's first push** (build steps 4 to 9; Q8; the memo §7, "Every CI change needs a push").
   - About 29 files, four reader and browser pairs, three rules and a new config are first executed in CI. The Linux WebKit and Firefox runs are also first seen there (decision 4 runs macOS WebKit). "Two pushes and one dispatch" assumes the first CI run needs one round of fixes. Each round costs the owner a push.
   - "No machine here may run them" is true of VoiceOver. It is not true of every reader. Docker is installed here (EXECUTED). guidepup publishes `ghcr.io/guidepup/guidepup` for Orca on Linux, and `@guidepup/playwright` ships `orcaTest` (READ, its README). Playwright publishes a Linux image at each version. Neither changes a macOS setting, and the Orca run would not be evidence.
   - Fix (an owner question, recommended first):
     1. **The builder may run containers on this machine, with no system setting changed.** Before push 1, `tests/sr/` runs once under Orca in guidepup's image, as a dry run of the test code. The suite also runs once in Playwright's Linux image at 1.64.1, for Linux-only engine faults. Both are recorded in the landing notes as rehearsal, not evidence.
     2. `@guidepup/virtual-screen-reader` dry-runs the flows in a browser: weaker, with no container.
     3. Neither: the plan's push count goes up, and Q8 says so.
   - Either way, Q8's text names the likely number of pushes honestly.

10. **The count of scheme reads is 42 in 15 files** (decision 2; Scope; criterion 2; test 2; memo §4).
    - `grep '\.project\.name' tests/e2e` → 42 reads in 15 files (EXECUTED). The memo's 46 in 16 matched the unescaped `project.name` against the string "project name": `error-summary.spec.ts` lines 33, 35 and 169, and `primitives.spec.ts` line 829. `error-summary.spec.ts` has no real read.
    - Three of the 42 are labels, not scheme reads: `doors.spec.ts:574` and `577`, and `site.spec.ts:733`.
    - `code.spec.ts:1461` already reads `info.project.use.colorScheme`. It keeps working.
    - Fix:
      - Correct the counts.
      - Test 2's pattern is `/\.project\.name\b/`, so the strings do not trip it.
      - Say that labels use `info.project.name` through an allowed helper, or that criterion 2 covers scheme reads only.

11. **Clipboard permissions are granted in four files, not two** (memo §4).
    - `test.use({ permissions: ["clipboard-read", "clipboard-write"] })` appears in `code.spec.ts:442`, `nav.spec.ts:245`, `keyboard.spec.ts:1039` and `1463`, and `search.spec.ts:263` (EXECUTED).
    - `brand.spec.ts:75` opens a CDP session inside a test with no guard. It needs `onlyIn("chromium", …)` or an engine-neutral rewrite.
    - Fix: correct the memo, and list these as the expected first `ENGINE_ONLY` or harness cases.

12. **The list of 29 is right, with three write-ins** (decision 11; memo §6; test 5).
    - Checked against `registry.json`'s 75 items and their dependencies: no item with a live region, a focus move or an overlay is missing. `hero`, `cta-band`, `marketing-footer`, `stage`, `stage-hero` and `proof-band` rightly stay out (READ).
    - **`breadcrumb`** matches the overlay search only through a comment (`breadcrumb-ellipsis.svelte:17`, "wraps it in a DropdownMenu.Trigger"), as `toggle-group` does. The memo's "Not included" omits it. Test 5 will demand it. Add it to `SR_EXCLUDED`.
    - **`input-group`'s** focus move is a pointer convenience. A click on a non-interactive addon focuses the input (`input-group-addon.svelte:47–54`); a screen-reader user never makes that click. Its password toggle changes its own name, which the exclusion reasoning ("announce their own state") already covers. Either test what a reader meets, for example "Show password" becoming "Hide password" after activation, or move it to `SR_EXCLUDED` with that reason.
    - **`alert`** gets its role through `ROLE[variant]` (`alert.svelte:55–66`), not a literal `role="…"`. So the derivation in test 5 does not find it. Today it is listed by hand, so nothing breaks. But a new item built the same way would escape. The derivation should also look for the strings `"status"`, `"alert"` and `"log"` in a role map.

13. **Workflow write-ins** (decisions 10, 17 and 19; the YAML).
    - `bun x guidepup` downloads a package by that name if the local binary is missing. None exists on npm today (EXECUTED), but anyone could publish one. Use `bun x --no-install guidepup`.
    - `bun scripts/ci/gate.ts '${{ toJSON(needs) }}' …` puts expression output into a shell string. Pass it through `env: { NEEDS: ${{ toJSON(needs) }}, MUTATE: ${{ inputs.mutate }} }`. On a push, `inputs.mutate` is empty: `gate.ts` treats empty as false, and test 7 has that case.
    - guidepup-playwright's green runs use `@guidepup/setup@0.29.2`. The specification pins 0.29.3, which has no such evidence. Either is defensible. Say which, and why.
    - CI pins Bun 1.3.14 (`packageManager`). The memo's executed measurements, including `Bun.YAML`, are on Bun 1.4.4. Build step 1's check on 1.3.14 is right. Also run criterion 3 once locally under 1.3.14, or note the difference in the landing notes.

14. **Two loose ends around the moved script** (decision 13).
    - "Nothing else refers to it (EXECUTED, grep)" is not so. `handoff.md:30` still tells the owner to run `scripts/a11y/voiceover-error-summary.ts` before the 0.12.0 tag. The listen has passed (`d8d658d`), so the line is stale. Fix: update `handoff.md` in the same landing.
    - `tests/unit/registry.test.ts:1913–1915` requires the Error summary page to say "NVDA and JAWS are not tested." After `022`, NVDA is tested, but the page keeps the line until `030`. The specification already leaves the page to `030`. Add one sentence so the builder does not edit the page, or the pinned line, by mistake.

15. **Two retries let a race in a live region pass on a release commit** (decision 18; Q2).
    - A status that announces only some of the time is a real fault in exactly this system: "mount it first, then set the text" (`status.svelte:22–23`). With two retries, an announcement that works half the time passes 7 runs in 8.
    - Fix: keep retries for development pushes. On a release run, any screen-reader flake gets a ledger line (and so blocks the tag under Q3) unless the design lead records it as timing. Put this to the owner as part of Q2's first option.

16. **Row 3 (h) may already be ticked** (decision 20; criterion 23).
    - The owner's `019` listen passed and is recorded (`d8d658d`; `019`'s Status line, which `registry.test.ts` reads). The scorecard's last run, at `ea1f9bd`, predates it ("(h) None", `benchmark-scorecard.md:163`). The next re-run may tick (h) from `019`.
    - Fix: decision 20 says (h) is credited to whichever lands first. If `019`'s listen is credited, `022`'s change review cites its evidence for (h), the scripted runs, without moving the count.

## Acceptance criteria against evidence

- Criteria 1, 2, 4 to 11, 13 to 16, 19 and 20 can fail on today's code (READ: no seven projects, no `scheme.ts`, no workflow, no `tests/sr/`, no ledger, no new release checks, no new packages).
- Criterion 3 is a regression guard, rightly. Its count (2,981) is confirmed (EXECUTED).
- Criterion 12 cannot be met as the workflow stands (finding 1). Criterion 15 cannot be met as the plan stands (finding 2).
- Criterion 18 shows two of the ledger's three behaviours (finding 6).
- Criterion 21's threshold is right, but the estimate it guards is not (finding 3).
- Criterion 22: "no file under `src/lib/site/`" agrees with decision 16 sending site faults to small changes. Mutation patches are applied in CI only, so they do not trip it.

## What holds

- **The owner's rulings are honoured.**
  - The matrix runs on GitHub Actions. The repository is public (EXECUTED).
  - No agent pushes; every push and dispatch is the owner's.
  - No macOS setting on the owner's machine changes. The set-up runs on GitHub's runners, which have passwordless `sudo`.
  - A tag waits on the release check, once finding 4 is closed.
- **The facts the brief asked me to check are right.**
  - All three package versions, their licences, publication dates and peer ranges match the npm registry.
  - The setup action is marked unsupported.
  - `macos-26`, `windows-2025` and `ubuntu-24.04` are current labels.
  - Free is 20 jobs at once, 5 of them macOS.
  - All five action SHAs resolve to the tags named.
  - The suite is 2,981 tests today, and 8,881 with seven projects.
- **The shape is right.** Engine and scheme in the project's name, with the scheme read from `use`. Engine-only tests counted, not silently skipped. A site built once. One `if: always()` status. Exact runner labels. SHA-pinned actions. These follow Carbon's pattern, studied and not copied.
- **The ledger's intent is right:** a list of what is not yet true, never a list of accepted limits (constitution §4.4). Finding 6 only makes it exact.
- **The scripted set is derived and guarded by a test.** A new item with a live region cannot ship without a screen-reader run or a stated reason.

## Constitution checks

- §4.4 accessible by default, and proven: the specification is the means. Proof is **not yet** sound: findings 6, 7 and 8 leave ways for a check to pass without the property holding.
- §4.5 every input pinned: met. `bun.lock` holds the packages, guidepup's manifest pins NVDA and the VoiceOver preference files by SHA-256, runners use exact labels, and actions are pinned by SHA. VoiceOver itself follows the runner image, and Risks says so.
- §4.6 dependencies named and pinned: met. They are dev-only, MIT, and more than two weeks old. No registry item gains one.
- §5 how we work: research, then specification, then this review. "Proven by mutation" is the right tool for checks written after their code. Finding 8 makes the proof cover every rule.
- §6 never push without the owner: met. Finding 2 adds a push to `main` that the owner must know about before answering Q7.
- §6 never copy prior art: met. guidepup's and Carbon's workflows are cited, not copied.

## Verdict

Does not land yet: findings 1 (the artifact lacks what `vite preview` serves) and 2 (the mutation dispatch needs the workflow on `main`) are High. Findings 3 to 9 are Medium and stand: the shard arithmetic, the release check's run selection, concurrency cancellation, the ledger's matcher, the phrase rules' definitions, the breadth and rot of the mutations, and the absence of a local dry run. Findings 10 to 16 are write-ins.

## Disposition

The author accepted all 16 findings. The answers are in the specification's "Review" section, and the memo was corrected in place. Each is checked below.

## Re-review (2026-11-15)

I read the revised specification (842 lines) and its "Review" section, and the corrected memo's header and its new §4a. I checked the new claims against these:
- SvelteKit 3.1.0's preview source, and the server bundle the build leaves in `.svelte-kit/output/server/`;
- Playwright 1.64.1's worker and runner (`node_modules/playwright/lib/worker/workerProcessEntry.js`, `lib/runner/index.js`, `types/test.d.ts`);
- `registry.json`'s transitive dependencies;
- GitHub's docs and the `gh` CLI;
- the npm registry, and guidepup's repositories.

Nothing in the repository was written but this file. No build or test ran.

### The six claims I was asked to check

1. **One `site.tar` of `build/` and `.svelte-kit/output/` lets preview start.** It holds (READ).
   - `preview()` needs `output/server/manifest.js` and imports `output/server/index.js` (lines 30–45). It serves `output/client` (86), `output/prerendered/dependencies` (127) and `output/prerendered/pages` (149). It reads nothing else from disk.
   - adapter-static has no `emulate`, so line 67 adds nothing.
   - The server bundle holds no absolute path from the build machine (EXECUTED, grep: 0 files).
   - The bundle's bare imports are ordinary packages (`svelte`, `layerchart`, `@codemirror/*`, `shiki`, `fontkit`, `wawoff2`). The tree-sitter grammars are bundled as local chunks (`import("./tree-sitter-*.js")`). `wawoff2` and `fontkit` have no install scripts. So the specification's "each job has run `bun install`" is enough on macOS and Windows too, even though Bun skips dependencies' lifecycle scripts there.
   - A tar keeps the hidden `.svelte-kit` folder. Each job checks both files before testing. Finding 1 is closed.

2. **The bootstrap on `main`, and whether a dispatch on `--ref <branch>` uses that branch's copy of the workflow.** A source exists, and the plan holds.
   - `gh workflow run --help` (gh 2.103.3, EXECUTED) defines the flag as: `-r, --ref string  Branch or tag name which contains the version of the workflow file you'd like to run`. That is GitHub's own CLI saying that the ref's copy is the one that runs.
   - GitHub's events page agrees: for `workflow_dispatch`, `GITHUB_SHA` is the "Last commit on the `GITHUB_REF` branch or tag" (READ). The REST endpoint's `ref` is "The git reference for the workflow" (READ).
   - Decision 15's "(INFERRED …)" and the Risks bullet "A dispatched run's workflow file" can cite these and become READ.
   - The same events page also says: "Once a workflow has run at least once, you can dispatch it against any branch or tag via the GitHub API or GitHub CLI" (READ, the page's raw text, 2026-11-15). Q7's option 2 quotes it correctly. My first fetch of the page missed that sentence, and I nearly called the quote a misattribution; it is not one. See R5.
   - Finding 2 is closed.

3. **Concurrency.** It holds for every release commit.
   - A push run's group is `matrix-<sha>-full`. No other commit shares it, so no newer push can cancel a release commit's run while it waits.
   - A mutation run has its own group, `<sha>-mutation`. Only pull requests cancel.
   - `inputs` is available at workflow level, so the expression is legal there. On a push it reads as empty, so the group ends in `full`.
   - The edge the specification states is real and harmless: the same commit pushed three times waits on one run, and the release check needs only one.
   - Finding 5 is closed, except for the pull-request rule, which is R1.

4. **The ledger fixture changing a test's expected status in teardown.** Playwright's source supports it. Its docs do not document it.
   - Order of events (READ, `workerProcessEntry.js`): test-scoped fixtures are torn down at about line 1678 (`teardownScope("test", …)`). Only afterwards does `buildTestEndPayload` (line 1836) send `expectedStatus: testInfo.expectedStatus` to the runner. The runner then adopts it (`test.expectedStatus = params.expectedStatus`, `lib/runner/index.js:5963`). `types/test.d.ts:2609` declares the field without `readonly`.
   - So assigning `testInfo.expectedStatus = "passed"` after `use()`, when the recorded errors do not match the line, turns an expected failure red. `testInfo.fail()` before `use()` is a public modifier (lines 967–971).
   - The docs describe `expectedStatus` as something a test reads. Writing it is unsupported and could change in a minor release. The specification's fallback (a `ledger-mismatch` annotation that fails `report`) and criterion 19's third case are the right guards. See R4.
   - Finding 6 is closed.

5. **`expected.json` derived through the dependency graph.** The specification's examples are right (EXECUTED, transitive `registryDependencies`):
   - `error-summary` → `settings`, `sign-in`, `sign-up`;
   - `sheet` → `app-shell`, `marketing-bar`, `product-home`, `sidebar`.

   The derivation also reaches what the text does not list:
   - `alert` → `chat`, `error-summary`, `settings`, `sign-in`, `sign-up`;
   - `code-block` → `chat`, `live-console`, `product-home`, `stage-card`.

   That is fine, because the derivation runs from `hears`. A wrong `hears` fails the mutation run loudly; it cannot pass it silently. Two gaps remain, in R2.

6. **`@guidepup/setup` at 0.29.2.** The pin is right. The evidence cited is the weaker of two sources.
   - npm (EXECUTED): 0.29.2 was published 2026-10-10, is MIT, and has the same five dependencies as 0.29.3, none with install scripts.
   - 0.29.3 changes only a Debian package list, the CI actions and a dependency bump (EXECUTED, GitHub's compare API). Nothing in it affects macOS or Windows.
   - But guidepup-playwright's `yarn.lock` resolves `@guidepup/guidepup` to **0.38.0**, not our 0.40.0 (EXECUTED). Its green runs therefore pair 0.29.2 with an older guidepup, whose manifest `install` reads.
   - The stronger evidence is `guidepup/guidepup` itself. At version 0.40.0, its `playwright-voiceover.yml` and `playwright-nvda.yml` run `@guidepup/setup@0.29.2` on `macos-26` and `windows-2025`. Both workflows were green on `main` on 2026-11-08 (runs 42476096268 and 42476096312) and on 2026-11-01 (EXECUTED, GitHub's API). See R3.

### The 16 findings

| # | Closed? | Where it is answered |
|---|---|---|
| 1 | Closed | decision 6; criterion 7; test 3 (claim 1 above) |
| 2 | Closed | decision 15; build steps 8 and 10; Q7; Q8 (claim 2) |
| 3 | Closed | decision 7: 108 and 162 worker-minutes, 8 shards, 45 minutes, queueing stated. The arithmetic checks: about 7 and 10 minutes of tests a shard |
| 4 | Closed | decisions 18 and 19: `--event push`, `headSha`, `displayTitle` set by `run-name`, every declared job succeeded, attempts printed; test 9 |
| 5 | Closed, with R1 | decision 5 (claim 3) |
| 6 | Closed, with R4 | decision 16: a `where` and an `expect` per line, the automatic fixture, one shared `test` for all 28 files, criterion 19's third case. The remaining gap (nothing is checked after the failing assertion) is stated and bounded by Q3 |
| 7 | Closed | decision 12: `capture: true` pinned; separate before and after windows; one normalisation; "whole" across one or two phrases; X0 and a precondition on every rule; the sentinel; O3, O3s, T1 and T2 by overlay kind; C1 and C2 testable; NVDA in browse mode; test 4's fixtures |
| 8 | Closed, with R2 | decision 15: seven patches covering L1, L3, F1, O1, O2 and O3; derived `expected.json`; `git apply --check` in `checks`; set-up failures rejected |
| 9 | Closed | Q9, build step 5 |
| 10 | Closed | decision 2: 39 scheme reads and 3 labels; test 2's pattern |
| 11 | Closed | decision 3; criterion 5 |
| 12 | Closed | decision 11: 28 items, the exclusions, role maps read |
| 13 | Closed, with R3 | decisions 10, 17 and 19; test 3 bans `bun x`, `npx` and pasted expressions |
| 14 | Closed | decision 13; Scope "At landing". The new `/JAWS (is\|are) not tested/` matches the page's current line |
| 15 | Closed | decision 18; Q2 |
| 16 | Closed | decision 20 |

### Remaining findings

- **R1. Medium: a pull request from this repository gets a green `gate` with nothing tested** (decision 5, "from a fork only … that branch's push run is the evidence"; the `build` job's `if`; `gate.ts`'s third row; Q4).
  - `push` triggers only on `main` and `release/**`. So a same-repository pull request from any other branch (say `fix/x` into `main`) has **no push run at all**. Every job is skipped, and `gate` passes with "skipped: the push run is the evidence".
  - Even for a `release/**` head, the PR run's `gate` is green whatever the push run concluded. It is a check run of the same name, on the same head commit, as the push run's `gate`.
  - Q4's recommended answer is a ruleset on `main` requiring `gate`. Under it, a red push run could merge on the strength of the PR run's trivial green, and an untested branch could merge on nothing.
  - The release check is not affected, since it reads push runs only. The defect is in what `gate` means to GitHub.
  - **Fix (recommended):** in same-repository PR mode, `gate` mirrors the push run. It looks up the `matrix` push run for `github.event.pull_request.head.sha` with `gh api` (add `actions: read` to `permissions`), waits for it to complete within a time limit, and passes only if that run's `gate` succeeded. If no push run exists, as for a branch outside `release/**`, it fails with "no push run for this commit; push to `release/**` or open the PR from a fork".
    - `gate.test.ts` gains three cases: a red push run, no push run, and a green one.
    - `workflow.test.ts` checks `actions: read`.
  - **Or:** skip only when `startsWith(github.head_ref, 'release/')`, so other same-repository branches run in full. That still needs the mirroring above for `release/**` heads.

- **R2. Low: two gaps in the mutation proof** (decision 15).
  - **Attribution.** All seven patches go into one build. Patches 1 (`alert`) and 4 (`error-summary`) both expect L1, and both reach `settings`, `sign-in` and `sign-up` through the graph. A sign-in test failing L1 cannot say which patch broke it. So a patch that silently did nothing could still look proven.
    - Fix: `mutations.test.ts` also requires a **witness** for each patch: at least one expected test that no other patch reaches with the same fault id.
    - For patch 4, that is `error-summary`'s own test, provided its `hears` omits `alert`. `error-summary` passes `role={null}` to `Alert` and sets its own inner `role="alert"` (`error-summary.svelte:136`, `144`), so patch 1 does not touch it.
  - **Patch 7 depends on the reader.** Two identical polite updates may be spoken once, or with other speech between them. Either way, L3's "two adjacent phrases" never fires under that reader and browser pair, and the mutation run fails for a reason that is not a fault in the item.
    - Fix: say in advance what follows if a pair coalesces. That pair's L3 is recorded in the landing notes as not provable by this patch. A second double-read patch (for example `error-summary` with `role="alert"` back on its root, `019`'s old structure) is run in its own dispatch, since it shares a file with patch 4.

- **R3. Low: cite the stronger evidence for 0.29.2** (decision 17, "Why 0.29.2"; memo §2).
  - guidepup-playwright's green runs pair 0.29.2 with guidepup 0.38.0 (claim 6). `guidepup/guidepup`'s own workflows pair it with 0.40.0, on our exact labels, green on 2026-11-08 (runs 42476096268, 42476096312).
  - Fix: cite those runs in decision 17 and memo §2. Nothing else changes.

- **R4. Low: name the ledger mechanism, and say it is undocumented** (decision 16, "The fixture").
  - Fix: decision 16 says the fixture assigns `testInfo.expectedStatus = "passed"` after `use()` on a mismatch. That works in 1.64.1 by source (claim 4), not by documentation. So criterion 19's third case is re-run whenever Playwright is bumped.
  - One more line: a test turned red this way is retried under `retries: 1`. The retry mismatches again, so it stays red. Say so, so a reviewer does not read the retry as a flake.

- **R5. Low: the CLI route is documented, so Q7's order can be weighed again** (decision 15; Q7; Risks).
  - Two GitHub sources now say what the plan needs: the events page's "Once a workflow has run at least once, you can dispatch it against any branch or tag via the GitHub API or GitHub CLI", and the CLI's own definition of `--ref`.
  - So option 2 needs no push to `main`. After push B, the release branch's push run means the workflow has run once, and `gh workflow run matrix.yml --ref release/0.13.0 -f mutate=true` should start the mutation run from that branch's file.
  - Option 1's bootstrap stays a sound fallback.
  - Fix:
    - Cite both sources in decision 15 and Risks, as READ.
    - Put the choice to the owner with the evidence as it now stands. I would recommend option 2 first, with option 1 if GitHub refuses, since it saves a push to `main`. That order is the owner's call.

- **R6. Low: derive the release check's job list** (decision 19, "the jobs are exactly those the workflow declares … 24 `browsers`").
  - A literal 24 must change with every shard-count small change (decision 7). It fails closed, so the risk is a confusing refusal at tag time, not a false pass.
  - Fix: the release check derives the expected job names from `matrix.yml`'s matrix. `release-check.test.ts` takes them from the same parse that `workflow.test.ts` uses.

Nothing else new.
- The arithmetic, the counts (28 = 21 ui + 7 blocks; 42 = 39 + 3; five grants in four files; 30 jobs at peak) and the pins all check.
- The owner's rulings still hold:
  - no agent pushes, and push A and the dispatch are the owner's;
  - no macOS setting changes, and Q9's containers change none;
  - the matrix runs on GitHub Actions on the public repository;
  - a tag waits on a qualifying push run.

**Verdict as it stands after the re-check (2026-11-15):** does not land yet: R1 stands (a same-repository pull request's `gate` is green without a test, which Q4's ruleset would then trust). It is a small change to `gate.ts` and the `build` job's `if`. R2 to R6 are write-ins. With R1 closed, the specification is fit to build.
