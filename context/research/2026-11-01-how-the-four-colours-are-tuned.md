# How the four colours are tuned

- **Status:** complete
- **Date:** 2026-11-01
- **Author:** the design lead's researcher
- **Question:** How should Pluto's four-colour palette be tuned so that it is ownable, works quiet (apps) and loud (marketing stages), and passes WCAG 2.2 AA in light and dark? The four-dot mark keeps a blue, a red, a yellow and a green, in that reading order. Everything else about colour is open: the exact hues, the neutrals, a darker stage ground, the tonal ramps and the light effects.
- **What it blocks:** the identity colour board, and specification 009.
- **Data:** [`2026-11-01-palette-candidates.json`](2026-11-01-palette-candidates.json), the five candidates as measured. The option boards read it. Its keys are listed in §7.

## How to read this memo

Every claim carries a label.

- **EXECUTED:** we ran it and saw the result. The runs were on 2026-11-01, on macOS (Darwin 25.5.0, arm64), with Bun 1.3.14. WCAG ratios come from this repository's own `scripts/contrast.ts`, imported read-only: relative luminance, truncated to two decimals, never rounded up. Everything else (OKLCH, APCA, colour-vision simulation, the solvers) was a throwaway script outside this repository.
- **READ:** a source says so. Each web source was read on 2026-11-01 and is linked in Sources. Local files were read the same day, at `v0.8.0` (`6fbdf99`).
- **INFERRED:** our reasoning.

**A constraint the owner gave while this memo was in progress.** The only design constraint is "we need to compete with Google" (READ, the owner through the coordinator, 2026-11-01). The design book's colour laws are prior art, not limits. Those laws are: paper and ink cover at least 88% of a surface; one accent per surface; the four hues together only in the mark and in data figures; no gradients between brand hues; no colour dots on dark grounds. A candidate may break them if it says which it keeps and which it drops. The mark still keeps blue, red, yellow and green. WCAG 2.2 AA still holds in both themes.

**What this memo builds on, and does not repeat.** `2026-11-01-how-a-code-palette-is-made.md` §1.7 already read OKLCH and APCA, and defined OKLCH, ΔE, relative luminance, contrast ratio, APCA's Lc and colour-vision deficiency (CVD). Those definitions hold here. `2026-11-01-how-brands-colour-their-code.md` covered code colour. This memo is about the brand hues themselves.

Scratch work, not kept, in a throwaway folder: `colour.ts` (OKLab and OKLCH conversion, gamut mapping, APCA 0.0.98G-4g, CVD simulation), `probe.ts` (today's values against Google's and Microsoft's), `tune.ts` and `spectral-search.ts` (hue searches), `defs.ts` (the five candidates' starting points), `build.ts` (the solvers and every measurement), `print.ts` (the tables in §5 and §6). Nothing was written to this repository except this memo and its JSON.

### Terms of art

- **Mark hue.** The colour of one dot of the four-dot mark on a light ground.
- **markStage.** The same dot's colour on a dark ground (ink or the stage). It may be lifted so it stays visible.
- **Text-safe.** A darker version of a hue that passes 4.5:1 as text on paper, raised white and wash.
- **Lifted.** A lighter version of a hue that passes as text on ink, ink-raised, ink-wash, the stage and stage-raised.
- **Stage.** A full-bleed dark section, darker than ink, where one object is lit and shown (from `2026-11-01-what-a-product-site-needs-to-compete.md`).
- **Bloom.** Soft light behind an object: here, a pale tint of one hue at low opacity over the stage. **Rim:** the lit edge of a card.
- **Tone.** Lightness on a 0 to 100 scale, as CIE L\*. It is what Material's HCT calls tone. Unlike OKLCH's L, tone is a direct function of relative luminance. Two colours with the same tone have the same WCAG contrast against any ground.
- **HCT.** Hue, chroma, tone: Google's colour space for Material 3 (§1.1).
- **Contrast-locked ramp.** A ramp of steps where each step is a fixed tone. Step 700 then has the same contrast in every hue (§4).
- **Gamut.** The colours a display can show. Here, sRGB. A colour outside it is brought in by lowering its chroma until it fits.
- **Helmholtz–Kohlrausch effect.** Saturated colours look brighter than their luminance says (§1.4).
- **Just-noticeable difference.** The smallest ΔE a viewer notices side by side. For ΔE in OKLab ×100, about 2 is a common working figure (INFERRED, not a measured threshold here).
- **Band.** A gradient through the four mark hues in reading order (§6.4).

## In short

- **Today's red, amber and green are almost Google's.** Measured in OKLab, Tombaugh Red is 2.3 ΔE from Google's red, Sputnik Amber is 4.0 from Google's yellow, and Hydra Green is 3.4 from Google's green. Only Charon Blue is clearly Pluto's own, at 12.2 (EXECUTED, §3). Side by side, three of the four dots would look borrowed (INFERRED).
- **Google's own set is close to equal lightness.** Its blue, red and green sit at OKLCH L 0.626 to 0.648; only its yellow is lighter, at 0.83 (EXECUTED). So an "equal lightness" set lands near Google unless the hues move (EXECUTED, §5.5).
- **The brands that use primary colours without looking childish simplify, tune for the screen and lean on structure** (READ, §1.3). Slack cut eleven colours to four, "optimized to look better on screen". Google "pushed the vibrancy of the red, green, and yellow" and set them in geometric forms. Mastercard made its overlap additive and brighter.
- **Yellow can never be a graphic on paper.** In every candidate the light-ground yellow measures 1.35 to 2.17 on paper and raised white. That is below the 3:1 a graphic needs (EXECUTED). The mark itself is a logo and exempt (READ, WCAG 2.2 SC 1.4.3). A yellow data mark needs an outline or a label. Only Spectral escapes this, by turning its yellow into a gold (`#9A7300`).
- **Lifting to the WCAG floor is not enough on dark grounds.** Lifted colours solved to 4.6:1 score only APCA Lc 42 to 46 on ink and the stage. APCA asks Lc 60 for content text. Each candidate's lifted colours were therefore also lifted to Lc 60 on ink and the stage (EXECUTED, §4). This confirms, for the brand hues, what the code-palette memo found for code.
- **A ramp built on tone makes contrast predictable.** Through step 900, the four hues' contrast on paper differs by at most 0.12 at any one step, in every candidate. The widest spread at any step, on any ground, is 0.26. Step 700 is text on light (4.85 or more on paper). Step 500 is text on dark (6.06 or more on ink). Step 600 is a graphic on both (3.61 or more on paper, 4.45 or more on ink) (EXECUTED, §5).
- **Blue and yellow cannot be blended directly.** At the OKLab midpoint of blue and yellow, only 9% to 26% of the chroma survives. The middle is grey in every candidate (EXECUTED, §6.4). A band that walks the four in reading order through OKLCH keeps 87% to 98% of its chroma. In Spectral it also keeps one lightness, 0.578 to 0.582 (EXECUTED).
- **Five candidates, each measured in full** (§5). All five pass every counted pair: 74 of 74 text, fill and control-edge pairs. The only graphic failures are the yellow mark on light grounds, noted above (EXECUTED).

| Candidate | Idea | Blue, red, yellow, green (light) | Nearest to Google / Microsoft (ΔE) | Contrast |
|---|---|---|---|---|
| Charon, kept | Today's four, measured as they stand | `#2456E6` `#E23A2E` `#F0AE12` `#1E9E56` | 2.3 / 3.8 | 74 of 74; graphics 18 of 20 |
| Signal | Bright and saturated, each hue a few degrees cooler, with blue, red and green equal in weight | `#3C5FFB` `#DC2347` `#F6D507` `#00976D` | 6.1 / 6.9 | 74 of 74; graphics 18 of 20 |
| Deep Field | Ink-forward, with deeper hues and a darker, cooler ink | `#2D48D4` `#C92035` `#F19E20` `#008058` | 7.8 / 7.3 | 74 of 74; graphics 18 of 20 |
| Warm Paper | Cream paper, warm ink, each hue a few degrees warmer | `#0065CC` `#C94500` `#F89F26` `#3F8439` | 7.2 / 6.8 | 74 of 74; graphics 18 of 20 |
| Spectral | All four at OKLCH L 0.58: one mark for every ground | `#4F6BEE` `#D73246` `#9A7300` `#009068` | 5.6 / 8.9 | 74 of 74; graphics 20 of 20 |

## 1. What was read

### 1.1 Google: the four colours and Material 3's tonal palettes (READ)

- **The logo's colours.** Google's own brand pages do not publish hex values for the logo. Third-party sites agree on `#4285F4`, `#EA4335`, `#FBBC05` and `#34A853`; they disagree on Pantone and CMYK. We use the hex values only as a reference to measure distance from.
- **How they were tuned.** Google's account of its 2015 identity: "We adjusted and pushed the vibrancy of the red, green, and yellow to maintain saturation and pop." And: "The color proportions convey the full spectrum of the logotype and are sequenced to aid eye movement around the letterform." The design pairs "the mathematical purity of geometric forms" with "the childlike simplicity" of schoolbook letters, and keeps "the multi-colored playfulness" of the old mark.
- **Others may not use them.** Google's brand resource centre says partners may not use Google's brand colours in their own materials, outside approved logos and badges.
- **HCT.** Material's colour library describes HCT as "a perceptually accurate color measurement system". Tone is "Lightness. Ranges from 0 to 100." Its header states the rule this memo leans on: "A difference of 40 in HCT tone guarantees a contrast ratio >= 3.0", and "a difference of 50 guarantees a contrast ratio >= 4.5". A `TonalPalette` holds colours "constant in hue and chroma, but vary in tone".
- **Light and dark.** Material's Android colour guide maps the primary role to tone 40 in the light baseline and tone 80 in the dark one. When the theme changes, "The luminance level value [0, 100] will be shifted for each color role", while hue and chroma stay the same. Dark surfaces sit at neutral tone 6.

### 1.2 Microsoft: the four squares and Fluent's brand ramp (READ)

