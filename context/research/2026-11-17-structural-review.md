# A structural review of the repository

- **Status:** complete
- **Date:** 2026-11-17
- **Author:** a reviewer, at the owner's request
- **Question:** Is the repository organized properly, and does it follow the best practices of its languages and libraries: Svelte 5, SvelteKit, TypeScript, Tailwind CSS 4, the shadcn-svelte registry format, Playwright, Bun and GitHub Actions?
- **What it blocks:** nothing. It commits us to nothing. Each fix it proposes needs its own small change or specification.

## How to read this memo

- **READ:** a file of the main checkout on `release/0.13.0` at `b01e754`, read on 2026-11-17. Paths and line numbers are from that commit.
- **EXECUTED:** run in this session's Linux container, under Bun 1.4.4, on 2026-11-17:
  - `bun run check`: 2,433 files, 0 errors, 0 warnings.
  - `bun run lint`: every file in Prettier's style.
  - `bun scripts/lint-literals.ts`: 0 literals in item files, 1 counted allowance.
  - `tsc --noEmit --noUnusedLocals --noUnusedParameters` over the `.ts` files, as a probe. It cannot read `.svelte` files, so its 59 import errors are noise. Its 9 unused names are real.
  - Four scratch scripts: relative Markdown links; each registry item's files and imports against `registry.json`; a rough import graph for files nothing imports; each package in `package.json` against the imports.
  - `grep` counts, each given with its pattern's meaning.
- **INFERRED:** our reasoning. Every severity and every proposed fix is INFERRED.

Severities. **High** is a defect, or a practice that will cause bugs. **Medium** is an inconsistency or a risk. **Low** is polish.

Sizes. A **small change** is the constitution's §5 kind: one page, no interface change. A **specification** is a full one. **No change** means a recorded decision, with the specification cited.

A **lane** is the roadmap's term (§2): a set of files only one build may change at a time.

## 1. Summary

The repository is well organized. The code is in better order than the record around it.

- **The code is clean** (EXECUTED). The type check, the format check and the literal lint all pass. No legacy Svelte syntax exists in 693 components. Every registry item lists its files and declares what it imports. No package is unused.
- **The record has drifted** (READ). The README, the handoff, about twenty specification status lines and the roadmap's lane list describe an earlier state. The project's rule is that code follows the context, so this drift matters more here than elsewhere.

The five most important findings:

1. **Neither Playwright config forbids `test.only` in CI** (Q1, High). One stray `.only` would give a green run that tested almost nothing.
2. **The handoff contradicts itself, and about twenty landed specifications still read "awaiting the merge"** (X1 and X2, Medium).
3. **The README is wrong in five places**, the Bun version and the item count among them (X3, Medium).
4. **35 fixed waits and five copied helpers sit in the browser suite** (Q2 and Q3, Medium). CI fails a run on one flaky test.
5. **The roadmap's lane E names a folder that no longer exists, and no lane names `tests/`** (X4, Medium). Lanes are what keep five agents apart.

Counts: 1 High, 9 Medium, 16 Low.

## 2. Findings

### 2.1 Tests

**Q1. High. Neither Playwright config sets `forbidOnly`.**

- Evidence (READ): `playwright.config.ts:17-25` and `playwright.sr.config.ts:30-44` set retries, reporters and `failOnFlakyTests`. Neither sets `forbidOnly`.
- Evidence (READ): `scripts/ci/gate.ts:7` passes a full run "only if every job succeeded". `scripts/ci/report.ts` counts statuses. Neither compares the number of tests run with a number expected.
- Evidence (EXECUTED): `grep` for `forbidOnly` and for a `.only` guard in `tests/unit/`, `scripts/ci/` and `022`'s specification finds nothing. No `.only` is committed today.
- Why it matters: with a committed `test.only`, each shard runs only that test and passes. The gate goes green. The release check then accepts the run as evidence. Constitution §4.4 rests on that evidence.
- Fix: a small change in lane E. Add `forbidOnly: CI` to both configs. The check is a unit test that reads both configs, seen failing first.

