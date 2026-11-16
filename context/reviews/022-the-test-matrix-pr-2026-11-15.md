# Review of 022 — The test matrix (the built change)

Reviews [`specifications/022-the-test-matrix.md`](../specifications/022-the-test-matrix.md), with the Landing notes the builder wrote on its branch, and the six small-change stubs `022a` to `022f`. This reviewer wrote neither the specification nor the code (constitution §5).

- **Date:** 2026-11-15
- **Status:** land locally after fixes. Findings 1 and 2 are certain failures of CI's first runs and must be fixed before push B; each would otherwise cost the owner a push. Findings 3 to 6 are settled at the checkpoint, before push B. Findings 7 to 9 are rulings for the design lead. The rest are write-ins. The merge with `release/0.13.0` follows "Merge notes".
- **Reviewer:** a reviewer; not the author
- **Reviewed:** branch `worktree-agent-a3cec37006404b9a4`, worktree `.claude/worktrees/agent-a3cec37006404b9a4`. Commits `072b9c7`, `74099b1` and `c62d365` on `44cec73`. `git diff 44cec73 c62d365`: 132 files, +9,697 / −396.
- **Re-ran:** Bun 1.4.4, 2026-11-15, load average 19 to 40 on 10 cores. Nothing in the worktree was edited, and no git state changed. Browser runs used the worktree's existing build (`build/` and `.svelte-kit/output/`, built 20:09, before `072b9c7`; the only later change under `src/` is the thumbnail manifest's hashes) with `E2E_PREBUILT=1` on ports **5731 to 5735**. 5199 was not used. No Docker, no full matrix, no push, no `gh workflow run`. One read-only `gh run list`, through the release check, and one `git ls-remote --tags`. Probe scripts are in the session scratchpad.
  - `bun run check` → 2,253 files, **0 errors, 0 warnings**. `bun run lint` → clean.
  - Unit: `fault-ledger`, `engine-only`, `sr-static`, `sr-items`, `mutations`, `workflow`, `gate`, `release-check`, `matrix`, `sr-rules`, `deps` → **209 pass, 0 fail** (4.3 s). `ENGINE_ONLY`: onlyIn 2, notIn 7, onlyProjects 3, as the notes say.
  - `keyboard.spec.ts` in `firefox-light`, filtered to the button, dialog, alert-dialog and sidebar fixtures, the clipboard status test and the ledgered sidebar-icon walk → **6 passed**. The sidebar-icon walk failed as `022e`'s line says, and counted as expected.
  - `tokens.spec.ts` in `webkit-dark` → **39 passed, 4 skipped** (the light-only `onlyProjects` block).
  - `keyboard.spec.ts` and `frames.spec.ts` in `webkit-light`, filtered to the bar walks, the theme buttons and two overlays → 7 passed, **12 failed**, all on macOS WebKit's defaults: `toBeFocused` after a click, and Tab skipping links (finding 4).
  - **The ledger fixture,** in a scratch config outside the worktree that imports `tests/ledger.ts` with four scratch lines, `retries: 1`: a test failing as named → `expected`, 1 attempt; a passing test → `unexpected`, 2 attempts; a test failing otherwise → `unexpected`, 2 attempts, `ledger-mismatch`; **a test whose `toEqual` lists the named failure and a new one → `expected`** (finding 3).
  - **Engine probes** (Playwright 1.64.1's builds, `setContent` pages):
    - macOS WebKit: Tab goes input → button, skipping the link; **Alt+Tab goes input → link → button**; a click leaves focus on the body.
    - Firefox: the page's `navigator.clipboard.writeText` succeeds with no grant, and **a keyboard paste (Meta+V and Control+V) into a textarea reads it back**. An untrusted `ClipboardEvent`'s `getData` returns `""`.
    - Firefox computes `scrollbar-width: none` for an element with an inline `thin`; Chromium and WebKit compute `thin`.
    - `backdrop-filter: blur(16px)` over stripes: Chromium's screenshot is blurred (red 117 to 129); Firefox's and WebKit's keep the stripes (3 to 255), though each computes `blur(16px)`.
  - `bun scripts/site/release-check.ts` → exit 1: the address passes, the ledger holds 27 lines, and `gh` answers 404, "workflow matrix.yml not found on the default branch".
  - **Not run by me:** the full unit, e2e and smoke suites; the screen-reader suite (dry or real); the mutated build; both rehearsals. Their figures are the builder's.

## Verdict

**Land locally after fixes.** The harness is well made. The seven projects, the three skip helpers, `ENGINE_ONLY`, the ledger and its fixture, the rules, the derivation and the gate are each pure where they can be, tested, and written as decision 16 and 19 say. The ledger fixture does what criterion 19 claims; I reproduced all three cases.

Two defects would fail CI's first runs for certain. A mutation run can never pass its own gate (finding 1). The `checks` job's checkout has no tags, so a registry test fails (finding 2). Neither can be found locally, and each costs the owner a push. Fix both before push B.

Four more weaken the evidence: the ledger's substring match can hide a new failure (3); the macOS WebKit failures have no record and a cheap harness fix (4); the clipboard and paste skips are not true limits (5); and `022f` does not carry the design lead's ruling (6).

The scorecard is not re-run here. Row 3 (h) moves only with push B's run id (criterion 24); nothing has moved yet.

## Findings, ranked

### 1. High — a mutation run can never pass its gate

**Evidence.** In `matrix.yml`, the `voiceover` and `nvda` test step is `bun run test:sr --project=…`, with no `MUTATE` in its `env` and no `continue-on-error`. Nothing in `tests/sr/fixtures.ts` or `playwright.sr.config.ts` reads `MUTATE` (`grep -n MUTAT` finds only `gate.ts` and `report.ts`). On a mutation run, each job's 15 expected tests fail (`main`'s 60 entries over four pairs), Playwright exits 1, and both jobs conclude `failure`. `gate.ts`'s `MUTATION_RAN` requires `voiceover` and `nvda` to be `success`. So `gate` fails on every mutation run, including a perfect one. Criterion 15 ("its `gate` passes as a mutation run") cannot be met. `gate.test.ts`'s mutation case feeds `voiceover: success`, a state the workflow cannot produce. With `retries: 2`, each expected failure also runs three times.

