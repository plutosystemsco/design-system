# Visual identity: the scorecard's look rows, the gates and the path

- **Status:** complete. A proposal. It changes no rule, no score and no roadmap entry until the owner answers §6.
- **Date:** 2026-11-17
- **Author:** the design lead
- **Question:** The owner says Carbon is "miles ahead of us in design". Five memos measured why. Which of their roughly 45 criteria should become scorecard rows? Which process gates should a team of one owner and AI agents adopt? What is Kuiper's gap, and what work closes it fastest?
- **What would answer it:** the five 2026-11-17 memos, merged, with every criterion kept only if it separates the polished sites from Kuiper; the constitution (§3, §5), `AGENTS.md`, `roadmap.md` §1–2 and the scorecard's rubric format (§2).
- **What it blocks:** the scorecard's rows 16–23, the roadmap's re-ranking for look, and the proposed specs in §4.

## In short

- **The 2026-11-15 synthesis was wrong.** It said the reference sites "are not better designed screen for screen". Measured screen by screen, they are. The scorecard could not see it, because none of its fifteen rows measures how the site looks (§1).
- **Eight new rows, 16–23** (§2): six scripted, two judged. They keep only what separates. Kuiper's strengths (dark parity, one icon size, spacing on its scale, one signature device) are dropped from the look rows, because the existing rows already count them.
- **On those rows, Kuiper scores 5 of 32. Carbon scores 28, and the best per row adds to 29.** Two of Carbon's points and both judged rows are provisional.
- **Five gates** (§3): a written visual bar, screenshots attached to every change that moves pixels, a visual review by an agent who did not build the change, the owner's eye at fixed points, and a polish batch each release. The screenshot baseline waits until there is a look worth freezing.
- **The path** (§4): nine proposed specs. The cheapest points come from a batch of fit-and-finish small changes. The largest come from a figure system that rides on `032`, and from art drawn in code from tokens. Targets: 19 of 32 at 0.14.0, 28 at 1.0 (level with Carbon today).
- **The rules mostly hold** (§5). Drawing in code from tokens fits "we design in code". No row rewards gradients, a radius ladder, an owned typeface, more hues or motion for its own sake. One owner ruling is in tension: the "pluto" lockup.
- **Four owner questions** (§6).

## How to read this

- **READ:** a memo or file says so. The five memos are cited by short name: *carbon*, *expressive*, *product*, *metrics* and *practice* (`2026-11-17-visual-*.md`).
- **EXECUTED:** a memo's measured figure, reported as theirs. This memo ran nothing new.
- **INFERRED:** the design lead's reasoning, including every reconciled score.
- **Scores:** 0 to 4, as in the scorecard. `p` marks a provisional score: derived from a memo's evidence, not yet measured by the row's own method. `?` means not measured, and counts as absent (scorecard §1). **Costs:** S is under a day, M a few days, L a week or more.
- **Separates** (from *metrics* §4): Kuiper falls outside the range of every polished reference, in the direction the eye agrees with.

## 1. Correcting the record

- **What was said.** The 2026-11-15 synthesis, which the design lead wrote, said: "The reference sites are not better designed screen for screen. They put the component first, keep a map of the system on every page, and finish small details." `018` was ranked from that.
- **What was measured** (EXECUTED, the memos):
  - Text fit: Kuiper has 23 defects at 1440 px on four pages. Primer has 1, and Atlassian, GOV.UK and Radix have 0 (*product* §2.1).
  - Pictures: Carbon's pages are 9–57% picture by area. Kuiper's Button, Colour, Type and home pages are 0% (*carbon* §2.5).
  - Rhythm: 16% of Kuiper's text sits on its 4 px grid, against 57–100% for the references (*product* §2.4).
  - Composition: 77% of Kuiper's home first screen is one flat colour. The references show 30–60% (*metrics* §3.1).
  - Every memo's own criteria rank Kuiper last: 16 of 44 (Carbon 33), 14 of 36 (Carbon 27), 13 of 36 (Material 34) and 10 of 36 (Radix 32).
