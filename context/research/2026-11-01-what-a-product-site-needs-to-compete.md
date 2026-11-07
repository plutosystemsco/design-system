# What a product site needs to compete

- **Status:** complete (a placeholder, completed in place by the design lead on 2026-11-01; see "The answer" at the end).
- **Date:** 2026-11-01
- **Author:** a product site's builder, at the owner's request. The design lead completes it.
- **Question:** How must the design system be architected so a Pluto Systems product site can look as unmistakable as Google's or Microsoft's brand, and as finished as Cloudflare's, Stripe's or Vercel's pages? The system must keep its current strengths for apps and docs.
- **What would answer it:**
  - a study of how other systems separate brand, modes and product;
  - a reading of this repository's lint, tokens and the design book against the needs listed below;
  - a proposed architecture the owner approves.
- **What it blocks:**
  - the first product site's hero, which the owner has chosen;
  - any Pluto Systems page meant to persuade, not to be used.

## How to read this memo

Every claim carries a label.

- **EXECUTED:** someone ran it and saw the result, on 2026-11-01.
- **READ:** a source says so. The local sources are this repository's files at `v0.8.0` (`6fbdf99`), cited by path, and the design book, cited by section.
- **INFERRED:** reasoning.

Terms of art:

- **Mode:** a set of rules for how loud a surface may be, sharing one set of tokens. *Productive* is for apps, docs and dense screens. *Expressive* is for home pages, launches and marketing sections.
- **Composition:** a page section delivered as a registry block. It is to a marketing page what `app-shell` is to an app.
- **Stage:** a full-bleed dark section, darker than today's ink, where one object is lit and shown.
- **Bloom:** soft light behind an object.
- **Rim:** the lit edge of a card.

## The goal, as the owner put it

The owner wants a brand "as definitive as Google and Microsoft" (READ, the owner, 2026-11-01). That covers the first product's site and any site after it. The owner judged the current system "very restrictive", "built to produce something like a docs website, not the next Google or Microsoft" (READ, the owner, 2026-11-01).

"Definitive" means two things (INFERRED):

1. **You can tell it is Pluto's from a fragment.** Google has its four colours and Google Sans. Microsoft has its four squares and Segoe. Those few assets are owned, protected and used everywhere.
2. **It can be quiet or loud as the moment needs.** A dense admin screen and a launch-day home page are both clearly the same brand.

## Where the system stands

### It locks down volume, not identity

Each of the following blocks a home page from being loud (READ, `scripts/lint-literals.ts` at `v0.8.0`, and the design book):

- **Light and depth:**
  - L1 bans translucent tints;
  - L5 allows only `shadow-elevation`;
  - L6 bans backdrops;
  - the design book bans gradients and shadows.
- **Display type:**
  - L7 keeps sizes on the ladder;
  - L8 caps type at `text-5xl`;
  - L9 allows only the named tracking;
  - the design book's §04 sets display at 44 px.
- **Shape:** L11 allows `rounded-full` only on its allowlist.
- **Motion:**
  - L10 allows only the listed animations;
  - the design book's §06 caps responses at 200 ms and allows one entrance per page.
- **Layout:** `app-shell` has one fixed content width, with no option for full-bleed sections.

These rules suit a product screen well (INFERRED). They are the right rules for productive mode.

### Little of it is Pluto's own

Each named asset comes from someone else or is common (INFERRED):

- the heading face, IBM Plex Sans, is IBM's;
- the body face, Geist, is Vercel's;
- the code face, JetBrains Mono, is JetBrains';
- Charon Blue is one saturated blue among many;
- paper and ink is a common look right now.

The four-dot mark is Pluto's own (READ, `four-dot`). `v0.8.0` gave each product its own logo and name, and an endorsement line (READ, `decisions.md`, "One system, many products"). Nothing yet protects the brand's assets the way lint protects its tokens (INFERRED).

### It has components but few compositions

`app-shell` composes an app (READ, `registry.json`). The hero block's sample copy describes this design system (READ, `research/2026-11-01-one-system-many-products.md` §1). There is no stage section, proof band, live-demo console, call-to-action band or marketing footer. A brand shows at the level of the page section (INFERRED).

