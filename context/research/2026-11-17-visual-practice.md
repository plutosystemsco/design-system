# How large teams get to visual polish, and what one owner and a few agents can copy

- **Status:** complete
- **Date:** 2026-11-17
- **Author:** a researcher, one of five on the visual-identity run. The owner looked at carbondesignsystem.com, said it is "miles ahead of us in design", and asked why we are not making progress.
- **Question:** Who does the visual work in large design-system teams? What process produces their polish? What do they measure? Which of those practices can a team of one owner and AI agents copy, and where must a human judge?
- **What would answer it:** the teams' own posts, pages and talks (IBM, Google, Adobe, Microsoft, GitHub, Atlassian, Shopify, GDS, Salesforce), the EightShapes writing, the zeroheight and Sparkbox surveys, and a few small teams known for craft; then our own pipeline, read against them.
- **Builds on:** [`2026-11-15-design-sites-enterprise.md`](./2026-11-15-design-sites-enterprise.md) (what the sites look like) and [`2026-11-15-site-polish-synthesis.md`](./2026-11-15-site-polish-synthesis.md) (what `018` took from it). This memo asks how those looks were made, not what they are.
- **What it blocks:** nothing. It proposes scorecard rows and pipeline gates (§6) for the owner to accept or refuse.

## In short

- **The look has an owner.** At every large system, someone whose job is the visual identity owns the site's look. That is a brand team, a design language team, a principal designer or a design lead for the site. The component engineers do not own it. Carbon draws its look from the IBM Design Language and the Brand Center. Material.io had its own design lead and commissioned illustration. GitHub keeps a separate brand system for its marketing pages. Kuiper has no such role. Our four roles (constitution §5) judge correctness, not look.
- **Polish comes from critique on a fixed rhythm.** Atlassian teams spar weekly. IBM runs playbacks. GOV.UK runs two-week panel reviews against written criteria. Stripe's critiques name concrete fixes, once seventeen of them for one piece of work. None of these is a test. Each is people looking at the work together, on a schedule, against a bar.
- **Screenshot baselines guard polish. They do not create it.** Carbon, GOV.UK Frontend and Primer all keep visual-regression snapshots. A human approves each diff, and at GOV.UK it is the reviewer, not the author. Kuiper has no screenshot baseline at all (EXECUTED, §5).
- **Polish needs a standing budget.** Linear spends part of every week on small fixes that are "not bugs per se", and counts them: more than 1,000 in two years. Large teams redesign every three to seven years in a funded programme. Between redesigns, polish comes from many small fixes.
- **What they measure is human judgement, made repeatable.** Google ran 46 studies with over 18,000 people for Material 3 Expressive: eye tracking, preference and sentiment words. Nobody publishes a scripted "visual quality score". A first-glance rating is a fair instrument: people judge a page's visual appeal in 50 ms, and those ratings agree with longer looks (Lindgaard, 2006).
- **Why we stalled (INFERRED).** The pipeline turns every goal into checkable criteria. The scorecard measures fifteen things, and none of them is how the site looks. So no specification was ever ranked for look, and no review could fail one.
- **Proposed, in order:** a designer-agent role with a written visual bar; a visual review gate with before-and-after screenshots; side-by-side critique against reference shots; a screenshot-diff baseline in CI; the owner's taste check at fixed points; a polish budget each release; five new scorecard rows (§6).

## How to read this memo

Every claim carries a label.

- **READ:** a source says so. **This run could fetch no web page.** WebFetch could not resolve any outside host. The hosts that failed were carbondesignsystem.com, design-system.service.gov.uk and team-playbook.design-system.service.gov.uk. The proxy also refused www.ibm.com. GitHub clones were refused too. Every READ claim from the web comes from the excerpt a search engine returned for the cited page. Excerpts can be stale or cut short, so each source carries a weight (§7). To check a claim against the full page, allow those hosts and re-run the fetch.
- **EXECUTED:** run in this repository on 2026-11-17.
- **INFERRED:** our reasoning.

**Terms.**

- **Design crit** (critique): a session where designers show work in progress and others give structured feedback. Atlassian calls its version *sparring*. IBM's nearest ritual is a *playback*, where stakeholders see the work and give feedback.
- **Design QA:** a check that what was built matches what was designed, done by a designer on the real build, before release.
- **Sign-off:** a named person's written approval, without which a change does not ship.
- **Visual-regression test (VRT):** a test that takes a screenshot and compares it with an approved one, the *baseline*. A difference above a threshold fails, until someone approves the new picture.
- **Design technologist**, also called **design engineer** or UX engineer: a person who designs in code. Design comes first, and the prototype can become the product.
- **Visual bar:** a written standard of what "finished" looks like, with examples. It is the visual counterpart of a specification's acceptance criteria.
- **Reference board:** a fixed set of screenshots from systems we admire, used as the comparison in a critique.

