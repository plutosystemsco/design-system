# The blocks: patterns, accessibility and the design book

- **Status:** complete
- **Date:** 2026-10-28
- **Owner:** Clay Gendron (research executed by an agent, Claude, sub-agent of the orchestrating session)
- **Question:** The registry will serve seven first **blocks**: the app shell, the hero with call to action and feature grid, sign in, sign up, the chat pane, the page states (empty, error, not found, loading) and the settings form. For each, what do good systems agree on? Which accessibility rules bind it? What does design book v2 say? How does it change across screen widths?
- **What it blocks:** the primitive list of `002`, which must cover what these blocks need, and the blocks specification after it (decisions.md, "Blocks, and they shape `002`", 2026-10-28).

## How to read this memo

Every claim carries a label.

- **EXECUTED**: we ran it and saw the result, on 2026-10-28, in this repository or its prior-art clone. Mostly `grep` and `ls` over source.
- **READ**: a source says so. Each source is linked. **Every web source was read on 2026-10-28.** The local sources were read the same day:
  - design book v2, `plutosystemshq/pluto-systems-design-book-v2.html`, cited as *v2* with its section and line;
  - the shadcn-svelte clone at `context/prior_art/shadcn-svelte`, commit `6149e14` (MIT, recorded in `prior_art/README.md`), cited as *the clone* with a path under `docs/src/lib/registry/`;
  - specification `001`, cited by decision number.
- **INFERRED**: our reasoning.

Prior art is described in words. No markup or code is copied from it.

ChatGPT and Claude.ai could not be studied first-hand. There was no signed-in session, and neither vendor publishes a page of keyboard shortcuts that we could fetch. Third-party guides disagree with each other. So the chat pane leans on published component libraries and accessibility guidance, and treats claims about those two products as weak.

### Terms

- **Block:** a composed page or section, served by the registry as source. An app installs it with one `add` and owns the copy.
- **Primitive:** a single component, such as a button or an input. Blocks are built from primitives. (`001` uses "primitive" for a raw colour token too; in this memo it means a component, as in decisions.md.)
- **Landmark:** a region of a page that assistive technology lists and lets users jump between: `banner` (the site header), `navigation`, `main`, `contentinfo` (the site footer), `complementary`, `region`, `form` and `search`.
- **Live region:** a part of a page that assistive technology announces when it changes, without the user moving focus there. Its **politeness** says when: `polite` waits until the user is idle; `assertive` interrupts.
- **Screen reader:** software that reads the page aloud, such as VoiceOver, NVDA or JAWS.
- **Skip link:** a link, first in the page, that jumps past the repeated header to the main content.
- **Sheet:** a panel that slides in from an edge and behaves as a modal dialog. A **modal dialog** blocks the rest of the page until it closes.
- **Error summary:** a box at the top of a form, after a failed submit, that lists each error as a link to its field.
- **Autocomplete token:** a value of the HTML `autocomplete` attribute, such as `current-password`, that tells the browser and password managers what a field holds.
- **Skeleton:** a placeholder in the shape of the coming content, shown while it loads.
- **Composer:** the text box and buttons at the bottom of a chat where the user writes a message.
- **Streaming:** the reply arrives in small pieces, called **tokens**, and is shown as it arrives.
- **IME:** an input method editor, the software that composes characters for Japanese, Chinese, Korean and other scripts. Enter often confirms its composition.
- **Groove:** v2's one line primitive, a hairline with a 1 px white line beneath it (v2 §05, line 533).
- **Ground:** a surface that text sits on. v2 names three: paper, raised white and ink. `muted` is a fourth, for component insets only (decisions.md, 2026-10-27).
- **SC:** a WCAG 2.2 success criterion, cited by number, with its W3C Understanding page.

## 0. What binds every block

These hold for all seven. Each block section below adds only what is particular to it.

### 0.1 Accessibility rules common to all

- **Target size.** SC 2.5.8 (AA): a pointer target is at least 24 by 24 CSS px, unless a 24 px circle centred on it touches no other target or circle, or an equivalent control meets the size, or it sits inline in text (READ, [Understanding 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)).
- **Focus not obscured.** SC 2.4.11 (AA): a focused component is "not entirely hidden due to author-created content". The page names "sticky footers, sticky headers, and non-modal dialogs" as the usual culprits. CSS `scroll-padding` is a sufficient technique, C43 (READ, [Understanding 2.4.11](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html)).
- **Focus appearance.** SC 2.4.13 is **AAA**, not AA. It asks for an indicator at least as large as a 2 CSS px perimeter of the control, changing by 3:1 between focused and unfocused pixels. A solid 2 px outline outside the control meets the size part (READ, [Understanding 2.4.13](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html)). `001` decision 13 already draws a 2 px solid `ring` outline at 2 px offset that passes 3:1 against the grounds. INFERRED: that meets 2.4.13's size, and its contrast where the ground is the unfocused pixel. So blocks can claim it without extra work, as long as no block replaces the global ring.
- **Reflow.** SC 1.4.10 (AA): content works at 320 CSS px wide with no scrolling in two directions. Data tables, and preformatted text whose layout carries meaning, are exempt (READ, [Understanding 1.4.10](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)). The page names Python's indentation as such a case. That matters for `wasi-python-dev`'s code output.
- **Status messages.** SC 4.1.3 (AA): status messages must reach assistive technology without taking focus. `role=status` (ARIA22) suits results and state; `role=log` (ARIA23) suits sequential updates; `role=alert` (ARIA19) suits errors. A listed failure is `role=alert` or `aria-live=assertive` "on content which is not important and time-sensitive" (READ, [Understanding 4.1.3](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html)).
- **Live regions must exist before they change.** "Establish the live region before updating its content… The most reliable way… is to include them in the initial markup." `polite` speaks "whenever the user is idle"; `assertive` "will interrupt any announcement a screen reader is currently making" (READ, [MDN, ARIA live regions](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions)).
- **Labels.** SC 3.3.2 (A): "Labels or instructions are provided when content requires user input" (READ, [Understanding 3.3.2](https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html)). INFERRED from its glossary: a placeholder vanishes on typing, so it is not a label.
- **Animation from interactions.** SC 2.3.3 is AAA; C39 (`prefers-reduced-motion`) is its technique (READ, [Understanding 2.3.3](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)). `001` decision 14 already zeroes the motion tokens and clamps all animation under reduce.
- **Pause, stop, hide.** SC 2.2.2 (A): moving or blinking content that starts by itself and lasts over five seconds, beside other content, needs a way to pause, stop or hide it. Auto-updating content needs the same, with no five-second grace. A preload animation can be "essential" when nothing else can happen (READ, [Understanding 2.2.2](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html)).

### 0.2 Design-book rules common to all

- **Grounds.** "Grounds are paper, raised white, or ink." No brand-colour tint as a section background (READ, v2 §03, line 438). `muted` and `accent` are for component insets only: skeletons, tab strips, code grounds, hover and selected rows. Never a page, section or sidebar ground (READ, decisions.md, 2026-10-27; `001` decision 8).
- **One accent per surface.** "Any other surface spends at most one" of the four colours. The mark is "the page's one full-palette moment" (READ, v2 §01 law 2, line 268). Red and green carry state: "blue acts, red stops, amber cautions, green confirms". "Functional state semantics… are the sanctioned non-mark use of red and green" (READ, v2 §03, line 430). State is never told by colour alone (READ, decisions.md, 2026-10-27).
- **The budget.** "Paper + ink ≥ 88% of any surface. Headings and hero copy are always Ink" (READ, v2 §03, line 422).
- **No colour as decoration.** "A coloured element is an action, a state, or the mark." No colour dots on dark grounds (READ, v2 §03, lines 434–439).
- **Space.** The ladder 4, 8, 12, 16, 24, 32, 48, 64, 96. "Component-internal spacing uses the small steps, layout uses 32+" (READ, v2 §05, line 523; `001` decision 10).
- **Radius.** 8 px for cards, inputs and buttons. Full round "for dot-derived elements only. Nothing in between" (READ, v2 §05, line 527; `001` decision 9).
- **Honest pixels.** "Shadows only where elevation means something (menus, dialogs)… Interactive elements look pressable: visible borders, real active states" (READ, v2 §05, line 539).
- **Motion.** One entrance per page, the mark's orbit-assemble, at most 900 ms. "Everything else is response… each ≤ 200 ms." Reduced motion "gets the composed end state". **Banned:** "scroll-jacking, parallax, ambient/looping animation, animated gradients, anything that moves while the visitor is reading" (READ, v2 §06, lines 562–565).
- **The ban list.** No glassmorphism: "no frosted glass, no blur panels" (line 651). No terminal cosplay: "no fake prompts as marketing copy, no blinking-cursor headlines… Real terminal output in real docs is welcome" (line 650). Never "sparse and broken": "inputs keep visible borders and labels, links look like links, buttons have shapes" (line 655) (all READ, v2 §09).
- **Labels are lowercase.** "Eyebrows, captions, doc IDs, dates, code. Labels are lowercase… Prose stays sentence case" (READ, v2 §04, line 470).
- **Failure states.** "Errors, empty states, and 404s carry the warmest copy in the system… Explain what happened and what to do next; never apologize vaguely" (READ, v2 §07, line 590).

**Where the design book is silent on all blocks** (INFERRED):

- Whether "labels are lowercase" covers form-field labels and button text, or only mono eyebrows and captions. The book has no forms.
- Whether a functional error in red on a surface that already spends blue, on its primary button and focus ring, breaks "one accent per surface". We read §03's state semantics as sanctioned outside the budget. The specification should say so.
- Loops. Spinners, skeleton shimmer and streaming indicators all loop. The ban on "ambient/looping animation" may or may not cover functional progress indicators.

### 0.3 Breakpoints

- Tailwind's defaults: `sm` 640 px, `md` 768 px, `lg` 1024 px, `xl` 1280 px, `2xl` 1536 px, all min-width (READ, [Tailwind, responsive design](https://tailwindcss.com/docs/responsive-design)). Container queries run from `@3xs` 256 px to `@7xl` 1280 px (same page).
- shadcn-svelte's `IsMobile` hook defaults to 768 px (READ, the clone, `hooks/is-mobile.svelte.ts`).
- v2's own page caps content at 960 px with a 24 px gutter (READ, v2 line 39). Body text is capped at 66 ch (line 45). The stated measure is 60–75 ch (§04, line 465).

