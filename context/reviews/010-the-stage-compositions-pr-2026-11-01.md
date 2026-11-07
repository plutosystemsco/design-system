# Review of 010 — The stage compositions (the built change)

Reviews [`specifications/010-the-stage-compositions.md`](../specifications/010-the-stage-compositions.md).

- **Date:** 2026-11-01
- **Status:** in review; does not land yet
- **Reviewer:** a reviewer; not the author
- **Reviewed:** the working tree on `6fbdf99`, uncommitted, on top of `009`'s uncommitted work. `010`'s paths: the nine `src/lib/registry/ui/{stage,stage-card,marketing-bar,stage-hero,proof-band,live-console,name-strip,cta-band,marketing-footer}/` folders (two files each), `src/lib/registry/blocks/product-home/+page.svelte`, `src/lib/preview/{composition-view.svelte,composition-page.svelte,composition-samples.ts,blocks.ts}`, the 12 view routes under `src/routes/(shell)/view/{product-home,compositions}/`, the 10 item pages, `src/routes/(site)/+page.server.ts`, `registry.json`, `CHANGELOG.md` and `package.json` at 0.10.0, `static/v0.10.0/`, and the tests the brief names. Checked against the specification as amended at its checkpoint (`decisions.md`, "After the `010` build's checkpoint"), its specification review, `009` and its change review, and the `vfs` repository's `README.md` (read 2026-11-01). The identity exhibit and the font packages are out of scope.
- **Re-ran:** Bun 1.3.14. Scripts and screenshots in the session's scratch folder. `git status --short` counted 152 lines before and after every run; nothing was committed.
  - `bun test ./tests/unit` → exit 0: **826 pass, 0 fail**, 4,471 `expect()` calls, 11 files.
  - `bun scripts/lint-literals.ts` → exit 0, "0 literal(s) in registry item files".
  - `bun run check` → exit 0: `COMPLETED 1778 FILES 0 ERRORS 0 WARNINGS`.
  - `bun run lint` → exit 0, "All matched files use Prettier code style!".
  - `bun install --frozen-lockfile` → "no changes".
  - `bunx --bun playwright test tests/e2e/compositions.spec.ts` (the config builds and serves on 4173, both projects) → exit 0: **154 passed**, 36.8 s.
  - `bunx --bun playwright test` on the four edited specs, `axe`, `keyboard`, `blocks` and `viewer` (both projects) → exit 1: **949 passed, 1 failed**, 2.3 m. Passed per spec: axe 534, keyboard 236, blocks 102, viewer 77. The one failure is `viewer.spec.ts:192` "4. the frame's `<html>` is dark exactly when the page's is", for **app-shell**, in the dark project: the first poll timed out at 5 s. Re-run with `-g "app-shell" --repeat-each 3`: 29 passed, 1 failed (the same test, light project). Re-run with `-g "the frame's <html> is dark" --repeat-each 5 --workers 1`: **80 of 80 passed** (finding 10).
  - The only new line in `git status` after all runs is this file.
  - `SMOKE_BLOCKS= bun test ./tests/smoke/compositions-add.test.ts --timeout 300000` → exit 0: **13 pass, 0 fail**, 647 `expect()` calls, 26.4 s (`product-home` into both scratch apps; `proof-band` alone into app A).
  - Probes with Playwright on the dev server (5287): the product home at 1440 and 390 in both themes, full page and scrolled; print media; reduced motion; the skip link; the failing card's colours; a tab change during a console run.
  - Contrast computed with the WCAG 2.2 formula, in the probe script.
  - Imports against declared dependencies over all 74 items (a script over `registry.json` and the built JSON).

## Acceptance criteria against evidence

