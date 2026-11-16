# Review of 030 — The accessibility status

Reviews [`specifications/030-the-accessibility-status.md`](../specifications/030-the-accessibility-status.md).

- **Date:** 2026-11-15
- **Status:** in review. Approve with changes. Not fit to build yet: findings 1 to 9 stand.
- **Reviewer:** a reviewer; not the author
- **Reviewed:** the specification as drafted (510 lines) and its memo, [`research/2026-11-15-accessibility-status.md`](../research/2026-11-15-accessibility-status.md) (126 lines). I checked them against:
  - the constitution (§2.3, §2.5, §4.4, §5), `AGENTS.md`, `reviews/README.md`, `roadmap.md` (row `030`, §3 "`024` before `030`", §4) and the scorecard (§2 rubric; rows 2, 3 and 13);
  - the owner's ruling, `git show beeb67e:context/decisions.md`, lines 120 and 128–131;
  - `022` (decisions 2, 3, 10–19, the SR config at line 502, Q2, Q6 and the landing notes), `024` (decisions 1, 4 and 9), `025` (decision 14, Q4, and the *cost* memo §7), `026` (lines 454–457), `027` (line 680 on), and `028` as drafted (decisions 1, 13 and 15);
  - `015` decision 21, `playwright.config.ts`, `vite.config.ts` (`prerender.handleHttpError`), `wrangler.jsonc`, `package.json` (`build`), `tests/e2e/perf.spec.ts` (its gzip server), `tests/unit/registry.test.ts` lines 1893–1917, `scripts/bench/depth.ts` lines 55–115, the error-summary page, the view routes under `src/routes/(view)/` and `src/routes/(shell)/`;
  - prior art: `carbon-design-system-carbon-website/src/components/A11yStatus/A11yStatus.js` lines 78–165; `primer-design/src/components/status.jsx` lines 86, 219–287; `alphagov-govuk-design-system/src/accessibility-statement.md` (headings and line 17), `components/accordion/index.md:138`, `components/radios/index.md:104`; `alphagov-govuk-frontend/docs/contributing/browser-support.md`; `adobe-spectrum-design-data/packages/design-data/components/button.json` lines 239–248. I did not re-fetch Atlassian; the memo's §1.5 stands as READ there.
