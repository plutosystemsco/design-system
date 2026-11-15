# The component page standard

- **Status:** complete
- **Date:** 2026-11-15
- **Author:** a researcher, at the design lead's request. One of the three research tracks in `decisions.md`, "A roadmap toward the reference systems" (2026-11-15).
- **Question:** What should every Kuiper component page contain so its guidance matches the best reference systems? How should that content be stored so it stays true and testable in a registry-based system?
- **What would answer it:** Kuiper's page template and its 75 pages, measured. Button and one complex page in six reference systems, read section by section, along with the machinery each uses to keep its pages accurate.
- **What it blocks:** the "component depth" specification deferred by `research/2026-11-15-site-polish-synthesis.md` §2, and the prop doc comments that `handoff.md` places in 0.13.0.

## How to read this memo

- **READ:** a file or page says so, read on 2026-11-15. Prior-art paths are relative to `prior_art/`, at the commits in `prior_art/README.md`. Kuiper paths are relative to the repository root.
- **EXECUTED:** we ran it on 2026-11-15, against the working tree and the live site at `localhost:5199`. Live reference pages were rendered in headless Chromium through the repository's Playwright, using a scratch script outside the repository.
- **INFERRED:** our reasoning.
- Nothing was copied from prior art. GOV.UK's text is Crown copyright (OGL v3), and Polaris's licence restricts use, so only structure was studied. Polaris is not used here.

Terms:

- A **section** is one `h2` block of a page.
- A **pair** is a do and a don't shown side by side, each with a one-line caption.
- An **anatomy figure** is a picture of a component with its parts numbered and named.
- A **slot** is a `data-slot` attribute that marks a part in an item's markup.

## In short

- **Kuiper generates more of its page than any reference does, but writes less.** Its API, files, related items and changes come from source. Its guidance is about 40 words of "when", three text dos, three text don'ts and a few accessibility bullets per page. No page has an anatomy figure, a pictured pair, a keyboard table, content rules or test steps.
- **The references agree on one order:** a live example, then when to use, anatomy, pictured pairs, content rules, props, keyboard, and accessibility split into "what we provide" and "what you must do".
- **The best accuracy devices bind a section to something that runs.** Carbon reads its accessibility status from the Playwright report. Spectrum builds its props table from type data. Primer validates `docs.json` against a schema and checks that each named story exists. No reference ties its anatomy, its keyboard table or its don'ts to a test.
- **Kuiper can go further, because examples are files and parts carry slots.** Anatomy can be bound to slots. Keyboard rows can be data that a test drives. Each don't can declare the fault it shows, and a test can prove it is there.
- **Pilot:** `button`, `dialog`, `field`, `dropdown-menu` and `error-summary`. That is about 45 hours of writing on top of one platform specification. The pilot moves the guidance-depth average only from about 30% to about 35%. The full rollout is what closes the gap.

## 1. Kuiper's page today

**Order** (READ, `src/lib/site/page/component.svelte`, `SECTIONS`; EXECUTED, the `h2`s of `/components/button/`): the header (title, description, facts: Since, Updated, Modes, Based on), Examples, Install, Usage, API, Accessibility, Files you own, Related.

**What is generated** (READ, `component-data.server.ts`; `015` decision 17): examples' shown source, the API tables (parsed from source by `api.server.ts`), files, related items, packages, and "Updated" from `CHANGELOG.md`.

**What is written:** each page passes four snippets, `when`, `dos`, `donts` and `accessibility`, to the template (READ, `usage.svelte`, the Button and Dialog pages).

**Measured over all 75 pages** (EXECUTED, a scan of `src/routes/(site)/components/*/+page.svelte`):

- "When" runs from 17 to 389 words. The median is about 45.
- Dos and don'ts are 2 to 4 text items each. None is pictured.
- Accessibility runs from 2 to 10 bullets. All are written by hand, and none is tied to a test (READ, `prior-art-govuk.md` §2).
- 58 items have example files. 17 blocks and stage items use a preview instead.
- **Prop descriptions:** 262 of 1,062 API rows have a doc comment, about 25%. Only 2 of the 70 items with rows are fully described. Button has 1 of 10, Dialog 2 of 23, Field 11 of 54, Tabs 0 of 10 (EXECUTED, `apiTables()` over `registry.json`).
- **Keyboard behaviour lives only in tests.** It is in hand-coded tests in `tests/e2e/keyboard.spec.ts`, such as "Enter on the dialog trigger opens it with focus on the input; Escape returns focus" (READ, line 850). The page restates it in prose.
- **Every multi-part item marks its parts with slots,** such as `dialog-title`, `dialog-footer` and `field-error` (EXECUTED, a grep over `src/lib/registry/ui/`).
- **019 adds a VoiceOver script** that drives the error summary through `@guidepup/guidepup` and checks what is spoken. The owner runs it; it is outside `bun run test` (READ, `scripts/a11y/voiceover-error-summary.ts`, untracked, in progress).

