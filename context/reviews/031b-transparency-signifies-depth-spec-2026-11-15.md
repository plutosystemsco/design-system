# Review of 031b — Transparency signifies depth

Reviews [`specifications/031b-transparency-signifies-depth.md`](../specifications/031b-transparency-signifies-depth.md).

- **Date:** 2026-11-15
- **Status:** in review; does not land yet (approve with changes)
- **Reviewer:** a reviewer; not the author
- **Reviewed:** the specification as it stands on disk after the author's two edits (507 lines, read fresh before this was written), and its memo, `research/2026-11-15-transparency-audit.md` (123 lines). Checked against:
  - the constitution (§4.1, §4.3, §4.4, §5, §6), `AGENTS.md`, `reviews/README.md`, `roadmap.md` (row `031b`, the waves);
  - `019a` decision 3, criterion 5 and its landing notes; `028` decisions 2 and 9, its test 8 and its fixes table; `029` decisions 6, 9 and 10; `031` decisions 6, 12, T3 and T4; `031a` decisions 1, 3, 5 and 7; `020a` as it stands; `026` decisions 8 and 13 and test 66; `027` decision 13;
  - the tree at `44cec73`: `src/app.css`, `scripts/build-tokens.ts:79–91, 505–526`, `scripts/lint-literals.ts:173, 427–445`, `tokens/kuiper.tokens.json`, `button.svelte`, `toggle.svelte`, `tooltip-content.svelte`, `kbd.svelte`, `chart-tooltip.svelte`, `marketing-bar.svelte`, `node_modules/shadcn-svelte/dist/tailwind.css`;
  - prior art, studied, not copied: Primer (`primer-primitives` at `4773648`) `src/tokens/functional/color/{fgColor,bgColor,borderColor}.json5`, `src/tokens/component/button.json5:266–284, 572–576`, `src/tokens/base/color/light/light.json5:80–84, 158–162`; Carbon (`carbon` at `fa75d78`) `packages/themes/tokens/themes/white/theme.tokens.json:766, 859, 871`, `white/button.tokens.json:83–86`, `g100/button.tokens.json:83–89`;
  - WCAG 2.2, SC 1.4.3 (the "inactive user interface component" exception) and SC 1.4.11 (the "inactive components" exception) (RECALLED, the normative text).
