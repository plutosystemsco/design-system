# The owner's decisions

The owner's answers and decisions, newest first. A decision that changes the constitution is also recorded in its Status line.

### Design book v2 is the token source (2026-10-27)

Asked after `research/2026-10-27-a-shadcn-svelte-registry-and-what-pluto-already-has.md`, which found v2 still "proposed" with four open calls. The site's code also falls short of it in three places: a stock dark theme, a four-dot gap of .16 em, and red and green text that fails WCAG AA. **Answered:** accept v2 and fix as we go. What follows: the tokens-and-registry specification takes its tokens from `plutosystemshq/pluto-systems-design-book-v2.html`. It puts each of the four open calls to the owner with a recommendation, and fixes the contrast failures.

### Named dependencies are allowed (2026-10-27)

The owner withdrew "no external dependencies" while scoping `wasi-python-dev`. What follows: constitution §4.6 allows a dependency that a registry item names and pins. Installing stock components from shadcn-svelte's own registry is using a dependency, not copying prior art.

### A separate repository, `plutosystemsco/design-system` (2026-10-27)

Decided while scoping `wasipython.dev`, Pluto Systems' first full web application. **Answered:** the design system is its own repository, built like shadcn: a place where all the styling and components live, developed in tandem with `plutosystemsco/wasi-python-dev`. Its starting material is the existing brand work in the `plutosystemshq` repository: the design book (IBM Plex type, colour, the wordmark and the four-dot mark) and the site's first shadcn-svelte components.

### A shadcn-svelte registry first, a CLI later (2026-10-27)

**Answered:** registry first. Apps run shadcn-svelte's `add` command against this registry and get source copies. A branded Pluto CLI may wrap the registry later.