- **Why the scorecard could not see it** (INFERRED, after *practice* §4):
  - Its rows measure breadth, guidance, evidence, tokens, speed and where the part sits. Rows 7 and 8 measure position and weight, not look.
  - Its checklists count presence. A table that clips its header still counts as a table.
  - The teardowns read structure: the tree, search, the first example's y. No shot was measured for fit, edges, rhythm or pictures.
  - The roadmap is ranked from the scorecard. So nothing about look was ever ranked, and no review could fail a change for it.
  - Kuiper's hygiene counts are genuinely good: spacing on its scale, one icon size, one consistent component template. They hid the gap. The gap is in how the pages use the tokens, and in having no pictures at all.

## 2. The new scorecard rows

### 2.1 How the 45 criteria became 8

- **Dropped because they do not separate** (*metrics* §4.3, *product* §2.6): counts of sizes, weights, line heights and text styles; spacing on a 4 px grid; distinct left edges; colourfulness; white space, edge density, quadtree complexity, symmetry; widows; icon sizes; corner radii.
- **Dropped because Kuiper is level or ahead:** dark parity (*carbon* V10, *expressive* V6, *product* V9). It is already counted by rows 4 and 9 (f). Signature device (*expressive* V8): Kuiper 3, Fluent 2.
- **Dropped because a polished reference fails them,** so they cannot measure what the owner sees:
  - Motion on token curves (*carbon* V9, *expressive* V5): Carbon 12% and Fluent 8%. Kuiper's fix still lands (§4, P2), because its own Brand › Motion page names the curve.
  - Spacing vocabulary (*metrics* V4): Carbon scores 1.
  - Colour richness and tonal range (*metrics* V2, *expressive* V3): Carbon and GOV.UK score below Kuiper, and the rows reward gradients the design book bans.
  - Header art on leaf pages (*expressive* V2): Primer, GOV.UK and Radix have none. Home art is kept, in row 21 (a).
  - Surface and shape ladder (*expressive* V4): Carbon is square and flat.
  - One brand moment (*product* V7): Material spends colour on every surface. The memos split two against two on Kuiper's four colours (§5).
- **Merged:** fit, defects and the finish checklist into row 16; near-miss edges and card rows into row 17; five type measures into row 18; plain ground and balance into row 19; figures and diagrams into row 20; owned art, the art palette and index framing into row 21; the four VisAWI-S facets and first-glance appeal into row 22; the logo-cover test into row 23.

### 2.2 The page set and the instruments

- **Pages:** home, the components index, Button, Dialog, Foundations › Type and Foundations › Colour, with each reference's nearest page, as the scorecard picks them (§1). Row 18 (c) adds one Brand leaf. Viewports: 1440 × 900 and 390 × 844, light, device scale 1.
- **Scripts:** `scripts/bench/craft.ts`, rebuilt from *product*'s appendix rules and *metrics*'s `measure.ts` (proposed spec P0). Only `measure.ts` survives. The other probes lived in scratchpads.
- **Judged rows** follow *metrics* §5. Fixed captures, recaptured for every site in the same run. Logos and wordmarks masked. Files coded, sides randomised and shown swapped. Two scorers who did not build the pages, calibrated on anchor exemplars. Krippendorff's α reported: below 0.667 the row is not used that run. A pinned model may score third, never as the tie-break. The owner reads the result beside the shots and may send a row back, with the reason logged.

### 2.3 The rows

**16. Fit and finish.** Text fits its box, and small details are done one way. *Scripted.* `craft.ts` counts fit defects by *product*'s rules (a wrapped short label, a token broken mid-word, a clipped cell, a table scrolling sideways at desktop), extended to CSS generated content (the key cap) and to `pre` on the home first screen. D is the count at 1440 and P at 390. Each failed finish check adds one to D: (i) one focus treatment that follows the target's shape; (ii) a cut code panel shows that it continues; (iii) no text overlaps another element; (iv) samples and visible text use the current names. *Anchors:* 4: D = 0 and P ≤ 10. 3: D ≤ 2 and P ≤ 25. 2: D ≤ 5. 1: D ≤ 15. 0: D > 15.

