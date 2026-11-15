# 016 — The brand yellow

- **Status:** built and reviewed, 2026-11-15, committed on `release/0.12.0` over `4822ae5` (`013`) at 0.12.0. Change review: [`../reviews/016-the-brand-yellow-pr-2026-11-15.md`](../reviews/016-the-brand-yellow-pr-2026-11-15.md) (0 High, 0 Medium, 2 Low, both fixed in the changelog by the design lead). Fit to build after its specification review, [`../reviews/016-the-brand-yellow-spec-2026-11-14.md`](../reviews/016-the-brand-yellow-spec-2026-11-14.md). Not tagged: `v0.12.0` follows the change reviews of `015` and `017` (decision 9).
- **Date:** 2026-11-14
- **Author:** the design lead
- **Kind:** a token change to `pluto-theme`. The brand's yellow becomes `#E2B000` in light and `#F8D874` in dark, in place of amber `#F19E20` in both. A text shade, `#806200`, gets a role of its own, `caution-text`. The primitives are renamed from `amber` to `yellow`. Copy, tests, and lines in the one 0.12.0 changelog entry. Not an interface change: no name an app reads is renamed or removed (decision 2).
- **Depends on:** [`014`](./014-the-white-light-mode-code-ground.md) (landed, and committed on `release/0.12.0`; it moved the tree to 0.12.0, and this specification builds on the token file as it left it: 35 primitives, 55 theme roles, 30 `contrast.text` pairs, READ) and [`013`](./013-code-highlighted-by-tree-sitter-in-meridian-roles.md) (final; it removes `amber-text` and `syntax-amber`). This specification is built after both (decision 9). Through them, `v0.11.0`'s [`011`](./011-the-brand.md) (the four colours, the fields, the glass, the dark expressive marks).
- **Ships with:** `013`, `014` and the design site's two specifications, [`015`](./015-the-design-site.md) and [`017`](./017-the-design-site-start-brand-and-foundations.md), as one release, 0.12.0, with one changelog entry (`decisions.md`, "One release, 0.12.0, for the white ground and tree-sitter"; "A public design site, the workbench dropped, and properties under Meridian").
- **Blocks:** `015`'s build (`015` decision 3), which starts when `013` and this specification are built and their change reviews dispositioned; and through it `017`. `015`'s checkpoint 0, which runs before this specification exists, uses decision 1's values in its scratch stylesheet (decision 9).
- **Revised** 2026-11-14 after its specification review, [`../reviews/016-the-brand-yellow-spec-2026-11-14.md`](../reviews/016-the-brand-yellow-spec-2026-11-14.md) (2 Medium, 5 Low); each finding is answered under "Review dispositions".
- **Design calls:** `../decisions.md`, 2026-11-14, "A yellower yellow, in code and in the brand" (its second bullet). It supersedes, for the yellow alone, 2026-11-06's "One yellow, Deep Field's `#F19E20`, everywhere, with no adjustment". 2026-11-06's "The mark is a logo, exempt from the 3:1 graphic rule" still holds.
- **Research it stands on:** the owner's comparison recorded in that entry (five steps from Sun to Gold; four dark yellows beside the lifted blue, red and green), and the measurements below. No memo was written: the owner chose the values on a board, and this specification measures them through every table that holds the yellow.
- **Measurements made for this specification** are labelled **EXECUTED (016)**. They ran on 2026-11-14, with this repository's `scripts/contrast.ts` (`contrastRatio`, `compositeAlphaByte`, `deltaE`, `contrastTable`, `fieldRows`, `glassRows`, `glassOverGlassRows`, `glassFallbackRows`, `glassRingRows`, `forbiddenRows`, `scrimRows`), `scripts/tokens.ts`'s `validateTokens`, and `src/lib/workbench/palette.ts`'s `oklch` and `fromOklch`, imported by absolute path. The token file was the working tree's, with `014`'s change in it, and was re-read once `014` landed: the yellow's entries are unchanged by `014`, so every figure stands. Decision 1's change was applied to a copy in memory. Nothing in the repository was written.

## Intent

The owner: "the yellow needs to change, it needs to be more yellow and improve contrast on both white and dark", then: "I meant the brand yellow too." Shown five yellows, the owner chose `#E2B000` for light and the soft `#F8D874` for dark, "slightly more white like the other colors".

Today the brand has one yellow, amber `#F19E20` (OKLCH hue 70), in both themes. It is orange beside the other three. In dark it is not lifted the way blue, red and green are.

This specification puts the new yellow wherever the brand's yellow appears: the mark's third dot, the third field, the third chart colour and the caution fill. It gives yellow text a shade at the same hue that is no weaker than today's `amber-text`. It renames the primitives so the token file says yellow.

**Terms of art.**

- The **brand yellow** is the third of the four colours of the mark. A **fill** is a colour used as a background, with text in its legend on it. A **text shade** is a darker colour of the same hue, used for text.
- **OKLCH** gives a colour's lightness, chroma (colourfulness) and hue. **ΔE** is the OKLab distance × 100 (`deltaE`).
- **Lifted** names the dark theme's tone of a brand colour: lighter and a little softer, so it reads on graphite (`blue-lifted`, `red-lifted`, `green-lifted`).

**Not here:** the syntax yellow, which is `013`'s (`code-yellow`, `#6C5A00` / `#E5CD72`); blue, red and green; the dark product mark, which stays paper (`008`); the design site, which is `015`'s; the identity exhibit, which `015` removes.

## Decisions

### 1. The values

