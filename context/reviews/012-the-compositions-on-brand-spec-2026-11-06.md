# Review of 012 — The compositions, on brand

Reviews [`specifications/012-the-compositions-on-brand.md`](../specifications/012-the-compositions-on-brand.md).

- **Date:** 2026-11-06
- **Status:** dispositioned; fit to build (all 18 findings closed after the second pass, 2026-11-07)
- **Reviewer:** a reviewer; not the author
- **Reviewed:** the specification as drafted (129 lines, untracked). Checked against the constitution; `decisions.md`, the two entries of 2026-11-06; `011` as drafted (under its own review; its decisions taken as given unless 012 depends on a gap in them); the light memo, §3, §6.4 and §7 (I5, I9); `009` and `010` and their four review records; and the code in the working tree over `6fbdf99`.
- **Re-ran:** nothing in this repository was written except this file. Scratch files were kept in the session's scratch folder.
  - **Grep for every removed name** (EXECUTED): `surface-stage`, `--stage*`, `stage-mark`, `--bloom-*`, `--rim-*`, `--energized-*`, `--veil`, `radius-stage`, `blur-veil`, and the words `bloom`, `rim`, `energized`, `veil`, `lit`, `data-lit`, over `src`, `scripts`, `tests`, `tokens`, `registry.json` and `static`. 44 files outside `static/` hit. `static/r/styles/maia/`, `static/v0.10.0/r/styles/maia/` (5 files each) and `static/v0.9.0/r/styles/maia/` (1 file) hold them too. The users are listed under finding 6.
  - **WCAG 2.2 contrast** (Python, the 2.2 formula, EXECUTED) on `011`'s values:
    - `--ring` on the fields. Light (`#2D48D4`): `field-1` 1.00, `field-2` 1.25, `field-3` 3.23, `field-4` 1.41. Dark (`#93B0FF`): `field-1` 1.00, `field-2` 1.00, `field-3` 1.03, `field-4` 1.00.
    - A field's foreground on an opaque card inside it. White on white 1.00. White on the light wash (`--muted`, the code ground and the tab strip) 1.26. Graphite on dark `card` (`#221F19`) 1.12. Graphite on dark `muted` (`#2C2821`) 1.26.
    - Dark glass (`#16140FD6`) over paper: muted 4.39, foreground 10.40, primary 5.58. Over white: muted 4.22, foreground 10.00, primary 5.36.
    - Light glass over white: muted 6.60, primary 6.28.
    - Light `--glass-fallback` `#FBFAF6`: foreground 18.36, muted 7.07, primary 6.73.
  - **The hero's geometry** (INFERRED, arithmetic on decision 3 and `010`'s container: `max-w-7xl`, `--gutter-stage`, an assumed `gap-x-6`). At 1440: the glass spans 0 to 671 px of a 1168 px column; the field spans 397 to 1168; the object, padded by 56 px, starts at 453. So 218 px of each card lie under the glass. At 1024: glass 0 to 540, field 322 to 942, object from 363; 176 of its 538 px lie under the glass. Without a gap the overlap is larger.
  - **The code** (READ):
    - `stage.svelte`, `stage-hero.svelte`, `marketing-bar.svelte`, `stage-card.svelte`, `live-console.svelte`, `proof-band.svelte`, `name-strip.svelte`, `cta-band.svelte`.
    - `product-home/+page.svelte`. The cards are stacked full width in a `grid gap-4`.
    - `button.svelte`: `hover:border-foreground`, and the focus rule `outline: var(--focus-width) solid var(--ring)` with a 2 px offset (`src/app.css:659`).
    - `code-block.svelte:14` (`text-foreground`), `code-block-header.svelte:18` (`text-muted-foreground`), `tabs-list.svelte:5,8` (`bg-muted`, `text-muted-foreground`), `tabs-trigger.svelte:21`.
    - `src/app.css:65` (`--code-foreground: var(--foreground)`, set on `:root`, so it is not remapped inside a field).
    - `theme.svelte.ts:44`, `theme-script.svelte:18`, `block-viewer.svelte:37`: the theme is `.dark` on `html`, and the frame copies its parent's class.
    - `pluto-theme/+page.svelte:329`: `class="dark surface-ink"`, a dark subtree on a light page.
    - `registry.json`: the ten items' `meta` and `registryDependencies`.
    - `scripts/contrast.ts:247–300`, `scripts/tokens.ts:44–153, 439–552`, `scripts/lint-literals.ts:79–91`.
    - `pluto-theme/+page.server.ts:5, 41–52`, `read-token/+page.svelte:105–114`, `view/compositions/stage-hero/+page.svelte:9–31`.
    - Tests: `tests/unit/generated.test.ts:505–620` and `registry.test.ts:1432–1455`, `literals.test.ts:299–455`, `contrast.test.ts:574–620`, `tests/e2e/compositions.spec.ts` (all), `expressive.spec.ts` (all), `keyboard.spec.ts:58–64`.

