# Review of 010 — The stage compositions

Reviews [`specifications/010-the-stage-compositions.md`](../specifications/010-the-stage-compositions.md).

- **Date:** 2026-11-01
- **Status:** in review; does not land yet (not fit to build)
- **Reviewer:** a reviewer; not the author
- **Reviewed:** the specification as drafted, 2026-11-01 (148 lines, untracked). Checked against the constitution; `decisions.md`, "The identity is commissioned, with options" and every entry dated 2026-11-01; `009` as drafted (under its own review; its decisions taken as given); the three memos the header names; `003` (the blocks, the views, the hero's truth rule), `005` decision 4, `006` decisions 2, 5, 12 and 16, `008` decisions 2, 3 and 7; and the code at `6fbdf99` with the working tree.
- **Re-ran:** nothing in this repository was written except this file. Scratch files were kept in the session's scratch folder.
  - **WCAG contrast, the 2.2 formula** (Python, EXECUTED). The veil (`#14161C` at 85%) composited over paper is `#36383C`, over white card `#37393E`, over the stage `#121419`. On the veil over paper: `stage-muted` 4.48, lifted blue 4.45, paper 10.94, the light theme's `muted-foreground` 1.43. Over white: 4.41, 4.38, 10.77. Over the stage: `stage-muted` 7.02, paper 17.17 (matches `009` decision 4). At 88%: 4.96 and 4.89 for `stage-muted`; at 90%: 5.31 and 5.25. The dark `--muted` `#2B2D32` against the stage `#050608`: 1.47; `stage-muted` on `#2B2D32`: 5.25.
  - **Chromium 1248 through Playwright** (EXECUTED). A native `<meter>` with `transition: width 700ms linear` on `::-webkit-meter-optimum-value`, value set 0 → 100: about half filled at 250 ms, full after. So the native meter's fill does transition in Chromium.
  - **Sticky in a section** (Chromium, EXECUTED). A `sticky top-0` bar inside a `min-h-svh` dark section followed by a 2000 px light section, scrolled 1500 px: the bar's top is at −600 px. It leaves with its section.
  - **The code** (READ): `code-block.svelte` (root `bg-code-background`), `code-block-content.svelte` (`tabindex` 0 on the `pre`; `code` and `language` props), `code-block-copy-button.svelte` (a separate part, `code` required, named "Copy code", its own `Status`); `button.svelte` (`busy` sets `aria-busy` and `data-busy` on the button itself, spinner, stays enabled); `meter.svelte` (native, `h-2`, labelled by the app, "writes its numbers beside it"); `status.svelte` ("Setting the same text twice is not announced again"); `tabs-*.svelte` (bits-ui; `tabs-list` default `bg-muted`); `app-shell-footer.svelte` (`logo?: Snippet<[place]>`, `endorsed`, `statement`; no `pbc`); `lockup.svelte`; `src/app.css` lines 66, 158, 318–333, 466–475, 506–524; `src/routes/(view)/+layout.svelte` (every view is wrapped in `<main class="min-h-svh">`); `src/routes/(site)/+layout.svelte` (header `Lockup … entrance`, `main.mx-auto.max-w-5xl.px-6`); `src/lib/preview/item-header.svelte:20` (each item page's `h1`); `src/lib/preview/blocks.ts`; `scripts/lint-literals.ts` (L7 allows `7xl`, `svh` and the variable form; L10 does not see transitions); `tests/unit/registry.test.ts` lines 320–421 and 919–940, `tests/unit/previews.test.ts:9`, `tests/unit/blocks.test.ts` lines 61–231, `tests/e2e/pages.ts`, `tests/e2e/keyboard.spec.ts:357–358`, `tests/e2e/viewer.spec.ts:103`, `tests/e2e/blocks.spec.ts:594`.

## Acceptance criteria against evidence

1. **74 items, previews, modes, dependencies:** 63 + `read-token` + 10 = 74 (READ). Countable. **Not met as written:** decision 1's dependency list is incomplete (finding 2).
2. **Lint, zero violations and exceptions:** every class the specification names lints clean on paper (`max-w-7xl`, `min-h-svh`, `h-(--size-bar)`, `px-(--gutter-stage)`; READ L7). The meter's fill rule has no named class yet (finding 7).
3. **Every existing test passes without edits:** **cannot be met** together with criterion 1 (finding 3).
4. **Hero ≥ viewport, proof band below the fold:** countable. Met on paper, since the bar adds 72 px above the hero. The strip it should show is cut off (finding 10).
5. **Run: `data-busy`, `data-lit`, lines, `status`:** countable. `button` also sets `data-busy` on itself, so the check must scope to the card (finding 12).
6. **Count-up:** countable with a mutation observer. The state between hydration and intersection is undecided (finding 9).
7. **Console fills, productive radius:** **not buildable as written:** the values arrive only when `run` resolves (finding 7). The radius half is countable.
8. **axe, both themes; no scroll at 390:** no count given (finding 3); 390 is wider than the repository's reflow width, 320 (finding 13); the ran state and the open sheet are never scanned (finding 14).
9. **Keyboard walk:** **not countable.** It names a skip target no decision creates (finding 4) and leaves out three `pre` stops, the tab panel, the home link, the Menu button and the footer's source link (finding 4).
10. **Smoke install:** countable once finding 2 is fixed. "Its ten items" should read "the nine compositions, `four-dot`, `read-token` and their dependencies" (finding 12).
11. **`test`, `check`, `lint`:** countable.

## Findings table

| # | Severity | Finding | Where |
|---|---|---|---|
| 1 | High | The bar cannot float over paper as composed, and where it does, its text fails AA | decisions 4, 9 |
| 2 | High | Four items import what they do not name; `proof-band` alone breaks an app's build | decision 1 |
| 3 | Medium | Criterion 3 contradicts criterion 1, and no new count is given | criteria 1, 3, 8, 9 |
| 4 | Medium | Landmarks, the skip link and focus under the sticky bar are undecided; the walk is not countable | decisions 4, 9, 10; criterion 9 |
| 5 | Medium | Inline item pages get a second `h1`, a second entrance and a stage that is not full-bleed; heading ranks unwritten | decisions 2, 5, 8, 10 |
| 6 | Medium | On a stage the code ground, tab strip and meter track are the dark theme's greys, not the stage's | decision 3; `009` decision 3 |
| 7 | Medium | The meters cannot fill "while running"; their transition rule, labels and the tab panels are unspecified | decision 7; criterion 7 |
| 8 | Medium | No failure path for an app's `run`, and a second identical result is never announced | decisions 3, 7 |
| 9 | Medium | The count-up's state between prerender and first intersection is undecided | decision 6; criterion 6 |
| 10 | Medium | The bar in flow pushes the hero's strip 72 px below the fold | decisions 5, 9 |
| 11 | Medium | The sample copy is unwritten, and invented proof numbers break the blocks' truth rule | decision 9 |
| 12 | Low | Registry shape, props and citations | decisions 1, 3, 4, 8, 10; criteria 5, 10 |
| 13 | Low | Reflow at 390, not 320; the bloom can overflow; the bar has no stacking order | decisions 2, 4, 5, 6; criterion 8 |
| 14 | Low | The ran, energized and sheet-open states are never scanned | decision 10; criterion 8 |
| 15 | Low | Scope: one builder only with named checkpoints | the whole |

## Findings, most severe first

1. **High — The bar cannot float over paper as composed, and where it does, its text fails AA** (`010:71–74`, `010:113`) — a `sticky` box sticks only inside its parent, and the bar's text colour comes from whatever surrounds it.
   Failure:
   - Decision 9 puts "`marketing-bar` on a `stage`". Inside a stage section the bar leaves with that section: scrolled 1500 px, its top sat at −600 px (EXECUTED). It never reaches the paper sections, so decision 4's "over a light section" never happens.
   - Placed outside any stage, so that it does float, its links are `muted-foreground` of the page's theme. In the light theme that is `#4A4F5C` on the veil over paper: **1.43:1** (EXECUTED). Its actions also lose the pill, since `data-mode` comes from the stage.
   - Given the stage's roles, `stage-muted` on the veil over paper is **4.48**, and over a white card 4.41 (EXECUTED). Decision 4's "darker than the stage's muted pair needs" is false; the row the builder is asked to record fails 4.5:1. Lifted blue, the stage's primary and ring, is 4.45 and 4.38.
   - `surface-stage` cannot simply be added to the bar: `009` makes it two plain, unlayered rules on the pattern of `surface-ink`, which sets `background-color` (READ `src/app.css:466–470`). Unlayered beats the layered `veil` utility, so the bar would turn opaque.

   Fix: put the bar first in the block, outside every stage, with `z-*` above the content. Give it the stage's roles without the stage's ground. That needs `009` to split `surface-stage` into a roles rule and a ground rule, or a named bar rule. Set the link text in the `foreground` role (paper: 10.94 over paper, 10.77 over white), or raise `veil` to at least 88% in `009`'s `light` group (4.96 and 4.89). Add contrast rows for the veil over `paper` and over `card` in both themes. Add an e2e check: scroll the proof band under the bar, then read the bar's top (0) and the computed colours of its link text.

2. **High — Four items import what they do not name** (`010:51`) — decision 1 names extra dependencies for only three items, plus "every item needs `utils` and `pluto-theme`".
   Failure:
   - `stage-hero` and `cta-band` render `button` (decisions 5, 8).
   - `live-console` shows its command "in a `code-block`" (decision 7) but names `tabs`, `button`, `meter`, `status` only.
   - `proof-band` calls `readToken` (decision 6). `read-token` is named only on the block. An app that adds `proof-band` alone gets an import of a file it does not have, and its build fails.
   - The existing check catches the `$UI$` cases once its count is raised (READ `registry.test.ts:921`, "import only `$UI$` names in their own registryDependencies"). It does not look at `$LIB$`, so the `read-token` case passes the suite and breaks the install.
   - `marketing-footer` needs `four-dot` if it shows the endorsement (`app-shell-footer.svelte` imports `FourDot`); see finding 12 on `pbc`.

   Fix: a full table, one row per item. Widen the import check to lib and hook imports. Add a smoke install of `proof-band` alone.

3. **Medium — Criterion 3 contradicts criterion 1, and no new count is given** (`010:128–136`) — "every existing … test passes without edits to its expectations" cannot hold while the registry grows.
   Failure: these tests assert today's totals and must change:
   - `registry.test.ts`: 63 items with types `(1, 3, 3, 2, 47, 7)`; 44 dependency names as an exact list; 47 `ui`; 10 groups;
   - `previews.test.ts:9`: `COUNT = 63`;
   - `blocks.test.ts`: 7 blocks, 30 files, 30 views, 32 voice files;
   - `pages.ts`: `ITEMS`, and `ITEMS_002`, which is derived by exclusion, so it grows by the nine compositions unless they are excluded;
   - `keyboard.spec.ts`: `STOP_COUNT = 73`;
   - `viewer.spec.ts:103`: 30 views;
   - `blocks.spec.ts:594`: reflow over 35 pages.

   The specification gives none of the new numbers: axe scans, theme loads, catalogue stops, views, site pages. `006`'s review found six such counts wrong.

   Fix: reword criterion 3 as "every assertion about an existing item or page passes unchanged; totals change only as listed". List the totals: 74 items, types `(1, 3, 4, 2, 56, 8)`, 11 groups, 56 dependency names (44 + `read-token`, `tabs`, `meter` + the nine compositions), 8 blocks, 31 block files and 31 views. Count the axe scans and catalogue stops from the pages decision 10 adds.

4. **Medium — Landmarks, the skip link and focus under the sticky bar are undecided** (`010:113–118`, `010:123`, `010:136`) — `product-home` is a whole page, with a bar and a footer, but its structure is never stated.
   Failure:
   - Every view renders inside `<main class="min-h-svh">` (READ `(view)/+layout.svelte`). So the bar's `header` and the footer are not `banner` and `contentinfo`. `006` decision 2 made the shell "landmarks first" and put its views in `(shell)` for this reason (`006` decision 12).
   - In an app, the block installs as a `+page.svelte` under the app's own layout, which may already hold a header and footer.
   - Criterion 9's "skip target" has no decision behind it.
   - The bar's `nav` and the footer's group `nav`s need unique names (axe `landmark-unique`); the bar's is unnamed.
   - A 72 px sticky bar can cover the focused control when Shift+Tab moves upward. WCAG 2.2 SC 2.4.11 (Focus Not Obscured, Minimum) is AA, which constitution §4.4 requires.
   - The walk leaves out stops that exist: each `code-block`'s `pre` has `tabindex` 0 (three of them); bits-ui's tab panel is a stop unless given `tabindex={-1}` (`decisions.md`, after the `007` checkpoint); the home link; Menu below `md`; the footer's source link.

   Fix:
   - Decide that `product-home` renders its own skip link, `header` (the bar), `main` with an id, and `footer`. Its view then lives in a group without a `main`, like `(shell)`.
   - Name the bar's `nav` (for example "Main").
   - Keep focus clear of the bar with `scroll-mt-(--size-bar)` on the block's focusable descendants, or `scroll-padding-top` from the layout, and state which.
   - Write the walk as an ordered list with a count, at 1440 and at 320. Add a check: after Shift+Tab back to the hero's actions, the focused element's top is at or below the bar's bottom.

5. **Medium — Inline item pages get a second `h1`, a second entrance and a stage that is not full-bleed** (`010:79`, `010:116`, `010:122`) — `registry:ui` items preview inline, inside the site layout, unlike blocks, which preview in the viewer's iframe.
   Failure:
   - Each item page already has its `h1` (`item-header.svelte:20`). `stage-hero`'s title is always an `h1`, so its page holds two.
   - The site header plays `Lockup … entrance` (READ `(site)/+layout.svelte`). A `marketing-bar` preview passing the block's `Lockup` with `entrance` adds a second one (`006` decision 5). Its `sticky top-0` would also stick inside the catalogue page.
   - `stage` inside `main.max-w-5xl.px-6` cannot show "full-bleed".
   - Heading ranks are unwritten: `proof-band`'s `title`, `stage-card`'s `title`, and the footer's group titles, which also name its `nav`s.

   Fix: preview `stage`, `stage-hero`, `marketing-bar` and `marketing-footer` through a view in the viewer (a `/view/<item>/` route each), or give `stage-hero` a `level` prop and say the preview passes 2. Add a headings table for `/view/product-home/`: `h1` hero; `h2` proof band, console section and call to action; footer group titles `h2` or not headings; card titles not headings.

6. **Medium — On a stage the code ground, tab strip and meter track are the dark theme's greys** (`010:63`, `010:99–101`) — decision 3 says the code sits "on the stage's raised ground", but nothing makes it so.
   Failure:
   - `code-block`'s root is `bg-code-background`, and `.dark` sets `--code-background: var(--muted)`, `#2B2D32` (READ `src/app.css:158`).
   - `009`'s stage remaps `--background`, `--card`, `--popover`, `--foreground`, `--muted-foreground`, `--border`, `--primary`, `--ring` and `--mark-N`. It does not remap `--muted`, `--accent`, `--secondary`, `--code-background` or `--code-active-line`.
   - So the card's code, the console's `tabs-list` (`bg-muted`), the meter track (`var(--muted)`) and every ghost hover show ink greys at 1.47:1 against the stage (EXECUTED). This is a dependency `010` assumes and `009` does not provide.
   - Text contrast still passes (`stage-muted` on `#2B2D32` is 5.25).

   Fix: preferred, `009` adds those roles to the stage's remap (`--code-background` to `--stage-raised`, `--muted` and `--accent` to a stage step), so every item on a stage follows. Otherwise `stage-card` passes `class="bg-card"` to the code block and decision 3 says so. Either way, `code-block` is not edited.

7. **Medium — The meters cannot fill "while running"** (`010:98–102`, `010:134`) — `run` returns the meters' labels and values, so neither exists until it resolves.
   Failure:
   - Meters first mounted at their final value have no earlier value to move from, so no transition runs. Criterion 7 passes with nothing animating.
   - The fill rule has no home. `meter` is untouched (rightly), `009` emits `--motion-fill` but no rule that uses it, and the fill is a pseudo-element. Chromium does transition `::-webkit-meter-optimum-value`'s width (EXECUTED), so it can be built.
   - The meters' names and numbers are unstated. `meter.svelte` says the app labels each one and "writes its numbers beside it".
   - Unstated whether each tab has its own panel and code block, or the tabs drive one shared block. bits-ui triggers point `aria-controls` at their panel.

   Fix:
   - Meters render after the first run at value 0, then take their values on the next frame. Or a `meters` prop gives the labels and `max` up front, and only the values arrive.
   - Write the class string on the meter, for example `[&::-webkit-meter-optimum-value]:transition-[width] [&::-webkit-meter-optimum-value]:duration-(--motion-fill) [&::-webkit-meter-optimum-value]:ease-(--ease-standard)`, and lint it. Or add a named rule to `009`.
   - Each meter gets an `id`, a `<label for>` and its value written beside it.
   - One panel per tab, each with its own code block. Say what a tab change does to the output.
   - Criterion 7 samples a meter's fill width partway (strictly between 0 and full at about half of `--motion-fill`) and at the end.

8. **Medium — No failure path for an app's `run`, and a repeat result is never announced** (`010:62–66`, `010:98–102`) — the Intent says an app passes its own function, but only success is designed.
   Failure:
   - A rejected promise leaves the card or console busy for good, `aria-busy` stays on the output, and nothing is said. R23 asks for errors that direct.
   - Running the Python card twice sets `status` to the same "Ran. 3 lines." twice, which is not announced again (READ `status.svelte`). `003` names the pattern: a working message while busy ("Signing in…"), then the answer.

   Fix: set `status` to "Running…" when the run starts, then to the result. On rejection: busy off, a visible error line in the output, `status` "Could not run. Try again.", and `onstate` reports `"idle"`. Add `"error"` to `onstate`'s union if the bloom should answer it. Add one e2e case with a rejecting function.

9. **Medium — The count-up's state between prerender and first intersection is undecided** (`010:90–93`) — the prerendered HTML shows final values, and the count starts from 0 on first intersection.
   Failure:
   - If the digits stay final until the band intersects, the reader sees final, then 0, then the count. That is a flash.
   - If they reset to 0 on hydration, a band already in view at load (a tall window, a reload mid-page) counts while someone is reading it. A band that never intersects shows zeros to anyone who scrolls past it.
   - Intermediate frames of `99.9` show long decimals unless a format is set.
   - `readToken("ease-standard")` returns the string `cubic-bezier(0.2, 0.7, 0.2, 1)`, so the band needs a small bezier solver (no new dependency). The decision does not say so.

   Fix: on hydration, a band whose top is below the viewport resets its hidden digits to 0. A band already in view keeps its final values and never counts. Frames round to the final value's decimal places. Name the in-file solver. Criterion 6 gains a case: a band in view at load shows no intermediate frame.

10. **Medium — The bar in flow pushes the hero's strip below the fold** (`010:83`, `010:113`) — a sticky bar takes its 72 px in the flow, so a `min-h-svh` hero under it ends 72 px below the viewport.
    Failure: at 1440×900 the name strip, which the owner chose "along the bottom" of the first screen (product-site memo), sits at 900 to 972 px: cut off or hidden. Criterion 4 passes anyway.
    Fix: lay the bar over the hero's top (bar `-mb-(--size-bar)`, hero `pt-(--size-bar)`), or set the hero's minimum to the viewport less `--size-bar`. Add to criterion 4: at 1440×900 the strip's bottom is at or above 900 px.

11. **Medium — The sample copy is unwritten, and invented proof numbers break the blocks' truth rule** (`010:115–117`) — only the eyebrow and title are given.
    Failure:
    - Missing: the sentence; the proof values and labels; the strip's names; the two cards' titles, code and scripted output; the console's examples, meters and lines; the bar's links and actions; the sheet's title; the call to action; the footer's groups.
    - `003`'s hero rule, kept by `008` decision 7 ("every claim is true where it is shown", which rewrote the hero copy to claim nothing about a product), is broken by proof numbers for a product that is not shipped. The specification does not say so.
    - Sample links must be `"/"` (`blocks.test.ts` check 4) or anchors that exist on the page (`006` review finding 16, `prerender_missing_id`).

    Fix: a copy table. Recommended: proof values true where shown, such as "0 literal values", "10 compositions", "2 themes", with labels that say what they count. Otherwise record the exception for this block in `decisions.md`, asked of the owner with these two options. Sample links go to `"/"` or to ids on the page. The scripted `run`s carry `003`'s comment: "A stand-in for your server. Replace it."

12. **Low — Registry shape, props and citations** (`010:35`, `010:51–52`, `010:62–63`, `010:70`, `010:109`, `010:124`, `010:132`, `010:137`).
    - `product-home` is a `registry:block` but decision 1 gives it `meta.group: "compositions"`. Decision 10 orders that group "after `blocks`'s components and before the blocks", but there is no group by that name. Fix: "`compositions` after `chat` and before `blocks`; `product-home` is in `blocks`, last".
    - `meta.since` is unstated. Fix: `"0.10.0"`.
    - `009`'s `rim` already sets the stage-card radius, so `rim rounded-stage` repeats it. Fix: `rim`.
    - `stage-card`'s `lang` is `code-block`'s `language`. Fix: rename to `language`.
    - `code-block` does not include its copy button; it is `CodeBlockCopyButton` with `code`, named "Copy code". Fix: "the code block's header holds the title, `CodeBlockCopyButton` and, with `run`, Run".
    - The logo snippets take no `place`, unlike `008` decision 2. Fix: `logo: Snippet<[place: "header" | "footer"]>` on both, so the block passes one snippet with `entrance={place === "header"}`.
    - `pbc` is undefined, and `app-shell-footer`'s `endorsed` and `statement` are missing. Fix: use `endorsed` and `statement` as `008` decision 3 has them.
    - `status` is `003`'s item, not `002`'s.
    - Criterion 5 should select the card by `[data-slot=stage-card][data-busy]`, since the busy button carries `data-busy` too.
    - Criterion 10: "the nine compositions, `four-dot`, `read-token` and their dependencies".
    - The hero's code highlights on the client, so the first paint shows plain text. Say whether the block prerenders `lines` with `highlightCode`.
    - The hero's description: name the step above phones (`sm:text-lg`?).

13. **Low — Reflow at 390, not 320; the bloom can overflow; the bar has no stacking order** (`010:131`, `010:135`, `010:57`).
    - The repository reflows at 320 (`blocks.spec.ts:594`; WCAG 1.4.10). The viewer's phone is 360.
    - Four proof numbers at their 56 px minimum need a column rule at 320.
    - `bloom` is a `::before`; if it is larger than its object it widens the page. `overflow-hidden` on the stage would clip it but breaks a sticky child.

    Fix: criterion 8 at 320. Proof band: two columns below `sm`. The stage carries `overflow-x-clip`, which keeps sticky working. The bar takes a `z-*` above the bloom.

14. **Low — The ran, energized and sheet-open states are never scanned** (`010:123`, `010:135`) — the view has one state, so axe never sees the output lists, the filled meters, the energized ring or the phone sheet. `006`'s review found the same gap for `submitted`.
    Fix: criterion 8 also runs axe on the view after both Runs resolve (in both themes), and at 360 with the sheet open.

15. **Low — Scope** (the whole). Ten items, a block, ten item pages, a view and their tests: about `006`'s size, which one builder carried. But this rests on `009`, which is unbuilt, and on two of its gaps (findings 1 and 6).
    Fix: build after `009` lands, with two checkpoints. First: `stage`, `stage-card`, `stage-hero` and `marketing-bar` on the view at 1440 and 360 in both themes (the bar's contrast, the fold, the bloom). Second: `proof-band` and `live-console`. If a split is wanted, `010` keeps those six and the block without the footer and call to action, and `011` adds `name-strip`, `cta-band` and `marketing-footer`.

## Constitution checks

- **§4.1 source, not a package:** met on paper. The scripted `run`s are local; nothing reaches back.
- **§4.2 driven by need:** met. The need is the owner's chosen hero (product-site memo; `decisions.md`, "The identity is commissioned").
- **§4.3 tokens are the one source:** met on paper. Every size and colour named is a token or a `009` utility. The meter rule needs its class string (finding 7). The veil's opacity may need a new value (finding 1).
- **§4.4 accessible by default:** not met as written: findings 1, 4, 5, 7 and 8.
- **§4.5 and §4.6 pinned, named dependencies:** no new package. The bezier solver is written in place (finding 9). Registry dependencies are incomplete (finding 2).
- **§6 never copy prior art:** no code is borrowed. The look is the owner's chosen lab hero. The brands memo §4 warns that a dark stage with glow "is the part others copy". The specification's Risks say so and leave the light to question I. No competitor's device (ribbon, gradient wash, logo shape) appears in the text.
- **§6 never break an installed app silently:** no existing item changes, provided finding 6 is closed in `009` or by a class, not by editing `code-block`.

## Verdict

Does not land yet: not fit to build. Findings 1 and 2 are High: the floating bar either stops floating or fails AA, and four items omit a dependency they import. Findings 3 to 11 are Medium. Nothing needs the owner except the choice in finding 11. Finding 6 needs a line in `009`.

## Disposition

_Filled in after the author answers._
