# The owner's decisions

The owner's answers and decisions, newest first. A decision that changes the constitution is also recorded in its Status line.

### The primitives split in two, and the design calls for `002` (2026-10-28)

Made by the orchestrating session as design lead, under the owner's delegation of 2026-10-27 ("act as principal designer of UI/UX"), after the three memos of 2026-10-28 (blocks, primitives, patterns). Recorded here so the specifications can cite them. The owner may overturn any of them.

- **The primitives are two specifications, and the blocks two.** `002` is the first set: forms, surfaces and feedback, 26 items, which the first blocks and the home page share. `003` is the first blocks: hero and call to action, sign in, sign up, page states, the settings form, plus the block viewer. `004` is code and data: `code-block` with the groove and a token highlight palette, tabs for the editor, chart, popover, accordion, toggle, scroll-area. `005` is overlays and navigation: dropdown-menu, sheet, sidebar, breadcrumb, sonner, the chat primitives. `006` is the second blocks set: the app shell and the chat pane. *Why:* 41 primitives is too large for one builder (`context/README.md`), and this order shows the owner a block soonest while `wasi-python-dev`'s home page waits only on `002` and `004`.
- **Every primitive a block names lives in our registry, with its whole tree.** The CLI never falls back to shadcn-svelte's own registry for a bare name (blocks memo §1). So a stock item is never a URL dependency.
- **Functional progress is not "ambient animation".** v2 §06 bans looping animation that moves while a visitor reads. A spinner on the one control that is busy is a response, and allowed, within the 200 ms budget for its start. A skeleton is static: no shimmer. The streaming indicator is `006`'s call.
- **Form labels and button text are sentence case.** v2 §04's lowercase rule covers mono furniture: eyebrows, captions, doc IDs, dates, code. A label is an instruction to a reader, so it is prose.
- **State colour is outside the one-accent budget.** A surface spends one brand accent (blue on its primary action). Red, amber and green that tell state are sanctioned by v2 §03 and do not count. State is never told by colour alone.
- **One focus and invalid recipe for every control.** Drop `outline-none`, the `ring-[3px]` halo and `ring-ring/50`; keep `001`'s 2 px solid outline. Invalid is a solid `border-destructive`, `aria-invalid`, and the field's error text wired by `aria-describedby`.
- **Avatars take the 8 px case radius, not a circle.** v2 §05 reserves full round for dot-derived elements. The four-dot and the radio button are the only circles.
- **Radio buttons are round** (affirmed after the `002` spec review, finding 5). The radio's mark is a dot, so it is dot-derived under v2 §05, and the circle is what tells "one of many" from a checkbox's square.
- **The switch is a 24 × 44 track with a 20 × 20 thumb, both at the case radius, the thumb inset 2 px, no transparent border** (after finding 6). *Why:* any thumb 16 px or less on a side goes fully round at an 8 px radius, which is the "in between" v2 forbids. At 20 px the thumb reads as a rounded square, like the 24 px checkbox.
- **Control heights sit on the ladder: 32 px (`sm`) and 48 px (default); no `lg`** (after finding 2). *Why:* a height reached from line box plus padding gives 43.6 px, which is off the ladder, and makes a square icon button impossible with allowed classes. `h-8` and `h-12` are ladder values, so the lint accepts them. Icon buttons are `size-8` and `size-12`. Text is centred in the box; inputs keep `text-base`. The code-input cells are 48 px squares.
- **State badges carry no tint** (after finding 3). A badge is `border` and text in the state colour on a transparent fill: `destructive`, `success`, and `caution` as a solid amber fill with ink text. *Why:* a badge sits in table and item rows, whose hover and selected ground is `accent`, and `001` forbids a state tint on `muted` or `accent`. Alerts keep their tints: an alert is never placed inside an inset, and review holds that line.
- **Switches and checked states are blue.** Blue acts; green confirms an outcome, and a setting is not an outcome.
- **A busy button stays enabled and focused.** It shows a spinner, sets `aria-busy`, and ignores re-submits. A disabled button leaves the tab order and loses focus.
- **Two tokens are added:** an elevation shadow for menus and dialogs, and a scrim for modal overlays, both from ink. In dark, elevation is a hairline plus the raised ground, since a shadow on ink is invisible.
- **Sign-up verification is a six-digit code,** so `input-otp` is in `002`. It accepts paste and `autocomplete="one-time-code"` (SC 3.3.8).
- **No `tw-animate-css`.** Open and close motion uses `001`'s motion tokens with keyframes of our own, inside the 200 ms budget. One dependency fewer, and the budget stays enforced by tokens.
- **Icons:** `phosphor-svelte`, pinned, named by each item that uses one.

Still the owner's, unchanged: the doc-ID scheme (`006`, the footer), coloured dots on ink for the icon, and `mode-watcher` (`005`).

### Blocks, and they shape `002` (2026-10-28)

