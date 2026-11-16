# Review of 020 — The Kuiper rename (the built change)

Reviews [`specifications/020-the-kuiper-rename.md`](../specifications/020-the-kuiper-rename.md). This reviewer wrote neither the specification nor the code.

- **Date:** 2026-11-15
- **Status:** in review. Land with changes: finding 1 must be fixed before the commit; findings 2 to 8 are write-ins.
- **Reviewer:** a reviewer; not the author
- **Reviewed:** the worktree `.claude/worktrees/agent-a9fdabf43afb5246c`, branch `worktree-agent-a9fdabf43afb5246c`, uncommitted over `f9e1c1a`: 250 tracked files changed, plus the untracked files of `git status` (the alias and guide modules, `stored.ts`, the field-keys view, `static/_redirects`, `static/v0.13.0/`, the rename script, the new tests and the allowlist).
- **Re-ran:** Bun, 2026-11-15, in the worktree. Nothing was written but this file. The tree's state was hashed before and after every run; it never changed, so `build:tokens` and `build:registry` are idempotent. Scratch work is in the session scratchpad, `review-020/`.
  - `bun test ./tests/unit` → **1,250 pass, 2 skip, 0 fail**, 12,093 `expect()` calls, 38 files.
  - `bun run check` → 2,186 files, **0 errors, 0 warnings**.
  - `bun run lint` → clean.
  - `bun --bun playwright test tests/e2e/field-keys.spec.ts tests/e2e/redirects.spec.ts tests/e2e/upgrade.spec.ts` → **60 passed**, exit 0. Port 4173 was free first; 5199 was not used.
  - `bun test ./tests/smoke/upgrade.test.ts` → **7 pass, 0 fail**.
  - `bun scripts/rename-kuiper.ts` (dry) → every rule 0, "would change 0 files and moves"; no guard failed.
  - `bun scripts/rename-kuiper.ts --verify <base build> build`, against my own build of `f9e1c1a` (`git archive` into the scratchpad) → 699 identical; 8 "unexplained". All 8 are my base build's artefacts, not 020's:
    - six LayerChart CSS files whose `svelte-<hash>` class names differ, because my copy reached `node_modules` through a symlink outside its root;
    - two footers (`view/app-shell`, `view/product-home`) whose build stamp my copy lacks, having no `.git`.
    - 699 + 8 = 707, the builder's figure. `src/app.css`, mapped back, is identical.
  - **The Button page, per resource,** with `perf.spec.ts`'s gzip server and no throttling: base **388,898 B (379.78 kB)**, 020 **389,676 B (380.54 kB)**. See finding 2.
  - `bun scripts/bench/kuiper.ts --rev ea1f9bd` → 48 primitives, 61 roles, 61 with words, 129 contrast pairs, 11 releases, 26 marks, 0 migration pages: the run log's first row (test 19).
  - `bun scripts/bench/kuiper.ts` (the working tree) → `migrationPages` 2, `deprecatedItems` 1, as the new run log row says.
  - **Not run by me:** the full e2e suite and the full smoke suite. Their figures below are the builder's.

## Acceptance criteria against evidence

