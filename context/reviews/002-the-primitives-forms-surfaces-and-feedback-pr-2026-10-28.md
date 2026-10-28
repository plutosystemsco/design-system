# Review of 002 — The primitives: forms, surfaces and feedback (the built change)

- **Status:** complete; awaiting the builder's disposition
- **Date:** 2026-10-28
- **Reviewer:** an agent, Claude, sub-agent of the orchestrating session, fresh to the change; not the author
- **Reviewed:** the uncommitted working tree against `33e94de` (tag `v0.1.0`): 28 tracked files changed (`git diff 33e94de --stat`: 2,595 insertions, 167 deletions) and the untracked code (26 item folders, 26 preview pages, `src/routes/items/+layout.server.ts`, 4 preview components, `tests/e2e/primitives.spec.ts`, `tests/smoke/primitives-add.test.ts`). The five uncommitted `context/` documents were read but are not under review. The builder's 29 deviations were read and checked, not trusted.
- **Re-ran:** under Bun 1.3.14, in the repository unless said otherwise. No `node` or `npx`.
  - `bun run check` → exit 0. `COMPLETED 1045 FILES 0 ERRORS 0 WARNINGS 0 FILES_WITH_PROBLEMS`. Without `--config ./vite.config.ts` the same command also gives 1045 files and 0 errors, plus the prior-art "Error while loading config" noise on stderr. So the flag removes noise and narrows nothing.
  - `bun run lint` → exit 0, "All matched files use Prettier code style!". `bun scripts/lint-literals.ts` → exit 0, "0 literal(s) in registry item files".
  - `bun run build:tokens`, twice → "no changes" both times. SHA-256 `registry.json` `2823b2cb…`, `src/app.css` `c38ba62a…`, and their mtimes, identical before, between and after.
  - `bun run build:registry` (after deleting `static/r` and `static/v0.2.0`) → exit 0. 33 files in `static/r/styles/maia/`, 33 in `static/v0.2.0/r/styles/maia/`, `diff -r` identical.
  - `bun run build` (after deleting `build/`) → exit 0. 33 under `build/r/styles/maia/`, 33 under `build/v0.2.0/…`, 33 `index.html`. `build/v0.1.0/` exists here, copied from `001`'s git-ignored `static/v0.1.0/`, as decision 25 predicts for a working copy.
  - A clean copy (every file `git ls-files -co --exclude-standard` lists, minus `context/`, in the scratchpad) → `bun install --frozen-lockfile` installed 102 packages; `bun run build` exit 0 with 33, 33, **0 under `v0.1.0/`**, and 33 pages. No `.nvmrc`. The copy was deleted.
  - `bun run test:unit` → exit 0. **339 pass, 0 fail**, 2,034 `expect()` calls, 8 files.
  - `bun run test:e2e` → exit 0. **326 passed** (25.8 s), 6 files × 2 projects: axe 68, theme 66, four-dot 28, tokens 70, keyboard 58, primitives 36. No retries configured or reported.
  - `bun run test:smoke` → exit 0. **36 pass, 0 fail**, 585 `expect()` calls, 3 files, 31.3 s. The `beforeAll` did not hang.
  - `bun run dev --port 5391 --strictPort` → `GET /r/styles/maia/index.json` 200, a JSON array of 32. The server was stopped afterwards; port 5391 is free.
  - Screenshots (Playwright 1.64.1 under Bun, `review-002-pr/shots/` in the session scratchpad): the catalogue and 26 item pages, both themes, full page; the alert dialog open in both themes; the input-group and input-otp fixtures focused. Read with the image tool.
  - Probes, all in the scratchpad:
    - Provenance: the clone's 26 maia JSON files at `6149e14` against `meta.stock.sha256` → 25 equal, `native-select` differs. `curl` of the live `button`, `field`, `input-otp`, `tooltip` and `alert-dialog` JSON → 5 of 5 hashes equal `meta.stock`.
    - The builder's install snapshot (`build-002/snapshot-before.sha256`, `-after`) → outside `src/lib/registry/ui/`, only `package.json` and `bun.lock` changed, as decision 4 step 3 allows.
    - A server render (Vite `ssrLoadModule`, `svelte/server`) of a `FieldSet` holding two checkboxes (finding 1).
    - The tooltip page in Chromium at 1280 × 900 and 1280 × 2000 (finding 3).
    - The input-otp page: type "a", then read the cells and the invalid specimen's border (findings 2 and 4).
    - 70 class samples and 6 markup samples through `lintText` (finding 10).
    - The raw `build/items/field/index.html`, read without scripts → 7 of 7 controls carry `id`, `aria-describedby="<id>-description <id>-error"` (both ids present) and `aria-invalid="true"`; each label's `for` names its control; the OTP input also carries `autocomplete="one-time-code"` and `inputmode="numeric"`.
  - `git status` after every run → the same 28 modified tracked files as before; `registry.json` and `src/app.css` hash as before. The runs wrote nothing tracked.

