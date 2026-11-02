# One system, many products

- **Status:** complete
- **Date:** 2026-11-01
- **Author:** the design lead
- **Question:** The design system serves every Pluto Systems product, and each product may have its own logo, name and copy (decisions.md, "One system, many products"). Where does the registry carry one brand today? How do other systems that serve many products let each product show its own identity? How does the shell take a product's logo, fall back to its name, and carry an optional endorsement whose four dots appear on hover, from tokens alone and within the accessibility rules?
- **What it blocks:** specification `008`, product identity, released as `v0.8.0`.

## How to read this memo

Every claim carries a label.

- **EXECUTED**: we ran it and saw the result, on 2026-11-01, in this repository at `v0.7.1` (`bfbd6b6`).
- **READ**: a source says so. Each web source was read on 2026-11-01. The local sources are this repository's files at `v0.7.1`, cited by path, and the specifications, cited by decision number.
- **INFERRED**: our reasoning.

Terms of art.

- **Identity.** What tells a reader which product they are in: its logo, its name, and the words it uses. It excludes the tokens.
- **Wordmark.** A logo made only of a name set in type.
- **Lockup.** A fixed arrangement of a mark and a word. Pluto Systems' lockup is the word "pluto" with the four-dot mark beside it (`four-dot`, `001`).
- **Endorsement.** A line that names the parent company on a product's page, such as "A Pluto Systems product". It sits beside the product's identity and never replaces it.
- **Snippet.** In Svelte 5, a piece of markup passed to a component as a prop and rendered with `{@render}`.

## In short

- **One brand is wired into three places** (READ, §1): the shell's header always shows Pluto's lockup and uses the product's name only as the link's hidden accessible name; the footer always shows Pluto's lockup with "Work runs on data." as its default line; the hero block's sample copy describes this design system. Every other component and block is free of brand copy.
- **The system's own names are not identity** (INFERRED, §1.3): `pluto-theme`, the `pluto:` context keys and the `PS-` doc ID scheme name the system a product is built from. A reader never sees them, except the doc ID, which the footer shows as given.
- **Systems that serve many products give each product its name in the header, and keep the parent's name separate** (READ, §2). IBM's Carbon puts the product's name in the header and prefixes "IBM". GOV.UK moved the service name out of its header into its own component, and tells a service outside GOV.UK to use its own header. Atlassian pairs a product's mark with a line naming Atlassian, and only "when the Atlassian context is not clear".
- **A snippet is the right shape for a logo** (INFERRED, §3): an SVG, an image or markup all fit, the product owns its file, and no token or prop limits what a logo may be. The shell names the logo with the product's name, so a product never has to label its own drawing.
- **The hover reveal needs no new token** (INFERRED, §4). The entrance's tokens already give a 495 ms dock per dot, staggered to end at 900 ms. A transition reads the same values, so the dots dock when the line is hovered and fade back at the micro duration when it is left. Under reduced motion both durations are 0 ms.
- **The reveal is outside WCAG 2.2's 1.4.13** (READ and INFERRED, §4.2). That criterion covers content that appears "in addition to the triggering component itself", such as tooltips. The dots are decoration inside the line, hidden from assistive technology, and cover nothing.

## 1. Where the registry carries one brand today (READ, `src/lib/registry/`)

### 1.1 The shell

- `components/app-shell-header.svelte` renders `<Lockup href="/" label={appName} entrance />`. The visible word is always "pluto" and the four dots. `appName` becomes the link's `aria-label` and the phone sheet's title.
- `components/app-shell-footer.svelte` renders `<Lockup class="text-2xl" />`, which takes the `Lockup`'s own default name, "Pluto Systems", and `tagline = "Work runs on data."`, the brand line.
- `blocks/app-shell/+layout.svelte` ships `APP_NAME = "Pluto app"`.
- WCAG 2.2's 2.5.3, label in name, asks that a control's accessible name contain its visible text. A product named "Sandbox" would get a home link reading "pluto" and named "Sandbox" (INFERRED). The current shape fails that rule for every product except Pluto itself.

### 1.2 The sample copy

- `blocks/hero/+page.svelte` ships the eyebrow "pluto systems · design system", the title "Components you copy in and own" and a sentence about "Pluto Systems apps". The three features describe this registry.
- The sign-in, sign-up, settings, page-states and chat blocks ship no brand copy. A text search for "pluto" in `src/lib/registry/` finds only the four places above, the `four-dot` item and the system's own names (EXECUTED: `git grep -n -i pluto -- src/lib/registry`).

