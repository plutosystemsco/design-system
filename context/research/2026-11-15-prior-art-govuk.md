# Prior art: the GOV.UK Design System

- **Status:** complete
- **Date:** 2026-11-15
- **Author:** a researcher, at the design lead's request
- **Question:** What can Pluto learn from the GOV.UK Design System about writing, accessibility, patterns, its site and its governance?
- **What would answer it:** a reading of GOV.UK's guidance site and component library, set beside Pluto's site and registry.
- **What it blocks:** nothing. It feeds whichever specification takes up an idea below.

## How to read this memo

- **READ:** a source says so. Sources were read on 2026-11-15, cited by path.
- **INFERRED:** our reasoning.

Two clones, both recorded in `context/prior_art/README.md`:

- `DS/` is `context/prior_art/alphagov-govuk-design-system/`, the guidance site, at `5f31aa7`.
- `FE/` is `context/prior_art/alphagov-govuk-frontend/`, the component library, at `a11bd33`. `FE/components/` is short for `FE/packages/govuk-frontend/src/govuk/components/`.

**Licence.** The code is MIT (READ, `DS/LICENSE`, `FE/LICENSE.txt`). The guidance is Crown copyright. The site uses the library's default footer (READ, `DS/views/partials/_footer.njk`), which puts content under the Open Government Licence v3.0 "except where otherwise stated" (READ, `FE/components/footer/template.njk` lines 58–98). This memo quotes at most a phrase and copies no code.

**Terms.** A **component** is one reusable part, such as a button. A **pattern** is GOV.UK's word for guidance on a whole task or page type, such as asking for a date. **axe** is an automated accessibility checker. **Assistive technology** (AT) is software such as a screen reader (JAWS, NVDA) or speech control (Dragon).

## Summary

- **GOV.UK's component pages hold reasons, not only rules.** Each has fixed headings: when to use, when not to use, how it works. Most add research with links to evidence, and some list known gaps. Pluto's Usage has the first and a Do and Don't list, but no place for evidence or gaps.
- **Its error guidance is the deepest part, and Pluto can use it now.** Each form part has fixed error wordings per failure, and there is a short list of words never to use. Its error summary's history records two fixes Pluto's lacks: `role="alert"` moved off the root for JAWS, and links that bring the label into view, not only the field.
- **Accessibility is tested by machine everywhere and written down per component, a little.** axe runs over every example of all 39 components. Eight carry written criteria. AT findings sit in code comments and page prose, in no single record. Pluto's axe coverage of its site is already wider than GOV.UK's.
- **Patterns are a separate section, mostly guidance.** 30 patterns in three groups: "Ask users for…", "Help users to…", and page types. Pluto's blocks are its code patterns. It lacks one written guide that ties the form error flow together.
- **Governance is built for many outside teams.** Two statuses, public contribution criteria, an "upcoming" list, and release notes split into breaking, recommended, new and fixes. Pluto keeps its four roles and one changelog, but can borrow the release-note split and a search alias field cheaply.

## 1. Writing

**What GOV.UK does.**

- **Fixed headings.** Of 37 component pages, all 37 have "When to use this component" and "How it works". 25 have "When not to use this component", 26 have "Research on this component", 7 have "Known issues and gaps" (READ, a count of headings over `DS/src/components/*/index.md`).
- **The words are named.** The button page lists the label to use at each step of a service, in sentence case, as the action (READ, `DS/src/components/button/index.md`, "How it works").
- **The reason comes with the rule.** The same page explains why people double click (habit, slow connections, tremors) and cites a real case before offering the setting that ignores a second click (READ, same file).
- **Research is cited inline, to a public discussion.** One service saw people type month names into the date input, accepted them, and saw errors fall (READ, `DS/src/components/date-input/index.md`, "Research on this component").
- **Gaps are stated, and help is asked for.** The task list names the assumptions it has not tested (READ, `DS/src/components/task-list/index.md`). The accordion says what it does not know about people who navigate by lists of elements (READ, `DS/src/components/accordion/index.md`).
- **Error messages have a standard.** Say what happened and how to fix it. No jargon, no blame words, no "please", "sorry", "valid" or "invalid", no jokes (READ, `DS/src/components/error-message/index.md`, "Be clear and concise"). No generic messages such as "This field is required" ("Be specific"). Twelve components and patterns carry **error message templates** ("Use error message templates"). The date input gives one wording each for nothing entered, incomplete, impossible and in the future (READ, `DS/src/components/date-input/index.md`, "Error messages").

**Pluto's state.**