**Fix** (lane E, before push B). Either:

1. **Preferred:** pass `MUTATE` and `MUTATION_SET` to the screen-reader test step. Under `MUTATE=true`, `fixtures.ts` builds ledger-style lines from the set's `expected.json` (each with `expect: { fault }`) and gives them to `ledgerFixture`. An expected test is then `test.fail()`, a test that should fail but passes turns the job red, and Playwright does not retry the expected failures. `report` keeps the exact rule comparison.
2. Or `continue-on-error: ${{ inputs.mutate == true }}` on that step only, leaving `report`'s verdict as the only judge.

Add a `workflow.test.ts` case for whichever is chosen, and a `gate.test.ts` case built from the job conclusions a real mutation run yields.

### 2. High — `checks` fails on CI's first run: the checkout has no tags

**Evidence.** Every `actions/checkout` step uses the defaults: `fetch-depth: 1`, no tags. `tests/unit/registry.test.ts`, "released snapshots", lists `git tag --list 'v*'` and asserts `frozen.length > 0`. With no tags the list is empty, so "at least one released snapshot exists" fails, and `checks` is red. The remote holds `v0.1.0` to `v0.11.0` (`git ls-remote --tags`; `v0.12.0` is local only), and `static/` holds `v0.4.0` to `v0.11.0`, so a full checkout passes. The Linux rehearsal ran browser suites only, so it could not see this. `registry-comments.test.ts` already skips on a shallow clone; this test does not.

**Fix.** `fetch-depth: 0` (with `fetch-tags: true`) on `checks`'s checkout, and a `workflow.test.ts` line that holds it. Before push B, run `bun run test:unit` once in a fresh `git clone --depth 1 --no-tags` of the branch, to find any other test that leans on history.

### 3. Medium — an `error` line accepts a failure that also holds a new one