1. **74 items, pages, `meta`, dependencies** — met. EXECUTED: `registry.json` holds 74; the ten carry `since 0.10.0`, `modes ["expressive"]`, group `compositions` (the block `blocks`); their `registryDependencies` match decision 1 as amended (`stage-card` without `read-token`). Two unit tests check imports against names, one direct for the ten and one transitive for `$LIB$` and `$HOOKS$` across all 74. My own script found no package import undeclared: `marketing-bar`'s `phosphor-svelte` is computed into the built item as `devDependencies: ["phosphor-svelte@^3.1.1"]`, as for every other icon item. The block's one file targets `product-home/+page.svelte`.
2. **Literal lint, zero violations and exceptions** — met. EXECUTED: 0 over 321 item files; the smoke test lints the landed files in both apps with each item's profile.
3. **Productive pages unchanged; counts change only as listed** — met as far as I ran. READ: under `src/lib/registry/` the only tracked change is `button.svelte`, which is `009`'s. Every edited expectation is a count or a list the criterion names (items 74, types `(1, 3, 4, 2, 56, 8)`, 11 groups, 56 dependency names, 8 blocks, 31 files and views, 188 view stops, 69 toolbar stops, 186 stops at 360, 38 reflow pages). EXECUTED: the four edited browser specs, 949 of 950. The one failure is an existing app-shell test that flakes under parallel load and passes serially (finding 10). It does not touch an `010` file.
4. **The hero fills the screen under the bar; the proof band below the fold** — met. EXECUTED: tests at 1440×900, 390×844 and 320×640 (bar and hero at y 0, hero ≥ height, eyebrow below the bar, band at or below the fold) and the strip ending by 900 at 1440.
5. **The card's Run** — met. EXECUTED: `data-busy` on `[data-slot=stage-card]`, `aria-busy` on the output, `data-lit` on the bloom wrapper, focus kept, two lines, "Ran. 2 lines." recorded as `["Ran. 2 lines.", "", "Ran. 2 lines."]` over two runs; the failing view shows its message in `--destructive` and "Run failed.".
6. **The count-up** — partly met. EXECUTED: the prerendered HTML holds 4, 1, 0 in the digits and in the screen-reader copies; out of sight it reads 0 and counts through an intermediate frame to the final values, once; in view at load it never changes. **Not met as written under reduced motion:** a frame shows 0, 0, 0 with the band on screen before the values land, and the test allows it (finding 2).
7. **The console** — met. EXECUTED: three meters labelled by `<label for>`, a sampled frame strictly between 0 and 12, final values 12, 12, 2, numbers beside them, two lines, "Ran. 2 lines.", `data-mode="productive"`, every button 8 px; the failing view shows one error line, "Run failed." and no meters.
8. **axe in both themes and states; reflow at 320** — met. EXECUTED: 0 violations on the 11 composition views at 360, 768 and 1280, on the home with both runs resolved, with both energized (runs held), on both failing views after rejecting, and at 360 with the sheet open; 22 pages without horizontal scroll at 320. The bar's translucent ground is outside what axe can measure; its text is held by `009`'s composite rows (stage muted on the veil over white 5.40) and by the test that its links compute to `--stage-muted` (EXECUTED).
9. **The keyboard walk** — met. EXECUTED: 20 stops at 1440 and 18 at 320, from the skip link in DOM order, each with a 2 px ring in its own ring colour, none with its bottom at or above the bar's, forward and back; nothing after the last.
10. **Smoke install** — met. EXECUTED: 13 of 13.
11. **`test`, `check`, `lint`** — `check` and `lint` met (EXECUTED). `test`: unit, the compositions spec and the compositions smoke file passed here. The four edited specs passed but for one flaky app-shell test (finding 10). I did not re-run the full e2e and smoke suites.

## Findings, most severe first

1. **High — Two claims on the page are not true of the platform as its README states them** (`src/lib/registry/blocks/product-home/+page.svelte:53`, `:58`; `src/lib/preview/composition-samples.ts:30`, `:35`; spec decision 9).
   Failure: the README is the source decision 9 cites, and `003`'s rule, kept by `008` decision 7, is that every claim is true where it is shown. READ, `vfs/README.md`, 2026-11-01:
   - **"1 namespace for every file, row and tool."** The README's banner: "**What is not:** tools at paths. The `run` verb exists and routes to a storage that declares `SupportsRun`; no shipped storage does. The positioning above says where vfs is going; this banner says what is real today." The tagline the claim echoes is the positioning, not the fact.
   - **The console's "Who can see this?" runs `stat /finance/q3.xlsx --grants`.** The README has `stat` (a read verb) and `grants` (a row-level grant call, "built and under review") as two separate things, both Python methods. It names no command line in the current design and no `--grants` flag; the MCP surface is "Next". The scripted output `group finance: read_write` borrows the real rungs, so the demo reads as a real command.
   - Lesser, and the README does the same: the shell card's `pip install vfs-py` installs 0.0.22, which "still ships the previous-generation API", so the `search.py` card's calls are not what that install gives. The README carries an alpha banner beside the line; the page carries none.
   - The block's comment, its item page ("this page's are true of the open platform it names") and the changelog ("Its copy is true of the open platform it names") all assert the rule holds.
   Fix: amend decision 9's copy first, then the block and `composition-samples.ts`. For example "1 namespace over every database you mount" (README: "One namespace, mounted from your stack"); a second example the README shows, such as `glean "do logins need a second factor?"` or `glob "**/*.md" /enterprise`, in the form the README uses; and either drop the install card's implication or label the API as the v2 design. Keep the three changed lines identical in the block and the samples.