## Acceptance criteria against evidence

1. **Install** — met. EXECUTED: frozen install on the clean copy; `deps.test.ts` checks 23 specifiers and 23 lock versions, plus `packageManager`, `engines` and no `.nvmrc`.
2. **Checks** — met. EXECUTED: 1045 files, 0 errors, 0 warnings; lint exit 0.
3. **Tokens** — met. EXECUTED: two runs, same hashes and mtimes; `tokens.test.ts` has 48 names per theme, 25 primitives, `elevation` on the ladder. READ: `shadow-elevation` is built from `tokens.elevation`, not written by hand (`scripts/build-tokens.ts`).
4. **Contrast** — met. EXECUTED. READ: the 6 scrim rows are literal expected data in the test, not the arithmetic checked against itself.
5. **Generated files** — met. EXECUTED: 4 `css` entries and 3 `cssVars.theme` entries are compared by value.
6. **Registry source** — met. EXECUTED (`registry.test.ts`). READ: order, groups, 11 dependency names, 27 `registry:ui` items, 26 × 5-field `meta.stock`.
7. **Registry build** — met. EXECUTED: 33 and 33, byte-identical, both by the script and in the test's temporary build with 2 planted stale files.
8. **Site build** — met on a clean copy. EXECUTED: 33, 33, 0, 33.
9. **Dev server** — met. EXECUTED: 200 with 32 items.
10. **Preview pages** — met. EXECUTED (existence only, as the criterion asks).
11. **The lint** — met as counted (133 files, 0 violations, 59 of 59 bad, 0 of 36 good). EXECUTED. The rule set has gaps the spec did not list (finding 10).
12. **Named dependencies** — met. EXECUTED: 9 packages; no `tailwind-merge` or `tw-animate-css`. My own read of the 32 built items matches decision 6's table, item by item (files, registry dependencies and packages).
13. **The merge path** — met. EXECUTED: 7 of 7. READ: case (d) would fail on a non-type import from the main entry.
14. **axe** — met. EXECUTED: 68 scans, 0 violations, the open dialog in both themes among them.
15. **Themes** — met. EXECUTED: 66.
16. **Mark and tokens** — met. EXECUTED: four-dot 28 (14 per project), tokens 70 (35 per project).
17. **Keyboard** — met as counted. EXECUTED: 34 catalogue stops in order with the ring; 15 fixtures summing to 34; 9 behaviours, the dialog's initial focus on `[data-slot=alert-dialog-cancel]` among them. The fixture walk checks the count and the outline, not which element each stop is (finding 6). The tooltip behaviour passes only because the test scrolls first (finding 3).
18. **Heights and targets** — met. EXECUTED. READ: the measurements read real boxes of the real items.
19. **Invalid, elevation, scrim** — met as counted. EXECUTED. The criterion names only 3 invalid borders. The code input has none, though decision 18 asks for one (finding 2).
20. **Motion** — met. EXECUTED: 0 loops outside a spinner on 26 pages.
21. **Code input and field wiring** — partly met. EXECUTED: 3 attributes, 3 pastes and 14 of 14 wiring checks, which my own read of the raw HTML confirms. "1 of 1 letter rejected" is vacuous: the check cannot fail (finding 4). The behaviour is right (EXECUTED: the value stays empty).
22. **Smoke** — met. EXECUTED: 36 pass, which is 14 new and `001`'s 22.
23. **Test files** — met. EXECUTED: the three suites, one after another, each exit 0, as `bun run test` chains them. INFERRED: the chain itself exits 0. The clean copy ran install and build, not the suites.
24. **Release** — partly met. EXECUTED: `version` 0.2.0; the `0.2.0` entry names 27 of 27, and `0.1.0` still names 6; 26 of 26 new items carry `meta.since` `"0.2.0"`, and `001`'s six keep `"0.1.0"`. **Not met:** the Landing notes are empty. The comparison with the clone (25 equal, `native-select` differs) exists only in the builder's scratchpad (finding 11).
25. **In the app (done)** — not checkable here, by design.