**Evidence.** `mismatch()` accepts a failure when every error message *contains* the line's `expect.error`. My probe's fourth case: `expect([named, new]).toEqual([])` with a line naming only `named` came out `expected`. That is `022b`'s exact shape. `forced-colors.spec.ts`'s axe test is `expect(r.violations.map(…)).toEqual([])`, in a loop over three pages. So, while the line stands in `firefox-light`:

- a new axe violation on Button under forced colours is accepted, because the message still holds `/components/button/: color-contrast`;
- Colour and the changelog are never scanned, because the loop stops at Button.

`022c`'s `expect` is `"Object.is equality"`, the text of every failing `toBe`. Any later `toBe` in that test matches it, so a partial fix that breaks the toggle step would read as the known fault. The spec states one gap (assertions after the ledgered one go unchecked). It does not state that the matcher can absorb a new failure in the ledgered assertion itself.

**Fix** (lane E, now):

- Split the forced-colours axe test into one test per page (or use `expect.soft` per page), so each line names one page and the other pages are scanned.
- Give `022c`'s first poll a message (`expect.poll(…, { message: "at load" })`) and ledger that message.
- Tighten `mismatch()` for a `toEqual` of string lists: when the message holds a `Received` array, every received entry must be the named one. Add the superset case to `fault-ledger.test.ts`.

### 4. Medium — the macOS WebKit failures: sound to leave out of the ledger, but they need a record, and half have a harness fix

