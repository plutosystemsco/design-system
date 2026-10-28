# Changelog

Each release of the registry, newest first. A change to an item's interface is marked **interface change**.

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
