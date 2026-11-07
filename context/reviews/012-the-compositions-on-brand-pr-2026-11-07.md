# Review of 012 — The compositions, on brand (the built change)

Reviews [`specifications/012-the-compositions-on-brand.md`](../specifications/012-the-compositions-on-brand.md).

- **Date:** 2026-11-07
- **Status:** dispositioned; lands (every finding fixed by the builder or the author, 2026-11-07)
- **Reviewer:** a reviewer; not the author
- **Reviewed:** the working tree on `6fbdf99` (`v0.8.0`), uncommitted, on top of `009`, `010` and `011`'s uncommitted work. `012`'s part was told apart in two ways. First, a snapshot of the tree taken after `011` and before `012`'s build: it holds `glass`, the lens and `surface-stage`. Second, the specification's decisions. The files that differ from that snapshot:
  - the items `stage`, `stage-hero`, `marketing-bar`, `stage-card`, `live-console`, `marketing-footer` and `liquid-glass` (its lens removed), and `blocks/product-home/+page.svelte`;
  - `tokens/pluto.tokens.json`, `scripts/{tokens,build-tokens,contrast,lint-literals}.ts`, `src/app.css`, `registry.json` and `static/r/`;
  - the item pages (`stage`, `stage-hero`, `marketing-bar`, `stage-card`, `live-console`, `cta-band`, `marketing-footer`, `name-strip`, `proof-band`, `read-token`, `product-home`, `liquid-glass`, `pluto-theme` and its server load);
  - the views `stage`, `stage/grounds`, `stage-hero`, `stage-hero/poster` and `marketing-bar`, and `src/lib/preview/blocks.ts`;
  - the identity exhibit's `motion-demo.svelte` and `specimens/stage-hero.svelte`;
  - `CHANGELOG.md`;
  - the unit tests `blocks`, `contrast`, `generated`, `literals`, `registry` and `tokens`; the e2e specs `brand`, `compositions`, `expressive` and `keyboard`, and the new `on-brand.spec.ts`; the smoke test `compositions-add`.

  The owner's "Frost only: the lens is removed" and "After the `012` build's checkpoint" (`decisions.md`, 2026-11-07) were read as rulings. The lens's absence is correct, not a finding.
- **Re-ran:** Bun 1.4.4. Before the first run I recorded a `shasum` of every modified and untracked file (325). After all runs it was identical. Nothing was committed. The owner's dev server on 5173 was left running; I only read pages from it.
  - `bun run test:unit` → exit 0: **892 pass, 0 fail**, 4,973 `expect()` calls, 11 files. That is 47 fewer than `011`'s 939. I read every removed line: the drop is the stage's table rows, the stage variables' rows and the lens rows, all retired by decision 1 or the owner's lens ruling.
  - `bun run check` → exit 0: `COMPLETED 1800 FILES 0 ERRORS 0 WARNINGS 0 FILES_WITH_PROBLEMS`.
  - `bun run lint` → exit 0, "All matched files use Prettier code style!".
  - `bun scripts/lint-literals.ts` → exit 0: "0 literal(s) in registry item files; 1 allowance(s)". The one allowance is `011`'s L24, at `liquid-glass/pointer-light.ts:15`.
  - `bun run test:e2e`, the full suite → exit 0: **1962 passed, 4 skipped**, 3.4 m. Passes per spec, both projects: `on-brand` 114, `compositions` 174, `keyboard` 236, `axe` 540, `expressive` 172, `brand` 28, `four-dot` 50. The 4 skipped are `011`'s light-only checks in the dark project, skipped by design.
  - `bun run test:smoke`, the full suite → exit 0: **111 pass, 0 fail**, 5,724 `expect()` calls, 7 files, 118 s. That is `011`'s 109 plus test 4b in each of the two `product-home` apps.
  - My own probes, with Playwright on `vite preview` of the e2e build (port 4174). Scripts, logs and screenshots are in the session scratchpad, `review012pr/`.
    - The hero, swept from 1024 to 1920 px in 4 px steps: panel, field, object and every descendant of the object.
    - The Tab walk, forward and back, at 390×844, 390×640, 768, 1024, 1440 and 1920.
    - The ground check, at 320, 768, 1024 and 1920 in both themes.
    - Every element with its own text: the role it computes, against the ground it sits on.
    - The grounds under the bar's glass, sampled every 40 px down the page in both themes.
    - Two planted probes (findings 1 and 2).
    - Full-page screenshots of `/view/product-home/` at 1440 and 390, light and dark.
    - `/identity/light/` and `/identity/motion/`, on the dev server and on the preview build, diffed against the builder's "before" images.