- **Re-ran:** nothing in the repository was written but this file. No repository build, no git write. My probes are in the session scratchpad, `031b-review/`. Playwright 1.64 (Chromium, Firefox, WebKit), the pinned `@tailwindcss/node`, and the main tree's `build/` (16:10) served on port 4523, stopped after.
  - **The pre-020 build** (`git diff dad6f76 HEAD`, EXECUTED). The token file was renamed with 0 changed lines. No class, slot, role or alpha value an item or page draws changed. Only names did: `/components/pluto-theme/` is now `/components/kuiper-theme/`, and the keyframes are `kuiper-*`. **The audit's runtime half holds for today's tree.** Build-order step 1's re-probe covers what lands after.
  - **The hairline, by edge context** (`lines.py`, EXECUTED, sRGB compositing at the real `0x1A` alpha). A border paints over its element's own background (`background-clip: border-box`; nothing in `src/` changes it, grep). So a filled element's 10% edge composites over the element, not the ground. Today against the proposal:

    | Edge | Today, against outside / inside | `#DCDAD3` or `#37342E`, against outside / inside |
    |---|---|---|
    | light divider on paper | 1.24 | 1.23 |
    | light white card, code block, inline `code` on paper | 1.09 / 1.24 | 1.23 / 1.40 |
    | light divider on `muted` | 1.24 | 1.11 |
    | light divider on `sunken` (`031a`, `#DCD7CA`) | 1.23 | **1.03** |
    | light divider inside glass over a blue, red or green field | 1.23 | **1.01 – 1.02** |
    | light `groove` on a field (not reset by `field-N`) | 1.13 – 1.21 | **3.55 – 5.02** |
    | dark divider on graphite (most site rules) | 1.29 | 1.48 |
    | dark card on graphite | 1.48 / 1.32 | 1.48 / 1.32 (identical) |
    | dark code block, inline `code`, muted box (`ink-wash` fill) | 1.68 / 1.34 | 1.48 / 1.18 |
    | dark divider inside glass over a field | 1.34 – 1.35 | **1.00 – 1.12** |
    | dark `groove` on a field | 1.02 – 1.07 | **5.82 – 8.90** |

  - **Filled or not** (`filled.mjs`, EXECUTED, 9 pages, light, 1440): of 2,020 drawn hairline instances, **1,416 sit on an element with an opaque fill of its own** (`code-block`, inline `code`, `section[frame]`, `card`, `caption.bg-card`, `marketing-footer`, the swatches). 604 sit on an unfilled element (grooves, rules, prev and next, separators, outline badges).
  - **Disabled** (`disabled.py`, EXECUTED). Light: `#7F8080` reads 3.48 on paper, 3.96 on white, 3.15 on wash; `#BCB7AC` 1.75, 2.00, 1.59; the `disabled` fill (wash) **1.10 on paper, 1.26 on white**. Dark: `#8B8881` 5.20, 4.64, 4.14; the fill 1.26 on graphite. Today's disabled primary: fill 2.31 on paper, label 1.69 on its fill. The spec's figures hold (3.14 truncated). References: Primer `fgColor.disabled` (`#818B98`) on `bgColor.disabled` (`#EFF2F5`) 3.07, on white 3.45; `bgColor.disabled` on white 1.12; **Primer's disabled primary button fill `#95D8A6` 1.66 on white, label white at 0.8 alpha**; Carbon `text-disabled` (gray 100 at 0.25) 1.73 on white; `button-disabled` (gray 30) 1.71 on white, `text-on-color-disabled` 1.94 on it.
  - **The variant order** (`order.mjs`, EXECUTED, Tailwind 4.3.3): `group-has-disabled/field:` < `hover:` < `focus-visible:` < `disabled:` < `aria-disabled:` < `aria-invalid:` < `data-checked:` < `data-[state=on]:` < `forced-colors:…`. So `disabled:` beats `hover:` at equal specificity, and a bare `disabled:` fill loses to `data-checked:`; the spec's stacked forms are needed, and it uses them.
  - **The forced-colours cascade** (`forced.mjs`, `forced2.mjs`, EXECUTED, Chromium and Firefox, `forcedColors: "active"`). A pressed, disabled toggle with `028`'s classes alone: background `rgba(5, 0, 73, 0.8)` (`Highlight`), text white (`HighlightText`). With this spec's `disabled:data-[state=on]:bg-disabled-foreground` and `…:text-background` added: background `rgb(255, 255, 255)` (forced `Canvas`), text `GrayText`. A checked, disabled checkbox the same: its forced `Highlight` fill becomes `Canvas` (finding 1).
  - **Overlay roots** (`layers.mjs`, EXECUTED, Chromium). For `popover`, `dropdown-menu` and `tooltip`, the painted element carrying `data-slot` is `position: static` inside bits-ui's transparent `[data-bits-floating-content-wrapper]` (absolute or fixed). `dialog-content` is `relative` inside a transparent, fixed `dialog-positioner`. So an attribute written beside `data-slot` lands on the painted root, and "nearest `[data-layer]` at or above" finds it whether or not the content is portalled. `chart-tooltip`'s root is a plain `div` of the item's own (READ). The glass `::after` opacity the audit read as 0.918 on hover settles to 0 after 1.5 s: motion, as classified.
  - **`::placeholder`** (`ph.mjs`, EXECUTED): `getComputedStyle(el, "::placeholder").color` returns the placeholder's own colour, with its alpha, in all three engines. Test 12 can run everywhere, as decision 17 says.
  - **The leaked rules** (EXECUTED, grep over the built CSS's alpha-modifier selectors). Every leaked translucent class is in `context/`; **none is found only in `tests/`**. `bg-popover/70` is in three `context/` files and not in `tests/` (the memo's §2.4 says `tests/unit/literals.test.ts`; that file has none, at `dad6f76` or now). Also in the build: `.shimmer`, from `shadcn-svelte/tailwind.css` (imported at `src/app.css:6`), emitted because the word "shimmer" is in site prose (`src/routes/(site)/components/skeleton/+page.svelte:22`, `marker/+page.svelte:22, 33`). Its `--_highlight` is `oklch(from currentColor l c h / calc(alpha * .2))`.

## Acceptance criteria against evidence

The specification is not built. Each criterion is judged as writable and checkable.

1. The tokens — checkable. The composites hold (EXECUTED). The floor misses `sunken` (finding 2).
2. The theme's CSS — checkable. READ.
3. The lint — checkable; D1 needs a colour test that spares `text-sm/6` (finding 11). READ.
4. No half opacity — checkable. READ.
5. The layers declared — checkable; the 12 roots exist where the spec says (EXECUTED, four sampled). Nothing checks that a declared root is above anything (finding 6).
6. Every page — checkable. READ.
7. Every item, driven — checkable. READ.
8. The probes and placeholders — checkable in every engine (EXECUTED).
9. The built CSS — checkable; its exception list misses `.shimmer` (finding 8).
10. Tailwind's sources — **not checkable as written**: it describes a `020a` that is not the `020a` on disk (finding 7).
11. Disabled colours — checkable. READ.
12. Forced colours still hold — **not met as designed**: the new stacked classes outrank `028`'s twins (finding 1). EXECUTED.
13. The bar — checkable. READ.
14. The changelog and the guide — checkable. READ.
15. The pictures — checkable; on `031a`'s ground the light dividers vanish (finding 2). EXECUTED.
16. Weight — checkable. INFERRED figures, measured at landing.
17. The suites — checkable. READ.
18. The checkpoint — review; its list misses the most common changed edges (finding 3).
19. The scorecard — checkable; row 4 held is right (no row-4 criterion reads hairlines or disabled roles). READ.

