# 023 — Prop doc comments

- **Status:** Ready to build after `020` and `024`: review approved with changes, all applied; the owner answered Q1 to Q5 on 2026-11-15 (see Landing notes).
- **Date:** 2026-11-15
- **Author:** the spec author for `023`, for the design lead
- **Kind:** doc comments and types in existing items' source, one generator in the site's API parser, and new tests. **No interface change:** no prop, default, export, class, slot or behaviour changes. Pass-throughs are re-declared with their source's own type (decision 3). Each props type stays **mutually assignable** with what it was: every value accepted before is accepted after, and nothing more. No token and no dependency is added. Each item whose source changes gets one changelog bullet (decision 12).
- **Lane:** I, existing items (`roadmap.md` §2, "Lanes"). It also edits `src/lib/site/api.server.ts`, and adds tests under `tests/unit/` and one under `tests/e2e/`. No file of lane S, T or N is touched.
- **Depends on:** `020`, the Kuiper rename, landed, and **`024`, budgets per template, landed** (decision 13). This specification is written against `020`'s names: `kuiper-theme`, the `pluto-theme` alias item, `kuiper:field`, `tokens/kuiper.tokens.json`, `scripts/bench/kuiper.ts`. Its counts were measured on the tree before `020`, which renames no prop (`020`, Kind). Roadmap row `023` names only `020`. The design lead adds `024` to that row, or to §3's cross-lane paragraph, at the roadmap's next edit. This specification does not edit the roadmap.
- **Ships with:** 0.13.0, wave 1.
- **Blocks:** `026`'s `app-shell` edit; `022`'s engine-fault small changes in lane I; `028`; `029`'s `alert` edit (`roadmap.md` §3, "Cross-lane landings"). `053` (generated controls) reads the comments.
- **Ranked by:** [`../roadmap.md`](../roadmap.md) §2, 0.13.0, row `023`: "A doc comment on every prop of every item; a unit test that the described list has no empty row; the undefined-`var()` test." The owner ruled it in for 0.13.0: "prop doc comments on every item, so the API tables fill in" (`handoff.md`, "Next").
- **Research it stands on:**
  - [`../research/2026-11-15-prop-docs.md`](../research/2026-11-15-prop-docs.md), cited as *prop docs* §n, with its dated corrections (§8): today's rows by source, how Svelte's tooling shows a comment, the references, the template prototype, the `var()` census, the weight.
  - [`../research/2026-11-15-component-page-standard.md`](../research/2026-11-15-component-page-standard.md) §3, section 6: "API, every row described … generated from doc comments in item source".
  - [`../research/2026-11-15-site-polish-synthesis.md`](../research/2026-11-15-site-polish-synthesis.md) §3 item 3 and [`../research/2026-11-15-prior-art-material.md`](../research/2026-11-15-prior-art-material.md) idea 2: the `var()` test, folded into this specification.
  - [`../research/benchmark-scorecard.md`](../research/benchmark-scorecard.md) row 2.
  - The specification review, whose probes are cited as **EXECUTED (review)**.
- **Measurements made for this specification** are labelled **EXECUTED (023)**. They are read-only scripts in the session scratchpad over the working tree on 2026-11-15, re-run after the review. The builder pins every count again in build step 1, on the tree `020` leaves.

## Intent

A component page's API table lists every prop an item takes. Three of every four rows say nothing about what the prop does. Button's table describes 1 row of 10; Dialog's, 2 of 23 (*prop docs* §1). The scorecard marks Kuiper's pages without "props described", so guidance depth reads 2 (scorecard row 2).

This specification describes every row. Most words live where the code lives: in a doc comment in the item's own source, which the app owns once it installs the item, and which its editor shows on hover. One kind of row is the exception. Three props that every part shares, `class`, `ref` and `children`, are described on the site by one sentence each, written from the item's markup, so the sentence names the element that really renders. Those sentences live in the site's parser, not in the item, and an app's editor shows only those props' types, as it does today (open question 1). A test fails the build on any empty row, in every item, including the ones `026` and `027` add.

A second test closes a silent failure. A misspelled `var(--x)` in an item computes to nothing, and the browser says nothing. The test checks that every `var()` in an item names a variable that something defines.

**Terms of art.**

- An **API row** is one line of an API table, as `apiTables()` returns it (`src/lib/site/api.server.ts`).
- A **doc comment** is a `/** … */` block directly before a declaration, which TypeScript attaches to it.
- An item's **own type** is the props type written in the item's files: the annotation on `$props()`, or a type alias or interface it names in the same item.
- An annotation's **bases** are the types its intersection joins, once the wrappers `api.server.ts` already unwraps (`WithElementRef`, `WithoutChildrenOrChild`, `Omit` and the rest of `WRAPPERS`) are removed. Button's are `HTMLButtonAttributes` and `HTMLAnchorAttributes`.
- A **pass-through** is a prop the item names in its `$props()` destructuring but does not declare in its own type. It comes from `svelte/elements`, from bits-ui, or from another item: 4 of the 109 come from `toggle`'s `ToggleVariants`, in `toggle-group` (EXECUTED (review)).
- The **universal three** are `class`, `ref` and `children`.
- The **closing row** is the table's last line, "and every attribute of `<button>`" or "and the props of bits-ui's `Dialog.Content`". It is not an API row.
- A **target** is the element or component that a universal prop reaches in the item's markup.

## What the research found

- **1,062 API rows; 262 described; 800 empty,** in 262 tables across 70 items (*prop docs* §1, EXECUTED; reproduced by the review).
- **524 of the empty rows are the universal three:** 504 with no declaration of their own, and 20 declared and bare. Under decision 4's rules, the generator fills **495** and leaves **29** for hand comments (*prop docs* §8, EXECUTED (023), re-measured after the review).
- **The rest is writing: 305 rows and 96 type members, 401 comments** (*prop docs* §8, EXECUTED (023)).
- **A comment shows on hover only when it sits on the props type's member.** svelte2tsx keeps a comment written on a destructured binding in its code, but in no type. A member re-declared with an indexed type keeps its accepted values and shows its own comment (*prop docs* §2, EXECUTED; end to end, EXECUTED (review)).
- **The references write one sentence per shared prop.** bits-ui parametrises it by element type, Carbon repeats it per component. Carbon re-declares HTML props with an indexed type to comment them. Primer and bits-ui keep their sentences apart from their types, and can drift (*prop docs* §3, READ).
- **`cn` does not resolve a conflict with the theme's own utilities.** `cn("rounded-action", "rounded-lg")` keeps both (EXECUTED (review)). So no sentence may say an app's class wins.
- **80 `var()` references in 352 item files: 78 resolve to a named source, 2 are one dynamic prefix.** None is undefined today (*prop docs* §8, EXECUTED (023)).
- **Each sentence is sent twice in a page's HTML.** 0.4 to 0.7 kB gzipped for Button, by two simulations (*prop docs* §6 and §8).

## Decisions

### 1. What counts as a prop

Every API row, and every member of an exported object type.

- **API rows**, exactly as `apiTables()` produces them today:
  - every name in a component's `$props()` destructuring but the rest element;
  - every member of the item's own type that the destructuring does not name, which reaches the element through the rest;
  - every export of a `.ts` file of an item: a function, a constant, a class, a type or an interface.
