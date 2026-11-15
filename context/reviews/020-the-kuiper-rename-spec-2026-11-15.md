# Review of 020 — The Kuiper rename

Reviews [`specifications/020-the-kuiper-rename.md`](../specifications/020-the-kuiper-rename.md).

- **Date:** 2026-11-15
- **Status:** in review; does not land yet
- **Reviewer:** a reviewer; not the author
- **Reviewed:** the specification as drafted, 2026-11-15 (428 lines). I checked it against these:
  - the constitution, `AGENTS.md`, and `roadmap.md` (row `020`, §3, §4);
  - the memo `research/2026-11-15-renames-and-aliases.md`;
  - the tree on `release/0.12.0` at `beeb67e`, plus the uncommitted `019a` work.

  In the tree I read:
  - `node_modules/shadcn-svelte` 1.7.1, `dist/index.mjs`: the dependency resolver, the CSS merge and the rule merge;
  - `node_modules/tailwindcss` 4.3.3, `dist/lib.js`: the optimiser that prunes keyframes;
  - `node_modules/@sveltejs/kit/src/exports/vite/preview/index.js`;
  - `wrangler.jsonc`, `vite.config.ts`, `static/_headers`, `playwright.config.ts`, `scripts/build-registry.ts` and `scripts/build-tokens.ts`;
  - `theme.svelte.ts`, `theme-script.svelte`, `field-context.svelte.ts` and the eight field readers;
  - `registry.json`, `static/r/styles/maia/index.json`, and `static/v0.11.0/r/styles/maia/pluto-theme.json`;
  - `tests/e2e/theme.spec.ts`, `tests/unit/generated.test.ts`, `tests/unit/registry-comments.test.ts`, the smoke harness, and `scripts/bench/pluto.ts`;
  - Cloudflare's docs, "Workers static assets: Redirects", "HTML handling" and "Headers" (READ, 2026-11-15).
- **Re-ran:** I changed nothing in the repository but this file. Every count below is from a read-only run.
  - `grep -io pluto` over `git ls-files --cached --others --exclude-standard`, leaving out `static/v0.*`, `context/` and `node_modules`. Source gives 795 matches in 190 files. `CHANGELOG.md` gives 38. `static/r/` gives 541 in 76 files. `plutosystemsco` appears 96 times. All of these match the spec's inventory (EXECUTED).
  - `git show v0.11.0:` diffed against the working tree for `field-context.svelte.ts` and `theme-script.svelte`: both are identical (EXECUTED).
  - One scratch script, `…/scratchpad/kf/probe.ts`, ran Tailwind 4.3.3's `compile()` on an `@theme inline` block. The block held `--animate-enter: kuiper-enter …` and both the `pluto-enter` and `kuiper-enter` keyframes. I built it with the `animate-enter` candidate (EXECUTED). The results:

    | App's own CSS in the same compile | `@keyframes pluto-enter` in the output |
    |---|---|
    | none | **dropped** |
    | `.x { animation: pluto-enter 1s }` | kept |
    | `.x { animation-name: pluto-enter }` | **dropped** |

## Findings table

