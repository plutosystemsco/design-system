# 008 — Product identity

- **Status:** built and reviewed, prepared as `v0.8.0`; tagged when the owner asks. Its specification review is [`../reviews/008-product-identity-spec-2026-11-01.md`](../reviews/008-product-identity-spec-2026-11-01.md) (16 findings, all dispositioned here); its change review is [`../reviews/008-product-identity-pr-2026-11-01.md`](../reviews/008-product-identity-pr-2026-11-01.md) (1 High, 6 Low, all fixed).
- **Date:** 2026-11-01
- **Author:** the design lead
- **Kind:** a change to the `app-shell` block (its header, its footer, its layout's constants, its example page); one utility added to `pluto-theme`; new sample copy in the `hero` block; the preview site's own footer; two new shell views; tests; the 0.8.0 release
- **Depends on:** [`006`](./006-the-app-shell-and-the-chat-pane.md), _built_ (`ab3a400`, `v0.6.0`), and [`007`](./007-the-full-highlight-palette-and-the-ink-surface.md), _built_ (`011fd75`, `v0.7.0`), as released in `v0.7.1` (`bfbd6b6`).
- **Research it stands on:** [`../research/2026-11-01-one-system-many-products.md`](../research/2026-11-01-one-system-many-products.md) (the products memo).
- **Design calls:** `../decisions.md`, "One system, many products" (2026-11-01): identity only; a product's own logo with its name as the fallback; an optional "A Pluto Systems product" line in the footer, off by default, whose four dots appear on hover; and, after this specification's review, the reveal as a 200 ms response, the endorsement not a lockup, and no amendment to the constitution.

## Intent

This design system serves every Pluto Systems product. Each product has its own logo, its own name and its own words. The tokens stay shared.

Today one brand is wired into the shell. The header always shows Pluto's lockup, and the product's name is only the link's hidden name. The footer always shows Pluto's lockup and its brand line. The hero's sample copy describes this design system (products memo §1). A product called Sandbox would get a home link that reads "pluto" and is named "Sandbox", which also fails WCAG 2.2's 2.5.3, label in name.

This specification makes the shell take the product's identity, and adds the one place Pluto Systems may appear on a product's page: an optional endorsement in the footer.

**Not here:**

- A product accent colour or any other per-product token (the owner's ruling: identity only).
- Favicons. An app's `app.html` owns them (`006`).
- A link on the endorsement. No public page exists for it to point at (products memo §6).
- Renaming the system's own names: `pluto-theme`, the `pluto:` context keys, the `four-dot` item. They name the system a product is built from, not the product, and a reader never sees them (products memo §1.3).
- The sign-in and sign-up blocks. They render inside the shell, which carries the identity, and their own words name no product.
- Page titles. A block's `<title>` is sample text; an app sets its own, with or without its name.

**Terms of art.** _Identity_ is a product's logo, name and words. A _wordmark_ is a logo made only of a name set in type. The _endorsement_ is the footer line "A Pluto Systems product". A _snippet_ is markup passed to a Svelte 5 component as a prop; a snippet can take arguments. A _transition_ is CSS moving a property between two states when the state changes; an _animation_ plays keyframes on its own.

## Decisions

Each decision gives its reason. A reviewer checks the reason as much as the rule.

### 1. Scope

| Item or file    | Change                                                                                                                                                                 |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app-shell`     | the header and the footer take a `logo` snippet with a wordmark fallback; the footer gains `appName` and `endorsed`, and its `tagline` defaults to empty; the layout's constants and the example page's link change; stale prop docs, comments and the registry description are rewritten |
| `pluto-theme`   | one utility, `mark-reveal`, built from the entrance's shares and `--motion-micro`; no new token                                                                          |
| `hero`          | the block page's sample copy                                                                                                                                           |
| the preview site | its own footer passes Pluto's identity; two new shell views; the `app-shell` item page's notes                                                                        |

- `four-dot` is unchanged. The `Lockup` keeps its name "Pluto Systems": it is Pluto Systems' own lockup, one logo among others.
- No new package. No new colour. No new token.
- The preview site's own header keeps Pluto's lockup and its entrance: the preview site is Pluto Systems' own (`006` decision 16).

### 2. The header takes a logo, and falls back to the name

`app-shell-header` keeps `appName: string` (required) and adds `logo?: Snippet<[place: "header" | "footer"]>`.

- **With a logo**, the home link is `<a href="/" aria-label={appName} data-shell="home">` holding `{@render logo("header")}`. _Why the link names it:_ the snippet is then decoration inside a named link, so a product never labels its own drawing (products memo §3).
- **Why the snippet takes its place** (review finding 1): one snippet serves the header and the footer, and only the header may play the entrance. A product whose logo is Pluto's lockup writes `<Lockup entrance={place === "header"} class="text-2xl" />`, and the page keeps its one entrance (`006` decision 5).
- **Without a logo**, the home link holds `appName` as text: the heading face, bold, `tracking-mark`, `leading-none`, `text-2xl`, the lockup's own type (`four-dot`). It carries no `aria-label`, since the visible text is the name. _Why a wordmark and not Pluto's lockup:_ the owner's ruling. A product's name is its identity before it has a logo.
- **The link's box** is `inline-flex min-h-12 min-w-6 shrink items-center`, and the wordmark inside it is `truncate`. _Why:_ 2.5.8 asks 24 px for a target, which `min-w-6` and `min-h-12` meet for any name; a long name at 320 px truncates with an ellipsis instead of widening the row (1.4.10), while the link's text, and so its accessible name, stays whole (review finding 8). A set `min-width` (24 px) replaces the flex item's automatic one, so it shrinks below its text.
- **The entrance leaves the shipped header.** The shipped shell shows a wordmark, and the entrance is the four dots docking (the design book §06); a word has no dots.
- **This is a visible change** to an installed app that re-installs (review finding 16): the header's props are unchanged, and its lockup and entrance disappear. The changelog gives the one-line restore.
- The phone sheet's title stays `appName`.
- **A logo does not shrink** (change review finding 3): its link is `shrink-0`, since a drawing squeezed by flex is distorted or clipped, where a wordmark can truncate. Its bound is stated instead: at most 176 px wide (`w-44`), which fits beside the 32 px toggle and the 32 px menu button in a 320 px row with its padding and gaps.
- The item page says, in one line each: a logo should be at most 36 px tall, which the lockup at `text-2xl` (34.6 px, `006` decision 7) meets, and at most 176 px wide; and `appName` must contain any words the logo shows (2.5.3).

### 3. The footer takes the same identity

`app-shell-footer` adds `appName: string` (required), `logo?: Snippet<[place: "header" | "footer"]>` and `endorsed?: boolean` (default `false`). `tagline`'s default becomes `""`.

- **With a logo**, it renders `<span role="img" aria-label={appName} data-shell="logo">{@render logo("footer")}</span>`. _Why `role="img"`:_ the footer's identity is not a link, so the wrapper must carry the name itself (products memo §3).
- **Without one**, it renders `appName` as the same wordmark as the header, in a `<span data-shell="wordmark">`, not a link, wrapping (`wrap-anywhere`) rather than truncating, since the footer has room.
- **The tagline** renders only when given, as today. _Why the default is now empty:_ "Work runs on data." is Pluto Systems' line, not a product's.
- **The endorsement** (decision 4) renders only when `endorsed` is `true`.
- **This is an interface change.** `appName` is required and the tagline's default changed; the changelog says so (constitution §6), and `svelte-check` names the missing prop.

### 4. The endorsement

```svelte
<p data-shell="endorsement" class="flex w-fit items-baseline gap-(--mark-lockup-gap) text-sm text-muted-foreground">
  A Pluto Systems product<FourDot class="mark-reveal -translate-y-(--mark-lift)" />
</p>
```

- **The words** are the owner's: "A Pluto Systems product", sentence case, no full stop.
- **The place:** under the footer's rows, before the `statement` when both show. Both sit in one `mt-6 flex flex-col gap-2` column that renders only when either is given. _Why under the rows:_ the product's identity stays the footer's first thing (products memo §4.3).
- **The size.** The line is `text-sm`. _Why the lockup's 20 px minimum does not bind:_ the owner's ruling. The line is words with the mark beside them, not the "pluto" wordmark lockup (`001` decision 16), so neither the minimum nor the lockup's clearspace applies (review finding 6).
- **The colour:** `text-muted-foreground`, one step quieter than the product's own line. The token build already checks it against `background` (`contrast.text`).
- **The mark:** a `FourDot` with no `label`, so it is `aria-hidden` (`001`). Assistive technology reads the line's words alone. It sits lifted, as in the lockup, so the dots ride at the same height beside the words.
- **Not a link,** and so not focusable. A later link adds `:focus-visible` beside `:hover` in decision 5's selector.
- **On a device that cannot hover, the dots never show** (decision 5's media query). The words carry the endorsement.

### 5. `mark-reveal`, the hover reveal

One `@utility` and one top-level media query added to `pluto-theme`'s CSS in `scripts/build-tokens.ts`, after `mark-entrance`:

```css
@utility mark-reveal {
  & > [data-slot="four-dot-dot"] {
    opacity: 0;
    transform: translate(calc(var(--mark-orbit) * var(--_ox)), calc(var(--mark-orbit) * var(--_oy))) scale(0.4);
    transition-property: opacity, transform;
    transition-duration: calc(var(--motion-micro) * var(--motion-entrance-dot));
    transition-timing-function: var(--ease-entrance);
  }
  & > [data-slot="four-dot-dot"]:nth-child(N) { --_ox: …; --_oy: …; }   /* N = 1..4, ENTRANCE_OFFSETS */
}
@media (hover: hover) {
  :hover > .mark-reveal > [data-slot="four-dot-dot"] { opacity: 1; transform: none; }
  :hover > .mark-reveal > [data-slot="four-dot-dot"]:nth-child(N) {
    transition-delay: calc(var(--motion-micro) * (var(--motion-entrance-start) + (N - 1) * var(--motion-entrance-stagger)));
  }
}
```

- **Why the hover rules sit outside the utility** (found in the build): shadcn-svelte 1.7.1's `add` writes an `@media` nested in an `@utility` as a rule whose selector is `@media (hover: hover)` and flattens the rules nested in it into the utility, so the first install loses the media query and a second install is not byte-identical (the smoke test, EXECUTED). A top-level at-rule is merged by name and parameters, so a second `add` is a no-op. The plain rules are unlayered and so win over the utility's rest state, which is what the hover state must do. This is the fallback the specification's risks named, as `.surface-ink` was (`007` decision 8).
- **The path is the entrance's.** The four offsets are `ENTRANCE_OFFSETS`, the array `mark-entrance` already reads, so the two cannot drift. The scale and opacity are the entrance keyframes' `from`.
- **The timing is a response** (the owner's ruling; review finding 2). The entrance's shares are applied to `--motion-micro` (200 ms) instead of `--motion-entrance`: 110 ms per dot, delays 30, 50, 70 and 90 ms, the last at its place at 200 ms. The design book §06 keeps its one 900 ms entrance per page, and §09's "no second entrance animation" holds. No new token.
- **Leaving** takes the rest rule's timing: 110 ms, no delay. A transition uses the destination state's timing. _Why a transition, not an animation:_ a pointer that leaves halfway reverses the dots from where they are; an animation would jump (products memo §4.1).
- **Only where the primary pointer can hover.** A tap on a touch screen sets `:hover` in Chromium (review finding 9, EXECUTED), so the hover rules sit inside `@media (hover: hover)`, as Tailwind's own `hover:` variant does.
- **Under reduced motion** `--motion-micro` is 0 ms, so every duration and delay is 0, and the catch-all caps durations at 0.01 ms (review, criterion 9, EXECUTED). The dots appear and leave with the hover without moving. The reduce block gains nothing.
- **The dots keep their space at rest,** so the line's width does not change on hover.
- **WCAG 2.2's 1.4.13 does not apply:** the dots are part of the line, not content "in addition to the triggering component", carry no information and cover nothing (products memo §4.2).
- _Why a utility, not classes in the footer:_ four delays and four offsets cannot be written as plain utilities (`006` decision 4's reason for `mark-entrance`). `002`'s R14 motion list and L10's comment in `scripts/lint-literals.ts` name `mark-reveal` beside `mark-entrance`, and `tests/unit/literals.test.ts` gains it as a passing sample (review finding 12).

### 6. The layout's constants and the example page

`blocks/app-shell/+layout.svelte`:

- `APP_NAME = "Sandbox"`. _Why:_ a name that is plainly a sample; the preview pages' sample code already uses `pluto-sandbox` (products memo §5).
- `const LOGO: Snippet<[place: "header" | "footer"]> | undefined = undefined;`, passed as `logo={LOGO}` to the header and the footer. Its comment shows a snippet: `{#snippet logo(place: "header" | "footer")}<Logo class="h-8 w-auto" />{/snippet}` and `const LOGO = logo;`, where `Logo` is the product's own component. _Why not an `<img>` with a path:_ `003`'s block rules forbid an `<img>` and any quoted path but `"/"` in a block file, since the file it names is not shipped. _Why a constant:_ the layout's values are constants an app edits (`006` decision 2).
- `FOOTER` gains `tagline: ""` and `endorsed: false`, each with a one-line comment. The footer receives `appName={APP_NAME}`.
- **No Pluto default in a product's footer** (review finding 14). `sourceHref` ships `undefined` with the comment "Your product's repository; without it, no row." The `docId` comment reads "Your doc ID, in your own scheme; Pluto Systems' is `PS-<series>-<NNNN>`; without it, no row." The footer's `docId` prop doc says the same.
- The example page's link "Open the catalogue" becomes "Go to the home page" (`/`), which is true in any app.

### 7. The hero's sample copy

The `hero` block page describes the page itself, so every string is true wherever the block is shown (`003`'s hero rule: "every claim is true where it is shown"; review finding 5). Only its strings change.

| Place           | Text                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------- |
| `<title>`, `h1` | Say what your product does in one line                                                            |
| eyebrow         | sandbox                                                                                           |
| sentence        | The opening of a product's home page: one heading, one sentence and one action. Replace these words with your own. |
| action          | Go to the home page (`/`)                                                                         |
| secondary       | See what the page holds (`#hero-features`)                                                        |
| features title  | What the page holds                                                                               |
| feature 1       | **One heading.** The page's only `h1`, 28 px on a phone and 44 px from `sm`.                      |
| feature 2       | **One action.** A primary link named by where it goes, and an optional second link beside it.    |
| feature 3       | **Three short claims.** Each a title and one sentence your product can prove.                     |

- _Why:_ the old copy described this registry, which no product ships. The new copy describes the block and makes no claim about any product.
- Every string passes the copy lint (`003` decision 15).
- The `hero` item page's notes are read and changed only where they quote the old copy.

### 8. The preview and its tests

- **The default view, `/view/app-shell/`,** renders the shipped files: the wordmark "Sandbox" in the header and the footer, no entrance, no tagline, no endorsement, no source row.
- **`app-shell-view.svelte`** gains `appName`, `logo`, `tagline` and `endorsed` props. Its `APP_NAME` default becomes "Sandbox"; its `sourceHref` stays the design system's, so the views keep a source row to test.
- **A new view, `/view/app-shell/lockup/`** (`BLOCK_VIEWS` label "Lockup as logo"): the logo snippet is `<Lockup entrance={place === "header"} class="text-2xl" />`, `appName` "Pluto Systems", tagline "Work runs on data.". It shows a Pluto Systems property using the shell, and the entrance tests run here.
- **A new view, `/view/app-shell/endorsed/`** (label "Endorsed"): `appName` "Sandbox Analytics Workbench", the wordmark, `endorsed`. The long name also proves decision 2's truncation.
- **The preview site's own footer** (`src/routes/(site)/+layout.svelte`, review finding 3) passes `appName="Pluto Systems"`, a logo snippet rendering `<Lockup class="text-2xl" />` (no entrance), and `tagline="Work runs on data."`.
- **The `app-shell` item page** lists both views and rewrites its notes: the identity bullets (decisions 2 and 3), the endorsement bullet (decisions 4 and 5), and the entrance bullet, now "a product whose logo is the lockup".
- **Stale words are rewritten** (review finding 13): the header's `appName` doc and its comment, the footer's prop docs and comment, the sidebar's `heading` doc, and the `app-shell` description in `registry.json`: "The frame every page sits in: a skip link, a header with the product's logo or name and a theme toggle, an optional sidebar, the main area, and a footer that states the build."
- The prerendered page count grows from 92 to 94.

**Tests that change** (review finding 4). Each keeps its number and takes the new expectation:

| Test                                                 | Now                                                        | Becomes                                                                                       |
| ---------------------------------------------------- | ---------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `tests/e2e/pages.ts`, `SHELL_TOP`                    | `"a:Pluto app"`                                             | `"a:Sandbox"`; the lockup view starts `"a:Pluto Systems"`, the endorsed view `"a:Sandbox Analytics Workbench"` |
| `tests/e2e/pages.ts`, `SHELL_END`                    | "Open the catalogue", the source link                      | "Go to the home page", then the source link on the views; the default view has no source link |
| `tests/e2e/pages.ts`, the hero's stops               | "Browse the components", "See what is included"            | "Go to the home page", "See what the page holds"                                              |
| `blocks.spec.ts` A3                                  | a footer lockup, not a link; the source link on the shipped layout | the wordmark on the default view, no source row; the views keep the rows and the source link  |
| `blocks.spec.ts` A4                                  | the tagline once, on the shell                             | the tagline once, on the lockup view and on the preview site's footer; none on the default view |
| `blocks.spec.ts` A5, `keyboard.spec.ts` 2, `axe.spec.ts` | the dialog "Pluto app"                                  | the dialog "Sandbox"                                                                          |
| `blocks.spec.ts`, the hero's action name             | "Browse the components"                                    | "Go to the home page"                                                                         |
| `blocks.spec.ts` C9                                  | the 10 views of `006`                                      | 12                                                                                            |
| `keyboard.spec.ts`, the toolbar stops                | 62, `[5, 9, 9, 10, 9, 9, 11]`                              | 64; the shell's entry 9 becomes 11                                                           |
| `tests/unit/blocks.test.ts`                          | 28 views                                                   | 30                                                                                            |
| `four-dot.spec.ts`, the entrance and its reduce test | on `/view/app-shell/`                                      | on `/view/app-shell/lockup/`, unchanged otherwise                                             |
| `tests/smoke/blocks-add.test.ts`, the hero's `h1`    | "Components you copy in and own"                           | "Say what your product does in one line"                                                      |

A builder who finds another test that fails because of this specification's change updates it and lists it in the change review; a test that fails for any other reason is a defect.

### 9. The documents

- **`README.md`** says the system serves every Pluto Systems product, each with its own identity.
- **`CHANGELOG.md`** gains a 0.8.0 entry: changed (an interface change) `app-shell`, with the one-line restore of the lockup (`logo` holding `<Lockup entrance={place === "header"} />`); added `mark-reveal` to `pluto-theme`; changed `hero`'s sample copy.
- **`package.json`** becomes `0.8.0`. The registry is built, so `static/v0.8.0/` exists.
- **`context/handoff.md`** is replaced for the release.
- **The constitution is not amended** (the owner's ruling): its §1 already serves "every Pluto Systems application".

## Acceptance criteria

Each is checked by a test in the browser suites (both themes) unless marked.

1. **Wordmark header.** On `/view/app-shell/`, the banner holds exactly one link to `/` whose text is "Sandbox", with no `aria-label`, in the heading family, bold; its box is at least 48 px tall and 24 px wide. The banner holds 0 elements with `data-slot="lockup"` and 0 with `data-slot="four-dot"`.
2. **No entrance by default.** On `/view/app-shell/`, 0 animations named `pluto-mark-dock` run.
3. **Wordmark footer.** On `/view/app-shell/`, the contentinfo holds one `[data-shell="wordmark"]` reading "Sandbox", 0 links, 0 `[data-shell="endorsement"]`, and no text "Work runs on data.".
4. **Logo header and footer.** On `/view/app-shell/lockup/`, the banner's home link has `aria-label` "Pluto Systems" and holds one `[data-slot="lockup"]`; the contentinfo holds one `[data-shell="logo"]` with `role="img"` and accessible name "Pluto Systems", holding one `[data-slot="lockup"]` and 0 elements with the class `mark-entrance`.
5. **The entrance, once.** On `/view/app-shell/lockup/`, the document runs exactly four `pluto-mark-dock` animations, all in the banner, with `006`'s timing: 495 ms each, delayed 135 to 405 ms, the last ending at 900 ms, the dots composed after. Under reduced motion, none run and the dots are at opacity 1 at load.
6. **The endorsement at rest.** On `/view/app-shell/endorsed/`, the contentinfo holds one `[data-shell="endorsement"]` whose text is "A Pluto Systems product", holding one `[data-slot="four-dot"]` with `aria-hidden="true"` and four dots at opacity 0.
7. **The reveal.** Hovering the endorsement gives each dot a computed `transition-duration` of 0.11 s and delays of 0.03, 0.05, 0.07 and 0.09 s; once the transitions end, each dot is at opacity 1 with `transform` `none`. The line's width is the same before and after, to the pixel.
8. **The leave.** After the reveal has settled, moving the pointer off the line gives each dot a computed `transition-duration` of 0.11 s and a `transition-delay` of 0 s; once the transitions end, each is at opacity 0.
9. **Reduced motion.** Under `reducedMotion: "reduce"`, hovering shows the four dots at opacity 1 with every computed delay 0 s and every duration at most 0.01 ms.
10. **Touch.** With `hasTouch` and `isMobile`, a tap on the endorsement leaves the four dots at opacity 0.
11. **A long name.** On `/view/app-shell/endorsed/` at 320 px wide, the header's row is 64 px tall, the page has no horizontal scroll, and the home link's text is the whole name.
12. **The preview site's footer.** On `/`, the contentinfo holds one `[data-shell="logo"]` holding a lockup, the text "Work runs on data." once, and the source link as its only link.
13. **Accessibility.** axe reports 0 violations on both new views, in both themes. The keyboard walk covers both views; the endorsement adds no tab stop.
14. **The hero.** The hero view's `h1` reads "Say what your product does in one line", and its page holds no text "Pluto Systems" and no "design system".
15. **No brand copy in the shipped shell.** A unit test reads the shipped `app-shell` and `hero` files and finds no "Work runs on data.", no "plutosystemsco" and no "Pluto Systems", except the endorsement's own words and the `docId` comment's scheme in `app-shell-footer.svelte` and the layout.
16. **The utility.** A unit test reads the built `pluto-theme` CSS and finds `@utility mark-reveal` once, its four `nth-child` offsets equal to `mark-entrance`'s, its five hover rules in a top-level `@media (hover: hover)`, and its durations and delays as decision 5 gives them. The reduce block is unchanged (the smoke test's three selectors).
17. **Install.** The blocks smoke test installs `app-shell` into a scratch app, which builds; its prerendered page holds the wordmark "Sandbox"; its `app.css` holds `@utility mark-reveal` once and one `@media (hover: hover)` with the five hover rules; a second `add` is byte-identical.
18. **The gate.** `bun run check`, `bun run lint`, the unit, browser and smoke suites, and `bun run build` all pass. The literal lint reports 0 violations on every changed `.svelte` file.
19. **Released** (not a test): the change review's findings are dispositioned, `CHANGELOG.md` has its 0.8.0 entry, `package.json` reads `0.8.0`, `static/v0.8.0/` is built, and the release is tagged when the owner asks.

## Risks

- **The CLI's copy of the theme's CSS object.** Tailwind 4.3.3 compiles `:hover > &` and a nested `@media (hover: hover)` inside an `@utility` (review, EXECUTED). Criterion 17 proves the CLI writes them into an app's `app.css` intact; if it does not, the hover rules move to plain rules outside `@utility`, as `.surface-ink` did (`007` decision 8).
- **An installed app with the old footer** keeps its copy (source, not a package). A re-install overwrites it and then needs `appName`; `svelte-check` names the missing prop. The header's visible change is named in the changelog.

## Landing notes

- **Built:** 2026-11-01, over `bfbd6b6` (`v0.7.1`), by the design lead. The change review is [`../reviews/008-product-identity-pr-2026-11-01.md`](../reviews/008-product-identity-pr-2026-11-01.md): "Does not land yet" on 1 High and 6 Low findings, all 7 fixed. The design calls are in `decisions.md`, "One system, many products".
- **One deviation from the specification as reviewed:** the reveal's hover rules sit in a top-level `@media (hover: hover)`, not nested in the utility. The first smoke run showed the CLI flattening the nested form (decision 5 records why); this was the fallback the Risks section named.
- **Results at landing, under Bun 1.3.14, 2026-11-01** (EXECUTED): `bun run check` 1666 files, 0 errors, 0 warnings; `bun run lint` clean; the literal lint 0 violations; unit 646 of 646; browser 1340 of 1340 in both themes before the review's fixes, and the two suites the fixes touched, 56 of 56, after; smoke 96 of 96 after; `bun run build` 94 prerendered pages; `static/v0.8.0/` built; `static/v0.7.1/` matches its tag.
- **Tests changed beyond decision 8's table**, each for this change's counts or words: `blocks.spec.ts` 24 (30 views, 37 pages), 26 (168 stops) and C9 (85 stops); `keyboard.spec.ts`, the views' stop total (168); `viewer.spec.ts`, the state switches (29); `literals.test.ts`, the good samples (50); `generated.test.ts`, the `nth-child` count in `app.css` (12).
