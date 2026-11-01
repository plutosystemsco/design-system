# 006 — The app shell and the chat pane

- **Status:** **built**, 2026-11-01, in the working tree over `616b8a0` (`v0.5.0`); amended the same day after its specification review ([`../reviews/006-the-app-shell-and-the-chat-pane-spec-2026-11-01.md`](../reviews/006-the-app-shell-and-the-chat-pane-spec-2026-11-01.md), 18 findings, all fixed here), fit to build once `005` is built
- **Date:** 2026-11-01
- **Owner:** Clay Gendron (written by an agent, Claude, the orchestrating session, as design lead under the owner's delegation of 2026-10-27)
- **Kind:** two registry blocks (`app-shell`, `chat`); the orbit-assemble entrance as a prop of `four-dot`; one token and three additions to `pluto-theme`; the preview site's own footer and entrance; tests; the 0.6.0 release
- **Depends on:** [`005`](./005-overlays-navigation-and-the-chat-primitives.md), *draft* (its eleven items are composed here), and through it [`004`](./004-code-and-data.md) (`b3d2a8e`, `v0.4.0`), [`003`](./003-the-first-blocks.md), [`002`](./002-the-primitives-forms-surfaces-and-feedback.md) and [`001`](./001-tokens-and-the-registry.md).
- **Blocks:** `wasi-python-dev`'s shell (its home page's header and footer, its `/admin`'s sidebar) and the chat page of the app the owner's "other work" brings (decisions.md, 2026-11-01). Closes the first-set blocks decision of 2026-10-28.
- **Research it stands on:**
  - [`../research/2026-11-01-the-orbit-assemble-entrance-and-the-footers-furniture.md`](../research/2026-11-01-the-orbit-assemble-entrance-and-the-footers-furniture.md) (the entrance memo)
  - [`../research/2026-11-01-the-sidebar-is-mobile-and-the-shells-navigation.md`](../research/2026-11-01-the-sidebar-is-mobile-and-the-shells-navigation.md) (the sidebar memo), §4
  - [`../research/2026-11-01-the-chat-primitives-the-composer-and-field-sizing.md`](../research/2026-11-01-the-chat-primitives-the-composer-and-field-sizing.md) (the chat memo), §5, §6
  - [`../research/2026-10-28-the-blocks-patterns-and-accessibility.md`](../research/2026-10-28-the-blocks-patterns-and-accessibility.md) (the patterns memo), §1, §5, §8.1, §8.5
  - [`../research/2026-10-28-blocks-how-they-are-declared-installed-and-previewed.md`](../research/2026-10-28-blocks-how-they-are-declared-installed-and-previewed.md) (the blocks memo), §1, §5
- **Design calls:** `../decisions.md`, "The design calls for `006`, the app shell and the chat pane" (2026-11-01); the owner's answers of 2026-11-01 (the doc-ID scheme `PS-<series>-<NNNN>`; the footer's sentence as an optional prop, empty by default; the theme mechanism left to the design lead).

## Intent

A block is real source, previewed live, installed with one `add` (`003`). The two blocks the first set still owes are the frame every page sits in, and the one surface a Pluto app has that v2 never drew: a conversation.

Three things decide the shape of this work.

1. **The shell carries the page's one hello.** v2 §06 allows one entrance per page, the four dots docking into the mark, at most 900 ms. `003` kept the hero still and gave the entrance to the shell's header. The entrance memo measured the book's own cover (four 500 ms animations staggered 90 ms apart, ending at 920 ms) and drew ours from tokens alone: 495 ms per dot, the last ending at 900.0 ms, the composed mark before any frame under reduced motion once one rule is added (§1, §2, EXECUTED). SvelteKit keeps a layout's lockup across client-side navigation, so "one per page" is one per full load with no flag (§2.5, EXECUTED).
2. **The shell is landmarks first.** A skip link first in `<body>`, a `banner`, a labelled `nav`, one `main` with an id the skip link reaches, an optional sidebar `nav`, and a `contentinfo` carrying v2 §07's furniture: the commit, the build date, the doc ID in the owner's scheme, the source link, and the public-benefit sentence only when the owner says it is true (decisions.md, 2026-11-01). The commit reaches the footer through SvelteKit's own `version.name` (entrance memo §4.2, EXECUTED).
3. **The chat pane is `005`'s items wired to the app's state.** The pane takes a list of turns and a status, and gives back `onsend`, `onstop`, `onnew` and `onretry`. Tokens stream silently; the composer's status says the three words; a "Latest reply" button moves the reader; fenced code in a reply becomes `code-block` at `sm` through a fifteen-line splitter, with no markdown renderer (chat memo §5, §6).