**17. Alignment.** Edges line up. *Scripted.* Two measures, and the row takes the lower. (a) Near-miss share: text blocks in `main` whose left edge sits 1–6 px from a more-used edge (one with three or more blocks), median over the pages. 4 ≤ 1%, 3 ≤ 3%, 2 ≤ 6%, 1 ≤ 12%, else 0. (b) Card rows whose titles' tops differ by more than 2 px: 4 at 0%, 3 ≤ 5%, 2 ≤ 15%, 1 ≤ 40%, else 0.

**18. Type.** One title, a ladder without a hole, a reading size. *Scripted checklist,* from computed styles. (a) On each component page, one prose size of 16 px or more holds at least 70% of prose characters; code, tables and navigation are excluded. (b) h1, h2 and h3 are each at least 1.2 times the next level, and h3 is larger than the body. (c) The leaf h1 has one size and one top (±4 px) across component, Foundations and Brand leaves. (d) At least 50% of characters have a line height on the system's base unit. (e) Text under 14 px holds at most a third of the non-code characters on Button. *Anchors:* 0–1 met → 0; 2 → 1; 3 → 2; 4 → 3; 5 → 4.

**19. Composition.** The first screen shows something, and the page's weight is balanced. *Scripted, pixels.* (a) Plain ground: the share of the home first screen in its single most common colour. 4 ≤ 0.60 with edge density ≤ 0.12 (else 3); 3 ≤ 0.67; 2 ≤ 0.74; 1 ≤ 0.80; else 0. (b) Balance: the mean over the six pages of 1 − (left-right + top-bottom imbalance)/2. 4 ≥ 0.70; 3 ≥ 0.60; 2 ≥ 0.55; 1 ≥ 0.45; else 0. *Score:* the mean of (a) and (b), rounded down, as row 8 does.

**20. Figures.** Docs pages explain with drawn figures in one frame. *Scripted count, judged frame.* Figures (media or drawn SVG of 96 × 64 px or more, not live stages) per 1,000 words on Button (every tab); each figure's ground, by its corner pixel; by eye on Button and Colour. *Anchors,* cumulative: 0: no figures beyond live examples and tables. 1: some figures, drawn more than one way. 2: one frame (ground, radius, caption) on both pages, and do/don't as paired figures, not text lists. 3: 2, plus 10 or more figures per 1,000 words, and a drawn diagram (layering, grid or scale) on the foundation page. 4: 3, plus a numbered anatomy figure with a legend, and at least 90% of figures on one ground.

**21. Owned pictures.** The system draws its own pictures, to rules, from its own palette. *Checklist, one item judged.* (a) The home first screen holds a picture built from the system's own parts, palette or shapes, over at least 20% of it. (b) Index pictures are composed: one artboard, no ink box touching its edge, ink filling at most 60% of the frame at the 90th percentile. (c) A pictogram or spot-illustration set of its own, with written rules (grid, stroke, palette). (d) At least 90% of colour uses in drawn art sit within 8 RGB steps of a colour token. (e) Every picture is made for every scheme the site serves. (f) Judged: every picture on the site reads as one style. *Anchors:* 0–1 met → 0; 2 → 1; 3 → 2; 4–5 → 3; 6 → 4.

**22. Visual appeal.** *Judged, blind* (§2.2). The four VisAWI-S facets, each scored 0–4 on *metrics*' anchors: simplicity, diversity, colourfulness and craftsmanship. *Score:* their mean, rounded down. Each facet is also reported. The anchor exemplars are *metrics*' proposal: GOV.UK's Button (simplicity 4), Material's home (diversity 4), Primer's home (colourfulness 4), Radix's Button (craftsmanship 4) and Kuiper's home (level 2 on all four).

