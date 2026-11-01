# The chat primitives, the composer, and `field-sizing`

- **Status:** complete
- **Date:** 2026-11-01
- **Author:** the design lead
- **Question:** For the chat primitives of `005` and the chat pane of `006`: what are the stock `message-scroller`, `message`, `bubble` and `marker` made of, what does the scroller depend on, what in each must change to meet our rules; what must a composer of ours do; does `field-sizing: content` work in the three engines; how is a streamed reply announced; and how does a message render fenced code from a streaming string?
- **What it blocks:** specification `005` (the chat primitives), released as `v0.5.0`, and `006` (the chat pane), released as `v0.6.0`. It settles the question `002` decision 13 left on `field-sizing`.

## How to read this memo

Every claim carries a label.

- **EXECUTED**: we ran it and saw the result, on 2026-11-01, macOS (Darwin 25.5.0, arm64), Bun 1.3.14. Browser checks ran in Playwright 1.64.1's Chromium 156.0.8078.4 (build 1248), WebKit 27.2 (build 2370) and Firefox 157.0 (build 1555); the repository was not touched.
- **READ**: a source says so. Each source was read on 2026-11-01. Paths in the prior-art clone are relative to `context/prior_art/shadcn-svelte/`, at commit `6149e14` (MIT). `ui/<item>/` means `docs/src/lib/registry/ui/<item>/`. `primitive/` means `packages/primitives/src/lib/message-scroller/`. Paths in this repository are relative to its root.
- **INFERRED**: our reasoning.

Scratch work was done in a throwaway folder outside this repository, not kept: `app/` (a copy of `tests/smoke/fixtures/kit3` with the four stock items added), `live/` (the live registry JSON), `lint-stock.ts` and `lint-stock.txt` (the lint run), `static/` (two probe pages), `probes/` (the three Playwright scripts), `*.out` (their output), `shots/` (screenshots), `view/` (`bun pm view`, and `marked`, `micromark`, `svelte-exmarkdown` installed for measuring), `bcd/` (MDN's compat data), `downloads/` (ARIA 1.2). Nothing was written to this repository except this memo.

Terms of art.

- **Stock item.** An item from shadcn-svelte's own registry as `add` serves it, built in the maia style (the primitives memo §3.1). This memo lints the files `add` wrote into the scratch app.
- **The lint.** `scripts/lint-literals.ts`, with `001` decision 25's rules, `002` decision 21's L1 to L18 and `004` decision 15's two.
- **The ladder.** `001` decision 10's sizes: 4, 8, 12, 16, 24, 32, 48, 64 and 96 px, so the Tailwind steps 1, 2, 3, 4, 6, 8, 12, 16 and 24.
- **The checklist.** `002` decision 9's R1 to R22.
- **Live region.** An element whose changes assistive technology announces without the reader moving to it (ARIA 1.2).
- **Log.** The ARIA role for a live region "where new information is added in meaningful order and old information may disappear" (ARIA 1.2 §5.4, `log`).
- **Turn.** One message in a conversation: a user turn or an assistant turn.
- **Follow-bottom.** A scroll container that keeps its end in view as content arrives, until the reader scrolls away.
- **Composer.** The form a person types a message into: a textarea, a send control, and what sits around them.
- **IME.** An input method editor: the system software that composes CJK and other text from keystrokes. While it composes, Enter confirms a candidate, not the message.
- **`field-sizing`.** The CSS property whose value `content` lets a form control "adjust its size to fit its contents" (MDN).

## In short

- **`field-sizing: content` works in all three engines** (EXECUTED, §4). A textarea with `min-height: 64px` measured 64, 94.8 and 222.8 px at 1, 3 and 8 lines in Chromium 156, WebKit 27.2 and Firefox 157; with `max-height` it stopped at 169.6 px and scrolled inside. MDN's compat data (8.1.7) puts first support at Chrome 123, Firefox 152 and Safari 26.2; caniuse reads 87.2% of global use. The composer can rely on it, with a fixed minimum and an inner scroll as the fallback for Safari before 26.2 and Firefox before 152.
- **The four stock items fail the lint 42 times in 10 of their 23 files** (EXECUTED, §1.6 and §2.5): `bubble` 31 (relative `oklch` tints, `color-mix`, six translucent fills, a `ring-3`, `rounded-full`, off-ladder padding), `message-scroller` 5 (literal durations, `scale-95`, an arbitrary `contain-intrinsic-size`), `message` 4 (`px-3.5`, `gap-2.5`, `rounded-full` on the avatar), `marker` 2 (`h-px` separator lines). Beyond the lint: a gradient fade, two cubic-bezier easings, a hidden-on-autoscroll scrollbar, 24 px bubble corners, a primary-filled user bubble, and a `shimmer` loop the docs recommend.
- **The stock `message-scroller` does not inline its primitive.** Its live JSON names `devDependencies: ["@shadcn-svelte/primitives@^0.0.1"]` and `registryDependencies: ["button"]`, and every one of its six components imports the package (EXECUTED, §1.1). The package is 28 days old, has two releases (0.0.0, 0.0.1), 212 KB unpacked, four dependencies, and its scroller is 1,528 source lines plus 1,577 lines of tests. Installing the item added 11 packages to the scratch app, among them `@lucide/svelte` at 35 MB (§1.1).
- **What the scroller does** (EXECUTED, §1.4): viewport `role="region" aria-label="Messages" tabindex="0"`; content `role="log" aria-relevant="additions"`, which Chromium's tree computes as `live: polite, atomic: false, relevant: additions` with **no accessible name on the log** (the name is on the region); a "Scroll to end" button that is `inert` and `tabindex="-1"` at the bottom. With `autoScroll` (default **off**) it followed an appended turn and a streamed reply, released on a wheel up, did not snap back while new content streamed, and returned on End or the button. Without `autoScroll`, nothing followed. Zero page errors in both runs.
- **A composer of ours needs eleven behaviours** (§3.7), none of which a stock item gives: a labelled textarea that grows between a minimum and a maximum, a visible 48 px send button, the same control becoming Stop while a reply runs, Enter sends and Shift+Enter breaks a line, **no send while `isComposing` or `keyCode === 229`** (EXECUTED: the clone's naive handler sent in all three engines; the guard did not, §3.4), Escape stops, focus stays in the composer, a visible "Enter to send" hint wired by `aria-describedby`, a send button that is never disabled (busy, not disabled, as `002` decision 12 and Atlassian and Primer say), a polite status for state changes, and the AI SDK's four states.
- **`aria-relevant="additions"` announces an element added, not text added** (READ, ARIA 1.2 §6.7). A reply node inserted empty and filled token by token is announced once, empty, and never again. So the stream announcer is `003`'s `status` item as it is: "Responding", "Stopped", "Response complete" (§5). A "jump to latest reply" control is a button that moves focus to the last reply's heading, which carries `tabindex="-1"` (§5.4).
- **A message renders streamed code through `code-block` at `sm` and the hook as they stand** (§6). The clone's demo renders assistant text through `svelte-streamdown` and maps fenced code to `CodeBlock` with `useHighlightedCode`; `marked`'s lexer yields a `code` token for an unterminated fence (EXECUTED), which is what the hook needs. `marked` 18.1.2 is MIT, 0 dependencies, 14.4 KB gzipped bundled; `svelte-streamdown` 5.0.0 brings `katex` and a second highlighter. The recommendation is a fence splitter in `006` and `marked` if an app wants markdown.

## 1. `message-scroller`

### 1.1 What the item is made of, and what it depends on

READ, the clone. Seven files: `index.ts`, `message-scroller.svelte` (Root), `-provider`, `-viewport`, `-content`, `-item`, `-button`. Each component is a thin wrapper: it imports `MessageScroller as MessageScrollerPrimitive` from `@shadcn-svelte/primitives/message-scroller` (line 2 of each `.svelte` file), renders the primitive's part with a `data-slot` and classes, and passes the rest through. `index.ts` lines 8 to 12 re-export three hooks straight from the package: `useMessageScroller`, `useMessageScrollerScrollable`, `useMessageScrollerVisibility`. So the item's public API includes the package's.

EXECUTED, the live JSON (`https://shadcn-svelte.com/registry/styles/maia/message-scroller.json`, 6,886 bytes, fetched 2026-11-01): `dependencies: null`, `devDependencies: ["@shadcn-svelte/primitives@^0.0.1"]`, `registryDependencies: ["button"]`, seven files with targets `message-scroller/<file>`. The primitive is **not inlined**. The other three live files: `message` (4,892 bytes, no dependencies), `bubble` (7,490, `tailwind-variants@^3.3.0`), `marker` (3,704, `tailwind-variants@^3.3.0`).

EXECUTED, the install. `REGISTRY_URL=https://shadcn-svelte.com/registry bun --bun …/shadcn-svelte add message-scroller message bubble marker -y -o` in a copy of `tests/smoke/fixtures/kit3` wrote `src/lib/components/ui/{message-scroller,button,message,bubble,marker}` and exited 0 (the CLI 1.7.1 warned "unsupported runtime", as `001` recorded). `bun.lock` grew from 119 to 130 package entries. The 11 added: `@lucide/svelte` 1.66.0 (35 MB on disk), `@shadcn-svelte/primitives` 0.0.1 (468 KB), `@tanstack/virtual-core`, `runed` 0.37.1, `svelte-toolbelt` 0.10.6 (and its nested `runed`), `tailwind-variants` 3.3.1, `dequal`, `inline-style-parser`, `lz-string`, `style-to-object`. The package's `dist/message-scroller/` is 55,274 bytes of JavaScript, 44,352 in `message-scroller.svelte.js`. `add` did not write `src/lib/utils.ts` (that is `init`'s job); the scratch app got a two-line `cn` from `clsx` for the build.

EXECUTED, `bun pm view`: `@shadcn-svelte/primitives` 0.0.1, MIT, created 2026-10-03, last modified 2026-10-05, versions `0.0.0` and `0.0.1`, 212,360 bytes unpacked, dependencies `@tanstack/virtual-core`, `esm-env`, `runed`, `svelte-toolbelt`; peer `svelte ^5.33.0` (READ, `packages/primitives/package.json` line 62).

READ, the primitive's size: `message-scroller.svelte.ts` 1,528 lines, `geometry.ts` 363, `types.ts` 266; tests `message-scroller.test.ts` 1,577 lines, `message-scroller.browser.test.ts` 546, `geometry.test.ts` 441 (`wc -l`, EXECUTED).

### 1.2 The viewport, the content, the item, the button (READ)

- **Viewport** (`primitive/message-scroller.svelte.ts` lines 1261 to 1268): `role: "region"`, `aria-label: "Messages"`, `tabindex: 0`, each overridable by a prop; `onkeydown`, `onscroll`, `ontouchmove`, `onwheel` handlers; `data-pending-scroll` while the opening scroll is pending (set on the server so the first frame can be hidden; test lines 277 to 322).
- **Content** (lines 1359 to 1360): `role: "log"`, `aria-relevant: "additions"`, both overridable. No `aria-live` is written; the role implies `polite`. No `aria-label`. A hidden `aria-hidden` spacer `div` is appended inside the content (component `message-scroller-content.svelte` lines 35 to 41; `ensureSpacer` lines 1342 to 1356) for turn anchoring. A `MutationObserver` on `childList` (lines 1327 to 1333) and a `ResizeObserver` (line 1338 to 1341) watch the content.
- **Item** (`types.ts` lines 168 to 177): `messageId` and `scrollAnchor`. The styled item adds `[contain-intrinsic-size:auto_10rem] [content-visibility:auto]` (`ui/message-scroller/message-scroller-item.svelte` line 18).
- **Button** (lines 1475 to 1478): `inert: true` and `tabindex: -1` when there is nothing to scroll toward, `data-active="true"|"false"`; `blur()` after a click (line 1459); default `behavior: "smooth"` (component line 10). The styled button's name is a visually hidden "Scroll to end" or "Scroll to start" (`ui/…-button.svelte` lines 51 to 53), icon `ArrowDownIcon`, `variant="secondary" size="icon-sm"` (lines 15 to 16), positioned `absolute inset-s-1/2 -translate-x-1/2 … bottom-4` (line 31).
- **`aria-busy`** is not set by the primitive. It passes through as an attribute (test lines 244 to 255 override `role`, `aria-busy` and `aria-relevant`); the demo passes `aria-busy={busy}` (`examples/chat-demo.svelte` line 262).

### 1.3 Follow-bottom: how it decides (READ)

- **Four modes** (`types.ts` lines 50 to 58): `following-bottom`, `free-scrolling`, `anchored-to-message`, `settling-jump`.
- **`autoScroll` defaults to `false`** (`types.ts` lines 114 to 119; provider component line 13). The docs say why: "Move only when the reader asked to move… Auto-scroll should never be the default" (`docs/content/components/message-scroller.md` line 43).
- **Arming and release** (`reconcileFollowMode`, lines 663 to 689): with `autoScroll` on and the viewport within `scrollEdgeThreshold` (8 px, `types.ts` line 12) of the end, the mode becomes `following-bottom`. It becomes `free-scrolling` when the viewport can still scroll to the end, `scrollTop` fell by more than 0.5 px since the last commit (`SCROLL_POSITION_EPSILON`, line 27), and no programmatic scroll is running. The comment: "Content growing past the live edge also reads as 'not at the end', but only a scrollbar drag moves scrollTop up. Growth must not release follow-output."
- **Intent** (`userScrollIntent`, lines 1096 to 1107): a `wheel`, a `touchmove`, or one of ArrowDown, ArrowUp, End, Home, PageDown, PageUp, Space on the viewport (`USER_SCROLL_KEYS`, `types.ts` lines 36 to 44; handlers lines 1238 to 1256) sets `free-scrolling` at once.
- **Resize** (`observeResize`, lines 56 to 75): a `ResizeObserver` on the content and on the viewport, coalesced into one `requestAnimationFrame`, because "resizing an observed element during delivery fires 'ResizeObserver loop completed with undelivered notifications'". While following, every resize calls `scrollToEnd({ behavior: "auto" })` (lines 967 to 981).
- **The button's state** is suppressed while following, "so publishing it as scrollable toward the end would strobe the scroll button once per chunk" (lines 700 to 708).
- **Reduced motion** is not read anywhere in the file (EXECUTED: `grep prefers-reduced` finds nothing). The button's click scrolls `smooth` regardless.

### 1.4 What it did in Chromium (EXECUTED)

`probes/scroller.ts` loaded the scratch app's build (`vite build`, exit 0; `vite preview`), a 800 × 600 viewport, 12 turns, the four stock items composed as the demo composes them, `aria-busy` bound to a streaming flag, a `Marker` as the last row. Two runs: `autoScroll` off (the stock default and the demo's setting) and on. Page errors and console errors: **0 in both runs**.