## Acceptance criteria against evidence

1. **The stage's names are gone; the v0.9.0 and v0.10.0 snapshots do not exist** — met. EXECUTED: `generated.test.ts`'s "012 criterion 1" walks `src/app.css`, `registry.json`, `static/r/` and `src/lib/registry/`. It checks prefixes and selectors as text and the five names as class tokens, through the lint's own tokeniser. My own `grep` for the prefixes, the selectors, `glass-lens` and `GlassLens` over the same scope finds nothing. `static/` holds no `v0.9.0` or `v0.10.0`. `static/v0.11.0/r` equals `static/r`. The `rim` hits in `registry.json` are `--glass-rim`, which the tokeniser rightly reads as a variable.
2. **`stage` on each ground, both themes** — met. EXECUTED: `on-brand` criterion 2, five stages. For each ground: `data-mode`, `data-ground`, the background is `--background` or `--field-N`, and muted text is the ground's role. A second test checks a stage has no `.dark` ancestor but `html`.
3. **`stage-hero`: overlap, clearance, stacking, no object, poster** — met. EXECUTED:
   - The test covers 1024, 1280 and 1440 on both the block and the view.
   - My sweep from 1024 to 1920 found no width where the object, or any descendant of it, meets the panel. The smallest gap is 40.95 px, at 1024, which is `--gutter-stage` there. The overlap is never below 32.9% of the field's width. The page never scrolls sideways.
   - Stacked at 1023, 768, 390 and 320: the panel overlaps the field's top by the gutter (40.9, 30.7, 16 and 16 px). The object's box starts at the panel's bottom edge, and its padding keeps the cards a gutter below that.
   - The poster title is 160 px at 1440 and 56 px at 390, and does not overflow at 320. The poster view has no field and no glass.
4. **The bar** — met. EXECUTED:
   - The lifted four show in the bar and the footer in dark.
   - The panel has `blur(16px)`, an 8 px radius and is at most 1280 px wide at 1920.
   - It stays at y = 0 after 2000 px. That test runs at 390×640, as accepted at the checkpoint.
   - The 2.4.11 test passes. No `.dark` ancestor. The links compute `--foreground`.
   - My own walk, forward and back at six sizes, 390×640 among them, found no focused element above the bar's bottom edge and none off screen.
5. **The busy edge** — met. EXECUTED: on both surfaces there is no box-shadow at rest. While a run is pending (held by the test), the shadow is `<--primary> 0 0 0 2px inset`. Once the run resolves, there is none. READ: `literals.test.ts` fails `busy-edge` in a productive item through L22's sample list, and `generated.test.ts` pins the utility.
6. **The ground check** — met as written; its definition has a hole (finding 1). EXECUTED: 0 focusable elements on a field, on the block and all 13 views, at 1440 and 390, both themes. The self-test catches a button planted directly on `field-1`. My run at 320, 768, 1024 and 1920 also finds 0.
7. **`product-home`'s order and fields** — met; the lens parts are superseded by the owner's ruling. EXECUTED:
   - The block renders the bar, then `main`, then the footer.
   - The stages are `canvas:stage-hero`, `field-3:proof-band`, `canvas:live-console` and `canvas:cta-band`.
   - The console sits in a `field-4` panel with an 8 px radius. The fields are `field-1`, `field-3` and `field-4`, in that order.
   - There is no `data-glass-lens`, no `filter` element and no lens slot. Both glasses compute exactly `blur(16px)`.
