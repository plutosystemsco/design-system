# 0.12.0 was never released: what the repository says otherwise

- **Status:** a memo. It commits us to nothing; [`020d`](../specifications/020d-0-12-0-was-never-released.md) stands on it.
- **Date:** 2026-11-17
- **Author:** the design lead
- **Question:** the owner ruled on 2026-11-17 that 0.12.0 was never released, and that the next release is 0.13.0 (`research/2026-11-17-structural-review.md`, "The owner's answers", L2 (c)). What in the tree says or assumes otherwise, and what should each reference become?
- **Read at:** `release/0.13.0`, `b01e754`, in the main checkout, read-only. `.claude/worktrees/` was not read. Probes ran on a copy in the session's scratch folder. After `020d`'s spec review, the new base was read too: `71cb067` and `lane-i-run5`'s changelog (§10).

Labels: **EXECUTED** (run here and seen), **READ** (a source says so, dated 2026-11-17 unless noted), **INFERRED** (reasoning).

## 1. The facts

- **No tag, here or on GitHub.** `git tag` and `git ls-remote --tags origin` both end at `v0.11.0` (EXECUTED). `v0.11.0` is on `8cb06ba`.
- **A branch, not a tag.** `origin` has `release/0.12.0` at `dad6f76` (EXECUTED, `git ls-remote --heads`). `dad6f76` is an ancestor of `release/0.13.0` (EXECUTED, `git merge-base --is-ancestor`). Deleting the branch would lose no commit.
- **GitHub serves the branch, not the tag.** `raw.githubusercontent.com/plutosystemsco/design-system/<ref>/static/r/styles/maia/button.json` returns 200 for `release/0.12.0`, `v0.11.0` and `main`, and 404 for `v0.12.0` (EXECUTED, curl). So every "from `v0.12.0`" URL has always failed. GitHub lists no releases (EXECUTED, `gh api …/releases`: 0).
- **GitHub's `main` is 0.11.0.** `origin/main` is `ef53f01`: `v0.11.0` plus one context commit (EXECUTED, `git log v0.11.0..origin/main`).
- **The tree said 0.12.0.** At `dad6f76`, `package.json` reads 0.12.0 and the changelog heads `## 0.12.0 — 2026-11-15` (EXECUTED, `git show`). Its README still pinned installs to `v0.11.0` (READ, `git show dad6f76:README.md`, lines 32–34). So no published document ever told an app to install 0.12.0 from GitHub, except the changelog's own line.
- **A local tag existed somewhere.** `020`'s landing notes ran `git diff --name-only v0.12.0 f9e1c1a` (READ, `specifications/020-the-kuiper-rename.md:577`). The machine that built `020` had a `v0.12.0` tag that was never pushed. The handoff planned "the local `v0.12.0` tag" (READ, `handoff.md:36`).
- **The site.** `wrangler.jsonc` is an assets-only Cloudflare Worker serving `./build` (READ). The build copies `static/` whole: `build/v0.12.0/` exists locally (EXECUTED, `ls build`). No workflow deploys it: `.github/workflows/` holds `matrix.yml` alone, and `package.json` has no deploy script (READ). The record says nothing has been deployed: `README.md:43` and `020`, line 263, "Nothing is deployed today" (READ). The host could not be reached from this session: the proxy refused `pluto-systems-design.claygendron.workers.dev` (EXECUTED). Whether it was ever deployed by hand is **unknown**. If it was, `/v0.12.0/r` was served.
- **Nothing links to the snapshot.** The site builds every registry URL from `package.json`'s version (`SITE_REGISTRY`, `src/lib/site/site.ts:23`), so it links `/v0.13.0/r` only (READ). The built site holds four `href="/changelog/#v0-12-0"` and one `href="#v0-12-0"`, and none to `/v0.12.0/` (EXECUTED, grep of `build/`).

## 2. How others treat a version that never shipped

