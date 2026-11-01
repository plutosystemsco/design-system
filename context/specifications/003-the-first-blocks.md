# 003 — The first blocks

- **Status:** built, reviewed and released as `v0.3.0` (`fb942f8`); the change review is [`../reviews/003-the-first-blocks-pr-2026-10-28.md`](../reviews/003-the-first-blocks-pr-2026-10-28.md), all 7 findings dispositioned
- **Date:** 2026-10-28
- **Author:** the design lead
- **Kind:** five registry blocks and two new component items (`status`, `error-summary`); the routes and the viewer that serve and show blocks; tests; the 0.3.0 release
- **Depends on:** [`002`](./002-the-primitives-forms-surfaces-and-feedback.md), *built* (commit `7857ea4`, tagged `v0.2.0`), and through it [`001`](./001-tokens-and-the-registry.md) (`33e94de`, `v0.1.0`).
- **Blocks:** `004`, whose `code-block` composes `status`; and `006`, the app shell and the chat pane, which reuses `status` and the view machinery.
- **Research:** [`../research/2026-10-28-blocks-how-they-are-declared-installed-and-previewed.md`](../research/2026-10-28-blocks-how-they-are-declared-installed-and-previewed.md) (cited as *blocks memo*); [`../research/2026-10-28-the-blocks-patterns-and-accessibility.md`](../research/2026-10-28-the-blocks-patterns-and-accessibility.md) (*patterns memo*); [`../research/2026-10-28-the-primitives-the-blocks-and-the-home-page-need.md`](../research/2026-10-28-the-primitives-the-blocks-and-the-home-page-need.md) (*primitives memo*); in [`../decisions.md`](../decisions.md), "The design calls for `003`, the first blocks" (cited as *the `003` calls*, and its last part as *the review calls*), "Blocks, and they shape `002`" (*the blocks decision*) and "The primitives split in two, and the design calls for `002`" (*the split decision*); `002`'s decisions and Landing notes; the Pluto Systems design book (*the design book*), cited by section. A few facts were read or run for this specification, or read by its review; each is labelled where it is used.

## Intent

`002` filled the registry with 26 components. This specification composes them into the first **blocks**: whole pages and sections that an app installs with one `add` and then owns.

It builds four things.

1. **Five blocks**, each a `registry:block` item: `hero` (the hero with a call to action and a feature grid), `sign-in`, `sign-up` (with its code step), `page-states` (empty, loading, error, not found) and `settings` (the settings form). The set is fixed by the blocks decision and the split decision.
2. **Two component items.** `status`: an empty polite live region that exists from the first render (the `003` calls). `error-summary`: the box a failed submit puts at the top of a form, shared by the three forms (the review calls).
3. **The machinery that serves and shows blocks.** A chrome-less route per block and per state, prerendered. On each block's item page, a **viewer**: the block in an iframe at 360, 768 and 1280 px, following the site's theme, with an "open alone" link and a code view of exactly what `add` writes.
4. **Tests** that extend `002`'s pattern, and the **0.3.0 release**.

The design calls are already made. This specification makes the mechanical choices those calls leave open, gives every block its structure, copy, states and accessibility contract, and makes each one countable.

Terms used throughout. `001`'s and `002`'s terms keep their meanings (registry, item, `add`, token, preview page, catalogue, scratch app, primitive, control, live region, keyboard stop, fixture).

- **Block:** a `registry:block` item: one or two page files and the components they use (blocks memo §1.1).
- **Page file:** a file of type `registry:page`. `add` writes it under the app's `src/routes`, so it becomes a route.
- **Component file:** a file of type `registry:component`. `add` writes it flat into the app's `components` folder.
- **Target:** the path, relative to the folder its file type resolves against, where `add` writes a file (blocks memo §1.2).
- **App path:** where a file lands in an app with the SvelteKit 3 `#lib` aliases of `001`'s scratch app A, such as `src/routes/sign-in/+page.svelte`.
- **Chrome:** the site's own header and frame around a page. A *chrome-less* page shows only its content.
- **View:** a prerendered page at `/view/<block>/` or `/view/<block>/<state>/` that shows one block in one state, with no chrome.
- **Viewer:** the part of a block's item page that shows its views in an iframe, with width presets, a state switch, an "open alone" link and a code view.
- **Error summary:** a box at the top of a form, after a failed submit, that lists each error as a link to its field (patterns memo, Terms).
- **Stub:** a stand-in for the app's server: an `async` function in a page file that waits and returns a fixed answer. The preview's only "server".
- **Crawler:** SvelteKit's prerender step, which follows every same-origin link in a prerendered page and fails the build on a page it cannot render.
- **Reflow:** content that works at 320 CSS px wide with no horizontal scrolling (SC 1.4.10, patterns memo §0.1).
- **Landmark:** a page region assistive technology lists, such as `main` (patterns memo, Terms).
- **Ring:** `001`'s focus outline: 2 px solid at a 2 px offset, so it reaches 4 px beyond its control (`001` decision 13).

## Decisions

Each choice, with its reason. Where the `003` calls, the review calls or an earlier specification already decided something, this specification cites it and does not decide it again.

### 1. Scope: five blocks, two components, the viewer, and nothing else

- **The five blocks** are the blocks decision's first set, less the two the split decision moved to `006` (the app shell and the chat pane): `hero`, `sign-in`, `sign-up`, `page-states`, `settings`.
- **The two new components** are `status` (the `003` calls; `002` decision 24) and `error-summary` (the review calls, after review finding 11), both `registry:ui` items.
- **The viewer** is the `003` calls' last bullet: a `/view/<block>` route with no chrome, prerendered, in an iframe with 360, 768 and 1280 px presets, a theme the iframe follows, "open alone", and a code view. No screenshots.
- **Not here:** the app shell and the chat pane (`006`); `code-block` and the editor (`004`); overlays and the sidebar (`005`); deployment; the doc-ID scheme (`006`; settled as `PS-<series>-<NNNN>` in `decisions.md`, "The theme mechanism, the doc-ID scheme and the footer's sentence"); any server-side authentication. The blocks take callbacks; the preview fakes the server with stubs (decision 6).
- **The registry then holds 39 items:** `002`'s 32, `status`, `error-summary` and the five blocks.

### 2. A block is one page plus its components, and where its source lives

The `003` calls fix the shape: "one thin page plus the components an app will reuse, installed with one `add`". This decision fixes where the files live and how the page reaches its components. The blocks memo §5 names three import options; we take (a).

- **Page files live in `src/lib/registry/blocks/<block>/`.** The folder exists and is empty (`001` decision 29). Each block has a `+page.svelte`; `page-states` also has a `+error.svelte` (decision 13).
- **Component files live flat in `src/lib/registry/components/`**, each named `<block>-<part>.svelte`, such as `sign-in-form.svelte`.
- **The page imports each component by our `components` alias, with the extension:** `import SignInForm from "#lib/registry/components/sign-in-form.svelte"`. `registry build` replaces `#lib/registry/components` with `$COMPONENTS$`, and `add` writes the app's alias back (blocks memo §4.2 and §4.3, EXECUTED: the probe page built to `$COMPONENTS$/probe-card.svelte`, installed as `#lib/components/probe-card.svelte`, and `vite build` exited 0).
- **A component imports primitives by `#lib/registry/ui/<name>`** (extensionless, as `002`'s items do) and `cn` from `#lib/utils`. Two components of one block import each other by the components alias.
- **This departs from `001` decision 29**, which expected blocks to import only `#lib/registry/ui/…` and `#lib/utils`. The departure is safe: `#lib/registry/components` is one of the five aliases, so `build` rewrites it (`001` decision 19). Only `#lib/registry/blocks/…` has no alias, and nothing imports it.
- *Why (a), the alias, not (b) or (c):*
  - A relative import left as it is breaks the app's build: `./components/probe-card.svelte` stayed relative and `vite build` failed with `UNRESOLVED_IMPORT` (blocks memo §4.3, EXECUTED).
  - (b), setting the registry's `components` alias to `"./components"`, makes `build` `replaceAll` that string in every file of every item (`001` decision 19). It would also part `registry.json`'s aliases from `components.json`'s, which `001` decision 21 keeps equal.
  - (c), a build step of our own, is code to maintain for what (a) does with none.
  - (a) is the path the memo ran end to end.
- *Why flat components and a split source:* the source then mirrors the app. Pages land under `src/routes/<block>/`, components flat under `src/lib/components/` (blocks memo §1.2 table). A reader of our tree sees the app's tree.
- **The naming rule: every component file starts with its block's name and a hyphen.** *Why:* components land flat, so two blocks that each ship `form.svelte` would collide, and the later one would overwrite the earlier (blocks memo §1.2, INFERRED there; the stock sidebar blocks overwrite each other's `app-sidebar.svelte`). A prefix makes a collision impossible across our blocks. `blocks.test.ts` checks it (decision 20).
- **No block imports another block.** No file imports `#lib/registry/blocks/…` or another block's component, and no block names a `registry:block` in its dependencies. *Why:* no alias covers `#lib/registry/blocks/`, so such an import would survive `build` raw (`001` decision 19's trap), and a block must install alone. What blocks share is a `registry:ui` item, such as `error-summary`.
- **How our preview imports the same files without the CLI.** A view route imports the page file directly: `import Page from "#lib/registry/blocks/sign-in/+page.svelte"`. `package.json`'s `imports` resolve `#lib/*` to `src/lib/*` (`001` decision 2), so the page's own `#lib/registry/components/…` and `#lib/registry/ui/…` imports resolve in our app exactly as they will after `add`. SvelteKit's rule against reserved `+` names applies only inside `src/routes` (READ by the review: `create_manifest_data/index.js:537-572`), so a `+page.svelte` under `src/lib` is an ordinary component. The stock docs site imports its blocks' page files the same way (blocks memo §3, READ).
- **A page file takes no props and has no load file.** It imports nothing from `./$types`, which exists only under `src/routes`. *Why:* the same file must type-check in our `src/lib` and in the app's `src/routes`.

### 3. The page target rule, and installing without `-o`

- **No page file in `registry.json` carries a `target`.** `build` then computes `<block>/<base name>` for every page file of a multi-file block (blocks memo §1.2, READ `build.ts:119-139`; §4.2, EXECUTED: `probe-block-default/+page.svelte`). So `sign-in`'s page lands at `src/routes/sign-in/+page.svelte`, route `/sign-in`, and `page-states`' error page at `src/routes/page-states/+error.svelte`.
- **Never `src/routes/…` and never `~/`.** A bare `src/routes/probe/+page.svelte` landed at `src/routes/src/routes/probe/+page.svelte` (blocks memo §4.3, EXECUTED). `~/src/routes/…` names a path from the project root (blocks memo §1.2).
- *Why the default, not `~/`:* a target at `~/src/routes/+error.svelte` or `~/src/routes/+page.svelte` names an app's root error page or home page, which almost every app has. The default writes no file outside `src/routes/<block>/`, the flat `<block>-*` components, and the folders of the block's dependencies.
- *What it costs:* the hero lands at `/hero`, not `/`, and the error page handles only errors thrown by `/page-states` itself (decision 13). An app moves or imports what it wants at its root (decision 23).
- **The block names are chosen so the route is the natural one:** `/sign-in`, `/sign-up`, `/settings`. Those are also the folders an app may already have, which is why the next rule matters.
- **Blocks are added without `-o`.** READ on 2026-10-28 in the CLI at `6149e14`: `-y` skips only the "proceed?" prompt (`packages/cli/src/commands/add/index.ts` lines 41, 42 and 115). Without `-o`, `add` lists every item whose files already exist and asks whether to overwrite all of them; answered no, it asks item by item (`packages/cli/src/utils/add-registry-items.ts` lines 92 to 143). With `-o` it asks nothing.
  - A block can pull up to 13 primitives an app may have changed (`settings`), and its route may already exist. With `-o`, both would be replaced without a word (constitution §6, "Break an installed app silently").
  - **So the command for a block is `add <block> -y`**, never with `-o`. The install command the site shows already omits `-o` (`InstallCommand`, `001` decision 24). Each block's item page says, beside it: "Leave out `-o`. Without it, the CLI lists the files that already exist and asks before it overwrites any. Use `-o` only for a first install into an app with nothing to lose."
  - **This amends `001` decision 23's guidance** (`add … -y -o`) for blocks and for any item added to an app that already holds some of its files.
  - The smoke test keeps `-o`: its scratch apps are fresh and have nothing to protect.
- `registry.test.ts` checks that 6 of 6 page files carry no `target` and build to `<block>/<base name>`, and that 0 built targets begin `~/` or `src/`.

### 4. What a block may link to and reference

Facts READ on 2026-10-28 in this repository's SvelteKit 3.1.0 (`node_modules/@sveltejs/kit/src/core/postbuild/`), with line numbers corrected by the review:

- The crawler follows every same-origin `href` unless the link has `rel="external"`, and follows every `src` (`crawl.js` lines 197 to 206). It therefore also follows the viewer's iframe `src`.
- A page that does not render with status 200 goes to `handleHttpError` (called at `prerender.js` lines 630 to 636), whose default handler logs and throws (lines 101 to 110 and 184 to 206). So it fails the build.
- A fragment link whose `#id` names no element on its page goes to `handleMissingId` (checked at lines 731 to 744; the handler defined at 208 to 213), which also fails by default.

`001`'s scratch apps prerender every route. So a block page that links to `/forgot-password` fails the build of an app that has no such route.

- **The link rule: a block file's only root-relative link is `/`.** Every other link is a fragment on the same page (`#hero-features`) or comes from the app through a prop or snippet. *Why `/`:* every app has a root page, and our site's `/` is the catalogue.
- **Links to app-owned routes are the app's.** "Create an account" and "Forgot your password?" go in the forms' `footer` snippet. The terms and the privacy notice are `sign-up`'s `termsHref` and `privacyHref`. Each renders nothing unless given (decisions 11 and 12). The shipped pages pass none. *Why:* a block must install alone and build. A link to `/sign-up` from `sign-in` would fail an app that installed only `sign-in`.
- **Two views pass them,** each linking to `/`, so their markup and targets are tested: `/view/sign-in/credentials/` passes a `footer` with "Create an account", and `/view/sign-up/errors/` passes `termsHref` and `privacyHref` (review finding 12).
- **No block references a file it does not ship.** No image, font or other asset path; no `<img>`. Icons come from `phosphor-svelte`, a named package (blocks memo §5, "Assets"; `002` decision 20).
- `blocks.test.ts` counts both rules (decision 20).

### 5. The registry entries

**Listed by hand, in a fixed order, not crawled.** *Why:* every item in `registry.json` is already hand-written (`001` decision 19, `002` decision 6), with its `registryDependencies` reviewed. A crawler that inferred dependencies from imports, as the stock docs site does (blocks memo §2.2, READ), would be one more script whose output review must trust. We keep the inference as a check instead: `blocks.test.ts` proves every primitive a block imports is in its dependencies (decision 20).

**Order and groups.** `status` and `error-summary` join `feedback` after `spinner`. The blocks form a sixth group, `blocks`, after `forms`.

| # | Group | Items |
|---|---|---|
| 1–6 | `foundation` | `pluto-theme`, `font-geist`, `font-heading-ibm-plex-sans`, `font-jetbrains-mono`, `utils`, `four-dot` |
| 7–9 | `actions` | `button`, `tooltip`, `kbd` |
| 10–16 | `surfaces` | `card`, `separator`, `item`, `table`, `tabs`, `collapsible`, `avatar` |
| 17–24 | `feedback` | `alert`, `alert-dialog`, `badge`, `empty`, `skeleton`, `spinner`, **`status`**, **`error-summary`** |
| 25–34 | `forms` | `label`, `field`, `input`, `textarea`, `input-group`, `native-select`, `checkbox`, `radio-group`, `switch`, `input-otp` |
| 35–39 | `blocks` | **`hero`**, **`sign-in`**, **`sign-up`**, **`page-states`**, **`settings`** |