**Q2. Medium. The browser suite holds 35 fixed waits.**

- Evidence (EXECUTED): `waitForTimeout` appears 35 times in 14 files under `tests/e2e/`. The most are in `keyboard.spec.ts` (7), `doors.spec.ts` (5), `chat.spec.ts` (5) and `bar-glass.spec.ts` (4). Eight more plain `setTimeout` sleeps are in `search-field.spec.ts`, `tag.spec.ts`, `search.spec.ts`, `nav.spec.ts` and `blocks.spec.ts`.
- Evidence (READ): the waits are of two kinds. Some wait for a thing to settle, such as `keyboard.spec.ts:829` ("Chromium animates a keyboard scroll") and `doors.spec.ts:205` (2,000 ms). Others prove that nothing happens, such as `primitives.spec.ts:510`.
- Evidence (READ): `playwright.config.ts:22` fails a CI run on a flaky test (`022` decision 18). The fifth matrix run's memo, §1, reads three WebKit shards failed on one flaky test each. `022`'s landing notes (line 1163) record eight `bar-glass` timeouts inside a `waitForTimeout`.
- Why it matters: a settle wait is a guess at a machine's speed. On a slow runner it is too short, and the run fails. `022o` already fixed six tests "that assumed a moment".
- Fix: a specification in lane E, since it touches 14 files. Sort each wait into one of two named helpers. A settle wait becomes a condition: `expect.poll`, a finished animation, or `pages.ts`'s `settled`. A proof of nothing keeps its time, through one helper that takes a reason.

**Q3. Medium. Five helpers are copied between spec files.**

- Evidence (READ):
  - `rawPage`, six copies: `blocks.spec.ts:34`, `chat.spec.ts:35`, `code.spec.ts:105`, `error-summary.spec.ts:128`, `navigation.spec.ts:108`, `primitives.spec.ts:718`. The bodies match, but `code.spec.ts` also returns the HTML.
  - `holdsColour`, three copies, the same to the letter: `code.spec.ts:33`, `navigation.spec.ts:31`, `tokens.spec.ts:23`.
  - `computed`, three copies: `chat.spec.ts:22`, `code.spec.ts:63`, `navigation.spec.ts:49`.
  - `expectNoViolations`, two copies: `axe.spec.ts:25`, `compositions.spec.ts:41`.
  - `rgbToHex`, two copies that differ: `batch-a.ts:46` throws on a value that is not `rgb()` and does not round; `doors.spec.ts:22` rounds, and returns `#NaN…` on a value that does not match.
- Why it matters: a fix to one copy misses the others. The two `rgbToHex` copies already disagree, so the same computed colour can read as two hex values in two files.
- Fix: a small change in lane E, tests only. Move each helper to `tests/e2e/pages.ts`, or to one new helpers module beside it. Keep one `rgbToHex`.

**Q4. Low. A failed browser test leaves no trace.**

- Evidence (READ): `playwright.config.ts:25` is `use: { baseURL }`. No `trace`, `screenshot` or `video` is set. `022`'s specifications record no decision on traces (EXECUTED: `grep`).
- Why it matters: each matrix run so far was triaged from job logs, by memo. A trace kept on the first retry rides in the blob report that CI already uploads.
- Fix: a small change in lane E: `trace: "on-first-retry"`.

**Q5. Low. Support modules, fixtures and names are spread about.**