## 1. Who does the work

### 1.1 Team shapes

| System | Who builds the components | Who owns the look of the site | Evidence |
|---|---|---|---|
| **Carbon (IBM)** | A core team of designers, developers, writers and product managers. Early on, about seven: four developers, two designers, a UX designer and a researcher. | The IBM Design Language, "the visual expression of IBM's brand", and the IBM Brand Center, "the foundation from which Carbon's visual identity is drawn". The Brand and Design Systems teams review pictogram contributions. | READ [S1], [S2], [S3], [S4] |
| **Material (Google)** | Google designers and developers. | Material.io's 2022 redesign had its own design lead. An agency, Oddfellows, made four illustration styles for the site. Two photographers made the abstract photography. | READ [S5], [S6] |
| **Spectrum 2 (Adobe)** | Started in late 2021 and launched in December 2023. More than a hundred Adobe employees took part. | It joined the core Spectrum language with the Adobe Express team's theme. The Brand team ran separate work, with design engineering. | READ [S7], [S8], [S9] |
| **Fluent 2 (Microsoft)** | The Fluent team. | A principal designer spent three years on the Fluent 2 website: its UX, information architecture, interaction and visual direction. The team was remote, across three time zones, and had no dedicated testers. | READ [S10], [S11] |
| **Primer (GitHub)** | The Design Infrastructure and Design Engineering teams. They started in 2016 with two people. | Product UI is Primer. Marketing pages use a separate system, Primer Brand, and a brand toolkit covering illustration, mascots, key art and shapes. Brand and marketing designers led the homepage redesign. | READ [S12], [S13], [S14], [S15] |
| **GOV.UK (GDS)** | Interaction designers, a senior content designer and frontend developers. The frontend developers build the site. | GDS refreshed the GOV.UK brand in 2025. Accessibility specialists sat in the team, brand elements were tested with users, and the brand shipped through GOV.UK Frontend 5.10.0. | READ [S16], [S17], [S18] |
| **Polaris (Shopify)** | The Polaris team. | A designer and a Polaris developer built a working prototype of the new design language, on real merchant data rather than idealised data. Shopify calls it the biggest change to the Admin's design in seven years. | READ [S19] |
| **Salesforce Lightning (SLDS 2)** | Salesforce's design system team. | A new default theme, Cosmos, sits on an architecture that keeps the visual style separate from structure. No process account was found. | READ [S20], weak |

**Surveys.** In zeroheight's 2025 report, 79% of companies had a dedicated design-system team, up from 72% [S21]. Those teams rarely pass 20 people [S21]. NN/g says 20 to 25 [S22]. The 2026 report gives a median team of four, and 61% of teams have five people or fewer. Only 23% say they have enough people [S23]. Sparkbox's surveys name the same problems every year: technical and creative debt, adoption, and design-code parity [S24].

### 1.2 Small teams known for craft

- **Linear.** The CTO asked the team to give the Wednesday meeting to quality fixes. These are small imperfections that "degrade the overall experience", "not bugs per se". The fixes carry a `quality` label. Linear counted more than 1,000 in two years [S25].
- **Vercel.** Its design engineers are "responsible for the highest level of polish". They work across the brand, marketing, product and the internal design system. They prototype in code, so the prototype can ship [S26].
- **Stripe.** "Meticulous craft" is one of Stripe's operating principles. Its head of design describes a product quality review and critiques that end in concrete fixes [S27].

### 1.3 What this says (INFERRED)

1. **The site's look and the components are two jobs.** Every large system gives the look to a brand or design-language function, or to a designer dedicated to the site. Components come from engineers working to that language.
2. **The look is a few people's job.** Many people build Carbon. Few decide how it looks, and their decisions are written down as a design language.
3. **Small teams get polish by giving it a role and a budget,** not more people. Vercel gives it a role and Linear gives it a weekly slot.
4. **Kuiper has neither.** The design lead writes specifications against checkable criteria. Builders build them. Reviewers check them against the specification. Nobody's job is to say "this looks unfinished", and no document says what finished looks like.

## 2. The process that produces polish

### 2.1 Critique on a rhythm

- **Atlassian.** "All our teams run design Sparring on a weekly basis." Sparring is "structured, regular, and inclusive". It grew from art-school crits. Designers run it, with an agenda set beforehand, and other disciplines are welcome. After it, the designer goes through each piece of feedback [S28].
- **IBM.** Playbacks bring stakeholders in "to share stories and trade feedback". They expose misalignment and track progress [S29].
- **GOV.UK.** A cross-government panel, the working group, checks that published components "are high quality and meet user needs". It reviews against written contribution criteria. A review takes two weeks, with a playback in the week after, and reviewers work from a shared spreadsheet [S30].
- **Stripe.** A critique of one piece of AI-made work produced seventeen concrete improvements. That level of detail became part of Stripe's vocabulary [S27].

