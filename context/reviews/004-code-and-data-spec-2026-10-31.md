# Review of 004 — Code and data

- **Date:** 2026-10-31
- **Reviewer:** an agent (Claude), a fresh sub-agent of the orchestrating session; not the author
- **Reviewed:** the specification as drafted (`specifications/004-code-and-data.md`, status "drafted, 2026-10-31; awaiting review")
- **Re-ran:**
  - `registry.json` summarised: 39 items (1 theme, 3 font, 1 lib, 29 ui, 5 block), 153 item files, 31 `.ts` files, 24 distinct registry dependency names; `aliases` name `hooks` and `lib`.
  - A grep of the 31 item `.ts` files for a quoted string holding a number with a length unit or a CSS colour word: **0 hits** (so L16 trips nothing that exists).
  - `src/lib/preview/blocks.ts`: the views include `settings/failed`; `003`'s Landing notes count **18** views, 116 theme checks, 220 axe scans, 83 view stops, 42 toolbar stops.
  - Tailwind 4.3.3 (`compile` from the pinned package) over a scratch stylesheet: `text-code-keyword` → `color: var(--code-keyword)` (generated); `bg-code-keyword`, `stroke-0`, `w-3xs`, `max-w-sm`, `not-first:groove`, `aria-pressed:bg-foreground`, `aria-checked:bg-foreground`, `data-[state=on]:bg-foreground`, `wrap-break-word`, `rotate-90`, `aspect-video` generated; **`max-h-sm` absent** (no rule). `hover:` rules are emitted before `aria-*` rules. `@theme inline` variables named as candidates (`--text-sm`, `--spacing`, `--color-muted`, `--ease-entrance`) **are emitted** into `@layer theme { :root, :host { … } }`.
  - `@tailwindcss/oxide` `Scanner` over a sample `.ts` theme file: it extracts `--color-code-foreground`, `--font-mono`, `--spacing`, `--text-sm`, `--text-sm--line-height`, and the class strings `text-code-keyword` and `font-medium`.
  - READ (prior art, cited, not copied): `packages/cli/src/utils/updaters/update-css-vars.ts` (`updateThemePlugin`, `isColorValue`), `packages/cli/src/commands/registry/deps-resolver.ts` (`IGNORE_DEPS` holds `svelte`, `@sveltejs/kit`); the stock built JSON for `use-highlighted-code`, `highlighter`, `code-block`, `chart`; the stock source of the six items, the hook and the library; `src/lib/registry/ui/field/*.svelte` (import form `./field-context.svelte.js`).

## Acceptance criteria against evidence