- **Keep a Changelog 1.1.0** keeps an `Unreleased` section at the top and, "at release time", moves it "into a new release version section" (READ, the project's source, `source/en/1.1.0/index.html.haml`, l. 100–110). A `[YANKED]` mark is for versions "that had to be pulled", that is, released ones (l. 263–276). It has no heading for a version that never shipped.
- **SemVer 2.0.0:** each element "MUST increase numerically", with no rule against a gap (READ, `semver.md`, l. 60–63). 0.11.0 to 0.13.0 is valid. A released version's contents "MUST NOT be modified" (l. 67–68). 0.12.0 was not released, so its record may be rewritten.
- **GOV.UK Frontend** heads `0.0.21-alpha` with one line: "Skipped 0.0.20-alpha due to difficulties with publishing." There is no `0.0.20-alpha` heading (READ, `CHANGELOG.md` on `main`, l. 7164–7166).
- **This project, 0.11.0.** "0.9.0 and 0.10.0 were never released; their changes are folded in here" (READ, `CHANGELOG.md:64`, and the `v0.11.0` tag's message). `011` folded the entries, set `meta.since` to `"0.11.0"`, and deleted `static/v0.9.0/` and `static/v0.10.0/` (READ, `011-the-brand.md:267`). A test still holds both deletions (`tests/unit/generated.test.ts:1662`).

INFERRED: every source agrees. A version number belongs to a release. Work that never shipped joins the release that ships it, with one line saying so.

## 3. What 0.11.0 shipped, and the alias window

Every old name `020` aliases or removes was already in `v0.11.0` (EXECUTED, `git grep -c` over `static/r`, `src/lib/registry` and `registry.json`, at `v0.11.0` and at `dad6f76`, the same counts for each):

| Name | `v0.11.0` | `dad6f76` |
|---|---|---|
| `pluto-theme` | 221 | 221 |
| `pluto:field`, `pluto:field-set`, `pluto:field-label` | 15, 5, 2 | 15, 5, 2 |
| `pluto:tooltip`, `pluto:item-group`, `pluto:popover`, `pluto:accordion-item` | 4, 4, 2, 2 | 4, 4, 2, 2 |
| `@keyframes pluto-enter`, `pluto-exit` | 2, 2 | 2, 2 |
| `pluto-mark-dock`, `pluto-mark-fade` | 4, 4 | 4, 4 |
| `pluto-code` | 2 | 2 |

So an app on 0.11.0 has every `pluto` name. **The alias window holds as written**: old names keep working until 0.14.0, one release after the rename. AGENTS.md, `context/README.md` and the guide's "until 0.14.0" need no change (INFERRED).

0.12.0's own changes are what a 0.11.0 app has not seen: the code map, the white code ground, the yellow, the font's spacing, the sticky-bar rule, `kbd`, `error-summary`, `app-shell` (READ, `CHANGELOG.md:33-60`). Today the guide routes them through the changelog, and gets the order wrong (§6).

## 4. `static/v0.12.0/`

- 76 tracked files (EXECUTED, `git ls-files`), first written by `014` (`b91b79d`), last by `019a` (`dad6f76`).
- **Delete, or redirect?** INFERRED, from §1:
  - From GitHub, the snapshot was never at a pinned URL: `v0.12.0` is 404.
  - From the site, it was served only if the site was deployed. A Workers assets deploy publishes the build folder as a whole (INFERRED from `wrangler.jsonc`'s `assets.directory`; not checked against a live deploy), so the next deploy without the folder makes `/v0.12.0/…` a 404, and `not_found_handling: "404-page"` returns the site's 404 page with status 404. A pinned `add` then fails loudly.
  - Nothing installed breaks: an app never reaches back at run time (constitution §4.1).
  - A redirect to `/v0.13.0/` would hand a request pinned to 0.12.0 the rename's breaking changes, the four keyframes removed with no alias among them. That is a silent break (constitution §6).
  - So delete, with no redirect, as `011` did.
- **The tokens depend on it.** `tests/unit/tokens-lifecycle.test.ts` counts every `static/v*` folder as a release (l. 71). From them it derives what each token's `since` and each removed name's `removed` must read. Deleting the folder alone fails two tests (EXECUTED, §8). Rewriting `"since": "0.12.0"` and `"removed": "0.12.0"` to `"0.13.0"` in `tokens/` passes them. `bun run build:tokens` then rewrites the twelve published copies, and leaves `src/app.css`, `kuiper.css` and `static/r/styles/` byte-identical (EXECUTED).
- **No item arrived in 0.12.0.** `registry.json`'s `meta.since` values are 0.1.0 to 0.7.0, 0.11.0 and 0.13.0 (EXECUTED, a count by value). So no item's `since` changes, unlike `011`'s.

## 5. The tests that read tags and the 0.12.0 entry

- **`registry.test.ts:1819`** ("014: … a v0.12.0 tag, if made, is a dated 0.12.0") requires `static/v0.12.0/` to exist. Only if `git tag --list v0.12.0` is non-empty does it check the tagged `package.json` and changelog. On GitHub's clone the second half never ran, while on the machine with the local tag it did. That is L2's "differs between machines" (READ).
- **`registry.test.ts:2076`, "released snapshots"**, reads `git tag --list 'v*'` and holds each `static/<tag>/` to its tag. A folder with no tag is never checked. `static/v0.12.0/` was guarded only where the local tag existed (INFERRED). The converse check, "every `static/v*` is a tag's or the current version's", fails today on exactly `v0.12.0` (EXECUTED, a shell loop over `ls static` and `git tag`). CI's unit job fetches tags (`matrix.yml:76-77`, `fetch-depth: 0`, `fetch-tags: true`; READ).
- **Eleven tests read the `## 0.12.0` entry or the releases' order**, and fail once the heading goes (EXECUTED, §8): seven in `registry.test.ts`, three in `registry-comments.test.ts`, one in `changelog-page.test.ts`. One more, in `component-data.test.ts`, expects `kbd` to read 0.12.0. Their claims about the content stay true once they read the 0.13.0 entry instead.
- **Updated facts, folded.** Three pages read "Updated 0.12.0" today: `kbd`, `error-summary` and `product-home` (EXECUTED, `updatedIn` over `registry.json`). With the heading removed in a copy, all three read 0.13.0, and 74 of 82 items read 0.13.0. The other eight read the release they arrived in, 0.1.0 to 0.4.0, so no item reads a later change in an older release (EXECUTED). `meter`, 0.4.0, can stand for an older release in place of `kbd`.
- **Five slices end at `\n## 0.12.0`**: `registry.test.ts` l. 2238, 2394, 2490, 2514 and `toast-site.test.ts:125` (READ, `git grep`). With the heading gone, `indexOf` returns −1, the slice runs to the file's end, and the tests **still pass** without testing the entry (EXECUTED: none is in §8's failures). They must end at `\n## 0.11.0`.
- **`registry-comments.test.ts:121-160`** is a release check "for 0.12.0 only", and skips at any other version (READ). It can never run again (INFERRED).
- **The smoke test's upgrade case** already installs `v0.11.0`, then this tree's `/r` (READ, `tests/smoke/code-add.test.ts:557-583`). It is the 0.11.0 → 0.13.0 path, and is labelled "the v0.12.0 add" (l. 602).
- **The rename guard** (`tests/fixtures/pluto-allowed.json`) counts the 0.12.0 section's `pluto` words as "history … as released": 38 from `## 0.12.0` on, 10 of them in that section and 28 from 0.11.0 down (EXECUTED). Folded, those 10 stop being history.

## 6. The upgrade guide

- `WHO[1]` (`src/lib/site/upgrade/0.13.0.ts:41`): "Coming from 0.11.0, as most apps are: first apply 0.12.0's notes in the changelog, then this page."
- 0.12.0's notes say "Any `add` from `v0.12.0` updates `pluto-theme` … `add pluto-theme highlighter …`" (READ, `CHANGELOG.md:60`). There is no `v0.12.0` to add from (§1). An app that runs that line against the only registry there is, 0.13.0's, installs `kuiper-theme`: `pluto-theme` is an alias whose only dependency is `kuiper-theme` (EXECUTED, `static/r/styles/maia/pluto-theme.json`). That theme has no `pluto-` keyframes (EXECUTED: 0 of them, 4 `kuiper-` ones). So the guide's first instruction to a 0.11.0 app updates the theme **before** its step 1, the keyframe rename, and the app's own animations drop out silently (INFERRED). This is a defect in the guide, not only a stale word.
- `UNCHANGED.names` says "Every CSS variable, class, utility, prop, slot and export name" did not change. That is true of `020` alone. From 0.11.0, twelve variables are removed and `codeTheme`, `codeHighlight`, `pythonLanguageConfigured` and `pythonRoles` are renamed or removed (READ, `CHANGELOG.md:41-44`).
- `UNCHANGED.values` lists `shikiTheme.name`. A 0.11.0 app knows the export as `codeTheme`, renamed in 0.12.0's notes (READ, `CHANGELOG.md:44`).
- Once 0.12.0's interface changes are 0.13.0's, the guide's ledger rule applies to them: "each later 0.13.0 specification with an interface change appends its section" (READ, `0.13.0.ts:3-6`).
- Some of 0.12.0's steps come before the update: rename an app's own `scrollbar-code` class (READ, `CHANGELOG.md:41`). Some go with it: update the code items with the theme, never alone (l. 60). The rest follow it: `bun install`, delete the stale lines, delete the old sticky-bar rule. So they cannot all sit in one section after `020`'s (INFERRED).

## 7. The inventory

**Size.** `git grep` for `0\.12` finds 780 lines outside `context/prior_art/` and `static/v0.12.0/`. Of those, 121 are noise: colour components, ratios, package versions (EXECUTED: the broad grep's lines minus the version-form grep's). The version form (`0.12.0`, `v0.12.0`, `v0-12-0`, `release/0.12`) finds **657 lines in 98 files**, `bun.lock` excluded. Add the scorecard's two "Pluto 0.12" lines, and the 76 files of `static/v0.12.0/` (EXECUTED).

| Area | Lines | Files | Kind |
|---|---|---|---|
| Landed specifications | 205 | 15 | history |
| Reviews | 112 | 24 | history |
| Research memos | 44 | 18 | history |
| `tokens/` | 51 | 4 | claim (metadata) |
| `static/r/tokens/`, `static/v0.13.0/r/tokens/` | 162 | 12 | generated from `tokens/` |
| `static/r/`, `static/v0.13.0/r/` `field.json` | 2 | 2 | generated from the item |
| `tests/` | 51 | 11 | assumption |
| `src/` | 12 | 6 | claim, assumption or example |
| `scripts/` | 8 | 2 | history (7), comment (1) |
| `CHANGELOG.md` | 4 (and the section, l. 33–60) | 1 | claim |
| `roadmap.md`, `handoff.md` | 4 | 2 | claim |
| `benchmark-scorecard.md` | 4 | 1 | history (3), claim (1) |

Kinds: a **claim** says 0.12.0 shipped or can be installed; correct it. An **assumption** is code or a test that depends on it; change it. **Generated** follows its source. An **example** is a sample value in a comment. **History** records the past; keep it as written (`context/README.md`: landed specifications are records, and memos are never edited).

**Reference by reference:**

| Reference | What it is | Kind | Change | Label |
|---|---|---|---|---|
| `CHANGELOG.md:33` `## 0.12.0 — 2026-11-15` | a dated release heading | claim | removed; the section folds into 0.13.0's | READ |
| `CHANGELOG.md:37` "Its code names are unchanged in this release … 0.13.0 renames them" | 0.12.0's naming paragraph | claim | deleted. The 0.13.0 intro says the system is named Kuiper and its code names now say so | READ |
| `CHANGELOG.md:39` "at its own versioned path, `/v0.12.0/r`" | the design site's paragraph | claim | `/v0.13.0/r` | READ |
| `CHANGELOG.md:41,57,58,60` `pluto-theme` (7) | the theme, by its 0.12.0 name | claim, once folded | `kuiper-theme`, the name an app installs | EXECUTED (count) |
| `CHANGELOG.md:60` "Any `add` from `v0.12.0` updates `pluto-theme`" | the update instruction | claim (the tag never existed) | from `v0.13.0`, after renaming the keyframe uses | EXECUTED (404) |
| `CHANGELOG.md:10` "Rolled back to 0.12.0 after the update" | the theme bullet's rollback note | claim | "Rolled back to 0.11.0" | READ |
| `static/v0.12.0/` (76 files) | a registry snapshot of an unreleased tree | claim | deleted; no redirect | EXECUTED |
| `tokens/*.json` `"since": "0.12.0"` (27) | the first release that shipped a token | claim | `"0.13.0"` | EXECUTED (§8) |
| `tokens/kuiper.removed.json` `"removed": "0.12.0"` (24) | the release that dropped a name | claim | `"0.13.0"` | EXECUTED (§8) |
| `static/r/tokens/*`, `static/v0.13.0/r/tokens/*` (162) | the published copies | generated | `bun run build:tokens` | EXECUTED |
| `src/lib/registry/ui/field/field-context.svelte.ts:14` "The 0.12.0 keys" | a comment in shipped source | claim | "The keys before 0.13.0", as the eight controls' comments say | READ |
| `src/lib/site/upgrade/0.13.0.ts:41` `WHO[1]` | who the guide is for | claim, and a defect (§6) | 0.12.0 was never released, so this page is the path from 0.11.0 | INFERRED |
| `0.13.0.ts` `UNCHANGED.names`, `.values` | what did not change | claim, from 0.11.0 | scoped to what the sections do not name | READ |
| `src/lib/site/changelog.ts:3,21,23,25,202` | sample values in doc comments | example | 0.13.0's | READ |
| `src/lib/site/test-views/field-keys/*` (5) | "as a 0.12.0 `Field`" | example | "a 0.11.0 `Field`": the keys are 0.11.0's (§3) | EXECUTED |
| `tests/e2e/field-keys.spec.ts:2` | the same | example | the same | READ |
| `tests/unit/registry.test.ts:1456-1500` | the releases' order; 013's and 014's lines | assumption | no 0.12.0 heading; content read in the 0.13.0 entry | EXECUTED (fail) |
| `registry.test.ts:1817-1828` | the snapshot exists; the tag, if made | assumption | dropped; the never-published test takes the snapshot | EXECUTED (fail) |
| `registry.test.ts:1909,1995-2030` | 016's, 019a's and 019's lines | assumption | read in the 0.13.0 entry | EXECUTED (fail) |
| `registry.test.ts:2238,2394,2490,2514`, `toast-site.test.ts:125` | slices that end at `\n## 0.12.0` | assumption, silent | end at `\n## 0.11.0`; the helper fails if a heading is missing | EXECUTED (pass while broken) |
| `registry.test.ts:2589`, at `71cb067` | `022t`'s slice, the sixth | assumption, silent | the helper's first part (§10) | READ |
| `registry.test.ts:2076` "released snapshots" | a folder per tag, held to it | gap | adds the converse: every `static/v*` is a tag's or the current version's | EXECUTED (fails on `v0.12.0`) |
| `tests/unit/generated.test.ts:1662` | "never-published snapshots" | precedent | adds `static/v0.12.0` | READ |
| `generated.test.ts:1146` "read their 0.12.0 value" | a test title | example | "today's value" | READ |
| `tests/unit/registry-comments.test.ts:121-160` | the 0.12.0-only release check | assumption, dead | deleted | READ |
| `registry-comments.test.ts:230-261` | the 0.12.0 entry's site paragraph and naming paragraph | assumption | the site paragraph is read in 0.13.0's entry, at `/v0.13.0/r`; the naming test becomes "the entry names the Kuiper Design System" | EXECUTED (fail) |
| `tests/unit/component-data.test.ts:39-41` "kbd 0.12.0" | a page's Updated fact | assumption | `kbd` reads 0.13.0; `meter` stands for an older release, 0.4.0 | EXECUTED |
| `tests/unit/changelog-page.test.ts:148-160` | releases[1] dated 2026-11-15 | assumption | releases[1] is 0.11.0, 2026-11-07 | EXECUTED (fail) |
| `tests/unit/changelog-page.test.ts:28` `hrefs("[a](#v0-12-0)")` | a sample anchor in a parser test | example | `#v0-13-0` | READ |
| `tests/unit/changelog-page.test.ts:148` "above 0.12.0 and 0.11.0" | a comment | example | "above 0.11.0" | READ |
| `scripts/bench/kuiper.ts`'s `releases` and `versionedRegistries` | the scorecard's raw counts: `^## ` headings and `static/v*/r/` folders | derived | 12 → 11 and 9 → 8; no row's rubric counts them | READ (the spec review) |
| `tests/e2e/site.spec.ts:549,561` | `kbd` links `#v0-12-0`; the anchor exists | assumption | `meter` links `#v0-4-0`; `#v0-12-0` is absent | INFERRED (not run) |
| `tests/fixtures/pluto-allowed.json:8,19,269` | history from `## 0.12.0`; record to `## 0.12.0`; a registry-comments guard | assumption | history from `## 0.11.0`, 28; record to `## 0.11.0`, 21; the guard entry goes | EXECUTED (counts) |
| `tests/smoke/code-add.test.ts:188,545,602` | "a fresh 0.12.0 install", "the v0.12.0 add" | example | 0.13.0; the behaviour already is 0.11.0 → 0.13.0 | READ |
| `tests/unit/literals.test.ts:414`, `scripts/lint-literals.ts:288` | "one pattern for 0.12.0" | example | "for 0.13.0" | READ |
| `scripts/rename-kuiper.ts` (7) | `020`'s one-off rename and verify script | history | unchanged; it goes in 0.14.0 (`020`) | READ |
| `roadmap.md:13` "(0.12.0, after `018`)" | where the first scorecard run was | claim, as a label | "(the 0.12.0 tree, never released, after `018`)" | READ |
| `roadmap.md:68` `020` "Depends on: the `v0.12.0` tag" | a dependency | claim | `dad6f76`, 0.12.0's last commit, never tagged | EXECUTED |
| `roadmap.md:232` Q2 "`v0.12.0` was tagged on `dad6f76`" | an answer by events | claim, false | corrected, with the ruling | EXECUTED |
| `roadmap.md`, 0.13.0 table | the row the owner named, "0.12.0 was never released" | missing | added: `020d` | READ |
| `handoff.md:36` "then the local `v0.12.0` tag" | the order to the tag | claim | 0.12.0 was never released; the next tag is `v0.13.0` | READ |
| `benchmark-scorecard.md:12,52,436` "Pluto 0.12", "`ea1f9bd` (0.12.0 …)" | the measured tree's version string | history | kept; l. 52's definition gains "never released" (an instrument is completed in place) | EXECUTED (`ea1f9bd`'s `package.json` reads 0.12.0) |
| `benchmark-scorecard.md:296` "The 0.12.0 entry's 'delete these lines' list" | row 11's evidence, today | claim | "The 0.13.0 entry's", at this spec's re-run | READ |
| Specifications (205 lines), reviews (112), research (44) | e.g. `019` "Blocks: the `v0.12.0` tag"; `020` "Its code names stay `pluto` in 0.12.0" | history | unchanged | READ |
| `README.md`, `AGENTS.md`, `context/README.md` | | | none: no 0.12.0, and the alias window holds | EXECUTED (grep), §3 |
| `origin/release/0.12.0` | a public branch at `dad6f76` | the owner's | the owner's call: it is a push (`020d` Q1) | EXECUTED |
| A local `v0.12.0` tag, if any | on the machine that built `020` | the owner's | `git tag -d v0.12.0` there, never pushed | READ |
| Component pages `kbd`, `error-summary`, `product-home` | "Updated 0.12.0", linking `#v0-12-0` | derived | read 0.13.0 once the heading goes | EXECUTED |
| Site version pickers, install page | | | none: every URL is built from `package.json` | READ |

## 8. The probe

On a copy of `b01e754` in the scratch folder, with `node_modules` linked (EXECUTED):

- **Baseline:** `bun test ./tests/unit`: 1,905 pass, 2 skip, 2 fail. The two failures are machine timings (`timings (decision 20)` and `the streaming budget`). An EISDIR in the rename guard came from the linked `node_modules`, and went once it was excluded in the copy's own `.git/info/exclude`.
- **Delete `static/v0.12.0/` alone:** `tokens-lifecycle.test.ts` fails 2 of 9: `code.text (--code-text)` expected `0.13.0`, received `0.12.0`; `--code-foreground`'s `removed` the same.
- **Then rewrite `since` and `removed` in `tokens/`:** 9 of 9 pass. After `bun run build:tokens`, `tokens-published`, `tokens-lifecycle` and `tokens-unchanged` pass 28 of 28. `git diff` shows `src/app.css` and `static/r/styles/` unchanged.
- **All three changes, before `build:tokens`:** the unit suite fails 17 tests. One is a timing. The other 16: the eleven that read the 0.12.0 entry or the releases' order; `registry.test.ts:1819`, which requires the snapshot; `kbd`'s Updated fact; the two DTCG copy checks, which pass once `build:tokens` has run; and the rename guard's counts. The five slices to `\n## 0.12.0` pass, untested (§5).
- **Not run:** the browser, screen-reader and smoke suites; `bun run check`; the build.

## 9. What was not checked

- **Whether the site was ever deployed.** The host is refused by this session's proxy. GitHub's environments API is refused too (`gh api`: "not permitted through this proxy").
- **The owner's machine:** whether a local `v0.12.0` tag is there now.
- **Who installed from `release/0.12.0`.** GitHub's traffic data was not read.
- **Each history line, one by one.** The 361 lines in landed specifications, reviews and memos were classified by their folder, and sampled.

## 10. The new base, after the spec review (2026-11-17)

The design lead ruled that `020d` builds after the current batch lands: `022t`, `022v` and `022w` in lane I, and `022x`, `022y` and `022z` in lane E. The specification is redrawn on `71cb067` (`022t` landed) plus `lane-i-run5`'s `CHANGELOG.md`, which holds `022v` and `022w` uncommitted. The figures below are that base's. The build re-takes them on the base that lands.

- **`71cb067` holds `b01e754`** (EXECUTED, `git merge-base --is-ancestor`). `022t` added two 0.13.0 bullets, `error-summary` (`attempt`) and `sign-in`, `sign-up`, `settings`, and one slice to `\n## 0.12.0`, at `registry.test.ts:2589` (READ). `lane-i-run5` adds `022v`'s `code-block` bullet and rewords `022w`'s `search-field` bullet. It adds no line naming 0.12.0 (EXECUTED, `git diff 71cb067`). `lane-e-run5` (`022x`, `022y`) touches no changelog and no 0.12.0 line (EXECUTED).
- **The entries.** `## 0.13.0` is at line 5 and `## 0.12.0` at line 36. The naming paragraph is line 40, and 0.12.0's theme bullet line 44. The 0.13.0 entry has 26 bullets, and the 0.12.0 entry 18 (EXECUTED).
- **Heads in both entries.** Seven single heads of the 0.13.0 entry also head a 0.12.0 bullet, once `pluto-theme` reads `kuiper-theme`: `kuiper-theme` (two bullets), `highlighter`, `app-shell`, `use-highlighted-code`, `code-editor`, `code-block` (`022v`) and `error-summary` (`022t`). The doc-comment bullet's head names 61 items, 14 of which head a 0.12.0 bullet (EXECUTED). The spec review found the same split, and that it would break the counts and positions of the 0.12.0 tests if they read the whole folded entry (the review, finding 1).
- **The `pluto` counts hold:** 21 in the 0.13.0 entry, 10 in the 0.12.0 entry, 28 from `## 0.11.0` (EXECUTED).
- **Live lines.** The guard's grep finds 284 at `71cb067`: the 283 of §7 and `022t`'s slice (EXECUTED).
- **Changelog slices.** In `tests/`, the pattern `indexOf("## ` or `indexOf("\n## ` matches 16 times in 11 readers in 3 files: `registry.test.ts`, `registry-comments.test.ts` and `toast-site.test.ts` (EXECUTED, `git grep 71cb067`). Six end at `\n## 0.12.0`.
- **The upgrade guide's trap, run.** The spec review installed `v0.11.0` into a scratch app, with a component that uses `pluto-enter`, then ran 0.12.0's notes' command against `/v0.13.0/r`. The add and the build both exit 0, and the animation is lost. Deleting the stale `--code-builtin` lines loses an app's own `text-code-builtin` class the same way, with no error (EXECUTED by the review). So the guide also needs a grep step before the deletion.
- **The bench.** `scripts/bench/kuiper.ts` counts 12 `## ` releases and 9 `static/v*/r/` folders. The fold makes them 11 and 8 (READ, the review). Row 11's rubric counts neither (INFERRED, the review).
- **Missed in §7, now added:** `changelog-page.test.ts:28`, `:148` and `022t`'s slice (the review, finding 9).
