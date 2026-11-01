# 005 — Overlays, navigation and the chat primitives

- **Status:** built, reviewed and released as `v0.5.0` (`616b8a0`). Its specification review is [`../reviews/005-overlays-navigation-and-the-chat-primitives-spec-2026-11-01.md`](../reviews/005-overlays-navigation-and-the-chat-primitives-spec-2026-11-01.md) (17 findings, all fixed here).
- **Date:** 2026-11-01
- **Author:** the design lead
- **Kind:** eleven registry items (`theme`, `dropdown-menu`, `sheet`, `dialog`, `breadcrumb`, `sidebar`, `is-mobile`, `message-log`, `message`, `marker`, `composer`); one utility added to `pluto-theme`; tests; the 0.5.0 release
- **Depends on:** [`004`](./004-code-and-data.md), _built_ (`b3d2a8e`, `v0.4.0`), and through it [`003`](./003-the-first-blocks.md) (`fb942f8`, `v0.3.0`), [`002`](./002-the-primitives-forms-surfaces-and-feedback.md) (`7857ea4`, `v0.2.0`) and [`001`](./001-tokens-and-the-registry.md) (`33e94de`, `v0.1.0`).
- **Blocks:** `006`, the app shell (the header's menu and mobile sheet, the sidebar, the theme toggle) and the chat pane (the log, the turns, the composer).
- **Research it stands on:**
  - [`../research/2026-11-01-the-overlay-items-dropdown-menu-sheet-dialog-breadcrumb-and-the-toast-question.md`](../research/2026-11-01-the-overlay-items-dropdown-menu-sheet-dialog-breadcrumb-and-the-toast-question.md) (the overlays memo)
  - [`../research/2026-11-01-the-sidebar-is-mobile-and-the-shells-navigation.md`](../research/2026-11-01-the-sidebar-is-mobile-and-the-shells-navigation.md) (the sidebar memo)
  - [`../research/2026-11-01-the-chat-primitives-the-composer-and-field-sizing.md`](../research/2026-11-01-the-chat-primitives-the-composer-and-field-sizing.md) (the chat memo)
  - [`../research/2026-10-28-the-blocks-patterns-and-accessibility.md`](../research/2026-10-28-the-blocks-patterns-and-accessibility.md) (the patterns memo), §1, §5, §8.1, §8.5
  - [`../research/2026-10-28-the-primitives-the-blocks-and-the-home-page-need.md`](../research/2026-10-28-the-primitives-the-blocks-and-the-home-page-need.md) (the primitives memo), §3, §6.4
- **Design calls:** `../decisions.md`, "The design calls for `005`, overlays, navigation and the chat primitives" (2026-11-01), and "The theme mechanism, the doc-ID scheme and the footer's sentence" (2026-11-01).

## Intent

`006` is the app shell and the chat pane, the two blocks the owner asked for on 2026-10-28 and the split decision put last. Nothing in the registry yet opens a menu, slides in a panel, lays out a sidebar, or holds a conversation. This specification adds what those two blocks compose, so that `006` can be written from the registry alone, as `003` was written from `002`.

Four memos were run, and four things in them decide the shape of this work.

1. **Every overlay takes the chrome `004` gave `popover` and `002` gave `alert-dialog`.** The five stock overlay items fail the lint 108 times in 23 of their 50 files, almost all on the same four things: `tw-animate-css` classes, the translucent ring, preset shadows and the blurred `bg-black/80` scrim (overlays memo §1.2, §2.1, EXECUTED). Each has one answer already in the registry: `shadow-elevation`, `bg-scrim`, `animate-enter` and `animate-exit`. A sheet is a dialog fixed to an edge (the same eleven files, §2.1), so `dialog` is served beside it for the price of one class string.
2. **The stock sidebar is restyled hard, and two of its parts go.** Its mouse-only 16 px rail fails the 24 px target rule, and its off-canvas collapse leaves 33 invisible links in the tab order (sidebar memo §2.4, §2.7, EXECUTED). Its mobile sheet, on the other hand, is a sound modal dialog that returns focus to the trigger in every run (§2.5), which the patterns memo had doubted. The sidebar becomes a `nav` landmark on the paper ground, set apart by a vertical groove that the memo drew and sampled pixel by pixel (§4.1).
3. **Three things are ours to write:** a theme mechanism (the owner's answer of 2026-11-01: "build what you can for now"), a conversation log, and a composer. The stock `message-scroller` is a thin wrapper over a package that is 28 days old at version 0.0.1 (chat memo §1.1); its follow-bottom rules are sound and are kept as the list of cases to prove in about sixty lines of our own (§1.7). The composer has no stock item at all; the memo lists its eleven behaviours (§3.7), and proves the one that most needs proving: a naive Enter handler sends while an input method editor is composing, in all three engines (§3.4).
4. **Two things are declined.** `sonner`, because every accessibility source puts the burden on the implementer to remove the timer, the tab stop per toast and the end-of-page placement, which is most of what the library is (overlays memo §4.2, §4.4); `003`'s inline pattern stands. And `bubble`, because its seven variants reduce to one `muted` inset once the relative-colour tints and the solid `primary` fill are refused (chat memo §2.2); the one variant becomes a prop of `message`.

`field-sizing: content` is proven in Chromium, WebKit and Firefox (chat memo §4, EXECUTED), which settles the question `002` decision 13 left and lets the composer grow by CSS alone.

**Not here:** the app shell and the chat pane blocks (`006`); `sonner` and any toast (decision 14); `bubble` as an item; the stock scroller's package; a markdown renderer (the chat memo §6.4: fenced code is `006`'s, markdown is an app's); `navigation-menu`, `command`, `drawer`, `hover-card`, `menubar`, `context-menu`; the skip link (it is the shell's, `006`); deployment.

**Terms of art.** An _overlay_ is a surface that opens above the page: a menu, a sheet, a dialog. A _sheet_ is a modal dialog fixed to one edge of the viewport. A _modal_ dialog blocks the page behind it until it closes. A _disclosure_ is a button that shows and hides a region and says which with `aria-expanded`. A _landmark_ is a region assistive technology lists and jumps to (`banner`, `navigation`, `main`, `contentinfo`). A _log_ is the ARIA role for a region where entries are added in order. _Follow-bottom_ is a scroll box that keeps its end in view as content arrives, until the reader scrolls away. The _composer_ is the form a person writes a chat message in. An _IME_ is an input method editor; while it composes, Enter confirms a candidate, not the message.

## Decisions

Each decision gives its reason. A reviewer checks the reason as much as the rule.

### 1. Scope: eleven items, one theme utility, and nothing else

| Item            | Type            | From             | Group        |
| --------------- | --------------- | ---------------- | ------------ |
| `theme`         | `registry:ui`   | ours             | `foundation` |
| `dropdown-menu` | `registry:ui`   | stock, restyled  | `navigation` |
| `sheet`         | `registry:ui`   | stock, restyled  | `navigation` |
| `dialog`        | `registry:ui`   | stock, restyled  | `navigation` |
| `breadcrumb`    | `registry:ui`   | stock, restyled  | `navigation` |
| `sidebar`       | `registry:ui`   | stock, restyled  | `navigation` |
| `is-mobile`     | `registry:hook` | stock, unchanged | `navigation` |
| `message-log`   | `registry:ui`   | ours             | `chat`       |
| `message`       | `registry:ui`   | stock, restyled  | `chat`       |
| `marker`        | `registry:ui`   | stock, restyled  | `chat`       |
| `composer`      | `registry:ui`   | ours             | `chat`       |

- **Why these eleven:** the split decision named `dropdown-menu`, `sheet`, `sidebar`, `breadcrumb`, `sonner`, `mode-watcher` and "the chat primitives" for `005` (decisions.md, 2026-10-28). `is-mobile` and `sheet` are what `sidebar` depends on (sidebar memo §5). `dialog` is `sheet` without a side (overlays memo §2.5). The chat primitives are the four the patterns memo §8.5 composes. `theme` replaces `mode-watcher` (decision 6). `sonner` is declined (decision 14).
- **Why `dialog`, which no block names yet:** constitution §4.2 adds a component when an app needs it. `sheet` and `dialog` are the same eleven stock files with one class string and one prop apart (overlays memo §2.1, EXECUTED). Serving one and not the other saves nothing and leaves `006` with no plain modal for a rename or a non-destructive confirm, which `alert-dialog` cannot hold (its role is for a message that needs a response). `006` names its consumer; if none appears, the item costs eleven small files.
- **Nothing in `001` to `004` changes** except `pluto-theme` (additive, decision 5) and the preview app's own theme code, which adopts the `theme` item (decision 16). No existing item's file is edited.

### 2. The packages: none new

Every package these items import is already held: `bits-ui` 2.20.2, `@internationalized/date` 3.12.4, `tailwind-variants` 3.3.1, `phosphor-svelte` 3.1.1 (`002` decision 2). `package.json` keeps **32 packages**; `deps.test.ts` keeps its count. Three packages were weighed and not added:

| Package                           | Why not                                                                                                                                                                                                                                                                                       |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mode-watcher` 1.1.0              | last released 2025-06-28; installs its own older `runed` and `svelte-toolbelt`; a tri-state version of the twelve-line head script this repository already runs (overlays memo §4.5). The owner left the call to the design lead (decisions.md, 2026-11-01); decision 6 ships source instead. |
| `svelte-sonner` 1.2.2             | declined with `sonner` (decision 14; overlays memo §4.1 to §4.4).                                                                                                                                                                                                                             |
| `@shadcn-svelte/primitives` 0.0.1 | 28 days old, two releases, four transitive packages, 44 KB of scroller for one short thread (chat memo §1.1, §1.7). Decision 11 writes the scroller.                                                                                                                                          |

The `tailwind-variants` items become **14**: `004`'s 11 and `sidebar` (its menu button, as stock), `marker` (its variants, as stock) and `message`, which names the package by our restyle, not by stock: decision 12 writes `MessageContent`'s variants with `tv` from `tailwind-variants/lite`, as `button` does (review finding 11).

### 3. The install procedure and provenance

`002` decision 4 is followed as written, with these parameters.

1. Snapshot the working tree (`git ls-files -co --exclude-standard`, SHA-256 each file) into a temporary folder.
2. One run: `bun --bun node_modules/.bin/shadcn-svelte add dropdown-menu sheet dialog breadcrumb sidebar message marker -y`. No `-o`. `sidebar` pulls `is-mobile`, `sheet`, `input`, `tooltip`, `skeleton`, `separator` and `button`; `sheet` and `dialog` pull `button`; `message-scroller` and `bubble` are **not** named (decisions 11 and 12). If the CLI asks to overwrite `button`, `input`, `tooltip`, `skeleton`, `separator` or any other existing file, the answer is **no**.
3. Compare against the snapshot. Allowed differences: new files under `src/lib/registry/ui/<name>/` for the seven, `src/lib/registry/hooks/is-mobile.svelte.ts`, and `package.json` and `bun.lock` (which should not change: decision 2; if the CLI adds a package, it is removed and the lock restored). Anything else is restored.
4. Record provenance: each of the **8** stock-derived items (`dropdown-menu`, `sheet`, `dialog`, `breadcrumb`, `sidebar`, `is-mobile`, `message`, `marker`) carries `meta.stock` with `002` decision 5's five fields, `cli` `1.7.1`, the install date, and the SHA-256 of `curl -s https://shadcn-svelte.com/registry/styles/maia/<item>.json`. The Landing notes record which of the 8 live files differ from the clone at `6149e14`.
5. Restyle by `002` decision 9's checklist (R1 to R24) and decisions 7 to 12. Extensionless `#lib` imports.
6. List each item in `registry.json` (decision 4).

`theme`, `message-log` and `composer` are written from scratch and carry no `meta.stock`. `is-mobile` is served as the CLI wrote it: 0 lint findings, 9 lines (sidebar memo §3.1).

### 4. The registry entries

**Order and groups.** Two groups are added, `navigation` and `chat`, after `data` and before `blocks`. `theme` joins `foundation` after `four-dot`.

| #     | Group            | Items                                                                                                                   |
| ----- | ---------------- | ----------------------------------------------------------------------------------------------------------------------- |
| 1–7   | `foundation`     | `pluto-theme`, `font-geist`, `font-heading-ibm-plex-sans`, `font-jetbrains-mono`, `utils`, `four-dot`, **`theme`**      |
| 8–12  | `actions`        | `button`, `tooltip`, `kbd`, `toggle`, `toggle-group`                                                                    |
| 13–21 | `surfaces`       | `card`, `separator`, `item`, `table`, `tabs`, `collapsible`, `avatar`, `popover`, `accordion`                           |
| 22–29 | `feedback`       | `alert`, `alert-dialog`, `badge`, `empty`, `skeleton`, `spinner`, `status`, `error-summary`                             |
| 30–39 | `forms`          | `label`, `field`, `input`, `textarea`, `input-group`, `native-select`, `checkbox`, `radio-group`, `switch`, `input-otp` |
| 40–43 | `code`           | `code-block`, `code-editor`, `highlighter`, `use-highlighted-code`                                                      |
| 44–45 | `data`           | `chart`, `meter`                                                                                                        |
| 46–51 | **`navigation`** | **`dropdown-menu`**, **`sheet`**, **`dialog`**, **`breadcrumb`**, **`sidebar`**, **`is-mobile`**                        |
| 52–55 | **`chat`**       | **`message-log`**, **`message`**, **`marker`**, **`composer`**                                                          |
| 56–60 | `blocks`         | `hero`, `sign-in`, `sign-up`, `page-states`, `settings`                                                                 |

**60 items.** Types: 1 `registry:theme`, 3 `registry:font`, 2 `registry:lib`, 2 `registry:hook`, 47 `registry:ui`, 5 `registry:block`. Ten groups; the catalogue's headings are "Navigation" and "Chat" (decision 16).

- _Why `navigation` holds the overlays:_ a menu, a sheet and a dialog are how a person moves between places and tasks in an app shell; `popover` stays a surface (it anchors a note to a button). A reader looking for "how do I make a menu" and one looking for "how do I make a sidebar" are the same reader.
- _Why `theme` is foundation:_ it is what every page of an app needs before any component, as the fonts are.

**Each new item** has `title`, a one-sentence `description`, `001`'s `author`, `meta.since` `"0.5.0"`, `meta.group`, and for the 8 stock-derived items `meta.stock`. The titles and descriptions are shipped copy:

| Item            | `title`       | `description`                                                                                                                                                  |
| --------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `theme`         | Theme         | The light and dark switch: a head script that sets the theme before paint, a store that follows the system until a choice is made, and a toggle button.        |
| `dropdown-menu` | Dropdown menu | A menu opened from a button, on the elevation shadow, moved by the arrow keys, with check and radio items and a shortcut written in words.                     |
| `sheet`         | Sheet         | A modal panel fixed to one edge of the screen, named by its title, behind the scrim, that returns focus when it closes.                                        |
| `dialog`        | Dialog        | A modal window named by its title, behind the scrim, for a task that must finish before the page goes on.                                                      |
| `breadcrumb`    | Breadcrumb    | The path to the current page as a list of links, the current page marked and not a link.                                                                       |
| `sidebar`       | Sidebar       | A navigation landmark on the paper ground, set apart by a vertical groove, that collapses off-canvas or to icons and becomes a sheet on a phone.               |
| `is-mobile`     | Is mobile     | A media-query store that is true below 768 px and false on the server.                                                                                         |
| `message-log`   | Message log   | A scroll box named "Messages" holding a named log, that follows new content until the reader scrolls away, with a button back to the end.                      |
| `message`       | Message       | One turn of a conversation: a heading that says who, the content as full-width prose or a bubble on the muted inset, and a footer.                             |
| `marker`        | Marker        | A line in a conversation that is not a turn: a status, a divider, a note.                                                                                      |
| `composer`      | Composer      | The form a person writes a message in: a textarea that grows, Enter to send, a send button that becomes Stop while a reply runs, and never a disabled control. |

**Every new item names `utils` and `pluto-theme`** (`002` decision 6), then each item it imports.

| Item            | Files                                                                                                                             | `registryDependencies` beyond `utils`, `pluto-theme`                                                                    | Packages detected                                                            |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `theme`         | 4 (`theme.svelte.ts`, `theme-script.svelte`, `theme-toggle.svelte`, `index.ts`)                                                   | `button`                                                                                                                | `phosphor-svelte`                                                            |
| `dropdown-menu` | 17 (stock's 18 less `dropdown-menu-label.svelte`, decision 7)                                                                     |                                                                                                                         | `bits-ui`, `@internationalized/date`, `phosphor-svelte`                      |
| `sheet`         | 11 (`sheet`, `-trigger`, `-content`, `-overlay`, `-portal`, `-close`, `-header`, `-footer`, `-title`, `-description`, `index.ts`) | `button`                                                                                                                | `bits-ui`, `@internationalized/date`, `phosphor-svelte`                      |
| `dialog`        | 11 (as `sheet`)                                                                                                                   | `button`                                                                                                                | `bits-ui`, `@internationalized/date`, `phosphor-svelte`                      |
| `breadcrumb`    | 8 (`breadcrumb`, `-list`, `-item`, `-link`, `-page`, `-separator`, `-ellipsis`, `index.ts`)                                       |                                                                                                                         | `phosphor-svelte`                                                            |
| `sidebar`       | 25 (stock's 26 less `sidebar-rail.svelte`, decision 10)                                                                           | `is-mobile`, `sheet`, `input`, `tooltip`, `skeleton`, `separator`, `button`, `kbd` (the trigger's tooltip, decision 10) | `bits-ui`, `@internationalized/date`, `tailwind-variants`, `phosphor-svelte` |
| `is-mobile`     | 1 (`is-mobile.svelte.ts`)                                                                                                         |                                                                                                                         |                                                                              |
| `message-log`   | 3 (`message-log.svelte`, `follow-bottom.svelte.ts`, `index.ts`)                                                                   | `button`                                                                                                                | `phosphor-svelte`                                                            |
| `message`       | 7 (`message`, `-group`, `-avatar`, `-content`, `-header`, `-footer`, `index.ts`)                                                  |                                                                                                                         | `tailwind-variants`                                                          |
| `marker`        | 4 (`marker`, `-icon`, `-content`, `index.ts`)                                                                                     |                                                                                                                         | `tailwind-variants`                                                          |
| `composer`      | 2 (`composer.svelte`, `index.ts`)                                                                                                 | `field`, `input-group`, `button`, `kbd`, `status`, `spinner` (the `submitted` state, decision 13)                       | `phosphor-svelte`                                                            |

- **93 new files.** The registry's item files become **286** (`004`'s 193 + 93).
- **Targets.** `registry:ui` files install under `<name>/`. The hook installs to `$HOOKS$/is-mobile.svelte.ts`, as `use-highlighted-code` does.
- **The distinct registry dependency names become 31** (`004`'s 27 and `sheet`, `is-mobile`, `kbd`, `tooltip`; the review counted them, finding 9). Each names an item here. **And `registry.test.ts` gains the check `blocks.test.ts` makes for blocks** (review finding 9): every `$UI$/<name>` import in a built `registry:ui` item's files names an item in its own `registryDependencies`, 47 of 47 items. _Why:_ an app that adds one item into an empty project must get every file it imports.

### 5. The theme's addition: a vertical groove

`pluto-theme`'s `css` gains one utility, additively:

```
@utility groove-s {
  border-inline-start: var(--line-width) solid var(--groove-line);
  box-shadow: inset var(--line-width) 0 0 var(--groove-light);
}
```

- _Why:_ `001` decision 13's `groove` is a top edge: the hairline, then the light beneath it, owned by the element that follows the line. A sidebar's edge needs the same structure turned on its side. The sidebar memo drew four forms and sampled their pixels (§4.1, EXECUTED): an outer shadow on the sidebar is painted over by its sibling and shows nothing; the form that works is the inset owning the line, `border-inline-start` in `groove-line` with the light inside it, which drew `#dfdfde` then `#ffffff` at the seam in light and the hairline alone in dark. That is the horizontal groove's order, hairline first and light after, with light from the top-left. `shadow-[inset_…]` is an arbitrary value the lint flags, so it must be a utility.
- _Who uses it:_ `SidebarInset` (decision 10), on its start edge. A right-hand sidebar, and a `groove-e` for it, are out of scope.
- **No base border colour rule.** Under our theme a stock `border-e` with no colour draws solid ink, because Tailwind's preflight uses `currentColor` and shadcn's template `@apply border-border` is not in `pluto-theme` (sidebar memo §4.1, EXECUTED). The choice is a base rule for every element, or every item naming its colour. **Every item names its colour**, as every restyled item already does; `pluto-theme` gains no `* { border-color }` rule. _Why:_ a base rule would hide, in every app's own markup, the one thing the token rule asks a reader to see: which token a line is. Review checks that no new item carries a bare `border-*` class without a colour.
- `generated.test.ts` checks `@utility groove-s` is emitted with its two declarations. `tokens.spec.ts` reads, on the `sidebar` page, the inset's computed `border-inline-start-color` equal to `--groove-line` and its `box-shadow` holding `--groove-light`'s colour.

### 6. `theme`: the light and dark switch as source

Ours, four files. The owner's answer of 2026-11-01 left the mechanism to this specification; the overlays memo §4.5 laid out `mode-watcher` against the repository's own twelve lines. **Source wins** (constitution §4.1): the behaviour is sixty lines, the preview app has run two-thirds of it since `001`, and the alternative is a sixteen-month-old package with its own copies of two libraries.

- **`theme.svelte.ts`** exports a `theme` object: `preference` (`"light" | "dark" | "system"`, `$state`, read from `localStorage` key `pluto-theme` at first access in the browser, `"system"` otherwise), `resolved` (`"light" | "dark"`, derived: the preference, or `prefers-color-scheme` through a `matchMedia` listener while the preference is `system`), `set(preference)` (writes the key, or removes it for `system`), and `toggle()` (sets the opposite of `resolved`). An `$effect` applies `resolved` to `document.documentElement`'s `dark` class. On the server `resolved` is `"light"` and nothing is written. _Why a tri-state:_ a visitor who never chose follows the system, and a choice can be undone; the preview's two-state toggle wrote a choice on the first click and never followed the system again.
- **`theme-script.svelte`** renders, inside `<svelte:head>`, one inline `<script>` through `{@html}`, built from a constant string: it reads the key, else the media query, and toggles the `dark` class before first paint. It takes one optional prop, `nonce`, written onto the script tag, and nothing else; `theme.spec.ts` checks a passed `nonce` appears once in the built head (review finding 13). _Why `{@html}` in `<svelte:head>`:_ the script must be in the server-rendered head, which prerendering keeps, and an item cannot edit an app's `app.html`. `mode-watcher` does the same (overlays memo §4.5, READ). The lint has no rule on `{@html}`; the string is a constant, not input, and review reads it. An app with a Content Security Policy passes `nonce`: SvelteKit's own nonces never reach a script written through `{@html}`.
- **`theme-toggle.svelte`** is a `Button` `variant="ghost" size="icon"` (48 px) or `size="icon-sm"` (32 px, by a `size` prop), `aria-pressed={theme.resolved === "dark"}` once hydrated (`aria-pressed` is omitted in the server render, as the preview's toggle does, so a wrong value is never stated), `aria-label` "Dark theme", icons `Sun` and `Moon` from `phosphor-svelte` `aria-hidden`, the one shown by `resolved`. `data-ready` is set at mount, for tests. _Why a pressed button, not a `switch` or a menu:_ one control, one state, the same shape `001` tested (`keyboard.spec.ts` flips it by Space and by Enter). A tri-state menu (light, dark, system) is an app's to compose from `dropdown-menu` and `theme.set`; the item page shows it.
- **Storage.** The key is `pluto-theme`; a `storage` event from another tab updates `preference`. Storage may be unavailable: every read and write is in `try`, as the preview's are.
- **The preview app adopts the item** (decision 16): `src/app.html` loses its inline script, the `(site)` and `(view)` layouts render `ThemeScript`, and `src/lib/preview/theme-toggle.svelte` becomes a thin wrapper rendering `ThemeToggle` (kept so `003`'s viewer import does not move). The tests that drive the theme by `colorScheme` (the two Playwright projects) and by the button named "Dark theme" are unchanged in intent; `pages.ts`'s wait for `button[aria-pressed][data-ready]` holds. The `003` viewer copies the parent's `dark` class into the iframe as before.
- **Preview page**: the toggle at both sizes; the three-way menu example; the script shown as the item page's code view. **Keyboard fixture:** 1 stop: a toggle; Space flips `aria-pressed` and the `dark` class, Space again restores both.

### 7. `dropdown-menu`

Seventeen files. bits-ui's Menu meets the APG menu button and menu patterns as shipped (overlays memo §1.3, READ and EXECUTED): `aria-haspopup="menu"`, `aria-expanded` and `aria-controls` on the trigger; `role="menu"` with `menuitem`, `menuitemcheckbox`, `menuitemradio`, `group` named by its heading, `separator`; Enter, Space and ArrowDown open with focus on the first item; the arrows loop; Home and End; typeahead; Right opens a submenu, Left closes it; Escape closes and returns focus; Tab closes and moves on. This item adds no key handling.

- **Chrome is `popover`'s** (`004` decision 11): `DropdownMenuContent` and `DropdownMenuSubContent` are `z-50 min-w-3xs rounded bg-popover text-popover-foreground shadow-elevation p-1 data-open:animate-enter data-closed:animate-exit max-h-(--bits-dropdown-menu-content-available-height) overflow-y-auto scrollbar`. No border, no ring, no `shadow-2xl`, no `rounded-2xl`, no `tw-animate-css` class, no `cn-` marker. _Why `min-w-3xs`:_ stock's `min-w-48` (192 px) and `min-w-36` are off the ladder; 256 px is the popover's width and passes L7. _Why `p-1`:_ 4 px, so an item's 8 px radius sits inside the panel's.
- **Items are 32 px.** `DropdownMenuItem`, `CheckboxItem`, `RadioItem` and `SubTrigger` are `flex h-8 items-center gap-2 rounded px-2 text-sm select-none` with `[&_svg]:size-4`; an inset item (`inset` prop) is `ps-8` (8 + 16 + 8). _Why:_ stock's 36 px item fails R5; `h-8` is the `sm` control height (`002` decision 10) and clears R21. `h-12` would make a ten-item menu 488 px tall.
- **Hover and focus are one state, on `accent`.** bits-ui focuses an item on pointer move and sets `data-highlighted`; the item is `data-highlighted:bg-accent data-highlighted:text-accent-foreground`. **The global ring stays** (R2): stock's `outline-hidden` goes, and a keyboard user sees the ring on the focused item above the `accent` ground, as the toggle group's roving items show it (`004`). _Why:_ the ring costs nothing and tells keyboard focus from pointer hover, which `accent` alone cannot.
- **A destructive item is `text-destructive` on the same `accent` ground**, no tint (R7; `002` decision 19's row: 4.71 light, 5.53 dark). **Rule, on the item page:** a destructive item carries an icon or a telling word ("Delete project", never a lone "Delete"), since red text alone tells the state by colour (R19).
- **The shortcut is words, not symbols** (overlays memo §1.5). `DropdownMenuShortcut` renders `<kbd>`-styled mono text, `ms-auto font-mono text-xs text-muted-foreground tracking-mark`, `aria-hidden`, with an app's text ("Shift Cmd P"). The item page says the shortcut binds nothing: an app that shows one binds it and sets `aria-keyshortcuts` on the item. _Why hidden:_ "⇧⌘P" read as part of the item's name is noise; the key names in `aria-keyshortcuts` are what assistive technology expects.
- **`DropdownMenuLabel` is dropped.** It was an id-less `div` that named nothing (overlays memo §1.5). A menu's title is `DropdownMenuGroupHeading` inside a `DropdownMenuGroup` (bits-ui names the group by it), and the menu itself is named by its trigger or by a `label` prop on the content, rendered as `aria-label`. 17 files.
- **Separator:** `-mx-1 my-1 border-t border-border` (R22, the 10% hairline), not stock's 5% `h-px`. **Check and radio indicators:** `Check` from `phosphor-svelte`, `size-4`, `aria-hidden`, at `start-2` with `ps-8` on the item; the radio uses the same check (a dot would be round and need the allowlist). **Sub-trigger caret:** `CaretRight`, `size-4`, `aria-hidden`, `ms-auto`, `rtl:rotate-180` (R16's `cn-rtl-flip` written out; not `rtl:-scale-x-100`, which L18 flags as a `scale`, review finding 1, EXECUTED). Group headings are `h-8 px-2 text-xs font-medium text-muted-foreground`, sentence case (R18): a heading of items is a label to a reader, not mono furniture.
- **Preview page**: the account menu (a group with a heading, three items with icons and a shortcut, a separator, a checkbox item, a radio group of three, a submenu, a destructive "Sign out" with an icon); an inset menu; a menu named by `label` with no heading. axe scans the page with the first menu open (decision 17). **Keyboard fixture:** 1 stop: the trigger. Enter opens the menu with focus on the first item; ArrowDown moves; Escape closes and returns focus to the trigger; Tab from the open menu closes it.

### 8. `sheet` and `dialog`

Twenty-two files, one recipe. Both are bits-ui `Dialog`: `role="dialog" aria-modal="true"`, named by the title, described by the description, focus to the first tabbable on open, trapped and looped, returned to the trigger on Escape, outside click and close (overlays memo §2.3, EXECUTED, matching the APG modal dialog pattern).

- **The overlay** is `alert-dialog`'s: `fixed inset-0 z-50 bg-scrim data-open:animate-enter data-closed:animate-exit`. No `bg-black/80`, no `backdrop-blur` (R11; the design book §09).
- **The content** is `bg-popover text-popover-foreground shadow-elevation data-open:animate-enter data-closed:animate-exit` with the `z-50 fixed` placement. **Motion is the fade.** No slide. _Why:_ the fade exists (`animate-enter`, `animate-exit`; the overlays memo saw the exit hold the node 203 ms, §2.4) and matches `popover`, `alert-dialog` and the menu; a slide needs eight keyframes and eight tokens in `pluto-theme` for the four sides, and stock's 40 px slide is off the ladder anyway. A 200 ms fade on a panel that was not there is honest feedback within the design book §06's budget. Under reduced motion the token is 0 ms and the node leaves at once.
- **`SheetContent`** takes `side` (`"start" | "end" | "top" | "bottom"`, default `end`): the side classes are `inset-y-0 end-0 h-full w-2xs max-w-full` and the mirror for `start`; `inset-x-0 top-0 h-auto max-h-full` and `bottom-0` for the others, so a tall body scrolls inside (`overflow-y-auto scrollbar`) and the title and close button stay in view (change review finding 2, measured); `p-6 flex flex-col gap-6`. _Why `w-2xs` (288 px) with `max-w-full`, not stock's `w-3/4 sm:max-w-sm`:_ one width at every viewport, 288 px fits a 320 px phone with the 32 px for the scrim to show, and it is the stock sidebar's own mobile width (sidebar memo §1.6); three quarters of a 1280 px screen was never used because `sm:max-w-sm` capped it. No `border-*` on the page edge: `shadow-elevation` draws the hairline (overlays memo §2.2). `text-sm` stays off the root; content sets its own type.
- **`DialogContent`** is `rounded` (R9; stock `rounded-4xl`), `fixed inset-4 m-auto h-fit max-h-full max-w-md overflow-y-auto scrollbar p-6 grid gap-6` (review finding 12): the four insets and `m-auto` centre a box of fitted height on both axes, 16 px from each edge on a phone, 448 px wide at most, and a long body scrolls inside it with the `scrollbar` utility. _Why not stock's `max-w-[calc(100%_-_2rem)]`:_ a `calc` with a length is a literal (L7); the insets say the same with ladder values. _Why not `max-h-sm` or `max-h-3xs`:_ Tailwind 4.3.3's container keywords are width-only and emit nothing on a height (`004` decision 15; decision 15 here). `SheetContent` takes `overflow-y-auto scrollbar` for the same reason. N3 reads `max-height`, `overflow-y` and the centring at 360 and 1280; the checkpoint sees it (decision 20).
- **The close button** on both is our `Button variant="ghost" size="icon-sm"` (32 px, R21) at `absolute top-4 end-4`, `X` from `phosphor-svelte` `size-4` `aria-hidden`, named "Close" by `aria-label`, rendered after the children so it is the last stop (as stock; the APG puts no requirement on its place). `showCloseButton` stays a prop, default `true`. **`DialogFooter`** keeps stock's optional outline "Close" button as our `secondary` button.
- **A name is required**, as `004` decision 11 requires it of a popover: `aria-labelledby` the title's id when `SheetTitle` or `DialogTitle` is rendered, else the `label` prop as `aria-label`. A sheet with no title renders with no name and no warning in stock (overlays memo §2.3, EXECUTED); the item page says one of the two is mandatory, and axe scans every preview sheet and dialog open (`aria-dialog-name`).
- **Titles** are `font-heading font-bold text-base` with `level` (default 2), as `PopoverTitle` (R17); bits-ui renders `role="heading" aria-level`. **Descriptions** are `text-sm text-muted-foreground`. `SheetHeader` and `DialogHeader` are `flex flex-col gap-2` (stock's `gap-1.5` goes, R4); `SheetFooter` and `DialogFooter` `flex flex-col-reverse gap-2 sm:flex-row sm:justify-end`.
- **Behind the dialog** bits-ui sets `overflow: hidden; pointer-events: none` on `body` and no `inert` (overlays memo §2.3). We rely on `aria-modal`, as `002` decision 17 does. No screen reader has been run; the tests prove the DOM contract (decision 21).
- **Preview pages**: `sheet`: the navigation sheet (end; a title, a description, a `nav` of four links), a `start` sheet, a `bottom` sheet with a form, one named by `label`. `dialog`: a rename dialog (title, description, a `Field` with an `Input`, Cancel and Save); one named by `label` with a longer body that scrolls. axe scans each page with each overlay open. **Keyboard fixtures:** `sheet` 1 stop (the trigger): Enter opens it with focus on its first link; Tab reaches the close button last and loops; Escape closes it and focus is back on the trigger; the content is gone after the fade. `dialog` 1 stop: as the sheet, with focus on the input.

### 9. `breadcrumb`

Eight files; no package, no dependency beyond `phosphor-svelte`. The APG asks for three things: a `nav` with a label, a list, and `aria-current="page"` on the current item (overlays memo §3.2).

- **`Breadcrumb`** is `<nav aria-label="Breadcrumb">`; the label is a prop. **`BreadcrumbList`** an `ol` `flex flex-wrap items-center gap-2 text-sm text-muted-foreground wrap-break-word` (stock's `gap-1.5 sm:gap-2.5` go, R4). **`BreadcrumbItem`** an `li` `inline-flex items-center gap-2`. **`BreadcrumbLink`** an `a` `hover:text-foreground` with the `child` snippet for a framework link; the default transition.
- **`BreadcrumbPage` is a `span` with `aria-current="page"` and nothing else.** Stock's `role="link" aria-disabled="true"` announces "link, disabled", a false promise (overlays memo §3.1, EXECUTED). `text-foreground`.
- **`BreadcrumbSeparator`** is `li role="presentation" aria-hidden` with `CaretRight` `size-4` `rtl:rotate-180` (decision 7's caret), or children an app passes.
- **`BreadcrumbEllipsis`** is a `span` `inline-flex size-6 items-center justify-center` holding `DotsThree` `size-4` `aria-hidden`, and nothing else; stock's `sr-only` "More" inside an `aria-hidden` span said nothing. **Rule, on the item page:** the ellipsis is decoration; when hidden pages exist, an app wraps it in a `DropdownMenu.Trigger` button named "Show hidden pages" (`size-8`, R21) with a menu of the hidden pages, which the page shows.
- **Preview page**: a three-level path; one with a slash separator; one with the ellipsis and its menu. **Keyboard fixture:** 2 stops: the first link and the ellipsis menu's trigger; the current page is not a stop.

### 10. `sidebar` and `is-mobile`

Twenty-five files and the hook. The stock sidebar's parts are kept (provider, sidebar, header, content, group, group label, menu, menu item, menu button, menu action, menu badge, menu sub, sub item, sub button, skeleton, separator, input, footer, inset, trigger, context, constants, index); its rail, its two variants, its shadows and its `fixed` container go.

- **The sidebar is a flex item, not a `fixed` container** (review finding 4). Stock renders a width-holding spacer and a `fixed inset-y-0 h-svh` panel beside it (sidebar memo §1.2), which escapes any box it is put in, covers a header above it and cannot be shown on a page. `SidebarProvider` is a column, `flex min-h-svh w-full flex-col`, that lays out nothing but its children (so a shell can put a header above and a footer below the sidebar's row and keep the trigger inside the provider's context; `006` decision 6); the row of sidebar and inset is the consumer's own `<div class="flex flex-1">`, which the preview page and `006`'s shell each write. `Sidebar` is one flex child of that row, `sticky top-0 h-svh self-start shrink-0 overflow-hidden`, whose width is the state (`w-3xs` open, `w-12` as icons, `w-0` off-canvas) and transitions as below. _Why:_ inside the shell, which wraps the whole page, a sticky full-height child is what a fixed panel was; inside a preview page it stays within the provider's box. The content box inside scrolls on its own (below).

- **The sidebar is a `nav` landmark on the paper ground.** `Sidebar` renders `<nav aria-label={label}>` (prop, default "Main"), `bg-sidebar text-sidebar-foreground`, no tint, no border of its own, no shadow. The `floating` and `inset` variants are dropped: the design book §05 allows elevation for menus and dialogs only, and `001` decision 8 makes the sidebar a ground "set apart by a groove, not a tint". **`SidebarInset`** renders, by its `element` prop, `<main id="main" tabindex="-1">` (the default, for a shell) or a `<div role="region" aria-label>` (for a page that already has a `main`, such as the preview), with `groove-s` (decision 5) on its start edge **while the sidebar is beside it** (open, or collapsed to icons; not off-canvas, not on mobile; the provider's context says), `flex-1 min-w-0` and `bg-background` (review finding 3; change review finding 6: off-canvas, the groove was a 2 px seam at the viewport's edge). _Why the inset owns the groove:_ the sidebar memo §4.1's form D, the only one whose pixels showed in a flow layout. _Why `id="main"` and `tabindex="-1"`:_ the shell's skip link (`006`) targets it and focus must land there in every browser (patterns memo §1.2). The desktop container clears axe's `region` violation by being a landmark (sidebar memo §2.9).
- **Widths without `style`:** expanded `w-3xs` (256 px), collapsed to icons `w-12` (48 px), the mobile sheet `w-2xs` (288 px, the sheet's own width, decision 8). The provider's `style="--sidebar-width…"` and `constants.ts`'s three CSS lengths go (L21; sidebar memo §1.6, EXECUTED: the three classes measured right). `constants.ts` keeps the cookie name, its max-age and the shortcut key.
- **Collapse.** `collapsible` is `"offcanvas"` (default), `"icon"` or `"none"`. **Off-canvas, the collapsed container is `inert`**: the 33 invisible stops the memo tabbed through (§2.4) leave the tab order and the accessibility tree; the state persists. **Collapsed to icons**, each menu button is a 32 px icon with its `Tooltip` naming it; sub-items leave the order; `SidebarContent` stays `overflow-auto` (stock's `overflow-hidden` hid eleven rows from the pointer, §2.4). The width transition is `transition-[width] duration-(--motion-micro) ease-linear` (200 ms, the design book §06's budget; `001`'s reduce rule stops it). _Why keep `icon`:_ NN/g accepts icon-only collapse for daily-use applications, which an app shell serves; `006` chooses the mode, and off-canvas stays the default for every other case.
- **The rail goes.** 16 px wide, `tabindex="-1"`, mouse-only, a 2 px line on hover: it fails R21 by design and duplicates the trigger (sidebar memo §4.3). 25 files.
- **The trigger is a disclosure.** `SidebarTrigger` is our `Button variant="ghost" size="icon-sm"` (32 px) with `List` from `phosphor-svelte` `aria-hidden`, `aria-label` "Toggle sidebar", `aria-expanded={open}` and `aria-controls` naming the `nav` (the provider makes the id with `$props.id()` and shares it by context); on mobile it also carries `aria-haspopup="dialog"`, and its `aria-controls` then names the sheet's `nav`, which is in the DOM only while the sheet is open; axe tolerates the dangling reference while `aria-expanded` is `false`, as it does for bits-ui's own dialog trigger (review finding 16), and N5 checks the reference resolves while open at 360 px. Stock had none of the three (§2.3). Focus stays on it after a click; after the sheet closes, bits-ui returns focus to it (§2.5, EXECUTED).
- **The shortcut stays, guarded.** Ctrl+B and Cmd+B toggle (SC 2.1.4 allows a modifier shortcut), **except** when the event's target is editable (`input`, `textarea`, `[contenteditable]`, `.cm-content`) or `event.defaultPrevented` is set. _Why:_ stock fires inside a text field, and on a Mac `Ctrl-b` is CodeMirror's `cursorCharLeft` in `004`'s `defaultKeymap` (sidebar memo §4.3, READ), so the editor and the sidebar would both act. The trigger's tooltip shows the shortcut with `Kbd`.
- **The cookie is written by the item and read by an app's layout.** `sidebar_state` is written on every toggle, as stock, and never read by stock (§2.3, EXECUTED). The item page shows the three lines a `+layout.server.ts` adds to pass `open` to the provider, so the prerendered state is right at first paint; `006`'s shell does it.
- **The mobile sheet** is `sheet` (decision 8) with `side="start"`, a visually hidden `SheetTitle` "Sidebar" and description, the `nav` inside it, and **no `Tooltip` rendered on a menu button while `isMobile`** (the first Escape otherwise closed an invisible tooltip and left the sheet open, §2.5). The sheet's close button stays (stock hid it with `[&>button]:hidden`; a visible 32 px close is the honest control).
- **Rows and the current page.** `SidebarMenuButton` is `h-12` (default) or `h-8` (`sm`), `flex w-full items-center gap-2 rounded px-3 text-sm`, `hover:bg-sidebar-accent hover:text-sidebar-accent-foreground`, icons `size-4`; sub-buttons `h-8`; the group label `h-8 px-3 font-mono text-xs lowercase text-muted-foreground tracking-eyebrow` (mono furniture, the design book §04). **The current row** takes `aria-current="page"` (the `isActive` prop sets it, not a `data-` flag alone), the `sidebar-accent` inset, and a `primary` start edge `border-s-(length:--focus-width) border-sidebar-primary`, so it differs from a hovered row by shape (decisions.md, "A selected table row is told by shape, and by a control"; R19). Stock's `font-medium` on the active row goes. The ring is the global one; stock's `ring-sidebar-ring` and `outline-hidden` go (R2).
- **`SidebarContent`** is `flex-1 overflow-auto scrollbar`, with no `tabindex` and no label of its own (review finding 7): its rows are stops that scroll it into view, Chromium adds no stop to a scroller that holds focusable children (sidebar memo §2.8), and `004` decision 5's pattern is for a box a reader could not otherwise reach; the `nav` it sits in names it. Stock's `no-scrollbar` (`scrollbar-width: none`) goes.
- **The menu button's `data-slot`** is overwritten by bits-ui's tooltip trigger (`tooltip-trigger`, sidebar memo §2.6). Tests select by `data-sidebar="menu-button"`, which stock already sets; R20 is met by `data-sidebar` on every part.
- **`is-mobile`** is served as written: a `MediaQuery` at `max-width: 767px`, `false` on the server. The item page says: a page prerenders the desktop tree, which is `hidden` below `md` until hydration replaces it with the sheet, so nothing flashes; with JavaScript off a phone has no sidebar (sidebar memo §3, EXECUTED).
- **`SidebarInput`**, `SidebarSeparator`, `SidebarMenuSkeleton`, `SidebarMenuBadge`, `SidebarMenuAction` are restyled on the checklist alone: ladder spacing, `size-8` actions (R21), `rounded`, no `ring-*`, no `shadow-*`. The skeleton's random `style` width becomes one of `w-1/2`, `w-2/3`, `w-3/4` and `w-full` by the row's index (review finding 17). `SidebarMenuSub`'s start line is `border-s border-groove-line` (decision 5's rule: a colour is named).
- **Preview page**: two shells inside the item page's column, each a provider of `min-h-96` with a bar above its sidebar holding the trigger and a `breadcrumb` (so the trigger precedes the sidebar in the DOM, as `006`'s header does), the sidebar (a heading in the heading face, a search input, two groups, a collapsible group of sub-items, a footer with an account button), and an inset rendered as `element="div"` with its own label, holding prose. The first shell is `offcanvas` and its `nav` is "Main"; the second is `collapsible="icon"`, collapsed, and its `nav` is "Icon example", so no landmark is doubled and no second `main` or `id="main"` exists on the page (review finding 3). **Keyboard fixture:** 3 stops in DOM order: the first shell's trigger, its first menu button, its second; Enter on the trigger sets `aria-expanded` false and makes the `nav` `inert` (0 stops inside it); Enter again restores it. At 360 px: Enter on the trigger opens the sheet named "Sidebar" with focus on its first link; Escape closes it and focus returns to the trigger.

### 11. `message-log`

Ours, three files. The stock scroller's rules are the reference (chat memo §1.3, READ); the component is written fresh.

- **`message-log.svelte`** renders a scroll box `<div role="region" aria-label={label} tabindex="0" class="overflow-y-auto scrollbar overscroll-contain scroll-pb-24">` (the region named "Messages" by default) holding `<div role="log" aria-label={logLabel} aria-relevant="additions" aria-busy={busy}>` (named "Conversation" by default) with the `children` snippet, and, **beside the box in a `relative` wrapper**, a `Button variant="secondary" size="icon-sm"` "Scroll to end" (`ArrowDown`, `aria-hidden`), `absolute bottom-4 end-4`, that is `hidden` while the box is at its end or following, and pinned over the box's bottom edge when shown (review finding 5; L1 asserts its rectangle lies inside the region's at that moment). On activation focus returns to the region. _Why absolute over the box, not `sticky` inside it_ (measured): Tab onto a sticky button scrolls the box to the button's static position at the end, so the button hid under the reader before Enter could press it. _Why two names:_ a log requires an accessible name (MDN; the stock's log had none, chat memo §1.4, EXECUTED), and the region is what a keyboard user focuses and scrolls. A reader entering the box hears both, one after the other; that doubling is accepted (no screen reader has been run, decision 21), and the names are props an app can set to one word each. _Why `scroll-pb-24`:_ `scroll-padding-bottom` keeps a focused element above a sticky composer (SC 2.4.11, C43); 96 px is the ladder's top step and the composer's minimum plus its padding. _Why `hidden`, not `inert` and opacity:_ a hidden button is no stop and no target; it appears when there is somewhere to go.
- **`follow-bottom.svelte.ts`** holds the rules, in about sixty lines: `following` starts true; the box scrolls to its end on every content resize while following (a `ResizeObserver` on the log, coalesced into one animation frame); `following` becomes false only on a gesture that moves the box away from its end: a `wheel` with a negative `deltaY`, a `touchmove` that leaves the end, one of ArrowUp, PageUp or Home on the box, or a `scrollTop` that fell since the last frame; a gesture that moves nothing (a wheel towards the end, End, ArrowDown or Space at the end) leaves it true, since no scroll event would follow to re-arm it (change review finding 1, measured); it becomes true again when the box is within 8 px of its end after a scroll that did not fall; growth past the end never releases it. The button calls `scrollTo({ top: scrollHeight, behavior })` where `behavior` is `"smooth"` unless `prefers-reduced-motion` matches, then `"auto"` (stock scrolled smooth regardless, chat memo §1.3). `scrollToEnd()` is exposed through `bind:this`.
- **Nothing in the log is announced by the log** except what is added whole: a user turn, a marker line, an alert. A streamed reply is never read by the log (`additions` announces an element added, not text added; ARIA 1.2 §6.7, chat memo §5.1). The pane's `status` carries "Responding", "Stopped" and "Response complete" (decision 13). `aria-busy` is a prop an app may set while a reply streams, for readers that honour it.
- **No gradient fade** at the box's edge (the design book §05; the stock's `scroll-fade-b` was dead CSS in an app anyway, chat memo §1.5). The composer's groove is the edge (`006`).
- **Preview page**: a log of eight turns and a marker, a "Add a turn" button and a "Stream a reply" button (started by the reader, never on load; the design book §06), so the follow and release can be tried; a `sm` log in a card. **Keyboard fixture:** 1 stop: the region; End scrolls it to the end; ArrowUp releases the follow (a streamed reply then does not move it); the button appears and Enter on it returns to the end (2 stops while released).

### 12. `message` and `marker`

- **`message`**: seven files, restyled. `MessageContent` defines its two variants with `tv` from `tailwind-variants/lite`, as `button` does, so `message` names the package by our restyle (review finding 11; stock's seven files import nothing). `Message` is `flex w-full min-w-0 gap-2 text-sm` with `align` (`start` | `end`, `end` reverses the row). `MessageGroup` `flex min-w-0 flex-col gap-2`. **`MessageAvatar`** is a slot with no ground and no radius (`flex shrink-0 self-end`); an app puts our `avatar` in it (`size-8 rounded`, `002`). **`MessageHeader` is a heading**: `level` prop (default 3), rendered as `<h3 tabindex="-1">`, `font-mono text-xs lowercase text-muted-foreground tracking-eyebrow`, the mono furniture of the design book §04, so a turn's author ("you", "assistant") is a heading a reader can walk and a "latest reply" control can focus (chat memo §5.4). `MessageFooter` is the same style without the heading. **`MessageContent`** takes `variant`: `plain` (default; full width, no ground: the assistant's prose) or `bubble` (`w-fit max-w-4/5 self-end rounded bg-muted px-3 py-2`: a user turn on the inset, which is what the stock demo chose). _Why only `muted`:_ the seven stock bubble variants are relative-colour tints, translucent fills and a solid `primary` (chat memo §2.2); the tints fail R1 and R6, `primary` spends the one accent the send button owns, and `destructive` is `alert`'s. An error reply is an `Alert variant="destructive"` in the log, not a bubble. `bubble`'s reactions and its 24 px corners go with it (R9: `rounded`).
- **`marker`**: four files, restyled; its variants stay in `tv` from `tailwind-variants/lite`, as stock. `Marker` `flex w-full items-center gap-2 text-sm text-muted-foreground min-h-4`, variants `default`, `separator` (`before:flex-1 before:border-t before:border-border after:…`, R22; stock's `h-px` lines go), `border` (`border-b border-border pb-2`). `MarkerIcon` `size-4 aria-hidden`. **No role by default**; an app passes one. _Why:_ a marker inserted with its text is the silent live-region case `003` decision 8 records; the log announces it as an added node, and the state is told by the `status` item. The stock docs' `shimmer` pattern is a looping gradient (the design book §06, R14) and is not offered.
- **Preview pages**: `message`: a user turn (bubble, avatar, header "you"), an assistant turn (plain prose with a `code-block` at `sm`), a turn with a footer; `marker`: the three variants, one with a `Spinner` and the text "Responding" beside a visible `Status`. No fixtures: neither is interactive (a `MessageHeader` is focusable by script only).

### 13. `composer`

Ours, two files. The chat memo's eleven behaviours (§3.7), each a decision here.

- **Shape.** A `<form data-slot="composer">` holding a `Field` (label "Message", `sr-only` by default, `labelVisible` prop) whose description is the hint, wired by `aria-describedby`; an `InputGroup` with `InputGroupTextarea` as the control and the send control as an `InputGroupAddon` at the end. The textarea is `field-sizing-content min-h-16 max-h-(--container-3xs) overflow-y-auto scrollbar resize-none` with `rows={1}`: it grows from 64 px to 256 px (about nine lines) and scrolls inside after that (chat memo §3.5, §4.1, EXECUTED: a `max-height` cap works with `field-sizing`). _Why the variable form:_ `max-h-3xs` emits nothing, since Tailwind 4.3.3's container keywords are width-only (review finding 2, EXECUTED; `004` decision 15 recorded it for `max-h-sm`); `max-h-(--container-3xs)` passes the lint as the token form and makes Tailwind emit `--container-3xs: 16rem` into `@layer theme`, by the "emitted when referenced" rule decisions.md recorded after `004`, on the condition that the composer's file is among Tailwind's sources, which the item page says. Where `field-sizing` is absent (Safari before 26.2, Firefox before 152), the box keeps its minimum and scrolls inside; growth is a refinement and no script is written for it (§4.3). This settles the question `002` decision 13 left: `field-sizing: content` is Baseline 2026 and proven in all three engines.
- **Props:** `value = $bindable("")`, `status` (`"ready" | "submitted" | "streaming" | "error"`, the Vercel AI SDK's names, default `ready`), `onsend(text: string)`, `onstop()`, `label` (default "Message"), `hint` (default "Enter to send. Shift Enter for a new line."), `placeholder`, `class`. Methods: `focus()`.
- **The send control is one button that changes.** At `ready` and `error`: `type="submit"`, `aria-label="Send message"`, `ArrowUp` `aria-hidden`, the default `size="icon"` (48 px), `variant="default"` (the one accent on the surface). At `submitted` and `streaming`: the same element becomes `type="button"`, `aria-label="Stop response"`, `Square` `aria-hidden`, `variant="secondary"`, calling `onstop`; at `submitted` it also shows the `Spinner` (the one busy control, allowed). _Why one element:_ focus never has to move; after Stop it is Send again. _Why not red:_ stopping destroys nothing (`003`'s rule: red is spent at a destructive confirm).
- **Nothing is ever `disabled`.** An empty submit is ignored and focus stays. Atlassian and Primer both say never to disable a submit button; `002` decision 12 makes a busy button stay enabled (chat memo §3.3).
- **Keys.** Enter sends; Shift+Enter inserts a line (Shift is checked first); **no send while `event.isComposing` or `event.keyCode === 229`** (the clone's handler sent in all three engines; the guard did not, chat memo §3.4, EXECUTED); Escape calls `onstop` while `submitted` or `streaming`; Enter while a reply runs does nothing.
- **Focus stays in the textarea** after send and after stop. Send clears `value`.
- **The hint** renders with `Kbd` keys ("Enter", "Shift Enter") inside the `Field`'s description, visible by default.
- **Status.** The composer renders one `Status` at mount and sets it from `status` changes (review finding 14):

  | Transition                                               | Text                                      |
  | -------------------------------------------------------- | ----------------------------------------- |
  | to `submitted`                                           | "Responding"                              |
  | to `streaming`                                           | nothing                                   |
  | a Stop press                                             | "Stopped", and the next `ready` is silent |
  | to `ready` after `streaming` or `submitted`, not stopped | "Response complete"                       |
  | to `error`                                               | nothing: an app's alert is the word       |

  No two consecutive texts are the same (`003` decision 8's rule). _Why here:_ the composer sees every state change and the pane need not wire a second region. An `error` is an app's `Alert` in the log with a retry, outside the composer; the composer only returns to Send.

- **Preview page**: a composer with a fake reply (a button-started stream of 60 words into a `message-log` above it), so send, stop and the status can be tried; a `labelVisible` one. **Keyboard fixture:** 2 stops: the textarea and the send button. Typing then Enter calls `onsend` with the text and clears the field; Shift+Enter adds a line and does not send; a `keydown` with `isComposing: true` does not send; while streaming the button's name is "Stop response" and Escape stops it; the status reads "Responding" then "Stopped".

### 14. What is declined, and why

- **`sonner` and every toast.** `svelte-sonner` is competent, and its defaults are what the sources warn against: a 4 s timer (SC 2.2.1), a tab stop per toast at the end of the DOM, a 20 px close button (R21), nested live regions (overlays memo §4.1, EXECUTED). Primer: "avoid using a toast for now"; Roselli and O'Hara allow a toast only as a `status` region that exists at render and never times out. **The pattern** is `003`'s: a `Status` mounted with the page carries the announcement; the visible outcome is an inline `Alert` where the action was taken, or `error-summary` with focus for a failure. The changelog and the handoff say so. What an app loses (a message for an outcome that lands off-screen; stacking; an imperative API) is listed on the `status` page; this release serves no notices region of its own (decision 21).
- **`bubble`**: folded into `message` (decision 12).
- **`message-scroller`**: written as `message-log` (decision 11).
- **The sidebar's rail and its `floating` and `inset` variants** (decision 10).
- **A slide for the sheet** (decision 8).
- **`mode-watcher`** (decisions 2 and 6).

### 15. The lint: no new rule

`scripts/lint-literals.ts` is unchanged: every finding in the five stock overlay items, the sidebar, `message` and `marker` is a class an existing rule names, and the restyle removes each. `literals.test.ts` counts **286 item files, 0 violations**; the samples stay **70 bad, 47 good**. The allowlists are unchanged: no new item uses `focus-ring-none` (decision 7 keeps the ring on menu items) or `rounded-full`.

- **A note on L7, continued from `004`:** `max-h-3xs`, `max-h-2xs` and every container keyword on a height pass the lint and emit nothing (review finding 2, EXECUTED). A height cap is the variable form, `max-h-(--container-3xs)`, or `max-h-full`; this specification uses each once (decisions 8 and 13). No item uses a container keyword on a height.
- **L18 flags `rtl:-scale-x-100`** as a `scale` (review finding 1); a mirrored caret is `rtl:rotate-180`.

- **What the lint cannot see, for review:** a bare `border-*` class with no colour (decision 5); `role="link"` on a non-link; a `Tooltip` rendered inside the sidebar's sheet; `scrollbar-width: none`; a `style` attribute on the sidebar provider (the lint does see `style=`; it is listed so review knows where to look).
- **`is-mobile`** has 0 findings as written (sidebar memo §1.2).

### 16. The preview pages and the catalogue

- **61 site pages**: the catalogue and 60 item pages; with `003`'s 18 views, **79 prerendered pages** (`004`'s 68 + 11).
- **The catalogue** groups under ten `<h2>`s: Foundation, Actions, Surfaces, Feedback, Forms, Code, Data, Navigation, Chat, Blocks. `+page.server.ts`'s `GROUPS` gains the two.
- **The preview app adopts `theme`** (decision 6): the `(site)` and `(view)` layouts each render `ThemeScript` (not the root layout: `006`'s shell views carry the shell's own script, and a page must hold exactly one); `src/app.html` loses its script; the site header's toggle is the item's `ThemeToggle` through the existing `src/lib/preview/theme-toggle.svelte`. _Why:_ an item the site itself does not run is untested in this repository; and `003`'s viewer, the keyboard test's two theme behaviours and `pages.ts`'s ready wait all exercise it.
- **Each new item page** has `002` decision 22's five sections. The `sidebar` page shows a whole shell at the site's width; it is the one page whose content is wider than the catalogue column, and it says so.
- **Scroll containers** (`001` decision 24): `message-log`'s region, the composer's textarea past its cap, the sidebar's content box and a menu past its available height are the items' own behaviour; each has `tabindex="0"` or is a native control.
- Preview pages stay outside the lint.

### 17. The tests

`004`'s pattern. Each check is written first and seen failing.

**Unit tests**: 9 files in `tests/unit/`.

1. `tokens.test.ts`: unchanged (no token change).
2. `contrast.test.ts`: unchanged, plus 4 rows: `sidebar-accent-foreground` on `sidebar-accent`, `sidebar-primary` on `sidebar` (the current row's edge), `destructive` on `accent` (the destructive menu item), `muted-foreground` on `popover` (the menu's shortcut), each at 4.5 or more (a non-text 3:1 for the edge) in both themes, with the values the `001` and `002` tables already hold.
3. `generated.test.ts`: `004`'s checks, plus `@utility groove-s` with its two declarations.
4. `registry.test.ts`: 60 items in decision 4's order and types (1, 3, 2, 2, 47, 5); 60 of 60 with `meta.group` among 10; 0 `local:` or scheme dependencies; 31 of 31 distinct registry dependency names name an item here; 47 of 47 built `registry:ui` items import only `$UI$` names in their own `registryDependencies` (decision 4); 47 of 47 `registry:ui` items have at least 2 files; 42 of 42 stock-derived items (`002`'s 26, `004`'s 8, these 8) carry a 5-field `meta.stock`; 11 of 11 new items carry `meta.since` `"0.5.0"` and decision 4's titles; `theme`, `message-log` and `composer` carry no `meta.stock`. Built into a temporary folder: 61 files under `r/styles/maia/` and 61 byte-identical under `v0.5.0/`; 60 of 60 parse; 0 contain `#lib`; every target of the 47 `registry:ui` items starts `<name>/`; the hook's target is `is-mobile.svelte.ts`; 14 of 14 `tailwind-variants` items name `^3.3.1`; 0 of 61 built files contain `$UTILS$.js` or `/index.js"`; `dropdown-menu` has 17 files, `sidebar` 25, and neither names `sidebar-rail.svelte` or `dropdown-menu-label.svelte`; `CHANGELOG.md` as decision 18.
5. `previews.test.ts`: 60 of 60 pages.
6. `literals.test.ts`: 286 item files, 0 violations; 70 of 70 bad; 0 of 47 good.
7. `deps.test.ts`: 32 packages unchanged; no `mode-watcher`, no `svelte-sonner`, no `@shadcn-svelte/primitives`.
8. `utils.test.ts`: case (d) over 14 of 14 importers.
9. `blocks.test.ts`: `003`'s counts.

**Browser tests** (Playwright, 2 projects): `004`'s 9 files updated and 2 new.

1. `axe.spec.ts`: the 11 new item pages at 360, 768 and 1280, as `003`'s and `004`'s are (`NEW_PAGES_005` joins the width loop), plus the open states: the account menu, the navigation sheet, the rename dialog, the sidebar's sheet at 360 px, the `start` sheet and the dialog named by `label`: 6 more scans per theme. **364 scans, 0 violations** (`004`'s 286, plus 11 pages × 3 widths × 2 themes = 66, plus 6 states × 2 themes = 12; review finding 6).
2. `theme.spec.ts`: 79 pages × 2 themes, **158 of 158**; plus, on the catalogue, the `theme` item's script is in the raw HTML's `<head>` exactly once and `app.html` holds none (2 per theme).
3. `tokens.spec.ts`: `004`'s checks plus decision 5's groove reading on the `sidebar` page (2 per theme).
4. `keyboard.spec.ts`: the catalogue's **62 stops** (the lockup, the toggle, 60 links); fixtures for 8 more items (`theme` 1, `dropdown-menu` 1, `sheet` 1, `dialog` 1, `breadcrumb` 2, `sidebar` 3, `message-log` 1, `composer` 2: **12 stops**, every ring unclipped, `003` check 27's rule), so **64 fixture stops over 32 items**; `003`'s 83 view stops and 42 toolbar stops unchanged; behaviours: `004`'s 19 plus these 12, one test each (review finding 8):
   1. Space on the theme toggle flips `aria-pressed` and the `dark` class; Space again restores both.
   2. Enter on the menu trigger opens the menu with focus on its first item; ArrowDown moves to the second.
   3. Escape closes the menu and returns focus to the trigger.
   4. Enter on the sheet trigger opens it with focus on its first link; Tab loops through the close button back to the first link.
   5. Escape closes the sheet, focus returns to the trigger, and the content is gone after the fade.
   6. Enter on the dialog trigger opens it with focus on the input; Escape returns focus.
   7. Enter on the sidebar trigger sets `aria-expanded="false"` and makes the `nav` `inert`; Enter again restores both.
   8. At 360 px, Enter on the sidebar trigger opens the sheet named "Sidebar" with focus on its first link; Escape returns focus to the trigger.
   9. End scrolls the log's region to its end; ArrowUp releases the follow, a streamed reply does not move it, and the button appears inside the region.
   10. Enter on the log's button returns to the end and hides it.
   11. In the composer, Enter sends and clears; Shift+Enter adds a line and does not send; a keydown with `isComposing` does not send.
   12. While streaming, Escape stops; the status reads "Responding" then "Stopped".

   **31 behaviours.**

5. `primitives.spec.ts`: `004`'s checks plus: menu items 32 px, sidebar rows 48 and 32, the send button 48, the close buttons 32, the trigger 32 (6 heights); 0 fixture stops under 24 × 24; 0 loops on 11 new pages; the elevation on the open menu and the scrim on the open sheet (`002` decision 28's reading, as `004` did for the popover).
6. **`navigation.spec.ts`** (new): N1 the menu: role, `aria-haspopup`, `aria-expanded`, the items' roles, 32 px, `accent` on the highlighted item, the ring on the focused item, the separator's colour, the shortcut `aria-hidden`, `min-width` 256, 0 `style` attributes of ours, the open scan; N2 the sheet: `role="dialog" aria-modal`, named by its title, 288 px wide, `max-width` 100%, the scrim's colour and `backdrop-filter: none`, the two shadow layers, the close button 32 px and last, the fade's node held then gone; N3 the dialog: as N2 with the geometry at 360 and 1280; N4 the breadcrumb: `nav` label, `aria-current`, no `role="link"` on the page, separators absent from the tree, the ellipsis menu; N5 the sidebar: the two `nav`s and their distinct labels, `aria-controls` resolves (at 360 px while the sheet is open), the insets rendered as labelled regions with 0 `main` beyond the site's, `inert` when collapsed, widths 256 and 48 and 0 while off-canvas, the sidebar `sticky` and never `fixed`, the current row's `aria-current`, inset and edge, the content box's overflow with no `tabindex`, 0 `Tooltip` in the sheet at 360, the cookie written on toggle, Ctrl+B ignored while a textarea has focus; N6 the theme: the head script, the key written and removed, `aria-pressed` after hydration only, the `storage` event.
7. **`chat.spec.ts`** (new): L1 the log: region and log names, `aria-relevant`, follow on an appended turn and a stream, release on wheel and ArrowUp, no move while released, the button hidden at the end and shown when released, `scroll-padding-bottom` 96; L2 the message: the heading's level and `tabindex`, the bubble's ground `--muted`, radius 8, `max-width` 80%, 0 `style`; L3 the marker: the separator's lines are borders, no role; L4 the composer: `field-sizing`, 64 px at one line, growth at three lines, the cap at 256 and inner scroll, the hint wired, the send button's name and type, the stop state's name, type and variant, the status texts, the IME guard, focus kept.
8. `code.spec.ts`, `blocks.spec.ts`, `viewer.spec.ts`, `four-dot.spec.ts`: unchanged, except `viewer.spec.ts`'s theme follow still passes with the item's toggle (15 of 15).

**Smoke tests** (`tests/smoke/`): `004`'s 5 files plus **`navigation-add.test.ts`** (new): in each of the 2 scratch apps, `add sidebar dropdown-menu dialog composer message-log theme -y -o`, then eight assertions (review finding 10): (1) the `add` exits 0; (2) the files land, the count recorded (`sidebar`'s 25, `sheet`'s 11, `is-mobile`, `dropdown-menu`'s 17, `dialog`'s 11, `composer`'s 2, `input-group`, `field`, `kbd`, `status`, `spinner`, `message-log`'s 3, `theme`'s 4, and their dependencies); (3) no `style=` attribute in any landed file; (4) `app.css` holds `@utility groove-s` once; (5) a page composing the provider, the sidebar, a menu and the composer passes `vite build`; (6) `svelte-check` reports 0 errors; (7) the lint with this repository's rules over the landed files finds 0 violations; (8) a second `add` of the same is byte-identical. **8 assertions × 2 = 16.**

### 18. The version: 0.5.0, and the changelog

- `package.json`'s `version` becomes **`0.5.0`**: features added, no interface of a landed item changed. `build-registry` writes `static/v0.5.0/`, which is committed with the release (decisions.md, 2026-11-01: the built registry is tracked).
- `CHANGELOG.md` gains `## 0.5.0 — <landing date>` above `0.4.0`: one line per new item marked "new"; one line for `pluto-theme`, additive, naming `groove-s`; one line saying `sonner` is not served and why, with the `status` plus inline `alert` pattern; one line saying `bubble` is folded into `message`. `registry.test.ts` checks the entry names 12 of 12 (`pluto-theme` and the 11), and the older entries are unchanged.
- New items carry `meta.since` `"0.5.0"`.

### 19. What `006` and a consuming app take

- **`006`, the app shell:** `theme`'s `ThemeScript` in the root layout and `ThemeToggle` in the header; `dropdown-menu` with `avatar` for the signed-in menu; `sheet` for the mobile navigation; `sidebar` with `collapsible` chosen by the shell, `SidebarInset` as the `<main id="main">` the skip link targets, and the cookie read in `+layout.server.ts`; `breadcrumb` in the inset's page header; `dialog` for a non-destructive task.
- **`006`, the chat pane:** `message-log` with `aria-busy` while streaming; `message` with `MessageHeader` as the heading a "Latest reply" button focuses; `marker` for "Stopped: out of fuel"; `composer` with `status` from an app's chat state; `code-block` at `sm` inside an assistant turn through a fence splitter of the block's own (chat memo §6.4); `status` for nothing more, since the composer carries the three words; `empty` for a new conversation.
- **A consuming app:** an admin page may take `sidebar` and `dropdown-menu`. A page with a code editor binds no Ctrl+B of its own; the sidebar's guard already yields to the editor.
- **An app that needs a toast** places a `Status visible` where the outcome can be seen; this release serves no notices region (decision 21).

### 20. Build order

One builder, in this order. Previews and tests go with each step.

1. **The theme utility** (decision 5) and `generated.test.ts`. Version to 0.5.0.
2. **The install** (decision 3), then **`theme`** (decision 6) and the preview app's adoption of it (decision 16); `theme.spec.ts`, N6, and behaviour 1 of `keyboard.spec.ts`.
3. **`sheet`, `dialog` and `dropdown-menu`** (decisions 7 and 8, one chrome), their pages, N1, N2, N3 (review finding 15: the breadcrumb's ellipsis menu needs the menu first).
4. **`sidebar`, `is-mobile` and `breadcrumb`** (decisions 9 and 10), their pages, N4 (the ellipsis menu now has its menu), N5.
   - **Checkpoint: a review after step 4.** The builder stops and reports to the design lead: the vertical groove on the `sidebar` page in both themes (screenshots at 768 and 1280), the sheet at 360 with its scrim and shadow, the dialog at 360 and 1280, the collapsed `inert` state, and N2 to N5 green. _Why here:_ the sidebar is the largest restyle and the shell's spine; what it settles, `006` copies.
5. **`message-log`, `message`, `marker`, `composer`** (decisions 11 to 13), their pages, L1 to L4.
6. **Registry and catalogue** (decisions 4, 16): entries, groups, `registry.test.ts`, `previews.test.ts`, `deps.test.ts`, `utils.test.ts`.
7. **Browser and smoke suites** in full; `CHANGELOG.md`; the development walk (criterion 25).

**If time runs short**, two parts may be deferred and recorded as deferred, not dropped: the `dialog` item (decision 1; `sheet` stays; with it go 1 item, 11 files, 1 page, 6 axe scans, 2 theme checks, 1 fixture stop and behaviour 6, and the smoke's file list, so the Landing notes reconcile every count by those amounts), and the ellipsis menu on the `breadcrumb` page. Nothing else is deferrable. Nothing was deferred.

### 21. What this release does not cover

- **No notices region of our own.** An outcome is announced by a `Status` and shown by an inline `Alert` where the action was taken (decision 14). An outcome that lands off-screen has no message of its own.
- **Chromium only.** This release checks the overlays and the sidebar in Chromium only: Floating UI's placement, the sheet's geometry, `inert` and `field-sizing`'s cap are not checked in Firefox or Safari (decisions.md, "After the public-readiness review"). `field-sizing` itself was run in all three engines (chat memo §4).
- **No screen reader has been run.** The tests prove the DOM contract: the menu's shortcut, `aria-modal` without `inert`, the log's two names and the composer's status words are checked as markup, not as speech (decisions.md, "After the public-readiness review").
- **No markdown renderer is served.** Fenced code is `006`'s splitter; the rest of a reply is prose (chat memo §6.4, which weighed `marked`).
- **No `groove-e`:** a right-hand sidebar is out of scope (decision 5).
- **No script grows the composer** where `field-sizing` is absent: the box keeps its minimum and scrolls inside (decision 13; chat memo §4.3, option 2, describes the guarded function this release does not write).
- **The sidebar's icon mode** keeps `SidebarContent` `overflow-auto`, and a tooltip names each icon. `006`'s shell offers the mode as a constant and ships without a sidebar; an app chooses it (decision 10: icon-only collapse suits daily-use applications).

## Design

```
tokens/pluto.tokens.json   (unchanged)
scripts/build-tokens.ts    css += @utility groove-s { border-inline-start …; box-shadow: inset … }

src/lib/registry/
  ui/theme/                 theme.svelte.ts (preference | resolved | set | toggle; key pluto-theme)
                            theme-script.svelte (<svelte:head>{@html script})
                            theme-toggle.svelte (Button ghost icon, aria-pressed, Sun | Moon)
  ui/dropdown-menu/         popover chrome; items h-8 px-2 ps-8; data-highlighted:bg-accent + global ring;
                            shortcut aria-hidden in words; group heading names the group; no label part
  ui/sheet/, ui/dialog/     overlay bg-scrim animate-enter/exit; content shadow-elevation, fade only;
                            sheet w-2xs max-w-full per side; dialog fixed inset-4 m-auto max-w-md; close = Button ghost icon-sm; name required
  ui/breadcrumb/            nav aria-label; ol; Page = span aria-current; Ellipsis decorative, wrapped by a menu trigger
  ui/sidebar/               Sidebar = nav aria-label bg-sidebar; Inset = main#main tabindex=-1 groove-s;
                            w-3xs | w-12 | sheet w-2xs; offcanvas → inert; trigger aria-expanded/controls;
                            Ctrl/Cmd+B guarded; current row aria-current + sidebar-accent + primary start edge; no rail
  hooks/is-mobile.svelte.ts MediaQuery(max-width: 767px), false on the server
  ui/message-log/           region "Messages" tabindex=0 overflow-y-auto scrollbar scroll-pb-24
                              > log "Conversation" aria-relevant=additions > children; Button "Scroll to end" hidden at end
                            follow-bottom.svelte.ts: ResizeObserver + rAF; release on wheel up/touch/ArrowUp, PageUp, Home/falling scrollTop; re-arm ≤ 8 px
  ui/message/               Message align; Avatar slot; Header = h3 tabindex=-1 mono lowercase; Content plain | bubble (bg-muted rounded max-w-4/5)
  ui/marker/                default | separator (border-t lines) | border; no role
  ui/composer/              form > Field (label, hint with Kbd) > InputGroup > textarea field-sizing-content min-h-16 max-h-(--container-3xs)
                              + one Button: Send (submit, default, ArrowUp) ↔ Stop (button, secondary, Square); Status "Responding" | "Stopped" | "Response complete"
                            Enter sends, Shift+Enter breaks, isComposing | keyCode 229 ignored, Escape stops, focus stays, nothing disabled
```

**The chat pane, as `006` composes it** (not built here):

```
MessageLog label="Messages" busy={streaming}
  Message align=end  › MessageHeader "you" › MessageContent variant=bubble
  Message            › MessageHeader "assistant" › MessageContent (prose + CodeBlock sm per fence)
  Marker separator "Stopped: out of fuel"
Composer bind:value status={chat.status} onsend onstop     (groove on its top edge)
```

## Scope

**In** (the work to _built_):

- `groove-s` in `build-tokens.ts` and `src/app.css` regenerated.
- The 93 files of the eleven items under `src/lib/registry/`, their 11 entries in `registry.json`, and `meta.stock` on 8.
- The preview app's adoption of `theme`: `src/app.html`, the `(site)` and `(view)` layouts, `src/lib/preview/theme-toggle.svelte`.
- 11 item pages; the catalogue's two groups.
- Tests: 9 unit files (6 updated), 11 browser files (`navigation.spec.ts` and `chat.spec.ts` new; `axe`, `theme`, `tokens`, `keyboard`, `primitives` and `pages.ts` updated), 6 smoke files (`navigation-add.test.ts` new).
- `package.json` version 0.5.0; `bun.lock` unchanged; the `CHANGELOG.md` entry; `static/r/` and `static/v0.5.0/` rebuilt.

**The step to _done_** is the release (constitution §2 and §4.2): the criteria met here, the change reviewed, and the tag `v0.5.0`.

**Out:**

- `sonner`, `bubble`, `message-scroller`'s package, `mode-watcher`; the sidebar's rail and its `floating` and `inset` variants; a slide for the sheet; `groove-e`; a base border colour rule; a markdown renderer; the skip link (the shell's).
- The app shell and the chat pane (`006`); any block; deployment.
- Any change to a `001` to `004` item other than the additive `pluto-theme`; any new package; any new token.
- Firefox and Safari checks of the overlays and a screen-reader pass (decision 21's limits).

## Acceptance criteria

Each is a count, checked by the command named. "Clean clone" is `001`'s. Every command runs under Bun. Criteria 1 to 25 make `005` _built_; criterion 26 makes it _done_.

1. **Install.** On a clean clone, `bun install --frozen-lockfile` exits 0. `deps.test.ts` finds 32 packages, 18 named by items, and 0 of `mode-watcher`, `svelte-sonner`, `@shadcn-svelte/primitives`.
2. **Checks.** `bun run check` reports 0 errors and 0 warnings. `bun run lint` exits 0.
3. **Tokens.** `bun run build:tokens` run twice changes 0 files the second time. `generated.test.ts` finds `@utility groove-s` with 2 declarations; `contrast.test.ts` passes `004`'s counts plus 4 of 4 rows.
4. **Registry source.** `registry.test.ts`: 60 items in decision 4's order and types (1, 3, 2, 2, 47, 5); 60 of 60 groups among 10; 0 `local:` or scheme dependencies; 31 of 31 dependency names resolve; 47 of 47 `registry:ui` items import only their own dependencies; 47 of 47 `registry:ui` items have 2 or more files; 42 of 42 `meta.stock`; 11 of 11 `since` `"0.5.0"` with decision 4's titles; 3 of 3 own items without `meta.stock`; `dropdown-menu` 17 files and `sidebar` 25, with 0 of the two dropped files.
5. **Registry build.** `bun run build:registry` writes 61 files to `static/r/styles/maia/` and 61 byte-identical files to `static/v0.5.0/r/styles/maia/`; 60 of 60 parse; 0 contain `#lib`; 47 of 47 `registry:ui` targets start `<name>/`; the hook's target is `is-mobile.svelte.ts`; 14 of 14 `tailwind-variants` items at `^3.3.1`; 0 of 61 files with `$UTILS$.js` or `/index.js"`.
6. **Site build.** On a clean clone, `bun run build` exits 0. `build/` holds 61 files under `r/styles/maia/`, 61 under `v0.5.0/r/styles/maia/`, and 79 prerendered pages.
7. **Dev server.** `GET /r/styles/maia/index.json` answers 200 with 60 items.
8. **Preview pages.** `previews.test.ts` finds 60 of 60.
9. **The lint.** `literals.test.ts` finds 286 item files and 0 violations; 70 of 70 bad samples flagged; 0 of 47 good. `bun scripts/lint-literals.ts` exits 0.
10. **The merge path.** `utils.test.ts` passes, case (d) over 14 of 14 importers.
11. **Blocks.** `blocks.test.ts` passes with `003`'s counts.
12. **axe.** `axe.spec.ts` reports 0 violations across 364 scans.
13. **Themes.** `theme.spec.ts` passes 158 of 158, plus 2 of 2 head-script checks per theme.
14. **Tokens in the browser.** `tokens.spec.ts` passes `004`'s checks plus 2 of 2 groove readings per theme.
15. **Keyboard.** `keyboard.spec.ts`, in 2 of 2 themes: 62 catalogue stops in order with the ring; 64 fixture stops over 32 items, 64 of 64 rings unclipped; 83 view stops over 18 views; 42 toolbar stops over 5 pages; 31 of 31 behaviours.
16. **Heights, targets, loops, elevation.** `primitives.spec.ts` passes `004`'s checks plus 6 of 6 heights, 0 fixture stops under 24 × 24 px, 0 loops on 11 new pages, the menu's shadow and the sheet's scrim in 2 of 2 themes.
17. **The menu.** `navigation.spec.ts` N1 passes in 2 of 2 themes.
18. **The sheet and the dialog.** N2 and N3 pass in 2 of 2 themes, with the geometry at 360 and 1280.
19. **The breadcrumb.** N4 passes in 2 of 2 themes.
20. **The sidebar.** N5 passes in 2 of 2 themes, at 1280 and 360.
21. **The theme.** N6 passes in 2 of 2 themes; `viewer.spec.ts`'s theme follow passes 15 of 15.
22. **The chat items.** `chat.spec.ts` L1 to L4 pass in 2 of 2 themes.
23. **Smoke.** `navigation-add.test.ts` passes 8 of 8 in each of 2 scratch apps (16 of 16). `001`'s to `004`'s smoke files still pass.
24. **Test files and release.** On a clean clone, `bun run test` exits 0, having run 9 unit files, 11 browser files in 2 projects and 6 smoke files. `package.json`'s `version` is `0.5.0`; `registry.test.ts` finds the `0.5.0` entry naming 12 of 12 and the four older entries unchanged.
25. **The checkpoint and the walk.** The Landing notes record the design lead's review after build step 4 with its screenshots' findings, and the development walk of 79 pages in 2 themes: 0 of 158 loads with a page error or a console error or warning.
26. **Released.** The change is tagged `v0.5.0` and the Landing notes cite its review.

## Landing notes

- **Built:** 2026-11-01, over `b3d2a8e` (`004`, `v0.4.0`); released as `v0.5.0` (`616b8a0`). The change review is [`../reviews/005-overlays-navigation-and-the-chat-primitives-pr-2026-11-01.md`](../reviews/005-overlays-navigation-and-the-chat-primitives-pr-2026-11-01.md): "Does not land yet" on 2 Medium and 7 Low findings; all 9 dispositioned, 8 fixed in the tree and 1 (the floating button) accepted with a sentence on the page. The design calls are in `decisions.md`: the entries after the `005` build's checkpoint, after its second build pass, and after its change review.

**Results at landing, under Bun 1.3.14, 2026-11-01** (EXECUTED by the builder after the fixes; the reviewer re-ran the suites before the fixes at the same counts less the two tests the fixes added):

| Check                                          | Result                                                                                                  |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `bun run check`                                | 1604 files, 0 errors, 0 warnings                                                                        |
| `bun run lint`, `bun scripts/lint-literals.ts` | exit 0; 0 literals in 286 item files                                                                    |
| `bun run build:tokens`, twice                  | the second run changes 0 files                                                                          |
| `bun run build:registry`, `bun run build`      | 61 + 61 byte-identical registry files; 79 prerendered pages; a clean copy builds the same               |
| `bun run test`                                 | unit 466 pass (9 files); browser 1074 passed, 0 failed (11 files × 2 projects); smoke 84 pass (6 files) |

**Criteria, as counted at landing:**

| #   | Count                                                                                                                                                                                                                                      |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | frozen install exits 0 on a clean copy; 32 packages, 18 named by items, 0 of the three refused packages                                                                                                                                    |
| 2   | 0 errors, 0 warnings; lint exit 0                                                                                                                                                                                                          |
| 3   | second `build:tokens` changes 0 files; `@utility groove-s` with 2 declarations; `004`'s rows plus 4 of 4                                                                                                                                   |
| 4   | 60 items, types 1, 3, 2, 2, 47, 5; 60 of 60 groups among 10; 0 `local:` or scheme; 31 of 31 dependency names; 47 of 47 `registry:ui` with 2 or more files; 42 of 42 `meta.stock`; 11 of 11 `since` `"0.5.0"`; 14 `tailwind-variants` items |
| 5   | 61 + 61 byte-identical; 60 of 60 parse; 0 `#lib`; 0 `/index.js"`; 0 `$UTILS$.js`                                                                                                                                                           |
| 6   | 61, 61, 79 pages on a clean copy                                                                                                                                                                                                           |
| 7   | 200 with 60 items                                                                                                                                                                                                                          |
| 8   | 60 of 60                                                                                                                                                                                                                                   |
| 9   | 286 files, 0 violations; 70 of 70 bad, 0 of 47 good                                                                                                                                                                                        |
| 10  | case (d) 14 of 14; case (e) added for the `outline` row's border order                                                                                                                                                                     |
| 11  | `003`'s counts                                                                                                                                                                                                                             |
| 12  | 364 scans, 0 violations                                                                                                                                                                                                                    |
| 13  | 158 of 158, plus 8 head-script checks (4 per project)                                                                                                                                                                                      |
| 14  | `004`'s checks plus 2 of 2 groove readings per theme                                                                                                                                                                                       |
| 15  | 62 catalogue stops; 64 fixture stops over 32 items, 64 of 64 rings unclipped; 83 view stops over 18 views; 42 toolbar stops over 5 pages; 31 behaviours                                                                                    |
| 16  | 6 of 6 heights; 0 stops under 24 × 24; 0 loops on 11 pages; the menu's shadow and the sheet's scrim in 2 of 2 themes                                                                                                                       |
| 17  | N1 in 2 of 2 themes                                                                                                                                                                                                                        |
| 18  | N2 and N3 in 2 of 2 themes, at 360 and 1280, plus N2's tall bottom sheet at 360                                                                                                                                                            |
| 19  | N4 in 2 of 2 themes                                                                                                                                                                                                                        |
| 20  | N5 in 2 of 2 themes, at 1280 and 360, plus the inset's groove 0 px off-canvas and 1 px beside                                                                                                                                              |
| 21  | N6 in 2 of 2 themes; viewer theme follow 15 of 15                                                                                                                                                                                          |
| 22  | L1 to L4 in 2 of 2 themes, L1 widened with the at-the-end gestures                                                                                                                                                                         |
| 23  | `navigation-add` 16 of 16; the older five files 68                                                                                                                                                                                         |
| 24  | 9, 11 and 6 files; exit 0; `0.5.0`; the changelog entry names `pluto-theme` and 11 items with the `sonner` and `bubble` lines                                                                                                              |
| 25  | notes 1 and 3                                                                                                                                                                                                                              |
| 26  | met: tagged `v0.5.0` (`616b8a0`); the change review cited above                                                                                                                                                                            |

**Notes:**

1. **The checkpoint after build step 4.** The builder stopped with the theme item, the three overlays, the sidebar, `is-mobile` and the breadcrumb built and 1018 browser tests green, with 28 screenshots. The design lead's reading: the sidebar's current row carries the 2 px primary edge over the accent inset and no text shifts; the groove's seam pixels match the memo's form (light `#dfdfde` then `#ffffff`; dark `#2a2c32` alone); the dialog centres 16 px in at 360 and 448 px wide at 1280; the sheet's first stop at 360 is the search field; the menu shows headings, checks, shortcuts as words and the red sign-out row with its icon. One fault: the icon-collapsed shell clipped its header text to "Pl"; the second build pass put a 32 px mark in its place. The calls are in `decisions.md`.
2. **The change review's findings applied.** The log releases its follow only on a gesture that moves away; a top or bottom sheet is capped at the viewport; the dialog's content is `relative`; "Nothing sent yet." before a send; the inset's groove follows the sidebar's state; no `data-x="false"`; the `outline` row's edge survives the merge; the sheet page's link and the changelog's theme line.
3. **The development walk.** 79 pages on `vite dev` in both themes, a fresh page per load: 0 of 158 loads with a page error or a console error or warning. Method: every page is visited once first so Vite's first-visit dependency optimisation is done; without that warm-up the editor page logs Vite's 504 "Outdated Optimize Dep" and a reload once. With one page and successive navigations, `003`'s settings block's `beforeunload` guard logs Chromium's "Blocked attempt" line on `/view/settings/errors/`; a fresh page per load avoids it.
4. **Provenance.** 8 stock-derived items carry `meta.stock` dated 2026-11-01, cli 1.7.1; 8 of 8 live sha256 verified by the reviewer. 1 of 8 differs from the clone at `6149e14`: `dialog` (`dialog-content` imports `DialogOverlay` directly instead of `./index.js`; nothing else).
5. **Where the build deviates from the specification, and who allowed it.** Each the least that works; all seen by the review and judged sound. The design calls are in `decisions.md`; the rest, by the builder:
   1. _The breadcrumb's links are `inline-flex min-h-6 items-center`_ (R21: a `text-sm` link is 21.6 px) with `transition-[color]`, not `transition-colors`.
   2. _The submenu's `alignOffset` is −4_, so its first row lines up with its trigger past the panel's 4 px padding.
   3. _The theme store reads storage once at module start_; a lazy read in a getter mutates state during a derived read. Its effects live in a `$effect.root`.
   4. _`ThemeToggle` shows the light icon until mount_ and omits `aria-pressed` until then; the key `pluto-theme` is written in the store and in the head script's constant, with a comment on each.
   5. _The nonce check compiles `theme-script.svelte` and renders it on the server_ inside `theme.spec.ts`, since the preview passes no nonce.
   6. _The sidebar page's keyboard fixture is a third, minimal shell_; the row tooltip is mounted only while collapsed to icons on desktop; the row's `data-slot` wins over the tooltip trigger's.
   7. _Stub pages for `message` and `marker` in the first build pass_, since the prerenderer refuses a catalogue link to a missing page; overwritten in the second.
   8. _`MessageGroup` is `flex-1 items-end` in an end-aligned turn_; the log page's three regions carry three names (`landmark-unique`); the composer preview holds `submitted` 700 ms; the fourth new dependency name is `tooltip` (decision 4 reads so).
   9. _Three keyboard behaviours wait out Chromium's animated keyboard scroll_ (~800 ms) and poll the Stop button's colour transition.
   10. _bits-ui leaves a menu open on Tab when its trigger is the page's last stop_; the menu page puts a link after its fixture and says so.
   11. _The dropdown menu renders in place; the dialog has a positioner; every sidebar row carries a transparent edge; the trigger closes its tooltip on press; the floating button is absolute over the box and hides while following; the follow releases only on an away gesture; the inset's groove follows the sidebar's state._ The design lead.
6. **For `006` and a consuming app.**
   - `ThemeScript` renders once per layout group that needs it: an app's root layout; the preview's `(site)` and `(view)`. The toggle is `aria-pressed` after hydration.
   - `SidebarProvider` is a column wrapping the whole shell; the row of sidebar and inset is the consumer's `div`; the one trigger lives in the header. The inset's groove follows the sidebar's state, so a shell need not hide it.
   - The dropdown menu is in place: a trigger that is the page's last stop keeps the menu open on Tab; `006`'s header always has content after it.
   - The log's "Scroll to end" button may cover the corner of the last bubble while scrolled away; a composition that wants it clear places its control outside the box.
   - The composer's status words are "Responding", "Stopped", "Response complete"; the ready after a stop is silent.
   - A top or bottom sheet is capped at the viewport and scrolls inside.