**23. Recognisable without the logo.** IBM's logo-cover test. *Judged, blind.* The four masked 1440 shots of each site, mixed with two stock documentation templates. Each scorer names the system. *Anchors:* 0: indistinguishable from stock. 1: one owned signal (a colour or a ground). 2: several owned signals, but stock chrome dominates leaf pages. 3: owned signals on every page, leaves included. 4: both scorers name it from any page at thumbnail size.

### 2.4 Scores

| # | Row | Kind | Kuiper | Carbon | Primer | Material 3 | Best |
|---|---|---|---|---|---|---|---|
| 16 | Fit and finish | Scripted | **0** (D 23, "Ctrl K", 3 lapses) | 4 p | 3 (D 1, P 4) | ? | 4 (GOV.UK, Radix) |
| 17 | Alignment | Scripted | **0** (a 2 p, b 0: 25 of 28 rows) | 4 p | 3 (b: 1 of 21) | ? | 4 (Carbon p) |
| 18 | Type | Scripted | **0** (none of five) | 3 ((d) ?) | 3 ((b) ?) | ? | 3 (Carbon, Primer, GOV.UK) |
| 19 | Composition | Scripted | **1** (0.774; 0.483) | 3 (0.600; 0.588) | 3 | 3 | 4 (Radix: 0.478; 0.744) |
| 20 | Figures | Scripted + judged | **0** | 4 | ? | 4 | 4 (Carbon, Material) |
| 21 | Owned pictures | Checklist | **0** (only (e)) | 3 (five; no dark) | ? | 2 p | 3 (Carbon) |
| 22 | Visual appeal | Judged | **2** p | 3 p | 3 p | 3 p | 3 |
| 23 | Recognisable | Judged | **2** p | 4 p | ? | ? | 4 (Carbon) |
| | **Look, of 32** | | **5** | **28** | ≥ 15 | ≥ 12 | 29 by row |

Evidence (READ unless marked):

- **16.** Kuiper's D is *product*'s 23. The probe missed the "Ctrl K" wrap (*metrics* §4.3), so the extended rule adds it. The three lapses are two focus treatments, a code panel cut with no sign that it continues, and the "Pluto" sample word on Type. The "Yellow" overlap is on Brand › Colour, outside the page set. Carbon showed no spill, truncation or sideways scroll on six pages (*metrics* §3.2), but not under these rules: `p`.
- **17.** Carbon: 0% near-miss over its pages (*carbon* §2.1); its tiles share one label line by the shots: `p`.
- **18.** Kuiper: prose about 53% at 16 px; h3 16 px on Button, equal to the body; h1 56 and 86.4 px, tops 132 and 168; rhythm 0.16; 13.5 px holds about 70% of Button's non-code text. Carbon: 78–98% at 16 px; steps 1.68, 1.46 and 1.37; one header on every leaf; 16 and 14 px carry 95%.
- **19.** *metrics* V1 and V3, EXECUTED.
- **20.** Carbon: 103 images on Button, anatomy with magenta callouts, do/don't pairs, the layering model drawn (*carbon* §2.5). Material: 12–26 figures per 1,000 words, numbered anatomy, about 90% on one lavender family (*expressive* §3.1). Kuiper: live stages only, and do/don't as text lists.
- **21.** Carbon meets (a) through (d) and (f): a hybrid-UI hero over 64% of the home, 40 of 41 thumbnails on one artboard with none touching its edge, 1,564 pictograms with rules, and 91% of art colours within 8 steps. It fails (e): no dark site. Material meets (a), (c) and (f), fails (e), and (b) and (d) are not measured.
- **22.** One unblinded scorer's facet scores (*metrics*, closing table): Kuiper 2/2/2/2, Carbon 4/3/4/4, Primer 4/3/4/4, Material 3/4/4/3. The first blind panel replaces them.
- **23.** *carbon* V11, one scorer, unblinded: Carbon 4, Kuiper 2.

### 2.5 Where the memos disagreed, and how it was settled