INFERRED: a critique works because it is **regular**, it is **specific**, and **someone other than the maker** leads it.

### 2.2 Review gates with a written bar

- **GOV.UK:** nothing is published until it meets the contribution criteria. The criteria are public [S30].
- **IBM:** a pictogram is checked against the existing library for duplicates. Then the Brand and Design Systems teams review it [S4].
- **EightShapes (Nathan Curtis):** a defined workflow lets a team agree "the scope, reviewers, tools, and the definition of done at each step" [S31]. Curtis's component workflow has a named **Visual QA** step between handoff and the design docs. His design review step runs a plugin on emerging artwork and pastes the output into FigJam for critique [S32]. He has a whole article on component QA [S33]. Only its title was readable here.

### 2.3 Design QA and sign-off

Practitioner sources agree on the pattern [S34]. They are low weight, but they all say the same thing.

- A designer reviews the real build before every release. A screenshot is not enough. The designer checks small viewports, error and empty states, and keyboard use.
- Canonical component states are checked first, then the pages that use them.
- Findings carry a severity, and the severity decides what happens. Blockers and visible inconsistencies are fixed before release. Medium findings are fixed in the current cycle. Polish goes to the backlog.
- Skip single-pixel noise between browsers. Do not skip drift that hurts trust, accessibility or the brand.

### 2.4 Screenshot baselines

- **Carbon** ran an umbrella issue to add Percy snapshots for every component. A pull request had to show a snapshot for each component [S35].
- **GOV.UK Frontend** runs Percy on every pull request. At GOV.UK's publishing components the check does not block merging, and "it's the responsibility of the person reviewing the pull request code to approve any visual changes" [S36].
- **Primer** used its visual-regression tests to prove that its snapshots were identical when it moved from CSS-in-JS to CSS Modules [S37].
- **Cyprus's Unified Design System** blocks the merge on a visual change until someone deals with it, then updates the baseline [S35].

INFERRED: a baseline keeps a polished page polished. It cannot make a page polished, because it approves whatever was there first. It helps only after a visual review has approved the picture.

### 2.5 A brand system feeds the site

- **IBM:** the Design Language publishes pictograms (more than 500, drawn from details of IBM Plex), illustration styles (line, flat and isometric), animation and more. A pictogram is "productive" (the default) or "expressive" (used sparingly, for impact) [S4], [S38].
- **Material.io:** four commissioned illustration styles and abstract photography. The site takes its colours from that imagery, with content-based dynamic colour [S5], [S6].
- **GitHub:** a brand toolkit and a brand design system kept apart from the product system, "to allow our logged-out pages to diverge" [S14], [S15].
- **GOV.UK:** a 150-page brand guideline, shipped through the frontend package, so every service picks it up [S18].

INFERRED: hundreds of pages look consistent because the **parts of the look are a library**: pictograms, illustration, imagery and specimen styles, each with usage rules. No page is designed one at a time. Kuiper has tokens for colour and size. It has no library for the pictures.

### 2.6 Prototype on real content

- Polaris's design-language change was sold with a working prototype, because before-and-after pictures "wasn't enough to capture the feeling". It was tested on real merchant data, because "working with idealized data doesn't help" [S19].
- Vercel prototypes interactions in code [S26].
- Spectrum 2 was first previewed as a theme in Adobe Express [S8].

### 2.7 Redesign cadence

| System | Programme | Span | READ |
|---|---|---|---|
| Carbon | v11 (2022) made "no brand or visual changes". Its look has been held since v10. | — | [S39] |
| Material | M3 and the Material.io redesign (October 2022). M3 Expressive (May 2025), from research begun in 2022. | about 3 years | [S5], [S40] |
| Spectrum | Spectrum 2: late 2021 to December 2023 | about 2 years | [S7] |
| Polaris | The Admin uplift: the first change that large in seven years | — | [S19] |
| Fluent 2 | The website: three years of one principal designer's work | 3 years | [S10] |
| GOV.UK | The brand refresh, June 2025 | — | [S18] |

INFERRED: the visual language changes every three to seven years, in a funded programme. Between programmes the language is held fixed, and quality comes from review and small fixes. Kuiper has had the opposite: an identity still being settled (the `2026-11-01-*` and `2026-11-06-*` memos), with no fixed bar to review against.

### 2.8 Quality bars at the top

Google's "design excellence" and Microsoft's "craft reviews" could not be confirmed in any excerpt. Stripe's "meticulous craft" principle and its product quality review are the nearest confirmed case [S27]. Fluent's website was held to its bar by design reviews, surveys, interviews and a feedback tool built into the site [S10], [S11]. Treat the named-programme claims as unverified.