## Findings, most severe first

1. **High. Decision 10's cascade claim is wrong for the stacked classes this spec adds** (`031b…md:204`, `:332`, `:344`, `:346`). "Under forced colours they [the `GrayText` twins] still win over the new `disabled-*` classes, because they are stacked on the same variant." They are not on the same variant. `disabled:data-checked:bg-disabled`, `disabled:data-[state=on]:bg-disabled-foreground`, `data-disabled:data-checked:bg-disabled-foreground` and their text classes are (0,3,0). `028`'s twins are (0,2,0): `forced-colors:data-checked:bg-[Highlight]`, `forced-colors:data-[state=on]:bg-[Highlight]`, `forced-colors:disabled:text-[GrayText]`.
   Failure: under forced colours a pressed, disabled toggle paints `Canvas` with `GrayText` where `028` alone paints `Highlight`; pressed and unpressed disabled toggles look the same. A checked, disabled checkbox loses its `Highlight` fill. EXECUTED in Chromium and Firefox (Re-ran). `028`'s test 8, first rule ("every non-forced class in the same string that sets that property under a state variant has a forced twin on the same variant"), fails on every new stacked class. Text colour survives only because the engines force a disabled native button's text to `GrayText`; an `aria-disabled` element would not get that.
   Fix: apply `028` decision 2's rule to the new classes. Each stacked disabled class gets its forced twin on the same stack, from `028`'s list of system colours: for example `forced-colors:disabled:data-[state=on]:bg-[GrayText] forced-colors:disabled:data-[state=on]:text-[Canvas]`, `forced-colors:disabled:data-checked:bg-[GrayText] forced-colors:disabled:data-checked:text-[Canvas]` (and the indeterminate and `group-has-disabled/field:` forms), and `forced-colors:data-disabled:data-checked:bg-[GrayText]` on the switch's track. Write them into the per-item table. Correct decision 10's sentence. Say that test 16 replaces only test 8's second rule and that the first rule still runs over the new classes. Add a disabled-and-pressed toggle and a disabled-and-checked checkbox to `028`'s cases for E and G. In passing, `028` alone shows `HighlightText`, not `GrayText`, on a pressed disabled toggle, because its `data-[state=on]` twin sorts after `disabled:`. These twins fix that too; tell `028`'s builder.

2. **High. The solid light hairline vanishes on `031a`'s `sunken`, the ground of every index picture** (`:159–163`, `:212`, test 3 at `:401`). `#DCDAD3` on `#DCD7CA` reads 1.03:1. Today's 10% line on it reads 1.23 (EXECUTED). `031a` decision 7 paints `html`, `body` and every `frame-stage` `sunken` while it photographs. So every unfilled divider in a light thumbnail disappears: separators, table rows, grooves, item separators, accordion items. A card's edge on `sunken` reads 1.03 too, though the white fill still carries the card. Decision 11 says the two specs "touch different lines … Either lands first". That is true of the files. It is not true of the pixels: either order ships this. Test 3's floor ("A later value cannot let it vanish") reads `background`, `card` and `muted` only, so it passes.
   Fix: add `sunken` to test 3's floor and to decision 11. Then choose, and ask the owner if needed. (a) A rule wherever `sunken` is painted (the index stage and the thumbnail capture; for apps, a `surface-sunken` utility beside `bg-sunken`) redeclares `--border`, `--groove-line` and `--sidebar-border` to `ink` at 0.1 over `paper-sunken`, `#C7C3B8` (1.23), with a composite record. (b) Or a darker light `line`, re-measured on all four grounds. Record the choice in both specs.

3. **Medium. The look-equivalence argument models the hairline over its ground, but most hairlines paint over their own fill** (`:151`, `:159`, Risks `:472`; *the audit* §3.1). 1,416 of 2,020 drawn instances sampled sit on an opaque fill of their own (EXECUTED). For those the change is not the one the spec states:
   - Light white fills (cards, frames, code blocks, and inline `code` on every page): against the page 1.09 → 1.23, against the fill 1.24 → 1.40.
   - Dark `ink-wash` fills (code blocks, inline `code`, muted boxes): 1.68 → 1.48 and 1.34 → 1.18.
   - Dark dividers on graphite, the most common rule on the site, rise 1.29 → 1.48. That is +0.19, outside the spec's "within 0.17". The memo's own table gives +0.20.

   It also bears on the owner's words. An edge over its own opaque fill shows the element, not "the color behind it". Testing computed alpha is a stricter, simpler proxy. That is a sound choice, but the spec should say it is a choice.
   Fix: replace decision 7's "why" with the by-context table above, or the builder's own. Correct "0.17". Rewrite the risk to name the two largest changes: light inline `code` and code blocks get darker, and dark page rules get stronger. Add inline `code`, a code block in light and the footer groove in dark to criterion 18. In decision 4, say that a filled element's translucent border counts by design, because the rule reads computed colour.

