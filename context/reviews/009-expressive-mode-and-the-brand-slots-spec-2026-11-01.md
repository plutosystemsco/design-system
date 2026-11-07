# Review of 009 — Expressive mode and the brand slots

- **Date:** 2026-11-01
- **Status:** in review
- **Reviewer:** a reviewer; not the author
- **Reviewed:** [the specification as drafted](../specifications/009-expressive-mode-and-the-brand-slots.md), against its three research memos and `../decisions.md`, "The identity is commissioned, with options", on `v0.8.0` (`6fbdf99`) with the working tree's uncommitted files.
- **Re-ran:** five scratch experiments, all in the session scratchpad, none in the repository.
  - `bun scripts/lint-literals.ts` → 0 literals, exit 0. `bun test ./tests/unit` → 646 pass, 1 fail (`deps.test.ts:63`: the working tree's `package.json` adds 7 font packages for the identity exhibit).
  - Every contrast figure in decisions 3 and 4, plus 30 more pairs, through `contrastRatio` and `compositeAlphaByte` from `scripts/contrast.ts`. The figures are in the findings.
  - `cn` (the `cn` 0.5.0 package that `utils` re-exports) on 13 class lists holding the new utility names.
  - Tailwind 4.3.3's `compile` from `@tailwindcss/node` on the proposed `@utility` rules (`bloom` with `&::before` and `&[data-lit]::before`, `press` with `&:active`, `veil`, `text-display`, `rounded-action`, `rounded-stage`) and on `@theme inline { --font-heading: var(--font-face-heading) }` → exit 0. Each compiles as written, and under `hover:`, `md:` and `sm:`. `.rounded-action` sorts before `.rounded-full`, `.rounded-lg` and `.rounded-none`.
  - Playwright's Chromium on a page holding the slot rules: body text, a heading and a display line inside a wrapper that sets `--font-face-sans` and `--font-face-heading`. I also read a remapped `--mark-1`, and a `border-radius` whose variable is undefined. The results are in findings 9 and 18.
  - The lint's own tokeniser (`/[^\s"'`{}<>=,;]+/g`, `lint-literals.ts:535`) run over the files of all 63 items, with decision 9's ten L22 names.

## Acceptance criteria against evidence

1. Emits every variable — checkable. The names are not listed (finding 17). The display family cannot be emitted as a `type.families` entry (finding 5). INFERRED.
2. `v0.8.0`'s `:root` and `.dark` keep their values — checkable. The tag exists (`v0.8.0` → `6fbdf99`). READ.
3. Productive faces and radius unchanged — checkable in the preview. It says nothing about an installed app, which is where the faces change (finding 2). INFERRED.
4. Stage pairs at 4.5:1 — the values pass (EXECUTED: the lowest text pair is 7.21, `input` 4.57). `contrast.ts` cannot hold the pairs as written (finding 6).
5. L22, zero violations — not met as written. Two existing productive files fail (finding 7), and so does the generated `token-names.ts` (finding 8). EXECUTED.
6. `meta.modes` everywhere — checkable. Four existing tests assert `meta` holds exactly `group` and `since` (finding 12). READ.
7. `rounded-action` 8 / 9999 / 8 px — checkable. EXECUTED: the variable resolves per subtree.
8. `surface-stage` — checkable. It tests 2 of the roles the remap changes. It does not catch the remap that breaks contrast (finding 1).
9. Reduced motion reads `0ms` — checkable. It omits `--motion-slide` (finding 19).
10. `readToken("mark-1")` — checkable. EXECUTED: a remapped `--mark-1` reads `#7A9BFF` on the stage and on its child.
11. The display slot — checkable for display. The sans slot and "display follows heading" fail in a subtree (finding 9). EXECUTED.
12. axe on two pages — checkable. The canvas needs a text alternative (finding 20).
13. All pass, existing suites unchanged — not as written. Named tests must change (finding 12), and `deps.test.ts` fails today. EXECUTED.

## Findings, most severe first