Types: 1 `registry:theme`, 3 `registry:font`, 1 `registry:lib`, 29 `registry:ui`, 5 `registry:block`.

**Each new item** has `title`, a one-sentence `description`, `001`'s `author`, and `meta: { "since": "0.3.0", "group": … }`. Neither new component carries `meta.stock`: they are ours, not restyled stock items (`002` decision 5). The titles and descriptions are shipped copy, and `viewer.spec.ts` reads the titles:

| Item | `title` | `description` |
|---|---|---|
| `status` | Status | An empty polite live region, present from the first render, whose text the app sets. |
| `error-summary` | Error summary | The box a failed submit puts at the top of a form: a heading, the form's message and a link to each invalid field, focused when it appears. |
| `hero` | Hero | A page's opening: an optional eyebrow, the one heading, a sentence, one call to action, and a feature grid divided by grooves. |
| `sign-in` | Sign in | Email and password in one step, with an error summary that takes focus, a password you can show, and a button that goes busy. |
| `sign-up` | Sign up | Email and a password with its rules written first, then a six-digit code on its own step, with resend. |
| `page-states` | Page states | Empty, loading, error and not found as one family, with an error page for SvelteKit's error route. |
| `settings` | Settings | One column of sections divided by grooves, saved by one button, with an inline Saved message and a confirmed delete. |

- **`meta` holds nothing else.** *Why:* `meta` is the only per-item field that survives our build (blocks memo §1.3, EXECUTED), but nothing an app installs needs a preview height or a list of preview states. The viewer's data lives in the preview app (decision 16). The stock docs site keeps its block metadata in a separate TypeScript map for the same reason (blocks memo §2.2, READ).
- **Every new item names `utils` and `pluto-theme`**, as every `002` item does (`002` decision 6), then each item it imports.

| Item | Files (page / component) | `registryDependencies` beyond `utils`, `pluto-theme` | Packages detected |
|---|---|---|---|
| `status` | 2 (`status.svelte`, `index.ts`) | | |
| `error-summary` | 2 (`error-summary.svelte`, `index.ts`) | `alert` | `phosphor-svelte` |
| `hero` | 3 (1 / 2) | `button` | |
| `sign-in` | 2 (1 / 1) | `card`, `field`, `input`, `input-group`, `button`, `error-summary`, `status` | |
| `sign-up` | 3 (1 / 2) | `card`, `field`, `input`, `input-group`, `input-otp`, `button`, `error-summary`, `status` | |
| `page-states` | 5 (2 / 3) | `empty`, `button`, `skeleton`, `status` | `phosphor-svelte` |
| `settings` | 3 (1 / 2) | `field`, `input`, `native-select`, `checkbox`, `radio-group`, `button`, `alert-dialog`, `error-summary`, `status` | |

