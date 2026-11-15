# Review of 019a — The font's own spacing, the glass bar, and depth (the built change)

Reviews [`specifications/019a-the-fonts-own-spacing-the-glass-bar-and-depth.md`](../specifications/019a-the-fonts-own-spacing-the-glass-bar-and-depth.md). This reviewer wrote neither the specification nor the code.

- **Date:** 2026-11-15
- **Status:** dispositioned. Lands. All ten findings are closed, and finding 7 is closed without a change, as recommended (see "Re-review", below).
- **Reviewer:** a reviewer; not the author
- **Reviewed:** the working tree over `804d423`, uncommitted.
  - **Tokens and what they generate:** `tokens/pluto.tokens.json`, `src/app.css`, `registry.json`, `static/r` and `static/v0.12.0/r` (`pluto-theme.json`).
  - **Site:** `bar.svelte`, `search.svelte` and `(site)/+layout.svelte`.
  - **Thumbnails:** the manifest and 38 images.
  - **Changelog:** `CHANGELOG.md`.
  - **Tests and fixtures:** `tokens.test.ts`, `generated.test.ts`, `site.spec.ts`, `lockup-word-width.json` and `static-r-amendments.json`.
  - **Untracked:** `tests/e2e/spacing.spec.ts`, `tests/e2e/bar-glass.spec.ts` and the specification.
  - **Not 019a's, so not reviewed:** `decisions.md`'s deletion, `AGENTS.md`, `constitution.md`, `context/README.md`, `handoff.md`, `roadmap.md`, `scripts/bench/pluto.ts`, the 019 block in `registry.test.ts`, and the drafts for 020 to 026.
  - **Mid-review change:** while this review ran, the builder began fixing finding 1. `bar.svelte` and `bar-glass.spec.ts` changed under it, and both were re-read before this was written. The specification has not yet been updated for the fix.