## Findings, most severe first

There is no High. No item breaks an app that installs it. Both smoke apps install `field`, `alert-dialog`, `input-otp` and `tabs` with their whole trees, build a prerendered page with them, and type-check with 0 errors. No built file holds `#lib`, `$UTILS$.js` or an `/index.js` import, and every relative import names a file the item ships.

1. **Medium — A `FieldSet` gives its context to every control inside it, so a checkbox group is wired wrongly in both of its forms** (`src/lib/registry/ui/field/field-set.svelte:33-51`; `checkbox/checkbox.svelte:26`, `:37-39`).
   - What is wrong: `FieldSet` sets the full `pluto:field` context (id, `describedBy`, `invalid`) for any descendant. Decision 11 meant it for one group control, the radio group. But decision 11 also says "a group of radios or checkboxes uses `FieldSet`", and decision 24 item 8 lists checkboxes in a `FieldSet` for `003`'s settings form. EXECUTED (server render, `FieldSet` with `description` and `error`):
     - Bare checkboxes in the set: both render `id="s1"`, both `aria-describedby="s1-description s1-error"`, both `aria-invalid="true"`. Duplicate ids, and every box is marked invalid.
     - Each checkbox in its own `Field` (the field page's pattern): the boxes get `s7` and `s10` with no `aria-describedby` and no `aria-invalid`. The set's description and error are wired to nothing. The `<fieldset>` carries no `aria-describedby` either.
   - Why it matters: `003`'s settings form will show a group error ("Choose at least one") that no control or group announces. In the bare form the page has duplicate ids. The wiring test checks the radio group only, so nothing catches it.
   - Fix: decide the contract in the specification first. Recommended: `FieldSet` puts `aria-describedby` (and `data-invalid`) on the `<fieldset>` itself, which the `group` role supports. It gives its context only to a group control that asks for it (the radio group). It clears `pluto:field` for other descendants, as it already clears `pluto:field-label`. Add a checkbox-group container to the wiring fixture: no duplicate ids, and the fieldset described by the set's description and error, in the raw HTML and after hydration.

2. **Medium — The code input shows no invalid border, against decision 18, and the deviation is not recorded** (`src/lib/registry/ui/input-otp/input-otp-group.svelte:16`, `input-otp-slot.svelte:19`).
   - What is wrong: decision 18 says "Invalid: `has-[[aria-invalid=true]]:border-destructive` on the group". No input-otp file has an invalid style. Stock's `aria-invalid:border-destructive` on the slot was removed and nothing replaced it. EXECUTED: in the invalid specimen, the real input has `aria-invalid="true"` and the cell border computes `rgb(124, 128, 139)` (`input`), not `--destructive` `#C42A1F`. The screenshots show the same in both themes, on the input-otp page and in the field page's wiring fixture.
   - Why it matters: R3 and the split decision's "one invalid recipe for every control" fail on the control `003`'s sign-up step uses. The error text still says it (R19 holds), so this is a guarantee without evidence, not a silent failure. Criterion 19 checks 3 invalid borders and not this one, so the tests stay green.
   - Fix: put the class where the selector can see the input. The hidden input is not inside `InputOTPGroup`, so the group form cannot match. Use `has-[[aria-invalid=true]]:*:data-[slot=input-otp-slot]:border-destructive` on the `data-slot="input-otp"` wrapper, or a context from the root to the slots. Add input-otp to the invalid-border test (each cell's border equals `--destructive` at 3:1 or more on its ground). Amend criterion 19 to "4 of 4".

3. **Medium — A tooltip opened by Tab on a trigger below the fold closes at once, so decision 19's SC 1.4.13 claim does not hold** (`src/lib/registry/ui/tooltip/tooltip.svelte`, `tooltip-provider.svelte`; bits-ui 2.20.2 `tooltip/tooltip.svelte.js:126-141`; `tests/e2e/keyboard.spec.ts:287-308`).
   - What is wrong: the provider closes any open tooltip on a scroll whose target contains the trigger. Focusing an off-screen trigger scrolls it into view. EXECUTED, Tab from the top of the tooltip page to the fixture's icon button: at 1280 × 900 the page scrolls 387 px and no `role="tooltip"` remains, and the trigger has no `aria-describedby`; at 1280 × 2000, with no scroll, the tooltip shows "Copy". bits-ui offers no prop to turn this off (READ). The behaviour test passes only because it calls `scrollIntoViewIfNeeded()` before focusing. Its own comment says why. Deviation 11 records the finding but leaves it open.
   - Why it matters: SC 1.4.13 asks that content shown on focus stays until focus leaves, the person dismisses it, or it stops being valid. Here it goes while focus stays, and no one dismissed it. The name is on the button, so screen-reader users lose nothing. A sighted keyboard user does: on an icon-only button, the tooltip is the only visible text, and icon toolbars sit below the fold in real pages. I judge this a 1.4.13 failure in that case, not a pass on the strength of the `aria-label`.
   - Fix (needs the orchestrator's call, recommended first): in our `Tooltip` wrapper, when bits-ui closes it while its trigger still matches `:focus-visible` and the close was not Escape or a pointer leave, reopen it on the next animation frame. That keeps bits-ui untouched and the item's own code testable. Change the behaviour test to Tab to the trigger from the top of the page at the default viewport, without scrolling first, and expect the tooltip visible after 300 ms. Or accept the gap in writing, with the reason, in decision 19 and `decisions.md`, and say that `004`/`005` must revisit. Either way, report it upstream to bits-ui.

4. **Medium — "Typing a letter fills no cell" cannot fail** (`tests/e2e/primitives.spec.ts:297-304`, `:336-342`).
   - What is wrong: `filled()` counts cells whose text matches `/\d/`. A cell that accepted "a" holds "a", which `/\d/` does not match, so the count is 0 whether the pattern rejects the letter or not. The check also reads at once after typing, without a poll.
   - Why it matters: criterion 21's "1 of 1 letter rejected" has no evidence. The behaviour is right today (EXECUTED: after typing "a", the input's value is `""` and the 6 cells are empty), but removing `pattern` from `input-otp.svelte` would leave the test green. The builder says some checks were written after their code. This one shows why a check should be seen failing.
   - Fix: assert the input's value is `""` and that every cell's text is empty, after a poll. Check that it fails with `pattern` removed, then restore it.

5. **Low — The alert's default roles are untested, and the preview never renders `role="alert"`** (`src/lib/registry/ui/alert/alert.svelte:55-57`; `src/routes/items/alert/+page.svelte:31`, `:65`, `:68`).
   - Both destructive specimens pass `role={null}`, for a good reason: they are on the page at load. So the built page has no `role="alert"` element (EXECUTED: the one occurrence is the code sample in the text). No test reads any alert's role. Decision 19's role-by-variant contract, and the `"role" in restProps` logic that lets `null` survive, are unproven.
   - The `intro` attribute on line 65 writes `role={null}` inside a quoted Svelte attribute, so the page reads "passes role=," (seen in the screenshot).
   - Fix: a unit or browser check that renders each variant and reads its role (none, `alert`, `status`, `status`), and `role={null}` giving none. On the page, write `role={"{null}"}`, as line 83 already does.

6. **Low — The fixture walk checks how many stops there are, not which** (`tests/e2e/keyboard.spec.ts:186-197`). Decision 23 says the test "checks the element and the outline" at each stop. The test checks only that focus is inside the fixture. A reordered or swapped stop (for example, the disabled button tabbable and the busy one not) would pass while the count holds.
   Fix: give each fixture an expected list of `data-slot`, role or name values, and compare at each stop.

7. **Low — The busy-button test has no positive control** (`tests/e2e/keyboard.spec.ts:209-224`; `src/routes/items/button/+page.svelte:191-212`). "Submit count stays 0" also passes if the `onsubmit` handler never counts. The form is real and the busy button is `type="submit"`, so the test is sound today. It cannot show the counter works.
   Fix: in the same test, set `busy` false (or click a non-busy submit in the same form) and expect 1.

8. **Low — The radio group in a `FieldSet` has no accessible name of its own** (`src/lib/registry/ui/radio-group/radio-group.svelte:26-35`). The legend names the `<fieldset>`. The `role="radiogroup"` inside it is unnamed, and ARIA 1.2 requires a name for `radiogroup`. axe has no rule for it, so 0 violations does not cover it. The wiring test checks only that the fieldset holds a legend.
   Fix: `FieldLegend` takes an id from the set's context, and the radio group sets `aria-labelledby` to it unless the app passes its own. Add the name to the wiring check.

9. **Low — An invalid switch shows nothing on the control** (deviation 14; `src/lib/registry/ui/switch/switch.svelte:35`). The reason holds: decision 14 forbids a track border, so R3's red border has nowhere to go. But the split decision's single invalid recipe then has one control without it, and the spec does not say so. This is the design lead's call: accept it and amend decision 14 and R3, or choose a cue that fits, such as the thumb's border in `destructive`.

10. **Low — Lint gaps the spec's rules imply but its table does not list** (`scripts/lint-literals.ts`). EXECUTED through `lintText`. Each passed:
    - `focus-ring` in any file (`button.svelte`). R2 says `focus-ring` is used "only as decision 8 says", and marks R2 as lint. L13 allowlists only `focus-ring-none`.
    - `inset-x-3.5`: a position offset off the ladder. `top-[-5px]` is caught as an arbitrary value; a fractional step is not.
    - `bg-(--color-red-500)`: a palette colour through the variable form, which is always allowed.
    - `<path fill="red"/>`: a named colour in an SVG attribute.
    - `scale-95`: the zoom "fake depth" decision 3 removed.
    None occurs in the items today (READ: grep). Fix: an allowlist for `focus-ring` (`input-group.svelte`, `input-otp.svelte`); `inset`, `top`, `right`, `bottom`, `left` and `translate-*` on the ladder; `-(--color-<palette>-…)` flagged; named colours in `fill` and `stroke`; `scale-*` flagged. One bad sample each; recount criterion 11.

11. **Low — Criterion 24's comparison is not in the Landing notes** (`context/specifications/002-…md`, Landing notes). The builder's `build-002/provenance.txt` has it: 25 of 26 live items equal the clone at `6149e14`, and `native-select` differs. I reproduced that count, and 5 live hashes. Fix: copy it into the Landing notes when `002` lands, naming `native-select`.

12. **Low — Write-ins for the design lead and the builder, each small.**
    - `table`: a selected row and a hovered row share `bg-accent`, and `aria-selected` on a `<tr>` in a plain `<table>` is exposed to assistive technology only inside a grid (`table-row.svelte:17`). "The state is not the inset alone" holds in the markup only. Design lead: a second visual cue for selected (for example a leading `border-l-(length:--focus-width) border-l-primary`), or reword decision 19.
    - `item`: `ItemGroup` is `role="list"` and leaves `role="listitem"` to the app (deviation 19). That is stock (READ: the clone's `item.json`), but it is a trap that axe flags. `Item` could set `listitem` itself when a group context is present.
    - `deps.test.ts:93-99`: `named.set` keeps the last range when two items name one package differently, so a disagreeing item could hide. Collect every range, and expect one per package.
    - The button page's keyboard fixture holds two blue primaries (Default and the busy submit). It is a specimen page, but the page states "one blue default per surface". Make the busy submit `secondary`, or say why not.

## The builder's deviations, checked

- **Hold**, each checked against the code or a run: 1, 2, 3, 4 (smoke assertion 4 passes over 84 properties), 5, 6, 7, 10, 12 (the open specimen is open at load: EXECUTED, 1 tooltip), 13, 15, 16 (the same 1045 files with or without the flag: EXECUTED), 17, 18, 19 (stock: READ), 20 to 26, 28 (my clean copy reproduces 33, 33, 0, 33), 29.
- **Process, admitted:** 8, 27. Finding 4 shows a late check that cannot fail.
- **The reason holds, the outcome does not:** 11, which becomes finding 3. 14 is a design call (finding 9).
- **Not recorded:** the missing invalid border on the code input (finding 2). The `FieldSet` scope (finding 1) is a gap in the specification as much as in the build.

## Constitution checks

- **§4.1 source, not a package:** holds. READ: built items carry source with `$UTILS$`, `$UI$` and app aliases. Cross-item imports (`button` → `spinner`, `field` → `label`/`separator`, `input-group` → `button`/`input`/`textarea`, `alert-dialog` → `button`, `item` → `separator`) are each a registry dependency. The one relative import, `./field-context.svelte.js`, names a file `field` ships. Nothing imports `src/lib/preview/`. EXECUTED: both smoke apps build and check.
- **§4.2 in tandem:** criterion 25 waits on `wasi-python-dev`, as designed.
- **§4.3 tokens are the one source:**
  - No hex, colour function, palette class, `style` or numeric arbitrary length in the 129 new files. EXECUTED: the lint and my own grep.
  - `dark:` appears only on the two sanctioned alert tints. `rounded-full` appears only in `four-dot.svelte` and `radio-group-item.svelte`. READ: grep.
  - `muted` and `accent` appear only as insets: the tab strip, skeleton, `kbd`, avatar fallback and count, empty and dialog icon tiles, the table footer, and hover and selected rows. None is an item's own ground. No state tint sits inside an inset: badges are untinted, and alerts are never in an inset on any page. READ, and seen in the screenshots.
  - `bg-[Canvas]` and `text-[CanvasText]` are the named system-colour use. `sideOffset = 4` is the named size literal.
  - The lint has gaps (finding 10).
- **§4.4 accessible by default:**
  - axe 0 in 68 scans (EXECUTED). Keyboard: 34 plus 34 stops, all with the 2 px ring (EXECUTED).
  - Icons in items are `aria-hidden` (READ: `spinner`, `checkbox`, `native-select`, `input-otp-separator`, the radio dot). Icons passed in by an app need their own `aria-hidden`; the pages say so (deviation 29).
  - The busy button stays enabled, focused and `aria-busy` (EXECUTED by the suite). The dialog starts on Cancel, traps, closes and returns focus (EXECUTED). The OTP input has paste, `one-time-code` and `numeric` (EXECUTED). Field wiring is in the raw HTML for 7 of 7 (EXECUTED).
  - Findings 1, 2, 3 and 8 stand against this section.
- **§4.5 pinned:** holds. EXECUTED: frozen install on the clean copy; the lock resolves the 4 new packages at 2.20.2, 3.12.4, 3.3.1 and 3.1.1 (`deps.test.ts`).
- **§4.6 named dependencies:** holds. READ: every new item names `utils` and `pluto-theme`; the 8 `tv` items name `tailwind-variants@^3.3.1` and import `/lite`; no `tailwind-merge`, no `tw-animate-css`. EXECUTED: 9 named packages, each equal to `package.json`.
- **§6 never:**
  - No commit: `git log` still ends at `33e94de`.
  - No copying: the 26 items are stock source installed by the locked CLI and restyled. That is using a dependency (§4.6). The provenance proves the source: 26 hashes recorded, 5 re-fetched and equal.
  - No silent break: `001`'s six items are unchanged in interface; `pluto-theme`'s additions are marked additive in `CHANGELOG.md`.
- **Decision 1, Bun everywhere:** holds in the change. READ: every new script and spawn uses `bun --bun` or `process.execPath`.

## Verdict

Does not land yet: findings 1 to 4 stand. A `FieldSet` miswires checkbox groups (1). The code input has no invalid border (2). A tooltip reached by Tab below the fold vanishes (3); its fix needs the orchestrator's call. The letter-rejection check cannot fail (4). Every other countable criterion reproduces at the specification's numbers, and no item breaks an installing app.

## Disposition

To be filled by the builder.

| # | Severity | Finding | Disposition |
|---|---|---|---|
| 1 | Medium | `FieldSet` context miswires checkbox groups | Fixed, by the design lead's call (decisions.md, "A set carries its own wiring"). `FieldSet` no longer sets `pluto:field`; it puts `aria-describedby` and `data-invalid` on the `<fieldset>` and sets `pluto:field-set`, read only by `radio-group` (`field/field-context.svelte.ts`, `field-set.svelte`, `radio-group/radio-group.svelte`). The wiring fixture gains two checkbox sets, bare and in `Field`s, checked raw and hydrated for distinct ids, no shared `aria-invalid` or `aria-describedby`, and the fieldset's own description (`tests/e2e/primitives.spec.ts`, `src/routes/items/field/+page.svelte`). Seen failing with the fieldset's `aria-describedby` removed. |
| 2 | Medium | No invalid border on the code input | Fixed: the `data-slot="input-otp"` wrapper turns every cell `border-destructive` when the hidden input is `aria-invalid` (`input-otp/input-otp.svelte`). The invalid specimen is measured in the invalid-border test, now 4 of 4 (`primitives.spec.ts`, `src/routes/items/input-otp/+page.svelte`). Seen failing without the class. |
| 3 | Medium | Tooltip closes when Tab scrolls its trigger into view | Fixed, by the design lead's call (decisions.md, "A tooltip reached by keyboard stays open"): `tooltip.svelte` reopens on the next frame while the trigger keeps keyboard focus (`:focus-visible`), unless Escape or the pointer dismissed it, which `tooltip-trigger.svelte` records. The behaviour test tabs from the top at 1280 × 900 with no scroll and expects `role="tooltip"` visible (`tests/e2e/keyboard.spec.ts`). Seen failing with the reopen disabled. Upstream report to bits-ui left to the owner. |
| 4 | Medium | Letter-rejection check cannot fail | Fixed: after a wait and a poll, the input's value is `""` and all 6 cells are empty (`primitives.spec.ts`). Seen failing with `pattern` removed from `input-otp.svelte`, then restored. |
| 5 | Low | Alert default roles untested; "role=," on the page | Fixed: alerts carry `data-variant` (`alert/alert.svelte`); the alert page inserts the four variants and a `role={null}` alert on a button press, and a test reads none, `alert`, `status`, `status`, none (`primitives.spec.ts`). The intro writes `role={'{null}'}` (`src/routes/items/alert/+page.svelte`). Seen failing with caution's role removed. |
| 6 | Low | Fixture walk does not check which element each stop is | Fixed: each of the 15 fixtures lists its stops' role and name, compared at every stop (`keyboard.spec.ts`). |
| 7 | Low | Busy-button test has no positive control | Fixed: a "Stop busy" control outside the fixture turns busy off, and the same button's click then counts 1 (`keyboard.spec.ts`, `src/routes/items/button/+page.svelte`). Seen failing with the counter disabled. |
| 8 | Low | Radio group in a `FieldSet` unnamed | Fixed: `FieldLegend` takes `<id>-legend` from the set and registers it; the radio group's `aria-labelledby` names it unless the app passes its own (`field/field-legend.svelte`, `field-set.svelte`, `radio-group/radio-group.svelte`). The wiring check asserts it. Seen failing with the name removed. |
| 9 | Low | Invalid switch has no cue on the control | Answered, by the design lead's call (decisions.md, "A switch shows invalid only in words"): no track border; the switch page now says a required consent is a checkbox, not a switch (`src/routes/items/switch/+page.svelte`). |
| 10 | Low | Lint gaps | Fixed: L15 `focus-ring` allowlisted to `input-group.svelte` and `input-otp.svelte`; L16 numeric position and translate offsets on the ladder; L17 palette colours through the variable form; L18 `scale-*`; named colours in SVG paint attributes (`scripts/lint-literals.ts`). 5 bad and 3 good samples added: criterion 11 now 64 of 64 and 0 of 39 (`tests/unit/literals.test.ts`). Each new sample failed before the rules. |
| 11 | Low | Clone comparison not in the Landing notes | Answered: the comparison (25 of 26 equal at `6149e14`, `native-select` differs by one type line) is in the build's `provenance.txt`, and goes into the Landing notes when `002` lands; the builder was told not to write them yet. |
| 12 | Low | Write-ins: table selection, `ItemGroup`, `deps.test.ts`, two blues on the button page | Fixed. Table, by the design lead's call: a selected row keeps `bg-accent` and adds `border-l-(length:--focus-width) border-l-primary`; no `aria-selected`; the preview's rows carry a checkbox bound to the selection (`table/table-row.svelte`, `src/routes/items/table/+page.svelte`). `ItemGroup` sets a context and `Item` renders `role="listitem"` in it (`item/item-group.svelte`, `item.svelte`). `deps.test.ts` collects every range per package and expects one. The busy submit is `secondary`. |

## Addendum by the orchestrating session (2026-10-28, after the Disposition)

Two changes made by the orchestrator while verifying the dispositioned change, both EXECUTED under Bun 1.3.14.

1. **A flaky wait in two browser specs.** One full `bun run test` failed once: `primitives.spec.ts` "elevation and scrim", dark project, `evaluate: AbortError: The user aborted a request` at `await Promise.all(document.getAnimations().map((a) => a.finished))`. A cancelled animation rejects its `finished` promise, so a page-wide wait on every animation is a race with whatever leaves the page. `tests/e2e/pages.ts` gains `settled(page)`, which skips infinite animations (a spinner never finishes) and treats a cancelled one as finished; the three page-wide waits in `axe.spec.ts` and `primitives.spec.ts` use it. The two specs then passed 3 of 3 runs, and the full suite 2 of 2 (unit 348, browser 330, smoke 36).
2. **The table page failed in development only.** A screenshot walk of the finished pages on `bun run dev` showed `/items/table/` as SvelteKit's "500 Internal Error" page. The dev log: `Svelte error: props_invalid_value — Cannot do bind:checked={undefined} when checked has a fallback value`, at `checkbox.svelte:35`. The preview's `selected` map held only the one selected row, so every other row bound its checkbox to `undefined`. This is a development-mode check in Svelte 5; the production build Playwright tests against renders the page, which is why every suite passed. Fix: `src/routes/items/table/+page.svelte` initialises `selected` with every row id (`Object.fromEntries(runs.map(...))`). A walk of all 33 pages in both themes on the dev server, collecting `pageerror`, `console.error` and `console.warning`, then found 0 pages with errors (66 of 66). The browser suite re-ran green (330). Lesson for `003`: the browser suites run against the production build (`playwright.config.ts`), so a development-only error is invisible to them; the orchestrator's dev-mode walk should become a test, or the preview build should run with `dev: true` checks, which a later specification can decide.

The verdict stands as dispositioned: the change lands, with these two additions, when the owner asks for the commit.
