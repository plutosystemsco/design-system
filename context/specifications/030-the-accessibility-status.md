# 030 — The accessibility status

- **Status:** Ready to build after `022`, `024`, `025` and `028`: owner answers recorded, re-review approved, all applied. The owner answered Q1 to Q5 on 2026-11-15, each with the recommended option (see Landing notes). The specification review, [`../reviews/030-the-accessibility-status-spec-2026-11-15.md`](../reviews/030-the-accessibility-status-spec-2026-11-15.md), approved with changes: 1 High, 8 Medium, 4 Low. Its re-review closed those findings and raised R1 to R9 (3 Medium, 6 Low). Every finding is answered under "Review".
- **Date:** 2026-11-15
- **Author:** the spec author for `030`, for the design lead
- **Kind:** a feature in lane S (site chrome), with new files under `scripts/status/`. It also:
  - tags existing browser tests;
  - sorts every component page's accessibility bullets;
  - writes the keyboard fixtures that interactive items lack (decision 3);
  - adds a pre-build step to `package.json`'s `build`, one line to `scripts/site/release-check.ts`, and one optional field to `022`'s ledger type.

  **Interface changes:** none for an installed app. No registry item, token, `static/r/` file or dependency changes.
- **Written against the names `020` leaves:** `kuiper-theme`, the `kuiper` registry, `/changelog/0.13.0/upgrade/`, `scripts/bench/kuiper.ts`. A file quoted as it stands today says `pluto`.
- **Depends on:**
  - [`022`](./022-the-test-matrix.md):
    - the seven projects;
    - the screen-reader suite and its `item`, `rules` and `hears` annotations;
    - `matrix.yml`'s reader-by-browser pairs;
    - the merged `report.json` (decision 14);
    - the fault ledger (decision 16);
    - `ENGINE_ONLY` (decision 3);
    - the run qualification (decision 19);
    - decision 13a, which leaves the tagging of the other tests to this specification.
  - [`024`](./024-budgets-per-template.md): the per-template transfer budgets, and its rule that a specification adding weight to every page of a template states its cost in kB per page (decision 4).
  - [`025`](./025-component-cost.md): `scripts/cost/report.json`, `readCost()`, `costFacts()` and its conditions note (decision 14).
  - [`028`](./028-forced-colours.md), as drafted on 2026-11-15 and under revision:
    - its interactive derivation and its 54 checked items (decisions 1 and 13);
    - its `EXCLUDED` list;
    - its tests' `item` and `check` annotations;
    - its engine split: drawn in Chromium and Firefox, computed in WebKit, through `notIn` (decision 15).

    Where `028` changes in revision, its final text governs. Decision 3 says what this specification imports from it.
  - It lands after `026`, `027a` and `027b`, whose pages carry "Provides" and "Your part" bullets written for it.
- **Research it stands on:** [`../research/2026-11-15-accessibility-status.md`](../research/2026-11-15-accessibility-status.md), cited as *status* §n, including its dated correction, §5. Also:
  - [the page standard](../research/2026-11-15-component-page-standard.md), section 0 ("the accessibility status line") and section 8;
  - [the benchmark scorecard](../research/benchmark-scorecard.md), rows 3 and 15.
- **Ranked by:** [`../roadmap.md`](../roadmap.md) §2, 0.13.0, row `030`: "Tests tagged by item and check; a committed report of the last full run; the status line and 'What Kuiper provides' on each page; `025`'s cost on the facts line." It is in wave 2, lane S. §3 says "`024` before `030`".
- **The owner's rulings it carries** (the last version of `decisions.md`, at `beeb67e`):
  - "Yes to accessibility status, but everything should be accessible." Each component page shows what was checked, generated from the test run: automated checks in both schemes, keyboard, contrast, forced colours, and the screen-reader notes. "It is evidence, not a grade. There is no 'partial' or 'not yet' state. A component that fails a check fails the build; it is never published with a failing status." This reverses `015` decision 10.
  - "The accessibility status is its own specification after the tag, first in 0.13.0 … It must solve the ordering: the site builds before the browser tests run."
  - From `022`'s answers:
    - no tag while the ledger holds an open fault (Q3);
    - pages say JAWS is not tested (Q6);
    - a flaky browser test fails the run;
    - a screen-reader flake on a release run gets a ledger line, unless the design lead records it as reader timing, with the phrases that show it (Q2).

## Terms

- **A check:** one kind of accessibility evidence: automated rules, text contrast, keyboard, forced colours, or screen readers (decision 1).
- **A configuration:** where a check runs.
  - For a browser check, it is one of `022`'s six browser projects, such as `webkit-dark`.
  - For screen readers, it is one reader with one browser, such as `nvda-firefox`.
- **A cell:** one item, one check and one configuration. The status grades cells.
- **The example region:**
  - on a component page, the example stages, `[data-slot="frame-stage"]`;
  - on a view, `/view/<path>/` or `/example/<item>/<example>/`, the whole document.

  An item is judged by what happens there. Everything else on a page is the site's (decision 4).
- **The full run:** one `matrix` run on GitHub Actions whose `gate` passed (`022` decision 19).
- **The status report:** `scripts/status/status.json`, the committed record of one full run, by item, check and configuration (decision 6).
- **An open fault:** a line in `tests/fault-ledger.ts`. Its test fails as the line says, and the run stays green (`022` decision 16).
- **A declared gap:** a configuration where a check cannot mean anything for any user. The one known today is that no Safari platform has a forced-colours mode (`028` decision 15). A declared gap is shown on the page, by name, with its reason (decision 5).
- **Publishing:** a Cloudflare Workers build of the site. It deploys the site and the registry under `static/r/` (`015` decision 21).

## Intent

Each component page should say what was checked, where, and that it passed. Today a person writes that.

- The Accessibility section ends in one fixed paragraph, the same on every page: "checked in Chromium by axe … Firefox, Safari and screen readers are not checked yet."
- After `022`, that paragraph is wrong.
- The error-summary page claims a VoiceOver listen in a sentence that a unit test has to guard.

This specification generates the claim from the evidence:

- every accessibility test declares its item and its check;
- every skip a tagged test can take is declared as data;
- a script turns one full run's report into a committed file;
- each component page reads that file, and shows a status line under its facts and a table of checks in its Accessibility section;
- every configuration a check did not reach is named on the page, with its reason;
- the bullets under the table are split into "What Kuiper provides" and "Your part";
- the facts row gains `025`'s cost figure.

The build-before-test ordering is solved by committing the finished run's record, much as Carbon carries its report inside its published package (*status* §1.1). A hash per item tells a page whether the record still describes its code. At the tag, the record must be of the tagged tree itself.

A page never shows "partial" or "not yet". While a fault is open, a build that is not published says so in plain words, and a build that would publish refuses to start.

## What the research found

- **Only Carbon generates a status from tests** (*status* §1.1).
  - It grades whether tagged tests exist, not whether they passed.
  - It shows "Partially tested" when a tagged test was skipped, so a skip is never silent.
  - It matches a component by a substring of a suite's title.
  - Kuiper declares both the item and the check on the test, grades a pass, and names every skip.
- **Primer's status is a person's review flag, and its known issues are for GitHub staff only** (§1.2). Its split of "Built-in accessibility features" from "Implementation requirements" is the model for "What Kuiper provides" and "Your part".
- **GOV.UK writes known issues and gaps by hand, and keeps one site-wide statement** (§1.3). Its honesty about what is not known is the model for the "not checked" lines.
- **Spectrum keeps a role, keyboard intents and WCAG criteria as data. Atlassian shows no status** (§1.4, §1.5).
- **The listing shows what is declared, and only that** (§2.1 and §5, EXECUTED).
  - Playwright's listing carries static tags and annotations per project, and starts no server.
  - A `describe`'s tag is inherited by its tests.
  - A run-time `test.skip(true, …)` lists as an expected pass.
  - The screen-reader config lists browsers, not reader pairs. The pairs are in `matrix.yml`.
- **axe's `color-contrast` judges text contrast, SC 1.4.3, only** (§5). Non-text contrast, SC 1.4.11, is measured only where a test measures it.
- **`028` derives 52 interactive items. 34 items have a keyboard fixture today** (§5, EXECUTED).
- **The facts row has one link, and a test depends on that** (§2.2). So the cost figure goes in as text.
- **The scorecard reads two strings** (§2.2), and both must survive:
  - "Accessibility status" in a twin;
  - an "is not tested" or "are not checked" line.
- **About 2.6 to 2.8 kB gzipped per component page** (EXECUTED, §3 and §5), against at least 39 kB of headroom on every component template.

## Decisions

### 1. Five checks, named once

`tests/status/checks.ts` exports `CHECKS`, in the order a page shows them:

| Id | Shown as | What counts | Configurations |
|---|---|---|---|
| `axe` | Automated rules | axe-core 4.14.0 at `axe.spec.ts`'s tags (WCAG 2 A to 2.2 AA, and best practice), judged in the example region (decision 4) | the six browser projects |
| `contrast` | Text contrast | axe's `color-contrast` result in the example region of those scans, and each `contrast` test that measures a node axe left undecided (decision 4) | the six browser projects |
| `keyboard` | Keyboard | the item's keyboard fixture walk and its behaviour tests | the six browser projects |
| `forced-colors` | Forced colours | `028`'s two tests per item: "focus, state and edges are drawn" and "its rules compute" | as `028` exports them (decision 3) |
| `screen-reader` | Screen readers | the item's `tests/sr/<item>.sr.ts`: scripted rules on given examples and views | the four pairs in `matrix.yml`: VoiceOver with WebKit and Chromium; NVDA with Chromium and Firefox |

Reasons:

- These are the five the owner named.
- 24 px targets are inside axe's WCAG 2.2 AA tags (`target-size`), so they need no check of their own.
- The theme's 129 contrast pairs are measured once, for the whole theme, in `tests/unit/contrast.test.ts`. They are no single item's evidence. The `kuiper-theme` page links them.
- **"Text contrast", not "contrast".** axe decides SC 1.4.3 only. Non-text contrast (SC 1.4.11: borders, focus rings, a switch's track, a meter's fill) is not this check. Where an item has no measurement of it, its page says so (decision 9). That is a finding for the roadmap, not a limit (decision 16).

