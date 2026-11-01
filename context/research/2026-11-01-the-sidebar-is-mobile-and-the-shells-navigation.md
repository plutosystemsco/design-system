# The sidebar, `is-mobile` and the shell's navigation

- **Status:** complete
- **Date:** 2026-11-01
- **Owner:** Clay Gendron (research executed by an agent, Claude, sub-agent of the orchestrating session)
- **Question:** What is the stock `sidebar` made of, file by file, and what in it must change to meet our rules? What does it do, measured in a browser: the trigger, the shortcut, the cookie, the three collapse modes and their tab orders, the mobile sheet and the return of focus, the rail, the width transition under reduced motion, the tooltip on a collapsed item, the scroll container? What does the `is-mobile` hook return on the server and at hydration? What should our sidebar be, against `001` decision 8, the design book and the patterns memo, with a vertical groove drawn and seen? Which packages and items does it need?
- **What it blocks:** specification `005`, overlays and navigation (`sheet`, `sidebar`, `is-mobile`), and through it `006`, the app shell.

## How to read this memo

Every claim carries a label.

- **EXECUTED**: we ran it and saw the result, on 2026-11-01, macOS (Darwin 25.5.0, arm64), Bun 1.3.14. Browser checks ran in Playwright 1.64.1's Chromium (build 1248, the repository's `node_modules/@playwright/test`), with `@axe-core/playwright` 4.14.0 from the same `node_modules`. The repository was not touched.
- **READ**: a source says so. Each source was read on 2026-11-01. Paths in the prior-art clone are relative to `context/prior_art/shadcn-svelte/`, at commit `6149e14` (MIT). Paths starting `bits-ui/` are relative to `node_modules/bits-ui/dist/` of the scratch app (bits-ui 2.20.2, MIT). Paths starting `svelte/` are relative to `node_modules/svelte/src/` (Svelte 5.57.3, MIT).
- **INFERRED**: our reasoning.

