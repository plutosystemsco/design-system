# Review of 014 — The white light-mode code ground (the built change)

Reviews [`specifications/014-the-white-light-mode-code-ground.md`](../specifications/014-the-white-light-mode-code-ground.md). The specification's own review is [`014-the-white-light-mode-code-ground-spec-2026-11-14.md`](./014-the-white-light-mode-code-ground-spec-2026-11-14.md), by the same reviewer. This reviewer wrote neither the specification nor the code.

- **Date:** 2026-11-14
- **Status:** in review; lands, with six Low write-ins and three notes for `013`
- **Reviewer:** a reviewer; not the author
- **Reviewed:** the working tree on `ef53f01` (`v0.11.0`), uncommitted, at 0.12.0. 014's part is the tracked-file `git diff` (38 files, +1777 −179), plus the untracked `static/v0.12.0/`:
  - `package.json` (the version only), `tokens/pluto.tokens.json`, `scripts/{build-tokens,contrast,lint-literals}.ts`;
  - the generated `src/app.css`, `registry.json` and `static/r/` (4 files);
  - `code-block` (`code-block.svelte`, `-content`, `-line`) and `code-editor` (`code-editor.svelte`, `code-editor-theme.ts`);
  - the `code-block`, `code-editor`, `highlighter` and `pluto-theme` pages; `/view/chat/thread/`; `src/lib/preview/install-command.svelte` and `block-page.svelte`;
  - `CHANGELOG.md`;
  - the tests: unit `contrast`, `generated`, `literals`, `registry`, `tokens`; e2e `blocks`, `code`, `keyboard`, `tokens` and `pages.ts`; smoke `code-add`;
  - the specification's Status, dispositions and Landing notes.

  Not 014's, and not reviewed: `decisions.md` and `constitution.md` (the owner's rulings, read as rulings), the modified research memo, the untracked specifications, research and reviews, and `src/lib/workbench/` with its route and test.
