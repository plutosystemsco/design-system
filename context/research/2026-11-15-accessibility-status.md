# The accessibility status: how others publish it, and what Kuiper has to build on

- **Status:** complete
- **Date:** 2026-11-15
- **Author:** the spec author for `030`, for the design lead
- **Question:** How do the reference systems publish a per-component accessibility status? What in Kuiper's tests, pages and harness can a generated status stand on? What does it cost each page?
- **What would answer it:** Carbon's, Primer's, GOV.UK's and Spectrum's clones, read; Atlassian's live page, fetched; Kuiper's page template, tests and built pages, read and measured; one probe of Playwright's listing.
- **What it blocks:** [`030`](../specifications/030-the-accessibility-status.md).

## How to read this memo

- **READ:** a file or page says so, read on 2026-11-15. Prior-art paths are relative to `prior_art/`, at the commits in `prior_art/README.md`.
- **EXECUTED:** run here on 2026-11-15, macOS, Bun 1.4.4, the repository's Playwright 1.64.1.
- **INFERRED:** our reasoning.
- Studied, never copied. GOV.UK's guidance text is Crown copyright; only its structure is described here. Kuiper names are post-`020` (`kuiper-theme`, `/changelog/0.13.0/upgrade/`) unless a file is quoted as it stands today.

## In short

1. **Only Carbon generates a status from tests,** and it grades whether tagged tests *exist*, not whether they *passed*. It solves the build-before-test ordering by shipping the report inside the npm package the site depends on.
2. **Primer shows a human review flag,** "Reviewed for accessibility" or "Not reviewed". Its known issues are for GitHub staff only.
3. **GOV.UK writes "Known issues and gaps" on component pages,** and keeps one site-wide accessibility statement with a compliance status and tracked concerns. Nothing is generated.
4. **Spectrum keeps a role, keyboard intents and WCAG criteria per component as data,** and a hand-written WCAG table. No test feeds it.
5. **Atlassian's Button page has an "Accessibility" section of guidance only.** No status, no tested-with list.
6. **Kuiper has no item or check tags today.** But Playwright's listing carries static tags and annotations without starting the server, so coverage can be checked before any run.
7. **The status and the cost figure add about 3 kB gzipped to a component page,** against at least 39 kB of headroom on every component template after `024`.

## 1. The references

### 1.1 Carbon

- **The page component** (READ, `carbon-design-system-carbon-website/src/components/A11yStatus/A11yStatus.js`):
  - It imports `@carbon/react/.playwright/INTERNAL_AVT_REPORT_DO_NOT_USE.json` (l. 18).
  - It finds a component's suite by a title match: the suite's title, lower-cased, must contain the component name with its first space removed (l. 81–86).
  - It grades three tags: `avt-default-state`, `avt-advanced-states`, `avt-keyboard-nav` (l. 127–140). A tag present gives "Tested". A tagged test that was skipped gives "Partially tested". No tag gives "Not tested", or "Not available" for keyboard (l. 147–162).
  - `checkAVTStatus` reads `spec.tags` and `test.status === 'skipped'`. It never reads a pass or a fail (l. 95–124). INFERRED: a failing test would still show "Tested". Carbon's CI presumably stops a release first, but the page does not say so.
  - Screen readers come from hand-kept data, `src/data/components.json`, field `testing.screenreader`: 59 "manual", 6 "notavailable", 1 "nottested" (EXECUTED, grep).
  - The labels' definitions (READ, `A11yStatusTag/A11yStatusTag.js`): "Tested", "Partially tested", "Manually tested", "Not available", "Not tested" ("Automated or manual testing has been temporarily deferred").
- **Where the report comes from** (READ, `carbon-design-system-carbon/playwright.config.js` l. 68–72; `packages/react/package.json` l. 16–25). Playwright's JSON reporter writes to `packages/react/.playwright/`, and that file is in the package's `files`. So it is published with `@carbon/react`. The site reads the report of the version it installs. The ordering problem never arises: the tests ran before the package was published.
- **Tagging** (EXECUTED, `find`): 92 `*.avt.e2e.js` files. Tags sit in titles: `test.describe('@avt Pagination')`, `test('@avt-default-state', …)` (READ, `e2e/components/Pagination/Pagination-test.avt.e2e.js`). The item is inferred from the suite title, not declared.

### 1.2 Primer