## 3. What they measure

| Measure | Who | What it tells them | READ |
|---|---|---|---|
| Studies of feeling and attention: eye tracking, preference, sentiment words ("energetic", "friendly") | Google, M3 Expressive: 46 studies, more than 18,000 people. Key elements found up to four times faster. | Whether the look works and is liked | [S40], [S41] |
| HEART: happiness, engagement, adoption, retention, task success; goals, then signals, then metrics | Google, as a framework | Turns "is this good UX?" into measured signals | [S42] |
| Coverage: the share of the product on the current system | Shopify (target: 90% of the Admin, with a dashboard) | Adoption of the language | [S19] |
| Feedback on the page; surveys; interviews | Fluent 2 site; Atlassian's "Was this page helpful?" (*enterprise*) | Satisfaction with the docs | [S10], *enterprise* |
| A count of polish fixes, by label | Linear | That the polish budget is spent | [S25] |
| A visual-debt register: issue, category (visual, structural, accessibility, documentation, implementation), severity, owner, status, trend | Practitioner guides | Whether debt grows | [S43], low |
| Adoption tracking | zeroheight 2025: "more and more companies" monitor use | Reach | [S21] |
| First-glance visual appeal | Lindgaard et al. 2006 (research, not a team): appeal rated after 50 ms agrees with ratings after a longer look | That a fast rating is a valid instrument | [S44] |

INFERRED:

- **No team found here scores visual quality by script.** They judge it, through critique, panels and studies, and then hold it with baselines.
- **What can be scripted is consistency,** not beauty: one type scale, one spacing scale, aligned edges, no overflow, the same states in every scheme. The enterprise teardown already measured some of this by hand: 13.5 px used nowhere else, a heading step missing, a 78-character median line.
- **A fast, repeated rating is good enough for taste.** Lindgaard shows that a first-glance score is stable. So a panel can rate a fixed set of shots in minutes, each release, and the trend is the measure.

## 4. Kuiper's pipeline, read against this

What the repository does today (EXECUTED and READ, 2026-11-17):

- **Roles:** owner, design lead, builder and reviewer (constitution §5). None owns the look. None is asked to judge it.
- **Reviews:** a spec review and a change review, each "given the specification and the diff" (`context/README.md`, steps 3 and 6). A reviewer can only fail what the specification asked for.
- **Screenshots:** `grep -rn toHaveScreenshot tests` finds nothing. One test takes a screenshot (`tests/e2e/bar-glass.spec.ts:550`), as a pixel probe, not a baseline. The 45 shots in `2026-11-15-design-sites/` were a one-off.
- **Scorecard:** fifteen rows. Rows 7 and 8 are about the page, but they measure position and weight, not look. Row 2 counts guidance elements. So a change that makes the site look worse moves no row.
- **Roadmap ranking** is "re-ranked from" the scorecard (`AGENTS.md`). So the look never ranks.

INFERRED: the owner's diagnosis is right, and the cause is structural. An agent pipeline optimises what it is told to check. Visual quality was never written down, so it was never checked. The large teams avoid this by giving taste to a person, a role and a ritual. That works because taste is hard to write fully as criteria.

## 5. The lesson for us

### 5.1 Roles to simulate

1. **A designer agent ("art director").** It owns the visual bar and the reference board. It runs the visual review (§5.2). It never builds what it reviews. Like Carbon's design-language team, it owns the look, not the components. It is a new role in constitution §5.
2. **A design-technologist builder.** This is a builder brief, not a new role: a builder told to prototype a template change on real pages (Polaris), at both widths and in both schemes, before it writes the specification's tests.
3. **The owner as the final eye.** It is held at three fixed points (§5.3), never at every change.

### 5.2 Reviews that must exist

**A. A written visual bar** (`context/visual-bar.md`, owned by the owner, drafted by the designer agent). It has three parts.

- *Rules that can be checked:* the type ladder and the heading steps; the spacing scale; the measure (55 to 75 characters per line); one alignment grid per template; the radii; the icon sizes; the state set (hover, focus, pressed, disabled, empty, loading, error, long text).
- *Judgement calls, each with a good and a bad example:* hierarchy (one focal point per screen), density, rhythm, how specimens are drawn, how illustration is used.
- *The reference board:* for each of our page templates, the matching page from two or three reference systems. Start from the 2026-11-15 shot set.

**B. A visual review gate.** It applies to any change that alters pixels in lanes S, I, N or T, and runs after the build, beside the change review.

