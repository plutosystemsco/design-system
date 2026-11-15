# 014 — The white light-mode code ground

- **Status:** built and reviewed, 2026-11-14, landed in the working tree over `ef53f01` (`v0.11.0`) at 0.12.0, for the `release/0.12.0` branch; released with `013` and `015` as `v0.12.0`, tagged once after their change reviews (decision 13). Change review: [`../reviews/014-the-white-light-mode-code-ground-pr-2026-11-14.md`](../reviews/014-the-white-light-mode-code-ground-pr-2026-11-14.md) (0 High, 0 Medium, 6 Low, all fixed). Its specification review is [`../reviews/014-the-white-light-mode-code-ground-spec-2026-11-14.md`](../reviews/014-the-white-light-mode-code-ground-spec-2026-11-14.md) (1 High, 4 Medium, 6 Low, each answered below).
- **Date:** 2026-11-14
- **Author:** the design lead
- **Kind:** a token change to `pluto-theme`: two code-only roles, so the light code ground is white and the light active line is the page canvas, with dark unchanged. A hairline on `code-block` and `code-editor`, and a scroll track in the code ground. Lint L19 takes one pattern for both this specification's names and `013`'s. Tests, item pages, the version bump to 0.12.0, and its part of the one 0.12.0 changelog entry. It ships in the 0.12.0 release it shares with `013` (decision 13). **Interface change** for installed apps (decision 12).
- **Depends on:** `v0.11.0` (`8cb06ba`), which holds every item this specification changes: [`004`](./004-code-and-data.md) (`code-block`, `code-editor`, the code map), [`007`](./007-the-full-highlight-palette-and-the-ink-surface.md) (the twenty-one slots, L19, the ink surface), [`011`](./011-the-brand.md) (the canvas, the hairline, the grounds), [`012`](./012-the-compositions-on-brand.md) (`stage-card`, `live-console` on `surface-plain`). It does not depend on the workbench, which 0.12.0 drops (decision 10).
- **Blocks:** [`013`](./013-code-highlighted-by-tree-sitter-in-meridian-roles.md), which depends on this specification, is built on it, and ships with it as 0.12.0. Tombaugh's light colours are tuned for this ground (decisions 13, 14).
- **Research it stands on:**
  - [`../research/2026-11-14-a-white-code-ground-in-light-mode.md`](../research/2026-11-14-a-white-code-ground-in-light-mode.md) (the ground memo): what decides the ground today, what a lighter one touches, and every shipped colour on white;
  - [`../research/2026-11-14-code-on-a-white-card-once-the-code-ground-is-white.md`](../research/2026-11-14-code-on-a-white-card-once-the-code-ground-is-white.md) (the card memo, a placeholder completed 2026-11-14): every place a block sits, the options measured, the active line and the selection on white;
  - [`../research/2026-11-14-meridian-and-tombaugh.json`](../research/2026-11-14-meridian-and-tombaugh.json), candidate `tombaugh`: the palette `013` ships.
- **Design calls:** `../decisions.md`, 2026-11-14: "One release, 0.12.0, for the white ground and tree-sitter"; "Tombaugh, a number role, the white ground first, and docstrings as strings" (its third bullet, "The light ground: white, first"); "Code takes Meridian's roles" (its bullet "Only the syntax colours change, never Pluto's backgrounds", which the first entry narrows); "The code ground in light mode is the owner's to change, and code on a white card is for this system to work out"; "A public design site, the workbench dropped, and properties under Meridian" (the workbench bullet).
- **Amendment, 2026-11-14.** While this specification was being built, the owner asked that inline code get the same treatment (`decisions.md`, "Inline code takes the code ground too"). Decision 15 carries it, with criteria 15 to 17 and lines in decisions 12 and 14, Scope, criteria 11 to 13, the build order, the checkpoint and Risks. Nothing else changes. Checkpoint 1's step number is corrected to the build order's (step 4).
- **Revised** 2026-11-14 after its specification review, [`../reviews/014-the-white-light-mode-code-ground-spec-2026-11-14.md`](../reviews/014-the-white-light-mode-code-ground-spec-2026-11-14.md) (1 High, 4 Medium, 6 Low); each finding is answered under "Review dispositions".
- **Figures** are the card memo's, EXECUTED on 2026-11-14 with this repository's `src/lib/workbench/palette.ts` and `scripts/contrast.ts`. The contrast counts in the criteria were EXECUTED by applying decision 1's change to the token file in memory and running `contrastTable` on it. Nothing in the repository was changed to run them.

## Intent

The owner, on seeing code blocks on a site that installs this system: "we need to update design system to have code blocks in light mode be white or lighter than the background, not darker." Today the light code ground is `wash`, `#E9E5DB`, darker than the canvas `#F3F0E8`. The owner calls it platinum and does not want it.

The owner then ruled that the white ground lands first, with or before `013`, because `013`'s palette, Tombaugh, is tuned for white. On `wash` two of its light colours fail AA (comment 4.40, number 4.41). Dark mode keeps its ground, `#2C2821`. The page canvas never changes.

So this specification does three things.

1. **The light code ground becomes white.** Two code-only theme roles carry the code ground and the active line. No shared role is retuned.
2. **The light active line becomes the canvas,** since white on white would vanish.
3. **Every code block and editor gets the theme's hairline,** so a white block keeps its edge on a white card, in a dialog, or in a chat turn.

**Terms of art.**

- The **code ground** is the colour behind code, `--code-background`. The **active line** is `--code-active-line`: the editor's caret line and the block's emphasised lines.
- A **code-only role** is a theme role that only the code map names. This system prefixes such roles `syntax-` (`007` decision 3).
- The **hairline** is the theme's `border` role at 1 px: ink at 10% in light, paper at 10% in dark.
- A **surround** is the surface just outside a block's edge. **ΔE** is the OKLab distance × 100 (`deltaE`). An edge **reads** when the block's ground or its hairline is at least ΔE 3 from the surround (the card memo's threshold, the workbench's own).
- The **selection** is the colour behind selected text.

**Not here:** the dark code ground, the page canvas, every other background; the code palette (`013`); a selection token (decision 3); the editor's boundary as a control (WCAG 1.4.11); any new language, item or prop.

## Decisions

### 1. Two code-only roles carry the grounds; `muted` and `card` are not retuned

The theme gains two roles. The code map's two grounds name them.

| Role | Light | Dark |
|---|---|---|
| `syntax-ground` | `raised`, `#FFFFFF` | `ink-wash`, `#2C2821` (unchanged) |
| `syntax-active-line` | `paper`, `#F3F0E8` | `ink-raised`, `#221F19` (unchanged) |

`code.background` becomes `syntax-ground` (was `muted`). `code.active-line` becomes `syntax-active-line` (was `card`). No primitive is added: all four values exist.

- _Why not retune `muted` or `card`:_ `muted` is the user's chat bubble, the tab list, the skeleton, the meter's track and `kbd`. `card` is every card and overlay. `accent`, every hover, names the same primitive as `muted` and is left as it is too. Retuning either changes surfaces the owner kept ("the page canvas and dark grounds still never change"). The workbench's preview made the same call (`withWhiteGround`: "no shared role is retuned").
- _Why not point the map at `card` and `background` directly:_ the map has no theme. One role name serves both themes. `card` in dark is `#221F19`, not today's `#2C2821`, so dark would change. The ground memo measured that: dark contrast to the page would fall from 1.26 to 1.12.
- _Why not a per-theme code map:_ themes already exist to say a role per theme. A map that names two roles per slot is a schema change to `tokens.ts`, `build-tokens.ts` and the CLI's emission, for what two theme roles do now.
- _Why the `syntax-` prefix:_ `007` decision 3 gave it to roles "reached only through the `code` slots". These two are such roles. A `code-` prefix would emit `--code-ground` beside the map's `--code-background`, in the map's own namespace.
- _Why `syntax-active-line`, not `syntax-line`:_ in this token file `-line` names a hairline (`line`, `paper-line`, `line-input`, `groove-line`, `elevation-line`). This specification adds a hairline to every block, so `--syntax-line` beside `--border` would read as the block's edge. The name mirrors the slot it fills, `active-line`, and a rename after 0.12.0 ships would be an interface change.
- _Why the light line names `paper`, not the `background` role:_ a role may name only a primitive (`tokens.ts`). It also keeps the line fixed if a later decision moves the canvas.

### 2. The light active line is the canvas, `#F3F0E8`

The card memo §3 measured it. On white it is ΔE 4.6 and 1.13:1. Every shipped light colour passes on it: lowest `number` (orange) 4.97. Every Tombaugh light colour passes: lowest comment 4.86, number 4.87. The chrome passes: line numbers 6.48, `+` 5.16, `−` 5.27, the `primary` marker 6.16 (3:1 needed).

- _Why not `wash`,_ the swap the ground memo first proposed: it shows better (ΔE 7.9), but Tombaugh's comment (4.40) and number (4.41) fail on it.
- _Why it is enough:_ a block's emphasised line also carries its 2 px marker and its `+` or `−` (`code-block-line.svelte`), so emphasis never rests on the ground alone.
- Dark keeps `#221F19`.

### 3. The selection is measured here, and its token waits

The light selection on white is **`#E4E7F9`**: 13% of `primary` over white, the value Tombaugh was tuned on. Every Tombaugh light colour reaches 4.5:1 on it (lowest comment 4.50, number 4.52). Every shipped light colour does too (lowest number 4.61). It is ΔE 7.3 from white and 4.3 from the active line.