4. **Medium. Q2's references are misread, and the disabled filled control nearly loses its shape** (`:180–189`, `:331`; *the audit* §4).
   - Primer's disabled primary button keeps its hue: `button.primary.bgColor.disabled` is `#95D8A6` (`button.json5:572–576`), and its label is white at alpha 0.8 (`:266–284`). That is option 3's pattern, with a translucent label. It is not "neutral … all solid".
   - Carbon's `button-disabled` is in `white/button.tokens.json:83`, not `theme.tokens.json`. It is solid gray 30 in white but gray 50 at alpha 0.3 in g100 (`g100/button.tokens.json:83–89`).
   - Both keep a filled button's fill visible, about 1.7:1 on white. Kuiper's `disabled` is wash: 1.10 on paper, 1.26 on a card.
   - Wash is also `accent`, the fill of a hovered or `aria-expanded` ghost button (`button.svelte:18`).
   - With `disabled:border-disabled` (the same wash), a disabled primary has no edge, while a disabled secondary keeps `border-disabled-edge`. The primary becomes the fainter of the two.

   The 3:1 text floor is sound. It matches Primer's pair (3.07) and exceeds Carbon (1.73). It is a self-imposed floor, not conformance: WCAG exempts inactive components from SC 1.4.3 and from SC 1.4.11 alike. The spec cites only 1.4.3.
   Fix: give the filled variants `disabled:border-disabled-edge`, not `border-disabled`, so every disabled button shares one edge (`#BCB7AC`: 1.75 on paper, 2.00 on white). Or give `disabled` its own composite, distinct from `accent` and at least 1.3:1 on `background` and `card`. Correct decision 9's "Why neutral roles" and the memo's §4. In Q2, present option 3 with Primer as its precedent. Cite 1.4.11 beside 1.4.3.

5. **Medium. The disabled pairs' place under `031` is not stated** (`:209–211`). `031` T3 holds every text row of `kuiper.contrast.json` to 7:1 under `more`, with no exceptions. Its T4 counts the computed set (31 today). Test 3 here puts the disabled floors in `contrast.test.ts`. It does not say whether `[disabled-foreground, disabled]` and its siblings join the contrast file.
   Failure: if they join, `031` must lift disabled text to 7:1, close to enabled text. If they do not, `031` has no target for the three roles, and "must give the three new roles … high-contrast pairs" means nothing checkable.
   Fix: decision 11 says the disabled pairs stay out of the contrast file's text rows (disabled is exempt). It names their high-contrast target, recommended 4.5:1 for `disabled-foreground` on `disabled`, `card` and `background`, and 3:1 for `disabled-edge`. It names the rows `031` adds. `031`'s landing notes then carry the count change.

6. **Medium. `data-layer` exempts anything it is written on, and the spec writes it on two things that are not layers** (`:71`, `:89`, `:225`, `:241`, `:267`). Decision 1 defines a layer as "painted above other content that is not its own". Nothing tests that. D4 and the runtime test accept any element carrying the attribute. Decision 13 then puts `data-layer="scrim"` and `"surface"` on two in-flow specimens on the page. A translucent scrim swatch on the page is what the owner's rule forbids. The attribute licenses it.
   Fix: make the definition testable. Add a case to test 11: every `[data-layer]` root on every page is out of flow (`fixed`, `absolute` or `sticky`) or sits in an out-of-flow, unpainted wrapper. bits-ui's floating wrapper and `dialog-positioner` both qualify (EXECUTED). For the specimens, either draw each as a real layer over a small sample of content (absolutely positioned, so it passes), or count them as site allowances and drop "No new allowance". Glass stays declared by its class; whether a glass panel is a layer is Q3's question.

7. **Low. Decision 14 and criterion 10 describe a `020a` that does not exist on disk** (`:229–231`, `:433`). They say `020a`'s "site stylesheet imports the generated `src/app.css` … and excludes `context/` and `tests/`". `020a` as written adds `@source not "../context"` to `src/app.css` and nothing for `tests/`. Separately, no translucent rule in today's build comes only from `tests/` (EXECUTED), so the `tests/` half is not needed for test 14.
   Fix: cite `020a` in the form it lands. If `020a` is being rewritten, say "as amended" and give its date. Make criterion 10 read "no rule for a class found only in `context/`", plus "or `tests/`" only if `020a` excludes it. Correct the memo's §2.4 sentence about `bg-popover/70`.

