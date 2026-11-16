# 024d — The theme page loads no editor until it is used

- **Status:** built on `release/0.13.0` at `506cfc1` (fix 2, a static specimen), with the design lead's rulings of 2026-11-16 (a ninth template, `theme`); awaiting its change review. Lands before `030`, with `024b`, `024c`, `024e` and one re-base sweep (`roadmap.md` §3, "`024` before `030`").
- **Date:** 2026-11-16
- **Author:** the design lead
- **Kind:** small change (AGENTS.md: a fix with no interface change, no new token or dependency, in one place). No research memo and no spec review. Its check is seen failing first, and the built change is reviewed by someone who did not write it (constitution §5).
- **Depends on:** `024` (budgets per template). Lane: the theme item's examples, `src/lib/site/examples/kuiper-theme/`.
- **Found by:** `024`'s build sweep (Landing notes, ruling 1) and its change review, finding 5 (`reviews/024-budgets-per-template-pr-2026-11-16.md`).

## The defect

`/components/kuiper-theme/` transfers **760 kB**, the heaviest page on the site (`024`'s sweep, EXECUTED). About a third of it is one example.

Its "An ink surface" example (`src/lib/site/examples/kuiper-theme/surface.svelte`, the `CodeEditor` import at l. 14 and its use at l. 44) mounts a live `CodeEditor` to show the editor's ground on the ink surface. On load that fetches the 117.7 kB CodeMirror chunk and 150.5 kB of tree-sitter: the runtime and the Python grammar (EXECUTED, the change review's probe).

The theme item's job is not live highlighting (`024` decision 5). So:

- The page sits in `LIVE_HIGHLIGHT` and `WASM_ALLOWED` by the design lead's ruling at `024`'s landing, **pending this change**.
- Its 760 kB sets `component-live`'s budget at 840 kB. That leaves `code-editor` 84 kB of headroom, `highlighter` 298 and `use-highlighted-code` 400.
- A reader pays for an editor they may never touch.

## The fix

The example shows the same thing without loading the editor on load. One of these, the builder's choice, recorded in the Landing notes:

1. **Mount on interaction.** The example shows the code as a static, prerendered, highlighted block on the surface (the code ground equals the surface, as now). The editor mounts when the reader focuses the block or presses an "Edit" button, and it then loads CodeMirror and the highlighter.
2. **A static specimen.** The example shows a prerendered highlighted block and a still picture of the editor's ground, with no editor on the page.

The example's words keep saying what the reader sees. The `keyboard-fixture` and the overlays inside the surface keep working; any browser test that reads the editor is updated to mount it first.

## The check