## Acceptance criteria against evidence

1. **No removed name in `src/app.css`, the built JSON or any item file:** not measurable as written. The bare words collide with `011`'s `--glass-rim` and its "rim highlight". "The built JSON" could mean `static/v0.9.0/` and `static/v0.10.0/`, which hold every name (EXECUTED). Finding 6.
2. **`stage` per ground, both themes, background and mode:** measurable, but it needs a test view that holds five stages, and that view changes the views count (finding 7). It never checks the ground's text roles (finding 16).
3. **The hero's overlap, DOM order, no-object form, poster:** each half is measurable with bounding boxes and DOM order. But it passes the very layout that puts the object under the glass, because it never checks that the object stays clear (finding 2).
4. **The bar: blur, radius, inset, sticky, 2.4.11:** measurable. With the lens on, the computed backdrop filter reads `url("#pluto-glass-lens") blur(16px)`, so the test must look for `blur(16px)` inside it.
5. **No box-shadow; busy border is `--primary`, then `--border`:** measurable. On `field-1` the busy border has the field's own colour and cannot be seen (finding 13).
6. **The block's order, its three fields, `data-glass-lens`:** measurable.
7. **axe in both themes; keyboard counts "hold or change only as stated in the landing notes":** the axe half is measurable. axe would flag the white-on-white cards of finding 1. For text on a backdrop filter, axe returns "incomplete", not a pass, so axe is no evidence for the glass (finding 15). The keyboard half is not a criterion (finding 14).
8. **Literal lint: zero violations, zero exceptions:** measurable. A class built from a template, such as `field-${n}`, escapes the lint's tokeniser (finding 9).
9. **`test`, `check`, `lint` pass; expectations change only for removals and counts:** not met as written. At least six tests must change an expected value, not drop a row or a count (finding 7).

## Findings, most severe first

1. **High — Every opaque card and every glass inside a field takes the field's text colour** (`012:55`, `012:76`, `012:82–84`; `011:138–139`).
   `011` decision 5 makes the field utility set `--foreground`, `--muted-foreground`, `--card-foreground` and `--border` to the field's foreground for its whole subtree. Nothing gives the original roles back to an opaque card or a glass inside the field. But `012` puts both there.
   Failure: in `product-home`, the hero's `stage-card`s sit on `field-1` and the `live-console` sits in a `field-4` panel. Each card is `bg-card text-card-foreground`, so its text is white on white (1.00) in light and graphite on `#221F19` (1.12) in dark. Inside them, the code block's header (`code-block-header.svelte:18`, the title "search.py"), the tab strip (`tabs-list.svelte:5`, white on wash, 1.26), the console's heading and the meter numbers all fail the same way. Only the code body keeps its colour, because `--code-foreground` is resolved on `:root` (`src/app.css:65`). Decision 6's "`cta-band` … inside glass on a field" gives white text on light glass in the same way. So does a `stage` with `ground="field-N"` that holds a `stage-hero`, whose glass is then inside the field.
   Fix: before either specification is built, a reset. Either:
   - `011` emits theme-level copies of the four roles (for example `--canvas-foreground`) in `:root` and `.dark`, and the `glass` utility and a new `@utility on-card` set the four roles back from them. Then `stage-card`'s and `live-console`'s roots carry `on-card`, and the field-4 panel's child and the hero's object wrapper are cards; or
   - the field sets only its own `color`, and the text components a field may hold (`proof-band`, `name-strip`, a heading, prose) take a `tone="field"` prop or read `currentColor`.

   Then add a criterion. Inside `product-home`, in both themes, the `stage-card` title, the console's tab text and the console's heading compute to the theme's `--muted-foreground` and `--card-foreground` (not the field's). Text inside the hero's glass computes to the theme's `--foreground`. Decision 3 also states that the glass panel is never a descendant of the field element.

