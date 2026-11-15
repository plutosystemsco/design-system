# The owner's decisions

The owner's answers and decisions, newest first. A decision that changes the constitution is also recorded in its Status line. "The design book" and "v2" both mean the Pluto Systems design book, version 2, the source of the brand's rules; a section of it is cited as "§03".

### The Kuiper Design System (2026-11-15)

**The owner:** "Also, I was to call this the Kuiper Design System." Asked what the name covers, the lockup and the address:
- **The name now, the code names in 0.13.0.** From 0.12.0 the system is called the Kuiper Design System: the site's title, the README, the changelog, `llms.txt`, the constitution (§1, Status line amended) and `AGENTS.md`. Code names that installed apps depend on stay `pluto` in 0.12.0: the registry `pluto`, `pluto-theme`, the `pluto:` context keys, `tokens/pluto.tokens.json`. They are renamed in 0.13.0 by their own specification, with a migration guide for installed apps.
- **The lockup waits for mock-ups.** "Let's mock some ideas up later and I'll approve." The header keeps today's lockup in 0.12.0. Lockup ideas for the Kuiper name are drawn later and put to the owner.
- **The address stays** `pluto-systems-design.claygendron.workers.dev`.

Pluto Systems remains the company and its brand: the four-dot mark, the colours and the type. Kuiper is the design system's name.

**The home hero.** **The owner:** "And I want the hero to be Design with Kuiper". The home page's headline becomes "Design / with / Kuiper" on its three poster lines, replacing "Build / with / Pluto.". **The owner:** "no period after Kuiper". It lands in `018`.

### Kuiper is a public product, and the old limits go (2026-11-15)

Asked from the older-rules audit (`research/2026-11-15-older-rules-audit.md`), the toast memo (`research/2026-11-15-toasts.md`) and the benchmark scorecard (`research/benchmark-scorecard.md`):
- **Who Kuiper is for.** **The owner:** "Public product. It's building the design system for current and future needs, and is a system that anyone can adopt." Constitution §1, §2 and §4.2 are reworded: a component is added when `roadmap.md` ranks it, from current or future need and the reference systems' evidence. No named app is required. Docs, install path and governance are written for outside teams too.
- **Accessibility evidence: the full matrix from 0.13.0.** Chromium, Firefox and WebKit in every test run, plus scripted VoiceOver and NVDA checks. A tag waits on automated checks only. "Recorded as limits, not as pending work" is removed from §4.4 and from the specifications that repeat it. `v0.12.0` still waits on the owner's `019` listen.
- **Charts may use a functional data palette:** eight categorical colours plus sequential and diverging scales, each measured for contrast and colour-blind distinction. Data colour is functional, like code colour.
- **Changes to installed apps:** a migration note with every interface change; from 1.0, nothing is removed without a deprecation in an earlier minor release.
- **Reach: tokens for everyone.** Components stay Svelte. The tokens and theme are also published as plain CSS variables and a W3C Design Tokens (DTCG) file.
- **The motion budget is removed.** **The owner:** "Nix the motion budget, allow for sliding and motion that is functional or that is intentionally whimsical and welcoming." Motion is allowed where it is functional, or deliberately whimsical and welcoming. Reduced motion is always honoured: nothing moves when it is set. This sits beside the 2026-11-07 ruling that every other animation answers the visitor (J2): the next motion specification states how a welcoming flourish meets it, for example only on first arrival and once per visit.
- **Toasts time out only when harmless.** Success and info toasts last at least 6 s, longer for longer text, and pause on hover, focus, a hidden tab or an open modal. Apps get a switch to turn timers off. Errors, cautions, actions and loading never time out. The design lead takes the memo's option (b): Kuiper builds its own `toast` on `status`, with no dependency, since `svelte-sonner`'s tab stops and nested live regions are in its markup.
- **Design tooling: tokens as design variables, no Figma.** **The owner:** "We should assume we are not going to adopt figma, we design in code. So tokens and design variables." The token file becomes conformant DTCG, with role descriptions in the file, and is exported as design variables. No component library is drawn in a design tool.

The audit's other AMEND and REMOVE verdicts are applied on the owner's instruction to question the old rules. The rules it marked KEEP stay: the source model, tokens as the one source, state never by colour alone, 24 px targets, the muted-ground tint ban, and the owner's brand calls.

### Toasts, the page standard, and questioning the old rules (2026-11-15)

Asked after the component-inventory and component-page-standard memos of 2026-11-15:
- **Toasts: yes.** **The owner:** "We should have toasts, so drop our rule against them and work out the best solution." `005` decision 14's refusal is withdrawn. A research memo studies the references' toasts and the accessibility rules on timing and status messages, then a specification builds the best one.
- **Structured guidance lives in the site:** one typed module per item, `src/lib/site/guidance/<item>.ts`. Installed apps receive nothing new.
- **A don't may show a real accessibility fault,** rendered live but `inert`, labelled as a don't. Its test asserts that axe reports exactly the rule it names, and the page's axe run excludes only that example.
- **The pilot set:** `button`, `dialog`, `field`, `dropdown-menu`, `error-summary`.

**Questioning the older documents.** **The owner:** "You should question the assumptions made in the constitution and other older documents that were written before our ambitions. If they do not serve us in building a compelling design system, we should nix them." What follows:
- An audit reads the constitution, `AGENTS.md`, `decisions.md` and the specifications for rules written before the ambition to match the reference systems.
- Each rule is kept, amended or removed, with its reason. Rules that plainly hold the system back are removed on this instruction and recorded here. Rules that protect accessibility, the source-not-a-package model or the owner's own calls are put to the owner first.

### `019`'s VoiceOver listen waits for the owner (2026-11-15)

Asked how to run `019`'s screen-reader check (decision 12), **the owner:** "Away from my laptop right now, let s do it later". `019` is committed after its change review. The local `v0.12.0` tag waits until the owner has run `scripts/a11y/voiceover-error-summary.ts`, or listened, and the pass rule holds. If it fails, the owner chooses between keeping the inner alert and dropping the live role (`019`, Risks).

### A roadmap toward the reference systems, measured as it goes (2026-11-15)

Asked whether 0.12.0 is a polished system that competes with IBM's and Google's, the design lead answered no: the site holds its own, but breadth (75 items against hundreds), per-component guidance, published accessibility status, scoped theming, design tooling and reach fall well short. **The owner:** "Yes, build a roadmap and have concurrent agents work towards it. Constantly access outgoes towards prior art references."

What follows:
- **Three research tracks run at once:** a component inventory against the reference catalogues, a benchmark scorecard, and a standard for a component page's guidance. They feed `context/roadmap.md`, releases from 0.13.0 toward 1.0.
- **Outcomes are measured against prior art continuously.** The scorecard is re-run after every specification lands. Each change review cites its movement, and the roadmap is re-ranked from it.
- Agents work concurrently where their files don't overlap. Builds that share files run in sequence.

### `018` checkpoint 2, the design lead's rulings (2026-11-15)

Seen: the Components index at 1440, 768 and 390 in both themes, ten thumbnails beside their pages, search for "dia" and "modal", Foundations Type and Colour, and the forced-colours shots.
- **The thumbnails are redrawn to fill their tile.** Today most show a small cluster in the top-left of an empty stage: Dialog is two small buttons on paper, and the font items are one line of tiny text.
  - Crop each picture to its content's box, add even padding, centre it, and scale it up to fill the tile (at most 2×).
  - No text in a tile is smaller than about 9 px at its displayed size.
  - An item may name a better state in `example-order.ts`. Overlays (dialog, alert dialog, sheet, popover, dropdown, select, tooltip, hover card, command and the like) are photographed open. Font items show a large "Aa" and a short line in their own face.
- **The index's first row loads without script.** Its pictures are chosen by the theme class in CSS, so the right scheme's picture loads at once; the rest stay lazy. The LCP budget is set from the new measurement, not raised to 3.4 s.
- **On landings, the bar turns opaque once the band has scrolled out of view.** On the index, content showed through the glass bar behind the lockup. The glass stays over the band.
- **The "select" alias is dropped,** since it starts a word of its own target, which the spec's rule forbids.
- **The lockup link keeps "pluto, Kuiper Design System"** until the owner approves a Kuiper lockup.
- The other calls in the builder's report stand: `example-order.ts`, stage photographs at 1000 px, `text-2xl` samples, `specimens.spec.ts`, Popover and `--scrim` for "dia", and 017's ladder figure on Type.

### `018` checkpoint 1, the design lead's rulings (2026-11-15)

Seen at 1440 and 390 in both themes (Button, Dialog, Brand Colour, Foundations Type, Start install, changelog, the sheet open):
- **The left nav and the component-first page are accepted as built.** Button's first example starts at 419 px at 1440 and 487 px at 390.
- **Brand bands beside the nav (criterion 22) are accepted as built:** each band runs from the content column's start edge to the viewport's end and still reads bold.
- **Button's budget is 380 kB** (option a: the measured 378 kB median plus 2 kB). A server-only nav is not available per component in Svelte 5, and an HTML string would ride in the page data as well as the markup.
- **The page tools are one treatment.** "Copy page" (a button) and "View as Markdown" (a link) read as two different things today, one black and one blue. Both become quiet controls of the same height, weight and colour, each with a leading icon. "Copy page" says "Copied" in its status region.
- **The components filter gets a leading search icon and a placeholder,** so an empty box doesn't read as a stray field.
- **On the phone, "On this page" uses the site's own chevron,** not the browser's default triangle, matching the sheet.

### Four calls from the site-polish synthesis (2026-11-15)

Asked after `research/2026-11-15-site-polish-synthesis.md`. **The owner** took the recommended option on all four:
- **The `error-summary` fix lands before the tag,** as its own small specification (`019`) after `018`. Two defects, shipped since 0.3.0: `role="alert"` sits on the item's root, so the whole box is announced; and `focusField` focuses the input without bringing its label into view, so the label can sit under a sticky bar. Installed apps get the fix in 0.12.0, with a changelog interface line.
- **Each component page shows one "Changed in 0.x.y" line,** generated from the changelog and linking to its entry. This amends the 2026-11-14 ruling of "a changelog page only".
  - Refined after `018`'s spec review (finding 4): on 52 of 75 items "Changed in" would repeat "Since", since they have not changed since they arrived. Explained to the owner ("I dont understand the problem, the first release is 0.1.0. It's either in that release or later."); the design lead's reading: the facts line always shows "Since 0.x.0", linked to its release, and adds "Changed in 0.y.0" only where a later release changed the item. The owner may still ask for both on every page.
  - **The owner then ruled:** "Just have Updated X.Y.Z so it is the same for everything." Every component page shows one "Updated 0.x.y" line: the newest release that changed the item, or the release it arrived in if none did, linked to that changelog entry. The label is the same on every page. "Since" is unchanged.
- **Each page has one "Suggest a change" link.** It opens a new GitHub issue on `plutosystemsco/design-system` with the page's address filled in. No per-component discussions.
- **The accessibility status is its own specification after the tag,** first in 0.13.0, with the high-contrast scheme and a forced-colours pass, since all three test the same things. It must solve the ordering: the site builds before the browser tests run.

The order before the tag is now: the follow-up commit, `018`, `019`, the tag.

### Accessibility status, a high-contrast scheme, and scoped schemes (2026-11-15)

Three calls left open after the prior-art memos of 2026-11-15.

**Accessibility status, generated from the test report.** **The owner:** "Yes to accessibility status, but everything should be accessible."
- Each component page shows what was checked, generated from the test run: automated checks in both schemes, keyboard, contrast, forced colours, and the screen-reader notes.
- It is evidence, not a grade. There is no "partial" or "not yet" state. A component that fails a check fails the build; it is never published with a failing status.
- This reverses `015` decision 10, which left a "Checked" row off.

**A high-contrast scheme.** **The owner:** "yes to high contrast theme." It follows `prefers-contrast: more` and can be set by hand. It is a theme change every installed app receives, so it is its own specification, researched with scoped schemes below.

**Light and dark scoped to any part of a page.** **The owner:** "what should we do? we have lots to study from." The design lead's recommendation, to be confirmed by a memo on the prior art (`research/2026-11-15-scoped-schemes-and-contrast.md`) before it goes to a specification:
- Each colour token holds both its values in one variable, with CSS `light-dark()`.
- An attribute on any element sets `color-scheme`, so any subtree can be light or dark.
- Registry items stop using Tailwind's `dark:` variant; a test forbids it. Every difference between schemes lives in the tokens.
- High contrast is a second axis on the same attribute pattern, since `light-dark()` takes only two values.

The memo landed the same day. It confirms the recommendation in Chromium, Firefox and WebKit, and corrects it in five places:
- **Contrast is set on `<html>` only,** never on a subtree. It is a reader's setting, and a subtree that redeclares tokens brings back the trap `light-dark()` removes.
- **The scope rule also sets `color` and `background-color`,** in `@layer base`, because inherited `color` does not follow the scope.
- **Portals still need routing,** since `light-dark()` does nothing for an overlay mounted under `<body>`.
- **`readToken` must return a resolved colour,** which is an interface change.
- **Browsers without `light-dark()` get a generated fallback,** and `dark:` is banned only in `src/lib/registry/`, not on the site.

Its open questions (browser floor, how long `.dark` stays an alias, the high-contrast colours, the non-text target) go to the owner when that specification starts in 0.13.0.

### No status mark, and items gain prop doc comments (2026-11-15)

Two questions came out of the prior-art memos of 2026-11-15. **The owner:** "I'll follows your recommendations."

- **No status mark on components** (`2026-11-15-prior-art-govuk.md`, idea 9, option a). An item's "since" already shows how new it is. There is no "new", "trial" or "beta" mark.
- **Items gain doc comments on their props,** so the API table's "What it does" column fills in (`2026-11-15-design-sites-developer.md`; on Button, 1 of 11 rows has text today).
  - It is its own specification after `018`, because it changes item source and so `static/r/`.
  - It does not hold the `v0.12.0` tag.
  - Until then, `018` hides the column where an item's table has no text in it.

### Every page but home has a left navigation (2026-11-15)

**The owner,** looking at the site beside the reference design-system sites: "One clear thing we need is a left navigation bar when not on the home page."

Today a page outside home shows its section's siblings and "On this page" only in a right rail, and nothing persistent on the left.

**What follows:**
- Every page but `/` gets a left navigation for its door:
  - Start's five guides;
  - Components' 75 pages under their 11 groups;
  - Brand's nine pages;
  - Foundations' seven pages;
  - the changelog under the site's own links.
- The current page is marked, and the nav is generated from `sitemap.ts`.
- The right rail keeps "On this page" only.
- Below the desktop breakpoint, the left nav folds into the menu.

This is the first decision of the site-polish specification (`018`), which the design-site teardowns of 2026-11-15 feed.

Asked whether `018` ships before or after the `v0.12.0` tag, **the owner:** before (the recommended option). The local tag waits until `018` is built and its change review is dispositioned. Nothing is published yet, so the site's first public version carries the left nav and the polish.

The order is now:
1. `017`'s change review and commit;
2. the follow-up commit (`kbd`, dark `type`, the address);
3. `018`'s research synthesis, then its spec, review, build and change review;
4. the tag.

### `kbd` sits on the code ground and can be selected (2026-11-15)

**The owner,** looking at the Kbd page: "for kbd, is this inline code? If so, on light mode the background should be white, and I should be able to use my mouse to select the text."

`kbd` is the Kbd component, not inline code. `014` left `kbd` and `samp` out of the chip on purpose. The owner's word amends that for `kbd`:
- **Ground:** the Kbd component takes the code ground, `bg-code-background` (white in light, `#2C2821` in dark), not `bg-muted`, with its hairline edge kept.
- **Selection:** it drops `select-none` and `pointer-events-none`, which came from shadcn-svelte's original, so its text can be selected and copied. A click on it still reaches a button it sits in.
- **Text:** it keeps the muted foreground.