| Primitive | Hex | OKLCH (L, C, h) | Replaces |
|---|---|---|---|
| `yellow` | `#E2B000` | 0.781, 0.160, 88.0 | `amber`, `#F19E20` (0.764, 0.158, 70.2), in light |
| `yellow-lifted` | `#F8D874` | 0.889, 0.125, 92.0 | `amber`, in dark |
| `yellow-text` | `#806200` | 0.512, 0.105, 87.6 | the text shade; see decision 3 |

All EXECUTED (016). `yellow` and `yellow-lifted` are the owner's. The dark chroma, 0.125, sits with the other lifted colours: `blue-lifted` 0.118, `red-lifted` 0.129, `green-lifted` 0.115.

**The theme roles:**

| Role | Light | Dark | Was |
|---|---|---|---|
| `mark-3` | `yellow` | `paper` (unchanged, `008`) | light `amber` |
| `chart-3` | `yellow` | `yellow-lifted` | `amber` in both |
| `caution` | `yellow` | `yellow-lifted` | `amber` in both |
| `caution-foreground` | `ink` (unchanged) | `ink` (unchanged) | |
| `caution-text` (new) | `yellow-text` | `yellow-lifted` | |

**The expressive tokens:**

- `expressive.field.light["field-3"]`: `["yellow", "ink"]` (was `["amber", "ink"]`).
- `expressive.field.dark["field-3"]`: `["yellow-lifted", "graphite"]` (was `["amber", "graphite"]`).
- `build-tokens.ts`'s `EXPRESSIVE_DARK_MARKS`, the mark's four dots on a dark expressive ground: `["blue-lifted", "red-lifted", "yellow-lifted", "green-lifted"]` (was `amber` third).
- The glass's own tokens name no yellow and do not change. Glass over `field-3` is measured again (decision 5).

**The contrast lists:** `contrast.text` gains `["caution-text", "background"]`, `["caution-text", "card"]` and `["caution-text", "muted"]`, as `destructive` and `success` have. The two light `chart-3` exceptions stay, and their `why` reads "yellow series are labelled directly (the design book §03; WCAG 1.4.11)".

### 2. The primitives are renamed `amber` → `yellow`, and nothing an app reads changes name

