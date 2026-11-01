# The orbit-assemble entrance and the footer's furniture

- **Status:** complete
- **Date:** 2026-11-01
- **Owner:** Clay Gendron (research executed by an agent, Claude, sub-agent of the orchestrating session)
- **Question:** For the app shell of `006`: how does design book v2's cover entrance run, measured; how does our `FourDot` gain that entrance from tokens alone, and what does "one per page" mean once SvelteKit navigates on the client; what must the shell's header add to `001`'s; how does the footer get its commit hash, build date and doc ID at prerender; what should the owner know to choose a doc-ID scheme; and what would a favicon take.
- **What it blocks:** specification `006`, the app shell (header with the lockup, the one entrance, the footer). The doc-ID scheme and the icon's colour on ink stay the owner's calls (`001` decision 28; handoff.md).

## How to read this memo

Every claim carries a label.

- **EXECUTED**: we ran it and saw the result, on 2026-11-01, macOS (Darwin 25.5.0, arm64), Bun 1.3.14. Browser checks ran in Playwright 1.64.1's Chromium (build 1248), through the repository's own `node_modules/@playwright/test`. Nothing was written to this repository except this memo.
- **READ**: a source says so. Each web source was read on 2026-11-01. The local sources were read the same day: design book v2 at `/Users/claygendron/Git/Repos/plutosystemshq/pluto-systems-design-book-v2.html`, cited as *v2* with its line; the logo generator at `plutosystemshq/tools/logo/generate.js`; the mockup `plutosystemshq/mockups/11-orbit-assemble.html`; SvelteKit 3.1.0's types and source under `node_modules/@sveltejs/kit/`; the specifications, cited by decision number.
- **INFERRED**: our reasoning.

