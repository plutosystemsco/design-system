# Review of 003 — The first blocks

Reviews [`specifications/003-the-first-blocks.md`](../specifications/003-the-first-blocks.md).

- **Status:** dispositioned; fit to build
- **Date:** 2026-10-28
- **Reviewer:** a reviewer; not the author
- **Reviewed:** the specification as drafted, 2026-10-28 (`specifications/003-the-first-blocks.md`, 878 lines, untracked). Checked against the constitution, every entry of `decisions.md` (the uncommitted top entry "The design calls for `003`" included), `002`'s decisions 9 to 24 and Landing notes, `001`'s decisions 2, 3, 13, 14, 18 to 25 and 29, the three memos of 2026-10-28, and the code it extends.
- **Re-ran:** under Bun 1.3.14. Scratch files were kept outside the repository. Nothing in this repository was written except this file.
  - Every string in decisions 9 to 13, plus the stub comment, the example data and the IANA values, linted with `lintText` and `loadRules` from `scripts/lint-literals.ts` → 102 strings, 0 violations. Decision 14's claim holds (EXECUTED).
  - `registry.json` summarised → 32 items, 133 files, the per-item file counts and dependencies decision 5 and smoke assertion 2 assume (EXECUTED). Every count in the spec, recomputed from its own tables, agrees: 38 items (1, 3, 1, 28, 5); 151 item files; 23 dependency names; 39 and 39 built files; 55 pages; 202 axe scans (66 + 36 + 96 + 2 + 2); 110 theme checks; 40 catalogue stops; 36 fixture stops; 71 view stops; 40 toolbar stops; 15, 10, 15, 16 viewer checks; 84 + 16 = 100 smoke files; 16 smoke assertions; 64 bad and 42 good lint samples.
  - SvelteKit 3.1.0 source in `node_modules/@sveltejs/kit` (READ):
    - `crawl.js:197-206` follows `href` unless `rel` holds `external`, and follows `src`. So the crawler also follows the viewer's iframe `src`.
    - `prerender.js:101-110` and `:184-206` define the default handler, which logs and throws, so a non-200 page fails the build. `:631` is the call site. Missing ids are checked at `:731-744`; `:208-213` only defines that handler.
    - The preview server (`exports/vite/preview/index.js:125-216`) serves prerendered pages, then hands everything else to `server.respond`. An unmatched path gets `respond_with_error` (`runtime/server/respond.js:771`), which renders `nodes[0]` (the root layout) and `nodes[1]` (the root error page) (`page/respond_with_error.js:37-75`). So decision 12's 404 check is sound. A nested `+error.svelte` is never used for an unmatched URL (finding 13).
    - The rule against reserved `+` names applies only inside `src/routes` (`create_manifest_data/index.js:537-572`). So a `+page.svelte` under `src/lib` is legal.
  - shadcn-svelte CLI 1.7.1, prior-art clone at `6149e14` (READ):
    - `add-registry-items.ts:91-143`: without `-o`, `add` lists existing items and asks before it overwrites any file. With `-o` it asks nothing (finding 2).
    - `deps-resolver.ts:206-240`: an import counts as a package only when it matches a name in `package.json`. So `$app/state` in `+error.svelte` adds no dependency.
  - `002`'s installed sources (READ):
    - `card.svelte`: the root is `overflow-hidden … py-6`, with padding on the header and content (finding 1).
    - `input-otp*.svelte`: `size-12` cells; `gap-3` on the root; the separator icon is `size-4`. The spec's 328 px and 232 px both reproduce.
    - `field.svelte`, `field-set.svelte`: description and error render after the children (finding 9).
    - `input-group-password.svelte`: the toggle is named "Show password" by `aria-label`.
    - `alert.svelte`: an explicit `role={null}` survives.
    - `button.svelte`: `whitespace-nowrap`, `h-12`.
  - NIST SP 800-63B-4, §3.1.1.2, read 2026-10-28 (READ, `https://pages.nist.gov/800-63-4/sp800-63b.html`):
    - a password that is the only factor needs at least 15 characters;
    - a password used only inside multi-factor sign-in needs at least 8;
    - verifiers should allow at least 64 characters, and add no composition rules.

