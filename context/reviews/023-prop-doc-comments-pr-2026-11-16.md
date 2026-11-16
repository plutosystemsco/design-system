# Review of 023 — Prop doc comments (the built change)

Reviews [`specifications/023-prop-doc-comments.md`](../specifications/023-prop-doc-comments.md), with its Landing notes and the builder's nine deviations. This reviewer wrote neither the specification nor the code (constitution §5).

- **Date:** 2026-11-16
- **Status:** in review. **Land after fixes.** Findings 1 and 2 are wrong comments, one line each, and must be fixed before the merge. Findings 3 and 4 are test and instrument fixes, also before the merge. Finding 5 is a follow-up small change to the literal lint. Findings 6 to 11 are wording fixes and write-ins. Finding 12 answers the `FieldLegend` question.
- **Reviewer:** a reviewer; not the author.
- **Reviewed:** commit `7ee3bcd` on branch `worktree-agent-a98b806f8a7911cf2` (worktree `.claude/worktrees/agent-a98b806f8a7911cf2`), on `506cfc1`: 293 files, +4,031 / −537. 134 item files in 64 items, `api.server.ts`, `api-table.svelte`, `kuiper.ts`, the changelog, the scorecard, `static/v0.13.0/r/`, the thumbnails' manifest, and the tests.
- **Read:** `AGENTS.md`; the constitution; the specification and its Landing notes; its spec review (`023-prop-doc-comments-spec-2026-11-15.md`); `023a`'s specification; `025`'s merge notes and rulings. Prior art: `huntabyte-bits-ui/docs/src/lib/components/api-ref/props/props-table.svelte`, `primer-design/src/components/props-table.jsx` and `content/components/button/react/deprecated.mdx`, `alphagov-govuk-frontend/…/button/button.yaml`, `radix-ui-themes/…/base-button.props.ts`, `shadcn-svelte/docs/src/lib/registry/ui/field/field-legend.svelte`.
- **Re-ran:** Bun 1.4.4, 2026-11-16, load average 14 to 22. Nothing in the repository was written but this file. The worktree was not edited; `bun run check` and the test runs wrote only `.svelte-kit/` and `test-results/`. Scratch work is in the session scratchpad, `review-023/`. Ports 5781 to 5784; 5199 was not used.
  - `bun run check`, in the worktree → 2,361 files, **0 errors, 0 warnings**.
  - The api unit tests (`api.test.ts`, `api-described.test.ts`, `css-vars.test.ts`, `component-data.test.ts`) → **135 pass, 0 fail**.
  - `api-table.spec.ts` and `site.spec.ts`, `chromium-light` and `chromium-dark`, on the worktree's `build/` → **112 passed**.
  - **axe** (`axe.spec.ts`, filtered) on Button, Dialog, Sidebar, Highlighter and Toast, at 360, 768 and 1280, light and dark → **30 passed**, 0 violations.
  - **Screenshots** of the API section on the same five pages at 1440, 1024, 768 and 390, light and dark (40 in `review-023/`). Every table's scroller measured: **0 of 90 tables scroll sideways** at any of the four widths, in either scheme.
  - **Criterion 9, independently** (`c9.ts`): every one of the 134 changed item files, base `506cfc1` against `7ee3bcd`. Each `.svelte` file through Svelte's own compiler, client and server; each `.svelte.ts` through Bun's transpiler then `compileModule`; each `.ts` through Bun's transpiler. Comments stripped from the output, white space removed. **0 differences** in 256 compiled outputs.
  - **Criterion 14, independently** (`c14.ts`): `apiTables()` on `506cfc1` and on `7ee3bcd`, every field of every row, no allowance. **1,127 rows; 0 Type cells, 0 defaults, 0 row orders, 0 closing rows changed.** Empty rows 800 → 0. Rewordings: `Button.busy`, `CodeEditor.readonly`, `CodeEditor.disabled`, `useHighlightedCode`.
  - **The re-declarations** (`mkprobe.ts`, svelte-check over a scratch copy): for each of the 115 changed components, `ComponentProps` of the base file against the new one. **All 115 mutually assignable, with the same keys.** A mutation (Button's `busy` made required, `type` narrowed to `"button"`) fails the probe, as it should. A required-ness probe flags three components, `input`, `separator` and `textarea`; each is the re-declared `"data-slot"`, a key the base already accepts through `data-${string}`, so it is a probe artefact, not a change.
  - **Union hover** (TypeScript 6.0.3 quick info): `Accordion`'s and `ToggleGroup`'s `value` in the multiple form read `string[] | (string[] & string) | undefined`, where the base read `string[] | undefined`. The changelog's two clauses are accurate.
  - **Generated rows** (`gen.ts`, `{ marks: true }`): 493 generated, 634 hand. That is the builder's 495 less the two the checkpoint replaced (`Sidebar.children`, the app shell layout's `children`). Three two-name sentences remain, all Button's.
  - **Not run by me:** the perf project, the smoke test, lint, the full unit and e2e suites, `depth.ts` and `kuiper.ts`. Their figures are the builder's.

