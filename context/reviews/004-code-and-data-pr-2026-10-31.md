# Review of 004 — Code and data (the built change)

Reviews [`specifications/004-code-and-data.md`](../specifications/004-code-and-data.md).

- **Status:** dispositioned; lands
- **Date:** 2026-10-31
- **Reviewer:** a reviewer; not the author
- **Reviewed:** the working tree against `fb942f8` (the `003` commit, tag `v0.3.0`): 26 tracked files changed (`git diff --stat`: 1,922 insertions, 90 deletions; no file under `src/lib/registry/` among them) and 28 untracked paths: the 40 files of the ten items, 10 item pages (with `code-block/+page.server.ts` and `snippets.ts`, `code-editor/example.ts`), `src/lib/preview/growing-code.svelte`, `tests/e2e/code.spec.ts`, `tests/smoke/code-add.test.ts`, the three memos, the specification and its spec review. The `context/` changes were read, not reviewed. The builders' three lists of recorded deviations from the specification were checked against the code, not trusted.
- **Re-ran:** under Bun 1.3.14 (`bun`, `bun --bun`), in the repository unless said otherwise; no Node or npm. Scripts and logs in a scratch folder outside the repository. `git status --porcelain` hashed before and after: identical; `git log` still ends at `fb942f8`.
  - `bun run check` → exit 0: `COMPLETED 1478 FILES 0 ERRORS 0 WARNINGS`.
  - `bun run lint` → exit 0, "All matched files use Prettier code style!". `bun scripts/lint-literals.ts` → exit 0, "0 literal(s) in registry item files".
  - `bun run build:tokens` twice → "no changes" both times; `src/app.css`, `registry.json` and `tokens/pluto.tokens.json` byte-identical before and after.
  - `bun test ./tests/unit` → exit 0: **442 pass, 0 fail**, 2,810 `expect()` calls, 9 files.
  - `bun run build` → exit 0: 50 files under `build/r/styles/maia/`, 50 under `build/v0.4.0/r/styles/maia/`, **68 prerendered pages**. This working copy's `build/` also holds `v0.1.0/`, `v0.2.0/` and `v0.3.0/`, copied from git-ignored `static/v0.*` left by earlier builds, as `002`'s Landing notes predict.
  - `bun --bun playwright test` → exit 0: **868 passed** (1.4 m), 9 files × 2 projects; per project: axe 143, theme 68, keyboard 72, tokens 38, blocks 33, primitives 26, viewer 25, code 15, four-dot 14.
  - `bun run test:smoke` → exit 0 at the first try: **68 pass, 0 fail**, 2,299 `expect()` calls, 5 files, 80.6 s.
  - A clean copy (the files `git ls-files -co --exclude-standard` lists, minus `context/`, `git init` in it) → `bun install --frozen-lockfile` exit 0; `bun run build` exit 0: 50 under `r/styles/maia/`, 50 under `v0.4.0/`, **0 under `v0.1.0/`, `v0.2.0/` or `v0.3.0/`**, 68 pages. The copy was deleted.
  - `build/r/styles/maia/index.json` → a JSON array of 49.
  - Probes on `vite preview` (port 4199, stopped afterwards), with Playwright 1.64.1 and axe-core 4.14.0 under Bun: the `code-editor` page with `/_app/immutable/**` blocked, so it never hydrates (4 fallback `pre`s, 0 editors) → axe 0 violations; the `chart` page, the pointer moved over the first bar in steps → the hovered `Highlight area` rect computes `fill: oklab(0.2008 0.000167 -0.0124 / 0.05)` (finding 1).
  - READ (2026-10-31): [ARIA in HTML](https://www.w3.org/TR/html-aria/), the `meter` and `pre` rows (criterion 20, finding 2); `node_modules/layerchart/dist/components/Highlight/Highlight.base.svelte` lines 180 to 222; `node_modules/@axe-core/playwright`; a scratch download of `svelte-codemirror-editor`'s `dist/CodeMirror.svelte` (419 lines; §6 below).

## Acceptance criteria against evidence

1. **Install** — met. EXECUTED: the frozen install on the clean copy, exit 0; `deps.test.ts` passes with 32 packages, 18 named by items. READ: `bun.lock` resolves `shiki@4.5.0`, `layerchart@2.9.2`, the six `@codemirror/*` and `@lezer/highlight@1.2.5` at decision 2's versions.
2. **Checks** — met. EXECUTED: 1478 files, 0 errors, 0 warnings; lint exit 0.
3. **Tokens** — met. EXECUTED: two runs, no changes; `tokens`, `contrast` (10 rows at decision 5's numbers) and `generated` (12 light, 0 dark, 12 theme, `@utility scrollbar`, 5 pseudo-elements, the ligature rule) pass.
4. **Registry source** — met. EXECUTED (`registry.test.ts`). READ: 49 items in decision 4's order; types 1, 3, 2, 1, 37, 5; 8 groups; 27 dependency names; 34 `meta.stock` (8 new, each with a 64-hex `sha256`); 10 `since` `"0.4.0"` with decision 4's titles and descriptions word for word; `code-editor` and `meter` carry `{since, group}` only.
5. **Registry build** — met. EXECUTED: 50 and 50 byte-identical; 0 `#lib`; 37 `registry:ui` targets under `<name>/`; the hook's and library's bare targets; `shiki@^4.5.0`, `layerchart@^2.9.2`, 7 of 7 CodeMirror ranges; 11 of 11 `tailwind-variants`; 0 `$UTILS$.js` or `/index.js"`.
6. **Site build** — met on the clean copy. EXECUTED: 50, 50, 0 earlier versions, 68 pages. In this working copy `build/` holds the three stale versions from the git-ignored `static/`, as described above; a clean clone has none.
7. **Dev server** — met. EXECUTED through the smoke suite's `vite dev` (`waitFor200` on `index.json`) and the built index: 49 items.
8. **Preview pages** — met. EXECUTED: 49 of 49.
9. **The lint** — met. EXECUTED: 193 files, 0 violations; 70 of 70 bad, 0 of 47 good; the script exits 0. My own grep of the 40 new files for named colours, `px`, `em`, `rem` and hex found one hit, a comment in `chart-container.svelte`.
10. **The merge path** — met. EXECUTED: 7 of 7; case (d) 11 of 11, now counting a type-only `lite` import too (deviation, second build pass).
11. **Blocks** — met. EXECUTED: `blocks.test.ts` unchanged, 33 per project.
12. **axe** — met. EXECUTED: 143 per project, 286, 0 violations; the popover page scanned 3 times with each popover open. The `code-editor` page is scanned after hydration only; my unhydrated scan also found 0 (finding 2 is a conformance gap axe does not see).
13. **Themes** — met. EXECUTED: 68 per project, 136.
14. **Tokens in the browser** — met. EXECUTED: 38 per project (35 + 3); `four-dot` 14 unchanged.
15. **Keyboard** — met as counted, with one wording gap. EXECUTED: 51 catalogue stops; 24 fixtures, 52 stops, each with the ring and each unclipped by `003` check 27's rule; 18 views, 83 stops; 5 toolbars, 42 stops. The behaviours are **18 tests** covering the 19 behaviours: the editor's Tab in and out and its Control-Enter are one test (finding 6).
16. **Heights, targets, loops** — met. EXECUTED: 48, 32 and 48 px; 0 stops under 24 × 24 in 22 fixtures; 0 loops on `002`'s 26 and `004`'s 10 pages.
17. **The code block** — met. EXECUTED: C1 to C4 in both projects. READ in `code.spec.ts`: C1 reads the raw HTML's `text-code-` spans and classless spans, 0 `style`, and fetches every referenced chunk to assert none holds `codeToHtml` (deviation, first build pass); C2 reads `=` inside its merged span and the quotes inside each string span; C3 reads the ring on the root and the clip rule; C4 reads the clipboard. None is vacuous: each count asserts `> 0` or an exact number before the property.
18. **The editor** — met. EXECUTED: E1 to E4 and the two motion checks in both projects; 4 editors (deviation, second build pass). E3's literal check is weaker than the criterion says (finding 7).
19. **The chart** — met as counted. EXECUTED: H1 in both projects. The hovered band's colour is not among the checks (finding 1).
20. **The meter** — met. EXECUTED: M1 in both projects, the two pixels included. READ (ARIA in HTML, `meter` row): "Authors SHOULD NOT use the `aria-valuemax` or `aria-valuemin` attributes on `meter` elements. Otherwise, any global `aria-*` attributes and any other `aria-*` attributes applicable to the `meter` role." `aria-valuetext` is applicable to `meter` (ARIA 1.2) and is not among the two discouraged, so the attribute is permitted. The component sets neither discouraged attribute.
21. **Popover, accordion, toggles** — met. EXECUTED: P1, A1, T1 in both projects. READ: P1 filters Tailwind's empty shadow layers (deviation, second build pass) and still asserts exactly 2 drawn layers with their geometry; A1 reads `rotate` (deviation, second build pass), which is what Tailwind 4's `rotate-90` sets.
22. **Smoke** — met. EXECUTED: `code-add.test.ts` 8 of 8 in each of 2 apps with 47 files; `001`'s, `002`'s and `003`'s files pass unchanged (68 in all).
23. **Test files** — met in the repository: 9 unit, 9 browser in 2 projects, 5 smoke, each suite exit 0. On the clean copy I ran install and build only; the chain on a clean clone is INFERRED from those and from the suites here.
24. **Release** — met. EXECUTED: `version` `0.4.0`; the `0.4.0` entry names 11 of 11 and the `scroll-area` line; the three older entries unchanged.
25. **The checkpoint and the walk** — **not met yet.** The Landing notes were not yet written. The checkpoint's two design calls are in `decisions.md`, which is evidence the checkpoint happened, but its screenshots' findings and the 136-load walk are not in the notes (finding 5; `003`'s review finding 7 was the same).
26. **Released** — tag `v0.4.0`.

## Findings, most severe first

There is no High. No item breaks an app that installs it: both smoke apps take the seven items in one `add`, build a prerendered page holding every item, type-check with 0 errors and pass our lint; the theme's twelve derived lines are exactly twelve and a second `add pluto-theme` is byte-identical (EXECUTED).

1. **Medium — layerchart's hover band paints a translucent tint inside the card** (`src/lib/registry/ui/chart/chart-container.svelte:62`; `src/routes/(site)/items/chart/+page.svelte:75`, `:156`).
   Failure: on the chart page, pointing at a bar draws `Highlight area`, a `rect.lc-rect.lc-highlight-area` whose fill layerchart sets to `color-mix(in oklab, var(--color-surface-content, currentColor) 5%, transparent)` (READ `Highlight.base.svelte:186`). We define no `--color-surface-content`, so it is the foreground at 5%: EXECUTED, the computed fill is `oklab(0.2008 … / 0.05)` over `card`. That is a translucent tint on a surface (R6, `001` decision 12), not a token, reaching the page from a stylesheet our container is the place to override (decision 10 overrides `.lc-rect`'s black stroke for the same reason). H1 checks the tooltip's shadow but not the band.
   Fix: in `ChartContainer`'s overrides, `[&_.lc-highlight-area]:fill-muted` (the hover-row inset `001` decision 8 allows; if layerchart's `--fill-color` wins, `[&_.lc-highlight-area]:[--fill-color:var(--muted)]`), and on the item page render `<Highlight area />` before `<Bars>` so the opaque band sits behind the marks; say so on the page under "Colour by token class". Add to H1: after the pointer move, the `.lc-highlight-area` rect computes `fill` equal to `--muted` with alpha 1.

2. **Medium — The editor's prerendered `<pre>` carries an `aria-label`, which ARIA in HTML prohibits on `pre`** (`src/lib/registry/ui/code-editor/code-editor.svelte:166-169`; decision 9 asks for it; E1 asserts it; `code-add.test.ts` test 5 ships it).
   Failure: READ (ARIA in HTML, 2026-10-31): `pre` has the implicit role `generic` and its row says "Naming Prohibited"; §4 says authors MUST NOT specify `aria-label` or `aria-labelledby` on such elements. Every installing app's prerendered HTML therefore holds a prohibited attribute on the page's main element until hydration, and a reader lands on an unnamed generic block all the same, since a prohibited name is not exposed. axe 4.14.0 does not flag it (EXECUTED: 0 violations unhydrated), so the suite cannot see it; the spec's own claim is "the code is in the HTML before any script", which the `pre` meets without a name.
   Fix: the author's call, recommended first: give the fallback a role that may be named, `role="group" aria-label={label}` (a group of lines, named as the editor will be), and keep E1's assertion on the name; or drop `aria-label` from the `pre` and let the visible label the app writes serve. Either way amend decision 9's sentence and the smoke page. This is the one finding that corrects the specification.

3. **Low — The preview's streaming status never shows "Streaming…" and its button never disables** (`src/lib/preview/growing-code.svelte:16-18`).
   Failure: `timer` is a plain `let`, so `running = $derived(timer !== undefined)` is computed once and stays `false`; `disabled={running}` and the "Streaming…" text are dead. EXECUTED by reading: `shown` is `$state` and drives `done`, so "Highlighted as it arrived" does appear. Preview code only; the hook and the items are unaffected.
   Fix: `let timer = $state<ReturnType<typeof setInterval> | undefined>()`, or a `let running = $state(false)` set in `start` and `stop`.

4. **Low — The copy button throws when `navigator.clipboard` is absent, and says nothing when a write fails** (`src/lib/registry/ui/code-block/code-block-copy-button.svelte:27-34`).
   Failure: in an insecure context (`http://` other than localhost) `navigator.clipboard` is `undefined`, so `.writeText` throws synchronously before the `.catch` exists: an uncaught `TypeError` in the console and no change to the button. When the promise rejects (permission refused), the `.catch(() => {})` swallows it: the name stays "Copy code" and the status region says nothing, so a reader hears no result. `003`'s rule for the password toggle and the status was that an outcome is said.
   Fix: `if (!navigator.clipboard) return;` before the call (or `navigator.clipboard?.writeText(code) ?? Promise.reject()`), and in the catch set the status to a short line such as "Could not copy", named on the item page; a check in C4 is not possible without revoking the permission, so a unit of the component is enough.

5. **Low — Criterion 25 lives in `decisions.md` and the builders' working notes, not the Landing notes.** The checkpoint's two calls (string quotes; ligatures) are recorded as decisions, which proves the checkpoint ran, but the screenshots' findings (the groove on wash at 360, 768, 1280 in both themes; the emphasised lines) and the development walk (68 pages × 2 themes, 0 page or console errors) are not in the notes, and the notes were still unwritten. Decision 3 step 5 also asks the notes to record which of the 8 live stock JSON files differ from the clone's at `6149e14`.
   Fix: write both into the Landing notes when `004` lands, with the stock-JSON comparison and the three lists of deviations.

6. **Low — "19 of 19 behaviours" are 18 tests** (criterion 15; `tests/e2e/keyboard.spec.ts:548-574`).
   Failure: the editor's "Tab in and out" and "Control-Enter" are one test, so the suite reports 18 behaviour tests per project. The count in the criterion is right about behaviours and wrong about what the runner prints; a reader re-running it sees 18 and doubts.
   Fix: split the test in two, or word the criterion "19 behaviours in 18 tests" in the Landing notes.

7. **Low — E3's "0 literals of ours" filters by `var(--`, so a rule of ours with no `var()` is never read** (`tests/e2e/code.spec.ts:457-473`).
   Failure: the check keeps rules whose text holds `.ͼ` and `var(--`, then asserts no hex or `px`. A theme rule that held only a literal (`".cm-foo": { padding: "13px" }`) would be filtered out by the second test and pass. L21 catches the source today, so this is a missing guard, not a defect.
   Fix: read the theme's own class from the editor (`[...editor.classList].find((c) => c.startsWith("ͼ"))`, the class CodeMirror gives `codeTheme`) and filter rules by that selector instead of by `var(--`; then assert the count equals the theme's rule count.

8. **Low — Copy that promises what the item cannot keep** (`src/routes/(site)/items/code-editor/+page.svelte:124-127`; decision 9 "Motion").
   Failure: "The cursor blink is the only motion, and the reduced-motion rule stops it." The caret is the browser's own (no `drawSelection`), so its blink is the platform's and no CSS of ours reaches it; the motion test proves only that the editor runs 0 animations and holds no cursor layer (deviation, second build pass: "no cursor-blink check"). The sentence claims more than the test or the code can keep.
   Fix: "The caret is the browser's own. The editor itself runs no animation." Decisions.md may note the correction to decision 9.

9. **Low — Deviations the three lists do not record.** Each is sound; the Landing notes should name them.
   - `code-editor-python.ts:29` orders the keymap `closeBracketsKeymap, defaultKeymap, historyKeymap`, not decision 9's `defaultKeymap, historyKeymap, closeBracketsKeymap`. The build is right: `defaultKeymap` binds Backspace first, and a keymap stops at the first handler that returns true, so decision 9's order would never delete a bracket pair. Say so.
   - `chart-container.svelte:62` overrides more layerchart classes than decision 10 lists (`.lc-axis-tick`, `.lc-rule-x-line`, `.lc-rule-y-line`, `.lc-grid-x-line`, `.lc-grid-y-line`, `.lc-root-container`), and the figure carries `aria-labelledby` beside the `figcaption` that already names it (harmless).
   - `chart-container.svelte:82-86` swaps `CaretRight` for `CaretDown` on open, where decision 12's accordion turns one caret; both are `003`'s rule, but the two items differ, and the page could say which is which.
   - `code-block-content.svelte:79` applies the groove whenever the block has a header anywhere (`group-has-data-[slot=code-block-header]`), not only when one precedes the content; the same in practice.

## The builders' deviations, checked

The first build pass: Shiki lazily imported inside `getHighlighter` — holds (READ `highlighter.ts:165-171`; C1 fetches every chunk and finds no `codeToHtml`). `meta.function-call.generic` — holds, and the comment says why. `GrammarState` derived from the highlighter's return type — holds. `snippets.ts` beside `+page.server.ts` — holds (SvelteKit's export rule). `ansi` dropped — as decision 1. Lint rule names — holds; three rule names for two decisions, each sampled. The groove by a group variant — holds (C3). Every line's transparent marker — holds (`code-block-line.svelte:9`), and it is why the emphasised marker shifts no column. `CodeBlockTitle` inherits colour — holds. `pre:*` — holds; the wildcard matches the tag only, and the stop is still asserted inside the fixture with the ring. Clipboard granted — holds. C1 `codeToHtml` — holds. C2 `=` inside its merged span — holds. `max-w-2xl` — a page layout, fine. The copy button's prop is `code` — as decision 8.

The second build pass: four editors — holds (E1 counts 4). Disabled `tabindex="-1"` — holds, and the fixture's Tab order proves it reachable only when enabled. No cursor-blink check — holds (finding 8 is about the page's words). `background-color: transparent` on bracket rows — holds and is lint-clean. The group fixture's first item checked — holds (bits-ui parks the stop on the first item). Three heading sets on the accordion page — holds; axe `landmark-unique` passes. No `transition` on the trigger, an explicit list on the toggle — holds; `outline-color` never animates. (d) counts type-only imports — holds. Accordion root without border or clip — holds (A1, the unclipped check). Toggle text sizes — on the type scale. A1 reads `rotate`, P1 filters empty layers — hold. String punctuation to `string`, docstring quotes to `comment` — holds (C2 checks every string span holds its own quotes). `font-variant-ligatures: none` — holds in the theme, the editor and the generated `app.css`, where the rule joins the `code, kbd, samp, pre` block once.

The third build pass: `figcaption` first — holds (Svelte's `a11y_figcaption_index`). Exactly 2 figures, the fixture is the Variants chart — holds. H1 moves the mouse in steps — holds, and my probe needed it too. `chart` names `phosphor-svelte` — holds (the two carets); decision 4's table should gain it. `config` optional — holds, default `{}`. `registry-add.test.ts` check 4 expects the 12 derived lines — holds; it asserts exactly 12, each `--code-<slot>: var(--code-<slot>)`, then the rest equal to ours. `summary` in the tabbable selectors — holds. `ChartTooltip` drops `indicator` and `color` — holds; both wrote a `style`. `bandPadding` and `ticks` — page props, fine.

## The change against the specification, by decision

- **1, 4 (scope, entries):** 10 items, 40 files, 49 entries in order, groups and descriptions word for word (READ `registry.json`). No `001`, `002` or `003` item file is edited (`git diff --stat`); `button`, `status` and `page-states` untouched.
- **2, 3 (packages, provenance):** `package.json` names the 9 at caret ranges; `bun.lock` at the exact versions; 8 `meta.stock` with `cli` `1.7.1`, the date and a SHA-256. `chart` names `phosphor-svelte` beyond the table (deviation, third build pass).
- **5 (theme):** the token file's `code` map, `validateTokens` refusing a primitive or hex (unit-tested), `build-tokens` emitting 12 `--code-*` in `light`, 12 `--color-code-*` in `theme`, `@utility scrollbar`, the meter's 6 rules in `@layer components`, and the ligature rule. Generated `src/app.css` and `registry.json`'s `pluto-theme` carry all of them (READ the diff; `generated.test.ts`). The app's twelve derived `@theme inline` lines are harmless as claimed: the value is a self-reference inside `@layer theme`, the unlayered `:root` definition wins the cascade before any cycle is computed, and `--code-` is no Tailwind namespace (INFERRED from the CSS cascade; EXECUTED that both smoke apps build and the second `add` is byte-identical).
- **6, 7 (the theme object, classes):** 18 scope rules, every colour `var(--code-<slot>)`, bold on functions, underline on links, no italic, no `terminal.ansi*`; `tokenClasses` has 11 entries, every slot but `foreground`; `tokenClass` adds `font-medium` and `underline` from the bit field; the hook returns `{ content, class }`. Imports as decision 7 (`.svelte.js` for the hook, extensionless for the library).
- **8 (`code-block`):** root `bg-muted` with `overflow-hidden` and the `has-[…]:focus-ring` recipe, the `pre` `focus-visible:focus-ring-none` with the two allowlist entries; header, title, actions, footer, sizes, variants, `counter-reset`, the three emphasised variants with `bg-code-active-line` and a 2 px marker, `+` and `−` by `after`. `startLine` gone. Copy button `ghost` `icon-sm`, "Copy code" → "Copied" with a `Status` beside it (finding 4 on its failure path).
- **9 (`code-editor`):** `onMount`, `$bindable` value with the two-way sync and no flags, three compartments, `contentAttributes` with `tabindex`, `Prec.highest` on both run keys, `focus`, `reset`, `getView`, the fallback `pre` (finding 2 on its name), root without `overflow-hidden`. The theme file reads only `var()`s: colours from `:root` names, five `@theme inline` names, as decision 9 lists (READ line by line; L21 passes it). `pythonSetup` has every extension named (keymap order, finding 9).
- **10 (`chart`):** `figure` with `figcaption`, `details` "Show as table", `ChartConfig` with `swatch`, the indicator only with a swatch, no `style`, no injected sheet, no `THEMES`, no motion. The hover band (finding 1).
- **11 (`popover`):** `role="dialog"`, `aria-labelledby` the title through context else `aria-label` from `label`, `w-3xs`, `shadow-elevation`, no border, `animate-enter`/`exit`, `sideOffset` 4. The three preview popovers under axe.
- **12 (`accordion`):** `$props.id()` per item, `aria-controls`, `region` labelled by the trigger, `level` default 3, one `CaretRight` with `rotate-90`, `not-first:groove`, no animation, no tint.
- **13 (`toggle`, `toggle-group`):** `data-[state=on]:bg-foreground text-background`, `h-12`/`h-8`, `min-w-12`/`min-w-8`, outline variant on `border-input`; the group joins radii and borders, `spacing` gone, `role="group"` kept.
- **14 (`meter`):** native `<meter>` with `value`, `min`, `max`, `aria-valuetext`, `h-2 w-full block rounded-none`; colours from the theme's rules.
- **15 (lint):** `INJECTED_STYLE` and the `.ts` string rules; samples 70 bad, 47 good; both allowlists grown.
- **16 (pages):** 10 pages with the five sections; the `code-block` page prerendered through `highlightCode`; the hook pages stream on a button, not on load (finding 3 on the preview's status).
- **17, 18 (tests, release):** counts as re-run above; `0.4.0`; the changelog entry's lines read as decision 18 asks.

## Accessibility, against the specification's contracts

- **Name, role, value.** Editor content: `role="textbox"`, `aria-multiline`, `tabindex="0"`, `aria-label`, `aria-describedby` naming the visible hint (E2); `readonly` says `aria-readonly` and stays editable-attribute `true`; `disabled` is `contenteditable="false"` with `tabindex="-1"`. Popover: `dialog` named by its title or `label` in 3 of 3 (P1, axe). Accordion: 3 of 3 triggers with `aria-controls` to a `region` labelled by them, `aria-level` 3 (A1). Toggle: `button[aria-pressed]`; group items `radio[aria-checked]` under `role="group"` with `aria-label` on the page (T1). Meter: named by `Label for` or `aria-label`, `aria-valuetext` permitted (criterion 20). Chart: `figure` named by its visible `figcaption`, the table behind a native `summary` (H1). Copy button: "Copy code" → "Copied", the status region present from first render (C4).
- **Keyboard.** Tab into and out of the editor with the document unchanged; Control-Enter and Meta-Enter run and insert no line (E4, behaviours). The `pre` is a stop that scrolls (C3). Popover: Enter opens with focus on the first stop, Escape returns it. Accordion: ArrowDown moves, Enter opens. Toggle group: ArrowRight browses, Space selects. 52 of 52 fixture rings drawn and unclipped.
- **axe exclusions.** None added; the suite still excludes only `003`'s viewer iframe on block pages.
- **Gaps.** The fallback `pre`'s prohibited name (finding 2); the hover band's tint (finding 1) carries no information, so it fails no SC, only R6.

## Constitution checks

- **§4.1 source, not a package:** holds. READ: built items carry `$UI$`, `$UTILS$`, `$LIB$`, `$HOOKS$`; 0 of 50 hold `#lib`. EXECUTED: both smoke apps build and check.
- **§4.2 driven by need:** criterion 26 is the release, tag `v0.4.0`.
- **§4.3 tokens are the one source:** holds in our files. EXECUTED: the lint, 0 in 193; my grep, 0 literals in the 40 new files; E3's `var()` rules hold no hex or `px`; `code-editor-theme.ts` read line by line, every value a `var()`, `calc()` of `var()`, `transparent`, `none`, `solid`, `thin` or `underline wavy`. One colour reaches the page from outside our files: layerchart's 5% tint (finding 1).
- **§4.4 accessible by default:** holds, with finding 2's prohibited attribute in the prerendered editor. EXECUTED: axe 0 in 286 plus my unhydrated scan; the keyboard and behaviour checks above.
- **§4.5 pinned:** holds. `bun.lock` resolves the 9 at decision 2's exact versions; `--frozen-lockfile` installs the clean copy.
- **§4.6 named dependencies:** holds. READ: every new item names `utils` and `pluto-theme`; `highlighter` names `shiki@^4.5.0`; `code-editor` the 7; `chart` `layerchart@^2.9.2` and `phosphor-svelte`; the four bits-ui items `bits-ui` and `@internationalized/date`; `toggle`, `toggle-group`, `code-block` `tailwind-variants`; no `codemirror`, no `tailwind-merge`.
- **§6 never copy:** holds. READ: `code-editor.svelte` against the scratch `svelte-codemirror-editor` `CodeMirror.svelte` (419 lines): the prior art imports every feature package, debounces changes by 300 ms, calls `setState` on each parent change behind three flags, reconfigures everything with `StateEffect.reconfigure`, binds Tab by default and removes the outline; ours imports `state` and `view` only, compares document strings and dispatches a change, uses three compartments, binds no Tab and draws `001`'s ring. The one shared idea, a `<pre>` of the value on the server, is the memo's described lesson (§7), not its code. `meter.svelte` is 40 lines of ours. The six stock items are installed through `add` and restyled, which §4.6 allows; the hand-made theme and `tokenClass` are ours. No clone's code appears in the tree.
- **§6 no commit, no silent break:** `git log` ends at `fb942f8`; `pluto-theme`'s change is additive and the changelog says so; no landed item's interface changes.
- **Bun everywhere:** holds. READ: the new tests spawn through `process.execPath` and `bin()`; no `node` or `npx`.

## Verdict

Does not land yet: finding 1 stands (a translucent tint of the foreground reaches the chart page on hover, from layerchart's stylesheet our container does not override) and finding 2 stands (the editor's prerendered `pre` carries a name ARIA in HTML prohibits, in every installing app's HTML). Every countable criterion from 1 to 24 reproduces at the specification's numbers, no item breaks an installing app, criterion 25 waits on the Landing notes, and findings 3 to 9 are Low.

## Disposition

Answered by the author, the design lead, on 2026-10-31. Every finding is fixed; none is refused. The fixes were applied and the full `bun run test` re-run: unit 442, browser 870 (the split test adds one per project), smoke 68, exit 0.

1. **Fixed.** `ChartContainer` overrides `[&_.lc-highlight-area]:fill-muted` (the utilities-layer class beats layerchart's `:where()` rule in `@layer base`, so no `--fill-color` fallback was needed); the item page draws `<Highlight area />` before the marks and says the band is the `muted` inset; H1 asserts the band's computed fill is `--muted` with no alpha (`rgb(234, 234, 231)` light, `rgb(43, 45, 50)` dark). Recorded as a design call.
2. **Fixed.** The fallback is `<pre role="group" aria-label>`, a named group of lines; E1 asserts the role; the item page says so; the smoke page still ships it. Recorded as a design call that amends decision 9's wording.
3. **Fixed.** `growing-code.svelte` keeps `running` as `$state`, set in `start` and `stop`.
4. **Fixed.** The copy button returns early without `navigator.clipboard`; a refused write sets the status to "Could not copy" and leaves the name "Copy code"; the item page names the outcome.
5. **Fixed.** The Landing notes hold the checkpoint's findings, the walk, the stock-JSON comparison and the lists of deviations.
6. **Fixed.** The editor's two behaviours are two tests; the suite lists 19 per project.
7. **Fixed.** E3 finds the editor's own `ͼ` theme class (the one whose rules hold `var(--code-`), asserts exactly one, exactly 12 rules (the theme's 12 keys), 0 hex and 0 `px`.
8. **Fixed.** The page reads "The caret is the browser's own. The editor itself runs no animation."
9. **Fixed.** The four deviations are in the Landing notes (note 5, items 7, 10 and 15); the chart's details now turns one `CaretRight` 90° on `group-open`, as the accordion does, recorded as a design call.

Verdict after disposition: lands.