1. **No stray name** — met. EXECUTED: `rename.test.ts` passes. READ: the allowlist has 39 entries in the four classes; every `alias` reason names 0.14.0. One weakness is finding 7.
2. **The table** — met. READ: `renames.ts` holds decision 1's rows: the context keys one row each, the site page as two rows. EXECUTED: test 2's page half passes.
3. **The theme item** — met. READ: `registry.json`'s `name` is `kuiper`; `kuiper-theme`, "Kuiper theme", has `cssVars` and `css`; 71 entries name `kuiper-theme`, which is the 70 items plus the alias.
4. **The alias entry** — met. READ: `static/r/styles/maia/pluto-theme.json` has the spec's shape, with `files: []` and `registryDependencies: ["kuiper-theme"]`. `index.json` holds both names. EXECUTED: smoke test 13, `add pluto-theme` gives an `app.css` byte-identical to `add kuiper-theme`'s.
5. **The keyframes** — met. READ: `src/app.css` and `site.css` name no `pluto-` keyframe; `--animate-enter` and `--animate-exit` name `kuiper-enter` and `kuiper-exit`.
6. **The Shiki name** — met. READ: `shiki.ts`'s `THEME` is `kuiper-code`. The 24 query files change only in their two header comments.
7. **Cross-item keys** — met. EXECUTED: field-keys passes. READ: the fixture's old context has 0.12.0's exact `FieldContext` shape (`git show f9e1c1a:…/field-context.svelte.ts`), so the test is not vacuous. The Landing notes record it failing 13 of 13 after the script.
8. **Old keys set** — met. READ: all seven setters set both names. The eight readers fall back new, then old.
9. **The storage key** — met. READ: `stored.ts` and the head script follow the same four steps. EXECUTED (in the suite): test 10. READ: test 9 aborts `/_app/**`, so only the head script runs before the reload is read. That is the carry-over before first paint.
10. **The upgrade** — met. EXECUTED: 7 of 7. READ: the "skips step 1" app asserts the loss (`animation-name: pluto-enter` kept, `@keyframes pluto-enter` gone), so the warning is proven, not assumed.
11. **Redirects** — met in preview. READ: `static/_redirects` and `REDIRECTS` hold decision 10's six rules, exact rules before splats. The plugin registers in `configureServer` and `configurePreviewServer`. EXECUTED: `redirects.spec.ts`. The host waits on criterion 26.
12. **The guide** — met as tested, but the test cannot see finding 1.
13. **Search** — met. READ: the alias and its rule's new clause, with the 0.14.0 comment.
14. **The changelog** — met. READ (`CHANGELOG.md:5–14`): five bullets, each marked; the rename-first sentence is in the `kuiper-theme` bullet. All five constants are named: `THEME_KEY`, `THEME_SCRIPT`, `FIELD_CONTEXT_KEY`, `FIELD_SET_CONTEXT_KEY` and `shikiTheme.name`. The entries before 0.13.0 are untouched: the diff only adds lines.
15. **Prose** — met. READ: a grep for `\bPluto\b` outside "Pluto Systems", the Brand routes, the specimens and the product names finds the Brand door's summaries, sample content, the guide and the script's own rules. The Brand pages change only in `<!-- source: tokens/kuiper.tokens.json … -->` comments. See finding 7.
16. **Internal names** — met. READ: the token file, package name and bench file have moved, and the old ones are gone.
17. **The lockfiles** — the builder's figure. Not re-run.
18. **The bench** — met. EXECUTED, above.
19. **The script** — met. EXECUTED: the dry run reports 0. It is 0 partly by construction, since the guard list holds every hand-written alias line (deviation 3). That is acceptable: a guard that stops matching fails the run.
20. **Nothing else moved** — met. EXECUTED: reproduced, apart from my build's 8 artefacts.
21. **The thumbnails** — met. EXECUTED: `thumbnails.test.ts`, in the unit run. Byte equality is the builder's figure.
22. **The suites** — met, except the Button budget. Unit, check and lint: EXECUTED. Full e2e (2,976 / 1 failed) and smoke (139): the builder's.
23. **Tests first** — met as recorded. READ: the Landing notes give failure counts by test, and the three guards failing after step 3 and passing after step 4. Each test I read asserts on the new names or the alias, not on something present in both trees.
24. **The checkpoint** — waiting on the design lead. Finding 1 should be fixed first.
25. **The scorecard** — met in the table and the run log; stale elsewhere (finding 3).
26. **The host** — waits for the first deploy.

### What the brief asked me to verify

- **No history rewritten.**
  - EXECUTED: `git diff --stat f9e1c1a` over `context/specifications`, `context/reviews`, `context/research`, `static/v0.4.0` to `static/v0.12.0` and `tests/unit/fixtures` shows only `020`'s own specification and the scorecard.
  - `git status` shows no change under `static/v0.*` except the new `static/v0.13.0/`.
  - The `context/` changes are the living documents of decision 14: `AGENTS.md`, `context/README.md` and `roadmap.md`.
  - The three history guards in `tests/` are intact.
- **Brand words intact.**
  - EXECUTED: against the base, "Pluto Systems" (139 → 145), `plutosystemsco` (96 → 98) and `pluto-systems-design` (7 → 8) only grow; each increase is new prose.
  - The brand downloads `pluto-mark-*.svg` and `pluto-lockup-*.svg` keep their names (5 references each side).
  - The lockup word and the bar's label are allowlisted as `brand`.
- **Every alias works and is marked for 0.14.0.**
  - The `pluto-theme` entry: its description, `meta.deprecated.removedIn`, and smoke test 13.
  - The storage key: `OLD_THEME_KEY`, the head script's comment, and test 9.
  - The seven context keys: a comment at each one, and tests 7 and 8.
  - The search alias, the field-keys view and the rename script each carry their 0.14.0 comment.
  - Roadmap row `032a` lists every one of them.
- **The exported constants that changed value** are named in the changelog and in the guide's "What did not change" (`0.13.0.ts`, `UNCHANGED.values`).
- **The deviations** are justified:
  - (1) Moving `package.json` to 0.13.0 is what keeps `static/v0.12.0/` frozen.
  - (2) and (4) `registry-comments.test.ts`'s base comparison is gated to `VERSION === "0.12.0"` (`registry-comments.test.ts:135`), so mapping it would be dead code. Check 20 makes the same comparison.
  - (3) The longer guard lists are what keep the dry run at 0 without the script rewriting history or the aliases.
  - (5) to (10) are recorded and small.
