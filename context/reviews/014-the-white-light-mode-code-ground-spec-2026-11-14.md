# Review of 014 — The white light-mode code ground

Reviews [`specifications/014-the-white-light-mode-code-ground.md`](../specifications/014-the-white-light-mode-code-ground.md).

- **Date:** 2026-11-14
- **Status:** dispositioned; fit to build (second pass, 2026-11-14), with six write-ins and five mismatches for `013` to close. Amendment (decision 15, inline code) checked the same day: fit to build, with four write-ins (see "Amendment check")
- **Reviewer:** a reviewer; not the author
- **Reviewed:** the specification as drafted, 2026-11-14 (343 lines). Checked against the constitution; `decisions.md`, every 2026-11-14 entry; the ground memo (`research/2026-11-14-a-white-code-ground-in-light-mode.md`) and the card memo (`research/2026-11-14-code-on-a-white-card-once-the-code-ground-is-white.md`) in full; the `tombaugh` candidate in `research/2026-11-14-meridian-and-tombaugh.json`; `013` as drafted, for consistency only; and the working tree at `ef53f01` plus its uncommitted changes (the workbench).
- **Re-ran:** nothing in this repository was written except this file. Scratch work is in the session's scratch folder (`…/scratchpad/review-014/measure.ts`).
  - **Baseline** (EXECUTED): `bun test ./tests/unit` → 948 pass, 0 fail, 12 files. `bun scripts/lint-literals.ts` → 0 literals, 1 allowance (L24), exit 0.
  - **Decision 1 applied to a copy of the token file in memory**, with decision 8's five contrast pairs, through the repository's own `validateTokens`, `contrastTable`, `contrastRatio`, `compositeAlphaByte`, and the workbench's `deltaE` and `mix` (bun, EXECUTED):
    - `validateTokens` accepts it: 55 names in each theme, 35 primitives, 21 code slots in `007`'s order.
    - `contrastTable`: 110 rows, 108 pass, 2 exceptions (the amber chart rows), 0 fail. The ten new rows read exactly criterion 4's figures: light 7.38, 6.48, 5.16, 5.27, 6.16; dark 5.43, 6.08, 7.70, 7.74, 7.74.
    - Code slots on decision 8's grounds: 95 of 95 at 4.5 or more. Tightest dark `property` on `syntax-ground` 4.81; tightest light `number` on `syntax-line` 4.97 (tied with `escape`). The ten pinned rows read criterion 3's figures exactly.
    - Shipped light colours: lowest on white 5.66, on `#F3F0E8` 4.97, on `#E4E7F9` 4.61. Shipped dark colours on `#393A3E`: `property` 3.73, `number` 3.87 (decision 3's reason holds).
    - Selection: `mix(#FFFFFF, #2D48D4, 0.13)` = `#E4E7F9`; 12% = `#E6E9FA`; `mix(#2C2821, #93B0FF, 0.13)` = `#393A3E`. ΔE white–canvas 4.61, white–selection 7.32, canvas–selection 4.30. White–canvas ratio 1.13.
    - Tombaugh: 10 text swatches, 70 of 70 rows at 4.5 or more; both contrast functions agree on every row. Lowest light comment on `#E4E7F9` 4.50, number 4.52; dark comment on `#393A3E` 4.53. On the grounds alone: light comment 4.86 on the canvas line, dark comment 5.84 on `#2C2821`. On `wash`: comment 4.40, number 4.41 (fail). Its `code-ground`, `code-active-line` and selection swatches equal the shipped values in both themes.
    - Edges (ground ΔE · hairline ΔE, hairline composited over the ground): light page 4.61 · 3.03; card 0.00 · 7.28; `muted` 7.90 · 1.53; glass fallback 1.62 · 5.78. Dark page 8.71 · 16.62; card 3.83 · 11.74; `muted` 0.00 · 7.91; ink on a light page 0.00 · 9.47; ink on a dark page 0.00 · 8.56. 9 of 9 read; lowest 4.61. Every figure in decision 4's table matches.
    - Thumb (`input`): 4.02 on white, 3.12 on `#2C2821`. The editor's boundary after the change: the hairline on white against the page 1.08, against a card 1.23 (WCAG 1.4.11 not met, as today; not a regression).
  - **The code** (READ): `tokens/pluto.tokens.json`; `scripts/tokens.ts`, `contrast.ts`, `build-tokens.ts:117–121, 337–348, 434–450`, `lint-literals.ts:285–286, 668–671`, `build-registry.ts:33–61`; `src/app.css`; `code-block/*.svelte`, `code-editor/code-editor.svelte`, `code-editor-theme.ts`; `live-console.svelte`, `stage-card.svelte`, `chat-text.svelte`, `chat-turn.svelte`, `message-content.svelte`; `src/lib/workbench/{baseline.server,palette}.ts`; `src/routes/(workbench)/workbench/code/+page.{server.ts,svelte}`; the `code-block`, `code-editor`, `highlighter` and `pluto-theme` pages; `/view/chat/thread/`; `registry.json`; `CHANGELOG.md`; `tests/unit/{contrast,tokens,registry,workbench}.test.ts`; `tests/e2e/{code,blocks,chat,keyboard,on-brand,compositions}.spec.ts`, `tests/e2e/pages.ts`; `tests/smoke/code-add.test.ts`. `git tag` lists `v0.11.0`.

## The owner's rulings

- **The light code ground becomes white, and lands first:** honoured (decisions 1, 13).
- **Dark mode keeps its ground:** honoured. `syntax-ground` and `syntax-line` name dark's old values; criterion 1 pins `muted` and `card` unchanged.
- **The page canvas never changes:** honoured. No primitive or shared role moves.
- **One 0.12.0 release with `013`:** honoured in intent, but the deferred version bump breaks the build (finding 1).
- **Only the ground, its active line and the edge change colour:** one more thing moves. The scroll track inside code becomes the code ground (decision 5). In light that removes a `wash` stripe. Inside an ink surface, in both page themes, the track moves from dark `muted` to the surface. That is within the spirit of the ruling, since the track is part of the ground, but the changelog should say it (finding 3).

## Acceptance criteria against evidence

1. **Tokens: 55 names, 35 primitives, the two roles, the map, `muted` and `card` unchanged:** met on the copy. EXECUTED.
2. **Emission: the two variables per theme, `--code-*` naming them, `@theme inline`, the ink rules (4 and 1), `scrollbar-code`:** countable. The ink rules hold 4 and 1 declarations today. READ `build-tokens.ts:442–450`.
3. **95 code-slot rows; tightest 4.81 and 4.97; ten pins:** met on the copy, to the hundredth. EXECUTED.
4. **`contrastTable` 110 / 108 / 2 / 0 and the ten new rows:** met on the copy, to the hundredth. EXECUTED.
5. **Tombaugh 70 of 70, lowest 4.50; swatches equal the shipped values:** met. EXECUTED. Its dependence on a research file after `013` lands is unsaid (finding 10).
6. **The edge reads on 9 surrounds, lowest 4.6:** met (4.61). EXECUTED. The emphasised line meeting the surround is not among them (finding 8).
7. **The items' source:** countable. "in prose about code" is not a mechanical test (finding 11).
8. **In the browser:** countable for the code-block, code-editor and pluto-theme pages. It names no page for the `stage-card` and `live-console` readings (finding 11).
9. **The workbench:** countable for the baseline. The migration it tests is underspecified (finding 7).
10. **Lints and types:** countable. Today's baseline is 0 violations and 1 allowance. EXECUTED.
11. **The suites, and where expectations change:** **not met as written.** The released-snapshot test fails under decision 13 (finding 1). The list of changing tests leaves out groups that will change and names one that will not (finding 5).
12. **Smoke:** countable. READ `code-add.test.ts:372–395`.
13. **The documents:** countable. The entry's text misstates the size change (finding 2) and does not merge with `013`'s part (finding 4).
14. **The checkpoint:** countable.

## Findings table

| # | Severity | Finding | Where |
|---|---|---|---|
| 1 | High | With the bump deferred, regenerating the registry rewrites the released `static/v0.11.0/`; the snapshot test fails, and an app installing from `v0.11.0` gets 014's items | decision 13; Scope out; criterion 11 |
| 2 | Medium | "2 px wider and taller" is wrong under `border-box`: the width holds and the content box narrows | decision 12 |
| 3 | Medium | Decision 14 hands `013` wrong counts (9 colours, 13 roles, 65 rows, 78) and a lint pattern and version timing `013` does not share | decision 14 |
| 4 | Medium | The one 0.12.0 entry cannot hold both parts as written: two `pluto-theme` bullets, and "No variable is renamed or removed" beside `013`'s removals | decisions 12, 13; criterion 13 |
| 5 | Medium | Criterion 11's list of changed expectations misses `blocks.spec.ts` C2, `code.spec.ts` C3's line colour, `pages.ts` and the 188-stop total, and `registry.test.ts`'s newest-entry check; `chat.spec.ts` has no thread check | criterion 11; decision 11 |
| 6 | Low | Pages and comments that still say `muted` or `card` are not in scope: the highlighter table, the editor page's intro, two pluto-theme lines, `code-block-line`'s comment; `scrollbar-code` is not shown | decisions 7, 11 |
| 7 | Low | The workbench migration: the existing `GROUND_KEY` stops it running, and a palette on `code-ground` keeps workbench-only names | decision 10; criterion 9 |
| 8 | Low | The tightest edge is unrecorded: an emphasised line on the light page meets the page by the hairline alone, ΔE 3.03 | decision 4; criterion 6 |
| 9 | Low | `syntax-line` breaks the token file's convention that `-line` names a hairline | decision 1 |
| 10 | Low | The editor's ring sits 1 px off its new edge, the block's 2 px | decision 7 |
| 11 | Low | Smaller gaps in the criteria' wording | criteria 3, 7, 8, 9; decision 8 |

## Findings, most severe first

1. **The deferred version bump rewrites the released 0.11.0 snapshot** (`014-…:187`, `:284`, `:298`) — decision 13 keeps `package.json` at 0.11.0 until after `013`'s change review, while Scope regenerates `static/r/`.
   Failure: `build-registry.ts:38–60` writes `static/v<package version>/` on every build, and `bun run build` and the dev server both run it. Built at 0.11.0, it replaces the tracked `static/v0.11.0/` (76 files) with the white-ground items. `registry.test.ts:1573–1590` ("released snapshots", from the `008` change review) then fails `static/v0.11.0 matches its tag`. So criterion 11 cannot pass. If it were committed anyway, an app that adds from the `v0.11.0` URL silently gets the border, the white ground and `scrollbar-code`, against constitution §6. `decisions.md`, "After the `009` build's checkpoint", already settled this: "The version moves … at the start of the build … so the dev server's registry rebuild … never overwrites the frozen" snapshot. `013` step 1 also bumps "at the start of the build", so the two specifications disagree on when.
   Fix: decision 13 and Build order step 2 move `package.json` to 0.12.0 at the start of 014's build, before the first registry build. The 0.12.0 entry is dated "unreleased". The tag still comes once, after `013`'s change review. `013` then starts at 0.12.0 and drops its own bump. Criterion 11 adds: `static/v0.11.0/` matches its tag, and `static/v0.12.0/` is the versioned output.

2. **The interface notice misstates the size change** (`014-…:174`, `:175`, `:178`) — the notice says "the block is 2 px wider and taller". Tailwind's preflight sets `box-sizing: border-box`, and `code-block`'s root is `w-full`. The `code-editor` root is a block that fills its container.
   Failure: in a column, a card or a tab panel, the block's outer width does not change. Its content box narrows by 2 px. A line that fit exactly now scrolls, or wraps in a `wrap` block. Only the height grows by 2 px. A block in a shrink-to-fit parent (the `w-fit` user bubble, a flex item without a width) also grows 2 px wider. An app that gave the editor or block a fixed height (`h-64`) keeps that height and loses 2 px of code. The editor's bullet also omits its scroll track, and neither bullet says the track inside an ink surface changes in dark.
   Fix: replace the sentence in both bullets with: "The root draws a 1 px `border-border` on each side. At the same content it is 2 px taller. Where it fills its container its width is unchanged and its code area is 2 px narrower, so a line that just fit may now scroll. Where it sizes to its content it is also 2 px wider. A fixed height keeps its size and shows 2 px less code." Add to `code-editor`: "Its scroll track is the code ground." Add to `pluto-theme`: "Inside an ink surface the code scroll track is the surface, in both page themes." Checkpoint 1 looks at the hero's cards at 390 px for a new horizontal scroll.

3. **Decision 14 hands `013` wrong numbers, and the two specifications disagree on the lint and the bump** (`014-…:199`, `:200`) — `013`'s code map has 14 text roles: `text`, `comment`, `keyword`, `function`, `type`, `string`, `number`, `constant`, `meta`, `special`, `link`, `inserted`, `deleted`, `changed` (`013-…:265`). `013` has ten `syntax-*` colour roles: `syntax-orange` kept, nine added (`013-…:263`).
   Failure: "Its thirteen text roles make 65 rows, not 78" should read fourteen roles, 70 rows (14 × 5), not `013`'s current 84 (14 × 6). "Two `syntax-*` grounds beside its nine `syntax-*` colours" should read ten. `013`'s name count then goes 55 → 60 (55 − 4 + 9), not its 53 → 58. Two more points disagree. `013`'s L19 lists only its ten colours (`013-…:271`), while 014 says "L19's pattern keeps `ground` and `line`". `013` bumps the version at the start of its build, while 014 says after its change review (finding 1). A builder following `013` would drop L19's guard on the two grounds.
   Fix: correct the three figures in decision 14, and add the 60-name count. State the L19 pattern `013` must carry: `syntax-(violet|blue|navy|green|yellow|orange|plum|red|grey|ink|ground|line)`. Tell `013`'s author that light rows are on two grounds, not three. With light on two and dark on three, `013`'s AA rows are 70: 28 light and 42 dark. If `013` keeps the light page as a third ground, it says why, since this specification holds that light code never sits on it.

4. **The shared 0.12.0 entry cannot hold both parts as written** (`014-…:164`, `:173`; `013-…:457–470`) — 014's part has a `pluto-theme` bullet marked "changed" that says "No variable is renamed or removed". `013`'s part has its own `pluto-theme` bullet marked **interface change**, removing seven `--code-*` variables and four `syntax-*` roles. `013` also writes "CHANGELOG.md gains this entry above 0.11.0", as a new entry.
   Failure: one 0.12.0 entry would hold two `pluto-theme` bullets with opposite marks, and a sentence that is false for the release. An app reads the entry as a whole. Criterion 13 checks 014's 6 names and 2 marks, which would still pass.
   Fix: decision 12 says how the parts merge. One bullet per item. An item's bullet is marked **interface change** when either part changes its interface. 014's sentence is scoped: "This release's code-ground change renames and removes nothing; the code map's renames are below." `013` decision 17 adds its lines to the existing entry rather than creating one. Criterion 13 checks one `pluto-theme` bullet.

5. **Criterion 11's list of changing tests is wrong** (`014-…:298–307`, decision 11 at `:159`) — the list is a checkable claim ("Expectations change only in these groups").
   Failure:
   - `blocks.spec.ts` C2 expects the thread's headings to be exactly `you, assistant, you, assistant`. A new user turn adds a fifth. It is not listed.
   - `chat.spec.ts` holds no check of `/view/chat/thread/`; it is listed.
   - The stop list lives in `tests/e2e/pages.ts` (`VIEW_STOPS`). `keyboard.spec.ts:1173` asserts "the 31 views hold 188 stops". It becomes 190.
   - `code.spec.ts` C3 asserts the three emphasised lines compute `--card` (`:270–281`). E3 asserts the active line is `--card` and the editor's ground `--muted` (`:644–655`). Only "C3's scrollbar" and "E3's computed values" are listed.
   - `registry.test.ts:1371–1379` asserts 0.11.0 is the newest entry.
   - Decision 11 does not say where the turn goes or what code it holds. Both change the stop text (`pre:…`) and whether "Latest reply" still follows an assistant reply.
   Fix: list each group above. Decision 11 names the turn: for example, a fence added to `m3`'s text, so no heading is added. Or a new user turn before `m4`, giving five headings, with the code it holds written out. Give the new stop total.

6. **Pages and comments that still say `muted` or `card` are outside the scope** (decisions 7 and 11) — the change makes them wrong.
   Failure:
   - The `highlighter` page hard-codes `["background", "muted", …]` and `["active-line", "card", …]` (`items/highlighter/+page.svelte:16, 35`).
   - The `code-editor` page's intro says "on the muted ground the code block shares".
   - The `pluto-theme` page says the scroll box "inside a surface draws its bar from the dark `input` on the dark `muted`". Its code sample is a bare `pre` with `bg-code-background` and no hairline, so on the light page its emphasised line is the page's own colour. The page does not show `scrollbar-code`, a new theme utility.
   - `code-block-line.svelte:4–7` says "the opaque card step … which would vanish on the muted ground". Decision 7 calls that file unchanged.
   Fix: add these to decision 11 and Scope, with the words. Let decision 7 change `code-block-line`'s comment only. Extend criterion 13 to: no item page states `muted` or `card` as a code ground.

7. **The workbench migration is underspecified** (`014-…:150`) — `+page.svelte:251–270` gates `adoptGround` on `GROUND_KEY`, `"pluto-workbench-white-ground"`. Any browser that has opened the workbench has it set.
   Failure: keep the key, and a saved palette still on `muted` is never moved, against criterion 9. The likelier saved state is the white preview's `code-ground` and `code-active-line` swatches. It is "left alone", so its token patch then proposes two new roles and `background: code-ground` against a token file that ships `syntax-ground`. The workbench commission's "the shipped palette, on `wash`, stays one choice away" (`decisions.md`, "A code-palette workbench") is narrowed, and nothing says so.
   Fix: name a new storage key. Say that a palette on `code-ground` is also moved onto `syntax-ground` and `syntax-line` (same colours, shipped names), or that it is left alone on purpose. Add one line noting that the platinum entry goes because the shipped palette is no longer on `wash`.

8. **The tightest edge is not recorded** (decision 4's table; criterion 6) — an emphasised line spans the block's width up to its border. In light it is the canvas, `#F3F0E8`.
   Failure: on the light page, at an emphasised line, the block meets the page by the hairline alone. The hairline is composited over the white ground, `#E6E7E7`, against `#F3F0E8`: ΔE 3.03 (EXECUTED). It passes the floor of 3, but it is the lowest edge in the system. The editor's caret line has no marker to help.
   Fix: add a row to decision 4's table and to criterion 6: light page, the active line: ground 0.0 · hairline 3.0. Name it in Risks beside "the light active line is faint", for the checkpoint.

9. **`syntax-line` reads as a hairline** (decision 1) — in this token file `-line` names a hairline colour: the primitives `line`, `paper-line`, `line-input`, and the roles `groove-line` and `elevation-line`.
   Failure: this specification adds a hairline to every code block. A reader of `--syntax-line` beside `--border` will take it for the block's edge. Once 0.12.0 ships, renaming it is an interface change.
   Fix: name the role `syntax-active-line`, which mirrors the slot it fills, or say why `syntax-line` stands despite the convention. Decision 9's samples and criteria 1, 2 and 12 follow the name.

10. **The editor's ring sits 1 px from its new edge** (decision 7) — the block draws its ring on the root, so the ring sits `--focus-offset` (2 px) outside the hairline. The editor draws its ring on `.cm-editor`, inside the root, at the same 2 px offset.
    Failure: with the root's 1 px border between them, the editor's ring sits 1 px outside its hairline, and the block's sits 2 px outside. E3 still passes, since it reads `outline-offset` on `.cm-editor`.
    Fix: set `&.cm-focused`'s `outlineOffset` to `calc(var(--focus-offset) + var(--line-width))`, and add it to E3. Or accept the 1 px and say so in decision 7.

11. **Smaller gaps in the criteria' wording.**
    - Criterion 7: "in prose about code" is not a test. Today the literal `class="bg-muted"` appears only in the two places being withdrawn. Fix: "contains no `class="bg-muted"`".
    - Criterion 8 names no page for the `stage-card`, `live-console` and user-turn readings. Fix: `/view/product-home/` for the two cards, and `/view/chat/thread/` for the turn.
    - Criterion 9's "the page's palette select has exactly 1 entry" is labelled (unit) for a Svelte page. Fix: name how it is read, either the source or an e2e check.
    - Decision 8 says "`004`'s five pinned rows"; criterion 3 says ten. Fix: "five per theme".
    - Decision 4's table calls the hairline "line ΔE", beside the "active line". Fix: "hairline ΔE".

## Constitution checks

- §4.1 source, not a package: met. Nothing reaches back at run time. The workbench is a preview route.
- §4.2 driven by need: met. The owner's request from an installing site, and Tombaugh's AA on `wash`.
- §4.3 tokens are the one source: met. Every new value is a `var()` or a token utility (`border-border`, `bg-code-background`, `scrollbar-code`). L19 grows to guard the two roles in items.
- §4.4 accessible by default: met on the figures. 95 code rows, 110 table rows and 70 Tombaugh rows pass in both themes. The thumb is above 3:1. Keyboard stops change only on the thread view. The editor's boundary under 1.4.11 stays unmet and is out of scope, measured and not worsened.
- §4.5 and §4.6 pinned and named dependencies: met. No dependency is added.
- §6 never break an installed app silently: the `interface change` marks are right. The notice's size wording is wrong (finding 2), and the release plan rewrites a released snapshot (finding 1).
- §5 research, then spec: met. Every figure traces to the card memo and was re-measured here.

## Verdict

Does not land yet: findings 1 (the deferred bump rewrites the released `v0.11.0` snapshot), 2 (the size notice), 3 (wrong counts handed to `013`), 4 (the shared entry) and 5 (the list of changing tests) stand. Findings 6 to 11 are write-ins.

## Disposition

Second pass, 2026-11-14. I checked the specification as revised (407 lines, with its "Review dispositions") against these:
- `decisions.md`'s newest entry, "A public design site, the workbench dropped, and properties under Meridian";
- `013` as revised (826 lines), for consistency only;
- the working tree.

These checks were re-run (scratch: `…/scratchpad/review-014/`; a copy of the tree, with `node_modules` linked):
- **Decision 1 on the copy, renamed** (EXECUTED). `syntax-ground` and `syntax-active-line` were added to both themes, with the map's grounds and decision 8's five pairs. `bun run build:tokens` exits 0.
- **`tests/unit/workbench.test.ts` on the copy** (EXECUTED): 55 pass, 0 fail, unchanged. Decision 10's INFERRED claim holds.
- **`bun test tests/unit` on the copy** (EXECUTED): 65 fail, 1 error. The error and three failures come from the copy having no `static/` and no `.git` (`012` criterion 1, the snapshots). The rest are new finding 3's groups, or groups criterion 11 already lists.
- **The edge figures** (EXECUTED):
  - the hairline over white, against the light page, reads ΔE 3.03;
  - the hairline over the active line instead, against the page, reads 7.01;
  - the dark active line against the dark page reads 4.88;
  - in light, the active line against `muted` reads 3.31, and the hairline 1.53.
- **L19's new pattern over `src/lib/registry/`** (EXECUTED, grep): 0 matches, so 0 new violations.
- **`build-registry.ts:38–42`** (READ): the versioned output is `static/v<package version>/`. **`registry.test.ts:1573–1590`** (READ): every tagged snapshot must match its tag.

### The first-pass findings

1. **Closed.** The version moves to 0.12.0 at Build order step 1, before any registry build or dev-server run. `build-registry.ts` then writes `static/v0.12.0/`, and nothing writes `static/v0.11.0/`. If a stray build ran at 0.11.0, the released-snapshots test would fail it. Criterion 9 checks the version, the `v0.11.0` snapshot against its tag, the `v0.12.0` output and that no tag exists. `013` agrees (its decision 17 and step 1: no bump of its own).
   - Accepted as precedent, not a finding: until the tag, the preview's install commands name `v0.12.0` (`install-command.svelte`, `viewer.spec.ts:266`). That URL does not resolve yet. Builds since `009` have done the same.
2. **Closed.** Decision 12 now says what `border-box` does: the block is 2 px taller; where it fills its container the width holds and the code area is 2 px narrower; where it sizes to its content it is 2 px wider; under a fixed height it shows 2 px less code. The editor's bullet names its scroll track, and `pluto-theme`'s names the track inside an ink surface. Risks and checkpoint 1 look at the hero's cards at 390 px.
3. **Closed in 014.** Decision 14 now hands `013` 14 roles, 70 rows (28 + 42), ten colours, twelve `syntax-*` roles and 60 names. `013` carries the same figures (`013-…:249`, `:286`, `:298`). `013` does not carry decision 9's L19 pattern or the rename (mismatches A and B below).
4. **Closed in 014.** Decision 12 gives the merge rule:
   - one heading, one bullet per item;
   - a bullet is marked **interface change** when either part changes the item;
   - 014's sentence is scoped to its own change.

   Criterion 13 checks one heading, three bullets, three marks and that the old sentence is gone. `013` words the merge differently (mismatch C).
5. **Closed.** `m3` gains a fence holding `add(2, 3)`, so no turn is added.
   - `blocks.spec.ts` C2 still holds: four headings, the first reply has no block, and the second reply's block is found within its reply. The bubble it reads is the first, which is `m1`'s.
   - No e2e test looks up "Copy code" across the whole page, so two such buttons on the thread cause no strict-mode clash (READ, grep).
   - The two stops and the 190 total are given. The criterion 11 list is corrected, with the gaps in new finding 3.
6. **Closed.** Decision 11 now covers:
   - the `highlighter` table's two rows;
   - the `code-editor` intro;
   - the `pluto-theme` sample `pre`, its scroll-box line and a `scrollbar-code` demo.

   Decision 7 rewords `code-block-line`'s comment. Criterion 13 checks each of these.
7. **Closed, superseded by the owner's ruling.** The workbench is dropped in 0.12.0. 014 changes none of its files, and its test passes unchanged on the new tokens (EXECUTED above). `013` removes it (`013` decision 18).
8. **Closed.** Decision 4's table and criterion 6 gain the row "beside the active line", 3.03, the tightest edge. Risks and checkpoint 1 name it. The dark row's 4.9 · 16.6 measures 4.88 · 16.62. The criterion's wording has a slip (new finding 2).
9. **Closed in 014.** The role is `syntax-active-line` throughout: decisions 1, 8 and 9, the Design section and criteria 1, 2, 3, 5, 12 and 13. `013` still says `syntax-line` (mismatch A).
10. **Closed.** `&.cm-focused` takes `calc(var(--focus-offset) + var(--line-width))`. Its computed `outline-offset` is 3 px (criterion 8), and E3 reads it. The `unclipped` margin is a write-in (new finding 4).
11. **Closed.** Each of the five wording gaps is fixed as proposed.

### New findings from the second pass (all Low, each a write-in)

1. **The tag ignores `015`** (decision 13, last bullet; Build order step 9; Scope, Out). The owner put the public design site in 0.12.0 ("It ships in 0.12.0, with `013` and `014`"). 014 still says the tag comes "after `013`'s change review". `013` says the same at `:498` and `:678`, but "with `014` and `015`" at `:740` and `:777`.
   Fix: "The tag comes once, `v0.12.0`, after the change review of the last specification the release carries (`013` and `015`)." Also add a line saying `015`, which folds the item pages into the site, is built after 014, since criteria 8 and 13 read the `/items/…` pages where they are today.
2. **Criterion 6's parenthetical contradicts its own figure.** "`background` beside the active line (the line's colour as the ground)" reads as compositing the hairline over the line's colour. That gives #DBD9D3, ΔE 7.01 against the page, and a lowest of 3.03 is then never found. The 3.03 is right: the line stops inside the border, so the hairline lies over the code ground (EXECUTED).
   Fix: "(the line's colour as the ground term; the hairline is still composited over the code ground, which lies under the border)".
3. **Criterion 11 misses three changing groups** (EXECUTED on the copy):
   - `contrast.test.ts`'s `001` row tables (`LIGHT`, `DARK`). `contrastTable` orders text pairs, then tints, then non-text. So the four appended text pairs push the tint and non-text rows of each theme down four places, and "computes 50 pairs" becomes 55.
   - `generated.test.ts`'s v0.8.0 custom-properties guard (criterion 2 of `011`). `--code-background` and `--code-active-line` now differ from their v0.8.0 values, so the guard needs a `MOVED_014` list beside `MOVED_011`, as `013` adds `MOVED_013`. This is a constitution §6 guard, so name it.
   - `tokens.test.ts`'s "the expressive group adds no primitive and no theme role", which pins 53.

   Fix: add the three to the list.
4. **E3's clip check no longer covers the ring.** `unclipped` grows `.cm-editor`'s box by 4 px. The ring now reaches 5 px out from it: offset 3 plus width 2.
   Fix: grow it by the offset plus the width plus the line width for the editor, or check the root instead.
5. **Criterion 5's "No test imports from `src/lib/workbench/`" is false while `workbench.test.ts` exists,** and 014 leaves that test alone.
   Fix: "No test this specification adds or changes imports from `src/lib/workbench/`."
6. **The colour arithmetic is written twice.** 014 adds `deltaE` and `mix` to `scripts/contrast.ts`. `013` moves the workbench's `deltaE` and `mix` to `tests/helpers/colour.ts` (`013-…:526`). That leaves two copies of one formula.
   Fix: 014 stands. `013` imports these two from `scripts/contrast.ts` and moves only what 014 does not add (mismatch E).

### Mismatches with `013`, from 014's side (for `013`'s second pass)

- **A. The role name.** `013` still writes `syntax-line` at `:209`, `:243`, `:263`, `:288`, `:294` and `:296`. Built as written, its map's `active-line: syntax-line` names a role 014 never creates, and `validateTokens` refuses it. It must read `syntax-active-line`.
- **B. L19.** `013-…:294` gives `syntax-(violet|blue|navy|green|yellow|orange|plum|red|grey|ink|ground|line)`. 014 decision 9 gives one pattern "adopted as written", with the five 0.11.0 names and `active-line`. Under `013`'s, `syntax-active-line` is unguarded: `active` is not in its list.
- **C. The changelog's order within a bullet.** 014 decision 12 puts `013`'s sentences first in a shared bullet. `013` decision 17 says `pluto-theme`'s bullet "opens with `014`'s ground and line". `013`'s quoted lines also each open with "**interface change.**", which would repeat the bullet's mark once spliced. The two must pick one order and one mark.
- **D. The tag.** As new finding 1: `013`'s decision 17 and step 6 say after its own change review; its `:740` and `:777` include `015`.
- **E. The arithmetic.** As new finding 6.

Agreed with `013`:
- the version bump at the start of 014's build, and no bump by `013`;
- one entry with one bullet per item;
- 014 built and change-reviewed first;
- the counts (14, 70, 10, 12, 60);
- the workbench, which 014 leaves and `013` removes;
- the Tombaugh group reading the research file.

Verdict as it stands after the second pass (2026-11-14): fit to build. Every first-pass finding is closed. The six new findings are Low write-ins, to apply before the build starts. Mismatches A to E are `013`'s to close in its own revision; none of them changes what 014 builds.

## Amendment check: decision 15, inline code (2026-11-14)

- **Reviewed:** decision 15, the "Amendment, 2026-11-14" header note, and the lines it adds to decisions 12 and 14, Scope, criteria 11 to 17, the build order, checkpoint 1 and Risks. Checked against `decisions.md`, "Inline code takes the code ground too", and against `013` as revised (its decision 16, at `:511`; its criterion 16; its `code-items.test.ts` line at `:657`).
- **Re-ran** (scratch: `…/scratchpad/review-014/m3.ts`; no file of the tree was touched):
  - **Text on the chip** (EXECUTED; `scripts/contrast.ts`). Every figure in decision 15's table matches:
    - `foreground`: 19.17 light, 12.87 dark;
    - `primary`: 7.02, 6.90;
    - Tombaugh's text: 14.61, 10.93;
    - Tombaugh's link: 6.66, 6.75;
    - in an ink surface, on graphite and on `#221F19`: text 16.16 and 14.42, link 8.67 and 7.74, Tombaugh's text 13.73 and 12.26, Tombaugh's link 8.48 and 7.57.

    The lowest is 6.66.
  - **The edge** (EXECUTED). Each row I sampled matches:
    - light page: 4.61 · 3.03;
    - light fields, by ground: 56.35, 50.13, 28.36, 48.34;
    - dark fields, by ground: 50.54, 51.47, 50.67, 48.26;
    - light glass over `field-1`: 11.60;
    - dark glass over `field-1`: hairline 6.69 (its ground also reads, 3.60);
    - the dark glass fallback: 3.83.

    The table has 28 surrounds, 13 light and 15 dark; I counted them.
  - **Where `<code>` is used** (READ, grep):
    - In the items: `code-block-content` renders `pre > code`. The footer commit in `marketing-footer` and `app-shell-footer` is `dd > code`. `page-states-message` has the status code and the reference code. Nothing else.
    - CodeMirror renders `div`s and no `code`. The editor's fallback is a bare `pre`. `chat-text` renders no inline code. Its blocks are `code-block`.
    - Every `pre … code` in the preview, the identity specimens and the workbench pane sits inside a `pre`, at any depth.
    - 477 `<code>` elements sit outside the items: the item pages, `src/lib/preview/`, and the identity specimens.
  - **The cascade** (READ):
    - `src/app.css` imports `tailwindcss`, which declares `theme, base, components, utilities` in that order. The theme's `@layer base` joins that base layer, as `body { @apply bg-background text-foreground }` already does there. So a utility class on a `code` wins by layer, whatever its specificity.
    - Within the base layer, `code:not(pre code)` has specificity (0,0,3) and `a code:not(pre code)` has (0,0,4). The link rule wins.
    - `--code-foreground` and `--code-link` are declared on `:root` and `.dark`, so they resolve there. A field's or glass's reset of `--foreground` or `--primary` does not reach them.
  - **Tests that read `code`** (READ): `blocks.spec.ts` 21 and 22 (the visibility of a `code` and its mono ancestor), `viewer.spec.ts:260–270` (the install command's text), `generated.test.ts:284` and `registry-add.test.ts`'s check 5 (the `code, kbd, samp, pre` rule). None reads a background, a border or a padding, so none changes.

### The questions asked

1. **The selector:** sound. `code:not(pre code)` leaves out every `code` inside a `pre`, at any depth: the block, the pluto-theme sample, the identity specimens and the workbench pane. The editor has no `code` element. `chat-text` emits none. No item renders a `code` as a block outside a `pre`. One preview component does: see finding A3.
2. **The cascade:** true as stated.
   - `page-states-message`'s reference keeps `text-foreground` by layer, on the chip: 19.17 and 12.87.
   - `font-mono` there is redundant.
   - The status `code` takes the code body colour, against the muted line around it. Risks names it.
   - The page shows a chip, with the right text colour.
   - Once `013` lands, the reference stays the page's `foreground`, while other chips take Tombaugh's ink. That is a 2-unit difference in ink and changes no reading.
3. **The figures:** they match. Two parts of the design were checked as well:
   - Tailwind's `box-decoration-clone` emits the prefixed and unprefixed properties, and Chromium supports both. Each piece of a wrapped chip keeps its border, padding and corners.
   - Inside a link the underline is the `a`'s own text decoration, drawn through the chip in the link's colour, as decision 15 says.
4. **The new criteria:** criteria 15 to 17 are counted and checkable:
   - 15 has two exact `@apply` strings;
   - 16 has 16 text rows (8 for the shipped colours and 8 for Tombaugh, each 4 shipped-ground and 4 ink-surface rows) and 28 edge rows;
   - 17 names elements, pages and computed values.

   Criterion 17's line-height reading is the exception (A1). Criterion 11's list covers the new groups, and I found no other test that reads a `code`'s box.
5. **The hand-off to `013`:** clean in substance, but not in form (A4).

### Findings (all Low, each a write-in)

- **A1. Criterion 17's line-height check cannot fail.** It compares the paragraph's computed `line-height` with a paragraph that has no code. That is the paragraph's own property, set by its classes, and no child changes it. The claim it should test is that the chip does not make the line box taller.
  Fix: compare rendered heights. A one-line paragraph holding the chip has the same `getBoundingClientRect().height` as the same paragraph holding the same code without the chip, for example the code at `all: revert-layer`. Do the same for the `h3`.
- **A2. In tight leading, a chip that wraps may meet the line above.** An inline box's border and background cover its content area: about 1.3 em of JetBrains Mono, plus 2 px. The `h3`'s line height is 1.2 em, and the display steps run 0.9 to 1.05 em. So on a wrapped heading the chips of two lines touch or overlap; they never move the text. The line height is unchanged, as stated.
  - Also, `rounded` (8 px) on a chip about 18 to 20 px tall is close to a capsule, while 011's rule keeps round shapes for the dots. The `kbd` item has the same shape today, which is a precedent.
  - Fix: checkpoint 1's wrapped chip is set in the `h3`, at 390 px. Risks names both points for the design lead's look.
- **A3. "Nothing else changes" is not true of the preview.**
  - `src/lib/preview/install-command.svelte` renders `<code class="block rounded bg-muted px-3 py-2 …">`, the install line on every item page. Its utilities win for the ground, padding and colour, but none sets a border width. So it gains the base rule's 1 px hairline and stays a block of code on `wash`, the ground the owner asked to leave.
  - The identity specimens' inline `code` elements (`voice-sample`, `imagery-product`) also become chips beside their scoped styles.
  - Fix: decision 11 or 15 names `install-command`. Either it becomes a `pre` on the code ground with the hairline, or it is left, with the reason. Risks says that inline `code` in the preview and identity pages becomes a chip. Checkpoint 1 looks at one item page's install line.
- **A4. The hand-off to `013` names two different forms.** 014's rule is `@apply … text-code-foreground …` (criterion 15). 014 decision 14 tells `013` to change it to `text-code-text`. But `013`'s criterion 16 and `code-items.test.ts` (`013-…:511`, `:657`) check that the rule "reads `var(--code-text)`" and that `pluto-theme`'s `css` has "0 reads of `--code-foreground`".
  Failure: the emitted `css` holds the utility name, not the variable. So `013`'s "0 reads" check passes on the old rule, and its "reads `var(--code-text)`" check fails on the correct one.
  Fix, in `013`: check for `text-code-text` in the rule and for no `text-code-foreground` anywhere in `pluto-theme`'s `css`. Nothing in 014 changes.

### Verdict on the amendment

Fit to build. The selector, the cascade and the figures hold, and the three new criteria are counted. A1 to A3 are write-ins to apply before checkpoint 1. A4 is `013`'s to close in its own revision.
