# The overlay items: dropdown menu, sheet, dialog, breadcrumb, and the toast question

- **Status:** complete
- **Date:** 2026-11-01
- **Author:** the design lead
- **Question:** For the overlay and navigation items of `005`: what are the stock `dropdown-menu`, `sheet`, `dialog`, `breadcrumb` and `sonner` made of, what in each must change to meet our rules, what accessibility contract bits-ui's Menu and Dialog carry, how the overlays are positioned and layered, whether a toast belongs in our registry at all, and what `mode-watcher` does that this repository does not already do.
- **What it blocks:** specification `005`, overlays and navigation, released as `v0.5.0`; through it `006`'s app shell (the header menu, the mobile navigation sheet, the sidebar's page header) and the settings block's feedback pattern.

## How to read this memo

Every claim carries a label.

- **EXECUTED**: we ran it and saw the result, on 2026-11-01, macOS (Darwin 25.5.0, arm64), Bun 1.3.14. Browser checks ran in Playwright 1.64.1's Chromium, from the repository's `node_modules/@playwright/test`; the repository was not touched.
- **READ**: a source says so. Each web source was read on 2026-11-01. Paths in the prior-art clone are relative to `context/prior_art/shadcn-svelte/`, at commit `6149e14` (MIT). Paths starting `bits-ui/` are relative to `node_modules/bits-ui/dist/` (bits-ui 2.20.2, MIT). Paths starting `svelte-sonner/` and `mode-watcher/` are relative to each package's `dist/` in the scratch app (svelte-sonner 1.2.2, mode-watcher 1.1.0, both MIT).
- **INFERRED**: our reasoning.