## 1. The app shell

The header with the lockup, an optional sidebar, the main area and the footer.

### 1.1 The converged pattern (READ)

Sources: the clone's sidebar component and 16 sidebar blocks; [Carbon, UI shell header](https://carbondesignsystem.com/components/UI-shell-header/usage/) and [left panel](https://carbondesignsystem.com/components/UI-shell-left-panel/usage/); [NN/g, left-side vertical navigation](https://www.nngroup.com/articles/vertical-nav/) (Page Laubheimer, 2021-05-16); [GOV.UK skip link](https://design-system.service.gov.uk/components/skip-link/); [WebAIM, skip navigation links](https://webaim.org/techniques/skipnav/).

**What they agree on.**

- **Header order runs from product to global.** The product name or logo sits at the left. Product links follow. Utilities sit at the right. In Carbon that is search, then help, notifications and account, with the product switcher rightmost (READ, Carbon header).
- **A left panel for secondary navigation.** Carbon uses one for "more than five secondary navigation items", fixed to the left below the header, with sub-menus that expand in place and no third tier (READ, Carbon left panel). NN/g favours a left vertical nav when categories are many or likely to grow (READ, NN/g).
- **A skip link is the first focusable element.** It reads "Skip to main content", is hidden until focused, and targets the main content (READ, GOV.UK; WebAIM; Carbon). GOV.UK puts it straight after `<body>`, or after a cookie banner, and never inside the header or a `nav`.
- **On narrow screens the side navigation moves behind a menu button.** Carbon folds header links into the left panel's menu (READ, Carbon header).

**shadcn-svelte's sidebar, in detail** (READ, the clone, `ui/sidebar/`).

