# 002 — The primitives: forms, surfaces and feedback

- **Status:** built, reviewed and released as `v0.2.0` (`7857ea4`). Built 2026-10-28; amended 2026-11-01 (R23 and R24, decision 9). The change review is [`../reviews/002-the-primitives-forms-surfaces-and-feedback-pr-2026-10-28.md`](../reviews/002-the-primitives-forms-surfaces-and-feedback-pr-2026-10-28.md), all 12 findings dispositioned
- **Date:** 2026-10-28
- **Author:** the design lead
- **Kind:** 26 stock components installed and restyled to the tokens; two new tokens; a stronger literal lint; a preview page per item; the 0.2.0 release
- **Depends on:** [`001`](./001-tokens-and-the-registry.md), released as `v0.1.0` (`33e94de`). Decision 4 says what that means for the install.
- **Blocks:** `003`, the first blocks (decisions.md, 2026-10-28).
- **Research:** [`../research/2026-10-28-the-primitives-the-blocks-and-the-home-page-need.md`](../research/2026-10-28-the-primitives-the-blocks-and-the-home-page-need.md) (cited as *primitives memo*); [`../research/2026-10-28-the-blocks-patterns-and-accessibility.md`](../research/2026-10-28-the-blocks-patterns-and-accessibility.md) (*patterns memo*); [`../research/2026-10-28-blocks-how-they-are-declared-installed-and-previewed.md`](../research/2026-10-28-blocks-how-they-are-declared-installed-and-previewed.md) (*blocks memo*); from `001`: [`../research/2026-10-27-the-foundation-run-kit-3-fonts-and-the-theme-item.md`](../research/2026-10-27-the-foundation-run-kit-3-fonts-and-the-theme-item.md) (*run memo*) and [`../research/2026-10-27-the-toolchain-under-bun.md`](../research/2026-10-27-the-toolchain-under-bun.md) (*toolchain memo*); the owner's and design lead's calls in [`../decisions.md`](../decisions.md), above all "The primitives split in two, and the design calls for `002`" (cited as *the split decision*); the Pluto Systems design book, cited by section as *the design book*.

## Intent

`001` built the tokens and the registry's foundation. This specification fills the registry with the first 26 components. They are the forms, surfaces and feedback that the first blocks (`003`) and an app's first pages share.

Each component comes from shadcn-svelte's own registry. We install it with this repository's locked CLI, then restyle it to our tokens and to the design book. An app that installs one gets our source, with its whole dependency tree served from here.

It builds five things.

1. **26 registry items**, restyled by one checklist (decision 9).
2. **Two tokens**, an elevation shadow and a scrim, through the token file and the `pluto-theme` item (decision 7). With them come two focus utilities and two motion keyframes that replace `tw-animate-css` (decisions 3 and 8).
3. **A stronger lint.** `001`'s lint misses most of what the stock items get wrong (primitives memo §5.2). It gains 14 rules (decision 21).
4. **A preview page per item**, and a catalogue grouped by kind (decision 22).
5. **Tests**, extending `001`'s pattern to the new items, and the **0.2.0 release** with its changelog entry (decisions 23, 25, 26).

Terms used throughout. `001`'s terms (registry, item, `add`, token, primitive colour, semantic token, ground, preview page, catalogue, scratch app) keep their meanings.

- **Primitive** here means a component item, such as `button`, as in the primitives memo. A raw colour token is called a *primitive colour* when the two could be confused.
- **Stock item:** an item from shadcn-svelte's own registry, `https://shadcn-svelte.com/registry/styles/maia/<name>.json`.
- **Restyle:** editing an installed stock item's classes, markup and props until it passes decision 9's checklist and the lint.
- **bits-ui:** the headless Svelte library most stock items wrap. *Headless* means it gives behaviour and ARIA, not looks.
- **Variant:** a named look of one component, chosen by a prop, such as `variant="secondary"`.
- **Line box:** the height one line of text takes: font size times line height. `text-base` is 16 px × 1.6 = 25.6 px.
- **Control:** a component a person operates: button, input, select, checkbox, radio, switch, code input, tab.
- **Scrim:** the dimmed layer behind a modal dialog.
- **Elevation:** the shadow and edge that lift a surface above the page. The design book §05 allows it for menus and dialogs only.
- **Live region:** an element whose changes a screen reader announces without moving focus.
- **Keyboard stop:** an element that Tab focuses.
- **Fixture:** a section of a preview page built for a test to measure.
- **Allowlist:** a fixed list of files in which the lint permits one otherwise forbidden class.

## Decisions

Each choice, with its reason. Where the split decision already decided something, this specification cites it and does not decide it again.

### 1. Scope: 26 items, in five groups, and nothing else

The 26 are fixed by the split decision: button, card, badge, alert, empty, skeleton, spinner, separator, item, kbd, switch, collapsible, native-select, tooltip, avatar, field, label, input, textarea, input-group, checkbox, radio-group, alert-dialog, tabs, table, input-otp.

- *Why these:* they are what the first blocks and an app's home page share (split decision; primitives memo §6.1; blocks memo §2.1 for the auth blocks' `card`, `field`, `button`, `input`, `input-otp`).
- **Not in this specification**, each by the split decision: `code-block`, the highlight palette, `chart`, `popover`, `accordion`, `toggle`, `scroll-area` and the editor tabs (`004`); `dropdown-menu`, `sheet`, `sidebar`, `breadcrumb`, `sonner`, `mode-watcher` and the chat primitives (`005`); the blocks (`003`, `006`); the icon files and deployment.
- **The registry then holds 32 items**: `001`'s 6 and these 26.

### 2. The packages, named and pinned

Versions read with `bun pm view` on 2026-10-28 (primitives memo §4, EXECUTED). `001` decision 4's two specifier rules apply unchanged: a package an item names gets a caret range at the tested version, and the item names the same range.

| Package | `bun.lock` | Specifier | Licence | Named by |
|---|---|---|---|---|
| `bits-ui` | 2.20.2 | `^2.20.2` | MIT | tooltip, separator, tabs, collapsible, avatar, alert-dialog, label, checkbox, radio-group, switch, input-otp |
| `@internationalized/date` | 3.12.4 | `^3.12.4` | Apache-2.0 | every item that names `bits-ui` |
| `tailwind-variants` | 3.3.1 | `^3.3.1` | MIT | button, item, tabs, alert, badge, empty, field, input-group |
| `phosphor-svelte` | 3.1.1 | `^3.1.1` | MIT | spinner, native-select, checkbox, input-otp |

`package.json` then names 23 packages: `001`'s 19 and these 4.