8. **Low. The built-CSS check's exceptions and colour forms are incomplete** (`:111–126`, `:244–259`, test 14). `.shimmer` stays after `020a`, because the word is in `src/` prose. Its value uses relative-colour syntax with a computed alpha, which none of "D1's forms" names. `shadcn-svelte/tailwind.css` also supplies `scroll-fade*` utilities. They fade content through a `mask-image`, which decision 4's list does not read.
   Fix: decision 4 adds `mask-image` (with alpha below 1 in a stop) and relative-colour syntax (`… / <calc>`: treat any alpha that is not the literal 1 as translucent). Decision 16 counts `.shimmer` as a third exception, or `020a` adds `@source not inline("shimmer")`. D-rules add `scroll-fade*` and Tailwind's `mask-*` utilities to D2's family.

9. **Low. Shadows: right conclusion, overstated basis, and no site rule** (`:136–148`, `:233–243`). "The owner's words decide it": the owner said nothing of shadows. The conclusion follows from the rule's letter, since a shadow is paint with alpha (decision 4 already lists it), and from `002` decision 7. Separately, L5 lints items only. D1 to D4 do not extend it, so a `shadow-md` on a site page is caught only by the runtime test.
   Fix: write "*Why:* a shadow is translucent paint, so the rule already places it (INFERRED); it is also the other sign of depth". Add D5: L5 extended to site files, `shadow-elevation` passing only beside `data-layer="surface"` as D4 says.

10. **Low. The runtime reader has small gaps** (`:111–126`, `:261–279`).
    - It does not read `text-decoration-color`, `caret-color`, `column-rule-color`, `accent-color`, `::selection` or `::marker`. None is translucent today (grep), so this is about the future.
    - `settled()` waits for finite animations. Say that infinite ones are skipped and why: today only `spinner`'s rotation, which paints no alpha.
    - `allowed()` must recognise "a shadow through `shadow-elevation` only" from computed style. Say how: the computed `box-shadow` equals the resolved token's, read beside the element.

    Fix: add them to decisions 4 and 17.

11. **Low. D1 needs a colour test, and D1 and D2 need fixtures for near misses** (`:239–240`, test 5). As worded, "a colour utility with an alpha modifier … an arbitrary value" would fail `text-sm/6` and `text-[13px]/5`, Tailwind's line-height shorthand. L1 avoids this today by testing the name against the colour list (`lint-literals.ts:438–440`).
    Fix: D1 flags a modifier only when the value is a colour: a token, a palette colour, `[#…]`, `[color:…]`, `(color:--x)` or `(--x)` on a colour utility. Add fixtures: `text-sm/6` passes; `bg-foreground/[.5]` and `bg-foreground/(--a)` fail. For D2, `transition-opacity` and `transition-[margin,opacity]` pass.

12. **Low. Two grounds the token cannot serve** (`:167–173`, `:214–220`). The `field-N` utilities redeclare `--border` but not `--groove-line` or `--sidebar-border` (`build-tokens.ts:505–526`). A `groove` on a field becomes a pale line at 3.55 to 5.02:1 in light and a dark one at 5.82 to 8.90:1 in dark (EXECUTED). An unfilled divider inside glass over a coloured field falls to 1.00 to 1.13. None is drawn today: the stage rule keeps controls on `surface-plain` or glass. An app can still draw one.
    Fix: decision 8's composite also redeclares `--groove-line` and `--sidebar-border` in each field utility. Add one sentence to decision 12 and the upgrade guide: inside glass over a field, draw a rule on a filled element, not on the glass.

13. **Low. Q1 should cite its precedent; names lag 020** (`:483–488`, `:225`). The owner's ruling has already been applied to two `border-border` hairlines inside the bar, and both were fixed (`019a` decision 3). Option 2 would reverse that, and the option should say so. Decision 13 still says "`pluto-theme`'s elevation example" and "`pluto-theme`'s contrast example". The memo's §2.3 header cites `tokens/pluto.tokens.json`.
    Fix: add the precedent to Q1, and rename the three references.

## The open questions

- **Q1, recommended 1 (solid): agreed**, once findings 2, 3 and 12 change its text. The owner's rule is already applied to hairlines (`019a` decision 3). Option 3 turns quiet rules into control edges, as the spec says.
- **Q2, recommended 1 (three neutral roles): agreed in direction.** Half opacity on a control lets the page show through an element on the page's level. That is the rule's letter. Finding 4 stands: give the filled variants the disabled edge, or a fill distinct from `accent`. Option 3 should be offered with Primer as its precedent, not as a cost-only alternative.
- **Q3, recommended 1 (glass is always a layer): agreed, and the question should still be asked.** The owner's sentence ties translucency to being above: "above everything else … so it is transparent to what is below it". "Stays in a fixed position" says why the bar is above everything. It does not read as a second condition. A band's field is full bleed under its panel and is not the panel's own content, so decision 1's definition already admits the panel. The panel is drawn raised, with rim, shadow and isolation (`011` decision 8). Option 2 reads the fixed position as necessary. It would also repaint `stage-hero`, an installed item, which is an interface change the option does not list. Option 3 is a presentation choice that is compatible with option 1. Offer it as an addition, not an alternative. The owner's words can bear option 2, so the owner should choose.

