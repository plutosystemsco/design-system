# Project guidance for agents

## What this is

The Kuiper Design System, Pluto Systems' design system, and a public product any team may adopt: tokens, styles and Svelte components, delivered as a shadcn-svelte registry that apps copy source from. Code names (the `pluto` registry, `pluto-theme`, the `pluto:` context keys) stay `pluto` until 0.13.0's rename.

Read `context/constitution.md` first. It governs this file. Then read `context/README.md`, `context/handoff.md` and `context/roadmap.md`.

## Rules that bind all work

- **Research → spec → review → tests → code → review.** No code without a specification, and no specification without its research.
- **A small change** (a fix with no interface change, no new token or dependency, in one item or one page) is a one-page specification of kind _small change_: the defect, the fix, the check. It needs no research memo and no spec review. Its check is seen failing first, and its built change is reviewed by someone who did not write it (constitution §5).
- **Checkpoint rulings go in the specification's Landing notes**, not in `decisions.md`. `decisions.md` holds the owner's decisions, and rulings that change a rule or a budget.
- **Re-run the benchmark scorecard after each specification lands** (`context/research/benchmark-scorecard.md`). The change review cites its movement, and the roadmap is re-ranked from it.
- **Source, not a package.** An app owns what it installs.
- **Tokens are the one source** of every colour and size.
- **bun** for JavaScript; every dependency pinned by `bun.lock`.
- **Prior art is studied, never copied.**
- **Commit or push only when asked.**
- **All project knowledge lives in this repository**, under `context/`. Never save a memory outside it.
- **Anything waiting on the owner is asked as a question** with concrete options, the recommended one first, and recorded in `context/decisions.md` once answered.

## Explaining things

Short sentences. One idea each. Define a term of art the first time it appears.