- Evidence (READ): `tests/e2e/` mixes seven support modules with its 42 spec files: `batch-a.ts`, `budgets.ts`, `engine-only.ts`, `engines.ts`, `macos-webkit.ts`, `pages.ts`, `scheme.ts`. `tests/helpers/` holds the unit tests' helpers only.
- Evidence (READ): fixtures live in four folders: `tests/fixtures/`, `tests/unit/fixtures/`, `tests/e2e/fixtures/`, `tests/smoke/fixtures/`.
- Evidence (READ): some names come from a specification's number, not from the job: `batch-a.spec.ts`, `tests/fixtures/021-before/`, `023-pass-throughs.json`.
- Evidence (READ): `tests/sr/` has two files named `derive.ts` (one in `mutations/`), and a `declared.ts` beside the `declared()` that `fixtures.ts` exports. `rules.ts:14-48` writes the fifteen rule ids twice, as a type and as a list.
- Evidence (EXECUTED): four files pass 1,700 lines: `registry.test.ts` (2,541), `code.spec.ts` (2,221), `keyboard.spec.ts` (1,968), `generated.test.ts` (1,726).
- Why it matters: a newcomer cannot tell a helper from a suite by its place. None of this breaks anything.
- Fix: none now. Fold a tidy into Q3's small change if it is cheap. The screen-reader suite's structure after `022q` is sound (§3).

### 2.2 Context and documents

**X1. Medium. The handoff contradicts itself.**

- Evidence (READ, `context/handoff.md`):
  - Lines 15 and 34 say `022` "waits on push B", the first matrix run. Lines 22 and 23 report runs 1 to 4. A fifth has run since.
  - Line 34 says the ledger "holds 2 lines". Line 26 says "the 8 ledger lines". `tests/fault-ledger.ts:29-45` holds one fault in six projects: 6 lines.
  - Line 61 says "Firefox and WebKit are not yet run".
  - Line 36 gives the order to the `v0.12.0` tag, a release that is past.
  - Line 67 says the roadmap is "being written now".
  - The landed list runs 1 to 10, then 13, 12, 11 (lines 12-24).
- Why it matters: `AGENTS.md` sends every agent to this file first. Its header says it is "replaced at each release", but it was appended to through three sessions.
- Fix: a rewrite of the handoff in place, by the design lead. It changes no rule. State, what waits on the owner, and what is next, each as of today. Delete the rest.

**X2. Medium. About twenty landed specifications still read as not landed.**

