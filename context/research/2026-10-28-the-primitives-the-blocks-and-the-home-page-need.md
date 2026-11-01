# The primitives the blocks and the home page need

- **Status:** complete
- **Date:** 2026-10-28
- **Author:** the design lead
- **Question:** Which stock shadcn-svelte "maia" items must specification `002` restyle to our tokens and serve from our registry, so that it covers (a) a product home page and an admin page, and (b) the first blocks set? For each one: its files, its packages, and every class that breaks a `001` token rule. Which needs have no stock item at all?
- **What it blocks:** specification `002`, the primitives; through it, the blocks specification.

## How to read this memo

Every claim carries a label.

- **EXECUTED**: we ran it and saw the result, on 2026-10-28, macOS (Darwin 25.5.0, arm64), Bun 1.3.14.
- **READ**: a source says so. Each source was read on 2026-10-28. Paths in the prior-art clone are relative to `context/prior_art/shadcn-svelte/`, at commit `6149e14` (the CLI 1.7.1 release, `context/prior_art/README.md`).
- **INFERRED**: our reasoning.

Scratch work was done in a folder outside this repository, and the scripts were not kept: `scan.ts` (the lint run and the wider scan), `table.ts` (this memo's inventory table), `patterns.ts`, `probe.ts`, and their outputs. Nothing was written to this repository except this memo.

Terms of art used below.

- **Primitive.** In this memo, a `registry:ui` component item, such as `button`. Specification `001` uses the same word for a raw colour token, such as `ink` (`001`, Intent). Here it always means the component.
- **Stock item.** An item from shadcn-svelte's own registry, as `add` serves it.
- **Maia.** One of eight visual presets ("styles") the stock registry is built in. Ours is maia (`001` decision 21).
- **Block.** A composed page or section served by the registry as source (decisions.md, "Blocks, and they shape `002`").
- **bits-ui.** The headless (unstyled, behaviour-only) Svelte component library most stock items wrap.
- **The lint.** `scripts/lint-literals.ts`, `001`'s literal lint. It exports `lintText`.
- **The wider scan.** Our scratch scan for the `001` decision-29 rules the lint does not test (section 5).
- **Tint.** A colour class with an opacity modifier, such as `bg-input/30`: the token at 30% over whatever lies beneath.
- **Live region.** An element whose changes a screen reader announces without moving focus, set by `aria-live` or a role such as `log` or `status`.
- **Meter.** An ARIA role for a value within a known range, such as fuel used of a cap. It differs from `progressbar`, which is a task advancing to completion.

## In short

- The union list is **41 stock primitives plus 3 support items** (two hooks and a library file). 15 serve both the home page and the blocks, 8 only the home page and the admin page, and 18 only the blocks. Five more are deferred (section 6.1, INFERRED).
- **The lint passes 15 of the 44 as they stand; 29 fail it** (EXECUTED). It finds 150 literals in the 44, and 168 across all 49 inventoried. Only 8 of the 44 are clean by both the lint and the wider scan.
- **The lint does not see most of what decision 29 names.** `ring-ring/50`, `bg-input/30`, `shadow-2xl`, `backdrop-blur-xs`, `outline-none` and `h-9` all pass it (EXECUTED probe, section 5.2). The wider scan finds 219 more breaking classes in the 44. `002` needs a stronger lint, or review carries the load.
- **Six needs have no stock item** (READ and INFERRED): the code editor; a code block with our groove and a token-driven highlight palette; a fuel meter; the consent banner; a streamed-reply announcer for the chat pane; and a growing message composer with its submit and stop behaviour. Section 6.2 and 6.4.
- **Three tokens `002` will likely need** (INFERRED): elevation for menus and dialogs, a scrim for modal overlays, and a highlight palette. `001` left elevation to `002` (`001` decision 13).
- **bits-ui 2.20.2** is current (published 2026-10-23). It peers on `svelte ^5.33.0`, which our 5.57.3 satisfies (EXECUTED: `bun pm view`, and a clean scratch install).

## 1. What a product home page and an admin page need

### 1.1 The need

INFERRED, on 2026-10-28: what a product home page and an admin page need when the product is a code sandbox. The sandbox is the sample world of this registry's previews: it runs Python under a fuel budget. Such a home page holds:

- a tagline; an editor with tabs of examples (NumPy, Pandas, SciPy, scikit-learn), and one more tab, "Shuffle", that picks one of 25 examples and shows a dice or shuffle icon; the output, with the run's metadata beside it; an install section; a comparison table; a security section; first-party analytics; and an admin page;
- a comparison table with a source link per cell;
- the hero's headline and subhead;
- a metrics panel of eight label and value rows in priority order, with a tooltip on "Fuel", showing what a run returns;
- an editor that is bundled, not loaded from a CDN, and a visitor's HTML or SVG output only in a sandboxed frame with scripts off;
- a consent banner for every visitor, since the page has analytics, and an opt-out on the privacy page.

The admin page's metrics: a headline row with change against the previous period, a chart over time, sources with expandable referrers and a UTM tab, countries, pages, devices, editor runs and outcomes, fuel distributions, conversions, filtered traffic, time ranges with a custom range, click-to-filter and a polled "now" tile.

### 1.2 Every element, and the primitive that serves it

INFERRED from 1.1, except where a label says otherwise. "Ours" means an item this registry already serves.

| Page | Element | What it needs | Primitive |
|---|---|---|---|
| Home | Header | The lockup, two or three links, a theme toggle | `four-dot` (ours); `button` (ghost and link variants); the toggle is `005`'s `theme` item |
| Home | Hero | Headline (`text-5xl`), subhead, two calls to action, a version badge such as "pluto-sandbox 0.1.1" | `button`, `badge` |
| Home | Editor tabs | Tabs of examples; "Shuffle" with an icon, re-picking on a second press | `tabs`, with a `button` inside the Shuffle tab or beside the row |
| Home | Editor | Editable Python with highlighting, line numbers and keyboard escape | **no stock item** (section 1.3) |
| Home | Editor toolbar | Run, Reset, a keyboard hint ("Ctrl Enter") | `button`, `kbd`, `tooltip` for icon-only buttons |
| Home | Run in progress | A busy state on Run; the output area waiting | `spinner`, `skeleton` |
| Home | Output | stdout and stderr in mono, scrolled, copyable, "Output cut at 256 KiB" | `code-block` (`variant="destructive"` for stderr), `badge` for the truncation note |
| Home | Output before any run | "Run the example to see its output" | `empty` |
| Home | Run metadata | Eight label and value rows: how it ended, fuel of cap, time, memory cap, output size, limits, versions, exit code | `item` rows, `badge` for how it ended, `separator`; a **meter** for fuel (no stock item); `popover` for the fuel explanation |
| Home | Runner states | Busy, warming, rate-limited, network error | `alert` |
| Home | Install section | `pip install pluto-sandbox` and a short Python snippet, copyable; perhaps pip and uv as tabs | `code-block` with `use-highlighted-code`, `tabs` |
| Home | Comparison table | Seven or more subjects by breadth, depth, isolation and performance; a source link per cell; readable on a phone | `table`, `badge`, `popover` or a footnote link for sources; horizontal scroll from the table's own container |
| Home | Security section | A few claims, each with its mechanism and what opens the seal | `card` or `item`, `accordion` for detail |
| Home | Footer | Links, the doc ID | `separator` (the groove) |
| Home | Consent banner | Accept and decline, persistent until answered, keyboard reachable, never modal | **no stock item**; composed of `card` and `button` |
| Privacy page | Opt-out | A labelled on/off control | `switch`, `label` |
| Admin | Headline row | Six tiles, each a number and its change | `card`, `badge` |
| Admin | Over time | Visitors and page views per hour or day | `chart` |
| Admin | Time range | Seven presets and a custom range | `toggle-group` or `native-select`; custom range `range-calendar` in a `popover` (deferred) |
| Admin | Sources, countries, pages, devices | Tables; a source expands to its referrers; a UTM tab | `table`, `collapsible`, `tabs` |
| Admin | Filters | Active filters, each removable | `badge` with a `button` |
| Admin | Editor runs | Runs per tab, outcomes, fuel distributions | `chart`, `table` |
| Admin | Now tile | Visits in the last 5 minutes, polled | `card`, `badge` |
| Admin | Loading and empty | First load; a range with no data | `skeleton`, `empty` |

### 1.3 What no stock item gives these pages

- **A code editor.** Every example is editable, and the editor is bundled, not loaded from a CDN (§1.1). The stock registry has no editor (READ: the 63 folders under `docs/src/lib/registry/ui/`). INFERRED: the editor is a bundled third-party library, such as CodeMirror 6, wrapped in a component of ours and themed from our tokens. `001` put "the editor and code-block highlight palettes" out of its scope (`001` Scope, Out).
- **What the stock `code-block` is.** A read-only display of code, terminal output, logs and diffs, with an optional header, title, actions, footer, line numbers, wrapping, and highlighted, added or removed lines (READ: `docs/content/components/code-block.md` lines 27 to 29). Its content is a `<pre>` with `tabindex={0}`, so it scrolls by keyboard (READ: `docs/src/lib/registry/ui/code-block/code-block-content.svelte` lines 49 to 61). Highlighting is optional, through the `use-highlighted-code` hook and a `highlighter` library file on Shiki's JavaScript engine; it renders ANSI colours and can run on the server (READ: `code-block.md` lines 109 to 114 and 377 to 401).
- **What it is not.** It is not an editor. It has no caret, no input, no undo and no keyboard editing (READ: the component is a `<pre><code>`, lines 31 to 61). Its highlight colours are Shiki's `github-light` and `github-dark` themes, written as inline `style` colours on each token (READ: `docs/src/lib/registry/lib/highlighter.ts` lines 43, 78 and 109). Those are literal colours, which `001`'s "tokens are the one source" forbids. Its border is the form-control `border-input`, not the design book's groove (READ: `docs/src/lib/registry/styles/style-maia.css` line 1694).
- **A meter.** A run's fuel row reads like "Fuel: 4.81 billion instructions of 30 billion" (INFERRED). The stock `progress` item is a `progressbar`, which means a task advancing. bits-ui 2.20.2 ships a `meter` primitive that renders `role: "meter"` (EXECUTED: installed in a scratch project, `dist/bits/meter/meter.svelte.js` line 18). No stock item wraps it (READ: no `meter` folder under `ui/`).
- **The consent banner.** INFERRED: `sonner` (a toast) is the wrong shape. A toast is transient and may be dismissed by time; a consent choice must persist until made. A banner is a landmark region with two buttons and a link. It composes `card` and `button`. No `003` block is a consent banner (`003` decision 1), so it is app code.
- **A sandboxed output frame**, for a page that renders a visitor's HTML or SVG output. It would be an `<iframe sandbox>`, which no stock item gives. No item in this registry renders one.
- **A run-metadata list.** INFERRED: eight label and value pairs are a description list (`<dl>`). `item` gives styled rows but not `<dl>` semantics. A small stock-free component may be simpler than bending `item`.

## 2. What the blocks need

### 2.1 What the stock blocks compose

READ: the import lines of every stock block of the kinds the first blocks set needs, under `docs/src/lib/registry/blocks/`. Counts are of blocks that import each item.

| Stock blocks | Items they import |
|---|---|
| `login-01` to `login-05` | all 5: `button`, `field`, `input`; 3 of 5 add `card` (e.g. `login-01/components/login-form.svelte` lines 2 to 5). `login-03` puts "Or continue with" in a `FieldSeparator` (`login-03/components/login-form.svelte` line 49) |
| `signup-01` to `signup-05` | all 5: `button`, `field`, `input`; 3 of 5 add `card` (e.g. `signup-01/components/signup-form.svelte` lines 2 to 5) |
| `sidebar-01` to `sidebar-16` | `sidebar` 16, `breadcrumb` 16, `separator` 14, `dropdown-menu` 10, `collapsible` 9, `avatar` 6, `label` 5, `button` 4, `calendar` 2, `card` 1, `switch` 1, `popover` 1, `dialog` 1 (e.g. `sidebar-07/+page.svelte` lines 2 to 4; `sidebar-07/components/nav-user.svelte` lines 8 to 11) |
| `dashboard-01` | `sidebar`, `card`, `chart`, `select`, `toggle-group`, `dropdown-menu`, `button`, `drawer`, `is-mobile`, `input`, `label`, `separator`, `checkbox`, `badge`, `table`, `tabs`, `avatar` (its built `registryDependencies`, `docs/static/registry/styles/maia/dashboard-01.json`); plus `@tanstack/svelte-table`, `@dnd-kit-svelte/svelte`, `zod` and `layerchart` among 12 packages |
| The docs' chat demo | `bubble`, `code-block`, `dropdown-menu`, `empty`, `input-group`, `message-scroller`, `message`, `tooltip` (`docs/src/lib/registry/examples/chat-demo.svelte` lines 14 to 21) |

Three things the stock blocks show (READ, then INFERRED):

- **No stock sign-in or sign-up block has an error, loading or success state.** A search of all ten for `error`, `aria-invalid`, `spinner`, `alert`, `loading` and `disabled` found none (EXECUTED: `grep -rlniE`, no file listed). Ours must add them.
- **Stock blocks hard-code Lucide icons.** `login-02` names `@lucide/svelte@^1.27.0` and imports it directly (READ: `login-02.json`; `login-02/+page.svelte` line 2). Stock `ui` items instead carry an `IconPlaceholder` that `add` rewrites to the app's icon library (READ: `packages/cli/src/utils/transformers/transform-icons.ts` lines 25 and 82). INFERRED: our blocks use phosphor throughout, so an app never gets two icon sets.
- **The chat demo's composer** is an `InputGroup.Textarea` whose Enter-to-send is written in the example, not in the item (READ: `chat-demo.svelte` lines 319 to 330).

### 2.2 Our blocks, and what each composes

INFERRED, from 2.1 and the first blocks set (decisions.md, "Blocks, and they shape `002`"). `four-dot` is ours.

| Block | Primitives it composes |
|---|---|
| **App shell: header** | `four-dot` lockup, `button` (ghost links, call to action), `dropdown-menu` and `avatar` (signed-in menu), `sheet` (mobile navigation), `separator` (the groove) |
| **App shell: optional sidebar** | `sidebar` (which itself needs `input`, `tooltip`, `skeleton`, `separator`, `button`, `sheet` and the `is-mobile` hook, READ: `sidebar.json`), `breadcrumb`, `collapsible`, `dropdown-menu`, `avatar` |
| **App shell: footer** | `separator`, `button` (link variant) |
| **Hero, call to action, feature grid** | `button`, `badge`, `card` or `item` for each feature, `separator` |
| **Sign in, sign up** | `card`, `field` (brings `label` and `separator`), `input`, `checkbox` (remember me, terms), `button`; error: `alert` for the form and `field`'s `FieldError` per field; loading: `spinner` inside the submit `button`, controls disabled; success: `alert` or `empty` with a next step |
| **Chat pane** | `message-scroller` (the conversation view), `message`, `bubble`, `avatar`; `code-block` (size `sm`) with `use-highlighted-code` for code output; `marker` for status lines such as "Stopped: out of fuel"; `input-group` with `textarea` and `button` for the composer; `kbd` for "Enter to send"; `skeleton` for the streaming placeholder; `empty` for a new conversation; `tooltip` for icon buttons |
| **Page states** | empty: `empty`, `button`; error: `empty` or `alert`, `button`; not found: `empty`, `button`; loading: `skeleton`, `spinner` |
| **Settings form** | `card`, `field`, `label`, `input`, `textarea`, `native-select`, `switch`, `checkbox`, `radio-group`, `button`, `separator`; `sonner` for "Saved"; `alert-dialog` for a destructive confirm |

`field` is presentation only: label, description, error. `form` adds `formsnap` and `sveltekit-superforms` for validation (READ: `form.json`). INFERRED: the blocks specification decides whether its settings form needs `form`; `002` can serve `field` alone. `003`'s settings form does without it, and `form` is not served.

## 3. The stock inventory

### 3.1 Where the maia source is

- **The source folders hold placeholders, not maia's classes.** A stock component's classes are `cn-*` names, such as `cn-button-size-default` (READ: `docs/src/lib/registry/ui/button/button.svelte` lines 6 to 32). Each style's CSS defines them; maia's is `docs/src/lib/registry/styles/style-maia.css`, 1,822 lines, copied from shadcn/ui and "DO NOT EDIT" (READ: `styles/README.md`). The docs' build resolves them per style (READ: `docs/scripts/build-registry.ts` line 62).
- **The built maia items are in the clone.** `docs/static/registry/styles/maia/` holds 269 JSON files, tracked by git at `6149e14` (EXECUTED: `git ls-files … | wc -l`). Each holds the files as `add` writes them, with maia's classes inlined. For example, `button.json`'s default size is `h-9 gap-1.5 px-3 …`, which is `style-maia.css` line 186.
- **So this memo lints the built JSON.** Each item's files are read from `docs/static/registry/styles/maia/<name>.json`. Line numbers inside those files are not meaningful, because each file's content is one JSON string. The class definitions are cited by `style-maia.css` line where it matters.
- **Where packages are recorded.** Built items name their packages under `devDependencies`, with caret ranges, never `dependencies` (READ: every item in the table below). Two more packages arrive by other paths:
  - **The icon library.** For `iconLibrary: "phosphor"`, `add` rewrites each `IconPlaceholder` to `phosphor-svelte/lib/<Name>` and adds `phosphor-svelte` to the app (READ: `packages/cli/src/icons/libraries.ts` lines 50 to 59; `transform-icons.ts` line 82). There is no `@phosphor-icons/svelte` on npm (EXECUTED: "does not exist in this registry"). 15 of the 49 inventoried items carry a placeholder, 12 of them on the list (EXECUTED, `patterns.ts`).
  - **`tw-animate-css`.** `init` adds it with an `@import` (READ: `docs/src/lib/registry/config.ts` lines 270 to 276 and 305). No item names it, yet six inventoried items use its `animate-in` classes: `alert-dialog`, `dropdown-menu`, `popover`, `select`, `sheet`, `tooltip` (EXECUTED, `patterns.ts`). Our apps never run the stock `init`. INFERRED: without an item that names it, these menus open with no animation and no error.
- **Menu colour.** Built menus carry `cn-menu-target` and `cn-menu-translucent` markers. With `menuColor: "default"`, as ours is, `add` removes them; with a translucent setting it inlines `backdrop-blur-2xl` (READ: `packages/cli/src/utils/transformers/transform-menu.ts` lines 60 to 68; `style-maia.css` line 1448).

### 3.2 The rules applied

From `001` decision 29 (lines 918 to 926), decision 10 (spacing, lines 329 to 338), decision 12 (stock failures, line 402), decision 13 (focus and elevation, lines 514 to 521) and decision 21 (no translucent menus). A class breaks a rule when it is:

- **lint**: anything the lint flags: off-ladder spacing (`px-2.5`), a literal duration (`duration-100`), an arbitrary length or colour (`ring-[3px]`, `rounded-[6px]`), a palette colour (`bg-black/80`), a colour function (`color-mix(`, `oklch(`), a weight or line height not in the token file, or a `style` attribute;
- **tinted ring**: a translucent ring or outline (`ring-ring/50` measures 2.22 light and 2.65 dark, `001` line 402);
- **input tint**: `bg-input/<n>`, which greys a control now that `input` is a 3:1 border colour (`001` line 402);
- **tinted border** and **tinted fill/text**: any other `<colour>-<token>/<n>`. The exception is the state tint `bg-destructive/10` (light) or `dark:bg-destructive/20`, which `001` computed and allows off `muted`. It is not counted;
- **outline removed**: `outline-none` or `outline-hidden`. These remove `001`'s global solid `:focus-visible` outline (decision 13), so the stock halo is the only focus sign left;
- **ring width**: `ring-1`, `ring-2`, `ring-3`. `ring-0` is not counted;
- **shadow** and **blur**: `shadow-*` and `backdrop-blur-*`. the design book allows shadows on menus and dialogs only, and `001` left the elevation token to `002` (decision 13, line 521);
- **size**: a height or width step off the ladder (`h-9`, `size-3.5`). `001` decision 10 exempts sizes from the lint, but the question asks for every class that breaks a rule;
- **type step** and **tracking**: `text-lg` and `tracking-tight`, which are not token steps (`001` decision 11);
- **`dark:`**: a dark variant. Our tokens already flip per theme, so a `dark:` class picks a different token or tint than light does;
- **rounded-full**: the design book's second radius, for dot-derived shapes only. Listed, counted, for review;
- **radius (fine)**: every other `rounded-*`. `001` maps all of them to 8 px (decision 9). Listed, not counted.

### 3.3 The table

EXECUTED: `scan.ts` read each item's built JSON and ran `lintText` over each `.svelte` file's content, with the rules `loadRules` reads from this repository. **lint** is that count. **scan** counts the other breaking classes, each once, and only when the lint does not already flag it, so the two columns add. Classes are shown without their variant prefixes. The lint splits tokens on `=`, so a few of its findings are fragments of longer classes.

49 rows: the 44 on the list (section 6.1) and the 5 deferred.

| Primitive | Files | Packages (built `devDependencies`) | `registryDependencies` | lint | scan | Breaking classes |
|---|---|---|---|---|---|---|
| accordion | 5 | `bits-ui@^2.20.0`, `@internationalized/date@^3.12.0` · icons: 2 | none | 0 | 2 | tinted fill/text: `bg-muted/50`; outline removed: `outline-none`; radius (fine): `rounded-2xl` |
| alert | 5 | `tailwind-variants@^3.3.0` | none | 1 | 0 | lint: `gap-0.5`; radius (fine): `rounded-lg` |
| alert-dialog | 13 | `bits-ui@^2.20.0`, `@internationalized/date@^3.12.0` | button | 4 | 6 | lint: `duration-100` `gap-1.5` `bg-black/80`; tinted ring: `ring-foreground/5`; ring width: `ring-1`; outline removed: `outline-none`; rounded-full: `rounded-full`; blur: `backdrop-blur-xs`; type step: `text-lg`; radius (fine): `rounded-4xl` |
| avatar | 7 | `bits-ui@^2.20.0`, `@internationalized/date@^3.12.0` | none | 0 | 9 | rounded-full: `rounded-full`; ring width: `ring-2`; `dark:` ×1 |
| badge | 2 | `tailwind-variants@^3.3.0` | none | 2 | 12 | lint: `py-0.5` `ring-[3px]`; size: `h-5`; tinted ring: `ring-ring/50` `ring-destructive/20` `ring-destructive/40`; `dark:` ×4; tinted fill/text: `bg-primary/80` `bg-secondary/80` `bg-destructive/20` `bg-muted/50`; input tint: `bg-input/30`; radius (fine): `rounded-4xl` |
| breadcrumb | 8 | none · icons: 2 | none | 3 | 1 | lint: `gap-1.5` `gap-2.5`; size: `size-5` |
| bubble | 5 | `tailwind-variants@^3.3.0` | none | 17 | 4 | lint: `px-3.5` `py-2.5` `leading-relaxed` `ring-[3px]` `px-1.5` `py-0.5` `color-mix(` `oklch(` `max-w-[80%]` `bg-[oklch(from_var(--primary)_0.93_calc(c*0.4)_h)]` `bg-[oklch(from_var(--primary)_0.3_calc(c*0.4)_h)]` `bg-[oklch(from_var(--primary)_0.88_calc(c*0.5)_h)]` `bg-[oklch(from_var(--primary)_0.35_calc(c*0.5)_h)]`; rounded-full: `rounded-full`; ring width: `ring-3`; `dark:` ×2; radius (fine): `rounded-3xl` |
| button | 2 | `tailwind-variants@^3.3.0` | none | 6 | 19 | lint: `color-mix(` `ring-[3px]` `gap-1.5` `px-2.5`; tinted ring: `ring-ring/50` `ring-destructive/20` `ring-destructive/40`; `dark:` ×6; tinted border: `border-destructive/50` `border-destructive/40`; outline removed: `outline-none`; tinted fill/text: `bg-primary/80` `bg-muted/50` `bg-destructive/20` `bg-destructive/30`; input tint: `bg-input/30` `bg-input/50`; size: `h-9` `h-10` `size-9` `size-10`; radius (fine): `rounded-4xl` |
| card | 8 | none | none | 0 | 2 | tinted ring: `ring-foreground/10`; ring width: `ring-1`; radius (fine): `rounded-b-xl` `rounded-t-xl` `rounded-2xl` |
| chart | 5 | `layerchart@^2.0.0` | none | 11 | 7 | lint: `gap-1.5` `rounded-[2px]` `style=` `px-2.5` `py-1.5` `border-[1.5px]` `my-0.5`; tinted fill/text: `stroke-border/50`; size: `size-2.5` `min-w-32` `h-2.5` `w-2.5`; tinted border: `border-border/50`; shadow: `shadow-xl`; radius (fine): `rounded-lg` |
| checkbox | 2 | `bits-ui@^2.20.0`, `@internationalized/date@^3.12.0` · icons: 2 | none | 3 | 7 | lint: `rounded-[6px]` `ring-[3px]`; input tint: `bg-input/30`; `dark:` ×4; tinted border: `border-destructive/50`; tinted ring: `ring-ring/50` `ring-destructive/20` `ring-destructive/40`; outline removed: `outline-none` |
| code-block | 9 | `tailwind-variants@^3.3.0` · icons: 2 | use-highlighted-code, button | 7 | 4 | lint: `-me-1.5` `style=` `leading-relaxed` `.style` `me-1.5` `ring-[3px]`; outline removed: `outline-none`; input tint: `bg-input/30`; `dark:` ×2; tinted border: `border-destructive/30` `border-destructive/40`; radius (fine): `rounded-xl` |
| collapsible | 4 | `bits-ui@^2.20.0`, `@internationalized/date@^3.12.0` | none | 0 | 0 | none |
| dropdown-menu | 18 | `bits-ui@^2.20.0`, `@internationalized/date@^3.12.0` · icons: 3 | none | 13 | 16 | lint: `gap-2.5` `pl-9.5` `duration-100` `py-2.5`; outline removed: `outline-hidden`; tinted ring: `ring-foreground/5` `ring-foreground/10`; size: `min-w-48` `min-w-36`; shadow: `shadow-2xl`; ring width: `ring-1`; `dark:` ×2; tinted fill/text: `bg-border/50`; tracking: `tracking-widest`; radius (fine): `rounded-xl` `rounded-2xl` |
| empty | 7 | `tailwind-variants@^3.3.0` | none | 0 | 3 | size: `size-10`; type step: `text-lg`; tracking: `tracking-tight`; radius (fine): `rounded-lg` |
| field | 11 | `tailwind-variants@^3.3.0` | label, separator | 6 | 5 | lint: `leading-snug` `leading-normal` `gap-7` `ring-[3px]`; tinted fill/text: `bg-primary/5` `bg-primary/10`; tinted border: `border-primary/30` `border-primary/20`; `dark:` ×2; size: `h-5` |
| form | 9 | `formsnap@^2.1.0`, `sveltekit-superforms@^3.0.0` | button, label | 0 | 0 | none |
| input | 2 | none | none | 4 | 16 | lint: `ring-[3px]`; input tint: `bg-input/30`; tinted ring: `ring-ring/50` `ring-destructive/20` `ring-destructive/40`; `dark:` ×4; tinted border: `border-destructive/50`; size: `h-9` `h-7`; outline removed: `outline-none`; radius (fine): `rounded-4xl` |
| input-group | 7 | `tailwind-variants@^3.3.0` | button, input, textarea | 5 | 6 | lint: `ml-[-0.15rem]` `mr-[-0.15rem]` `px-1.5` `ring-[3px]`; `dark:` ×3; input tint: `bg-input/30`; size: `h-9`; outline removed: `outline-none`; radius (fine): `rounded-4xl` `rounded-xl` |
| item | 11 | `tailwind-variants@^3.3.0` | separator | 9 | 4 | lint: `leading-snug` `duration-100` `ring-[3px]` `gap-3.5` `py-3.5` `px-3.5` `gap-2.5` `py-2.5`; size: `size-10`; outline removed: `outline-none`; tinted ring: `ring-ring/50`; tinted fill/text: `bg-muted/50`; radius (fine): `rounded-lg` `rounded-2xl` |
| kbd | 3 | none | none | 0 | 3 | `dark:` ×1; size: `h-5` `min-w-5`; radius (fine): `rounded-sm` |
| label | 2 | `bits-ui@^2.20.0`, `@internationalized/date@^3.12.0` | none | 0 | 0 | none |
| marker | 4 | `tailwind-variants@^3.3.0` | none | 0 | 0 | none |
| message | 7 | none | none | 3 | 1 | lint: `gap-2.5` `px-3.5`; rounded-full: `rounded-full` |
| message-scroller | 7 | `@shadcn-svelte/primitives@^0.0.1` · icons: 1 | button | 2 | 0 | lint: `duration-200` `[contain-intrinsic-size:auto_10rem]` |
| native-select | 4 | none · icons: 1 | none | 2 | 9 | lint: `ring-[3px]`; input tint: `bg-input/30` `bg-input/50`; `dark:` ×4; tinted ring: `ring-ring/50` `ring-destructive/20` `ring-destructive/40`; tinted border: `border-destructive/50`; size: `h-9`; outline removed: `outline-none`; radius (fine): `rounded-4xl` |
| popover | 9 | `bits-ui@^2.20.0`, `@internationalized/date@^3.12.0` | none | 1 | 5 | lint: `duration-100`; tinted ring: `ring-foreground/5`; shadow: `shadow-2xl`; ring width: `ring-1`; size: `w-72`; outline removed: `outline-hidden`; radius (fine): `rounded-2xl` |
| progress | 2 | `bits-ui@^2.20.0`, `@internationalized/date@^3.12.0` | none | 1 | 0 | lint: `style=`; radius (fine): `rounded-4xl` |
| radio-group | 3 | `bits-ui@^2.20.0`, `@internationalized/date@^3.12.0` · icons: 1 | none | 0 | 11 | input tint: `bg-input/30`; `dark:` ×4; tinted ring: `ring-ring/50` `ring-destructive/20` `ring-destructive/40`; tinted border: `border-destructive/50`; rounded-full: `rounded-full`; ring width: `ring-3`; outline removed: `outline-none` |
| range-calendar | 19 | `@internationalized/date@^3.12.0`, `bits-ui@^2.20.0` · icons: 3 | button | 4 | 10 | lint: `text-[0.8rem]` `gap-1.5` `ring-[3px]`; `dark:` ×4; tinted fill/text: `bg-accent/50` `bg-accent/0`; tinted ring: `ring-ring/50`; shadow: `shadow-xs`; radius (fine): `rounded-md` |
| scroll-area | 3 | `bits-ui@^2.20.0`, `@internationalized/date@^3.12.0` | none | 2 | 5 | lint: `p-px` `ring-[3px]`; size: `h-2.5` `w-2.5`; rounded-full: `rounded-full`; outline removed: `outline-none`; tinted ring: `ring-ring/50` |
| select | 13 | `bits-ui@^2.20.0`, `@internationalized/date@^3.12.0` · icons: 3 | separator | 7 | 13 | lint: `duration-100` `py-2.5` `gap-2.5` `gap-1.5` `ring-[3px]`; tinted ring: `ring-foreground/5` `ring-ring/50` `ring-destructive/20` `ring-destructive/40`; size: `min-w-36`; shadow: `shadow-2xl`; ring width: `ring-1`; outline removed: `outline-hidden` `outline-none`; tinted fill/text: `bg-border/50`; input tint: `bg-input/30` `bg-input/50`; `dark:` ×3; tinted border: `border-destructive/50`; radius (fine): `rounded-2xl` `rounded-xl` `rounded-4xl` |
| separator | 2 | `bits-ui@^2.20.0`, `@internationalized/date@^3.12.0` | none | 0 | 0 | none |
| sheet | 11 | `bits-ui@^2.20.0`, `@internationalized/date@^3.12.0` · icons: 1 | button | 4 | 2 | lint: `duration-200` `gap-1.5` `bg-black/80` `duration-100`; shadow: `shadow-lg`; blur: `backdrop-blur-xs` |
| sidebar | 26 | `bits-ui@^2.20.0`, `@internationalized/date@^3.12.0`, `tailwind-variants@^3.3.0` · icons: 1 | is-mobile, input, tooltip, skeleton, separator, button, sheet | 13 | 18 | lint: `duration-200` `shadow-[0_0_0_1px_var(--sidebar-border)]` `shadow-[0_0_0_1px_var(--sidebar-accent)]` `style=` `mx-3.5` `px-2.5` `py-0.5` `w-[2px]` `w-[calc(var(--sidebar-width-icon)_+_(--spacing(4))_+_2px)]`; size: `w-5` `h-5` `min-w-5` `h-9` `h-14` `h-7`; ring width: `ring-2`; outline removed: `outline-hidden`; tinted fill/text: `text-sidebar-foreground/70`; radius (fine): `rounded-md` `rounded-lg` |
| skeleton | 2 | none | none | 0 | 0 | radius (fine): `rounded-xl` |
| sonner | 2 | `mode-watcher@^1.1.0`, `svelte-sonner@^1.2.0` · icons: 5 | none | 1 | 0 | lint: `style=` |
| spinner | 2 | none · icons: 1 | none | 0 | 0 | none |
| switch | 2 | `bits-ui@^2.20.0`, `@internationalized/date@^3.12.0` | none | 9 | 10 | lint: `ring-[3px]` `h-[18.4px]` `w-[32px]` `h-[14px]` `w-[24px]` `translate-x-[calc(100%_-_2px)]` `translate-x-[calc(-100%)]`; tinted ring: `ring-ring/50` `ring-destructive/20` `ring-destructive/40`; `dark:` ×5; tinted border: `border-destructive/50`; input tint: `bg-input/80`; rounded-full: `rounded-full`; outline removed: `outline-none` |
| table | 9 | none | none | 0 | 3 | tinted fill/text: `bg-muted/50` |
| tabs | 5 | `bits-ui@^2.20.0`, `@internationalized/date@^3.12.0`, `tailwind-variants@^3.3.0` | none | 7 | 13 | lint: `p-[3px]` `gap-1.5` `px-2.5` `py-1.5` `h-[calc(100%_-_1px)]` `ring-[3px]` `bottom-[-5px]`; outline removed: `outline-none`; size: `h-9` `h-0.5` `w-0.5`; tinted fill/text: `text-foreground/60`; tinted ring: `ring-ring/50`; `dark:` ×7; input tint: `bg-input/30`; radius (fine): `rounded-4xl` `rounded-2xl` `rounded-xl` |
| textarea | 2 | none | none | 2 | 6 | lint: `ring-[3px]`; input tint: `bg-input/30`; tinted ring: `ring-ring/50` `ring-destructive/20` `ring-destructive/40`; `dark:` ×2; tinted border: `border-destructive/50`; outline removed: `outline-none`; radius (fine): `rounded-xl` |
| toggle | 2 | `bits-ui@^2.20.0`, `@internationalized/date@^3.12.0`, `tailwind-variants@^3.3.0` | none | 1 | 8 | lint: `ring-[3px]`; tinted ring: `ring-ring/50` `ring-destructive/20` `ring-destructive/40`; `dark:` ×1; outline removed: `outline-none`; size: `h-9` `min-w-9` `h-10` `min-w-10`; radius (fine): `rounded-4xl` |
| toggle-group | 3 | `bits-ui@^2.20.0`, `@internationalized/date@^3.12.0`, `tailwind-variants@^3.3.0` | toggle | 2 | 0 | lint: `style=` `gap-[--spacing(var(--gap))]` |
| tooltip | 6 | `bits-ui@^2.20.0`, `@internationalized/date@^3.12.0` | none | 10 | 1 | lint: `gap-1.5` `py-1.5` `translate-y-[calc(-50%_-_2px)]` `rounded-[2px]` `translate-x-[-1.5px]` `translate-x-[1.5px]` `-translate-y-[calc(-50%_+_1px)]` `-translate-y-[calc(50%_-_3px)]` `translate-x-[calc(50%_+_2px)]` `translate-y-[calc(-50%_+_2px)]`; size: `size-2.5`; radius (fine): `rounded-2xl` |
| trace | 9 | `bits-ui@^2.20.0`, `@internationalized/date@^3.12.0` · icons: 1 | collapsible | 6 | 3 | lint: `duration-200` `mt-2.5` `ml-[calc(--spacing(2)_-_1px)]` `leading-relaxed` `ring-[3px]`; tinted ring: `ring-ring/50`; outline removed: `outline-none`; tinted fill/text: `text-muted-foreground/70`; radius (fine): `rounded-lg` |
| use-highlighted-code | 1 | `shiki@^3.20.0` | highlighter | 0 | 0 | none |
| highlighter | 1 | `shiki@^3.20.0` | none | 0 (+1 .ts) | 1 | lint: a `style:` object key; `dark:` ×1 (`dark:text-(--shiki-dark)`) |
| is-mobile | 1 | none | none | 0 | 0 | none |

**Set aside, and why** (EXECUTED counts, lint then scan; INFERRED reasons): `navigation-menu` 12 and 12, a heavy menu where plain header links serve; `dialog` 4 and 4 (`sidebar-13` alone uses it); `drawer` 6 and 3, which names `vaul-svelte@next`, an unpinned dist-tag; `command` 1 and 9; `hover-card` 1 and 5; `attachment` 4 and 5; `questionnaire` 10 and 27; `input-otp` 3 and 6; `pagination` 0 and 1; `slider` 1 and 6; `button-group` 3 and 0; `calendar` 4 and 10.

### 3.4 Patterns shared across items

EXECUTED, `patterns.ts`, over the 49 inventoried items (the 44 on the list and the 5 deferred):

| Pattern | Items | Which |
|---|---|---|
| `outline-none` or `outline-hidden` | 21 | accordion, alert-dialog, bubble, button, checkbox, code-block, dropdown-menu, input, input-group, item, native-select, popover, radio-group, scroll-area, select, sidebar, switch, tabs, textarea, toggle, trace |
| a `dark:` variant | 21 | avatar, badge, bubble, button, chart, checkbox, code-block, dropdown-menu, field, input, input-group, kbd, native-select, radio-group, range-calendar, select, switch, tabs, textarea, toggle, highlighter |
| `ring-ring/50` | 19 | badge, bubble, button, checkbox, code-block, field, input, input-group, item, native-select, radio-group, range-calendar, scroll-area, select, switch, tabs, textarea, toggle, trace |
| `ring-[3px]` or `ring-3` | 19 | the same 19 |
| `bg-input/<n>` | 14 | badge, bubble, button, checkbox, code-block, field, input, input-group, native-select, radio-group, select, switch, tabs, textarea |
| `ring-destructive/<n>` (the invalid state) | 11 | badge, button, checkbox, input, input-group, native-select, radio-group, select, switch, textarea, toggle |
| `shadow-*` | 7 | chart, dropdown-menu, popover, range-calendar, select, sheet, sidebar |
| `rounded-full` | 7 | alert-dialog, avatar, bubble, message, radio-group, scroll-area, switch |
| `ring-foreground/<n>` (a translucent ring used as a border) | 6 | alert-dialog, card, code-block, dropdown-menu, popover, select |
| `animate-in` (needs `tw-animate-css`) | 6 | alert-dialog, dropdown-menu, popover, select, sheet, tooltip |
| `backdrop-blur` | 2 | alert-dialog, sheet |

Further single findings worth naming (READ):

- `card` draws its edge as `ring-1 ring-foreground/10`, not a border (`style-maia.css` line 245). Ink at 10% is our `border` token's value, so `ring-border` or `border-border` restyles it.
- Modal overlays are `bg-black/80` with `backdrop-blur-xs` (`alert-dialog`, `sheet`; and `dialog`, `drawer`). We have no scrim token.
- `bubble` tints its grounds with relative `oklch(from var(--primary) …)` colours (built `bubble.json`). They are colour functions, and the lint flags each.
- `code-block`'s removed lines use `bg-destructive/10` (`style-maia.css` line 1737). That is allowed on the page ground but forbidden on `muted` (`001` decision 8). A code block whose ground is `muted` must not use it.
- `table`'s container is `overflow-x-auto` (`style-maia.css` line 1269), a scroll container. Chromium makes an overflowing one a tab stop, which `001` decision 24 avoided on preview pages.
- `chart` sets its series colours through a `style` attribute (built `chart.json`). INFERRED: a CSS variable set from a token through `style` may be the one acceptable use; the lint cannot tell, so `002` decides.

## 4. bits-ui and the other packages, pinned

EXECUTED: `bun pm view <package> version`, then `time`, `peerDependencies` and `license`, on 2026-10-28, from a scratch folder with its own `package.json` (`bun pm view` refuses to run without one: "Run `bun init`").

| Package | Latest | Published | Stock items name | Peers | Licence |
|---|---|---|---|---|---|
| `bits-ui` | 2.20.2 | 2026-10-23 | `^2.20.0` | `svelte ^5.33.0`, `@internationalized/date ^3.8.1` | MIT |
| `tailwind-variants` | 3.3.1 | 2026-08-03 | `^3.3.0` | `tailwindcss *`, `tailwind-merge >=3.0.0` | MIT |
| `phosphor-svelte` | 3.1.1 | 2026-10-09 | added by `add` for `iconLibrary: "phosphor"` | `svelte ^5.0.0`, `vite >=5` | MIT |
| `@lucide/svelte` | 1.63.0 | 2026-10-28 06:16 UTC | `^1.27.0` (stock blocks only) | `svelte ^5` | ISC |
| `@phosphor-icons/svelte` | does not exist | | | | |
| `svelte-sonner` | 1.2.2 | 2026-10-27 | `^1.2.0` (`sonner`) | `svelte ^5.0.0` | MIT |
| `mode-watcher` | 1.1.0 | 2025-06-28 | `^1.1.0` (`sonner`) | `svelte ^5.27.0` | MIT |
| `formsnap` | 2.1.0 | 2026-10-20 | `^2.1.0` (`form`) | `svelte ^5.0.0`, `sveltekit-superforms ^2.19.0 \|\| ^3.0.0` | MIT |
| `sveltekit-superforms` | 3.0.0 | 2026-10-04 | `^3.0.0` (`form`) | `svelte ^5.56.4`, `@sveltejs/kit ^2.12.0 \|\| ^3.0.0`; every validator library optional | MIT |
| `paneforge` | 1.0.2 | 2025-08-02 | `^1.0.2` (`resizable`) | `svelte ^5.29.0` | MIT |
| `vaul-svelte` | 0.3.2 (`next`: 1.0.0-next.7) | 2024-06-29 | `@next` (`drawer`) | `svelte ^4.0.0 \|\| ^5.0.0-next.1` | MIT |
| `@internationalized/date` | 3.12.4 | 2026-09-01 | `^3.12.0` (every bits-ui item) | none | Apache-2.0 |
| `embla-carousel-svelte` | 8.6.0 | 2025-04-04 | `^8.6.0` (`carousel`) | `svelte ^3.49.0 \|\| ^4.0.0 \|\| ^5.0.0` | MIT |
| `layerchart` | 2.9.1 | 2026-10-23 | `^2.0.0` (`chart`) | `svelte ^5.0.0` | MIT |
| `shiki` | 4.5.0 (newest 3.x: 3.23.0) | 2026-10-01 | `^3.20.0` (`highlighter`) | none | MIT |
| `@shadcn-svelte/primitives` | 0.0.1 | 2026-10-05 | `^0.0.1` (`message-scroller`) | `svelte ^5.33.0` | MIT |
| `tw-animate-css` | 1.4.0 | 2025-09-24 | named by no item; `init` adds it | none | MIT |
| `tailwind-merge` | 3.7.0 | 2026-09-12 | named by no item; a peer of `tailwind-variants` | | MIT |

**bits-ui and our svelte.** Our svelte is 5.57.3 (`001` decision 4). It satisfies `^5.33.0` (INFERRED from semver). bits-ui 2.20.2 is itself developed against svelte 5.57.2 (EXECUTED: its `package.json` `devDependencies`, installed in a scratch project). The install of `bits-ui@2.20.2`, `svelte@5.57.3` and `@internationalized/date@3.12.4` there finished with 33 packages and no warning (EXECUTED). Its own dependencies are `runed`, `esm-env`, `tabbable`, `svelte-toolbelt`, `@floating-ui/dom` and `@floating-ui/core` (EXECUTED).

What the table shows (INFERRED):

- **Every bits-ui item names `@internationalized/date`** because bits-ui peers on it, not because the item uses dates.
- **`shiki@^3.20.0` cannot take 4.5.0.** A caret on 3.x stops below 4. An app got 3.23.0 on this date.
- **`^0.0.1` is exactly 0.0.1.** A caret on a 0.0.x version allows no other release. `@shadcn-svelte/primitives` is three weeks old at its first version.
- **`vaul-svelte@next` is a dist-tag, not a range.** It moves when its authors publish. `drawer` is set aside partly for this.
- **`tailwind-variants` needs `tailwind-merge` as a peer.** Our `utils` merges through `cn` instead (`001` decision 20). So an app with a `tailwind-variants` item has two merge engines. Whether Bun installs the missing peer on its own was not checked for this memo, and whether the two engines agree on our custom classes (`tracking-mark`, `text-5xl`) was not tested. `002` decision 2 settles both: the peer is optional, and every item imports `tv` from `tailwind-variants/lite`, which does not merge, so `cn` is the one engine.
- **`@lucide/svelte` 1.63.0 is hours old.** Only stock blocks name Lucide. Our blocks use phosphor, so it does not reach us.
- **`sonner` brings `mode-watcher`.** `001` left the choice of `mode-watcher` open. Adding `sonner` in `002` makes that choice early. `005` declined both: `sonner` is not served, and the theme is source of our own (decisions.md, "The design calls for `005`, overlays, navigation and the chat primitives").

## 5. What our lint rejects as-is

### 5.1 The run

EXECUTED: `scan.ts` (section 3.3). The lint found **150 literals in the 44 items on the list**, 168 across the 49 inventoried, and none in `.ts` files except one `style:` key in `highlighter.ts`.

- **The lint passes 15 of the 44 unchanged:** `accordion`, `avatar`, `card`, `collapsible`, `empty`, `kbd`, `label`, `marker`, `radio-group`, `separator`, `skeleton`, `spinner`, `table`, and the hooks `use-highlighted-code` and `is-mobile`. The other 29 fail it.
- **8 of the 44 are clean by both the lint and the wider scan:** `collapsible`, `label`, `marker`, `separator`, `skeleton`, `spinner`, `use-highlighted-code`, `is-mobile`. (`form`, deferred, is clean too.)

Largest lint counts: `bubble` 17, `dropdown-menu` 13, `sidebar` 13, `chart` 11, `tooltip` 10, `item` 9, `switch` 9, `code-block` 7, `select` 7, `tabs` 7.

### 5.2 What the lint does not see

EXECUTED: `probe.ts` ran `lintText` on one class at a time, inside `<div class="…">`.

| Class | Lint |
|---|---|
| `focus-visible:ring-ring/50` | not flagged |
| `bg-input/30`, `dark:bg-input/30` | not flagged |
| `hover:bg-primary/80` | not flagged |
| `shadow-2xl` | not flagged |
| `supports-backdrop-filter:backdrop-blur-xs` | not flagged |
| `outline-none` | not flagged |
| `h-9`, `size-3.5` | not flagged (by design, `001` decision 10) |
| `text-lg`, `tracking-tight` | not flagged |
| `rounded-4xl` | not flagged (correct: it maps to 8 px) |
| `focus-visible:ring-[3px]` | arbitrary value |
| `px-2.5` | spacing off the ladder |
| `bg-black/80` | palette colour |
| `duration-100` | literal duration |
| `font-semibold` | font |
| `color-mix(…)` | colour function |

So the two classes decision 29 names first, `ring-ring/50` and `bg-input/30`, pass the lint. The wider scan finds **219 such classes in the 44 items** (section 3.3, scan column). INFERRED: `002` either extends the lint (token tints, `outline-none`, `shadow-*`, `backdrop-*`, `dark:`, type and tracking steps) or names review as the check for each. A lint rule is countable, which `001`'s acceptance style prefers.

## 6. INFERRED: the list, the gaps and the effort

### 6.1 The 002 primitive list, in priority order

**Effort** grades lint plus scan: **S** 0 to 5, **M** 6 to 15, **L** 16 or more. It measures classes to change, not design thought.

**Needed by both** (15, plus 2 support items):

| # | Primitive | Home page use | Block use | lint + scan | Effort |
|---|---|---|---|---|---|
| 1 | `button` | run, reset, calls to action, copy | every block | 6 + 19 | L |
| 2 | `code-block`, with `use-highlighted-code` and `highlighter` | install, output | chat code output | 7 + 4, and 1 + 1 | M, and L with the groove and palette (6.2) |
| 3 | `card` | sections, admin tiles, consent banner | sign in, settings, features | 0 + 2 | S |
| 4 | `badge` | version, how a run ended, "not safe" | hero | 2 + 12 | M |
| 5 | `alert` | runner busy, warming, errors | form errors, error page | 1 + 0 | S |
| 6 | `empty` | output before a run, admin no data | page states, new chat | 0 + 3 | S |
| 7 | `skeleton` | output while running, admin loading | loading page, streaming | 0 + 0 | S |
| 8 | `spinner` | Run busy | submit busy | 0 + 0 | S |
| 9 | `separator` | sections, footer | shell, forms | 0 + 0 | S |
| 10 | `item` | metadata rows, security points | feature grid | 9 + 4 | M |
| 11 | `tooltip` | icon-button names | sidebar, chat | 10 + 1 | M |
| 12 | `kbd` | "Ctrl Enter" | "Enter to send" | 0 + 3 | S |
| 13 | `switch` | privacy opt-out | settings | 9 + 10 | L |
| 14 | `collapsible` | admin source rows | sidebar groups | 0 + 0 | S |
| 15 | `native-select` | admin range | settings | 2 + 9 | M |

**Needed by the home page and the admin page only** (8):

| # | Primitive | Use | lint + scan | Effort |
|---|---|---|---|---|
| 16 | `tabs` | the editor tabs, install tabs, admin UTM | 7 + 13 | L |
| 17 | `table` | comparison, admin | 0 + 3 | S |
| 18 | `popover` | the fuel note, source notes | 1 + 5 | M |
| 19 | `accordion` | security detail | 0 + 2 | S |
| 20 | `scroll-area` | long output, if the code block's own scroll is not enough | 2 + 5 | M; may be dropped |
| 21 | `chart` | admin over time, outcomes, fuel | 11 + 7 | L |
| 22 | `toggle-group` | admin range presets | 2 + 0 | S |
| 23 | `toggle` | needed by `toggle-group` | 1 + 8 | M |

**Needed by the blocks only** (18, plus `is-mobile`):

| # | Primitive | Block | lint + scan | Effort |
|---|---|---|---|---|
| 24 | `field` (brings `label`) | sign in, settings | 6 + 5 | M |
| 25 | `label` | forms | 0 + 0 | S |
| 26 | `input` | sign in, settings, sidebar | 4 + 16 | L |
| 27 | `textarea` | composer, settings | 2 + 6 | M |
| 28 | `input-group` | composer | 5 + 6 | M |
| 29 | `checkbox` | sign up, settings | 3 + 7 | M |
| 30 | `radio-group` | settings | 0 + 11 | M |
| 31 | `message-scroller` | chat view | 2 + 0 | S |
| 32 | `message` | chat | 3 + 1 | S |
| 33 | `bubble` | chat | 17 + 4 | L |
| 34 | `marker` | chat status lines | 0 + 0 | S |
| 35 | `avatar` | shell menu, chat | 0 + 9 | M (mostly `rounded-full`) |
| 36 | `dropdown-menu` | shell user menu | 13 + 16 | L |
| 37 | `sheet` | mobile navigation, sidebar | 4 + 2 | M |
| 38 | `breadcrumb` | sidebar shell | 3 + 1 | S |
| 39 | `sidebar`, with `is-mobile` | sidebar shell | 13 + 18 | L |
| 40 | `sonner` | settings "Saved" | 1 + 0 | S, but brings `mode-watcher` |
| 41 | `alert-dialog` | settings destructive confirm | 4 + 6 | M |

**Deferred**, and none is served as of `v0.7.0`: `trace` (6 + 3; for a chat with tool calls, which no block has), `form` (0 + 0; `003`'s settings form does without it), `range-calendar` (4 + 10; an admin page's custom range), `select` (7 + 13; `native-select` covers both uses), `progress` (1 + 0; the fuel meter replaces it).

Totals for the 44: lint 150 (plus 1 in `.ts`), scan 219. By grade: 20 S, 16 M, 8 L. The grade of `highlighter` (S) ignores the palette work of 6.2.

**Sizing.** 41 primitives is large for one specification, which `context/README.md` keeps small enough for one builder. The 19 inventoried items with the `ring-ring/50` halo, and the 21 that remove the outline, share one pattern (section 3.4). One recipe fixes it: drop `outline-none`, the `ring-[3px]` halo and `ring-ring/50`, keep `001`'s solid outline, and show invalid state with a solid `border-destructive` plus `FieldError` text. That recipe is most of the scan count. Still, `002` might split into two specifications: the home-page set (items 1 to 23) and the blocks set (24 to 41). It split by another line: `002` took forms, surfaces and feedback, `004` code and data, and `005` overlays, navigation and the chat primitives (decisions.md, "The primitives split in two, and the design calls for `002`").

### 6.2 Parts no stock item gives

1. **The code editor.** A bundled editor (CodeMirror 6 is the obvious candidate; the CodeMirror memo of 2026-10-31 researched it) in a component of ours. Needs: tokens for its colours and highlight palette; `001`'s focus outline; a documented way out of the editor by keyboard, since Tab inside it indents; line numbers that match `code-block`'s.
2. **`code-block` with our groove and palette.** Replace `border-input` with the `groove` utility (`001` decision 13); use `muted` as the code ground, as `001` decision 8 allows; replace Shiki's `github-light` and `github-dark` with a theme whose colours are CSS variables set from tokens (Shiki has a `css-variables` theme; the Shiki memo of 2026-10-31 verified it, §1.2 and §3). The same palette must serve the editor, so the two match.
3. **A fuel meter** on bits-ui's `meter`, styled from tokens. Not `progress`.
4. **The consent banner**, composed of `card` and `button` (section 1.3).
5. **Three tokens:** an elevation shadow for menus and dialogs (7 items use `shadow-*`); a scrim for modal overlays (4 items use `bg-black/80`); and the highlight palette of item 2.
6. **An item that names `tw-animate-css`**, or menus that animate with our motion tokens instead (section 3.1). `002` decision 3 takes the second.

### 6.3 Effort, read from the counts

- **L, and a design decision each:** `button` (variants and sizes off the ladder), `tabs` (the line and pill variants; `dark:` ×7), `switch` (arbitrary pixel sizes for its thumb), `input`, `dropdown-menu` and `sidebar` (elevation, the menu's inset padding `pl-9.5`), `bubble` (its `oklch` relative tints need a token answer), `chart` (`style` for series colours; the amber series must be labelled directly, `001` decision 12).
- **M:** mostly the shared focus and invalid recipe, plus sizes. `badge` adds hover tints on links; `item` adds `-3.5` and `-2.5` spacing; `tooltip`'s 10 lint findings are arrow offsets in arbitrary pixels.
- **S:** restyle by tokens alone, or nothing to change: `card` (one ring), `table` (three `bg-muted/50` row tints, which must become `muted` or `accent`), `skeleton`, `spinner`, `separator`, `collapsible`, `label`, `marker`, `empty`, `kbd`, `alert`, `accordion`, `breadcrumb`, `message`, `message-scroller`, `sonner`, `toggle-group`.
- **A zero is not a pass.** The lint and the scan cannot see where a class is used. The `muted` rule and "no state tint on `muted`" (`001` decision 8) are still review's.

### 6.4 What the chat pane needs that no stock item gives

For the blocks specification to decide. `005` and `006` decided it (decisions.md, "The design calls for `005`, overlays, navigation and the chat primitives"; decisions.md, "The design calls for `006`, the app shell and the chat pane").

- **The conversation view is mostly covered.** `message-scroller`'s content has `role="log"` and `aria-relevant="additions"` by default (READ: `packages/primitives/src/lib/message-scroller/message-scroller.svelte.ts` lines 1358 to 1361). Its viewport is a focusable `region` labelled "Messages" (READ: `message-scroller.test.ts` lines 228 to 232). `aria-busy` passes through (READ: test line 253; `chat-demo.svelte` line 262).
- **A streamed reply is not announced well.** `aria-relevant="additions"` announces new nodes, not text appended to an existing one. A streamed reply grows one node, so it is silent; switching to `"additions text"` makes it chatty (INFERRED from the ARIA definitions). Needed: `aria-busy="true"` on the log while a reply streams, and a separate polite live region (`role="status"`) that announces once when the reply completes or stops. No stock item does that.
- **A composer that grows.** `textarea` grows by CSS `field-sizing-content` (READ: `docs/src/lib/registry/ui/textarea/textarea.svelte` line 18). Which engines support `field-sizing` was not checked for this memo. The chat memo of 2026-11-01 (§4) measured it in Chromium, WebKit and Firefox, and `005`'s composer grows by `field-sizing: content`. The composer's behaviour, Enter to send and Shift Enter for a new line, is example code (READ: `chat-demo.svelte` lines 319 to 330). Needed: a composer component with a maximum height, send disabled while empty, a Stop button while streaming, and the keyboard contract written down.
- **A streaming skeleton.** `skeleton` gives the shape. The stock `shimmer` utility (`shadcn-svelte/tailwind.css`) moves; it must obey `001`'s motion budgets and reduced motion.
- **Code output.** `code-block` at size `sm`, as the chat demo does. Our version carries the groove and the token palette (6.2).
- **A young dependency.** `message-scroller` is the only stock item on `@shadcn-svelte/primitives`, version 0.0.1, published 2026-10-05 (EXECUTED). The blocks specification should weigh it against a plain scroll container plus its own live region. `005` decision 11 takes its own log, not the package.

## 7. What this memo does not settle

- **Whether `bun --bun shadcn-svelte add` from the official registry writes exactly the built JSON read here.** Answered at `002`'s install: the live JSON equalled the clone's at `6149e14` for 25 of 26 items; `native-select` differed by one type line (`002` Landing notes, note 3).
- **How a CodeMirror 6 editor fits:** bundle size, Svelte 5 wrapping, keyboard escape, theming. Answered by the CodeMirror memo of 2026-10-31.
- **Shiki's CSS-variables theme**, and whether its colours can come from our tokens in both themes and pass contrast. Answered by the Shiki memo of 2026-10-31 (§3 and §4).
- **`field-sizing` support.** Answered by the chat memo of 2026-11-01 (§4): it works in Chromium, WebKit and Firefox. This release's own checks run in Chromium only (decisions.md, "After the public-readiness review").
- **Whether `tailwind-variants`' merge and `cn` agree** on our custom classes. Settled by `002` decision 2: items import `tailwind-variants/lite`, so `cn` is the only engine.
- **The elevation and scrim values.** Set and tested for contrast by `002` decision 7.
- **The icon names.** Each placeholder names a phosphor icon (such as `CaretDownIcon`), which `add` maps to `phosphor-svelte/lib/CaretDown`. Checked by `bun run check`: `svelte-check` fails on a missing export (`002` decision 20).
- **The CLI's handling of an app's existing `tw-animate-css`.** Not needed: no item names it, and overlays animate with our own keyframes (`002` decision 3).

**In one line:** `002` restyles 41 stock primitives plus 3 support items; the lint rejects 29 of the 44 as they stand and misses the translucent rings, input tints, shadows and removed outlines decision 29 names; and the editor, a grooved code block with a token palette, a fuel meter, the consent banner and the chat's stream announcer and composer are ours to build.