A sixth check is a decision of the specification that adds it. `035` (states in axe) adds none, because its tests are `axe` tests of more states.

### 2. The tag scheme: each test declares its items and its check, statically

`tests/status/about.ts` exports one helper:

```ts
about(items: Item | "site" | (Item | "site")[], check: CheckId): TestDetails
// → { tag: ["@<check>"], annotation: [{ type: "item", description: "<item>" }, …, { type: "check", description: "<check>" }] }
```

A tagged test passes the helper's result as its details: `test(title, about("button", "keyboard"), async ({ page }) => …)`. The rules:

- **Static, never pushed at run time.** Only a static annotation reaches the listing (*status* §2.1), and the coverage proof (decision 3) reads the listing.
- **Exactly one check tag per test.** A `describe` carries no check tag and no `item` or `check` annotation. Tags are inherited (*status* §5), so a check tag on a `describe` would give its tests two. The tag and the `check` annotation come from one call, so they never disagree. The tag lets `--grep @keyboard` run one check alone.
- **One or more items.**
  - An item is a registry name.
  - A test of a block's view names the block.
  - A test that exercises an item inside another names the one it judges, as `022`'s screen-reader tests do.
- **`site`** marks accessibility evidence about the site's own chrome: the home page, a landing, the bar, the nav. It counts toward no item. No registry item may be named `site`; a unit test holds that.
- **Loops tag per iteration.**
  - `axe.spec.ts`'s page loop names the item for each `/components/<name>/` page, and `site` for every other page.
  - Its view loop names each view's block or composition, from `BLOCK_VIEWS` and `COMPOSITION_VIEWS`.
  - `keyboard.spec.ts` names each fixture's item.
- **The screen-reader suite is not edited.**
  - Its tests carry `022`'s `item`, `rules` and `hears`.
  - The check is `screen-reader` by suite: the status reads every test from `playwright.sr.config.ts` as that check.
  - A test counts toward its `item` only, never its `hears`. `hears` serves `022`'s mutation derivation.
  - Build step 1 confirms that `022`'s three annotations are static, through the listing. If they are not, a lane-E change to `tests/sr/` that makes them static is a dependency of this build.
- **`028`'s tests use `about()`.** `028` decision 13 already gives each test `item` and `check`. They must be static, through this helper or the same shape.

**The files tagged** are all in `tests/e2e/`:

- `axe.spec.ts`;
- `keyboard.spec.ts`;
- `forced-colors.spec.ts` (its site tests take `site`);
- `error-summary.spec.ts`;
- the contrast and target tests in `primitives.spec.ts` ("invalid borders", the 3:1 rows);
- `026`'s and `027`'s accessibility tests;
- `028`'s `tests/e2e/forced/items.spec.ts`.

A test outside these that is accessibility evidence may be tagged too. Nothing requires it.

### 3. Which checks each item requires, and what the listing can prove before a run

**One interactive set, shared with `028`.**

- `028` decision 13 derives the interactive items from source, counting an item as interactive if one of its `registryDependencies` is. It finds 52 at its landing.
- `028` decision 13a creates `tests/status/interactive.ts`. It exports:
  - `interactiveItems`, the 52;
  - `FORCED_CHECKED`, the 54;
  - `FORCED_PROJECTS`, `{ draw, compute }`;
  - `FORCED_WEBKIT_GAP`, marked `gap: "no-user"`.
- This specification imports those exports and writes no derivation of its own.

`scripts/status/required.ts` exports `required(item): { check, configs }[]`:

- **`axe` and `contrast`:** every registry item. Every item has a page.
- **`keyboard`:** every item in `028`'s interactive set. There is no `KEYBOARD_EXCLUDED`.
  - An item in the set is operable by definition, and constitution §4.4 says every interactive item works by keyboard, proven.
  - An item that is not operable is not in the set, so it needs no exclusion.
- **`forced-colors`:** `028`'s `FORCED_CHECKED`, 54 items.
  - Its required cells are `FORCED_PROJECTS.draw` for the draw test (today `chromium-light`, `chromium-dark` and `firefox-light`) and `FORCED_PROJECTS.compute` for the compute test (today those three and `webkit-light`).
  - Its `EXCLUDED` items get a not-checked line (decision 9).
  - This replaces the first draft's fallback, which disagreed with `028`.
- **`screen-reader`:** `022`'s `SR_ITEMS`, imported from `tests/sr/items.ts`. Its configurations are the reader-by-browser pairs that `scripts/ci/workflow.ts` reads from `matrix.yml`, so they follow the workflow file, as `022`'s release check does.

**The keyboard gap is closed in this specification.**

- Today 34 items have a keyboard fixture in `keyboard.spec.ts` (*status* §5, EXECUTED). The seven blocks are walked through their views' stops (`VIEW_STOPS`). `026`'s and `027`'s seven items bring their own keyboard tests.
- That leaves roughly 5 to 12 of the 52 with no keyboard test (INFERRED; the exact list comes from the shared derivation at build step 1).
- Each gets a fixture, or a behaviour test, tagged `keyboard`. The landing notes list them and count the fixtures written.
- An item for which no meaningful keyboard test can be written is not excluded. Its cells stay empty, coverage fails, and the design lead rules whether it belongs in the interactive set at all. That ruling is recorded in `028`'s derivation as a change to the rule, never as a per-item exception.

**What the listing proves.** `tests/unit/status-coverage.test.ts` runs `bun --bun playwright test --list --reporter=json` for both configs. That lists every test, per project, with its static annotations and tags, and starts no server (*status* §2.1, §5). It requires:

- every test that carries a check tag has exactly one check tag, exactly one `check` annotation equal to it, and at least one `item` that is a registry name or `site`;
- no `item` or `check` annotation appears without the other, and none sits on a `describe`;
- after subtracting the static skip declarations below, every required cell has at least one listed test that is expected to run there.
  - Browser cells are the listing's projects.
  - Screen-reader cells cross the listing's browser projects with `matrix.yml`'s reader pairs.

**Every skip is declared as data.** The listing cannot see a run-time skip (*status* §5). So:

- **Three declared helpers, in `tests/e2e/engines.ts`.** In a tagged test, every run-time skip goes through one of them:
  - `onlyIn(engine, reason)`, from `022`;
  - `notIn(engine, reason)`, from `028`;
  - **`onlyProjects(projects, reason)`,** new here. It skips in every project not named. It covers a skip that no engine argument can express: one scheme, or one engine's dark project alone.
- **Each call is listed as data in `ENGINE_ONLY`.** An entry holds file, title, reason, and either `engine` (for `onlyIn` and `notIn`) or `projects` (for `onlyProjects`).
- **`ENGINE_ONLY` lives in its own file, `tests/e2e/engine-only.ts`.** That file imports nothing but types, and `engines.ts` imports it. So decision 6 can copy it alone at a run's commit (review R7). `022` and `028` use the same file.
- **A unit test reads every tagged file's source.** It fails on any other `test.skip(`, `testInfo.skip(` or `test.fixme(` call inside a tagged test, or in a `beforeEach` of a tagged file.
- **Where the uses are:**
  - `028`'s `items.spec.ts` calls `onlyProjects(FORCED_PROJECTS.draw, …)` for its draw tests and `onlyProjects(FORCED_PROJECTS.compute, …)` for its compute tests.
  - `forced-colors.spec.ts`'s "light project only" skip (today `test.skip(info.project.name !== "light", …)` in a `beforeEach`, l. 11; `018`'s, kept by `022` decision 2) becomes `onlyProjects(["chromium-light", "firefox-light", "webkit-light"], "light schemes only")`. `022` is settling it in exactly these words, and is adding the reader tag and static screen-reader annotations (decisions 2 and 5).
  - `022`'s and `028`'s authors adopt the helper in their own specifications. This specification accepts it in its source check.
- **The coverage test subtracts every entry,** by engine or by projects, before it judges a cell. A `no-user` mark (decision 5) is kept only where the skipped project is a required cell. Today that is one place: `028`'s draw test in `webkit-light`, through `FORCED_WEBKIT_GAP`. The projects outside `FORCED_PROJECTS` are not required cells, so skipping there leaves no hole and needs no gap.

**What it cannot prove, stated.** The listing proves that declared tests exist for every cell. It cannot prove that a test does not end early, or that an undeclared skip slipped past the source check. Those show at grading, from the run itself, as a fault (decision 5). So a coverage hole in what is declared fails `bun run test:unit` before any run. Anything else fails the status, never the page's words.

**Build step 1 also confirms** that listing `playwright.sr.config.ts`, which is wrapped in `withGuidepup`, works in `022`'s `checks` job on `ubuntu-24.04`. If it does not, the screen-reader half of the coverage test reads `tests/sr/items.ts` and the test files' static annotations instead, and the landing notes say so.

### 4. The axe scan is judged in the example region, and text contrast is read from it

`expectNoViolations` in `axe.spec.ts` gains one step before its assertion. It classifies each node in axe's results by whether it lies in the example region (see Terms). It does this in the page, with `closest('[data-slot="frame-stage"]')` on each node's target.
- A node inside an iframe has a target that is an array, frame first. It is classified by its outermost frame element's `closest(…)` (review R9).
- On a view, every node is in the region.

Then it pushes two run-time annotations:

- **`axe-region`:** `none`, or the ids of the rules violated inside the region;
- **`axe-contrast`:** for the `color-contrast` rule, over the region only:
  - `pass`: at least one node passed, none violated, none undecided;
  - `none`: the region has no text node the rule applies to;
  - `incomplete:<selectors>`: the nodes axe could not decide, as JSON;
  - `violation`.

Both are pushed before the assertion, so a failing scan still records them. Run-time annotations are correct here: they are results, read from the run's report, not declarations the listing must see.