| Step | `autoScroll` off: scrollTop, at bottom, button | `autoScroll` on: scrollTop, at bottom, button |
|---|---|---|
| Initial (opens at the end) | 1378, yes, inert | 1378, yes, inert |
| Append a user turn at the bottom | 1378, **no**, active | 1526, yes, inert |
| Mid-stream (60 words at 20 ms), `aria-busy="true"` | 1378, no, active | 1631, yes, inert |
| After the stream | 1378, no, active | 1700, yes, inert |
| Wheel up 400 px from the bottom | 1300, no, active | 1300, no, active |
| Append and stream while scrolled up | 1300, no, active (no snap) | 1300, no, active (no snap) |
| Focus the viewport, press End | 1976, yes, inert | 1976, yes, inert |
| Wheel up, click the button | 1976, yes, inert | 1976, yes, inert |

- The viewport took focus by script and reported `activeElement` as `message-scroller-viewport`; End scrolled it. The focusable elements on the page were the viewport (`tabindex="0"`), the button (`tabindex="-1"`, `inert`) and the two probe buttons.
- The button measured 32 × 32 px at the bottom centre, named "Scroll to end"; while inactive its computed `opacity` was 0, `pointer-events: none`, and it was scaled to 30.4 px (`scale-95`).
- **Chromium's accessibility tree** (CDP `Accessibility.getFullAXTree`): `region "Messages"` with `focusable: true`; `log ""` with `live: polite`, `atomic: false`, `relevant: additions`. **The log has an empty name.** MDN: "The `log` is required to have an accessible name" (§5.1).
- **Computed styles:** the viewport's `mask-image` was `none` in both runs, `scrollbar-width: thin`, `scrollbar-gutter: stable`, `overscroll-behavior: contain`, `contain: content`. The bubble content's radius was 24 px (`rounded-3xl`), its padding `10px 14px`, its parent's `max-width: 80%`. The `message-avatar` div, holding a bare letter, measured 32 × 20 px with a full radius.