2. **High — At every `lg` width the hero's glass covers a third of the object** (`012:51`, `012:120`).
   Decision 3 centres the object in the whole field ("holds the object, centred, with `p-(--gutter-stage)`"). The glass covers the field's first three of its eight columns. The Risks section says the object is "centred in the field's columns beyond the overlap", and that contradicts decision 3. `product-home`'s object is a full-width stack of two cards.
   Failure: at 1440 the left 218 px of each card lie under the glass. At 1024 it is 176 of 538 px. Those pixels hold the code's line starts and the title "search.py", frosted to unreadable. The pointer cannot select or scroll the covered part of the `pre`. Criterion 3 still passes, since the overlap is over 20%.
   Fix: the object is its own grid item in the same row, at columns 8 to 12 (`lg:col-start-8 lg:col-end-13 lg:row-start-1`). The field is a backdrop item at columns 5 to 12 behind it, and the glass sits at columns 1 to 7. Say what happens to the shell line, `pip install git+https://github.com/ClayGendron/vfs` (52 characters, about 440 px in `text-sm` mono): about 340 px are free at 1024, so it scrolls inside its `pre`. Either accept the scroll in writing or let the field span 4 to 12. Criterion 3 adds: at 1024, 1280 and 1440, the object's box does not intersect the glass's box, and `elementFromPoint` at the centre of every focusable in the object returns that element.