## 2. Six reference pages

### Sections, in each system's order

| | Carbon (Button, Modal) | Atlassian (Button, Modal dialog, Select) | Spectrum 2 (Button, Combo box) | GOV.UK (Button, Error summary, Date input) | Primer (Button) | Material 3 (Dialogs) |
|---|---|---|---|---|---|---|
| Shape | 4 tabs: Usage, Style, Code, Accessibility | Tabs: Examples, Code, Usage, Changelog; Select adds Testing and Migration | One scroll | One scroll | Tabs: Overview, Guidelines, Accessibility; a React tab | Tabs: Overview, Specs, Guidelines, Accessibility |
| Live example first | Yes, a live demo with an a11y status card | Yes, the Examples tab | Yes, a playground | Yes, a resizable frame | Yes, the React tab | No: pictures only |
| When / when not | Both headings | Usage intro, then Related | Usage guidelines, such as "Combo box, picker, or radio buttons?" | Fixed headings on all 37 pages | Usage | Usage, and a "Similar components" table |
| Anatomy | Numbered figure, plus a list | "Parts" list | Its own section, in data | None | Labelled figure | Numbered figure per variant |
| Pictured pairs | Do/Don't images with captions | Do/Don't with captions | Data blocks (`do-dont`) | None: prose | Do/Don't images with captions | Do, Don't and a third tier, **Caution** |
| States | Style tab: a token per state | — | Table: each state "Supported" or "Not supported" | — | Options section | Specs tab |
| Content rules | Content section | "Content guidelines" | "Content standards" | Wording in "How it works"; error templates per failure | Inside best practices | Do/Don't on headline text |
| Props | Storybook, outside the page | Generated from TypeScript; shows "No description." when empty | Generated from `ComboBox.json` | Generated from the component's YAML | Generated from `docs.json` | Not on the guidelines site |
| Keyboard | Prose and a figure | Prose ("Setting focus") | Table: Key, Interaction (8 rows on Combo box) | — | — | Table: Keys, Actions |
| Accessibility split | "What Carbon provides", "Design recommendations", "Development considerations" | Prose topics | WCAG 2.2 table: requirement, criterion, level, compliance | Known issues on some pages | "Built-in features", "Implementation requirements", "How to test" (integration and component tests), "Known issues" | Use cases, interaction, initial focus, keyboard, labelling |
| Status | `A11yStatus`, from the test report | A lozenge in the navigation | "Code available" | Trial tag | Status and `a11yReviewed` labels | Availability table, with a status per platform |
| Changes and feedback | Last updated; feedback | Changelog tab; "Was this page helpful?" | — | Recent changes; "Help improve this page" | — | "Differences from M2" |

Sources: Carbon, READ, `carbon-design-system-carbon-website/src/pages/components/{button,modal}/*.mdx`. Atlassian, EXECUTED, `atlassian.design/components/{button,modal-dialog,select}/{usage,code,testing}`. Spectrum, EXECUTED, `spectrum.adobe.com/web/rsp/components/{button,combo-box}` and their fragments; READ, `adobe-spectrum-design-data/packages/design-data/components/{button,combo-box}.json`. GOV.UK, READ, `alphagov-govuk-design-system/src/components/{button,error-summary,date-input}/index.md`; the heading count is `prior-art-govuk.md` §1. Primer, READ, `primer-design/content/components/button.mdx`, `src/layouts/react-component-layout.tsx`. Material, EXECUTED, `m3.material.io/components/dialogs/{guidelines,accessibility}`; READ, `2026-11-15-design-sites/material-dialog-full-1440-light.png`.

### How each keeps its page true

- **Carbon** imports `@carbon/react`'s Playwright JSON report at build time. For each component it finds the suite and grades three tags (`avt-default-state`, `avt-advanced-states`, `avt-keyboard-nav`) as tested, partial or not tested. Screen-reader status is kept by hand as `"manual"` in `src/data/components.json` (READ, `src/components/A11yStatus/A11yStatus.js:17-18`, `:84-160`).
- **Spectrum** builds its page from fragments. The options table is read from `/deps/rsp/data/ComboBox.json`: 53 props with type, values, default and description, and a `"stable"` status (EXECUTED). The design data adds anatomy with an `anatomyReview` record, states with triggers, constraints between options, and a role, keyboard intents and WCAG criteria (READ, `button.json`). The keyboard and WCAG tables themselves are written fragments (EXECUTED).
- **Primer** keeps a `*.docs.json` per component: status, an `a11yReviewed` date, stories and props. `script/components-json/build.ts` validates it against a schema, lints its Markdown and fails on a named story that is not exported. It does **not** check props against the TypeScript types, so they can drift (READ, `github.com/primer/react`, `Button.docs.json` and `build.ts`, via fetch).
- **GOV.UK** takes options from the YAML its macro tests use, scans every example with axe (436 are hidden, for tests only), and drives "Recent changes" from a dated `changelog.yml` (READ, `prior-art-govuk.md` §2 and §4; `error-summary/changelog.yml`).
- **Material Web** stamps each doc with a freshness owner and a review date. A Lit analyzer writes its API tables between markers (READ, `docs/components/button.md:14-17`; `prior-art-material.md` §4).
- **Atlassian** generates props from TypeScript, and an empty description prints "No description." (EXECUTED, the Select code tab). That is the tell that Kuiper's `018` decision 7 hides.