## Verdict

**Land after fixes.** The writing is good, and better than most of the references'. The layout re-plan is sound and has precedent. The type safety and "nothing executable moved" hold under independent checks stronger than the builder's. Two comments are wrong, and two checks lost their teeth to the layout change. All four fixes are small.

## Findings table

| # | Severity | Finding | Where |
|---|---|---|---|
| 1 | High | `ProofBandItem.label` carries two stacked doc comments. TypeScript shows the last, "The band's name…", which belongs to the props' `label`. The spec's "one block per member" is not tested | `proof-band.svelte:10–14`; `api-described.test.ts` |
| 2 | Medium | `ToggleGroupItem`'s `size` and `variant` say "used only when the group sets none". The group always sets one, so both props do nothing | `toggle-group-item.svelte:17–20` |
| 3 | Medium | Test 7 passes a row with no description but a default: the default now sits in the same cell. `kuiper.ts` and `depth.ts` count such a row as described too | `api-table.spec.ts` test 7; `kuiper.ts`; `depth.ts` |
| 4 | Medium | `interfaceChangeMarks` counts the phrase, so "no interface change" counts as a mark: 97 recorded, 14 real. It read 34 before `023`, 20 of them false | `scripts/bench/kuiper.ts:311`; the run log |
| 5 | Medium | The literal lint reads prose in comments as classes, so four comments cannot name the `outline` value they describe. Fix the lint, not the words | `scripts/lint-literals.ts`; deviation 8 |
| 6 | Low | Five comments name a colour literal, "red", where decision 5 asks for the role | `input`, `textarea`, `native-select`, `checkbox`, `input-otp` |
| 7 | Low | `Composer.onsubmit` does not say that Enter sends without a submit | `composer.svelte:55–58` |
| 8 | Low | Three comments say less than they should: `Button.busy` on a link, `Avatar.loadingStatus`, `TooltipContent.side` | as named |
| 9 | Low | Two re-declarations write `?` on a member the base requires | `toggle-group-item.svelte`, `input-otp-slot.svelte` |
| 10 | Low | Criterion 14's "no expectation outside this specification's tests changes" is broken by deviation 7. Justified; it needs a recorded ruling | `component-data.test.ts`; `site.spec.ts` |
| 11 | Low | 63 identical changelog bullets, where one bullet naming all 63 items would set the same Updated facts | `CHANGELOG.md` |
| 12 | Info | `FieldLegend`'s `variant` is inert, confirmed. It is not a small change | `field-legend.svelte` |

## 1. Comment quality

