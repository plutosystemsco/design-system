# Review of 018 — Site polish: a map on every page, the part first, and the details finished

Reviews [`specifications/018-site-polish.md`](../specifications/018-site-polish.md).

- **Date:** 2026-11-15
- **Status:** in review
- **Reviewer:** a reviewer; not the author
- **Reviewed:** the specification as drafted (491 lines, untracked), on the tree at `cd19d26`. Checked against:
  - `research/2026-11-15-site-polish-synthesis.md` and the three `2026-11-15-design-sites-*` memos it merges;
  - `decisions.md`'s 2026-11-15 entries: "Every page but home has a left navigation", "Four calls from the site-polish synthesis", "No status mark, and items gain prop doc comments", "Accessibility status, a high-contrast scheme, and scoped schemes", and the budget rulings;
  - the constitution and `AGENTS.md`;
  - `015` and `017` as landed.
- **Re-ran:** nothing in the repository was written except this file. Scratch is in `…/scratchpad/review-015/`. The site's `build/` is from 08:32 on 2026-11-15, just before `cd19d26` (08:45), which changed only `context/`. It was read as built, and not rebuilt.

  **The measure** (EXECUTED, `cpl.ts`). The repository's Geist at 400, 16 px, line height 1.6 (`--text-base`, `--text-base--line-height`). Every built `<p>` of 160 characters or more is set at a width; CPL is characters ÷ rendered lines, the spec's definition.

  | Page | Long `<p>` | Median CPL at 576 px (decision 9) | at 544 px | at 528 px |
  |---|---|---|---|---|
  | `/start/install/` | 10 | 61.7 | 60.3 | 60.3 |
  | `/components/button/` | 8 | **70.3** | 66.7 | 63.7 |
  | `/changelog/` | 4 | **72.7** | 71.2 | 67.5 |
  | `/brand/voice/` | **0** | none | none | none |

  **Changed in** (EXECUTED: `CHANGELOG.md`'s `##` releases, each bullet's head before its first colon, matched against `registry.json`'s 75 names):
  - 73 items are named at a bullet's head, and `name-strip` and `cta-band` are not. As stated.
  - **For 52 of 75 items, "Changed in" equals `since`.** 23 differ; 16 read 0.12.0.

  **The source** (READ):
  - `src/lib/site/search.ts:15`: the summary match is `includes`. As stated.
  - `src/lib/registry/ui/badge/badge.svelte:10–19`: the variants are `default`, `destructive`, `success` and `caution`. **There is no `outline`.**
  - `src/lib/site/foundations/swatch.svelte`: the chip's colour is `style:background-color`, with no `forced-color-adjust`. Only `src/app.css` holds forced-colours rules (grep).
  - `src/lib/site/examples/{button,code-block,…}/*.svelte` import sibling modules (`./example`: `SHORT`, `LONG`, `EDGE`) and `scripts/tokens.ts`.
  - `examples.ts` globs by path; a page's example order is set by its route, not by file name. `button`'s files sort `heights`, `keyboard`, `states`, `variants`.
  - Through `registryDependencies`: `sign-in`, `sign-up` and `settings` bring `error-summary`, and 70 items bring `pluto-theme`.
  - `tests/e2e/doors.spec.ts:497–560`: the Colour page's checks pin 4 bands, but not their width.
  - `tests/e2e/perf.spec.ts:20–26, 165`: today's budgets are `/` 355, `/components/` 320, Button 370, code-block 360 and Colour 347. As stated.
  - `src/app.css`: `--glass-fallback` is `#FBFAF6` and `#221F19`; `--tracking-section` exists.

## Acceptance criteria against evidence

1. **Checks:** countable.
2. **Nav order:** countable.
3. **The nav at `lg`:** countable.
   - "Within the nav's visible box" does not check that the page did not move (finding 11).
   - The landing has two filter fields (finding 10).
4. **The rail:** countable.
5. **The phone sheet:** countable at 390 only. The `md`–`lg` sheet is untested (finding 12).
6. **The part first:** countable over 75 pages, and it can fail. Not measured after the change (the 450 px figure is INFERRED). The checkpoint will tell.
7. **Changed in:** countable. The figures match my parse (EXECUTED). On 52 pages it reads a change that did not happen (finding 4).
8. **Suggest a change:** countable.
9. **The details:** countable, and every part can fail.
10. **Page tools, previous and next:** countable.
11. **Search:** countable. The ⌘C copy can fail both ways, as written.
12. **The measure: not met as written.** At 576 px, Button's median is 70.3 and the changelog's 72.7, both above 70. Voice has no qualifying paragraph, so it checks nothing (finding 1).
13. **One h3:** countable.
14. **Smoothing:** countable.
15. **The bar:** countable. It also turns the bar opaque on expressive pages (finding 5).
16. **The changelog:** countable. "variant outline" does not exist (finding 9).
17. **Specimens:** countable. Not in forced colours (finding 3).
18. **Thumbnails:** countable. The staleness hash misses sources that change the picture (finding 2).
19. **Budgets:** countable. See finding 15.
20. **Suites:** countable.
21. **Done:** countable.

## Findings table

| # | Severity | Finding | Where |
|---|---|---|---|
| 1 | Medium | At 576 px, Button and the changelog run 70.3 and 72.7 CPL, so criterion 12's 58–70 fails on landing. Voice has no paragraph the criterion reads | decision 9; criterion 12 |
| 2 | Medium | The thumbnail hash misses sources that change the picture: an example's own imports, the frame's styles, the fonts, and the browser. "First example" is not tied to the page's order | decision 13; criterion 18 |
| 3 | Medium | No new surface is checked in forced colours. The Colour swatches and the search `<mark>` lose their meaning there as specified | decisions 1, 8, 12, 13 |
| 4 | Medium | "Changed in" equals "Since" on 52 of 75 pages, and says a change happened that did not. Put the wording to the owner | decision 4; For the owner |
| 5 | Medium | The opaque bar on scroll also applies on the landings, Brand and home, where glass over a field is the brand's showcase (I9, `017` decision 5) | decision 10; criterion 15 |
| 6 | Medium | Brand bands beside the nav: the fallback breaks the owner's "every page but home" ruling, and no criterion checks the band's edges | decision 1 (Brand); Risks |
| 7 | Low | ⌘C in the palette: right to copy text when text is selected, but the hint is visual only, and "⌘" reads poorly aloud | decision 8; criterion 11 |
| 8 | Low | 77 stops before the content: the skip link meets WCAG 2.4.1. Keep the nav before `<main>` in the DOM. Several `nav` landmarks need distinct names | decisions 1, 6; Risks |
| 9 | Low | `badge` has no `outline` variant; `default` is the outlined one. As written, the builder would change a registry item | decision 11 |
| 10 | Low | `/components/` would hold two "Filter components" fields, the nav's and the landing's | decisions 1, 13; criterion 3 |
| 11 | Low | "Scrolls its current link into view, without moving the page" is not tested for the page | decision 1; criterion 3 |
| 12 | Low | Phone-sheet semantics: say that the door's button is not a link, test the `md`–`lg` sheet, and name the button by what it opens there | decision 2; criterion 5 |
| 13 | Low | Some aliases repeat a title, and "toast" and "toggle" would mislabel Alert and Switch | decision 8 |
| 14 | Low | "Copy page" writes after an `await fetch`, which can outlive the click's activation | decision 6 |
| 15 | Low | The Button budget's +5 kB counts the nav's HTML, not the data that hydrates it or builds the phone sheet. Name it, and keep the A/B | decision 14 |
| 16 | Low | "Suggest a change" assumes issues are open on the repository; check it at criterion 21 | decision 5 |

## Findings, most severe first

1. **Medium: the measure misses its own target** (decision 9; criterion 12).
   - **The defect.** The prose measure is 36 rem, 576 px, aiming at a median of 58 to 70 CPL. Measured in Geist 400 at 16/1.6 on the built pages (EXECUTED above):
     - Button: 70.3;
     - the changelog: 72.7;
     - Install: 61.7.

     Criterion 12 also names Voice, which has no `<p>` of 160 characters or more (its prose is in list items), so the criterion reads nothing there.
   - **Failure.** Criterion 12 fails on two of its five pages as specified, and is vacuous on a third.
   - **Fix.**
     - Set `--site-measure` to 33 rem (528 px). There, Button reads 63.7, the changelog 67.5 and Install 60.3 (EXECUTED).
     - Or keep 576 px and widen the target to 58–74. Say which.
     - Criterion 12 reads `p`, `li` and `dd` of 160 characters or more, as decision 9's own definition of prose does.

2. **Medium: the thumbnail hash misses sources that change the picture** (decision 13; criterion 18).
   - **The defect.** The hash covers:
     - the item's first example file (or first view file);
     - the registry files of the item and its dependencies;
     - `src/app.css`;
     - the script.

     The image also depends on:
     - **the example's own imports**: `examples/code-block/*.svelte` import `./example` (`SHORT`, `LONG`, `EDGE`), and others import `scripts/tokens.ts` (READ);
     - **the view's imports** for a block: its fixtures and `src/lib/preview/` helpers;
     - **the frame**: `[data-slot="frame-stage"]`'s ground and padding come from `page/frame.svelte` and `site.css`;
     - **the fonts**: the `@fontsource-variable/*` versions in `bun.lock`;
     - **the renderer**: Playwright's Chromium.

     "First example" is also unspecified. The script photographs the page's first stage, which the route orders, while a file glob sorts `button`'s `heights` before `variants`.
   - **Failure.** Editing `examples/code-block/example.ts`, the frame's padding, or a font version changes the picture, and the test still passes with the old image.
   - **Fix.**
     - Hash the example's (or view's) local import graph, walked with `node:fs` the way `examples.test.ts` already walks it for the theme module.
     - Add `page/frame.svelte`, `site.css`, `bun.lock`'s entries for the three font packages, and `@playwright/test`'s pinned version.
     - Take "first" from one exported function that both the route and the script read.
     - Say how `019` works with this. It stales `error-summary` and its three dependents, `sign-in`, `sign-up` and `settings` (EXECUTED), so `019`'s builder runs the script and commits eight images.