- **Re-ran:** nothing in the repository was written except this file. Probes ran in `…/scratchpad/030-review/`, with no server on any port (the probe's `webServer` pointed at 5391 and was never started).
  - **Listing probe** (EXECUTED; `bun --bun playwright test --list --reporter=json`, Playwright 1.64.1; a scratch config with two projects, a `globalSetup` that writes a marker file, and a `webServer` whose command writes a marker file and exits 1):
    - static `tag` and `annotation` from the details argument list per project. Tags arrive without the `@`;
    - a `describe`'s tag and annotations are inherited by its tests;
    - a config-level `tag` is prepended to every test;
    - an annotation pushed at run time does not list;
    - **a runtime `test.skip(true, …)` lists as `expectedStatus: "passed"` with no annotation.** Only declared `test.skip(title, …)` and `test.fixme` list as skipped;
    - neither marker file was written, so neither `webServer` nor `globalSetup` ran. The exit code was 0.
    - A scratch-only artefact: with the scratch folder's `node_modules` symlinked to the repository's, a spec file that uses TypeScript type annotations failed to transform ("errors building"). Plain-JS syntax listed fine. This comes from the out-of-tree symlink, not from listing.
  - **Byte cost** (EXECUTED; a mock inserted into `build/components/{button,sidebar,dialog}/index.html`, built at `f9e1c1a`, 16:10). The mock holds the status line, a four- or five-row checks table with headers, the not-checked line, the run line with its link, three `h3`s, the Cost term, the `#cost` paragraph, and all strings again as page data, with the hand paragraph removed. Gzipped: Button +1,111 bytes at level 6 and +1,117 at level 9; Sidebar +1,265 and +1,217; Dialog +1,268 and +1,249. Raw growth is about 4.0 to 4.4 kB. With the memo's 1,444 bytes of script, that is **about 2.6 to 2.7 kB a page**. The memo's 2.8 kB stands. The perf server gzips at `Bun.gzipSync`'s default level, not 9 (`perf.spec.ts:58`); the difference is a few bytes.
  - **Bullets** (EXECUTED; `<li>` inside each `{#snippet accessibility()}` of `src/routes/(site)/components/*/+page.svelte`): **75 pages, 285 bullets**, none without the snippet. Of those, 5 open with a verb from decision 10's list and 15 more have a later sentence that does. A wider pattern, adding "needs", "must", "should", "your", "an app", "the app", "you" and the imperatives "Check", "Hide", "Move" and "Pair", matches **44 bullets**.
  - **Workers Builds variables** (READ, developers.cloudflare.com/workers/ci-cd/builds/configuration/, "Default variables", 2026-11-15): `CI=true`, `WORKERS_CI=1`, `WORKERS_CI_BUILD_UUID`, `WORKERS_CI_COMMIT_SHA` and `WORKERS_CI_BRANCH` are injected, "but can be overridden" in the dashboard.

## Acceptance criteria against evidence

The specification is not built, so each criterion is judged for whether it can be checked and whether it checks the right thing.

1. Five checks — checkable (unit). READ.
2. Well-formed tags — checkable. It needs "exactly one check **tag**", since a `describe` tag can add a second one (EXECUTED, inheritance). Low; see finding 13.
3. Coverage — **not sound as written.** The listing cannot see runtime skips or reader pairings (finding 2).
4. Required sets derived — checkable, but it duplicates `028`'s derivation (finding 7).
5. Contrast — checkable. What it proves is narrower than its name (finding 5).
6. Grading — checkable. It encodes a skip rule that overclaims (finding 1) and a flake rule that skips `022` Q2's record (finding 3).
7. The report — checkable (review, unit).
8. Hashes — checkable, but over too few inputs (finding 4).
9. Words — checkable. The words overclaim (finding 1).
10. Provides and your part — partly checkable. The guard checks a fraction of the sort (finding 6).
11. and 12. — checkable (unit, e2e). READ: today's page holds "Heard with VoiceOver" at `error-summary/+page.svelte:63`. So test 10 fails first, as claimed.
13. and 14. — checkable (e2e).
15. The cost — checkable. Its wording differs from `025`'s (finding 12).
16. The twin — checkable.
17. Publishing refuses — checkable. Its consequences are not stated (finding 8).
18. The byte cost — checkable. Re-measured here: about 2.7 kB, within the ≤ 5 kB stated.
19. and 20. — checkable at the run and at the tag.
21. to 23. — checkable.

## Findings, most severe first

1. **High. The passing line claims engines and checks that did not run, because a skip beside a pass "changes nothing"** (decision 5, first bullet; decision 8, `{checks}` and `{readers}`).
   - Failure: `028` decision 15 runs forced-colours assertions A to F only in `chromium-light`, `chromium-dark` and `firefox-light`. In WebKit it runs only G, "rules compute", and skips A to F through `notIn`, because WebKit repaints nothing. Under decision 5, a `webkit-light` cell where G passed and A to F were skipped is a pass. The published line then says "forced colours in Chromium, Firefox and WebKit" for all 54 items `028` covers. That is a wrong statement on every one of those pages.
   - The same holds for any `onlyIn` keyboard test beside a passing one. `022` decision 3 names the clipboard grants in `keyboard.spec.ts:1039` and `1463` as `onlyIn` candidates.
   - Carbon's page, the one reference that generates a status, is more honest about skips than this. A skipped tagged test there shows "Partially tested" (READ, `A11yStatus.js` lines 107–117 and 140–155).
   - The owner ruled out a "partial" state. That makes it more important that a skip is never silent, not less.
   - Fix:
     - (a) Every `ENGINE_ONLY` entry on a tagged test produces a "not checked" line on that item's page, from the entry's data. For example: "Forced colours are not drawn in WebKit: WebKit has no forced-colours mode; its rules are checked to compute." The line names the engine and the reason. The status line's "Where" then names only engines where every tagged test of that check ran. Or:
     - (b) A tagged test may not take `onlyIn` or `notIn`. It must be split into an engine-neutral test, or its cell is a fault. That is the owner's "everything passes", read strictly.
     - Either way, decision 5's first bullet changes. Test 4 gains a case: a pass beside a skip in the same cell gives the not-checked line (a), or a fault (b).
     - I recommend (a) for engine gaps that no user meets, such as WebKit's absent forced-colours mode. I recommend (b) for anything else.

2. **Medium. The coverage proof is blind to runtime skips and to reader pairings, so "a coverage hole … never reaches a page" is not true** (decision 3, "Coverage is proven by the listing"; criterion 3).
   - Evidence (EXECUTED): a runtime `test.skip` lists as an expected pass. `onlyIn` and `notIn` (`022` decision 3, `028` decision 15) skip at run time. `028`'s `firefox-dark` skip is "by `test.skip` in the file". So a cell made only of such tests passes criterion 3, and appears only at grading, as decision 5's "every test skipped" fault.
   - Separately, `playwright.sr.config.ts` has three browser projects, `webkit`, `chromium` and `firefox`. The workflow picks two per reader (`022` line 502). So the listing never shows `voiceover-webkit` or `nvda-firefox`, the configurations decision 1 requires.
   - `022` also does not say whether its `item`, `rules` and `hears` annotations are static. Decision 2's "the screen-reader suite is not edited" depends on that.
   - Fix:
     - The coverage test subtracts the static `ENGINE_ONLY` entries (file, title, engine) from the listed cells before it judges a cell.
     - It maps screen-reader cells by crossing the listing's browser projects with the reader-by-browser pairs that `scripts/ci/workflow.ts` reads from `matrix.yml`.
     - `028` exports its forced-colours projects as data, not prose. Decision 1's fallback, "the three `<engine>-light` projects", already disagrees with `028` and should be deleted.
     - Build step 1 confirms that `022`'s annotations are static. If they are not, a lane-E change is named as a dependency.
     - Build step 1 confirms that listing `playwright.sr.config.ts` works in the `checks` job on `ubuntu-24.04`, where `withGuidepup` is loaded.

3. **Medium. A screen-reader flake on the release run grades "pass" with no record, where `022` Q2 says it blocks the tag** (decision 5, the table's fourth row; decision 15).
   - `022` decision 18 and its answered Q2: on a release run, any screen-reader flake gets a ledger line, "unless the design lead records it as reader timing, with the phrases that show it".
   - That record lives in landing notes, which neither `grade.ts` nor `release.ts` reads. `022`'s own release check reads only job conclusions, and a job whose tests passed on retry concludes `success`.
   - So the tag can carry a "passed on retry" item that `022` says must block. A live region that announces 7 runs in 8 passes.
   - Fix: `release.ts` fails while any cell in `status.json` shows `retried > 0`, unless `scripts/status/` holds a committed, machine-read record for that test, reader, browser and run id. Call it `reader-timing.json`: the phrases, the run id, and the design lead's reason. Test 8 gains the case. Development runs keep "passed on retry".

4. **Medium. The item hash leaves out inputs that change what was tested** (decision 7).
   - Views: `axe.spec.ts` scans each block's views, and `022`'s screen-reader tests open `/view/<path>/`. The view routes are content, not chrome. For example, `src/routes/(view)/view/sign-in/errors/+page.svelte` sets the errors that the error state renders. There are 1,038 lines across `src/routes/(view)/view/` and `src/routes/(shell)/view/` (EXECUTED, `wc`). A change there changes the evidence and leaves the hash equal.
   - Dependencies: the served JSON names packages (`bits-ui` and so on), not versions. A `bun.lock` bump that changes a primitive's keyboard handling leaves every hash equal, so a stale pass deploys from `main`. The release check catches it at the tag, but a deploy between tags does not.
   - Fix:
     - Hash each block's and composition's view routes, through `BLOCK_VIEWS` and `COMPOSITION_VIEWS`, and the example route `src/routes/(example)/example/[item]/[example]/`.
     - Hash the resolved `bun.lock` versions of the item's npm dependency closure.
     - Test 6 gains both cases, plus one more: on a clean tree, the hash computed at prerender equals the hash through `git show HEAD`. `static/r/` is rebuilt before prerender, so the two must agree byte for byte.
     - Consider sharing `025`'s hash inputs, so "stale cost" and "changed status" agree about what counts as a change.

5. **Medium. "Contrast passes" claims more than axe decides** (decisions 1 and 4).
   - axe's `color-contrast` judges text (SC 1.4.3) only. Non-text contrast (1.4.11), such as borders, focus rings, a switch's track or a meter's fill, is covered only where a `contrast`-tagged test exists, as with `primitives.spec.ts`'s 3:1 rows.
   - `inapplicable` counts as a pass. So `separator`, `skeleton` or `spinner`, which have no text, would show "Contrast: Passes" with nothing measured.
   - An `incomplete` result is answered by "a passing test tagged `contrast`" for the item, whether or not that test measures the undecided nodes.
   - The four values are scoped "inside the page's example frames" only for `incomplete`. On every page the glass bar's text is the classic undecided node, so `pass` and `violation` need the same scope.
   - Fix:
     - Name the check for what it does. Either the row reads "Text contrast (axe), and the measured pairs this item names", or the check requires a 1.4.11 measurement for each item in `028`'s set.
     - A check that is `inapplicable` everywhere shows as a not-checked line ("No text to measure"), not a pass.
     - An `incomplete` is answered only by a `contrast` test that names the same selector.
     - All four values are computed over the example region alone.

6. **Medium. Sorting the 285 bullets is judgment, and the guard sees a fraction of it** (decision 10).
   - Evidence (EXECUTED): 285 bullets on 75 pages, as claimed. About 44 carry an app's duty. Most are not imperatives:
     - "An icon-only button needs an `aria-label`";
     - "The image needs alt from the consuming app";
     - "Dark glass over a light image of your own is yours to measure";
     - "An app that binds Tab owes its users…";
     - imperatives the list lacks: "Check the merged string", "hide and show by a class", "move it to `src/routes/+error.svelte`".
   - All of these pass the guard while sitting under "What Kuiper provides". That heading would then be false, which is the defect decision 10 exists to prevent.
   - The list also fails valid "Your part" bullets that `027` writes, such as "check its own" (`027` line 1192), or "remove at once" and "install once" (`026` line 806).
   - Some bullets are neither kind. "Polite only. An error that must interrupt is an error summary" is usage. Decision 10 does not say where those go.
   - Fix:
     - Widen the guard. In `accessibility`: no sentence with "must", "should", "needs … from", "your", "you", "an app that" or "the app", plus a longer imperative list. In `yourPart`: an opening imperative from the same longer list.
     - The sort's commit carries a table in the landing notes: page, bullet, destination, split or not. The change reviewer reads it against the diff.
     - State where usage-only bullets go. I recommend "What Kuiper provides", as statements of behaviour, until `032`.

7. **Medium. "Interactive" is derived twice, by different rules** (decision 3, `keyboard`).
   - `028` decision 13 derives interactive items from source, and counts an item as interactive if one of its `registryDependencies` is. It finds 52 at its landing. Decision 3 derives `KEYBOARD_ITEMS` from an item's own files, with a similar but different list of signals.
   - The two will disagree. Decision 3's fallback, "if `028` names none, `KEYBOARD_ITEMS`", no longer applies, because `028` names a set.
   - The gap between 34 keyboard fixtures and about 52 interactive items is new test-writing that the specification does not size.
   - A reason like "it only wraps a native control the browser handles" (Risks) is a recorded limit. Constitution §4.4 says "every interactive item works by keyboard", proven.
   - Fix:
     - One exported derivation, owned by whichever of `028` and `030` lands first, and imported by the other.
     - `KEYBOARD_EXCLUDED` may only hold items that are not operable at all.
     - The landing notes count the fixtures written.

8. **Medium. Refusing the Workers build is the right lever, but it also blocks registry fixes, and Q2 does not say so** (decision 15; Q2).
   - The same Workers deploy serves `static/r/`, the registry adopters install from (`015` decision 21; `wrangler.jsonc` serves `./build`).
   - An urgent fix to an item's source changes its hash, which gives *changed*, and the publishing build then refuses. The fix reaches neither the site nor the registry until a full matrix run completes (45 minutes or more on first runs, `022` decision 7), the design lead runs `bun run status`, and the owner pushes. Agents never push.
   - A change to `kuiper-theme` changes every hash, and so blocks the whole site.
   - Under Q2's option 1, previews of `release/0.13.0` will almost never deploy after `030` lands. Every landing changes some hash, and a refresh rides with the next landing.
   - The lever is correct, and it is novel. No reference blocks its docs deploy on a status. Carbon sidesteps the question by reading the report shipped inside the package version it installs (READ, `A11yStatus.js` line 18).
   - Fix:
     - State these consequences in decision 15 and in Q2's options. Add the recovery path: revert the item change, or wait one run.
     - Run `publishable()` as its own step at the head of `bun run build`, as `bun scripts/status/publishable.ts` when `WORKERS_CI=1`, not in a page's load. It then fails in seconds, before `vite build`. It does not depend on `prerender.handleHttpError`, which throws today (`vite.config.ts`) but is one edit from returning. It reads `process.env` directly; reading `$env/dynamic/*` during prerender is unsafe in SvelteKit (INFERRED).
     - Note that the dashboard can override `WORKERS_CI` (READ, Cloudflare). The release check stays the real gate.

9. **Medium. The pass line overstates screen-reader evidence; Q4's recommendation should change** (decision 8; Q4).
   - "…and VoiceOver and NVDA" reads as "works with VoiceOver and NVDA". What runs is a set of scripted rules, from L1 to C2, on given examples or views. It runs VoiceOver with Playwright's WebKit and Chromium, not Safari, and NVDA with Chromium and Firefox (`022` decisions 10–12).
   - The Checks table states this properly. The one-line summary cannot.
   - Fix: adopt Q4 option 2, with the run's date: "Accessibility status: passes every check in the full run of {date}." The link to `#accessibility` stays, and the table is the evidence. If the owner keeps option 1, the line drops the engine list and says "with scripted VoiceOver and NVDA checks".

10. **Low. The release rule is sound; the tag sequence around it is not written down** (decision 15, Risks; Q5).
    - Evidence: the rule that only `status.json` and `context/` may differ from *C* is a fixed point. The report cannot name the run of its own commit. The second run, of *C′*, is the only run of the published bytes, because the pages render `status.json`. So the extra push buys real evidence.
    - I found no design that avoids it without publishing untested bytes. Two were considered:
      - accepting *C*'s run for *C′*;
      - deploying from Actions with the run's status.
    - The site reads nothing under `context/` (EXECUTED, grep of `src/` and `scripts/site/`), so excluding it is safe. Unit tests read `context/`, but *C′*'s green run covers that.
    - Fix:
      - Write the sequence: dated changelog, `static/v0.13.0/` snapshot and version, then the push of *C* and its run; then `bun run status`, the commit *C′*, its push and its run; then the release check, then the tag. If *C′*'s run fails, the loop restarts.
      - In Q5 option 1, say the refresh rides in the next landing's push, never in a push of its own except the last. Each push to `release/**` is a full matrix run with eight macOS and Windows jobs.

11. **Low. Faults are attributed to the page's item, and site faults do not block publishing** (decisions 2, 5 and 15).
    - `axe.spec.ts` scans the whole component page. A ledgered violation in the chrome, such as the bar or the nav, makes that page's item show "automated rules fail".
    - A ledgered `site` fault, such as the home page, deploys freely from `main`.
    - Fix:
      - A ledger line on an `axe` test may name `site`, and the grader then counts it toward `site`.
      - `publishable()` also refuses when `site` holds a fault.

12. **Low. The cost note's words are not `025`'s** (decision 13).
    - It says "from the input to the second frame", where `025` decision 14 says "from the click to the second frame". Yet decision 13 says "in its words".
    - Fix: use `025`'s string, or have `costFacts` return the note.

13. **Low, write-ins.**
    - Decision 2: "One check per test" should also forbid a check tag on a `describe`. Tags inherit (EXECUTED), so `@axe` on a `describe` and `about(…, "keyboard")` on a test give two check tags. Criterion 2's wording becomes "exactly one check tag".
    - Decision 6 step 3: `git show <sha>:tests/fault-ledger.ts`, imported from a temporary folder, breaks if the ledger imports a relative module. Either the ledger stays import-free, which a unit test holds, or the script copies `tests/ledger.ts` beside it.
    - Decision 9: add not-checked lines for `028`'s `EXCLUDED` items ("Forced colours are not checked on {title}: {reason}"), as is done for `SR_EXCLUDED` and `KEYBOARD_EXCLUDED`.
    - Decision 12's ban on reader names in page source also forbids a rationale such as "Safari with VoiceOver drops list semantics…". That is acceptable, but say so, so that a builder does not loosen the test.
    - Risks: say that `scripts/bench/depth.ts` is unaffected. Its keyboard element reads only headings and a table whose first header is "Key(s)" (READ, lines 59–72). "Checks" does not match, so row 2 does not move by accident.

## Constitution checks

- **§2.3, a status generated from the tests:** met by decisions 6, 8 and 9, once findings 1 and 5 make the words match the evidence.
- **§2.5, every reported check passes:** met by decision 15's release step. Findings 3 and 11 close two holes.
- **§4.1, source, not a package:** nothing an app installs changes (criterion 21).
- **§4.3, tokens are the one source:** the new markup uses existing classes. The literal lint applies. No finding.
- **§4.4, accessible and proven:** the status turns test results into published evidence. Finding 1 (silent skips) and finding 7 (keyboard exclusions as recorded limits) are §4.4's "a limit to record", and must become findings to fix or stated gaps.
- **§4.5 and §4.6:** no dependency is added. `gh` is a tool already used by `022`.
- **§5:** it lands after `022`, `024`, `025`, `026`, `027` and `028`. The scorecard is re-run (criterion 23).
- **§6:** no commit or push by agents. The owner pushes *C* and *C′*.

## How the references publish status (for the record)

- **Carbon:** a generated table from the Playwright JSON report shipped inside `@carbon/react`. It grades the presence of tags, and a skip shows "partially tested". Screen-reader results come from hand-kept data (READ, `A11yStatus.js`; memo §1.1).
- **Primer:** a person's flag, "Reviewed for accessibility", read from `a11yReviewed` (READ, `status.jsx:86`, `287`). Known issues are for GitHub staff only.
- **GOV.UK:**
  - per page, "Known issues and gaps" in prose (READ, `accordion/index.md:138`);
  - one dated site statement that names JAWS, NVDA, TalkBack and VoiceOver as targets, cites a third-party audit (DAC) and tracks concerns as issues (READ, `accessibility-statement.md`, line 17 and lines 59–98);
  - browser grades A to C and X kept apart from components (READ, `govuk-frontend/docs/contributing/browser-support.md`).
- **Spectrum:** a role, intents, `keyboardIntents` and WCAG criteria as data per component (READ, `button.json:239–248`). No test feeds it.
- **Atlassian:** guidance only. No status (memo §1.5, fetched there).
- **What `030` adds:** a status tied to a pass, with its engines named. No reference does this. It is only credible if the skips are as visible as Carbon's (finding 1).

## Byte cost and `024`

Re-measured at about 2.6 to 2.7 kB gzipped per component page, against a stated ≤ 5 kB. `024` decision 9's headroom of each template's heaviest page is 39 to 45, 57 to 63 and 63 to 69 kB (INFERRED there, settled at its sweep). So the stated cost fits with more than 30 kB to spare on every template. Blocks and compositions are `component.svelte` pages in the `component` template (`024` decision 1), so the table covers them. No finding.

## The scorecard prediction

- **Row 15 → 4** is right if `025` lands as specified. Under its rubric (*cost* memo §7) the score is the count of four criteria:
  - (b) from `025`'s budgets;
  - (d) from its 1,000-row `table` case held by a budget (`025` Q4, answered "now");
  - (a) and (c) from this specification's Cost term and `#cost`.
  - `025`'s own review stood at "does not land yet" (R1). The prediction is conditional on it, and the table should say so.
- **Row 3, (d) ✓, count 5, score 2 held:** right. (d) is "a per-component status, generated from tests or reviews".
- **Rows 2 and 13 held:** right. Button keeps "Screen readers are not checked on Button: …", and Dialog keeps "JAWS is not tested.". Both match `depth.ts`'s evidence pattern (lines 105–113).

## The open questions

- **Q1 (sort now):** I agree with option 1, but only with finding 6's wider guard and the per-bullet table. A "What Kuiper provides" heading over an unsorted list would be false, and option 2's neutral "Notes" heading defers the work without making it smaller.
- **Q2 (which builds refuse):** option 1 is the literal reading of the owner's rule, and I agree with it. The question must state finding 8's consequences first: previews of the release branch rarely deploy, and an item hotfix waits one full run before the registry gets it. If the owner uses previews to review landings, option 2 is defensible. Its previews say "Not ready to publish" in words, and the release check stays the gate.
- **Q3 (cost wording):** I agree with option 1. One term keeps the facts row's single link and its wrap behaviour. The checkpoint's 390-px view settles the wrap.
- **Q4 (pass line):** change the recommendation to option 2, with the run date (finding 9).
- **Q5 (refresh):** I agree with option 1, clarified as in finding 10: the refresh rides in the next landing's push.

## Verdict

Approve with changes. Not fit to build yet: findings 1 to 9 stand. Finding 1 is a wrong statement the pages would publish. Findings 2 to 9 are guarantees without evidence, or consequences the owner has not been shown. Findings 10 to 13 are write-ins.

## Disposition

Pending the author's answers.

## Re-review, 2026-11-15

- **Reviewed:** the revised specification (900 lines; its status is "Ready for owner answers"), its answer table under "Review", the memo's dated §5, and `028` as it now stands (423 lines, especially decisions 1, 13, 13a and 15).
- **Re-ran:** nothing new was executed. I read the revised `030`, `028` and the memo. I grepped `tests/e2e/` for skip calls in the files decision 2 tags, and read the three route-group layouts. Nothing in the repository was written except this section.
  - `tests/e2e/forced-colors.spec.ts:11` holds `test.skip(info.project.name !== "light", "light project only")` in a `beforeEach` (EXECUTED, grep).
  - `028` decision 13a now creates `tests/status/interactive.ts` with four exports (READ):
    - `interactiveItems`, 52 items;
    - `FORCED_CHECKED`, 54 items;
    - `FORCED_PROJECTS = { draw: [chromium-light, chromium-dark, firefox-light], compute: [those and webkit-light] }`;
    - `FORCED_WEBKIT_GAP`, marked `gap: "no-user"`.

### The thirteen findings, as answered

1. **Skips beside a pass: closed, with R1 and R5 below.**
   - A `no-user` skip is now a declared gap with its `shown` line. Any other skip of a tagged test is a fault.
   - The line names no engine. "Where" names only the configurations where every declared test ran.
   - `028`'s WebKit sentence matches `030`'s word for word.
2. **Coverage proof: closed for what it now claims, with R1 and R8.**
   - The claim is narrowed: declared coverage fails before a run, and anything else fails at grading.
   - `ENGINE_ONLY` declarations are subtracted from the listed cells.
   - A source check forbids any other skip call.
   - Screen-reader cells cross the listing with `matrix.yml`'s pairs through `scripts/ci/workflow.ts`. That fits `022` decision 19, which already expands the job matrices there.
3. **Retried screen-reader cells: mostly closed; R3 and R4 stand.**
   - `reader-timing.json` is a fair machine-read form of `022` Q2 as the owner answered it: "unless the design lead records it as reader timing". It holds the phrases, the reason and the run id, and blocks only the tag.
   - It is checked against the wrong run, though (R3).
4. **The hash: closed.** Three write-ins remain in R9.
   - The hash now covers `bun.lock` versions, view routes and the example route.
   - The unit test compares the working-tree hash with the `git show HEAD` hash.
   - The hash reuses `025`'s closure reader where `025` exports it.
5. **Contrast: closed, except R2.**
   - The check is now "Text contrast", scoped to the example region for all four values.
   - An undecided node is answered only by a test whose `measures` annotation names the same selector.
   - Unmeasured non-text contrast gets a not-checked line, and a roadmap finding records it.
   - The aggregation rule, however, turns "no text" into a failure (R2).
6. **The sort: closed, except R6.**
   - The guard is widened, and `026`'s and `027`'s musts run as fixtures.
   - Usage-only bullets now have a stated place.
   - The landing notes will hold a per-bullet table.
7. **One interactive set: closed.**
   - `028` decision 13a owns `tests/status/interactive.ts`, and `030` imports it.
   - `KEYBOARD_EXCLUDED` is gone.
   - The keyboard gap is sized and written in this specification, with test 12 seen failing first.
   - `030`'s fallback ("this build moves it") is now dead text, since `028` creates the module. It may stay.
8. **Publishing: closed.**
   - `publishable.ts` runs after `build:registry` and before `vite build`, and reads `process.env`.
   - Q2 states the consequences fairly: registry hotfixes wait, a theme change holds back the site, previews rarely deploy, the recovery path, and the dashboard override.
   - One wording write-in is in R9.
9. **The status line: closed.**
   - It is short and dated: "passes every check in the full run of {date}".
   - It names no engine or reader.
   - Q4's second option now says "with scripted VoiceOver and NVDA checks".
10. **The tag sequence: closed.**
    - It is written out: *C*, *R(C)*, status, *C′*, *R(C′)*, the check, the tag, with a restart.
    - It records the two rejected designs.
    - Q5's refresh rides in the next landing's push.
    - R3 and R4 are about this sequence's edges.
11. **Site faults: closed.**
    - The item's `axe` cell reads `axe-region`.
    - A ledger line may carry `scope: "site"`.
    - `publishable.ts` and `release.ts` refuse a `site` fault.
12. **Cost words: closed.** The note is `025`'s, verbatim, or its export.
13. **Write-ins: closed, except R7.** It concerns the ledger's import rule as applied to `ENGINE_ONLY`.

### Remaining findings

**R1. Medium. Neither `onlyIn` nor `notIn` can express a project skip or a scheme skip, so the source check forbids skips that `028` and `018` need** (`030` decision 3, "Every skip is declared as data"; `028` decisions 13a and 15).

- `onlyIn` and `notIn` each take one engine. `FORCED_PROJECTS` needs skips that no engine argument can give:
  - the draw test must not run in `firefox-dark`, `webkit-dark` or `webkit-light`;
  - the compute test must not run in `firefox-dark` or `webkit-dark`.
- For `webkit-light`, `notIn("webkit")` covers the draw test. But the compute test runs in `webkit-light`, so nothing in the engine vocabulary skips it in `webkit-dark` alone.
- `028` decision 13a says `items.spec.ts` "reads `FORCED_PROJECTS` to decide where each generated test runs", but it names no mechanism. `playwright.config.ts` is not changed, so that mechanism can only be a run-time skip keyed on the project.
- Likewise, `forced-colors.spec.ts:11`'s "light schemes only" skip (`022` decision 2) is a bare `test.skip` in a tagged file, since its site tests take `site`.
- Failure: as written, `030`'s source check fails `items.spec.ts` and `forced-colors.spec.ts` on their first run. If the builder instead exempts them by hand, the listing again shows those tests as expected passes in cells where they never run, which is the original finding 2.
- Fix:
  - Add one declared helper beside `onlyIn` and `notIn`, for example `onlyProjects(projects, reason)`, listed in `ENGINE_ONLY` with a `projects` field. Use it in both specs.
  - `items.spec.ts` calls `onlyProjects(FORCED_PROJECTS.draw, …)` and `onlyProjects(FORCED_PROJECTS.compute, …)`.
  - `forced-colors.spec.ts` calls `onlyProjects` with the three light projects.
  - The coverage test subtracts these entries like the others. The `notIn("webkit")` entries keep their `no-user` mark only where the skipped project is a required cell, which is `webkit-light`'s draw test.
  - `028`'s text should name the helper. The change is one line there.

**R2. Medium. A check that is wholly a declared gap fails the item, so every text-free item is blocked from publishing** (decision 5, "Aggregation"; decision 4, "A `contrast` cell … is not a pass when it is `none` everywhere").

- An item's check "passes when every required cell either passes or is a declared gap, **and at least one cell passes**".
- A `contrast` check that is `none` in all six cells has no passing cell. For `separator`, `skeleton`, `spinner` or `liquid-glass`, the contrast check would therefore fail, the item would show "1 of 4 checks fail", `publishable.ts` would refuse, and so would the release check.
- This contradicts decision 9, which says such an item shows only the not-checked line "Text contrast is not checked on {title}: its examples hold no text."
- Fix:
  - A check whose every required cell is a declared gap is **not applicable**. It is left out of `{m}` and out of the pass test, and is shown only as its not-checked lines.
  - The item passes when every applicable required check passes. At least one check must be applicable, and `axe` always is.
  - Test 4 gains the case: an item with `contrast` `none` everywhere, and every other check passing, gives *pass* plus the "no text" line.

**R3. Medium. The tagged commit's own run, *R(C′)*, is the release run under `022`, and its screen-reader retries are never checked** (decision 15, condition 6, and the tag sequence).

- `022` decision 18 defines a release run as "a push to `release/**` whose commit is to be tagged". That is *C′*, not *C*.
- `release.ts` reads retries only from `status.json`, which is *R(C)*.
- `022`'s own step requires *R(C′)* to be green. Its screen-reader jobs may pass on a retry and still conclude `success`.
- So the run of the tagged bytes can carry an unrecorded flake, which is exactly what the owner's Q2 answer blocks.
- A record for *R(C′)* cannot be committed into *C′*: that would make a new commit, which needs its own run.
- Fix:
  - `release.ts` also downloads *R(C′)*'s `matrix-report` (it lives 14 days, as for *R(C)*) and requires no retried screen-reader test in it.
  - If *R(C′)* has one, the design lead either ledgers it, so the tag waits, or records reader timing in `reader-timing.json`. Either way the sequence restarts at step 1 with the record in the new *C*.
  - Test 8 gains the case. The tag sequence's step 5 says so.

**R4. Low. `reader-timing.json` is outside the paths condition 2 allows** (decision 15).

- Step 3 says *C′* "may carry `reader-timing.json` and `context/` notes". Condition 2 allows only `scripts/status/status.json` and `context/`.
- So a *C′* that carries a record fails the release check.
- Fix: allow `scripts/status/reader-timing.json` in condition 2 and in test 8's diff case. The site does not read it.

**R5. Low. Nothing checks that a `no-user` gap was ruled** (decision 5, "Declared gaps").

- "Only a design lead's ruling … may set it" is a rule with no test behind it.
- A builder facing `022`'s clipboard faults in `keyboard.spec.ts` could mark them `gap: "no-user"`, and the page would show a polite line where the strict rule calls for a fault.
- Fix:
  - An `ENGINE_ONLY` entry with `gap` must carry `ruling`, a path to a specification decision or its landing notes.
  - `fault-ledger.test.ts` holds a closed list of permitted gaps. Today that list holds one, `FORCED_WEBKIT_GAP`.
  - So adding a gap changes a test, and review sees it.

**R6. Low. The widened guard does not catch the example the specification says it fails on** (decision 10; test 9).

- The rule flags "needs" only when "from" follows within five words.
- Test 9 says the guard "fails today on … 'needs an `aria-label`'", and on "the 44 bullets the review found". Button's "An icon-only button needs an `aria-label`" has no "from", so it passes the guard.
- The review's 44 came from a pattern that included bare "needs".
- Fix: either flag any "needs" in `accessibility`, with a short reviewed allowlist for sentences whose subject is the item ("The trigger needs no label of its own…"), or correct test 9's claim to what the rule catches.

**R7. Low. `ENGINE_ONLY` cannot be import-free where it now lives** (decision 6, step 3).

- `ENGINE_ONLY` is read at the run's commit by copying it to a temporary folder, "under the same rule": nothing but type imports.
- It lives in `tests/e2e/engines.ts` beside `onlyIn` and `notIn`, which import `test` to skip.
- Fix: move the data to its own import-free file, for example `tests/e2e/engine-only.ts`, which `engines.ts` imports. The unit test then holds that file to the rule.

**R8. Low. How a merged record names its reader is unstated.**

- The screen-reader config's projects are browsers. So a record in `report.json` says `webkit`, not `voiceover-webkit`, unless `022` adds the reader.
- `022` decision 14 says records carry "scheme or reader" but does not say how.
- The probe showed that a config-level `tag` reaches every test. A `tag` set from the job's reader would carry it into the blobs.
- Fix: decision 5 names the field it reads, and build step 1 confirms it in `022`'s `report.json`.

**R9. Low, write-ins.**

- **Q2 and decision 15, "up to 45 minutes on first runs".** 45 minutes is a shard's timeout, not the run's wall time, which also waits for the macOS and Windows jobs and for queueing past 20 jobs. Say "one full run (no fixed bound; first-run shards time out at 45 minutes), then the refresh and your push".
- **Decision 7, dependency versions.** Hash the `bun.lock` entries of the packages' transitive closure, not only the names the served JSON lists. A `@floating-ui` bump under `bits-ui` changes behaviour too.
- **Decision 7, route-group layouts.** Add the `(view)`, `(shell)` and `(example)` `+layout.svelte` files. They are thin today (19, 15 and 16 lines), but they wrap every view the tests open.
- **Decision 7, the regenerated registry.** The HEAD-equality test proves committed equals HEAD. It does not prove that `build:registry` regenerates the committed `static/r/` byte for byte, which is what `publishable.ts` hashes on Workers. A mismatch fails safe, as *changed*, but it blocks the deploy. Compare a fresh `build:registry` output with the committed files in the same test, or hash the item sources instead.
- **Decision 4, nodes inside iframes.** axe reports such a node's target as an array, frame first. Classify the node by its outermost frame element's `closest('[data-slot="frame-stage"]')`.

### Re-review verdict

Approve with changes. Not fit to build yet: R1 to R3 stand.

- R1 is a skip the specifications need but cannot declare.
- R2 is an aggregation rule that would block every text-free item.
- R3 leaves the tagged commit's own run unchecked for screen-reader retries.
- R4 to R9 are write-ins, given with their fixes.
- The thirteen original findings are answered.
