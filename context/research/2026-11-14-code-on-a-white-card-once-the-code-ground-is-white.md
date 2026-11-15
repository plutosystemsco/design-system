# Code on a white card, once the code ground is white

- **Status:** complete. It was opened as a placeholder on 2026-11-14 and completed in place the same day.
- **Date:** 2026-11-14; completed 2026-11-14
- **Author:** a researcher working in the vfs repository at the owner's request (the placeholder); completed by the researcher in this repository
- **Question:** When the light-mode code ground becomes white or lighter than the page, what does a code block do on a surface that is already white?
- **What it blocked:** the specification that changes the code ground, now [`../specifications/014-the-white-light-mode-code-ground.md`](../specifications/014-the-white-light-mode-code-ground.md). The owner, asked this with four options on 2026-11-14: "please mark this as something the design system needs to figure out" (`decisions.md`, 2026-11-14).
- **The answer, in one line:** one code ground everywhere, white in light mode, and every code block and editor edged by the theme's hairline, in both themes. The light active line is the page canvas, `#F3F0E8`. The light selection on white is `#E4E7F9`; its token waits for a palette that also passes on a dark selection (§4).

## How to read this memo

Every claim carries a label.

- **EXECUTED:** we ran it and saw the result, on 2026-11-14.
- **READ:** a file of this repository says so. Files are read in the working tree on 2026-11-14, on top of `v0.11.0` (`8cb06ba`).
- **INFERRED:** our reasoning from the two.

Terms used here.

- The **code ground** is the colour behind code: `--code-background`, which `code-block` and `code-editor` read.
- The **surround** is the colour just outside a block's edge: the surface it sits on.
- **Flush** means the block's ground equals its surround. An **inset** is a block told from its surround by a ground of a different colour.
- The **hairline** is the theme's `border` role, a 1 px line. It is `line` (`#0B0F171A`, ink at 10%) in light and `paper-line` (`#F3F0E81A`) in dark. Composited, it reads `#E6E7E7` on white and `#403C35` on `#2C2821`.
- **ΔE** is the OKLab distance × 100, as the workbench computes it (`deltaE` in `src/lib/workbench/palette.ts`).
- An edge **reads** when the block's ground, or its hairline, is at least ΔE 3 from the surround. The threshold is the one the workbench's own test uses for "the active line shows on the ground" (READ, `tests/unit/workbench.test.ts`). It is a floor for a large area or a line, not for text.

**How the figures were made (EXECUTED).** A script imported `contrastRatio`, `deltaE`, `oklch` and `mix` from `src/lib/workbench/palette.ts` and `compositeAlphaByte`, `contrastRatio` and `contrastTable` from `scripts/contrast.ts`, by absolute path. It read the colours from `tokens/pluto.tokens.json` and from the `tombaugh` candidate in `research/2026-11-14-meridian-and-tombaugh.json`. The two contrast functions agree (both give `#636972` on white as 5.53). Ratios are WCAG 2.2's, truncated to two decimals. Nothing in the repository was changed to run it.

## What was known when the placeholder was opened

These still hold.

- **READ** (`src/lib/registry/ui/live-console/live-console.svelte`, `src/lib/registry/ui/stage-card/stage-card.svelte`): both place a `CodeBlock` inside a surface drawn with `bg-card`, which is white in light mode.
- **READ** (`src/lib/registry/ui/code-block/code-block.svelte`): the block reads `bg-code-background`, and its comment says a block that should stay an inset passes `class="bg-muted"`.
- **READ** (`context/decisions.md`, "The design calls for `004`, code and data", 2026-10-31): code sits on an inset "with no border"; an inset is told by its ground.
- **INFERRED:** with a white code ground, a block on a white card has no ground of its own. Its edges are no longer visible unless something else draws them.
- **READ** (`research/2026-11-14-a-white-code-ground-in-light-mode.md`, section 2): every shipped code colour passes 4.5 to 1 on `muted`, on `card` and on `background` in both themes.

The options put to the owner were: (1) keep today's `muted` inset on a white card; (2) use the page colour as the inset on a white card; (3) sit flush on the card with a hairline; (4) sit flush with nothing around the block.

## What changed since