| # | Severity | Finding | Where |
|---|---|---|---|
| 1 | High | The old keyframes do not "keep working". The CLI keeps the source rules, but Tailwind drops them from the built CSS unless an `animation` shorthand in `app.css` names them. An app's uses anywhere else stop silently | finding 3; decision 6; test 11 |
| 2 | Medium | The storage carry-over contradicts its own test. Step 1 also takes any value, so the script and the store can disagree. The first-paint probe is racy | decision 5; tests 9 and 10 |
| 3 | Medium | Tests 7 and 8 cannot be written as specified. Five of the eight readers import `.svelte` files from `bits-ui` or `phosphor-svelte`, and a lone `compile` cannot load those | tests 7 and 8 |
| 4 | Medium | Tests 7, 8 and 12 pass on the tagged tree, so criterion 23's "seen failing" cannot be met | criterion 23 |
| 5 | Medium | Criterion 1's three allowlist classes have no place for the rename's own permanent records | test 1; criterion 1 |
| 6 | Medium | The script would rewrite history guards: one that decision 2 protects, and one it does not name. Its changelog boundary does not exist when the script runs | decisions 2 and 9 |
| 7 | Medium | Check 20 cannot pass on a real build. Hashed asset names, the version file and minified bundles all differ | check 20; criterion 20 |
| 8 | Medium | Scope leaves out the dozen site and lint readers of `registry.json` that must skip a `meta.deprecated` item | decision 3; Scope |
| 9 | Low | Redirects: the mechanism holds on this worker. Make the empty-splat form explicit, and check the host once after a deploy | decision 10; Risks |
| 10 | Low | Interface listing: exported constants whose values change are not named | decisions 4, 7 and 16 |
| 11 | Low | Criterion 25 says every other row holds, but the alias item moves the bench's `deprecatedItems` and likely row 14 | criterion 25 |
| 12 | Low | Stale or doubled references: the roadmap's "untracked" line, the retired `decisions.md`, and the changelog counted twice | lines 10, 40–44, 75; decision 14 |
| 13 | Low | Chromium-only runs are recorded as a limit, not as a finding to fix (§4.4) | Risks, last bullet |

## Findings, most severe first