1. **Install, 32 packages, 18 named** — met on paper: 23 + 9 = 32; `002`'s 9 + `code-editor`'s 7 + `shiki` + `layerchart` = 18 (INFERRED). `layerchart`'s `svelte` peer is not added: the resolver ignores it (READ). But see finding 3: `code-block` also names `tailwind-variants`, which does not change 18 but changes two other counts.
2. **Checks and lint** — countable; no evidence yet (INFERRED).
3. **Tokens: 12 slots, 10 contrast rows, 12 light / 0 dark / 12 theme, `@utility scrollbar`, 5 meter rules** — met: the `code` map is a new key, so `tokens.test.ts`'s "48 per theme" survives (READ `scripts/tokens.ts`: themes are validated apart from other keys). The contrast numbers match the Shiki memo §4.1 (READ). The meter rules nest selectors under `@layer components`, which the CLI accepts (`001` decision 15's rule: rules, never declarations, under an at-rule) (INFERRED).
4. **Registry source: 49 items, types 1/3/2/1/37/5, 8 groups, 27 names, 34 `meta.stock`, 10 `since`** — met: 39 + 8 ui + 1 lib + 1 hook; 24 + `use-highlighted-code`, `highlighter`, `toggle` (INFERRED from the tables).
5. **Registry build: 50 + 50 files, hook/lib targets, 7 ranges, 10 `tailwind-variants` items** — **not met as written**: the stock `code-block.svelte` and `code-block-line.svelte` import `tv` (READ), so 11 items name `tailwind-variants` unless the spec drops it (finding 3). The hook's bare target `use-highlighted-code.svelte.ts` and the library's `highlighter.ts` match what the stock build writes (READ the stock JSON).
6. **Site build: 50, 50, 68 prerendered** — met: 50 pages + 18 views = 68 (the text says 17 views; the number is right, the word is wrong; finding 2).
7. **Dev server: 49 items** — countable (INFERRED).
8. **49 preview pages** — countable (INFERRED).
9. **Lint: 193 files, 68 bad, 45 good** — met: 153 + 40; 64 + 4; 42 + 3 (INFERRED). L16 flags nothing in the 31 existing `.ts` files (EXECUTED grep).
10. **Merge path: (d) 10 of 10 `tv` importers** — **not met as written**: 11 with `code-block` (finding 3).
11. **Blocks unchanged** — met (INFERRED).
12. **axe: 276 scans** — **not met as written**: `003` landed at 220, so 220 + 60 + 2 = **282** (READ `003` Landing notes; finding 2).
13. **Themes: 134** — **not met as written**: (50 + 18) × 2 = **136** (finding 2).
14. **Tokens in the browser: 3 more per theme** — countable; `text-code-keyword` computes `--primary` by `color: var(--code-keyword)` (EXECUTED compile).
15. **Keyboard: 51 catalogue, 52 fixture over 24, 75 view over 17, 41 toolbar, 19 behaviours** — catalogue 2 + 49 = 51 and fixtures 39 + 13 = 52 over 24 are right; **view and toolbar stops are stale**: 83 over 18 and 42 over 5 (finding 2). The code-block fixture's order is reversed (finding 9).
16. **Heights, targets, loops** — countable (INFERRED).
17. **Code block C1–C4** — C3 "focusing it draws the ring on the `pre` itself" passes while the ring is clipped (finding 1). C1's class-per-token path is the untested point; the oxide scanner does pick the class table out of a `.ts` file (EXECUTED here), so the risk is lower than the spec says.
18. **Editor E1–E4** — E3's `var()` targets live in `@theme inline`; they resolve because the theme file is scanned (EXECUTED), which the spec does not say and `001` denies (finding 4). The ring on `.cm-editor` is clipped by the root (finding 1).
19. **Chart H1** — **not met as written**: "0 `svg`" in the raw HTML fails on the two summary carets; "2 `svg[role=figure]`" is doubtful (finding 7). `stroke-0` is a stroke-width utility and lint-clean (EXECUTED compile; READ `lint-literals.ts`: `stroke-0` matches no colour, tint or border rule).
20. **Meter M1** — met as described; the native `<meter>` with `aria-valuetext` was exposed as `meter "Fuel": 4.81 billion…` in both engines (READ data memo §6.2). axe on the meter page was never run (INFERRED that `aria-valuetext` is allowed on the `meter` role; it is in ARIA 1.2's supported list, READ data memo §6.1).
21. **Popover, accordion, toggles P1/A1/T1** — T1's "the group's checked item likewise" fails as specified (finding 6); P1 passes, but an untitled popover is an unnamed dialog (finding 5).
22. **Smoke: 47 files** — met: 4 + 9 + 1 + 1 + 2 + 2 + 2 + 4 + 9 + 5 + 3 + 2 + 2 + 1 = 47 (INFERRED). `-o` into a fresh app is `003`'s rule.
23. **9 unit, 9 browser, 5 smoke files** — met (INFERRED).
24. **Release 0.4.0, 11 of 11** — met (INFERRED).
25. **Checkpoint and walk** — the checkpoint sits where class-per-token rendering is first proven (step 3); right place (INFERRED). The walk's 136 loads = 68 × 2 is right.
26. **In the app** — pending by design.

## Findings, most severe first

1. **High — `overflow-hidden` on the roots clips the focus ring of the code block's `pre` and of the editor** (decision 8, "The root is `bg-muted text-foreground rounded overflow-hidden`"; decision 9, "`<div data-slot="code-editor" class="bg-muted rounded overflow-hidden">`"; decision 9's table, `&.cm-focused` outline at `--focus-offset`).
   Failure: `001`'s ring is a 2 px outline at a 2 px offset, so it reaches 4 px past the element. The `pre` carries the content padding itself (`px-4 py-3`) and spans the root's width, so its ring is cut at the left, right and bottom; `.cm-editor` fills its root, so its ring is cut on all four sides and the home page's main control shows **no** focus indicator. `003`'s review finding 1 found the same mechanism in the card and `blocks.spec.ts` check 27 was written for it. C3 and E3 read the computed `outline` and pass with the ring invisible.
   Fix: `code-block`: draw the ring on the root, as `input-group` does (`has-[[data-slot=code-block-content]:focus-visible]:focus-ring` on the root, `focus-visible:focus-ring-none` on the `pre`; add `code-block.svelte` and `code-block-content.svelte` to the `focus-ring` and `focus-ring-none` allowlists in decision 15), and have C3 and the keyboard test read the outlined ancestor as they do for `input-group`. `code-editor`: drop `overflow-hidden` from the root and put `border-radius: var(--radius)` on `&` and `.cm-scroller` in the theme, so the ring sits outside an unclipped `.cm-editor`. Add to both C3 and E3 the unclipped check of `003` check 27 (no ancestor between the stop and `<main>` computes `overflow` hidden or clip, or the stop's rectangle grown by 4 px fits inside it).

2. **Medium — Four counts carry `003`'s pre-landing numbers** (decision 16 "with the 17 views"; decision 17 browser 1, 2, 4; criteria 12, 13, 15).
   Failure: `003` landed with 18 views (`/view/settings/failed/`, Landing notes bend 8): 220 axe scans, 116 theme checks, 83 view stops over 18 views, 42 toolbar stops. So the suites will report axe **282** (not 276), theme **136** (not 134), views **83 over 18** (not 75 over 17), toolbars **42** (not 41). The 68 prerendered pages and 136 walk loads are right, which shows "17" is the slip.
   Fix: replace the five numbers and "17 views" with 18; cite `003`'s Landing table rather than its decision 20.

3. **Medium — `code-block` keeps stock's `tv`, so it names `tailwind-variants`** (decision 2 "`toggle` and `toggle-group` the third"; decision 4's table, `code-block` packages "`phosphor-svelte`"; criterion 5 "10 of 10 `tailwind-variants` items"; criterion 10 "case (d) 10 of 10").
   Failure: stock `code-block.svelte` and `code-block-line.svelte` define `codeBlockVariants` and `codeBlockLineVariants` with `tv` (READ), and decision 8 keeps `variant`, `size` and the four line variants. `build` detects the import and the built `code-block.json` names `tailwind-variants@^3.3.1`; `registry.test.ts` and `utils.test.ts` then count 11, and decision 4's "Packages detected" is wrong for the one item whose JSON the smoke test reads.
   Fix: either add `code-block` to the `tailwind-variants` row and make the counts 11 of 11, or say the restyle replaces the two `tv` calls with plain class maps and drops the `codeBlockVariants` exports (then the item's exported interface differs from stock's, which the item page should say).

