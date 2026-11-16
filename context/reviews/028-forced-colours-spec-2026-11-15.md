# Review of 028 — Forced colours

Reviews [`specifications/028-forced-colours.md`](../specifications/028-forced-colours.md).

- **Date:** 2026-11-15
- **Status:** in review; does not land yet (approve with changes)
- **Reviewer:** a reviewer; not the author
- **Reviewed:** the specification as drafted, 2026-11-15 (355 lines), and its memo, `research/2026-11-15-forced-colours.md` (194 lines). They were checked against:
  - the constitution (§4.1, §4.3, §4.4, §5, §6), `AGENTS.md`, `reviews/README.md`, `roadmap.md` (lanes, row `028`, wave 2, cross-lane landings);
  - `022` decisions 1 to 3, 13a and 16, and its landing notes; `023`'s lane-I order; `026` decisions 13 and 14 and test 68; `027` decision 8, its "Forced colours" section and tests 24, 40 and 48; `029`'s Kind, Lanes, decision 9, T20 and its lane-order risk; `019a` decision 3; `030`'s memo, `research/2026-11-15-accessibility-status.md` (the spec is not yet written);
  - the tree: `src/lib/registry/ui/switch/switch.svelte`, `toggle/toggle.svelte`, `radio-group/radio-group-item.svelte`, `sidebar/sidebar-menu-button.svelte`, `dialog/dialog-content.svelte`, `button/button.svelte`, `table/table-row.svelte`, `meter/meter.svelte`, `composer/composer.svelte:129`; `src/app.css` (the `.glass` forced rule, the base `:focus-visible`, `meter`'s components-layer rules); `scripts/lint-literals.ts` (`NAMED_COLOURS`, `itemFiles`, the `font` rule at 592); `tokens/pluto.tokens.json` (`type.weight`); `src/lib/site/page/theme-switch.svelte:34`; `src/lib/site/chrome/side-nav.svelte`;
  - prior art: Carbon `utilities/_high-contrast-mode.scss`, `components/checkbox/_checkbox.scss:150–161`, `components/popover/_popover.scss:225`; GOV.UK Frontend `helpers/_focused.scss:20–30`; Primer `guides/accessibility/color-considerations.mdx:113–146`; Spectrum `docs/s2-docs/web/rsp/components/menu.md:59–61`. Studied, not copied.
  - external: Microsoft Learn, "Contrast themes" (updated 2026-08-29); MDN, `<system-color>`; W3C CSS Color 4, §6.2 system colours. Read 2026-11-15.
- **Re-ran:** nothing in the repository was written but this file. No repository build. My own probes are in the session scratchpad, `028-review/`. Playwright 1.64.1 (Chromium, Firefox, WebKit), the pinned `@tailwindcss/node` and Lightning CSS, and the main tree's `build/` (16:10) served on port 4417, stopped after.
  - **Engine facts, by painted pixels** (`eng.ts`, EXECUTED). With `forcedColors: "active"`, light: WebKit matches the media query (a rule under it painted black) but repaints nothing: a red fill stays `200,0,0`, a box-shadow stays, a 4 px transparent border stays white. Chromium and Firefox repaint the fill white, drop the shadow and paint the transparent border black. An explicit SVG `fill` stays `200,0,0` in both. A colour on the `<svg>` itself stays green in Chromium (`forced-color-adjust` computes `preserve-parent-color`) and is forced black in Firefox. **The memo's §1.2 holds.**
  - **Palettes** (`spec1.ts`, `scope.ts`, EXECUTED). Chromium light: `Highlight` `rgba(5, 0, 73, 0.8)`, `SelectedItem` `rgb(179, 215, 255)` in both schemes (1.5:1 on white `Canvas`), `GrayText` `rgb(96, 0, 0)`. Chromium dark: `Highlight` `rgba(26, 235, 255, 0.8)`. Firefox, both schemes: `Highlight` = `SelectedItem` = `rgb(51, 153, 255)`, `GrayText` `rgb(109, 109, 109)`. WebKit: `Highlight` `rgba(128, 188, 254, 0.6)`. Inside a `color-scheme: dark` subtree on a light page, Chromium's `Highlight` becomes `rgba(55, 0, 110, 0.8)`; every other keyword is unchanged. **The memo's §1.3 holds**, and `Highlight` is translucent (finding 9).
  - **The spec's classes, compiled and applied** (`gen.mjs`, `spec1.ts`, EXECUTED). As written, `forced-colors:bg-[ButtonText]` beside `data-unchecked:bg-card` computes white (the thumb stays `Canvas`). `forced-colors:opacity-100` beside `data-disabled:opacity-50`, and beside `disabled:opacity-50` on a native disabled button, computes 0.5. The same classes with the state variant stacked (`forced-colors:data-unchecked:bg-[ButtonText]`, `forced-colors:data-disabled:opacity-100`) compute `ButtonText` and 1, in all three engines (finding 1).
  - **The literal lint on the spec's classes** (`lint.ts`, EXECUTED, `lintText` with `loadRules`, an item path). 0 violations for every system-colour class, the stacked forms, the pseudo-element fills, `forced-colors:border`, `border-(length:--focus-width)` and its `has-[…]` form. **`forced-colors:font-semibold` fails the `font` rule** (finding 2). `p-[calc(var(--space-1)-var(--line-width))]` fails "spacing off the ladder" and `p-[3px]` fails "arbitrary value"; `translate-x-[calc(8*var(--spacing)-2*var(--line-width))]` passes (finding 3). The site's theme switch already writes the stacked form, `forced-colors:aria-pressed:bg-[SelectedItem]`.
  - **Vendor pseudo-element rules** (`gen2.mjs`, EXECUTED, minified): each `::-webkit-meter-*`, `::-moz-meter-bar`, `::-webkit-progress-value` and `::-moz-progress-bar` rule stays its own rule under the media query.
  - **Meter and progress with system colours** (`prog.ts`, EXECUTED). As built, forced: Chromium's progress is white at 10% and 90%; **Firefox's meter is white at both, so it vanishes too** (the memo reports Chromium only). With a `Canvas` track, a 1 px edge and a `CanvasText` fill: 10% `0,0,0`, 90% `255,255,255` in both engines, for both elements. Decisions 5 and 7 work.
  - **A sample of the 26 failures, and the assertions mutated** (`mini.ts`, `mutA.ts`, EXECUTED, Chromium and Firefox, 1280 × 900, against `build/`, with and without a stylesheet that applies decision 2's roles):

    | Item, assertion | Chromium as built | Chromium fixed | Firefox as built | Firefox fixed |
    |---|---|---|---|---|
    | `switch`, B (pixels on click) | 0 | 186 | **984** | 984 |
    | `switch`, D (track border) | 0 px | 1 px | 0 px | 1 px |
    | `toggle`, B | 0 | 3,913 | **3,972** | 4,320 |
    | `dialog`, D (content border) | 0 px | 1 px | 0 px | 1 px |
    | `sidebar`, C (current against peer) | same width, style, colour, weight 400; ground `Canvas` at alpha 1 against alpha 0, which C counts as equal | weight 600 against 400 | same | weight differs |
    | `button`, E (disabled) | opacity 0.5, colour already `GrayText` | 1 | 0.5 | 1 |

    So B, C, D and E fail for real in Chromium and pass once the roles apply. In Firefox, B passes as built (finding 4).
  - **Assertion A, mutated** (`mutA.ts`, EXECUTED): `collapsible`'s trigger, `item`'s link and `table`'s row checkbox change 2,942, 2,600 and 350 pixels on focus in Chromium (perimeters 960, 1,266 and 96). With `:focus-visible` replaced by a box-shadow, all three change 0 and `outline-style` is `none`, in Chromium and Firefox. Decision 16's focus mutation works.
  - **A sample of the 20 passes** (`sniff.ts`, `signin.ts`, EXECUTED, forced, at 1280 and 390). No disabled element in any of the 20 stages. Stateful elements: `table`'s selected row (a 2 px start border survives: a true pass), `composer`'s send button (never disabled, `composer.svelte:129`), `app-shell`'s theme toggle (its icon changes). **`sign-in` and `sign-up`, after an empty submit, show `aria-invalid` inputs with a 1 px `CanvasText` border, the same as a valid input.** They are false passes (finding 5).

## Acceptance criteria against evidence

The specification is not built, so each criterion is judged as writable and checkable.

1. The list — checkable (test 1). The excluded count is wrong (finding 14). READ.
2. Drawn, in Chromium — checkable. Its predicted failures miss `sign-in` and `sign-up` (finding 5). EXECUTED, sample.
3. Drawn, in Firefox — checkable, but B cannot fail in Firefox for a `ButtonFace` fill (finding 4). EXECUTED.
4. The rules compute — checkable. G must read its reference colour in the element's own scope (finding 6). EXECUTED.
5. WebKit's gap counted — checkable for `028`'s file; the forced-colours tests that land earlier are not covered (finding 7). READ.
6. The lint — **not met as designed**: decision 6's `font-semibold` fails today's lint (finding 2). EXECUTED.
7. Per item, as the design says — **not met as designed**: the fixes table's classes lose the cascade (finding 1). EXECUTED.
8. Icons — checkable; F fails in Chromium for an `<svg>` colour (EXECUTED, engine probe). READ.
9. Nothing changes outside the mode — checkable only if nothing else lands between baseline and landing (finding 6). INFERRED.
10. Proven where nothing failed — checkable; the focus mutation works (EXECUTED).
11. Composites — checkable; needs `sign-in` and `sign-up` named and their states driven (finding 5).
12. The new items — checkable. READ.
13. Tagged for the status — checkable, given finding 15. READ.
14. The changelog — checkable. READ.
15. Weight — checkable. READ.
16. The suites — checkable. READ.
17. The checkpoint — review.
18. The scorecard — checkable; row 3's arithmetic (4 of 8 → 2) holds against the anchors (READ, `benchmark-scorecard.md:77`).

## Findings, most severe first

1. **High. The fixes table's classes lose the cascade to the classes they must beat** (`028-forced-colours.md:88`, `:117`, `:224–235`). A bare `forced-colors:` class has specificity (0,1,0). The state classes it overrides have (0,2,0): `data-unchecked:bg-card`, `data-disabled:opacity-50`, `disabled:opacity-50`, `aria-disabled:opacity-50`, `aria-[current=page]:border-sidebar-primary`. The media query adds nothing to specificity.
   Failure: the switch's thumb "at rest" stays `bg-card`, forced to `Canvas`: invisible. Every one of the twelve disabled fixes stays at opacity 0.5. EXECUTED in all three engines (Re-ran, "The spec's classes"). The check would go red, but the decisions are the answer the builder is told to start from, and they are wrong in most rows.
   Fix: state one rule in decision 2: "a forced-colours class carries the same state variant as the class it overrides." Rewrite the rows in that form: `forced-colors:data-unchecked:bg-[ButtonText]`, `forced-colors:data-checked:bg-[HighlightText]`, `forced-colors:disabled:opacity-100` with its `aria-disabled:`, `data-disabled:`, `has-` and group forms, the checkbox's `forced-colors:data-checked:` and `data-indeterminate:` fills, and the sidebar's `forced-colors:aria-[current=page]:border-s-[Highlight]`. Cite the site's own precedent, `theme-switch.svelte:34`. Add a G role for each disabled form, so a missed variant fails G and not only E.

2. **Medium. Weight 600 is not a token, and `forced-colors:font-semibold` fails the literal lint today** (`:53`, `:96`, `:233`). `tokens/pluto.tokens.json` holds weights 400, 500 and 700. The lint's `font` rule rejects `font-semibold` (EXECUTED).
   Failure: criterion 6 ("0 violations") cannot pass with decision 6 as written. A new weight would break §4.3, or add a token that the Kind says is not added.
   Fix: use `forced-colors:aria-[current=page]:font-bold` (700), as `027`'s pagination marks its current page (`027` decision 13). C's weight comparison is unchanged.

3. **Low. The switch's geometry fix has no lint-clean form as described** (`:104`, `:224`). "Padding reduced by the line width, with the token form": `p-[calc(var(--space-1)-var(--line-width))]` fails "spacing off the ladder", and `p-[3px]` fails "arbitrary value" (EXECUTED). `--space-1` is also not a variable here; the theme has `--spacing`.
   Fix: keep the padding. Shorten the travel by the two edges instead: `forced-colors:data-checked:translate-x-[calc(8*var(--spacing)-2*var(--line-width))]` passes the lint (EXECUTED). Or name another form the builder confirms in the lint. Add a check that the thumb's box lies inside the track's padding box, on and off, under the mode.

4. **Medium. In Firefox, assertion B passes a fill nobody can see** (`:151`, `:153`). A pixel "changes" when its channels differ by more than 60 in sum. Firefox forces an "on" toggle's ground to `ButtonFace`, `rgb(233, 233, 237)`, on white `Canvas`: a difference of 62, about 1.2:1.
   Failure: today's toggle changes 3,972 pixels on press in Firefox and passes B; the switch changes 984 (EXECUTED). Criterion 3 would be met in Firefox by the faults the spec exists to fix. G holds the role only where a case declares one.
   Fix: raise the per-pixel threshold so that `ButtonFace` against `Canvas` does not count. A channel sum above 150 does it: the weakest real change measured, Firefox's `Highlight` on white, sums to 306, and its `GrayText` to 438. This is a "drawn" threshold, not a palette ratio, so decision 13's "no ratio" rule holds. Apply the same threshold to A. Record in the memo that Firefox's thumb and toggle show at 1.2:1, so they "pass" by eye only faintly.

5. **Medium. Some of the 20 passes are false, because the audit never drove the composed items' states** (memo §4.2 "Passed"; `:29`, `:273`, `:290`). `sign-in` and `sign-up` compose `input`. After an empty submit, their invalid inputs keep a 1 px `CanvasText` border, the same as a valid one (EXECUTED).
   Failure: test 4's predicted failures and criterion 11's composite list leave out two items that fail C today. Decision 16's "proven where nothing fails" counts them among the 20 that only mutation can fail.
   Fix: each composite's case drives the states its view can reach: submit the empty form (invalid), open each menu and sheet, select a row. Add `sign-in` and `sign-up` to decision 14's inherited list and to test 4's C list. In test 1, require a case for an item whose dependencies have roles to declare at least one state, or to give a reason in the case.

6. **Medium. Criterion 9's baseline, and G's reference colour, do not survive `029` in the same wave** (`:190`, `:193`, `:201`, `:275`, `:288`). Test 6 photographs every changed item's page "against a baseline taken on the tree before the build", and thumbnails are to be byte-equal. `029` builds at the same time in lane T. It changes every colour variable, and makes alert's tints solid (`029` decision 9, T20). Decision 19 says "either order" with `029`, judging only `alert.svelte`.
   Failure: if `029`'s lane-T landing falls between test 6's baseline and `028`'s landing, every page that shows an alert differs, and the thumbnails cannot be byte-equal. That would be a false red, or a baseline re-taken by hand. Also, once `029` adds `data-scheme`, Chromium resolves `Highlight` differently inside a dark scope (`rgba(55, 0, 110, 0.8)` against `rgba(5, 0, 73, 0.8)`, EXECUTED), so a G that reads its reference keyword on `body` fails a correct rule there.
   Fix: make criterion 9 structural, so it does not depend on order. Compile the item stylesheet with and without every `forced-colors:` class in the changed items, and assert the rules outside `@media (forced-colors: active)` are identical. Keep the screenshots as a second check, taken on the same tree with those classes stripped. In decision 19, order `028` against `029`'s lane-T landing as well as its alert edit, and say a baseline is re-recorded after any lane-T landing. In G, resolve each reference keyword on a probe inserted beside the element, not on `body`.

7. **Medium. `notIn` arrives after the forced-colours tests that need it** (`:174`, `:276`). `022` decisions 1 and 2 run every e2e file, `forced-colors.spec.ts` included, in each engine's light project, `webkit-light` among them. `026` test 68 asserts the toast's transparent border is drawn under the mode. WebKit does not draw it (EXECUTED: the transparent border stays white). `027` says WebKit "records 'not emulated', one line per test in `022`'s engine list", but `022`'s `onlyIn` takes one engine, so that line cannot be written as `027` describes. Both land before `028`.
   Failure: in wave 1, `026` test 68 fails in `webkit-light` and is ledgered. `027`'s WebKit lines have no form. `018`'s file runs in WebKit and asserts nothing about the mode. When `028` lands, `ENGINE_ONLY` holds two vocabularies for one engine gap, and `030` reads both.
   Fix: in decision 15, move `018`'s `forced-colors.spec.ts`, `026` test 68 and `027` tests 24, 40 and 48 onto `notIn("webkit", …)`, with the one reason, at `028`'s landing, and retire any ledger line or engine-list line they carried. Correct the wording: WebKit does emulate the media query; it repaints nothing. Or offer `notIn` to `022` as a lane-E edit in wave 1, so `026` and `027` use it from birth. Test 7 then counts every one.

8. **Medium. Q1's recommended option puts an exception to the constitution into `AGENTS.md`** (`:331–334`). §4.3 says "A colour or size in a component comes from a token, never a literal." `AGENTS.md` obeys the constitution, and the constitution "changes only by the owner's decision, noted in its Status line". A ruling there cannot make a literal lawful.
   Failure: the owner answers option 1. L25 then allows `bg-[Highlight]` in items while §4.3 still forbids it. The next reviewer finds a constitution breach in 22 items.
   Fix: option 1 becomes "amend §4.3 with one clause, noted in the Status line: 'Under forced colours, an item may name the system colours of `028` decision 2; they are the user's palette, not design colours.' `AGENTS.md`'s token rule mirrors it." The substance of option 1 is sound, and it is still the right recommendation. Option 2 wraps the user's palette in a variable that holds the same keyword in every scheme. It also gives `021`'s DTCG file a colour token with no colour value (INFERRED: a DTCG colour holds a colour space and components, not a keyword). Option 3 takes the rules out of the item an app installs, against §4.1's intent. L25 itself is sound: it closes the `bg-[Canvas]` gap the memo found (§4.3), only item files are linted (`itemFiles`), so the site's `SelectedItem` and swatches are untouched, and the six keywords match decision 2.

9. **Low. "`Highlight` fills are opaque" is not so** (`:202`). Chromium's emulated `Highlight` is `rgba(5, 0, 73, 0.8)` light and `rgba(26, 235, 255, 0.8)` dark; WebKit's is `rgba(128, 188, 254, 0.6)` (EXECUTED).
   Fix: say instead that the fills are the user's system colours, which `028` adds no alpha to. Tell `031b` that any runtime depth check it adds runs outside forced colours, or exempts system colours. `019a` decision 3 is not breached: the fill sits on the control's own `Canvas` ground, so nothing behind the layer shows through.

10. **Low. Assertion E checks text colour only** (`:156`). Decision 9 also sets edges and marks to `GrayText`. Chromium's UA already paints a disabled `<button>`'s text in `GrayText` (EXECUTED: `rgb(96, 0, 0)` as built).
    Failure: a disabled switch whose track edge and thumb stay `ButtonText` passes E.
    Fix: E also asserts that a disabled element's border colour, where its width is above 0, and each declared mark's background, equal `GrayText`.

11. **Low. The sidebar's outline variant would lose its visible start edge** (`:95`, `:233`). The outline variant draws `border border-input border-s-(length:--focus-width)` at rest (`sidebar-menu-button.svelte:18`). Its start border is part of the box, not a reserved space. "Rows `border-s-[Canvas]`" applied to every row hides it, and leaves a three-sided box.
    Fix: give `forced-colors:border-s-[Canvas]` to the default variant only, which is decision 6's own general rule ("a border that exists only to hold space"). Add the outline variant's rows to D's edge selectors.

12. **Low. In an invalid OTP, the active slot and the invalid slots look the same** (`:232`, `:240`). Both are marked by a 2 px edge. The fake caret shows only in an empty active slot.
    Fix: draw the active slot's edge in `Highlight` (`forced-colors:data-[active=true]:border-[Highlight]`), and keep width for invalid. Microsoft names `Highlight` for UI "interacted with … or in progress". The slot also stands in for focus, which Chromium draws in `Highlight`.

13. **Low. Q2's recommendation rests on consistency, against the one guidance that speaks** (`:124`, `:336–338`). Microsoft: "We recommend using 2px borders for transitory surfaces such as flyouts and dialogs" (READ, "Contrast themes", Borders). Carbon's popover takes a 1 px transparent outline under the mode (READ, `_popover.scss:225`, `high-contrast-mode('outline')`), which the spec does not cite. Under the mode, every field and button already has a 1 px `CanvasText` edge, so a 1 px layer edge looks like a control's.
    Fix: cite both. Rewrite the options so they do not tie the bar to the overlays: the bar is not transitory, and Microsoft's tip is for transitory surfaces. Suggested: (1) 2 px, `--focus-width`, for the six overlays and the toast, with the bar unchanged; (2) 1 px everywhere, as Carbon does. I would recommend (1). Either is buildable; it is the owner's call.

14. **Low. Counts and a path** (`:39`, `:97`). At landing there are 82 items (75 plus the seven new ones). With 54 checked, `EXCLUDED` holds 28, not 23. Decision 6 cites `side-nav.svelte:69`; the file is `src/lib/site/chrome/side-nav.svelte`, and the line is the comment at 68–69.
    Fix: "the other 28", or let test 1 derive the number and drop it from the decision. Give the full path.

15. **Low. What `030` reads is not quite specified** (`:150`, `:172–174`). `030`'s memo found that an annotation pushed at run time does not appear in Playwright's listing, and that Carbon reads a skipped test as "Partially tested" (READ, `research/2026-11-15-accessibility-status.md` §1.1 and line 79).
    Fix: say that `item` and `check` are declared in each generated test's details, not pushed at run time. Say that the `notIn` WebKit skip and the `firefox-dark` skip each carry a reason that `030` reads as "not applicable in this engine", not as a partial result.

16. **Low. The memo understates Firefox's meter** (memo §4.2, "Outside the 46"). As built, Firefox paints the meter white at 10% and 90%, so it vanishes, as Chromium's progress does (EXECUTED). Decisions 5 and 7 fix both elements in both engines (EXECUTED with system colours).
    Fix: one line in the memo; no change to the spec's design.

## The open questions, judged

- **Q1, system colours under §4.3.** Option 1 is right in substance and wrong in where it records the ruling (finding 8). Recommend it as amended: the constitution's §4.3 gains the clause, and `AGENTS.md` mirrors it.
- **Q2, the overlay edge.** Both options are defensible. The stated reason for 1 px is weak, and option 2 is written too broadly (finding 13). Recommend 2 px for transitory layers.
- **Q3, `GrayText` at full opacity.** Sound; recommend option 1. WCAG 2.2 SC 1.4.3 and 1.4.11 exempt inactive components, so this is a convention. Microsoft says to "reserve it for disabled content", and pairs it with the window colour (READ). Carbon's `disabled` preset sets `GrayText` as colour and fill (READ, `_high-contrast-mode.scss:29–31`). Material's switch does the same at full opacity (memo §2). Full opacity is the only way the user's chosen `GrayText` reaches the screen as they chose it. Finding 1 makes it buildable, and finding 10 makes it checked.
- **Q4, a real Windows theme.** Sound; recommend option 1, a recorded manual run in Edge with Aquatic and Desert before 1.0. The emulated palettes are not Windows themes: Chromium's light `GrayText` is a dark red, and its `SelectedItem` is not in its forced palette at all (EXECUTED: the same `rgb(179, 215, 255)` in both schemes). Option 2 is untried, and is better as a follow-up spec, once `022`'s Windows runner is proven.
- **`Highlight` against `SelectedItem` (decision 2).** I agree with `Highlight`.
  - Microsoft pairs `Highlight` and `HighlightText` for UI that is "selected, interacted with (hover, pressed), or in progress", and lists no `SelectedItem` (READ).
  - Spectrum says "Selected items should have the background and text colors defined for selected text", which is `Highlight` (READ, `menu.md:61`).
  - MDN describes `Highlight` as "Background of selected items" (READ).
  - CSS Color 4 assigns `Highlight` to "selected text, for example from ::selection" and `SelectedItem` to "selected items, for example a selected checkbox" (READ, §6.2), and Carbon follows it for its checkbox (READ, `_checkbox.scss:155–159`). That is the case for `SelectedItem`. But Chromium's emulated `SelectedItem` is 1.5:1 on its light `Canvas`, and Firefox resolves the two to the same colour (EXECUTED).
  - `Highlight` is visible in every palette measured, and is what the only platform with the mode prescribes. The spec states the trade-off honestly (`:61`). Its remark that "on Windows both resolve to the theme's highlight" is INFERRED, and is labelled so.

## Constitution checks

- §4.1 source, not a package: met. The rules live in each item's class strings, so an installed item carries them (decision 12). Q1's option 3 would weaken this; it is not recommended.
- §4.3 tokens are the one source: not met as drafted. `font-semibold` is not a token (finding 2), and system colours need the constitution itself amended, not `AGENTS.md` (finding 8).
- §4.4 accessible, and proven: the spec's purpose. Its WebKit gap is a test gap, not a user gap: no Safari platform has the mode. The gap is counted through `notIn`, and G still runs in WebKit. That meets "a finding to fix, never a limit to record", given finding 7. Firefox's proof needs finding 4.
- §4.5 and §4.6 pins and dependencies: no package is added; the pixel decoder runs in the page, as `bar-glass.spec.ts` does.
- §5 the pipeline: research, then spec, then this review; tests first, with mutations for the kinds that fail nowhere today. Lane I, behind `023`, as the roadmap orders.
- §6 never: no prior-art code is copied. Carbon and GOV.UK are paraphrased. No interface changes, and the changelog bullets are planned.

## Verdict

Does not land yet: findings 1, 2, 4, 5, 6, 7 and 8 stand. None needs new research. With them and the Low write-ins applied, the specification is fit to build. Approve with changes.

## Disposition

Not yet answered.