1. **High — The stage remap turns ink-on-fill text to paper** (decision 3, `009:92`).
   The remap sends "`--foreground` and the `-foreground` roles to `--stage-foreground`". In the dark theme, five `-foreground` roles are ink, because they sit on light fills: `primary-foreground`, `sidebar-primary-foreground`, `destructive-foreground`, `success-foreground` and `caution-foreground` (READ, `tokens/pluto.tokens.json`). The table's own `stage-primary-foreground` (ink) is never mapped to anything.
   Failure: a default `button` on a stage shows paper on lifted blue, 2.45:1. A destructive button is 2.32. A success fill is 1.95. A caution fill is 1.81 (EXECUTED). Each needs 4.5.
   Fix: list the remap role by role. `--background` goes to `--stage`. `--card` and `--popover` go to `--stage-raised`. `--muted-foreground` goes to `--stage-muted`. `--border` goes to `--stage-line`. `--primary`, `--ring` and `--sidebar-primary` go to `--stage-primary`. `--primary-foreground` goes to `--stage-primary-foreground`. `--mark-N` goes to `--stage-mark-N`. Every other role keeps its `.dark` value. In dark, the paper `-foreground` roles already equal `stage-foreground`. Criterion 8 adds: a default and a destructive `button` on a stage keep their dark text colour, and each passes 4.5:1.

2. **High — The face slots never reach an installed app** (decision 2; criterion 3).
   In an app, `--font-heading` in `@theme inline` is written by the CLI from each font item's `font.family`, not by `pluto-theme`. The CLI's font step sets `cssVars.theme[font.variable] = font.family`. It merges that after every item's `cssVars` (READ, `node_modules/shadcn-svelte/dist/index.mjs`, function `ls` and the add path). The build mirrors this: `appCss` writes `fontTheme` from `type.families` (`scripts/build-tokens.ts:405`), and `fontObject` writes the font items (`:488`). Decision 1's scope does not list the font items or `fontObject`.
   Failure: the builder changes `appCss` and the preview passes criteria 3 and 11. An app that runs `add` still gets `--font-heading: "IBM Plex Sans Variable", …` as a literal, and its slots do nothing. `tests/smoke/registry-add.test.ts` test 4 (`@theme inline` equals ours) then fails. If only the font item's `variable` is renamed instead, `@theme inline` values are not emitted as variables, and every `var(--font-face-*)` falls back to the browser default.
   Fix: each font item's `font.family` becomes `var(--font-face-<role>)`. `pluto-theme`'s `css[":root"]` declares `--font-face-sans`, `-heading` and `-mono` from `type.families`. Scope lists `fontObject` and the three font items. Add a smoke criterion: after `add four-dot`, the app's `@theme inline` holds `--font-heading: var(--font-face-heading)`, its `:root` holds the three face strings, and smoke test 4 still passes.

3. **High — `cn` deletes the display steps** (decision 5; `010` throughout).
   `cn` follows tailwind-merge's rules. A `text-<word>` that is not a size step counts as a text colour.
   Failure (EXECUTED): `cn("text-display", "text-foreground")` returns `"text-foreground"`. `cn("text-display text-stage-foreground")`, `cn("text-section", "text-muted-foreground")` and `cn("text-proof text-primary")` also drop the step. Every `010` composition that sets a display step and a colour through `cn`, or takes an app's `class`, loses the step. No lint or criterion catches it.
   Fix (recommended): give the steps a prefix that tailwind-merge does not claim, for instance `type-display`, `type-section` and `type-proof`. EXECUTED: `cn("type-display", "text-foreground")` keeps both. The alternative is to extend `cn`'s configuration in `utils`, which changes every app's `cn`. Add a unit case: `cn(<step>, "text-foreground")` keeps the step.

