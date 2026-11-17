# Visual quality: how to measure it, reliably and repeatably

- **Status:** complete. Research only; it changes no rule and no score. Its last section proposes scorecard rows for the design lead to take, or not.
- **Date:** 2026-11-17
- **Author:** a researcher (one of five on the visual-identity run)
- **Question:** The owner says Carbon is "miles ahead of us in design". The benchmark scorecard (`benchmark-scorecard.md`) measures breadth, tokens, speed and docs structure, but not how polished the site looks. How can visual quality be measured so that two runs, or two scorers, reach the same number? Which measures actually separate the polished reference sites from Kuiper's?
- **What would answer it:** the research on judged aesthetics, first impressions and computational aesthetics; a script that measures candidate metrics on Kuiper's built site and on reference sites; the numbers, read for which metrics separate and which don't; a judged rubric with anchors and a protocol that keeps it honest.
- **What it blocks:** nothing. It feeds the scorecard's next revision and the roadmap's ranking of visual work.

## In short

- **Polish can be measured, but mostly by judges.** The validated instrument is the VisAWI, the Visual Aesthetics of Websites Inventory. Its four-item short form, VisAWI-S, scores four facets: simplicity, diversity, colourfulness and craftsmanship. People judge appeal within 50 ms, and visual complexity drives that judgement more than colour does (§1).
- **Scripts measure ingredients, not quality.** They are repeatable here: across repeated loads, every DOM metric was identical, and the pixel metrics moved only on Material's animated home page, by under 1%. But most of them do not separate polished sites from Kuiper (§3, §4).
- **Four scripted measures separate.** Each was measured on six pages per site, at 1440 × 900:
  - **Plain ground on the home's first screen.** 77% of Kuiper's first screen is one flat colour. The references show 30–49%.
  - **Colour richness on the home's first screen.** Kuiper's first screen needs 8 colours to cover 95% of its pixels. Primer needs 45, Radix 35 and Material 108. These sites use pictures, gradients and live parts. GOV.UK, flat by design, needs 5.
  - **Layout balance.** Kuiper's mean is 0.48. The references range from 0.62 to 0.74, and Kuiper's best page (0.56) is below every reference's mean.
  - **Spacing vocabulary.** Kuiper uses a median of 24 distinct spacing values per page. The references use 17–23.
- **One more separates weakly.** Reading type: about half of Kuiper's prose is set at 13.5 px rather than its 16 px body size. Primer and GOV.UK set over 82% of their prose in one size of 16 px or more. Radix is as split as Kuiper.
- **These do not separate:**
  - the count of font sizes, weights, line heights and text colours;
  - the share of spacing on a 4 px grid (GOV.UK, on its own 5 px scale, scores 16–30%);
  - distinct left edges;
  - colourfulness;
  - white space and edge density on docs pages;
  - quadtree complexity;
  - symmetry;
  - widows, overflow and label wraps;
  - consistency across one template. Kuiper is perfectly consistent: its h1 sits at the same place on all five pages.
- **What scripts miss, judges see.** The "Ctrl K" key cap wraps onto two lines in the header on every page for Windows and Linux readers. The home page's install command breaks mid-word. Neither shows in the DOM text the script reads (§4.3).
- **Carbon could not be measured.** Its styles, fonts and examples come from hosts this session's network blocks. Its pages render unstyled (§6).
- **Proposed:** five scripted rows and four judged rows (the VisAWI-S facets). The judged rows are scored blind, from screenshots, by two scorers against anchor screenshots. Agreement is reported. The owner checks the result. A model judge may be a third scorer, never the decider. The table is at the end.

## How to read this

- **EXECUTED:** run in this research, on 2026-11-17, Linux 6.18 in a cloud session, Bun 1.4.4, Playwright 1.64.1 Chromium. Kuiper's site is the `build/` dated 2026-11-16 23:34 UTC, served by `scripts/bench/serve.ts`, at `bae40a8`. Numbers come from `2026-11-17-visual-metrics/results-*.json`, written by `measure.ts` in the same folder.
- **READ:** a source says so. This session could search the web but not fetch papers: arxiv.org, the VisAWI authors' site and the University of Washington's were outside the allowed network. So most papers are READ from their abstracts and from indexed summaries, with the URL given. Where a detail comes from this researcher's earlier reading and was not re-checked this run, it says "recalled".
- **INFERRED:** this researcher's reasoning, including every provisional judged score.
- **Terms** are defined where they first appear.

## 1. What the research says

### 1.1 Validated instruments for judged aesthetics