3. **Medium — Decision 4's "dark glass over a light field cannot happen" holds only for fields, not for what the bar floats over** (`012:62`, `012:55`).
   The theme is page-wide (READ: `theme.svelte.ts:44`; the viewer frame copies `html`'s class, `block-viewer.svelte:37`). So, for fields, the claim holds. But the bar is sticky over the whole page, not only over fields.
   Failure: (a) Decision 3 allows "images" as the object. In dark, a light screenshot under the bar puts the muted links (`text-muted-foreground`) on dark glass over white: 4.22. Over paper: 4.39 (EXECUTED). Both fail 4.5. (b) The repository's own pattern for a dark section on a light page is a `.dark` subtree (`surface-ink`, `pluto-theme/+page.svelte:329`). `010` did the same to the bar and the stage, and both still take `class`. Pass `class="dark"` to the bar on a light page and you get dark glass over the light canvas: 4.39.
   Fix: narrow the claim to what is true. "The bar follows the page's theme. It never carries `.dark` itself, and nor does any ancestor but `html`; the item page says so." Then close the image case one of two ways. Either the bar's links take `text-foreground` (10.00 over white even in dark), so no muted text sits on the bar's glass. Or the object is limited to measured grounds (cards and figures in the theme's roles), and an app's image is the app's to measure, as the item page says. Add an e2e: the bar has no `.dark` ancestor other than `html`.

4. **Medium — The sticky bar passes over the hero's glass on every scroll: glass on glass** (`012:60`, `012:51`; `011` decision 7, R25).
   R25 says "glass never on glass". The light memo's source says "Always avoid glass on glass" (§3.2). The hero's panel starts just below the bar, so the first pixels of scroll put the bar's glass over it. The two backdrop filters then stack, and the cost note in Risks counts them as side by side.
   Failure: in `product-home`, the bar's 16 px blur samples the hero's panel at any `scrollY` between about 0 and the panel's height. A reviewer holding R25 as written must reject the block.
   Fix: rule on it in decision 4, and record the ruling in `decisions.md` if the owner's I9 wording needs reading. Either:
   - R25 means nesting: a glass element never has a glass ancestor. The bar passing over content-layer glass is allowed, because its backdrop only grows more opaque, so its text rows still hold. Add one composite row (bar text on glass over glass over `field-1`) to prove it; or
   - the hero's panel is glass only until it reaches the bar's edge.

5. **Medium — Controls can still land directly on a field, where every focus ring vanishes** (`012:43–44`, `012:53`, `012:75`).
   `011` says no control sits directly on a field. But `012` leaves three ways for one to get there. `stage` takes any child on any ground. `stage-hero` without an object puts its words and buttons "on the canvas", which is false when its stage has a field ground. Decision 6 places `marketing-footer`, whose links are controls, "in a field".
   Failure: the focus outline is `--ring` at a 2 px offset (`src/app.css:659`), so it is drawn on the field. In light it measures 1.00 on `field-1`, 1.25 on `field-2` and 1.41 on `field-4`. In dark it measures 1.00 to 1.03 on all four (EXECUTED). WCAG 1.4.11 needs 3:1, and 2.4.7 needs a visible indicator. In light, the hero's primary button on `field-1` also matches its ground.
   Fix: decision 6 treats `marketing-footer` as it treats `cta-band`: on the canvas, or inside glass. Decision 3 adds: without an object on a field-ground stage, the words sit in a glass panel; or `stage-hero` requires a canvas stage. Add an e2e over `product-home` and every composition view, in both themes: for every focusable, the nearest ancestor that is a field, a card or glass is not a field. That makes the rule a check, not only R25.

6. **Medium — Removal users the specification does not name, and criterion 1 cannot be measured** (`012:25–39`, `012:104`).
   The grep (EXECUTED) finds these users outside the composition files that decisions 2 to 8 already name:
   - `static/v0.9.0/` and `static/v0.10.0/`, built and untracked. They are full registries that serve every removed name and the old `stage-hero` with `lit`. The specification neither deletes them nor exempts them from criterion 1.
   - `scripts/contrast.ts:247–300` (`stageHex`, `stageTable`, dark-theme only) and `scripts/tokens.ts:44–153, 439–552` (`StagePair`, the `overTheme` composite, the validation of `stage`, `light`, `radius.stage` and `blur.veil`). Decision 1 says the composite kind "stays", but today it lives only inside `contrast.stage`, resolved by `stageHex`.
   - `src/routes/(site)/items/pluto-theme/+page.server.ts:5, 41–52`, which reads `tokens.expressive.stage` and `stageTable`.
   - `tests/e2e/keyboard.spec.ts:58–64`, whose ring helper reads `.surface-stage`.
   - The identity exhibit. `motion-demo.svelte:246` and `identity/specimens/stage-hero.svelte:187` use `class="bloom"`. Tailwind scans those files, so today they also get the theme's `@utility bloom` and its `::before` (INFERRED). Removing it changes how the owner's research record renders.
   - `011` decision 3, which says `--stage-mark-N` "stays the lifted set". `012` removes it.
   Failure: a grep for `rim` or `-rim` matches `011`'s `--glass-rim`, so criterion 1 fails on a correct build. A grep over `static/**` fails on the snapshots.
   Fix: list these users in decision 1. Define criterion 1's match exactly: the variable prefixes `--stage-` and `--stage:`, plus `--bloom-`, `--rim-`, `--energized-`, `--veil:`, `--radius-stage` and `--blur-veil`; the selectors `.surface-stage` and `.veil`; and the `@utility` names `bloom`, `rim` and `energized`. Class tokens are read through the lint's tokeniser. The scope is `src/app.css`, `registry.json`, `static/r/` and `src/lib/registry/`. Say what happens to `static/v0.9.0/` and `static/v0.10.0/` (see finding 8). Checkpoint 1 also looks at `/identity`'s light board.

7. **Medium — Criterion 9 forbids the expectation changes the build needs, and names none of them** (`012:112`, `012:39`).
   "Expectations change only where this specification removes a variable, a utility, a row or a test, or changes a count." These tests must change an expected value instead:
   - `compositions.spec.ts:652–681`, the bar's links: from `--stage-muted` to `--muted-foreground`.
   - `compositions.spec.ts:143–186` (`010` criterion 5): `data-lit` on the bloom, rewritten.
   - `expressive.spec.ts:294–306` (`009` criterion 12): the dot "inside a stage" reads lifted blue today; inside a `.dark` subtree it reads paper (decision 8).
   - `generated.test.ts:505–620` (`009` criterion 1): the 47-name list and its values.
   - `literals.test.ts:299–455` (`009` criterion 5): the class-object sample `{ bloom: lit, rim: true, veil: open, energized: busy, … }`, the `hover:bloom` and `!veil` cases, and the app-folder case `<div class="bloom">`. Each is a L22 case that now passes, so each must move to a token L22 still holds.
   - `registry.test.ts:227–230`: the dependency table (finding 10).
   - The views list, `pages.ts`, the 320 px reflow test's count of 22, and the axe and keyboard page lists, once criterion 2 and the poster need views.

   Decision 1 also retires `009`'s criteria 8 and 11 and stage rows of 4. But `009`'s criteria 1, 5 and 12 change too.
   Fix: criterion 9 lists each of these with its new expectation, as `010` criterion 3 and `011` criterion 13 do, and decision 1's retired list adds `009` criteria 1, 5 and 12 (in part).

8. **Medium — "Nothing released depends on them" rests on a release question the owner has not answered** (`012:13`, `012:27`, `012:100`).
   `handoff.md` lists "Commit and release of `009` and `010` as 0.10.0" as waiting on the owner. `CHANGELOG.md` already carries dated 0.9.0 and 0.10.0 entries. The ten items carry `meta.since: "0.10.0"`, and `read-token` carries `"0.9.0"`. The static snapshots for both versions are built.
   Failure: if the owner tags `v0.10.0` before `012` lands, the removal of `surface-stage`, `bloom`, `rim`, `energized`, `veil`, `--stage-*` and `stage-hero`'s `lit` breaks an installed app silently (constitution §6). If the owner never tags it, the changelog's 0.9.0 and 0.10.0 entries and every `meta.since` name versions that never existed.
   Fix: ask the owner, record the answer in `decisions.md`, and write it into decision 1 and decision 9. Options:
   1. (recommended) 0.9.0 and 0.10.0 are never tagged. Their entries fold into 0.11.0. `meta.since` becomes `"0.11.0"` for the eleven items. `static/v0.9.0/` and `static/v0.10.0/` are deleted.
   2. 0.10.0 is tagged first. The 0.11.0 entry then marks each removal and `lit` as an **interface change**, and `static/v0.10.0/` is frozen by `registry.test.ts:1432`.

9. **Medium — A numeric `field` prop invites a class that Tailwind never emits in an installed app** (`012:50`, `012:82`).
   `stage-hero` takes `field: 1 | 2 | 3 | 4`, and `product-home` passes `field={1}`. The natural build is `` `field-${field}` ``. Tailwind emits an `@utility` only for a class it finds written out in the app's sources (INFERRED from its on-demand generation; `011` makes each field an `@utility`). `stage`'s `ground="field-3"` is safe, because the app's own file holds the token.
   Failure: in an installed app the hero's field has no colour and no roles. The preview hides this, because the `pluto-theme` page writes `field-1` literally (`011` decision 12). The smoke test builds the app but never looks at it. A template class also escapes L22's tokeniser.
   Fix: decision 3 says the class comes from a literal map, `{ 1: "field-1", 2: "field-2", 3: "field-3", 4: "field-4" }` (as `proof-band`'s `COLUMNS` does). Or the prop takes the strings, as `stage`'s does. `compositions-add.test.ts` greps the installed app's built CSS for `.field-1`.

10. **Medium — `liquid-glass` is imported but not declared** (`012:60`, `012:51`, `012:88`).
    `stage-hero` and `marketing-bar` carry `pointerLight`, and `product-home` renders `GlassLens`. All three come from `011`'s `liquid-glass` item. No decision adds it to their `registryDependencies`.
    Failure: `010`'s import test fails. Worse, if the test is loosened, an app that adds `stage-hero` gets an unresolved import and does not build (the README's High case).
    Fix: decision 2, 3 or 7 says that `stage-hero`, `marketing-bar` and `product-home` gain `liquid-glass`. `registry.test.ts:227–230` and `compositions-add.test.ts`'s item list follow.

11. **Low — The glass panel's padding, row and stacking order are unwritten** (`012:51–52`).
    The focus ring needs 4 px inside the panel's edge (2 px offset plus 2 px width). Overlap in a grid needs both items in one row. Below `lg` the field follows the panel and would paint over it unless the panel is positioned. It is, through `glass`'s `position: relative`, but only while the field is not positioned.
    Fix: the panel is `p-(--gutter-stage)`, both items are `lg:row-start-1`, and the field carries no position.

12. **Low — The bar's glass is up to 1808 px wide, and the Risks section says that fits the memo's cost note** (`012:60`, `012:121`).
    Inset only by the gutter, the panel spans the viewport: 1328 px at 1440, 1808 px at 1920. The memo cites a library's warning above 800 px (§3.5, READ there). With the lens on, Chromium runs a `feDisplacementMap` over it on every scroll frame. The bar's `border-b border-border` is not mentioned either; under a floating panel it would draw a full-width line.
    Fix: the panel sits inside `mx-auto max-w-7xl`, as the bar's content does today. Checkpoint 1 records scroll frame times in Chromium with the lens on. Decision 4 drops the border.

13. **Low — On `field-1` the busy border is invisible** (`012:68`).
    `data-busy:border-primary` is `#2D48D4` on `#2D48D4` in light and `#93B0FF` on `#93B0FF` in dark. "A run answers with a border change", but the change cannot be seen on the block's own hero. Busy is still told by the button's spinner and `aria-busy`, so this is not a WCAG failure.
    Fix: draw the busy edge inside the card, for example an inset outline in `--primary` over the card's own ground. Or state that the border change is shown against the card, and check it at the checkpoint.

14. **Low — Criterion 7's keyboard half is not a criterion** (`012:110`).
    "Hold or change only as stated in the landing notes" accepts any count. Nothing in decisions 2 to 7 adds or removes a focusable: `pointerLight` and `GlassLens` add none, if the lens's `svg` is `aria-hidden` and not focusable.
    Fix: "`PRODUCT_HOME_STOPS_WIDE` and `PRODUCT_HOME_STOPS_NARROW` hold exactly, and the `GlassLens` SVG is `aria-hidden` and has no tab stop."

15. **Low — Rows the compositions lean on that no measured row covers** (`012:61`, `012:110`; `011` decision 10).
    - Under reduced transparency, forced colours or no backdrop filter, the light glass becomes `#FBFAF6`. Its text passes (18.36, 7.07, 6.73, EXECUTED), but it is not a row.
    - The focus ring on glass is covered only because `--ring` and `--primary` happen to be the same colour in both themes (READ, `tokens/pluto.tokens.json:57, 112`).
    - axe returns "incomplete" for text over a backdrop filter, so criterion 7 is no evidence for the glass.

    Fix: add `foreground`, `muted-foreground` and `primary` on `--glass-fallback` (light) and non-text rows for `ring` on glass over each ground (3:1), in `011`'s glass set or here. Say in criterion 7 that the glass is proved by those rows, not by axe.

16. **Low — Criterion 2 checks the ground, not the roles on it** (`012:105`).
    `011` criterion 11 checks the roles on `field-1` only. `proof-band`'s labels sit on `field-3`.
    Fix: criterion 2 adds that inside each field ground `text-muted-foreground` computes to `--field-N-foreground`, and inside the canvas ground to `--muted-foreground`.

17. **Low — `overflow-x-clip` hides an overflowing poster from the reflow test** (`012:44`, `012:50`).
    `type-poster` is at least 56 px. At 320 px the panel's content box is about 240 px. A 14-letter word at 56 px is about 430 px, and the stage clips it with no horizontal scroll, so the 320 px test passes while the word is cut.
    Fix: the poster's view uses the sample title, and criterion 3 adds that at 320 px the title's `scrollWidth` does not exceed its `clientWidth`.

18. **Low — The bar's mark turns paper-white in dark** (`012:45`, `012:100`).
    The bar no longer sets the stage's roles, so in dark `--mark-N` is paper (`008`), not the lifted four that `010` showed. That is a visible change from `010`, and the changelog note does not mention it. `010`'s landing notes left exactly this question to the identity.
    Fix: decision 9's changelog line says so, or decision 4 sets the lifted marks inside the bar, with the owner's ruling recorded.

## Rules held, as written

- **Glass only on expressive pages:** held. `stage-hero`, `marketing-bar` and `product-home` are `["expressive"]` (READ, `registry.json`), and L22 gains `glass` (`011`).
- **Glass text only foreground, muted and primary:** held for the bar and the hero. The eyebrow, title, description and links take those roles. The buttons are opaque fills with their own measured pairs, and the skip link is `focus:bg-card` (READ). Broken inside a field (finding 1).
- **Glass never on glass:** not held while the bar scrolls (finding 4).
- **No control directly on a field:** held in the block, not across the items (finding 5).
- **Dark glass never over a light field:** held for fields under a page-wide theme; not for the bar over images or a `.dark` subtree (finding 3).
- **H1, one 8 px radius:** held. `rounded-lg` is `--radius` (`src/app.css:233`), the glass is `--radius` and buttons are 8 px (`011` decision 4a). The full-bleed `field-3` stage has no visible corner.
- **C2:** held. Blue, amber and green each own one field. The four together appear only in the mark.
- **J2:** held (INFERRED). The specular light follows the pointer. The busy border, the meters and the count-up answer a press or a scroll. The only spring is the dots' (`011`).
- **Reading and focus order:** the words come before the object in the DOM at every width, which matches the visual order at `lg` (words left) and below it (panel first). Overlap breaks this only in finding 2.

## Constitution checks

- **§4.1 source, not a package:** held. `GlassLens` is a local SVG, and nothing reaches back.
- **§4.2 driven by need:** held. The need is the owner's 2026-11-06 choice.
- **§4.3 tokens are the one source:** held on paper. Every size is a token or a variable (`py-2`, `-mt-(--gutter-stage)`, `lg:col-start-5`). Finding 9 is about emission, not literals.
- **§4.4 accessible by default:** not met as written: findings 1, 2, 3 and 5.
- **§4.5 and §4.6 pinned, named dependencies:** no new package. The registry dependency on `liquid-glass` is missing (finding 10).
- **§6 never copy prior art:** held. The glass is the memo's own recipe. No competitor's mark or layout appears.
- **§6 never break an installed app silently:** it rests on finding 8.

## Verdict

Does not land yet: not fit to build. Findings 1 and 2 are High: the field's role remap turns the block's own cards white on white, and the hero's glass covers a third of its object at every desktop width. Findings 3 to 10 are Medium. Finding 8 needs the owner. Finding 1 needs a line in `011` before either is built.

## Disposition

Checked against the specification as revised on 2026-11-07, against `011` as revised (decision 6: the `--surface-*` copies and `surface-plain`; a field's `--primary` and `--ring` set to its legend; the specular masked to the rim; decision 11's rows), and against `decisions.md`, "One release, 0.11.0, and the calls of the `011` and `012` spec reviews" (2026-11-07). These checks were re-run:
- the lint's L3 and L5 rules (READ, `scripts/lint-literals.ts:397–408`);
- `marketing-footer.svelte:67` (READ);
- `tests/unit/tokens.test.ts:274–300` and `tests/unit/generated.test.ts:713–800` (READ);
- the glass-over-glass composites (EXECUTED, the WCAG 2.2 formula, alpha by the byte). Lowest values: light, `foreground` 16.34 and `primary` 5.99; dark, 15.53 and 8.33. Over the canvas: light 16.84 and 6.17; dark 16.16 and 8.67.
- the hero's columns at 1024, 1280 and 1440 (INFERRED, arithmetic).

1. **Closed.** A field now sets its roles, and `surface-plain` restores them from the theme's copies. `glass` includes it, and `stage-card` and `live-console` carry it (decision 5). `011` criterion 11 checks a card and a glass inside a field, and axe (criterion 8) would flag any card that misses it. The code ground and code slots resolve on `:root`, so they are unaffected.
2. **Closed (second pass, 2026-11-07).** Decision 3 now sets the column gap to `--gutter-stage` and makes the field a subgrid of its eight columns. The object takes the hero's columns 8 to 12, so it is clear of the glass by one gap, 16 to 56 px, at every width. A positive gap means the 1 px rim cannot reach the object, and criterion 3's "does not intersect" is strict. The shell line's scroll is accepted and recorded.
   - One figure to correct, which changes no decision or criterion. Decision 3's widths (337, 425 and 417 px) came from the first pass's `gap-x-6` with the end padding. With the gutter as the gap and only `py-(--gutter-stage)`, the object is about 369, 461 and 454 px wide at 1024, 1280 and 1440 (INFERRED). That is still below the line's 485 px, so the recorded scroll holds.
   - The object now meets the field's end edge with no inline inset. That is for checkpoint 1 to judge, not a finding.
3. **Closed.** The bar's text is `foreground` and `primary` only. Over white under dark glass that is 10.00 and 5.36 (EXECUTED in the review). Neither the bar nor `stage` carries `.dark`, and criterion 4 checks it.
4. **Closed.** The 2026-11-07 ruling says R25 forbids nesting, not passing. `glassOverGlass` covers `foreground` and `primary` over the hero's tint over each field, both themes, and all pass: lowest light 5.99, dark 8.33 (EXECUTED). The hero's glass also lies over the canvas. That case passes (6.17 and 8.67) but is not a listed row. Adding it, and stating the row count, would make the rows countable. This is a write-in, not a standing finding.
5. **Closed.** `cta-band` and `marketing-footer` go on the canvas, and an object-less hero goes only in a canvas stage. The ground check (criterion 6) is an ancestry test over every focusable, in both themes, at two widths. With `--ring` set to the legend inside a field (`011`), a ring that does land on a field measures 4.96 or more.
6. **Closed.** Decision 1 lists every user the grep found. Criterion 1 names exact prefixes, selectors and class tokens, and a scope that leaves out `011`'s `--glass-rim` and the identity exhibit. The snapshots are deleted. The exhibit keeps its look through a local class. Checkpoint 1 looks at `/identity/light/`.
7. **Closed (second pass).** Criterion 10 now lists `tokens.test.ts` (the `stage`, `light`, `radius.stage` and `blur.veil` keys and the twelve-entry test) and `generated.test.ts`'s "009's rules and utilities", with `busy-edge` added.
8. **Closed** by the owner's ruling: one release, 0.11.0. `meta.since` is `"0.11.0"`, and the snapshots are deleted (decision 9; `011` criterion 14).
9. **Closed.** String props and literal maps (decisions 2 and 3), and criterion 9's smoke check for `.field-1` in the installed app's CSS.
10. **Closed.** `stage-hero`, `marketing-bar` and `product-home` declare `liquid-glass` (decisions 3, 4 and 7), and criterion 9 checks it.
11. **Closed.** The panel's padding, the shared row and the stacking order are written in decision 3.
12. **Closed.** The bar's panel sits inside `max-w-7xl`, so at most 1168 px of it is blurred. It loses its border, criterion 4 checks the width, and checkpoint 1 records the frame time.
13. **Closed (second pass).** Decision 5 now draws the busy state with a theme `@utility busy-edge`: an inset `box-shadow` of `calc(2 * var(--line-width))` in `--primary` on `&[data-busy]`, with its transition on `--motion-busy`.
    - It is no `ring-*` or `shadow-*` class, so L3 and L5 do not read it (READ, `lint-literals.ts:397–408`). Both items that carry it are expressive-only, so its place on L22's list allows it.
    - Inside a field, `surface-plain` restores `--primary`, so the edge is the theme's blue on the card's own ground.
    - Criteria 5 and 9 can now both be met. Criterion 5 also adds L22's productive case.
14. **Closed.** Criterion 8 pins `PRODUCT_HOME_STOPS_WIDE` and `PRODUCT_HOME_STOPS_NARROW` exactly, and criterion 7 checks that the lens's SVG is hidden and has no tab stop.
15. **Closed.** `011` decision 11 adds the fallback rows and the ring-on-glass rows. Criterion 8 says what evidences glass text.
16. **Closed.** Criterion 2 checks `text-muted-foreground` on each ground.
17. **Closed.** The poster takes `break-words hyphens-auto`, and criterion 3 checks its `scrollWidth` at 320 px.
18. **Closed (second pass).** Decision 6 gives `marketing-footer`'s root `data-mode="expressive"`, which L22 allows in an expressive-only item. Criterion 4 checks that both the bar's and the footer's dots compute to the lifted four in dark.


Verdict as it stands after the second pass (2026-11-07): fit to build. Every finding is closed. The one remaining note, finding 2's object widths, is a figure to correct in decision 3 and changes no decision or criterion.