**Who a scan's result belongs to:**

- The item's `axe` cell reads `axe-region`. A scan whose region is `none` is a pass for the item, even when the test failed for a violation outside the region.
- That failure is then the site's. An unledgered one makes the run red. A ledgered one names `scope: "site"` (decision 11) and counts toward `site`.
- So a fault in the bar or the nav is never charged to Button.

**A `contrast` cell:**

- **Passes** when, in that configuration, every `axe` test about the item reports `pass`, or reports `incomplete` and every undecided selector is measured by a passing `contrast` test of that item, in that configuration, that names the same selector in a static `measures` annotation (`{ type: "measures", description: "<selector>" }`).
- **Is a declared gap when it is `none`.** The item has no text to judge there. If it is `none` in every cell, the whole check is *not applicable* (decision 5). The page then shows only the not-checked line "Text contrast is not checked on {title}: its examples hold no text." (decision 9). The check is neither counted nor failed, so a text-free item such as `separator`, `skeleton`, `spinner` or `liquid-glass` can pass.
- **Fails on an `incomplete` that no test answers:** "axe could not decide the contrast of {selectors}, and no test of {item} measures them." The fix is a measured `contrast` test of those nodes, such as the glass rows `contrast.test.ts` computes, driven in the browser.

### 5. How a cell is graded, and how a skip shows

From the run's `report.json`, every test is one record per configuration and retry (`022` decision 14).

**How a record names its configuration:**
- A browser record's configuration is its `projectName`, such as `webkit-dark`.
- A screen-reader record's configuration is its reader plus its `projectName`, such as `voiceover-webkit`. The screen-reader config's projects are browsers only.
- The reader is read from a **config-level tag**, `reader-voiceover` or `reader-nvda`. `playwright.sr.config.ts` sets it from the job's reader (`SR_READER`, which each job sets), and Playwright adds it to every test's `tags`, so it travels through the blobs into the merged record (*status* §5).
- If `022`'s built config records the reader another way, decision 5 reads that field. Build step 1 confirms which, in a real `report.json`.
- Setting the tag is one line in a lane-E file. It is named as a dependency on `022`, not edited here.

For each cell:

| The cell's tests | Result |
|---|---|
| every test declared for this cell ran, and at least one passed on its first try | **pass** |
| one failed as an open fault says (`test.fail()` from the ledger), and its ledger line is not `scope: "site"` | **fault**, with the ledger line's `finding` and `change` |
| a browser test passed only on a retry | cannot occur: `failOnFlakyTests` fails the run (`022` decision 18) |
| a screen-reader test passed only on a retry, with no ledger line | **pass**, marked retried. It is shown "passed on retry", and it blocks the tag unless a machine-read reader-timing record covers it (decision 15) |
| some of its tests were skipped by an `ENGINE_ONLY` entry marked `gap: "no-user"` | **pass for what ran**, and the skipped part is a **declared gap**: a not-checked line from the entry's data |
| some of its tests were skipped by any other `ENGINE_ONLY` entry, or by an undeclared skip | **fault**: "{check} on {item}: {test} did not run in {configuration}: {reason}" |
| every test skipped by a `no-user` gap | **declared gap**, not a pass. The cell is shown only as its not-checked line |
| no test at all | cannot occur for a declared cell: decision 3 fails the unit tests first |

**Declared gaps.** An `ENGINE_ONLY` entry gains three optional fields, set together:
- `gap: "no-user"`;
- a `shown` sentence;
- `ruling`, the path of the specification decision or landing note that rules it.

`tests/unit/fault-ledger.test.ts` holds the **closed list of permitted gaps**, by file, title and projects. Today the list holds one entry, `FORCED_WEBKIT_GAP`, ruled by `028` decision 15. An entry with `gap` that is not on the list fails, and so does one whose `ruling` path does not exist. So adding a gap changes a test, and review sees it (review R5). Its meaning: no user can meet this case in that engine. The one ruled today is `028`'s WebKit split, because no Safari platform has a forced-colours mode (`028` decision 15). Its sentence: "Forced colours are not drawn in WebKit: no Safari platform has a forced-colours mode. Kuiper's rules are checked to compute there." Every other engine-only skip of a tagged test is a fault, which is the strict reading of "everything passes" (review finding 1, (b)). `022`'s clipboard candidates (decision 3) in `keyboard.spec.ts` are such skips. If they take `onlyIn` with no `no-user` ruling, they fault until rewritten engine-neutrally.

**Aggregation:**

- **A check whose every required cell is a declared gap is *not applicable* to the item** (review R2).
  - It is left out of `{m}`, the count of checks, and out of the pass test.
  - It is shown only as its not-checked lines.
  - Example: `contrast` that is `none` in all six cells, on an item with no text.
- **An applicable check passes** when every required cell either passes or is a declared gap, and at least one cell passes.
- **The item passes** when every applicable required check passes.
  - At least one check must be applicable.
  - `axe` always is, because every item has a page whose example region axe scans.
- A test that names several items counts for each.

**What the words may claim** follows from this:

- The table's "Where" column names a configuration for a check only where every declared test of that check ran (decision 9).
- The status line names no engine at all (decision 8).

### 6. The committed report and how it is made

**`bun run status`** (`scripts/status/run.ts`) writes `scripts/status/status.json`. The design lead runs it after a full run. No test runs it.

1. **Choose the run.** It takes `--run <id>`, or by default the newest qualifying push run for `--commit` (default `HEAD`).
   - "Qualifying" is `022` decision 19's test, imported from `scripts/ci/`: `event` is `push`, `status` is completed, `conclusion` is success, `displayTitle` is exactly `matrix`, and every declared job succeeded.
   - A mutation run, a pull-request run or a red run is refused, naming the condition that failed.
   - If `022` builds that test inside `release-check.ts`, this build moves it, unchanged, into `scripts/ci/qualify.ts`, and both import it.
2. **Fetch.** `gh run download <id> -n matrix-report -D <a temporary folder>`.
   - The artifact lives 14 days (`022` decision 14), so the report is made within 14 days of its run.
   - Without `gh`, or signed out, the script exits 1 and says so.
3. **Read the ledger at the run's commit.** `git show <sha>:tests/fault-ledger.ts` is written to the temporary folder and imported, so a fault's words are the ones that held when it was seen.
   - The ledger file must import nothing but types. `tests/unit/fault-ledger.test.ts` gains that check, so the copied file always loads alone.
   - `ENGINE_ONLY` is read at the run's commit the same way, from `tests/e2e/engine-only.ts`, under the same rule. The rule holds because that file is data alone (decision 3).
4. **Grade** every cell (decision 5). **Hash** every item at the run's commit (decision 7), reading files with `git show`, as `scripts/bench/` scores a commit.
5. **Write** with the repository's Prettier. The file is never edited by hand. A unit test parses it against `scripts/status/report.ts`'s types.

**Its shape** (`scripts/status/report.ts` exports the types):

```jsonc
{
  "schema": 1,
  "run": {
    "id": 42476096268, "attempt": 1, "commit": "<40 hex>", "branch": "release/0.13.0",
    "date": "2026-…Z",
    "url": "https://github.com/plutosystemsco/design-system/actions/runs/42476096268",
    "tools": { "playwright": "1.64.1", "axe": "4.14.0", "guidepup": "0.40.0",
               "runners": { "browsers": "ubuntu-24.04", "voiceover": "macos-26", "nvda": "windows-2025" } },
    "ledger": 0
  },
  "items": {
    "button": {
      "hash": "<sha-256>",
      "checks": {
        "axe":      { "result": "pass", "cells": { "chromium-light": { "passed": 9, "skipped": 0, "retried": [] }, … } },
        "contrast": { "result": "pass", "cells": { … }, "measured": ["[data-slot=switch-thumb]"] },
        "keyboard": { "result": "pass", "cells": { … } },
        "forced-colors": { "result": "pass", "cells": { … },
                           "gaps": [ { "config": "webkit-light", "test": "…: focus, state and edges are drawn", "shown": "Forced colours are not drawn in WebKit: …" } ] }
      },
      "faults": []
    }
  },
  "site": { "result": "pass", "faults": [] }
}
```

- `retried` lists each retried screen-reader test by file, title and pair.
- `faults` holds `{ check, config, test, finding, change }` or `{ check, config, test, reason }`.
- A check the item does not require is absent, not `null`.

**Bootstrap:** until the first full run with tags, `status.json` is `{ "schema": 1, "run": null, "items": {}, "site": { "result": "pass", "faults": [] } }`. Every page then shows decision 8's "added" state.

**When it is refreshed:** after each landing's green run, riding in the next landing's push, plus *C′* at the tag (decision 15; the owner, Q5).

### 7. A hash per item says whether the report still describes the code

`scripts/status/hash.ts` exports `itemHash(name, read)`, a SHA-256 over these inputs, in order:

1. the served JSON of the item and of every item in its `registryDependencies` closure, from `static/r/`;
2. the `bun.lock` entries of the transitive closure of the npm packages that closure names in `dependencies`: each package, its resolved version and its integrity. So a `@floating-ui` bump under `bits-ui` changes every item that uses `bits-ui` (review R9);
3. every file under `src/lib/site/examples/<name>/`;
4. the item's page, `src/routes/(site)/components/<name>/+page.svelte`;
5. for a block or a composition, each of its view routes, found through `BLOCK_VIEWS` and `COMPOSITION_VIEWS`, under `src/routes/(view)/view/` and `src/routes/(shell)/view/`;
6. the example route, `src/routes/(example)/example/[item]/[example]/`;
7. the three route-group layouts that wrap every view the tests open: `src/routes/(view)/+layout.svelte`, `src/routes/(shell)/+layout.svelte` and `src/routes/(example)/+layout.svelte`;
8. the served JSON of `kuiper-theme`, which every item names.

How it is computed:

