# Review of 024d — The theme page loads no editor (the built change)

Reviews [`specifications/024d-the-theme-page-loads-no-editor.md`](../specifications/024d-the-theme-page-loads-no-editor.md), a small change. This reviewer wrote neither the stub nor the code (constitution §5).

- **Date:** 2026-11-16
- **Status:** in review. **Land after fixes.** Findings 1 to 3 are small and belong on the branch before the merge. Finding 4 is a defect in another item, found here, to file on its own. Findings 5 to 7 are text, merge and landing work.
- **Reviewer:** a reviewer; not the author.
- **Reviewed:** the worktree `.claude/worktrees/agent-a25df1819d8e6f0f3`, branch `worktree-agent-a25df1819d8e6f0f3`: `git diff 506cfc1 a755fdb` (`6fe84fe` the specimen, `a755fdb` the `theme` template). 10 files, +200 −47. `release/0.13.0` has since moved to `467a0e8` (`025`, component cost).
- **Re-ran:** Bun 1.4.4, 2026-11-16, load average 21 to 32 on 10 cores. The worktree was not edited. `git status` was clean before and after. The worktree's `build/` (02:29) is newer than every source file the change touches; the built page holds the new keyboard note and the specimen's region name, so it was used as built.
  - `bun run check` → **0 errors, 0 warnings**, 2,343 files.
  - `bun test tests/unit/budgets.test.ts` → **60 pass, 0 fail**, 253 `expect()` calls.
  - `code.spec.ts`, `keyboard.spec.ts` and `axe.spec.ts`, filtered to the theme page (`-g "the ink surface|I3\.|kuiper-theme"`), `chromium-light` and `chromium-dark`, `E2E_PREBUILT=1 E2E_PORT=5743` → **20 passed**, 0 failed. That is the new `024d` test, S1, I3, the 7-stop keyboard fixture, Enter into the page from the landing, and axe at 360, 768 and 1280 and with the surface's popover and dialog open, in both schemes.
  - **Probes of my own** (`scratchpad/review-024d-scripts/`): screenshots and computed readings of the surface at 1440 and 390, light and dark, with and without forced colours (`shots.ts`, `forced.ts`); and two first-paint probes of the theme page's document (`lcp.ts`, `lcp2.ts`). The change's build was served by `vite preview` on 5745. A pre-change build was served on 5746, from the worktree `agent-a98b806f8a7911cf2`: its `HEAD` is `506cfc1`, with `023`'s uncommitted comment edits, and its theme page still mounts the editor.
  - Screenshots: `/private/tmp/claude-501/-Users-claygendron-Git-Repos-design-system/7b613866-3b2d-4829-bdd1-f2b35ebc0fd1/scratchpad/review-024d/` (`after-{1440,390}-{light,dark}[-forced].png`, `after-1440-light-focused.png`, `before-1440-{light,dark}.png`, `before-1440-light-focused.png`, `before-1440-light-forced.png`, `code-block-page-1440-light-forced.png`).
  - Not run: the perf project (the builder ran it twice; transfer is deterministic, and my probe reproduces the page's paint figures), smoke, Firefox and WebKit.

## Verdict

**Land after fixes.** The change does what the stub asks, and does it the simpler way. The page loads no CodeMirror and no tree-sitter, in any frame. It falls from 760.9 to 462.1 kB. The specimen shows both slots the surface sets, in both page themes, at both widths. Every check I ran passed. The budgets were derived correctly, and nothing rose without a ruling.

Three small things should change on the branch first. The new template's name, `theme`, is already an item's name, and that item's page is not in it (finding 1). The landing notes blame parsing for the page's late paint; my probe says the document's compressed bytes cause it, and that changes the fix (finding 2). And the specimen says which line is highlighted only by colour (finding 3).

## The stub's checks against evidence

1. **Seen failing first** — met. READ: the landing notes record both failures, with the two `.wasm` files by hashed name and the editor counted 1. EXECUTED (my probe, the same logic as the new test): the pre-change build fetched `web-tree-sitter.dvFfgEi9.wasm` and `tree-sitter-python.BlcJAWGl.wasm` on load, and held 1 `[data-slot="code-editor"]`, in light and dark. The file names match the builder's output.
2. **After the fix, no `.wasm` on load, in any frame** — met. EXECUTED: the `024d` test passes in both schemes. My probe read 0 `.wasm` and 0 editors in all 8 loads (2 widths, 2 schemes, forced colours on and off).
3. **Its template** — met, by the design lead's ruling. READ: the page measures 462.1 kB, over `component`'s line of about 455. As a ninth template, `theme`, it leaves `chart`'s LCP guard at 1,010 ms. EXECUTED: the unit test maps `/components/kuiper-theme/` to `theme`, and every template's budget is decision 4's arithmetic.
4. **The re-base** — brought forward for `component-live`, as a fall. See "The budgets".

"The perf project, `bun run check` and the `light` and `dark` browser projects stay green" — met for what I ran. READ: the builder's two perf runs (25 and 26 passed) and the whole three files in both schemes (1,208 passed).

## 1. Is the specimen a faithful demonstration of the ink surface?

**Yes, for what the surface sets.** `.surface-ink` sets two code slots (`app.css:602–611`): `--code-background` to the surface's ground, and `--code-active-line` to `--muted`. The specimen shows both (EXECUTED, computed values):

| Reading | Light page | Dark page |
|---|---|---|
| The surface | `rgb(22, 20, 15)` | `rgb(34, 31, 25)` |
| The specimen's ground | `rgb(22, 20, 15)` | `rgb(34, 31, 25)` |
| The highlighted line | `rgb(44, 40, 33)` (the wash) | `rgb(44, 40, 33)` |
| Its marker | 2 px `rgb(147, 176, 255)` | the same |
| The specimen's edge | the hairline, `rgba(243, 240, 232, 0.1)` | the same |

The readings are the same at 1440 and 390. At 390 the page does not scroll sideways (document width 390). The specimen's code scrolls sideways at both widths (799 px of code in 232 and 256 px), and it is a named, focusable region. Focused, it draws the dark ring on its block's root (`after-1440-light-focused.png`).

**The builder's inference about the editor holds.** Nothing on the page now shows an editor on ink. But the editor reads the same two slots by name (`code-editor-theme.ts:18`, `:44`, `:52–53`). `code.spec.ts` G2 proves that on the editor's own page in both schemes, where the code slots differ from `--background` and `--muted` (light: `#fff` and `#f3f0e8` against `#f3f0e8` and `#e9e5db`; dark: `#2c2821` and `#221f19` against `#16140f` and `#2c2821`). If the editor read the page's tokens instead, G2 would fail in at least one scheme. `.surface-ink` only redefines variables, so the editor on ink follows.

**What the page no longer teaches** (compared on `before-1440-light-focused.png`):

- **The caret on ink.** It is `--code-text` (`code-editor-theme.ts:29`), the specimen's text colour. Nothing is lost but the blinking.
- **The selection on ink.** It is the browser's own (`code-editor-theme.ts:13`, "no `drawSelection`"). Text in the specimen selects the same way.
- **The gutter's rule.** The editor's gutter has a `--border` rule on its right. The block's numbers have none. This is the one visible difference, and it belongs to the editor, not the surface.
- **"Tab leaves it."** That was a fact about the editor's keyboard handling, now taught on its own page.
- **That an editor works on ink at all.** Now proven by the inference above, not on this page (finding 5).

None of these is the theme's to teach. The stub's own reason holds: the theme documents a surface, not an editor.

**A side effect, for the better.** On the pre-change build at 1440, the editor's column grew past its track. The editor and its paragraph ran under the `darts.py` block ("The editor's ground is the surface, edged b…"; `before-1440-light.png`). The specimen keeps to its column. (Seen on a `506cfc1` build with `023`'s uncommitted comment edits; those edits touch no layout.)

**Under forced colours** the specimen shows neither slot. That is expected: forced colours replace both grounds with `Canvas`. The old editor's active line went to `Canvas` too (EXECUTED: `rgb(255, 255, 255)`), so nothing regressed. But the highlighted line cannot be told from the others. Every line in every code block paints a `CanvasText` bar (findings 3 and 4; `after-1440-light-forced.png`, `code-block-page-1440-light-forced.png`).

## Findings, most severe first

1. **Low, fix before landing. The new template is named `theme`, which is already an item's name, and that item's page is not in it** (`budgets.ts:32`, `:140`; the unit test's fixed pages).
   The registry has an item `theme`, "the light and dark switch", with its page at `/components/theme/`. That page maps to `component` (EXECUTED). The template `theme` holds `/components/kuiper-theme/`, the page of the item `kuiper-theme`. So a report line such as `024 transfer: theme` or `024 paint: theme: …` reads as the `theme` item's. `024`'s review (finding 11) noted that `022`'s fault ledger keys on test titles, so renaming later renames history.
   Fix: name the template after its page, as `home` and `index` are: `kuiper-theme`. Change `TEMPLATE_IDS`, `RULES`, `TEMPLATES` and the count test's list. Add `expect(t("/components/theme/")).toBe("component")` to "decision 1's fixed pages", beside the `kuiper-theme` line. Update the two landing-note sections that name the template.

2. **Low, fix the text before landing. The landing notes' diagnosis of the page's late paint is wrong, and it points the fix at the small parts** (`024d` landing notes, "A finding: the theme page's LCP is its first paint"; `024`'s "After `024d`", last bullet).
   The notes say that "under 4× CPU throttling, parsing that document holds the first paint", and name the fixes as "fewer examples prerendered in full, or the contrast and measured tables trimmed". My probes say otherwise (EXECUTED, `lcp.ts` and `lcp2.ts`, 3 loads each, Chromium, 1280 × 900, `015` decision 23's profile):
   - **Parsing costs about 40 ms.** With the document handed over at once (`route.fulfill`, so no network for it), the theme page paints at 972 to 1,000 ms, and `chart` at 916 to 956.
   - **The document's compressed bytes cost the rest.** Through the throttled network (a proxy serving gzip), the first paint follows the document's gzipped size:

     | The theme page's document | gzip | Response end | FCP = LCP |
     |---|---|---|---|
     | as built | 91.5 kB | 1,072–1,078 ms | 1,308–1,344 ms |
     | every line's class shortened to one word | 66.4 kB | 789–793 | 1,204–1,232 |
     | the examples' source lines removed | 50.3 kB | 500–508 | 1,156–1,176 |
     | `chart`, as built | – | 286–294 | 864–872 |

     The first row reproduces the builder's figures (LCP 1,312 to 1,328, response end about 1,090).
   - **The tables are a small part.** Removing each part from the document and re-compressing it: the examples' source panels are **38.1 kB** of 87.5 kB gzipped (44%); the hydration data and scripts after `</main>` 18.5 kB (21%); the 7 tables 7.6 kB (9%); the new specimen 0.1 kB.
   Fix: in both landing-note sections, say that the document's transfer holds the paint, not its parsing, and cite these figures. Replace the named remedies with the two levers that point 4 below describes. This change does not need to fix the paint. Its LCP is the 1,352 ms it had with the editor.

3. **Low, fix before landing. The specimen says which line is highlighted by colour alone** (`surface.svelte`, the paragraph under the specimen).
   The paragraph says "The highlighted line is one step up", but not which line. Under forced colours the wash is gone, and every line has the same bar (finding 4). A screen reader hears no highlight. The `code-block` page's own example names its line in a footer ("25 lines of Python, line 23 highlighted").
   Fix: name it in the paragraph: "Line 3 is highlighted: one step up, the ground an editor's active line takes." This is the change's own text, with no new test needed. I3 already reads the paragraph by its test id.

4. **Medium, outside this change (lane I, `code-block`). Under forced colours every code line paints a bar, so a highlighted line looks like the rest** (`code-block-line.svelte:9`, `:13`).
   Every line has a `border-l` of the focus width in `border-transparent`. That keeps an emphasised line's marker from shifting the columns. Under forced colours, Chromium paints that transparent border as `CanvasText`. EXECUTED: on the theme page all 893 lines' left borders compute `rgb(0, 0, 0)`; on the `code-block` page all 217 do, the highlighted, added and removed lines included. Added and removed lines keep their `+` and `−`. A highlighted line keeps nothing. It was the same before this change, and `forced-colors.spec.ts` has no code-block test. Constitution §4.4 holds every item to WCAG 2.2 AA under forced colours.
   Fix: file a small change for `code-block`. Sketch: under `forced-colors: active`, give the line `forced-color-adjust: none` and system colours: the default marker `Canvas`, the three emphasised markers `Highlight`. The text keeps `CanvasText`. Its check, seen failing first: a `forced-colors.spec.ts` test on the `code-block` page that reads a default line's marker as the canvas colour and the highlighted line's as `Highlight`.

5. **Low. S1 now proves the editor on ink by inference** (`code.spec.ts` S1; 8 readings → 7).
   What was dropped: the `.cm-gutters` ground. A block has no gutter element, so there is nothing to read. The other two editor readings were replaced by the specimen's ground and its highlighted line. The editor's hairline was replaced by the specimen's. That loss is acceptable. The page no longer holds an editor, and the inference in point 1 above is sound. But it is written only in a test comment, "(G2, on its own page)", which does not give the reason.
   Fix (either; neither blocks landing): extend S1's comment with the reason, that the code slots differ from `--background` and `--muted` in both schemes, so G2 fails if the editor reads the page's tokens. Or add a static assertion where `code-editor-theme.ts` is already tested: that `.cm-editor`, `.cm-gutters` and `.cm-activeLine` read `var(--code-background)` and `var(--code-active-line)` by name.

6. **Low, landing work. Three texts still say eight templates, and `030` gains a ninth headroom to fit** (`024` spec, decision 1's heading "Eight templates" and criterion 1; `roadmap.md:170`, "re-bases all eight templates"; `roadmap.md:74`, `024d`'s row).
   The amendment is recorded in `024`'s landing notes, which is the right place. But a reader of decision 1 or the roadmap will not see it.
   Fix: add a pointer under decision 1: "Amended at `024d`: nine templates; see 'After `024d`'". In `roadmap.md` §3, write "nine templates". Set `024d`'s row to landed. In the `030` entry, note that the theme page is a component page in its own template: `030`'s per-page cost must fit `theme`'s headroom too, 47.9 kB (510 − 462.1), as well as `component`'s.

7. **Low. The scorecard was not re-run** (the landing notes, "The scorecard").
   The movement claim is right. Row 8 reads Button's page (`benchmark-scorecard.md`, the run log), and this change touches neither Button nor any item. But AGENTS.md and constitution §5 ask for a re-run after each specification lands, and a small change is a specification.
   Fix: re-run after landing, and record a row that says "no movement; the theme page 760.9 → 462.1 kB is outside every row". Or the design lead rules that small changes on a build branch batch their re-run with the re-base sweep, and writes that into `roadmap.md`.

## 2. The tests

- **The new `024d` test is credible, and it was seen failing.** It listens on the browser context, so it sees requests from every frame. Waiting for `networkidle` can miss a late fetch under throttling (`024`'s finding 2), but this test runs unthrottled. More importantly, its second assertion does not depend on timing. `CodeEditor` prerenders its root with `data-slot="code-editor"` (`code-editor.svelte:164`; `code.spec.ts` "the editor before mount"). So any editor on the page fails the count, before or after hydration, whether it highlights or not. The failure was seen twice: the builder's recorded output, and my probe of the pre-change build (point 1 of "The stub's checks").
- **S1, 8 → 7 readings:** see finding 5. Acceptable.
- **The keyboard fixture's first stop, `region:*`:** correct. The specimen's `pre` is the stop, named "Numbered code on the ink surface". Its ring is drawn by the block's root (`drawnBy`, the `code-block-content` rule). `kuiper-theme` left the `.cm-editor` list, which is right, since there is no editor. EXECUTED: 7 of 7 stops in both schemes, and the next Tab leaves the fixture. The page's keyboard note matches: the numbered code, the copy button, the code, the tab strip and three triggers. The wildcard follows the file's convention (`keyboard.spec.ts:144`). Naming the stop exactly (`region:Numbered code on the ink surface`) would be stricter; optional.
- **The budgets unit test's ninth template:** correct. The count test and the fixed-pages test name it. The own-pages, arithmetic, margin and `ci` tests run over `TEMPLATE_IDS`, so they cover it with no change: 60 = 56 + 4. "The listed pages map to their own templates" would fail if `kuiper-theme` were put back in `HEAVY` or `LIVE_HIGHLIGHT`, because the `component` rule excludes `THEME_PAGE`. Add the `/components/theme/` line from finding 1.

## 3. The budgets

All recomputed from decision 4 (EXECUTED, `budgetOf` over `TEMPLATES`, and by hand):

| Template | Figures | Budget | Before |
|---|---|---|---|
| `theme` (new) | 462.1 kB, 1,348 ms (10%), 0.004 | **510 kB, 1,490 ms, 0.02** | — (the page was in `component-live`: 840, 1,490, 0.02) |
| `component-live` | 655.8 kB `code-editor`, 1,140 ms `highlighter` (10%), 0.003 `code-editor` | **725 kB, 1,260 ms, 0.02** | 840 kB, 1,490 ms, 0.02 |
| `component-heavy` | 479.9, 912, 0 (`chart`) | 530, 1,010, 0.02 | unchanged |
| the other six | — | — | unchanged |

- **`theme`'s figures.** 462.1 × 1.1 = 508.3, rounded up to 510. 1,348 × 1.1 = 1,482.8, rounded up to 1,490. The spread (1,332 to 1,348) is 1.2%, so the margin is 10%. CLS is at the floor. The builder's run after the ruling measured 1,380 ms, 7% under the budget. The page's budgets all fell or held against what it had in `component-live`.
- **`component-live`'s fall without a re-measure:** acceptable. The figures are `024`'s own sweep rows (`024` spec, lines 465 and 467: `code-editor` 655.8 kB, 912 ms, 0.003; `highlighter` 1,140 ms, from 1,116, 1,140 and 1,164, a spread of 4.3%). A fall needs no ruling (decision 4). The unit test forced it, because a figure may name only the template's own pages. The builder's two runs measured `code-editor` at 657.0 kB (68 kB under) and the probes' LCP at 884 to 1,144 ms (at least 116 ms under). The `ruling` string says it is a fall, not the re-base.
- **No budget rose without a ruling.** One template was added, by the design lead's recorded ruling, and one fell. `component-heavy` is back at `chart`'s figures, by the design lead's ruling 2. The builder's first ruling, which would have raised it to 1,490 ms, is recorded as not confirmed.
- **`theme`'s LCP budget is the loosest on the site but `index`'s.** That is because of the document weight in finding 2, which the re-base revisits. It is not a reason to hold the change.

## 4. The finding: the page's 1.4 MB document

**Recommendation: do not file it as a small change for the theme page. File it as a roadmap entry for a specification, in the site lane, ranked at the re-base.** The evidence is in finding 2.

Why not a small change:

- **Parsing is not the cost**, so "examples lazily rendered" would not help unless it also removes bytes from the document.
- **The biggest lever is site-wide.** The examples' highlighted source is 44% of the compressed document. It sits in a closed `<details>` on purpose: "the code stays in the page, for find-in-page and the Markdown twin" (`src/lib/site/page/frame.svelte:197`). Its tokens are also serialized again in the hydration data (18 `lines:` arrays after `</main>`). The frame serves every component page, so changing it moves every component template's figures. It also reverses a recorded choice. That is not "one page".
- **The second lever is an item's interface.** Each code line carries a 723-byte class string (`codeBlockLineVariants`' base). This page has 893 lines, so 645.7 kB raw (45% of the document) and about 25 kB gzipped. `codeBlockLineVariants` is exported from `code-block/index.ts`, so changing its base is an interface change.
- **Trimming the tables** is worth about 7.6 kB gzipped, under 9%.

Sketch for the specification (call it "the example source leaves the first paint"):

1. **Keep the source findable, without its tokens.** The frame renders each example's source as plain text. It sits in `hidden="until-found"` (Chromium's find-in-page opens it) or in the closed `<details>` as now. Plain text compresses to a fraction of the tokenised spans. The Markdown twin reads it as before.
2. **Highlight on open.** At build, write each example's highlighted source as a static fragment beside the page (for example `/components/<item>/code/<example>.html`). The `<details>`' first `toggle` fetches it and swaps it in. No tree-sitter in the browser, as now.
3. **Keep the tokens out of the hydration data.** The frame's `lines` move out of the page's `load`, so they are not serialized twice.
4. **Its checks:** the theme page's gzipped document falls by about 35 kB, and its FCP by about 150 ms under the perf profile (the probe's "source lines removed" row is the upper bound). Every component page's document falls. Find-in-page still finds a line of example source. The Markdown twin is byte-identical. A re-base follows, and it may retire the `theme` template, if the page then fits `component-heavy`'s 1,010 ms.
5. **Separately, in lane I:** hoist the line's base classes to `CodeBlock.Content` as child rules (`*:data-[slot=code-block-line]:…`), with a migration note for `codeBlockLineVariants`. This is worth about 25 kB gzipped and 100 ms on this page, and it makes every app's code blocks lighter too. Rank it on its own.

If the design lead still wants a one-page small change now, there is no lever on this page alone worth more than the tables' 7.6 kB.

## 5. Constitution checks

- **§4.1, source, not a package:** unchanged. No item changed.
- **§4.3, tokens:** the specimen uses the block's own token classes. No literal was added.
- **§4.4, accessible and proven:** axe passes on the page in both schemes, at three widths and with two overlays open. Keyboard: 7 stops, each with the ring. Forced colours: no regression; finding 4 is a pre-existing item defect.
- **§5, small change:** one page, no interface change, no token, no dependency. The new template is test configuration, which the stub's check 3 foresaw. The check was seen failing first. Rulings are in the landing notes.
- **§6:** no commit or push beyond the builder's branch commits. No prior art copied.

## Merge notes for `467a0e8`

- **One file conflicts: `src/lib/site/thumbnails/manifest.json`.** `025` rewrote most of its hashes in one hunk, including `kuiper-theme`'s (`47bd45b…`). This branch changed only `kuiper-theme`'s (`7d740bd…`). READ: `comm` of the two branches' changed files gives that file alone. Resolve it as `025`'s two merges did: take `release/0.13.0`'s manifest, then run `bun scripts/site/thumbnails.ts --hash-only`. The builder found the theme's pictures byte-identical, so no picture needs re-taking. Then run `bun test tests/unit/thumbnails.test.ts`.
- **`025`'s cost report does not go stale from this change.** An item's size hash reads the served JSON in `static/r/`, its fixture and case files, `scripts/cost/app/` and three scripts (`scripts/cost/hash.ts`, `sizeHash`). The runtime key reads the build output and the timing scripts. This change touches none of them: no file under `static/`, `registry.json`, `src/lib/registry/` or `scripts/cost/`. `kuiper-theme`'s served JSON lists no files. So `bun run cost --sizes-only` should have nothing to do. Confirm it: on the merged tree, `bun test tests/unit/cost.test.ts` fails on any stale size hash and warns on a stale runtime key. Run `bun run cost --sizes-only` only if it names an item. Never hand-edit `report.json` or `budgets.json`; they are ledger files.
- **After the merge:** `bun install --frozen-lockfile` (`025` pins Bun 1.4.4 in `package.json`). Then `bun run check`; `bun test tests/unit/budgets.test.ts tests/unit/thumbnails.test.ts tests/unit/cost.test.ts`; `bun scripts/site/release-check.ts --before-ci`, which should name its four skips; and the perf project once (`E2E_PORT=57xx bun --bun playwright test --project=perf --no-deps`), since `025` changed `tsconfig.json` and `package.json`. Also run the theme-page filter above, in both schemes.
- **The `024` spec's "After `024d`" section merges cleanly.** `025` did not touch that file. Apply findings 1, 2 and 6 to it first.
- **Order:** findings 1 to 3 on the branch, then the merge of `467a0e8`, then the checks above, then the landing. `024d` is one of the four small changes before the re-base (`roadmap.md` §3). Ledger files land one build at a time.

## Disposition

**Land after fixes 1 to 3.** File finding 4 as a small change for `code-block` (lane I). File point 4 as a roadmap entry, with finding 2's figures. Do findings 5 to 7 at landing.