- *Input:* before-and-after screenshots of a fixed set of pages (home, component index, Button, Dialog, a foundation, a guide, plus the pages the change touches). Each at 1440 × 900 and 390 × 844, light and dark, captured by a script. Also the bar, and the reference board.
- *Output:* a record in `reviews/`, named `NNN-<slug>-visual-YYYY-MM-DD.md`. Each finding carries a severity: **blocker** (fix before landing), **major** (fix in this specification), **minor** (to the polish batch) or **polish** (to the register). Each finding names a page, a place on it and a measured size, the way Stripe's critiques name concrete fixes.
- *Rule:* the reviewer has written neither the specification nor the change, as in constitution §5.

**C. Side-by-side critique.** For a template-level change, the visual review puts Kuiper's shot next to the reference board's shot of the same page type. It answers three questions in writing:

- What does the reference do that we do not?
- What do we do better?
- Which one difference matters most?

This is a desk version of Atlassian's sparring.

**D. A screenshot-diff baseline** (lane E). It uses Playwright's `toHaveScreenshot`, on the fixed page set, at both widths and in both schemes, in Chromium on Linux in CI. An unapproved diff fails the build. The **visual reviewer** approves a diff, never the builder, as at GOV.UK. Baseline images are a ledger: a landing takes the base's images and regenerates the changed ones, as `025` does for `scripts/cost/report.json`. A baseline is recorded only after a visual review has passed, so it holds approved pictures, not whatever was there first.

**E. A polish budget.** Each release carries one polish batch: a small change, or a few, that clears the minor findings from that release's visual reviews. A `visual-debt` register records the rest, with a category, a severity and a status. The scorecard reports the open count and its trend (§6). This is Linear's Wednesday, done per release.

**F. An art-direction specification for the site.** The look needs one funded programme: research, then a prototype on real pages, then the owner's reaction, then the bar. Large teams do this every few years. Kuiper has never done it as one piece of work. The other four researchers' memos are its research.

### 5.3 Where humans stay in the loop for taste

An agent judged only against a written bar reproduces the failure we have now: it passes what is written and misses what is not. So the owner judges at three fixed points.

1. **Set and amend the bar and the reference board.** The owner approves each version. Agents propose.
2. **A first-glance panel each release.** The owner sees each page in the fixed set for about five seconds, beside its reference and in random order, and rates it 1 to 5 against the anchors in §6. That is twelve shots, about five minutes. Designer agents may rate too. Their ratings are reported, but only the owner's count. Lindgaard is the evidence that so short a look is enough.
3. **Sign off identity changes.** Any change to typefaces, the palette, the grid, the illustration style or the signature device needs the owner's written yes, in the specification's landing notes.

### 5.4 Proposed amendments (proposals only; the owner decides)

- **Constitution §5, roles:** add a fifth role. "A **visual reviewer** reads a built change's screenshots fresh against the visual bar and the reference board, and records findings by severity. A blocker stops the landing." One person may still hold several roles, but never review their own work.
- **Constitution §5 and `context/README.md`, the pipeline:** "research → spec → review → tests → code → **visual review** → review". The visual review applies only to changes that alter pixels.
- **Small changes:** a small change that alters pixels attaches its before-and-after pair. It needs no separate visual review unless the change reviewer flags it.
- **`AGENTS.md`, rules:** "**A change that moves pixels carries its screenshots.** Before and after, at 1440 and 390, light and dark, from the capture script." Also: "**The visual bar is the owner's.** Agents propose amendments to it."
- **`roadmap.md` §2, lanes:** the baseline images and the capture script join lane E. The images become ledger files, regenerated at landing.
- **Scorecard:** add rows 16 to 20 (§6). Report a "Look" subtotal beside the headline total, so that the roadmap ranks look.

### 5.5 Questions for the owner

1. **Do the look rows count in the headline total?**
   - (a) Yes. The total becomes 76, and the run log keeps the old totals for comparison. *Recommended:* the ranking only changes if the total does.
   - (b) A separate "Look" subtotal, given the same weight in the roadmap's ranking.
   - (c) Outside the total, like row 15.
2. **Who holds taste?**
   - (a) The owner, at the three fixed points in §5.3, with a designer agent doing the reviews. *Recommended.*
   - (b) A human visual designer, contracted for a crit each release, with the owner signing off identity.
   - (c) A designer agent alone, with the owner reviewing every quarter.
3. **How far does the site's picture library go?** Constitution §3 forbids marketing, not pictures.
   - (a) Drawn specimens first (Foundations and the component index as pictures, as Atlassian and Material do), then a small set of SVG pictograms built from tokens. *Recommended.*
   - (b) Specimens only.
   - (c) A commissioned illustration set, as Material.io had.

## 6. Proposed scorecard criteria and process gates

The rows score Kuiper and the seven reference systems alike, as the existing rows do. The gates are pass or fail steps in our pipeline. They are not scored against the references.