## Verdict

Does not land yet (ready after fixes). Nothing is High. Findings 1 to 7 are Medium:

- the card clips the focus ring below `sm`;
- `-o` silently replaces app routes and owned primitives;
- the voice check fails on the spec's own `status >= 500`;
- a second "Send a new code" is silent;
- "Discard changes" drops focus;
- the password default sits below NIST's single-factor minimum;
- shipped copy promises what the blocks cannot keep.

Findings 6 and 8, and the wording calls in 7, need the design lead. Finding 11 needs the author or the design lead. Nothing needs the owner before build.

## Acceptance criteria against evidence

1. **Install:** countable. No package changes (READ).
2. **Checks:** countable (READ).
3. **Tokens unchanged:** countable (READ).
4. **Registry source:** countable. 38 items, types 1, 3, 1, 28, 5, and 23 names all recompute (EXECUTED from `registry.json` plus decision 5).
5. **Registry build:** countable. The default page targets match blocks memo §4.2 (READ).
6. **Blocks, statically:** countable. **Not met as written:** check 7's `\b500\b` matches the comparison that decision 12 requires (finding 3).
7. **Site build:** countable (39 + 16 = 55). The crawler follows the iframe `src`, and every view is a static route (READ).
8. **Dev server:** countable (READ).
9. **Preview pages:** countable (READ).
10. **The lint:** countable. The copy lints clean (EXECUTED).
11. **Named dependencies:** countable. `$app/state` is not detected (READ).
12. **The merge path:** unchanged (READ).
13. **axe:** countable (202). Each state view needs a `<title>`, which the spec gives only for page files (finding 9) (INFERRED).
14. **Themes:** countable (110) (READ).
15. **The mark and tokens:** unchanged (READ).
16. **Keyboard:** countable. The views are tested as pages at 1280, not through the iframe. That is stated. The claim "Tab passes into the iframe's document" is untested (finding 13).
17. **Primitives and status:** countable. Tailwind 4's `sr-only` gives 1 × 1 with hidden overflow (INFERRED).
18. **Form behaviours:** countable. Nothing checks the second resend (finding 4) or Discard's focus (finding 5).
19. **Page states:** countable. The 404 path is sound (READ, Kit preview and `respond_with_error`).
20. **Hero:** countable (READ).
21. **Motion, reflow, targets:** countable. The "Technical details" summary has no stated size, so its 24 px target is unproven (finding 9). The card's clipped ring passes every check (finding 1).
22. **Viewer:** countable (5, 10, 15, 15, 16, 5) (READ).
23. **Smoke:** countable (100 files, 16 assertions).
    - The prerendered build renders every installed block page on the server and crawls its links. That is the proof that an installed page renders, and the spec says it relies on it (assertion 5).
24. **Test files:** countable (9, 8, 4) (READ).
25. **Release:** countable (READ).
26. **Checkpoint:** countable (READ).
27. **Development walk:** countable (55 × 2 = 110) (READ).
28. **Released:** tag `v0.3.0`.

## Findings, most severe first

1. **Medium — Below `sm`, the card clips every control's focus ring** (decision 10, "Below `sm`, the card drops its chrome"; decision 11 "As `sign-in`'s").
   - **What is wrong:** `002`'s card root carries `overflow-hidden` (READ, `card.svelte`). The spec removes the card's horizontal padding below `sm` (`max-sm:px-0` on header and content) and keeps `overflow-hidden`. `001`'s ring is a 2 px outline at a 2 px offset, so it reaches 4 px past each control. Below `sm`, the email input, the password group and toggle, the full-width submit, the code input's root, the focused error summary and the focused step heading all touch the card's edge. Their ring is cut off at the left and right (INFERRED from CSS: an `overflow: hidden` ancestor clips descendant outlines).
   - **Why it matters:** this is `001` decision 13's focus recipe on the widths where most people sign in. The keyboard test runs at 1280, where the card keeps its padding, so no criterion sees it.
   - **Fix:**
     - Add `max-sm:overflow-visible` to the card root in both forms, and give the reason.
     - Add a check at 360 to `blocks.spec.ts`. For each sign-in and sign-up stop, either no ancestor between the stop and `<main>` computes `overflow: hidden`, or the stop's rect grown by 4 px fits inside that ancestor.