3. **Medium: forced colours, for the surfaces this specification adds** (decisions 1, 8, 12, 13).
   - **The defect.** The synthesis (§4) asked that the nav's current mark not rest on colour, and decision 1 meets that with a border. But:
     - **The Colour specimens** are painted backgrounds. Under `forced-colors: active` the browser replaces author backgrounds with `Canvas`, so every 56 px swatch, and today's 16 px chips (`swatch.svelte`, no `forced-color-adjust`), become blank. A page whose job is to show colours shows none.
     - **The search `<mark>`** "styled from the theme's roles" loses its background the same way, so the match is not shown.
     - **The tiles** keep their hairline, which is fine.

     No criterion runs any new surface with `forcedColors: "active"`. The ruling that defers the forced-colours pass covers registry items, not the site's own new CSS.
   - **Fix.**
     - Swatches carry `forced-color-adjust: none` and a 1 px `border` (they are data, like an image).
     - `mark` takes `Mark` and `MarkText` under `@media (forced-colors: active)`, plus `font-weight: 600` in every mode, so colour is not the only signal.
     - The nav's current mark is a `border-inline-start`, not a background or a `box-shadow` (say so).
     - Add one Playwright group with `forcedColors: "active"`. It checks that the swatches' computed background equals the token's, that each `<mark>` has a non-`Canvas` background or weight 600, and that the current link's border is visible.