### 1.3 The system's own names

- `ui/theme/theme.svelte.ts` stores the reader's choice under the key `pluto-theme`. Every form control reads its `Field` through the context key `pluto:field`. `lib/highlighter.ts` names its Shiki theme `pluto-code`.
- INFERRED: these names never reach a reader's eyes. They name the system, as `shadcn` names its own CSS variables. Renaming them would break every installed app for no gain to a product's identity. Two products served from one origin share the reader's theme choice, which is what a family of products wants.
- The doc ID scheme `PS-<series>-<NNNN>` is Pluto Systems' own (decisions.md, "The theme mechanism, the doc-ID scheme and the footer's sentence"). The footer shows the string it is given, so a product may pass its own scheme without a change (READ, `app-shell-footer.svelte`).

## 2. How other systems let products carry their own identity (READ)

### 2.1 IBM Carbon, the UI shell header

- "The header name should be the name of the parent domain and be as brief as possible", and "Identify the UI by name." "For IBM products, the header name is always preceded by 'IBM.'" ([Carbon, UI shell header usage](https://carbondesignsystem.com/components/UI-shell-header/usage/)).
- INFERRED: the product's name is the header's identity and the parent's name is a short prefix, kept apart from it. Carbon makes the prefix mandatory because every product is sold as IBM's. The owner made ours optional and kept it out of the header.

### 2.2 GOV.UK, the header and the generic header

- "You can no longer use the GOV.UK header to show service name or navigation links"; a service uses the service navigation component instead. The GOV.UK header "should only show the GOV.UK logo and any GOV.UK-wide links and tools".
- A service outside GOV.UK "must not use the GOV.UK header component", and should "create their own", using the generic header "to show your own organisation's branding" ([GOV.UK Design System, header](https://design-system.service.gov.uk/components/header/)).
- INFERRED: the parent's identity and the product's identity are separate parts. A system that serves many owners gives each its own header. Ours is the second case: every product takes the same header component and fills in its own identity.

### 2.3 Atlassian, product logos and attribution

- An attribution logo combines a product's logomark with the Atlassian strapline. "Only use attribution logos when the Atlassian context is not clear." The shared form "create[s] consistency in our portfolio, and help[s] customers connect them with our overall Atlassian brand." For digital experiences the alt text includes "Atlassian" with the product's name ([Atlassian Design, logos](https://atlassian.design/foundations/logos/)).
- "Never compose your own attribution logos or deconstruct the official assets" (same source).
- INFERRED: the endorsement is the system's to draw, once, so every product shows it the same way. That argues for one prop on the footer, not a pattern each product rebuilds.

### 2.4 Where they agree, and where we differ

All three put the product's own name where a reader looks first and keep the parent's name small and apart. Carbon and Atlassian fix the parent's form centrally. None of them lets a product restyle the parent's mark. We differ in one way, by the owner's ruling: the endorsement is off by default.

## 3. The logo and its fallback (INFERRED, from §1 and §2)

- **Shape.** `logo?: Snippet` on the header and the footer. A product passes an `<svg>`, an `<img>` or markup. Pluto's own sites pass `<Lockup />`, so the `four-dot` item stays a logo among others and its entrance stays available.
- **Naming.** The header wraps the logo in its home link and names the link with `appName`, so the snippet is decoration inside a named link. The footer has no link, so it wraps the logo in an element with `role="img"` named by `appName`. A product never labels its own drawing. 2.5.3 then asks that `appName` contain any words the logo shows, which the item page states.
- **Fallback.** Without a logo, both render `appName` as a wordmark: the heading face, bold, the lockup's tracking, at the size the lockup had. The name is then visible text, and the link needs no `aria-label`.
- **The entrance.** It belongs to the four-dot mark (`006` decision 5). A product's own logo has no entrance. A product whose logo is the `Lockup` passes `entrance` to it inside the snippet. The shipped shell then has no entrance by default, and the tests that measure the entrance move to a view whose logo is the lockup.
- **Size.** The header's row stays 64 px. The item page says a logo should be at most 32 px tall, which is on the ladder (`001` decision 10), so it sits inside the 48 px control height with room around it.

## 4. The endorsement and its hover reveal

### 4.1 The motion, from the entrance's tokens (INFERRED, from `src/app.css` and `006` decision 5)

- The entrance utility `mark-entrance` animates each dot from an offset of `--mark-orbit` times a per-dot direction (`--_ox`, `--_oy`), at scale 0.4 and opacity 0, to its place. Its duration is `--motion-entrance × --motion-entrance-dot` (495 ms), and its delays are `--motion-entrance × (--motion-entrance-start + i × --motion-entrance-stagger)` (135 to 405 ms). The last dot ends at 900 ms, the design book §06's budget.
- A hover reveal is the same path as a **transition** rather than an animation. At rest, each dot sits at its offset at opacity 0. When the line is hovered, the dots move to their places with the entrance's duration and delays. When the hover ends, the rest state's transition applies: the micro duration, `--motion-micro` (200 ms), with no delay, so the dots leave quickly. A transition reverses from wherever it is if the pointer leaves halfway; an animation would jump.
- The design book §06 allows one entrance per page. The reveal is not an entrance: it answers a reader's action, as a button's hover does. It never plays unasked.
- Under reduced motion, `pluto-theme` sets `--motion-entrance` and `--motion-micro` to 0 ms and caps every transition at 0.01 ms (READ, `src/app.css`). The dots then appear and leave with the hover, without moving.
- The dots keep their space at rest, so the line's width never changes on hover.
- Hover is a pointer's state. The [`hover` media feature](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/hover) separates a primary input that "can conveniently hover" from one that "cannot conveniently hover", such as a phone (READ). On a phone the dots never show. The line's words carry the endorsement either way, so nothing is lost.

### 4.2 Accessibility (READ and INFERRED)

- WCAG 2.2's 1.4.13, content on hover or focus, covers "content that appears in addition to the triggering component itself", such as "custom tooltips, sub-menus, and other nonmodal popups" ([Understanding 1.4.13](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html)). The dots are part of the line, carry no information, and cover nothing. INFERRED: 1.4.13 does not apply.
- The `FourDot` without a `label` is `aria-hidden` (`001`). The line reads "A Pluto Systems product" to assistive technology, with or without the dots.
- The line is not a link. Pluto Systems has no public page for it to point at. With no link it takes no focus, so there is no keyboard state to match the hover. INFERRED: a later link would add `:focus-visible` to the same selector.
- Contrast: in the light theme the dots are the four mark colours on `background`; in the dark theme all four are `paper` on ink (READ, `tokens/pluto.tokens.json`). The token build's non-text pairs do not include the mark colours (READ, the `contrast.nonText` list). WCAG 2.2's 1.4.11 asks 3:1 only of graphics "required to understand the content"; the dots here are decoration beside words that say the same, and the mark is a logo (INFERRED). No new contrast pair is needed.

### 4.3 The words

- The owner's words are "A Pluto Systems product". Sentence case, no full stop: a label, not a sentence (INFERRED).
- It sits under the footer's rows, small, as the `statement` does, so the product's own identity stays the footer's first thing.

## 5. The sample product

- The shipped blocks need a product name that is plainly an example. The preview pages already use `pluto-sandbox` and `co.plutosystems.sandbox` in their sample code (READ, `src/routes/(site)/`). INFERRED: the shell ships `APP_NAME = "Sandbox"`, and the hero's sample copy describes Sandbox, a place to run code. The copy makes no claim a product would have to keep.

## 6. What this memo does not settle

- A product accent colour. By the owner's ruling it waits for a product that needs one, and its own specification.
- Product favicons. An app's `app.html` owns its icon links (`006` "Not here").
- Whether the endorsement should ever link. It does not today, since no public page exists for it to point at.

## Sources

- [Carbon Design System, UI shell header usage](https://carbondesignsystem.com/components/UI-shell-header/usage/), read 2026-11-01.
- [GOV.UK Design System, header](https://design-system.service.gov.uk/components/header/), read 2026-11-01.
- [Atlassian Design System, logos](https://atlassian.design/foundations/logos/), read 2026-11-01.
- [W3C, Understanding SC 1.4.13: Content on Hover or Focus](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html), read 2026-11-01.
- [MDN, the `hover` media feature](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/hover), read 2026-11-01.
- This repository at `v0.7.1`: `src/lib/registry/`, `src/app.css`, `tokens/pluto.tokens.json`, `context/decisions.md`, specifications `001`, `003` and `006`.