- **The status** is a review flag (READ, `primer-design/src/components/status.jsx` l. 86, 219–287; `status-rows.js` l. 10–55). The label is "Reviewed for accessibility", or "Not reviewed". It is read from `a11yReviewed` in each React component's docs JSON, or `a11y_reviewed` for view components. A person sets it.
- **The Accessibility tab's headings** (EXECUTED, a count over `content/components/**/*.mdx`): "Known accessibility issues (GitHub staff only)" 160 times; "Implementation requirements" 32; "Built-in accessibility features" 28; "How to test the component" 24; "Integration tests" and "Component tests" under it.
- INFERRED: the split between what the component does ("Built-in") and what the team must do ("Implementation requirements") is the clearest of the references. The known issues are not public.

### 1.3 GOV.UK

- **On component pages** (READ, `alphagov-govuk-design-system/src/components/`): 26 pages have a "Research on this component" section. Accordion has "Known issues and gaps" (`accordion/index.md` l. 138). Radios has "Known issues" (`radios/index.md` l. 104). They are prose: what is known, what is not, and a request for findings.
- **One site-wide statement** (READ, `src/accessibility-statement.md`). Its headings include "Compliance status", "Non-accessible content" and "Other identified and tracked accessibility concerns". Concerns are GitHub issues with an "accessibility concern" label. Two are listed for the Frontend codebase, each with a cause and a tracking issue.
- **The strategy** (READ, `src/accessibility/accessibility-strategy/index.md`, "Recording accessibility concerns", l. 284–296) says concerns specific to a component are also recorded on its guidance page.
- INFERRED: GOV.UK's model is honesty about what is not known, in words. It is the model for Kuiper's "not checked" line. It generates nothing.

### 1.4 Spectrum