- **The logo.** Microsoft's 2012 announcement: "The symbol's squares of color are intended to express the company's diverse portfolio of products." The wordmark uses "the Segoe font". The announcement names no colours. Third-party sites agree on `#F25022`, `#7FBA00`, `#00A4EF` and `#FFB900`, with a grey wordmark.
- **Fluent's brand ramp** has sixteen steps, keyed 10 to 160 (`brandWeb` 10 is `#061724`, 80 is `#0f6cbd`, 160 is `#ebf3fc`). Fluent 2's colour page: "Avoid overusing brand colors or using them on large surfaces." And: "In dark mode, the colors of the shared palette shift in saturation and brightness."

### 1.3 Primary-colour brands that do not look childish (READ)

- **Slack**, before and after its new identity. Its own announcement: the old logo "was 11 different colors" and, "if placed on any color other than white, or at the wrong angle, or with the colors tweaked wrong, it looked terrible." Pentagram's account of the new identity: "The updated palette features four primary colors, more manageable than the original's eleven." And: "These have been optimized to look better on screen." Aubergine stays "as an accent color".
- **Mastercard.** Pentagram's account: the old overlap of red and yellow "created a darker color"; the new symbol "uses an additive mix", and its orange is "a perfect midpoint between red and yellow". "81 percent of consumers spontaneously recognized the new symbol without the inclusion of the Mastercard brand name."
- **eBay.** Only secondary sources were found. They agree that the 2012 logo kept its red, blue, yellow and green, with thinner letters set in one line. They disagree about whether the shades changed. We treat eBay as unread for colour values.

INFERRED from these: none of these brands looks childish because of its hues. The seriousness comes from four things around the hues. There are few colours, each tuned for the screen. The hues sit in a strict structure (Google's geometry, Microsoft's grid, Mastercard's circles). Large neutral fields surround them (Microsoft's grey wordmark; Fluent's "avoid … large surfaces"). And where colours meet, the meeting is designed (Mastercard's additive overlap). Pluto's mark already has the structure, a strict 2×2 grid.

### 1.4 Perceptual uniformity and contrast models (READ)

- **Oklab** is "designed to be simple to use, while doing a good job at predicting perceived lightness, chroma and hue". Its goal: lightness, chroma and hue "should be perceived as orthogonal, so one can be altered without affecting the other two", and "Blending two colors should result in even transitions." It assumes "normal well lit viewing conditions" and a D65 white.
- **APCA.** Its author: WCAG 2 "far overstates contrast for dark colors to the point that 4.5:1 can be functionally unreadable when a color is near black". Hence "WCAG 2.x contrast cannot be used for guidance designing "dark mode"." WCAG 3, which may adopt it, "is still in development". APCA is not normative, and WCAG 2.2 remains the test that binds this project (constitution §4.4).
- **The Helmholtz–Kohlrausch effect.** Saturation "is perceived as part of the color's luminance". Reds, pinks and blues show it strongly; green and yellow show it least.
- **WCAG 2.2 SC 1.4.3** exempts logos: "Text that is part of a logo or brand name has no contrast requirement." INFERRED: the four dots are not text, but a logo is not a graphic "required to understand the content" under SC 1.4.11 either. So the mark is exempt. A data figure that uses the same hues is not.

### 1.5 Colour on dark grounds (READ)

- Google's Material dark-theme codelab: "More saturated colors tend to visually "vibrate" against darker backgrounds, making them harder to read." Pure white would vibrate too, so "High priority text isn't pure white". "In Material dark themes, the bottom-most layer of the interface is typically a dark gray with the hex value #121212."
- Material 3 takes the dark primary from tone 80, a light step of the same hue (§1.1).

INFERRED: on a dark ground, a hue should rise in lightness and give up some chroma. That is what "lifted" means here, and what Pluto's lifted primitives already do. A near-black stage (the lab's `#050608`) is darker than Material's `#121212`. A stage that dark makes a lifted hue look even brighter by contrast, so the stage's own text should not be pure white either. That is why paper (`#F7F7F4` or its candidate equivalent), not `#FFFFFF`, is the stage's text.

## 2. What the reading means for Pluto (INFERRED)

1. **Ownership lives in the set, not in any one hue.** A blue, a red, a yellow and a green are everyone's. A set becomes Pluto's through three things: its exact hue angles, its lightness relationships, and its neutrals. The candidates move all three, and each states its distance from Google and Microsoft.
2. **Move hue angles in one direction.** Turn every hue a few degrees cooler, or every hue warmer, and the set reads as one family. It also stops reading as Google's (Signal and Warm Paper, §5).
3. **Give blue, red and green one lightness band; let yellow be light.** Yellow cannot be dark and still look yellow. The other three can share a band, so no dot looks heavier than another. The Helmholtz–Kohlrausch effect argues for blue and red slightly darker than green.
4. **Build ramps on tone, not on OKLCH L.** WCAG contrast depends only on relative luminance. A step defined by tone has one contrast in every hue, so a rule such as "text uses 700" holds for all four. That is Material's HCT idea; we borrow the idea, not its values.
5. **Lift on dark to APCA Lc 60, not just WCAG 4.5.** The WCAG floor gives dim hue text on ink (§4).
6. **Let neutrals carry the seriousness.** Paper, ink and the stage cover most of any surface in every candidate, even where a candidate drops the 88% rule. The hues are bright; the fields around them are quiet.
7. **Design where colours meet.** If an expressive surface shows the four together, show them as light (bloom), or as a band in reading order. Never as a direct blend of blue and yellow, which turns grey (§6.4).

## 3. Today's palette, measured (EXECUTED)

| Hue | Hex | OKLCH (L C h) | ΔE from Google | ΔE from Microsoft |
|---|---|---|---|---|
| Charon Blue | `#2456E6` | 0.517 0.224 264.7 | 12.2 | 19.8 |
| Tombaugh Red | `#E23A2E` | 0.603 0.206 28.9 | **2.3** | 5.3 |
| Sputnik Amber | `#F0AE12` | 0.792 0.161 80.5 | **4.0** | **3.8** |
| Hydra Green | `#1E9E56` | 0.616 0.151 152.5 | **3.4** | 13.1 |

For comparison: Google's four are L 0.63, 0.626, 0.83 and 0.648, at hues 260, 29.1, 84 and 148.5. Microsoft's are L 0.685, 0.651, 0.829 and 0.721, at hues 239.6, 35.6, 81 and 128.9.

