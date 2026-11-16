# Benchmark scorecard: Pluto against seven reference systems

- **Status:** an instrument. Re-scored after every specification lands. The scores and the gap table are replaced in place; every past run stays in the run log (§8). Like a placeholder memo, it is completed in place; it commits us to nothing.
- **Date:** 2026-11-15 (first run).
- **Author:** a researcher, at the owner's request that outcomes be "constantly" assessed against the prior art.
- **Question:** On fourteen dimensions a reader or a builder notices, where does Pluto stand against Carbon, Material 3, Spectrum 2, Atlassian, Primer, Radix Themes and GOV.UK, and what would move each score one step?
- **What would answer it:** a fixed rubric; four scripts that measure what can be measured (`scripts/bench/`); a checklist for the rest, each mark with its evidence.
- **What it blocks:** nothing. It feeds the roadmap (§6).

## In short

Kuiper 0.13 as built from `020`'s landing tree (re-scored after `020` and after `027a`, whose scores are the same; the first run was Pluto 0.12 at `ea1f9bd`, in the run log). Each score is 0 to 4 (§2).

| # | Dimension | Pluto | Carbon | Material 3 | Spectrum 2 | Atlassian | Primer | Radix Themes | GOV.UK |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Component breadth | 3 | 3 | 2 | **4** | 3 | 3 | 2 | 1 |
| 2 | Guidance depth | 2 | **3** | **3** | **3** | 2 | **3** | 0 | 1 |
| 3 | Accessibility evidence | 1 | **3** | 1 | 0 | 0 | 2 | 0 | 2 |
| 4 | Theming | 2 | 3 | **4** | 2 | 2 | **4** | **4** | 0 |
| 5 | Tokens | 1 | 3 | 1 | 2 | 3 | **4** | 1 | 1 |
| 6 | Navigation and search | **4** | 2 | 3 | 3 | 3 | 3 | 2 | 3 |
| 7 | The part first | 2 | 1 | **4** | 3 | 2 | 2 | **4** | **4** |
| 8 | Page weight and paint | **4** | 0 | 0 | 2 | 2 | 1 | 2 | **4** |
| 9 | Code examples | **3** | **3** | 0 | **3** | **3** | **3** | **3** | 2 |
| 10 | Install and adoption | 3 | **4** | **4** | 3 | **4** | **4** | 3 | **4** |
| 11 | Change communication | **3** | **3** | 1 | 1 | 2 | **3** | 2 | **3** |
| 12 | Design tooling | 0 | 2 | 2 | 2 | 2 | **4** | 1 | 1 |
| 13 | Reach | 1 | **3** | **3** | **3** | 0 | 1 | 0 | 2 |
| 14 | Governance | 3 | **4** | 0 | 1 | 2 | **4** | 1 | 3 |
| | **Total, of 56** | **32** | 37 | 28 | 32 | 30 | 41 | 25 | 31 |

Bold marks the best score in a row. The total is a summary, not a target: the rows weigh differently for Pluto's apps.

**The five biggest gaps** (Pluto against the best reference, §5):

1. **Design tooling, 0 against 4 (Primer).** No design-tool library, no tokens as design variables, no designer path.
2. **Tokens, 1 against 4 (Primer).** The file is not DTCG, the role words live in the site, not the token file, and nothing records a removed or renamed name.
3. **Accessibility evidence, 1 against 3 (Carbon).** axe in both themes and measured contrast, but no per-component status, no forced-colours pass over items, no high-contrast scheme, no keyboard table, no screen-reader record.
4. **Theming, 2 against 4 (Material, Primer, Radix).** Light and dark and the expressive mode, but a light island cannot sit in a dark page, and there is no contrast scheme.
5. **The part first, 2 against 4 (Material, Radix, GOV.UK).** The first frame starts at y = 419, but the part's own pixels start at y = 572 at 1440 and y = 661 at 390. The frame's header takes 150 px.

One more row sits two steps behind: reach (1 against 3). Governance is one step behind (3 against 4) since `020`, and change communication ties the best (3) since `020`'s upgrade guide. **Pluto leads** on navigation and search (the 018 work: tree, phone tree, grouped and highlighted search, aliases, previous and next) and ties GOV.UK on page weight: 383 kB and a 1.0 s paint on Button, against 1.9 to 6.0 MB for five of the seven.

## How to read this

- **EXECUTED:** run by a script here, on 2026-11-15, macOS (Darwin 25.5.0, arm64), Bun 1.4.4, the repository's Playwright 1.64.1 Chromium. Numbers come from the JSON the scripts print.
- **READ:** a source says so. The 2026-11-15 memos are cited by short name: *product*, *developer*, *enterprise* (the three site teardowns), *Carbon*, *Material*, *Spectrum*, *Primer*, *Radix*, *GOV.UK* (`2026-11-15-prior-art-*.md`), *scoped* (`2026-11-15-scoped-schemes-and-contrast.md`), *synthesis* (`2026-11-15-site-polish-synthesis.md`). Clones are under `context/prior_art/`, at the commits in its README.
- **INFERRED:** our reasoning.
- **A criterion we could not verify counts as absent,** and is marked `?` in §4. So a reference's score is a floor. This matters most for Atlassian and Spectrum, whose sites publish little accessibility evidence and whose code is not cloned here.

**What "Pluto 0.12" means here.** Source facts are read at `ea1f9bd` with `git show`. The site was measured as built in `build/` at 2026-11-15 13:53 local, served gzipped by `scripts/bench/serve.ts`. That build holds the working tree, including uncommitted `019` work on the error-summary page and the app shell. No row's score depends on that difference (INFERRED: the Button and Dialog pages, the twins' structure and every count below are the same at `ea1f9bd`).

**Terms.** A *specimen* is the component drawn on the page, live or as a picture. The *stage* is the part of Pluto's frame the specimen renders in. A *twin* is a page's Markdown copy at `index.md`. *Transfer* is the encoded bytes the page fetched.

## 1. Method

**What is compared.** Each system's own documentation site and its public source, as a reader or a builder meets them. For Material 3 that is m3.material.io, not the per-platform docs it links to; this costs it on code examples (row 9).

