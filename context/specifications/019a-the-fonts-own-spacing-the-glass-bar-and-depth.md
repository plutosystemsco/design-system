# 019a — The font's own spacing, the glass bar, and depth

- **Status:** built, 2026-11-15, in the working tree over `804d423`, uncommitted, at 0.12.0. Change review: [`../reviews/019a-the-fonts-own-spacing-the-glass-bar-and-depth-pr-2026-11-15.md`](../reviews/019a-the-fonts-own-spacing-the-glass-bar-and-depth-pr-2026-11-15.md), its findings fixed (see "After the change review"); awaiting its re-check. It lands before the `v0.12.0` tag.
- **Date:** 2026-11-15
- **Author:** the design lead, from the owner's words; built by the builder
- **Kind:** owner-directed fix. Three rulings the owner gave while looking at the design site, written up after the fact so the change has a record. A token change to `pluto-theme` (an interface change, with a sentence in its 0.12.0 bullet), and two site changes that touch no registry item.
- **Depends on:** `019` (landed). Ships in the one 0.12.0 release and its one changelog entry.
- **Research it stands on:** none beyond what the owner saw on the site. The measurements below are the builder's (EXECUTED, 2026-11-15, Chromium from this repository's Playwright).

## Intent

The owner looked at the design site and asked for three things. Each is a decision below, in the owner's words. Nothing else changes.

## Decisions

### 1. The font's own letter spacing, everywhere

**The owner**, shown "Start" on the blue band with its letters pressed together: "are you chaning the text spacing for headers? It looks like the horizontal spacing is altered, please fix and take the font default spacing everywhere."

- Every tracking value in the token file is `0`. These are the four type tokens (`display` −0.03, `section` −0.02, `eyebrow` 0.08, `mark` −0.04) and the four expressive steps (`display` −0.045, `section` −0.035, `proof` −0.04, `poster` −0.05).
- The `tracking-*` utilities and the `--tracking-*` and `--type-*-tracking` variables keep their names, now at `0em`, so no installed app's class breaks.
- No item or site file sets a letter spacing of its own. The search found none to remove: every spacing came from the tokens.
- The lockup's word follows: the downloads' outlined word and `tests/fixtures/lockup-word-width.json` are measured again.
- It is an interface change to `pluto-theme`, with a sentence in its bullet: an app that wants the old tightening sets its own `letter-spacing`.

### 2. The top bar is glass everywhere

**The owner:** "the header bar is transparent in some places and not in others, please unify this." Asked whether the bar should be solid everywhere, glass at the top and solid on scroll, or glass everywhere, **the owner** chose glass everywhere.

- The site bar is frosted glass on every page at all times. Content scrolling behind it shows through, blurred.
- This reverses `018` decision 10 and `018`'s checkpoint-2 ruling. A productive page's bar no longer turns opaque once scrolled, and a landing's bar no longer does once its band has gone. The sentinel, the band observer, the `productive` prop and `data-scrolled` are removed.
- **The blur must render.** The bar's view-transition name sits on the glass panel itself, not on the sticky wrapper around it. In Chromium an element with a view-transition name is a backdrop root, so on the wrapper it left the glass nothing to blur but the wrapper's own empty inside: the tint showed, and the content under the bar stayed sharp. No ancestor of the panel, up to `<html>`, may be a backdrop root (a view-transition name, a filter, opacity below 1, a mask, a clip path, a blend mode, or `will-change` on those). The view transition still names the bar `site-bar`, and `site.css`'s `::view-transition-group(site-bar)` still lifts it above the growing door.
- The glass must keep the lockup, the links, search and the theme switch legible over anything behind it. A test measures each text and icon against the rendered glass behind it, over the busiest content. If it failed, a denser glass or a stronger blur would follow. It did not fail.

### 3. Transparency always signifies depth

**The owner:** "transparency always signifies depth … divs in the headers shouldn't have transparency to the color behind it, they are on the same level. The header bar is above everything else and stays in a fixed position, so it is transparent to what is below it."

- Only a layer above other content may be translucent: the fixed glass bar, overlays, the scrim.
- Everything inside the bar sits on the bar's level. Each child has a solid fill or no fill of its own: no background or border colour with alpha below 1 (but fully transparent), no backdrop filter, and no opacity below 1.
- On the site, two children broke it, both with the 10% hairline (`border-border`):
  - the search button's border, which now takes `border-input`, the solid control edge;
  - the ⌘K key chip's border, which is dropped; the chip takes a solid fill, `bg-code-background`, as a key does.