- **Contrast:** today's palette passes every counted pair (74 of 74, §5.1). Amber as a graphic fails on paper (1.81) and raised white (1.95). The book already exempts it for charts, where amber series are labelled directly (READ, `tokens/pluto.tokens.json`, `contrast.exceptions`).
- **The red as a fill.** White on the mark red `#E23A2E` is 4.30, below 4.5. The shipped solid red button already uses the text-safe `#C42A1F` (5.67) (READ, `destructive-foreground` on `destructive` in the token file's contrast list).
- **On dark, the lifted red and green nearly merge for a deuteranope.** `#FF7D73` and `#4CC982` are 2.8 ΔE apart under simulated deuteranopia (EXECUTED). The other four pairs on dark are 7.1 or more apart. The icon on ink uses these lifted dots (READ, `decisions.md`, "The icon on ink").
- **The lifted colours sit well above the WCAG floor,** at 6.85 to 9.27 on ink, but not above APCA's. The lifted blue scores Lc 49.7 on ink and 46.2 on ink-wash, under the Lc 60 that APCA asks for content text.

## 4. How each candidate was built and measured (EXECUTED)

Each candidate starts from five choices: four mark hues (as OKLCH, or today's hex) and its neutral grounds (paper, raised, ink, stage). The script derives everything else and measures it from the final hex, never from the intended OKLCH.

- **Gamut.** An OKLCH colour outside sRGB is brought in by lowering its chroma (binary search), keeping L and hue.
- **Text-safe.** The mark is its own text if it reaches 4.6:1 on paper, raised and wash. Otherwise the script takes the lightest colour at the same hue and chroma that does. Signal's yellow text is solved at hue 80, not its mark's 98, because the darkened lemon turned olive (`#786700`).
- **Lifted.** The mark is its own lifted colour if it passes. Otherwise the script takes the darkest colour at the same hue and chroma that reaches two things: 4.6:1 on ink, ink-raised, ink-wash, the stage and stage-raised, and APCA |Lc| 60 on ink and on the stage. Solved to the WCAG floor alone, the lifted blue, red and green scored only Lc 42 to 46 on ink and the stage (EXECUTED). The Lc 60 rule raised them to Lc 60.0 to 60.6 on ink, 60.6 to 61.3 on the stage, and 56.5 to 57.7 on ink-wash, which the rule does not include.
- **markStage.** The mark is its own stage dot if it reaches 3.1:1 on ink, ink-raised and the stage. Otherwise the script takes the darkest colour at the same hue that does.
- **Derived neutrals.**
  - wash: ink at 6% over paper (alpha byte `0F`), as `001` built it;
  - ink-wash: paper at 10% over ink (byte `1A`);
  - ink-raised: ink plus 0.04 in OKLCH L; stage-raised: the stage plus 0.05;
  - stageLine and stageLineStrong: paper at 10% and 14% over the stage, the lab's two opacities;
  - inkSoft and paperSoft: the dimmest neutral, at the candidate's neutral hue, that reaches 6.0 on its weakest ground. Muted text keeps today's legibility (inkSoft 6.79 on wash, paperSoft 6.13 on ink-wash). Solved to 4.6 instead, Signal's inkSoft came out at `#636874`, 5.20 on paper against today's 7.63;
  - stageMuted: the dimmest neutral that reaches 4.6 on the stage, stage-raised and under every bloom;
  - lineInput, paperLineInput, stageLineInput: a control's edge, 3.1 on its grounds.
  Charon, kept uses today's shipped neutrals and the lab's `#050608` and `#9AA0AD`.
- **Targets.** 4.6 and 3.1, not 4.5 and 3. The headroom means truncation to two decimals never tips a pair below the line.
- **Ramps.** Eleven steps, 50 to 950, at tones 97, 94, 88, 80, 71, 62, 53, 45, 37, 28 and 19. Hue is held. Chroma is the lower of 95% of the sRGB maximum and the mark's own chroma, with a taper: tints pale toward white, shades ease toward black. In every candidate but Charon, kept, yellow drifts up to 20 to 24 degrees warmer below its own tone, so its shades read as ochre, not olive.
- **Bloom and rim.** Bloom: `oklch(0.86 0.09 h)` at 22% over the stage. That is close to the lab's blue bloom, `rgba(200,212,255,.22)`. Rim: `oklch(0.93 0.04 h)` at 28% over stage-raised. Paper text and stageMuted text are measured on each hue's bloom.
- **The counted pairs, 74 per candidate.**
  - Light (28): ink and inkSoft on paper, raised and wash; each hue's text on the same three; lineInput on paper and raised; raised text on each text-safe hue as a button fill; and the better of raised or ink on each mark hue as a panel with large text (3:1).
  - Dark (24): paper and paperSoft on ink, ink-raised and ink-wash; each lifted hue on the same three; paperLineInput on ink and ink-raised; ink text on each lifted hue as a button fill.
  - Stage (22): paper and stageMuted on the stage and stage-raised; each lifted hue on both; stageLineInput on both; paper and stageMuted on each hue's bloom.
- **Graphics, 20 per candidate, reported apart.** Each mark hue on paper and raised; each markStage on ink, ink-raised and the stage. They are reported apart because the mark is a logo and exempt (§1.4). They bind a hue used as a data mark or a fill's edge.
- **Decorative, no minimum.** stageLine, stageLineStrong and the rims, against the stage. A divider is not a control's edge. A lit card that is also a control carries stageLineInput as well.
- **Balance.** The four marks' OKLCH L and C spreads; the nearest pair in ΔE; the nearest pair under simulated protanopia, deuteranopia and tritanopia (Machado, Oliveira and Fernandes 2009, severity 1, in linear sRGB).
- **Distance.** ΔE in OKLab ×100 from Google's and Microsoft's hue in the same role.
- **Gradients.** The OKLab midpoint of six pairs of marks, with the share of chroma it keeps. And the band (§6.4).

## 5. The five candidates

Each section gives the rules the candidate keeps and drops, and what it costs. The values, the contrast grid, the fills, the bloom and the ramps follow. In the grids, a blank cell is a pair not measured, because that colour is not used on that ground.

### 5.1 Charon, kept

*Today's four, measured as they stand, with the lab's stage added.*

- **Keeps:** every law of the design book: paper and ink at 88% or more, one accent per surface, the four together only in the mark and data figures, no gradients between brand hues, and lifted dots on ink for the icon (`decisions.md`, 2026-11-01).
- **Drops:** nothing.
- **Measured (EXECUTED):** 74 of 74 counted pairs pass. Yellow fails as a graphic on light grounds, as noted. The lowest text ratio is red text on wash, 4.71. The stage dots are the lifted colours, 6.85 to 10.39 on ink and the stage: the brightest stage dots of the five.
- **What it costs (INFERRED):** three dots within 2.3 to 4.0 ΔE of Google's. Blue (L 0.517) sits 0.099 darker than green (0.616), so the blue dot reads heaviest. On dark, the lifted red and green are 2.8 apart under deuteranopia.

#### Charon, kept (`charon-kept`): values

| Hue | mark (light grounds) | markStage (dark grounds) | text | lifted | bloom tint, 22% | rim tint, 28% |
|---|---|---|---|---|---|---|
| Charon Blue | `#2456E6` (0.517 0.224 264.7) | `#7A9BFF` (0.709 0.151 268.6) | `#2456E6` (0.517 0.224 264.7) | `#7A9BFF` (0.709 0.151 268.6) | `#BBD1FF38` | `#DDE8FF47` |
| Tombaugh Red | `#E23A2E` (0.603 0.206 28.9) | `#FF7D73` (0.738 0.16 26.2) | `#C42A1F` (0.536 0.192 29.2) | `#FF7D73` (0.738 0.16 26.2) | `#FFBFB538` | `#FFE0DA47` |
| Sputnik Amber | `#F0AE12` (0.792 0.161 80.5) | `#F0AE12` (0.792 0.161 80.5) | `#85600B` (0.514 0.103 81.1) | `#F0AE12` (0.792 0.161 80.5) | `#F0CB8C38` | `#F6E6CB47` |
| Hydra Green | `#1E9E56` (0.616 0.151 152.5) | `#4CC982` (0.748 0.152 155) | `#136E3E` (0.476 0.112 154.1) | `#4CC982` (0.748 0.152 155) | `#A4E3B538` | `#D5F0DB47` |

| Neutral | Value | | Neutral | Value |
|---|---|---|---|---|
| paper | `#F7F7F4` (0.975 0.004 106.5) | | raised | `#FFFFFF` (1 0 0) |
| wash | `#EAEAE7` (0.936 0.004 106.5) | | ink | `#14161C` (0.201 0.012 270.7) |
| inkRaised | `#1E2129` (0.248 0.016 269) | | inkWash | `#2B2D32` (0.297 0.009 268.4) |
| inkSoft | `#4A4F5C` (0.428 0.022 268.8) | | paperSoft | `#A9ADB8` (0.748 0.016 269.9) |
| lineInput | `#7C808B` (0.6 0.017 269.9) | | paperLineInput | `#787C8A` (0.588 0.022 273) |
| stage | `#050608` (0.122 0.006 261.6) | | stageRaised | `#0E1012` (0.172 0.005 248.1) |
| stageLine | `#1E1F20` (0.239 0.002 247.9) | | stageLineStrong | `#272829` (0.276 0.002 247.9) |
| stageMuted | `#9AA0AD` (0.705 0.02 265.9) | | stageLineInput | `#5E626B` (0.496 0.015 266.6) |

#### Charon, kept: contrast (WCAG 2.2, truncated; text needs 4.5, a graphic or control edge 3)

| Foreground | paper | raised | wash | ink | inkRaised | inkWash | stage | stageRaised |
|---|---|---|---|---|---|---|---|---|
| ink | 16.84 | 18.08 | 15.00 |  |  |  |  |  |
| inkSoft | 7.63 | 8.18 | 6.79 |  |  |  |  |  |
| blue.text | 5.51 | 5.91 | 4.90 |  |  |  |  |  |
| red.text | 5.29 | 5.67 | 4.71 |  |  |  |  |  |
| yellow.text | 5.32 | 5.71 | 4.74 |  |  |  |  |  |
| green.text | 5.87 | 6.31 | 5.23 |  |  |  |  |  |
| lineInput | 3.67 | 3.94 |  |  |  |  |  |  |
| blue.mark | 5.51 | 5.91 |  |  |  |  |  |  |
| red.mark | 4.01 | 4.30 |  |  |  |  |  |  |
| yellow.mark | 1.81 **fail** | 1.95 **fail** |  |  |  |  |  |  |
| green.mark | 3.21 | 3.45 |  |  |  |  |  |  |
| paper |  |  |  | 16.84 | 14.99 | 12.83 | 18.88 | 17.76 |
| paperSoft |  |  |  | 8.05 | 7.17 | 6.13 |  |  |
| blue.lifted |  |  |  | 6.85 | 6.10 | 5.22 | 7.68 | 7.22 |
| red.lifted |  |  |  | 7.26 | 6.46 | 5.53 | 8.13 | 7.65 |
| yellow.lifted |  |  |  | 9.27 | 8.25 | 7.06 | 10.39 | 9.77 |
| green.lifted |  |  |  | 8.59 | 7.65 | 6.55 | 9.63 | 9.06 |
| paperLineInput |  |  |  | 4.34 | 3.86 |  |  |  |
| blue.markStage |  |  |  | 6.85 | 6.10 |  | 7.68 |  |
| red.markStage |  |  |  | 7.26 | 6.46 |  | 8.13 |  |
| yellow.markStage |  |  |  | 9.27 | 8.25 |  | 10.39 |  |
| green.markStage |  |  |  | 8.59 | 7.65 |  | 9.63 |  |
| stageMuted |  |  |  |  |  |  | 7.72 | 7.26 |
| stageLineInput |  |  |  |  |  |  | 3.31 | 3.11 |

Fills: raised on blue.text (as a button fill) 5.91; raised on red.text (as a button fill) 5.67; raised on yellow.text (as a button fill) 5.71; raised on green.text (as a button fill) 6.31; raised on blue.mark (as a panel, large text) 5.91; raised on red.mark (as a panel, large text) 4.30; ink on yellow.mark (as a panel, large text) 9.27; ink on green.mark (as a panel, large text) 5.23; ink on blue.lifted (as a button fill) 6.85; ink on red.lifted (as a button fill) 7.26; ink on yellow.lifted (as a button fill) 9.27; ink on green.lifted (as a button fill) 8.59.

Under the bloom (each hue's tint at 22% over the stage): paper at least 11.67, stageMuted at least 4.77.
APCA |Lc| of the hue text colours (advisory): light 64.2 to 81, dark 46.2 to 64.3, stage 50.2 to 65.2.

Verdict: **74 of 74** counted pairs pass (text, fills, control edges); graphics 18 of 20 (light: yellow.mark on paper 1.81; light: yellow.mark on raised 1.95). Lowest text ratio 4.71.

#### Charon, kept: ramps (hex; OKLCH per step in the JSON)

| Hue | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| blue | `#F2F7FF` | `#E7EEFE` | `#CEDEFD` | `#ADC6FC` | `#89AEFB` | `#6592FA` | `#4477F6` | `#2B5EEB` | `#1947D6` | `#0A2EB6` | `#031793` |
| red | `#FFF4F3` | `#FEEAE6` | `#FDD3CD` | `#FDB5A9` | `#FC8F80` | `#F66959` | `#E64235` | `#CF251C` | `#AF130E` | `#880C09` | `#620604` |
| yellow | `#FFF5E6` | `#FEEBCC` | `#FDD797` | `#F7BD4C` | `#DFA421` | `#C18D1B` | `#A47715` | `#8A6310` | `#72510B` | `#573D07` | `#3E2A03` |
| green | `#E6FCEB` | `#D7F6DE` | `#BBE8C6` | `#96D4A7` | `#6BBF85` | `#3CA965` | `#18914E` | `#137A41` | `#0D6434` | `#084D26` | `#04371A` |

### 5.2 Signal

*Bright and saturated. Every hue turned a few degrees cooler: crimson, lemon, emerald, violet-blue. Blue, red and green sit in one lightness band so they carry equal weight. Built to be loud on a stage.*

- **Keeps:** one accent per productive surface; no gradients between brand hues in productive mode.
- **Drops:** no colour dots on dark grounds (the markStage dots are allowed on the stage); paper and ink at 88% on an expressive stage (a bloom may light a quarter of it); the four together only in the mark (an expressive section may show all four as light, never as flat fills side by side).
- **Hue moves from today (EXECUTED):** blue 264.7 to 267.9; red 28.9 to 18.0; yellow 80.5 to 97.7; green 152.5 to 165.1.
- **Measured (EXECUTED):** blue, red and green span L 0.56 to 0.60, a spread of 0.039. That is the tightest of the four non-equal candidates. Every mark hue carries large text as a panel: white on blue 4.97, white on red 4.80, ink on green 4.86. The lemon yellow is the weakest yellow graphic of the five: 1.35 on paper. The stage dots are the marks themselves, 3.63 to 5.45 on ink and the stage, with yellow at 12.44.
- **What it costs (INFERRED):** a lemon yellow is the purest "primary" of the five, and so the likeliest to look childish without the neutrals and the grid around it. Its text colour has to borrow a warmer hue (80) to avoid olive. It is 6.1 ΔE from Google at its nearest (yellow); of the new candidates, only Spectral sits nearer.

#### Signal (`signal`): values

| Hue | mark (light grounds) | markStage (dark grounds) | text | lifted | bloom tint, 22% | rim tint, 28% |
|---|---|---|---|---|---|---|
| Charon Blue | `#3C5FFB` (0.56 0.235 267.9) | `#3C5FFB` (0.56 0.235 267.9) | `#3656F2` (0.534 0.235 267.9) | `#94B1FF` (0.769 0.117 268) | `#BED0FF38` | `#DEE8FF47` |
| Tombaugh Red | `#DC2347` (0.58 0.215 18) | `#DC2347` (0.58 0.215 18) | `#CF0A3D` (0.544 0.214 18) | `#FF9498` (0.78 0.129 18.1) | `#FFBEBE38` | `#FFDFDF47` |
| Sputnik Yellow | `#F6D507` (0.874 0.18 97.7) | `#F6D507` (0.874 0.18 97.7) | `#8A6100` (0.522 0.108 79.7) | `#F6D507` (0.874 0.18 97.7) | `#E1D28D38` | `#EFE9CB47` |
| Hydra Green | `#00976D` (0.599 0.126 165.1) | `#00976D` (0.599 0.126 165.1) | `#007755` (0.504 0.106 165) | `#50C79A` (0.75 0.126 165.1) | `#97E4C238` | `#D0F1E147` |

| Neutral | Value | | Neutral | Value |
|---|---|---|---|---|
| paper | `#F6F7F9` (0.976 0.003 264.5) | | raised | `#FFFFFF` (1 0 0) |
| wash | `#E9EAEC` (0.937 0.003 264.5) | | ink | `#13161D` (0.2 0.015 266.8) |
| inkRaised | `#1E1F22` (0.239 0.006 271.2) | | inkWash | `#2A2D33` (0.297 0.012 264.4) |
| inkSoft | `#525763` (0.457 0.021 267.6) | | paperSoft | `#A5ACB9` (0.743 0.02 263) |
| lineInput | `#888D96` (0.642 0.015 262.4) | | paperLineInput | `#676C75` (0.53 0.015 262.3) |
| stage | `#04060A` (0.121 0.012 258.7) | | stageRaised | `#0E1012` (0.172 0.005 248.1) |
| stageLine | `#1D1F22` (0.238 0.006 258.4) | | stageLineStrong | `#26282C` (0.276 0.008 264.4) |
| stageMuted | `#989DA7` (0.695 0.016 264.5) | | stageLineInput | `#5E626B` (0.496 0.015 266.6) |

#### Signal: contrast (WCAG 2.2, truncated; text needs 4.5, a graphic or control edge 3)

| Foreground | paper | raised | wash | ink | inkRaised | inkWash | stage | stageRaised |
|---|---|---|---|---|---|---|---|---|
| ink | 16.88 | 18.10 | 15.03 |  |  |  |  |  |
| inkSoft | 6.75 | 7.23 | 6.01 |  |  |  |  |  |
| blue.text | 5.19 | 5.57 | 4.62 |  |  |  |  |  |
| red.text | 5.20 | 5.57 | 4.63 |  |  |  |  |  |
| yellow.text | 5.16 | 5.54 | 4.60 |  |  |  |  |  |
| green.text | 5.19 | 5.57 | 4.62 |  |  |  |  |  |
| lineInput | 3.11 | 3.33 |  |  |  |  |  |  |
| blue.mark | 4.64 | 4.97 |  |  |  |  |  |  |
| red.mark | 4.47 | 4.80 |  |  |  |  |  |  |
| yellow.mark | 1.35 **fail** | 1.45 **fail** |  |  |  |  |  |  |
| green.mark | 3.46 | 3.71 |  |  |  |  |  |  |
| paper |  |  |  | 16.88 | 15.37 | 12.87 | 18.91 | 17.78 |
| paperSoft |  |  |  | 7.93 | 7.22 | 6.04 |  |  |
| blue.lifted |  |  |  | 8.61 | 7.84 | 6.56 | 9.64 | 9.07 |
| red.lifted |  |  |  | 8.56 | 7.80 | 6.53 | 9.59 | 9.02 |
| yellow.lifted |  |  |  | 12.44 | 11.33 | 9.48 | 13.94 | 13.10 |
| green.lifted |  |  |  | 8.59 | 7.82 | 6.55 | 9.63 | 9.05 |
| paperLineInput |  |  |  | 3.42 | 3.12 |  |  |  |
| blue.markStage |  |  |  | 3.63 | 3.31 |  | 4.07 |  |
| red.markStage |  |  |  | 3.77 | 3.43 |  | 4.22 |  |
| yellow.markStage |  |  |  | 12.44 | 11.33 |  | 13.94 |  |
| green.markStage |  |  |  | 4.86 | 4.43 |  | 5.45 |  |
| stageMuted |  |  |  |  |  |  | 7.45 | 7.00 |
| stageLineInput |  |  |  |  |  |  | 3.31 | 3.11 |

Fills: raised on blue.text (as a button fill) 5.57; raised on red.text (as a button fill) 5.57; raised on yellow.text (as a button fill) 5.54; raised on green.text (as a button fill) 5.57; raised on blue.mark (as a panel, large text) 4.97; raised on red.mark (as a panel, large text) 4.80; ink on yellow.mark (as a panel, large text) 12.44; ink on green.mark (as a panel, large text) 4.86; ink on blue.lifted (as a button fill) 8.61; ink on red.lifted (as a button fill) 8.56; ink on yellow.lifted (as a button fill) 12.44; ink on green.lifted (as a button fill) 8.59.

Under the bloom (each hue's tint at 22% over the stage): paper at least 11.74, stageMuted at least 4.62.
APCA |Lc| of the hue text colours (advisory): light 62.9 to 77.4, dark 56.8 to 81, stage 60.8 to 81.9.

Verdict: **74 of 74** counted pairs pass (text, fills, control edges); graphics 18 of 20 (light: yellow.mark on paper 1.35; light: yellow.mark on raised 1.45). Lowest text ratio 4.6.

#### Signal: ramps (hex; OKLCH per step in the JSON)

| Hue | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| blue | `#F3F6FF` | `#E7EDFE` | `#CFDCFD` | `#B0C6FC` | `#8EABFB` | `#6D91FA` | `#4F74F9` | `#3859F4` | `#2943DA` | `#1C2AB9` | `#121395` |
| red | `#FFF4F3` | `#FEE9E9` | `#FDD2D3` | `#FDB3B5` | `#FC8E93` | `#F76672` | `#E63E55` | `#D01940` | `#AD1334` | `#860C26` | `#620619` |
| yellow | `#FFF7D3` | `#FEEEA4` | `#FADC49` | `#E5C427` | `#CDAB21` | `#B5921B` | `#9B7A15` | `#866610` | `#6F520B` | `#563E07` | `#3F2B03` |
| green | `#E5FCF1` | `#D7F4E6` | `#BCE6D2` | `#97D3B8` | `#6CBD9B` | `#3CA780` | `#188F69` | `#137958` | `#0E6448` | `#084B36` | `#043525` |

### 5.3 Deep Field

*Ink-forward. Deeper, denser hues and a cooler, darker ink, so the brand reads serious and the colours read as pigment on a night ground.*

- **Keeps:** paper and ink at 88% in productive mode; one accent per surface; no gradients between brand hues.
- **Drops:** no colour dots on dark grounds (markStage is allowed); paper as the default ground of expressive pages (ink becomes it).
- **Hue moves from today (EXECUTED):** blue 264.7 to 268.0, and L 0.517 to 0.479; red 28.9 to 21.9, and L 0.603 to 0.54; yellow 80.5 to 70.2 (marigold); green 152.5 to 162.8, and L 0.616 to 0.531. Ink `#14161C` becomes `#0B0F17`; the stage is `#030407`.
- **Measured (EXECUTED):** the farthest from both references: 7.8 ΔE from Google and 7.3 from Microsoft at the nearest. The marks are their own text for blue, and nearly so for red (`#C92035` mark, `#C81F34` text). So one colour does the work of two. Every mark carries white text as a button: blue 7.02, red 5.61, green 4.96. On the stage, blue, red and green sit within L 0.013 of each other. Deuteranopia keeps red and green 6.9 apart, the widest nearest pair of the five.
- **What it costs (INFERRED):** the darker ink changes every dark surface an installed app already shows. That is a visible change, so it needs its own release note under constitution §6. The stage dots are dim, at 3.37 to 4.12 for blue, red and green. An icon that must glow on the stage should take the lifted colours, which pass every pair.

#### Deep Field (`deep-field`): values

| Hue | mark (light grounds) | markStage (dark grounds) | text | lifted | bloom tint, 22% | rim tint, 28% |
|---|---|---|---|---|---|---|
| Charon Blue | `#2D48D4` (0.479 0.215 268) | `#3858E5` (0.527 0.216 268) | `#2D48D4` (0.479 0.215 268) | `#93B0FF` (0.767 0.118 268.2) | `#BED0FF38` | `#DEE8FF47` |
| Tombaugh Red | `#C92035` (0.54 0.2 21.9) | `#C92035` (0.54 0.2 21.9) | `#C81F34` (0.538 0.2 22) | `#FF9491` (0.779 0.129 22.2) | `#FFBEBB38` | `#FFDFDD47` |
| Sputnik Amber | `#F19E20` (0.764 0.158 70.2) | `#F19E20` (0.764 0.158 70.2) | `#915B00` (0.519 0.112 70) | `#F3A023` (0.77 0.158 70.3) | `#F7C79038` | `#FAE4CC47` |
| Hydra Green | `#008058` (0.531 0.115 162.8) | `#008058` (0.531 0.115 162.8) | `#007651` (0.5 0.108 162.9) | `#60C498` (0.748 0.115 162.8) | `#99E4C038` | `#D1F1E047` |

| Neutral | Value | | Neutral | Value |
|---|---|---|---|---|
| paper | `#F4F6F8` (0.972 0.003 247.9) | | raised | `#FFFFFF` (1 0 0) |
| wash | `#E6E8EB` (0.93 0.005 258.3) | | ink | `#0B0F17` (0.168 0.018 263.9) |
| inkRaised | `#16181B` (0.208 0.007 258.4) | | inkWash | `#23272E` (0.272 0.014 261.7) |
| inkSoft | `#505661` (0.452 0.02 262.7) | | paperSoft | `#9EA5B2` (0.72 0.02 263) |
| lineInput | `#878C96` (0.639 0.016 264.5) | | paperLineInput | `#626770` (0.513 0.016 262.3) |
| stage | `#030407` (0.107 0.011 266.5) | | stageRaised | `#0B0D0F` (0.158 0.005 248.2) |
| stageLine | `#1C1D20` (0.231 0.006 271.2) | | stageLineStrong | `#252629` (0.269 0.006 271.2) |
| stageMuted | `#969BA4` (0.688 0.014 262.4) | | stageLineInput | `#5C6169` (0.491 0.014 259.8) |

#### Deep Field: contrast (WCAG 2.2, truncated; text needs 4.5, a graphic or control edge 3)

| Foreground | paper | raised | wash | ink | inkRaised | inkWash | stage | stageRaised |
|---|---|---|---|---|---|---|---|---|
| ink | 17.70 | 19.17 | 15.62 |  |  |  |  |  |
| inkSoft | 6.81 | 7.38 | 6.01 |  |  |  |  |  |
| blue.text | 6.48 | 7.02 | 5.72 |  |  |  |  |  |
| red.text | 5.23 | 5.67 | 4.62 |  |  |  |  |  |
| yellow.text | 5.23 | 5.67 | 4.62 |  |  |  |  |  |
| green.text | 5.22 | 5.66 | 4.61 |  |  |  |  |  |
| lineInput | 3.11 | 3.37 |  |  |  |  |  |  |
| blue.mark | 6.48 | 7.02 |  |  |  |  |  |  |
| red.mark | 5.18 | 5.61 |  |  |  |  |  |  |
| yellow.mark | 2.00 **fail** | 2.17 **fail** |  |  |  |  |  |  |
| green.mark | 4.58 | 4.96 |  |  |  |  |  |  |
| paper |  |  |  | 17.70 | 16.41 | 13.83 | 18.92 | 17.97 |
| paperSoft |  |  |  | 7.74 | 7.18 | 6.05 |  |  |
| blue.lifted |  |  |  | 9.03 | 8.38 | 7.06 | 9.65 | 9.17 |
| red.lifted |  |  |  | 9.03 | 8.38 | 7.06 | 9.66 | 9.17 |
| yellow.lifted |  |  |  | 9.00 | 8.35 | 7.03 | 9.62 | 9.14 |
| green.lifted |  |  |  | 8.99 | 8.34 | 7.02 | 9.61 | 9.12 |
| paperLineInput |  |  |  | 3.37 | 3.12 |  |  |  |
| blue.markStage |  |  |  | 3.37 | 3.13 |  | 3.60 |  |
| red.markStage |  |  |  | 3.41 | 3.16 |  | 3.65 |  |
| yellow.markStage |  |  |  | 8.81 | 8.17 |  | 9.42 |  |
| green.markStage |  |  |  | 3.86 | 3.58 |  | 4.12 |  |
| stageMuted |  |  |  |  |  |  | 7.34 | 6.97 |
| stageLineInput |  |  |  |  |  |  | 3.28 | 3.12 |

Fills: raised on blue.text (as a button fill) 7.02; raised on red.text (as a button fill) 5.67; raised on yellow.text (as a button fill) 5.67; raised on green.text (as a button fill) 5.66; raised on blue.mark (as a panel, large text) 7.02; raised on red.mark (as a panel, large text) 5.61; ink on yellow.mark (as a panel, large text) 8.81; raised on green.mark (as a panel, large text) 4.96; ink on blue.lifted (as a button fill) 9.03; ink on red.lifted (as a button fill) 9.03; ink on yellow.lifted (as a button fill) 9.00; ink on green.lifted (as a button fill) 8.99.

Under the bloom (each hue's tint at 22% over the stage): paper at least 11.91, stageMuted at least 4.62.
APCA |Lc| of the hue text colours (advisory): light 62.8 to 83.5, dark 57.4 to 60.6, stage 60.4 to 60.9.

Verdict: **74 of 74** counted pairs pass (text, fills, control edges); graphics 18 of 20 (light: yellow.mark on paper 2; light: yellow.mark on raised 2.17). Lowest text ratio 4.61.

#### Deep Field: ramps (hex; OKLCH per step in the JSON)

| Hue | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| blue | `#F3F6FF` | `#E7EEFE` | `#CFDDFD` | `#B0C6FC` | `#8EACFB` | `#6F91F8` | `#5377EC` | `#3E5EE1` | `#2B46D2` | `#1D2DB5` | `#121593` |
| red | `#FFF4F4` | `#FEEAE8` | `#FDD3D0` | `#FDB4B1` | `#FA908D` | `#ED6E6F` | `#DD4B52` | `#CC2738` | `#AE132A` | `#860C1E` | `#610613` |
| yellow | `#FFF5E9` | `#FEEBD5` | `#FDD6AA` | `#FCB967` | `#EE9C21` | `#D2851B` | `#B66E16` | `#9C5B10` | `#82490C` | `#673607` | `#4B2403` |
| green | `#E8FAF0` | `#DBF3E7` | `#C2E4D3` | `#A2D1B9` | `#7DBB9D` | `#57A582` | `#2E8E68` | `#137955` | `#0D6345` | `#084C33` | `#043523` |

### 5.4 Warm Paper

*Leans on paper. A cream ground and a warm ink. Every hue turned a few degrees warmer: vermilion, saffron, leaf green, cobalt. Like printed matter.*

- **Keeps:** paper and ink at 88% or more; one accent per surface; the four together only in the mark and data figures; no gradients between brand hues.
- **Drops:** no colour dots on dark grounds (markStage is allowed on the stage).
- **Hue moves from today (EXECUTED):** blue 264.7 to 256.1; red 28.9 to 40.0 (its chroma capped by sRGB at 0.179); yellow 80.5 to 67.6; green 152.5 to 142.1. Paper becomes `#F7F3EB`, raised `#FFFDFA`, ink `#1A1511`, the stage `#0A0705`.
- **Measured (EXECUTED):** the most even chroma of the five (spread 0.049). Every neutral is warm, including the solved inkSoft `#5B5349` and stageMuted `#A39D94`. The tritanopia pair blue and green is the closest of the five, at 4.8. Blue to red keeps only 31% of its chroma at the midpoint.
- **What it costs (INFERRED):** cream and warm ink is a common look right now, which the product-site memo already counts against ownership. Vermilion and saffron are the nearest pair, 22.1 ΔE, and their midpoint keeps 97% of its chroma (EXECUTED). So the warm pair reads as one family: calm on paper, less loud on a stage.

#### Warm Paper (`warm-paper`): values

| Hue | mark (light grounds) | markStage (dark grounds) | text | lifted | bloom tint, 22% | rim tint, 28% |
|---|---|---|---|---|---|---|
| Charon Blue | `#0065CC` (0.52 0.178 256.1) | `#0A6AD1` (0.535 0.178 256) | `#0064C9` (0.515 0.176 255.9) | `#7EB5FF` (0.765 0.122 256.1) | `#B4D4FF38` | `#DAE9FF47` |
| Tombaugh Red | `#C94500` (0.569 0.179 40) | `#C94500` (0.569 0.179 40) | `#B53D00` (0.526 0.165 39.9) | `#FF9772` (0.777 0.135 40.2) | `#FFC0AA38` | `#FFE0D647` |
| Sputnik Saffron | `#F89F26` (0.775 0.16 67.6) | `#F89F26` (0.775 0.16 67.6) | `#925900` (0.516 0.114 67.7) | `#F89F26` (0.775 0.16 67.6) | `#F9C69138` | `#FBE4CC47` |
| Hydra Green | `#3F8439` (0.55 0.13 142.1) | `#3F8439` (0.55 0.13 142.1) | `#2F7429` (0.497 0.13 142) | `#7CC375` (0.751 0.13 142.2) | `#B0E1AA38` | `#D9EFD747` |

| Neutral | Value | | Neutral | Value |
|---|---|---|---|---|
| paper | `#F7F3EB` (0.965 0.011 84.6) | | raised | `#FFFDFA` (0.995 0.005 78.3) |
| wash | `#EAE6DE` (0.926 0.012 84.6) | | ink | `#1A1511` (0.2 0.011 60.8) |
| inkRaised | `#211F1C` (0.24 0.006 78.2) | | inkWash | `#312C27` (0.297 0.011 67.4) |
| inkSoft | `#5B5349` (0.447 0.019 73.4) | | paperSoft | `#B3AA9E` (0.742 0.02 75.3) |
| lineInput | `#8F8980` (0.633 0.015 78.2) | | paperLineInput | `#716B62` (0.531 0.016 78.2) |
| stage | `#0A0705` (0.132 0.008 61.2) | | stageRaised | `#14120F` (0.183 0.007 78.1) |
| stageLine | `#221F1C` (0.242 0.007 67.5) | | stageLineStrong | `#2B2825` (0.279 0.007 67.5) |
| stageMuted | `#A39D94` (0.698 0.015 78.2) | | stageLineInput | `#68625A` (0.499 0.015 75.2) |

#### Warm Paper: contrast (WCAG 2.2, truncated; text needs 4.5, a graphic or control edge 3)

| Foreground | paper | raised | wash | ink | inkRaised | inkWash | stage | stageRaised |
|---|---|---|---|---|---|---|---|---|
| ink | 16.36 | 17.84 | 14.55 |  |  |  |  |  |
| inkSoft | 6.82 | 7.44 | 6.07 |  |  |  |  |  |
| blue.text | 5.17 | 5.64 | 4.60 |  |  |  |  |  |
| red.text | 5.22 | 5.69 | 4.64 |  |  |  |  |  |
| yellow.text | 5.19 | 5.66 | 4.62 |  |  |  |  |  |
| green.text | 5.19 | 5.66 | 4.62 |  |  |  |  |  |
| lineInput | 3.13 | 3.41 |  |  |  |  |  |  |
| blue.mark | 5.08 | 5.53 |  |  |  |  |  |  |
| red.mark | 4.37 | 4.77 |  |  |  |  |  |  |
| yellow.mark | 1.90 **fail** | 2.07 **fail** |  |  |  |  |  |  |
| green.mark | 4.15 | 4.52 |  |  |  |  |  |  |
| paper |  |  |  | 16.36 | 14.85 | 12.48 | 18.14 | 16.89 |
| paperSoft |  |  |  | 7.90 | 7.17 | 6.02 |  |  |
| blue.lifted |  |  |  | 8.57 | 7.78 | 6.53 | 9.50 | 8.85 |
| red.lifted |  |  |  | 8.55 | 7.76 | 6.52 | 9.48 | 8.83 |
| yellow.lifted |  |  |  | 8.60 | 7.81 | 6.56 | 9.54 | 8.88 |
| green.lifted |  |  |  | 8.55 | 7.76 | 6.52 | 9.48 | 8.83 |
| paperLineInput |  |  |  | 3.43 | 3.11 |  |  |  |
| blue.markStage |  |  |  | 3.44 | 3.12 |  | 3.82 |  |
| red.markStage |  |  |  | 3.73 | 3.39 |  | 4.14 |  |
| yellow.markStage |  |  |  | 8.60 | 7.81 |  | 9.54 |  |
| green.markStage |  |  |  | 3.94 | 3.57 |  | 4.37 |  |
| stageMuted |  |  |  |  |  |  | 7.46 | 6.95 |
| stageLineInput |  |  |  |  |  |  | 3.33 | 3.10 |

Fills: raised on blue.text (as a button fill) 5.64; raised on red.text (as a button fill) 5.69; raised on yellow.text (as a button fill) 5.66; raised on green.text (as a button fill) 5.66; raised on blue.mark (as a panel, large text) 5.53; raised on red.mark (as a panel, large text) 4.77; ink on yellow.mark (as a panel, large text) 8.60; raised on green.mark (as a panel, large text) 4.52; ink on blue.lifted (as a button fill) 8.57; ink on red.lifted (as a button fill) 8.55; ink on yellow.lifted (as a button fill) 8.60; ink on green.lifted (as a button fill) 8.55.

Under the bloom (each hue's tint at 22% over the stage): paper at least 11.19, stageMuted at least 4.60.
APCA |Lc| of the hue text colours (advisory): light 63.2 to 77.4, dark 56.5 to 60.5, stage 60.3 to 61.3.

Verdict: **74 of 74** counted pairs pass (text, fills, control edges); graphics 18 of 20 (light: yellow.mark on paper 1.9; light: yellow.mark on raised 2.07). Lowest text ratio 4.6.

#### Warm Paper: ramps (hex; OKLCH per step in the JSON)

| Hue | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| blue | `#F1F7FF` | `#E4EFFE` | `#C8DEFD` | `#A4C9FC` | `#7DB0F6` | `#5998EA` | `#357FDD` | `#1168CC` | `#0C56A9` | `#074182` | `#032E5F` |
| red | `#FFF4F1` | `#FEE9E2` | `#FDD5C6` | `#FDB69D` | `#F39676` | `#E4774F` | `#D45726` | `#B94411` | `#99370C` | `#772907` | `#551B03` |
| yellow | `#FFF5EA` | `#FEEAD7` | `#FDD6AE` | `#FCB970` | `#F39A21` | `#D6821B` | `#B86C15` | `#9F5910` | `#85470C` | `#693407` | `#4D2303` |
| green | `#ECFAEA` | `#E0F4DE` | `#C9E4C6` | `#ABD1A7` | `#8AB985` | `#6AA364` | `#4B8E45` | `#34782E` | `#20651B` | `#0B4E06` | `#053703` |

### 5.5 Spectral

*All four hues at one OKLCH lightness, so the mark is one value. The same dots pass 3:1 on paper, white, ink and the stage. A band that walks the four in reading order keeps one lightness.*

- **Keeps:** one accent per productive surface; WCAG 2.2 AA in both themes.
- **Drops:** no gradients between brand hues (one band through the four in reading order, interpolated in OKLCH, is allowed on the stage; a direct blend of blue and yellow stays banned, since it greys); no colour dots on dark grounds (one mark serves every ground); the four together only in the mark (an expressive section may use the four as one spectrum).
- **How the lightness was chosen (EXECUTED):** a search over L 0.54 to 0.64 kept every hue at 3.1 or more on paper, raised, ink, ink-raised and the stage. It favoured the hues farthest from Google and Microsoft. L 0.58 was the middle that held.
- **Measured (EXECUTED):** graphics 20 of 20, the only candidate with no graphic failure. The four marks span L 0.579 to 0.581. The band holds L 0.578 to 0.582, with paper or ink text on it at 3.76 or more (large text only).
- **What it costs (EXECUTED, then INFERRED):** at L 0.58, sRGB allows yellow a chroma of only 0.119. The yellow is a gold, `#9A7300`, and most viewers would not call it yellow (INFERRED). Red and gold are only 3.6 apart under deuteranopia, the weakest light pair of the five. Its blue and red are 6.3 and 5.6 from Google's, because Google's own blue, red and green are near one lightness too.

#### Spectral (`spectral`): values

| Hue | mark (light grounds) | markStage (dark grounds) | text | lifted | bloom tint, 22% | rim tint, 28% |
|---|---|---|---|---|---|---|
| Charon Blue | `#4F6BEE` (0.58 0.199 270) | `#4F6BEE` (0.58 0.199 270) | `#425BDD` (0.531 0.2 269.9) | `#96B0FF` (0.769 0.117 269.6) | `#BFD0FF38` | `#DFE7FF47` |
| Tombaugh Red | `#D73246` (0.581 0.2 20) | `#D73246` (0.581 0.2 20) | `#C9213B` (0.542 0.199 20) | `#FF9394` (0.778 0.13 19.9) | `#FFBEBD38` | `#FFDFDE47` |
| Sputnik Gold | `#9A7300` (0.579 0.119 84.9) | `#9A7300` (0.579 0.119 84.9) | `#856300` (0.52 0.107 85) | `#D6AD52` (0.767 0.119 85) | `#ECCD8C38` | `#F4E6CA47` |
| Hydra Green | `#009068` (0.579 0.121 165.2) | `#009068` (0.579 0.121 165.2) | `#007755` (0.504 0.106 165) | `#55C69B` (0.749 0.122 165.3) | `#97E4C338` | `#D0F1E147` |

| Neutral | Value | | Neutral | Value |
|---|---|---|---|---|
| paper | `#F6F7F9` (0.976 0.003 264.5) | | raised | `#FFFFFF` (1 0 0) |
| wash | `#E9EAEC` (0.937 0.003 264.5) | | ink | `#11141A` (0.191 0.013 264.2) |
| inkRaised | `#1C1D20` (0.231 0.006 271.2) | | inkWash | `#282B31` (0.289 0.012 264.4) |
| inkSoft | `#525763` (0.457 0.021 267.6) | | paperSoft | `#A2A9B6` (0.733 0.02 263) |
| lineInput | `#888D96` (0.642 0.015 262.4) | | paperLineInput | `#666A73` (0.524 0.015 266.6) |
| stage | `#030407` (0.107 0.011 266.5) | | stageRaised | `#0B0D0F` (0.158 0.005 248.2) |
| stageLine | `#1C1D20` (0.231 0.006 271.2) | | stageLineStrong | `#252629` (0.269 0.006 271.2) |
| stageMuted | `#969BA4` (0.688 0.014 262.4) | | stageLineInput | `#5D616A` (0.492 0.015 266.6) |

#### Spectral: contrast (WCAG 2.2, truncated; text needs 4.5, a graphic or control edge 3)

| Foreground | paper | raised | wash | ink | inkRaised | inkWash | stage | stageRaised |
|---|---|---|---|---|---|---|---|---|
| ink | 17.20 | 18.44 | 15.31 |  |  |  |  |  |
| inkSoft | 6.75 | 7.23 | 6.01 |  |  |  |  |  |
| blue.text | 5.19 | 5.56 | 4.62 |  |  |  |  |  |
| red.text | 5.20 | 5.57 | 4.63 |  |  |  |  |  |
| yellow.text | 5.17 | 5.55 | 4.61 |  |  |  |  |  |
| green.text | 5.19 | 5.57 | 4.62 |  |  |  |  |  |
| lineInput | 3.11 | 3.33 |  |  |  |  |  |  |
| blue.mark | 4.19 | 4.49 |  |  |  |  |  |  |
| red.mark | 4.41 | 4.73 |  |  |  |  |  |  |
| yellow.mark | 4.05 | 4.35 |  |  |  |  |  |  |
| green.mark | 3.77 | 4.04 |  |  |  |  |  |  |
| paper |  |  |  | 17.20 | 15.72 | 13.23 | 19.12 | 18.16 |
| paperSoft |  |  |  | 7.80 | 7.13 | 6.00 |  |  |
| blue.lifted |  |  |  | 8.73 | 7.98 | 6.72 | 9.71 | 9.22 |
| red.lifted |  |  |  | 8.65 | 7.90 | 6.65 | 9.61 | 9.13 |
| yellow.lifted |  |  |  | 8.74 | 7.99 | 6.72 | 9.72 | 9.23 |
| green.lifted |  |  |  | 8.72 | 7.97 | 6.71 | 9.70 | 9.21 |
| paperLineInput |  |  |  | 3.40 | 3.10 |  |  |  |
| blue.markStage |  |  |  | 4.10 | 3.74 |  | 4.55 |  |
| red.markStage |  |  |  | 3.89 | 3.55 |  | 4.32 |  |
| yellow.markStage |  |  |  | 4.23 | 3.87 |  | 4.71 |  |
| green.markStage |  |  |  | 4.55 | 4.16 |  | 5.06 |  |
| stageMuted |  |  |  |  |  |  | 7.34 | 6.97 |
| stageLineInput |  |  |  |  |  |  | 3.30 | 3.13 |

Fills: raised on blue.text (as a button fill) 5.56; raised on red.text (as a button fill) 5.57; raised on yellow.text (as a button fill) 5.55; raised on green.text (as a button fill) 5.57; raised on blue.mark (as a panel, large text) 4.49; raised on red.mark (as a panel, large text) 4.73; raised on yellow.mark (as a panel, large text) 4.35; ink on green.mark (as a panel, large text) 4.55; ink on blue.lifted (as a button fill) 8.73; ink on red.lifted (as a button fill) 8.65; ink on yellow.lifted (as a button fill) 8.74; ink on green.lifted (as a button fill) 8.72.

Under the bloom (each hue's tint at 22% over the stage): paper at least 12.04, stageMuted at least 4.62.
APCA |Lc| of the hue text colours (advisory): light 63.6 to 77.5, dark 56.7 to 60.4, stage 60.5 to 61.1.

Verdict: **74 of 74** counted pairs pass (text, fills, control edges); graphics 20 of 20. Lowest text ratio 4.61.

#### Spectral: ramps (hex; OKLCH per step in the JSON)

| Hue | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| blue | `#F4F7FF` | `#E7EEFE` | `#D1DCFD` | `#B3C5FC` | `#91ABFB` | `#7290FA` | `#5774F3` | `#445DDF` | `#3549C5` | `#2533A5` | `#181E83` |
| red | `#FFF4F4` | `#FEEAE9` | `#FDD3D1` | `#FDB4B2` | `#FC8F90` | `#F16B71` | `#E14754` | `#CC263E` | `#AD132F` | `#870C22` | `#610616` |
| yellow | `#FEF5E4` | `#F8EDD6` | `#EBDBBB` | `#DBC497` | `#C7AB6F` | `#B39147` | `#9F7915` | `#886510` | `#73510B` | `#5A3D07` | `#412903` |
| green | `#E6FBF1` | `#D9F4E7` | `#BEE6D3` | `#9AD3B9` | `#72BD9D` | `#46A782` | `#189069` | `#137959` | `#0E6348` | `#084C36` | `#043625` |

## 6. The candidates compared

Five tables, all EXECUTED. In order: the marks' balance on light grounds; the stage dots' balance; distance from Google and Microsoft; the OKLab midpoint of each pair of marks (the share of chroma kept, and the midpoint colour); and the band through the four in reading order.

| Candidate | L of the four (light) | L spread | L spread without yellow | C spread | nearest pair ΔE | deutan nearest | protan nearest | tritan nearest |
|---|---|---|---|---|---|---|---|---|
| Charon, kept | 0.517, 0.603, 0.792, 0.616 | 0.275 | 0.099 | 0.073 | 25.1 (red-yellow) | 5.4 (red-green) | 12.5 (yellow-green) | 10.3 (blue-green) |
| Signal | 0.56, 0.58, 0.874, 0.599 | 0.314 | 0.039 | 0.109 | 29.2 (blue-green) | 6 (red-green) | 17.1 (red-green) | 6.9 (blue-green) |
| Deep Field | 0.479, 0.54, 0.764, 0.531 | 0.285 | 0.061 | 0.1 | 27 (red-yellow) | 6.9 (red-green) | 13 (red-green) | 7.2 (blue-green) |
| Warm Paper | 0.52, 0.569, 0.775, 0.55 | 0.255 | 0.05 | 0.049 | 22.1 (red-yellow) | 5.8 (red-green) | 9.1 (red-green) | 4.8 (blue-green) |
| Spectral | 0.58, 0.581, 0.579, 0.579 | 0.002 | 0.002 | 0.081 | 15.5 (yellow-green) | 3.6 (red-yellow) | 9.2 (yellow-green) | 5.3 (blue-green) |

| Candidate | stage L of the four | stage L spread | stage deutan nearest |
|---|---|---|---|
| Charon, kept | 0.709, 0.738, 0.792, 0.748 | 0.083 | 2.8 (red-green) |
| Signal | 0.56, 0.58, 0.874, 0.599 | 0.314 | 6 (red-green) |
| Deep Field | 0.527, 0.54, 0.764, 0.531 | 0.237 | 6.9 (red-green) |
| Warm Paper | 0.535, 0.569, 0.775, 0.55 | 0.239 | 5.8 (red-green) |
| Spectral | 0.58, 0.581, 0.579, 0.579 | 0.002 | 3.6 (red-yellow) |

| Candidate | ΔE from Google: blue, red, yellow, green (min) | ΔE from Microsoft: blue, red, yellow, green (min) |
|---|---|---|
| Charon, kept | 12.2, 2.3, 4, 3.4 (**2.3**) | 19.8, 5.3, 3.8, 13.1 (**3.8**) |
| Signal | 9.3, 6.2, 6.1, 7.2 (**6.1**) | 17.4, 9.6, 6.9, 16.8 (**6.9**) |
| Deep Field | 15.8, 8.9, 7.8, 13 (**7.8**) | 23.2, 12.1, 7.3, 22.2 (**7.3**) |
| Warm Paper | 11.1, 7.2, 7.3, 10.3 (**7.2**) | 17.3, 8.7, 6.8, 18.4 (**6.8**) |
| Spectral | 6.3, 5.6, 25.7, 8.9 (**5.6**) | 14.6, 8.9, 25.6, 18.4 (**8.9**) |

| Candidate | blue-red | red-green | yellow-green | blue-yellow | blue-green | red-yellow |
|---|---|---|---|---|---|---|
| Charon, kept | 47% `#906097` | 49% `#A27B43` | 81% `#9DA943` | 17% `#8A90A5` | 58% `#0083A5` | 90% `#EC7A27` |
| Signal | 57% `#985CA7` | 38% `#9D725A` | 84% `#98B858` | 16% `#92A7B6` | 67% `#1883B8` | 77% `#EF893E` |
| Deep Field | 55% `#844E8C` | 42% `#8C6348` | 70% `#95924A` | 22% `#8C819B` | 65% `#086C9A` | 91% `#DF6831` |
| Warm Paper | 31% `#826580` | 64% `#936D26` | 80% `#A39434` | 9% `#918C96` | 56% `#1B7A8B` | 97% `#E17414` |
| Spectral | 57% `#9C619F` | 38% `#977158` | 76% `#6D8445` | 26% `#747893` | 64% `#3083AE` | 86% `#BB5B30` |

| Candidate | hues in reading order (increasing) | band L range | chroma kept after sRGB clipping | paper text on band, min | ink text on band, min |
|---|---|---|---|---|---|
| Charon, kept | 264.7 → 388.9 → 440.5 → 512.5 | 0.517 to 0.792 | 94% | 1.81 | 3.05 |
| Signal | 267.9 → 378 → 457.7 → 525.1 | 0.56 to 0.874 | 87% | 1.35 | 3.54 |
| Deep Field | 268 → 381.9 → 430.2 → 522.8 | 0.479 to 0.764 | 98% | 2 | 2.73 |
| Warm Paper | 256.1 → 400 → 427.6 → 502.1 | 0.52 to 0.775 | 95% | 1.9 | 3.19 |
| Spectral | 270 → 380 → 444.9 → 525.2 | 0.578 to 0.582 | 91% | 3.76 | 3.85 |

### 6.1 Balance (EXECUTED, then INFERRED)

- With yellow left out, every new candidate narrows the lightness spread of the dots. Today's 0.099 becomes 0.039 (Signal), 0.061 (Deep Field), 0.050 (Warm Paper) and 0.002 (Spectral). Yellow stays 0.17 to 0.31 lighter than the rest everywhere except Spectral. It has to be, to stay yellow (INFERRED).
- On dark grounds, Deep Field's stage dots are the most even (0.013 without yellow), but dim. Today's lifted set is next (0.039), and bright.
- The nearest pair for colour-blind readers is red and green under deuteranopia in four candidates (5.4 to 6.9), and red and gold in Spectral (3.6). In a data figure, the four are told apart by label or mark, never by colour alone (READ, `decisions.md`, "A chart carries a name and a table").

### 6.2 Distance from Google and Microsoft (EXECUTED, then INFERRED)

- Today's set is 2.3 ΔE from Google at its nearest. Each new candidate is 5.6 or more from both references for every hue. Deep Field is the farthest (7.8 and 7.3).
- Yellow is the hardest hue to own. Bright yellows that still look yellow cluster at hue 76 to 84, where Google's and Microsoft's both sit. Signal escapes by going cooler (lemon, 97.7). Deep Field and Warm Paper go warmer (marigold and saffron, 68 to 70). Spectral leaves yellow altogether (gold).
- ΔE is a distance between single colours. Recognition is of a set, in a shape, beside a name (INFERRED). The 2×2 grid of dots is already Pluto's own, so the hues need only be clearly not Google's, not exotic.

### 6.3 Contrast (EXECUTED)

- Every candidate passes all 74 counted pairs. In the four new candidates the lowest text ratio is 4.60 or 4.61, the solver's floor: a text-safe colour on wash, or, in Warm Paper, stageMuted under the green bloom. Today's lowest is 4.71, red text on wash.
- Each text-safe colour also carries white button text at 5.54 or more.
- Bloom never threatens text. Paper on any hue's bloom is 11.19 or more. stageMuted under the bloom is 4.60 or more, because the solver includes every bloom among stageMuted's grounds.
- **APCA, advisory.** Hue text on light grounds scores Lc 62.8 to 83.5 in every candidate. On dark, the solved lifted colours score Lc 60.0 to 81.9 on ink and the stage, and 56.5 to 57.7 on ink-wash (77.5 for Signal's yellow). Ink-wash, the code ground, is the one ground under Lc 60. WCAG there is 6.52 or more. Today's lifted blue scores Lc 49.7 on ink and 46.2 on ink-wash.

### 6.4 Gradients and the band (EXECUTED, then INFERRED)

- **Direct blends.** The OKLab midpoint of blue and yellow keeps 9% to 26% of the chroma of its ends: a grey, in every candidate. Red and yellow keep 77% to 97%. The book's ban on gradients between brand hues has a measured basis for blue and yellow. For red and yellow it has none, and Mastercard's additive overlap is that same pair (READ, §1.3).
- **The band.** In the mark's reading order (blue, red, yellow, green), the hue angle only ever increases: for example 270, then 380 (that is, 20), 445 (85) and 525 (165), in Spectral. So a band through the four, interpolated in OKLCH, visits only magentas between blue and red, oranges between red and yellow, and yellow-greens between yellow and green. It never visits grey. It keeps 87% to 98% of its chroma after sRGB clipping (EXECUTED).
- In Spectral the band also holds one lightness, so text over it keeps one contrast (3.76 or more for paper or ink). In the other candidates the band swings from L 0.48 to 0.87, and paper text on it falls to 1.35 to 2.0 at the yellow.
- INFERRED: if the owner allows one expressive device built from the four, this band is the one the arithmetic supports. Light behind an object (bloom) is the other, and it works in all five.

### 6.5 What each would mean for the system (INFERRED)

- **Charon, kept** changes nothing and owns least.
- **Signal** changes every hue, keeps today's neutrals almost as they are (paper turns cooler, `#F6F7F9`), and is the loudest.
- **Deep Field** changes every hue and the ink. It is the farthest from Google, its marks double as fills and text, and it is the most serious in tone. Its cost is a visible change to dark surfaces.
- **Warm Paper** changes every hue and every neutral, and is the calmest.
- **Spectral** changes every hue. It gives up a true yellow in exchange for one mark on every ground and a band with one lightness.

## 7. The JSON

[`2026-11-01-palette-candidates.json`](2026-11-01-palette-candidates.json) is the output of `build.ts`, unedited. It holds about 277 KB.

- **Top level.** `schema` (`"pluto-palette-candidates/1"`), `date`, `memo` (this file's name), `method` (the contrast rules, the solver targets, the ramp tones and rule, the bloom and rim recipes, the CVD model, the Google and Microsoft reference hexes), and `candidates`, an array of five.
- **Each candidate.**
  - `id`: stable, kebab-case: `charon-kept`, `signal`, `deep-field`, `warm-paper`, `spectral`. `name` and `idea` are display strings.
  - `keeps` and `drops`: the design book's rules, as strings.
  - `neutrals`: keyed `paper`, `raised`, `wash`, `ink`, `inkRaised`, `inkWash`, `inkSoft`, `paperSoft`, `lineInput`, `paperLineInput`, `stage`, `stageRaised`, `stageLine`, `stageLineStrong`, `stageMuted`, `stageLineInput`. Each is `{ hex, oklch: [L, C, h] }`.
  - `hues`: keyed `blue`, `red`, `yellow`, `green`, always in the mark's reading order. Each holds:
    - `name`, the brand name;
    - `mark`, `markStage`, `text`, `lifted`, each `{ hex, oklch }`;
    - `ramp`, eleven `{ step, tone, hex, oklch }`, steps 50 to 950;
    - `bloom` and `rim`, each `{ tint, alpha, css, composite, oklch }`. `css` is the eight-digit hex to use. `composite` is the opaque result over the stage (bloom) or stage-raised (rim).
  - `rampContrast`: per step, the `[min, max]` WCAG ratio of the four hues on paper, raised, ink and the stage.
  - `contrast`: every measured pair as `{ set, kind, fg, bg, fgHex, bgHex, ratio, min, apca, result }`.
    - `set` is `light`, `dark` or `stage`.
    - `kind` is `text`, `fill`, `fill-large`, `non-text` (a control's edge), `graphic` or `decorative`.
    - `result` is `pass` or `fail`. A decorative row has `min` 0.
    - `apca` is the signed Lc, filled on text rows only.
  - `verdict`: `required` and `pass` (the counted pairs), `fail` (as strings), `graphics`, `graphicPass`, `graphicFail`, `lowestText`.
  - `balance.light` and `balance.stage`: `L`, `C`, `Lspread`, `LspreadWithoutYellow`, `Cspread`, `Yrange`, `minPairDeltaE` and `minPair`, and `cvd.{protanopia,deuteranopia,tritanopia}.{minPairDeltaE,pair}`.
  - `gradients`: six pairs, each `{ oklabMidpoint, chromaKept }` (a percentage).
  - `band`: `hueIncreasing`, `Lrange`, `chromaKeptAfterGamut`, `paperOnBandMin`, `inkOnBandMin`.
  - `distance.google` and `distance.microsoft`: ΔE per hue, plus `min` and `mean`.

A board should read colours by `id` and key, never by array position.

## 8. What this memo does not settle

- **Whether the owner keeps the book's colour laws.** The candidates show both. Signal and Spectral drop the most; Charon, kept and Warm Paper keep them.
- **Rendered judgment.** Every number here is arithmetic. None of the five has been seen on a screen, beside the wordmark, at icon size, or on a stage with a bloom. The colour board is where that happens.
- **Print and other spaces.** Values are sRGB only. Display P3, CMYK and Pantone were not studied.
- **The highlight palette.** `007`'s syntax hues were tuned to today's grounds. A candidate that changes ink or paper (Deep Field, Warm Paper) would need those hues measured again.
- **The product accent.** It waits for its own specification (READ, `decisions.md`, "One system, many products").

### Questions for the owner

Each would be recorded in `decisions.md` once answered.

1. **Which direction goes on the identity colour board as the lead?**
   - **(a) Deep Field** (recommended). It is the farthest from Google and Microsoft, at 7.8 and 7.3 ΔE. Its marks serve as fills and text, and it reads serious. It keeps productive mode's rules.
   - (b) Signal: the loudest, with the most equal weight, but a lemon yellow.
   - (c) Warm Paper: the calmest, but a common look.
   - (d) Spectral: one mark for every ground, but a gold instead of a yellow.
   - (e) Charon, kept: no change, but three dots within 4 ΔE of Google's.

   *Why (a):* the owner's one constraint is to compete with Google. Deep Field is the only candidate at least 7 ΔE from both references in every hue. It also passes every counted pair with no exceptions beyond the yellow logo.
2. **May coloured dots sit on dark grounds, beyond the icon?**
   - **(a) Yes, on the stage only, at the lifted values** (recommended). They pass every pair on every dark ground.
   - (b) Yes, everywhere dark, at the markStage floor.
   - (c) No; keep paper dots, as the shipped dark theme does today.
3. **May an expressive stage show the four together?**
   - **(a) As light only: one hue's bloom per object** (recommended). Paper text keeps 11.19 or more under it.
   - (b) As the reading-order band as well. It is safe only in Spectral, where it holds one lightness.
   - (c) No; one accent per surface everywhere.

## Sources

**Google**

- [Evolving the Google identity](https://design.google/library/evolving-google-identity), Google Design
- [Brand elements](https://about.google/brand-resource-center/brand-elements), Google brand resource center (summarised through search results; the page itself was not opened)
- Google's logo hex values, third-party only: [color.codes.in](https://color.codes.in/brands/google), [brandkit.pro](https://brandkit.pro/brand/google)
- Material colour utilities: [`hct.ts`](https://raw.githubusercontent.com/material-foundation/material-color-utilities/main/typescript/hct/hct.ts), [`tonal_palette.ts`](https://raw.githubusercontent.com/material-foundation/material-color-utilities/main/typescript/palettes/tonal_palette.ts)
- [Material Components for Android, Color](https://raw.githubusercontent.com/material-components/material-components-android/master/docs/theming/Color.md)
- [Design a dark theme with Material and Figma](https://codelabs.developers.google.com/codelabs/design-material-darktheme/), Google codelab
- Not readable by our fetcher (scripted pages): [Material 3, how the colour system works](https://m3.material.io/styles/color/system/how-the-system-works), [The science of color & design](https://m3.material.io/blog/science-of-color-design), [Material 2, dark theme](https://m2.material.io/design/color/dark-theme)

**Microsoft**

- [Microsoft unveils a new look](https://blogs.microsoft.com/blog/2012/08/23/microsoft-unveils-a-new-look/), 2012-08-23
- [Fluent 2, Color](https://fluent2.microsoft.design/color)
- [Fluent UI, `brandColors.ts`](https://raw.githubusercontent.com/microsoft/fluentui/master/packages/tokens/src/global/brandColors.ts)
- Microsoft's logo hex values, third-party only: [brandpalettes.com](https://brandpalettes.com/microsoft-color-codes/), [brandkit.pro](https://brandkit.pro/brand/microsoft)

**Other primary-colour brands**

- [Say hello to our new logo](https://slack.com/blog/news/say-hello-new-logo), Slack
- [Slack](https://www.pentagram.com/work/slack), Pentagram
- [Mastercard, the story](https://www.pentagram.com/work/mastercard/story), Pentagram
- eBay, secondary only: [The Drum, 2012](https://www.thedrum.com/news/2012/09/14/ebay-implements-brand-refresh-new-logo), [Ubergizmo, 2012](https://www.ubergizmo.com/2012/09/ebay-logo-redesigned/)

**Colour science and contrast**

- [A perceptual color space for image processing (Oklab)](https://bottosson.github.io/posts/oklab/), Björn Ottosson
- [Why APCA](https://git.apcacontrast.com/documentation/WhyAPCA)
- [Helmholtz–Kohlrausch effect](https://en.wikipedia.org/wiki/Helmholtz%E2%80%93Kohlrausch_effect), Wikipedia
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/), SC 1.4.3 (the logotype exception) and SC 1.4.11
- APCA constants, CVD matrices and OKLCH background: as cited in `2026-11-01-how-a-code-palette-is-made.md`, Sources

**Local**

- `context/constitution.md` §4.4, §6; `context/decisions.md` ("The icon on ink"; "One system, many products"; "A chart carries a name and a table"; "The design calls for `001`" palette entries)
- `context/research/2026-11-01-how-a-code-palette-is-made.md`; `context/research/2026-11-01-how-brands-colour-their-code.md`; `context/research/2026-11-01-what-a-product-site-needs-to-compete.md` (the lab's stage literals)
- `tokens/pluto.tokens.json` (`primitives`, `themes`, `contrast`); `scripts/contrast.ts`
