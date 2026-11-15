# The test matrix: three engines, two screen readers, on GitHub Actions

- **Status:** a memo. It commits us to nothing. [`022`](../specifications/022-the-test-matrix.md) stands on it. **Corrected 2026-11-15, before `022` was built,** from its spec review ([`reviews/022-the-test-matrix-spec-2026-11-15.md`](../reviews/022-the-test-matrix-spec-2026-11-15.md)): §1's shard arithmetic (findings 3); §2's choice of `@guidepup/setup` version (13); §3's dispatch, pull-request and concurrency rules (2, 4, 5); §4's counts, the clipboard and CDP uses, and the folders `vite preview` serves (1, 10, 11); §6's list (12). Each corrected passage says so.
- **Date:** 2026-11-15
- **Author:** the design lead
- **Question:** How should Kuiper run every browser suite in Chromium, Firefox and WebKit, and drive VoiceOver and NVDA by script, on GitHub-hosted runners? What does it cost, and how big is the suite?
- **What would answer it:** the current guidepup packages and how their own CI runs VoiceOver and NVDA; GitHub's runner sizes and limits for public repositories; Playwright's sharding; how Carbon, Primer, Spectrum and GOV.UK test across engines and with screen readers; the suite measured here.
- **What it blocks:** `022`. Through it, `030` (the accessibility status) and `035` (states in axe).

**Labels.** **EXECUTED:** run here on 2026-11-15, macOS (Darwin 25.5.0, arm64, 10 cores), Bun 1.4.4, Playwright 1.64.1. **READ:** a source says so, linked, read 2026-11-15. **INFERRED:** our reasoning.

**Terms.** A **runner** is the virtual machine GitHub starts for one job. A **shard** is one slice of a test suite, run by one job. A **blob report** is Playwright's per-shard result file, merged later into one report. **guidepup** is an MIT library that starts a real screen reader and returns what it spoke. **TCC** (Transparency, Consent and Control) is the macOS database of privacy permissions; **SIP** (System Integrity Protection) is the macOS guard that stops writes to it. A **spoken-phrase log** is the list of phrases a screen reader said, in order.

## In short

1. **The suite is 2,981 browser tests today, in Chromium only** (EXECUTED). Three engines make it about 8,900. The roadmap guessed 2,000 and 6,000 (`roadmap.md` §5); both are low.
2. **guidepup runs VoiceOver and NVDA on GitHub's own runners, every week, green** (READ and EXECUTED, its workflows and their run times). VoiceOver runs on `macos-15`, `macos-26` and `xcode-27`. NVDA runs on `windows-2022` and `windows-2025`. Each job took 1.8 to 3.8 minutes.
3. **The local EPERM is expected, and CI avoids it.** guidepup writes VoiceOver's preferences under `~/Library/Group Containers/group.com.apple.VoiceOver/`, which needs Full Disk Access. GitHub's macOS runners give passwordless `sudo`, and `@guidepup/setup setup --ci` does the rest there (READ).
4. **The GitHub Action is retired.** `guidepup/setup-action` says "no longer supported"; its own docs point to the `@guidepup/setup` CLI (READ). The CLI is the path.
5. **A second set-up step installs the screen readers.** `install` downloads the NVDA build and VoiceOver preference files that the installed `@guidepup/guidepup` names in its `manifest.json`, each with a SHA-256 (READ, the manifest in `node_modules/@guidepup/guidepup/`). So `bun.lock` pins the screen readers too, through guidepup.
6. **Public repositories run standard runners free, with no minute cap** (READ). Concurrency is the limit: 20 jobs at once, 5 of them macOS, on the Free plan.
7. **Playwright shards per test when `fullyParallel` is on** (READ), and this repository already sets it. Blob reports merge into one.
8. **No reference system drives a screen reader by script.** None of the seven clones has guidepup, NVDA or VoiceOver tooling (EXECUTED, grep). Carbon and GOV.UK test by hand. Kuiper would be ahead here, not catching up.
9. **`vite preview` serves `.svelte-kit/output/`, not `build/`** (§4a, READ, corrected after the review). A prebuilt site must carry both folders.
10. **Most references run their browser suites in Chromium only.** Carbon's React suite, Primer React and Spectrum's Playwright accessibility suite each declare one Chrome project (READ). Spectrum's unit tests are the exception: separate CI configurations for Chromium, Firefox and WebKit (READ, file names).