**Is leaving them out sound?** Yes, in principle. The ledger holds what CI runs, and CI's WebKit is Linux's. My probes confirm the two causes are Playwright's macOS WebKit keeping the platform's defaults, not Kuiper. Tab skips links (WebKit's tabs-to-links preference). A click does not focus a button. Real Safari users with default settings meet both, on every site.

**What is wrong.**

- **No record.** The notes say "about 60", and "about 50" a paragraph later. No list names them. Decision 4's purpose is that a builder finds engine faults locally before a push. On every Mac, `test:e2e:engines` will show these failures with nothing to compare against. A real WebKit fault among them is invisible.
- **Partial confirmation.** The Linux rehearsal ran 183 tests in three files, 15 of them on timeouts. "They pass on Linux" is shown for a sample, and inferred for the rest. Push B's run is the real confirmation.
- **A harness fix exists for the Tab half.** In macOS WebKit, Alt+Tab reaches links (probe; WebKit flips the tabs-to-links preference when Alt is held). The walk helpers in `pages.ts` can press `Alt+Tab` when the engine is WebKit and the platform is `darwin`. That makes the walks meaningful locally, changes nothing in CI, and changes no macOS setting.
- **The click half.** Tests such as `frames.spec.ts`'s `pick()` (`click()`, then `toBeFocused()`) assert a platform behaviour. Where focus is the point, activate by keyboard (`focus()`, then `Enter`). Where it is not, drop the focus assertion.

**Fix.** Before push B: a committed list of every macOS WebKit failure, by file and title, each tagged "tab-to-links" or "click-focus", in the landing notes or in a small data file that a unit test keeps in step. Then the Alt+Tab helper, and the click rewrites, in lane E. After push B, check every listed test passed on Linux, and record any that did not as a fault.

**For the design lead.** One click-focus case is worth a ruling, not a rewrite. After a pointer-opened overlay closes, Safari returns focus to the body, because the trigger never had it. Some systems focus the trigger on close explicitly. That is an item question for `028` or a small change, not this spec.

### 5. Medium — the clipboard and synthetic-paste skips hide checks Firefox can run

**Evidence.** Six tests take `notIn("firefox", "clipboard: … a page cannot read what it wrote")`. Three paste tests take `notIn("firefox", "synthetic paste: … and Playwright's Firefox has no clipboard permission for a real one")`. My probe: in Playwright's Firefox, the page's `writeText` succeeds with no grant, and a keyboard paste into a textarea reads the text back. A real paste needs no permission. So:

- the clipboard tests can verify what was written by pasting into a scratch `<textarea>` in Firefox;
- the paste tests can write the text, then press Control+V (Meta+V on macOS) in the code input.

The first half of the paste reason holds: an untrusted `ClipboardEvent`'s data is empty in Firefox (confirmed). The second half is wrong. Decision 3 says to try the engine-neutral way first. Constitution §4.4 says a check that cannot run is a finding, never a limit.

**Fix** (lane E, now). A `readClipboard(page)` helper in `pages.ts`: Chromium and WebKit read through the API, as now; Firefox pastes into a scratch textarea. The three paste tests paste by keyboard in Firefox. Remove the nine `notIn` calls and their entries. If any test still cannot run, its entry's reason says exactly why.

### 6. Medium — `022f` does not carry the design lead's ruling, and its evidence was taken under load

**Evidence.** `022f`'s Status still reads "needs the design lead's ruling before it is built", and it offers both options. The design lead rules **option 1**: find and fix Firefox's cost; one budget for every engine.

The evidence: a keystroke p95 of 80 ms, and first colour over 250 ms, at load average 50 to 90. Chromium and WebKit met the budgets under the same load. So the gap is probably Firefox's, but it is not yet measured on a quiet machine. A timing line in the ledger may also flap. If CI's Linux Firefox meets the budget, the ledgered test passes and the run is red. If it meets it once in two attempts, the test is flaky, and `failOnFlakyTests` makes the run red. Both are correct, but either costs a push.

**Fix.** Update `022f`:

- Status: "Open. The design lead ruled option 1 on 2026-11-15: find and fix the cost in Firefox; the budgets stay one for every engine."
- Its Kind: a small change, flatly.
- Drop "The ruling it needs" and keep option 1 as the fix.
- Make the fix's first step to measure E7 in Firefox on a quiet machine, or read push B's figures, before profiling.

Record the ruling in `022`'s Landing notes too. If push B shows E7 intermittent in Firefox, say so there, so the red run is read as the known fault.

### 7. Medium (merge) — after `026`, `sr-items.test.ts` fails until toast has a screen-reader file

**Evidence.** On `026`'s branch, `toaster.svelte` has `role="alert"`, `aria-live="assertive"`, `.focus(` (lines 132 and 324) and `tabindex="-1"` (541). Each is a derivation signal (decision 11). So toast becomes a candidate, and the unit test fails until toast is in `SR_ITEMS` with a `tests/sr/toast.sr.ts`, or in `SR_EXCLUDED`. An exclusion would record a limit, which §4.4 forbids. `026`'s re-review (its R4) is the reason `hears` has parts.

**Fix.** At the merge (see "Merge notes"): `toast: ["live", "focus"]`, a `toast.sr.ts` that declares its parts (`assertive`, `polite`) and applies L1, L2 and L3 per announcer and F1 for F8. Then re-derive both `expected.json` files. It is a real build step, not a conversion; the design lead should give it to the builder who merges.

### 8. Low-Medium (ruling) — `022e`'s fix has a trade-off the stub does not state

`tabindex="-1"` on `sidebar-content`'s scroll box removes Firefox's extra Tab stop. It also removes Firefox's only keyboard way to scroll that box when it holds no focusable element. An installed app may put plain text there; axe's `scrollable-region-focusable` exists for that case. `022d` has no such risk: the section nav holds only links.

**Fix.** The stub states the trade-off and the design lead picks:

1. **The fix as written,** with "Your part" on the Sidebar page saying sidebar content should hold focusable items.
2. Accept Firefox's scroller stop as engine behaviour, and let the walk expect it in Firefox through a counted harness rule.

### 9. Low — the release check: what its exit 1 blocks, and how later builds should read it

**What it blocks.** Only the tag. No test or script but `headers.test.ts` runs it, and that test now checks the address line only. But process documents name "`release-check.ts`: exit 0" as a landing check:

- `019` (l. 409) and `019a` (l. 87), both done;
- `027-batch-a.md` l. 1296, which `027b` will follow;
- `026`'s change review, item 9 of its after-merge list.

From `022`, every builder will see exit 1.

**Fix.**

- A `--before-ci` flag (or `RELEASE_CHECK_STEPS`) that runs the address and ledger steps and prints the matrix step as "skipped". Builders then gate on an exit code.
- Until then, a note in `AGENTS.md` or `roadmap.md` §4: a builder's gate passes when the address line passes and the only refusals are the ledger lines and the missing matrix run.
- `headers.test.ts` should import a pure address check rather than spawn the script. Today `bun run test:unit` makes a `gh` network call with the owner's credentials on every run.

**And one thing to verify at push B.** `gh run list --workflow matrix.yml` and `gate.ts`'s `actions/workflows/matrix.yml/runs` both resolve the workflow by file name. Today that is a 404, because `main` has no `matrix.yml`. GitHub should register the workflow once it runs on the release branch. If it does not, both need a fallback: list runs by commit, filtered on `workflowName == "matrix"`.

### 10. Low — engine-conditional checks outside the three helpers are not counted

These weaken a check in one engine, with no `ENGINE_ONLY` entry, so `030` would count them as full passes:

- `scrollbarWidth()` reads the author's rules when the engine hides the value. In Firefox the test checks the CSS, not the engine. Its naive cascade ignores specificity and layers, which is fine today.
- `specimens.spec.ts`: `forcedColorAdjust ?? "none (no forced colours)"`, a vacuous pass in WebKit.
- After the merge: `progress.spec.ts` test 48's WebKit early return, and `toast.spec.ts` test 68's `test.skip(browserName === "webkit")`.

**Fix.** Split each engine-limited half into its own test under `notIn`, with an entry and a `gap`. Or add an `adapt` kind to `ENGINE_ONLY` for a test that runs everywhere but checks less in one engine.

### 11. Low — write-ins

1. `blocks.spec.ts` A2's ±2 tolerance applies to Chromium too, where the pixels were exact. Scope it to WebKit.
2. The Linux `build` job was never rehearsed: the container served a site built on macOS. The first Linux build, under Bun 1.3.14 with `--ignore-scripts`, is push B's. `--ignore-scripts` itself is sound: no dependency needs its script, and Bun 1.4.4 blocks them locally.
3. Speech-only mutation patches (1, 2, 4, 6, 7) were not checked even in the DOM. A local dry probe could show the attribute or node each removes or adds is gone or doubled. For example, does patch 6's `aria-modal="false"` after `{...restProps}` override bits-ui's own value? That would cut dispatch iterations.
4. `gate`'s mirror waits 90 minutes. A first full push run (30 jobs against 20 slots, 45-minute shards, 60-minute reader jobs, macOS queueing) may take longer, and the pull request's gate then fails while the push run is fine. State it in the PR's summary line, or raise the wait to the job's limit.
5. The job summary's "Passed" subtracts every ledgered test, including any that went red.
6. The browsers' cache key hard-codes `1.64.1`. A Playwright bump must change it by hand. Key it on `bun.lock`'s hash.
7. `fault-ledger.test.ts` does not reject two lines for one test and `where`; `lineFor` takes the first.
8. Decision 4's sizes: the notes give 3,095 and 9,223 at build start. The merge changes both again (Merge notes).

## The deviations

- **The macOS WebKit failures, unledgered** — sound in principle; incomplete in record (finding 4).
- **`headers.test.ts`, narrowed to the address step** — sound. The release check exits 1 by design, and the test checks that the address step passed and that the placeholder message is absent. Its spawn of the whole script is the weakness (finding 9).
- **`rename.test.ts` (020's)** — sound and needed. Bun 1.3.14's `Bun.Glob` does not match `**` inside braces, and CI pins 1.3.14. `braced()` splits only a pattern wholly wrapped in braces. A future pattern with inner braces would under-match under 1.3.14, so stray counts would rise and the test would fail. That is loud, not silent. The edit is recorded in `022`'s notes; `020`'s notes need no change.
- **Builder's rulings 1 to 12** — I would confirm all. Ruling 4 (`spacing` and `tokens` on `onlyProjects`) follows decision 3's letter. Ruling 6 (the thumbnail manifest, hash-only) is the one file under `src/lib/site/` and is forced by `018` decision 13. Ruling 8's counts are exact. Ruling 12's two wait rules are what keep a mutation failing on its rule rather than on set-up; they are the right rules.

## The checked parts, briefly

- **Projects.** Seven, `<engine>-<scheme>`. `scheme()` throws on anything but light or dark. `projectLabel()` is the only name read. `build-output` runs in `chromium-light` only, and `perf` alone, with its dependency dropped in CI. Sound.
- **The helpers.** `requireListed` throws at run time on a call with no entry, by file, helper, argument and reason. The unit test matches titles. Describe-level calls go through `beforeEach`, after the ledger fixture, so a skip wins over `test.fail()`. Sound.
- **The ledger.** A ledgered test that starts passing turns red, and a flaky one too, under `failOnFlakyTests` (probe). A failure for another reason is red, and stays red on retry (probe). Unledgered failures are never masked, except by finding 3. A line whose `where` skips the test would sit inert, but the release check still refuses while it exists.
- **`tests/test.ts` and the reader fixture.** One `ledger` auto fixture for each suite, keyed by project or by reader and browser. The reader fixture reads `faults.json` before teardown. Sound.
- **The rules and the derived set.** Each rule has its window and a positive precondition; X0 never passes. O2's fix is right: a reader that stays on a trigger bearing the overlay's name no longer meets the precondition, and the second sentinel after the portal catches a forward exit. One residual edge: `inside` treats every child of `<body>` that contains an overlay as "not outside". For an overlay rendered inline rather than portalled, the trigger's own text would count as inside. Every overlay in the set portals today (dialog, sheet, alert-dialog, popover).
- **The mutation sets.** Seven patches on seven files and one double-read patch. `expected.json` is derived through `hears` with parts, and the witness rule is checked. `verdict()` drops X0, so a set-up failure cannot stand in for a rule. Sound, apart from finding 1.
- **The workflow.** Every action pinned by SHA with its version. Exact runner labels. `--ignore-scripts` everywhere. `127.0.0.1` everywhere. Values reach scripts through `env`. Commit-grouped concurrency. Sharding 8 per engine with distinct blob names. Same-repository pull requests skip and mirror. Caching is safe: fork caches are scoped to their merge ref. The defects are findings 1 and 2.
- **`gate`, `qualify`, `report`.** Pure functions with thin shells. `qualify` requires push, `headSha`, success, the exact title, and the expected job set from the file. `report` reads runtime annotations correctly: Playwright 1.64.1 copies each result's annotations onto the test (`runner/index.js` lines 229–230 and 5961–5962), so `ledger-mismatch` reaches the merged report.

## The six stubs

| Stub | A true fault? | Lane | Small change? | Notes |
|---|---|---|---|---|
| `022a` | Yes. The WAI-ARIA menu pattern: Escape closes the menu that holds focus. Seen in all three engines' dry runs. | I, behind `023` | Yes | Add a changelog line: Escape's behaviour changes for installed apps |
| `022b` | Yes. Firefox users who override colours see 2.94:1. Kuiper chose the pair. | S | Yes | `theme-switch.svelte` is the only file using `SelectedItem`; `028` should reuse the Canvas/CanvasText pattern |
| `022c` | Yes, as a contract: the page's choice must be the only one. The real trigger is rare: the frame's reading differs only if its storage or preference does. | S (`src/lib/preview/`; confirm "the frames" covers it) | Yes | Ledger `expect` too loose (finding 3) |
| `022d` | Yes. An extra stop before the first link; the nav holds only links. | S | Yes | — |
| `022e` | Yes, but the fix has a trade-off | I, behind `023` | Yes | Finding 8 |
| `022f` | Probably; not yet measured on a quiet machine | I, behind `023` | Yes, under option 1 | **Must say the ruling** (finding 6) |

## The checkpoint (build step 7)

**What the design lead should look at:**

1. Findings 1 and 2: fixed before push B. Each is a certain red run.
2. Findings 3, 4 and 5: fixed or ruled before push B. Each changes what push B's run proves.
3. `022f`'s ruling written into the stub (finding 6), and `022e`'s trade-off ruled (finding 8).
4. The builder's twelve rulings, confirmed in the Landing notes (I would confirm all).
5. Opening `022a` to `022f` as small changes; `022a`, `022e` and `022f` queued in lane I behind `023`.
6. The merge plan: before or after push B? I recommend merging `release/0.13.0` (with `026`) first and pushing once. Push B's run then covers `027a`'s and `026`'s new tests in three engines, and the ledger is built once.
7. Finding 9's note for later builders, so no one reads the release check's exit 1 as their own failure.

**What I did of it locally:** the type check, lint, and the 022 unit files; three e2e samples across `firefox-light`, `webkit-dark` and `webkit-light`; the ledger's three cases and the masking case, by probe; the engine probes behind findings 4 and 5 and behind the blur and `scrollbar-width` reasons; the release check. **The blur skip and the `scrollbar-width` fallback stand on my probes. The clipboard and paste skips do not** (finding 5).

**What only the owner and CI can do:** push B, the first run (criteria 7, 12 to 14, 16, 17, 22), the mutation dispatch (15, after finding 1), and the scorecard's row 3 (h) with that run's id (24).

## Merge notes (after `027a`, now on `release/0.13.0` at `874c5da`, and `026`)

`027a` is merged on `release/0.13.0`. `026` is on `worktree-agent-a3ac332485042cc73` at `8a5c906` and lands next. Merge `release/0.13.0` into this branch once `026` is on it.

**Expected conflicts.** These files changed on both sides:

- `tests/e2e/{build-output,doors,expressive,keyboard,nav,site,upgrade}.spec.ts` and `tests/e2e/pages.ts`. Keep both sides' tests. Keep `022`'s imports, `scheme()` and `projectLabel()`.
- `tests/unit/registry.test.ts`: keep `022`'s JAWS line.
- `tests/fixtures/pluto-allowed.json`: recount the totals and `byFile` from the merged tree. Do not add the two sides' numbers.
- `src/lib/site/thumbnails/manifest.json`: take either side, then run `bun scripts/site/thumbnails.ts --hash-only` on the merged `package.json`.

**Conversions** (`matrix.test.ts` and `engine-only.test.ts` fail until each is done):

- `batch-a.spec.ts`, `button-group.spec.ts`, `link.spec.ts`, `progress.spec.ts` (`027a`) and `toast.spec.ts` (`026`): import `test` and `expect` from `../test.ts`. Types may still come from `@playwright/test`.
- `batch-a.ts`: `schemeOf` reads `info.project.name`. Replace its body with `scheme(info)`, or drop it for `scheme`.
- `progress.spec.ts` test 48: the forced-colours half returns early in WebKit with a runtime annotation. Move that half into its own test with `notIn("webkit", "forced colours: Playwright does not emulate forcedColors in WebKit")` and an `ENGINE_ONLY` entry with a `gap` for `028`.
- `toast.spec.ts` test 68: `test.skip(browserName === "webkit", …)` becomes `notIn("webkit", …)` with an entry. Correct its comment: this is an `ENGINE_ONLY` entry, not a ledger line. A ledger line is for a fault; this is a harness limit.

**The screen-reader suite.**

- Add toast (finding 7): `SR_ITEMS`, `tests/sr/toast.sr.ts` with its declared parts, statically annotated.
- When `026`'s `<Toaster>` mounts in `app-shell` (after `023`), `app-shell`'s tests that hear it must list `toast` or its parts in `hears`.
- Re-run `bun tests/sr/mutations/write-expected.ts`, and check both sets still apply (`git apply --check`, in `mutations.test.ts`). `027a` and `026` touched no patched file as far as I can see, but run it.
- `027a`'s three items give no derivation signal (checked by grep), so they need no files.

**Then run:**

- `bun run check`, `bun run lint`, and `bun run test:unit` with the long timeout.
- `--list` for both configs, recording the new counts per project for criteria 3 and 4.
- `bun run test:e2e`.
- The five new spec files, and `keyboard.spec.ts`'s new rows, in all four Firefox and WebKit projects. Triage each failure by decision 16: harness fixes now; each site or item fault a ledger line and a new stub, `022g` onwards. Expect `expressive.spec.ts`'s font-family cluster on `027a`'s pages to pass already, since `022` fixed the quoting (`027a`'s review, note 12).
- `bun scripts/site/release-check.ts`: exit 1, with the address passing, the ledger, and the missing matrix run as its only refusals.

**Ledger files** (`CHANGELOG.md`, `registry.json`, the guide, `static/r/`): `022` touches none, so its landing adds no ledger contention.