Scratch work lives in the session scratchpad, folder `research-006-shell/`: `book-measure.ts` (the book in Chromium), `app/` (a copy of `tests/smoke/fixtures/kit3` with the sketch), `app-measure.ts`, `reduce-timeline.ts`, `preview-nav.ts` (the repository's dev server), `lint-sketch.ts`, `shots/` (screenshots), `notes/` (the JSON each run wrote).

Terms of art.

- **Entrance.** v2 §06's one animated moment per page: the mark's four dots arrive and settle. The book calls its keyframes `dockin`; the brand calls the idea *orbit-assemble*.
- **Keyframes.** A CSS rule (`@keyframes`) that names the start and end of an animation. A **fill** of `both` shows the first frame before the animation starts and holds the last frame after it ends.
- **Reduce.** The media query `prefers-reduced-motion: reduce`, a system setting that asks pages not to move.
- **Layout.** In SvelteKit, `+layout.svelte` wraps the pages beneath it. A **layout group** is a folder in parentheses that shares a layout without changing the URL (`003` decision 16).
- **Client-side navigation.** SvelteKit replacing the page's content on a link click without a full document load.
- **Landmark.** A region assistive technology lists: `banner` (the site header), `navigation`, `main`, `contentinfo` (the site footer).
- **Skip link.** A link, first in the page, to the main content (patterns memo §1.2).
- **Prerender.** SvelteKit rendering a route to a static HTML file at build time (`001` decision 3).
- **Doc ID.** A short identifier printed on a document, such as v2's `PS-DB-0002`.
- **Ladder.** `001` decision 10's sizes: 4, 8, 12, 16, 24, 32, 48, 64 and 96 px.

## In short

- **The book's entrance runs four `dockin` animations of 500 ms, delayed 150, 240, 330 and 420 ms, on the curve `cubic-bezier(.2, .7, .3, 1)`; the last ends at 920 ms** (EXECUTED, §1). Each dot starts at opacity 0, scaled to 0.4, offset up to 0.5 em, and glides to its place. The book's subtitle then rises for 600 ms from 550 ms, ending at 1150 ms, so the book's own cover spends 250 ms more than its 900 ms rule. Under reduce the whole block is inside `@media (prefers-reduced-motion: no-preference)`: zero animations, the dots at opacity 1 (EXECUTED).
- **The mockup `11-orbit-assemble.html` is a different animation**: JavaScript, a 17° tilted spiral per dot, 900 ms each at 0, 110, 220 and 330 ms, ending at 1230 ms (READ, §1.4). It is over budget and needs script. The book's `dockin` fits the budget in CSS alone.
- **Our sketch fits in 900 ms from tokens alone** (EXECUTED, §2): a `mark-entrance` utility in `pluto-theme`, keyframes that read `--mark-orbit` (one new em token) and `--ease-entrance`, durations and delays as unitless multiples of `--motion-entrance`. Measured: 495 ms per dot, delays 135, 225, 315 and 405 ms, the last ending at 900.0 ms; end state opacity 1 and the identity transform. The two `.svelte` copies pass the literal lint with 0 violations.
- **Under reduce, `001`'s 0.01 ms catch-all leaves the dots invisible for one frame** before they land composed; a true 0 ms duration lands them before the first frame (EXECUTED, §2.4). `006` can add one rule to the reduce block so our own entrance is `animation: none`, which v2's "never a blank" asks for.
- **"One per page" means one per full document load.** SvelteKit keeps a layout's components across client-side navigation (READ); in both the scratch app and this repository's dev server the header's lockup was the same DOM node after navigating, with 0 new animation starts (EXECUTED, §2.5).
- **The commit hash reaches the footer through `kit.version.name`**, set in `vite.config.ts` from `git rev-parse --short HEAD` and read with `import { version } from "$app/env"`. The prerendered `build/index.html` of the scratch app holds `b3d2a8e` (EXECUTED, §4.2). The build date came through Vite's `define`. SvelteKit's default `version.name` is a timestamp, which the docs say to replace with a deterministic value such as a commit (READ).
- **The header must add** a skip link to `<main id tabindex="-1">`, the `banner` and a labelled `nav`, the groove as its edge, and a 64 px height from the ladder (§3). The skip link worked as the first Tab stop in the sketch, and Enter moved focus to `main` (EXECUTED).
- **The doc-ID facts are collected and three schemes are costed** (§5). The owner decides.
- **A favicon does not block the shell** (§6): the app's `app.html` owns the `<link rel="icon">`, and the repository ships no icon today.

## 1. The reference entrance, measured

### 1.1 What the book's CSS says (READ, v2 lines 105 to 114)

The entrance lives in one block, `@media (prefers-reduced-motion: no-preference)`.

- Every dot of the cover's mark starts at `opacity: 0` and runs `dockin .5s cubic-bezier(.2,.7,.3,1) forwards` (line 106).
- Per dot, in reading order (blue, red, amber, green: `.d1` to `.d4`): delay `.15s`, `.24s`, `.33s`, `.42s`; start offsets `--fx`/`--fy` of `-.5em/.3em`, `.4em/-.4em`, `-.3em/-.5em`, `.5em/.4em` (lines 107 to 110).
- The keyframes (line 111): from `opacity: 0; transform: translate(var(--fx), var(--fy)) scale(.4)` to `opacity: 1; transform: none`.
- Then `.rise` on the cover's subtitle: `riseup .6s ease-out forwards` with a default delay of `.55s` (lines 112 to 113).
- The cover lockup's size is `clamp(56px, 11vw, 110px)` (line 101). The cover markup is line 238; the dots are `<i>` elements inside `.fourdot`.
- v2 §06 states the rule: "One hello, then stillness" (line 554); reduced motion "gets the composed end state — the assembled mark, never a blank and never a missing hero" (line 564); §09: "No second entrance animation… One hello per page" (line 656).

### 1.2 What Chromium ran (EXECUTED, `book-measure.ts`)

Method. The book was opened from `file://` at 1280 × 800, with Google Fonts requests aborted (the book loads them from the network; the wordmark fell back to a system face, which changes no timing). An init script paused every animation at `DOMContentLoaded` and set its time to 0, so each frame below is deterministic. `document.getAnimations()` was read, then the animations were stepped to 0, 300, 600 and 900 ms for screenshots (`shots/book-<ms>.png`).

| Dot | Name | Duration | Delay | Ends at | From transform at 110 px | Fill |
|---|---|---|---|---|---|---|
| `.d1` blue | `dockin` | 500 ms | 150 ms | 650 ms | `translate(-55px, 33px) scale(0.4)` | forwards |
| `.d2` red | `dockin` | 500 ms | 240 ms | 740 ms | `translate(44px, -44px) scale(0.4)` | forwards |
| `.d3` amber | `dockin` | 500 ms | 330 ms | 830 ms | `translate(-33px, -55px) scale(0.4)` | forwards |
| `.d4` green | `dockin` | 500 ms | 420 ms | 920 ms | `translate(55px, 44px) scale(0.4)` | forwards |
| subtitle | `riseup` | 600 ms | 550 ms | 1150 ms | `translateY(12px)` | forwards |

- Five animations in all: 4 of 4 dots plus the subtitle. The dots' `animation-timing-function` computed to `cubic-bezier(0.2, 0.7, 0.3, 1)`, which equals `001` decision 14's `--ease-entrance` to the digit. (Playwright's `effect.getTiming().easing` reports `linear` for a CSS animation, because CSS applies the curve to each keyframe interval, not to the effect; the computed style is the truth.)
- The mark's dots measured 33 px at the 110 px cover size (0.3 em); at a 360 px viewport the lockup clamped to 56 px and the dots to 16.8 px.
- **Against the 900 ms budget:** the last dot settles at 920 ms, 20 ms over. With the subtitle the cover's motion ends at 1150 ms. INFERRED: the book's author counted the mark alone and rounded; `006` should fit the whole entrance, mark included, inside 900 ms, and move nothing else.
- **Frames.** At 300 ms: blue at opacity 0.75 and scale 0.85, red at 0.39 and 0.63, amber and green still hidden. At 600 ms all four are moving: 1.00, 0.98, 0.93, 0.81. At 900 ms blue, red and amber are home and green is at opacity 0.9997 (`notes/book.json`).
- **Reduce** (a second context with `reducedMotion: "reduce"`): `getAnimations()` returned 0; every dot computed `opacity: 1`, `transform: none`, `animation-name: none`. The cover screenshot shows the composed mark. That is the composed end state because the whole block is gated by `no-preference`, not because anything was shortened.

### 1.3 The book's footer, measured (EXECUTED and READ)

- CSS, lines 217 to 220: `footer` has a top padding of `--s7`, a bottom padding of `--s9`, `border-top: 1px solid var(--ink-faint)` and `box-shadow: inset 0 1px 0 var(--raised)`, which is the groove; `.row` is a flex row, `justify-content: space-between`, `align-items: center`, `flex-wrap: wrap`, gap `--s4`; `.fm` is mono at 12 px, `--ink-soft`, line-height 1.7; `.foot-mark` sets the lockup to 20 px.
- Markup, lines 700 to 706: the lockup at 20 px, then one `.fm` block of two lines: "PS-DB-0002 · design book v2.0 (proposed) · 2026-07-26" and "set in IBM Plex Sans, Geist & JetBrains Mono · built from five research memos in context/01_research/ · plutosystemshq".
- Computed in Chromium: the lockup 20 px, the mono 12 px with a 20.4 px line, the border `1px solid rgba(20, 22, 28, 0.1)`, the inset shadow white (`shots/book-footer-no-preference-1280.png`). At 360 px the row wraps to two rows (`shots/book-footer-no-preference-360.png`).

### 1.4 The mockup is not the book's entrance (READ, `mockups/11-orbit-assemble.html`)

- The "current favorite" named in the registry memo §4.3 is script-driven. For each dot it builds a "flyer" `<span>` on `<body>`, computes 41 keyframes along a 17°-tilted ellipse whose radius decays over 0.85 turns, and runs `element.animate(frames, { duration: 900, delay: i * 110, easing: "linear", fill: "both" })` (lines 105 to 135). The dots start at 0, 110, 220 and 330 ms, so the last lands at 1230 ms. The mark's own dots are then set to opacity 1 and the content rises.
- Under reduce it returns before animating and forces `.fourdot i { opacity: 1 !important }` (lines 55 to 58).
- It measures after `document.fonts.ready` because "a late font swap moves the lockup" (line 148).
- INFERRED: a flyer appended to `<body>` and positioned from `getBoundingClientRect()` breaks in a header that scrolls or resizes, needs script, and runs 330 ms over budget. The book's `dockin` is four CSS glides with a scale, from tokens, inside the budget. `006` should take `dockin`'s shape and call it the orbit-assemble; the names already blur in the book (v2 line 554 calls the whole thing "one hello").

### 1.5 The generator (READ, `tools/logo/generate.js`)

- A Bun script with `opentype.js` and `@fontsource/ibm-plex-sans`. It draws "pluto" from Plex Sans Bold glyph outlines and four circles, and writes `out/logo.svg`, `logo-mono.svg`, `logo-dark.svg` (paper word and paper dots on an ink rectangle), `mark.svg`, `mark-mono.svg`, and 16 sweep variants for a contact sheet.
- Its `PICK` is dot 0.3, gap 0.08, rise 0.38, tracking −0.04 (the same as `001` decision 16) and `wordGap: 0.14`, where v2's `.lockup` gap is .16 em (line 83) and `001`'s `--mark-lockup-gap` is 0.16 em. A 0.02 em difference between the SVG and the CSS lockup; noted for §6, decided nowhere.
- It animates nothing. The entrance has no reference outside the book's CSS and the mockup.

## 2. Our entrance as a component

### 2.1 The constraints (READ)

- A registry item has no `<style>` block and no `style` attribute (`001` decision 25's lint). Keyframes therefore live in `pluto-theme`'s `css`, which `scripts/build-tokens.ts` generates and which the CLI merges into the app's CSS. `build-tokens.ts` already places every `@keyframes` inside `@theme inline`, "because the CLI places an item's @keyframes inside the app's @theme inline" (its comment at lines 285 to 286, READ).
- `001` decision 14: `--motion-entrance: 900ms` and `--ease-entrance: cubic-bezier(0.2, 0.7, 0.3, 1)`; under reduce `html:root` sets `--motion-entrance: 0ms`, and a catch-all sets `animation-duration: 0.01ms !important` on everything.
- Decision 16: `--mark-dot`, `--mark-gap`, `--mark-rise`, `--mark-lockup-gap` in em; `--mark-lift` derived.
- `002` decision 21, R14: "Motion only as `animate-enter`, `animate-exit` and the spinner's `animate-spin`"; the lint flags any other `animate-*` class (`lint-literals.ts` lines 358 to 359, READ) and any literal `duration-*` or `delay-*`.
- `004` decision 15, L16: in a `.ts` item file, a number with a unit inside a quoted string is a violation; `0`, `var(--…)` and `calc(…)` with unitless numbers pass.

### 2.2 The sketch (EXECUTED, scratch only)

Files, all under the scratchpad's `app/`: `src/app.css` is this repository's generated `src/app.css` minus the four package imports the scratch app lacks (the three fonts and `shadcn-svelte/tailwind.css`), plus the sketch block below; `src/lib/four-dot/four-dot.svelte` and `lockup.svelte` are copies of the registry's two files with one prop added to each; `src/lib/utils.ts` is a one-line `cn` stand-in. The repository was not edited.

What the sketch adds, described, not copied:

1. **One token**, `--mark-orbit: 0.5em`, in `:root`: how far a dot travels, in em of the mark's font size. The book's largest offset is .5 em.
2. **One keyframes rule**, `pluto-mark-dock`, inside `@theme inline` as the other two are: `from { opacity: 0; transform: translate(calc(var(--mark-orbit) * var(--_ox)), calc(var(--mark-orbit) * var(--_oy))) scale(0.4) }`. No `to`: the end state is the element's own style, the composed mark.
3. **One utility**, `@utility mark-entrance`, with nested rules (Tailwind 4 allows nesting inside `@utility`; the built CSS carried them, EXECUTED): every child `[data-slot="four-dot-dot"]` gets `animation: pluto-mark-dock calc(var(--motion-entrance) * 0.55) var(--ease-entrance) both`; `:nth-child(1)` to `(4)` set `--_ox`/`--_oy` to (−1, 0.6), (0.8, −0.8), (−0.6, −1), (1, 0.8) and `animation-delay` to `calc(var(--motion-entrance) * 0.15)`, `0.25`, `0.35`, `0.45`.
4. **One prop**, `entrance?: boolean`, on `FourDot`, which adds the class `mark-entrance` to the root; `Lockup` takes the same prop and passes it through.

Why these numbers (INFERRED): the book's ratios are 500 ms over 900 (0.56) and a 90 ms stagger (0.10) from 150 ms (0.17). Rounding to 0.55, 0.15 and 0.10 steps puts the last dot's end at exactly 0.45 + 0.55 = 1.00 of the budget. The offsets keep the book's directions (blue from the lower left, red from the upper right, amber from the upper left, green from the lower right) at the same magnitudes to one decimal.

### 2.3 What Chromium ran (EXECUTED, `app-measure.ts` over `vite preview` of the built app)

| Dot | Duration | Delay | Ends at | From transform at 28 px | Easing (computed) | Fill |
|---|---|---|---|---|---|---|
| 1 | 495 ms | 135 ms | 630 ms | `matrix(0.4, 0, 0, 0.4, -14, 8.4)` | `cubic-bezier(0.2, 0.7, 0.3, 1)` | both |
| 2 | 495 ms | 225 ms | 720 ms | `matrix(0.4, 0, 0, 0.4, 11.2, -11.2)` | same | both |
| 3 | 495 ms | 315 ms | 810 ms | `matrix(0.4, 0, 0, 0.4, -8.4, -14)` | same | both |
| 4 | 495 ms | 405 ms | 900 ms | `matrix(0.4, 0, 0, 0.4, 14, 11.2)` | same | both |

- 4 of 4 animations, named `pluto-mark-dock`, from `getAnimations()`; the header's lockup at `text-2xl`.
- Frames (`shots/app-<ms>.png`, `notes/app.json`): at 300 ms dot 1 at opacity 0.79 and scale 0.87, dot 2 at 0.48 and 0.69, dots 3 and 4 hidden; at 600 ms 1.00, 0.98, 0.94, 0.84; at 900 ms all four at opacity 1 and the identity matrix.
- After `Promise.all(animations.map(a => a.finished))`: every dot computed `opacity: 1` and `matrix(1, 0, 0, 1, 0, 0)`; the four animations report `finished` and stay listed, because `both` keeps them in effect. 4 of 4.
- **The lint** (`lint-sketch.ts`, `lintText` with this repository's rules): the two `.svelte` copies, 0 violations each. The sketch's CSS, fed to the lint as if it were a quoted string in a `.ts` item file, drew exactly 1 violation, "css length in a theme file", for `0.5em`. INFERRED: that is the right outcome. The value belongs in `tokens/pluto.tokens.json` as `mark.orbit: 0.5`, emitted as `--mark-orbit: 0.5em` the way decision 16 emits `--mark-dot`; the unitless multipliers (0.55, 0.15, 0.4) pass L16 as written, and `006` may make them tokens too (`motion.entrance.dotShare`, `motion.entrance.stagger`) so review has one place to read them.
- **R14** (READ) names three `animate-*` classes. The sketch uses a `@utility` named `mark-entrance`, so the lint's `animate-*` check does not see it (EXECUTED: 0 violations), but the rule's letter does. `006` should add `mark-entrance` to R14's list and say why a plain `animate-mark-dock` cannot do the job: the four dots need four delays and four offsets, which a single Tailwind animation utility cannot carry.

### 2.4 Reduced motion, frame by frame (EXECUTED, `reduce-timeline.ts`)

Two contexts with `reducedMotion: "reduce"`. In the first, the page as built. In the second, an init script appended one more rule, `[data-slot="four-dot-dot"] { animation-duration: 0ms !important }` inside the reduce query, to see what a true 0 ms does.

| | At `load` | After one frame | After two frames | Events |
|---|---|---|---|---|
| As built (`001`'s 0.01 ms catch-all) | 4 animations `running`, `currentTime` 0, duration `1e-05s`; **every dot at opacity 0 in its from-transform** | 4 `finished`; every dot opacity 1, identity | same | 4 `animationstart`, 4 `animationend` |
| True 0 ms | 4 animations already `finished` at `load`; **every dot at opacity 1, identity** | same | same | 4 `animationstart`, 4 `animationend` |

- The tokens read `--motion-entrance: 0s` and `--motion-micro: 0s` under reduce (EXECUTED, `notes/app.json`), so the delays were 0. But the catch-all's `!important` 0.01 ms wins over the utility's shorthand, and with `fill: both` a 0.01 ms animation shows its first frame until the first paint tick. The header screenshot taken after load showed the composed mark (`shots/app-reduce.png`), so the window is at most one frame.
- INFERRED: v2 says "never a blank". One frame of hidden dots is a blank, however brief, and it is avoidable. `006` can add a third rule to `pluto-theme`'s reduce block: `.mark-entrance > [data-slot="four-dot-dot"] { animation: none }`. With no animation, the dots show their own style, which is the composed mark, before any frame. This rule is nested in an at-rule and is neither `:root` nor `.dark`, so decision 14's selector rule holds; but `generated.test.ts` asserts the reduce block "holds exactly its 2 selectors" (`001` criterion 5), so that test's count moves to 3, and the specification must say so.

### 2.5 One per page, and client-side navigation (READ and EXECUTED)

- SvelteKit's routing docs: with a shared layout, "clicking between the three pages will only result in the `<h1>` being replaced", and when navigating between pages SvelteKit "preserves the components that are common to both of them"; without a layout the old `+page.svelte` "will be destroyed, and a new one will take its place" (READ, [routing](https://svelte.dev/docs/kit/routing)). Layout groups: "`(app)` and `(marketing)` do not affect the URL pathname of the routes inside them", and "Pages can break out of the current layout hierarchy on a route-by-route basis" with `+page@.svelte` (READ, [advanced routing](https://svelte.dev/docs/kit/advanced-routing)).
- **Scratch app** (`app-measure.ts`): after the first load of `/`, 4 `animationstart` events had fired. A tag was set on the mark's DOM node. Clicking the header's link to `/about/` (a client-side navigation; the URL became `/about` and the `h1` changed) left the counter at 4, the tag on the same node, and the four animations still `finished`. A fresh `goto` of `/about/` started a new document: the counter reset and 4 animations ran again. 1 of 1 client navigation replayed nothing; 1 of 1 full load replayed.
- **This repository** (`preview-nav.ts`, `bun --bun vite dev` on port 5179, up within 90 s): on `/`, the `(site)` layout's lockup was tagged; clicking the catalogue's link to `/items/four-dot/` kept the same lockup node, with 0 `animationstart` events and 8 lockups on the page (the item page shows seven of its own); clicking the lockup back to `/` kept the node again. The site's chrome lives in `(site)/+layout.svelte` and never remounts between site pages.
- INFERRED, the rule for `006`: **the entrance runs once per mount of the shell layout, which is once per full document load** as long as every page of the app sits under that layout. Three things would replay it, and each is a choice an app can see in its routes: a page that breaks out with `+page@.svelte`, a route in a different layout group (in this repository a `(view)` page has no header at all), and a `{#key}` around the layout's content. `data-sveltekit-reload` on a link forces a full load and so a replay, which is correct: it is a new page. No `sessionStorage` flag is needed, and none should be used: a flag would skip the entrance on a reload, which v2 does not ask for.
- The hero holds no mark (`003`'s hero decision), so a page never shows two entrances.

## 3. The header

### 3.1 What `001`'s site header does today (READ, `src/routes/(site)/+layout.svelte`; EXECUTED, §2.5)

- `<header class="border-b border-border">` around a row `mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4`.
- `Lockup href="/" label="Pluto Systems design system" class="text-2xl"`: the lockup is the home link, named with the site's name (decision 22's rule that the name contains the visible word).
- `ThemeToggle`, a preview component (`src/lib/preview/theme-toggle.svelte`, not an item): a `button` with `aria-pressed` once hydrated, mono `text-xs`, `rounded border border-input bg-card px-3 py-2`, writing `pluto-preview-theme` to `localStorage`; `src/app.html`'s head script applies `.dark` before first paint.
- Then `<main class="mx-auto max-w-5xl px-6 py-12">`. No skip link, no `nav`, no `id` on `main`, a plain `border-border` edge rather than the groove, nothing sticky, no favicon link in `app.html`.

### 3.2 What the shell's header must add (READ unless marked)

- **A skip link, first in `<body>`.** GOV.UK: place it "immediately after the opening `<body>` tag", or after a cookie banner; its text is "Skip to main content"; it is "visually hidden until a keyboard press activates it"; do not wrap it in a `<nav>` or move it into the header; since v4.0.0 the component's script "moves focus to the skip link's target to improve the consistency of screen reader behaviour" (READ, [GOV.UK skip link](https://design-system.service.gov.uk/components/skip-link/)). WebAIM: make it "one of the first items"; hide it off screen and make it "prominently visible when it is focused"; `display:none` or `hidden` "will remove the link from keyboard navigation"; the target is the `<main>` whose `id` matches the `href`, and on activation "keyboard focus will go to the `<main>` element" (READ, [WebAIM](https://webaim.org/techniques/skipnav/)). Neither page names `tabindex="-1"`; the patterns memo §1.2 inferred it so focus lands in every browser. EXECUTED in the sketch (`sr-only focus:not-sr-only` plus a positioned, bordered box): the first Tab landed on the link, visible (`shots/app-skiplink.png`); Enter moved `document.activeElement` to `<main id="main" tabindex="-1">`. 2 of 2. The sketch's focus box used `focus:bg-card` and the global ring; a `006` version should use the groove's chrome and a ladder inset.
- **Landmarks.** `<header>` and `<footer>` as children of `<body>` map to `banner` and `contentinfo`; product links sit in `<nav aria-label="…">`; `<main>` once (patterns memo §1.2). The shell renders no `h1`; the page does.
- **The lockup as the home link**, labelled with the app's name, as today. Below 20 px of lockup height the mark alone (v2 line 361). INFERRED from the sketch's measurement: the lockup at `text-2xl` is 28 px of type and measured 34.6 px tall in the header row, so it never falls below 20 px at any width; the mark-alone case is the icon rail of a sidebar (`005`), not the header. At `text-base` (16 px) a lockup would be under 20 px and the rule would bite; the shell should not offer that size.
- **Utilities at the right** (patterns memo §1.1): the theme toggle, and a signed-in menu. The registry holds `avatar` (`002`) and no `dropdown-menu` or `sheet` yet (EXECUTED: `registry.json` names `avatar`, `status`, `four-dot`; no `dropdown-menu`, `sheet`, `sidebar`). Both are `005`'s (decisions.md). INFERRED: `006` depends on `005` for the menu and the mobile sheet, or ships the header with slots for them and a plain link to the account page until `005` lands. The theme toggle in the registry's preview is preview code; whether an app's toggle is an item is `005`'s `mode-watcher` question (handoff.md).
- **The groove as the header's bottom edge.** `001` decision 13's `groove` utility is a top edge: `border-top: var(--line-width) solid var(--groove-line)` and `box-shadow: inset 0 var(--line-width) 0 var(--groove-light)` (READ, `src/app.css` lines 265 to 268), the hairline with the white line *beneath* it, inside the element. INFERRED, two ways to put it under the header: (a) the next full-width element carries `groove` on its top, which draws the same two pixels in the same order but needs a full-width element there (the shell's `<main>` is centred and narrower); (b) a second utility, `groove-b`, `border-bottom: var(--line-width) solid var(--groove-line)` with an outset `box-shadow: 0 var(--line-width) 0 var(--groove-light)`, so the white line falls just below the hairline onto the next ground. (b) draws line-then-light top to bottom, the groove's order, and needs no extra element. In dark `--groove-light` is clear, so both forms reduce to the hairline (decision 13). The footer's top edge is the plain `groove`, as the book's is (§1.3). A pixel check in both themes belongs in `006`'s tests.
- **Sticky or not.** v2 bans blur (line 651), so a sticky header is opaque (`bg-background`). SC 2.4.11 names sticky headers as the usual culprit and gives `scroll-padding` as the fix (patterns memo §0.1). INFERRED: `scroll-padding-top` belongs on the scrolling element, `html`, which no component can reach without a `<style>` block; it is one line in the app's `app.css`, or `scroll-mt-16` on `main` and on every in-page target. Default not sticky; a `sticky` prop that documents the one line the app adds.
- **Mobile.** Below `md` the product links move into a `sheet` opened by a menu button with `aria-expanded` (patterns memo §1.4, §8.1), a `005` item. At 320 px the header holds the lockup, the menu button and the toggle; INFERRED: the lockup at 28 px is about 105 px wide (five letters of Plex Sans Bold at −0.04 em plus a 0.68 em mark), which leaves room for two 48 px controls with the ladder's gaps.

### 3.3 Heights on the ladder (INFERRED from `001` decision 10 and `002` decision 10)

- Controls are 48 px (default) or 32 px (`sm`). The header's inner row: 48 px control + 2 × 8 px (`py-2`) = **64 px**, a ladder value; 48 + 2 × 12 (`py-3`) = 72, which is not on the ladder (the ladder jumps from 64 to 96); 32 px `sm` controls + 2 × 16 (`py-4`) = 64 again. The lint restricts spacing utilities, not heights (decision 10), so `py-3` would pass the lint and still miss the ladder; the specification should fix the row at `h-16` with `items-center`, and padding only as the ladder's 8 or 16.
- Measured in the sketch for reference: the lockup at `text-2xl` is 34.6 px tall inside the row; with `py-2` and no 48 px control the header was 51.6 px (EXECUTED). With the 48 px toggle or avatar it is 64.
- The same 64 px on mobile: one height, one `scroll-padding-top`.

## 4. The footer

### 4.1 What the book binds (READ)

- v2 §07, line 586: "Every page: build commit hash, build date, doc ID, link to the site's own source, and one plain sentence — 'Pluto Systems is a public benefit corporation.' Stated as fact, never a badge."
- The dating rule, line 597: "No public surface without a visible last-updated date."
- §04, line 470: mono "Eyebrows, captions, doc IDs, dates, code. Labels are lowercase… Prose stays sentence case." So the footer's labels (`commit`, `built`, `doc`, `source`) are lowercase mono; the sentence is prose.
- The book's own footer: §1.3.

### 4.2 The commit hash and build date at prerender (READ and EXECUTED)

Three mechanisms were considered; two were run.

1. **`kit.version.name` → `$app/env`'s `version`.** SvelteKit's types: `version.name` is "The current app version string. If specified, this must be deterministic (e.g. a commit ref rather than `Math.random()` or `Date.now().toString()`), otherwise defaults to a timestamp of the build", with an example that sets it from `child_process.execSync('git rev-parse HEAD')` in `vite.config.js` (READ, `node_modules/@sveltejs/kit/types/index.d.ts` lines 2146 to 2167). The default is `Date.now().toString()` (READ, `src/core/config/options.js` line 279). `$app/env` exports `version`, "The value of `config.version.name`", beside `browser`, `dev` and `building` (READ, types lines 2387 to 2404; [docs](https://svelte.dev/docs/kit/$app-env)). `$app/environment` is listed under "Legacy" and its page says it "was deprecated in SvelteKit 3 in favour of `$app/env`" and "will be removed in SvelteKit 4" (READ, [`$app/environment`](https://svelte.dev/docs/kit/$app-environment)). The name also feeds SvelteKit's own version checks: the `x-sveltekit-version` header, a version file polled every 3,600,000 ms by default, and `updated.current` (READ, types lines 2124 to 2142). In SvelteKit 3 the kit config is the plugin's options in `vite.config.ts`; neither this repository nor the fixture has a `svelte.config.js` (EXECUTED: `cat` found none).
   - **EXECUTED** in the scratch app: `vite.config.ts` set `version: { name }` from `git rev-parse --short HEAD` run in this repository (the scratch copy has no commits); the root layout rendered `{version}` from `$app/env` in a `<dd data-commit>`; `bun --bun vite build` prerendered `build/index.html` containing `data-commit="">b3d2a8e<`, which is this repository's HEAD. 1 of 1.
2. **Vite `define`.** A constant compiled into the bundle. **EXECUTED**: `define: { __BUILT_AT__: JSON.stringify(builtAt) }` with `builtAt` from `git log -1 --format=%cI`; the layout rendered it inside `<time datetime>`; the prerendered HTML holds `2026-11-01T07:18:43-05:00`. 1 of 1. INFERRED: the commit's own date, not `new Date()`, keeps a rebuild of the same commit byte-identical; v2's "build date" is served honestly either way, and the specification should say which.
3. **`import.meta.env`.** A `VITE_*` variable from the environment reaches the client bundle. Not run. INFERRED: it is the route for a host's variables. Cloudflare Workers Builds injects `WORKERS_CI_COMMIT_SHA` ("sha1-hash-of-current-commit"), `WORKERS_CI_BRANCH` and `WORKERS_CI_BUILD_UUID`, and no build time (READ, [Workers Builds configuration](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/)). `wasi-python-dev` runs on Cloudflare (READ, its constitution §2.6). An app there can set `version.name` from that variable when `git` is absent, with `git` as the fallback.

INFERRED, the recommendation: mechanism 1 for the hash, because SvelteKit already wants a deterministic version name and the docs' own example is the commit; mechanism 2 for the date. Both are five lines in the app's `vite.config.ts`, which the block's documentation shows and the preview app runs for itself.

### 4.3 What the block ships without knowing the app's values (INFERRED)

- A footer component in the shell block with props: `commit` (string, shown as given; the app decides short or long), `builtAt` (an ISO 8601 string; rendered in a `<time datetime>` with a readable date beside it), `docId` (string, optional until the owner's scheme exists; the label is omitted when it is empty), `sourceHref` (the repository URL; the link's text is the host and path, lowercase mono), and `statement` with the default "Pluto Systems is a public benefit corporation." A block cannot import `$app/env` on an app's behalf and stay plain; the app's layout reads `version` and passes it. The preview app passes this repository's own hash, its commit date, its source URL and, once chosen, its doc ID.
- The "last updated" date is the build date, in `<time datetime="…">`, which satisfies the dating rule for a prerendered site because the page cannot change without a build.
- Layout, from the book (§1.3) in our tokens: `groove` on the footer's top; a row that wraps (`flex flex-wrap items-center justify-between gap-6`) with the lockup at the left and a `<dl>` or two mono lines at the right; one column below `sm`. The mono is `text-xs font-mono text-muted-foreground` (12 px, the book's size). The lockup size is a choice: the book's 20 px is not on `001`'s type scale (12, 13.5, 16, 28, 44), and 16 px falls under the 20 px minimum. So the footer's lockup is `text-2xl` (28 px, as the header's) or the mark alone with the name in text; the first keeps the book's shape.
- `contentinfo` comes from `<footer>` as a child of `<body>`; the sketch's footer was such a child (EXECUTED: built markup).
- **The brand line.** decisions.md (2026-10-31): "Every Pluto Systems page, pitch and block that shows the brand's own words uses these; a product… keeps its own headline under them." INFERRED: the footer is the one surface v2 makes every page carry, and it already speaks in the brand's own words (the public-benefit sentence). So it is such a place, and the line "Pluto Systems. Work runs on data." sits as the first line beside the lockup, in prose, with the statement after it. The cost is the name three times in one row: the wordmark, the tagline, the sentence. An alternative that keeps the rule is "Work runs on data." alone beside the lockup, since the lockup already says the name; the decision writes the line as "Set with the name", which argues against it. `006` decides and says why; the words-to-avoid list ("agentic", "work OS", "productivity software") binds any sentence an app adds.

## 5. The doc ID

The owner decides. These are the facts a decision needs.

### 5.1 What exists today (READ)

- v2 self-assigns `PS-DB-0002` and makes v1 `PS-DB-0001` retroactively; its open call reads "If doc IDs become public page furniture (§07), the scheme needs a one-line decision record" (v2 lines 689 to 691). Its decisions are `D-0001` and `D-0002` under `hq/context/02_decision/` (registry memo §4.1).
- This repository numbers specifications `001` to `004` (`context/specifications/`), reviews `NNN-<slug>-spec-<date>` and `NNN-<slug>-pr-<date>`, and research memos by date and slug (`context/README.md`). `wasi-python-dev` numbers its specifications `001`, `002`, `003` and `005` today (EXECUTED: `ls` of its `context/specifications/`; `004` is absent from the folder and `006` is the next the handoff expects).
- The book's footer prints the ID, the document's name and version, and its date in one mono line (§1.3).

### 5.2 Prior art, briefly (READ unless marked)

- **Bell Labs memoranda.** Listings of filter-design memoranda carry numbers such as `MM 67-2623-2` (1967-02-01), `MM 67-4734-7` (1967-05-15) and `MM 67-5316-1` (1967-01-03) (READ, [telephonecollectors.info](https://telephonecollectors.info/index.php/browse/document-repository/catalogs-manuals/western-electric-bell-system)); Ritchie's "The UNIX Time Sharing System" is cited in Thompson's 1972 B manual as `MM 71-1273-4` (READ, [TUHS, 2016](https://www.tuhs.org/pipermail/tuhs/2016-December/009134.html)). INFERRED from the dates beside them: year, then a department or group number, then a serial within it. No source read states the parts' meaning. The later Computing Science Technical Reports are a plain sequence with gaps and lettered parts (`2` in 1972 to `164`, `106a` to `106f`), 67 numbers in one bundle (READ, [TUHS, 2023](https://www.tuhs.org/pipermail/tuhs/2023-August/028876.html)).
- **RFCs.** "RFCs are sequentially numbered, starting with RFC 1 published in 1969", and "once an RFC is published, it is never changed"; a later RFC obsoletes or updates it (READ, [IETF](https://www.ietf.org/process/rfcs/)). "More significant changes require a new submission which will receive a new serial number" (READ, [Wikipedia](https://en.wikipedia.org/wiki/Request_for_Comments)).
- **IBM manuals.** Order numbers such as `GC28-0633-1` and `GC28-1310-4`: two letters, four digits, a serial, and an edition suffix after the dash. A 1975 bibliography says "The publication order number has eight positions, plus one or two positions for the edition suffix" and that the first character is a use key governing availability (READ, search-result text of GC20-0001-1; the PDF itself could not be fetched, so the letters' meanings are unconfirmed). The suffix increments by edition: TSO Messages is `GC28-1310-2` in January 1986 and `GC28-1310-4` in September 1987 (READ, bitsavers file titles). The number names the document; the suffix names the edition.

### 5.3 Three schemes, with examples and costs (INFERRED)

What is being identified matters first. The book is one document with one ID on its one page. A site has many routes; a route is not a document. INFERRED: an ID names a *publication*, and a site is one publication whose pages share it, unless a page is itself a document (a specification, a changelog entry, the design book).

| Scheme | Form | The design system's site | The app's home page | A document | Cost |
|---|---|---|---|---|---|
| A. Series and sequence, the book's own, extended | `PS-<series>-<NNNN>`, series per kind, sequence per series, never reused | `PS-DS-0001` on every page; an item page is part of the publication | `PS-WP-0001` (product sites take a two-letter product series) | `PS-DB-0002`; a specification `PS-DS-0001` is taken, so specifications would need their own series, e.g. `PS-SP-0004` | A register of allocations per series, kept in one file in `plutosystemshq` or each repository; one line per number; cross-repository coordination so two sites never take one number |
| B. Year and serial, Bell Labs' shape | `PS-<YY>-<NNN>`, one company-wide sequence a year | `PS-26-004` | `PS-26-005` | the book, re-issued, `PS-26-001`; a specification written next week `PS-26-006` | One register per year; cheap to allocate; carries no kind, so the footer line must also say what the thing is (the book's line already does); the sequence crosses repositories |
| C. Path and version, no register | `<site> <version>` or the repository's own number, plus the commit already in the footer | `design-system v0.4.0` | `wasipython.dev` with the commit | a specification is `design-system 004`; the book keeps `PS-DB-0002` | Nothing to allocate; but a path is not an identifier (a rename breaks it), an ID that changes each release is an edition, not a document number, and the footer already carries the commit, so this adds little |

A fourth, hybrid, is A with IBM's edition suffix (`PS-DS-0001-4` at v0.4.0); INFERRED it is not worth its upkeep, since the commit hash beside it already dates the edition.

Whichever is chosen, the footer prop is one string, the register is one Markdown file, and the design system's preview shows its own. The decision also settles the book's status line, which still reads "proposed".

## 6. The icon files

- v2: "the mark alone is the favicon, avatar, and app icon" (line 362). Coloured dots on ink for the icon is the open owner call (`001` decision 28; handoff.md).
- The generator already emits `mark.svg` (coloured), `mark-mono.svg` (ink) and `logo-dark.svg` (paper on ink) (READ, §1.5). None is a favicon file yet, and `tools/logo/out/` is in `plutosystemshq`, not here.
- The registry memo §5 proposed `registry:file` items for the logo files. INFERRED, what `006` would need to ship a favicon: one SVG under `static/` of the app (a `registry:file` item with a `static/` target can carry it), and one `<link rel="icon" type="image/svg+xml" href="/favicon.svg">` in the app's `src/app.html`, which `app.html` owns and no item writes. This repository ships neither today (EXECUTED: `static/` holds `r` and `v0.4.0` only; `src/app.html` has no `rel="icon"`).
- **Does it block the shell?** No (INFERRED). The shell block is routes and components; the favicon is a static file plus a line of `app.html`, and both wait on the owner's colour call without stopping the header, the entrance or the footer. When the call is made, the file can be one SVG that switches by `prefers-color-scheme` inside its own `<style>`, or two files; browser support for that switch was not checked (§7).

## 7. What is still unknown

- **Chromium only.** The book, the sketch and the navigation checks ran in Chromium. Firefox's and WebKit's handling of `fill: both` with a 0.01 ms duration, and of `animation: none` under reduce, were not run; the repository's Playwright has both browsers installed.
- **No screen reader was heard** over the skip link, the landmarks or the `<time>` element; the DOM contract is what was tested (`003` decision 25's placeholder widens again).
- **The sticky header's `scroll-padding-top`** was not run; the sketch's header is not sticky.
- **The groove's bottom form** (§3.2) was reasoned, not pixel-sampled.
- **The IBM letter key's meanings** (`G`, `S`, `L`) are unconfirmed; the bibliography PDF was unreachable.
- **SVG favicons that switch by colour scheme** across Safari, Firefox and Chromium: not checked.
- **`005`'s items** (`dropdown-menu`, `sheet`, `sidebar`, `mode-watcher`) are not in the registry; the header's account menu and mobile sheet wait on them.
- **The 0.02 em gap** between the generator's `wordGap` (0.14) and the CSS lockup gap (0.16) is unexplained.
- **Whether `wasi-python-dev`'s build has `git`** on Cloudflare's build image; `WORKERS_CI_COMMIT_SHA` is the documented value there.

**Placeholders:** none new. The doc-ID scheme and the icon's colour on ink remain owner calls, to be asked by `006` with options (§5.3; §6).

**In one line:** the book's entrance is four 500 ms glides with a 0.4 scale on `--ease-entrance`'s curve, staggered 90 ms from 150 ms and ending at 920 ms; our token-only sketch runs the same shape in 900.0 ms, lands composed under reduce once a one-frame blank from the 0.01 ms catch-all is closed with `animation: none`, and plays once per full load because SvelteKit keeps the layout's lockup node across client navigation; the footer takes its commit from `kit.version.name` through `$app/env`, its date from `define`, and its doc ID from a scheme the owner picks among series-and-sequence, year-and-serial, or none.

## Sources

All web sources read on 2026-11-01. Local sources read the same day.

**Design book, mockup and generator**

- `plutosystemshq/pluto-systems-design-book-v2.html`: lines 83 to 86 (lockup), 101 (cover clamp), 105 to 114 (the entrance), 217 to 220 and 700 to 706 (the footer), 238 (the cover markup), 356 to 365 (clearspace, minimum size, dot order), 470 (lowercase labels), 554 and 564 (motion), 586 and 597 (footer and dating rule), 651 and 656 (ban list), 689 to 691 (the doc-ID call)
- `plutosystemshq/mockups/11-orbit-assemble.html`, lines 41 to 58 and 100 to 149
- `plutosystemshq/tools/logo/generate.js`, `package.json`, `out/`

**SvelteKit, Vite, Cloudflare**

- `node_modules/@sveltejs/kit/types/index.d.ts` (3.1.0): lines 2118 to 2170 (`version`), 2387 to 2404 (`$app/env`); `src/core/config/options.js` line 279; `src/core/env.js` lines 57 and 245; `src/runtime/app/env/server.js`
- [SvelteKit, routing](https://svelte.dev/docs/kit/routing); [advanced routing](https://svelte.dev/docs/kit/advanced-routing); [`$app/env`](https://svelte.dev/docs/kit/$app-env); [`$app/environment`](https://svelte.dev/docs/kit/$app-environment)
- [Cloudflare Workers Builds, configuration](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/)

**Accessibility**

- [GOV.UK, skip link](https://design-system.service.gov.uk/components/skip-link/)
- [WebAIM, skip navigation links](https://webaim.org/techniques/skipnav/)
- `research/2026-10-28-the-blocks-patterns-and-accessibility.md` §0.1, §1, §8.1 (SC 2.4.1, 2.4.11; APG landmarks)

**Document numbering**

- [IETF, RFCs](https://www.ietf.org/process/rfcs/); [Wikipedia, Request for Comments](https://en.wikipedia.org/wiki/Request_for_Comments); [RFC Editor FAQ](https://www.rfc-editor.org/faq/) (gaps only)
- [TUHS, 2016, Ritchie's draft](https://www.tuhs.org/pipermail/tuhs/2016-December/009134.html); [TUHS, 2023, Bell Labs CSTRs](https://www.tuhs.org/pipermail/tuhs/2023-August/028876.html)
- [telephonecollectors.info, Western Electric and Bell System documents](https://telephonecollectors.info/index.php/browse/document-repository/catalogs-manuals/western-electric-bell-system)
- IBM: search-result text of GC20-0001-1 (System/370 Bibliography, June 1975) and bitsavers file titles `GC28-1310-2` (January 1986) and `GC28-1310-4` (September 1987); the PDFs could not be fetched

**Local**

- `context/constitution.md`, `README.md`, `decisions.md` ("The brand line", 2026-10-31), `handoff.md`
- `specifications/001-tokens-and-the-registry.md` decisions 3, 10, 11, 13, 14, 16, 22, 25, 28; `002-…` decisions 10 and 21; `003-the-first-blocks.md` decisions 10, 16, 23, 25; `004-code-and-data.md` decision 15
- `research/2026-10-27-a-shadcn-svelte-registry-and-what-pluto-already-has.md` §4.1, §4.3, §5
- `src/lib/registry/ui/four-dot/four-dot.svelte`, `lockup.svelte`; `src/routes/(site)/+layout.svelte`; `src/app.html`; `src/lib/preview/theme-toggle.svelte`; `src/app.css`; `scripts/build-tokens.ts`; `scripts/lint-literals.ts`; `tokens/pluto.tokens.json`; `tests/smoke/fixtures/kit3/`; `registry.json`
- `/Users/claygendron/Git/Repos/wasi-python-dev/context/constitution.md` §2.6; its `context/specifications/` listing