- **READ** (`scripts/build-tokens.ts`, `colours()`; `registry.json`'s `pluto-theme`): an app receives the theme roles and the fields as `--<role>: <hex>`, never a primitive's name. `--chart-3`, `--caution`, `--caution-foreground`, `--mark-3`, `--field-3` and `--field-3-foreground` keep their names and take new values.
- So the rename breaks no installed app (constitution §6). It costs only this repository's tests and comments, which this specification changes.
- _Why rename at all:_ the colour is no longer amber. `#E2B000` sits at hue 88; amber sat at hue 70. The primitives then follow the other three, `blue`, `red`, `green`, with `-lifted` for dark and `-text` for text, as `red-text` and `green-text` do.
- _Why not `amber-lifted`:_ it would keep a name that no longer describes the colour, in the file that is the one source (constitution §4.3).
- **The one app-facing `amber` name** is `syntax-amber`, with its `text-syntax-amber` utility. `013` removes it in the same release. This specification does not touch it.
- **`013`'s `code-yellow` and `code-yellow-lifted` stay distinct.** They are code's own colours, with a `code-` prefix, which `013` chose so code never shares a name with the brand. The two families differ in value too: light `#806200` (text shade) against `#6C5A00`, ΔE 4.4, hue 88 against 95.5; dark `#F8D874` against `#E5CD72`, ΔE 4.1 (EXECUTED (016)). Each hex is written once (`tokens.test.ts`, "writes each hex once"). They never sit on the same surface: one is code on the code ground, the other the brand's fill and mark.

### 3. The text shade: `#806200`, the lightest at hue 88 that loses nothing to `amber-text`

The owner: its text shade "must not lose contrast against today's `amber-text`". `amber-text` is `#915B00` (hue 70): **4.98** on paper, **5.67** on white, 4.51 on `muted` (EXECUTED (016)).

Searching OKLCH lightness downward at hue 88, at the most chroma sRGB allows, the first colour that meets both figures is **`#806200`** (L 0.512, C 0.105, h 87.6 after rounding to sRGB):

| | On paper `#F3F0E8` | On white | On `muted` `#E9E5DB` |
|---|---|---|---|
| `amber-text`, today | 4.98 | 5.67 | 4.51 |
| **`yellow-text`, `#806200`** | **5.03** | **5.73** | **4.55** |
| one step darker, `#7C5F00` (L 0.501) | 5.27 | 6.01 | 4.77 |

All EXECUTED (016). `#806200` gains on every ground, and stays as yellow as it can. The step darker was weighed and not taken: it would read browner for 0.24 more contrast that no row needs.

**It gets a role, `caution-text`,** light `yellow-text`, dark `yellow-lifted`.

- _The need:_ the owner asked for the shade ("Its text shade must not lose contrast against today's `amber-text`"). Once `013` removes `amber-text`, the brand has no yellow an app may set as text, while it has one for red (`destructive`) and green (`success`). A primitive no role names is dead data, which an app never receives; `013` removes nine such primitives. A role makes the shade reachable and measured.
- _Its user in 0.12.0:_ no item uses it. `017`'s `/foundations/colour/` page renders the theme's roles from the token file, so it documents `caution-text` beside `caution` for apps (`017` decision 6). The first item that needs yellow text uses it; that item's specification names it.
- _Why this name:_ the family elsewhere is a colour (`destructive`, `success`), its `-fill` and its `-foreground`. Here the base name, `caution`, is already the fill, and renaming it would rename a role apps read (constitution §6). So the text shade cannot take the base name. `caution-text` is the name left, with a suffix no other role uses; it says what it is for. An app writes `text-caution-text`.
- _It is permanent once shipped:_ removing or renaming it later is an interface change. That is accepted: the owner asked for the shade, and a role is the only way an app can use it.
- `caution` stays the fill, with `caution-foreground` on it, as today. No item uses `caution-text` yet; the badge and the alert keep their fill and bar (decision 6).
- In dark, `yellow-lifted` is text-safe, as `red-lifted` is for `destructive`: 13.20 on graphite, 11.78 on `card`, 10.51 on `muted`.

### 4. "Amber is never text", restated

The design book's rule becomes: **in light, the brand yellow is never text.** It is a fill and a mark. Yellow text takes `caution-text`. In dark, the lifted yellow is text-safe, as every lifted colour is, and it is `caution-text` there.

_Why:_ `#E2B000` reads 1.76 on paper and 2.01 on white (EXECUTED (016)). No size of text passes there. The badge comment that cites the rule says it in these words (decision 6).

### 5. Contrast: every table that holds the yellow, both themes

Decision 1 applied to the token file, through `validateTokens` (it validates) and every table `scripts/contrast.ts` builds (EXECUTED (016)):

**`contrastTable`:** 116 rows (was 110 on `014`'s file): 114 pass, the 2 recorded exceptions, 0 fail.

| Row | Light | Dark |
|---|---|---|
| `caution-foreground` (ink) on `caution` | 8.81 → **9.53** | 8.81 → **13.75** |
| `caution-text` on `background` / `card` / `muted` (new) | 5.03 / 5.73 / 4.55 | 13.20 / 11.78 / 10.51 |
| `chart-3` on `background` (non-text, 3:1) | 1.91 → 1.76, **exception** (labelled directly) | 8.45 → 13.20 |
| `chart-3` on `card` | 2.17 → 2.01, **exception** | 7.55 → 11.78 |

**The fields** (`fieldRows`, 16 of 16 pass): the `field-3` legend on its fill, as text (4.5) and as a ring (3): light ink on `#E2B000`, 8.81 → **9.53**; dark graphite on `#F8D874`, 8.45 → **13.20**.

**The glass over `field-3`** (every other row is unchanged):

| Row | Light | Dark |
|---|---|---|
| `foreground` on glass over `field-3` | 15.32 → 15.52 | 12.18 → 10.90 |
| `muted-foreground` on glass over `field-3` | 5.89 → 5.97 | 5.14 → **4.60**, the tightest glass row |
| `primary` on glass over `field-3` | 5.61 → 5.68 | 6.53 → 5.85 |
| the ring on glass over `field-3` (3:1) | 5.61 → 5.68 | 6.53 → 5.85 |
| `foreground` on glass over glass over `field-3` | 16.58 → 16.68 | 15.53 → 15.40 |
| `primary` on glass over glass over `field-3` | 6.07 → 6.11 | 8.33 → 8.26 |

33 of 33 glass rows, 20 of 20 glass-over-glass, 11 of 11 ring rows pass. The glass fallback (6), forbidden (3) and scrim (6) rows name no yellow and are unchanged.

_The dark glass row falls:_ the lifted yellow is lighter than amber, so dark glass over it is lighter, and muted text on it reads 4.60. That still passes.

**`chart-3` against its neighbours** (ΔE; EXECUTED (016)):

| | `chart-1` | `chart-2` | `chart-4` | `chart-5` |
|---|---|---|---|---|
| Light, new (was) | 48.1 (46.6) | 31.2 (27.0) | 30.3 (30.7) | 37.5 (35.9) |
| Dark, new (was) | 27.2 (27.3) | **18.3 (12.1)** | 19.8 (20.0) | 21.9 (15.4) |
| Light, under protanopia · deuteranopia | 41.8 · 47.7 | 33.7 · 24.4 | 21.9 · 29.3 | 34.2 · 38.5 |
| Dark, under protanopia · deuteranopia | 25.3 · 28.2 | 17.9 · 12.8 | **12.1** · 18.0 | 20.9 · 22.4 |

The colour-vision rows use the published full-severity matrices (Machado, Oliveira and Fernandes, 2009) in linear RGB, the ones the workbench used. The new yellow is further from red in dark (12.1 → 18.3) and no pair falls more than 0.4. The tightest pair is dark yellow against green under protanopia, 12.1, the same as today.

**Light caution's non-text uses** (recorded, not gated; EXECUTED (016)):

- the `alert`'s caution bar (`border-l-caution`) on a light card: 2.17 → **2.01**;
- the caution `badge`'s fill against the light page: 1.91 → **1.76**; its ink text on the fill is the 9.53 row above.

Neither needs 3:1. WCAG 1.4.11 asks 3:1 of what is needed to identify a component or its state. Here the state is named in words: the alert's title, the badge's text. 2026-11-06's ruling on §4.4 says the same: where yellow carries meaning on a light ground, colour is never the only signal. In dark both read 11.78 (bar on `card`) and 13.20 (fill on graphite).

**The mark** (the logo, exempt from 3:1; recorded, not gated):

- **Light**, the third dot on paper 1.76 (was 1.91) and on white 2.01 (was 2.17). The owner chose it knowing the figure, beside the logo yellows of other marks at about 1.7.
- **Dark product screens:** the mark is paper (`008`). Unchanged.
- **Dark expressive grounds:** the third dot on graphite 13.20 (was 8.45).
- **On each field:**

  | The yellow dot on | `field-1` | `field-2` | `field-3` | `field-4` |
  |---|---|---|---|---|
  | Light (ratio / ΔE) | 3.49 / 48.1 | 2.79 / 31.2 | **1.00 / 0.0** | 2.46 / 30.3 |
  | Dark | 1.52 / 27.2 | 1.52 / 18.3 | **1.00 / 0.0** | 1.53 / 19.8 |

  On its own field the yellow dot vanishes, as amber did on amber's field. **The four-colour mark is not set directly on a colour field.** On a field it sits on glass or a `surface-plain` card. Over glass on each field the dot keeps ΔE 18.1 or more in light and 57.1 or more in dark (EXECUTED (016)). This is a record for `015`, whose direction B puts the four colours on big fields. How the site shows its mark there is `015`'s to design.

### 6. Every place amber and amber-text are used, and what each becomes

Found by grep over the tree (READ, 2026-11-14), on top of `014`'s change and before `013`'s:

| Where | Today | After `013` | After this specification |
|---|---|---|---|
| `tokens/pluto.tokens.json`, primitives | `amber`, `amber-text` | `amber` (013 removes `amber-text`) | `yellow`, `yellow-lifted`, `yellow-text` |
| light `chart-3`, `caution`, `mark-3` | `amber` | the same | `yellow` |
| dark `chart-3`, `caution` | `amber` | the same | `yellow-lifted` |
| `syntax-amber` (light `amber-text`, dark `amber`) | the code `function` slot | **removed by `013`** | — |
| `expressive.field` `field-3` | `amber` in both | the same | decision 1 |
| `contrast.exceptions` `why` | "amber series …" | the same | "yellow series …" |
| `scripts/build-tokens.ts` `EXPRESSIVE_DARK_MARKS`, and its comment on the mark's entrance ("amber from the upper left") | `amber` | the same | `yellow-lifted`; "yellow from the upper left" |
| `scripts/lint-literals.ts` L19's pattern | holds `amber` | the same (013 keeps the stale name, so a left-over `syntax-amber` is caught) | unchanged |
| `badge.svelte` comment | "a solid amber fill with ink text, because amber is never text" | the same | "a solid yellow fill with ink text, because the brand yellow is never text in light" |
| `product-home` block comment | "blue in the hero, amber for the proof" | the same | "yellow for the proof" |
| Item pages: `alert` ("an amber bar"), `badge` ("solid amber"), `chart` ("(amber)"), `product-home` ("proof on amber"), `pluto-theme` ("Amber is the one known exception: an amber series is labelled directly") | | the same | "yellow" in each: "Yellow is the one known exception: a yellow series is labelled directly" |
| `marketing-bar` item page: "On its glass over another glass over any field they measure at least 15.53:1 and 5.98:1" | | the same | "at least 15.40:1 and 5.98:1": the dark `foreground` row over the yellow field becomes the lowest (decision 5). This specification's builder changes it. |
| `src/app.css` | `#f19e20`, `#915b00` and `--syntax-amber` (written by `build-tokens`) | `#915b00` and `--syntax-amber` gone | rewritten by `build:tokens`; no `amber` and no old hex |
| `src/lib/identity/` (the exhibit's data) | amber hexes as research record | the same | **untouched**: `015` removes the exhibit; its record stays in `context/` |
| The workbench | `syntax-amber` swatches | **removed by `013`** | — |

Nothing else names amber, `#F19E20` or `#915B00` in an item, the theme, the registry or a page.

**The figure sweep.** A name sweep misses a figure that moves. Every figure decision 5 changes was grepped across `src/` and `tests/` (EXECUTED (016), `grep -F`, the identity exhibit and the test fixtures left out). The hits, each changed by this specification's builder:

| Old figure | Where | New |
|---|---|---|
| 8.81 | `contrast.test.ts` `LIGHT` and `DARK` tables, `caution-foreground on caution` (two rows); the field-legend test, light `field-3` | 9.53 (light), 13.75 (dark caution); 9.53 (field) |
| 8.45 | `contrast.test.ts` `DARK`, `chart-3 on background`; the field-legend test, dark `field-3` | 13.20; 13.20 |
| 1.91, 2.17 | `contrast.test.ts` `LIGHT`, the two `chart-3` exceptions | 1.76, 2.01 |
| 7.55 | `contrast.test.ts` `DARK`, `chart-3 on card` | 11.78 |
| 12.06, 5.09, 6.47 | `contrast.test.ts`, the glass set's "the lowest %s %s row", dark `foreground`, `muted-foreground`, `primary` | 10.90, 4.60, 5.85 |
| 15.53, 8.33 | `contrast.test.ts`, the glass-over-glass set's "lowest over a field", dark `foreground`, `primary` | 15.40, 8.26 |
| 15.53 | the `marketing-bar` item page (row above) | 15.40 |

Other hits of the same numbers belong to other rows and do not move (`success` over a card 5.09; `destructive-fill`, `chart-2` and `field-2` 5.61). The Landing notes record the sweep as run at the build.

**Items whose look changes and whose source does not:** `four-dot` (its third dot reads `bg-mark-3`), `badge` and `alert` (caution), `chart` (series 3), `stage`, `stage-hero`, `product-home` (`field-3`). Each reads the roles; none changes but for the two comments above.

### 7. Dark mode

Today amber is the same hex in both themes. After this change dark has its own yellow, `yellow-lifted`, through the theme: dark `chart-3`, `caution` and `caution-text` name it; dark `field-3`'s fill is it; the dark expressive mark's third dot is it. The dark product mark stays paper. Every dark row in decision 5 passes; the tightest is muted text on dark glass over `field-3`, 4.60.

### 8. The changelog: lines in the one 0.12.0 entry

The entry is `014`'s, shared by `013`, `014`, `015` and this specification (`014` decision 12). This specification adds:

- **To the summary,** after `014`'s line: "The brand's yellow is yellower and lifted in dark: `#E2B000` in light, `#F8D874` in dark, in place of `#F19E20`."
- **To the one `pluto-theme` bullet,** after `013`'s and `014`'s sentences, these words:

  > The brand yellow is `#E2B000` in light and `#F8D874` in dark, in place of `#F19E20` in both: the mark's third dot (`--mark-3`), `field-3`, `--chart-3` and the `--caution` fill, with ink on it (9.53:1 light, 13.75:1 dark). A new role, `--caution-text` (`#806200` light, `#F8D874` dark), is the yellow for text, 4.5:1 or more on the page, a card and `muted`. In light `--chart-3` stays under 3:1 on the page and on cards (1.76, 2.01) and is labelled directly, as before. No name changes.

- No bullet of its own: no item's source changes but for two comments (decision 6). The bullet is already marked **interface change** by `013`'s part; this part adds one name and renames none.

### 9. Build order, and the fit with `013`, `014` and `015`

**014 → 013 → 016, before `015`'s first checkpoint.**

- _After `014`:_ `014` is being built now and edits the token file and its tests. Two builds in the same file at once would conflict.
- _After `013`, not before:_ `013` is final, and it removes `amber-text` and `syntax-amber`, the only light use of `amber-text` and the code use of dark `amber`. Built after it, this specification touches only the brand's roles, and `013` needs no change. Built before it, dark `syntax-amber` would have to keep a primitive at `#F19E20`, which `013` does not remove; `013`'s counts would be wrong.
- _Before `015`'s build, with `015`'s checkpoint 0 on these values:_ `015` decision 3 starts its build only when `013` and this specification are built and their change reviews dispositioned. Its checkpoint 0 runs earlier, alongside `013`, on throwaway pages outside the tree that read the built stylesheet, where the yellow is still amber. So checkpoint 0's scratch stylesheet sets decision 1's values itself, in the scratch pages only: light `--mark-3`, `--field-3`, `--chart-3` and `--caution` at `#E2B000`, and `--field-3-foreground` ink; dark `--field-3`, `--chart-3` and `--caution` at `#F8D874`, `--field-3-foreground` graphite, and the dark expressive `--mark-3` at `#F8D874`. `015` already says so ("with `016`'s yellow values set in the scratch page's own stylesheet until `016` lands", READ, `015` decision 3), and this specification asks that its checkpoint 0 step name these variables. The four doors and the Google-echo risk are then judged on the new yellow. `015`'s checkpoint 1, in the tree, judges them on the landed tokens.
- `015` and `017` read the yellow from the token file and pin no hex of it (READ, `015` decision 5: "no test of this specification pins a hex").
- **Counts are deltas over `013`'s landed token file:** primitives −1 (`amber`) +3 (`yellow`, `yellow-lifted`, `yellow-text`), so **+2** (46 → 48 on `013`'s figures); theme roles **+1** (`caution-text`; 60 → 61). Build step 1 re-derives the absolute figures from the file `013` lands and writes them into the Landing notes.
- **The version** is already 0.12.0 (`014` decision 13). There is no bump. **The tag**, `v0.12.0`, comes once, after the change reviews of `013`, `014` (done), `015`, this specification and `017`.

## Design

### The token file, after `013`

```jsonc
// primitives: "amber" removed; added
"yellow": "#E2B000",
"yellow-lifted": "#F8D874",
"yellow-text": "#806200",
// themes.light
"chart-3": "yellow", "caution": "yellow", "mark-3": "yellow", "caution-text": "yellow-text",
// themes.dark
"chart-3": "yellow-lifted", "caution": "yellow-lifted", "caution-text": "yellow-lifted",
// expressive.field
"light": { "field-3": ["yellow", "ink"] }, "dark": { "field-3": ["yellow-lifted", "graphite"] },
// contrast.text, appended
["caution-text", "background"], ["caution-text", "card"], ["caution-text", "muted"],
// contrast.exceptions[*].why
"yellow series are labelled directly (the design book §03; WCAG 1.4.11)"
```

`caution-text` sits after `caution-foreground` in each theme.

### The emission

No new logic. `colours()` emits `--caution-text`, and `@theme inline` gains `--color-caution-text`. The fields emit `--field-3` and `--field-3-foreground` from their pairs. The dark expressive rule emits `--mark-3: #F8D874` from `EXPRESSIVE_DARK_MARKS`.

## Scope

**In:**

- `tokens/pluto.tokens.json` (decision 1); `scripts/build-tokens.ts` (`EXPRESSIVE_DARK_MARKS` and its comment).
- The two comments and the five page texts of decision 6.
- `registry.json` and `static/r/`, regenerated.
- `CHANGELOG.md`: decision 8's lines.
- The tests in criterion 11's list.

**Out:**

- `013`'s syntax yellow and its removals; blue, red and green; the dark product mark (`008`).
- Any item's markup or props.
- The identity exhibit (`015` removes it) and the workbench (`013` removes it).
- How the design site sets its mark and fields (`015`).
- The version bump (already done) and the tag (decision 9).

## Acceptance criteria

1. **Tokens.** `bun run build:tokens`, run twice, changes 0 files the second time. `tokens.test.ts`: no primitive or theme role is named `amber`; `yellow` is `#E2B000`, `yellow-lifted` `#F8D874`, `yellow-text` `#806200`; primitives and theme roles are `013`'s landed counts +2 and +1, the same names in both themes; each hex is written once; light `chart-3`, `caution` and `mark-3` name `yellow`; dark `chart-3` and `caution` name `yellow-lifted`; `caution-text` names `yellow-text` and `yellow-lifted`; dark `mark-3` names `paper`; `caution-foreground` names `ink` in both; the fields are decision 1's. (unit)
2. **The hues.** A test imports `oklch` from `tests/helpers/colour.ts`, where `013` moves it when it removes the workbench (`013` decision 18); `deltaE` and `mix` stay in `scripts/contrast.ts`, where `014` put them. No test of this specification writes a copy: `yellow` at hue 88.0 ± 0.5; `yellow-text` at 87.6 ± 0.5; `yellow-lifted`'s chroma 0.125 ± 0.005. (unit)
3. **The text shade loses nothing.** `yellow-text` on paper 5.03 (≥ 4.98, `amber-text`'s), on white 5.73 (≥ 5.67), on `muted` 4.55 (≥ 4.51). Its ΔE from `code-yellow` is 3.0 or more (4.4), and from `yellow` 27.4. (unit)
4. **The theme table.** `contrastTable` over both themes: `013`'s landed count + 6 rows; 0 fail; exactly the 2 recorded exceptions, light `chart-3` on `background` 1.76 and on `card` 2.01, each with the "yellow series" reason; `caution-foreground` on `caution` 9.53 and 13.75; `caution-text` light 5.03, 5.73, 4.55 and dark 13.20, 11.78, 10.51; dark `chart-3` 13.20 and 11.78. (unit)
5. **The fields and the glass.** `fieldRows` 16 of 16 pass, `field-3`'s legend 9.53 (light) and 13.20 (dark) as text and as a ring. `glassRows` 33 of 33, with decision 5's six `field-3` figures; `glassOverGlassRows` 20 of 20, with its four; `glassRingRows` 11 of 11, with its two; `glassFallbackRows` 6, `forbiddenRows` 3 and `scrimRows` 6, unchanged. (unit)
6. **`chart-3` against its neighbours.** ΔE from `chart-1`, `chart-2`, `chart-4` and `chart-5`: 18.0 or more in both themes (lowest dark `chart-2`, 18.3); under protanopia and deuteranopia, 12.0 or more (lowest dark `chart-4` under protanopia, 12.1). The colour-vision matrices come from `tests/helpers/colour.ts` (`013` decision 18) and `deltaE` from `scripts/contrast.ts`. (unit)
7. **Emission.** `generated.test.ts`: `cssVars.light` holds `--chart-3`, `--caution` and `--mark-3` at `#E2B000` and `--caution-text` at `#806200`; `cssVars.dark` holds `--chart-3`, `--caution` and `--caution-text` at `#F8D874` and `--mark-3` at `#F3F0E8`; `@theme inline` holds `--color-caution-text`; `--field-3` reads `#E2B000` and `#F8D874`, `--field-3-foreground` ink and graphite; the dark expressive rule's `--mark-3` is `#F8D874`. The v0.8.0 guard gains `MOVED_016`: `:root` `--chart-3`, `--caution`, `--mark-3` at `#e2b000`; `.dark` `--chart-3`, `--caution` at `#f8d874`; each already listed by `MOVED_011`, and spread after it. (unit)
8. **In the browser.** In each of 2 themes:
   - `four-dot.spec.ts`: the mark's third dot computes `rgb(226, 176, 0)` in light and paper on dark product screens; under `data-mode="expressive"` in dark, `rgb(248, 216, 116)`;
   - `on-brand.spec.ts`: the four colours read `#E2B000` light and `#F8D874` dark in third place;
   - on `/view/compositions/stage/grounds/`, the `field-3` stage computes background `rgb(226, 176, 0)` / `rgb(248, 216, 116)` and its text the legend;
   - on the `badge` page the caution badge computes the `--caution` background and ink text; on the `alert` page the caution bar's left border computes `--caution`; on the `chart` page series 3 computes `--chart-3`;
   - axe reports 0 violations on those pages and on `/view/product-home/`.
   (e2e)
9. **No amber left.** A unit check greps `tokens/`, `scripts/build-tokens.ts`, all of `src/` (which includes `src/app.css`, `src/lib/preview/` and every route group) except `src/lib/identity/`, `registry.json` and `static/r/` for `amber`, `#F19E20` and `#915B00`, each in any case: 0 matches. Two places are excepted by name: L19's pattern in `scripts/lint-literals.ts` and its test, which keep `amber` as `013`'s stale-name guard. `src/lib/identity/` and `tests/unit/fixtures/` are not searched; they are a record. (unit)
10. **Lints and types.** The literal lint over every item: 0 violations, 1 allowance (L24). `bun run lint` exits 0. `bun run check` reports 0 errors. (unit; commands)
11. **The suites.** `bun run test:unit`, `bun run test:e2e` and `bun run test:smoke` pass. Expectations change only in these groups:
    - `tokens.test.ts`: the palette test (`amber` → the three yellows), the fields test, the primitive and role counts;
    - `generated.test.ts`: the `--field-3` pins, the dark expressive `--mark-3` pin, the `MOVED_016` group (criterion 7);
    - `contrast.test.ts`: `001`'s `LIGHT` and `DARK` row tables (the `caution` rows' figures, the two `chart-3` exceptions' figures, the dark `chart-3` rows, and the three new `caution-text` rows per theme, which push the later text, tint and non-text rows down three places); the field-legend test's two `field-3` figures (9.53, 13.20); **the glass set's "the lowest %s %s row" pins, dark `foreground` 12.06 → 10.90, `muted-foreground` 5.09 → 4.60, `primary` 6.47 → 5.85**; **the glass-over-glass set's "lowest over a field" pins, dark `foreground` 15.53 → 15.40, `primary` 8.33 → 8.26**; the field, glass, glass-over-glass and ring rows for `field-3`; the hue, text-shade, chart-neighbour and mark-record groups, new;
    - `registry.test.ts`: the 0.12.0 entry's check (criterion 12);
    - `four-dot.spec.ts`: the two `rgb(241, 158, 32)` readings;
    - `on-brand.spec.ts`: the light and dark colour lists, and the field test's title ("blue, yellow and green").
    No smoke test pins the old yellow (READ, grep). (all suites)
12. **The documents.** `CHANGELOG.md`'s one 0.12.0 entry holds decision 8's summary line, and its one `pluto-theme` bullet holds decision 8's sentences: it names `#E2B000`, `#F8D874`, `#806200` and `--caution-text`. There is still exactly one `pluto-theme` bullet. `registry.test.ts` checks the 4 names. The five page texts and the two comments of decision 6 say "yellow" and not "amber". The `marketing-bar` page reads "at least 15.40:1 and 5.98:1". (unit)
13. **The record of the ungated yellows.** A unit group records, without gating, the mark's third dot on paper (1.76), on white (2.01), on graphite under the expressive mode (13.20), and on each field in both themes (decision 5's table); and light caution's two non-text uses (decision 5): the alert's caution bar on a light card (2.01, was 2.17) and the caution badge's fill against the light page (1.76, was 1.91). It asserts only that each figure matches. (unit)
14. **The checkpoint.** Before the documents step, the design lead looks in the browser, in both themes, at 1440 and 390 px, at: the `pluto-theme` page's fields and colours; `/view/compositions/stage/grounds/`; `/view/product-home/` (the proof band on `field-3`, the glass over it in dark); the four-dot mark and the lockup on paper, on graphite and on a dark expressive ground; the `badge`, `alert` and `chart` pages. The question at each: does the yellow read as yellow beside blue, red and green, and does each figure of decision 5 hold on screen? The look is recorded in `decisions.md`. (checkpoint)

## Build order

1. **Re-derive the counts** from the token file `013` lands; write them into the Landing notes.
2. **Tests first.** Write criteria 1 to 9 and 11 to 13's changes. Run them red, and record the failure counts.
3. **Tokens and emission** (decisions 1 to 3). Run `build:tokens`.
4. **Checkpoint 1** (criterion 14).
5. **The comments, the pages and the changelog** (decisions 6 and 8).
6. Every suite, the lints and `check`.
7. The change review. The tag waits for the change reviews of `013`, `015` and `017` too (decision 9).

## Risks

- **Yellow on white is faint by design.** The light mark's third dot reads 1.76 on paper and 2.01 on white, below amber's 1.91 and 2.17. It is the owner's choice and the mark is exempt; anything that carries meaning in yellow keeps a label, as 2026-11-06's ruling on §4.4 requires.
- **Dark muted text on glass over `field-3` is the tightest glass row,** 4.60. If `015` puts muted text on dark glass over the yellow field, that row is its floor.
- **The mark on its own field** loses its yellow dot (1.00). `015` must not set the four-colour mark directly on a field.
- **Brand and code yellows sit close in dark** (ΔE 4.1). They never share a surface; if a later page puts code on a yellow field, it measures them.

## Review dispositions

From [`../reviews/016-the-brand-yellow-spec-2026-11-14.md`](../reviews/016-the-brand-yellow-spec-2026-11-14.md).

1. **Fixed (Medium).** The Blocks line now reads "`015`'s build (`015` decision 3)", and "needs no change if its build starts first" is gone. Decision 9 says `015`'s checkpoint 0 sets decision 1's values in its scratch stylesheet only, and names the variables: light `--mark-3`, `--field-3`, `--chart-3`, `--caution` and `--field-3-foreground`; dark the same three fills, the dark legend, and the dark expressive `--mark-3`. `015` decision 3 already says the scratch page sets `016`'s values; its author is asked to name the variables in its checkpoint 0 step. `017` joins Ships with, and the tag follows the change reviews of `013`, `014` (done), `015`, 016 and `017`.
2. **Fixed (Medium).** Decision 6 adds a figure sweep, run over `src/` and `tests/`, with its hits. Criterion 11 lists the five minima pins with their new values: glass dark `foreground` 12.06 → 10.90, `muted-foreground` 5.09 → 4.60, `primary` 6.47 → 5.85; glass-over-glass dark `foreground` 15.53 → 15.40, `primary` 8.33 → 8.26. It also lists the field-legend test's two `field-3` figures. The `marketing-bar` page's "at least 15.53:1 and 5.98:1" becomes "15.40:1 and 5.98:1". This specification's builder changes it (decision 6), and criterion 12 checks it.
3. **Fixed.** Decision 3 states the need: after `013` the brand has no yellow an app may set as text, and a primitive without a role never reaches an app. It names the first reader, `017`'s generated `/foundations/colour/` table; no item uses it in 0.12.0. It gives the reason for the name: `caution` is already the fill and cannot be renamed. It names the utility an app writes, `text-caution-text`, and says the name is permanent once shipped.
4. **Fixed.** Criterion 9 searches all of `src/` except `src/lib/identity/`, which includes `src/app.css`, `src/lib/preview/` and every route group. It matches `amber` and both hexes in any case. Decision 6 adds the `pluto-theme` page's "Amber is the one known exception" and the `src/app.css` row.
5. **Fixed.** Criteria 2 and 6 import `oklch` and the colour-vision matrices from `tests/helpers/colour.ts`, where `013` moves them when it removes the workbench (`013` decision 18). They import `deltaE` from `scripts/contrast.ts`, where `014` put it with `mix`. No test writes a copy.
6. **Fixed.** Decision 5 records light caution's two non-text uses, the alert's bar on a card (2.01, was 2.17) and the badge's fill against the page (1.76, was 1.91). Neither needs 3:1, because the state is named in words (WCAG 1.4.11; 2026-11-06's ruling on §4.4). Criterion 13 records both.
7. **For `015`'s author** (not 016's text). `015` decision 5 (line 136) cites "`016` decision 6" for the mark on fields; it is decision 5. Its table (line 140) says the door dots keep "57.1 or more in dark" over the bar's glass. 57.1 is the yellow dot's own figure. Over dark glass on the four fields, the four dots together keep 43.6 (the review, EXECUTED). Recorded here for the coordinator to pass on.