- **Members of exported object types.** In any file of an item, each member of:
  - an exported interface, or an exported type alias whose type is an object literal: `MarketingLink.label`, `SettingsValues.email`, `ChatMessage.role`, `HighlightRange.from`;
  - an object literal inside an exported alias's union or intersection (through parentheses): the result types `SignInResult`, `SignUpResult`, `SignUpCodeResult` and `SettingsResult`, `ChatSegment`'s branches, and `WithElementRef`'s `ref` in `utils`.
  - A member that is also an API row is held by test 1, not counted twice. That is a member of a `…Props` alias whose name is a row of the same item: `ButtonProps.variant`, `LockupProps.tone`.
  - They are the shapes an app passes in or reads back: an app's form action returns `SignInResult`. They are not API rows. The page shows the type as one module row; each member's comment shows in an editor's hover.
- **Not a prop:**
  - the rest element (`...restProps`);
  - a member of an inherited type that the item never names. It stays in the closing row, which names its source. Kuiper does not restate an attribute it does not touch.
  - a type the item does not export.
- *Why:* the table and the hover are what a reader uses. A row is on the table because the item names it, so the item has something to say about it.
- *A bonus of `WithElementRef.ref`:* its comment shows on hover for every `ref` an item types through it, though the table's `ref` rows stay generated (decision 4).

### 2. Where a comment lives: on the type's member

A prop's comment is a doc comment on its member in the item's own type. Never on the binding in `$props()`.

- *Why:* svelte2tsx builds the component's props type from the annotation, and the language server answers a hover from that type. A comment on the binding stays at the binding in svelte2tsx's output, and is in no type (*prop docs* §2, EXECUTED). A consumer's hover over a binding-commented `href` shows no comment (EXECUTED (review)). On the member, one comment serves the API table, the Markdown twin, `llms.txt` and the app's editor.
- An export's comment sits on the export's declaration, as now.
- A type member's comment sits on the member.

### 3. Pass-throughs are re-declared, with the type they already have

Each of the 109 pass-throughs gets a member in the item's own type, typed **exactly `Base["name"]`**: an indexed access to one of the annotation's bases, by the member's own name, with a doc comment.

```ts
export type ButtonProps = WithElementRef<HTMLButtonAttributes> &
  WithElementRef<HTMLAnchorAttributes> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    busy?: boolean;
    /** Renders an `<a>` in place of the `<button>`, with the same look. A disabled link drops its `href`. */
    href?: HTMLAnchorAttributes["href"];
  };
```

(The sentence above shows the form, not the final wording; the builder writes each sentence to decision 5.)

- **What the types prove.** `X & { k?: X["k"] }` is mutually assignable with `X`: every value accepted before is accepted after, and nothing more. The review probed it with `tsc` for Button's two-base `href`, a discriminated union (`ToggleGroup.RootProps["value"]`), a required member (`ToggleGroup.ItemProps["value"]`), `Checkbox`, `Dialog.Content`, `Tooltip.Content` and `RadioGroup` members, and `HTMLInputAttributes["aria-describedby"]` (EXECUTED (review)). The two types are **not identical** to TypeScript's strict identity check. Nothing an app writes can tell them apart.
- **A union's hover text changes.** In `ToggleGroup`'s `multiple` branch, `value` hovers as `string[] | (string[] & string) | undefined`, where it read `string[] | undefined`, and an app's type errors read the same way (EXECUTED (review)). It accepts the same values. The landing notes list every re-declaration over a union: `toggle-group`, `tabs`, `accordion`, `radio-group`, and any other the builder finds.
- **The index names a base the annotation already intersects:** `HTMLAnchorAttributes["href"]`, `DialogPrimitive.ContentProps["onOpenAutoFocus"]`, `HTMLInputAttributes["aria-describedby"]`, `ToggleVariants["size"]`. Never a written-out type such as `string`, which could drift from the source. Test 8 holds every one to this form.
- **The table shows such a member's type as "inherited", as today** (decision 7's `showType()` rule). So a re-declared row looks exactly as it does now, plus its description.
- **The row's place does not move.** Rows follow the destructuring's order, and a pass-through is destructured already.
- *Why:* it is the only place an editor shows the comment (decision 2). Carbon re-declares `href`, `rel` and `target` on its Button the same way (*prop docs* §3, READ). A comment on the binding, read by the parser, would fill the table and leave the hover blank (open question 2).

### 4. The universal three: one sentence each, from the markup

`apiTables()` fills an empty `class`, `ref` or `children` row from the component's template. It finds the row's targets and writes one fixed sentence. These are the only generated descriptions.

