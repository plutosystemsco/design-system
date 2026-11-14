# Code on a white card, once the code ground is white

- **Status:** placeholder
- **Date:** 2026-11-14
- **Author:** a researcher working in the vfs repository at the owner's request
- **Question:** When the light-mode code ground becomes white or lighter than the page, what does a code block do on a surface that is already white?
- **What it blocks:** the specification that changes the code ground. The owner, asked this with four options on 2026-11-14: "please mark this as something the design system needs to figure out" (`decisions.md`, 2026-11-14).

## How to read this memo

It is a placeholder: it holds a question, what is known, and what would answer it. It is completed in place when the answer is found. Claims are labelled **READ** (a file of this repository at `v0.11.0` says so) or **INFERRED** (our reasoning).

## What is known

- **READ** (`src/lib/registry/ui/live-console/live-console.svelte`, `src/lib/registry/ui/stage-card/stage-card.svelte`): both place a `CodeBlock` inside a surface drawn with `bg-card`, which is white in light mode.
- **READ** (`src/lib/registry/ui/code-block/code-block.svelte`): the block reads `bg-code-background`, and its comment says a block that should stay an inset passes `class="bg-muted"`.
- **READ** (`context/decisions.md`, "The design calls for `004`, code and data", 2026-10-31): code sits on an inset "with no border"; an inset is told by its ground.
- **INFERRED:** with a white code ground, a block on a white card has no ground of its own. Its edges are no longer visible unless something else draws them.
- **READ** (`research/2026-11-14-a-white-code-ground-in-light-mode.md`, section 2): every code colour passes 4.5 to 1 on `muted`, on `card` and on `background` in both themes, so any of those three grounds is open to it on a card.

## The options put to the owner

1. Keep today's `muted` inset on a white card.
2. Use the page colour, `background`, as the inset on a white card.
3. Sit flush on the card with a hairline around the block.
4. Sit flush with nothing around the block.

## What would answer it

Build the four options on `live-console` and `stage-card`, on the preview pages, in both themes. Look at each beside a code block on the page ground, and measure the block's edge against the card. Then put the pictures to the owner with a recommendation. The choice must also say what a `code-editor` does on a card, since the editor and the block share the ground.