1. **Seen failing first:** in `tests/e2e/budgets.ts`, `kuiper-theme` leaves `LIVE_HIGHLIGHT` and `WASM_ALLOWED`. `024 transfer: component` (or `component-heavy`, see 3) fails, naming the page's 2 `.wasm` requests. The output goes in the Landing notes.
2. After the fix, the page fetches no `.wasm` on load, in any frame, and that transfer test passes on the `.wasm` rule.
3. **Its template.** The page should fall to about 490 to 610 kB (the change review's estimate). Over 455 kB it belongs in `HEAVY` (`024` decision 3), which changes only by a ruling with its measurement. If it lifts `component-heavy`'s budget far above `chart`'s 530 kB, the design lead may give it a one-page template, as `index` has. The Landing notes record the measurement and the ruling.
4. **The re-base.** `component-live`'s budget falls to its next heaviest page (`code-editor`, 655.8 kB, so about 725 kB) at the re-base sweep that follows `024b`, `024c`, `024d` and `024e`. A fall needs no ruling (`024` decision 4).

The perf project, `bun run check` and the `light` and `dark` browser projects stay green.

## Landing notes

### The fix chosen: 2, a static specimen (the builder, 2026-11-16)

The "An ink surface" example shows no editor. Where the editor stood, a second code block shows the same code: numbered, with its third line `highlighted`, and its lines highlighted at prerender by the page's `load` (`data.surface`, the `highlightCode` call the block beside it already used). Nothing on the page imports `code-editor`.

**Why 2, not 1.** The theme item documents a surface, not an editor (`024` decision 5). What the surface does to code is two slots: it sets `--code-background` to the surface and `--code-active-line` to `muted` (`007` decision 8). The specimen shows both: its ground is the code ground, and its highlighted line sits on `--code-active-line`. The editor reads the same two slots, and that is proven on its own page (`code.spec.ts` G2: `.cm-editor` on the code ground, the active line on its step). So the specimen shows the surface faithfully, and the page loads no CodeMirror and no tree-sitter at any time. Fix 1 would have kept the page in `WASM_ALLOWED`, so the perf project could no longer see a regression on load. It would also have needed a placeholder, an "Edit" button and a focus hand-off: more code to show something that is not the theme's.

**Precedent.** The block beside the specimen: prerendered lines from `data.server.ts`, highlighted at build time. `code-block`'s server path (`code.spec.ts` C1: 0 tree-sitter and 0 `.wasm` on a page of prerendered blocks).

**What the words say now.** The intro says that the code ground equals the surface, so a code block or an editor sits flush with it, and that a highlighted line takes the muted step, as an editor's active line does. The paragraph under the specimen says that the highlighted line is one step up, the ground an editor's active line takes. The page's keyboard note names "the numbered code" where it named "the editor". The page's "When to use" text (the surface moves "its ground, the code ground and the editor's ground together") is the contract and stays.

**What the tests read now.**

- `code.spec.ts`, new: **"024d. on load the theme page fetches no .wasm, in any frame, and mounts no editor"**. It counts `.wasm` requests on the browser context, waits for `networkidle`, and asserts 0, and 0 `[data-slot="code-editor"]`.
- `code.spec.ts` S1: the `.cm-editor`, `.cm-gutters` and `.cm-activeLine` readings become the specimen's ground, its hairline and its highlighted line's ground (`INK_WASH`). That is 7 light-page readings, not 8: the gutter has no ground of its own in a block. The overlays' placement and theme are unchanged.
- `keyboard.spec.ts`: the theme fixture keeps **7 stops**. The first is `region:*` (the specimen's scrolling `pre`, named "Numbered code on the ink surface"), not `textbox:Surface example`. The block's root draws its ring, as for the other block. `kuiper-theme` leaves the list whose `textbox:` stops `.cm-editor` rings. 35 fixtures and 75 stops, as before.

### The check, seen failing first

On `506cfc1`'s tree, with only the test changes made (`kuiper-theme` out of `LIVE_HIGHLIGHT`, and so out of `WASM_ALLOWED`; the new `code.spec.ts` test):

- `E2E_PREBUILT=1 E2E_PORT=5741 bun --bun playwright test tests/e2e/code.spec.ts --project=chromium-light -g 024d`: **1 failed**. ".wasm requests on load": `web-tree-sitter.dvFfgEi9.wasm`, `tree-sitter-python.BlcJAWGl.wasm`; and `[data-slot="code-editor"]` counted 1, not 0.
- `E2E_PREBUILT=1 E2E_PORT=5741 bun --bun playwright test --project=perf --no-deps -g "024 transfer: component$"`: **1 failed**, with two soft failures. "pages over component's 445 kB": `/components/kuiper-theme/: 760.9 kB over 445; largest: /_app/immutable/chunks/BXg67wcQ.js 117.7 kB, /components/kuiper-theme/ 88.8 kB, web-tree-sitter.dvFfgEi9.wasm 82.6 kB, tree-sitter-python.BlcJAWGl.wasm 67.9 kB, ibm-plex-sans 44.7 kB, jetbrains-mono 39.6 kB`. "pages that fetch .wasm": `/components/kuiper-theme/: 2 .wasm, not in WASM_ALLOWED`.

After the fix both pass on the `.wasm` rule. The page measures **462.1 kB** unthrottled, with **0 `.wasm`** (−298.8 kB). Its largest files are now its HTML (89.5 kB) and the three fonts. That is still over `component`'s 445 kB (criterion 3).

### The template, and the rulings

#### The design lead's rulings (2026-11-16), which replace the builder's 1 and 2 below

1. **The theme page has a template of its own, `theme`: a ninth template.** The builder's ruling 2 is **not confirmed**: raising `component-heavy`'s LCP from 1,010 to 1,490 ms would unguard `chart` by about 480 ms. `home` and `index` are already one-page templates, so a one-page `theme` has precedent. Its figures are the page's own, measured at this change (the builder's sweep run, ruling 2 below): transfer **462.1 kB** → budget **510 kB** (decision 4's 10%, rounded up to 5 kB); LCP **1,348 ms** (1,348, 1,332, 1,348; spread 1.2%) → **1,490 ms** (10%); CLS **0.004** → **0.02** (the floor). Its probe is the page itself; its layouts are the component layouts. `kuiper-theme` leaves `HEAVY`; the `component` rule leaves the page to `theme`. This amends `024` decision 1 (eight templates → nine); `024`'s landing notes record it.
2. **`component-heavy` is restored** to `chart`'s own figures from `024`'s sweep: 479.9 kB, 912 ms and 0. Budgets **530 kB, 1,010 ms, 0.02**, as before this change. Its probe is `chart` alone.
3. **`component-live`'s fall is confirmed** (the builder's ruling 3 below): 725 kB, 1,260 ms, 0.02. A fall needs no ruling.
4. **The unit test still holds every template's figures to its own pages.** `budgets.test.ts`'s own-pages, arithmetic, margin and `ci` tests run over `TEMPLATE_IDS`, so they cover `theme` with no change. The count test reads nine templates ("decision 1's eight templates and 024d's theme"), and decision 1's fixed pages now include `/components/kuiper-theme/` → `theme`. 60 pass (56 before: 4 per template).

#### A finding: the theme page's LCP is its first paint, set by its HTML (for the re-base sweep)

The page's LCP did not move when the editor went (1,352 → 1,348 ms), so the editor never set it. One probe (`015` decision 23's profile, 3 cold loads, the build served by `vite preview`) reads the LCP element: the header's lead paragraph, `p.mt-3.max-w-(--site-measure).text-base.text-muted-foreground`, "Kuiper's tokens for light and dark: colour, radius, spacing, type, motion, focus…". It is a text paint of 22,145 px², the same element in all 3 loads, and **LCP equals first contentful paint** each time (1,312, 1,320, 1,328 ms). The response ended at about 1,090 ms. On `chart`, the same probe gives LCP = FCP = 920 ms and a response end of 304 ms.