- **Why `@internationalized/date`.** bits-ui peers on it (`^3.8.1`). `registry build` adds a detected package's non-optional peers to the item, at the version our `package.json` holds, and drops a peer we do not hold (READ: `resolvePeerDeps` and `resolvePeerVersions` in `cli/src/commands/registry/deps-resolver.ts`). Stock items name it for the same reason (primitives memo §4). So we hold it, and each bits-ui item names it.
- **How the ranges reach the items.** `build` copies our `package.json` specifier into each item that imports the package (`001` decision 4). So the items will name `^2.20.2`, not the stock `^2.20.0`. *Why our caret, not stock's:* we test at 2.20.2. A range that admits an untested older release would let an app keep one.
- **No `tailwind-merge`, and `cn` is the one merge engine.** `tailwind-variants` 3.3.1 lists `tailwind-merge` as a peer, but marks it optional (EXECUTED by this author, `bun pm view tailwind-variants@3.3.1 --json`, 2026-10-28), and `build` ignores optional peers (READ, `deps-resolver.ts`). But its main entry bundles its own copy of tailwind-merge's engine and merges by default: `tv` given `px-3` and `px-4` returned `px-4` with no `tailwind-merge` installed (review of `002`, finding 7, EXECUTED). Its `tailwind-variants/lite` entry does not merge: the same call returned `px-3 px-4` (same run).
  - **So every item imports `tv` from `tailwind-variants/lite`.** Every stock component already passes `tv()`'s result through `cn` (READ, built `button.json`), so `cn` then does all merging, as `001` decision 20 intends. *Why:* two engines with different class tables would merge every variant class twice, and our custom classes (`tracking-mark`, `shadow-elevation`, `focus-ring`) would depend on both agreeing.
  - `VariantProps` is a type. If `lite` does not export it, the item imports it with `import type { VariantProps } from "tailwind-variants"`, which the compiler erases, so no engine is loaded. `svelte-check` decides which.
  - `build` detects the package from the `tailwind-variants/lite` import by its prefix (INFERRED from the resolver's deep-import matching, `deps-resolver.ts`); `registry.test.ts` checks that the 8 items still name it.
  - `utils.test.ts` proves `cn` is the engine (decision 23).
- **No `tw-animate-css`.** Decided by the split decision. Decision 3 says what replaces it.
- **`phosphor-svelte`, not `@phosphor-icons/svelte`.** The second does not exist on npm (primitives memo §3.1, EXECUTED). Icons are the split decision's call.
- **The specifiers are set after the install, in this order.** The stock install (decision 4) writes the stock ranges (`^2.20.0`) and whatever `phosphor-svelte` range the CLI picks. For each of the four packages the builder then:
  1. runs `bun add -d <name>@<exact version>`, so `bun.lock` resolves the version in the table even if a newer patch has appeared;
  2. edits the specifier in `package.json` to the caret range in the table;
  3. runs `bun install`, and checks that `bun.lock` still resolves the exact version.
  *Why this order:* `bun add` rewrites the specifier it is given. Setting the caret last leaves the range `deps.test.ts` expects, with the lock still on the tested version.

### 3. Motion without `tw-animate-css`

Two stock items in scope animate with `tw-animate-css` classes: `tooltip` and `alert-dialog` (EXECUTED by this author over the built maia JSON: `animate-in`, `fade-in-0`, `zoom-in-95`, `slide-in-from-*`). Two more loop: `skeleton` (`animate-pulse`) and `input-otp` (`animate-caret-blink`, `duration-1000`).

- **`pluto-theme` gains two keyframes and two animation tokens**, emitted by `build-tokens` (decision 7's emission list):
  - `@keyframes pluto-enter { from { opacity: 0 } }` and `@keyframes pluto-exit { to { opacity: 0 } }`, in `css`;
  - `--animate-enter: pluto-enter var(--motion-micro) cubic-bezier(0.2, 0.7, 0.3, 1)` and `--animate-exit: pluto-exit var(--motion-micro) cubic-bezier(0.2, 0.7, 0.3, 1) forwards`, in `cssVars.theme`. Tailwind makes them the utilities `animate-enter` and `animate-exit`.
- **Opening is a fade in, closing a fade out, over `--motion-micro` (200 ms).** No zoom, no slide. *Why:* the design book §06 allows response motion at most 200 ms; a fade is the least motion that still shows the change. The design book §05 refuses "fake depth", and a zoom from 95% is depth.
- **Why the curve is written out, not `var(--ease-entrance)`:** `--ease-entrance` lives in `@theme inline`, and Tailwind inlines those values without emitting them as variables (`001` decision 15). A `var()` to it would be undefined at run time. `--motion-micro` is in `:root`, so the `var()` resolves, and under reduced motion it reads 0 ms (`001` decision 14).
- **Why the `pluto-` prefix on the keyframes:** `tw-animate-css` defines keyframes named `enter` and `exit`. An app that ran the stock `init` has them. Our names cannot collide.
- **The skeleton is static.** No `animate-pulse` (split decision).
- **The code input's caret does not blink.** It is a solid 2 px bar on the active cell. *Why:* a blinking caret loops while a person reads, which the design book §06 bans (patterns memo §5.3).
- **The spinner keeps `animate-spin`.** It is functional progress on the one busy control (split decision). Under reduced motion, `001`'s catch-all stops it after one turn of 0.01 ms, leaving the static icon.
- **bits-ui and the exit fade.** bits-ui keeps closing content mounted while its exit animation runs, as it does for `tw-animate-css`'s `animate-out` (INFERRED: the stock items rely on it). The browser test proves the dialog is removed after close (decision 23).

### 4. The install procedure, under Bun

`001` decision 29 fixed the approach: install each stock item with this repository's locked CLI under Bun, never with `-o`, then restyle. This decision makes it a procedure a builder can follow and a reviewer can check.

1. **Snapshot the whole working tree first.** `001` is committed and tagged `v0.1.0` (decision 25), so `git` can recover its files. The snapshot is taken all the same, because the restyled files of this specification are not committed while the build runs. The builder lists every file with `git ls-files -co --exclude-standard` (which includes untracked files) and records each one's SHA-256 outside the tree, in the builder's working notes, not kept.
2. **Install all 26 at once, before any restyle**, from the repository root:
   `bun --bun node_modules/.bin/shadcn-svelte add button card badge alert empty skeleton spinner separator item kbd switch collapsible native-select tooltip avatar field label input textarea input-group checkbox radio-group alert-dialog tabs table input-otp -y`
   - No `-o`. `-y` answers the "proceed?" prompt only.
   - *Why one run:* `field` depends on `label` and `separator`, `input-group` on `button`, `input` and `textarea`, and `alert-dialog` on `button` (blocks memo §1.4, EXECUTED against the live registry). Installed one by one, a later `add` would offer to overwrite an earlier, already restyled file. In one run, each lands once.
   - *Why `utils` is safe:* no stock item lists `utils` as a registry dependency (blocks memo §1.4, EXECUTED). So `add` does not write `src/lib/utils.ts`. `001`'s worry about `-o` overwriting it remains a rule, not a risk.
   - If the CLI asks to overwrite any file, the answer is no.
3. **Check what moved, against the snapshot, not git.** The builder lists and hashes the tree again and compares. The only differences allowed are: new files under `src/lib/registry/ui/<name>/` for the 26 names, and changed `package.json` and `bun.lock`. Every other file must hash the same, `src/lib/utils.ts` and `src/app.css` included. Anything else is restored from a copy taken with the snapshot before work goes on. *Why:* stock items carry no `css` or `cssVars` (EXECUTED by this author over the 26 built JSON files), so `add` has no reason to touch `src/app.css`.
4. **Pin the packages** as decision 2's last bullet says, then `bun install`.
5. **Record provenance** (decision 5) the same day.
6. **Restyle** each item by decision 9's checklist, in decision 27's order. The restyle also makes every `#lib` import extensionless: stock files import `$UTILS$.js` and `$UI$/<name>/index.js` (review finding 13, READ in the built JSON), and `001` decision 2 keeps the `.js` form out of our files because it travels into every app.
7. **List each item in `registry.json`** (decision 6).

The CLI prints its "unsupported runtime" warning under `--bun` and continues (`001` decision 1). That is expected.

### 5. Provenance: which stock version each item came from

A stock item's JSON has no version field (primitives memo §3.1). Without a record, a reviewer cannot tell what was restyled from.

- Each of the 26 items in `registry.json` carries `meta.stock`:
  ```json
  "stock": {
    "registry": "https://shadcn-svelte.com/registry/styles/maia",
    "item": "button",
    "cli": "1.7.1",
    "date": "2026-10-28",
    "sha256": "<64 lowercase hex digits>"
  }
  ```
- `cli` is the version of the locked CLI that ran the install. `date` is the install date. `sha256` is the SHA-256 of the item's JSON bytes, fetched with `curl -s <registry>/<item>.json` on the install date.
- *Why the JSON, not the installed files:* the JSON is the upstream item's identity. The installed files have already been through `add`'s transforms (icons, aliases), which depend on our `components.json`.
- *Why `meta`:* `meta` survives `registry build` into the item JSON and `index.json`; `categories` and `docs` do not (blocks memo §1.3, EXECUTED). It is free-form in the schema.
- **The builder also records, in the Landing notes**, which of the 26 live JSON files differ from the prior-art clone's `docs/static/registry/styles/maia/<name>.json` at `6149e14`. The primitives memo could not say whether the live registry had moved (its §7).
- `registry.test.ts` checks the shape: 26 of 26 items with all five fields, `cli` equal to the locked CLI's version, `date` an ISO date, `sha256` 64 hex digits.

### 6. The registry entries

- **Order and groups.** Items are listed in this order, and each carries `meta.group`. The catalogue groups by it (decision 22).

| # | Group | Items |
|---|---|---|
| 1–6 | `foundation` | `pluto-theme`, `font-geist`, `font-heading-ibm-plex-sans`, `font-jetbrains-mono`, `utils`, `four-dot` (`001`'s six get `meta.group` too) |
| 7–9 | `actions` | `button`, `tooltip`, `kbd` |
| 10–16 | `surfaces` | `card`, `separator`, `item`, `table`, `tabs`, `collapsible`, `avatar` |
| 17–22 | `feedback` | `alert`, `alert-dialog`, `badge`, `empty`, `skeleton`, `spinner` |
| 23–32 | `forms` | `label`, `field`, `input`, `textarea`, `input-group`, `native-select`, `checkbox`, `radio-group`, `switch`, `input-otp` |

- *Why groups by kind:* 32 cards in one list is hard to scan. A reader looks for "a form control" or "something that shows state". The groups match the split decision's own words, "forms, surfaces and feedback", plus actions and the foundation.
- **Every new item is `registry:ui`**, with `title`, a one-sentence `description`, `001`'s `author`, and `meta: { "since": "0.2.0", "group": …, "stock": … }`.
- **Every new item names `utils` and `pluto-theme`** in `registryDependencies`, as `four-dot` does. *Why:* every stock component imports `cn` and the prop-type helpers from `utils` without declaring it (blocks memo §4.3, EXECUTED). And every one now uses token classes that only `pluto-theme` defines. Naming both makes one `add` sufficient in an empty app (constitution §4.6).
- **Our own dependencies are bare names**, never URLs or `local:`. Every name resolves in our index, because the CLI never falls back to the stock registry (blocks memo §1.4; split decision).
- **Files, dependencies and packages, per item.** The file list is the stock item's, with three changes, each explained in decision 19 or its item's decision: `avatar` drops `avatar-badge.svelte`; `field` adds `field-context.svelte.ts`; `input-group` adds `input-group-password.svelte`.

| Item | Files | `registryDependencies` beyond `utils`, `pluto-theme` | Packages detected |
|---|---|---|---|
| `button` | 2 | `spinner` | `tailwind-variants` |
| `tooltip` | 6 | | `bits-ui`, `@internationalized/date` |
| `kbd` | 3 | | |
| `card` | 8 | | |
| `separator` | 2 | | `bits-ui`, `@internationalized/date` |
| `item` | 11 | `separator` | `tailwind-variants` |
| `table` | 9 | | |
| `tabs` | 5 | | `bits-ui`, `@internationalized/date`, `tailwind-variants` |
| `collapsible` | 4 | | `bits-ui`, `@internationalized/date` |
| `avatar` | 6 | | `bits-ui`, `@internationalized/date` |
| `alert` | 5 | | `tailwind-variants` |
| `alert-dialog` | 13 | `button` | `bits-ui`, `@internationalized/date` |
| `badge` | 2 | | `tailwind-variants` |
| `empty` | 7 | | `tailwind-variants` |
| `skeleton` | 2 | | |
| `spinner` | 2 | | `phosphor-svelte` |
| `label` | 2 | | `bits-ui`, `@internationalized/date` |
| `field` | 12 | `label`, `separator` | `tailwind-variants` |
| `input` | 2 | | |
| `textarea` | 2 | | |
| `input-group` | 8 | `button`, `input`, `textarea` | `tailwind-variants` |
| `native-select` | 4 | | `phosphor-svelte` |
| `checkbox` | 2 | | `bits-ui`, `@internationalized/date`, `phosphor-svelte` |
| `radio-group` | 3 | | `bits-ui`, `@internationalized/date` |
| `switch` | 2 | | `bits-ui`, `@internationalized/date` |
| `input-otp` | 5 | | `bits-ui`, `@internationalized/date`, `phosphor-svelte` |

That is 129 files in the 26 items, and 133 item files with `001`'s 4. The distinct registry dependency names become 11: `001`'s 5 and `spinner`, `separator`, `button`, `label`, `input`, `textarea`.

- *Why `button` depends on `spinner`:* the busy state renders one (decision 12).
- Each multi-file `registry:ui` item installs into its own folder, as `001` decision 19 requires.

### 7. The two new tokens: elevation and scrim

The split decision added them: "an elevation shadow for menus and dialogs, and a scrim for modal overlays, both from ink. In dark, elevation is a hairline plus the raised ground, since a shadow on ink is invisible." The primitives memo left their values to this specification (§7). In `002`, `alert-dialog` is the one item that uses them. Menus in `004` and `005` use the same token.

**New primitive colours** (25 in all, from 22). Each is ink with an alpha byte, so it composites by `001` decision 12's rule for eight-digit primitives (alpha byte ÷ 255).

| Primitive | Hex | Meaning |
|---|---|---|
| `ink-shadow` | `#14161C29` | ink at 41/255 (about 16%): the light shadow's colour |
| `ink-scrim` | `#14161C80` | ink at 128/255 (about 50%): the light scrim |
| `ink-scrim-deep` | `#14161C99` | ink at 153/255 (60%): the dark scrim |

**New semantic colours** (48 per theme, from 45):

| Name | Light | Dark | Role |
|---|---|---|---|
| `elevation-line` | `line` `#14161C1A` | `paper-line-input` `#787C8A` | the 1 px edge of an elevated surface |
| `elevation-shadow` | `ink-shadow` | `clear` | the shadow under it; none on ink |
| `scrim` | `ink-scrim` | `ink-scrim-deep` | the layer behind a modal dialog |

**One new size key**, `"elevation": { "y": 12, "blur": 32 }`, in px. Both are ladder steps.

**How they are emitted** (`001` decision 15's rules: a token that becomes a utility goes in `cssVars.theme`; a token read through `var()` goes in `:root`):

- The three colours are semantic colours like any other: `--elevation-line`, `--elevation-shadow` and `--scrim` in `:root` and `.dark`, and `--color-<name>` in `@theme inline`. So `bg-scrim` is a utility.
- `cssVars.theme["shadow-elevation"]` is `0 0 0 var(--line-width) var(--elevation-line), 0 0.75rem 2rem 0 var(--elevation-shadow)`. Tailwind makes it the utility `shadow-elevation`. The `var()`s resolve at run time, because the three colours and `--line-width` live in `:root` and `.dark`. The px values become rem by `001`'s unit rule.
- *Why a hairline as a spread shadow, not a border:* the edge then sits outside the surface's box, so a dialog's padding and size do not change with the theme.
- *Why reuse `paper-line-input` for the dark edge:* it already passes 3:1 on every dark ground (`001` decision 12, rows 31 to 33). A new primitive would add a value without adding a meaning.
- *Why no dark shadow:* "a shadow on ink is invisible" (split decision). `clear` is `001`'s fully transparent primitive.

**The visibility check.** WCAG sets no minimum for a dialog's edge. We set one anyway, because a dialog that blends into the dimmed page fails the design book's "honest pixels". The rule: **the elevated surface's edge measures at least 3:1 against every ground the scrim can cover**, in both themes. In light, the edge is the dialog's own `popover` white against the scrimmed ground. In dark, the dialog (`#1E2129`) is too close to ink, so the edge is `elevation-line`.

The token file gains `contrast.scrim`, six rows of `{ theme, edge, over, scrim, min: 3 }`. A new check in `contrast.test.ts` composites the scrim over each ground by the eight-digit rule, then measures. EXECUTED by this author on 2026-10-28, with `compositeAlphaByte` and `contrastRatio` from `scripts/contrast.ts`:

| # | Theme | Edge | Over | Scrimmed ground | Ratio |
|---|---|---|---|---|---|
| 1 | light | `popover` `#FFFFFF` | `background` `#F7F7F4` | `#858688` | 3.64 |
| 2 | light | `popover` | `card` `#FFFFFF` | `#898A8D` | 3.45 |
| 3 | light | `popover` | `muted` `#EAEAE7` | `#7F8081` | 3.95 |
| 4 | dark | `elevation-line` `#787C8A` | `background` `#14161C` | `#14161C` | 4.34 |
| 5 | dark | `elevation-line` | `card` `#1E2129` | `#181A21` | 4.17 |
| 6 | dark | `elevation-line` | `muted` `#2B2D32` | `#1D1F25` | 3.95 |

- *Why 128/255 in light:* at ink 0.451 (`#14161C73`), row 2 measured 2.95 and failed; at 0.502 every row passes (EXECUTED, same run).
- *Why 153/255 in dark:* ink over ink changes nothing, so the dark scrim's only job is to dim paper text behind the dialog. At 0.6 the dark rows are set by the edge alone, and paper text behind drops to `#6F7072`, well behind the dialog's own text.
- **What this does not check:** a menu with no scrim. Its edge in light is the 10% hairline plus the shadow. `004` checks it on its popover (`004` decision 11, browser check P1).

### 8. One focus recipe, and two focus utilities

The split decision: "Drop `outline-none`, the `ring-[3px]` halo and `ring-ring/50`; keep `001`'s 2 px solid outline."

- **Every control relies on `001`'s global `:focus-visible` rule** (`001` decision 13): a 2 px solid `ring` outline at a 2 px offset. A restyled item sets no outline, ring or focus border of its own.
- **Two places need help**, so `pluto-theme` gains two utilities, built from the `focus` tokens:
  - `@utility focus-ring { outline: var(--focus-width) solid var(--ring); outline-offset: var(--focus-offset) }`, the same declarations as the global rule, for a container that must draw the ring for a child.
  - `@utility focus-ring-none { outline: none }`, the one sanctioned way to drop the global outline, and only where an ancestor draws `focus-ring`.
- **Where each is used:**
  - `input-group`: the group draws the ring when its text control has focus (`has-[[data-slot=input-group-control]:focus-visible]:focus-ring`), and the control drops its own (`focus-visible:focus-ring-none`). *Why:* the control is borderless inside the group; a ring around it alone would sit inside the group's border and skip the addon. A button inside the group keeps its own ring, so a reader can tell which part has focus.
  - `input-otp`: the root draws the ring when the hidden input has focus (`has-[:focus-visible]:focus-ring`). *Why:* bits-ui gives that input an inline `outline: 0 solid transparent` (READ: `pin-input.svelte.js` lines 173 to 197, bits-ui 2.20.2, in the primitives memo's scratch install). An inline style beats our rule, so without this the code input would show no focus at all.
- The lint allows `focus-ring-none` in exactly two files: `input-group-input.svelte` and `input-group-textarea.svelte` (decision 21).
- **Invalid** is the split decision's: a solid `border-destructive`, `aria-invalid="true"`, and the field's error text wired by `aria-describedby` (decision 11). No `ring-destructive/<n>` halo. The `destructive` border measures 5.67 on light `card`, 5.29 on light `background` and 6.46 on dark `card` (EXECUTED, same run), all above the 3:1 a boundary needs.

### 9. The restyling checklist

A builder applies each rule to each item. A reviewer checks the same list. The lint enforces the rules marked **(lint)**; review checks the rest.

| # | Rule | Check |
|---|---|---|
| R1 | Every colour is a token class. No hex, colour function or palette class. | `001` lint |
| R2 | Focus is decision 8's recipe. No `outline-*`, no `ring*`, no focus border change. `focus-ring` and `focus-ring-none` only as decision 8 says. | lint |
| R3 | Invalid is `aria-invalid:border-destructive` (or the group form `has-[[aria-invalid=true]]:border-destructive`). No halo. | review; contrast spot-check (decision 23) |
| R4 | Spacing on the ladder (`001` decision 10). | `001` lint |
| R5 | Sizes on the ladder: `h-`, `w-`, `size-`, `min-`/`max-` take a ladder multiplier, a keyword, a fraction or a token. A control's height is decision 10's `h-12` or `h-8`, never stock's `h-9`. | lint; heights test |
| R6 | No translucent tint, except the four sanctioned state tints: `bg-destructive/10` and `bg-success/10` in light, `dark:bg-destructive/20` and `dark:bg-success/20` in dark (`001` decision 12). | lint |
| R7 | No state tint on or inside a `muted` or `accent` inset (`001` decision 8). Only `alert` keeps a tint, and an alert is never placed inside an inset (decisions.md, "State badges carry no tint"). | review |
| R8 | `muted` and `accent` are insets only: tab strips, skeletons, hover and selected rows, the table footer, the `kbd` key, empty-state and dialog icon tiles, avatar fallbacks. Never an item's own ground or a panel. | review |
| R9 | Radius through the one case radius. Any `rounded-*` draws 8 px (`001` decision 9); write `rounded`. `rounded-full` only in the allowlist (decision 19). | lint (`rounded-full`); review |
| R10 | Elevation only as `shadow-elevation`; the scrim only as `bg-scrim`. No other `shadow-*`, `drop-shadow-*`, `inset-shadow-*` or `text-shadow-*`. | lint |
| R11 | No `backdrop-*`. The design book §09 bans blur panels. | lint |
| R12 | `dark:` only where a token does not already switch. In `002` that is the two dark state tints, nowhere else. | lint |
| R13 | Type and tracking on the token scale: `text-xs`, `sm`, `base`, `2xl`, `5xl`; `tracking-display`, `section`, `eyebrow`, `mark`. | lint |
| R14 | Motion only as `animate-enter`, `animate-exit` and the spinner's `animate-spin`; durations as `duration-(--motion-micro)` or the default `transition`. | lint |
| R15 | Icons from `phosphor-svelte`, imported as `add` wrote them. Never an `IconPlaceholder`, never another icon set. | lint (no `cn-` marker); `svelte-check` |
| R16 | No `cn-*` marker classes left by the maia build (`cn-font-heading` becomes `font-heading`). | lint |
| R17 | Headings in the heading face: titles that are headings use `font-heading font-bold`. | review |
| R18 | Text is sentence case. No CSS case transform on labels or button text (split decision). | review |
| R19 | State is never told by colour alone: every state variant pairs its colour with text, an icon, a shape or a position. | review; each item's decision |
| R20 | Every root keeps its stock `data-slot` attribute; new parts add one. | review; tests select by it |
| R21 | Every pointer target at least 24 by 24 px. This is a house rule, stricter than AA: SC 2.5.8 also passes smaller targets through its spacing and inline exceptions (patterns memo §0.1). We do not rely on those exceptions, because a component cannot know its surroundings. | heights test |
| R22 | Border widths from tokens: the bare `border` (1 px, the hairline) or the `-(length:--token)` form, such as `border-b-(length:--focus-width)`. No `border-2` or `border-l-4`. | lint |
| R23 | Copy says what happens. A button or link names its action in active voice (Send, Stop, Scroll to end), and the name holds through the flow (Stop, then Stopped). An error says what went wrong and what to do; an empty state invites an action. No filler, no selling. | review |
| R24 | Furniture carries information. An eyebrow, a mono row, a divider, a number or tracked text appears only where it encodes something: a mono row is data, a number marks a sequence. Not the generic kit: all-caps labels, an eyebrow over every heading, meta strings joined with middle dots, an arrow after link text, identical cards with one shadow. The design book's own furniture (the lowercase mono eyebrow, the footer's rows) is a choice and stays. | review |

*Why a checklist and a lint both:* the lint is countable, which `001`'s acceptance style prefers. But "a zero is not a pass" (primitives memo §6.3): the lint cannot see where a class is used, so R3, R7, R8, R17 to R19, R23 and R24 stay review's. R23 and R24 were added on 2026-11-01 at the owner's word (decisions.md, "Two writing and furniture rules join the checklist").

### 10. Sizes: control heights on the ladder

Stock controls set heights off the ladder: `h-9`, `size-9` (primitives memo §3.3). The design lead decided the answer after review (decisions.md, "Control heights sit on the ladder", finding 2): **32 px (`sm`) and 48 px (default); no `lg`.**

| Size | Height | Text | Horizontal padding | Square (icon-only) |
|---|---|---|---|---|
| `sm` | `h-8` (32 px) | `text-sm` (21.6 px line box) | `px-3` | `size-8` |
| default | `h-12` (48 px) | `text-base` (25.6 px line box) | `px-4` (inputs `px-3`) | `size-12` |

- **Buttons, single-line inputs, native selects, single-line input groups and code-input cells take the default height**, so they line up in a form or a toolbar. A textarea is not a single row: it takes `min-h-16` instead (decision 13).
- **Text is centred in the box**: a button is `inline-flex items-center justify-center`; an input centres its own line. The space above and below the line box is what is left: 11.2 px at the default, 5.2 px at `sm`. Nothing needs to equal a ladder step except the height itself.
- **Inputs keep `text-base`.** *Why:* iOS Safari zooms a focused field whose text is under 16 px (INFERRED from common practice; not measured here). Buttons use `text-base` too.
- **Icon-only controls are `size-12` and `size-8`**, the icon centred. They are square by construction.
- **Why ladder heights, not a height reached from line box and padding:** the first draft reached 43.6 px that way. Review found it off the ladder ("nothing off it", decisions.md, 2026-10-27), putting every row below at a fractional offset where `001` decision 13 keeps hairlines whole, and making a square icon button impossible with allowed classes: an `aspect-square` button with vertical padding only measured 18 × 43.59 px in Chromium (review finding 2, EXECUTED). `h-12` and `h-8` are ladder values, which L7 accepts.
- **Why no `lg`:** one default and one small size cover forms, toolbars and a hero's call to action. A third height is a third rhythm.
- **Icons are `size-4` (16 px)** unless an item's decision says otherwise.
- **Every target is at least 24 px** (R21). Stock `xs` and `icon-xs` are dropped: the decision names two heights, and a 24 px button would sit at the house minimum with no room.
- The heights test measures these (decision 23).

### 11. Field wiring: ids known before the control renders

`field` is presentation only in stock: a label, a description, an error (primitives memo §2.2). It does not connect them to the control; the app writes the `id`s by hand. The split decision asks that error text be "wired by `aria-describedby`", and `003` needs that wiring on every form (decision 24), including forms rendered on the server after a failed submit.

- **The wiring is computed from props, so it is in the server-rendered HTML.** `Field` and `FieldSet` take two new props: `description?: string | Snippet` and `error?: string | Snippet`. They render their children, then a `FieldDescription` when `description` is given, then a `FieldError` when `error` is given. So the container knows, before any child renders, exactly which of the two elements this render will contain.
- **They set a Svelte context** under the string key `"pluto:field"`, in their script, before their children render:
  ```ts
  type FieldContext = {
    readonly id: string;            // the control's id: the app's `id` prop, else $props.id()
    readonly descriptionId: string; // `${id}-description`
    readonly errorId: string;       // `${id}-error`
    readonly invalid: boolean;      // the `invalid` prop, else true exactly when `error` is given
    readonly describedBy: string | undefined; // descriptionId if `description` is given, then errorId if `error` is given, space-separated
  };
  ```
  `field-context.svelte.ts` holds the type, the key and the helpers `setFieldContext` and `getFieldContext`.
- **No dangling reference.** `describedBy` names an id only when the same container renders that element in the same render. A `FieldDescription` or `FieldError` the app places by hand as a child is shown but not wired, and takes no id from the context. The preview and `003` use the props.
- **Each control reads the context, if present**, with `getContext("pluto:field")` in its own script: `input`, `textarea`, `native-select`, `checkbox`, `switch`, `radio-group`, `input-otp`, and through `input`, the input-group's controls. It puts `id`, `aria-describedby` and `aria-invalid` on its operable element, unless the app passes its own: the `<input>`, `<textarea>` or `<select>`; the bits-ui button with `role="checkbox"` or `role="switch"`; the element with `role="radiogroup"`; and for `input-otp`, PinInput's real input, through its `inputId` prop and the rest props it passes to that input (INFERRED from `inputProps` in `pin-input.svelte.js`; the test proves it). Outside a `Field`, a control behaves as stock.
- **`FieldLabel` sets `for` to the context's `id`.** In a `FieldSet`, `FieldLegend` names the group natively.
- *Why the server matters:* a child's script runs after its parent's, so a context set in `Field`'s script is visible to the control in the same server render. A description or error that "registered itself when mounted", as the first draft had it, never ran on the server, and ran after the control even in the browser (review finding 4). Props settle it before anything renders.
- *Why a string key, not an import:* a control that imported `field-context.svelte.ts` would make `input` depend on `field`, and `field` already depends on `label` and `separator`. A string key couples them by convention only, so `input` installs alone. The cost is a contract copied into seven controls; the browser test checks all seven (decision 23).
- *Why `$props.id()`:* Svelte 5.20 and later make an id that is the same on the server and in the browser, so a prerendered page hydrates without a mismatch (INFERRED from Svelte's documentation of the rune; both fixtures and this repository pin Svelte 5.57.3).
- **One control per `Field`.** A group of radios or checkboxes uses `FieldSet` and `FieldLegend` (patterns memo §7.2: groups need `fieldset` and `legend`), with the same two props.

### 12. `button`

**Variants.** The design book §01 law 2: a surface spends one brand accent, blue, on its primary action. Red, amber and green that tell state are outside that budget (split decision).

| Stock | Ours | Look | Why |
|---|---|---|---|
| `default` | `default` | `bg-primary text-primary-foreground border-primary` | the surface's one blue action. One per surface: review |
| `secondary` | `secondary` | `bg-secondary text-secondary-foreground border-input` | `001` decision 8: "`002` gives them a visible border". The design book: "buttons have shapes" |
| `outline` | dropped | | it was the bordered look `secondary` now has; two names for one look |
| `ghost` | `ghost` | transparent, `border-transparent`; hover `bg-accent` | a toolbar or header action. Hover on `accent` is an inset state (R8) |
| `destructive` | `destructive` | `bg-destructive text-destructive-foreground border-destructive`, solid | a solid fill works on every ground, `muted` included, where the stock tint is forbidden (R7). It is the stop colour of a confirm, used rarely |
| `link` | `link` | `text-primary underline underline-offset-4`, always underlined | The design book §09: "links look like links", not only on hover |

- **Hover** changes a bordered button's border to `border-foreground`: ink in light, paper in dark, so it darkens in one theme and lightens in the other; either way the frame visibly changes. *Why:* the design book asks for "real active states" with no fake depth, and stock's `hover:bg-primary/80` is a translucent tint (R6). A border change uses tokens only. `ghost` uses the `accent` inset; `link` has its underline.
- **Press** keeps stock's `active:translate-y-px`, a 1 px drop: "interactive elements look pressable" (the design book §05).
- **Sizes:** `sm` (`h-8 px-3 text-sm`), `default` (`h-12 px-4 text-base`), `icon-sm` (`size-8`), `icon` (`size-12`), by decision 10. Stock `xs`, `icon-xs`, `lg` and `icon-lg` are dropped (decision 10).
- **Disabled** stays stock: the `disabled` attribute, `disabled:opacity-50`. A disabled control is exempt from contrast (SC 1.4.3). It leaves the tab order.

**The busy state** (split decision: "A busy button stays enabled and focused. It shows a spinner, sets `aria-busy`, and ignores re-submits.")

- A `busy?: boolean` prop. When true, the button:
  - sets `aria-busy="true"` and `data-busy`;
  - renders `Spinner` (decorative, decision 19) before its children, keeping its text, so its accessible name does not change;
  - calls `event.preventDefault()` on every click while busy. That also stops a form's implicit submission by Enter, which fires a click on the default button (INFERRED from the HTML form submission algorithm);
  - stays enabled and keeps focus.
- *Why not `disabled`:* a disabled button drops focus, and keyboard users lose their place. The split decision says so.
- The spinner appears in the same render as the prop change, inside the design book's 200 ms budget for response.
- `aria-busy` on a button is announced poorly by screen readers (INFERRED). The announcement ("Signing in…") is `003`'s status region (decision 24).
- `busy` applies to `<button>` only. A link has no busy state.

**Accessibility contract.** A `<button type="button">` by default, or an `<a>` with `href`. An icon-only button must have `aria-label`; its tooltip, if any, repeats that text visually (decision 19, `tooltip`). Enter and Space activate it (native).

**Preview page.** Every variant at every size; disabled; busy; an icon button with and without a tooltip; a link-styled button. **Keyboard fixture**, 7 stops: default, secondary, ghost, destructive, link, icon (`aria-label="Copy"`), busy. A disabled button sits between them and is not a stop. A form around the busy button counts submits in a visible `<output>`.

### 13. `input`, and the recipe `textarea` and `native-select` share

**The recipe:** `h-12 bg-card text-foreground border border-input rounded px-3 text-base placeholder:text-muted-foreground aria-invalid:border-destructive disabled:opacity-50`, full width (decision 10).

- **Why `bg-card`:** The design book reserves raised white for "surfaces that sit on" the ground: "cards, inputs, figures". Stock `bg-input/30` greys the control, now that `input` is a 3:1 border colour (`001` decision 29; R6).
- **The border is the `input` token**, 3.94 on light `card`, 3.67 on light `background`, 3.86 on dark `card` (EXECUTED, same run; `001` decision 12). The design book §09: "inputs keep visible borders".
- **No variant.** Stock has none. Sizes: default only; `sm` would invite a 13.5 px field.
- **Native selects and single-line input groups** take `h-12` too.
- `type="file"` keeps stock's file-button styling, restyled by R1 to R16.
- **`textarea`:** the same recipe with `min-h-16` (64 px) and `py-2` in place of `h-12`, and stock's `field-sizing-content`, so it grows with its text where the browser supports `field-sizing`. Where it does not, it keeps its minimum height and the person can resize it. `field-sizing: content` grows a textarea in Chromium, WebKit and Firefox, and stops at a `max-height` with an inner scroll; it is Baseline 2026, first supported in Chrome 123, Firefox 152 and Safari 26.2 ([`../research/2026-11-01-the-chat-primitives-the-composer-and-field-sizing.md`](../research/2026-11-01-the-chat-primitives-the-composer-and-field-sizing.md) §4, EXECUTED and READ). Growth is a refinement here. A chat composer gets its known maximum height from a CSS cap.
- **`native-select`:** the same recipe with `appearance-none pr-12`, and `CaretDown` from `phosphor-svelte` (`size-4`, `text-muted-foreground`, decorative) on the right. Its `<option>` and `<optgroup>` keep stock's `bg-[Canvas] text-[CanvasText]`. *Why:* the open list is drawn by the operating system, and CSS system colours follow `color-scheme`, which `001` sets per theme. The lint allows it, because `Canvas` names no colour of ours or the palette's; review notes it as the one system-colour use.

**Accessibility contract.** Native elements. A visible label, through `Field` or `Label` (SC 3.3.2: a placeholder is not a label). `aria-invalid` and `aria-describedby` from `Field` (decision 11). `autocomplete` is the app's, passed through.

**Preview page.** Empty, with placeholder, filled, disabled, invalid with its error, `type="file"`, inside a `Field` with a description. **Keyboard fixtures:** `input` 2 stops (plain, invalid; a disabled one is skipped); `textarea` 2 stops; `native-select` 2 stops.

### 14. `switch`

- **Role and keys:** bits-ui renders a `<button role="switch" aria-checked>` (READ: `switch.svelte.js` lines 47 to 50, bits-ui 2.20.2). Space and Enter toggle it (native button activation; the APG switch pattern asks for Space).
- **Colours.** Checked is blue (split decision: "blue acts; green confirms an outcome, and a setting is not an outcome"). The track is `bg-input` unchecked and `bg-primary` checked. The thumb is `bg-card` unchecked and `bg-primary-foreground` checked.
  - Thumb on track: `card` on `input` 3.94 light and 3.86 dark; `primary-foreground` on `primary` 5.91 light and 6.85 dark (EXECUTED, same run; `001` decision 12). Each passes SC 1.4.11's 3:1.
  - No `dark:` class is needed: every one of these tokens already switches (R12).
- **State is also told by position:** the thumb moves to the end when on (R19).
- **Geometry** is the design lead's (decisions.md, "The switch is a 32 × 64 track with a 24 × 24 thumb", after review finding 6, revised once). Stock used `h-[18.4px]` and `w-[32px]`.
  - **Track:** `h-8 w-16 p-1 rounded`, 32 × 64 px, at the case radius. 32 px is the `sm` control height (decision 10). **No border**: stock's `border border-transparent` is removed. With it kept, the first draft's thumb overflowed the track by 2 px right and bottom (review finding 6, EXECUTED in Chromium).
  - **Thumb:** `size-6 rounded`, 24 × 24 px, at the case radius, inset 4 px by the track's padding.
  - **Travel:** `translate-x-8` (32 px) when checked: 64 − 2 × 4 − 24 = 32, so the thumb sits 4 px from either end, inside the track in both states.
  - *Why a 24 px thumb:* any thumb 16 px or less on a side goes fully round at an 8 px radius, which is the "in between" the design book §05 forbids (the first draft's 16 × 24 thumb was a stadium for that reason, not the "rounded bar" it claimed). At 24 px with 8 px corners the thumb reads as a rounded square and matches the checkbox and radio at 24 px.
  - **Every value is on the ladder** (`h-8`, `w-16`, `size-6`, `p-1`, `translate-x-8`), so the lint needs no exception for `switch.svelte`. *Why revised:* the first post-review geometry (24 × 44, a 20 px thumb, a 2 px inset) was off the ladder and needed one.
  - The track is 32 px high and 64 px wide, so it meets R21 alone.
- **Motion:** `transition-transform`, which reads the default 200 ms (`001` decision 14).
- **Name:** from `Field` and `FieldLabel`, or `Label for`. A switch never stands without a visible label.
- Stock `size="sm"` (14 px high) is dropped: below the house minimum of 24 px (R21).
- **Preview page.** Off, on, disabled off, disabled on, invalid with error, inside a `Field` with a description. **Keyboard fixture**, 2 stops (off, on); Space flips `aria-checked` on the first. The heights test measures the track, the thumb and the thumb's position in both states (decision 23).

### 15. `tabs`

Two variants, the stock names kept.

- **`default`, the pill strip.** The list is a `muted` inset (R8: "tab strips"): `bg-muted p-1 rounded`. The active trigger is `bg-card text-foreground border border-input`; an inactive one is `border-transparent text-muted-foreground`, and on hover `text-foreground`.
  - *Why a border on the active pill:* `card` on `muted` measures about 1.2. A state told only by that difference fails SC 1.4.11. `input` on `muted` measures 3.27 light and 3.31 dark (`001` decision 12), so the boundary tells the state. The text colour change adds a second cue (R19).
  - Stock's dark rules (`dark:data-active:bg-input/30`, seven `dark:` classes) go: the tokens switch.
- **`line`.** No strip. Every trigger has `border-b-(length:--focus-width)`, transparent when inactive and `border-foreground` when active. *Why a border, not stock's `after:` bar at `bottom-[-5px]`:* the same 2 px line, with no arbitrary offset, and its width from a token (R22). The `length:` hint tells Tailwind the variable is a width, not a colour. `foreground` on `background` is 16.84.
- **Trigger size:** `h-8 px-3 text-sm` in the pill (the strip, with `p-1`, is 40 px), `h-12 px-3 text-sm` in the line variant (decision 10).
- **Keys and roles** are bits-ui's: `tablist`, `tab` with `aria-selected`, `tabpanel`; one stop for the list (roving `tabindex`); Left and Right move between tabs; Home and End jump; selection follows focus by default (automatic activation). The panel is a stop, with the global ring.
- **Vertical orientation** keeps stock's behaviour, restyled by the same rules.
- **Preview page.** Both variants, horizontal, three tabs each; a disabled tab; vertical. **Keyboard fixture**, 4 stops: the pill list's active tab, its panel, the line list's active tab, its panel. ArrowRight on the first moves focus and selection to the second tab.

### 16. `field`

- **Parts kept:** `Field`, `FieldContent`, `FieldLabel`, `FieldTitle`, `FieldDescription`, `FieldError`, `FieldGroup`, `FieldSet`, `FieldLegend`, `FieldSeparator`, plus `field-context.svelte.ts` (decision 11). Orientations `vertical`, `horizontal` and `responsive` stay. `Field` and `FieldSet` gain the `description` and `error` props of decision 11.
- **`FieldError` is not a live region.** Stock gives it `role="alert"`. We remove it. *Why:* Primer's guidance is "don't use live regions for validation", and after a failed submit with several errors, several `role="alert"` regions would speak at once (patterns memo §3.2). The error is reached through `aria-describedby` when focus lands on the field, and announced once by `003`'s error summary. That holds only under decision 24's precondition: errors appear on submit, and focus moves to the summary or the field.
- **`FieldError` says the error in text,** in `text-sm text-destructive` (SC 3.3.1), with no icon. The control's red border is a second cue (R19). *Why no icon:* the text already names the error, and an icon would make `field` name `phosphor-svelte` for decoration.
- **The label stays `foreground` when invalid.** Stock turns the whole field red (`data-[invalid=true]:text-destructive`). The error text and the border carry the state; a red label adds colour, not meaning.
- **Text:** `FieldLabel` and `FieldLegend` are `text-base font-medium`, sentence case (split decision). `FieldDescription` is `text-sm text-muted-foreground`. *Why 13.5 px for helper text:* the design book's own card text is set at 13.5 px in the body face.
- **Choice cards** (a `FieldLabel` wrapping a `Field`): checked is `has-data-checked:border-primary`, a 3:1 boundary (`primary` on `card` 5.91 light, 6.10 dark), not stock's `bg-primary/5` tint.
- **`FieldSeparator`** draws the groove, through `separator`, with optional centred text ("or continue with").
- Spacing: `gap-3` inside a field, `gap-6` in a group, `gap-8` between groups. All ladder steps; stock's `gap-7` and `leading-snug` go.
- **Preview page.** A vertical field with label, description and input; the same invalid, with error; horizontal with a switch; a `FieldSet` of radios with a legend; a choice card; a separator with text. **A wiring fixture** (`data-testid="wiring"`): seven invalid containers, each with a description and an error, one per control that reads the context (`input`, `textarea`, `native-select`, `checkbox`, `switch` in a `Field`; `radio-group` in a `FieldSet`; `input-otp` in a `Field`). **Keyboard fixture**, 2 stops: the valid input and the invalid one. The test reads each input's accessible description and finds the description text, and for the invalid one, the error text.

### 17. `alert-dialog`

- **Role and focus:** bits-ui renders `role="alertdialog"` (READ: `dialog.svelte.js` line 265, bits-ui 2.20.2), traps focus, closes on Escape and returns focus to the trigger (patterns memo §1.2, READ from bits-ui's Dialog docs). Title and description become the dialog's name and description.
- **Initial focus is Cancel, set by our code.** bits-ui 2.20.2's `AlertDialog.Content` does not focus the first focusable: its default `onOpenAutoFocus` prevents the default and focuses the content node itself (review finding 1, READ: `alert-dialog/components/alert-dialog-content.svelte` lines 51 to 59). So our `AlertDialogContent` passes its own `onOpenAutoFocus`: it calls `preventDefault()`, then focuses the element with `data-slot="alert-dialog-cancel"` inside the content, and falls back to the content node only when there is none. An app's own `onOpenAutoFocus`, if passed, runs first and wins if it prevents the default. *Why:* a confirm of a destructive act should start on the safe choice (APG alert dialog, as cited in the patterns memo §1.2). *Why by `data-slot`, not markup order:* the footer's children are the app's markup, so their order guarantees nothing. The footer keeps stock's visual order (`flex-col-reverse sm:flex-row sm:justify-end`).
- **The scrim:** the overlay is `fixed inset-0 bg-scrim`, fading by `animate-enter` and `animate-exit`. Stock's `bg-black/80` (a palette literal) and `backdrop-blur-xs` (the design book §09) go.
- **The surface:** `bg-popover text-popover-foreground shadow-elevation rounded p-6 gap-6`, fading the same way. Stock's `ring-1 ring-foreground/5` goes; `elevation-line` draws the edge. Width: stock's `max-w-xs` and `sm:max-w-md` are container sizes and stay.
- **Title** `font-heading text-base font-bold`; **description** `text-sm text-muted-foreground`.
- **`AlertDialogMedia`** keeps its icon tile on `bg-muted` (an inset, R8), `size-16 rounded`, not `rounded-full`.
- **Action and Cancel** use `buttonVariants`: Cancel `secondary`, Action `default`, or `destructive` when the act destroys. A surface with a destructive action spends red, not blue.
- **Preview page.** A trigger button opening a confirm with title, description, Cancel and a destructive Action; a second with media. **Keyboard fixture**, 1 stop when closed (the trigger). Enter opens it; the focused element is the one with `data-slot="alert-dialog-cancel"`; Tab goes to Action; Tab again returns to Cancel (the trap); Escape closes it; focus is back on the trigger; the content is gone from the page.

### 18. `input-otp`

The split decision: "Sign-up verification is a six-digit code, so `input-otp` is in `002`. It accepts paste and `autocomplete="one-time-code"` (SC 3.3.8)."

- **One real input.** bits-ui's PinInput keeps a single `<input>` under the visible cells (patterns memo §3.1, READ). That input carries `autocomplete="one-time-code"` and `inputmode="numeric"` by default (READ: `pin-input.svelte.js` line 359 and `components/pin-input.svelte` line 18, bits-ui 2.20.2). Our `InputOTP` keeps both defaults and does not let them be lost.
- **Our defaults:** `maxlength={6}`, `pattern={REGEXP_ONLY_DIGITS}` (bits-ui's exported `^\d+$`), and a `pasteTransformer` that removes every non-digit (`/\D/g`). *Why the transformer:* a code pasted as "123 456", "123-456" or with a trailing newline would otherwise fail the pattern, and bits-ui would reject the whole paste (READ: `onpaste`, lines 302 to 340). SC 3.3.8 forbids a code input that rejects a single paste (patterns memo §3.2).
- **Cells** are 48 px squares (decision 10): `size-12 text-base`, the digit centred, `bg-card border-y border-r border-input`, the first with `border-l rounded-l`, the last `rounded-r`. The active cell gets `border-ring`. Invalid: `has-[[aria-invalid=true]]:border-destructive` on the group.
- **Focus:** the root draws `focus-ring` when the input has focus (decision 8). The active cell's blue border is a second cue.
- **The caret** is a static 2 px `bg-foreground` bar, `h-4 w-(--focus-width)`, no blink (decision 3).
- **The separator** between the two groups of three is `Minus` from `phosphor-svelte`, decorative, `role="separator"` as stock.
- **Name and wiring:** inside a `Field`, the context's `id` becomes PinInput's `inputId`, so `FieldLabel for` names the real input, and `aria-describedby` and `aria-invalid` go on that input (decision 11).
- **Preview page.** Empty, partly filled, complete, invalid with error, disabled. **Keyboard fixture**, 1 stop. The browser test pastes "123456", "123-456" and "123456\n" and finds six filled cells each time, types "a" and finds it rejected, and reads the three attributes (decision 23).

### 19. The other 19 items

| Item | Variants and sizes | Colours from | Accessibility contract | Preview shows; keyboard fixture |
|---|---|---|---|---|
| `card` | `default`; `size="sm"` kept (16 px spacing) | `bg-card text-card-foreground border border-border`, not stock's `ring-1 ring-foreground/10` (same colour, `001` decision 8) | `CardTitle` and `EmptyTitle` render a heading, `h2` by default, with a `level` prop (1 to 6). *Why:* a title that looks like a heading must be one (SC 1.3.1). `cn-font-heading` becomes `font-heading font-bold`. Spacing `p-6 gap-6` (`sm`: `p-4 gap-4`), replacing `--card-spacing` | header, content, footer, action, image; `sm`. No fixture |
| `badge` | `default` (neutral: `border-border text-foreground`), `destructive`, `success`, `caution`. Stock `secondary`, `outline`, `ghost` and `link` dropped: a badge is a label, not an action, and a blue `default` would spend the surface's accent. The `href` prop is dropped too: a 20 px link would miss the house minimum of 24 px (R21); a removable filter is a `button` (`secondary`, `sm`) | **No tint** (decisions.md, "State badges carry no tint", after review finding 3). `destructive`: `border-destructive text-destructive` on a transparent fill; `success`: the same with `success`; `caution`: a solid `bg-caution border-caution text-caution-foreground` (ink on amber, 9.27). *Why:* badges sit in `table` and `item` rows, whose hover and selected ground is `accent`, and a state tint there fails AA (destructive/10 over light `accent` 4.06, destructive/20 over dark 3.96; `001` decision 12's forbidden pairs). Text on the row itself passes: `destructive` on `accent` 4.71 light and 5.53 dark, `success` 5.23 and 6.55 (`001` decision 12, rows 16 and 20; re-run by the review) | a `<span>`; `font-mono text-xs`, `px-2 py-0`, 20 px high. Its text says the state (R19) | each variant; with an icon. No fixture |
| `alert` | `default`, `destructive`, `success`, `caution` | `default`: `bg-card border-border`; `destructive`: `bg-destructive/10 dark:bg-destructive/20 border-destructive text-destructive`; `success`: the same with `success`; `caution`: `bg-card border-border border-l-(length:--focus-width) border-l-caution` (amber as a fill, never text). The two tints are the sanctioned ones (R6). **An alert is never placed inside an inset** (R7; decisions.md): its context is a panel or the page. The amber bar measures 1.95 on light `card`, which is acceptable only because it is decoration: the title says the state in words | **Role by variant:** `destructive` renders `role="alert"`; `success` and `caution` render `role="status"`; `default` renders none. The app may pass another `role`, or `role={null}` to render none: the component computes the role as "the prop if it was given, else the variant's", so an explicit `null` survives. Decision 24 states when each role is announced. *Why:* stock puts `role="alert"` on every alert, and SC 4.1.3 lists `role="alert"` on content that is "not important and time-sensitive" as a failure (patterns memo §0.1). The title names the state in words (R19). It spreads `tabindex` and binds `ref`, so `003`'s error summary can move focus to it | each variant with title, description, icon and action. No fixture |
| `empty` | stock parts kept; `EmptyMedia` variants `default` and `icon` | title `font-heading font-bold text-2xl tracking-section`, not stock's `text-lg tracking-tight`; description `text-muted-foreground`; the icon tile on `bg-muted` (an inset) | `EmptyTitle` renders a heading with `level` (as `card`). Centred, as stock; `003` decides alignment per context (patterns memo §6.4) | with icon, title, description, one action and one link. No fixture |
| `skeleton` | one | `bg-muted rounded` (an inset, R8) | static: no `animate-pulse` (split decision). `aria-hidden="true"` by default: skeletons are decorative (patterns memo §6.2). The region being filled carries `aria-busy`; that is `003`'s | a card-shaped and a row-shaped skeleton. No fixture |
| `spinner` | one; size from the text around it (`size-4` default) | `currentColor` | **Decorative by default** (`aria-hidden="true"`), because it sits inside a busy button that has its own name. With a `label` prop it renders a wrapper with `role="status"` holding the icon (hidden) and the label as visually hidden text (`sr-only`), for a spinner that stands alone. *Why text, not `aria-label`:* a live region announces its content, and an `aria-label` alone gives it none (review finding 10). `Spinner` from `phosphor-svelte` with `animate-spin` (decision 3) | decorative, labelled, inside a busy button. No fixture |
| `separator` | horizontal, vertical | horizontal: `groove pt-(--line-width) w-full`; vertical: `border-l border-border self-stretch`, a plain hairline | **The item sets `decorative = true` by default**, so bits-ui renders `role="none"`; bits-ui's own default is `false`, which would render `role="separator"` (review finding 9, READ: `separator/components/separator.svelte` line 14). An app passes `decorative={false}` for a separator that means something. *Why `pt-(--line-width)`:* the groove is a top border plus a 1 px inset highlight, and an inset shadow on an element with no padding box is clipped away. One hairline of padding gives the highlight its row; stock's `h-px` is banned by L7. *Why a plain vertical line:* the design book's groove has no vertical form; `005` adds one, `groove-s`, for the sidebar's edge (`005` decision 5) | both orientations. No fixture |
| `item` | `default`, `outline`; sizes `default` (`p-4 gap-4`), `sm` (`p-3 gap-3`). Stock `muted` dropped: an item on `muted` is a panel ground (R8) | `outline`: `border-border`; a link item's hover `bg-accent` (a hover row) | a link item (stock `child` snippet) is one stop with the global ring. Stock `-2.5` and `-3.5` spacing goes (R4) | each variant and size; with media, actions, header and footer; a link item. Fixture: 1 stop |
| `kbd` | `Kbd`, `KbdGroup` | `bg-muted text-muted-foreground border border-border` (6.79, `001` decision 12) | a `<kbd>` element; `font-mono text-xs px-1 min-w-6`, 20 px high, not stock's `h-5 min-w-5` | single keys and "Ctrl Enter" in a group. No fixture |
| `tooltip` | one | `bg-foreground text-background` (16.84), so no elevation: an inverted chip stands out on its own | bits-ui opens it on hover and focus, links it to the trigger by `aria-describedby`, closes it on Escape, and lets the pointer move onto it (READ: `tooltip.svelte.js` lines 562 to 694) — SC 1.4.13's dismissible, hoverable and persistent. **It is never an icon button's only name**: the button has `aria-label`, and the tooltip repeats it. While it is open, bits-ui also makes it the button's description, so a screen reader hears the text twice. We accept that: the repeat is harmless, and removing bits-ui's wiring would mean overriding its trigger props. Where there is more to say, such as a shortcut, the tooltip says that instead of the bare name. Stock's arrow and its ten arbitrary offsets go. `sideOffset={4}`: bits-ui takes a number, not a CSS value, so the 4 px ladder step is written as a number, the one size literal in `002`, checked by review. Stock `delayDuration` 0 kept | an icon button with a tooltip; a button whose tooltip shows a shortcut in `kbd`. Fixture: 1 stop; focus opens the tooltip (`role="tooltip"` visible, the trigger's `aria-describedby` names it); Escape closes it |
| `collapsible` | one | none of its own | bits-ui: the trigger is a button with `aria-expanded` and `aria-controls`; Enter and Space toggle. No animation | open and closed. Fixture: 1 stop; Enter flips `aria-expanded` and shows the content |
| `avatar` | `default` (`size-8`), `sm` (`size-6`), `lg` (`size-12`); `AvatarGroup`, `AvatarGroupCount` kept; `AvatarBadge` dropped | fallback `bg-muted text-muted-foreground` (an inset); group overlap `-space-x-2` with `border-(length:--focus-width) border-background`, not `ring-2 ring-background` (R22) | **the 8 px case radius, not a circle** (split decision). `AvatarBadge` is dropped: it is a coloured status dot no `002` consumer needs, and a dot on an avatar tells state by colour. The image needs `alt` from the app | fallbacks at each size; a group with a count. The image state is not shown: the preview ships no image file (blocks memo §5: a page references no file it does not ship). `svelte-check` and review cover it. No fixture |
| `label` | one | `text-base font-medium` | bits-ui `Label` renders a `<label>`. Disabled peers dim it, as stock | alone and beside a checkbox. No fixture |
| `checkbox` | one | unchecked `bg-card border-input`; checked and indeterminate `bg-primary border-primary text-primary-foreground` | bits-ui: a `<button role="checkbox" aria-checked>` with `true`, `false` or `mixed`; Space toggles. `Check` and `Minus` from `phosphor-svelte` tell the state by shape (R19). **`size-6` (24 px)**, not stock's 16 px. *Why:* at 16 px, the 8 px case radius draws a circle; at 24 px it draws a rounded square, which still reads as a checkbox. 24 px is about one body line box, and meets R21 alone | unchecked, checked, indeterminate, disabled, invalid, with a label. Fixture: 3 stops; Space flips the first |
| `radio-group` | one | unchecked `bg-card border-input`; checked `border-primary` with a `size-3 bg-primary` inner dot | bits-ui: `radiogroup` with `radio` items, one stop (roving), arrows move and select. **Round**: the item and its dot are `rounded-full`, the one primitive besides `four-dot` on the allowlist. Decided by the design lead after review finding 5 (decisions.md, "Radio buttons are round"; the avatar bullet now reads "The four-dot and the radio button are the only circles"): the radio's mark is a dot, so it is dot-derived under the design book §05, and the circle is what tells "one of many" from a checkbox's square. `size-6`, as checkbox | three options, one disabled, inside a `FieldSet`. Fixture: 1 stop; ArrowDown moves focus and `aria-checked` to the next |
| `input-group` | addons `inline-start`, `inline-end`, `block-start`, `block-end`; `InputGroupButton` sizes `sm`, `icon-sm` | the group takes the input recipe (decision 13); addon text `text-muted-foreground` | focus by decision 8; invalid by `has-[[aria-invalid=true]]:border-destructive`. **`InputGroupPassword`** (new file): an `InputGroupInput` whose type flips between `password` and `text`, and an `InputGroupButton` whose visible text is "Show" or "Hide", whose name is "Show password" or "Hide password" (the visible word is in the name, SC 2.5.3), with `aria-controls` the input. The input sets `spellcheck="false"` and `autocapitalize="off"`; `autocomplete` is the app's (`current-password` or `new-password`). Never blocks paste (patterns memo §3.2, GOV.UK) | an input with a text addon and a button; a textarea with a block addon; the password input, hidden and shown; invalid. Fixture: 4 stops (the input, its button, the password input, its toggle); Enter on the toggle flips the input's `type` and the button's name |
| `table` | one | row hover and selected `bg-accent` (hover and selected rows, R8); footer `bg-muted` (an inset, R8); borders `border-border`. A badge in a row is safe, because badges carry no tint | `<table>` semantics as stock. Selected rows set `aria-selected`, so the state is not the inset alone. The container keeps `overflow-x-auto`: data tables may scroll inside themselves (SC 1.4.10). With a `label` prop it becomes `role="region" tabindex="0" aria-label={label}`, so keyboard users can scroll it; without one it adds no stop | a caption, header, body with a selected row, and footer, sized to fit 1280 px so it never scrolls on the preview. No fixture |

`rounded-full` allowlist: `four-dot.svelte` (`001`) and `radio-group-item.svelte`. Nothing else.

### 20. Icons

- **`phosphor-svelte` 3.1.1** (split decision). Four items import it: `spinner` (`Spinner`), `native-select` (`CaretDown`), `checkbox` (`Check`, `Minus`), `input-otp` (`Minus`). No other item imports an icon.
- **Imports are as `add` wrote them**: the CLI rewrites each `IconPlaceholder` to an import from `phosphor-svelte/lib/<Name>` when `iconLibrary` is `phosphor` (primitives memo §3.1, READ). Our `components.json` already says `phosphor` (`001` decision 21).
- **Our items carry plain imports, never a placeholder.** So an app's own `iconLibrary` setting does not matter: it gets phosphor, named in the item. *Why:* one icon set per app (primitives memo §2.1).
- The primitives memo did not check that each name exists in 3.1.1 (§7). `bun run check` proves it: `svelte-check` fails on a missing export.
- Every icon is decorative (`aria-hidden`) unless an item's decision gives it a name.

### 21. The stronger lint

`scripts/lint-literals.ts` keeps all of `001`'s rules and gains 14 class rules. Each is applied to a class token after its variant prefixes are stripped, as `001`'s rules are, except rule 2, which reads the prefix.

| # | Rule | Flags | Allows |
|---|---|---|---|
| L1 | translucent tint | a colour utility (`001`'s list) on a token colour with an opacity modifier: `bg-input/30`, `hover:bg-primary/80`, `text-foreground/60`, `border-destructive/50`, `ring-ring/50` | exactly `bg-destructive/10` and `bg-success/10` with no variant, and `bg-destructive/20` and `bg-success/20` with exactly the variant `dark:` |
| L2 | `dark:` variant | any class whose variants include `dark:` | the two dark tints of L1 |
| L3 | ring | `ring`, `ring-<anything>`, `ring-offset-*`, `inset-ring*` | nothing |
| L4 | outline | `outline`, `outline-<anything>`, `outline-offset-*` | nothing; focus is decision 8's |
| L5 | shadow | `shadow`, `shadow-*`, `inset-shadow-*`, `drop-shadow*`, `text-shadow-*` | `shadow-elevation` |
| L6 | backdrop | `backdrop-*` | nothing |
| L7 | size off the ladder | `h-`, `w-`, `size-`, `min-h-`, `min-w-`, `max-h-`, `max-w-` with a number not among `0` and the ladder multipliers (read from the token file, as `001`'s spacing rule is), or `px` | ladder multipliers; `auto`, `full`, `screen`, `svh`, `lvh`, `dvh`, `min`, `max`, `fit`, `lh`, `prose`; container sizes `3xs` to `7xl`; fractions such as `1/2`; the `-(--token)` form |
| L8 | type step | `text-<size>` where the size is `xs`, `sm`, `base`, `lg`, `xl` or `<n>xl` and not a key of the token file's `type.scale` | `text-xs`, `text-sm`, `text-base`, `text-2xl`, `text-5xl`; colour classes such as `text-destructive` are not sizes |
| L9 | tracking | `tracking-<name>` not a key of `type.tracking` | the four token names and the `-(--token)` form |
| L10 | animation | `animate-<name>`; `tw-animate-css` classes beginning `fade-in`, `fade-out`, `zoom-in`, `zoom-out`, `slide-in`, `slide-out`, `spin-in`, `spin-out` | `animate-enter`, `animate-exit`, `animate-spin` |
| L11 | `rounded-full` | `rounded-full` outside the allowlist | in `four-dot.svelte` and `radio-group-item.svelte`, by file name |
| L12 | `cn-` marker | a class beginning `cn-` | nothing |
| L13 | `focus-ring-none` | `focus-ring-none` outside its allowlist | in `input-group-input.svelte` and `input-group-textarea.svelte` |
| L14 | border width | `border-<n>` and `border-<side>-<n>` (`x`, `y`, `t`, `r`, `b`, `l`, `s`, `e`) with a number other than `0` | the bare `border` and `border-<side>` (1 px, the hairline), `border-0`, and the `-(length:--token)` form (review finding 11; R22) |

- **This amends `001` decision 10**, which left sizes unrestricted. The split decision and the primitives memo ask for sizes on the ladder; stock's `h-9` and `size-3.5` are the reason (primitives memo §5.2).
- **Tailwind's other text steps stay in the theme** (`001` decision 11 left the choice to `002`). Apps may use them; L8 keeps them out of items.
- **The lint does not see placement.** `muted` as an inset, no state tint inside an inset, one accent per surface, and sentence case stay review's (R7, R8, R18; primitives memo §6.3: "a zero is not a pass").

**The samples `literals.test.ts` counts.** `001`'s 27 bad and 12 good stay. It adds 32 bad and 24 good, each linted as a class inside `<span class="…">` with the file name `sample.svelte` unless one is given.

- **32 new bad:** `focus-visible:ring-ring/50`, `bg-input/30`, `hover:bg-primary/80`, `text-foreground/60`, `border-destructive/50`, `dark:text-muted-foreground`, `dark:bg-destructive/10`, `bg-destructive/20`, `ring-1`, `ring-offset-2`, `outline-none`, `outline-hidden`, `shadow-2xl`, `shadow-sm`, `drop-shadow-md`, `supports-backdrop-filter:backdrop-blur-xs`, `h-9`, `size-3.5`, `min-w-36`, `w-px`, `text-lg`, `tracking-tight`, `animate-pulse`, `data-open:animate-in`, `zoom-in-95`, `animate-caret-blink`, `rounded-full` (in `card.svelte`), `cn-font-heading`, `focus-visible:focus-ring-none` (in `input.svelte`), `border-l-4`, `border-2`, `w-11`.
- **24 new good:** `bg-destructive/10`, `dark:bg-destructive/20`, `bg-success/10`, `dark:bg-success/20`, `shadow-elevation`, `bg-scrim`, `has-[:focus-visible]:focus-ring`, `focus-visible:focus-ring-none` (in `input-group-input.svelte`), `h-lh`, `size-4`, `min-h-16`, `max-w-xs`, `w-full`, `text-5xl`, `tracking-section`, `data-open:animate-enter`, `data-closed:animate-exit`, `animate-spin`, `rounded-full` (in `four-dot.svelte`), `aria-invalid:border-destructive`, `text-destructive`, `h-(--line-width)`, `border-b-(length:--focus-width)`, `border-0`.
- So: **59 bad flagged, 0 of 36 good flagged**, and 0 violations across the 133 item files.

### 22. The preview pages and the catalogue

- **33 pages**: the catalogue and 32 item pages, prerendered as `index.html` (`001` decision 24).
- **The catalogue groups items** by `meta.group`, in decision 6's order, each group under an `<h2>` ("Foundation", "Actions", "Surfaces", "Feedback", "Forms"). Each card keeps `001`'s content: type, title linked to its page, description, install command. The server load adds `group` to what it reads.
- **Each new item page has these sections, in order:**
  1. **Header:** eyebrow `registry:ui · <name>`, `h1` with the title, the description, the install command (`001`'s `Eyebrow` and `InstallCommand`).
  2. **Variants:** every variant at every size, each captioned in `code`.
  3. **States:** every state the item has, from its decision: disabled, invalid with error text, busy, checked, indeterminate, open, empty.
  4. **Accessibility:** the item's contract in a short list (role, keys, how it is named).
  5. **Keyboard** (interactive items only): the fixture, `data-testid="keyboard-fixture"`, holding exactly the stops its decision lists.
- **Both themes** come from `001`'s theme toggle and the two Playwright projects. A side-by-side panel is not possible: `.dark` can redefine the variables for a subtree, but nothing redefines the light ones inside a dark page.
- **`001`'s preview components stay**: `Eyebrow`, `InstallCommand`, `ThemeToggle`, `ContrastTable`, `FontPage`. Two may be added: `Specimen` (a captioned slot) and `PreviewSection` (an `h2` section with an id). They live in `src/lib/preview/` and are never items.
- **`data-slot`** is how tests find parts; `data-testid` marks fixtures, as on the `four-dot` page.
- **The `pluto-theme` page** shows the three new colours among its swatches (48), and the six scrim rows in a second table, "Edges over the scrim", built from `contrast.scrim`.
- **Scroll containers.** `001` decision 24 kept them off preview pages. The `table` item's own container is the one exception: it is the item's behaviour. Its preview table fits the 1280 px viewport, so it never overflows and Chromium does not make it a stop.
- Preview pages stay outside the lint (`001` decision 24).

### 23. The tests

`001`'s pattern, extended. Each check is written first and seen failing (constitution §5). Every rule of `001` decision 25 holds: `bun test` for unit and smoke, Playwright for the browser, `--bun` wherever a tool starts.

**Unit tests**: still 8 files in `tests/unit/`.

1. `tokens.test.ts`: 48 semantic names per theme, each naming one of 25 primitive colours; 25 of 25 are 6- or 8-digit hex; `elevation.y` and `elevation.blur` are ladder steps; `contrast.scrim` names only semantic colours. `scripts/tokens.ts` validates the two new keys.
2. `contrast.test.ts`: `001`'s checks unchanged (100 pairs, 2 exceptions, 8 tint hexes, 3 forbidden pairs). Plus 6 scrim rows: each composited ground equals decision 7's hex, each ratio equals its value, and 6 of 6 meet 3:1.
3. `generated.test.ts`: `001`'s checks, now over the new output. Plus: `pluto-theme`'s `css` holds `@utility focus-ring`, `@utility focus-ring-none`, `@keyframes pluto-enter` and `@keyframes pluto-exit`; `cssVars.theme` holds `shadow-elevation`, `animate-enter` and `animate-exit`. 7 of 7.
4. `registry.test.ts`:
   - 32 items, in decision 6's order, with their types; each has `meta.group` among the 5 groups; 0 dependencies with `local:` or a scheme; the 11 distinct registry dependency names each name an item here; 27 of 27 `registry:ui` items have at least 2 files.
   - 26 of 26 new items have `meta.since` `"0.2.0"` and decision 5's `meta.stock`; `cli` equals the locked CLI's version.
   - Built into a temporary folder: 33 files under `r/styles/maia/` and 33 byte-identical under `v0.2.0/r/styles/maia/`; 0 of 2 stale files survive; 32 of 32 parse with `registryItemSchema`; 0 contain `#lib`; every target of the 27 `registry:ui` items starts `<name>/`; `pluto-theme`'s `devDependencies` are still `["shadcn-svelte@^1.7.1"]`; 8 of 8 items of decision 2's `tailwind-variants` row name `tailwind-variants@^3.3.1`, though they import `tailwind-variants/lite`; 0 of 33 built files contain `$UTILS$.js` or `/index.js"` (decision 4, step 6).
   - `wrangler.jsonc`: `001`'s 3 assertions.
   - `CHANGELOG.md`: decision 26's two checks.
5. `previews.test.ts`: 32 of 32 pages exist.
6. `literals.test.ts`: the item files are the 133 of decision 6; 0 violations; 59 of 59 bad samples flagged; 0 of 36 good.
7. `deps.test.ts`: `package.json` names exactly the 23 packages with their specifiers, and `bun.lock` resolves each to decision 2's or `001`'s version. Every package an item names (built `dependencies`, `devDependencies`, and the fonts' `font.dependency`) has a range in `package.json`, equal to the item's where it states one: 9 packages (`001`'s 5 and decision 2's 4). No item names `tailwind-merge`. The `packageManager` and `engines` checks are unchanged.
8. `utils.test.ts`: `001`'s 3 cases, plus 4 that prove `cn` is the one merge engine (decision 2), with `tv` imported from `tailwind-variants/lite`: (a) a `tv` with base `px-3` and variant `px-4` returns a string holding both classes, so `tv` did not merge; (b) `cn` of that string keeps only `px-4`; (c) `cn(tv(…)(), "text-destructive")` keeps `text-base` and `text-destructive`; (d) every item file that imports `tv` imports it from `tailwind-variants/lite`, and any import from the main entry is `import type`: 8 of 8 items. 7 cases.

**Browser tests**: 6 files in `tests/e2e/`. `pages.ts`'s `ITEMS` list follows decision 6.

1. `axe.spec.ts`: 33 pages in 2 themes, plus the `alert-dialog` page with its dialog open in 2 themes: 68 scans, 0 violations.
2. `theme.spec.ts`: `001`'s two checks on 33 pages in 2 themes: 66.
3. `four-dot.spec.ts`: unchanged.
4. `tokens.spec.ts`: `001`'s checks, plus on the `pluto-theme` page in each theme: an element with `shadow-elevation` computes a `box-shadow` holding `--elevation-line`'s colour; an element with `bg-scrim` computes `--scrim`'s colour with its alpha. 2 more per theme.
5. `keyboard.spec.ts`, in both themes:
   - **The catalogue:** 34 stops in order (the lockup, the toggle, the 32 item links in decision 6's order), each with the solid 2 px ring outline; no 35th.
   - **Each interactive item's fixture**, 15 items: the test focuses the fixture's first stop with `locator.focus()`, presses Tab through it, and at each stop checks the element and the outline. The outlined element is the focused one, except in `input-group` (its text controls: the `data-slot="input-group"` ancestor) and `input-otp` (the `data-slot="input-otp"` root). The next Tab must leave the fixture. Stops: button 7, tooltip 1, item 1, collapsible 1, tabs 4, field 2, input 2, textarea 2, input-group 4, native-select 2, checkbox 3, radio-group 1, switch 2, input-otp 1, alert-dialog 1. **34 stops.**
   - **Behaviours**, 9: Space flips a switch and a checkbox; ArrowRight moves tabs; ArrowDown moves the radio; Enter toggles the collapsible; focus opens the tooltip and Escape closes it; Enter on the password toggle flips the type and the name; the alert-dialog's open, initial focus on the element with `data-slot="alert-dialog-cancel"` (our `onOpenAutoFocus`, decision 17), trap, Escape, return of focus and removal; Enter and two clicks on the busy button leave the submit count at 0, keep focus on it, and keep `aria-busy="true"`.
6. `primitives.spec.ts` (new), in both themes:
   - **Heights:** a default button, an icon button, an input, a native select, an input group and an input-otp cell, in one row of a fixture on the `button` page, each measure 48 ± 0.5 px tall; the icon button and the cell are also 48 ± 0.5 px wide. `sm` and `icon-sm` buttons measure 32 ± 0.5 px tall, and `icon-sm` 32 ± 0.5 px wide. Every keyboard stop in every fixture, except a tab panel, is at least 24 × 24 px (R21).
   - **The switch:** the track measures 64 × 32 ± 0.5 px and the thumb 24 × 24 ± 0.5; off and on, the thumb sits 4 ± 0.5 px inside the track's left or right edge and its top, with 0 px overflow.
   - **Invalid border:** on the `input`, `textarea` and `native-select` pages, the invalid control's computed border colour equals `--destructive`, and its ratio against the computed background of its parent ground is at least 3:1.
   - **Elevation and scrim:** with the dialog open, the overlay's background equals `--scrim` with its alpha, its `backdrop-filter` is `none`, and the content's `box-shadow` holds `--elevation-line`'s colour. In dark, that colour measures at least 3:1 against `--background` composited under `--scrim`.
   - **No loop but the spinner:** on the 26 new pages, 0 elements compute `animation-iteration-count: infinite` outside a `data-slot="spinner"`.
   - **The code input:** the real input has `autocomplete="one-time-code"`, `inputmode="numeric"` and a `pattern`; pasting "123456", "123-456" and "123456\n" each fills 6 cells; typing "a" fills none.
   - **Field wiring, before and after hydration:** on the `field` page's wiring fixture, for each of the 7 controls (decision 16), the operable element of decision 11 has an `id` that its label's `for` names (for the radio group, its `fieldset` holds a `legend`), `aria-invalid="true"`, and `aria-describedby` equal to `<id>-description <id>-error`, both of which exist on the page. Checked twice: on the raw prerendered HTML, fetched with Playwright's `request.get` and parsed without running scripts, and on the hydrated page. 7 of 7 controls, 3 attributes each, in each of the two.

**Smoke tests**: 3 files in `tests/smoke/`. `001`'s two are unchanged and still pass (`registry-add.test.ts` installs `four-dot`, now from a 32-item registry).

- **`primitives-add.test.ts`** (new), into each of `001`'s two scratch apps, against this repository's `vite dev`, with the locked CLI, as `registry-add.test.ts` does:
  1. `add field alert-dialog input-otp tabs -y -o` exits 0 with the "unsupported runtime" warning. *Why these four:* together they pull `label`, `separator`, `button`, `spinner`, `utils`, `pluto-theme` and the three fonts, and all four packages of decision 2. `-o` is right here: the scratch app has nothing to protect.
  2. 44 files land: `field` 12, `label` 2, `separator` 2, `alert-dialog` 13, `button` 2, `spinner` 2, `input-otp` 5, `tabs` 5, and `utils` 1.
  3. No placeholder is left, and imports use the app's alias.
  4. `package.json` holds `bits-ui` `^2.20.2`, `@internationalized/date` `^3.12.4`, `tailwind-variants` `^3.3.1` and `phosphor-svelte` `^3.1.1`, and no `tailwind-merge`. (`tailwind-variants/lite` resolves from the app's own `tailwind-variants`; assertion 5 proves it.)
  5. After the test writes a page that renders a `Field` holding an `InputOTP`, a `Tabs` with two tabs, and a closed `AlertDialog`, the app's `vite build` exits 0. The page is prerendered, so every component runs on the server.
  6. `svelte-check` reports 0 errors.
  7. The lint, run with this repository's rules over the 44 installed files, finds 0 violations.

  7 assertions in each of 2 apps: 14.

`bun run test` runs unit, browser and smoke, as `001` set.

### 24. What `003` needs from these items

`003` builds sign in, sign up, page states and the settings form (split decision). It needs, and `002` provides:

1. **The error summary pattern:** `Alert variant="destructive"` renders `role="alert"`, accepts `tabindex="-1"` and binds `ref`, so the block can move focus to it after a failed submit and list each error as a link to its field (decision 19; patterns memo §3.2).
2. **Password show and hide:** `InputGroupPassword` (decision 19).
3. **Field wiring:** `Field`'s context gives every control its `id`, `aria-describedby` and `aria-invalid`; `FieldError` is not a live region (decisions 11 and 16).
4. **The busy button:** `busy` (decision 12).
5. **A six-digit code:** `InputOTP` with paste and `one-time-code` (decision 18).
6. **Headings in surfaces:** `CardTitle` and `EmptyTitle` take `level`, so a page state's title can be its `h1` (decision 19).
7. **A destructive confirm:** `AlertDialog`, starting on Cancel (decision 17).
8. **Settings controls:** `switch`, `checkbox`, `radio-group` in a `FieldSet`, `native-select`, `textarea`.
9. **Static loading:** `Skeleton` (hidden, static) and a labelled `Spinner`.
10. **State labels:** `Badge` and `Alert` in `destructive`, `success` and `caution`.

**The status live region is `003`'s, not `002`'s.** It will be a `status` item: an element with `role="status"` and `aria-live="polite"`, present in the first markup, visually hidden unless asked, whose text the block sets ("Signing in…", "Saved").

- *Why `003`:* the split decision fixes `002` at 26 items, and no `002` item needs a live region inside it. Its first users are `003`'s blocks (submitting, saved, loading), then `006`'s chat. A component, not a `registry:lib` helper, because a live region must exist in the markup before it changes (patterns memo §0.1, MDN), and a component guarantees that where a helper function would not.
- `002` keeps out of its way: `Spinner` is decorative by default, `Alert` sets `role="status"` only for `success` and `caution`, and `FieldError` sets no role.

**The preconditions under which `002`'s announcements work** (review finding 10). `003` honours them; review checks them.

1. **`role="status"` on an `Alert` is announced only if the element exists before its text changes** (patterns memo §0.1; MDN). A `success` or `caution` alert that is rendered at the moment of success may be silent. So `003` announces "Saved" through its `status` item, and treats a status alert as a visible message, not an announcement. An app removes the default role with `role={null}`.
2. **`role="alert"` on a destructive `Alert` is announced when it is inserted** (patterns memo §0.1: ARIA19). That is the error summary's use. It is never used for content already on the page at load.
3. **`FieldError` carries no live region**, so it is sound only when errors appear on submit and focus then moves to the error summary (three or more errors, or a credential failure) or to the first invalid field (patterns memo §3.2, GOV.UK and Primer). Validating while a person types would show errors no one hears.
4. **A labelled `Spinner`** announces its visually hidden label when it is inserted into the page, so `003` inserts it when loading starts and removes it when loading ends.

### 25. The version: 0.2.0, and what it means for 0.1.0

- `package.json`'s `version` becomes **`0.2.0`**. *Why a minor step:* under semver's 0.x reading, a minor step adds features. `002` adds 26 items and adds to `pluto-theme`. It changes no interface of `001`'s items: `pluto-theme`'s new variables, utilities and keyframes are additions, and `utils` and `four-dot` are untouched.
- **`build-registry` writes `static/v0.2.0/r/styles/maia/`** and clears only that folder (`001` decision 18).
- **`static/v0.1.0/` is not made by a clean build.** In a working copy that built `001`, the old folder stays (it is git-ignored), and `vite build` copies it into `build/`. The criteria count on a clean clone.
- *Why nothing removes it:* no release is deployed, so no host keeps older versions (decisions.md, "The registry is served from GitHub, and the repository is public"). 0.1.0 was never deployed, so no app pins its URL.
- **0.1.0 and the commit are the owner's.** Each release is a git tag (`001` decision 18). **The owner chose to commit: `001` is commit `33e94de` on `main`, tagged `v0.1.0`, on 2026-10-28, before any `002` build step.** The install's SHA-256 snapshot (decision 4) is still taken, and the check still never reads `git status`, so the procedure is the same as if they had not. 0.1.0 is recoverable from the tag.
- New items carry `meta.since` `"0.2.0"`. `001`'s six keep `"0.1.0"`.

### 26. The changelog

- `CHANGELOG.md` gains `## 0.2.0 — <landing date>` above `0.1.0`.
- One line per new item, each marked "new"; one line for `pluto-theme` naming the additions (elevation, scrim, `focus-ring`, `focus-ring-none`, `animate-enter`, `animate-exit`), marked additive, not an interface change.
- `registry.test.ts` checks: the `0.2.0` entry names 27 of 27 (`pluto-theme` and the 26), and the `0.1.0` entry still names its 6.

### 27. Build order

One builder, in this order. Previews and tests go with each step, not at the end.

1. **Tokens and theme** (decisions 3, 7, 8): the token file, `scripts/tokens.ts`, `build-tokens.ts`; then `tokens.test.ts`, `contrast.test.ts`, `generated.test.ts`. Version to 0.2.0.
2. **The lint** (decision 21) and `literals.test.ts`, with every sample. Seen failing on the stock files once they land.
3. **The install** (decisions 2, 4, 5): all 26 at once, after the whole-tree snapshot; packages pinned; provenance recorded. `001` is committed and tagged `v0.1.0` (decision 25); the snapshot is taken all the same.
4. **The shared recipe on three items**: `button` (with `spinner`), `input`, `field` (with `label` and `separator`). Their preview pages; the heights fixture; the keyboard fixtures for these. This settles decisions 8, 10 and 11 before anything else copies them.
   - **Checkpoint: a review after step 4.** The builder stops and asks the design lead for a short review of these three items, their heights, their focus and the field wiring in the raw prerendered HTML, before step 5 copies the recipe into 23 more items. *Why:* that is where the review's two High findings and finding 4 would bite first (review finding 15).
5. **The other form controls:** `textarea`, `native-select`, `input-group`, `checkbox`, `radio-group`, `switch`, `input-otp`.
6. **Surfaces:** `card`, `item`, `table`, `tabs`, `collapsible`, `avatar`.
7. **Feedback and the rest:** `alert`, `badge`, `empty`, `skeleton`, `tooltip`, `kbd`, `alert-dialog` (the elevation and scrim).
8. **Registry and catalogue:** `registry.json` entries, `meta.group`, the grouped catalogue, `registry.test.ts`, `previews.test.ts`, `deps.test.ts`, `utils.test.ts`.
9. **Browser and smoke suites** in full; `CHANGELOG.md`.

**If time runs short**, two parts may be deferred, each recorded in the Landing notes as deferred, not dropped: the comparison of the live stock JSON with the prior-art clone (criterion 24's last sentence), and the `table` item's `label` region (decision 19). Nothing else is deferrable: the 26 are fixed by the split decision. Neither was deferred: Landing note 3 holds the comparison, and `table` has its `label` prop.

### 28. Calls settled elsewhere

None blocked the build.

- **Settled by the design lead after review**, and cited, not flagged: round radios (decision 19), the switch geometry, revised once to ladder values (decision 14), ladder control heights (decision 10), untinted badges (decision 19). All four are in decisions.md's entry "The primitives split in two, and the design calls for `002`".
- **The owner's, answered:** `001` is committed and tagged `v0.1.0` before build step 3 (decision 25).
- **The light shadow's numbers** (12 px offset, 32 px blur, ink at 16%) are a design choice. In `002` the scrim, not the shadow, separates the dialog (decision 7), so nothing here depends on them. `004` tests them on its popover (`004` decision 11, browser check P1).

## Design

How the pieces fit.

```
tokens/pluto.tokens.json   + elevation, scrim (3 primitives, 3 semantic colours, elevation.y/blur, contrast.scrim)
        │  bun run build:tokens
        ├──► registry.json   pluto-theme: 48 colours per theme; shadow-elevation, animate-enter/exit in theme;
        │                     @utility focus-ring, focus-ring-none; @keyframes pluto-enter, pluto-exit in css
        └──► src/app.css

shadcn-svelte stock registry ── bun --bun node_modules/.bin/shadcn-svelte add <26 names> -y  (once, decision 4)
        └──► src/lib/registry/ui/<name>/   ── restyled by decision 9 ──►  listed in registry.json (decision 6)

registry.json + src/lib/registry/**
        │  bun run build:registry
        ├──► static/r/styles/maia/          index.json + 32 item files
        └──► static/v0.2.0/r/styles/maia/   the same 33 files

src/routes/+page.svelte            the catalogue, grouped by meta.group
src/routes/items/<name>/+page.svelte   32 pages: header, variants, states, accessibility, keyboard fixture
```

**The token file's new keys**, abridged:

```json
{
  "primitives": { "…": "…", "ink-shadow": "#14161C29", "ink-scrim": "#14161C80", "ink-scrim-deep": "#14161C99" },
  "themes": {
    "light": { "…": "…", "elevation-line": "line", "elevation-shadow": "ink-shadow", "scrim": "ink-scrim" },
    "dark":  { "…": "…", "elevation-line": "paper-line-input", "elevation-shadow": "clear", "scrim": "ink-scrim-deep" }
  },
  "elevation": { "y": 12, "blur": 32 },
  "contrast": {
    "…": "…",
    "scrim": [
      { "theme": "light", "edge": "popover", "over": "background", "scrim": "scrim", "min": 3 },
      { "theme": "dark", "edge": "elevation-line", "over": "muted", "scrim": "scrim", "min": 3 },
      "…"
    ]
  }
}
```

**What `build-tokens` adds to `pluto-theme`:**

| Field | Key | Value |
|---|---|---|
| `cssVars.light`, `.dark` | `elevation-line`, `elevation-shadow`, `scrim` | the hexes of decision 7 |
| `cssVars.theme` | `shadow-elevation` | `0 0 0 var(--line-width) var(--elevation-line), 0 0.75rem 2rem 0 var(--elevation-shadow)` |
| `cssVars.theme` | `animate-enter` | `pluto-enter var(--motion-micro) cubic-bezier(0.2, 0.7, 0.3, 1)` |
| `cssVars.theme` | `animate-exit` | `pluto-exit var(--motion-micro) cubic-bezier(0.2, 0.7, 0.3, 1) forwards` |
| `css` | `@keyframes pluto-enter` | `from { opacity: 0 }` |
| `css` | `@keyframes pluto-exit` | `to { opacity: 0 }` |
| `css` | `@utility focus-ring` | `outline: var(--focus-width) solid var(--ring); outline-offset: var(--focus-offset)` |
| `css` | `@utility focus-ring-none` | `outline: none` |

`001` decision 15's rules hold: no declaration directly inside an at-rule other than `@utility` (as `groove` already is), and no `:root` or `.dark` inside an at-rule. The keyframes' `from` and `to` are rules, not declarations. That the CLI writes them unchanged on every `add` is INFERRED; smoke assertion 5 (the build) and `001`'s "second add changes nothing" assertion prove it.

## Scope

**In** (the work to *built*):

- The token file's new keys; `scripts/tokens.ts` and `scripts/build-tokens.ts` taught them; `scripts/contrast.ts` given the scrim rows; the regenerated `registry.json` fields and `src/app.css`.
- `scripts/lint-literals.ts`'s 14 rules and their allowlists (`rounded-full`, `focus-ring-none`).
- The 4 packages of decision 2 in `package.json` and `bun.lock`.
- The 26 items under `src/lib/registry/ui/`, 129 files, and their 26 entries in `registry.json`, plus `meta.group` on `001`'s six.
- 26 preview pages; the grouped catalogue; the `pluto-theme` page's scrim table; up to two preview components.
- Tests: 8 unit files (updated), 6 browser files (4 updated, `four-dot.spec.ts` unchanged, 1 new), 3 smoke files (1 new).
- `package.json` version 0.2.0; the `CHANGELOG.md` entry.

**The step to *done*** is the release: the change is reviewed, the Landing notes cite the review, and the commit is tagged `v0.2.0` (criterion 25; constitution §2 and §4.2).

**Out:**

- Everything the split decision gives `003` to `006`: the blocks, the block viewer, `code-block`, the highlight palette, `chart`, `popover`, `accordion`, `toggle`, `scroll-area`, the editor and its tabs, `dropdown-menu`, `sheet`, `sidebar`, `breadcrumb`, `sonner`, `mode-watcher`, the chat primitives.
- The `status` live-region item (`003`, decision 24).
- The icon files, the doc-ID scheme, coloured dots on ink (`001` decision 28).
- Deployment and retaining old versions on the host.
- `tailwind-merge`, `tw-animate-css`, `form`, `formsnap`, `sveltekit-superforms`.
- A vertical groove (`005` decision 5).

## Acceptance criteria

Each is a count, checked by the command named. "Clean clone" is `001`'s. Every command runs under Bun. Criteria 1 to 24 make `002` *built*; criterion 25 makes it *done*.

1. **Install.** On a clean clone, `bun install --frozen-lockfile` exits 0. `deps.test.ts` finds 23 packages in `package.json` with their specifiers, and `bun.lock` resolves 23 of 23 to the versions of decision 2 and `001` decision 4. `packageManager`, `engines` and no `.nvmrc`: 3 of 3.
2. **Checks.** `bun run check` reports 0 errors and 0 warnings. `bun run lint` exits 0.
3. **Tokens.** `bun run build:tokens` run twice changes 0 files the second time. `tokens.test.ts` finds 48 semantic names per theme (96 values), each naming one of 25 primitive colours; 25 of 25 are 6- or 8-digit hex; `elevation` holds 2 ladder steps.
4. **Contrast.** `contrast.test.ts` passes `001`'s checks unchanged (3 reference ratios; 100 pairs, 98 passing and 2 recorded exceptions; 8 tint hexes; 3 forbidden pairs), and 6 of 6 scrim rows equal decision 7's composited hexes and ratios, each at least 3:1.
5. **Generated files.** `generated.test.ts` finds 2 of 2 files equal to a fresh run; 0 nested `:root` or `.dark`; the reduced-motion block's 2 selectors; and 7 of 7 new theme entries (2 utilities, 2 keyframes, 3 theme variables).
6. **Registry source.** `registry.test.ts`: `registry.json` parses; 32 items in decision 6's order and types; 32 of 32 with a `meta.group` among 5; 0 dependencies with `local:` or a scheme; 11 of 11 distinct registry dependency names resolve here; 27 of 27 `registry:ui` items have at least 2 files; 26 of 26 new items carry `meta.since` `"0.2.0"` and a 5-field `meta.stock`.
7. **Registry build.** `bun run build:registry` exits 0 and writes 33 files to `static/r/styles/maia/` and 33 byte-identical files to `static/v0.2.0/r/styles/maia/`. In a temporary folder: 0 of 2 stale files survive; 32 of 32 items parse with `registryItemSchema`; 0 files contain `#lib`; every target of 27 of 27 `registry:ui` items starts `<name>/`; 8 of 8 `tailwind-variants` items name `tailwind-variants@^3.3.1`; 0 of 33 built files contain `$UTILS$.js` or `/index.js"`.
8. **Site build.** On a clean clone, `bun run build` exits 0. `build/` holds 33 files under `r/styles/maia/`, 33 under `v0.2.0/r/styles/maia/`, 0 under `v0.1.0/`, and 33 prerendered pages.
9. **Dev server.** With `bun run dev` running, `GET /r/styles/maia/index.json` answers 200 with 32 items.
10. **Preview pages.** `previews.test.ts` finds 32 of 32.
11. **The lint.** `literals.test.ts` finds 133 item files and 0 violations in them; it flags 59 of 59 bad samples and 0 of 36 good samples. `bun scripts/lint-literals.ts` exits 0.
12. **Named dependencies.** `deps.test.ts` finds 9 of 9 packages that items name in `package.json`, each with the item's range where it states one; 0 items name `tailwind-merge`.
13. **The merge path.** `utils.test.ts` passes 7 of 7 cases: `tailwind-variants/lite` leaves both classes, `cn` merges them, and 8 of 8 `tv` items import `lite`.
14. **axe.** `axe.spec.ts` reports 0 violations across 68 scans (33 pages and 1 open dialog, in 2 themes).
15. **Themes.** `theme.spec.ts` passes 66 of 66.
16. **The mark and tokens in the browser.** `four-dot.spec.ts` passes as in `001` (20 of 20, and 4 of 4 names). `tokens.spec.ts` passes `001`'s checks and 2 of 2 new ones in each of 2 themes.
17. **Keyboard.** `keyboard.spec.ts`, in 2 of 2 themes, finds the catalogue's 34 stops in order with the ring outline at 34 of 34; 34 of 34 fixture stops across 15 items, each with the outline on the right element; and 9 of 9 behaviours, the alert dialog's initial focus on `[data-slot=alert-dialog-cancel]` among them.
18. **Heights and targets.** `primitives.spec.ts`, in 2 themes: 6 of 6 default controls 48 ± 0.5 px tall, and 2 of 2 of them (icon button, code-input cell) 48 ± 0.5 px wide; 2 of 2 small buttons 32 ± 0.5 px tall, and `icon-sm` 32 ± 0.5 px wide; the switch's track and thumb at 64 × 32 and 24 × 24, the thumb 4 px inside the track in 2 of 2 states, 0 px overflow; 0 keyboard stops under 24 × 24 px.
19. **Invalid, elevation and scrim.** `primitives.spec.ts`, in 2 themes: 3 of 3 invalid borders equal `--destructive` at 3:1 or more; the open dialog's overlay equals `--scrim` with `backdrop-filter: none`, and its shadow holds `--elevation-line`; in dark, that edge measures 3:1 or more over the scrimmed ground.
20. **Motion.** `primitives.spec.ts` finds 0 infinitely looping animations outside a spinner across the 26 new pages, in 2 themes.
21. **Code input and field wiring.** `primitives.spec.ts`, in 2 themes: 3 of 3 attributes on the real input; 3 of 3 pastes fill 6 cells; 1 of 1 letter rejected; 7 of 7 controls carry `id`, `aria-invalid` and `aria-describedby` naming 2 ids present on the page, in the raw prerendered HTML and again after hydration (14 of 14 checks).
22. **Smoke.** `primitives-add.test.ts` passes 7 of 7 assertions in each of 2 scratch apps (14 of 14). `001`'s `registry-add.test.ts` still passes 20 of 20 and `dev-loop.test.ts` 3 of 3.
23. **Test files.** On a clean clone, `bun run test` exits 0, having run 8 unit files, 6 browser files in 2 projects and 3 smoke files.
24. **Release.** `package.json`'s `version` is `0.2.0`. `registry.test.ts` finds the `0.2.0` changelog entry naming 27 of 27 items and the `0.1.0` entry still naming 6 of 6. The Landing notes record, for 26 of 26 items, whether the live stock JSON equalled the prior-art clone's.
25. **Released.** The change is tagged `v0.2.0` and the Landing notes cite its review.

## Landing notes

- **Built:** 2026-10-28, committed as `7857ea4` and tagged `v0.2.0`. The change review is [`../reviews/002-the-primitives-forms-surfaces-and-feedback-pr-2026-10-28.md`](../reviews/002-the-primitives-forms-surfaces-and-feedback-pr-2026-10-28.md): "Does not land yet" on 4 Medium and 8 Low findings; 10 fixed and 2 answered in its Disposition, four of them by the design lead's calls in `decisions.md`.

**What the design lead saw, under Bun 1.3.14, 2026-10-28 (EXECUTED):**

| Check | Result |
|---|---|
| `bun run check` | 1045 files, 0 errors, 0 warnings |
| `bun run lint` | exit 0 |
| `bun run build` | 33 registry files, 33 versioned files, 33 prerendered pages (a clean copy: 0 under `v0.1.0/`) |
| `bun run test`, twice in a row | exit 0: unit 348 pass (8 files), browser 330 passed (6 files × 2 projects), smoke 36 pass (3 files) |

**Criteria, as counted at landing (EXECUTED by the builder; 1 to 24 also by the reviewer):**

| # | Count |
|---|---|
| 1 | frozen install exits 0; 23 of 23 specifiers and lock versions; 3 of 3 Bun checks |
| 2 | 0 errors, 0 warnings; lint exit 0 |
| 3 | second `build:tokens` changes nothing; 48 names × 2 themes; 25 of 25 primitives; 2 ladder steps |
| 4 | `001`'s checks unchanged; 6 of 6 scrim rows at their hexes and ratios, each ≥ 3 |
| 5 | 2 of 2 files; 7 of 7 new theme entries |
| 6 | 32 items in order, 32 of 32 groups, 11 of 11 dependency names, 27 `registry:ui`, 26 of 26 `meta.stock` |
| 7 | 33 + 33; 0 of 2 stale; 32 of 32 parse; 8 of 8 `tailwind-variants@^3.3.1`; 0 `.js` imports |
| 8 | clean copy: 33, 33, 0, 33 |
| 9 | 200 with 32 items |
| 10 | 32 of 32 |
| 11 | 133 files, 0 violations; **64 of 64 bad, 0 of 39 good** (decision 21's 59 and 36, plus note 6's five rules) |
| 12 | 9 of 9; one range per package across items; no `tailwind-merge` |
| 13 | 7 of 7 |
| 14 | 68 scans, 0 violations |
| 15 | 66 of 66 |
| 16 | four-dot 28 (20 geometry and colour checks, and 4 names in each of 2 themes); tokens 70 (35 per theme, the 2 new ones in each) |
| 17 | 34 catalogue stops; 34 fixture stops over 15 items, each checked by role and name; 9 of 9 behaviours |
| 18 | 6 of 6 at 48, 2 of 2 square; 2 of 2 at 32; switch 64 × 32 and 24 × 24, 4 px inside; 0 stops under 24 |
| 19 | **4 of 4** invalid borders (the code input's cells added, review finding 2); scrim, `backdrop-filter: none`, `elevation-line` |
| 20 | 0 loops outside a spinner on 26 pages |
| 21 | 3 of 3 attributes; 3 of 3 pastes; the letter leaves value and cells empty; wiring 7 of 7 controls, the radio group named by its legend, and 2 of 2 checkbox sets (fieldset described, distinct ids, no shared `aria-invalid`), raw and hydrated |
| 22 | 14 of 14; `registry-add` 20 of 20; `dev-loop` passes |
| 23 | 8, 6 and 3 files; exit 0 |
| 24 | `0.2.0`; 27 of 27 and 6 of 6 in the changelog; the clone comparison is note 3 |
| 25 | met |

**Notes:**

1. **A cancelled animation failed one run** (the design lead, EXECUTED). One full run failed once: `primitives.spec.ts` "elevation and scrim", dark project, `evaluate: AbortError: The user aborted a request` at `Promise.all(document.getAnimations().map((a) => a.finished))`. A cancelled animation rejects its `finished` promise. The design lead added `settled(page)` to `tests/e2e/pages.ts`, which skips infinite animations and treats a cancelled one as finished, and used it at the three page-wide waits in `axe.spec.ts` and `primitives.spec.ts`. The affected specs then passed 3 of 3 runs, and the full suite 2 of 2.
2. **The checkpoint after build step 4.** The builder stopped with `button`, `spinner`, `input`, `field`, `label` and `separator` restyled and reported heights (48 and 32 as specified), the focus outline (2 px solid `--ring`, 2 px offset) and the field wiring in the raw prerendered HTML. The design lead sent back four changes, all applied: a horizontal `Field` is a two-column grid, so the label, description and error stack beside the control; no control transitions `outline-color`, so focus is instant; every icon an item renders is `aria-hidden`; and `bun run check`'s prior-art noise is removed (note 4, last group).
3. **Provenance.** All 26 stock items were installed in one `add` at 12:36 UTC. Their live JSON, fetched the same minute, equals the prior-art clone's at `6149e14` for 25 of 26; `native-select` differs by one type line (`WithElementRef<HTMLSelectAttributes, HTMLSelectElement>`). The reviewer re-fetched 5 of 5 and found them equal to `meta.stock.sha256`. The whole-tree snapshot showed only `package.json` and `bun.lock` changed outside the 26 folders; nothing was restored.
4. **Where the build deviates from a decision, and who allowed it.**
   - *Field wiring (decision 11).* `FieldLabel` points `for` at the nearest `Field`'s control through a second internal key, `pluto:field-label`; the design lead accepted it at the checkpoint. After review finding 1, by the design lead's call, `FieldSet` no longer sets `pluto:field`: it describes its own `<fieldset>` and sets `pluto:field-set`, which only `radio-group` reads, so a checkbox takes its own `Field`'s ids or none. Finding 8: the radio group is named by the set's `FieldLegend` through `aria-labelledby`.
   - *Tooltip (decision 19).* bits-ui 2.20.2 gives tooltip content no role, so ours sets `role="tooltip"`. Its provider closes a tooltip on any scroll, and Tab to an off-screen trigger scrolls; after finding 3, by the design lead's call, our `Tooltip` reopens it on the next frame while the trigger keeps keyboard focus, unless Escape or the pointer dismissed it.
   - *`InputOTP` (decision 18).* PinInput gives its root only `class`, so our root is a wrapping `div` with `data-slot="input-otp"`, which draws the focus ring and, after finding 2, the cells' invalid border.
   - *Switch (decision 14, R3).* Invalid is said in words only; a required consent is a checkbox. The design lead's call after finding 9.
   - *Table (decision 19).* A selected row keeps `bg-accent` and adds a `border-l-(length:--focus-width) border-l-primary` edge; `aria-selected` is gone from `<tr>`, and a selectable row carries a checkbox cell. The design lead's call after finding 12.
   - *Item.* Inside an `ItemGroup`, an `Item` renders `role="listitem"` itself (finding 12).
   - *`bun run check` (`001` decision 26).* svelte-check searches the workspace for config files and loaded the prior-art clone's; the script adds `--config ./vite.config.ts`. It changes no checked file (1045 either way, the reviewer confirmed); it removes the noise. The design lead's request at the checkpoint.
5. **Smaller deviations from the specification:** registry entries were added as each item landed, not at step 8; `src/app.css` places the theme's keyframes inside `@theme inline`, where the CLI puts them in apps, and the smoke helper skips nested blocks; `badge` was restyled a step early; `InputGroupPassword` renders its own group and has a bindable `shown`; `textarea` resizes vertically; a choice card's control also needs `aria-labelledby` on its title.
6. **The lint.** Decision 21's 14 rules, then five more after review finding 10: `focus-ring` only in `input-group.svelte` and `input-otp.svelte`; numeric position and translate offsets on the ladder; no palette colour through the variable form; no `scale-*`; no named colour in an SVG paint attribute. Samples: 64 bad, 39 good. Words in comments are tokens too, so prose in items avoids the bare words `ring`, `outline` and `shadow`.
7. **Design-lead calls in `decisions.md` that the build applied:** the 26 items and five groups; untinted badges; round radios; the 32 × 64 switch with a 24 px thumb; ladder heights 32 and 48 with no `lg`; blue switches and checked states; the busy button; elevation and scrim tokens; `input-otp`'s paste and `one-time-code`; no `tw-animate-css`; phosphor icons; and, after the change review, the four on tooltips, sets, switches and table rows.
8. **The table page failed in development only** (the design lead, EXECUTED). On `bun run dev`, `/items/table/` rendered SvelteKit's 500 page: `Svelte error: props_invalid_value — Cannot do bind:checked={undefined} when checked has a fallback value`, because the preview's `selected` map named only the selected row. It is a development-mode check, so the production build the browser suites test against rendered the page and every suite passed. The preview now initialises every row's entry. A walk of all 33 pages in both themes on the dev server, collecting page errors and console errors and warnings, found 0 of 66 with any. Review addendum, item 2. The suites test the production build and cannot see a development-only error, so the walk is by hand; `004` makes it an acceptance criterion (its criterion 25).
9. **For `003` and `004`.** An icon an app passes into a button or addon needs `aria-hidden="true"` (phosphor renders `role="img"` with no name). `field-sizing` grows a textarea in all three engines (decision 13). `tw-animate-css` is absent: open and close motion is `animate-enter` and `animate-exit` with the theme's `pluto-` keyframes. A clean build has no `v0.1.0/` folder; a working copy that built `001` keeps its git-ignored `static/v0.1.0/`.