## 1. The suite, measured

`bun --bun playwright test --list --reporter=json --output=<scratch>` lists every test without building or serving the site (EXECUTED). Listing skips global set-up, so `webServer` does not start (INFERRED, from Playwright's runner; confirmed here because no build ran and `test-results/` was untouched). It must run under Bun's runtime: under Node the listing fails, since a source file imports `registry.json` with no import attribute (EXECUTED).

| Project | Tests |
|---|---|
| `light` | 1,501 |
| `dark` | 1,475 |
| `perf` | 5 |
| **Total** | **2,981** |

The 26-test gap between `light` and `dark` is `build-output.spec.ts`, which runs in `light` only (READ, `playwright.config.ts`). The largest files, both schemes together (EXECUTED):

| File | Tests | File | Tests |
|---|---|---|---|
| `axe.spec.ts` | 840 | `on-brand.spec.ts` | 122 |
| `theme.spec.ts` | 286 | `blocks.spec.ts` | 102 |
| `keyboard.spec.ts` | 250 | `tokens.spec.ts` | 86 |
| `spacing.spec.ts` | 204 | `site.spec.ts` | 80 |
| `compositions.spec.ts` | 174 | `viewer.spec.ts` | 78 |
| `expressive.spec.ts` | 172 | 18 more files | 587 |

**Projected,** with Firefox and WebKit in both schemes and `build-output` and `perf` kept to Chromium (INFERRED): 1,501 + 1,475 + 5 + 4 × 1,475 = **8,881**.

**Run time.** The full Chromium run took 9.3 to 12.8 minutes on this machine, build included, over the last ten logged runs on 2026-11-15 (EXECUTED, the run logs: 2,565 passed in 9.3 m; 2,700 in 12.8 m). Playwright's default is half the cores as workers, here 5 (INFERRED, from Playwright's documented default; not re-read today). So one test costs about 1.1 worker-seconds here (INFERRED: about 10 minutes × 5 workers ÷ 2,700).

**Sizing the shards** (INFERRED; the first CI run replaces it):

- A standard Linux runner has 4 vCPUs (§3). Playwright gives it 2 workers.
- Assume a runner core is half as fast as this machine's, so 2.2 s per test, and Firefox and WebKit 1.5 times Chromium.
- Per engine, 2,950 tests × 2.2 s = 6,490 s: Chromium about **108 worker-minutes**, Firefox and WebKit about **162** each. (Corrected after the review: the first draft said 54 and 81, half the product.)
- At 5 shards per engine and 2 workers each, a Chromium shard is about 11 minutes of tests and a Firefox or WebKit shard about 16. With about 4 minutes of set-up (install, browsers, the built site), they end near 15 and 20 minutes.
- At 8 shards per engine: about 7 and 10 minutes of tests, ending near 11 and 14.
- These are optimistic. A runner's 4 vCPUs are hardware threads, not cores, and each worker drives a whole browser beside `vite preview`. The first run also has failures: a failing test waits out its timeouts, then retries.
- Jobs beyond the 20-at-once limit queue; they do not fail (§3). Concurrency limits wall time, not the shard count.

## 2. guidepup

### The packages (READ, the npm registry, 2026-11-15)