Scratch work was done in a throwaway folder outside this repository, not kept: `stock/` (the five items' built maia files, extracted by `extract.ts`), `lint-stock.txt` (the lint run), `app/` (a copy of `tests/smoke/fixtures/kit3` with the five stock items installed from the live registry), `probe.ts`, `probe2.ts`, `probe3.ts` (the Playwright runs) and their `*-out.json`, `view/` (`bun pm view`). Nothing was written to this repository except this memo.

Terms of art.

- **Stock item.** An item from shadcn-svelte's own registry as `add` serves it, built in the maia style (primitives memo §3.1).
- **The lint.** `scripts/lint-literals.ts`, with `001` decision 25's rules, `002` decision 21's L1 to L18 and `004` decision 15's L20 and L21. It is stronger than the lint the primitives memo ran on 2026-10-28, so the counts here are higher than that memo's.
- **The ladder.** `001` decision 10's sizes: 4, 8, 12, 16, 24, 32, 48, 64 and 96 px.
- **The checklist.** `002` decision 9's R1 to R22.
- **Overlay.** Content shown above the page in its own layer: a menu, a popover, a tooltip, a dialog, a sheet.
- **Modal.** An overlay that blocks the page behind it until it closes.
- **Scrim.** The dimmed layer behind a modal (`002` decision 7's `bg-scrim`).
- **Portal.** Rendering an element as a child of `<body>` instead of where it sits in the component tree.
- **Floating UI.** The positioning library (`@floating-ui/dom`) bits-ui uses to place a panel beside its trigger.
- **Toast.** A short message that appears in a corner of the screen, usually briefly.
- **Live region.** An element whose text changes are announced by assistive technology without moving focus.
- **Typeahead.** Moving focus inside a menu by typing the first letters of an item.

## In short

- **The five stock items fail the lint 108 times in 23 of their 50 files** (EXECUTED, §1.2, §2.1, §3.1, §4.1): `dropdown-menu` 57 in 10 of 18, `sheet` 23 in 4 of 11, `dialog` 20 in 4 of 11, `breadcrumb` 6 in 4 of 8, `sonner` 2 in 1 of 2. Most are the `tw-animate-css` classes, the translucent ring, the preset shadows, the `bg-black/80` scrim, off-ladder spacing (`pl-9.5`, `gap-2.5`, `py-2.5`, `gap-1.5`) and `outline-hidden`. All five restyle onto `popover`'s and `alert-dialog`'s chrome.
- **bits-ui's Menu is an APG menu button and menu** (READ and EXECUTED, §1.3, §1.4): `aria-haspopup="menu"`, `aria-expanded`, `aria-controls` while open; `role="menu"` with `menuitem`, `menuitemcheckbox`, `menuitemradio`, `group` named by its heading, `separator`; Enter, Space and Down open with focus on the first item; Up and Down loop; Home and End; typeahead with a one-second buffer; Right opens a submenu and Left closes it; Escape closes and returns focus to the trigger; Tab closes and moves to the next tabbable. It shares Floating UI's popper layer with `popover` and `tooltip`.
- **Three things in the stock menu are not accessible** (EXECUTED, §1.5): the shortcut is bare symbols that join the item's name ("Profile ⇧⌘P"); `DropdownMenuLabel` is a plain `div` with no id, so it names nothing; a checked item is told by `aria-checked` and an icon, which is fine, but the stock label text carries no second cue for sighted users beyond the icon. A disabled item is `aria-disabled` and skipped by the arrows.
- **A sheet and a dialog are the same eleven files** (READ, §2.1): both are bits-ui `Dialog`; the diff is the `side` prop and two class strings. Both render `role="dialog" aria-modal="true"`, labelled by the title (a `div role="heading" aria-level="2"`) and described by the description; focus moves to the first tabbable one frame after open, loops, and returns to the trigger on Escape, on an outside click and on a close button; `body` gets `overflow: hidden; pointer-events: none` while open; nothing outside gets `inert` or `aria-hidden` (EXECUTED, §2.3).
- **The exit fade works with our variant** (EXECUTED, §2.4): `data-closed:animate-exit` fired because `shadcn-svelte/tailwind.css` maps `data-closed` to `[data-state="closed"]`, which bits-ui sets; the node stayed 203 ms while opacity fell 0.32 → 0.01, then left. A slide works the same way with a `translate` keyframe. Under `prefers-reduced-motion` the token reads 0 ms and the node left in 41 ms. A slide needs new keyframes in `pluto-theme`; a fade needs nothing.
- **A breadcrumb is three ARIA facts** (READ, §3.2): a `nav` landmark with a label, a list, `aria-current="page"` on the last. Stock has them, plus a `role="link" aria-disabled` on the current page that announces as a disabled link, and an ellipsis that is `aria-hidden` with an `sr-only` "More" inside it, so it says nothing (EXECUTED, §3.1). 16 of 16 stock sidebar blocks use it; a product site without a page hierarchy has no use for one (INFERRED, §3.4).
- **`svelte-sonner` is a polite `region` named "Notifications alt+T" holding an `ol` whose every toast is an `li` with `tabindex="0"` and its own `aria-live`** (EXECUTED, §4.1): 356 px wide by inline style, 13 px type, a 20 px close button, 4 s auto-dismiss, paused on hover and focus, the hotkey Alt+T, its own 89-rule stylesheet with keyframes that `prefers-reduced-motion` turns off. It needs no `mode-watcher`: `theme="system"` reads `prefers-color-scheme`, and token colours flip by CSS variable anyway.
- **The sources are divided on toasts** (READ, §4.2): Primer says "avoid using a toast for now" and prefers an inline message; Roselli and O'Hara allow a toast only as a `status` region that exists at render, never focused, never timed out without control; Carbon and Red Hat serve persistent, dismissible toasts. Our registry already has `status` and `alert` (§4.3). The recommendation is to decline `sonner` with a documented pattern (§4.4). `005` decision 14 declines it.
- **`mode-watcher`** (READ and EXECUTED, §4.5): a `<ModeWatcher />` component that injects a head script through `<svelte:head>`, keys `mode-watcher-mode` and `mode-watcher-theme` in `localStorage`, a tri-state `light | dark | system`, the `dark` class and an inline `color-scheme`; last released 2025-06-28; 1.3 MB on disk with its own older copies of `runed` and `svelte-toolbelt`. This repository already has a 12-line head script and a 30-line toggle that do the two-state version. `005` decision 6 serves a `theme` item of our own, not `mode-watcher`.
- **Layering** (EXECUTED, §5): every overlay is `z-50`; a menu opened inside a sheet is portalled after the sheet and paints above it; a toaster outside a sheet is covered by a right-side sheet and inherits `pointer-events: none` from the scroll lock.

## 1. `dropdown-menu`

### 1.1 The stock item (READ)

18 files, `bits-ui@^2.20.0` and `@internationalized/date@^3.12.0`, no registry dependency (`docs/static/registry/styles/maia/dropdown-menu.json`). The docs page describes it as "Displays a menu to the user — such as a set of actions or functions — triggered by a button" (`docs/content/components/dropdown-menu.md` line 3) and shows submenu, shortcuts, icons, checkboxes, radio group, destructive and avatar examples (lines 95 to 185). The parts: `Root`, `Trigger`, `Content`, `Portal`, `Group`, `GroupHeading`, `Label`, `Item` (with `inset` and `variant` `default | destructive`), `CheckboxGroup`, `CheckboxItem`, `RadioGroup`, `RadioItem`, `Separator`, `Shortcut`, `Sub`, `SubTrigger`, `SubContent`.

The built item carries the `cn-menu-target` and `cn-menu-translucent` markers, which `add` removes for `menuColor: "default"` (primitives memo §3.1; EXECUTED: the live-installed `dropdown-menu-content.svelte` holds the same class string as the clone's with the two markers gone).

### 1.2 What the lint rejects (EXECUTED)

`extract.ts` wrote the built files to `stock/dropdown-menu/` and ran `lintText` on each with this repository's rules. **57 findings in 10 of 18 files.** Line numbers are of the extracted files, which match `docs/src/lib/registry/ui/dropdown-menu/` line for line.

| File | Count | Findings |
|---|---|---|
| `dropdown-menu-content.svelte` (line 26) | 18 | ten `tw-animate-css` classes (`data-open:animate-in`, `data-closed:animate-out`, `fade-*-0`, `zoom-*-95`, four `slide-in-from-*-2`); `ring-foreground/5`; `dark:ring-foreground/10`; `min-w-48`; `shadow-2xl`; `ring-1`; `duration-100`; `cn-menu-target`; `cn-menu-translucent` |
| `dropdown-menu-sub-content.svelte` (26) | 17 | the same minus the `dark:` ring, with `min-w-36` |
| `dropdown-menu-item.svelte` (23) | 6 | `data-[variant=destructive]:focus:bg-destructive/10`, `dark:…focus:bg-destructive/20` (a state tint with a variant the sanctioned list does not allow), `gap-2.5`, `data-inset:pl-9.5`, `outline-hidden` |
| `dropdown-menu-checkbox-item.svelte` (27), `dropdown-menu-radio-item.svelte` (20) | 3 each | `gap-2.5`, `data-inset:pl-9.5`, `outline-hidden` |
| `dropdown-menu-sub-trigger.svelte` (22, 34) | 3 | `data-inset:pl-9.5`, `outline-hidden`, `cn-rtl-flip` |
| `dropdown-menu-label.svelte` (20), `dropdown-menu-group-heading.svelte` (20) | 2 each | `py-2.5`, `data-inset:pl-9.5` |
| `dropdown-menu-separator.svelte` (15) | 2 | `bg-border/50`, `h-px` |
| `dropdown-menu-shortcut.svelte` (16) | 1 | `tracking-widest` |

Eight files pass: `checkbox-group`, `group`, `portal`, `radio-group`, `sub`, `trigger`, `dropdown-menu.svelte`, `index.ts`. The primitives memo counted 13 with `001`'s lint alone (its §3.3); the rest are `002`'s class rules.

Against the checklist, what the lint cannot see (READ, the same files):

- **R9:** `rounded-2xl` on the panels (16 px, EXECUTED), `rounded-xl` on items (12 px). Ours is `rounded` (8 px) on both.
- **R4, R5:** item padding `px-3 py-2` gives a 36 px item (EXECUTED), off the ladder; the inset `pl-9.5` is 38 px (12 px padding, a 16 px icon, a 10 px gap).
- **R10:** `shadow-2xl` computed `rgba(0,0,0,0.25) 0 25px 50px -12px` plus the 5% ring as a 1 px spread (EXECUTED). Ours is `shadow-elevation`.
- **R2:** `outline-hidden` on every item. bits-ui itself also writes `style="outline: none"` on the content (`bits-ui/bits/menu/components/menu-content.svelte` lines 37 to 41). The content takes focus only when the pointer leaves an item (§1.3), so the global ring never needs to show on it.
- **R7, R19:** the destructive item is red text on a red 10% tint when focused. The tint is flagged; the text alone also tells the state by colour.
- **R13:** `tracking-widest` (0.1 em) on the shortcut; our scale has `display`, `section`, `eyebrow`, `mark`.
- **R16:** three `cn-` markers.
- **R14:** `duration-100`; the animation classes need `tw-animate-css`, which no item names and our apps never install (primitives memo §3.1; `002` decision 3).
- The separator is `h-px` (L7) in `bg-border/50`, a 1 px line at 5% ink (EXECUTED: `oklab(… / 0.05)`), well under `border`'s own 10%.

### 1.3 What bits-ui's Menu does (READ: `bits-ui/bits/menu/menu.svelte.js`; EXECUTED on the scratch page)

| Aspect | READ | EXECUTED |
|---|---|---|
| Trigger | `aria-haspopup="menu"`, `aria-expanded`, `aria-controls` only while open, `data-state` (lines 1486 to 1492); Space and Enter toggle, ArrowDown opens (1467 to 1478) | closed: `aria-haspopup="menu" aria-expanded="false"`, no `aria-controls`; open: `aria-expanded="true" aria-controls="bits-c1"`, equal to the content's id. ArrowUp did **not** open (APG lists it as optional) |
| Content | `role="menu"`, `aria-orientation="vertical"`, `data-state`, `style` `pointer-events: auto; contain: layout style` plus five `--bits-dropdown-menu-*` variables (958 to 972; the component adds `outline: none`) | confirmed; `tabindex="-1"`; the ARIA snapshot reads `menu` holding the text "My account", a `group` of three `menuitem`s, `separator`, `menuitemcheckbox "Show status bar" [checked]`, `group "Theme"` of two `menuitemradio`s, `menuitem "Invite users"`, `menuitem "Sign out"` |
| Focus on open | the focus scope focuses the first tabbable one frame after mount (`bits-ui/bits/utilities/focus-scope/focus-scope.svelte.js` 64 to 89); items are `tabindex="-1"`, so the roving group's first candidate takes it on the content's `onfocus` when a keyboard opened it (906 to 909) | Enter, Space and ArrowDown each put focus on "Profile", the first item. A mouse click left focus on the trigger; moving the pointer over an item focused it and set `data-highlighted` |
| Arrows | `RovingFocusGroup`, vertical, `loop` default `true` (`menu-content.svelte` line 18; 750 to 755) | ArrowDown: Billing, then "Show status bar" (the disabled "Keyboard shortcuts" skipped), then "Light"; ArrowUp from the first wrapped to "Sign out" |
| Home and End | `FIRST_LAST_KEYS` when the event target is the content itself (884 to 892); otherwise the roving group handles them | End: "Sign out"; Home: "Profile" |
| Typeahead | `DOMTypeahead` over the items' `textContent`, a one-second buffer (`bits-ui/internal/dom-typeahead.svelte.js` 18 to 33); Space is excluded (876) | "b" → Billing; "s" → "Show status bar"; "si" → "Sign out" |
| Select | Enter and Space click the item (1078 to 1092); `closeOnSelect` default true on `Item`, false on stock's checkbox and radio items (`dropdown-menu-checkbox-item.svelte` line 13) | Enter on an item closed the menu and returned focus to the trigger. Space on the checkbox flipped `aria-checked` to `false` with the menu still open; Enter on "Dark" moved `aria-checked` and kept the menu open |
| Submenu | sub-trigger: `role="menuitem"`, `aria-haspopup="menu"`, `aria-expanded`, `aria-controls` while open (1225 to 1231); ArrowRight opens in LTR (1193 to 1197); ArrowLeft closes (`SUB_CLOSE_KEYS`) | ArrowRight opened the submenu (`role="menu"`, id equal to the trigger's `aria-controls`) with focus on "Email"; ArrowLeft closed it and focus returned to "Invite users" |
| Escape | `EscapeLayer` → `parentMenu.onClose()` (`menu-content.svelte` 54 to 58); `onCloseAutoFocus` focuses the trigger when it is tabbable (809 to 820) | the menu left the DOM, `aria-expanded="false"`, focus on "Account" |
| Tab | `handleTabKeyDown` closes the root menu and focuses the next or previous tabbable from the root trigger (821 to 855) | Tab from an item: menu gone, focus on "After"; Shift+Tab: focus on "Before", menu gone within 400 ms |
| Outside click | `handleInteractOutside` closes without refocusing the trigger when another element was clicked (928 to 945) | not run |
| Positioning | `menu-content.svelte` renders through `PopperLayer` (line 7), the same layer `popover-content.svelte` (line 5) and `tooltip-content.svelte` (line 6) use; `use-floating-layer.svelte.js` imports `@floating-ui/dom`'s `autoUpdate`, `flip`, `shift`, `size`, `hide`, `offset` (line 1) | the content sits in a `div[data-bits-floating-content-wrapper]` that is a child of `<body>`, `position: fixed; transform: translate(96px, 168px); min-width: max-content; z-index: 50`, with `--bits-floating-available-height: 632px` and `--bits-floating-anchor-width: 59.97px` |

So bits-ui meets the APG menu button pattern (READ, `https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/`: "Enter: opens the menu and places focus on the first menu item", `aria-haspopup` "set to either menu or true", `aria-expanded` when displayed, `aria-controls` "optionally") and the APG menu keyboard contract (READ, `https://www.w3.org/WAI/ARIA/apg/patterns/menubar/`: Down and Up "optionally wrapping", Home and End, Escape closes "and return focus", "Tab and Shift + Tab do not move focus into a menu", typeahead optional, Right "opens the submenu and places focus on its first item", Left "closes the submenu and returns focus to the parent menuitem", `aria-checked` on checkbox and radio items, a parent item with `aria-haspopup` and `aria-expanded`, `aria-disabled` on a disabled item). INFERRED: `005` adds no key handling of its own.

### 1.4 Roles of the small parts (EXECUTED, READ)

- **Group and heading:** `Group` is `role="group"` with `aria-labelledby` the `GroupHeading`'s id (lines 1305 to 1306, 1388 to 1389); the heading itself is a `div` with no role. The snapshot read `group "Theme"`.
- **`Label`** (stock's own part, `dropdown-menu-label.svelte`) is a `div` with no role and no id. "My account" appeared as loose text inside the menu, attached to nothing.
- **Separator:** `role="separator"` (line 1350), no `aria-orientation` (defaults to horizontal).
- **Checkbox item:** `aria-checked` `true | false | mixed` (1284 to 1286) and a 16 px check icon at `right-2`, `aria-hidden`, inside a `span` indicator. **Radio item:** `aria-checked` and `data-state` (1417 to 1419).
- **Shortcut:** a `span` with no role; its text joined the item's accessible name: `menuitem "Profile ⇧⌘P"`.

### 1.5 What is not accessible as shipped (INFERRED from §1.3 and §1.4)

1. **The shortcut is symbols read aloud.** "⇧⌘P" becomes part of the name a screen reader says. A shortcut written as `kbd` text ("Shift+Cmd+P"), or hidden with `aria-hidden` while the item's `aria-keyshortcuts` carries it, reads better. Stock also binds no key for it: `DropdownMenuShortcut` is a label only. A shown shortcut that does nothing is a promise an app must keep itself.
2. **`Label` names nothing.** A menu title should name the menu (`aria-labelledby` on the content) or be a `GroupHeading` inside a `Group`. Without that, "My account" is a stray line of text.
3. **Checked state is an icon only, for sighted users.** `aria-checked` serves assistive technology; the 16 px check is the only visible cue. That passes R19 (an icon is a shape), but at `right-2` the icon sits in the `pr-8` gutter, and nothing else changes.
4. **The destructive item is red text and a red tint.** R19 asks for a second cue: an icon or a word ("Sign out" says it; a lone "Delete" does not).
5. **`outline-hidden` on items.** Focus is shown by the `accent` ground alone (R2). That is the convention for menus (the focused item is the highlighted one), and bits-ui sets `data-highlighted` for it. The global ring is suppressed. Whether `accent` alone is the focus sign was left to `005`; its decision 7 keeps the global focus ring above the `accent` inset.

### 1.6 The chrome a menu should take (INFERRED, measured against `004` decision 11 and `002` decisions 7, 9, 10)

- **Panel:** `popover`'s: `z-50 rounded bg-popover text-popover-foreground shadow-elevation data-open:animate-enter data-closed:animate-exit`, no border, no ring. The data memo §5.2 saw the elevation in both themes; this memo saw the exit fade run (§2.4). Padding `p-1` (4 px) as stock, so the item rounding sits inside the panel's. Width: stock `min-w-48` (192 px) and `min-w-36` (144 px) are off the ladder (data memo §5.3); `min-w-3xs` (256 px) or `min-w-24` (96 px) pass L7, and `w-(--bits-dropdown-menu-anchor-width)` (the token form) is allowed. Keep `max-h-(--bits-dropdown-menu-content-available-height) overflow-y-auto`: Floating UI's `size` middleware fills it (EXECUTED: 632 px on the probe page).
- **Item height:** stock's 36 px fails R5. `h-8` (32 px) is the `sm` control height and clears R21's 24 px; `h-12` (48 px) would make a ten-item menu 488 px tall. **Recommend `h-8`**, `text-sm`, `rounded`, `px-2 gap-2` with 16 px icons, so an inset item is `pl-8` (8 + 16 + 8 = 32 px, on the ladder). `px-3` would make the inset 36 px (`pl-9`, off). Labels and group headings: `h-8 px-2 text-xs text-muted-foreground`, or `py-2` on a 16 px line box for 32 px.
- **Hover and focus ground:** `accent` with `accent-foreground` (`001` decision 8 line 277: "component insets only: hover and selected rows"; 15.00 light, 12.83 dark, decision 12 row 6). EXECUTED: the hovered stock item computed `rgb(234, 234, 231)`, which is `accent`. bits-ui focuses an item on pointer move, so hover and focus are one state: `data-highlighted:bg-accent`. A destructive item keeps `text-destructive` on the same `accent` ground (4.71 light, 5.53 dark, `002` decision 19's badge row) with no tint, plus an icon.
- **Separator:** `border-t border-border -mx-1 my-1` (R22, the bare hairline) instead of `h-px bg-border/50`; or `002`'s groove if the menu should match card dividers. The 5% line is faint on purpose; the 10% hairline is the token.
- **Check and radio indicators:** `Check` and a dot (or `Check` for both, as stock) from `phosphor-svelte`, `size-4`, `aria-hidden`, at `start-2` or `end-2` with the matching `ps-8`/`pe-8`. A radio dot that is dot-derived may be round (`002` decision 19's allowlist would need the item file added; a `Check` avoids the question).
- **Shortcut:** `font-mono text-xs text-muted-foreground tracking-mark`, or the `kbd` item inline; written as key names, not symbols (§1.5).
- **Sub-trigger caret:** `CaretRight` `size-4`, `aria-hidden`, `ms-auto`, as the accordion's.

## 2. `sheet` and `dialog`

### 2.1 The stock items (READ, EXECUTED)

`sheet`: 11 files, `bits-ui`, registry dependency `button` (for the close button). `dialog`: 11 files, the same. The docs describe a sheet as "Extends the Dialog component to display content that complements the main content of the screen" with `side` "top, right, bottom, or left" (`docs/content/components/sheet.md` lines 3, 84) and a dialog as "A window overlaid on either the primary window or another dialog window, rendering the content underneath inert" (`dialog.md` line 3).

EXECUTED: `diff stock/sheet/sheet-content.svelte stock/dialog/dialog-content.svelte` differs in the `Side` type and `side` prop, the component names, and the one class string each. The other nine files differ only in names, except: `dialog-footer.svelte` takes `showCloseButton` and renders an `outline` "Close" button (lines 25 to 31); `dialog-header.svelte` is `gap-2` where the sheet's is `gap-1.5`; `dialog-title.svelte` adds `leading-none`; `dialog-description.svelte` styles links inside it. **A sheet is a dialog fixed to an edge.**

The lint (EXECUTED): **`sheet` 23 findings in 4 of 11 files; `dialog` 20 in 4 of 11.**

| File | Findings |
|---|---|
| `sheet-content.svelte` line 38 (14) | `shadow-lg`; `duration-200`; twelve `tw-animate-css` classes (`animate-in`, `fade-in-0`, four `slide-in-from-*-10`, `animate-out`, `fade-out-0`, four `slide-out-to-*-10`) |
| `sheet-overlay.svelte` 16 (7) | `bg-black/80`; `supports-backdrop-filter:backdrop-blur-xs`; `duration-100`; four animation classes |
| `sheet-header.svelte` 16 (1) | `gap-1.5` |
| `sheet-title.svelte` 15 (1) | `cn-font-heading` |
| `dialog-content.svelte` 31 (11) | six animation classes; `ring-foreground/5`; `max-w-[calc(100%_-_2rem)]`; `ring-1`; `duration-100`; `outline-none` |
| `dialog-overlay.svelte` 15 (7) | as the sheet's |
| `dialog-title.svelte` 15 (1) | `cn-font-heading` |
| `dialog-footer.svelte` 28 (1) | the word `outline` in `variant="outline"`, a false positive of the outline rule |

What the lint cannot see (READ): `rounded-4xl` on the dialog (32 px, EXECUTED; R9 → `rounded`); `font-medium` on both titles (R17 → `font-heading font-bold`); the sheet's `border-l` (or `-r`, `-t`, `-b`) hairline on its page edge, redundant once `shadow-elevation` draws the edge; `text-sm` on the whole sheet root; `bg-clip-padding`; `w-3/4` and `sm:max-w-sm` (a fraction and a container keyword, both allowed by L7); `sm:max-w-md` on the dialog (448 px, EXECUTED). These are `002` decision 17's `alert-dialog` findings again, which that item already resolved: `bg-popover text-popover-foreground shadow-elevation rounded p-6 gap-6`, the overlay `fixed inset-0 bg-scrim` with `animate-enter`/`animate-exit`, title `font-heading text-base font-bold`, description `text-sm text-muted-foreground` (`src/lib/registry/ui/alert-dialog/alert-dialog-content.svelte`, `alert-dialog-overlay.svelte`, READ).

### 2.2 The sheet's geometry (EXECUTED, 1280 × 800 and 360 × 700)

| Reading | Value |
|---|---|
| Right sheet, 1280 px wide viewport | `width: 384px` (`sm:max-w-sm`), `height: 800px`, `right: 0`, `position: fixed`, `z-index: 50`, `border-left-width: 1px`, `box-shadow` `rgba(0,0,0,0.1) 0 10px 15px -3px, rgba(0,0,0,0.1) 0 4px 6px -4px` (`shadow-lg`), `transition-duration: 0.2s` |
| Right sheet, 360 px viewport | `width: 270px` (`w-3/4`), `max-width: none` |
| Overlay | `fixed inset-0 z-50`, `background-color: oklab(0 0 0 / 0.8)` (`bg-black/80`), `backdrop-filter: blur(4px)` |
| Close button | a `button type="button"` named "Close" by `sr-only` text, `32 × 32 px` (stock `size="icon-sm"`, `size-8`), `position: absolute; top: 16px; right: 16px` (`top-4 right-4`), rendered after the children so it is the **last** tab stop |
| `body` while open | `style="overflow: hidden; pointer-events: none;"`; `<html style="color-scheme: light">` (from the scratch CSS); no `inert` and no `aria-hidden` on `<main>` |

INFERRED against our rules: `w-3/4 sm:max-w-sm` pass L7 and stay; the four sides stay as `data-[side=…]` classes (fractions and `inset-*`, no literals). The close button becomes our `button` `ghost` `icon-sm` (`size-8`, 32 px, above R21's 24 px; `002` decision 10: icon buttons are `size-8` and `size-12`) at `top-4 right-4`, with `XIcon` from `phosphor-svelte` `size-4` and the `sr-only` "Close" kept (an `aria-label` would do the same). The scrim is `bg-scrim` with no blur (`002` decision 7; the design book §09). The edge is `shadow-elevation` with no `border-*`.

### 2.3 Dialog behaviour (READ: `bits-ui/bits/dialog/dialog.svelte.js`, `components/dialog-content.svelte`, `utilities/focus-scope/focus-scope.svelte.js`; EXECUTED)

| Aspect | READ | EXECUTED |
|---|---|---|
| Trigger | `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls` (lines 127 to 129) | the dialog trigger read `aria-haspopup="dialog" aria-expanded="true" aria-controls="bits-c7"` |
| Content | `role` `dialog` or `alertdialog` by variant, `aria-modal="true"`, `aria-describedby`, `aria-labelledby`, `style` `pointer-events: auto; contain: layout style` plus two `--bits-dialog-*` variables; `tabindex="-1"` and `outline: none` only for the alert variant (263 to 283) | sheet and dialog: `role="dialog" aria-modal="true" aria-labelledby aria-describedby tabindex="-1"`, the style as read |
| Title and description | `Title` renders `role="heading" aria-level` (215 to 216), default level 2; `Description` an id the root records | the sheet's title was a `div role="heading" aria-level="2"` with text "Navigation"; `aria-describedby` resolved to "Where to go next." |
| Layers | `FocusScope` (`loop`, `trapFocus` default `true`), `EscapeLayer`, `DismissibleLayer`, `TextSelectionLayer`, `ScrollLock` (`preventScroll` default `true`) (`dialog-content.svelte` 24 to 96) | see the rows below |
| Focus on open | `onOpenAutoFocus` event, then one `requestAnimationFrame` later the first tabbable, else the container (`focus-scope.svelte.js` 64 to 89) | read at 0 ms the trigger still had focus; at 200 ms the sheet's first link "Docs" had it (by click and by Enter), and the dialog's `<input>`. A sheet with no tabbable child but the close button focused the close button |
| Trap and loop | `loop` | Tab from "Docs": "Nested menu", "Close", "Docs" |
| Escape | `EscapeLayer` → `handleClose` | the sheet left the DOM in 3 ms (no exit animation available) and focus returned to "Open sheet" |
| Outside click | `DismissibleLayer` → `handleClose` | a click on the overlay closed the sheet, focus on the trigger; a click inside the sheet but outside an open nested menu closed only the menu (§5) |
| Return of focus | `onCloseAutoFocus` → the element focused before the scope opened (91 to 110) | the trigger, every time, including after the exit animation (§2.4) |
| A sheet with no `Title` | nothing warns | `aria-labelledby` and `aria-describedby` both null; the console was empty. A dialog with no name is an axe failure (`004` decision 11 tests `aria-dialog-name` for popovers). Stock's sidebar wraps a `sr-only` header with title "Sidebar" and description "Displays the mobile sidebar." (`docs/src/lib/registry/ui/sidebar/sidebar.svelte` lines 50 to 53) |

This matches the APG modal dialog pattern (READ, `https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/`: Tab "Moves focus to the next tabbable element inside the dialog", Escape "Closes the dialog", `role="dialog"`, `aria-modal="true"`, `aria-labelledby` "that refers to a visible dialog title", `aria-describedby` optional, "focus is initially set on the first focusable element", for long content "add `tabindex="-1"` to a static element at the top", "When a dialog closes, focus returns to the element that invoked the dialog"). The patterns memo §1.2 asked that the return of focus be tested because shadcn's trigger opens the sheet through shared state; EXECUTED: the stock `Sheet.Trigger` is bits-ui's own trigger, and focus returned to it in every run. The sidebar's trigger is a different button (it sets shared state); that case is the sidebar memo's.

INFERRED: `aria-modal="true"` with no `inert` behind it relies on assistive technology honouring `aria-modal`; the APG accepts that. `002` decision 17 already relies on it for `alert-dialog`.

### 2.4 Motion (EXECUTED, READ)

- **How bits-ui keeps a closing node.** `PresenceManager` sets `data-ending-style` and keeps `shouldRender` until `AnimationsComplete` sees every `node.getAnimations()` promise settle (`bits-ui/internal/presence-manager.svelte.js` 21 to 61; `animations-complete.js` 40 to 47; `attrs.js` 19 to 25). It sets `data-state="closed"`, never a bare `data-closed` attribute.
- **Why `data-closed:` works anyway.** `shadcn-svelte/dist/tailwind.css` lines 22 to 34 define `@custom-variant data-open` as `[data-state="open"]` or `[data-open]`, and `data-closed` as `[data-state="closed"]` or `[data-closed]`. `001` imports that file into every app's CSS (`001` decision 4 line 112; lines 568 and 587), and the repository's own built CSS carries `.data-closed\:animate-exit:where([data-state=closed])`. The scratch app did not import it at first, and no exit ran; with the two variants copied in, it did.
- **The fade.** With `data-closed:animate-pluto-exit` (a copy of `002` decision 3's `pluto-exit`, `var(--motion-micro)`, `forwards`) on the sheet content: on Escape the node stayed **203 ms**, polled at 40 ms as `closed | data-ending-style | 1 animation | opacity 0.32, 0.14, 0.03, 0.01`, then left; focus was back on the trigger.
- **A slide.** `@keyframes pluto-slide-exit { to { opacity: 0; translate: 100% 0 } }` ran the same way: `translate` 67.7%, 86.0%, 96.8%, 99.3% over 203 ms. So a slide needs **one keyframe per side and direction** (`translate: 100% 0`, `-100% 0`, `0 100%`, `0 -100%`, each for enter and exit: eight keyframes and eight `--animate-*` tokens), all reading `--motion-micro`. A fade needs nothing new: `animate-enter` and `animate-exit` exist.
- **Reduced motion.** Under `prefers-reduced-motion: reduce` the scratch `--motion-micro` read `0s` and the node left in 41 ms; in the repository `001` decision 14 sets both the token to 0 ms and a catch-all `animation-duration: 0.01ms` for third-party animation, so a stock class would also stop.
- **The stock overlay and menu** (no `tw-animate-css` installed) left in 40 and 41 ms: no animation, no error, as the primitives memo §3.1 inferred.

INFERRED for `005`: the design book §06 allows micro-feedback of at most 200 ms, and the patterns memo §1.3 reads "the sheet's slide" as such feedback. The choice is a fade (consistent with popover, alert-dialog and the menu; zero new CSS) or a slide plus fade over 200 ms (eight keyframes in `pluto-theme`, `data-[side=…]:data-open:animate-enter-from-end` and so on). Stock slides 40 px (`slide-in-from-right-10`), not the full width; a 40 px slide is `translate: 2.5rem 0`, a ladder value (40 is not on the ladder; 32 or 48 are). A full-width slide (`100%`) carries no size literal at all. `005` decision 8 takes the fade: the sheet fades and does not slide.

### 2.5 Should `005` serve `dialog`? (INFERRED)

For: `sheet` is `dialog` with a side (§2.1), so serving both is one recipe, not two; `alert-dialog` exists and cannot hold a form (`alertdialog` is for a message that needs a response); `popover` is non-modal and 256 px wide; `006`'s app shell will likely want a plain modal dialog for a rename, a settings pane or a non-destructive confirm (stock's one use, `sidebar-13/components/settings-dialog.svelte`, is a settings dialog); the cost is 11 files with 20 findings, every one already answered by `alert-dialog`'s restyle. Against: constitution §4.2 adds a component "when an app needs it", and no block in `003` names a dialog (INFERRED: no current consumer asks for one). **Recommendation:** serve `dialog` in `005` alongside `sheet`, sharing one overlay and one content recipe, because the marginal work is small and `006` is next. `005` decision 8 serves both.

## 3. `breadcrumb`

### 3.1 The stock item (READ, EXECUTED)

8 files, no package, no registry dependency; two icon placeholders (`DotsThreeIcon`, `CaretRightIcon` for phosphor). "Displays the path to the current resource using a hierarchy of links" (`docs/content/components/breadcrumb.md` line 3); the docs compose an item with a `DropdownMenu` and offer `Breadcrumb.Ellipsis` "to show a collapsed state when the breadcrumb is too long" (lines 95 to 107).

Structure (READ): `Breadcrumb` is `<nav aria-label="breadcrumb">` (`breadcrumb.svelte` lines 14 to 17); `List` an `<ol>` `flex flex-wrap items-center gap-1.5 sm:gap-2.5 text-sm text-muted-foreground wrap-break-word`; `Item` an `<li>` `inline-flex items-center gap-1.5`; `Link` an `<a>` `hover:text-foreground transition-colors` with a `child` snippet for a framework link; `Page` a `<span role="link" aria-disabled="true" aria-current="page">` in `text-foreground font-normal`; `Separator` an `<li role="presentation" aria-hidden="true">` holding a caret at `[&>svg]:size-3.5`, or an app's children (a slash); `Ellipsis` a `<span role="presentation" aria-hidden="true">` of `size-5` holding a 16 px dots icon and an `sr-only` "More".

EXECUTED, the ARIA snapshot: `navigation "breadcrumb"` → `list` → `listitem` with `link "Home"`, an empty `listitem` (the ellipsis), `listitem` with `link "Docs"`, `listitem` with `link "Overlays" [disabled]`. The separators are gone from the tree, as intended. The ellipsis says nothing: its `sr-only` "More" sits inside an `aria-hidden` span. The current page announces as a **disabled link**. The separator caret measured 14 × 14 px; the ellipsis span 20 × 20 px; the list gap 10 px; the type 14 px.

The lint (EXECUTED): **6 findings in 4 of 8 files**: `breadcrumb-ellipsis.svelte` 18 `size-5`; `breadcrumb-item.svelte` 16 `gap-1.5`; `breadcrumb-list.svelte` 16 `gap-1.5`, `sm:gap-2.5`; `breadcrumb-separator.svelte` 19 `[&>svg]:size-3.5`, 31 `cn-rtl-flip`.

### 3.2 What the APG asks (READ, `https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/`)

"A breadcrumb trail consists of a list of links to the parent pages of the current page in hierarchical order." Keyboard: "Not applicable." Roles: "Breadcrumb trail is contained within a navigation landmark region"; "The landmark region is labelled via aria-label or aria-labelledby"; "The link to the current page has aria-current set to `page`. If the element representing the current page is not a link, aria-current is optional." The pattern's separators are drawn by CSS. Stock meets all three facts.

### 3.3 What our checklist changes (INFERRED)

- `gap-1.5` → `gap-2` (8 px); `sm:gap-2.5` → `gap-2` at every width, or `sm:gap-3` (R4).
- `size-5` → `size-6` (24 px) if the ellipsis becomes a target (R21), else it is decoration and may be `size-4`.
- `[&>svg]:size-3.5` → `size-4` (R5; `002` decision 10: icons are `size-4`).
- `cn-rtl-flip` → the phosphor `CaretRight` with `rtl:rotate-180` or `rtl:-scale-x-100` written out (R16).
- `BreadcrumbPage`: drop `role="link" aria-disabled="true"`. A `span` with `aria-current="page"` is what the APG allows for a non-link; "link, disabled" is a false promise. Keep `text-foreground`.
- `BreadcrumbEllipsis`: either a real `button` with a name ("Show hidden pages", `size-6` or larger) that opens a `dropdown-menu` of the hidden pages, as the docs compose it, or a decorative "…" with the hidden pages reachable elsewhere. The stock `sr-only` "More" inside `aria-hidden` is dead markup either way.
- `hover:text-foreground transition-colors`: fine (the default `transition` reads `--default-transition-duration`, `001` decision 14). Whether links underline is the link style's call, not this item's.
- The `nav` label "breadcrumb" is sentence-case prose a screen reader says; "Breadcrumb" with a capital reads the same. An app with two breadcrumbs labels each.

### 3.4 Who needs it (EXECUTED, INFERRED)

- EXECUTED: 16 of 16 stock `sidebar-*` blocks import `Breadcrumb` (`grep -rl Breadcrumb docs/src/lib/registry/blocks | wc -l`), in their page headers beside the sidebar trigger.
- INFERRED: a product site whose pages are a home page, an admin page and sign-in has no hierarchy, so no current consumer asks for a breadcrumb.
- INFERRED: a breadcrumb belongs to the sidebar shell's page header, which is `005`'s `sidebar` and `006`'s app shell. If `005` serves `sidebar`, `breadcrumb` is its companion and costs 8 small files with 6 findings and no dependency. `005` decision 9 serves it beside the sidebar.

## 4. The toast question

### 4.1 `svelte-sonner` 1.2.x, and the stock `sonner` wrapper

**The wrapper** (READ, `stock/sonner/sonner.svelte`, 70 lines): imports `mode` from `mode-watcher` and `Toaster` from `svelte-sonner`; renders `<Sonner theme={mode.current} class="toaster group" style="--normal-bg: var(--color-popover); --normal-text: var(--color-popover-foreground); --normal-border: var(--color-border);" toastOptions={{ classes: { toast: "cn-toast" } }}>` with five icon snippets (lines 9 to 70). `cn-toast` is `rounded-2xl` (`style-maia.css` line 1246). The docs say "By default, Sonner will use the user's system preferences to determine whether to show the light or dark theme. To get around this, you can either pass in a custom `theme` prop to the component, or simply use mode-watcher", and "If you wish to opt out of Dark Mode support, you can uninstall `mode-watcher` and remove the `theme` prop" (`docs/content/components/sonner.md` lines 36 to 40). The lint (EXECUTED): 2 findings, `style=` (line 12) and `cn-toast` (line 15).

**The package** (EXECUTED, `bun pm view`): `svelte-sonner` 1.2.2, published 2026-10-27 03:25 UTC (1.2.0 on 2026-08-14; 1.0.0 in 2025), MIT, `dependencies` `runed ^0.28.0`, `peerDependencies` `svelte ^5.0.0`. On disk 800 KB, `dist/` 204 KB. It installs its own `runed` 0.28.0 under `node_modules/svelte-sonner/node_modules/` beside bits-ui's 0.35.1 (EXECUTED in the scratch app).

**Its DOM** (READ `svelte-sonner/Toaster.svelte`, `Toast.svelte`; EXECUTED):

| Part | READ | EXECUTED |
|---|---|---|
| Container | `<section aria-label="{containerAriaLabel} {hotkeyLabel}" tabindex="-1" aria-live="polite" aria-relevant="additions text" aria-atomic="false">` (`Toaster.svelte` 388 to 394); `containerAriaLabel` default `'Notifications'` (136) | before any toast: the `section` was in the DOM with 0 children and those five attributes. The snapshot read `region "Notifications alt+T"` |
| List | one `<ol tabindex="-1" data-sonner-toaster …>` per position (406 to 432) with twelve `style:--*` variables (`--width`, `--gap`, `--offset-*`) plus an app's `style` | `style` 382 characters long, starting with the wrapper's `--normal-bg` |
| Toast | `<li tabindex="0" aria-live={toast.important ? 'assertive' : 'polite'} aria-atomic="true" data-sonner-toast …>` with `style:--index`, `--toasts-before`, `--z-index`, `--offset`, `--initial-height` (`Toast.svelte` 521 to 558) | `tabindex="0"`, `aria-live="polite"`; the important toast `aria-live="assertive"`; `style="--index: 0; … --initial-height: 73.69px"`; 2 `style` attributes in the region in all; the toast's own `getAnimations()` returned 2 |
| Close button | `[data-close-button]` `aria-label` "Close toast" (138, 566); CSS `position: absolute; height: 20px; width: 20px` (766 to 772) | with `closeButton` on: 20 × 20 px, `opacity: 1` at rest and on hover, a tab stop after the toast |
| Size and type | `TOAST_WIDTH = 356` (15), `GAP = 14` (18), `VISIBLE_TOASTS_AMOUNT = 3` (3), `VIEWPORT_OFFSET = '24px'` (6), `font-size: 13px` (639); `z-index: 999999999` on the list (582) | `width: 356px`, `font-size: 13px`, `padding: 16px`, `border-radius: 8px` (the scratch radius), `box-shadow: rgba(0,0,0,0.1) 0 4px 12px`, `z-index: 999999999` |
| Timing | `TOAST_LIFETIME = 4000` (12); the timer pauses while `interacting` (hover or focus) or, with `pauseWhenPageIsHidden`, while hidden (`Toast.svelte` 248 to 278); `duration: Number.POSITIVE_INFINITY` persists (README) | a toast left after **4,320 ms** with the pointer away; with the list focused (Alt+T) or a toast focused, none left within 6.5 s |
| Hotkey | `hotkey = ['altKey', 'KeyT']` (116); on the chord, `listRef.focus()` and `expanded = true` (244 to 253) | Alt+T focused the `ol` |
| Tab order | every `li` is `tabindex="0"` | Tab from the last page button reached the toast, then its close button, then `body`, then the page's first link: a toast is a tab stop at the end of the page |
| Motion | keyframes `sonner-fade-in` and `sonner-fade-out` (scale 0.8 ↔ 1), `sonner-spin` (1247 to 1276); `@media (prefers-reduced-motion) { [data-sonner-toast], [data-sonner-toast] > *, .sonner-loading-bar { transition: none !important; animation: none !important } }` (1278 to 1284); transitions `transform, opacity, height` 400 ms and `box-shadow` 200 ms (EXECUTED) | under `reducedMotion: "reduce"` the toast had 0 animations and `transition: none`; otherwise 400 ms transitions, over the design book's 200 ms budget |
| Theme | `theme` default `'light'` (121); `'system'` reads `matchMedia('(prefers-color-scheme: dark)')` and tracks it (97 to 105, 269 to 290); dark rules select `[data-sonner-theme='dark']` and read the same `--normal-*` variables | `data-sonner-theme="light"` on the list |
| Styling | the component's own `<style>` block, 89 rules mentioning `sonner` in one stylesheet (EXECUTED); `unstyled` (global or per toast) drops the `[data-styled='true']` rules; `toastOptions.classes` names `toast`, `title`, `description`, `actionButton`, `cancelButton`, `closeButton` and the four types (README) | `data-styled="true"`; the stylesheet is in the page whether used or not |

INFERRED on styling by classes only: the `--normal-*` variables can be set by a rule in `pluto-theme` (`[data-sonner-toaster] { --normal-bg: var(--popover); … }`) instead of the wrapper's `style` attribute, which removes the lint finding; `unstyled` plus our classes can replace the 13 px type, the preset shadow and the 20 px close button. The two positioning `style` attributes stay in the DOM (the lint reads our files, not a dependency's output: the data memo §1.7's layerchart precedent). The 356 px width and the 14 px gap are constants written into `--width` and `--gap` inline; a class can override `width` but not the gap arithmetic. The 400 ms transitions are the library's; overriding them to `--motion-micro` is a CSS rule on `[data-sonner-toast]`.

**`mode-watcher` is not needed for colour** (INFERRED from the table): the wrapper's colours are token variables, which `.dark` flips; `theme` only chooses which of svelte-sonner's own rule sets applies (shadow and `richColors` tints), and `theme="system"` follows the OS without any package. What `theme="system"` cannot follow is our own toggle, which flips the `.dark` class and not the OS; a wrapper that reads `document.documentElement.classList` would.

### 4.2 The case against toasts, and the case for them (READ)

**Against.**

- Primer, saving pattern (`https://primer.style/product/ui-patterns/saving/`): "If your design is being implemented in github.com, avoid using a toast for now." "The toast components used on github.com have accessibility issues that need to be fixed." Feedback is needed "If the change is not obvious within the user's viewport"; without a reload "you can use the InlineMessage component", with one "a Banner component". The patterns memo §7.1 quoted this page as "no toasts because of known accessibility issues"; the live wording today is the softer "avoid … for now". Primer's toast component page could not be read: `https://primer.style/components/toast` and `/product/components/toast/` both answered with the Primer home page (EXECUTED, fetched). Red Hat's design system relays it second-hand: "GitHub's Primer design system documentation states that toasts pose significant accessibility concerns" and they are "not recommended for use" (`https://ux.redhat.com/patterns/alert/accessibility/`).
- Adrian Roselli, "Defining 'Toast' Messages" (2020-01-14, updated 2026-08-21, `https://adrianroselli.com/2020/01/defining-toast-messages.html`): on SC 2.2.1, "If you follow the pattern where they go away after a few seconds, then you are in violation"; "Generally live regions must exist on the page at render"; a `status` region "should not receive focus"; messages "at the end of the DOM will not be easy for the average keyboard user to get to"; "A user may end up dismissing the notification by accident before seeing it"; the fix is to "Add messages to a region at the top of the screen so that all users can see and dismiss each at will", "ensuring the messages never go away until a user dismisses them".
- Scott O'Hara, "A toast to an accessible toast" (2019-07-08, updated 2025-05-01, `https://www.scottohara.me/blog/2019/07/08/a-toast-to-a11y-toasts.html`): a toast "should deliver a concise message in the form of a consistently positioned popup"; "A toast component should be considered a type of status message, and thus should be injected into a role="status""; "Genearlly [sic], a toast component should not contain interactive controls"; an undo inside a toast "would need to return [focus] to a logical location" and the action must exist elsewhere too.
- WCAG 2.2.1 Timing Adjustable (A) (`https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html`): for each time limit, the user can turn it off, adjust it "over a wide range that is at least ten times the length of the default setting", or is "warned before time expires and given at least 20 seconds to extend the time limit with a simple action". A 4-second toast with no control is a time limit.
- WCAG 4.1.3 Status Messages (AA) (`https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html`): "status messages can be programmatically determined through role or properties such that they can be presented to the user by assistive technologies without receiving focus"; ARIA22 (`role=status`) for success and results, ARIA19 (`role=alert`) for errors, ARIA23 (`role=log`) for progress.
- WAI-ARIA 1.2, `status` (`https://www.w3.org/TR/wai-aria-1.2/#status`): "A type of live region whose content is advisory information for the user but is not important enough to justify an alert"; "Elements with the role status have an implicit aria-live value of polite and an implicit aria-atomic value of true"; "Authors SHOULD ensure an element with role status does not receive focus as a result of change in status." MDN's `status` and `alert` pages agree, and add for `alert`: "equivalent to setting `aria-live="assertive"` and `aria-atomic="true"`", "no user interaction should be required", and "Dynamic changes that are less urgent should use … `status`".

**For.**

- Primer's own rule says feedback is needed when "the change is not obvious within the user's viewport". An action whose result lands off-screen (a background job, a save on a long page) needs a message somewhere fixed.
- Carbon (`https://carbondesignsystem.com/components/notification/usage/`): toasts are "non-modal, time-based window elements used to display short messages", they "persist by default" and may "dismiss automatically after five seconds", "should always be easily dismissed", and an actionable toast should "remain on screen until the user dismisses it" with "alternative routes to navigate to the link destination". Red Hat: timed toasts clear in about eight seconds, "Prefer `persistent: true` when the message matters", "Focus does not move into the toast when it opens", toasts "are always dismissible", exposed "as polite status messages". Shopify uses a toast for a saved form (patterns memo §7.1).
- A global, imperative API (`toast("Saved")` from any module) needs no component placed near the action, stacks several messages, and ties a loading state to its outcome (`toast.promise`).

INFERRED, the shape both sides agree on: a fixed region that exists at render, `role="status"` (polite) for outcomes and `role="alert"` only for errors, no focus moved into it, every message dismissible, none timed out without a control, no interactive content beyond a close button, keyboard reach not at the end of the DOM. svelte-sonner meets some of this (the region at render, polite by default, pause on hover and focus, reduced motion) and misses the rest (a 4 s timer by default, every toast a tab stop at the end of the page, a 20 px close button, nested live regions: the section is `aria-live="polite"` with `aria-relevant="additions text"` and each toast is `aria-live` again, so an announcement may be made twice).

### 4.3 What our registry already has (READ)

- **`status`** (`003`; `src/lib/registry/ui/status/status.svelte`): a `div role="status" aria-live="polite" aria-atomic="true"`, `sr-only` unless `visible`, rendered empty from the first render, with a `text` prop; its comment says a region "announces only if it was there before its text changed". Sign in, sign up and the settings form set it (`decisions.md`, "The `status` live region is a `003` item").
- **`alert`** (`002` decision 19): variants `default`, `destructive` (`role="alert"`), `success` and `caution` (`role="status"`), `default` none; an explicit `role={null}` survives. Its title names the state in words.
- **The settings block** already does the feedback without a toast: "Saved" as an inline `success` message in a polite status region, errors through `error-summary` with focus moved (`003` decision, `specifications/003-the-first-blocks.md` line 536).

### 4.4 What `005` should do (INFERRED)

**Option A, serve `sonner`.** Pin `svelte-sonner` 1.2.2; drop `mode-watcher` from the item (`theme="system"`, or a class reader); set the `--normal-*` variables from `pluto-theme`, not `style`; `unstyled` with our classes for `text-sm`, `shadow-elevation`, `rounded`, a 32 px close button; `duration` defaulting to `Infinity` or a long value with the close button on, so SC 2.2.1 holds; a rule capping its transitions at `--motion-micro`. Costs: a dependency with its own `runed` copy; the 356 px width and 14 px gap as inline constants; every toast a tab stop at the end of the page; nested live regions; 89 rules of CSS an app cannot drop; a `style` attribute pattern the lint cannot see. An app gains a global queue, `toast.promise`, swipe-to-dismiss and the hotkey.

**Option B, decline `sonner`** as `004` declined `scroll-area`, and document the pattern: a `Status` mounted with the page (present before any change) carries the announcement; the visible outcome is an inline `Alert` (`success` or `default` with `role={null}` so it is not announced twice) placed where the action was taken, or `error-summary` with focus for a failure. This is what `003`'s blocks do today. An app loses: a message for an outcome that lands off-screen (it would put a `Status visible` near the top of its shell instead), stacking of several outcomes, and the imperative API; it must place feedback itself. A fixed notice area, if one were built, is cheaper as a small item of our own on `status` (a fixed, polite, dismissible list with no timer and 32 px close buttons, as Roselli's "messages holder") than as a restyled svelte-sonner, and keeps every rule above.

**Recommendation: B.** The settings form, our one consumer so far, already declined the toast; no current consumer asks for one (INFERRED); and every accessibility source puts the burden on the implementer to remove the timer, the focus trap and the end-of-DOM placement, which is most of what svelte-sonner is. `005` decision 14 takes B, and its decision 21 records that this release serves no notices region of its own.

### 4.5 `mode-watcher` (READ `mode-watcher/`, EXECUTED)

**The package.** 1.1.0, published 2025-06-28 (1.0.0 on 2025-04-16), MIT, `dependencies` `runed ^0.25.0` and `svelte-toolbelt ^0.7.1`, `peerDependencies` `svelte ^5.27.0` (EXECUTED, `bun pm view`). Sixteen months without a release today. On disk 1.3 MB, `dist/` 112 KB; it installs its own `runed` 0.25.0 and `svelte-toolbelt` 0.7.1 under `node_modules/mode-watcher/node_modules/`, beside bits-ui's 0.35.1 and 0.10.6 (EXECUTED in the scratch app: three copies of `runed` in all, with svelte-sonner's).

**What it does.**

- `<ModeWatcher />`, placed once in the root layout, takes `defaultMode` (`"system"`), `darkClassNames` (`["dark"]`), `lightClassNames` (`[]`), `modeStorageKey` (`"mode-watcher-mode"`), `themeStorageKey` (`"mode-watcher-theme"`), `disableTransitions` (`true`), `themeColors`, `nonce`, `disableHeadScriptInjection`, `track` (`mode-watcher/components/mode-watcher.svelte` lines 20 to 33).
- **The head script.** `ModeWatcherFull` renders, inside `<svelte:head>`, `{@html "<script>(" + setInitialMode.toString() + ")(" + JSON.stringify(config) + ");</script>"}` (`components/mode-watcher-full.svelte` 16 to 29). So the script is part of the server-rendered head, which prerendering keeps; a CSP needs the `nonce` prop.
- **`setInitialMode`** (`mode.js` 24 to 54): reads the mode key from `localStorage` (default `"system"`) and the theme key; resolves `light` as `mode === "light"` or `system` with `matchMedia("(prefers-color-scheme: light)")`; adds or removes the class names on `<html>`; sets `html.style.colorScheme`; updates a `meta[name="theme-color"]` if `themeColors` is given; sets `data-theme` for a custom theme; and **writes the mode key back on every load**, so a visitor who never chose gets `"system"` stored.
- **After mount** (`mode-watcher.svelte` 79 to 85): tracks the system preference through `matchMedia` and applies the stored mode. `states.svelte.js` 36 to 56 flips the classes and `colorScheme` inside `withoutTransition`, which injects a temporary `* { transition: none !important }` style (`without-transition.js`).
- **The API** (`index.js`): `mode` (the resolved `"light" | "dark"`), `userPrefersMode` (`"light" | "dark" | "system"`), `systemPrefersMode`, `setMode`, `toggleMode`, `resetMode`, `theme`, `setTheme`, the two keys, and `createInitialModeExpression` for writing the script by hand.

**What this repository already does** (READ): `src/app.html` lines 6 to 18, a 12-line inline script that reads `localStorage.getItem("pluto-preview-theme")`, else `matchMedia("(prefers-color-scheme: dark)")`, and toggles the `dark` class; `src/lib/preview/theme-toggle.svelte`, a button "Dark theme" with `aria-pressed` once hydrated, that flips the class and stores `"dark"` or `"light"`. `color-scheme` is set by `pluto-theme`'s CSS on `:root` and `.dark` (`src/app.css` lines 82 and 134), not by the script. `001` recorded: "the preview app switches themes with a few lines of its own (decision 24)" (line 139; the line now adds that `005` ships a `theme` item) and "Why our own few lines, not `mode-watcher`: a preview app needs only this, and the tests drive the theme through `prefers-color-scheme`. " (line 754; the line now says the same of `005`). On this memo's date, `decisions.md` left `mode-watcher` to `005`.

**The two options, with what each costs** (INFERRED).

| | Adopt `mode-watcher`, pinned 1.1.0 | A `theme` item of our own |
|---|---|---|
| What an app installs | the package (plus its own `runed` and `svelte-toolbelt` copies), and a wrapper item that places `<ModeWatcher />` and exports a toggle | registry source: a `ThemeScript` component rendering the head script through `<svelte:head>` as mode-watcher does, or the script documented for `app.html`; a `theme.svelte.ts` state (`current`, `set`, `toggle`); the preview's toggle button restyled |
| Behaviour | tri-state `light | dark | system`, system tracking, `color-scheme` inline, `theme-color` meta, custom `data-theme`, transition suppression on switch | two-state today; `system` would be ours to add (one `matchMedia` listener); `color-scheme` already comes from the CSS; no `theme-color` meta unless written |
| Storage | `mode-watcher-mode` written on every load | `pluto-preview-theme` (to be renamed for apps) written only on a choice |
| Maintenance | a dependency last released 2025-06-28, with Svelte 5.27 as its floor; its head script is injected HTML, which `svelte-check` does not see | about 60 lines to own, test and document; the preview app already runs the two files |
| Fit with the rules | constitution §4.6 allows a named, pinned dependency; `001` decision 4's table would gain a row | "source, not a package" (constitution §4.1); tokens untouched either way |
| `sonner` | `mode.current` feeds `theme`; not needed if `sonner` is declined (§4.4) | the state feeds `theme` the same way |

Facts only; neither is recommended here. The owner left the mechanism to the design lead (`decisions.md`, "The theme mechanism, the doc-ID scheme and the footer's sentence"), and `005` decision 6 serves a `theme` item of our own: source, not a package (constitution §4.1).

## 5. Positioning and layering

### 5.1 Which layer each item uses (READ)

| Item | bits-ui base | Layer | Portal | Focus | Scroll lock |
|---|---|---|---|---|---|
| `popover` (`004`) | `Popover` | `PopperLayer` (Floating UI) | `body` by default (`bits-ui/bits/utilities/portal/portal.svelte` 12 to 23) | trap and loop | `preventScroll` default `true` on the popper layer (`popper-layer-inner.svelte` 57) |
| `dropdown-menu` | `Menu` | `PopperLayer` | `body` | trap and loop, roving items | the same |
| `tooltip` (`002`) | `Tooltip` | `PopperLayer` | `body` | none | none |
| `sheet`, `dialog`, `alert-dialog` (`002`) | `Dialog` | none: a `fixed` element | `body` | `FocusScope` trap and loop | `ScrollLock`: `body` `overflow: hidden; pointer-events: none` (EXECUTED) |

Floating UI's wrapper (`use-floating-layer.svelte.js` 101 to 120) is `position: fixed; left: 0; top: 0; transform: translate(x, y); min-width: max-content`, with `transform: translate(0, -200%)` until the first measurement ("keep off page when measuring"), and `zIndex: this.contentZIndex`, which is **read from the content's computed `z-index` one animation frame after mount** (185 to 199). So `z-50` on our content becomes `z-index: 50` on the wrapper a frame later; before that frame the wrapper is `auto` (EXECUTED: read at 0 ms the nested wrapper was `auto`, at 250 ms `50`). `size` writes `--bits-floating-available-height` and `-width`, which stock's `max-h-(--bits-dropdown-menu-content-available-height)` reads; `flip` and `shift` keep the panel on screen.

### 5.2 `z-50` everywhere (READ, EXECUTED)

Stock puts `z-50` on the menu content, the sub-content, the sheet content and overlay, the dialog content and overlay; ours do the same on `popover` and `alert-dialog`. Within one `z-index`, paint order is DOM order. Every portal appends to `<body>`, so a later overlay paints above an earlier one (EXECUTED: `body`'s children after opening a menu inside a sheet were the scratch app's `div`, the empty `section` of the toaster, the sheet's `div`, then the menu's wrapper `div`).

### 5.3 A menu inside a sheet (EXECUTED, `probe3.ts`)

- The nested menu's content sat in a wrapper that was a child of `<body>` after the sheet's `div`; wrapper, menu and sheet all `z-index: 50`; `elementFromPoint` at the menu's centre returned the menu (after the wrapper's z-index frame; at 0 ms it returned the sheet).
- ArrowDown moved focus to "Nested one" inside the menu while the sheet's trap was active: bits-ui's focus-scope manager stacks scopes, and the inner one is the active scope.
- Clicking a nested item closed the menu, kept the sheet open and returned focus to the nested trigger; Escape did the same; a click on the sheet's title closed only the menu (focus went to the sheet's content node); a click on the overlay closed the sheet and returned focus to its trigger.
- Pointer events: `body` is `pointer-events: none` while the sheet is open; the sheet's content and the menu's wrapper carry `pointer-events: auto` inline, so both receive clicks.

### 5.4 A toast under a sheet (EXECUTED)

With a toast showing and a right-side sheet opened: the toast stayed in the DOM, the toaster's list kept `z-index: 999999999`, but its `section` computed `pointer-events: none` (inherited from `body`'s scroll lock) and `elementFromPoint` at the toast's centre returned the sheet's content, which covers the bottom-right corner at 384 px wide. INFERRED: a toast cannot be dismissed by pointer while any modal is open, and a right sheet hides it; one more reason the feedback for a modal's own action belongs inside the modal.

## 6. What this memo does not settle

- **Speech** over the menu, the sheet or the toaster. The DOM contract is proven; how a screen reader treats `aria-modal` without `inert`, how it reads "⇧⌘P", and whether svelte-sonner's nested live regions announce twice were not heard. No screen reader has been run; the tests prove the DOM contract (`decisions.md`, "After the public-readiness review"; `005` decision 21).
- **Firefox and Safari** were not run: Floating UI's placement, the `translate` keyframe, `contain: layout style`, and the sheet's `w-3/4` at 360 px are Chromium readings. This release checks Chromium only (the same entry).
- **The live registry against the clone.** The five items were installed from `https://shadcn-svelte.com/registry` on 2026-11-01 into the scratch app, and the menu content's class string equals the clone's at `6149e14` with the two markers removed. A whole-file comparison means little, since the CLI rewrites imports and icons, so `002` decision 5's provenance step (the JSON's SHA-256 on install day) is the check; `005` decision 3 records it for the stock-derived items.
- **The sidebar, `is-mobile` and the chat primitives** are `005`'s too and are not in this memo. The sidebar memo of the same day (`2026-11-01-the-sidebar-is-mobile-and-the-shells-navigation.md`) covers the trigger and the sheet.
- **A slide's keyframes under Tailwind 4** were not tried. `005` decision 8 takes the fade, so no slide keyframes exist.
- **Whether `svelte-sonner`'s `unstyled` mode removes the 400 ms transitions** or only the colours was not read in full (lines 631 to 660). `005` declines `sonner` (decision 14).
- **A notices region of our own**, for an outcome that lands off-screen: this release serves none (`005` decision 21). An outcome is announced by a `Status` and shown by an inline `Alert` where the action was taken (`005` decision 14).

**In one line:** the five stock items fail the lint 108 times and all restyle onto `popover`'s and `alert-dialog`'s chrome; bits-ui's Menu and Dialog meet the APG patterns as shipped, with the shortcut, the menu label and the current-page breadcrumb as the three accessibility fixes ours must make; a sheet is a dialog with a side, so `dialog` is cheap to serve beside it; the exit fade runs through the `data-closed` variant `shadcn-svelte/tailwind.css` defines and a slide needs eight keyframes of our own; `svelte-sonner` is a competent toaster whose defaults (a 4 s timer, a tab stop per toast, a 20 px close button) are what every accessibility source warns about, so the recommendation is to decline it for the `status` plus inline `alert` pattern `003` already uses; and `mode-watcher` is a sixteen-month-old tri-state version of the twelve-line head script this repository already runs, which `005` replaces with a `theme` item of its own.

## Sources

All web sources read on 2026-11-01. Local sources read the same day.

**W3C and standards**

- APG: [menu button](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/), [menu and menubar](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/), [breadcrumb](https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/), [modal dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [WAI-ARIA 1.2, `status`](https://www.w3.org/TR/wai-aria-1.2/#status)
- [Understanding SC 2.2.1 Timing Adjustable](https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html)
- [Understanding SC 4.1.3 Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html)
- MDN: [`status` role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/status_role), [`alert` role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/alert_role)

**Toasts**

- [Primer, saving](https://primer.style/product/ui-patterns/saving/); `https://primer.style/components/toast` and `https://primer.style/product/components/toast/` answered with the home page
- [Adrian Roselli, Defining "Toast" Messages](https://adrianroselli.com/2020/01/defining-toast-messages.html) (2020-01-14, updated 2026-08-21)
- [Scott O'Hara, A toast to an accessible toast](https://www.scottohara.me/blog/2019/07/08/a-toast-to-a11y-toasts.html) (2019-07-08, updated 2025-05-01)
- [Carbon, notification](https://carbondesignsystem.com/components/notification/usage/)
- [Red Hat Design System, alert accessibility](https://ux.redhat.com/patterns/alert/accessibility/)
- [svelte-sonner README](https://raw.githubusercontent.com/wobsoriano/svelte-sonner/main/README.md) and [site](https://svelte-sonner.vercel.app/)

**Packages** (EXECUTED, `bun pm view`, 2026-11-01): `svelte-sonner` 1.2.2, `mode-watcher` 1.1.0, `bits-ui` 2.20.2, `tw-animate-css` 1.4.0 (2025-09-24, named by no item).

**Local**

- The prior-art clone at `6149e14`: `docs/src/lib/registry/ui/{dropdown-menu,sheet,dialog,breadcrumb,sonner}/`, `docs/static/registry/styles/maia/<item>.json`, `docs/content/components/<item>.md`, `docs/src/lib/registry/styles/style-maia.css` (lines 1246, 1447 to 1452), `docs/src/lib/registry/ui/sidebar/sidebar.svelte` (lines 36 to 58), `docs/src/lib/registry/blocks/`
- `node_modules/bits-ui/dist/`: `bits/menu/menu.svelte.js`, `bits/menu/components/menu-content.svelte`, `bits/dialog/dialog.svelte.js`, `bits/dialog/components/dialog-content.svelte`, `bits/utilities/focus-scope/focus-scope.svelte.js`, `bits/utilities/floating-layer/use-floating-layer.svelte.js`, `bits/utilities/popper-layer/popper-layer-inner.svelte`, `bits/utilities/portal/portal.svelte`, `internal/presence-manager.svelte.js`, `internal/animations-complete.js`, `internal/attrs.js`, `internal/dom-typeahead.svelte.js`
- `node_modules/shadcn-svelte/dist/tailwind.css` (lines 22 to 34)
- The scratch app's `node_modules/svelte-sonner/dist/{Toaster,Toast}.svelte`, `types.d.ts`; `node_modules/mode-watcher/dist/{mode.js,index.js,states.svelte.js,storage-keys.svelte.js,components/*.svelte}`
- This repository: `src/app.html`, `src/app.css`, `src/lib/preview/theme-toggle.svelte`, `src/lib/registry/ui/{popover,alert-dialog,status,alert,button}/`, `scripts/lint-literals.ts`, `tests/smoke/fixtures/kit3/`; `context/specifications/001` (decisions 4, 8, 12, 14, 24), `002` (decisions 3, 7, 8, 9, 10, 17, 19), `003` (the settings block), `004` (decisions 11, 13, 21); `context/research/2026-10-28-the-primitives-the-blocks-and-the-home-page-need.md` §3, §5, §6; `2026-10-28-the-blocks-patterns-and-accessibility.md` §1.2, §7; `2026-10-31-the-data-items-…md` §4.1, §5; `context/decisions.md`