This specification adds **no selection token**. The editor and the block keep the browser's selection, as since `004`.

- _Why:_ a token names a colour in both themes (`tokens.ts`). The matching dark selection, 13% of `blue-lifted` over `#2C2821`, is `#393A3E`. Tombaugh passes on it (lowest comment 4.53). **The shipped dark colours do not:** `property` 3.73, seven slots at 3.87, `comment` 4.20 (card memo §4). No dark selection lighter than the ground both reads and passes them. So a selection token cannot land before the dark colours that pass on it.
- _And:_ a dark selection is a new dark colour, which the owner's ruling guards. Whoever adds the token asks the owner.
- **The token lands with the palette that passes on it in both themes:** `013`, or a later palette specification. That specification uses `#E4E7F9` in light (or 12%, `#E6E9FA`, for 0.08 more margin) and settles dark.

### 4. Code takes one ground on every surface, edged by the hairline

Every `code-block` and `code-editor` draws `border border-border`, in both themes, on every surround. There is no inset variant for white surfaces.

The card memo §1 lists where a block sits; §2 measures each option. The hairline is composited over the code ground, since it is drawn inside the block's border box. With it the edge reads everywhere:

| Surround | Light: ground ΔE · hairline ΔE | Dark: ground ΔE · hairline ΔE |
|---|---|---|
| The page, a sidebar, an assistant's turn | 4.6 · 3.0 | 8.7 · 16.6 |
| The page, beside an emphasised line or the active line (the line runs to the border) | 0.0 · **3.0** (3.03, the tightest edge) | 4.9 · 16.6 |
| A card, a dialog, a popover, a sheet; `stage-card`, `live-console` | 0.0 · **7.3** | 3.8 · 11.7 |
| A user's turn (`muted` bubble) | **7.9** · 1.5 | 0.0 · **7.9** |
| The glass fallback, if an app put code there | 1.6 · **5.8** | — |
| An ink surface (flush by design) | 0.0 · 9.5 (light page) | 0.0 · 8.6 (dark page) |