| Package | Latest | Published | Licence | Needs |
|---|---|---|---|---|
| `@guidepup/guidepup` | 0.40.0 | 2026-11-01 | MIT | — (already pinned here at exactly 0.40.0, `019`) |
| `@guidepup/setup` | 0.29.3 | 2026-10-14 | MIT | binary `guidepup` |
| `@guidepup/playwright` | 0.21.0 | 2026-10-25 | MIT | peers `@playwright/test` ≥ 1.62.1, `@guidepup/guidepup` ≥ 0.38.0 |
| `@guidepup/virtual-screen-reader` | 0.33.0 | 2026-09-20 | MIT | a simulated reader; not a real one |
| `@playwright/test` | 1.65.1 | 2026-11-13 | Apache-2.0 | (the repository pins 1.64.1) |

`@guidepup/playwright` 0.21.0 accepts the repository's Playwright 1.64.1 and guidepup 0.40.0 (READ, its peer ranges). Playwright 1.65.1 is two days old; the repository's two-week rule for new versions keeps 1.64.1 (INFERRED).

### What each does (READ, the three READMEs, 2026-11-15)

- **`@guidepup/setup setup --ci`** configures the operating system once per machine, with no prompts. On macOS it enables VoiceOver's AppleScript control and writes the TCC permissions. `--macos-record` saves a screen recording of the set-up to `./recordings/`, for when it fails. `--macos-ignore-tcc-db` skips the TCC write, where SIP forbids it. Writing TCC on a machine with SIP on needs SIP off; the README warns of "serious security implications". This is why the owner's machine refused, and why it should.
- **`@guidepup/setup install`** downloads the screen-reader assets the installed guidepup names: a portable NVDA on Windows, VoiceOver preference files on macOS, Orca on Linux. It caches them under `~/Library/Caches/guidepup/` or `%USERPROFILE%\AppData\Local\guidepup\`.
- **`@guidepup/guidepup` 0.40.0's manifest** names, with a SHA-256 each (READ, `node_modules/@guidepup/guidepup/manifest.json`): NVDA asset `guidepup-nvda-0.2.1-2026.3.zip` (NVDA 2026.3); VoiceOver preference files per macOS version, `macos-14` to `macos-26` and `xcode-27`; Orca 51.1.
- **Which `@guidepup/setup`** (added after the review). guidepup-playwright's green end-to-end runs on `macos-26` and `windows-2025` call `@guidepup/setup@0.29.2` (READ, its workflows). 0.29.3 (2026-10-14) followed four days later; its release notes list no change beyond the compare link (READ, GitHub's releases API). `guidepup/setup`'s own test workflow passed at `main` on 2026-10-31, after 0.29.3, having failed twice that day on a dependency bump (EXECUTED, its runs API). 0.29.2 is the version with end-to-end evidence on our runner labels. **The stronger evidence** (added after the re-review): `guidepup/guidepup`'s own workflows, at its version 0.40.0 (ours; its `package.json` at `main`, READ), run `@guidepup/setup@0.29.2`. Both were green on `main` on 2026-11-08 at commit `77fc318b`: run 42476096268, "Playwright VoiceOver", 9 jobs on `macos-15`, `macos-26` and `xcode-27` with Chromium, Firefox and WebKit; and run 42476096312, "Playwright NVDA", 4 jobs on `windows-2022` and `windows-2025` with Chromium and Firefox (EXECUTED, GitHub's API, 2026-11-15). guidepup-playwright's lockfile resolves guidepup 0.38.0 (the re-review, EXECUTED), so its runs pair 0.29.2 with an older manifest.
- **`@guidepup/playwright`** gives test fixtures: `voiceOverTest`, `nvdaTest`, `orcaTest`, and `screenReaderTest`, whose `screenReader` is VoiceOver on macOS and NVDA on Windows. `withGuidepup(config)` makes the run serial and the browser headed. `navigateToWebContent()` moves the reader into the page. `capture(fn)` wraps a Playwright action and returns what the reader said because of it. Spoken-phrase capture defaults to `"initial"`; `true` adds usage hints.
- The old local error, EPERM on `~/Library/Group Containers/group.com.apple.VoiceOver`: guidepup reads and writes VoiceOver's preferences there when that folder exists, else in `~/Library/Preferences` (READ, `lib/macOS/VoiceOver/preferences/getPreferencesDirectory.js`). Writing a group container needs Full Disk Access for the terminal (EXECUTED by the owner's attempt, `019`'s status line).

### How guidepup's own CI runs them

`guidepup/guidepup-playwright`'s workflows, read at `main` on 2026-11-15 (READ):

- **VoiceOver:** `runs-on` a matrix of `macos-15`, `macos-26` and `xcode-27`, each with Chromium, Firefox and WebKit. Steps: checkout, setup-node, `npx @guidepup/setup@0.29.2 setup --ci --macos-record`, install, `playwright install`, `npx @guidepup/setup@0.29.2 install`, the tests, and an artifact of `test-results/` and `recordings/` uploaded `if: always()`.
- **NVDA:** `windows-2022` and `windows-2025`, each with Chromium and Firefox. The same steps, without `--macos-record`.
- **Its configs** (READ, `examples/playwright-voiceover/webkit.config.ts`): `withGuidepup`, a 5-minute test timeout, `retries: 5`, the `github` and `html` reporters on CI.

The last runs of each workflow, from GitHub's API (EXECUTED, fetched 2026-11-15): VoiceOver run 40227054817, 9 jobs, all success, 1.8 to 3.8 minutes each (WebKit the slowest, 3.5 to 3.8). NVDA run 40227054760, 4 jobs, all success, 1.8 to 3.0 minutes. The five VoiceOver runs before it, 2026-10-14 to 2026-10-25, were all green.

`guidepup/setup`'s own test matrix also covers `macos-15-intel`, `macos-26-intel`, `windows-11-arm`, `ubuntu-26.04` and `ubuntu-26.04-arm`, and checks that `ubuntu-22.04` is refused (READ, its `test.yml`).

**What this means for Kuiper** (INFERRED):

- The macOS runner does what the owner's machine would not. No setting on the owner's machine changes.
- One spec file can run under both readers through `screenReaderTest`. The readers word things differently ("heading level 1 Guidepup" in VoiceOver against "Guidepup, heading, level 1" in NVDA, READ in the README's examples). So assertions should test for a phrase's text, not match whole logs. `019`'s pass rule already works that way.
- The real pairings are VoiceOver with Safari and NVDA with Chrome or Firefox. Playwright's WebKit on macOS is the nearest Safari a script can drive.
- guidepup retries up to 5 times in its own examples. Screen-reader speech timing is outside the page's control. A retry budget is needed, and should be stated.

## 3. GitHub Actions for a public repository

READ, `docs.github.com`, 2026-11-15:

| Runner | Labels | CPU | RAM |
|---|---|---|---|
| Linux x64 | `ubuntu-24.04`, `ubuntu-26.04`, `ubuntu-latest` | 4 | 16 GB |
| Windows x64 | `windows-2025`, `windows-2022`, `windows-latest` | 4 | 16 GB |
| macOS arm64 (M1) | `macos-15`, `macos-26`, `macos-latest`, `xcode-27` | 3 | 7 GB |
| macOS Intel | `macos-15-intel`, `macos-26-intel` | 4 | 14 GB |

- "Use of the standard GitHub-hosted runners is free and unlimited on public repositories." Larger runners are billed even for public repositories.
- Linux and macOS runners run with passwordless `sudo`. Windows runs as administrator with UAC off.
- A job may run 6 hours. A workflow run may last 35 days. A matrix may have 256 jobs.
- **`workflow_dispatch`** "will only trigger a workflow run if the workflow file exists on the default branch". The page adds: "Once a workflow has run at least once, you can dispatch it against any branch or tag via the GitHub API or GitHub CLI." The same page gives `GITHUB_SHA` for `workflow_dispatch` as the "Last commit on the `GITHUB_REF` branch or tag" (READ, the re-review). And `gh workflow run --help` (gh 2.103.3) defines `--ref` as "Branch or tag name which contains the version of the workflow file you'd like to run" (EXECUTED, 2026-11-15). So a dispatch on a branch runs that branch's copy (READ, added after the re-review; the first correction had said the page was silent on this). The repository's remote has only `main` (EXECUTED by the reviewer).
- **For `pull_request`,** `GITHUB_SHA` "is the last merge commit of the pull request merge branch" (READ, the events page). A pull-request run tests a merge, not the branch's head.
- **Concurrency:** "any existing `pending` job or workflow in the same concurrency group will be canceled" when a newer one queues. `cancel-in-progress: true` also cancels a running one. A `queue: max` option lets up to 100 wait, and may not be combined with `cancel-in-progress: true` (READ, the workflow-syntax page). `run-name` may use the `github` and `inputs` contexts (READ, same page).
- At once, on the Free plan: 20 jobs, 5 of them macOS. Pro: 40 and 5. Team: 60 and 5. The macOS limit is shared, and macOS jobs "may take longer to start" when demand is high.
- Artifact storage on the Free plan is listed as 500 MB. The billing page does not say whether that applies to public repositories. A short `retention-days` keeps us clear of the question (INFERRED).
- The runner pages do not mention SIP or TCC. guidepup's green runs show the set-up works there (INFERRED, from §2).

## 4. Playwright sharding

READ, `playwright.dev/docs/test-sharding`, 2026-11-15:

- `--shard=x/y` runs one of `y` parts. With `fullyParallel: true`, "tests are split at the individual test level, leading to more balanced shard execution". Without it, whole files go to shards.
- The `blob` reporter writes each shard's results to `blob-report/`. `playwright merge-reports --reporter html ./all-blob-reports` joins them. Merging reports from different operating systems needs an explicit merge config.
- The documented GitHub Actions pattern: a matrix of `shardIndex` and `shardTotal`, a blob artifact per shard, and a merge job that `needs` the shards and runs even if some failed.

The repository sets `fullyParallel: true` at the top (READ, `playwright.config.ts`). The `perf` project sets it false and depends on `light` and `dark`, so it runs alone (READ). In CI, a job of its own runs alone on its own machine (INFERRED), so the dependency is not needed there.

**Engine-specific code in the suite** (EXECUTED, grep of `tests/e2e/`):

- **15 files read the project's name: 42 reads** (`grep '\.project\.name\b'`). Corrected after the review: the first draft's 46 in 16 also counted the words "project name" in `error-summary.spec.ts` and `primitives.spec.ts`. Of the 42, three are labels in messages, not scheme reads: `doors.spec.ts:574` and `577`, `site.spec.ts:733`. `code.spec.ts:1461` already reads `info.project.use.colorScheme`. Renaming projects to carry an engine breaks every scheme read.
- **Chromium's DevTools protocol (CDP)** is used in `perf.spec.ts` (network and CPU throttling) and `brand.spec.ts:75` (emulating `prefers-reduced-transparency`, inside a test with no engine guard). CDP exists only in Chromium.
- **Clipboard permissions** (`clipboard-read`, `clipboard-write`) are granted five times in four files: `code.spec.ts:442`, `nav.spec.ts:245`, `keyboard.spec.ts:1039` and `1463`, `search.spec.ts:263` (EXECUTED, corrected after the review; the first draft named two files). Playwright says supported permissions "differ between browsers" (READ, its `grantPermissions` docs). Whether Firefox and WebKit accept these two is not stated; the first run will show (INFERRED).
- **Forced colours** are emulated in `forced-colors.spec.ts` and `brand.spec.ts` through `forcedColors: "active"`. Playwright's docs give no per-engine note (READ). The first run will show.

### 4a. What `vite preview` serves (added after the review)

SvelteKit 3.1.0's preview (READ, `node_modules/@sveltejs/kit/src/exports/vite/preview/index.js`):

- line 30–33: it looks for `<outDir>/output/server/manifest.js`, where `outDir` is `.svelte-kit`, and stops with `preview_build_missing` if it is absent;
- line 42–45: it imports the server's `index.js` and `manifest.js` from there;
- line 86: it serves client assets and `static/` from `output/client`;
- lines 127 and 149: prerendered dependencies and pages from `output/prerendered/`.

It never reads the adapter's `build/`. Locally, after a build, `.svelte-kit/output/` holds `client`, `prerendered` and `server`, 98 MB; `build/` is 63 MB (EXECUTED, `ls`, `du`). `build-output.spec.ts` reads `build/`. So a prebuilt site for the tests needs both trees. The Markdown twins `scripts/site/markdown.ts` writes into `build/<page>/index.md` are not under `.svelte-kit/output/`, so preview does not serve them today either (INFERRED from the source above).

`actions/upload-artifact` at the pinned SHA has `include-hidden-files`, default `'false'`: "If false, hidden files will be excluded from the artifact" (READ, its `action.yml` line 43). `.svelte-kit` is hidden. One tar file avoids the question and keeps file modes (INFERRED).

## 5. How the references do it

### Carbon (READ, clone at `fa75d78`)

- `playwright.config.js` at the root has one project, `chromium`. CI retries twice, uses the `dot` and `blob` reporters, and writes a JSON report for its internal accessibility status (`INTERNAL_AVT_REPORT_DO_NOT_USE.json`).
- `.github/workflows/ci.yml`, job `avt-runner`: `ubuntu-24.04`, a matrix of 4 shards, `--project chromium --grep @avt --shard=i/4`, a prebuilt Storybook served from an artifact, a blob artifact per shard kept 1 day. A `merge-playwright-reports` job merges them. An `avt` job, `if: always()`, fails unless the shards succeeded: a single status to require.
- Actions are pinned by commit SHA with a version comment (for example `actions/checkout@3d3c42e… # v7.0.1`).
- `packages/web-components/playwright.config.js` declares Chromium, Firefox and WebKit. Its CI job runs the web-test-runner suite, not those projects (READ, `ci.yml` `web-components-test`).
- Screen readers: manual JAWS, VoiceOver and NVDA in the definition of done (READ, the 2026-11-15 Carbon memo §2.1). No automation in the clone (EXECUTED, grep).

