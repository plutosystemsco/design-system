# The owner's decisions

The owner's answers and decisions, newest first. A decision that changes the constitution is also recorded in its Status line. "The design book" and "v2" both mean the Pluto Systems design book, version 2, the source of the brand's rules; a section of it is cited as "§03".

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