So nothing late is painted. The page's first paint is late because its document is large. `build/components/kuiper-theme/index.html` is **1,427,450 bytes raw, 87,523 gzipped**. `chart`'s is 347,289 (27,398), and Button's 321,788 (26,147). The prerendered page holds all 18 examples. The largest parts, by raw bytes between example anchors, are: the hydration data after `</main>` about 192 kB, `surface` 182 (its two blocks and its source), `contrast` 169, `measured` 128, `fields` 85, `expressive-motion` 86 and `code` 79. Under 4× CPU throttling, parsing that document holds the first paint. The fix would be the page's own, not an item's, and it is out of this change's scope: fewer examples prerendered in full, or the contrast and measured tables trimmed. The re-base sweep after `024b`–`024e` revisits it, with `theme`'s LCP figure.

#### The builder's rulings (2026-11-16), as made before the design lead's

The owner and the design lead were not available at the time. Each ruling below was made with its measurement, as the 024 checkpoint's were. Rulings 1 and 2 are replaced by the design lead's above; ruling 3 is confirmed.

1. **`kuiper-theme` joins `HEAVY`.** At 462.1 kB it is over decision 3's line of about 455 kB, so it cannot be in `component`. It stays under `chart` (481.0 kB on the same run), so `component-heavy`'s transfer figure stays `chart`'s 479.9 and its transfer budget stays **530 kB**. A one-page template (criterion 3's other choice) is not needed for transfer.
2. **`component-heavy`'s LCP figure rises to the theme page's.** One `PERF_SWEEP=1` run of the template's two pages (2026-11-16 02:18, load about 8 on 10 cores): `kuiper-theme` LCP **1,348 ms** (1,348, 1,332, 1,348), CLS 0.004, 462.1 kB in every load, 0 `.wasm`; `chart` 864 ms (864, 852, 880), CLS 0, 481.0 kB. The theme page is the slower, so decision 4 makes it the LCP figure. The budget goes 1,010 → **1,490 ms** (1,348 × 1.1, rounded up to 10 ms; the spread is 1.2%, so the margin is 10%). That is the budget the page had in `component-live`. Its 1,348 ms equals the 1,352 it had with the editor (`024`'s sweep), so the editor never set it, and this change does not cause it. The CLS figure is the theme page's 0.004; the budget stays at the floor, 0.02. `kuiper-theme` becomes a probe beside `chart`.
   _Cost:_ `chart`'s LCP is now held to 1,490 ms, not 1,010. If the design lead would rather keep `chart` tight, the alternative is a one-page template for the theme page (criterion 3), decided at the re-base. That adds a ninth template, a change to decision 1 and its unit test.
3. **`component-live` falls, with no ruling** (decision 4). Without the theme page, its figures are the next pages of `024`'s same build sweep: transfer `code-editor` **655.8 kB**, LCP `highlighter` **1,140 ms**, CLS `code-editor` 0.003. Budgets: 840 → **725 kB**, 1,490 → **1,260 ms**, CLS 0.02. The new heaviest page is `code-editor`. This is not the re-base, and nothing was re-measured to set it. The unit test that a template's figures are its own pages (`budgets.test.ts`, criterion 2) does not let the figures name a page that left. The re-base sweep after `024b`, `024c` and `024e` re-measures all eight templates.

