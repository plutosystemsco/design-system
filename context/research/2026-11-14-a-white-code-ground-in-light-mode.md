# A white code ground in light mode: what decides the ground today, what a lighter one touches, and what every code colour measures on it

- **Status:** complete
- **Date:** 2026-11-14
- **Author:** a researcher working in the vfs repository at the owner's request
- **Question:** The owner, on seeing code blocks on the vfs docs site, which installs this system at `v0.11.0`: "we need to update design system to have code blocks in light mode be white or lighter than the background, not darker." What decides the code ground today? What would a lighter ground touch? Does every code colour still pass on it?
- **What it blocks:** a specification that changes the code ground, and the three questions for the owner at the end of this memo.

## How to read this memo

Every claim carries a label.

- **EXECUTED:** we ran it and saw the result, on 2026-11-14.
- **READ:** a file of this repository at `v0.11.0` (`8cb06ba`) says so.
- **INFERRED:** our reasoning from the two.

The _code ground_ is the colour behind code: the `--code-background` token, which `code-block` and `code-editor` both read. The _page ground_ is the `background` role, the warm canvas.

## 1. Today the code ground is darker than the page in light mode, and lighter than it in dark mode

- **READ** (`tokens/pluto.tokens.json`): the `code` map has one entry per slot and no theme of its own. `code.background` is `muted` and `code.active-line` is `card`. Each theme resolves the role: `muted` is `wash` (`#E9E5DB`) in light and `ink-wash` (`#2C2821`) in dark; `card` is `raised` (`#FFFFFF`) in light and `ink-raised` (`#221F19`) in dark.
- **READ** (`context/decisions.md`, "The design calls for `004`, code and data", 2026-10-31): "Code sits on the `muted` inset, with no border, and the groove divides its header from its code." Line emphasis is "an opaque `card` step".
- **EXECUTED** (ratios computed from the token values): in light mode the code ground is 1.10 to 1 against the page ground `#F3F0E8`, and darker than it. In dark mode it is 1.26 to 1 against `#16140F`, and lighter than it.
- **INFERRED:** what the owner asks for is already true in dark mode. The change is to light mode.

## 2. Every code colour already passes on white, and gains contrast there

- **READ** (`tests/unit/contrast.test.ts`, "the code slots on the six code grounds"): the suite already measures all 19 text slots on three grounds, `muted`, `card` and `background`, in both themes, and requires 4.5 to 1 on each. White is one of the grounds it holds.
- **EXECUTED** (ratios computed from the token values, light mode, on `muted` today and on `card`):
  - `foreground` `#0B0F17`: 15.25, then 19.18.
  - `comment` `#505661`: 5.87, then 7.38.
  - `keyword`, `constant`, `link`, `changed` (`primary`, `#2D48D4`): 5.59, then 7.03.
  - `string`, `inserted` (`success`, `#007351`): 4.68, then 5.88.
  - `number`, `escape` (`syntax-orange`, `#A44F12`): 4.51, then 5.67.
  - `function` (`syntax-amber`, `#915B00`): 4.51, then 5.68.
  - `builtin`, `decorator`, `self` (`syntax-purple`, `#903ACE`): 4.53, then 5.70.
  - `type`, `tag` (`syntax-teal`, `#15717A`): 4.54, then 5.71.
  - `property` (`syntax-cyan`, `#1A6C97`): 4.59, then 5.78.
  - `invalid`, `deleted` (`destructive`, `#C11E31`): 4.77, then 6.00.
- **INFERRED:** the lowest ratio rises from 4.51 to 5.67. No colour needs to change for a white ground.
- **EXECUTED:** white is 1.14 to 1 against the page ground, against 1.10 for today's ground. The block is slightly easier to see, and it is lighter than the page.

## 3. A white ground touches three things

- **The emphasised line.** **READ** (`code-block-line.svelte`, `code-editor-theme.ts`): a highlighted, added or removed line, and the editor's active line, are drawn on `--code-active-line`, which is `card`. **INFERRED:** on a white ground that step is white on white and the emphasis is lost. In light mode the two must swap: the ground becomes `card` and the emphasised line becomes `muted`. Text on that line then measures what code measures on its ground today, which passes.
- **Code on a card.** **READ:** `live-console.svelte` and `stage-card.svelte` place a `CodeBlock` inside a surface drawn with `bg-card`. **INFERRED:** in light mode a white block on a white card has no ground of its own. `code-block.svelte` already names the way out in a comment: a block that should stay an inset passes `class="bg-muted"`. `chat-text.svelte` places code in a chat pane drawn on `bg-background`, where a white block reads as on a page.
- **The map has no theme.** **READ:** `code.background` names one role for both themes. **INFERRED:** to change light mode and leave dark mode alone, the ground needs either a role of its own that each theme resolves, or a map that may name a role per theme. Moving both themes to `card` needs neither, but in dark mode `card` is 1.12 to 1 against the page, weaker than today's 1.26.

Two more places read the ground and follow it with no change of their own: the `surface-ink` rules in `pluto-theme`, which set the ground to the surface inside an ink surface, and `code-editor.svelte`, whose wrapper is drawn with `bg-muted` directly and would need to read the code ground instead.

## 4. What the owner decides

The record above says code sits on the `muted` inset. Changing that is the owner's, and three choices follow from it. Each is asked with its options, the recommended one first.

1. **The light-mode code ground.** White, the `card` colour, `#FFFFFF`: an existing ground, already measured for every code colour, no new colour in the system. Or a new tint between the page ground and white, which is a new colour and a new row in every contrast table.
2. **Dark mode.** Leave it as it is: the ground is already lighter than the page there, by the wider margin. Or move it to `card` too, which keeps one mapping for both themes and narrows the margin from 1.26 to 1.12.
3. **Code on a white card, in `live-console` and `stage-card`.** Keep those two blocks on the `muted` inset, so they still read as blocks. Or let them sit flush on the card with a hairline around them, which is a border where the system has so far used a ground.

## What this memo did not do

It built nothing and ran no suite. The ratios are computed from the token file's values with the WCAG formula, not read from a rendered page. No page of the preview app was looked at with a white ground; a specification's build would do that in both themes.