- **Re-ran:** Bun, 2026-11-15. Nothing was written but this file. Scratch work is in the session scratchpad, `review-019a/`. The probes used the owner's dev server on 5199, read-only.
  - `bun test tests/unit` → **1,211 pass, 0 fail**, 11,470 `expect()` calls, 35 files (before the bar fix).
  - `bun run check` → 2,164 files, **0 errors, 0 warnings**.
  - `bun run lint` → clean.
  - `bun test tests/unit/thumbnails.test.ts`, re-run after the builder's fix to `bar.svelte` → **9 pass, 1 fail**: "58 thumbnail pairs are stale or missing" (finding 2).
  - **Not run by me:** e2e, smoke, and thumbnail or registry generation. The e2e figures below are the builder's, except where a probe is named.
  - **Probes (Playwright on Chromium, against 5199):**
    - the contrast check copied from `bar-glass.spec.ts`, run on the real glass and on a thin one;
    - the depth test's own alpha parser, fed the colour forms that Chromium computes;
    - hover states inside the bar;
    - edge energy under the bar, with and without the view-transition name on the wrapper.
  - **Benchmark:** `bun scripts/bench/pluto.ts --rev 804d423` against the working tree. Only two counts move: `e2eSpecs` 26 → 28 (019a's two files) and `specifications` 19 → 23 (019a, and the drafts for 020 to 022). **No scorecard score moves.** Nothing 019a changes is a dimension the rubric scores.

## Acceptance criteria against evidence

1. **Tokens** — met.
   - EXECUTED: the unit suite passes.
   - READ: the diff sets the token file's four `type.tracking` values and the four `expressive.display.steps[*].tracking` values to `0`.
   - READ: `src/app.css:108–117` and `316–319` read `0em`. `registry.json` and both `static/r` copies change only in those eight values.
   - READ: `diff -rq static/r static/v0.12.0/r` shows no difference. `static/v0.11.0` is untouched.
   - READ: the amendments fixture gains 2 entries.
2. **No spacing on the site** — met.
   - READ: a grep of `src/`, `static/r`, `static/v0.12.0`, `registry.json`, `tokens/` and `scripts/` finds no `tracking-*` utility but the four token names, and no literal `letter-spacing`. Every `letter-spacing` reads a token: `app.css:652–677`, `site.css:240`, and `scripts/site/lockup-width.ts:33`, which reads the token file.
   - The test is not vacuous. It walks every text node's parent on every sitemap page. The builder's red, with the old tokens restored on three pages, gave −3.888 px for "Start". That figure agrees with −0.03 em of `type-display` at 129.6 px.
   - The dark-half skip is justified. No tracking token is themed: each is defined once, in `:root` or `@theme`. No `.dark` rule sets `letter-spacing`. The walker reads hidden elements too, so content that shows only in dark is still read in the light project.
3. **Glass everywhere** — met as written, but the glass blurred nothing (finding 1).
   - READ: the sentinel, the band observer, `productive`, `data-scrolled` and the background transition are all gone from `bar.svelte` and `+layout.svelte`. A grep finds no leftover in `src/`, `tests/` or `scripts/`.
   - `--glass-fallback` stays. It is still used by `.glass` under `@supports not`, reduced transparency and forced colours.
   - The spec's own words, "shows through, blurred", were not met until the fix.
4. **Legible over the busiest content** — met as measured. It must be re-measured over a glass that blurs (finding 1).
   - EXECUTED, with my copy of the check on `/components/button/` at 1440: lowest **12.46:1** in light and **10.32:1** in dark, over 26,628 pixel readings each.
   - The check can fail. With a thin glass forced (`rgb(128 128 128 / 0.15)`, no backdrop filter), the same check reads **1.17** in light and **1.16** in dark.
   - So it measures real rendered pixels. But it cannot tell blurred content from sharp content (finding 1).
5. **Depth** — met at rest. The test cannot see two common colour forms (finding 4).
   - EXECUTED, the hover states, both schemes:
     - a door link takes `accent`, solid (`rgb(233, 229, 219)` light, `rgb(44, 40, 33)` dark);
     - the theme switch takes the same;
     - the search button's border turns `foreground`, solid;
     - the ⌘K chip is `rgb(255, 255, 255)` in light and `rgb(44, 40, 33)` in dark, with no border;
     - the search border at rest is `--input`, solid.
6. **The changelog** — met.
   - READ (`CHANGELOG.md:13`): the sentence sits in the one `pluto-theme` bullet, after the yellow and `--syntax-navy` sentences. It comes before, and leaves intact, `019`'s closing sentences on the sticky-bar rule.
   - It names all eight variables, the `tracking-*` utilities and `letter-spacing`.
   - It is accurate. See finding 6 for one omission.
7. **The suites** — partly. Unit, `check` and `lint` were re-run by me and pass on the tree as built. After the builder's bar fix, `thumbnails.test.ts` fails (finding 2). e2e and smoke must be re-run after the fix.

## Findings, most severe first

1. **High. The bar's glass blurred nothing, so decision 2 was not met** (`src/lib/site/chrome/bar.svelte:61` as reviewed: `style:view-transition-name="site-bar"` on the sticky wrapper). The design lead found this, and the builder is fixing it.
   - **The fault.** A view-transition name makes its element a backdrop root in Chromium. The `.glass` panel's `backdrop-filter: blur(16px)` therefore sampled nothing behind the wrapper. Content under the bar showed pixel-sharp, under the tint alone.
   - **EXECUTED, the edge energy under the bar.** I measured the mean difference between neighbouring pixels in the panel, with the bar's own text hidden, on `/components/code-block/` at 900 px. It was **1.476** with the name on the wrapper and **0.0081** with it removed: about 180 times as much detail showing through. In both cases, `getComputedStyle(.glass).backdropFilter` reads `blur(16px)`.
   - **How the tests missed it:**
     - "Glass everywhere" reads only the panel's computed background alpha. That was right throughout.
     - Any computed-style check of the panel passes, because the filter is declared and computed. It just has no backdrop to blur.
     - The contrast check needs 4.5:1 only. An 86% (light) or 84% (dark) tint over sharp content still gave 10.32:1 or better. Legibility does not need blur, so the check was right to pass. It was never a test of blur.
     - The depth test walks the panel's descendants, never its ancestors.
     - Nothing compared the content under the bar with what shows through it. Every check ran in Chromium alone.
   - **The fix, in the tree now.**
     - The name moves onto `.glass` (`bar.svelte:74`), with a comment saying why.
     - Two tests are added (`bar-glass.spec.ts:264` on):
       - no ancestor of the panel, up to `<html>`, is a backdrop root (a view-transition name, a filter, opacity, a mask, a clip path, a blend mode, a backdrop filter, or `will-change` on those);
       - over the dense pages, at 1440 and 390, the edges that show through are under 5% of the edges under the bar.
     - EXECUTED on the fixed tree: the edge energy reads 0.0081, so the blur renders.
     - By my figures, the second test fails on the old code: a tint of about 14% lets about 14% of the edges through.

   Required:
   - record both new tests seen failing on `804d423`'s bar;
   - update decision 2, add a criterion for the blur, and add a landing note naming the backdrop-root cause;
   - re-measure criterion 4's lowest reading over the blurred glass, and replace "10.32:1" and the panel colours in the landing notes;
   - re-run e2e in both projects.
2. **Medium. The bar fix stales 58 thumbnail pairs, and the unit suite now fails** (`scripts/site/thumbnail-hash.ts:141`).
   - The hash of every component page's thumbnail includes the local graph of `(site)/+layout.svelte`, which imports `bar.svelte`.
   - EXECUTED: `thumbnails.test.ts` → "58 thumbnail pairs are stale or missing".
   - The pictures should not change, because no thumbnail shows the bar. The hashes still must.

   Required: run `bun scripts/site/thumbnails.ts` after the fix is final. Expect the manifest to move and the images to stay byte-identical. Record any image that changes bytes.
3. **Medium. The Foundations type page now says something false** (`src/routes/(site)/foundations/type/+page.svelte:126`: "Large type is set tighter, and small capitals looser.").
   - Every tracking value is now 0 em, and the table under the sentence shows four rows of "0 em".
   - Its Markdown twin repeats the claim.
   - `src/routes/(site)/brand/type/+page.svelte:55` ("is set tight, with little leading") reads the same way for the display ladder. "Set tight" is a spacing claim.

   Required:
   - in Foundations, say that every face is set at its own spacing; that the four `tracking-*` utilities stay, at 0 em, so an app's classes still resolve; and that an app sets its own `letter-spacing` to change it;
   - in Brand, drop "set tight," and keep "with little leading";
   - consider dropping the four-row "Tracking" table and the display table's Tracking column, which now carry only zeros.
4. **Medium. The depth test cannot see a translucent colour written as `oklab()` or `color()`** (`tests/e2e/bar-glass.spec.ts:221–226`).
   - Its parser reads only `rgb()`/`rgba()`, and treats any other form as solid.
   - EXECUTED, in the bar, both schemes:
     - `color-mix(in oklab, var(--accent) 50%, transparent)` computes to `oklab(0.922 0.0004 0.014 / 0.5)`, and the parser returns **1**;
     - `color-mix(in srgb, var(--foreground) 24%, transparent)`, the field bands' `--border`, computes to `color(srgb … / 0.24)`, and the parser returns **1**.
   - Every Tailwind opacity modifier (`bg-accent/50`, `border-input/30`) computes to the first form. So the commonest way to break decision 3 passes the test.
   - Nothing in the bar uses such a colour today, so the result is right now. The guarantee is wider than the test.

   Required: read the alpha from any colour function, for example the last `/ <number|percent>` before the closing parenthesis, with a percentage divided by 100, and fall back to `rgba`'s fourth comma field. Prove it with a probe element given `bg-accent/50`, seen failing.
5. **Low. Moving the view-transition name changes what the door transition snapshots** (`src/lib/site/site.css:159`, `::view-transition-group(site-bar) { z-index: 1 }`).
   - The snapshot is now the panel, not the 88 px wrapper. The skip link sits outside the panel and leaves the snapshot.
   - No test covers the transition (a grep of `tests/e2e` for `view-transition` finds only `bar-glass.spec.ts`).

   Fix: once, from `/` into a door, by eye or with a frame capture: the lockup keeps its four dots above the growing disc, as `018` intended. One line in the landing notes.
6. **Low. The changelog tells an app how to keep the old spacing, but not what it was** (`CHANGELOG.md:13`: "an app that wants the old spacing sets its own `letter-spacing`").

   Fix: append "(it was −0.03 em display, −0.02 em section, 0.08 em eyebrow and −0.04 em mark; −0.045, −0.035, −0.04 and −0.05 em for the display, section, proof and poster steps)".
7. **Low. The contrast check does not measure the ⌘K chip's glyphs** (`bar-glass.spec.ts:71`).
   - The keys are `::after` content (`site.css:55`, `content: attr(data-keys)`), so the text walker never finds them.
   - The chip is solid, so the glass cannot affect it. EXECUTED: foreground on `#FFFFFF` in light and on `#2C2821` in dark.

   Fix: none needed. Optionally, a comment beside `targets()` saying why the chip is not read.
8. **Low. The depth test reads the bar at rest only** (`bar-glass.spec.ts:219`). Hover and `aria-expanded` states were checked by hand (criterion 5) and are solid.

   Fix: optionally, hover each link and button in the panel and re-read. Finding 4's parser fix matters more.
9. **Low. "Owner-directed fix" is not a kind the constitution knows** (the specification's **Kind** line).
   - It is an interface change to `pluto-theme`, so it is not a _small change_ (constitution §5). It had no specification review.
   - The owner's words are the decisions, and this review reads the result.

   Fix: one line in the landing notes. Either the owner's direct ruling stood in for the specification review, or the lead asks the owner whether "owner-directed" should become a named kind in §5.
10. **Low. A comment wraps mid-sentence** (`tests/e2e/site.spec.ts:792–796`: "…The bar is / glass at all times;").

    Fix: reflow the comment.

Recorded, not findings:
- **The thumbnails as built:** 38 images changed bytes. They are exactly the 19 items whose first view shows a heading, an eyebrow or the lockup's word (`app-shell`, `chat`, `cta-band`, `empty`, `hero`, `live-console`, `marketing-bar`, `marketing-footer`, `message`, `message-log`, `page-states`, `product-home`, `proof-band`, `settings`, `sidebar`, `sign-in`, `sign-up`, `stage` and `stage-hero`, in both schemes).
- **Unchanged images that use a tracking token:** `four-dot` and `dropdown-menu`. `four-dot`'s first example is the mark, with no word. `dropdown-menu`'s picture shows the lower half of the open menu, below the shortcuts that use `tracking-mark`, which I checked by viewing it. Both stay byte-identical, as they should.
- **The search button:** it takes `border-input`, the solid control edge. The chip drops the 10% hairline and takes `bg-code-background`, like the `kbd` item's fill. In light that is white, inside an expressive bar. `.surface-ink`'s override does not apply there.
- **The lockup fixture:** 225 → 245 px, which is 5 letters × 0.04 em × 100 px. Consistent.

## Constitution checks

- **§4.1 and §6, never break an installed app silently:** met. The eight variables and the `tracking-*` utilities keep their names. The change is in `pluto-theme`'s **interface change** bullet. Finding 6 is a write-in.
- **§4.3, tokens are the one source:** met. No literal spacing was added, and the site's two new classes are token roles (`border-input`, `bg-code-background`).
- **§4.4, accessible by default:** met on what is checked.
  - The bar's text reads at least 10.32:1 in Chromium.
  - Reduced transparency and forced colours still fall back to the opaque glass (`app.css:791–806`).
  - Blur is checked in Chromium alone. Firefox and WebKit, where backdrop filters render differently, are `022`'s.
- **§5, how we work:** finding 9. The benchmark was re-run, as above. No score moves.

## Verdict

Does not land yet: finding 1 (the blur, fixed in the tree but not yet recorded, re-measured or re-run), finding 2 (the thumbnails' hashes after that fix), finding 3 (the Foundations and Brand type pages' spacing claims) and finding 4 (the depth test's parser).

The owner's three rulings are otherwise met in full:
- every tracking value is 0 at its source and in everything generated from it;
- the bar no longer turns opaque anywhere, and the sentinel and its machinery are gone without a trace;
- nothing inside the bar is translucent, at rest or on hover.

The spacing test and the contrast test both fail when they should. The contrast test was never able to catch the missing blur, which is why finding 1 needed its own test.

## Disposition

The builder's answers are in the specification's landing notes, under "After the change review". The re-review below checks each one.

## Re-review, 2026-11-15

- **Reviewed:** the working tree over `804d423`, still uncommitted, after the builder's fixes.
- **Re-ran:**
  - `bun test tests/unit` → **1,211 pass, 0 fail**, 11,470 `expect()` calls. `thumbnails.test.ts` passes again.
  - `bun run check` → 2,164 files, **0 errors, 0 warnings**.
  - `bun run lint` → clean.
  - `bun --bun playwright test tests/e2e/bar-glass.spec.ts tests/e2e/spacing.spec.ts` → **164 passed, 102 skipped, 0 failed**, in 1.4 m. The skips are the spacing test's dark half.
  - `bunx playwright test …`, as the brief gave it, runs Playwright under Node. Node cannot import `registry.json` without an import attribute, so it finds no tests. Use the package's `bun --bun playwright test`.
- **Nothing regenerated:**
  - `git status` is the same before and after the runs.
  - The SHA-1 of every modified or untracked file outside `context/` is the same before and after.
  - So is the SHA-1 of every file under `static/` and `src/lib/site/thumbnails/`.
  - The e2e web server's build wrote only to ignored paths.
- **The figures, both projects:**
  - **Contrast:** the lowest reading of any text or icon in the bar over the blurred glass is **10.89:1** (`/brand/colour/`, 1440). The highest of the minimums is 16.69:1.
  - **Blur:** 0.1% to 1.2% of the edges under the bar show through, against the 5% bound.

### Each finding against the diff

1. **The blur** — closed.
   - The view-transition name is on `.glass` (`bar.svelte:74`), with a comment saying why.
   - `bar-glass.spec.ts` adds the ancestor check and the edge-energy check over the four dense pages at 1440 and 390. Both pass. My figures from the first round (1.476 → 0.0081) agree with the builder's account that 18 of 18 failed on the old bar.
   - The specification adds decision 2's "the blur must render" and criterion 5a, a landing note on the backdrop-root cause, and the contrast figure measured again.
2. **The thumbnails** — closed.
   - `thumbnails.test.ts` passes.
   - The same 38 images differ from `HEAD` as before, all of them the 19 items with a heading, an eyebrow or the lockup's word in their first view.
3. **The type pages** — closed.
   - `/foundations/type/` now says type is set at the font's own spacing, at every size: each tracking utility reads 0, and a product sets `letter-spacing` itself.
   - `/brand/type/` says the display steps are set "at the font's own spacing, with little leading", and its source comment cites 019a.
   - The tables of zeros stay. That was optional.
4. **The depth parser** — closed.
   - `translucent()` (`bar-glass.spec.ts:205`) reads the `/ alpha` of any colour function, in numbers or per cent, and `rgba`'s fourth value.
   - A new test puts a child given `color-mix(in oklab, var(--foreground) 50%, transparent)` into the panel. It finds that child, and only that child, as `oklab(… / 0.5)`. The parser is seen catching what it missed.
5. **The door transition** — closed. The landing notes record the eye check at 5% playback speed, mid-transition, in both schemes.
6. **The old values** — closed. Checked against `git show HEAD:tokens/pluto.tokens.json`:
   - the four `type.tracking` values are display −0.03, section −0.02, eyebrow 0.08 and mark −0.04;
   - the steps' tracking values are display −0.045, section −0.035, proof −0.04 and poster −0.05;
   - the changelog sentence (`CHANGELOG.md:13`) gives exactly these, each with its variable's name.
7. **The ⌘K glyphs** — not taken, as recommended. The chip is solid, so the glass cannot affect them.
8. **Hover** — closed. The depth test now also hovers every visible link and button in the panel, and reads the panel again after each one.
9. **The kind** — closed. The landing notes record the interface change made at the owner's word, without a specification review.
10. **The comment** — closed (`site.spec.ts`).

### New, Low, a write-in

11. **A doc comment no longer sits over its code** (`tests/e2e/bar-glass.spec.ts`, the block that begins "019a decision 3 … only a layer above other content is translucent"). After the refactor it sits between `translucent()` and `targets()`'s own comment, above neither of the code it describes.

    Fix: move it above `translucent()` or above the `describe("nothing inside the bar is translucent")`. This does not hold the landing.

### Verdict, as it stands

Lands. The owner's three rulings are met in full:
- every letter spacing is the font's own;
- the bar is glass everywhere, and now blurs what lies under it;
- nothing inside the bar is translucent, at rest or on hover.

Each check was seen failing on the old code, nothing is left stale, and finding 11 is a write-in.