- `read` is a function of a path. The same code hashes the working tree before the build (decision 15) and a commit through `git show` (decision 6).
- `static/r/` is committed and rebuilt before the site builds (`package.json`'s `build`), so both readings see the same bytes. Two unit checks prove it:
  - on a clean tree, the hash through the working tree equals the hash through `git show HEAD`;
  - `bun run build:registry --out <a temporary folder>` regenerates every committed `static/r/` file byte for byte. That is what `publishable.ts` hashes on Workers, and `025`'s registry guard already compares the same way (`025` decision 3).
  - A mismatch would fail safe, as *changed*, but it would block the deploy. So it is a test failure first (review R9).
- Where `025`'s `scripts/cost/hash.ts` exports a reader for the served-JSON closure, this reuses it. Cost and status then agree on what counts as an item's own change. Their other inputs differ by purpose: cost hashes its fixtures and harness; status hashes the pages and views the tests open.

Tests and site chrome are not in the hash:

- A test is the instrument, and the next run checks any change to it.
- Chrome is covered at the tag by decision 15's stricter rule: the run must be of the tagged tree.

### 8. Four states, and the status line's words

`scripts/status/words.ts` exports `statusOf(name, report, hash)` and `statusLine(status)`.

- The line sits under the facts row, as `<p data-slot="status" data-state="…">`.
- It starts with a link, "Accessibility status", to `#accessibility`, then a colon.

| State | When | The line after "Accessibility status:" |
|---|---|---|
| **pass** | the item passes (decision 5), and its hash equals the report's | "passes every check in the full run of {date}." |
| **fault** | a required check does not pass, and the hash equals the report's | "{n} of {m} checks fail in the full run of {date}. Not ready to publish; the faults are listed under Accessibility." |
| **changed** | the hash differs from the report's | "changed since the full run of {date}. Not ready to publish until the next full run." |
| **added** | the item is not in the report, or the report has no run | "added since the last full run. Not ready to publish until the next full run." |

- `{date}` is the run's date, written as the changelog writes dates.
- **The line names no engine and no screen reader.** "VoiceOver and NVDA" would read as "works with VoiceOver and NVDA". What runs is a set of scripted rules, on given examples and views, with Playwright's WebKit rather than Safari (`022` decisions 10 to 12). The Checks table states that properly; one line cannot (review finding 9). The owner chose this short, dated line (Q4).
- **Only *pass* may be published** (decision 15). The other three exist so that a build that is not published tells the truth. None is a grade. None says "partial" or "not yet": each says the page is not ready, and why.

### 9. The Accessibility section: Checks, What Kuiper provides, Your part

The section keeps its place in `SECTIONS` and its `h2`. Inside it are three `h3`s, in this order.

**1. Checks** (generated). It is a table with four columns: Check, What runs, Where, Result. One row per required check.

- *What runs* is decision 1's text, with this item's counts. Screen readers read: "Scripted rules on {n} examples and views: announcements, focus moves and overlays".
- *Where* names only the configurations where every declared test of the check ran (decision 5):
  - "Chromium, Firefox and WebKit; light and dark";
  - forced colours: "drawn in Chromium, light and dark, and Firefox; rules computed in WebKit";
  - screen readers: "VoiceOver on macOS, with Playwright's WebKit and Chromium; NVDA on Windows, with Chromium and Firefox".
- *Result* is "Passes, {n} tests", with "1 passed on retry" where decision 5 says so. For a fault, it lists each failing cell: "Fails in {configuration}: {finding} Fix: {change}."

**Below the table, the "not checked" lines.** There is at least one on every page, each from data:

- every declared gap of the item's checks: its `shown` sentence (decision 5);
- an item in `SR_ITEMS`: "JAWS is not tested." (`022` Q6);
- an item in `SR_EXCLUDED`: "Screen readers are not checked on {title}: {its reason}.";
- any other item: "Screen readers are not checked on {title}: it has no live region, focus move or overlay.";
- an item in `028`'s `EXCLUDED`: "Forced colours are not checked on {title}: {its reason}.";
- a `contrast` check that is `none` everywhere: "Text contrast is not checked on {title}: its examples hold no text.";
- an item with no measured non-text contrast: "Non-text contrast (borders, rings and fills, SC 1.4.11) is not measured on {title}." An item has a measurement when a passing `contrast` test names it.

**Then the run line:** "From the full run of {date}, at commit {short sha}, run {id}." The id links to the run's page on GitHub.

**2. What Kuiper provides** (written). This is the page's `accessibility` snippet, as today's list. Each bullet says what the item does: its element and role, its names, its keys, its focus, its sizes, its announcements.

**3. Your part** (written, when the page has one). A new optional snippet, `yourPart`. Each bullet says what an app must do for the item to stay accessible, as a must.

The fixed paragraph ("Every page here is checked in Chromium by axe …") is deleted.

Reasons:

- The table is the evidence. The status line is a dated pointer to it. Section 9 of the page standard, "Test it", may take the table over in `032`; until then it lives here.
- The not-checked lines say what the status does not cover, in GOV.UK's spirit (*status* §1.3). They make every skip visible, as Carbon's "partially tested" does, without a grade (*status* §1.1).
- They also keep two scorecard marks true: depth's "evidence" on Button, and row 13 (d), the statement of what is and is not checked (*status* §2.2).
- "What Kuiper provides" and "Your part" follow Primer's split (*status* §1.2) and the page standard's section 8.
- `scripts/bench/depth.ts`'s keyboard element reads only headings and a table whose first header is "Key" or "Keys" (READ, lines 59–72). "Checks" does not match, so row 2 does not move by accident.

### 10. Every page's bullets are sorted into "provides" and "your part" now

The 75 pages hold 285 accessibility bullets (EXECUTED, a count of `<li>` inside each page's `accessibility` snippet, 2026-11-15; confirmed by the review). About 44 carry an app's duty. Most of those are not imperatives:

- "An icon-only button needs an `aria-label`";
- "The image needs alt from the consuming app";
- "Dark glass over a light image of your own is yours to measure".

A heading "What Kuiper provides" over today's list would be false.

The sort is judgment, so it is done in the open:

- A bullet that tells the app what to do, or states the app's duty, moves to `yourPart`, worded as a must.
- A bullet that does both is split in two.
- **A bullet that is neither,** such as usage ("Polite only. An error that must interrupt is an error summary"), stays in "What Kuiper provides" as a statement of behaviour, until `032` gives usage its own place.
- No meaning changes, and nothing is added. A sentence that would need new research is left as it is and flagged to the design lead.
- `026`'s and `027`'s "Provides" and "Your part" lists move into the two snippets as written.
- `block-page.svelte` and `composition-page.svelte` pass `yourPart` through, as they pass `accessibility`.
- **The sort is its own commit inside the change.** Its landing notes carry a table with one row per bullet: page, bullet (its first eight words), destination, and whether it was split. The change reviewer reads that table against the diff.

**The guard,** `tests/unit/status-split.test.ts`. It is a guard, not a proof; review reads the rest.

- **In `accessibility`,** no sentence may:
  - contain "must", "should", "you", "your", "an app that", "the app", "the consuming app", "yours", "owes" or "needs", unless the sentence is in `NEEDS_ALLOWED`, a short list kept in the test. `NEEDS_ALLOWED` holds the exact sentences whose subject is the item itself, such as "The trigger needs no label of its own". Each entry has a one-line reason, and the change reviewer reads the list (review R6);
  - or open with a word from `IMPERATIVES`: Add, Avoid, Bind, Check, Do not, Don't, Give, Hide, Include, Install, Keep, Link, Make, Meet, Mount, Move, Name, Never, Offer, Pair, Pass, Portal, Provide, Put, Remove, Set, Show, Use, Wrap, Write. These are matched at a sentence's start, or after an opening clause that ends in a comma, such as "In link mode, put …".
- **In `yourPart`,** every bullet must open with a word from `IMPERATIVES`, at its start or after such an opening clause.
  - The list holds every opening verb in `026`'s and `027`'s "Your part" musts: "mount", "meet", "offer", "add", "portal", "install", "put", "give", "check", "move", "name", "pass", "set", "wrap", "remove".
  - A unit case runs their lists as fixtures and passes.

`032` later moves "Your part" into the guidance modules. Sorting now makes that a move, not a rewrite. The owner ruled the sort happens now, on all 75 pages, with the widened guard and the per-bullet table (Q1).

### 11. How an open fault shows, and whose it is

An open fault is a ledgered test, so it is in the run's report as a failure the ledger expected (decision 5). It shows in four places:

1. **The status line:** the *fault* state.
2. **The checks table:** the failing cell, the ledger's `finding`, and the small change that fixes it (`022a` and so on).
3. **The Markdown twin and `llms.txt`,** which are built from the page.
4. **The release check and the publishing build,** which refuse (decision 15).

**Chrome faults are the site's.**

- `022`'s ledger type gains one optional field, `scope: "site"`, in `tests/ledger.ts`. It is a one-field edit to a lane-E file, made after `022` lands.
- A ledgered failure whose violation lies outside every example region names `scope: "site"`. The grader counts it toward `site`, not toward the page's item. For `axe` tests, the item's cell reads `axe-region` (decision 4).
- `site` faults are shown nowhere on component pages. They block publishing and the tag exactly as an item's faults do (decision 15).

When the small change lands and the next full run passes, the next `bun run status` clears the fault.

### 12. Screen-reader words are generated, never written

- The error-summary page's line "Heard with VoiceOver on macOS. NVDA and JAWS are not tested." is deleted. Its checks table now says which readers ran, from the report, and says "JAWS is not tested."
- In `tests/unit/registry.test.ts`, the block "019: no screen-reader claim without its record" is replaced. It holds two tests, the second as `022` decision 13 relaxed it. The new block is **"030: screen-reader claims come from the report"**:
  - no component page's source names VoiceOver, NVDA, JAWS, Narrator, TalkBack or Orca, or says "heard with", "tested in" or "checked in" before an engine's name;
  - `checksTable("error-summary", <a fixture report with error-summary passing>)` names VoiceOver with WebKit and Chromium, and NVDA with Chromium and Firefox, and contains "JAWS is not tested."
- It is seen failing first: today's error-summary page says "Heard with VoiceOver".
- **This ban also forbids a written rationale that names a reader,** such as "Safari with VoiceOver drops list semantics, so …". That is intended. Such a fact is either a test's finding, and so generated, or it is reworded without the reader's name ("some screen readers drop list semantics …"). A builder does not loosen the test to admit one.

Reason: `019`'s test existed because a hand-written claim needed a record. A generated claim is its own record.

### 13. The cost figure on the facts row, and `025`'s note under Install

- **The facts row** gains a last term, `<dt>Cost</dt>`, with `costFacts()`'s strings in the `dd`: "{size}, {time}", or "{size} + {lazy} on demand, {time}".
  - Button reads "20.9 kB, updates in 43 ms". Dialog reads "37.8 kB, opens in 96 ms". These are the prototype's approximate figures (`025`'s research §4 and §9.4); the real ones come from its first full run.
  - The term holds no link. The facts row keeps its one link, and `site.spec.ts`'s `[data-slot="facts"] dd a` stays exact (*status* §2.2).
- **The floor items** read `025`'s floor fields (`025` decision 14):
  - `kuiper-theme`: "{css} kB of CSS, in every app";
  - `utils`: "{js} kB, counted once, not in any other item's cost";
  - each font: "{bytes} kB of font files, fetched per subset used".
- **The conditions** are `025`'s note, verbatim. That note is "alone, gzipped; times under a 4× slower CPU, from the click to the second frame after the change; an empty click measures N ms" (`025` decision 14). It is placed in one paragraph under Install, `<p id="cost">`, after the sentence "{title} costs an app {size} of JavaScript and CSS, gzipped, when it is the only Kuiper item on a page." If `025` exports the note from `costFacts()`, this uses that export, so the words cannot drift.
- **Freshness** is `025`'s: its unit test fails when a cost figure is stale (`025` decision 16). This specification adds no second check.
- **Why under Install:** it is where an adopter decides to add an item.
- **Why one term:** the facts row has room for one more entry (`018` decision 3; `facts.svelte`'s comment). The owner chose one "Cost" term, with `025`'s note under Install (Q3).

### 14. The cost per page, in kB, against `024`'s headroom

**About 2.6 to 2.8 kB gzipped on each component page** (EXECUTED, *status* §3; re-measured by the review at 2.6 to 2.7, *status* §5). It is made of:

- the markup and its page data: +1.1 to +1.4 kB on Button's, Sidebar's and Dialog's built pages;
- the two components' script: +1.44 kB.

**The stated cost is at most 5 kB a page** in the *pass* state, on the three templates whose pages use `component.svelte`. Blocks and compositions are in `component` (`024` decision 1).

| Template | Headroom of its heaviest page (INFERRED, `024` decision 9) | Button's | 030's cost | Left |
|---|---|---|---|---|
| `component` | 39 to 45 kB (`sidebar`) | 50 to 100 kB | ≤ 5 kB | ≥ 34 kB |
| `component-heavy` | 57 to 63 kB (`kuiper-theme`) | | ≤ 5 kB | ≥ 52 kB |
| `component-live` | 63 to 69 kB (`code-editor`) | | ≤ 5 kB | ≥ 58 kB |

- The binding figure is each template's heaviest page, about a tenth of its median, not Button's headroom.
- It fits every template. No budget rises, and no ruling is asked.
- `024`'s checkpoint compares this figure with the measured headroom (`024` build step 3). If the sweep leaves less than 5 kB on any of the three, this specification asks for a ruling before it is built.
- `component-data.server.ts` builds every string on the server and passes only strings. The report itself never reaches the page.
- Pages in the *fault* state add about 100 to 300 bytes per fault. They are never published.
- No other template changes. The twins and `llms.txt` grow by the same text; they are not budgeted.

### 15. The tag sequence, the release check, and builds that publish

**The release check.** `scripts/status/release.ts` is called by one line in `scripts/site/release-check.ts`, after `022`'s step and `025`'s cost step; whichever lands last adds its line last. It passes only if all of these hold:

1. `status.json`'s run qualifies (decision 6's test) for a commit *C*.
2. `git diff --name-only C HEAD` lists nothing outside `scripts/status/status.json`, `scripts/status/reader-timing.json` and `context/`. So the report is of the tagged tree. The site reads none of the three (review R4). The site reads nothing under `context/` (READ, the review's grep of `src/` and `scripts/site/`).
3. Every registry item is in the *pass* state, with its hash equal to the report's.
4. `site.result` is `pass`.
5. `run.ledger` is 0. `022`'s own step checks that the ledger is empty at `HEAD`.
6. **No retried screen-reader cell lacks a record.** For every test in any cell's `retried`, `scripts/status/reader-timing.json` holds an entry with the same file, title, reader, browser and run id. The entry also holds the phrases that show reader timing (from `022`'s `sr-logs/`) and the design lead's reason. This is the machine-read form of `022` Q2's record, as the owner answered it.
   - A retried cell without a record fails the check, naming the test.
   - Development builds keep showing "passed on retry"; only the tag is blocked.
7. **The tagged commit's own run has no unrecorded retry** (review R3).
   - `release.ts` also downloads *R(C′)*'s `matrix-report`, which also lives 14 days.
   - It requires that no screen-reader test in it passed only on a retry.
   - *R(C′)* is the release run in `022` decision 18's sense: "a push to `release/**` whose commit is to be tagged".
   - A record for *R(C′)* cannot be committed into *C′*, because that would be a new commit needing its own run. So a retry there fails the check. The design lead then ledgers the test, so the tag waits for its fix, or records reader timing in `reader-timing.json`. Either way, the sequence restarts at step 1, with the record in the new *C*.

`022`'s step still requires a green run of `HEAD` itself.

**The tag sequence, written down.** The report cannot name the run of its own commit. So the published bytes, which render `status.json`, are tested by one more run.

1. **Release preparation:** the dated changelog entry, the `static/v0.13.0/` snapshot and the version. These are committed as *C*.
2. **The owner pushes *C*.** Run *R(C)* goes green.
3. **`bun run status --run R(C)`.** The report is committed as *C′*. It may carry `scripts/status/reader-timing.json` and `context/` notes, and nothing else (condition 2).
4. **The owner pushes *C′*.** Run *R(C′)* goes green. It is the only run of the bytes that are published.
5. **The release check, on *C′*:**
   - `022`'s step: a green run of *C′*, and an empty ledger;
   - `025`'s cost step;
   - this step: the report of *R(C)*, the diff from *C* to *C′* inside the three allowed paths, every item passing, `site` passing, every retry in *R(C)* recorded, and no retry in *R(C′)* (condition 7). A retry in *R(C′)* restarts the sequence at step 1.
6. **The owner tags *C′*.** If *R(C′)* fails, the fault is fixed, a new *C* is made, and the sequence starts again at step 2.

Two designs that avoid the extra push were considered and rejected: accepting *R(C)* for *C′*, and deploying from Actions with the run's status. Both publish bytes that no run tested (review finding 10).

**Between tags (the owner, Q5),** each refresh rides in the next landing's push: after landing *N*'s run, `bun run status` is committed with landing *N+1*. It is never pushed alone, except as *C′* at the tag. Each push to `release/**` is a full matrix run with eight macOS and Windows jobs (`022` decision 10).

**A publishing build refuses to start.**

- `scripts/status/publishable.ts` runs as its own step in `package.json`'s `build`, after `build:registry` and before `vite build`. So it hashes the freshly built `static/r/`.
- It reads `process.env` directly. Reading `$env/dynamic/*` during prerender is unsafe in SvelteKit (INFERRED), and a page load's throw depends on `prerender.handleHttpError` staying strict.
- When `WORKERS_CI` is `"1"`, it exits 1 if any item is not in the *pass* state, or `site` holds a fault. It names each item and its state.
- Elsewhere (locally, on GitHub Actions) it exits 0, and the page shows its state.
- It fails in seconds, before anything is built.

**What this means for the owner** (review finding 8). The same Workers deploy serves `static/r/`, the registry adopters install from (`015` decision 21). So:

- **An item hotfix waits for evidence.** A fix to an item's source changes its hash, which gives *changed*, and the publishing build refuses. The fix reaches neither the site nor the registry until a full matrix run completes. That has no fixed bound: first-run shards time out at 45 minutes (`022` decision 7), and the run also waits for its macOS and Windows jobs and for queueing past 20 jobs. Then the design lead runs `bun run status`, and the owner pushes the report.
- **A theme change blocks the whole site** until that sequence completes, because every hash includes `kuiper-theme`.
- **Recovery:** revert the change and push, which gives the old hashes and so *pass*; or wait one run and one refresh.
- **Release-branch previews will almost never deploy,** since every Workers build refuses (the owner, Q2). Every landing changes some hash, and its refresh rides with the next landing.
- **The dashboard can override `WORKERS_CI`** (READ, Cloudflare's "Default variables"). So the release check, not this step, is the real gate. This step stops a push to `main` between tags from publishing an unproven status.

No reference blocks its docs deploy on a status. Carbon sidesteps the question by reading the report shipped inside the package version it installs (*status* §1.1). **Which builds refuse (the owner, Q2):** every Workers build, production and previews. The owner was told the consequences above first. The remedy is to revert or to wait.

### 16. The scorecard and the roadmap

See "Predicted scorecard movement" below. At landing, the design lead:

- corrects `roadmap.md`'s row `030`: row 15 moves to 4, not 3, because `025` met (d) with its 1,000-row case (`025` Q4, answered "now"). This holds only if `025` lands as specified;
- makes §1's "accessibility status pass count" the count of items in the *pass* state in `status.json`. Teaching `scripts/bench/` to read it is lane E's work, out of scope here;
- **records a finding for the re-rank:** non-text contrast (SC 1.4.11) is proven per item only where a test measures it. The not-checked line (decision 9) states the gap on each page until a specification measures it for `028`'s set. That is a finding to fix, ranked by the roadmap, not a limit (constitution §4.4).

## Design

### Files

```
scripts/status/
  run.ts              bun run status: choose, fetch, grade, hash, write (decision 6)
  grade.ts            cells, gaps, checks, items, faults, site (decisions 4, 5, 11); pure
  hash.ts             itemHash (decision 7); pure over a read function
  report.ts           types; readStatus (decision 6)
  words.ts            statusOf, statusLine, checksTable, notChecked, runLine (decisions 8, 9)
  required.ts         required(item) (decision 3)
  publishable.ts      the pre-build step (decision 15)
  release.ts          the release check's status step (decision 15)
  status.json         the committed report (decision 6)
  reader-timing.json  records of retried screen-reader tests (decision 15); [] at first
scripts/ci/qualify.ts   022's run test, moved out of release-check.ts if it is not already shared
tests/status/
  checks.ts           CHECKS (decision 1)
  about.ts            about() (decision 2)
  interactive.ts      028's derivation, moved here if 028 keeps it inside its test (decision 3)
tests/ledger.ts       the optional scope field (decision 11)
tests/e2e/engines.ts  onlyProjects() beside onlyIn and notIn (decision 3)
tests/e2e/engine-only.ts   ENGINE_ONLY as import-free data, with projects, gap, shown and ruling (decisions 3, 5, 6)
src/lib/site/page/
  status-line.svelte  the line (decision 8)
  checks.svelte       the table, the not-checked lines, the run line (decision 9)
  component.svelte    the line under the facts; the three h3s; yourPart; the cost paragraph; the old paragraph gone
  facts.svelte        the Cost term (decision 13)
src/lib/site/component-data.server.ts   status and cost strings (decisions 8, 13, 14)
src/lib/preview/block-page.svelte, composition-page.svelte   pass yourPart
src/routes/(site)/components/*/+page.svelte   the sort (decision 10); error-summary's line (decision 12)
tests/e2e/*.spec.ts   the tags (decision 2); axe-region and axe-contrast (decision 4); new keyboard fixtures (decision 3)
tests/e2e/status.spec.ts   new (criteria 13 to 16)
tests/unit/status-*.test.ts   new (below)
tests/unit/registry.test.ts   the 019 block replaced (decision 12)
tests/unit/fault-ledger.test.ts   the ledger imports only types (decision 6)
scripts/site/release-check.ts   one line (decision 15)
package.json   "status": "bun scripts/status/run.ts"; build gains the publishable step (ledger lines)
```

Not changed:

- `playwright.config.ts`, `playwright.sr.config.ts` and `tests/sr/` (lane E, `022`'s). Two things there are dependencies on `022`, not edits here: the static annotations (decision 2) and the config-level reader tag (decision 5);
- `scripts/cost/` (`025`'s);
- `tests/e2e/budgets.ts` (`024`'s);
- any registry item.

**Lanes.** The roadmap gives `030` lane S. Five edits reach beyond it. Each is in a file that a wave-1 or wave-2 spec also edits. This specification lands after all of them, because it depends on them, and rebases onto them:

- the tags and new fixtures in `tests/e2e/*.spec.ts`: `022` moves every file's `test` import; `028` adds forced-colours tests;
- the page sort in 75 `+page.svelte` files: `026`, `027` and `028` may add bullets;
- one line in `release-check.ts`, shared with `022` and `025`;
- `tests/ledger.ts`'s `scope` field, `tests/e2e/engines.ts`'s `onlyProjects`, and the new `tests/e2e/engine-only.ts`: all `022`'s files, each a small addition that `022` and `028` also adopt;
- `package.json`'s `build`.

## Scope

**In:**

- decisions 1 to 16;
- the tags on every test in the files decision 2 names;
- the keyboard tests the interactive set still lacks;
- the sort of every component page's bullets, with its table;
- the first report, from the first full run of this specification's own push.

**Out:**

- Keyboard tables, anatomy, "Test it" and the guidance modules (`032`).
- States driven for axe (`035`).
- Non-text contrast measured per item: a finding for the roadmap (decision 16).
- A site-wide support statement page. Row 13 (d) is already met by each page's statement of what is and is not checked, and stays met (decision 9).
- JAWS, Narrator, TalkBack and Orca as evidence (`022` Q6).
- Any change to how tests run, retry or shard (`022`), to budgets (`024`), or to the cost harness (`025`).
- Teaching `scripts/bench/` to count passing items (lane E).
- A status for site pages that are not component pages. Their evidence is tagged `site` and kept in the report. No page shows it, and it blocks publishing and the tag.

## Tests written first

Each is written and seen failing before the code it checks. The landing notes say how each failed.

1. **`tests/unit/status-tags.test.ts`.**
   - `about()` returns one tag and matching annotations for one item, for several items, and for `site`.
   - `CHECKS` holds exactly decision 1's five ids, in order.
   - No registry item is named `site`.

   Fails today: no module.
2. **`tests/unit/status-coverage.test.ts`** (decision 3), over the listing of both configs:
   - every tagged test has one check tag, one matching `check` and at least one known item;
   - no `describe` carries either;
   - every required cell, after the static skip declarations (`onlyIn`, `notIn` and `onlyProjects`), has a listed test, with screen-reader cells crossed with `matrix.yml`'s pairs;
   - `forced-colors.spec.ts` and `028`'s `items.spec.ts` pass the source check through `onlyProjects`;
   - `tests/e2e/engine-only.ts` imports only types;
   - no tagged test holds an undeclared skip call.

   A fixture listing with a runtime-skipped test shows the source check catching it. Fails today: no test carries a tag, so every cell is empty.
3. **`tests/unit/status-required.test.ts`.**
   - The keyboard set equals `028`'s interactive set.
   - The forced-colours set and its projects are `028`'s exported data.
   - `SR_ITEMS` is `022`'s.
   - The reader pairs are `matrix.yml`'s.

   Fails today: no module.
4. **`tests/unit/status-grade.test.ts`,** over fixture records shaped as `022`'s `report.json`:
   - every cell passing gives *pass*;
   - a ledgered failure gives a fault with the ledger's `finding` and `change`;
   - a ledgered failure with `scope: "site"` counts toward `site`, and leaves the item's `axe` cell to its `axe-region`;
   - a screen-reader pass on retry with no ledger line gives *pass*, listed in `retried`;
   - **a pass beside a `no-user` skip in the same cell gives a pass and a declared gap with its `shown` sentence;**
   - **a pass beside any other skip gives a fault naming the test, the configuration and the reason;**
   - a cell of `no-user` skips only gives a declared gap, not a pass;
   - `axe-contrast` `incomplete` answered by a `contrast` test naming the same selector gives a pass;
   - an `incomplete` answered by one naming another selector gives a fault;
   - `none` in every configuration makes `contrast` not applicable: an item with every other check passing gives *pass*, `{m}` leaves contrast out, and the "no text" line shows (review R2);
   - a screen-reader record's configuration comes from its `reader-<name>` tag and its `projectName`;
   - a skip through `onlyProjects` outside the required cells leaves no hole; a `gap` entry missing from the closed list, or without a `ruling`, is an error;
   - a screen-reader test counts for its `item`, not its `hears`;
   - a test naming two items counts for both;
   - an unknown item name is an error, not a silent drop.

   Fails today: no module.
5. **`tests/unit/status-run.test.ts`.** Run choice, over recorded `gh` JSON:
   - a qualifying push run is chosen;
   - a mutation run, a pull-request run, a red run and a run of another commit are each refused, naming its condition;
   - `gh` absent exits 1;
   - a ledger fixture that imports a relative module is refused by `fault-ledger.test.ts`'s new check.

   Fails today: no module.
6. **`tests/unit/status-report.test.ts`.**
   - The committed `status.json` parses against `report.ts`'s types and is in Prettier's format.
   - `itemHash` is stable.
   - It changes when any input of decision 7 changes, including a view route of a block, a route-group layout, and the `bun.lock` entry of a package reached only transitively.
   - A fresh `build:registry --out` equals the committed `static/r/` byte for byte.
   - It does not change when a test file does.
   - On a clean tree, the working-tree hash equals the `git show HEAD` hash for every item.
   - `statusOf` gives *pass*, *fault*, *changed* and *added* on four fixtures.
   - The bootstrap report gives *added* for every item.

   Fails today: no module.
7. **`tests/unit/status-words.test.ts`.**
   - `statusLine` returns decision 8's exact strings for each state, and none names an engine or a reader.
   - Every line matches `pluto.ts`'s `/Accessibility status/i`.
   - `checksTable` and `notChecked` give decision 9's rows and lines:
     - the forced-colours "Where" for a `028` item;
     - the WebKit gap sentence;
     - the `EXCLUDED` line;
     - the non-text line;
     - every page has at least one line matching `depth.ts`'s evidence pattern.

   Fails today: no module.
8. **`tests/unit/status-publish.test.ts`.**
   - `publishable.ts` exits 1, naming items, for each non-*pass* state and for a `site` fault when `WORKERS_CI=1`, and exits 0 otherwise.
   - `release.ts`'s conditions, each failing alone:
     - a run that does not qualify;
     - a diff outside the two allowed paths;
     - one item not *pass*;
     - one hash unequal;
     - a `site` fault;
     - `ledger` above 0;
     - a retried screen-reader cell with no `reader-timing.json` entry, or one whose run id differs;
     - a retried screen-reader test in *R(C′)*'s report (review R3);
   - A diff from *C* to *C′* holding only `status.json`, `reader-timing.json` and `context/` passes condition 2 (review R4).

   Fails today: no module.
9. **`tests/unit/status-split.test.ts`** (decision 10).
   - Fails today on Button's "Give it `aria-hidden`" and "An icon-only button needs an `aria-label`" (bare "needs" is flagged), on every page without `yourPart`, and on the 44 bullets the review found.
   - A sentence in `NEEDS_ALLOWED` passes, and one entry without a reason fails.
   - `026`'s and `027`'s "Your part" lists, run as fixtures, pass.
10. **`tests/unit/registry.test.ts`, "030: screen-reader claims come from the report"** (decision 12). Fails today on the error-summary page's line.
11. **`tests/e2e/status.spec.ts`,** written against the built site with a fixture report: first decision 6's bootstrap, then a passing fixture, then a fixture with a fault and a gap. It covers criteria 13 to 16. Fails today: no `[data-slot="status"]`.
12. **The new keyboard fixtures** (decision 3) are written before the coverage test passes. Each is seen failing on a scratch break of its item (focus removed from one stop), then passing. The landing notes record each.
13. **The byte cost** is measured, not unit-tested: criterion 18.

## Acceptance criteria

1. **Five checks.** `CHECKS` holds decision 1's five, in order, with `contrast` shown as "Text contrast". (unit)
2. **Every tagged test is well formed.**
   - Every test with a check tag has exactly one check tag, one `check` annotation equal to it, and at least one `item`, a registry name or `site`.
   - No annotation appears without its pair, none sits on a `describe`, and none is pushed at run time.
   - (unit)
3. **Coverage of what is declared.**
   - Every required cell of decision 3 has at least one listed test expected to run there, after the static skip declarations, under both configs.
   - Screen-reader cells are crossed with `matrix.yml`'s pairs.
   - No tagged test holds an undeclared skip.
   - At this specification's build: 82 items, with `026`'s one and `027`'s six. The counts per check go in the landing notes.
   - (unit)
4. **One interactive set.** The keyboard set is `028`'s interactive set, imported, and every member has a `keyboard` test. The forced-colours set and projects are `028`'s exported data. The landing notes list the keyboard fixtures written. (unit; review)
5. **The region.** `axe.spec.ts` pushes `axe-region` and `axe-contrast` on every scan, before its assertion, computed over the example region. Test 4's region and contrast cases pass. (unit; e2e)
6. **Grading.** Test 4 passes, including the skip cases. (unit)
7. **The report.** `status.json` parses, is Prettier-formatted, and was written by `bun run status` from a qualifying run. Its `run.url` opens that run. (unit; review)
8. **Hashes.** Test 6 passes. (unit)
9. **Words.** Test 7 passes. Every component page's built status line matches decision 8's template for its state. (unit; e2e)
10. **Provides and your part.**
    - Test 9 passes.
    - Every page passes `accessibility`.
    - `026`'s and `027`'s "Your part" lists hold their musts as `yourPart`.
    - The landing notes hold the per-bullet table, and the change review cites it.
    - (unit; review)
11. **Screen-reader claims.** Test 10 passes. The error-summary page's line is gone. (unit)
12. **The old paragraph is gone.** No built component page contains "Every page here is checked in Chromium". (e2e)
13. **The status line.** Every component page has one `[data-slot="status"]`, after the facts row and before "On this page". Its text starts "Accessibility status:", its link goes to `#accessibility`, and its `data-state` equals `statusOf`'s. (e2e)
14. **The section.** Every component page's Accessibility section holds:
    - in order, the `h3`s "Checks", "What Kuiper provides" and, where given, "Your part";
    - one table row per required check, whose "Where" names no configuration with a skipped declared test;
    - at least one not-checked line, and every declared gap's line;
    - the run line, linking the run.

    (e2e)
15. **The cost.**
    - Every component page's facts row ends in a "Cost" term whose text equals decision 13's strings from `025`'s report.
    - The facts row holds exactly one link.
    - Every page has `#cost` under Install, holding `025`'s note verbatim.
    - `site.spec.ts`'s facts tests pass unchanged.

    (e2e)
16. **The twin.** Every component page's Markdown twin contains its status line, the checks table as a Markdown table, its not-checked lines and its cost term. (e2e, through `build-output.spec.ts`'s reading of `build/`)
17. **Publishing refuses.**
    - With `WORKERS_CI=1` and a fixture report holding one item fault, `bun run build` stops at the publishable step, before `vite build`, naming the item.
    - The same happens for a `site` fault.
    - With the same report and no `WORKERS_CI`, it builds, and the page shows the fault.
    - (unit for `publishable.ts`; one local build of each case, recorded in the landing notes)
18. **The byte cost.**
    - `024`'s `transfer` tests pass for `component`, `component-heavy` and `component-live`.
    - The landing notes give Button's and the heaviest `component` page's transfer medians, before and after. Each has grown by at most 5 kB.
    - (e2e, perf)
19. **The first report.** The first full run of this specification's push is graded, and its `status.json` is committed. The landing notes give every item's state, every fault with its small change, and every declared gap. (CI; run)
20. **The release check.** `release.ts` fails for each case of test 8, and passes on a fixture where every condition holds. It runs once for real at the 0.13.0 tag, through decision 15's sequence. (unit; release)
21. **Nothing else moved.**
    - `git diff` touches no file under `src/lib/registry/`, `tokens/` or `static/r/`, no `playwright*.config.ts`, and nothing in `tests/sr/`.
    - In `tests/ledger.ts` it adds only `scope`.
    - In `tests/e2e/engines.ts` it adds only `onlyProjects`, and moves `ENGINE_ONLY` into `tests/e2e/engine-only.ts`.
    - (review)
22. **The suites.** `bun run test:unit`, `bun run test:e2e`, `bun run test:smoke`, `bun run check` and `bun run lint` pass. The landing's full run is green. (all; CI)
23. **The scorecard.** Rows 3 and 15 are re-scored as below, and rows 2, 8 and 13 are held. The run log has a row. The roadmap re-rank records decision 16's non-text finding. (measure)

## Build order

1. **Confirm the tools.**
   - The listing under both configs carries static annotations and tags, inherits `describe` tags, and starts no server (*status* §2.1, §5).
   - `022`'s screen-reader annotations are static.
   - Listing `playwright.sr.config.ts` works on `ubuntu-24.04`.
   - A merged `report.json` record names its reader: the config-level `reader-<name>` tag, or the field `022` uses instead.
   - `028`'s `tests/status/interactive.ts` exports exist.
   - Then write tests 1 to 10, and see each fail.
2. **The helper, the tags and the skip data.**
   - `CHECKS` and `about()`.
   - The tags in every file decision 2 names.
   - `axe-region` and `axe-contrast`.
   - The `gap` and `scope` fields.
   - The design lead's ruling on `028`'s WebKit gap, recorded.
   - Tests 1 to 3 pass, except for the cells that still lack a keyboard test. `bun run test:e2e` passes with the same count.
3. **The keyboard gap.** The shared derivation's members without a keyboard test get one (test 12). Test 2 then passes.
4. **The grader, the hash, the words.** `grade.ts`, `hash.ts`, `words.ts`, `report.ts` and the bootstrap `status.json`. Tests 4 to 8 pass.
5. **The page.**
   - The line, the table, the not-checked lines and the three `h3`s.
   - `yourPart`, the Cost term and the `#cost` paragraph.
   - The old paragraph and the error-summary line removed.
   - Test 11 passes on all three fixtures.
6. **The sort.** Every page's bullets, in one commit of its own within the change, with the per-bullet table. Test 9 passes.
7. **Checkpoint.**
   - The design lead reads Button, Dialog, Error summary, Toast, Switch and one block page in the browser, in both schemes, at 1440 and 390, in each of the four states (from fixtures).
   - The facts row's wrap at 390 is checked with the one Cost term (Q3).
   - The perf `transfer` tests run, and the cost per page is compared with decision 14.
8. **`run.ts`, `release.ts`, `publishable.ts`, the release-check line and the build step.** Tests 5 and 8 pass. Criterion 17's local builds run.
9. **Owner push.**
   - The first full run with tags.
   - `bun run status --run <id>`.
   - Each fault is a ledger line already, with a small change (`022` decision 16).
   - Each skip-fault (decision 5) is a small change too.
   - The report rides in the next push (decision 15).
10. **Change review,** then landing, then the scorecard.

## Predicted scorecard movement

Before `030`, assuming `022` and `028` landed as predicted:

- Row 3 has (a), (e), (g) and (h): a count of 4 and a score of 2.
- Row 15 has (b) and (d) from `025`: a score of 2.

| Row | Criterion | Before | After | Score | Evidence |
|---|---|---|---|---|---|
| 3, accessibility evidence | (d) a per-component status, generated from tests | – | ✓ | count 4 → 5; score **2, held** (4–5 → 2) | the status line and checks table on every page, from `status.json`; `pluto.ts`'s `statusOnPages` |
| 15, component cost | (a) per-item size published | – | ✓ | **2 → 4**, if `025` lands as specified | the Cost term on every page |
| 15 | (c) runtime cost published | – | ✓ | | the time in the Cost term and `#cost` |
| 2, guidance depth | "evidence" on Button and Dialog | ✓ | ✓ | 2, held | the not-checked lines (decision 9) |
| 8, page weight | Button's transfer | 380 kB | ≤ 385 kB | 4, held | criterion 18 |
| 13, reach | (d) support statement | ✓ | ✓ | 1, held | the not-checked lines and the Where column |

- **Row 3 does not change score here.** (d) makes Kuiper's count 5. `031`'s high-contrast scheme, (f), makes it 6 and the score 3. Kuiper then matches Carbon's 3 on row 3, with two things Carbon's status lacks: a pass rather than a presence, and every engine named or its gap stated.
- **Row 15 at 4 is one more than the roadmap's "→ 3".** `025` met (d) in 0.13.0 with its 1,000-row `table` case held by a budget. The prediction is conditional on `025` landing as specified. No reference scores above 1 on row 15 (*cost* §9.5).
- If `028` has not given (e) by then, row 3's count is 4 after `030`, and its score is 2 either way.

## Risks

- **The first tagged run will show faults** that the untagged suite hid: a cell of skips, a skip that is not a `no-user` gap, or a contrast axe could not decide. Each is a finding, a ledger line or a small change. The tag waits for them.
- **The strict skip rule may fault tests that only need rewriting,** such as `022`'s clipboard candidates. Each becomes an engine-neutral rewrite, a small change in lane E.
- **The keyboard gap is new test-writing.** It is sized at roughly 5 to 12 items (INFERRED), and the shared derivation gives the exact list at build step 1.
- **The tag needs one more push,** *C′* (decision 15). The owner's Q5 answer keeps every other refresh inside a landing's push.
- **Publishing waits on evidence.** Item hotfixes and theme changes wait one full run, one refresh and one owner push (decision 15). This is the cost of the owner's rule. The owner chose that it reaches every Workers build (Q2).
- **The artifact expires in 14 days.** A report not made within 14 days of its run needs a new run.
- **The page sort is broad.** It covers 285 bullets on 75 pages. It changes no meaning, has its own commit and table, and the guard catches the plainest misplacements. It conflicts with any page edit landing at the same time, so it lands last in wave 2.
- **`028` is under revision.** This specification imports its derivation, its projects and its exclusions. If they change, the imports follow and the words follow them.
- **Workers Builds' variables can be overridden** in the dashboard. The release check remains the real gate (decision 15).

## Open questions for the owner

None. The owner answered Q1 to Q5 on 2026-11-15; the answers are in the Landing notes and in decisions 6, 8, 10, 13 and 15.

## Review

The specification review, [`../reviews/030-the-accessibility-status-spec-2026-11-15.md`](../reviews/030-the-accessibility-status-spec-2026-11-15.md), 2026-11-15: approve with changes. Each finding, and what changed:

| # | Severity | Answer |
|---|---|---|
| 1 | High | **Accepted, the review's (a) and (b) together.** Decision 5: a skip beside a pass no longer "changes nothing". A skip by an `ENGINE_ONLY` entry ruled `gap: "no-user"` is a declared gap, shown as a not-checked line from its data. The only one ruled is `028`'s WebKit forced-colours split, with the line "Forced colours are not drawn in WebKit: …". Any other skip of a tagged test is a fault. Decisions 8 and 9: the status line names no engine; "Where" names only configurations where every declared test ran. Test 4 gains both skip cases; criterion 14 checks "Where". |
| 2 | Medium | **Accepted.** Decision 3: every skip in a tagged test goes through `onlyIn` or `notIn`, listed in `ENGINE_ONLY`, and a source check forbids any other skip call. The listing's cells subtract those declarations. Screen-reader cells cross the listing with `matrix.yml`'s pairs through `scripts/ci/workflow.ts`. The claim is narrowed: declared coverage fails before a run, and anything else fails at grading. The forced-colours projects are `028`'s exported data; the disagreeing fallback is deleted. Build step 1 confirms that `022`'s annotations are static (else a lane-E dependency) and that listing the screen-reader config works on `ubuntu-24.04`. |
| 3 | Medium | **Accepted.** Decision 15, condition 6: `release.ts` fails on any retried screen-reader cell without an entry in `scripts/status/reader-timing.json`: test, reader, browser, run id, phrases and reason. This is `022` Q2's record, machine-read. Test 8 gains both cases. |
| 4 | Medium | **Accepted.** Decision 7: the hash adds the `bun.lock` versions of the closure's packages, each block's and composition's view routes, and the example route. A unit test equates the working-tree and `git show HEAD` hashes. It reuses `025`'s closure reader where exported. |
| 5 | Medium | **Accepted.** Decisions 1 and 4: the check is "Text contrast", over the example region only, for all four values. `none` everywhere is a not-checked line, not a pass. An `incomplete` is answered only by a `contrast` test naming the same selector in a `measures` annotation. Decision 9 adds a not-checked line for unmeasured non-text contrast. Decision 16 records it as a roadmap finding. |
| 6 | Medium | **Accepted.** Decision 10: the guard is widened (must, should, you, your, an app that, the app, needs … from, owes, yours, and a longer `IMPERATIVES` list, with opening clauses). It accepts `026`'s and `027`'s musts, run as fixtures. Usage-only bullets stay under "What Kuiper provides" until `032`. A per-bullet table goes in the landing notes. |
| 7 | Medium | **Accepted.** Decision 3: one derivation, `028`'s, imported, and moved to `tests/status/interactive.ts` if `028` keeps it inside its test. `KEYBOARD_EXCLUDED` is gone. The gap from 34 fixtures to 52 interactive items is sized and closed in this specification (test 12), and the fixtures written are counted in the landing notes. |
| 8 | Medium | **Accepted.** Decision 15: `publishable.ts` is a pre-build step reading `process.env`, before `vite build`. The consequences are stated: registry hotfixes wait; a theme change blocks the site; previews rarely deploy; how to recover; the dashboard override. Q2 states them before its options. |
| 9 | Medium | **Accepted.** Decision 8: the passing line is "passes every check in the full run of {date}", with no engines or readers. Q4's recommendation is now the short dated line. Its option 2 says "with scripted VoiceOver and NVDA checks". The table's screen-reader row says "Scripted rules on {n} examples and views" and "Playwright's WebKit". |
| 10 | Low | **Accepted.** Decision 15 writes the tag sequence, *C*, *R(C)*, *C′*, *R(C′)*, the check and the tag, with the restart, and records the two rejected designs. Q5 option 1 says the refresh rides in the next landing's push. |
| 11 | Low | **Accepted.** Decisions 4 and 11: the item's `axe` cell reads `axe-region`. A ledger line may carry `scope: "site"`, counted toward `site`. `publishable.ts` and `release.ts` refuse a `site` fault. |
| 12 | Low | **Accepted.** Decision 13 uses `025`'s note verbatim, "from the click to the second frame", or its export if `025` provides one. |
| 13 | Low | **Accepted, all five.** (a) Decision 2 and criterion 2: exactly one check tag, none on a `describe`. (b) Decision 6: the ledger and `ENGINE_ONLY` import only types, held by `fault-ledger.test.ts`. (c) Decision 9: a not-checked line for `028`'s `EXCLUDED`. (d) Decision 12: the ban on reader names covers rationale too, by intent. (e) Decision 9: `depth.ts`'s keyboard element is unaffected. |

The memo carries a dated correction, §5, for the facts these findings changed.

### The re-review (2026-11-15)

The re-review closed findings 1 to 13 and raised R1 to R9. All are applied:

| # | Severity | Answer |
|---|---|---|
| R1 | Medium | Decision 3: a third declared helper, `onlyProjects(projects, reason)`, beside `onlyIn` and `notIn`, listed in `ENGINE_ONLY` with a `projects` field. `028`'s `items.spec.ts` uses it with `FORCED_PROJECTS.draw` and `.compute`; `forced-colors.spec.ts`'s `018` skip moves onto it with the three light projects. The source check accepts it, and the coverage test subtracts it. The `no-user` mark stays only on `webkit-light`'s draw test. `022`'s and `028`'s authors adopt the helper. |
| R2 | Medium | Decisions 4 and 5: a check whose every required cell is a declared gap is not applicable. It is left out of `{m}` and the pass test, and shown only as its not-checked line. `axe` is always applicable. Text-free items (`separator`, `skeleton`, `spinner`, `liquid-glass`) can pass. Test 4 gains the case. |
| R3 | Medium | Decision 15, condition 7: `release.ts` also reads *R(C′)*'s report and refuses any screen-reader retry there. The design lead ledgers it or records reader timing, and the sequence restarts at step 1. Step 5 and test 8 say so. |
| R4 | Low | Decision 15, condition 2 and step 3: `scripts/status/reader-timing.json` joins the allowed paths. Test 8's diff case covers it. |
| R5 | Low | Decision 5: a `gap` carries `ruling`, a path to its decision. `fault-ledger.test.ts` holds the closed list of permitted gaps, today `FORCED_WEBKIT_GAP` alone. |
| R6 | Low | Decision 10: bare "needs" is flagged, with a reviewed `NEEDS_ALLOWED` list of item-subject sentences, each with a reason. Test 9's claim now matches the rule. |
| R7 | Low | Decisions 3 and 6: `ENGINE_ONLY`'s data moves to its own import-free file, `tests/e2e/engine-only.ts`, which `engines.ts` imports and `022` and `028` use. |
| R8 | Low | Decision 5: a screen-reader record's configuration is its config-level `reader-voiceover` or `reader-nvda` tag plus its `projectName`. The tag is set from the job's `SR_READER` in `playwright.sr.config.ts`, a dependency on `022`. Build step 1 confirms the field in a real `report.json`. |
| R9 | Low | Decision 15 and Q2: "no fixed bound; first-run shards time out at 45 minutes", plus macOS, Windows and queueing. Decision 7: the `bun.lock` transitive closure, the three route-group layouts, and a test that `build:registry` regenerates `static/r/` byte for byte. Decision 4: an iframe node is classified by its outermost frame element. |

## Landing notes

**The owner's answers (the owner, 2026-11-15).** The owner took the recommended option on every question:

- **Q1:** split "What Kuiper provides" from "Your part" now, on all 75 pages, with the widened guard and a per-bullet table in these landing notes (decision 10).
- **Q2:** every Workers build refuses, production and previews (decision 15). The owner was told the consequences first: item hotfixes and theme changes wait for one full run, a status refresh and a push, and the remedy is to revert or to wait.
- **Q3:** one "Cost" term on the facts row, with `025`'s note under Install (decision 13).
- **Q4:** the short dated line, "Accessibility status: passes every check in the full run of {date}", linking to the Checks table (decision 8).
- **Q5:** refresh after each landing's green run, riding in the next landing's push, plus *C′* at the tag (decisions 6 and 15).

**From `022` (the coordinator, 2026-11-15):** `022` settles `forced-colors.spec.ts`'s light-only skip as `onlyProjects(["chromium-light", "firefox-light", "webkit-light"], "light schemes only")`, matching decision 3. It also adds the screen-reader config's reader tag (decision 5) and makes its screen-reader annotations static (decision 2). Build step 1 still confirms both in a real run.

Not yet landed.
