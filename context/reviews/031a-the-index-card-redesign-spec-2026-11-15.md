# Review of 031a — The index card redesign

Reviews [`specifications/031a-the-index-card-redesign.md`](../specifications/031a-the-index-card-redesign.md).

- **Date:** 2026-11-15
- **Status:** in review. Verdict: **revise**.
- **Reviewer:** a reviewer; not the author
- **Reviewed:** the specification as drafted, 2026-11-15 (237 lines). I checked it against these:
  - the constitution, `AGENTS.md`, `reviews/README.md`, `roadmap.md` (rows `029`, `030`, `031`, `031a`, `031b`; lanes; waves);
  - the memo `research/2026-11-15-index-cards.md` and its exhibit (`index.html`, `probe.ts`, `colour.py`, `probe-bytes.json`, `img/`, `png/`);
  - `018` (decision 13 as built: `scripts/site/thumbnails.ts`, `scripts/site/thumbnail-hash.ts`, `src/routes/(site)/components/+page.svelte`, `site.css` `.site-thumb`), `021`, `024` (the `index` row), `028` (transparent borders), `029` (decisions 2, 4, 6, 7, 14 to 16, 19), `031` (the draft, decisions 6 and 7 and its swatch table), `031b` (decision 11 and its build order), `019a` decision 3;
  - the reference screenshots in `research/2026-11-15-design-sites/` and the Carbon clone's `ComponentOverview`;
  - the tree at `44cec73` (`020` has merged since the spec was written; `tokens/kuiper.tokens.json` and its `contrast` block).
