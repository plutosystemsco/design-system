# Handoff

- **Status:** the state of the work, replaced at each release.
- **Date:** 2026-11-01

## State

Seven specifications are built, reviewed and released: `v0.1.0` to `v0.7.0`, then `v0.7.1`, the public-readiness release (its rulings are in `decisions.md`, "After the public-readiness review"). The eighth, `008`, product identity, is built and reviewed and prepared as `v0.8.0`. Each earlier release has its change review with every finding dispositioned and its Landing notes written; `008`'s change review is the last step before its tag.

`008` makes the design system every Pluto Systems product's, not one site's. The shell shows a product's own logo, or its name as a wordmark, and can carry "A Pluto Systems product" in its footer, whose four dots dock in on hover as a 200 ms response. The tokens stay shared. Its rulings are in `decisions.md`, "One system, many products".

The tree holds 63 items in ten groups and 94 prerendered pages. An app installs from a tag with no server running:

```
REGISTRY_URL=https://raw.githubusercontent.com/plutosystemsco/design-system/v0.8.0/static/r bunx --bun shadcn-svelte@1.7.1 add pluto-theme code-editor app-shell -y
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

- `008`'s change review, then its tag when the owner asks.
- A palette specification, `009`, once the owner chooses among the code palettes the three palette memos of 2026-11-01 propose (`research/2026-11-01-how-a-code-palette-is-made.md`, `research/2026-11-01-how-brands-colour-their-code.md`, `research/2026-11-01-blue-on-ink-meets-github.md`).
- A fault found by the brand palette's research: in this registry's highlighter, an apostrophe inside a TypeScript `//` comment turns the next line into a comment, and the lines after it lose their colour. Stock Shiki tokenises the same lines correctly. It needs its own specification.