| # | Criterion or gate | Scripted or judged | How to measure | 0–4 anchors |
|---|---|---|---|---|
| 16 | **First-glance appeal** (row) | Judged | The fixed set of six page types (home, component index, Button, Dialog, one foundation, one guide) at 1440 and 390, light. The owner rates each shot 1 to 5 after about five seconds, with the systems mixed in random order. Designer-agent ratings are reported, not counted. The score is the median of the twelve. | 0: median 1, unfinished (misalignments, default styles). 1: median 2, plain (consistent but generic, no identity). 2: median 3, competent (coherent, some rough details). 3: median 4, polished (deliberate hierarchy and spacing, a recognisable identity). 4: median 5, distinctive (the brand is nameable from a cropped shot, nothing to fix). |
| 17 | **Type system held** (row) | Scripted | Computed styles on the six pages. (a) Every font size is a step of the type scale. (b) Each heading level is at least one step above the next. (c) Median characters per line is 55 to 75, and the maximum is 90 or less. (d) Each heading level has one style across all templates. (e) Line heights sit on a 4 px grid. | Criteria met: 0–1 → 0; 2 → 1; 3 → 2; 4 → 3; 5 → 4. |
| 18 | **Space and alignment held** (row) | Scripted | The same pages. (a) Every margin, padding and gap is a spacing token. (b) The main column's blocks share at most 3 left edges per template. (c) Nothing overflows its container at 390 or 1440. (d) Every radius is a token. (e) Layout shift after load is 0.01 or less. | Criteria met: 0–1 → 0; 2 → 1; 3 → 2; 4 → 3; 5 → 4. |
| 19 | **Identity carried** (row) | Checklist, with evidence | (a) A brand page: logo, colour and type, with usage rules. (b) Foundations drawn as specimens, not only tables. (c) The component index as pictures. (d) A pictogram or illustration set with usage rules, used on landing pages. (e) A signature device used the same way on every template. (f) Every picture made for both schemes. | Criteria met: 0–1 → 0; 2 → 1; 3 → 2; 4–5 → 3; 6 → 4. |
| 20 | **Detail finish** (row) | Judged, timed | A 30-minute pass by one visual reviewer over the six pages. They check hover, focus, empty, long text and dark-scheme parity, at both widths. Count the defects, each one cited with a shot. | 0: 20 or more. 1: 10–19. 2: 5–9. 3: 1–4. 4: none. |
| G1 | **Visual bar** (gate) | Judged, by the owner | `context/visual-bar.md` exists: checkable rules, judgement calls with examples, a reference board for each template. It is approved by the owner and versioned. | Pass or fail. A prerequisite for G3 to G5. |
| G2 | **Screenshots attached** (gate) | Scripted | Every change that alters pixels attaches before-and-after shots of the fixed set plus the pages it touches, at 1440 and 390, light and dark, from the capture script. | Pass or fail. A missing pair fails the change review. |
| G3 | **Screenshot baseline** (gate) | Scripted | `toHaveScreenshot` on the fixed set in CI, Chromium on Linux, with a small tolerance. A diff fails until the visual reviewer approves it (never the builder). Images are ledger files, regenerated at landing. | Pass or fail. |
| G4 | **Visual review** (gate) | Judged, by a designer agent | A `reviews/NNN-<slug>-visual-YYYY-MM-DD.md` record against the bar. Findings are blocker, major, minor or polish, each with a page, a place and a size. The reviewer wrote neither the spec nor the change. | Pass when no blocker or major finding is open. |
| G5 | **Side-by-side critique** (gate, template changes) | Judged | Kuiper's shot next to the reference board's shot of the same page type. Answered in writing: what the reference does that we do not, what we do better, and the one difference that matters most. | Pass or fail: answered and cited in G4. |
| G6 | **Owner's eye** (gate) | Human | The owner's written yes on any identity change (typefaces, palette, grid, illustration, signature device), and the row 16 panel each release. | Pass or fail. A release is not ready without the panel (proposed addition to constitution §2). |
| G7 | **Polish budget** (gate, per release) | Scripted count | One polish batch lands each release. The `visual-debt` register's open count and its trend are reported with the scorecard. | Pass when the batch landed and the open count did not rise. |

## 7. Sources

Weight: **high** means the organisation's own page or post, read in a search excerpt. **Medium** means a primary source that is old, personal or partial, or a reputable secondary one. **Low** means a vendor, an aggregator or a practitioner blog. All are search excerpts (see "How to read this memo").