## The evidence: a product site's lab

The first product site's builder built a throwaway lab of plain HTML, CSS and JS outside this repository. It held four hero ideas and a live console (EXECUTED, 2026-11-01). The owner chose one hero:

- a stage, with a large headline on the left;
- two code cards on the right: a shell install line and a short Python program, each with a Copy button;
- a bloom behind the cards that brightens when the visitor runs code;
- pill buttons;
- a strip of package names along the bottom.

The owner rejected an earlier idea, a flowing ribbon, as "a knockoff of Stripe" (READ, the owner, 2026-11-01). Expressive mode must not copy anyone's look.

Every value below is a literal the lab had to invent, because the system had no token for it (EXECUTED). Each one should become a token, a utility or a variant.

| Need | The lab's literal |
|---|---|
| The stage ground | `#000` and `#050608`, darker than ink `#14161C` |
| Lines on the stage | paper at 10% and 14% opacity |
| Muted text on the stage | `#9AA0AD`, and paper at 70% opacity |
| Display headline | `clamp(48px, 6vw, 92px)`, weight 600, line height 0.95, tracking −0.045em |
| Section heading | `clamp(36px, 4vw, 56px)`, weight 600, tracking −0.035em |
| Proof numbers | `clamp(56px, 6vw, 96px)`, weight 600, tracking −0.04em, tabular figures |
| Bloom | radial gradient from `rgba(200,212,255,.22)` through `rgba(110,130,210,.07)` to transparent, opacity eased over 600 ms |
| Rim on a code card | border `rgba(225,233,255,.28)`, glow `0 0 40px rgba(200,214,255,.12)`, inner highlight `inset 0 1px 0 rgba(255,255,255,.06)`, radius 14 px |
| "Busy" glow on the console | `0 0 0 1px rgba(122,155,255,.55), 0 0 60px rgba(36,86,230,.25)`, over 400 ms |
| Pill buttons | radius 999 px; 38 px tall in the bar, 52 px for main actions |
| Pressed state | `scale(0.98)` over 160 ms |
| Tab indicator | slides over 220 ms on `cubic-bezier(0.2, 0.7, 0.2, 1)` |
| Meters | 6 px track, fill from Charon to lifted Charon, 700 ms on the same curve |
| Floating bar | paper-on-ink at 85% opacity with `blur(10px)` |
| Bar and page gutters | bar 72 px tall; 40–56 px side gutters |

The full-screen hero also needed:

- a hero at least as tall as the screen (`min-height: 100svh`), with the next section hidden until the visitor scrolls;
- big numbers that count up once, then hold;
- every animation stopped under `prefers-reduced-motion`.

## A suggested architecture

Offered for the design lead to test against the research, and to improve (INFERRED).

1. **Foundations,** strict and shared:
   - tokens, spacing, grid, radius and elevation;
   - WCAG 2.2 AA in both themes;
   - keyboard access and reduced motion.

   These are today's rules, kept.
2. **Brand,** the strictest layer, but about identity:
   - slots for the mark and its lockups;
   - a signature colour set;
   - the typefaces;
   - one signature graphic device;
   - the voice, the imagery style and the motion signature.

   Lint should protect them: wrong colours, a stretched mark or a substitute face fail. The identity itself is design work the owner will commission. **Build the slots and the rules; invent no mark.**
3. **Modes,** sharing one set of tokens:
   - **Productive:** today's rules.
   - **Expressive:** the needs in the table above, each made a token or a utility.

   Each mode gets its own lint profile, and each component states which modes it supports. A button never grows a gradient in productive mode. A section in expressive mode still takes every value from a token.
4. **Compositions:** as registry blocks.
   - a hero, with a headline, actions and a slot for code or an object;
   - a stage section;
   - a proof band of large numbers;
   - a live-demo console with meters;
   - a strip of names;
   - a call-to-action band;
   - a marketing footer.
5. **Product themes:** what a product may set on top of Pluto's brand, such as an accent and a motif. The product accent `decisions.md` defers to its own specification belongs here.

Two further points:

- **The design book.** It could split into a **brand book**, which rarely changes, and a **product book**, for building screens, which changes often.
- **Expressive material the lab showed is needed:**
  - **Light** (bloom, rim, an energized state) as the one sanctioned way to light things. Decorative gradient washes stay banned.
  - **Motion tokens:** durations (about 200, 600 and 900 ms) and easing curves. Motion in answer to the visitor is free. One ambient motion per page at most, through a named utility.
  - **A lit `code-block` variant** for the stage.
  - **Tokens readable from JS,** so a canvas or SVG figure never hard-codes a colour.

## What must not change

- **Source, not a package** (READ, constitution §4.1).
- **Tokens are the one source** of every colour and size, in both modes (READ, constitution §4.3).
- **WCAG 2.2 AA in both themes, and full keyboard use** (READ, constitution §4.4). Reduced motion stops every animation.
- **Prior art is studied, never copied** (READ, constitution §6).
  - Systems worth studying: Material 3 and Material 3 Expressive, Fluent 2, Carbon's productive and expressive type sets and motion, and Geist.
  - Sites worth studying: Stripe, Cloudflare and Vercel.
  - Study their architecture, not their look.
- **No installed app breaks silently** (READ, constitution §6). A productive-mode screen looks the same after the upgrade.

## How the answer would be judged

Release criteria, met in this repository (READ, constitution §2.4):

- A preview page renders the reference hero above, the proof band and the live console, with **zero literal values and zero lint exceptions**.
- Every productive-mode preview page is unchanged.
- Every new page passes axe in both themes with AA contrast. Reduced motion stops every animation.
- Two product themes, side by side, are both clearly Pluto's and clearly different from each other.

## Questions for the owner

Each would be asked with options and a recommendation, and recorded in `decisions.md`.

- **The brand architecture.** Is a product a Pluto product, the way Google Maps is Google's? Or is it its own brand that Pluto endorses, the way `v0.8.0`'s "A Pluto Systems product" line works?
- **The identity work.** Who designs the mark's wider system, the signature colour set, the typefaces and the signature device? Does expressive mode wait for that work, or ship with today's assets first?
- **The ceiling of expressive mode.** How loud may it get? This sets the largest display size, the strongest light and the most motion allowed.
- **The release order.** One release could carry the structure and expressive tokens, then the compositions, then the brand slots once the identity exists.

## The answer (completed 2026-11-01)

The owner answered the memo's questions in one ruling: the only design constraint is competing with Google, and the identity is built as options for the owner's review (READ, `decisions.md`, "The identity is commissioned, with options"). The research it asked for is done:

- **How other systems separate brand, modes and product:** [`2026-11-01-how-systems-separate-brand-modes-and-products.md`](2026-11-01-how-systems-separate-brand-modes-and-products.md).
- **How definitive brands are built, and what Pluto's mark risks:** [`2026-11-01-how-definitive-brands-are-built.md`](2026-11-01-how-definitive-brands-are-built.md).
- **The four colours, measured:** [`2026-11-01-how-the-four-colours-are-tuned.md`](2026-11-01-how-the-four-colours-are-tuned.md) and its candidates' JSON.

The architecture, as specified (INFERRED from the three memos; each choice and its reason is in the specifications):

1. **Foundations** stay as they are; a productive screen is unchanged.
2. **Brand slots** are runtime variables on `:root`: the stage's colours and the display face now; the other faces when the typeface is chosen. The mark's colours were already variables. ([`009`](../specifications/009-expressive-mode-and-the-brand-slots.md) decision 2.)
3. **Modes** are a `data-mode` attribute whose variables inherit, so a productive island inside an expressive stage stays productive. Volume arrives only through named utilities (`type-display`, `bloom`, `rim`, `energized`, `veil`, `action-press`, `surface-stage`); the literal rules bind both modes. A lint rule, L22, lets only items declared `["expressive"]` use them. (`009` decisions 7 and 9.)
4. **Compositions** are registry items: stage, lit code card, floating bar, hero, proof band, live console, name strip, call-to-action band, marketing footer, and the `product-home` block that answers this memo's first release criterion. ([`010`](../specifications/010-the-stage-compositions.md).)
5. **Product themes** wait for the brand architecture (the exhibit's question A).

The identity itself is the owner's to choose, from three to five options per question, shown live at the preview app's `/identity` route.