- **Tailwind scans `context/`: confirmed.** EXECUTED: `.bg-fuchsia-950`, `.row-8` and `.row-15` are each in the built site CSS (`build/_app/immutable/assets/0.*.css`). None of the three appears in any file under `src/`. Each appears in two files under `context/`, among them now `020`'s own Landing notes. `src/app.css` has `@import "tailwindcss"` and no `@source` line. See finding 8.

## Findings, most severe first

1. **High. The guide's first copyable command is `add kuiper-theme`, before the step that says to rename keyframe uses first.** (`src/lib/site/upgrade/0.13.0.ts:45–49`; `src/routes/(site)/changelog/0.13.0/upgrade/+page.svelte:78–87`; the twin, `build/changelog/0.13.0/upgrade/index.md`, "Before you start")
   - **The defect.** Part 2, "Before you start", renders `REGISTRY_URL=…/v0.13.0/r bunx --bun shadcn-svelte@1.7.1 add kuiper-theme -y` as a snippet with a copy button, labelled "Add from this release". It sits above part 3's step 1, "Before you update anything, rename your own uses of the four keyframes".
   - **Why it matters.** The owner's Q5 answer removed the old keyframes on one condition: that the guide tells apps to rename their own uses before they update. Decision 12 and test 17 require step 1 to come before any `add`. Read top to bottom, the page hands over the one command that makes those uses vanish from the built CSS, silently (finding 3 of the specification; smoke test 11's second app proves the loss).
   - **Failure.** An app with `animation-name: pluto-enter` in a component's `<style>` follows the page in order. It commits, then copies and runs the part-2 snippet. The animation is gone and nothing warns.
   - **Why the test passed.** `upgrade.spec.ts:52` and `:65` look for the first `add` only inside `[data-section="020"] [data-step]`, so a command in part 2 is outside its view.
   - **`README.md` has the same order.** Lines 32–34 give `add kuiper-theme four-dot -y -o` first. The line that sends an existing app to the guide is line 37, after the code block.
   - **The specification invites it.** Decision 12 part 2 says "Point the CLI at `v0.13.0` (the install commands, with the registry URL)". The builder followed that sentence. It contradicts step 1 of the same decision.
   - **Required change:**
     - Part 2 shows only the registry URL, as text or as `export REGISTRY_URL=…/v0.13.0/r`, with no `add`. Alternatively, step 1's rename moves up into part 2.
     - `README.md`'s line 37 moves above the commands.
     - Test 17 asserts, in document order over all of `main`, that no command containing ` add ` comes before step 1. The same holds for the Markdown twin.
     - Decision 12 part 2's wording is corrected in the Landing notes.
2. **Low. The Button page's growth is 020's own, but the Landing notes' 691-byte breakdown does not reproduce.** (`020-the-kuiper-rename.md:625`)
   - **EXECUTED, per resource,** base against 020. The total is +778 B:
     - the page's HTML, +152: the head script's carry-over, plus "Kuiper theme" in two links and `v0.13.0` in three URLs;
     - the shared chunks, +471: `registry.json`'s chunk 16,428 → 16,590, plus many renamed strings;
     - `entry/app.js`, +122: the two routes;
     - `nodes/4.js`, +24;
     - CSS, +14: `whitespace-normal`;
     - the node renumbering, −5.
   - The `nodes/4.js` +24 is `builtAt`, which my base build lacked. So 020's real growth is about **754 B**.
   - **The verdict on ownership holds.** Every changed byte traces to 020: names, the version, the head script, the routes, the alias entry and the guide's sitemap entry. Nothing unrelated is in it.
   - **The headroom.** The base measures 379.78 kB, so the page had 0.22 kB to spare, not 0.
   - **Required change:** restate the figure as about 0.75 kB, with the HTML's share at about 150 B (it includes the name and version strings), and give the base as 379.8 kB. This does not judge the ruling.
3. **Low. The scorecard is updated in its summary table only.** (`context/research/benchmark-scorecard.md:12`, `:284`, `:332`, `:354`, `:358`)
   - §8 step 7 says: replace the "In short" table, §4's changed cells and §5–6. Four places are stale:
     - the "In short" caption still reads "as built at `ea1f9bd`" over the new scores;
     - §4's row 11 still marks (d) "–" with a score of 2;
     - §4's row 14 still marks (c) "–" with a score of 2;
     - §5's gap table still gives rows 11 and 14 as 2, with gaps of −1 and −2.
   - **Required change:**
     - The caption names the landing tree.
     - Row 11's (d) is ✓, scored 3, citing the guide.
     - Row 14's (c) is ✓, scored 3, citing `meta.deprecated.replacement`.
     - §5's gaps read 0 for row 11 and −1 for row 14, and §6's ranking is re-read.
