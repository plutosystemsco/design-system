# 022 — The test matrix

- **Status:** Ready for owner answers: review approved with changes, all applied (2026-11-15). The review, [`../reviews/022-the-test-matrix-spec-2026-11-15.md`](../reviews/022-the-test-matrix-spec-2026-11-15.md), raised 16 findings (2 High, 7 Medium, 7 Low) and, on re-review, R1 to R6 (1 Medium, 5 Low). Each is answered under "Review". The owner answered Q1 to Q9 on 2026-11-15, each with the recommended option (see Landing notes). Ready to build after `020`.
- **Date:** 2026-11-15
- **Author:** the design lead
- **Kind:** test harness (lane E). No registry item changes. No token changes. **Interface changes:** none for an installed app. Two dev-only packages are added and pinned (decision 17). The repository gains its first CI workflow.
- **Depends on:** `020` (the Kuiper rename), landed first, so every name this spec adds is born after it. [`019`](./019-the-error-summary-alert-inside-and-the-label-in-view.md) decision 12 is the screen-reader check this spec generalises; decision 13 below retires its script. Ranked in [`roadmap.md`](../roadmap.md) §2, 0.13.0, row `022`, wave 1, lane E.
- **Research it stands on:** [`research/2026-11-15-test-matrix-and-screen-readers.md`](../research/2026-11-15-test-matrix-and-screen-readers.md) (cited below as *the memo*, by section; corrected after the review). Also [the benchmark scorecard](../research/benchmark-scorecard.md) row 3, and the Carbon, Primer, Spectrum and GOV.UK memos of 2026-11-15.
- **Owner's rulings it carries** (2026-11-15, given with the brief): the full matrix runs on GitHub Actions on the public repository. Linux runs Chromium, Firefox and WebKit. A macOS runner drives VoiceOver; a Windows runner drives NVDA. A tag waits on a green run. The owner will not change their own macOS settings for this. Nothing is pushed by an agent. This answers `roadmap.md` §6 Q1 with option 1.

## Intent

Constitution §4.4 asks for three things the repository cannot show today:

- every page tested in Chromium, Firefox and WebKit;
- every item with a live region, a focus move or an overlay checked with a screen reader, by script;
- the evidence published from the test run, with a failing check failing the build.

Today every browser test runs in Chromium only. No screen reader has been driven by script. `019`'s VoiceOver script was written and could not run: guidepup's set-up needs Full Disk Access on the owner's machine, and the owner rightly declined. The owner then listened by hand, once, to one item.

This specification builds the matrix. Firefox and WebKit projects join every browser suite. A screen-reader suite drives VoiceOver and NVDA through 28 items. One GitHub Actions workflow runs it all on every push. One job, `gate`, says whether the run is green. The release check refuses a tag without a green run of the right kind.

It does not fix what the matrix finds. Each fault becomes its own small change (decision 16).

## What the research found

- **The suite is bigger than the roadmap thought** (memo §1, EXECUTED). 2,981 browser tests today: 1,501 light, 1,475 dark, 5 perf. With three engines it is 8,881. The roadmap guessed 2,000 and 6,000.
- **A shard costs more than the first draft said** (memo §1, corrected). About 108 worker-minutes for Chromium and 162 each for Firefox and WebKit, at an optimistic 2.2 s per test.
- **`vite preview` serves `.svelte-kit/output/`, not `build/`** (memo §4a, READ). A prebuilt site needs both folders. `upload-artifact` drops hidden folders by default.
- **guidepup runs VoiceOver and NVDA on GitHub's own runners, green** (memo §2). Its last VoiceOver run had 9 jobs on `macos-15`, `macos-26` and `xcode-27`, 1.8 to 3.8 minutes each. Its NVDA run had 4 jobs on `windows-2022` and `windows-2025`, 1.8 to 3.0 minutes. Both use `@guidepup/setup@0.29.2`.
- **The runner does what the owner's machine would not.** GitHub's macOS runners give passwordless `sudo`; `@guidepup/setup setup --ci` writes the permissions there (memo §2, §3).
- **The setup action is retired.** The CLI, `@guidepup/setup`, is the path (memo §2).
- **The screen readers are pinned by guidepup.** `@guidepup/guidepup` 0.40.0's `manifest.json` names NVDA 2026.3 and VoiceOver preference files per macOS version, each with a SHA-256 (memo §2).
- **`workflow_dispatch` needs the workflow on the default branch,** `main`. The remote has only `main` (memo §3).
- **A pull-request run tests a merge commit, and a newer queued run cancels a pending one in its concurrency group** (memo §3).
- **Standard runners are free for public repositories, without a minute cap.** 20 jobs run at once, 5 of them macOS. Jobs beyond that queue (memo §3).
- **The suite reads the project name in 15 files, 42 reads,** three of them labels. Two files use Chromium's DevTools protocol, one without a guard. Four files grant clipboard permissions (memo §4, corrected).
- **No reference drives a screen reader by script.** Carbon's shape is the one to adopt: shards, a prebuilt site from an artifact, merged blob reports, and one `if: always()` job as the status (memo §5).
- **28 of the 75 items qualify for a screen-reader run** (memo §6, corrected).

## Decisions

### 1. Three engines, every browser suite, both schemes

Every file in `tests/e2e/` runs in Chromium, Firefox and WebKit, in light and in dark. The engines are Playwright's own builds at the pinned Playwright, 1.64.1. In CI they run on `ubuntu-24.04`.

Two exceptions, each because the test does not depend on the engine or cannot run in another:

- `build-output.spec.ts` reads files from `build/`. It runs once, in `chromium-light`, as it runs once in `light` today (`015` decision 24).
- `perf.spec.ts` throttles the network and CPU through Chromium's DevTools protocol (CDP). It runs in Chromium only, in its own project.

No other file is excluded. A test that cannot run in an engine says so through decision 3, one test at a time.

### 2. Projects are `<engine>-<scheme>`; the scheme is read from the project's `use`

Seven projects: `chromium-light`, `chromium-dark`, `firefox-light`, `firefox-dark`, `webkit-light`, `webkit-dark` and `perf`.

`tests/e2e/scheme.ts` holds two helpers:

- `scheme(info)` returns `info.project.use.colorScheme` as `"light" | "dark"`, and throws on anything else. The 39 scheme reads move to it.
- `projectLabel(info)` returns `info.project.name`, for the 3 reads that only label a message (`doors.spec.ts:574` and `577`, `site.spec.ts:733`).

So no spec file reads `info.project.name` itself. `code.spec.ts:1461` already reads `info.project.use.colorScheme`, and keeps working. Reason: the name now carries the engine too; the scheme already lives in `use`, so nothing parses names.

`forced-colors.spec.ts`'s "light project only" skip becomes "light schemes only": it runs in each engine's light project.

### 3. An engine-only test says why, and is counted

A test that one engine cannot run calls `onlyIn(engine, reason)` from `tests/e2e/engines.ts`. It skips elsewhere with that reason. The reason names the missing API, for example `"CDP: Emulation.setEmulatedMedia for prefers-reduced-transparency"`.

Before using it, the builder tries the engine-neutral API. For example, `page.emulateMedia({ forcedColors })` replaces CDP for forced colours where Playwright supports it.

`ENGINE_ONLY`, in the same file, lists every such test: its file, its title, the engine and the reason. A unit test holds the list and the calls in step. The landing notes give the count. Reason: an exception the suite can count is a finding; one it cannot count is a silent limit (constitution §4.4).

The first cases to examine (memo §4):

- `brand.spec.ts:75`, which opens a CDP session with no guard;
- the five clipboard grants, in `code.spec.ts:442`, `nav.spec.ts:245`, `keyboard.spec.ts:1039` and `1463`, and `search.spec.ts:263`. If an engine refuses the permission, the test either reads the clipboard another way or takes `onlyIn`.

The `perf` project and `build-output.spec.ts` (decision 1) are project-level and are not listed here.

### 4. Locally, Chromium by default; all engines on request

- `bun run test:e2e` runs `chromium-light`, `chromium-dark` and `perf`, as today. Its time does not triple.
- `bun run test:e2e:engines` runs all seven projects.
- CI always runs all seven.

