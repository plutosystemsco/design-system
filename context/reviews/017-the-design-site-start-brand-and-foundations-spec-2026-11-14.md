# Review of 017 — The design site: Start, Brand and Foundations

Reviews [`specifications/017-the-design-site-start-brand-and-foundations.md`](../specifications/017-the-design-site-start-brand-and-foundations.md). It was read together with `015`, whose review is [`015-the-design-site-spec-2026-11-14.md`](./015-the-design-site-spec-2026-11-14.md). Findings on the boundary appear in both, each from its own side.

- **Date:** 2026-11-14
- **Status:** in review
- **Reviewer:** a reviewer; not the author
- **Reviewed:** the specification as drafted, 2026-11-14 (181 lines). Checked against:
  - the constitution;
  - `decisions.md`'s 2026-11-14 entries and the identity rulings it cites (N1, E6, C2, D1, H1, I5, I9, J2, J4, K3, L3, M1–M4, A4, G5, "Frost only");
  - `001` decision 16; `015`; `016`;
  - the site memo §4.1, §4.2, §5.3;
  - the working tree at `ef53f01` plus `014`'s changes.
- **Re-ran:** nothing in the repository was written except this file and its sibling.
  - **Page counts** (INFERRED from the tables): Start 5, Brand 9, Foundations 7, so 21. 81 + 21 = 102. axe 102 × 3 widths × 2 projects = 612. All as stated.
  - **npm** (EXECUTED, `npm view`, 2026-11-14): `fontkit@2.0.4` exists, MIT, with nine caret dependencies (`brotli`, `restructure`, `unicode-properties` …); `wawoff2@2.0.1` exists, MIT, depending on `argparse`. Both are pinned through `bun.lock` once added.
  - **The source data** (READ):
    - `tokens/pluto.tokens.json`'s `mark` group: `dot` 0.3, `gap` 0.08, `lockupScale` 0.87, `rise` 0.36, `lockupGap` 0.1. `type` has `tracking.mark` −0.04 and `weight.bold` 700.
    - `four-dot/lockup.svelte:32`: `font-heading font-bold tracking-mark`. So "IBM Plex Sans at 700 with `--tracking-mark`" matches the live lockup.
    - `001` decision 16: clearspace "one dot-pair height", minimum "the mark alone below 20 px of lockup height". As 017 states.
    - `scripts/contrast.ts` exports `contrastTable`, `fieldRows`, `glassRows`, `glassOverGlassRows`. Decisions 5 and 6 can read them.
    - `tests/smoke/*.test.ts` run the repository's own CLI binary (`bin(REPO, "shadcn-svelte", "add", …)`) against a local server, not `bunx … @1.7.1` from the network.
  - The decision 4 claims (SvelteKit 3.1.0 writes a prerendered `.svg` endpoint at its exact path; the 2,077-byte lockup; fontkit's `cmap` error on WOFF2) were not re-run. They are EXECUTED by the design lead and plausible.

## Acceptance criteria against evidence

1. **Packages:** countable. `deps.test.ts` is `015`'s file (finding 1).
2. **102 pages:** countable once `015`'s `sitemap.test.ts` stops pinning 81 (finding 1).
3. **Suites inherited over 102 pages:** countable if `015`'s tests read the list. "25's method" names no page and no budget for 017 (finding 6).
4. **Keyboard:** countable. It adds to `015`'s `keyboard.spec.ts` (finding 1).
5. **Downloads exist:** countable.
6. **Drawn from the tokens:** countable. The changed-token check is a good mutation test.
7. **Outline width within 1%:** **not runnable on a clean clone as written.** The unit suite runs before the e2e suite that writes its fixture (finding 3).
8. **No four-colour mark on a field:** countable. A "don't" specimen on `/brand/mark/` would trip it (finding 7).
9. **The figures:** "0 text elements at 390" is ambiguous if the labels are hidden by CSS (finding 7).
10. **Generated tables:** countable.
11. **Settled only:** countable but weak. Only elements the builder marks `data-claim` are checked (finding 5).
12. **Start is true:** **not runnable as written.** The page's commands name the network CLI and the live origin (finding 2).
13. **Motion obeys:** countable. Whether specimens play on load is unsaid (finding 6).
14. **Literals:** countable.
15. **Suites, documents, walk:** countable.
16. **Released:** omits `014` from the tag's list (finding 4).

## Findings table

| # | Severity | Finding | Where |
|---|---|---|---|
| 1 | Medium | 017 is not "new files only". It must add tests to five of `015`'s files, change a literal count, and build on page templates `015` never specifies | Kind; decision 1; criteria 1–4, 5, 7–9, 12, 13; Scope |
| 2 | Medium | Criterion 12 cannot run "from the code blocks' own text": those name `bunx … shadcn-svelte@1.7.1` (network) and `REGISTRY_URL=<SITE_ORIGIN>` (the live site), and begin by creating an app | criterion 12; decision 1 (`/start/install/`) |
| 3 | Medium | Criterion 7's fixture is written by an e2e test and read by a unit test. `bun run test` runs unit first, so a clean clone fails or reads a stale value | criterion 7 |
| 4 | Low | The tag's list in criterion 16 omits `014`, against the header and the owner's ruling | criterion 16 |
| 5 | Low | "Settled only" checks only what the builder chooses to mark | decision 2; criterion 11 |
| 6 | Low | Motion page: do the specimens play on load? And criterion 3's "25's method" has no page or budget for 017 | decision 7; criteria 3, 13 |
| 7 | Low | Two edges: a "don't" specimen of the four-colour mark on a field would fail criterion 8; and criterion 9's "0 text elements" must mean rendered ones | decisions 1, 3; criteria 8, 9 |
| 8 | Low | The Colour page's glass over dark yellow is the tightest glass row (muted 4.60). Say the values sit in `foreground` | decision 5 |
| 9 | Low | The search index's token entries belong to 017, not `015` | decision 1 (`/foundations/tokens/`); `015` decision 18 |

## Findings, most severe first

1. **Medium: the boundary with `015` leaks** (Kind; Scope; criteria 1–5, 7–9, 12, 13).
   - **The defect.** `015` decision 2 says "017's builder never edits an item page or a shared test file", and the ownership table gives 017 the shared specs "via the list only". But 017's criteria add tests to `015`'s files:
     - `deps.test.ts` (1);
     - `keyboard.spec.ts` (4);
     - `site.spec.ts` (5, 7, 9);
     - `doors.spec.ts` (8, 13);
     - `site-add.test.ts` (12).

     `015`'s `sitemap.test.ts` asserts 81 pages (015 criterion 2), which must become 102. Besides the tests, 017 builds "on `015`'s templates", but `015`'s `page/` folder lists only landing and component parts. There is no quiet leaf template (breadcrumb, title, rail, productive `<main>`) and no expressive Brand shell. Changing `015`'s templates "beyond what a page needs" is out of scope, so either the builder edits `015`'s files or writes a second chrome.
   - **Fix.** Pair this with `015`'s finding 8:
     - `015` builds `page/leaf.svelte` (used by its changelog) and `page/brand.svelte`;
     - `015`'s counts read the list or its `spec` tag;
     - 017's Kind and Scope say it appends `describe` blocks to the five named files and edits no line `015` wrote.

2. **Medium: criterion 12 cannot run the page's commands as shown** (criterion 12; decision 1, `/start/install/`).
   - **The defect.** The install guide shows what a reader types:
     - create an app;
     - `shadcn-svelte init`;
     - `REGISTRY_URL=<SITE_ORIGIN>/v0.12.0/r bunx --bun shadcn-svelte@1.7.1 add …`.

     The smoke suites run the repository's own CLI binary against `build/` on a local port. They never fetch the CLI from npm or the registry from the live origin (READ, `tests/smoke/*`).
   - **Failure.** Run "from the code blocks' own text", the test needs the network and a deployed site. Before the first push there is none, and `SITE_ORIGIN` may still be a placeholder.
   - **Fix.** Say the test takes each block's text and applies exactly three named substitutions:
     - `bunx --bun shadcn-svelte@1.7.1` becomes the local binary;
     - `SITE_ORIGIN` becomes the local server;
     - the app-creation step becomes the existing `kit3` fixture.

     Assert that nothing else in the text differs. Then each step exits 0, and `add button`'s written files equal the page's list.

3. **Medium: criterion 7's fixture is read before it is written** (criterion 7).
   - **The defect.** `brand-assets.test.ts` (unit) compares the outlined word with "the browser-measured width … read once by `site.spec.ts` and written as a fixture". `bun run test` is `test:unit && test:e2e && test:smoke` (READ, `package.json`).
   - **Failure.**
     - On a clean clone the unit test finds no fixture and fails.
     - If the fixture is committed, a change to the lockup leaves it stale until the e2e run, after the unit run has already passed on the old value.
   - **Fix.**
     - Commit the fixture.
     - `site.spec.ts` asserts the browser width equals it, to 0.1 px, and fails with "run `bun scripts/site/lockup-width.ts`" if not.
     - The unit test compares the outline with the committed value.

4. **Low: the tag list** (criterion 16).
   - **Fix.** "after the change reviews of `013`, `014`, `015`, `016` and `017`", as the header and `decisions.md` ("Commits per specification…") say.

5. **Low: "settled only" checks what the builder marks** (decision 2; criterion 11).
   - **Fix.** Every `p`, `li`, `td` and `figcaption` inside a Brand page's `<main>` carries `data-claim` with a source comment, or `data-claim="none"` (for headings, navigation and copy about the page itself). The test counts unmarked elements: 0.

6. **Low: the motion page and the budgets** (decision 7; criteria 3, 13).
   - **The defect.** "Each live, with a Replay button" leaves open whether the entrance specimens play on load. Several playing at once is several entrances on one page, against "one entrance per page". Criterion 3 inherits "25's method" without saying which 017 page is measured or to what budget.
   - **Fix.** Specimens rest in place on load and move only on Replay. Name one 017 page for `perf.spec.ts` (`/brand/colour/`, the heaviest) with a budget set from measurement, or strike "25's method".

7. **Low: two edges in criteria 8 and 9** (decisions 1, 3).
   - **Fix.**
     - Say `/brand/mark/` shows no four-colour mark on a field even as a "don't" (draw the rule in words, or show the one-colour version).
     - Criterion 9 reads "0 rendered text elements (`getClientRects().length` 0 or `display: none`)".

8. **Low: the Colour page's dark glass over yellow** (decision 5).
   - **The defect.** `016` records muted text on dark glass over `field-3` at 4.60, the tightest glass row.
   - **Fix.** Write in: the glass panels' values and sentences are `foreground`. `muted-foreground` is not used on the yellow band.

9. **Low: the token search entries** (`015` decision 18 and finding 10 there).
   - **Fix.** 017 adds the theme roles and primitives to `/search.json`, each pointing at `/foundations/tokens/#<name>`. Its criterion 3 inherits criterion 21 with "and every token, each at its anchor".

## What is right

- **The downloads follow the owner's words and `016`'s constraint exactly.**
  - The file names say "on colour and on paper".
  - The four-colour mark is offered only for light grounds.
  - Every field gets a one-colour file in its legend, with ratios from `011` and `016`.
  - The files are generated from the token file, and criterion 6's mutation check proves it.
- **The dark expressive lockup is left out with a reason** (`008`'s product rule), not by omission.
- **Settled decisions only.** The two open items (icons, the signature device) are named with the exact sentence to show. The clearspace and minimum are `001`'s, not invented.
- **The figures have a phone layout of their own,** answering the memo's EXECUTED finding on direction C.
- **Font licence:** outlining IBM Plex Sans into a logo is ordinary OFL use. The page credits the face.

## Constitution checks

- **§2.3:** no item is added. 017's pages are guidance, not item pages.
- **§3:** the brand section is guidance, as amended. Naming Pluto Docs and Pluto Sheets states a naming rule (A4), not an offer.
- **§4.1:** the downloads are files a person takes away. No app installs them.
- **§4.3:** every number is read from the token file or `contrast.ts`; criteria 6, 10 and 14 hold it. Held.
- **§4.4:** axe over 102 pages in both themes; figures `role="img"` with their dimensions also as text; copy buttons by keyboard (criterion 4); Replay obeys reduced motion (criterion 13). Held.
- **§4.5, §4.6:** two development packages, exact versions, MIT, `bun.lock`. Held. Neither reaches an app.
- **§6:** no prior art copied. Atlassian's "say more, say less" voice format is an idea studied, written in this system's words.

## Risk

017 is the right size for one builder.

- **The engineering is small:** one generator, two figures, three generated tables.
- **The writing is large.** 21 pages of prose must trace to settled decisions in the brand's voice. The Brand checkpoint edits nine. The change reviewer should read all 21, not sample.
- **Most likely to go wrong:**
  - criterion 7's fixture order (finding 3);
  - criterion 12's runnable install guide (finding 2);
  - pages that need chrome `015` did not build (finding 1).

## Verdict

Does not land yet: findings 1 to 3 (Medium) stand. Also, 017 cannot be fit to build before `015`'s review is dispositioned, because its templates, tests and search are `015`'s (`015` review findings 8 and 10).

## Disposition

(Filled in after the design lead answers.)

## Second review

- **Date:** 2026-11-14
- **Reviewed:**
  - the specification as revised (358 lines), with its "Review dispositions";
  - `015` as revised;
  - `decisions.md`, "The design site's review calls, taken while the owner was away (2026-11-14)".
- **Re-ran** (nothing in the repository written but the two review files):
  - **`shadcn-svelte init`** (READ, the locked CLI, `node_modules/shadcn-svelte/dist/index.mjs`, the `init` command):
    - it resolves a preset, prompting when none is given;
    - it writes `components.json`;
    - it fetches `new URL("/init?preset=…", <registry base>)`, which defaults to `shadcn-svelte.com`.

    The smoke suites never run `init`: both fixtures, `kit2` and `kit3`, ship their own `components.json` (READ, `tests/smoke/fixtures/`).
  - **The search boundary:** see `015`'s second review, S3 (READ, `015` decision 18 and criterion 21).
  - The rest was checked by reading: the six-file append list, the lockup-width fixture's order, the motion page's rest state, `data-claim` coverage, the Colour page's `foreground`-only glass, and the `/brand/colour/` budget.

### The first review's findings, against the revised text

| # | Was | Now | Where it is resolved |
|---|---|---|---|
| 1 | Medium | **Resolved for templates, counts and the six test files; open for search** (S2) | Kind; decisions 1, 9; `015` decision 2 |
| 2 | Medium | **Resolved for the CLI, the origin and app creation; open for `init`** (S1) | criterion 12 |
| 3 | Medium | **Resolved**: committed fixture, written by a named script, checked by the browser | decision 4; criterion 7 |
| 4 | Low | **Resolved** | Ships with; criterion 16 |
| 5 | Low | **Resolved**: every `p`, `li`, `td` and `figcaption` is marked, and unmarked ones count 0 | decision 2; criterion 11 |
| 6 | Low | **Resolved**: specimens rest until Replay; `/brand/colour/` has a budget (see S4) | decisions 7, 11; criteria 13, 15 |
| 7 | Low | **Resolved** | decisions 1, 3, 4; criteria 8, 9 |
| 8 | Low | **Resolved** | decision 5; criterion 8 |
| 9 | Low | **Moved to 017 in name; it cannot land without editing `015`** (S2) | decision 10; criterion 3 |

### Second-review findings

| # | Severity | Finding | Where |
|---|---|---|---|
| S1 | Medium | The install guide's `shadcn-svelte init` step is not covered by the three substitutions. It prompts and fetches `/init` from the network, and the smoke apps never run it | decision 1 (`/start/install/`); criterion 12 |
| S2 | Medium | The token entries in search need `015`'s endpoint and `015`'s `search.test.ts`, neither of which 017 may edit. Criterion 3's "every token in the index" names no test 017 owns | decisions 9, 10; criterion 3 |
| S3 | Low | Criterion 2 claims `sitemap.test.ts`, "unchanged", checks "102 entries in all, 21 tagged 017". `015`'s test counts only the entries tagged `"015"` | criterion 2 |
| S4 | Low | `/brand/colour/`'s budget is borrowed from the home page and unmeasured. Four blurred glass panels over full-bleed fields under 4× CPU are not the home page | decision 11; criterion 15 |

1. **S1, Medium: the `init` step** (decision 1, `/start/install/`; criterion 12).
   - **The defect.** The guide holds "an empty SvelteKit app; `shadcn-svelte init`; `add pluto-theme`; `add button`". Criterion 12's three substitutions replace the CLI's address, `SITE_ORIGIN` and the app-creation step. They then assert that "nothing else in any block's text differs", and that "each step exits 0". The locked CLI's `init`:
     - prompts for a preset unless `--preset` is given;
     - fetches `/init?preset=…` from the registry's base URL. That is `shadcn-svelte.com` by default; pointed at the local server, the path does not exist.

     `kit3` already holds a `components.json`, and no smoke suite runs `init`.
   - **Failure.** The `init` step either hangs on a prompt, needs the network, or fails against the local server. Criterion 12 cannot pass offline as written.
   - **Fix.** Make it a fourth named substitution: the `init` block is not run. The test asserts that its text equals a fixture, and that `kit3`'s committed `components.json` is what that command writes for the page's stated answers. Name those answers (the preset, or the flags) on the page, so a reader's `init` is non-interactive. Or run `init` in an opt-in, networked smoke test and say so.

2. **S2, Medium: the search entries cross the boundary** (decisions 9, 10; criterion 3; `015` second review S3).
   - **The defect.** Decision 10 "appends to `/search.json` one entry for each theme role and each primitive". `/search.json` is `015`'s endpoint (`src/routes/(site)/search.json/+server.ts`). `015`'s criterion 21 asserts "one entry per page, each path once", which the anchor entries break. Decision 9's table lists six of `015`'s files to append to, and `search.test.ts` is not one of them. Yet criterion 3 says criterion 21 "also holds, with every token in the index, each at its anchor".
   - **Failure.** 017 must edit a line `015` wrote, against its Kind and Scope. Its token-entry criterion has no test.
   - **Fix.** With `015`'s S3:
     - `015`'s endpoint globs `src/lib/site/search/*.ts`;
     - 017 adds `tokens.ts` there;
     - `015`'s criterion 21 counts only entries without a `#`;
     - 017 appends a `describe` to `search.test.ts`: every theme role and primitive once, at its anchor, which resolves on the built `/foundations/tokens/`.

     Decision 9's table gains that row.

3. **S3, Low: criterion 2's counts.**
   - **Fix.** Either 017 appends a `describe` to `sitemap.test.ts` ("21 entries tagged `017`, every one built"), and lists it as an eighth append; or criterion 2 drops "102" and "21 tagged" and cites `015`'s "every entry has a built page".

4. **S4, Low: the Colour page's budget** (decision 11).
   - **Fix.** Label the borrowed budget INFERRED. Measure `/brand/colour/` at 017's checkpoint with `015`'s script, and set its budget from that median plus 20%. A budget looser than the home page's needs the design lead's ruling, as `015` decision 23 requires.

### Verdict, second review

Does not land yet: S1 and S2 (Medium) stand. S1 is one more named substitution in criterion 12. S2 is closed by `015`'s S3 fix plus one row in decision 9. Neither needs a design change. 017 also waits on `015`'s second review being dispositioned.

## Third review

- **Date:** 2026-11-15
- **Reviewed:**
  - the specification as revised again (388 lines), with its "Second review" dispositions;
  - `015` as revised again.
- **Re-ran** (READ, nothing written but the review files):
  - **SvelteKit 3.1.0's handling of `$lib`:** `node_modules/@sveltejs/kit/src/exports/vite/index.js:76–80`, `removed_modules`, error `module_removed_lib`. `src/messages/build-errors.js:521–527`: "`$lib` has been removed. Use `#lib` instead … To keep using `$lib`, add `alias: { '$lib': 'src/lib' }`".
  - **What the locked CLI's `init` writes:** `libAliasDefault` is `#lib` when `package.json` has `imports["#lib/*"]` (function `Ls`); otherwise `$lib`.
  - **The two smoke fixtures:**
    - `tests/smoke/fixtures/kit3/{components.json,package.json,tsconfig.json}`: SvelteKit 3, `imports["#lib/*"]`, `#lib` aliases, `"extends": "$app/tsconfig"`;
    - `kit2`: SvelteKit 2, `$lib`.
  - `tests/smoke/registry-add.test.ts:80–100` labels them "A, SvelteKit 3 with #lib" and "B, SvelteKit 2 with $lib".

### The second review's findings, against the revised text

| # | Now | Where |
|---|---|---|
| S1 | **The mechanism is sound; the file it writes is wrong** (U1) | decision 13; criterion 12 |
| S2 | **Resolved,** through `015`'s `search/sources/` hook and an appended `describe` in `search.test.ts` (subject to `015`'s T5) | decisions 9, 10; criterion 3 |
| S3 | **Resolved.** `sitemap.test.ts` gains 017's block: 21 tagged, 102 in all | decision 9; criterion 2 |
| S4 | **Resolved.** The borrowed budget is labelled INFERRED, measured at the checkpoint, and set at median + 20% | decision 11 |

### The author's option for S1, judged on its merits

The author chose to write the page's own `components.json` into a scratch copy of `kit3`, rather than comparing the page with `kit3`'s committed file. The mechanism is the better of the two:

- it tests the file the reader is told to write;
- it runs offline;
- it proves the `add` steps and the build on that file.

I would keep it.

The reasoning behind the file's *contents* is wrong, and it decides the outcome. Decision 13 says the page's file uses "the paths `init` writes for a SvelteKit app (`$lib/components/ui` and the rest)", and that "`init` never writes" `#lib`. Both are untrue for the SvelteKit this repository pins:

- `init` writes `#lib` whenever the app's `package.json` has `imports["#lib/*"]`;
- SvelteKit 3.1.0 has removed `$lib`.

### Third-review findings

| # | Severity | Finding | Where |
|---|---|---|---|
| U1 | High | Criterion 12 writes a `$lib` `components.json` into a SvelteKit 3 app. `$lib` is removed there, so the installed files fail `vite build`. The install guide would teach a setup that fails on the current SvelteKit | decision 13; criterion 12; decision 1 (`/start/install/`) |
| U2 | Medium | `brand-assets.test.ts` and `tokens-pages.test.ts` read `build/`, which is absent when the unit suite starts on a clean clone (shared with `015`'s T5) | criteria 5, 10 |

1. **U1, High: the guide's `components.json` uses an alias SvelteKit 3 removed** (decision 13; criterion 12).
   - **The defect.** The page's file names `$lib/components/ui` and the rest. Criterion 12 writes it over a scratch `kit3`, a SvelteKit 3.1.0 app, and requires `add`, `vite build` and `svelte-check` to pass.
   - **Failure.** The CLI writes items whose imports are `$lib/…`. SvelteKit 3's plugin rejects every one with `module_removed_lib`. Even before that, the CLI may fail to resolve `$lib` against `$app/tsconfig`, which no longer maps it. Either way criterion 12 fails, and a reader who follows the guide on a fresh SvelteKit 3 app gets a broken build.
   - **Fix.**
     - The page's `components.json` uses `#lib/components`, `#lib/components/ui`, `#lib/hooks`, `#lib/utils` and `#lib`, and `registry` at `<SITE_ORIGIN>/v<version>/r`.
     - The page also shows the `package.json` `imports` block those aliases rely on. `kit3`'s block is the model: `"#lib": "./src/lib"`, `"#lib/*": [ "./src/lib/*", "./src/lib/*.ts", "./src/lib/*/index.ts" ]`.
     - One sentence covers SvelteKit 2 apps (`$lib` in place of `#lib`).
     - `init`'s answers on the page then match what `init` writes in a SvelteKit 3 app.
     - Keep criterion 12's mechanism. Optionally run it a second time on a scratch `kit2` with the page's `$lib` variant, so both sentences are proved.
     - This pairs with `015`'s T1 (the shown sources).

2. **U2, Medium: two unit tests need a build that has not happened** (criteria 5, 10).
   - **The defect.** `brand-assets.test.ts` reads `build/brand/downloads/`. `tokens-pages.test.ts` reads the built `/foundations/` pages. On a clean clone the unit suite runs before Playwright's `webServer` builds.
   - **Fix.** Follow `015`'s T5 decision: build once before the unit suite, or move these checks to Playwright files that open no page. The token-table checks could instead render from the generator's functions without `build/`.

### Verdict, third review

Does not land yet: U1 (High) and U2 (Medium) stand.

- **U1** is a change to the page's `components.json` and one added sentence. The test mechanism stays.
- **U2** closes with `015`'s T5.

Every first- and second-review finding is otherwise resolved in the decisions and criteria.

## Fourth review

- **Date:** 2026-11-15
- **Reviewed:** the specification as revised again (412 lines), with its "Third review" dispositions; `015` as revised again.
- **Re-ran:** see `015`'s fourth review for Playwright's `webServer` order, which `build-output.spec.ts` relies on (READ). `kit2` (READ):
  - it is a committed fixture, `tests/smoke/fixtures/kit2/`, with its own `bun.lock` and `svelte.config.js`;
  - `registry-add.test.ts` already copies it to scratch, runs `bun install --frozen-lockfile` and `svelte-kit sync`, and `add`s items into it.

### The third review's findings, against the revised text

| # | Now | Where it is resolved |
|---|---|---|
| U1 | **Resolved.** The page shows `kit3`'s `imports` block and a `#lib` `components.json`, and says how SvelteKit 2 differs. Criterion 12 writes both into a scratch `kit3`, checks the imports use `#lib`, and proves the SvelteKit 2 sentence on a scratch `kit2` | decision 13; criterion 12 |
| U2 | **Resolved.** The unit tests call `downloadSvg` and the table generators from source. Every check of the built output is 017's block in `build-output.spec.ts` | decision 9; criteria 2, 3, 5, 10, 11 |

### The new pieces

- **`downloadSvg(tokens, file)`:** sound. It is a plain function over the token file and the font file, as decision 4's EXECUTED outline was. `build-output.spec.ts` checks that the built files equal its output, so the endpoint wrapper cannot drift from it.
- **The second run on `kit2`.**
  - **Where it comes from:** the committed fixture.
  - **No new lockfile:** the run copies the fixture with its committed `bun.lock`, as the existing smoke suite does.
  - **The network:** it needs exactly what the existing `kit2` smoke run needs. `bun install --frozen-lockfile` before `add`, and the install of the items' npm dependencies after it, come from the npm registry or Bun's cache. The design-system registry is the local server. So it is offline with respect to this site and GitHub, which is what criterion 12 claims. It is not offline with respect to npm, and the spec does not say it is.
  - **Provable:** yes, to the same standard as `registry-add.test.ts`'s `kit2` run.

### Fourth-review findings (all Low, with fix text to write in)

1. **W1, Low: the second run adds a substitution** (criterion 12).
   - **The defect.** Criterion 12 says "exactly four named substitutions". The `kit2` run adds a fifth (`#lib` read as `$lib`, and the `imports` block not written).
   - **Fix.** Write in: "The second run applies the four, plus the page's SvelteKit 2 sentence: `#lib` read as `$lib`, and the `imports` block not written. Nothing else differs."

2. **W2, Low: say what the smoke runs need** (criterion 12).
   - **Fix.** One line: "Both runs install from the npm registry or Bun's cache, as the existing smoke suites do. Neither reaches this site's deployment or GitHub."

### Verdict, fourth review

Fit to build, with W1 and W2 taken as write-ins, once `015` is built and committed as its own verdict allows. Every Medium and High from the four reviews is resolved in the decisions and criteria.