1. **The `pluto-` keyframes vanish from an upgraded app's built CSS** (finding 3, line 72; decision 6, lines 165–167; test 11, line 334; the memo §3, "The CLI merges the theme").
   - The CLI half is right (READ, `dist/index.mjs`). For a `@keyframes` key in an item's `css`, it finds `@theme inline`, replaces the rule with the same params, or appends one. It never deletes. So `app.css` keeps all eight rules.
   - But those rules live inside `@theme inline`. Tailwind 4.3.3 prunes a theme keyframe unless one of two things names it (READ, `dist/lib.js`, the optimiser's `u` set): the value of an `--animate-*` variable that is used, or an `animation:` shorthand declaration in the same compile.
   - Today `--animate-enter` names `pluto-enter`, so the old rules are kept. After the upgrade it names `kuiper-enter`, so the old four are kept only when the app's own `app.css` has an `animation:` shorthand that names them. The probe above shows this (EXECUTED).
   - Failure: a 0.11.0 or 0.12.0 app names `pluto-enter` in any of these places:
     - a Svelte `<style>` block (a separate compile);
     - an inline `style="animation: …"`;
     - an `animation-name` declaration;
     - a Web Animations call.

     It updates `kuiper-theme`. Its animation stops, and nothing errors. That is the silent break constitution §6 forbids. It also contradicts the owner's ruling that old names keep working for one release, since the spec counts keyframes as interface names (line 54).
   - Test 11 asserts on `app.css` source ("each old `pluto-…` once"). So it would certify the false claim.
   - Fix:
     - Correct finding 3, decision 6 and memo §3. Say exactly what survives.
     - Add an owner question (Q5), recommended option first:
       1. Keep the four old names working until 0.14.0. Emit them outside `@theme`, for example under `@layer base`, where Tailwind does not prune. The builder must prove where the CLI places them, by a smoke build.
       2. No alias. The changelog bullet and the guide say the old keyframes leave the built CSS on update, and that guide step 2 (rename your uses) is required before updating, not after.
     - Either way, test 11 also builds the app. It asserts on the built CSS:
       - with option 1, `@keyframes pluto-enter` is present while a `<style>` block uses it;
       - with option 2, a fixture use in `app.css` keeps it, and the guide's warning is present.
2. **The carry-over algorithm and its test disagree** (decision 5, lines 152–157; test 9, lines 325–332; test 10).
   - Step 1 reads "If `kuiper-theme` is set, use it. Stop." Test 9's fourth case (`kuiper-theme` = `light`, `pluto-theme` = `dark`) then expects "`pluto-theme` is gone". Under "Stop", step 3 never runs, so the old key stays. One of the two is wrong.
   - Step 1 takes any set value, while step 2 checks for `light` or `dark`. The memo's line 92 shows today's script already does this: `stored ? stored === "dark" : …`. A stored `blue` gives light in the head script and the system's theme in the store (READ, `theme-script.svelte:14`, `theme.svelte.ts:24`). Decision 5 says "the two places agree". As written, they do not.
   - Test 9 reads the class at `DOMContentLoaded`, "before the app's modules hydrate". SvelteKit starts through an inline `import()` (READ, `build/index.html`), so nothing guarantees that order. A broken head script could also be hidden by the store's own carry-over.
   - Fix:
     - Write one algorithm:
       1. Read `kuiper-theme`. If it is `light` or `dark`, use it.
       2. Else, if `pluto-theme` is `light` or `dark`, write it to `kuiper-theme` and use it.
       3. Then, in every case, remove `pluto-theme` if it is present.
       4. Else follow the system.
     - Add the case "`kuiper-theme` = `blue`" to tests 9 and 10.
     - In test 9, abort requests to `/_app/**` with `page.route`, so only the head script runs. Read the class and the storage then. Leave the store's half to test 10.
     - Optionally, note that removing the old key means a visitor loses the choice if the app rolls back to 0.12.0. Keeping the key until 0.14.0 would avoid that.
3. **Tests 7 and 8 cannot be written "as `theme.spec.ts`'s nonce test compiles"** (lines 323–324).
   - The nonce test compiles `theme-script.svelte`, which imports nothing, then imports the output (READ, `theme.spec.ts:142–164`).
   - `checkbox`, `switch`, `input-otp` and `radio-group` import `bits-ui`, whose components are `.svelte` files. `checkbox` also imports `phosphor-svelte`. Everything imports `#lib/utils`. Neither Bun nor Node can import the compiled output without a Svelte loader, and `bunfig.toml` preloads only `vite-imports.ts`.
   - Fix: render the fixtures through SvelteKit.
     - Add a test view, as `/view/code-agreement/` is one, at `/view/field-keys/`. It holds a fixture parent that sets only `pluto:field` (and one that sets only `pluto:field-set`) around each reader, and a fixture child that reads only the old keys.
     - Add the view to `TEST_VIEWS`, and assert on its prerendered HTML. Its old key strings join the allowlist as `alias` (finding 5).
4. **Three "tests first" pass before any change** (criterion 23, line 369).
   - On the tagged tree, every key is still `pluto:…`. So these all pass:
     - test 7 (an old parent around today's readers);
     - test 8 (a child reading `pluto:field` under today's `Field`);
     - test 12 (a 0.11.0 `field` with today's `input`; the context shape is unchanged since `v0.11.0`, EXECUTED).
   - Fix: say these three are guards. Each is seen failing after build step 3 (the script has run) and before step 4 (the aliases are written), and passing after step 4. Record both runs in the Landing notes. That ordering is a stronger proof than "failing on the tag".
5. **Criterion 1 cannot hold the rename's own records** (test 1, line 317; criterion 1, line 347).
   - The allowlist admits only `brand`, `alias` and `history`, and every `alias` reason must name 0.14.0. The landing must still hold many permanent `pluto` strings:
     - `renames.ts`'s `old` column, `0.13.0.ts` and the guide's prerendered page, and the 0.13.0 changelog bullets;
     - `static/_redirects` and `redirects.ts`, which "never end";
     - `scripts/rename-kuiper.ts`'s rules;
     - `rename.test.ts`, and tests 7–9 and 11–15;
     - `tests/fixtures/pluto-allowed.json`, whose own name and every pattern contain `pluto`.
   - Fix:
     - Add a fourth class, `record` ("names the old name in order to rename or redirect it; permanent"), with its own reason rule.
     - Or file the redirects and the rename table under `history`, and the script and the rename tests under `alias` (they go in 0.14.0).
     - Say that the test either reads the allowlist file itself or exempts it by path.
6. **The script would rewrite the history it must keep** (decision 2, line 106; decision 9, line 187).
   - `registry-comments.test.ts:264` expects the 0.12.0 changelog paragraph to hold "`` `pluto-theme` ``". Decision 2 keeps that test. But the rule "`pluto-theme` not followed by a letter" matches that line, and `tests/` is not in "What it never reads". After `--write`, the test expects `kuiper-theme` in a frozen paragraph and fails.
   - `tests/unit/fixtures/v0.8.0-custom-properties.json:202–203` records v0.8.0's `--animate-enter: pluto-enter …`. `generated.test.ts:1124` compares every v0.8.0 `@theme inline` value with `src/app.css`, allowing only `MOVED_019A_INLINE`.
     - If the script rewrites the fixture, the test passes and v0.8.0's record is falsified, with no check noticing. Check 20 reads only `build/` and `static/r/`.
     - If the script does not rewrite it, the test fails until a `MOVED_020_INLINE` entry is added.
   - Decision 2 names neither of these, and the stray-name test (test 1) needs them as `history`.
   - "`CHANGELOG.md` below its `## 0.13.0` heading": the script runs at build step 3, and the 0.13.0 entry is written at step 7. At run time the heading does not exist, so the boundary is undefined.
   - The exact-string rules miss escaped and regex forms the builder must edit by hand:
     - `brand-sources.test.ts:24`, `tokens\/pluto\.tokens\.json`;
     - `search.spec.ts:336`, `(pluto-)?theme`, whose "theme" query expectation then misses `/components/kuiper-theme/`.
   - Fix:
     - Add `tests/unit/fixtures/` and the named history guards (by path and line pattern) to "What it never reads".
     - Make the script skip `CHANGELOG.md` entirely; the 0.13.0 entry is written by hand.
     - Add `MOVED_020_INLINE` (`--animate-enter`, `--animate-exit`) to the v0.8.0 test, and list it in decision 2.
     - List the hand edits in decision 9.
7. **Check 20 as written fails on every build** (line 343; criterion 20).
   - The build's file names are content-hashed (EXECUTED: `build/_app/immutable/assets/0.DWCHKBCc.css`, `4.tkvrDrHA.css`; thumbnails such as `accordion-dark.DKGOaGMX.webp`).
   - Renaming the keyframes changes the CSS bundle's hash. Every page that links it then differs in a way that mapping names back cannot undo.
   - `_app/version.json` holds the commit (`beeb67e`).
   - The decision 4 and 5 aliases land inside minified JS chunks, where "the alias lines" cannot be allowed line by line.
   - Fix: specify the normalisation.
     - Replace `\.[A-Za-z0-9_-]{8}\.(js|css|webp|…)` with the unhashed name before the diff.
     - Drop `version.json` and the footer's commit.
     - Compare prerendered HTML, Markdown twins, `static/r/`, `llms.txt`, the sitemap and the CSS text after mapping back.
     - Leave JS chunks to the source-level stray-name test, and say so.
8. **Scope leaves out the code that hides a deprecated item** (decision 3, line 132; Scope, lines 290–303).
   - "No page, no thumbnail, no sitemap or search entry and no example … the lint profile skips it" needs edits in every reader of `registry.json` that enumerates items (READ, grep):
     - `src/lib/site/sitemap.ts`, `component-data.server.ts`, `files.ts`, `doors.ts`, `start/install.ts` and `search/sources/pages.ts`;
     - `routes/(site)/components/+layout.server.ts`, `routes/(site)/+page.server.ts`, and the `(example)` route;
     - `scripts/site/thumbnails.ts`, `thumbnail-hash.ts` and `scripts/lint-literals.ts`.
   - Many unit tests count 75 entries: `registry.test.ts:434`, `component-data.test.ts:20`, `previews.test.ts:10`, and `registry-comments.test.ts:63` (which counts items with a `files` key, and the alias has one).
   - Fix:
     - Name one helper, for example `listedItems()` that filters out `meta.deprecated`, and list each reader above in Scope.
     - Criterion 22 names which counts read 76 and which read 75.
9. **Redirects: sound on this host, with two gaps** (decision 10, lines 195–213; Risks, line 395).
   - What holds:
     - `wrangler.jsonc` is assets-only, with no `main`.
     - `adapter-static` copies `static/` into `build/`.
     - Cloudflare's docs say a `_redirects` file in the assets folder is parsed and not served. Its rules "are always followed, regardless of whether or not an asset matches", and are applied before `_headers`. Rules in `_redirects` are skipped only for requests served by Worker code, and this worker has none (READ).
     - SvelteKit's preview registers its middleware in a post hook (READ, `preview/index.js:69`), so a plugin's middleware added directly in `configurePreviewServer` runs first. The decision 10 plugin is buildable.
   - Gap 1: whether `/components/pluto-theme/*` matches the empty splat `/components/pluto-theme/` is not stated in the Workers docs. Neither `/example/pluto-theme` nor `/example/pluto-theme/` has a rule. A plugin and the host could disagree on exactly the address most bookmarks hold.
   - Gap 2: README line 41 says nothing is deployed, so no test here exercises the host.
   - Fix:
     - Add static rules before the splats: `/components/pluto-theme/ /components/kuiper-theme/ 301`, `/example/pluto-theme /example/kuiper-theme/ 301` and `/example/pluto-theme/ /example/kuiper-theme/ 301`.
     - Add a one-line post-deploy check (`curl -sI` of the four forms) to the release checklist, with its result in the Landing notes once deployed.
10. **Changed exported values are not named** (decisions 4, 7 and 16).
    - `FIELD_CONTEXT_KEY` and `FIELD_SET_CONTEXT_KEY` are exported (`field-context.svelte.ts:11, 88`), and their values change. `shikiTheme.name` is exported (`shiki.ts:54–55`), and its value changes. Line 6's "no … export … changes" is true of names, not of values.
    - Fix: in decisions 4 and 7 and in the changelog bullets, say which exported constants change value. Say whether the old-key constants of decision 4 are exported (recommended: not, as decision 5 does for `OLD_THEME_KEY`).
11. **The scorecard prediction misses the alias item** (criterion 25, line 371).
    - `pluto.ts:79–81` counts `meta.deprecated` items as `deprecatedItems`, and the alias moves it from 0 to 1.
    - Row 14's criterion (c), "A deprecation path that names the replacement", is plausibly met by `meta.deprecated.replacement` plus the guide. That gives four of six, so Governance would move from 2 to 3.
    - Fix: predict row 14's movement, or say why (c) is not met until `048`. Drop "Every other row holds."
12. **Stale and doubled references** (line 10; lines 40–44; line 75; decision 14).
    - `roadmap.md:182` already reads "`scripts/bench/` is committed (since `45a5f5c`)". The "untracked" line that line 75 and decision 14 correct does not exist.
    - The design call cites `decisions.md` at `beeb67e`, which the constitution's Status line now retires. Owner decisions live in the specification they shape, so the quoted ruling should stand in this spec as its record.
    - The inventory's source row (833 in 191 files) includes the changelog's 38 lines, which the last row counts again.
    - Fix: delete the roadmap correction, keep the quoted ruling as the record, and note that the source row includes the changelog.
13. **§4.4 wants a finding, not a limit** (Risks, line 398).
    - "Tests 9 and 15 run in Chromium only" is recorded as a risk. The new guide page is a page, and §4.4 says such a gap is stated "as a finding to fix, never as a limit to record".
    - Fix: record it as an open finding owned by `022`, with tests 9, 15 and 17 named for the matrix.

## Acceptance criteria against evidence

1. No stray name — not met as written: finding 5 (READ).
2. The table — sound (READ).
3. The theme item — sound. 70 of 75 items name `pluto-theme` today (EXECUTED, `jq`).
4. The alias item — sound. The resolver looks names up in the index and throws "does not exist in the registry" (READ, `dist/index.mjs`, function `es`). The font items already ship `files: []` (READ). Scope gap: finding 8.
5. The keyframes — the test holds, but the claim behind it is wrong: finding 1 (EXECUTED).
6. The Shiki name — sound (READ).
7. Cross-item keys — not writable as specified: findings 3 and 4 (READ).
8. Old keys set — not writable as specified: findings 3 and 4 (READ).
9. The storage key — internally inconsistent: finding 2 (READ).
10. The upgrade — writable, since the smoke harness serves `/v0.11.0/r` from the dev server (READ). It needs finding 1's built-CSS assertion, and finding 4 for test 12.
11. Redirects — writable (READ). Finding 9.
12. The guide — writable. The dotted segment is covered by its own test (INFERRED).
13. Search — writable (READ, `aliases.ts`).
14. The changelog — writable (READ).
15. Prose — sound. The site lines (3) and the query-file comments are as inventoried (EXECUTED).
16. Internal names — sound (READ).
17. The lockfiles — sound (INFERRED).
18. The bench — writable. `read()` uses `git show`, so the fallback is a few lines (READ, `pluto.ts:21, 50`).
19. The script — sound, after finding 6.
20. Nothing else moved — fails as written: finding 7 (EXECUTED).
21. The thumbnails — sound (READ).
22. The suites — the counts need finding 8.
23. Tests first — not met for tests 7, 8 and 12: finding 4.
24. The checkpoint — sound.
25. The scorecard — finding 11.

## What holds

- The ruling is honoured where the spec is right:
  - the name is Kuiper;
  - the code names change in 0.13.0;
  - the alias item, the storage carry-over and the context keys keep the old names for one release, and all go together in 0.14.0 (decision 15);
  - migration notes come now, in a guide built as a ledger;
  - the brand, the worker `pluto-systems-design`, `plutosystemsco` and "Pluto Systems" are untouched.
- The inventory is complete and correctly classed. I found no shipped `pluto` interface name it misses:
  - inside `src/lib/registry/` there are only the seven keys, `pluto-theme`, `pluto-code`, the lockup word, sample copy, brand prose and the query-file comments;
  - the brand, sample and history rows match my grep.
- Q1's recommended option is the right one. The silent label break is real. `field` and its eight readers are separate items (READ, `registry.json`: `input` depends only on `utils` and the theme). The `??` fallback is safe, because `Field` and `FieldSet` ship in one item, so an old and a new setter never nest.
- The 0.11.0 path is the 0.12.0 path. `field-context.svelte.ts` and `theme-script.svelte` are unchanged since `v0.11.0`, and v0.11.0's theme already has all four keyframes (EXECUTED).
- The CLI rewrites the lockup rule's `animation` in place: `Es` replaces a declaration of the same property (READ). So the theme's own uses move to the new names on update.
- The rename table as data, the counted allowlist, the dry-by-default script, and the bench fallback to the old token path are good instruments. Prior art is cited, not copied.

## Constitution checks

- §4.1 source, not a package: met. The redirect plugin ships nothing.
- §4.3 tokens: met. No token is added.
- §4.4 accessible and proven: finding 13. The cross-item fallback (Q1.1) prevents a silent loss of the label tie.
- §4.6 dependencies: none added.
- §5 tests first: finding 4.
- §6 never break an installed app silently: **not yet**, because of finding 1. Finding 10 is a gap in the migration notes.
- §6 never copy prior art: met.

## Verdict

Does not land yet: finding 1 (the old keyframes leave the built CSS, so some of an app's own uses break silently) and findings 2 to 8 stand. Once they are fixed, and the owner has answered Q1 to Q4 (and Q5 from finding 1), I expect the specification to be fit to build.

## Disposition

Awaiting the author.

## Re-review, 2026-11-15

- **Reviewed:** the specification as revised, 2026-11-15 (538 lines; Status "Revised after review"), and the memo's new §6. This section supersedes the Status line and the Disposition above.
- **Re-ran:** I changed nothing in the repository but this file.
  - A second scratch probe, `…/scratchpad/kf/probe2.ts`, ran Tailwind 4.3.3's `compile()` on an `@theme inline` block naming `kuiper-enter`, with a `@layer base { html {…} @keyframes pluto-enter {…} }` block beside it, built with `animate-enter`. Then it passed the output through `@tailwindcss/node`'s `optimize` (Lightning CSS, minified). Both outputs keep `@keyframes pluto-enter` inside `@layer base`. The `@theme` copy of `pluto-enter` is dropped, as before (EXECUTED).
  - I read the CLI's CSS merge again (`shadcn-svelte` 1.7.1, `dist/index.mjs`, lines 116–121).
  - I listed `build/_app/immutable/` and the bootstrap script of `build/index.html` (EXECUTED).
  - I grepped every reader of `registry.json`, the `TEST_VIEWS` users and the guards on view routes (EXECUTED).

### Each finding against the revision

1. **Answered.**
   - Finding 3, decision 6, test 11, Q5 and memo §6 now say what survives.
   - The `@layer base` option is sound, on both halves:
     - **The CLI.** Only a *top-level* `@keyframes` key takes the branch that puts the rule in `@theme inline`. A top-level `@layer base` key goes to `Ts(root, "layer", "base", …)`. That function finds or appends the at-rule, and recurses into a nested `@keyframes pluto-enter` key with the same find-or-append, so the rule lands inside `@layer base` (READ). The theme's `css` already has a `@layer base` key (EXECUTED, `jq`), so the four rules join it.
     - **Tailwind.** It keeps a keyframe in `@layer base` through compile and optimise (EXECUTED, the probe above).
   - Test 11's built-CSS assertion with a `<style>`-block use is the right proof. Keep it as the builder's confirmation.
2. **Answered.**
   - One algorithm: step 1 validates, and step 3 removes the old key in every case.
   - `readStoredTheme` in `stored.ts` is unit-testable.
   - Test 9 aborts `/_app/**`, which isolates the inline head script: SvelteKit starts through `import()` of `/_app/immutable/entry/…` (EXECUTED).
   - The `blue` cases are added, and the rollback cost is stated.
3. **Answered,** with one write-in (R3 below).
   - `/view/field-keys/` is prerendered as `/view/code-agreement/` is, and `TEST_VIEWS` (`tests/e2e/pages.ts:261`) is the right list.
   - Two existing guards it meets are not named. That is R2.
4. **Answered.** Tests 7, 8 and 12 are guards, seen failing after step 3 and passing after step 4. Build steps 3 and 4 say so.
5. **Answered.** The `record` class is added, and the allowlist file is exempt by path.
6. **Answered.**
   - Decision 2 names the three guards.
   - The script skips `CHANGELOG.md` and `tests/unit/fixtures/`, and keeps a guard list of lines.
   - `MOVED_020_INLINE` is added, and the hand edits are listed.
   - `registry-comments.test.ts`'s base mapping (decision 8) is a sound extra.
7. **Partly answered.** The structure is right: normalise, map back, compare text, leave JS to test 1. The normaliser is not yet complete. That is R1.
8. **Answered.**
   - `listedItems()` and its readers: every reader in the list enumerates items or builds pages from them (READ).
   - Three other readers are not listed. Each is harmless as it stands, so no change is needed:
     - `start/modes/+page.server.ts` counts only entries with `meta.modes`, which the alias lacks;
     - `scripts/site/citations.ts` loops over `files`, which is empty for the alias;
     - `read-token/data.server.ts` and `start/theme/+page.server.ts` find the theme by name, which the script renames.
   - Build step 1's grep covers the rest.
9. **Answered.**
   - Exact rules come before the splats.
   - `/example/pluto-theme/` sends you to the component page. That is correct: `build/example/pluto-theme/` has no `index.html`, only per-example folders (EXECUTED).
   - The `curl -sI` host check is criterion 26.
10. **Answered.** Decision 18 names the five constants.
11. **Answered.** Row 14 goes 2 → 3, `deprecatedItems` 0 → 1, and the total 30 → 32.
12. **Answered.**
13. **Answered** as open finding F1, owned by `022`.

### Remaining findings

1. **R1 (Medium): check 20's normaliser misses four build-varying strings, so the check still fails on every page** (test 20, "Normalised first").
   - The pattern `\.[A-Za-z0-9_-]{8}\.(ext)` needs a dot before the hash. But SvelteKit's shared chunks are bare hashes: `_app/immutable/chunks/lcSWd0bi.js`, `CkDNWW-m.js`, `Xu_-n6n_.js` (EXECUTED). Every page's `modulepreload` links name them, and the alias lines change the hash of the chunks that hold the field readers.
   - `.wasm` is not in the extension list (`tree-sitter-*.XXXXXXXX.wasm`). Those files are unchanged, so this is harmless, but add the extension for completeness.
   - Every page's inline bootstrap holds `__sveltekit_19bo45d` and `version: "beeb67e"`. Both derive from the build's version name, the commit.
   - The bootstrap also holds `node_ids: [0, 4, 28]` and imports `nodes/28.BrlZm7Q2.js`. `020` adds two routes (the guide and `/view/field-keys/`), so the route-node indices after them shift on many pages.
   - Fix: on both sides, before mapping back:
     - replace every `/_app/immutable/<dir>/<file>` reference with `/_app/immutable/<dir>/<file with any 8-character hash segment removed>`;
     - replace `__sveltekit_[a-z0-9]+` and the bootstrap's `version: "…"` with placeholders;
     - replace `node_ids: [ … ]` and the `nodes/<n>.` index with placeholders.

     Then compare as written.
2. **R2 (Low): two guards meet the new view and are not named** (Scope; criterion 22).
   - `blocks.test.ts:252` fails on any `+page.svelte` under `src/routes/(view)/view/` other than the blocks' views and `code-agreement`. Its expected set must add `field-keys`.
   - `axe.spec.ts:133` runs axe on every `TEST_VIEWS` path. So the fixtures must render what their ids point to: a `label` for each control, and the description and error elements named by `aria-describedby`. Otherwise axe reports labelling and broken-reference violations (INFERRED from axe's rules).
   - Write-in: add both to Scope, and to criterion 22's list of changed expectations.
3. **R3 (Low, optional): test 8's source check for the five inside-item setters is wider than its reason.**
   - Only `popover-content`'s context is set inside a portal that the server render skips.
   - `tooltip.svelte` sets its key in the root wrapper, whose children are rendered on the server. `item-group` and `accordion-item` set theirs in plain server-rendered markup (READ).
   - Write-in: on `/view/field-keys/`, render a fixture child that reads the old key under the new `Tooltip`, `Item.Group` and `Accordion.Item`. Keep the source check for `popover-content` only.

### Constitution checks, as revised

- §6 never break an installed app silently: met, given Q5's answer. Option 1 keeps the old keyframes working; option 2 warns before the update. Decision 18 completes the migration notes.
- §4.4: F1 records the engine gap as a finding to fix.
- §5 tests first: met (criterion 23).
- §4.1, §4.3 and §4.6: met, as before.

### Verdict, as it stands

**Approve with changes.** Fit to build once R1's normalisation is written into test 20. R2 and R3 are write-ins. The build still waits on the owner's answers to Q2–Q5, which this review does not settle.