### Primer (READ, `primer-primitives` clone at `4773648`; `primer/react` at `main`, fetched 2026-11-15)

- `primer/react`'s `playwright.config.ts` declares no projects, so Chromium only. `fullyParallel`, 2 retries in CI, the `blob` reporter in CI, reduced motion on.
- Its `vrt.yml` runs 4 shards on `ubuntu-latest-8-cores`, a billed larger runner, inside `mcr.microsoft.com/playwright:v1.64.1-jammy`. `primer-primitives` runs 3 shards the same way.
- Screen readers: "How to test" steps on each page's Accessibility tab, by hand (READ, the scorecard row 3). No automation found.

### Spectrum (READ, `adobe/spectrum-web-components` at `main`, fetched 2026-11-15; the clone holds only design data)

- The Playwright accessibility suite (`playwright.a11y.shared.config.ts`) declares two projects, both `Desktop Chrome`.
- The component unit tests have `web-test-runner.config.ci-chromium.js`, `…ci-firefox.js` and `…ci-webkit.js` under `1st-gen/` (READ, file names only). CI runs on CircleCI (`.circleci/`).
- Screen readers: nothing found.

### GOV.UK (READ, `govuk-frontend` clone at `a11bd33`)

- `.github/workflows/tests.yml` runs every test task on `ubuntu-24.04` and `windows-latest`. Component and accessibility tests use Puppeteer with Chrome. Firefox and Safari are not run in CI.
- Visual checks run through Percy (`screenshots.yml`), with a BrowserStack account to approve them (READ, `docs/releasing/testing-and-linting.md`).
- Browsers and assistive technology are tested by hand, before releases, against the Service Manual's lists (READ, `docs/contributing/testing.md` §4, `browser-support.md`). NVDA's behaviour on the error summary is a code comment (READ, the GOV.UK memo).