- **Per-component accessibility data** (READ, `adobe-spectrum-design-data/packages/design-data/components/button.json` l. 239–248): `role`, `intents`, `focusable`, `keyboardIntents`, and `wcag`, a list of criteria with level and title.
- **A WCAG 2.2 table, written** (same file, l. 105): requirement, criterion, level and compliance, as one prose guideline block.
- No status from tests on its pages (READ, the scorecard row 3, Spectrum 2's marks).

### 1.5 Atlassian

- **Button's usage page** (EXECUTED, fetched `atlassian.design/components/button/usage`): an "Accessibility" section whose content is guidance ("Avoid disabling buttons"). No status, no testing record, no list of browsers or screen readers, no known issues. Navigation marks some items "Caution", "Beta" or "Deprecated", unrelated to accessibility.

### 1.6 What the references leave open (INFERRED)

- No reference ties a status to a **pass**. Carbon ties it to a test's existence; Primer to a person's review.
- No reference states **which engines and screen readers** a component's status covers.
- No reference shows an **open fault** on the component's page as part of a generated status. GOV.UK writes known issues by hand; Primer hides them.
- Kuiper's owner has ruled out a graded scale ("There is no 'partial' or 'not yet' state", the last version of `decisions.md`, at `beeb67e`). So Carbon's five labels are not available. The status can only say what passed, or why the page is not ready to be published.

## 2. Kuiper today

### 2.1 Tests

- **No test declares an item or a check** (EXECUTED, grep over `tests/e2e/`). The one runtime annotation is in `doors.spec.ts` l. 572. Items are implied by loops: `axe.spec.ts` walks `PAGES` and `VIEWS`; `keyboard.spec.ts` walks `FIXTURES`, 34 fixtures holding 74 stops (l. 296, 483–490).
- **`022` decision 13a** tags only the tests it writes or moves. "The rest is `030`'s work."
- **`022`'s merged `report.json`** holds, per test, its project, engine, scheme or reader, annotations, status, retries, duration and attempt (`022` decision 14). The artifact `matrix-report` is kept 14 days.
- **`022`'s ledger** (`tests/fault-ledger.ts`) marks a known failure `test.fail()`. A ledgered test that fails as its line says leaves the run green (`022` decision 16). The tag waits for an empty ledger (`022` Q3, answered option 1).
- **Playwright's listing carries static annotations and tags** (EXECUTED, a scratch config in the session scratchpad, not the repository). A test declared with `{ tag: ["@axe"], annotation: [{ type: "item", … }, { type: "check", … }] }` lists, per project, with both annotations and `tags: ["axe"]` (the `@` dropped). An annotation pushed at run time does not list. A `webServer` whose command would fail did not stop the listing: it is not started. This agrees with `022`'s memo §1.
- **axe-core is 4.14.0** (READ, `package.json`; `node_modules/axe-core/package.json`). `axe.spec.ts` runs the WCAG 2 A to 2.2 AA and best-practice tags (l. 15–22). Its `color-contrast` rule returns *incomplete* where it cannot find the background, such as text over glass (INFERRED, from axe's documented behaviour; the glass rows are measured instead in `tests/unit/contrast.test.ts`).
- **Contrast pairs are theme-wide,** not per item: 129 rows recomputed from the token file (READ, `tests/unit/contrast.test.ts`; scorecard §3).

### 2.2 The page

- **The template** (READ, `src/lib/site/page/component.svelte`). The header holds the title, the description and the facts row (`facts.svelte`: Since, Updated, Modes, Based on). The Accessibility section renders the page's `accessibility` snippet as one list, then a fixed paragraph: "Every page here is checked in Chromium by axe, in both themes. … Firefox, Safari and screen readers are not checked yet." (l. 213–218). After `022` that paragraph under-claims.
- **The error-summary page** says "Heard with VoiceOver on macOS. NVDA and JAWS are not tested." (READ, `src/routes/(site)/components/error-summary/+page.svelte` l. 63). `tests/unit/registry.test.ts` l. 1893–1917 pins it; `022` decision 13 relaxes the second test at its landing to `/JAWS (is|are) not tested/`, and leaves the page to `030`.
- **The bullets mix two kinds.** Button's list says what the item does ("pressed by Enter or Space") and what an app must do ("Give it `aria-hidden="true"`") in one list (READ, `components/button/+page.svelte`). `026` and `027` already write their bullets as "Provides" and "Your part, each a must", for `030` and `032` to place.
- **The facts row has one link,** to the changelog. `tests/e2e/site.spec.ts` l. 507–519 reads `[data-slot="facts"] dd a` as a single element. A second link in the facts row would break that test (INFERRED: Playwright's strict mode).
- **The scorecard's scripts read the twin.** `scripts/bench/pluto.ts` marks the status present when a twin contains "Accessibility status" (l. 182–186). `scripts/bench/depth.ts`'s "evidence" element matches `/\b(are|is) not (yet )?(checked|tested|supported)\b/` (l. 105–113). Row 13 (d), the support statement, is ✓ today because each page states what is and is not checked (READ, scorecard row 13).

### 2.3 The cost figures

`025` writes `scripts/cost/report.json` and exports `readCost(name)` and `costFacts(entry)`, which return a size ("39.4 kB"), an optional "+ 133 kB on demand", a time ("opens in 96 ms", "hydrates in 36 ms") and the conditions for a note (READ, `025` decision 14). `030` reads it from `component-data.server.ts`.

### 2.4 Where the site is published

Cloudflare Workers Builds sets `CI=true`, `WORKERS_CI=1`, `WORKERS_CI_COMMIT_SHA` and `WORKERS_CI_BRANCH` during a build. The production branch is set in the dashboard and defaults to `main`. Other branches build previews only if previews are enabled (READ, `developers.cloudflare.com/workers/ci-cd/builds/configuration/`, 2026-11-15). INFERRED: a site build can tell that it is about to be published, and refuse.

## 3. What it costs a page

Measured on the built site in `build/` (2026-11-15 16:10, the tree at `f9e1c1a`), by a scratch script in the session scratchpad that edits a copy of the HTML (EXECUTED):

- **Markup.** Into Button's and Sidebar's pages: the status line; a four-row checks table with its caption and two lines below it; the three sub-headings; a "Cost" term on the facts row; a two-sentence cost note under Install; and the same strings again as a page-data payload (SvelteKit serialises load data into the page). The hand paragraph is removed. Gzip level 9 over the whole file: **+1,354 bytes** on Button (25,782 → 27,136) and **+1,364** on Sidebar (41,189 → 42,553).
- **Script.** Two mock components, a status line and a checks table with a fault list, compiled by the repository's Svelte 5.57.3 and minified by `Bun.build` with Svelte external: **1,133 + 311 = 1,444 bytes** gzipped, each file alone. Inside the shared page chunk it compresses a little better (INFERRED).
- **So about 2.8 kB a page,** on every component page. A page with faults adds about 100 to 300 bytes per fault (INFERRED); faults never reach a release.

Against `024`'s budgets (READ, `024` decision 9; INFERRED ranges until its sweep):

| Template | Its heaviest page | Budget (+10%) | Headroom of the heaviest page | Button's headroom |
|---|---|---|---|---|
| `component` | `sidebar`, 391 to 435 kB | 430 to 480 kB | **39 to 45 kB** | 50 to 100 kB |
| `component-heavy` | the theme item, 573 to 617 | 635 to 680 | 57 to 63 | |
| `component-live` | `code-editor`, 617 to 661 | 680 to 730 | 63 to 69 | |

INFERRED: the binding figure is not Button's headroom but that of each template's heaviest page, about a tenth of its median. About 3 kB fits all three with more than 35 kB to spare.

## 4. What this suggests for `030` (INFERRED)

- **Declare the item and the check on the test, statically,** so the listing can prove coverage before a run, and the report never matches by title, as Carbon must.
- **Grade by pass, not by presence.** Count a configuration only when a test for it passed.
- **Solve the ordering as Carbon does, by carrying a finished run's report in the source,** but check that it still describes the code: an input hash per item, as `025` does for cost, and at the tag a run of the tagged tree itself.
- **Show an open fault on the page while it is open,** in words, with its fix's number (GOV.UK's honesty, generated). Refuse to publish while one stands.
- **Split "What Kuiper provides" from "Your part",** as Primer does, and say what is not checked, as GOV.UK does.
- **Keep the strings the scorecard reads:** "Accessibility status", and an "is not tested" or "are not checked" line on every page.

No code was copied from prior art. Nothing in the repository was changed but this memo and `030`'s specification.

## 5. Correction, 2026-11-15, after the specification review

The review of `030` ([`../reviews/030-the-accessibility-status-spec-2026-11-15.md`](../reviews/030-the-accessibility-status-spec-2026-11-15.md)) ran its own probes in the session scratchpad (`030-review/`). Its findings correct or extend this memo in these places. The sections above stand as written; where they differ, this section governs.

- **The listing sees declarations, not run-time skips** (corrects §2.1's reading, EXECUTED by the review).
  - A `describe`'s tag and annotations are inherited by its tests.
  - A config-level `tag` is prepended to every test.
  - A run-time `test.skip(true, …)` lists as `expectedStatus: "passed"`, with no annotation. Only a declared `test.skip(title, …)` or `test.fixme` lists as skipped. So `022`'s `onlyIn` and `028`'s `notIn`, which skip at run time, are invisible to the listing.
  - Neither `webServer` nor `globalSetup` ran, which confirms §2.1.
- **The screen-reader config lists browsers, not reader pairs** (READ, the review; `022` l. 502). `playwright.sr.config.ts` has the projects `webkit`, `chromium` and `firefox`. `matrix.yml` picks two per reader, so `voiceover-webkit` and `nvda-firefox` appear only in the workflow file.
- **`022` does not say whether its `item`, `rules` and `hears` annotations are static** (READ, `022` decision 12). That is unconfirmed until `022` is built.
- **Carbon shows a skip** (extends §1.1, READ, `A11yStatus.js` l. 107–117 and 140–155). A tagged test that was skipped gives "Partially tested". So the one reference that generates a status never lets a skip pass silently. §1.6's "no reference ties a status to a pass" still holds.
- **axe's `color-contrast` judges text only** (extends §2.1, INFERRED from axe's rule scope, confirmed by the review). It covers SC 1.4.3. Non-text contrast, SC 1.4.11 (borders, rings, tracks, fills), is measured only where a test measures it, as `primitives.spec.ts`'s 3:1 rows do. `inapplicable` means no text was judged, not that contrast passed.
- **`028`, as drafted, derives the interactive set and splits the engines** (READ, `028` decisions 1, 13 and 15).
  - It counts 52 interactive items at its landing, inheriting through `registryDependencies`.
  - It checks 54 items, adding `meter` and `progress`.
  - Its draw test runs in `chromium-light`, `chromium-dark` and `firefox-light`. Its compute test also runs in `webkit-light`, and WebKit's drawing is skipped through `notIn`, because no Safari platform has a forced-colours mode.
- **Keyboard fixtures cover 34 items** (EXECUTED, the `FIXTURES` table in `tests/e2e/keyboard.spec.ts`, l. 296–470).
  - The 34 items are `accordion`, `alert-dialog`, `breadcrumb`, `button`, `chart`, `checkbox`, `code-block`, `code-editor`, `code-languages`, `collapsible`, `composer`, `dialog`, `dropdown-menu`, `error-summary`, `field`, `input-group`, `input-otp`, `input`, `item`, `message-log`, `native-select`, `pluto-theme` (its ink surface), `popover`, `radio-group`, `sheet`, `sidebar`, `status`, `switch`, `tabs`, `textarea`, `theme`, `toggle-group`, `toggle` and `tooltip`.
  - The blocks' views are walked separately (`VIEW_STOPS`).
  - Against `028`'s 52, the gap is new test-writing. It is likely 5 to 12 items once the views and `026`'s and `027`'s own tests are counted (INFERRED).
- **The view routes and the lockfile decide what was tested** (READ, the review; EXECUTED there, `wc`).
  - 1,038 lines of view routes sit under `src/routes/(view)/view/` and `src/routes/(shell)/view/`. For example, `sign-in/errors/+page.svelte` sets the errors the view renders.
  - A `bun.lock` bump changes a primitive's behaviour without changing any served JSON.
  - So an item's input hash needs both.
- **The byte cost, re-measured** (EXECUTED by the review, on Button, Sidebar and Dialog at `f9e1c1a`).
  - The markup adds +1,111 to +1,268 bytes gzipped at level 6, and +1,117 to +1,249 at level 9. With §3's 1,444 bytes of script, that is about 2.6 to 2.7 kB a page. §3's 2.8 kB stands as the upper figure.
  - The perf server gzips at `Bun.gzipSync`'s default level, not 9 (`perf.spec.ts:58`). The difference is a few bytes.
- **The bullets** (EXECUTED by the review). 285 bullets on 75 pages, which confirms the specification's count.
  - 5 open with a verb from the draft's list, and 15 more have a later sentence that does.
  - A wider pattern matches 44 bullets that carry an app's duty. It adds "needs", "must", "should", "your", "an app", "the app", "you" and the imperatives "Check", "Hide", "Move" and "Pair".
  - Most are not imperatives, such as "An icon-only button needs an `aria-label`".
- **Workers Builds' variables can be overridden** (extends §2.4, READ, Cloudflare's "Default variables", 2026-11-15). The variables are injected "but can be overridden" in the dashboard. So a build-time refusal is a guard, and the release check is the gate.
- **GOV.UK's site statement names its assistive technologies and an audit** (extends §1.3, READ, the review; `accessibility-statement.md` l. 17 and 59–98). It names JAWS, NVDA, TalkBack and VoiceOver as targets, and cites a third-party audit. Its browser grades A to C and X are kept apart from components (`govuk-frontend/docs/contributing/browser-support.md`).

## 6. Correction, 2026-11-15, after the re-review

The re-review's reads (same review file, "Re-review, 2026-11-15") add these facts. Where they differ from what is above, they govern.

- **A bare skip already sits in a tagged file** (EXECUTED by the re-review, grep). `tests/e2e/forced-colors.spec.ts:11` holds `test.skip(info.project.name !== "light", "light project only")` in a `beforeEach`. That is `018`'s skip, kept by `022` decision 2.
  - Neither `onlyIn` nor `notIn` can express it, because each takes one engine.
  - The same holds for `028`'s project lists, which skip one engine's dark project alone.
  - So a declared helper that takes projects is needed.
- **`028` decision 13a now creates `tests/status/interactive.ts`** (READ, the re-review). It exports:
  - `interactiveItems`, 52 items;
  - `FORCED_CHECKED`, 54 items;
  - `FORCED_PROJECTS`, whose `draw` list is `chromium-light`, `chromium-dark` and `firefox-light`, and whose `compute` list adds `webkit-light`;
  - `FORCED_WEBKIT_GAP`, marked `gap: "no-user"`.

  §5's "if `028` keeps the derivation inside its test" no longer applies.
- **The three route-group layouts wrap every view the tests open** (READ, the re-review). These are `(view)`, `(shell)` and `(example)` `+layout.svelte`, at 19, 15 and 16 lines.
- **A merged screen-reader record names a browser, not a reader,** unless the config adds one (INFERRED by the re-review). This follows from `playwright.sr.config.ts`'s projects and the review's probe of config-level tags. A config-level `tag` set from the job's reader reaches every test, and travels in its `tags`.
- **`bun.lock` holds transitive packages** under the ones an item names, such as `@floating-ui` under `bits-ui`. An item's evidence depends on their versions too (INFERRED by the re-review).
- **axe reports a node inside an iframe as an array target, frame first** (READ by the re-review, axe's result format). Region classification must start from the outermost frame element.
