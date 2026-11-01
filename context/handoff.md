# Handoff

- **Status:** the state of the work, replaced at each release.
- **Date:** 2026-11-01

## State

Seven specifications are built, reviewed and released: `v0.1.0` to `v0.7.0`, the last three on 2026-11-01 (`v0.5.0` `616b8a0`, the eleven overlay, navigation and chat items; `v0.6.0` `ab3a400`, the app shell and the chat pane, the mark's entrance, the footer's furniture; `v0.7.0` `011fd75`, the 21-slot highlight palette across 26 languages in both engines, `code-languages`, the ink surface). Each has its change review with every finding dispositioned and its Landing notes written.

`v0.7.1` is the public-readiness release: every document rewritten to stand alone, the Apache-2.0 licence added, and three small fixes (the Shell row on the code-languages page, the duplicated code colour lines in the generated stylesheet, the lint rule numbering). Its rulings are in `decisions.md`, "After the public-readiness review".

The tree holds 63 items in ten groups and 92 prerendered pages. An app installs from a tag with no server running:

```
REGISTRY_URL=https://raw.githubusercontent.com/plutosystemsco/design-system/v0.7.1/static/r bunx --bun shadcn-svelte@1.7.1 add pluto-theme code-editor app-shell -y
```

Nothing is deployed to a host, by the owner's decision.

## What this release checks, and what it does not

- Every page is checked in Chromium, in both themes, by the browser suites, axe and the keyboard walk. The meter was also checked in WebKit. Firefox, Safari and iOS Safari are not checked.
- No screen reader has been run; the tests prove the DOM contract (names, roles, states, live regions).
- The editor highlights 18 languages through a Lezer grammar and Svelte through a third-party one; eight more (Shell, TOML, diff, Dockerfile, Ruby, Swift, Kotlin, C#) run in a legacy mode that colours keywords, strings, numbers and comments only. The `code-languages` page says which.
- Docstrings are coloured as comments by Shiki and as strings by the Lezer Python grammar. Both are correct to their grammars.
- The browser suites run against the production build. The development server's pages are walked by hand before a release.
- The chart draws nothing on the server: a prerendered chart page shows its caption and table until hydration.

## Next

No specification is scheduled. The next one begins, as every one does, with a need written down by a Pluto Systems application and a research memo that studies it.