1. **Defects.** *metrics* found that they do not separate; *product* found 23 against 0–1. *metrics*' script counted skip links, icon ligatures and hidden text, and skipped `pre`. *product*'s rules filter those. The row uses *product*'s rules, extended to generated content.
2. **Kuiper's alignment: 2 (*carbon*) or 0 (*product*).** *carbon* read text edges only. *product* added the card rows. The row keeps both, and takes the lower: the weakest edge is what the eye finds.
3. **Template consistency.** *metrics* found Kuiper perfectly consistent. It read the component template only. *product* found drift across component, Foundations and Brand leaves. Row 18 (c) reads across templates.
4. **The title's size.** *product*'s "h1 within 2–3 times the body" fails Carbon's light 53.6 px title (3.35 times). The ladder rule (b) replaces it. It fails Kuiper's missing h3 step, not Carbon's choice.
5. **One face.** *carbon* asked for one superfamily, and *expressive* for a face the brand owns. Primer, GOV.UK and Radix separate from Kuiper on how type is used, not on who owns the face. Both clauses are dropped. Kuiper's faces are the design book's.
6. **Who counts in the judged rows.** *practice* had the owner's ratings count. *metrics* had blind scorers count. The owner cannot be blind to his own site, and the aesthetic-usability effect biases anyone who has used it (*metrics* §1.3). So blind scorers count, and the owner checks. His five-second panel is gate G6, not the score.
7. **Rounding.** Row 22 takes the mean rounded down, as row 8 does. On *metrics*' sum this costs Carbon one point (3 against its 3.75).

## 3. Process gates

Chosen from *practice*'s G1–G7 for one owner and up to five agents (INFERRED).

| Gate | Adopt? | What it changes in the pipeline |
|---|---|---|
| **G1 A written visual bar** | Yes, first | `context/visual-bar.md`: rows 16–23's anchors as the checkable part, judgement calls with a good and a bad shot each, and a reference board per template, taken from today's shot folders. The owner approves each version. Specs that move pixels cite it in their criteria. |
| **G2 Screenshots attached** | Yes | Every change that moves pixels attaches before-and-after shots of the page set and the pages it touches, at 1440 and 390, light and dark, from P0's capture script. A missing pair fails the change review. A small change attaches its pair too. |
| **G4 + G5 Visual review, with a side-by-side for templates** | Yes | After the build, beside the change review: an agent who wrote neither spec nor change reads the shots against the bar. A template change sits beside the board's shot of the same page, answering what the reference does that we do not, what we do better, and the one difference that matters most. Findings are blocker, major, minor or polish, each with a page, a place and a size, in `reviews/NNN-<slug>-visual-YYYY-MM-DD.md`. The pipeline becomes research → spec → review → tests → code → visual review → review, for changes that move pixels. This amends constitution §5, so it is the owner's (Q2). |
| **G6 The owner's eye** | Yes, at fixed points | The owner's written yes on any identity change (faces, weights, palette, grid, art style, the signature device), in the spec's landing notes. A five-minute first-glance panel before each tag. |
| **G7 A polish batch** | Yes | Each release carries one batch of small changes that clears the minor findings from its visual reviews. The scorecard's run log reports the open count. |
| G3 Screenshot baseline | Later | A baseline approves whatever is there first. Adopt it in lane E once P1, P4 and P9 have passed a visual review, so it freezes an approved look. |

## 4. The gap and the path

**Now:** Kuiper 5 of 32. Carbon 28. The best per row adds to 29.
**Targets** (INFERRED, if Q3 is answered (a)): **19 at 0.14.0** (16: 3, 17: 3, 18: 2, 19: 2, 20: 2, 21: 2, 22: 3, 23: 2); **28 at 1.0** (16 and 17 at 4, 18 and 20 at 4, 19, 21, 22 and 23 at 3).

### 4.1 The quick fixes

All small changes, each one page or one site component, in lane S unless marked.

