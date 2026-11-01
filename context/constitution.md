# Constitution

- **Status:** in force since 2026-10-27. Amended 2026-10-27 (§4.6 allows named dependencies) and 2026-11-01 (§2 and §4.2: the goal names no single app, and "done" is proven in this repository).
- **Owner:** Pluto Systems, PBC
- **Scope:** every document, script and line of code in this repository, and everyone working on it. The other documents under `context/` obey this one. It changes only by a decision recorded in `decisions.md` and noted in its Status line.

## 1. Mission

The Pluto Systems design system: the tokens, styles and Svelte components every Pluto Systems application is built from, delivered the way shadcn delivers them. An app copies the source in and owns it.

## 2. The goal, stated so it can be checked

This repository is developed over time to meet the needs of Pluto Systems, PBC. It has no final state. Each release is complete in itself, and a release is ready when all of these are true:

1. The brand's tokens (colour, type, spacing, radius, motion), drawn from the Pluto Systems design book, live here as one source, for light and dark themes.
2. A shadcn-svelte-compatible registry is published. An app installs a component with shadcn-svelte's `add` command pointed at it and gets source files, with their dependencies resolved.
3. Every item in the registry has a page that shows it, in both themes.
4. Every specification the release carries is done: its acceptance criteria are met here, its built change is reviewed, and the release is tagged.

## 3. What this project is not

- Not a package an app imports at run time. An app owns its copy.
- Not a website. Its preview pages exist to show and test the components.
- Not a CLI. A branded CLI may wrap the registry later, by a recorded decision.

## 4. Hard constraints

1. **Source, not a package.** Nothing an app installs from here reaches back to this repository at run time.
2. **Driven by need.** A component is added when a Pluto Systems application needs it, and the specification that adds it says what the need is. The component is done when its criteria are met here. An app's adoption is never a criterion.
3. **Tokens are the one source.** A colour or size in a component comes from a token, never a literal.
4. **Accessible by default.** Contrast meets WCAG 2.2 AA in both themes; every interactive component works by keyboard.
5. **Every input is pinned** through `bun.lock`.
6. **Dependencies are named and pinned.** A component that needs a library or a service says so in its registry item. Installing a component from shadcn-svelte's own registry is using a dependency as it is meant to be used (MIT), not copying prior art.

## 5. How we work

**Research → spec → review → tests → code → review** (`README.md`). Nothing lands unreviewed. Knowledge lives in this repository.

Four roles. One person may hold more than one, except that a reviewer never reviews what they wrote. The **owner** decides what the system is for and settles any question the other roles cannot. The **design lead** writes specifications and runs the pipeline. A **builder** implements one specification. A **reviewer** reads a specification or a built change fresh, having written neither.

## 6. Never

- Commit or push without the owner asking.
- Copy code from prior art.
- Break an installed app silently. A component's change that alters its interface says so in its changelog.