This is an interface change to the `kbd` item, with a changelog line and a test for the ground and selection. It lands in the same follow-up commit as dark `type` and the site's address, after `017`.

### Dark type is `#A8C0D8`, and the site's temporary address (2026-11-15)

Asked, with a side-by-side of the TypeScript, Rust and Python samples in dark, whether dark `type` stays `#9FB1DD` or moves to `#A8C0D8`, **the owner:** "lets use the new blue." Dark `syntax-navy`, the `type` role, becomes **`#A8C0D8`**:
- ΔE 8.8 from function (was 5.2), 10.9 from keyword, 10.8 from text, 8.5 from comment;
- 7.81:1 on `#2C2821`, inside the 6.5 to 9.5 range.

Light `type` (`#243B7A`) is unchanged. It lands as its own commit on `release/0.12.0` after `017`, with a changelog line, and `013`'s palette table is amended to match.

Asked for the `<account>` part of the `workers.dev` address, **the owner:** "claygendron.workers.dev". Until `design.<domain>` is set, the site's origin is **`https://pluto-systems-design.claygendron.workers.dev`**. `SITE_ORIGIN` takes it, and `015`'s release check then passes. The noindex rule on that host stands.

### The owner confirms the calls taken while away (2026-11-15)

Asked on return about the three calls taken while the owner was away, **the owner:** "Sounds good."

The three calls now stand as the owner's:
- noindex on the `workers.dev` host;
- no published item file cites an internal document;
- three download colourways: colour, paper and ink.

Asked whether the `product-home` sample may keep `github.com/ClayGendron/vfs`, **the owner:** "the github url is plutosystemsco/design-system, vfs is seperate." The design system's own address, `plutosystemsco/design-system`, is the one the site uses. The `vfs` address belongs to a separate project, so the sample keeps it.

### After the `017` build's checkpoint (2026-11-15)

The design lead looked at the nine Brand pages at 1440 and 390, in both themes. There were no page errors and no sideways scroll. The design lead also set the six downloads beside the live lockup at 2×. The colour, paper and ink lockups and marks match the live lockup's proportions and the dots' placement, so they are kept. The lockup-width fixture (225.000 px at 100 px) agrees with fontkit's outline.

- **Dark glass over the yellow band,** first shown on screen on `/brand/colour/`: 10.89:1 as painted (10.90 computed); 15.52:1 in light. Glass text there is foreground only, so the 4.60 muted row is never set.
- **The Brand prose was edited by the design lead's editor against "settled only", R23 and R24.** Seven pages changed; Products, Downloads and the summaries were kept. Seventeen claims were cut or corrected because no source said them, or a source contradicted them. Among them:
  - the poster face "once on a page";
  - "WCAG exempts a logo";
  - "every other graphic meets 3:1", which the yellow chart series contradicts;
  - J2's "nothing moves on its own", which is true only after the hello;
  - the mono face "for anything a reader may type";
  - an invented L3 gloss;
  - imagery's M2 to M4 described against what the owner chose.

  The red band's job now reads as the product's danger role. The page's "Brand red and error red" section still keeps the two apart by where they appear.
- **Imagery, M4: the meters are removed.** M4 settled large abstract images made from data, for campaigns. Three meters are a chart, not that. Drawing an abstract image now would invent brand art the owner has not seen. So the section says, as "People at work" does, that Pluto has none drawn yet. This deviates from `017` decision 7's "a chart".
- **Imagery, M1: the search card stays, captioned** as the system's own search card as it renders. It is real output of real parts, not a staged scene.
- **Poster type on the Colour bands stays.** The Brand section is an owned moment by `015`'s ruling: fields appear only on the home page, the landings and Brand.
- **Accepted deviations:**
  - primitive anchors are `#primitive-<name>`;
  - the claims check skips 015's breadcrumb;
  - the new shared `foundations/` and `snippet.svelte`;
  - the downloads shown on fixed light grounds;
  - the reveal specimen played through the Web Animations API;
  - tests seen failing by mutation where they were written after their code.

### The Button page's transfer budget is 365 kB (2026-11-15)

After step 2's cuts, `/components/button/` came down from 371 kB to exactly 360 kB:
- the frame switch became two plain pressed buttons;
- the API table is styled from the table element, not per cell;
- the page loads only its own registry entry;
- each example's code travels once.

Step 3 then added the lazy search button and the links to the Markdown twins, which every page carries. That made it 361 kB. **Ruled by the design lead: the Button budget is 365 kB.** The 1 kB is a cost every page now pays, not the Button page's own weight. Moving an example to save it would cost the page more than it saves. The other three budgets are unchanged.

**Raised again to 370 kB, after the change review.** The review found each example view loading every example, about 688 kB over 186 requests. The fix loads one example per view: 228 kB over 45 requests for Button's variants. Across the site's 157 views, each saves about 460 kB. The cost is finer chunks, which add 5 kB to `/components/button/` (367 kB, all three runs), measured A/B in the same tree. Merging chunks through rolldown's experimental option would reshape every page for 5 kB, so the design lead raised the Button budget to 370 kB instead.

### After the `015` build's checkpoint 2 (2026-11-15)

The design lead read these pages at 1440 in both themes, alongside the builder's shots at 390:
- `/components/button/`
- `/components/dialog/`
- `/components/code-block/`
- `/components/chart/`
- `/components/pluto-theme/`
- `/components/product-home/`

There were no page errors. On each page the design lead switched the first example's frame to the other theme, then toggled the page's theme with the frame open.

- **The frames hold their pick.** Dialog's Light frame, on a dark page, stayed on the light canvas through two page toggles. Button's Dark frame stayed dark after the page went dark and back. The switch shows the pick in both states.
- **The component template: kept as built.** The facts card with its two install tabs, the wrapping command, Examples, then Usage, API, Accessibility, Files you own and Related, and the fixed rail.
- **Block pages: kept.** The width viewer sits under Examples (360, 768, 1280, "Open alone"), with the file view under Files you own.
- **The prose of 25 items** is edited by the design lead's editor against R23, R24 and the voice rules:
  - button, dialog, alert, badge, input, field, checkbox, native-select, tabs, tooltip;
  - sheet, sidebar, table, chart, meter, code-block, code-editor, highlighter, pluto-theme, four-dot;
  - liquid-glass, marketing-bar, product-home, chat, settings.

  The change reviewer reads all 75.
- **`/components/button/` is over its transfer budget, 371 kB against 360: option (a).** The budget stays. In step 3 the builder cuts the page under it. Ways to do that: the frame's switch as two plain pressed buttons instead of bits-ui's toggle group, and a more compact API table. If the page cannot get under 360 kB without losing an example or a section, the builder reports the measured floor, and the design lead rules again. Moving the Heights example off the page (option c) is the fallback, not the first move.
- **Deviations accepted:**
  - example views skip the host page's ids;
  - example views carry the page's headings, visually hidden;
  - code that can scroll sideways is a named region;
  - tests changed only where markup moved;
  - the smaller changes, including the `code-samples` Svelte sample now importing from `#lib`.
- **The helpers' calls, accepted:**
  - tooltip's frame height;
  - chart's three example groups;
  - status's keyboard fixture inside variants;
  - the code-only sidebar cookie example;
  - code-block's `install` data key renamed `terminal`.

### After the `015` build's checkpoint 1 (2026-11-15)

The design lead looked at the built frame (`vite preview` of `build/`) at 1440 in both themes, and at the builder's own shots at 1024 and 390. It viewed:
- the home page's entrance, frame by frame at 100 to 1,600 ms;
- the door transition, from a click on the Components disc;
- the four landings;
- `/components/alert/` and `/components/pluto-theme/`;
- `/changelog/`;
- a 404 three folders deep.

No page errors.

- **The entrance, and the stillness after it: kept.** The discs scale in one after another. By 1.6 s, 0 animations run, in both themes.
- **The door transition: kept.** The disc grows into the band and the page is red within about 160 ms. One flaw to fix: mid-transition, the bar's lockup briefly shows one dot instead of four. The mark is either kept out of the transition's snapshot or given its own `view-transition-name`, so it never drops dots.
- **The doors' words: kept,** as ruled at checkpoint 0.
- **The red band: kept.** "75 parts you can add, each a page" now sits on one line, and the install command wraps.
- **The yellow band, with no glass: kept.** The one-colour lockup and two short lines, on `field-3`, with ink text.
- **The bar's current door: kept.** It is underlined in the foreground colour, with a soft wash behind it.
- **A component page with no field: kept.** `pluto-theme`'s fields are still unframed until step 2, as expected.
- **To fix: the Start band's title sits at the bottom of its band,** leaving the top-left empty beside the install panel. The band's title block aligns to the top, as on the Components band, on every band.
- **To fix: the 404.** At `/nope/deep/` under a dark system theme, the page rendered light, with no bar and no footer. Decision 23 and H5 want the bar and the search button after hydration, and the theme script, at any depth. The builder checks this the way criterion 23 does (serving the build with its 404 fallback). If `vite preview` alone serves a different page, the check says so and uses the fallback.
- **Budgets:** tightened after step 2 re-measures the component pages, not now.
- **CLS budgets:** a budget of median plus 20% at the 0.001 scale is noise, not a measure. Each CLS budget is the larger of median × 1.2 and **0.02**, a fifth of the 0.1 "good" threshold. This deviates from decision 23's rule and is recorded in the Landing notes.
- **Deviations accepted:**
  - the banner holds the lockup alone, with the doors, search and toggle in a `nav` named "Site";
  - the tests outside decision 24's table, changed only where files moved;
  - `php.scm`'s citation, with its lock change entry;
  - criterion 27 counting motion of 1 ms or more;
  - the disc names carrying their lines;
  - the smaller calls: the footer, the rail, search not yet working, and the icon "Menu" below md.

### After the `015` build's checkpoint 0 (2026-11-15)

The design lead looked at the throwaway home page, Components landing and Button page, at 1440 and 390 in both themes, on the committed tokens (013 and 016 landed, so no scratch overrides). The builder's figures were taken at 1440, 1024, 768 and 390.

**Decisions 6 and 7, ruled:**

- **The discs are kept as built.**
  - **At 1024 and wider:** they rise from the headline's cap height and stand exactly its height, so the type stays the largest thing on the screen.
  - **Below 1024:** they sit under the headline at 40% of the width, capped at 160 px.
  - **The words fit:** the least room to a disc's edge is 10.7 px at 360 and 24.1 px at 1440.
  - **The Google echo:** each disc carries its door's name and a line under it, so the four read as navigation first and as a logo second. That is the answer the spec relies on, and it holds on screen.
- **The red band is kept:** the name, "75", "parts you can add, each a page", and one glass panel with the theme's install command. It has no icons and no examples. One fix: the line under "75" leaves "page" alone on its own line at 1440. It is balanced (`text-wrap: balance`), or the measure widened, so no line holds a single word.

**The builder's questions, ruled:**