- **Text fit** (row 16). The Foundations tables take the full content width at desktop, and their tokens break between words, as `023a` does for the API table. The Type page holds 20 of the 23 defects (*product* §2.1).
- **"Ctrl K"** (row 16). The key cap sets on one line (`src/lib/site/chrome/search.svelte`).
- **The home install command** (rows 16 and 22). It breaks only between words, or scrolls on one line with a visible edge.
- **The motion easing** (no row). `--default-transition-timing-function: var(--ease-standard)` beside the duration at `src/app.css:325`. Lane T, one line. It moves no look row, because Carbon fails the same check. It lands because Brand › Motion names the curve and 89 of 93 transitions ignore it.
- **The "pluto" lockup.** The owner ruled on 2026-11-15 that the bar keeps it. The owner's brief for this run listed it among the known defects (*product* §3, item 1). It waits on Q4. The Type page's "Pluto" sample word is not covered by the ruling; it becomes "Kuiper" in the batch.
- **Also in the batch:** index card titles share a line (row 17); "Copy page" pulls its icon out to the title's edge; one focus ring; a cut code panel shows that it continues (row 16); "Yellow" clears its card on Brand › Colour.

### 4.2 Proposed specs, ranked by rows moved per unit of effort

| Rank | Proposed spec | Scope, in one line | Lanes | Cost | Moves (INFERRED) |
|---|---|---|---|---|---|
| P0 | **The look instrument** | `craft.ts` for rows 16–19, from `measure.ts` and *product*'s rules; a capture script for G2; a masking script for the judged shots; the rows written into the scorecard's §2 | E | M | None. It scores the others, and G2 needs it |
| P1 | **The fit-and-finish batch** | §4.1's small changes, one at a time, with the first visual reviews run on them | S | S each, M together | 16: 0 → 3; 17: 0 → 2; 22: 2 → 3 |
| P2 | **Motion on its own curve** | The one-line default curve | T | S | No look row |
| P3 | **The bar names Kuiper** | Only if Q4 is answered (a) | S | S | 23 and 16 (iv), a step at most |
| P4 | **One title, a ladder, a reading size** | One h1 size and top across leaf templates; a real h3 step; prose at 16 px; heading weights only after G6. Line heights on a 4 px grid are a token change, so that part moves `041`'s type work forward | S, then T | M | 18: 0 → 3, and to 4 with the line heights |
| P5 | **The figure system, on `032`** | One figure frame as a site part, rendering the real component; do/don't as paired figures; anatomy numbered from slots (`032` already plans "anatomy on slots" and "live pairs with inert don'ts"); one drawn diagram per foundation page; every figure follows the scheme | S, site guidance | L, of which M is new to `032`; the pilot is `033` | 20: 0 → 3 at `033`, 4 at the rollout; 21 (e) held |
| P6 | **The home page, drawn** | A first screen that shows the system: Kuiper's own parts, greeked and drawn from tokens, over half the screen; sections with one message and one door each; no empty lower third; no loop, no campaign | S | M, after P7's first drawing | 19: 1 → 3; 21 (a); 22 and 23 a step |
| P7 | **Art drawn from tokens** | A rules page (grid, stroke, palette as tokens); art as Svelte or SVG in the repository; composed index pictures on one artboard; a short pictogram set for the doors and landings; a test that every drawn colour is a token | S, the Brand pages | L | 21: 0 → 3; 23: 2 → 3 |
| P8 | **Edge discipline** | Inline code in tables as tinted text, not bordered pills; one left edge for the chrome's column (today 136, 140, 148 and 158); figures snapped to column spans | S | M | 17: 2 → 4 |
| P9 | **The page-header system** | One header for every leaf: title, lede and facts in fixed places, a figure slot on Foundations and Brand leaves, a condensed sticky title. It must keep row 7: the part stays above y = 500, so it lands with `034` | S | M | 18 (c) held; 19 (b) on leaves; 23 a step |

**Order of work** (INFERRED). P0 and P1 first, with P2 beside them. Then P4 and P5. Then P7's first drawing and P6 together. Then P8 and P9. P1 to P4 need no owner answer, except G6 for heading weights. P5 to P9 are 0.14.0's work only if Q3 says so.

## 5. Conflicts with existing rules

