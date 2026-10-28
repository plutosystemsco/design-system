# Project guidance for agents

## What this is

The Pluto Systems design system: tokens, styles and Svelte components, delivered as a shadcn-svelte registry that apps copy source from. Its first app is `plutosystemsco/wasi-python-dev` (`../wasi-python-dev`), built in tandem.

Read `context/constitution.md` first. It governs this file. Then read `context/README.md` and `context/handoff.md`.

## Rules that bind all work

- **Research → spec → review → tests → code → review.** No code without a specification, and no specification without its research.
- **Source, not a package.** An app owns what it installs.
- **Tokens are the one source** of every colour and size.
- **bun** for JavaScript; every dependency pinned by `bun.lock`.
- **Prior art is studied, never copied.**
- **Commit or push only when asked.**
- **All project knowledge lives in this repository**, under `context/`. Never save a memory outside it.
- **Anything waiting on the owner is asked with the AskUserQuestion tool**, with concrete options and the recommended one first.

## Explaining things

Short sentences. One idea each. Define a term of art the first time it appears.