Scratch work lives in the session scratchpad, folder `research-005-sidebar/`: `live/` (the live registry JSON of `sidebar`, `sheet` and `is-mobile`), `stock/` (the 26 built files written out of `sidebar.json`), `extract-lint.ts`, `lint-classes.ts`, `lint-sheet.ts` (the lint runs), `app/` (a copy of `tests/smoke/fixtures/kit3` with the stock `sidebar` and `collapsible` from shadcn-svelte's registry and `pluto-theme` and `utils` from ours at `v0.4.0`), `app/src/lib/shell/app-shell.svelte` (the composition), `app/src/routes/{offcanvas,icon,none,groove}/`, `serve.ts`, `probe.ts`, `debug*.ts`, `summarise.ts`, `results/probe.json`, `results/summary.txt`, `shots/` (38 screenshots). Nothing was written to this repository except this memo.

Terms of art.

- **Stock item.** An item from shadcn-svelte's own registry as `add` serves it, built in the maia style with its `cn-*` marker classes inlined (primitives memo §3.1). This memo lints the live built files.
- **The lint.** `scripts/lint-literals.ts`, with `001` decision 25's rules, `002` decision 21's L1 to L14, the change review's four, and `004` decision 15's L15 and L16.
- **The ladder.** `001` decision 10's sizes: 4, 8, 12, 16, 24, 32, 48, 64 and 96 px (Tailwind steps 1, 2, 3, 4, 6, 8, 12, 16, 24).
- **Collapse mode.** The stock `collapsible` prop: `offcanvas` slides the sidebar out of view, `icon` shrinks it to a 48 px column of icons, `none` never collapses.
- **Sheet.** A panel that slides in from an edge and behaves as a modal dialog (patterns memo, Terms). The stock sidebar becomes one below 768 px.
- **Rail.** The stock `SidebarRail`: a 16 px wide button along the sidebar's edge that toggles it on click.
- **Inset.** The stock `SidebarInset`: the `<main>` beside the sidebar.
- **Groove.** v2's one line primitive: a hairline of ink at 10% with a 1 px white line beneath it on paper (`001` decision 13, the `groove` utility).
- **Sequential focus navigation starting point.** The place in the document from which the next Tab is computed. Chromium keeps it at the last focused element after `blur()`.
- **Hydration.** The moment the browser's JavaScript takes over prerendered HTML and runs the components.

## In short

- **The 26 live stock files fail the lint 50 times in 15 of them** (§1). By rule: ring 12, size off the ladder 7, outline 5, offset off the ladder 5, arbitrary value 4, `style` attribute 3, literal duration 3, shadow 3, spacing off the ladder 3, CSS length in a `.ts` file 3, translucent tint 1, `cn-` marker 1. The primitives memo's 13 was `001`'s lint alone; 37 more come from `002`'s and `004`'s rules. 11 files pass: the plain containers, `index.ts` and `context.svelte.ts`.
- **No `style` attribute is needed.** The three widths the provider writes as `style="--sidebar-width: 16rem; --sidebar-width-icon: 3rem"` are `w-3xs` (16 rem, measured 256 px), `w-2xs` (18 rem, 288 px) and `w-12` (3 rem, 48 px), all of which pass L7 and need no new token; `w-(--sidebar-width)` from a `:root` variable passes too (EXECUTED, §1.6).
- **The trigger is a bare button** named "Toggle Sidebar" by hidden text, 32 × 32 px, with no `aria-expanded` and no `aria-controls`, and focus stays on it after a click. Ctrl+B and Cmd+B toggle; the shortcut also fires while typing in a text field, and on mobile it opens the sheet. The cookie `sidebar_state` is written on every toggle and **never read**: after a reload the sidebar is expanded whatever the cookie says (EXECUTED, §2.3).
- **Off-canvas collapsed, all 33 sidebar stops stay in the tab order**, each at x = −248 px, invisible, with no scroll; a keyboard user tabs through 33 unseen links before reaching the page's first control. Collapsed to icons, 30 stops stay, each 32 × 32 px, and the sub-items leave the order (`display: none`); the content box turns `overflow: hidden`, so the 11 items clipped below cannot be reached by wheel or trackpad, only by Tab (EXECUTED, §2.4).
- **The mobile sheet is a modal dialog named "Sidebar"**, 270 px wide at 360 px (three quarters of the viewport, not the 18 rem constant), focus moved to its first link on open, trapped over 40 Tabs, and **returned to the trigger** on Escape and on an overlay click, whether the sheet was opened by mouse or by keyboard. One flaw: with focus on a menu button that carries a tooltip, the first Escape closes an invisible tooltip and the sheet stays; the second Escape closes it (EXECUTED, §2.5). The patterns memo's INFERRED doubt about the return of focus is resolved.
- **The width transition takes 210 to 219 ms** (`0.2s linear` on `left, right, width`); under `prefers-reduced-motion: reduce` our theme's catch-all cuts it to `1e-05s` and the width settles in 8 ms (EXECUTED, §2.7). Chromium's measured rail is 16 × 720 px, `tabindex="-1"`, with a 2 px `::after` line that colours only on hover. The content box is `overflow-y: auto` with `scrollbar-width: none`, no `tabindex`, no label; arrow keys scroll it only while a link inside has focus (§2.8).
- **`is-mobile` prerenders as desktop**: Svelte's server `MediaQuery` is a stub whose `current` is the constructor's fallback, which the hook does not pass, so `false`. At 360 px the prerendered desktop sidebar is `display: none` and hydration removes it; nothing visible flashes. With JavaScript off, a phone has no sidebar and no way to open one (EXECUTED, §3).
- **axe finds one violation attributable to the stock sidebar**, `region` (27 or 28 nodes outside any landmark, moderate) on desktop, because the sidebar is a `div`; none in the open sheet (§2.9).
- **A vertical groove works when the inset owns it**: `border-left` in `groove-line` plus `box-shadow: inset 1px 0 0 var(--groove-light)` drew `#dfdfde` then `#ffffff` at the seam in light and the hairline alone in dark, which is the horizontal groove's structure turned on its side. An outer shadow on the sidebar was painted over by its sibling and showed nothing. The shadow is an arbitrary value to the lint, so the form must be a `pluto-theme` utility (EXECUTED, §4.1). Stock's own edge under our theme is a solid ink line, because `border-e` names no colour and our theme sets no base border colour (§4.1).
- **`sidebar` names `bits-ui`, `@internationalized/date` and `tailwind-variants`**, all held, and seven items: `is-mobile`, `input`, `tooltip`, `skeleton`, `separator`, `button`, `sheet`. Five exist in our registry; `sheet` (22 lint findings in 3 of 11 files) and `is-mobile` (0) are `005`'s to serve first (§5).

## 1. The stock sidebar, file by file

### 1.1 What was done

EXECUTED: `curl` fetched `https://shadcn-svelte.com/registry/styles/maia/sidebar.json` (HTTP 200, 34,235 bytes). `extract-lint.ts` wrote its 26 files to `stock/` and ran `lintText` from `scripts/lint-literals.ts` on each, with the rules `loadRules` reads from this repository. The live files total 979 lines; the clone's sources total 954 (`wc -l docs/src/lib/registry/ui/sidebar/*`), the difference being maia's classes inlined where a source holds a `cn-*` marker. Line numbers in §1.3 are of the live files; the source lines they correspond to are cited from the clone, and maia's classes from `docs/src/lib/registry/styles/style-maia.css` lines 1111 to 1222.

### 1.2 The table (READ: the clone's sources; EXECUTED: the lint column)

| File | Lines | Renders | `data-slot` | Props beyond `ref`, `class`, `children` | Lint |
|---|---|---|---|---|---|
| `constants.ts` | 6 | six constants: cookie name `sidebar_state`, max age 7 days, widths `16rem`, `18rem`, `3rem`, shortcut `b` | — | — | 3 |
| `context.svelte.ts` | 79 | `SidebarState` (`open`, `openMobile`, `state`, `isMobile`, `setOpen`, `setOpenMobile`, `toggle`, `handleShortcutKeydown`), `setSidebar`, `useSidebar`; context key `Symbol.for("scn-sidebar")` (lines 23 to 79) | — | `open` getter, `setOpen` | 0 |
| `index.ts` | 75 | 23 components and `useSidebar`, each exported twice (`Content` and `SidebarContent`) | — | — | 0 |
| `sidebar-provider.svelte` | 53 | `Tooltip.Provider delayDuration={0}` around a `div` wrapper; `<svelte:window onkeydown>` for the shortcut; writes the cookie in `setOpen` (lines 26 to 38) | `sidebar-wrapper` | `open` (bindable, default `true`), `onOpenChange`, `style` | 1 |
| `sidebar.svelte` | 103 | three branches: `none` is a plain `div`; mobile is `Sheet.Root` with `Sheet.Content` carrying an `sr-only` header "Sidebar" / "Displays the mobile sidebar."; desktop is a `div.group.peer` holding a `sidebar-gap` spacer and a `fixed` `sidebar-container` with a `sidebar-inner` (lines 25 to 103) | `sidebar` (desktop root and the sheet content), `sidebar-gap`, `sidebar-container`, `sidebar-inner` | `side` (`left` \| `right`), `variant` (`sidebar` \| `floating` \| `inset`), `collapsible` (`offcanvas` \| `icon` \| `none`) | 7 |
| `sidebar-trigger.svelte` | 43 | `Button variant="ghost" size="icon-sm"` with an icon and `<span class="sr-only">Toggle Sidebar</span>`; `onclick` calls `sidebar.toggle()` (lines 20 to 43) | `sidebar-trigger` | `Button` props, `onclick` | 1 |
| `sidebar-rail.svelte` | 36 | a `button` with `aria-label` and `title` "Toggle Sidebar", `tabindex={-1}`, `onclick={sidebar.toggle}`, `hidden sm:flex`, `w-4`, an `after:` 2 px line (lines 16 to 36) | `sidebar-rail` | button attributes | 1 |
| `sidebar-inset.svelte` | 20 | a `<main>` (line 13) | `sidebar-inset` | — | 1 |
| `sidebar-content.svelte` | 24 | a `div`, `overflow-auto`, `overflow-hidden` when collapsed to icons; maia adds `no-scrollbar` (line 18; maia 1136) | `sidebar-content` | — | 0 |
| `sidebar-header.svelte` | 21 | a `div`, `flex flex-col`; maia `gap-2 p-2` | `sidebar-header` | — | 0 |
| `sidebar-footer.svelte` | 21 | the same | `sidebar-footer` | — | 0 |
| `sidebar-separator.svelte` | 19 | the registry's `Separator` with `w-auto`; maia `bg-sidebar-border mx-2` | `sidebar-separator` | `Separator` props | 0 |
| `sidebar-input.svelte` | 21 | the registry's `Input`; maia `bg-background h-8 w-full shadow-none` | `sidebar-input` | `Input` props, `value` bindable | 1 |
| `sidebar-group.svelte` | 21 | a `div`; maia `p-2` | `sidebar-group` | — | 0 |
| `sidebar-group-label.svelte` | 33 | a `div` or the `child` snippet; `h-8 px-3 text-xs font-medium`, 70% foreground, `-mt-8 opacity-0` when collapsed to icons (maia 1160) | `sidebar-group-label` | `child` | 5 |
| `sidebar-group-action.svelte` | 33 | a `button`, absolute at `top-3.5 right-3`, `w-5`, hidden when collapsed to icons, an `after:-inset-2` hit area below `md` (line 18; maia 1164) | `sidebar-group-action` | `child` | 5 |
| `sidebar-group-content.svelte` | 21 | a `div`, `w-full text-sm` | `sidebar-group-content` | — | 0 |
| `sidebar-menu.svelte` | 21 | a `ul`; maia `gap-1` | `sidebar-menu` | — | 0 |
| `sidebar-menu-item.svelte` | 21 | an `li`, `group/menu-item relative` | `sidebar-menu-item` | — | 0 |
| `sidebar-menu-button.svelte` | 100 | `tailwind-variants` `tv` with `variant` `default` \| `outline` and `size` `default` \| `sm` \| `lg` (lines 4 to 21); a `button` or the `child` snippet; when `tooltipContent` is set, wrapped in `Tooltip.Root` / `Trigger` / `Content side="right"` that is `hidden` unless collapsed and not mobile (lines 78 to 100) | `sidebar-menu-button` (overwritten by the tooltip trigger, §2.6) | `variant`, `size`, `isActive`, `tooltipContent` (snippet or string), `tooltipContentProps`, `child` | 7 |
| `sidebar-menu-action.svelte` | 37 | a `button`, absolute at the row's right, `w-5`, hidden when collapsed to icons; `showOnHover` makes it `md:opacity-0` until hover, focus-within or `aria-expanded` (lines 18 to 28) | `sidebar-menu-action` | `showOnHover`, `child` | 6 |
| `sidebar-menu-badge.svelte` | 24 | a `div`, `pointer-events-none absolute right-1 h-5 min-w-5 text-xs font-medium tabular-nums` | `sidebar-menu-badge` | — | 4 |
| `sidebar-menu-skeleton.svelte` | 36 | two `Skeleton`s, the text one `max-w-(--skeleton-width)` with a `style` holding a random width between 50% and 90% (lines 16 to 34) | `sidebar-menu-skeleton` | `showIcon` | 1 |
| `sidebar-menu-sub.svelte` | 26 | a `ul`, `border-l` in `sidebar-border`, `mx-3.5 px-2.5 py-0.5 translate-x-px`, hidden when collapsed to icons (maia 1216) | `sidebar-menu-sub` | — | 3 |
| `sidebar-menu-sub-item.svelte` | 21 | an `li` | `sidebar-menu-sub-item` | — | 0 |
| `sidebar-menu-sub-button.svelte` | 39 | an `a` or the `child` snippet, `h-7 px-2`, `-translate-x-px` (maia 1220) | `sidebar-menu-sub-button` | `size` (`sm` \| `md`), `isActive`, `child` | 4 |

Every element also carries a `data-sidebar` attribute with the same name minus the prefix (`data-sidebar="menu-button"`), which the maia CSS and the blocks select by.

### 1.3 The findings, by file (EXECUTED: `extract-lint.ts`)

The lint's rule name, then the class, with the live file's line.

- `constants.ts` (3): CSS length in a `.ts` file, `"16rem"` (3), `"18rem"` (4), `"3rem"` (5). L16 reads them as theme values, which they are: three sizes written as literals.
- `sidebar-provider.svelte` (1): `style=` (43), the wrapper's `--sidebar-width` and `--sidebar-width-icon`.
- `sidebar.svelte` (7): `style=` (47, the sheet's `--sidebar-width: 18rem`); `duration-200` (73, the gap; 85, the container); arbitrary `w-[calc(var(--sidebar-width-icon)_+_(--spacing(4))_+_2px)]` (88, the floating and inset variants' icon width); `ring-sidebar-border`, `shadow-sm`, `ring-1` (97, the `floating` variant's panel, maia 1116).
- `sidebar-trigger.svelte` (1): `cn-rtl-flip` (40), a marker left on the icon.
- `sidebar-rail.svelte` (1): arbitrary `after:w-[2px]` (25).
- `sidebar-inset.svelte` (1): `md:peer-data-[variant=inset]:shadow-sm` (16, maia 1124).
- `sidebar-input.svelte` (1): `shadow-none` (19, maia 1128).
- `sidebar-group-label.svelte` (5): `text-sidebar-foreground/70`, `ring-sidebar-ring`, `duration-200`, `focus-visible:ring-2`, `outline-hidden` (18, maia 1160).
- `sidebar-group-action.svelte` (5): `ring-sidebar-ring`, `top-3.5`, `w-5`, `focus-visible:ring-2`, `outline-hidden` (18, maia 1164).
- `sidebar-menu-button.svelte` (7): `ring-sidebar-ring`, `focus-visible:ring-2`, `outline-hidden` (5); arbitrary `shadow-[0_0_0_1px_var(--sidebar-border)]` and `hover:shadow-[0_0_0_1px_var(--sidebar-accent)]` (9, the `outline` variant, maia 1180); `h-9` (12, the default size, maia 1184); `h-14` (14, `lg`, maia 1192). The `sm` size's `h-8` passes.
- `sidebar-menu-action.svelte` (6): `ring-sidebar-ring`, `top-1.5`, `w-5`, `peer-data-[size=lg]/menu-button:top-2.5`, `focus-visible:ring-2`, `outline-hidden` (20, maia 1196).
- `sidebar-menu-badge.svelte` (4): `h-5`, `min-w-5`, `top-1.5`, `top-2.5` (18, maia 1200).
- `sidebar-menu-skeleton.svelte` (1): `style=` (33, the random width).
- `sidebar-menu-sub.svelte` (3): `mx-3.5`, `px-2.5`, `py-0.5` (18, maia 1216).
- `sidebar-menu-sub-button.svelte` (4): `ring-sidebar-ring`, `h-7`, `focus-visible:ring-2`, `outline-hidden` (22, maia 1220).

50 findings, 15 files failing, 11 passing (`context.svelte.ts`, `index.ts`, `sidebar-content`, `-header`, `-footer`, `-separator`, `-group`, `-group-content`, `-menu`, `-menu-item`, `-menu-sub-item`).

### 1.4 The replacement for each class (INFERRED, against `002` decision 9's R1 to R22)

| Stock | Rule | Replacement |
|---|---|---|
| `outline-hidden`, `focus-visible:ring-2`, `ring-sidebar-ring` (five files) | R2 | nothing: `001`'s global 2 px solid `ring` outline. `sidebar-ring` is then unused by any item (it stays a token) |
| `text-sidebar-foreground/70` on the group label | R6 (L1) | `text-muted-foreground` (`ink-soft`, 6.79:1 on `muted`, `004` decision 5), and the label in mono lowercase, as v2 §04's captions are (R18 covers prose, not furniture) |
| `h-9` (default), `h-14` (`lg`), `h-7` (sub), `h-5`/`min-w-5` (badge), `w-5` (actions) | R5, R21 | `h-12` default and `h-8` `sm` (`002` decision 10) for the menu button; no `lg`; sub-items `h-8`; actions `size-8`; the badge `h-6 min-w-6` (24 px, a non-target, on the ladder) |
| `top-3.5`, `top-1.5`, `top-2.5` (actions and badge, absolute) | L (offset) | ladder offsets `top-2`, `top-3`, or no absolute positioning: an action as a flex sibling of the button inside the row |
| `mx-3.5 px-2.5 py-0.5` on the sub-list | R4 | `mx-4 px-2 py-0` (16 and 8 px), the sub-list's `border-l` as `border-groove-line` |
| `duration-200` (three places), `transition-[left,right,width] ease-linear` | R14 | the default `transition` (200 ms from `--default-transition-duration`) or `duration-(--motion-micro)`; `ease-linear` is allowed (no literal) |
| `shadow-[0_0_0_1px_var(--sidebar-border)]`, `hover:shadow-[…accent]` (the `outline` button variant) | R1, R10 | `border border-input` with `hover:border-foreground`, the secondary button's recipe (`002` decision 12). The hairline-as-shadow is a border drawn outside the box; a border on the ladder is the same box 1 px wider. `shadow-elevation` is not the replacement: it adds a 32 px plume and means a raised surface (`002` decision 7), which a menu row is not |
| `ring-sidebar-border ring-1 shadow-sm rounded-lg` (`floating`) and `m-2 rounded-xl shadow-sm` (`inset`) | R10 | drop both variants: a sidebar is a ground, not a panel (`001` decision 8); v2 §05 allows shadows for menus and dialogs only |
| `shadow-none`, `bg-background`, `h-8` on the search input | R5 | our `Input` as it is (`h-12`, `bg-card`, `border-input`); `002` has no `sm` input, and a sidebar search does not justify one on its own |
| `after:w-[2px]` on the rail | R1 | `after:w-(--line-width)`, or the rail goes (§4.3) |
| `w-[calc(var(--sidebar-width-icon)_+_(--spacing(4))_+_2px)]` | R1 | goes with the `floating` and `inset` variants that need it |
| `style="--sidebar-width: …"` (provider and sheet) | `001` decision 25 | the classes of §1.6 |
| `style="--skeleton-width: {random}"` | `001` decision 25; INFERRED hydration mismatch, since the server and the client draw different numbers | a fixed set of widths (`max-w-1/2`, `max-w-3/4`, `max-w-full`) chosen by index, or one width |
| `cn-rtl-flip` | R16 | `rtl:-scale-x-100` or nothing; our pages are LTR |
| `group-data-[collapsible=icon]:size-8!`, `:p-2!` (the button when collapsed) | passes the lint | keep if the icon mode is kept: `size-8` is 32 px, on the ladder, above R21's 24 |
| `rounded-md`, `rounded-lg`, `[--radius:var(--radius-xl)]` | R9 | `rounded` everywhere; `001` maps every step to 8 px, so the `--radius` override is a no-op here |
| `IconPlaceholder` in the trigger | R15 | `phosphor-svelte`'s `Sidebar` icon, which the build resolves (`phosphor="SidebarIcon"`, `sidebar-trigger.svelte` line 38) |
| `tailwind-variants` in `sidebar-menu-button.svelte` | — | keep, as `button` does (`tv` from `tailwind-variants/lite`); the item already names the package |
| `no-scrollbar` on the content | passes the lint; `004` decision 5 | `scrollbar` plus `tabindex="0"` and a label (§2.8) |
| `data-active:bg-sidebar-accent data-active:font-medium` | R19 | keep the inset and the weight, add `aria-current="page"` (§4.5) |
| `dark:` | R12 | none in these files: 0 of 50 findings, and 0 occurrences of `dark:` (EXECUTED: `grep -c 'dark:'` over the 26 files returned 0) |

### 1.5 What the lint cannot see (READ, INFERRED)

- `no-scrollbar` (maia 1136) is a shadcn-svelte utility, `scrollbar-width: none` plus a hidden `::-webkit-scrollbar` (`packages/cli/src/tailwind.css` lines 82 to 87; it ships in `shadcn-svelte/tailwind.css`, which `001` imports). It hides the scrollbar entirely. The computed value was `scrollbar-width: none` (§2.8). `004` decision 5 chose the opposite: a visible, token-coloured scrollbar.
- `[&>button]:hidden` on the sheet content (`sidebar.svelte` line 44) hides the sheet's own close button. The computed `display` of `[data-slot=sheet-close]` was `none` (§2.5). The sheet then closes by Escape, by the overlay, or by the trigger that is now under the scrim.
- `bg-popover text-popover-foreground` from maia's `cn-sheet-content` (`style-maia.css` 1087) against the sidebar's `bg-sidebar text-sidebar-foreground`: `cn` keeps the later class, `bg-sidebar`, and the measured sheet ground was `--sidebar` in both themes (EXECUTED: `cn("bg-popover text-popover-foreground p-6", "bg-sidebar p-0")` returned `"text-popover-foreground bg-sidebar p-0"`, cn 0.5.1; the dialog computed `rgb(247, 247, 244)` light and `rgb(20, 22, 28)` dark). The text colour pair is left as `text-popover-foreground`, which equals `sidebar-foreground` in our tokens.
- `border-e` on the container (`sidebar.svelte` line 89) names a width and no colour. Under our theme it computed `1px rgb(20, 22, 28)` in light: a solid ink line, not the hairline (§4.1).
- `has-data-[variant=inset]:bg-sidebar` on the wrapper (`sidebar-provider.svelte` line 45) makes the whole page ground `sidebar` for the `inset` variant. In our tokens `sidebar` equals `background`, so nothing tints, but the variant is dropped anyway.
- `text-xs font-medium` on the group label: v2 §04 sets captions and eyebrows in mono, lowercase, `+8%` tracking. A sidebar's group label is such furniture (INFERRED).
- `title="Toggle Sidebar"` on the rail duplicates its `aria-label` as a native tooltip; harmless, but the rail is mouse-only (§2.7).
- `Math.random()` in `sidebar-menu-skeleton.svelte` line 17 runs once on the server and once on the client, so the prerendered `style` and the hydrated one differ (INFERRED; not run).

### 1.6 The `style` attribute, and the widths (EXECUTED)

The provider writes `style="--sidebar-width: 16rem; --sidebar-width-icon: 3rem; "` on its wrapper (prerendered HTML, §2.1), and the sheet writes `style="--sidebar-width: 18rem;"`. The docs say the `style` prop is for "multiple sidebars in your application" (`docs/content/components/sidebar.md` lines 119 to 136). `001` decision 25 bans a `style` attribute in an item.

`lint-classes.ts` ran `lintText` on each candidate inside `<div class="…">`, and the `/groove` route measured each class's rendered width at 900 px (`groove.light.widths`):

| Class | Lint | Measured | Note |
|---|---|---|---|
| `w-3xs` | passes (L7 allows the container names) | 256 px | Tailwind's `--container-3xs` is 16 rem, the stock desktop width |
| `w-2xs` | passes | 288 px | 18 rem, the stock mobile width |
| `w-12` | passes (a ladder step) | 48 px | 3 rem, the stock icon width |
| `w-(--sidebar-width)` | passes (the token form) | 256 px | from `--sidebar-width: 16rem` written in the scratch app's `:root` |
| `w-(--sidebar-width-icon)` | passes | 48 px | likewise |
| `w-sidebar` | **flagged**, size off the ladder | 256 px | from `@theme { --container-sidebar: 16rem }`; the lint would need to learn the name |
| `w-64`, `w-72` | flagged | — | Tailwind's numeric steps for 16 and 18 rem are off the ladder |

So the three widths need neither a `style` nor a new token: `w-3xs`, `w-2xs` and `w-12` say them. If `005` wants one name to change, `pluto-theme` can emit `--sidebar-width` and `--sidebar-width-icon` in `:root` (through `cssVars.light`, a non-colour value, which the CLI copies and also mirrors into `@theme inline` harmlessly, `004` decision 5) and the item reads `w-(--sidebar-width)`. Either passes L7 today. Both widths are off the ladder of 4 to 96 px by nature: a sidebar is layout, and v2 §05 governs gaps, not panel widths (`001` decision 10, "sizes, not spacing"). 256 and 288 are multiples of 32 (INFERRED).

### 1.7 The `group-data-[collapsible=icon]` variants (READ)

Eleven classes in seven files switch on the root's `data-collapsible="icon"` (set only while collapsed, `sidebar.svelte` line 64): the gap and container widths (lines 78 and 89), the content's `overflow-hidden` (`sidebar-content.svelte` 18), the group label's `-mt-8 opacity-0` (maia 1160), the group action's `hidden` (`sidebar-group-action.svelte` 18), the menu button's `size-8! p-2!` (maia 1168), the `lg` button's `p-0!` (maia 1192), the menu action's `hidden` (`sidebar-menu-action.svelte` 20), the badge's `hidden` (`sidebar-menu-badge.svelte` 18), the sub-list's `hidden` (`sidebar-menu-sub.svelte` 20) and the sub-button's `hidden` (`sidebar-menu-sub-button.svelte` 22). They pass the lint (no literal) and are what makes the icon mode. Dropping the icon mode drops all eleven, and `data-collapsible` with them (INFERRED).

## 2. Behaviour, EXECUTED

### 2.1 The scratch app and the composition

`tests/smoke/fixtures/kit3` was copied to the scratchpad, `bun install --frozen-lockfile` (66 packages) and `svelte-kit sync` run, then, with the repository's pinned CLI (`bun --bun node_modules/.bin/shadcn-svelte`, 1.7.1):

1. `REGISTRY_URL=https://shadcn-svelte.com/registry … add sidebar -y -o` installed `sidebar`, `is-mobile`, `input`, `tooltip`, `skeleton`, `separator`, `button` and `sheet` (52 files) and added `@internationalized/date`, `@lucide/svelte`, `bits-ui` and `tailwind-variants` to `package.json`. It did **not** install `utils`: no stock item names it, and shadcn-svelte's `init` writes it. So `#lib/utils` was missing until step 2.
2. `REGISTRY_URL=https://raw.githubusercontent.com/plutosystemsco/design-system/v0.4.0/static/r … add pluto-theme -y -o` and `… add utils -y -o` wrote our tokens, utilities and fonts into `src/app.css` (329 lines) and `src/lib/utils.ts`, so the `sidebar*`, `groove-*` and motion tokens exist and `cn` is ours. This is the first install from the GitHub URL by this author; it worked as decisions.md of 2026-11-01 says.
3. `… add collapsible -y -o` from the stock registry, for the menu's sub-items.

`app-shell.svelte` composes `sidebar-07`'s shape from `blocks/sidebar-07/+page.svelte` and `components/app-sidebar.svelte` and `nav-main.svelte`: `Sidebar.Provider` → `Sidebar.Root {collapsible}` with a `Header` (one `lg` menu button as a link "Pluto"), `Content` (a "Platform" group of four collapsible menu buttons with three or four sub-links each, the first open; a "Projects" group of 24 links so the content overflows), `Footer` (one `lg` button "Clay Gendron"), `Rail`; then `Sidebar.Inset` with a `header` holding `Sidebar.Trigger` and a breadcrumb line, an `h1`, a text input `#notes`, a link and a 200 vh spacer. Every menu button passes `tooltipContent`, as `sidebar-07` does. Three prerendered routes render it with `collapsible` `offcanvas`, `icon` and `none`; `/groove` is §4.1's sketch. The layout sets `data-hydrated` on `<html>` in `onMount`, so the probe knows when hydration is done. `vite build` prerendered five pages; `serve.ts` (`Bun.serve`) served `build/` on port 4173; `probe.ts` drove Chromium at 360, 768 and 1280 × 720 px.

### 2.2 What the server renders (EXECUTED: `fetch` of the built HTML)

For `offcanvas` and `icon`: one `data-slot="sidebar"`, with `data-state="expanded"`, the desktop wrapper `class="group peer hidden text-sidebar-foreground md:block"`, 0 `role="dialog"`, 0 `data-mobile`, 0 `tooltip-content`, 0 `<nav>`, 1 `<main>`, no skip link; the trigger as `<button data-slot="sidebar-trigger" type="button" data-sidebar="trigger">` with no ARIA attribute; the rail as `<button … aria-label="Toggle Sidebar" tabindex="-1" title="Toggle Sidebar">`; the content as a `div` with `no-scrollbar … overflow-auto`. For `none`: 0 `data-slot="sidebar"` (that branch is a plain `div` without the attribute, `sidebar.svelte` lines 26 to 35).

### 2.3 The trigger, the shortcut and the cookie

| Check | Result |
|---|---|
| The trigger's element | `<button type="button">`, 32 × 32 px (`size-icon-sm`), accessible name "Toggle Sidebar" from the `sr-only` span; `aria-expanded`, `aria-controls` and `aria-pressed` all absent, before and after a toggle (`triggerAfter.ariaExpanded: null`). Playwright's `ariaSnapshot`: `- button "Toggle Sidebar"` |
| Focus after a click | stays on the trigger (`focused: true`) |
| Ctrl+B at 768 and 1280 | `offcanvas`: `data-state="collapsed"`, `data-collapsible="offcanvas"`, the gap 256 → 0 px, the container's `x` 0 → −256; `icon`: collapsed, gap 256 → 48, container at 0. Cookie `sidebar_state=false` |
| Cmd+B (Meta) | expands again; cookie `sidebar_state=true`. Either modifier works (`context.svelte.ts` line 45, `metaKey || ctrlKey`) |
| Ctrl+B with focus in the `#notes` text input | toggles the sidebar; the handler does not look at the event's target |
| Ctrl+B at 360 | opens the sheet (`afterCtrlMobile.dialog: true`, `toggle()` branches on `isMobile`, line 56) |
| Reload after collapsing | `data-state="expanded"` while `document.cookie` still reads `sidebar_state=false`. The provider defaults `open` to `true` and nothing reads the cookie (`sidebar-provider.svelte` lines 15, 33). An app must read it in a server `load` and pass `open` |
| `none` mode | no shortcut effect to measure: the root is a plain `div` without state, and the trigger still exists and toggles a state nothing reads |

### 2.4 The three modes and the tab order

The tab walk pressed Tab from the top of the document until focus returned to `body`, recording each stop's element, name, position and whether it lay inside the sidebar. For the collapsed walks the sequential focus navigation starting point was reset to the top of `body` through a collapsed selection; without that, Chromium resumed from the trigger and the walk showed two stops, which was an artefact of the probe (`debug4.ts` holds the corrected run).

| Mode, width, state | Stops | Of which in the sidebar | Where they are |
|---|---|---|---|
| expanded, 768 and 1280, `offcanvas` and `icon` | 36 | 33 (Pluto, 4 group buttons, 3 open sub-links, 24 projects, Clay) then trigger, input, link | all visible; the content box scrolled under focus (`scrollTop` 0 → 318 → 638 → 736) |
| `offcanvas` collapsed, 1280 | 36 | 33 | **every sidebar stop at x = −248 px**, off the left edge, `window.scrollX` 0 throughout; the container computes `visibility: visible`, `display: flex`, no `inert`, no `aria-hidden`. `focus()` on "Project 3" succeeded with the element invisible |
| `icon` collapsed, 1280 | 33 | 30 | each 32 × 32 px at x = 8; the 3 sub-links gone (`sidebar-menu-sub` computes `display: none`); the group labels `opacity: 0`, `margin-top: −32px`, still `display: flex` |
| `none`, 360 to 1280 | 36 | 33 (inline, not `fixed`) | at 360 the sidebar takes 208 px and leaves 120 px for the inset's input; nothing adapts |
| 360, `offcanvas` and `icon`, sheet closed | 3 | 0 | trigger, input, link |

Off-canvas, then, is hidden from sight and from pointer but not from the keyboard or from assistive technology: SC 2.4.11 (focus not obscured) and 2.4.7 (focus visible) fail for 33 stops, and a screen reader reads a navigation that is not on screen (INFERRED from the measurements; the Understanding pages are the patterns memo's). Collapsed to icons, the content box is `overflow: hidden` with `scrollHeight` 1040 against `clientHeight` 624; a wheel of 600 px over it left `scrollTop` at 0, while Tab to "Project 20" scrolled it to 416 (the browser scrolls a hidden overflow to reveal focus). So the 11 icons below the fold are reachable by keyboard only.

### 2.5 The sheet at 360 px (`offcanvas` and `icon` behave the same)

| Check | Result |
|---|---|
| Role and name | `role="dialog"`, `aria-modal="true"`, `aria-labelledby` → "Sidebar" (an `sr-only` heading, level 2 in the tree), `aria-describedby` → "Displays the mobile sidebar.", `data-side="left"`, `data-state="open"` |
| Size | 270 px wide at x = 0: `w-3/4` of 360 (maia 1087, `data-[side=left]:w-3/4`, which wins over the component's `w-(--sidebar-width)`), `max-width: none` below `sm`. The 18 rem constant has no effect at this width |
| Open motion | `animation-name: none`, `animation-duration: 0s`: the `animate-in` classes are `tw-animate-css`'s, which the app does not have (`002` decision 3 dropped it); `transition-duration: 0.2s` from the `transition duration-200` on the content |
| Overlay | `background-color: oklab(0 0 0 / 0.8)` (`bg-black/80`), `backdrop-filter: blur(4px)`; `body` `overflow: hidden` |
| Close button | present in the DOM, `display: none` (§1.5) |
| Outside the dialog | 0 elements with `inert`, 0 with `aria-hidden="true"` (other than `svg`) |
| Focus on open | the first tabbable, the "Pluto" link (`activeAfterOpen`), by mouse and by keyboard (Enter on the trigger) |
| Trap | 40 Tabs, 40 inside, 32 distinct elements: the order wraps |
| Escape, focus on a plain link | closes; `document.activeElement` is the trigger |
| Escape, focus on a menu button with `tooltipContent` ("Playground", one Tab from the first stop) | the first Escape **leaves the sheet open**; the button's tooltip was open and `hidden` (`data-state="instant-open"`, the `hidden` attribute set because `isMobile`), and bits-ui's top escape layer, the tooltip's, took the key. The second Escape closes the sheet and focus is on the trigger. The same with focus on "Settings" after 40 Tabs |
| Overlay click (x = 350, y = 600) | closes; focus on the trigger |
| axe, sheet open | 0 violations from the sidebar (the one reported, `document-title`, is the scratch page's missing `<title>`) |

bits-ui's `FocusScopeManager.register` records `document.activeElement` when a scope opens (`bits-ui/bits/utilities/focus-scope/focus-scope-manager.js` lines 19 to 23) and the dialog returns focus there on close, so the trigger gets it back although it is not the dialog's own `Trigger` (READ, and the measurements agree). The patterns memo §1.2 flagged this as INFERRED; it is now EXECUTED: focus returns, in four of four cases.

### 2.6 The menu button and its tooltip

- A collapsible menu button renders `<button type="button" aria-expanded aria-controls="bits-…">` from bits-ui's `Collapsible.Trigger` (the prerendered HTML and `menuButton.default`): the disclosure wiring is right.
- With `tooltipContent` set, bits-ui's `Tooltip.Trigger` merges its own attributes over the button's, and **`data-slot` becomes `tooltip-trigger`** and `data-state` becomes the tooltip's (`closed`, `instant-open`): 28 of the 30 menu buttons lost `data-slot="sidebar-menu-button"`; only the two without a tooltip kept it. R20 asks every root to keep its slot; `005`'s tests will select by `data-sidebar="menu-button"` or the slot must be set after the merge (INFERRED).
- Heights: default 36 px (`h-9`), sub-button 28 px (`h-7`), `lg` 56 px (`h-14`), all 239 px wide at 16 rem; collapsed to icons, 32 × 32 px.
- Tooltip, `icon` mode collapsed at 768 and 1280: hovering "Playground" showed a tooltip reading "Playground", `display: inline-flex`, visible; focusing it by keyboard showed it too. Its `role` was `null` (the stock `tooltip-content` sets none; ours sets `role="tooltip"`, `002`). Expanded, the content carries the `hidden` attribute (`sidebar-menu-button.svelte` line 90) yet still opens in bits-ui's state, which is what ate the first Escape in §2.5.

### 2.7 The rail, the transition and reduced motion

- The rail at 768 and 1280: `display: flex`, 16 × 720 px at x = 247 (it straddles the sidebar's edge at 256), `tabindex="-1"`, `title` and `aria-label` "Toggle Sidebar", `cursor: w-resize`, `::after` 2 px wide and transparent until hover (`hover:after:bg-sidebar-border`, maia 1120). At 360 it is inside the sheet and `hidden` below `sm`. It is a button a keyboard never reaches and a screen reader lists.
- The container: `transition-property: left, right, width`, `0.2s`, `linear`; the gap: `width`, `0.2s`. Toggling by a synthetic Ctrl+B and polling each frame, the width settled in 214, 210, 211 and 219 ms (four runs, two modes, two widths): the 200 ms budget plus one or two frames.
- Under `reducedMotion: "reduce"`: `--motion-micro` read `0s`, both transitions `1e-05s` (our theme's catch-all, `001` decision 14), and the width settled in 8 ms. The stock item itself has no reduced-motion rule (`grep -c 'reduced' stock/*` = 0; the clamp is ours).

### 2.8 The content box

`[data-slot=sidebar-content]` at 768 and 1280, expanded: `overflow-y: auto`, `scrollbar-width: none`, no `tabindex`, no `role`, no `aria-label`; `scrollHeight` 1312, `clientHeight` 576. With focus on "Project 1", five ArrowDowns scrolled the box from 78 to 278 px and the window not at all, so the keyboard can scroll it while a link inside has focus; a reader who tabs past it, or has nothing focusable inside, cannot. Our rule from `004` decision 5 is `overflow-auto scrollbar tabindex="0"` plus a label, which makes the box itself a stop. In `none` mode the box did not overflow and the ArrowDowns scrolled the window by 200 px.

### 2.9 axe (EXECUTED, the repository's six tags)

| State | Violations |
|---|---|
| desktop, expanded, 768 and 1280, both modes | `region` (moderate), 28 nodes: the header, the group labels, the collapsible regions and the rest sit in no landmark, because the sidebar's root is a `div` |
| desktop, collapsed | `region`, 28 (`offcanvas`) or 27 (`icon`) nodes |
| 360, sheet closed and open | none |
| every state | `document-title` (serious): the scratch page has no `<title>`; not the sidebar's |

A `<nav aria-label>` around the sidebar's content, or an `aside`, clears `region` (INFERRED; the patterns memo §1.2 asks for the landmark anyway).

### 2.10 Screenshots

`shots/` holds the expanded, collapsed and sheet states in both themes. Three things seen: under our theme the stock edge and the inset header's `border-b` are solid ink lines in light and solid paper lines in dark (§4.1); the icon rail shows the "Pluto" and "Clay Gendron" `lg` buttons as clipped text ("Plu…", "Cla…"), because this composition gave them text alone where `sidebar-07`'s rows carry an icon (its `team-switcher.svelte` and `nav-user.svelte` were not read); and the dark sheet screenshot caught the content's 200 ms colour transition half way, with the labels invisible for that instant; the measured dark values are ink `rgb(20, 22, 28)` on the sheet and paper text (§1.5).

## 3. The `is-mobile` hook

### 3.1 What it is (READ)

`docs/src/lib/registry/hooks/is-mobile.svelte.ts` is 9 lines: `class IsMobile extends MediaQuery` from `svelte/reactivity`, whose constructor passes `` `max-width: ${breakpoint - 1}px` `` with a default breakpoint of 768, so the query is `(max-width: 767px)`. The live item `is-mobile.json` is `registry:hook`, one file, no dependencies (§5). `SidebarState` holds one instance and exposes `isMobile` as `#isMobile.current` (`context.svelte.ts` lines 28 to 41); `sidebar.svelte` branches on it (line 36), and `toggle()` and the tooltip's `hidden` read it.

### 3.2 On the server (READ, EXECUTED)

Svelte resolves `svelte/reactivity` to `src/reactivity/index-server.js` under the `default` and `worker` conditions and to `index-client.js` under `browser` (`svelte/package.json` lines 84 to 88). The server file's `MediaQuery` is a stub: `constructor(query, matches = false) { this.current = matches; }` (`svelte/reactivity/index-server.js`). The hook passes no second argument, so on the server `current` is `false`: never mobile. The client class calls `window.matchMedia` in its constructor and reads `q.matches` (`svelte/reactivity/media-query.js` lines 42 to 53); its doc comment warns "during server-side rendering, there is no way to know what the correct value should be, potentially causing content to change upon hydration. If you can use the media query in CSS to achieve the same effect, do that" (lines 20 to 23).

EXECUTED on the prerendered pages (§2.2): the HTML holds the desktop branch, `data-state="expanded"`, inside the `hidden md:block` wrapper, and no dialog. At 360 px:

- with JavaScript off, the wrapper computes `display: none` and the container `display: none`, 0 px wide: a phone reader sees no sidebar and has no way to open one (the trigger's handler is JavaScript);
- with JavaScript on, after hydration the desktop node is gone (`desktop: false`), the sheet branch is mounted closed (`mobile: false`, `dialog: false`), and nothing visible changed, since the desktop node was `display: none` before it was replaced. No flash, by the `md:` class, not by the hook.

At 1280 px with JavaScript off the sidebar is there, expanded, 256 px wide, and only the shortcut and the trigger are dead.

### 3.3 Could CSS replace it (INFERRED)

The visible switch is already CSS: `hidden md:block` on the desktop wrapper and `md:flex` on the container (`sidebar.svelte` lines 62 and 85). What the hook decides is **which component tree exists**: a `Sheet` (a portaled modal dialog with a focus trap and a scrim) below 768 px, a `fixed` panel above. CSS cannot turn a panel into a dialog: the dialog's `role`, `aria-modal`, the trap, Escape and the return of focus are behaviour, and a sheet that existed at every width would trap focus on desktop or need the same JavaScript branch to disable itself. So the hook stays, for three things: choosing the tree, routing `toggle()` to `openMobile` or `open`, and hiding the icon tooltip on touch. What should change is the server fallback and the first paint: the server renders the desktop tree, which is right for the `md:` CSS and wrong for a phone only until hydration, where it is invisible anyway. A `MediaQuery` fallback of `true` would do the opposite: prerender a closed sheet, so a phone without JavaScript gets nothing and a desktop without JavaScript gets nothing either. `false` is the better fallback, and `005` can say so in the hook's comment rather than add a prop (INFERRED).

One more use the hook could lose: the desktop tab-order problem of §2.4 is not the hook's; it is the off-canvas container staying rendered. `inert` on the collapsed container, or `display: none` after the transition, is CSS and attributes, no media query.

## 4. What our sidebar should be (INFERRED unless marked)

### 4.1 The vertical groove (EXECUTED, then INFERRED)

`001` decision 13 draws the groove as `border-top: var(--line-width) solid var(--groove-line)` with `box-shadow: inset 0 var(--line-width) 0 var(--groove-light)`: the element below a divider owns it, the hairline on its top edge and the white line inside it, just beneath. v2 §05 (line 535) says "a hairline of Ink at 8–10% with a 1 px white line beneath it on paper grounds — a recessed groove, not a drawn border"; the book's own sections are the reference (line 51: `border-top:1px solid var(--ink-faint);box-shadow:inset 0 1px 0 var(--raised)`).

`/groove` drew four seams between a 256 px `bg-sidebar` aside and a `bg-background` main, 192 px tall each, and `probe.ts` read the screenshot's pixels (playwright-core's bundled `PNG`) along a row 100 px down, at the aside's right edge (x = 256) and three pixels either side:

| Variant | Aside classes | Main classes | Light, x −2 / −1 / 0 / +1 | Dark, x −1 / 0 |
|---|---|---|---|---|
| stock | `border-e border-sidebar-border` | — | paper / `#dfdfde` / paper / paper | `#2a2c32` / ink |
| A, outer shadow on the aside | `border-e border-groove-line shadow-[1px_0_0_var(--groove-light)]` | — | paper / `#dfdfde` / paper / paper | the same |
| B, highlight inside the aside | `border-e border-groove-line shadow-[inset_-1px_0_0_var(--groove-light)]` | — | **`#ffffff`** / `#dfdfde` / paper / paper | the same |
| D, the main owns it | — | `border-s border-groove-line shadow-[inset_1px_0_0_var(--groove-light)]` | paper / paper / `#dfdfde` / **`#ffffff`** | ink / `#2a2c32` |

Paper is `#f7f7f4`, ink `#14161c`; `#dfdfde` is 10% ink over paper and `#2a2c32` 10% paper over ink, the hairline in each theme; `groove-light` is `#fff` in light and transparent in dark, so the dark rows show the hairline alone, as decision 13 intends.

What this says:

- **A does not work in a flow layout.** The aside's outer shadow computed (`rgb(255,255,255) 1px 0px 0px 0px`) but the main, a later sibling with its own background, painted over it: no white pixel anywhere. In the stock layout the container is `fixed z-10` and would win, but a form that depends on stacking is fragile.
- **B and D both draw the groove.** B puts the white line on the sidebar's side of the hairline, D on the inset's side. The horizontal groove puts the hairline first and the light **beneath** it, in the element that follows; light falls from above. Turned on its side with light from the top-left, the hairline comes first (the sidebar's edge) and the light follows it, on the inset. That is D, and it is the same structure as the `groove` utility, owned by the element that comes after the line. B is its mirror and would read as light from the right. **D is the proposal**, with the highlight to the right of the hairline for a left sidebar; a right sidebar mirrors it.
- **It must be a utility.** `shadow-[inset_1px_0_0_var(--groove-light)]` is an arbitrary value and the lint flags it (`lint-classes.ts`); `border-e-groove-line` and `border-s` pass. So `pluto-theme` gains a second groove utility, say `groove-s` (start edge: `border-inline-start: var(--line-width) solid var(--groove-line); box-shadow: inset var(--line-width) 0 0 var(--groove-light)`), and perhaps `groove-e` for a right-hand sidebar. Who sets it: `SidebarInset` for a left sidebar, which `005` serves anyway; or the sidebar container when `side="right"`. A `groove` on the inset's header then meets `groove-s` at the corner, two hairlines at right angles, as the book's section dividers meet its page edge.
- **Stock's edge is not the hairline under our theme.** The container's `border-e` computed `1px rgb(20, 22, 28)` in light and paper in dark: Tailwind 4's preflight gives borders `currentColor`; shadcn-svelte's template app CSS and its manual-install page both carry `@layer base { * { @apply border-border outline-ring/50; } }` (READ: `sv-addons/registry/template/src/app.css` lines 115 to 118; `docs/content/installation/manual.md` lines 196 to 199; `001` decision 13 notes the `outline-ring/50` half), and our `pluto-theme` sets no base border colour (`src/app.css` lines 284 to 310 hold `body`, headings, `:focus-visible`, code and `html` only). Every restyled item of ours names its colour (`border-input`, `border-border`); a stock class that does not draws ink. `005` writes the colour, or decides whether `pluto-theme` should carry the base rule for apps' own markup (a call for the specification; both are additive).

### 4.2 The ground, the inset rows and the collapse (INFERRED, against `001` decision 8 and v2)

- `sidebar` is `paper` light and `ink` dark, equal to `background`: a ground "set apart by a groove, not a tint" (`001` decision 8). The stock item already has no tint on the sidebar; what it adds is the `floating` and `inset` variants (a bordered, shadowed panel and a card-like main), which make the sidebar a surface. v2 §05 (line 541) allows shadows "only where elevation means something (menus, dialogs)". Both variants go; one `variant` is none.
- `sidebar-accent` is the `wash` inset for hover and the selected row, as `accent` is for `table` and `item` (decision 8; decisions.md, "A selected table row is told by shape, and by a control"). Stock applies it on hover, active, `data-active` and `data-open:hover` (maia 1168) and tells the active row by colour plus `font-medium`. R19 asks for a second cue; the weight is one, `aria-current="page"` on the link is the one assistive technology needs, and `002`'s selected row adds a `primary` left edge one focus-width wide; the same mark on the current nav row keeps the two states apart (hover is the inset alone, current is the inset plus the edge).
- The collapse to icons: NN/g, as the patterns memo §1.1 read it, finds icon-only collapse ambiguous for occasional visitors and acceptable for daily-use applications. `wasi-python-dev` is a tool people return to, and `006`'s shell is for it; the measured icon mode is sound by keyboard (30 stops at 32 px, sub-items out of the order) and unsound by pointer below the fold (§2.4, `overflow-hidden`). If `005` keeps it, the content box stays `overflow-auto scrollbar` when collapsed and the icons get the tooltip, which the stock already does (§2.6). If it drops it, eleven variants and `data-collapsible` go (§1.7). The lead's call; this memo leans to keeping it for the app shell and making it a prop of the shell, not the sidebar's default, since every other visitor gets off-canvas.
- Off-canvas as measured is a keyboard trap in reverse: 33 invisible stops (§2.4). The collapsed container needs `inert` (one attribute; Chromium, Firefox and Safari support it since 2022, unchecked here) or `invisible` after the transition, so the links leave the tab order and the accessibility tree while the state persists. The patterns memo §8.1 asked for off-canvas as the default; it still is, with that fix.
- Motion: the 200 ms linear slide is inside v2 §06's budget and our tokens clamp it under reduce (§2.7). It becomes `transition-[left,right,width] duration-(--motion-micro) ease-linear`, or the default `transition` with its 200 ms.

### 4.3 The rail, the trigger, the shortcut (INFERRED)

- **The rail goes.** It is 16 px wide, `tabindex="-1"`, and its only visible sign is a 2 px line on hover (§2.7). R21 is a house rule of 24 px for every pointer target, stricter than SC 2.5.8's exceptions, because "a component cannot know its surroundings" (`002` decision 9). A 16 px strip fails it by design, and it is a second control for a thing the trigger already does. Dropping it removes `sidebar-rail.svelte` and its `cursor-*-resize` affordance, which promised a drag the rail never did.
- **The trigger is a disclosure**: `aria-expanded` true or false, and `aria-controls` naming the sidebar's `nav` (APG disclosure, patterns memo §1.2); stock has neither (§2.3). On mobile the trigger opens a dialog, so there it carries `aria-haspopup="dialog"` and `aria-expanded` as well, as `004`'s popover trigger does. It is a `size-8` icon button today (32 px); `002` decision 10 makes icon buttons `size-12` or `size-8`, so `icon-sm` stands and the header's 48 px row holds it. Its hidden text "Toggle Sidebar" is the right name; a visible label is the header's choice.
- **The shortcut stays, with a guard.** SC 2.1.4 allows modifier shortcuts (patterns memo §1.2). Stock fires on any Ctrl/Cmd+B, inside a text field too (§2.3). The shell hosts `code-editor` (`004`), and there the key is already taken on a Mac: `@codemirror/commands` 6.11.1 binds `Ctrl-b` to `cursorCharLeft` in its `emacsStyleKeymap`, merged into `standardKeymap` as `mac:` bindings, which `defaultKeymap` extends (READ: `node_modules/@codemirror/commands/dist/index.js` lines 1695 to 1696, 1770, 1817), and `004` decision 9's `pythonSetup` installs `defaultKeymap`. So Ctrl+B in the editor on a Mac moves the caret one character left **and**, with the stock handler on `window`, collapses the sidebar (INFERRED from the two sources: the editor's keymap sets `preventDefault`, and the stock handler never reads `defaultPrevented`; not run together). A rich-text field would mean bold. The handler should return early when the event's target is editable (`input`, `textarea`, `[contenteditable]`, or a `.cm-content`) and when `event.defaultPrevented`. And the shortcut should be told somewhere: a `kbd` in the trigger's tooltip (`002` has both items).
- **The cookie is read by the app**, not by the item: stock writes `sidebar_state` and never reads it (§2.3). `005` keeps the write and documents the read in the shell's `+layout.server.ts` (`006`), passing `open` to the provider; or it drops the cookie for `localStorage` read in `onMount`, which flashes once. The cookie is the better path: the prerendered state is right on the first paint.

### 4.4 Landmarks, the current page, the skip link, the sticky header (INFERRED)

- The sidebar's root is a `<nav aria-label="…">` on desktop and the sheet's content holds the same `nav` on mobile; the label is a prop with a default ("Main"), since a shell with header links has a second `nav` (patterns memo §1.2, two distinct labels). This clears axe's `region` (§2.9) and gives screen readers the landmark they jump by. `SidebarInset` stays the `<main>`, with `id="main"` and `tabindex="-1"` so the skip link's target takes focus (patterns memo §1.2, WebAIM).
- `aria-current="page"` on the current link, set by the app from `page.url`; `isActive` becomes the attribute, not a `data-` flag alone.
- The skip link is the shell's (`006`), first in `<body>`, before the provider: "Skip to main content" to `#main` (GOV.UK and WebAIM, patterns memo §1.1). It is not the sidebar's: a sidebar does not know it is first.
- The sheet: it already is a modal dialog named "Sidebar" with a trap and the return of focus (§2.5). Three changes: the overlay is `bg-scrim` with no blur (R11; v2 §09 line 651); the content takes `shadow-elevation` and `animate-enter`/`animate-exit` (`002` decisions 7 and 3) in place of the dead `animate-in` classes; the width is `w-2xs` with `max-w-full`, not three quarters of the viewport. And the tooltip must not open inside the sheet at all (§2.5's double Escape): render the menu button without its `Tooltip` when `isMobile`, rather than hiding the content.
- The sticky header: the stock blocks' sticky page headers are the app's (patterns memo §1.1). If `006` makes the inset's header sticky, `scroll-padding-top` on the scroll container equals its height (SC 2.4.11, C43), and the header is opaque, no blur. Not measured here.
- The content box: `overflow-auto scrollbar` plus `tabindex="0"` and `aria-label` (§2.8), the pattern `004` decision 5 set; in icon mode it stays `overflow-auto`, not `hidden`.

### 4.5 The widths and sizes (INFERRED from §1.6 and `002` decision 10)

`w-3xs` expanded, `w-12` collapsed to icons, `w-2xs` for the sheet: three allowed classes, no `style`, no new token. Rows: menu buttons `h-12` (default) and `h-8` (`sm`); sub-items `h-8`; the header and footer buttons `h-12`, no `lg`. Padding `p-2` on groups, `gap-1` between rows, `px-3` inside a row: all on the ladder. Icons `size-4`. The group label `h-8 px-3` in mono `text-xs`. A 48 px row gives a 16 rem sidebar room for about 11 rows at 720 px, which is why the box scrolls.

## 5. Packages (EXECUTED: the live JSON)

| Item | Type | `devDependencies` | `registryDependencies` | Files | Lint |
|---|---|---|---|---|---|
| `sidebar` | `registry:ui` | `bits-ui@^2.20.0`, `@internationalized/date@^3.12.0`, `tailwind-variants@^3.3.0` | `is-mobile`, `input`, `tooltip`, `skeleton`, `separator`, `button`, `sheet` | 26 | 50 in 15 |
| `sheet` | `registry:ui` | `bits-ui@^2.20.0`, `@internationalized/date@^3.12.0` | `button` | 11 | 22 in 3 (`sheet-content` 14: `shadow-lg`, `duration-200`, twelve `tw-animate-css` classes; `sheet-overlay` 7: `bg-black/80`, `backdrop-blur-xs`, `duration-100`, four animation classes; `sheet-header` 1: `gap-1.5`) |
| `is-mobile` | `registry:hook` | none | none | 1 | 0 |

All three packages are held: `bits-ui@^2.20.2`, `@internationalized/date@^3.12.4`, `tailwind-variants@^3.3.1` in `package.json`. `@lucide/svelte`, which the stock install added to the scratch app for the resolved icons, is not needed: `phosphor-svelte` is ours (R15). Of the seven items: `input`, `tooltip`, `skeleton`, `separator` and `button` exist in our registry (`src/lib/registry/ui/`), and `collapsible`, which the blocks compose for sub-items, exists too; `sheet` and `is-mobile` do not, and `005` serves them before `sidebar`. Our `sheet` is `alert-dialog`'s cousin: bits-ui's `Dialog` with `bg-scrim`, `shadow-elevation`, `animate-enter`/`animate-exit`, a visible close button of `size-8` and R21's targets; `002` decision 17 already restyled the dialog chrome once.

## 6. What is still unknown

- **`inert` on the collapsed off-canvas container**: proposed in §4.2, not run. Whether bits-ui's `Collapsible` inside an `inert` subtree keeps its state, and what the 200 ms slide looks like when `inert` lands at its end, are a build's checks.
- **Firefox and Safari** were not run: the focus-navigation starting point, `scrollbar-width`, `overflow: hidden` under focus, and `oklab` overlay colours may differ. `004` decision 21's placeholder widens to this item.
- **A screen reader** was not heard over the sheet, the disclosure buttons or the off-canvas links; the DOM and axe are the evidence. `003`'s placeholder memo covers it.
- **The sticky header and `scroll-padding-top`** were not measured; the scratch header was static.
- **`is-mobile`'s hydration on a device that changes width** (a rotated tablet across 768 px) was not run; `MediaQuery` subscribes to `change` (`media-query.js` line 52), so the tree should switch live, with the sheet's state lost.
- **The hydration mismatch of the random skeleton width** (§1.5) is inferred, not seen.
- **What `006`'s header holds at 360 px** beside the trigger (the mark alone, one utility) is the shell's question, outside this memo.
- **`hidden="until-found"`** for collapsed sub-lists, so find-in-page opens them, remains unchecked (data memo §9).

**In one line:** the stock sidebar fails the lint 50 times in 15 of its 26 files but needs no `style` attribute, since `w-3xs`, `w-2xs` and `w-12` say its three widths; measured, its trigger is a bare button, its cookie is written and never read, its off-canvas state leaves 33 invisible links in the tab order, its icon state hides eleven rows from the pointer, and its mobile sheet is a proper modal that returns focus to the trigger except when a hidden tooltip eats the first Escape; `is-mobile` prerenders as desktop and hides it with CSS until hydration, which is right; and a vertical groove drawn by the inset, hairline then an inset highlight to its right, matched the horizontal groove pixel for pixel in both themes and must be a `pluto-theme` utility because the lint rejects the shadow as a literal.

## Sources

All web sources fetched on 2026-11-01. Local sources read the same day.

**Live registry**

- `https://shadcn-svelte.com/registry/styles/maia/sidebar.json`, `sheet.json`, `is-mobile.json` (HTTP 200 each)
- `https://raw.githubusercontent.com/plutosystemsco/design-system/v0.4.0/static/r` (`pluto-theme`, `utils`, through the CLI)

**Prior art, `context/prior_art/shadcn-svelte` at `6149e14` (MIT)**

- `docs/src/lib/registry/ui/sidebar/` (26 files), `ui/sheet/sheet-content.svelte`, `hooks/is-mobile.svelte.ts`
- `docs/src/lib/registry/styles/style-maia.css` lines 1082 to 1222
- `docs/src/lib/registry/blocks/sidebar-07/+page.svelte`, `components/app-sidebar.svelte`, `components/nav-main.svelte`; `grep` over `blocks/sidebar-*/` for `collapsible`
- `docs/content/components/sidebar.md` lines 108 to 503
- `docs/src/app.css` lines 381 to 387 and `packages/cli/src/tailwind.css` lines 82 to 87 (`no-scrollbar`)
- `sv-addons/registry/template/src/app.css` lines 115 to 118 and `docs/content/installation/manual.md` lines 196 to 199 (the base border and outline rule)

**Packages, in the scratch app's `node_modules`**

- Svelte 5.57.3: `package.json` lines 84 to 92; `src/reactivity/index-server.js`; `src/reactivity/media-query.js`; `src/reactivity/reactive-value.js`
- bits-ui 2.20.2: `dist/bits/utilities/focus-scope/focus-scope-manager.js`
- cn 0.5.1: `package.json`, `README.md`
- `@codemirror/commands` 6.11.1 (the repository's `node_modules`): `dist/index.js` lines 1695 to 1817

**Local**

- design book v2, `plutosystemshq/pluto-systems-design-book-v2.html`: lines 50 to 51 (the groove CSS), §05 lines 503 to 546, §06 lines 550 to 569, §09 lines 640 to 657
- `specifications/001-tokens-and-the-registry.md` decisions 8, 10, 13, 14, 20, 25; `002-the-primitives-forms-surfaces-and-feedback.md` decisions 3, 7, 8, 9, 10, 12, 17, 21; `004-code-and-data.md` decisions 1, 5, 15, 21
- `research/2026-10-28-the-blocks-patterns-and-accessibility.md` §0, §1, §8.1 (the NN/g, APG, GOV.UK and WebAIM readings are that memo's); `research/2026-10-28-the-primitives-the-blocks-and-the-home-page-need.md` §3, §5; `research/2026-10-31-the-data-items-…-and-a-meter.md` §4.5, §9
- `decisions.md`, `handoff.md`, `src/app.css`, `scripts/lint-literals.ts`, `tests/e2e/axe.spec.ts`, `src/lib/registry/ui/{button,input,separator,skeleton,tooltip,collapsible}/`
