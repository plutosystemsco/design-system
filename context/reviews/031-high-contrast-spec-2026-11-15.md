# Review of 031 — High contrast

Reviews [`specifications/031-high-contrast.md`](../specifications/031-high-contrast.md).

- **Date:** 2026-11-15
- **Status:** in review; revise.
- **Reviewer:** a reviewer; not the author
- **Reviewed:** the specification as drafted, 2026-11-15 (626 lines). I checked it against these:
  - the constitution, `AGENTS.md`, `reviews/README.md`, `roadmap.md` (rows `031`, `031a`, `031b`; §3's waves; §6 Q4);
  - the memo `research/2026-11-15-high-contrast.md` and its folder: `palette.ts`, `palette.json`, `engines.mjs` with `engines-out.txt`, `swatches.png`, `in-use.png`;
  - `021`, `024` (the headroom table), `028` (decision 15's ground), `029` (decisions 1 to 8, 14, 16 and its emitted shape), `031a` (decision 1, `sunken`), `031b` (decisions 7 to 9 and 11), `019a` decision 3, and the owner's entries in `git show beeb67e:context/decisions.md`;
  - the tree on `release/0.13.0`: `tokens/kuiper.tokens.json`, `src/app.css` (the `.dark` block, the field and glass utilities), `src/lib/registry/ui/theme/theme-script.svelte`, `src/lib/site/chrome/bar.svelte`, `scripts/contrast.ts`, `tests/helpers/colour.ts`, and the existing `build/` output.
- **Re-ran:** I changed nothing in the repository but this file. I ran no repository build. Every probe is mine, in `…/scratchpad/031-review/`, written before reading the author's scripts' internals (I read `palette.ts` afterwards, to find where a difference came from).
  - `colour.py` (Python, `-I`): WCAG 2.2 relative luminance, OKLab and OKLCH from the published definitions, an sRGB gamut test, and Machado 2009's matrices. Not `scripts/contrast.ts`. Output `colour-out.txt` (EXECUTED).
  - `derive.py`: the swatches derived again from decision 5's prose alone (EXECUTED).
  - `mech/`: a fixture in `029`'s shape with `031`'s blocks (`gen.mjs`). Three real **Vite 8.3.5** production builds with `@tailwindcss/vite` 4.3.3 and Lightning CSS 1.33.0 (`build.mjs`): no minify, `029`'s `exclude: Features.LightDark`, and defaults. Then `read.mjs` reads 18 elements and 4 properties each in Chromium, Firefox and WebKit on Playwright 1.64.1, over 8 cases, modern and emulated fallback. Output `read-out.txt` (EXECUTED).
  - `cli-probe.mjs`: shadcn-svelte 1.7.1's own CSS merge (`Ds`, from a scratch copy of `dist/` with one export added), run three times on a scratch app (EXECUTED).
  - `weight.py`: the high-contrast CSS generated from `palette.json` in `029`'s shape, gzipped against today's `src/app.css` (EXECUTED).
  - `bar.mjs`: the existing `build/` served read-only on port 5233; the site bar measured at 320, 360 and 390 px in Chromium (EXECUTED).
  - [web-features explorer, `prefers-contrast`](https://web-platform-dx.github.io/web-features-explorer/features/prefers-contrast/), read 2026-11-15 (CITED).

## What holds

Each claim below was checked against its evidence, and stands.

- **196 of 196 pairs pass.** My own arithmetic recomputed every row of `palette.json` from its two hexes: 0 below target, 0 ratios more than 0.01 from the memo's. The closest are exactly at target: dark `border` and `input` on `muted` 4.50, the dark glass edge 4.50, light `primary` on `muted` 7.00, light `syntax-blue` and `syntax-grey` on the active line 7.00, dark `syntax-red` on the code ground 7.00 (EXECUTED). But see finding 5 for which fills the 8 field rows measured.
- **The derivation is reproducible from the prose.** `derive.py`, written from decision 5's words, gave 11 of the 12 brand and neutral swatches I derived to the exact hex, and `#FFA29E` for `red-lifted-more` against the spec's `#FFA29F` (finding 9). Every `-more` source hex equals `tokens/kuiper.tokens.json`'s primitive (EXECUTED).
- **The hues stay.** Every chromatic swatch is within **0.38°** of its source's OKLCH hue (yellow-more the most). Chroma falls only where the source's chroma at the new lightness lies outside sRGB: for all ten swatches whose chroma fell, my gamut test confirms the source chroma was out of gamut; for the others it was in gamut and kept (EXECUTED). The neutrals move 1.4° to 4.0°, from 8-bit rounding at chroma near 0.02 (finding 3).
- **The tints.** `#F5E6E9` 7.30, `#E6EEEB` 7.52, `#382C26` 7.01, `#293027` 7.01 for the text on each, and each tint 1.18 to 1.21 from its card (EXECUTED).
- **The problem, counted.** Of 36 text pairs per scheme, 21 light and 10 dark are below 7:1 at standard contrast (EXECUTED, from the rows).
- **The mechanism, in three engines, built.** My fixture holds `029`'s shape: pairs and copies on `:root`, `.dark` restating them with `var()` copies, the `data-scheme` rules, the ink ground rules, `.surface-ink` and the legacy ink rule, the scope rule's restorations in `@layer base`, a field and the glass as Tailwind utilities, `029`'s fallback; and `031`'s modern block, glass rule and two fallback sets. **66 runs, 0 mismatches**, in Chromium, Firefox and WebKit. The runs cover the CSS without minify, after Vite with the exclusion, and the emulated fallback of that build. The cases are:
  - scripts off with the system at `more`, on a light and a dark system;
  - `standard` beating the system's `more`;
  - `more` by hand on a light root, and on a dark root carrying `.dark`;
  - the attribute on a subtree only, which must change nothing, and does.

  Each run read three deep in both directions, a `.dark` alias and a light scope inside it, an alias inside a light scope, a dark scope and an alias inside a field, ink and a light scope inside it, `dark surface-ink`, and the glass in both schemes, with its alpha and its `backdrop-filter`. **The probe can fail:** with the `… .dark` list item deleted from the built block, every engine reported the alias and the scope inside it at standard values (EXECUTED).
- **The positive `@supports` survives Vite 8.3.5's minify** (the Risks bullet's open question). In all three builds `@supports (color:light-dark(#000, #fff))` is kept once, with `@media (prefers-contrast:more)` nested inside it, and the HC pairs written as `light-dark(…)`. With the exclusion, 0 `--lightningcss-*` variables. With defaults, Lightning CSS still leaves the pairs inside the positive block unlowered, and lowers `:root` (54 `--lightningcss-*`), which `029` decision 8 already handles (EXECUTED).
- **The CLI.** `Ds` writes `@supports (…) { … @media (…) { … } }` as nested at-rules, the top-level glass `@media` beside it, and the fallback's two sets after `029`'s. The second and third adds are **byte-identical** (1,595 B each) (EXECUTED). Decision 2's "No `:root` or `.dark` is a list item inside any at-rule" holds for every selector written.
- **Support.** `prefers-contrast` is Baseline widely available since 2024-11-30: Chrome 96, Edge 96, Firefox 101, Safari 14.1, Safari iOS 14.5 (CITED). So `029`'s whole fallback range, Safari 16.4 to 17.4, has it, as decision 3 says.
- **Forced colours.** Decision 15's account matches `028` and the author's probe output: Chromium and Firefox repaint everything, and WebKit emulates without repainting (READ, `engines-out.txt`). `031` adds no rule under `forced-colors`. T9 is the right check.
- **Weight.** My estimate: modern block +424 B, with the fallback sets +839 B, with the glass rule +865 B gzipped, added to today's `src/app.css` (EXECUTED). The spec says 422, 785 and 809. The fallback is 0.42 kB, not 0.36. The total stays inside decision 16's +1.0 to +1.3 kB. The smallest headroom in `024`'s table is `/`, 33 kB, so it fits.
- **The CSP hash.** `020` has landed and already changed `THEME_SCRIPT` in this cycle (READ, `theme-script.svelte`). `029` and `031` change it again before the tag. An app compares tags, so it updates the hash once if all three ship in 0.13.0. That is Q5's point, and it is right.
- **The block's count.** 31 variables: 27 light roles (the dark 17 are a subset), 2 fields, 2 glass (EXECUTED, `weight.py`).
- **The chart figure.** Light high contrast under deuteranopia: chart-2 against chart-3, **4.1** ΔE (EXECUTED). But see finding 6 for the figure it is compared with.

## Findings table

| # | Severity | Finding | Where |
|---|---|---|---|
| 1 | High | `031a`'s `sunken` and `031b`'s roles and solid `line` land in lane T before `031`, by both specs' own plans. `031` names neither. On `sunken`, the proposed `ink-soft-more` reads 6.20 and `line-more` 3.95. So Q1 would approve swatches that fail on the tree they are built on | decisions 5, 6, 12, 13; Q1; T1, T3; build step 1; `palette.ts:85–89` |
| 2 | Medium | Guide step 5's opt-out, `data-contrast="standard"` in markup, does not work in an app with the `theme` item. The head script and the store overwrite it | decision 4; guide step 5; decision 1 |
| 3 | Medium | Decision 13's validator rule (hue within 1° when the source's chroma is 0.02 or more) rejects two of the spec's own swatches: `line-more` 1.57°, `paper-line-more` 1.56° | decision 13; T1, T2 |
| 4 | Medium | The bar at 320 px has 26 px to spare. A 48 px toggle and its 4 px gap need 52, so "at every width" overflows the bar at the WCAG reflow width. T10 checks only 1440 and 390 | decision 17; Q3; T10 |
| 5 | Low | `palette.json`'s 8 field rows measure fills that decision 12 does not adopt (6 of 8 differ). Decision 8's "inside a field, 8.80 or more" comes from them; the adopted design's lowest is 7.02 | decisions 6, 8, 12; "196 pairs" |
| 6 | Low | Wrong or mixed figures: the largest move is yellow, not red; the chart figure "6.8" is protanopia, not deuteranopia; "27 runs" is 33 logged; the `why` strings name uses the spec does not adopt; the fallback is 0.42 kB | decisions 5, 7, 16; memo §§2–4 |
| 7 | Low | Q1's exhibit should name what the owner will notice: `chart-3` and `yellow-more` read olive-brown in light high contrast, and the light charts become less distinct (7.0 → 4.1 ΔE under deuteranopia) for the reader who asked for more | Q1; decision 7; T3 |
| 8 | Low | A computed variable list can shrink, but the CLI never removes a declaration. An installed app would keep a stale HC override | "The generator, in outline" |
| 9 | Low | Write-ins: state that `.dark`'s copies are `var()`s; fix the derivation's tie-breaking details for T2's exact hex; close the minifier risk; one hash step in the guide | decisions 2, 5; T2, T4; Risks; guide step 2 |

## Findings, most severe first

1. **The spec is drawn on a tree that will not exist when it builds: `031a`'s `sunken` and `031b`'s roles come first** (decisions 5, 6, 12, 13; Q1; T1, T3; build step 1; `palette.ts` lines 85 to 89 hard-code three grounds per scheme).
   - `031a` decision 1 adds the role `sunken`, `#DCD7CA` and `#0B0A07`, and two text pairs, `[foreground, sunken]` and `[muted-foreground, sunken]`. Its header says it "queues in lane T after `029` and before `031`", and that "`031` must give `sunken` a high-contrast pair" (READ, `031a` lines 7 and 10).
   - `031b` decision 7 makes `line` and `paper-line` solid (`#DCDAD3`, `#37342E`). Decision 8 makes the fields' 24% edge solid. Decision 9 adds three roles, `disabled`, `disabled-foreground` and `disabled-edge`, and four primitives. Decision 11 says "whichever of `031` and this specification lands second carries the other's roles. The recommended order is this one first" (READ).
   - `031` mentions neither `sunken` nor the disabled roles. Its counts assume neither: 27 and 17 roles, 31 variables, 77 primitives, 63 roles per scheme, and "the one alpha line left" in decision 12.
   - Failure, measured on `031a`'s light `sunken` with `031`'s proposed swatches (EXECUTED, `colour.py` §5):
     - `muted-foreground`, `ink-soft-more` `#444A55`: **6.20**, below 7. `031a` puts this pair in the contrast file, so T3 ("every text row at 7 or more") fails on arrival.
     - The least lightness move of `ink-soft` that clears 7:1 on `sunken` is `#3D424D` (L 0.379, against `ink-soft-more`'s 0.408). **The swatch put to the owner in Q1 changes.**
     - `primary` 6.13, `destructive` 6.14, `success` 6.18 and `caution-text` 6.14 on `sunken`, if any of them may sit there.
     - `line-more` on `sunken`: **3.95**, below 4.5. It needs `#645D50`.
     - Dark is fine: every HC text colour is 9.47 or more on `#0B0A07`, and `paper-line-more` 6.08.
   - Build step 1, "re-run `palette.ts` on the tree", cannot catch this: the script's grounds are typed in, not read from the contrast file.
   - Fix:
     - Write `031` against the tree after `031a` and `031b`, as both ask.
     - Either make `sunken` a ground the derivation measures, re-derive, and redraw the exhibit, or rule that it is not a text ground in high contrast. The second means dropping `[muted-foreground, sunken]` from the `more` section, with its reason. Put that choice to the owner with Q1, recommended option first. The first keeps the rule "text at 7:1 on every ground it sits on".
     - Say what high contrast does to `disabled`, `disabled-foreground` and `disabled-edge`. WCAG 1.4.3 and 1.4.6 exempt disabled controls, so "unchanged" is a fair default, with `031b`'s 3:1 floor checked under `more` too.
     - Rewrite decision 12's "one alpha line left": after `031b` there is none.
     - Read the grounds in `palette.ts` and in `deriveForContrast`'s callers from the contrast file's rows, so a later ground cannot be missed.
     - Re-pin every count, and T1's role counts, from the tree.
     - Ask Q1 only after the exhibit shows the re-derived swatches.

2. **The markup opt-out is overwritten** (decision 4; guide step 5; decision 1, "`standard` … to opt out").
   - The head script ends `root.setAttribute("data-contrast", more ? "more" : "standard")`, unconditionally. The store's effect writes the attribute from `contrast.resolved` (READ, decision 4).
   - Failure: an app with the `theme` item serves `<html data-contrast="standard">` for a brand screenshot, as guide step 5 says. A reader has Increase contrast on, and no key is stored. The head script writes `more` before first paint, and the store keeps it there. The opt-out does nothing (INFERRED, from decision 4's code).
   - Only an app without the `theme` item, or a page with scripts off, can opt out in markup.
   - Fix: choose one, and test it in T7.
     - **Recommended:** rewrite step 5. The opt-out in an app with the `theme` item is `contrast.set("standard")`; for a screenshot, the capture tool's emulation (`contrast: "no-preference"`). Markup opts out only without the `theme` item.
     - Or let the head script and the store leave a server-rendered attribute alone. That needs a lock both obey, and a test that the toggle still works.

3. **The validator's hue rule fails two of the spec's own swatches** (decision 13, fourth rule; T1, T2).
   - The rule: "its hue is within 1° of its source's OKLCH hue when the source's chroma is 0.02 or more."
   - `line-input` has chroma 0.0224 and `line-more` moves 1.57°. `paper-line-input` has chroma 0.0214 and `paper-line-more` moves 1.56° (EXECUTED, `colour.py` §2, `derive.py`). The derivation keeps hue exactly; 8-bit rounding moves it, more as chroma falls. `ink-soft` (0.0195) and `paper-soft` (0.0198) escape only because they sit just under 0.02. `code-grey-more` moves 3.95°, at chroma 0.016.
   - Failure: the validator, as written, rejects `tokens/kuiper.tokens.json` once the swatches are in it. Either the build fails, or the builder loosens the rule at the bench without a ruling.
   - Fix: check hue against the derivation's own unrounded colour, or scale the tolerance to the rounding, for example 1° at chroma 0.1 and above, and `atan(0.002 / C)` below it. Then T2's mutation is a swatch moved 5° at high chroma. The rule for `adjusted` swatches (T2) needs the same tolerance.

4. **The toggle does not fit the bar at 320 px** (decision 17, "at the same size, at every width"; Q3; T10).
   - Measured on the existing `build/` (EXECUTED, `bar.mjs`). The bar's right-hand group is search 40, `ThemeToggle` 48 and the menu 32, with 4 px gaps. Room to spare: **26 px at 320**, 66 at 360, 96 at 390. No horizontal scroll today.
   - A second 48 px toggle and its gap need 52 px. At 320 the bar overflows by about 26 px. 320 CSS px is WCAG 1.4.10's reflow width, and four site specs already test it (`identity`, `blocks`, `compositions`, `on-brand`). An `icon-sm` toggle (36 px with its gap) still does not fit unless `ThemeToggle` shrinks too.
   - Fix: say what the bar does below about 360 px. Either both toggles take `icon-sm` there (that frees 16 px, so 42 px for 36), or the contrast toggle moves into the Menu sheet below `md`. T10 adds 320 px: no horizontal overflow, and the toggle reachable.

5. **The field rows measure fills the design does not use** (decisions 6, 8, 12; "196 pairs measured").
   - `palette.json` measures every field at its `-more` fill: light field-1 `#2236C3`; dark `#95B2FF`, `#FFA29F` and `#69CDA0` (READ). Decision 12 keeps light field-1 `#2D48D4` and every dark fill.
   - The adopted design still passes: light field-1 **7.02**, field-2 8.82, field-3 9.53, field-4 8.88; dark 8.67, 8.67, 13.2, 8.62 (EXECUTED, `colour.py` §4). So nothing fails. But the evidence for 6 of the 196 rows is for another design.
   - Decision 8's "Inside a field, the ring is the field's legend, 8.80 or more" comes from those rows. In the adopted design the light field-1 ring is white on `#2D48D4`, 7.02.
   - Fix: regenerate `palette.json` with decision 12's fills, and correct decision 8 to "7.02 or more". Light field-1 then sits 0.02 above the target. Say so, so an adjustment at Q1 that lowers it is caught: T3 covers it.

6. **Figures to correct** (decisions 5, 7, 16; memo §§2 to 4).
   - "The largest move is red, OKLCH L 0.524 to 0.432" (−0.092). Yellow moves most, 0.512 to 0.411 (−0.101), then green (−0.094), then red (EXECUTED; also `palette.json`'s own `oklch`).
   - "The closest chart pair under deuteranopia goes from 6.8 to 4.1." At standard contrast, light, deuteranopia: **7.0** (chart-2 against chart-4). The 6.8 is protanopia (chart-2 against chart-5). The memo mixes the two. Dark: 4.8 under deuteranopia and 3.1 under protanopia, unchanged by `031` (EXECUTED, `colour.py` §6).
   - The memo's "0 mismatches in 27 runs": `engines-out.txt` logs 33 runs, 6 of them forced-colours runs that print without judging. Say "27 judged, 6 printed".
   - `palette.json`'s `why` strings give `blue-more` "chart-1, field-1" and `red-more` "chart-2, field-2" as jobs. Decisions 6 and 12 give neither; red-more is the light field-2 fill. Fix the strings, since the exhibit prints them for the owner (READ, `swatches.png`).
   - The fallback sets: 0.42 kB, not 0.36 (EXECUTED, `weight.py`). Decision 16's total stands.

7. **Q1's exhibit should name what the owner will see** (Q1; decision 7; T3).
   - In `in-use.png`, light high contrast, `chart-3` (`yellow-text` `#806200`) reads as olive-brown beside the brand's yellow; `yellow-more` `#5E4701`, the caution text, darker still. They keep their hue within 0.4°, but at L 0.41 to 0.51 a yellow hue no longer reads as yellow. The brand's yellow fills (`caution`, field-3, the marks) do not change. That is the owner's call, and the question should say it in a sentence.
   - The light charts lose distinctness in high contrast, from 7.0 to 4.1 ΔE under deuteranopia. That is a reader who asked for more getting less, in this one respect. The book's labelling rule carries the meaning, and `038` re-measures. Agreed with deferring it. But T3 should pin 4.1 as a floor that `038` must not lower, not only print it.

8. **The variable list is computed, and can shrink; the CLI never removes** ("The generator, in outline", second bullet).
   - "A later change to a standard primitive that makes an override redundant drops it from the CSS." In an installed app the CLI replaces and adds declarations, but never removes one (`029` decision 4, READ). The old override stays in the app's high-contrast block, holding its old pair.
   - Fix: once a variable has shipped in the block, it stays there, holding the standard pair if it no longer differs, until a release removes it with a guide step. T4 holds the shipped list.

9. **Write-ins.**
   - **`.dark`'s copies must be `var()`s.** Decision 2's "Its `--surface-*` copies, restated on `.dark`, then substitute HC pairs" holds only if `.dark` restates them as `var(--<role>)`, as `src/app.css` does today (lines 279 to 285) and as my fixture did. `029` decision 4 says `css[".dark"]` holds "the `--surface-*` copies, as pairs", which could be read as literal pairs. Then a scope inside a `.dark` alias would restore standard `primary` and `muted-foreground` (INFERRED; the mutation above shows how sensitive the alias path is). State the dependency in decision 2, and let T4 assert that every `--surface-*` and `--code-*` copy on `.dark` is a `var()`.
   - **T2's exact hex depends on tie-breaking details.** From decision 5's prose I derived `red-lifted-more` as `#FFA29E`. The spec's `#FFA29F` differs by 1 in blue. Both read 7.01 on the same tint, `#382C26` (EXECUTED). Name the details T2 depends on: chroma searched down from the source's in steps of 0.001; the gamut test's tolerance; channel rounding; the tint loop's order. Or let T2 accept any hex within 1 per channel that meets the targets.
   - **The minifier risk is closed.** The Risks bullet "the positive form is unproven in a build" can cite this review's three Vite builds (above). T12 and T13 stay.
   - **One hash step.** `020`'s, `029`'s and `031`'s guide sections each tell an app to update its CSP hash. If all three ship in 0.13.0, merge them into one step, in `020`'s section, naming the three changes.

## The five questions

- **Q1, the swatches — option 1, but not yet.** The method is sound and the hexes reproduce (above). The light set does read as the same brand, darker; the dark set barely moves. But finding 1 changes at least `ink-soft-more`, and maybe `line-more`, once `sunken` is a ground. Re-derive on the tree that `031a` and `031b` leave, redraw the exhibit, and then ask. Say what finding 7 says in the question.
- **Q2, the glass — option 1, solid.** It is consistent with the owner's rule. "Transparency always signifies depth" (`019a` decision 3) says where translucency may appear; it does not require a layer to be translucent. A solid bar with a 4.5:1 edge and its shadow is still visibly above the page. Kuiper already paints it solid for `prefers-reduced-transparency`, and text on a translucent bar has no ratio that can be promised. The question is still the owner's, rightly: it overrides "glass everywhere" (`019a`, the owner's choice) in one mode. Option 3 would make the `/brand/` panels the one place where high contrast does not hold, so it is weaker.
- **Q3, the setting — option 1, with finding 4's narrow-width rule.** A one-press control beside the scheme switch is right. Option 2's tri-state is better for "system", but costs a press for everyone. Option 3 hides a control readers need.
- **Q4, dividers — option 1.** The owner's ruling says "non-text elements reach 4.5:1". Primer does the same. After `031b` the hairline is already solid, so option 1 changes only its colour. Option 3 adds a swatch and a third line weight for a mode that exists to be stronger. Note, for the checkpoint: dense pages (sidebar, tables) will look heavier, as the Risks say.
- **Q5, the release — option 1, 0.13.0.** The hash argument is right (above). If finding 1's re-derivation and the owner's second look at Q1 push the lane long, the roadmap already names this as the first to slip, and the guide's hash step then moves with it.

## Constitution checks

- **§4.1 source, not a package:** holds. The store, toggle and head script are copied source. Nothing reaches back.
- **§4.3 tokens are the one source:** holds. Every colour is a primitive or an alias. The glass's `#FBFAF6` is the existing `glass.fallback` token. The derivation is recorded in each token's extension.
- **§4.4 accessible by default, and proven:** holds in intent: three engines, a forced-colours run beside it, an AAA scan. Findings 1 and 4 are gaps against it: a role at 6.20 under a 7:1 ruling, and a bar that overflows at the reflow width.
- **§4.5 and §4.6:** no dependency is added. `phosphor-svelte` is already the `theme` item's.
- **§5:** research, then spec; the owner's questions are recorded with options, recommended first. Fine.
- **§6:** the interface changes are additive, each with a changelog bullet and a guide step. Finding 2 is a guide step that would not work as written. Finding 8 is a silent drift in installed apps.

## Verdict

Not fit to build yet: finding 1 (High) must be resolved, with the swatches re-derived on the tree after `031a` and `031b` before Q1 goes to the owner, and findings 2 to 4 (Medium) need their fixes. Findings 5 to 9 are Low write-ins with their fix text. The mechanism itself (contrast choosing the pair on `<html>`, `light-dark()` choosing the arm, the `.dark` alias, the fallback, the CLI, Vite's build) is proven, and needs no change.

## Disposition

Not yet answered.

## Re-check, 2026-11-15

- **Reviewed:** the revised specification (725 lines), its "Review response" table, the memo's new §6 and §7, and the folder's new `palette.ts`, `palette.json`, `tree.draft.json`, `more.draft.json` and redrawn exhibit. I also read `031a`'s and `031b`'s spec reviews and `src/routes/(site)/components/+page.svelte` lines 150 to 182.
- **Re-ran** (in `…/scratchpad/031-review/`, port 5233 and 5234, nothing in the repository built or changed):
  - `recheck.py`: I rebuilt the HC role map from decision 6's table and decision 5's hexes, not from `palette.json`, with `029`'s tints and `031b`'s draft line composited by my own arithmetic. Then I recomputed all 210 rows (EXECUTED).
  - `quant.py`: the a–b displacement that 8-bit rounding causes, over 120,871 in-gamut OKLCH samples (EXECUTED).
  - `bar2.mjs`: decision 17's rule, simulated on the existing `build/` in Chromium, Firefox and WebKit at 320, 340, 359, 360 and 390 px (EXECUTED).

### The nine findings

1. **Resolved.** Decision 20 fixes the lane-T order, and decisions 6 and 7 say what `031b`'s line and disabled roles become. `sunken` is no longer a ground. `031a`'s re-review made it a private site variable and found it ready, and it sits behind decorative pictures only: the stage holds an `<img alt="">` and the `.site-thumb` span, `aria-hidden` (READ). Decision 6's "a new public ground comes with its rows" rule and T16 replace the typed ground list. The derivation reads every row from the files: `palette.json` lists its three sources, and `unclassified` is empty in both schemes.
2. **Resolved.** Decision 4 states that the head script overwrites a server-rendered attribute, deliberately. Guide step 4 gives the three ways to hold a page at standard, and T7 tests all three and the overwrite.
3. **Resolved** (judged under (c) below).
4. **Resolved** (judged under (d) below).
5. **Resolved.** Field rows use decision 12's fills; decision 8 says 7.02; T3 holds light field-1 at 7.0.
6. **Resolved.** Every figure I flagged is corrected in decision 5, decision 7 and the memo's §6.
7. **Resolved.** Q1 names the olive-brown yellow and the 7.0 → 4.1 chart drop. T3 pins 4.1 as a floor.
8. **Resolved** (judged under (e) below).
9. **Resolved.** T4 asserts that `.dark`'s copies are `var()`s. Decision 5's rules 1 to 7 fix the tie-breaking details, and T2 also accepts a hex within 1 per channel. The Risks bullet now cites the Vite builds. Decision 18 has one hash step, and T14 checks there is only one.

### What is new

- **(a) The lane order and the disabled roles: sound.**
  - `031b`'s review keeps the disabled pairs out of the contrast file, with their own targets. Grounds do not change under `more`, so `031b`'s check passes there exactly when it passes at standard. T3 runs it there anyway.
  - The line roles' HC value comes from `line-input` and `paper-line-input`, so `031b`'s provisional hairline cannot move a swatch.
  - **One write-in (R1, Low).** Keeping disabled roles at their standard values under `more` reads the owner's ruling "non-text elements reach 4.5:1 in high contrast". `disabled-edge` stays at `031b`'s 3:1. WCAG exempts inactive components, so the reading is fair. But it is a reading of an owner ruling, and no question puts it to the owner. Add one sentence to Q4: "Disabled controls are exempt, as WCAG allows. They keep their values, so they stay quieter than enabled ones."
- **(b) The derivation reads its rows: verified.**
  - My role map, built independently, matches the fg and bg hexes of all 184 rows that name two roles, with 0 mismatches.
  - Every role of both schemes is in a row or in `exempt`. Scrim appears in its scrim rows.
  - T16's mutation, a new role in no row, is the right check.
- **(c) The hue tolerance: principled, not fitted.**
  - Rounding a colour to 8-bit sRGB moves it in the OKLab a–b plane by at most **0.0021**: median 0.0006, 99.9th percentile 0.0018 (EXECUTED, `quant.py`). So `atan(0.002 / C)` is the hue error rounding alone can cause at chroma C. The 1° floor holds at high chroma, where 1° is visible.
  - The spec's swatches use a third to a half of it: `line-more` 1.57° of 5.25°, `paper-soft-more` 1.37° of 5.53°, `paper-line-more` 1.56° of 5.21°, `code-grey-more` 3.95° of 7.05°.
  - **One write-in (R2, Low).** The spec gives the formula, but not its basis. The measured worst case, 0.0021, is a hair above 0.002. So a correct derivation at low chroma could, rarely, fail it: about 1 in 1,000 colours lands above 0.0018. Either use 0.0025, or keep 0.002 and say it is the rounding bound to the nearest thousandth. In either case, give the basis in decision 5.
- **(d) The bar: verified.** With `ThemeToggle` set to 32 px and a 32 px twin added, the spare room is **6 px at 320**, 26 at 340, 45 at 359. With both at 48 px it is **14 px at 360** and 44 at 390. All three engines agree exactly, with no page overflow and no overflow in the bar's group (EXECUTED, `bar2.mjs`). Decision 17's "6 px" and its "66 − 52" at 360 both hold. The risk it names (a later item in the bar) is caught by T10 at 320.
- **(e) The `shipped` list: sound.** The block declares the union of `shipped` and the computed list. A shipped name that no longer differs holds its standard pair, and leaves only by a release with a guide step. T4 holds it, with a mutation. T5 takes T4's names, so the fallback sets keep them too, and `kuiper.css` uses the same functions. `more.draft.json` has no `shipped` yet. That is right: decision 6 commits it at landing, with the 31 names.
- **(f) The changed swatch and the 210 rows: verified.**
  - `red-lifted-more` `#FFA29E` is my own result from the prose. Its tint is still `#382C26`, which I recomputed along with the other three tints (`#F5E6E9`, `#E6EEEB`, `#293027`).
  - **210 rows** (35 text, 35 non-text, 4 field, 3 glass and 3 scrim per scheme, plus 20 light and 30 dark code rows): **0 below target**, and 0 ratios more than 0.01 from `palette.json`'s.
  - The tightest rows are exactly at target: the dark line roles on `muted` and `sidebar-accent`, at 4.50.
  - 27 light and 17 dark roles change, and the block holds 31 variables, as decision 6 says.

### Verdict after re-check

**Ready.** Fit to build, once `029` and `031b`'s token edit have landed and the owner has answered Q1 to Q5. All nine findings are resolved and checked again by probe. R1 (put the disabled exemption to the owner in Q4) and R2 (give the hue constant's basis, or use 0.0025) are Low write-ins with their text, and need no further review. My read of Q1 to Q5 stands: option 1 for each. Q1 now goes to the owner on an exhibit that matches the tree it will be built on.