**Read:** every hand comment in the diff, all 429, item by item across forms, overlays, layout, code items, blocks, toast and `utils`. Of the 493 generated sentences: every 11th line of `generated.txt`, and every line for `dialog`, `sheet`, `popover`, `tooltip`, `input`, `input-otp` and `chart`, about 110. About 45 claims were checked against the code they describe (Button, Alert, Composer, Tooltip and its trigger, MessageLog and `FollowBottom`, SidebarProvider and SidebarTrigger, ToggleGroup, Toast and Toaster, Field, InputOTP, ChartContainer, DialogContent, the dropdown and popover offsets, CodeBlockLine, PageStatesError, ChatPane).

**What is good.** The voice holds across 429 comments by one writer. Sentences are short, in the present tense, sentence case, one idea each. The median hand row is 14 words. Event props say when they fire relative to Kuiper's own handler ("after Kuiper stops following the end if the wheel turned up"), which no reference does. Boolean props say what turning them on does. Pass-throughs mostly say what Kuiper changes, as decision 5 asks: `Button.type`'s "so a button inside a form does not submit it", `DropdownMenuCheckboxItem.closeOnSelect`'s "so several can be set in one visit". The generated sentences name the real element ("The rendered `<a>` or `<button>`"), which bits-ui's `refProp` ("The underlying DOM element being rendered") does not.

**Against the references.**

- **GOV.UK** (`button.yaml`) writes "Classes to add to the button." and "The ID of the button.": circular, by this review's test. It does name every no-op: "This has no effect if `href` is set." Kuiper should borrow that (finding 8).
- **Primer** (`deprecated.mdx`) writes "Additional styles" for `sx`, and "A value of `small`, `medium`, or `large` results in smaller or larger Button text size; no effect if `fontSize` prop is set". Kuiper's Button `size` ("`default` meets the touch target. `sm` is the compact height, for dense rows. The `icon` sizes are square…") says when to pick each, which Primer's does not.
- **Radix Themes** keeps no descriptions in source (`base-button.props.ts` holds values and defaults only); its site writes them apart, where they can drift.

By that comparison, Kuiper's comments meet the bar the owner set: good design with precedent from the best.

**Wrong** (findings 1 and 2) and **imprecise** (6 to 9) comments are below, each with a corrected text.

**Circular, but acceptable.** About 25 data members of internal or mirror types restate their name: `TrapStyle`'s eleven ("The computed `transform`."), `Compiled.id`, `Highlighter.id`, `ToastView.id`, `HighlightedToken.content`. Each mirrors a CSS property or is a plain id. GOV.UK does the same for `id`. No change asked.

**No generated sentence is wrong.** Spot checks: `InputOTP.class` names the wrapping `<div>`, not bits-ui's root, which is right (`input-otp.svelte`). `ChartContainer.children` names the inner `<div>`, while its `ref` and `class` name the `<figure>`; true, if less useful. `SheetContent` names bits-ui's `Dialog.Content`, which is what Sheet wraps.

## 2. The layout re-plan (deviation 1)

**Ruling: good design, with precedent. Keep it.**

- **Precedent.** bits-ui, the library Kuiper's parts wrap, uses three columns and sets the default under the description in the same cell (`props-table.svelte`: Property, Type, Description, with "Default:" below). GOV.UK has no default column; its defaults are in the prose ("Defaults to `"submit"`"). Primer keeps four columns at fixed widths (20/30/10/40%) on a wider measure, and MUI keeps four on a wider page. So the references split, and the split follows the measure. Kuiper's text column is 606 px.
- **Measured.** 0 of 90 tables scroll on the five pages at 1440, 1024, 768 and 390, light and dark. The builder's 0 of 271 at five widths agrees, and `023a`'s `WIDE_AT_1440` list, 7 tables, is empty.
- **The default is easy to find.** It is always the last line of the cell, with a visible "Default" label and a code span, in both schemes (`button-1440-light.png`, `sidebar-1024-light.png`, `button-390-dark.png`). Scanning a column of defaults is slower than before, since each sits at a different height. The default is the sparsest column, so this costs the least.
- **The phone layout** already stacked the default under the description. It now reads the same at every width.
- **Two notes, not findings.** "Default `null`" now sits under 204 `ref` rows, and "Default `undefined`" under Button's `href`. And column positions differ from table to table, since each table sizes its own columns; bits-ui and Primer fix the widths. Both are for `032`, which reworks the API section.
- **The twins.** The Markdown table now has three columns, with "Default `x`" after the description. That is acceptable: the twin follows the page, and `kuiper.ts` now finds the column by its header. Two costs follow. A tool that parsed the fourth cell breaks; `kuiper.ts` was the only one in the repository (`grep "What it does"`). And a default and a description now share a cell, which finding 3 shows matters to the checks.