- **Re-ran:** Bun 1.4.4, on this machine, 2026-11-14. Nothing in the repository was written but this file.
  - `bun run test:unit` → exit 0: **986 pass, 0 fail**, 6,467 `expect()` calls, 12 files.
  - `bun run check` → exit 0: `COMPLETED 1827 FILES 0 ERRORS 0 WARNINGS 0 FILES_WITH_PROBLEMS`.
  - `bun run lint` → exit 0: "All matched files use Prettier code style!".
  - `bun scripts/lint-literals.ts` → exit 0: "0 literal(s) in registry item files; 1 allowance(s)" (`011`'s L24, `liquid-glass/pointer-light.ts:15`).
  - `bun run test:e2e`, the full suite, both projects → exit 0: **1984 passed, 4 skipped, 0 failed**, 3.8 m. Passes include `axe` 540, `keyboard` 238, `compositions` 174, `expressive` 172, `on-brand` 116, `blocks` 102, `tokens` 82. The 4 skipped are `011`'s light-only `tokens.spec` checks in the dark project, skipped by design.
  - `bun run test:smoke` → exit 0: **113 pass, 0 fail**, 5,740 `expect()` calls, 7 files, 120 s. The tracked diff was again unchanged afterwards.
  - **The build is idempotent:** the e2e run's `bun run build` (`build:tokens`, `build:registry`, `vite build`) left the tracked diff exactly as it was (38 files, +1777 −179).
  - **The snapshots:** `git diff --name-only v0.11.0 -- static/v0.11.0` and the untracked files under it → 0 and 0. `static/v0.12.0/r` equals `static/r` (`diff -rq`, 76 files).
  - **Criterion 16 seen red after the fact** (EXECUTED). I took `v0.11.0`'s `scripts`, `tokens` and `package.json` by `git archive`, added this change's `scripts/contrast.ts`, `tests/unit/contrast.test.ts` and the Tombaugh research file, then ran the "inline code" group: 4 of its 5 tests fail on the 0.11.0 tokens.
  - **My own probes on the dev server (5199), with Playwright** (scratch: `…/scratchpad/review-014-pr/`):
    - the horizontal overflow of 75 item pages at 390 and 320 px in both themes, then again with an injected style that removes 014's border and chip, to tell 014's share from the page's own;
    - screenshots of the `pluto-theme` inline-code section and its ink surface, `/view/product-home/` and `/view/chat/thread/` at 1280 in both themes.

## Acceptance criteria against evidence

1. **Tokens: 55 names, 35 primitives, the two roles, the map, `muted` and `card` unchanged** — met. EXECUTED: `tokens.test.ts`; the token diff adds exactly `syntax-ground` and `syntax-active-line` to each theme and moves the two map entries. `build:tokens` twice changes nothing (the e2e build re-ran it; the diff did not move).
2. **Emission** — met. EXECUTED: `generated.test.ts`; READ in `src/app.css`: `--syntax-ground` and `--syntax-active-line` in both blocks, the two `--code-*` lines on them, the two `--color-syntax-*` lines in `@theme inline`, and `@utility scrollbar-code` exactly as written. `.surface-ink` is unchanged. One deviation is recorded: `cssVars.theme` holds no `--color-syntax-*`, because the CLI derives them, so the `@theme inline` reading is of `src/app.css`. Accepted.
3. **95 code-slot rows; 4.81 and 4.97; ten pins** — met. EXECUTED: `contrast.test.ts`'s "five code grounds" group asserts the 95, the dark `property` 4.81, the light tie of `number` and `escape` at 4.97, and the ten pins on `syntax-ground`.
4. **`contrastTable` 110 / 108 / 2 / 0 and the ten rows** — met. EXECUTED: the `001` tables now hold 55 rows per theme, with the five new rows at their values.
5. **Tombaugh, 70 of 70; `deltaE` and `mix`** — met. EXECUTED: the group reads the research file, derives the selection with `mix` (`#E4E7F9`, `#393A3E`), and pins the lowest at light comment 4.50. `deltaE` and `mix` are new exports of `scripts/contrast.ts`, written from Ottosson's matrices, and pinned at 4.61 and `#E4E7F9`. READ: no test this change adds imports from `src/lib/workbench/`.
6. **The edge, 10 surrounds, lowest 3.03** — met. EXECUTED. The group's rows carry the ground term and the hairline's ground apart. The row beside the active line takes the line as the ground term and the code ground under the hairline, so it reads 3.03, as the second pass asked.
7. **The items' source** — met. READ in the diff:
   - `code-block.svelte`'s base gains `border border-border`;
   - `code-block-content` uses `scrollbar-code`;
   - `code-editor`'s root is `rounded border border-border bg-code-background`;
   - `code-editor-theme.ts` sets the scroller's track to the code ground and the focus offset to `calc(var(--focus-offset) + var(--line-width))`;
   - `code-block-line` changes its comment only.

   `class="bg-muted"` appears nowhere under `src/lib/registry/` or `items/`. No file of an item decision 7 lists as unchanged is in the diff, and none under the workbench.
8. **In the browser** — met. EXECUTED: `code.spec.ts` G1 to G4 in both themes. They read the block's and the editor's grounds, the hairline on four sides, the emphasised and active lines, the tracks, the editor's 3 px offset, `product-home`'s three blocks and `m3`'s block in its bubble. S1 holds, with the border. E3's clip check now grows the editor by 5 px.
9. **The version and the snapshots** — met. EXECUTED (above): 0.12.0, `static/v0.11.0/` matches its tag, `static/v0.12.0/` is the output, and `git tag` lists no `v0.12.0`.
10. **Lints and types** — met. EXECUTED (above). READ: `lint-literals.ts`'s `SYNTAX_COLOUR` is decision 9's pattern character for character, now exported. `literals.test.ts` asserts it and its three new bad samples, plus two good samples beyond the criterion (`bg-code-background`, `bg-code-active-line`), accepted at the checkpoint.
11. **The suites, and where expectations changed** — met. EXECUTED (above). The diff changes exactly the groups the criterion lists, plus the three the checkpoint accepted (`blocks.spec.ts` 26 and C9, `tokens.spec.ts`'s active-line reading). `keyboard.spec.ts` reads 190 stops.
12. **Smoke** — met. EXECUTED: `code-add.test.ts` 9 and 9b pass. The installed app's `:root` and `.dark` each hold 21 `--code-*` variables on the two syntax roles, and `.surface-ink` is unchanged. Its built CSS holds `.scrollbar-code` and the compiled chip rule, `code:not(pre code,:is(h1,…,h6) code)` on `var(--code-background)`; `:is()` is not lowered. Its `code-block.svelte` holds `border-border`. The checks were not seen red during the build, but each looks for a string the 0.11.0 build cannot contain, so that gap is immaterial.
13. **The documents** — met. EXECUTED: `registry.test.ts` checks one `## 0.12.0 — unreleased` heading, the three bullets, the three marks and the four names, and that "No variable is renamed or removed" is absent. `registry.json`'s `code-block` description no longer says "muted inset". The `highlighter` page's two rows name `syntax-ground` and `syntax-active-line`. The `code-editor` page's intro and `code-block-line.svelte` say no "muted ground". The `pluto-theme` page shows `scrollbar-code`.
14. **The checkpoint** — met. READ: `decisions.md`, "After the `014` build's checkpoint". The Landing notes still say it is "to be recorded" (finding 3).
15. **Inline code: the emitted CSS** — met. EXECUTED: `generated.test.ts`'s "014's inline code" checks:
    - the two rules, keyed by the built selector `code:not(pre code, :is(h1, h2, h3, h4, h5, h6) code)`, each one `@apply` of exactly its utilities, with no `var(--code-…)` of its own;
    - the mono rule unchanged;
    - the two rules inside `src/app.css`'s `@layer base`;
    - the install line's classes.
16. **Inline code: the figures** — met. EXECUTED: 16 text rows with the lowest 6.66, and 28 edge rows with the lowest 4.61. The group was not seen red during the build; I ran it against the 0.11.0 tokens and 4 of its 5 tests fail there, so the gap does not matter.
17. **Inline code in the browser** — met. EXECUTED: `code.spec.ts` I1 to I5 in both themes:
    - I1: the chip's ground, hairline, colour, 4 px and 0 padding, radius and `clone`;
    - I2: rendered heights within 0.5 px of the mono-span twins at three sizes;
    - I3: the link colour, the card, no chip in the `h3`, the ink surface;
    - I4: the install line;
    - I5: a block's `pre code` and `kbd` unchanged.

    axe passes on every page in both themes. The screenshots show the chips, the wrapped token's cloned edges, and the link colour in the chip.

## Findings, most severe first

None is High or Medium. Each is a write-in, with its fix.

1. **Six item pages scroll sideways at 390 px, not three, and all six were already doing so** (`014-…`, Landing notes, "Found, pre-existing, not fixed"; `decisions.md`, "After the `014` build's checkpoint") — the record names `code-block`, `code-editor` and `pluto-theme`. My probe also finds `use-highlighted-code` (582 px), `code-languages` (622) and `theme` (631), in both themes, at 390 and at 320. With 014's border and chip removed in the browser the widths are 2 px less on every one of the six (693, 620, 580, 620, 815, 629). So all six are pre-existing, and 014's share is 2 px each (EXECUTED).
   Fix: list the six pages and their widths in the Landing notes, so `015` inherits the whole list. No code change in 014.
2. **The changelog overstates "a class an app sets on its own `code` still wins"** (`CHANGELOG.md`, the `pluto-theme` bullet) — a class wins only for the properties it sets.
   Failure: shadcn's usual inline-code recipe is `rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm`. On update it keeps its `wash` ground and its padding, but gains the base rule's 1 px hairline, `box-decoration-break: clone`, and the code body colour in place of the colour it inherited. The preview's own install line needed an explicit change for the same reason.
   Fix: "A class an app sets on its own `code` wins for the properties it sets; the hairline, the radius, the side padding and the code colour still apply unless a class sets them too."
3. **The Landing notes trail the build** (`014-…`, Landing notes) — they say the checkpoint is "to be recorded in `decisions.md` by the design lead", and it is now recorded. They list three overflowing pages (finding 1). They do not record that criterion 16 was later seen red against the 0.11.0 tokens (this review).
   Fix: cite the decisions entry, carry finding 1's list, and cite this review, as the README's step 6 asks.
4. **Two lines of page copy contradict the change** (`items/pluto-theme/+page.svelte`):
   - The ink-surface caption reads "The editor sits flush on the surface, as inline `code` does." Both now carry the hairline.
   - The `h3` demonstration's heading shows the selector `code:not(pre code)`, while the rule that ships also leaves out headings.

   Fix: "The editor's ground is the surface, edged by the hairline, as inline `code` is." Show the selector as built, or say "No chip in a heading" alone.
5. **The block pages' code view is still code on `wash`** (`src/lib/preview/block-page.svelte`, the `pre` under each file's `details`) — `bg-muted px-4 py-3 font-mono …`. 014 moved the install line to the code ground (A3) but left this preview `pre`, so a reader who opens a file on `/items/settings/` sees code on the ground the owner asked to leave. It is preview, not an item, and it is collapsed by default.
   Fix: `bg-code-background` with `border border-border`, as the install line has, or name it for `015` in the Landing notes.
6. **The `code-editor` bullet does not say "No prop, slot or export changes"** (`CHANGELOG.md`) — the `code-block` bullet says it; the editor's leaves an installer to guess.
   Fix: add the sentence.
The builder's suite counts in the Landing notes (unit 986, e2e 1984 with 4 skipped, smoke 113) agree with mine.

## For `013`, which builds next on this

The fit holds on the role names, L19 and the arithmetic. Three points `013` must carry, none of them 014's to fix:

- **A. The selector.** 014 ships `code:not(pre code, :is(h1, h2, h3, h4, h5, h6) code)`, and `a code:not(…)` likewise (the A2 fix). `013` still writes `code:not(pre code)` and `a code:not(pre code)`, in decision 16 (`013-…:513`) and in `code-items.test.ts`'s exact check (`:659`). A check keyed on that selector finds no rule in `pluto-theme`'s `css`. It must use the built selector and change only `text-code-foreground` to `text-code-text`.
- **B. The install line.** `src/lib/preview/install-command.svelte` now reads `text-code-foreground`. `013` removes that utility, but its list of other users of the removed names (`013-…:564`) leaves this file out. Unchanged, the install line would lose its code colour silently, since Tailwind drops an unknown class.
- **C. The arithmetic.** `scripts/contrast.ts` now exports `deltaE` and `mix`, as `013` expects. The workbench's copies in `palette.ts` remain until `013` removes them.

Agreed, and checked:
- `syntax-active-line` throughout `013`;
- L19, character for character;
- the version, already 0.12.0, so `013` makes no bump;
- the one `## 0.12.0 — unreleased` entry, with one bullet per item, for `013` to add to;
- `generated.test.ts`'s exact `@apply` string, which `013` changes in one class.

## Constitution checks

- §4.1 source, not a package: met. Nothing reaches back at run time. The `static/v0.12.0/` snapshot is the registry's own.
- §4.3 tokens are the one source: met. The literal lint reports 0 violations. Every new value in an item is a token utility (`border-border`, `bg-code-background`, `scrollbar-code`) or a `var()` (`code-editor-theme.ts`). The inline rule is in the theme, built from token utilities (`rounded`, `px-1`, `border-border`).
- §4.4 accessible by default: met. axe passes on 540 page-width-theme runs, and the keyboard walk on 238. Both themes are covered, `/view/chat/thread/` included with its two new stops. Every new contrast row passes, the lowest at 4.50 (Tombaugh, against the research file) and 4.81 (shipped).
- §4.5 and §4.6 pinned and named dependencies: met. `bun.lock` is untouched, and `package.json` changes only its version.
- §6 never break an installed app silently: met.
  - The 0.12.0 entry marks `pluto-theme`, `code-block` and `code-editor` as **interface change**.
  - It gives the box's size change as `border-box` makes it.
  - It withdraws the `bg-muted` advice.
  - It says inline code becomes a chip, and gives the 10 px width and the `wrap-anywhere` remedy, as the checkpoint asked.
  - One sentence overstates (finding 2).

  The released `static/v0.11.0/` is byte-identical to its tag.

## Regressions looked for

- **Compositions and glass:** `compositions` 174, `on-brand` 116 and `expressive` 172 pass in both themes. On `/view/product-home/` the hero's two cards show the block's hairline 8 px inside the card's, as the checkpoint accepted. No inline `code` sits on glass or a field in any item.
- **The ink surface:** S1 passes with the border. The surface's block, editor and inline chip go flush with the surface and are told by the dark hairline (screenshot).
- **Reflow:** `blocks.spec.ts` 25 (reflow at 320 px) passes after `block-page.svelte`'s `wrap-anywhere`. The item pages' sideways scroll is pre-existing (finding 1).
- **Code inside a `pre`:** untouched by the inline rule, at any depth. I5 reads a block's `pre code`. The editor has no `code` element.

## Verdict

Lands: every criterion is met on evidence I re-ran, and the six findings are Low write-ins; points A and B are `013`'s to carry.

## Disposition

<to be filled in after the builder and the author answer>
