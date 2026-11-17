# Review of 019b — the error summary's messages are read once

- **Date:** 2026-11-17
- **Status:** dispositioned; lands
- **Reviewer:** a reviewer; not the author of the specification, its research, its spec review or the build
- **Reviewed:** the uncommitted diff in the worktree `lane-i-019b`, branch `lane-i-019b`, at `6482736` (`release/0.13.0` at `7ec5488`, plus `020d`, unpushed). Eleven changed files, nothing untracked. Against [019b](../specifications/019b-the-error-summarys-messages-are-read-once.md) and its landing notes, [the memo](../research/2026-11-17-the-error-summary-list-double-read.md), [its spec review](019b-the-error-summarys-messages-are-read-once-spec-2026-11-17.md) and *run 7's memo* (`context/research/2026-11-17-the-seventh-matrix-run.md`, untracked in the main checkout).
- **Re-ran:** every e2e and dry run on a fresh `bun run build` (21 s), served with `E2E_PREBUILT=1` on port 4519. Probes ran on `vite preview` on port 4520, from scratch scripts outside the repository. Playwright 1.64.1; Chromium and WebKit from `/opt/pw-browsers`. Firefox is not installed.
  - **Before the first probe,** the SHA-256 of `git diff` was `0109017a…` and of `git status --porcelain` `4d80e61e…`. The eleven changed files went into a scratch archive.
  - **A fresh build** left both hashes unchanged, so `static/r/` and `static/v0.13.0/r/` are this source's.
  - **The base:** the item set back to `HEAD`'s, rebuilt, its tests and probes run. Then the changelog and the page set back too, for the unit checks. All restored from the archive, rebuilt; both hashes as before.
  - **Patches 4 and 7b:** each applied with `git apply`, built, probed, and reversed with `git apply -R`. After each, the item's blob is `dc64c48` again. The patched builds had rewritten `error-summary.json` in `static/`; a rebuild put both hashes back.
  - **`bun run cost`:** `--sizes-only` once; `--only error-summary` six times, four of them interleaved with the base item. `report.json` was restored from the archive after each, and compared byte for byte.
  - **Not run:** Firefox; any reader; the full e2e suite; the scorecard (criterion 14, after landing).
  - **After the last run,** both hashes are again `0109017a…` and `4d80e61e…`. `build/` and `.svelte-kit/` hold a build of the change. Playwright's ignored `test-results/` was rewritten by the runs.

## Seen failing

The item set back to `HEAD`'s (the list), rebuilt, `error-summary.spec.ts` in `chromium-light` and `webkit-light`: **48 passed, 5 failed, 1 skipped.** EXECUTED.