1. **"Not a design-tool kit; we design in code"** (constitution §3). Carbon's and Material's art comes partly from design tools and agencies. *Resolution:* every picture is code: Svelte or SVG in the repository, drawn from tokens, tested. This fits the rule. No amendment.
2. **"Not a marketing site"** (§3). Carbon's home is a scroll-pinned story with an animation per stage. *Resolution:* take the structure (one message, a door and a picture per section) and leave the spectacle. The home shows the system itself, not claims. No amendment.
3. **No decorative gradients** (design book §05), **no colour as decoration** (§03), **no looping motion** (§06). *Resolution:* no row rewards gradients, colour richness, tonal range or a motion moment; all three criteria were dropped. Art is flat, in token colours, and each colour has a job: a part, a state, the mark. Kuiper's own Imagery page already names "figures" and "abstract data" as kinds of picture. No amendment.
4. **The one case radius** (`tokens/kuiper.tokens.json`: "every corner a part draws"). *Resolution:* keep it. Radii do not separate: Carbon is square and polished. *expressive*'s container step is not adopted. The visual review may raise it again if nesting reads tight.
5. **The design book's faces** (Geist, IBM Plex Sans, JetBrains Mono). *Resolution:* no row asks for one family or an owned face. Row 18 measures use. One risk is recorded: Kuiper's display face is IBM's own, which may cost row 23. A change of face or heading weight is an identity change, under G6.
6. **The door colours** (`015` decision 5). *product* calls them four brand moments; *carbon* and *expressive* call them a disciplined device. *Resolution:* no row decides it. The colourfulness facet of row 22 and the owner's panel will show whether it costs appeal. No change now.
7. **The lockup ruling** (roadmap §2, 2026-11-15). The owner ruled that the bar keeps "pluto". *product* ranks it critical, and the owner's own brief named it. *Resolution:* ask (Q4). Until then it is not a defect, and row 16 (iv) reads samples and text only.
8. **The part first** (scorecard row 7) **and live examples** (`015` decision 13). Carbon's 600 px header delays the part. Its pictures replace live demos. *Resolution:* P9 lands with `034` and holds row 7. Figures add to live examples, never replace them.
9. **Prior art is studied, never copied.** *Resolution:* no art, pictogram or titling style is taken from IBM, Google or Microsoft. The rows measure properties: fit, edges, ladder, ownership. They do not measure resemblance.

## 6. Questions for the owner

Recommended option first.

**Q1. Do the look rows join the headline total?**
1. **A "Look" subtotal of 32 beside the 56, with equal weight when the roadmap re-ranks.** Old runs stay comparable, and look still ranks work.
2. Into the headline total, which becomes 88.
3. Outside the total, as row 15 was.

**Q2. Do we adopt the visual review, and who scores the judged rows?**
1. **Gates G1, G2, G4 with G5, G6 and G7 as in §3. A designer agent who neither wrote nor built a change reviews it. Two such agents score rows 22 and 23 blind, with a pinned model as a third, never the tie-break. The owner checks the result and may send a row back.** Constitution §5 gains the visual-review step.
2. The owner scores rows 22 and 23 himself, with one agent, and no new gate beyond G1 and G2.
3. No new gate. An outside panel scores rows 22 and 23 with VisAWI-S once a release.

**Q3. Does 0.14.0's theme become visual identity?**
1. **"The page standard, and a look of its own".** P0–P9 join 0.14.0 beside `032`–`035`. Batch B (`037`) and the data palette (`038`) move to 0.15.0. Target: 19 of 32.
2. 0.14.0 keeps its theme. Only P0–P4 join it, and identity becomes 0.15.0's theme. Target: about 10.
3. A release of its own for identity, before the page standard.

**Q4. What does the bar say?**
1. **The Pluto Systems mark stays, and "Kuiper" is set in plain text beside it, as Carbon and Primer name the system beside the company.** This reads the 2026-11-15 ruling ("its name appears in the tab title and in text") without adding a logo or a wordmark.
2. As ruled: "pluto" alone.
3. A Kuiper lockup, reversing the ruling.