4. **Medium — Where each new variable is emitted is not decided** (decisions 2 to 7).
   The spec says "emitted as" but not into what. Each place behaves differently (READ, `../research/2026-10-27-the-foundation-run-kit-3-fonts-and-the-theme-item.md` §4, lines 97–105):
   - In `cssVars`, the CLI adds a `@theme inline` line for every key. A colour key gets `--color-<name>`, which makes `bg-stage`, `bg-veil`, `border-rim-line`, `bg-bloom-core` and `text-stage-muted` real utilities in every item. L22 does not list them. L1 does not see them as tints, because they carry no `/NN`. A non-colour key such as `radius-stage` or `blur-veil` gets `--x: var(--x)`, which makes a second `rounded-stage` utility, plus `blur-veil` and `backdrop-blur-veil`.
   - The build writes colour utilities only for `vars.dark`'s keys (`build-tokens.ts:410`). A key only in `cssVars.light`, "the same in both themes", gets a utility in the app but not in the preview, and smoke test 4 fails.
   - In `@theme inline`, a value is not a runtime variable. `--ease-standard` there breaks `readToken` and `010`'s "sampled in JS" curve.
   Fix: put every new value (faces, stage, light, expressive, the mode's `--radius-action`) in `pluto-theme`'s `css[":root"]`, as `--motion-entrance` is today, and none in `cssVars`. Say that no colour utility is generated for `stage` or `light`, and that components reach them through the stage remap or the `-(--token)` form. If utilities are wanted, L22 must list them.

5. **Medium — `type.families.display` cannot be built as a font family** (decisions 1 and 5).
   The build treats every `type.families` entry as an installed font. It imports `f.package` (`build-tokens.ts:437`). It writes `--<variable>` into `@theme inline` (`:405`). It adds a base `@apply` for every family except `--font-heading` (`:363`). It throws when `family.item` has no registry item (`registryWithTokens`). The `Family` type requires `package`, `item` and `import`.
   Failure: a display entry either throws, or adds `html { @apply font-sans font-display }`, which sets every productive page's body in the heading face.
   Fix: do not make display a `Family`. Hold it as a role, for instance `type.display: { "family": "heading" }`. The build emits `--font-face-display` from it, and the three font loops skip it. The note in finding 9 on what "defaults to the heading face" means applies here too.

6. **Medium — `contrast.ts` cannot hold the stage pairs as written** (decisions 3 and 4; criterion 4).
   `contrastTable` resolves every name through `resolveColor(tokens, theme, name)`. That reads only `themes.light` and `themes.dark`, and throws "is not defined" for anything else (`scripts/tokens.ts:385`). The stage roles live in a new group. "`paper` over `veil` on `stage`" composites text over a translucent fill over a ground, and no row kind does that (`tints` take tenths, `scrim` checks edges). An `input` pair would resolve to light's `#7C808B` in the light pass, but on a stage it is dark's `#787C8A`.
   Fix: add a `contrast.stage` table. It resolves stage and light names from their groups, and any other role from the dark theme, since a stage is always `.dark`. Add an `over` row kind, `{ text, fill, ground }`, composited by the alpha byte, for the veil and the bloom (findings 10 and 11). Quote the expected rows and their count in criterion 4.

7. **Medium — L22 fails two existing productive files** (decision 9; criterion 5).
   The lint splits whole files into tokens, comments and prose included (`lint-literals.ts:535`). The word "press" is one of L22's names.
   Failure (EXECUTED with the lint's tokeniser): `src/lib/registry/ui/sidebar/sidebar-trigger.svelte:34` ("after a press;") and `src/lib/registry/ui/composer/composer.svelte:58` ("on a Stop press,") fail. So "zero violations" fails on day one. "rim", "veil" and "bloom" are ordinary words that will collide next.
   Fix: give the utilities names no prose uses, for instance `light-bloom`, `light-rim`, `light-energized`, `surface-veil` and `press-scale`. Or match L22 only inside class strings. List the final names in criterion 5's unit cases.

8. **Medium — `token-names.ts` fails the lint, and lists names that read empty** (decision 10; criterion 5).
   "One name per emitted variable" includes the five `syntax-*` roles, which are emitted on `:root` and `.dark`. `token-names.ts` is an item file.
   Failure (INFERRED from the rules): L19 fires 5 times on `"syntax-orange"` and the others (`lint-literals.ts:218`, `:513`). L21 fires on the named colours orange, purple, teal and cyan inside its quoted strings (`:519`). If `cssVars.theme` keys are included (`text-xs`, `font-weight-bold`, `color-code-*`), `readToken` returns `""` for them. EXECUTED: `--text-xs` read from `:root` is empty. The build's own comment says so of `--ease-entrance` (`build-tokens.ts:97`).
   Fix: `TokenName` is the runtime variables only: `cssVars.light` and `dark` keys and `css[":root"]` custom properties, minus `syntax-*` (007 keeps those for the code slots). The item's `files` lists `token-names.ts` beside `read-token.ts`. Add an e2e case: every `TokenName` reads non-empty on `:root`.

9. **Medium — The sans slot does nothing in a subtree, and display does not follow heading** (decision 2; criterion 11).
   The body face is set once, by `html { @apply font-sans }` (`src/app.css:500`). `font-family` inherits as a computed string. `--font-face-display: var(--font-face-heading)` on `:root` resolves there too.
   Failure (EXECUTED in Chromium): with `--font-face-sans: Gamma; --font-face-heading: Delta` on a wrapper, a paragraph inside reads `Alpha` (the root's face), and a display line reads `Beta` (the root's heading). Only the heading follows. Decision 2's "a subtree that sets [a slot] changes every … line inside it, which is what a product theme … need[s]" holds for heading, mono and display set directly. It does not hold for body text or for display-follows-heading.
   Fix: either say that `--font-face-sans` is a root-only slot, or add a base rule that re-applies `font-family: var(--font-face-sans)` where a theme scope begins (for instance `[data-mode]`). Declare `--font-face-display` again on that scope, as `[data-mode="productive"]` re-declares `--radius-action`. Criterion 11 covers sans and display-follows-heading.

10. **Medium — Veil text fails over a light ground** (decision 4; `010` decision on the bar).
    The spec checks the veil over the stage only, and says paper text "stays readable" over a light section. `010` puts `muted-foreground` link text on the veil and says the veil is darker than that pair needs.
    Failure (EXECUTED): over `paper`, `stage-muted` measures 4.47 and `stage-primary` 4.45. Over white, they measure 4.40 and 4.38.
    Fix: set `veil` to ink at 88% (`#14161CE0`). Then `stage-muted` measures 4.94 over paper and 4.86 over white, and `stage-primary` 4.91 and 4.84. Add the four rows now (finding 6's `over` kind), so `010` inherits a pair that passes.

11. **Medium — The bloom's geometry is unspecified, and text over it is not checked** (decision 4).
    "A `::before` behind the element" fixes neither its extent, nor the positions of the gradient's stops, nor the host's `position` and `isolation`. To paint behind the host's content, the host needs `isolation: isolate` and the pseudo-element needs `z-index: -1` (EXECUTED: compiles). Then the glow paints over the host's own ground.
    Failure (EXECUTED): at full opacity, `stage-muted` over `bloom-core` over `stage-raised` measures 4.25, and `stage-primary` 4.23. Over `stage` they measure 4.79 and 4.77. At rest (opacity 0.6), the pairs pass (5.46 and 5.43). A lit card that carries its own `bloom` fails AA.
    Fix: specify the shape: the host gets `position: relative; isolation: isolate`, the `::before` gets `content: ""`, `inset` from a token, `z-index: -1`, `pointer-events: none`, and stops at stated percentages. Say that `data-lit` sits on the host. Rule that a bloom host has no ground of its own, or add the over-raised rows and change the colours until they pass.

12. **Medium — Criterion 13's "unchanged" contradicts tests that must change** (criteria 6 and 13).
    These assert today's state (READ):
    - `tests/unit/registry.test.ts:321` (63 items) and the `meta` key sets at `:468`, `:510`, `:545`, `:570` and `:601` (exactly `group` and `since`);
    - `tests/unit/previews.test.ts:9` (63 pages);
    - `tests/unit/tokens.test.ts:21` (34 primitives) and `:78` (53 theme entries), if the stage hex values become primitives or roles;
    - `tests/unit/generated.test.ts` (counts of `:root` keys and rules, for instance `:248`, `:282` and `:313`);
    - `tests/smoke/registry-add.test.ts` test 4 (exactly 21 derived lines; `@theme inline` equal to ours) and test 8 (the children of the reduce block);
    - `tests/e2e/pages.ts` `ITEMS` and the toolbar-stop totals in `keyboard.spec.ts` for the new page.
    `deps.test.ts:63` fails today on the exhibit's 7 font packages.
    Fix: add a "Tests that change" list with each test's new expectation. Criterion 13 reads "the item suites of the 63 existing items pass; the listed tests change as stated". Say who settles `deps.test.ts` before the build starts.

13. **Medium — The light, press and display utilities have no criterion that checks behaviour** (criteria 1 and 8 to 11).
    Criterion 1 checks only that they are emitted. Nothing checks that `data-lit` raises the bloom, that `data-busy` draws the ring, the veil's blur, the rim's radius and shadow, the pressed scale, or the clamp of the display steps.
    Fix: one e2e case each. The `::before` opacity is 0.6, then 1 with `data-lit`. `box-shadow` holds the ring with `data-busy`. `backdrop-filter` is `blur(10px)`. `rounded-stage` measures 14 px. `text-display` measures 48 px at 360 px wide and 92 px at 1920. `text-proof` has `font-variant-numeric: tabular-nums`.

14. **Low — Contrast figures are rounded, not truncated** (decision 3, `009:95`; decision 4).
    `contrast.ts` truncates to two decimals (001 decision 12). EXECUTED: paper 18.88 and 17.74; muted 7.72 and 7.25; lifted blue 7.68 and 7.21; ink on lifted blue 6.85; `input` 4.87 and 4.57; paper on veil over stage 17.16.
    Fix: quote the truncated figures.

15. **Low — There is no lifted amber** (decision 3, `stage-mark-1…4`).
    The primitives hold `amber`, and the dark theme uses `amber` for `chart-3` and `caution`. There is no `amber-lifted`.
    Fix: `stage-mark-3` is `amber` (10.39 on `stage`, EXECUTED).

16. **Low — The pill radius is a literal in the build** (decision 7, `9999px`).
    The decision 6 table has no pill radius. "Tokens are the one source" (§4.3).
    Fix: add `expressive.radius.action: 9999` to the table and emit it from there.

17. **Low — The emitted names are not listed** (decision 6, "`--size-bar` …").
    How camelCase keys become names is left to the builder. `010` already assumes `--size-action-small`. The names feed `TokenName` and criterion 1.
    Fix: give the full list of emitted names in decisions 3 to 7.

18. **Low — An app that declines the stylesheet update gets square buttons** (decision 8).
    `add button -o` pulls `pluto-theme` and asks before it rewrites `app.css`. EXECUTED: an undefined `var()` radius computes to `0px`. Separately, `cn` no longer merges an app's `rounded-*` with the base class. EXECUTED: `cn("rounded-action", "rounded-full")` keeps both. The app's class still wins, because `.rounded-action` sorts first.
    Fix: `rounded-action` is `border-radius: var(--radius-action, var(--radius))`. The 0.9.0 changelog says an app's own `rounded-*` on `button` still wins.

19. **Low — Reduced motion: `--motion-slide` is missing from the criterion, and `press` still scales** (decision 6; criterion 9).
    Fix: criterion 9 lists all five durations. Say whether `press`'s scale applies under `reduce`. The catch-all removes only the transition, so the 0.98 jump stays.

20. **Low — `read-token` details** (decision 10).
    The function touches `document`, so a call during server rendering throws. The preview's canvas has no text alternative, and does not say it redraws when the theme changes.
    Fix: guard with `typeof document` and document "call it in the browser". Give the canvas `role="img"` and a label naming the four colours. Redraw it on a class change of `<html>`.

21. **Low — The energized ring is under 3:1** (decision 4).
    EXECUTED: `energized-line` over `stage` measures 2.94. If busy is shown only by the glow, WCAG 1.4.11 applies.
    Fix: say that `energized` always goes with `aria-busy` and a visible text or spinner cue. Or raise the alpha to `0x99` (3.29).

22. **Low — The lint profile has loose edges** (decision 9).
    `data-mode="expressive"` written in a productive item turns its buttons into pills, and nothing catches it. `font-semibold` becomes legal in every item, because the lint's font rule reads `type.weight` (`lint-literals.ts:465`). The spec does not say what `meta.modes` means for items without markup (`pluto-theme`, the fonts, `utils`, `is-mobile`), or which profile binds a file that two items list.
    Fix: L22 also matches the text `data-mode="expressive"`. Keep 600 inside the display steps instead of `type.weight`, or say that productive items may use `font-semibold`. Add one line: `["productive"]` on a non-visual item means only that it uses no expressive name, and a shared file takes the strictest profile.

23. **Low — Rows of the memo's table are not accounted for** (Intent, "Not here").
    The product-site memo lists a meter fill "from Charon to lifted Charon", a lit `code-block` for the stage, and paper at 70% as a second muted. None of them is a token here, and none appears in "Not here".
    Fix: one line each, saying whether it is `010`'s, dropped (and why), or waiting on an exhibit question.

24. **Low — The scope is large for one builder** (decision 1).
    The change spans the token schema, the build, the contrast tables, a lint profile, a new library item, a button change, a preview section and six test files.
    Fix: set the checkpoint after the slots, the mode, `button` and L22 (decisions 2 and 7 to 9). Build the stage, light, display and `read-token` after it.

## Constitution checks

- §4.1 source, not a package: kept. `read-token` and the slots are copied source. `token-names.ts` is the app's copy (finding 8).
- §4.2 driven by need: the need is stated (the owner's commission and the product-site memo). "Done" is proven here.
- §4.3 tokens are the one source: kept in intent. The 9999 px pill (finding 16) and any utilities that `cssVars` derive without being chosen (finding 4) need fixing.
- §4.4 accessible by default: four contrast failures (findings 1, 10, 11 and 21). Reduced motion is covered by the global catch-all. Keyboard use is unaffected.
- §4.5 and §4.6: no new package is named. The working tree's 7 exhibit font packages fail `deps.test.ts` today (finding 12).
- §6 never break an installed app silently: the productive screen is unchanged in the preview, but not proven in an app (finding 2). `button` needs a fallback (finding 18). The changelog line is planned.

## Verdict

Does not land yet: findings 1 to 13 stand, chiefly the stage remap's contrast (1), the font slots' delivery through the CLI (2) and `cn` dropping the display steps (3).

## Disposition

_Filled in after the author answers._