- The 16 block files: 6 page files and 10 component files. With the two components' 4, the registry's item files become **153** (`002`'s 133 + 20).
- The distinct registry dependency names become **24**: `002`'s 11 and `card`, `field`, `input-group`, `alert`, `error-summary`, `status`, `input-otp`, `empty`, `skeleton`, `native-select`, `checkbox`, `radio-group`, `alert-dialog`. Each names an item here, because the CLI never falls back to the stock registry (blocks memo §1.4; the split decision).
- `phosphor-svelte` reaches `error-summary` (its `WarningCircle`) and `page-states` (its `FolderSimple`) by `build`'s detection, at `^3.1.1` (`002` decision 2). The three forms get their icon through `error-summary`. No new item imports `bits-ui` or `tailwind-variants` directly. `package.json` keeps its 23 packages; items still name 9.

### 6. How a block takes data: callbacks, initial props and stubs

- **Each form component takes an `async` callback** that resolves to what happened:
  ```ts
  type Result<Field extends string> =
    | { ok: true }
    | { ok: false; errors?: Partial<Record<Field, string>>; formError?: string };
  ```
  `errors` names fields; `formError` is one message for the whole form.
- *Why callbacks, not form actions:* a page with form actions cannot be prerendered, and `001`'s scratch apps prerender every route (`adapter-static`). A callback works in a prerendered app, in a server-rendered one, and in our preview. An app that wants a form action wraps the component; that is the app's code.
- **State is also settable by props**, all optional and bindable: `errors`, `formError`, `busy`, and each form's values. *Why:* the views render each state by props, without driving the form (decision 16), and an app that renders errors from a server response passes them the same way.
- **The page files carry stubs, the preview's fake server.** Each stub waits, then returns a fixed answer. Every stub carries the comment "A stand-in for your server. Replace it." Decisions 11, 12 and 14 give each one. *Why fixed answers:* tests and readers can reach every state on purpose. *Why a wait:* the busy state must be visible long enough to see and test. The wait is 800 ms; a fake network delay is not interface motion, so no motion token governs it.
- **Without JavaScript the forms do not submit.** Server-side authentication is out of scope (decision 1). An app that needs a no-script path adds a form action.

### 7. The behaviour the three forms share

`sign-in`, `sign-up` and `settings` follow one contract, so one set of tests covers the pattern and each form adds only its own.

- **Validation happens on submit, never while typing.** Each component checks required fields and formats in the browser, then calls its callback. *Why:* `FieldError` carries no live region, which is sound only when errors appear on submit and focus then moves (`002` decision 24, precondition 3; patterns memo §3.1, GOV.UK). Every `<form>` sets `novalidate`, so our messages replace the browser's (patterns memo §3.1, GOV.UK).
- **The error summary always appears on a failed submit** (the `003` calls: GOV.UK's rule, not Primer's three-error threshold). It is the `error-summary` item (decision 9), composed by four components: `sign-in-form`, `sign-up-form`, `sign-up-verify` and `settings-form`.
  - It sits first inside the `<form>`, above the fields. *Why not above the `h1`, as GOV.UK places it:* focus moves to it, so it is read first wherever it sits, and inside the form it stays beside what it lists.
  - The form renders it only while there is something to list, so a failed submit **inserts** it. The form passes `announce` (its `role="alert"`) when a submit in this document produced it, and `announce={false}` when it renders errors given as initial props (a view, or errors from a server). *Why:* `role="alert"` must never sit on content present at load (`002` decision 24, precondition 2). An app that renders server errors moves focus to the summary itself; the component's documentation says so.
  - **Focus moves to it** after every failed submit: the form binds the item's `ref` and calls `focus()` after the next tick. The item's `tabindex="-1"` keeps it out of the Tab order.
  - Its links, in field order, each carry the field's inline error as text and `#<field id>` as `href`; the item focuses the field on click or Enter (decision 9).
- **Inline errors come from `Field`'s `error` prop**, so the control gets `aria-invalid` and `aria-describedby` from the context, in the server HTML too (`002` decision 11). Every field gets a fixed `id`, `<idPrefix>-<field>`, so the summary can link to it. Every `idPrefix` begins with a letter that is not a hex digit (`sign-in`, `sign-up`, `settings`), so `#sign-in-email` can never read as a hex colour to the lint (`001` decision 25).
- **The submit button goes busy, not disabled** (`002` decision 12): `busy` stays true from the callback's start to its answer. A second click or Enter does nothing.
- **A `Status` region says what is happening**, hidden unless the form says otherwise: "Signing in…", "Creating your account…", "Checking the code…", "Saving…". It clears when the answer arrives. *Why:* `aria-busy` on a button is announced poorly (`002` decision 12), and a status region is the sanctioned way (SC 4.1.3, ARIA22, patterns memo §0.1).
- **A form-level error clears the password.** On `formError`, a password field is emptied (Carbon and GOV.UK, patterns memo §3.1). Field errors leave values as typed.
- **The page title says "Error: "** while a summary is shown (GOV.UK, patterns memo §3.2). The page sets its one `<title>` with `error-summary`'s `titleFor(title, failed)`, from the form's bound `errors` and `formError`.
- **Paste and password managers are never blocked** (SC 3.3.8). No field sets `onpaste`, and `autocomplete` is always set (decisions 11, 12, 14).

### 8. The `status` item

The `003` calls: "a `registry:ui` component that renders an empty `role="status"` region at mount and lets the app set its text, so the region exists before it changes."

- **Files:** `src/lib/registry/ui/status/status.svelte` and `index.ts` (two files, so it installs into its own folder, `001` decision 19). `index.ts` exports `Root` and `Status`, as stock items export their parts.
- **API:**
  ```ts
  type StatusProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    /** What the region says. Empty by default. Set it to announce; set "" to clear. */
    text?: string;
    /** Shown on screen as well as announced. Default false: visually hidden. */
    visible?: boolean;
  };
  ```
- **It renders** `<div data-slot="status" role="status" aria-live="polite" aria-atomic="true" class={cn(!visible && "sr-only", className)} {...rest}>{text}</div>`, always, even when `text` is empty.
  - *Why `aria-live` and `aria-atomic` though the role implies both:* MDN advises the redundant `aria-live="polite"` for compatibility (patterns memo §5.2). `aria-atomic` makes a change read the whole message, not the changed word.
  - *Why a `text` prop, not a store or a function:* the region must be in the markup before its text changes (patterns memo §0.1, MDN). A component guarantees that; a helper that created regions on demand would not (`002` decision 24). A prop is the plainest Svelte way to change its content.
  - *Why polite only, with no prop for assertive:* assertive interrupts the reader, and SC 4.1.3 lists it on non-urgent content as a failure (patterns memo §0.1). The urgent case, an error, has `Alert variant="destructive"` and `error-summary`, both `role="alert"`.
- **Replacing and clearing.** Setting new text replaces the old and is announced. Setting `""` clears it silently. Setting the same text twice changes nothing and is not announced again. **So the blocks never set the same message twice in a row:** a working message comes between ("Saving…" before every "Saved", "Sending a new code…" before every resend's result), and a repeated result is worded differently (decision 12's "another code").
- **The precondition, stated on the item page:** a region announces only if it was in the page before its text changed. A component that mounts `Status` and fills it in the same moment may be silent; mount it first.
- **No colour of its own.** A visible status takes the colour of its context or a class, such as `text-success` for "Saved".
- **Item page:** header; variants (hidden, visible); states (empty, with text); accessibility (the role, the two attributes, present at mount, the precondition); a keyboard fixture of 2 stops, buttons "Announce" (sets both specimens' text to "Copied to the clipboard") and "Clear".
- **Tests** (decision 20): the raw prerendered HTML holds both regions, empty, with the three attributes; Announce sets the text and Clear empties it; the hidden one is visually hidden (a 1 × 1 px clip) and the visible one is not.

### 9. The `error-summary` item

The review calls: "a `registry:ui` component: `role="alert"`, focusable, a heading, a list of links to the invalid fields, the 'Error: ' title prefix. Four blocks compose it instead of carrying a copy each." In this set, four components in three blocks compose it (decision 7).

- **Files:** `src/lib/registry/ui/error-summary/error-summary.svelte` and `index.ts`. `index.ts` exports `Root`, `ErrorSummary` and `titleFor`.
- **Composes:** `Alert` with `variant="destructive"` (its tint, border and text colour, `002` decision 19) and `WarningCircle` from `phosphor-svelte`, decorative. Dependencies: `utils`, `pluto-theme`, `alert`.
- **API:**
  ```ts
  type ErrorSummaryProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    /** A link per invalid field, in field order: the field's id and its inline error. */
    errors?: { id: string; message: string }[];
    /** The form-level message, such as a credential failure. */
    message?: string;
    /** Default "There is a problem" (GOV.UK). */
    title?: string;
    /** The title's heading level. Default 2. */
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    /** Default true: role="alert". False when rendered from initial props. */
    announce?: boolean;
  };
  /** "Error: " + title while a summary is shown, else title (GOV.UK). */
  export function titleFor(title: string, failed: boolean): string;
  ```
- **It renders** nothing when `errors` is empty and `message` is unset. Otherwise an `Alert` root with `data-slot="error-summary"`, `role={announce ? "alert" : null}`, `tabindex="-1"` and the bound `ref`. Inside: the icon; the title as a heading (`<h2>` by default, `font-heading text-base font-bold`); the `message` as a `<p>`; then a `<ul>` of links.
- **Each link** is `inline-flex min-h-6 items-center underline underline-offset-4`, so it is at least 24 px tall (`002` R21); an `Alert`'s `text-sm` alone gives a 21.6 px line box. On click (Enter on a link fires one), it calls `preventDefault()` and focuses `document.getElementById(id)`; the browser scrolls the field into view. *Why script, not the bare fragment:* following a fragment moves the scroll position but does not focus an input in every browser (INFERRED; GOV.UK's component does the same in script, patterns memo §3.2).
- *Why a heading:* GOV.UK's summary is headed "There is a problem" (patterns memo §3.2), and a heading lets a screen reader user who moves by heading find it again.
- *Why focus is the form's, not the item's on mount:* a second failed submit leaves the summary mounted, so a focus-on-mount would not run again. The form focuses it after every failed submit.
- *Why `titleFor`, not a `<title>` inside the item:* two `<svelte:head>` titles would put two `<title>` elements in the head. The page keeps its one title and asks the item for the prefix.
- **Polite about nothing.** It is not a polite live region. It is inserted on a failed submit as `role="alert"`, and focus moves to it (the review calls).
- **Item page:** header; variants (a message only; links only; both); states (announced, from props); accessibility (the role rule, the focus rule, link targets, `titleFor`); a **keyboard fixture** of 3 stops: input "Project name", input "Owner email", button "Create project". Pressing "Create project" with both fields empty inserts a summary with 2 links ("Enter a project name", "Enter the owner's email address"), `role="alert"`, focused. The specimens above the fixture render from props with `announce={false}`.
- **Tests** (decision 20): in the raw prerendered HTML, the specimens carry no `role`; the fixture's insertion, role, focus and link focus; 3 fixture stops.

### 10. `hero`

**Structure** (the `003` calls): an optional mono eyebrow, an ink `h1`, one sentence, one primary call to action, an optional secondary link, an optional `media` snippet; then a feature grid. No mark, nothing moves. The lockup and the orbit-assemble entrance are `006`'s header.

**Files.** `blocks/hero/+page.svelte`; `components/hero-section.svelte`; `components/hero-features.svelte`.

**Composes.** `Button` (default variant with `href` for the call to action; `variant="link"` with `href` for the secondary), `cn`.

- `HeroSection` props: `eyebrow?: string`, `title: string`, `description: string`, `action: { label: string; href: string }`, `secondary?: { label: string; href: string }`, `media?: Snippet`, `class`, and the rest on its `<section>`.
- `HeroFeatures` props: `title: string` (the section's `h2`), `id?: string` (on the `<section>`, the secondary link's fragment target), `features: { title: string; description: string; icon?: Component }[]`, `class`.

**Markup and style.**

- The eyebrow is a `<p>`: `font-mono text-xs font-medium tracking-eyebrow text-muted-foreground lowercase` (the design book §04: mono furniture is lowercase).
- The `h1` is `font-heading font-bold text-foreground text-2xl tracking-section sm:text-5xl sm:tracking-display`. Below `sm` it is 28 px; from `sm` it is 44 px (the `003` calls: "no size between"). Ink only (the design book §03).
- The sentence is a `<p>` in `max-w-prose text-muted-foreground`. The text column is capped at 65 ch (`max-w-prose`, inside the design book's 60 to 75 ch).
- The calls to action sit in a row, `flex flex-col gap-3 sm:flex-row sm:items-center`. The primary is `w-full sm:w-auto`. The secondary is an underlined link, 48 px tall like every button (`002` decision 12).
- With `media`, the section becomes two columns from `lg` (`lg:grid lg:grid-cols-2 lg:gap-12`), copy first; below `lg` the media follows the copy. Without it, one column.
- **The feature grid is a `ul`, not cards** (the `003` calls). `role="list"`, because WebKit drops list semantics from a list styled `list-style: none` (INFERRED; widely reported, not read for this specification). Each `li` is `groove pt-6`: the groove across its top is the separator. 1 column below `sm`, 2 from `sm` (`sm:grid-cols-2`), 3 from `lg` (`lg:grid-cols-3`), `gap-x-8 gap-y-8`. *Why a top groove on every cell, not lines between cells:* the design book's groove has a horizontal form only; the vertical form is `005`'s `groove-s` (`005` decision 5). A groove on each cell reads as a ruled list at every column count.
- Each feature: an optional icon (`size-6`, decorative, monochrome `text-foreground`; the design book §03 "no colour as decoration"), an `h3` (`font-heading text-base font-bold`), and a `<p>` in `text-muted-foreground`.
- Spacing: the page is `mx-auto max-w-5xl px-6 py-16 sm:py-24`; the hero and grid are `gap-16` apart (layout steps are 32 and up, the design book §05).

**States and views.** One state; one view, `/view/hero/`, the page file. The `media` snippet is empty in the preview (the `003` calls: the code block is `004`'s).

**Accessibility contract.**

- One `h1`, the headline (SC 1.3.1; W3C headings tutorial, patterns memo §1.2). The grid's `h2`, then `h3` per feature: no skipped rank.
- The call to action is a link, because it goes to another page (patterns memo §2.2). Its label names its result, not "Get started" (patterns memo §2.1, NN/g; SC 2.4.4, INFERRED there).
- No landmark of its own: the sections carry no accessible name, so they are not `region` landmarks. The app's layout supplies `<main>` (decision 16).
- Every target is at least 24 px: both calls to action are 48 px tall (`002` R21).
- Nothing animates (the design book §06; the `003` calls).

**Responsive.** At 360: one column, `h1` 28 px, both calls to action stacked and the primary full width, grid 1 column. At 768: `h1` 44 px, calls to action in a row, grid 2 columns. At 1280: grid 3 columns; the content stays within `max-w-5xl` (1024 px).

**Copy.** The preview's hero is about this design system, so every claim is true where it is shown, and none claims more than a test proves (the review calls: no "meets WCAG").

| Part | Text |
|---|---|
| `<title>` | Components you copy in and own |
| eyebrow | pluto systems · design system |
| `h1` | Components you copy in and own |
| sentence | Tokens, styles and Svelte components for Pluto Systems apps. One command copies a component's source into your project, and from then on it is yours to change. |
| call to action | Browse the components → `/` |
| secondary | See what is included → `#hero-features` |
| grid `h2` | What is included |
| feature 1 | **One source for every colour and size.** Each colour, space and radius comes from one token file, checked for contrast in light and dark. |
| feature 2 | **Source, not a package.** An app installs a component once and owns the copy. Nothing reaches back to the registry at run time. |
| feature 3 | **Built for the keyboard.** Every component works by keyboard, and tests check each one's focus order and its focus style. |

**Keyboard fixture** (`/view/hero/`), 2 stops: link "Browse the components", link "See what is included".

### 11. `sign-in`

**Structure** (the `003` calls): one step, email and password. No social, passkey or email-link sign-in. A show and hide toggle. An error summary on every failed submit. A credential failure is one form-level message that names no field. The button goes busy.

**Files.** `blocks/sign-in/+page.svelte`; `components/sign-in-form.svelte`.

**Composes.** `Card` (`Root`, `Header`, `Title` with `level`, `Description`, `Content`, `Footer`); `Field` with `id`, `error`; `Input`; `InputGroupPassword`; `Button` with `type="submit"` and `busy`; `ErrorSummary` and `titleFor`; `Status`.

`SignInForm` props:

```ts
type SignInValues = { email: string; password: string };
type SignInResult = Result<"email" | "password">;
{
  onsubmit: (values: SignInValues) => Promise<SignInResult>;
  email?: string;            // bindable
  errors?: Partial<Record<"email" | "password", string>>; // bindable
  formError?: string;        // bindable
  busy?: boolean;            // bindable
  title?: string;            // default "Sign in"
  description?: string;      // default the copy below
  level?: 1 | 2 | 3 | 4 | 5 | 6; // the title's heading level, default 1
  idPrefix?: string;         // default "sign-in"
  footer?: Snippet;          // app-owned links: "Create an account", "Forgot your password?"
  class?: string;
}
```

The password is not a prop: it is never pre-filled, and decision 7 clears it on a form-level error. The component's module script also exports `MESSAGES`, the house wording for states the app's server reports (below).

**Markup and style.**

- `Card.Root` holds `Card.Header` (the title, an `h1` by default, `text-2xl tracking-section` in place of the card title's `text-base`; the description), `Card.Content` (the `<form novalidate>`) and, when `footer` is given, `Card.Footer` with it.
- Inside the form: the summary (decision 7) when shown; the email `Field` (`id` `sign-in-email`, label "Email address"); the password `Field` (`id` `sign-in-password`, label "Password"); the submit button, full width; the `Status`.
- The email `Input`: `type="email"`, `autocomplete="username"`, `spellcheck={false}`, `autocapitalize="off"`. The password: `InputGroupPassword` with `autocomplete="current-password"` (it sets `spellcheck` and `autocapitalize` itself, `002` decision 19).
- **Below `sm`, the card drops its frame and lets its contents' rings show.** The card root takes `max-sm:overflow-visible max-sm:border-0 max-sm:bg-transparent max-sm:py-0`, and its header, content and footer `max-sm:px-0`. The form sits on the page's paper ground, inside the page's 24 px gutter.
  - *Why drop the frame* (the review calls): at 320 px a card's border and padding take 48 px of a 272 px column, and `sign-up`'s code step needs them (decision 12). GOV.UK's sign-in has no card at all (patterns memo §3.1). From `sm` it is a raised card, as the design book places forms on raised white.
  - *Why `overflow-visible`* (review finding 1): `002`'s card root is `overflow-hidden` (READ by the review, `card.svelte`). With no side padding, every full-width control touches the card's edge, and its ring, 4 px beyond the control, would be clipped at left and right. Without the frame there is nothing to clip for; the page's 24 px gutter holds the ring. From `sm` the card keeps `overflow-hidden` and its 24 px padding, which holds the ring.
- The page: `<div class="flex min-h-svh justify-center px-6 py-16 sm:items-center">` around `<SignInForm class="w-full max-w-sm" …>`. The column is capped at 384 px at every width (patterns memo §3.4).

**Validation and copy.**

| Case | Message | Where |
|---|---|---|
| email empty | Enter your email address | `errors.email` |
| email without text on both sides of one `@` | Enter an email address like name@example.com | `errors.email` |
| password empty | Enter your password | `errors.password` |
| credential failure (from the stub) | That email address and password do not match an account. Check them and try again. | `formError` |
| too many attempts (`MESSAGES.tooManyAttempts`, for the app's server) | Too many attempts. Wait a while, then try again. | `formError` |

- The credential message names neither field and does not say which was wrong (SC 3.3.3's security exception, patterns memo §3.2). The rate-limit message promises no time.
- Other copy: `<title>` "Sign in", or "Error: Sign in" while a summary shows; title "Sign in"; description "Use the email address and password for your account."; button "Sign in"; status while busy "Signing in…"; summary title "There is a problem".

**The stub.** `signIn` waits 800 ms and returns `{ ok: false, formError: <the credential message> }`. *Why always a failure:* success is a redirect, which is the app's (`goto`), and the failure is the state worth seeing.

**States and views.** Each view sets its page file's `<title>`, with "Error: " where a summary shows.

| View | Shows | By |
|---|---|---|
| `/view/sign-in/` | ready | the page file |
| `/view/sign-in/errors/` | both fields empty after a submit: summary with 2 links, 2 inline errors | `errors` |
| `/view/sign-in/credentials/` | the credential message, email `ada@example.com` kept, password empty; a `footer` with the link "Create an account" to `/` | `email`, `formError`, `footer` |
| `/view/sign-in/busy/` | the button busy, the status "Signing in…" | `busy`, `email` |

The footer link is a `Button variant="link" size="sm" href="/"`, 32 px tall (`002` R21).

**Accessibility contract.**

- One `h1`, the card title (SC 1.3.1). `002` decision 24, item 6: `CardTitle` takes `level`.
- Visible labels (SC 3.3.2). `autocomplete` `username` and `current-password` (SC 1.3.5; the `003` calls).
- Paste and password managers work; the password can be shown (SC 3.3.8; GOV.UK).
- Errors in text, inline and in the summary (SC 3.3.1). Inline errors wired by `aria-describedby`, `aria-invalid` set (`002` decision 11).
- The summary takes focus after a failed submit; each link moves focus to its field (decisions 7 and 9).
- The busy button keeps focus; the status announces (SC 4.1.3).
- Every ring shows in full at every width (`001` decision 13; review finding 1).
- Targets: inputs and buttons 48 px tall; summary links 24 px; the footer link 32 px (`002` R21).
- Reflow at 320 px: one column, no card frame.

**Responsive.** At 360: no card frame, the form full width within a 24 px gutter, top-aligned. At 768 and 1280: a 384 px raised card, centred in the viewport.

**Keyboard fixtures:** ready 4 stops (input "Email address", input "Password", button "Show password", button "Sign in"); errors 6 (link "Enter your email address", link "Enter your password", then the 4); credentials 5 (the 4, then link "Create an account"); busy 4.

### 12. `sign-up`

**Structure** (the `003` calls): email and password only. No name, no confirm field, no strength meter. The rules are written before the field and wired by `aria-describedby`. Consent is a sentence under the button, not a checkbox. Verification is the six-digit code on its own step, with resend.

**Files.** `blocks/sign-up/+page.svelte`; `components/sign-up-form.svelte` (the details step); `components/sign-up-verify.svelte` (the code step).

**Composes.** As `sign-in`, plus `InputOTP` (`Root`, `Group`, `Slot`, `Separator`).

`SignUpForm` props: as `SignInForm`'s, with `title` default "Create an account" and `idPrefix` default `"sign-up"`, and these more:

- `password?: string`, bindable, so a view can show a too-short password's state;
- `passwordMinLength?: number`, **default 15**, which an app may raise and never lower: the component uses `Math.max(15, passwordMinLength)` (the review calls, after review finding 6);
- `termsHref?: string`, `privacyHref?: string`;
- `focusOnMount?: boolean` (default false): the title takes focus on mount, for a return from the code step.

The module script exports `MESSAGES`, with `emailUnavailable` (below).

`SignUpVerify` props:

```ts
{
  email: string;                                 // shown, never asked again
  onsubmit: (code: string) => Promise<Result<"code">>;
  onresend: () => Promise<void>;
  onchangeemail: () => void;
  code?: string; errors?: { code?: string }; formError?: string; busy?: boolean; // bindable
  focusOnMount?: boolean;                        // default false
  level?: 1 | 2 | 3 | 4 | 5 | 6; idPrefix?: string; title?: string;
  class?: string;
}
```

Its module script exports `MESSAGES`, with `tooManyAttempts` (as `sign-in`'s).

**The page orchestrates three steps**: `details`, `verify` and `done`. It wraps each callback: when `createAccount` answers `ok`, it keeps the email and moves to `verify`; when `verifyCode` answers `ok`, it moves to `done`. The `done` step is markup in the page: an `h1` "Your account is ready", a sentence, and a `Button` link "Continue" to `/`. *Why in the page:* what follows sign-up is the app's (a redirect, a welcome); the block shows one honest ending.

**Focus between steps.** The new step's `h1` has `tabindex="-1"` and takes focus when the step changes: `focusOnMount` on `SignUpVerify` going forward, `focusOnMount` on `SignUpForm` on "Use a different email address", an effect in the page for `done`. *Why:* the step replaces the form under the user's focus; moving focus to its heading tells a screen reader user where they are. `tabindex="-1"` keeps it out of the Tab order. Views pass no `focusOnMount`, so a view never moves focus.

**The details step.**

- Email `Field` (`id` `sign-up-email`, label "Email address"): `type="email"`, `autocomplete="email"`, `spellcheck={false}`, `autocapitalize="off"`. *Why `email` here and `username` on sign-in:* a new account has no saved credential to offer, while `email` lets the browser fill the person's address (patterns memo §8.4; SC 1.3.5). Password managers pair the new password with the email field either way (INFERRED).
- Password `Field` (`id` `sign-up-password`, label "Create a password", GOV.UK's words): `InputGroupPassword` with `autocomplete="new-password"`. Its `description` prop holds the rules.
- **The password policy** (the review calls; NIST SP 800-63B-4 §3.1.1.2, READ by the review on 2026-10-28): at least 15 characters, because in this sign-in the password is the only factor. **No `maxlength`** and no composition rule (NIST: allow at least 64 characters; add no composition rules). An app whose sign-in adds a second factor still may not lower the floor in this block; it raises it or replaces the block.
- **Rules before the field.** `Field` renders its description after the control (`002` decision 11). The block puts it first on screen with `*:data-[slot=field-label]:order-first *:data-[slot=field-description]:order-first` on that `Field`: the label, then the rules, then the input, then any error. *Why CSS order, not a new `Field` prop:* it changes no `002` interface. The programmatic order (label, input, rules) still reads in a meaningful sequence, because `aria-describedby` speaks the rules when the input takes focus (SC 1.3.2, INFERRED). Tab order is unaffected: the rules are not focusable.
- The submit button "Create account", full width, busy while waiting.
- **Consent renders only when the app gives `termsHref`** (the review calls). With it: "By creating an account, you agree to the terms of service." — "terms of service" a link. With `privacyHref` too: "By creating an account, you agree to the terms of service and the privacy notice." — both links. Without `termsHref`, no sentence: the page must not ask agreement to a document it does not offer. The sentence is `text-base text-muted-foreground`, so each inline link is a 25.6 px line box, above `002` R21's 24 px without relying on SC 2.5.8's inline exception.

**The code step.**

- Title "Check your email"; a sentence that names the email (SC 3.3.7: shown, not asked again).
- Code `Field` (`id` `sign-up-code`, label "Verification code", description "You can paste the whole code."): `InputOTP` with six slots in two groups of three. `002`'s `InputOTP` keeps `autocomplete="one-time-code"`, `inputmode="numeric"`, the digit pattern and the paste cleaner (`002` decision 18; SC 3.3.8).
- **Below `sm`, the cells are 32 px squares** (`max-sm:size-8` on each `Slot`); from `sm`, `002`'s 48 px. This is the one recorded exception to `002` decision 10's "code-input cells are 48 px squares" and to the same words in the split decision's "Control heights sit on the ladder" (the review calls, after review finding 8).
  - *Why:* six 48 px cells, two `gap-3` gaps and the 16 px separator need 328 px (READ in `input-otp.svelte`, and confirmed by the review). With a 24 px gutter each side, they fit only in a viewport of 376 px or more, so they fail at the 360 px test width, on a 375 px phone and at 320. At 32 px they need 232 px, which fits 320 less its gutters (272). 32 px is the `sm` control height (`002` decision 10), the one ladder step between 24 and 48 that fits, and above the 24 px minimum (`002` R21).
  - From `sm`, the 384 px card leaves 336 px, so the 48 px cells fit.
- No auto-submit when six digits are in. The person presses "Verify email". *Why:* a change of step only on a button press is predictable (INFERRED, WCAG's predictability principle; not read for this specification).
- **"Send a new code"** (`Button variant="secondary"`, busy while sending). While it runs, the status says "Sending a new code…"; then "We sent a new code to {email}." the first time and "We sent another code to {email}." every time after (review finding 4). The working message between results, and the different wording, mean each resend changes the region and is announced (decision 8).
- "Use a different email address" (`Button variant="link"`) returns to the details step with the email kept.

**Validation and copy.**

| Case | Message | Where |
|---|---|---|
| email empty / malformed | Enter your email address / Enter an email address like name@example.com | `errors.email` |
| email the app will not accept (`MESSAGES.emailUnavailable`) | That email address cannot be used for a new account. Use a different address, or sign in if it is yours. | `errors.email` |
| password empty | Enter a password | `errors.password` |
| password shorter than the minimum | Use at least 15 characters for your password | `errors.password` |
| code empty | Enter the 6-digit code from the email | `errors.code` |
| code incomplete | Enter all 6 digits of the code | `errors.code` |
| code wrong (from the stub) | That code is not right. Check the email, or send a new code. | `errors.code` |
| too many attempts (`MESSAGES.tooManyAttempts`) | Too many attempts. Wait a while, then try again. | `formError` |

- *On "email already in use"* (review finding 12): the wording says neither that an account exists nor why the address is refused (SC 3.3.3's security exception, patterns memo §4.2 and §8.4). The safer flow, which the block also supports, is for the app to answer `ok` and go to the code step whatever the address, then email the owner of an existing account; GOV.UK keeps the two paths apart (patterns memo §4.1). Which flow is the app's.
- Other copy: `<title>` "Create an account", "Check your email" or "Your account is ready", each with "Error: " while a summary shows; description "You need an email address. We send a code to it to check that it is yours."; rules "Use at least 15 characters. A few words together make a password you can remember."; statuses "Creating your account…", "Checking the code…", "Sending a new code…", "We sent a new code to {email}.", "We sent another code to {email}."; code step sentence "We sent a 6-digit code to {email}. Enter it below to finish creating your account."; buttons "Create account", "Verify email", "Send a new code", "Use a different email address"; done "Your account is ready", "The account for {email} is ready to use.", "Continue". The number 15 in the rules and the error follows the effective minimum.

**The stubs.** `createAccount` waits 800 ms and returns `{ ok: true }`. `verifyCode` waits 800 ms and returns `{ ok: true }` for `"123456"`, otherwise `{ ok: false, errors: { code: <the wrong-code message> } }`. `resendCode` waits 400 ms. Every stub carries decision 6's comment.

**States and views.** Each view sets its page file's `<title>`, with "Error: " where a summary shows.

| View | Shows | By |
|---|---|---|
| `/view/sign-up/` | ready | the page file |
| `/view/sign-up/errors/` | email `ada@` and an 8-character password after a submit: summary with 2 links; consent with both links, to `/` | `email`, `password`, `errors`, `termsHref`, `privacyHref` |
| `/view/sign-up/verify/` | the code step for `ada@example.com` | `SignUpVerify` |
| `/view/sign-up/code-error/` | the wrong-code error: summary with 1 link | `code`, `errors` |

The `done` step has no view; the browser test reaches it (decision 20).

**Accessibility contract.** As `sign-in`'s, plus: the rules are wired to the password by `aria-describedby` and shown before it; `new-password` and `email`; no `maxlength`; the code input accepts paste and `one-time-code` (SC 3.3.8); the email is shown again on the code step (SC 3.3.7); focus moves to each new step's `h1`; every resend is announced.

**Responsive.** As `sign-in`'s, frame and rings included; the code cells are 32 px below `sm`.

**Keyboard fixtures:** ready 4 stops (input "Email address", input "Create a password", button "Show password", button "Create account"); errors 8 (link "Enter an email address like name@example.com", link "Use at least 15 characters for your password", the 4, link "terms of service", link "privacy notice"); verify 4 (input "Verification code", button "Verify email", button "Send a new code", button "Use a different email address"); code-error 5 (link "That code is not right. Check the email, or send a new code.", then the 4).

### 13. `page-states`, and SvelteKit's error route

**Structure** (the `003` calls): one family. An optional monochrome icon, a heading, one or two sentences on what happened and what to do, one primary action, at most one link. Left-aligned on a full page, centred in a tile. Plain and warm words, no humour, no apology, no "404" in the copy and no red. The loading state is a static skeleton on `muted` with `aria-busy` and a polite status. A spinner only on the control that started an action. An error page may show a reference in mono inside `<details>`, never a stack trace. And (the review calls): only a 404 says "Page not found"; another 4xx says the page cannot be shown and names the status in mono; the error page says what happened and what to do, and never whose fault it was.

**Files.**

- `blocks/page-states/+page.svelte` (route `/page-states`): an `h1` "Projects" and a tile holding the empty state.
- `blocks/page-states/+error.svelte` (lands at `src/routes/page-states/+error.svelte`): renders `PageStatesError` with `page.status` from `$app/state`, and sets the `<title>`.
- `components/page-states-message.svelte`: the family's one shape.
- `components/page-states-error.svelte`: not found, cannot be shown, or did not load, by status.
- `components/page-states-loading.svelte`: the skeleton, `aria-busy` and the status.

**Composes.** `Empty` (`Root`, `Header`, `Media`, `Title` with `level`, `Description`, `Content`); `Button`; `Skeleton`; `Status`; `FolderSimple` in the page.

`PageStatesMessage` props: `title: string`, `description: string`, `level?: 1 | … | 6` (default 1), `align?: "start" | "center"` (default `"start"`), `icon?: Snippet`, `action?: Snippet`, `link?: Snippet`, `status?: number`, `reference?: string`, `class`.

- It composes `Empty`. With `align="start"` it overrides `Empty`'s centring through `cn` (`items-start text-left p-0`, and `EmptyHeader` `items-start max-w-prose`).
- With `status`, it adds a mono line under the description: `<p class="font-mono text-xs text-muted-foreground">status <code>{status}</code></p>` (the design book §04: mono furniture is lowercase).
- With `reference`, it adds `<details>` (closed) whose `<summary>` reads "Technical details", holding "Reference" and the value in `<code>` (`font-mono`). The `<summary>` is `inline-flex min-h-6 items-center`, so it is a 24 px target (`002` R21; review finding 9).

`PageStatesError` props: `status: number`, `reference?: string`, `homeHref?: string` (default `/`), `level?` (default 1).

- **404: the not-found copy. Any other status below 500: the cannot-be-shown copy, with the status. 500 and above: the did-not-load copy.** (The review calls.) A 401, 403, 410 or 429 is not a missing page, so it does not say one; naming the status in mono gives the precise fact without putting a code in the words. An app with a specific message for one status passes its own.

`PageStatesLoading` props: `loading: boolean`, `label?: string` (default "Loading"), `rows?: number` (default 3), `children: Snippet` (the loaded content), `class`.

- It renders a `<div data-slot="page-states-loading">` with `aria-busy="true"` while `loading`. Inside, while loading, `rows` skeleton rows, each a `Skeleton` `h-6 w-1/2` over a `Skeleton` `h-4 w-1/3`, `gap-6` apart; otherwise `children`. The skeletons are `aria-hidden` (`002` decision 19) and static (the split decision: no shimmer). No control sits inside it (Geist, patterns memo §6.1).
- A hidden `Status` beside it says `label` while loading. **Its text is set after mount**, not in the first render: the region renders empty, and an `onMount` flag lets the text appear on the next update. When loading ends, the text clears.
- **The precondition** (review finding 10), stated in the component's comment and on its item page's accessibility list: mount `PageStatesLoading` before loading starts and drive `loading`, rather than mounting it at the moment loading begins. On a full page load, the text appears after hydration, well after the region exists. On a client-side mount, region and text are one tick apart, and that one tick is enough is not shown (INFERRED; patterns memo §0.1: "include them in the initial markup"). No screen reader has been run to hear it (decision 25).

**What each state shows.**

| State | Where | Icon | Heading | Sentences | Action | Link |
|---|---|---|---|---|---|---|
| empty | in a tile, centred, `h2` | `FolderSimple` | No projects yet | When you create a project, it appears here. | button "Create a project" | none |
| loading | in a tile | none | (the page's `h1`) | status "Loading projects" | none | none |
| not found (404) | full page, left, `h1` | none | Page not found | The address may have a typo, or the page may have moved. Check the address, or start again from the home page. | link-button "Go to the home page" → `/` | none |
| cannot be shown (other below 500) | full page, left, `h1` | none | This page cannot be shown | Check the address, or start again from the home page. Then the mono line "status 403". | link-button "Go to the home page" → `/` | none |
| did not load (500 and above) | full page, left, `h1` | none | This page did not load | Try again in a moment. With a reference: If it keeps happening, include the reference below when you report it. | button "Try again" (reloads the page) | "Go to the home page" → `/` |

- **No red** (GOV.UK, patterns memo §6.1; the `003` calls): every text is `foreground` or `muted-foreground`.
- **No fault, no codes in the words**, no "Sorry", no "Oops", no "Something went wrong" (GOV.UK, Geist; the design book §07 "never apologize vaguely"; the review calls). A client-side load that fails offline also renders the did-not-load copy, which is why it names no cause (review finding 7). Warmth is in plain, specific words (patterns memo §6.3).
- The did-not-load copy does not say whether work was saved, though GOV.UK asks it to: a generic page cannot know. An app that can say so passes its own description.
- **The empty state's button does nothing in the shipped page.** It shows where the app's one action goes. The tile is the page's own markup: `rounded border border-border bg-card p-6 sm:p-12`.
- **The `<title>`s:** "Page not found", "This page cannot be shown", "This page did not load", "Projects". Each view sets the title of the state it shows.

**SvelteKit, the 404, and what the preview proves.**

- **In an app,** `+error.svelte` lands at `src/routes/page-states/+error.svelte` (decision 3), where it handles only errors thrown by `/page-states` itself. An unmatched URL, even one under `/page-states/`, renders the **root** error page (READ by the review: `runtime/server/page/respond_with_error.js:37-75`). To serve every not-found and error page with this design, the app moves the file to `src/routes/+error.svelte`. SvelteKit then renders it with the response's status (patterns memo §6.2).
- **In our preview app,** `src/routes/+error.svelte` renders the block's `+error.svelte` inside a `<main>`. It is not prerendered.
- **What the preview proves.** `bun run preview` serves the production build through SvelteKit's preview server. It serves prerendered pages and static files first, and passes every other request to the server build's `respond` (READ, `node_modules/@sveltejs/kit/src/exports/vite/preview/index.js` lines 125 to 216, SvelteKit 3.1.0), which renders the root layout and the root error page for an unmatched path (READ by the review, `respond_with_error.js:37-75`). So `GET /no-such-page/` answers **404** with the not-found design, rendered by the real error route. The browser test checks the status and the page (decision 20).
- **The views.** `/view/page-states/not-found/`, `/view/page-states/cannot-show/` and `/view/page-states/error/` are ordinary prerendered pages that render `PageStatesError` with statuses 404, 403 and 500. They answer 200. They exist so the viewer, axe and the reflow test can see each design at three widths.
- **What the preview cannot prove:** the status a deployed static host sends. `adapter-static` writes no `404.html` unless given `fallback`, and Cloudflare serves the nearest `404.html` with status 404 only with `not_found_handling = "404-page"` (patterns memo §6.2). This repository sets neither: it has no deployment (`decisions.md`, "The registry is served from GitHub, and the repository is public"). An app that deploys sets them for itself.
- **Focus.** The error pages move no focus. On a full load the page is read from the top. On a client-side navigation, SvelteKit resets focus and announces the new `<title>` itself (INFERRED from SvelteKit's accessibility documentation, not read for this specification). *Why not Geist's "move focus to Try again":* a second focus move would fight SvelteKit's own.
- **The loading state is a component, not a `+loading` file.** SvelteKit has no loading route file; an app shows `PageStatesLoading` while its own data loads. No spinner: the skeleton is the progress, and a spinner belongs only on the control that started an action (the `003` calls).

**Views.**

| View | Shows |
|---|---|
| `/view/page-states/` | the page file: "Projects" with the empty tile |
| `/view/page-states/loading/` | "Projects" with the tile loading, `loading={true}`, label "Loading projects" |
| `/view/page-states/error/` | `PageStatesError status={500} reference="b7e2c41"` |
| `/view/page-states/not-found/` | `PageStatesError status={404}` |
| `/view/page-states/cannot-show/` | `PageStatesError status={403}` |

**Accessibility contract.** One `h1` per page (SC 1.3.1); the empty state in the tile is an `h2`. State never by colour (the design book; no colour used at all). Loading: `aria-busy` on the region, skeletons hidden, a polite status, with its mount precondition (MDN `aria-busy`, SC 4.1.3, patterns memo §6.2). `<details>` is native, so its summary is a keyboard stop with its own expanded state, 24 px tall. Targets 48 px (`002` R21). Reflow: one column at every width.

**Responsive.** One column at every width (patterns memo §6.4). Full-page states align with the page's left edge, the text capped at `max-w-prose`, within `mx-auto max-w-5xl px-6 py-16 sm:py-24`. The tile's padding steps from 24 px to 48 px at `sm`.

**Keyboard fixtures:** empty 1 stop (button "Create a project"); loading 0 (and none inside the region); error 3 (button "Try again", link "Go to the home page", the summary "Technical details"); not found 1 (link "Go to the home page"); cannot be shown 1 (link "Go to the home page").

### 14. `settings`

**Structure** (the `003` calls): one save button at the bottom, not a sticky bar. Sections divided by grooves, each a `fieldset` with a legend and one line of description. One column at every width. "Saved" as an inline `success` message in a polite status region, not a toast. A destructive section last, confirmed by the alert dialog. A `beforeunload` warning when there are unsaved changes. No switch that saves at once inside a form that saves on submit, so the form has no switches.

**Files.** `blocks/settings/+page.svelte`; `components/settings-form.svelte`; `components/settings-delete.svelte`.

**Composes.** `FieldSet`, `FieldLegend`, `Field`, `FieldGroup`; `Input`; `NativeSelect`; `Checkbox`; `RadioGroup` (`Root`, `Item`); `Button`; `ErrorSummary` and `titleFor`; `AlertDialog` (in `settings-delete`); `Status`.

`SettingsForm` props:

```ts
type SettingsValues = {
  name: string; email: string; timeZone: string;
  notifyFailures: boolean; notifySummary: boolean;
  theme: "system" | "light" | "dark";
};
{
  values: SettingsValues;            // what is saved when the form mounts
  draft?: SettingsValues;            // the fields' starting values; default `values`
  onsave: (values: SettingsValues) => Promise<Result<"name" | "email">>;
  errors?: Partial<Record<"name" | "email", string>>; formError?: string; busy?: boolean; // bindable
  saved?: boolean;                   // bindable: shows "Saved"
  dirty?: boolean;                   // bindable, read-only to the app: the fields differ from the saved copy
  timeZones?: { value: string; label: string }[];
  idPrefix?: string;                 // default "settings"
  class?: string;
}
```

- **The saved copy is private.** The component copies `values` into its own state at mount, and replaces that copy after each successful save. `dirty` compares the fields with it. *Why:* `values` is not bindable, so the component cannot write it back (review finding 9).

`SettingsDelete` props: `ondelete: () => Promise<void>`, `level?` (default 2), `class`.

**The sections**, each a `FieldSet` whose `FieldLegend` holds an `h2` (`font-heading text-2xl font-bold tracking-section`), with the section's line as the set's `description`:

1. **Profile.** "How you appear to people you work with." Name (`id` `settings-name`, `autocomplete="name"`); Email address (`id` `settings-email`, `type="email"`, `autocomplete="email"`, description "Notices about your account go here."); Time zone (`NativeSelect`, `id` `settings-time-zone`, description "Dates and times show in this zone.", options Coordinated Universal Time, London, New York, Tokyo, with IANA values).
2. **Email notifications.** "Choose what we email you about." Two `Checkbox`es, each in its own horizontal `Field`: "When a run fails", "A weekly summary". (`002`'s rule: a checkbox takes its own `Field`'s ids, never the set's.)
3. **Theme.** "The colour scheme for this device." A `RadioGroup` named by the set's legend (`002` Landing note 4): "Match the system", "Light", "Dark". The page's stub comment says the app applies the chosen theme; the block only stores the value.

- **The section's line sits under its legend.** `FieldSet` renders its description after its children (READ by the review, `field-set.svelte`), so each set takes `*:data-[slot=field-description]:order-first`, with the set laid out as a flex column; a fieldset's rendered legend is not a flex item, so it stays first. The line is wired to the `<fieldset>` by `aria-describedby` either way (`002` decision 11).
- *Why the legend holds an `h2`:* a legend names the group, but screen reader users who move by heading would skip it. HTML allows heading content in a `legend`, so each section is both a named group and a heading (W3C headings tutorial, patterns memo §1.2; INFERRED for the content model).
- Sections are `gap-12` apart; every section after the first is `groove pt-12`.
- Then the actions row, `flex flex-col gap-3 sm:flex-row sm:items-center`: "Save changes" (primary, busy while saving, `w-full sm:w-auto`), "Discard changes" (secondary, shown only while `dirty`), then a visible `Status` (`text-sm`, and `text-success` while it says "Saved").
- *Why "Discard" only while dirty:* with nothing to discard it would be a button that does nothing.
- **After a discard, focus moves to the first field, Name, and the status says "Changes discarded."** (review finding 5). Discarding makes the form pristine, so the focused button unmounts; without a move, focus would fall to `<body>`. *Why the first field:* the reader starts again from the top of what they just reset, and the status says what happened.
- *Why Save is never disabled:* `002`'s busy rule, and Primer and Atlassian (patterns memo §7.1). Saving with no changes saves the same values and says "Saved".

**Saving.** On submit: validate (name required; email as `sign-in`). With errors, the summary (decision 7). Otherwise `busy`, the status "Saving…", then the callback. On `ok`, the saved copy takes the saved values, `dirty` becomes false, `saved` true, and the status says "Saved". The first change after that clears `saved` and the status.

- "Saved" is announced because the region already said "Saving…" (decision 8). It stays until the next change, and does not animate (the design book §06).
- **`beforeunload`:** while `dirty`, the component's `<svelte:window onbeforeunload>` calls `preventDefault()` and sets `returnValue = ""`, so the browser asks before the page unloads; browsers fix the wording (patterns memo §7.1, Primer). Client-side navigation inside an app is the app shell's to guard (`006`); the shipped page has no in-app links.

**The destructive section**, after the form, separated by a groove: an `h2` "Delete your account", a sentence, and `Button variant="destructive"` "Delete account", which opens an `AlertDialog`. `002`'s dialog starts on Cancel (`002` decision 17). Confirming closes the dialog, calls `ondelete`, and a visible `Status` below the button says the request was made. *Why a confirm:* deleting user data needs a way to review and confirm (SC 3.3.4, patterns memo §7.2). *Why outside the `<form>`:* it is not a setting saved by "Save changes" (patterns memo §7.1, Primer: do not mix saving models).

**Copy.**

| Part | Text |
|---|---|
| `<title>`, `h1` | Settings ("Error: Settings" while a summary shows) |
| page sentence | Your changes apply when you save them. |
| errors | Enter your name · Enter your email address · Enter an email address like name@example.com |
| buttons | Save changes · Discard changes · Delete account |
| statuses | Saving… · Saved · Changes discarded. |
| delete section | **Delete your account.** This removes your projects, runs and settings for good. It cannot be undone. |
| dialog | title "Delete your account?"; description "Your projects, runs and settings will be removed for good. You cannot undo this."; Cancel "Keep my account"; Action "Delete account" (destructive) |
| after confirming | Account deletion requested. |

- The after-confirming line states only what the block did: it called `ondelete`, and the call resolved. What happens next, and whether the person hears about it, is the app's; the stub's comment says to replace the line with the app's own (the review calls: no promises).

**The stubs.** `saveSettings` waits 800 ms and returns `{ ok: true }`. `deleteAccount` resolves at once. The page's starting values: name "Ada Lovelace", email "ada@example.com", time zone `Europe/London`, failures on, summary off, theme `system`.

**States and views.** Each view sets the title "Settings", with "Error: " where a summary shows.

| View | Shows | By |
|---|---|---|
| `/view/settings/` | pristine | the page file |
| `/view/settings/errors/` | name empty and email `ada@` after a submit: summary with 2 links, "Discard changes" shown | `draft`, `errors` |
| `/view/settings/saved/` | pristine, the status "Saved" | `saved` |

Dirty, saving, discarding and the open dialog are reached by the browser test on the default view (decision 20). *Why no view with the dialog open:* a dialog that opens on load moves focus into the iframe and away from the item page's controls.

**Accessibility contract.** One `h1` (the page's); each section a named group and an `h2`. Visible labels; `autocomplete` `name` and `email` (SC 1.3.5). Current values shown, not asked again (SC 3.3.7). Errors as decision 7. "Saved" announced politely, never by colour alone: the word says it (SC 4.1.3; the design book). Focus kept after a discard. The delete confirmed in a dialog that starts on the safe choice (SC 3.3.4; `002` decision 17). Nothing sticky, so no focus is hidden under a bar (SC 2.4.11). Targets 48 px; checkboxes and radios 24 px (`002` R21).

**Responsive.** One column at every width (the `003` calls), `mx-auto max-w-2xl px-6 py-16`: the column is 672 px at most, near GOV.UK's two-thirds column (patterns memo §7.4). Below `sm` the buttons are full width, Save first.

**Keyboard fixtures:** pristine 8 stops (input "Name", input "Email address", select "Time zone", checkbox "When a run fails", checkbox "A weekly summary", radio "Match the system", button "Save changes", button "Delete account"); errors 11 (link "Enter your name", link "Enter an email address like name@example.com", the 6 controls, button "Save changes", button "Discard changes", button "Delete account"); saved 8.

### 15. The copy, and the voice

The `003` calls: "Plain and warm words, no humour, no apology". The review calls: "Shipped copy promises nothing the block cannot keep." Every string a block ships is written in decisions 9 to 14. The rules they follow, for review:

- **Sentence case** for headings, labels and buttons (the split decision). Mono furniture, the eyebrow and the status line, is lowercase (the design book §04).
- **Buttons and links name their result:** "Sign in", "Create account", "Save changes", "Go to the home page", never "Submit", "OK" or "Get started" (patterns memo §2.1 and §6.1).
- **Errors say what to do,** in GOV.UK's form: "Enter your email address", "Use at least 15 characters for your password" (SC 3.3.3).
- **No promise the block cannot keep:** no statement of an app's email policy, no "signed in as", no conformance claim such as "meets WCAG", no fault ("on our side"), no promise of time or of an email to come. A sentence that states the app's policy belongs to the app.
- **No apology, no humour, no codes in the words:** no "Sorry", "Oops", "Whoops" or "Something went wrong" in any block or `error-summary` file. A status code appears only as the cannot-be-shown state's mono line (decision 13). `blocks.test.ts` counts the words in the source; `blocks.spec.ts` counts the codes in the rendered text (decision 20).
- **Example data** uses `example.com` and the name Ada Lovelace.
- **The copy passes the lint.** The lint reads every word of an item file as a possible class (`002` Landing note 6), and block page files are item files. EXECUTED by this author on 2026-10-28, Bun 1.3.14: every string in the first draft's decisions 9 to 13 linted with `lintText` from `scripts/lint-literals.ts` and the repository's rules gave 0 violations, and the review re-ran 102 strings with 0 (EXECUTED by the review). The strings this amendment adds or rewrites were linted the same way before it was written (EXECUTED, 0 violations).

### 16. The preview routes: two layout groups and a route per view

- **The site moves into a `(site)` group; views get a `(view)` group.** A SvelteKit *layout group* is a folder in parentheses: it shares a layout without adding to the URL. So:
  - `src/routes/+layout.svelte` (root): imports `../app.css` and renders its children. No chrome.
  - `src/routes/+layout.ts` stays: `prerender = true`, `trailingSlash = "always"` (`001` decision 3).
  - `src/routes/(site)/+layout.svelte`: `001`'s header (the lockup, the theme toggle) and `<main class="mx-auto max-w-5xl px-6 py-12">`.
  - `src/routes/(site)/+page.svelte`, `+page.server.ts`, and `items/` move here unchanged. URLs do not change.
  - `src/routes/(view)/+layout.svelte`: `<main class="min-h-svh">` around its children, and nothing else. The `main` gains the attribute `data-view-ready` after mount, so tests know the page has hydrated, as the theme toggle's `data-ready` does on site pages.
  - `src/routes/+error.svelte` (root): the block's error page in a `<main>` (decision 13).
- *Why groups:* the root layout wraps every page, so a chrome-less page needs a root layout with no chrome. Moving the site's chrome one level down is the only way that leaves every URL as it is. A layout that checked the route to hide its header would hide chrome by condition, which a reader of the view cannot see.
- *Why the view supplies `<main>` and the block does not:* in an app, `<main>` belongs to the layout, and `006`'s shell will render it (patterns memo §1.1, §8.1). A block that rendered its own would nest a second `main` inside the shell's. The view's bare `<main>` is what an app's layout gives a page.
- **The theme reaches a view on first paint** through `001`'s head script in `src/app.html`, which every page runs: the stored `pluto-preview-theme`, else `prefers-color-scheme`. "Open alone" therefore opens in the reader's theme.
- **One static route per view.** `src/routes/(view)/view/<block>/+page.svelte` renders the page file; `src/routes/(view)/view/<block>/<state>/+page.svelte` composes the block's components with the props decisions 10 to 14 list, inside the same wrapper markup as the page file, and **sets the `<title>` that the page file would show in that state**, with "Error: " where a summary shows (review finding 9). 17 route files. *Why static routes, not one `[block]/[[state]]` route:* each is a few typed lines with no dynamic import and no matcher, and `prerender = true` prerenders every static route without an `entries` list.
- **A link that leaves a view navigates the frame.** The hero's "Browse the components" opens the catalogue, with its chrome, inside the iframe. The views are preview code, but the link is in the page file, which must stay as an app gets it. "Open alone" is the way out; the item page notes it.
- **The views list** is `src/lib/preview/blocks.ts`, read by the viewer and the tests:
  ```ts
  export type BlockView = { path: string; label: string };
  export const BLOCK_VIEWS: Record<string, BlockView[]>; // in registry order
  ```
  `path` is `""` for the page file. Labels: hero "Default"; sign-in "Ready", "Field errors", "Wrong credentials", "Signing in"; sign-up "Ready", "Field errors", "Code step", "Wrong code"; page-states "Empty", "Loading", "Error", "Not found", "Cannot be shown"; settings "Ready", "Field errors", "Saved". It imports nothing, so `bun test` and Playwright can import it. `blocks.test.ts` checks that it and the route files agree (decision 20).
- **Pages.** 40 site pages (the catalogue and 39 item pages) and 17 views: **57 prerendered pages**.
- **This amends two of `001`'s decisions:** decision 5's layout (`src/routes/` gains the two groups and the root error page) and decision 24's "no scroll containers" (decision 17's frame is a second exception, after `002`'s table).

### 17. The viewer on a block's item page

A block's item page (`src/routes/(site)/items/<block>/+page.svelte`) has four sections: the header (`002`'s `ItemHeader`: eyebrow `registry:block · <name>`, `h1`, description, install command, and decision 3's note on `-o` beside it); **Preview**; **Accessibility** (the block's contract as a short list); **Code**. The viewer is `src/lib/preview/block-viewer.svelte`, a preview component, never an item.

**The toolbar,** `flex flex-wrap gap-2`, so it wraps at 320 px (review finding 9), in this order:

1. **State** (only for a block with more than one view): `role="group" aria-label="State"`, a `<button type="button">` per view with `aria-pressed`, labelled from `BLOCK_VIEWS`. Pressing one sets the iframe's `src` to that view.
2. **Width:** `role="group" aria-label="Width"`, buttons "360 px", "768 px", "1280 px" with `aria-pressed`. The default is 360.
3. **"Open alone":** an `<a>` to the current view's path, in the same tab. *Why the same tab:* a new tab is a change of context the reader did not ask for, and the back button returns.

- *Why plain buttons with `aria-pressed`, not a `radiogroup` or a toggle group:* `toggle-group` is `004`'s, and a `radiogroup` needs roving focus that plain buttons do not. Each button is a stop and says its state.
- *Why 360 by default:* the narrowest preset is where reflow fails first, and it fits fully on every screen wider than 408 px.

**The frame.** A `<div role="region" aria-label="Preview frame" tabindex="0" class="overflow-x-auto">` holds the `<iframe>`.

- The iframe is `w-90`, `w-192` or `w-320` (360, 768 or 1280 px, Tailwind multipliers, no arbitrary values) and `h-180` (720 px), with `title="<Block title> preview"` and `src="/view/<block>/<state>/"`.
- *Why an iframe:* the block gets its own document, so its media queries and `min-h-svh` see the iframe's width, not the item page's (blocks memo §3, INFERRED there).
- *Why a scroll region:* the site's content column is at most 976 px, so a 1280 px frame cannot fit. The region scrolls it sideways inside itself, and the page never scrolls. `tabindex="0"` and a name make the region reachable and named by keyboard (`001` decision 24's reason: Chromium makes a scroller focusable, and axe's `scrollable-region-focusable` applies). *Why not scale the frame down:* a CSS transform shrinks text and targets below their real size; the preview's job is real size.
- *Why a fixed 720 px height:* a window of a stated size is honest, and the block scrolls inside it as it would in a browser. Measuring each document's height would need a script per state for nothing a reader needs.
- **No drag handle.** *Why:* the three presets are the widths the tests check; a handle would show untested widths and needs a keyboard equivalent (SC 2.1.1). "Open alone" gives any width by resizing the window.

**The theme.** The site's header toggle is the one light and dark switch, and the iframe follows it.

- **Mechanism: the viewer copies the parent's `dark` class onto the iframe's `<html>`**: when the viewer mounts, if the iframe's `contentDocument.readyState` is already `"complete"`; on the iframe's `load` event; and on every change, watched with a `MutationObserver` on the parent's `<html>` `class` attribute. The iframe is same-origin, so `iframe.contentDocument` is reachable. *Why on mount too:* the prerendered iframe can finish loading before the viewer hydrates and attaches its `load` handler (review finding 13).
- *Why this, not the three alternatives:*
  - A query string (`?theme=dark`) reloads the iframe on every switch, losing its state.
  - `postMessage` is a protocol and a listener inside the view for what same-origin access does directly; it earns its cost only across origins.
  - The shared `localStorage` key with a `storage` event fails silently when storage is unavailable, a case `001`'s toggle already tolerates, and adds a listener to every view.
  - Copying the class needs no code inside the view at all, so `/view/<block>/` holds nothing an app's page would not.
- First paint inside the iframe already matches, through the head script (decision 16). The copy corrects the rare case where storage is unavailable and the reader has switched.

**The code view.** The **Code** section shows the install command (`InstallCommand`) with the note on `-o`, and then each file of the **built** item, the exact text `add` writes (blocks memo §3, INFERRED there; §5).

- **Source:** `src/routes/(site)/items/<block>/+page.server.ts` reads `static/r/styles/maia/<block>.json` at prerender, through `src/lib/server/built-item.ts`. `bun run build` builds the registry before `vite build`, and `vite dev` builds it at start (`001` decisions 18 and 23), so the file always exists. `src/lib/server/` is server-only to SvelteKit, so `node:fs` never reaches the browser.
- **App paths and imports:** `built-item.ts` exports a pure function that maps each file to its app path and its text. A `registry:page` target becomes `src/routes/<target>`; a `registry:component` target becomes `src/lib/components/<target>`. The placeholders become scratch app A's aliases: `$COMPONENTS$` → `#lib/components`, `$UI$` → `#lib/components/ui`, `$UTILS$` → `#lib/utils`, `$HOOKS$` → `#lib/hooks`, `$LIB$` → `#lib`. A line above the files says so.
- **Each file is a `<details>`,** closed, whose `<summary>` shows the app path in `<code>`. Its body is `<pre><code>` in `font-mono text-xs` on `bg-muted` (an inset, `001` decision 8), wrapped with `whitespace-pre-wrap wrap-anywhere`. *Why wrap, not scroll:* no scroll container (`001` decision 24). *Why `<details>`:* a settings form is hundreds of lines; closed files let a reader pick one.
- No syntax highlighting: that is `004`'s palette.

**The viewer's own accessibility.** Every control is a native button, link, `summary` or the named region. The iframe has a `title`. Pressed states are `aria-pressed`. The toolbar's stops are tested in order (decision 20); the order of stops inside the iframe is tested on the views themselves, not through the frame.

### 18. The catalogue lists blocks as a sixth group

- `GROUPS` in `src/routes/(site)/+page.server.ts` gains `["blocks", "Blocks"]`, after `forms`. Block cards are the same card: type `registry:block`, title linked to `/items/<block>/`, description, install command.
- *Why a group, not a separate section:* the catalogue already groups by `meta.group` with one `h2` per group (`002` decision 22). A sixth group is one line, and keeps one loop, one card and one Tab order. A separate section would repeat the same layout.
- The catalogue then has **41 keyboard stops**: the lockup, the toggle and 39 item links.

### 19. What the lint learns: nothing new

- **No new rule, no new allowlist.** Block and component files are already item files, read from `registry.json` (`itemFiles()` in `scripts/lint-literals.ts`), so the lint checks all of them, page files and their copy included. Every class planned here is a token class or on the ladder: `min-h-svh`, `max-w-sm`, `max-w-prose`, `max-w-2xl`, `text-2xl sm:text-5xl`, `size-6`, `max-sm:size-8`, `min-h-6`, `max-sm:border-0`, `max-sm:overflow-visible`, `order-first`. No new item needs `rounded-full`, `focus-ring` or `focus-ring-none`.
- **Prose and the lint.** The lint splits text on whitespace and markup punctuation and reads each token as a class (`002` Landing note 6). EXECUTED by this author on 2026-10-28: the bare words `ring`, `outline` and `shadow`, and `font-size`, `leading-edge` and `fade-in`, are each flagged; `top-level` and `end-to-end` are not. *The rule for block copy:* avoid those words and any hyphenated word that begins with a utility name (`font-`, `leading-`, `p-`, `size-`, `ring-`, `shadow-`, `fade-`, `slide-`, `scale-`). Hero feature 3 says "focus style", not "focus outline", for this reason: the bare word `outline` is flagged wherever it stands.
- *Why not teach the lint to skip text in markup:* most block copy lives in script strings (messages, defaults), which a markup-only skip would still read. The rule costs a reworded sentence when it bites; a Svelte parser in the lint costs more and helps less.
- **Three good samples are added** to `literals.test.ts`, each a block string linted as a class: "Enter an email address like name@example.com", "That code is not right. Check the email, or send a new code.", "Go to the home page". So: 64 bad flagged (`002`'s landed count), 0 of 42 good.

### 20. The tests

`002`'s pattern, extended. Each check is written first and seen failing (constitution §5). `001` decision 25's rules hold: `bun test` for unit and smoke, Playwright for the browser, `--bun` wherever a tool starts.

**Unit tests**: 9 files in `tests/unit/`.

1. `tokens.test.ts`, `contrast.test.ts`, `generated.test.ts`, `deps.test.ts`, `utils.test.ts`: unchanged. No token, package or merge path changes.
2. `registry.test.ts`:
   - 39 items, in decision 5's order, with their types (1 theme, 3 font, 1 lib, 29 ui, 5 block); 39 of 39 with `meta.group` among 6; 0 dependencies with `local:` or a scheme; 24 of 24 distinct registry dependency names name an item here; 29 of 29 `registry:ui` items have at least 2 files.
   - 26 of 26 `002` items keep `meta.since` `"0.2.0"` and `meta.stock`; 7 of 7 new items have `meta.since` `"0.3.0"` and no `meta.stock`, and their `title`s equal decision 5's table.
   - Built into a temporary folder: 40 files under `r/styles/maia/` and 40 byte-identical under `v0.3.0/r/styles/maia/`; 0 of 2 stale files survive; 39 of 39 parse with `registryItemSchema`; 0 contain `#lib`; every target of the 29 `registry:ui` items starts `<name>/`; 6 of 6 page files carry no `target` in `registry.json` and build to `<block>/<base name>`; 0 built targets begin `~/` or `src/`; 10 of 10 component targets are their bare base names, each starting `<block>-`; 8 of 8 `tailwind-variants` items unchanged; 0 of 40 built files contain `$UTILS$.js` or `/index.js"`.
   - Built: 2 of 2 icon-importing new items (`error-summary`, `page-states`) name `phosphor-svelte@^3.1.1`; `status`, `hero`, `sign-in`, `sign-up` and `settings` name no package.
   - `wrangler.jsonc`: `001`'s 3 assertions.
   - `CHANGELOG.md`: decision 22's checks.
3. `previews.test.ts`: 39 of 39 items have `src/routes/(site)/items/<name>/+page.svelte`.
4. `literals.test.ts`: the item files are the 153 of decision 5; 0 violations; 64 of 64 bad samples flagged; 0 of 42 good.
5. `blocks.test.ts` (new), over `registry.json`, the block and `error-summary` source files and a registry built into a temporary folder:
   1. **Dependencies suffice.** For 5 of 5 blocks: every `$UI$/<name>` import in its built files names an item in its own `registryDependencies`, and every `$COMPONENTS$/<file>` import names a file of the same block. *Why this, not one `add` per block in the smoke test:* it proves each block installs alone, statically, without ten more scratch installs.
   2. **No block uses another:** 0 imports of `#lib/registry/blocks`; 0 `$COMPONENTS$/` imports of another block's file; 0 `registry:block` names among any block's dependencies.
   3. **No unshipped file:** 0 `<img` and 0 string literals ending in an image, font or icon extension (`svg`, `png`, `jpg`, `jpeg`, `webp`, `gif`, `avif`, `ico`, `woff`, `woff2`) across the 16 block files.
   4. **The link rule:** every quoted string that begins with `/` in the 16 block files is exactly `"/"`: 0 others.
   5. **The naming rule:** 10 of 10 component files are `src/lib/registry/components/<block>-*.svelte`; 6 of 6 page files are `src/lib/registry/blocks/<block>/<file>`; 0 base names repeated across all component files.
   6. **The lint over the blocks:** 16 of 16 block files with 0 violations.
   7. **The voice, in the source** (review finding 3): 0 matches of `/\b(sorry|oops|whoops|something went wrong|on our side|signed in as|meets wcag)\b/i` in the 16 block files and the 2 `error-summary` files. Status codes are not searched here: `page-states-error.svelte` must compare `status` with 404 and 500. They are counted in the rendered text instead (`blocks.spec.ts` check 20).
   8. **The views:** `BLOCK_VIEWS` lists the 5 blocks in registry order with 17 views; 17 of 17 have their route file under `src/routes/(view)/view/`; 0 other `+page.svelte` files there.
   9. **The code view's mapping:** `built-item.ts`'s function maps 16 of 16 block files to `src/routes/<block>/<file>` or `src/lib/components/<file>`, and leaves 0 placeholders.
   10. **The password floor:** `sign-up-form.svelte` holds `Math.max(15,` and no `maxlength`.

**Browser tests**: 8 files in `tests/e2e/`, in the `light` and `dark` projects. `pages.ts` gains the 39-item `ITEMS`, `VIEWS` (read from `BLOCK_VIEWS`), `NEW_PAGES` (the 7 new item pages) and `openView(page, path)`, which waits for `main[data-view-ready]`. Widths are set with `page.setViewportSize({ width, height: 900 })`.

1. `axe.spec.ts`, the tags of `001` decision 25:
   - the catalogue and `002`'s 32 item pages, at 1280: 33 pages × 2 themes = 66;
   - the 7 new item pages at 360, 768 and 1280: 42;
   - the 17 views at 360, 768 and 1280: 102;
   - the `alert-dialog` page with its dialog open: 2; `/view/settings/` with the delete dialog open: 2.
   - **214 scans, 0 violations.**
2. `theme.spec.ts`: `001`'s two checks on the 40 site pages and the 17 views, in 2 themes: **114**.
3. `four-dot.spec.ts`, `tokens.spec.ts`: unchanged.
4. `keyboard.spec.ts`, in both themes:
   - **The catalogue:** 41 stops in order (the lockup, the toggle, the 39 item links in decision 5's order), each with the ring; no 42nd.
   - **Item fixtures:** `002`'s 15 items (34 stops), `status` (2: button "Announce", button "Clear") and `error-summary` (3: input "Project name", input "Owner email", button "Create project"): **39 stops over 17 items**.
   - **Block views:** on each view, at 1280, the test presses Tab from the top of the page and checks each stop's role, name and ring in order, then that the next Tab leaves the document. The stops are decisions 10 to 14's fixtures: hero 2; sign-in 4, 6, 5, 4; sign-up 4, 8, 4, 5; page-states 1, 0, 3, 1, 1; settings 8, 11, 8. **75 stops over 17 views.**
   - **Viewer toolbars:** on each block's item page, the test focuses the first toolbar control and Tabs through the state buttons, the 3 width buttons, "Open alone" and the frame region: hero 5, sign-in 9, sign-up 9, page-states 10, settings 8. **41 stops over 5 pages.**
   - **Behaviours:** `002`'s 9; Space on "Announce" sets the status text; Enter on "Create project" with both fields empty inserts the error summary and focuses it, and Enter on its first link focuses "Project name": **11**.
5. `primitives.spec.ts`: `002`'s checks unchanged, plus five, in each theme:
   - (S1) on the `status` page, the raw prerendered HTML holds 2 regions with `role="status"`, `aria-live="polite"`, `aria-atomic="true"` and no text;
   - (S2) "Announce" sets "Copied to the clipboard" in both, "Clear" empties both;
   - (S3) the hidden region measures 1 × 1 px with `overflow: hidden`, the visible one is wider than 1 px;
   - (E1) on the `error-summary` page, the raw prerendered HTML holds 3 specimens with `data-slot="error-summary"` and no `role`;
   - (E2) after the fixture's failed submit, the inserted summary has `role="alert"`, `tabindex="-1"`, a heading "There is a problem", and 2 links each at least 24 px tall.
6. `blocks.spec.ts` (new), in both themes, on the default views unless named:
   - **Sign in**
     1. An empty submit: focus is on the summary; it has `role="alert"`; it holds 2 links whose texts equal the 2 inline errors; 2 of 2 inputs have `aria-invalid="true"` and an `aria-describedby` that names `<id>-error`; `document.title` begins "Error: ".
     2. Enter on each of the 2 summary links focuses its field: 2 of 2.
     3. Valid values, then submit: the button has `aria-busy="true"` and keeps focus; the status says "Signing in…". Then focus is on the summary, which holds the credential sentence and 0 links; the password's value is empty; 0 inputs are `aria-invalid`; the status is empty.
     4. On `/view/sign-in/errors/`, the summary has no `role` and focus is on `<body>`. On `/view/sign-in/credentials/`, the footer link "Create an account" links to `/`.
   - **Sign up**
     5. An empty submit: the summary with 2 links has focus; Enter on each focuses its field: 2 of 2.
     6. The rules: the password's `aria-describedby` names the rules' id, and the rules' top edge is above the input's; the input has no `maxlength`; a 14-character password is refused with "Use at least 15 characters for your password", and a 15-character one is not.
     7. Valid details, then submit: busy, the status "Creating your account…", then the code step's `h1` "Check your email" has focus and its sentence holds the email.
     8. Code "000000", then "Verify email": the summary with 1 link has focus; Enter on it focuses the code's real input.
     9. "Send a new code" twice: the status reads "Sending a new code…", then "We sent a new code to ada@example.com.", then "Sending a new code…", then "We sent another code to ada@example.com.": 4 of 4 texts in order, each different from the one before.
     10. "Use a different email address": the details step, its email still filled, its `h1` focused.
     11. Code "123456": the `h1` "Your account is ready" has focus; "Continue" links to `/`. On `/view/sign-up/errors/`, the consent sentence holds 2 links to `/`; on `/view/sign-up/`, there is no consent sentence.
   - **Settings**
     12. Pristine: 0 "Discard changes" buttons; after typing in Name, 1.
     13. "Save changes": `aria-busy="true"`, focus kept, the status "Saving…"; then the status "Saved" is visible, its colour equals `--success`, and "Discard changes" is gone.
     14. `beforeunload`: dirty, `page.close({ runBeforeUnload: true })` raises 1 `beforeunload` dialog; pristine, 0.
     15. Name cleared, then "Save changes": the summary with 1 link has focus; Enter on it focuses Name.
     16. "Delete account" opens `role="alertdialog"` with focus on "Keep my account"; Escape closes it and focus returns to "Delete account"; opening it again and pressing "Delete account" closes it and the status says "Account deletion requested."
     17. Dirty, then Space on "Discard changes": the fields hold the saved values, focus is on Name, and the status says "Changes discarded."
   - **Page states**
     18. `/view/page-states/loading/`: the region has `aria-busy="true"`; its 3 skeleton rows are all `aria-hidden`; the status is empty in the raw prerendered HTML and says "Loading projects" after hydration; 0 focusable elements inside the region.
     19. `GET /no-such-page/` answers 404 with exactly one `h1`, "Page not found"; `GET /view/page-states/not-found/` answers 200 with the same `h1`.
     20. On the 17 views and the 404 page: 0 occurrences of a three-digit status number (`/\b[1-5]\d\d\b/`) in the rendered text outside `code` elements; on the five page-states views, 0 text elements whose computed colour equals `--destructive`.
     21. On the error view: the `<details>` is closed; its summary reads "Technical details" and measures at least 24 px tall; opening it shows "b7e2c41" in a `code` element.
     22. On `/view/page-states/cannot-show/`: one `h1`, "This page cannot be shown"; "403" appears once, in a `code` element inside a `font-mono` line.
   - **Hero**
     23. On `/view/hero/` at 360, 768 and 1280: the `h1` computes 28, 44 and 44 px; the feature list's `grid-template-columns` holds 1, 2 and 3 tracks; the primary call to action is as wide as its row at 360 and narrower at 768.
   - **All blocks**
     24. No loop: 0 elements compute `animation-iteration-count: infinite` outside a `data-slot="spinner"`, on the 17 views and the 7 new item pages.
     25. Reflow: at 320 × 900, `document.documentElement.scrollWidth` is at most 320 on the 17 views and the 7 new item pages: **24 of 24**.
     26. Targets: at 360, each of the 75 view stops measures at least 24 × 24 px.
     27. **Rings are not clipped** (review finding 1): at 360, on the 8 sign-in and sign-up views, each of the 40 stops is focused, and either no ancestor between it and `<main>` computes `overflow` `hidden` or `clip`, or the stop's rectangle grown by 4 px on every side fits inside that ancestor's: 40 of 40.
7. `viewer.spec.ts` (new), in both themes, on the 5 block item pages:
   1. The iframe's `title` is "<Block title> preview", its `src` is `/view/<block>/`, the "360 px" button has `aria-pressed="true"`, and the iframe measures 360 px wide: 5 of 5.
   2. "768 px" and "1280 px" move the pressed state and set the iframe's width: 10 of 10.
   3. Each state button sets the iframe's `src` to its view and "Open alone"'s `href` to the same path: 16 of 16 (the four blocks with more than one view).
   4. The iframe's `<html>` has the `dark` class exactly when the parent does: at load, after the header toggle, and after toggling back: 15 of 15.
   5. The code view has one `summary` per file whose text is its app path (3, 2, 3, 5, 3: 16 of 16); the install command reads `bunx --bun shadcn-svelte@1.7.1 add <block>`, with no `-o`, and decision 3's note sits beside it: 5 of 5.

**Smoke tests**: 4 files in `tests/smoke/`. `001`'s two and `002`'s `primitives-add.test.ts` are unchanged and still pass.

- **`blocks-add.test.ts`** (new), into each of `001`'s two scratch apps, against this repository's `vite dev`, with the locked CLI, as `primitives-add.test.ts` does:
  1. **One** `add hero sign-in sign-up page-states settings -y -o` exits 0, with the "unsupported runtime" warning. *Why `-o` here:* the scratch apps are fresh, with nothing to protect (decision 3). *Why one `add` with all five:* it is the realistic install, it lets the five share dependencies the way an app would, and a collision between two blocks' files would show as a short file count. Each block's installing alone is proved statically (unit `blocks.test.ts` check 1).
  2. 102 files land: the 16 block files at their app paths (`src/routes/<block>/+page.svelte` ×5, `src/routes/page-states/+error.svelte`, `src/lib/components/<block>-*.svelte` ×10) and 86 dependency files (`utils` 1, `button` 2, `spinner` 2, `card` 8, `field` 12, `label` 2, `separator` 2, `input` 2, `input-group` 8, `textarea` 2, `alert` 5, `error-summary` 2, `status` 2, `input-otp` 5, `empty` 7, `skeleton` 2, `native-select` 4, `checkbox` 2, `radio-group` 3, `alert-dialog` 13).
  3. 0 placeholders; imports use the app's alias; the 5 page files import their components from `<alias>/components/<block>-…`, with 0 relative imports.
  4. `package.json` holds `bits-ui` `^2.20.2`, `@internationalized/date` `^3.12.4`, `tailwind-variants` `^3.3.1`, `phosphor-svelte` `^3.1.1`, and no `tailwind-merge`.
  5. The test writes one more route, `src/routes/smoke-states/+page.svelte`: an `h1` "States", `PageStatesLoading` with `loading`, and `PageStatesError` with `status={404}`, `status={403}` and `status={500}`, each `level={2}`. *Why:* those components are not rendered by any shipped page. Then the app's `vite build` exits 0. Every route is prerendered, so every block runs on the server and the crawler checks every link.
  6. 6 of 6 prerendered pages exist (`build/hero.html`, `sign-in.html`, `sign-up.html`, `page-states.html`, `settings.html`, `smoke-states.html`), each holding exactly one `<h1`, with the texts "Components you copy in and own", "Sign in", "Create an account", "Projects", "Settings", "States".
  7. `svelte-check` reports 0 errors (it checks `+error.svelte` too).
  8. The lint, run with this repository's rules over the 102 installed files, finds 0 violations.

  8 assertions in each of 2 apps: **16**.

`bun run test` runs unit, browser and smoke, as `001` set.

### 21. The version: 0.3.0

- `package.json`'s `version` becomes **`0.3.0`**. *Why a minor step:* under semver's 0.x reading, a minor step adds features. `003` adds seven items and changes no interface of `001`'s or `002`'s: no `002` file is edited (decision 2's imports, decision 11's frame and decision 12's CSS order and cell size live in block files). If the build finds it must change a `002` item, the changelog marks the change and says whether it alters the interface (constitution §6).
- `build-registry` writes `static/v0.3.0/r/styles/maia/`. A clean build makes no `v0.1.0/` or `v0.2.0/` folder (`002` decision 25); each older version is served from its own GitHub tag.
- The seven new items carry `meta.since` `"0.3.0"`. The release is the git tag `v0.3.0`, on `fb942f8`.

### 22. The changelog

- `CHANGELOG.md` gains `## 0.3.0 — <landing date>` above `0.2.0`: one line per new item (`status`, `error-summary` and the five blocks), each marked "new"; one line saying no existing item changed (or naming each change, per decision 21); and one line on installing blocks without `-o` (decision 3).
- `registry.test.ts` checks: the `0.3.0` entry names 7 of 7; `0.2.0` still names 27 of 27; `0.1.0` still names 6 of 6.

### 23. What `006` and a consuming app take

- **A consuming app's home page** takes `hero` (`HeroSection`, `HeroFeatures`; the `media` snippet can hold `004`'s code block, the design book §09) and `page-states` (the error page moved to the app's `src/routes/+error.svelte`, `PageStatesLoading` for anything that loads, `PageStatesMessage` for empty output). It installs without `-o` once it holds any of the items (decision 3).
- **An admin page behind an access gate** may take `sign-in` as the gate. Where a proxy in front of the page is the gate, such as Cloudflare Access, the app draws no sign-in form (primitives memo §1.1). Either way `sign-in` installs alone: it links nowhere outside itself (decision 4).
- **`006`** takes `status` for the chat pane's "Responding" and "Response complete" (patterns memo §5.2); the `(view)` group and the viewer for its own two blocks; and provides the `<main>`, header, skip link and footer that these blocks assume (decision 16). Client-side navigation guards for unsaved settings are its shell's.

### 24. Build order

One builder, in this order. Previews and tests go with each step.

1. **The machinery.** Version 0.3.0. The routes split into `(site)` and `(view)`, with the root layout and root error page (decision 16). `src/lib/preview/blocks.ts`, `block-viewer.svelte`, `src/lib/server/built-item.ts`. The catalogue's sixth group. `tests/unit/blocks.test.ts` and the new browser files written for all five blocks and seen failing.
2. **`status` and `error-summary`:** the items, their pages, fixtures and checks.
3. **`sign-in`:** its two files, registry entry, 4 views, item page; its unit, browser, viewer and keyboard checks, the ring check at 360 among them; and the smoke test run with `add sign-in` alone.
   - **Checkpoint: a review after step 3.** The builder stops and asks the design lead for a short review of the viewer (theme copying, widths, code view, the `-o` note), `status`, `error-summary` (focus and roles), and the sign-in block at the three widths in both themes, including check 27's rings at 360, before step 4 copies the pattern into four more blocks (review finding 14). *Why here:* the viewer and the summary are what every later block reuses, and where a wrong choice costs the most to undo.
4. **`hero`.**
5. **`sign-up`.**
6. **`page-states`,** with the root error page and the 404 check.
7. **`settings`.**
8. **The full suites,** the smoke test with all five, `CHANGELOG.md`, and a walk of the 57 pages on `bun run dev` in both themes collecting page errors and console errors and warnings (`002` Landing note 8).

**Nothing is deferrable.** The set is fixed by the blocks decision and the split decision, `error-summary` by the review calls, and the viewer by the `003` calls.

### 25. Limits, and what lies outside this specification

- **Screen readers.** No screen reader has been run; the tests prove the DOM contract (roles, live regions, focus, `aria-describedby`), not what VoiceOver and NVDA say. So this release does not establish three things: whether `role="alert"` plus a focus move reads the summary twice; whether the code step's heading focus reads cleanly; and whether a status region mounted and filled one tick apart, as `PageStatesLoading` does on a client-side mount, is announced (decision 13). Screen readers are outside this release's checks (`decisions.md`, "After the public-readiness review").
- **The deployed 404** (decision 13): `adapter-static`'s `fallback` and Cloudflare's `not_found_handling` belong to a deployment, and this repository has none (`decisions.md`, "The registry is served from GitHub, and the repository is public").
- **`field-sizing`** is settled in `005`: the composer grows by `field-sizing: content` (`decisions.md`, "The design calls for `005`, overlays, navigation and the chat primitives"). Nothing here uses a growing textarea.

## Design

How the pieces fit.

```
src/lib/registry/
  ui/status/                 status.svelte, index.ts                        registry:ui
  ui/error-summary/          error-summary.svelte, index.ts                 registry:ui
  blocks/<block>/            +page.svelte (and +error.svelte)               registry:page  → src/routes/<block>/
  components/<block>-*.svelte                                               registry:component → src/lib/components/
        │  registry.json lists each by hand (decision 5)
        │  bun run build:registry
        ├──► static/r/styles/maia/          index.json + 39 item files
        └──► static/v0.3.0/r/styles/maia/   the same 40 files

src/routes/
  +layout.svelte             app.css, no chrome
  +layout.ts                 prerender, trailingSlash: always
  +error.svelte              the page-states error page in <main>; serves 404 on the preview server
  (site)/+layout.svelte      header (lockup, theme toggle), <main>
  (site)/+page.svelte        the catalogue, six groups
  (site)/items/<name>/       39 item pages; a block's page holds the viewer, its +page.server.ts reads the built JSON
  (view)/+layout.svelte      <main data-view-ready>, nothing else
  (view)/view/<block>/[<state>/]+page.svelte   17 views

item page ── <iframe src="/view/<block>/<state>/"> ── same origin
   │  on mount, on load, and on MutationObserver of <html class>  ──copies "dark"──►  iframe <html>
   │  width buttons → w-90 / w-192 / w-320, h-180
   └─ code view ◄── static/r/styles/maia/<block>.json  (targets → app paths, placeholders → #lib aliases)
```

**A block, end to end** (`sign-in`):

```
src/lib/registry/blocks/sign-in/+page.svelte
  import SignInForm from "#lib/registry/components/sign-in-form.svelte"   ── build ──► "$COMPONENTS$/sign-in-form.svelte"
  async function signIn(values) { /* stub: 800 ms, credential failure */ }       ── add ──► "#lib/components/sign-in-form.svelte"
src/lib/registry/components/sign-in-form.svelte
  imports #lib/registry/ui/{card,field,input,input-group,button,error-summary,status}, #lib/utils

app:  src/routes/sign-in/+page.svelte   src/lib/components/sign-in-form.svelte   src/lib/components/ui/<12 items>/   src/lib/utils.ts
ours: /view/sign-in/ imports the page file directly through package.json "imports"
```

**The views:**

| Block | View | Label | Stops |
|---|---|---|---|
| `hero` | `/view/hero/` | Default | 2 |
| `sign-in` | `/view/sign-in/` | Ready | 4 |
| | `/view/sign-in/errors/` | Field errors | 6 |
| | `/view/sign-in/credentials/` | Wrong credentials | 5 |
| | `/view/sign-in/busy/` | Signing in | 4 |
| `sign-up` | `/view/sign-up/` | Ready | 4 |
| | `/view/sign-up/errors/` | Field errors | 8 |
| | `/view/sign-up/verify/` | Code step | 4 |
| | `/view/sign-up/code-error/` | Wrong code | 5 |
| `page-states` | `/view/page-states/` | Empty | 1 |
| | `/view/page-states/loading/` | Loading | 0 |
| | `/view/page-states/error/` | Error | 3 |
| | `/view/page-states/not-found/` | Not found | 1 |
| | `/view/page-states/cannot-show/` | Cannot be shown | 1 |
| `settings` | `/view/settings/` | Ready | 8 |
| | `/view/settings/errors/` | Field errors | 11 |
| | `/view/settings/saved/` | Saved | 8 |
| | | **17 views** | **75** |

## Scope

**In** (the work to *built*):

- The `status` and `error-summary` items (2 files each) and the five blocks (16 files) under `src/lib/registry/`, and their 7 entries in `registry.json`.
- The route split into `(site)` and `(view)`; the root layout and root error page; 17 view routes; `src/lib/preview/blocks.ts` and `block-viewer.svelte`; `src/lib/server/built-item.ts`; 7 new item pages (5 with a `+page.server.ts`); the catalogue's sixth group.
- Tests: 9 unit files (`blocks.test.ts` new; `registry`, `previews`, `literals` updated), 8 browser files (`blocks.spec.ts` and `viewer.spec.ts` new; `axe`, `theme`, `keyboard`, `primitives` and `pages.ts` updated), 4 smoke files (`blocks-add.test.ts` new).
- `package.json` version 0.3.0; the `CHANGELOG.md` entry.

**The step to *done*** is the release (constitution §2 and §4.2): the built change is reviewed and tagged `v0.3.0` (criterion 28).

**Out:**

- The app shell, the skip link, the header and footer, and the chat pane (`006`); `code-block`, the highlight palette and the editor (`004`); overlays, the sidebar and `toggle-group` (`005`, `004`).
- Social, passkey and email-link sign-in; password reset; any server-side authentication or form action.
- Deployment, `adapter-static`'s `fallback`, and Cloudflare's `not_found_handling`.
- The doc-ID scheme, settled as `PS-<series>-<NNNN>` (`decisions.md`, "The theme mechanism, the doc-ID scheme and the footer's sentence"), and the icon's dots on ink, which use the lifted primitives (`decisions.md`, "After the public-readiness review").
- Any change to a `001` or `002` item, token or package; any new lint rule.
- Screenshots of blocks; a drag handle in the viewer; syntax highlighting in the code view.

## Acceptance criteria

Each is a count, checked by the command named. "Clean clone" is `001`'s. Every command runs under Bun. Criteria 1 to 27 make `003` *built*; criterion 28 makes it *done*.

1. **Install.** On a clean clone, `bun install --frozen-lockfile` exits 0. `deps.test.ts` finds 23 packages with their specifiers and lock versions, unchanged from `002`, and 3 of 3 Bun checks.
2. **Checks.** `bun run check` reports 0 errors and 0 warnings. `bun run lint` exits 0.
3. **Tokens unchanged.** `bun run build:tokens` run twice changes 0 files the second time; `tokens.test.ts`, `contrast.test.ts` and `generated.test.ts` pass with `002`'s counts.
4. **Registry source.** `registry.test.ts`: 39 items in decision 5's order and types (1, 3, 1, 29, 5); 39 of 39 with a `meta.group` among 6; 0 dependencies with `local:` or a scheme; 24 of 24 distinct registry dependency names resolve here; 29 of 29 `registry:ui` items have at least 2 files; 26 of 26 `002` items keep `meta.stock`; 7 of 7 new items carry `meta.since` `"0.3.0"`, no `meta.stock`, and decision 5's titles.
5. **Registry build.** `bun run build:registry` exits 0 and writes 40 files to `static/r/styles/maia/` and 40 byte-identical files to `static/v0.3.0/r/styles/maia/`. In a temporary folder: 0 of 2 stale files survive; 39 of 39 items parse; 0 files contain `#lib`; 29 of 29 `registry:ui` items' targets start `<name>/`; 6 of 6 page files carry no `target` and build to `<block>/<base name>`; 0 targets begin `~/` or `src/`; 10 of 10 component targets are bare `<block>-` names; 0 of 40 files contain `$UTILS$.js` or `/index.js"`.
6. **Blocks, statically.** `blocks.test.ts`: 5 of 5 blocks' imports covered by their own dependencies and files; 0 block-to-block imports or dependencies; 0 unshipped file references; 0 root-relative strings other than `"/"`; 10 of 10 component files named `<block>-…` and 0 repeated base names; 16 of 16 block files lint clean; 0 banned words in 18 files; 17 of 17 views with route files and 0 extra; 16 of 16 code-view paths mapped with 0 placeholders left; the password floor 1 of 1 and 0 `maxlength`.
7. **Site build.** On a clean clone, `bun run build` exits 0. `build/` holds 40 files under `r/styles/maia/`, 40 under `v0.3.0/r/styles/maia/`, 0 under `v0.1.0/` or `v0.2.0/`, and 57 prerendered pages.
8. **Dev server.** With `bun run dev` running, `GET /r/styles/maia/index.json` answers 200 with 39 items.
9. **Preview pages.** `previews.test.ts` finds 39 of 39 under `src/routes/(site)/items/`.
10. **The lint.** `literals.test.ts` finds 153 item files and 0 violations; it flags 64 of 64 bad samples and 0 of 42 good. `bun scripts/lint-literals.ts` exits 0.
11. **Named dependencies.** `deps.test.ts` finds 9 of 9 packages that items name in `package.json`; `registry.test.ts` finds `phosphor-svelte@^3.1.1` on 2 of 2 icon-importing new items and no package on the other 5.
12. **The merge path.** `utils.test.ts` passes 7 of 7 cases, unchanged.
13. **axe.** `axe.spec.ts` reports 0 violations across 214 scans.
14. **Themes.** `theme.spec.ts` passes 114 of 114.
15. **The mark and tokens in the browser.** `four-dot.spec.ts` and `tokens.spec.ts` pass with `002`'s counts.
16. **Keyboard.** `keyboard.spec.ts`, in 2 of 2 themes: the catalogue's 41 stops in order with the ring; 39 fixture stops over 17 items; 75 view stops over 17 views, each the right role and name with the ring, and the loading view with 0; 41 viewer toolbar stops over 5 pages; 11 of 11 behaviours.
17. **Status and error summary.** `primitives.spec.ts` passes `002`'s checks and S1 to S3 and E1 to E2 in each of 2 themes: 2 of 2 status regions empty in the raw HTML with 3 of 3 attributes; Announce and Clear 2 of 2; hidden 1 × 1, visible wider; 3 of 3 summary specimens with no role; the inserted summary's role, `tabindex`, heading and 2 of 2 links at 24 px or more.
18. **Form behaviours.** `blocks.spec.ts` checks 1 to 17 pass in 2 of 2 themes.
19. **Page states.** `blocks.spec.ts` checks 18 to 22 pass in 2 of 2 themes: `aria-busy`, 3 of 3 hidden skeletons, the status empty raw and "Loading projects" hydrated; `GET /no-such-page/` 404 with 1 `h1`; 0 status numbers outside `code` on 18 pages and 0 red text on 5; the reference in `<details>`, its summary 24 px or more; the 403 in mono, 1 of 1.
20. **Hero.** `blocks.spec.ts` check 23: 3 of 3 heading sizes, 3 of 3 column counts, and the call to action's two widths, in 2 of 2 themes.
21. **Motion, reflow, targets and rings.** `blocks.spec.ts` checks 24 to 27: 0 infinite loops outside a spinner on 24 pages; 24 of 24 pages with no horizontal scroll at 320 px; 75 of 75 view stops at least 24 × 24 px at 360; 40 of 40 sign-in and sign-up stops with their ring unclipped at 360.
22. **Viewer.** `viewer.spec.ts`, in 2 of 2 themes: 5 of 5 defaults; 10 of 10 width presets; 16 of 16 state switches with "Open alone" following; 15 of 15 theme states copied; 16 of 16 code-view paths, and 5 of 5 install commands without `-o`, each with its note.
23. **Smoke.** `blocks-add.test.ts` passes 8 of 8 assertions in each of 2 scratch apps (16 of 16), with 102 files landed. `registry-add.test.ts` still passes 20 of 20, `primitives-add.test.ts` 14 of 14, and `dev-loop.test.ts` passes.
24. **Test files.** On a clean clone, `bun run test` exits 0, having run 9 unit files, 8 browser files in 2 projects and 4 smoke files.
25. **Release.** `package.json`'s `version` is `0.3.0`. `registry.test.ts` finds the `0.3.0` changelog entry naming 7 of 7 items, `0.2.0` naming 27 of 27 and `0.1.0` naming 6 of 6.
26. **The checkpoint.** The Landing notes record the design lead's review after build step 3, check 27's result at that point, and what the review changed.
27. **The development walk.** The builder walks the 57 pages on `bun run dev` in 2 themes and records, in the Landing notes, 0 of 114 page loads with a page error or a console error or warning.
28. **Released:** the change is tagged `v0.3.0` and the Landing notes cite its review.

## Landing notes

- **Built:** 2026-10-28, committed as `fb942f8`, tagged `v0.3.0`. The change review is [`../reviews/003-the-first-blocks-pr-2026-10-28.md`](../reviews/003-the-first-blocks-pr-2026-10-28.md): "Does not land yet" on 1 Medium and 6 Low findings; 6 fixed and 1 (the Landing notes) answered by these notes, two of them by the design lead's calls in `decisions.md` ("The design calls for `003`", "After the change review").

**What the design lead saw, under Bun 1.3.14, 2026-10-28 (EXECUTED):**

| Check | Result |
|---|---|
| `bun run check` | 1120 files, 0 errors, 0 warnings |
| `bun run lint`, `bun scripts/lint-literals.ts` | exit 0; 0 literals in item files |
| `bun run build` | 40 registry files, 40 versioned files, 58 prerendered pages |
| `bun run test`, twice in a row | exit 0: unit 384 pass (9 files), browser 716 passed (8 files × 2 projects), smoke 52 pass (4 files) |

**Criteria, as counted at landing (EXECUTED by the builder; 1 to 25 also by the reviewer, at the specification's numbers, before the fixes).** A count that moved from the specification is in bold; every move comes from deviation 8's new view or its four checks.

| # | Count |
|---|---|
| 1 | frozen install exits 0 on a clean copy; `deps.test.ts` unchanged (23 packages, 3 of 3 Bun checks) |
| 2 | 0 errors, 0 warnings; lint exit 0 |
| 3 | second `build:tokens` changes 0 files; `tokens`, `contrast`, `generated` at `002`'s counts |
| 4 | 39 items in order, types 1, 3, 1, 29, 5; 39 of 39 groups among 6; 24 of 24 dependency names; 26 of 26 `meta.stock`; 7 of 7 `since` `"0.3.0"` with decision 5's titles |
| 5 | 40 + 40 byte-identical; 0 of 2 stale; 39 of 39 parse; 0 `#lib`; 6 of 6 page files untargeted, built to `<block>/<file>`; 0 rooted; 10 of 10 bare `<block>-` components; 0 `.js` imports |
| 6 | the 10 checks of `blocks.test.ts`: 5 of 5 blocks covered; 0 cross-block; 0 assets; 0 root links but `/`; 10 of 10 named; 16 of 16 lint clean; 0 banned words in 18 files; **18 of 18** views with route files, 0 extra; 16 of 16 mapped; the floor 1 of 1, 0 `maxlength` |
| 7 | clean copy: 40, 40, 0 under `v0.1.0/` or `v0.2.0/`, **58** pages |
| 8 | 200 with 39 items |
| 9 | 39 of 39 under `src/routes/(site)/items/` |
| 10 | 153 files, 0 violations; 64 of 64 bad, 0 of 42 good |
| 11 | 9 of 9; `phosphor-svelte@^3.1.1` on 2 of 2, none on the other 5 |
| 12 | 7 of 7 |
| 13 | **220** scans (110 per project), 0 violations |
| 14 | **116** of 116 |
| 15 | four-dot 14 + 14, tokens 35 + 35 |
| 16 | 41 catalogue stops; 39 fixture stops over 17 items; **83** view stops over **18** views; **42** toolbar stops over 5 pages; 11 of 11 behaviours |
| 17 | S1 to S3 and E1 to E2 in 2 of 2 themes |
| 18 | checks 1 to 17 in 2 of 2 themes, check 11 reading the consent sentence's text; **plus checks 28 to 31**, one rejecting callback each |
| 19 | checks 18 to 22; `GET /no-such-page/` 404 with 1 `h1` |
| 20 | 3 of 3 sizes, 3 of 3 column counts, the two widths |
| 21 | 0 loops on **25** pages; **25** of 25 at 320 px; **83** of 83 stops at 24 px or more; 40 of 40 rings unclipped at 360 |
| 22 | 5 of 5 defaults; 10 of 10 widths; **17** of 17 state switches with "Open alone"; 15 of 15 themes, the frame starting in the other theme; 16 of 16 paths and bodies; 5 of 5 commands without `-o`, with the note |
| 23 | `blocks-add` 16 of 16, 102 files, and exactly 16 block files written; `registry-add` 20; `primitives-add` 14; `dev-loop` passes |
| 24 | 9, 8 and 4 files; exit 0 |
| 25 | `0.3.0`; the changelog's `0.3.0` names 7 of 7 and the `button` change; `0.2.0` 27 of 27; `0.1.0` 6 of 6 |
| 26 | note 1 |
| 27 | note 3: **116** loads (58 pages × 2 themes), 0 with a page error, console error or warning |
| 28 | met |

**Notes:**

1. **The checkpoint after build step 3.** The builder stopped with the machinery, `status`, `error-summary` and `sign-in` built and the smoke test passing 16 of 16 with `add sign-in` alone (52 files). It reported the viewer's checks (frame, widths, states, theme copy, code view, the note on `-o`), S1 to S3 and E1 to E2 raw and hydrated, 24 screenshots of the four sign-in views at 360, 768 and 1280 in both themes, and check 27's rings at 360: 19 of 19 sign-in stops unclipped in each theme. The design lead passed it with two answers: axe on a block's item page excludes the viewer's frame (note 5, deviation 1), and `button`'s `link` variant drops its side padding at every size (deviation 4), after the footer link sat 12 px in from the text.
2. **The change review's findings and the design lead's calls applied.** The consent sentence lost a space ("serviceand"); fixed, and check 11 now reads the sentence. Every callback may reject: the block keeps what was typed, inserts a form-level summary, focuses it and sets the status to a line naming what failed ("We could not sign you in. Try again.", "We could not create your account. Try again.", "We could not check the code. Try again.", "We could not save your changes. Try again.", "We could not delete your account. Try again."; a failed resend: "We could not send a new code. Try again."). The first wording, "Something went wrong. Try again.", was refused by the voice check (the design book §07), which stays as specified. "Technical details" shows an `aria-hidden` caret, right when closed and down when open. An `h1` outranks what sits under it at every width: the page-states and settings `h1` are `text-5xl` from `sm`, tile headings `text-2xl`, settings legends and the delete heading `font-heading text-base font-bold`. The settings delete trigger is `secondary`; only the dialog's confirm is `destructive`. The viewer's pressed preset is inverted (`bg-foreground text-background`), and its State and Width groups have visible mono labels, "state" and "width", that name them.
3. **The development walk** (`002` Landing note 8). The 58 pages on `bun run dev` in both themes, collecting page errors and console errors and warnings: 0 of 116 loads. Repeated after each round of fixes, last on the final tree.
4. **Where the build deviates from the specification, and who allowed it.**
   1. *axe excludes the viewer's iframe on a block's item page* (decision 20): the frame's `<main>` beside the page's trips `landmark-unique`. Each view is scanned at its own URL at 3 widths. The design lead, at the checkpoint.
   2. *The root error page was interim until step 6* (decision 16's order); it now renders the block's error page in a `<main>`. The design lead, at the checkpoint.
   3. *Each block form carries `data-slot="<component>"` on its `<form>`*, and `settings-delete` on its section, so tests find each form's status; the card keeps `data-slot="card"` (no decision names a hook). The design lead, at the checkpoint.
   4. *`button`'s `link` variant has no side padding* (`002` decision 12; `003` decision 21's "no `002` file is edited"), as `compoundVariants`; height and interface unchanged; in the changelog. The design lead, at the checkpoint.
   5. *The consent links are `inline-block`* (decision 12's "inline link"): an inline `<a>` measures its 21 px content area, not the 25.6 px line, and check 26 failed. The builder; seen by the review.
   6. *`blocks-add.test.ts` takes `SMOKE_BLOCKS`* (decision 24, step 3's `add sign-in` alone); the counts are asserted only for all five. The builder; amended by deviation 10.
   7. *Additions no decision names:* `SettingsDelete`'s `requested` prop (decision 14), now named in the page's stub comment; the exports `MESSAGES` and `TIME_ZONES` (`settings-form`) and `errorTitle` (`page-states-error`); `MESSAGES.failed` on every form; the preview components `block-page.svelte` and `install-note.svelte` (decision 17). Review finding 3.
   8. *A failed callback is told* (decisions 6, 7, 12 and 14), with a new view, `/view/settings/failed/` ("Callback failed"), whose stubs reject. Checks 28 and 29 make the shipped page file's stubs reject by making `setTimeout(…, 800 | 400)` throw inside the promise's executor. The design lead, after finding 2, wording included.
   9. *Classes decisions 13 and 14 name, changed by the design lead's calls after finding 6* (note 2); the specification's text is not edited.
   10. *`test:smoke` clears `SMOKE_BLOCKS`* (`SMOKE_BLOCKS= bun test …`), and the test reads an empty value as unset; probed: an exported value reaches the test as `""`. Review finding 4.
   11. *Checks strengthened* (decision 20): viewer check 4 inverts the frame's own theme so only the viewer's copy can match it (it failed with the copy disabled); viewer check 5 compares each file's text; smoke test 2 counts what `add` wrote. Review finding 5.
   12. *The consent space* is `{" "}` inside the `{#if}` (decision 12). Review finding 1.
5. **For `004`, `005`, `006` and a consuming app.**
   - A block's page lands at `src/routes/<block>/`: the hero at `/hero`, the error page under `/page-states`, where it handles only that route's errors. An app moves the hero to its home page and the error page to `src/routes/+error.svelte` (decision 3).
   - Add blocks, and any item into an app that already holds some of its files, without `-o`, so the CLI asks before it overwrites (decision 3). The smoke tests keep `-o`; their apps are fresh.
   - A block callback may reject; the block says so in a line naming what failed. An app maps a server's answer to `errors` or `formError` itself.
   - No screen reader has been run: the tests prove the DOM contract, not what VoiceOver or NVDA say (decision 25). `field-sizing` is settled in `005`.
   - A page that embeds whole pages in frames meets axe's `landmark-unique`; scan each framed page at its own URL and exclude the frame, as `axe.spec.ts` does.
   - The `(view)` group, `BLOCK_VIEWS` and the viewer also serve `006`'s two blocks.
