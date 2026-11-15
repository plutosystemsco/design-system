# Review of 017 — The design site: Start, Brand and Foundations (the built change)

Reviews [`specifications/017-the-design-site-start-brand-and-foundations.md`](../specifications/017-the-design-site-start-brand-and-foundations.md). This reviewer wrote neither the specification nor the code, and did not review the specification ([`017-the-design-site-start-brand-and-foundations-spec-2026-11-14.md`](./017-the-design-site-start-brand-and-foundations-spec-2026-11-14.md) is another reviewer's). This reviewer did review `015`'s built change, which 017 builds on.

- **Date:** 2026-11-15
- **Status:** in review; lands once two Medium findings are fixed. Both are small. Six Low findings are write-ins.
- **Reviewer:** a reviewer; not the author
- **Reviewed:** the working tree on `0ebd728` (`015`, branch `release/0.12.0`), uncommitted.
  - The tracked diff, less `context/prior_art/`: 16 files, +955 −4.
    - It changes `package.json` and `bun.lock` (two packages) and `CHANGELOG.md` (one sentence).
    - It appends 21 entries to `src/lib/site/sitemap.ts`, and `describe` blocks to nine of 015's test files.
    - It changes the Start landing (`start/+page.server.ts`, `+page.svelte`), which was authorized.
    - It adds four entries to `decisions.md`, read as rulings.
  - The untracked files: 62 outside `context/`, 3,966 lines. They are the 21 pages, `src/lib/site/{brand,foundations,start}/`, `page/snippet.svelte`, `search/sources/tokens.ts`, the downloads endpoint, `scripts/site/lockup-width.ts` and its fixture, and three new unit files.
  - Not reviewed: `context/prior_art/` and the `2026-11-15-prior-art-*` memos, as asked. Also not reviewed: the kbd, dark-type and address rulings (2026-11-15), which land in a later commit. Their absence is not flagged.
- **Re-ran:** Bun 1.4.4, 2026-11-15. Nothing in the repository was written but this file. Scratch work is in `…/scratchpad/review-017/`. My own server used port 5320; Playwright's `webServer` used its configured 4173. The owner's preview on 5199 was left running.
  - `bun test tests/unit` → **1,150 pass, 0 fail**, 10,227 `expect()` calls, 32 files.
  - `bun run check` → `COMPLETED 2091 FILES 0 ERRORS 0 WARNINGS 0 FILES_WITH_PROBLEMS`.
  - `bun run lint` → "All matched files use Prettier code style!".
  - `bun scripts/lint-literals.ts` → "0 literal(s) in registry item files; 1 allowance(s)". `scripts/site/citations.ts` → 1 match, the kept `sleep(700)`.
  - `bun run test:e2e`, all three projects → exit 0: **2,555 passed, 4 skipped, 0 failed**, 10.0 m.
    - It includes `axe` 840, of which 126 are the 21 new pages at 360, 768 and 1280 in both projects.
    - Also `keyboard` 250, `theme` 286, `doors` 68, `site` 44, `build-output` 22 and `perf` 5.
  - `bun run test:smoke` → see "Smoke" under criterion 12.
  - **Idempotence:** `git status --porcelain` and the SHA-1 of every file under `static/r` and `static/v0.12.0` were the same before and after the build.
  - **My own probes**, with Playwright on a `Bun.serve` of `build/` (port 5320). I loaded the 21 pages in both themes at 1440, 390 and 360 px, 126 loads. On each load I looked for four-colour marks and the colour downloads, and their nearest painted ground. I also checked sideways scroll, page errors and console errors.
  - I outlined the landmarks and headings of five pages. I recomputed the lockup's width with fontkit. I ran the broad public scan from my 015 review over the new `build/`.

## Acceptance criteria against evidence

1. **Install and checks** — met. EXECUTED: `deps.test.ts`'s 017 block (`fontkit` 2.0.4 and `wawoff2` 2.0.1, exact in `package.json` and `bun.lock`), `check` and `lint`. The block pushes onto `PACKAGES`, the hook that 015's fix provided.
2. **The pages** — met. EXECUTED: `sitemap.test.ts` (015's block unchanged; 21 tagged `"017"`, 102 in all, each under its door's landing). `build-output.spec.ts` (every entry built). READ: the entries are appended with `SITEMAP.push(…)` after 015's last line.
3. **Suites inherited** — met.
   - EXECUTED: titles, one theme script, axe (126 new scans, 0 violations), no sideways scroll, twins, `llms.txt` and the public check, all over 102 pages.
   - My scan of `build/` read every page's text, the twins, `search.json`, `llms.txt`, the sitemap and the `__data.json` files. It found 0 citations, internal-document words or author names, apart from the kept code line. The source comments behind the claims are not in the built HTML.
   - Search: `build/search.json` holds 211 entries, 109 of them anchors (48 `#primitive-…`, 61 roles). It is 7.3 kB gzipped. Every anchor's `id` is on the built `/foundations/tokens/` (my check, and `build-output.spec.ts`). That page holds 118 ids, none duplicated.
4. **Keyboard** — met. EXECUTED: `keyboard.spec.ts`'s two blocks, both projects. Enter copies `--background` and the button says "Copied".
5. **The downloads exist** — met. EXECUTED: `brand-assets.test.ts`; `build-output.spec.ts` (6 files, each equal to `downloadSvg`'s output); `site.spec.ts` (200, `image/svg+xml`). READ: each file has `<title>Pluto Systems</title>`, `role="img"` and a `viewBox`. Lockups are 2,079 bytes and marks 317.
6. **Drawn from the tokens** — met. EXECUTED: `brand-assets.test.ts`, including the mutated `mark.dot`.
   - READ: the colour files' fills are the light `mark-1`…`mark-4` (`#2D48D4`, `#C92035`, `#E2B000`, `#008058`) with an ink word.
   - The ink files are all `#0B0F17`. The paper files are all `#F3F0E8` (finding 3).
   - The endpoint is prerendered from `readTokens()` at build.
7. **The lockup's outline** — met. EXECUTED: the fixture reads 225 px at 100 px. My run of `wordWidth` (fontkit on the decompressed WOFF2, weight 700, −0.04 em) gives 225.000. `site.spec.ts` measures the live lockup's word against the fixture. The lockup's mark top is 0.905 em above the baseline, against E6's 0.90.
8. **No four-colour mark on a field** — met on screen, but two of its three bullets have no test (finding 1).
   - EXECUTED: `doors.spec.ts`'s Colour-band block: 4 bands, with 0 marks, controls and `svg`, and all glass text in `--foreground`.
   - My probe, 126 loads: 0 four-colour marks with a field as their nearest painted ancestor. The only colour-file images, on `/brand/downloads/`, sit on the canvas and on white.
9. **The figures** — met. EXECUTED: `site.spec.ts`, both projects.
10. **Generated tables** — met. EXECUTED: `tokens-pages.test.ts`; `build-output.spec.ts` (every row of each table, in order). READ: `tables.ts` reads `tokens.primitives`, `tokens.themes` and `tokens.code`. `colourRows` reads `contrastTable`. Only the role and code-role descriptions (`words.ts`) are hand-written, and the test fails on a role without one.
11. **Settled only** — met as tested. EXECUTED: `brand-sources.test.ts` and `build-output.spec.ts`. The claims, read one by one, are under "The points asked". One sentence is untrue (finding 2).
12. **Start is true** — met.
    - EXECUTED: `site-add.test.ts`'s 017 block, in smoke.
    - READ: the four substitutions are as written:
      - the locked CLI binary;
      - the local server;
      - the `kit3` and `kit2` copies in place of `sv create`;
      - the page's `imports` block and `components.json` written in place of `init`.
    - The kit2 run also applies `#lib` → `$lib` and writes no `imports` block.
    - The blocks come from the built twin and equal `install.ts`'s constants.
    - The "nothing else differs" assertion is weaker than it reads (finding 5).
    - **Smoke:** `bun run test:smoke` → exit 0, 131 pass, 0 fail, `site-add.test.ts` 9 of them.
13. **Motion obeys** — met. EXECUTED: `doors.spec.ts`'s motion block, both projects.
14. **Literals** — met. EXECUTED: `site-literals.test.ts` covers `src/lib/site/` and `(site)`, so it covers the new files. The downloads page's grounds are `style:background-color` from token values, not literals.
15. **Suites, budget, documents, checkpoint and walk** — met.
    - EXECUTED: the suites. `perf.spec.ts`: `/brand/colour/` median 290 kB, LCP 848 ms, CLS 0.002, 0 `.wasm`, against 347 kB, 984 ms and 0.05 (finding 6).
    - `static/r/` is unchanged (above).
    - READ: the changelog sentence (finding 4), the checkpoint's rulings and the walk (84 loads).
    - My own 126 loads at 1440, 390 and 360: 0 page errors, 0 console errors or warnings, 0 sideways scroll.
16. **Released** — not yet, as expected.

## The points asked

1. **Append-only to 015's files:** confirmed with `git diff -U0`.
   - Each of the nine test files has exactly one hunk, `@@ -N,0 +N,k @@`, after its last line, with 0 lines removed. The same holds for `sitemap.ts` and `package.json`.
   - `CHANGELOG.md` has one changed line, 015's site paragraph, with one sentence added at its end.
   - The only other 015 lines changed are the authorized Start band's: in `+page.server.ts`, `addCommand(…)` becomes `ADD_THEME` and `ADD_BUTTON` from `install.ts`; in `+page.svelte`, the `-y`/`-o` sentence is added.
2. **The six downloads:** generated at build by the prerendered endpoint, from `readTokens()`. They come in three colourways: colour, paper and ink. The lockup width is checked against fontkit (criterion 7). No four-colour mark is on a field anywhere (criterion 8).
3. **"Settled only":** every rendered `p`, `li`, `td` and `figcaption` in the nine Brand pages' `<main>` carries `data-claim`, outside 015's breadcrumb, as ruled. I checked 24 claims against their named sources:
   - **True (23):**
     - the order of the four dots (N1);
     - the dot and gap figures (`mark` tokens);
     - the lockup's description and its 0.90 em top (E6);
     - clear space and the 20 px minimum (`001` decision 16);
     - "the mark is a logo, exempt from the 3:1 graphic rule" (round two);
     - the canvas and graphite (I5 with I9);
     - four colours only in owned moments (C2);
     - one 8 px radius, round only for dots (H1);
     - flat product screens (I5);
     - frosted glass, opaque under reduced transparency (I9, "Frost only");
     - the three open faces, none commissioned (D1);
     - poster type for launches and campaigns (K3, as `011` quotes it);
     - springs for the dots alone (J4);
     - 900 ms and 200 ms (`motion` tokens; "One system, many products");
     - M1 "nothing staged"; M3 "mid-task, no posing"; M4 "campaign imagery";
     - L3 "what you finish, what you get back";
     - the tagline (commissioned);
     - A4 (Docs, Sheets, `vfs`);
     - the G5 tile: flat colour, a white glyph, ink on yellow, two per hue, and radii of 8, 6, 4 and 2;
     - the endorsement line.
   - **Untrue (1):** "Every other graphic meets 3:1, except a yellow chart series" (finding 2).
   - Of the cuts the checkpoint lists, none came back as written. The text has no poster "once on a page", no "WCAG exempts", no mono "for anything a reader may type" and no invented L3 gloss. "Nothing moves on its own" now opens "After a page's one entrance", the corrected form. The M4 meters are gone. The 3:1 sentence did come back, with a qualifier that does not make it true.
4. **The install guide:** both runs pass with the four substitutions.
   - The guide's adds carry `-o`, and the sentence beside them says what `-y` and `-o` do.
   - The 75 component pages keep `addCommand` without `-o`: 0 of their twins contain `-y -o`.
   - The Start band and the guide read the same constants.
5. **Foundations:** the tables are generated from `tokens/pluto.tokens.json` (criterion 10). The token entries resolve, `#primitive-` anchors included (criterion 3).
6. **Dark glass over yellow:** EXECUTED. `doors.spec.ts` logged **10.89:1** dark (`#F3F0E8` on `#3A3420`, as painted) and 15.52:1 light. It matches the landing notes. The budget is met (criterion 15).
7. **Public, axe, keyboard, overflow:** clean (criteria 3, 4 and 15).
8. **The changelog sentence:** present (finding 4 on its wording).
- **Landmarks and headings:** each of the five pages I read has one banner, one `main` and the five footer navigations.
  - The Brand pages carry a `header` inside `main` (`brand.svelte`'s quiet header), the breadcrumb, then one named `section` per `h2`.
  - The Colour page's four bands are sections named Blue, Red, Yellow and Green.
  - Leaf pages end with the "On this page" complementary landmark.
  - Every page has one `h1` and no skipped rank.
- **Start and Foundations prose:**
  - I read the twelve other pages through their twins. There are no arrows, middle dots, all-caps words, "we" or citations.
  - Their generated numbers match `registry.json`: 78, 77 and 49 variables; 22 utilities; 11, 53 and 11 parts by mode.
  - The theme store's claims match `theme.svelte.ts`: the key `pluto-theme`, the system query, and "system" removing the key.
  - One rendering fault (finding 7).

## Findings, most severe first

1. **Medium. Criterion 8's first and third bullets have no test** (`tests/e2e/doors.spec.ts`, 017's blocks).
   - Criterion 8 asks that "`015`'s check (its criterion 12) holds over 102 pages". It also asks that `/brand/mark/` shows 0 four-colour marks on a field.
   - After 015's change review, that check reads `SITEMAP.filter((p) => p.spec === "015")` (`doors.spec.ts:15`, used at `:393`). That fix kept 015's red-door check from breaking on 017's Colour page. Since then, the mark check covers 81 pages, not 102.
   - 017 appended the Colour-band check, but no mark check for its own 21 pages. Nothing would catch a four-colour lockup set on a field on `/brand/mark/` or `/brand/surfaces/`, the pages most likely to do it.
   - My probe found none today.

   Fix: append a `describe` that runs the same nearest-painted-ancestor check over `SITEMAP.filter((p) => p.spec === "017")`, with `/brand/mark/` among them.
2. **Medium. The mark page states an untrue graphic rule** (`src/routes/(site)/brand/mark/+page.svelte:154–156`). "Every other graphic meets 3:1, except a yellow chart series on a light ground, which is labelled directly."
   - In light, the `--caution` fill is also under 3:1: the badge's fill on the page is 1.76, and the alert's bar on a card is 2.01. That is in `016` decision 5, its checkpoint, the 0.12.0 changelog, and this site's own `/brand/colour/` ("the caution fill").
   - The source comment cites `016` decision 5 for "chart-3 the one exception", which it is not.
   - This is the claim the checkpoint cut ("every other graphic meets 3:1"), back with a partial qualifier. On a "settled only" page that is the one thing that must not happen.

   Fix: keep the settled half and drop the rest: "The mark is a logo, so the 3:1 rule for graphics does not bind it." If the second sentence stays, it must name both: "On a light ground the yellow is under 3:1 as a chart series and as the caution fill; each is named in words."
3. **Low. The paper downloads are the canvas tone, not the field's legend** (`src/lib/site/brand/downloads.ts:192`, `:199`).
   - The mark page says "On a colour field, use one colour: the field's own legend". It shows the live lockup in that legend, `raised`, `#FFFFFF`.
   - The paper files are drawn in `paper`, `#F3F0E8`. Measured on the fields, they are 6.17, 4.93 and 4.36 (green), where the legend is 7.03, 5.61 and 4.97.
   - 017 decision 4's table says "all paper" but quotes white's ratios, so the specification carries the mismatch.
   - A logo is exempt from 3:1, so no rule fails. But the file is not the colour the page tells a reader to use, and the downloads page shows it on those fields.

   Fix: draw the paper colourway in the light fields' legend (`raised`) and call it "white". Or say on the mark and downloads pages that the file is paper, `#F3F0E8`, and why.
4. **Low. The changelog sentence speaks the site's own jargon** (`CHANGELOG.md:9`). "Behind its other three doors: five guides…". "Door" is a term of art of the site's design. A reader of the changelog has not met it.
   Fix: "It also holds five guides to starting, from an empty app to a first part; nine brand pages …; and seven foundation pages …".
5. **Low. The install test's "nothing else differs" check cannot fail** (`tests/smoke/site-add.test.ts:319`). It applies `sub` and then the inverse replacements, and compares the result with the original. That holds for any text that contains neither the locked binary's path nor the local origin. The guarantee criterion 12 asks for is still met elsewhere: the run executes `sub(block)` on blocks equal to `install.ts`'s constants. But this assertion adds nothing.
   Fix: assert what may differ. For example, `sub(b.code)` differs from `b.code` only at the indices of `CLI_SHOWN` and `SITE_ORIGIN`. Or drop it and name the real guarantee in a comment.
6. **Low. The Colour page's CLS budget keeps 0.05, where the rule now gives 0.02** (`tests/e2e/perf.spec.ts`, 017's block). 017 decision 11 sets the budget at "the measured median plus 20%". 015's checkpoint 1 ruled each CLS budget "the larger of median × 1.2 and 0.02". The median is 0.002, which gives 0.02. The block's comment says CLS "keeps decision 11's 0.05", but decision 11's 0.05 was the borrowed starting value.
   Fix: 0.02, or a line in the landing notes saying why 0.05 stays.
7. **Low. A float shows on `/foundations/motion/`** (`src/routes/(site)/foundations/motion/+page.svelte:108–109`). It reads "docks in 55.00000000000001% of it". `{m.entranceDot * 100}` and `{m.entranceStagger * 100}` print raw floats. The twin carries the same text.
   Fix: round, for example `Math.round(m.entranceDot * 100)`.
8. **Low. The `init` alternative names one of its questions** (`src/routes/(site)/start/install/+page.svelte`, the `components.json` section). "Name `src/app.css` as your stylesheet when it asks". Decision 13 records that the locked `init` also asks for a preset and fetches it from `shadcn-svelte.com`, and the page does not say so. No test runs `init`, by design, so this is the one step of the guide that is not proved.
   Fix: one more clause, such as "it asks for a preset and fetches it online; pick any, then set `registry` and `style` as above". Or drop the alternative.

Recorded, not findings:
- Button now has 1 kB under its 370 kB budget (369 kB, all three runs). The landing notes say why: the footer's 21 new links add 2 to 3 kB to every page.
- The claims test accepts any source comment that names `decisions.md`, a three-digit number, the constitution or the token file. It proves that a source is named, not that the source says the claim. The claims review above is what checks that.

## Constitution checks

- **§3, one public design site:** met. The Brand pages state settled decisions; Products sells nothing.
- **§4.1, source, not a package:** met. No registry item changes; `static/r/` is unchanged. The downloads are site files, not items.
- **§4.3, tokens are the one source:** met. Every figure, table, swatch and file colour is read from the token file at prerender. The literal lints pass.
- **§4.4, accessible by default:** met on what is checked: axe on the 21 pages in both themes at three widths, the keyboard blocks, and reduced motion on the motion page. Dark glass over yellow reads 10.89:1. Finding 2 is a sentence about the rule, not a failure of it.
- **§4.5 and §4.6:** met. Two named packages, exact, MIT, pinned by `bun.lock`. The frozen install passes in smoke's copies.
- **§6, never break an installed app silently:** met. No item changes. The Start band's `-o` is explained beside it, and component pages keep the command without it.

## Regressions looked for

- **015's suites over 102 pages:** all pass. That includes 015's budgets: `/` 303 kB, `/components/` 317, Button 369 of 370, code-block 342.
- **015's lines:** untouched, apart from the authorized Start band.
- **The registry and the snapshots:** unchanged.
- **Search:** page entries still equal the list. The index grew from 4.6 to 7.3 kB gzipped, under its 30 kB.

## Verdict

Lands once findings 1 and 2 are fixed.

Criteria 1 to 15 are met on evidence I re-ran, and criterion 16 waits on the release. The append-only boundary held, with the one authorized edit. The downloads, tables, search entries and install runs are as specified.

What must be fixed first:
- Finding 1: criterion 8 lost its test for 017's own pages when 015 narrowed its check.
- Finding 2: one Brand sentence is untrue, on the one page type held to "settled only".

Each fix is a few lines. Findings 3 to 8 are Low write-ins.

## Disposition

<to be filled in after the builder and the author answer>