- Evidence (READ, each file's line 3, against `handoff.md:12-24`, which lists each as landed):
  - "awaiting the merge": `020a`, `020b`, `022b`, `022c`, `022d`.
  - "awaiting its change review": `017`, `018`, `023`, `025`, `026`. Each has a change review in `context/reviews/`.
  - "Ready to build after `020`": `021` and `027` open with these words, and tell the rest further on.
  - "awaiting the checkpoint and push B": `022`.
  - "waits for its change review": `022n`. "waits for the review's disposition": `022m`. Their review is `reviews/022mn-…-pr-2026-11-16.md`.
  - "committed on the build branch": `020`. "uncommitted": `019a`.
- Evidence (READ): `022a`, `022e` and `024e` show the right form: "landed on `release/0.13.0` 2026-11-16, with … in one merge".
- Why it matters: `context/README.md` calls a landed specification "a historical record". A reader of the status line alone cannot tell what is on the branch. Every specification does have a status line (EXECUTED: all 62).
- Fix: one pass by the design lead, no code. Each landed specification's status begins "landed on `release/0.13.0`", with its merge commit. Then one line in `context/README.md`, "One change, start to finish": the landing sets the status line.

**X3. Medium. The README is wrong in five places.**

- Evidence (READ, `README.md`):
  - Line 16: "Everything runs under Bun 1.3.14". `package.json:8-11` pins 1.4.4 in `packageManager` and `engines` (`025`'s QB).
  - Line 10: "Today 63, in ten groups". `registry.json` holds 83 items in eleven groups; `compositions` is not listed (EXECUTED).
  - Line 11: `src/routes/` is "a preview app … It is not a website". Constitution §3 says the repository hosts one public design site.
  - Line 12: `context/` holds "decisions". `decisions.md` was retired on 2026-11-15.
  - Line 43: "nothing is deployed". Line 31 links to the deployed site.
- Why it matters: Kuiper is a public product, and this is its first page. The Bun line sends a newcomer to the wrong version.
- Fix: a small change, one page. Its check: a unit test that holds the README's Bun version to `package.json` and its item count to `registry.json`, seen failing first.

**X4. Medium. The roadmap's lanes do not match the tree.**

- Evidence (READ): `context/roadmap.md:57` defines lane E as "`playwright.config.ts`, `scripts/a11y/`, CI, the bench and cost scripts". `scripts/a11y/` does not exist; `022` deleted its one file (`022`, line 286).
- Evidence (READ): no lane names `tests/`. The harness that `022` and `022q` built is there: `tests/test.ts`, `tests/ledger.ts`, `tests/fault-ledger.ts`, `tests/server.ts`, `tests/sr/`. `playwright.sr.config.ts` and `scripts/ci/` are not named either.
- Why it matters: `AGENTS.md` allows five agents, one build per lane. Two builds in different lanes can both edit `tests/sr/rules.ts` today, and no rule says which waits.
- Fix: an edit to the roadmap's §2 by the design lead. Lane E becomes the two Playwright configs, `tests/` outside an item's own spec file, `scripts/ci/`, `.github/`, and the bench and cost scripts. Say whether `tests/fault-ledger.ts` is a ledger file.

**X5. Low. Thirty of 688 relative links do not resolve.**

- Evidence (EXECUTED, the link script):
  - 21 are in `research/2026-11-15-design-sites-developer.md` (lines 59 to 149). They point to shots of other systems' sites, which the folder's own `.gitignore` keeps out by design.
  - 4 point to `../decisions.md`: `001`, `002`, `003` (line 9 of each) and `research/2026-11-14-how-to-highlight-code-accurately.md:402`. `context/README.md` records the retirement and the last commit, `beeb67e`.
  - 5 are code samples that look like links.
- Evidence (READ): `research/benchmark-scorecard.md:65` names `scripts/bench/pluto.ts`, and lines 188 and 413 name `tokens/pluto.tokens.json`. Both files were renamed by `020`. The scorecard is an instrument, completed in place.
- Fix: no change for the 25. A small edit to the scorecard's three paths at its next run.

**X6. Low. Combined reviews break the file-name rule.**

- Evidence (READ): `context/reviews/README.md` names a review `NNN-<slug>-pr-YYYY-MM-DD.md`. Six files cover several specifications under made-up numbers: `022ae-024e-…`, `022bcd-…`, `022ij-…`, `022mn-…`, `022rs-…`, `020c-022p-…`.
- Why it matters: a search for `022c-` finds no review. Each specification does cite its review by path.
- Fix: one sentence in `reviews/README.md` that allows a combined review and says how it is named. No file moves.

### 2.3 Layout

**L1. Medium. `scripts/` holds libraries as well as scripts, and the site reaches into it.**

- Evidence (EXECUTED): 19 files under `src/` import `scripts/tokens.ts`, and 3 import `scripts/contrast.ts`, by paths such as `../../../../../scripts/tokens.ts` (`src/routes/(site)/foundations/colour/+page.server.ts:1`).
- Evidence (READ): `scripts/tokens.ts` is 1,492 lines of token reading and resolving. It has no command line.
- Evidence (EXECUTED): four scripts import from `tests/`: `scripts/ci/report.ts:24`, `scripts/site/release-check.ts:29-37`, `scripts/cost/build.ts:24`.
- Why it matters: the folder has two jobs. A move of either file breaks 22 import lines. `tests/smoke/process.ts` is a process helper that a script needs, so it is not a test's.
- Fix: a specification, in lanes T and E. Give the token and contrast libraries one home with an alias, as `#lib` has. Move the shared process helper beside the scripts.

**L2. Medium. The `v0.12.0` tag is missing.**

- Evidence (READ): `context/roadmap.md:232` says "`v0.12.0` was tagged on `dad6f76`".
- Evidence (EXECUTED): `git tag` and `git ls-remote --tags origin` both end at `v0.11.0`. Commit `dad6f76` exists. `static/v0.12.0/` is committed.
- Evidence (READ): `CHANGELOG.md:60` tells an app to `add` "from `v0.12.0`". The README's install path pins a release by its tag.
- INFERRED: the tag is on the owner's machine alone, or was never made.
- Why it matters: an app cannot pin 0.12.0 on GitHub. `tests/unit/registry.test.ts` reads released snapshots from `git tag`, so its result differs between machines.
- Question for the owner: (a) push the tag from the machine that has it (recommended); (b) make it now on `dad6f76`; (c) record that 0.12.0 was never released, and amend the roadmap and the changelog.

**L3. Low. Three server-only modules lack the `.server.ts` suffix.**

- Evidence (READ): `src/lib/site/brand/downloads.ts:10-13` and `src/lib/site/shown-source.ts:6-7` import `node:fs`. `src/lib/site/start/install.ts:6` imports `registry.json` whole.
- Evidence (READ): `shown-source.ts` is imported for a type by a browser component, `src/lib/site/page/component.svelte:3`.
- Evidence (READ): eleven sibling modules do use the suffix, such as `component-data.server.ts`.
- Why it matters: SvelteKit refuses a `.server` module in browser code. Without the suffix, only a comment keeps `node:fs`, or the whole registry (`024b`), out of the bundle.
- Fix: a small change in lane S. Rename the three. Move `ExampleMeta` to a module with no imports.

**L4. Low. `src/lib/preview/` is a remnant.**

- Evidence (READ): its nine files serve the block and composition pages of the design site. The site's other code is in `src/lib/site/`. The name dates from `001`'s preview app.
- Fix: none now. Fold it into `src/lib/site/` when lane S next touches those pages.

**L5. Low. `context/` weighs 33 MB.**

- Evidence (EXECUTED): `du` reads 33 MB for `context/` and 7.9 MB for `static/`. The largest tracked files are research shots; one is 2.3 MB (`research/2026-11-15-high-contrast/swatches.png`).
- Why it matters: every clone and every worktree carries them. Up to five worktrees run at once.
- Fix: none now. A line in `context/README.md` could set a size for a kept shot.

**No change: generated files that are committed.** `src/app.css` (`001` decision 15), `static/r/` and `static/v*/` (`001` decision 18), `src/lib/site/listed-items.ts` (`024b`), `scripts/cost/report.json` (`025`). Each is recorded, and each is held by a test. `scripts/rename-kuiper.ts` and `src/lib/site/test-views/` go in 0.14.0 (`020`, lines 223 and 317). `scripts/ci/bootstrap-matrix.yml` is `022` decision 15's fallback; delete it once `main` has `matrix.yml`.

### 2.4 TypeScript

**T1. Medium. The registry item's shape is declared about thirty times.**

- Evidence (EXECUTED): `grep` for `type Item =`, `type RegistryItem` and `type RegistryEntry` finds 7 in `src/`, 6 in `scripts/` and 17 in `tests/`. Examples: `src/lib/site/api.server.ts:35`, `scripts/cost/items.ts:21`, `tests/sr/derive.ts:32`.
- Evidence (READ): site code reads `registry.json` two ways. Five files parse it from disk, such as `src/lib/site/component-data.server.ts:60`. Three import it, such as `src/routes/(site)/start/theme/+page.server.ts:1`. Each casts the result with `as`.
- Evidence (READ): `src/routes/(example)/example/[item]/[example]/+page.server.ts:25-27` loads `node:fs` with a dynamic `import()`, though line 1 imports it already.
- Why it matters: a cast is not a check. A new field in `meta` must be added by hand in each place that reads it. `001` records that the tests parse with `shadcn-svelte/schema`.
- Fix: a specification, small, in lanes S and E. One module exports the item type, from the schema where it can, and one `readRegistry()`. The thirty declarations become imports.

**T2. Low. Nothing checks for unused code.**

- Evidence (EXECUTED, the `tsc` probe): 9 unused names in `.ts` files. `ThemeName` in `compositions.spec.ts:25`, `four-dot.spec.ts:4`, `site.spec.ts:21`, `tokens.spec.ts:10`; `page` in `frames.spec.ts:32` and `toast.spec.ts:804`; `activate` in `keyboard.spec.ts:5`; `validateTokens` in `tests/unit/contrast.test.ts:21`; `text` in `src/lib/registry/lib/highlight/tree-sitter.ts:581`. The probe cannot read the 693 `.svelte` files.
- Evidence (READ): `tsconfig.json` sets `strict` and inherits `verbatimModuleSyntax`. It sets neither `noUnusedLocals` nor `noUnusedParameters`.
- Evidence (READ): `bun run lint` is Prettier alone (`package.json:27`). Three `eslint-disable` comments remain from stock code, with no ESLint to read them: `chart-tooltip.svelte:12` and `:56`, `chart-utils.ts:27`.
- Evidence (EXECUTED): no specification records a decision for or against a code linter.
- Fix: a small change. Remove the nine. Add the two flags to `tsconfig.json`; `svelte-check` reads them. See what it finds in the components first.
- Question for the owner: (a) the two compiler flags alone (recommended: no new dependency); (b) ESLint with `eslint-plugin-svelte`, a new pinned dependency, by a specification; (c) leave it.

**T3. Low. Non-null `!` is concentrated in three files.**

- Evidence (EXECUTED): 74 uses in `src/lib/` and `scripts/`. `src/lib/registry/lib/highlight/tree-sitter.ts` has 19, `scripts/convert-reference.ts` 16, `shiki.ts` 9. `noUncheckedIndexedAccess` is off.
- Evidence (EXECUTED): `any` is rare. Seven uses in `src/`: three in the stock chart, four as `Component<any>` for example modules. The tests' `(window as any)` in `code.spec.ts` is a page hook.
- Why it matters: `tree-sitter.ts` ships to apps. A capture a query does not return is `undefined` at run time, and `!` hides it.
- Fix: none now. When lane I next touches the highlighter, replace each `m.content!` with a guard.

### 2.5 Svelte 5 and SvelteKit

No finding above Low. See §3.

**S1. Low. Four effects set state.**

- Evidence (READ):
  - `src/lib/site/chrome/search-palette.svelte:57-65`: two effects read `query` with `void`, then reset `active` and `copied`.
  - `src/lib/registry/components/settings-form.svelte:144-153`: one effect copies a derived value into the bindable `dirty`; one clears `saved` and `notice`.
  - `src/lib/registry/ui/sidebar/sidebar.svelte:28-30` and `tooltip/tooltip-trigger.svelte:39-41`: each copies a prop or a ref into context state.
- Why it matters: Svelte's guidance is to derive, or to set state in the event that caused the change. An effect that sets state runs one render late and can loop. These four are small and guarded.
- Fix: none required. A small change per item if lane I or S is there anyway: reset in the input's handler; pass a getter into the context.

**S2. Low. Context keys are written three ways.**

- Evidence (READ):
  - Typed set and get helpers around a private key: `field/field-context.svelte.ts:11-58`, `popover/popover-content.svelte:16-25`, `accordion/accordion-item.svelte:16-27`.
  - A string written in both files: `"kuiper:tooltip"` in `tooltip.svelte:30` and `tooltip-trigger.svelte:37`; `"kuiper:item-group"` in `item-group.svelte:14` and `item.svelte:55`.
  - Stock keys with no `kuiper:` prefix: `"toggleGroup"` (`toggle-group.svelte:13-17`), `Symbol.for("scn-sidebar")` (`sidebar/context.svelte.ts:84`), `Symbol("chart-context")` (`chart/chart-utils.ts:69`).
- Why it matters: a typo in a repeated string fails silently, since `getContext` returns `undefined`. `020` renamed the `pluto:` keys and did not rule on the stock ones (EXECUTED: `grep` of `020`).
- Fix: fold into 0.14.0's first landing, the small change that removes the old keys (`020`, line 317). Use the helper form for tooltip and item.

### 2.6 Tailwind 4 and CSS

No finding. See §3. The one arbitrary value that looked like a miss, `rounded-[var(--radius-action,var(--radius))]` in `button.svelte:10`, is `009`'s recorded decision (line 194).

### 2.7 The registry

**R1. Low. One item imports from an item it declares only through another.**

- Evidence (EXECUTED, the registry script): `src/lib/registry/ui/code-block/code-block-content.svelte:4` imports a type from `#lib/registry/lib/highlighter`. `code-block` declares `use-highlighted-code`, which declares `highlighter`.
- Why it matters: the install is right today. If the hook ever drops `highlighter`, `code-block` breaks in an app.
- Fix: a small change in lane I: add `highlighter` to `code-block`'s `registryDependencies`. It is a ledger edit to `registry.json`.

Everything else the script checked is clean (§3).

### 2.8 Scripts and CI

**W1. Low. Seven command-line scripts have no `package.json` script.**

- Evidence (READ): `package.json:22-36` names `build:tokens`, `build:registry` and `cost`. `scripts/lint-literals.ts`, `scripts/site/release-check.ts`, `scripts/site/thumbnails.ts`, `scripts/site/citations.ts`, `scripts/convert-reference.ts`, `scripts/ci/qualify.ts` and the `scripts/bench/` files are run by path.
- Evidence (READ): CI runs the literal lint by path (`matrix.yml:91`). `bun run lint` and `bun run test` do not run it.
- Why it matters: a builder who runs `bun run lint` and sees it pass may still fail CI's literal lint.
- Fix: a small change. Add `lint:literals` and `release-check`. Let `lint` run both lints.

**W2. Low. Eight jobs repeat the same set-up steps.**

- Evidence (READ, `.github/workflows/matrix.yml`): checkout, `setup-bun` and `bun install` open all of the jobs that install. The download, untar and two `test -f` lines repeat in five jobs (at lines 97, 127, 162, 224 and 272).
- Evidence (READ): `tests/unit/workflow.test.ts` holds the copies in step, so they cannot drift unseen.
- Fix: none now. A composite action under `.github/actions/` would cut about 60 lines, and `scripts/ci/workflow.ts` would need to read through it.

**W3. Low. Four hygiene gaps in the workflow.**

- Evidence (READ, `matrix.yml`):
  - No `persist-credentials: false` on any checkout (lines 48, 74, 113 and five more). The token is read-only (lines 28-30).
  - No cache for Bun's package store. About 45 jobs each run `bun install`. Playwright's browsers are cached (lines 82-85).
  - No `.github/dependabot.yml`. Every action is pinned by commit, which is right, so nothing proposes the next pin.
  - A pull request from a fork runs the macOS and Windows reader jobs (lines 44, 181, 247). These are the costly runners.
- Fix: a small change in lane E for the first three. The fourth is a question for `022`'s author: should a fork's run stop at `browsers`?

Scripts' error handling is sound (READ, sampled: `build-registry.ts`, `ci/gate.ts`, `ci/workflow.ts`). Four function names repeat across scripts (`walk`, `serveBuild`, `read`, `packageName`); none is worth a change.

### 2.9 Dependencies

**D1. Low. Bun's types are one minor version behind Bun.**

- Evidence (READ): `package.json:65` pins `@types/bun` at 1.3.14. `package.json:8` pins Bun at 1.4.4. `025`'s QB moved Bun and did not move the types.
- Why it matters: an API new in 1.4 has no type. The check passes today.
- Fix: a small change: pin `@types/bun` to 1.4.4, and run `bun run check`.

**No change:** every package is a `devDependency`, and a package an item names has a caret range. Both are `001`'s rules (lines 102-108), held by `tests/unit/deps.test.ts`.

## 3. What is done well

Keep these. Do not change them by mistake.

- **Svelte 5 throughout** (EXECUTED). No `export let`, no `$:`, no `<slot>`, no `on:` directive, no store in 693 components. 221 `$state`, 177 `$derived`, 33 `$effect`. Effects that take a resource return a cleanup (`sidebar-content.svelte:32`, `popover-title.svelte:35`, `theme.svelte.ts:49`).
- **Props are typed and documented** (READ, sampled): `$props()` with an exported type, a doc comment on each prop, `$bindable` for `ref`, snippets for children.
- **SSR safety** (EXECUTED): no `window` or `document` at module scope without a guard. `theme.svelte.ts:22` guards with `typeof document`.
- **Routes** (READ): four layout groups, one job each. `prerender` and `trailingSlash` are set once, at the root, with stated exceptions. `$app/state` is used, not the old stores.
- **Naming** (EXECUTED): every file under `src/`, `scripts/` and `tests/` is kebab-case. Every `ui/` folder has an `index.ts`. Rune modules end `.svelte.ts`.
- **Tokens are the one source, and a lint proves it** (EXECUTED): 0 literals in item files; 0 hex or pixel arbitrary values in `src/`. `app.css` uses `@theme inline`, `@utility` and `@custom-variant` as Tailwind 4 intends. `@apply` appears 6 times, all in the base layer.
- **The registry** (EXECUTED): 83 items. No file is owned twice. No listed file is missing. No tracked file under `src/lib/registry/` is outside an item. Every cross-item import but R1 is declared directly.
- **The registry build** (READ, `scripts/build-registry.ts`): it builds into a staging folder and swaps on success, so a failed build leaves the last good registry.
- **The workflow** (READ): every action pinned by commit with its version in a comment; least permissions; concurrency by commit; a timeout on every job; `--frozen-lockfile --ignore-scripts`; one build shared as an artifact; the mutation set passed through `env`, never into a shell line.
- **The screen-reader suite after `022q`** (READ): `rules.ts` imports nothing and is pure. `sr.ts` takes its reader as an argument, so a unit test drives it with a fake. `fixtures.ts` alone touches guidepup. `reader.ts` refuses a CI job that names no reader. No rule passes on silence.
- **One `test` for every browser spec** (EXECUTED): all 42 spec files import `tests/test.ts`, so the fault ledger sees every test.
- **Dependencies** (EXECUTED): no unused package. `bun.lock` is present. Tools are pinned exactly.
- **The context's form** (EXECUTED): every document under `context/` has its status, date and author lines.
- **Comments cite decisions.** Almost every unusual line names the specification and decision behind it. That made this review possible.

## 4. What was not reviewed

- **The browser, screen-reader and smoke suites were not run.** Nor were `bun test`, `bun run build` or `bun run cost`.
- **The three worktrees** under `.claude/worktrees/`.
- **Most files, line by line.** About 30 of 693 components were read. The rest were covered by `grep` and by the checks.
- **Dead CSS.** Each theme utility was checked for a use. Rules inside `site.css` and `<style>` blocks were not.
- **Accessibility, design and the tokens' values.** Those are the suites' job.
- **The content of specifications and reviews.** Only headers, status lines and links were read. Whether a memo was edited after the fact was not checked.
- **`static/`'s versioned snapshots**, `scripts/cost/` and `scripts/bench/` beyond their headers.
- **The unused-code probe's reach.** It read `.ts` files only.
- **Bun's own handling of `test.only` in CI.** Q1 covers Playwright alone.

## The owner's answers (2026-11-17)

- **L2, the `v0.12.0` tag:** (c) 0.12.0 was never released; the next release is 0.13.0. The roadmap, the changelog, the README and the code that name a 0.12.0 release are amended by a change of their own (the roadmap row "0.12.0 was never released").
- **T2, unused code:** (b) ESLint with `eslint-plugin-svelte`, by a specification.
- **Delegation:** asked two of `019b`'s questions, the owner left them to the design lead ("you are in charge of delivering value"; "be a good steward of the project"). The design lead decides such choices among a specification's options, records the ruling, and the owner may reverse it.