8. **axe and the stop counts** — met. EXECUTED:
   - axe finds 0 violations on all 13 composition views at 360, 768 and 1280. It also finds 0 on the product home with both runs resolved and with both runs pending, in both projects.
   - `PRODUCT_HOME_STOPS_WIDE` (20) and `_NARROW` (18) hold exactly, forward and back. My walk counted 20 stops at 768 and wider and 18 at 390.
   - READ: the glass text rests on `011`'s 33 glass rows and the 20 new `glassOverGlass` rows. All pass: lowest 15.53 for foreground and 5.98 for primary.
9. **Literal lint, `liquid-glass` declared, `.field-1` in an installed app** — met. EXECUTED:
   - The lint reports 0 violations, and the compositions and the block have no allowance.
   - `registry.test.ts` checks that `stage-hero`, `marketing-bar` and `product-home` declare `liquid-glass`.
   - The smoke suite passes, 111 tests. Its new test 4b reads the installed app's built CSS for `.field-1`, `.field-3`, `.field-4`, `.glass`, `.surface-plain` and `.busy-edge`.
   - Test 2 now checks that `pointer-light.ts` lands and `glass-lens.svelte` does not. Test 6 checks that L24's one allowance holds in the app.
10. **`test`, `check`, `lint` pass; expectations change only in the named groups** — met for the counts. EXECUTED: all four suites pass. READ: I compared every changed expectation in the 11 edited test files with the decision or ruling that moves it.
    - `compositions` (bar links, `data-lit`, the busy edge moved to `on-brand`), `expressive` (the `.dark` read-token dot, the stage and light tests), `generated`, `literals`, `contrast`, `registry`, the view counts (11 → 13, 22 → 24 paths), `keyboard` and `tokens` are each in criterion 10's list.
    - The lens removals (`brand`, `generated`, `tokens`, `literals`' file count 324 → 323, `registry`'s two files) follow the owner's "Frost only".
    - `brand.spec.ts`'s planted button now comes from the expressive figure, because the stage sample is gone (decision 1).
    - No minimum was lowered, and no contrast row or count was loosened.
    - One helper now compares a value with itself (finding 2).

**Other questions asked of this review, answered:**

- **Text not covered by a measured row:** none found. EXECUTED: on the block, at four widths in both themes, every element with its own text on a field computes that field's legend. On glass or a `surface-plain` surface it computes one of the theme's measured roles. The exceptions are code slots, measured in `011`'s 114 slot rows, and button labels on their own fills. In light, the grounds under the bar run from white to ink, the darkest being `011`'s "over foreground" row; dark text has its worst case on the darkest ground, so the light rows bracket every ground. In dark, the lightest grounds under the bar are the lifted blue, the amber and the lifted green, each a measured field row.
- **Reading and focus order at 390:** right. The order is: skip link, home, "See the source", Menu, the hero's two actions, the shell card, the Python card, the console, the call to action, then the footer. The words come before the object in DOM order and on screen.
- **The `pluto-theme` and item pages:** no stale stage, bloom, rim, veil, energized or lens copy, by `grep` over `src/routes` (the exhibit aside), `src/lib/preview`, `src/lib/registry`, `registry.json` and the changelog. The copy I read matches the figures: "4.96:1 or more", "15.53:1 and 5.98:1".
- **The identity exhibit:** renders as before. EXECUTED: on the dev server, full-page shots of `/identity/light/` and `/identity/motion/` at 1440 in both themes are pixel-identical to the builder's "before" images. The local `.bloom` rule restores what the theme's utility gave the class. The preview build differs in one specimen, for a reason outside `012` (finding 5).

## Findings, most severe first