## Landing notes

- **The counts, re-derived from `013`'s landed token file** (build step 1, EXECUTED with `readTokens` and `scripts/contrast.ts` on `4822ae5`): 46 primitives and 60 theme roles in each theme; 30 `contrast.text` pairs, 4 tints and 21 non-text pairs; `contrastTable` 110 rows (55 per theme), 108 pass and the 2 light `chart-3` exceptions; fields 16, glass 33, glass over glass 20, ring 11, fallback 6, forbidden 3, scrim 6. After this change: **48 primitives, 61 roles, 33 text pairs, `contrastTable` 116 (58 per theme): 114 pass, 2 exceptions, 0 fail.**
- **Tests first, seen failing** (build step 2, before any token change):
  - unit: 103 failures over 15 groups (`tokens.test.ts` 7, `contrast.test.ts` 89 with the new 016 group's 20, `generated.test.ts` 4, `registry.test.ts` 3). Every new 016 test in `contrast.test.ts` failed: the yellow primitives did not exist.
  - e2e, `four-dot.spec.ts` and `on-brand.spec.ts` in both themes: 13 failed, 159 passed. The failures are the lockup's dot colours, the mark by theme and mode, the bar's marks, and the three new 016 tests (`field-3`, the caution badge and alert, chart 3).
- **After the tokens and emission** (step 3): unit 1055 pass, 3 fail, the three left being step 5's (no amber in the copy, the changelog, the page texts); e2e on the two files, 172 of 172.
- **The checkpoint** (checkpoint 1, after step 3) was the design lead's, in both themes at 1440 and 390 px, recorded in `decisions.md`, "After the `016` build's checkpoint (2026-11-15)". The figures were measured from painted pixels on a dev server of the builder's own (EXECUTED, 2026-11-15, element screenshots decoded in a scratch script): light fill `#E2B000`, ink on caution 9.53, the `field-3` legend 9.53, the caution fill and `chart-3` on the page 1.76, the alert's bar on its card 2.01, `chart-3`'s ΔE to its neighbours 48.1, 31.2, 30.3 and 37.5; dark `#F8D874`, 13.75, 13.20, 13.20, 11.78, and 27.2, 18.3, 19.8, 21.9. Each equals decision 5's.
- **Dark glass over `field-3` (muted text 4.60, the tightest glass row) is not on screen anywhere in 0.12.0.** On `/view/product-home/` at 1440 no glass lies directly on the yellow: the sticky bar passes over the band's own content, not its fill. So the unit tests (the glass set's pins and the 016 group's six `field-3` rows) are its only guard. `017`'s `/foundations/colour/` page will show it on screen.
- **Deviations.**
  - **The chart page gains five series swatches** (`series-1` to `series-5`, `bg-chart-1` to `bg-chart-5`), because no figure on the page drew series 3, which criterion 8 reads. Accepted at the checkpoint.
  - The ring set's dark minimum also moves, 6.47 → 5.85 (the spec review's note). No test pinned it; the 016 group pins the `field-3` ring rows, 5.68 and 5.85.
  - `registry.test.ts`'s page-text check flattens whitespace and comment markers, since Prettier wraps the two sentences it reads.
  - `generated.test.ts` also asserts `src/app.css` holds `--color-caution-text` and no amber or old hex.