## Constitution checks

- §4.1 source, not a package: holds. `data-layer` is markup in the app's copy.
- §4.3 tokens are the one source: holds. The new roles and primitives are tokens with composite records. The forced twins of finding 1 use `028`'s amended list of system colours.
- §4.4 accessible by default: disabled contrast is exempt (SC 1.4.3, 1.4.11), and the spec's 3:1 floor exceeds it. Forced colours: **finding 1**.
- §4.5, §4.6: no dependency added; `lightningcss` is `029`'s.
- §5: research, then spec; the scorecard prediction (row 4 held) is right. The roadmap row's lanes and dependency are flagged for the design lead (`:320`).
- §6: every interface change has a changelog bullet and an upgrade step (decisions 19, 20).

## Verdict

Does not land yet: findings 1 and 2 (High) and 3 to 6 (Medium) stand. Findings 7 to 13 are write-ins with their fix text.

## Disposition

Not yet dispositioned.

## Re-check, 2026-11-15

- **Reviewed:** the specification as revised (668 lines): its "Review response", "After the owner's answers and `031a`'s revision", and the landing notes with the design lead's ruling on Q2's figures. Also the memo's Corrections. Checked against `031a` as revised (decisions 1, 1a, 1b, 6 and 7, and its Knock-ons), `029`'s T7 and decision 7, `031` decision 6, `028` decisions 2 and 9, `scripts/build-tokens.ts:79–119` (`FIELD_ROLES`, `SURFACE_ROLES`, `surface-plain`), and the items that read `--background` (grep).
- **Re-ran** (session scratchpad, `031b-review/`; no repository build, no server, port 5199 untouched):
  - `recheck.py`: the sunken line, the disabled roles and the toggle's label, on every ground they can meet;
  - `recheck.mjs`, in Chromium:
    - (a) the switch's track and thumb, on and disabled, under forced colours, with this spec's twins and `028`'s;
    - (b) a divider in a card inside a `surface-sunken` well, in dark.
  - Primer's `borderColor.disabled` (`borderColor.json5:119–149`), read.

### (1) The thirteen findings

| # | Resolved? | Note |
|---|---|---|
| 1 | Mostly | Every stacked class in the table has its twin, `028`'s test 8 first rule still runs, and test 17 adds the two cases. **One twin is missing**: the switch's thumb. See R2 |
| 2 | Yes, in form | `sunken-line` with `surface-sunken` and the capture rule replaces the private line. Its inheritance into cards fails. See R1 |
| 3 | Yes | Decision 7's table by context, the 0.17 removed, the risk and the checkpoint rewritten. Decision 4 states the computed-colour proxy as a choice |
| 4 | Yes | References corrected. Filled variants take `border-disabled-edge`. 1.4.11 is cited |
| 5 | Yes, by `031`'s ruling | The disabled pairs are exempt, kept out of the contrast file's rows, and floored by test 3 in every context. See R3 for the floor's grounds |
| 6 | Yes | Decision 2 and test 11 hold every `[data-layer]` root out of flow, with a mutation. The specimens are redrawn as real layers. See R8 for one wording point |
| 7 | In part | It cites `020a` "as amended", but the `020a` on disk is still the one-line `src/app.css` edit. See R6 |
| 8–13 | Yes | D5, relative colour syntax, `mask-image`, `.shimmer`, D1's colour test and fixtures, the field lines, Q1's precedent and the names are all in. One stale count is in R7 |

### (2) `sunken-line` and `surface-sunken`

- **The values hold.** `#C7C3B8` and `#22211E` are `ink` at 0.1 over `paper-sunken` and `paper` at 0.1 over `ink-sunken`. Each reads 1.23 on `sunken` (EXECUTED). The role is public and in `cssVars`. So `029`'s T7, which asks `cssVars.theme` for a `color-<name>` for every colour key, is satisfied by `color-sunken-line`.
- **The T7 argument is loose but its conclusion stands.** T7 does not test what `bg-sunken` declares. A hand-written `bg-sunken` would collide with the colour utility that `029` decision 7 generates from `--color-sunken`, and that is the real reason to keep the declarations off it. R5 rewords it.
- **Through `light-dark()` and `031`.** The redeclarations are `var()` references, resolved where the well is painted. A nested `data-scheme` scope picks its own arm. `031`'s high-contrast pair for `--sunken-line`, declared on `<html>`, reaches the well by inheritance, so there is no derived-variable trap.
- **But the redeclaration does not stop at the well's ground.** `031a` decision 1's role words tell apps to "set status messages and controls on a card inside it". A card inside the well inherits `--border`, `--groove-line`, `--sidebar-border` and `--background` (R1).