1. **Medium — The ground check passes a control in a transparent `surface-plain` wrapper on a field** (`tests/e2e/on-brand.spec.ts:309–330`, `onAField`; criterion 6; R25).
   `surface-plain` only resets roles. It paints no background (`src/app.css`, `@utility surface-plain`). The check treats any `surface-plain` ancestor as a safe ground, so it cannot tell a card from an empty wrapper.
   Failure, EXECUTED: on `/view/compositions/stage/grounds/` I planted `<div class="surface-plain"><button class="bg-primary text-primary-foreground">` in the `field-1` stage. `onAField` returns `[]` in both themes. The wrapper's background is `rgba(0, 0, 0, 0)`. The button's fill is `rgb(45, 72, 212)` on a field of `rgb(45, 72, 212)` in light, and `rgb(147, 176, 255)` on `rgb(147, 176, 255)` in dark: a control the field's own colour, on the field. Nothing in `012` builds this today, since `stage-card` and `live-console` carry `bg-card`. But criterion 6 is the guard the Risks section names ("A field's roles reach every descendant… Criterion 6 and R25 are the guards"), and the guard does not hold the case. The same is true of a `surface-plain` card given `bg-transparent`.
   Fix: in `onAField`, count a `surface-plain` ancestor as a ground only when it paints. That means its computed `background-color` has alpha 1, or it is `.glass`, which always paints its tint. Otherwise keep walking up to the next ground. Add a second self-test that plants the wrapper above and expects it caught. Have R25 and the `stage` page say "a `surface-plain` surface with its own opaque ground (`bg-card`)".

2. **Medium — The keyboard ring helper now compares the outline with the element's own `--ring`, so it cannot fail on colour** (`tests/e2e/keyboard.spec.ts:57–70`, `expectRingOutline`; criterion 10's "ring helper"; decision 1).
   Before `012`, outside an ink surface or a stage, the expected colour was the page's ring, `colour`. Now the expected value is `style.getPropertyValue("--ring")` read on the focused element itself. Every focus outline is drawn from that same variable, so the assertion compares a value with itself. `colour` is never used, because `--ring` is always set. Decision 1 asks the helper to read `--ring` "where the element sits (fields and glass set it)": on its ground, not on itself.
   Failure, EXECUTED: a link with `style="--ring: #ff00ff"` on the canvas, focused, computes `outline-color: rgb(255, 0, 255)` and `--ring: #ff00ff`, while the page's ring is `#2d48d4`. The helper's three values would match and pass. Across the 236 keyboard tests, a subtree that set a wrong ring would now go unseen. The old helper caught that everywhere outside the ink surface and the stage.
   Fix: read the expected ring from the nearest ground ancestor, `focused.closest(".surface-ink, .field-1, .field-2, .field-3, .field-4, .surface-plain, .glass")`, on that ancestor. With none, expect the page's `colour`. Add a one-line self-test: a planted `--ring` override on the focused element must make the helper fail.

3. **Low — The landing notes do not yet record the lens's removal** (`specifications/011-the-brand.md`, landing notes; `specifications/012-…`, landing notes).
   READ: the owner's "Frost only" entry says "both specifications' landing notes say so". `011`'s notes still describe the lens as built, and `012`'s read "Filled in when it lands".
   Fix: when `012` lands, add one line to each. In `011`: "decision 8's lens, `GlassLens`, the lens tokens, variables and rule were removed before release by the owner's ruling ("Frost only", 2026-11-07)". In `012`: "decision 7's `GlassLens` and criterion 7's `data-glass-lens` are superseded by the same ruling; criterion 7 checks their absence". Add the checkpoint's accepted deviations and this review's counts.

4. **Low — Two test titles still name what was removed** (`tests/unit/generated.test.ts`, "css[':root'] holds all 33 and css['.dark'] the 21 per-theme ones"; `tests/e2e/compositions.spec.ts`, "…with the card and the console energized").
   READ: the first list now holds 29 names, and its sibling test says 29. "Energized" is the retired utility; the state is now `busy-edge`. The assertions are right; only the titles are stale.
   Fix: "…holds all 29…" and "…with the card and the console busy".