- **Re-ran:** nothing in the repository changed but this file. No repository build. Every probe is mine, in `…/scratchpad/031a-review/`, written before reading the author's `colour.py` closely.
  - `colour.mjs`, `measure.mjs`: my own CIEDE2000 (exact CIE constants, D65; and a D50/Bradford variant), WCAG contrast and OKLCH. Checked against 20 of Sharma, Wu and Dalal's (2005) pairs: worst error 4.2e-5 (EXECUTED).
  - `thumbs-probe.ts`: **the real thumbnail script**, copied, with its outputs redirected to the scratchpad and decision 7's one rule added after each navigation (`--sunken` declared per scheme, since the token does not exist yet). Run twice with `--no-build` against the main tree's existing `build/` (Bun's own server on port 0): once as is (`out-base/`), once with the rule (`out-sunken/`). 150 pictures each, 166 s and 168 s (EXECUTED).
  - The baseline run reproduced the committed pictures exactly: 656,730 B against 656,730 B. So the pipeline is deterministic, and the sunken run is a fair forecast of decision 7 (EXECUTED).
  - `corners2.mjs`, `analyse.py`, a frame-median reader and a content-box diff over both runs, decoding WebP with Pillow's libwebp (EXECUTED).
  - `index-probe.ts`: `/components/` from `build/` on a free port (not 5199) at 1440 and 390, Chromium; the tile, stage and picture boxes. Stopped after (EXECUTED).
  - Pixels sampled from the reference screenshots (EXECUTED); `component-overview.scss` and two `images/*.svg`, read (READ).
  - [Wikipedia, "Color difference"](https://en.wikipedia.org/wiki/Color_difference), read 2026-11-15: "All ΔE* formulae are originally designed to have the difference of 1.0 stand for a JND"; CIE76's JND is about 2.3; "CIEDE2000 is not reliable below 1 cd/m2 and has not been verified above 100 cd/m2" (CITED).

## What holds

- **The diagnosis.** Every committed picture carries the page's ground in its pixels: 72 light corners read `#F3F0E8`, the dark ones `#151410` (ΔE 0.72 from graphite). The index's stage is `rgb(243, 240, 232)` in a white, 1 px-hairlined tile (EXECUTED). The owner's "background on background" is exactly the build.
- **The colour figures.** Every ΔE and ratio in decision 2 and decision 1 reproduces to 0.01, except two roundings: dark `sunken`–`card` is 6.36 (spec 6.35) and light `background`–`card` 4.92 (spec 4.93), from the memo's 7.787 approximation. D50 changes nothing material (5.90, 10.43, 3.40; 2.78, 6.41, 9.28). The OKLCH order holds: 0.880 < 0.922 < 0.955 < 1.000 and 0.145 < 0.192 < 0.241 < 0.279. Text on `sunken`: 13.35, 5.14, 17.38, 7.34 (EXECUTED).
- **Nothing in a picture vanishes into `sunken` by token.** The nearest opaque roles are `muted` (3.41, light) and `background` (2.74, dark). The 10% hairline over `sunken` reads ΔE 4.93 and 6.32. The dark glass tint over `sunken` is only ΔE 1.98 from it, but the glass edge carries the panel; I looked at `liquid-glass` and `marketing-bar` in both schemes (EXECUTED).
- **The rule beats `frame-stage`.** With it, all 150 pictures have `sunken` corners, and `text-sizes.json` is byte-identical to the baseline run, so the 9 px floor holds (EXECUTED).
- **Test 7 can pass.** The share of pixels within ΔE 1 of `card` runs from 4.31% (dark Collapsible) to 54.75% (light Card) (EXECUTED).
- **The budget.** `024`'s `index` row is as quoted (395 kB, 3,060 ms; 355 kB measured). The pictures' change is +1.40% in all, so the first screen moves well under 1 kB (EXECUTED; finding 7 corrects the sign).
- **Forced colours.** A transparent 1 px border is painted by Chromium and Firefox and not by WebKit (`028` decision 1, line 23). Test 8 runs where `028` runs, as it should (READ).
- **Atlassian's index, Carbon's overview and Radix's frame** are as the memo says. Atlassian's stage `#F8F8F8` on a `#FFFFFF` card with a `#DDDEDD` edge, 1.06:1 and ΔE 1.40. Carbon: `$white-0` tiles, `$gray-20` rules, `#e5e5e5` hover, 4 across at `xlg`, and white surfaces drawn `#F3F3F3` / `#F4F4F4` in its SVGs. Radix: the page's own ground, a 1 px edge, tinted code (EXECUTED, READ). Finding 8 corrects Spectrum.

## Findings table

| # | Severity | Finding | Where |
|---|---|---|---|
| 1 | High | Decision 7's rule repaints the page of every block and composition. 17 views (34 pictures) now show their page on `sunken` or as a hard-cut paper slab, which no app ever shows | decision 7; test 6 |
| 2 | High | As a public role, `sunken` fails AA for the system's own pairs in light: `destructive` 4.18, `success` 4.09, `caution-text` 3.99 as text, `input` 2.80 as an edge. No light value darker than `muted` passes them and keeps the ΔE 2.5 floor | decision 1; Q2; the contrast file |
| 3 | High | "`031` must give `sunken` a high-contrast pair" is wrong. `031` keeps every ground, and its swatches fail on `sunken`: `ink-soft-more` 6.20 (target 7), `line-more` 3.96 (target 4.5) | Blocks; decision 1; Risks; `031` decisions 6 and 7 |
| 4 | Medium | Test 6 cannot pass. WebP moves the ground past ΔE 1.0 at a corner in all 75 light pictures (worst 2.00) and 67 of 75 dark (worst 2.14). The spec's own reading, `#DCD8C9`, is ΔE 1.11 | decision 2; test 6; criterion 5 |
| 5 | Medium | Test 5 samples the wrong pixel. At 390 the point 12 px inside a 96 × 60 picture is content. In dark, a WebP ground pixel reads ΔE 2.48 from the page, under the 2.5 floor | test 5; criterion 4 |
| 6 | Medium | The ΔE 2.5 floor is borrowed from a light pair. In dark it is the smallest step the system draws, at luminances where CIEDE2000 is not validated, and WebP erodes it | decision 2; Risks; Q3 |
| 7 | Low | Bytes: the real pipeline gives +1.12% light and +1.70% dark, not −1.1% and +1.3%. Per picture −12.4% to +23.1%, not −3.9% to +7.6% | "What the research found"; decision 9 |
| 8 | Low | Spectrum's page is `#F7F7F7`, not `#F2F2F2`, and its cards cast a soft shadow. Card to page is ΔE 1.60, not 2.6 | "What the research found"; memo §2 |
| 9 | Low | Write-ins: decision 5 against decision 8, the stale "pluto" line, two roundings, lane S against `030`, `avatar-group`'s cut-out ring, the regeneration count | decisions 5, 8; header; Risks |

## Findings, most severe first

1. **The one rule repaints every view's own page** (decision 7, lines 106 to 115; `scripts/site/thumbnails.ts`, the `ground` read and the canvas fill).
   - The rule sets `html, body` to `sunken` as well as `frame-stage`. A block or composition is photographed with `body` as its capture root. Many views paint no page of their own and rely on `body`'s `background`. Others paint `bg-background` on an inner element.
   - The script uses one colour for two jobs: the canvas fill and the trim colour. With the rule, both become `sunken`. So:
     - A view that relies on `body` now has a `sunken` page. `app-shell`: the header (`app-shell-header`, `bg-background`) is a paper bar, and "Projects" sits on `#DCD7CA` below it. `name-strip`: one row on paper, the next on `sunken`. `marketing-bar`: the glass bar over a `sunken` page. Sign-in, sign-up, settings, page-states and hero are photographed on a page ground that the block never has (EXECUTED, `compare.png`, `compare2.png`).
     - A view or example that paints the page's ground is no longer trimmed. It becomes a paper slab, cut hard at the crop. Chat's "No m…" panel ends mid-word at the slab's edge. `stage`, `stage-card`, `stage-hero`, `live-console`, `product-home` and `sidebar` do the same. 20 pictures hold more than 10% page-ground pixels; their content box grows to the full 24 px margin (EXECUTED, content-box diff: 82 of 150 boxes move, mostly by 1 to 3 px of antialiasing; these move by up to 72 px).
   - The spec's claim "What an example or a view paints itself keeps its colour … drawn by the existing fit as a page inset" is true only for views that paint their whole frame. Test 6 cannot see the fault, since every corner is `sunken`.
   - Fix:
     - Override only `[data-slot="frame-stage"]`, never `html, body`.
     - Split the script's two colours: trim by the capture's own ground (as today), fill the canvas with `--sunken`.
     - For a view, decide the picture in the spec: the whole 800 × 500 frame inset on `sunken` as a page (with the one radius), or today's trim. Show both forms of `app-shell`, `chat` and `sign-in` in the exhibit before the owner answers Q1.
     - Add a test: for each view, at least half of the picture's pixels inside its content box lie within ΔE 1.5 of `background` in that scheme.
     - The builder's list of "any picture that changed in a way other than its ground" becomes a named check at the checkpoint.

2. **A public `sunken` is an accessibility trap in light** (decision 1; Q2; `tokens/kuiper.tokens.json`, `contrast`).
   - The contrast file measures the system's text and edge colours on every ground an item may sit on: `primary`, `destructive`, `success` and `caution-text` as text on `background`, `card` and `muted`, and `input` as an edge on all three. Decision 1 adds only `foreground` and `muted-foreground` for `sunken`.
   - On light `sunken` (EXECUTED): `destructive` 4.18, `success` 4.09, `caution-text` 3.99 (text, need 4.5); `input` 2.80 (non-text, need 3). Also `destructive-fill` 3.91, `success-fill` 3.46 (chart and fill colours, need 3; these pass). Dark passes everything (lowest `input` 4.22).
   - The `$description` invites exactly that use: "a well cut into a surface", and decision 1 names "a drop zone, an inset well". A drop zone carries a field's error, in `destructive`, and a switch's unchecked track (`bg-input`) or a checkbox edge. Each fails AA on it. Constitution §4.4: every item meets WCAG 2.2 AA in every scheme, and a spec that cannot meet that says so as a finding.
   - There is no better light value. Moving `sunken` from `#DCD7CA` towards `muted` along the same hue, the first value that passes all four pairs is `#E8E4D9`, ΔE 0.51 from `muted`. The floor needs 2.5. `#E3DED3` passes `input` at 3.00 but `caution-text` only at 4.27 (EXECUTED, sweep).
   - Fix: change Q2's recommendation to the private variable, made from the token file.
     - The two primitives stay in the base file. The one source holds the hexes (§4.3; `AGENTS.md`).
     - The generator writes one private variable, `029`'s `--ink-ground` precedent, into the site's CSS only. It is not a role, not in `cssVars.theme`, not in `kuiper-theme`, not in `kuiper.css`. No changelog bullet, no interface change, no count change beyond the primitives.
     - Tests 1, 3 and 4 read the primitives and the private variable. Test 4's pairs go: no text sits on the stage.
     - A public `sunken` can come later, from a specification that measures it against the whole contrast file and `031`.
     - If the owner still wants it public, the spec must add every failing pair above as a finding to fix, and say how each item placed on `sunken` meets AA.

3. **High contrast is described wrongly, and `031` would fail** (Blocks, line 10; decision 1; Risks; `031` decision 6 "What does not change", decision 7, its swatch table lines 179 to 191).
   - `031` keeps every ground's value in high contrast, and lists them. So `sunken` needs no "high-contrast pair". It needs the high-contrast text and edge swatches to pass on it.
   - They do not (EXECUTED): light `muted-foreground` in high contrast (`ink-soft-more`, `#444A55`) on `sunken` is 6.20, against `031`'s 7:1. Light `input` and `border` in high contrast (`line-more`, `#6D6659`) is 3.96, against 4.5. Dark passes (9.48 and 6.09).
   - If `031a`'s pairs land first, `031`'s "196 pairs measured, 0 below target" becomes false. The swatches the owner is being asked to approve (`031` Q1) would have to be picked again, darker.
   - Fix: with finding 2's fix, nothing is needed. Say so in Blocks and Risks: the stage is decorative, and `031` keeps grounds. If `sunken` stays public, its token edit must land, and its pairs reach `031`'s author, before `031`'s swatches go to the owner. Then `031` adds `[muted-foreground, sunken]` and `[border, sunken]` to its high-contrast rows.

4. **Test 6's tolerance is below WebP's own error** (decision 2, "Rendered", line 64; test 6; criterion 5).
   - "WebP moves the ground by under ΔE 1." The spec's own rendered reading, `#DCD8C9`, is ΔE 1.11 from `#DCD7CA`.
   - From the forecast run, single corner pixels: all 75 light pictures exceed 1.0 (worst 2.00, dialog's `#DFD6C9`). 67 of 75 dark exceed it (worst 2.14, `#0E0908`, WebP's first block). A 6 × 6 corner patch's median is still 2.14 in dark (EXECUTED).
   - What is stable is the picture's outer frame. The median of each picture's outer 4 px is within ΔE 1.11 of `sunken` in light and 0.69 in dark. It is at least 6.13 and 2.94 from the page (EXECUTED).
   - Fix: test 6 reads the per-channel median of the picture's outer 4 px frame. That median is within ΔE 1.5 of `--sunken` and at least ΔE 2.5 from `background`, in each scheme. The mutation stands. Correct line 64.

5. **Test 5 reads content, and a noisy pixel** (test 5; criterion 4; measured boxes).
   - At 390, the picture is 96 × 60. Its ground margin is 24 px of 480, so 4.8 px; an overlay's is 2.4 px. "12 px inside its top-left corner" is inside the content for most pictures (EXECUTED, `index-probe.ts`).
   - At 1440, the picture is 291 × 182 (scale 0.606), so the margin is 14.5 px, 7.3 for an overlay. 12 px is just inside the margin for the tiles named.
   - The pixel there is a WebP pixel. In dark, single ground pixels read as far as ΔE 2.48 from the page (`#0C0A06`), under the 2.5 floor (EXECUTED). So test 5 may fail at random in dark.
   - Fix: test 5 asserts on computed colours: the stage element's `background-color`, the tile's, and `body`'s, ΔE ≥ 2.5 at both widths. Leave the pixel truth to test 6's frame median. If a pixel check stays, read at 390 the stage's 1 px border ring, which shows the CSS ground under a transparent border, not the picture.

6. **The dark floor is the system's smallest step, and unproven on screens** (decision 2, line 51; Risks, line 199; Q3).
   - The floor, 2.5, is the light `background`–`muted` step, at L* 91 to 95, where CIEDE2000 is calibrated. In dark the system's own smallest step is `card`–`muted`, 2.96. Stage to page, 2.74, is below it (EXECUTED).
   - At L* 2.7 and 6.4, the stage is 0.24 cd/m² and the page 0.56 at sRGB's 80 cd/m² white, 0.76 and 1.76 at 250. CIEDE2000 "is not reliable below 1 cd/m²" (CITED). The formula's 1.0 is a nominal JND; CIE76's is about 2.3 (CITED). So 2.74 is a guard, not a proof of visibility. Their luminance ratio is 2.3:1, which an ideal screen shows plainly. Black level, glare and limited-range video (codes below 16 clip to black; `#0B0A07` is all below 16) compress it.
   - A reference ships a smaller step. Atlassian's dark page reads `#18191A` around its example, inside `#1F1F21` chrome: ΔE 2.29, 1.07:1 (EXECUTED). So the value is in family; the margin is thin, and WebP takes 0.26 of it (finding 5).
   - Fix:
     - Decision 2 says the floor is a regression guard, and cites the limits above.
     - Criterion 10's checkpoint names the dark look on an LCD at low brightness, not only the design lead's screen.
     - Q3 gains a third option: one step lower, `#080705` (ΔE 3.34 to the page, 6.93 to the card, OKLCH L 0.129). Same depth, wider margin.
     - Under Q1, B frames the tile on all four sides by the card against the page (3.69 in dark). A's top edge is drawn by stage against page only (2.74). Say so: B is the fallback if the dark top edge reads weak, before Q3's lifted option, which inverts depth.

7. **The byte figures are the probe's, not the pipeline's** ("What the research found", line 33; decision 7's "Why not"; decision 9; memo §6).
   - The forecast run, the real script: 656,730 → 665,940 B, **+1.40%**. Light 337,046 → 340,812, **+1.12%**; dark 319,684 → 325,128, **+1.70%**. Per picture, −12.4% (`marketing-bar`, light) to +23.1% (`chart`, light) (EXECUTED).
   - The memo's probe set the stage inline and skipped views, overlays and fonts, as it says. Its light total had the wrong sign.
   - Decision 9's "under 1 kB" and "within ±2%" hold. Finding 1's fix will move them again.
   - Fix: quote the pipeline figures, or say "about +1.4%". The transparent-picture comparison (+29%, +38%) still stands as a ratio.

8. **Spectrum is misread** ("What the research found", line 29; memo §2's table).
   - Spectrum's page is `#F7F7F7` in open areas (top-left, right rail, between rails). `#F2F2F2` appears only beside a card, in its shadow's halo, darkening to `#F0F0F0` at the card. Below the top card a band reads `#DEDEDE` (EXECUTED, `spectrum-button-1440-light.png`). So its cards have a soft shadow, and card to page is ΔE 1.60, 1.07:1, not 2.6.
   - Dark: `#000000` page, `#111111` card, ΔE 2.96, as stated.
   - Atlassian's example in dark sits in a `#18191A` region, not `#1F1F21` (finding 6).
   - Fix: correct the table and the summary line. It strengthens the spec's case: references accept small steps when an edge or shadow helps, and A has neither.

9. **Write-ins.**
   - Decision 5 says "Both carry a 1 px transparent border". Decision 8 and test 8 give the stage none from `md` (`md:border-0` stays, `md:border-b` goes). Say "the tile from `md`, the picture box below `md`". A transparent border on a full-bleed stage would draw a second line inside the tile under forced colours.
   - Header, line 8: "Today's tree still reads `pluto`". `020` merged at `44cec73`; the tree reads `kuiper` (`tokens/kuiper.tokens.json`).
   - Test 3 and test 4 compare to two places. Use exact CIE constants, as test 2's Sharma check implies: 6.36, not 6.35; 4.92, not 4.93.
   - Lane S: `030` is also lane S, in wave 2. It touches component pages, not `/components/` or the script (READ, `030`). Say that the two share no file, or order them.
   - `avatar-group` cuts its overlap with `border-background` (`avatar-group.svelte:17`). On `sunken`, that cut-out is a paper ring. No first example uses it today. It matters for Q4 and for any public `sunken`.
   - Regeneration: `028`, `029`, `031b` and `031` each change `src/app.css` or items, so each stales every picture. `031b` already treats pictures as a ledger. Say the same here: pictures are regenerated once, at the last landing in the wave, after each earlier landing records its own count.

## The open questions, judged

- **Q1, the card: A is right,** with finding 6's note. It keeps `018`'s tile, link and tests, and it is the closest reading of Atlassian's index. Its one weakness is dark: the tile's top edge is stage against page, ΔE 2.74, with no edge. B is the fallback, not C. C draws the whole tile with that same weak step.
- **Q2, the ground: the recommendation should change to option 3,** the private variable, with its primitives in the token file (finding 2). A public role is an interface every app receives. In light it fails AA for the system's own error, success and caution text and for control edges. The constitution's §4.3 ("tokens are the one source") is met by primitives in the token file; it does not require a role. `muted` stays rejected: I confirm the memo's losses in `png/grounds-1440-*.png`.
- **Q3, below or above in dark: below is right.** The lifted `#353129` reverses the depth. It is also only ΔE 2.89 from `muted`, so dark tabs strips and skeleton bars would lose most of their margin on it, against 9.20 on `#0B0A07`. Add finding 6's third option, `#080705`, for a wider margin with the same depth.
- **Q4, the component pages' frames: leave them, as recommended.** `034` reopens the frame. With Q2 as option 3, moving them later is a site change only. Note for `034`: `avatar-group`'s cut-out ring (finding 9).

## The lane-T crossing and its order

- The order "after `029`, before `031`" is right for the pictures: they must be made once on `029`'s pairs.
- Its stated reason is not. `031` needs nothing from `031a` if Q2 is option 3. If Q2 stays public, `031a`'s token edit must land before `031`'s swatches go to the owner (finding 3), which makes `031a` a blocker of `031`. Today the header says "Blocks: nothing".
- `031b` also queues a lane-T edit after `029`, "before or after `031a`'s; they touch different lines" (`031b` build order). Agreed. Both regenerate every picture, so finding 9's ledger note applies.

## Acceptance criteria, as written: can each be checked?

1. The role and its counts — checkable (unit). Changes with Q2.
2. ΔE floor and darker than `background` — checkable; holds (EXECUTED).
3. The tile per Q1 — checkable, but test 5 reads content at 390 (finding 5).
4. Stage against page and card, in pixels — flaky in dark as written (finding 5).
5. Corners within ΔE 1 — **cannot pass** (finding 4). White held — checkable; passes (EXECUTED).
6. No translucency; outlined under forced colours — checkable in Chromium and Firefox.
7. Regenerated; text floor — checkable; text sizes unchanged (EXECUTED). Views are wrong (finding 1).
8. The budget — checkable; holds (EXECUTED estimate).
9. Changelog and `removed.json` — checkable. The bullet goes with Q2 as option 3.
10. The checkpoint — add the views and the dark display condition (findings 1 and 6).
11. The scorecard — checkable.
12. The suites — checkable.

## Constitution checks

- §4.1 source, not a package: unaffected.
- §4.3 tokens are the one source: met by both options. The script holds no literal. Option 3 keeps the hexes in the token file.
- §4.4 accessible by default: **not met by a public `sunken` in light** (finding 2), nor under `031`'s high contrast (finding 3). Met by option 3: the stage carries only decorative pictures.
- §4.5, §4.6 pinned inputs and dependencies: no dependency added.
- §6, never break an installed app silently: additive. With option 3, no interface change at all.

## Verdict

Does not land yet: revise. Findings 1 to 3 (the views' pictures, a public role that fails AA in light, and the misdescribed high-contrast interaction) and 4 to 6 (tests 5 and 6, and the dark floor's grounds) stand. The diagnosis, the value of `sunken`, card A and the token-sourced approach are sound.

## Disposition

Pending the author's answers.

## Re-check, 2026-11-15

Reviewed: the revised specification (438 lines, its "Review response"), and the author's probe in `…/scratchpad/031a-rev/` (`thumbs.ts`, `analyse.py`, `out-window-all/`, `views-light.png`, `views-dark.png`). Re-ran, mine, in `…/scratchpad/031a-review/`: the byte and frame-median readers over `out-window-all/`; the same pictures decoded in Chromium, Firefox and WebKit (`decode.ts`); a mid-line check of each view (`runs.py`); and a read of `scripts/site/thumbnails.ts`, `build-tokens.ts`, `lint-literals.ts`, `src/lib/site/foundations/tables.ts` and the route layouts. No port 5199, no build, no git write.

**The nine findings.** Each is resolved.

1. **Views.** Resolved. The rule now targets `[data-slot="frame-stage"]` only. The script trims by the capture's own ground and fills the canvas with the stage's ground. Views are drawn as a rounded window of their own page. I looked at `app-shell`, `chat`, `sign-in`, `name-strip`, `marketing-footer` and `stage` in both schemes: each keeps its own page, with no `sunken` under a paper header (EXECUTED). `text-sizes.json` is equal in 148 of 148 pictures (EXECUTED). The rejected whole-frame form would put 14 px text at about 4.6 px. That arithmetic holds, so the rejection is right. Residue: R1 to R3 below.
2. **Public role.** Resolved. No role, no `cssVars` entry, no `kuiper-theme` or `kuiper.css` line. Test 1 asserts each absence.
3. **High contrast.** Resolved. Nothing of `031`'s sits on a private, decorative ground.
4. **Test 6.** Resolved. On the revised pictures, every frame median is `#DCD8C9` (ΔE 1.11) in light and `#0C0A08` (0.69) in dark. They are at least 6.13 and 2.94 from the page. Chromium, Firefox and WebKit decode the same values (EXECUTED). So ΔE 1.5 leaves 0.39 of headroom, with no engine drift. Single corners still reach ΔE 2.62 (`page-states`, light), which is why the frame median is the right reading.
5. **Test 5.** Resolved: it reads computed colours.
6. **The dark floor.** Resolved: a regression guard, the checkpoint on a dim LCD, `#080705` offered, and B as the first fallback.
7. **Bytes.** Resolved. I get exactly the author's figures: 647,178 → 657,266 B, **+1.56%**; +1.48% in light, +1.64% in dark; per picture −5.7% to +23.1% (EXECUTED).
8. **Spectrum.** Resolved in the specification. The memo's §2 row is marked superseded, not edited, which is acceptable.
9. **Write-ins.** Each resolved.

**The new material.**

- **(a) The window, and test 6a.** The window is sound. Test 6a is too weak to guard finding 1 (R2).
- **(b) The primitives and `--site-sunken`.** Consistent with the pipeline.
  - `021` publishes primitives as DTCG paths only, and keeps them out of every CSS file an app receives. A site-only generated file keeps that. The literal lint reads item files only, so the generated hexes are not linted.
  - The file stays out of `kuiper-theme`, the registry and `kuiper.css`, provided it stays a separate generated file and is not written into `src/app.css`'s `:root`. `kuiper.css` copies that block (`021` decision 11). The spec's choice of a separate file is the right one.
  - The `--ink-ground` precedent holds for the name and for being generated. It does not hold for placement: `--ink-ground` is read from roles and ships in `kuiper-theme`, while `--site-sunken` is read from primitives and ships nowhere. Say which half of the precedent applies (R4).
  - Where the file is imported is open (R1).
- **(c) Test 6's ΔE 1.5.** Holds, as in finding 4.
- **(d) +1.56%.** Holds.
- **The old `build/`.** It does not weaken any figure. My baseline from that build reproduced the committed pictures byte for byte, so it is the committed state. Two pictures of 150 are absent: the theme item's pair (`pluto-theme`, 9,552 B, not listed by the current script). Every figure is a forecast of the pre-`029` look. `029` regenerates every picture first anyway, so the builder's own run is the record, as the spec says.

**Remaining findings. All are Low, with their fix text.**

- **R1. Where `stage-ground.css` is imported, and where the script reads the fill** (decision 1; decision 7, item 2; decision 8, last line).
  - Problem: the view routes, `(view)` and `(shell)`, load only `src/app.css`. `site.css` is imported by `(site)/+layout.svelte` alone. If "the site's CSS imports" the generated file through `site.css`, then `--site-sunken` is undefined on all 17 view pages. The script's "probe element in the photographed page" then reads no colour for 34 pictures. The author's probe never ran this path: it fills from a literal (`SK[scheme]`). Test 6 would catch the failure at build time, so no wrong picture can land.
  - Fix: name the import, `(site)/+layout.svelte` beside `site.css`. Have the script resolve the fill once per scheme, from a probe element on `/components/`, before the loop.
- **R2. Test 6a misses the case finding 1 named.**
  - Problem: under the draft's rule, `app-shell` keeps 15 to 19% paper (its header), `marketing-bar` 13 to 15% and `name-strip` 43 to 45%. All pass the 5% floor. The 16 failures the response cites are other views (EXECUTED, `sixa.py`).
  - Fix: add to 6a: along each view picture's middle row and middle column, between the first and last pixel that is not the stage's ground, no run longer than 16 px lies within ΔE 1.5 of the stage's ground. Measured (EXECUTED, `runs.py`): the window run, at most 12 px; today's pictures, at most 12 px; the draft's rule, 28 px or more on 14 pictures, including `app-shell`, `marketing-bar`, `settings`, `hero` and `proof-band`. `name-strip` stays for the checkpoint's list. Or add a unit test that the script's injected selector is exactly `[data-slot="frame-stage"]`.
- **R3. Overlays and the window** (decision 7, items 2 and 3).
  - Problem: item 2 makes an open overlay's trim colour `body`'s paper. Item 3 says "the code path is the same" for every capture. Read together, a dialog or menu would get a paper window. The probe draws the window for views only (`pageMode "w"` only when `stage.kind === "view"`), and its dialog pictures show none.
  - Fix: "The window is drawn for views only."
- **R4. Small additions to Scope and decision 1.**
  - `/foundations/tokens/` and the search index each gain two primitive rows, reading "A primitive that no theme role reads." Their tests count by the token file, so they move by themselves. Name them in Scope.
  - In decision 1, say that `--site-sunken` follows `--ink-ground` in being generated and named, not in shipping, and that `021`'s "the CSS carries no primitive" is about published CSS.

**Verdict: ready.** Fit to build, with R1 to R4 written in. Nothing of the first review stands. R1 should be written in before the build starts.

## Second re-check, 2026-11-15

Reviewed: the specification as revised after the owner's answers (541 lines): Q1 A, Q2 a **public role**, Q3 `#0B0A07`, Q4 until `034`, Q5 restrict the pairs. Then Q1 switched to **B**, recorded in the Landing notes; the decisions are still written for A.

Re-ran, mine, in `…/scratchpad/031a-review/`:

- every `sunken` pair under `031`'s high-contrast swatches (`colour.mjs`), and an OKLCH-lightness estimate of the swatches `sunken` would force;
- a search of `src/lib/registry/` for restricted classes;
- tile widths at eight widths from `build/`, on a free port (not 5199), stopped after (`widths.ts`);
- a read of `scripts/build-tokens.ts` (`SURFACE_ROLES`, `surface-plain`), `scripts/tokens.ts` (the contrast validator), the thumbnail script's `SHOWN`, `029` T8, `021` decision 11, `031` decisions 5, 6 and 13, and `031b` decisions 3 and 11.

No build, no git write.

**What holds.**

- **Restricting the pairs can meet §4.4.** §4.4 binds items. Today no item paints `sunken`, so every item meets AA, and tests 12 and 13 guard later ones. A ground with a named list of allowed foregrounds is the contrast file's own shape for every coloured ground. The light figures reproduce: 4.18, 4.09, 3.99, 2.80; allowed 13.35, 5.14, 4.89; `chart-3` 1.40, under the yellow-series exception.
- **`restricted` against `029` T8.** T8 asserts "No `tints` or `forbidden` key remains". A new key with a new purpose passes it by its letter. The purpose is a ground's contract, not the retired tint rule, which is the honest reason. Say that, rather than that the rename "keeps 029's check".
- **`--sunken` in the generated `src/app.css`** is consistent with `build-tokens.ts` and `021`.
  - A role is emitted on `:root` and in `.dark`, and `kuiper.css` copies it. The primitives stay out of every CSS file.
  - `029` T7 gives it `bg-sunken`. `.dark` needs no restatement, since 0.12.0 never shipped the role.
  - Retiring the private stylesheet removes R1.
- **`031b`'s knock-on values.** `#C7C3B8` reads 1.23:1 on light `sunken`, and `#22211E` 1.23:1 on dark. Both clear `031b`'s 1.1 floor. `031b`'s solid line reads only 1.03:1 on `sunken`, so the redeclaration is needed.
- **Lane T: `031a`, then `031b`, then `031`.** This order is right. `031b`'s redeclarations attach to `031a`'s `surface-sunken`, and `031` must measure both. `031` already expects it (its decision 20, line 723). `031b`'s spec still says "before or after `031a`" and still describes `--site-sunken-line`; it must be revised. The roadmap row's lanes are the design lead's to change.

**Findings.**

| # | Severity | Finding |
|---|---|---|
| S1 | High | The `031` knock-on lists two failing swatches. Seven pairs fail. |
| S2 | Medium | `surface-sunken` does not restore the field roles. A well inside a field gets the field's legend text: 1.44:1 in light, 1.08:1 in dark. |
| S3 | Medium | Test 13 does not say which ground a border is measured against. It also has no cross-file mutation, which is the one thing it adds over test 12. |
| S4 | Medium | Test 12's list of control items is written by hand and misses nine items that put a restricted colour on their parent's ground. |
| S5 | Low | The `restricted` block needs a kind per row. The validator, the site's contrast tables and the pair count are not in Scope. |
| S6 | Low | `kuiper.css` carries `--sunken` but no `surface-sunken`. |

- **S1. The knock-ons for `031` miss five failures** (Knock-ons, `031` items 1 to 5).
  - The spec says that under `more`, in light, two swatches fail on `sunken`: `ink-soft-more` 6.20 and `line-more` 3.96. Measured against `031`'s own swatch table and reuse list, these also fail (EXECUTED):
    - `primary` text: `blue-more` `#2236C3` reads 6.13 against 7.
    - `destructive-fill` and `chart-2`: reused `red` `#C92035` reads 3.91 against 4.5.
    - `success-fill` and `chart-4`: `green-text` `#007351` reads 4.09.
    - `chart-3`: `yellow-text` `#806200` reads 3.99. `031` decision 13 does not carry the yellow-series exception into high contrast.
  - Dark passes everything, as the spec says: 9.51, 9.48, 6.09, and the charts at 7.34 or more.
  - Fix, recommended: in decision 1a, restrict the status fills and the chart colours on `sunken` in both contrasts. Charts and status fills then go on a card inside the well, as status text already does. `031` then re-derives three light swatches for the owner: `ink-soft-more` (about `#3C424D`), `line-more` (about `#645D50`) and `blue-more` (about `#1C2AB8`). These are my OKLCH-L estimates; `031`'s `palette.ts` gives the exact values.
  - Fix, otherwise: keep fills and charts allowed, and list for `031` three more non-text swatches, about `#BD0A2B`, `#006C4B` and `#775A00`. Either way, Risks and Blocks must say "three" or "six" swatches, not "two".
- **S2. `surface-sunken` must restore the field roles** (decision 1b; `build-tokens.ts` `SURFACE_ROLES`, `surface-plain`).
  - A field (`field-1` to `field-4`) resets `foreground`, `muted-foreground`, `card-foreground`, `primary`, `ring`, `primary-foreground` and `border` to its legend. `surface-plain` exists to restore them.
  - Decision 1b's `surface-sunken` sets only `background-color`. So a well inside a field gets the legend's text on `sunken`: white on light `sunken` is 1.44:1, and the dark legend `#16140F` on dark `sunken` is 1.08:1 (EXECUTED).
  - Test 12 cannot see it, since white is not a restricted colour. Test 13 only compares against the four restricted values, so it cannot see it either.
  - Fix: `surface-sunken` writes `surface-plain`'s restorations first, then `background-color: var(--sunken)` and `color: var(--foreground)`. `031b`'s line redeclarations come after the restored `--border`. Test 1 asserts the declarations and their order. Test 13 also asserts that every text element in a well reaches its pair's floor (4.5:1 standard).
- **S3. Test 13: which ground, and a mutation that test 12 cannot catch** (test 13).
  - "Nearest painted ancestor ground" fits text. An edge sits on the ground outside its element. An `Input` in a well has its own white fill, and its `border-input` edge meets `sunken`; that is the main case the test exists for.
  - Fix: text is measured against the element's own ground if it paints one, else its nearest painted ancestor's. A border is measured against the nearest painted ground outside the element.
  - Add the mutations test 12 cannot see, in fixture files that hold no restricted class themselves:
    - `<div class="surface-sunken"><Badge variant="destructive">`;
    - `<div class="surface-sunken"><Input>`.
  - Say in the test's words that it checks only the states the examples render, and that today it finds only the index stages. Say also that a false positive, such as an icon in `destructive` (4.18 passes 3:1 as non-text), is resolved by a card, not by an exemption.
- **S4. Test 12's control list is incomplete** (test 12).
  - Items whose own files put a restricted colour on their parent's ground, and which the list misses (EXECUTED, search):
    - `badge`: the `destructive` and `success` variants are `text-destructive` and `text-success` with no fill;
    - `button`: `secondary` uses `border-input`;
    - `toggle`, `tabs` (the line trigger), `input-group`, `code-block`, `live-console`, `sidebar`'s menu button and `stage-card`.
  - Fix: derive the list mechanically. Any item whose files, or whose registry dependencies' files, hold a restricted class is a control for this rule. The lint reads it from the registry, so a new item joins by itself.
  - Also name the forms of `bg-sunken` the rule must catch: variant prefixes (`hover:`, `data-[…]:`), the variable forms (`bg-(--sunken)`, `bg-[var(--sunken)]`, `var(--sunken)` in a `.ts` string, as L17 and L21 already read), and `from-`, `via-`, `to-`, `fill-`, `stroke-`.
- **S5. The `restricted` block's shape** (decision 1a; test 4; Scope).
  - The retired `forbidden.measured` held text ratios that "must stay below 4.5" (`scripts/tokens.ts`). `restricted` mixes text (4.5) and an edge (3).
  - Fix:
    - Each row carries its kind, `text` or `nonText`, and test 4 and the validator use the kind's floor.
    - Add `scripts/tokens.ts`'s types and validator to Scope, and the site's contrast tables, which `029` decision 10 says follow the file.
    - Say whether `contrastPairs` counts restricted rows.
- **S6. `kuiper.css` and `surface-sunken`** (decisions 1 and 1b; `021` decision 11).
  - `kuiper.css` carries no utilities. So an app without Tailwind gets `--sunken`, but not S2's restorations, and later not `031b`'s line redeclarations. Yet the role's words say "Paint it with surface-sunken".
  - Fix: `kuiper.css`'s header comment, and the role's row on `/foundations/tokens/`, give the declarations to copy.

**Q1 is now B: what to change.** Measured tile widths, from `md` (EXECUTED, `widths.ts`): 345 at 768, 463 at 1023, **218 at 1024** (three columns start), 266 at 1180, 297 at 1280, 293 at 1440 and above. Each tile has a 1 px border. `--spacing` is 0.25 rem, so `p-2` is 8 px.

1. **Decision 3** becomes B.
   - The tile keeps `card`, the one radius and the 1 px transparent border, and gains `md:p-2`.
   - The stage takes the one radius: `md:rounded-none` becomes `md:rounded`. It keeps `overflow-hidden`, so the picture is clipped to the radius.
   - The words go from `md:p-4` to `md:px-2 md:pt-3 md:pb-2`. That puts them 16 px from the tile's edge, aligned with the stage's inner content, as `png/b-1440-*.png` shows.
   - The 8 px corner radius sits 8 px inside an 8 px outer radius. Under the one-radius rule the corners are not concentric; the exhibit shows this, and the checkpoint should look at it.
2. **The picture box** at 1440 is 275 × 172, down from 291 × 182: scale 0.573 instead of 0.606. At 1024 it is 200 wide, down from 216.
3. **The 9 px floor.** The script's `SHOWN = 300 / 480` assumes a 300 px tile. Today the tile is already 291 at 1440 and 216 at 1024–1279. B makes them 275 and 200, so a picture at the floor shows 9 px text at 8.3 px (1440) and 6.0 px (1024).
   - Fix: decide `SHOWN` against B's width at 1440, 275 / 480. Then `text-sizes.json` and the crops near the floor change; test 9 and the regeneration record them.
   - Or record in decision 7 that the floor is measured at 300 px and is not met at three columns below 1280. That gap is older than this spec (`018`).
4. **The window's radius** follows the shown width: `--radius` × 480 / 275, 14 px, not 13. Write it as a formula of the shown width.
5. **ΔE at each edge.**
   - From `md`, the stage meets only the mat: ΔE 10.46 in light, 6.36 in dark, on all four sides.
   - The tile's outline is mat against page: 4.92 in light, **3.69 in dark**, all round.
   - So B removes A's weak dark top edge (stage against page, 2.74).
   - Below `md`, the row form is unchanged: the picture box sits on the page at 5.92 and 2.74.
6. **Decisions 5 and 8, test 8.**
   - The transparent border stays on the tile from `md` and on the row's picture box below `md`. The inset stage gets none. Under forced colours the mat and the stage both become `Canvas`, and the picture still shows its own ground.
   - Decision 8 lists the class changes in item 1.
   - Test 8 is unchanged in its assertions. Add a hover reading with the padding, so no alpha appears on the mat.
7. **Test 5.**
   - At 1440: ΔE(stage, tile) ≥ 2.5, and **ΔE(tile, page) ≥ 2.5** (4.92, 3.69). Drop ΔE(stage, page) at 1440: they share no edge.
   - At 390: ΔE(stage, page) ≥ 2.5, as now.
   - Add geometry: from `md`, the stage's box is inset 8 px (± 0.5) from the tile's padding box on the left, top and right, and its `border-radius` equals `--radius`.
8. **Tests 6, 6a and 7** read the 480 × 300 files, so they are unchanged. Re-measure them if item 3 changes the crops.
9. **Bytes** (decision 9). The assets keep their size, so the +1.56% stands unless item 3 re-fits pictures. The CSS adds two padding classes, nothing measurable. The builder re-measures `index` under `024`.
10. **Words to change.**
    - Decision 2's "one weakness is dark" paragraph: B's outline is 3.69 all round.
    - Decision 3's A/B/C list and "*B is the fallback*".
    - Risks: "B is the fallback". With B chosen, the fallback for the dark stage is Q3's deeper `#080705`.
    - Criterion 5 ("card A"), criterion 10 ("If A's dark top edge reads weak"), Q1's text, and the Kind and Status lines.

**Verdict: revise.** S1 is High, and S2 to S4 are Medium. Each has its fix above. S5 and S6 are write-ins. The B rewrite above is mechanical. The restricted-pairs route itself, the public role's placement in `src/app.css`, the `restricted` key and the lane order are sound.

## Third look and cross-spec check, 2026-11-15

Reviewed:

- `031a` as revised for S1 to S6, card B, and `031b`'s re-check items R1 and R3 (660 lines);
- `031b` decisions 9, 11 and 22, and its "Re-check response";
- `031`'s header, decisions 5, 6 and 20, its swatch table, and `research/2026-11-15-high-contrast/tree.draft.json`;
- the B forecast in `…/scratchpad/031a-rev/` (`thumbs-b.ts`, `out-b/`).

Re-ran, mine: the B forecast's bytes, text sizes, frame medians, view shares and middle-line runs (`runs-b.py` and inline readers), and the ratios of `031`'s exact swatches and `031b`'s disabled roles on `sunken`. No build, no git write, no port 5199.

**(1) S1 to S6, and card B: all resolved.**

- **S1.** The status fills, `caution` and every chart colour are restricted on `sunken` in every context. The allowed set is `foreground`, `muted-foreground` and `primary` text, `ring`, and `sunken-line`. `031` re-derives three swatches.
- **S2.** `surface-sunken` restores the field roles, then sets the ground and `color: var(--foreground)`. Test 13 checks the text floor with a field fixture.
- **S3.** Text is read against its own ground; borders and fills against the ground outside the element. The cross-file fixtures are in separate files.
- **S4.** The restricted classes come from the `restricted` block, and the restricted items from the registry through dependencies. Every prefixed, variable and gradient form of `sunken` is caught.
- **S5.** Each row has a kind and a floor. The validator, the site's contrast tables and the pair count are in Scope.
- **S6.** `kuiper.css`'s header and the tokens page give the declaration list to copy.
- **B, items 1 to 10:** each applied. I reproduced the forecast exactly (EXECUTED):
  - 42 of 148 text sizes change, and the least is 9.00;
  - bytes 647,178 → 653,900, **+1.04%**;
  - frame medians at most ΔE 1.11 and 0.69 from `sunken`, and at least 6.13 and 2.94 from the page;
  - views keep at least 6.7% of their own page (`name-strip`, light);
  - the longest stage-coloured run across a view's middle lines is 13 px.
- One note on the forecast: `thumbs-b.ts` still draws the window at 13 px, while decision 7 now says 14 (`--radius` × 480 / 275). The figures do not depend on it. The builder's run uses the formula.

**(2) `surface-sunken`'s list: one substantive match, and one mechanical mismatch, now fixed.**

- The two specs agree on substance:
  - the restorations;
  - `background-color` and `color`;
  - then `031b`'s `--background`, `--border`, `--groove-line` and `--sidebar-border`, last;
  - `031b` extending `SURFACE_ROLES` with `background`, `groove-line` and `sidebar-border`, so `surface-plain` restores them;
  - `card` taking `surface-plain`;
  - the capture rule's five lines, identical in both.
- The mismatch was in the text:
  - `031b` decision 11 printed `surface-sunken` as five lines, with no restorations and no `color`, as if that were the whole utility.
  - `031a` decision 1b said the restorations are "generated from `SURFACE_ROLES`". Once `031b` extends that list, a plain reading would write `--background`, `--border`, `--groove-line` and `--sidebar-border` twice. The second copy wins, so the result is harmless, but test 1 asserts the list exactly.
  - Both are fixed below.

**(3) The restricted list.**

- **`031a` and `031b` now agree.** I confirmed `disabled-foreground` at 2.76 against 3 and `disabled-edge` at 1.39 against 1.5 on light `sunken`; the dark disabled text reads 5.60.
- **Three mechanical mismatches, now fixed:**
  - `031b` said the two disabled pairs are "by rule in both schemes". They are measured in light.
  - `031b` said the rows go in "in `031a`'s own record", while `031a` says `031b` writes them. Only `031b` can write them, since the roles do not exist at `031a`'s landing and the validator rejects an unknown role. Both specs now say so.
  - `031`'s three lists of restricted pairs (header, decision 6, Q1's notice) omitted the `caution` fill and the two disabled pairs.
- **The swatches.** `031a`'s knock-on table now quotes `031`'s exact derived values, not estimates: `ink-soft-more` `#3D424D` (7.01), `blue-more` **`#1D2AB8`** (7.04; the table had `#1C2AB8`), and `line-more` `#645D50` (4.53). I re-measured each on `#DCD7CA`.
- **`031`'s `tree.draft.json` differs from the block, and I did not edit it.** It is a research input, not a specification.
  - It lacks the `caution` row and the two disabled rows.
  - It marks light `chart-3` "by rule", where it is measured (1.40).
  - It spells the kind `non-text`. The contrast file's key is `nonText`, now the spelling in `031a`'s table.
  - None of this moves a swatch. Restricted pairs are excluded from the derivation, and none of these is an allowed row. `031`'s builder reads the real contrast file at its landing, as `031`'s header says ("theirs wins").
- `031`'s table gives a few ratios one hundredth low (5.13, 4.88 and 3.95, against my 5.14, 4.89 and 3.96 with exact CIE constants). That is immaterial, and left as it is.

**(4) Lane T order.** No contradiction. Each spec reads `031a`, then `031b`'s token edit, then `031`:

- `031a`'s header: "after `029`, before `031b` and `031`";
- `031b`'s header, Depends, Blocks and decision 22: after `031a`, before `031`;
- `031`'s header and decision 20.

The roadmap row's lanes remain the design lead's to update.

**Edits made** (text only; no decision changed):

1. `031a` Knock-ons, `031` item 2: the swatch table now gives `031`'s exact values. `#1C2AB8` → `#1D2AB8`, 7.05 → 7.04. "These are estimates" → "`031` has derived them exactly", with the review's estimates kept in brackets.
2. `031a` decision 1a: each row's kind is `text` or `nonText`. The disabled rows read `text` and `nonText` "(disabled; `031b`'s floor)".
3. `031a` decision 1b, and test 1: the restorations are `SURFACE_ROLES` "less the roles the well sets itself (`border` now; after `031b`, also `background`, `groove-line` and `sidebar-border`)", so no role is written twice.
4. `031b` decision 11: the disabled pairs are "measured in light (2.76 against 3; 1.39 against 1.5) and by rule in dark". The paragraph now says this specification writes the two rows into the contrast file in its lane-T edit.
5. `031b` decision 11: the `surface-sunken` block is now the full combined list, in `031a`'s order, with comments on who writes which line, and a note that this spec replaces `031a`'s `--border` restoration.
6. `031b` "Re-check response", R3: the same correction to who writes the rows.
7. `031` header, `031a` bullet: the `caution` fill and `031b`'s two disabled pairs are added to the restricted list.
8. `031` header, `031b` bullet: "stay out of `kuiper.contrast.json`" → "have no text or non-text rows in `kuiper.contrast.json` (their two pairs on `sunken` are in the `restricted` block)".
9. `031` decision 6, the "every restricted pair" bullet: the `caution` fill and the two disabled pairs added.
10. `031` Q1's notice ("What `031a` restricts…"): the same.

**Verdict: ready.** Fit to build. Nothing substantive stands among the three specifications. The mismatches were mechanical, and are fixed as listed above. The one item left is the builder's: `031`'s `tree.draft.json` is behind the contrast file in four places, and is superseded by the real file at `031`'s landing.