Asked after the owner saw `001` running and asked whether the system should show mock-ups of pages such as a login page, a call to action and a chat page. The session answered that shadcn calls these **blocks**: composed pages and sections served by the registry as source, previewed live in both themes and installed with one `add`, rather than pictures, which rot when tokens change. Put to the owner with options. **Answered:** blocks shape `002`, then build both; the first set is the **app shell, hero and call to action, sign in and sign up, and the chat pane**, plus "anything else as a principal designer you think is important". What follows: blocks research comes first, so `002`'s primitive list covers what the blocks need (textarea, avatar, label, scroll-area, and whatever the memos find). Then `002`, the primitives, then a blocks specification, each reviewed before build. The session, as design lead, adds to the first set the page states every app needs: empty, error, not found and loading, and a settings form. Mock-ups still have a home, the design canvas, for sketching before a specification.

### A fourth ground for `muted`, insets only (2026-10-27)

Raised by the review of `001` (`reviews/001-tokens-and-the-registry-spec-2026-10-27.md`, finding 6): v2 §02 names three grounds, paper, raised white and ink, and the draft added a flattened ink tint for shadcn's `muted` ground. Put to the owner with three options. **Answered:** "This is a decision for you, act as principal designer of UI/UX." The orchestrating session decided as design lead: **allow the tint, for component insets only.** `muted` and `accent` are ink at 6% over paper (`#EAEAE7`) in light and paper at 10% over ink (`#2B2D32`) in dark, flattened. They are used only inside components: skeletons, tab strips, code grounds, hover and selected rows. They are never a page, section or sidebar ground. *Why:* a `muted` equal to the card surface makes skeletons and hover rows invisible without extra borders, which adds more lines than v2 wants; a flattened tint adds no hue and keeps paper and ink at 88% of a surface. The spec records this as a token rule and the literal lint cannot enforce it, so review does.

### Bun is the runtime, not Node (2026-10-27)

Said by the owner while specification `001` was in review. Its draft decision 1 had Bun running the scripts and Node 24 running Vite, Vitest, Playwright and the shadcn-svelte CLI. **Answered:** use Bun instead of Node. What follows: `001` is amended so Bun runs everything it can (`bun --bun` for Vite, `bun test` or `bun --bun vitest` for tests, `bunx --bun` for the CLI). A tool that cannot run under Bun is named in the specification as an exception, with the evidence that it was tried, and the owner is told. No `.nvmrc`; `packageManager` and `engines` name Bun.

### The design book's open calls, answered (2026-10-27)

Asked with a recommendation after the design canvas was drawn from v2's tokens (the canvas is a private Design artifact, `https://claude.ai/artifact/TXQJcBfKNhExJ7ZsyMrrH2`, five boards: colour, type, space and mark, components, a product home template). **Answered:**

- **Type stack:** IBM Plex Sans for headings and the wordmark, Geist for body, JetBrains Mono for labels, code and data. Self-hosted through `@fontsource-variable`.
- **Spacing base:** a 4 px atom with an 8 px rhythm. The ladder is 4, 8, 12, 16, 24, 32, 48, 64, 96, with nothing off it.
- **Red and green carry state meaning.** Fills and dots use Tombaugh Red `#E23A2E` and Hydra Green `#1E9E56`. Running text uses text-safe variants, proposed as `#C42A1F` (5.29:1 on paper) and `#157A43` (5.02:1 on paper). State is never told by colour alone.
- **The registry is public.**

What follows: the tokens-and-registry specification (`001`) takes these as fixed. Still open from v2 §10: the doc-ID scheme, and whether coloured dots may sit on ink for the icon. The canvas proposes, for the specification to confirm: an input border `#878B96` (3.17:1), and a dark theme of paper on ink with lifted accents (`#7A9BFF`, `#FF6E63`, `#4CC982`, raised `#1E2129`, soft text `#A9ADB8`, border `#656A79`), all checked against WCAG 2.2 AA by relative-luminance arithmetic.

### Design book v2 is the token source (2026-10-27)

Asked after `research/2026-10-27-a-shadcn-svelte-registry-and-what-pluto-already-has.md`, which found v2 still "proposed" with four open calls. The site's code also falls short of it in three places: a stock dark theme, a four-dot gap of .16 em, and red and green text that fails WCAG AA. **Answered:** accept v2 and fix as we go. What follows: the tokens-and-registry specification takes its tokens from `plutosystemshq/pluto-systems-design-book-v2.html`. It puts each of the four open calls to the owner with a recommendation, and fixes the contrast failures.

### Named dependencies are allowed (2026-10-27)

The owner withdrew "no external dependencies" while scoping `wasi-python-dev`. What follows: constitution §4.6 allows a dependency that a registry item names and pins. Installing stock components from shadcn-svelte's own registry is using a dependency, not copying prior art.

### A separate repository, `plutosystemsco/design-system` (2026-10-27)

Decided while scoping `wasipython.dev`, Pluto Systems' first full web application. **Answered:** the design system is its own repository, built like shadcn: a place where all the styling and components live, developed in tandem with `plutosystemsco/wasi-python-dev`. Its starting material is the existing brand work in the `plutosystemshq` repository: the design book (IBM Plex type, colour, the wordmark and the four-dot mark) and the site's first shadcn-svelte components.

### A shadcn-svelte registry first, a CLI later (2026-10-27)

**Answered:** registry first. Apps run shadcn-svelte's `add` command against this registry and get source copies. A branded Pluto CLI may wrap the registry later.
