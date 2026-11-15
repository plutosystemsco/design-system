# Review of 016 — The brand yellow (the built change)

Reviews [`specifications/016-the-brand-yellow.md`](../specifications/016-the-brand-yellow.md). This reviewer wrote neither the specification nor the code, and did not review the specification ([`016-the-brand-yellow-spec-2026-11-14.md`](./016-the-brand-yellow-spec-2026-11-14.md) is another reviewer's).

- **Date:** 2026-11-15
- **Status:** in review; lands, with two Low write-ins
- **Reviewer:** a reviewer; not the author
- **Reviewed:** the working tree on `4822ae5` (`013`, branch `release/0.12.0`), uncommitted: the tracked diff, 26 files, +570 −101.
  - `tokens/pluto.tokens.json` and `scripts/build-tokens.ts`;
  - the generated `src/app.css`, `registry.json`, and `static/r/` and `static/v0.12.0/` (3 files each);
  - `badge.svelte`'s comment and `product-home`'s block comment;
  - the `alert`, `badge`, `chart`, `marketing-bar`, `pluto-theme` and `product-home` pages;
  - `CHANGELOG.md`;
  - the tests `tokens`, `contrast`, `generated`, `registry`, `four-dot.spec` and `on-brand.spec`;
  - 016's specification, with its dispositions and Landing notes, and its specification review.

  Not 016's: `decisions.md` (read as rulings, chiefly "After the `016` build's checkpoint (2026-11-15)" and "A yellower yellow, in code and in the brand"), the `015` and `017` specifications and reviews, and the design-site research.
- **Re-ran:** Bun 1.4.4, 2026-11-15. Nothing in the repository was written but this file. Scratch work is in `…/scratchpad/review-016-pr/`.
  - `bun run test:unit` → exit 0: **1,058 pass, 0 fail**, 7,171 `expect()` calls, 19 files.
  - `bun run check` → `COMPLETED 1827 FILES 0 ERRORS 0 WARNINGS 0 FILES_WITH_PROBLEMS`.
  - `bun run lint` → "All matched files use Prettier code style!".
  - `bun scripts/lint-literals.ts` → "0 literal(s) in registry item files; 1 allowance(s)" (L24).
  - `bun run test:e2e`, the full suite in both projects → exit 0: **2,010 passed, 4 skipped, 0 failed**, 3.5 m. It includes `four-dot` 50, `on-brand` 122, `axe` 542 and `keyboard` 238.
  - `bun run test:smoke` → exit 0: **122 pass, 0 fail**, 6,694 `expect()` calls, 7 files.
  - **Idempotence:** `git diff --stat` was the same before the e2e run (whose build runs `build:tokens` and `build:registry`) and after it and smoke: 26 files, +570 −101.
  - **The snapshots:** `static/r` and `static/v0.12.0/r` are identical (`diff -rq`). `static/v0.11.0/` has 0 differences from its tag and 0 untracked files.
  - **Every figure, from the token file** (my script, `scripts/contrast.ts` and `tests/helpers/colour.ts` by absolute path; listed under criteria 1 to 6 and the questions below).
  - **The app-facing names:** `registry.json`'s `pluto-theme` diffed against `HEAD`, key by key.
  - **The amber search:** `grep -rniE "amber|#f19e20|#915b00"` over all of `src/`, less `src/lib/identity/` only (so `src/routes/(identity)/` is searched); then `tokens/`, `scripts/build-tokens.ts`, `registry.json` and `static/r/`.
  - **The mark on a field**, probed with Playwright on a `vite preview` of the e2e build at port 4391. On 75 item pages, every block view, the composition views and `/view/product-home/`, in both themes at 1440 and 390 px, I found the first painted ancestor (a background or a backdrop filter) of each of the 696 `[data-slot="four-dot"]` instances, and checked whether it is a field.

## Acceptance criteria against evidence

1. **Tokens** — met.
   - EXECUTED:
     - 48 primitives, and 61 roles in each theme (`013`'s 46 and 60, +2 and +1);
     - `yellow` `#E2B000`, `yellow-lifted` `#F8D874`, `yellow-text` `#806200`;
     - no primitive or role named `amber`;
     - the roles and fields as decision 1 sets them: light `chart-3`, `caution` and `mark-3` `yellow`; dark `chart-3` and `caution` `yellow-lifted`; `caution-text` `yellow-text` and `yellow-lifted`; dark `mark-3` `paper`; `caution-foreground` `ink`; `field-3` `["yellow", "ink"]` and `["yellow-lifted", "graphite"]`.
   - `tokens.test.ts` passes, "writes each hex once" included.
   - `build:tokens` is idempotent (above).
2. **The hues** — met. EXECUTED: `yellow` L 0.781, C 0.160, h 88.0; `yellow-text` 0.512, 0.105, 87.6; `yellow-lifted` 0.889, 0.125, 92.0.
   - READ: `contrast.test.ts` imports `oklch` and `deltaEUnder` from `tests/helpers/colour.ts`, and `deltaE` from `scripts/contrast.ts`. It writes no copy.
3. **The text shade loses nothing** — met. EXECUTED: `#806200` reads 5.03, 5.73 and 4.55 on paper, white and `muted`, against `amber-text`'s 4.98, 5.67 and 4.51. It is ΔE 4.4 from `code-yellow` and 27.4 from `yellow`.
4. **The theme table** — met. EXECUTED: `contrastTable` 116 rows (`013`'s 110 + 6): 114 pass, 0 fail, and exactly 2 exceptions, light `chart-3` on `background` 1.76 and on `card` 2.01. Each has the "yellow series" reason (READ in the token file and pinned in the 016 group).
   - Ink on `caution`: 9.53 light, 13.75 dark.
   - `caution-text`: light 5.03, 5.73, 4.55; dark 13.20, 11.78, 10.51.
   - Dark `chart-3`: 13.20 on the page, 11.78 on a card.
5. **The fields and the glass** — met. EXECUTED:
   - `fieldRows` 16 of 16, the `field-3` legend 9.53 light and 13.20 dark, as text and as a ring;
   - `glassRows` 33 of 33. Over `field-3`: light 15.52, 5.97, 5.68; dark 10.90, **4.60**, 5.85;
   - `glassOverGlassRows` 20 of 20. Over `field-3`: light 16.68, 6.11; dark 15.40, 8.26;
   - `glassRingRows` 11 of 11, the `field-3` ring 5.68 and 5.85;
   - fallback 6, forbidden 3, scrim 6.
6. **`chart-3` against its neighbours** — met. EXECUTED: ΔE in light 48.1, 31.2, 30.3, 37.5; in dark 27.2, 18.3, 19.8, 21.9, the lowest dark `chart-2` at 18.3. The colour-vision rows are pinned in the 016 group, lowest dark `chart-4` under protanopia at 12.1 (EXECUTED through the test).
7. **Emission** — met.
   - READ in `src/app.css`'s diff:
     - light `--chart-3`, `--caution`, `--mark-3` and `--field-3` at `#e2b000`, and `--caution-text: #806200`;
     - dark `--chart-3`, `--caution`, `--caution-text` and `--field-3` at `#f8d874`;
     - `--color-caution-text` in `@theme inline`;
     - the dark expressive `--mark-3: #f8d874`.
   - `generated.test.ts` passes, with `MOVED_016` (3 `:root` and 2 `.dark` entries) spread after `MOVED_011`.
8. **In the browser** — met. EXECUTED: `four-dot.spec.ts` and `on-brand.spec.ts` pass in both projects, with the new 016 tests (the `field-3` stage, the caution badge and alert, chart series 3). axe passes on every scan.
9. **No amber left** — met. EXECUTED:
   - My search finds 0 matches in all of `src/` less `src/lib/identity/` (route groups included), and 0 in `tokens/`, `scripts/build-tokens.ts`, `registry.json` and `static/r/`.
   - READ: `registry.test.ts`'s "016: the brand yellow" lists its files with `git ls-files --cached --others` (so untracked files count) and matches `amber|#?f19e20|#?915b00` in any case.
   - L19's `amber` in `scripts/lint-literals.ts` sits outside the searched set, as the criterion excepts it.
10. **Lints and types** — met. EXECUTED (above).
11. **The suites** — met. EXECUTED: unit, e2e and smoke pass. The changed expectations are the groups the criterion lists. The Landing notes record the extras: the chart page's swatch row, the ring set's dark minimum, the flattened page-text check, and `generated.test.ts`'s amber check of `src/app.css`.
12. **The documents** — met, with two wording points (findings 1 and 2).
    - READ: the summary line and the `pluto-theme` sentences are present, word for word as decision 8 gives them. There is exactly one `pluto-theme` bullet. `registry.test.ts` checks the four names.
    - The five page texts and the two comments say "yellow" and not "amber" (my search, and the test).
    - The `marketing-bar` page reads "at least 15.40:1 and 5.98:1". EXECUTED: the lowest `foreground` over glass over glass on a field is dark `field-3`, 15.40; the lowest `primary` is light `field-2`, 5.98.
13. **The record of the ungated yellows** — met. EXECUTED through the 016 group:
    - the third dot on paper 1.76, on white 2.01, and on graphite in expressive dark 13.20;
    - the dot on each field, decision 5's table, with 1.00 on its own field;
    - the alert's bar on a light card 2.01 (was 2.17), and the badge's fill on the light page 1.76 (was 1.91).
14. **The checkpoint** — met. READ: `decisions.md`, "After the `016` build's checkpoint (2026-11-15)", covering the seven pages in both themes at 1440 and 390 px, with the painted-pixel figures. Its one open item, the `alert` page's "an amber bar", is fixed: the page reads "a yellow bar".

## The points asked

- **Decision 1's values:** as above. Every hex, OKLCH figure and role assignment matches.
- **No app-facing role renamed (decision 2):** confirmed against `HEAD`'s `registry.json`.
  - `cssVars.light` and `.dark`: 0 keys removed; 1 added, `caution-text`. Changed values: light `caution`, `mark-3` and `chart-3`; dark `caution` and `chart-3`.
  - `cssVars.theme`: unchanged.
  - `css`: 0 keys removed or added. Changed values: `:root` `--field-3`, `.dark` `--field-3`, and the dark expressive `--mark-3`.
  - Only primitives were renamed, and an app never receives a primitive's name.
- **`caution-text` `#806200`:** 5.03 / 5.73 / 4.55 light, 13.20 / 11.78 / 10.51 dark. No item uses it yet, as decision 3 says.
- **The five minima pins:** glass dark `foreground` 10.90, `muted-foreground` 4.60, `primary` 5.85; glass over glass dark `foreground` 15.40, `primary` 8.26. Each is the minimum of its set in dark, and each is over `field-3` (EXECUTED). **The field legends:** 9.53 and 13.20.
- **`static/r` = `static/v0.12.0`; `static/v0.11.0` matches its tag:** confirmed, and stable under a rebuild.
- **`marketing-bar` reads 15.40:** confirmed, and the figure is the true minimum.
- **The changelog lines:** present as decision 8 words them. Two points of wording (findings 1 and 2).
- **The mark never sits directly on a field:** confirmed on screen. Of the 696 mark instances, 0 have a field as their first painted ancestor. `product-home`'s `Lockup` sits on the bar's glass and in the footer on the canvas. No item renders `four-dot` inside a field.

## Findings, most severe first

None is High or Medium. Each is a write-in, with its fix.

1. **"No name changes." reads as false in the bullet it ends** (`CHANGELOG.md`, the `pluto-theme` bullet) — the bullet holds `013`'s renames and removals (`--code-text` replaces `--code-foreground`, and seven `--code-*` names and four `syntax-*` roles go). 016's closing "No name changes." is true only of 016's part, as `014`'s sentence was before it was scoped.
   Fix: "The yellow renames nothing; it adds `--caution-text`."
2. **The changelog gives the light chart figures but not the light caution figures** (`CHANGELOG.md`) — it says `--chart-3` stays under 3:1 (1.76, 2.01). It does not say that `--caution`, which an app uses as a fill and a bar, falls the same way: the badge's fill against the page 1.91 → 1.76, the alert's bar on a card 2.17 → 2.01. An app that sets its own caution bar or fill on a light ground sees it fainter. It must keep naming the state in words, as the design book's ruling on §4.4 requires.
   Fix: add after the `--chart-3` sentence: "The `--caution` fill falls the same way in light (1.76 on the page, 2.01 on a card); name a caution state in words, as the alert and the badge do."

Recorded, not a finding: dark muted text on glass over `field-3` (4.60, the tightest glass row) is on no page in 0.12.0. Only the unit pins guard it. The checkpoint accepted that, and named `017`'s Colour page as the place it will first be read on screen.

## Constitution checks

- §4.1 source, not a package: met. Only the token values and a theme role change.
- §4.3 tokens are the one source: met. The literal lint reports 0 violations. No item names a hex. The chart page's new swatches read `bg-chart-1` to `bg-chart-5`.
- §4.4 accessible by default: met.
  - Every text row passes in both themes, the lowest at 4.55 (`caution-text` on light `muted`) and 4.60 (dark glass over `field-3`).
  - The only rows under their minimum are the two recorded light `chart-3` exceptions.
  - Light caution's non-text uses (2.01 and 1.76) carry a label in words.
  - axe passes 542 scans, and the keyboard walk 238.
- §4.5 and §4.6: met. No package or lockfile changes.
- §6 never break an installed app silently: met. No name an app reads is renamed or removed (confirmed key by key). The values that move are listed in the changelog. Findings 1 and 2 are wording.

## Regressions looked for

- **The fields and glass in both themes:** `on-brand` 122 and the `field-3` stage test pass. The glass sets pass, with their minima pinned.
- **The four-dot mark:** `four-dot` 50 passes: the light third dot `rgb(226, 176, 0)`, paper on dark product screens, `rgb(248, 216, 116)` under the dark expressive mode. My probe found no mark directly on a field.
- **The code yellow** (`013`): untouched, and distinct (ΔE 4.4 light, 4.1 dark).
- **`static/v0.11.0/`:** untouched.

## Verdict

Lands: all 14 criteria are met on evidence I re-ran, and the two findings are Low write-ins in the changelog.

## Disposition

<to be filled in after the builder and the author answer>
