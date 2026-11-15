# Review of 023 — Prop doc comments

Reviews [`specifications/023-prop-doc-comments.md`](../specifications/023-prop-doc-comments.md).

- **Date:** 2026-11-15
- **Status:** in review; approve with changes. Not fit to build yet: findings 1 to 8 stand.
- **Reviewer:** a reviewer; not the author
- **Reviewed:** the specification as drafted, 2026-11-15 (399 lines), and its memo [`research/2026-11-15-prop-docs.md`](../research/2026-11-15-prop-docs.md). I checked them against these:
  - `AGENTS.md`; the constitution (§4, §5, §6); `reviews/README.md`; `roadmap.md` (row `023`, §2 wave 1, §3 "Cross-lane landings"); the scorecard (row 2's rubric, line 75, and its table, line 133);
  - [`020`](../specifications/020-the-kuiper-rename.md) (Kind: "no prop … changes"); [`024`](../specifications/024-budgets-per-template.md) (Button 380 kB, the new budget 430 to 480 kB, the weight rule at line 163); [`026`](../specifications/026-toast.md) (decision 24, test 39); [`022`](../specifications/022-the-test-matrix.md) (decision 15, `mutations.test.ts`); [`025`](../specifications/025-component-cost.md) (decision 13, the two hashes; `--sizes-only`);
  - the code: `src/lib/site/api.server.ts`, `src/lib/site/page/api-table.svelte`, `src/lib/site/component-data.server.ts`, `src/lib/site/changelog.ts`, `src/lib/utils.ts`, `scripts/lint-literals.ts` (`itemFiles()`), `scripts/bench/depth.ts`, `tests/unit/api.test.ts`, `tests/e2e/site.spec.ts` (the 3-or-4-column test), `registry.json`, `CHANGELOG.md`, `build/components/button/` (built 16:10), and the items named below;
  - prior art: `context/prior_art/huntabyte-bits-ui/docs/src/lib/content/api-reference/shared.ts:110–148`.
- **Re-ran:** nothing in the repository was written except this file. No build, no suite, no server. `git status --porcelain` showed other authors' edits in progress (`021`, `024`, `025`, `026` and their memos and reviews); none is mine. Every probe ran in `…/scratchpad/023-review/`, against a copy of `api.server.ts` instrumented to tag each row's source, with `node_modules` linked read-only.
  - **Rows** (EXECUTED, `count.ts`): **1,062 rows, 262 described, 800 empty, 262 tables, 70 items.** By source: own members 346 (163 empty), `WELL_KNOWN` universal three 504 (all empty: `ref` 199, `class` 191, `children` 114), pass-throughs 109 (all empty), module exports 103 (24 empty). Declared and bare universal members: 20 (13 `class`, 7 `children`). So 163 = 143 + 20. Items with no table: `pluto-theme`, three fonts, `product-home`. Fully described: `utils`, `use-highlighted-code`. Button 1 of 10, Dialog 2 of 23, `sidebar` 14 of 92 (78 empty). **Every count in the spec reproduces.**
  - **Exported type members** (EXECUTED, `members.ts`): 87 exported types and interfaces; 96 members of interfaces or object-literal aliases; **74 bare.** Reproduces. A further 34 members (25 bare) sit in type literals inside exported unions and intersections (finding 7).
  - **The generator's targets** (EXECUTED, `gen.ts`, my own walk of `svelte/compiler`'s modern AST, written to decision 4's rules as worded): of the 524 bare universal rows, **512 fill** with the rules as written, 12 do not (the nine `child`-snippet `class` rows, and `Sidebar`'s `ref`, `class` and `children`, which have three targets). With target names de-duplicated, **515 fill and 9 do not.** Neither is 513 and 11 (finding 2). Seventeen targets are `<svelte:element>`.
  - **svelte2tsx** (EXECUTED, the `svelte2tsx()` bundled in svelte-check 4.7.7, which pins svelte2tsx 0.7.62, extracted into the scratchpad): on a typed `$props()`, the props type is the annotation (`props: {} as any as Props`). A comment on a destructured binding stays in the code at the binding but is in no type. On an untyped `$props()`, it emits `type $$ComponentProps = { busy?: boolean, label: any }`, with no comment.
  - **Hover** (EXECUTED, TypeScript 6.0.3's language service over that output and svelte-check's `svelte-shims-v4.d.ts`, from a consumer's `ComponentProps<typeof C>`): the binding comment on `href` shows nothing (`HTMLAnchorAttributes.href?: string | null | undefined`, no doc). A re-declared `href?: HTMLAnchorAttributes["href"]` shows `href?: string | null | undefined` and its own comment. The member comment on `busy` shows; an untyped binding's comment does not. **The spec's §2 claim holds.**
  - **Type equality** (EXECUTED, `tsc` over `probe.ts` with the real `svelte/elements` and `bits-ui` types): `X` and `X & { k?: X["k"] }` are mutually assignable for Button's two-base `href`, `ToggleGroup.RootProps["value"]` (a discriminated union), `ToggleGroup.ItemProps["value"]` (a required member), `Checkbox.RootProps` `checked` and `id`, `Dialog.ContentProps["onOpenAutoFocus"]`, `Tooltip.ContentProps["sideOffset"]`, `RadioGroup.RootProps` `value` and `aria-describedby`, and `HTMLInputAttributes["aria-describedby"]`. The single branch still rejects `value: ["a"]`; the required `value` stays required. They are not *identical* types (the strict identity check is false), and a union member's hover text changes (finding 6).
  - **`var()` census** (EXECUTED, `vars.ts` over `itemFiles()`, 352 files): 69 named references and 2 dynamic (`shiki.ts:3`, `:42`), so the spec's 71. **None undefined.** The census misses 9 more in Tailwind's typed form (finding 3). No reference resolves by "the same file".
  - **`cn`** (EXECUTED, `cn.ts`, the repository's `cn` 0.5.0): `cn("rounded-action", "rounded-lg")` → both kept; `cn("tracking-mark", "tracking-tight")` → both kept; `cn("groove-b", "border-b-0")` → both kept; `cn("h-12 px-4", "h-8 px-2")` → `h-8 px-2` (finding 1).
  - **Check 9** (EXECUTED, `check9/c9.ts`): `button.svelte` with the "Busy:" rewording and two re-declared members, against the base. Template outside the scripts: identical. Each script through `ts.transpileModule` (`removeComments`, `verbatimModuleSyntax`): identical. The landing check is implementable.
  - **Weight** (EXECUTED, `w.ts`, on `build/components/button/index.html`): base 25,782 bytes gzipped at level 9 (the memo's 25,635 is likely level 6). Nine drafted sentences, longer than the memo's, each inserted once in the body and once in a script: **+656 bytes.** Adding `generated:false` to each row's data: +14 bytes.

## Findings table

| # | Severity | Finding | Where |
|---|---|---|---|
| 1 | High | "Yours win a conflict" is false wherever Kuiper's classes hold one of the theme's own utilities. `cn` keeps both, and the stylesheet decides. The sentence would be printed on about 190 rows | decision 4, the sentence table; test 5 |
| 2 | Medium | The generator's target rules do not reproduce 513 and 11. Duplicate names are not merged. `<svelte:element>` (17 targets), a third-party component and a namespaced Kuiper part have no naming rule. The snippet boundary that leaves Dropdown's two rows unfilled is not stated | decision 4; criterion 5 |
| 3 | Medium | The `var()` test misses Tailwind's typed shorthand `utility-(length:--x)`: 9 references, 8 of them `--focus-width` | decision 10, "Read" |
| 4 | Medium | The bits-ui template rule accepts any lowercase name, so `--bits-popovr-content-transform-origin` passes. The literal rule is a substring match | decision 10, source 5 |
| 5 | Medium | `showType()`'s new rule, as worded, blanks a type shown today (`AccordionTrigger.level`). Its order against the `VariantProps` rule is not stated. No test would notice | decisions 3 and 7; criterion 14 |
| 6 | Medium | "Every props type stays equal" rests on review of 109 re-declarations, but a unit check is easy. The types are mutually assignable, not identical, and a union member's hover text changes | Kind; decision 3; criterion 8; Risks |
| 7 | Medium | Test 3 skips members of exported unions and intersections: `SignInResult`, `SignUpResult`, `SignUpCodeResult`, `SettingsResult` and `ChatSegment`, 21 bare members. These are the shapes an app reads back, decision 1's own reason | decision 1; test 3; Q3 |
| 8 | Medium | The `025` refresh is a runtime re-measure too, over the dependency closure of about 65 items. "Unchanged to the byte" covers sizes only | decision 14; criterion 13 |
| 9 | Low | Test 6's "each of the six sources defines at least one" cannot pass. No item reference resolves by the same file | test 6, second bullet |
| 10 | Low | The `@theme inline` probe reads `--font-mono`, which is not a `cssVars.theme` name. Tailwind's default-theme names have the same caveat. `compile()` does not scan files | decision 10, the caveat |
| 11 | Low | The Intent says the words live where the editor shows them. For the 513 generated rows they do not. The hover joins bits-ui's own text to Kuiper's; the spec should say so | Intent; decisions 2 and 5 |
| 12 | Low | `generated` ships in every page's hydration data. The Button figure is a range, 0.4 to 0.7 kB | decisions 7 and 13 |
| 13 | Low | Roadmap row `023` does not name `024` as a dependency. `026` test 39 expects `ToastOptions` under test 1's title, but test 3 is one global test | Depends on; decision 13; test 3 |
| 14 | Low | Write-ins: the pass-through definition, check 9's settings, the pinned set for new items, the hand-count re-pin | Terms; criterion 9; decision 8 |

## Acceptance criteria against evidence

1. Described — testable. The unit is right: `apiTables()`'s rows are what the page, the twin and `depth.ts` read, and no file belongs to two items (EXECUTED, 0 shared files). READ.
2. No silent loss — testable. It needs a rule for a new item with no table (finding 14). READ.
3. Type members — testable. Its scope misses the union result types (finding 7). EXECUTED.
4. Voice, counted — testable. V3 fails 1 and V5 fails 2 today, as stated (READ, `button.svelte:47`). INFERRED for V2, V4 and V6 by their mutations.
5. The generator — not met as specified: the count does not reproduce, and the rules leave 17 `<svelte:element>` rows undefined (finding 2). EXECUTED.
6. `var()` — testable. It misses 9 references (finding 3) and passes a realistic bits-ui typo (finding 4). EXECUTED.
7. The pages — testable. It overlaps the existing 3-or-4-column test (`site.spec.ts:667`), which still holds. READ.
8. Types unchanged — the equality holds by probe (EXECUTED). "Review reads every one" should be a check (finding 6).
9. Nothing executable moved — implementable; prototyped on Button (EXECUTED). Settings to pin (finding 14).
10. The changelog — testable by `git diff --name-only`. Per-item bullets are the right unit: `updatedIn()` reads each bullet's head names to set a page's "Updated" fact (`changelog.ts:151–161`), and 0.12.0 used the same form (`CHANGELOG.md:19–27`). READ.
11. Shipped comments cite nothing — testable; an existing test. READ.
12. Weight — plausible. Button gains 0.4 to 0.7 kB against `024`'s 430 to 480 kB (EXECUTED, simulated; finding 12).
13. Cross-lane — the `022` half is sound. The `025` half is incomplete (finding 8). READ.
14. The suites — at risk from finding 5, which changes a published row without failing any test. READ.
15. Reviewed — sound. READ.
16. Scored — sound. Row 2's rule is "any props table at least 80% full" (`depth.ts:83–88`). Button's table, 10 rows plus the closing row, reads 91%. `DialogContent` clears it. Mean 6 reads 3. INFERRED.

## Findings, most severe first

1. **"Yours win a conflict" is often false** (spec lines 112, 125, 307, 309). `cn` resolves a conflict only between utilities it knows. The theme's own utilities, such as `rounded-action`, `groove-b`, `groove-s`, `focus-ring`, `tracking-mark`, `type-*`, `surface-plain`, `glass` and `busy-edge`, are not in its table. `001` decision 10 found the same for `text-display` and `tracking-mark`.
   Failure: `cn("rounded-action", "rounded-lg")` returns `"rounded-action rounded-lg"`, and `cn("groove-b", "border-b-0")` returns both (EXECUTED). An app that passes `rounded-lg` to a part whose classes hold `rounded-action` gets whichever rule Tailwind sorts later, not its own. About 34 component files hold one of these utilities (EXECUTED, grep). The site would print a false sentence on each `class` row the generator fills, about 190 of them. The evidence the spec gives is the package's description (READ), and the repository's own `001` contradicts it.
   Fix: drop "Yours win a conflict." Write "Classes for the `<div>`, added after Kuiper's and merged by `cn`." Or keep a true version: "A Tailwind utility of yours replaces Kuiper's for the same property." That is still false for the theme's utilities, so the first is safer. Update test 5's three expected strings. If the owner wants the stronger claim, it needs `cn` configured with the theme's utilities. That is a change to `utils`, out of this specification.

2. **The generator's rules do not reproduce its counts** (decision 4, spec lines 101–105, 121; criterion 5).
   - **Duplicates.** "Two targets join with 'or'" does not say *distinct* names. `Input` renders `<input>` in two branches, and `Spinner` renders `SpinnerIcon` in two. As written, they read "`<input>` or `<input>`". `Sidebar`'s `ref` and `class` each have three `<nav>` targets, and its `children` has `<nav>`, `<nav>` and `<div>`. The "more than two" rule leaves all three empty. Decision 4 expects `Sidebar.children` to read "`<nav>` or `<div>`". So the prototype merged duplicates and the rule does not.
   - **`<svelte:element>`.** 17 targets in 12 files render `<svelte:element this={…}>`: `` `h${level}` `` (card, empty, message, popover, error-summary, chat-pane, settings-delete), `{element}` (stage, sidebar-inset), and a ternary (proof-band, cta-band, stage-hero). A target's name is defined only for an element and two kinds of component. A builder would print "The rendered `<svelte:element>`".
   - **Other components.** `SpinnerIcon` is `phosphor-svelte`'s, neither bits-ui's nor Kuiper's. `Card.Root` and `Empty.Root` are Kuiper parts reached through a namespace. Neither has a naming rule.
   - **Snippets.** `DropdownMenuCheckboxItem` renders `childrenProp` inside a `{#snippet children(…)}` that it passes to `DropdownMenuPrimitive.CheckboxItem` (`dropdown-menu-checkbox-item.svelte`). "The nearest element or component around" it is that bits-ui part, so the rule as worded fills the row. The memo and decision 4 count it as unfilled.
   Failure: my walk gives 512 filled and 12 unfilled as worded, or 515 and 9 with duplicates merged (EXECUTED). Either way, 17 of the filled rows name `<svelte:element>`. If the builder leaves those for hand comments, the generated count is about 498, outside criterion 5's "513 ±5".
   Fix: in decision 4, (a) join *distinct* names, and count more than two distinct names as unfilled; (b) a `<svelte:element>` target leaves the row empty for a hand comment (or, if the owner prefers, a rule such as "the heading" for `` `h${…}` ``); (c) a component imported from neither bits-ui nor Kuiper leaves the row empty; (d) a Kuiper part reached as `Card.Root` is named by its namespace, "the `Card`"; (e) a render tag inside a `{#snippet}` passed to a component leaves the row empty. Add a fixture for (a), (b) and (e) to test 5. Re-pin the counts: about 498 generated, 26 unfilled, and the hand total near 302, not 287.

3. **The `var()` test misses the typed shorthand** (spec line 188). Tailwind 4 also writes `utility-(<type>:--x)`. Items use it 9 times: `border-b-(length:--focus-width)` 8 times (`tabs-trigger.svelte:23`, `sidebar-menu-button.svelte:11` and `:18`, `code-block-line.svelte:9`, `alert.svelte:14`, `table-row.svelte:17`, `avatar-group.svelte:17`, `avatar-group-count.svelte:17`) and `text-(length:--mark-lockup-size)` once (`lockup.svelte:47`).
   Failure: a misspelling in any of the nine, such as `(length:--focus-widht)`, passes. `--focus-width` is the focus ring's width on eight items. The census is 80 references, not 71.
   Fix: read `` -\((?:[a-z-]+:)?(--[\w-]+)\) `` as one form. Add a fixture with `border-b-(length:--focus-widht)` that fails. Raise test 6's floor to 80.

4. **The bits-ui rule cannot catch a bits-ui typo** (spec line 196). bits-ui fills `` `--bits-${name}-content-transform-origin` `` and four more templates from a fixed set of names. Its dist calls `getFloatingContentCSSVars("…")` with `tooltip`, `menubar`, `dropdown-menu`, `context-menu`, `popover`, `menu` and `link-preview` (EXECUTED, grep). The spec accepts any `name` of lowercase letters and hyphens. It also accepts a name that "appears in" the dist, which is a substring test.
   Failure: `--bits-popovr-content-transform-origin` matches the template and passes. `--bits-dropdown-menu-content-transform-origi` is a substring of a real name and passes. These are the realistic typos in this family. The six bits-ui references today are all of it (EXECUTED).
   Fix: expand each template over the literal arguments of `getFloatingContentCSSVars(…)` found in the dist. Match a literal name as a whole token (`--bits-[a-z0-9-]+`, compared whole). Add `bits.svelte`'s third case: `--bits-popovr-content-transform-origin` fails.

5. **`showType()`'s rule blanks a row shown today** (spec lines 91, 169; `api.server.ts:178–193`). The rule returns `""` for "an indexed access whose index is the member's own name and whose object is not one of the item's own types". `AccordionTrigger.level` is already typed `AccordionPrimitive.HeaderProps["level"]` (`accordion-trigger.svelte:15`). Its index is its name and its object is bits-ui's.
   Failure: today its Type cell reads `AccordionPrimitive.HeaderProps["level"]` (EXECUTED, `idx.ts`). After the rule, it reads "inherited". No test covers it, so criterion 14 ("no expectation … changes") passes while a published row changes. Separately, `VariantProps<typeof x>["variant"]` is also an indexed access to a type that is not the item's own. If the new rule runs before line 180's expansion, every variant row goes blank. `api.test.ts`'s Button test would catch that for Button only.
   Fix: apply the rule only when the object is one of the bases the props annotation intersects, after `WRAPPERS` are unwrapped. That matches decision 3's own constraint ("names the same base the item already intersects"). It leaves `level` alone, since the trigger intersects `TriggerProps`, not `HeaderProps`. State that it runs after the `VariantProps` rule. Add a case to test 5: `accordion`, `AccordionTrigger.level` keeps its type.

6. **Type equality is left to review** (spec lines 6, 89, 330, 363).
   - The equality holds by probe (EXECUTED; "Re-ran" above). But "review reads each of the 109" is a guarantee without a check, and the check is cheap. It is syntactic: each re-declared member's type is a `ts.IndexedAccessTypeNode` whose object text equals one of the annotation's intersected bases and whose index is the string literal of the member's own name.
   - "Equal" is not quite the claim. `X & { k?: X["k"] }` is mutually assignable with `X`, not identical (EXECUTED, the identity check is false). Nothing in an app can tell the difference, so there is no interface change. The spec should still say what it proves.
   - A union member's hover changes text. For `ToggleGroup`, `value` in the `multiple` branch hovers as `string[] | (string[] & string) | undefined`, where it read `string[] | undefined` (EXECUTED). An app's error messages change the same way. Harmless, but an app's reader sees it.
   Fix: add test 8 (or a case in test 3): every member of an item's own type that shares a name with a member of an intersected base has that indexed form. Make it the evidence for criterion 8, and keep review for the sentence. Reword Kind and decision 3 to "mutually assignable: every value accepted before is accepted after, and nothing more". Name the union hover text under Risks, and list the union re-declarations (`toggle-group`, `tabs`, `accordion`, `radio-group` and any other) in the landing notes.

7. **Test 3 skips the result types an app reads back** (spec lines 57, 304). Decision 1 names "each member of an exported interface or object-literal type alias". That leaves out object literals inside exported unions and intersections.
   Failure: `SignInResult` (`sign-in-form.svelte:4`), `SignUpResult`, `SignUpCodeResult`, `SettingsResult` and `ChatSegment` (`chat-text.svelte:3`) are discriminated unions. Their 21 members (`ok`, `errors`, `formError`, `kind`, `text`, `language`, `code`) have no comment, and test 3 would pass (EXECUTED, `members.ts`). An app's form action returns `SignInResult`. That is decision 1's reason ("the shapes an app passes in or reads back") and Q3's ("what an app passes in"). `LockupProps.tone` and `utils`' `WithElementRef.ref` are in intersections, and are bare too.
   Fix: test 3 also reads the type literals inside an exported alias's unions and intersections. A member that is also an API row (`ButtonProps.variant`) is held by test 1 and is not counted twice. Re-pin: 74 becomes about 97. If `WithElementRef.ref` is included, `utils` changes, and finding 8's full cost run follows.

8. **The `025` refresh is more than a hash refresh** (spec line 240; criterion 13; `025` decision 13, lines 223–232).
   - `025`'s size hash covers "the served JSON of the item and of every item in its `registryDependencies` closure". About 65 items' JSON changes, so every item that depends on one of them is stale too. That is most of the registry.
   - The runtime hash is the size hash plus more, so each of those items is also re-measured for runtime. A runtime figure is a timing. It cannot be "unchanged to the byte". It can go over budget on noise, which `025` decision 11 handles with a re-measure and a gate.
   - A change to `utils` or the theme item forces a full run (`025` line 232). Finding 7 may change `utils`.
   Failure: the builder runs `bun run cost` expecting a short refresh. It gets a long runtime run, on which machine is not said, and a runtime figure over budget stops a landing that changed no executable byte.
   Fix: say that `bun run cost` re-measures runtime for the closure, and estimate the time. Say that only size figures must be byte-equal, and that runtime figures fall under `025`'s rules. Or ask the owner, as a question with options, whether `025` should hash each file with its comments and types stripped (check 9's transform). Then a comment-only change leaves every hash as it was. That would be a `025` change, recorded there.

9. **Test 6's per-source floor cannot pass** (spec line 317). No `var()` in any item file is defined by the same file (EXECUTED; the memo's §5 table has no such row either). Fix: prove source 1 by the `local.svelte` fixture. Hold the tree-wide "at least one" to sources 2 to 6.

10. **The `@theme inline` probe reads the wrong name** (spec line 199). `--font-mono` is `font-jetbrains-mono`'s `font.variable`, not a `cssVars.theme` key (EXECUTED, `registry.json`). The `cssVars.theme` names that items read are `--radius`, `--spacing`, `--text-sm` and `--text-sm--line-height`, all from `code-editor-theme.ts`, a `.ts` file. Rule 4's `--container-3xs` (Tailwind's default `@theme`) is also emitted only when used, as `composer.svelte`'s comment says. And `compile()` builds from the candidates it is given. It does not read files. Fix: probe `--text-sm--line-height` read from a `.ts` file and `--container-3xs` from a `.svelte` file, through Tailwind's scanner (`@tailwindcss/oxide`'s `Scanner`, or `@tailwindcss/node`), then `compile().build(candidates)`. Apply the probe's result to rule 4 as well as rule 2.

11. **The Intent overstates where the words live** (spec line 23). "The words live … in a doc comment on the item's own source … which its editor shows on hover." For the 513 generated rows, they do not. Q1 says so; the Intent should too. Also, when bits-ui's member has its own comment, an app's hover shows bits-ui's text, then Kuiper's (EXECUTED: re-declared `Dialog.RootProps["open"]` hovers "The open state of the dialog. KUIPER open doc."). That supports decision 5's "say only what Kuiper adds". State it in decision 5, so a writer does not restate bits-ui's sentence. Fix: one sentence in each place.

12. **`generated` ships, and the weight is a range** (spec lines 167, 220; `component-data.server.ts:102`). `componentData()` puts `apiTables(item)` into the page's data, so `generated` goes into every page's inline hydration data and its `__data.json`. It is for tests and review only. The cost is small (+14 bytes gzipped on Button, EXECUTED), but not stated. My simulation, with sentences drafted to decision 5's rules, gave +656 bytes on Button where the memo gave +429. Fix: strip `generated` in `componentData()`, or keep it in a test-only wrapper. Give Button as "0.4 to 0.7 kB", and name the gzip level. Still far inside `024`'s 430 to 480 kB. `sidebar` (78 empty rows, about 4 to 6 kB) should be compared with the `component` template's margin at the checkpoint, since `024` derives that budget from its heaviest page.

13. **Two cross-spec records** (spec lines 8, 222, 304; `roadmap.md:71`; `026` test 39).
    - The roadmap's row `023` names `020` as its only dependency. Decision 13 adds `024`. AGENTS.md says an ordering that binds other work goes in `roadmap.md`. Fix: add `024` to row `023`, or the §3 cross-lane paragraph, at the design lead's next edit.
    - `026` test 39 is titled "toast has 0 empty API rows", and covers "every member of `ToastOptions`". Test 1 has that title but reads API rows. `ToastOptions` is held by test 3, which is one test over every item. Fix: make test 3 per item, "`<item>` has 0 bare type members", so `026` can cite both titles. Or tell `026` to cite test 3.

14. **Write-ins.**
    - *Terms* (line 32): a pass-through "comes from `svelte/elements` or from bits-ui". `ToggleGroup` and `ToggleGroupItem` take `size` and `variant` from `toggle`'s `ToggleVariants`, another Kuiper item (EXECUTED; 4 of the 109). Fix text: "from `svelte/elements`, bits-ui or another item".
    - *Criterion 9:* name the transform's settings: `removeComments: true` and `verbatimModuleSyntax: true`. Without the second, the transform drops imports used only in the template on both sides. Add: a script block added only to hold types, which transpiles to nothing, counts as identical.
    - *Decision 8:* `027`'s or a later item with no table would fail test 2. Fix text: "A specification that adds an item with no table adds it to this set."
    - *The count to write:* findings 2 and 7 move the hand total from 361 to about 400. The 12-hour estimate moves with it.
    - *Memo §2:* "svelte2tsx drops a comment on a destructured binding". It keeps it in the code, but in no type. The conclusion stands.

## The open questions

- **Q1, the universal three: option 1, generated from the markup. Agree, with findings 1 and 2.** The constitution has no rule against generated text, and these sentences carry real information: which element a prop reaches. They are read from the markup, so they cannot drift. Each is short and active, one idea each, as AGENTS.md asks, once "Yours win a conflict" goes. They are not copied: bits-ui's `refProp` reads "The underlying DOM element being rendered. You can bind to this to get a reference to the element." (`shared.ts:139–146`). Option 2 would put about 513 near-identical comments in files an app owns. Option 3 loses the element's name.
- **Q2, pass-throughs: option 1, re-declared. Agree.** It is the only option an editor shows (EXECUTED, end to end), and the types stay mutually assignable (EXECUTED). Findings 5 and 6 make it safe to build.
- **Q3, exported type members: option 1, all of them. Agree, but "all" must include the union result types** (finding 7). Option 2's "about 40 shapes a prop takes" would leave out `SignInResult`, which an app returns, not passes.
- **Q4, show members on the page: option 1, not yet. Agree.** It keeps `023` out of lane S. `032` already reworks the API section. The members' comments still reach an editor.

## Checks that held

- **The unit.** "Every row `apiTables()` produces" is the right unit. It is what the page renders (`api-table.svelte:59–75`), what `depth.ts` scores, and what the existing tests read. The closing row is rightly excluded. It is one `colspan` cell, which `depth.ts` counts as empty (`depth.ts:163`). The spec records this and leaves the instrument alone.
- **Row order.** Re-declared members are destructured, so they keep their place (`api.server.ts:395–416`). The "declared but not named" loop never sees them.
- **Defaults.** The column still reads the destructuring (`api.server.ts:399–401`).
- **The changelog.** About 65 identical bullets is noise to read, but each one does a job. It sets that item page's "Updated" fact, and it tells an app why its CLI diff touched that file. 0.12.0 set the precedent. Keep them. Optionally add one release-level sentence on the generated sentences, which change no file.
- **Order against `024`.** Right. Button has 0 kB of headroom under 380 kB (`024` line 25), and `024` raises it to 430 to 480 kB (`024` line 253).
- **`020`.** It renames no prop (`020`, Kind), so the counts carry over. `pluto-theme` the alias has no files, so test 2's set of six is right after `020`.
- **`022`.** Re-cutting a broken patch with the same change and new context is the right repair. `mutations.test.ts` fails locally, so it cannot be missed (`022` line 312).
- **`026`.** The app-shell edit waits for `023`, as `026` decision 24 and the roadmap say. `023` writes the layout's comments first.

## Constitution checks

- **§4.1 source, not a package:** comments and types travel in the source an app owns. Nothing reaches back at run time. Holds.
- **§4.3 tokens are the one source:** decision 5 requires a size or colour to be named by its token or role. Holds.
- **§4.4 accessible, and proven:** no behaviour changes. Holds.
- **§4.5 and §4.6 pinned and named:** no dependency is added. Test 6 reads `node_modules/bits-ui/dist` and `node_modules/tailwindcss/theme.css`, both pinned by `bun.lock`. Holds.
- **§5 the pipeline:** full specification, memo and this review. Right: it is not a small change, since it touches about 65 items and adds tests and a generator.
- **§6 never copy prior art:** decision 5 forbids copying bits-ui's comments. The generated sentences differ from bits-ui's helpers. Holds.
- **§6 never break an installed app silently:** no interface change, by probe (finding 6 tightens the evidence). A bullet for each changed item. Holds.

## Verdict

Approve with changes. Not fit to build yet: findings 1 to 8 stand. Finding 1 is a false sentence the site would publish about 190 times. Findings 2 to 8 are rules that do not reproduce their own counts, a test that misses or passes real typos, a parser rule that changes a published row, and two guarantees that rest on review or on an unstated cost run. Findings 9 to 14 are write-ins.

## Disposition

Not yet answered.