### What follows (INFERRED)

- The pattern to adopt is Carbon's: shards on standard Linux runners, a prebuilt site from an artifact, blob reports merged, one `if: always()` job as the status to require, and actions pinned by SHA.
- None of them shows how to gate a release on a screen-reader run. guidepup's own workflows are the only working example. They are small, short, and green.
- Running all three engines in CI is more than any reference does for its main suite. It is what constitution §4.4 asks.

## 6. Which items need a screen-reader run

Constitution §4.4: "An item with a live region, a focus move or an overlay is checked with a screen reader, by script wherever a script can drive one." Each item's source was searched for live roles, `Status`, `.focus(`, `tabindex="-1"` targets, portals, overlays and sheets (EXECUTED, grep of `src/lib/registry/`). Of 75 items, 28 qualify (corrected after the review: `input-group` moved to "Not included").

| Item | Kind | Why (READ, its source) |
|---|---|---|
| `status` | live | `role="status"` `aria-live="polite"`, empty from the first render |
| `alert` | live | its role follows the variant: alert for destructive, status otherwise |
| `spinner` | live | `role="status"` around an optional label |
| `error-summary` | live, focus | an inner alert; takes focus on insertion; each link focuses a control (`019`) |
| `message-log` | live, focus | `role="log"`; "Scroll to end" returns focus to the box |
| `marker` | live | announced as an added node of the log |
| `message` | focus | its header is a `tabindex="-1"` focus target |
| `code-block` | live | the copy button's `Status` says "Copied" or "Could not copy" |
| `composer` | live, focus | `Status` and `spinner`; focus returns to the textarea after send and stop |
| `code-editor` | focus | `focus()` moves into the editor; CodeMirror's own completion list |
| `sidebar` | overlay, focus | off-canvas as a `sheet` below 768 px; its inset is the skip link's `tabindex="-1"` target |
| `tooltip` | overlay | a portal, opened on hover and focus |
| `popover` | overlay | a portal; returns focus on close |
| `alert-dialog` | overlay | modal, on the scrim, starts on Cancel |
| `dialog` | overlay | modal, named by its title |
| `sheet` | overlay | modal panel on one edge |
| `dropdown-menu` | overlay | a portal menu, with sub-menus |
| `chart` | overlay | layerchart's pointer tooltip; the data are a table |
| `stage-card` | live | `Status` says the run's outcome |
| `live-console` | live | `Status` says the run's outcome |
| `marketing-bar` | overlay, focus | a `sheet` menu below `md`; a skip link |
| `sign-in` | live, focus | `error-summary` and `status` |
| `sign-up` | live, focus | a new step's heading takes focus; resend's status |
| `settings` | live, focus, overlay | an inline Saved status, `alert-dialog` to delete, the summary's focus |
| `page-states` | live | the loading state's `status` |
| `app-shell` | focus, overlay | the skip link to `main`; the sidebar's sheet; the user menu |
| `chat` | live, focus | the log, the composer, "latest reply" moves focus to a heading |
| `product-home` | live, overlay | `marketing-bar`'s sheet; `stage-card` and `live-console` statuses |

