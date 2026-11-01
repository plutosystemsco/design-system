# An ink surface inside a light page

- **Status:** complete
- **Date:** 2026-11-01
- **Author:** the design lead
- **Question:** An app that wants one dark panel on a light page, such as a run panel that is an ink slab in both themes, writes `class="dark"` on the panel by hand. It needs a sanctioned ink surface. What does a `.dark` subtree inside a light page do with the theme as emitted; what happens to overlays that bits-ui portals to `body`; what is the smallest form of a `surface-ink` under which the code ground sits flush with the surface; what does axe say inside it; and what do the dark text and fill colours measure on the three ink grounds?
- **What it blocks:** specification `007`, the ink surface and the fuller highlight palette, released as `v0.7.0`.

## How to read this memo

Every claim carries a label.

- **EXECUTED**: we ran it and saw the result, on 2026-11-01, macOS (Darwin 25.5.0, arm64), Bun 1.3.14. Browser checks ran in Playwright 1.64.1's Chromium 156.0.8078.4 (build 1248) at 1280 × 900, with `@axe-core/playwright` 4.14.0 (axe-core 4.14.0), both from this repository's `node_modules`. Nothing in this repository was touched except this memo.
- **READ**: a source says so. Each source was read on 2026-11-01. Paths in this repository are at the tag `v0.4.0` (`git show v0.4.0:<path>`). Paths starting `bits-ui/` are relative to `node_modules/bits-ui/dist/` (bits-ui 2.20.2, MIT).
- **INFERRED**: our reasoning.