4. **Medium: "Changed in" that equals "Since"** (decision 4; For the owner).
   - **The defect.** For 52 of 75 items (EXECUTED), the only changelog bullet naming the item is the one that added it. So the facts line reads "Since 0.4.0 · Changed in 0.4.0". That says a change happened that did not (R23: copy says what happens), and it repeats the fact beside it.
   - **The ruling** asks for "one 'Changed in 0.x.y' line … linking to its entry". Its aim is a sign that the system lives, and a path to the entry.
   - **"Added in"** is clearer for those 52, but the facts line already says it as "Since".
   - **Fix: ask the owner** (`AGENTS.md`), recommended first:
     - **(a)** Show "Changed in 0.y.z" only where it differs from Since. Where it does not, Since itself links to its release entry. Every page still links its entry; 23 pages show a change.
     - (b) As drafted: "Changed in" on all 75.
     - (c) "Unchanged since 0.x.y" in place of "Changed in" where they are equal.

     Option (a) is within the ruling's purpose but not its letter, so it is the owner's to confirm.

5. **Medium: the opaque bar reaches the pages where glass over a field is the point** (decision 10; criterion 15).
   - **The defect.** The problem decision 10 solves is an example's buttons showing behind the lockup on component pages (`pluto-copy-1440-light.png`). But the rule is "once the page has scrolled", on every page. So:
     - on the landings, the Brand pages and home, the bar turns opaque `--glass-fallback` as soon as a band passes under it;
     - on `/brand/colour/`, `017` decision 5's "the bar's glass passes over the bands as the page scrolls" stops being true;
     - I9 places liquid glass on expressive pages over fields, and this removes the one place a reader sees the bar's glass do that.
   - **Fix.** Apply `data-scrolled`'s opaque ground only where `<main>` is `data-mode="productive"` (component pages, leaves, the changelog). Keep the glass on expressive pages. Criterion 15 then checks both: opaque after 400 px on Button, still translucent on `/brand/colour/` with a band under the bar. Or put it to the design lead at checkpoint 1 with both shots, and record the ruling.