**Not included,** with the reason (INFERRED from the source):

- Roving focus inside one widget (`tabs`, `radio-group`, `toggle-group`, `accordion`, `input-otp`) is the keyboard walk's job (`keyboard.spec.ts`). Nothing is announced that the focused element does not itself say.
- `toggle-group` and `breadcrumb` matched the overlay search only through a comment (`breadcrumb-ellipsis.svelte:17`, added after the review).
- `input-group`'s focus move is a pointer convenience: a click on a non-interactive addon focuses the input (`input-group-addon.svelte:47–54`). A screen-reader user never makes that click. Its password toggle changes its own name, as the state-announcing controls below do (moved here after the review).
- `alert` qualifies, but its role comes from a map (`ROLE[variant]`, `alert.svelte:55–66`), not a literal `role="…"`. A derivation must also look for `"status"`, `"alert"` and `"log"` as values in a role map, or a new item built the same way escapes it (added after the review).
- `liquid-glass` is a surface, not a layer above other content.
- `proof-band` counts up with no live region; its final numbers are static text.
- `theme`, `toggle`, `collapsible`, `switch` and `checkbox` announce their own state on activation, through native or ARIA state. No live region, no focus move.

## 7. Risks the memo sees (INFERRED)

- **Every CI change needs a push, and only the owner pushes.** A workflow cannot be tried without one. The build must plan its pushes, and each should carry as much as it can.
- **guidepup under Bun's runtime on Windows is untried.** guidepup's CI runs under Node. If `bun --bun` fails with NVDA, the job runs Playwright under Node for that suite only.
- **Native modules on Windows and macOS.** The tree-sitter grammars are dev dependencies. Bun skips the lifecycle scripts of dependencies not listed in `trustedDependencies` (INFERRED, from Bun's known behaviour; not re-read today). The repository lists none (READ, `package.json`). The screen-reader jobs need no grammar at run time, since they serve a site built on Linux.
- **The perf budgets were set on this machine.** LCP under a 4× CPU slowdown on a 3- or 4-core shared runner will differ. Transfer sizes will not.
- **Speech timing.** `019`'s script waits 6 s after each step. Twenty-eight items at a few steps each is about 15 minutes per reader and browser, run serially. That fits the 6-hour job limit many times over.

## Sources

- npm registry, `@guidepup/guidepup`, `@guidepup/setup`, `@guidepup/playwright`, `@guidepup/virtual-screen-reader`, `@playwright/test`, read 2026-11-15: https://registry.npmjs.org/
- `@guidepup/setup` README: https://github.com/guidepup/setup (and its `.github/workflows/test.yml`)
- `@guidepup/playwright` README, workflows and examples: https://github.com/guidepup/guidepup-playwright (`.github/workflows/test-voiceover.yml`, `test-nvda.yml`, `examples/playwright-voiceover/webkit.config.ts`)
- `guidepup/setup-action` README ("no longer supported") and `action.yml`: https://github.com/guidepup/setup-action
- GitHub's API for guidepup-playwright's run jobs, runs 40227054817 and 40227054760, fetched 2026-11-15
- GitHub-hosted runners: https://docs.github.com/en/actions/reference/runners/github-hosted-runners
- Actions limits: https://docs.github.com/en/actions/reference/limits
- Actions billing: https://docs.github.com/en/billing/concepts/product-billing/github-actions
- Playwright sharding: https://playwright.dev/docs/test-sharding
- Playwright `grantPermissions` and `emulateMedia`: https://playwright.dev/docs/api/class-browsercontext, https://playwright.dev/docs/api/class-page
- Primer React: https://github.com/primer/react (`playwright.config.ts`, `.github/workflows/vrt.yml`, `ci.yml`)
- Spectrum Web Components: https://github.com/adobe/spectrum-web-components (`playwright.a11y.shared.config.ts`, `1st-gen/` file list)
- Clones under `context/prior_art/`, at the commits in its README: Carbon (`playwright.config.js`, `.github/workflows/ci.yml`, `packages/web-components/playwright.config.js`), `primer-primitives` (`playwright.config.ts`, `.github/workflows/visual_regression_test.yml`), GOV.UK Frontend (`.github/workflows/tests.yml`, `jest-puppeteer.config.js`, `docs/contributing/testing.md`)
- Action releases and commit SHAs, GitHub's API, 2026-11-15: `actions/checkout` v7.0.1 `3d3c42e5aac5ba805825da76410c181273ba90b1`; `actions/upload-artifact` v7.0.2 `cf430e030ddbb5b0abf93d22962f4752f3646cd9`; `actions/download-artifact` v8.0.2 `9000827ccba6bdab643e8b6fd33ac0654aef8333`; `actions/cache` v6.1.0 `55cc8345863c7cc4c66a329aec7e433d2d1c52a9`; `oven-sh/setup-bun` v2.2.0 `0c5077e51419868618aeaa5fe8019c62421857d6`