- _Why a hairline:_ since `011` the system tells its surfaces by a hairline, not a shadow (I5, "hairline only"). A card and an overlay already carry `border-border`. A block is a scroll container (`004`); its edge is where a long line is clipped, so it must show.
- _Why everywhere, not only on white:_ a block cannot see its surround from CSS. A rule that depends on it needs every item, and every app that puts code in its own dialog, to pass a class. An app that forgets gets a block with no edge. One rule needs nothing passed.
- _Why in dark too:_ the dark ground does not change; only an edge is added. Dark has the same defect: a block in a user's turn has no edge today (ΔE 0.0), and on a dark card it reads by ΔE 3.8 alone. One rule in both themes, as for cards.
- _Why not the other options_ (card memo §2): today's `wash` inset fails Tombaugh; a page-colour inset makes the block darker than its card again, needs a second pair of grounds, and needs the surround passed in; flush with no line loses the edge on every white surface; taking the surround's colour loses it everywhere and puts Tombaugh on `wash` in a user's turn.
- **`004`'s "no border" is superseded.** The block still has no shadow, and its header is still divided by the groove.
- **The `class="bg-muted"` escape is withdrawn.** `code-block.svelte`'s comment and the `pluto-theme` page offered it for a block inside a card or a message. Code on `wash` fails this release's palette (Tombaugh's comment 4.40, number 4.41). Neither offers it again.
- **On a card the lines nest.** `stage-card`'s line sits 8 px outside the block's, `live-console`'s 24 px. The inner line is the scroll region's edge, which the card's cannot stand in for. Neither item changes. Checkpoint 1 looks.

### 5. The scroll track inside code is the code ground

The `scrollbar` utility draws its track in `muted`. In a white block that is a `wash` stripe, ΔE 7.9 from the ground.

- `pluto-theme` gains `@utility scrollbar-code`: `scrollbar-color: var(--input) var(--code-background)`, `scrollbar-width: thin`. `code-block-content` uses it in place of `scrollbar`.
- `code-editor-theme.ts`'s `.cm-scroller` sets `scrollbarColor: "var(--input) var(--code-background)"`.
- The thumb, `input`, reads 4.02:1 on white and 3.12:1 on the dark ground. Both are above 3:1.
- `scrollbar` itself is unchanged, for every other scroll box.

### 6. The ink surface is unchanged

`.surface-ink` and `.dark .surface-ink` keep their declarations. Inside an ink surface the code ground is the surface and the active line is `muted`, as `007` decision 8 has them. A block there gains the hairline (decision 4): ΔE 9.5 on a light page, 8.6 on a dark one.

### 7. Which items change, and which do not

**Change:**

- `pluto-theme`: decisions 1 and 5.
- `code-block`: the root's base classes gain `border border-border`. Its comment says the ground is the code ground, white in light mode, edged by the hairline, and drops the `bg-muted` advice. `code-block-content` uses `scrollbar-code`. `code-block-line` changes its comment only. Its first lines read: "Every line carries a transparent marker of the focus width, so an emphasised line's coloured marker shifts no column. The three emphasised variants are the active line, one opaque step from the code ground, with a marker in the state colour: shape and position, not a tint."
- `code-editor`: the root's `rounded bg-muted` becomes `rounded border border-border bg-code-background`. The prerendered `pre` then sits on the code ground before the editor mounts, as after. Its comment changes to match. `code-editor-theme.ts`: decision 5; the active-line comment ("the opaque card step") reads "the active line, one opaque step from the ground"; and `&.cm-focused`'s `outlineOffset` becomes `calc(var(--focus-offset) + var(--line-width))`.
  - _Why the offset:_ the block draws its ring on its root, 2 px outside the hairline. The editor draws its ring on `.cm-editor`, inside the root's new 1 px border, so at the same offset it would sit 1 px outside its edge. Adding the line width puts both rings 2 px outside the hairline.

**Do not change:** `stage-card`, `live-console`, `message`, `chat`, `chat-text`, `chat-turn`, `chat-pane`, `highlighter` (its page changes, decision 11), `use-highlighted-code`, `code-languages`. Each reaches the ground through `code-block` or the tokens.

### 8. The contrast checks measure the grounds code is on

`contrast.test.ts`'s code-slot rows are on `muted`, `card` and `background` in both themes today: 114 rows. After this change light code is never on `muted`. The rows become the grounds code is actually on:

- **light:** `syntax-ground`, `syntax-active-line`;
- **dark:** `syntax-ground`, `syntax-active-line`, and `background` (graphite: the ground inside an ink surface on a light page; the ink surface on a dark page is `card`, which equals `syntax-active-line`).

That is **19 slots × 5 = 95 rows**, each at 4.5 or more. The tightest is dark `property` on `syntax-ground`, 4.81. The tightest light row is `number` on `syntax-active-line`, 4.97, tied with `escape`. `004`'s pinned rows, five per theme, move from `muted` to `syntax-ground`.

_Why light has no third ground:_ the light page is never under light code. A block on the page is on its own white ground, and the canvas reaches code only as the active line, which is `syntax-active-line` already.

The token file's `contrast` lists gain the chrome on the code grounds, so `contrastTable` measures it in both themes:

- `text`: `["muted-foreground", "syntax-ground"]`, `["muted-foreground", "syntax-active-line"]`, `["success", "syntax-active-line"]`, `["destructive", "syntax-active-line"]`;
- `nonText`: `["primary", "syntax-active-line"]`.

`contrastTable` then holds 110 rows (was 100): 108 pass, the two recorded amber exceptions, 0 fail.

Two new groups in `contrast.test.ts`:

- **Tombaugh on these grounds.** It reads the `tombaugh` candidate from `research/2026-11-14-meridian-and-tombaugh.json` and measures its ten text colours on this specification's grounds and the 13% selection (decision 14). A research file is never edited after the fact (`context/README.md`), so the group stays valid after `013` lands. Once `013` ships Tombaugh in the token file, its own rows measure the same colours from the tokens, and `013` may remove this group.
- **The edge.** It composites the hairline over the code ground and measures it and the ground against each surround of decision 4's table.

**The arithmetic lives in `scripts/contrast.ts`,** not the workbench, which 0.12.0 drops. It gains two exports: `deltaE(a, b)`, the OKLab distance × 100, and `mix(a, b, t)`, `t` of the way from `a` to `b` in sRGB with each channel rounded. Both are written there to the published formulas (Björn Ottosson's OKLab matrices), not imported. Their unit checks pin `deltaE("#FFFFFF", "#F3F0E8")` to 4.61 at two decimals and `mix("#FFFFFF", "#2D48D4", 0.13)` to `#E4E7F9`.

**`scripts/contrast.ts` is their one home in 0.12.0.** `src/lib/workbench/palette.ts` keeps its own copies while the workbench exists, since this specification leaves the workbench alone (decision 10). `013`, when it drops the workbench, removes those copies with it. Any test of `013`'s that needs the two functions imports them from `scripts/contrast.ts`; it writes no third copy (for instance in `tests/helpers/`).

### 9. L19: one pattern for this specification's names and `013`'s

L19 flags a syntax colour named in an item file, in any form (`007` decision 3). It gets one pattern for 0.12.0, written here and adopted by `013` as written:

```ts
const SYNTAX_COLOUR =
  /syntax-(?:orange|amber|purple|teal|cyan|violet|blue|navy|green|yellow|plum|red|grey|ink|ground|active-line)\b/g;
```

- `orange|amber|purple|teal|cyan` are `v0.11.0`'s five colours. `013` keeps `orange` and removes the other four.
- `violet|blue|navy|green|yellow|plum|red|grey|ink` are `013`'s nine new colours.
- `ground|active-line` are this specification's two roles.
- _Why one pattern, with names that do not exist yet or no longer exist:_ the two specifications cannot then disagree on it, and neither has to edit it again. Naming an absent role in an item is wrong either way.
- An item reaches the code ground only through `bg-code-background`, `bg-code-active-line` or `var(--code-*)`.
- New bad samples: `bg-syntax-ground`, `bg-(--syntax-active-line)`, and the `.ts` string `"var(--syntax-ground)"`.

### 10. The workbench is left alone

0.12.0 drops the workbench (`decisions.md`, "A public design site, the workbench dropped, and properties under Meridian"). `013` removes its route. This specification changes no file under `src/lib/workbench/` or `src/routes/(workbench)/` and depends on none.

- Its preview of a white ground, `withWhiteGround`, was the research for this change. Once the tokens ship white, nothing needs to preview it.
- `tests/unit/workbench.test.ts` reads the token file. It is expected to pass unchanged (INFERRED, READ: its white-ground group builds its start from the token file, and its `adoptGround` cases compare slot names only). If a check fails after decision 1, the builder changes that expectation alone and names it in the landing notes.
- No test of this specification imports from the workbench (decision 8).

### 11. The item pages, a view, and the registry's description

Every page or comment that names `muted` or `card` as the code ground, or `muted` as code's scroll track, is corrected.

- **`code-block`'s page.** Intro: "Code on the code ground, white in light mode, edged by the hairline. The header is divided from the code by the groove. …" (the rest as today). The page shows a block on the page, in a `card`, and with emphasised lines.
- **`code-editor`'s page.** Intro, first sentence: "CodeMirror 6 on the code ground the code block shares, edged by the same hairline, every colour and size from the tokens, the same twenty-one slots the code block reads." The page shows an editor on the page and one in a `card`.
- **`highlighter`'s page.** Its slot table's two ground rows read `["background", "syntax-ground", "bg-code-background"]` and `["active-line", "syntax-active-line", "bg-code-active-line"]`.
- **`pluto-theme`'s page:**
  - the ink-surface paragraph loses its last sentence, the `class="bg-muted"` advice;
  - the code sample `pre` gains `border border-border`, as a block has;
  - the utilities paragraph adds: "The `scrollbar-code` utility is the same bar on the code ground, for a scroll box inside code"; and a second scroll box beside the first, on `bg-code-background` with `border border-border` and `scrollbar-code`, labelled `overflow-auto scrollbar-code`;
  - the ink-surface list's scroll-box line adds: "A code block's or editor's bar inside a surface draws its track on the surface itself.";
  - the code section shows `syntax-ground` and `syntax-active-line` with their values.
- **The chat thread view, `/view/chat/thread/`.** Message `m3`, the second user turn, gains a fenced block, so a block in a `muted` bubble is on screen for the tests and the checkpoint. Today no view shows one. Its text becomes `` "Show me a function that adds two numbers, so this works:\n\n```python\nadd(2, 3)\n```" ``. No turn is added: the thread keeps its 4 headings, and "Latest reply" still follows an assistant reply. The view gains 2 stops after `region:Messages`, in this order: `button:Copy code`, `pre:add(2, 3)`. The 31 views then hold 190 stops (was 188).
- **`registry.json`, `code-block`'s description:** "Code, output or a diff on the code ground, edged by the hairline, highlighted from the code tokens, with line numbers, a copy button and a header divided by the groove."

### 12. The interface change, and the shared changelog entry

0.12.0 has **one** changelog entry, shared with `013` (decision 13). This specification writes it first, at its landing. `013` adds its lines to the same entry; it does not start a new one.

**How the two parts merge:**

- One heading, `## 0.12.0 — unreleased`, until the tag gives the date.
- One bullet per item. A bullet is marked **interface change** when either specification changes that item's interface. `pluto-theme`, `code-block` and `code-editor` are each marked from this specification's landing on.
- In a shared bullet, `013`'s sentences come first (the code map and the colours), then this specification's (the ground, the active line and the edge).
- Neither part says of the other's subject that it is unchanged. This specification's part says only that **its** change renames and removes nothing. `013`'s part points to this one for the two grounds.

**The entry's lines this specification owns,** as they read once both parts are in. `{013: …}` marks where `013`'s sentences go; `013` decision 17 words them.

> {013: the release's summary line.} In light mode code sits on white, lighter than the page, and every code block and editor is edged by the hairline.
>
> - `pluto-theme`: **interface change.** {013: the code map is Meridian's roles; its renamed, new and removed `--code-*` variables and `syntax-*` roles; the colours.} The code ground and the active line have theme roles of their own, `--syntax-ground` and `--syntax-active-line`. `--code-background` and `--code-active-line` keep their names and now name them. In light mode the code ground is white (`#FFFFFF`), not `wash` (`#E9E5DB`), and the active line is the page canvas (`#F3F0E8`), not white; dark mode's grounds are unchanged. A new utility, `scrollbar-code`, draws a scroll box's track in the code ground; inside an ink surface that track is the surface, in both page themes. Inline code, a `code` element not inside a `pre` or a heading, is now a chip on the code ground with the hairline edge, the case radius, 4 px of side padding and the code body colour (the link colour inside a link), in both themes; the line height does not change, and a chip that wraps keeps its edge on each line. `kbd` and `samp` are unchanged. A class an app sets on its own `code` still wins, since the rule is in the base layer. The code-ground change itself renames and removes nothing; every rename and removal in this bullet is the code map's. An app's own class named `scrollbar-code` would take the theme's rule; rename it before updating. An app that painted its own surfaces with `--code-background` now gets white in light mode.
> - `code-block`: **interface change.** No prop, slot or export changes. {013: it renders the new roles.} The root draws a 1 px `border-border` on each side. At the same content it is 2 px taller. Where it fills its container, its width is unchanged and its code area is 2 px narrower, so a line that just fit may now scroll. Where it sizes to its content, as in a chat bubble, it is also 2 px wider. A fixed height keeps its size and shows 2 px less code. Its scroll track is the code ground. The advice to pass `class="bg-muted"` to keep an inset is withdrawn: code on `muted` does not meet AA with this release's colours.
> - `code-editor`: **interface change.** {013: its colour comes from the highlighter; its removed exports.} The root reads the code ground (`bg-code-background`) in place of `bg-muted` and draws the same hairline, with the same change of size as `code-block`. Its focus ring stays 2 px outside its edge. Its scroll track is the code ground. Prerendered, it is the colour it has once mounted.
>
> {013: what an app does to update.} Update `pluto-theme`, `code-block` and `code-editor` together. An app that updates the theme alone gets white blocks with no edge on its white cards.

- _Why "interface change" for `code-block` and `code-editor` with no prop changed:_ the code area narrows, or the box grows, by 2 px. An app laid out to a block's size sees it move. Constitution §6: never break an installed app silently. `pluto-theme`'s own part renames nothing, as `0.11.0` treated a palette change; its bullet is marked because `013`'s part changes its interface.

### 13. How it ships: one release, 0.12.0, with `013`

The owner's ruling (`decisions.md`, "One release, 0.12.0, for the white ground and tree-sitter", 2026-11-14): one release, 0.12.0.

- **The version moves to 0.12.0 at the start of this specification's build,** before the first registry build or dev server run (Build order, step 1). `build-registry.ts` writes `static/v<package version>/` on every build. Built at 0.11.0, it would overwrite the released `static/v0.11.0/`, and an app adding from the `v0.11.0` URL would get this change. `decisions.md`, "After the `009` build's checkpoint", settled the same: the version moves at the start of the build.
- This specification is built and change-reviewed first. It writes the one 0.12.0 entry, dated "unreleased" (decision 12).
- `013` is built on it, starts at 0.12.0, and does not bump the version again.
- **The tag comes once,** `v0.12.0`, after the change review of the last specification the release carries. The owner put the public design site in 0.12.0 too (`decisions.md`, "A public design site, the workbench dropped, and properties under Meridian"), so the tag follows the change reviews of both `013` and `015` (the design site, still to be written).
- **`015` is built after this specification.** It folds the item pages into the site, and criteria 8 and 13 read the `/items/…` pages where they are today.

_Why it still stands alone:_ every shipped colour passes on its grounds (lowest 4.81 in dark, unchanged; 4.97 in light). Its criteria measure the token file as it is when it lands, and Tombaugh separately from the research file. So it is correct before `013` is built on it, as the build order needs.

### 14. How `013` depends on this

`013` is being revised in parallel. When it is built on this specification:

- **Its code map's two grounds** are `background: syntax-ground` and `active-line: syntax-active-line`, not `muted` and `card`.
- **Its decision 9** is settled by the owner's ruling: the white ground lands first, and Tombaugh's light values ship as tuned, with no extra lightness step.
- **Its AA rows** are on decision 8's grounds: light 2 (`syntax-ground`, `syntax-active-line`), dark 3 (those and `background`). Its **fourteen** text roles make **70 rows**: 28 light and 42 dark. Not 84 on three grounds per theme: light code never sits on the light page (decision 8). If `013` keeps the page as a third light ground, it says why.
- **Its counts start from this specification's:** 55 theme roles. `013` removes four (`syntax-amber`, `-purple`, `-teal`, `-cyan`) and adds nine, so **60**. Its **ten** `syntax-*` colours (`syntax-orange` kept, nine added) sit beside this specification's two `syntax-*` grounds: twelve `syntax-*` roles in all.
- **L19's pattern** is decision 9's, adopted as written. `013` does not narrow it.
- **The version** is 0.12.0 from the start of this specification's build. `013` does not bump it (decision 13).
- **The changelog** is the one 0.12.0 entry this specification writes. `013` adds its sentences where decision 12 marks them, and its `pluto-theme` sentence says the two grounds are as this specification sets them.
- **Inline code (decision 15)** is emitted as utility names, not variables (decision 15, "What it emits, exactly"). Its `@apply` lines hold `text-code-foreground` and `text-code-link`. `013` renames `--code-foreground` to `--code-text`, so it changes `text-code-foreground` to `text-code-text` in that rule and in the install line (decision 15), in the same change. A check of `pluto-theme`'s `css` then finds `text-code-text` in the rule and no `text-code-foreground` anywhere. `--code-link` keeps its name. The selectors, ground and edge stay.
- **Tombaugh passes on these grounds (EXECUTED):** 70 of 70 rows. Its ten colours on white, `#F3F0E8` and `#E4E7F9` in light, and on `#2C2821`, `#221F19`, `#16140F` and `#393A3E` in dark. Lowest: light comment on `#E4E7F9`, 4.50; dark comment on `#393A3E`, 4.53. On the grounds alone the lowest are light comment 4.86 (on the canvas line) and dark comment 5.84 (on `#2C2821`).
- **If `013` adds the selection token** (decision 3), it uses those two values or measures new ones, and asks the owner about dark.
- **The workbench** is `013`'s to remove. This specification leaves it as it finds it (decision 10).

### 15. Inline code takes the code ground too (amendment, 2026-11-14)

**The owner:** "make sure in line code in light mode gets the same treatment" (`decisions.md`, "Inline code takes the code ground too"). **Inline code** is a `code` element in running text, not inside a `pre`. Today it takes only the mono face, from the base rule for `code, kbd, samp, pre`. It has no ground, edge or padding. It appears in the item pages, in `page-states-message` (the status and the reference), in the footers of `marketing-footer` and `app-shell-footer` (the commit), and soon on the design site.

**The rule.** Inline code is a small chip on the code ground, edged by the hairline, as a block is.

```css
@layer base {
  code:not(pre code, :is(h1, h2, h3, h4, h5, h6) code) {
    @apply rounded border border-border bg-code-background px-1 text-code-foreground box-decoration-clone;
  }
  a code:not(pre code, :is(h1, h2, h3, h4, h5, h6) code) {
    @apply text-code-link;
  }
}
```

**What it emits, exactly.** `pluto-theme`'s `css` (in `registry.json` and `static/r/pluto-theme.json`) and `src/app.css` hold the two rules in this source form: the two selectors above, character for character, each with one `@apply` line holding exactly those utility names. They hold no `var(--code-…)` of their own. Tailwind expands the utilities where an app compiles them. In this repository's build (READ, `build/_app/immutable/assets/*.css`, Tailwind 4.3.3), they compile to:

- `rounded` → `border-radius: .5rem` (the case radius, inlined);
- `border` → `border-style: var(--tw-border-style); border-width: 1px`; `border-border` → the `--border` colour;
- `bg-code-background` → `background-color: var(--code-background)`;
- `px-1` → `padding-inline: .25rem`;
- `text-code-foreground` → `color: var(--code-foreground)`; `text-code-link` → `color: var(--code-link)`;
- `box-decoration-clone` → `-webkit-box-decoration-break: clone; box-decoration-break: clone`.

So a check of the source reads utility names (`text-code-foreground`), and a check of the compiled page reads variables (`var(--code-foreground)`).

- **Ground and edge:** `--code-background` (white in light, `#2C2821` in dark) and the 1 px `border-border` hairline, so the chip reads on every surround by its ground or its line, as decision 4's block does.
- **Text:** `--code-foreground`, the code body colour. Inside a link: `--code-link`, so the code still reads as part of the link. The link's underline is drawn through it in the link's own colour. The two are code variables, substituted at `:root` and `.dark`, so a field's or glass's reset of `--foreground` or `--primary` never reaches them. Text on a chip is always a code colour on the code ground, and never the field's legend on white.
- **Padding and radius, from tokens:** `px-1`, one spacing atom (4 px) on each side, and **no vertical padding**. `rounded`, the one case radius (`--radius`, 8 px). _Why the case radius, not a smaller one:_ the owner's H1 sets one 8 px case radius, round only for dot shapes (`decisions.md`, 2026-11-06); its one scaled exception is the product icon. The `kbd` item already ships this shape at `text-xs` (`rounded border border-border px-1`), so a key and a code token match in form and differ in ground. _It still reads as a chip, not a capsule_ (EXECUTED, below): the radius stays under half the chip's height at every text size, so its sides stay straight. _Why no vertical padding:_ the chip already fills the line at `text-xs`; any vertical padding would make chips on adjacent lines overlap there.
- **In a line:** the chip adds no vertical padding, and an inline box's border and background never change the line box's height. The line height is unchanged. The font size is unchanged: it inherits, as today. `box-decoration-clone` (Tailwind's `-webkit-box-decoration-break: clone; box-decoration-break: clone`) gives each piece of a chip that wraps across lines its own edge, padding and corners. A long token, such as a commit hash in a narrow footer, wraps as text does today.
- **Measured in Chromium** (EXECUTED, 2026-11-14: headless Chromium from this repository's Playwright, the shipped JetBrains Mono, Geist and IBM Plex Sans files, the rule above). The chip is 1.31 em of mono plus its 2 px border. "Clearance" is the gap between two pieces of one chip that wraps; "radius share" is 8 px over half the chip's height.

  | Text | Chip height | Line box, with and without a chip | Clearance on a wrap | Radius share |
  |---|---|---|---|---|
  | `text-xs`, 12 / 1.5 | 18 px | 18 = 18 | 0.0 px (they meet, no overlap) | 0.89 |
  | `text-sm`, 13.5 / 1.6 | 20 px | 21.6 = 21.6 | 1.6 px | 0.80 |
  | `text-base`, 16 / 1.6 | 23 px | 25.6 = 25.6 | 2.6 px | 0.70 |
  | `text-2xl` heading, 28 / 1.2 | 39 px | 33.6 = 33.6 | **−5.4 px** (overlap) | 0.41 |
  | `type-section`, 36 / 1.05 | 50 px | 38.8 = 38.8 | **−11.2 px** | 0.32 |
  | `type-display`, 48 / 0.95 | 65 px | unchanged | **−19.4 px** | 0.25 |

- **Not in headings.** A chip inside `h1` to `h6` would stand taller than the line wherever heading leading is tight, so on any line after the first it would cover the descenders of the line above, and two pieces of a wrapped chip would overlap (the last three rows). The selector therefore leaves headings out: code in a heading keeps the mono face and the heading's own colour, size and weight, as today. In running text (`text-xs` to `text-base`, leading 1.5 to 1.6) chips never overlap.
- **The selector, `code:not(pre code, :is(h1, h2, h3, h4, h5, h6) code)`:** a `code` with no `pre` ancestor and no heading ancestor. Code in a code block is `pre > code` (`code-block-content`), and the pluto-theme page's sample is `pre > code`, so both are untouched. The editor renders no `code` element (CodeMirror's content is `div`s), and its fallback is a bare `pre`. _Why not `:not(pre) > code`:_ it would miss a `code` nested deeper inside a `pre`, such as `pre > span > code`.
- **`kbd` and `samp` are unchanged.** `kbd` is a key, drawn by its own item on the `muted` inset; that inset is what tells a key from code. `samp` keeps the mono face only: no item uses it, and a later need may give it a ground.
- **Where it lives:** `pluto-theme`'s base layer, emitted by `build-tokens.ts` into `@layer base` beside the existing mono rule, which is unchanged. In the base layer, any utility an item sets on its `code` wins, because the utilities layer comes after the base layer.
- **The preview's install line moves to the code ground.** `src/lib/preview/install-command.svelte` renders the install command on every item page as `<code class="block rounded bg-muted px-3 py-2 …">`. Under the base rule it would gain the hairline and stay on `wash`, the ground the owner asked to leave. It is a block of code, so it takes a block's ground: its classes become `block rounded border border-border bg-code-background px-3 py-2 text-sm break-all whitespace-pre-wrap text-code-foreground`. The border is written on it, so it does not depend on the inline rule. It is a preview file, not an item. Its text, which `viewer.spec.ts` reads, does not change.
- **An item that sets its own classes keeps them.** `page-states-message`'s reference is `<code class="font-mono text-foreground">`. It keeps `text-foreground`, which wins by layer: `foreground` on the chip reads 19.17 in light and 12.87 in dark. `font-mono` is redundant and harmless. No item file changes for this decision.
- **Where it sits, and what is under it.** The chip's ground is opaque, so its text always reads on the code ground:
  - in a link: `--code-link`;
  - in a heading: no chip; the mono face in the heading's colour, size and weight, as today (above);
  - on a card, popover, sheet or dialog: white on white in light, told by the hairline;
  - on a field or glass on an expressive page: the chip keeps the code ground and code colours over the field or the glass;
  - in chat prose: `chat-text` renders no inline code ("No other markdown is read"), so none appears today. An app that renders its own markdown in a turn gets the chip, on the page or in the user's `muted` bubble;
  - in an ink surface: `--code-background` is the surface there (`.surface-ink`), so the chip goes flush with it and is told by the dark hairline. Its text takes the dark code colours.

**Measured** (EXECUTED, 2026-11-14, the same tools as decision 4; the hairline composited over the chip's ground):

| Text on the chip | Light | Dark |
|---|---|---|
| `--code-foreground` (`foreground`) | 19.17 | 12.87 |
| `--code-link` (`primary`) | 7.02 | 6.90 |
| Tombaugh's text, `#25292F` / `#D9DFE8` | 14.61 | 10.93 |
| Tombaugh's link (its function blue), `#3350CB` / `#91AEFD` | 6.66 | 6.75 |
| In an ink surface, on graphite / on `#221F19` | — | text 16.16 / 14.42; link 8.67 / 7.74; Tombaugh text 13.73 / 12.26, link 8.48 / 7.57 |

So every text row is at 6.66 or more. Nothing is below AA.

| Surround | Light: ground ΔE · hairline ΔE | Dark: ground ΔE · hairline ΔE |
|---|---|---|
| The page | 4.61 · 3.03 | 8.71 · 16.62 |
| A card or popover | 0.00 · 7.28 | 3.83 · 11.74 |
| A user's chat turn (`muted`) | 7.90 · 1.53 | 0.00 · 7.91 |
| `field-1` · `field-2` · `field-3` · `field-4` | 56.35 · 50.13 · 28.36 · 48.34 (ground) | 50.54 · 51.47 · 50.67 · 48.26 (ground) |
| Glass over the canvas | 4.61 · 3.03 | 8.71 · 16.62 |
| Glass over `field-1` · `-2` · `-3` · `-4` | 11.60 · 11.66 · 8.35 · 11.04 (ground) | hairline 6.69 · 6.11 · 6.86 · 7.02 |
| The glass fallback | 1.62 · 5.78 | 3.83 · 11.74 |
| An ink surface, light page · dark page | — | 0.00 · 9.47 · 0.00 · 8.56 |

28 surrounds over the two themes: 28 of 28 read, by ground or hairline at 3.0 or more. The lowest is the light page (and glass over the canvas): 4.61, by ground.

## Design

### The token file

```jsonc
// themes.light, after "syntax-cyan"
"syntax-ground": "raised",
"syntax-active-line": "paper",
// themes.dark, after "syntax-cyan"
"syntax-ground": "ink-wash",
"syntax-active-line": "ink-raised",
// code
"background": "syntax-ground",   // was "muted"
"active-line": "syntax-active-line",     // was "card"
// contrast.text, appended
["muted-foreground", "syntax-ground"],
["muted-foreground", "syntax-active-line"],
["success", "syntax-active-line"],
["destructive", "syntax-active-line"],
// contrast.nonText, appended
["primary", "syntax-active-line"]
```

### The emission

`build-tokens.ts` needs no new logic for the roles: `colours()` emits every theme role, and the code loop writes `--code-background: var(--syntax-ground)` and `--code-active-line: var(--syntax-active-line)` into both theme blocks. `@theme inline` gains `--color-syntax-ground` and `--color-syntax-active-line`, as for every role. The new rules are `@utility scrollbar-code`, beside `@utility scrollbar`, and decision 15's two inline-code rules in `@layer base`, beside the mono rule.

### The items

```text
code-block.svelte (base)
  … rounded bg-code-background text-sm …
→ … rounded border border-border bg-code-background text-sm …

code-block-content.svelte
  scrollbar min-h-0 …  →  scrollbar-code min-h-0 …

code-editor.svelte (root)
  rounded bg-muted  →  rounded border border-border bg-code-background

code-editor-theme.ts (.cm-scroller)
  scrollbarColor: "var(--input) var(--muted)"
→ scrollbarColor: "var(--input) var(--code-background)"

code-editor-theme.ts (&.cm-focused)
  outlineOffset: "var(--focus-offset)"
→ outlineOffset: "calc(var(--focus-offset) + var(--line-width))"
```

`border border-border`, not a bare `border`: a bare `border` draws ink in this theme (`decisions.md`, after `012`'s checkpoint).

### What is measured where

| What | Where | Rows |
|---|---|---|
| The 19 code slots on the code grounds | `contrast.test.ts` | 95 |
| The chrome on the code grounds | the token file's `contrast` lists, through `contrastTable` | 10 new; 110 in all |
| Tombaugh on these grounds and the selection | a new group in `contrast.test.ts`, reading the research file | 70 |
| The two new colour functions | `contrast.test.ts` | 2 pins |
| Inline code: text on the chip, and its edge on each surround (decision 15) | a new group in `contrast.test.ts` | 16 text, 28 edge |
| The edge against each surround | a new group in `contrast.test.ts` | 10 |

## Scope

**In:**

- `package.json`: the version, 0.11.0 → 0.12.0, at the start of the build (decision 13). The regenerated `static/r/` and `static/v0.12.0/`.
- `tokens/pluto.tokens.json`: decision 1's roles and code map; decision 8's contrast pairs.
- `scripts/build-tokens.ts`: `@utility scrollbar-code`.
- `scripts/contrast.ts`: `deltaE` and `mix` (decision 8).
- `scripts/lint-literals.ts`: L19's pattern (decision 9).
- `code-block` (`code-block.svelte`, `code-block-content.svelte`, and `code-block-line.svelte`'s comment), `code-editor` (`code-editor.svelte`, `code-editor-theme.ts`).
- The item pages of `code-block`, `code-editor`, `highlighter` and `pluto-theme`; `/view/chat/thread/`'s `m3`; `registry.json`'s `code-block` description (decision 11).
- `CHANGELOG.md`: the one 0.12.0 entry, with this specification's lines (decision 12).
- Decision 15's two inline-code rules, emitted by `scripts/build-tokens.ts` into `pluto-theme`'s `@layer base`; the `pluto-theme` page's inline-code demonstration (criterion 17); and the preview's install line, `src/lib/preview/install-command.svelte` (decision 15).
- The tests in criterion 11's list.

**Out:**

- The dark code ground and active line; the page canvas; `muted`, `card` and every other role's value.
- The code colours. `013` changes them.
- A selection token, and styling `::selection` in code (decision 3).
- `stage-card`, `live-console`, the chat items, `message`, the `highlighter` item, `use-highlighted-code`, `code-languages` (decision 7).
- The ink surface's rules (decision 6).
- The workbench: no file of it changes (decision 10).
- The editor's boundary as a control, 3:1 under WCAG 1.4.11. It is not met today (1.10) and is not worsened.
- The theme with scripts turned off (`research/2026-11-14-the-theme-with-scripts-turned-off.md`).
- Firefox, Safari and screen readers, as in every release so far.
- The tag, made once after the change reviews of `013` and `015` (decision 13).

## Acceptance criteria

1. **Tokens.** `bun run build:tokens`, run twice, changes 0 files the second time. `tokens.test.ts`: each theme holds 55 names, the same 55 in both; 35 primitives, none new; `syntax-ground` names `raised` in light and `ink-wash` in dark; `syntax-active-line` names `paper` and `ink-raised`; the code map holds 21 slots in `007`'s order, with `background: syntax-ground` and `active-line: syntax-active-line`; `muted` and `card` resolve to `#E9E5DB`, `#FFFFFF`, `#2C2821` and `#221F19` as before. (unit)
2. **Emission.** `generated.test.ts`: `cssVars.light` holds `--syntax-ground: #FFFFFF` and `--syntax-active-line: #F3F0E8`; `cssVars.dark` holds `#2C2821` and `#221F19`; both blocks hold `--code-background: var(--syntax-ground)` and `--code-active-line: var(--syntax-active-line)`; `@theme inline` holds `--color-syntax-ground` and `--color-syntax-active-line`; `.surface-ink` holds its 4 declarations and `.dark .surface-ink` its 1, unchanged; `@utility scrollbar-code` is exactly `scrollbar-color: var(--input) var(--code-background)` and `scrollbar-width: thin`; `@utility scrollbar` is unchanged. (unit)
3. **Code colours on the code grounds.** `contrast.test.ts`: 95 of 95 rows (19 slots; light on `syntax-ground` and `syntax-active-line`; dark on those and `background`) at 4.5 or more. The tightest is dark `property` on `syntax-ground`, 4.81; the tightest light rows are `number` and `escape` on `syntax-active-line`, 4.97. `004`'s pinned rows, five per theme, on `syntax-ground`: light `foreground` 19.17, `comment` 7.38, `keyword` 7.02, `string` 5.88, `deleted` 6.00; dark 12.87, 5.43, 6.90, 6.87, 6.90. (unit)
4. **The chrome on the code grounds.** `contrastTable` over both themes: 110 rows, 108 pass, exactly the two recorded amber exceptions, 0 fail. The ten new rows: light `muted-foreground` on `syntax-ground` 7.38 and on `syntax-active-line` 6.48, `success` 5.16, `destructive` 5.27, `primary` (non-text) 6.16; dark 5.43, 6.08, 7.70, 7.74, 7.74. (unit)
5. **Tombaugh on these grounds.** A group reads the `tombaugh` candidate from `context/research/2026-11-14-meridian-and-tombaugh.json`. Its 10 text colours, in light on `syntax-ground`, `syntax-active-line` and `mix(syntax-ground, primary, 0.13)`, and in dark on `syntax-ground`, `syntax-active-line`, `background` and `mix(syntax-ground, primary, 0.13)`: 70 of 70 at 4.5 or more; the lowest is light comment on `#E4E7F9`, 4.50. Its `code-ground` and `code-active-line` swatches equal `syntax-ground` and `syntax-active-line` in both themes. `deltaE` and `mix` come from `scripts/contrast.ts`, where `deltaE("#FFFFFF", "#F3F0E8")` reads 4.61 and `mix("#FFFFFF", "#2D48D4", 0.13)` reads `#E4E7F9`. No test this specification adds or changes imports from `src/lib/workbench/`. (unit; review)
6. **The edge reads.** A group composites the hairline over the code ground and, for each of 10 surrounds, takes the larger of ΔE(ground, surround) and ΔE(hairline, surround). The surrounds: light `background`, `background` beside the active line (the line's colour as the ground term; the hairline is still composited over the code ground, which lies under the border), `card`, `muted` and the glass fallback; dark `background`, `card`, `muted`, and the ink surface's ground on a light page and on a dark page. 10 of 10 at 3.0 or more; the lowest is light `background` beside the active line, 3.03. (unit)
7. **The items' source.** `code-block`'s base classes hold `border`, `border-border` and `bg-code-background`; `code-block-content` holds `scrollbar-code` and not `scrollbar` as a class token; `code-editor`'s root holds `border`, `border-border` and `bg-code-background` and not `bg-muted`; `code-editor-theme.ts`'s scroller reads `var(--input) var(--code-background)` and `&.cm-focused`'s offset `calc(var(--focus-offset) + var(--line-width))`. No file under `src/lib/registry/` or `src/routes/(site)/items/` contains `class="bg-muted"`. The change reviewer confirms from the diff that this specification changes no file of the items decision 7 lists as unchanged, and none under `src/lib/workbench/` or `src/routes/(workbench)/`. (unit; review)
8. **In the browser.** `code.spec.ts`, in each of 2 themes:
   - on `/items/code-block/`, a block's root computes background `rgb(255, 255, 255)` in light and `rgb(44, 40, 33)` in dark, and a 1 px border on 4 of 4 sides in the computed `--border`; its 3 emphasised lines compute `rgb(243, 240, 232)` and `rgb(34, 31, 25)`; the pre's `scrollbar-color` ends in the code ground;
   - on `/items/code-editor/`, the editor's root and `.cm-editor` compute the code ground, `.cm-activeLine` the active line's colour, the scroller's `scrollbar-color` ends in the code ground, and the focused editor's `outline-offset` is the focus offset plus the line width (3 px), with no ancestor clipping the ring within 5 px of `.cm-editor`'s box;
   - on `/view/product-home/`, each `stage-card`'s block and `live-console`'s block, and on `/view/chat/thread/`, the block in `m3`'s bubble, compute the same ground and border;
   - on `/items/pluto-theme/`, the ink surface's S1 readings are unchanged, and its block has the border.
   (e2e)
9. **The version and the snapshots.** `package.json` reads 0.12.0 from the first commit of the build on. `registry.test.ts`'s "released snapshots": `static/v0.11.0/` matches its tag, byte for byte. The registry build writes `static/v0.12.0/`. No tag is made by this specification. (unit; `git tag` lists no `v0.12.0`)
10. **Lints and types.** The literal lint over every item: 0 violations, 1 allowance (L24). L19's pattern is decision 9's, exactly, and flags each of its 3 new bad samples. `bun run lint` exits 0. `bun run check` reports 0 errors. (unit; commands)
11. **The suites.** `bun run test:unit`, `bun run test:e2e` and `bun run test:smoke` pass. axe reports 0 violations on every page of its list in 2 of 2 themes. Expectations change only in these groups:
    - `tokens.test.ts`: 53 → 55 names, in the theme-name tests and in "the expressive group adds no primitive and no theme role", which also pins 53; the `syntax-*` test (5 colour pairs, now beside the 2 grounds); the code map's `background` and `active-line`;
    - `generated.test.ts`: the code variables' values; `scrollbar-code`; the v0.8.0 custom-properties guard (`011` criterion 2), which gains a `MOVED_014` list beside `MOVED_011` naming `--code-background` and `--code-active-line`, the two variables whose values move from v0.8.0. It is a constitution §6 guard: the list names each moved variable, so no other may move silently;
    - `contrast.test.ts`: the code-slot rows (114 → 95) and their pins; the `contrastTable` counts (100 → 110); `001`'s row tables, `LIGHT` and `DARK`, where the four appended text pairs push each theme's tint and non-text rows down four places, and "computes 50 pairs" becomes 55; the Tombaugh, edge and colour-function groups, new;
    - `literals.test.ts`: L19's pattern, samples and sample counts;
    - `registry.test.ts`: the newest entry (0.11.0 → 0.12.0, "unreleased") and the 0.12.0 entry's check (criterion 13);
    - `code.spec.ts`: C2's ground; C3's scrollbar and its 3 emphasised lines (`--card` → `--syntax-active-line`); E3's ground (`--muted` → the code ground), active line (`--card` → `--syntax-active-line`) and outline offset, and its `unclipped` check, which grows `.cm-editor`'s box by `--focus-offset` + `--focus-width` + `--line-width` (5 px; it grew by 4) so the whole ring is checked against clipping; S1's border; criterion 8's new readings;
    - `tests/e2e/pages.ts`: `VIEW_STOPS["/view/chat/thread/"]` gains `button:Copy code` and `pre:add(2, 3)` after `region:Messages`;
    - `keyboard.spec.ts`: "the 31 views hold 188 stops" → 190;
    - `code-add.test.ts`: `--code-background` reads `var(--syntax-ground)`; the inline-code rules (criterion 12);
    - `generated.test.ts`: `@layer base` gains the two inline-code rules (criterion 15);
    - `contrast.test.ts`: the inline-code group, new (criterion 16);
    - `code.spec.ts`: the inline-code test, new (criterion 17). No stop list changes: the demonstration's one link sits outside the page's keyboard fixtures.
    `workbench.test.ts` is expected not to change (decision 10); any change is named in the landing notes. (all suites)
12. **Smoke.** `code-add.test.ts`: an installed app's `:root` and `.dark` blocks each hold 21 `--code-*` variables, with `--code-background: var(--syntax-ground)` and `--code-active-line: var(--syntax-active-line)`; `.surface-ink` is unchanged; its built CSS holds `.scrollbar-code`; its installed `code-block.svelte` holds `border-border`; its built CSS holds a `code:not(pre code, :is(h1, h2, h3, h4, h5, h6) code)` rule with a `background-color` of `var(--code-background)`. (smoke)
13. **The documents.** `CHANGELOG.md` has exactly one `## 0.12.0` heading, reading "unreleased" until the tag. Under it, exactly one bullet each begins `` `pluto-theme`: ``, `` `code-block`: `` and `` `code-editor`: ``, and each is marked **interface change**. The entry names `--syntax-ground`, `--syntax-active-line`, `scrollbar-code` and inline code ("Inline code"), and does not contain "No variable is renamed or removed". `registry.test.ts` checks the 1 heading, the 3 bullets, the 3 marks and the 4 names. `registry.json`'s `code-block` description does not contain "muted inset". No item page and no item comment states `muted` or `card` as a code ground or `muted` as code's scroll track: the `highlighter` page's ground rows name `syntax-ground` and `syntax-active-line`; the `code-editor` page's intro and `code-block-line.svelte` do not contain "muted ground"; the `pluto-theme` page shows `scrollbar-code`. (unit)
14. **The checkpoint.** The design lead looks in the browser, in both themes, at 1440 and 390 px, before the builder goes on (checkpoint 1). The look is recorded in `decisions.md`. (checkpoint)
15. **Inline code: the emitted CSS.** `generated.test.ts`: `pluto-theme`'s `@layer base` holds `code:not(pre code, :is(h1, h2, h3, h4, h5, h6) code)` with exactly `@apply rounded border border-border bg-code-background px-1 text-code-foreground box-decoration-clone`, and `a code:not(pre code, :is(h1, h2, h3, h4, h5, h6) code)` with exactly `@apply text-code-link`; neither holds a `var(--code-…)` of its own; the mono rule on `code, kbd, samp, pre` is unchanged; no other base rule names `kbd`, `samp` or `pre`. `src/app.css` holds the two rules inside `@layer base`. No item file under `src/lib/registry/` changes for decision 15. `install-command.svelte`'s class list holds `border-border`, `bg-code-background` and `text-code-foreground`, and not `bg-muted`. (unit)
16. **Inline code: the figures.** A group in `contrast.test.ts`, from the token file, the research file and `scripts/contrast.ts`:
    - **text:** `code-foreground` and `code-link` on `code-background` in both themes (4 rows), and on the ink surface's grounds, graphite and `card`, in dark (4 rows); Tombaugh's `tombaugh-text` and `tombaugh-function` on the same grounds (8 rows). 16 of 16 at 4.5 or more; the lowest is Tombaugh's light link on white, 6.66;
    - **edge:** the hairline composited over the chip's ground, against decision 15's 28 surrounds; the larger of ground ΔE and hairline ΔE is 3.0 or more on 28 of 28; the lowest is the light page, 4.61.
    (unit)
17. **Inline code in the browser.** The `pluto-theme` page gains a demonstration, outside its keyboard fixtures: inline code in a paragraph, in a link to `#inline-code`, in an `h3`, in a `card`, and, inside the ink-surface fixture, in a paragraph. `code.spec.ts`, in each of 2 themes:
    - in the paragraph, the `code` computes background `rgb(255, 255, 255)` in light and `rgb(44, 40, 33)` in dark; a 1 px border on 4 of 4 sides in the computed `--border`; colour the computed `--code-foreground`; `padding-inline` 4 px and `padding-block` 0; `border-radius` the computed `--radius`; `box-decoration-break` `clone`. **Rendered line heights:** a one-line paragraph holding the chip has the same `getBoundingClientRect().height` as a twin paragraph, same classes, holding the same text in a `<span class="font-mono">` instead, within 0.5 px; the same holds in `text-xs`, `text-sm` and `text-base` twins;
    - in the link, colour the computed `--code-link`; in the card, the same ground and border as in the paragraph; in the `h3`, no chip: background `rgba(0, 0, 0, 0)`, border width 0, the mono family, and the `h3`'s own colour; in the ink surface, the background equals the surface's;
    - on one item page (`/items/button/`), the install line's `code` computes the code ground, a 1 px `--border` hairline and `--code-foreground`;
    - on the `code-block` page, a block's `pre code` computes background `rgba(0, 0, 0, 0)` and border width 0; on the `kbd` page, a `kbd` computes the computed `--muted`;
    - axe reports 0 violations on the `pluto-theme`, `code-block`, `kbd` and `page-states` pages, and on `/view/product-home/`, where the footer's commit is inline code when the build sets one.
    (e2e)

## Build order

1. **The version** to 0.12.0 in `package.json`, before any registry build or dev server run (decision 13).
2. **Tests first.** Write the checks of criteria 1 to 13 and 15 to 17. Run them red against the current tree, and record the failure counts.
3. **Tokens, emission and the arithmetic** (decisions 1, 5, 8, 9, and 15's rules). Run `build:tokens`.
4. **The items** (decision 7).
5. **Checkpoint 1.**
6. **The pages, the view and the documents** (decisions 11, 12).
7. Every suite, the lints and `check`.
8. The change review.
9. `013` is built on this landed change, at 0.12.0; `015` is built after this change too. The one tag, `v0.12.0`, follows the change reviews of `013` and `015` (decision 13).

## Build checkpoints

1. After step 4. The design lead looks at:
   - `/items/code-block/`: a block on the page, in a card, with emphasised lines, where an emphasised line meets the page by the hairline alone (ΔE 3.03);
   - `/items/code-editor/`: the editor, focused, its active line on the canvas colour, its ring 2 px outside its hairline;
   - `/items/pluto-theme/`: the ink surface, its block and editor with the hairline; decision 15's inline-code demonstration, including a chip that wraps at 390 px in `text-sm` prose, and the `h3`'s code without a chip;
   - one item page's install line (`/items/button/`), on the code ground;
   - the `page-states` page and `/view/product-home/`'s footer: inline code inside muted text and in the commit;
   - `/view/chat/thread/`, with decision 11's user turn that holds code;
   - `/view/product-home/`: `stage-card`'s nested lines on the blue field, `live-console`'s on the green panel; at 390 px, whether the hero's shell card now scrolls a line it did not before (the 2 px narrower code area).

   Each in both themes, at 1440 and 390 px. The question at each: does the block's edge read, and does the nested line in the two cards read as one block in one card? A change of course is recorded in `decisions.md`.

## Risks

- **The light active line is faint.** ΔE 4.6 from white, against 7.9 for today's white-on-`wash`. A block's emphasised line keeps its marker. The editor's caret line has none. Checkpoint 1 looks.
- **The tightest edge in the system:** on the light page, where an emphasised or active line runs to the border, the block meets the page by the hairline alone, ΔE 3.03, just over the floor of 3. Checkpoint 1 looks.
- **The code area is 2 px narrower** in a block that fills its container. A line that just fit may now scroll. The changelog says so; checkpoint 1 looks at the hero's cards at 390 px.
- **Nested hairlines** in `stage-card` and `live-console`. If they read as clutter, the item, not the block, takes the fix: a later change may drop the card's padding so the block's edge is the card's. That is not done here.
- **The selection stays the browser's** until a palette passes on a dark one. Selected code's contrast is the platform's and is not measured. It is unchanged from `v0.11.0`.
- **Every inline `code` in the preview and the identity pages becomes a chip,** including the identity specimens' (`voice-sample`, `imagery-product`) beside their scoped styles. 477 `code` elements sit outside the items (the review's count). Checkpoint 1 looks at a sample; the identity exhibit is a research record and is not restyled.
- **Display type outside a heading.** A `type-display` or `type-section` step set on a `p` or `div` with inline code in it would overlap as a heading would (decision 15's table). No item does this; the site that will use display type adds a heading or its own class.
- **Inline code stands out more in muted text.** In `page-states-message`'s status line and in the footers, the chip's code colour is darker than the muted text around it, on its own ground. This is the owner's ask; checkpoint 1 looks.
- **An app's own `code` elements change.** Every inline `code` in an installed app gains the chip on update. An app that styled its own `code` with utilities keeps them; one that styled it in unlayered CSS beats the base layer too. The changelog says so.
- **An app that kept `class="bg-muted"`** on a block keeps `wash` with the hairline. It passes with the shipped colours (lowest 4.50) and will fail with Tombaugh. The changelog says so.

## Review dispositions

From [`../reviews/014-the-white-light-mode-code-ground-spec-2026-11-14.md`](../reviews/014-the-white-light-mode-code-ground-spec-2026-11-14.md). Decisions on the release and on `013` follow the owner's "One release, 0.12.0" (`decisions.md`, 2026-11-14); no owner question was needed.

1. **Fixed (High).** The version moves to 0.12.0 at the start of this specification's build, before any registry build, so `static/v0.11.0/` is never rebuilt. The tag comes once, after `013`'s change review; `013` does not bump again (decision 13; Build order, step 1). Criterion 9 checks the version, the `v0.11.0` snapshot against its tag, and the `v0.12.0` output.
2. **Fixed.** The notice now says what `border-box` does: 2 px taller; the width held and the code area 2 px narrower where the block fills its container; 2 px wider where it sizes to its content; 2 px less code under a fixed height. The editor's bullet names its scroll track; `pluto-theme`'s names the track inside an ink surface (decision 12). Checkpoint 1 looks at the hero's cards at 390 px, and Risks names the narrower code area.
3. **Fixed.** Decision 14 now gives `013` fourteen text roles and 70 AA rows (28 light, 42 dark), ten `syntax-*` colours beside the two grounds, and 60 theme names. L19 has one pattern for both specifications, written out in decision 9, which `013` adopts as written. The version is bumped once, at the start of this build. Decision 8 says why light has no third ground; decision 14 asks `013` to say why if it keeps one.
4. **Fixed.** Decision 12 says how the parts merge: one heading, one bullet per item, marked **interface change** when either part changes the item, `013`'s sentences first. It gives this specification's sentences inside each shared bullet, with `013`'s marked in place. The `pluto-theme` sentence is scoped: "The code-ground change itself renames and removes nothing; every rename and removal in this bullet is the code map's." `013` adds to this entry rather than starting one (decision 14). Criterion 13 checks one heading, one bullet per item, the three marks, and that the old sentence is gone.
5. **Fixed.** The turn is placed: `m3` gains a fence holding `add(2, 3)`, so no turn or heading is added, and "Latest reply" still follows an assistant reply. `blocks.spec.ts` C2's four headings and its reply checks then hold unchanged. The two new stops and the total, 188 → 190, are given (decision 11). Criterion 11 now lists `pages.ts`, `keyboard.spec.ts`, `code.spec.ts` C3's emphasised lines and E3's ground and active line, and `registry.test.ts`'s newest entry. It drops `chat.spec.ts`, which holds no thread check.
6. **Fixed.** Decision 11 now covers the `highlighter` page's two ground rows, the `code-editor` page's intro, the `pluto-theme` page's sample `pre`, its scroll-box line, and a `scrollbar-code` demonstration. Decision 7 changes `code-block-line`'s comment, with its new words. Criterion 13 checks that no item page or comment states `muted` or `card` as a code ground.
7. **Superseded.** 0.12.0 drops the workbench (`decisions.md`, "A public design site, the workbench dropped, and properties under Meridian"). This specification no longer changes it (decision 10), so its migration, storage key and select are not this specification's. `workbench.test.ts` is expected to pass unchanged; the new tests take their arithmetic from `scripts/contrast.ts`, not the workbench (decision 8).
8. **Fixed.** Decision 4's table and criterion 6 gain the row: the light page beside an emphasised or active line, ground ΔE 0.0, hairline ΔE 3.03, the tightest edge. Criterion 6 counts 10 surrounds. Risks names it for checkpoint 1.
9. **Fixed.** The role is renamed `syntax-active-line`, which mirrors its slot and does not read as a hairline. Decision 1 gives the reason. Decision 9's samples and every criterion follow.
10. **Fixed.** `&.cm-focused`'s `outlineOffset` becomes `calc(var(--focus-offset) + var(--line-width))`, so the editor's ring sits 2 px outside its hairline, as the block's does (decision 7). Criterion 8 reads the 3 px offset; criterion 11 lists E3's offset.
11. **Fixed.** Criterion 7: "contains no `class="bg-muted"`". Criterion 8 names `/view/product-home/` for the two cards and `/view/chat/thread/` for the turn. The workbench criterion is gone (finding 7). Decision 8 and criterion 3 say "five per theme". Decision 4's table says "hairline ΔE".

**Second pass** (the review's Disposition, 2026-11-14: fit to build once six Low findings are fixed). Each is fixed:

1. **Fixed.** The tag follows the change reviews of `013` and `015`, since the owner put the design site in 0.12.0. `015` is built after this specification, because criteria 8 and 13 read the `/items/…` pages where they are today (decision 13; Scope; Build order, step 9). The version bump stays at step 1.
2. **Fixed.** Criterion 6's parenthetical now says the line's colour is the ground term and the hairline is still composited over the code ground, which lies under the border. That gives the stated 3.03; 7.01 was the hairline over the line, which the block never draws.
3. **Fixed.** Criterion 11 adds `contrast.test.ts`'s `001` row tables (four places down; 50 → 55 pairs), `generated.test.ts`'s v0.8.0 guard with a `MOVED_014` list naming the two moved variables, and `tokens.test.ts`'s expressive-group test pinned at 53.
4. **Fixed.** E3's `unclipped` check grows `.cm-editor`'s box by the focus offset, the focus width and the line width, 5 px, so it covers the whole ring again (criteria 8 and 11).
5. **Fixed.** Criterion 5 reads "No test this specification adds or changes imports from `src/lib/workbench/`", which holds at the end of this build, while `workbench.test.ts` still exists.
6. **Fixed.** Decision 8 names `scripts/contrast.ts` as the one home of `deltaE` and `mix` in 0.12.0. `013`, when it drops the workbench, removes the copies in `palette.ts` and imports the two from `scripts/contrast.ts`, writing no third copy.

Mismatches A to E are `013`'s to close. On C, the order within a shared bullet stays decision 12's: `013`'s sentences first, and the bullet carries its **interface change** mark once.

**Amendment check** (the review's "Amendment check: decision 15, inline code", 2026-11-14: fit to build, with four Low write-ins). A1 to A3 are fixed here; A4 is `013`'s.

- **A1. Fixed.** Criterion 17 now compares rendered heights: a one-line paragraph holding the chip against a twin holding the same text in a mono `span`, within 0.5 px, in `text-xs`, `text-sm` and `text-base`. Measured equal at every size in Chromium (decision 15's table, EXECUTED).
- **A2. Fixed.** Measured in Chromium with the shipped fonts: the chip is 1.31 em plus 2 px. In running text it never overlaps: clearance on a wrap 0.0 px at `text-xs` (the pieces meet), 1.6 px at `text-sm`, 2.6 px at `text-base`. In headings it would overlap (−5.4 px at `text-2xl`, −11.2 at `type-section`, −19.4 at `type-display`), so the selector leaves `h1` to `h6` out, and code there keeps the mono face only. Vertical padding is settled at 0. The radius stays the case radius under H1, with the `kbd` precedent; it is under half the chip's height at every size (0.89 of it at `text-xs`, 0.70 at `text-base`), so the chip keeps straight sides. Risks names display type outside a heading.
- **A3. Fixed.** The install line moves to the code ground: `bg-code-background`, `text-code-foreground` and an explicit `border border-border` in place of `bg-muted` and `text-foreground` (decision 15; Scope; criteria 15 and 17; checkpoint 1). Risks says every inline `code` in the preview and identity pages becomes a chip.
- **A4. For `013`.** 014 now states the exact form the rule emits: utility names in the `@apply` lines, no `var(--code-…)` of its own, and the compiled declarations (decision 15, "What it emits, exactly"). Decision 14 tells `013` what its check should read: `text-code-text` in the rule, and no `text-code-foreground` in `pluto-theme`'s `css`.

## Landing notes

- **Built** in the working tree over `ef53f01`, uncommitted. `package.json` moved to 0.12.0 before any registry build, so `static/v0.11.0/` was never rebuilt (it still matches its tag); the build wrote `static/v0.12.0/`. No tag is made.
- **Tests first, seen failing.**
  - Criteria 1 to 13, unit: 26 failures in 10 files. `contrast.test.ts` and `literals.test.ts` would not load at first (`deltaE`, `mix` and `SYNTAX_COLOUR` not exported); with the exports stubbed they gave 155 failures, and the Tombaugh and edge groups threw while being built (`themes.light.syntax-ground` undefined).
  - Criteria 1 to 13, e2e (`code.spec.ts` C2, C3, E3, S1 and the new G1 to G4; the thread's keyboard walk; both themes): 18 of 20 failed. "The 31 views hold 190 stops" passed red, because it only sums `pages.ts`, which the test change itself edits.
  - Decision 15, unit: 5 failures (criterion 15's four checks, criterion 13's "Inline code" name). Criterion 16's group passed on its first run, because it measures token values decision 1 had already set. The change reviewer later ran it against `v0.11.0`'s tokens, where 4 of its 5 tests fail.
  - Decision 15, e2e (`code.spec.ts` I1 to I5, both themes): 8 of 10 failed. I5 passed red, as it should: it checks that a block's `pre code` and `kbd` do not change.
  - The smoke checks (criterion 12) were written first but not run red: each run builds two scratch apps against a dev server.
- **The checkpoint** (checkpoint 1, after step 4) was the design lead's, at light and dark, 1440 and 390 px. It is recorded in `decisions.md`, "After the `014` build's checkpoint", with every deviation below accepted and one condition: the changelog states the chip's 10 px and its remedy, which it does. `m3`'s fenced block (decision 11) was built before the checkpoint, so the user turn holding code could be looked at.
- **Deviations.**
  - **Test groups criterion 11 did not name:** `blocks.spec.ts` 26 (the view stops at 360, 186 → 188) and C9 (the chat views' rings at 360, 85 → 87), both from decision 11's two new stops; `tokens.spec.ts`'s `bg-code-active-line` reading (`--card` → `--syntax-active-line`). `generated.test.ts`'s `cssVars.theme` holds no `--color-syntax-*` (the CLI writes them from the theme blocks), so criterion 2's `@theme inline` reading is of `src/app.css`.
  - `literals.test.ts` also gains two good samples, `bg-code-background` and `bg-code-active-line` (52 good, 77 bad).
  - A comment in `code-editor-theme.ts` says "indicator", not "ring": the literal lint reads a bare `ring` as a class token.
  - The page copy decision 11 implies but does not list: the `highlighter` page's accessibility list ("on all six code grounds" → "on every code ground"; "the opaque card step" → "the active line"); the `code-block` page's accessibility line on emphasised lines. The `code-block` page gains a block in a `card`; the `code-editor` page's read-only editor now sits in a `card`, so the page still holds four editors.
  - `code.spec.ts` I1 compares the chip's radius with `var(--radius)` resolved on a probe, since `--radius` is written in rem.
- **Found, pre-existing, not fixed: six item pages scroll sideways at 390 px** (and at 320), in both themes. Their document widths at 390, as built, are `code-block` 695 px, `code-editor` 622, `use-highlighted-code` 582, `code-languages` 622, `pluto-theme` 817 and `theme` 631. With 014's border and chip removed in the browser each is 2 px less (693, 620, 580, 620, 815, 629; the change review's figures, EXECUTED): 014's share is the border's 2 px. The builder found the first three; the change review found all six. The causes found are in files 014 leaves alone (`src/lib/preview/specimen.svelte`, the pages' `grid max-w-2xl gap-8`):
  - on `code-block` and `code-editor`, a `Specimen` figure is an item of `grid max-w-2xl gap-8` with `min-width: auto`, so the grid's implicit `auto` track grows to the figure's min-content, the longest line of code (671 and 598 px in a 342 px column);
  - on `pluto-theme`, the contrast `table.w-full` (min-content about 550 px) sits in a plain `div.mt-6` with no scroll wrapper.
  `015`, which rebuilds the item pages as the design site, takes all six.
- **Decision 15 widened one page at 320 px, fixed in a preview file.** On `/items/settings/` the code view's summary holds an unbreakable path in `<code class="text-sm">`. The chip's side padding and edge (10 px) took the summary's min-content from 291 to 301 px, and the page to 327 px, failing `blocks.spec.ts` 25 (reflow at 320). The path now carries `wrap-anywhere` (`src/lib/preview/block-page.svelte`), the smallest change that keeps the chip: 320 px again. An app with an unbreakable token in a tight column sees the same 10 px. At the checkpoint's condition (`decisions.md`, "After the `014` build's checkpoint"), the changelog's `pluto-theme` bullet says so and gives the remedy: `wrap-anywhere` on the `code`, or `break-all` on its container.
- **`workbench.test.ts`** passes unchanged (decision 10). No test this specification adds or changes imports from `src/lib/workbench/`.
- **Suites** (2026-11-14, the last runs): `bun run test:unit` 986 pass, 0 fail (12 files); `bun run check` 0 errors, 0 warnings; `bun run lint` clean; the literal lint 0 violations, 1 allowance (L24); `bun run build:tokens` twice, 0 changes the second time; `bun run test:e2e` 1984 passed, 4 skipped, 0 failed (axe and the keyboard walk in both themes); `bun run test:smoke` 113 pass, 0 fail.
- **The change review** is [`../reviews/014-the-white-light-mode-code-ground-pr-2026-11-14.md`](../reviews/014-the-white-light-mode-code-ground-pr-2026-11-14.md): lands, 6 Low findings, each fixed.
  1. The six overflowing pages are listed above.
  2. The changelog says a class on an app's own `code` wins for the properties it sets, and names what still applies.
  3. These notes cite the checkpoint's entry, the six pages, criterion 16 seen red, and this review.
  4. The `pluto-theme` page's ink-surface caption says the editor is edged by the hairline, as inline code is; the `h3` demonstration shows the selector as built.
  5. The block pages' code view (`block-page.svelte`) is on `bg-code-background`. It takes no border of its own, because the `details` around it already draws the hairline. Its text stays `text-foreground`, so `013`'s rename of `--code-foreground` has no new user here.
  6. The `code-editor` bullet says "No prop, slot or export changes."
  Re-run after the fixes: see the suites above.

