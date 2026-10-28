# Review of 002 — The primitives: forms, surfaces and feedback

- **Status:** complete; awaiting the author's disposition
- **Date:** 2026-10-28
- **Reviewer:** an agent, Claude, sub-agent of the orchestrating session, fresh to the specification; not the author
- **Reviewed:** the specification as drafted, 2026-10-28 (`specifications/002-the-primitives-forms-surfaces-and-feedback.md`, 723 lines), against the constitution, `decisions.md`, `001`, the three memos of 2026-10-28 and the two of 2026-10-27, and the code it extends.
- **Re-ran:** in the session scratchpad (`review-002/`), under Bun 1.3.14. Nothing in this repository was written except this file.
  - Decision 7's scrim table, with `compositeAlphaByte` and `contrastRatio` imported from `scripts/contrast.ts` → 6 of 6 composited grounds and ratios agree (3.64, 3.45, 3.95, 4.34, 4.17, 3.95). The rejected alpha `0x73` gives 2.95 on light `card`, as stated. Paper under the dark scrim is `#6F7072`, as stated. The dark dialog surface against its scrimmed ground measures 1.02 to 1.12, so the dark edge carries all the separation, as the spec says.
  - Not in the spec, checked anyway: `muted-foreground` on the 8 state-tint grounds → 4.79 to 7.09, all pass. A state tint over `muted`/`accent` → 4.06 light, 3.96 dark (finding 3).
  - `bun pm view` → `bits-ui` 2.20.2, `phosphor-svelte` 3.1.1, `@internationalized/date` 3.12.4, `tailwind-variants` 3.3.1. `tailwind-variants`' `tailwind-merge` and `tailwindcss` peers are optional. `phosphor-svelte`'s `vite` peer is optional, and `vite` is in the CLI's `IGNORE_DEPS` anyway (READ `deps-resolver.ts:80`).
  - The 26 stock maia items at `6149e14` (built JSON in the prior-art clone) → file counts match decision 6 once its three stated changes are applied: 129 files. Registry dependencies match (`field` → `label`, `separator`; `input-group` → `button`, `input`, `textarea`; `alert-dialog` → `button`; `item` → `separator`).
  - Tailwind 4.3.3 (`@tailwindcss/node` `compile`, from this repository's `node_modules`) on `shadow-elevation`, `animate-enter`, `data-closed:animate-exit`, `h-lh`, `has-[:focus-visible]:focus-ring`, `focus-visible:focus-ring-none`, the input-group `has-[[data-slot=…]:focus-visible]:focus-ring` form and `bg-[Canvas]` → each emits what the spec intends. The two-part elevation shadow keeps its `var(--line-width)` spread.
  - Chromium (this repository's `playwright-core`) on decision 10's recipe → an `aspect-square` icon button with `py-2`, a 1 px border and a `1lh × 16px` icon measures **18.00 × 43.59 px**; with `px-3`, 42.00 × 43.59. An input measures 43.59 tall, as stated. A 24 × 48 switch track with stock's 1 px transparent border and `p-1` lets a 16 × 24 thumb at `translate-x-4` overflow by 2 px right and 2 px bottom (findings 2 and 6).
  - `tailwind-variants` 3.3.1 as installed in the blocks memo's scratch app (no `tailwind-merge` in its `node_modules`) → `tv` merges `px-3` + `px-4` to `px-4` by itself; `tailwind-variants/lite` leaves `px-3 px-4` and `cn` then merges. Ten samples of our custom classes: no disagreement between `tv` and `cn` (finding 7).
  - bits-ui 2.20.2 source, in Bun's install cache → `AlertDialog.Content`'s default `onOpenAutoFocus` prevents the default and focuses the **content node** (`alert-dialog/components/alert-dialog-content.svelte:51-59`) (finding 1). `Separator` defaults to `decorative = false`, so `role="separator"` (`separator/components/separator.svelte:14`) (finding 9). Agree with the spec: PinInput's `autocomplete="one-time-code"` and `inputmode="numeric"` defaults, its inline `outline: 0 solid transparent`, its paste path; Tooltip's `aria-describedby` while open; Tabs' automatic activation; Checkbox ignoring Enter; Switch's `role="switch"`.
  - Every count in decisions 1, 2, 6, 21 and 23 and criteria 1 to 24, recomputed from the spec's own tables → all agree except the Scope line's test-file split (finding 14).

## Verdict

Does not land yet (ready after fixes): findings 1 and 2 are High. The alert dialog does not start on Cancel under bits-ui's default, and decision 10's square controls do not come out square. Each makes a criterion fail as written. Findings 3 to 8 are Medium. Findings 4 and 5 and part of 2 need the design lead or the owner, not only the author.

## Acceptance criteria against evidence

1. **Install** — countable (19 + 4 = 23, READ). Can be met. The pin step's order can leave the wrong specifier (finding 8) (INFERRED).
2. **Checks** — countable. `svelte-check` proves the phosphor names (decision 20) (INFERRED).
3. **Tokens** — countable: 48 names, 25 primitives, each new hex distinct, as `validateTokens` requires (READ `scripts/tokens.ts`).
4. **Contrast** — countable. The 6 scrim rows reproduce (EXECUTED).
5. **Generated files** — countable: 2 + 2 + 3 = 7 (READ). Emission is consistent with `001` decision 15, given `@utility groove` already sits in `css` (READ `scripts/build-tokens.ts:120`).
6. **Registry source** — countable: 32 items, 5 groups summing to 6 + 3 + 7 + 6 + 10 = 32, 11 dependency names, 27 `registry:ui` items (READ).
7. **Registry build** — countable: 33 and 33 (READ).
8. **Site build** — countable: 33 pages, 0 under `v0.1.0/` (READ).
9. **Dev server** — countable (READ).
10. **Preview pages** — countable (READ).
11. **The lint** — countable: 27 + 29 = 56 bad, 12 + 22 = 34 good, 133 files (READ). The sample lists recount exactly. One rule gap (finding 11) (READ).
12. **Named dependencies** — countable: 5 + 4 = 9 (READ).
13. **The merge path** — countable, but case 1 does not test what decision 2 claims (finding 7) (EXECUTED).
14. **axe** — countable: 33 × 2 + 2 = 68 (READ).
15. **Themes** — countable: 66 (READ).
16. **Mark and tokens** — countable (READ).
17. **Keyboard** — countable: 34 catalogue stops; 34 fixture stops over 15 items (7+1+1+1+4+2+2+2+4+2+3+1+2+1+1); 9 behaviours (READ). **Not met as written:** the dialog's initial focus is the content, not Cancel (finding 1) (READ bits-ui source).
18. **Heights and targets** — countable. **Not met as written:** the icon button is 18 px wide, so "0 controls under 24 × 24" fails; the OTP cells fail the same way (finding 2) (EXECUTED).
19. **Invalid, elevation, scrim** — countable. Can be met (INFERRED).
20. **Motion** — countable. Can be met (INFERRED).
21. **Code input and field wiring** — countable, but the wiring check covers 1 of the 7 controls that read the context, and only after hydration (finding 4) (READ).
22. **Smoke** — countable: 12+2+2+13+2+2+5+5+1 = 44 files; 7 × 2 = 14 (READ).
23. **Test files** — countable: 8, 6, 3 (READ).
24. **Release** — countable: 27 and 6 (READ).
25. **In the app (done)** — not checkable here, by design, as `001`'s criterion 24 (READ).

## Findings, most severe first

1. **High — The alert dialog opens on its own container, not on Cancel** (decision 17, `002…md:400`; decision 23 behaviours, `:529`; criterion 17).
   - What is wrong: decision 17 says Cancel gets initial focus because it is first in the footer and bits-ui focuses "the first focusable". bits-ui 2.20.2's `AlertDialog.Content` does not. Its default `onOpenAutoFocus` calls `preventDefault()` and focuses the content node itself (READ, `alert-dialog-content.svelte:51-59`). Also, the footer's child order is the app's markup, not the item's, so markup order guarantees nothing.
   - Why it matters: the accessibility contract ("start on the safe choice") is not delivered. The keyboard behaviour "focus is on Cancel; Tab goes to Action; Tab again returns to Cancel" fails: from the content, Tab reaches Cancel first. The focused container also draws `001`'s global ring around the whole dialog after a keyboard open.
   - Fix: our `AlertDialogContent` passes its own `onOpenAutoFocus`. It prevents the default and focuses the element with `data-slot="alert-dialog-cancel"` inside the content, falling back to the content when there is none. Cite the bits-ui lines as READ. Keep the test, which now proves the item's code, not a default.

2. **High — Decision 10's square controls are not square, and the derived height has no class that can size a width** (decision 10, `:284`; decision 18 cells, `:414`; criterion 18).
   - What is wrong: `aspect-square` with vertical padding only does not make a 43.6 px square. With both sizes `auto`, the ratio derives the block size from the inline size, and content then forces the height. Chromium measured the icon button at **18.00 × 43.59 px**, and 42.00 × 43.59 with `px-3` (EXECUTED). The OTP cells (`aspect-square py-2`, one character wide) fall the same way (INFERRED, same rule). L7 then forbids every class that could set the width: 43.6 is no ladder multiple, and there is no token for it.
   - Why it matters: criterion 18's "0 controls under 24 × 24" fails on the default icon button. The 18 px width also fails the house rule of 24 px, and an `icon-sm` would be narrower still. The builder cannot fix it inside the spec's rules without a design decision.
   - The reason for 43.6 is also incomplete. The owner's ladder decision says "nothing off it". `001` decision 13 keeps hairlines in px because fractional positions blur, and stacked 43.6 px rows put every following border at a fractional offset. The spec does not say why a derived height beats a ladder height, and L7 itself allows `h-12` (48) and `h-8` (32).
   - Fix (design lead's call, recommended first): (a) controls take ladder heights: default `h-12`, `sm` `h-8`, `lg` dropped or `h-16`. Icon buttons and OTP cells use `size-12` / `size-8`, with content centred. Criterion 18 becomes 48 ± 0.5 and 32 ± 0.5. Or (b) add a `control` size token (for example 44 px), used as `h-(--control)` and `size-(--control)`. Either way, decision 10's table, the heights fixture and criterion 18 are recomputed, and the reason is stated against the ladder decision.

3. **Medium — Tinted badges and alerts will sit on `accent` rows, which `001` forbids** (decision 19 `badge`/`alert`, `:426-427`; `table` and `item` rows, `:432`, `:441`; R7).
   - What is wrong: `table` paints hover and selected rows `bg-accent`, and a link `item` hovers to `bg-accent`. The badge's `destructive` and `success` variants are the `/10` and `/20` tints. A badge inside such a row is a state tint inside an inset: destructive/10 over light `accent` measures 4.06, destructive/20 over dark 3.96 (EXECUTED; `001` decision 12's forbidden pairs). The primitives memo composes exactly this: run metadata as `item` rows with a `badge` for how a run ended, and `/admin` tables with badges (§1.2).
   - Why it matters: R7 leaves this to review, but the items make the failing composition the natural one. The home page and `/admin` will fail AA in a selected row, which is a wrong answer by construction.
   - Fix: give the badge's state variants no tint: `border-destructive text-destructive` on a transparent ground (destructive on `accent` 4.71 light, 5.53 dark; `001` rows L16 and D16), and the same with `success` (5.23 and 6.55). Keep the tint only on `Alert`, whose context is a panel. Or keep the tints and add a stated rule and a preview fixture showing what a row badge uses instead. This is a design-lead call; the first option is recommended.

4. **Medium — Field wiring is unproven for six of seven controls and absent from server-rendered HTML** (decision 11, `:303-306`; decision 23 field wiring, `:536`; criterion 21).
   - What is wrong: `FieldDescription` and `FieldError` "register themselves when mounted". A mount hook never runs during server rendering. Even registration at script init runs after the control has rendered, because the control comes first in the markup. So the prerendered or server-rendered HTML carries no `aria-describedby`, and the attribute appears only after hydration (INFERRED from Svelte's render order). `003`'s sign-in form will be server-rendered with its errors after a failed POST. The context is also a string-keyed contract copied into 7 controls (`input`, `textarea`, `native-select`, `checkbox`, `switch`, `radio-group`, `input-otp`), and the test checks only `input`.
   - Why it matters: `003` relies on this wiring for every form (decision 24, item 3). A typo in one control's key or shape fails silently. Before hydration, or without JavaScript, a field's error is not tied to its control.
   - Fix: make `describedBy` computable before the control renders. For example, `Field` takes `description` and `error` props or snippets, or `FieldError` always renders its element (empty when valid), so the ids are known up front. Add a test on the raw prerendered HTML of the `field` page. Extend the wiring check to each of the 7 controls inside a `Field`, with `id`, `aria-describedby` and `aria-invalid` on the right element, and count them (7 of 7).

5. **Medium — Round radios contradict a binding decision, and the spec leaves the contradiction open** (decision 19 `radio-group`, `:439`; decision 28, `:606`; L11).
   - What is wrong: decisions.md says "The four-dot stays the page's only circles". The spec keeps the radio round as "dot-derived", names the conflict, and says it "does not block the build". v2's "dot-derived" means derived from the mark's dots. A radio's dot is a generic UI convention, and decisions.md applied that same reading to refuse round avatars. The checkbox at 24 px with the 8 px radius is already a visibly rounded square, so a radio can be told apart by its inner dot alone (INFERRED).
   - Why it matters: L11's allowlist, the radio's geometry, its preview and the axe and keyboard runs all depend on the answer. A recorded decision should not be overridden by a specification's default.
   - Fix: the design lead (or the owner) decides before build, and decisions.md records it. If the circle stays, amend the decision's wording ("the mark and the radio"). If not, the radio becomes a `size-6 rounded` box with a `size-3 rounded` dot, and L11's allowlist is `four-dot.svelte` alone.

6. **Medium — The switch thumb is a stadium, and stock's border breaks its travel** (decision 14, `:366`).
   - What is wrong, in two parts.
     - The reason given, that a 16 × 24 thumb with 8 px corners is "a rounded bar", not full round, is false. An 8 px radius on a 16 px tall box rounds each end to a half circle. That is the shape `rounded-full` draws on that box (INFERRED from CSS geometry). So the thumb is the "in between" shape v2 §05 refuses.
     - The spec lists the track's new classes but does not say to remove stock's `border border-transparent`. With that border kept, the thumb overflows the track by 2 px on the right and at the bottom (EXECUTED).
   - Why it matters: the reason does not hold against v2 or the circles decision. And a builder who restyles class by class gets a broken control.
   - Fix: say "no border on the track". For the shape, either accept the stadium as dot-derived, deciding it together with finding 5, or use a thumb taller than 16 px. For example: track `h-8 w-16 p-1` (32 × 64), thumb `size-6` (a 24 px rounded square), travel `translate-x-8`. All are ladder steps, and 24 + 32 = 64 − 8.

7. **Medium — "`cn` is our one merge engine" is false: `tailwind-variants` 3.3.1 bundles its own** (decision 2, `:68`; decision 23 test 8, `:518`; criterion 13).
   - What is wrong: `tailwind-variants` 3.3.1's main entry carries an internal copy of tailwind-merge's engine (`src/internal/merge/create-tailwind-merge.ts` in its `dist/index.js`) and merges by default. With no `tailwind-merge` installed, `tv({ base: "px-3", variants: … "px-4" })` returned `"px-4"` (EXECUTED). The stock prerender the spec cites ran that engine. It does not show that `cn` is the only one.
   - Why it matters: two engines merge every variant class, with different class tables. Test case 1 passes because `tv` has already merged, so it proves nothing about `cn`, and the stop rule watches the wrong thing. `004` and `005` inherit the premise. No disagreement showed on ten custom-class samples (EXECUTED), so this is a guarantee without evidence, not a defect seen.
   - Fix: import `tv` from `tailwind-variants/lite` in every item. `lite` does not merge (EXECUTED: `"px-3 px-4"`), so `cn` really is the one engine. Then test case 1 asserts that `tv` leaves both classes and `cn` keeps `px-4`. Or keep the main entry, state that two engines exist, and test their agreement on our custom classes (`tracking-*`, `font-heading`, `shadow-elevation`, `focus-ring*`, `animate-*`).

8. **Medium — The install's safety check cannot be read while `001` is untracked, and the pin order is ambiguous** (decision 4, `:92`, `:99`; decision 2, `:71`; decision 28, `:607`).
   - What is wrong: all of `001` is untracked (`git status` shows `?? src/`, `?? tests/` and so on). So "`git status` must show new files only under `src/lib/registry/ui/<name>/`" cannot be observed. The snapshot covers 4 files of a tree of hundreds. Separately, decision 2 says to set the caret specifiers by hand and then run `bun add <name>@<version>`. That order can leave whatever specifier `bun add` writes, not the caret `deps.test.ts` expects.
   - Why it matters: the procedure's one guarantee, that the install leaves `001` untouched, has no evidence. And criterion 1 can fail on a specifier.
   - Fix: snapshot the whole working tree before and after (the file list from `git ls-files -co --exclude-standard` with a SHA-256 of each), and compare. Better, put the commit and the `v0.1.0` tag to the owner **before build step 3**, not "before `002` lands". That is an owner question under AGENTS.md (AskUserQuestion; recommend committing first). For the pins: run `bun add <name>@<exact>` first, then set the caret specifier, then `bun install`, then check that `bun.lock` is unchanged.

9. **Low — `separator` is not decorative by default, and the groove needs a height** (decision 19 `separator`, `:431`).
   - bits-ui's `Separator` defaults to `decorative = false`, so it renders `role="separator"` (READ). Stock does not override it.
   - The groove's 1 px highlight is an inset shadow. On a zero-height element it is clipped away, and stock's `h-px` is banned by L7.
   - Fix: "the item sets `decorative = true` by default; horizontal is `groove h-(--line-width) w-full`."

10. **Low — The live-region contracts lean on behaviour live regions do not have** (decisions 16, 19 `alert` and `spinner`, 24).
    - `Alert`'s `role="status"` for `success` and `caution` is announced only if the element exists before its text changes (patterns memo §0.1, MDN). A conditionally rendered success alert is unreliable, which is the spec's own argument for `003`'s `status` item.
    - A labelled `Spinner` (`role="status"` plus `aria-label`, no text) gives a live region with no content to announce (INFERRED).
    - `FieldError` with no role is sound only if errors appear on submit, with focus moved to the summary or the alert.
    - Fix: state these three as preconditions in decision 24. Give the labelled spinner visually hidden text rather than `aria-label`. Say how an app removes the variant's default role, for example by passing `role={null}`.

11. **Low — Border widths are literal sizes, and the lint has no rule for them** (decision 19 `alert` caution `border-l-4`; decision 15 `border-b-2`; `avatar` `border-2`; constitution §4.3).
    - These widths come from no token, and nothing flags `border-<n>`. The amber bar also measures 1.95 on `card`. That is acceptable only because the title carries the state, and the spec should say so.
    - Fix: use `border-(--focus-width)` or `border-b-(--focus-width)` (2 px), and a token for the 4 px bar or `--focus-width` doubled. Add an L14 for `border(-side)-<n>` other than the bare 1 px `border`, with a bad and a good sample.

12. **Low — Two reasons misread SC 2.5.8** (decision 19 `badge`, `:426`; decisions 10 and 12, stock `xs`).
    - "A 20 px badge as a link would miss SC 2.5.8" and "under our recipe they would be 20 px, below SC 2.5.8's 24" both treat 24 × 24 as absolute. 2.5.8 passes undersized targets through its spacing and inline exceptions (patterns memo §0.1).
    - Fix: keep both calls as a house rule ("every target at least 24 × 24, stricter than AA") and cite it as such.

13. **Low — Stock imports carry `.js` extensions; the spec does not say whether they stay** (decision 4; `001` decision 2).
    - Every stock file imports `$UTILS$.js` and, for example, `$UI$/button/index.js` (READ, built JSON). `001` decision 2 rejected the `.js` form for our files because the extension travels into every app.
    - Fix: "the restyle makes `#lib` imports extensionless", plus a `registry.test.ts` assertion that no built file contains `$UTILS$.js` or `/index.js"`. Or amend `001` decision 2 with a reason.

14. **Low — Small corrections.**
    - The OTP `pasteTransformer` strips only spaces and hyphens. A code pasted with a trailing newline or tab is rejected whole, which is the SC 3.3.8 failure the decision guards against. Strip every non-digit (`/\D/g`) (READ, the paste path).
    - The tooltip repeats the icon button's `aria-label` and is wired as its description, so screen readers read the name twice. Note it, or leave the description off when the text equals the name.
    - "Hover darkens the border to `border-foreground`" lightens it in dark (paper on `blue-lifted`, 2.45). Reword.
    - The `table` footer's `bg-muted` is not in R8's list of insets (`:253`). Add it or change it.
    - Scope says "6 browser files (5 updated, 1 new)" (`:678`), but `four-dot.spec.ts` is unchanged: 4 updated.

15. **Low — Size is at the limit for one builder.** 26 restyles, 26 preview pages with five sections each, 13 lint rules, provenance and three suites. The split decision fixes the 26, so nothing should be cut. Add a review checkpoint after build step 4 (the shared recipe on `button`, `input` and `field`), where findings 2 and 4 bite first. If time runs short, the deferrable parts are the Landing-notes comparison with the prior-art clone (criterion 24's last sentence) and the `table` `label` region.

## Constitution checks

- **§4.1 source, not a package:** holds. Items carry source and name their packages.
- **§4.2 in tandem:** holds. Criterion 25 mirrors `001`'s built and done split.
- **§4.3 tokens are the one source:**
  - Colour holds. `bg-[Canvas]` is named as the one system-colour use.
  - Sizes: three literal border widths (finding 11). The `sideOffset={4}` literal is named and reviewed.
  - The 43.6 px height is token-derived but off the ladder (finding 2).
- **§4.4 accessible by default:** findings 1, 2, 3 and 4. The contrast arithmetic holds (EXECUTED).
- **§4.5 pinned:** holds, after finding 8's ordering fix.
- **§4.6 named dependencies:** holds. Every item names `utils` and `pluto-theme`. No `tailwind-merge`, no `tw-animate-css`, `phosphor-svelte` named.
- **§6:** no commits. Restyling installed stock source is using a dependency (§4.6), not copying. The changelog marks the `pluto-theme` additions.
- **decisions.md, the thirteen design calls:**
  - Twelve match: the split and the 26; whole trees served from here; the spinner allowed and the skeleton static; sentence case; state colour outside the accent budget; the focus and invalid recipe (with two named, allowlisted utilities); square avatars; blue switches; the busy button; two tokens (as three colours and one size key); OTP with paste and `one-time-code`; no `tw-animate-css`; phosphor.
  - One does not: round radios (finding 5).
- **`001`'s decisions:**
  - Holding: the restyling approach, never `-o` here, the `muted` rule, the one radius, the emission rules.
  - At risk: no state tint on `muted` (finding 3), the ladder (finding 2), extensionless imports (finding 13).

## Disposition

To be filled by the author.

| # | Severity | Finding | Disposition |
|---|---|---|---|
| 1 | High | Alert dialog opens on its container, not Cancel | Fixed, decision 17: our `AlertDialogContent` passes its own `onOpenAutoFocus`, prevents the default and focuses `[data-slot=alert-dialog-cancel]`, falling back to the content; bits-ui lines cited as READ. Decision 23's behaviour and criterion 17 now check the focused element's `data-slot`. |
| 2 | High | Square controls not square; 43.6 px off the ladder | Fixed by the design lead's call (decisions.md, "Control heights sit on the ladder"): decision 10 rewritten (`h-8` 32 px, `h-12` 48 px, no `lg`, icon buttons `size-8`/`size-12`, text centred, inputs `text-base`); decisions 12, 13, 15 and 18 (cells `size-12`) follow; heights test in decision 23 and criterion 18 recomputed (48 and 32, widths checked for squares). Every `43.6`, `aspect-square` and `h-lh` sizing use removed. |
| 3 | Medium | Tinted badges inside `accent` rows | Fixed by the design lead's call (decisions.md, "State badges carry no tint"): decision 19's badge row is border and text on a transparent fill, `caution` solid amber with ink text; alerts keep their tints with the rule that an alert is never inside an inset (R7, decision 19 alert row); table row note added. |
| 4 | Medium | Field wiring unproven and absent from server HTML | Fixed, decision 11 rewritten: `Field` and `FieldSet` take `description` and `error` props and render those parts themselves, so the context's `describedBy` is computed in the container's script, before any child renders, and is in the server HTML. An id is named only when the same render contains its element, so no reference dangles. Decision 16 adds a 7-control wiring fixture; decision 23 checks 7 of 7 on the raw prerendered HTML and after hydration; criterion 21 recounted (14 of 14). |
| 5 | Medium | Round radios against the circles decision | Fixed by the design lead's call (decisions.md, "Radio buttons are round"; the avatar bullet now names the radio): decision 19 cites it; decision 28 no longer flags it. L11's allowlist unchanged. |
| 6 | Medium | Switch thumb shape and border | Fixed by the design lead's call, revised once (decisions.md, "The switch is a 32 × 64 track with a 24 × 24 thumb"): decision 14 rewritten with the geometry (track `h-8 w-16 p-1`, thumb `size-6`, travel `translate-x-8`), no track border, and the corrected reason. Every value is on the ladder, so decision 21 has no switch exception; decision 23 and criterion 18 measure the 64 × 32 track, the 24 × 24 thumb and the 4 px inset. |
| 7 | Medium | `tailwind-variants` has its own merge engine | Fixed, decision 2: every item imports `tv` from `tailwind-variants/lite` (type-only imports from the main entry allowed), so `cn` is the one engine. `utils.test.ts` now proves `lite` leaves both classes, `cn` merges, and 8 of 8 items import `lite` (7 cases, criterion 13); `registry.test.ts` checks the 8 items still name the package. |
| 8 | Medium | Install check unreadable while `001` is untracked; pin order | Fixed, decision 4: the snapshot is the whole tree (`git ls-files -co --exclude-standard` plus a SHA-256 per file) and the check compares snapshots, never `git status`. Decision 2's pin order is now `bun add` exact, then the caret specifier, then `bun install`. The commit and tag are put to the owner separately, before build step 3; decisions 25 and 27 work either way. |
| 9 | Low | `separator` decorative default and groove height | Fixed, decision 19 separator row: the item sets `decorative = true`; horizontal is `groove pt-(--line-width) w-full` (one hairline of padding gives the inset highlight a row; a zero-height or `h-(--line-width)` box with a top border clips it). |
| 10 | Low | Live-region preconditions | Fixed, decision 24: four stated preconditions (status alerts are messages, not announcements; `role="alert"` only on insertion; `FieldError` sound only with submit-time errors and moved focus; the labelled spinner inserted when loading starts). The labelled spinner now holds visually hidden text, not `aria-label`; `Alert` takes `role={null}` to render none (decision 19). |
| 11 | Low | Literal border widths | Fixed: R22 and lint rule L14 forbid numeric border widths; tabs use `border-b-(length:--focus-width)`, avatars `border-(length:--focus-width)`, the caution alert's bar `border-l-(length:--focus-width)`, noted as decoration at 1.95 with the title carrying the state. Samples `border-l-4`, `border-2` (bad) and `border-b-(length:--focus-width)`, `border-0` (good) added. |
| 12 | Low | SC 2.5.8 misread in two reasons | Fixed: R21 is now stated as a house rule stricter than AA, citing 2.5.8's exceptions; the badge row, decision 10 and the switch cite R21, not SC 2.5.8. |
| 13 | Low | `.js` import extensions | Fixed, decision 4 step 6: the restyle makes `#lib` imports extensionless; `registry.test.ts` asserts 0 of 33 built files contain `$UTILS$.js` or `/index.js"` (criterion 7). |
| 14 | Low | Small corrections | Fixed: OTP paste strips `/\D/g`, with a third paste case (decision 18, criterion 21); tooltip's double reading noted and accepted with the reason (decision 19); hover reworded as a change to foreground, darker in light and lighter in dark (decision 12); table footer added to R8 (decision 9); Scope's browser line says 4 updated. |
| 15 | Low | Size and a mid-build checkpoint | Answered and fixed: nothing cut (the split decision fixes the 26). Decision 27 adds a review checkpoint after build step 4 and names the two deferrable parts. |
