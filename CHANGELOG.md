# Changelog

Each release of the registry, newest first. A change to an item's interface is marked **interface change**.

## 0.12.0 — unreleased

Code is highlighted by tree-sitter with this system's own queries, in code blocks and in the editor alike, and coloured in Tombaugh, the owner's palette after the guide Meridian: keywords violet, functions blue, types navy, strings green, numbers yellow, constants orange, meta plum, specials red, comments grey and upright. Every colour reads 4.5:1 or more on the code ground and the active line in both themes, and dark colours sit between 6.5 and 9.5 on the dark code ground. Numbers and constants are close in light mode for a reader with protanopia; numbers are digits and constants words. In light mode code sits on white, lighter than the page, and every code block and editor is edged by the hairline. The brand's yellow is yellower and lifted in dark: `#E2B000` in light, `#F8D874` in dark, in place of `#F19E20`.

- `pluto-theme`: **interface change.** The code map is Meridian's roles. `--code-text` replaces `--code-foreground`, and code's body is now its own ink (`#25292F` light, `#D9DFE8` dark), not the page's foreground. `--code-meta` and `--code-special` are new. `--code-escape`, `--code-builtin`, `--code-tag`, `--code-property`, `--code-decorator`, `--code-self` and `--code-invalid` are removed, with their `text-code-*` utilities. `--code-comment`, `--code-keyword`, `--code-function`, `--code-type`, `--code-string`, `--code-number`, `--code-constant`, `--code-link`, `--code-inserted`, `--code-deleted` and `--code-changed` keep their names and take new colours. The theme roles `syntax-amber`, `syntax-purple`, `syntax-teal` and `syntax-cyan` are removed; `syntax-orange` takes a new colour; `syntax-violet`, `syntax-blue`, `syntax-navy`, `syntax-green`, `syntax-yellow`, `syntax-plum`, `syntax-red`, `syntax-grey` and `syntax-ink` are new. The inline-code chip's text takes `--code-text`. The code ground and the active line have theme roles of their own, `--syntax-ground` and `--syntax-active-line`. `--code-background` and `--code-active-line` keep their names and now name them. In light mode the code ground is white (`#FFFFFF`), not `wash` (`#E9E5DB`), and the active line is the page canvas (`#F3F0E8`), not white; dark mode's grounds are unchanged. A new utility, `scrollbar-code`, draws a scroll box's track in the code ground; inside an ink surface that track is the surface, in both page themes. Inline code, a `code` element not inside a `pre` or a heading, is now a chip on the code ground with the hairline edge, the case radius, 4 px of side padding and the code body colour (the link colour inside a link), in both themes; the line height does not change, and a chip that wraps keeps its edge on each line. `kbd` and `samp` are unchanged. A class an app sets on its own `code` wins for the properties it sets, since the rule is in the base layer; the hairline, the radius, the side padding and the code colour still apply unless a class sets them too. The chip adds 10 px to inline code's width (4 px of padding and a 1 px edge on each side), so an unbreakable inline token in a tight column can widen that column by as much; give the `code` `wrap-anywhere`, or its container `break-all`. The code-ground change itself renames and removes nothing; every rename and removal in this bullet is the code map's. An app's own class named `scrollbar-code` would take the theme's rule; rename it before updating. An app that painted its own surfaces with `--code-background` now gets white in light mode. The brand yellow is `#E2B000` in light and `#F8D874` in dark, in place of `#F19E20` in both: the mark's third dot (`--mark-3`), `field-3`, `--chart-3` and the `--caution` fill, with ink on it (9.53:1 light, 13.75:1 dark). A new role, `--caution-text` (`#806200` light, `#F8D874` dark), is the yellow for text, 4.5:1 or more on the page, a card and `muted`. In light `--chart-3` stays under 3:1 on the page and on cards (1.76, 2.01) and is labelled directly, as before. The light `--caution` fill drops the same way: the badge's fill against the page goes from 1.91 to 1.76 and the alert's bar on its card from 2.17 to 2.01; both name their state in words. The yellow renames nothing an app reads; the `amber` primitives are renamed `yellow`, and primitives never reach an app.
- `code-block`: **interface change.** Its body text takes `--code-text`, and its tokens the new role classes; no token is bold. `CodeBlockContent` sets `data-highlight` to `"pending"` or `"settled"`. No prop, slot or export changes. The root draws a 1 px `border-border` on each side. At the same content it is 2 px taller. Where it fills its container, its width is unchanged and its code area is 2 px narrower, so a line that just fit may now scroll. Where it sizes to its content, as in a chat bubble, it is also 2 px wider. A fixed height keeps its size and shows 2 px less code. Its scroll track is the code ground. The advice to pass `class="bg-muted"` to keep an inset is withdrawn: code on `muted` does not meet AA with this release's colours.
- `code-editor`: **interface change.** Colour comes from the highlighter, through `codeHighlighting(language)`, so the editor colours code exactly as the code block does. Until the highlighter loads (the runtime, about 115 kB gzipped, and the language's grammar, once per page) the editor shows plain text, as its prerendered fallback does; before, CodeMirror coloured it on mount. Its text, its caret and its prerendered text take `--code-text`. `codeHighlight`, `pythonLanguageConfigured` and `pythonRoles` are removed, and `pythonSetup()` now pairs `pythonLanguage` (for structure) with `codeHighlighting("python")`; it keeps its name and return type. An app that imported the removed exports: in place of `pythonLanguageConfigured`, use `pythonLanguage` from `@codemirror/lang-python` with `codeHighlighting("python")`; drop `pythonRoles`; in place of `codeHighlight`, add `codeHighlighting(language)` for the editor's language. The item now depends on `highlighter`. No prop or slot changes. The root reads the code ground (`bg-code-background`) in place of `bg-muted` and draws the same hairline, with the same change of size as `code-block`. Its focus ring stays 2 px outside its edge. Its scroll track is the code ground. Prerendered, it is the colour it has once mounted.
- `highlighter`: **interface change.** tree-sitter (`web-tree-sitter` and 19 grammar packages, now `dependencies` of the item) highlights 21 languages at prerender and in the browser; Shiki highlights Markdown, diff, SQL, Swift and Dockerfile, and any language whose grammar is removed or fails to load. `highlightCode` and the `HighlightedLine` type are unchanged; `highlightCode` now waits for any grammar the code embeds. `loadHighlighter` returns a highlighter whose `highlight(code)` is asynchronous and whose `session(code)` updates incrementally (`update(code, changes)`, `onChange`, `settled`), and takes no grammar state. `tokenClass` takes a role; `tokenClasses` is replaced by `roleClasses`; `codeTheme` is renamed `shikiTheme`. Tokens are never bold. The packages take about 350 MB on disk, and every client build carries their 20 grammar files and the runtime, about 23.5 MB raw (2.15 MB gzipped); a page fetches only the runtime and the grammars it shows. To keep fewer languages, delete their rows in `highlight/languages.ts` and remove their packages; they fall back to Shiki. A strict Content Security Policy needs `'wasm-unsafe-eval'`.
- `code-languages`: each language keeps CodeMirror's indentation, brackets and behaviour, and takes its colour from the highlighter. Its exports are unchanged.
- `use-highlighted-code`: no signature change; its result gains `settled`.

Any `add` from `v0.12.0` updates `pluto-theme`, since every item names it, so update the code items with it: `add pluto-theme highlighter use-highlighted-code code-block code-editor` (and `code-languages` if you have it), then `bun install`. Otherwise an older highlighter paints half in the old palette and half in the new. The CLI never deletes a variable the new theme lacks, so after updating, delete these lines from your stylesheet: in `:root` and in `.dark`, `--code-foreground`, `--code-escape`, `--code-builtin`, `--code-tag`, `--code-property`, `--code-decorator`, `--code-self`, `--code-invalid`, `--syntax-amber`, `--syntax-purple`, `--syntax-teal` and `--syntax-cyan`; in `@theme inline`, the `--color-` form of each and the CLI's derived `--code-…: var(--code-…)` line for each removed `--code-*` name. Until they go, `text-code-builtin` and the other removed classes still compile, in their old colours. Update `pluto-theme`, `code-block` and `code-editor` together. An app that updates the theme alone gets white blocks with no edge on its white cards.

## 0.11.0 — 2026-11-07

The brand: Pluto's colours on a warm canvas, flat product screens, the closer lockup, and the expressive mode a home page or a launch is built in. 0.9.0 and 0.10.0 were never released; their changes are folded in here.

What an installed app sees when it updates `pluto-theme` or `four-dot`:

1. Every colour, in both themes. The light ground is the warm canvas `#F3F0E8`; the dark ground and sidebar are `graphite`, `#16140F`, a new primitive. The four colours are Deep Field's (`#2D48D4`, `#C92035`, `#F19E20`, `#008058`), with their lifted and text tones. Every contrast row still passes, but for the two recorded amber chart exceptions.
2. Overlays in the light theme have no shadow. A menu, popover, sheet or dialog is told from the page by its edge alone, the input-strength line (`line-input`), as in the dark theme.
3. Grooves lose their white highlight line in the light theme: `groove-light` is clear in both themes.
4. The lockup's mark is 87% of its old size, closer to the word and lower. The app shell's footer endorsement follows its spacing.
5. The mark's dots overshoot slightly as they land: the dock runs on `--ease-spring`.

No prop, slot, export or class name of an item released in 0.8.0 changes. Two things to check before updating:

- `pluto-theme` adds global class names: `glass`, `surface-plain`, `field-1` to `field-4`, `busy-edge`, `action-press` and the `type-*` steps, `type-poster` among them. An app's own class of the same name would take the theme's rules; rename it before updating.
- Update `four-dot` with `pluto-theme`. The theme alone moves the old lockup's mark closer and lower at its old size; the new `lockup.svelte` sets it at 87% of the word.

- `pluto-theme`: the palette and the roles above, and the forbidden state tints on `muted` kept by rule. Expressive mode: `data-mode="expressive"` on an element sets the mode's values for its subtree and `data-mode="productive"` resets them. Under the mode the action radius is the case radius, 8 px, as everywhere (one radius; round only for dot shapes); the `rounded-action` utility reads `--radius-action`. In the dark theme an expressive subtree shows the mark's four colours, as the lifted four; a productive island inside it shows paper. Runtime variables on `:root`, none in `cssVars` or `@theme inline`, so a subtree may set any of them again: the display slot `--font-face-display` and the display steps' fluid sizes, the durations and `--ease-standard`, `--press-scale`, the sizes, and the brand's tools below. The utilities `action-press`, `type-display`, `type-section`, `type-proof` and `type-poster` (a launch headline that reaches 160 px) are the one sanctioned shape of each; the steps are `type-*`, not `text-*`, because `cn` reads a `text-<word>` as a colour. Four colour fields, `field-1` to `field-4`, paint a brand colour and set the roles inside to its legend; `surface-plain` gives an opaque surface inside a field the theme's own roles back. `glass` is a frosted panel with a lit edge that carries the theme's own roles, opaque under reduced transparency, forced colours or no backdrop filter. `busy-edge` draws a flat card's working state: an inset edge in the primary, twice the line width, while the card carries `data-busy`, and nothing at rest. Under reduced motion every duration reads `0ms` and `--press-scale` reads 1. A bar marked `data-sticky-bar` sets the page's `scroll-padding-top`. The contrast checks gain the fields (legend on fill, as text and as a ring), the glass over the canvas and each field, its fallback, the ring on it, and the bar's text on its glass passing over another glass over the canvas or a field (`glassOverGlass`); all pass.
- `four-dot`: the lockup sets its mark at `--mark-lockup-size`, 0.87 of the word, 0.10 em from it; the dots dock on the spring and fade on the entrance curve, as two animations, `pluto-mark-dock` and `pluto-mark-fade`.
- `button`: its radius reads `--radius-action`, through the class `rounded-[var(--radius-action,var(--radius))]` in place of `rounded`: 8 px in both modes, with the fallback in the class itself, so an app that re-installs `button` without updating its stylesheet keeps 8 px corners. `cn` reads the class as a radius, so a `rounded-*` class an app passes to `button` merges and wins, as before.
- `read-token`: new, a `registry:lib`. `readToken(name, element?)` reads a runtime variable from script, `readDuration` a duration in milliseconds, `readEase` a `cubic-bezier` as a function, and `tween` animates a number over a duration and an easing token, landing at once when the duration reads 0. It returns an empty string on the server; call it in the browser.
- `liquid-glass`: new, an expressive-only `registry:ui`. It needs Svelte 5.29 or later, for attachments (`svelte/attachments`, `{@attach}`); this repository pins 5.57.3. `pointerLight`, an attachment, lights the glass's edge where the pointer moves and lets it go out after `--motion-light`; under reduced motion it sets nothing.
- A new group, `compositions`, of nine `registry:ui` items, each `meta.modes: ["expressive"]`, built on the brand's fields and glass and following the page's theme (none carries `.dark`): `stage` (a full-bleed expressive section; its `ground` is the canvas or a colour field, `field-1` to `field-4`), `stage-card` (code on a flat card with a copy button and, given a `run` function, a Run button whose output and outcome it shows and says; `busy-edge` while it runs), `marketing-bar` (a sticky top bar, a floating glass panel capped at the wide measure, with a skip link, named links and actions in the foreground, a sheet below md; `overlay` floats it over the first stage), `stage-hero` (the words, actions and display heading in a glass panel over an object on a colour field, the `field` prop naming it; `poster` sets a launch headline; without an object the words sit on the canvas; a strip below; `underBar` for a hero beneath an overlaying bar), `proof-band` (numbers that count up once when first seen, read once as their final values; it may sit on a field), `live-console` (a productive console on a flat card: commands in tabs, highlighted in their `language`, and meters that fill to a run's result; `busy-edge` while it runs), `name-strip`, `cta-band` (on the canvas, since it holds controls) and `marketing-footer` (link groups as named navs, and the app shell footer's build facts; on the canvas, and expressive, so in dark its mark shows the lifted four, as the bar's does). On a field, text takes the field's roles; a control sits on a `surface-plain` surface or on glass, never on the field itself.
- `product-home`: new, a `registry:block` that installs as a route: the glass bar, a hero whose words sit on glass over the blue field and whose two code cards sit on it, with a strip; the proof band on the amber field; the live console in a green panel; a call to action on the canvas; and the footer. Its copy is true of the open platform it names, as that platform's README states it today: the install line is the repository's `main`, the second proof counts files and rows, and the console runs `grep` and `glean`, two of the README's own calls. Its `run` functions are stand-ins that wait 900 ms; replace them with calls to your own server.
- Every item declares `meta.modes`, its lint profile: `["productive"]` for a visual item, `["productive", "expressive"]` for `button` and the items with no markup, `["expressive"]` for the compositions and `liquid-glass`. The literal lint adds L22 (the expressive utilities, the fields, `surface-plain`, `glass`, `busy-edge` and `data-mode="expressive"` fail in any item not declared `["expressive"]` alone), L23 (`--ease-spring` only in `four-dot` and `pluto-theme`: springs are for the mark's dots) and L24 (one counted allowance: `pointerLight`'s writes of the glass's custom properties). The review checklist adds R25, for fields and glass.
- Each new item has a page; a composition's page shows it in the viewer's frame, through a view of its own under `/view/compositions/`. The `pluto-theme` page shows the mode, the fields, the glass, the poster step and the mark's spring.

## 0.8.0 — 2026-11-01

Product identity: the shell carries each Pluto Systems product's own logo, name and words. The tokens stay shared.

- `app-shell`: **interface change.** The footer takes `appName` (required), a `logo` snippet and `endorsed`, and its `tagline` defaults to empty, since "Work runs on data." is Pluto Systems' line, not a product's. The header takes the same `logo` snippet. Each shows the product's logo, named by `appName`, or `appName` itself as a wordmark in the heading face; a long name truncates in the header and wraps in the footer. The snippet receives its place, `"header"` or `"footer"`, so only the header plays an entrance. The header's change is visible: its props are unchanged, and the Pluto Systems lockup and its entrance are gone. To keep them, pass a `logo` snippet holding `<Lockup entrance={place === "header"} class="text-2xl" />` and `appName="Pluto Systems"`. With `endorsed`, the footer adds "A Pluto Systems product" under its rows; where a pointer can hover, the mark's four dots dock in beside the words, the last at 200 ms. The layout ships `APP_NAME = "Sandbox"`, a `LOGO` constant, no source link and no tagline; the example page's link reads "Go to the home page".
- `pluto-theme`: additive, not an interface change. The `mark-reveal` utility: the entrance's path and shares on the 200 ms response budget, its hover rules inside `@media (hover: hover)`. No new token.
- `hero`: the block page's sample copy describes the page itself, not this registry: "Say what your product does in one line", and an action that goes to the home page.
- The preview site's own footer passes Pluto Systems' identity: the lockup and "Work runs on data.". Two shell views join: "Lockup as logo" and "Endorsed".

## 0.7.1 — 2026-11-01

Ready to read in public. No item's interface changes.

- The documents under `context/` are rewritten so each stands alone; none names an app. The source is licensed under Apache-2.0 (`LICENSE`).
- `code-languages`: its preview page's table shows Shell's known gaps. They were keyed by the alias `shellscript`, not the id `bash`, so the row said none were found.
- `pluto-theme`: the generated stylesheet writes the twenty-one `--color-code-*` lines once in `@theme inline`, not twice. The item itself is unchanged.
- `settings`: two lines of copy change. The notifications checkbox reads "When something fails" and the delete section says "your data and settings". `meter`'s documented `valuetext` example changes. No class or prop changes.
- Every item's comments stop citing this repository's documents; the reason each comment gave now stands in words.
- The lint's rules are numbered once, L1 to L21. The injected-stylesheet rule and the theme-file rule, which shared L15 and L16 with two others, are now L20 and L21.

## 0.7.0 — 2026-11-01

The full highlight palette and the ink surface: editor-grade highlighting across twenty-six languages, and a sanctioned dark panel inside any page.

- `pluto-theme`: additive, not an interface change. The code map grows from twelve to twenty-one slots (`number`, `escape`, `builtin`, `type`, `tag`, `property`, `decorator`, `self` and `invalid` join the twelve), each a semantic colour; five new text-safe hue pairs, `syntax-orange`, `syntax-amber`, `syntax-purple`, `syntax-teal` and `syntax-cyan`, exist for the code slots alone and pass 4.5:1 on all six code grounds in both themes. `constant` moves from ink to blue and `function` from ink to amber; a call loses its weight, a definition keeps it. The slots are now emitted in `cssVars.dark` as well as `cssVars.light`, which corrects 0.4.0's emission: a `var()` inside a custom property is substituted where it is declared, so a `.dark` subtree inside a light page took the light palette. Two plain rules, `.surface-ink` and `.dark .surface-ink`, make `class="dark surface-ink"` an ink surface on any element: every token inside is the dark theme's, the code ground and the editor's ground equal the surface, ink on a light page and `card` on a dark one.
- `highlighter`: the theme is rewritten by role, so one theme colours every grammar; the lazy list grows from fourteen to twenty-six languages (Go, Rust, Java, C, C++, C#, Ruby, PHP, Kotlin, Swift, TOML and Dockerfile join); the engine is strict (`forgiving: false`), under which all twenty-six grammars compile.
- `code-editor`: the highlight style is rewritten to the same twenty-one slots; Python's grammar is taught decorator names, annotations, parameters and f-string braces; a roles plugin, `pythonRoles`, tells `self` and `cls`, the built-ins and docstrings, which no tag can; `pythonLanguageConfigured` and `pythonRoles` are exported beside `pythonSetup`. Its seven packages are unchanged.
- The 0.7.0 `highlighter`, `code-block` and `code-editor` need the 0.7.0 `pluto-theme`: their new classes (`text-code-number`, `text-code-builtin` and the rest) resolve only once the twenty-one slots are in the app's stylesheet. `add` pulls the theme with each of them; an app that copies one file by hand without re-adding the theme sees the old twelve slots and the new roles in the body colour.
- `code-languages`: new. Any of the twenty-six for the editor, on demand: a table of ids, aliases, kinds and names, and `loadLanguage(name)`, which opens a Lezer grammar through `@codemirror/language-data`, Svelte through `@replit/codemirror-lang-svelte`, and Python as the configured grammar. Eighteen languages get a Lezer grammar, eight a legacy mode.
- `code-block`: the root reads `bg-code-background` instead of `bg-muted`. The same colour everywhere but inside a surface, where the block goes flush like the editor; a block that should stay an inset there passes `class="bg-muted"`.
- The lint gains L19: a `syntax-*` colour named in any item file is a violation; the five are reached only through the code slots.

## 0.6.0 — 2026-11-01

The app shell and the chat pane: the frame every page sits in, with the mark's one entrance and the footer's furniture, and the first conversation surface.

- `app-shell`: new. A layout and its parts, shipped under `/app-shell` and moved to an app's root by hand: a skip link first in `body`; a 64 px header grooved on its bottom edge with the lockup's entrance, a primary nav that folds into a start sheet below `md`, the theme toggle and an account menu on an avatar; an optional sidebar (off-canvas or icons) composed from `sidebar`, with a server load that reads its cookie, under a header that is then sticky; the `main`; and a footer with the brand line and mono rows `commit`, `built`, `doc` and `source`, each only when given, plus an optional statement. The commit comes from SvelteKit's `version.name` and the date from the commit's own date, through guarded lines in the app's `vite.config.ts`.
- `chat`: new. A conversation pane over `005`'s items: a log named "Messages" that follows new replies, turns headed "you" and "assistant" in mono, a user turn as a bubble on the muted inset and a reply as prose, fenced code as a small `code-block` through a fifteen-line splitter (no markdown renderer), a static "Responding" line, an error alert with Retry inside the log, "Latest reply" that moves the reader, and the composer on the card ground behind a groove. No avatars.
- `pluto-theme`: additive, not an interface change. Adds the token `--mark-orbit` (0.5 em), the three unitless entrance numbers (`--motion-entrance-dot`, `-start`, `-stagger`), `@keyframes pluto-mark-dock`, the `mark-entrance` utility (four dots docking over the entrance budget, staggered, the last ending at 900 ms), the `groove-b` utility (the groove as a bottom edge), and a third rule in the reduce block so the entrance's dots are the composed mark before any frame.
- `four-dot`: changed, not an interface change. `FourDot` and `Lockup` take an optional `entrance` prop that plays the mark's one entrance; the default is unchanged.
- The preview site's header carries the entrance and the groove, and its footer is the shell's, with this repository's commit and date.

## 0.5.0 — 2026-11-01

Overlays, navigation and the chat primitives: what the app shell and the chat pane compose.

- `pluto-theme`: additive, not an interface change. Adds the `groove-s` utility, the vertical groove a page owns on its start edge beside a sidebar: the hairline, then the light inside it.
- `theme`: new. The light and dark switch as source: a head script that sets the theme before paint, rendered once per layout group that needs it (an app renders it in its root layout; the preview site in its `(site)` and `(view)` layouts), a store (`light`, `dark`, `system`) on the key `pluto-theme` that follows the system until a choice is made and across tabs, and a pressed toggle button named "Dark theme".
- `dropdown-menu`: new. A menu opened from a button, on the elevation shadow alone, rendered in place beside its trigger, with 32 px items on the accent inset, check and radio items, a submenu, a destructive item in red text, and a shortcut written in words and hidden from the item's name. No Label part: a group heading or `label` names it.
- `sheet`: new. A modal panel fixed to one edge, 288 px wide on a side, named by its title or `label`, behind the scrim and on the elevation, that fades and returns focus when it closes.
- `dialog`: new. A modal window named by its title or `label`, centred 16 px in from the edges and 448 px wide at most, that scrolls inside when long.
- `breadcrumb`: new. The path to the current page as a list of links; the current page is a span with `aria-current`, never a disabled link; the ellipsis is decoration an app wraps in a menu trigger.
- `sidebar`: new. A navigation landmark on the paper ground, a sticky flex child never fixed, 256 px open, 48 px as icons, 0 and `inert` off-canvas, a sheet below 768 px; its trigger is a disclosure, Ctrl B yields to a text field, and the page beside it owns the groove. No rail, no floating or inset variant.
- `is-mobile`: new. A media-query store, true below 768 px and false on the server.
- `message-log`: new. A scroll box named "Messages" with a stop, holding a log named "Conversation", that follows new content until the reader scrolls away and offers a button back to the end.
- `message`: new. One turn: an avatar slot, a mono heading that says who, the content as plain prose or a bubble on the muted inset, and a footer. `bubble` is folded into `message` as the one `bubble` variant: its seven stock variants were tints and a primary fill.
- `marker`: new. A line in a conversation that is not a turn: plain, a separator, or underlined; no role unless an app passes one.
- `composer`: new. The form a person writes a message in: a textarea that grows from 64 to 256 px by `field-sizing`, Enter to send and Shift Enter for a line, a 48 px send button that becomes Stop while a reply runs, a status that says "Responding", "Stopped" and "Response complete", and never a disabled control.
- `sonner` is not served. A timed toast with a tab stop at the end of the page fails the rules every accessibility source agrees on; the pattern is a `status` region present at render for the announcement and an inline `alert` where the action was taken.

## 0.4.0 — 2026-10-31

Code and data: the items that show code or a number, a highlight palette that is tokens, and an editor and a meter.

- `pluto-theme`: additive, not an interface change. Adds the twelve code tokens (`--code-foreground`, `--code-background`, `--code-keyword`, `--code-string`, `--code-constant`, `--code-function`, `--code-comment`, `--code-link`, `--code-inserted`, `--code-deleted`, `--code-changed`, `--code-active-line`, each a semantic colour, with their `text-code-*` and `bg-code-*` utilities), the `scrollbar` utility (`scrollbar-color` from `input` on `muted`, thin), the `[data-slot="meter"]` rules that paint the native meter from the tokens, and `font-variant-ligatures: none` on code.
- `code-block`: new. Code, output or a diff on the muted inset, highlighted from the code tokens as classes, with line numbers, a copy button that announces "Copied", emphasised lines by an opaque step and a marker, and a header divided by the groove.
- `code-editor`: new. A CodeMirror 6 editor themed from the tokens, with line numbers and a Python preset, that prerenders as plain code, draws one ring around the whole editor, binds Ctrl Enter and Cmd Enter to `onrun`, and leaves Tab unbound.
- `highlighter`: new. Shiki with the JavaScript engine and a theme whose every colour is a code token; `highlightCode` for a server load and `tokenClass` for the class a token takes.
- `use-highlighted-code`: new. A hook that highlights a changing string line by line as it grows.
- `chart`: new. A figure for layerchart named by its caption, with its data as a table behind "Show as table", series coloured by token classes or `var()` props, and a tooltip on the elevation shadow. No injected stylesheet, no motion.
- `meter`: new. The native meter on the muted track with a primary fill and square ends, for a measurement in a known range such as storage used; an app names it and writes its numbers beside it.
- `popover`: new. A small dialog anchored to its button, 256 px wide, on the elevation shadow alone, named by its title or a `label`, that returns focus when it closes.
- `accordion`: new. Headings that each open a labelled region, wired with `aria-controls`, divided by grooves, with one caret that turns, moved by the arrow keys.
- `toggle`: new. A two-state button, inverted when pressed, at 48 and 32 px.
- `toggle-group`: new. A row of toggles with one stop, moved by the arrow keys, for one choice or several; a selected item is inverted.
- `scroll-area` is not served. Its hover-only 10 px scrollbar fails the 24 px target rule and hides from touch and keyboard users. Use a native box instead: `overflow-auto scrollbar` with `tabindex="0"` and a label, as `table`'s region and `code-block`'s `pre` do.

## 0.3.0 — 2026-10-28

The first blocks: whole pages an app installs with one `add` and then owns, and the two components they share.

- `status`: new. An empty polite live region, present from the first render, whose text an app sets.
- `error-summary`: new. The box a failed submit puts at the top of a form, focused, with a link to each invalid field, and `titleFor` for the page's "Error: " title.
- `hero`: new block. An eyebrow, the one heading, a sentence, one call to action and a feature grid divided by grooves.
- `sign-in`: new block. Email and password in one step, with an error summary, a password you can show and a busy button.
- `sign-up`: new block. Email and a password of at least 15 characters, then a six-digit code on its own step, with resend.
- `page-states`: new block. Empty, loading, error and not found as one family, with an error page for SvelteKit's error route.
- `settings`: new block. Sections saved by one button, an inline "Saved", and a confirmed delete.
- `button`: changed, not an interface change. The `link` variant has no side padding at any size, so a link-styled button lines up with the text around it. Its height is unchanged. No other existing item changed.
- Install blocks without `-o`: without it, the CLI lists the files that already exist and asks before it overwrites any. Use `-o` only for a first install into an app with nothing to lose.

## 0.2.0 — 2026-10-28

The first primitives: forms, surfaces and feedback, restyled from shadcn-svelte's maia items to the tokens.

- `pluto-theme`: additive, not an interface change. Adds the elevation and scrim colours (`elevation-line`, `elevation-shadow`, `scrim`), `shadow-elevation`, the `focus-ring` and `focus-ring-none` utilities, and `animate-enter` and `animate-exit` with their `pluto-enter` and `pluto-exit` keyframes.
- `button`: new. Default, secondary, ghost, destructive and link at 48 and 32 px, with a busy state.
- `tooltip`: new. An inverted chip that opens on hover and focus.
- `kbd`: new. A key, or a group of keys.
- `card`: new. A raised surface whose title is a heading.
- `separator`: new. The groove, decorative by default.
- `item`: new. A row of media, content and actions.
- `table`: new. A data table with selectable rows and an optional scroll region.
- `tabs`: new. A pill strip or underlined tabs.
- `collapsible`: new. A button that shows and hides a region.
- `avatar`: new. Initials or an image at the case radius.
- `alert`: new. Default, destructive, success and caution, each with its role.
- `alert-dialog`: new. A modal confirm on the scrim that starts on Cancel.
- `badge`: new. An untinted state label.
- `empty`: new. An empty state with a heading.
- `skeleton`: new. A static, hidden placeholder.
- `spinner`: new. Decorative, or announced with a label.
- `label`: new. A form label.
- `field`: new. Wires a control's id, description, error and invalid state.
- `input`: new. A 48 px text input.
- `textarea`: new. A multi-line input that grows where it can.
- `input-group`: new. Addons, one focus ring, and a password toggle.
- `native-select`: new. The browser's select, styled as an input.
- `checkbox`: new. A 24 px checkbox.
- `radio-group`: new. Round radios with one stop.
- `switch`: new. A 64 × 32 blue switch.
- `input-otp`: new. A six-digit code that accepts a paste.

## 0.1.0 — 2026-10-27

The first release.

- `pluto-theme`: new. The brand's colours for light and dark, the 8 px case radius, the 4 px spacing atom, the type scale, motion, focus and the groove.
- `font-geist`: new. Geist, the body face.
- `font-heading-ibm-plex-sans`: new. IBM Plex Sans, the heading face.
- `font-jetbrains-mono`: new. JetBrains Mono, for labels, code and data.
- `utils`: new. `cn` and the four prop-type helpers stock components import.
- `four-dot`: new. The four-dot mark (`FourDot`) and the wordmark lockup (`Lockup`).