- Three collapse modes: `offcanvas` (slides fully away), `icon` (shrinks to a rail of icons) and `none` (`sidebar.svelte`).
- Widths: 16 rem on desktop, 18 rem on mobile, 3 rem as an icon rail (`constants.ts`).
- **Ctrl or Cmd with B toggles it** (`context.svelte.ts`, the shortcut constant `"b"` checked with `metaKey || ctrlKey`).
- The open state persists in a cookie named `sidebar_state` for seven days (`sidebar-provider.svelte`, `constants.ts`).
- **Below 768 px it renders as a sheet**, with a visually hidden title "Sidebar" (`sidebar.svelte`).
- A thin "rail" along the sidebar's edge toggles it on click. It is `tabindex=-1`, so it is mouse-only, and 16 px wide (`sidebar-rail.svelte`).
- `SidebarInset`, the content area, renders a `<main>` (`sidebar-inset.svelte`).
- In four blocks the page header is `sticky top-0` with a bottom border and an opaque background (EXECUTED: `grep sticky` hit sidebar-02, -09, -12 and -15 page headers and sidebar-16's site header).

**Where they differ.**

- **Hiding desktop navigation.** NN/g advises against hiding desktop navigation behind a menu. It calls icon-only collapse ambiguous for occasional visitors and acceptable for daily-use applications, where people learn the icons (READ, NN/g). shadcn offers both as options.
- **The shortcut.** Only shadcn ships one. Carbon's pages, as read, name none.

**What the clone lacks** (EXECUTED, `grep` over `blocks/` and `ui/`):

- No block contains a skip link. `grep -i 'skip to'` found nothing.
- The sidebar trigger sets no `aria-expanded` and no `aria-controls`. Its only text is a visually hidden "Toggle Sidebar".
- The desktop sidebar's root is a `<div>`, not a `<nav>` or `<aside>`. A block must add the navigation landmark itself.
- No block uses `backdrop-blur`.

### 1.2 Accessibility rules

- **Bypass blocks.** SC 2.4.1 (A): "A mechanism is available to bypass blocks of content that are repeated on multiple web pages." Skip links (G1, G123, G124), landmarks (ARIA11) and headings (H69) are each sufficient (READ, [Understanding 2.4.1](https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks.html)). INFERRED: landmarks alone pass, but a skip link serves sighted keyboard users, who cannot jump by landmark.
- **Skip link mechanics.** Hide it off-screen, never with `display:none` or `hidden`, which drop it from the tab order. Make it plainly visible on focus. Point its `href` at the `id` of `<main>` (READ, WebAIM). INFERRED: give `<main>` `tabindex="-1"` so focus lands there in every browser. WebAIM's page does not cover this.
- **Landmarks.** Eight roles exist. `<main>` and `<nav>` imply theirs. Keep the count low, "seven or fewer", and put all content inside one (READ, [APG, landmarks](https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/)). INFERRED from HTML's mapping: a `<header>` and `<footer>` that are children of `<body>`, not of `<main>`, become `banner` and `contentinfo`. Two `nav` elements, header links and sidebar, each need a distinct `aria-label`.
- **One `h1`.** The W3C tutorial calls rank 1 "the most important heading". Its examples make it the content heading, not the site name. It says "Skipping heading ranks can be confusing and should be avoided" (READ, [W3C tutorial, headings](https://www.w3.org/WAI/tutorials/page-structure/headings/)). INFERRED: the shell never renders the `h1`. The lockup is a link, not a heading. The page inside `<main>` owns its `h1`.
- **The sidebar toggle is a disclosure.** A button with `aria-expanded` true or false; `aria-controls` optional; Enter and Space toggle it. Escape is **not** part of the disclosure pattern (READ, [APG, disclosure](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/)).
- **The mobile sheet is a modal dialog.** Escape closes it. Tab and Shift+Tab cycle inside it. Focus returns to the opener on close. `aria-modal="true"` only when the outside is truly blocked and obscured (READ, [APG, modal dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)). Bits UI's Dialog, which the sheet is built on, closes on Escape, traps focus and returns focus to "the element that triggered its opening" by default (READ, [Bits UI, Dialog](https://bits-ui.com/docs/components/dialog)). INFERRED: shadcn's trigger opens the sheet through shared state, not through the dialog's own trigger, so the return of focus must be tested.
- **The shortcut.** SC 2.1.4 (A) covers only single printable-key shortcuts. "Inadvertent strings… are not interpreted as shortcuts if a modifier key is required" (READ, [Understanding 2.1.4](https://www.w3.org/WAI/WCAG22/Understanding/character-key-shortcuts.html)). So Ctrl or Cmd with B passes. INFERRED: Ctrl+B opens the bookmarks sidebar in Firefox and means bold in rich-text editors. A block that hosts an editor must think about it.
- **Sticky header.** It risks SC 2.4.11. `scroll-padding-top` equal to its height is the fix (READ, Understanding 2.4.11, C43).
- **Current page.** INFERRED: the active nav link carries `aria-current="page"`, so its state is not told by the `sidebar-accent` inset alone (decisions.md: state never by colour alone).
- **The rail.** It is 16 px wide and mouse-only (READ, the clone). It passes SC 2.5.8 through the "equivalent" exception only if the trigger button stays on screen and meets 24 px (INFERRED).

### 1.3 What the design book binds (READ unless marked)

- **Grounds.** The sidebar is a ground: `sidebar` is `paper` in light and `ink` in dark, "set apart by a groove, not a tint" (`001` decision 8). The header and footer are paper. `sidebar-accent`, the inset, is only for hover and selected rows.
- **The groove.** The book's own section dividers and footer are its reference: a 1 px ink hairline at 10% with a 1 px raised line beneath (v2 lines 51 and 217; §05 line 535). INFERRED: the header's bottom edge and the footer's top edge are grooves.
- **The lockup sits top-left in the header.** v2 does not say where it sits. NN/g says to "place the logo prominently in the top-left corner" (READ, [NN/g, homepage principles](https://www.nngroup.com/articles/homepage-design-principles/), Huei-Hsin Wang, 2024-03-15).
- **Minimum size.** "Below 20 px of lockup height, use the mark alone" (v2 §02, line 361). INFERRED: the 48 px icon rail and the narrow mobile header show the mark alone, labelled.
- **Clearspace.** "One dot-pair height on all sides of any lockup" (v2 §02, line 356).
- **The footer.** "Every page: build commit hash, build date, doc ID, link to the site's own source, and one plain sentence: 'Pluto Systems is a public benefit corporation.' Stated as fact, never a badge" (v2 §07, line 586). The book's own footer is the lockup at 20 px beside mono lines, under a groove (v2 lines 217–220, 702).
- **The dating rule.** "No public surface without a visible last-updated date" (v2 §07, line 596).
- **No blur.** A sticky header must be opaque (v2 §09, line 651).
- **Shadows.** The mobile sheet is a dialog, so it may carry elevation (v2 §05, line 539). The sidebar on desktop may not.
- **Motion.** Sidebar collapse and the sheet's slide are micro-feedback, at most 200 ms (v2 §06, line 563). shadcn animates the sidebar's width over 200 ms, linear (READ, the clone, `sidebar.svelte`), which fits.
- **Gaps the book does not cover** (INFERRED):
  - **A vertical groove.** The groove is drawn as a top border with a highlight beneath (`001` decision 13). A sidebar's edge needs a vertical form. Which side takes the highlight is undecided.
  - **The doc ID in the footer.** The scheme is still an open owner call (handoff.md; `001` decision 28).
  - **The sheet's scrim.** v2 says nothing about the dimmed overlay behind a modal sheet, and bans blur.
  - **Whether the header mark animates.** "One per page" is clear for a page load. It is unclear after client-side navigation, and when a hero below also holds the mark.

### 1.4 Responsive behaviour

- **Below 768 px** (`md`) the sidebar becomes a sheet opened from a header button (READ, the clone). Carbon folds header links into the same panel (READ).
- **At 768 px and above** the sidebar is inline, collapsible to off-canvas or a 48 px icon rail (READ, the clone).
- INFERRED: at 320 px the header holds the mark alone, the menu button and at most one utility. Utilities beyond that move into the sheet.
- INFERRED: the footer's mono lines wrap to a single column below `sm`. The book's footer row already wraps (v2 line 218, `flex-wrap:wrap`).

## 2. The hero, call to action and feature grid

### 2.1 The converged pattern (READ)

Sources: [NN/g, homepage principles](https://www.nngroup.com/articles/homepage-design-principles/) (2024-03-15); [NN/g, "Get Started" stops users](https://www.nngroup.com/articles/get-started/) (Aurora Harley and Kim Flaherty, 2017-08-20); [GOV.UK, start using a service](https://design-system.service.gov.uk/patterns/start-using-a-service/); [Geist, grid](https://vercel.com/geist/grid.md); v2's own cover (lines 228–243). shadcn's blocks pages list no hero or marketing blocks. Their categories are Featured, Sidebar, Login and Signup on ui.shadcn.com, plus OTP and Calendar on shadcn-svelte.com (READ, [ui.shadcn.com/blocks](https://ui.shadcn.com/blocks); [shadcn-svelte.com/blocks](https://www.shadcn-svelte.com/blocks)). Carbon for IBM.com's lead-space guidance is restricted to IBM staff. A public fragment says it "always sits at the top of the page" and helps users anticipate the content (READ, search result, Carbon for IBM.com example page). It is too thin to rely on.

**What they agree on.**

- **Order:** an optional short label above (an eyebrow); the headline that says what the product does; one supporting sentence; the primary call to action; an optional secondary action as a plain link; then evidence. GOV.UK asks for "key facts most users need first, such as cost and roughly how long it takes" (READ, GOV.UK). NN/g asks for a "concise tagline" stating unique value, in "user-friendly language" (READ, NN/g homepage).
- **The call to action names its result.** GOV.UK: a label that matches the action, such as "Start now" or "Sign in", with secondary calls as standard links. NN/g: avoid "Click Here", "Explore", "Learn More"; "Get Started" sends people into funnels before they know what is offered (READ, both NN/g articles).
- **Real content, not decoration.** NN/g wants "informative images" and "specific samples of your offerings". Large full-bleed images create a "false floor", where visitors think nothing follows (READ, NN/g homepage).
- **The hero is static.** "Keep the logo, tagline, and main headline static and immediately visible, without animation." "Minimize motion" (READ, NN/g homepage).
- **The feature grid reflows by breakpoint.** Geist's examples use 1, 2 and 3 columns across breakpoints. Its rule lines are `aria-hidden`, tab order matches reading order, and guide contrast is checked at 3:1 in both themes (READ, Geist grid).

**Where they differ.** GOV.UK's start page is functional: facts, then a button. Marketing heroes add imagery. Geist draws visible rule lines between cells; most systems use cards or bare whitespace.

### 2.2 Accessibility rules

- **The headline is the page's `h1`** (READ, W3C headings tutorial, §1.2 above).
- **Link or button.** INFERRED from HTML semantics: a call to action that goes to another page is a link styled as a button, not a `<button>`.
- **Link purpose.** INFERRED: a specific label serves SC 2.4.4 (link purpose in context) as well as the NN/g advice. Not fetched today.
- **Feature items.** INFERRED: a list (`ul`) whose items each carry a heading one rank below the section's. A wholly clickable card holds one link, which gets the focus ring.
- **Images and video.** Decorative images get empty `alt`. Video that plays by itself for over five seconds needs a pause control (READ, Understanding 2.2.2).
- **Motion.** The mark's entrance is interaction-free motion. Under reduced motion it shows the composed end state (READ, v2 §06, line 564; `001` decision 14).

### 2.3 What the design book binds (READ unless marked)

- **Display type.** 44 px, Plex Sans 700, −3% tracking, "One per page, Ink only" (v2 §04, line 491). "Headings and hero copy are always Ink, never a brand color" (§03, line 422).
- **One accent.** The primary call to action spends blue. Nothing else in the hero spends colour, except the mark (§01 law 2).
- **The one hello.** The orbit-assemble entrance is "one per page… ≤ 900 ms total, ease-out, reading order. This page's cover is the reference" (§06, line 562). v2's cover sets the lockup at `clamp(56px, 11vw, 110px)` (line 101) and runs its keyframes only under `prefers-reduced-motion: no-preference` (lines 105–113). One delight slot per view, held by the mark (§01, line 285).
- **No tinted sections.** The hero and grid sit on paper or raised white, never a tint (§03, line 438).
- **Feature icons.** "No colour as decoration" (§03). INFERRED: icons are ink or ink-soft, monochrome. The four dots as bullets would put the four colours together outside the mark, which §03 forbids.
- **Every element earns its place.** It must "inform, orient, or delight" (§01 law 4). INFERRED: a feature tile with no claim a reader can check is cut.
- **Terminal cosplay.** "No fake prompts as marketing copy, no blinking-cursor headlines." "Real terminal output in real docs is welcome" (§09, line 650). INFERRED: for `wasi-python-dev`, a hero that shows a real run's real output is allowed. A typed-out fake prompt is not.
- **Spacing.** Layout steps are 32 and up (§05). v2's own sections are 96 px apart, divided by a groove (line 51).
- **Gaps** (INFERRED):
  - **Display at phone width.** The scale has one display step, 44 px, and the next is 28. v2's own `h2` uses a fluid `clamp(24px, 4vw, 32px)` (line 43), which is off its own scale. The specification must decide whether the display stays 44 px at 320 px or steps down to 28.
  - **Where the mark sits in the hero** when the header already holds the lockup. Two lockups on one screen may break "one full-palette moment".
  - **Hero imagery.** v2 has no rule for screenshots or illustrations.

### 2.4 Responsive behaviour

- INFERRED from Geist and Tailwind's breakpoints: the grid is 1 column below `sm`, 2 from `sm` or `md`, 3 from `lg`.
- INFERRED: a split hero, with copy beside a visual, stacks below `lg`, copy first.
- INFERRED: the text column is capped at 60–75 ch (v2 §04) and the page at 960 px plus gutters (v2 line 39).
- INFERRED: calls to action go full width below `sm`, primary first.

## 3. Sign in

### 3.1 The converged pattern (READ)

Sources: the clone's `login-01` to `login-05` and `otp-01` to `otp-05`; [Carbon, login pattern](https://carbondesignsystem.com/patterns/login-pattern/); [GOV.UK, password input](https://design-system.service.gov.uk/components/password-input/), [validation](https://design-system.service.gov.uk/patterns/validation/) and [error summary](https://design-system.service.gov.uk/components/error-summary/); [web.dev, sign-in form best practices](https://web.dev/articles/sign-in-form-best-practices) (Sam Dutton, updated 2020-06-29); [Primer, forms](https://primer.style/product/ui-patterns/forms/).

**shadcn-svelte's five login blocks** (READ, the clone):

- A card or bare column holding: a title ("Login", "Welcome back"), a description, email, password with a "Forgot your password?" link beside its label, the submit button, then social logins ("Login with Google", "Continue with Apple") under an "Or continue with" divider, then "Don't have an account? Sign up". Some add terms and privacy links below.
- `login-05` asks for the email only, with social buttons; no password.
- Layouts: centred column capped at `max-w-sm` (384 px) on `login-03` and `-05`; split screen with an image at `lg` (`login-02`, `lg:grid-cols-2`, form `max-w-xs`); card with image widening to `md:max-w-3xl` (`login-04`).
- **`login-03` and `login-04` put the page on `bg-muted`** (READ, their `+page.svelte`). ui.shadcn.com describes `login-03` as "a sign-in page with a muted background" (READ). That is forbidden here (§0.2).
- Every block uses `type="email"`, `type="password"` and `required`. Labels are visible, with a placeholder `m@example.com` as well.
- **None sets `autocomplete`.** EXECUTED: `grep -c autocomplete` over all `blocks/*/components/*.svelte` returned 0 for every file.
- **`login-01` and `login-03` have no `h1`.** Their title is a card title. EXECUTED: `grep -rl '<h1'` matched `login-02`, `-04` and `-05` only.
- The OTP blocks use Bits UI's PinInput. It keeps one hidden real input under the visible cells, accepts paste and supports a `pattern` (READ, [Bits UI, PinInput](https://bits-ui.com/docs/components/pin-input)). Its page does not mention `autocomplete="one-time-code"` or `inputmode`. EXECUTED: neither appears in the clone's `ui/input-otp/`.

**Carbon's login** (READ):

- Order: title "Log in"; optional "Create account" link; the user ID, usually an email, with "Continue"; optional "Remember ID"; optional alternative logins in priority order; "Need help?"; "Forgot username/password".
- **Two steps.** The password comes on a second step, so the system can route to single sign-on.
- Errors: client errors inline on blur or click. Server errors reload the page, **clear the password**, and return focus to the ID field. **Wrong ID and wrong password share one message**, so valid accounts are not exposed.
- Layout: centred, or split screen with minimal marketing content on one side.

**Where they agree.**

- Visible labels above the inputs; email as the identifier; a forgot-password link; a link to create an account; one specific submit label ("Sign in", "Log in"; web.dev: "Name the action… instead of a generic label like 'Submit'").
- A generic message for wrong credentials (Carbon; GOV.UK password input: "don't reveal whether the username or password was wrong, and clear the password field").
- Hide the password by default, with a show/hide button (GOV.UK; web.dev).

**Where they differ.**

- **One step or two.** shadcn and GOV.UK show both fields together. Carbon and web.dev's mobile advice split them.
- **When to validate.** GOV.UK: only on submit, never on blur or while typing. Carbon: on blur. Primer: on submit, then inline once a submit has failed.
- **Social login.** Central in shadcn. Absent from GOV.UK.
- **Required marks.** Primer exempts login forms: "validation communicates the requirement". GOV.UK adds `novalidate` and no `required`, and validates on the server.

### 3.2 Accessibility rules

- **Autocomplete tokens.** SC 1.3.5 (AA) makes the purpose of fields about the user programmatically determinable. HTML's `autocomplete` is the sufficient technique, H98 (READ, [Understanding 1.3.5](https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose.html)). The HTML standard defines (READ, [WHATWG, autofill](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html)):
  - `username`: "A username."
  - `email`: "Email address."
  - `current-password`: "The current password for the account identified by the username field (e.g. when logging in)."
  - `new-password`: "A new password (e.g. when creating an account or changing a password)."
  - `one-time-code`: "One-time code used for verifying user identity."
  - `webauthn`: a token, not a field name, that asks the browser to "show public key credentials available via conditional mediation", that is, to offer passkeys in the field's autofill.
  - web.dev uses `username` on the email field of a sign-in form and `current-password` on its password (READ).
- **Accessible authentication.** SC 3.3.8 (AA): "A cognitive function test (such as remembering a password or solving a puzzle) is not required for any step in an authentication process" unless there is an alternative without one, a mechanism that helps, object recognition, or recognition of the user's own content. A cognitive function test is "a task that requires the user to remember, manipulate, or transcribe information". Name, email and phone number are not such tests (READ, [Understanding 3.3.8](https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html)).
  - **Allowed:** password entry by password managers, which counts as the helping mechanism; copy and paste; email link sign-in (G218); WebAuthn, hardware keys and operating-system sign-in.
  - **Forbidden:** blocking password managers or paste; a verification code that must be transcribed by hand; a CAPTCHA with no non-cognitive alternative. The page notes that a code split into digit boxes that rejects a single paste fails.
- **Error identification.** SC 3.3.1 (A): an automatically detected error identifies the item and describes the error "in text". Colour may add to text, not replace it (READ, [Understanding 3.3.1](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html)).
- **Error suggestion.** SC 3.3.3 (AA): give a known correction "unless it would jeopardize the security or purpose of the content" (READ, [Understanding 3.3.3](https://www.w3.org/WAI/WCAG22/Understanding/error-suggestion.html)). INFERRED: this exception is why a failed sign-in may say only that the email or password is wrong.
- **The error summary and focus.** GOV.UK puts the summary at the top of `main`, above the `h1`, headed "There is a problem". Each entry links to its field and matches the inline message. **Focus moves to the summary** on a failed submit. The page title gets the prefix "Error: " (READ, GOV.UK error summary and validation). Primer uses a summary banner only for three or more errors, focuses it, and otherwise focuses the first invalid field. It connects messages with `aria-describedby`, sets `aria-invalid="true"`, and says "Don't use live regions for validation" (READ, Primer forms). Carbon returns focus to the ID field after a server error (READ).
- **Password toggle.** GOV.UK's toggle uses `aria-controls` and the label "Show password". It sets `spellcheck="false"` and `autocapitalize="off"` (READ).
- **One-time codes.** Use one text input with `inputmode="numeric"`, `autocomplete="one-time-code"` and a `pattern`, never `type="number"` (READ, [web.dev, SMS OTP form](https://web.dev/articles/sms-otp-form)). It must accept paste (READ, Understanding 3.3.8).
- **Target size and focus** as §0.1. The "Forgot your password?" link sits inline beside a label and qualifies for the inline exception only if it is really in a sentence (INFERRED).

### 3.3 What the design book binds (READ unless marked)

- **Ground.** The page is paper. The form may sit in a raised card. Never `muted` as the page ground, as shadcn's `login-03` and `-04` do (decisions.md).
- **Inputs keep visible borders and labels** (§09, line 655). The input border is the `input` token, 3:1 on every ground (`001` decision 8).
- **Red says the error.** It is the text-safe `destructive` token for message text, and never alone: text, plus an icon or the field's `aria-invalid` styling (`001` decision 8; decisions.md).
- **Green says success**, such as "Check your email", in `success` text with a text cue.
- **One accent.** The submit button spends blue. Social-login buttons are secondary, with borders, not brand colours (§01 law 2; INFERRED for the social buttons).
- **The lockup above the form.** v2 does not say. INFERRED: the lockup at the top of the column, or in the app shell's header if the shell wraps the page. Not both.
- **Motion.** The submit button's pending state is micro-feedback, at most 200 ms to appear (§06).
- **Gaps** (INFERRED): third-party logos inside social buttons carry their own colours, which a single-accent surface cannot hold. v2 does not cover them. The specification decides: no social login in the first set, or monochrome marks.

### 3.4 Responsive behaviour

- The form column is capped near 384 px (`max-w-sm`) at every width (READ, the clone). Below that, it fills the screen with a 24 px gutter (INFERRED, v2 line 39).
- A split-screen variant shows its second panel only from `lg` (READ, `login-02`).
- web.dev warns to keep the submit button clear of the on-screen keyboard (READ).

## 4. Sign up

### 4.1 The converged pattern (READ)

Sources: the clone's `signup-01` to `signup-05`; [GOV.UK, create accounts](https://design-system.service.gov.uk/patterns/create-accounts/) and [password input](https://design-system.service.gov.uk/components/password-input/); [web.dev, sign-in form best practices](https://web.dev/articles/sign-in-form-best-practices); [Carbon, forms](https://carbondesignsystem.com/patterns/forms-pattern/).

- **shadcn's sign-up blocks** ask for full name, email, password and **confirm password**, with helper text ("Must be at least 8 characters long.") below the field. Then the button, social sign-up, "Already have an account?" and terms (READ, the clone). `signup-05` asks for the email only. EXECUTED: no `autocomplete` on any field.
- **GOV.UK:**
  - Ask for an account only when users must come back to their data, and let them do as much as possible first.
  - Say "Create an account", not "Register" or "Sign up".
  - Label new credentials "Create a password".
  - Keep the screen free of distractions. Make it clearly different from signing in; putting the two options side by side "isn't enough".
  - Avoid CAPTCHAs.
  - (all READ, create accounts)
- **No confirm field.** GOV.UK: a confirm-password field "isn't necessary", since the show/hide toggle lets users check (READ, password input). web.dev: "Don't make users re-enter emails or passwords" (READ).
- **Rules up front.** web.dev: show password rules before typing, tied to the field with `aria-describedby` (READ). GOV.UK: if length is restricted, say so with a validation message, never a silent `maxlength` (READ).

**Where they differ.** shadcn keeps the confirm field. GOV.UK and web.dev drop it. shadcn asks for a full name; GOV.UK asks only for what the service needs. Success: none of the shadcn blocks shows a post-submit state. The usual next screen is "check your email" (INFERRED; GOV.UK has a separate "confirm an email address" pattern, not read today).

### 4.2 Accessibility rules

- Everything in §3.2, with `new-password` on the password and `email` (or `username`) on the identifier (READ, WHATWG; web.dev).
- **Redundant entry.** SC 3.3.7 (A): information already entered in the same process is filled in again or offered for selection, except when re-entry is essential, needed for security, or no longer valid. The security exception covers a new password the user typed and cannot see: "having users re-validate their new string is allowed" (READ, [Understanding 3.3.7](https://www.w3.org/WAI/WCAG22/Understanding/redundant-entry.html)). So a confirm field is allowed by WCAG, and discouraged by GOV.UK and web.dev.
- **Multi-step sign-up.** A "process" spans steps and domains (READ, Understanding 3.3.7). INFERRED: an email entered on step one is shown again, not asked again, on the verification step.
- **A verification step** follows §3.2's one-time-code rules, or uses an email link (G218).

### 4.3 What the design book binds

As §3.3. INFERRED additions: the helper text is `muted-foreground` (`ink-soft`), the body size. A strength meter that colours itself red, amber and green would spend three colours on one surface and tell state by colour. v2 does not cover strength meters.

### 4.4 Responsive behaviour

As §3.4.

## 5. The chat pane

The conversation view, composer, code output, streaming state and empty state.

### 5.1 The converged pattern (READ)

Sources:

- the clone: `examples/chat-demo.svelte`, `ui/message-scroller/`, `ui/message/`, `ui/bubble/`, `ui/code-block/` and the primitive `packages/primitives/src/lib/message-scroller/message-scroller.svelte.ts`;
- the Vercel AI SDK: [chatbot guide](https://ai-sdk.dev/docs/ai-sdk-ui/chatbot), [AI Elements Conversation](https://elements.ai-sdk.dev/components/conversation) and [Prompt Input](https://elements.ai-sdk.dev/components/prompt-input);
- [MUI X Chat, composer](https://mui.com/x/react-chat/headless/composer/);
- [Telerik, chat accessibility](https://www.telerik.com/design-system/docs/components/chat/accessibility).

**Structure, top to bottom.**

- **A header.** It holds the thread title and actions such as reset or new chat. The clone's demo has "New Thread", a one-line description and a reset icon button with an `aria-label` and a tooltip, disabled while busy.
- **The message list.** It is a scroll container that **sticks to the bottom** as content arrives, with a **"scroll to bottom" button** that appears when the user scrolls up (READ, AI Elements Conversation; the clone's message scroller).
  - The clone's primitive names its viewport `role=region`, `aria-label="Messages"`, `tabindex=0`, so keyboard users can scroll it.
  - It gives the content `role=log` and `aria-relevant="additions"` by default.
  - It makes the scroll button `inert` and `tabindex=-1` while already at the bottom: "no ghost focus stops".
  - Its examples set `aria-busy` on the content while a reply is pending.
- **The empty state.** It sits in the list's place before any message. AI Elements: a title ("No messages yet"), a description and an optional icon. The clone's demo: an icon, "What should we build?" and a one-line prompt.
- **The composer.** A form with a growing textarea, a send button, and optional attachment and model controls.
  - **Enter sends; Shift+Enter adds a line.** AI Elements, MUI, Telerik and the clone's demo all agree.
  - AI Elements' textarea grows between a minimum and a maximum height. MUI's starts at `minRows`.
  - **The send button changes with status**: submitted, streaming, error (AI Elements). MUI disables it while streaming or empty.
  - The clone's demo labels the textarea "Message" with `aria-label` only, plus a placeholder. It labels the icon-only send button with visually hidden "Send".
- **Status.** The AI SDK names four states (READ, chatbot guide):
  - `submitted`: show a spinner and a stop button;
  - `streaming`: show a stop button;
  - `ready`: enable the input;
  - `error`: show a generic message, not raw server details, and a retry button.
  - `stop` aborts the request. `regenerate` reruns the last message.
- **Code output.** The clone's code block copy button announces "Copied" through a visually hidden `aria-live="polite"` span (READ, `ui/code-block/code-block-copy-button.svelte`).

**Where they differ.**

- **Message roles.** The clone ships two shapes, `message` (avatar, header, content, footer) and `bubble` (grouped bubbles with reactions). INFERRED from them: the common split is user turns in a bubble and assistant turns as full-width prose.
- **Messages as focusable items.** Telerik makes each bubble focusable, with arrow keys, Home and End moving between them. The others leave messages as plain reading content.
- **Stop.** AI Elements turns the send button into stop. **The clone's demo has no stop control** (EXECUTED: no `stop` in `chat-demo.svelte`). MUI's page does not mention one.
- **IME.** MUI says Enter "does not submit while an IME is composing". **The clone's demo checks only `key === "Enter"` and `!shiftKey`** (READ, `chat-demo.svelte`). AI Elements' page does not say.
- **Disabling.** MUI and the AI SDK disable sending unless ready. Atlassian and Primer say never to disable a form's submit button (READ, [Atlassian, form](https://atlassian.design/components/form/usage); [Primer, saving](https://primer.style/product/ui-patterns/saving/)). Chat convention and form convention disagree.

**ChatGPT and Claude.ai** (READ, weak).

- OpenAI's help centre lists ⌘ or Ctrl with `/` for the shortcut list and ⌘ or Ctrl with K for search. A macOS app release note adds "Command + ." to stop a streaming reply (READ, search-result text from help.openai.com. The release-notes page itself returned 403 when fetched).
- No first-party page for claude.ai shortcuts was found. Third-party guides mostly say Escape stops a reply and disagree on the rest (READ, search results). We rely on neither.

### 5.2 Accessibility rules

**The list's role.**

- `log`: "new information is added in a meaningful order"; its implicit `aria-live` is `polite` and `aria-atomic` is `false`; examples include "chat logs, messaging history". **A log requires an accessible name** (READ, [MDN, log role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/log_role)). MDN advises adding a redundant `aria-live="polite"` to `log` and `status` for compatibility (READ, MDN live regions).
- Telerik uses `role=log` with an `aria-label` and `aria-live=polite` (READ). So does the clone's primitive (READ).
- INFERRED: a plain list (`ol`) gives item counts and list navigation, but announces nothing. A `log` that is also navigable by heading or article gives both. The choice is open (§8).

**Streaming and politeness.**

- **The problem.** A `log` or polite region around text that grows token by token asks the screen reader to speak each change. One project reported that NVDA and JAWS abandoned and restarted the utterance on each change, so long replies came out as clipped fragments (READ, search results summarising GitHub issues and pull requests, e.g. [d-oit/do-knowledge-studio #887](https://github.com/d-oit/do-knowledge-studio/issues/887) and [#926](https://github.com/d-oit/do-knowledge-studio/pull/926)). That evidence is one project's report, not a cross-reader test.
- **What is converged on.**
  - Let tokens appear silently.
  - Announce the finished reply once, or in sentence-sized batches.
  - Announce state changes ("responding", "stopped", "response complete") through a separate, visually hidden polite `status` region.
  - (READ, [accessibility.build, accessible AI chat](https://accessibility.build/guides/accessible-ai-chat), Khushwant Parihar, updated 2026-08; the same GitHub write-ups.)
- **Two mechanisms.**
  - (a) `aria-busy="true"` on the streaming message, or the log, until done. Assistive technology "should wait until the modifications or changes are complete before exposing the content" (READ, [MDN, aria-busy](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-busy)). The clone's examples do this (READ).
  - (b) A log with `aria-live="off"` during streaming plus an explicit status announcement (READ, search results).
  - accessibility.build warns that a bare `aria-busy` spinner "usually announces nothing useful" (READ).
- **Why polite, not assertive.** Assertive interrupts whatever is being read (READ, MDN live regions). 4.1.3 lists assertive on non-urgent content as a failure (READ, Understanding 4.1.3). A streamed reply is neither urgent nor time-sensitive (INFERRED). An error that halts the conversation may be assertive (READ, accessibility.build).

**Stop.**

- A named, focusable stop button is available the whole time a reply streams (READ, accessibility.build; AI SDK).
- INFERRED: SC 2.2.2 asks for a way to stop auto-updating content "presented in parallel with other content" that "starts automatically". A reply started by the user's send may not count as starting automatically, but a stop control satisfies the criterion either way. Its Note 3 says streamed content need not be replayed after a pause (READ, Understanding 2.2.2).

**Focus.** Keep focus in the composer after send. Do not move it to the reply. Offer a way to jump to the latest reply (READ, accessibility.build).

**The composer.**

- A `textarea` with a label. A visible label or visible instructions serve 3.3.2. An `aria-label` alone gives a name but not a label shown to all (READ, Understanding 3.3.2 glossary). INFERRED: the clone's demo, with `aria-label` and a placeholder, may fall short of 3.3.2.
- A **visible send button** is still required, because Enter-to-send cannot be discovered (READ, accessibility.build).
- **IME guard:** do not send when `event.isComposing` is true **or** `keyCode` is 229. Safari has fired the confirming Enter with `isComposing` false (WebKit bug 165004). Tracking `compositionend` does not help, because it fires before that keydown (READ, [azukiazusa, IME and Enter-to-submit](https://azukiazusa.dev/en/blog/ime-enter-submit), 2026-09-06).
- INFERRED: Shift+Enter is handled before the IME check, as one project's fix found (READ, search result citing an opencode pull request).
- Escape inside the composer is free unless a menu is open. INFERRED: binding it to stop while streaming matches third-party reports of Claude.ai, and conflicts with nothing in the APG patterns read.

**Sticky composer.** It can hide a focused link in the log. Use `scroll-padding-bottom` (READ, Understanding 2.4.11, C43).

**Reduced motion.**

- Turn off the typing indicator's animation under `prefers-reduced-motion`, and keep a static text fallback that meets contrast (READ, accessibility.build).
- `001` decision 14 already clamps all animation (READ).
- INFERRED: smooth auto-scroll becomes instant under reduce. `001`'s catch-all sets `scroll-behavior: auto`, but scrolling started by script with `behavior: "smooth"` is not covered by that rule.

**Code output.**

- Code may scroll sideways inside its own box where wrapping would change meaning, such as Python indentation (READ, Understanding 1.4.10).
- INFERRED: the scrolling box must be keyboard-focusable (`tabindex=0`, with a name) so keyboard users can scroll it.
- The copy button announces politely (READ, the clone).

**Headings inside replies.** INFERRED: rendered markdown in a reply can contain `h1`s. The block should demote reply headings below the page's own, to keep one `h1` (W3C headings tutorial).

**Target size.** Send, stop, attach and copy icon buttons are at least 24 px (SC 2.5.8).

### 5.3 What the design book binds (READ unless marked)

- **Grounds.** The log sits on paper. A user bubble could be raised white. `muted` is allowed for **code grounds** (decisions.md).
  - But v2 §03 says Ink is for "all text, **code grounds**, the icon field" (line 405). So v2 puts code on ink, and decisions.md lists `muted` for code grounds.
  - INFERRED: these are two readings of where code sits. The specification must pick one, or one per context: real run output on ink, inline snippets on `muted`.
- **Terminal output is welcome, costume is not** (§09, line 650). INFERRED:
  - Real output from a real run, shown as it is, passes.
  - No phosphor green, no fake prompt glyph, no blinking block cursor.
  - "No blinking-cursor headlines" is about headlines. A blinking cursor at the end of streaming text is also a looping animation, banned by §06.
- **Motion.**
  - "Anything that moves while the visitor is reading" and "ambient/looping animation" are banned (§06, line 565).
  - Text arriving is content, not decoration (INFERRED). A looping "thinking" indicator, three pulsing dots or a shimmer is a loop.
  - INFERRED options: a static "responding" label with a static mark; or an indicator that changes only when tokens arrive. Under reduced motion it is static anyway.
- **The mark as avatar.** "The mark alone is the favicon, avatar, and app icon" (§02, line 362). That is Pluto's own avatar.
  - INFERRED: whether an assistant inside a Pluto product may speak under the mark is a brand call v2 does not make.
  - In dark, the mark is all paper (`001` decision 8).
  - A round avatar for the user is full-round, which v2 allows "for dot-derived elements only" (line 527). A user avatar is not dot-derived. **Gap.**
- **Never `::` as code syntax** (§09). INFERRED: the mark never appears inside a code block or prompt.
- **Colour.**
  - Send is the one accent, blue.
  - Stop is the open question. v2's roles say "red stops" (line 430). But red is for "errors, destructive actions, incident states" (line 393), and stopping a reply destroys nothing.
  - INFERRED: stop is a secondary, bordered button, not red. The specification decides.
  - An error reply uses `destructive` text with an icon and a retry button.
- **No decorative gradients.** The clone's viewport uses a `scroll-fade-b` class, a fade at the bottom edge (READ, `ui/message-scroller/message-scroller-viewport.svelte`). INFERRED: a fade is a gradient, banned as decoration by §05 ("no decorative gradients"). A groove at the composer's top edge replaces it.
- **Honest pixels.** The composer is a bordered raised box, not a floating card with a shadow (§05, line 539).
- **Gaps** (INFERRED):
  - **Message alignment and bubble style.** v2 has no conversational surfaces.
  - **The streaming indicator.** See above.
  - **Timestamps.** The dating rule (§07) is about public surfaces, not messages.

### 5.4 Responsive behaviour

- INFERRED: on phones the pane is full-bleed. No outer card. The header, log and composer fill the viewport, with the composer pinned to the bottom above the on-screen keyboard. That needs the dynamic viewport unit (`dvh`) or the visual viewport, a detail the specification should test on iOS Safari.
- INFERRED: from `md` the pane can sit inside the app shell beside the sidebar. The log's text column is capped at 60–75 ch (v2 §04) even when the pane is wide.
- Code blocks scroll sideways inside themselves (READ, Understanding 1.4.10), so the page never does.

## 6. Page states: empty, error, not found, loading

### 6.1 The converged pattern (READ)

Sources:

- [GOV.UK, page not found](https://design-system.service.gov.uk/patterns/page-not-found-pages/) and [there is a problem with the service](https://design-system.service.gov.uk/patterns/problem-with-the-service-pages/);
- Carbon's [empty states](https://carbondesignsystem.com/patterns/empty-states-pattern/) and [loading](https://carbondesignsystem.com/patterns/loading-pattern/);
- [Atlassian, empty state](https://atlassian.design/foundations/content/designing-messages/empty-state);
- Shopify Polaris' [`s-empty-state`](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/empty-state.md), via search result;
- Geist's [empty state](https://vercel.com/geist/empty-state.md), [error](https://vercel.com/geist/error.md) and [skeleton](https://vercel.com/geist/skeleton.md);
- [Primer, empty states](https://primer.style/product/ui-patterns/empty-states/);
- NN/g on [empty states](https://www.nngroup.com/articles/empty-state-interface-design/) (Kate Kaplan, 2021-09-19), [skeleton screens](https://www.nngroup.com/articles/skeleton-screens/) (Samhita Tankala, 2023-06-04, reviewed 2026-09-02) and [response times](https://www.nngroup.com/articles/response-times-3-important-limits/) (Jakob Nielsen, 1993, updated 2014);
- the clone's `ui/empty/` (header, media, title, description, content).

**Empty.**

- **Order, agreed by Carbon, Primer, Polaris, Geist and the clone:**
  1. an optional image or icon;
  2. a short title;
  3. one or two sentences of body that do not repeat the title (Atlassian; Geist);
  4. **one** primary action;
  5. at most one secondary action, often a documentation link.
- **Kinds.** Carbon: no data, user action (no results), error. Geist: blank slate, informational, educational, guide. Atlassian: empty state and blank slate. NN/g's three rules: say the system's status, teach the feature, give a direct path.
- **Never say "No records" while still loading** (NN/g).
- **An empty state replaces the element it stands in for.** A table's headers go too (Carbon). Inside a table it spans all columns (Polaris).
- **Tone.** Plain, no jargon or error codes (Carbon; Primer); no jokes (Carbon); celebrate a finished task, scaled to how often it is seen (Atlassian). CTA labels are verb plus noun, never "Get Started", "Continue" or "OK" (Geist; Atlassian).
- **Where they differ: alignment.** Carbon left-aligns the block and centres only in small tiles. Polaris and Geist centre.
- **Where they differ: illustrations.** Carbon's are optional and skipped by screen readers. Primer uses an alert icon for errors and avoids playful images there.

**Not found (404).**

- GOV.UK: title and `h1` "Page not found". Short tips, such as checking the address. A contact link only if it helps.
- **Avoid** "404" or "bad request" in the copy, blame, humour such as "oops", and **red text**. No breadcrumbs.

**Error (500 and section failures).**

- GOV.UK: "Sorry, there is a problem with the service". Try again later. **Say whether the user's answers were saved.** Contact details if useful.
- **Avoid** "500", "We are experiencing technical difficulties", red text and breadcrumbs.
- Geist's Error: state what happened, then what to do. **Avoid apologies and humour.** "Couldn't" or "Can't" for user-state errors, "Failed to" for system errors, never "Something went wrong" as a title.
- For system errors, a stable request ID in mono inside a collapsed `<details>`. A concrete recovery, "Try again", with **no silent auto-retry**. **On full-page errors, move focus to "Try again".** Polite live announcement for async errors, assertive only for blocking ones.
- The AI SDK: show a generic message, not raw server details, which can leak information (READ, chatbot guide).

**Loading.**

- **Nielsen's limits:** under 0.1 s feels instant; under 1 s keeps the flow of thought, and needs no special feedback; past 10 s, attention drifts, so show a percent-done indicator and a way to interrupt (READ, NN/g response times).
- **NN/g on skeletons:**
  - **Under 1 s, show nothing.**
  - **2 to 10 s:** a skeleton for a full page, a spinner for one module.
  - **Over 10 s:** a progress bar with a time estimate.
  - "Frame-display" skeletons, chrome with no content shapes, are not recommended: they read as broken.
  - Animated shimmer "can be distracting or cause accessibility problems".
- **Carbon.** Skeletons for initial loads of containers and data. Not for buttons, inputs, toasts, menus or modals themselves. "Motion is part of the design." Spinners for actions in progress. A progress bar once a wait passes "a moment or two". No millisecond thresholds.
- **Geist.** The skeleton shimmers by default, can be static, and must "respect prefers-reduced-motion". Keep focusable controls out of skeletons. A spinner for a single action. An empty state, not a skeleton, when there is no data.
- **Where they differ: skeleton motion.** Carbon and Geist animate. NN/g warns against it.

### 6.2 Accessibility rules

**Serving a 404.**

- A missing page is served with status **404** (or 410). A page that says "not found" with status 200 is a **soft 404** in Google Search Console. Google treats every 4xx except 429 alike and drops such URLs from its index (READ, [Google, HTTP status codes and network errors](https://developers.google.com/search/docs/crawling-indexing/http-network-errors)).
- SvelteKit's `error(404, …)` sets the status and renders the nearest `+error.svelte`. An unmatched route gets a framework 404. `src/error.html` is the fallback when the root layout itself fails (READ, [SvelteKit, errors](https://svelte.dev/docs/kit/errors)).
- **Unexpected errors are shown as a generic "Internal Error"**: "Unknown error messages and stack traces are not exposed to users". `handleError` may log them and return a custom shape (READ, same page).
- With adapter-static, `fallback: '404.html'` makes a 404 page for hosts that look for one (READ, [SvelteKit, adapter-static](https://svelte.dev/docs/kit/adapter-static)).
- Cloudflare Workers static assets with `not_found_handling = "404-page"` serve "the nearest `404.html` file with a `404 Not Found` status" (READ, [Cloudflare, static site generation](https://developers.cloudflare.com/workers/static-assets/routing/static-site-generation/)).
- This repository's `wrangler.jsonc` sets no `not_found_handling`. Its `vite.config.ts` calls `adapter()` with no `fallback` (EXECUTED, `cat` and `grep`). INFERRED: the not-found block only works as a real 404 once an app's deployment sets both. That belongs to each app's deployment specification, and this registry's.

**What an error page must and must not say** (READ: GOV.UK, Geist, SvelteKit, AI SDK; v2 §07):

- **Must:** what happened, in plain words; what to do next; whether the user's work was saved; a way out, such as home, retry or contact.
- **Must not:** status codes as headings; stack traces or raw server messages; blame; vague apology ("never apologize vaguely", v2 line 590); humour (GOV.UK; Geist).
- **May:** a request ID or build hash in mono, collapsed. INFERRED: that fits v2's structural transparency (§01 law 3, §07's footer).

**Focus and title.**

- Geist moves focus to "Try again" on a full-page error (READ).
- INFERRED: a client-side route change to a 404 or error page should update `<title>` and move focus to the `h1` or the main action. A server-rendered response needs neither, because the page loads fresh.

**Announcing.**

- Loading: a `role=status` region (READ, Understanding 4.1.3). The clone's spinner example uses `role="status"` with `aria-label="Loading"` (READ, `examples/spinner-custom-demo.svelte`).
- `aria-busy="true"` on the region being filled, until it is filled (READ, MDN aria-busy).
- Geist wraps an empty state in `aria-live="polite"` after an async filter change (READ).
- Skeleton shapes are hidden from assistive technology. INFERRED from Geist ("skeletons are decorative") and Carbon (decorative images skipped).

**Long waits.** Past about 5 s, a moving spinner beside other content falls under SC 2.2.2. A preload animation is "essential" only when nothing else can be done (READ, Understanding 2.2.2).

### 6.3 What the design book binds (READ unless marked)

- **The warmest copy.** "Errors, empty states, and 404s carry the warmest copy in the system: Kare put a cartoon bomb on the crash screen. Explain what happened and what to do next; never apologize vaguely" (§07, line 590).
  - That pulls against GOV.UK's and Geist's "no humour".
  - INFERRED: warmth is in plain, kind, specific words, not jokes. The specification states the line.
- **Red.** v2 gives red to "errors, destructive actions, incident states" (§03, line 393). GOV.UK keeps red text off 404 and 500 pages.
  - INFERRED: a not-found page is not an error state of the user's making. It is ink on paper, no red.
  - A section-level failure may use a red state dot (`destructive-fill`) beside ink text, with text that says the state.
- **Green** says "operational" or "passing" (§03, line 401). The status page uses "the four dots as state indicators: all green, the mark is at rest" (§07, line 589). INFERRED: that is a status page, not a page state, and the first set does not include one.
- **Skeletons are the `muted` inset**, the use decisions.md names first. Never `muted` behind the whole page.
- **Illustration.** "No colour as decoration" (§03). "Every element earns its place" (§01). INFERRED: no illustrations. An optional monochrome icon, or the mark at rest, at most. Kare's bomb is cited as tone, not as licence for pictures.
- **Motion.**
  - A skeleton shimmer is a loop. So is a spinner. Both fall under "ambient/looping animation… anything that moves while the visitor is reading" unless the specification reads progress feedback as response, not performance (§06, lines 563, 565).
  - INFERRED: a static skeleton (NN/g's preferred kind) obeys v2 outright. A spinner for an action is response to a press, and ends when the action does.
  - The mark must not become a loader. That would be a second hello, and could imply reordered dots (§02, §09 "motion noise").
- **Gaps** (INFERRED):
  - **Loops.** Whether a functional progress loop is allowed at all.
  - **Copy tone.** Where warmth ends and humour begins.
  - **Request IDs and build hashes.** Whether error pages show them.
  - **Placement.** Whether a page-state block is centred or left-aligned. v2's pages are left-aligned throughout.

### 6.4 Responsive behaviour

- INFERRED: page states are a single column at every width, text capped at 60–75 ch.
- INFERRED: empty states inside small tiles centre their content, per Carbon. Full-page states align with the page's left edge, per Carbon and v2's own layout.
- INFERRED: skeletons mirror the real layout at each breakpoint. A skeleton that reflows differently from the content makes the page jump when content arrives.

## 7. The settings form

### 7.1 The converged pattern (READ)

Sources: [Shopify, settings template](https://shopify.dev/docs/api/app-home/latest/patterns/templates/settings) (Polaris web components) and, via search, Polaris React's older annotated-section layout; [Primer, saving](https://primer.style/product/ui-patterns/saving/) and [forms](https://primer.style/product/ui-patterns/forms/); [Carbon, forms](https://carbondesignsystem.com/patterns/forms-pattern/); [Atlassian, form](https://atlassian.design/components/form/usage); [GOV.UK, validation](https://design-system.service.gov.uk/patterns/validation/).

**What they agree on.**

- **Sections.** One `h1` for the page. Settings are grouped into sections, each with a heading that names the group and a short line saying what it controls (Shopify). Older Polaris put each section's title and description in a left column beside its card, on settings pages only (READ, search result for Polaris' annotated layout).
- **One column of fields.** Labels above, one to three words, sentence case, no colons (Carbon; Atlassian). Helper text below the label (Carbon). Placeholders never carry critical information (Atlassian; Primer).
- **Spacing.** Carbon: inputs 40 px tall; about 32 px between fields on a full page, 16 to 24 px in contained forms; section gaps slightly larger; about 48 px from the last field to the buttons.
- **Required marks on the minority.** "(optional)" when most fields are required (Carbon). Atlassian instead marks required fields with a red asterisk and a legend.
- **One save per form, at the bottom.** Primer: one save button, bottom-left, Cancel to its right; no per-section save; keep it enabled. Carbon: buttons at the bottom; the primary on the left in page forms. Shopify instead shows a **save bar** with Save and Discard whenever the form has unsaved changes.
- **Do not mix saving models.** Toggles and segmented controls save at once; text fields save on submit; never both in one form (Primer).
- **Warn on leaving with unsaved changes** through `beforeunload`, whose text browsers fix (Primer).
- **Destructive actions** such as resetting or deleting sit apart and are confirmed in a modal, with a banner stating the impact (Shopify).
- **Success feedback.** Primer: an inline message when the page does not reload, a banner when it does, and **no toasts** "because of known accessibility issues". Shopify uses a toast.

**Where they differ.** Save bar or bottom button; toast or inline message; left-column annotations or stacked headings; disabling the save button (Carbon disables short forms until valid and during submit; Atlassian and Primer never disable).

### 7.2 Accessibility rules

- Everything in §3.2 on labels, error identification (3.3.1), suggestion (3.3.3), the error summary and focus after a failed submit.
- **Error prevention.** SC 3.3.4 (AA) covers pages that "modify or delete user-controllable data". At least one holds: the submission is reversible; data is checked and the user can correct it; or the user can review and confirm before it is final (READ, [Understanding 3.3.4](https://www.w3.org/WAI/WCAG22/Understanding/error-prevention-legal-financial-data.html)). INFERRED: deleting an account or a key needs a confirm step. Ordinary preference changes are reversible by editing again.
- **Redundant entry.** Current values are shown in the fields, not asked again (READ, Understanding 3.3.7). Changing a password may ask for the current one, under 3.3.7's security exception, with `autocomplete="current-password"`. The new one takes `new-password` (READ, WHATWG).
- **Grouping.** INFERRED: each section is a `fieldset` with a `legend`, or a heading that labels a region, so assistive technology hears the group's name. Radio and checkbox groups always need `fieldset` and `legend`.
- **Toggles.** INFERRED: an instant-save switch announces its new state. Its result, saved or failed, goes to a polite status region, since nothing else tells a screen reader user it saved.
- **Save bar.** A sticky save bar risks SC 2.4.11 for the fields it covers (READ, Understanding 2.4.11).

### 7.3 What the design book binds (READ unless marked)

- **Sections are divided by the groove.** v2's own section dividers are the reference (§05, line 535). INFERRED: grooves between sections, not a card around each, keep the page at paper and ink. Cards are allowed, on raised white, if the specification prefers them.
- **Red is for the destructive section** and its confirm button (§03, line 393). Text plus red, never red alone.
- **Green is for "Saved"**, as `success` text with a text or icon cue.
- **One accent.** The save button spends blue (§01 law 2). Toggles' "on" state is functional state. INFERRED: toggles use blue as the action colour, not green.
- **Interactive elements look pressable** (§05, line 539). Switches and checkboxes keep visible borders (§09, line 655).
- **Motion.** "Saved" appears in at most 200 ms and does not animate further (§06).
- **Gaps** (INFERRED): a save bar is a sticky surface; whether it may carry a shadow (it is not a menu or dialog) is undecided. Section annotations in mono lowercase versus sentence case is the "labels are lowercase" question again.

### 7.4 Responsive behaviour

- INFERRED: a two-column layout, section title and description on the left with fields on the right, from `lg`. Stacked below `lg`.
- INFERRED: the field column is capped near 640 px, close to GOV.UK's two-thirds column on a 960 px page (READ, [GOV.UK, question pages](https://design-system.service.gov.uk/patterns/question-pages/): its examples use a two-thirds column).
- INFERRED: the save and cancel buttons go full width below `sm`, save first.

## 8. INFERRED: what a specification would decide

Each list is the choice, the states it must show, and the questions still open. All INFERRED, from the sections above.

### 8.1 The app shell

- **Structure:**
  - a skip link, first in `<body>`, to `<main id tabindex=-1>`;
  - `<header>` (banner) with the lockup top-left as a link home, product links, utilities right;
  - an optional `<nav aria-label>` sidebar, a paper ground with a vertical groove;
  - `<main>`;
  - `<footer>` (contentinfo) with v2 §07's furniture under a groove.
- **Sidebar behaviour:**
  - collapsible to off-canvas, and to an icon rail only for daily-use apps;
  - the toggle is a button with `aria-expanded` and `aria-controls`;
  - Ctrl or Cmd with B toggles it;
  - the state persists;
  - below `md` it is a modal sheet with Escape, a focus trap, return of focus and a shadow;
  - the active link has `aria-current="page"` plus the `sidebar-accent` inset.
- **Header:** opaque, no blur. If sticky, `scroll-padding-top` matches it. Below the 20 px lockup height, the mark alone.
- **States:** sidebar expanded, collapsed and mobile-open; header with and without a sidebar; focus visible on the skip link.
- **Open:**
  - the vertical groove's form;
  - the doc-ID scheme for the footer (owner call);
  - whether the header mark plays the entrance, and on client-side navigation;
  - the sheet's scrim, given the ban on blur;
  - whether the shortcut conflicts with editor blocks.

### 8.2 The hero and feature grid

- **Structure:** an optional lowercase mono eyebrow; `h1` display (44 px, ink); one supporting sentence; a primary call to action as a link with a specific label; an optional secondary text link; optional real evidence (real output, not a fake prompt). The feature grid is a `ul` of items, each with a heading and one or two sentences and an optional monochrome icon, separated by grooves or whitespace. The text column is capped at 60–75 ch.
- **Motion:** the mark's orbit-assemble as the page's one hello, at most 900 ms, the composed end state under reduce. Nothing else moves.
- **States:** with and without a visual; two and three grid columns; reduced motion.
- **Open:**
  - the display size at 320 px (stay at 44 or step to 28);
  - the mark's place when the header also holds the lockup;
  - hero imagery rules;
  - grid separators (grooves, cards or none).

### 8.3 Sign in

- **Structure:**
  - a centred column capped near 384 px on paper, optionally in a raised card, never on `muted`;
  - an `h1` ("Sign in");
  - email (`type=email`, `autocomplete="username"`), then password (`current-password`) with a show/hide toggle (`aria-controls`, "Show password", `spellcheck=false`, `autocapitalize=off`), with "Forgot password?" by its label;
  - the submit button "Sign in";
  - a link to create an account.
  - **Never block paste or password managers.**
- **Errors:** validate on submit. A form-level `role=alert` box at the top for a credential failure, which cannot name a field ("Email or password is incorrect"). An error summary plus inline messages for field errors. Focus moves to the summary or alert. The title gets the "Error: " prefix. The password is cleared on a credential failure. `aria-invalid` and `aria-describedby` on fields.
- **States:** idle; submitting (the button shows a spinner, and stays enabled with re-submits ignored, or is disabled, per the decision below); field error; credential error; locked or rate-limited; success (redirect).
- **Open:**
  - one step or two;
  - social or passkey sign-in in the first set (and logos versus one accent);
  - `webauthn` in `autocomplete` for passkey autofill;
  - email-link sign-in (G218) as the alternative;
  - disabled or enabled submit while pending;
  - GOV.UK's summary always, or Primer's at three errors or more.

### 8.4 Sign up

- **Structure:** an `h1` ("Create an account"); email (`email`), password (`new-password`) with rules shown before typing and tied by `aria-describedby`; **no confirm field**, the show toggle instead; the submit button "Create account"; a link to sign in.
- **Then:** a verification step, either a one-time code (one input, `inputmode=numeric`, `autocomplete="one-time-code"`, paste accepted) or a "check your email" screen with resend.
- **States:** idle; submitting; field errors (summary plus inline); email already in use (worded so it does not expose accounts, per 3.3.3's security exception); check-your-email success; code entry, code error and resend.
- **Open:**
  - ask for a name or not;
  - code or link verification;
  - whether a strength meter exists (and its colours);
  - terms consent wording and placement.

### 8.5 The chat pane

- **Structure:**
  - a header with title and new-chat action;
  - the message list, a `role=log` with an accessible name, `aria-relevant="additions"` and a redundant `aria-live="polite"`, sticking to the bottom, with a "jump to latest" button that leaves the tab order when at the bottom;
  - messages: user turns in a raised bubble, assistant turns as full-width prose, headings in replies demoted below the page `h1`;
  - code output in a focusable, named, sideways-scrolling block with a copy button announcing "Copied";
  - the composer: a form with a labelled growing textarea (min and max rows), a visible send button and a stop button while busy.
- **Keys:** Enter sends; Shift+Enter adds a line; no send while `isComposing` or `keyCode` 229; Escape stops a streaming reply when no menu is open. Focus stays in the composer after send.
- **Announcing:** tokens are silent (`aria-busy="true"` on the streaming message until done). A separate polite `status` region says "Responding", "Stopped", "Response complete", or reads the finished reply. Errors are polite unless the chat is halted.
- **States:** empty (title, one line, optional suggestions); submitted; streaming; stopped; complete; error with retry (a generic message); long code output; offline or disconnected.
- **Motion:** no looping indicator, or one the specification explicitly licenses. Instant scroll under reduce. No fade gradients.
- **Open:**
  - `log` or plain list, or both;
  - announcing the whole reply or a cue only;
  - code grounds on ink (v2 §03) or `muted` (decisions.md);
  - the stop button's colour;
  - whether the assistant speaks under the mark;
  - the round user avatar against the two-radii rule;
  - disabled versus enabled send;
  - whether the streaming indicator exists at all.

### 8.6 Page states

- **Structure:** one family, one shape. An optional monochrome icon; a heading (`h1` on a full page, the next rank in a section); one or two sentences, what happened and what to do; one primary action; at most one secondary link. Left-aligned on full pages, centred in tiles.
- **Not found:**
  - the `h1` "Page not found", or warmer plain words;
  - no "404" in the copy, no red;
  - a link home and a hint to check the address;
  - **served with status 404**: `error(404)` in SvelteKit, `404.html` plus `not_found_handling = "404-page"` on Cloudflare, owned by deployment.
- **Error:**
  - plain cause and next step;
  - whether work was saved;
  - "Try again" taking focus on full-page errors;
  - optionally a request ID or build hash in mono inside `<details>`;
  - never stack traces or raw server text;
  - no vague apology, no humour.
- **Loading:**
  - nothing under about 1 s;
  - a static skeleton on `muted` for page and container loads, mirroring the real layout and hidden from assistive technology, with `aria-busy` on the region and a polite "Loading" status;
  - a spinner only on the control that started an action;
  - a progress bar with an estimate past 10 s.
- **Empty:** no data; no results (with the query and a way to clear filters); first use. Announced politely after an async change.
- **Open:**
  - whether spinners and shimmers are allowed under v2's ban on loops;
  - the copy tone line ("warmest" versus "no humour");
  - whether error pages show request IDs or build hashes;
  - the alignment rule.

### 8.7 The settings form

- **Structure:**
  - an `h1`;
  - sections divided by grooves, each a `fieldset` and `legend` or a labelled heading, with one line of description;
  - fields in one column, labels above, helper text below, "(optional)" on the minority;
  - one explicit save, bottom-left with Cancel beside it;
  - instant-save toggles kept out of explicit-save forms;
  - a separate destructive section at the end with a confirm dialog (SC 3.3.4).
- **Feedback:** "Saved" as an inline `success` message in a polite status region, not a toast. Errors as for sign in (summary, inline, focus). A `beforeunload` warning on unsaved changes.
- **Password change:** current (`current-password`) and new (`new-password`), no confirm field.
- **States:** pristine; dirty; saving; saved; field error; server error; destructive confirm.
- **Open:**
  - a save bar or a bottom button;
  - two columns from `lg` or always stacked;
  - grooves or cards per section;
  - toast or inline message (Primer's accessibility warning favours inline);
  - toggles in blue or green.

### 8.8 Primitives `002` must cover for these blocks

Read off the structures above; INFERRED.

- **Already named:** textarea, avatar, label, scroll-area (decisions.md), button, badge, card, input, separator, code-block, skeleton, spinner (handoff.md).
- **Added by this memo:**
  - field (label, description and error wiring with `aria-describedby` and `aria-invalid`);
  - an error-summary / alert;
  - password input with show/hide;
  - a one-time-code input;
  - checkbox, switch, radio group, select or native select;
  - sheet (the dialog-based sidebar on mobile);
  - sidebar;
  - dialog, for destructive confirms;
  - empty state;
  - a status / live-region helper;
  - a skip link;
  - kbd, for showing shortcuts;
  - tooltip, for icon buttons;
  - a message scroller or log container for the chat.

## Sources

All web sources read on 2026-10-28. Local sources read the same day.

**W3C and standards**

- [Understanding SC 1.3.5](https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose.html)
- [Understanding SC 1.4.10](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)
- [Understanding SC 2.1.4](https://www.w3.org/WAI/WCAG22/Understanding/character-key-shortcuts.html)
- [Understanding SC 2.2.2](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html)
- [Understanding SC 2.3.3](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)
- [Understanding SC 2.4.1](https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks.html)
- [Understanding SC 2.4.11](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html)
- [Understanding SC 2.4.13](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html)
- [Understanding SC 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [Understanding SC 3.3.1](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html)
- [Understanding SC 3.3.2](https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html)
- [Understanding SC 3.3.3](https://www.w3.org/WAI/WCAG22/Understanding/error-suggestion.html)
- [Understanding SC 3.3.4](https://www.w3.org/WAI/WCAG22/Understanding/error-prevention-legal-financial-data.html)
- [Understanding SC 3.3.7](https://www.w3.org/WAI/WCAG22/Understanding/redundant-entry.html)
- [Understanding SC 3.3.8](https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html)
- [Understanding SC 4.1.3](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html)
- APG: [landmarks](https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/), [disclosure](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/), [modal dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [W3C tutorial, headings](https://www.w3.org/WAI/tutorials/page-structure/headings/)
- [WHATWG HTML, autofill](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html)
- MDN: [ARIA live regions](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions), [log role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/log_role), [aria-busy](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-busy)
- [WebAIM, skip navigation links](https://webaim.org/techniques/skipnav/)

**Design systems**

- GOV.UK: [error summary](https://design-system.service.gov.uk/components/error-summary/), [validation](https://design-system.service.gov.uk/patterns/validation/), [password input](https://design-system.service.gov.uk/components/password-input/), [create accounts](https://design-system.service.gov.uk/patterns/create-accounts/), [question pages](https://design-system.service.gov.uk/patterns/question-pages/), [start using a service](https://design-system.service.gov.uk/patterns/start-using-a-service/), [page not found](https://design-system.service.gov.uk/patterns/page-not-found-pages/), [problem with the service](https://design-system.service.gov.uk/patterns/problem-with-the-service-pages/), [skip link](https://design-system.service.gov.uk/components/skip-link/)
- Carbon: [login](https://carbondesignsystem.com/patterns/login-pattern/), [empty states](https://carbondesignsystem.com/patterns/empty-states-pattern/), [forms](https://carbondesignsystem.com/patterns/forms-pattern/), [loading](https://carbondesignsystem.com/patterns/loading-pattern/), [UI shell header](https://carbondesignsystem.com/components/UI-shell-header/usage/), [UI shell left panel](https://carbondesignsystem.com/components/UI-shell-left-panel/usage/)
- Geist: [introduction](https://vercel.com/geist/introduction), [empty state](https://vercel.com/geist/empty-state.md), [error](https://vercel.com/geist/error.md), [skeleton](https://vercel.com/geist/skeleton.md), [grid](https://vercel.com/geist/grid.md)
- Atlassian: [empty state](https://atlassian.design/foundations/content/designing-messages/empty-state), [form usage](https://atlassian.design/components/form/usage)
- Shopify Polaris: [settings template](https://shopify.dev/docs/api/app-home/latest/patterns/templates/settings), [empty state](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/empty-state.md) (via search result). Polaris React pages now redirect to shopify.dev.
- Primer: [forms](https://primer.style/product/ui-patterns/forms/), [saving](https://primer.style/product/ui-patterns/saving/), [empty states](https://primer.style/product/ui-patterns/empty-states/)
- shadcn: [ui.shadcn.com/blocks](https://ui.shadcn.com/blocks), [shadcn-svelte.com/blocks](https://www.shadcn-svelte.com/blocks), and the local clone at `6149e14`
- Bits UI: [Dialog](https://bits-ui.com/docs/components/dialog), [PinInput](https://bits-ui.com/docs/components/pin-input)
- [Tailwind, responsive design](https://tailwindcss.com/docs/responsive-design)

**Chat**

- Vercel AI SDK: [chatbot](https://ai-sdk.dev/docs/ai-sdk-ui/chatbot), [AI Elements](https://elements.ai-sdk.dev/) (it says it moves to shadcn/ui and is deprecated at the end of November 2026), [Conversation](https://elements.ai-sdk.dev/components/conversation), [Prompt Input](https://elements.ai-sdk.dev/components/prompt-input)
- [MUI X Chat, composer](https://mui.com/x/react-chat/headless/composer/)
- [Telerik, chat accessibility](https://www.telerik.com/design-system/docs/components/chat/accessibility)
- [accessibility.build, accessible AI chat](https://accessibility.build/guides/accessible-ai-chat)
- [azukiazusa, IME and Enter-to-submit](https://azukiazusa.dev/en/blog/ime-enter-submit)
- GitHub write-ups on streamed announcements: [d-oit/do-knowledge-studio #887](https://github.com/d-oit/do-knowledge-studio/issues/887), [#926](https://github.com/d-oit/do-knowledge-studio/pull/926)
- OpenAI help centre, search-result text only

**Research and platforms**

- NN/g: [homepage principles](https://www.nngroup.com/articles/homepage-design-principles/), ["Get Started" stops users](https://www.nngroup.com/articles/get-started/), [vertical nav](https://www.nngroup.com/articles/vertical-nav/), [empty states](https://www.nngroup.com/articles/empty-state-interface-design/), [skeleton screens](https://www.nngroup.com/articles/skeleton-screens/), [response times](https://www.nngroup.com/articles/response-times-3-important-limits/)
- web.dev: [sign-in form best practices](https://web.dev/articles/sign-in-form-best-practices), [SMS OTP form](https://web.dev/articles/sms-otp-form)
- SvelteKit: [errors](https://svelte.dev/docs/kit/errors), [adapter-static](https://svelte.dev/docs/kit/adapter-static)
- [Cloudflare, static site generation and 404 handling](https://developers.cloudflare.com/workers/static-assets/routing/static-site-generation/)
- [Google, HTTP status codes and network errors](https://developers.google.com/search/docs/crawling-indexing/http-network-errors)

**Local**

- design book v2, `plutosystemshq/pluto-systems-design-book-v2.html`
- `specifications/001-tokens-and-the-registry.md`
- `decisions.md`, `handoff.md`
- `context/prior_art/shadcn-svelte` at `6149e14`