4. **Medium — The editor theme reads `@theme inline` variables, which `001` says are not emitted** (decision 9, "colours from `--color-code-*`, `--color-muted-foreground`… sizes from `--spacing`… type from `--font-mono`, `--text-sm`, `--text-sm--line-height`"; `001` decision 15: "Tailwind inlines `@theme inline` values into utilities and does not emit them as variables"; `002` decision 3 wrote a curve out for that reason).
   Failure: the values do resolve, but only because Tailwind emits an inline theme variable when its name appears in a scanned source file (EXECUTED: the oxide scanner extracts `--text-sm` and `--color-code-foreground` from a `.ts` file; `compile` then writes them into `@layer theme { :root, :host }`). The specification does not state this, so a builder who follows `001`'s rule writes different names, and an app that narrows Tailwind's sources with `@source` and leaves the editor folder out gets `font-size: var(--text-sm)` undefined and a 16 px editor. The editor memo §5.1 saw it work and did not say why.
   Fix: read `:root` names wherever one exists (`--code-<slot>`, `--muted-foreground`, `--border`, `--input`, `--destructive`, `--ring`, `--focus-width`, `--focus-offset`, `--line-width`, `--radius`), which also makes the editor theme read the same properties as the Shiki theme; for `--spacing`, `--text-sm`, `--text-sm--line-height`, `--font-mono` and `--font-weight-medium`, state the mechanism and its condition (the theme file must be among Tailwind's sources; it is by default under `src/`), keep E3's 13.5 px check as the proof, and record in decisions.md that `001` decision 15's "not emitted" is "not emitted unless referenced", so `002` decision 3's reasoning is corrected rather than silently contradicted.

5. **Medium — `role="dialog"` on a popover with no guaranteed name** (decision 11, "`PopoverContent` sets `role="dialog"` and, when a `PopoverTitle` is rendered inside it, `aria-labelledby`").
   Failure: axe's `aria-dialog-name` (tag `best-practice`, in `axe.spec.ts`'s `TAGS`) fails any `role="dialog"` without an accessible name. The preview's form popover and the alignment popovers have no title; an app that puts one sentence in a popover ships an unnamed dialog, and a screen reader announces "dialog" and nothing else.
   Fix: make the name required: `PopoverContent` takes `aria-labelledby` from a `PopoverTitle` or an `aria-label` prop, and the item page says one of the two is mandatory; or set `role="dialog"` only when a title is present (the data memo §4.1's second option) and say that an untitled popover is plain content. Scan each preview popover open, not only the "Fuel" one.

6. **Medium — The toggle group's selected item is never inverted** (decision 13, "`aria-pressed:bg-foreground aria-pressed:text-background`… A selected item is inverted, as `toggle`"; T1 "the group's checked item likewise").
   Failure: in `single` mode bits-ui renders `role="radio" aria-checked` with `aria-pressed` undefined (READ data memo §4.4), so `toggleVariants`' `aria-pressed:` classes match nothing and the checked preset is told by nothing at all. T1 fails; the `/admin` strip ships with no visible selection.
   Fix: use `data-[state=on]:bg-foreground data-[state=on]:text-background` in `toggleVariants`; bits-ui sets `data-state="on"` on toggles and on group items in both modes (READ §4.3, §4.4; stock's maia CSS keys the group item's pressed look on it). The variant generates under 4.3.3 (EXECUTED).

7. **Medium — H1's SVG counts cannot hold** (decision 17, code.spec H1: "0 `svg`" in the raw HTML; "after hydration, 2 `svg[role="figure"]`").
   Failure: decision 10's `<summary>` "Show as table" carries the `003` caret, a `phosphor-svelte` icon that renders an inline `<svg>`, so the raw HTML holds 2 `svg` elements. After hydration a layerchart figure with a tooltip renders a second, empty `figure` layer (READ data memo §3.1, "then a second empty `figure` (the highlight layer)"), so two charts may yield 4 `svg[role=figure]`.
   Fix: assert "0 `svg` inside `figure[data-slot=chart]` outside its `details`" (or "0 `svg[role=figure]`") in the raw HTML, and "each of 2 figures holds at least 1 `svg[role=figure]`" after hydration; keep the `fill`, `stroke` and `stroke-width` checks on the first `rect` and `path`.

8. **Low — `max-h-sm` generates no CSS** (decision 9, "The app caps it with a class such as `max-h-sm` (a container keyword L7 allows)").
   Failure: Tailwind 4.3.3 has the container scale for widths (`w-3xs`, `max-w-sm` generate) and not for heights: `.max-h-sm` is absent from a compile (EXECUTED). The home page would copy a class that does nothing, and L7's keyword list over-allows heights it cannot see.
   Fix: say `max-h-96` or `max-h-(--…)` in app code (app pages are not linted by our rule) and note in decision 15 that L7's container keywords are width-only in Tailwind.

9. **Low — The code-block fixture's stop order is reversed** (decision 8, "Keyboard fixture: 2 stops: the Python block's `pre`, then its copy button").
   Failure: the copy button sits in `CodeBlockActions` inside `CodeBlockHeader`, which precedes `CodeBlockContent` in the DOM; Tab reaches the button first.
   Fix: write "the copy button, then the `pre`", or put the preview's copy button in the footer and say so.

10. **Low — The hook's import form** (decision 7, "Both files are `001`-style TypeScript: `#lib` imports extensionless").
    Failure: a `.svelte.ts` module is imported in this repository as `./field-context.svelte.js` (READ `field-label.svelte` line 5 and three more), not extensionless; an extensionless `…/use-highlighted-code.svelte` names a Svelte component path that does not exist and relies on resolver fallbacks.
    Fix: say `code-block-content.svelte` imports `#lib/registry/hooks/use-highlighted-code.svelte.js` and the hook imports `#lib/registry/lib/highlighter` extensionless; note that the "0 `/index.js"`" check is unaffected.

11. **Low — Which tokens get a class** (decision 7, "a table of the twelve class strings"; the Design section's `=→(none)`).
    Failure: the two disagree. Mapping every `foreground`-slot token (about half of Python's) to `text-code-foreground` doubles the HTML for nothing, since the `pre` is already `text-foreground`.
    Fix: say tokens in the `foreground` slot carry no class and the table has eleven class strings; C2's `=` check then tests that rule.

12. **Low — The tooltip indicator with no `swatch`, and the `color` prop** (decision 10, "`ChartConfig`… adds `swatch?: string`"; "the indicator is a `size-2 rounded` `div` carrying the series' `swatch` class").
    Failure: stock's `indicatorColor` fell back to `item.config?.color` and `item.color` (READ `chart-tooltip.svelte`); with those gone and `swatch` optional, a key without one renders an empty 8 px square. Stock's `color` prop wrote a `style` and is not mentioned.
    Fix: omit the indicator when the key has no `swatch` (or use `bg-foreground`), drop the `color` prop, and say both. Consider a visible `figcaption` (`caption` prop) with `aria-label` as the fallback, since an `aria-label` names the figure for no sighted reader (WAI tutorial, READ data memo §3.2).

13. **Low — The CLI derives a stray theme variable per slot** (decision 5, "`cssVars.light` gains `--code-<slot>: var(--<semantic>)`").
    Failure: `updateThemePlugin` derives a theme variable for every light key; a value that holds no `#`, `hsl`, `rgb`, `oklch` or `--color-` is not a colour to it, so the app's `@theme inline` gains `--code-<slot>: var(--code-<slot>)` beside our `--color-code-<slot>` (READ `update-css-vars.ts`). It is harmless (the unlayered `:root` beats `@layer theme`, and `--code-` is no Tailwind namespace), but it is twelve lines in every app and the spec should know of them.
    Fix: say so in decision 5, and have `code-add.test.ts` assert the app's `app.css` holds `--color-code-keyword: var(--code-keyword)` exactly once and that a second `add` leaves it byte-identical (as `001`'s smoke does).

