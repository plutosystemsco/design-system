# Handoff

- **Status:** the state of the work, replaced at each release.
- **Date:** 2026-11-07

## State

`v0.11.0` (2026-11-07) is the last release. It holds `009` to `012` in one release (`decisions.md`, "One release, 0.11.0", 2026-11-07). 0.9.0 and 0.10.0 are never tagged; their snapshots are deleted. `package.json` reads 0.11.0, `static/v0.11.0/` is built, and the changelog has one 0.11.0 entry.

1. **`009`, expressive mode and the brand slots.** Built and change-reviewed. `data-mode="expressive"` is a second voice on the same tokens. Lint rule L22 keeps expressive-only classes out of productive items.
2. **`010`, the stage compositions.** Built and change-reviewed. Nine compositions and the `product-home` block.
3. **The identity, settled.** The owner answered all fourteen questions over two rounds (`decisions.md`, 2026-11-06). The exhibit at `/identity` is the research record.
4. **`011`, the brand.** Built, change-reviewed, every finding fixed or answered.
   - Deep Field's hues on the warm canvas `#F3F0E8` and graphite `#16140F`.
   - Four colour fields, `field-1` to `field-4`, with `surface-plain` to restore the theme's roles.
   - Frosted glass on expressive pages only, with opaque fallbacks. The lens was removed by the owner's ruling ("Frost only", 2026-11-07).
   - `type-poster`, a spring ease for the dots only (L23), and the E6 risen-colon lockup.
5. **`012`, the compositions on brand.** Built, change-reviewed, every finding fixed. The compositions and `product-home` now use the fields, `surface-plain` and glass. `009`'s stage and light tokens are removed.

The tree holds 75 items. The last full runs: unit 892 pass; `check` 0 errors; lint clean; literal lint 0 violations and 1 allowance (L24); e2e 1966 passed, 4 skipped; smoke 111 pass.

## Waiting on the owner

- Nothing.

## What this work checks, and what it does not

- Every page is checked in Chromium, in both themes, by the browser suites, axe and the keyboard walk. Firefox, Safari and iOS Safari are not checked. No screen reader has been run.
- The glass's Firefox mask order is written to the standard, but it is not run in Firefox.
- The exhibit's boards were checked by screenshot only; they have no tests of their own, by design.
- The last fixes to `011` and `012` were not re-reviewed by a reviewer; the counts are the builder's.

## Next

- **The product icons (G5)**, their own specification: the flat colour tile, Phosphor glyphs (already pinned by `002`), the eight-app colour map and the radius that scales with the icon.
- **A signature device** stays open. The owner set it aside for now (F, 2026-11-06).
- Carried over from `v0.8.0`: the code-palette specification, and the highlighter fault where an apostrophe inside a TypeScript `//` comment breaks the following lines.
- **After the `v0.12.0` tag, in 0.13.0** (owner decisions of 2026-11-15):
  - the rename of code names to Kuiper (`pluto` registry, `pluto-theme`, `pluto:` context keys, the token file), with a migration guide for installed apps;
  - lockup mock-ups for the Kuiper name, put to the owner for approval;
  - the accessibility status generated from the test report (everything must pass), with the high-contrast scheme and a forced-colours pass;
  - light and dark scoped to any subtree with `light-dark()` (`research/2026-11-15-scoped-schemes-and-contrast.md`), its four questions to the owner first;
  - prop doc comments on every item, so the API tables fill in.