### (3) The disabled targets

- **The figures hold on the grounds the spec lists.** `disabled-foreground`: 3.14 on wash in light, 4.14 in dark. `disabled-edge`: 1.75 on paper in light, 1.83 on `card` in dark (1.84 rounded; the contrast script truncates).
- **They do not hold on two grounds the spec leaves out.**
  - On `muted` and on the filled control's own `disabled` fill, the edge reads 1.59 (light) and 1.64 (dark). These pass 1.5, but test 3 does not read them.
  - On `sunken` in light, the edge reads **1.39** and `disabled-foreground` **2.76**. Both are below the spec's own floors. Inside a well, `--background` is `sunken`, so a pressed, disabled toggle's label (`text-background` on `disabled-foreground`) also falls from 3.48 to **2.76**.
- **Exempt under `more`: sound.** WCAG exempts inactive components from SC 1.4.3 and 1.4.11, and `031` changes no ground or disabled role.
- **Is 1.5:1 principled?** The spec's only reason is "the edge must not vanish", and that would justify 1.2 as well. The references split.
  - Carbon's `border-disabled` (gray 30) reads 1.71 on white.
  - Primer's light `borderColor.disabled` is solid neutral 8, 3.45 on white (`borderColor.json5:119–120`). Its dimmed and high-contrast themes make it neutral 8 or 9 at 0.1 to 0.12 alpha (`:129–149`).
  - Today's half-opacity edge draws 1.75 on the middle ground.

  1.5 is a fair floor if it is anchored to today's look and Carbon's edge, with margin, and if it is measured on every ground a disabled control may sit on (R3).

### (4) Internal consistency

- Decision 9 still says "`disabled` … is still its own role, so `031` can give it its own high-contrast value". Decision 11 says it keeps its standard value under `more`.
- Decision 12 still says "So the owner chooses. The options are under 'Open questions'". The owner has answered.
- Test 5 is titled "D1 to D4" but holds D5. Build-order step 4 says "D1 to D4".
- Review response item 5 gives the order as "`029`, this, `031`". Decision 11 says `031a`, this, `031`. The item's "Since aligned" note covers the targets, not the order.
- Test 6's count ("nothing else") holds for D5: the only shadow class in site files is `shadow-elevation`, in the elevation example (grep).

All of these are in R7.

### Remaining findings

**R1. High. `surface-sunken`'s redeclarations leak into the cards the role tells apps to put in a well** (decision 11, `031b…md:208–221`; `031a` decision 1's role words).
Custom properties inherit, so every opaque surface inside the well takes the well's line and ground.
- In dark, a divider inside a card in a well is `#22211E` on `#221F19`, **1.02:1**, against 1.32 on any other card. EXECUTED in Chromium: `rgb(34, 33, 30)` on `rgb(34, 31, 25)`. Every divider inside such a card vanishes, and test 3's floor, `sunken-line` on `sunken`, cannot see it.
- In light, the same divider reads 1.76 on white, against 1.40 elsewhere: heavier than every other card's.
- Inside the card, `--background` is `sunken`. So `avatar-group`'s cut-out becomes a sunken ring on white, the defect decision 11 says it closes, moved one level in. And `toggle`'s `text-background` labels take `sunken` (R3).
- The capture rule does the same to every carded example in a thumbnail.

Fix: the system already has the mechanism for fields, which is the same problem.
1. Add `background`, `groove-line` and `sidebar-border` to `SURFACE_ROLES` (`build-tokens.ts:91`; `border` is there already). Then `surface-plain` restores all four from the root's `--surface-*` copies.
2. Change `031a`'s role words to "on a `surface-plain` card inside it". The upgrade guide's step 7 says the same.
3. Give every item that paints an opaque ground and is likely inside a well `surface-plain`, as `stage-card` and `live-console` already do. At least `card`; the builder lists the rest.
4. Add to test 3, or to the runtime test, a divider inside a `surface-plain` card inside a well that reads at least 1.1:1 against the card, in both schemes. Mutate it by dropping `surface-plain`.
5. If a card without `surface-plain` in a well is instead to be a restricted placement, say so in `031a` decision 1a's restricted block, with its figure.

**R2. High. Under forced colours, an on, disabled switch's thumb matches its track** (per-item table, `switch` row).
The new track twin `forced-colors:data-disabled:data-checked:bg-[GrayText]` paints the track `GrayText`. The thumb keeps `028`'s `forced-colors:data-disabled:bg-[GrayText]`. EXECUTED in Chromium: track `rgb(96, 0, 0)`, thumb `rgb(96, 0, 0)`. An on, disabled switch shows no thumb. Under `028` alone it showed a `GrayText` thumb on a `Highlight` track.
Fix: add the thumb's twin on the same stack, `forced-colors:data-disabled:data-checked:bg-[Canvas]`. At (0,3,0) it beats `028`'s (0,2,0), and it gives a `Canvas` thumb on a `GrayText` track. Add an on, disabled switch to test 17's cases, with G reading the thumb's fill against the track's. More generally, decision 10 should say that a mark on a state fill takes `Canvas` when the fill takes `GrayText`, as the checkbox's check and the toggle's label already do.