INFERRED:

- No reference binds anatomy, keyboard rows, pairs or test steps to a check.
- Kuiper's parsed-from-source API already beats Primer's hand-kept props. The same move, structured data that a test also reads, extends to every section.

## 3. The standard

### Sections and order

The header and Examples stay first. `018` put the first example above the fold, and every reference opens on the component. The rest follows the references' order. Anatomy names the parts before the API tables describe them.

| # | Section | Required for | Written or generated | Kept true by (INFERRED) |
|---|---|---|---|---|
| 0 | Header: description, facts, accessibility status line | all | generated: registry, changelog, test report | existing tests; the status from the report, below |
| 1 | Examples | all with a view | written files, shown as run | existing `examples.test.ts`, `frames.spec.ts` |
| 2 | Install | all | generated | existing |
| 3 | **Usage:** when, when not (naming the alternative item, linked), then 2–4 **pairs** as live example files with captions; an optional **Caution** tier | all `ui` and blocks | written | unit: at least 2 pairs; each `do-*`/`dont-*` file has `meta.kind`, a `pair` id and a caption of 20 words or fewer; "when not" links an item page. e2e: each do passes axe in both themes; each don't **declares the fault it shows** (`meta.breaks: "button-name"`, or a visible fault named in words), and axe must report exactly that rule |
| 4 | **Content rules:** labels, errors and empty text, as text pairs; error wordings per failure on form items | items that hold user-facing words (button, field, dialog, alert, error-summary, empty, input…) | written, as data | unit: example strings in sentence case, with none of the voice's banned words (a list kept beside R23) |
| 5 | **Anatomy:** a live specimen with numbered callouts placed on each part's slot box; a list of parts with name, slot, whether required, and a sentence | items with 2 or more slots or exported parts | written as data; drawn by measuring | e2e: every part's slot is found and its callout sits inside the box. Unit: every slot in the item's source is a listed part or marked internal; each part that is an export matches an API table's `part` |
| 6 | API, every row described | all with rows | generated from **doc comments in item source** | unit: an item on the "described" list has 0 empty rows. The list grows to all 70. `registry-comments.test.ts` already bars internal citations in shipped comments |
| 7 | **Keyboard:** a table of key, where focus is, and what happens | interactive items | written once **as data** (`keys`, `from`: a role and name in the fixture, `expect`: focus, open, close, attribute or value) | e2e: one generic driver walks every row on the item's keyboard fixture. A row too complex for the driver names the test that covers it, and a unit check confirms that test's title exists |
| 8 | **Accessibility:** "What Kuiper provides" (generated from the keyboard data, roles and the status); "Your part" (written: what an app must still do); "Known gaps" (written, optional) | all | mixed | the status block fails the build on any failing check, per the owner (2026-11-15) |
| 9 | **Test it:** "Kuiper checks" (generated: the tagged suites that ran) and "Check in your app" (written steps using `getByRole` locators, and what a screen reader should say) | interactive items | mixed | unit: each step's role and name resolve in the item's fixture. Where a guidepup script exists, its expected phrases are the same data |
| 10 | Files you own | all | generated | existing |
| 11 | Related | all | generated | existing |

**Reduced set:** fonts, `lib`, hooks and the theme keep 0–2, 6 and 8–11. Their "Usage" is when and when not, without pairs.

### Where the content lives

- **Props:** doc comments in the item's own source. They ship to the app, which owns them and sees them in editor hovers. This is Spectrum's and Material's "types as source", minus Primer's drift.
  - Adding them changes `static/r/` for every item. Each touched item needs the changelog line "Doc comments added; no interface change", as `015` decision 26 did for reworded comments.
- **Structured guidance:** one typed module per item, `src/lib/site/guidance/<item>.ts`. It exports `anatomy`, `keyboard`, `content`, `yourPart`, `testIt` and `knownGaps`, checked by a TypeScript type.
  - Primer's schema-validated `docs.json` is the model.
  - Site-side, because it is guidance about the item, not code an app runs. It stays out of `registry.json` and `static/r/`.
  - The page, the Markdown twin, `llms.txt` and the tests all read it.