6. **Medium: the Brand bands beside the nav have an unruled fallback and no test** (decision 1, "On a Brand page"; Risks).
   - **The defect.**
     - From `lg`, a band bleeds from the content's start edge to the viewport's end edge. That makes it asymmetric, and no longer the full-bleed field that `017` decision 5 and the owner's direction B describe.
     - The stated fallback, "hide the nav on Brand pages while a band is in view", contradicts the owner's ruling, "every page but home".
     - No criterion fixes the band's geometry. `doors.spec.ts` counts bands, not their width (READ).
   - **Fix.**
     - Name a third option for checkpoint 1: the nav column on Brand pages becomes a glass panel (R25 allows controls on glass), and the bands run full-bleed behind it.
     - Strike the hide-the-nav fallback, or mark it as needing the owner.
     - Add a criterion. At 1024 and 1440, each band's start edge is at or after the nav's end edge (or under the glass nav, if that option is ruled), and its end edge is the viewport's. Below `lg`, it spans the viewport.

7. **Low: ⌘C in the search palette** (decision 8; criterion 11). The coordinator's point (a).
   - **The collision is handled.** With text selected in the field, the key copies the text; with the caret collapsed there is nothing to copy, so taking the key loses nothing. Control-C off macOS is right.
   - **The defects:**
     - the action is announced only by a visual legend that appears when a component option is active;
     - "⌘" has no reliable spoken name;
     - there is no pointer path in the palette (options may not hold buttons in a listbox), though each component page's install block is one.
   - **Fix.**
     - Give the input `aria-describedby` pointing at the legend, so the keys are read once.
     - Set the keys with `kbd` plus an accessible name ("Command C", "Control C").
     - Implement it on `keydown` with `selectionStart === selectionEnd` and `preventDefault()`, writing in the same handler.
     - Criterion 11's two cases stand.

8. **Low: 77 stops before the content** (decisions 1, 6; Risks). The coordinator's point (d).
   - **The skip link is enough** for WCAG 2.4.1, and the nav is a named landmark.
   - **Moving the nav after `<main>` in the DOM would be worse:** the focus order would no longer follow the visual order (WCAG 1.3.2, 2.4.3) for sighted keyboard users.
   - **Collapsible groups on desktop** would hide the map the owner asked for.
   - Keep the order. The filter is the nav's first stop, which already shortcuts it.
   - **One fix.** The page now has several `nav` landmarks: the bar's, the breadcrumb, the left nav, "On this page", and previous and next. Give each a distinct label. Previous and next can be "Pages before and after". axe's `landmark-unique` then holds.

9. **Low: `badge` has no `outline` variant** (decision 11).
   - **Fix.** Write `variant="default"`, which is the outlined one (`border-border text-foreground`, READ). As written, the builder would add a variant to a registry item, which this specification rules out.