4. **Low. Step 2's command installs more than its sentence says, and overwrites.** (`src/lib/site/upgrade/0.13.0.ts`, the second step of `SECTIONS[0]`)
   - **The defect.** The text says "then `theme` if your app has it, then `field` with the controls your app uses". The command adds `theme` and all nine field controls, with `-o`.
   - **Failure.** An app with only `field` and `input` gains seven new controls. Any local edit to the ones it has is overwritten. The README advises against `-o` for exactly that reason, and an app owns what it installs.
   - **Required change:** either say "remove the names your app does not have; `-o` replaces your own edits to these files", or show `add kuiper-theme` and `add field input` as the example, with that sentence.
5. **Low. Step 1's `grep` also finds the theme's own rules, and the guide does not say so.** (the same file, the first step)
   - **The defect.** `grep -rn -e pluto-enter -e pluto-exit -e pluto-mark- src` matches the theme block in `app.css`: the four `@keyframes pluto-…`, `--animate-enter` and `--animate-exit`, and the lockup's `animation:`. Those lines are the theme's, and step 2's `add` rewrites them.
   - **Why it matters.** A reader cannot tell their own uses from the theme's.
   - **Required change:** add one sentence: "Matches inside the theme's block in `app.css` are the theme's own; the update rewrites them, and step 4 deletes what is left."
6. **Low. The changelog's link is site-relative, and the parser accepts any `href`.** (`CHANGELOG.md:7`; `src/lib/site/changelog.ts:31`)
   - **The link.** On GitHub, `[Upgrade to 0.13.0](/changelog/0.13.0/upgrade/)` resolves inside the repository and 404s. Installs point at GitHub, so readers meet the file there.
   - **The parser.** `inlines()` now renders `[text](href)` for any href, `javascript:` included, both on the changelog page and in the guide.
   - **Required change:**
     - Use the site's absolute URL in `CHANGELOG.md`, or say why the relative form is wanted.
     - Accept only hrefs that start with `/`, `#` or `https://`, and add a unit case.
7. **Low. The theme item's description is system prose that still says Pluto.** (`registry.json:17`, "The Pluto Systems tokens for light and dark: …")
   - **Why it falls under decision 11.** By its rule, a sentence about the product teams adopt says Kuiper. This one is shown by the CLI and on `/components/kuiper-theme/`.
   - **Why the test missed it.** The allowlist's "Pluto Systems" entry is one blanket count (311), so test 1 cannot tell company prose from system prose.
   - **Required change:** the design lead rules on it. The recommendation is "The Kuiper tokens for light and dark: …". If it changes, the pinned count follows.
8. **Low, for the design lead (the builder's finding, confirmed). The site's CSS follows prose in `context/`.**
   - **EXECUTED.** The three classes are in the built CSS and in no source file (see "What the brief asked me to verify").
   - **What it does.** Every specification that names a utility in backticks adds bytes to every page. 020's own Landing notes now do so too.
   - **Required change:** not in 020. A small change adds `@source not "../context";` beside the site's `@import "tailwindcss"`, through `build-tokens.ts` if `src/app.css` is generated, and a test asserts that `.bg-fuchsia-950` is absent from the built CSS.

## Constitution checks

- **§4.1 Source, not a package:** holds.
  - The alias is a registry entry with no files.
  - `stored.ts` imports nothing.
  - The redirect plugin and the rename script are site tooling and ship nothing.
- **§4.3 Tokens are the one source:** holds. No token value changed; only the keyframe names, which `build-tokens.ts` emits. The literal lint is clean (unit).
- **§4.4 Accessible, in three engines:** open finding F1 stands. Tests 9, 15 and 17 run in Chromium only until `022`. axe covers the guide and `/view/field-keys/` (builder's run).
- **§4.5 Inputs pinned:** holds. No dependency was added, and `bun.lock` changes only in the root name (builder's figure).
- **§6 Never break an installed app silently:**
  - Holds for every name with an alias, and for the keyframes through the guide's warning.
  - The one place the warning can be skipped by following the page in order is finding 1.
- **§6 Never commit without the owner:** holds. Nothing is committed.

## Verdict

Does not land yet: finding 1 stands. The guide and the README must not put an `add` before the rename-first step, and test 17 must prove it. Findings 2 to 8 are write-ins, and the Button budget ruling is the owner's.
