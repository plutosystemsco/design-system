# 010 — The stage compositions

- **Status:** built, reviewed and released in `v0.11.0` with `009` to `012` (2026-11-07). Its specification review is [`../reviews/010-the-stage-compositions-spec-2026-11-01.md`](../reviews/010-the-stage-compositions-spec-2026-11-01.md) (15 findings, 2 High, dispositioned below); its change review is [`../reviews/010-the-stage-compositions-pr-2026-11-01.md`](../reviews/010-the-stage-compositions-pr-2026-11-01.md) (1 High, 2 Medium, 7 Low, all fixed or answered).
- **Date:** 2026-11-01
- **Author:** the design lead
- **Kind:** nine new expressive-only registry items in a new group, `compositions`, and one new block, `product-home`; their preview pages, views and tests; the 0.10.0 release.
- **Depends on:** [`009`](./009-expressive-mode-and-the-brand-slots.md): the stage and its wash, light, the veil, `type-*`, the motion and size variables, `--size-hero-fill`, the sticky-bar rule, the lint profile and `read-token` with `tween`.
- **Research it stands on:** the product-site memo, the brands memo (§4: "finished" pages are one claim, then proof, names and the product working) and the systems memo (§2.4: compositions as a layer on the same foundations), all of 2026-11-01.
- **Design calls:** `../decisions.md`, "The identity is commissioned, with options" (2026-11-01).

## Intent

A brand shows at the level of the page section (product-site memo). The registry composes an app (`app-shell`) but not a page meant to persuade.

This specification adds the sections of a product's home page, built only from `009`'s tokens and utilities, and one block, `product-home`, that renders the owner's chosen hero, a proof band and a live console with **zero literal values and zero lint exceptions**: the product-site memo's first release criterion.

The compositions hold roles, never values. When the owner picks the identity, the slots change and every composition follows.

**Terms of art** are `009`'s. A **composition** is a page section delivered as a registry item. A **count-up** is a number that rises to its value once, when it first enters the screen.

**Not here:** the identity's values; product themes; any change to an existing item; a real search backend (the block passes scripted functions an app replaces).

## Decisions

### 1. The items

All have `meta.modes: ["expressive"]`, `meta.since: "0.10.0"`, and `meta.group: "compositions"`, except the block, whose group is `blocks` like every block (review finding 12).

| Item | Type | Registry dependencies (besides `utils`, `pluto-theme`) |
|---|---|---|
| `stage` | `registry:ui` | — |
| `stage-card` | `registry:ui` | `code-block`, `button`, `status` |
| `marketing-bar` | `registry:ui` | `button`, `sheet` |
| `stage-hero` | `registry:ui` | `button` |
| `proof-band` | `registry:ui` | `read-token` |
| `live-console` | `registry:ui` | `tabs`, `code-block`, `button`, `meter`, `status`, `read-token` |
| `name-strip` | `registry:ui` | — |
| `cta-band` | `registry:ui` | `button` |
| `marketing-footer` | `registry:ui` | — |
| `product-home` | `registry:block` | the nine, `four-dot` |

- A unit test checks that every import in an item's files is an item it names (review finding 2); the existing import check gains `#lib/registry/lib/*`.
- Files live under `src/lib/registry/ui/<item>/` with an `index.ts`; the block at `src/lib/registry/blocks/product-home/+page.svelte`.
- **The block's one file carries an explicit target,** `product-home/+page.svelte`, in `registry.json` (the build's finding). The CLI computes `<block>/<base name>` only for a block with more than one file; for one file it would target the bare `+page.svelte` and overwrite the app's home page, which `003` decision 3 protects. The target names no root file, so `003`'s rule against root targets holds. Every other block's page file still carries none.
- The registry grows from 64 to 74 items.

### 2. `stage`

