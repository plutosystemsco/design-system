# Restraint that reads as quality: five product-led sites, and a craft audit of Kuiper's

- **Status:** complete
- **Date:** 2026-11-17
- **Author:** a researcher, one of five running at once at the owner's request. The owner looked at carbondesignsystem.com, said it is "miles ahead of us in design", and asked why we are not making progress.
- **Question:** Primer, Atlassian, Polaris, GOV.UK and Radix look polished through restraint, not illustration. What makes their restraint read as quality and not as plainness? Where does Kuiper's site fall short of that, defect by defect? Which of these signals can become benchmark scorecard rows, scored 0–4, by script or by a written rubric?
- **What would answer it:** the five sites and Kuiper's built site captured at 1440 × 900 and 390 × 844; one in-page probe run on the same page types on all six; a craft audit of Kuiper's home, Components index, Button, Dialog, Foundations pages, Brand pages, open search, phone layout and dark mode; what the large organisations write about how they keep their finish.
- **What it blocks:** nothing. It feeds the scorecard's next revision (`benchmark-scorecard.md`) and the roadmap's ranking. The defects in §3 are each small-change sized, and none is decided here.

## In short

- **The owner is right, and the earlier memo was wrong on this point.** On fixed checks, the references show 0 or 1 text-fit defects at 1440 px on four comparable pages. Kuiper shows 23. The references have 0 to 4 near-miss edges. Kuiper has 9, plus 25 card rows whose titles sit at different heights. The 2026-11-15 synthesis said the references are "not better designed screen for screen". Measured, they are (EXECUTED, §2).
- **Restraint reads as quality when nothing is off.** A quiet page has nothing to hide a defect behind. A wrapped key hint or a clipped table header becomes the loudest thing on screen (INFERRED). The five references keep four things exact:
  - one frame and one left edge;
  - every line height on the grid (Atlassian 100% of text on a 4 px grid, GOV.UK 98% on its 5 px grid);
  - one focus ring;
  - one brand moment, placed once.
- **Kuiper has 28 craft defects** (§3): 2 critical, 8 high, 11 medium and 7 low. The worst:
  1. the lockup says "pluto" on every page;
  2. Foundations tables clip their headers and values and break tokens mid-word at desktop width;
  3. "Ctrl K" wraps inside the search button;
  4. the home page leads with a raw command, broken mid-word, and four discs;
  5. index card titles do not share a line in 25 of 28 rows.
- **Four signals do not separate polish from its absence.** These are spacing on a 4 px scale, the count of type styles, icon sizes and corner radii. Kuiper scores as well as the references on all four (§2.6). Its gap is elsewhere: fit, alignment, rhythm, consistency between templates, and finish.
- **Nine proposed criteria** close the memo. Four are scripted, one is a scripted checklist, and four are judged against written anchors. Kuiper scores 10 of 36. GOV.UK scores 28, Radix 32, Primer 27 (with one criterion unscored) and Atlassian 25. Polaris could not be reached.

## How to read this memo

- **EXECUTED:** run in this research on 2026-11-17, in a Linux cloud session, with Bun 1.4.4 and the repository's Playwright Chromium. The reference sites were live that day. Kuiper is the site in `build/`, served by `scripts/bench/serve.ts`. Its footer reads commit `b01e754`, built 2026-11-16.
- **READ:** a page or file says so. The read date is 2026-11-17.
- **INFERRED:** our reasoning.
- **What is already known is not repeated.** The 2026-11-15 memos covered structure, depth, wayfinding, search and the first example's position: `design-sites-product`, `-developer` and the prior-art memos for Primer, GOV.UK, Polaris and Radix. This memo looks only at finish.
- **Shots** are in [`2026-11-17-visual-product/`](./2026-11-17-visual-product/). There are 20. `k` files are Kuiper and `r` files are references. Every Kuiper `k` shot is at 1440 × 900 unless its name says 390. `k01`, `k06`, `k07`, `k08`, `k12` and `k13` are 2× detail crops.
- **Polaris was not reached.** `polaris.shopify.com` answers with a 301 to `shopify.dev`, and that host is blocked from this session (EXECUTED, `curl`). Polaris is scored `?` throughout. Under the scorecard's rule, a criterion we could not check counts as absent (scorecard §1).
- **Articles.** WebFetch could not resolve `linear.app`, `medium.com` or `atlassian.design`. The shell could reach `atlassian.design` and the GOV.UK site, so those pages were read with `curl`. Linear's and Polaris's practice is known only from search-result summaries, and is labelled so.

