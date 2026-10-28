# Changelog

Each release of the registry, newest first. A change to an item's interface is marked **interface change**.

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