### 1.5 The gradient fade, and where it comes from

- READ: the viewport carries `scroll-fade-b` (`ui/message-scroller/message-scroller-viewport.svelte` line 16). The utility lives in the CLI package's stylesheet, `packages/cli/src/tailwind.css`: `@utility scroll-fade-b` (lines 323 to 328) sets a mask from `linear-gradient(to bottom, transparent 0, #000 …, #000 calc(100% - …), transparent 100%)` (the shared block, lines 173 to 180), driven by scroll-timeline animations where supported (lines 187 to 200). An app receives it through `@import "shadcn-svelte/tailwind.css"`, which `init` writes (`packages/cli/src/utils/css.ts` line 12; the CLI changelog lines 19 and 89; `docs/src/app.css` line 3).
- EXECUTED: the scratch app was never `init`ed, so its `src/app.css` holds only `@import "tailwindcss"`. The built CSS has **0** `mask-image` rules, and the viewport's computed `mask-image` is `none`. `add` alone does not deliver the fade; the class is dead in an app that did not `init` from shadcn.
- INFERRED: the fade is a decorative gradient, which the design book §05 bans (patterns memo §5.3). Our registry does not ship shadcn's stylesheet, so the class would be dead here too. A groove at the composer's top edge is the replacement the patterns memo proposed. The same stylesheet's `scrollbar-thin` and `scrollbar-gutter-stable` resolved without it (Tailwind 4.3.3's own utilities, EXECUTED: the computed values above), so those two classes are not shadcn's.

### 1.6 What the checklist rejects (EXECUTED lint; the rest READ)

The lint ran over the files `add` wrote (`lint-stock.ts`, rules loaded from this repository): **5 findings in 2 of 7 files.**

| File | Line | Rule | Class |
|---|---|---|---|
| `message-scroller-button.svelte` | 31 | literal duration | `duration-200` |
| | 31 | literal duration | `data-[active=false]:duration-400` |
| | 31 | scale | `data-[active=false]:scale-95` |
| | 31 | scale | `data-[active=true]:scale-100` |
| `message-scroller-item.svelte` | 18 | arbitrary property | `[contain-intrinsic-size:auto_10rem]` |

Beyond the lint, by the checklist:

- `ease-[cubic-bezier(0.7,0,0.84,0)]` and `ease-[cubic-bezier(0.23,1,0.32,1)]` on the button (R14: motion only through tokens; the lint sees no length in them).
- `scroll-fade-b` (§1.5; the design book §05) and `data-autoscrolling:scrollbar-thumb-transparent` plus `scrollbar-track-transparent`, which hide the scrollbar while the scroller animates: a control hidden from the reader (R21's spirit; `004`'s `scrollbar` decision).
- `ArrowDownIcon` from `@lucide/svelte` (R15: `phosphor-svelte`). `add` resolved the `IconPlaceholder` to lucide and added the 35 MB package.
- The button's `border-border bg-background hover:bg-muted` restyles our `button`'s own variant (R8: `background` is a page ground; a control on the log takes the `secondary` variant as it is).
- `[content-visibility:auto]` on every item: passes the lint (no length), but with `contain-intrinsic-size` gone it would make off-screen rows measure 0 px and the scrollbar jump. The two go together or not at all (INFERRED).
- `transition-[translate,scale,opacity]`, `-translate-x-1/2`, `bottom-4`, `top-4`, `overscroll-contain`, `contain-content`, `size-full`, `min-h-0`: pass.

**Replacements** (INFERRED): the button's appearance is `animate-enter`/`animate-exit` or no motion (it is `hidden` at the bottom; `inert` already removes it from the tab order), `duration-(--motion-micro)` if any; the icon `ArrowDown` from `phosphor-svelte`, `aria-hidden`; the button our `secondary` `icon-sm` (32 px, R21). The item's `content-visibility` pair is dropped or written with a token length. The fade goes; the composer's top groove replaces it.

### 1.7 The dependency question (INFERRED)

Three ways to serve a conversation view.

1. **Install the stock item and pin `@shadcn-svelte/primitives` 0.0.1 as a named dependency.** Constitution §4.6 allows it. Cost: a 28-day-old package at version 0.0.1 with two releases, four transitive packages, 44 KB of scroller JavaScript, and our `index.ts` re-exporting the package's hooks, so the item's API is the package's. Benefit: turn anchoring, prepend preservation, `scrollToMessage`, visibility tracking, the server-side `data-pending-scroll`, and 2,564 lines of tests we did not write.
2. **Write our own scroller**, as `004` did for `scroll-area`: a native `overflow-auto` viewport (`role="region"`, a label, `tabindex="0"`, the `scrollbar` utility), a content `div` with `role="log"` and a name, follow-bottom in about sixty lines (a scroll listener with the 8 px threshold; release on `wheel`, `touchmove`, the seven keys and a falling `scrollTop`; a `ResizeObserver` on the content, coalesced into a frame; re-arm at the bottom), and a button that is `hidden` at the bottom. No anchoring, no prepend, no virtualisation.
3. **Both:** our own first, the package if a thread outgrows it.