2. **Medium — `-o` still silently replaces an app's routes, and the block names invite it** (decision 3; decision 22; `001` decision 23).
   - **What is wrong:** decision 3 picks the default target because "the default can only touch a folder named after the block". But the names are chosen to be "the natural one": `/sign-in`, `/sign-up`, `/settings`. Those are exactly the folders an app is likely to have already. `001` decision 23 tells apps to install with `add … -y -o`. With `-o`, `add` overwrites without asking. Without it, `add` lists the existing items and asks first (READ, `add-registry-items.ts:91-143`). Decision 3 calls this INFERRED; it is readable. A block also pulls up to 13 owned primitives (`settings` pulls `field`, `alert-dialog` and more). An app that has customised its `button` loses those changes under `-o` too.
   - **Why it matters:** this is constitution §6, "Break an installed app silently". An app that follows `001` decision 23 installs with exactly that command.
   - **Fix:**
     - Make the CLI fact READ in decision 3.
     - State the rule: blocks are added **without** `-o`, so the CLI asks about every file that already exists. Say so on each block's item page, beside the install command (which already omits `-o`), and amend `001` decision 23's guidance for blocks.
     - Keep `-o` in the smoke test, where there is nothing to protect.
     - Correct "can only touch a folder named after the block" to what it guarantees: no file outside `src/routes/<block>/`, the flat `<block>-*` components, and the dependencies' folders.

3. **Medium — The voice check fails on the specification's own code** (decision 19, unit check 7; criterion 6; decision 12).
   - **What is wrong:** check 7 requires 0 matches of `/\b(404|500|sorry|…)\b/i` across the 16 block files. Decision 12 requires `PageStatesError` to branch on "Status below 500 … 500 and above", so `page-states-error.svelte` must contain `500`. Criterion 6 cannot pass unless the builder hides the number, for example as `5e2`.
   - **Fix:**
     - Scope check 7 to copy: string literals and markup text, with comments and expressions excluded.
     - Or move the code ban to the rendered text that `blocks.spec.ts` check 19 already reads, extended to all 16 views and the 404 page. Keep the word ban (`sorry`, `oops`, `whoops`, `something went wrong`) on the source files.

4. **Medium — A second "Send a new code" is announced to no one** (decision 8, "Replacing and clearing"; decision 11, statuses).
   - **What is wrong:** decision 8 says "setting the same text twice … is not announced again" and "the blocks never repeat a message without a different one between". The resend flow sets "We sent a new code to {email}." with no other status before it. So the second resend sets the same text and is silent. The spec breaks its own rule.
   - **Fix:**
     - Set "Sending a new code…" while the resend runs. The button is already busy, so this is one more string.
     - Add to `blocks.spec.ts` check 9: two resends, and the region passes through a different text between the two results.

5. **Medium — "Discard changes" removes itself while it has focus** (decision 13: "shown only while `dirty`").
   - **What is wrong:** pressing Discard resets the fields. `dirty` becomes false, and the focused button unmounts. Focus falls to `<body>`, and keyboard and screen reader users lose their place. That is the failure `002`'s busy rule exists to avoid.
   - **Fix:**
     - After a discard, move focus to "Save changes", or to the first field, and say which.
     - Or keep Discard rendered but disabled-looking. That is worse; the move is recommended.
     - Add a check: press Discard by keyboard, and the focused element is the named one.