## 3. The criteria

- **Criterion 9: confirmed, by a stronger method.** The builder compared each script through `ts.transpileModule` and TypeScript's printer, with white space removed. That compares scripts, not what ships. I compiled every changed file with Svelte's own compiler, client and server, and compared the output: 0 differences in 256 outputs over 134 files (`c9.ts`). The one difference the builder saw before normalising, `chat-text.svelte`'s destructuring laid out on four lines, does not reach the compiled output.
- **Criterion 14: confirmed.** 0 Type cells changed, with no allowance for re-declared rows (`c14.ts`).
- **The `var()` test** (`css-vars.test.ts`, `tests/helpers/css-vars.ts`) is sound. It reads both forms, comments included, and matches bits-ui's names whole. Its fixtures cover a misspelling, the typed shorthand, the local rule, the three bits-ui near-misses and an undeclared prefix. One looseness, not a finding: source 2 accepts a name from any registry item's `cssVars` or `css`, not only the theme item's, as decision 10 says. No item but the theme declares any today.
- **The 134 re-declarations change no public type.** All 115 components' props are mutually assignable with the base's, with the same keys, and a deliberate narrowing fails the probe. By construction an intersection cannot widen a type; it can only narrow it, and none narrows. The union hover change is real, accurate in the changelog, and only in `Accordion.value` and `ToggleGroup.value`.

## 4. Deviations 2 to 9

The Landing notes number nine deviations. The brief's 5 to 8 are the notes' 5, 7, 8 and 9.