Firefox and WebKit run locally on macOS with no system setting changed (INFERRED; Playwright's own browsers). So the builder finds most engine faults before the first push. Local WebKit is macOS WebKit; CI's is Linux WebKit. A fault seen in one only is real and is filed (decision 16). Q9 asks whether the builder may also rehearse Linux in a container.

### 5. One workflow, on the public repository; which runs happen

`.github/workflows/matrix.yml`. Its name is `matrix`. Its run name is `matrix`, or `matrix (mutation main)` and `matrix (mutation double-read)` for a mutation run (decision 15). It runs on:

- a push to `main` or `release/**`;
- a pull request into either. **From a fork,** the run tests in full. **From a branch in this repository,** nothing is tested again: running both a push run and a pull-request run on one commit would double the jobs, 2 × 33 and 8 macOS jobs against limits of 20 and 5. Instead that run's `gate` **mirrors the push run** for the pull request's head commit (decision 19). It passes only if that push run's `gate` succeeded, and fails if no push run exists. So a pull request from `fix/x`, which `push` never triggers, cannot show a green `gate` with nothing tested;
- `workflow_dispatch`, with two inputs: `mutate` (boolean) and `set` (`main` or `double-read`, default `main`) (decision 15).

`permissions` are `contents: read` and `actions: read`. The second lets `gate` read the push run it mirrors through `gh api`, with the run's own `GITHUB_TOKEN`. No secrets are used, so a fork's pull request runs the same.

**Concurrency.** Runs are grouped by commit, never by branch, except for pull requests:

```yaml
concurrency:
  group: >-
    matrix-${{ github.event_name == 'pull_request'
      && format('pr-{0}', github.ref)
      || format('{0}-{1}', github.sha,
           inputs.mutate && format('mutation-{0}', inputs.set) || 'full') }}
  cancel-in-progress: ${{ github.event_name == 'pull_request' }}
```

Reasons:

- GitHub cancels a *pending* run when a newer one joins its group (memo §3). Grouped by branch, three quick pushes to `release/0.13.0` would leave the middle commit with no run. Grouped by commit, each release commit's run is alone in its group and is never replaced.
- A mutation run has its own group, one per set, so it never displaces the full run of the same commit.
- A pull request's newer push still cancels its older run.
- Two pushes of the same commit (to `main` and a release branch) share a group. One waits for the other, and both finish unless a third arrives. The release check needs only one.

### 6. The site is built once, on Linux, and both of its trees travel

`build` runs `bun run build` on `ubuntu-24.04`. It packs the two trees the tests need into one file and uploads it as the artifact `site`:

```sh
tar -cf site.tar build .svelte-kit/output
```

- `build/` is what `build-output.spec.ts` reads.
- `.svelte-kit/output/` is what `vite preview` serves. SvelteKit 3.1.0's preview reads `output/server/manifest.js` and stops with `preview_build_missing` without it; it serves `output/client` and `output/prerendered` (memo §4a, READ, `node_modules/@sveltejs/kit/src/exports/vite/preview/index.js` lines 30–33, 86, 127, 149). It never reads `build/`.
- A tar file, because `upload-artifact` skips hidden folders unless told (`include-hidden-files`, default `'false'`), and a tar keeps paths and modes on all three systems. The upload sets `if-no-files-found: error`.

Every test job downloads `site`, runs `tar -xf site.tar` at the repository root, and checks that both `build/index.html` and `.svelte-kit/output/server/manifest.js` exist before any test starts. Playwright's `webServer` skips the build when `E2E_PREBUILT=1` and only serves with `vite preview`. Each job has run `bun install`, so the server bundle's external imports resolve.

The Markdown twins (`build/<page>/index.md`, from `scripts/site/markdown.ts`) are not under `.svelte-kit/output/`. `vite preview` does not serve them today either. Nothing changes; nobody should "fix" it here.

Reasons for building once: every engine and reader tests the same bytes. Windows and macOS never build the site, so no grammar or WebAssembly step runs there. The 24 shards do not each spend a build.

### 7. Eight shards per engine, and a first-run timeout of 45 minutes

The `browsers` job is a matrix of `engine` (3) by `shard` (1 to 8): 24 jobs. Each runs `--project="<engine>-*" --shard=<n>/8`. Playwright splits per test, since `fullyParallel` is on. Workers stay at Playwright's default, half the runner's 4 vCPUs.

The arithmetic (memo §1, corrected after the review):

- 2,950 tests per engine × 2.2 s = about 108 worker-minutes for Chromium, about 162 each for Firefox and WebKit.
- At 8 shards and 2 workers: about 7 and 10 minutes of tests, plus about 4 minutes of set-up. About 11 and 14 minutes a shard.
- That is optimistic. vCPUs are threads, each worker drives a whole browser beside the server, and the first run has failing tests that wait out timeouts and retry.

So `timeout-minutes` is 45 for the first runs. A timed-out shard uploads no blob, and the evidence would have a hole; 45 leaves room. After the first green run, the landing notes record every shard's time. If the slowest takes over 20 minutes, a small change in lane E raises the count. The timeout drops to 30 once two green runs stay under 20.

Jobs beyond 20 at once **queue; they do not fail** (memo §3). Concurrency sets the run's wall time, not the shard count.

### 8. `perf` runs alone, in its own job

`perf` is one job on `ubuntu-24.04`, Chromium, `--project=perf`. In CI its `dependencies` on the Chromium projects are dropped, because a job alone on its own runner shares no CPU (`015` decision 23's reason holds). Locally the dependency stays.

The transfer budgets gate from the first run: bytes do not depend on the machine. Whether the LCP budgets gate in CI, or wait for `024`'s per-template budgets measured on the runner, is Q1. Until it is answered, the job runs the LCP checks and reports them, and the builder records the runner's figures in the landing notes.

### 9. `checks` runs the rest of `bun run test`

A `checks` job on `ubuntu-24.04` runs `bun run test:unit`, `bun run check`, `bun run lint`, `bun scripts/lint-literals.ts` and `bun run test:smoke`. A green run is then the whole test run, not the browsers alone. The unit tests include the mutation patches' `git apply --check` (decision 15), so a patch broken by another spec's edit fails here, on every push.

### 10. VoiceOver on macOS, NVDA on Windows

| Job | Runner | Browsers | Reader |
|---|---|---|---|
| `voiceover` | `macos-26` | WebKit, Chromium | VoiceOver, as the image ships it, with guidepup's preference file for macOS 26 |
| `nvda` | `windows-2025` | Chromium, Firefox | NVDA 2026.3, portable, from guidepup's manifest |

Reasons: VoiceOver's users are on Safari, and Playwright's WebKit is the nearest Safari a script drives; Chromium is the second. NVDA's users are on Chrome and Firefox. These are the images guidepup's own CI runs green (memo §2). Labels are exact, never `-latest`, so an image change is a recorded change.

**The set-up** is guidepup's CLI, from the repository's pinned copy, through `package.json` scripts:

```json
"sr:setup": "guidepup setup --ci",
"sr:install": "guidepup install"
```

The macOS job runs `bun run sr:setup --macos-record`. A `package.json` script resolves the binary from `node_modules/.bin` and never downloads one. That matters: `bun x guidepup` would fetch any package named `guidepup` from npm if the local binary were missing, and none exists today, but anyone could publish one (review finding 13). Not the retired action.

The screen-reader suite is `tests/sr/`, with its own config, `playwright.sr.config.ts`, wrapped in `withGuidepup` (serial, headed). It runs under Bun's runtime like the rest. If guidepup fails under `bun --bun` on a runner, that job alone runs Playwright under Node, and the landing notes say so (memo §7).

### 11. The 28 items, derived and tested

The scripted set is the memo's §6 table: 21 ui items and 7 blocks.

- **Live region:** `status`, `alert`, `spinner`, `error-summary`, `message-log`, `marker`, `code-block`, `composer`, `stage-card`, `live-console`.
- **Focus move:** `error-summary`, `message-log`, `message`, `composer`, `code-editor`, `sidebar`, `marketing-bar`.
- **Overlay:** `tooltip`, `popover`, `alert-dialog`, `dialog`, `sheet`, `dropdown-menu`, `chart`, `sidebar`, `marketing-bar`.
- **Blocks:** `sign-in`, `sign-up`, `settings`, `page-states`, `app-shell`, `chat`, `product-home`, each by the kinds its parts bring.

`tests/sr/items.ts` exports `SR_ITEMS`, each item with its kinds, and `SR_EXCLUDED`, each with a reason. The exclusions (memo §6):

- `breadcrumb` and `toggle-group`: they match the overlay search only through a comment;
- `input-group`: its addon click is a pointer convenience no screen-reader user makes, and its password toggle announces its own new name;
- roving focus inside one widget (`tabs`, `radio-group`, `accordion`, `input-otp`): the keyboard walk's job;
- `liquid-glass`: a surface, not a layer;
- `proof-band`: no live region; its final numbers are static text;
- `theme`, `toggle`, `collapsible`, `switch`, `checkbox`: each announces its own state.

A unit test re-derives the candidates from item source. Its signals: a literal live role; `aria-live`; the strings `"status"`, `"alert"` or `"log"` as values in a role map (as `alert.svelte`'s `ROLE[variant]` holds them); a `Status` import; `.focus(`; a `tabindex="-1"` target; a portal, an overlay or a sheet. Every candidate must be in one list or the other. So a new item with a live region cannot ship without a screen-reader run, or a stated reason.

A **focus move** here means focus going where the user did not Tab or arrow to: on open, close, insertion, a step change, or a link.

### 12. What each run checks: the rules, in full

`tests/sr/rules.ts` holds the rules. Each takes captured phrases and returns its faults, each fault with a rule id. Each test attaches its phrases and its faults (`phrases.json`, `faults.json`).

**Capture.** Every screen-reader test starts its reader with `capture: true`, pinned in `tests/sr/fixtures.ts` (`screenReaderStartOptions: { capture: true }`). The default, `"initial"`, captures only the first page of output; a live region and a tooltip's description speak after it (review finding 7). `019`'s script used the default, which is one reason its pass rested on the owner's ear.

**Windows.** A test reads phrases in named windows. The **before** window is captured for 2 s after the page is ready and before the action. The **after** window starts with the action and runs 6 s (`019`'s `SETTLE_MS`). Each window is its own capture.

**Normalisation,** applied to every phrase and every expected text:

1. Unicode NFKC.
2. Lower case.
3. Drop straight and curly quotes and apostrophes (`'` `"` `‘` `’` `“` `”`).
4. Collapse every run of whitespace to one space, and trim.
5. Drop one final `.`, `,`, `;`, `:`, `!` or `?`.

**"Spoken whole":** an expected text is spoken whole in a window if its normalised form is a substring of one normalised phrase, or of two adjacent phrases joined by one space. The reader's own words ("status", "alert", "heading level 2") may surround it.

**X0, nothing to judge.** Every rule states the window it reads and a positive precondition. If the window is empty, or the precondition fails, the rule returns X0 and the test fails. No rule passes on silence.

| Id | Rule | Window | Precondition |
|---|---|---|---|
| **L1** | The message is spoken whole | after | after is not empty |
| **L2** | The message is not spoken | before | L1 holds (the reader is speaking) |
| **L3** | No two adjacent phrases each contain the message whole | after | L1 holds |
| **L4** | Where the item promises a repeat, the message is spoken whole again on the identical second trigger | a second after | L1 held on the first |
| **F1** | The focus target's accessible name is spoken whole; for a heading, its text | after the move | after is not empty |
| **O1** | The overlay's name is spoken whole: a dialog's title, a menu's first item | after opening | after is not empty |
| **O2** | Modal containment: the sentinel is never spoken in ten `next()` steps | the ten steps | at least three distinct non-empty phrases, one of them containing the overlay's name |
| **O3** | Escape returns: the trigger's name is spoken whole, and the trigger is `document.activeElement` | after Escape | after is not empty |
| **O3s** | A sub-menu's Escape speaks its parent item's name, and focus is on that item | after Escape | after is not empty |
| **T1** | A tooltip: focusing its trigger speaks the trigger's name and the tooltip's text, each whole | after focus | after is not empty |
| **T2** | After Escape, the tooltip's content is gone from the DOM, and focus is still on its trigger | DOM, no speech | the tooltip was open |
| **C1** | `chart`: from the element before the figure, within 15 `next()` steps, the figure's name, the table's caption and its first column header are spoken whole, in that order | the steps | the steps are not empty |
| **C2** | `chart`: none of the example's tooltip texts (each series label with its value, as the tooltip formats it) is spoken in those steps | the steps | C1 holds |

**The sentinel** (O2). Before opening a modal, the test inserts a visible paragraph, `<p data-sr-sentinel>`, with unique text (`sentinel ` and 8 random hex digits), as the first child of `<main>`, outside the overlay's subtree. It is test code, injected through Playwright; no site file changes. Words like "Close" or "button" exist on both sides of a modal, so only the sentinel can show the page behind.

**Which overlays get which rules:**

- O1, O2, O3: `dialog`, `alert-dialog`, `sheet`, and the sheets inside `sidebar`, `marketing-bar`, `app-shell` and `product-home`; `settings`' delete confirm.
- O1, O3 (not modal): `popover`, `dropdown-menu`. `dropdown-menu` adds O3s for its sub-menu.
- T1, T2: `tooltip`. A tooltip never takes focus, so O3 does not apply.
- C1, C2: `chart`.

**What each test declares.** Each test carries three annotations: `item` (a registry name), `rules` (the ids it applies) and `hears` (what those rules judge, by default its own item). A `hears` entry is either a whole item, `toast`, or **an item and one named part,** `toast:assertive`. A part names one region or element an item renders, such as a toast's assertive or polite announcer; the item's test file declares its parts in one list, and each part name is a plain lowercase word. A unit test checks that each `hears` entry's item is the test's item or one of its transitive `registryDependencies`, and that each part is declared for that item. Decision 15 reads `hears` to know which tests a mutation must fail.

Rules match normalised text, never a whole log. Logs are never snapshot. VoiceOver and NVDA word the same thing differently (memo §2).

NVDA is driven in browse mode, which `navigateToWebContent()` leaves it in. A `next()` that does not move yields an empty or repeated window, which X0 or O2's precondition catches.

### 13. `019`'s script becomes the first screen-reader test; two edits at landing

`tests/sr/error-summary.sr.ts` carries `019` decision 12's steps and its pass rule: the insertion, the second submit, and each link. In the rules above, that is L1 and L3 for the title and each message, on the insertion and on the second submit, and F1 for each link. It now runs under both readers, with `capture: true`.

`scripts/a11y/voiceover-error-summary.ts` is deleted.

Two files still refer to `019`'s gap or script. Both are edited **at landing**, not before:

- **`handoff.md:30`** tells the owner to run the deleted script before the 0.12.0 tag. The listen passed (`d8d658d`). At landing, that line is replaced: the listen passed by hand, and the scripted VoiceOver and NVDA runs are in every `matrix` run.
- **`tests/unit/registry.test.ts:1913–1915`** requires the Error summary page to say "NVDA and JAWS are not tested." After `022`, NVDA is tested, but the page keeps its line until `030` generates the status. At landing, that check changes to require only that the page names JAWS as not tested (`/JAWS (is|are) not tested/`). The builder does **not** edit the page; `030` does.

### 13a. Each test names its item and its check

Every screen-reader test carries `item`, `rules` and `hears` (decision 12). Browser tests written or moved by this spec carry `item` and `check` (`axe`, `keyboard` and so on) where their file maps to one item already; the rest is `030`'s work. Reason: `030` builds the per-item status from these.

### 14. The run's evidence

`report` merges every blob report into one HTML report and one JSON report, with `playwright.merge.config.ts` (blobs come from three operating systems, and Playwright needs an explicit merge config for that, memo §4). It uploads the artifact `matrix-report`:

- `report.json`: one record per test, with its project, engine, scheme or reader, its annotations, status, retries, duration and attempt;
- `html/`: the merged HTML report;
- `sr-logs/<reader>-<browser>/<item>.json`: every screen-reader test's phrases, windows and faults;
- `recordings/`: the macOS set-up recording, when one was made.

The run's job summary lists totals per project, every flaky test, every ledgered test and whether it failed as its line says (decision 16), and the slowest shard. `report` fails if any test carries a `ledger-mismatch` annotation. `030` commits a report of the last full run; this spec only produces it.

Retention: blob artifacts and `site` 1 day; `matrix-report` and recordings 14 days.

### 15. The checks are proven by mutation, in CI

The browser suites already pass in Chromium. The screen-reader tests cannot run on the owner's machine. So their power to fail is shown by mutation, as `README.md` allows for a check written after its code.

**Two sets of patches,** in `tests/sr/mutations/<set>/`, each patch breaking one promise in one file. The `main` set has seven, so every rule family is shown to fail. No two patches in a set touch the same file, so a set applies together.

| # | Set | File | What breaks | Expected fault | Witness |
|---|---|---|---|---|---|
| 1 | `main` | `alert` | its role map gives no live role to any variant | L1 | `alert.sr.ts`'s destructive test |
| 2 | `main` | `dialog` | the title no longer names the dialog | O1 | `dialog.sr.ts` |
| 3 | `main` | `popover` | focus no longer returns to the trigger on close | O3 | `popover.sr.ts` |
| 4 | `main` | `error-summary` | the inner alert is removed | L1 | `error-summary.sr.ts`'s insertion test |
| 5 | `main` | `sign-up` | the new step's heading no longer takes focus | F1 | `sign-up.sr.ts`'s step test |
| 6 | `main` | `sheet` | it is no longer modal, so the page behind is reachable | O2 | `sheet.sr.ts` |
| 7 | `main` | `code-block` | the copy button renders its status region twice | L3 | `code-block.sr.ts`'s copy test |
| 7b | `double-read` | `error-summary` | `role="alert"` goes back onto the root, `019`'s old structure | L3 | `error-summary.sr.ts`'s insertion test |

`7b` shares a file with patch 4, so it is its own set, dispatched only when patch 7 cannot prove L3 under some pair (below).

**`expected.json`,** one per set, names each test, reader and browser pair that must fail, and the rule fault it must fail with. It is derived, not hand-written. Each patch names the item it breaks and, where it breaks only one part, that part. A test is expected to fail for patch *p* when its `rules` include *p*'s fault and its `hears` matches *p*'s target:

- **a patch that names a part** (`toast:assertive`) matches a `hears` entry for that same part, or for the whole item (`toast`), since a test that hears the whole item hears every part;
- **a patch that names only an item** (`sheet`) matches any `hears` entry for that item, whole or part.

Example (from `026`): a patch that removes the role from the toast's assertive announcer names `toast:assertive`, fault L1. A test with `hears: ["toast:assertive"]` is expected to fail. A test with `hears: ["toast:polite"]` is not. So the derivation predicts exactly the assertive tests, not every toast test. A test that truly hears both announcers declares both parts, or the whole item. So patch 4 reaches `sign-in`, `sign-up` and `settings` through their `hears`; patch 6 reaches `sidebar`, `marketing-bar`, `app-shell` and `product-home`; patch 1 can reach `chat`, `error-summary`, `settings`, `sign-in` and `sign-up`, and patch 7 `chat`, `live-console`, `product-home` and `stage-card`, wherever a test's `hears` names them (memo §6; `registry.json`'s dependencies, confirmed by the re-review).

**Each patch has a witness:** at least one expected test that no other patch in its set reaches with the same fault id. Without one, a patch that silently did nothing could look proven by another patch's failures. Patches 1 and 4 both expect L1 and can both reach the form blocks, so their witnesses are their own items' tests. `error-summary.sr.ts`'s `hears` omits `alert`: `error-summary` passes `role={null}` to `Alert` and sets its own inner `role="alert"` (`error-summary.svelte:136`, `144`), so patch 1 does not touch it.

**`tests/unit/mutations.test.ts`** (it writes nothing):

- runs `git apply --check` on each patch, and on each set together, against the working tree. A patch broken by `023`'s doc comments, or any later edit, fails `bun run test:unit` locally and in `checks`. It does not wait for a dispatch.
- checks no two patches in a set touch the same file;
- re-derives each set's `expected.json` from `SR_ITEMS`, the tests' annotations and the patch table, and requires it to match the file;
- requires every patch's witness: an expected entry, for every reader and browser pair, that no other patch in the set reaches with the same fault id.

**The run.** A `workflow_dispatch` run with `mutate: true` and `set` (`main` by default), on the release branch's ref, applies that set in `build` before building. `browsers`, `checks` and `perf` are skipped. `report` compares each screen-reader test's `faults.json` with the set's `expected.json`. It passes only if:

- every expected test fails under every reader and browser pair, with a fault of the expected rule id;
- every patch's witness failed with its fault under every pair;
- no other screen-reader test fails;
- no expected test failed only on a set-up error (a locator timeout, X0) instead of its rule.

Patches are applied only in CI and never committed to item source.

**If a reader merges repeated announcements** (stated in advance). Under some reader and browser pair, patch 7's two identical polite updates may be spoken once, or with other speech between them. Then L3's "two adjacent phrases" cannot fire, and the `main` run fails only on patch 7's entries for that pair. That is not a fault in the item. What follows:

1. The design lead records, in the landing notes with the run id, that this pair's L3 is not provable by patch 7.
2. Those entries move to `expected.json`'s `notProvable` list, each naming the pair and the run id. `mutations.test.ts` accepts an entry there only with both, and the witness rule then counts the other pairs.
3. The owner dispatches the `double-read` set (`-f set=double-read`). Its patch 7b gives the reader two live announcements of the title, as `019`'s old structure did.
4. If 7b proves L3 under that pair, L3 is proven there. If neither patch can, L3's power to fail under that pair is unproven. That is a finding to fix by a small change in lane E with a patch that does double-read under that pair, not a limit to record (constitution §4.4).

**How the dispatch starts: the CLI, on the release branch, with no push to `main`.** Three sources say what the plan needs:

- GitHub's events page: `workflow_dispatch` "will only trigger a workflow run if the workflow file exists on the default branch", and "Once a workflow has run at least once, you can dispatch it against any branch or tag via the GitHub API or GitHub CLI" (READ, 2026-11-15; memo §3);
- the same page: for `workflow_dispatch`, `GITHUB_SHA` is the "Last commit on the `GITHUB_REF` branch or tag" (READ, the re-review);
- `gh workflow run --help`, gh 2.103.3: `-r, --ref string  Branch or tag name which contains the version of the workflow file you'd like to run` (EXECUTED, 2026-11-15). So the ref's copy of `matrix.yml` is the one that runs.

A push to `release/**` triggers a `matrix` run. So once push B has run, the workflow has run at least once, and the owner starts the mutation run with:

```sh
gh workflow run matrix.yml --ref release/0.13.0 -f mutate=true
```

The Actions page's "Run workflow" button may not appear while `main` has no `matrix.yml` (INFERRED from the first sentence above); the CLI is the route.

**The fallback, if GitHub refuses:** push A, a bootstrap `matrix.yml` on `main`, with only the `workflow_dispatch` trigger, the same inputs, and one job that prints a line. It runs nothing on that push. The owner then dispatches as above. When the release branch merges into `main`, the full `matrix.yml` replaces it (Q7, Q8).

### 16. A fault the matrix finds becomes a small change

The first full run will fail somewhere. The design lead triages each failure into one of three:

- **Harness fault:** the test relies on Chromium (a pixel value, a CDP call, a permission). Fixed inside this spec, in lane E, through decision 3 or an engine-neutral rewrite.
- **Site fault:** in `src/lib/site/` or the routes. A small change in lane S, numbered `022a`, `022b` and so on.
- **Item fault:** in `src/lib/registry/`. A small change in lane I, numbered the same way, queued behind `023` (`roadmap.md` §3, "Cross-lane landings"). Its check is the failing matrix test, already seen failing.

**The ledger.** Until its small change lands, a fault is a line in `tests/fault-ledger.ts`:

```ts
{
  file: "axe.spec.ts",
  title: "at 1280 › /components/x/ has no violations",
  where: { project: "webkit-light" },         // or { reader: "nvda", browser: "firefox" }
  expect: { axeRule: "color-contrast" },     // or { error: "…" } or { fault: "O2" }
  finding: "The muted label is 4.3:1 on WebKit's text rendering.",
  change: "022a",
}
```

- **`where`** names exactly one project, or one reader and browser pair.
- **`expect`** is the failure the line accepts: a substring of the error message, an axe rule id appearing in the reported violations, or a rule fault id from `rules.ts`.

**One shared `test`.** Every `tests/e2e/*.spec.ts` imports `test` and `expect` from `tests/test.ts`; every `tests/sr/*.sr.ts` imports them from `tests/sr/fixtures.ts`, which extends guidepup's `screenReaderTest` with the same ledger fixture from `tests/ledger.ts`. A unit test fails if any spec file imports `test` from `@playwright/test` or `@guidepup/playwright` directly. (Today all 28 spec files import from `@playwright/test`; all 28 move.)

**The fixture** is automatic. For a ledgered test in its `where`:

- before the test, it marks the test `test.fail()`. A ledgered test that now passes turns the run red: its line must go.
- after `use()`, it reads `testInfo.errors` (and, for a screen-reader test, its `faults.json`). If any error does not match `expect`, it assigns **`testInfo.expectedStatus = "passed"`** and adds the annotation `ledger-mismatch`: "a ledgered test failed for a reason the ledger does not name". The test is then a failure where a pass was expected, so it is red.

**The mechanism is undocumented.** It works in Playwright 1.64.1 by its source: test-scoped fixtures are torn down before the worker sends `expectedStatus` to the runner, the runner adopts the value it receives, and `TestInfo.expectedStatus` is not declared `readonly` (the re-review, READ, `node_modules/playwright/lib/worker/workerProcessEntry.js`, `lib/runner/index.js`, `types/test.d.ts`). Playwright's docs describe the field as something a test reads, not writes, so a minor release could change it. Two guards:

- criterion 19's third case is re-run whenever Playwright is bumped, and the bump's change review cites it;
- the `ledger-mismatch` annotation is added either way, and `report` fails the run on it (decision 14). So if the assignment ever stops working, the run is still red.

**A retry stays red.** Under `retries: 1`, a test turned red this way runs again; the retry mismatches again, so the test ends red, not flaky. A reviewer should not read that retry as a flake.

So the run stays green while a known fault waits, and goes red on a new one in the same test. One gap remains, and is stated: a failing assertion ends a test, so assertions after the ledgered one are not checked while the line stands. That is why the tag waits for an empty ledger (Q3).

**`tests/unit/fault-ledger.test.ts`** checks that each line names a small-change specification under `context/specifications/`, a test that exists, exactly one `where`, and a non-empty `expect`.

### 17. Pins

| What | Pin | How |
|---|---|---|
| `@guidepup/guidepup` | 0.40.0 | already a devDependency (`019`); `bun.lock` |
| `@guidepup/playwright` | 0.21.0, MIT, published 2026-10-25 | new devDependency, exact; `bun.lock` |
| `@guidepup/setup` | **0.29.2**, MIT, published 2026-10-10 | new devDependency, exact; `bun.lock`; its binary is `guidepup`, run through `package.json` scripts |
| `@playwright/test` | 1.64.1 | unchanged. 1.65.1 is two days old |
| Browsers | Playwright 1.64.1's builds | `bun --bun playwright install --with-deps <engine>` |
| NVDA, VoiceOver preferences | as `@guidepup/guidepup` 0.40.0's `manifest.json` names them, each with a SHA-256 | `bun run sr:install` |
| Bun in CI | `packageManager`'s version, 1.3.14 | `oven-sh/setup-bun`, `bun-version: 1.3.14`; a unit test checks it equals `packageManager` |
| Actions | by commit SHA, with the version as a comment | see the table in the design |
| Runners | `ubuntu-24.04`, `macos-26`, `windows-2025` | exact labels |

**Why `@guidepup/setup` 0.29.2, not 0.29.3.** `guidepup/guidepup`'s own workflows, at its version 0.40.0 (ours), run `@guidepup/setup@0.29.2` on our exact labels, and were green on `main` on 2026-11-08, at commit `77fc318b`: run 42476096268, "Playwright VoiceOver", 9 jobs including `macos-26` with WebKit and Chromium; and run 42476096312, "Playwright NVDA", 4 jobs including `windows-2025` with Chromium and Firefox (memo §2, EXECUTED, GitHub's API). That pairs 0.29.2 with the guidepup whose manifest `sr:install` reads. guidepup-playwright's green runs also use 0.29.2, but its lockfile resolves guidepup 0.38.0, so they are the weaker evidence. 0.29.3 changes only a Debian package list, CI actions and a dependency bump, nothing for macOS or Windows (the re-review, GitHub's compare API). A later bump is a small change in lane E with a green run as its check.

**Bun versions.** CI runs Bun 1.3.14, the version `packageManager` pins. The memo's measurements, and `Bun.YAML`, are on the local 1.4.4. Build step 1 runs `bun run test:unit` and criterion 3's listing once under 1.3.14 through `bun x bun@1.3.14`, which installs nothing globally. If that is not possible, the landing notes record the difference, and the first CI run is the first full run under 1.3.14; a fault seen only there is a harness fault.

No package is added to any registry item. `deps.test.ts` gains a `PACKAGES_022` block, as `017` and `019` added theirs.

### 18. Retries, flakes and re-runs

- **Browser suites:** `retries: 1` in CI, `0` locally. `failOnFlakyTests: true` in CI. A flaky test fails the run, and is triaged like any fault (decision 16). Reason: a failing check fails the build (§4.4), and a test that passes on its second try failed once.
- **Screen-reader suite:** `retries: 2` in CI. On a development push, a test that passes on a retry passes and is listed as flaky. **On a release run** (a push to `release/**` whose commit is to be tagged), any screen-reader flake gets a ledger line, and so blocks the tag (Q3), unless the design lead records it in the landing notes as reader timing, with the phrases that show it. Reason: a live region that announces only some of the time is a real fault in this system ("mount it first, then set the text", `status.svelte:22–23`); two retries would pass a half-working announcement 7 runs in 8. Q2 asks the owner to confirm.
- **Re-runs.** "Re-run failed jobs" makes a new attempt of the same run. The release check accepts a run whose attempt is above 1, prints the attempt, and the design lead records why in the release's landing notes.

### 19. The tag gate

**`gate`** is the run's one status. It runs `if: always()` and needs every other job. It reads the jobs' results and the mode through `env`, never by pasting expressions into the shell:

```yaml
env:
  NEEDS: ${{ toJSON(needs) }}
  MUTATE: ${{ inputs.mutate }}
  SAME_REPO_PR: ${{ github.event_name == 'pull_request' && !github.event.pull_request.head.repo.fork }}
  HEAD_SHA: ${{ github.event.pull_request.head.sha }}
  GH_TOKEN: ${{ github.token }}
```

`scripts/ci/gate.ts` keeps its decisions pure, with the `gh api` calls in a thin shell around them. Its table:

- **full run:** passes only if every job succeeded. A skipped job fails it.
- **mutation run** (`MUTATE` is `true`): passes only if `build`, `voiceover`, `nvda` and `report` succeeded (`report` holds the comparison for `MUTATION_SET`) and `browsers`, `checks` and `perf` were skipped.
- **a pull request from this repository** (`SAME_REPO_PR` is `true`): every other job was skipped by design, and `gate` mirrors the push run. It asks `gh api repos/{owner}/{repo}/actions/workflows/matrix.yml/runs?head_sha=<head sha>&event=push` for the newest push run of the pull request's head commit (`github.event.pull_request.head.sha`). If none exists, it fails: "no push run for this commit; push it to `release/**` or `main`, or open the pull request from a fork". If one exists, it waits for it to complete, polling once a minute for up to 90 minutes (the `gate` job's `timeout-minutes` is 100), then reads that run's jobs and passes only if its `gate` job succeeded. A red, cancelled or timed-out push run fails it.
- `MUTATE` empty (every push) means false.

**`scripts/site/release-check.ts`** gains two checks, as pure functions with a thin shell around them:

1. The fault ledger is empty.
2. A `matrix` run qualifies for `HEAD`. It asks `gh run list --workflow matrix.yml --commit <sha> --event push --json databaseId,event,headSha,headBranch,status,conclusion,displayTitle,attempt`, and for each candidate `gh run view <id> --json jobs`. A run qualifies only if **all** of these hold:
   - `event` is `push`. A pull-request run tested a merge commit, not `HEAD` (memo §3);
   - `headSha` equals `git rev-parse HEAD`;
   - `status` is `completed` and `conclusion` is `success`;
   - `displayTitle` is exactly `matrix`, never `matrix (mutation …)`;
   - every job's conclusion is `success`, none `skipped`, and the job names are exactly those `matrix.yml` declares at `HEAD`. The release check **derives that list from the workflow file,** expanding each job's matrix (today `build`, `checks`, `perf`, `report`, `gate`, 24 `browsers`, 2 `voiceover` and 2 `nvda`), through `scripts/ci/workflow.ts`, the parser `workflow.test.ts` also uses. So a small change to the shard count (decision 7) changes the expected list with it. Skipped jobs mark a mutation or pull-request run.

It prints the qualifying run's id and attempt. If none qualifies, it exits 1 and says which condition failed for each candidate. If `gh` is absent or signed out, it exits 1 and says so; it never passes on missing evidence.

The design lead runs the release check before the owner tags, as today. The tag stays local until the owner pushes it. Whether `main` also gets a GitHub ruleset requiring `gate` is a setting only the owner can make (Q4).

### 20. The scorecard and the roadmap

- **Row 3 (h), screen-reader testing recorded.** The owner's `019` listen is one manual listen, of one item, with one reader. `022` earns (h) by scripting it: recorded speech for 28 items under two readers, on every run. If a scorecard re-run before `022` lands credits (h) from `019`'s listen, `022`'s change review cites the scripted runs as the evidence for (h), and the count does not move a second time. Either way Kuiper's count reaches 3 and its score stays 1 (2–3 → 1). The roadmap predicts exactly this ("3: row (h) recorded").
- **Row 13 (d), a published browser and assistive-technology support statement,** is not claimed. This spec tests; `030` publishes.
- At landing, the design lead corrects `roadmap.md` §5's sizes (2,981 and 8,881, not 2,000 and 6,000) and ticks §6 Q1 as answered.

## Design

### The config

`playwright.config.ts`, in outline (the builder writes the real file):

```ts
const ENGINES = {
  chromium: devices["Desktop Chrome"],
  firefox: devices["Desktop Firefox"],
  webkit: devices["Desktop Safari"],
} as const;
const SCHEMES = ["light", "dark"] as const;
const CI = !!process.env.CI;

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  retries: CI ? 1 : 0,
  failOnFlakyTests: CI,
  reporter: CI ? [["blob"], ["dot"]] : "list",
  webServer: server(), // tests/server.ts: build unless E2E_PREBUILT, then vite preview
  use: { baseURL: "http://localhost:4173" },
  projects: [
    ...Object.entries(ENGINES).flatMap(([engine, device]) =>
      SCHEMES.map((scheme) => ({
        name: `${engine}-${scheme}`,
        use: { ...device, colorScheme: scheme },
        testIgnore:
          engine === "chromium" && scheme === "light"
            ? /perf/
            : /build-output|perf/,
      })),
    ),
    {
      name: "perf",
      use: { ...ENGINES.chromium, colorScheme: "light" },
      testMatch: /perf\.spec\.ts/,
      dependencies: CI ? [] : ["chromium-light", "chromium-dark"],
      fullyParallel: false,
    },
  ],
});
```

`playwright.sr.config.ts`: `withGuidepup({...})` around `testDir: "tests/sr"`, `testMatch: /\.sr\.ts$/`, a 5-minute timeout, `retries: CI ? 2 : 0`, the blob reporter in CI, the same `server()`, a 1440 × 900 viewport, and three projects, `webkit`, `chromium` and `firefox`. The workflow picks two per reader. The `.sr.ts` suffix keeps Bun's own test runner from collecting these files.

`package.json` scripts gain:

```json
"test:e2e": "bun --bun playwright test --project='chromium-*' --project=perf",
"test:e2e:engines": "bun --bun playwright test",
"test:sr": "bun --bun playwright test -c playwright.sr.config.ts",
"sr:setup": "guidepup setup --ci",
"sr:install": "guidepup install"
```

### The workflow

`.github/workflows/matrix.yml`, the key parts. The SHAs are those the memo looked up on 2026-11-15, confirmed by the review:

| Action | Version | SHA |
|---|---|---|
| `actions/checkout` | v7.0.1 | `3d3c42e5aac5ba805825da76410c181273ba90b1` |
| `oven-sh/setup-bun` | v2.2.0 | `0c5077e51419868618aeaa5fe8019c62421857d6` |
| `actions/upload-artifact` | v7.0.2 | `cf430e030ddbb5b0abf93d22962f4752f3646cd9` |
| `actions/download-artifact` | v8.0.2 | `9000827ccba6bdab643e8b6fd33ac0654aef8333` |
| `actions/cache` | v6.1.0 | `55cc8345863c7cc4c66a329aec7e433d2d1c52a9` |

```yaml
name: matrix
run-name: ${{ inputs.mutate && format('matrix (mutation {0})', inputs.set) || 'matrix' }}
on:
  push:
    branches: [main, "release/**"]
  pull_request:
    branches: [main, "release/**"]
  workflow_dispatch:
    inputs:
      mutate:
        description: "Apply a set from tests/sr/mutations/ and expect exactly its faults"
        type: boolean
        default: false
      set:
        description: "Which mutation set"
        type: choice
        options: [main, double-read]
        default: main
permissions:
  contents: read
  actions: read
concurrency:
  group: >-
    matrix-${{ github.event_name == 'pull_request'
      && format('pr-{0}', github.ref)
      || format('{0}-{1}', github.sha,
           inputs.mutate && format('mutation-{0}', inputs.set) || 'full') }}
  cancel-in-progress: ${{ github.event_name == 'pull_request' }}

jobs:
  build:
    # A pull request from this repository runs nothing; its push run is the evidence.
    if: ${{ github.event_name != 'pull_request' || github.event.pull_request.head.repo.fork }}
    runs-on: ubuntu-24.04
    timeout-minutes: 20
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
      - uses: oven-sh/setup-bun@0c5077e51419868618aeaa5fe8019c62421857d6 # v2.2.0
        with:
          bun-version: 1.3.14
      - run: bun install --frozen-lockfile
      - if: ${{ inputs.mutate }}
        run: git apply tests/sr/mutations/"$MUTATION_SET"/*.patch
        env:
          MUTATION_SET: ${{ inputs.set }}
      - run: bun run build
      - run: tar -cf site.tar build .svelte-kit/output
      - uses: actions/upload-artifact@cf430e030ddbb5b0abf93d22962f4752f3646cd9 # v7.0.2
        with:
          name: site
          path: site.tar
          if-no-files-found: error
          retention-days: 1

  browsers:
    needs: build
    if: ${{ !inputs.mutate }}
    runs-on: ubuntu-24.04
    timeout-minutes: 45
    strategy:
      fail-fast: false
      matrix:
        engine: [chromium, firefox, webkit]
        shard: [1, 2, 3, 4, 5, 6, 7, 8]
    steps:
      # checkout, setup-bun, bun install --frozen-lockfile, as in build
      - uses: actions/cache@55cc8345863c7cc4c66a329aec7e433d2d1c52a9 # v6.1.0
        with:
          path: ~/.cache/ms-playwright
          key: playwright-1.64.1-${{ matrix.engine }}
      - run: bun --bun playwright install --with-deps ${{ matrix.engine }}
      - uses: actions/download-artifact@9000827ccba6bdab643e8b6fd33ac0654aef8333 # v8.0.2
        with:
          name: site
      - run: |
          tar -xf site.tar
          test -f build/index.html
          test -f .svelte-kit/output/server/manifest.js
      - run: bun --bun playwright test --project="${{ matrix.engine }}-*" --shard=${{ matrix.shard }}/8
        env:
          CI: "true"
          E2E_PREBUILT: "1"
      - if: ${{ !cancelled() }}
        uses: actions/upload-artifact@cf430e030ddbb5b0abf93d22962f4752f3646cd9 # v7.0.2
        with:
          name: blob-${{ matrix.engine }}-${{ matrix.shard }}
          path: blob-report/
          retention-days: 1

  voiceover:
    needs: build
    runs-on: macos-26
    timeout-minutes: 60
    strategy:
      fail-fast: false
      matrix:
        browser: [webkit, chromium]
    steps:
      # checkout, setup-bun, bun install --frozen-lockfile
      - run: bun run sr:setup --macos-record
      - run: bun run sr:install
      - run: bun --bun playwright install ${{ matrix.browser }}
      # download-artifact site; tar -xf site.tar; the two test -f checks
      - run: bun run test:sr --project=${{ matrix.browser }}
        env:
          CI: "true"
          E2E_PREBUILT: "1"
      - if: ${{ always() }}
        uses: actions/upload-artifact@cf430e030ddbb5b0abf93d22962f4752f3646cd9 # v7.0.2
        with:
          name: sr-voiceover-${{ matrix.browser }}
          path: |
            blob-report/
            test-results/
            recordings/
          retention-days: 14

  nvda:
    needs: build
    runs-on: windows-2025
    timeout-minutes: 60
    defaults:
      run:
        shell: bash
    strategy:
      fail-fast: false
      matrix:
        browser: [chromium, firefox]
    # the same steps as voiceover, with `bun run sr:setup` (no --macos-record)

  gate:
    if: ${{ always() }}
    needs: [build, checks, browsers, perf, voiceover, nvda, report]
    runs-on: ubuntu-24.04
    timeout-minutes: 100 # a same-repository pull request waits for its push run
    steps:
      # checkout and setup-bun, as in build; no install is needed
      - run: bun scripts/ci/gate.ts
        env:
          NEEDS: ${{ toJSON(needs) }}
          MUTATE: ${{ inputs.mutate }}
          MUTATION_SET: ${{ inputs.set }}
          SAME_REPO_PR: ${{ github.event_name == 'pull_request' && !github.event.pull_request.head.repo.fork }}
          HEAD_SHA: ${{ github.event.pull_request.head.sha }}
          GH_TOKEN: ${{ github.token }}
```

`checks` has the same `if` as `build` plus `!inputs.mutate`, and needs no build. `perf` follows `browsers`'s steps with `--project=perf`, and is skipped on a mutation run. `report` runs `if: ${{ !cancelled() && needs.build.result == 'success' }}`, downloads every `blob-*` and `sr-*` artifact, merges them, writes the job summary, fails on any `ledger-mismatch`, and on a mutation run compares faults with `expected.json`.

**Peak concurrency.** 24 shards, `perf`, `checks`, and 4 screen-reader jobs: 30 ready at once, against 20. Ten queue and start as others finish. macOS uses 2 of its 5 (memo §3). The run's wall time is set by the queue, not by any one job's limit.

**The bootstrap for `main`,** only if Q7 falls back to it (decision 15): the same `name`, `run-name`, `workflow_dispatch` trigger and inputs, `permissions: contents: read`, and one job, `bootstrap`, on `ubuntu-24.04`, whose only step prints "The full matrix lives on the release branch. Dispatch on that ref." It has no `push` trigger.

### The screen-reader suite

```
tests/sr/
  items.ts            SR_ITEMS and SR_EXCLUDED (decision 11)
  rules.ts            normalisation, windows, rules L1–C2 and X0 (decision 12)
  fixtures.ts         screenReaderTest, extended: capture: true, windows,
                      the sentinel, the attachments, the ledger fixture
  <item>.sr.ts        one file per item in SR_ITEMS, 28 files
  mutations/          two sets (main: seven patches; double-read: one), the patch
                      table with targets and witnesses, one expected.json per set
```

Each `<item>.sr.ts` opens the item's example page (`/example/<item>/<example>/`) or its view (`/view/<path>/`), waits for it to be ready, calls `navigateToWebContent()`, captures the before window, acts, captures the after window, and applies its declared rules.

### The shared test modules and the ledgers

- `tests/test.ts`: `test` and `expect` for every browser spec, with the ledger fixture.
- `tests/ledger.ts`: the ledger fixture itself, shared by both suites.
- `tests/fault-ledger.ts`: open faults, each with its `where`, `expect` and small change (decision 16).
- `tests/e2e/engines.ts`: `onlyIn()` and `ENGINE_ONLY` (decision 3).
- `tests/e2e/scheme.ts`: `scheme()` and `projectLabel()` (decision 2).
- `tests/server.ts`: the `webServer` both configs share (decision 6).

## Scope

**In:**

- `playwright.config.ts`, `playwright.sr.config.ts`, `playwright.merge.config.ts`, `tests/server.ts`.
- `tests/test.ts`, `tests/ledger.ts`, `tests/fault-ledger.ts`.
- `tests/e2e/scheme.ts` and `tests/e2e/engines.ts`.
- **Every `tests/e2e/*.spec.ts`** (28 files): its `test` import moves to `tests/test.ts`. In 15 of them, the 42 `project.name` reads move to `scheme()` (39) or `projectLabel()` (3). Engine guards or rewrites where decision 3 needs them, starting with `brand.spec.ts:75` and the five clipboard grants.
- `tests/sr/` (28 test files, rules, items, fixtures, seven mutation patches and `expected.json`).
- `.github/workflows/matrix.yml`, and the bootstrap version for `main` as a file the owner pushes (decision 15).
- `scripts/ci/gate.ts`; `scripts/ci/workflow.ts` (the shared parser and matrix expansion); `scripts/site/release-check.ts`'s two new checks.
- `package.json` scripts and two devDependencies; `bun.lock`.
- Unit tests: `matrix.test.ts`, `workflow.test.ts`, `sr-rules.test.ts`, `sr-items.test.ts`, `mutations.test.ts`, `fault-ledger.test.ts`, `gate.test.ts`, `release-check.test.ts`, and `deps.test.ts`'s `PACKAGES_022`.
- Deleting `scripts/a11y/voiceover-error-summary.ts`.
- **At landing:** `context/handoff.md:30` and `tests/unit/registry.test.ts:1913–1915`, as decision 13 says.

**Out:**

- Fixing any fault the matrix finds (decision 16: each is its own small change).
- The accessibility status on pages, the committed report, and the support statement (`030`). The Error summary page's screen-reader line (`030`).
- States driven for axe (`035`).
- JAWS and Orca as evidence (Q6). An Orca rehearsal is Q9.
- Any registry item, token, page or site chrome file.
- Changing the owner's machine in any way.

## Tests written first

Each is written and seen failing before the code it checks. The landing notes say how each failed.

1. **`tests/unit/matrix.test.ts`** imports `playwright.config.ts` and checks: exactly the seven project names; each engine has a light and a dark project whose `use.colorScheme` matches; `perf` is Chromium only; `build-output` runs only in `chromium-light`; CI turns on `retries: 1` and `failOnFlakyTests`. Fails today: three projects named `light`, `dark`, `perf`.
2. **Project reads and imports** (in `matrix.test.ts`): no file in `tests/e2e/` but `scheme.ts` matches `/\.project\.name\b/`; no `*.spec.ts` or `*.sr.ts` imports `test` from `@playwright/test` or `@guidepup/playwright`. Fails today: 42 reads in 15 files; 28 direct imports.
3. **`tests/unit/workflow.test.ts`** parses `matrix.yml` with `Bun.YAML.parse` (present in Bun 1.4.4, EXECUTED; confirmed on 1.3.14 in build step 1, else plain-text checks). It checks:
   - every `uses:` is a 40-hex SHA with a `# v` comment;
   - every `runs-on` is one of the three exact labels;
   - `bun-version` equals `packageManager`'s;
   - the triggers include `release/**`, and `workflow_dispatch` has the boolean `mutate` and the choice `set`;
   - `permissions` are exactly `contents: read` and `actions: read`;
   - the concurrency group is the expression of decision 5, and `cancel-in-progress` is true for pull requests only;
   - `build` and `checks` skip same-repository pull requests;
   - `site` holds `site.tar`, made from `build` and `.svelte-kit/output`, with `if-no-files-found: error`; every test job extracts it and checks both files; none runs `bun run build`;
   - the shard list is 1 to 8 and the `--shard` divisor is 8; `browsers` has `timeout-minutes: 45`;
   - no `run:` step contains `${{ toJSON(` or `${{ inputs.`; such values reach scripts through `env`;
   - no step runs `bun x` or `npx`;
   - `gate` needs every other job and runs `if: always()`.
   The fallback bootstrap file is checked too: only `workflow_dispatch`, the same inputs, no `push`. Fails today: no files.
4. **`tests/unit/sr-rules.test.ts`** feeds `rules.ts` fixture windows:
   - `019`'s pass and fail cases;
   - a message split across two phrases (passes L1); a message cut off (fails L1);
   - a curly apostrophe against a straight one (passes);
   - the title read twice in a row (fails L3);
   - an empty after window (X0 for every rule); an empty before window with L1 holding (passes L2);
   - ten `next()` steps that reach the sentinel (fails O2); ten steps with fewer than three distinct phrases (X0);
   - focus not returned (fails O3); a sub-menu's Escape speaking the parent item (passes O3s);
   - a tooltip's text missing from the after window (fails T1);
   - the chart's caption out of order (fails C1); a tooltip text in the steps (fails C2);
   - the same phrases worded as VoiceOver and as NVDA (both pass).
   Fails today: no module.
5. **`tests/unit/sr-items.test.ts`** re-derives candidates from `src/lib/registry/`, including role-map values, and checks each is in `SR_ITEMS` or `SR_EXCLUDED` with a reason. Each `SR_ITEMS` entry has a `tests/sr/<item>.sr.ts` with at least one test per declared kind, each carrying `item`, `rules` and `hears`; each `hears` entry is the item or one of its transitive dependencies. Fails today: no module.
6. **`tests/unit/mutations.test.ts`**: `git apply --check` on each patch and on each set together; no two in a set share a file; each set's `expected.json` equals its derivation; every patch has a witness under every pair; `notProvable` entries carry a pair and a run id. Two fixture tables check the derivation itself: one where patches 1 and 4 have only the form blocks in common shows the witness rule failing; and one with a part-qualified patch, `toast:assertive` with fault L1, over three fixture tests that hear `toast:assertive`, `toast:polite` and `toast`, expects the first and third to fail and the second not. A `hears` part not declared for its item fails the test. Fails today: no patches.
7. **`tests/unit/fault-ledger.test.ts`**: each line names an existing small-change spec and an existing test, one `where`, a non-empty `expect`; and `engines.ts`'s `ENGINE_ONLY` matches its `onlyIn()` calls. Fails today: no module.
8. **`tests/unit/gate.test.ts`**: `gate.ts`'s table: all success passes a full run; any failure, cancellation or skip fails it; a mutation run passes only with `report` successful and `browsers`, `checks` and `perf` skipped; an empty `MUTATE` is a full run. A same-repository pull request, over recorded `gh api` JSON: **a green push run** for the head commit passes; **a red push run** fails; **no push run** fails with its message; a push run still in progress is waited for, and one that never completes within the limit fails. Fails today: no module.
9. **`tests/unit/release-check.test.ts`**: the two checks as pure functions, over recorded `gh` JSON, with the expected job names taken from `scripts/ci/workflow.ts`'s parse of `matrix.yml` (and, in one case, of a fixture workflow with a different shard count, to show the list follows the file): no run; a failed run; a pull-request run on the same commit; a mutation run whose `gate` succeeded; a run for another commit; a run with a skipped job; a green run on attempt 2 (qualifies, attempt printed); a green run; a non-empty ledger; `gh` missing. Fails today: no functions.
10. **`deps.test.ts` `PACKAGES_022`**: `@guidepup/playwright` 0.21.0 and `@guidepup/setup` 0.29.2, exact. Fails today: not installed.
11. **The screen-reader tests** are proven by the mutation run (decision 15), since no machine here may run them under VoiceOver or NVDA.

## Acceptance criteria

1. **Projects.** `playwright.config.ts` declares exactly the seven projects of decision 2, as `matrix.test.ts` checks. (unit)
2. **Project reads and imports.** No file in `tests/e2e/` but `scheme.ts` reads `.project.name`; every spec file imports the shared `test`. (unit)
3. **Chromium unchanged.** `bun run test:e2e` lists 2,981 tests (or the count at build start, plus only the tests this spec adds) and passes. (e2e, local)
4. **All engines listed.** `bun run test:e2e:engines --list` lists the Chromium count plus four times the dark project's count: 8,881 at today's 2,981. `build-output` is only in `chromium-light`. (e2e, local)
5. **Engine-only tests counted.** Every `onlyIn()` call is in `ENGINE_ONLY` with an API-naming reason. `brand.spec.ts:75` and the five clipboard grants are each guarded, rewritten or shown to pass in all engines. The landing notes give the count. (unit; e2e)
6. **The workflow.** `workflow.test.ts` passes on `matrix.yml` and the bootstrap. (unit)
7. **Both trees travel.** `site` is one `site.tar` holding `build/` and `.svelte-kit/output/`. Every test job extracts it and checks `build/index.html` and `.svelte-kit/output/server/manifest.js` before testing; none builds. In the first run, every test job's server starts. (unit; CI)
8. **The scripted set.** `SR_ITEMS` holds the 28 items of decision 11; every derived candidate, role maps included, is listed or excluded with a reason; `breadcrumb` and `input-group` are excluded. (unit)
9. **One file per item.** 28 `tests/sr/*.sr.ts` files, each with a test per declared kind, each annotated with `item`, `rules` and `hears`. (unit)
10. **The rules.** `sr-rules.test.ts` passes on every fixture of test 4; `fixtures.ts` starts every reader with `capture: true`. (unit)
11. **`019`'s script moved.** `tests/sr/error-summary.sr.ts` holds `019` decision 12's steps and rule; `scripts/a11y/voiceover-error-summary.ts` is gone. (unit, review)
12. **The first full run.** A `matrix` push run on a commit of this spec completes. Its `gate` is green, with every fault found listed in the ledger, each with a small-change number and an `expect`. Its run id is in the landing notes. (CI)
13. **VoiceOver ran.** That run's `voiceover` jobs logged speech for all 28 items in both browsers: `sr-logs/voiceover-webkit/` and `sr-logs/voiceover-chromium/` each hold 28 files. (CI)
14. **NVDA ran.** The same for `nvda-chromium` and `nvda-firefox`. (CI)
15. **The mutation run.** A run dispatched with `gh workflow run matrix.yml --ref release/0.13.0 -f mutate=true` fails exactly the tests in the `main` set's `expected.json`, each with its expected rule fault, under all four reader and browser pairs; every patch's witness fails; no other screen-reader test fails; its `gate` passes as a mutation run. Any pair where patch 7 cannot prove L3 follows decision 15's four steps, with the `double-read` run's id. The run ids are in the landing notes. (CI)
16. **The mutations stay applicable.** `mutations.test.ts` passes in `checks` on the run of criterion 12. (unit; CI)
17. **The report.** `matrix-report` holds `report.json`, `html/`, `sr-logs/` and the summary of decision 14. (CI)
18. **Flakes.** A scratch browser test that fails once and passes on retry, run locally with `CI=1`, fails the run under `failOnFlakyTests`. The scratch test is deleted; the landing notes record the run. (e2e, local)
19. **The ledger works three ways.** Shown locally with a scratch line and a scratch test, in the landing notes: a ledgered test failing as its `expect` says keeps the run green; the same test passing turns it red; the same test failing for a different reason turns it red (or, under decision 16's fallback, `report` fails on its `ledger-mismatch`). (e2e, local)
20. **The tag gate.** `release-check.ts` exits 1 for every failing fixture of test 9, and exits 0 only for a green push run of `HEAD` with every job succeeded and an empty ledger. Once for real at the 0.13.0 tag. (unit; release)
20a. **A same-repository pull request's `gate` mirrors its push run.** `gate.test.ts`'s pull-request cases pass: a green push run passes, a red one fails, none fails. (unit)
21. **Pins.** `@guidepup/playwright` 0.21.0 and `@guidepup/setup` 0.29.2 are exact devDependencies, in `bun.lock` and `PACKAGES_022`. No registry item gains a dependency. (unit)
22. **Shard times.** The landing notes give each shard's duration from the first green run. The slowest is under 20 minutes, or a small change in lane E raises the count (decision 7). (CI)
23. **Nothing else moved.** `git diff` touches no file under `src/lib/registry/`, `tokens/`, `src/lib/site/` or `static/`. The landing's edits to `handoff.md` and `registry.test.ts` are decision 13's, and no page changes. (review)
24. **The scorecard.** Row 3 (h) is ✓ for Kuiper, count 3, score 1, with criterion 12's run id as evidence, as decision 20 says; the run log has a row. (measure)

## Build order

1. **Confirm the tools.** Bun 1.3.14 has `Bun.YAML`; `@guidepup/playwright` 0.21.0 and `@guidepup/setup` 0.29.2 install beside Playwright 1.64.1. Prove the ledger fixture's mechanism (decision 16). Run the unit tests and criterion 3's listing once under 1.3.14 (decision 17). Write unit tests 1 to 10 and see each fail.
2. **The config, the shared `test`, the helpers.** Seven projects; `scheme()` and `projectLabel()`; all 28 spec files on the shared `test`. `bun run test:e2e` passes with the same count (criterion 3).
3. **Firefox and WebKit locally.** `bun run test:e2e:engines`. Triage every failure (decision 16). Harness faults are fixed now. Site and item faults get a ledger line with its `expect`, and a small-change number. The design lead opens each small change.
4. **The screen-reader suite.** Rules, items, fixtures, the 28 files, both mutation sets and their `expected.json` files. `mutations.test.ts` passes.
5. **The rehearsal,** if the owner allows it (Q9). The Linux engines in Playwright's 1.64.1 image; `tests/sr/` under Orca in guidepup's image. Recorded as rehearsal, not evidence.
6. **The workflow, the bootstrap, `gate.ts`, the release check.** Unit tests pass.
7. **Checkpoint.** The design lead reads the diff, the ledger and the local engine run.
8. **Owner push B:** the release branch with `022` built. The first full run. The builder triages its failures as in step 3, including Linux-only WebKit faults and every screen-reader fault.
9. **Owner dispatch:** `gh workflow run matrix.yml --ref release/0.13.0 -f mutate=true` (criterion 15). No push. If GitHub refuses it, **owner push A** puts the bootstrap on `main`, and the dispatch is repeated (decision 15's fallback). If patch 7 cannot prove L3 under a pair, a second dispatch with `-f set=double-read`.
10. **Owner push C,** if step 8 or 9 needed changes. The run that criterion 12 cites is the last green one.
11. **Change review,** then landing (with decision 13's two edits), then the scorecard (criterion 24).

The plan has one push for certain (B), a likely second (C), and one or two dispatches. Push A is needed only if GitHub refuses the dispatch. Without step 5's rehearsal, another fix push is likely. If more are needed, the design lead asks the owner before each (Q8).

## Risks

- **The first run's size is unknown** (`roadmap.md` §5). Many faults would lengthen 0.13.0. The ledger lets other specs land meanwhile; the tag waits (Q3).
- **Every CI iteration waits on the owner.** Decision 4, and the rehearsal if allowed (Q9), find faults before the first push. The mutation run is a CLI dispatch on the release branch, with no push.
- **GitHub refuses the dispatch while `main` has no `matrix.yml`.** GitHub's events page says a workflow that has run once can be dispatched on any branch or tag through the CLI, and `gh`'s `--ref` runs that ref's copy (READ; EXECUTED, decision 15). If GitHub still refuses, push A puts the bootstrap on `main` (Q7 option 2).
- **A reader merges repeated announcements,** so patch 7 cannot prove L3 under that pair. Decision 15 states the four steps in advance.
- **guidepup under Bun on Windows is untried** (memo §7). The fallback is Node for that job only.
- **Speech timing on shared runners.** Two retries absorb it on development pushes; release runs ledger any flake (decision 18).
- **macOS queueing.** Five macOS jobs at once, shared with every public repository's demand. A run may wait. The 60-minute job timeout counts run time, not queue time.
- **An image update changes the reader.** `macos-26` and `windows-2025` are updated by GitHub weekly. guidepup's manifest pins NVDA and VoiceOver's preferences, not VoiceOver itself. A changed phrase shows as a rule fault, triaged like any fault.
- **A ledgered test checks nothing after its failing assertion** (decision 16). The empty-ledger rule before a tag bounds it.
- **Perf on runners** (Q1).

## Open questions for the owner

Recommended option first. Each answer goes in the landing notes.

**Q1. How do the LCP budgets gate in CI?** Transfer budgets gate from the first run either way.
1. **Report LCP in CI now; gate it once `024` re-bases the per-template budgets on the runner.** `024` is already in wave 1. The landing notes carry the runner's first figures.
2. Gate LCP in CI now, with budgets re-based on the runner's first three runs. A budget change needs your ruling.
3. Keep LCP out of CI; the release check runs `perf` locally before each tag.

**Q2. Do flaky tests block?**
1. **A flaky browser test fails the run. A screen-reader test may pass on its second or third try on a development push, and is listed. On a release run, any screen-reader flake gets a ledger line and blocks the tag, unless the design lead records it as reader timing, with the phrases that show it** (decision 18).
2. Both fail on any flake, on every push.
3. Both pass on retry, and are listed.

**Q3. May a release be tagged with open faults in the ledger?**
1. **No. The tag waits until the ledger is empty** (constitution §2.5: every check passes for every item).
2. Yes, with the faulty items' pages showing a failing status. This needs a constitution amendment.

**Q4. How is the gate enforced on GitHub?**
1. **The release check reads the run with `gh`, and you add a ruleset on `main` requiring `gate`.** The ruleset is a repository setting only you can make.
2. The release check only.

**Q5. How many reader and browser pairs?**
1. **Four: VoiceOver on `macos-26` with WebKit and Chromium; NVDA on `windows-2025` with Chromium and Firefox.**
2. Eight: also `macos-15` and `windows-2022`, to catch differences between OS versions.
3. Two: VoiceOver with WebKit, NVDA with Chromium.

**Q6. JAWS and Orca as evidence?** guidepup cannot drive JAWS. It can drive Orca on `ubuntu-26.04`.
1. **Neither in 0.13.0. Pages say "JAWS is not tested", through `030`.**
2. Add an Orca job now, with Firefox, at about three minutes a run.
3. You listen with JAWS by hand once per release.

**Q7. How does the mutation run start?** It is a manual run (`workflow_dispatch`) on the release branch. GitHub's events page says such a run needs the workflow on `main`, the default branch, but also that "once a workflow has run at least once, you can dispatch it against any branch or tag via the GitHub API or GitHub CLI". `gh`'s own help says `--ref` runs that branch's copy of the workflow. A push to `release/**` runs the workflow, so after push B it has run once.
1. **The CLI, after push B, with no push to `main`.** You run `gh workflow run matrix.yml --ref release/0.13.0 -f mutate=true`. If GitHub refuses, option 2 follows.
2. **A bootstrap on `main` (push A), then the same command.** A small `matrix.yml` with only the manual trigger, which runs nothing by itself. It also makes the Actions page's "Run workflow" button appear. The full file replaces it when the release merges.
3. **A `mutation/**` branch.** The workflow also runs mutations on a push to a branch named `mutation/…`. No push to `main`, but one more push each time the proof is run, and the release check must also reject that branch's runs.

**Q8. When, and how often, do you push?** Agents never push. The plan's pushes, in order:
1. **Push B (the release branch, once `022` is built), a likely push C (fixes from the first run), then one push after each later 0.13.0 landing,** so every landing has a green run. Push A to `main` only if Q7's option 1 is refused. With Q9's rehearsal, C is less likely; without it, another fix push is likely. The design lead asks before any push beyond these.
2. Only before a tag. Faults surface later and in bulk, and the first tag attempt is likely to fail.

**Q9. May the builder rehearse in containers on this machine, before push B?** Docker is installed here. Nothing changes a macOS setting.
1. **Yes.** Two dry runs, recorded in the landing notes as rehearsal, never as evidence: the browser suites in Playwright's Linux image at 1.64.1 (`mcr.microsoft.com/playwright:v1.64.1-noble`), for Linux-only Firefox and WebKit faults; and `tests/sr/` under Orca in guidepup's image (`ghcr.io/guidepup/guidepup`, pinned by digest, recorded), to run the screen-reader test code once before CI. Orca's wording differs from VoiceOver's and NVDA's, so only the code paths are rehearsed, not the pass rules' verdicts.
2. **A virtual screen reader only.** `@guidepup/virtual-screen-reader` walks the flows in a browser with no container. Weaker: it simulates a reader, and adds a dependency.
3. **Neither.** The plan's likely push count rises by one (Q8).

## Review

Reviewed 2026-11-15: [`../reviews/022-the-test-matrix-spec-2026-11-15.md`](../reviews/022-the-test-matrix-spec-2026-11-15.md), "does not land yet": 2 High, 7 Medium, 7 Low. All accepted, and answered here:

1. **Accepted (High).** `vite preview` serves `.svelte-kit/output/`, confirmed in SvelteKit 3.1.0's preview source (memo §4a). The `site` artifact is one tar of `build/` and `.svelte-kit/output/`; each job extracts and checks both before testing (decision 6; criterion 7; test 3). The twins' absence from preview is stated as unchanged.
2. **Accepted (High).** The dispatch runs on the release ref. After the re-review (R5), the CLI route comes first and the bootstrap on `main` (push A) is its fallback (decision 15; build step 9; Q7; Q8).
3. **Accepted (Medium).** The arithmetic is corrected to about 108 and 162 worker-minutes (memo §1). Eight shards per engine; `timeout-minutes: 45` for the first runs; queueing stated (decision 7).
4. **Accepted (Medium).** The release check requires `event=push`, `headSha=HEAD`, a non-mutation `displayTitle` from `run-name`, and every declared job succeeded, none skipped. Attempts above 1 are allowed, printed and recorded (decisions 18, 19; test 9's three new fixtures).
5. **Accepted (Medium).** Concurrency groups by commit, with mutation runs apart; only pull requests cancel. Same-repository pull requests are skipped; their push run is the evidence (decision 5; test 3).
6. **Accepted (Medium).** Each ledger line has one `where` and an `expect` matcher; an automatic fixture turns a mismatched failure red, with a stated fallback. Every spec file imports one shared `test`; all 28 are in scope (decision 16; criterion 19's third case).
7. **Accepted (Medium).** `capture: true`; one normalisation; "spoken whole" across one or two phrases; X0 and a positive precondition on every rule; the sentinel; Escape rules per overlay kind, with sub-menus; a testable chart rule (decision 12; test 4).
8. **Accepted (Medium).** Seven patches on seven files, covering L1, L3, F1, O1, O2 and O3; `expected.json` derived through `hears` and the dependency graph; `git apply --check` in the unit tests; the report compares rule faults, and rejects failures on set-up (decision 15; test 6; criteria 15, 16).
9. **Accepted (Medium), as a question.** Q9 offers container rehearsals, Orca and Linux engines, with no macOS setting changed. Build step 5 runs them if allowed.
10. **Accepted (Low).** 42 reads in 15 files; 39 scheme reads to `scheme()`, 3 labels to `projectLabel()`; test 2's pattern is `/\.project\.name\b/` (decision 2).
11. **Accepted (Low).** Five clipboard grants in four files, and `brand.spec.ts:75`'s unguarded CDP, are the first cases for decision 3 (criterion 5).
12. **Accepted (Low).** `breadcrumb` and `input-group` are excluded with reasons; the derivation reads role-map values, so `alert` and its like are found (decision 11). The set is 28.
13. **Accepted (Low).** guidepup runs through `package.json` scripts, never `bun x`; `needs` and `inputs` reach `gate.ts` through `env`, with empty `MUTATE` as false; `@guidepup/setup` is pinned at 0.29.2, the version with end-to-end evidence; Bun 1.3.14 against the local 1.4.4 is checked or recorded (decisions 10, 17, 19).
14. **Accepted (Low).** `handoff.md:30` and `registry.test.ts:1913–1915` are edited at landing; the page is not (decision 13; Scope).
15. **Accepted (Low).** On a release run any screen-reader flake is ledgered unless recorded as timing; put to the owner in Q2's first option (decision 18).
16. **Accepted (Low).** The `019` listen is one manual listen; `022` earns (h) by scripting it, and does not move the count twice (decision 20).

### The re-review (2026-11-15)

The re-review closed the 16 findings above, approved with changes, and raised R1 to R6. All are applied:

- **R1, accepted (Medium).** A same-repository pull request's `gate` mirrors the push run for its head commit through `gh api`, with `actions: read` added to `permissions`. It fails when that run is red, or when no push run exists, as for a branch outside `main` and `release/**` (decisions 5 and 19; test 3; test 8's three cases; criterion 20a).
- **R2, accepted (Low).** Each patch has a witness test that no other patch in its set reaches with the same fault; patches 1 and 4 are witnessed by `alert`'s and `error-summary`'s own tests. What happens if a reader merges patch 7's repeated announcements is stated in advance, with a `double-read` set (patch 7b) dispatched on its own (decision 15; test 6; criterion 15).
- **R3, accepted (Low).** The pin's evidence is `guidepup/guidepup`'s own green runs 42476096268 and 42476096312 (2026-11-08, `@guidepup/setup@0.29.2` with guidepup 0.40.0, on `macos-26` and `windows-2025`), confirmed here through GitHub's API (decision 17; memo §2).
- **R4, accepted (Low).** Decision 16 names the mechanism, `testInfo.expectedStatus = "passed"` after `use()`, says it is undocumented, re-runs criterion 19's third case on every Playwright bump, and says a retry stays red.
- **R5, accepted (Low).** The `--ref` route is READ (GitHub's events page) and EXECUTED (`gh workflow run --help`), and is first in Q7. After push B the mutation run is dispatched with `--ref release/0.13.0`; the bootstrap on `main` is the fallback. Q8's push list matches (decision 15; build order; Risks).
- **R6, accepted (Low).** The release check derives its expected job names from `matrix.yml`, through the parser `workflow.test.ts` also uses (decision 19; test 9).

**From `026`'s re-review (its R4).** The derivation was too coarse for an item with several live parts: every toast test hears `toast`, so a patch to the assertive announcer alone would predict every toast test failing. A `hears` entry, and a patch, may now name an item and one part (`toast:assertive`). The derivation matches on the part when one is given, and on the whole item otherwise (decisions 12 and 15; test 6's example).

## Landing notes

**The owner's answers (the owner, 2026-11-15).** The owner accepted the recommended option for every question:

- **Q1:** option 1. LCP is reported in CI now, and gates once `024` re-bases the budgets on the runner. Transfer budgets gate from the first run.
- **Q2:** option 1. A flaky browser test fails the run. A screen-reader flake may pass on retry on development pushes. On a release run it gets a ledger line, unless the design lead records it as reader timing.
- **Q3:** option 1. No tag while the ledger holds an open fault.
- **Q4:** option 1. The release check verifies the green run through `gh`. The owner sets a ruleset on `main` requiring `gate`.
- **Q5:** option 1. Four pairs: VoiceOver with WebKit and Chromium, and NVDA with Chromium and Firefox.
- **Q6:** option 1. No JAWS or Orca evidence in 0.13.0. Pages say JAWS is not tested.
- **Q7:** option 1. The mutation run starts with `gh workflow run matrix.yml --ref release/0.13.0` after push B, with no push to `main`. The bootstrap on `main` is the fallback only if GitHub refuses.
- **Q8:** option 1. Push B, a likely push C for first-run fixes, then one push after each later landing. Push A happens only if Q7's route is refused. The owner makes every push; agents never push.
- **Q9:** option 1. Rehearse in containers on this machine before push B: Playwright's Linux image at 1.64.1, and Orca in guidepup's image. These count as rehearsal only, and no macOS setting changes.

Not yet landed.
