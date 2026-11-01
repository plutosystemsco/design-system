# Review of 005 — Overlays, navigation and the chat primitives

Reviews [`specifications/005-overlays-navigation-and-the-chat-primitives.md`](../specifications/005-overlays-navigation-and-the-chat-primitives.md).

- **Status:** dispositioned; fit to build
- **Date:** 2026-11-01
- **Reviewer:** a reviewer; not the author
- **Reviewed:** the specification as drafted (`specifications/005-overlays-navigation-and-the-chat-primitives.md`, status "draft, 2026-11-01, for review")
- **Re-ran:**
  - `registry.json` summarised: 49 items (1 theme, 3 font, 2 lib, 1 hook, 37 ui, 5 block), 193 item files, 34 `meta.stock`, 27 distinct registry dependency names; 11 items import `tailwind-variants` (13 files). `package.json` `version` `0.4.0`.
  - The clone at `6149e14`, `docs/src/lib/registry/ui/<item>/`: `dropdown-menu` 18 files, `sheet` 11, `dialog` 11, `breadcrumb` 8, `sidebar` 26, `message` 7, `marker` 4, `bubble` 5; `hooks/is-mobile.svelte.ts`. Stock `dropdown-menu/index.ts` imports `dropdown-menu-label.svelte` (lines 7, 31, 44); stock `sidebar/index.ts` imports `sidebar-rail.svelte` (lines 20, 46, 70); no other stock file references either. Stock `message/*` imports nothing from `bubble`.
  - The suites as they stand: `keyboard.spec.ts` 24 fixtures / 52 stops, 83 view stops, 42 toolbar stops, 19 behaviours (its own comment); the catalogue test expects stop 2 to be a `button` named "Dark theme"; `literals.test.ts` 70 bad / 47 good; `axe.spec.ts` scans `003`'s and `004`'s new item pages at 360, 768 **and** 1280; `pages.ts` line 230 waits for `button[aria-pressed][data-ready]`; `registry.test.ts` 27 dependency names, 11 `tailwind-variants` items.
  - `lintText` from `scripts/lint-literals.ts` over every class string the specification writes out (22 samples): **2 violations**, both `scale` (L18) on `rtl:-scale-x-100` (decisions 7 and 9). Everything else passes: `min-w-3xs`, `max-h-3xs`, `w-2xs`, `max-w-4/5`, `scroll-pb-24`, `inset-x-4`, `top-1/2`, `-translate-y-1/2`, `start-2`, `end-4`, `border-s-(length:--focus-width)`, `transition-[width] duration-(--motion-micro) ease-linear`, `overscroll-contain`, `group-data-[collapsible=icon]:size-8!`, the theme script as a quoted string in a `.svelte.ts` file. `max-h-64` and `max-h-96` are flagged (L7); `max-h-(--container-3xs)` and `rtl:rotate-180` pass.
  - Tailwind 4.3.3 (`compile` from the pinned package over `src/app.css`): **`max-h-3xs` emits nothing**, as `max-h-sm` did for `004`. `w-2xs` (`var(--container-2xs)`, 18 rem), `w-3xs`, `min-w-3xs`, `max-w-4/5` (`calc(4 / 5 * 100%)`), `max-w-md`, `scroll-pb-24` (`calc(0.25rem * 24)`), `overscroll-contain`, `field-sizing-content`, `data-highlighted:bg-accent` (`[data-highlighted]`), `data-inset:ps-8`, `rtl:-scale-x-100`, `rtl:rotate-180`, `border-s-(length:--focus-width)`, `transition-[width]`, `duration-(--motion-micro)`, `inset-x-4`, `top-1/2`, `start-2`, `end-4`, `sticky`, `bottom-4`, `max-h-(--bits-dropdown-menu-content-available-height)`, `inert:hidden`, `wrap-break-word`, `lowercase`, `tracking-eyebrow` all generate. `max-h-(--container-3xs)` generates `max-height: var(--container-3xs)` **and** Tailwind emits `--container-3xs: 16rem` into `@layer theme { :root, :host }` for that candidate alone (the "emitted when referenced" mechanism of `004`'s correction).
  - A SvelteKit scratch (a copy of `tests/smoke/fixtures/kit3`, `bun install --frozen-lockfile` 66 packages, `svelte-kit sync`) with a root layout rendering a component that writes `<svelte:head>{@html SCRIPT}</svelte:head>`: `vite build` prerenders it; the built `index.html`'s `<head>` holds the inline `<script>` exactly once, after the `modulepreload` links and before the stylesheet `<link>`; `svelte-check` 172 files, **0 errors, 0 warnings**; `svelte/compiler` in both `client` and `server` mode returns 0 warnings for the component. (`$lib` is gone in Kit 3; `#lib` resolved.)
  - `scripts/contrast.ts` over the token file for decision 17's four rows: `sidebar-accent-foreground` on `sidebar-accent` 15.00 / 12.83; `sidebar-primary` on `sidebar` 5.51 / 6.85; `destructive` on `accent` 4.71 / 5.53; `muted-foreground` on `popover` 8.18 / 7.17 (light / dark). All pass.
  - `grep pluto-preview-theme`: `src/app.html`, `src/lib/preview/theme-toggle.svelte`, and the historical text of `001` and `003`; nothing else reads it. `src/lib/preview/block-viewer.svelte` copies the parent's `dark` class into the frame through a `MutationObserver`, not through the key.
  - `grep lowercase src/lib/registry`: one use, the hero's mono eyebrow. `grep "rtl:"`: none. `grep "{@html"`: none. `bun run lint` is `prettier --check .` (no eslint, so no `no-at-html-tags` rule).
  - READ: bits-ui 2.20.2 writes `style: { outline: "none" }` on the menu **content** only (`menu-content.svelte` lines 39, 78, 109), never on an item; `Dialog.Title` takes `level?: 1 | 2 | 3 | 4 | 5 | 6`; the dialog trigger carries `aria-expanded` and `aria-controls` (`dialog.svelte.js` 128 to 129). Our `Field` renders `description` as a string or a snippet inside `FieldDescription` with the context's id (`field.svelte` lines 91 to 95), so `Kbd` elements can sit in it. Our `Button` sizes are `sm`, `icon` (`size-12`) and `icon-sm` (`size-8`). The `(site)` layout wraps every item page in `<main class="mx-auto max-w-5xl px-6 py-12">`.

## Acceptance criteria against evidence

1. **Install, 32 packages, 18 named** — met on paper: no new package; every detected package is already named by an item (INFERRED from decision 4's table and `registry.json`).
2. **Checks and lint** — `svelte-check` is clean over `{@html}` in `<svelte:head>` (EXECUTED); `bun run lint` is prettier only (READ). Countable.
3. **Tokens, `groove-s`, 4 contrast rows** — met: the four rows measure 15.00/12.83, 5.51/6.85, 4.71/5.53, 8.18/7.17 (EXECUTED); the token file holds `primary`/`background` and `muted-foreground`/`card`, which equal two of them (READ).
4. **Registry source: 60 items, types 1/3/2/2/47/5, 10 groups, 42 `meta.stock`, 11 `since`, 17 and 25 files** — met: 49 + 11; 37 + 10 ui; 1 + 1 hook; 34 + 8 stock; the stock counts 18 − 1 and 26 − 1 are right (EXECUTED over the clone). The dependency-name count the spec leaves to the Landing notes is derivable: 27 + `sheet`, `is-mobile`, `tooltip`, `kbd` = **31** (`skeleton`, `field`, `input-group`, `spinner` are already named). Two items name too few dependencies (finding 9).
5. **Registry build: 61 + 61, 14 `tailwind-variants`** — met on paper: 11 + `sidebar` (stock `tv`), `message` and `marker`. Stock `message` imports no `tv` (EXECUTED grep); the 14 holds only because decision 12's `variant` is built with `tv`, which the spec should say (finding 17).
6. **Site build: 61, 61, 79 pages** — met: 61 site pages + 18 views (READ `004`'s Landing table).
7. **Dev server, 60 items** — countable (INFERRED).
8. **60 preview pages** — countable (INFERRED).
9. **Lint: 286 files, 0 violations, 70 bad, 47 good** — **not met as written**: `rtl:-scale-x-100` trips L18 in two items (finding 1). 193 + 93 = 286 and the samples match the suite (EXECUTED).
10. **Merge path, 14 of 14** — met if finding 17's wording is accepted (INFERRED).
11. **Blocks unchanged** — met (INFERRED).
12. **axe: 320 scans** — **not met as written**: the suite scans new item pages at three widths, so 286 + 66 + 12 = **364** (finding 6); and the sidebar page nests a `main` inside the site's `main` (finding 3), which fails `landmark-main-is-top-level` and `landmark-no-duplicate-main` under the `best-practice` tag the suite runs.
13. **Themes: 158 + 2 head-script checks** — met: 79 × 2; the prerendered head holds the script once (EXECUTED in the scratch).
14. **Tokens in the browser, groove reading** — countable (INFERRED).
15. **Keyboard: 62 catalogue, 64 fixture over 32, 31 behaviours** — catalogue 2 + 60 is right. **64 over 32 is wrong** if `SidebarContent` is `tabindex="0"` as decision 10 says: the sidebar fixture then has 4 stops, and the content box precedes the trigger in DOM order (finding 7). **31 is not derivable**: the list in decision 17 enumerates 10 behaviours, 11 if the sidebar's is two, never 12 (finding 8).
16. **Heights, targets, loops, elevation** — 6 heights are listed (INFERRED). The menu item's 32 px holds (`h-8`).
17. **N1, the menu** — met on paper. The ring on items is not suppressed by bits-ui, whose inline `outline: none` is on the content (READ).
18. **N2, N3** — the sheet's 288 px holds (`w-2xs` = 18 rem, EXECUTED); the dialog's geometry holds, but a long body cannot scroll as specified (finding 12).
19. **N4** — met on paper. The ellipsis menu depends on build order (finding 15).
20. **N5** — **not met as written** for the content box's `tabindex` and the preview shell (findings 3, 4, 7).
21. **N6, the theme; viewer 15 of 15** — met: the viewer copies the class by observer and is unaffected by the key change (READ); `pages.ts`'s wait survives (`data-ready` at mount, `aria-pressed` after hydration).
22. **L1 to L4** — **L4 not met as written**: `max-h-3xs` is dead, so the composer has no cap and "the cap at 256 and inner scroll" fails (finding 2). L1's button must be positioned to be seen (finding 5).
23. **Smoke, 8 of 8 × 2** — **not derivable**: decision 17 lists 7 assertions (finding 10).
24. **9, 11, 6 files; 0.5.0; 12 of 12** — met (INFERRED).
25. **Checkpoint and walk** — the walk's 158 = 79 × 2 is right (INFERRED).
26. **Released** — tag `v0.5.0`.

## Findings, most severe first

1. **High — `rtl:-scale-x-100` fails the lint in two items** (decision 7, "`rtl:-scale-x-100` (R16's `cn-rtl-flip` written out)"; decision 9, `BreadcrumbSeparator`'s caret; decision 15, "0 violations").
   Failure: L18 flags any `scale-*` utility after its variants are stripped, and the lint runs over `dropdown-menu-sub-trigger.svelte` and `breadcrumb-separator.svelte`: `lintText` returned `scale [rtl:-scale-x-100]` for both strings (EXECUTED). `literals.test.ts` then reports 2 violations and criterion 9 fails; `002` decision 3 removed `scale` as "fake depth", and the lint cannot tell a mirror from a zoom.
   Fix: write `rtl:rotate-180` on both carets (the sidebar memo §1.4's first option; it compiles to `rotate: 180deg` under `:dir(rtl)` and passes the lint, EXECUTED), or drop the flip, since every page is LTR (the memo's second option). Say which in decisions 7 and 9.

2. **High — `max-h-3xs` emits no CSS, so the composer never stops growing** (decision 13, "`field-sizing-content min-h-16 max-h-3xs overflow-y-auto scrollbar resize-none`… it grows from 64 px to 256 px"; decision 17, L4 "the cap at 256 and inner scroll").
   Failure: Tailwind 4.3.3's container scale is width-only; `max-h-3xs` is absent from a compile of the repository's own stylesheet (EXECUTED), as `max-h-sm` was in the `004` review (finding 8), which `004` decision 15 recorded: "L7's container keywords generate CSS for widths only". The chat memo §3.5 proposed the class without compiling it. A fifty-line message grows the textarea to fifty lines, pushes the log off-screen, and L4 fails.
   Fix: `max-h-(--container-3xs)`. It passes the lint (the token form) and compiles to `max-height: var(--container-3xs)`; Tailwind emits `--container-3xs: 16rem` into `@layer theme` for that candidate alone (EXECUTED), by the "emitted when referenced" rule decisions.md recorded after `004`. State the mechanism and its condition (the composer's file is among Tailwind's sources) as decision 9 of `004` does, and add `max-h-3xs` to decision 15's note so no later item repeats it. Apply the same to any other height cap in the specification (finding 12).

3. **High — The `sidebar` page nests a `<main>` inside the site's `<main>`, and its second example doubles every landmark** (decision 10, "`SidebarInset` renders `<main id="main" tabindex="-1">`"; decision 10's preview, "a full shell… `collapsible="icon"` as a second example"; decision 17, axe "320 scans, 0 violations").
   Failure: every item page renders inside `src/routes/(site)/+layout.svelte`'s `<main class="mx-auto max-w-5xl …">` (READ). A `SidebarInset` on that page is a `main` inside a `main`; axe's `landmark-main-is-top-level` and `landmark-no-duplicate-main` (tag `best-practice`, in `axe.spec.ts`'s `TAGS`) fail, in both themes and at every width. The second example adds a second `nav` named "Main" (`landmark-unique` fails) and a second `id="main"`. The sheet opened at 360 px is scanned too, on the same page.
   Fix: give `SidebarInset` an `element` prop (`"main"` by default, so `006`'s shell gets the landmark; `"div"` with `role="region"` and the label on the preview page), and have the preview's second shell pass a different `label` ("Icon example") and no `id`. Or move the shells into `(view)` routes shown through `003`'s viewer, which the spec already half-proposes; the inset then still needs the prop, since the `(view)` layout supplies its own `<main>`. State the choice in decisions 10 and 16 and scan accordingly.

4. **Medium — The desktop sidebar's `fixed` container cannot sit inside a preview page** (decision 10, "The stock sidebar's structure is kept (provider, sidebar, …)"; the preview "a full shell at the page's width… The page runs at the site's width").
   Failure: stock's desktop branch is a `sidebar-gap` spacer and a `fixed inset-y-0 h-svh` container (sidebar memo §1.2, §2.2), and the memo's scratch ran it in routes of its own at full viewport. On the item page the container escapes the 1024 px column, covers the site header, and stays while the page scrolls past the specimen. The spec says nothing of the container's positioning, so a builder keeps `fixed` and the checkpoint's screenshots show the header under the sidebar.
   Fix: say whether the container stays `fixed` (right for `006`'s shell) and, if so, how the preview contains it: a `(view)` route per shell (as finding 3's second option), or a `position` the provider lets the page set. The sheet at 360 px is a portalled dialog and is unaffected.

5. **Medium — The "Scroll to end" button is placed nowhere, so it is out of view exactly when it is needed** (decision 11, "after the log a `Button variant="secondary" size="icon-sm"` "Scroll to end"… that is `hidden` while the box is at its end").
   Failure: a button rendered after the log inside the scroll box sits at the end of the scrolled content; it becomes visible only when the reader has scrolled away from the end, which is when it is scrolled out of sight. Stock positions its button `absolute … bottom-4` over the viewport (chat memo §1.2). L1's "shown when released" passes while nothing is visible.
   Fix: `sticky bottom-4 ms-auto` inside the region (both classes compile and pass the lint, EXECUTED), or an `absolute bottom-4` button in a `relative` wrapper outside the scroll box; write the classes into decision 11 and have L1 assert the button's rectangle is inside the region's at the moment it is shown.

6. **Medium — The axe count ignores the suite's three widths** (decision 17, "286 + 22 + 12 = 320").
   Failure: `axe.spec.ts` scans every new item page of `003` and `004` at 360, 768 and 1280 (READ, lines 47 to 70), and the sidebar's phone case is the reason this specification needs 360. Eleven pages × 3 widths × 2 themes is 66, not 22: **364** scans, or 320 only if the new pages are scanned at 1280 alone, which the spec would have to say and which would leave the sidebar page unscanned at 360 outside its open sheet.
   Fix: 364 in decision 17 and criterion 12, and `NEW_PAGES_005` in `pages.ts` joined to the width loop as `NEW_PAGES_004` is.

7. **Medium — The sidebar fixture's stop count omits the content box, and its order is wrong** (decision 10, "`SidebarContent` is `flex-1 overflow-auto scrollbar` with `tabindex="0"`"; "Keyboard fixture: 3 stops: the trigger, the first menu button, the second"; decision 17, "64 fixture stops over 32 items").
   Failure: a `tabindex="0"` box is a stop (that is the point of `004` decision 5's pattern), so the fixture holds 4; and the sidebar's `nav` precedes the inset that holds the trigger, so Tab reaches the content box, the two buttons and then the trigger. The fixture test checks each stop's element in order and that the next Tab leaves the fixture.
   Fix: either 4 stops in the DOM's order (content box, button, button, trigger: 65 fixture stops, with the heights and targets counts following), or put the fixture's trigger before the sidebar (a header above the provider, as `006`'s shell will have) and say so. Also say whether the box keeps `tabindex="0"` when the rows inside it are stops anyway: `004`'s rule is for a box a reader could not otherwise reach, and the `nav` with `inert` already leaves the order when collapsed.

8. **Medium — "12 behaviours" is not the number listed** (decision 17, "behaviours: `004`'s 19 plus 12: …"; criterion 15, "31 of 31"; decision 20, "the three theme behaviours of `keyboard.spec.ts`").
   Failure: the list after the colon names 10 behaviours (11 if the sidebar's desktop and 360 px cases are two); decision 20 counts three for the theme where decision 17 counts one. `keyboard.spec.ts` counts its behaviours as tests (19 today, one per test).
   Fix: list the behaviours one per line, numbered, and make the counts in decisions 17 and 20 and criterion 15 equal that list. Note that the catalogue's Space-and-Enter flip of the toggle is a catalogue test, not a behaviour.

9. **Medium — Two items name fewer dependencies than their decisions use** (decision 4's table: `sidebar` names `is-mobile`, `sheet`, `input`, `tooltip`, `skeleton`, `separator`, `button`; `composer` names `field`, `input-group`, `button`, `kbd`, `status`).
   Failure: decision 10 says "The trigger's tooltip shows the shortcut with `Kbd`", so `sidebar-trigger.svelte` imports `kbd`; decision 13 says "at `submitted` it also shows the `Spinner`", so `composer.svelte` imports `spinner` (it cannot use `Button`'s `busy`, which ignores clicks, since Stop must stay actionable). An app that runs `add sidebar` into an empty project gets an import of a file that is not there, and the smoke test's `vite build` fails. `blocks.test.ts` proves this for blocks; nothing does for `registry:ui` items.
   Fix: add `kbd` to `sidebar` and `spinner` to `composer` in decision 4's table, make the distinct-name count 31, and add to `registry.test.ts` the check `blocks.test.ts` 1 makes: every `$UI$/<name>` import in a built `registry:ui` item names an item in its own `registryDependencies`.

10. **Medium — "8 assertions" in the smoke test is 7 as listed** (decision 17, `navigation-add.test.ts`; criterion 23, "8 of 8 in each of 2 scratch apps").
    Failure: the sentence lists the exit code, the files, no `style=`, `groove-s` once, `vite build`, `svelte-check`, and the byte-identical second `add`: seven. `003`'s and `004`'s smoke files number their assertions.
    Fix: number them; add the eighth that `004`'s had and this one lacks (the lint with the repository's rules over the landed files finds 0 violations), or say 7 of 7, 14 in all.

11. **Medium — The stock `message` carries no `tv`, so "14 `tailwind-variants` items" rests on a choice the spec does not state** (decision 2, "`message` (its content variants)"; decision 17, "14 of 14").
    Failure: the live `message` JSON names no package (chat memo §1.1, EXECUTED there) and the clone's seven files import only `svelte/elements` (EXECUTED here). The count holds only if decision 12's `MessageContent` `variant` is written with `tv` from `tailwind-variants/lite`, as `button` is. A builder who writes a plain class map lands at 13 and `utils.test.ts` fails.
    Fix: say in decision 12 that `MessageContent` and `Marker` define their variants with `tv` from `tailwind-variants/lite`, and that `message` therefore names the package by our restyle, not by stock.

12. **Medium — The dialog that "scrolls" has no cap and no overflow, and the cap it could take is finding 2's dead keyword** (decision 8, "`DialogContent` is `fixed inset-x-4 top-1/2 -translate-y-1/2 mx-auto max-w-md p-6 grid gap-6`"; the preview "one named by `label` with a longer body that scrolls").
    Failure: a `top-1/2 -translate-y-1/2` box with no `max-height` grows past the viewport in both directions and nothing scrolls inside it; the natural `max-h-*` keywords are width-only (finding 2) and `max-h-[calc(100dvh-2rem)]` is a literal.
    Fix: `fixed inset-4 m-auto h-fit max-h-full max-w-md overflow-y-auto scrollbar rounded p-6 grid gap-6`: the four insets and `m-auto` centre a box of fitted height on both axes, `max-h-full` is the viewport less 16 px each side, and every class is on the ladder or a keyword (`inset-4` passes L16). N3 then reads `max-height` and `overflow-y` and confirms the centring at 360 and 1280. The sheet's content may want `overflow-y-auto scrollbar` for the same reason.

13. **Low — `ThemeScript` "takes no props" and "passes the `nonce` prop"** (decision 6, bullet 2).
    Failure: the two sentences contradict. SvelteKit's CSP (`kit.csp` in nonce mode) adds nonces to its own inline scripts and never to one written through `{@html}`, so an app with a policy needs the prop.
    Fix: "It takes one optional prop, `nonce`, written onto the script tag; nothing else." Add a test that a `nonce` passed appears once in the built head.

14. **Low — The composer's status after a Stop is ambiguous** (decision 13, "`submitted` → "Responding"; `ready` after `submitted` or `streaming` → "Response complete"; a Stop press → "Stopped"").
    Failure: a Stop press says "Stopped", then the app's status goes `ready` and the same rule says "Response complete", which is false.
    Fix: a Stop press marks the next `ready` as silent; write the four transitions as a table and have L4 read "Responding", "Stopped" and nothing more after the stop.

15. **Low — The breadcrumb's ellipsis menu is built before the menu exists** (decision 20, step 4 `breadcrumb` with N4 "the ellipsis menu", step 5 `dropdown-menu`; decision 9's preview "one with the ellipsis and its menu").
    Fix: move `dropdown-menu` to step 3 beside the sheet (it shares the chrome), or build the breadcrumb page's ellipsis example in step 5 and say so.

16. **Low — The mobile trigger's `aria-controls` names an element that is not in the DOM while the sheet is closed** (decision 10, "`aria-controls` naming the `nav`… on mobile it also carries `aria-haspopup="dialog"`").
    Failure: the `nav` lives inside the portalled sheet, which exists only while open. axe's `aria-valid-attr-value` tolerates a dangling `aria-controls` when `aria-expanded="false"`, so the scan passes, but the spec should say it relies on that, as bits-ui's own trigger does (it sets `aria-controls` to the content's id while closed too, READ `dialog.svelte.js` 129).
    Fix: one sentence in decision 10; N5 checks the reference resolves while open at 360 px.

17. **Low — Small citation and wording slips.**
    - Decision 10: "sidebar memo finding 13" is the memo's §2.6 (the memo has no numbered findings).
    - Decision 3: "`is-mobile`… 8 lines (sidebar memo §3.1)": the memo says 9.
    - Decision 20: "two parts may be deferred": deferring `dialog` shifts 1 item, 11 files, 1 page, 6 axe scans, 2 theme checks, 1 fixture stop and the smoke's file list; say the counts move with it so the Landing notes can reconcile.
    - Decision 10: `SidebarMenuSkeleton`'s random `style` width (sidebar memo §1.4, §1.5) is removed by the lint but replaced by nothing the spec names; say "one width, `max-w-3/4`" or the memo's set by index.
    - Decision 10: `SidebarMenuSub`'s `border-l` keeps a colour the spec does not name; decision 5's rule asks for one (`border-groove-line`, the memo's choice).
    - Decision 11: two names, "Messages" on the region and "Conversation" on the log, are both right and will be read one after the other by a screen reader entering the box; consider one visible heading the log is `aria-labelledby`, or accept the doubling and say so, since no screen reader has been run.

## Constitution checks

- §4.1 source, not a package: `theme`, `message-log` and `composer` are written here; `mode-watcher`, `svelte-sonner` and `@shadcn-svelte/primitives` are refused with reasons the memos support. The head script travels as source and prerenders into the app's own HTML (EXECUTED). Nothing reaches back.
- §4.2 driven by need: every item is named by `006`'s shell or pane (decision 19); `dialog` is the one item with no named consumer, and decision 1 says so and makes it deferrable.
- §4.3 tokens are the one source: holds in every class table once findings 1 and 2 are fixed; `groove-s` is a utility built from the groove tokens; the sidebar's widths are container keywords and a ladder step, with no `style`; no new token. `max-h-(--container-3xs)` reads a Tailwind theme value, which is the mechanism `004` recorded, not a literal.
- §4.4 accessible by default: the contracts (a named menu, a named sheet and dialog, a breadcrumb that is not a disabled link, a sidebar that is a landmark and `inert` when hidden, a named log, a composer that never disables) are the strongest yet; findings 3, 5 and 7 are where the page or the item would contradict them at landing.
- §4.5, §4.6 pinned and named: no package changes; finding 9 is two registry names, not packages.
- §6 never copy: the eight stock items are installed and restyled, which §4.6 allows; the three own items are written from memos that describe the stock's rules and name the cases to prove. The prior art read for this review is cited, not reproduced.

## Verdict

Does not land yet: the two lint-failing carets (1), the dead composer cap (2), the nested `main` and doubled landmarks on the sidebar page (3), the `fixed` container in a preview page (4), the unplaced scroll button (5), and the counts that will not reconcile at landing (6, 7, 8, 10), with the dependency names (9), the `tv` wording (11) and the dialog's cap (12).

## Disposition

Written by the author, the design lead, 2026-11-01. Every finding is fixed in the specification, none answered in writing only.

| # | Disposition |
|---|---|
| 1 | Fixed. Both carets are `rtl:rotate-180` (decisions 7 and 9); decision 15 records that L18 flags the scale form. |
| 2 | Fixed. The composer's cap is `max-h-(--container-3xs)` with the "emitted when referenced" mechanism and its condition stated (decision 13); decision 15 carries the L7 note for every height keyword. |
| 3 | Fixed. `SidebarInset` takes `element` (`main` by default, a labelled `region` otherwise); the preview page's two shells render `div` insets with distinct `nav` labels ("Main", "Icon example") and no `id="main"` (decision 10). |
| 4 | Fixed, as a design call: the sidebar is a `sticky top-0 h-svh` flex child of the provider, never `fixed`; its width is its state (decision 10, recorded in decisions.md). |
| 5 | Fixed. The button is `sticky bottom-4 ms-auto` inside the region; L1 asserts its rectangle lies inside the region's when shown (decision 11). |
| 6 | Fixed. 364 scans; `NEW_PAGES_005` joins the width loop (decision 17, criterion 12). |
| 7 | Fixed. `SidebarContent` has no `tabindex` (its rows are stops); the preview's trigger sits in a bar above the sidebar, so the fixture is 3 stops in DOM order and 64 over 32 holds (decisions 10 and 17). |
| 8 | Fixed. The 12 behaviours are listed one per line; decision 20 names behaviour 1 (decision 17, criterion 15). |
| 9 | Fixed. `kbd` on `sidebar`, `spinner` on `composer`; 31 distinct names; `registry.test.ts` gains the per-item `$UI$` import check (decision 4, criterion 4). |
| 10 | Fixed. Eight numbered assertions, the lint over the landed files the eighth (decision 17). |
| 11 | Fixed. `MessageContent` uses `tv` from `tailwind-variants/lite`; `message` names the package by our restyle (decisions 2 and 12). |
| 12 | Fixed. `DialogContent` is `fixed inset-4 m-auto h-fit max-h-full max-w-md overflow-y-auto scrollbar …`; `SheetContent` scrolls the same way; N3 reads the cap (decision 8). |
| 13 | Fixed. `ThemeScript` takes one optional prop, `nonce`; `theme.spec.ts` checks it (decision 6). |
| 14 | Fixed. The status transitions are a table; a Stop silences the next `ready` (decision 13). |
| 15 | Fixed. `dropdown-menu` builds in step 3 with the sheet and the dialog (decision 20). |
| 16 | Fixed. One sentence on the dangling `aria-controls` while closed; N5 checks it resolves while open (decision 10). |
| 17 | Fixed: §2.6; 9 lines; the deferral's counts; the skeleton's four widths by index; `border-groove-line` on the sub-list; the log's two names accepted, and settable; no screen reader has been run (`decisions.md`, "After the public-readiness review"). |

**Verdict after disposition: fit to build.**