- **READ** (`decisions.md`, "Tombaugh, a number role, the white ground first, and docstrings as strings", 2026-11-14): the palette `013` ships is Tombaugh. Its light colours are tuned for a white ground. The white ground lands with or before `013`. Dark mode keeps its ground, and the page canvas never changes.
- **EXECUTED:** two tuned Tombaugh light colours fail on `wash` (`#E9E5DB`, today's `muted`): comment `#636972` at 4.40 and number `#856300` at 4.41. Every other Tombaugh light colour passes there (lowest constant `#A34D15`, 4.59). So once `013` lands, **light code may not sit on `wash` at all**, on a card or anywhere else. Option 1 is closed by measurement, and so is any rule that lets a block take a `muted` surround as its ground.

## 1. Every place a code block sits, and what is under it

The block's own ground is opaque, so what is under it matters only for its edge. The table lists the surround.

| Where | Item or surface | Light surround | Dark surround |
|---|---|---|---|
| A page, a docs page, a content column | the page, `background` | `#F3F0E8` | `#16140F` |
| A sidebar | `sidebar` | `#F3F0E8` | `#16140F` |
| An assistant's turn in a chat | `chat-pane` draws `bg-background`; the turn is `plain` | `#F3F0E8` | `#16140F` |
| A user's turn in a chat | `message`'s `bubble`, `bg-muted` | `#E9E5DB` | `#2C2821` |
| A card, an alert | `card`, `alert`, `bg-card` | `#FFFFFF` | `#221F19` |
| A dialog, a sheet, a popover, a menu | `bg-popover` or `bg-card` | `#FFFFFF` | `#221F19` |
| `stage-card`, `live-console` | `bg-card` with `surface-plain`, on a field or the canvas | `#FFFFFF` | `#221F19` |
| An ink surface | `class="dark surface-ink"`; the block goes flush with it | `#16140F` (the surface, on a light page) | `#221F19` (the surface, on a dark page) |
| Glass, if an app put code there | `glass`, its tint over the canvas, or its opaque fallback | `#F3F0E8`, fallback `#FBFAF6` | `#16140F`, fallback `#221F19` |

- **READ** (`src/lib/registry/components/chat-turn.svelte`, `chat-text.svelte`, `ui/message/message-content.svelte`): a user turn renders its text, code blocks included, inside the `bubble`, on `bg-muted`.
- **READ** (`build-tokens.ts`, the `.surface-ink` rules): inside an ink surface the code ground is the surface and the active line is `muted`.
- **READ** (`decisions.md`, "The identity: round two answered", 2026-11-06): glass carries ink, ink-soft and blue text only. **INFERRED:** no item puts code on glass, and none should. A field holds code only inside a `surface-plain` card (`stage-card`, `live-console`), so a code block's surround on an expressive page is the card.
- **EXECUTED:** a code block in a user's turn has no edge today, in either theme. Its ground equals the bubble's: ΔE 0.0 in light (`#E9E5DB` on `#E9E5DB`) and in dark (`#2C2821` on `#2C2821`). This is a defect in `v0.11.0`, independent of the white ground.

## 2. The options, measured

Light mode. The first figure is the ground against the surround. The second is the hairline against the surround. "Reads" means either is ΔE 3 or more.

| Option | Page `#F3F0E8` | Card `#FFFFFF` | Bubble `#E9E5DB` | Glass fallback `#FBFAF6` |
|---|---|---|---|---|
| `v0.11.0`: `wash` ground, no line | 3.3 · none: reads, darker than the page | 7.9 · none: reads | **0.0** · none: **no edge** | 6.3 · none: reads |
| White, flush with no line | 4.6 · none: reads | **0.0** · none: **no edge** | 7.9 · none: reads | **1.6** · none: **no edge** |
| **White with the hairline** | 4.6 · 3.0: reads | 0.0 · **7.3**: reads | 7.9 · 1.5: reads | 1.6 · **5.8**: reads |
| Page-colour inset (`#F3F0E8`) on white surfaces | 0.0 · 7.0 (if lined) | 4.6 · 11.5: reads, darker than the card | 3.3 · 3.8: reads | 3.0 · 10.0: reads |
| The block takes its surround's colour | 0.0: no edge, and not lighter than the page | 0.0: no edge | 0.0: no edge, and **Tombaugh fails on `wash`** | 0.0: no edge |

Dark mode, with the ground unchanged at `#2C2821`.

| Option | Page `#16140F` | Card `#221F19` | Bubble `#2C2821` | Ink surface `#16140F` / `#221F19` |
|---|---|---|---|---|
| `v0.11.0`: no line | 8.7: reads | 3.8: reads, just | **0.0: no edge** | flush, 0.0: no edge, by design (`007` decision 8) |
| **With the hairline** | 8.7 · 16.6 | 3.8 · 11.7 | 0.0 · **7.9**: reads | 0.0 · 9.5 / 8.6: reads |

All figures EXECUTED. Ratios behind them, for the record (EXECUTED): white against the page is 1.13 to 1; `wash` against the page 1.10; white against `wash` 1.25; the dark ground against graphite 1.25 and against the dark card 1.12.

What each option costs (INFERRED from the figures and the files):

1. **Keep the `muted` inset on a white card.** Closed. Tombaugh's comment and number fail on `wash` (§"What changed since"). It also keeps the block darker than its surround, the thing the owner asked to undo.
2. **The page colour as the inset on a white card.** Every colour passes on `#F3F0E8`. But the block is darker than its card again, the owner's complaint in miniature. Its emphasised line can no longer be the page colour, so light mode would need a second pair of grounds (paper ground with a white line) and a second set of contrast rows. And a block cannot see its surround from CSS: each item, and each app that puts a block in a dialog or a popover, would have to pass a class. An app that forgets gets a block with no edge.
3. **Flush on white with a hairline.** The edge reads on every surround in both themes: by the ground where the surround is not white, by the line where it is. It needs no knowledge of the surround, so a block in an app's own dialog is right with nothing passed. It matches the surfaces around it: since `011`, a card and an overlay are told by a hairline, not a shadow (I5, "hairline only"; READ, `decisions.md`, 2026-11-07). It fixes the user-turn defect in both themes. The cost: `004`'s "no border" goes, and every block and editor grows by 1 px on each side.
4. **Flush with nothing.** The edge vanishes on a card, a dialog and the glass fallback. A block is a scroll container (`004`): a long line is clipped at an edge the reader cannot see. In `live-console`, which has no header, the code would float as bare text in the card.
5. **The block takes its surround's colour.** It has no edge anywhere. On the page it is not lighter than the page. In a user's turn it puts Tombaugh on `wash`, where two colours fail.

**On a card, the hairline nests.** In `stage-card` the card's own line sits 8 px outside the block's (the card's `p-2`). In `live-console` it is 24 px outside (`p-6`). INFERRED: the inner line is the scroll region's edge, which the card's line cannot stand in for, so both stay. The design lead looks at both at the build's checkpoint.

## 3. The light active line on white

The active line is the editor's caret line and the block's emphasised line (`highlighted`, `added`, `removed`). Today it is `card`, white. On a white ground it would vanish (ΔE 0.0).

| Candidate | ΔE from white | Ratio to white | Lowest Tombaugh light colour on it | Lowest `v0.11.0` light colour on it |
|---|---|---|---|---|
| **The page canvas, `paper`, `#F3F0E8`** | 4.6 | 1.13 | comment 4.86, number 4.87 | number (orange) 4.97 |
| `wash`, `#E9E5DB` (the swap the first memo proposed) | 7.9 | 1.25 | **comment 4.40, number 4.41: fail** | number 4.50 |

All EXECUTED.

- **INFERRED:** `wash` would show the line better, but it fails Tombaugh, so it is out. The canvas passes every colour of both palettes, with 0.36 or more to spare. It is ΔE 4.6 from white, over the threshold of 3.
- **READ** (`code-block-line.svelte`): an emphasised line in a block also carries a 2 px marker in `primary`, `success` or `destructive`, and a `+` or `−`. So the block's emphasis never rests on the ground alone. The editor's caret line has no marker; it is a convenience, and the caret itself shows the line.
- **EXECUTED:** the chrome on the canvas line passes: line numbers (`muted-foreground`) 6.48; the `+` (`success`) 5.16; the `−` (`destructive`) 5.27; the marker (`primary`, a non-text mark, 3:1 needed) 6.16.
- **Dark** keeps `ink-raised`, `#221F19`, ΔE 3.8 from the dark ground. Unchanged.

The workbench reached the same light line. Its `withWhiteGround` uses the canvas (READ, `src/lib/workbench/baseline.server.ts`), and Tombaugh was tuned with it (READ, the candidate's `code-active-line` swatch).

## 4. The selection on white

Today neither item draws a selection colour. Both use the browser's own (READ, `code-editor-theme.ts`: "Selection and caret are the browser's own"). The workbench proposes one. Tombaugh was tuned on a 13% brand-blue selection.

**Light (EXECUTED):** 13% of `primary` (`#2D48D4`) over white is `#E4E7F9`. It is the candidate's light selection exactly. It is ΔE 7.3 from white and 4.3 from the canvas line.

| Light selection | Lowest Tombaugh light colour on it | Lowest `v0.11.0` light colour on it |
|---|---|---|
| 10%, `#EAEDFB` | comment 4.74 | number 4.85 |
| 12%, `#E6E9FA` | comment 4.58 | number 4.69 |
| **13%, `#E4E7F9`** | **comment 4.50, number 4.52** | number 4.61 |
| 25%, `#CBD1F4` (the workbench's first proposal) | comment 3.68: fail | number 3.76: fail |

So `#E4E7F9` is the light selection on white. Every Tombaugh light colour reaches 4.5:1 on it, comments included. The comment sits exactly at the floor. A 12% selection would give 0.08 more, at ΔE 6.7 from white instead of 7.3, and 3.9 from the canvas line instead of 4.3 (EXECUTED).

**Dark is where the selection gets stuck (EXECUTED).** The same rule in dark, 13% of `blue-lifted` (`#93B0FF`) over `#2C2821`, is `#393A3E`, the candidate's dark selection. Tombaugh's dark colours pass on it (lowest comment 4.53). **The shipped `v0.11.0` dark colours do not:** `property` 3.73; `number`, `escape`, `builtin`, `type`, `tag`, `decorator`, `self` 3.87; `comment` 4.20.

| Dark selection | Lowest `v0.11.0` dark colour | Lowest Tombaugh dark colour | ΔE from the dark ground |
|---|---|---|---|
| 3% lifted blue, `#2F2C28` | 4.56 | 5.53 | 1.7: does not read |
| 4%, `#302D2A` | 4.49: fail | 5.45 | 2.2 |
| 13%, `#393A3E` | 3.73: fail | 4.53 | 7.3 |
| A blue at the ground's own OKLCH lightness (0.279), chroma 0.05, hue 265: `#1C2841` | 4.82 | 5.85 | 6.3 |

- **INFERRED:** no dark selection lighter than the ground both reads and passes the shipped dark colours. A blue at the ground's own lightness does (lowest 4.82, ΔE 6.3), but it is told from the ground by hue alone, unlike the light selection and unlike the candidate's. Either way it is a new dark colour, which the owner's ruling guards ("the page canvas and dark grounds still never change").
- **INFERRED:** a selection token must name a colour in both themes (READ, `scripts/tokens.ts`: both themes hold the same names). So it cannot land before the dark colours that pass on it. Those are `013`'s.
- **Recommendation for the selection:** the specification that changes the code ground does **not** add a selection token. It records `#E4E7F9` as the light selection the white ground supports. The token lands with the palette that passes on it in both themes, in `013` or a later palette specification, which also settles the dark value with the owner.

## 5. The rest of the block on white

- **EXECUTED:** the header's and footer's text and the line numbers (`muted-foreground`, `#505661`) read 7.38 on white. The groove under the header is the same line as the hairline, ΔE 7.3 on white.
- **READ** (`app.css`, `@utility scrollbar`; `code-editor-theme.ts`): the block's and the editor's scroll track is `muted`. **EXECUTED:** on white that track is a `wash` stripe, ΔE 7.9 from the ground. Its thumb, `input` (`#857E70`), is 4.02:1 on white, so a track in the code ground keeps the thumb above 3:1. In dark the track is already the ground; the thumb reads 3.12.
- **READ** (`code-editor.svelte`): the editor's root is drawn `bg-muted` directly, not from the code ground; only `.cm-editor` inside reads `--code-background`. Before it mounts, its prerendered `pre` sits on that `bg-muted` root. With a white ground the root must read the code ground too, or the prerendered editor shows `wash` and then turns white.
- **INFERRED, the editor on a card:** the editor and the block share the ground and the active line, so they share the answer. White with the hairline, on every surround. The editor's boundary as a control (WCAG 1.4.11, 3:1) is not met today either (`wash` on the page, 1.10), and is not this question.

## 6. Recommendation

1. **One light code ground, white, on every surround.** No inset variant for white surfaces, and no `class="bg-muted"` escape. The item comment and the `pluto-theme` page that offer it are withdrawn.
2. **Every code block and every editor carries the hairline,** `border-border`, in both themes. The edge then reads on every surround in §1: lowest ΔE 4.6 in light (the page, by ground) and 7.9 in dark (a user's turn, by line). It also fixes the user-turn block, which has no edge in either theme today.
3. **The light active line is the canvas, `paper`, `#F3F0E8`.** Every colour of `v0.11.0` and of Tombaugh passes on it (lowest 4.86, Tombaugh's comment). Dark keeps `#221F19`.
4. **The light selection on white is `#E4E7F9`** (every Tombaugh light colour 4.50 or more). No token yet: the shipped dark colours fail on the matching dark selection (lowest 3.73), so the token lands with the palette that passes on it in both themes.
5. **The scroll track inside code is the code ground,** so a white block has no `wash` stripe.
6. **The ink surface is unchanged.** A block inside it stays flush with the surface and gains the hairline, ΔE 8.6 or more.

## What this memo did not do

- It built nothing. No page of the preview app was looked at with the hairline or the white ground. The figures are computed from token values, not read from a rendered page. The build's checkpoint looks, in both themes, at a block on the page, in a card, in a user's turn, in `stage-card`, in `live-console` and in the ink surface.
- It measured no browser's default selection. That colour is the platform's and is not a token.
- It did not test the editor's boundary against WCAG 1.4.11.
- It studied no other design system's code blocks. The answer rests on this system's own surfaces and figures.