**Finding the targets** (on `svelte/compiler`'s modern AST of the component):

- `ref`: each element or component carrying `bind:this={ref}` or `bind:ref={ref}`.
- `class`: each element or component whose `class` attribute is one of:
  - `cn(…, <local>)`, with the destructured local (`class: className`) as the last argument: the **merged** form;
  - exactly `{<local>}`, or `cn(<local>)` alone: the **plain** form.
  - Any other use of the local (first in `cn`, inside a computed props object) is no target.
- `children`: the nearest element or component around each `{@render children(…)}` or `{@render children?.(…)}`, walking out from the render tag. **A `{#snippet}` boundary stops the walk:** if the walk meets a snippet block before any element or component, that render has no target. So `DropdownMenuCheckboxItem`'s `children`, rendered directly inside the `{#snippet children(…)}` it hands to bits-ui, has none.

**Naming a target:**

| Target | Its name |
|---|---|
| An element | `` `<div>` `` |
| A component imported from bits-ui | bits-ui's public name, read from the import as `inheritsText()` does: `DialogPrimitive.Content` is bits-ui's `` `Dialog.Content` `` |
| A Kuiper component (imported from `#lib/registry/…` or a relative path) | its name: the `` `Button` `` |
| A Kuiper part reached through a namespace (`Card.Root`, `Empty.Root`) | the namespace: the `` `Card` `` |
| `<svelte:element>` (17 targets in 12 files: `` `h${level}` ``, `{element}`, ternaries) | **no name**: the row is left for a hand comment |
| A component from any other package (`phosphor-svelte`'s `Spinner` in `spinner`) | **no name**: the row is left for a hand comment |

**Joining targets.** The names of a row's targets are made **distinct**, in source order. One distinct name: that name. Two: joined with "or", `` `<a>` or `<button>` ``. More than two distinct names, no target, or any target with no name: the row is left empty for a hand comment. So `Input`'s two `<input>` branches read `` `<input>` ``, and `Sidebar`'s three `<nav>` targets for `ref` read `` `<nav>` `` (EXECUTED (023)).

**The sentences**, exactly:

| Prop | Target is an element | Target is a component |
|---|---|---|
| `ref` | "The rendered `` `<div>` ``. Bind it with `` `bind:ref` ``." | "The element bits-ui's `` `Dialog.Content` `` renders. Bind it with `` `bind:ref` ``." |
| `class`, merged | "Classes for the `` `<div>` ``, added after Kuiper's by `` `cn` ``." | "Classes for bits-ui's `` `Dialog.Content` ``, added after Kuiper's by `` `cn` ``." |
| `class`, plain | "Classes for the `` `<div>` ``." | "Classes for bits-ui's `` `Dialog.Content` ``." |
| `children` | "The content of the `` `<div>` ``." | "The content of bits-ui's `` `Dialog.Content` ``." |

A Kuiper component target reads "the `Button`" where bits-ui's reads "bits-ui's `Dialog.Content`".

**The counts these rules give** (EXECUTED (023), re-measured after the review): **495 rows filled, 29 left.** The 29 are 17 `<svelte:element>` rows, 9 `class` rows that reach the element through a `child` snippet's props (`Item`, `Marker`, `Lockup`, `BreadcrumbLink`, five sidebar parts), 2 `children` rows behind a snippet boundary (`DropdownMenuCheckboxItem`, `DropdownMenuRadioItem`), and 1 third-party target (`Spinner.class`). Five fills join two names: `Button`'s `ref`, `class` and `children` (`<a>` or `<button>`), `Sidebar.children` (`<nav>` or `<div>`), and the app shell layout's `children` (`<div>` or `<main>`).

**Rules:**

- **An item's own comment wins.** A `class`, `ref` or `children` member with a doc comment keeps it. The generator fills only empty rows.
- **A row the generator leaves gets a hand comment,** on a member of the item's own type (decision 3's form, or a plain member where the item already declares one).
- **The builder reads every generated sentence once,** in the checkpoint (build step 5). Where a sentence is true but unhelpful, the item gets its own comment. Two are expected: `Sidebar.children` (the phone sheet and the desktop rail) and the app shell layout's `children`, which is the page.
- **`child`** (bits-ui's render delegation) is not generated. Its 8 rows are own members and get hand comments.
- *Why generated:* the 495 rows say the same three things, about a different element each time. One sentence, parametrised by the element, is the references' pattern (bits-ui's `refProp({ elType })`, *prop docs* §3), and reading the element from the markup means it cannot drift. Writing 495 comments would put the same three lines in about 240 files an app owns (open question 1).
- **Why no sentence says yours win.** `cn` resolves a conflict only between the Tailwind utilities it knows. The theme's own utilities, such as `rounded-action`, `groove-b`, `focus-ring`, `tracking-mark`, the `type-*` set, `surface-plain`, `glass` and `busy-edge`, are not among them. `cn("rounded-action", "rounded-lg")` and `cn("groove-b", "border-b-0")` keep both, and the stylesheet's order decides (EXECUTED (review); `001` decision 10 found the same for `text-display`). About 34 component files hold one of them (EXECUTED (review)). "Added after Kuiper's" is true of every `cn` call whose last argument is the local. Test 4's V7 bars the stronger claim.
  - *Rejected:* a stronger sentence on items whose classes hold no theme utility. It would rest on a list of which utilities `cn` knows, which moves with `cn`'s version and the theme, so a true sentence could turn false with no test failing. A stronger claim needs `cn` configured with the theme's utilities: a change to `utils`, outside this specification. It is a finding for the roadmap ("Findings for the roadmap").

### 5. Comment style and voice

**Form.**

- One `/** … */` block per member, before it. A one-line comment stays on one line.
- Plain sentences. Inline code in backticks. An element named bare, such as `<time>`, is rendered as code by the table already (READ, `api-table.svelte`, `parts()`).
- No JSDoc tags: no `@default`, `@param`, `@returns`, `@example`, `@see`. `JSDOC()` drops tags, so a tag never reaches the table. A comment made only of tags reads as empty, and test 1 fails it. From `048`, `@deprecated` is the one tag allowed.

**Countable rules,** each held by test 4:

| # | Rule |
|---|---|
| V1 | Not empty, after whitespace is collapsed. |
| V2 | Opens with a capital letter, a digit, a quote or a backtick. |
| V3 | Ends with a full stop, or a full stop then a closing backtick or bracket. |
| V4 | A component row or a type member: 40 words at most. A module export may run longer: a function's comment carries its contract. |
| V5 | Does not open with the prop's own name and a colon ("Busy: …"). |
| V6 | Holds no internal citation (`citationsIn()`, as `api.test.ts` already checks for rows). |
| V7 | Claims no win over Kuiper's classes: no description matches `/\byours?\b[^.]*\b(wins?\|replaces?\|overrides?)\b/i`. |

**Rules review holds** (not countable):

- Say what the prop does, in the present tense, as the reader sees or hears it: "Shows a spinner and ignores clicks, so a form is not sent twice." Not what it is: never "A boolean."
- A data prop opens with a noun phrase: "The control's id." An event prop opens "Called when …", and says when it is not called. A boolean says what turning it on does. A snippet prop says what renders where.
- **Say only what Kuiper adds.** An app's hover joins the source's comment to Kuiper's: a re-declared `Dialog.RootProps["open"]` hovers as bits-ui's sentence, then Kuiper's (EXECUTED (review)). So a pass-through's comment says Kuiper's default, wiring or change, and never restates its source: "Kuiper's default is `"button"`, so a button inside a form does not submit it."
- Do not restate the type, or the default the Default column shows.
- Name the alternative where a reader could pick wrongly: "Use `Field`'s `error` instead when the control is in a field."
- Name a size or a colour by its token or role, never a literal.
- A hand-written `class` comment follows decision 4's wording: it never claims an app's class wins.
- The voice rules of `002`'s R23 hold: active, no filler, no selling.
- British spelling, as the rest of the source: colour, behaviour.
- **Never copy a dependency's comment.** bits-ui's members carry their own (`open`, `onOpenChange`). Kuiper's comment is written fresh, and says what Kuiper does (constitution §6: prior art is studied, never copied).

### 6. Default values: the destructuring is the one source

- **The Default column is read from the destructuring, as today.** `$bindable(x)` reads `x`.
- **A comment does not repeat it,** and no item uses `@default`. Two places for one value would drift.
- **A default the column cannot show** (a member passed through the rest, whose default is bits-ui's or the browser's) is stated in words only when Kuiper relies on it or changes what it means. Otherwise the source's own documentation governs.
- **No default moves.** This specification changes no code, so a default set elsewhere, such as in a `tv()` call's `defaultVariants`, stays where it is. The column shows the destructured value, which equals it (READ, `button.svelte`).

### 7. How the site reads them

- **`apiTables(item)` keeps its shape and output.** A second, test-only form, `apiTables(item, { marks: true })`, adds `generated: boolean` to each row: true when decision 4 wrote its `doc`. The page's call (`componentData()`, `component-data.server.ts`) passes no option, so `generated` never reaches a page's data, its hydration script or its `__data.json`. It would cost about 14 bytes gzipped on Button if it did (EXECUTED (review)).
- **The generator runs inside `componentTable()`,** after the rows are built, on the same `svelte/compiler` parse `scripts()` already makes.
- **`showType()`'s new rule,** in this order:
  1. the `VariantProps<typeof x>["k"]` expansion (today's first step) runs first, unchanged;
  2. then: a member's type that is an indexed access `B["name"]`, where `name` is the member's own name and `B`'s text equals one of the annotation's bases, returns `""` (shown as "inherited");
  3. then today's alias resolution.
  - An indexed access to anything that is not a base keeps its text. `AccordionTrigger.level` is typed `AccordionPrimitive.HeaderProps["level"]`, while the trigger intersects `TriggerProps`, not `HeaderProps`. So it keeps today's Type cell (EXECUTED (review): it reads `AccordionPrimitive.HeaderProps["level"]` today). Test 5 holds it.
- **No file of lane S changes.** `api-table.svelte` hides the description column when a table has no description (`018` decision 7). Once every row is described, the condition always holds and the column always shows. The condition stays, harmless. The existing 3-or-4-column test (`tests/e2e/site.spec.ts`) still holds.
- **Members of exported types are not shown on the page** in this specification. Their comments show in editors. A nested table is a page change, for `032` (open question 4).

### 8. The described list is every item

- **The tests read every item in `registry.json`.** There is no list to join. An item `026` or `027` adds is held the day it lands.
- **Per item, twice:** test 1 is "`<item>` has 0 empty API rows" and test 3 is "`<item>` has 0 bare type members". `026` test 39 covers `Toaster`'s and `Toast`'s props and every member of `ToastOptions`. It cites both titles: "toast has 0 empty API rows" and "toast has 0 bare type members". The design lead passes this to `026`'s author.
- **The items with no table are pinned:** `kuiper-theme`, `pluto-theme`, `font-geist`, `font-heading-ibm-plex-sans`, `font-jetbrains-mono` and `product-home`. An item that loses its tables by a parsing change fails, instead of passing with 0 rows. **A specification that adds an item with no table adds it to this set.**
- *Why no list:* the page standard proposed a list that "grows to all 70" ([*page standard*](../research/2026-11-15-component-page-standard.md) §3, section 6). This specification takes it to all at once, so a list would only let a later item opt out.

### 9. The 262 comments already written

- They stay, with three changes for the countable rules: `useHighlightedCode`'s gains its full stop (V3); `button`'s "Busy: …" and `code-editor`'s "Disabled: …" lose their name and colon (V5) (*prop docs* §1, EXECUTED).
- Review reads them against decision 5's other rules, as it reads the new ones. A reworded comment is listed in the landing notes.

### 10. The `var()` test

Every `var(--x)` in an item file names a variable that something the app will have defines.

**Read:** every file `itemFiles()` lists (`scripts/lint-literals.ts`; 352 files before `020`, 353 after it adds `theme/stored.ts`). Two forms, matched over the whole text, comments included:

- `var(--x` anywhere;
- Tailwind's shorthand in a class, plain or typed: `` -\((?:[a-z-]+:)?(--[\w-]+)\) ``. This reads `max-h-(--container-3xs)`, and also `border-b-(length:--focus-width)` (8 uses) and `text-(length:--mark-lockup-size)` (1) (EXECUTED (review)).

The fallback of `var(--x, …)` does not excuse `--x`: a fallback hides a misspelling. **The census is 80 references** (EXECUTED (023)).

**Defined, in this order:**

1. **The same file** declares it: `--x:` in a style, a `[--x:…]` class, `style:--x=`, or `setProperty("--x", …)`. No item reference resolves this way today (EXECUTED (review)). The rule exists for the next item, and a fixture proves it (test 6).
2. **The theme item** declares it, in `registry.json`: its `cssVars.light`, `cssVars.dark`, `cssVars.theme`, or a `--x:` key anywhere in its `css`. These fields are written by `build:tokens` (READ, `scripts/build-tokens.ts`), so the test needs no build.
3. **A font item** names it as `font.variable` (`--font-mono`, `font-jetbrains-mono`).
4. **Tailwind's default theme** declares it (`node_modules/tailwindcss/theme.css`, pinned by `bun.lock`).
5. **bits-ui sets it at run time.** The test collects bits-ui's names from its pinned `node_modules/bits-ui/dist`, in two ways:
   - every literal `--bits-[a-z0-9-]+` token in its files;
   - each template in `getFloatingContentCSSVars(name)` (`` `--bits-${name}-content-transform-origin` `` and its four siblings), expanded over the literal arguments of every `getFloatingContentCSSVars("…")` call in the dist: `tooltip`, `menubar`, `dropdown-menu`, `context-menu`, `popover`, `menu` and `link-preview` (EXECUTED (review)).
   - A reference passes only when it **equals** one of these names, whole. So `--bits-popovr-content-transform-origin` fails, and so does `--bits-dropdown-menu-content-transform-origi`.
6. **A declared dynamic prefix.** The test holds one table: `lib/highlight/shiki.ts`, prefix `--code-`, expanded over `CODE_ROLES` (`lib/highlight/roles.ts`). Each expanded name must be defined by 2 to 4. Any other `var(--x` that ends at a quote, a `+`, a `$` or a `<` fails, naming the file and line.

**The emitted-on-use caveat, for rules 2 and 4.** Tailwind writes a `@theme` or `@theme inline` variable into the CSS only when a scanned source uses it. `002` found an inlined name undefined at run time; `004`'s review found one read by `var()` in a scanned file defined (*prop docs* §5, READ). `composer.svelte` relies on the second for `--container-3xs`. Item files sit in an app's `src/lib`, which Tailwind scans. So rules 2 and 4 count such names as defined. The items read four `cssVars.theme` names, all from `code-editor-theme.ts`, a `.ts` file: `--radius`, `--spacing`, `--text-sm` and `--text-sm--line-height`. They read Tailwind defaults from `.svelte` files (EXECUTED (review)).

**The probe,** in build step 1 (not in the suite):

- Two scratch sources: a `.ts` file whose text holds `var(--text-sm--line-height)`, and a `.svelte` file whose class holds `max-h-(--container-3xs)`.
- Tailwind's own scanner finds their candidates: `@tailwindcss/oxide`'s `Scanner`, both locked by `bun.lock`.
- Then `compile()` from `tailwindcss`, over a stylesheet that imports `tailwindcss` and the theme's `@theme inline` block, builds those candidates: `compile(css).build(candidates)`. `compile()` alone reads no files, so the scanner step is required.
- **Pass:** the output declares both `--text-sm--line-height` and `--container-3xs`.
- **Fail:** rules 2 and 4 then drop those names. Test 6 names every reference that then fails. Each is a real fault in an installed app, so `023` stops at the checkpoint until the design lead rules.
- The landing notes record the probe's output lines.

**Reported:** each failure as `file:line --x`, so a reader can fix it without the test's source.

**Not in scope:** a Tailwind utility whose name matches no utility (`bg-primry`). Tailwind drops it silently too. That is `050`'s lint, which reads classes with Svelte's parser.

### 11. Post-rename names

Every name here is `020`'s: `kuiper-theme`, `kuiper:field`, `FIELD_CONTEXT_KEY` reading `kuiper:field`, the alias item `pluto-theme` with no files. `020` adds `src/lib/registry/ui/theme/stored.ts` and its export `readStoredTheme` (`020` decision 5). If `020` lands it without a comment, this specification writes one. The builder takes every count from the tree `020` leaves (build step 1).

### 12. No interface change, and the changelog

- **No interface change.** Comments, and re-declared members with their sources' own types, change no prop, default, export, class or behaviour. Every props type is mutually assignable with its old self (decision 3). The built JS and CSS of every item are unchanged: comments and types do not reach the build (criterion 9).
- **The 0.13.0 entry gains one bullet per item whose source changes,** in the form `015` used for reworded comments: "`` `button` ``: doc comments on every prop; no interface change." About 65 items, with `utils` among them (`WithElementRef.ref`). Each bullet sets its page's "Updated" fact (READ, `changelog.ts`, `updatedIn()`). An item filled only by generated sentences changes no file of its own. Its `static/r/` JSON is unchanged, and it gets no bullet.
- **One release-level sentence** says that every component page's API table now describes every prop, and that `class`, `ref` and `children` are described on the site, not in the source.
- **No section in the upgrade guide.** It holds interface changes (`020` decision 12).
- **`static/r/` is regenerated** at landing, as a ledger file (`roadmap.md` §2).

### 13. Its weight, and why it lands after `024`

- **Each sentence is sent twice in a page's first HTML:** the cell and the inline hydration data. A client-side navigation fetches it once more in `__data.json` (*prop docs* §6, EXECUTED).
- **The cost, per page, gzipped at level 9** (`024`'s rule: a change that adds weight to every page of a template states it):
  - Button, **0.4 to 0.7 kB**: +429 bytes with the memo's nine drafted sentences, +656 bytes with the review's longer ones (EXECUTED; EXECUTED (review));
  - Dialog, about 1 to 1.5 kB (INFERRED, by rows);
  - `sidebar`, the most, about 4 to 6 kB (INFERRED, 78 empty rows).
- **Button has 0 kB of headroom** under 380 kB today. `024` gives the component templates their own budgets; Button's transfer budget rises to between 430 and 480 kB at `024`'s checkpoint (READ, `024`). So `023` lands after `024`, and Button's 0.7 kB fits.
- **`sidebar` is checked against its template's margin.** `024` derives a template's budget from its heaviest page plus a stated margin. At `023`'s checkpoint, the builder compares `sidebar`'s measured rise with the margin of the template `024` puts it in. A rise past it is a ruling for the design lead, recorded in the landing notes.
- The builder measures Button, Dialog and `sidebar` before and after with the perf suite's profile, and records the three deltas.

### 14. Lane I, and what waits for it

`023` is the first lane-I build after `020`. It touches nearly every item's source, so lane-I work queues behind it:

| Waits for `023` | Why |
|---|---|
| `026`'s `app-shell` edit (`+layout.svelte`, its registry entry) | `023` writes the layout's `data` and `children` comments in the same file (`026` decision 24) |
| `022`'s engine-fault small changes in item source | Lane I, queued (`022` decision 16) |
| `028`, forced colours | Lane I (`roadmap.md` §2) |
| `029`'s `alert` edit | Lane I (`roadmap.md` §3) |

**Cross-lane effects of `023` itself:**

- **New items (`026`'s `toast`, `027`'s six)** are born described. Whichever lands first, tests 1 and 3 hold the others: an item landing after `023` meets them on landing; one landing before `023` is checked at `023`'s landing, and `023` does not write its comments.
- **`022`'s mutation patches.** If `022` lands first, its `tests/unit/mutations.test.ts` runs `git apply --check` on each patch against the tree. A doc comment beside a patched line breaks the patch's context (`022` decision 15: "A patch broken by `023`'s doc comments … fails `bun run test:unit`"). `023`'s builder re-cuts each broken patch: the same change, new context lines. Each is listed in the landing notes. It is a lane-E edit made by `023` because `023` broke it.
- **`025`'s cost report, if `025` lands first.** This is a full cost run, not a hash refresh:
  - **Why everything is stale.** `025`'s size hash covers the served JSON of an item and of every item in its `registryDependencies` closure. About 65 items' JSON changes, so nearly every item is stale. And `utils` changes (`WithElementRef.ref`), which forces a full run (`025` decision 13).
  - **Runtime is re-measured too.** The runtime hash is the size hash plus more, so every stale item's hydration and response time are measured again.
  - **The run:** `bun run cost --full`, about **20 to 25 minutes** (`025`'s research, *cost* §6), on the machine `025`'s release check names (its Q3).
  - **What must hold.** Only **size figures** must equal the previous report's to the byte. No comment or type reaches the build, so that is criterion 9's proof from the other side. A changed size stops the landing.
  - **Runtime figures fall under `025`'s own rules:** its noise flag, its re-measure and its budget gate. A runtime figure that is still over budget after `025`'s re-measure is a finding for the design lead at the checkpoint. Since criterion 9 shows no executable byte moved, the expected ruling is noise. The ruling and the figures go in the landing notes.
  - Open question 5 offers the alternative: `025` hashes each file with its comments and types stripped.
- **`021`** rewrites the token file, not `registry.json`'s item fields beyond its own, and keeps the built CSS byte-identical (`roadmap.md` row `021`). Test 6 reads `registry.json`, so either order works.

## Design

### Files

| File | Change |
|---|---|
| `src/lib/registry/**` and `src/lib/utils.ts` (about 65 items) | Doc comments on own members and type members; re-declared pass-throughs (decision 3); three rewordings (decision 9) |
| `src/lib/site/api.server.ts` | The generator (decision 4); the `{ marks: true }` option; `showType()`'s rule (decision 7) |
| `tests/unit/api-described.test.ts` | New: tests 1 to 4 and 8 |
| `tests/unit/api.test.ts` | Gains test 5's cases |
| `tests/unit/css-vars.test.ts` | New: test 6 |
| `tests/helpers/css-vars.ts` | New: the pure checker test 6 calls, `undefinedVars(files, sources)` |
| `tests/fixtures/023-pass-throughs.json` | New: the 109 pass-throughs, written in build step 1 from the base tree (test 8) |
| `tests/unit/fixtures/api/` | New: small `.svelte` files for test 5 (not items) |
| `tests/unit/fixtures/css-vars/` | New: small files for test 6 (not items) |
| `tests/e2e/api-tables.spec.ts` | New: test 7 |
| `CHANGELOG.md`, `static/r/` | Ledger: decision 12 |
| `tests/sr/mutations/*.patch`, `scripts/cost/report.json` | Only if `022` or `025` landed first (decision 14) |

### The count to write

Measured before `020`, re-measured after the review (EXECUTED (023); *prop docs* §1 and §8):

| | Rows or members |
|---|---|
| API rows | 1,062 |
| Already described | 262 |
| Empty | 800 |
| Filled by the generator | 495 |
| **Hand comments on API rows** | **305**: 143 own members, 109 pass-throughs, 29 universal rows the generator leaves, 24 module exports |
| **Hand comments on exported type members** | **96**: 74 in interfaces and object-literal aliases, 22 inside exported unions and intersections (21 in the five result and segment types, and `WithElementRef.ref`) |
| **All hand comments** | **401** |
| Rewordings of existing comments | 3 |

The heaviest items: `highlighter` (28 type members, most of them internal shapes), then `sidebar`, `sign-up`, `dropdown-menu`, `settings` and `field` (EXECUTED (023)); the builder pins each item's count in build step 1. Writing is about 13 to 14 hours at two minutes a comment (INFERRED).

## Scope

**In:**

- A doc comment on every API row and every exported type member, by hand or by decision 4.
- The generator, the `{ marks: true }` option, and the `showType()` rule.
- Tests 1 to 8.
- The changelog bullets and `static/r/`.
- The cross-lane repairs of decision 14, if needed.

**Out:**

- Anatomy, keyboard data, content rules and the rest of the page standard: `032`, `033`, `043`–`047`.
- A nested table for exported types' members: `032` (open question 4).
- A component-level `<!-- @component -->` comment, which Svelte's tooling shows on hover over a component's name (*prop docs* §2, READ). A later small specification, from each item's registry description.
- Controls generated from prop types: `053`.
- Unknown Tailwind utilities: `050`.
- Configuring `cn` with the theme's utilities (decision 4).
- Any change to a prop, a default or behaviour. A fault found while writing (a prop that does nothing, a default that contradicts its sentence) is recorded in the landing notes. It becomes a small change in lane I, after this one.
- `scripts/bench/depth.ts`. It counts the closing row as an empty cell (READ, `depth.ts`, `tr.children[di]`). That is the instrument's to change, by its own run-log note. The score holds because one full table suffices ("Predicted scorecard movement").

## Tests, written first

Each is written before the code it checks and seen failing. Where a test passes on today's tree, it is proven by mutation: the code or a fixture is broken on purpose and the test is seen to fail. The landing notes record each first failure.

1. **`api-described.test.ts`, "`<item>` has 0 empty API rows"**, one test per item in `registry.json` with at least one table. Asserts that every row's `doc`, collapsed, is not empty. Its failure lists each empty row as `Part.name`. *Seen failing:* 68 of the 70 items with tables fail today (EXECUTED (023): only `utils` and `use-highlighted-code` are fully described).
2. **`api-described.test.ts`, "the items with no table are exactly the theme, its alias, the fonts and product-home".** The set of items whose `apiTables()` is empty equals decision 8's six. *Proven by mutation:* with a fixture registry entry whose component's `$props()` is renamed, the set gains it and the test fails.
3. **`api-described.test.ts`, "`<item>` has 0 bare type members"**, one test per item with at least one exported type. Reads every `.ts` file and every `.svelte` module script of the item. Counts decision 1's members: those of exported interfaces and object-literal aliases, and those of object literals inside an exported alias's unions and intersections, but not a member held by test 1. Lists each bare member as `Type.member`. *Seen failing:* 96 members in 17 items (EXECUTED (023)), among them `sign-in`'s `SignInResult` and `utils`' `WithElementRef.ref`.
4. **`api-described.test.ts`, "every description keeps the countable rules"**, one assertion per rule V1 to V7, over every API row (hand and generated) and every exported type member. Each failure names the row and the rule. *Seen failing:* V3 by 1 (`useHighlightedCode`), V5 by 2 (`Button.busy`, `CodeEditor.disabled`) (EXECUTED (023)). *Proven by mutation:* fixture comments in lower case (V2), of 41 words (V4), citing "decision 7" (V6), and reading the draft's "Classes for the `<div>`, merged with Kuiper's by `cn`. Yours win a conflict." (V7) each fail their rule.
5. **`api.test.ts`, "023: the universal three are written from the markup",** on real items and on fixtures in `tests/unit/fixtures/api/`, read with `apiTables(item, { marks: true })`:
   - `card`, part `Card`: `ref` is "The rendered `<div>`. Bind it with `bind:ref`."; `class` is "Classes for the `<div>`, added after Kuiper's by `cn`."; `children` is "The content of the `<div>`."; each with `generated: true`.
   - `button`, part `Button`: `ref` is "The rendered `<a>` or `<button>`. Bind it with `bind:ref`."
   - `dialog`, part `DialogContent`: `class` is "Classes for bits-ui's `Dialog.Content`, added after Kuiper's by `cn`."
   - `input`, part `Input`: `ref` names `<input>` once, not "`<input>` or `<input>`".
   - `apiTables(item)` without the option: no row has a `generated` key.
   - **The fact behind the wording:** `cn("rounded-action", "rounded-lg")` returns `"rounded-action rounded-lg"`. If `utils` ever teaches `cn` the theme's utilities, this case fails, and the sentence can be revisited.
   - **`showType()`:** `accordion`, part `AccordionTrigger`: `level`'s type is still `AccordionPrimitive.HeaderProps["level"]`. `button`, part `Button`: `variant`'s type is still the variant keys. Once re-declared, `href`'s type is `""` and its `doc` is not empty.
   - Fixtures:
     - `own-comment.svelte`: a `children` member with its own comment keeps it, with `generated: false`.
     - `child-snippet.svelte`: `class` spread through a `child` snippet's props has `doc: ""`.
     - `class-first.svelte`: `cn(className, "p-4")` gives no sentence; its `class` row is empty.
     - `class-alone.svelte`: `cn(className)` gives the plain sentence.
     - `three-targets.svelte`: `ref` bound on `<nav>`, `<div>` and `<aside>` branches has `doc: ""`.
     - `dynamic-element.svelte`: `<svelte:element this={tag} bind:this={ref}>` has `doc: ""`.
     - `third-party.svelte`: `class` on a `phosphor-svelte` icon has `doc: ""`.
     - `namespaced.svelte`: `<Card.Root class={cn("p-4", className)}>`, with `Card` a namespace import from a Kuiper path, reads "Classes for the `Card`, added after Kuiper's by `cn`."
     - `snippet-boundary.svelte`: `{@render children?.()}` directly inside a `{#snippet children()}` passed to a component has `doc: ""`.
   - *Seen failing:* the generator does not exist, so every expected sentence is `""`. The `showType()` and `cn` cases are proven by mutation: the rule applied to any indexed access blanks `level`, and the test fails.
6. **`css-vars.test.ts`, "every `var()` in an item file names a defined variable".**
   - Over `itemFiles()`: `undefinedVars()` returns `[]`. *Seen failing:* the shiki prefix (two references) until decision 10's prefix table is written.
   - It reads at least 80 references (EXECUTED (023)). **Each of sources 2 to 6 defines at least one of them**, so a source that silently stops being read fails. Source 1 is proven by the `local.svelte` fixture, since no item uses it today.
   - Fixtures in `tests/unit/fixtures/css-vars/`:
     - `misspelled.svelte`, with `rounded-[var(--radius-actoin,var(--radius))]`, is reported as `misspelled.svelte:<line> --radius-actoin`;
     - `typed.svelte`, with `border-b-(length:--focus-widht)`, is reported as `--focus-widht`;
     - `local.svelte`, which sets `[--gap:1rem]` and reads `var(--gap)`, passes;
     - `bits.svelte`: reading `--bits-popover-content-transform-origin` passes; `--bits-popover-content-wobble` fails; `--bits-popovr-content-transform-origin` fails; `--bits-dropdown-menu-content-transform-origi` fails;
     - `dynamic.ts`, with `"var(--nope-" + x + ")"`, fails as an undeclared prefix.
7. **`tests/e2e/api-tables.spec.ts`, "Button and Dialog: every API table is described".** On `/components/button/` and `/components/dialog/` at 1440 × 900, in the light project: every API table has a "What it does" column. Every body row's cell in it is non-empty, except the closing row. *Seen failing:* Button's and Dialog's tables today. These are the two pages the scorecard reads (row 2).
8. **`api-described.test.ts`, "every re-declared pass-through is exactly `Base[\"name\"]`".** Reads `tests/fixtures/023-pass-throughs.json`: the 109 pass-throughs, each with its item, file, part, name and base, written in build step 1 from the base tree. For each:
   - the item's own type now declares the member;
   - its type node is a `ts.IndexedAccessTypeNode`;
   - its object's text equals the listed base, and that base is one of the annotation's bases;
   - its index is the string literal of the member's own name.
   - Beyond the list, the same holds for **any** member of any item's own type whose type is an indexed access by its own name to one of the annotation's bases, so a later re-declaration is held too.
   - *Seen failing:* the 109 are not declared yet. *Proven by mutation:* `href?: string` in place of `HTMLAnchorAttributes["href"]` fails, naming `button Button.href`.
   - It is the evidence for criterion 8. Review keeps the sentence, not the type.

## Acceptance criteria

1. **Described.** Test 1 passes for every item with a table: 0 empty rows. (unit)
2. **No silent loss.** Test 2 passes, and its mutation is seen failing. (unit)
3. **Type members.** Test 3 passes for every item: 0 bare members. (unit)
4. **Voice, counted.** Test 4 passes, each rule's first failure or mutation recorded. (unit)
5. **The generator.** Test 5 passes. The landing notes give the count of generated rows (495 expected, ±5 after `020`) and of rows left (29 expected). They list every two-name sentence, and what the checkpoint ruled for it. (unit, review)
6. **`var()`.** Test 6 passes. The probe's result is in the landing notes. (unit, run)
7. **The pages.** Test 7 passes. (e2e)
8. **Types mutually assignable.** Test 8 passes, and `bun run check` reports 0 errors. The landing notes count the re-declarations (109 expected) and list those over a union (decision 3). (unit, check)
9. **Nothing executable moved** (a landing check, not in the suite). For every changed item file:
   - the template, outside the scripts, is byte-identical to the base;
   - each script, through `ts.transpileModule` with `removeComments: true` and `verbatimModuleSyntax: true`, is identical to the base's. The second setting keeps imports used only by the template on both sides.
   - A script block added only to hold types transpiles to nothing, and counts as identical.
   - The builder runs it as a scratch script and records the file count and 0 differences. The review prototyped it on Button (EXECUTED (review)). (run)
10. **The changelog.** The 0.13.0 entry holds one "doc comments on every prop; no interface change" bullet for exactly the items whose source changed, and decision 12's release sentence. A landing check: the bullet set equals the items whose files `git diff --name-only` lists under `src/lib/registry/` and `src/lib/utils.ts`. (run)
11. **Shipped comments cite nothing.** `registry-comments.test.ts`'s citation check over `static/r/` passes on the rebuilt files. (unit)
12. **Weight.** The perf suite passes under `024`'s budgets. The landing notes give the measured deltas for Button, Dialog and `sidebar`, and `sidebar`'s against its template's margin. (e2e, perf)
13. **Cross-lane.** If `022` landed first: `mutations.test.ts` passes on the re-cut patches, which the landing notes list. If `025` landed first: `bun run cost --full` ran; `cost.test.ts` passes; every size figure equals the previous report's to the byte; the runtime figures and any ruling on them are in the landing notes. (unit, run)
14. **The suites.** `bun run test:unit`, `bun run test:e2e` and `bun run test:smoke` pass; `bun run lint` is clean; the literal lint reports 0 violations. No expectation outside this specification's tests changes. Every Type cell outside the 109 re-declared rows is as it was (a landing check: `apiTables()` before and after, types compared row by row). (all, run)
15. **Reviewed.** The change review reads every hand comment against decision 5's review rules, and every generated sentence once. Its findings are fixed or answered in writing. (review)
16. **Scored.** The scorecard is re-run (§8 of it): `depth.ts` and `kuiper.ts`. The change review cites row 2's movement and the run-log row. (review)

## Build order

1. **Confirm the tree.** `020` and `024` landed; whether `022`, `025`, `026` or `027` landed. Re-pin every count of "The count to write" on this tree. Write `tests/fixtures/023-pass-throughs.json` from it. Run decision 10's probe.
2. **Tests 1 to 8, seen failing.** Record each first failure.
3. **The generator, the option and `showType()`'s rule,** to test 5. Re-run test 1: about 495 rows fill.
4. **The pilot comments:** `button`, `dialog`, `field`, `dropdown-menu`, `error-summary` (the page standard's pilot), by hand, to decision 5.
5. **Checkpoint.** The design lead reads the five items' tables in the browser, and the list of generated sentences with two names, before the builder goes on. Rulings on voice go in the landing notes and bind the rest.
6. **The remaining items,** group by group, tests 1, 3 and 8 per item going green.
7. **The `var()` test** to green: the prefix table and the sources.
8. **Criteria 9, 12 and 14's landing checks.** The cross-lane repairs of decision 14, if needed.
9. **The changelog bullets and sentence; `build:registry`;** criteria 10, 11 and 14.
10. **The change review;** then the scorecard, criterion 16.

## Predicted scorecard movement

- **Row 2, guidance depth: 2 → 3.** `depth.ts` marks "props described" when any props table's description column is at least 80% full (scorecard §2). Button's table: 10 rows, all described, plus the closing row, which `depth.ts` counts as empty: 10 of 11, 91%. Dialog has ten tables; `DialogContent` clears 80%. Each page goes from 5 to 6 elements of 10. The mean, 6, reads 3 ("3 under 8"). Kuiper then ties Carbon, Material 3, Spectrum 2 and Primer on the row (INFERRED from the rubric; measured at landing).
- **The twins' line:** "25% of 1,062 prop rows described" becomes 100% of about 1,063.
- **Page-standard coverage:** section 6 passes on every page, about 30% to about 40% (*page standard* §4, "Guidance depth on the scorecard").
- **Rows 1 to 14 total:** +1 on row 2. From 31 after `020`'s predicted move on row 11, to 32.
- **No other row moves.** The `var()` test is a guard, not a published mark. Row 9's (e), controls from props, waits for `053`, which these comments feed.

## Findings for the roadmap

- **`cn` does not know the theme's utilities** (decision 4). An app's `rounded-lg` on a part that holds `rounded-action` gets whichever rule the stylesheet sorts later, not its own (EXECUTED (review)). Teaching `cn` the theme's utilities is a change to `utils` every app receives. The re-rank after landing should place it.
- **Roadmap row `023` should name `024`** as a dependency (front matter).

## Risks

- **A re-declaration that does not distribute.** A pass-through over a conditional or generic bits-ui type may not behave as decision 3 expects. Test 8 holds the form, and `bun run check` and every example's compile catch an error. A type that silently widened would not be caught by either. The review's probes found none (EXECUTED (review)). The fallback for one that fails is open question 2's option 2, for that row only, recorded in the landing notes.
- **Union hover text changes.** `ToggleGroup`'s `value` reads `string[] | (string[] & string) | undefined` in an app's hover and its errors (decision 3). It accepts the same values. The changelog bullet for each such item says so in one clause.
- **Generated sentences that are true and useless.** Two are known (decision 4). The checkpoint reads all two-name sentences; review reads all of them once.
- **Writing at volume drifts in voice.** 401 comments by one builder in one pass. The pilot and its checkpoint set the voice first; test 4 holds what can be counted.
- **Ledger and lane contention.** `023` touches about 65 items, and four lane-I edits wait for it. It is mostly writing, so it should not be the slow lane of wave 1 (INFERRED: about 14 hours of writing, and about a day for the tests and the generator).
- **Weight.** If `024` is late, `023` waits. `sidebar`'s 4 to 6 kB is checked against its template's margin (decision 13).
- **The probe fails.** Then up to 8 references fail test 6 (*prop docs* §5). Each is a real fault in an installed app, and each becomes a small change. `023` stops at the checkpoint until the design lead rules.
- **A cost run on a noisy machine,** if `025` lands first. Runtime figures may cross a budget on noise. `025`'s re-measure handles most; the rest is a ruling (decision 14).

## Open questions for the owner

Recommended option first.

**Q1. How are `class`, `ref` and `children` described?** They are 524 of the 800 empty rows; the generator fills 495.
1. **One sentence each, written by the site from the item's markup** (decision 4). It names the element that renders, so it cannot drift. It never claims an app's class wins, since `cn` keeps the theme's utilities beside an app's. An app's editor shows the type only, as it does today. An item's own comment wins. The 29 rows it cannot name get hand comments.
2. A doc comment in every item: about 495 more comments (about 17 more hours), re-declaring `class`, `ref` and `children` in about 240 parts. Editors show them. The same three sentences sit in every file an app owns.
3. Leave them out of the table, and name them in the closing row ("and `class`, `ref` and `children`, as every part"). Fewer rows; the reader loses which element each reaches. The scorecard's 80% would still be met.

**Q2. Where does a pass-through's comment go?** 109 rows (`href` on Button, `sideOffset` on the popovers, `id` and `aria-describedby` on the field controls).
1. **On a re-declared member, typed exactly `Base["name"]`** (decision 3). Editors and the table both show it. The props types stay mutually assignable; a union member's hover text gets longer.
2. On the binding in `$props()`, read by the parser. The table shows it; editors do not. No type changes.
3. Only where Kuiper changes the default; other pass-throughs leave the table and join the closing row.

**Q3. Do members of exported types get comments in `023`?** 96 members, such as `SettingsValues.email`, `ChatMessage.role` and `SignInResult.errors`.
1. **Yes, all 96** (decision 1), including the result types an app's form action returns. `026` already holds `ToastOptions` to it. `utils` changes, for `WithElementRef.ref`.
2. Only the shapes a prop takes or an app returns (about 60: the blocks' and compositions' data and result types; INFERRED, the 96 less `highlighter`'s 28 and a few other internal helpers); internal helpers' types wait.
3. None; they wait for `032`.

**Q4. Should the page show those members?**
1. **Not yet: `032`, with the page standard's platform,** which already reworks the API section. `023` stays out of lane S.
2. Now, as a nested table under each type's row. `023` then edits `api-table.svelte` (lane S) and adds weight to the pages that export types.

**Q5. If `025` lands first, how is its report refreshed?** Only if `025` lands before `023`.
1. **A full cost run at `023`'s landing,** about 20 to 25 minutes. Sizes must be byte-equal. Runtime falls under `025`'s rules, and any figure over budget is ruled at the checkpoint (decision 14).
2. `025` hashes each source file with comments and types stripped, as criterion 9's transform does. A comment-only change then leaves every hash as it was, and no run is needed. That is a change to `025`, recorded there; it also spares every later comment-only change a run.

## Review

The specification review, [`../reviews/023-prop-doc-comments-spec-2026-11-15.md`](../reviews/023-prop-doc-comments-spec-2026-11-15.md): approve with changes, 14 findings. Each is applied.

1. **Accepted (High).** "Yours win a conflict" is gone. The `cn` sentence reads "added after Kuiper's by `cn`" (decision 4). Decision 4 gives the reason and rejects the per-item claim. V7 bars the claim, and test 4 is seen failing on the draft's wording. Test 5 pins `cn("rounded-action", "rounded-lg")`. The `cn` gap is a roadmap finding.
2. **Accepted (Medium).** Decision 4 now merges distinct names. It counts more than two distinct names as unfilled, and leaves `<svelte:element>` and third-party targets for hand comments. It names a namespaced Kuiper part by its namespace and stops the `children` walk at a snippet boundary. It reads `cn(<local>)` alone as the plain form. Re-measured: 495 filled, 29 left (EXECUTED (023)). Test 5 has a fixture for each rule; criterion 5 expects 495.
3. **Accepted (Medium).** Decision 10 reads the typed shorthand. The census is 80. Test 6 adds `typed.svelte` and a floor of 80.
4. **Accepted (Medium).** bits-ui's names come from its literal tokens, and from `getFloatingContentCSSVars` templates expanded over the call arguments in its dist. They are matched whole. Test 6 adds both typos.
5. **Accepted (Medium).** `showType()`'s rule applies only to the annotation's bases, after the `VariantProps` expansion (decision 7). Test 5 holds `AccordionTrigger.level` and Button's `variant`. Criterion 14 adds a row-by-row Type check.
6. **Accepted (Medium).** Test 8 checks every re-declaration's form, against a fixture of the 109 and for any later one. Kind, decision 3 and criterion 8 say "mutually assignable", not "equal". The union hover change is in decision 3 and Risks, and the landing notes list the union re-declarations.
7. **Accepted (Medium).** Decision 1 and test 3 include object literals inside exported unions and intersections, and not members held by test 1. The count is now 96, `utils` included. Q3 is updated.
8. **Accepted (Medium).** Decision 14 states the full run: the closure, `utils`, about 20 to 25 minutes, runtime re-measured under `025`'s rules, and only sizes byte-equal. Q5 offers the stripped-hash alternative.
9. **Accepted (Low).** Test 6's per-source floor covers sources 2 to 6; source 1 is proven by its fixture.
10. **Accepted (Low).** The probe reads `--text-sm--line-height` from a `.ts` file and `--container-3xs` from a `.svelte` file. It runs through `@tailwindcss/oxide`'s scanner, then `compile().build(candidates)`. Its result applies to rules 2 and 4.
11. **Accepted (Low).** The Intent says the generated rows live in the parser, and editors show only their types. Decision 5 notes that an app's hover joins bits-ui's comment to Kuiper's, so Kuiper's never restates it.
12. **Accepted (Low).** `generated` is test-only (`{ marks: true }`) and never ships (decision 7). Button's cost reads 0.4 to 0.7 kB at gzip level 9. `sidebar` is checked against its template's margin (decision 13).
13. **Accepted (Low).** `024` is in Depends on, and the roadmap edit is passed to the design lead. Test 3 is per item, and `026` cites both titles (decision 8).
14. **Accepted (Low).** The pass-through term includes another item. Criterion 9 names `verbatimModuleSyntax` and the type-only block rule. Decision 8 says how a new item with no table joins the set. The hand total is 401. The memo's svelte2tsx wording is corrected by a dated correction (*prop docs* §8).

## Landing notes

**The owner's answers (the owner, 2026-11-15).** The owner wrote: "Accept all of this if it is good design with precedent from the best." The design lead checked each answer against the memo's prior art before recording it:

- **Q1, option 1:** `class`, `ref` and `children` sentences are generated from the item's markup. Precedent: bits-ui's parametrised helpers, `refProp({ elType })` (memo §3), and Carbon's one sentence per component. Kuiper goes one step further and takes the element's name from the markup itself. No reference does this. It is the only form that cannot drift, and drift is the fault the memo found in Primer's and bits-ui's hand-kept copies.
- **Q2, option 1:** pass-throughs are re-declared typed exactly `Base["name"]`. Precedent: Carbon's `Button.tsx:52–55`.
- **Q3, option 1:** all 96 exported type members get comments. Precedent: Carbon comments each props-interface member, and Spectrum generates its options tables from type data.
- **Q4, option 1:** type members are not shown on the page until `032`. This is a sequencing choice, not a design one.
- **Q5, option 1:** if `025` lands first, `023` does one full cost run at its landing.

Not yet landed.