- **2 (test 7 allows a table with no row):** right. `DialogPortal` has only its closing row.
- **3 (members in a union's branch):** right. Re-declaring them would change their types. `Input.type`'s comment now appears twice, once per branch, so either branch's hover shows it.
- **4 (the universal rows re-declared, keeping their Type cell):** right, and criterion 14 holds.
- **5 (no `toast` bullet):** accept. `toast` is new in 0.13.0, and its "new" bullet already names it.
- **6 (test 7 in `api-table.spec.ts`):** accept.
- **7 (other specifications' tests):** justified, but see finding 10.
- **8 (comments avoiding lint words):** this hides a lint false positive. See finding 5.
- **9 (the bench script):** the header lookup is right. The `interfaceChangeMarks` count needs the script fixed, not the bullets rephrased. See finding 4.

## 5. The `FieldLegend` finding

**Confirmed: `variant` sets only `data-variant`, and no rule in the item or the theme reads it** (`field-legend.svelte`; grep over `src/` and the theme). Its comment says so truthfully.

**It is not a small change in lane I.** Stock shadcn-svelte styles the two values apart through its `cn-field-legend` stylesheet, which sets `label` smaller. Kuiper's own `Label` is `text-base font-medium`, the same as the legend. So "styled as a label" already looks like Kuiper's label. Restoring stock's smaller size would make a label-styled legend smaller than a real label, which is wrong. Doing nothing is right. The only real fix is to deprecate the prop, which is an interface change under `048`'s rule, not a small change. Recommended: keep it and its comment; add it to `048`'s list of candidates for 0.14.0. The same holds for `ToggleGroupItem`'s `size` and `variant` (finding 2), which behave as in stock shadcn-svelte.

## Findings, most severe first

1. **`ProofBandItem.label` has the wrong comment** (`proof-band.svelte:10–14`). Two blocks sit before the member:
   ```ts
   /** What the number counts. */
   /**
    * The band's name. With a `title`, the title names it, and this is not
    * needed.
    */
   label: string;
   ```
   The second belongs to the props' `label`, in the union branch below. TypeScript's hover shows only the last block (probed: quick info returns "The band's name."). So every app that installs `proof-band` sees the wrong sentence on each item's `label`. Decision 5's "One `/** … */` block per member" would have caught it, but no test counts blocks.
   **Fix:** delete the second block. Add a countable rule to test 4, V8: a member has exactly one doc comment block (`ts.getJSDocCommentsAndTags(member).length <= 1`, or the node's `jsDoc` array). A scan of all 134 changed files finds no other stacked block.

2. **`ToggleGroupItem`'s `size` and `variant` comments are wrong** (`toggle-group-item.svelte:17–20`). They read "The item's own size, used only when the group sets none" and "The item's own look, used only when the group sets none". The item renders `ctx.size || size` and `ctx.variant || variant`. The group destructures `size = "default"` and `variant = "default"`, so its context always holds a value, and an item cannot be used outside a group. Both props never take effect.
   **Fix** (corrected texts):
   - `size`: "Has no effect: the group always sets its items' size, `default` unless you pass another. Set `size` on the `ToggleGroup`."
   - `variant`: "Has no effect: the group always sets its items' look. Set `variant` on the `ToggleGroup`."
   Add both to the Landing notes' "Faults found while writing", beside `FieldLegend`.

3. **Test 7, `kuiper.ts` and `depth.ts` no longer tell a description from a default.** The default now sits in the "What it does" cell. Test 7 reads the cell's `textContent`, so a row with no comment but a default passes. Before `023`'s comments, Button's `variant`, `size`, `ref`, `href` and `type` would pass it, though none was described. The test was seen failing on the four-column layout, not this one. `kuiper.ts` counts a twin's row described when its cell is not empty, and `depth.ts` measures the column's fill; both now count a default as a description. Test 1 still holds every row in the unit suite, so nothing is undescribed today. But the e2e evidence for criterion 7, and the scorecard's "props described", can no longer fail.
   **Fix:** mark the default's span (`data-slot="api-default"`), and have test 7 read the cell without it. In `kuiper.ts`, strip a trailing "Default `…`" before testing the cell. Note the same limit in the scorecard's `depth.ts` method (§8), or teach it the marker. Seen failing: blank one description in a scratch build and confirm test 7 fails.

4. **`interfaceChangeMarks` counts negations** (`kuiper.ts:311`, `count(changelog, /interface change/gi)`). The changelog's own legend says the mark is bold: "marked **interface change**". On `506cfc1` the phrase occurs 34 times, the bold mark 14 times, and "no interface change" or "not an interface change" 19 times. On `7ee3bcd`: 97, 14 and 82. So the count was already wrong before `023`, and the scorecard's evidence for row 11 ("26 marks of 'interface change'") was inflated too.
   **Fix the script, not the bullets.** The bullets follow `015`'s form, and decision 12 fixed the phrase. Count the bold mark: `/\*\*interface change\.?\*\*/gi`. `023` already edits `kuiper.ts` (deviation 9), so it is one more line in the same change. Correct the run-log row to "14 interface marks (the count read the phrase, so `c5df65b`'s 34 held 20 negations)". No score moves.

5. **The literal lint reads prose in comments as classes** (deviation 8). `lintText()` splits the whole file on white space and punctuation, and tests every token against the class rules. A comment's word `outline`, or `` `outline` ``, is token `outline`, which L4 flags. In code, `outline:` and `data-[variant=outline]` pass only because they are not bare tokens. So the four comments on that value cannot name it:
   - `Toggle.variant`: "The default has no border. The other look draws one…"
   - `Item.variant`: "The default has no border. The other look draws one…"
   - `SidebarMenuButton.variant`: "The default sits flush in the list. The other look draws a border…"
   - `ToggleGroup.variant`: "In the bordered look, neighbours share one border."

   The page's Type cell shows the union, so a reader can work it out. An editor's hover shows only "the other look". Primer and Radix name every value. This is a lint false positive, and it should be fixed in the lint.
   **Fix:** a follow-up small change to `scripts/lint-literals.ts`: the class rules (L1 to L18) skip the text of `/** … */` and `//` comments, as L19 and L23 need not. Its check, seen failing first: a fixture whose doc comment says `outline` passes. Then reword the four comments to name the value:
   - Toggle: "`outline` draws a border, for a toggle that stands alone on a busy surface. The default has none."
   - Item: "`outline` draws a border, for an item that stands alone. The default has none."
   - SidebarMenuButton: "`outline` draws a border round the row, for a row that stands apart from the list. The default sits flush."
   - ToggleGroup: "The look of every item in the group, as `Toggle`'s. With `outline`, neighbours share one border."

   This need not block `023`.

6. **"Red" where the rule asks for the role** (decision 5: "Name a size or a colour by its token or role, never a literal"). The `aria-invalid` comments on `Input`, `Textarea`, `NativeSelect` and `Checkbox` say "turns its border red", and `InputOTP`'s says "turns every cell's border red". The class is `border-destructive`.
   **Corrected:**
   - "Marks the control invalid and draws its border in the destructive colour. Inside a `Field` it follows the field's `error` or `invalid`."
   - InputOTP: "Marks the input invalid and draws every cell's border in the destructive colour. Inside a `Field` it follows the field's `error` or `invalid`."

7. **`Composer.onsubmit` is imprecise** (`composer.svelte:55–58`). It says "Called when the form is submitted, before Kuiper sends the draft." Enter sends through `handleKeydown`, which never submits the form, so an app that hooks `onsubmit` misses every message sent by Enter. Decision 5 asks an event comment to say when it is not called.
   **Corrected:** "Called when the form is submitted, before Kuiper sends the draft. Enter sends without a submit; use `onsend` to see every message. Kuiper always prevents the browser's own submit."

8. **Three comments say less than they should.**
   - `Button.busy`: only the `<button>` branch reads `busy`; with `href` it does nothing. GOV.UK's precedent is "This has no effect if `href` is set." **Corrected:** "Shows a spinner, sets `aria-busy`, and ignores clicks while the button stays enabled and focused, so a form is not sent twice. It has no effect when `href` is set."
   - `Avatar.loadingStatus`: "Whether the image has loaded" reads as a boolean; it is `"loading"`, `"loaded"` or `"error"`. **Corrected:** "The image's load state. The fallback shows until it reads `"loaded"`. Bind it to follow the image."
   - `TooltipContent.side`: "The side of the trigger the tooltip prefers. It flips when there is no room there." This restates bits-ui, against decision 5's "Say only what Kuiper adds"; Kuiper's `top` is also bits-ui's default. **Corrected:** "Kuiper sets `top` itself, so the side holds if bits-ui's default changes. It flips when there is no room."

9. **`?` on two required members.** `ToggleGroupItem.value?: ToggleGroupPrimitive.ItemProps["value"]` and `InputOTPSlot.cell?: InputOTPPrimitive.CellProps["cell"]` are required in their bases (probed). The intersection keeps them required, so no type changes, but a reader of the source an app owns sees an optional prop. **Fix:** drop the `?` on both. Test 8 still holds; the probe shows the props stay mutually assignable.

10. **Criterion 14 says no other expectation changes; deviation 7 changes four.** `component-data.test.ts` and `site.spec.ts` now name `kbd`, `label` and `name-strip` in place of `button` and `card`, because decision 12's bullets update every changed item's Updated fact. That consequence follows from the spec's own decision, which did not foresee it. The replacements keep each test's intent: an older change, and a never-changed item. One test is weaker: "77 named; `name-strip` and `cta-band` take their since" becomes a fallback checked on a made-up name. **Fix:** the design lead records a ruling in the Landing notes accepting the four edits. No code change.

11. **63 identical changelog bullets.** "`x`: doc comments on every prop; no interface change." appears 63 times in the 0.13.0 entry. `updatedIn()` reads every code name at a bullet's head (`headNames()`), as the `field, input, textarea, …` bullet already uses. So one bullet naming the 61 plain items, plus the two union bullets, sets the same Updated facts in 3 lines instead of 63. Criterion 10's landing check still holds. **Optional;** the design lead's call. With finding 4's script fix, the count is right either way.

12. **`FieldLegend`.** See §5: confirmed inert, not a small change. Keep it and its comment, and list it for `048`.

## Scorecard (criterion 16)

The builder's run, on `506cfc1` with the change: **row 2, guidance depth, 2 → 3**. `depth.ts` reads Button 6 of 10 and Dialog 6 of 10, and "props described" is met on both. The total moves **35 → 36**. Kuiper ties Carbon, Material 3, Spectrum 2 and Primer on the row. `kuiper.ts` reads 100% of 1,127 rows described. I did not re-run either instrument. Finding 3 limits what "props described" can detect in future runs; finding 4 corrects one count in the run-log row. Neither moves a score. The run-log row names `506cfc1`; at the merge it should name the merge commit.

## For the merge onto `release/0.13.0`

`release/0.13.0` was at `1f9a1df` when the brief was written. It is now at `cc278db`: `025`, `024d` (`7a47948`) and `024b`'s review. `027b` and `024b` are in flight.

1. **Conflicts.** Only two files changed on both sides since `506cfc1` (`git diff --name-only 506cfc1 cc278db` against the commit's files): `context/research/benchmark-scorecard.md` (run-log rows and "In short"; keep both sides' rows, in date order) and `src/lib/site/thumbnails/manifest.json`. Nothing under `static/` overlaps, and neither do `CHANGELOG.md`, `registry.json` and `pluto-allowed.json`.
2. **Ledger files.** Run `bun run build:registry`. Then take the thumbnails' manifest from the release side and run `bun scripts/site/thumbnails.ts --hash-only` once, as `025`'s merge note 2 says. No picture should change.
3. **`025`'s report.** Every item's served JSON in the `utils` closure changed, so the size hashes are stale for nearly every item, not only the 64 whose files changed. Under `025`'s ruling (a) at landing, run **`bun run cost --sizes-only`**, then commit `scripts/cost/report.json`. `025`'s merge note 5 names `023` as a landing that "pays a sizes refresh, not a runtime run". Under its ruling (c), the runtime key is the build's output hash, so a comment-only change re-measures nothing. **What must hold:** every size figure and every `outputHash` equal to the report's, to the byte. That is criterion 9 from the other side, and my compile check predicts it. If any size moves, stop and tell the design lead. If `--sizes-only` refuses because `utils` is on decision 13's list of full-run inputs, ask the design lead before running `--full`; the ruling says it should not be needed.
4. **`pluto-allowed.json`.** `023` adds one entry, `api-described.test.ts`, count 1. The release side did not touch the file. Run `bun test tests/unit/rename.test.ts` after the merge, since `025`'s and `024d`'s new files are counted too.
5. **Bun.** `025`'s QB pins `bun@1.4.4`; the worktree ran 1.4.4.
6. **Re-run after the merge:** `bun run check`; `bun run test:unit` (with `cost.test.ts` and `thumbnails.test.ts`); `api-table.spec.ts` and `site.spec.ts` in both Chromium projects; and the perf project, since `024d` changed the theme page's template.
7. **Items landing later.** `027b`'s items meet tests 1 and 3 on the day they land, so they must be born described. If `027b` lands first, `023`'s tests hold its items at `023`'s merge, and `023` does not write their comments (decision 14).
8. **Findings 1 to 4** go in before the merge commit. Then add to the Landing notes: findings 2 and 12's faults, finding 10's ruling, and the corrected interface-mark count.