**Terms.**

- **Restraint:** few colours, one type family, flat chrome, and nothing decorative on working pages.
- **Near-miss edge:** two left edges, each shared by at least three text blocks, that sit 1 to 6 px apart. It reads as a mistake, not as a choice.
- **Fit defect:** text that does not fit its box. Examples are a short label wrapped onto two lines, a token without spaces broken across lines, a clipped cell, or a table that scrolls sideways at desktop width.
- **Vertical rhythm:** line heights and gaps that are all multiples of one base unit, so that lines of text across a page share a grid.
- **Chrome:** the site's own frame around the content: the bar, the navigation, the frame around an example.
- **Specimen:** a live rendering of a component on its page.
- **Brand moment:** a place where the brand speaks loudly, in colour, illustration or display type.
- **Optical alignment:** placing a shape where it looks aligned, not where its box says, such as pulling a ghost button's icon out to the text edge.

## 1. What the five do, as visual products

The pages compared, at 1440 × 900 (EXECUTED, `r16`–`r20`), are the home page, the components index, Button, the overlay (Dialog, Modal dialog or Error summary) and the typography page. Radix has no components index, so its Getting started page stands in for one.

### 1.1 One frame, one left edge

- **The bar is flat, full width, 48–64 px tall and ruled by a hairline** on Primer, Atlassian, GOV.UK and Radix (`r16`). It has no shadow, no inset and no rounded panel. It is a ruler, not an object.
- **The navigation sits in its own column.** Primer, Atlassian and Radix pin it to the viewport's left edge, 240–300 px wide, behind a hairline. GOV.UK centres one 1,020 px container. Its crown, its top links, its side navigation and its content all start on one x (READ, GOV.UK's Layout page, which sets 1,020 px as the default width; EXECUTED, `r16`).
- **Kuiper's left column has four edges within 22 px** (EXECUTED, `k05`):
  - the bar's panel at x = 136;
  - the "Filter components" label at 140;
  - the navigation's items at 148;
  - the lockup at 158.

  The current page's bar sits at 136. Each choice is defensible on its own. Together they read as drift.

### 1.2 Everything on a grid, said out loud