| | Source | Weight |
|---|---|---|
| S1 | Carbon, "Designing overview": https://www.carbondesignsystem.com/getting-started/designing/overview ; Carbon, "Content": https://www.carbondesignsystem.com/building-blocks/foundations/content | High |
| S2 | Carbon, "The Carbon ecosystem": https://carbondesignsystem.com/all-about-carbon/the-carbon-ecosystem ; Carbon v10, "The team": https://v10.carbondesignsystem.com/all-about-carbon/the-team/ | High (current) / medium (v10) |
| S3 | How Design, "Complex structures & simple compounds at IBM": https://www.howinteractivedesign.com/design-creativity/behind-the-design/ibm-design-carbon-design-system ; Responsive Web Design podcast, "IBM Carbon": https://responsivewebdesign.com/podcast/ibm-carbon/ | Medium (old, team counts differ) |
| S4 | IBM Design Language, pictograms (contribute, usage): https://www.ibm.com/design/language/iconography/pictograms/contribute , https://www.ibm.com/design/language/iconography/pictograms/usage | High |
| S5 | Material Design blog, "Magic, utility, and redesigning Material.io" (2022-10-18): https://m3.material.io/blog/material-io-redesign | High |
| S6 | Material Design blog, "The best of Material in 2022": https://m3.material.io/blog/material-design-2022-roundup | High |
| S7 | Adobe Design, "Introducing Spectrum 2": https://adobe.design/ideas/introducing-spectrum-2 (also https://medium.com/thinking-design/introducing-spectrum-2-our-vision-for-the-future-of-adobe-experience-design-a6c34441d2bb) | High |
| S8 | Adobe blog, "Adobe unveils Spectrum 2": https://blog.adobe.com/en/publish/2023/12/12/adobe-unveils-spectrum-2-design-system-reimagining-user-experience-over-100-adobe-applications ; Forbes: https://www.forbes.com/sites/stevenaquino/2023/12/12/adobe-announces-next-generation-spectrum-design-system-built-for-the-future-with-accessibility-in-mind/ | High / medium |
| S9 | Adobe Design, "Behind the design: Adobe's new splash screens": https://adobe.design/ideas/behind-the-design-adobe-s-new-splash-screens | Medium (a Brand project, not Spectrum) |
| S10 | "My three-year journey building the home for Microsoft's Fluent 2": https://medium.com/design-bootcamp/my-three-year-journey-building-the-home-for-fluent-2-f83f343793c5 | Medium (one designer's account) |
| S11 | Pixel Surgery, Fluent 2 website case study: https://www.pixelsurgery.ca/case-study/fluent-2-website | Medium |
| S12 | Primer, "Meet the team": https://primer.style/about | High |
| S13 | Reshaped interview with GitHub's design system team: https://www.reshaped.so/blog/interviews/github | Medium |
| S14 | Primer Brand: https://primer.style/brand ; GitHub brand toolkit: https://brand.github.com/ | High |
| S15 | GitHub blog, "How we designed and wrote the narrative for our homepage" (2021): https://github.blog/2021-02-11-how-we-designed-and-wrote-the-narrative-for-our-homepage/ | High |
| S16 | GOV.UK Design System, "Design System team": https://design-system.service.gov.uk/design-system-team/ ; team playbook repo: https://github.com/alphagov/design-system-team-docs | High |
| S17 | GDS Design in government blog, 2025-04-04, "How we refreshed the Government Digital Service brand": https://designnotes.blog.gov.uk/2025/04/04/ | High (only the introduction was readable) |
| S18 | Prototype kit, "Use the GOV.UK brand refresh": https://prototype-kit.service.gov.uk/docs/use-govuk-brand-refresh ; beeps, "The (not quite new) GOV.UK brand": https://beeps.website/blog/2025-06-25-the-not-quite-new-govuk-brand/ ; PublicTechnology: https://www.publictechnology.net/2025/06/30/society-and-welfare/gds-unveils-colourful-500k-refresh-of-gov-uk/ | High / medium / medium (cost contested) |
| S19 | Shopify UX, "Uplifting Shopify Polaris": https://medium.com/shopify-ux/uplifting-shopify-polaris-7c54fc6564d9 | High (about 3 years old) |
| S20 | Salesforce, "What is SLDS 2": https://www.salesforce.com/blog/what-is-slds-2/ | Medium (product, not process) |
| S21 | zeroheight, "Design Systems Report 2025 – an overview": https://zeroheight.com/blog/design-systems-report-2025-an-overview/ | Medium (a vendor survey) |
| S22 | NN/g, "Small by design: the strength of lean design-system teams": https://nngroup.com/articles/lean-design-system-teams | Medium |
| S23 | zeroheight, "Design Systems Report 2026: the findings": https://zeroheight.com/blog/design-systems-report-2026-the-findings/ | Medium |
| S24 | Sparkbox, 2021 and 2022 design systems surveys: https://sparkbox.com/foundry/2021_design_systems_survey , https://sparkbox.com/foundry/2022_design_systems_survey | Medium |
| S25 | Linear, "Quality Wednesdays": https://linear.app/now/quality-wednesdays | High |
| S26 | Vercel, "Design engineering at Vercel": https://vercel.com/blog/design-engineering-at-vercel ; Vercel careers, Design Engineer: https://vercel.com/careers/design-engineer-us-6129441004 | High (intro and listings only) |
| S27 | Stripe Sessions 2024, "Craft and beauty": https://stripe.com/sessions/2024/craft-and-beauty-the-business-value-of-form-in-function ; Lenny's Podcast with Katie Dill: https://podcasts.apple.com/us/podcast/building-beautiful-products-with-stripes-head-of/id1627920305?i=1000631357330 | Medium (talks; the quality review is named, not described) |
| S28 | Designing Atlassian, "How we learnt to give better design feedback at Atlassian": https://medium.com/designing-atlassian/sparring-at-atlassian-cc2fb0a7823a ; "The art of sparring": https://medium.com/designing-atlassian/the-art-of-sparring-ce4f379f156c | Medium (2015–2016) |
| S29 | IBM Enterprise Design Thinking, "The Keys": https://ibm.com/design/thinking/page/framework/keys | High |
| S30 | GOV.UK Design System, "Design System working group": https://design-system.service.gov.uk/community/design-system-working-group ; "Contribution criteria": https://design-system.service.gov.uk/community/contribution-criteria ; playbook, "How to organise and run a working group review": https://team-playbook.design-system.service.gov.uk/guides/how-to-organise-and-run-a-working-group-review | High |
| S31 | EightShapes, "Design system features, step-by-step": https://medium.com/eightshapes-llc/system-features-step-by-step-e69c90982630 ; "Team models for scaling a design system": https://medium.com/eightshapes-llc/team-models-for-scaling-a-design-system-2cf9d03be6a0 | High |
| S32 | Nathan Curtis, "Designing and automating component specifications" (Into Design Systems): https://speakerdeck.com/nathanacurtis/designing-and-automating-component-specifications-9fd209c9-9582-44a7-81f1-08047e984d4c | Medium (slides only) |
| S33 | EightShapes, "Component QA in design systems": https://eightshapes.com/articles/component-qa-in-design-systems | Low here (title only) |
| S34 | Design QA practice: 21st.dev, "Design QA checklist": https://21st.dev/blog/design-qa-checklist ; Hypermatic, "Visual regression testing vs design QA": https://www.hypermatic.com/articles/pixelay-visual-regression-testing-vs-design-qa/ ; Mass.gov UAT checklist: https://www.mass.gov/info-details/experience-design-user-acceptance-testing-uat-checklist | Low (they agree with one another) |
| S35 | Carbon issue #8911, "Add Percy VRT snapshots for all components": https://github.com/carbon-design-system/carbon/issues/8911 ; Cyprus DSF, "Automated visual testing": https://dsf.dmrid.gov.cy/2025/01/08/enhancing-the-unified-design-system-with-automated-visual-testing/ | High (an old issue) / high |
| S36 | GOV.UK publishing components, "Testing components": https://docs.publishing.service.gov.uk/repos/govuk_publishing_components/testing-components.html | High (a sister repository to govuk-frontend) |
| S37 | GitHub blog, "Improving site performance by shipping more CSS": https://github.blog/engineering/architecture-optimization/improving-site-performance-by-shipping-more-css/ | High |
| S38 | IBM Design Language, "Illustration overview": https://www.ibm.com/design/language/illustration/overview | High |
| S39 | Carbon v10 site, "v11 release": https://v10.carbondesignsystem.com/whats-happening/v11-release/ | High |
| S40 | Google Design, "Better, easier, emotional UX" (M3 Expressive research): https://design.google/library/expressive-material-design-google-research | High (Google's own account, not independently checked) |
| S41 | Dezeen, "Google ushers in age of expressive interfaces": https://dezeen.com/2025/05/28/google-ushers-in-age-of-expressive-interfaces-with-material-design-update/ | Medium (the 46 studies and 18,000 figures) |
| S42 | Rodden, Hutchinson and Fu, "Measuring the user experience on a large scale" (CHI 2010): https://research.google/pubs/pub36299/ | High |
| S43 | Doctolib, "Three key strategies that enabled us to reduce our design debt": https://medium.com/doctolib/three-key-strategies-that-enabled-us-to-reduce-our-design-debt-at-doctolib-6a6f0b3ac5ac ; thoughtbot, "What is design debt?": https://thoughtbot.com/blog/what-is-design-debt | Low to medium |
| S44 | Lindgaard et al., "Attention web designers: you have 50 milliseconds to make a good first impression!", *Behaviour and Information Technology* 25 (2006), as reported at https://www.mediapost.com/publications/article/39327 | Medium (a peer-reviewed study, read through coverage; small page set) |