14. **Low — The meter is a pill** (decision 14, "Classes `h-2 w-full rounded block`").
    Failure: an 8 px bar with the 8 px case radius has fully round ends, which v2 §05 reserves for dot-derived elements (decisions.md, "Avatars take the 8 px case radius, not a circle"; the switch geometry).
    Fix: `rounded-none` (square ends, as v2's lines are), or record the exception in decisions.md.

15. **Low — The fallback `<pre>` cannot take "the editor's classes"** (decision 9, "The `pre` takes the editor's classes so the swap does not jump").
    Failure: CodeMirror's classes are generated by style-mod; the `pre` can take only Tailwind equivalents, and it has no gutter, so the text shifts by the gutter's width at hydration.
    Fix: name the classes (`font-mono text-sm py-3 ps-…`) and either accept the gutter shift or pad the `pre`'s start by the gutter's width in `--spacing` steps.

16. **Low — L16's parenthesis reads as six exceptions** (decision 15, "a CSS named colour as a whole word (`red`, `black`, `white`, `gray`, `grey`, `transparent` excepted)").
    Failure: the Allows column excepts only `transparent` and `currentColor`; a builder reading the table excepts `red` too, and the bad sample `color: "red"` then passes.
    Fix: "a CSS named colour as a whole word, such as `red`, `black`, `white`, `gray`, `grey`; `transparent` and `currentColor` excepted".

## Constitution checks

- §4.1 source, not a package: every item is source; `highlighter` and the hook travel as `registry:lib` and `registry:hook` files, as stock's do. Nothing reaches back.
- §4.2 in tandem: criterion 26 and decision 19 bind the home page. The home page's needs (primitives memo §1.2, app constitution §2) are all served: editor, output block, install snippet, meter, popover, accordion; the consent banner and the `<dl>` are the app's by that memo.
- §4.3 tokens are the one source: holds in every class table; the twelve slots are semantic names, no new primitive; `sideOffset={4}` is `002`'s accepted number; `aspect-video` is a ratio. Finding 4 is about where a token is read from, not a literal. Finding 13 is a CLI by-product, not a literal of ours.
- §4.4 accessible by default: findings 1, 5 and 6 each leave a state invisible or unnamed by default; fixed, the contracts (name, role, value; keyboard; no trap; tables for charts) are the strongest in the registry so far.
- §4.5, §4.6 pinned and named: 9 packages at tested versions with caret ranges, each named by the item that imports it; the resolver ignores `layerchart`'s `svelte` peer (READ), so 18 holds. `codemirror` and `tailwind-merge` are excluded by test.
- §6 never copy: the stock six are installed and restyled (allowed use of a dependency, §4.6); `code-editor` and `meter` are "written fresh" from memos that describe, not copy; the hand-made Shiki theme and `tokenClass` are ours. The prior art read for this review is cited, not reproduced.

## Verdict

Does not land yet: the clipped focus rings (1), the stale `003` counts (2), `code-block`'s `tailwind-variants` (3), the `@theme inline` reads (4), the unnamed dialog (5), the toggle group's selected state (6) and H1's SVG counts (7).

## Disposition

Answered by the author (the orchestrating session, as design lead) on 2026-10-31. Every finding is fixed in the specification; none is refused.

1. **Fixed.** `code-block`'s root draws the ring (`has-[[data-slot=code-block-content]:focus-visible]:focus-ring`; the `pre` is `focus-visible:focus-ring-none`; both files allowlisted in decision 15). `code-editor`'s root loses `overflow-hidden`; the theme rounds `&` and `.cm-scroller`. C3, E3 and the keyboard suite check the ring on the ancestor and that it is unclipped by `003` check 27's rule, for all 52 fixture stops.
2. **Fixed.** 18 views; axe 286 (220 + 60 + 6, since finding 5 opens three popovers); theme 136; 83 view stops over 18; 42 toolbar stops. Cited to `003`'s Landing table.
3. **Fixed.** `code-block` keeps `tv` and names `tailwind-variants`; 11 of 11 in decisions 2, 4 and 17 and criteria 5 and 10.
4. **Fixed.** The theme reads `:root` names wherever one exists; the five `@theme inline` names it still reads are listed with the mechanism and its condition in decisions 5 and 9; decisions.md records the correction to `001` decision 15's wording.
5. **Fixed.** A popover's name is required: `aria-labelledby` the title, else a `label` prop as `aria-label`; the preview's three popovers are each opened under axe, and P1 checks the two untitled ones are named.
6. **Fixed.** `data-[state=on]:bg-foreground data-[state=on]:text-background`; T1 names the attributes each mode carries.
7. **Fixed.** H1 counts `svg[role="figure"]` (0 raw; at least 1 per figure hydrated).
8. **Fixed.** `max-h-96` or `max-h-(--…)` in app code; decision 15 notes L7's container keywords are width-only.
9. **Fixed.** The fixture is the copy button, then the `pre`.
10. **Fixed.** `…/use-highlighted-code.svelte.js`; the hook imports `highlighter` extensionless.
11. **Fixed.** Foreground-slot tokens carry no class; eleven class strings; C2 tests the rule on `=`.
12. **Fixed.** The indicator renders only with a `swatch`; the `color` prop goes; the figure's `label` is a visible `figcaption` (`captionHidden` for `sr-only`) and the figure is `aria-labelledby` it.
13. **Fixed.** Decision 5 documents the twelve derived lines; smoke assertion 8 checks `--color-code-keyword` once and a byte-identical second `add` (16 assertions).
14. **Fixed.** `rounded-none`; the meter's rules carry no radius; the reason in decision 14 and decisions.md.
15. **Fixed.** The fallback is `font-mono text-sm py-3 ps-8 overflow-x-auto`, with the few-pixel gutter shift accepted and said.
16. **Fixed.** L16's wording: "such as `red`, `black`, `white`, `gray`, `grey`; `transparent` and `currentColor` excepted".

The specification's Status line cites this review. Verdict after disposition: fit to build.