- No registry item rendered in the bar breaks the rule at rest. The bar renders `Lockup` (its dots fade in with the page's one entrance, which is motion, not depth), `ThemeToggle` and a ghost `Button` (transparent at rest, `accent` on hover, which is solid). The system-wide audit of items is 0.13.0's.

## Scope

**In:** `tokens/pluto.tokens.json`'s tracking values, and what `build:tokens` writes from them (`src/app.css`, `registry.json`, `static/r`, `static/v0.12.0/r`); `tests/fixtures/static-r-amendments.json`; the lockup's fixture; `src/lib/site/chrome/bar.svelte`, `src/lib/site/chrome/search.svelte` and `src/routes/(site)/+layout.svelte`; every thumbnail; `CHANGELOG.md`'s `pluto-theme` sentence; the tests below.

**Out:** the glass tokens (they pass); any registry item's source; the Components index cards (0.13.0).

## Acceptance criteria

1. **Tokens.** `tokens.test.ts`: the four type tracking tokens and the four expressive steps' tracking are `0`. `generated.test.ts`: `--type-*-tracking` and `--tracking-*` read `0em`; the v0.8.0 guard names the four `@theme inline` variables that move. `bun run build:tokens`, run twice, changes 0 files the second time. (unit)
2. **No spacing on the site.** `spacing.spec.ts`: on every sitemap page at 1440, every element holding text of its own computes `letter-spacing` as `normal` or `0px`. (e2e)
3. **Glass everywhere.** `bar-glass.spec.ts`: on `/`, `/components/`, `/components/button/`, `/start/`, `/brand/colour/`, `/foundations/` and `/changelog/`, the bar's panel has a background with alpha below 1 at the top and at 400, 1200 and 4000 px, and never carries `data-scrolled`. (e2e)
4. **Legible over the busiest content.** `bar-glass.spec.ts`: on `/components/button/`, `/components/`, `/brand/colour/` and `/components/code-block/`, each scrolled to 3 or 4 depths, at 1440 and 390, in both schemes: the bar's text and icons are hidden, the panel photographed, and each text run's colour (its Range line boxes) and each icon's colour measured against every pixel of the rendered glass inside its box. The worst reaches 4.5:1. (e2e)
5. **Depth.** `bar-glass.spec.ts`: on `/`, `/components/button/` and `/brand/colour/` at 1440 and 390, in both schemes, at rest and while each of the bar's links and buttons is hovered: no descendant of the bar's panel has a background or border colour with alpha strictly between 0 and 1 (read from any colour syntax's `/ alpha`, so the `oklab(… / a)` a Tailwind `/NN` modifier computes is caught), a backdrop filter, or opacity below 1. A child forced to `bg-foreground/50` is found. (e2e)
5a. **The blur renders.** `bar-glass.spec.ts`:
    - no ancestor of the glass panel, up to `<html>`, is a backdrop root;
    - on `/components/button/`, `/components/`, `/brand/colour/` and `/components/code-block/`, at 1440 and 390, in both schemes, at the depth with the busiest content under the bar: the high-frequency energy (the sum of absolute luminance differences between neighbouring pixels) of the panel's interior, with the bar's own text hidden, is under 5% of the same region's with the bar hidden. A tint alone lets through about 14% in light and 16% in dark.
    (e2e)
6. **The changelog.** `registry.test.ts`: the one `pluto-theme` bullet names the font's default letter spacing, `--tracking-display`, `--type-display-tracking` and `letter-spacing`, and still ends with `019`'s sentences. (unit)
7. **The suites.** Unit, `check`, `lint`, the literal lint, the release check, e2e in both projects with perf, and smoke pass. The 018 tests that expected opacity are removed from `site.spec.ts`; the hero and the doors' headline checks still pass. (all)

## Landing notes

- **Built** in the working tree over `804d423`, uncommitted, at 0.12.0. The owner's words above are the record of the three calls; `decisions.md` is retired, and this specification holds them.
- **Tests first, seen failing:**
  - unit: 7 failures (the two tracking tests in `tokens.test.ts`, five `--type-*-tracking` and `--tracking-*` pins in `generated.test.ts`), then the changelog check;
  - e2e, `bar-glass.spec.ts` on the old code, both schemes: 22 failed. Every "glass everywhere" page but `/` and `/brand/colour/` turned opaque once scrolled. Every depth test failed: the search button's and the ⌘K key's borders were the 10% hairline (`rgba(11, 15, 23, 0.1)` light, `rgba(243, 240, 232, 0.1)` dark). The contrast tests passed on the old code, where the scrolled bar was opaque.
  - `spacing.spec.ts`: its first run errored before measuring, because its dark-project skip read `testInfo` in a callback that gets none. Fixed, it was run on the old token file for three pages (`/start/`, `/brand/` and `/components/button/`) and failed all three with real spacings: "Start" in `type-display` at −3.888 px, section headings at −0.56 px, the eyebrows at +0.96 px, and the lockup's word at −1.12 px. The new token file was then restored and the registry rebuilt from it.
- **The lockup.** `bun scripts/site/lockup-width.ts`: the word "pluto" at 100 px is now 245 px wide, was 225 px (−0.04 em on each of its five letters removed). `tests/fixtures/lockup-word-width.json` holds the new figure. The downloads' outlined word reads the token, and `brand-assets.test.ts` and `site.spec.ts` criterion 7 agree with the fixture.
- **No literal spacing to remove.** A search of `src/`, `scripts/` and the tests found no `letter-spacing`, `tracking-[…]` or `tracking-row` that set a value of its own: every spacing came from the tokens. `site.css`'s one `letter-spacing: var(--tracking-section)` now reads 0. `tracking-normal` on the Components index's group counts sets 0 and stays.
- **The registry.** `static/r` and `static/v0.12.0/r` hold `pluto-theme`'s new values. `tests/fixtures/static-r-amendments.json` gains 2 entries, both used. `registry.json` changes only in the eight tracking values. The v0.8.0 guard lists the four `@theme inline` variables that move.
- **Thumbnails:** `bun scripts/site/thumbnails.ts` wrote 150 images, 641 kB, in 169 s. Every hash moved. 38 images changed: those whose first example shows a heading, an eyebrow or the lockup (the blocks, the compositions, `sidebar`, `empty`, `message` and `message-log`).
- **The depth rule's one wait.** The depth test waits for the page's finite animations before reading: the lockup's dots fade in with the page's one entrance, at opacity 0 for its first frames. That is motion, not depth.
- **Registry items in the bar:** none breaks the depth rule at rest (decision 3). Nothing in `src/lib/registry/` changes for it.
- **Found, not 019a's:** two of `thumbnails.test.ts`'s staleness tests ("the site layout stales every example item", "Button's route stales Button alone") hash a copy of the tree and timed out at bun's 5 s default once, under the load of the thumbnail run. They pass alone.
- **The glass, measured** (`bar-glass.spec.ts`, the full e2e run, both schemes): over `/components/button/`, `/components/`, `/brand/colour/` and `/components/code-block/` at 3 or 4 depths, at 1440 and 390, the lowest reading of any text or icon in the bar against the rendered glass behind it was 10.32:1 over the unblurred glass of the first build, and is 10.89:1 over the blurred glass after the fix (16 runs, the final e2e run). Under the bar, 0.1% to 1.2% of the content's edges show through. The floor is 4.5:1. The glass tokens did not need to change. At rest the panel reads `rgba(243, 240, 232, 0.86)` in light and `rgba(22, 20, 15, 0.84)` in dark on every page and at every depth sampled.
- **The hero and the doors.** No page scrolls sideways at 1440 or 390 on the pages photographed. `doors.spec.ts`'s headline and disc checks, and `blocks.spec.ts`'s reflow at 320, pass.
- **Suites** (2026-11-15, after the blur fix and the change review's fixes):
  - `bun run test:unit`: 1211 pass, 0 fail;
  - `bun run check`: 0 errors;
  - `bun run lint`: clean;
  - the literal lint: 0 violations, 1 allowance (L24);
  - `bun scripts/site/release-check.ts`: exit 0;
  - `bun run build:tokens`, run twice: 0 changes the second time;
  - `bun run test:e2e`: 2888 passed, 113 skipped, 0 failed. The skips are the spacing test's dark half, by design. Perf's 5 budgets pass, medians: `/` 307 kB and 868 ms; `/components/` 355 kB and 2,776 ms; `/components/button/` 380 kB and 1,040 ms; `/components/code-block/` 354 kB and 1,088 ms; `/brand/colour/` 302 kB and 864 ms;
  - `bun run test:smoke`: 132 pass, 0 fail.
- **An interface change made at the owner's word.** Decision 1 changes `pluto-theme`'s values, an interface change marked in the changelog. It was made directly at the owner's instruction, before the tag. It is not a small change in `AGENTS.md`'s sense, and it had no specification review; this specification was written after the build to record it.
- **The blur fault, and its fix** (the design lead's find, after the first build). The panel's tint rendered, but its 16 px blur never did. `bar.svelte` set `view-transition-name: site-bar` on the sticky wrapper. In Chromium an element with a view-transition name is a backdrop root, so the glass inside it could blur only the wrapper's own empty inside, and the content under the bar stayed pixel-sharp. The contrast test had passed regardless: it measures text against whatever the glass renders, sharp or blurred.
  - **Tests first.** Two tests were added to `bar-glass.spec.ts` (criterion 5a) and run on the old bar, with the name still on the wrapper: 18 of 18 failed in both schemes. The ancestor check found `div[site-bar] view-transition-name site-bar`. The edge-energy check found 14.1% of the edges under the bar showing through in light and 16.2% in dark, which is the tint's alpha with no blur at all.
  - **The fix.** The name moved onto the `.glass` panel. Afterwards 0.1% to 1.2% of the edges show through, against the 5% bound. `doors.spec.ts`'s view-transition tests pass. Checked by eye at 5% playback speed, mid-transition, in both schemes: the bar's snapshot, now the panel, stays above the growing door and its band (`/private/tmp/claude-501/-Users-claygendron-Git-Repos-design-system/7b613866-3b2d-4829-bdd1-f2b35ebc0fd1/scratchpad/019a/vt/door-{light,dark}-1500ms.png`).
- **After the change review** ([`../reviews/019a-the-fonts-own-spacing-the-glass-bar-and-depth-pr-2026-11-15.md`](../reviews/019a-the-fonts-own-spacing-the-glass-bar-and-depth-pr-2026-11-15.md): does not land yet; each finding as the design lead ruled):
  1. **(High) The blur:** fixed as above. The two new tests were seen failing on the old bar. Decision 2 and criteria 5 and 5a are updated. The contrast is measured again over the blurred glass (below).
  2. **(Medium) Thumbnails:** the bar edit staled the hash of every item whose page imports the site layout. `bun scripts/site/thumbnails.ts` redrew all 150 images (641 kB, 164 s). The same 38 images differ from `804d423` as after the first run, the manifest is current, and `thumbnails.test.ts` passes, 10 of 10.
  3. **(Medium) The two pages:** `/foundations/type/` now says type is set at the font's own spacing at every size, with each tracking utility at 0. `/brand/type/` says the display steps are set at the font's own spacing. The brand page's source comment cites this specification.
  4. **(Medium) The alpha parser:** the depth test now reads any colour syntax's `/ alpha` (`rgb`, `oklab`, `oklch`, `color()`), as well as `rgba`'s fourth value. A child forced to Tailwind's `bg-foreground/50` (`color-mix(in oklab, var(--foreground) 50%, transparent)`) is found, as `oklab(… / 0.5)`.
  5. **(Low) The door transition:** checked by eye, as above.
  6. **(Low) The old values:** the changelog sentence now gives them, checked against `804d423`'s token file: `--tracking-display` −0.03em, `--tracking-section` −0.02em, `--tracking-eyebrow` 0.08em, `--tracking-mark` −0.04em; `--type-display-tracking` −0.045em, `--type-section-tracking` −0.035em, `--type-proof-tracking` −0.04em, `--type-poster-tracking` −0.05em.
  7. **(Low) Hover:** the depth test runs at rest and with each visible link and button of the bar hovered. Nothing translucent appears.
  8. **(Low) The interface change at the owner's word:** recorded above.
  9. **(Low) The broken comment** in `site.spec.ts` is rewritten.
  - **Not taken:** the ⌘K key's `::after` content. The chip is solid (`bg-code-background`), so the glass cannot show through it.