- **GOV.UK states its rhythm.** Every point on its type scale uses a line height in a multiple of 5 px, like its spacing scale. It says this "creates a consistent vertical rhythm" (READ, GOV.UK's Type scale page). Its spacing scale is also built on 5 px (READ, its Spacing page).
- **Primer states it too.** Its typography page says each style's line height aligns to the 4 px grid (READ, shot `r20`).
- **The probe measured it** (§2.4). Weighted by characters, 100% of Atlassian's text and 98% of GOV.UK's has a line height on its base unit. Primer and Radix are near 60%. Kuiper is at 16%.
- **How Atlassian got there** (READ, "Implementing typography at scale", atlassian.design, 2025-04-10):
  - It first tokenised the old type with "no visual changes", so the framework could be tested before the look changed.
  - It then moved to one scale built on the minor third. That step, it says, removed a lot of visual inconsistencies.
  - It made headings bolder, raised the smallest size from 11 to 12 px and removed all capitals.
  - It replaced system fonts with its own. The reason was alignment: SF Pro sits higher on the baseline than Segoe UI, so spacing set around an icon and its text rendered differently on Mac and Windows.
  - It also dropped one text style, because makers kept confusing it with another. Its lesson: "When in doubt, take it out."

### 1.3 Type does the hierarchy, and only the type

- **One family per site.** Primer uses Mona Sans, Atlassian uses Atlassian Sans, GOV.UK uses GDS Transport and Radix uses Untitled Sans, each with its own mono for code (EXECUTED, the probe's dominant styles).
- **Leaf titles are modest:** 35–48 px, 2.2 to 3.0 times the body text. Body text is 14–19 px.
- **Kuiper's leaf title is 56 px,** 3.5 times its body. It is 86.4 px on a Brand leaf, 86.4 px on a landing and 160 px on the home page. On Button, 13.5 px text holds about 70% of the characters that are not code: the navigation, the rail, the frame captions, the tables and the index descriptions (EXECUTED). The page reads as a poster over small print.

### 1.4 Small details, finished the same way everywhere

- **Focus.** Atlassian draws one ring at every stop: 2 px, blue, offset 2 px, with corners that follow the element. Radix's ring follows its pill-shaped navigation items. GOV.UK uses its yellow everywhere, in three designed forms, one per kind of element (EXECUTED, 40 Tab stops on each Button page; `r19`).
- **Kuiper's focus.** It draws a 3 px square outline on navigation links and a rounded double ring on the search field. These are two treatments in one system (EXECUTED, `r19`, `k11`).
- **Tables are hairlines and tinted mono** on Radix and Primer. No cell holds a bordered chip, and long type unions stay on one line or scroll (EXECUTED; the Radix props table in `r16`).
- **Kuiper's tables.** Every code value gets its own white, bordered pill. A type union breaks into one pill per line (`k12`).
- **Code** scrolls rather than wraps at desktop width on all four sites. A cut-off panel shows a toggle ("Show full code" on Primer). Kuiper's first example cuts its code panel through a line of text, with no fade and no control (`k13`).
- **Icons** keep one size per context. Atlassian uses 12, 16 and 24 px in different places, each always the same where it appears (EXECUTED). Kuiper uses 16 px everywhere, which is good (§2.6).

### 1.5 The specimen comes first and its frame says almost nothing

- **Primer** draws a 1 px box with the specimen centred and nothing else in it. The code opens below it (`r16`).
- **Radix** joins preview and code in one card. The specimen sits within about 10 px of the card's top.
- **Atlassian** puts a quiet patterned ground under the specimen. A slim toolbar sits between it and the code: Styles, Copy code, Edit in sandbox.
- **GOV.UK** puts one link above its frame ("Open this example in a new tab") and two tabs below it.
- **Their example scenes are real.** GOV.UK's button says "Save and continue".
- **Kuiper's frame** holds a title, a paragraph and a Light/Dark switch before the stage. The first specimen pixel is 184 px below the frame's top. The specimen is a grid of "Save changes" (`k05`).

### 1.6 One brand moment, placed once

- **GOV.UK's moment** is its blue header with the crown. It is the same colour in the same place on every page. Its leaf pages are otherwise black, white and link blue.
- **Primer's moment** is one gradient illustration, on the home page. Its documentation is monochrome with blue links (`r17`).
- **Atlassian** puts a playful headline with live cursors on its home page, and a spot illustration on each landing.
- **Radix** fills its home page with live components over a soft gradient. Its documentation is grey.
- **By measure** (EXECUTED; the share of first-screen pixels with saturation above 0.45, and the hue families holding at least 0.4% of the screen):
  - The references' leaf pages are 0–5.6% chromatic, with at most two hue families. The colour comes from the specimens and from GOV.UK's header.
  - Kuiper's Components landing is 30% red.
  - Its home page shows four hue families.
  - Its bar carries four coloured dots on every page, and each breadcrumb starts with a door's dot.
- **Kuiper has four moments, not one.** They sit on every page and change with the section (INFERRED).

### 1.7 How large organisations keep the finish

- **A standing habit, not a project.** Linear's "Quality Wednesdays" fixes small imperfections each week. Most fixes take under 30 minutes and none takes more than about an hour. More than 1,000 have been done, tracked under a "quality" label. The claimed gain is that the team learns to see the defects before they ship (READ, a search-result summary of `linear.app/now/quality-wednesdays`; the page itself was not reachable from this session).
- **A gate that checks use of the system.** GOV.UK's service assessments ask whether a service uses the Design System's components and styles. A 2024 panel marked one service amber for components it could not justify (READ, search-result summaries of `gov.uk/service-manual/design/making-your-service-look-like-govuk` and a 2024 assessment report).
- **A manual check of every change in its rendered page.** Polaris calls this "tophatting": changes to a component's README are checked as they appear in the style guide (READ, a search-result summary of the Polaris repository).
- **Tokens before looks.** Atlassian tokenised first, then changed the visuals in steps, each a theme switch (READ, §1.2).
- **No published, cross-company "craft score" exists.** The rubrics found are practitioners' own (READ, a web search, 2026-11-17). So the criteria below are our own, built to be reproducible.

## 2. The probe: what separates the polished from the plain

One in-page script was run on the same page types on each site, at 1440 and at 390 (EXECUTED). It is our own code, kept in the session scratchpad, not in the repository. Its rules are in the appendix at the end of §4, so a builder can rewrite it in `scripts/bench/`.

The pages:

- **Kuiper:** `/components/`, Button, Dialog and Foundations › Type. Foundations › Colour and Brand › Colour were also probed.
- **Primer:** Components, Button, Dialog and Typography.
- **Atlassian:** Components, Button, Modal dialog and Typography.
- **GOV.UK:** Components, Button, Error summary and Type scale.
- **Radix:** Getting started, Button, Dialog and Typography.

### 2.1 Fit (EXECUTED)

Fit defects are summed over the four pages, with one list of defect strings per page.

| | At 1440 | At 390 | Where Kuiper's are |
|---|---|---|---|
| Kuiper | **23** | 4 | the install command broken mid-word (1 a page); Type: 20 (tokens such as `--font-sans` and `font-heading-ibm-plex-sans` broken across lines, plus three tables that scroll sideways) |
| Primer | 1 | 4 | Dialog's props table scrolls sideways |
| Atlassian | 0 | 31 | at 390 only: code tokens broken mid-word on Modal dialog, and wrapped table headings on Typography |
| GOV.UK | 0 | 9 | at 390 only: class names in the type-scale table |
| Radix | 0 | 4 | at 390 only |

Kuiper fits better on a phone than on a desktop. Below `md`, its tables become stacked cards. At 1440 they are squeezed into a column about 608 px wide, while about 440 px to its right stays empty (EXECUTED; `k06`, `k07`). Foundations › Colour has 20 broken tokens and 4 sideways-scrolling tables of its own.

### 2.2 Template consistency (EXECUTED)

This compares where and how big the page title is across leaf pages: two component pages, one Foundations leaf and one Brand leaf.

| | H1 sizes on leaves | H1 tops on leaves |
|---|---|---|
| Kuiper | 56 and 86.4 (Brand › Colour) | 132 (components) and 168 (Foundations, Brand) |
| Primer | 40 | 161 |
| Atlassian | 40 and 48 | 171, 216 and 223 |
| GOV.UK | 48 | 191 |
| Radix | 35 | 128 |

### 2.3 Alignment (EXECUTED)

| | Near-miss edges, 4 pages | Card rows whose titles do not share a line |
|---|---|---|
| Kuiper | 9 (Button 2, Dialog 6, Type 1) | **25 of 28** (up to 22 px apart) |
| Primer | 0 | 1 of 21 |
| Atlassian | 4 | 0 of 30 |
| GOV.UK | 3 | none checked |
| Radix | 1 | none checked |

Kuiper's near-misses come from three causes (EXECUTED, the probe's edge lists):

- the "Copy page" icon at x = 405, against the title at 392 (`k05`);
- table text at 646, 647, 649, 655 and 659, because a code pill's padding moves its text off the column's edge;
- the frame's title against its content.

The card rows drift because each card's text block stretches to the row's height, and its rows share out the spare space (INFERRED, from `src/routes/(site)/components/+page.svelte`, the tile's `grid` and `md:h-full`; `k04`).

### 2.4 Vertical rhythm (EXECUTED)

This is the share of characters whose line height is a multiple of the system's base unit. The base is 5 px for GOV.UK and 4 px for the rest, each by its own documentation or spacing scale. The table gives the median over all pages probed at 1440.

| Kuiper | Primer | Atlassian | GOV.UK | Radix |
|---|---|---|---|---|
| **0.16** | 0.63 | 1.00 | 0.98 | 0.57 |

Kuiper's line heights are unitless multipliers, such as 13.5 × 1.6 = 21.6 and 16 × 1.6 = 25.6. So almost no line lands on the grid. Body text also runs at two line heights on one page, 24 and 25.6 (EXECUTED).

### 2.5 One brand moment (EXECUTED; §1.6)

| | Chromatic share of the first screen | Hue families |
|---|---|---|
| Kuiper | home 8.5%, Components 30.1%, Button 1.9% | home 4 |
| Primer | home 5.9%, leaves 0–0.1% | home 3 (one illustration) |
| Atlassian | 0–2.3% | up to 3 (spot illustrations) |
| GOV.UK | home 49.9%, leaves 5.2–5.6% | 1, the header blue, on every page |
| Radix | 0–1.9% | up to 2 |

### 2.6 Signals that do not separate (EXECUTED)

| Signal | Kuiper | References | Verdict |
|---|---|---|---|
| Spacing values on a 4 px scale | 85–100% | Primer 88–100%, Atlassian 68–96%, Radix 73–96% (GOV.UK 68–98% on 5 px) | Kuiper is as good as the references. Not a criterion. |
| Text styles covering 95% of characters | 3–11 | 1–11 | No pattern. Not a criterion. |
| Icon sizes in controls | one, 16 px | 2–5, one per context | Kuiper is stricter. Not a criterion. |
| Corner radii in use | 1–2 | 0–9 | No pattern. |

So Kuiper's tokens are not the problem. Its spacing is on the scale, and its icon sizes and radius are disciplined. **The defects are in how pages use the tokens:** columns too narrow for their content, text blocks that stretch, line heights set as multipliers, and templates that drift apart (INFERRED).

## 3. The craft audit of Kuiper

Severity is how a senior visual designer would rank it.

- **S1, critical:** wrong on every page, or breaks trust in the system at a glance.
- **S2, high:** seen on a main page in the first seconds. The site looks unfinished.
- **S3, medium:** seen on a second look. An inconsistency.
- **S4, low:** a nit.

All findings are EXECUTED, by shot or probe, unless marked. "Known" marks the four examples the owner's brief gave.

### S1, critical (2)

1. **The lockup in the bar says "pluto" on every page of a site named Kuiper.** It says so in the footer too (`k01`, `k14`; known). The page title is "Kuiper Design System". The company keeps its name, but the site's mark names a different thing from the site.
2. **Foundations tables do not fit at desktop width** (`k06`, `k07`):
   - Type's "Leading" header is clipped to "Leadi".
   - Colour's dark contrast figures are cut at the table's edge: "16.16:1" shows as "16.1".
   - Tokens break mid-word, one bordered pill per fragment ("card-" / "foreground").
   - "Its job" sets one or two words per line.
   - A ratio and its word run together ("16.84:1on").
   - The Type page shows 20 fit defects and the Colour page 24.

   These are the pages that should prove the system's precision.

### S2, high (8)

3. **"Ctrl K" wraps onto two lines inside the search button** (`k01`; known). The key hint is 32 × 36 px, flush against the button's right border, in a 128 px slot. Mac readers see "⌘K", which fits, so the defect shows only on Windows and Linux (READ, `src/lib/site/chrome/search.svelte`, lines 18 and 55).
4. **The home page leads with a raw command and four coloured discs** (`k02`; known). The command breaks mid-word ("shadcn-" / "svelte"). No component is shown anywhere on the page. The discs, each 190 px, carry the section names.
5. **The Components navigation and index list ten items that are not components** (`k03`; known): Utils, Read token, Theme, Is mobile, Use highlighted code, Code languages and Highlighter, and the three font items. "Kuiper theme" sits first among them.
6. **Index card titles do not share a line** in 25 of 28 rows, up to 22 px apart (`k04`). The thumbnails are crops, not compositions. Button's cuts its red row in half, and Liquid glass's cuts its text mid-line.
7. **Text collides on Brand › Colour.** The word "Yellow" runs under its own specification card (`k08`).
8. **The example frame puts 184 px of chrome above the specimen** (`k05`): a title, a paragraph and a Light/Dark switch. The stage then shows a grid of "Save changes". Dialog's stage holds two outline buttons in an empty band.
9. **The first example's code panel is cut through a line of text,** with no fade, no "show more" and no visible scrollbar (`k13`).
10. **Stale name in the specimens.** Foundations › Type's display steps use "Pluto" as the sample word. The page says "pluto" 6 times and "Kuiper" 0 times.

### S3, medium (11)

11. **Templates drift.** The leaf title starts at y = 132 on component pages and at y = 168 on Foundations and Brand leaves. A Brand leaf sets it at 86.4 px, a Foundations leaf at 56 px (§2.2).
12. **Near-miss edges** (§2.3; `k05`):
    - "Copy page" is inset 13 px from the title's edge, because the ghost button's padding is not pulled out;
    - the left column has three edges within 12 px;
    - API table text moves with each pill's padding.
13. **Inline code is a pill everywhere,** each with its own white ground and border. A type union becomes a stack of pills (`k12`). The eye reads chips, not values.
14. **No vertical rhythm.** 84% of text sits off the 4 px grid, and body text runs at two line heights (§2.4).
15. **Small text carries the page.** 13.5 px holds about 70% of the non-code text on Button (§1.3). The H1 is 3.5 times the body.
16. **The bar is the loudest object on the page:**
    - a floating panel with an inset highlight and a 32 px shadow (READ, `2026-11-15-design-sites-developer.md` §3; EXECUTED, `k01`);
    - content shows through it as the page scrolls (`k12`'s source page);
    - its four dots repeat the four colours on every screen.
17. **Four brand moments, not one.** There are four dots in the bar, a dot on every breadcrumb, a section-coloured field on each landing (30% of the first screen), and four discs on the home page (§2.5). None is placed once.
18. **Dark mode turns the brand pastel** (`k09`). Blue becomes #93B0FF, red #FF9491, yellow #F8D874 and green #60C498. The Components field reads salmon and the discs read as sweets. The hierarchy holds, and the frames follow the scheme. This is the owner's dark palette ruling, so it is a question, not a fix (INFERRED).
19. **Two focus treatments:** a 3 px square outline on links, and a rounded double ring on the search field (`r19`, `k11`).
20. **The Brand landing shows no brand** (`k15`). A yellow band is half empty to the right, and below it is a ruled list of text links. There is no picture of the mark, the colours or the type, in the section that owns them.
21. **The footer is unfinished** (`k14`):
    - its column labels are in lowercase mono, against sentence case everywhere else;
    - a "components" column holds one link;
    - the commit and build lines are set like debug output;
    - a "pluto" lockup sits over "Work runs on data."

### S4, low (7)

22. **Search results** start their description with the group name as a sentence ("Navigation. A modal window…"). A token, "--scrim", sits as a result title among components. The palette's top edge overlaps the bar (`k11`).
23. **The phone bar has two icon-button treatments.** Search is a bordered square, while theme and menu are bare icons (`k10`).
24. **The phone menu's close button** sits about 13 px above the first row's line. Door names and group names share one style (`k10`).
25. **Brand › The mark's two figures** set their dimension labels at about 28 px in the first and about 14 px in the second.
26. **Foundations › Type's tracking table** lists four utilities that all read "0 em". It is a table that says nothing.
27. **Foundations › Type's display-step figure** floats its blue squares and labels on no column of the table above it.
28. **Index pictures are blank until scrolled into view** (lazy loading). A fast scroll, a print or a full-page capture shows empty boxes. This is how the defect was found. EXECUTED: they do load on a real scroll.

**Counts:** S1 2, S2 8, S3 11, S4 7; 28 in all.

**Kept as strengths** (EXECUTED):

- one icon size;
- spacing on the 4 px scale;
- the Brand › The mark figures drawn to measure;
- the Brand › Colour bands;
- the search palette's groups, highlighted matches and key legend;
- the per-example Light/Dark switch;
- the do and don't rule lines on Button, which are restrained and good.

## 4. First moves (INFERRED)

Ranked by visible effect over cost.

1. **Fix the critical and high defects,** items 1 to 10, as small changes. Each touches one page or one site component, and none adds a token or changes an interface.
   - Items 1 and 10 need the owner. The site's lockup is the company's mark, so the question is whether it should read Kuiper. It is asked in the brief's terms, not decided here.
   - Item 5 is a sitemap change. The ten items move to a "Utilities" door or an "Internals" group at the end of the list.
2. **Give the content one width and one left edge.** Foundations and Brand leaves should use the column the component pages use. Tables should get the full content width at desktop.
3. **Put line heights on the grid.** Set each `text-*` step's line height as a multiple of 4 px, not as a multiplier. This is a token change every app receives, so it needs its own specification.
4. **Pick one brand moment.** Keep the four colours for the home page and the Brand section. Make the bar's dots and the breadcrumb dots neutral. This would reverse part of `015` decision 5, so it goes to the owner first.
5. **Adopt a weekly quality habit.** Run the fixed checklist (criterion V5) at every landing, as `release-check` already runs its gates. File what it finds under one label, in the Linear manner (§1.7).

### Appendix: the scripted checks' rules

- **Visible:** box at least 3 × 3 px, `visibility: visible`, not `display: none`, opacity above 0, not inside `aria-hidden`.
- **Lines of a text:** the client rectangles of its text nodes, grouped where they overlap vertically.
- **Short label wrapped:** an `a`, `button`, `kbd`, `th`, `label`, `summary`, tab, `dt`, `figcaption`, navigation item or first table cell. It has at most 28 characters and three words, holds no block child, sits outside `pre`, and is not a link inside running prose. It is wrapped when it sets on more than one line.
- **Token broken:** a leaf `code`, `kbd`, `samp`, `td`, `th`, `span` or `a`. Its text has no space and at least 3 characters, and it sets on more than one line. It is counted when it is in a table, the navigation or a control, or outside prose. A break inside `pre` is counted apart.
- **Clipped:** an element with `overflow-x: hidden` or `clip`, its `scrollWidth` more than its `clientWidth` + 2, with text, and without `text-overflow: ellipsis`. A table inside a container that scrolls sideways is also counted.
- **Near-miss edge:** the left x of each text block's first line in `<main>`, excluding centred and right-aligned text. Edges with three or more blocks are kept, and pairs 1 to 6 px apart are counted.
- **Card row:** children of a grid or row flex container, at least two of them and equal in width to within 4 px. Children whose tops agree to within 4 px form a row. The row's headings (`h2`–`h5` or a title element) must have tops within 2 px. Kuiper's tiles were checked by their title `span`.
- **Rhythm:** characters weighted by the computed line height of their element. A line height is on the grid when it is within 2% of a multiple of the base unit.
- **Chroma:** the first screen resized to 360 × 225 px. A pixel counts when its saturation is above 0.45 and its value above 0.35. Hues fall into 12 bins, and a bin counts as a family at 0.4% of pixels.

## Sources

Live sites, captured and probed on 2026-11-17 (EXECUTED):

- Primer: [primer.style](https://primer.style/), [components](https://primer.style/product/components/), [Button](https://primer.style/product/components/button/), [Dialog](https://primer.style/product/components/dialog/), [Typography](https://primer.style/foundations/typography/).
- Atlassian: [atlassian.design](https://atlassian.design/), [components](https://atlassian.design/components), [Button](https://atlassian.design/components/button), [Modal dialog](https://atlassian.design/components/modal-dialog), [Typography](https://atlassian.design/foundations/typography).
- GOV.UK: [the Design System](https://design-system.service.gov.uk/), [components](https://design-system.service.gov.uk/components/), [Button](https://design-system.service.gov.uk/components/button/), [Error summary](https://design-system.service.gov.uk/components/error-summary/), [Type scale](https://design-system.service.gov.uk/styles/type-scale/).
- Radix: [radix-ui.com](https://www.radix-ui.com/), [Themes](https://www.radix-ui.com/themes), [Getting started](https://www.radix-ui.com/themes/docs/overview/getting-started), [Button](https://www.radix-ui.com/themes/docs/components/button), [Dialog](https://www.radix-ui.com/themes/docs/components/dialog), [Typography](https://www.radix-ui.com/themes/docs/theme/typography).
- Polaris: [polaris.shopify.com](https://polaris.shopify.com/) redirects to shopify.dev, which is blocked here.

Read on 2026-11-17:

- Atlassian, [Implementing typography at scale](https://atlassian.design/whats-new/implementing-typography-at-scale) (2025-04-10).
- GOV.UK, [Type scale](https://design-system.service.gov.uk/styles/type-scale/), [Spacing](https://design-system.service.gov.uk/styles/spacing/), [Layout](https://design-system.service.gov.uk/styles/layout/).
- Search-result summaries only:
  - Linear, [Quality Wednesdays](https://linear.app/now/quality-wednesdays);
  - GOV.UK, [Making your service look like GOV.UK](https://www.gov.uk/service-manual/design/making-your-service-look-like-govuk) and a [2024 beta assessment](https://www.gov.uk/service-standard-reports/standards-and-testing-agency-sta-service-beta-assessment);
  - Shopify, [App design guidelines](https://shopify.dev/docs/apps/design);
  - a general search for design-quality scoring, which found no published cross-company standard.

Local:

- `build/`, served by `scripts/bench/serve.ts`;
- `src/lib/site/chrome/search.svelte`, `src/lib/site/chrome/bar.svelte`, `src/routes/(site)/components/+page.svelte`;
- the scorecard and the 2026-11-15 memos named under "How to read this memo".

## Proposed scorecard criteria

Each criterion scores 0 to 4. "Scripted" means a script prints a number and the anchors turn it into a score. "Judged" means a scorer reads the written anchors against the named pages; two scorers should land on the same step. A `?` means not checked, and it counts as absent.

**The page set** is the same on every site: the components index (or nearest), Button, the overlay, and the typography foundation page. V2 adds one Brand or other leaf. Viewports are 1440 × 900 and 390 × 844, light scheme. V9 uses the dark scheme.

| # | Criterion | Kind | How to measure | Anchors 0–4 | Primer | Atlassian | Polaris | GOV.UK | Radix | **Kuiper** |
|---|---|---|---|---|---|---|---|---|---|---|
| V1 | **Fit:** text fits its box | Scripted | Fit defects (§4 appendix) summed over the page set: D at 1440, P at 390 | 4: D = 0 and P ≤ 10. 3: D ≤ 2 and P ≤ 25. 2: D ≤ 5. 1: D ≤ 15. 0: D > 15 | 3 (D 1, P 4) | 2 (D 0, P 31) | ? | 4 (D 0, P 9) | 4 (D 0, P 4) | **0** (D 23, P 4) |
| V2 | **Template consistency:** the same kind of page puts its title in the same place at the same size | Scripted | On four leaves at 1440: (distinct H1 sizes − 1) + (distinct H1 tops, to 4 px, − 1) | 4: 0. 3: 1. 2: 2. 1: 3–4. 0: 5 or more | 4 | 1 | ? | 4 | 4 | **2** |
| V3 | **Alignment:** no near-misses | Scripted | Near-miss edges on the page set at 1440, plus card rows whose titles do not share a line | 4: 0. 3: 1–2. 2: 3–5. 1: 6–10. 0: over 10 | 3 (1) | 2 (4) | ? | 2 (3) | 3 (1) | **0** (34) |
| V4 | **Vertical rhythm:** line heights on the system's own base unit | Scripted | Median, over the page set at 1440, of the share of characters whose line height is a multiple of the base (the system's documented spacing unit) | 4: ≥ 0.90. 3: ≥ 0.70. 2: ≥ 0.50. 1: ≥ 0.30. 0: below | 2 (0.63) | 4 (1.00) | ? | 4 (0.98) | 2 (0.57) | **0** (0.16) |
| V5 | **Finish checklist:** small details done once and the same way | Scripted checklist, two items by eye | Ten items, each pass or fail: (1) one focus treatment across links, buttons and fields; (2) the ring clears the content and follows the target's shape; (3) key hints on one line; (4) code never breaks a token, and a cut panel shows that it continues; (5) inline code in tables never breaks across lines; (6) no text overlaps another element; (7) cards in a row share their title line; (8) the lockup and the samples use the product's current name; (9) the reader's navigation lists only reader-facing pages; (10) one icon size per context | 4: 10. 3: 8–9. 2: 6–7. 1: 3–5. 0: 0–2 | 3 (8; item 1 ?, 7 fails) | 3 (9; 4 fails at 390) | ? | 3 (9; 5 fails at 390) | 3 (9; 5 fails at 390) | **0** (2: items 2 and 10 pass) |
| V6 | **Specimen framing** | Judged, with a scripted aid: px from the frame's top to the first specimen pixel on Button | 4: preview first, within 48 px of the frame's top; preview and code in one container; real scenes or one variant per frame; index pictures composed, nothing cut. 3: one lapse. 2: chrome over 96 px above the preview, or same-label grids, or cut index pictures. 1: frames differ across pages, or specimens float unframed. 0: no live specimen | 4 | 4 | ? | 3 (link bar above the frame) | 4 | **2** (184 px; "Save changes" grids; cut thumbnails) |
| V7 | **One brand moment** | Judged, with a scripted aid: the chromatic share and hue families of leaf and landing first screens | 4: one moment, in one place (home or one band), repeated identically if at all; leaf chrome neutral, colour from specimens. 3: one moment, and small brand marks repeat in the chrome. 2: brand colour changes by section, or several moments on a page. 1: brand colour competes with content on leaf pages. 0: no identifiable moment, or colour on every surface | 4 | 3 | ? | 4 | 4 | **2** |
| V8 | **Type hierarchy** | Judged, with three scripted lapses | Lapses: (a) the leaf H1 is outside 2–3 times the body size; (b) more than one H1 size across leaves; (c) text under 14 px holds more than a third of the non-code characters on Button | 4: no lapse. 3: one. 2: two. 1: three. 0: no visible hierarchy | 4 | 3 (b) | ? | 4 | 4 | **1** (a, b, c) |
| V9 | **Dark parity** | Judged | The dark scheme on Home and Button. 4: every page has one; hierarchy holds; brand colours stay recognisably themselves; specimens follow the scheme or show both. 3: one lapse (a bright slab in a dark page, or brand hues that change character). 2: two lapses. 1: dark on some pages only. 0: no dark scheme | ? (dark only by its toggle; not scored this run) | 3 (light specimen slab) | ? | 0 | 4 | **3** (pastel brand) |
| | **Total, of 36** | | | | 27 + ? | 25 | ? | 28 | 32 | **10** |

**Scorer's notes.**

- V1 to V4 should become one script in `scripts/bench/`, named `craft.ts` for example. Its rules are in the §4 appendix. It runs against the built site and the live references, as `site.ts` does.
- V5's items 1, 2 and 10 read computed styles at each Tab stop, as this run did. Item 6 needs an overlap test: the text boxes against the painted boxes of their sibling elements. Items 8 and 9 are text checks against the sitemap and the product's name. The references' marks on items 1 and 2 were partly by eye in this run.
- V6 to V9 keep a pair of shots per site in the run log, so the next scorer sees what was judged.
- Rejected after measurement (§2.6): spacing values on a 4 px scale, the count of text styles, icon sizes and corner radii. None separates the polished sites from Kuiper.