2. **Medium — The count-up's zero state shows outside a count: in print, in a capture that never scrolls, and for a frame under reduced motion** (`src/lib/registry/ui/proof-band/proof-band.svelte:56–90`; criterion 6; `tests/e2e/compositions.spec.ts:311–324`).
   Failure, EXECUTED at 1440×900:
   - Loaded, never scrolled, then switched to print media: the digits read `0, 0, 0`. A printed home page says "0 search verbs: glob, grep, glean and graph". The full-page screenshot showed the same.
   - Under `reducedMotion: "reduce"`, jumping the band into view and reading the digits in the next animation frame, with the first value's box inside the viewport: `0, 0, 0`; 300 ms later `4, 1, 0`. The intersection callback runs after that frame is drawn, so the zeros are painted before the jump to the final values. Criterion 6 says "the final values show with no intermediate frame"; the block's item page says "Under reduced motion nothing counts or fills."
   - The test cannot catch it: it accepts `"0"` as a recorded state under reduce (`expect(["0", FINAL[i]]).toContain(text)`).
   Fix: in `onMount`, return before the reset when `readDuration("motion-fill", band)` is 0, so a reader who asked for less motion never sees zeros. Restore the final values on `beforeprint` (or leave them for print through a `print:` rule on a data attribute). Tighten the test: under reduce, nothing is recorded but the final values.

3. **Medium — `proof-band`'s digits never follow a change to `items`** (`src/lib/registry/ui/proof-band/proof-band.svelte:36–38`, `:121–124`).
   Failure, INFERRED from the code: `shown` is seeded once from the first `items` (the `svelte-ignore state_referenced_locally` marks it), and the digits render `shown[index] ?? item.value`. When an app passes new items to a mounted band (a SvelteKit route reusing its page component across `/products/[slug]`, or numbers that arrive from a fetch), the visible digits keep the old numbers while the screen-reader copy reads the new ones. A new fourth item shows its value through `??`; the first three stay stale.
   Fix: render the final value unless a count is running (`counting ? shown[index] : item.value`), or reset `shown` in an effect keyed on `items`. Add a unit or e2e case that changes `items` after mount.

4. **Low — `underBar` works only with `fill`** (`src/lib/registry/ui/stage-hero/stage-hero.svelte:71–72`).
   Failure: `fill={false} underBar` drops `pt-(--size-bar)` with the height, so the words sit under the overlaying bar.
   Fix: `underBar && "pt-(--size-bar)"` on its own, `fill && (underBar ? "min-h-svh" : "min-h-(--size-hero-fill)")`.

5. **Low — Props the types do not hold, and keys that throw on a repeat** (`proof-band.svelte:29–31`, `:118`; `live-console.svelte:147`, `:151`, `:164`; `stage-hero.svelte:94`; `cta-band.svelte:61`; `marketing-footer.svelte:82`, `:91`; `name-strip.svelte:29`).
   Failure: decision 6 makes `label` required when `title` is absent; both are optional in the type, so a band with neither is an unnamed `section`. Every list is keyed by its label or name, so two meters with the same label from an app's `run`, or two footer links both called "Docs", stop the component with Svelte's duplicate-key error.
   Fix: a union type for `proof-band` (`{ title: string } | { label: string }`); key by index where the data is an app's, or say in each prop's comment that labels are unique.

6. **Low — A run that settles after the component is gone still schedules frames and calls back** (`stage-card.svelte:53–78`; `live-console.svelte:72–121`).
   Failure, INFERRED: the effect cleanup cancels the current frame and tweens, but a promise that resolves later sets state, calls `onstate`, schedules a new frame and, in the console, starts tweens reading `document.documentElement`. The scripted 900 ms runs make this easy to hit by navigating away mid-run.
   Fix: a `gone` flag (or `ticket++`) in the cleanup, checked after `await`.

7. **Low — The skip-link test's name promises more than it checks** (`tests/e2e/compositions.spec.ts:600–610`).
   Failure: "focuses main#main, below the bar" asserts only focus. With `overlay` the `main` starts at y 0 under the bar, and its 2 px ring's top edge is hidden there (EXECUTED: `outline solid 2px`, `top 0`). That is not a 2.4.11 failure, since `main` is not fully hidden.
   Fix: rename it ("focuses main#main"), or assert the hero's eyebrow is below the bar after the jump.