**R3. Medium. The disabled floors miss three grounds, and two pairs fail on `sunken`** (decision 11's table, test 3, `031a` decision 1a).
EXECUTED, in light:
- `disabled-foreground` on `sunken`: 2.76;
- `disabled-edge` on `sunken`: 1.39;
- a pressed, disabled toggle's label inside a well: 2.76.

In both schemes, the edges on `muted` and on `disabled` (1.59 light, 1.64 dark) pass but are not read.
Fix:
1. Test 3 reads `disabled-edge` on `background`, `card`, `muted` and `disabled`, and `disabled-foreground` on `disabled`, `card`, `background` and `muted`.
2. `[disabled-foreground, sunken]` and `[disabled-edge, sunken]` join `031a`'s `restricted` block, by rule in both schemes, as `input` already does there (2.80). A control in a well sits on a `surface-plain` card (R1). `031a`'s lint and browser test then hold them.
3. With R1's restore, the toggle's label is back on `background` inside a card. Add `[background, disabled-foreground]` (3.48 light, 5.20 dark) to test 3's floor, since the toggle draws it.
4. Give the 1.5:1 floor its anchor in decision 11: "below today's half-opacity edge (1.75) and Carbon's `border-disabled` (1.71), with margin; above the hairline's 1.1, so a disabled control's edge is never drawn at hairline weight". Note that Primer's light edge is far stronger (3.45), so this is a choice.

**R4. Low. A morning reversal of Q2's figures would cost more than a threshold** (landing notes, the design lead's ruling). The ruling is recorded with its reasons, under the owner's delegation. The text does not say what a raise would cost. At 4.5:1 text and 3:1 edge, `ink-half`, `paper-half`, `line-input-half` and `paper-line-input-half` stop being 0.5 composites. Test 2's figures change, so does every disabled picture, and decision 9's "a disabled ghost button looks as it does now" goes.
Fix: add one sentence to the ruling naming that cost. In the build order, finish lane T's disabled primitives, and do not regenerate the pictures, until the morning status has been read. Lane T comes first anyway, so a raise then costs four values and a test.

**R5. Low. Restate the `bg-sunken` reason** (`:220`). Write: "a bare `bg-sunken` is the colour utility `029` decision 7 generates from `--color-sunken`; hand-writing it to carry declarations would collide with that generated rule. So the declarations live on `surface-sunken`." T7 still holds, through `color-sunken-line` in `cssVars.theme`.

**R6. Low. `020a` on disk does not match what this cites.** Decision 14 and criterion 10 cite `020a` "as amended for its build", with a site stylesheet excluding `context/` and `tests/`. The file still adds `@source not "../context"` to `src/app.css` alone. Criterion 10 cannot be checked against a document that says otherwise.
Fix: build-order step 1 confirms `020a`'s file and landing notes describe the stylesheet. If they do not, criterion 10 falls back to "no rule for a class found only in `context/`". Nothing found only in `tests/` is translucent today, so test 14 does not depend on it.

**R7. Low. Stale text** (the five consistency points above).
Fix:
- Decision 9: replace the "*Why `disabled` aliases `wash`*" clause with "it adds no new colour. It is its own role, so a later spec can move it alone".
- Decision 12: drop "So the owner chooses …" and cite the answer.
- Rename test 5 "D1 to D5", and build-order step 4 "D1 to D5".
- Review response item 5: the order is `031a`, this, `031`.

**R8. Low. Decision 2 and test 11's wording admits the wrong wrapper.** "Or its nearest positioned ancestor is out of flow and paints nothing" reads `dialog-content` (`relative`) correctly only if "ancestor" excludes the element itself. As written, a `relative` root inside any transparent `absolute inset-0` box on the page also passes.
Fix: write "its nearest positioned ancestor other than itself". Add: "and that wrapper is the item's own (a bits-ui floating wrapper, a `*-positioner` slot, LayerChart's tooltip container), named in the case data". The mutation then also covers an in-flow root inside a page-level absolute box.

### Verdict

Does not land yet: R1 and R2 (High) and R3 (Medium) stand. Each is a small, local fix: `SURFACE_ROLES` and `surface-plain` on cards; one thumb twin and one test case; four floor rows and two restricted pairs. R4 to R8 are write-ins with their fix text. Once R1 to R3 are fixed as written, the specification is fit to build without a further re-check.
