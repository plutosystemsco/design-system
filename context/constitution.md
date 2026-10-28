# Constitution

- **Status:** in force, 2026-10-27, drafted from the owner's answers of that day (`decisions.md`). Amended the same day: §4.6 allows named dependencies (the owner withdrew "no external dependencies").
- **Owner:** Clay Gendron
- **Scope:** every document, script and line of code in this repository, and every agent or person working on it. The other documents under `context/` obey this one. Change it only with the owner's explicit decision, recorded in its Status line and in `decisions.md`.

## 1. Mission

The Pluto Systems design system: the tokens, styles and Svelte components every Pluto Systems application is built from, delivered the way shadcn delivers them. An app copies the source in and owns it.

## 2. The goal, stated so it can be checked

Version 1 is ready when all of these are true:

1. The brand's tokens (colour, type, spacing, radius, motion), drawn from the Pluto Systems design book, live here as one source, for light and dark themes.
2. A shadcn-svelte-compatible registry is published. An app installs a component with shadcn-svelte's `add` command pointed at it and gets source files, with their dependencies resolved.
3. The components `wasi-python-dev` needs for its home page are in the registry, each with a page that shows it.
4. `wasi-python-dev` is built from the registry, with no hand-copied styles.

## 3. What this project is not

- Not a package an app imports at run time. An app owns its copy.
- Not a website. Its preview pages exist to show and test the components.
- Not a CLI yet. A branded CLI may wrap the registry later, by the owner's decision.

## 4. Hard constraints

1. **Source, not a package.** Nothing an app installs from here reaches back to this repository at run time.
2. **Developed in tandem with its first app.** A component is added when an app needs it and is tested in that app before it is called done.
3. **Tokens are the one source.** A colour or size in a component comes from a token, never a literal.
4. **Accessible by default.** Contrast meets WCAG 2.2 AA in both themes; every interactive component works by keyboard.
5. **Every input is pinned** through `bun.lock`.
6. **Dependencies are named and pinned.** A component that needs a library or a service says so in its registry item. Installing a component from shadcn-svelte's own registry is using a dependency as it is meant to be used (MIT), not copying prior art.

## 5. How we work

As `wasi-python-dev` does: **research → spec → review → tests → code → review** (`README.md`). Nothing lands unreviewed. Knowledge lives in this repository.

## 6. Never

- Commit or push without the owner asking.
- Copy code from prior art.
- Break an installed app silently. A component's change that alters its interface says so in its changelog.