8. **Low — The footer's frame shows build facts that are not this build's** (`src/routes/(shell)/view/compositions/marketing-footer/+page.svelte:28–30`).
   Failure: `commit="6fbdf99"`, `builtAt="2026-11-01T00:00:00Z"`, `docId="PS-DS-0010"` are literals. Once this change is committed, the frame shows a commit the page was not built from, the thing `006`'s "no unknown commit" call and R24 guard against.
   Fix: take `version` as the block does, or label the rows as samples in the view's sentence.

9. **Low — The record is not closed** (`specifications/010-the-stage-compositions.md`, header and Landing notes; `specifications/009-…md`, Landing notes).
   Failure: `010`'s Status still reads "ready to build after `009` lands" and its Landing notes "_Filled in when it lands._". `009`'s Landing notes give their test counts as "the full runs after `010` was built on top (`010`'s landing notes)", which do not exist yet.
   Fix: at disposition, fill `010`'s Landing notes (the checkpoint's calls, the deviations, the full runs, this review) and its Status line.

10. **Low — An existing viewer test flakes under parallel load** (`tests/e2e/viewer.spec.ts:192`, the app-shell case).
    Failure, EXECUTED: 1 failure in 950 (dark project), then 1 in 30 (light project), each at the first `expect.poll` (5 s): the frame had not yet taken the parent's theme. Serially, 80 of 80 pass. I have no baseline from before `009` and `010`, so I cannot say whether this change made it worse. Criterion 11 needs `bun run test` to pass, and that suite runs in parallel.
    Fix: run the full suite once or twice. If it recurs, give the first poll the frame's ready signal (wait for `VIEW_READY` inside the frame) before comparing themes. Otherwise record it as a flake in `decisions.md`, as `006` did for its smoke flake.

## What holds

- **Landmarks and headings.** One `banner`, one `main`, one `contentinfo`; one `h1`, then `h2` for the band, the console, the call to action and the footer's two groups (EXECUTED).
- **The sticky bar.** Top-level, at y 0 over the proof band and the footer, 72 px, `scroll-padding-top` 72 px (EXECUTED); in the light theme over paper it reads as a dark veil with legible links (screenshot).
- **Live regions.** Both outcomes are cleared and set on the next frame, so a repeat is announced; a tab change during a console run drops the late result, ends busy and leaves no meters, lines or status (EXECUTED: `busy false, meters 0`, then the same after 1.2 s).
- **The console's tween.** Meters mount at 0 and fill on the next frame through `tween`; a new run or tab cancels the old tweens.
- **Contrast.** Stage muted and stage primary on the veil over white are `009`'s composite rows (5.40, 5.37). The error line, dark `--destructive` `#FF7D73` on the stage's raised card `#0E1014`: 7.65 (EXECUTED). Everything opaque is scanned by axe in both themes.
- **The skip link.** First, fixed at 8/8 when focused, stage-raised ground with paper text, hit-tested as itself (EXECUTED).
- **Label in name.** The home link's name "Pluto Systems" contains the visible wordmark "pluto"; every action's name is its text.
- **Reduced motion elsewhere.** The bloom, the rim's energy, the press and the meters' fill take `009`'s zeroed durations.

## Constitution checks

- **§4.1 source, not a package:** met. The scripted runs are local; the block installs as a route of ui items (smoke).
- **§4.2 driven by need:** met. The owner commissioned the identity's architecture; the need is the chosen hero.
- **§4.3 tokens are the one source:** met. 0 literals; every size is a `009` variable or the scale.
- **§4.4 accessible by default:** met but for finding 2's reduced-motion frame.
- **§4.5 and §4.6 pinned, named dependencies:** met. No new package for `010`; every import is a named item; the frozen install changes nothing.
- **§6 never copy prior art:** met. No code is borrowed. The look is the owner's chosen lab hero (a dark stage, one bloom, pill actions, a mono name strip); no competitor's device (a ribbon, a gradient wash, a logo shape) appears. The brands memo's warning that a dark stage with glow is "the part others copy" stands as the specification's Risk, for question I.
- **§6 never break an installed app silently:** met. No existing item changes in `010`; the changelog says so.
- **Truth where shown (`003`, `008` decision 7):** not met: finding 1.

## Verdict

Does not land yet: finding 1 (two claims the platform's README does not support, under a rule the page says it keeps) and findings 2 and 3 (the count-up's zeros in print and under reduced motion, and digits that do not follow their items) stand; findings 4 to 10 are write-ins.

## Disposition

_Filled in after the author answers._