1. **The cap-height constant** (IBM Plex Sans 600 at 0.9 leading, cap 0.127 em below the line's top) lives in `doors.ts` beside the two ratios, as a measured constant. Its comment names the font, weight and leading, and how it was measured.
2. **Install commands soft-wrap** (option b). This applies wherever a command is shown: the home block, the band's panel and the component pages' install box. On the Button page, "add button" was hidden too. The copied text stays exact, and `viewer.spec.ts`'s string is unchanged. The break may fall anywhere in the address.
3. **The home page's section indexes:** Components lists its 11 groups as links into `/components/`. Start, Brand and Foundations show their heading and summary until `017` adds their pages. This reading of "its landing and its pages" is accepted.
4. **"Files you own" shows the files only; "Related" holds "It brings" and "Brought by".** A long list flows into columns. This deviates from decision 15's wording and is recorded in the Landing notes.
5. **The frame's pick is held until the visitor changes it,** even after the page's theme comes to match it (criterion 14).
6. **The door dots read `--field-N`,** so a dot keeps its colour inside a productive dark `<main>`, where `--mark-N` turns paper.
7. **Criterion 10's height check allows 0.5 px** for sub-pixel rounding. The disc size is not floored.
8. **Not built at checkpoint 0, as expected:** search, the view transition and the menu sheet. The transition is judged at checkpoint 1.

### After the `016` build's checkpoint (2026-11-15)

The design lead looked at these pages in both themes, at 1440 and 390 px:
- `/items/pluto-theme/`
- `/view/compositions/stage/grounds/`
- `/view/product-home/`
- `/items/four-dot/`
- `/items/badge/`
- `/items/alert/`
- `/items/chart/`

There were no page errors on a warm server.

- **The yellow reads as yellow** beside blue, red and green.
  - **Light:** on the fields, `#E2B000` with ink text. It reads warm, not orange, and not green-cast.
  - **Dark:** `#F8D874` with graphite text. It sits with the lifted blue, red and green as one set.
  - **The mark:** the four-dot mark keeps four distinct dots at `text-xs`, both alone and in the lockup.
  - **State colours:** the alert's caution bar and the badge's fill read as yellow and are named in words. That is the one place light caution relies on a fill under 3:1 (2.01 on its card, 1.76 on the page), as decision 5 records.
- **The builder's on-screen figures match decision 5:**
  - **Light:** ink on caution 9.53; chart-3's ΔE to its neighbours 30.3 to 48.1.
  - **Dark:** ink on caution 13.75; chart-3's ΔE 18.3 to 27.2.
  - **Not on screen:** dark glass over `field-3` (4.60) appears on no page at 1440, so the unit test is its guard. `015`'s design site puts glass over the yellow field (its Colour page, `017`); that checkpoint reads it on screen.
- **Accepted:** the `chart` page gains a row of five series swatches, so criterion 8 has a series 3 to read.
- **For step 5:** the `alert` page's copy still says "an amber bar". Criterion 9's search catches it.

### After the `013` build's checkpoint 2 (2026-11-15)

The design lead typed in the editor in both themes, at 1280 px and 2×:
- on the 5,000-line Python document in `/view/code-agreement/`'s 20-line editor (45 characters at line 2,500);
- on Svelte and on Markdown in `/items/code-languages/`, adding a ```` ```python ```` fence.

Colour followed every keystroke, the new fence took Python's roles, and Svelte closed its tags. There were no page errors and no long tasks over 50 ms. Calls:

- **E7's Python bar is reset from 8 ms to 12 ms p95. No worker is added.**
  - **Measured:** in the page, a keystroke costs 8.7 to 10.4 ms p95 (the builder, three runs). The design lead's own run on the dev server gave 9.9 to 10.4 ms per transaction, steady state. Max 31 ms, under the 50 ms bar, which stands.
  - **Why:**
    - About 5 ms of each keystroke is tree-sitter-python's own incremental re-parse. It re-reads about 77% of the text after a one-character edit; Rust re-reads 1 kB. Only a different engine moves that.
    - At 10 ms a keystroke lands well inside one 16.7 ms frame, and far inside the 200 ms "good" responsiveness threshold (INP).
    - The spec put a parsing worker out of scope (Scope, "Not here"), while its Risks named a worker as the remedy. The two conflict, and the cheaper reading wins. A worker would ship a second copy of each grammar and colour every keystroke one message late, which is a visible flicker, to save about 4 ms that no reader sees.
    - Ruby (7.2 ms) and Markdown (2.0 ms) stay at their 16 ms bars.
  - **Recorded as a deviation** in 013's Landing notes. E7 asserts 12 ms, and its message still prints the measured p95 and the next-frame figure.
- **A known cost, not gated: a document that is mostly syntax errors re-parses in full.** By mistake, the design lead first loaded 5,000 lines of Python with the line breaks stripped. That text is an error almost everywhere, and every keystroke there cost about 230 ms, all in tree-sitter's re-parse. Real code under edit has local errors, and those stay at about 10 ms. A later spec may bound the parse: web-tree-sitter's progress callback can abandon a parse over a time limit and keep the last tree's colours until idle. It goes in 013's Risks for the record.
- **Accepted:**
  - the converter following decision 13's rows (295 → 309 hand entries; `roles.json` `a9eab0f6…`, `roles-hand.json` `96b77339…`; workbench 98.6%, held-out 97.7% unchanged; no query file moved, so the lock is untouched);
  - the rewritten `highlighter` description;
  - `pythonSetup()` pairing Lezer's `pythonLanguage` with `codeHighlighting`, dropping `pythonLanguageConfigured`, `pythonRoles` and `codeHighlight`. This is an interface change, so it needs a changelog line.
- **For `015`'s builder:** the `code-languages` Svelte sample imports from `"$lib/ui/meter"`. `015` criterion 13 bans `$lib` in shown code, so that sample's import moves to `#lib` there.

### After the `013` build's checkpoint 1 (2026-11-15)

The design lead looked at `/items/highlighter/`, `/view/code-agreement/`, `/items/code-block/` and `/items/pluto-theme/`. It read them at 1280 px, native and 2×, in both themes, with no page errors, no overflow, and nothing left `pending`. Calls:

- **The workbench-set bars stand.** Fresh queries score 98.4% overall, and every per-language bar is met. So decision 19's bars are confirmed, not reset.
- **The held-out set, scored for the first time** with `PLUTO_HELDOUT=1`: **97.7% overall**. Per language: Python 100.0, JavaScript 100.0, TypeScript 98.0, Bash 97.1, SQL 88.5, Go 98.4, Rust 98.5, Java 97.9, C# 98.0, Ruby 98.5. Every bar of 92.0 / 93.5 / 85.0 is met. **One disclosure from the builder:** two query-writing agents briefly saw five held-out lines (two JS/TS comment lines, two TS field lines, one Ruby line). Nothing was written from them. The figure stands, with that noted in 013's Landing notes.
- **The gate is deleted.** `src/lib/preview/held-out.server.ts` and every read of `PLUTO_HELDOUT` under `src/` and `tests/` are gone, and all 26 samples are coloured. `tests/fixtures/highlight/query-lock.json` holds the SHA-256 of the 24 query files, the figures and an empty change list. `queries.test.ts` now fails if the lock is missing.
- **Read and passed:** comments recede by colour alone, red is rare on every screen, JSON keys are blue, HTML attributes are plum, and most of each screen is in the body ink. The dark yellow reads without glare on the ground and the active line. The dark constant (`#FFA373`) and special (`#FC8D8A`) separate (ΔE 6.8) where they meet: `True` beside `\n` and the f-string braces.
- **Brought to the owner, nothing changed: dark function and dark type sit close.** `#91AEFD` and `#9FB1DD` measure ΔE 5.2. Beside them, function to keyword is 7.1, and light function to type is 14.3. On the gallery's TypeScript and Rust, `set`/`fmt` beside `Map`/`Formatter` read as two blues, but only just. The palette is the owner's (decision 8's guard), so it ships as specified. **The question for the owner:** keep `#9FB1DD`, or move dark `type` to `#A8C0D8`? The candidate measures ΔE 8.8 from function, 10.9 from keyword, 10.8 from text and 8.5 from comment, at 7.81:1 on `#2C2821`, inside Meridian's 6.5 to 9.5.
- **The fixture against decision 13's rows** (TOML brackets, 15 characters; Ruby `Float()`, 5): the spec's rows govern. The converter is corrected so the fixture matches them, which is mechanical, not tuning. The old and new fixture hashes and both sets' figures before and after go in the Landing notes.
- **To fix before the change review:** the `highlighter` item's description still reads "Shiki with the JavaScript engine…". It describes tree-sitter with the Shiki fallback, in `registry.json` and so on the page and in `static/r/`.

### The design site's review calls, taken while the owner was away (2026-11-14)

The spec reviews of `015` and `017` raised three points that touch the owner's rulings. The owner was away. The design lead took the recommended option for each, so the work is not blocked. Each was **taken by the design lead while the owner was away, and is open to reversal**.

- **The temporary address is not indexed, now or later.** A `_headers` rule sends `X-Robots-Tag: noindex` for `https://pluto-systems-design.:account.workers.dev/*`. The site moves domains with no redirects, so pages indexed at the temporary host would stay behind as stale duplicates. The site is still public; the `workers.dev` copy is only kept out of search engines. **The rule stays after the owner sets `design.<domain>`** (revised after `015`'s second review, S5): a custom domain does not switch off the `workers.dev` host, which keeps serving the same files. A redirect would need the domain decided first. `"workers_dev": false` would remove the address the owner checks the site at (`015` decision 20).
- **No published item file cites an internal document, from 0.12.0.** Some item comments cite specifications or review codes, for example "(010 decision 5)" or "(K3)". The site's generated API tables would publish them, and every installing app already receives them. As a rule (revised after `015`'s second review, S2, from a list of five lines), every comment under `static/r/` that matches `015` decision 14's citation patterns is reworded in plain words, with no interface change. `015`'s builder enumerates them against `016`'s commit, records each rewording in a fixture, and the changelog names the items. `static/r/` otherwise equals what `016` leaves (`015` decisions 14 and 26).
- **"On colour and on paper" means three colourways.** The downloads are the mark and the lockup each in colour (for paper and light grounds), in paper (for the blue, red and green fields and for dark grounds), and in ink (for the yellow field and one-colour print). The four-colour mark is never set on a field, because its yellow dot measures 1.00:1 on the yellow field (`016`). There is no lifted-four dark download (`017` decision 4).

Each of the three is put to the owner as a question, with the taken option first (`015`, "For the owner", questions 3 to 5). Two more steps stay with the owner, as hand-off items rather than blockers (the same section, items 1 and 2):

- renaming or creating the worker `pluto-systems-design` in the Cloudflare dashboard, and reconnecting Workers Builds to it;
- the `<account>` part of `pluto-systems-design.<account>.workers.dev`.

### Commits per specification, and the site's worker name (2026-11-14)

Asked how the remaining specifications (`013`, `016`, `015`, `017`) proceed while they touch the same files in one uncommitted working tree, **the owner:** commit each specification as it lands. Each is committed to a `release/0.12.0` branch once its change review passes, starting with `014`; nothing is pushed until the owner asks. A review then reads one specification's diff, and a bad build can be rolled back. The tag still comes once, after the change reviews of `013`, `014`, `015`, `016` and `017`.

Asked whether the Cloudflare worker keeps the name `pluto-design-system`, **the owner:** rename it `pluto-systems-design`, to match the site's name. Until the owner sets `design.<domain>`, the site is at `pluto-systems-design.<account>.workers.dev`. `015` carries the rename in `wrangler.jsonc`.

### After the `014` build's checkpoint (2026-11-14)

The design lead looked at `/items/code-block/`, `/items/code-editor/` (the editor focused), `/items/pluto-theme/` (the ink surface), `/view/chat/thread/` (the user turn's block) and `/view/product-home/` (the nested lines), at 1440 and 390 px in both themes. The code ground reads white in light and `#2C2821` in dark, with the hairline in both; no page errors. Calls on the builder's deviations and findings:

- **The phone overflow is pre-existing, not 014's.** `/items/code-block/`, `/items/code-editor/` and `/items/pluto-theme/` scrolled sideways at 390 px before 014 (303, 230 and 425 px; 014 adds 2 px). The cause: a Specimen `figure` with `min-width: auto` in a `grid max-w-2xl`, and the contrast table with no scroll wrapper. It is left for `015`, which rebuilds the item pages, and is recorded in 014's landing notes.
- **Accepted, with a changelog line:** the inline-code chip adds 10 px of padding and edge to an unbreakable token, which widened `/items/settings/` to 327 px at 320 px; the builder added `wrap-anywhere` to that path in `block-page.svelte`. An installed app with an unbreakable inline token in a tight column gets the same 10 px, so the shared 0.12.0 changelog entry says so.
- **Accepted:** the three test groups the spec's list missed (two stop counts in `blocks.spec`, the `tokens.spec` active-line reading), two more good L19 samples, page copy beyond decision 11's list, and the `code-editor` page's read-only editor in a card.

### A yellower yellow, in code and in the brand (2026-11-14)

**The owner:** "the yellow needs to change, it needs to be more yellow and improve contrast on both white and dark", then: "I meant the brand yellow too."

- **The syntax yellow (numbers) is settled:** `#6C5A00` light, `#F1CA00` dark (OKLCH hue 95). On the white code ground 6.77:1 (was 5.55), on the dark ground 9.20:1 (was 7.71). Every Tombaugh colour still passes AA on the ground, the active line and the selection; numbers and constants are no longer a near pair. In light mode a dark yellow reads golden; that is the cost of contrast on white.
- **The brand yellow: `#E2B000` light, `#F8D874` dark.** Shown five steps from Sun to Gold and four dark yellows beside the lifted blue, red and green, **the owner** chose the midpoint `#E2B000` (OKLCH hue 88; 2.01:1 on white, against today's amber at 2.17 and Google's and Microsoft's logo yellows at about 1.7; ink on it 9.53:1) and the soft `#F8D874` in dark ("slightly more white like the other colors": the lifted colours' chroma, about 0.125; 13.20:1 on graphite, was 8.45). It replaces amber (`#F19E20`) wherever the brand's yellow appears: the mark's third dot, the third field, the third chart colour and the caution fill. Its text shade must not lose contrast against today's `amber-text`. A specification of its own, `016`, carries it in 0.12.0. Measured for the owner on the way: Google's logo yellow `#FBBC05`, Microsoft's `#FFB900` (hex values from memory, measured here).
- **The dark syntax yellow is softened too:** `#E5CD72` (9.28:1 on the dark code ground, under Meridian's 9.5), in place of `#F1CA00`, so it sits with Tombaugh's other dark colours. Light stays `#6C5A00`.

### The design site: its name, downloads and the exhibit (2026-11-14)

From `research/2026-11-14-the-design-site.md`'s questions. **The owner:**

- **Name and home:** "Pluto Systems design", on a subdomain such as `design.<domain>`; until the owner sets the DNS, it runs on its Cloudflare `workers.dev` address.
- **Downloads:** the brand section offers the four-dot mark and the lockup as SVG, on colour and on paper, generated from the tokens, in 0.12.0.
- **The `/identity` exhibit is removed.** Its full record stays in `context/` and in git history. (First ruled "remove it, redirect"; superseded below, since nothing is published.)
- **The direction: B, "the mark is the map".** Shown the three prototypes, **the owner:** "I like B!" The four dots become the site's four doors (Start, Components, Brand, Foundations), each section opening on its colour field, with poster type and glass: the system's expressive mode is the site's voice. The research named two risks the specification must answer: four large circles in the mark's colours echo Google at billboard size, and red as the Components colour can read as an error.
- **Install from both.** Asked where apps install from, **the owner:** both. The site serves the registry at its own versioned `/r/` path, and the raw GitHub address keeps working for apps that already use it.
- **`/components/`, with no redirects.** Asked whether the URLs keep `/items/` or move to `/components/`, **the owner:** "Move to components, nothing is published, no need to redirect." The same reasoning holds for `/identity/` and `/workbench/`: they are removed, not redirected. No `_redirects` file is needed for them.
- **Releases: a changelog page only.** No per-item release history and no launch page in 0.12.0.
- **For agents: yes.** Every page is also served as Markdown, with an `llms.txt` index, generated at build time.

### Inline code takes the code ground too (2026-11-14)

**The owner,** while `014` was being built: "make sure in line code in light mode gets the same treatment." Inline code (a `code` element in running text, not inside a `pre`) has had only the mono face, from the base rule for `code, kbd, samp, pre`, and no ground of its own. It now sits on the code ground like a block: white in light mode, with the same hairline edge, and the code text colour. Dark mode gets the same treatment on its unchanged ground, so inline code reads alike in both themes. `014` is amended to carry it, with its own criteria, before its build goes past the checkpoint.

### A public design site, the workbench dropped, and properties under Meridian (2026-11-14)

**The owner:** "also apart of 0.12.0, I want to build a brand site or a design site that explains how to build with the design system, and explains the pluto system brand. we can also drop the workbench/code/ app."

- **The constitution is amended (§3).** Asked whether the site lives in this repository, which §3 said is "Not a website", or in a repository of its own, **the owner:** amend §3; the site lives here. §3 now reads that this is not a marketing site and hosts one public design site. The Status line records it.
- **It is public.** Asked whether it is for anyone or for Pluto teams only, **the owner:** public. Nothing internal goes on it; it deploys on Cloudflare, as the preview does.
- **The preview pages and `/identity` fold into it, and it aims high.** Asked whether today's item pages and the identity exhibit fold into the site or stay beside it, **the owner:** "fold into site, but we need to think bigger and develope something great, use the front end design skill to help." The item pages become its component documentation; the identity exhibit's settled answers become its brand section, and the exhibit's record stays in `context/`. The site is designed with the `frontend-design` skill, to a standard that competes with the best public design systems (the owner's earlier bar: "compete with Google").
- **It ships in 0.12.0,** with `013` and `014`, by its own research, specification, review and build.
- **The workbench is dropped.** `/workbench/code/` and its `(workbench)` layout are removed in 0.12.0; it was never released. Its eighteen specimens and the hand-labelled reference stay, as test fixtures for `013`'s accuracy test. The research memos that cite it stand as the record.
- **Properties under Meridian.** The `013` spec review asked what "properties stay in the body" means once Meridian's map is adopted. **The owner:** Meridian's split. Fields and member access are text; JSON keys are function; HTML attributes are meta; CSS property names are keyword. This supersedes "properties in the body colour" in the entries below wherever they differ.

### One release, 0.12.0, for the white ground and tree-sitter (2026-11-14)

Asked whether `014` (the white light-mode code ground) ships alone as 0.12.0 with `013` (tree-sitter and Tombaugh) following as 0.13.0, or both ship as one release, **the owner:** one release, 0.12.0. `014` is built and change-reviewed first; `013` is built on it; both are tagged together, with one changelog entry that marks each interface change.

### Tombaugh, a number role, the white ground first, and docstrings as strings (2026-11-14)

Specification `013` was drafted with three questions for the owner; the owner also asked for a number role.

- **A number role.** **The owner:** "can we create a number role? I want it to be orange." Meridian folds numbers into its constant role; this system keeps them apart, so ten roles take colour (Meridian's seven, number, and the diff and link roles `013` keeps). To make room beside orange, the constant moved a touch toward yellow (hue 85).
- **The palette: Tombaugh, with the two swapped.** Asked whether `013` ships Tombaugh or Meridian, **the owner:** "tombaugh, but swap the colors for constants and numbers, numbers should be yellow." Numbers are yellow (`#856300` light, `#E6B543` dark) and constants (booleans, null, ALL_CAPS names, enum members, symbols) are Pluto's orange (`#A34D15` light, `#FFA373` dark). The values are in `research/2026-11-14-meridian-and-tombaugh.json`. Yellow and orange sit close for a reader with deuteranopia; numbers are digits and constants are words, so their shape tells them apart.
- **The light ground: white, first.** On Pluto's shipped light code ground (`wash`), tuned Tombaugh's constant and comment fall just under AA. Asked whether to darken every light colour one more step or land the white light-mode code ground first, **the owner:** land the white ground first. A specification of its own changes the light code ground to white and lands with or before `013`; it must settle the open question of code on a white card (`research/2026-11-14-code-on-a-white-card-once-the-code-ground-is-white.md`). Dark mode keeps its ground. This narrows "Only the syntax colours change, never Pluto's backgrounds" below: the page canvas and dark grounds still never change.
- **Docstrings are strings.** Asked whether a Python docstring takes the string or the comment colour, **the owner:** string, as GitHub and VS Code colour it.

### Code takes Meridian's roles (2026-11-14)

The owner gave a syntax theme guide of their own, Meridian, kept as `research/2026-11-14-meridian-the-owners-syntax-theme-guide.md`. **The owner:** "I want to use this for our syntax highlighting colors. You may adjust the colors slightly to better match the pluto 4 colors, but use the same color role organization."

- **Meridian's role organisation is adopted whole:** its seven coloured roles (keyword, function, type, string, constant, meta, special), comment and text; its role map (what gets each role, across tree-sitter captures and TextMate scopes); and its rules (colour carries meaning, one lightness per mode, red is rare, comments recede, regular weight, comments the only styled role).
- **Its colours may move slightly toward the four Pluto colours** (the mark's blue, red, amber and green). Meridian's lightness plan and its contrast limits hold, measured again after any move.
- **It supersedes, where they differ:** the owner's first picks ("The owner's code palette, first picks": `self` in the body, tags blue, numbers red, escapes plum, built-ins navy) and the earlier ban on yellow, since Meridian's constant is yellow. Properties stay in the body, as before.
- **No italic comments, and no bold.** **The owner:** "no italized comment either." Every token is set at regular weight and upright; comments recede by colour alone. This departs from Meridian's guide, whose one styled role is italic comments.
- **Meridian and Tombaugh, to compare.** The owner asked to see Meridian beside a Pluto-adjusted version, named for Pluto. Tombaugh (Pluto's discoverer, and its heart-shaped region; not Charon, which the design book already uses for its blue) keeps every Meridian role and lightness and moves only the blue, green, yellow and red: each takes the Pluto mark colour's hue and moves halfway to its chroma. Both are in `research/2026-11-14-meridian-and-tombaugh.json` for the workbench; which one `013` ships is the owner's choice. At the owner's word ("improved contrast, I see some warnings in the viewer"), Tombaugh was then tuned: one lightness shift per mode (light 0.03 darker, dark 0.02 lighter, about 2 to 3 ΔE), comments raised to AA, and a gentler 13% blue selection, so every colour passes 4.5:1 on the ground, the active line and the selection in both modes, and dark colours meet Meridian's 6.5:1. The selection there is the workbench's proposal, not a Pluto token.
- **Only the syntax colours change, never Pluto's backgrounds.** Asked how Meridian's surfaces sit beside Pluto's canvas, **the owner:** "do not change the pluto background colors, only the syntax highlighting." Meridian's surfaces (its background, panel, line and selection) are not adopted. The code ground, active line and page keep Pluto's own colours, and Meridian's token colours are tuned to meet its contrast limits on Pluto's grounds instead of its own. The white light-mode code ground stays a separate matter (the 2026-11-14 entry on the code ground and its placeholder memo).
- **It joins specification `013`,** which already rewrites how code is labelled for tree-sitter: the code slots become Meridian's roles, with the few the guide does not cover (diff lines, links) kept and said how.

### Code is highlighted by tree-sitter, in blocks and the editor (2026-11-14)

The owner asked how code can be highlighted "to 100% accuracy" and whether Shiki is the right pick. `research/2026-11-14-how-to-highlight-code-accurately.md` measured seven approaches against a hand-labelled reference (`research/2026-11-14-highlighting-reference.json`). tree-sitter with this system's own queries scored 96.6% on the workbench specimens and 95.5% on held-out samples; Shiki stalls near 88% however many theme rules it is given; the editor (Lezer and legacy modes) scores 73.5% and agrees with the code block on 74.2% of characters.

- **Where tree-sitter runs.** Asked whether at prerender and in the browser, at prerender only with Shiki live, or not at all, **the owner:** at prerender and in the browser. One engine, so a block looks the same static or live. Languages without a usable tree-sitter grammar fall back to Shiki.
- **The editor.** Asked whether the editor follows in its own specification later, in this one, or not at all, **the owner:** include it now. One specification moves the code block and the editor together.

### The owner's code palette, first picks (2026-11-14)

At the workbench, after `research/2026-11-14-syntax-colours-without-amber-or-cyan.md`, the owner chose slot by slot. Recorded as data in `research/2026-11-14-the-owners-code-palette.json`, which the workbench offers as "The owner's picks".

- **The owner's slots:** keyword and tag `syntax-blue` (a code-only copy of `primary`); constant `syntax-amber`; string `syntax-green`; number `syntax-red` (a code-only copy of `destructive`); escape `syntax-plum`; function, built-in and decorator `syntax-navy`; type `syntax-violet`; self in the body.
- **Amber, retuned at the owner's word** ("increase contrast and … more yellow a touch"): OKLCH lightness 0.04 further from the ground and hue 8° toward yellow. Light `#915B00` to `#7C5500` (6.65:1 on white), dark `#F19E20` to `#F6B128` (7.84:1 on `#2C2821`). Amber returns to code for constants, by the owner's choice, after the research left it out.
- **Slots the owner did not name** follow Ink and Plum: property in the body (the owner's earlier ruling), comments in `syntax-comment` and italic, links and changed lines blue, inserted green, invalid and deleted red, and Ink and Plum's ground, active line and selection.
- **Measured** with the workbench's functions: every text slot passes AA on the ground, the active line and the selection in both themes (lowest: dark comment, 4.98:1); no pair of slots on different swatches is under ΔE 10.

### A code-palette workbench (2026-11-14)

The owner asked for "an app that lets me adjust the code syntax highlighting colors and selections", with code "that shows all types and in different languages", in light and dark mode. The owner's request is the commission:

- **Where it lives.** A route in the preview app, `/workbench/code/`, under its own `(workbench)` layout. It is a research instrument, like `/identity`: not a registry item, so the literal lint does not cover it, and its values are candidates the token file does not hold.
- **What it does.** It opens on the shipped palette, read from the token file at prerender, with light-mode code on white: the owner, the same day, "the light mode code background color should be white", not `wash`. The ground and the active line become code-only swatches (white and today's dark ground; the page canvas and today's dark active line), so no shared role is retuned. The shipped palette, on `wash`, stays one choice away. Every code slot names a swatch; every swatch has a light and a dark colour, set by picker, hex or OKLCH sliders. Bold, italic and underline can be laid over a slot. Light and dark previews redraw together, under simulated colour-vision deficiencies or in greyscale. Each slot's WCAG contrast is read on the ground, the active line and the selection, and close pairs are flagged by OKLab ΔE. The result exports as a palette file and as a change to the token file.
- **A proposal it adds.** A `selection` slot, which the token file does not have (the editor uses the browser's own selection). It starts as the brand blue a quarter of the way over the code ground, so its contrast can be judged; at that share most accents fall short of AA on it.
- **Proposed highlighter rules, on by default.** Previewed with a second highlighting at prerender; the shipped highlighter is unchanged until a specification adopts them. (1) Shell: the owner, in `pip install x`, "install x shouldn't have syntax highlighting". A command keeps its colour; its bare arguments, flags, case patterns and loop words take the body; quoted strings and heredocs stay strings. (2) A number is one colour: the theme's `storage` rule painted Python's `0x` of `0x2A` and `j` of `3j` as keywords, and Go's `_` and Rust's decimal `.` fell to the body. (3) A docstring is a string, as GitHub and VS Code colour it; `007` sent it to the comment slot, and the owner read that as a parsing fault.
- **Its specimens.** Eighteen programs in eighteen languages, written for it in `src/lib/workbench/specimens.ts`, which together put every text slot on screen; the highlighter gallery's twenty-six samples are offered beside them.
- **Its checks.** `tests/unit/workbench.test.ts`: the colour arithmetic agrees with `scripts/contrast.ts`, the baseline equals the token file in both themes, export and import round-trip, and the specimens cover every text slot.

### The code ground in light mode is the owner's to change, and code on a white card is for this system to work out (2026-11-14)

Raised from the vfs docs site, which installs this system at `v0.11.0`. The owner, on seeing its code blocks: "we need to update design system to have code blocks in light mode be white or lighter than the background, not darker." The research is `research/2026-11-14-a-white-code-ground-in-light-mode.md`. Its questions were put to the owner with options and a recommendation.

- **The light-mode code ground, and whether dark mode follows it.** Asked whether to use white with dark mode unchanged, the `card` colour in both themes, a new tint, or no change, **the owner:** "I'll fix this in the design system". The owner makes this change himself. Nothing is built from the memo's recommendation until he does.
- **Code on a white card, in `live-console` and `stage-card`.** Asked whether those blocks keep today's `muted` inset, take the page colour, sit flush with a hairline, or sit flush with none, **the owner:** "please mark this as something the design system needs to figure out". It is not decided. It waits as a placeholder memo, `research/2026-11-14-code-on-a-white-card-once-the-code-ground-is-white.md`, and the specification that changes the code ground waits on it.
- **A second need from the same site** is recorded beside it and has not been asked of the owner: with scripts turned off, a reader whose system is dark gets the light theme, because the `theme` item sets the `dark` class by script alone. It waits as `research/2026-11-14-the-theme-with-scripts-turned-off.md`.

### Frost only: the lens is removed (2026-11-07)

After the bar lost its lens, the scripted scroll in headless Chromium still ran 13 of 100 frames over 20 ms (worst 33 to 50 ms), all while the hero's lensed panel was on screen; without the lens, none (EXECUTED by the `012` builder). Asked whether to keep the lens and verify on a real GPU, drop it, or run it only when the page is still, **the owner:** "Frost only, no lens."

- Liquid glass is frosted and lit at the rim. No displacement filter, in any engine.
- Removed before release: `GlassLens`, the `expressive.glass.lens` tokens and the `--glass-lens-*` variables, the lens rule and its sticky-bar exclusion, `data-glass-lens`, and every test, page and changelog line that names them. `pointerLight` stays.
- `011` decision 8's lens and `012` decision 7's `GlassLens` are superseded by this entry; `012`'s build removes them, and both specifications' landing notes say so.

### After the `012` build's checkpoint (2026-11-07)

The design lead looked at `/view/product-home/` at 1440, 1024 and 390 px in both themes, the hero and the bar cropped at 1440, the bar in dark over graphite and over the hero, and `/identity/light/` and `/identity/motion/` before and after (pixel-identical). The hero reads as decided: words on frosted glass over the blue field, the object clear of the glass, the field's colour seen through the overlap. The bar floats; in dark it shows the lifted four and is told from graphite by its edge, and its text reads.

- **The sticky bar's glass takes no lens.** With the lens on in Chromium, the scripted scroll had mean frames of 19.5 to 19.8 ms and 16 or 17 of 100 frames over 20 ms (worst 50 to 67 ms), all while the bar's lensed glass passed over the hero's lensed glass; with the lens off, 16.67 ms and none over 20 ms (EXECUTED by the builder, headless). The bar moves over the content on every scroll frame, so it keeps its frost and loses the lens; glass in the content keeps it. The lens rule in `pluto-theme` excludes glass inside `[data-sticky-bar]`. The frame time is measured again after the change.
- **Accepted:** the Phase A deviations the builder listed (decisions 5 to 8 pulled forward where Phase A's tests or decision 1's removals needed them; `border border-border`, since a bare `border` draws ink in this theme; "rim" reworded to "edge" in `liquid-glass`'s comment and description, which criterion 1's tokeniser reads; six registry descriptions reworded; 20 `glassOverGlass` rows with the canvas case; the two figures `contrast.ts` rounds differently; the 2000 px scroll at 390 × 640; the poster view without an object; `data-ground` on `stage`).

### After the `011` build's checkpoint 2 (2026-11-07)

The design lead looked at the `pluto-theme` page's expressive section, the `liquid-glass` page, the header lockup at 2x and the footer endorsement, in both themes. The four fields read in both themes; a card and a glass inside each field take the theme's own roles back; the lockup matches the exhibit's E6; the product header's mark is paper in dark (`008`). Calls on the builder's Phase B deviations:

- **Accepted:** `glass` also sets `color: var(--foreground)`, so untagged text in glass on a field is not the legend; the entrance as a timing-less shorthand naming both keyframes plus a timing longhand, because Tailwind 4.3.3 keeps a theme `@keyframes` only when an `animation` shorthand names it (EXECUTED by the builder), with the same fallback the specification intends; the lint's new `items` and `allowances` parameters; eleven ring-on-glass rows; `meta.since` on twelve items, `liquid-glass` included; the changelog dated "unreleased" until the tag; card titles at `level={5}` for heading order; `data-slot="glass-lens"`; the two tests that read the keyframes' easing and normalise the `@supports` prelude.
- **Watched at `012`'s checkpoint:** dark glass on the graphite canvas (`#16140FD6` over `#16140F`) is told from the ground only by its edge. Over the lifted fields it reads clearly. The floating bar in dark is where it will show.

### After the `011` build's checkpoint 1 (2026-11-07)

The design lead looked at `button`, `card`, `dialog` (open), `code-block` and the app-shell view at 1440 px in both themes, with the palette, the roles, flat overlays and H1 built. The warm canvas and graphite read as one family; overlays read flat by their edge alone; the code palette holds. Calls on the builder's deviations:

- **Accepted:** decision 11's forbidden reshape done early (`measured` and `ruleOnly`), because the palette moved it; the three "pill actions" descriptions in `registry.json` corrected with decision 1's list; the `pluto-theme` copy that the palette made false (elevation, groove, the ink surface, the ring figures); the A2 groove pins at Chromium's painted value, one step below the arithmetic, as the old test pinned.
- **Accepted, to be named in the landing notes:** the extra test groups criterion 15 did not list (`blocks.spec.ts` A2, the primitive count 34 → 35, `007`'s nine-primitive test, the `syntax-amber` hexes).
- **Accepted with a note:** the dark expressive marks come from a constant in `build-tokens.ts` that names the four lifted primitives and reads their values from the token file, so no hex is written twice.
- **Recorded:** the e2e edits were written before the code but not seen failing first; only the unit suite was (159 failures). Phase B runs its new e2e tests red before its code.

### One release, 0.11.0, and the calls of the `011` and `012` spec reviews (2026-11-07)

Asked how `009` and `010` ship, given that `011` and `012` change them (`reviews/012-the-compositions-on-brand-spec-2026-11-06.md`, finding 8). **The owner:** one release, 0.11.0.

- 0.9.0 and 0.10.0 are never tagged. Their changelog entries fold into 0.11.0. Every item they added carries `meta.since: "0.11.0"`. The built snapshots `static/v0.9.0/` and `static/v0.10.0/`, never published, are deleted.
- So nothing `009` and `010` built has been released, and `012` may remove or change any of it without an interface-change note.

Calls the design lead makes under the owner's rulings, from the two spec reviews (`reviews/011-the-brand-spec-2026-11-06.md`, `reviews/012-…-spec-2026-11-06.md`):

- **Three text tones move from B3's values.** Deep Field's `red-text` `#C81F34` and `green-text` `#007651` fail AA on their own 10% tints over the warm canvas (4.26, 4.34) and green on `muted` (4.49); `cyan-text` `#1B709B` fails as a code slot on the new `muted` (4.35). Each moves to a passing value as close to B3's as was found: `red-text` `#C11E31`, `green-text` `#007351`, `cyan-text` `#1A6C97` (`011` decision 2; the lighter red and green were the reviewer's, re-measured). The four brand colours themselves are B3's exactly.
- **I5's "hairline only" reaches the groove.** The light theme's `groove-light`, a white line beside every groove, becomes clear, as the dark theme's already is.
- **The forbidden status tints stay forbidden by rule.** On the new palette two dark rows pass; the ban (`001` decision 8) is kept as a structure rule, with the light row as its measured witness.
- **"Glass never on glass" means nesting.** A glass element never has a glass ancestor. A sticky glass bar passing over a glass panel as the page scrolls is allowed: the second tint only makes the backdrop more like the tint, and a measured row proves the bar's text there.
- **The four colours of the mark show in dark on expressive pages.** `008` set the dark theme's mark to paper for product screens, and that stays. Under `data-mode="expressive"` in the dark theme the mark takes the lifted four, as the coloured dots on dark grounds have since the public-readiness review.

### The identity: round two answered (2026-11-06)

The owner answered round two (`handoff.md`, round two; the three research memos of 2026-11-06).

- **E6, risen colon, closer and lower.** Lowercase "pluto", bold. The mark at .26 em dots and .07 em gap (N1's proportion), .10 em from the word, its top .16 em above the ascender (.90 em above the baseline).
- **No signature device, for now.** None of F1 to F10 works. The brand goes without one until a need names it; the device memo stays as research.
- **G5, flat colour tile.** An 8 px tile in the app's hue with a white Phosphor glyph, ink on yellow. Two apps per hue: Docs and Search blue, Sheets and Chat green, Slides and Files yellow, Mail and Calendar red. The radius scales with the icon: 8 px at 64, 6 at 48, 4 at 32, 2 at 16. An icon is one drawing scaled as a whole, so H1 holds at the master size.
- **I5 with I9: platinum flat, liquid platinum on expressive pages only.** The warm canvas `#F3F0E8` and graphite `#16140F` replace Deep Field's paper and ink grounds. Every product screen is flat: hairlines and flat fields, no shadow, no glass. Liquid glass (frosted tint, a rim highlight that moves only with the pointer, a Chromium-only lens over a frosted fallback) appears only on expressive pages, over flat colour fields. No keys. Glass carries ink, inkSoft and blue text only, and turns opaque under reduced transparency, forced colours, or no backdrop-filter.
- **The mark is a logo, exempt from the 3:1 graphic rule.**
- **One yellow, Deep Field's `#F19E20`, everywhere, with no adjustment.** Asked whether another yellow would serve better on light grounds, the design lead measured the candidates (EXECUTED, 2026-11-06, WCAG 2.2 formula): a yellow reaches 3:1 on `#F3F0E8` only as amber-gold `#C27B00` (3.01) or mustard `#AD8500` (3.01), which read as orange-brown and olive beside the other three. Offered a deep yellow for meaning on light, or a ring, the owner's word: "just keep it as is, no adjustments." The constitution's §4.4 still binds: where yellow carries meaning on a light ground (a status, a chart series), colour is never the only signal; a label, a legend or a value carries it too, as the registry's status and chart items already do.

### The identity: the owner's first answers (2026-11-06)

The owner answered the fourteen questions of `research/2026-11-01-the-identity-options.md` at `/identity`. Ten are settled. Four go to a second round of options.

**Settled.**

- **A4, open platform, branded suite.** Every workspace product is Pluto-branded (Pluto Docs, Pluto Sheets). Each open-source core technology keeps its own name, as `vfs` does.
- **B3, Deep Field.** The four colours take the Deep Field values measured in `research/2026-11-01-how-the-four-colours-are-tuned.md`.
- **C2, four-colour moments.** Product screens stay neutral. The four colours appear together only in owned moments.
- **D1, kept.** IBM Plex Sans, Geist and JetBrains Mono stay. No typeface is commissioned. The owner's answer held a line reading "1" before "Kept: Plex, Geist, JetBrains"; the design lead reads both as D1.
- **H1, exact.** One 8 px case radius; round only for dot shapes.
- **J4 springs for the dots only; J2 for everything else.** The mark and anything made of its dots may spring. Every other animation answers the visitor and nothing else.
- **K3, poster.** The expressive mode's display type may reach 160 px.
- **L3, warm and human.**
- **M1 to M4, all four.** Product truth, figures, people at work and abstract data are all sanctioned. Each page chooses the one that fits its job.
- **N1, kept.** The dots keep today's order (blue, red / yellow, green) and spacing (dot .30 em, gap .08 em). The research found a fragment of this mark can read as Google's before it reads as Pluto's; the owner keeps it knowing that.

**Second round.**

- **E, the wordmark.** E1, the risen colon, stays, with lowercase "pluto". The mark comes in closer to the word, as it sits in E3. Variants of E1's spacing go on the wordmark board.
- **F, the signature device.** None of F1 to F5 speaks to the owner. New options, themed on space or on Pluto itself.
- **G, product icons.** Basic glyphs from Phosphor (an MIT-licensed icon family). The icons are not tied to the four dots: G1's mark cell is out. Options for the tile around the glyph go on the board. Phosphor is already a named, pinned dependency: `phosphor-svelte`, added by `002` for interface icons (research/2026-11-06-phosphor-icons-and-the-product-icon-tile.md).
- **I, light and depth.** The owner likes flat objects, coloured backgrounds and glass, but not how the boards draw them. Asked to name a feeling, the owner's words: "some how invoking early computing with the off white chunky keyboards and square apple II. I like the rainbow colors with the off white canvas. We should bridge that gap from that to newer liquid glass style design." That is the brief for the new options. Prior art is studied, never copied: no option reproduces another company's logo, stripes or product.

### After the `010` build's checkpoint (2026-11-01)

The design lead looked at `/view/product-home/` at 1440 and 390 px in both themes, idle, running and done. Calls:

- **The bar floats over the first stage.** In the light theme the sticky bar over the page's ground read as a grey band above a black stage. `marketing-bar` gains `overlay`, `stage-hero` gains `underBar`, and the block sets both (`010` decisions 4 and 5, criterion 4).
- **The Python card splits its first line** so no line scrolls in the half-width card: `db = DatabaseStorage(url=DATABASE_URL)` then `fs = VirtualFileSystem(storage=db)`.
- **`stage-card` drops `read-token`** from its dependencies; it reads no token.
- **`product-home`'s smoke test is its own file.** `blocks-add`'s check that a block imports its `components/<block>-…` files does not fit a block made of ui items.
- The builder's other choices stand: the sample copy it chose, "Ran. 1 line." in the singular, the bloom lit after success and dark after failure, a tab change clearing the console's output, and code samples that hold no path literal under the blocks' link rule.

### After the `009` build's checkpoint (2026-11-01)

The design lead looked at the `pluto-theme` and `button` pages in both themes after decisions 2, 7, 8 and 9 were built. Productive screens are unchanged; every button measures 8 px. Two calls:

- **The version moves to 0.9.0 at the start of the build,** not at its commit, so the dev server's registry rebuild writes `static/v0.9.0/` and never overwrites the frozen `static/v0.8.0/`.
- **`cn` does not merge `rounded-action` with `rounded-none`** (EXECUTED by the builder). Superseded after the change review: `button` now uses `rounded-[var(--radius-action,var(--radius))]`, which carries its own 8 px fallback and which `cn` merges, so no override note is needed (`009` decision 8, change review finding 1).

The identity exhibit adds six font packages, not seven (`geist` was already listed); `009` criterion 15 is corrected.

### The identity is commissioned, with options (2026-11-01)

The owner commissioned the design lead to build Pluto Systems' identity, answering `research/2026-11-01-what-a-product-site-needs-to-compete.md`. The owner's rulings:

- **One constraint: compete with Google.** The owner's words: "the only constraint is 'we need to compete with Google'; operate under no other constraints on design choices." The design book's five laws, its colour budget, its motion budget and its ban list become prior art to weigh, not limits. The constitution's engineering rules still hold: source not a package, tokens the one source, WCAG 2.2 AA and keyboard use in both themes, every input pinned.
- **The mark keeps its four colours.** The four-dot mark keeps a blue, a red, a yellow and a green, as Google's and Microsoft's marks keep theirs. Their exact values are open.
- **Options, not one answer.** Each identity question is answered with three to five options. The owner reviews them together at the end, gives feedback, and the brand is refined from it.
- **What Pluto Systems is.** A workspace suite on one centrally governed data layer, built for agentic search. The thesis and tagline: **"Work runs on data."** Data means structured data and, increasingly, the unstructured but tokenizable content AI models understand and act on. The data platform has interfaces and indexes built for AI and agentic search (a multimodal CLI served over MCP, with grep, glob and search over enterprise-scale data), and one cloud-ready kernel as the single gate for permissions and governance across every product. The `vfs` repository is that platform; a workspace suite, in the manner of Microsoft Office, is built on it.
- **How far before review.** Research, the option boards, and the specification, review and build of the direction-agnostic architecture (expressive mode, its tokens and lint profile, the brand slots and the page compositions) on today's assets. The owner's picks then fill the slots.
- **Where the options live.** A route in this repository's preview app, `/identity`. It is a research exhibit, not a registry item, so the literal lint does not cover it.
- **Nothing goes to GitHub** until the owner asks.

### One system, many products (2026-11-01)

The design system serves every Pluto Systems product, not one site. A product may have its own logo, name and copy. The owner's rulings:

- **Identity only.** A product sets its logo, its name and its copy. Colours, type, spacing, radius and motion stay shared, from the one token file, checked for contrast in both themes. A product accent waits for its own specification, written when a product needs one (constitution §4.2).
- **Its own logo, with its name as the fallback.** The shell takes a product's logo as a snippet: an SVG, an image or markup. Without one, it sets the product's name as a text wordmark in the heading face.
- **An optional endorsement.** The footer can carry one line, "A Pluto Systems product", off by default and turned on with one prop. When a reader hovers the line, the four dots of the Pluto mark appear beside it.

After the specification review of `008` (`reviews/008-product-identity-spec-2026-11-01.md`), three more rulings:

- **The hover reveal is a response, at most 200 ms.** The dots take the entrance's path with every timing scaled to `--motion-micro`: 110 ms per dot, delays 30 to 90 ms, the last at its place at 200 ms. The design book §06 keeps its one 900 ms entrance per page, and §09's "no second entrance animation" holds.
- **The endorsement is not the lockup.** It is words with the mark beside them, not the "pluto" wordmark, so the 20 px minimum for the lockup does not bind. The line stays small, under the footer's rows.
- **No amendment to the constitution.** Its §1 already serves "every Pluto Systems application". The rule lives here and in `008`.

The design lead adds, under the same ruling: the system's own names stay (`pluto-theme`, the `pluto:` context keys, the `four-dot` item). They name the system a product is built from, not the product.

### After the public-readiness review (2026-11-01)

The repository was read in full before public viewing. The owner's rulings:

- **The whole `context/` record is rewritten in place** so each file stands alone for a stranger. Research memos keep their dates and their labelled claims; an exception to "a memo is never edited", recorded here, is this rewrite, which removes names, paths and pointers and closes each "unknown" with its later answer or a stated limit.
- **"Done" is never an app's adoption.** This repository is developed over time to meet the needs of Pluto Systems, PBC; a specification is done when its criteria are met here, its change is reviewed and the release is tagged. The constitution's §2 and §4.2 are amended; every specification's app-side criterion becomes a release criterion.
- **Licence: Apache-2.0**, copyright Pluto Systems, PBC.
- **No person is named** in any document; the roles of the constitution's §5 are used instead.
- **No external pointer** remains: not to another repository, a local path, a working session's files or a private link. The design book stays as a named source, by section, without a path.

Two questions that had waited on the owner are settled by the design lead under the same ruling, so that no open item remains:

- **The icon on ink.** The four-dot mark's coloured dots on the ink surface use the lifted primitives (`*-lifted`), which the palette already holds for contrast on dark grounds. The light blue `#2456E6` measured 2.71 on `card` and 2.32 on `muted`; the lifted blue `#7A9BFF` measures 6.85 on `background`, 6.10 on `card` and 5.22 on `muted` (computed with the WCAG 2.2 formula, 2026-11-01), above the 3:1 a graphic needs.
- **Browsers and assistive technology outside this release.** Firefox, Safari, iOS Safari and screen readers are not checked by this release and are recorded as limits, not as pending work. A release that adds them says so in its specification.

### After the `006` change review (2026-11-01)

From `reviews/006-the-app-shell-and-the-chat-pane-pr-2026-11-01.md` (3 Medium, 5 Low; "does not land yet"). The calls among the fixes:

- **A block never overwrites an item's `data-slot`** (R20): the shell's parts carry `data-shell` attributes, as the chat's carry `data-chat`. Four shell parts had passed a second slot.
- **The fence splitter takes any info string**, reads the first word as the language, closes only on a bare fence, strips carriage returns, and keeps an unclosed fence as a block. A unit test file covers the cases.
- **No "unknown" commit.** When neither the CI variable nor git answers, `version.name` is Kit's own timestamp, which the layout already treats as no commit: the footer shows no commit row and no built row. A row reading "unknown" is furniture carrying nothing (R24).
- **bits-ui writes `data-state`, not `data-open`**: the caret turns on `group-data-[state=open]`. `005`'s sidebar files are checked for the same habit.
- **The "Latest reply" row keeps its height** whether or not the button shows, so the log does not resize when a reply ends.

### After the `006` build's second pass (2026-11-01)

From the builder's final report, the chat views and the fixed sidebar shell read.

- **The sidebar's offset under the sticky header is `md:top-16 md:pb-16`**, prefixed, so the sheet's nav below `md` is untouched: an unprefixed `pb-16` would lift the sheet's account row.
- **A sticky sidebar holds only while the page is taller than it.** The example page is shorter, so the test lengthens `main` before scrolling, as an app page would be. Not a defect of the shell.
- **The chat pane's parts are `data-chat` attributes**, not second `data-slot`s, so each root keeps its stock slot (R20).
- **The streaming view's half-written reply is prose**, since an open fence would add two stops to the view's count; the fence splitter still handles an open fence in the pane.
- Counts corrected from the spec: 20 components (6 + 4 on `003`'s 10, not 19); 62 toolbar stops (the spec's 58 left out Open alone and the frame on each new toolbar).
- Both deferrable views (`sidebar-icon`, the chat `error`) were built; nothing is deferred.
- The one smoke flake, `001`'s dev-loop watcher under the seven-block install's load, passed alone and in an earlier full run; recorded as a flake.

### After the `007` change review (2026-11-01)

From `reviews/007-the-full-highlight-palette-and-the-ink-surface-pr-2026-11-01.md` (3 Medium, 6 Low; "does not land yet"; all three Mediums in the editor's roles plugin). The calls among the fixes:

- **The roles plugin follows the parse tree**, not only the document and the viewport: text parsed after the first chunk took its roles only once something moved. It now rebuilds when the tree changes, as CodeMirror's own highlighter does.
- **A docstring is the first statement, whatever comments precede it**: a shebang, a licence comment or a same-line comment on the `def` line had turned it back into a string.
- **A keyword argument named like a built-in stays in the body** (`f(type="x")`), as decision 2 says for both engines.
- **The shell's `$*`, `$@` and `$?` are keys, not `self`**: Shiki scopes them `variable.language.special`, which now goes to `property`; `self`, `this` and `super` keep `variable.language`.
- **One id for the shell, `bash`**, with `shellscript`, `sh`, `shell` and `zsh` as aliases, in the highlighter, the languages table and the page.
- The token file keeps its own formatting; a tool that rewrites it must preserve the untouched lines.

### After the `006` build's checkpoint (2026-11-01)

Made by the design lead from the builder's checkpoint report, the entrance frames, the sidebar shell and the footer read.

- **The entrance is right**: at 300 ms the blue and red dots are mid-dock and the amber and green not yet begun; at 900 ms the mark is composed; under reduce the mark is composed at load; a client-side navigation replays nothing. The footer at 360 wraps to one column with the source link broken at a slash.
- **With a sidebar, the shell's header is sticky.** The checkpoint showed the sidebar's account row cut off by the header's height at load: `005`'s sidebar is `sticky top-0 h-svh`, and under a header that scrolls away it is only whole once the page has scrolled 64 px. A sticky sidebar beside a scrolling header is two scroll behaviours on one screen. So the header is `sticky top-0 z-20` whenever the sidebar is on, and the sidebar is offset under it with `top-16 pb-16` through its `class` prop: the box keeps `h-svh`, its last 64 px are padding below the viewport, and the account row sits at the viewport's bottom. No new utility, no arbitrary value. Without a sidebar the header is not sticky by default, as `006` decision 6 says; the one line is the app's. Decision 6 reads so.
- The checkpoint's deviations from the specification are accepted as the least that works: the validator caps the entrance at the budget; `mark-entrance` targets child dots; the header's box is 65 px with its hairline; with a sidebar the account lives in the sidebar's footer and the header shows no account menu; the Preferences group is closed by default; the account trigger is named by `sr-only` text (axe's label-content-name-mismatch); the nav sheet closes after navigation; the shipped `sourceHref` is this registry's repository, with a comment; the three state views share one preview component; the footer's source link wraps at 320 px.

### After the `007` build's checkpoint (2026-11-01)

Made by the design lead from the builder's checkpoint report on the `007` branch, the gallery and surface screenshots read.

- **Cyan stays for `property`.** On the Python class sample at 2× and at native size, teal type names and cyan attributes read as two colours (teal the greener), and cyan sits well apart from the keywords' blue. The magenta fallback of `007` decision 3 is not taken. A type and an attribute never share a syntactic position, so the closest pair costs the least.
- **The surface reads as specified**: ink on paper with the editor and the block flush, the pill strip and the meter's track on the wash inset, the popover dark inside the panel, the dialog white over the page's scrim.
- The checkpoint's deviations from the specification are accepted as the least that works: C2 rewritten with the theme (the old assertions broke at once); the keyboard ring helper reads `--ring` where the element sits, so the dark ring inside a surface on a light page passes; the surface's two tab panels carry `tabindex={-1}` so the fixture counts 7 stops (bits-ui's panel is a stop); the gallery's blocks keep their `pre` stop; `@property` tokenises as a decorator mark plus a teal `property`, and `int(c)` and `str(d)` are types to Shiki, not built-ins, so C2 reads `builtin` on `divmod`, `all`, `range` and `print`; the samples are 10 to 15 lines.
- The suites ran on a second port while the `006` build held the first; nothing tracked changed.

### `007` builds in parallel with `006` (2026-11-01)

Asked whether the highlighting pieces were built: not yet, specified and reviewed, queued behind `006`. **The owner:** "start working on 0.7.0 in parallel." So `007` builds on its own branch over `v0.5.0` (`616b8a0`), while `006` builds on `main`. `007`'s counts stand on `005`'s landed numbers, not `006`'s predicted ones; its Landing notes say so. Whichever lands second rebases onto the other before its change review; the expected overlaps are `registry.json`, `pages.ts`, the axe and keyboard counts, `package.json`'s version and the changelog. The surface fixture composes `005`'s dialog and dropdown menu, which `v0.5.0` holds, so `007` does not need `006` to build.

### Two writing and furniture rules join the checklist (2026-11-01)

At the owner's word, two rules join the review checklist. Both are rules of writing and furniture that the design book's own pages already keep; the checklist now states them so review can hold them.

- `002` decision 9's checklist gains **R23** (copy says what happens: active names, one name through a flow, errors that direct, empty states that invite) and **R24** (furniture carries information: no all-caps, no eyebrow over every heading, no middle-dot meta strings or arrows in copy, no card kit; the book's own mono eyebrow and footer rows are choices and stay). Both are review's, not the lint's.
- Checked on the day: the registry and the site hold no all-caps, no arrows in copy, no em-dash labels. The lowercase mono eyebrow with middle dots (home, hero, card captions) and `006`'s footer rows are the book's.

### Syntax highlighting is a function, outside the colour budget (2026-11-01)

A consuming app, restyling itself to the design book, asked for four things in a tagged release: fuller Python highlighting, a sanctioned ink surface for its run panel, the mark's entrance, and the footer's furniture. The last two are `006`'s. The first needed a ruling, since `004` had kept the palette to the text-safe brand colours under v2 §03 ("no new hues"; the four colours together only in the mark and in data figures). Put to the owner with three options. **Answered:** "we should have full syntax highlighting as a dev would expect from something like PyCharm or VS Code. This in no way impacts how colors and accents are used, this is a functional feature."

What follows:

- **Code colour is functional**, as state colour is (decisions.md, "State colour is outside the one-accent budget", 2026-10-28). The highlight palette may use as many hues as a Python editor needs, with a light and a dark value each, every one passing AA on every code ground. v2 §03's budget binds surfaces and brand copy, not the tokens inside a code block; the book gains a one-line note when it is next revised.
- `007` specifies the full palette (the slots an editor shows, the two engines' mappings, the contrast table) and the ink surface that app asked for. The `--code-*` map stays the one place a highlight colour lives (`004` decision 19); it grows.
- **Every major language, not Python alone.** The owner added: "we should have full coverage of all major coding languages." So the palette's slots are the language-agnostic roles an editor theme colours (a TextMate scope family, a Lezer tag), the code block's grammar list grows to the major languages, and the editor gains a language package per major language, each pinned and loaded only when used. `007` names the set and what each costs.
- The research memo of the same day, `a-fuller-python-palette-within-the-books-rules`, turns from three options to one: what a full palette is, across languages, and what it costs.

### After the `005` change review (2026-11-01)

From `reviews/005-overlays-navigation-and-the-chat-primitives-pr-2026-11-01.md` (2 Medium, 7 Low; "does not land yet"). The design calls among the fixes:

- **The log releases its following only on a gesture that can move away** (a wheel upward, ArrowUp, PageUp, Home), never on one that moves nothing at the end. Measured: a wheel towards the end, or End, at the end released the follow with no scroll event to re-arm it, and the next stream left the box behind.
- **A top or bottom sheet is capped at the viewport's height** and scrolls inside. A tall body had put the title and the close button above the viewport.
- **The inset's groove is drawn only while the sidebar is visible**: open, or collapsed to icons. Off-canvas, the groove would be a 2 px seam at the viewport's edge.
- **The log's floating button may cover the corner of the last bubble while the reader is scrolled away.** Accepted: it is shown only then, padding cannot help mid-scroll, and the one way never to cover text is to place the control outside the box, which is `006`'s composition. The page says so.
- Booleans never render as `data-x="false"`: a false boolean data attribute is omitted, so presence variants cannot match it.

### After the `005` build's second pass (2026-11-01)

From the builder's final report, screenshots read.

- **The log's "Scroll to end" button sits absolute over the box, in a relative wrapper, not sticky inside it.** Measured: Tab onto a sticky button scrolled the box to the button's static position at the end, and the button hid under the reader before Enter could press it. On activation focus returns to the region. `005` decision 11 reads so.
- **The button also hides while the box is following**, not only at the end, for stock's reason: it would strobe as each token arrived.
- The pass's smaller deviations (the message group `flex-1 items-end` in an end-aligned turn; three region names on the log page for `landmark-unique`; the composer preview holding `submitted` 700 ms; the fourth new dependency name is `tooltip`, not `spinner`; two keyboard behaviours waiting out Chromium's animated scroll) are accepted as the least that works and are the Landing notes' to record.
- The R23 and R24 pass over the first pass's pages: middle-dot captions rewritten as clauses; "More" became "More actions" and "Quick note" became "Open the quick note". The `ItemHeader` eyebrow is `001`'s and stays.

### The design calls for `007`, the full highlight palette and the ink surface (2026-11-01)

Made by the design lead, under the owner's delegation and the owner's ruling of the same day, from the palette memo and the ink memo of 2026-11-01. The owner may overturn any of them.

- **Twenty-one slots, each a role that holds in any language**, not a colour per scope. Five hue families join the five text colours the tokens hold: orange (numbers, escapes), amber as text (functions), purple (built-ins, decorators, `self`), teal (types, tags), cyan (keys and attributes). `constant` moves from ink to blue and `function` from ink to amber; calls lose their weight and definitions keep it. No `operator`, `punctuation`, `parameter`, `regexp` or `docstring` slot: both editors leave the first two in the body, and the rest read as another role.
- **The five new hues are semantic pairs named `syntax-<hue>`** (48 semantic names become 53), so `004` decision 5's rule that a `code` value names a semantic colour stays and the theme switch carries through. A lint rule, L19, forbids a `syntax-*` colour class in any item: the five exist for the code slots alone.
- **`amber-text` `#85600B` is an ochre, used only in code.** `001` decision 8's "amber is never text" stays for surfaces and copy. The ruling makes code colour functional.
- **Cyan is the pair to watch.** Teal and cyan are 15° apart, blue and cyan 25°. The build's checkpoint judges them at native size; if a key cannot be told from a type, `property` moves to a magenta pair derived the same way. The arithmetic is kept in relative luminance, not OKLCH, so every new value matches the others in lightness.
- **The slots are emitted in both theme blocks.** `004` decision 5's "a copy in `cssVars.dark` would say the same thing twice" is corrected: a `var()` in a custom property is substituted where it is declared, so a `:root`-only slot inherits its light colour into a `.dark` subtree. The ink memo measured the fault (13 axe nodes) and the fix (0).
- **The ink surface is `class="dark surface-ink"`**: two plain rules in `pluto-theme`, not an `@utility`, because a utility is layered and loses to the unlayered `.dark` on the same element. Ink on a light page, `card` on a dark one; the code ground and the active line follow the surface. The `code-block` root reads `bg-code-background` so the block goes flush as the editor does.
- **Overlays inside a surface:** `BitsConfig defaultPortalTo` on the surface brings every non-modal overlay inside with its theme and its position; **modals stay the page's** (`portalProps={{ to: "body" }}`). A dialog belongs to the page, not to the panel its trigger sits in.
- **The editor gets a roles plugin for Python**: `self` and `cls`, the built-ins, and docstrings, which no Lezer tag can name. Four roles the grammar lacks are taught through `styleTags`. Keyword arguments stay in the body on both engines.
- **`code-languages` is a separate item**, not a dependency of `code-editor`: `@codemirror/language-data` installs every language package, and an app that edits Python alone should not pay for it. Eighteen languages get a Lezer grammar, Svelte a third-party one, eight a legacy mode; the item page says which.
- **The Shiki engine goes strict** (`forgiving: false`): all 26 grammars compile under it.

### After the `007` spec review (2026-11-01)

From `reviews/007-the-full-highlight-palette-and-the-ink-surface-spec-2026-11-01.md` (11 findings, all fixed in the specification). Three are design calls:

- **The roles plugin wins by precedence, not by class.** CodeMirror nests overlapping marks with the highest-precedence one innermost, where the inherited colour is decided; the highlighter runs at `Prec.high`, so the plugin runs at `Prec.highest`. The test proves the mechanism (no child span inside the plugin's), not only the pixel.
- **Svelte in the editor comes from `@replit/codemirror-lang-svelte`**, named and pinned as `code-languages`' third package, since `@codemirror/language-data` has no Svelte. Four years old; the page says so. `@lezer/common` is not a dependency: the plugin walks the tree through `@codemirror/language`.
- **The surface fixture's tab strip is the pill variant**, which sits on `muted` and so shows the inset the surface keeps; the `line` variant has no ground to read.

### After the `005` build's checkpoint (2026-11-01)

Made by the design lead from the builder's checkpoint report, screenshots read. The owner may overturn any of them.

- **The dropdown menu renders in place, not in a portal.** axe's `region` rule exempts dialogs only, so a `role="menu"` portalled to `body` fails "content contained by landmarks" whenever it is open, and decision 17's open-menu scan could never pass. In place, the menu also reads in DOM order after its trigger. Floating UI still positions it `fixed`; `portalProps` re-enables the portal where an ancestor clips or transforms; the submenu stays portalled. `005` decision 7 reads so.
- **The dialog has a positioner.** `max-h-full` on the content resolved against the viewport, not the inset box (a long dialog measured 900 of 900 px). A `dialog-positioner` div, `fixed inset-4 flex items-center justify-center pointer-events-none`, wraps the content, which scrolls inside `max-h-full`. Decision 8 reads so.
- **Every sidebar row carries the 2 px start edge, transparent**; the current row colours it. Otherwise the current row's text shifted 2 px against its neighbours, as `004`'s code block found for its line marker.
- **The sidebar trigger closes its tooltip on press.** The tooltip's reopen after bits-ui's scroll-close registered a newer focus scope and the sheet skipped its autofocus 2 times in 6. Measured 0 in 6 after.
- **bits-ui leaves a menu open on Tab when its trigger is the page's last stop** (it closes only when a next tabbable exists). Not ours to fix; the menu page says so. `006`'s header menu always has the main content after it, so the shell is not affected.
- **The icon-collapsed sidebar must not clip its header text.** The checkpoint's icon shell shows "Pl" where the header reads "Pluto": the page's example, not the item. The second pass hides the text when collapsed to icons and keeps a 32 px mark, so the header reads as the mark alone.
- The smaller deviations (breadcrumb links `inline-flex min-h-6` for R21; the submenu's `alignOffset` −4; the theme store read once at module start; the toggle's light icon until mount; the nonce test's server render; the third minimal sidebar fixture; the row tooltip mounted only when collapsed on desktop) are accepted as the least that works and are the Landing notes' to record.

### The design calls for `006`, the app shell and the chat pane (2026-11-01)

Made by the design lead, under the owner's delegation, from the entrance memo of 2026-11-01 and the `005` memos, after the owner's answers of the same day. The owner may overturn any of them.

- **The entrance is the book's own `dockin`, drawn from tokens**: four dots docking over 900 ms, 495 ms each, staggered 90 ms, on `--ease-entrance`, from one new token `--mark-orbit` (0.5 em) and three unitless numbers. It is a prop, `entrance`, on `FourDot` and `Lockup`, and the shell's header is the one place that sets it. Under reduced motion the dots are the composed mark before any frame (`animation: none` in the reduce block, the third rule there). "One per page" is one per full document load: SvelteKit keeps the layout's lockup across client-side navigation, and no flag is kept. *Why not the mockup's spiral:* it is script, 1230 ms, over budget.
- **The shell is a block whose page file is a layout**, shipped under `/app-shell` and moved to an app's root by hand, with a server load that reads the sidebar cookie. Its app-specific values are constants at the top of the layout, since a root layout has no caller.
- **The header is 64 px, grooved on its bottom edge** (`groove-b`, a second groove utility), the lockup at 28 px with the entrance, a labelled primary nav hidden below `md` into a start sheet, the theme toggle and the account menu at the right. Not sticky by default; the one line a sticky header needs is the app's.
- **The footer is the lockup and "Work runs on data."**, then mono rows `commit`, `built`, `doc`, `source`, each only when given, and the public-benefit sentence only when an app passes it. *Why the tagline without the name:* the lockup is the name; "Pluto Systems. Work runs on data." is read as one line. The commit comes from SvelteKit's `version.name` and the date from the commit's own date, so a rebuild of one commit is byte-identical.
- **The chat pane shows no avatar and no markdown.** Turns are headed "you" and "assistant" in mono; fenced code becomes `code-block` at `sm` through a fifteen-line splitter; everything else is prose. The mark is never the assistant's face. An error is an alert with Retry inside the log; "Responding" is a static marker with the one spinner; "Latest reply" moves the reader, "Scroll to end" moves the view.
- **The shell's views live in a third layout group, `(shell)`**, because the shell renders its own `main` and the `(view)` layout's would nest it. The preview site adopts the entrance, `groove-b` and the footer, but not the skip link: the catalogue's stop order is `003`'s and starts at the lockup.
- **The doc ID and the sentence are the owner's answers above.**

After the `006` spec review (`reviews/006-the-app-shell-and-the-chat-pane-spec-2026-11-01.md`), three more, two of which amend `005`:

- **The sidebar's provider is a column that wraps the whole shell**, and the row of sidebar and inset is the consumer's own `div` (finding 6). *Why:* the one trigger lives in the shell's header, above the row, and must read the provider's context; a provider that was itself the row could hold no header. `005` decision 10 reads so from now on.
- **The preview's theme script lives in the `(site)` and `(view)` layouts**, not the root (finding 17): a shell view carries the shell's own script, and a page holds exactly one. `005` decision 16 reads so.
- **The footer's lockup is not a link, and the "Responding" marker carries no icon** (findings 4 and 8). The header's lockup is the home link; the composer's button is the one busy control.

### The design calls for `005`, overlays, navigation and the chat primitives (2026-11-01)

Made by the design lead, under the owner's delegation, from the four memos of 2026-11-01 (the overlays; the sidebar; the chat primitives; the entrance and the footer), after the owner's answers of the same day. The owner may overturn any of them.

- **The theme mechanism is source of our own, not `mode-watcher`.** A `theme` item: a head script rendered through `<svelte:head>`, a store with `light | dark | system` on the key `pluto-theme`, and a pressed toggle button; the preview app adopts it. *Why:* constitution §4.1, "source, not a package"; the behaviour is sixty lines the preview has mostly run since `001`; `mode-watcher` was last released 2025-06-28 and carries its own copies of two libraries.
- **No toast.** `sonner` is not served. The pattern is `003`'s: a `Status` present at render for the announcement and an inline `Alert` where the action was taken. *Why:* every accessibility source read asks the implementer to remove the timer, the tab stop per toast and the end-of-page placement, which is most of what the library is. A notices region of our own would be specified if an outcome ever lands off-screen.
- **Every overlay takes `popover`'s and `alert-dialog`'s chrome**: `shadow-elevation` with no border, `bg-scrim` with no blur, `animate-enter` and `animate-exit`. **The sheet fades; it does not slide.** One motion for every overlay, no new keyframes, within the 200 ms budget.
- **`dialog` is served beside `sheet`.** They are the same eleven files with a side; `006` names the consumer.
- **A menu's shortcut is words, hidden from the name**, and the menu is named by a group heading or a `label`; the stock `Label` part is dropped. Menu items are 32 px on the `accent` inset, and keep the global focus ring above it.
- **A breadcrumb's current page is a span with `aria-current`**, never a disabled link; the ellipsis is decoration an app wraps in a menu trigger.
- **The sidebar is a `nav` landmark on the paper ground, set apart by a vertical groove the inset owns** (`groove-s`: the hairline, then the light, light from the top-left). No rail (16 px and mouse-only), no `floating` or `inset` variant, no `style` attribute (widths are `w-3xs`, `w-12`, `w-2xs`). Off-canvas, the collapsed container is `inert`. The trigger is a disclosure with `aria-expanded` and `aria-controls`. Ctrl+B yields to an editable target and to a handled event. The current row is told by `aria-current`, the inset and a `primary` start edge. No tooltip inside the mobile sheet.
- **No base border colour rule in `pluto-theme`.** Every item names its border's token; an app's own bare `border` draws `currentColor`, which is the honest reading of "tokens are the one source".
- **The conversation log is ours**: a named region holding a named log, follow-bottom in sixty lines with the stock scroller's release rules, a button that is `hidden` at the end, `scroll-padding-bottom` for a sticky composer, smooth scroll only without reduced motion. The package behind the stock item (28 days old, 0.0.1) is not taken.
- **A user turn is a bubble on the `muted` inset; the assistant's turn is plain prose.** `bubble`'s seven variants are not served: the tints fail the token rule and the solid `primary` spends the accent the send button owns. A turn's header is a heading with `tabindex="-1"`, in mono, so a reader can walk turns and a control can focus the latest.
- **The composer never disables anything.** One button is Send and becomes Stop; Enter sends unless an input method editor is composing; Escape stops; focus stays; the composer's own `Status` says "Responding", "Stopped", "Response complete". It grows by `field-sizing: content` from 64 to 256 px, proven in the three engines, which answers the sizing question `002` had left open.
- **The doc ID, the footer's sentence and the theme are the owner's answers above**; the entrance and the footer are `006`'s.

After the `005` spec review (`reviews/005-overlays-navigation-and-the-chat-primitives-spec-2026-11-01.md`), two more:

- **The sidebar is a sticky flex child, never a `fixed` panel** (finding 4). Stock's `fixed inset-y-0` container escapes any box and covers a header above it; a `sticky top-0 h-svh` child of a `min-h-svh` provider is the same thing inside a shell and a contained thing inside a page. Its width is its state: 256 px open, 48 px as icons, 0 off-canvas, and `inert` when hidden.
- **A scroll box whose rows are stops takes no `tabindex`** (finding 7). `004`'s rule gives a stop to a box a reader could not otherwise reach; the sidebar's content box is reached through its rows, and Chromium adds no stop of its own to a scroller with focusable children. The message log keeps its stop: its content is prose.

### The theme mechanism, the doc-ID scheme and the footer's sentence (2026-11-01)

Asked while the `005` and `006` research memos were running, since each shapes a specification. **Answered:**

- **The theme mechanism:** "Just build what you can for now, that other work will come soon." The owner does not decide `mode-watcher`; the design lead builds what the registry can carry today and records the call with `005`. What follows: `005` ships a theme mechanism of its own or adopts `mode-watcher` on the evidence of the overlays memo of 2026-11-01, and says which in `decisions.md`; either can be revisited when "that other work" arrives.
- **The doc-ID scheme:** "Whatever you recommend." The recommendation, now the scheme: **`PS-<series>-<NNNN>`**, the form the design book gave itself (PS-DB-0002). A series is one counter kept in one repository's `context/`: `DB` the design book; `DS` this registry's specifications, numbered as they already are (`001` is PS-DS-0001); and one short code per app for its pages, numbered in that app's context as they ship (an app's home page would be `PS-<APP>-0001`). Uppercase, in mono, as v2 writes it. A footer takes the ID as a string prop; no code depends on the scheme. This closes the open call of `001` decision 28.
- **The footer's sentence:** "Not yet: optional prop, empty by default." The footer takes a `statement` prop and renders nothing without it. "Pluto Systems is a public benefit corporation." ships nowhere by default; an app that passes it as the `statement` shows it.

### The registry is served from GitHub, and the repository is public (2026-11-01)

Asked when `004` was committed and tagged `v0.4.0` and the owner said "so others can install". The repository `plutosystemsco/design-system` existed on GitHub, private and empty, since 2026-10-28. Put to the owner with options: push and deploy to a host; push only; push and make the repository public so `add` reads the built JSON from GitHub. **Answered:** "do not deploy to an app, only to github", then "push and make public". What follows:

- **The built registry is committed.** `static/r/` and `static/v<version>/` leave `.gitignore` (`001` decision 18 said "generated JSON stays out of git"; this reverses that line, and only it). `bun run build:registry` rewrites tracked files, so a release commit carries its own JSON.
- **The install URL is a raw GitHub URL.** `REGISTRY_URL=https://raw.githubusercontent.com/plutosystemsco/design-system/v0.4.0/static/r` pins a release by its tag; `.../main/static/r` follows the latest. The CLI appends `/styles/maia` itself. *Why it works:* the CLI fetches with a plain `fetch` and no headers (registry memo §1.8), which a public raw URL answers; a private repository would not.
- **No deployment.** Nothing is hosted; `wrangler.jsonc` stays unused, and `registry.json`'s `homepage` is the repository. The stale `static/v0.1.0` to `v0.3.0` folders of the working copy were deleted before the first push.
- The repository was made public on 2026-11-01 (the owner's decision of 2026-10-27, "the registry is public", now in effect), and `main` with the tags `v0.1.0` to `v0.4.0` pushed.

### The design calls for `004`, code and data (2026-10-31)

Made by the design lead, under the owner's delegation, from the three memos of 2026-10-31 (Shiki and the palette; CodeMirror 6; the data items), when the owner asked to continue the design system. The owner may overturn any of them.

- **The highlight palette is twelve `--code-*` tokens, each a semantic colour, no new hue.** Keywords are `primary`, strings `success`, comments `muted-foreground`, numbers and constants `foreground`, functions `foreground` at medium weight, operators and punctuation `foreground`; diff lines `success`, `destructive` and `primary`; the emphasised or active line is the opaque `card` step. *Why:* the four text tokens pass AA on every code ground in both themes (Shiki memo §4.1); red is kept for errors and deletions, so a number is never red; amber is never text. The same twelve drive Shiki in `code-block` and CodeMirror in `code-editor`, so one token change moves both.
- **Code sits on the `muted` inset, with no border, and the groove divides its header from its code.** `001` decision 8 names code grounds among the allowed insets; the editor and the output share the ground. Line emphasis is an opaque `card` step with a left marker in the state colour and the `+`/`−` sign, never a tint (R7).
- **Highlight tokens render as classes, never `style`.** `text-code-<slot>` utilities come from `@theme inline`; the hand-made Shiki theme is thirty lines with `var(--code-*)` colours and bold on functions, rendered as `font-medium`. No italic: `001` installs only the upright JetBrains Mono.
- **The editor binds no Tab**, prerenders as a `<pre>`, draws the focus ring on the whole editor, uses the browser's own selection and caret (no `drawSelection`, no tint token), grows with its document, and binds `Ctrl-Enter` beside `Mod-Enter`. No `basicSetup`, no completion for now.
- **A chart carries a name and a table.** layerchart leaves its marks invisible to assistive technology; every `ChartContainer` takes a required `label` and shows its data in a `details` "Show as table". Series colours are token classes or `var()` props; the stock injected stylesheet goes. No chart motion. Series are told by mark or label, since no two chart colours differ by 3:1.
- **`scroll-area` is not served.** Its hover-only 10 px scrollbar fails the 24 px target rule and hides from touch and keyboard users. `pluto-theme` gains a `scrollbar` utility (`scrollbar-color: var(--input) var(--muted)`, thin), and the pattern is a native `overflow-auto` box with `tabindex="0"` and a label.
- **The fuel meter is the native `<meter>`**, styled through pseudo-element rules in `pluto-theme`, on the `muted` track with a `primary` fill, its numbers written beside it. A meter, not a progress bar: a measurement in a known range.
- **A pressed toggle is inverted** (`bg-foreground text-background`), as the block viewer's width presets and the tooltip are; stock's `bg-muted` is a 1.20:1 tint. A toggle group's `single` mode keeps bits-ui's `role="group"` of radios and browse-then-select keys, because a preset strip that selects on arrow would fire a query per key.
- **A popover is a dialog**: `role="dialog"`, labelled by its title when it has one, on the elevation shadow alone (no border, which would draw the hairline twice), 256 px wide by default.
- **An accordion is wired and grooved**: `aria-controls` and a labelled `region` per item, which bits-ui omits; one caret that points right when closed and down when open, as the error page's details does; grooves between items; no tint on the open item; no animation.
- **No ANSI colour.** No consuming app's output carries escape codes, so the 32 terminal slots are not specified.

After the spec review (`reviews/004-code-and-data-spec-2026-10-31.md`), three more:

- **A code surface's root draws its ring, and nothing clips it** (finding 1). The code block's root draws the ring for its `pre`, as `input-group` does; the editor's root has no `overflow-hidden`. *Why:* a 2 px ring at a 2 px offset reaches 4 px past its element, and a clipped ring is no ring. Every fixture stop's ring is tested unclipped from now on, by `003` check 27's rule.
- **`001` decision 15 reads "not emitted unless referenced"** (finding 4). Tailwind 4 emits an `@theme inline` variable into `@layer theme` when its name appears in a scanned source file; the editor's theme reads five such names (`--spacing`, `--text-sm`, `--text-sm--line-height`, `--font-mono`, `--font-weight-medium`) and otherwise reads `:root` names. An item that reads an inline theme name says so, and the condition is that its file is among Tailwind's sources. `002` decision 3's written-out curve stands.
- **The meter has square ends** (finding 14). An 8 px bar with the 8 px case radius is a pill, which v2 §05 reserves for dot-derived elements. The four-dot and the radio button stay the only circles.

After the build's checkpoint (build step 3, 2026-10-31), two more:

- **A string's quotes take the string colour.** Decision 6 sent all punctuation to the foreground, and Shiki's deeper scope `punctuation.definition.string` then drew ink quotes around a green body. One more theme rule sends the string's own punctuation to `string`, so a literal reads as one thing. The editor's Lezer grammar already colours the whole string.
- **No ligatures on code surfaces.** JetBrains Mono's contextual ligatures drew `!=` as `≠` in the checkpoint's screenshots. v2 asks for honest pixels; code shows the characters that were typed, which is also what copy returns. `pluto-theme`'s base rule for `code, kbd, samp, pre` gains `font-variant-ligatures: none`, and the editor's theme sets the same on `.cm-scroller`.

After the change review (`reviews/004-code-and-data-pr-2026-10-31.md`), three more:

- **The editor's prerendered fallback is a named group** (finding 2). ARIA in HTML prohibits a name on a bare `pre`, so the fallback is `<pre role="group" aria-label>`: a group of lines, named as the editor will be. Decision 9's "`<pre aria-label>`" reads so from now on.
- **A chart's hover band is the `muted` inset** (finding 1). layerchart paints its highlight as the foreground at 5%, a translucent tint on a surface; the container overrides it with `muted`, the hover-row ground `001` decision 8 allows, and the band is drawn behind the marks.
- **One caret, turned, for every disclosure.** The chart's "Show as table" turns one `CaretRight` 90° when open, as the accordion does; two swapped icons are not used anywhere. And the editor page says what is true of its caret: it is the browser's own, and the editor itself runs no animation.

### The brand line (2026-10-31)

Decided by the owner after a run of candidates. Every Pluto Systems page and block that shows the brand's own words uses it; a product keeps its own headline under it.

- **Tagline:** *Work runs on data.* Set with the name: **Pluto Systems. Work runs on data.** Three words and a verb; it states the thesis, that work sits on a data layer.

### The design calls for `003`, the first blocks (2026-10-28)

Made by the design lead, under the owner's delegation, from the open questions in `research/2026-10-28-the-blocks-patterns-and-accessibility.md` §8 and `research/2026-10-28-blocks-how-they-are-declared-installed-and-previewed.md` §5, when the owner said "go ahead with 003". The owner may overturn any of them.

- **A block is real source, previewed live, never a picture.** Each block is a `registry:block` item: one thin page plus the components an app will reuse, installed with one `add`, shown on our site in both themes at phone, tablet and desktop widths. The specification decides the page target rule, the import rule, the naming rule and where block source lives, and proves each with the smoke test (`vite build` and `svelte-check` in both scratch apps).
- **The hero has no mark and nothing moves.** The lockup lives in the header, which is `006`'s app shell, and v2's one entrance per page, the orbit-assemble, belongs to it. The hero is an optional mono eyebrow, an ink `h1`, one sentence, one primary call to action, an optional secondary link, and an optional `media` snippet for real evidence (empty in the preview; the code block is `004`'s). Below `sm`, the display size steps from `text-5xl` to `text-2xl`; there is no size between. The feature grid is a `ul` separated by grooves, not cards.
- **Sign in is one step: email and password.** No social, passkey or email-link sign-in in the first set. `autocomplete` is `username` and `current-password`; the password has a show/hide toggle; paste and password managers are never blocked. On a failed submit, an error summary (an `alert` with `role="alert"`, focus moved to it) always appears, listing each error as a link to its field, GOV.UK's rule, plus the inline errors. A credential failure is one form-level message that names no field. The submit button goes busy, not disabled (`002`).
- **Sign up asks for email and password only.** No name, no confirm field, no strength meter: the rules are written before the field and wired by `aria-describedby`. Consent is a sentence under the button, not a checkbox. Verification is the six-digit code (`002`), with resend, on its own step.
- **Page states are one family.** An optional monochrome icon, a heading, one or two sentences that say what happened and what to do, one primary action, at most one link. Left-aligned on a full page, centred in a tile. Plain and warm words, no humour, no apology, no "404" in the copy and no red. Not found is served with status 404 through SvelteKit's error route; the loading state is a static skeleton on `muted` with `aria-busy` and a polite "Loading" status; a spinner only on the control that started an action. An error page may show a request ID or build hash in mono inside `<details>`, never a stack trace.
- **The settings form saves with one button at the bottom, not a sticky bar.** Sections divided by grooves, each a `fieldset` with a legend and one line of description; one column at every width; "Saved" as an inline `success` message in a polite status region, not a toast; a destructive section last, confirmed by the alert dialog; a `beforeunload` warning when dirty. Switches that save at once stay out of a form that saves on submit.
- **The `status` live region is a `003` item**, a `registry:ui` component that renders an empty `role="status"` region at mount and lets the app set its text, so the region exists before it changes. Sign in, sign up and the settings form use it.
- **After the spec review (`reviews/003-the-first-blocks-spec-2026-10-28.md`), four more:**
  - *The password minimum defaults to 15 characters* (finding 6). NIST SP 800-63B-4 §3.1.1.2 asks for 15 when the password is the only factor, which it is in this sign-in. An app may set the prop higher, never lower.
  - *Below `sm`, the code-entry cells take the `sm` control height, 32 px* (finding 8). Six 48 px cells need more than a 320 px screen has. 32 px is a `002` size and above the 24 px target minimum. Recorded here as the one exception to `002` decision 10's "code-input cells are 48 px squares". The sign-in and sign-up cards also drop their border and side padding below `sm`; what they keep must leave room for the 2 px focus ring (finding 1 is the author's).
  - *The error summary is one shared item, `error-summary`* (finding 11), a `registry:ui` component: `role="alert"`, focusable, a heading, a list of links to the invalid fields, the "Error: " title prefix. Four blocks compose it instead of carrying a copy each. One more item in `003`.
  - *Shipped copy promises nothing the block cannot keep* (finding 7). No sentence about email policy, no "signed in as", no "meets WCAG", no "on our side". The consent sentence renders only when the app gives the terms link. Only a 404 says "Page not found"; another 4xx says the page cannot be shown and names the status in mono. The error page says what happened and what to do, and never whose fault it was.
- **After the change review (`reviews/003-the-first-blocks-pr-2026-10-28.md`), five more:**
  - *A failed callback is told, and nothing is lost* (finding 2). Every block callback (`onsubmit`, `onresend`, `onsave`, `ondelete`) may throw or reject. The block then keeps what the person typed, inserts a form-level `error-summary` with one line that names what failed, "We could not sign you in. Try again.", "We could not create your account. Try again.", "We could not save your changes. Try again.", "We could not delete your account. Try again.", moves focus to it, and sets the status to the same words; a failed resend says "We could not send a new code. Try again." Nothing is retried on its own. (First written as "Something went wrong. Try again."; the build's voice check rightly banned it as the vague line v2 §07 forbids, and the wording was changed the same day.)
  - *A disclosure shows its state by shape* (finding 6). The error page's "Technical details" keeps `<details>`, and its summary carries an `aria-hidden` caret icon that points right when closed and down when open. The `inline-flex` summary stays, since it is what removed the native marker.
  - *Heading ranks differ at every width* (finding 6). On a full page the state's `h1` and the settings `h1` are `text-5xl` from `sm` and `text-2xl` below. A tile's heading is `text-2xl`. The settings sections' legends are `text-base`, bold, in the heading face. So an `h1` is always larger than what sits under it; the type scale has no step between.
  - *A page spends blue; red is spent at the confirm* (finding 6). On the settings page the delete trigger is a `secondary` button. The solid `destructive` button appears only inside the alert dialog, which spends red and nothing else (`002` decision 17). *Why:* one accent per surface; the stop colour belongs to the moment of stopping.
  - *A pressed preset is inverted; a hovered one only darkens its border* (finding 6). In the viewer, a button with `aria-pressed="true"` is `bg-foreground text-background`, as the tooltip chip is; hover stays the darker border of every secondary button. So pressed and hovered cannot be confused.
- **The block viewer** is a `/view/<block>` route with no site chrome, prerendered, shown on the block's item page in an iframe with width presets of 360, 768 and 1280 px, a light and dark switch that the iframe follows, an "open alone" link, and a code view of the built item's files. No screenshots.

### The primitives split in two, and the design calls for `002` (2026-10-28)

Made by the design lead, under the owner's delegation of 2026-10-27 ("act as principal designer of UI/UX"), after the three memos of 2026-10-28 (blocks, primitives, patterns). Recorded here so the specifications can cite them. The owner may overturn any of them.

- **The primitives are two specifications, and the blocks two.** `002` is the first set: forms, surfaces and feedback, 26 items, which the first blocks and the home page share. `003` is the first blocks: hero and call to action, sign in, sign up, page states, the settings form, plus the block viewer. `004` is code and data: `code-block` with the groove and a token highlight palette, tabs for the editor, chart, popover, accordion, toggle, scroll-area. `005` is overlays and navigation: dropdown-menu, sheet, sidebar, breadcrumb, sonner, the chat primitives. `006` is the second blocks set: the app shell and the chat pane. *Why:* 41 primitives is too large for one builder (`context/README.md`), and this order shows the owner a block soonest while a consuming app's home page needs only `002` and `004`.
- **Every primitive a block names lives in our registry, with its whole tree.** The CLI never falls back to shadcn-svelte's own registry for a bare name (blocks memo §1). So a stock item is never a URL dependency.
- **Functional progress is not "ambient animation".** v2 §06 bans looping animation that moves while a visitor reads. A spinner on the one control that is busy is a response, and allowed, within the 200 ms budget for its start. A skeleton is static: no shimmer. The streaming indicator is `006`'s call.
- **Form labels and button text are sentence case.** v2 §04's lowercase rule covers mono furniture: eyebrows, captions, doc IDs, dates, code. A label is an instruction to a reader, so it is prose.
- **State colour is outside the one-accent budget.** A surface spends one brand accent (blue on its primary action). Red, amber and green that tell state are sanctioned by v2 §03 and do not count. State is never told by colour alone.
- **One focus and invalid recipe for every control.** Drop `outline-none`, the `ring-[3px]` halo and `ring-ring/50`; keep `001`'s 2 px solid outline. Invalid is a solid `border-destructive`, `aria-invalid`, and the field's error text wired by `aria-describedby`.
- **Avatars take the 8 px case radius, not a circle.** v2 §05 reserves full round for dot-derived elements. The four-dot and the radio button are the only circles.
- **Radio buttons are round** (affirmed after the `002` spec review, finding 5). The radio's mark is a dot, so it is dot-derived under v2 §05, and the circle is what tells "one of many" from a checkbox's square.
- **The switch is a 32 × 64 track with a 24 × 24 thumb, both at the case radius, the thumb inset 4 px, no track border** (after finding 6, revised once: the first geometry, 24 × 44 with a 20 px thumb, was off the ladder and needed a lint exception). *Why:* every number is a ladder value (`h-8 w-16`, `size-6`, `p-1`), so no exception; a 16 px thumb goes fully round at the 8 px radius, which is the "in between" v2 forbids, while the 24 px thumb reads as a rounded square and matches the checkbox and radio at 24; the 32 px track is the `sm` control height.
- **Control heights sit on the ladder: 32 px (`sm`) and 48 px (default); no `lg`** (after finding 2). *Why:* a height reached from line box plus padding gives 43.6 px, which is off the ladder, and makes a square icon button impossible with allowed classes. `h-8` and `h-12` are ladder values, so the lint accepts them. Icon buttons are `size-8` and `size-12`. Text is centred in the box; inputs keep `text-base`. The code-input cells are 48 px squares.
- **State badges carry no tint** (after finding 3). A badge is `border` and text in the state colour on a transparent fill: `destructive`, `success`, and `caution` as a solid amber fill with ink text. *Why:* a badge sits in table and item rows, whose hover and selected ground is `accent`, and `001` forbids a state tint on `muted` or `accent`. Alerts keep their tints: an alert is never placed inside an inset, and review holds that line.
- **Switches and checked states are blue.** Blue acts; green confirms an outcome, and a setting is not an outcome.
- **A busy button stays enabled and focused.** It shows a spinner, sets `aria-busy`, and ignores re-submits. A disabled button leaves the tab order and loses focus.
- **Two tokens are added:** an elevation shadow for menus and dialogs, and a scrim for modal overlays, both from ink. In dark, elevation is a hairline plus the raised ground, since a shadow on ink is invisible.
- **Sign-up verification is a six-digit code,** so `input-otp` is in `002`. It accepts paste and `autocomplete="one-time-code"` (SC 3.3.8).
- **No `tw-animate-css`.** Open and close motion uses `001`'s motion tokens with keyframes of our own, inside the 200 ms budget. One dependency fewer, and the budget stays enforced by tokens.
- **Icons:** `phosphor-svelte`, pinned, named by each item that uses one.

Four more, after the review of the built change (`reviews/002-the-primitives-forms-surfaces-and-feedback-pr-2026-10-28.md`):

- **A tooltip reached by keyboard stays open** (finding 3). bits-ui closes a tooltip on any scroll, and focusing an off-screen trigger scrolls the page, so a sighted keyboard user never sees it. Our wrapper reopens it on the next frame while the trigger keeps keyboard focus. *Why:* SC 1.4.13 asks that content shown on focus stay visible until focus moves.
- **A set carries its own wiring; only a group control reads it** (finding 1). `FieldSet` puts `aria-describedby` for its description and error on the `<fieldset>` itself, and sets a separate context, `pluto:field-set`, that only a group control such as `radio-group` reads. A checkbox never takes a set's ids; it takes its own `Field`'s, or none. *Why:* two checkboxes that both take the set's `id` are one broken control.
- **A switch shows invalid only in words** (finding 9). Its track has no border to turn red, and that stays. The rule: a required consent is a checkbox, not a switch. The switch page says so.
- **A selected table row is told by shape, and by a control** (finding 12). The row keeps the `accent` inset and adds a `primary` left edge, one focus-width wide, so it differs from a hovered row by more than colour. `aria-selected` leaves the `<tr>`: outside a grid it is not announced. A row that can be selected carries a checkbox cell, which tells assistive technology the state. *Why:* v2, state never by colour alone; SC 4.1.2.

Three calls were left to the owner at this point: the doc-ID scheme, coloured dots on ink for the icon, and `mode-watcher`. All three are answered above, on 2026-11-01.

### Blocks, and they shape `002` (2026-10-28)

Asked after the owner saw `001` running and asked whether the system should show mock-ups of pages such as a login page, a call to action and a chat page. The design lead answered that shadcn calls these **blocks**: composed pages and sections served by the registry as source, previewed live in both themes and installed with one `add`, rather than pictures, which rot when tokens change. Put to the owner with options. **Answered:** blocks shape `002`, then build both; the first set is the **app shell, hero and call to action, sign in and sign up, and the chat pane**, plus "anything else as a principal designer you think is important". What follows: blocks research comes first, so `002`'s primitive list covers what the blocks need (textarea, avatar, label, scroll-area, and whatever the memos find). Then `002`, the primitives, then a blocks specification, each reviewed before build. The design lead adds to the first set the page states every app needs: empty, error, not found and loading, and a settings form. Mock-ups still have a home in sketches drawn before a specification.

### A fourth ground for `muted`, insets only (2026-10-27)

Raised by the review of `001` (`reviews/001-tokens-and-the-registry-spec-2026-10-27.md`, finding 6): v2 §02 names three grounds, paper, raised white and ink, and the draft added a flattened ink tint for shadcn's `muted` ground. Put to the owner with three options. **Answered:** "This is a decision for you, act as principal designer of UI/UX." The design lead decided: **allow the tint, for component insets only.** `muted` and `accent` are ink at 6% over paper (`#EAEAE7`) in light and paper at 10% over ink (`#2B2D32`) in dark, flattened. They are used only inside components: skeletons, tab strips, code grounds, hover and selected rows. They are never a page, section or sidebar ground. *Why:* a `muted` equal to the card surface makes skeletons and hover rows invisible without extra borders, which adds more lines than v2 wants; a flattened tint adds no hue and keeps paper and ink at 88% of a surface. The spec records this as a token rule and the literal lint cannot enforce it, so review does.

### Bun is the runtime, not Node (2026-10-27)

Said by the owner while specification `001` was in review. Its draft decision 1 had Bun running the scripts and Node 24 running Vite, Vitest, Playwright and the shadcn-svelte CLI. **Answered:** use Bun instead of Node. What follows: `001` is amended so Bun runs everything it can (`bun --bun` for Vite, `bun test` or `bun --bun vitest` for tests, `bunx --bun` for the CLI). A tool that cannot run under Bun is named in the specification as an exception, with the evidence that it was tried, and the owner is told. No `.nvmrc`; `packageManager` and `engines` name Bun.

### The design book's open calls, answered (2026-10-27)

Asked with a recommendation after a design canvas was drawn from v2's tokens (five boards: colour, type, space and mark, components, a product home template). **Answered:**

- **Type stack:** IBM Plex Sans for headings and the wordmark, Geist for body, JetBrains Mono for labels, code and data. Self-hosted through `@fontsource-variable`.
- **Spacing base:** a 4 px atom with an 8 px rhythm. The ladder is 4, 8, 12, 16, 24, 32, 48, 64, 96, with nothing off it.
- **Red and green carry state meaning.** Fills and dots use Tombaugh Red `#E23A2E` and Hydra Green `#1E9E56`. Running text uses text-safe variants, proposed as `#C42A1F` (5.29:1 on paper) and `#157A43` (5.02:1 on paper). State is never told by colour alone.
- **The registry is public.**

What follows: the tokens-and-registry specification (`001`) takes these as fixed. Two calls from v2 §10 stayed open then, the doc-ID scheme and coloured dots on ink for the icon; both are answered above, on 2026-11-01. The canvas proposes, for the specification to confirm: an input border `#878B96` (3.17:1), and a dark theme of paper on ink with lifted accents (`#7A9BFF`, `#FF6E63`, `#4CC982`, raised `#1E2129`, soft text `#A9ADB8`, border `#656A79`), all checked against WCAG 2.2 AA by relative-luminance arithmetic.

### Design book v2 is the token source (2026-10-27)

Asked after `research/2026-10-27-a-shadcn-svelte-registry-and-what-pluto-already-has.md`, which found v2 still "proposed" with four open calls. The site's code also falls short of it in three places: a stock dark theme, a four-dot gap of .16 em, and red and green text that fails WCAG AA. **Answered:** accept v2 and fix as we go. What follows: the tokens-and-registry specification takes its tokens from the design book. It puts each of the four open calls to the owner with a recommendation, and fixes the contrast failures.

### Named dependencies are allowed (2026-10-27)

The owner withdrew "no external dependencies" while scoping the first consuming app. What follows: constitution §4.6 allows a dependency that a registry item names and pins. Installing stock components from shadcn-svelte's own registry is using a dependency, not copying prior art.

### A separate repository, `plutosystemsco/design-system` (2026-10-27)

Decided while scoping Pluto Systems' first full web application. **Answered:** the design system is its own repository, built like shadcn: a place where all the styling and components live, developed alongside the apps that use it. Its starting material is the existing brand work: the design book (IBM Plex type, colour, the wordmark and the four-dot mark) and the company site's first shadcn-svelte components.

### A shadcn-svelte registry first, a CLI later (2026-10-27)

**Answered:** registry first. Apps run shadcn-svelte's `add` command against this registry and get source copies. A branded Pluto CLI may wrap the registry later.