| Check | Base | Built |
| --- | --- | --- |
| 1. no list | fails, both engines: `ul` count 1, wanted 0 | passes |
| 2. the tree (`019` criterion 1's snapshot) | fails, both engines: received `list > listitem > link` | passes |
| 3. no wrapper, CDP | fails (Chromium): `"parent": "listitem"` for all three | passes; skipped in WebKit, as listed |
| 4. each link's width, at 1440 and 390 | passes (a guard): 128, 198, 200 px in Chromium; 128.14, 197.09, 198.11 in WebKit; box 322 and 280 | passes, the same figures |
| 5. the raw HTML (`019`'s test) | passes (a guard) | passes |
| 8. the changelog bullet | fails | passes |
| 9. the page sentence; the header comment | both fail | both pass |

This is what the landing notes record. Criteria 8 and 9 were seen with the changelog and the page set back as well (`bun test … -t 019b`: 0 pass, 3 fail).

**The guards' mutations,** re-made in the live page with no repository change. EXECUTED:
- `justify-items: stretch` on the links box: every link is 322 px, in both engines. Criterion 4 would fail.
- A `<p>` around each link: Chromium's nearest kept ancestor is `paragraph` for all three. Criterion 3 would fail.

## Acceptance criteria against evidence

1. **No list** — met. EXECUTED: passes on the build, fails on the base. READ: the test also checks the box's children are exactly three `a`, in the errors' order.
2. **The tree** — met. EXECUTED, as above.
3. **No wrapper, in Chromium's tree** — met. EXECUTED: the test, and my own CDP walk. Each link has two ignored nodes and then the `alert` above it. On the base, `listitem`. READ: the links are found by DOM node inside the keyboard fixture.
4. **The look** — met. EXECUTED: `019` criterion 12 passes in both engines. Each link's width equals its `Range` to 0.02 px. See question 2 for the screenshots.
5. **The raw HTML** — met. EXECUTED: the test passes. A parse of the prerendered page finds 3 specimens, 0 `ul`, 0 `li`, 2 links boxes. The one `role` in each is the icon's `role="img"`, under `aria-hidden`, which the test does not count.
6. **axe** — met. EXECUTED: 0 violations; see question 3.
7. **Nothing else moves** — met in what was run. EXECUTED: `019`'s and `022t`'s tests in `error-summary.spec.ts`; `blocks.spec.ts` but A3 (finding 1); the `primitives`, `theme` and `viewer` tests for the item and the three blocks, 68 of 68; `keyboard.spec.ts`'s 4 stops; `022t` criterion 1's 3 links.
8. **The changelog** — met. EXECUTED: the new unit check. READ: decision 6's words, plus `020d`'s pointer. See question 6 and finding 4.
9. **The registry and the docs** — met. EXECUTED: `registry.test.ts` 124, `mutations.test.ts` 29, `thumbnails.test.ts` 10, and the whole unit suite (see the gate).
10. **The dry run** — met. EXECUTED: 30 of 30.
11. **The next CI speech run** — open, as the specification says. READ: the landing notes' run-7 table matches *run 7's memo* §3.3 cell for cell, phrases included. See finding 3.
12. **The gates** — met. See question 9. Cost: finding 5.
13. **The checkpoint** — the design lead's. Not this review's.
14. **The scorecard** — open; it runs after landing. Row 3 (h), screen-reader testing recorded, moves only with a green speech run (criterion 11). This review moves no row.

## The questions, answered

**1. Do the tests fail on the old item?** Yes, as above. EXECUTED.

**2. The look.** Unchanged, to the byte. EXECUTED.
- **100 screenshot pairs, base against change, byte-identical.** Chromium and WebKit; light and dark; 1440 × 900, 390 × 844 and 320 × 700. At each: the example view after an empty submit, the summary alone, each of the three links focused, and the component page's three specimens. At 320, the summary with long messages too.
  - The example view takes its theme from `?theme=`, not from the system. A first pass without it shot light twice. The pairs above were shot again with it, and the dark ones are dark.
- **The focus ring:** `solid 2px`, offset 2 px, `rgb(45, 72, 212)` in light and `rgb(147, 176, 255)` in dark. Each ring is its link's own width: 128, 198 and 200 px in Chromium; 128.14, 197.09 and 198.11 in WebKit. The same on the base.
- **The geometry:** at 1440 the summary is 384 × 135.59 px, its links 24 px tall, their tops 28 px apart. Identical on the base.
- **A long, unbreakable message at 320:** the same on the base and the change, in both engines. A message with spaces, or with hyphens, wraps inside the box. An unbreakable token does not: the summary grows to 521 px in Chromium and 513 in WebKit, and the page scrolls sideways (finding 2).

**3. Accessibility.** EXECUTED.
- **axe:** `019`'s six tags, after the empty submit, on the example and on the component page. At 1440 and 390, light and dark, both engines: 0 violations, base and change. `axe.spec.ts` and `keyboard.spec.ts` for the item: 24 of 24, in `chromium-light`, `chromium-dark`, `webkit-light` and `webkit-dark`. That is axe at 360, 768 and 1280, `/view/error-summary-attempt/` at 1280, the 4 stops, and Enter. `error-summary.spec.ts` whole in both dark projects: 53 passed, 1 skipped (criterion 3 in WebKit).
- **`019`'s raw-HTML check holds.** Criterion 5, above.
- **Chromium's tree:** each link's nearest kept ancestor is the `alert`. Criterion 3, above.
- **The keyboard, all five blocks, both engines.** From the focused summary, Tab reaches each link in order, then the first field. Enter on each focuses its control, and no hash joins the address. The same as the base.
  - The example: Project name, Owner email, then the radio "Only me" (`#visibility-me`).
  - `sign-in-form`: email, then password. `sign-up-form`: email, then password.
  - `sign-up-verify`, after a wrong code: its one link focuses `#sign-up-code`.
  - `settings-form`, with the name emptied: its one link focuses `#settings-name`.
  - `settings-delete` has a message and no links. Its summary holds no links box and no `ul`; Tab goes on to "Delete account".

**4. `022t`'s keyed re-render.** It still swaps the content node, the links box with it. EXECUTED, both engines, on the example: the second, unchanged submit keeps the root. It disconnects the old content node, the old links box and the old links. The new links box is inside the new content node, and holds 3 links. `022t`'s tests 1, 2, 3 and 6 pass.

**5. The mutation patches.** All apply, and 4 and 7b still do what their entries expect. EXECUTED.
- `git apply --check`: each of the 11 alone, and each set whole, exits 0 with stderr empty. `mutations.test.ts`: 29 pass. `expected.json` and `notProvable` are untouched (READ).
- The patches still name the old blob, `b634cd4`, in their `index` lines, and apply by context, one line lower. `matrix.yml` runs plain `git apply` (READ), which does not read that line. Nothing to do.
- **Patch 4,** built, in both engines: no `role="alert"` anywhere, on the example's first and second submits, and on `sign-in`, `sign-up` and `settings`. The root is focused and the links box is there. So all twenty entries' L1 has its cause: silence.
- **Patch 7b,** built, in both engines: the root carries `role="alert"` and takes focus; the content has no role; there is one alert. That is the alert on the focused root, which is what its twenty L3 entries rely on. With the list gone, the double can only come from that.

**6. The changelog bullet.** Correct as an interface change, and it fits `020d`. READ, and EXECUTED by the unit suite.
- **An interface change:** yes. The rendered elements an app's class or test can target change (constitution §6). The bullet says so, and says what to target now.
- **The migration note** names `[&_ul]`, `[&_li]`, `getByRole("list")` and `"listitem"`, and the new `[data-slot=error-summary-links]`. That is right for what it covers. It does not cover an app's own stylesheet rule, or a test locating `ul` or `li` by CSS (finding 4).
- **`020d`'s split:** the bullet is in the first part, the changes made for 0.13.0 itself. It sits directly after `022t`'s blocks bullet, as decision 6 asks.
- **Test 16:** the bullet ends with " See also `error-summary` under "Also since 0.11.0", below." Test 16 requires that on every first-part `error-summary` bullet, so the builder was right to add it. Test 16's last check still finds `022t`'s bullet first, with "nothing to change for it". `never-released.test.ts` (the guard), 18, and `changelog-page.test.ts`, 10, pass.
- The upgrade guide names no `error-summary` change and does not claim to list every interface change (READ), so decision 6's "no section" holds.

**7. The A3 failure.** Not this change's. The cause is confirmed, and it is a real latent defect (finding 1). EXECUTED and READ.
- `build/_app/version.json` reads `"6482736"`. `vite.config.ts` names the version `git rev-parse --short HEAD`. A3 renders the registry's own `blocks/app-shell/+layout.svelte`, whose footer reads `/^\d+$/.test(version) ? undefined : version`. So no `dd code`: "Expected: 1, Received: 0", in both engines.
- **With a letter, it passes.** A rebuild with `WORKERS_CI_COMMIT_SHA=6482a36…` gives `"6482a36"`, and A3 passes in both engines, 2 of 2.
- **The odds:** (10/16)^7 = 3.7 % of commits, for a 7-character hash. In this repository, 11 of 234 commits have all-digit short hashes, 4.7 %. So the INFERRED "about 4 %" holds.
- **Where it reaches:** the same test is in the site's footer, in `app-shell-view.svelte`, and in two shipped blocks, `app-shell` and `product-home`. The app-shell page gives apps the same `--short HEAD` snippet to copy. An app that follows it loses its footer's commit and built rows on about one build in 27.

**8. The ledgers.** All fresh. EXECUTED.
- `static/`: only `error-summary.json`, in `static/r/styles/maia/` and `static/v0.13.0/r/styles/maia/`. `registry.json` and the blocks' files do not change.
- `bun run cost --sizes-only`: "every figure is fresh", and `report.json` byte for byte the builder's. Against `HEAD`, five entries move: `error-summary`, `sign-in`, `sign-up`, `settings`, and the catalogue. The builder calls it `_catalogue`; its key in `report.json` is `catalogue`. `error-summary`: JS 11,872 → 11,875 B against 12,900; CSS 891 → 906 B against 1,900.
- `bun run cost --only error-summary`: exit 0 each time, every run noisy, the hydrate figure not held (finding 5). `report.json` restored, `cmp` clean.
- `bun scripts/site/thumbnails.ts --hash-only`: the manifest byte for byte the builder's. Four hashes move: `error-summary`, `sign-in`, `sign-up` and `settings`. No picture changed (question 2).

**9. The gate.** Green, but for one timing test outside this change. EXECUTED.
- `bun run check`: 2,436 files, 0 errors, 0 warnings.
- `bun run lint`: clean.
- `bun scripts/lint-literals.ts`: 0 literals in item files, 1 allowance (`liquid-glass`).
- `bun test ./tests/unit`: **1,962 pass, 1 fail**, across 69 files. The failure is `highlight-session.test.ts`'s streaming budget (4 ms per chunk, p95). Alone, it passed 3 runs of 3, best 3.79, 3.92 and 3.72 ms. This change does not touch the highlighter (finding 6).
- `bun scripts/site/release-check.ts --before-ci`: exit 0, its four skips as `--before-ci` gives them.
- `error-summary.spec.ts` and `blocks.spec.ts`, `chromium-light` and `webkit-light`: **167 passed, 1 skipped** (criterion 3 in WebKit), **2 failed** (A3, both engines; finding 1).
- The dry runs, `SR_DRY=1`, `chromium` and `webkit`: `error-summary`, `sign-in`, `sign-up` and `settings`: **30 of 30.**

**The deviations.** Each is sound.
- **`engine-only.ts`:** `022` decision 3 allows a one-engine test only through `onlyIn` with an entry, so the entry is required. Its title and reason match the test's. `engine-only.test.ts`: 12 pass.
- **Criterion 4's `ul` fallback:** needed for the guard's base run. Once this lands it is dead code (finding 7).
- **The fifth cost entry:** the catalogue holds every item, so it is size-stale whenever one changes. Right to rebuild it.

## Findings, most severe first

1. **Low, outside this change. An all-digit short hash hides the footer's commit, in the site and in apps.**
   - **Evidence:** question 7. A3 fails on any build of `6482736`, and passes on the same tree under a lettered name. Five places read `/^\d+$/` as "no commit". The app-shell page publishes a snippet that names the version `git rev-parse --short HEAD`. About 4 % of commits trip it.
   - **Why now:** `020d`'s own commit is `6482736`. INFERRED: pushed alone, its `matrix` run fails A3 in every engine project, for no fault in it. Pushed with this change's commit on top, CI builds that commit instead.
   - **Fix:** not in `019b`. In the landing notes, record that A3 fails on `6482736` for its hash. For the design lead, a question:
     - **(a) A small change (recommended):** where the name is made. The site's `vite.config.ts`, and the same lines in the app-shell page's snippet, lengthen an all-digit short hash until it holds a letter (`git rev-parse --short=N`), the full hash at worst. The five readers stay as they are. No interface change. Its check, A3 on this commit, is seen failing today.
     - (b) Change the readers to treat only SvelteKit's 13-digit timestamp as "no commit". That edits two shipped blocks, so it needs a specification.
     - (c) Leave it, and push no lone commit with an all-digit hash.
2. **Low, outside this change. An unbreakable message overflows the summary at 320 px.**
   - **Evidence:** question 2. With one message made of a single 64-character token, the summary is 521 px wide in Chromium and 513 in WebKit. The page scrolls sideways: `scrollWidth` 545 and 537 against 320. That fails WCAG 1.4.10, Reflow. It is byte-identical on the base. The spec review's "the page does not scroll sideways" was measured with a hyphenated token, which breaks at its hyphens.
   - **Fix:** not in `019b`. A small change on `error-summary`: `wrap-anywhere` on each link. EXECUTED in the live page: with `overflow-wrap: anywhere` on the links, the page is 320 px wide again in both engines, the summary 272 and the link 210. The message paragraph and the title may need the same (INFERRED).
3. **Low. The landing notes narrow decision 9's record without a ruling.**
   - **Evidence:** decision 9 says the first `main` and `double-read` dispatches after landing record patches 4 and 7b under NVDA with Firefox, VO chr **and VO wk**. "Waiting on others" now names only the first two. Its reason is good: *run 7's memo* §3.3 shows the witness passing unpatched under VO wk already (INFERRED there). But it changes what the specification asks, and the builder made it.
   - **Fix:** the design lead records it in the landing notes as a ruling, citing *run 7's memo* §3.3. Or keep VO wk in the record: the dispatch gives its result anyway.
4. **Low. The migration note misses two ways an app reaches the list.**
   - **Evidence:** the bullet covers "a class passed to the summary" and role queries. An app's own stylesheet can target the list (`[data-slot=error-summary] li`), and a test can find it by CSS (`summary.locator("li")`). Both break too.
   - **Fix:** in the bullet and decision 6's copy: "A class passed to the summary, or a rule of your own, that targeted its list (`ul`, `li`, `[&_ul]`, `[&_li]`) must now target `[data-slot=error-summary-links]` or its links. A test that found the errors by `ul`, `li`, `getByRole("list")` or `getByRole("listitem")` should find them as links." `registry.test.ts`'s check reads the bullet's opening and three names, so it still passes.
5. **Note. The hydrate figure cannot be held on this machine.**
   - **Evidence:** six runs of `bun run cost --only error-summary`, every one noisy: the floor was 202 to 217 ms against 128 + 15 %. The change's hydrate figures were 54.1, 74.6, 46.7 and 51.4 ms; the base's, interleaved, 39.3 and 46.1. The budget is 53, and each spread runs from about 11 to 90 ms. The click stayed between 38.6 and 40.2 ms against 59. The tool marks the hydrate figure "not held" and exits 0.
   - **Why it is not this change:** INFERRED. The summary loses four elements and gains 3 B of JS. Nothing in it runs at hydration that did not before. The gap is inside the noise.
   - **Fix:** the landing notes record these figures as criterion 12's run, not held. The tag's cost run on the release machine (025 Q3) holds or clears it.
6. **Note. One unit test failed once, outside this change.** `highlight-session.test.ts`'s streaming p95, in the full suite; 3 of 3 alone, best 3.72 to 3.92 ms against 4. The landing notes say 1,963 pass, 0 fail. Record both: the builder's run, and this one.
7. **Note. Criterion 4's `ul` fallback is dead once this lands.** It lets a return to the `ul` pass criterion 4, though criterion 1 would still catch it. **Fix:** at landing, drop `?? a.closest("ul")` and its comment, so the guard reads the links box alone. Or keep it, and record why.

## Constitution checks

- **§4.1, source, not a package:** met. READ.
- **§4.3, tokens are the one source:** met. One class is added, `justify-items-start`, a layout keyword. EXECUTED: `lint-literals`.
- **§4.4, accessible and proven:** partly, as the specification plans.
  - Chromium and Linux WebKit were run, light and dark, at three sizes.
  - Firefox was not; CI runs it.
  - The speech outcome waits on criterion 11.
  - The 320 px overflow is a finding to fix, not a limit to record (finding 2). It predates this change.
- **§4.5 and §4.6:** met. No dependency changes. READ.
- **§5:**
  - Research, a spec review and a re-check came before the build.
  - Each new check was seen failing on the base, and each guard under its mutation (EXECUTED).
  - The reviewer wrote neither the specification nor the build.
  - The scorecard re-run is criterion 14, after landing.
- **§6:**
  - Nothing was committed or pushed.
  - No prior art was copied. READ: the markup is the memo's option 7, its own.
  - The interface change is in the changelog, with a migration note (finding 4 widens it).

## Verdict

**Lands, once findings 3 and 4 are answered.** The change does what the specification says, and nothing else moves. Each new check fails on the old item. The look is byte-identical. The keyboard and `022t`'s swap are unchanged.

Findings 3 and 4 are a ruling in the landing notes and a sentence in the changelog. Findings 5 to 7 are records for the landing notes. Findings 1 and 2 predate this change. Each is a question for its own small change, and neither holds this one back.

## Disposition

By the design lead, 2026-11-17. Findings 3 and 4 written in (the spec's landing notes, the changelog bullet and decision 6's copy). Findings 1 and 2 queued as small changes. Notes 5 and 6 recorded in the landing notes; note 7 deferred to the next change to this item. **Closing verdict: lands.**