- Usage holds a when paragraph, three Dos and three Don'ts (READ, `src/routes/(site)/components/button/+page.svelte`, `.../error-summary/+page.svelte`; `src/lib/site/page/component.svelte` lines 14–17, 177–201). Don'ts often name the alternative ("Use a link"), so "when not to use" lives there in part (READ, the button page).
- The voice's five rules are on the Brand door; "Errors direct" is one (READ, `src/routes/(site)/brand/voice/+page.svelte` lines 6–33; `decisions.md`, R23 and R24).
- The field page gives one error example, "Enter a project name." (READ, `src/routes/(site)/components/field/+page.svelte`). No form item gives wordings per failure (INFERRED, from the form pages).
- No page has a place for evidence or gaps. A page may not cite a specification, decision or review (READ, `specifications/015-the-design-site.md` decision 17). Known limits are kept in `context/` (READ, `decisions.md`, "After the `005` change review", the log's button).

## 2. Accessibility

**What GOV.UK does.**

- **axe on every example.** All 39 components have an `accessibility.puppeteer.test.mjs` that renders each example and expects no violations (READ, `FE/components/error-summary/accessibility.puppeteer.test.mjs`; 39 such files). 436 examples are marked hidden: they exist only for tests (READ, `hidden: true` over `FE/components/*/*.yaml`).
- **Written criteria, but few.** A component's YAML may hold `accessibilityCriteria`; eight of 39 do. Radios and checkboxes state four behaviours for revealed content and link a known issue (READ, `FE/components/radios/radios.yaml`).
- **A contributor checklist.** A component works by keyboard, voice, touch, mouse and each screen reader mode. It works when scripts fail, when styles fail, with changed colours and at 400% zoom (READ, `FE/docs/contributing/test-components-using-accessibility-acceptance-criteria.md`). Findings go in a spreadsheet kept outside the repository (READ, same file).
- **AT findings are scattered.** NVDA's behaviour is a comment in a script (READ, `FE/components/error-summary/error-summary.mjs` line 56). JAWS and Dragon gaps are prose on the character count, accordion and file upload pages (READ, those `DS/src/components/*/index.md`).
- **The error summary's history is a list of AT fixes.** Links scroll the label or legend into view, not the input, so the question is not cut off (READ, `DS/src/components/error-summary/changelog.yml`, 2.4.0). `role="alert"` moved from the root to a nested element, because JAWS did not read the whole summary (same file, 4.4.0). Tests check that a link focuses the input, scrolls the label to the top and adds no hash to the URL (READ, `FE/components/error-summary/error-summary.puppeteer.test.js` lines 182–216).
- **The validation pattern ties the flow together.** Show the page again with answers kept. Prefix the title with "Error: ". Show the summary and move focus to it. Show each inline message. Validate on submit, not on leaving a field (READ, `DS/src/patterns/validation/index.md`).
- **The site's own audit is narrow.** It checks one page per layout, five in all, and excludes example frames (READ, `DS/__tests__/accessibility-audit.test.js` lines 11–59).

**Pluto's state.**

- axe runs on every site page at 360, 768 and 1280 px, and keyboard walks cover the site and 34 fixtures (READ, 015 decision 22; `tests/e2e/axe.spec.ts` line 36). The frameless example views are scanned for the first example of five items (READ, `tests/e2e/axe.spec.ts` lines 68–87). That is wider than GOV.UK's site audit (INFERRED).
- Screen readers, Firefox and Safari are not checked (READ, 015 decision 22).
- Each page's Accessibility list is written by hand (READ, 015 decision 17). Nothing ties a bullet to a test (INFERRED).
- The error summary follows GOV.UK's flow: a "There is a problem" heading, focus after a failed submit, the "Error: " title prefix (READ, `src/routes/(site)/components/error-summary/+page.svelte`). Two differences:
  - `role="alert"` sits on the root (READ, `src/lib/registry/ui/error-summary/error-summary.svelte` line 57), where GOV.UK moved it from.
  - A link calls `field.focus()` (READ, same file, `focusField`). The browser scrolls the field into view, which can leave its label above the viewport or under a sticky bar (INFERRED).

## 3. Patterns versus components

**What GOV.UK does.**

- Six sections: Get started, Styles, Components, Patterns, Community, Accessibility (READ, `DS/config/navigation.js` lines 10–31).
- Patterns are best practice for tasks and page types, built from components (READ, `DS/src/patterns/index.md`). 30 are grouped: 10 "Ask users for…", 12 "Help users to…", 8 "Pages" (READ, `theme:` over `DS/src/patterns/*/index.md`).
- A pattern page has a component page's shape. Names covers single or split fields, autocomplete, no spellcheck, no titles, and its errors (READ, `DS/src/patterns/names/index.md`). Addresses weighs a lookup, several inputs and a textarea, each with its own when and when not (READ, `DS/src/patterns/addresses/index.md`).

**Pluto's state.**

- Four doors; no Patterns door (READ, 015 decision 1).
- Eight blocks are Pluto's code patterns: sign-in, sign-up, settings, page states and others (READ, `registry.json`, group `blocks`).
- The form flow is spread across the field, error summary and input pages and the sign-in block. Nothing gathers it (INFERRED).
- A component is added when an app needs it (READ, `constitution.md` §4.2). The same rule would bind a pattern (INFERRED).

## 4. The site

**What GOV.UK does.**

- **Examples are files, shown in a resizable iframe**, with a link to open each in a new tab. The HTML and Nunjucks tabs show one file, as markup and as the macro call (READ, `DS/views/macros/_example.njk`).
- **Options are generated** from each component's YAML into a table (READ, `DS/src/components/error-summary/nunjucks.md`).
- **Search is Lunr**, a small client-side search library, over a prebuilt index. Titles are boosted by 100 and **aliases** by 10, and the alias that matched is shown under the result (READ, `DS/lib/metalsmith-lunr-index/index.js` lines 72–73; `DS/src/javascripts/components/search.mjs` lines 210–229). Aliases are the other names people search for: "palette" for colour, "margin, padding" for spacing, "2FA, MFA" for security codes (READ, `aliases:` over `DS/src`).
- **A build check fails on duplicate page titles**, for AT users who move by title (READ, `DS/lib/metalsmith-title-checker/index.js` lines 1–4).
- **Each component and pattern page ends with "Help improve this…"**: its GitHub discussion, an ask for research, and a link to edit its source (READ, `DS/views/partials/_contact-panel.njk`). 79 pages have a discussion (READ, `discussionId` over `DS/src`).
- **Each page shows its five most recent changes**, from a per-component `changelog.yml` (READ, `DS/views/partials/_recent-changes.njk`).
- **Two statuses.** Trial carries a tag; stable carries none. Trial means new, much changed, or short of a contribution criterion. A trial component becomes stable after six months without negative feedback (READ, `DS/src/community/component-lifecycle-statuses/index.md`). Front matter holds the type, date and feedback link; the layout draws the callout (READ, `DS/src/components/feedback/index.md` lines 7–15). "Experimental" no longer appears; trial replaced it (INFERRED, from a search of `DS/src`).

**Pluto's state.**

- Examples are files, so the code shown is the code run; the other theme renders in its own frame (READ, 015 decisions 12, 13). One language, so one code view (INFERRED).
- The API table is generated from source (READ, 015 decision 14).
- Search matches title, then a word in the title, then the summary. Entries hold no aliases (READ, `src/lib/site/search/types.ts`; 015 decision 18).
- No edit link and no feedback call (READ, `src/lib/site/page/component.svelte`).
- Per-item history was ruled out: "a changelog page only" (READ, 015 decision 1).
- Each item shows `since`; there is no status (READ, `registry.json`).

## 5. Governance

**What GOV.UK does.**

- **Contribution criteria in two stages.** A proposal is useful (evidence from several services) and unique (it duplicates nothing). Before publishing it is usable (tested with users, disabled users among them), consistent, and versatile across services, browsers and AT (READ, `DS/src/community/contribution-criteria/index.md`).
- **The community backlog is archived.** An "upcoming components and patterns" page and a roadmap replace it, with six tests for an essential component (READ, `DS/src/community/backlog.md`; `DS/src/community/upcoming-components-patterns/index.md`).
- **Semver, with a bar for breaking changes.** Good reasons are evidence of a barrier, accessibility, security, performance; a rename on a hunch is not (READ, `FE/docs/contributing/versioning.md`). Deprecate in a minor, remove in the next major, and say in the notes what to do (READ, `FE/docs/contributing/managing-change.md`).
- **Release notes have four sections**: breaking changes, recommended changes, new features, fixes. Each says what to do and when it applies (READ, `FE/docs/contributing/CHANGELOG_TEMPLATE.md`). Each release opens with its install command (READ, `FE/CHANGELOG.md`, "v6.6.0").

**Pluto's state.**

- Four roles; the owner decides (READ, `constitution.md` §5). Need admits a component (§4.2).
- One `CHANGELOG.md`, newest first. An interface change is marked **interface change**, and a release ends with the `add` command that updates its items. Entries are per item, not grouped by kind (READ, `CHANGELOG.md` lines 1–30).

## Ideas for Pluto, ranked by value over cost

1. **Fix two error-summary behaviours.** Put `role="alert"` on an inner element, not the root. Make a link bring the field's label or legend into view, clear of the sticky bar, as well as focus the field. Test both, and that no hash joins the URL. *Why:* small, and the evidence is a recorded AT failure that Pluto cannot test for itself. *Touches:* `src/lib/registry/ui/error-summary/error-summary.svelte`, its page's Accessibility list, `tests/e2e/keyboard.spec.ts`; a small new specification.
2. **Error wordings on every form item.** A short "Error messages" part of each form item's Usage, one wording per failure (empty, too long, wrong format, impossible), in Pluto's voice. Add to "Errors direct" the few words an error never uses. *Why:* R23 asks errors to direct; this makes it concrete and reviewable. Writing only. *Touches:* the field, input, textarea, checkbox, radio-group, native-select and input-otp pages; `src/routes/(site)/brand/voice/+page.svelte`.
3. **Search aliases.** An optional `aliases` list on a sitemap entry, matched after the title and shown when it matched. Seed it with names from other systems: modal, toast, dropdown, toggle. *Why:* builders search by the word they know. *Touches:* `src/lib/site/search/types.ts`, `src/lib/site/sitemap.ts`, `src/lib/site/search/sources/pages.ts`, `tests/unit/search.test.ts`, within 015 decision 18's 30 kB.
4. **Group each release's notes by kind.** Interface changes (each with what to do), recommended, new, fixes, before the per-item lines. *Why:* a builder updating an app reads the first group and can stop. *Touches:* `CHANGELOG.md`'s header convention, `tests/unit/changelog-page.test.ts`.
5. **One written guide to form errors.** It gathers the flow: keep answers, prefix the title, summary first with focus, inline errors that match it, validate on submit. It links the items and the sign-in block. *Why:* this is Pluto's most AT-sensitive behaviour, spread over four pages. A guide, not a fifth door. *Touches:* a sitemap entry beside `/foundations/accessibility/`, in a specification after `017`.
6. **A "Known gaps" line where one exists.** An optional part of a component's Accessibility section that says, in the page's own words, what does not yet work or is not checked. The log's button is a first case. *Why:* stated limits make guidance trusted, and Pluto already records them in `context/` (INFERRED). *Touches:* `src/lib/site/page/component.svelte`; a successor to 015 decision 10.
7. **Tie each Accessibility bullet to a test.** *Why:* hand-written claims drift; GOV.UK keeps criteria beside code but checks few. *Touches:* the component pages, `tests/e2e/keyboard.spec.ts`. Higher cost; a research memo first.
8. **A duplicate-title check.** *Why:* cheap, and it helps people who move by title. *Touches:* `tests/unit/sitemap.test.ts`.
9. **A status mark, if any, generated.** For the owner: (a) no mark, recommended, since `since` already says how new an item is; (b) a "new" mark generated from `since` equal to the current release; (c) a trial status. A trial status with feedback and promotion does not fit a system where need admits a component (INFERRED). *Touches:* `src/lib/site/page/facts.svelte`.

## Things to avoid

- **A research section with nothing in it.** GOV.UK cites real services. Pluto has no user research to cite, and its pages may not cite `context/` (015 decision 17). An empty section would be furniture (R24) (INFERRED).
- **Community governance.** Working groups, public proposals and a six-month trial clock serve a government with hundreds of teams. Pluto has four roles and an owner (`constitution.md` §5). The "unique" test is the one worth keeping, in a specification's statement of need (INFERRED).
- **Per-item history on pages.** The owner ruled it out (015 decision 1).
- **Two code tabs.** Nunjucks and HTML exist because GOV.UK serves templates and raw markup. Pluto ships Svelte alone (INFERRED).
- **GOV.UK's register.** Its directive tone serves every citizen. Pluto's voice is warm and human (015 decision 17). Borrow the precision, not the tone.
- **A public "help improve this" call.** Pluto's site invites no outside contribution (`constitution.md` §3). An edit link is possible, since the repository is public for installs (015 decision 16), but needs the owner's word (INFERRED).
- **Reusing GOV.UK's text.** Pluto's heading "There is a problem" already matches GOV.UK's. It is a phrase, within the rule. Every other line stays Pluto's own.