- **VisAWI.** An *inventory* is a questionnaire whose items were chosen and tested statistically. The VisAWI has 18 items in four facets (Moshagen and Thielsch, 2010, *Facets of visual aesthetics*, International Journal of Human-Computer Studies). The facets came from seven studies. READ: [the authors' instrument page](https://aupsy.uni-wuppertal.de/en/instrumente/visawi/), via search; [the 2010 paper](https://www.uni-muenster.de/OWMS/uploads/drafts_thielsch/pdf/moshagen_2010.pdf).
  - **Simplicity:** clarity, order, unity.
  - **Diversity:** visual interest, novelty, creativity.
  - **Colourfulness:** the colour composition and how pleasing it is.
  - **Craftsmanship:** skilled, careful, up-to-date design.
- **VisAWI-S.** Four items, one per facet, on a 7-point agreement scale. It measures one general aesthetic factor and approximates the long form well. It also predicts the intention to revisit (Moshagen and Thielsch, 2013, *Behaviour & Information Technology* 32(12), 1305–1311). READ: [the abstract](https://ideas.repec.org/a/taf/tbitxx/v32y2013i12p1305-1311.html). A 2023 preprint estimates that a difference of about 0.46 on its 7-point scale is the smallest one users notice. READ: [Is a mean difference of 0.46 relevant?](https://arxiv.org/pdf/2305.08945), via search. The item wording is roughly as follows (recalled; check the authors' form before use):
  - "Everything goes together on this site." (simplicity)
  - "The layout is pleasantly varied." (diversity)
  - "The colour composition is attractive." (colourfulness)
  - "The layout appears professionally designed." (craftsmanship)
- **Cut points.** The same group derives cut points by ROC analysis against an outside criterion. An *ROC analysis* finds the score that best separates two known groups. Their cut points differ more between kinds of website than their benchmarks do. READ: [Hirschfeld and Thielsch, 2015, Ergonomics 58(2)](https://www.hsbi.de/publikationsserver/record/468); [the e-health cut-points paper](https://dl.gi.de/items/fbbe60ee-adb2-454d-83ac-9a5aa7a1051c/full).
- **UEQ.** The User Experience Questionnaire has 26 opposite-word pairs in six scales: attractiveness, perspicuity, efficiency, dependability, stimulation and novelty (Laugwitz, Held and Schrepp, 2008). It has a public benchmark, and an 8-item short form, the UEQ-S. It measures use as well as looks, so it needs people who have used the site. READ: [the handbook](https://www.ueq-online.org/Material/Handbook.pdf); [the benchmark](https://www.ijimai.org/index.php/ijimai/article/view/6102).

INFERRED: VisAWI-S fits our question best. It is short, aesthetic-only and validated on websites, and it can be scored from screenshots. Its four facets also name what the owner sees: Carbon looks *crafted* and *varied*. The UEQ is for user studies, not for a scorecard row.

### 1.2 First impressions

- **50 ms.** People rated pages' visual appeal after 50 ms and after 500 ms, and the ratings agreed (Lindgaard, Fernandes, Dudek and Brown, 2006, *Behaviour & Information Technology* 25(2), 115–126). READ: [Nature's report](https://www.nature.com/news/2006/060109/full/news060109-13.html); [abstract](https://typeset.io/papers/attention-web-designers-you-have-50-milliseconds-to-make-a-3axej7ku89).
- **17 ms; complexity and prototypicality.** At 17, 33 and 50 ms, *visual complexity* (how much is going on) and *prototypicality* (how much the page looks like its kind of site) both shaped appeal. Complexity acts first. The pages rated best were low in complexity and high in prototypicality (Tuch et al., 2012, *IJHCS* 70(11)). READ: [Google Research](https://research.google/pubs/the-role-of-visual-complexity-and-prototypicality-regarding-first-impression-of-websites-working-towards-understanding-aesthetic-judgments/).
- **Complexity and colourfulness, computed.** 548 people rated 450 sites after 500 ms (Reinecke et al., CHI 2013). Image models predicted perceived complexity and colourfulness. Complexity mattered more than colourfulness. With demographics, the models explained about half the variance in appeal. The effect also differed by age, gender and education. READ: [the paper](https://kgajos.seas.harvard.edu/papers/reinecke13aesthetics.pdf), via search. The authors' code includes quadtree and XY decompositions. A *quadtree decomposition* splits the screen into quarters, again and again, while a block is not uniform. The leaf count measures complexity. READ: [vizweb](https://github.com/rmardiko/vizweb). A 2014 follow-up found that appeal peaks at a moderate level of complexity and colourfulness, and that the peak differs by group (recalled: Reinecke and Gajos, CHI 2014, [PDF](https://iis.seas.harvard.edu/papers/reinecke14visual.pdf)).

INFERRED: so more complexity is not better. Our scripted rows must reward "enough to show", never "the most".

### 1.3 The aesthetic-usability effect

- People rated attractive ATM layouts as easier to use (Kurosu and Kashimura, 1995). Tractinsky, Katz and Ikar (2000, *Interacting with Computers* 13(2)) replicated this, and found the correlation held after use too. READ: [Tractinsky 2000](https://mycourses.aalto.fi/pluginfile.php/1645430/mod_folder/content/0/Tractinsky%20%282000%29.pdf), via search.
- It is contested. The early studies rated systems people had not used. Later work found the reverse direction too: usable things get judged more beautiful. READ: [UXPA Journal, boundary conditions](https://uxpajournal.org/?p=4392); [Grishin, 2019](https://uxpajournal.org/wp-content/uploads/sites/7/pdf/JUS_Grishin_Feb2019.pdf).

INFERRED: for us this is a warning. A judge who knows Kuiper loads fast, or has used it, rates it as better-looking. So judges should score screenshots, not live sites, and not know which site is which.

### 1.4 Computational aesthetics

*Computational aesthetics* computes layout and image features that predict judged beauty.

- **Colourfulness.** Hasler and Süsstrunk (2003, SPIE Human Vision and Electronic Imaging VIII) fit a metric to 7-category ratings, with over 90% correlation. READ: [EPFL record](https://infoscience.epfl.ch/record/33994?ln=en). The metric, as recalled from the paper:
  - Opponent axes: rg = R − G and yb = ½(R + G) − B.
  - M = √(σ_rg² + σ_yb²) + 0.3 · √(μ_rg² + μ_yb²), where σ is a standard deviation and μ a mean.
  - Its categories begin at about 15 ("slightly"), 33 ("moderately"), 45 ("averagely"), 59 ("quite"), 82 ("highly") and 109 ("extremely").
- **Fourteen layout measures.** Ngo, Teo and Byrne (2003, *Information Sciences* 152) define balance, equilibrium, symmetry, sequence, cohesion, unity, proportion, simplicity, density, regularity, economy, homogeneity, rhythm, and order and complexity. *Balance* compares the visual weight on either side of the centre lines, from 0 to 1. Weight is area times distance from the axis. READ: [the paper's record](https://www.academia.edu/11749849/Modelling_interface_aesthetics), via search.
- **Interface complexity.** Miniukovich and De Angeli (AVI 2014) proposed six metrics for five things:
  - visual clutter;
  - symmetry;
  - *contour density* (how many edges);
  - figure-ground contrast;
  - colour variability.
  They explained 51% of aesthetics ratings and 50% of complexity ratings. READ: [the paper](https://www.academia.edu/11396872/Quantification_of_Interface_Visual_Complexity), via search.
- **Alignment and regularity.** Balinsky, Wiley and Roberts (DocEng 2009) measure alignment lines in document layouts. A GUI study notes that such measures need a precise detector of block positions. READ: [the record](https://bibtex.github.io/DocEng-2009-BalinskyWR.html); [a GUI-metrics study](https://www.slideshare.net/slideshow/towards-an-evaluation-of-graphical-user-interfaces-aesthetics-based-on-metrics/35574055). In a browser we have a precise detector, the DOM, so alignment is cheap to try (§2).

INFERRED: the best of these explain about half of judged appeal, on collections of very different sites. Among ten design-system sites that all look professional, the spread is far narrower. So we should expect most metrics not to separate. §3 finds exactly that.

### 1.5 Practice

- **Heuristic review.** Practitioners judge against named principles. NN/g lists five: scale, visual hierarchy, balance, contrast and Gestalt grouping. READ: [NN/g](https://www.nngroup.com/articles/principles-visual-design/). No public rubric with scored anchors was found.
- **Five-second test.** Show a screen for five seconds, hide it, then ask what people remember and what they felt. Christine Perfetti named it in the mid-2000s. Advice on numbers varies: 5–10 people for recall, 15–20 for direction, 20–50 unmoderated. READ: [Perfetti, Center Centre](https://articles.centercentre.com/?p=85); [Smashing case study](https://smashingmagazine.com/2023/12/five-second-testing-case-study).
- **Preference test.** Show two or more designs side by side and ask which people prefer, and why. INFERRED: it suits our case, Kuiper against a reference, if the sides are randomised and the brands hidden.

### 1.6 Making judged scores reliable

- **Agreement statistics.** *Inter-rater agreement* is how far independent scorers give the same score.
  - The *intraclass correlation* (ICC) suits numeric scores. Koo and Li (2016) read it, on the 95% confidence interval, as below 0.5 poor, 0.5–0.75 moderate, 0.75–0.9 good, and above 0.9 excellent. READ: [CASRAI](https://casrai.org/guides/intraclass-correlation-coefficient-icc); [PMC](https://pmc.ncbi.nlm.nih.gov/articles/4913118).
  - *Krippendorff's alpha* works for ordinal scores, any number of scorers and missing marks. Accept α ≥ 0.800, and use 0.667–0.800 only for tentative conclusions. READ: [Krippendorff's alpha](https://bookdown.org/mike/marketing_research/krippendorffs-alpha.html).
- **Anchors.** INFERRED from these and from rubric practice:
  - Scorers agree when each level names something observable, such as "one competing focal point" or "a label wraps", rather than a feeling like "fairly polished".
  - Each level should also have an *anchor exemplar*: a fixed screenshot that scores exactly that level.
  - Scorers should calibrate on the exemplars before each run.
  - Disagreements of more than one step are discussed against the anchor text. If the text was at fault, it is reworded.

### 1.7 A model as judge

- **Text judges.** Strong LLM judges agreed with people over 80% of the time on MT-Bench. They also showed three biases:
  - *position bias*: favouring the first answer shown;
  - *verbosity bias*: favouring longer answers;
  - *self-enhancement*: favouring their own answers.
  Swapping the order and scoring twice reduces position bias (Zheng et al., 2023). READ: [arXiv 2306.05685](https://arxiv.org/html/2306.05685v4), via search.
- **UI judges.** GPT-4o, Claude 3.5 Sonnet and Llama 3.2 Vision rated 30 interfaces on 1–7 scales. Each landed within ±1 of the human mean more than 75% of the time. Correlation was moderate to strong, best on surface factors such as aesthetic pleasure. They overrated ease of use (Luera et al., 2025). READ: [arXiv 2510.08783](https://arxiv.org/abs/2510.08783v1); [summary](https://liner.com/review/mllm-as-ui-judge-benchmarking-multimodal-llms-for-predicting-human). Other benchmarks report position bias in pairwise UI comparisons, and only moderate agreement with professional designers. READ: search summaries of WiserUI-Bench and AUV-Bench, not checked against the papers.
- INFERRED limits for us:
  - A model judge from the same vendor as the builder may favour its own taste.
  - A model can read a brand from a logo, so blinding needs the marks masked.
  - Its scores drift between model versions, so the version must be pinned and recorded.
  - It is cheap enough to score each pair both ways, three times.

## 2. Candidate metrics

### 2.1 Scripted, from a page in Playwright

All of these are in `measure.ts`. DOM metrics read the whole page. Pixel metrics read the first screen, 1440 × 900 at device scale 1.

| Metric | How | Why it might matter |
|---|---|---|
| Font sizes, weights, line heights, families, text colours | Distinct values in visible text, and how many cover 95% of characters | A disciplined type scale (§1.5, hierarchy) |
| Text styles | Distinct size–weight–family–colour combinations covering 95% of characters | The same, combined |
| Reading type | The dominant size of prose, and its share. *Prose* is text outside code, tables, navigation, headers, footers, controls and headings | One comfortable body size |
| Spacing on grid | The share of non-zero margins, paddings and gaps that are multiples of 4 px (and of 8 px) | Token discipline |
| Spacing vocabulary | Distinct non-zero spacing values on the page | The same, without assuming a 4 px base |
| Left edges | Distinct x positions (within 2 px) where text blocks, media and fields start on the first screen; and the share that start alone | Grid alignment (§1.4) |
| Defects | Horizontal scroll; text spilling its box; ellipsis truncation; a one-word last line (a *widow*) in headings and paragraphs; short labels that wrap; median characters per line | Craft (§1.1) |
| Media | Pictures, video, canvas, iframes and SVG of at least 64 × 64 px, plus CSS background images: count and area share | Imagery (diversity) |
| Colourfulness | Hasler–Süsstrunk M on the screenshot | §1.4 |
| Colour richness | 15-bit colours covering 95% of pixels | Pictures, gradients, depth |
| Plain ground | The share of pixels in the single most common colour | How much of the first screen is empty ground |
| White space | The share of 8 × 8 cells whose luminance range is under 6 | Empty area of any colour |
| Edge density | The share of pixels whose Sobel gradient exceeds 48 | Contour density (§1.4) |
| Quadtree leaves | Split while the luminance standard deviation exceeds 10, down to 8 px | Complexity (§1.2) |
| Balance | 1 − the mean of the left-right and top-bottom weight imbalances. Weight is each non-flat cell's distance from the centre (after Ngo) | §1.4 |
| Symmetry | The share of non-flat cells whose left-right mirror cell is also non-flat | §1.4 |
| Template consistency | Over five component pages: the mean pairwise overlap of their text-style sets, and the spread of the h1's position | Consistency |

### 2.2 Judged

The four VisAWI-S facets are scored 0–4 against anchors, blind, on side-by-side screenshots. The anchors are in the closing table. The protocol is in §5.

## 3. What we measured (EXECUTED)

**Setup.**

- **Pages.** Six per site: the home page, the Button page and four more component pages of the same template, chosen to match across sites:
  - Kuiper: checkbox, tabs, tooltip, dialog.
  - Primer: checkbox, underline-nav, tooltip, dialog.
  - Material: checkbox, tabs, tooltips, dialogs.
  - Radix Themes: checkbox, tabs, tooltip, dialog.
  - GOV.UK: checkboxes, tabs, details, error summary.
- **Browser.** Chromium at 1440 × 900 and device scale 1, with a light scheme and reduced motion.
- **Load.** Load the page, wait for the network to settle, scroll to the end and back, hide consent banners, then measure.
- **Repeats.** The home and Button pages were measured twice per run, and the whole run was done twice, about an hour apart.
- **Screenshots** of the home and Button pages are in `2026-11-17-visual-metrics/shots/`.

**Repeatability.** Every DOM metric was identical between repeats and between the two runs. Pixel metrics moved only on Material's home, whose live animation shifted its colour count (108–109), its quadtree count (6,856–6,871) and its white space (0.739–0.740), all by under 1%. Live sites change without notice, so this holds for a day, not a quarter.

### 3.1 Home page, first screen and whole page

| Metric | Kuiper | Primer | Material 3 | Radix Themes | GOV.UK |
|---|---|---|---|---|---|
| Font sizes: distinct / covering 95% | 8 / 5 | 6 / 4 | 9 / 4 | 9 / 5 | 5 / 3 |
| Text colours: distinct / 95% | 5 / 3 | 6 / 4 | 5 / 3 | 13 / 5 | 4 / 3 |
| Text styles: distinct / 95% | 20 / 14 | 11 / 8 | 17 / 9 | 32 / 20 | 10 / 6 |
| Spacing on 4 px, % | 89.6 | 93.6 | 65.9 | 73.5 | 16.0 |
| Spacing vocabulary | 22 | 14 | 18 | 18 | 16 |
| Left edges: distinct / items, first screen | 16 / 22 | 16 / 20 | 11 / 27 | 36 / 82 | 11 / 19 |
| Media: count, first-screen share % | 0, 0 | 6, 36.9 | 18, 33.4 | 1, 100 ¹ | 1, 7.3 |
| Colourfulness M | 52.7 | 41.2 | 44.0 | 22.8 | 89.4 |
| **Colour richness** | **8** | 45 | 108 | 35 | 5 |
| **Plain ground** | **0.774** | 0.477 | 0.303 | 0.478 | 0.492 |
| White space | 0.838 | 0.821 | 0.740 | 0.755 | 0.785 |
| Edge density | 0.058 | 0.057 | 0.116 | 0.100 | 0.101 |
| Quadtree leaves | 4,345 | 3,013 | 6,868 | 5,425 | 5,569 |
| **Balance** | **0.475** | 0.727 | 0.595 | 0.871 | 0.499 |
| Symmetry | 0.363 | 0.334 | 0.266 | 0.247 | 0.411 |
| Heading widows; paragraph widows % | 1; 10 | 0; 0 | 1; 12 | 0; 20 | 0; 0 |

¹ Radix's "100%" is a page-wide CSS background image. Its live example cards, which fill the right of the first screen, are DOM, not media. The media metric counts how a site is built, not what it shows.

### 3.2 Button page

| Metric | Kuiper | Primer | Material 3 | Radix Themes | GOV.UK |
|---|---|---|---|---|---|
| Font sizes: distinct / 95% | 6 / 2 | 10 / 5 | 9 / 4 | 9 / 4 | 6 / 2 |
| Weights: distinct / 95% | 4 / 2 | 5 / 3 | 4 / 2 | 3 / 2 | 2 / 1 |
| Text colours: distinct / 95% | 13 / 7 | 15 / 8 | 6 / 3 | 12 / 6 | 4 / 2 |
| **Prose: dominant size, its share %** | **16 px, 54.6** (13.5 px, 45.4) | 16 px, 94.0 | 16 px, 66.1 ² | 16 px, 58.5 | 19 px, 94.3 |
| Spacing on 4 px, % | 89.1 | 88.4 | 69.3 | 82.5 | 29.9 |
| **Spacing vocabulary** | **25** | 18 | 23 | 19 | 19 |
| Left edges: distinct / items | 30 / 78 | 34 / 79 | 20 / 42 | 34 / 88 | 14 / 43 |
| Spills; truncated; horizontal scroll | 0; 0; no | 6; 0; no ³ | 3; 0; no | 0; 0; no | 0; 0; no |
| Paragraph widows % | 18.8 | 28.0 | 23.1 | 0 | 25.8 |
| Median characters per line | 71 | 47 | 57 | 80 | 46 |
| Colourfulness M | 26.1 | 7.4 | 41.9 | 10.5 | 36.8 |
| Colour richness | 7 | 1 | 12 | 3 | 3 |
| Plain ground | 0.834 | 0.956 | 0.324 | 0.893 | 0.840 |
| White space | 0.830 | 0.849 | 0.849 | 0.841 | 0.833 |
| Edge density | 0.067 | 0.068 | 0.064 | 0.067 | 0.072 |
| Quadtree leaves | 3,700 | 2,755 | 4,270 | 2,971 | 4,138 |
| **Balance** | **0.417** | 0.557 | 0.657 | 0.780 | 0.674 |

² Material's prose could not be isolated by the filter, so this is all its text, navigation included. ³ Primer's spills are skip links and "Loading" placeholders, which are hidden by design. Spill counts need a look before they count as defects.

### 3.3 Across one template (Button and four more component pages)

| | Kuiper | Primer | Material 3 | Radix Themes | GOV.UK |
|---|---|---|---|---|---|
| h1 top, px (five pages) | 132 ×5 | 161 ×5 | 164–179 | 128 ×5 | 191 ×5 |
| h1 left, px | 392 ×5 | 366 ×5 | 152 ×5 | 428 ×5 | 460 ×5 |
| Text-style overlap (mean pairwise Jaccard) | 0.79 | 0.68 | 0.89 | 0.62 | 0.74 |
| Prose: dominant size, share % | 16 (52–55) on 3 pages; 13.5 (52–57) on 2 | 16 (82–94) | 16 (59–66) ² | 14 (49–67) on 3; 16 (54–59) on 2 | 19 (92–99) |
| Spacing vocabulary, six pages | 22–25, median 24 | 14–18, median 17 | 18–23, median 23 | 17–19, median 19 | 16–19, median 19 |
| Balance, six pages: mean (range) | **0.483** (0.417–0.559) | 0.617 (0.550–0.727) | 0.671 (0.431–0.895) | 0.744 (0.648–0.871) | 0.641 (0.499–0.743) |
| Left / top heavy, six pages | left 6, top 6 | left 5, top 5 | left 1, top 6 | left 5, top 3 | left 6, top 6 |

The *Jaccard* overlap is the size of two sets' intersection divided by the size of their union.

## 4. Which metrics separate

The polished set here is Primer, Material 3 and Radix Themes. GOV.UK is polished but deliberately plain. A metric *separates* when Kuiper falls outside the range of all three polished references in the direction the eye agrees with.

### 4.1 They separate (EXECUTED numbers; INFERRED reading)

1. **Plain ground on the home's first screen.** Kuiper 0.774; references 0.303–0.492, GOV.UK included.
   - Kuiper's first screen is mostly cream ground around a 160 px word and four circles.
   - Every reference fills half or more of its first screen with something: pictures of the product (Primer, Material), live parts (Radix) or a coloured band with an illustration (GOV.UK).
   - This is the clearest scripted gap.
2. **Colour richness on the home's first screen.** Kuiper 8; Primer 45, Radix 35, Material 108; GOV.UK 5.
   - It counts gradients, photographs, shadows and anti-aliased illustration.
   - It does not reward GOV.UK's flat illustration, so it measures pictorial depth, not taste.
   - On docs pages it does not separate (1–12).
3. **Layout balance.** Kuiper has the lowest mean, 0.483. The references range from 0.617 to 0.744. Kuiper's best page, 0.559, is below every reference's mean.
   - The cause is left-right imbalance: 0.37–0.49 on Kuiper's pages.
   - Kuiper's content column and left navigation carry the weight. The right rail holds a short "On this page" list over empty ground.
   - On the home page, the display word fills the left. The circles end at about y = 590, and the lower third is empty.
4. **Spacing vocabulary.** Kuiper uses 22–25 distinct spacing values per page, the most, or tied for the most, on every page. Primer uses 14–18 and Radix 17–19.
   - Material reaches 23, so the gap is narrow.
   - Kuiper's off-grid values include 6 px (168 uses on Button) and 1 px (28 uses).
   - It is the weakest of the four, but it can be acted on directly: the token spacing scale.

### 4.2 They separate weakly, or only from some

- **Reading type.** Kuiper splits its prose about evenly between 16 px and 13.5 px. It sets example descriptions, the left navigation and much of the guidance at 13.5 px. Primer (82–94% at 16 px) and GOV.UK (92–99% at 19 px) use one body size. Radix splits like Kuiper (14 and 16 px), and Radix looks polished, so this is a reading-comfort row more than a polish row.
- **Media.** Kuiper has no picture or illustration on any of its six pages. Primer and Material have them on the home page, and Material also on every component page. But the metric counts how things are built: Kuiper's circles are CSS, and Radix's live cards are DOM. Leave imagery to the judged diversity facet.

### 4.3 They do not separate

- **Type-scale counts.** Font sizes, weights, line heights, colours and styles: Kuiper sits inside the references' range on every page. On the Button page, 2 sizes cover 95% of Kuiper's text, against 4–5 for Primer, Material and Radix. More sizes is not worse, and fewer is not better. GOV.UK also uses 2.
- **Spacing on a 4 px grid.** Kuiper 83–90%, Primer 88–94%, Radix 74–85%, Material 62–69%, GOV.UK 16–30%. It measures which base a scale uses, not discipline. GOV.UK's scale is 5, 10, 15, 30.
- **Left edges.** Distinct edges per item and the share of lone edges overlap completely. Top navigation and side navigation each add many edges by design.
- **Colourfulness.** Kuiper's home scores 52.7 (between "averagely" and "quite" colourful). GOV.UK scores 89.4 and Radix 22.8. It tracks brand colour, not polish.
- **White space, edge density, quadtree leaves, symmetry.** On docs pages all sites sit within 0.77–0.87 white space and 0.057–0.11 edge density. On the home page, Kuiper's white space (0.838) is the highest, which restates plain ground less sharply.
- **Defects.** No site has horizontal scroll at 1440. Paragraph widows run from 0 to 60% everywhere. Spills and label wraps are dominated by false positives:
  - skip links and "Loading" placeholders;
  - Material's icon-over-label navigation, where the icon ligature counts as a word;
  - Radix's visually hidden prop descriptions.
  The real defects found by eye were missed by the script:
  - **"Ctrl K".** The search key cap wraps onto two lines on every Kuiper page for Windows and Linux readers. The text comes from CSS generated content (`data-keys` in `src/lib/site/chrome/search.svelte`), so DOM text never sees it. On a Mac it reads "⌘K" and fits, which may be why it has gone unnoticed.
  - **The install command** on the home page breaks mid-word ("pluto-systems-" / "design…"). It is in `pre`/`code`, which the spill check skips.
  - **The lede** ends on the one-word line "copy." The widow check counted it, among 10% of paragraphs.
- **Template consistency.** Kuiper is as consistent as any reference. Its h1 is at (392, 132) on all five pages, and its style overlap is 0.79.

**What follows** (INFERRED). The gap the owner sees is not in the countable hygiene of type and spacing. There Kuiper is level or ahead. It is in three things:

- what the first screen shows (plain ground, colour richness);
- how weight is distributed (balance);
- finish details that only a careful eye catches (craftsmanship).

The first two can be scripted. The rest must be judged.

## 5. Keeping judged scores honest (INFERRED, from §1.2–1.7)

1. **A fixed reference set.** Score Kuiper beside the same four references every run: Primer, Material 3, Radix Themes and GOV.UK. Add Carbon once its hosts are reachable (§6).
2. **Fixed captures, not live sites.** Use `measure.ts`'s screenshots: home and Button, 1440 × 900, device scale 1, light scheme. Recapture all sites in the same run. Store the shots in the run's folder so a later scorer sees exactly the same pixels.
3. **Blind.**
   - Mask logos and wordmarks with a neutral block.
   - Name the files by a random code.
   - Pair each site with each other site, side by side, in a random order that is also shown swapped.
   - Scorers see the anchors and the exemplars, not the site names.
4. **Two human scorers.** They must not have built the pages scored. They calibrate on the exemplars first, then score alone. Report Krippendorff's α (ordinal) per facet. Below 0.667 the facet's scores are not used that run, and its anchors are reworded. From 0.667 to 0.8 they are marked tentative. A pair more than one step apart is discussed against the anchor text. Change the score only if the text says so, and log the change.
5. **A model judge as a third scorer, never the decider.**
   - Pin and record the model version.
   - Score each pair in both orders, three times, and keep the median.
   - Report its agreement with the two humans.
   - Never let it break a tie alone.
   - Watch for a vendor's own-taste bias (§1.7).
6. **An owner check.** The owner reads the final judged scores beside the screenshots. They may send a facet back for rescoring, with a reason recorded in the run log. They do not edit a score directly.
7. **Exemplars evolve slowly.** Change an anchor exemplar only between runs, by a recorded decision. Rescore the previous run's shots with the new anchors, so movement is not an artefact.
8. **A periodic outside check.** Once a release, run a five-second test and the VisAWI-S with 15–20 people outside the team, on the same masked screenshots. If its ranking disagrees with the panel's, the panel's anchors are wrong.

## 6. Limits

- **Carbon is not in the numbers.**
  - Its CSS, scripts and fonts come from `cdn.carbondesignsystem.com` and `1.www.s81c.com`, and its examples from `react.carbondesignsystem.com`. This session's network allows none of them.
  - Its pages rendered as unstyled HTML, so the rows were dropped.
  - Re-running `measure.ts` with Carbon added back to `SITES` needs those three hosts allowed. The owner named Carbon, so the first real run of these rows should include it.
  - Spectrum's fonts (`use.typekit.net`) and Atlassian's CSS (`ds-cdn.prod-east.frontend.public.atl-paas.net`) are blocked too, so they were not used.
- **Material is under-read.** Its pages scroll inside a container, not the window, so the script's scroll did not wake lazy content. Its character counts (1,600–3,400) are low, and its prose could not be isolated.
- **The scripted anchors rest on five sites and six pages each.** They are calibrated to today's references. A cut point set from four polished sites is a guess at the band, not a law.
- **The pixel metrics are crude.**
  - Balance and plain ground treat any non-flat cell as weight. A busy background would score as balanced.
  - The guards in the anchors, a ceiling on edge density and a floor on plain ground, keep "more" from winning (§1.2).
- **Light scheme only, 1440 only.** Dark mode and phone width are not measured here.
- **The provisional judged scores** in the table are one unblinded scorer's (this researcher's), from the screenshots. They show how the anchors read. They are not a measurement.

## 7. Questions for the owner

1. **Should visual-quality rows join the scorecard's headline total?**
   - (a) **Recommended.** Add them as a separate block, "Visual quality", with its own total out of 36, beside the 56. Earlier runs stay comparable, and polish is never averaged away by breadth.
   - (b) Add them to the headline total.
   - (c) Keep them out of the scorecard, as a separate periodic review.
2. **Who scores the judged rows?**
   - (a) **Recommended.** Two scorers from the five-agent pool who did not build the pages, blind, plus a pinned model as a third, with the owner's check.
   - (b) The owner plus one agent.
   - (c) An outside panel each release, with VisAWI-S.
3. **May the session's network allow Carbon's three asset hosts** (`cdn.carbondesignsystem.com`, `1.www.s81c.com`, `react.carbondesignsystem.com`) so Carbon can be measured?
   - (a) **Recommended.** Yes, for benchmark runs.
   - (b) No. Use the four other references.

## Proposed scorecard criteria

Each score is 0 to 4. "Six pages" means the home page, the Button page and the four template pages in §3. References' and Kuiper's scripted scores are EXECUTED. Judged scores are **provisional**: one unblinded scorer (INFERRED), to be replaced by the first blind panel (§5). Carbon is not scored (§6).

| # | Criterion | Kind | How to measure | Anchors, 0–4 | Primer | Material 3 | Radix | GOV.UK | Kuiper |
|---|---|---|---|---|---|---|---|---|---|
| V1 | First screen has something to show | Scripted | Home, first screen: the share of pixels in the single most common colour (`plainGround`) | 4 ≤ 0.50 (and edge density ≤ 0.12; else 3); 3 ≤ 0.60; 2 ≤ 0.70; 1 ≤ 0.80; 0 > 0.80 | 4 (0.477) | 4 (0.303) | 4 (0.478) | 4 (0.492) | **1** (0.774) |
| V2 | Pictorial depth | Scripted | Home, first screen: the count of 15-bit colours covering 95% of pixels | 4 ≥ 32; 3 ≥ 16; 2 ≥ 8; 1 ≥ 4; 0 < 4 | 4 (45) | 4 (108) | 4 (35) | 1 (5) | **2** (8) |
| V3 | Balance | Scripted | Mean over six pages of 1 − (left-right + top-bottom imbalance)/2, weight = non-flat 8 px cells × distance from centre | 4 ≥ 0.70; 3 ≥ 0.60; 2 ≥ 0.55; 1 ≥ 0.45; 0 < 0.45 | 3 (0.617) | 3 (0.671) | 4 (0.744) | 3 (0.641) | **1** (0.483) |
| V4 | Spacing vocabulary | Scripted | Median over six pages of the distinct non-zero margin, padding and gap values | 4 ≤ 17; 3 ≤ 19; 2 ≤ 21; 1 ≤ 23; 0 ≥ 24 | 4 (17) | 1 (23) | 3 (19) | 3 (19) | **0** (24) |
| V5 | Reading type | Scripted | Per template page, the dominant prose size and its share of prose. Score each page, take the median of five | 4: ≥ 16 px and ≥ 85%; 3: ≥ 16 px and ≥ 70%; 2: ≥ 16 px and ≥ 50%; 1: dominant ≥ 14 px; 0: < 14 px | 4 (16, 82–94%) | 2 (16, 59–66%, all text) | 1 (14 on 3 of 5) | 4 (19, 92–99%) | **2** (16 on 3 of 5, ≈ 53%) |
| J1 | Simplicity | Judged | Masked home and Button shots, blind, two scorers (§5); the page scores are averaged and rounded down | 4: one focal point per screen; every element in an evident group; one alignment system. 3: clear focus and grouping; one or two elements compete or leave the grid. 2: several competing emphases, or surfaces nested three deep. 1: unclear what comes first. 0: disordered | 4 | 3 | 4 | 4 | **2** |
| J2 | Diversity | Judged | As J1 | 4: the first screen shows the product richly (pictures, illustration or live parts across a third or more), with varied scale; docs pages carry illustration or rich specimens. 3: imagery or specimens on home; docs varied but plain. 2: a visual device (shapes, colour blocks) but no picture of the product. 1: text and flat shapes; one layout repeated. 0: monotonous text | 3 | 4 | 3 | 2 | **2** |
| J3 | Colourfulness | Judged | As J1 | 4: a deliberate palette, one or two accents over calm neutrals, colour carries meaning, tints or gradients add depth. 3: pleasant and restrained, accents consistent, little depth. 2: hues compete at equal weight, or the ground reads dull. 1: clashing or muddy. 0: no evident palette | 4 | 4 | 4 | 3 | **2** |
| J4 | Craftsmanship | Judged | As J1, plus a checklist read on each shot: wrapped labels or key caps, code broken mid-token, one-word last lines in a lede or heading, clipped or misaligned parts, mixed radii or borders | 4: no visible defect. 3: one minor defect. 2: two or three minor defects, or one obvious. 1: several obvious defects. 0: looks unfinished | 4 | 3 | 4 | 4 | **2** |
| | **Total, of 36** | | | | 34 | 28 | 31 | 28 | **14** |

**Anchor exemplars for the judged rows** (to be fixed by the first panel; proposed from this run's shots):

- **Simplicity 4:** `govuk-button.png`.
- **Diversity 4:** `material-home.png`.
- **Colourfulness 4:** `primer-home.png`.
- **Craftsmanship 4:** `radix-button.png`.
- **Level 2, for all four facets:** `kuiper-home.png`. Its defects are the "Ctrl K" wrap, the code broken mid-word, the "copy." widow, and four saturated hues at equal weight.

**How judged scores stay honest** (§5, in one place):

- the fixed reference set and fixed captures;
- logos masked, file names coded, sides randomised and swapped;
- two human scorers who did not build the pages, calibrated on exemplars, with Krippendorff's α reported (≥ 0.667 to use, ≥ 0.8 to trust);
- a pinned model as a third scorer, scored in both orders, three times, never the tie-break;
- the owner's check, with any send-back logged;
- an outside five-second test and VisAWI-S each release, to check the anchors themselves.

**What would move Kuiper one step on each** (INFERRED, for the roadmap):

- **V1, V2, J2:** a home first screen that shows the system itself: live parts, or a picture of them, across at least half the screen.
- **V3:** a right rail or column that carries weight on docs pages, and a home layout whose lower third is not empty.
- **V4:** fold 6 px and 1 px spacing into the token scale.
- **V5:** one 16 px body size for prose, with descriptions and navigation included.
- **J4:** fix the key cap wrap and the code wrap.
