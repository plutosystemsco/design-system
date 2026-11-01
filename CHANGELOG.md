# Changelog

Each release of the registry, newest first. A change to an item's interface is marked **interface change**.

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
- `marker`: new. A line in a conversation that is not a turn: plain, a separator, or underlined; no role unless the app passes one.
- `composer`: new. The form a person writes a message in: a textarea that grows from 64 to 256 px by `field-sizing`, Enter to send and Shift Enter for a line, a 48 px send button that becomes Stop while a reply runs, a status that says "Responding", "Stopped" and "Response complete", and never a disabled control.
- `sonner` is not served. A timed toast with a tab stop at the end of the page fails the rules every accessibility source agrees on; the pattern is a `status` region present at render for the announcement and an inline `alert` where the action was taken.

## 0.4.0 — 2026-10-31

Code and data: the items that show code or a number, a highlight palette that is tokens, and the first app's editor and fuel meter.

- `pluto-theme`: additive, not an interface change. Adds the twelve code tokens (`--code-foreground`, `--code-background`, `--code-keyword`, `--code-string`, `--code-constant`, `--code-function`, `--code-comment`, `--code-link`, `--code-inserted`, `--code-deleted`, `--code-changed`, `--code-active-line`, each a semantic colour, with their `text-code-*` and `bg-code-*` utilities), the `scrollbar` utility (`scrollbar-color` from `input` on `muted`, thin), the `[data-slot="meter"]` rules that paint the native meter from the tokens, and `font-variant-ligatures: none` on code.
- `code-block`: new. Code, output or a diff on the muted inset, highlighted from the code tokens as classes, with line numbers, a copy button that announces "Copied", emphasised lines by an opaque step and a marker, and a header divided by the groove.
- `code-editor`: new. A CodeMirror 6 editor themed from the tokens, with line numbers and a Python preset, that prerenders as plain code, draws one ring around the whole editor, binds Ctrl Enter and Cmd Enter to `onrun`, and leaves Tab unbound.
- `highlighter`: new. Shiki with the JavaScript engine and a theme whose every colour is a code token; `highlightCode` for a server load and `tokenClass` for the class a token takes.
- `use-highlighted-code`: new. A hook that highlights a changing string line by line as it grows.
- `chart`: new. A figure for layerchart named by its caption, with its data as a table behind "Show as table", series coloured by token classes or `var()` props, and a tooltip on the elevation shadow. No injected stylesheet, no motion.
- `meter`: new. The native meter on the muted track with a primary fill and square ends, for a measurement in a known range such as fuel; the app names it and writes its numbers beside it.
- `popover`: new. A small dialog anchored to its button, 256 px wide, on the elevation shadow alone, named by its title or a `label`, that returns focus when it closes.
- `accordion`: new. Headings that each open a labelled region, wired with `aria-controls`, divided by grooves, with one caret that turns, moved by the arrow keys.
- `toggle`: new. A two-state button, inverted when pressed, at 48 and 32 px.
- `toggle-group`: new. A row of toggles with one stop, moved by the arrow keys, for one choice or several; a selected item is inverted.
- `scroll-area` is not served. Its hover-only 10 px scrollbar fails the 24 px target rule and hides from touch and keyboard users. Use a native box instead: `overflow-auto scrollbar` with `tabindex="0"` and a label, as `table`'s region and `code-block`'s `pre` do.

## 0.3.0 — 2026-10-28

The first blocks: whole pages an app installs with one `add` and then owns, and the two components they share.

- `status`: new. An empty polite live region, present from the first render, whose text the app sets.
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