**Two components.** Button, which every system has, and one overlay: Dialog (Carbon's Modal, Atlassian's Modal dialog, Spectrum's Standard dialog; GOV.UK has none, so its Error summary). Rows 2, 7 and 8 read these pages.

**Three kinds of row.**

- **Scripted** (rows 1, 2, 7, 8): a script prints a number; the anchor turns it into a score. Rows 2 and 6 also take a check by eye of a surprising mark.
- **Checklist** (rows 3–6 and 9–14): fixed criteria, each present or absent, with the evidence cited. Pluto's marks come mostly from `scripts/bench/pluto.ts`.
- Every criterion and anchor is in §2, so a second scorer reaches the same score.

**The loading profile** (rows 7 and 8). Chromium at 1440 × 900, a cold cache, 1.6 Mbps down, 750 kbps up, 150 ms round trip, the CPU slowed 4×: the perf suite's profile (`015` decision 23; `tests/e2e/perf.spec.ts`). Three runs, the median kept. Transfer counts every response, all frames, until the network has been quiet for 1.5 s. Positions are read on a second, unthrottled load, at 1440 × 900 and at 390 × 844 with touch. Cookie banners are hidden, never accepted, as the teardowns did.

## 2. The rubric

Each score is 0 to 4. A checklist row counts its criteria and maps the count to a score as its row says.

**1. Component breadth.** How many of 40 parts most systems name the system documents. The 40 and the slugs that count as each are `REFERENCE_PARTS` in `scripts/bench/targets.ts` (accordion, alert, avatar, badge, breadcrumbs, button, button group, card, checkbox, combobox, date picker, dialog, drawer, menu, empty state, file upload, form field, link, list, spinner, progress, side navigation, pagination, popover, radio, search, segmented control, select, separator, skeleton, slider, number input, switch, table, tabs, text input, textarea, toast, tooltip, tag). *Script:* `breadth.ts`. *Anchors:* 0 under 12; 1 12–19; 2 20–26; 3 27–33; 4 34 or more.

**2. Guidance depth.** Ten elements, marked on Button and on the overlay across every tab: usage (when to use); do and don't; anatomy; keyboard (a heading or table of keys, not an example named "Keyboard"); content (writing rules); accessibility; props described (a props table whose description column is at least 80% full); states; changes (a changelog tab or an "updated" fact); evidence (research, known issues, or a statement of what is not checked). *Script:* `depth.ts`. *Anchors,* on the mean count of the two pages: 0 under 2; 1 under 4; 2 under 6; 3 under 8; 4 at 8 or more.

**3. Accessibility evidence,** published or in public source. (a) An automated scan of every component in every scheme it ships. (b) Open and interactive states scanned too. (c) Keyboard behaviour per component as keys and actions. (d) A per-component status, generated from tests or reviews. (e) Forced-colours rules across the interactive components. (f) A high- or increased-contrast scheme. (g) Colour pairs' contrast computed and tested. (h) Screen-reader testing recorded. *Anchors:* 0–1 → 0; 2–3 → 1; 4–5 → 2; 6–7 → 3; 8 → 4.

**4. Theming.** (a) Light and dark. (b) Any subtree takes either scheme, both directions. (c) A contrast scheme. (d) A density or scale setting. (e) A second axis beyond the scheme: brand themes, accents, a mode. *Anchors:* the count, with 4 or 5 → 4.

**5. Tokens.** (a) One source generates every output. (b) Each semantic token's job is written down. (c) That description lives in the token source. (d) DTCG format, or a DTCG export. (e) Contrast pairs encoded and tested. (f) Lifecycle recorded: introduced, renamed, deprecated, removed. (g) Published to more than one target (CSS, JS or JSON, a design tool). *Anchors:* 0–1 → 0; 2–3 → 1; 4 → 2; 5–6 → 3; 7 → 4.

**6. Navigation and search.** (a) A left tree of the section on leaf pages (`site.ts` counts its links). (b) The phone menu holds that tree. (c) Search over components and foundations. (d) Results grouped, matches highlighted. (e) Search finds sections in pages, or other names (aliases). (f) Previous and next, or breadcrumbs, on leaf pages. *Anchors:* 0–1 → 0; 2 → 1; 3 → 2; 4–5 → 3; 6 → 4.

**7. The part first.** Where the first specimen's pixels start on the Button page, in page pixels from the top: S at 1440 × 900, P at 390 × 844. A picture counts, where a site has no live example. *Script:* `site.ts` (`exampleAt1440`, `exampleAt390`). *Anchors:* 4: S ≤ 350 and P ≤ 500. 3: S ≤ 500 and P ≤ 844 (inside the phone's first screen). 2: S ≤ 900 (inside the desktop's first screen). 1: S ≤ 1,350. 0: later, or none.

**8. Page weight and paint.** The Button page under the profile (§1). Transfer: 4 ≤ 500 kB; 3 ≤ 1,000; 2 ≤ 2,000; 1 ≤ 4,000; else 0. Largest contentful paint (LCP): 4 ≤ 1.5 s; 3 ≤ 2.5; 2 ≤ 4; 1 ≤ 8; else 0. *Score:* the mean of the two, rounded down. *Script:* `site.ts`.

**9. Code examples.** (a) Live examples on component pages. (b) The code shown is the code run. (c) A copy button. (d) Editable in place, or opens in a sandbox or playground. (e) Props set by controls. (f) Each example viewable in every scheme, in place. *Anchors:* 0 → 0; 1–2 → 1; 3 → 2; 4–5 → 3; 6 → 4.

**10. Install and adoption.** (a) An install command on each component page, or one documented package install. (b) A developer getting-started path. (c) Exact versions reproducible. (d) Dependencies resolved for you. (e) A starter, template or framework guide. (f) A designer path: a kit, a design start page, a prototyping tool. *Anchors:* 0–1 → 0; 2 → 1; 3 → 2; 4–5 → 3; 6 → 4.

**11. Change communication.** (a) Dated release notes. (b) Breaking changes marked, with what to do. (c) A change history or "updated in" fact on each component page. (d) Migration or upgrade guides. (e) Generated notes or a feed: changesets, a token diff, RSS. (f) A public roadmap or "upcoming" list. *Anchors:* 0–1 → 0; 2 → 1; 3 → 2; 4–5 → 3; 6 → 4.

**12. Design tooling.** (a) An official design-tool library of the components. (b) Tokens published as design-tool variables. (c) A stated process that keeps library and code in step. (d) Designer tools: plugins, a theme builder, AI or MCP access. *Anchors:* the count. With no (a), a community kit or a prototyping kit scores 1.

**13. Reach.** (a) More than one framework or platform. (b) Right-to-left layout supported in the styles. (c) Internationalisation: guidance, or built-in strings an app can translate. (d) A published browser and assistive-technology support statement. *Anchors:* the count.

**14. Governance.** (a) A written process for proposing and accepting changes. (b) A lifecycle status shown per component. (c) A deprecation path that names the replacement. (d) A written rule for what is a breaking change. (e) Public decision records. (f) A feedback channel on every page. *Anchors:* 0–1 → 0; 2 → 1; 3 → 2; 4–5 → 3; 6 → 4.

## 3. Scores

The table is in "In short". Pluto's raw numbers for this run (EXECUTED, `pluto.ts --rev ea1f9bd`):

- **Registry:** 75 items: 57 ui, 8 blocks, 4 lib, 3 fonts, 2 hooks, 1 theme. 8 versioned registries under `static/`.
- **Tokens:** 48 primitives; 2 schemes of 61 roles; 61 of 61 roles have words in `src/lib/site/foundations/words.ts`; 0 `$value`, 0 `$type`, 0 descriptions in the token file; 129 contrast rows in `contrast`.
- **Theme:** 0 `light-dark()`, 0 `prefers-contrast`, 0 `.light` reset; `surface-ink` gives a dark island; 1 `forced-colors` rule in `src/app.css`, 0 in item files.
- **Tests:** 25 e2e specs, among them `axe`, `keyboard` and `forced-colors` (the last for the site's nav only, `018`); light and dark Chromium projects; no screen-reader tooling at `ea1f9bd`.
- **Twins (75 component pages):** usage 100%; do and don't 100%; anatomy 0%; a keyboard table 0%; content rules 0%; an "Updated" fact 100%; median 3 accessibility bullets; median 2 examples; median 610 words of prose; 25% of 1,062 prop rows described.
- **Change:** 11 releases in `CHANGELOG.md`, 26 marks of "interface change", 0 migration pages, no feed.
- **Reach:** Svelte only; item files hold 21 physical-side classes (`ml-`, `pr-`, `left-` …) and 53 logical ones (`ms-`, `pe-`, `start-` …); 0 RTL tests; 2 `Intl` uses.
- **Governance:** 18 specifications, 36 reviews, 73 owner decisions; 0 deprecated items; no CONTRIBUTING file; a "Suggest a change on GitHub" link in every page's footer.

## 4. Evidence

`✓` present, `–` absent, `?` not verified (counts as absent).

### Row 1. Component breadth (EXECUTED, `breadth.ts`)

| | Documented | Of 40 | Score | Missing |
|---|---|---|---|---|
| Pluto | 68 (ui and blocks) | 31 | 3 | combobox, date picker, file upload, pagination, search, slider, number input, toast, tag |
| Carbon | 42 | 33 | 3 | avatar, badge, combobox, empty state, separator, skeleton, textarea (some live inside other pages) |
| Material 3 | 37 | 24 | 2 | accordion, alert, avatar, breadcrumbs, combobox, empty state, file upload, form field, link, pagination, popover, select, skeleton, number input, table, textarea |
| Spectrum 2 | 68 | 37 | 4 | drawer, pagination, skeleton |
| Atlassian | 55 | 31 | 3 | accordion, button group, combobox, file upload, list, search, segmented control, separator, number input |
| Primer | 62 | 32 | 3 | date picker, drawer, file upload, search, separator, slider, number input, toast |
| Radix Themes | 56 | 25 | 2 | accordion, breadcrumbs, button group, combobox, date picker, drawer, empty state, file upload, form field, side nav, pagination, search, number input, toast, tag |
| GOV.UK | 37 | 17 | 1 | 23, by design: no dialog, menu, popover, tooltip, switch … |

Pluto's 68 include 9 compositions and 8 blocks, which match none of the 40. After `027a` (`9395b46`): `link` and `button-group` each add a part; `progress` matches "progress / meter", which `meter` already held. GOV.UK's 30 patterns are not counted (READ, *GOV.UK* §3).

### Row 2. Guidance depth (EXECUTED, `depth.ts`)

| | Button, of 10 | Overlay, of 10 | Words (Button + overlay) | Score |
|---|---|---|---|---|
| Pluto | 5 | 5 | 727 + 909 | 2 |
| Carbon | 8 | 7 | 11,036 + 6,039 | 3 |
| Material 3 | 6 | 6 | 3,189 + 2,895 | 3 |
| Spectrum 2 | 7 | 5 | 2,148 + 1,013 | 3 |
| Atlassian | 6 | 5 | 16,893 + 23,505 | 2 |
| Primer | 7 | 6 | 2,693 + 3,596 | 3 |
| Radix Themes | 0 | 0 | 764 + 645 | 0 |
| GOV.UK | 4 | 3 | 1,855 + 1,417 | 1 |

- **Pluto has:** usage, do and don't, accessibility, changes (the "Updated" fact), evidence ("Firefox, Safari and screen readers are not checked yet"). **It lacks:** anatomy, a keyboard table, content rules, described props (Button 4 of 10 rows, Dialog 10 of 23), states.
- **Corrected by eye:** Radix's Dialog "content" mark is its `Dialog.Content` API heading, not writing guidance; removed (0 for that page).
- **The check rewards structure, not reasoning.** GOV.UK's reasons, research and real example content (READ, *GOV.UK* §1) score low here. Its words-per-page are still twice Pluto's.

### Row 3. Accessibility evidence

| | a scan | b states | c keys | d status | e forced | f contrast scheme | g pairs tested | h screen reader | Count | Score |
|---|---|---|---|---|---|---|---|---|---|---|
| Pluto | ✓ | – | – | – | – | – | ✓ | – | 2 | 1 |
| Carbon | ✓ | ✓ | ✓ | ✓ | ✓ | – | – | ✓ | 6 | 3 |
| Material 3 | – | – | ✓ | – | ✓ | ✓ | ? | – | 3 | 1 |
| Spectrum 2 | ? | ? | ✓ | – | ? | – | – | ? | 1 | 0 |
| Atlassian | ? | ? | – | – | ? | – | ? | ? | 0 | 0 |
| Primer | ? | ? | ✓ | ✓ | ? | ✓ | ✓ | ✓ | 5 | 2 |
| Radix Themes | – | – | – | – | – | – | – | – | 0 | 0 |
| GOV.UK | ✓ | ✓ | – | – | ✓ | – | ? | ✓ | 4 | 2 |

- **Pluto.** (a) axe on every site page at 360, 768 and 1280, in both themes (READ, `tests/e2e/axe.spec.ts`; `playwright.config.ts`). (b) Only 5 items' example views in the other theme and a few overlays open; no hover, pressed, disabled or invalid state is driven (READ, *synthesis* §3.4). (c) Accessibility notes are prose bullets, median 3 (EXECUTED). (e) One `forced-colors` rule, for glass; `forced-colors.spec.ts` checks the site's nav only (EXECUTED). (g) 129 contrast rows, recomputed by `tests/unit/contrast.test.ts` (READ). (h) None at `ea1f9bd`; a VoiceOver script exists in the working tree for `019` (EXECUTED, `scripts/a11y/`, untracked).
- **Carbon.** (a, b) IBM Equal Access checks in 42 test files, tagged default, advanced states and keyboard (EXECUTED grep; READ, *Carbon* §3.3). (c) Keyboard sections (EXECUTED, `depth.ts`). (d) A generated "Accessibility status" page, tested or partial or not tested (EXECUTED, fetched). (e) The `high-contrast-mode` mixin in 30 of 91 component style folders (EXECUTED grep). (h) Manual JAWS, VoiceOver and NVDA in the definition of done (READ, *Carbon* §2.1). (g) Contrast is prose (READ, *Carbon* §1.1).
- **Material 3.** (c) Keyboard sections (EXECUTED). (e) `forced-colors` in 17 of 33 Material Web folders (EXECUTED grep). (f) Medium- and high-contrast schemes (READ, *Material* §2). (a) No axe in the Material Web clone (EXECUTED grep). (g) Contrast comes from a generator, not a test (READ, *scoped* §2).
- **Spectrum 2.** (c) Keyboard sections on Button (EXECUTED). (f) The `high` contrast mode is declared and used by no token (EXECUTED in *Spectrum* §1). The rest is not on its pages (EXECUTED: no "high contrast", "forced colours" or screen-reader names on the Button and Dialog pages) and its component code is not cloned.
- **Atlassian.** No keyboard section found (EXECUTED); its colour page says two themes, light and dark (EXECUTED, fetched); no named screen readers or contrast modes on its usage or accessibility pages (EXECUTED). Code not cloned.
- **Primer.** (c) Keyboard section on Button (EXECUTED). (d) A status page with an accessibility review per component (READ, *Primer* §4). (f) High-contrast themes; (g) contrast CI, 7:1 in high contrast (READ, *Primer* §2). (h) "How to test" with screen-reader steps on each Accessibility tab (READ, *product* §3).
- **Radix Themes.** No axe, `forced-colors` or contrast check in the clone (EXECUTED grep; *Radix* §1); no accessibility section on its pages (EXECUTED).
- **GOV.UK.** (a, b) axe over every example of every component, 436 hidden test-only examples (READ, *GOV.UK* §2). (e) `forced-colors` in 8 of 43 components, the controls among them (EXECUTED grep). (h) AT findings recorded, if scattered (READ, *GOV.UK* §2).

### Row 4. Theming

| | a light, dark | b any subtree | c contrast scheme | d density | e second axis | Score |
|---|---|---|---|---|---|---|
| Pluto | ✓ | – | – | – | ✓ | 2 |
| Carbon | ✓ | ✓ | – | ? | ✓ | 3 |
| Material 3 | ✓ | ✓ | ✓ | ✓ | ✓ | 4 |
| Spectrum 2 | ✓ | ? | – | ✓ | – | 2 |
| Atlassian | ✓ | ? | – | ? | ✓ | 2 |
| Primer | ✓ | ✓ | ✓ | – | ✓ | 4 |
| Radix Themes | ✓ | ✓ | – | ✓ | ✓ | 4 |
| GOV.UK | – | – | – | – | – | 0 |

- **Pluto.** (b) A dark island (`class="dark surface-ink"`) but no light island, and the `dark:` variant leaks into a light subtree (READ, *scoped* §1). (e) The expressive mode (READ, `tokens/pluto.tokens.json`).
- **Carbon:** four themes, zones on any element (READ, *Carbon* §1.1). **Material:** tokens settable on any selector, `light-dark()` in labs, contrast schemes, density guidance (READ, *Material* §2, *scoped* §2; EXECUTED, `/foundations/layout/grids-spacing/density` in its sitemap), dynamic colour. **Spectrum:** light, dark, wireframe; desktop and mobile scale (READ, *Spectrum* §1). **Atlassian:** the root carries `data-theme="dark:dark light:light motion:motion shape:shape spacing:spacing typography:typography"` (EXECUTED). **Primer:** 14 themes, attributes on any element (READ, *Primer* §1, *scoped* §2). **Radix:** `.light` and `.dark` on any Theme, scaling, 25 accents (READ, *Radix* §2). **GOV.UK:** one scheme (READ, *product* §1).

### Row 5. Tokens

| | a one source | b jobs written | c in the source | d DTCG | e pairs tested | f lifecycle | g targets | Count | Score |
|---|---|---|---|---|---|---|---|---|---|
| Pluto | ✓ | ✓ | – | – | ✓ | – | – | 3 | 1 |
| Carbon | ✓ | ✓ | ✓ | ✓ | – | ✓ | ✓ | 6 | 3 |
| Material 3 | ✓ | ✓ | ? | – | ? | – | ✓ | 3 | 1 |
| Spectrum 2 | ✓ | – | – | ✓ | – | ✓ | ✓ | 4 | 2 |
| Atlassian | ✓ | ✓ | ✓ | ? | ? | ✓ | ✓ | 5 | 3 |
| Primer | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 7 | 4 |
| Radix Themes | ✓ | ✓ | – | – | – | – | ✓ | 3 | 1 |
| GOV.UK | ✓ | ✓ | – | – | – | ✓ | – | 3 | 1 |

- **Pluto:** one file, bespoke shape; words in the site; 129 pairs tested; no rename record; CSS only (EXECUTED; READ, *Primer* §1, *Spectrum* §3).
- **Carbon:** DTCG 2025.10 with a resolver; a test fails a token without a description; deprecation in the description (READ, *Carbon* §1.1). **Spectrum:** UUIDs, lifecycle, semantic diff, DTCG and Figma exporters; 106 of 2,523 rows described (READ and EXECUTED, *Spectrum* §1, §3). **Atlassian:** every token listed with its job and "Introduced v …" (EXECUTED, `/components/tokens/all-tokens`). **Primer:** DTCG JSON5, `$description` and LLM rules, `removed.json`, contrast CI, Figma variables (READ, *Primer* §1, §4). **Radix:** twelve-step scales with step jobs, no contrast test (READ, *Radix* §1). **GOV.UK:** Sass settings, named colour uses, deprecation warnings (READ, *GOV.UK* §5).

### Row 6. Navigation and search

| | a tree (links) | b phone tree | c search | d grouped, highlighted | e sections or aliases | f prev/next or crumbs | Score |
|---|---|---|---|---|---|---|---|
| Pluto | ✓ (76) | ✓ | ✓ | ✓ | ✓ aliases | ✓ both | 4 |
| Carbon | ✓ (134) | ✓ | ✓ | ? | ? | ? | 2 |
| Material 3 | – (8, a rail) | ✓ | ✓ | ✓ | ? | ✓ | 3 |
| Spectrum 2 | ✓ (137) | ✓ | ✓ | ? | ? | ✓ | 3 |
| Atlassian | ✓ (106) | ✓ | ✓ | ✓ | ? | ? | 3 |
| Primer | ✓ (177) | ✓ | ✓ | ✓ | ? | ? | 3 |
| Radix Themes | ✓ (70) | ? | ✓ | ? | ✓ sections | ? | 2 |
| GOV.UK | ✓ (39) | ✓ | ✓ | – | ✓ aliases | ? | 3 |

Link counts EXECUTED (`site.ts`, `leftNavLinks`). Pluto's tree, phone tree (`all-pages.svelte`), grouped search with `<mark>` and aliases, breadcrumb and `prev-next.svelte` are READ at `ea1f9bd`. The others are READ from *enterprise* §3, *developer* §6 and *product* §3–5.

### Row 7. The part first (EXECUTED, `site.ts`)

| | h1 at 1440 | Specimen S at 1440 | Specimen P at 390 | Score |
|---|---|---|---|---|
| Pluto | 132 | 572 (frame card at 419) | 661 | 2 |
| Carbon | 136 | 1,052 | 968 | 1 |
| Material 3 | 179 | ≈ 8, a picture (no live example) | ≈ 289, a picture | 4 |
| Spectrum 2 | 198 | 466 | 562 | 3 |
| Atlassian | 171 | 591 | 648 | 2 |
| Primer | 161 | 679 | 1,007 | 2 |
| Radix Themes | 128 | 290 | 384 | 4 |
| GOV.UK | 191 | 333 | 437 | 4 |

Material's specimen is read from the screenshot, since no live example exists to select (READ, the run's `material-1440.png`, `material-390.png`). Pluto's frame card starts at 419, meeting `018`'s target (above 450); the stage, where the part is drawn, starts 153 px lower, under the frame's title, its description and the Light | Dark switch.

### Row 8. Page weight and paint (EXECUTED, `site.ts`, 3 runs, medians)

| | Transfer, kB (main frame) | Requests | LCP, ms | CLS | Score |
|---|---|---|---|---|---|
| Pluto | 383 (383) | 87 | 1,020 | 0 | 4 |
| Carbon | 5,958 (2,511) | 344 | 22,120 | 0 | 0 |
| Material 3 | 3,375 (3,289) | 38 | 9,324 | 0.009 | 0 |
| Spectrum 2 | 1,859 (476) | 245 | 1,860 | 0.015 | 2 |
| Atlassian | 4,030 (4,030) | 33 | 836 | 0.005 | 2 |
| Primer | 3,146 (3,146) | 164 | 5,912 | 0.001 | 1 |
| Radix Themes | 1,930 (1,930) | 263 | 1,924 | 0 | 2 |
| GOV.UK | 479 (161) | 34 | 684 | 0.01 | 4 |

Runs varied by under 1% in transfer and under 10% in LCP. Pluto is served from this machine, the others over the internet, both under the same throttle; treat LCP as ± 20%. Atlassian sits 30 kB over the 4,000 kB band.

### Row 9. Code examples

| | a live | b code = run | c copy | d sandbox or edit | e controls | f every scheme | Score |
|---|---|---|---|---|---|---|---|
| Pluto | ✓ | ✓ | ✓ | – | – | ✓ | 3 |
| Carbon | ✓ | – | ? | ✓ | ✓ | ✓ | 3 |
| Material 3 | – | – | – | – | – | – | 0 |
| Spectrum 2 | ✓ | ✓ | ✓ | – | ✓ | – | 3 |
| Atlassian | ✓ | ✓ | ✓ | ✓ | – | – | 3 |
| Primer | ✓ | ✓ | ✓ | ✓ | – | – | 3 |
| Radix Themes | ✓ | ✓ | ✓ | ✓ | – | – | 3 |
| GOV.UK | ✓ | ✓ | ✓ | – | – | – | 2 |

READ: *enterprise* §3–4, *developer* §4–5, *product* §3–5, *Carbon* §3.2. Material 3's component pages hold no code (EXECUTED in *enterprise* §3.2); its code lives in per-platform docs. Atlassian's canvas stays light in the dark site (READ, *enterprise* §3.4). Radix's "View in Playground" seen on its page (EXECUTED, screenshot).

### Row 10. Install and adoption

| | a install | b dev start | c pinned | d deps | e starter or guide | f designer path | Score |
|---|---|---|---|---|---|---|---|
| Pluto | ✓ | ✓ | ✓ | ✓ | ✓ | – | 3 |
| Carbon | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 4 |
| Material 3 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 4 |
| Spectrum 2 | ✓ | ✓ | ✓ | ✓ | ✓ | ? | 3 |
| Atlassian | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 4 |
| Primer | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 4 |
| Radix Themes | ✓ | ✓ | ✓ | ✓ | ✓ | – | 3 |
| GOV.UK | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 4 |

- **Pluto:** the `add` command on every page, from this site or GitHub; `/start/install/` from an empty SvelteKit app; versioned registries at `/v<version>/r`; `registryDependencies` resolved by the CLI (READ, `src/lib/site/site.ts`; EXECUTED, the twins). No designer path: Brand has SVG downloads of the mark, not a design kit.
- **Designer paths:** Carbon's design resources page (EXECUTED); Material's "Resources" chip with a Figma mark on Button (EXECUTED, screenshot); Atlassian's "Figma libraries" (EXECUTED); Primer's "Figma libraries" (EXECUTED); GOV.UK's Prototype Kit (EXECUTED, its sitemap). Spectrum's `/getting-started/for-designers/` is in its sitemap but returns 404 today (EXECUTED). Radix's Figma file is "unofficial", by a community member (EXECUTED, its resources page).

### Row 11. Change communication

| | a dated | b breaking marked | c per page | d migration | e generated or feed | f roadmap | Score |
|---|---|---|---|---|---|---|---|
| Pluto | ✓ | ✓ | ✓ | ✓ | – | – | 3 |
| Carbon | ✓ | ✓ | ✓ | ✓ | ✓ | ? | 3 |
| Material 3 | ✓ | ? | – | ✓ | – | – | 1 |
| Spectrum 2 | ? | ✓ | – | ? | ✓ | – | 1 |
| Atlassian | ✓ | ✓ | ✓ | ? | ? | – | 2 |
| Primer | ✓ | ✓ | – | ✓ | ✓ | – | 3 |
| Radix Themes | ✓ | ✓ | – | ✓ | – | – | 2 |
| GOV.UK | ✓ | ✓ | ✓ | ✓ | – | ✓ | 3 |

- **Pluto:** dated releases, "interface change" marked 26 times, an "Updated" fact on 75 of 75 pages (EXECUTED). The 0.12.0 entry's "delete these lines" list is written by hand (READ, *Primer* §4). After `020`: a migration page, "Upgrade to 0.13.0" at `/changelog/0.13.0/upgrade/`, built from the rename table; `kuiper.ts` counts 2 route files (EXECUTED). (d) is met; 3.
- **Carbon:** "Last updated" per page (EXECUTED, `depth.ts`); a deprecations page with "What to use instead" and "Migration" (EXECUTED, fetched); notes generated from commits (READ, *Carbon* §5.1). **Material:** "Differences from M2" on Button (EXECUTED, screenshot); dated "What's new" on Colour (READ, *enterprise* §3.2). **Spectrum:** semver criteria, a diff and a changeset generator (READ, *Spectrum* §3); its "What's new" returns 404 today (EXECUTED). **Atlassian:** a Changelog tab per component (EXECUTED). **Primer:** changesets, a token diff in CI, deprecation pages (READ, *Primer* §4). **Radix:** a releases page with upgrade guides (READ, *developer* §9). **GOV.UK:** a history page per component, notes grouped breaking, recommended, new, fixes, a roadmap and an "upcoming" page (EXECUTED, its sitemap; READ, *GOV.UK* §5).

### Row 12. Design tooling

| | a library | b variables | c kept in step | d tools | Score |
|---|---|---|---|---|---|
| Pluto | – | – | – | – | 0 |
| Carbon | ✓ | ? | ? | ✓ | 2 |
| Material 3 | ✓ | ? | ? | ✓ | 2 |
| Spectrum 2 | ? | ✓ | ? | ✓ | 2 |
| Atlassian | ✓ | ? | ? | ✓ | 2 |
| Primer | ✓ | ✓ | ✓ | ✓ | 4 |
| Radix Themes | community only | – | – | – | 1 |
| GOV.UK | prototype kit only | – | – | – | 1 |

- **Pluto:** 0 mentions of Figma in the site or README (EXECUTED, `pluto.ts`).
- **Carbon:** "Figma kits, tools, templates, and plugins", "Carbon Figma and AI tools" (EXECUTED, fetched). **Material:** the Material Theme Builder; a Figma resource on every component (READ, *Material* §2; EXECUTED, screenshot). **Spectrum:** a Figma exporter and MCP servers (READ, *Spectrum* §3). **Atlassian:** "Figma libraries" and "With AI" in its nav (EXECUTED). **Primer:** Figma libraries, "Contributing to Figma", Figma variables built from the tokens, an LLM guide (EXECUTED, its nav; READ, *Primer* §1).

### Row 13. Reach

| | a platforms | b RTL | c i18n | d support statement | Score |
|---|---|---|---|---|---|
| Pluto | – | – | – | ✓ | 1 |
| Carbon | ✓ | ✓ | ✓ | ? | 3 |
| Material 3 | ✓ | ✓ | ✓ | ? | 3 |
| Spectrum 2 | ✓ | ✓ | ✓ | ? | 3 |
| Atlassian | – | ? | ? | ? | 0 |
| Primer | ✓ | ? | ? | ? | 1 |
| Radix Themes | – | – | – | ? | 0 |
| GOV.UK | ✓ | – | ✓ | ? | 2 |

- **Pluto:** Svelte only; 21 physical-side classes in item files, no RTL test; built-in strings in English; each component page states what is and is not checked (EXECUTED).
- **Carbon:** React, Web Components and more (READ, *Carbon* §3.2); RTL CSS in 29 style files; `translateWithId` in 61 React files (EXECUTED grep). **Material:** Compose, MDC-Android, Flutter, Web; "Bidirectionality & RTL"; "Global writing" (EXECUTED, its sitemap). **Spectrum:** React Spectrum and Spectrum Web Components; "Bi-directionality" and "Internationalization" pages (EXECUTED). **Primer:** React and Rails (READ, *product* §3). **Radix Themes:** React only; 0 RTL rules in its CSS (EXECUTED grep). **GOV.UK:** HTML and Nunjucks for any back end; an `i18n` module used by 6 components; 0 RTL rules (EXECUTED grep).

### Row 14. Governance

| | a process | b status | c deprecation | d breaking rule | e decisions | f feedback | Score |
|---|---|---|---|---|---|---|---|
| Pluto | ✓ | – | ✓ | – | ✓ | ✓ | 3 |
| Carbon | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 4 |
| Material 3 | – | ✓ | ? | – | – | ? | 0 |
| Spectrum 2 | ? | – | ✓ | ✓ | ? | – | 1 |
| Atlassian | ? | ✓ | ✓ | ? | – | ✓ | 2 |
| Primer | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 4 |
| Radix Themes | ✓ | – | ? | ? | – | ✓ | 1 |
| GOV.UK | ✓ | ✓ | ✓ | ✓ | ? | ✓ | 3 |

- **Pluto:** the pipeline in the constitution (§5) and `context/README.md`; 73 decisions, 36 reviews; "Suggest a change on GitHub" (EXECUTED). No status, by the owner's ruling (READ, `decisions.md`, 2026-11-15). After `020`: a deprecation path that names the replacement, `meta.deprecated.replacement` on the `pluto-theme` alias, with the guide and the changelog saying when it goes (READ, `registry.json`; EXECUTED, `kuiper.ts`, `deprecatedItems` 1). (c) is met; 3. "Interface change" is decided per specification, with no written rule (READ, *Carbon* §5.1).
- **Carbon:** statuses, a deprecations page, a versioning table, ADRs, a feedback link (READ, *Carbon* §5; EXECUTED, fetched). **Material:** a status chip per platform (READ, *enterprise* §3.2). **Spectrum:** `replacedBy`, written semver criteria (READ, *Spectrum* §3). **Atlassian:** "Release phases", "Caution" and "Deprecated" lozenges in the tree (EXECUTED), "Was this page helpful?" (READ, *enterprise* §3.4). **Primer:** contribution guides, status page, deprecation pages, changesets, ADRs, "Give feedback" (READ, *Primer* §4, *product* §3). **Radix:** "Report an issue" on every page (EXECUTED, screenshot). **GOV.UK:** contribution criteria, lifecycle statuses, versioning and managing-change docs, a discussion per component (EXECUTED, its sitemap; READ, *GOV.UK* §4–5).

## 5. Gaps: Pluto against the best reference

| # | Dimension | Pluto | Best | Who | Gap | What the best does |
|---|---|---|---|---|---|---|
| 12 | Design tooling | 0 | 4 | Primer | **−4** | Figma library, tokens as Figma variables, a contribution path for the library, an LLM guide. |
| 5 | Tokens | 1 | 4 | Primer | **−3** | DTCG with descriptions and pairing rules in the token, `removed.json` checked in CI, contrast CI, several outputs. |
| 3 | Accessibility evidence | 1 | 3 | Carbon | −2 | Tagged automated checks per state, a generated status page, forced-colours rules in 30 components, manual screen-reader passes. |
| 4 | Theming | 2 | 4 | Material, Primer, Radix | −2 | Either scheme on any subtree; a contrast scheme or a scale. |
| 7 | The part first | 2 | 4 | Material, Radix, GOV.UK | −2 | The specimen at y ≈ 290–330, inside the first phone screen. |
| 13 | Reach | 1 | 3 | Carbon, Material, Spectrum | −2 | Several platforms, RTL styles, translatable strings. |
| 1 | Breadth | 3 | 4 | Spectrum | −1 | 37 of the 40 parts. |
| 2 | Guidance depth | 2 | 3 | Carbon, Material, Spectrum, Primer | −1 | Anatomy, keyboard, described props on the same pages. |
| 10 | Install and adoption | 3 | 4 | five systems | −1 | A designer's way in. |
| 14 | Governance | 3 | 4 | Carbon, Primer | −1 | Statuses and a written breaking-change rule; Kuiper names the replacement since `020`. |
| 11 | Change communication | 3 | 3 | Carbon, Primer, GOV.UK | 0 | Kuiper has a migration guide since `020`; the best also generate notes or a feed. |
| 8 | Page weight and paint | 4 | 4 | GOV.UK | 0 | |
| 9 | Code examples | 3 | 3 | six systems | 0 | Nobody has all six; Pluto lacks a sandbox and controls. |
| 6 | Navigation and search | 4 | 3 | five systems | **+1** | Pluto leads. |

## 6. What would move each Pluto score one step

Each line names the smallest change that moves the row by one, and what is already planned. Constitution §4.2 still holds: a part is added when an app needs it.

1. **Breadth 3 → 4:** 5 more of the 11 missing parts (toast, pagination, combobox, date picker, tag are the commonest). Only by need.
2. **Depth 2 → 3:** one more element on both pages. Prop doc comments, so 80% of rows are described, are already placed after `018` (READ, *synthesis* §1). A keyboard table from data the tests read, and an anatomy figure, would reach 4.
3. **Accessibility evidence 1 → 2:** two more criteria. Planned for 0.13.0: the status generated from the test report (d) and a forced-colours pass over items (e) (READ, `handoff.md`, "Next"). Six criteria make 3: add the `019` VoiceOver run, recorded (h), and hover, pressed, disabled and invalid states driven in the axe pass (b).
4. **Theming 2 → 3:** scoped schemes both ways, option B of *scoped* §6 (`light-dark()` and `data-scheme`). The high-contrast scheme after it makes 4.
5. **Tokens 1 → 2:** role words moved from `words.ts` into the token file (c). Add the removed-names record (f) for 3 (*Primer* idea 1, *Spectrum* idea 2).
6. **Navigation and search 4:** hold. Keep `nav.spec.ts` and `search.spec.ts` guarding it.
7. **The part first 2 → 3:** the stage above y = 500 at 1440 and inside the phone's first screen: about 80 px to find. Put the frame's title and the Light | Dark switch on one row, or move the first frame's description below its stage.
8. **Weight 4:** hold under `perf.spec.ts`'s budgets.
9. **Code examples 3 → 4:** both missing criteria: an "Open in StackBlitz" SvelteKit link (d) and generated controls for items whose props are unions and booleans (e) (*enterprise* gap 11, *Radix* idea 1).
10. **Install 3 → 4:** a designer path: a design start page, or a design-tool library (row 12 moves with it).
11. **Change communication 3 → 4:** met 3 with `020`'s guide. Two more criteria make 4: generated notes or a feed (e), and a public "upcoming" list (f); both are planned in `049`.
12. **Design tooling 0 → 1:** tokens exported as design-tool variables (b) gives 1; an official component library gives 2. Both are the owner's call (§7).
13. **Reach 1 → 2:** right-to-left: convert the 21 physical-side classes in item files to logical ones and add one RTL test (b). Translatable built-in strings (c) make 3.
14. **Governance, held at 3:** met 3 with `020`'s `meta.deprecated` naming the replacement (c). A written interface-change rule (d, `048`) makes five criteria, still 3; 4 needs a status per item (b), which the owner ruled out on 2026-11-15. The row is at its 1.0 target.

## 7. Questions this raises for the owner

These are not decisions. They are recorded here so the design lead can ask them, with options, when a specification needs them.

- **Is a design-tool library in scope?** It is the largest gap, and no constitutional rule asks for one. Options: (a) tokens as design variables only, generated from the token file, so tooling never becomes a second source (recommended, INFERRED: one script, and §4.3 holds); (b) a full component library; (c) none, and accept the 0.
- **Is reach in scope?** Pluto's apps are Svelte (constitution §1), so (a) of row 13 may never apply. Options: (a) right-to-left and translatable strings when an app names the need, and logical classes in new item code meanwhile (recommended, INFERRED: constitution §4.2, and the cheap half costs nothing later); (b) both now; (c) neither, and accept the 1.

## 8. How to re-run

Run after every specification lands, and before a tag. About 30 minutes, most of it the throttled loads. Nothing here is part of `bun run test`, and no script writes to the repository.

1. **Build the site at the commit to score.** `bun run build`. The scripts serve `build/` and read its twins; each prints the build's time, so check it is after the commit.
2. **Kuiper's evidence:** `bun scripts/bench/kuiper.ts --rev <commit> --json <out>/kuiper.json`. Reads source with `git show`, so it scores the commit even with a dirty tree; at a commit before `020` it reads `tokens/pluto.tokens.json`. About 5 s. (Before `020`, this script was `pluto.ts`.)
3. **Breadth:** `bun scripts/bench/breadth.ts --rev <commit> --json <out>/breadth.json`. Needs the network. Read each system's `miss` list before scoring: slug matching is by pattern. About 1 minute.
4. **Weight, paint, positions, chrome:** `bun scripts/bench/site.ts --runs 3 --shots <out>/shots --json <out>/site.json`. About 15 minutes. `--only kuiper` re-measures Kuiper alone; `--layout-only` skips the throttled loads. Look at each `*-1440.png` and `*-390.png`: a cookie wall or a moved page shows there first.
5. **Depth:** `bun scripts/bench/depth.ts --json <out>/depth.json`. About 8 minutes. A mark that surprises gets a look at the page (Radix's `Dialog.Content` is one).
6. **Score.** Scripted rows (1, 2, 7, 8) follow their anchors. For the checklist rows, re-mark Kuiper from `kuiper.json` and the changed specification. Re-verify the references' marks when a newer memo covers them, or every fourth run; turn a `?` into ✓ or – only with a source.
7. **Write it down.** Replace the table in "In short", §4's changed cells and §5–6. Add a row to §8's log. If a rubric criterion or anchor changes, say so in the log row, and re-score every system on that row.

Use any `<out>` folder outside the repository, such as the session scratchpad. When a reference URL moves, fix it in `scripts/bench/targets.ts` and note it in the log.

**The scripts** (all new; bun and the repository's Playwright; no new dependency):

- `scripts/bench/targets.ts`: the eight systems, their Button, overlay and index URLs, the specimen selectors, the 40 reference parts.
- `scripts/bench/serve.ts`: serves `build/` gzipped; argument parsing.
- `scripts/bench/site.ts`: rows 6 (tree links), 7 and 8.
- `scripts/bench/depth.ts`: row 2.
- `scripts/bench/breadth.ts`: row 1.
- `scripts/bench/kuiper.ts`: Kuiper's marks for rows 3, 4, 5, 10, 11, 12, 13 and 14 (`pluto.ts` before `020`).

### Run log

| Date | Pluto at | Build | By | Pluto scores, rows 1–14 | Total | Notes |
|---|---|---|---|---|---|---|
| 2026-11-15 | `ea1f9bd` (0.12.0, after `018`) | 2026-11-15 13:53, working tree with `019` in progress | a researcher | 3 2 1 2 1 4 2 4 3 3 2 0 1 2 | 30 | First run. References live on 2026-11-15. Carbon's URLs now sit under `/building-blocks/core/components/`; Spectrum 2's under `/web/rsp/components/`. |
| 2026-11-15 | `020`'s landing tree, on `release/0.13.0` from `f9e1c1a`, before its commit | 2026-11-15, the same tree | a builder | 3 2 1 2 1 4 2 4 3 3 3 0 1 3 | 32 | After `020`. `kuiper.ts` (working tree): `migrationPages` 0 → 2 (the guide's two route files), so row 11 (d) is met, 2 → 3; `deprecatedItems` 0 → 1 (`pluto-theme`, naming `kuiper-theme`), so row 14 (c) is met, 2 → 3. `breadth.items` reads 76: the count includes the alias entry; row 1 reads `breadth.ts`, which matches parts, and holds. `site.ts --only kuiper`: Button 381 kB, LCP 992 ms, the part at 572 (1440) and 661 (390), 76 nav links, search and theme present; rows 6, 7 and 8 hold. Tokens and every other count as at `ea1f9bd`. References not re-checked. |
| 2026-11-15 | `6c00a12` (`020`, committed on its build branch) | the same tree as the row above | a builder | 3 2 1 2 1 4 2 4 3 3 3 0 1 3 | 32 | `kuiper.ts --rev 6c00a12`: `migrationPages` 2, `deprecatedItems` 1, 12 releases, 33 interface marks, 9 versioned registries; tokens 48 primitives, 61 roles, 61 described, 129 contrast rows. The scores of the row above stand. |
| 2026-11-15 | `9395b46` (`027a`, committed on its build branch, on `release/0.13.0` from `0372323`) | 2026-11-16 03:21 UTC, at that commit | a builder | 3 2 1 2 1 4 2 4 3 3 3 0 1 3 | 32 | After `027a` (link, button group, progress). `breadth.ts --only kuiper --rev 9395b46`: 68 documented, **31 of 40** (29 before; `link` and `button group` hit), score 3 held (34 or more is 4); with `026`'s toast it would read 32, and `027b` brings 35. `kuiper.ts --rev 9395b46`: 79 entries, 60 `registry:ui`; tokens, theming and every other count as at `6c00a12`. `site.ts --only kuiper`: Button 383 kB (was 381), LCP 1,020 ms, the part at 572 (1440) and 661 (390), 79 nav links, search and theme present; rows 6, 7 and 8 hold. Every page grew by about 0.9 kB, of which 0.67 kB is `registry.json` in the shared chunk; the Button page's 382 kB budget was already exceeded at `0372323` (382.5 kB), see `027`'s landing notes. `depth.ts` not run: it reads the Button and Dialog pages, which `027a` did not change. References not re-checked. |

## 9. Limits

- **Presence, not quality.** A checklist cannot see that GOV.UK's reasons are better written than a longer page's. The words column in row 2 is the only hint.
- **Two components** stand for the whole of rows 2, 7 and 8.
- **Unverified counts as absent.** Atlassian's and Spectrum's accessibility and reach scores are floors. Clone their code before trusting the gap.
- **Live sites change.** The references were read on one day. Re-verify before quoting a reference's score.
- **One browser.** Everything ran in Chromium.
- **A total hides weight.** Pluto's apps are Svelte and owned as source, so rows 12 and 13 may matter less to them than rows 3 and 5 (INFERRED).

No code was copied from prior art. Nothing in the repository was changed except this file and the new `scripts/bench/` files.
