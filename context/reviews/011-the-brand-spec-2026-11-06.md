# Review of 011 — The brand

Reviews [`specifications/011-the-brand.md`](../specifications/011-the-brand.md).

- **Date:** 2026-11-06
- **Status:** dispositioned; fit to build
- **Reviewer:** a reviewer; not the author
- **Reviewed:** the specification as drafted, 2026-11-06 (273 lines). Checked against the constitution; `decisions.md`, "The identity: round two answered" and "The identity: the owner's first answers" (both 2026-11-06); the light memo (`research/2026-11-06-from-beige-computing-to-liquid-glass.md`) in full; `009` and `010` as built; and the working tree at `6fbdf99` plus its uncommitted changes.
- **Re-ran:** nothing in this repository was written except this file. Scratch files live in the session's scratch folder (`…/scratchpad/review011/`).
  - **Baseline** (EXECUTED): `bun test ./tests/unit` on the working tree → 826 pass, 0 fail, 11 files.
  - **Decisions 2, 3 and 4 applied to a copy of the token file**, run through the repository's own `contrastTable`, `forbiddenRows`, `scrimRows` and `stageTable`, and the 114 code-slot rows built as `tests/unit/contrast.test.ts` builds them (bun, EXECUTED):
    - `contrastTable`: 100 rows, 98 pass, 2 exceptions (light `chart-3` on `background` 1.91, on `card` 2.17), 0 fail. Every figure in decision 2's selected table matches: 16.84 / 16.16, 6.48 / 6.82, 6.16 / 8.67, input 3.53 / 4.02 / 3.20 and 3.91 / 3.49 / 3.12. The tightest text rows: `success` on its tint over `background` 4.51, `destructive` on its tint 4.61, `success` on `muted` 4.68.
    - Code slots: 114 of 114 pass; the tightest is `number` on light `muted` at 4.50 (tied with `escape`, the same colour; the test's reducer returns `number` first).
    - `forbiddenRows`: light 4.19 (still fails); **dark `destructive` 4.62 and dark `success` 4.65, both now pass** (finding 9).
    - `scrimRows`: 6 of 6 pass (light 4.00 / 3.59 / 4.29; dark 4.02 / 3.88 / 3.74).
    - `stageTable`: 21 of 21 pass, but 14 rows move (for example `stage-primary` on `stage` 7.68 → 9.55, `input` on `stage` 4.87 → 4.31, `primary-foreground` on `stage-primary` 6.85 → 9.03).
    - The existing `contrast.test.ts` run with that copy as its token file: 139 pass, 138 fail. Each failure is a pinned figure or hex.
    - Decision 2's tone search: `#C81F34` on its tint 4.26, `#C11E32` 4.49, `#BE1D31` 4.61; `#007651` on its tint 4.34 and on `muted` 4.49; `#1B709B` on the new `muted` 4.35, `#1A6C97` 4.59. All as stated. A brute-force search finds lighter passing values, `#C11E31` and `#007351` (finding 14).
  - **Decision 10's rows**, composited with `compositeAlphaByte` (bun, EXECUTED). The field set: 7.02, 5.61, 8.81, **4.96** (light); 8.67, 8.67, **8.45**, 8.62 (dark); 8 of 8 pass. The glass set: 33 of 33 pass. Light lowest 12.43 / 4.78 / 4.55 by the alpha byte (`DB` = 0.8588), against the memo's 12.55 / 4.83 / 4.60 at a decimal 0.86. Dark lowest 12.06 / 5.09 / 6.47 (`D6` = 0.8392), against 12.09 / 5.10 / 6.45. Dark glass over `paper` gives `muted-foreground` 4.39.
  - **The rows the set does not measure** (bun, EXECUTED). With the field's roles in force (decision 5), the legend colour on light glass over `field-1`, `field-2` and `field-4` measures 1.41, 1.41 and 1.37. On dark glass over `field-1` and `field-2` it measures 1.33. On an opaque `card` inside a field it measures 1.00. `primary` text on `field-1` measures 1.00 in both themes. With the specular at its centre composited over the text, light glass measures 1.74 to 2.90. With the specular under the text, dark `muted-foreground` measures 3.69 to 3.73 over the four fields. Under the text, the dark `--glass-light` must be `#FFFFFF0A` (3.9%) or less to keep `muted-foreground` at 4.5.
  - **The spring** (bun, EXECUTED): ωT = 9.5609; 33 points; maximum 1.068 at point 14; the lowest value after the peak is 0.9954. Before it is forced to 1, the last point is 0.9975.
  - **Chromium 1248 through Playwright 1.64.1**, a page served on `http://localhost` (EXECUTED):
    - `isSecureContext` is true, and `navigator.userAgentData` is present (brands `Chromium,HeadlessChrome`).
    - `(prefers-reduced-transparency: no-preference)` matches, so the feature is supported.
    - `linear()` is supported.
    - Playwright's `emulateMedia` has no reduced-transparency option (READ, `playwright-core/types/types.d.ts`: `contrast`, `forcedColors`, `reducedMotion` only). CDP `Emulation.setEmulatedMedia` with `prefers-reduced-transparency: reduce` works.
    - A layered `.glass` beside unlayered fallback rules, as decision 7 writes them, under reduced transparency: the background is the fallback `rgb(251, 250, 246)`. With `data-glass-lens` on `html`, the backdrop filter stays `url("#pluto-glass-lens") blur(16px)`.
    - Under `emulateMedia({ forcedColors: "active" })` the computed background is `rgb(255, 255, 255)`, the forced Canvas, not the fallback. With the lens attribute, the backdrop filter is again `url(…) blur(16px)`. Without it, the backdrop filter is `none`.
    - A screenshot with `--glass-lit: 1`: the darkest pixel of ink text moves from `#0B0F17` to `#5E6066`. The `::after` paints over the text.
  - **Tailwind 4.3.3** `compile` (EXECUTED): `.glass` and `.bloom` (several declarations) print before `.absolute`, `.fixed` and `.sticky`. So `glass sticky` stays sticky. A `var(--ease-entrance)` inside an `@utility` emits the theme variable on `:root`.
  - **The code** (READ): `scripts/contrast.ts` (`stageTable` reads every role in the dark theme, so it cannot hold light rows); `scripts/tokens.ts:521`, `:546` (exactly `display`, `section`, `proof`; `radius.pill` required); `scripts/build-tokens.ts:229–321, 343–348`; `scripts/lint-literals.ts:82–92, 207–214, 614–634`; `src/lib/registry/ui/four-dot/*`; `src/lib/registry/components/app-shell-footer.svelte:131–138`; `src/lib/registry/ui/card/card.svelte:21`; `src/lib/identity/specimens/wordmark.svelte` (`RISEN.E6` = dot .26, gap .07, space .10, top .90; lift = top − dot); `src/lib/identity/specimens/light-case.svelte:159–184, 616–707`; the shadcn-svelte CLI's CSS updater, `node_modules/shadcn-svelte/dist/index.mjs`: any `@`-rule key goes through a generic writer, and `&`-keys inside an `@utility` become nested rules; `tests/unit/{contrast,tokens,generated,registry,previews,literals}.test.ts`; `tests/e2e/{four-dot,expressive,code,navigation}.spec.ts`; `tests/e2e/pages.ts`.

## Acceptance criteria against evidence

1. **Token file validates; build emits; a unit test reads each:** countable. The shapes of `expressive.glass` and `expressive.field` (per theme), the poster step and the spring are not given (finding 15). INFERRED.
2. **`contrastTable` 98 + 2 exceptions; code slots 114, tightest `number` 4.50:** met on the copy. EXECUTED.
3. **Field 8 rows, glass 33 rows, ≥ 4.5:** the rows pass as defined: 8 of 8 and 33 of 33 (EXECUTED). They do not measure what the page will draw. Inside a field the text roles are the legend's (finding 1). The specular lies over the text (finding 2). **Not a guarantee as written.**
4. **No shadow on overlays; border colour `line-input`:** **not met as written.** The edge is the first layer of `box-shadow`, not a border, and the shadow layer remains as a transparent layer (finding 6). READ `build-tokens.ts:99`, `navigation.spec.ts:52–71`.
5. **Lockup at 100 px: dots 26.1, gap 10, top 90.5:** the arithmetic holds: lift 0.74 × 0.87 = 0.644, top 0.644 + 0.261 = 0.905. It agrees with the baseline rule the existing test proves (lower dots at `rise`, 38 px today). INFERRED and READ. "From the word's last glyph" needs a method (finding 18). The footer endorsement also moves (finding 3).
6. **Spring: 33 points, max > 1.06, last 1; transform only:** the curve passes: max 1.068 (EXECUTED). "Their opacity does not" cannot hold with one `@keyframes` (finding 7).
7. **8 px in expressive mode; L22 and L23; zero violations and exceptions:** the radius and L22/L23 halves are countable. "Zero violations" conflicts with `pointerLight` (finding 5). READ.
8. **`type-poster` 160 px at 1440, 56 px at 390:** met on paper: 12vw is 172.8 px, clamped to 160; 46.8 px, clamped to 56. INFERRED.
9. **Glass blur, fallbacks, lens:** **not met as written.** Reduced transparency cannot be emulated through `emulateMedia`, and forced colours computes Canvas, not the fallback (finding 4). The lens rule outranks the fallbacks (finding 4). EXECUTED.
10. **`pointerLight`:** countable in Chromium. Its mechanism trips the literal lint (finding 5).
11. **Field roles compute to the legend:** countable. That same rule is finding 1's defect.
12. **axe on two pages, both themes:** countable. It would catch finding 1 only if the preview nests a card or glass text inside a field. INFERRED.
13. **`test`, `check`, `lint`; listed expectation changes:** countable, but the list leaves out at least nine groups of tests that will change (finding 10).

## Findings table

| # | Severity | Finding | Where |
|---|---|---|---|
| 1 | High | A field's roles leak into the cards and the glass it may hold: white on white (1.00), the legend on glass (1.37–1.41) | decision 5, line 138; decision 7, line 176; decision 10 |
| 2 | High | The specular highlight paints over the glass's text and is never measured: 1.74–2.90 lit; and it is an area glow, not the owner's "rim highlight" | decision 7, line 173 |
| 3 | Medium | The footer endorsement shares `--mark-lockup-gap` and `--mark-lift`, so it moves too, unlisted | decision 6; decision 11 |
| 4 | Medium | The lens rule outranks every fallback; criterion 9 cannot be run as written in Chromium | decision 7, lines 174, 179; criterion 9 |
| 5 | Medium | `pointerLight` cannot set a custom property without tripping the literal lint, against "zero violations, zero exceptions" | decision 7, line 178; criterion 7 |
| 6 | Medium | Criterion 4 tests a border and an absent shadow; elevation is a box-shadow ring plus a now-transparent layer | decision 4; criterion 4 |
| 7 | Medium | One animation cannot time transform and opacity apart; the entrance must split, and the older-engine fallback is misstated | decision 9, lines 200, 203; criterion 6 |
| 8 | Medium | I5's "edge / highlight: 1 px hairline only" is not applied: the groove's white inset light stays on every product screen | decision 4 |
| 9 | Medium | Two of the three forbidden rows now pass; the test that each "must still fail" breaks, and the rule loses its measured reason in dark | decision 10, line 209 |
| 10 | Medium | Criterion 13's list of changed expectations leaves out at least nine groups of tests | criterion 13 |
| 11 | Medium | `GlassLens`'s filter values and `pointerLight`'s 600 ms are literals in a component (§4.3) | decision 7, lines 178–179 |
| 12 | Low | "The stage of 009 keeps its values": 14 of its 21 rows move through the primitives it names | decision 3, line 107 |
| 13 | Low | Three stated figures are off | decisions 5 and 10 |
| 14 | Low | Darker text tones depart from B3's values without a recorded call; "lightest that passes" is not the lightest | decision 2, line 91 |
| 15 | Low | The token shapes for `glass`, `field`, `poster` and `spring`, and the glass row schema, are unwritten | decisions 1, 5, 7–10 |
| 16 | Low | Copy and comments still call expressive actions pills | decision 4a |
| 17 | Low | "Dark glass never over a light field" is ambiguous in dark, where every field is a light, lifted fill | decision 7, line 176; R25 |
| 18 | Low | Criterion 5's "from the word's last glyph" names no method; the word carries −0.04 em trailing tracking | criterion 5 |
| 19 | Low | Smaller gaps: `@supports` without the prefixed form, the hidden SVG's form, `liquid-glass`'s dependency, `glass` as an English word under L22, the memo's hairlines, documents without criteria | decisions 7, 11–13 |

## Findings, most severe first

1. **A field's roles leak into what it holds** (`011-the-brand.md:138`, `:139`, `:176`) — `field-N` sets `--foreground`, `--muted-foreground` and `--card-foreground` to the legend colour, and every descendant inherits them, including the opaque cards and the glass the decision says a field may hold.
   Failure: a `Card` in `field-1`, light. `card.svelte:21` is `bg-card text-card-foreground`, so the card is white and its title is white: 1.00. `card-description` reads `text-muted-foreground`, also white: 1.00. A glass panel in `field-1` with `text-foreground` copy draws white on `#D7D8E5`: 1.41 (1.37 on `field-4`). In dark, graphite on dark glass over `field-1` measures 1.33. A link in a field's prose stays `text-primary`, blue on `field-1`: 1.00 in both themes. The 33 glass rows pass only because they read the theme's roles, which do not apply inside a field. Decision 7's "a control … sits on an opaque card or on glass over it, whose grounds are measured" fails on the same rule: the control's text is the legend too. All figures EXECUTED.
   Fix: inside a field, restore the theme's roles on every surface the field may hold, and say how. One way: the theme emits per-theme copies the field never touches, for example `--surface-foreground`, `--surface-muted-foreground` and `--surface-primary` in `:root` and `.dark`. The `glass` utility re-declares `--foreground`, `--muted-foreground`, `--card-foreground`, `--primary` and `--border` from them. A new `field-surface` utility, or the rule "a card in a field carries `field-surface`", does the same for opaque cards. Also reset `--primary` (and `--ring`) on the field itself to the legend, or forbid links in field prose. Add a criterion: inside `field-1` … `field-4`, both themes, a `Card`'s title and description and a glass panel's `text-foreground`, `text-muted-foreground` and `text-primary` compute to the theme's values. Add the measured rows to the `field` set: the card title on `card`, and the legend on the field's own `--border` if that border is meant to be seen.

2. **The specular highlight paints over the text, and it is not the owner's rim** (`011-the-brand.md:173`) — the `::after` is `position: absolute; inset: 0` with no `z-index`. In the glass's isolated stacking context it paints after the in-flow text, so a 55% white glow lies over the copy. No row measures it.
   Failure: with `--glass-lit: 1` the darkest pixel of ink text on light glass moves from `#0B0F17` to `#5E6066` (Chromium, EXECUTED). At the glow's centre, composited over the text: `foreground` 2.56–2.90, `muted-foreground` 1.74–1.98, `primary` 1.81–2.06 (EXECUTED). The pointer is usually where the reader is reading. Moved under the text (`z-index: -1`, as `bloom` does), the light theme only gains. The dark theme's 10% glow then drops `muted-foreground` to 3.69–3.73 over the four fields, and `primary` to 4.70. Beyond contrast, the owner chose "a rim highlight that moves only with the pointer" (decisions, round two), as the memo's I9 has it ("a rim highlight whose position follows the pointer"). Decision 7 draws a 220 px area glow across the face.
   Fix: draw the highlight on the rim only. The `::after` keeps `inset: 0` and `border-radius: inherit`, and adds `padding: var(--line-width)` and a mask that keeps only the border ring: `mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)`, with `-webkit-mask-composite: xor` for the prefixed engines. Then no text lies under it, and the contrast rows stand. If an area glow is wanted after all, put it under the content (`z-index: -1`). Set the dark `--glass-light` to `#FFFFFF0A` or less (EXECUTED: `muted-foreground` lowest 4.53 at `0A`, 4.47 at `0B`). Add the lit rows to the `glass` set, the highlight composited over the tint, both themes. Either way, add a criterion: with `--glass-lit: 1`, the `::after` is under the text, or masked to the rim.

3. **The footer endorsement moves too** (`app-shell-footer.svelte:134–137`; `011-the-brand.md:150–156`, `:213–222`) — the endorsement line uses `gap-(--mark-lockup-gap)` and `-translate-y-(--mark-lift)` on a mark that is not scaled. Decision 6 changes both tokens.
   Failure: after the update, the endorsement's gap goes from 0.16 em to 0.10 em of the small text. Its lift goes from 0.76 em to 0.74 em of the mark, so its top falls from 1.06 em to 1.04 em. Decision 6 says "the standalone mark … is unchanged", and decision 11's list of visible changes does not name the footer. Constitution §6 asks that an installed app not be changed silently. INFERRED from the code.
   Fix: either give the endorsement its own tokens and leave it at 0.16 and 0.38, or list the change in decision 11 and the changelog. Add a footer row to criterion 5 either way.

4. **The lens outranks the fallbacks, and criterion 9 cannot run as written** (`011-the-brand.md:174`, `:179`, `:248`) — `:root[data-glass-lens] .glass` has specificity (0,3,0). Each fallback is `.glass` (0,1,0). `GlassLens` never checks forced colours, and checks reduced transparency only at mount.
   Failure: in Chromium with the lens attribute set, under reduced transparency the backdrop filter stays `url("#pluto-glass-lens") blur(16px)`. It stays so under forced colours too (EXECUTED). The background turns opaque, so the page still reads, but "its backdrop filter is `none`" is false and the GPU cost stays. A visitor who turns on reduced transparency after load gets the same. Two parts of criterion 9 cannot be run as written. Playwright 1.64.1's `emulateMedia` has no reduced-transparency option (READ, its types); CDP `Emulation.setEmulatedMedia` does it (EXECUTED). Under `forcedColors: "active"`, Chromium forces the computed background to Canvas, `rgb(255, 255, 255)`, not `#FBFAF6` (EXECUTED).
   Fix: put the lens rule inside `@media (prefers-reduced-transparency: no-preference) and (prefers-reduced-motion: no-preference) and (forced-colors: none)`. `GlassLens` then sets the attribute on the engine test alone, and every preference change is the cascade's. A browser without the feature fails `no-preference`, which is the safe side. Rewrite criterion 9: reduced transparency is emulated through a CDP session (`Emulation.setEmulatedMedia`, features `[{ name: "prefers-reduced-transparency", value: "reduce" }]`), with the lens attribute set. Under forced colours, assert `backdrop-filter: none` and the border colour `CanvasText` (or a system colour), not the fallback background. Add a case for the lens attribute together with each fallback.

5. **`pointerLight` trips the literal lint** (`011-the-brand.md:178`, `:246`; `lint-literals.ts:207`, `:214`) — writing `--glass-x`, `--glass-y` and `--glass-lit` on an element takes `node.style.setProperty(…)`, which `\.style\b` flags. The Svelte form, `style:--glass-x={…}`, is flagged by the style-attribute rule. No item does this today (READ, grep).
   Failure: the builder must either break criterion 7's "zero violations and zero exceptions", or work around the lint (for example `attributeStyleMap`, which Firefox lacks), which defeats the lint's purpose.
   Fix: specify a narrow, counted allowance, for example an L24 that allows `.style.setProperty("--glass-` in `liquid-glass`'s `pointer-light` file only. Give it a bad and a good sample in `literals.test.ts`. Change criterion 7 to read "zero violations; the one allowance of decision 7".

6. **Criterion 4 misdescribes elevation** (`011-the-brand.md:243`; `build-tokens.ts:99–100`) — `shadow-elevation` is `0 0 0 var(--line-width) var(--elevation-line), 0 0.75rem 2rem 0 var(--elevation-shadow)`. The edge is a spread ring, and the overlays have no border (`code.spec.ts` P1: "0 border").
   Failure: after decision 4, the computed `box-shadow` still has two drawn layers, the second `rgba(0, 0, 0, 0) 0px 12px 32px 0px`. The border colour is whatever `border-color` says, not `line-input`. A test written to the criterion fails on a correct build.
   Fix: "the first `box-shadow` layer's colour is `--elevation-line` = `#857E70` and the second layer's alpha is 0, on an open `popover`, `dropdown-menu` and `dialog` content, light theme". Optionally, drop the second layer in light, if a `none` reading is wanted. That is a change to `shadow-elevation`, and it must say so.

7. **The spring's split and its fallback** (`011-the-brand.md:200`, `:203`, `:245`; `build-tokens.ts:266–281`, `:456–462`) — `mark-entrance` runs one animation, `pluto-mark-dock`, whose `from` frame holds both `opacity` and `transform`. An animation has one timing function, so the transform cannot spring while the opacity keeps `--ease-entrance`.
   Failure: the builder must split the keyframes into a move and a fade, two animations per dot. `four-dot.spec.ts:152–300` counts animations named `pluto-mark-dock` (4 at load, 0 under reduced motion, none on a client navigation). Those counts change, and criterion 13 does not name them. The reveal (a transition) can take `transition-timing-function: var(--ease-entrance), var(--ease-spring)` in the `opacity, transform` order; the specification does not say so. Separately, line 203 says an older engine "drops the declaration and the dots keep the theme's catch-all `ease`". A `var()` holding an unsupported `linear()` makes the whole `animation` declaration invalid at computed-value time, so the entrance does not run at all (the mark shows composed). The reveal's transition falls back to the initial `ease` for both properties. INFERRED from CSS Variables §3.
   Fix: specify the entrance as two keyframes, `pluto-mark-dock` (transform, `var(--ease-spring)`) and `pluto-mark-fade` (opacity, `var(--ease-entrance)`), with the same duration, delay and fill. Keep the reduced-motion `animation: none` rule. State the reveal's two-item timing list. Rewrite line 203: an engine without `linear()` shows the mark composed with no entrance, and the reveal eases with `ease`. Name the `four-dot.spec.ts` changes in criterion 13.

8. **I5's hairline-only edge is not applied** (`011-the-brand.md:109–116`; light memo §7, I5, "edge / highlight | 1 px hairline only") — `groove`, `groove-s` and `groove-b` draw a hairline plus a 1 px `box-shadow` of `--groove-light`. In light, that is `raised`, white. They are used 31 times in item files (READ, grep). The owner's I5 reads "hairlines and flat fields, no shadow". Decision 4 removes the overlay shadow and leaves the groove's lit line.
   Failure: every product screen keeps an embossed light edge that the chosen option excludes. The memo also measures white on the new canvas at 1.13, so the line still shows.
   Fix: decide in the specification. Either set light `groove-light` → `clear` (the dark theme already does), list it under decision 11, and update the groove tests. Or keep it, give the reason, and record the call in `decisions.md` as a reading of I5.

9. **Two forbidden rows now pass** (`011-the-brand.md:209`; `contrast.test.ts:318–333`) — on the new palette, dark `destructive` on its 20% tint over `muted` measures 4.62, and dark `success` 4.65 (EXECUTED). The light row is 4.19. The test asserts each row is below 4.5 ("Each must still fail").
   Failure: the forbidden test fails, and decision 10 says only "re-measured". `001` decision 8's ban on state tints on `muted` keeps its measured reason in light, but loses it in dark.
   Fix: say what happens. Recommended: keep the ban as a rule, since it is a structure rule as well as a measure. Keep the light row as the measured witness. Move the two dark rows to a `rule only` list, or drop them with a note, and change the test to "the light row fails; the dark rows are kept by rule". Record the call in `decisions.md`.

10. **Criterion 13's list is short** (`011-the-brand.md:252`) — it lists five kinds of change. A build that meets this specification also changes these tests:
    - `contrast.test.ts`: the forbidden assertion (finding 9), the 21 stage figures and the veil hex `#2A2B2D`, the 6 scrim rows, the 4 navigation pairs, `004`'s ten "still measures" rows, and the 8 tint hexes;
    - `tokens.test.ts:112–135`: the mark geometry (`rise`, `lockupGap`, the new `lockupScale`), the `ink-shadow` / `ink-scrim` hexes, and the light `elevation-line` / `elevation-shadow` mapping;
    - `generated.test.ts:554`, `:647`, `:668`, `:675`: `--radius-pill` and `var(--radius-pill)`;
    - `expressive.spec.ts:99` and `:276`: "a pill under `data-mode=expressive`";
    - `four-dot.spec.ts`: the lockup's dots of 30 px, the 8 px gaps, the 68 px width and the 38 px rise; the `BRAND` and `PAPER` constants; and the `pluto-mark-dock` counts (finding 7);
    - `pages.ts:479–480`, the page grounds;
    - `expressive.spec.ts:152–155` and `:303–332`, ink and blue on the stage;
    - `code.spec.ts:460` and `:493`, the ink surface, now graphite;
    - `registry.test.ts` and `literals.test.ts`, the item and file counts and the L22 list.
    Failure: the reviewer of the built change cannot tell a sanctioned edit from a weakened test.
    Fix: replace the list with these groups, each naming the decision that moves it.

11. **Literals in a component** (`011-the-brand.md:178–179`; constitution §4.3) — `GlassLens` carries its base frequency `0.008 0.012`, its blur `6`, its displacement scale `28` and its seed `7` as attributes. `pointerLight` holds 600 ms in code. The lint cannot see unitless SVG attributes or a number passed to `setTimeout`.
    Failure: a colour or size in a component that is not a token. The blur and the scale are lengths in user space.
    Fix: add `expressive.glass.lens: { frequency: [0.008, 0.012], blur: 6, scale: 28, seed: 7 }`. Emit it as variables, or have the item read it through `read-token`. Have `pointerLight` read `--motion-reveal` (600 ms) through `readToken`, or name a new `expressive.motion.light` token.

12. **The stage does not keep its values** (`011-the-brand.md:107`) — 14 of `stageTable`'s 21 rows move, because `stage-foreground`, `stage-line`, `stage-primary`, `stage-mark-*` and the `input` and `primary-foreground` roles name primitives that change. All 21 still pass (EXECUTED). The stage's literals (`stage-line-strong` `#F7F7F424`, `energized-line` `#7A9BFFB3`, `energized-glow` `#2456E640`) keep the old paper and blue beside the new ones.
    Fix: "The stage's named slots follow the new primitives (its 21 rows re-measured, all pass, lowest `stage-muted` on `bloom-core` 4.79); its literal slots keep the old palette until `012`." List the stage under decision 11, since `0.10.0` composes it.

13. **Three figures** (`011-the-brand.md:136`, `:207`) — white on `#008058` measures 4.96, not 4.97 (the memo's §6.2 says 4.96). Graphite on dark `field-3`, `amber` `#F19E20`, measures 8.45, outside "8.62 to 8.67". The memo measured `#F3A023`. EXECUTED.
    Fix: correct both, and pre-record the alpha-byte glass figures (12.43 / 4.78 / 4.55 light; 12.06 / 5.09 / 6.47 dark), so the landing note has nothing to discover.

14. **The text tones** (`011-the-brand.md:74–77`, `:91`) — B3 says "the four colours take the Deep Field values". Decision 2 darkens Deep Field's `red-text` and `green-text`, and `cyan-text`, by the design lead's measurement. That is likely within the lead's remit, since B3's values fail the tint rows. But it is a departure from an owner's decision, and it is not in `decisions.md`. "The lightest that passes" is also not exact: `#C11E31` (L 0.1249) and `#007351` (L 0.1286) pass every row and are lighter than `#BE1D31` (0.1205) and `#00734F` (0.1283) (EXECUTED).
    Fix: record the three darkened tones in `decisions.md` as a design-lead call under B3, with the failing rows. Either adopt the lighter values or say "a passing value one step darker", not "the lightest".

15. **Unwritten shapes** (decisions 1, 5 and 7–10) — `expressive`'s colour maps are theme-less today. Glass and fields need light and dark values, and `--glass-shadow` is a compound string. The validator requires `display.steps` to be exactly three steps, and `expressive.radius.pill` (`tokens.ts:521`, `:546`). The glass rows name `field-1` … and `glass-tint`, which `semanticName` and `stageName` reject. `stageTable` reads every role in the dark theme, so the glass set needs a theme-aware composite function.
    Fix: give the JSON, for example `expressive.glass: { light: {…}, dark: {…} }` and `expressive.field: { light: { "field-1": ["blue", "raised"], … }, dark: … }`. Give the row schema, for example `contrast.glass: [{ theme, text, over }]`, read against the glass tint of that theme. Say that `pill` leaves the validator.

16. **"Pill" copy outlives the pill** (decision 4a) — after the build, these lines are false:
    - `cta-band.svelte:38–39` ("pills on any ground"), `stage-hero.svelte:58` and `marketing-bar.svelte:47` (comments shipped to apps);
    - `src/routes/(site)/items/cta-band/+page.svelte:18`, `items/stage/+page.svelte:17`, `items/pluto-theme/+page.svelte:644` and `(shell)/view/compositions/stage/+page.svelte:16`.
    Fix: list them in decision 1's scope. Say that `--radius-stage`'s 14 px is H1's one known exception until `012`, in the changelog.

17. **"A light field" in dark** (`011-the-brand.md:176`, `:224`) — in dark, every field is a lifted fill (`#93B0FF`, `#FF9491`, `#F19E20`, `#60C498`), and each is light. The 4.40 figure comes from dark glass over paper `#F3F0E8`. A reviewer applying R25 cannot tell whether dark glass over a dark-theme field is allowed. The rows say it is.
    Fix: "dark glass never over a light-theme ground, a `paper` surface, or the light `foreground`".

18. **Criterion 5's gap** (`011-the-brand.md:244`) — "from the word's last glyph" can mean the text's advance box or the glyph's ink. The lockup's −0.04 em tracking is applied after the last character in Chromium, and the "o" has a side bearing.
    Fix: "from the right edge of a `Range` over the word's text node to the mark's left edge, 10 px ± 0.5". That is the flex gap, as `RISEN.E6`'s `space` is a margin.

19. **Smaller gaps** —
    - (a) `@supports not (backdrop-filter: blur(1px))` is true in Safari 17, which supports only the prefixed form, so its glass is opaque. Write `not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)))`, as the exhibit does (`light-case.svelte:656`).
    - (b) Give the hidden SVG's form: `width="0" height="0" aria-hidden="true"` and a positioning class, never `display: none` and never a `style` attribute (lint).
    - (c) `liquid-glass` needs `registryDependencies: ["pluto-theme"]`, since the `glass` utility lives there.
    - (d) L22's tokeniser reads comments and prose, so `glass`, a common word, fails in a productive item's comment. None today (READ, grep). Say it is accepted, as `bloom`, `rim` and `veil` are.
    - (e) The memo's I5 hairlines (`#D9D3C6`, `#36322A`) are not adopted. `line` stays ink at 10%, which is `#DCDAD3` on the canvas. Say it is deliberate.
    - (f) Decisions 11 to 13 (the changelog's 0.11.0 entry, R25 in `002` decision 9's checklist, the preview's sections, `handoff.md`) have no criterion. Add one, counted: the entry names the four visible changes, plus findings 3 and 12 if kept, and R25 is present.

## Constitution checks

- **§4.1 source, not a package:** holds. `GlassLens` and `pointerLight` run in the app; nothing reaches back. READ.
- **§4.2 driven by need:** holds. The owner's identity decisions are the need. READ.
- **§4.3 tokens are the one source:** the palette, fields, glass, poster and spring are tokens. `GlassLens`'s filter values and the 600 ms are not (finding 11).
- **§4.4 WCAG 2.2 AA, both themes; keyboard:** the token table passes, 98 + 2 exceptions (EXECUTED). Text on glass inside a field and under the lit specular fails (findings 1 and 2). `liquid-glass` has no interactive part. The light is decorative and pointer-only. Keyboard holds.
- **§4.5, §4.6 pinned, named dependencies:** no new package. `liquid-glass` must name `pluto-theme` (finding 19c).
- **§6 never break an installed app silently:** the palette, overlay and lockup changes are listed. The footer endorsement (finding 3) and the stage (finding 12) are not. `.glass` as a global class is named under risks.
- **The owner's decisions:** E6, H1, J4 (dots only), K3, the yellow kept as is, D1, N1 and G5 (left out) are applied. B3 is applied, with three text tones darkened unrecorded (finding 14). I9's "rim highlight" is drawn as an area glow (finding 2). I5's hairline-only edge is not applied to the groove (finding 8).

## Verdict

Does not land yet: findings 1 and 2 (the field's roles leak into its cards and glass, and the specular lies over the glass's text, both below AA), and Mediums 3 to 11, stand.

## Disposition

Checked on 2026-11-07 against the revised specification (337 lines; its "Review dispositions" section) and `decisions.md`, "One release, 0.11.0, and the calls of the `011` and `012` spec reviews". The re-runs were made in the session's scratch folder; nothing in the repository was written but this file.

**Re-ran for the disposition** (EXECUTED):

- **The palette.** The revised primitives, with `red-text` `#C11E31`, `green-text` `#007351` and light `groove-light` → `clear`, went through `contrastTable` and the 114 code-slot rows.
  - `contrastTable`: 100 rows, 98 pass, 2 exceptions, 0 fail.
  - Red on its tint over the canvas measures 4.50, green 4.51, and green on `muted` 4.67.
  - Code slots: 114 of 114 pass; the tightest is still `number` on light `muted` at 4.50.
  - The forbidden light row measures 4.08; the dark pairs measure 4.62 and 4.65. The six scrim rows pass.
- **The new rows.**
  - Dark field legends: `field-1` 8.67, `field-2` 8.67, `field-3` 8.45, `field-4` 8.62.
  - Glass fallback, light: 18.36 / 7.06 / 6.72. Dark (`ink-raised`): 14.42 / 6.08 / 7.74.
  - Dark glass over white: `muted-foreground` 4.21 (by the alpha byte). Over paper: 4.39.
  - The ring on glass is at least 4.55 in light and 6.47 in dark.
- **`surface-plain`.** I compiled with Tailwind 4.3.3: `@apply surface-plain` inside `@utility glass` emits the six role declarations into `.glass`. I then rendered in Chromium, WebKit and Firefox, both themes, inside `field-1`:
  - Text on the field and its link take the legend: white in light, graphite in dark.
  - A `bg-card text-card-foreground surface-plain` card restores its title, description and link. Light: `#0B0F17` / `#505661` / `#2D48D4`, measuring 19.17 / 7.38 / 7.02 on white. Dark: `#F3F0E8` / `#A39D90` / `#93B0FF`, measuring 14.42 / 6.08 / 7.74 on `#221F19`.
  - A glass inside the field restores the same three roles, whose rows measure 12.43 / 4.78 / 4.55 (light) and 12.06 / 5.09 / 6.47 (dark).
- **The masked rim**, in decision 8's declaration order (`mask`, then `-webkit-mask`, then `-webkit-mask-composite`), lit over text:
  - Chromium: composite `xor`; the darkest text pixel stays `#0B0F17`; the rim lights.
  - WebKit: composite `exclude`; the text stays `#0B0F17`.
  - **Firefox: composite `add, add`; the text lightens to `#67696E`.** In Firefox `-webkit-mask` is an alias of `mask`, so the later prefixed shorthand replaces the standard one and drops its `exclude`.
  - With the prefixed pair written first and the standard `mask` last, all three engines keep the text at `#0B0F17` (composite `exclude, add`).
- **The lens.** I wrapped the rule as decision 8 writes it and set `data-glass-lens`, in Chromium.
  - With no preference set: `url("#pluto-glass-lens") blur(16px)`.
  - Reduced transparency through CDP: `none`, background `rgb(251, 250, 246)`.
  - `forcedColors: "active"`: `none`, border `rgb(0, 0, 0)`.
  - Reduced motion: `blur(16px)`.
- **The tests the list must name** (READ): `read-token.ts` exports `readDuration`. `tests/unit/generated.test.ts:382–480` pins `@keyframes pluto-mark-dock`, `mark-entrance`'s animation shorthand and `mark-reveal`'s transition.

**Each finding.**

1. **Closed.** The field sets `--primary` and `--ring` as well. The `--surface-*` copies and `surface-plain` restore the roles for a card and for glass, in both themes and in three engines (EXECUTED). Criterion 11 checks it. The remaining risk, a surface that forgets `surface-plain`, is named under Risks, with `012` as its guard.
2. **Standing in Firefox.** The mask works in Chromium and WebKit. The dark `#FFFFFF33` lies on the 1 px rim only, with no text under it. In Firefox the `-webkit-mask` written after `mask` undoes the mask, and the lit glow covers the text (darkest pixel `#67696E`; finding 2's 1.74–2.90 returns). Fix: write `-webkit-mask` and `-webkit-mask-composite: xor` first and the standard `mask: … exclude` last (EXECUTED in all three engines). In criterion 10, assert that the computed `mask-composite`'s first entry is `exclude` (or `xor`), not just that the mask is not `none`.
3. **Closed.** The endorsement follows the lockup, decision 12 lists it, and criterion 5 measures it.
4. **Closed.** The wrapped lens rule yields to every preference (EXECUTED). Criterion 9 is runnable as written.
5. **Closed.** L24 is one counted allowance, with a passing and a failing sample.
6. **Closed.** Criterion 4 reads the two box-shadow layers and adds the groove.
7. **Closed in substance; one clause stands.** The two keyframes with longhand timing, the reveal's two-item list and the counts in criterion 6 are right. Decision 10's last line says "the reveal's spring entry falls back to `ease`". An unsupported `linear()` inside a `var()` invalidates the whole `transition-timing-function` at computed-value time, so both entries fall back to `ease`. Fix: "the reveal eases both properties with `ease`".
8. **Closed.** Light `groove-light` → `clear`, recorded in `decisions.md`, listed in decision 12, and checked by criterion 4.
9. **Closed.** The ban stays by rule. The light row is the witness at 4.08 (EXECUTED), and the dark pairs are `ruleOnly`.
10. **Standing in part.** Criterion 15's `generated.test.ts` group names `--radius-pill`, the variable list and the colour fixtures. It leaves out the tests decision 10 moves (`generated.test.ts:382–480`: the `pluto-mark-dock` keyframes, `mark-entrance`'s shorthand, `mark-reveal`'s transition) and the new plain rules (the glass fallbacks, the lens media query, the dark expressive mark). Fix: add "`generated.test.ts`: the mark's keyframes and the two motion utilities (decision 10); the theme's plain rules and media blocks (decisions 3, 8)".
11. **Closed.** `expressive.glass.lens` and `expressive.motion.light` are tokens. `readToken` and `readDuration` exist (READ).
12. **Closed.** The stage's re-measure is stated, and `012` removes the stage in the same release.
13. **Standing.** Four figures are still off. Decision 11 gives dark `field-2` 8.62 and `field-4` 8.64; they measure 8.67 and 8.62. The glass fallback's light rows read 7.07 and 6.73; they measure 7.06 and 6.72, and its dark rows are not given (14.42 / 6.08 / 7.74). Decision 8 gives dark glass over white 4.22; by the alpha byte it measures 4.21 (EXECUTED). Several of these are attributed "EXECUTED by the reviewer(s)". This review measured the dark fields and none of the fallback rows. Fix: correct the figures and their attributions.
14. **Closed.** The tones are recorded in `decisions.md`. `#C11E31` and `#007351` pass every row at 4.50 and 4.51 (EXECUTED), and the text no longer claims the lightest value.
15. **Closed.** Every shape is written, including the `field` and `glass` row schemas.
16. **Closed.** The "pill" lines are in scope, and `--radius-stage` is named as H1's one exception until `012`.
17. **Closed.** R25 names light-theme grounds, `paper`, `raised` and images.
18. **Closed.** Criterion 5 measures from a `Range`.
19. **Closed.** (a) the prefixed `@supports`; (b) the SVG's form; (c) `pluto-theme` and `read-token`; (d) accepted under Risks; (e) explained in decision 2; (f) criterion 14.

**New in the revision** (Low, INFERRED from the cascade):

- **N1.** A field on the element that carries `.dark` loses its roles. `.dark` is unlayered and sets `--foreground`, which beats the layered `field-N` on the same element. That is the lesson recorded for `surface-ink` at `build-tokens.ts:323–325`. So `<section class="dark field-1">` draws paper on lifted blue. Fix: "a field never shares an element with `.dark`; set the theme on a wrapper", or emit the field's role overrides as plain rules, as `surface-ink` does. Add it to R25.
- **N2.** Decision 3 gives the dark mark the lifted four under `.dark [data-mode="expressive"]`, with specificity (0,2,0). Nothing resets `--mark-*` for a `data-mode="productive"` island inside it, so a product-screen mark there turns coloured. That is against `008` and `009`'s rule that a productive island stays productive. Fix: add `.dark [data-mode="productive"], [data-mode="productive"].dark { --mark-1 … --mark-4: paper }` after the expressive rule. Extend criterion 12 to the island.

**Second check** (2026-11-07; READ, the revised specification). Only the items that stood were checked.

- **Finding 2: closed.** Decision 8 now writes `-webkit-mask` and `-webkit-mask-composite: xor` first and the standard `mask: … exclude` last. That is the order that kept the text at `#0B0F17` in Chromium, WebKit and Firefox (EXECUTED in the first check). The criterion 10 tightening I suggested was not applied, and it is not needed: Chromium computes a working mask in either order, so a Chromium test could not tell the two apart.
- **Finding 7: closed.** Decision 10's support note now says the reveal's whole timing list is invalid at computed-value time, so both entries fall back to `ease`.
- **Finding 10: closed.** Criterion 15 names `generated.test.ts`'s mark keyframes (`pluto-mark-dock`, `pluto-mark-fade`), `mark-entrance`'s two animations and `mark-reveal`'s timing list (decision 10). It also names the new plain rules: the glass fallbacks, the wrapped lens rule, and the expressive and productive mark rules (decisions 3 and 8).
- **Finding 13: closed.** The figures now read as measured: dark `field-2` 8.67 and `field-4` 8.62; the glass fallback light 18.36 / 7.06 / 6.72 and dark 14.42 / 6.08 / 7.74; dark glass over white 4.21. The rows this review did not measure are attributed to "the spec reviews", not to this reviewer.
- **N1: closed.** Decision 6 and R25 say a field never shares an element with `.dark`, and that the theme is set on `html` or a wrapper.
- **N2: closed.** Decision 3 prints `.dark [data-mode="productive"], [data-mode="productive"].dark` with the marks back to `paper`, after the expressive rule. It has the same specificity, so it wins by order. Criterion 12 checks the island.

**Verdict as it stands:** Fit to build. Every finding is closed or answered in the revised specification.