**Not here:** the favicon and the icon files (entrance memo §6: the app's `app.html` owns the link; the colour-on-ink call is still open); a markdown renderer; a right-hand sidebar; a notices region; deployment.

**Terms of art.** The *shell* is the layout an app wraps every page in: the skip link, the header, the optional sidebar, the main area, the footer. The *entrance* is the mark's one animation, the four dots docking. A *turn* is one message in a conversation. A *fence* is a line of three backticks that opens or closes a block of code in text. *Prerender* is SvelteKit rendering a page to HTML at build time.

## Decisions

Each decision gives its reason. A reviewer checks the reason as much as the rule.

### 1. Scope: two blocks, the entrance, the theme's additions, and nothing else

| Item | Type | Files |
|---|---|---|
| `app-shell` | `registry:block` | `+layout.svelte`, `+layout.server.ts`, `+page.svelte`; components `app-shell-skip-link`, `app-shell-header`, `app-shell-footer`, `app-shell-sidebar`, `app-shell-user-menu`, `app-shell-nav` |
| `chat` | `registry:block` | `+page.svelte`; components `chat-pane`, `chat-turn`, `chat-text`, `chat-types.ts` |

- **`four-dot` gains one optional prop, `entrance`**, on `FourDot` and `Lockup` (decision 6). An optional prop added is not an interface change (`002` decision 25's reading of semver); the changelog says "changed, not an interface change".
- **`pluto-theme` grows, additively** (decision 5): one token, the entrance's keyframes and utility, a `groove-b` utility, and one rule in the reduce block.
- **The preview site adopts both**: its header's lockup runs the entrance and its layout gains the footer (decision 16). Its `(site)` and `(view)` layouts, not the root, render `005`'s `ThemeScript`, so the `(shell)` views hold one script each (decision 6).
- No other existing item changes. No new package. No new colour.

### 2. The block shape, as `003` fixed it, and one new case: a layout file

`003` decision 2 holds: page files under `src/lib/registry/blocks/<block>/`, components flat under `src/lib/registry/components/` named `<block>-<part>`, imports by the `components` and `ui` aliases, no block imports another, no `./$types`, no props on a page file.

- **The shell is a layout, so its page file is `+layout.svelte`.** It lands at `src/routes/app-shell/+layout.svelte` (`003` decision 3's target rule: `<block>/<base name>`), wrapping the block's `+page.svelte` at `/app-shell`. **An app moves the two files to `src/routes/+layout.svelte` and `+layout.server.ts`**, which the item page says in one line. *Why ship it under `/app-shell`, not at the root:* a target at `~/src/routes/+layout.svelte` would overwrite the layout every app already has (`003` decision 3's reason for the default), and the CLI asks before overwriting only when the file exists (`003` decision 3). A layout a reader moves by hand is one they have read.
- **`+layout.server.ts`** exports `load` typed with `ServerLoadEvent` from `@sveltejs/kit`, not `./$types`: it reads the `sidebar_state` cookie `005` decision 10 writes and returns `{ sidebarOpen: boolean }`. Under prerender the cookie is empty and the sidebar opens. *Why a server load in a block:* the sidebar's first paint is then right, and `005` left the read to the app; this is the app's layout.
- **The layout takes `children` and `data`** (SvelteKit's layout contract) and nothing else. Its props for the app are **constants at its top** the app edits: the links, the sidebar mode, the footer's values; the item page marks the block. *Why constants, not props:* a root layout has no caller to pass props; the values are the app's own and belong in its file.
- **The chat block is a page**, `+page.svelte` at `/chat`, composing `ChatPane` with a stub transport (`003` decision 6's pattern: the preview fakes the server with stubs in the page file).
- **The link rule** (`003` decision 4) holds: every quoted string beginning with `/` in a block file is `"/"`. The shell's example links and the sidebar's items point at **same-page anchors** (`#overview`, `#activity`, `#members`) of the example page, which also makes "current page" testable in one document; the header's home link is `/`. The item page's moving instruction (decision 6) says to replace them first.

### 3. The registry entries

| # | Group | Items |
|---|---|---|
| 56–62 | `blocks` | `hero`, `sign-in`, `sign-up`, `page-states`, `settings`, **`app-shell`**, **`chat`** |

**62 items.** Types: 1 `registry:theme`, 3 `registry:font`, 2 `registry:lib`, 2 `registry:hook`, 47 `registry:ui`, 7 `registry:block`.

| Item | `title` | `description` |
|---|---|---|
| `app-shell` | App shell | The frame every page sits in: a skip link, a header with the lockup's one entrance and a theme toggle, an optional sidebar, the main area, and a footer that states the build. |
| `chat` | Chat | A conversation: a log that follows new replies, turns with code, a composer that sends and stops, and the words a screen reader hears. |

| Item | Files | `registryDependencies` beyond `utils`, `pluto-theme` | Packages detected |
|---|---|---|---|
| `app-shell` | 9 (3 page files, 6 components) | `four-dot`, `theme`, `button`, `sheet`, `sidebar`, `breadcrumb`, `dropdown-menu`, `avatar`, `collapsible` | `phosphor-svelte` |
| `chat` | 5 (1 page file, 4 components) | `message-log`, `message`, `marker`, `composer`, `code-block`, `empty`, `alert`, `button` | `phosphor-svelte` |

- **14 new files.** The registry's item files become **300** (`005`'s 286 + 14). Block files become **30** (`003`'s 16 + 14); component files **19** (10 + 9).
- **Dependencies are what the files import** (review finding 7): `app-shell-sidebar` imports `collapsible` for its sub-items group, so it is named; nothing in the shell imports `kbd` (the shortcut's `Kbd` is inside `sidebar`'s trigger), so it is not. `registry build` detects a package only from a file's own imports, and the blocks' files import our items and `phosphor-svelte`, as `003`'s blocks do. `blocks.test.ts` check 1 proves each list suffices.
- **The distinct registry dependency names become 43**: `005`'s 31 and `four-dot`, `theme`, `sidebar`, `breadcrumb`, `dropdown-menu`, `avatar`, `collapsible`, `message-log`, `message`, `marker`, `composer`, `code-block` (the review counted them against `registry.json`, finding 7).
- Each item carries `meta.since` `"0.6.0"` and `meta.group` `"blocks"`; neither carries `meta.stock`.
- `four-dot` keeps `meta.since` `"0.1.0"`.

### 4. The token and the theme's additions

**One token.** `tokens/pluto.tokens.json`'s `mark` gains `orbit: 0.5` (em): how far a dot travels before it docks, the book's largest offset (entrance memo §1.1). Emitted as `--mark-orbit: 0.5em` beside `--mark-dot` (`001` decision 16's rule). `motion` gains three unitless numbers: `entranceDot: 0.55`, `entranceStart: 0.15`, `entranceStagger: 0.1`, emitted into `:root` as `--motion-entrance-dot`, `--motion-entrance-start`, `--motion-entrance-stagger`. *Why tokens, not literals in the keyframes:* the memo's sketch tripped the lint once, on `0.5em` (§2.3), and review then has one place to read the numbers.

**The keyframes and the utility**, in `pluto-theme`'s `css`:

- `@keyframes pluto-mark-dock { from { opacity: 0; transform: translate(calc(var(--mark-orbit) * var(--_ox)), calc(var(--mark-orbit) * var(--_oy))) scale(0.4) } }`. No `to`: the end state is the dot's own style, the composed mark.
- `@utility mark-entrance`: every child `[data-slot="four-dot-dot"]` gets `animation: pluto-mark-dock calc(var(--motion-entrance) * var(--motion-entrance-dot)) var(--ease-entrance) both`; `:nth-child(1)` to `(4)` set `--_ox`/`--_oy` to (−1, 0.6), (0.8, −0.8), (−0.6, −1), (1, 0.8) and `animation-delay: calc(var(--motion-entrance) * (var(--motion-entrance-start) + <n> * var(--motion-entrance-stagger)))` for `n` 0 to 3. The last dot ends at 0.45 + 0.55 = 1.00 of the budget: **900 ms** (entrance memo §2.3, EXECUTED: 495 ms per dot, delays 135, 225, 315, 405, the last ending at 900.0 ms, every dot at opacity 1 and the identity transform after `finished`). Reading order: blue from the lower left, red from the upper right, amber from the upper left, green from the lower right, the book's directions.
- **The reduce block gains a third rule:** `.mark-entrance [data-slot="four-dot-dot"] { animation: none }` (a descendant selector, not the memo's child `>`, because the lockup nests the mark one level down). *Why:* `001`'s `0.01ms !important` catch-all beats the utility's shorthand, and with `fill: both` the dots sit at opacity 0 for one frame before landing (entrance memo §2.4, EXECUTED). v2 §06: reduced motion "gets the composed end state… never a blank". With no animation the dots show their own style before any frame. `generated.test.ts`'s "exactly 2 selectors in the reduce block" (`001` criterion 5) becomes 3; the specification says so here.
- **`@utility groove-b`**: `border-bottom: var(--line-width) solid var(--groove-line); box-shadow: 0 var(--line-width) 0 var(--groove-light)`: the hairline, then the light below it onto the next ground, for the header's bottom edge (entrance memo §3.2, form b). In dark the light is clear and the hairline alone remains (`001` decision 13). *Why not `groove` on `main`:* the shell's `main` is centred and narrower than the header; the header owns its edge.
- **R14 gains `mark-entrance`** in `002` decision 9's motion list: a plain `animate-*` utility cannot carry four delays and four offsets. The lint's `animate-*` rule does not see a `@utility` of another name (entrance memo §2.3, EXECUTED: 0 violations), so the rule's letter is amended here and `literals.test.ts` adds one good sample, `mark-entrance` in `four-dot.svelte`, and one bad, `animate-mark-dock` anywhere.

### 5. The entrance as a prop of `four-dot`

- `FourDot` and `Lockup` take `entrance?: boolean` (default `false`). `FourDot` adds the class `mark-entrance` to its root when set; `Lockup` passes it through. Nothing else in the two files changes.
- **One per page means one per full document load.** The shell's layout mounts once per load; SvelteKit preserves it across client-side navigation, so the lockup node persists and no animation restarts (entrance memo §2.5, EXECUTED in the scratch app and in this repository's dev server: 0 `animationstart` after a client navigation, 4 after a full load). No `sessionStorage` flag, so a reload replays, which is a new page. The item page names the three things that would replay it: a `+page@.svelte` that breaks out of the layout, a route in another layout group, a `{#key}` around the layout's content.
- **The hero holds no mark** (`003`'s call), so no page shows two entrances. A page that renders a second `Lockup` (the `four-dot` item page shows seven) passes no `entrance`.
- **Under reduce** the dots are the composed mark at load (decision 4). `four-dot.spec.ts` checks both: 4 animations named `pluto-mark-dock` under `no-preference`, each finishing by 900 ms with opacity 1 and the identity transform; 0 animations under `reduce` with every dot at opacity 1 at `load`.

### 6. The `app-shell` block: the layout

`+layout.svelte` renders one root `div` (`flex min-h-svh flex-col`) holding, in order:

1. **`AppShellSkipLink`**: `<a href="#main">Skip to main content</a>`, first in `<body>`, before the header (GOV.UK: straight after the opening `<body>`; WebAIM: one of the first items; entrance memo §3.2, READ). Classes `sr-only focus:not-sr-only focus:fixed focus:top-2 focus:start-2 focus:z-50 focus:rounded focus:bg-card focus:px-4 focus:py-2 focus:text-sm` and the global ring. *Why `sr-only`, not `hidden`:* `display: none` leaves the tab order. EXECUTED in the memo's sketch: the first Tab landed on the link, visible, and Enter moved focus to `<main id="main" tabindex="-1">`.
2. **`AppShellHeader`** (decision 7).
3. **The body**: with `SIDEBAR` false, `<main id="main" tabindex="-1" class="mx-auto w-full max-w-5xl flex-1 px-6 py-12">` holding `children`; with `SIDEBAR` set, a row `<div class="flex flex-1">` of `AppShellSidebar` and `SidebarInset` (the `<main id="main" tabindex="-1">` with `groove-s`), the inset holding a page bar with a `Breadcrumb` and then `children`.
4. **`AppShellFooter`** (decision 8).

- **With `SIDEBAR` set, `SidebarProvider open={data.sidebarOpen}` wraps the whole root** (review finding 6): the skip link, the header, the row and the footer are its children, so the header's trigger reads the provider's context. `005` decision 10, amended with this specification: the provider is a column (`flex min-h-svh w-full flex-col`) that lays out nothing but its children; the row of sidebar and inset is the consumer's `div`. **There is one trigger, in the header** (decision 7), before the sidebar in the DOM, as `005`'s preview has it; the inset carries none.
- **The constants at the top** (decision 2): `APP_NAME` ("Pluto Systems design system" on the site; the shipped value is "Pluto app"), `LINKS` (label and href pairs for the primary nav: shipped as Overview `#overview`, Activity `#activity`, Members `#members`, the example page's three sections), `SIDEBAR` (`false | "offcanvas" | "icon"`, shipped `false`), `USER` (`null` or `{ name, email }`, shipped `null`; the views use "Ada Lovelace", `ada@example.com`), `FOOTER` (`commit`, `builtAt`, `docId`, `sourceHref`, `statement`, `tagline`; shipped from decision 8's two values, no `docId`, no `statement`). The views override them through the components' props.
- **The one line the item page says about moving the files** (decision 2), written here: "Move `+layout.svelte` and `+layout.server.ts` to `src/routes/`, and first replace `LINKS` and the sidebar's hrefs with your own routes: an anchor such as `#overview` in a root layout fails the prerender of every page that has no such id" (review finding 16, EXECUTED: `prerender_missing_id`).
- **Landmarks:** `banner` (the `header`), `navigation` ×1 or ×2 (the header's "Primary" without a sidebar; the sidebar's "Main" with one: with `SIDEBAR` set the header renders no primary nav, since the navigation lives in the sidebar), `main` ×1, `contentinfo` ×1. The shell renders no `h1`; the page does (patterns memo §1.2).
- **`ThemeScript`** (`005` decision 6) is rendered by the layout, in `<svelte:head>`, so the theme is right before paint on every page of the app. The preview's own `ThemeScript` lives in its `(site)` and `(view)` layouts, not the root, so a `(shell)` view holds exactly one (review finding 17; `005` decision 16 amended with this specification).
- **Not sticky by default, except beside a sidebar.** With `SIDEBAR` set, the header is always `sticky top-0 z-20 bg-background`, and the sidebar is offset under it with `top-16 pb-16` through its `class` prop (its box keeps `h-svh`; the last 64 px are padding below the viewport, so the account row sits at the viewport's bottom). *Why:* `005`'s sidebar is sticky; beside a header that scrolls away its foot was cut by the header's height at load, and a sticky sidebar next to a scrolling header is two scroll behaviours on one screen (the build's checkpoint, decisions.md). Without a sidebar, a `STICKY` constant adds `sticky top-0 z-40 bg-background` to the header, and the item page gives the one line the app adds to its `app.css`: `html { scroll-padding-top: 4rem }` (SC 2.4.11, C43; the memo §3.2). *Why not in the block:* `scroll-padding-top` lives on the scrolling element, which no component reaches without a `<style>` block (`001` decision 25). *Why not with a sidebar:* `005`'s sidebar is `sticky top-0 h-svh`; under a sticky header its top 64 px would be covered (review finding 17). `z-40` sits under every overlay's `z-50`.

### 7. The header

`AppShellHeader` is `<header class="groove-b bg-background">` holding a row `mx-auto flex h-16 max-w-5xl items-center gap-4 px-6`:

- **The lockup**, `Lockup href="/" label={APP_NAME} entrance class="text-2xl"`, at the left. 28 px of type, 34.6 px tall in the row, never under v2's 20 px minimum (entrance memo §3.2); so the header never shows the mark alone. `label` is the app's name, the link's accessible name.
- **The sidebar trigger**, when `SIDEBAR` is set: `005`'s `SidebarTrigger` (32 px, "Toggle sidebar", `aria-expanded`, `aria-controls`; on a phone `aria-haspopup="dialog"`), right after the lockup, at every width. It toggles the sidebar on desktop and opens the sidebar's sheet on a phone (review finding 6).
- **The primary nav**, `AppShellNav`, when `SIDEBAR` is false: `<nav aria-label="Primary" class="hidden md:flex">` with a `ul` of `Button variant="link"` links (`002`: the link variant has no side padding and is 48 px tall; a text link in a 64 px row), the current one with `aria-current="page"` set by the app from `page.url` (the shipped layout compares `href` with `page.url.hash` for its anchors) and an underline through `aria-[current=page]:underline`, so the state is shape, not colour (R19). *Why the bracketed variant:* Tailwind 4.3.3's `aria-current:` matches only `aria-current="true"` (review finding 2, EXECUTED); A7 reads the underline.
- **The utilities**, at the right (`ms-auto`): `ThemeToggle size="icon-sm"` (32 px), then `AppShellUserMenu` when `USER` is set, then, when `SIDEBAR` is false, the menu button below `md`.
- **The menu button**, `md:hidden`, only without a sidebar: `Button variant="ghost" size="icon-sm"` with `List` `aria-hidden`, `aria-label="Menu"`, `aria-expanded`, `aria-haspopup="dialog"`, opening a `Sheet side="start"` titled by `APP_NAME` (visually hidden `SheetTitle`), holding the same `AppShellNav` as a column (`flex-col`) and, when `USER` is set, the user's name and a sign-out link. *Why a sheet, not the nav collapsed in place:* the patterns memo §1.4 and Carbon fold header links into the panel below `md`; a modal sheet is the one pattern `005` tested for focus and return. With a sidebar, the sidebar's own sheet is the phone's panel (decision 9) and this button is not rendered.
- **Heights:** the row is `h-16` (64 px, a ladder value: a 48 px control and 8 px either side), with `items-center`; nothing in it is taller than 48 px (entrance memo §3.3). The header is 64 px at every width.
- **`AppShellUserMenu`**: `DropdownMenu` on a trigger `Button variant="ghost" size="icon-sm"` holding `Avatar size="sm"` (24 px, in a 32 px button) with the user's initials as fallback, `aria-label="Account menu"`, which names the menu (`005` decision 7: the trigger or a `label` names the menu; a group heading names its group). Inside: a `DropdownMenuGroup` headed by the user's name and email (`text-xs text-muted-foreground`), then "Settings" and "Sign out" (an icon each; `005` decision 7's rule), link items rendered through the item's `child` snippet as `<a href>` so the role stays `menuitem`, each `href` the app sets (shipped as `/`). No destructive styling on "Sign out": leaving is not destroying.

### 8. The footer

`AppShellFooter` is `<footer class="groove bg-background">` holding `mx-auto max-w-5xl px-6 pt-12 pb-16` and a row `flex flex-wrap items-center justify-between gap-6` (one column below `sm` by wrapping; the book's own footer wraps the same way, entrance memo §1.3).

- **Left:** `Lockup class="text-2xl"` with no `href` and no `entrance` (the header's lockup is the home link and played the entrance; a second link per page would be a second thing: review finding 4; without `href` the lockup is a `span` whose mark is decoration, `001` decision 22), and beside it the tagline as prose, `text-sm`: **"Work runs on data."** *Why the tagline here, and without the name:* the brand line is "Pluto Systems. Work runs on data." (decisions.md, 2026-10-31), set with the name; the lockup is the name, so the line beside it reads as the whole, and the name is not written three times in one row (entrance memo §4.3's cost). The `tagline` prop defaults to it; an app that must not show the brand's words passes `""`. *Why `text-2xl`, not the book's 20 px:* 20 px is off `001`'s type scale and 16 px is under the minimum; 28 px keeps the book's shape at the one allowed size (entrance memo §4.3).
- **Right:** `<dl class="font-mono text-xs text-muted-foreground">` of `div`s `flex gap-2` (no `grid-cols-[…]`: an arbitrary value), each a `dt` (lowercase, the label) and a `dd`: `commit` → `<code>{commit}</code>`; `built` → `<time datetime={builtAt}>{date}</time>` where `date` is the ISO date's first ten characters; `doc` → `{docId}`; `source` → `<a href={sourceHref}>{host and path}</a>`. **A row renders only when its value is given**, so an app without a doc ID shows no `doc` row, and an app built with no `git` shows no `commit` and no `built` row. *Why mono and lowercase:* v2 §04, "eyebrows, captions, doc IDs, dates, code"; the lowercase is written in the markup, not by a CSS transform (R18 bans a transform on labels; these are furniture, and the text is typed lowercase).
- **Below the row, when given:** `statement` as `<p class="mt-6 text-sm">`. The default is **empty** (the owner, 2026-11-01: "Not yet"). The item page says the sentence v2 asks for and that an app sets it when it is true.
- **The doc ID** is the owner's scheme, `PS-<series>-<NNNN>` (decisions.md, 2026-11-01). The shipped layout passes none; the views pass `PS-DS-0006`, this specification's own number, as the example; the item page states the scheme in two sentences: "A doc ID is `PS-<series>-<NNNN>`: a series is one counter kept in one repository (`DB` the design book, `DS` this registry's specifications, one short code per app). The footer shows the string it is given."
- **How the app gets the values, guarded** (review finding 1, EXECUTED by the review: the guarded form built and prerendered in a scratch with no repository). In `vite.config.ts`, one helper `git(args)` runs `execSync("git " + args)` in a `try` and returns `undefined` on any failure; `version.name` is `process.env.WORKERS_CI_COMMIT_SHA?.slice(0, 7) ?? git("rev-parse --short HEAD") ?? "unknown"`; `process.env.VITE_BUILT_AT = git("log -1 --format=%cI")` is set before the plugin runs, so `import.meta.env.VITE_BUILT_AT` reaches the client bundle with no type declaration (the review ran this route; the memo had run `define`, which would need a line in `src/app.d.ts` no block can ship). The layout reads `version` from `$app/env` (not the legacy `$app/environment`) and passes it as `commit` **only when it is not all digits**, since SvelteKit's default name is a timestamp (entrance memo §4.2) and "unknown" is passed as given. The commit's own date, not `new Date()`, so a rebuild of one commit is byte-identical. The item page shows the lines. This repository's own `vite.config.ts` takes the same guarded form (decision 16), because `dev-loop.test.ts` runs a copy of the repository with no `.git`.
- **`contentinfo`** comes from the `footer` as a child of the layout's root. The dating rule (v2 §07) is met by the build date on every page.

### 9. The sidebar in the shell

`AppShellSidebar` composes `005`'s `sidebar`: `Sidebar label="Main" collapsible={SIDEBAR}` with a header holding the app's section name in the heading face, `text-base font-heading font-bold` (shipped "Workspace"; not the lockup: the shell's header already shows it), a `SidebarInput` labelled "Search", two `SidebarGroup`s with mono lowercase labels ("workspace": Overview, Activity, Members, with `phosphor-svelte` icons and the anchor hrefs of `LINKS`; "settings": one `Collapsible` group "Preferences" with the sub-items "Profile" and "Notifications", both `#members`), and a footer `SidebarMenuButton` for the account (`Avatar size="sm"` and the name) opening the same user menu. The current item is set from `page.url.hash`. Below `md` it is the sheet `005` decision 10 provides, opened by the header's `SidebarTrigger`; the header renders no primary nav and no menu button of its own when `SIDEBAR` is set (decision 7). *Why one panel:* two panels from one edge on one page is two of a thing.

### 10. The `chat` block: the pane

`ChatPane` takes `messages: ChatMessage[]`, `status: ChatStatus` (`005`'s four names), `newReply: boolean` (the app sets it true when a reply finishes and false on the next send), `title` (default "New conversation"), `level` (default 2), `onsend(text)`, `onstop()`, `onnew()`, `onretry()`, and renders a column `flex h-dvh flex-col` (`fill="screen"`, the default) or `flex h-full flex-col` (`fill="parent"`, inside a shell whose `main` sets the height). *Why a fixed height, not `min-h-dvh`* (review finding 9): a `min-height` column grows with its content, so the log never overflows and never scrolls, and follow-bottom, "Scroll to end" and the pinned composer never happen. The log is `min-h-0 flex-1` (a flex child's default `min-height: auto` would stop it shrinking) and the composer `shrink-0`.

1. **A header** `flex h-16 shrink-0 items-center justify-between gap-4 px-6`: the title as `<h2 class="font-heading text-base font-bold">` by default; `level` is for an app whose turns are set to `level` 2 as well, so no rank is skipped (review finding 10). At the right, "New chat" as `Button variant="secondary" size="sm"` with `Plus` `aria-hidden` and visible text, calling `onnew`; never disabled; the app decides what a new chat does mid-stream.
2. **The log**: `MessageLog label="Messages" busy={status === "streaming"} class="min-h-0 flex-1"` holding, when `messages` is empty, an `Empty` with "No messages yet" and "Write a message below to start." (no icon: the mark is never an avatar for the assistant here, and `empty`'s icon tile would be the one decoration); else one `ChatTurn` per message, in a `mx-auto max-w-prose` column (60 to 75 ch, v2 §04), and while `status === "submitted"` a `Marker` at the end with the text "Responding" and **no icon** (review finding 8): the composer's button is the one busy control and carries the spinner (`005` decision 13); the marker is a static line that shows where the reply will land. The log announces the marker as an added node, and the composer's status says the same word once; that is one word from each of two regions and accepted (`005` decision 11's rule on what the log announces).
3. **The error**: when `status === "error"`, an `Alert variant="destructive" role={null}` after the last turn, titled "The reply could not be finished", with one sentence "Try again, or write a new message." and a "Retry" `Button variant="secondary" size="sm"` calling `onretry`. *Why `role={null}`:* `002`'s destructive alert is `role="alert"`, an assertive region; inside the polite log it would interrupt, and the log announces the added node itself (review finding 17; the patterns memo allows assertive only for an error that halts the conversation, which Retry says it does not). No server detail is shown (the AI SDK's rule; patterns memo §6).
4. **"Latest reply"**: a `Button variant="secondary" size="sm"` rendered after the log and before the composer, shown while `newReply` is true, that focuses the last assistant turn's `MessageHeader` (`tabindex="-1"`, `005` decision 12) and clears nothing (the app clears `newReply` on the next send). *Why a flag the app sets, not "whenever the last turn is a reply":* that would show the button for ever after every reply (review finding 17); a cue that a reply has just finished is what the reader needs, and the app knows the moment. *Why a separate control from the log's "Scroll to end":* one moves the view, the other the reader (chat memo §5.4).
5. **The composer**: `Composer bind:value status onsend onstop` inside `<div class="groove shrink-0 bg-card px-6 py-4">`: the groove is the edge (no gradient fade, patterns memo §5.3); the raised ground is the honest box. Focus stays in it after send and stop (`005` decision 13).

- **Turns.** `ChatTurn` renders `Message align={role === "user" ? "end" : "start"}` with `MessageHeader level={3}` reading "you" or "assistant" (the mono eyebrow; the app may pass `names`), and `MessageContent variant={role === "user" ? "bubble" : "plain"}` holding `ChatText`. A `marker` role (`{ role: "marker", text }`) renders `Marker variant="separator"` with the text, for lines such as the stub's "Stopped". No avatars: the pane shows none by default (the patterns memo's open call on the mark as avatar is not taken; the mark stays the brand's).
- **`ChatText`**, the fence splitter: splits `text` on lines that are three backticks with an optional language; prose segments render as `<p class="whitespace-pre-wrap">` per blank-line-separated block; each fenced segment renders `CodeBlock size="sm"` with a `CodeBlockHeader` naming the language (or "code") and a `CodeBlockCopyButton`, and `CodeBlockContent code language lineNumbers={false}`; an open fence runs to the end of the string, so a streaming reply shows its code block from the first fence line, highlighted incrementally by the hook (chat memo §6.1, §6.4). Headings are never rendered: text is prose, so no reply can carry an `h1`. About fifteen lines of logic in a `.svelte` file; no package.
- **Types**, `chat-types.ts`: `ChatRole = "user" | "assistant" | "marker"`, `ChatMessage = { id: string; role: ChatRole; text: string }`, `ChatStatus = "ready" | "submitted" | "streaming" | "error"`.
- **The page file** `+page.svelte` renders `<h1 class="sr-only">Chat</h1>` and the pane (review finding 10; the pane's `h2` and the turns' `h3` then follow in rank), and holds the stub: `onsend` appends the user turn, sets `submitted`, then `streaming`, and appends the reply of decision 11 word by word over about two seconds; `onstop` ends it with a marker "Stopped"; `onnew` clears; `onretry` replays; `newReply` is set when the reply ends and cleared on the next send. The stub starts only on the reader's send (nothing moves on load, v2 §06).
- **Reduced motion**: the log's smooth scroll is already instant under reduce (`005` decision 11); the spinner is `002`'s, clamped by `001`; nothing else moves.
- **Phones**: full-bleed, `h-dvh`, the composer at the bottom; C2 checks at 360 × 640 that the region scrolls and the composer's bottom is the viewport's. *Known gap:* iOS Safari's keyboard and `dvh` are untested (patterns memo §5.4); decision 20's placeholder.

### 11. The copy, and the voice

Shipped copy, sentence case, promising nothing the block cannot keep (`003` decision 15). Every string a block ships is here (review finding 13).

| Where | Text |
|---|---|
| Skip link | Skip to main content |
| The shipped app name | Pluto app |
| Primary nav and sidebar items | Overview; Activity; Members |
| The example page | `h1` Projects; sections Overview, Activity, Members, each with one sentence: "Three projects are active this week."; "Nothing has changed since Friday."; "Four people have access."; one link "Open the catalogue" to `/` |
| Sidebar | heading Workspace; search label Search; group labels workspace, settings; collapsible group Preferences with Profile, Notifications; account button: the user's name |
| Breadcrumb | Home (to `/`); Projects (the current page) |
| Menu button; the nav sheet's hidden title | Menu; the app name |
| Account menu | Account menu; the user's name and email; Settings; Sign out |
| The example user | Ada Lovelace; `ada@example.com` |
| Sidebar trigger | Toggle sidebar (`005`'s) |
| Footer labels | commit; built; doc; source |
| Footer tagline (default) | Work runs on data. |
| Footer example doc ID | PS-DS-0006 |
| Chat page heading (visually hidden) | Chat |
| Chat title (default) | New conversation |
| New chat | New chat |
| Empty | No messages yet. Write a message below to start. |
| Responding marker | Responding |
| Error | The reply could not be finished. Try again, or write a new message. Retry |
| Latest reply | Latest reply |
| Turn headers | you; assistant |
| The stub's user turn (the views) | Show me a function that adds two numbers. |
| The stub's reply | "Here is one, with a docstring." then a Python fence of four lines (`def add(a, b):`, a docstring, `return a + b`) then "Call it with two numbers." |
| Stopped marker (the stub) | Stopped |

No "sorry", no "oops", no "something went wrong" (`003`'s voice check, `blocks.test.ts` check 7, widened to the 30 block files).

### 12. The views

`003` decision 16's machinery, with one new case.

- **The shell's views cannot sit under the `(view)` layout**, whose `<main>` would nest the shell's. A third group, `src/routes/(shell)/`, has a layout that renders only `children` and marks `document.body` with `data-view-ready` after mount; `pages.ts`'s `openView`, `axe.spec.ts` (its frame wait) and `viewer.spec.ts` (its frame wait) wait for `[data-view-ready]` on `main` or `body` (review finding 11 names the three). The shell's view routes live at `src/routes/(shell)/view/app-shell/…`; URLs stay `/view/app-shell/…`. The two groups coexist (review, EXECUTED: a conflict arises only on a shared path).
- **`/view/app-shell/` renders the shipped files** (review finding 14): it imports the block's `+layout.svelte` and renders it with `data={{ sidebarOpen: true }}` and the block's `+page.svelte` as its `children` (a layout component renders so from a page; the review EXECUTED it). So A1 to A7 read the file an app installs. The three state views compose `AppShellHeader`, `AppShellSidebar`, `AppShellFooter` and the page inside a copy of the layout's markup with the constants changed, as `003`'s state views compose a block's parts; they render no `ThemeScript` of their own.
- **`app-shell` views** (4): `/view/app-shell/` (the shipped layout and page: header, three anchor links, the example page, the footer; no sidebar, no user); `/view/app-shell/sidebar/` (`SIDEBAR = "offcanvas"`, expanded); `/view/app-shell/sidebar-icon/` (`SIDEBAR = "icon"`, collapsed); `/view/app-shell/signed-in/` (`USER` set, the account menu).
- **`chat` views** (6): `/view/chat/` (empty); `/view/chat/thread/` (four turns, the second reply holding the Python fence, `newReply` true); `/view/chat/submitted/` (one user turn, the "Responding" marker, the composer's Stop with its spinner); `/view/chat/streaming/` (`status` `streaming`, the last reply half-written, `aria-busy`); `/view/chat/stopped/` (a "Stopped" marker after a partial reply); `/view/chat/error/` (the alert with Retry).
- **`BLOCK_VIEWS`** gains the two blocks with labels: app-shell "Default", "Sidebar", "Sidebar as icons", "Signed in"; chat "Empty", "Thread", "Submitted", "Streaming", "Stopped", "Error". **28 views** (`003`'s 18 + 10). The viewer shows each at 360, 768 and 1280.
- **Pages:** 63 site pages (the catalogue and 62 item pages) and 28 views: **91 prerendered pages**.

### 13. The lint

No new rule. R14's list gains `mark-entrance` (decision 4) with one good and one bad sample: **71 bad, 48 good**. `literals.test.ts` counts **300 item files, 0 violations**. The block files are under the lint as `003` put them (`blocks.test.ts` check 6: 30 of 30 with 0 violations).

### 14. The tests

**Unit tests**: 9 files.

1. `tokens.test.ts`: `mark.orbit` is a number in em; the three `motion.entrance*` numbers are between 0 and 1 and `entranceStart + 3 × entranceStagger + entranceDot` equals 1 (`scripts/tokens.ts` validates the new keys).
2. `generated.test.ts`: `--mark-orbit: 0.5em` and the three `--motion-entrance-*` in `:root`; `@keyframes pluto-mark-dock`; `@utility mark-entrance` with 4 `nth-child` rules; `@utility groove-b`; the reduce block holds exactly 3 selectors.
3. `registry.test.ts`: 62 items (1, 3, 2, 2, 47, 7); 43 of 43 distinct dependency names resolve; 2 of 2 new blocks with `since` `"0.6.0"`, decision 3's titles, no `meta.stock`; 63 + 63 built files; 10 of 10 page files carry no `target` and build to `<block>/<base name>` (`003`'s 6 plus `app-shell/+layout.svelte`, `app-shell/+layout.server.ts`, `app-shell/+page.svelte`, `chat/+page.svelte`); 19 of 19 component targets bare and prefixed.
4. `previews.test.ts`: 62 of 62.
5. `literals.test.ts`: decision 13.
6. `blocks.test.ts`: 7 blocks, 30 files; checks 1 to 10 at the new counts (dependencies suffice for 7 of 7; 0 cross-block imports; 0 unshipped files; the link rule over 30 files, which already tolerates `#` anchors; 19 of 19 components named; 30 of 30 lint-clean; the voice regex over 30 + 2 files; `BLOCK_VIEWS` 7 blocks and 28 views with 28 route files under `(view)` or `(shell)`; the code view's mapping of 30 files; the password floor). **Its file regexes widen** (review finding 11): page files match `+(page|error|layout)(.server)?.svelte|.ts`, components `<block>-[a-z-]+.(svelte|ts)`, and check 9's `appPath` likewise. Plus check 11: `+layout.server.ts` imports nothing from `./$types` and `+layout.svelte` reads `data.sidebarOpen`.
7. `deps.test.ts`, `utils.test.ts`, `contrast.test.ts`: unchanged.

**Browser tests**: `005`'s 11 files updated.

1. `axe.spec.ts`: the 2 new item pages and the 10 views at 360, 768 and 1280, as every block page and view is scanned; plus the nav sheet open at 360 on `/view/app-shell/` and the account menu open on `/view/app-shell/signed-in/`: `005`'s 364 + 2 × 3 × 2 + 10 × 3 × 2 + 2 × 2 = **440 scans, 0 violations** (review finding 3).
2. `theme.spec.ts`: 91 × 2 = **182**.
3. `four-dot.spec.ts`: decision 5's two checks on `/view/app-shell/` (4 animations, their names, durations 495 ms, delays 135 to 405, `finished` by 900 ms with opacity 1 and the identity transform; under `reduce`, 0 animations and 4 dots at opacity 1 at `load`); on the site, after a client-side navigation from `/` to `/items/four-dot/`, 0 new `animationstart` events and the same lockup node.
4. `keyboard.spec.ts`: the catalogue's **65 stops** (the lockup, the toggle, 62 links, the footer's source link; review finding 4), no 66th; **the views' stops, written here as `003` wrote its `VIEW_STOPS`** (review finding 15), at 1280 unless said:
   - `/view/app-shell/`: the skip link, the lockup, Overview, Activity, Members, the toggle, "Open the catalogue", the source link: **8**.
   - `/view/app-shell/sidebar/`: the skip link, the lockup, the trigger, the toggle, Search, Overview, Activity, Members, Preferences, the account button, Home (the breadcrumb), "Open the catalogue", the source link: **13**.
   - `/view/app-shell/sidebar-icon/`: the skip link, the lockup, the trigger, the toggle, Overview, Activity, Members, Preferences, the account button (the search input is not rendered as icons), Home, "Open the catalogue", the source link: **12**.
   - `/view/app-shell/signed-in/`: the default's 8 with the account menu's trigger after the toggle: **9**.
   - `/view/chat/`: New chat, the region, the textarea, Send: **4**.
   - `/view/chat/thread/`: New chat, the region, the code block's copy button, its `pre`, Latest reply, the textarea, Send: **7**.
   - `/view/chat/submitted/`, `/streaming/`: New chat, the region, the textarea, Stop: **4** each.
   - `/view/chat/stopped/`: New chat, the region, the textarea, Send: **4**.
   - `/view/chat/error/`: New chat, the region, Retry, the textarea, Send: **5**.
   **70 stops over 10 views**, so **153 view stops over 28 views**; `003`'s 42 toolbar stops become 42 + 7 + 9 = **58 over 7 pages** (app-shell: 4 states, 3 widths, Open alone, the frame; chat: 6 states, 3 widths, Open alone, the frame). Behaviours, one test each, **8**: (1) Enter on the skip link focuses `main#main`; (2) at 360 on `/view/app-shell/`, Enter on the menu button opens the sheet named "Pluto app" with focus on its first link, Escape returns focus; (3) on `/signed-in/`, Enter on the account menu opens it with focus on its first item, Escape returns focus; (4) on `/sidebar/`, Enter on the trigger sets `aria-expanded="false"` and makes the `nav` `inert`, Enter again restores; (5) on `/view/chat/thread/`, Enter on Latest reply moves focus to the last `h3` reading "assistant"; (6) on `/view/chat/`, typing and Enter appends a user turn and the status reads "Responding"; (7) then Escape stops: a marker "Stopped" and the status "Stopped"; (8) on `/view/chat/error/`, Enter on Retry sets the status "Responding".
5. `blocks.spec.ts`: plus, in both themes: (A1) landmarks on `/view/app-shell/`: 1 `banner`, 1 `navigation` "Primary", 1 `main` with `id="main"` and `tabindex="-1"`, 1 `contentinfo`; on `/sidebar/` 1 `navigation` "Main" and 0 "Primary"; (A2) the header row computes 64 px at 360 and 1280; the header's bottom edge is `--groove-line` with the light below it in light and alone in dark (pixel sample as the sidebar memo's); (A3) the footer: a `time` with a `datetime`, the commit in a `code` and not all digits, "doc" with `PS-DS-0006`, the source link's `href`, 0 `statement` paragraphs, the footer's lockup is not a link; (A4) the tagline reads "Work runs on data." once; (A5) at 360 the primary nav is hidden and the menu button opens a dialog named "Pluto app" holding the 3 links; (A6) the shipped page at `/view/app-shell/` has exactly one `h1`, and the head holds one theme script; (A7) the link with `aria-current="page"` computes `text-decoration-line: underline` and the others do not; (C1) `/view/chat/`: the `Empty` text, the hidden `h1` "Chat", the `h2`, the composer; (C2) `/view/chat/thread/`: 4 headings at level 3 reading "you" and "assistant", the second reply holding one `code-block` at `sm` with `text-code-` spans and 0 `style`, the bubble on `--muted`, the prose column at most 75 ch; and at 360 × 640 the region's `scrollHeight` exceeds its `clientHeight` and the composer's bottom equals the viewport's; (C3) `/view/chat/streaming/`: the log's `aria-busy="true"`, the composer's button named "Stop response", Latest reply absent; `/submitted/`: the marker "Responding" with no icon, the button's spinner; (C4) `/view/chat/stopped/`: a marker reading "Stopped" and the button "Send message"; (C5) `/view/chat/error/`: an alert with the title, no `role`, and a "Retry" button; (C6) reflow at 320 on the 10 views and the 2 item pages; (C7) no loop on the 12; (C8) targets at 360 on every stop; (C9) rings unclipped on the 10 views.
6. `viewer.spec.ts`: 7 block item pages; the state buttons for 6 blocks with more than one view: **17 + 4 + 6 = 27** (review finding 5); the theme follow 21 of 21; the code view's summaries 30.
7. `navigation.spec.ts`, `chat.spec.ts`, `code.spec.ts`, `primitives.spec.ts`, `tokens.spec.ts`: unchanged, except `primitives.spec.ts`'s loop and height checks widen to the 2 new pages.

**Smoke tests**: `blocks-add.test.ts` widens to `add hero sign-in sign-up page-states settings app-shell chat -y -o`, with ten numbered assertions (review finding 15): (1) the `add` exits 0; (2) the 14 files land at `src/routes/app-shell/+layout.svelte`, `+layout.server.ts`, `+page.svelte`, `src/lib/components/app-shell-*.svelte` ×6, `src/routes/chat/+page.svelte`, `src/lib/components/chat-*` ×4, beside `003`'s; (3) the scratch app's `vite.config.ts` is **not** given decision 8's lines (the scratch has no repository and no `@types/node`; review finding 1), and `vite build` exits 0; (4) `build/app-shell.html` holds one `h1`, the skip link as the first element of `body`, a `footer`, and **no `commit` and no `built` row** (Kit's default version name is all digits); (5) `build/chat.html` holds one `h1`; (6) `svelte-check` 0 errors; (7) the lint 0 violations over the landed files; (8) `app.css` holds `@utility mark-entrance` with its four nested rules, `@utility groove-b`, and a reduce block of exactly 3 selectors (the CLI's merge of nested rules, not yet executed); (9) `registry-add.test.ts`'s own reduce-block assertion is updated to 3 selectors (review finding 11); (10) a second `add` is byte-identical. **10 × 2 = 20.**

**If a deferrable view is deferred** (decision 19): 1 view, 1 page, 6 axe scans, 2 theme checks, 1 state button and its stops leave the counts, and the Landing notes say which.

### 15. The version: 0.6.0, and the changelog

- `package.json`'s `version` becomes **`0.6.0`**: two blocks, an optional prop on `four-dot`, additive theme changes. `static/v0.6.0/` is built and committed with the release.
- `CHANGELOG.md` gains `## 0.6.0 — <landing date>` above `0.5.0`: `app-shell` new; `chat` new; `pluto-theme` additive (`--mark-orbit`, the three entrance numbers, `pluto-mark-dock`, `mark-entrance`, `groove-b`, the reduce rule); `four-dot`: changed, not an interface change (`entrance`); the preview site's footer. `registry.test.ts` checks the entry names 4 of 4 and the older entries are unchanged.

### 16. The preview site adopts the shell's parts

- `src/routes/(site)/+layout.svelte`: the lockup takes `entrance`; the header's edge becomes `groove-b` in place of `border-b border-border`; the layout renders `AppShellFooter` after `main` with this repository's commit (`$app/env`'s `version`), its commit date (`VITE_BUILT_AT`), `sourceHref` `https://github.com/plutosystemsco/design-system`, no `docId`, no `statement`. `vite.config.ts` gains decision 8's guarded lines; `dev-loop.test.ts` runs a copy with no `.git`, which is why they are guarded. *Why:* the site is the one app we run; the entrance and the footer are then seen on every page by the development walk, and `four-dot.spec.ts` tests "one per page" on it.
- The skip link is **not** added to the site: the site's header has two stops before the catalogue, and `003`'s catalogue-stop tests count from the lockup. The item page for `app-shell` is where the skip link is tested.
- The catalogue's stops become 65 (decision 14).

### 17. The item pages

`003` decision 17's four sections, through `BlockPage`. The `app-shell` page's accessibility list: the skip link, the landmarks, the one entrance and reduce, the header's 64 px, the sticky line for `app.css`, the cookie read, the footer's rows and the scheme, the sentence. The `chat` page's: the log's two names, what is announced and what is not, "Latest reply", the composer's keys, the error, no avatars, no markdown.

### 18. What `wasi-python-dev` and the next app take

- **`wasi-python-dev`**: `app-shell`'s layout moved to its root with `SIDEBAR = false` on the home page and the footer's values from its own build (its constitution §2's footer: the wasi-python version and build date, links to the docs, PyPI, the repository and the changelog, the privacy note: those are its page's content under the shell's furniture, or extra rows the app adds to the `dl`); `/admin` with `SIDEBAR = "offcanvas"`. Its doc IDs are its own series.
- **The next app's chat page**: `chat`'s pane with a real transport replacing the stub, and `marked` if it wants markdown (chat memo §6.4).

### 19. Build order

1. **The token and the theme** (decision 4): `tokens.ts`, `build-tokens.ts`, `generated.test.ts`, `tokens.test.ts`; version to 0.6.0.
2. **`four-dot`'s `entrance`** (decision 5), the site's adoption (decision 16: the lockup, `groove-b`, `vite.config.ts`), `four-dot.spec.ts`.
3. **`app-shell`** (decisions 6 to 9), its views, the `(shell)` group, `openView`, A1 to A6.
   - **Checkpoint: a review after step 3.** Screenshots of `/view/app-shell/` at 360, 768 and 1280 in both themes at 0, 300, 600 and 900 ms of the entrance and under reduce; the groove under the header; the footer wrapped at 360; the sheet at 360; the sidebar views. *Why here:* the shell is what every app page sits in.
4. **`chat`** (decision 10), its views, C1 to C9.
5. **Registry, catalogue, viewer, the site footer's test**; `blocks.test.ts`; `viewer.spec.ts`.
6. **Browser and smoke suites** in full; `CHANGELOG.md`; the development walk.

**If time runs short**, deferrable and recorded: the `sidebar-icon` view (the `sidebar` view stays), and the `error` chat view; decision 14's last paragraph says what each takes with it. Nothing else.

### 20. Calls this specification leaves to others

- **placeholder: needs a memo — the chat pane on iOS Safari**: `dvh`, the on-screen keyboard and the composer's position (patterns memo §5.4). Blocks nothing here.
- **The favicon and the icon files**: the owner's colour-on-ink call; a `registry:file` item and one line of `app.html` when made (entrance memo §6).
- **A right-hand sidebar** (`groove-e`).
- **A notices region** (`005` decision 21).
- **A markdown item** on `marked`, when an app asks.
- **The sticky header's `scroll-padding-top`** stays one documented line in the app's CSS until a shell can set it without a `<style>` block.

## Design

```
tokens/pluto.tokens.json   mark.orbit 0.5; motion.entranceDot .55, entranceStart .15, entranceStagger .1
pluto-theme css            @keyframes pluto-mark-dock; @utility mark-entrance (4 nth-child delays/offsets);
                           @utility groove-b; reduce block: .mark-entrance [data-slot=four-dot-dot] { animation: none }
ui/four-dot                FourDot/Lockup entrance?: boolean → class mark-entrance

blocks/app-shell/+layout.svelte      [SidebarProvider column >] SkipLink · Header(trigger when SIDEBAR) · (main#main | div.flex > AppShellSidebar + SidebarInset) · Footer; ThemeScript
blocks/app-shell/+layout.server.ts   load: sidebarOpen from cookie sidebar_state
blocks/app-shell/+page.svelte        the example page: h1, two sections with ids
components/app-shell-skip-link       a[href=#main] sr-only focus:not-sr-only
components/app-shell-header          header.groove-b > row h-16: Lockup entrance text-2xl · nav "Primary" (md+) · ThemeToggle · UserMenu · Menu button → Sheet(start)
components/app-shell-nav             ul of Button link; aria-[current=page]:underline
components/app-shell-user-menu       DropdownMenu on Avatar sm; heading name/email; Settings; Sign out
components/app-shell-sidebar         Sidebar label=Main; groups mono lowercase; current by hash
components/app-shell-footer          footer.groove > row: Lockup (no href) text-2xl + "Work runs on data." · dl mono: commit (not all digits), built <time>, doc, source · p statement?

blocks/chat/+page.svelte             the stub transport
components/chat-pane                 h-dvh column: h2 title · New chat · MessageLog(min-h-0 flex-1, busy) > Empty | ChatTurn* · Marker "Responding" (no icon) · Alert(role=null) error+Retry · Latest reply (newReply) · groove bg-card shrink-0 > Composer
components/chat-turn                 Message(align) > MessageHeader h3 "you"|"assistant" > MessageContent(bubble|plain) > ChatText; marker → Marker separator
components/chat-text                 fence splitter: p.whitespace-pre-wrap | CodeBlock sm (header lang, copy, content code language)
components/chat-types.ts             ChatRole, ChatMessage, ChatStatus
```

## Scope

**In:** the token and the theme additions; `four-dot`'s prop; the 14 files of the two blocks and their 2 entries; the 10 views and the `(shell)` group; 2 item pages; the site's footer, entrance, `groove-b` and `vite.config.ts`; tests as decision 14; version 0.6.0; the changelog; `static/` rebuilt.

**The step to *done***: `wasi-python-dev` installs `app-shell` and its home page sits in it (constitution §4.2).

**Out:** the favicon; a markdown renderer; a right-hand sidebar; a notices region; the skip link on the preview site; deployment; any change to a `001` to `005` item other than `four-dot`'s prop and `pluto-theme`'s additions.

## Acceptance criteria

Each is a count, checked by the command named. Criteria 1 to 23 make `006` *built*; criterion 24 makes it *done*.

1. **Install.** `bun install --frozen-lockfile` exits 0 on a clean clone; `deps.test.ts` 32 packages.
2. **Checks.** `bun run check` 0 errors, 0 warnings; `bun run lint` exit 0.
3. **Tokens.** `build:tokens` twice changes 0 files; `tokens.test.ts` finds `mark.orbit` and the three entrance numbers summing to 1; `generated.test.ts` finds the keyframes, the two utilities, the four `nth-child` rules and 3 reduce selectors.
4. **Registry source.** 62 items (1, 3, 2, 2, 47, 7); 43 of 43 dependency names resolve; 2 of 2 new blocks with `since` `"0.6.0"`; 10 of 10 page files without `target`; 19 of 19 components prefixed.
5. **Registry build.** 63 + 63 files; 62 of 62 parse; 0 `#lib`; 0 `~/` or `src/` targets.
6. **Site build.** `bun run build` exits 0 with 91 prerendered pages; `build/index.html` holds the footer with this repository's commit.
7. **Dev server.** `/r/styles/maia/index.json` answers 200 with 62 items.
8. **Preview pages.** 62 of 62.
9. **The lint.** 300 item files, 0 violations; 71 of 71 bad; 0 of 48 good; 30 of 30 block files clean.
10. **Blocks.** `blocks.test.ts` checks 1 to 11 at decision 14's counts, with its widened file regexes.
11. **axe.** 440 scans, 0 violations.
12. **Themes.** 182 of 182.
13. **The entrance.** `four-dot.spec.ts`: 4 of 4 animations finishing by 900 ms under `no-preference`; 0 animations and 4 of 4 dots composed at `load` under `reduce`; 0 replays after 1 client-side navigation on the site; in 2 of 2 themes.
14. **Keyboard.** The catalogue's 65 stops; 70 view stops over the 10 new views (153 over 28), every ring unclipped; 58 toolbar stops over 7 pages; 8 of 8 behaviours.
15. **The shell.** `blocks.spec.ts` A1 to A7 in 2 of 2 themes.
16. **The chat.** C1 to C5 in 2 of 2 themes.
17. **Reflow, loops, targets, rings.** C6 12 of 12 at 320; C7 0 loops; C8 0 stops under 24 × 24; C9 rings unclipped on 10 of 10 views.
18. **The viewer.** `viewer.spec.ts` on 7 pages: 27 state buttons, 21 theme follows, 30 code summaries.
19. **Smoke.** `blocks-add.test.ts` 20 of 20; `001`'s to `005`'s smoke files pass.
20. **Test files.** `bun run test` exits 0: 9 unit, 11 browser × 2, 6 smoke.
21. **Release.** `version` `0.6.0`; the changelog's `0.6.0` names 4 of 4; older entries unchanged.
22. **The checkpoint and the walk.** The Landing notes record the review after step 3 and the walk of 91 pages × 2 themes: 0 of 182 loads with an error.
23. **The site.** The site's lockup runs the entrance once per load and its footer shows the commit, in 2 of 2 themes.
24. **In the app (done).** `wasi-python-dev` installs `app-shell` and its home page sits in the shell; the Landing notes cite its commit: 1 of 1.

## Landing notes

- **Built:** 2026-11-01, in the working tree over `616b8a0` (`005`, `v0.5.0`); committed and tagged by the owner. The change review is [`../reviews/006-the-app-shell-and-the-chat-pane-pr-2026-11-01.md`](../reviews/006-the-app-shell-and-the-chat-pane-pr-2026-11-01.md): "Does not land yet" on 3 Medium and 5 Low findings; all 8 dispositioned, 7 fixed in the tree and 1 (the Landing notes) this. The design calls are in `decisions.md` ("The design calls for `006`", "After the `006` spec review", "After the `006` build's checkpoint", "After the `006` build's run 2", "After the `006` change review").
- **Done:** *pending.* Criterion 24 waits on `wasi-python-dev`.

**What the orchestrating session saw, under Bun 1.3.14, 2026-11-01** (EXECUTED by the builder after the fixes; the reviewer re-ran the suites before the fixes at the same counts less the tests the fixes added):

| Check | Result |
|---|---|
| `bun run check` | 1642 files, 0 errors, 0 warnings |
| `bun run lint`, `bun scripts/lint-literals.ts` | exit 0; 0 literals in 300 item files |
| `bun run build:tokens`, twice | the second run changes 0 files |
| `bun run build:registry`, `bun run build` | 63 + 63 byte-identical registry files; 91 prerendered pages (63 site, 28 views); `build/index.html` holds `616b8a0` and its commit date |
| `bun run test` | unit 493 pass (10 files); browser 1274 passed, 0 failed (11 files × 2 projects); smoke 90 pass (6 files; `blocks-add` 22 of 22 after the fixes) |

**Criteria, as counted at landing:**

| # | Count |
|---|---|
| 1 | frozen install no changes; 32 packages |
| 2 | 0 errors, 0 warnings; lint exit 0 |
| 3 | second `build:tokens` changes 0 files; `mark.orbit` 0.5 and the three numbers (0.55, 0.15, 0.1; 495 ms, delays 135/225/315/405); the reduce block's 3 selectors |
| 4 | 62 items, types 1, 3, 2, 2, 47, 7; 43 of 43 dependency names; 2 of 2 `since` `0.6.0`; 42 `meta.stock` |
| 5 | 63 + 63 byte-identical; 62 of 62 parse; 0 `#lib`; 0 rooted targets |
| 6 | 91 pages; the footer with this repository's commit and date |
| 7 | 200 with 62 items |
| 8 | 62 of 62 |
| 9 | 300 files, 0 violations; 71 of 71 bad, 0 of 48 good; 30 of 30 block files clean |
| 10 | checks 1 to 11 at 7 blocks, 30 block files (10 pages + **20** components; decision 3's 19 was a slip) |
| 11 | 440 scans, 0 violations |
| 12 | 182 of 182 |
| 13 | 4 of 4 animations, 495 ms, the last ending at 900.0 ms; 0 under reduce with 4 dots composed at load; 0 replays after a client-side navigation |
| 14 | 65 catalogue stops; 70 view stops over the 10 new views (153 over 28), rings unclipped; **62** toolbar stops over 7 pages (decision 14's 58 left out Open alone and the frame); 8 behaviours |
| 15 | A1 to A7 in 2 of 2 themes, plus A1b (the sticky header and the sidebar under it) and A1c (the caret) |
| 16 | C1 to C5 in 2 of 2 themes, plus C10 (the log's height holds when "Latest reply" appears) |
| 17 | C6 12 of 12 at 320; C7 0 loops; C8 0 stops under 24 × 24; C9 rings unclipped |
| 18 | 7 pages: 27 state buttons, 21 theme follows, 30 code summaries |
| 19 | `blocks-add` 22 of 22 (231 files); the older five files pass (one `dev-loop` watcher flake in one full run, green alone and in the other runs) |
| 20 | 10, 11 and 6 files; exit 0 |
| 21 | `0.6.0`; the changelog names app-shell, chat, pluto-theme (additive) and four-dot (changed, not an interface change) |
| 22 | notes 1 and 3 |
| 23 | the site's lockup runs the entrance once per load; its footer shows the commit, in 2 of 2 themes |
| 24 | open: `wasi-python-dev` |

**Notes:**

1. **The checkpoint after build step 3.** The builder stopped with the token, the theme additions, the entrance prop, the site's adoption and the shell built, 1148 browser tests green, and 60 screenshots. The orchestrator's reading: at 300 ms the blue and red dots are mid-dock and the amber and green not yet begun; at 900 ms the mark is composed; under reduce the composed mark at load; the header's groove reads the sidebar memo's seam pixels turned to the bottom edge; the footer at 360 wraps to one column. One fault: with a sidebar, the account row at the sidebar's foot was cut by the header's height at load. The call (decisions.md): beside a sidebar the header is sticky, and the sidebar sits under it with `md:top-16 md:pb-16`.
2. **The change review's findings applied.** `data-shell` attributes; the fence splitter rewritten with its unit file; no "unknown" commit; `data-[state=open]` for the caret, here and in two `005` files; A1b's assertion; three lines of copy; the "Latest reply" row at a held height.
3. **The development walk.** 91 pages on `vite dev` in both themes, every page warmed first, a fresh page per load: 0 of 182 loads with a page error or a console error or warning.
4. **Provenance.** No stock file: the 14 block files are composed from this registry's items. `four-dot` keeps `since 0.1.0`; `pluto-theme` is additive.
5. **Where the build bends a decision, and who allowed it.** Each the least that works; all seen by the review and judged sound. The design calls are in `decisions.md`; the rest, by the builder:
   1. *The validator caps the entrance at the budget (≤ 1) and the test pins the sum at 1*; *`mark-entrance`'s nested rules target child dots*; *the header's box is 65 px with its hairline*, A2 reads the row.
   2. *With a sidebar the header shows no account menu*: the account lives in the sidebar's footer and opens the same menu through a `trigger` snippet; *the Preferences group is closed by default*; *the account trigger is named by `sr-only` text* (axe's label-content-name-mismatch); *the nav sheet closes in `afterNavigate`*.
   3. *The shipped `sourceHref` is this registry's repository, with a comment*; *A3's doc row is asserted on the signed-in view* (the shipped layout passes none).
   4. *The three shell state views share one preview component*; *`signature()` ignores aria-hidden text*; *the footer's source link wraps at 320 px*; *under reduce, `getAnimations()` holds three 0.01 ms `max-width` transitions from `001`'s catch-all, so the test counts `pluto-mark-dock` animations*.
   5. *A sticky sidebar holds only while the page is taller than it*: the example page is shorter, so A1b lengthens `main` before scrolling.
   6. *The chat's parts are `data-chat` attributes*; *the message log's wrapper is sized through `*:min-h-0 *:flex-1` on the pane's row*; *the stub's fence is three lines*; *the streaming view's half-written reply is prose* (an open fence would add two stops); *the chat state views carry a `<title>`* (axe `document-title`).
   7. *The viewer's theme shim keeps the real `MediaQueryList`* (its spread dropped `addEventListener`, which the shell view's theme store needs); *exact state labels* ("Sidebar" is a prefix of "Sidebar as icons").
   8. *The smoke's `landed()` learns hooks and libraries; assertion 9 reads the merged `app.css` through a CSS helper*; *the unit test for the splitter extracts the module script from the `.svelte` file*, since bun cannot load one and the script is pure.
   9. *The sticky header beside a sidebar; the sidebar under it; `data-shell`; no "unknown"; the held "Latest reply" row.* The design lead.
6. **For `007` and the app.**
   - The shell is a layout the app moves to its root by hand; its constants sit at the top; the `vite.config.ts` lines are guarded and a build without git shows no commit and no built row.
   - With a sidebar the header is sticky and the sidebar sits under it; an app with a sticky header and no sidebar adds the `scroll-padding-top` line to its `app.css`.
   - The chat pane takes turns and a status and gives back `onsend`, `onstop`, `onnew`, `onretry`; fenced code becomes `code-block` at `sm`; the splitter is exported as `splitFences`.
   - bits-ui writes `data-state`, never `data-open`; a variant on the latter is dead.
   - The reduce block now holds three rules; an app that re-adds `pluto-theme` gets the third.