The behaviours to keep from the stock, whichever way: never move the reader against a gesture (§1.3's intent list, and a falling `scrollTop`), re-arm only at the bottom, coalesce resize into a frame, suppress the button while following, keep the button out of the tab order when there is nothing to scroll to, and open at the end. A chat pane for a code-running product is one short thread with code output; what it needs is follow-bottom and a stop (patterns memo §8.5). The recommendation is 2, with the stock's state machine as the studied reference and its test names (§1.2's cited lines) as the list of cases to prove. `005` decision 11 takes 2: `message-log`, written fresh with the stock's rules as the reference.

## 2. `message`, `bubble`, `marker`

### 2.1 `message` (READ)

Seven files. Every part is a `div` with a `data-slot`, a `class` and `{...restProps}`; no roles, no ARIA.

| Part | `data-slot` | Classes as installed |
|---|---|---|
| Root | `message`, `data-align="start"\|"end"` | `text-sm gap-2 group/message relative flex w-full min-w-0 data-[align=end]:flex-row-reverse` |
| Group | `message-group` | `gap-2 flex min-w-0 flex-col` |
| Avatar | `message-avatar` | `min-w-8 group-has-data-[slot=message-footer]/message:-translate-y-8 flex w-fit shrink-0 items-center justify-center self-end overflow-hidden rounded-full bg-muted` |
| Content | `message-content` | `gap-2.5 group-data-[align=end]/message:*:data-slot:self-end flex w-full min-w-0 flex-col wrap-break-word` |
| Header | `message-header` | `text-xs font-medium text-muted-foreground px-3.5 group-has-data-[variant=ghost]/message:px-0 flex max-w-full min-w-0 items-center` |
| Footer | `message-footer` | as Header, plus `group-data-[align=end]/message:justify-end` |

The docs compose `Message.Root > Message.Avatar > Avatar.Root` and `Message.Content > Bubble.Root` (`docs/content/components/message.md` lines 52 to 65, 80 to 86): the avatar part is a slot around the `avatar` item. The demo renders user turns as `Message.Root align="end" > Message.Content > Bubble.Root align="end" variant="muted"` and assistant turns as `Message.Root > Message.Content > Markdown` with no bubble (`chat-demo.svelte` lines 268 to 274, 285 to 306). Neither has an avatar.

### 2.2 `bubble` (READ)

Five files. Root `bubble` (`data-variant`, `data-align`), `bubble-content`, `bubble-group`, `bubble-reactions` (`data-side`, `data-align`). `bubble-content` and `marker` take a `child` snippet for a polymorphic root, so a bubble can be a link or a button (`bubble-content.svelte` lines 25 to 31).

Root base: `gap-1 data-[align=end]:self-end max-w-[80%] data-[variant=ghost]:max-w-full group-data-[align=end]/message:self-end group/bubble relative flex w-fit min-w-0 flex-col`. Content: `rounded-3xl border border-transparent px-3.5 py-2.5 text-sm leading-relaxed [button,a]:outline-none [button,a]:focus-visible:border-ring [button,a]:focus-visible:ring-[3px] [button,a]:focus-visible:ring-ring/50 …` (`style-maia.css` line 1461). Seven variants, each styling the content through `*:data-[slot=bubble-content]:` (installed `bubble.svelte` lines 8 to 14):

| Variant | Ground | Hover (when a link or button) |
|---|---|---|
| `default` | `bg-primary text-primary-foreground` | `bg-primary/80` |
| `secondary` | `bg-secondary text-secondary-foreground` | `bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)]` |
| `muted` | `bg-muted` | `color-mix` of `muted` and 5% foreground |
| `tinted` | `bg-[oklch(from_var(--primary)_0.93_calc(c*0.4)_h)]`, dark `0.3 calc(c*0.4) h`, `text-foreground` | `0.88 calc(c*0.5) h`, dark `0.35 calc(c*0.5) h` |
| `outline` | `bg-background border-border` | `bg-muted`, dark `bg-input/30` |
| `ghost` | `rounded-none bg-transparent p-0 border-none` | `bg-muted`, dark `bg-muted/50` |
| `destructive` | `bg-destructive/10`, dark `bg-destructive/20`, `text-destructive` | `bg-destructive/20`, dark `/30` |

**What the `oklch` tint computes.** `oklch(from var(--primary) 0.93 calc(c * 0.4) h)` is a relative colour: it keeps `primary`'s hue `h`, sets lightness to 0.93 (0.30 in dark), and multiplies chroma by 0.4. So it is a pale wash of the brand hue, opaque, with the hue of whatever `primary` is. The hover step lowers lightness to 0.88 (raises to 0.35 in dark) and keeps half the chroma. The bubble's `docs` call it "A subtle primary-tinted bubble" (`bubble.md` line 97).

**The token answer** (INFERRED, against R1, R6, R7, R8). A computed colour is a colour function (R1), and the lint flags each of the four. It is not translucent, but it is a fifth ground with hue, which `001` decision 8 allows nowhere: the four grounds are paper, raised white, ink and the flattened `muted`/`accent` insets. The two token pairs that serve a user turn are:

- **`muted`**, the inset: `bg-muted text-foreground`, no border. It is what the demo chooses (`variant="muted"`, line 270), and an inset is told by its ground (`004` decision 8's reasoning for code). R8 lists insets as component-internal grounds; a turn in a log is one.
- **`card` with a hairline**: `bg-card text-card-foreground border border-border`, raised white, "a user bubble could be raised white" (patterns memo §5.3). On paper it reads as a surface; it costs a line.

Either passes R6 and R7. `default`'s solid `primary` on every user turn spends the one accent the send button owns (decisions, "State colour is outside the one-accent budget"; the accent itself is one per surface), so it is not a user turn's ground. `destructive` is a tint, which R7 forbids inside an inset and `002` reserves for `alert`; an error reply is an `Alert variant="destructive"` with a retry, not a bubble (patterns memo §5.3). `outline`'s `bg-background` is a page ground (R8) and becomes `bg-card`. `ghost` is the assistant's full-width prose and stays.

**Radii.** `rounded-3xl` on the content measured 24 px (§1.4). In our theme every `rounded-*` draws the 8 px case radius (`001` decision 9), so the class is written `rounded` (R9). `rounded-full` on `bubble-reactions` and on `message-avatar` is outside decision 19's allowlist (`four-dot.svelte`, `radio-group-item.svelte`; `scripts/lint-literals.ts` line 53). A reaction pill is not dot-derived. INFERRED: reactions belong to a chat between people, not to a chat with an assistant. `005` decision 12 drops the part. `message-avatar` becomes a slot with no radius and no ground, because our `avatar` is already `size-8 rounded` with a hairline (`src/lib/registry/ui/avatar/avatar.svelte` line 22) and sizes `sm` 24 px and `lg` 48 px.

### 2.3 `marker` (READ)

Four files. Root `marker` (`data-variant`: `default`, `separator`, `border`), `marker-icon` with `aria-hidden="true"` written in (`marker-icon.svelte` line 16), `marker-content`. Base: `gap-2 text-sm text-muted-foreground [a]:hover:text-foreground [a]:underline-offset-3 [a]:underline [&_svg:not([class*='size-'])]:size-4 min-h-4 text-left group/marker relative flex w-full items-center`; `separator`: `before:h-px before:flex-1 before:bg-border after:…`; `border`: `border-b border-border pb-2`.

- **Role.** "`Marker` is presentational by default… choose the role based on intent" (`marker.md` line 178). For "streaming or progress markers such as 'Thinking...'", the docs say `role="status"` with a `Spinner` (lines 104, 182 to 187; `examples/marker-status.svelte`). INFERRED: a marker inserted at the moment it is needed is a region created with its text, which is the silent case `003` decision 8 records ("a region announces only if it was in the page before its text changed"). Our status line is content in the log (an added node, which `additions` announces, §5.1) and the state is told by the `status` item. A marker of ours carries no role; an app may pass one.
- **`shimmer`.** The docs pair the marker with the `shimmer` utility "for an animated streaming-text effect" (line 114). It is a `tw-shimmer` keyframe sliding a `linear-gradient` with `oklch(from currentColor …)` and `color-mix` (`packages/cli/src/tailwind.css` lines 518 to 557): a looping gradient, banned twice (R14; the design book §06; R1).
- **The separator lines** `before:h-px` and `after:h-px` are 1 px sizes off the ladder; the hairline is a border (R22): `before:border-t before:border-border`.

### 2.4 `textarea` and `input-group`, as ours stand (READ)

- Ours: `src/lib/registry/ui/textarea/textarea.svelte` line 35: `field-sizing-content flex min-h-16 w-full resize-y rounded border border-input bg-card px-3 py-2 text-base …`; it reads the `pluto:field` context for `id`, `aria-describedby`, `aria-invalid` (lines 24, 38 to 40).
- `input-group-textarea.svelte` line 19: `flex-1 resize-none rounded-none border-0 bg-transparent py-2 focus-visible:focus-ring-none`; the group draws the ring and the border (line 14's comment). So a composer built on `input-group` already has no resize handle and one ring on the group.
- The stock composer (`chat-demo.svelte` lines 317 to 374) is exactly that: `InputGroup.Root > InputGroup.Textarea` plus `InputGroup.Addon align="block-end"` holding a menu button and the submit button.

### 2.5 The lint table (EXECUTED; the right column READ)

| Item | Files | Lint | Files failing | What the lint found | Beyond the lint (R-rule) |
|---|---|---|---|---|---|
| `message-scroller` | 7 | 5 | 2 | `duration-200`, `duration-400`, `scale-95`, `scale-100`, `[contain-intrinsic-size:auto_10rem]` | two `cubic-bezier` easings (R14); `scroll-fade-b` (the design book §05); scrollbar hidden on autoscroll; lucide icon (R15); `bg-background` on a control (R8) |
| `message` | 7 | 4 | 4 | `px-3.5` ×2, `gap-2.5`, `rounded-full` | the avatar part's own ground and radius (R8, R9); no heading or focus target per turn (§5.4) |
| `bubble` | 5 | 31 | 3 | `color-mix(` ×2, `oklch(` ×4, four `oklch` arbitrary values, `max-w-[80%]`, `bg-primary/80`, `bg-input/30`, `bg-muted/50`, `bg-destructive/10` `/20` `/20` `/30`, `dark:` ×2, `px-3.5`, `py-2.5`, `leading-relaxed`, `outline-none`, `ring-[3px]`, `ring-ring/50`, `rounded-full`, `ring-3`, `ring-card`, `px-1.5`, `py-0.5` | `rounded-3xl` (R9); `tinted` as a fifth ground; `default` spends the accent; `destructive` tint (R7); `outline` on `bg-background` (R8); reactions |
| `marker` | 4 | 2 | 1 | `before:h-px`, `after:h-px` | `shimmer` pattern (R14, R1); `role="status"` pattern (`003` decision 8) |
| **Total** | **23** | **42** | **10** | | |

The primitives memo's counts (bubble 17, message 3, scroller 2, marker 0; its §3.3) were made with `001`'s lint on the built JSON. This run uses the lint as it stands after `002` and `004`, on the files as written to an app, so translucent tints, rings, outlines and sizes now count. The stock `button` that `add` pulled in failed 26 times in its one `.svelte` file; it is replaced by ours and not counted.

**Replacements, in one list** (INFERRED): `px-3 py-2` and `gap-2`; `rounded`; `max-w-4/5` (a fraction passes R5) or no cap; no `leading-*`; the global focus recipe (R2) for link or button bubbles; `hover:bg-accent` for a hover on a `muted` bubble that is a control (`001` decision 8's hover ground); the variants reduced to `muted`, `card`, `ghost`; reactions dropped; `before:border-t` for the separator; `phosphor-svelte` icons; our `button` and `avatar` as they are.

## 3. The composer

### 3.1 What the stock demo writes (READ, `examples/chat-demo.svelte`)

- A `form` with `onsubmit` (line 317), `InputGroup.Root`, `InputGroup.Textarea` with `placeholder="Ask the agent..."`, `aria-label="Message"`, `class="min-h-14"` (lines 319 to 323). No visible label.
- `onkeydown`: `if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); form?.requestSubmit(); }` (lines 324 to 329). **No composition check.**
- The submit: `InputGroup.Button type="submit" variant="default" size="icon-sm" disabled={!canSend}` with an `ArrowUpIcon` and a visually hidden "Send" (lines 362 to 371). `canSend` is non-empty text and not busy (line 128); `busy` is `status === "submitted" || status === "streaming"` from `@ai-sdk/svelte`'s `Chat` (lines 118, 126).
- **No stop control** (EXECUTED: `grep stop` finds nothing). The reset button is `disabled={busy}` (line 236).
- The `Reset` button clears the thread; a `DropdownMenu` on a `+` button offers attachments (lines 332 to 361).

### 3.2 AI Elements' prompt input (READ, the source at `raw.githubusercontent.com/vercel/ai-elements/main/packages/elements/src/prompt-input.tsx`)

- **The submit button swaps to Stop.** `PromptInputSubmit` picks its icon by `status`: the default `CornerDownLeftIcon`; `submitted` → `Spinner`; `streaming` → `SquareIcon`; `error` → `XIcon`. When generating and an `onStop` is given, the button's `type` becomes `"button"` and its click calls `e.preventDefault(); onStop()`; otherwise it is `type="submit"`. One control, one position.
- **The textarea** is `field-sizing-content max-h-48 min-h-16`: 64 px minimum, 192 px maximum, no script. (The site's page says only "Customizable min/max height"; the source gives the numbers.)
- **Keys:** `if (e.key === "Enter") { if (isComposing || e.nativeEvent.isComposing) return; if (e.shiftKey) return; e.preventDefault(); … if (submitButton?.disabled) return; form?.requestSubmit(); }`. The guard is `isComposing` only; no `keyCode === 229`.

### 3.3 MUI X and the AI SDK (READ)

- **MUI X Chat, composer** (`mui.com/x/react-chat/headless/composer/`): "Press Enter to send. Shift+Enter keeps a new line." Enter submits only when "the native event is not composing", `Shift` is up, and no earlier handler prevented the default; "East Asian IME flows stay intact". The send button "disables itself when" the draft is empty, a stream is active, or it is disabled from outside. `minRows={1}`; no `maxRows` documented; no stop documented. The textarea "restores focus" when the active conversation changes.
- **The AI SDK chatbot guide** (`ai-sdk.dev/docs/ai-sdk-ui/chatbot`), the four `status` values, quoted: `submitted`, "The message has been sent to the API and we're awaiting the start of the response stream."; `streaming`, "The response is actively streaming in from the API, receiving chunks of data."; `ready`, "The full response has been received and processed; a new user message can be submitted."; `error`, "An error occurred during the API request, preventing successful completion." The example shows Stop for `submitted` and `streaming`, a spinner at `submitted`, and disables the input and submit unless `ready`; "When the user clicks the 'Stop' button, the fetch request will be aborted." `regenerate` is enabled at `ready` or `error`. `@ai-sdk/svelte` 5.0.159 (Apache-2.0, EXECUTED `bun pm view`) exposes the same `status` on `Chat` (the demo, line 126).
- **Never disable submit.** Atlassian, form usage: "Never disable a submit button, even if all of the required fields aren't filled in." Primer, saving: "Do not disable or hide a form's save button even if the form is invalid or has not been changed." and "Disabled buttons cannot be focused using the Tab key". `002` decision 12: a busy button stays enabled, sets `aria-busy`, and ignores re-submits.
- **accessibility.build**, accessible AI chat (reviewed by Khushwant Parihar, CPACC; updated August 2026): "After the user sends, leave focus in the composer so they can keep typing." "Do not steal focus when the response starts or finishes." A "Stop generating control must be present, focusable, and named"; "Keep Stop focusable and announced the entire time a response is streaming." "The common convention is that Enter sends and Shift+Enter inserts a new line", but "a visible Send button is required" and "Do not make a hidden Enter handler the only way to send."

### 3.4 The IME guard (EXECUTED)

`static/ime.html` holds one textarea with two `keydown` listeners: the clone's naive condition (`key === "Enter" && !shiftKey`) and the guarded one (the same, then `if (isComposing || keyCode === 229) return`). `probes/ime.ts` dispatched four synthetic `keydown` events and one real `Enter` through Playwright, in each engine.

| Event | Chromium 156 | WebKit 27.2 | Firefox 157 |
|---|---|---|---|
| Enter with `isComposing: true` | naive **sent**; guarded ignored | the same | the same |
| Enter with `keyCode: 229` | naive **sent**; guarded ignored | the same | the same |
| Enter, plain (synthetic) | both sent | the same | the same |
| Shift+Enter | neither | the same | the same |
| Enter, real keypress | both sent | the same | the same |

So the clone's handler sends the message when an IME confirms a candidate, in all three engines. The guard catches both signals. Why both: "WebKit bug report #165004 records that Safari was dispatching `compositionend` before the confirming `keydown`", so `isComposing` can be false on that Enter, and tracking `compositionend` yourself hits the same order; "code combining `isComposing` and `keyCode === 229` … is the recommended approach" (READ, azukiazusa, "IME and Enter-to-submit", 2026-09-06). A real IME was not driven; Playwright has no composition API, so the synthetic events stand for it (INFERRED: a limit of this run).

### 3.5 Growth, minimum and maximum (INFERRED from §4)

- **Minimum.** Our `textarea`'s `min-h-16` is 64 px; at `text-base` (25.6 px line box) one line with `py-2` is 41.6 px and two lines are 67.2 px, so 64 px shows one line with room and grows at the second. AI Elements uses the same 64 px.
- **Maximum.** AI Elements caps at 192 px (`max-h-48`). On the ladder, 48 is not a step (the steps run to 24, which is 96 px), so `max-h-48` fails R5. The measured cap that passes is a container size: `max-h-3xs` is 256 px, about nine lines; or a theme variable in `pluto-theme`, read as `max-h-(--composer-max)`, which the lint allows in the token form. Six lines is 169.6 px (`6 × 25.6 + 16`, the value §4 measured with a `calc`), which no allowed class names. `005` decision 13 takes the variable form, `max-h-(--container-3xs)`, 256 px: `max-h-3xs` emits nothing, since Tailwind 4.3.3's container keywords are width-only.
- **Inner scroll** past the maximum: `overflow-y-auto` with the `scrollbar` utility, which §4 shows working with `field-sizing`.
- `input-group-textarea` already sets `resize-none`, so the person does not drag it; growth is the browser's.

### 3.6 The hint, the label, the states (INFERRED)

- **Label.** SC 3.3.2 wants a visible label or visible instructions. The visible instruction "Enter to send, Shift+Enter for a new line", with `Kbd` keys, serves it, and the textarea's name can be a visually hidden "Message" (or the visible instruction can carry the name through `aria-labelledby`). The hint is wired by `aria-describedby`; `Field`'s `description` prop does that wiring in the server render (`002` decision 11), so the composer can render its textarea inside a `Field`.
- **Send.** `type="submit"`, the default 48 px icon button (`size-12`, `002` decision 10), `aria-label="Send message"`, `ArrowUp` from `phosphor-svelte` `aria-hidden`. Never disabled: an empty submit is ignored, focus stays. The one accent on the surface.
- **Stop.** The same control at `submitted` and `streaming`: `type="button"`, `aria-label="Stop response"`, a `Square` icon, `variant="secondary"` (the patterns memo's call: stopping destroys nothing, so no red). A spinner at `submitted` is allowed as the one busy control (decisions, "Functional progress is not 'ambient animation'"), but the button stays named and focusable. Pressing Enter in the textarea while streaming does nothing; Escape stops (patterns memo §5.2). After Stop the same element becomes Send again, so focus is not lost.
- **Status.** `submitted` → the status says "Responding"; `streaming` → unchanged; `ready` → "Response complete"; stopped → "Stopped"; `error` → an `Alert variant="destructive"` in the log with a retry, and the status cleared (§5.3).
- **Disabled, then.** Nothing in the composer is ever `disabled`. The reset action, if there is one, is busy or hidden, not disabled.

### 3.7 The eleven behaviours a `chat-composer` item needs (INFERRED)

1. A `form` whose `onsubmit` calls an app's `onsend(text)` and clears the draft.
2. A textarea with a name, growing from 64 px to a maximum, then scrolling inside (§3.5).
3. A visible send button, `type="submit"`, 48 px, named, never disabled.
4. The same control as Stop while `submitted` or `streaming`, `type="button"`, named, calling `onstop`.
5. Enter sends; Shift+Enter inserts a line; Shift is checked before the IME check.
6. No send while `event.isComposing` or `event.keyCode === 229` (§3.4).
7. Escape calls `onstop` while a reply runs, unless a menu is open.
8. Focus stays in the textarea after send and after stop.
9. A visible "Enter to send" hint with `Kbd`, wired by `aria-describedby`.
10. `status` prop with the AI SDK's four names; a polite `Status` for the three state words (§5.3).
11. An `Alert` for `error`, with retry, outside the composer.

## 4. `field-sizing: content` (EXECUTED)

### 4.1 The run

`static/field-sizing.html`: three textareas, 400 px wide, `padding: 8px 12px`, `font: 16px/1.6 system-ui`, `box-sizing: border-box`: `#fs` with `field-sizing: content; min-height: 64px`; `#cap` the same plus `max-height: calc(1.6em * 6 + 16px); overflow-y: auto`; `#plain` with `rows="2"` and no `field-sizing`. `probes/field-sizing.ts` filled each with 1, 3 and 8 lines and read `getBoundingClientRect().height`, then `scrollHeight` at 8 lines.

| Engine | `CSS.supports("field-sizing","content")` | `#fs` 1 / 3 / 8 lines | `#cap` 1 / 3 / 8 lines (scrollHeight) | `#plain` |
|---|---|---|---|---|
| Chromium 156.0.8078.4 | `true` | 64 / 94.78 / 222.75 | 64 / 94.78 / **169.59** (221) | 69.19 at every count |
| WebKit 27.2 (Safari 27.2 UA) | `true` | 64 / 94.78 / 222.75 | 64 / 94.78 / **169.59** (221) | 69.19 |
| Firefox 157.0 | `true` | 64 / 94.80 / 222.80 | 64 / 94.80 / **169.60** (222) | 69.20 |

So the element grows with its text in all three: one line sits at the 64 px minimum, three lines measure 3 × 25.6 + 16 = 92.8 plus 2 px of border, eight lines 222.8. With a `max-height` it stops at the cap and the content scrolls inside (`scrollHeight` 221 against a 169.6 px box). The plain textarea stays at its `rows`.

### 4.2 Support (READ)

- **MDN's compat data**, `@mdn/browser-compat-data` 8.1.7 (EXECUTED: installed into the scratch folder and read `css.properties.field-sizing`): Chrome 123, Chrome Android 123, Edge 123, Firefox 152, Firefox Android 152, Opera 109, Safari 26.2, Safari iOS 26.2, Samsung Internet 27.0, WebView Android 123, WebView iOS 26.2; no flags; standard track; not experimental.
- **MDN's page** (`developer.mozilla.org/…/field-sizing`): "Baseline 2026. Newly available. Since June 2026, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers." The value `content`: "Allows the element to adjust its size to fit its contents."
- **caniuse** (`caniuse.com/mdn-css_properties_field-sizing`): global usage 87.2%; supported Chrome 123 to 159, Edge 123 to 155, Firefox 152 to 162, Safari 26.2 to 27.1, iOS Safari 26.2 to 27.2, Samsung 27 to 30; not supported Firefox 2 to 151, Safari 3.1 to 26.1, iOS 3.2 to 26.1.
- The three engines run here are all past the first supporting version, so this run cannot show the unsupported behaviour; the `#plain` row (a fixed `rows` box) is what an older engine shows for every textarea.

### 4.3 The fallback (INFERRED)

Where `field-sizing` is absent (Safari before 26.2, Firefox before 152, and 12.8% of use by caniuse's count), a `field-sizing-content` textarea keeps its `min-height` and scrolls inside. Three ways to treat that:

1. **Accept it.** The composer is a 64 px box that scrolls after two lines. Typing, Enter, Shift+Enter and the hint all work; only growth is missing. Zero lines of script. This is what `002` decision 13 already chose for `textarea` ("Where it does not, it keeps its minimum height").
2. **A `rows` auto-grow in script.** On `input`: set `rows = 1`, read `scrollHeight`, compute `ceil((scrollHeight − padding) / lineHeight)`, clamp to the maximum, set `rows`. About twelve lines, guarded by `CSS.supports("field-sizing", "content")` so supporting engines skip it. No `ResizeObserver` is needed unless the width changes re-wrap long lines; a `resize` listener adds three lines. It must write the `rows` attribute, not `style.height`: the lint bans a `style` attribute and `.style.` access (`001` decision 25), so a height-in-pixels fallback is not open to an item.
3. **The person's own resize.** `resize-y` on the control, as `textarea` has. Inside `input-group` the control is `resize-none` and the handle would sit on the group's edge; not for the composer.

What the composer should do: `field-sizing-content`, `min-h-16`, the maximum of §3.5, `overflow-y-auto`, and option 1. Option 2 is one guarded function; `005` decision 13 does not write it. This settles the question `002` decision 13 left: `field-sizing` is Baseline 2026, supported in the three engines the repository tests, and the composer's maximum height is a CSS cap that works with it (§4.1's `#cap`).

## 5. The stream announcer

### 5.1 What `aria-relevant="additions"` announces (READ, ARIA 1.2, `downloads/aria-1.2.html` §6.7)

- `aria-relevant`: "Indicates what notifications the user agent will trigger when the accessibility tree within a live region is modified." Values: `additions`, "Element nodes are added to the accessibility tree within the live region."; `text`, "Text content or a text alternative is added to any descendant in the accessibility tree of the live region."; `removals`; `all`. "When the `aria-relevant` attribute is not provided, the default value, `additions text`, indicates that text modifications and node additions are relevant, but that node removals are irrelevant."
- "aria-relevant is an optional attribute of live regions. This is a suggestion to assistive technologies, but assistive technologies are not required to present changes of all the relevant types."
- `log`: "A type of live region where new information is added in meaningful order and old information may disappear… Examples include chat logs, messaging history". "Elements with the role log have an implicit aria-live value of polite." MDN adds: "The `log` is required to have an accessible name. Use `aria-labelledby` if a visible label is present, otherwise use `aria-label`." and the implicit `aria-atomic` is `false`.
- `aria-busy`: "When aria-busy is true for an element, assistive technologies MAY ignore changes to content owned by that element and then process all changes made during the busy period as a single, atomic update when aria-busy becomes false." "if multiple changes to a live region should be spoken as a single unit of speech, authors MAY set aria-busy to true while the changes are being made and then set it to false when the changes are complete and ready to be spoken." MDN: assistive technology "should wait until the modifications or changes are complete before exposing the content to the user."

INFERRED from the definitions. A streamed reply is one element node inserted empty, then text appended to it. Under `additions`, the insertion is relevant and the text is not. So the log announces the node once, when it is empty, and says nothing of the words. Under the default `additions text`, each appended chunk is relevant, which is the clipped-fragment problem the patterns memo reports (§5.2). `aria-busy="true"` on the streaming node asks the reader to hold the chunks and speak them as one unit when it turns `false`, but only under a relevance that includes `text`, and only as a MAY. No screen reader has been run; the tests prove the DOM contract (`decisions.md`, "After the public-readiness review").

EXECUTED, what is observable: Chromium's tree computed `live: polite`, `atomic: false`, `relevant: additions` on the log, and the log's name was empty (§1.4). The announcement itself is not in the tree; Playwright drives no screen reader.

### 5.2 Two designs (INFERRED)

- **A.** Log with the default `additions text`, `aria-busy="true"` on the reply while it streams, `false` when done. Tokens are held; the reply may be read once at the end, by readers that honour the MAY. The stop and complete states still need words.
- **B.** Log with `additions` (the stock default), a reply node that is never announced by the log, and a separate polite `status` that says "Responding", "Stopped", "Response complete". The reply is read by the person moving to it (§5.4), or by the status if an app sets the whole text into it. This is the pattern accessibility.build describes: "let the text appear silently while it streams and to announce the finished message once", "When the stream finishes, write to that region once."; and the patterns memo §8.5's proposal.

B depends on nothing a reader MAY do, and the log still announces what is added whole: a user turn, a marker line ("Stopped: out of fuel"), an error alert. A is a refinement an app can layer on by passing `aria-relevant` and `aria-busy`.

### 5.3 Whether `003`'s `status` serves it as is (READ, `src/lib/registry/ui/status/status.svelte`)

It renders `role="status" aria-live="polite" aria-atomic="true"` from the first render, visually hidden unless `visible`, and announces when `text` changes (lines 25 to 35; `003` decision 8). It serves B as it is:

- Mount one `Status` in the pane at render, before any reply.
- Set "Responding" at `submitted`, "Response complete" at `ready`, "Stopped" on stop. Each pair differs, and "Responding" sits between results, so the "never the same text twice in a row" rule holds.
- With `visible`, the same element can be the pane's static streaming indicator beside the composer ("Responding"), which the design book §06 allows because it does not move. No loop, no dots, no shimmer.
- To read the finished reply aloud, an app sets the reply's text into a second `Status` once; a long reply becomes one long utterance, which is the trade the patterns memo names. The item needs no change for either.

### 5.4 "Jump to latest reply" (INFERRED; READ where cited)

accessibility.build: a "Go to latest response" button that moves focus to the newest message, triggered by the user; "Do not steal focus". The stock scroller's button scrolls; it does not move focus (`handleClick`, lines 1448 to 1465, calls `blur()` then scrolls). The two differ: one moves the view, the other the reader.

- The target is the last assistant turn's heading. `message-header` becomes a heading (an `h2` or the level an app passes, as `CardTitle` and `EmptyTitle` take `level` in `002`), mono eyebrow in style (the design book §04: mono furniture), text "assistant" or the name an app gives the assistant, with `tabindex="-1"` so script can focus it and Tab does not stop on it. Heading navigation then walks the turns, which the patterns memo wanted ("navigable by heading").
- The control is a `secondary` button, "Latest reply", shown while the last reply is not the one in view, that calls `heading.focus({ preventScroll: false })`. Focus moves the view with it. `scroll-padding-bottom` on the viewport keeps the heading above a sticky composer (patterns memo §5.2, C43).
- One `h1` stays the page's; reply headings rendered from markdown are demoted below the turn heading (patterns memo §5.2).

## 6. Code in messages

### 6.1 `code-block` at `sm` and the hook, as they stand (READ)

- `code-block.svelte` line 8: the root sets `data-size` and `data-[size=sm]:text-xs`; content at `sm` is `px-3 py-2` (`code-block-content.svelte` line 79), header and footer `px-3 py-1` (`-header` line 18, `-footer` line 18), lines `-mx-3 px-3` (`-line` line 9), title `text-xs` (`-title` line 18). The root draws the ring; the `pre` is a stop with `tabindex` 0 and the `scrollbar` utility (`004` decision 8).
- `CodeBlockContent` takes `code` with `language` and runs `useHighlightedCode(() => code, () => language)` itself (lines 33 to 36), or `lines` from a server `highlightCode`; with `code` and no `language` it renders plain (lines 38 to 44).
- `use-highlighted-code.svelte.ts`: loads the highlighter in an `$effect` (lines 34 to 49), returns plain strings until it arrives (lines 67 to 69), tokenises only the lines completed since the last run from the saved grammar state (lines 71 to 93), and re-tokenises the unfinished last line every time (lines 95 to 98). That is the streaming path `004` decision 7 kept.

So a message renders a streamed fence as `<CodeBlock.Root size="sm"><CodeBlock.Content code={text} language={lang} /></CodeBlock.Root>` and passes a growing `text`; nothing in `004` needs to change for it. The copy button takes the text so far; the clone disables it until the closing fence (`markdown-code-block.svelte` line 25, `disabled={incomplete}`), which our never-disable rule turns into "the button copies what is there" (INFERRED).

### 6.2 What the clone's demo does for assistant text (READ)

- Assistant text goes through `<Markdown content={reply} />` (`chat-demo.svelte` line 303), a docs component, not a registry item: `docs/src/lib/components/markdown/markdown.svelte` wraps `Streamdown` from `svelte-streamdown` (line 2), with `components = { code: MarkdownCodeBlock }` (line 8) and a `codespan` snippet for inline code (lines 29 to 31). `markdown-code-block.svelte` maps a fenced token to `CodeBlock.Root > Header (Title, Actions, CopyButton) > Content lineNumbers` with `useHighlightedCode(() => token.text, () => language)` (lines 14 to 32). The docs pin `svelte-streamdown ^4.2.1` (`docs/package.json`).
- User text is plain: `getMessageText(message)` concatenates the text parts (`docs/src/lib/ai-sdk.ts` lines 8 to 10; demo line 271).
- The demo's scripted replies hold markdown: bold, lists, fenced `ts` and `svelte` blocks (lines 55 to 67, 85 to 92).

### 6.3 The options (EXECUTED, `bun pm view` on 2026-11-01, and the scratch install)

| Package | Version | Licence | Last release | Unpacked | Dependencies | Notes |
|---|---|---|---|---|---|---|
| `marked` | 18.1.2 | MIT | 2026-10-26 | 533,908 bytes (12 files, several builds) | none | bundled and minified by `bun build`: 47,721 bytes, **14,419 gzipped** |
| `micromark` | 4.0.3 | MIT | 2026-09-26 | 209,945 bytes | 18 (`micromark-*` utilities, `debug`, `devlop`) | bundled: 80,700 bytes, 23,302 gzipped; CommonMark-exact |
| `markdown-it` | 15.0.3 | MIT | 2026-10-16 | 2,064,760 bytes | 6 (`argparse`, `entities`, `linkify-it`, `mdurl`, `punycode.js`, `uc.micro`) | HTML string output |
| `svelte-exmarkdown` | 5.0.2 | MIT | 2025-08-09 | 416,234 bytes | `remark-gfm`, `remark-parse`, `remark-rehype`, `unified` | Svelte components per node; peer `svelte ^5.1.3`; 14 months since a release |
| `svelte-streamdown` | 5.0.0 | MIT | 2026-10-19 | 414,497 bytes | `@floating-ui/dom`, `@tanstack/highlight`, `cn`, `katex`, `marked`, `pele` | what the clone's docs use; brings KaTeX and a second highlighter beside Shiki; peer `svelte ^5.0.0` |
| `streamdown` | 2.7.1 | Apache-2.0 | 2026-10-19 | 125,435 bytes | 15 (`unified` stack, `tailwind-merge`) | React; not applicable |
| `carta-md` | 4.11.5 | MIT | 2026-10-07 | 314,907 bytes | `diff`, `shiki`, `unified` stack | an editor, not a renderer |

Installing `marked`, `micromark` and `svelte-exmarkdown` together into `view/` added 96 packages.

EXECUTED, `marked.lexer` on a streaming string: `"Here is code:\n\n```python\nprint(1)\nfor i in"` yields `[paragraph, space, { type: "code", lang: "python", text: "print(1)\nfor i in" }]`: an unterminated fence is a `code` token with its text so far, which is what the hook wants. `"a **bold"` yields one `paragraph` with the raw text; an unclosed emphasis stays literal until it closes.

### 6.4 Recommendation (INFERRED)

- **The registry does not need a markdown renderer to show streamed code.** A `message-text` part that splits a string on fence lines (a regular expression over `^```(\w*)$ … ^```$`, with an open fence running to the end of the string) renders prose as paragraphs and each fence as `code-block` at `sm` with the hook. About fifteen lines, no dependency. It gives `006`'s pane and a consuming app's chat (text and code output) what they need. `006` decision 10 builds it as `ChatText`.
- **If an app wants markdown in replies**, `marked` is the route: MIT, no dependencies, 14 KB gzipped, a lexer whose tokens map to our parts (`heading` demoted, `paragraph`, `list`, `code` to `code-block`, `codespan` to inline `code`, `link`, `strong`, `em`), with an incomplete fence already handled. That would be a `markdown` item of its own, with `marked` pinned by it; this registry serves none (`005` decision 21). `svelte-streamdown` would add KaTeX and `@tanstack/highlight` beside Shiki, two renderers for one job; `svelte-exmarkdown` is fourteen months unreleased; `markdown-it` returns HTML, which needs `{@html}` and a sanitiser.
- So: markdown is an app's own; fenced code is ours.

## 7. What this memo does not settle

- **Speech.** `aria-relevant`, `aria-busy` and the `status` wording are reasoned from ARIA 1.2 and Chromium's computed tree. No screen reader has been run; the tests prove the DOM contract. Screen readers are outside this release's checks (`decisions.md`, "After the public-readiness review"; `005` decision 21).
- **A real IME was not driven.** The guard was proved against synthetic `isComposing` and `keyCode` events in three engines, not against a Japanese or Chinese input method confirming a candidate.
- **`rows` under `field-sizing: content`:** whether `rows` still sets the minimum when the property is on was not measured; the probe used `min-height`. `005` decision 13 sets both `rows={1}` and `min-h-16`.
- **Engines without `field-sizing`** were not run: Safari 26.1 and Firefox 151 are not in Playwright's cache. §4.3's fallback is reasoned from the `#plain` row. `005` decision 13 takes option 1: there the box keeps its minimum and scrolls inside.
- **Reduced motion** in the stock scroller: it reads no preference, and its smooth scrolls were not checked under `prefers-reduced-motion`. `005` decision 11's log scrolls with `behavior: "auto"` when the query matches.
- **The dynamic viewport** (`dvh`, the on-screen keyboard on iOS) for a full-bleed pane was not tested; the patterns memo §5.4 named it. iOS Safari is outside this release's checks (`decisions.md`, "After the public-readiness review").
- **`content-visibility: auto`** on long threads: the stock's performance claim was not measured; the probe had 15 rows. `005`'s `message-log` does not use it.
- **The primitive package's future:** two releases in a month. `005` does not take the package (decisions 2 and 11), so its versions do not touch this registry.
- **The live stock registry** may have moved since `6149e14`; the four JSON files fetched that day served `005`'s provenance step (decision 3).

**In one line:** `field-sizing: content` grows a textarea in Chromium 156, WebKit 27.2 and Firefox 157 and caps with `max-height`, settling the question `002` decision 13 left; the four stock chat items fail the lint 42 times in 10 of 23 files and carry a gradient fade, a looping shimmer and `oklch` tints that our tokens answer with `muted` or `card`; the stock scroller is a wrapper over a 28-day-old `@shadcn-svelte/primitives` 0.0.1 whose follow-bottom works but is off by default and whose log has no name; a composer of ours is eleven behaviours with the IME guard proved and nothing ever disabled; `aria-relevant="additions"` announces an added node and not its words, so `003`'s `status` is the announcer as it is; and streamed fenced code renders through `code-block` at `sm` and the hook today, with `marked` the route if an app wants markdown.

## Sources

Read on 2026-11-01 unless the memo says otherwise.

**This repository**
- `context/constitution.md`; `context/README.md`; `context/decisions.md`.
- `context/research/2026-10-28-the-blocks-patterns-and-accessibility.md` §0.1, §5, §8.5.
- `context/research/2026-10-28-the-primitives-the-blocks-and-the-home-page-need.md` §3, §6.4, §7.
- `context/research/2026-10-31-the-data-items-chart-popover-accordion-toggles-scroll-area-and-a-meter.md` (format; §4.5 the native scroll box).
- `context/specifications/002-the-primitives-forms-surfaces-and-feedback.md` decisions 9, 10, 11, 12, 13, 14, 24, Landing note 9.
- `context/specifications/003-the-first-blocks.md` decision 8; `src/lib/registry/ui/status/status.svelte`.
- `context/specifications/004-code-and-data.md` decisions 7, 8, 19; `src/lib/registry/ui/code-block/*.svelte`; `src/lib/registry/hooks/use-highlighted-code.svelte.ts`.
- `src/lib/registry/ui/textarea/textarea.svelte`; `src/lib/registry/ui/input-group/input-group-textarea.svelte`; `src/lib/registry/ui/avatar/avatar.svelte`; `src/lib/registry/ui/button/button.svelte`; `src/lib/registry/ui/kbd/kbd.svelte`; `scripts/lint-literals.ts`.
- `tests/smoke/fixtures/kit3/` (the scratch app's base).

**Prior art**, `context/prior_art/shadcn-svelte/` at `6149e14` (MIT)
- `docs/src/lib/registry/ui/message-scroller/*` (7 files); `ui/message/*` (7); `ui/bubble/*` (5); `ui/marker/*` (4); `ui/textarea/textarea.svelte`.
- `packages/primitives/package.json`; `packages/primitives/src/lib/message-scroller/message-scroller.svelte.ts`, `types.ts`, `exports.ts`, `index.ts`, `components/*.svelte`, `message-scroller.test.ts`.
- `docs/src/lib/registry/examples/chat-demo.svelte`, `marker-status.svelte`; `docs/src/lib/components/markdown/markdown.svelte`, `markdown-code-block.svelte`; `docs/src/lib/ai-sdk.ts`; `docs/src/app.css`; `docs/package.json`.
- `docs/src/lib/registry/styles/style-maia.css` lines 1456 to 1515 (bubble), 1574 to 1594 (marker), 1741 to 1770 (message).
- `docs/content/components/message-scroller.md`, `message.md`, `bubble.md`, `marker.md`.
- `packages/cli/src/tailwind.css` (scroll-fade lines 91 to 200 and 323 to 328; shimmer lines 518 to 557); `packages/cli/src/utils/css.ts`; `packages/cli/CHANGELOG.md`.

**Live registry and packages** (EXECUTED)
- `https://shadcn-svelte.com/registry/styles/maia/{message-scroller,message,bubble,marker,textarea}.json`, 2026-11-01.
- `bun pm view`, 2026-11-01: `@shadcn-svelte/primitives`, `marked`, `micromark`, `markdown-it`, `svelte-exmarkdown`, `svelte-streamdown`, `streamdown`, `carta-md`, `ai`, `@ai-sdk/svelte`.
- `@mdn/browser-compat-data` 8.1.7, `css.properties.field-sizing`.

**The web**
- MDN, `field-sizing`: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/field-sizing
- caniuse, `field-sizing`: https://caniuse.com/mdn-css_properties_field-sizing
- W3C, WAI-ARIA 1.2, `log`, `aria-relevant`, `aria-busy`: https://www.w3.org/TR/wai-aria-1.2/ (downloaded; 1,410,696 bytes)
- MDN, `log` role: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/log_role
- MDN, `aria-relevant`: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-relevant
- MDN, `aria-busy`: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-busy
- accessibility.build, Accessible AI chat (reviewed by Khushwant Parihar, CPACC; updated August 2026): https://accessibility.build/guides/accessible-ai-chat
- Vercel AI SDK, chatbot guide: https://ai-sdk.dev/docs/ai-sdk-ui/chatbot
- Vercel AI Elements, prompt input page: https://elements.ai-sdk.dev/components/prompt-input ; source: https://raw.githubusercontent.com/vercel/ai-elements/main/packages/elements/src/prompt-input.tsx
- MUI X Chat, headless composer: https://mui.com/x/react-chat/headless/composer/
- Atlassian Design System, form usage: https://atlassian.design/components/form/usage
- Primer, saving pattern: https://primer.style/product/ui-patterns/saving/
- azukiazusa, "IME and Enter-to-submit" (2026-09-06): https://azukiazusa.dev/en/blog/ime-enter-submit