- **Pairs:** example files beside the others, `src/lib/site/examples/<item>/do-<pair>.svelte` and `dont-<pair>.svelte`. Their `meta` adds `kind`, `pair`, `caption` and, for a don't, `breaks`.
  - The code shown is the code run (`015` decision 13). A don't is proven wrong, not just said to be.
  - A don't that breaks accessibility renders `inert`. Its caption carries the meaning.
- **When, and the captions' prose:** stay as snippets on the item page. They are prose, and `015` decision 17 already governs who writes them.
- **Accessibility status:** a committed report of the last full run, tagged by item and check. The 0.13.0 status specification must solve the build-before-test ordering (synthesis §4). This standard only reserves its places, in the header and in section 8.

## 4. Pilot

### The five, and why

1. **`button`.** Every reference has a Button page, so it is the like-for-like benchmark. It has the most-repeated content rules, 1 of 10 props described, and 3 keyboard rows.
2. **`dialog`.** The complex page every reference documents. It has six slots (title, header, footer, overlay, content, close), which test the anatomy approach. It has 2 of 23 props described.
3. **`field`.** The form item. It carries content rules and GOV.UK-style error wordings per failure (`prior-art-govuk.md` §1). At 54 rows (11 described), it is the heaviest prop load.
4. **`dropdown-menu`.** The richest key map: arrows, Home/End, typeahead, Escape, Tab. This proves the keyboard data and its generic driver. It has 3 of 45 props described.
5. **`error-summary`.** 019 has just given it an e2e spec and a VoiceOver script. It is the one item where "Test it" can include spoken expectations that a script checks.

Together they exercise every section, including both "required when" cases (INFERRED).

### Cost (INFERRED, from the measured gaps)

| Item | Pairs | Anatomy parts | Props to describe | Keyboard rows | Content rules | Hours |
|---|---|---|---|---|---|---|
| button | 3 | 3 | 9 | 3 | 4 | 5 |
| dialog | 3 | 6 | 21 | 5 | 3 | 10 |
| field | 3 | 8 | 43 | 2 | 6 + error wordings | 12 |
| dropdown-menu | 2 | 6 | 42 | 8 | 2 | 11 |
| error-summary | 2 | 4 | 2 | 3 | 4 | 7 |

- **About 45 hours of writing,** plus the review against R23 and R24.
- **Separately, one platform specification (M to L):** the guidance type and modules, pairs in `usage.svelte`, the anatomy figure, the keyboard table and driver, the "Test it" and "Your part" blocks, and the tests above.
- **The rest of the catalogue:** about 70 items at roughly 4 hours on average. Blocks, libraries and fonts take the reduced set. That is about 280 hours, best spread by group over 0.13.0 onward.

### Guidance depth on the scorecard

The benchmark scorecard is a parallel track and not yet written. This memo proposes the dimension's measure:

- **Each page scores the share of its applicable sections that pass their check:** sections 1, 3–9, and the status line in 0.
- **The measure is a script over the guidance modules and the API tables,** so a re-run after each specification is mechanical, as `decisions.md` asks.

Estimated movement (INFERRED, applying that rubric to the counts in §1):

- **Today:** about 3 of 10 sections pass (examples, when, the Updated fact). Button's 1 of 10 described props fails section 6. The average is **about 30%**. The reference Button and Dialog pages read in §2 hold 6 to 9 of the 10 sections, though none ties them to checks.
- **After the pilot:** 5 pages at 10 of 10. The average is (70 × 3 + 5 × 10) / 75, **about 35%**. The pilot proves the machinery; it barely moves the number.
- **After the doc comments alone** (0.13.0, already planned): section 6 passes everywhere, about 40%.
- **After the full rollout and the status:** about 90%. The rest is "required when" sections that genuinely do not apply.

## 5. Questions for the owner

1. **Where does structured guidance live?**
   - **(a) Recommended:** a typed module per item under `src/lib/site/guidance/`. It is site-side, and apps never receive it.
   - (b) In `registry.json`'s `meta`. It then ships in every item's JSON and changes `static/r/`.
   - (c) Beside the item's source, as a file that installs into apps.
2. **May a don't show a real accessibility fault?**
   - **(a) Recommended:** yes. It is rendered `inert`, with the axe rule it breaks declared and asserted, so the fault is proven.
   - (b) No. Such don'ts become static pictures.
   - (c) No. Such don'ts stay as text.
3. **The pilot set.**
   - **(a) Recommended:** `button`, `dialog`, `field`, `dropdown-menu`, `error-summary`.
   - (b) `button`, `input`, `field`, `dialog`, `tabs`, the five simplest form and overlay items.