- **The figure sweep** (EXECUTED at the build, `grep -F` over `src/` and `tests/`, the identity exhibit, its routes and the fixtures left out): every hit of 8.81, 8.45, 1.91, 2.17, 7.55, 12.06, 5.09, 6.47, 15.53 and 8.33 that belonged to a yellow row is changed. The remaining hits belong to other rows (`013`'s Tombaugh table, `success` over a card 5.09, the lock files' version numbers) or are the record group's own "was" figures.
- **No amber left** (criterion 9): 0 matches over `tokens/`, `scripts/build-tokens.ts`, `src/` but `src/lib/identity/`, `registry.json` and `static/r/`. The `alert` page's "an amber bar" now reads "a yellow bar", and the check covers it. `static/v0.11.0/` is unchanged; `static/r/` and `static/v0.12.0/` are regenerated.
- **Suites** (2026-11-15, the last runs): `bun run test:unit` 1058 pass, 0 fail; `bun run check` 0 errors, 0 warnings; `bun run lint` clean; the literal lint 0 violations, 1 allowance (L24); `bun run build:tokens` twice, 0 changes the second time; `bun run test:e2e` 2010 passed, 4 skipped, 0 failed (axe and the keyboard walk in both themes); `bun run test:smoke` 122 pass, 0 fail.
- **The change review** is to come.

