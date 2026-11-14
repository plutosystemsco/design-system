# The theme with scripts turned off

- **Status:** placeholder
- **Date:** 2026-11-14
- **Author:** a researcher working in the vfs repository at the owner's request
- **Question:** Should a page built from this system follow the reader's light or dark preference when scripts are turned off, and if so, how, without writing every dark token twice?
- **What it blocks:** nothing built today. It is a need from one app, the vfs docs site, recorded so a later specification of the `theme` item can take it up (`decisions.md`, 2026-11-14).

## How to read this memo

It is a placeholder: it holds a question, what is known, and what would answer it. It is completed in place when the answer is found. Claims are labelled **EXECUTED** (run and seen on 2026-11-14), **READ** (a file of this repository at `v0.11.0` says so) or **INFERRED** (our reasoning).

## What is known

- **READ** (`src/lib/registry/ui/theme/theme-script.svelte`): the theme is a `dark` class on the root element, set before first paint by a script in the page's head that reads the stored choice, or else the system's preference.
- **READ** (the theme's stylesheet as an app installs it): the dark tokens are written under `.dark`. No rule follows `prefers-color-scheme` by itself.
- **EXECUTED** (a study in the vfs repository, in Chromium, on the vfs docs site built from this system at `v0.11.0`): with scripts off and the system set to dark, the page is drawn in the light theme. The site this one replaced followed the system with scripts off, from a `prefers-color-scheme` rule in its own stylesheet.
- **INFERRED:** an app cannot close this by itself without copying every dark token into a second rule, which would make the app a second source of the tokens.

## What would answer it

Try the ways a stylesheet can follow the system when no class has been set: the dark tokens under a `prefers-color-scheme: dark` rule guarded by a "no choice made" selector, or `light-dark()` values with `color-scheme`. For each, check that the stored choice still wins once the script runs, that there is no flash on load, and what it adds to the theme's size. Then decide whether the need is worth it for the few readers who browse with scripts off.