6. **Medium — The default minimum password length sits below NIST's floor for a password that is the only factor** (decision 11, `passwordMinLength` default 12, "a design default, not research").
   - **What is wrong:** the first set's sign-in is email and password, with no second factor. NIST SP 800-63B-4 §3.1.1.2 requires at least 15 characters for a password that is the only factor. It allows 8 only when the password is part of multi-factor sign-in (READ today). 12 meets neither reading. The constitution's §5 puts research before every specification, and this default ships into every app that does not override it.
   - **Fix (the design lead's call):**
     - Default `passwordMinLength` to 15, cite §3.1.1.2, and let the copy and the error follow the prop. This is recommended.
     - Or keep 12, with a written reason that meets the citation.
     - Either way, say that the block sets no `maxlength` (NIST: allow at least 64) and no composition rule.

7. **Medium — Shipped strings promise what the blocks cannot keep** (decisions 9, 11, 12, 13; decision 14).
   - **What is wrong:** an app that installs a block and keeps its defaults ships these strings as its own claims.
     - Settings, email notifications: "We never send marketing email." This is a policy statement no design system can make for an app.
     - Settings, email field: "Sign-in codes and notices go here." The first set's sign-in has no codes (decision 10).
     - Settings, theme: "Applies on this device after you save." The shipped page saves nothing and applies nothing, and the preview's own theme toggle contradicts it.
     - Sign-up, done step: "You are signed in as {email}." No block signs anyone in.
     - Sign-up, consent: the sentence names "the terms of service and the privacy notice" even when no `termsHref` or `privacyHref` is given. That asks agreement to documents the page does not offer.
     - Settings, after deleting: "We are deleting your account. We will email you when it is done." This is the app's promise.
     - Hero, feature 3: "meets WCAG 2.2 AA in both themes." This is a conformance claim that axe cannot establish. The spec itself says no screen reader has been run (decision 24).
     - Error page: "The problem is on our side, not yours." A client-side load that fails offline also renders the 500 copy.
     - Every 4xx reads "Page not found". That is wrong for 401 (sign in) and 429 (wait).
   - **Fix (the author; the design lead for wording):**
     - Drop "We never send marketing email."
     - Make the email description "Notices about your account go here."
     - Make the theme description "The colour scheme for this device." In the page, say in the stub's comment that the app applies it.
     - Done step: "Your account is ready to use." and nothing about being signed in.
     - Render the consent sentence only when both hrefs are given.
     - Keep the deletion sentence, and mark it in the stub comment as the app's to replace.
     - Feature 3: "Built and tested to work by keyboard and to meet WCAG 2.2 AA contrast in both themes."
     - Error page: "The page could not load. Try again in a moment."
     - Map only 404 and 410 to the not-found copy. Every other status below 500 gets the error copy, unless the app passes its own.

8. **Low — The 32 px code cells depart from a design-lead decision, not only `002` decision 10** (decision 11, "Below `sm`, the cells are 32 px squares").
   - The arithmetic holds (READ: 6 × 48 + 2 × 12 + 16 = 328 against 272). 32 px is the only ladder step between 24 and 48 that fits.
   - Two things are missing:
     - `decisions.md` itself says "The code-input cells are 48 px squares" ("Control heights sit on the ladder"). So the design lead records the exception there.
     - The reason should say the 48 px cells fail below a 376 px viewport, which includes the 360 test width and a 375 px phone, not only 320.
   - The card dropping its chrome below `sm` is reasoned and conflicts with nothing binding. Its one defect is finding 1.

9. **Low — Questions a builder would have to ask** (decisions 10 to 13, 15, 16).
   - **Titles.** Each state view's `<title>`: the 12 views that are not page files compose components and set none, and axe's `document-title` fails without one. Fix text: "each view sets its page file's title, with 'Error: ' where a summary shows".
   - **Registry metadata.** The six new items' `title` and `description` are not given. They are shipped copy, and `viewer.spec.ts` check 1 asserts the iframe's `title` from them.
   - **"Forgot your password?"** Decision 4 says it is a prop or snippet "in decisions 10 and 11", but decision 10 lists only `footer`. Name a `passwordHint?: Snippet` beside the password label, or say it goes in `footer`.
   - **Focus on return.** "Use a different email address" must focus the details step's `h1` (check 10). `SignUpForm` has no `focusOnMount`. Give it one.
   - **Description order.** `FieldSet` renders its description after its fields (READ, `field-set.svelte`), so each settings section's line would sit under its last field. Say `*:data-[slot=field-description]:order-first` on each set; a fieldset's rendered legend is not a flex item. Also give the class of the `h2` inside each legend.
   - **Summary target.** The "Technical details" `<summary>` is a counted stop with no stated size. In `text-sm` with no padding it is 21.6 px, under check 24's 24 px. Give it `py-1` or `text-base`.
   - **Toolbar at 320.** The viewer toolbar holds up to 8 controls. Say it wraps (`flex flex-wrap gap-2`), or check 23 can fail on the item pages.
   - **Saved values.** `SettingsForm` updates `values` after a save, but `values` is not bindable. Say it keeps a private saved copy that `dirty` compares against.

10. **Low — The loading status is announced only if the region is already in place** (decision 12, `PageStatesLoading`).
    - On a full load the text appears after hydration, so it is announced.
    - In an app, `PageStatesLoading` is usually mounted when loading starts, on a client-side navigation. The region is then inserted and filled one tick apart. Nothing shows that one tick is enough (INFERRED; patterns memo §0.1: "include them in the initial markup").
    - Fix: state the precondition in the component's comment and the item page. Mount `PageStatesLoading` before loading starts, and drive `loading`. Add it to decision 24's list of what no screen reader has checked.

11. **Low — The error summary is written four times for a reason the spec gave itself** (decision 24).
    - "The scope adds one component" is this specification's own choice. No binding document limits `003` to one item. The patterns memo §8.8 lists "an error-summary / alert" among the primitives the blocks need.
    - Four copies of a contract (role switching, focus, link focusing, target size) also mean three copies in an app that installs sign-in, sign-up and settings.
    - Fix (the author or the design lead): extract `error-summary` as a `registry:ui` item now. It adds 1 item, 2 files and 1 dependency name, and recounts decision 5 and criteria 4, 5 and 10. Or keep the four copies and say why extraction later is cheaper than now.

12. **Low — Two states from the patterns memo have no copy, and the app slots are never rendered** (decisions 10, 11).
    - The patterns memo §8.3 and §8.4 list "email already in use", worded so it does not expose accounts (SC 3.3.3), and "locked or rate-limited". Apps will pass these through `errors.email` and `formError`. Give the house wording, as decision 10 does for the credential failure.
    - No view renders `footer`, `termsHref` or `privacyHref`, so their markup and targets are untested. Inline links in a sentence rely on the 2.5.8 exception, which `002` R21 refuses. Add a fixture on the item page that passes them, with links to `/`.

13. **Low — Citations and small corrections.**
    - Decision 4: the default handler is at `prerender.js:101-110` and `:184-206`; `:630-636` is only its call. Missing ids are checked at `:731-744`; `:208-213` only defines that handler.
    - Decision 12: an unmatched URL under `/page-states/` renders the **root** error page (READ, `respond_with_error.js:37-75`). The installed `page-states/+error.svelte` catches only errors thrown by `/page-states` itself. Reword "handles errors under `/page-states/`".
    - Decision 2 departs from `001` decision 29 ("blocks import only `#lib/registry/ui/...` and `#lib/utils`") by importing `#lib/registry/components/...`. The departure is safe, because an alias covers it, but it should be named.
    - Decision 16's "Tab passes … into the iframe's document" is untested. Test it once, or drop the sentence.
    - The prerendered iframe can finish loading before the viewer hydrates and attaches `onload`. Copy the class on mount as well, when `contentDocument.readyState` is `"complete"`.
    - A link to `/` inside a view, such as the hero's call to action, navigates the iframe to the catalogue, with the site's chrome inside the frame. Note it, or have the views add `target="_top"` to links that leave the view. The views are preview code, not block files.

14. **Low — Size.**
    - Six items, 16 block files, 16 views, a route split, the viewer with its code view, and three new test files. That is near `002`'s load, and it is one builder's work with the checkpoint after step 3. The checkpoint is well placed.
    - Add finding 1's check at 360 to what the checkpoint inspects.
    - Nothing should be cut: the five blocks and the viewer are fixed by `decisions.md`.

## Constitution checks

- **§4.1 source, not a package:** holds.
  - Blocks link only to `/` and to fragments on their own page (decision 4, READ against Kit's crawler).
  - Stubs live in the page files, marked for replacement.
- **§4.2 driven by need:** holds. Criterion 28 is the release, tag `v0.3.0`.
- **§4.3 tokens are the one source:** holds.
  - Every block class is a token or ladder class.
  - The viewer's `w-90`, `w-192`, `w-320` and `h-180` are preview code, outside the lint by `001` decision 24.
- **§4.4 accessible by default:** findings 1, 4 and 5 are defects; finding 10 is unproven. The landmark, heading, autocomplete, paste, one-time-code and destructive-confirm contracts match the patterns memo.
- **§4.5, §4.6:** hold. No new package; `phosphor-svelte` is named by the four blocks that import it.
- **§6, break an installed app silently:** finding 2.
- **`decisions.md`, the `003` calls:**
  - Seven match: hero, sign in, sign up, page states, settings, status and viewer.
  - One takes an exception, the 48 px code cells (finding 8).
  - The summary's `role={null}` from initial props departs from the letter of "an `alert` with `role="alert"`". It is reasoned on `002`'s precondition 2, and it holds.
- **`002`'s decisions:** no item is edited.
  - Decision 10 takes the same exception, named (finding 8).
  - Decision 11's description order is moved by CSS and named.
  - Decision 24's preconditions are honoured, except finding 4.

## Disposition

By the author, 2026-10-28. Four findings were design calls, decided by the design lead in `decisions.md` ("The design calls for `003`, the first blocks", under "After the spec review"); the specification applies them as binding. Decision numbers below are the amended specification's: a new decision 9 (`error-summary`) moved the old decisions 9 to 24 to 10 to 25.

| # | Severity | Finding | Disposition |
|---|---|---|---|
| 1 | Medium | Card clips the focus ring below `sm` | **Fixed.** Decision 11: the frameless card below `sm` takes `max-sm:overflow-visible`; the page's 24 px gutter holds the ring; from `sm` the card keeps `overflow-hidden` and its padding. Decision 12 inherits it. `blocks.spec.ts` check 27 measures 40 of 40 sign-in and sign-up stops at 360 for an unclipped ring; criterion 21; the checkpoint inspects it (decision 24). |
| 2 | Medium | `-o` silently replaces app routes and owned primitives | **Fixed.** Decision 3 makes the CLI fact READ (`commands/add/index.ts` 41, 42, 115; `add-registry-items.ts` 92 to 143), states "blocks are added without `-o`", corrects what the default target guarantees, amends `001` decision 23 for blocks, and puts a note beside each block's install command. The smoke test keeps `-o`, with the reason. `viewer.spec.ts` check 5 asserts the command has no `-o` and the note is present; the changelog carries a line. |
| 3 | Medium | Voice check fails on `status >= 500` | **Fixed.** Unit check 7 now bans only words in the source (with "on our side", "signed in as" and "meets wcag" added). Status numbers are counted in the rendered text: `blocks.spec.ts` check 20, on 17 views and the 404 page, outside `code` elements. |
| 4 | Medium | Second resend is silent | **Fixed.** Decision 12: "Sending a new code…" while each resend runs, then "We sent a new code to {email}." the first time and "We sent another code to {email}." after. Decision 8 states the rule. `blocks.spec.ts` check 9: two resends, 4 of 4 texts in order, each different from the one before. |
| 5 | Medium | Discard drops focus | **Fixed.** Decision 14: after a discard, focus moves to the first field, Name, and the status says "Changes discarded." `blocks.spec.ts` check 17. |
| 6 | Medium | Password default below NIST's single-factor minimum | **Fixed, by the design lead's call.** Decision 12: `passwordMinLength` defaults to 15 (NIST SP 800-63B-4 §3.1.1.2), applied as `Math.max(15, …)` so an app may raise it, never lower it; no `maxlength`, no composition rule. Rules copy and error read 15. `blocks.spec.ts` check 6 (14 refused, 15 accepted, no `maxlength`); unit check 10. |
| 7 | Medium | Shipped strings that mislead | **Fixed, by the design lead's call.** Dropped "We never send marketing email."; email description "Notices about your account go here."; theme description "The colour scheme for this device.", the app applies it; done step "The account for {email} is ready to use."; consent renders only with `termsHref`; deletion line "Account deletion requested.", marked the app's to replace; hero feature 3 "Built for the keyboard", no conformance claim; the error page names no fault ("Try again in a moment."); only 404 says "Page not found", another status below 500 says "This page cannot be shown" with the status in mono, with a new view `/view/page-states/cannot-show/` (status 403) and check 22. Decision 15 states the rule. All new strings lint clean (EXECUTED). |
| 8 | Low | 32 px cells depart from a `decisions.md` entry | **Fixed.** Decision 12 cites the design lead's recorded exception in `decisions.md` as well as `002` decision 10, and gives the 376 px threshold (fails at 360, 375 and 320). |
| 9 | Low | Builder questions left open | **Fixed.** Every view sets its page file's `<title>`, with "Error: " where a summary shows (decisions 11 to 14, 16). Decision 5 gives the 7 new items' titles and descriptions; registry check asserts the titles. "Forgot your password?" goes in `footer` (decision 4). `SignUpForm` gains `focusOnMount` (decision 12). Each settings `FieldSet` takes `*:data-[slot=field-description]:order-first`, and the legend's `h2` its classes (decision 14). The "Technical details" summary is `inline-flex min-h-6` (decision 13; check 21). The viewer toolbar is `flex flex-wrap gap-2` (decision 17). `SettingsForm` keeps a private saved copy (decision 14). |
| 10 | Low | Loading status timing on a client-side mount | **Fixed.** Decision 13 states the precondition (mount `PageStatesLoading` before loading starts), in the component's comment and on the item page; decision 8 states it for `Status`; decision 25's screen-reader limit now names it. |
| 11 | Low | Error summary written four times | **Fixed, by the design lead's call.** New decision 9: `error-summary`, a `registry:ui` item (`role="alert"` when inserted on a failed submit, focusable, a heading, links to the invalid fields, `titleFor` for the "Error: " prefix), with a preview page and a 3-stop keyboard fixture. The design lead's "four blocks" are four components in three blocks (`sign-in-form`, `sign-up-form`, `sign-up-verify`, `settings-form`). Recounted: 39 items (29 `registry:ui`), 153 item files, 24 dependency names, 40 + 40 built files, 57 pages, 214 axe scans, 114 theme checks, 41 catalogue stops, 39 fixture stops over 17 items, 11 behaviours, 102 smoke files. `alert` is now a dependency of `error-summary`, not of the blocks; `phosphor-svelte` moves from three blocks to `error-summary`. |
| 12 | Low | Missing states; app slots never rendered | **Fixed.** House wording for "too many attempts" (`sign-in`, `sign-up`'s code step) and "email cannot be used" (`sign-up`), exported as `MESSAGES`, with the safer don't-tell flow noted (decisions 11 and 12). `/view/sign-in/credentials/` renders a `footer` link and `/view/sign-up/errors/` the consent links, all to `/` (decision 4); view stops become 5 and 8; checks 4 and 11. Consent text is `text-base`, so its inline links are 25.6 px. |
| 13 | Low | Citations and small corrections | **Fixed.** Decision 4's `prerender.js` lines corrected (handler 101 to 110 and 184 to 206; called 630 to 636; missing ids 731 to 744). Decision 13: the installed `+error.svelte` handles only errors thrown by `/page-states`; unmatched URLs render the root error page. Decision 2 names the departure from `001` decision 29. Decision 17 drops the untested claim about Tab inside the iframe, and copies the theme class on mount when the iframe has already loaded. Decision 16 notes that a link leaving a view navigates the frame. |
| 14 | Low | Size | **Accepted.** Nothing cut. The checkpoint after step 3 now also inspects `error-summary` and check 27's rings at 360 (decision 24; criterion 26). |

After the disposition: fit to build.