`024`'s landing notes ("After `024d`") record the same figures.

### The checks after the design lead's rulings

- `bun test tests/unit/budgets.test.ts --timeout 60000`: **60 pass, 0 fail** (253 expect calls).
- **The perf project**, once, on the same build (`E2E_PREBUILT=1 E2E_PORT=5741 bun --bun playwright test --project=perf --no-deps`, 2026-11-16): **26 passed**, 0 failed, 5.9 minutes. That is 1 server check, 9 transfer tests (one per template, `024 transfer: theme` new) and 16 paint tests.

  | Template | Pages | Heaviest page | Measured | Budget | Probes' LCP medians (budget) | CLS (budget) |
  |---|---|---|---|---|---|---|
  | `component` | 73 | `sidebar` | 405.1 kB | 445 | 1,088 on `sidebar` (1,270) | 0.09 on `label` (0.108) |
  | `component-live` | 4 | `code-editor` | 657.0 | 725 | 928 to 1,144 (1,260) | 0.003 (0.02) |
  | `component-heavy` | 1 | `chart` | 481.0 | 530 | 900 (**1,010**) | 0 (0.02) |
  | `theme` | 1 | `kuiper-theme` | 462.1 | **510** | 1,380 (1,356, 1,404, 1,380) (**1,490**) | 0.004 (0.02) |

  `kuiper-theme`: 0 `.wasm` in all four loads, throttled transfer equal to unthrottled. Every other template passed as on the run below.

### The checks, before the design lead's rulings

- **The perf project**, `E2E_PREBUILT=1 E2E_PORT=5741 bun --bun playwright test --project=perf --no-deps`, on the final build (2026-11-16, load 8 to 15 on 10 cores): **25 passed**, 0 failed, 5.9 minutes. That is 1 server check, 8 transfer tests and 16 paint tests: `component-heavy` now has 2 probes and `component-live` 4. The figures that matter here:

  | Template | Pages | Heaviest page | Measured | Budget | Probes' LCP medians (budget) | CLS (budget) |
  |---|---|---|---|---|---|---|
  | `component` | 73 | `sidebar` | 405.1 kB | 445 | 1,096, 940, 868 (1,270) | 0.09 on `label` (0.108) |
  | `component-live` | 4 | `code-editor` | 657.0 | **725** | 884 to 1,132 (**1,260**) | 0.003 (0.02) |
  | `component-heavy` | 2 | `chart` | 481.0 (`kuiper-theme` 462.1) | 530 | `chart` 848, `kuiper-theme` 1,308 (**1,490**) | 0.004 (0.02) |

  The live pages: `code-editor` 657.0 kB, `code-languages` 654.7, `highlighter` 543.4 (LCP 1,132), `use-highlighted-code` 440.5, each with 2 `.wasm`. `kuiper-theme`'s throttled and unthrottled transfer are equal, 462.1 kB, with 0 `.wasm` in all four loads. Every other template is as at `024`'s merge after `022`.

- `bun run check`: 0 errors, 0 warnings (2,343 files). `bun run lint`: clean.
- `bun test tests/unit/budgets.test.ts tests/unit/thumbnails.test.ts --timeout 60000`: **66 pass, 0 fail**.
- `code.spec.ts`, `keyboard.spec.ts` and `axe.spec.ts` whole, in `chromium-light` and `chromium-dark` (`E2E_PREBUILT=1 E2E_PORT=5741`, 4 workers): **1,208 passed**, 0 failed (8.1 minutes). After the page's keyboard note was reworded and the site rebuilt, the theme page's tests in those files and in `theme.spec.ts` and `tokens.spec.ts` (`-g "kuiper-theme|ink surface|024d|inline code"`): **38 passed**, light and dark. Those include S1, I3, the 7-stop fixture and axe on the page with the surface's popover and dialog open.
- **Thumbnails.** The theme's hash changed (its route and its `surface` example are inputs). `bun scripts/site/thumbnails.ts --no-build kuiper-theme` wrote both pictures again, and they are **byte-identical** to the old ones: the picture is the first example, the colours, and it did not change. Only `manifest.json`'s `kuiper-theme` hash moved. Looked at: the light thumbnail shows the colours list as before. The surface itself was photographed at 1280 in both page themes (scratchpad): the specimen, numbered, its third line on the wash with the primary marker, flush on the ink, beside `darts.py`.
- **The scorecard** is not re-run for a small change on a build branch. The change touches no item, no Button or Dialog page and no part. Its movement is this page's weight, 760.9 → 462.1 kB, outside rows 7 and 8, which read Button.