- Props: `children`, `labelledby?`, `label?`, `class?`, `element?: "section" | "div"` (default `section`).
- Root: `class="dark surface-stage overflow-x-clip"` and `data-mode="expressive"`. Inner container: `mx-auto max-w-7xl px-(--gutter-stage)`.
- _Why `overflow-x-clip`_ (review finding 13): a bloom may extend past the section; `clip`, unlike `hidden`, keeps `sticky` working inside.
- _Why a component:_ the dark scheme, the stage surface and the mode must travel together.

### 3. `stage-card`

- Props: `title: string`, `code: string`, `language`, `run?: () => Promise<string[]>`, `runLabel = "Run"`, `onstate?: (state: "idle" | "busy" | "done" | "error") => void`.
- Root: `rim overflow-hidden energized`, on `bg-card` (the stage's raised ground). Inside it composes `code-block` with its header, title, copy button and content, as `code-block`'s own page shows (review finding 12); `code-block` is compositional and its copy button is a part, not a prop.
- With `run`, the header holds a `button` at `h-(--size-action-small)`. Pressing it sets `data-busy` on the root and `aria-busy="true"` on the output list, and calls `onstate("busy")`.
- On resolve: the lines render in an output list (`ul`, `font-mono`), `onstate("done")`, and `status` is cleared and then, on the next frame, set to "Ran. N lines." _Why clear first_ (review finding 8): a polite region announces a change; the same text twice is no change.
- On reject: busy ends, one line in `text-destructive` gives the error's message, `onstate("error")`, and `status` says "Run failed." (review finding 8).
- While busy the button shows `button`'s busy state and keeps focus (`002`).

### 4. `marketing-bar`

- Props: `logo: Snippet<[place: "header" | "footer"]>` (the `008` shape), `homeLabel: string`, `links: { label, href }[]`, `secondary?`, `primary?` (`{ label, href }`), `label = "Main"`.
- Root: `<header class="dark surface-stage veil sticky top-0 z-10" data-sticky-bar>` (review finding 1). It lives at the page's top level, outside any `stage`, so it stays stuck for the whole page.
  - `009` makes `veil` a plain rule after `surface-stage`, so the veil's translucent ground wins while the stage's roles colour the text.
  - Text on it uses the stage roles; their worst case is the veil over white: `stage-muted` 5.38, `stage-primary` 5.35 (`009` decision 4).
  - `data-sticky-bar` turns on `009`'s `scroll-padding-top`, so focus is never hidden under it (WCAG 2.4.11, review finding 4).
- Inside: a skip link "Skip to content" to `#main` as its first child, visible on focus; the home link holding `{@render logo("header")}` and named by `homeLabel`; a `nav` named by `label` holding the links; the actions.
- Actions are `button` as links at `h-(--size-action-small)`, pills by `rounded-action`.
- Below `md`, the links and the secondary action move into a `sheet` opened by a button named "Menu" (`006`).
- Height `h-(--size-bar)`; a bottom border `border-border`.
- `overlay?: boolean` (default false) adds `-mb-(--size-bar)`, so the bar floats over the section below it instead of sitting above it. _Why_ (the build's checkpoint 1): over the light page's ground the bar reads as a grey band above a black stage; floating it over the first stage reads as one finished surface. `product-home` sets it.

### 5. `stage-hero`

- Props: `eyebrow?`, `title`, `description`, `actions` (one or two `{ label, href, variant? }`), `object?: Snippet`, `strip?: Snippet`, `lit = $bindable(false)`, `fill = true`, `headingLevel: 1 | 2 = 1`.
- The title is `type-display text-balance` at `headingLevel`. _Why the prop_ (review finding 5): the block's hero is the page's one `h1`; an item page that shows it beside its own `h1` passes 2.
- The description is `text-muted-foreground max-w-prose`, at the type ladder's body step.
- Actions are `button` at `h-(--size-action)`, inside `action-press`.
- The object sits in a `bloom` wrapper whose `data-lit` follows `lit`.
- `fill` sets `min-h-(--size-hero-fill)`: the screen's height less the bar (review finding 10), with the strip at the bottom, so the next section is below the fold.
- `underBar?: boolean` (default false), for a hero beneath an overlaying bar: `min-h-svh` and `pt-(--size-bar)` instead, so the hero fills the whole screen and its words clear the bar.
- Two columns from `lg`; one below, the object after the words.

### 6. `proof-band`

- Props: `items: { value: number; prefix?: string; suffix?: string; label: string }[]` (two to four), `title?: string`, `headingLevel: 2 | 3 = 2`.
- A `section`; with `title`, an `h2` names it (`type-section`); without, `aria-label` names it from a `label` prop, required when `title` is absent (review finding 5).
- Each number is `type-proof`; its label below in `text-muted-foreground`. Numbers are formatted by `Intl.NumberFormat` with the page's `lang`, rounded to integers while counting (review finding 9).
- **States** (review finding 9):
  - The prerendered HTML shows the final values.
  - On hydration, if the band already intersects the viewport, nothing animates.
  - If it does not, the visible digits are set to 0, out of sight, and on first intersection `tween` (from `read-token`) counts them to their values over `--motion-fill` on `--ease-standard`. Once, per page load.
  - Under reduced motion `--motion-fill` reads `0ms`, so `tween` sets the final value at once.
- The animated digits are `aria-hidden`; a visually hidden copy holds the final value from the first render, so a screen reader hears it once.
- It has no ground of its own; a parent places it.

### 7. `live-console`

- Props: `examples: { label: string; command: string }[]` (one to four), `language?` (the examples' code language, for `code-block`; added at the change review, since the examples became Python calls), `run: (command: string) => Promise<{ meters: { label: string; value: number; max: number }[]; lines: string[] }>`, `title: string`.
- Root: `data-mode="productive"`, `energized`, on `bg-card`, with the `rim` utility. _Why productive_ (systems memo §7.2): it is a working tool shown on a stage; its tabs and buttons keep the productive radius and size.
- A heading names it (`h2`, the productive section step).
- `tabs`: one trigger per example; each panel holds the example's command in a `code-block` (review finding 7).
- A `button` "Run" runs the selected command. While pending: `data-busy` on the root, the button busy.
- **Meters fill after the run resolves** (review finding 7): each `meter` starts at 0 and `tween` carries its `value` to the result over `--motion-fill`. A meter row is its label, the `meter` (with `h-(--size-track)`), and `value / max` in mono beside it, the pattern of `meter`'s own page. The fill is a value change, so `meter` itself is unchanged.
- The lines render below; `status` is cleared, then set, as in decision 3. On reject: an error line and "Run failed.".

### 8. `name-strip`, `cta-band`, `marketing-footer`

- **`name-strip`**: props `label` (the list's accessible name) and `names: string[]`. A `ul` in `font-mono text-sm text-muted-foreground`, wrapping.
- **`cta-band`**: props `title`, `description?`, `actions`, `headingLevel: 2 | 3 = 2`. Heading `type-section`. No ground of its own.
- **`marketing-footer`**: props `logo: Snippet<[place: "header" | "footer"]>`, `appName`, `groups: { title: string; links: { label, href }[] }[]`, `tagline?`, `commit?`, `builtAt?`, `docId?`, `sourceHref?`, `statement?` (the sentence `app-shell-footer` calls `statement`, review finding 12).
  - A `footer` (`contentinfo`). Each group is a `nav` named by its title, which is an `h2` at the small mono eyebrow step.
  - The build facts follow `app-shell-footer`'s rules (`006` decision 16, `008` decision 3): the same row names and the same omissions when a value is absent.
  - _Why not import `app-shell-footer`:_ it is part of the `app-shell` item; depending on it would install the whole shell. The rules are cited, not copied.

### 9. `product-home`

The block, in order:

1. `marketing-bar`, at the top level.
2. `<main id="main" tabindex="-1">` holding:
   1. a `stage` holding `stage-hero` (`h1`), whose object is two `stage-card`s (a shell line, and a short Python program with `run`), whose `onstate` lights the hero's bloom; and a `name-strip`;
   2. a `proof-band` on the page's ground, titled;
   3. a `stage` holding the `live-console`;
   4. a `cta-band`.
3. `marketing-footer`.

- **Its view renders without a `<main>` of its own** (review finding 4), in the `(shell)` route group whose layout adds none (`006` decision 12), at `/view/product-home/`.
- The logo snippet passes `Lockup` with `entrance` in the header place only: the page's one entrance (`006` decision 5).
- **Sample copy,** every claim true where shown (review finding 11; `003`, `008` decision 7). It names the open platform the suite is built on, whose README states these facts (READ, the `vfs` repository's README, 2026-11-01):
  - eyebrow "pluto workspace"; title "Work runs on data."; description "Docs, sheets, mail and search on one governed data layer. People and agents search the same files, under the same permissions.";
  - actions "Read the docs" and "See the source";
  - the shell card: `pip install git+https://github.com/ClayGendron/vfs` (the README's v2, on `main`; PyPI's `vfs-py 0.0.22` still ships the previous API, change review finding 1); the Python card: a four-line `grep` over a database-backed namespace, resolving to two paths;
  - the proof band, titled "One layer under every app": **4** "search verbs: glob, grep, glean and graph"; **1** "namespace for every file and row" (tools at paths are not built yet, the README's banner says); **0** "new databases to run: it mounts the one you have";
  - the console: examples in the README's own Python calls, not a command line the README does not show (change review finding 1): "Find renewals" (`await fs.grep("renewal")`) and "Ask a question" (`await fs.glean("do renewals auto-renew?", limit=3)`); meters "files searched", "permission checks", "results";
  - the band: "Start with the data you already have."
- The scripted `run` functions resolve after a fixed 900 ms with fixed results; the item page says an app replaces them.
- It installs as a route, like every block (`003`).

### 10. The preview

- **Item pages show each composition in the block viewer's frame** (review finding 5), through a view per item at `/view/compositions/<item>/`, at phone, tablet and desktop widths (`003` decision 16). _Why frames:_ a full-bleed stage, a sticky bar and an `h1` cannot sit inside the preview page's column. Item-page frames pass `Lockup` without `entrance`.
- `product-home` gets its block page and view.
- `005` decision 4's order gains the group `compositions` before the blocks.

## Acceptance criteria

1. The registry has 74 items, each with a preview page; the ten new items declare `meta.modes`, `meta.since`, their group and every dependency they import. (unit)
2. The literal lint passes the registry with zero violations and zero exceptions. (unit)
3. Every productive item page is unchanged. Expectations change only where this specification changes a count or a list: the item count (64 → 74), the item order in `pages.ts`, the views list, the keyboard walk's page list and the blocks' smoke list. (all suites)
4. `/view/product-home/` renders the hero at least `100svh` tall at 1440×900, 390×844 and 320×640, starting under the overlaying bar, with the proof band below the fold at each. (e2e)
5. Pressing the hero card's Run sets `data-busy` on the card and `data-lit` on the hero's bloom wrapper, then shows two output lines and announces "Ran. 2 lines."; a second run announces again. A rejecting `run` (a test view) shows the error line and "Run failed.". (e2e)
6. The proof band's prerendered HTML holds the final values; scrolled into view, it ends at them; under emulated reduced motion the final values show with no intermediate frame; a screen-reader copy holds each value from the first render. (e2e)
7. The console's Run fills each meter to its result and shows its lines; its root is `data-mode="productive"` and its buttons measure 8 px corners. (e2e)
8. Every new page and view pass axe in both themes, also with a card ran, the console energized and the bar's sheet open; no horizontal scroll at 320 px. (e2e)
9. A keyboard walk through `/view/product-home/` reaches every focusable element in DOM order, starting with the skip link, each with a visible focus ring, and none fully hidden under the bar. (e2e)
10. `bunx shadcn-svelte add product-home` into a fresh app installs the route, its items and their dependencies, and the app builds. (smoke)
11. `bun run test`, `bun run check` and `bun run lint` pass.

## Build checkpoints

1. After `stage`, `stage-card`, `marketing-bar` and `stage-hero`, rendered in the view: the design lead looks before the builder goes on.
2. After `product-home` is composed.

## Risks

- **A loud page with a borrowed identity.** The compositions amplify whatever is in the slots. The exhibit's question D exists for this.
- **Looking like a competitor.** The hero is the owner's chosen lab hero. Its light is `009`'s one bloom; question I may replace it.
- **Scripted demos read as fake.** The item page says the functions are samples an app replaces.

## Review dispositions

1. Fixed: the bar is top-level, `surface-stage veil`, with `009`'s plain-rule veil; stage roles on it measured.
2. Fixed: decision 1's dependencies and an import test.
3. Fixed: criterion 3 names what changes.
4. Fixed: the view has no `main` of its own; the block owns `main`, the skip link, named navs and `scroll-padding-top`; criterion 9 rewritten.
5. Fixed: item pages use frames; `headingLevel`; heading levels written.
6. Fixed in `009`: the stage remaps `--muted`, `--accent`, `--secondary`, and the code ground follows the stage wash.
7. Fixed: meters fill after resolve through `tween`; rows and tab panels specified.
8. Fixed: the error path and the cleared status.
9. Fixed: the count-up's states, formatting and easing.
10. Fixed: `--size-hero-fill`.
11. Fixed: the sample copy is written; every proof is a fact of the platform's README.
12. Fixed: groups, `meta.since`, no `rounded-stage` (the `rim` sets the radius), `language`, the copy button as a part, `place`, `statement`, `status` cited by its own item.
13. Fixed: 320 px, `overflow-x-clip`, `z-10`.
14. Fixed: criterion 8 scans the states.
15. Answered: one builder, after `009` lands, with two checkpoints.

## Landing notes

- **Built** in the working tree on top of `009`'s uncommitted work, uncommitted by the owner's ruling. `package.json` reads 0.10.0; `static/v0.10.0/` is built.
- **Checkpoint 1** (`stage`, `stage-card`, `marketing-bar`, `stage-hero` in the view): the bar floats over the first stage (`overlay`, `underBar`), the Python card's first line splits, `stage-card` drops `read-token`, and the block's smoke test is its own file (decisions.md, "After the `010` build's checkpoint").
- **During the build:** the one-file block carries the explicit target `product-home/+page.svelte` (decision 1), because the CLI targets a one-file block at the bare `+page.svelte`.
- **Builder's choices that stand:** "Ran. 1 line." in the singular; the bloom lit while running and after success, dark after failure; a tab change clears the console's output and drops a stale pending result; `cta-band` sets `data-mode="expressive"` on its root; views with no visible heading hold an sr-only `h1`; every view has a `<title>`; a `waitForHighlight` helper removes a timing race from the keyboard walks.
- **Change review fixes:** the copy is true of the platform as its README states it today (finding 1; decision 9 rewritten); the proof band never shows a resting 0 (reduced motion, print) and follows a change to its items (findings 2, 3); `underBar` works without `fill`; `proof-band`'s props require a name; lists key by index; a run that settles after unmount changes nothing; the skip-link test checks that main's content clears the bar; the footer view states this build's facts (findings 4 to 8). The viewer test that flaked once under load (finding 10) did not recur in two full runs.
- **Tests, two full runs after the fixes, identical:** unit 826 pass; e2e 1786 passed (both projects); smoke 109 pass (7 files); `check` 0 errors, 0 warnings; `lint` clean; the literal lint 0 violations and 0 exceptions over 321 item files.
- **Noted for the owner, not changed:** in the dark theme the mark's dots are paper-white, the design book's rule (`--mark-N` in `.dark`). On a stage they are the lifted colours (`009` decision 3). Whether the dots keep their colours on every dark ground is part of the identity's colour answer (questions B, C, N).