5. **Low, outside `012`'s scope — In the built site, one identity specimen loses its frost** (`src/lib/identity/specimens/stage-hero.svelte:704–706`, `.light-glass .card`).
   Failure, EXECUTED: on `vite preview`, the I4 glass cards compute `backdrop-filter: none`. The built CSS keeps only `-webkit-backdrop-filter: blur(22px) saturate(1.5)` for that rule. So the four lights draw crisp over the cards, where the dev server frosts them (the builder's images, and mine on 5173, are identical to each other). `012` did not touch this rule. `light-case.svelte:639–640`, which writes the prefixed line first, keeps both in the build (INFERRED from its glass rendering). So this is a minifier effect on declaration order, and it predates this change (INFERRED).
   Fix: swap the two lines so `-webkit-backdrop-filter` comes first, as `light-case.svelte` does. Or record that the exhibit is judged on the dev server.

## Constitution checks

- §4.1 source, not a package: met. The smoke install of `product-home` lands `liquid-glass`'s two files and the composition items. The app builds, passes `svelte-check` and lints clean. Nothing reaches back (EXECUTED, smoke).
- §4.3 tokens are the one source: met. The literal lint finds 0 literals and no allowance in any composition or the block (EXECUTED). My `grep` for hexes, `rgb(`, arbitrary px or rem and inline `style=` over the nine items and the block finds none. `busy-edge` is emitted by the token build from `--motion-busy`, `--ease-standard`, `--line-width` and `--primary`. The hexes in the exhibit's local `.bloom` rule are in the exhibit, which the lint does not cover by decision (2026-11-01).
- §4.4 accessible by default: met in what was measured. Contrast holds: 20 `glassOverGlass` rows, and every ground found under the bar is bracketed by a measured row. axe passes on every view and the block in both themes. The keyboard walks hold, and no focused element is ever under the bar. Findings 1 and 2 are gaps in the guards, not failures seen on any page.
- §4.5 and §4.6: no new package. `liquid-glass` is declared by the three items that use it (EXECUTED, `registry.test.ts`).
- §6 never break silently: nothing `012` changes was released (decisions.md, "One release, 0.11.0"). The changelog's one 0.11.0 entry describes the compositions as they now are, names `busy-edge` among the new global class names, and says nothing of the stage or the lens (EXECUTED, `registry.test.ts`'s new check; READ).

## Verdict

Does not land yet: findings 1 and 2 stand. The ground check accepts a control in a transparent `surface-plain` wrapper on a field, and the keyboard ring helper can no longer fail on colour. Findings 3 to 5 are write-ins, each with its fix text.

## Disposition

The author's answers (the builder's fixes, and the author's write-ins):

1. Fixed: `onAField` walks up through the grounds. A field means the control is on the field. Glass always counts as a ground. A `surface-plain` counts only when its computed background has alpha 1; otherwise the walk goes on. A new self-test plants the transparent wrapper beside a `surface-plain bg-card` one on `field-1`, and only the wrapped button is flagged. The `stage` page and R25 (by the author) now say "a `surface-plain` surface with its own opaque ground (`bg-card`)".
2. Fixed: `expectRingOutline` reads `--ring` on the nearest ground ancestor (an ink surface, a field, glass, or an opaque `surface-plain`); with none, it expects the page's ring. A new self-test sets `--ring: #ff00ff` on the focused element and expects the helper to fail. Every keyboard test passes with the stricter helper.
3. Fixed by the author: both specifications' landing notes record the lens's removal, the checkpoint's accepted deviations and this review's counts.
4. Fixed: "…holds all 29…" and "…with the card and the console busy"; the `holdRuns` comment no longer says "energized".
5. Fixed: in `stage-hero.svelte`, `-webkit-backdrop-filter` now comes first. On `vite preview`, the I4 cards compute `blur(22px) saturate(1.5)`; against the dev server's images, 0 pixels differ by more than 8 levels, in both themes (EXECUTED by the builder).

Red first: both self-tests failed against the old checks, 4 failures across the two projects (EXECUTED by the builder).

Counts after the fixes (the builder's): unit 892 pass; `check` 0 errors, 0 warnings; lint clean; literal lint 0 violations, 1 allowance (L24); e2e 1966 passed, 4 skipped, 0 failed; smoke 111 pass.

Verdict as it stands after the disposition: lands. The fixes were not re-reviewed by the reviewer; the counts above are the builder's.