Scratch work was done in a throwaway folder outside this repository, not kept: `app/` (a copy of `tests/smoke/fixtures/kit3` with the `v0.4.0` items installed from GitHub), `probe.ts` (the Playwright run), `variants.py` and `ref/app-{installed,v1,v2,v4}.css` (the theme variants), `run-variant.sh`, `compile-test.ts` (Tailwind's JS API), `contrast-ink.ts` and `tints.ts` (the arithmetic, on `ref/contrast.ts` copied from `v0.4.0`), and `out/` (14 JSON reports, 142 screenshots, the CSS sizes).

Terms of art.

- **The subtree.** An element that carries the class `dark` inside a page whose `<html>` does not, so the dark theme's variables apply below it and the light theme's above. Today's theme supports it by construction: the dark values sit on the selector `.dark`, and the `dark:` variant is `(&:is(.dark *))` (`001` decision 15).
- **The slab.** A panel with an ink ground in both themes, such as a code-running product's run panel.
- **A reference token.** A variable whose value is another variable, such as `--code-background: var(--muted)`. `004` decision 5 emits the twelve `--code-*` slots this way, in `:root` only.
- **Flush.** The code ground equals the surface it sits on: no inset.
- **Portal.** bits-ui renders an overlay's content under `document.body`, not where its trigger is, so it escapes any ancestor's `overflow` and stacking (`bits-ui/bits/utilities/portal/portal.svelte`).

## In short

- **A `.dark` subtree gets every colour but the twelve code slots.** Inside `<section class="dark bg-background text-foreground">` on a light page, the 48 semantic colours, elevation, scrim, groove, ring and `color-scheme` all compute to the dark values. The twelve `--code-*` references do not: a `var()` in a custom property is substituted on the element that declares it, `:root`, and the substituted light colour is what inherits. The editor is a wash box (`#EAEAE7`) with ink text inside the ink slab, and the code block's tokens are the light palette on the dark `muted` inset: keywords 2.32:1, constants 1.31:1. axe counts 13 nodes (EXECUTED, §1, §4). A `.dark` subtree inside a dark page is stable, three levels deep (§1.4).
- **Copying the twelve references into `.dark` fixes the subtree** (EXECUTED, §3.3): then `--code-background` reads the dark `muted` inside the slab and axe counts 0. `004` decision 5 kept them out of `cssVars.dark` as "saying the same thing twice"; a subtree is the case where it is not.
- **Portalled overlays render in the page's theme.** The popover opened from inside the slab is white on a light page; the tooltip is an ink chip on an ink slab. Three remedies were run: the `Portal` `to` prop (a node inside the slab), `disabled` (render in place) and bits-ui's `BitsConfig defaultPortalTo`. All three keep the dark colours, the position (identical to the pixel), the focus inside and the return of focus on Escape. Passing `class="dark …"` to the content keeps it under `body` and also colours it right (EXECUTED, §2).
- **The code block does not read `--code-background`**; its root is `bg-muted` (READ, `004` decision 8). So a flush code ground needs one class change there, or `class="bg-code-background"` from an app, as well as the surface rule (§3.1).
- **The smallest surface is one plain rule beside `dark`** (§3.4): `.surface-ink { --code-background: var(--background); background-color: var(--background); color: var(--foreground) }`, with the twelve references in `.dark`, used as `class="dark surface-ink"`. Built CSS grows 538 bytes (41 gzipped); every inset keeps its `muted` tint; the editor sits on the slab; axe counts 0 in light and dark, closed and open (EXECUTED). A one-class `surface-ink` costs 97 bytes more and a CLI unknown (§3.5).
- **On ink, every dark text colour passes on every ground**, the tightest `primary` on `muted` at 5.22; every fill passes; the one failure in the table is the light blue `#2456E6` as a mark on `card` (2.71) and `muted` (2.32) (EXECUTED, §5).

## 1. What a `.dark` subtree does today

### 1.1 The fixture (EXECUTED)

The scratch app is `tests/smoke/fixtures/kit3` with `bun install --frozen-lockfile`, `svelte-kit sync`, then `shadcn-svelte add` from `REGISTRY_URL=https://raw.githubusercontent.com/plutosystemsco/design-system/v0.4.0/static/r` for `pluto-theme code-editor code-block meter popover tabs tooltip button input`, then `alert skeleton card`. `dropdown-menu` is not in `v0.4.0` and was left out. The install resolved bits-ui 2.20.2, shiki 4.5.0, `@codemirror/view` 6.43.15, phosphor-svelte 3.1.1, tailwind-variants 3.3.1. The written `app.css` equals the committed `src/app.css` up to hex case and whitespace, plus the twelve `--code-<slot>: var(--code-<slot>)` by-product lines `004` decision 5 records.

One page holds the same fixture twice: once on the page ("paper") and once inside `<section id="ink" class="dark bg-background text-foreground …">`. The fixture is: a paragraph with `text-muted-foreground`, `text-primary`, `text-success`, `text-destructive`; a `code-block` with header, copy button, Python and line numbers; a `code-editor` with `pythonSetup()`; a `line` tab strip and a default (pill) tab strip; a labelled `meter`; `button` default, secondary and ghost; an `input`; a destructive and a success `alert` (the two sanctioned tints, `bg-destructive/10 dark:bg-destructive/20`); a `skeleton`; a hover row and a selected row on `accent`; a `card`; a `groove`; a scroll box with the `scrollbar` utility; a `tooltip` and a `popover`. The page theme comes from `?theme=dark` applied to `<html>` after mount, so one prerendered build serves every run.

The probe reads 58 computed properties on 31 elements per fixture, 27 custom properties on `<html>` and on `#ink`, the four distinct token colours in each editor, the focus ring on a link, four pixels across the groove, the open popover and tooltip, and an axe scan closed and with the popover open, in both page themes.

### 1.2 The variables on `#ink`, light page (EXECUTED)

| Group | Read | Dark value inside the subtree | Light value stays |
|---|---|---|---|
| semantic colours (`--background`, `--foreground`, `--card`, `--muted`, `--muted-foreground`, `--primary`, `--accent`, `--border`, `--input`, `--ring`, `--destructive`, `--success`, `--caution`) | 13 | 12 | 1: `--caution`, `#F0AE12` in both themes by design |
| `--elevation-line`, `--elevation-shadow`, `--scrim` | 3 | 3 | 0 |
| `--groove-line`, `--groove-light` | 2 | 2 | 0 |
| `--mark-1` | 1 | 1 (`#F7F7F4`) | 0 |
| `--code-background`, `--code-keyword`, `--code-string`, `--code-comment`, `--code-active-line` | 5 | 0 | **5**: `#EAEAE7`, `#2456E6`, `#136E3E`, `#4A4F5C`, `#FFFFFF` |
| `--motion-micro`, `--focus-width`, `--line-width` | 3 | same in both | |
| `color-scheme` | 1 | `dark` | |

Read on `.cm-editor` inside the slab: `--muted` `#2B2D32` but `--code-background` `#EAEAE7`. *Why* (INFERRED, confirmed by the fix in §3.3): the custom property `--code-background: var(--muted)` is declared on `:root`. Its computed value is formed there, with `:root`'s `--muted`, and the computed value is what descendants inherit. The `.dark` element redefines `--muted`, but nothing redefines `--code-background` below `:root`, so the light wash inherits through. When `.dark` is on `<html>` itself, both declarations sit on one element and the substitution sees the dark `--muted`; that is why the dark theme works and the subtree does not.

### 1.3 The computed colours, light page (EXECUTED)

Of the 58 readings inside the subtree: 48 differ from the paper fixture and equal the dark page's readings; 4 are transparent in both (`text` and `pre` backgrounds, the line tab strip, the ghost button); **6 stay light**: `.text-code-keyword` `rgb(36, 86, 230)`, `.text-code-comment` `rgb(74, 79, 92)`, `.cm-editor` background `rgb(234, 234, 231)` and colour `rgb(20, 22, 28)`, `.cm-gutters` background `rgb(234, 234, 231)`, `.cm-activeLine` `rgb(255, 255, 255)`. The editor's four token colours are the light four (`#2456E6`, `#14161C`, `#136E3E`, `#4A4F5C`), in the slab as on the paper. The gutter's text and border, read from `--muted-foreground` and `--border` directly, are dark values, so the editor is a wash box with paper line numbers.

Everything else inside the slab is right: the code block's root `bg-muted` `#2B2D32` with paper text; tabs; meter track `#2B2D32`; the primary button `#7A9BFF` with ink text; secondary and input on `#1E2129` with the `#787C8A` border; the alerts at `/20` (Chromium reports `oklab(… / 0.2)`); skeleton, selected row and scroll box on `#2B2D32`; the card `#1E2129`; the groove's hairline `rgba(247, 247, 244, 0.1)` with a transparent light line; the ring `#7A9BFF`; `scrollbar-color` `#787C8A #2B2D32`; `color-scheme: dark`. Screenshot: `out/baseline-light-full.png`.

### 1.4 `.dark .dark` is stable (EXECUTED)

On a dark page the slab's 58 readings equal the paper fixture's, including the five code slots (`--code-background` `#2B2D32`, `--code-keyword` `#7A9BFF`). With the slab wrapped in a second `dark` div (`?nested=1`, three `.dark` levels), the readings are the same. The slab is then invisible against the page: `bg-background` on `bg-background` (`out/baseline-dark-full.png`), which is why a slab on a dark page wants `card` there (INFERRED).

### 1.5 What an app needs from the surface (INFERRED)

- **Today's workaround.** An app writes `class="dark … bg-background text-foreground"` on its panel, with no rule of its own for the panel.
- **The need.** The panel carries `dark`, so every token inside it is the dark theme's. One rule sets its ground and the editor's code ground to the same ink on a light page, or to raised ink, `--card`, on a dark page. Measured, the panel computes `rgb(20, 22, 28)` under light and `rgb(30, 33, 41)` under dark, and `.cm-editor` computes the same background as the panel.
- **The check such an app runs.** In both colour schemes: the panel on the ground above, `.cm-editor` on `rgb(43, 45, 50)` and a keyword at `rgb(122, 155, 255)`. §1.3 says a bare `.dark` subtree gives `rgb(234, 234, 231)` and `rgb(36, 86, 230)` on a light page. So the "one rule" must redeclare the code slots, not only the ground.
- **The design book §03** (READ): "Ink #14161C. All text, code grounds, the icon field. Not pure black." and, on the mark, "Monochrome contexts: all ink, or all paper on dark."

## 2. Portalled overlays escape the subtree

### 2.1 The baseline (EXECUTED)

bits-ui's `Portal` mounts its children into `document.body` by default (`bits-ui/bits/utilities/portal/portal.svelte`, `resolvePortalToProp` fallback `"body"` in `bits-ui/bits/utilities/config/prop-resolvers.js`, READ). The popover opened from inside the slab on a light page: parent `div#bits-1` under `body`, not inside `#ink`; background `#FFFFFF`, text `#14161C`, the light elevation (`rgba(20, 22, 28, 0.1)` hairline, `rgba(20, 22, 28, 0.16)` shadow). The tooltip: `#14161C` chip with paper text, under `body`. On the ink slab that chip has no edge: ink on ink is 1.00:1 (its text still reads at 16.84). On a dark page both are right by accident, since page and slab share a theme.

### 2.2 The options, each run (EXECUTED)

The page takes `?portal=` and passes `portalProps` to both `Popover.Content` and `Tooltip.Content`. The numbers are the ink popover on the light page; the dark page agreed in every cell.

| Option | Where the content lands | Background, text | Elevation line | Position | Focus inside, Escape returns focus |
|---|---|---|---|---|---|
| baseline, portal to `body` | `body > div#bits-1` | `#FFFFFF`, `#14161C` | light | top 618, left 370, width 256 | yes, yes |
| `portalProps={{ to: "#ink-portal" }}`, a `display: contents` div inside the slab | `#ink #ink-portal > div#bits-1` | `#1E2129`, `#F7F7F4` | `#787C8A`, no shadow | top 618, left 370, width 256 | yes, yes |
| `portalProps={{ disabled: true }}` | in place, inside the slab | `#1E2129`, `#F7F7F4` | `#787C8A` | top 618, left 370, width 256 | yes, yes |
| `class="dark bg-popover text-popover-foreground"` on the content | `body > div#bits-1` | `#1E2129`, `#F7F7F4` | `#787C8A` | top 618, left 370, width 256 | yes, yes |
| `<BitsConfig defaultPortalTo="#ink-portal">` around the slab's contents | `#ink #ink-portal > div#bits-1` | `#1E2129`, `#F7F7F4` | `#787C8A` | top 618, left 370, width 256 | yes, yes |

The trigger's bottom edge sat at 844 px of a 900 px viewport, so Floating UI flipped the content above it in every run, and the content's top landed on the same pixel in all five; the clips show the `sideOffset` gap of 4 px between content and trigger (INFERRED from the clips; the probe measured the top edge, not the gap). The tooltip in the `to`, `disabled` and `config` runs landed inside the slab as a paper chip (`#F7F7F4`) with ink text, 4 px above its trigger; with `class="dark bg-foreground text-background"` it stayed under `body` and painted the same. `role="dialog"` and `aria-labelledby` to the title held in all five. No console error in any run. Screenshots: `out/portal-<option>-<theme>-ink-popover.png`.

bits-ui positions with Floating UI's `absolute` strategy by default (`bits-ui/internal/floating-svelte/use-floating.svelte.js` line 11, READ); the content's own `position` reads `static` because the positioned box is the `div#bits-N` wrapper. In the `to` and `disabled` runs the wrapper lives inside the slab and still lands on the same pixel, so an ancestor without `overflow: hidden` and without a `transform` is enough (INFERRED from the result and from how `absolute` resolves against the nearest positioned ancestor; a slab with either property would clip or re-anchor the content, not executed). The fixture's slab has neither. `007` decision 8's item page says a surface must carry no `transform`, `filter` or `contain`.

Two artefacts of the fixture, not findings: `to` and `class` were passed to the paper fixture too, so in those runs the page's own popover also went into the slab or dark; `BitsConfig` wrapped only the slab, and the page's popover stayed white.

### 2.3 Which to use (INFERRED)

- **`BitsConfig defaultPortalTo` around the surface's content** is the one that needs no change to any item and no prop at each call site: every bits-ui portal below it, popover, tooltip, menu, dialog, lands inside the surface and takes its theme. It is the recommendation for an app. The `#ink-portal` node should be the surface element itself or a `contents` child of it, so that `z-50` on the content still stacks above the surface's own children (it did here).
- **`portalProps={{ to }}`** per overlay is the same mechanism, by hand.
- **`disabled`** also works, but a content rendered in place is a child of the trigger's parent in the DOM and in the accessibility tree; with `to` it is a sibling of the surface's last child. Neither changed what axe saw (§4).
- **`class="dark"` on the content** keeps the overlay under `body` and so out of any clipped ancestor, but it repeats the surface's theme by hand at each call site and the content's `dark:` variants then also apply; a modal's scrim (`bg-scrim` at `fixed inset-0`) would still take the page's scrim, not the surface's, since the scrim is a sibling of the content. Not executed here: `dialog` and `sheet` came with `005` (`v0.5.0`), after this memo's tag; §7 records what stands.

## 3. The code ground flush with the surface

### 3.1 Who reads `--code-background` (READ)

- `code-editor-theme.ts` sets `background-color: var(--code-background)` on `&` and `.cm-gutters` (`004` decision 9's table). The editor follows the slot.
- `code-block.svelte`'s root is `bg-muted` (`004` decision 8: "the root is `bg-muted text-foreground rounded overflow-hidden`"). The code block follows `muted`, not the slot. So a surface that moves `--code-background` moves the editor and not the block (EXECUTED in every variant below: the block stays `rgb(43, 45, 50)`).
- Either the item changes that one class to `bg-code-background`, which `@theme inline` already provides (`--color-code-background`, `004` decision 5) and which equals `muted` everywhere else, or an app passes `class="bg-code-background"`, which `cn` lets win (`001` decision 25, test 8: `cn("bg-primary", "bg-destructive")` is `bg-destructive`). The first keeps the rule in one place (INFERRED).

### 3.2 What a surface must keep and what it overrides (INFERRED, checked in §3.4)

Keep, as the `muted` insets `001` decision 8 allows on any ground: the tab strip (`bg-muted` in the pill variant), the skeleton, the meter's track, hover and selected rows (`accent`), the scroll box, the code block when it is an inset in a card or a message. Override: `--code-background` to the surface's ground, and the surface's ground itself. Then `--code-active-line`, which is `card`, is one step above ink on a light page (`#1E2129` on `#14161C`, 1.12:1) and equal to a `card` slab on a dark page. A surface that also sets `--code-active-line: var(--muted)` keeps the active line one step above the ground in both pages (`#2B2D32` on `#14161C` 1.31, on `#1E2129` 1.16; arithmetic EXECUTED, not run in the browser).

### 3.3 The twelve references in `.dark` fix the plain subtree (EXECUTED)

With the `.dark` block carrying the twelve `--code-<slot>: var(--<semantic>)` lines a second time and nothing else changed (`ref/app-v2.css`, run `v2-plain-dark` with `class="dark bg-background text-foreground"`): on a light page `#ink` reads `--code-background` `#2B2D32`, `--code-keyword` `#7A9BFF`; `.cm-editor` `rgb(43, 45, 50)`, its tokens `#7A9BFF`, `#F7F7F4`, `#4CC982`, `#A9ADB8`; the block's keyword `rgb(122, 155, 255)`; axe 0 violations closed and open, light and dark. This is what the check of §1.5 expects. In the registry it is `cssVars.dark` gaining the twelve keys; the CLI then writes them under `.dark` on `add`, and adds no `@theme inline` line, because every key already exists in `cssVars.light` (READ: the updater derives inline names from the union of the keys, `vs()` in `node_modules/shadcn-svelte/dist/index.mjs`).

### 3.4 Four forms, built and measured (EXECUTED)

Each form is `ref/app-<v>.css`, built with `vite build` in the scratch app, served with `vite preview`, and probed in both page themes. Sizes are the one built stylesheet, bytes and gzipped bytes. The baseline is 42,634 / 11,075.

| Form | What changes in the theme | Used as | Built CSS | Result |
|---|---|---|---|---|
| **V1** `@utility surface-ink` re-declaring the 48 dark colours, the 12 references, `--code-background: var(--background)`, `color-scheme`, ground and text; `@custom-variant dark (&:is(:where(.dark, .surface-ink) *))`; `.dark .surface-ink { --background: var(--card) }` | `class="surface-ink"` | 44,368 / 11,153 (+1,734 / +78) | right in both themes, axe 0 × 4. **But only when `surface-ink` appears in a scanned source**: the first build, with the class arriving from the URL, emitted no utility (+128 bytes), and the slab stayed light with a `/20` tint on paper that axe flagged (4 nodes). Same condition as `004`'s finding 4 |
| **V2** the dark block on the selector list `.dark, .surface-ink` with the 12 references; the variant above; a plain rule `.surface-ink { --code-background: var(--background); background-color: var(--background); color: var(--foreground) }`; `.dark .surface-ink { --background: var(--card) }` | `class="surface-ink"` | 43,269 / 11,121 (+635 / +46) | right in both themes, axe 0 × 4; always emitted |
| **V3** as V2 with `[data-surface=ink]` | `data-surface="ink"` | not built; V2 plus the selector's bytes | the variant form compiles (`compile-test.ts`, case C) |
| **V4** `.dark` gains the 12 references only; the same plain `.surface-ink` rule after it; `.dark .surface-ink { --background: var(--card) }`; the variant unchanged | `class="dark surface-ink"` | 43,172 / 11,116 (+538 / +41) | right in both themes, axe 0 × 4; always emitted |

Source deltas in `app.css`: V1 +1,873 bytes, V2 +632, V4 +596.

What V2 and V4 painted, identical to each other (run `v2-surface`, `v4-dark-surface`): light page, slab `rgb(20, 22, 28)`, `.cm-editor` and `.cm-gutters` `rgb(20, 22, 28)`, active line `rgb(30, 33, 41)`, tokens the dark four; the code block `rgb(43, 45, 50)` (§3.1); pill strip, meter, skeleton, selected row and scroll box `rgb(43, 45, 50)`; card, secondary button and input `rgb(30, 33, 41)` with the `#787C8A` border; alerts at `/20`; ring `#7A9BFF`; groove pixels `#14161C, #2A2C32, #14161C`. Dark page, slab `rgb(30, 33, 41)` (`card`), editor and gutters the same, active line `rgb(30, 33, 41)` (equal to the slab, §3.2); the insets `rgb(43, 45, 50)` (1.16:1 on the slab, faint but told by shape: the pill keeps its border, the meter its fill, the row its text); groove pixels `#1E2129, #33363D, #1E2129`. Screenshots `out/v2-surface-{light,dark}-full.png` and the popover and tooltip clips.

### 3.5 What decides between V2 and V4 (READ and INFERRED)

- **Cascade layers.** Tailwind puts an `@utility` into `@layer utilities`; the CLI writes `.dark` unlayered. On one element an unlayered declaration beats a layered one regardless of order, so an `@utility surface-ink` cannot override `--code-background` when `dark` sits on the same element. That is why the flush rule is a plain rule in every form that pairs with `dark` (V2's and V4's `.surface-ink {}`), and why V1 carries the whole dark set itself. Tailwind accepts custom properties in an `@utility` (`compile-test.ts`, case B, EXECUTED).
- **Two `@custom-variant dark` at-rules: the last wins**, no error (`compile-test.ts`, case A: `dark:bg-destructive/20` compiled to `:is(:where(.dark, .surface-ink) *)`). The CLI adds `@custom-variant dark (&:is(.dark *))` only when the stylesheet has no `@custom-variant` at all (`ms()` in `index.mjs`, READ). So a widened variant shipped in `pluto-theme`'s `css` either lands after the CLI's and wins, or lands first and stops the CLI adding its own; both end right. Whether to widen at all: not for contrast. The `/10` tints on ink pass without it: destructive text on `destructive/10` over ink 6.29, over `card` 5.52; success 7.25 and 6.34 (EXECUTED, `tints.ts`). V4 leaves the variant alone, since `dark` is on the element.
- **The CLI and a selector list.** On every `add` the CLI writes `cssVars.dark` into each rule whose selector list contains `.dark` exactly (`walkRules`, `e.selectors.includes(".dark")`, READ), so a rule `.dark, .surface-ink {}` would be maintained, and `.dark .surface-ink {}` would not be touched. But the CLI creates the `.dark` rule itself from `cssVars.dark`, and a `.dark, .surface-ink` rule can only come from `css`; whether `css` is written before or after `cssVars` on a fresh app, and so whether an app ends with one rule or two, was not run (§7). V4 has no such question: `.dark` stays the CLI's rule and `surface-ink` is a plain rule the CLI copies verbatim.
- **`.dark .surface-ink` in `css`.** `001` decision 15 forbids `:root` and `.dark` as a selector *nested inside an at-rule* in `css`; this rule is top-level and the CLI's match is exact, so it is safe by the letter and by the code. It could also be an app's own line.

**The smallest form, as recommended:** V4, three changes. (1) `cssVars.dark` gains the twelve references. (2) `pluto-theme`'s `css` gains `.surface-ink { --code-background: var(--background); --code-active-line: var(--muted); background-color: var(--background); color: var(--foreground) }` and `.dark .surface-ink { --background: var(--card) }`. (3) `code-block`'s root reads `bg-code-background`. The contract an app is given: "an ink surface is `class="dark surface-ink"`; inside it the code ground is the surface's `--background`, which is ink on a light page and `card` on a dark one; set `--background` on the surface to move both." V2 gives the same for one class at 97 bytes more and the CLI unknown. `007` decision 8 takes V4.

## 4. axe inside the surface

The tags are `tests/e2e/axe.spec.ts`'s: `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`, `best-practice`. Each run scans the whole page (both fixtures) closed, then with the slab's popover open. The scratch page's first run lacked a `<title>` and axe said so (`document-title`); a title was added and that row is not counted below.

| Run | Light, closed | Light, popover open | Dark, closed | Dark, open |
|---|---|---|---|---|
| baseline, `.dark` subtree | 1 violation: `color-contrast` (serious), 13 nodes, all in `#ink-code-block`: `.text-code-keyword` `#2456E6` on `#2B2D32` 2.32; `.text-code-constant` and `.text-code-function` `#14161C` on `#2B2D32` 1.31 | the same 1 / 13 | 0 | 0 |
| portal `to`, `disabled`, `class`, `config` (4 runs) | 1 / 13 each, the same nodes | 1 / 13 | 0 | 0 |
| nested `.dark .dark .dark` | 1 / 13 | 1 / 13 | 0 | 0 |
| V2 plain `.dark` with the references | 0 | 0 | 0 | 0 |
| V2 `surface-ink` | 0 | 0 | 0 | 0 |
| V4 `dark surface-ink` | 0 | 0 | 0 | 0 |
| V1 `surface-ink` (utility emitted) | 0 | 0 | 0 | 0 |
| V1, utility not emitted | 1: `color-contrast`, 4 nodes in `#ink-alert-destructive` (`#C42A1F` on a `/20` red tint over paper) | 1 / 4 | 0 | 0 |

43 rules passed closed and 44 open in every run. axe never flagged the editor's wash box (ink on `#EAEAE7` is 15.00:1) nor the ink tooltip chip on the ink slab (paper text on ink passes); those are visual faults, not contrast failures (EXECUTED).

## 5. Contrast on ink, for the palette memo

With `contrastRatio` from `scripts/contrast.ts` at `v0.4.0` (WCAG 2.2 relative luminance, truncated to two decimals; EXECUTED, `contrast-ink.ts`). The grounds are the dark `background` `#14161C`, `card` `#1E2129` and `muted` `#2B2D32`.

| Colour | Hex | On `#14161C` | On `#1E2129` | On `#2B2D32` | Needs |
|---|---|---|---|---|---|
| `foreground` | `#F7F7F4` | 16.84 | 14.99 | 12.83 | 4.5 |
| `muted-foreground` | `#A9ADB8` | 8.05 | 7.17 | 6.13 | 4.5 |
| `primary` | `#7A9BFF` | 6.85 | 6.10 | 5.22 | 4.5 |
| `success` | `#4CC982` | 8.59 | 7.65 | 6.55 | 4.5 |
| `destructive` | `#FF7D73` | 7.26 | 6.46 | 5.53 | 4.5 |
| `caution` (amber) | `#F0AE12` | 9.27 | 8.25 | 7.06 | 3 |
| `destructive-fill` | `#FF7D73` | 7.26 | 6.46 | 5.53 | 3 |
| `success-fill` | `#4CC982` | 8.59 | 7.65 | 6.55 | 3 |
| `mark-1` to `mark-4`, dark value (paper) | `#F7F7F4` | 16.84 | 14.99 | 12.83 | 3 |
| `mark-1`, light value (blue) | `#2456E6` | 3.05 | **2.71 fail** | **2.32 fail** | 3 |
| `mark-2`, light value (red) | `#E23A2E` | 4.20 | 3.73 | 3.20 | 3 |
| `mark-3`, light value (amber) | `#F0AE12` | 9.27 | 8.25 | 7.06 | 3 |
| `mark-4`, light value (green) | `#1E9E56` | 5.23 | 4.66 | 3.98 | 3 |
| `input`, `elevation-line` | `#787C8A` | 4.34 | 3.86 | 3.31 | 3 |

Every dark text colour passes on every ground; the tightest is `primary` on `muted`, 5.22. Every fill passes. The only failures are the light blue as a coloured dot on `card` and `muted`, which bears on the icon's coloured dots on ink: the light blue dot would need the ink ground itself (3.05, no margin). The answer: the four-dot mark on ink uses the lifted primitives for its dots, and the lifted blue `#7A9BFF` measures 6.85, 6.10 and 5.22 on the three grounds (the `primary` row above; `decisions.md`, "After the public-readiness review"). Amber as text is still refused by the design book, whatever it measures.

For the record of what the subtree bug paints (same run): the light `foreground` `#14161C` on the three grounds 1.00, 1.12, 1.31; light `muted-foreground` 2.20, 1.96, 1.68; light `primary` 3.05, 2.71, 2.32; light `success` 2.86, 2.55, 2.18; light `destructive` 3.18, 2.83, 2.42. All fail 4.5. Among the grounds: `card` on `background` 1.12, `muted` on `background` 1.31, `muted` on `card` 1.16.

## 6. The groove, the ring and the scrollbar on ink

All inside the `.dark` subtree on a light page, the baseline run (EXECUTED).

- **The groove.** Four pixels read down a column through the `groove` element (one above the border, the border, two below): paper `#F7F7F4, #DFDFDE, #FFFFFF, #F7F7F4` (the 10% ink hairline, then the 1 px white line); the slab `#14161C, #2A2C32, #14161C, #14161C`. The subtree gets the dark value: `--groove-light` is `#00000000`, so there is no light line, and the hairline is paper at 10% over ink, `#2A2C32`, 1.29:1 against the slab. On the `card` slab of the dark page (V2) the hairline reads `#33363D`. The code block's content groove computed the same `rgba(247, 247, 244, 0.1)` border with a transparent inset shadow.
- **The ring.** A link inside the slab, reached by Tab, matched `:focus-visible` with `outline: 2px solid rgb(122, 155, 255)` at `outline-offset: 2px`: the dark `ring`, 6.85:1 on ink, 5.22 on `muted`. The paper link's ring was `rgb(36, 86, 230)`. The editor's `&.cm-focused` outline reads the same `--ring` (READ, `004` decision 9) and was not focused in the probe.
- **The scrollbar.** `scrollbar-color` on the scroll box, the code block's `pre` and the editor's `.cm-scroller` inside the slab: `rgb(120, 124, 138) rgb(43, 45, 50)`, the dark `input` on the dark `muted`, 3.31:1. `color-scheme` on the slab is `dark`, so a native control or scrollbar inside it is drawn dark by the engine. Not measured in pixels: macOS draws overlay scrollbars only while scrolling (§7).

## 7. What this memo does not settle

- **A modal's scrim from inside a surface.** `dialog` and `sheet` were not in `v0.4.0`; they landed with `005` as `v0.5.0`. What stands: `007` decision 8 keeps a modal the page's. A dialog or sheet opened from inside the surface passes `portalProps={{ to: "body" }}` and takes the page's theme and the page's scrim. `007`'s surface fixture proves it: with the dialog open, its content is under `body` with the light `popover` colour (test S1), and the build checkpoint saw the dialog white over the page's scrim (`decisions.md`, "After the `007` build's checkpoint"). A non-modal overlay brought inside by `BitsConfig` needs a surface with no `transform`, `filter` or `contain` (INFERRED); the item page says so.
- **The CLI's order of `css` and `cssVars`** on a fresh `add pluto-theme`: settled by `007`'s smoke check. `.surface-ink {` lands after `.dark {`, each of the two rules once, and a second `add pluto-theme` leaves the file byte-identical (`007` decision 10, criterion 17). Whether a `.dark, .surface-ink` rule in `css` would end as one rule or two (§3.5) was not run; `007` took V4, which does not depend on it.
- **Firefox and WebKit** were not run; the memo is Chromium only. This release checks Chromium only; Firefox and Safari are outside its checks (`decisions.md`, "After the public-readiness review"). `scrollbar-color` and `color-scheme` on native controls differ by engine.
- **Native scrollbar pixels** on ink were not sampled: macOS draws overlay scrollbars only while scrolling.
- **An app that narrows `@source`**: a `surface-ink` emitted as an `@utility` needs the class in a scanned file (V1's first run); a plain rule does not. `007` ships plain rules, so the surface is always emitted.
- **A fullPage screenshot** of the dark page showed the slab editor's gutter numbers stacked at the top (`out/baseline-dark-full.png`). The viewport screenshots and every computed reading were normal, so this memo reads it as a capture artefact.

## Sources

- `AGENTS.md`, `context/constitution.md`, `context/README.md`, `context/decisions.md` ("A fourth ground for `muted`, insets only", 2026-10-27; "The design calls for `004`", 2026-10-31; "The theme mechanism…", 2026-11-01). Read 2026-11-01.
- `context/specifications/001-tokens-and-the-registry.md`, decisions 8, 12, 13, 15, 25; `context/specifications/002-the-primitives-forms-surfaces-and-feedback.md`, decision 7; `context/specifications/004-code-and-data.md`, decisions 5, 8, 9. Read 2026-11-01.
- `src/app.css`, `scripts/build-tokens.ts`, `scripts/contrast.ts`, `scripts/tokens.ts`, `tokens/pluto.tokens.json`, `tests/e2e/axe.spec.ts`, all at `v0.4.0`. Read 2026-11-01.
- `context/research/2026-10-31-the-data-items-chart-popover-accordion-toggles-scroll-area-and-a-meter.md`, for the memo's form. Read 2026-11-01.
- The installed items in the scratch app (from `static/r` at `v0.4.0` on GitHub): `code-block/code-block.svelte`, `code-editor/code-editor-theme.ts`, `popover/popover-content.svelte`, `popover/popover-portal.svelte`, `tooltip/tooltip-content.svelte`, `tabs/tabs-list.svelte`, `tabs/tabs-trigger.svelte`, `meter/meter.svelte`, `alert/alert.svelte`, `skeleton/skeleton.svelte`, `button/button.svelte`. Read 2026-11-01.
- bits-ui 2.20.2: `bits/utilities/portal/portal.svelte`, `bits/utilities/portal/types.d.ts`, `bits/utilities/config/prop-resolvers.js`, `bits/utilities/config/types.d.ts`, `internal/floating-svelte/use-floating.svelte.js`. Read 2026-11-01.
- shadcn-svelte 1.7.1 CLI, `node_modules/shadcn-svelte/dist/index.mjs` (minified; the functions around the constants `` ds=`.dark`,fs=`:root` ``: `ps`, `ms`, `hs`, `gs`, `vs`). Read 2026-11-01.
- Tailwind CSS 4.3.3, `compile` from `tailwindcss/dist/lib.js`, run in `compile-test.ts`. 2026-11-01.
- The Pluto Systems design book, §02 and §03. Read 2026-11-01.

**In one line:** a `.dark` subtree inside a light page gets every colour, the elevation, the scrim, the groove, the ring and `color-scheme`, but not the twelve `--code-*` references, which are substituted at `:root` and inherit as light colours, so the editor is a wash box and the code block's tokens fail axe 13 times; copying the twelve into `.dark` fixes it; overlays portal to `body` and render in the page's theme, and `BitsConfig defaultPortalTo` (or `Portal to`, or `disabled`) brings them inside with the same position, focus and Escape; the code block reads `bg-muted`, not the slot; and the smallest ink surface is the twelve references plus one plain `.surface-ink` rule used beside `dark`, 538 bytes of built CSS, with every inset kept, the editor flush, and axe at 0 in both page themes.