10. **Low: two filters on the Components landing** (decisions 1, 13; criterion 3).
    - **The defect.** The nav opens with "Filter components" on every Components page, the landing included, and the landing keeps its own filter over the tiles.
    - **Fix.** On `/components/` the nav omits its filter (the landing's drives the tiles). Or one field filters both. Criterion 3's "dia" check then runs on a component page, not the landing.

11. **Low: the nav's scroll on load** (decision 1; criterion 3).
    - **The defect.** `scrollIntoView` scrolls every scrollable ancestor, the window included.
    - **Fix.** Say the nav sets its own `scrollTop`. Add to criterion 3: on `/components/settings/` (late in the list) at 1024 × 700, `window.scrollY` is 0 after load, and the current link is in the nav's box.

12. **Low: the phone sheet's semantics** (decision 2; criterion 5). The coordinator's point (g).
    - The `collapsible` item gives a button with `aria-expanded` and a controlled region, which is right. Inside the sheet's `dialog`, wrap the tree in a `nav` labelled "Site".
    - Say that a door's disclosure button is not a link, and that the landing is the first link inside it. A reader may otherwise press the door expecting its page.
    - Between `md` and `lg` the same "Menu" button opens only the current door's pages. Name it "<Door> pages", and add a 768 px case to criterion 5.
    - The synthesis put search and the theme toggle at the sheet's foot; the spec drops them, which is fine because the bar keeps both. Say so.

13. **Low: the aliases** (decision 8).
    - "Popover" (Popover), "spinner" (Spinner) and "dropdown" (Dropdown menu) already rank as titles, so they do nothing.
    - "Also called toast" on Alert, and "Also called toggle" on Switch, say what is untrue in this system. A toast is transient and Alert is not, and Toggle is its own item.
    - **Fix.** Drop the redundant ones. Drop "toast" (this system has no toast), and drop "toggle" for Switch.

14. **Low: "Copy page" after a fetch** (decision 6).
    - **The defect.** `clipboard.writeText` after an `await fetch` can outlive the click's activation. Safari is not checked, but Chromium can refuse it too on a slow fetch.
    - **Fix.** Write a `ClipboardItem` whose data is the fetch's promise, inside the click, or prefetch the twin on hover or focus.

15. **Low: what the Button budget counts** (decision 14).
    - **The defect.** The 1.3 kB figure is the nav's HTML. A hydrated nav and the phone sheet also need the Components list (75 titles, paths and groups) as data. 015 cut the page to its own registry entry, so this is new weight. It is likely inside the INFERRED 2–3 kB, but it is the part most likely to push past 375.
    - The A/B at checkpoint 1 is the right check. Name the data cost there, and say that over 375 kB the first remedy is a static (non-hydrated) nav whose filter reads the DOM.
    - On `/components/`, note that Chromium's lazy-load distance is larger on slow connections, so the throttled run may load more tiles than 30. Measure, as decision 14 says.

16. **Low: the issue link's target** (decision 5).
    - **Fix.** Add to criterion 21: the design lead opens one "Suggest a change" link from the deployed site and records that GitHub shows a prefilled new-issue form. Disabled issues would make it a dead link on every page.

## The coordinator's points, answered

- **(a) ⌘C:** no collision in practice. Discoverability and the spoken name need work (finding 7).
- **(b) "Changed in" against "Added in":** on 52 of 75 pages "Changed in" equals Since. "Added in" is clearer, but Since already says it. Recommend showing "Changed in" only when it differs, with the owner's word (finding 4).
- **(c) Thumbnails:** the workflow is sane, and the hash is not complete (finding 2). `019` regenerates eight images, not two.
- **(d) 77 stops:** the skip link is enough. Keep the nav before `<main>`. Label the landmarks (finding 8).
- **(e) Brand bands:** asymmetric as specified, with a fallback that breaks the ruling and no test (finding 6). The opaque bar also changes those pages (finding 5).
- **(f) Forced colours and both themes:** the swatches and `<mark>` fail forced colours (finding 3). Both themes are covered: two thumbnails, two swatches, and both projects for the nav, search and bar.
- **(g) Phone menu:** sound, with three edges (finding 12).

## Constitution checks

- **§2.3:** unchanged. Every item keeps a page that shows it in both themes.
- **§3:** the site stays guidance.
- **§4.1:** no item changes. `static/r/` is byte-identical (criterion 1), once finding 9 keeps `badge` untouched.
- **§4.3:** no literal colour (decision 12 reads tokens). `--site-measure` and the nav's width come from Tailwind's container scale, as `015` decision 5 allows.
- **§4.4:** axe at three widths in both themes, the keyboard walks, and the current mark not resting on colour. Forced colours is the gap (finding 3).
- **§4.5, §4.6:** no package added (criterion 1).
- **§6:** no prior art copied. The patterns are described from the memos.

## Risk

The scope is right for one builder. Most of it is site chrome that already has a pattern.

Most likely to go wrong:
- the measure, if finding 1 is not settled before the build;
- the Brand bands at checkpoint 1 (finding 6);
- the Button budget (finding 15);
- the thumbnails' upkeep across `019` and every theme change (finding 2).

## Verdict

Does not land yet: findings 1 to 6 (Medium) stand.

- Finding 1 is one number and a wider criterion.
- Findings 2, 3 and 5 are a fuller hash, a forced-colours group and a mode condition.
- Finding 4 is a question for the owner.
- Finding 6 needs a third option and a geometry criterion.

Lows 7 to 16 can be taken as write-ins.

## Disposition

(Filled in after the design lead answers.)

## Re-check (2026-11-15)

**Reviewed:** the revised specification (763 lines), its "Review" section, and the owner's ruling on "Updated" in `decisions.md`.

**Re-ran:**
- **The measure** (EXECUTED). `cpl.ts` again, now over `p`, `li` and `dd` of 160 characters or more, as criterion 12 reads, at 528 px. Button 63.7, Install **59.7**, the changelog 63.0. All are within 58–70. The spec quotes my earlier `<p>`-only figures (60.3, 67.5), not these.
- **The Button budget's data claim** (EXECUTED, on the 08:32 build). `components/button/index.html` already references one chunk holding every item's name and group (`DP8RROO5.js` here, 16,222 bytes at gzip -9). The design lead's hashes differ, but the claim holds: the nav's data adds nothing.
- **The thumbnail hash list, the forced-colours decision and criterion 21, the bands' criterion 22, and decision 4's "Updated"** were read.

**Dispositions:**
- **Findings 1 to 6:** each is closed in the decisions and criteria, not only in the "Review" section.
  - Finding 4 is closed by the owner's ruling. One "Updated 0.x.y" on every page is unambiguous, and criterion 7 tests a changed item and an unchanged one.
  - Finding 5's productive-only bar is in decision 10 and criterion 15.
- **Findings 7 to 16:** taken as written.
  - The ⌘C rule (`keydown`, a collapsed selection, `preventDefault`, the write in the same handler, the legend as `aria-describedby`) is sound. It never takes the key from selected text.
  - The hash list now covers everything I named. The page's own data loader for examples is covered through the item's registry files where it matters (the highlighter's), so I raise nothing further.

**Remaining** (both Low, as write-ins):

1. **Install sits 1.7 above the floor** (decision 9; criterion 12).
   - **The defect.** Over `p`, `li` and `dd` at 528 px, Install's median is 59.7. One shorter guide paragraph could tip it under 58.
   - **Fix.** Quote the `p`, `li` and `dd` figures (63.7, 59.7, 63.0) in the "Review" section in place of the `<p>`-only ones. Either lower the floor to 56, or accept that a failure there is a ruling at checkpoint 1, not a rebuild.

2. **"Copy page" needs a path where the promise form is missing** (decision 6).
   - **The defect.** A `ClipboardItem` built from a promise is the right pattern for Safari and Chromium. A browser without `ClipboardItem`, or one that rejects a promise value (older Firefox), throws before the write. Today that shows the failure text, though the copy could have worked.
   - **Fix.** One line: if `ClipboardItem` is undefined or `write` rejects with a `TypeError`, await the text and call `writeText`; only then say "Couldn't copy". Chromium is the release's only checked browser, so criterion 10 is unchanged.

**Verdict:** Fit to build, with re-check items 1 and 2 taken as write-ins. Every Medium from the first review is resolved in the decisions and criteria.
