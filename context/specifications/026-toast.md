# 026 — Toast

- **Status:** Ready for owner answers: review approved with changes, all applied. 2026-11-15. The review, [`../reviews/026-toast-spec-2026-11-15.md`](../reviews/026-toast-spec-2026-11-15.md), found 19 findings; its re-review approved with changes R1 to R10. Every one is answered under "Review". The owner answered Q1 to Q8 on 2026-11-15, each with the recommended option (see Landing notes). Ready to build after `020`; its `app-shell` edit waits for `023`.
- **Date:** 2026-11-15
- **Author:** the design lead
- **Kind:** a new registry item, `toast` (lane N: its own folder, examples and page). Four edits outside the lane, each landing after the spec that owns its lane (decision 24): `app-shell` mounts the toaster (lane I, after `023`); the site's preview copy of the shell and one new shell view follow it, and the frameless example view mounts a toaster for this item's examples (lane S); `tests/sr/` gains this item's file, one `app-shell` test, two rules and one mutation (lane E, after `022`); and `scripts/cost/` gains this item's fixture, interaction and two cases (lane E, after `025`). **Interface changes:** `app-shell`, with one changelog bullet and one section in the upgrade guide. `toast` is new. No token is added or changed. No package is added to the repository: the item's one package, `phosphor-svelte`, is already a package of 17 `ui` items, `spinner` and `accordion` among them (EXECUTED (026), grep; re-run by the review).
- **Written against the renamed tree.** `020` (the Kuiper rename) lands first, so every name here is the new one: the `kuiper` registry, `kuiper-theme`, `kuiper:` context keys, `kuiper-enter` and `kuiper-exit` keyframes, `scripts/bench/kuiper.ts`, and the guide at `/changelog/0.13.0/upgrade/` (the owner's answer to `020` Q4). `toast` sets and reads no Svelte context. If a builder finds it needs one, its key is `kuiper:toast`.
- **Depends on:** `020`, landed. `023` (prop doc comments) before the `app-shell` edit (`roadmap.md` §3, "Cross-lane landings"). `022` (the test matrix) before the screen-reader files. `025` (component cost) before the cost case. None blocks the item's own build. Ranked in [`roadmap.md`](../roadmap.md) §2, 0.13.0, row `026`, wave 1, lane N.
- **Supersedes:** [`005`](./005-overlays-navigation-and-the-chat-primitives.md) decision 14, which declined a toast. Its reasons (a tab stop per toast, nested live regions, a 4 s timer) are answered here by construction, not dropped.
- **Research it stands on:** [`research/2026-11-15-toasts.md`](../research/2026-11-15-toasts.md) (cited below as *the memo*, by section). Also [the component page standard](../research/2026-11-15-component-page-standard.md) (*the standard*), [`019a`](./019a-the-fonts-own-spacing-the-glass-bar-and-depth.md) decision 3, [`022`](./022-the-test-matrix.md) decisions 11 to 15, [`025`](./025-component-cost.md) decisions 1 to 14, and the benchmark scorecard's rows 1, 2, 3 and 15. Facts read for this specification are labelled **READ (026)**; they come from this repository's `node_modules` and source on 2026-11-15. Facts the review read are labelled **READ (review)**, with the review's sources. No memo was extended: no gap blocked a decision.
- **Owner's rulings it carries** (2026-11-15, given with the brief):
  1. Toasts are in. Kuiper builds its own on `status`. No third-party toast library. This is the memo's option (b).
  2. Two announcers, one polite and one assertive.
  3. No tab stop per toast.
  4. F8 moves focus to the toast region.
  5. Success and info toasts time out, at no less than 6 s. Timers pause on hover, on focus and when the window loses focus. `timers="off"` turns timing off. This answers the memo's §5 question with option 1.
  6. Errors, action toasts and loading toasts never time out.
  7. Reduced motion is honoured. Motion is "functional or intentionally whimsical and welcoming".
  8. `<Toaster>` mounts in `app-shell`. That edit lands after `023`.
  9. Every prop gets a doc comment from birth.
  10. Transparency signifies depth. A toast is a layer above content; nothing inside it is translucent (`019a` decision 3).
  11. Letter spacing is the font's own, 0, everywhere (`019a` decision 1).
- **A note for the roadmap.** Row `026` already reads "success and info" (READ (review), `roadmap.md` line 74). Row `036` still lists `toast.info`. If the owner answers Q2 with option 1, the design lead removes `toast.info` from row `036` at landing, and `036` keeps only the `info` tone.

## Intent

A **toast** is a short message in a fixed corner, outside the page's flow, that may leave on its own. Apps need one: a save confirmed, a job finished in the background, an undo for a delete. Kuiper has none. Teams that adopt it reach for shadcn-svelte's `sonner`, which `005` declined for faults in its markup (memo §1.6).

This specification adds `toast`, Kuiper's own. A **live region** is an element whose changes a screen reader speaks without focus moving there. Two hidden live regions, called **announcers**, do all the speaking, on one shared schedule. The visible stack is never live. No toast is a tab stop; its buttons are. F8 reaches them. A toast never covers the element that has keyboard focus: it steps aside. Success and info leave after at least 6 s, and wait while the person is reading. Everything else waits to be dismissed.

It is born at the page standard's shape: every prop described, its parts marked, its keyboard and speech written as rules a test checks, its don'ts live and inert.

**Terms of art.**

- **Polite** speech waits for a pause. **Assertive** speech interrupts.
- A **landmark** is a region a screen reader can list and jump to.
- **Timed** toasts leave on their own. **Persistent** toasts wait to be dismissed.
- A toast is **showing** when it is in the visible stack. It is **waiting** when it is queued behind a full stack.
- A toast **steps aside** when it is hidden from view, still showing and still in the list's order, because its box would cover the element that has keyboard focus (decision 15a).
- A **pause cause** is one reason the timers stop: hover, focus in the region, the window losing focus, the page hidden, or a modal open.
- A **specimen** is an item drawn on a docs page for looking at: it is inert, has no role and no timer, and is never spoken.

## What the research found

- **The references agree on the contract** (memo §1, READ). Errors, warnings, actions and loading never time out. Timers pause on hover and focus. A hotkey or landmark reaches the region. No reference moves focus into a plain toast.
- **The best way to speak a toast is a separate hidden announcer** (memo §2, INFERRED). It avoids nested live regions and spoken button names. Radix speaks this way. A region must exist before its text changes, "after a short delay" (READ (review), TetraLogical, 2024-05-01). Kuiper's `status` already renders empty from the first render (memo §2, READ).
- **An assertive message may clear queued polite speech** (memo §1.4, §2, READ: Radix). So the two announcers need one schedule, not two (decision 10).
- **NVDA prefixes `role="alert"` with "alert"; VoiceOver does not** (READ (review), Roselli, "Live Region Support", 2026-01). Rules match a phrase within what is spoken, so both pass.
- **SC 2.4.11 does not accept Escape for content the person did not open.** Its Understanding page allows content "opened by the user" to obscure focus if it can be revealed without moving focus. Content "that appears without direct user initiation, such as system warnings, must not prevent the item receiving focus from being immediately visible" (READ (review), `w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html`). A toast is not opened by the person; a background job's toast plainly is not. So a toast must never cover the focused element (decision 15a).
- **SC 2.2.1 accepts a disappearing message only when the person can learn it another way, or can turn the limit off before meeting it** (READ (review), `w3.org/WAI/WCAG22/Understanding/timing-adjustable.html`). Pausing on hover and focus is not one of the criterion's options. So the item meets 2.2.1 only with the app's part (decision 5a).
- **VoiceOver drops live-region speech that coincides with a focus change.** WebKit bug 222190 reports VoiceOver on macOS skipping announcements "when they coincide with a view or focus change", with "Modal has been closed" lost on Escape as its example; reproduced on macOS 13.1 and moved, unfixed, to Apple's tracker (READ (review), `bugs.webkit.org/show_bug.cgi?id=222190`). Closing a modal moves focus to its trigger.
- **VoiceOver ignores live regions outside an `aria-modal` dialog,** while JAWS, NVDA and Narrator still read them. [w3c/aria#1854](https://github.com/w3c/aria/issues/1854) records it and is open (READ (review), with `gh api`). So holding toasts while a modal is open is right in VoiceOver and harmless elsewhere (decision 16).
- **bits-ui's modals, which Kuiper's `dialog`, `alert-dialog` and `sheet` use, set three things** (READ (026), `bits-ui` 2.20.2; confirmed by the review):
  - the content carries `aria-modal="true"` (`dist/bits/dialog/dialog.svelte.js`, line 266);
  - `body` takes `pointer-events: none` while open (`dist/internal/body-scroll-lock.svelte.js`, line 185);
  - Escape is handled by a `keydown` listener on `document`, which calls `preventDefault()` (`dist/bits/utilities/escape-layer/use-escape-layer.svelte.js`). A bubbling listener on `window` runs after it and can read `defaultPrevented`;
  - its dismissable layer listens for `pointerdown` on `document` and treats a press as outside when its target is not inside the content and the point lies outside the content's box (READ (review), `use-dismissable-layer.svelte.js` lines 247–263, `dom.js` lines 16–20).
- **Every Kuiper overlay is `z-50`, portalled to the end of `body`** (READ (026), `dialog-overlay.svelte`, `sheet-content.svelte`, `popover-content.svelte`, `tooltip-content.svelte`, `dropdown-menu-content.svelte`). An element at `z-50` earlier in `body` paints under them. The app shell's sticky header is `z-20` or `z-40`, and 64 px tall (`h-16`); `--size-bar` is 72 px. Nothing in the shell makes a stacking context (READ (026), `sidebar-provider.svelte`; READ (review)).
- **SvelteKit 3.1.0 writes each new page's title into an assertive `#svelte-announcer` in `afterNavigate`, and also runs `afterNavigate` once at hydration** (READ (026), `@sveltejs/kit/src/runtime/components/root.svelte`, lines 11–18 and 47–56). A toast spoken at the same moment as a title can be cut off. An app's `afterNavigate` also runs at hydration, with no `beforeNavigate` before it.
- **No `ui` item imports `$app/*`** (EXECUTED (026), grep). Only blocks do. So `toast` stays free of SvelteKit, and the shell wires navigation to it (decision 17).
- **The hairline is translucent.** `--border` is `#0b0f171a` light and `#f3f0e81a` dark, 10% alpha; `--input` is solid, `#857e70` and `#7a7366`; `--elevation-line` is solid and `--elevation-shadow` fully transparent (READ (026), `src/app.css` lines 27–28, 58–59, 209–210). `alert`'s tones are translucent tints (`bg-destructive/10`). So a toast reuses neither `alert`'s variants nor `border-border` (decision 13).
- **`glass` is expressive volume**, barred in a productive item by the literal lint's L22 (READ (026), `scripts/lint-literals.ts`, header). A toast is productive. It is solid, as `popover` is.
- **The motion that exists is a fade.** `animate-enter` and `animate-exit` fade over `--motion-micro` (200 ms). Under reduced motion every motion token is 0, and the theme's rule makes every animation 0.01 ms with one iteration (READ (026), `src/app.css`, lines 329–332, 413–422, 439–456). So an exit always ends in `animationend`, unless the element is hidden or the tab is in the background, when the event may never fire.
- **The design site shows an example in the page's theme inline, and in the other theme inside an iframe** of `/example/<item>/<example>/` (READ (026), `src/lib/site/page/frame.svelte`). A toast raised in that iframe needs a toaster in that document. The shell views `/view/app-shell/sidebar/` and its siblings render `src/lib/preview/app-shell-view.svelte`, the site's own copy of the layout; only `/view/app-shell/` renders the shipped `+layout.svelte` (READ (026)).
- **`api.server.ts` tables a component's props and a TypeScript file's exports**, with their doc comments (READ (026), its header).
- **Unit tests run under Bun without Svelte's compiler** (READ (026), `bunfig.toml`; confirmed by the review). So the queue is plain TypeScript with an injected clock, and the components only render it (decision 21).
- **The average adult reads 238 words a minute silently** (READ (review), Brysbaert 2019, *Journal of Memory and Language* 109, doi:10.1016/j.jml.2019.104047). A time set at that rate leaves half of readers short. Whitespace splits Chinese, Japanese and Thai badly; `Intl.Segmenter` with `granularity: "word"` splits them, in all three engines (READ (review)).
- **`025`'s harness** installs each item into a copy of the floor, renders one fixture page that imports only from the item's installed path and `svelte`, and reports size, hydration and response time. Its alone figure counts `cn` (10.9 kB gzipped) and every dependency: `button` is 20.9 kB of JS over the floor and hydrates 31 ms over it. It shows anything under 5 ms as "under 5 ms". Its cost app's lockfile holds only packages some item names (READ (026), `025` decisions 1, 2, 5, 7, 8, 9, 10 and "What the research found").

## Decisions

### 1. One item, `toast`, of six files

`src/lib/registry/ui/toast/`:

| File | What it holds | Lines (INFERRED) |
|---|---|---|
| `toast-queue.ts` | The queue: kinds, timing, pauses, steps aside, waiting, de-duplication, navigation, modal holds, and the announcers' one schedule. Plain TypeScript, no runes, no DOM. Its clock and its frame scheduler are injected. | about 300 |
| `toast-words.ts` | What an announcer says, from a toast and the strings; the word count. Pure. | about 60 |
| `toast.ts` | The app's `toast` function: one queue for the document, created on the first call in a browser; a no-op on the server. | about 60 |
| `toaster.svelte` | The region, the list, the two announcers, the keys, the pause listeners, the step-aside check, the focus rules. | about 260 |
| `toast.svelte` | One toast's card. The toaster renders it; a docs page may render it as a specimen. | about 100 |
| `index.ts` | The exports. | about 15 |

About 800 lines, twice the memo's estimate of 400. The difference is the shared schedule, the step-aside rule, the modal hold and the focus rules, which the memo named but did not size, or did not have.

`registry.json`: `"name": "toast"`, `"type": "registry:ui"`, title "Toast", description "A short message in the corner, spoken by one of two announcers, that never covers the focus; success and info leave after at least 6 s, and everything else waits to be dismissed." `registryDependencies`: `utils`, `kuiper-theme`, `status`, `button`, `spinner`. `meta`: `since` `0.13.0`, `group` `feedback`, `modes` `["productive"]`. The build derives one package, `phosphor-svelte@^3.1.1`, from the icon imports.

### 2. The API: one function with a method per kind

```ts
toast(title, options?)              // info
toast.info(title, options?)
toast.success(title, options?)
toast.caution(title, options?)
toast.error(title, options?)
toast.loading(title, options?)
toast.promise(promise, { loading, success, error }, options?)
toast.dismiss(id?)                  // one toast, or every toast
toast.navigating()                  // call in beforeNavigate
toast.navigated()                   // call in afterNavigate
```

- Each raising call returns the toast's `id`, a string.
- `options`: `description` (a string), `action` (`{ label, onclick }`), `id`, `duration` (milliseconds) and `onclose(reason)`.
- `reason` is `"dismiss"` (the person: Dismiss or Escape), `"timeout"`, `"action"`, `"navigation"`, `"api"` (`toast.dismiss()`), `"replaced"` (decision 9) or `"unmount"`. `onclose` runs at most once per callback.
- `toast.promise`'s `success` and `error` are a string or a function returning one, given the value or the error.
- **Text only.** A title and a description are strings. There are no snippets and no custom components. *Why:* what an announcer says is built from the strings (decision 10). A custom component cannot be spoken correctly, and no test could check it. Sonner's `toast.custom` has no equivalent; the upgrade guide says so.
- **One action at most.** Atlassian allows two links; Radix one action (memo §1.2, §1.4). One keeps the hint short and the Tab path to two stops per toast.
- **No `toast.update`.** Raising with an `id` that is showing or waiting updates it in place (decision 9). One way to do it.
- **Kind names.** `caution`, not `warning`, as `alert` names it. The spoken word is "Warning" (decision 10).

### 3. The `Toaster` props

| Prop | Type | Default | Doc comment, in short |
|---|---|---|---|
| `hotkey` | `string` | `"F8"` | The `KeyboardEvent.key` that moves focus to the list and back. Pressed without Ctrl, Alt or Meta. |
| `max` | `number` | `3` | How many show at once from 640 px wide; below that, one. An integer, 1 or more. |
| `timers` | `"on" \| "off"` | `"on"` | `"off"`: nothing times out. Bind it to a setting the person can reach before the first toast, such as "Keep notifications until I dismiss them". Without that setting, every timed toast must repeat something the page shows (WCAG 2.2.1). |
| `strings` | `Partial<ToasterStrings>` | English | Every word the toaster says or shows, for translation (decision 10). |
| `class` | `string` | — | Classes for the region. |

Each prop carries its doc comment from birth, as `023` requires of every item. `toast` joins `023`'s described list when it lands, with 0 empty rows.

`Toast`, the card, takes `kind`, `title`, `description`, `action`, `ondismiss`, `titleId`, `strings` and `as` (`"li"`, the default, or `"div"`), each described. Its own doc comment says: "One toast, as the toaster draws it. Rendered alone it is a specimen: render it inside `inert`, with no role, no timer, never spoken. In an app, call `toast()`."

`index.ts` exports `toast`, `Toaster`, `Toast`, the types `ToastKind`, `ToastOptions`, `ToastAction`, `ToastCloseReason` and `ToasterStrings`, and the constants `TOAST_MIN_MS`, `TOAST_MS_PER_WORD`, `TOAST_PROMISE_GRACE_MS`, `TOAST_ROUTE_HOLD_MS` and `TOAST_MODAL_HOLD_MS`.

### 4. Five kinds, and which are timed

| Kind | Call | Timed? | Announcer | Icon (Phosphor) | Spoken word |
|---|---|---|---|---|---|
| `info` | `toast()`, `toast.info()` | yes | polite | `Info` | none |
| `success` | `toast.success()` | yes | polite | `CheckCircle` | "Success" |
| `caution` | `toast.caution()` | no | polite | `Warning` | "Warning" |
| `error` | `toast.error()` | no | assertive | `WarningCircle` | "Error" |
| `loading` | `toast.loading()`, `toast.promise()` | no | polite | `Spinner`, decorative | none |

Dismiss carries a sixth icon, `X`.

- Any toast with an `action` is persistent, whatever its kind. (Owner, ruling 6.)
- `caution` is persistent. The owner's ruling names only success and info as timed (ruling 5). Atlassian and the memo also keep warnings (memo §1.2, §4.2). Q5 asks the owner to confirm.
- **There is no separate "default" kind.** `toast()` is `info`. The memo's `default` and `info` differed only in icon. One fewer kind to style, speak and test.
- **`info` ships now, drawn in the neutral tone** (decision 13). `036` adds an `info` colour token and gives `info` its tone without an interface change. The roadmap put `toast.info` in `036` because the tone was missing; the call does not need the tone (Q2).

### 5. Timing

- A timed toast's time is `max(TOAST_MIN_MS, 2000 + TOAST_MS_PER_WORD × words)` milliseconds. `TOAST_MIN_MS` is 6000. `TOAST_MS_PER_WORD` is 300: 200 words a minute, below the average adult's 238 (Brysbaert 2019, READ (review)), so slower readers have time too. The slope is INFERRED; the guarantee is `timers="off"` (decision 5a). So up to 13 words is 6 s, and 30 words is 11 s.
- **Words are counted with `Intl.Segmenter`** (`granularity: "word"`, segments with `isWordLike`), over the title and the description, in the page's language. The queue has no DOM, so the toaster passes the language in: it reads `document.documentElement.lang` on mount, and again whenever that attribute changes (a `MutationObserver` on `<html>`'s `lang`), and calls the queue's `setLang`. With no `lang`, the default locale counts. Where `Intl.Segmenter` is missing, whitespace splits. So a Japanese sentence of 40 characters counts as its words, not as one.
- **`duration`** lengthens a timed toast and never shortens it:
  - a finite number from 0 to 2³¹ − 1: the time is `max(computed, duration)`;
  - `Infinity`, or a number above 2³¹ − 1: the toast is persistent. `sonner` keeps a toast with `duration: Infinity`, and an app moving from it keeps that meaning. A larger number would otherwise overflow the timer's 32-bit delay and fire at once;
  - `NaN` or a negative number: ignored, with a development warning;
  - on a persistent toast, any `duration` is ignored, and a development warning says so.
- The clock runs only while the toast is showing, not stepped aside, and no pause cause holds. A waiting toast's clock has not started.
- **Pause causes** (owner, ruling 5; memo §4.2): the pointer over the region; focus inside it; the window losing focus (`blur`); the page hidden (`visibilitychange`); a modal open (decision 16). Each is counted on its own. Timers resume when none holds, with each toast's remaining time kept.
- `timers="off"` stops every clock. Back to `"on"`, each resumes with its remaining time.
- The constants are behaviour, not tokens, so they are exported TypeScript, not theme variables (memo §4.4).

### 5a. Timing and SC 2.2.1: the app's part is a must

The owner's ruling 5 sets the default: timers on. The item alone does not meet SC 2.2.1 for every message. A timed toast conforms only when one of these holds:

1. the message is also on the page (the saved row shows "Saved"; the archived project moves to Archived); or
2. the app binds `timers` to a setting the person can reach before the first toast, such as "Keep notifications until I dismiss them".

So:

- The page's "Your part" states this as a must, not advice (decision 22).
- "What Kuiper provides" says "timed toasts pause, and `timers="off"` turns them off; they meet 2.2.1 with your part".
- The `result` pair's "do" carries the rule: the result is also on the page.
- `app-shell`'s comment block names the setting and the line that binds it (decision 23). A later spec may add the switch to the `settings` block; this one does not.
- The changelog bullet says it (decision 26).

Only wording changes. The default stays the owner's.

### 6. The stack: newest first, `max` showing, the rest waiting

- The stack sits at the top end. The newest toast is at the top, nearest the corner. Order is the order raised, for every kind. *Why not persistent toasts below timed ones, as the memo suggested:* the list's order is what a screen reader walks, and an order that is not chronological is hard to follow. Atlassian's rule against mixing dismissible and persistent toasts does not apply: every Kuiper toast has Dismiss.
- At most `max` show, 3 by default, from 640 px wide. **Below 640 px, one shows.** Three toasts at 320 px cover most of a phone's screen. Spectrum shows one by default everywhere (memo §1.2). Q3 asks the owner.
- The rest wait, in order. A waiting toast is not spoken, and its clock has not started. It is spoken when it shows.
- While toasts wait or step aside, a line under the list says how many: "2 more", "1 hidden", or both (decision 15a). It is plain text, `data-slot="toaster-more"`, not live and not a button.
- **An error does not wait behind a timed toast.** If the stack is full and an error is raised, the oldest showing timed toast that **holds neither focus nor the pointer** returns to the head of the queue, its remaining time kept, and the error takes its place. It is not spoken again when it returns. If no showing toast qualifies, the error waits at the head of the queue, ahead of every other kind. Zag gives errors the same priority (memo §1.5).
- **A toast that holds focus or the pointer never leaves the stack except by closing.** When `max` falls (the window narrows below 640 px), the toasts that go back to the queue are the oldest that hold neither. If every showing toast holds one, the stack keeps them over `max` until focus and the pointer leave; then it shrinks.

### 7. Placement

- **Top end.** `fixed`, 16 px in from the top and the end, 24rem wide (`w-sm`, the container scale `popover` and `sheet` already use). Below 640 px, the full width less 16 px each side, inside the top safe area.
- **Under a declared bar.** When the page has a `[data-sticky-bar]`, the stack's top is `--size-bar` plus 16 px, 88 px, so it never covers the bar (`019` decision 5's declaration). The app shell's sticky header is 64 px, under `--size-bar`'s 72, so in the shell the stack sits 24 px below the header. That is the same allowance the shell's scroll padding makes, and it is harmless.
- **One position.** No `position` prop. *Why:* the top keeps clear of the chat composer and the phone's on-screen keyboard (memo §4.2); the region follows the skip link in the DOM, so the top matches its reading order; and each extra position is a set of tests in three engines. A prop can be added later without breaking an app. Q1 asks the owner.
- Logical properties only (`end-4`, never `right-4`), so `051`'s right-to-left work finds nothing to change.
- **A trapped `fixed`.** An ancestor with any of these makes `fixed` relative to that ancestor and traps the region's layer inside it: `transform`, `translate`, `rotate` or `scale` other than `none` (Tailwind 4's `translate-*`, `rotate-*` and `scale-*` set the last three, not `transform`); `filter` or `backdrop-filter` other than `none`; `perspective` other than `none`; `contain` of `paint`, `layout`, `strict` or `content`; `container-type` other than `normal` (Tailwind's `@container`); `content-visibility: auto`; or `will-change` naming any of them. The shell has none. On mount, in development, the toaster walks its ancestors and warns, naming the first that traps it. "Your part" says to mount the toaster outside any such element. The walk is a pure function over computed-style records (`findTrap`), so it is unit-tested.

### 8. Layer and depth: under modals, above content

- The region is `z-50`, the overlays' own value, rendered where the toaster is mounted, near the top of `body`. Kuiper's overlays are also `z-50` and portalled to the end of `body`, so each paints above it. A native `<dialog>` opened modally is in the top layer, also above it. No new `z-index`.
- **Not `popover="manual"`, as the memo suggested** (memo §4.1). The top layer would put toasts above a modal and its scrim. A toast is still a DOM child of `body`, so it inherits `pointer-events: none` while the modal is open, and a press on it falls through to the scrim. Either way the press lands outside the modal's content, and bits-ui's dismissable layer closes the modal (READ (review)). A modal is the topmost layer; its feedback belongs inside it (Primer, memo §1.3). So toasts sit under it.
- **Depth, by `019a` decision 3.** The toast is the layer. Its surface is solid: `bg-popover`, `text-popover-foreground`, `shadow-elevation`, the case radius, as `popover` is. `shadow-elevation`'s ring is the solid `--elevation-line`; its drop shadow is the fully transparent `--elevation-shadow`. Nothing inside the toast has a fill or border with alpha strictly between 0 and 1, a backdrop filter, or opacity below 1. The kind's colour is on its icon and a solid start edge, never a tint (decision 13).
- A step aside uses `visibility: hidden`, never opacity (decision 15a).

### 9. De-duplication and updates

- **By `id`.** Raising with the `id` of a showing or waiting toast replaces its kind, title, description and action in place. It keeps its place in the stack.
  - A timed toast's clock restarts at the update, with the new text's time.
  - A loading toast that becomes `success` starts its clock then; one that becomes `error` stays.
  - **`onclose` on an update:** if the update passes an `onclose`, it replaces the old one, and the old one runs once, at once, with reason `"replaced"`. If the update passes none, the old one is kept. If it passes the same function again (the same reference, as when an app re-raises with one options object), it is kept, and nothing runs as `"replaced"`. So every distinct `onclose` an app passes runs exactly once.
  - The update is spoken (decision 10), with one exception: **a loading toast's update that stays `loading` is silent.** A progress count ("Uploading 3 of 10") would otherwise speak on every step.
- **By content, only for plain toasts.** Raising a toast whose kind, title and description equal a showing or waiting toast's, without an `id`, does not add a copy, **if neither toast has an `action` or an `onclose`.** The existing toast's clock restarts, and, if it is showing, it is spoken again. The repeat is real news: the thing happened again.
- **A toast with an `action` or an `onclose` is never merged by content.** Two deletes raise two "Message deleted" toasts, each with its own Undo and its own `onclose`. *Why:* the action and the callback belong to one event. Merging them restores the wrong message, or never commits a delete.
- An `id` that is neither showing nor waiting raises a new toast with that `id`.
- **Inside `toast.promise`,** the loading toast and its result are one toast. The promise's `onclose` belongs to the result and runs once, when the result closes. Replacing the loading toast with the result is not a `"replaced"`.

### 10. What the announcers say, and their one schedule

- **Two announcers, mounted with the toaster and rendered empty on the server** (owner, ruling 2). The polite one is Kuiper's `Status`, with `data-slot="toaster-status"`. The assertive one is a sibling `div`, `data-slot="toaster-alert"`, `role="alert"`, `aria-live="assertive"`, `aria-atomic="true"`, visually hidden. Errors go to the assertive one; every other kind to the polite one.
- **The words**, built by `toast-words.ts`:
  - the kind's word and a colon, if it has one: "Error: ", "Warning: ", "Success: ";
  - the title, with a full stop added unless it ends in `.`, `!`, `?` or `…`;
  - the description, if any, with the same rule;
  - for an action, the hint: "Press F8, or go to Notifications, to reach Undo." It names the toaster's `hotkey`, the region's name and the action's label. The region's name is there because F8 is a media key on a Mac laptop unless Fn is held, so the key alone can mislead (Q6b).
  - Examples: "Error: Couldn't save. Check your connection." "Message deleted. Press F8, or go to Notifications, to reach Undo." "Saving…"
- **Never spoken:** "Dismiss", the action's label outside the hint, a waiting toast, the "more" line, a step aside, and a loading toast that a fast promise skipped (decision 11).
- **One schedule for both announcers**, in `toast-queue.ts`:
  - the first write waits two animation frames after the announcers are in the document, so a toaster mounted in the browser still has its regions ready before their text changes (memo §2; TetraLogical's "short delay");
  - a message is written one frame after its toast shows, or after a hold ends (decisions 16, 17);
  - it stays 1000 ms, then its region is cleared. An empty region is silent. Radix holds its announcement as long (memo §1.4);
  - **within a channel,** messages go in order; the next waits for the clear, then one frame;
  - **across channels:** an assertive message is written at once, even while a polite one is held, because an error should interrupt. While an assertive message is held, polite writes wait. A polite message written less than 1000 ms before an assertive one is written again, once, one frame after the assertive one clears, because the interruption may have flushed it;
  - a repeat of the text in its region is cleared first, then written a frame later, so it is spoken again.
- **The strings** (`ToasterStrings`, all replaceable): `region` "Notifications", `list` "Newest first", `dismiss` "Dismiss", `success` "Success", `caution` "Warning", `error` "Error", `more(n)` "`n` more", `hidden(n)` "`n` hidden", `reach(action, key, region)` "Press `key`, or go to `region`, to reach `action`." `052`'s translatable-strings policy finds them already in one prop.
- *Why the kind words:* the icon carries the kind for sighted people; the word carries it for everyone else. "Warning" and "Error" are the words screen-reader users know, as GOV.UK's hidden prefixes use them. NVDA may also say "alert" before an assertive message (READ (review), Roselli 2026); the rules match a phrase within what is spoken, so both readers pass (decision 20).

### 11. `toast.promise`

- If the promise settles within 400 ms (`TOAST_PROMISE_GRACE_MS`), no loading toast shows and nothing is said about loading. Only the result is raised and spoken. No flash, no double speech.
- Otherwise a loading toast shows at 400 ms. When the promise settles, the result replaces it in place, by its `id`, and is spoken.
- Dismissing the loading toast hides it. The result still comes, as a new toast, carrying the promise's `onclose` (decision 9).
- The result's kind is `success` or `error`. A rejected promise is an error, so it stays.
- `toast.promise` returns the `id`. It never swallows the rejection: the app's own `catch` still runs.

### 12. Anatomy

| # | Part | Slot | Required | What it is |
|---|---|---|---|---|
| 1 | Region | `toaster` | while a toast shows | A `section`, named by `strings.region`, with `aria-keyshortcuts` set to the hotkey. Rendered only while it holds a toast. A landmark. |
| 2 | List | `toaster-list` | with the region | An `ol`, `tabindex="-1"`, named by `strings.list` ("Newest first"), so a reader does not hear "Notifications" twice on F8. F8's target. |
| 3 | Toast | `toast` | yes | An `li` (or a `div` for a specimen with `as="div"`). No role, no `tabindex`, no `aria-live`. `data-kind` names its kind; `data-toast-id` its `id`; `data-aside` is present while it steps aside. |
| 4 | Icon | `toast-icon` | yes | The kind's icon, `aria-hidden`. The spinner for `loading`, decorative. |
| 5 | Kind word | `toast-kind` | for success, caution and error | Visually hidden: "Error: ". So a reader walking the list hears the kind. |
| 6 | Title | `toast-title` | yes | `font-medium`, `text-sm`. Its id names the Dismiss button's description. |
| 7 | Description | `toast-description` | no | `text-sm`, `text-muted-foreground`. |
| 8 | Action | `toast-action` | no | Kuiper's `Button`, `variant="secondary"`, `size="sm"` (32 px). |
| 9 | Dismiss | `toast-close` | yes | Kuiper's `Button`, `variant="ghost"`, `size="icon-sm"` (32 px), the `X` icon. Named "Dismiss", described by the title. |
| 10 | More | `toaster-more` | while toasts wait or step aside | "2 more", "1 hidden". Plain text under the list. |
| 11 | Polite announcer | `toaster-status` | always | A `Status`. Visually hidden. Outside the region. |
| 12 | Assertive announcer | `toaster-alert` | always | `role="alert"`. Visually hidden. Outside the region. |

Layout of a toast: a grid of three columns, icon, text, Dismiss. The action sits under the text, in the text's column. 12 px of padding, 8 px between toasts. All from the spacing ladder.

### 13. The look of each kind

- Every kind has the same solid surface (decision 8).
- **The edge, by class.** Every side is a 1 px `border-transparent`, fully transparent, which forced colours draw (decision 14). The start side is `border-s-(length:--focus-width)` in a solid colour: `success` `border-s-success`; `caution` `border-s-caution`; `error` `border-s-destructive`; `info` and `loading` `border-s-input`. Never `border-border`, the 10% hairline `019a` removed from the bar. The visible outline is `shadow-elevation`'s solid ring.
- **The icon:** `success` `text-success`; `caution` `text-caution-text` (`--caution` is a fill; `--caution-text` is the yellow for text); `error` `text-destructive`; `info` and `loading` `text-muted-foreground`.
- Each icon reaches 3:1 against the surface, and each text 4.5:1, in both schemes. The review measured them on `--popover`: light 5.88, 5.73, 6.00 and 7.38; dark 7.70, 11.79, 7.74 and 6.09 (EXECUTED (review)). Test 65 holds them.
- No letter spacing is set (ruling 11). No `dark:` class (the literal lint's L2).

### 14. Forced colours

- Under `forced-colors: active`, border colours are forced to a system colour. The transparent border becomes a visible edge, which is the point. The start edge loses its kind's colour.
- So the kind rests on two things: the icon's shape (`Info`, `CheckCircle`, `Warning`, `WarningCircle` and `Spinner` each differ) and the hidden kind word, which a reader speaks. The icons take `CanvasText`.
- That is enough for the item to be legible and its kind told apart. `028` then checks it with every item. Test 67 checks it now: the edge is drawn, and each kind's icon differs from every other's.

### 15. Keyboard and focus

| Key | Where focus is | What happens |
|---|---|---|
| F8 | anywhere outside the region, a toast showing, no modal open | Focus moves to the list. The element it left is remembered. Timers pause. Toasts that had stepped aside return to view, since focus is now in the region. |
| F8 | in the region | Focus returns to the remembered element. |
| Tab, Shift+Tab | in the region | Through each toast's action, then its Dismiss, newest first. Entered by F8: past the last stop, or before the first, focus returns to the remembered element. Entered by Tab: the page's own order continues. |
| Enter, Space | an action | The action's `onclick` runs. The toast closes, reason `"action"`. Focus moves on. |
| Enter, Space | Dismiss | The toast closes, reason `"dismiss"`. Focus moves on. |
| Escape | a control in a toast | That toast closes, reason `"dismiss"`. Focus moves on. |
| Escape | the list itself | Focus returns to the remembered element. Nothing closes. |
| Escape | outside the region | Nothing, from the toaster (Q4). Another layer's Escape works as before. |

- **No tab stop per toast** (owner, ruling 3). An `li` has no `tabindex`. Only its buttons are stops.
- **The hotkey** is read on `window`, `keydown`, without Ctrl, Alt or Meta. When it acts it calls `preventDefault()`. It does nothing while a modal is open, or with no toast showing. On a Mac laptop F8 is a media key unless Fn is held. So the region is also a landmark, the spoken hint names it, and it follows the skip link in the DOM, where Tab from the top of the page reaches it (Q6a, Q6b).
- **Focus moves on**, whenever a toast holding focus leaves the list, by any way: closed by the person, by `toast.dismiss()`, by a navigation (decision 17) or by the toaster's unmount. Focus goes:
  1. to the same control in the toast that took its place;
  2. else to the same control in the toast above;
  3. else, if the region is now empty, to the remembered element, if it is still in the document;
  4. else to `#main`, if the page has one;
  5. else to `body`.
  On unmount, steps 1 and 2 do not apply. On a navigation, SvelteKit usually resets focus before `afterNavigate` runs, so a closing toast seldom still holds it; if one does, the rule applies.
- **Displacement and a smaller `max` never take a focused toast** (decision 6), so they need no rule.
- **The remembered element** is set on F8, or on the first `focusin` from outside the region. It is forgotten when focus leaves the region.

### 15a. A toast never covers the focused element: it steps aside

SC 2.4.11 does not accept Escape for a toast, which the person did not open (READ (review), the Understanding page). So:

- **Only keyboard focus.** The check applies only while the focused element is outside the region and matches `:focus-visible`. SC 2.4.11 concerns keyboard focus. Chromium and Firefox focus a button when it is clicked, but a click does not match `:focus-visible`, so a pointer press on a "Save" under the stack never hides the toast it raised.
- **When it checks.** At once on `focusin` and after each change to the stack; then **once a frame** for as long as a toast shows and the focused element is outside the region and matches `:focus-visible`. Each check reads the focused element's box and each showing toast's box with `getBoundingClientRect`. *Why a frame loop, not listeners:* `scroll` does not bubble, so a listener on `window` never hears an `overflow: auto` panel (the sidebar inset, a code block, a table) scroll the focused element under the stack; and nothing fires when content above it grows (a late image, an accordion, streamed chat text) and pushes it under. A check each frame catches both, and also covers `resize` and zoom. It runs only while all three conditions hold, so a page with no toast, or a pointer user, pays nothing. The loop's cost is measured by `025`'s `toast.burst` case.
- **A toast whose box overlaps the focused element's box at all steps aside.** That is stricter than the criterion's "entirely hidden", and simpler to test.
- **Stepping aside:** the toast takes `data-aside` and `visibility: hidden`. It keeps its place in the list and in the queue. Its clock stops. It is not dismissed, not spoken, and not made translucent. Its buttons leave the Tab order while it is hidden, which `visibility: hidden` does.
- When focus moves to an element it does not overlap, or into the region, or stops matching `:focus-visible`, it returns to view and its clock resumes with its time kept.
- A toast that first shows while keyboard focus is under it shows stepped aside. Its words are still spoken, so a screen-reader user learns of it at once, and F8 brings it into view.
- **The remaining case** (Q4, Risks): a keyboard user who presses Enter on a "Save" at the top end, directly under the stack, keeps focus there, and its success toast shows stepped aside. A sighted keyboard user sees nothing but the count below, until focus moves. Q4's option 3, the stack moving to the bottom end, hides nothing, at the cost of moving every toast.
- **The count line** counts toasts aside as well as waiting ones: "1 hidden", "2 more", or "2 more, 1 hidden" (`strings.hidden(n)` beside `strings.more(n)`). It steps aside by the same rule. It is plain text, not live: the announcer has already spoken the toast.
- **The pointer and an aside toast.** A toast under the pointer can step aside, when keyboard focus moves under it. `visibility: hidden` drops it from hit-testing, but no `pointerleave` fires until the pointer moves, so the hover pause may hold every clock until then. That errs toward more time, and is harmless.
- Displacement (decision 6) may send an aside toast back to the queue, with its time kept, unless the pointer still holds it. An aside toast never holds focus, since it steps aside only for focus outside the region.
- *Why hide, not move the stack:* moving the stack to the bottom end moves every toast for one covered element, and the bottom has the composer and the keyboard (decision 7). Q4 offers it as option 3.
- **Escape outside the region closes nothing** from the toaster. The step aside already reveals the focus; Escape closing toasts the person may not have read buys nothing. Q4 offers it as option 2.

### 16. Modals hold new toasts

- A modal is open when the document holds `[aria-modal="true"]` or `dialog:modal`.
- While one is open:
  - a new toast waits. It is not shown or spoken;
  - showing toasts stay, paused, under the modal's scrim (decision 8);
  - F8 does nothing.
- **When the last modal closes,** the waiting toasts show at once, in order. Their speech waits `TOAST_MODAL_HOLD_MS`, 1000 ms (INFERRED; the run tunes it), for both channels, then follows the one schedule. *Why:* closing a modal moves focus back to its trigger, and VoiceOver drops live-region speech that coincides with a focus change (WebKit bug 222190, READ (review)).
- **When a modal closes on a navigation** (the phone sidebar's sheet, closed by its link), the modal hold and the route hold (decision 17) overlap. Each channel waits for the later of the two ends.
- Detection: checked at each raise, and by a `MutationObserver` on `body`'s children (where bits-ui portals land) and on the `aria-modal` and `open` attributes in the subtree. A modal rendered inline, without a portal, is caught at the next raise. "Your part" on the page says so.
- *Why hold, not show beneath:* VoiceOver does not read a live region outside an `aria-modal` dialog, while JAWS, NVDA and Narrator do ([w3c/aria#1854](https://github.com/w3c/aria/issues/1854), open, READ (review)). Holding makes the toast's speech certain in every reader. A dialog's own result belongs inside the dialog; the toast that follows its close ("Project deleted") is the case this serves. Q7 asks the owner.

### 17. Navigation

- `toast.navigating()` holds every announcer write. `toast.navigated()` releases them: polite writes two frames later, so they follow SvelteKit's title; assertive writes 1500 ms later (`TOAST_ROUTE_HOLD_MS`), so an error does not cut the title off. A hold with no `navigated()` within 3000 ms releases itself, so a cancelled navigation cannot silence the toaster. If a modal hold (decision 16) is also running, the later end wins.
- **`navigated()` without a pending `navigating()` does nothing.** SvelteKit runs `afterNavigate` once at hydration, with no `beforeNavigate` before it (READ (026), `root.svelte` lines 11–18). A toast raised on mount ("Welcome back") is then not counted as having survived a navigation.
- **A timed toast survives one navigation.** "Project created", raised before a redirect, shows and is spoken on the next page (memo §4.2). On the navigation after that, every success and info toast that has already survived one closes, reason `"navigation"`.
- **Errors, cautions, loading toasts and action toasts stay across navigations** until dismissed. *Why:* the owner's ruling 6 says actions never time out, and closing an Undo on a navigation would end its window without the person's act, and commit the delete in the `action` example. Caution follows error (decision 4). Q8 asks the owner to confirm.
- The item never imports `$app/*`. The app wires it. `app-shell` does, in its layout (decision 23):

  ```svelte
  beforeNavigate(() => toast.navigating());
  afterNavigate(() => toast.navigated());
  ```

  An app without the shell adds the two lines to its root layout. Without them, toasts still work; they only do not hold their speech for the title or close on later pages.

### 18. Server safety

- On the server, every `toast.*` call returns `""` and does nothing. The queue is created only in a browser (`typeof document !== "undefined"`), on the first call. So no module-level state is ever shared between requests.
- `toast.ts`, `toast-queue.ts` and `toast-words.ts` touch no DOM at import. The toaster touches the DOM only in `onMount` and effects.
- The toaster's server HTML is the two announcers, empty, and no region. Hydration adds nothing until a toast shows.
- **Before a toaster mounts,** toasts raised in the browser wait in the queue. Svelte runs a child's `onMount` before its layout's, so a page that raises a toast on mount would otherwise lose it. The toaster shows them on mount, after the two-frame wait.
- **One toaster per document.** A second mounted toaster renders nothing and logs a development warning. When the toaster unmounts, every toast closes, reason `"unmount"`.

### 19. Motion

- A toast fades in with `animate-enter` and out with `animate-exit`, over `--motion-micro`, the motion every Kuiper overlay already uses. It is functional: it says something arrived or left, and is quick. *Why not a slide now:* a slide needs a keyframe in the theme (lane T, `021`'s in wave 1), and `039` designs slides for sheets, drawers and toasts together. `039` adds it.
- **On exit**, the toast takes `data-state="closed"`. It is removed on `animationend`, or by a fallback timer, whichever comes first. The fallback is the toast's computed `animation-duration` plus one frame. *Why the fallback:* `animationend` may never fire in a background tab, or under an ancestor set to `display: none`, and a toast must not stay in the list. Under reduced motion the theme's rule makes the animation 0.01 ms, so the event, or the fallback, comes at once.
- Under reduced motion, every motion token is 0. The loading spinner turns once and stops (SC 2.2.2). No toast moves.
- No whimsy. This is a productive item; welcome is the expressive mode's job.

### 20. Screen-reader behaviour, and the scripted run

**What each reader should say** (INFERRED; the run confirms or corrects the wording, and the rules match phrases, never whole logs, as `022` decision 12 requires):

| Moment | VoiceOver (macOS 26, WebKit and Chromium) | NVDA 2026.3 (Chromium and Firefox) |
|---|---|---|
| `toast.success("Project saved")` | "Success: Project saved." | "Success: Project saved." |
| `toast.error("Couldn't save", { description: "Check your connection." })` | "Error: Couldn't save. Check your connection.", interrupting | "alert Error: Couldn't save. Check your connection.", interrupting |
| A success and an error in one task | the error, then the success; the success may be heard twice | the same |
| An action toast | "Message deleted. Press F8, or go to Notifications, to reach Undo." | the same |
| F8 | "Newest first, list, 2 items", inside "Notifications" | "Notifications, region, Newest first, list with 2 items" |
| Tab to Dismiss | "Dismiss, button, Project saved" | "Dismiss, button, Project saved" |
| Escape on the last toast | the remembered button's name | the same |
| Never | "Dismiss" on arrival; "Saving…" for a promise that settled within 400 ms; a waiting toast | the same |

**Two files.**

- `tests/sr/toast.sr.ts`, in `022`'s suite, annotated `item: toast`. `SR_ITEMS` gains `toast` with kinds `live` and `focus`. `sr-items.test.ts` would demand it anyway: `toast` imports `Status`.
- `tests/sr/app-shell.sr.ts` gains one test, A1, annotated `item: app-shell`, `check: live`. `app-shell`'s entry in `SR_ITEMS` gains `live`. A1 runs on a new shell view, `src/routes/(shell)/view/app-shell/toast/+page.svelte`, which renders the shipped `+layout.svelte` around one button, "Save", that calls `toast.success("Project saved")`. Its announcers are rendered on the server. The shipped layout ships `SIDEBAR = false` and `STICKY = false`, so this view has no sticky bar; that is as shipped, and the view does not change it.
  - **It is a test surface, not a block's view.** `tests/unit/blocks.test.ts` line 252's guard ("0 other `+page.svelte` files under `src/routes/(view)/view/` or `src/routes/(shell)/view/`, but 013's test view") gains this file in its exception set, with the reason "026 decision 20: a test surface for A1, not a block's view", as 013 decision 21's `code-agreement` is listed. It stays out of `views`, so it is no block variant, no thumbnail and no sitemap entry. So A1 hears the path most apps run, and the `/example/toast/…` tests hear the path a toaster mounted in the browser runs.

The scripted set is one item more than `022`'s own (28 files there, so 29 with `toast`).

**Each test carries `022`'s three annotations,** `item`, `rules` (its fault ids, L1 to L4) and `hears`. `hears` names what the test listens to, finer than an item, so `022`'s derivation of the mutation's expected set comes out right (R4 of the review):

- `toast:assertive`: the assertive announcer, `toaster-alert`;
- `toast:polite`: the polite announcer, `toaster-status`;
- `toast:focus`: the region's focus behaviour.

A test's `hears` lists only the targets it judges. A test that judges no toast speech hears none of them. **What `022` must allow:** a `hears` target and a patch target of the form `<item>:<part>`, where a patch on `<item>:<part>` reaches a test whose `hears` holds `<item>:<part>` or the bare `<item>`. The design lead passes this to `022`'s author; it is the form 026 needs.

| Test | Page | Action | Rule | `hears` |
|---|---|---|---|---|
| S1 polite | `/example/toast/raise/` | Activate "Save" | `live`: "Success: Project saved." spoken whole, once, not before | `toast:polite` |
| S2 assertive | `/example/toast/raise/` | Activate "Save with an error" | `live`: "Error: Couldn't save. Check your connection." spoken whole | `toast:assertive` |
| S3 not the buttons | `/example/toast/action/` | Activate "Delete message" | `live` for "Message deleted. Press F8, or go to Notifications, to reach Undo."; `unspoken`: no phrase holds "Dismiss" | `toast:polite` |
| S4 repeat | `/example/toast/raise/` | "Save" twice, 3 s apart | `live`, with the promised repeat (L4 in place of L3): spoken twice | `toast:polite` |
| S5 F8 | `/example/toast/keyboard/` | Raise two, press F8 | `focus`: "Newest first" spoken | `toast:focus` |
| S6 Escape | `/example/toast/keyboard/` | F8, Tab, Escape twice | `focus`: the trigger's name spoken | `toast:focus` |
| S7 fast promise | `/example/toast/promise/` | Activate "Save quickly" | `unspoken`: "Saving"; `live`: "Success: Saved." | `toast:polite` |
| S8 after the title | `/example/toast/route/` | Activate "Create project" | `before`: the page title, whole, before "Success: Project created." | `toast:polite` |
| S9 a modal holds | `/example/toast/from-a-dialog/` | Confirm in the dialog | `before`: the trigger's name (focus returned), before "Success: Project deleted."; `live`: that phrase spoken whole | `toast:polite`, `alert-dialog` |
| S10 both channels | `/example/toast/raise/` | Activate "Save two records" (one succeeds, one fails, in one task) | `live` for "Error: Couldn't save Record B.", spoken whole; `live` for "Success: Record A saved.", spoken whole, with the repeat declared as promised (L4 in place of L3, for the success phrase only), since the rewrite of decision 10 may make it heard twice in a row | `toast:assertive`, `toast:polite` |
| A1 the shell | `/view/app-shell/toast/` | Activate "Save" | `live`: "Success: Project saved." spoken whole, once | `toast:polite` |

**Two rules join `tests/sr/rules.ts`**, each unit-tested in `sr-rules.test.ts` with VoiceOver and NVDA wordings, as `022` test 4 requires of the others:

- `unspoken(log, phrase)`: a fault for each spoken phrase that holds `phrase`.
- `before(log, first, then)`: a fault unless `first` is spoken whole and ends before `then` begins.

**One mutation joins `tests/sr/mutations/`, chosen so its effect is certain:** `toast-alert`, which removes `role="alert"` and `aria-live` from `toaster-alert`. A `div` without a live role or `aria-live` is spoken by no reader when its text changes. Its row in `022`'s patch table:

| Patch | File | Target | Fault |
|---|---|---|---|
| `toast-alert` | `src/lib/registry/ui/toast/toaster.svelte` | `toast:assertive` | L1 |

`022`'s derivation then expects a failure from every test whose `hears` holds `toast:assertive` (or the bare `toast`) and whose `rules` hold L1: exactly S2 and S10, under both readers and all four browser pairings. No toast test hears the bare `toast`. `expected.json` is derived, never hand-written, as `022` decision 15 requires; criterion 20 cites the derived set. `022`'s other patches reach no toast test: `alert` is not a dependency of `toast`, and S9 hears `alert-dialog`, which no patch touches.

- *Why not the fault `005` named* (an `aria-live` on the visible list), as the first draft chose: the list is rendered only while it holds a toast, so a mutated live list is inserted with its content already in it, which readers outside VoiceOver often ignore (memo §2). Where it is spoken it repeats the announcer, breaking the `live` rule in S1, S2, S4, S7, S8 and A1 too. Its expected set cannot be predicted. That fault is proven by the DOM instead: test 47 finds no live role or `aria-live` inside the region.

### 21. Tested where it lives

- The queue is a factory, `createToastQueue({ now, setTimeout, clearTimeout, frame })`. `toast.ts` binds the real clock. The unit tests bind a fake one. *Why:* Bun's runner cannot compile a rune module, and an injected clock needs no fake-timer support.
- `toast-words.ts` is pure.
- **The toaster subscribes to the queue in `onMount`,** and copies each snapshot into `$state`. On the server there is no queue to subscribe to (decision 18), and nothing to copy. The toaster holds no rules of its own beyond the DOM: listeners, focus, the step-aside check and the announcers' text.
- Browser tests drive time with Playwright's `page.clock`.

### 22. The page and its examples

**`/components/toast/`**, group Feedback, from the standard's sections as today's template has them. Its `when`, `dos`, `donts` and `accessibility` snippets are written by the design lead. The page mounts one `<Toaster>`, below `<Component>`, its `timers` bound to the setting example's switch.

**When.** A result the person can also see or does not need to keep: saved, sent, copied, a background job done. **When not:** a form's errors (use `error-summary`); something that must be acted on before going on (use `alert-dialog`); something that stays true on the page (use `alert`); a dialog's own result while it is open (put it in the dialog).

**Examples, in order** (`EXAMPLE_ORDER.toast`):

1. `kinds`: five specimens, one per kind, drawn with `Toast` inside an `ol` inside an `inert` wrapper. The stage and the thumbnail. Intro: "Drawn, not raised: a specimen is never spoken, and cannot be pressed."
2. `raise`: buttons raise info, success, caution and error toasts, and "Save two records" raises a success and an error in one task.
3. `action`: "Delete message" raises "Message deleted" with Undo. `onclose` commits the delete unless the reason is `"action"`. Deleting twice raises two toasts.
4. `promise`: "Save slowly" (1.5 s), "Save quickly" (200 ms) and "Save with an error".
5. `from-a-dialog`: an `alert-dialog` whose confirm raises "Project deleted". It shows when the dialog closes, and is spoken a second later.
6. `setting`: a `Switch`, "Keep notifications until I dismiss them", bound to the toaster's `timers`. Its state lives in a small module the page and the example view both read, shown as "your app's setting".
7. `keyboard`: raises two toasts, one with an action. Intro: "Press F8 to reach them, Tab between their buttons, Escape to dismiss one. F8 again goes back."
8. `route`: "Create project" raises a success, then navigates within the view. It shows the two navigation lines an app without `app-shell` adds.

Every live example shows the `toast` call, never a `<Toaster>`: an app mounts one, once, in its root layout. The Install section adds that line, and the `app-shell` note.

**Pairs, inert** (the standard §3, section 3; its memo's Q2, answered "yes"). Six files, `do-<pair>.svelte` and `dont-<pair>.svelte`, each with `meta.kind`, `meta.pair` and a caption of 20 words or fewer; a don't also has `meta.breaks`, the fault it shows, in words. Each renders real `Toast` specimens in an `ol` inside `inert`, do and don't alike, so the page gains no dead tab stops and no `li` outside a list:

| Pair | Do | Don't | `breaks` |
|---|---|---|---|
| `result` | "Project archived" beside a list whose row has moved to Archived. Caption: the result is also on the page | "Email address is invalid" as an error toast over a form | "A form's error far from its field. Use an error summary." |
| `words` | A five-word title and one short sentence | A 45-word toast in two paragraphs | "Too long to read in the time, and too long to hear." |
| `action` | "Message deleted" with Undo, and the message in Trash | "Couldn't sync" with Retry, the only way to retry | "The only way to do it is behind F8. Offer it on the page too." |

Until `032` builds the pictured pairs, the page renders each pair file inside its `dos` or `donts` list item, with its caption. If a current site test requires every file in an example folder to be a page example, the builder extends it to skip `do-*` and `dont-*`, the names the standard reserves. That is the one site-test edit.

**Accessibility, as bullets on the page today, and as "What Kuiper provides" and "Your part" when `030` and `032` land:**

- **Provides:** two announcers, present from the first render, on one schedule; the visible stack never live; no tab stop per toast; F8; a toast never covers the keyboard focus, it steps aside (2.4.11); the pause causes and `timers` (2.2.1, with your part); errors, cautions, actions and loading never time out; speech after the page's title and after a modal closes.
- **Your part, each a must:**
  - mount one `<Toaster>` in the root layout, outside any element with a `transform`, `filter`, `backdrop-filter`, `perspective` or `contain`;
  - meet 2.2.1: make every timed toast's message also visible on the page, or bind `timers` to a setting the person can reach before the first toast;
  - offer every action somewhere else on the page too;
  - add the two navigation lines if you do not use `app-shell`;
  - portal your own modals, or a toast raised under an inline one may show beneath it;
  - install `toast` once, at one path.

**Search:** `aliases.ts` gains "snackbar" and "notification" for `/components/toast/`. Its comment's example of a part the system lacks, "toast", changes to another, since the part now exists. The sitemap gains the page.

### 23. `app-shell` mounts the toaster

- `+layout.svelte` renders `<Toaster />` directly after `<AppShellSkipLink />`, in both the sidebar and no-sidebar shells. So the region's DOM order matches its place at the top of the page, and Tab from the skip link reaches it (memo §4.1).
- The layout calls `toast.navigating()` in `beforeNavigate` and `toast.navigated()` in `afterNavigate` (decision 17).
- `registryDependencies` gains `toast`.
- Its comment block says: one toaster per app, here; raise toasts with `toast()` from anywhere; and, for SC 2.2.1, bind `timers` to the person's setting, `<Toaster timers={keepNotifications ? "off" : "on"} />`, or keep every timed toast's message on the page too.
- No prop, slot or class of the shell changes. It is an interface change because the shell's DOM and its dependencies change.
- Lands after `023`, which writes doc comments into the same files (`roadmap.md` §3).
- **The site follows it** (lane S): `src/lib/preview/app-shell-view.svelte`, the site's copy of the layout behind `/view/app-shell/sidebar/` and its siblings, gains the same toaster and the same two lines, so every shell view matches the shipped layout. For test 61 only, the preview copy, which never ships, also sets `window.kuiperToast = toast` once mounted, so a test can raise a toast on `/view/app-shell/sidebar/`, where the sidebar and its sticky header ship. The new view `/view/app-shell/toast/` (decision 20) renders the shipped layout, without a sticky bar.

### 24. Edits outside lane N, and their order

| Edit | Lane | Lands after | Why it cannot wait |
|---|---|---|---|
| `app-shell`'s layout and registry entry (decision 23) | I | `023` | The owner's ruling 8 |
| `src/lib/preview/app-shell-view.svelte` and the new view `src/routes/(shell)/view/app-shell/toast/+page.svelte` | S | the `app-shell` edit | The shell's views match its layout; A1 needs a server-rendered toaster |
| `src/routes/(example)/example/[item]/[example]/+page.svelte` mounts one `<Toaster>` when the item is `toast`, loaded lazily so no other example's view carries it | S | nothing in wave 1 touches this file | A toast raised in the other theme's frame, or in a screen-reader run, needs a toaster in that document |
| `tests/sr/toast.sr.ts`, A1 in `tests/sr/app-shell.sr.ts`, two rules in `rules.ts`, `SR_ITEMS`, one mutation, `expected.json` | E | `022` | Constitution §4.4: an item with a live region is checked by a screen reader |
| `scripts/cost/fixtures/toast.svelte`, `toast.burst.svelte`, `toast.progress.svelte`, `toast`'s entry in `interactions.ts`, its first budget | E | `025` | `025` criterion 2: an item with an interaction needs an entry |
| Ledger files: `registry.json`, `CHANGELOG.md`, the sitemap, `src/lib/site/upgrade/0.13.0.ts`, `example-order.ts`, `aliases.ts`, `static/r/` | ledger | landing order | `roadmap.md` §2, "Ledger file" |

The item, its examples and its page build at once with everything else in wave 1. Only the cross-lane edits wait.

### 25. The cost case, in `025`'s terms

`025` measures each item alone, over the floor, in its cost app (`025` decision 1). Toast's case follows its mechanism and adds nothing to it.

- **The fixture,** `scripts/cost/fixtures/toast.svelte`, over the item app's `src/routes/+page.svelte` (`025` decision 8). It imports only from `toast`'s installed path and from `svelte`. It renders `<Toaster />` and one native `<button data-cost="target">Save</button>` whose click calls `toast.success("Saved")`. The toaster is in the page, not a root layout: the root layout is the cost app's, with its `cost:hydrated` mark.
- **The interaction,** one entry in `scripts/cost/interactions.ts` (`025` decision 9): kind `click`; target `[data-cost=target]`; the state that ends it, a `[data-slot=toast]` present and `[data-slot=toaster-status]` reading "Success: Saved."; `says` "shows", so `costFacts` gives "shows in N ms". Viewport 1280 × 800. Its figure is `025`'s response time (decision 6), under 4×; Event Timing is recorded beside it, not budgeted. With the two case entries below, the list grows from 31 entries to 34.
- **Two cases** (`025` decision 10), each a fixture of its own, each with hydration and response time budgeted and its JS reported, not budgeted:
  - `toast.burst`: the click raises 100 distinct successes in one task. The state that ends it: three `[data-slot=toast]` drawn and the "more" line reading "97 more";
  - `toast.progress`: the click applies 200 `toast.loading` updates to one `id` in one task, "Uploading 1 of 200" to "Uploading 200 of 200". The state that ends it: the toast's title reads "Uploading 200 of 200". It shows that the stack draws once, not 200 times.
  - That a loading toast's own updates are silent is a speech rule, not a cost; unit test 15 holds it.
- **What `025` must allow, for the two cases** (the design lead passes this to `025`'s author; if `025` has landed, it is a small change in lane E, landing before this spec's cost case):
  - **Keying.** A case with an interaction has its own entry in `interactions.ts`, keyed `<item>.<case>` (`toast.burst`, `toast.progress`), with the same fields as an item's (kind, target, state, viewport, `says`). An entry so keyed is valid when `<item>` is an item and `scripts/cost/fixtures/<item>.<case>.svelte` exists; `025` decision 9's "an entry needs an item" reads "an entry needs an item, or an item's case fixture". A case with no entry, such as `table.1000-rows`, is hydration only, as now.
  - **Criterion 2.** `interactions.ts` holds exactly the 31 items of decision 9's table, plus `toast` (32 item entries), plus the 2 case entries `toast.burst` and `toast.progress`: 34 entries. Each of those 34 fixtures holds exactly one `data-cost="target"`; no other fixture holds one.
  - **Criterion 1.** 76 items, 72 fixtures plus `_floor.svelte`, and three case fixtures beside them.
  - **Criterion 4.** One report entry per measured item, 72, plus three cases: `table.1000-rows`, `toast.burst` and `toast.progress`. Each case with an entry has a non-null `interaction`.
- **`app-shell`'s budget rises.** `app-shell` gains `toast` as a dependency (decision 23), so its alone size and hydration rise, by about `toast`'s own 3 to 5 kB of JS and its listeners (INFERRED). If `025` has landed with a budget for `app-shell`, the rise is over its margin, and `025` criterion 6 would fail `bun run test:unit`. So, in build step 8:
  - `bun run cost` measures `app-shell` again;
  - each of its budgets the new figure exceeds (`js` at least; `css` and `hydrateMs` if they exceed) is raised to the new figure plus `025`'s margin, rounded as `025` decision 14 says, with a `raised` record: the metric, the old and new numbers, the date, and `ruling` linking to this specification's Landing notes;
  - the Landing notes name `app-shell`, each raised metric and both numbers, and the reason: "`app-shell` now mounts `toast`" (`025` criterion 7).
  - If `025` lands after this spec, `app-shell`'s first budget already includes `toast`, and no `raised` record is needed. The landing notes say which happened.
- **No `sonner` reference figure.** Measuring it would add `svelte-sonner` and `mode-watcher` to the cost app's committed lock, though no Kuiper item names them (`025` decision 2), against this spec's "no package is added". Kuiper's own budget does not need the comparison. No owner question follows.
- **Estimates,** in `025`'s own counting (INFERRED):
  - size, alone: about 3 to 6 kB of JS above `button`'s 20.9 kB, since `toast` pulls `button` (and with it `cn`, 10.9 kB), `status`, `spinner` and six Phosphor icons. So about 24 to 27 kB of initial JS, gzipped, and about 1 to 1.5 kB of CSS. `toast`'s `own` group in the breakdown: about 3 to 5 kB;
  - hydration: within `025`'s 5 ms resolution of `button`'s 31 ms, since the fixture adds two empty `div`s and a few listeners;
  - response time: about 40 to 90 ms under 4×, below `dialog`'s 96 ms, under `025`'s 200 ms ceiling;
  - `toast.burst` and `toast.progress`: each under 200 ms, or the item is changed before landing (`025` decision 14's ceiling).
- **The budget:** `bun run cost --budget toast` writes the first, from the measurement and `025`'s margins, in this spec's build. The landing notes cite it (`025` decision 14).

### 26. The changelog and the upgrade guide

**The 0.13.0 entry gains two bullets:**

> - `toast`: new, a `registry:ui`. `toast("Saved")`, `toast.success`, `toast.info`, `toast.caution`, `toast.error`, `toast.loading` and `toast.promise` raise a short message at the top end of the page, under a declared sticky bar; `toast.dismiss` closes one or all. Mount `<Toaster />` once, in the root layout (`app-shell` does). Two hidden announcers, present from the first render and on one schedule, speak each toast: errors interrupt, the rest wait their turn, and a success raised beside an error is spoken after it. The visible stack is never live, and no toast is a tab stop; F8 moves focus to the list and back, and Escape in a toast dismisses it. A toast never covers the element that has keyboard focus: it steps aside until focus moves, and the stack's count line says "1 hidden". Success and info leave after at least 6 s, longer for longer text, and pause on hover, on focus, while the window is in the background and while a modal is open; errors, cautions, loading toasts and any toast with an action wait to be dismissed. `duration: Infinity` keeps a toast. `timers="off"` turns timing off: to meet WCAG 2.2.1, bind it to a setting the person can reach first, or keep every timed message on the page too. Three show at once (one below 640 px); errors go first. A success or info toast survives one navigation; call `toast.navigating()` and `toast.navigated()` from your root layout if you do not use `app-shell`. A toast raised while a modal is open shows when it closes. Text only: no custom components. It depends on `status`, `button` and `spinner`, and on `phosphor-svelte`.
> - `app-shell`: **interface change.** The layout mounts `<Toaster />` right after the skip link, and calls `toast.navigating()` and `toast.navigated()` in `beforeNavigate` and `afterNavigate`. It now depends on `toast`. If you moved the layout into your routes, add the import and the three lines by hand (the upgrade guide shows them). If your app mounts another toaster, such as shadcn-svelte's `sonner`, remove it, so two corners do not compete. To meet WCAG 2.2.1, bind the toaster's `timers` to a person's setting, as the layout's comment shows. No prop or class changes. Update with `add app-shell`.

**The guide** (`src/lib/site/upgrade/0.13.0.ts`) gains a section, "`026`: a toast of Kuiper's own":

- **Who sees it:** apps that use `app-shell`; apps that installed shadcn-svelte's `sonner`.
- **What to do, with `app-shell`:** `add toast`, then add the import and the three lines to your moved layout. Bind `timers` to a setting, or keep every timed message on the page.
- **What to do, coming from `sonner`:** `add toast`; mount `<Toaster />` where `sonner`'s was, and remove that one; then map the calls. `toast.warning` → `toast.caution`. `duration: Infinity` keeps the toast, as in `sonner`. A finite `duration` below 6000 is raised to 6000, and is ignored on errors, cautions, loading and action toasts. `toast.custom`, rich colours, `position`, `expand` and swipe have no equivalent. `toast.promise` takes the same three messages. Two `sonner` toasts with the same text and an action stay two toasts. Once nothing imports them, remove `svelte-sonner`, and `mode-watcher` if nothing else uses it.
- **Until when:** nothing is deprecated.

## Design

### The queue's shape

```ts
export type ToastKind = "info" | "success" | "caution" | "error" | "loading";
export type ToastCloseReason =
  | "dismiss" | "timeout" | "action" | "navigation" | "api" | "replaced" | "unmount";
export type ToastAction = { label: string; onclick: () => void };
export type ToastOptions = {
  description?: string;
  action?: ToastAction;
  id?: string;
  duration?: number;
  onclose?: (reason: ToastCloseReason) => void;
};

type Entry = {
  id: string;
  kind: ToastKind;
  title: string;
  description?: string;
  action?: ToastAction;
  onclose?: (reason: ToastCloseReason) => void;
  timed: boolean;
  remaining: number;      // ms left, for a timed toast
  state: "waiting" | "showing" | "closing";
  aside: boolean;         // stepped aside: hidden, clock stopped
  held: boolean;          // holds focus or the pointer
  survived: boolean;      // has lived through one navigation
};

export type Snapshot = { showing: Entry[]; waiting: number; aside: number };
export type Speech = { channel: "polite" | "assertive"; text: string };

export function createToastQueue(deps: {
  now(): number;
  setTimeout(fn: () => void, ms: number): unknown;
  clearTimeout(handle: unknown): void;
  frame(fn: () => void): void;
}): {
  raise(kind: ToastKind, title: string, options?: ToastOptions): string;
  promise<T>(p: Promise<T>, messages: PromiseMessages<T>, options?: Omit<ToastOptions, "duration">): string;
  dismiss(id?: string, reason?: ToastCloseReason): void;
  pause(cause: PauseCause): void;
  resume(cause: PauseCause): void;
  aside(id: string, on: boolean): void;
  setLang(lang: string | undefined): void;   // for the word count
  hold(id: string, on: boolean): void;   // focus or pointer inside this toast
  setTimers(on: boolean): void;
  setMax(n: number): void;
  navigating(): void;
  navigated(): void;
  subscribe(view: (s: Snapshot) => void, speak: (s: Speech) => void): () => void;
};
```

The builder may change internal names. The exported names in decision 3 are the interface.

### The toaster, in outline

```svelte
<Status data-slot="toaster-status" text={polite} />
<div data-slot="toaster-alert" role="alert" aria-live="assertive" aria-atomic="true" class="sr-only">{assertive}</div>
{#if snapshot.showing.length}
  <section data-slot="toaster" aria-label={strings.region} aria-keyshortcuts={hotkey} class="fixed top-4 end-4 z-50 …">
    <ol data-slot="toaster-list" tabindex="-1" aria-label={strings.list} class="grid gap-2">
      {#each snapshot.showing as t (t.id)}
        <Toast {...t} {strings} ondismiss={() => queue.dismiss(t.id, "dismiss")} />
      {/each}
    </ol>
    {#if snapshot.waiting || snapshot.aside}<p data-slot="toaster-more" class="…">{count(snapshot, strings)}</p>{/if}
  </section>
{/if}
```

No `style` attribute. Every class is on the ladder or a token. The literal lint reports 0 violations and 0 allowances for the item.

## Scope

**In:**

- `src/lib/registry/ui/toast/`: the six files of decision 1.
- `registry.json`'s `toast` entry; `app-shell`'s entry and layout (decision 23).
- `src/lib/site/examples/toast/`: eight examples, six pair files, and the setting module.
- `src/routes/(site)/components/toast/+page.svelte`.
- `src/lib/preview/app-shell-view.svelte`, and the shell view `/view/app-shell/toast/` (decision 23).
- `tests/unit/blocks.test.ts`: the new view in line 252's exception set (decision 20).
- The example view's lazy toaster (decision 24).
- The ledger files of decision 24.
- Thumbnails: `toast`'s two, and `app-shell`'s two (its files change, so its hash does).
- `tests/sr/` additions (decision 20). `scripts/cost/` additions (decision 25).
- The tests below.

**Out:**

- An `info` colour token (`036`).
- A slide (`039`).
- More positions (Q1), swipe to dismiss, custom content, more than one action.
- A toaster inside a scrolling panel, or one per region of a page.
- The "Keep notifications" switch in the `settings` block.
- The page standard's machinery: anatomy figures, keyboard tables driven as data, pictured pairs (`032`). This spec writes the content those will read.
- Forced colours for every other item (`028`). The accessibility status line (`030`).
- A `sonner` cost reference (decision 25).
- Any change to `status`, `button`, `spinner` or `alert`.

## Tests written first

Each is written and seen failing before the code it checks. The landing notes say how each failed. Browser tests carry `item: toast` (or `app-shell`) and a `check` annotation (`022` decision 13a).

**Unit, `tests/unit/toast-queue.test.ts`, with the injected clock:**

1. **"success and info leave at max(6000, 2000 + 300 × words)".** A 3-word success is showing at 5,999 ms and closing at 6,000. A 30-word info closes at 11,000. Fails today: no module.
2. **"duration lengthens, never shortens, and Infinity keeps".** `2000` gives 6,000; `12000` gives 12,000; `Infinity` and `2 ** 31` give a persistent toast, showing after 600,000 ms; `NaN` and `-5` give the computed time and one development warning each; an error with `8000` never closes.
3. **"error, caution, loading and action toasts never leave".** After 600,000 ms all four are showing.
4. **"a pause keeps the remaining time".** A success paused at 4,000 ms, held 60,000 ms, resumed: it closes 2,000 ms after the resume.
5. **"pause causes count apart".** Hover and focus held; hover released: still paused. Focus released: running.
6. **"timers off stops every clock, and on resumes it".**
7. **"max show; the rest wait, unspoken and unclocked".** Five successes, `max` 3: 3 showing, waiting 2, 3 speeches. When the first closes, the fourth shows, is spoken, and closes 6,000 ms later.
8. **"an error takes the oldest free timed toast's place".** Showing success A (2,000 ms left), success B, loading C; an error raised: showing is error, B, C; A is first in the queue with 2,000 ms left; A is not spoken when it returns.
9. **"an error waits first when no showing toast qualifies".** Three loading toasts showing; an info then an error raised: the queue is error, info.
10. **"displacement skips a toast held by focus or the pointer".** `max` 1, success A showing and held; an error raised: A still showing, the error first in the queue. A released and dismissed: the error shows.
11. **"a smaller max keeps the held toast".** Three showing, the second held; `setMax(1)`: the second is showing, the other two waiting. Released: unchanged, since one already shows.
12. **"newest first".** The showing order is the reverse of the raising order.
13. **"an id updates in place".** `loading` with id `x`, then `success` with id `x`: one toast, kind success, its clock started at the update, spoken twice in all.
14. **"an update's onclose replaces the old one, which runs as replaced".** `x` raised with `onclose` f, updated with g: f called once with `"replaced"`; dismissed: g called once with `"dismiss"`. Updated with no `onclose`: the old callback is kept and runs once at close. Updated with the same function f again: f is kept, is not called with `"replaced"`, and runs once at close.
15. **"a loading toast's own updates are silent".** Three `loading` updates to `x`: one speech. Then `error` to `x`: a second.
16. **"a plain repeat refreshes and speaks again".** "Saved", no action and no `onclose`, at 0 and at 3,000 ms: one toast, closing at 9,000 ms, two speeches.
17. **"two action toasts with equal text stay two".** "Message deleted" with Undo and `onclose` f, then the same text with Undo and `onclose` g: two toasts; each Undo calls its own `onclick`; dismissing both calls f once and g once. The same holds for two equal toasts with only an `onclose`.
18. **"a promise settled within 400 ms shows no loading toast".** Resolved at 300 ms: no snapshot ever holds a loading toast; one speech, "Success: Saved."
19. **"a slower promise replaces its loading toast in place".** Resolved at 1,500 ms: a loading toast from 400 ms, then a success with the same id; the promise's `onclose` has not run.
20. **"a dismissed loading toast's result still comes, with the promise's onclose".** Loading dismissed at 600 ms: nothing called; resolved at 1,500 ms: a new success; dismissed: `onclose` called once.
21. **"each onclose runs once, with its reason"**, for each of the seven reasons.
22. **"a timed toast survives one navigation; the rest stay".** A success and an action toast raised; `navigating()`, `navigated()`: both showing. Again: the success closed, `"navigation"`; the action toast, an error, a caution and a loading toast showing. And: a toast raised, then `navigated()` with no `navigating()` (hydration), then one real navigation: still showing.
23. **"navigating holds speech; navigated releases it".** Polite two frames after `navigated()`; assertive 1,500 ms after; a hold with no release ends at 3,000 ms.
24. **"a modal holds new toasts, and their speech waits after it closes".** `pause("modal")`: a new success is not shown or spoken; a showing one keeps its time. `resume("modal")`: shown at once, spoken 1,000 ms later. A modal closed 200 ms after `navigated()`: a polite message waits for the modal hold's end (1,200 ms), and an assertive one for the later of the two (1,500 ms after `navigated()`).
25. **"toasts raised before a subscriber are kept".** Raise, then subscribe: the toast shows, and its speech waits two frames.
26. **"an error does not silence a success raised beside it".** A success then an error in one task: the polite message is written in frame 1, the assertive one in frame 1; the polite message is written again one frame after the assertive one clears, at about 1,000 ms. A success raised at 500 ms waits until the assertive one clears.
27. **"a toast aside keeps its time".** A success with 4,000 ms left set aside for 60,000 ms, then back: it closes 4,000 ms later. A toast shown while aside is spoken.

**Unit, `tests/unit/toast-findtrap.test.ts`:** 28. **"a transformed ancestor is named".** Over computed-style records: none trapping gives `null` (including `translate: none`, `container-type: normal`, `content-visibility: visible`); one with `transform: matrix(…)`, `translate: 10px`, `rotate: 45deg`, `scale: 1.1`, `filter: blur(…)`, `contain: paint`, `container-type: inline-size`, `content-visibility: auto` or `will-change: transform` is returned, the nearest first. Fails today: no module.

**Unit, `tests/unit/toast-ssr.test.ts`:** 29. **"on the server every call is a no-op".** With no `document`, `toast.success("x")` returns `""`. Then a fake `document` is set and `toast.success("y")` is called: the document's queue holds exactly one toast, "y", not two. Fails today: no module.

**Unit, `tests/unit/toast-words.test.ts`:**

30. **"kind words".** Error, caution, success: "Error: ", "Warning: ", "Success: ". Info and loading: none.
31. **"stops".** "Saved" → "Saved."; "Saved!" and "Saving…" unchanged; a description gets its own stop.
32. **"the action's hint names the hotkey, the region and the label".** "Message deleted. Press F8, or go to Notifications, to reach Undo."; with `hotkey: "F6"`, "Press F6".
33. **"strings replace every word".** A full `ToasterStrings` in another language: no English word left.
34. **"never 'Dismiss'".** No output for any input holds `strings.dismiss`.
35. **"channels".** Error → assertive; the rest → polite.
36. **"words are counted by Intl.Segmenter, in the language passed in".** "Project saved" is 2; "保存しました。接続を確認してください。" after `setLang("ja")` is more than 2; with `Intl.Segmenter` removed, whitespace splits. A browser check in test 64's file: changing `<html lang>` after mount reaches the queue (a Japanese success's time changes).

**Unit, the registry and the site:**

37. **`registry.test.ts`: "toast is a registry:ui of five dependencies and one package".** `registryDependencies` exactly `utils`, `kuiper-theme`, `status`, `button`, `spinner`; built packages exactly `phosphor-svelte@^3.1.1`; `meta` since `0.13.0`, group `feedback`, modes `["productive"]`. And `app-shell`'s `registryDependencies` holds `toast`.
38. **`registry.test.ts`: "the 0.13.0 entry has one toast bullet and one app-shell bullet".** The `toast` bullet names `<Toaster />`, F8, "steps aside", 6 s, `duration: Infinity`, `timers="off"`, 2.2.1, `toast.navigating()` and `phosphor-svelte`. The `app-shell` bullet is marked `**interface change.**` and names `<Toaster />`, `beforeNavigate`, `afterNavigate`, `sonner`, `timers` and `add app-shell`.
39. **`023`'s described-list test: "toast has 0 empty API rows".** Every prop of `Toaster` and `Toast`, every export of `toast.ts`, and every member of `ToastOptions`.
40. **`literals.test.ts`: "the six toast files are linted, with 0 literals and 0 allowances".** The lint's file list holds each of the six files of decision 1, and `FILE_COUNT` moves by 6 from its count at build start. Fails today: the files are not in the list.
41. **`examples.test.ts` and the order test: "toast's eight examples are in order; each pair file has kind, pair and a caption of 20 words or fewer; each don't has breaks; every specimen renders in an ol inside inert".**
42. **`search.test.ts`: "snackbar and notification lead to /components/toast/".**
43. **The upgrade-guide test `020` writes: "the 0.13.0 guide has a 026 section naming toast.caution, duration: Infinity, sonner and svelte-sonner".**

**Browser, `tests/e2e/toast.spec.ts`, both schemes, Chromium locally and all three engines in CI:**

44. **"both announcers are in the server HTML, empty, and no region".** The raw HTML of `/components/toast/`, `/view/app-shell/` and `/view/app-shell/toast/` holds one `toaster-status` with `role="status"` and one `toaster-alert` with `role="alert"`, both with no text, and no `data-slot="toaster"`. Seen failing at build step 3; the two shell views pass at step 6. (`live`)
45. **"success speaks politely, then clears".** "Save": within two frames `toaster-status` reads "Success: Project saved."; at +1,000 ms it is empty; `toaster-alert` stays empty. (`live`)
46. **"error speaks assertively".** The same for `toaster-alert` and "Error: Couldn't save. Check your connection." (`live`)
47. **"one schedule: a success beside an error is written again".** "Save two records": `toaster-alert` is written; `toaster-status` is written, then written again with the same text after `toaster-alert` clears. (`live`)
48. **"the stack is not live, and no toast is a stop".** With every kind showing: 0 elements inside `toaster` with `aria-live` or a live role; 0 `li` with `tabindex`; the Tab stops a toast adds equal its buttons. (`keyboard`)
49. **"Dismiss is 32 px, named Dismiss, described by the title".** Its box is at least 24 × 24 (32 by design); its accessible name is "Dismiss" and its description the title. (`axe`)
50. **"F8 goes to the list and back".** Focus on "Save", F8: focus on `toaster-list`, named "Newest first", inside a region named "Notifications". F8: focus on "Save". (`focus`)
51. **"Escape closes and focus moves on".** Two toasts. F8, Tab to the first Dismiss, Escape: one toast left, focus on its Dismiss. Escape: none left, focus on the trigger. (`focus`)
52. **"entered by F8, Tab past the end returns".** F8, Tab past the last stop: focus on the remembered element. (`focus`)
53. **"at 390, focus in a toast survives an arriving error".** At 390 × 844: a success, F8, Tab to its Dismiss; an error raised: focus still on the success's Dismiss, the "more" line reads "1 more". Enter: the error shows, focus on its Dismiss. (`focus`)
54. **"narrowing keeps the focused toast".** At 1440, three toasts, focus on the second's Dismiss; the viewport set to 390: that toast still showing and focused. (`focus`)
55. **"a toast closed by a navigation while focused leaves focus on a connected element".** In `route`, a surviving success is focused, then the second navigation runs: after the close, `document.activeElement.isConnected` is true, and it is `#main` or `body` only if the remembered element is gone. (`focus`)
56. **"a success leaves at 6 s".** With `page.clock`: showing at 5,999 ms, gone after 6,000 ms and its exit. (`timing`)
57. **"each pause cause holds the clock".** For hover, focus in the region, window `blur`, `visibilitychange` to hidden, and an open dialog: 20,000 ms later still showing; released, gone after its remaining time. (`timing`)
58. **"timers off keeps a success".** The setting switch on: showing after 60,000 ms. (`timing`)
59. **"errors, cautions, loading and action toasts stay".** Showing after 600,000 ms. (`timing`)
60. **"three show at 1440, one at 390".** Five raised: at 1440, 3 `toast` and "2 more"; at 390, 1 and "4 more". (`layout`)
61. **"under a declared bar, and in from the corner".** The region's top, ± 1 px: 88 px (`--size-bar` plus 16 px) on `/components/toast/`, under the site bar; 88 px on `/view/app-shell/sidebar/`, under the shell's sticky header, the toast raised through `window.kuiperToast`; 16 px on `/view/app-shell/toast/`, which ships with no sticky bar; 16 px on `/example/toast/raise/`. Its end edge is 16 px from the viewport's. (`layout`)
62. **"a modal holds a new toast, and its speech waits".** In `from-a-dialog`: while the dialog is open, 0 toasts and both announcers empty; closed, "Project deleted" shows at once, and `toaster-status` speaks it 1,000 ms after the close, ± one frame. (`live`)
63. **"a toast never covers the keyboard focus".** With three toasts at 1440 and one at 390, Tab through every stop outside the region on the toast page, scrolling each into view: no visible toast's box overlaps the focused stop's box, at any stop, one frame after the focus lands (SC 2.4.11). (`keyboard`)
64. **"a covering toast steps aside, and comes back".** A button placed under the stack is focused by Tab: the toasts that overlap it carry `data-aside` and `visibility: hidden`, stay in the list, the count line reads "1 hidden" (or more), and they do not close after 20,000 ms. Focus moved by Tab to "Save": they are visible, and close after their remaining time. Escape with focus on the covered button closes no toast; with a dialog open, Escape closes the dialog and no toast. Four more cases, each failing on a toaster that checks only on `focusin`, `resize` and window `scroll`:
    - **a panel scrolls the focus under the stack:** a button in an `overflow: auto` panel is focused by Tab, clear of the stack; the panel is scrolled (by script, no `focusin`) until the button is under the stack: within one frame, the overlapping toast is aside;
    - **content pushes the focus under the stack:** a button is focused by Tab, clear of the stack; a 200 px block is inserted above it, moving it under the stack: within one frame, the overlapping toast is aside;
    - **a click does not hide its own toast:** a "Save" placed under the stack is clicked with the mouse, keeping focus (Chromium and Firefox); its success toast shows, visible, with no `data-aside`, since the focus does not match `:focus-visible`;
    - **the keyboard case:** the same "Save" activated by Tab and Enter: its toast shows stepped aside and the count line reads "1 hidden" (decision 15a's remaining case). (`focus`)
65. **"the kind's icon reaches 3:1, its text 4.5:1".** On the toast's surface, in both schemes. (`contrast`)
66. **"nothing in a toast is translucent".** For every kind, after its entrance: the toast and each descendant have background and border colours of alpha 0 or 1, no backdrop filter, opacity 1. The test reads backgrounds and borders; `shadow-elevation`'s solid ring is a box shadow, and is allowed. (`depth`)
67. **"axe: 0 violations".** Every kind showing, both schemes, 1440 and 390; and on the page's specimens and pairs. (`axe`)
68. **"forced colours draw the edge, and the icons differ".** With `forcedColors: "active"`: the toast's border is at least 1 px and not transparent; the five kinds' icons have five different shapes (their `path` data differ). (`forced-colors`)
69. **"reduced motion: nothing moves".** Under `reducedMotion: "reduce"`: the toast's animation lasts 0.01 ms or less; the spinner's iteration count is 1. (`motion`)
70. **"a closing toast leaves even without animationend".** A toast closed while its region is `display: none` (injected): it is gone from the list within its animation's duration plus one frame. (`motion`)
71. **"a timed toast survives one navigation".** In `route`: after "Create project", the toast shows on the new view, and `toaster-status` was written after `#svelte-announcer` changed. (`live`)
72. **"a fast promise never draws a loading toast".** A `MutationObserver` records no `data-kind="loading"` for "Save quickly"; "Save slowly" draws one, then a success with the same `data-toast-id`. (`live`)
73. **"a plain repeat is one toast, spoken twice; two deletes are two toasts".** "Save" twice, 3 s apart: one toast; `toaster-status` written twice. "Delete message" twice: two toasts, each with Undo. (`live`)
74. **"the app shell mounts the toaster after the skip link".** On `/view/app-shell/`, `/view/app-shell/sidebar/` and `/view/app-shell/toast/`: the skip link, then the two announcers, then the header, in DOM order. Seen failing at build step 3; passes at step 6. (`structure`)
75. **`keyboard.spec.ts`: the keyboard example's stops and behaviour**, as decision 15's table, through the existing walk. (`keyboard`)

**Unit, `022`'s suite:** 76. **`sr-rules.test.ts`: `unspoken` and `before`** pass and fail on fixture logs in both readers' wording. 77. **`sr-items.test.ts`** passes with `toast` in `SR_ITEMS`, one file more than `022`'s count, and `app-shell.sr.ts` holding a `live` test. `022`'s annotation check passes with every toast test carrying `item`, `rules` and `hears`, each `hears` target of `022`'s allowed forms, and `mutations.test.ts` derives exactly S2 and S10 for `toast-alert`.

**Unit, `025`'s suite:** 78. **`cost.test.ts`'s interaction check** passes with `toast`, `toast.burst` and `toast.progress` in `interactions.ts` (34 entries), and its fixture and two case files present; and its budget check passes with `app-shell`'s `raised` records, if any.

## Acceptance criteria

1. **The item.** `src/lib/registry/ui/toast/` holds the six files of decision 1; `registry.json`'s entry matches decision 1. (unit: 37)
2. **The API.** The exports of decision 3, and no others, are in `index.ts`. (unit, review)
3. **Timing.** Tests 1 to 6, 36 and 56 to 59 pass. (unit, e2e)
4. **The stack.** Tests 7 to 12, 53, 54 and 60 pass. (unit, e2e)
5. **Updates, repeats and callbacks.** Tests 13 to 17, 21 and 73 pass. (unit, e2e)
6. **Promises.** Tests 18 to 20 and 72 pass. (unit, e2e)
7. **Navigation.** Tests 22, 23, 55 and 71 pass. (unit, e2e)
8. **Modals.** Tests 24 and 62 pass. (unit, e2e)
9. **Server safety.** Tests 25, 29 and 44 pass. (unit, e2e)
10. **Words and the schedule.** Tests 26 and 30 to 35, and 45 to 47, pass. (unit, e2e)
11. **Not live, no stop.** Tests 48 and 49 pass. (e2e)
12. **Keyboard.** Tests 50 to 52 and 75 pass. (e2e)
13. **Focus never covered.** Tests 27, 63 and 64 pass. (unit, e2e)
14. **Placement.** Tests 28 and 61 pass. (unit, e2e)
15. **Depth.** Test 66 passes. (e2e)
16. **Contrast and axe.** Tests 65 and 67 pass, in both schemes. (e2e)
17. **Forced colours.** Test 68 passes. (e2e)
18. **Motion.** Tests 69 and 70 pass. (e2e)
19. **Three engines.** Every test in `toast.spec.ts` passes in `chromium-*`, `firefox-*` and `webkit-*`, or is in `022`'s fault ledger with a small change. (CI)
20. **Screen readers.** S1 to S10 and A1 pass under VoiceOver (WebKit, Chromium) and NVDA (Chromium, Firefox) in a green `matrix` run, whose id is in the landing notes. The mutation run fails exactly S2 and S10, as `expected.json` says. Tests 76 and 77 pass. (CI, unit)
21. **Described.** Test 39 passes. (unit)
22. **Literals.** Test 40 passes; the lint's totals are unchanged elsewhere. (unit)
23. **The page.** `/components/toast/` renders the eight examples in order and the three pairs, every specimen inert in an `ol`. Tests 41 and 42 pass. The "Your part" list holds decision 22's six musts. (unit, e2e, review)
24. **The app shell.** Test 74 passes; `blocks.spec.ts` still passes; `app-shell`'s two thumbnails are regenerated; its comment names the `timers` setting. (e2e, unit, review)
25. **The changelog and the guide.** Tests 38 and 43 pass. (unit)
26. **The cost case.** `scripts/cost/` holds decision 25's fixture, its interaction entry, and the two cases with their `<item>.<case>` entries; `025`'s criteria 1, 2 and 4 hold at the counts decision 25 gives; test 78 passes; `bun run cost` reports `toast` with every figure under its first budget and every response time under 200 ms. `app-shell`'s raised budgets, if any, carry `raised` records linking to these Landing notes, which name `app-shell`, each metric and both numbers (`025` criteria 6 and 7). The landing notes give the figures and cite the budget. (cost run, unit)
27. **The suites.** `bun run test:unit`, `bun run test:e2e`, `bun run test:smoke`, `bun run check`, `bun run lint`, the literal lint and the release check pass. Expectations change only in the files this spec names. (all)
28. **Tests first.** Tests 1 to 75 were seen failing first; the landing notes give the counts, and say which pass only after build step 6 (44, 74). (checkpoint)
29. **The checkpoint.** The design lead raises every kind, in both schemes, at 1440 and 390, on the toast page and on `/view/app-shell/toast/`: the corner, the bar, the stack, the "more" line, a step aside, F8, Escape, a dialog, reduced motion. (checkpoint)
30. **The scorecard.** `breadth.ts`, `kuiper.ts --rev`, `site.ts --only kuiper` and `depth.ts` run, with the cost run. Row 1 reads 30 of 40 parts (score 3, held; 34 is 4). The run log has a row, and the change review cites it. (measure)

## Build order

1. **Confirm.** `examples.test.ts` and the order test's treatment of `do-*` and `dont-*`. Whether `022`, `023` and `025` have landed. Write tests 1 to 43 and see each fail.
2. **The queue, the words and `findTrap`.** Until tests 1 to 36 pass.
3. **The card and the toaster.** Then the examples and the page. Write tests 44 to 75; see them fail; build until they pass, in Chromium, then `test:e2e:engines` locally. Tests 44 and 74 keep failing on the shell views until step 6.
4. **Checkpoint** (criterion 29).
5. **The example view's toaster** (lane S).
6. **The app shell** (lane I), once `023` has landed. Then its preview copy and the `toast` shell view (lane S). Thumbnails.
7. **The screen-reader files, rules and mutation** (lane E), once `022` has landed. Tests 76 and 77.
8. **The cost case** (lane E), once `025` has landed, and once `025` allows case entries (decision 25), by its own revision or a small change. Test 78; `bun run cost --budget toast`; `bun run cost` again for `app-shell`, raising its budgets with `raised` records if it is over (decision 25).
9. **Ledgers**, in landing order: `registry.json`, the changelog, the guide, the sitemap, the order, the aliases, `static/r/`.
10. **Owner push** for the `matrix` run and the mutation run (`022`'s plan). Then the change review, the landing, and the scorecard.

## Risks

- **The speech is untested until the matrix runs.** Every wording in decision 20 is INFERRED. The hold times (two frames, 1,000 ms, 1,500 ms, `TOAST_MODAL_HOLD_MS`) are first guesses a run will tune. No primary source states the gap a reader needs between clearing and rewriting the same text; one frame is the shortest choice, and S4 tells. A change to a constant after the run is a ruling in the landing notes, not a new spec.
- **VoiceOver and focus changes.** WebKit bug 222190 is open at Apple. If S9 fails with the 1,000 ms hold, the hold grows; if no hold works, the finding is recorded and the hold stays, since it can only help.
- **`aria-modal` and live regions** differ between readers ([w3c/aria#1854](https://github.com/w3c/aria/issues/1854)). Holding during a modal is right for every reader; S9 confirms the release.
- **A step aside hides a toast the person has not seen.** Its words are still spoken, the count line says "1 hidden", and it returns as soon as focus moves. A pointer press never causes it (`:focus-visible`). The remaining case: a keyboard user who presses Enter on a "Save" at the top end, directly under the stack, sees its result only as "1 hidden" until focus moves. A person who Tabs slowly through the top end of a toolbar may see toasts blink out and back. Q4 offers the stack moving instead, which hides nothing.
- **The step-aside frame loop** runs while a toast shows and keyboard focus is outside the region. A few box reads a frame; the cost run's `toast.burst` case and the checkpoint watch it.
- **F8 on Mac laptops** needs Fn. The hint names the landmark, and the Tab order reaches the region (Q6a, Q6b).
- **The modal observer and the step-aside check** run on mutations, focus, scroll and resize. Each callback only reads a selector or a few boxes, at most once a frame. The cost run's `toast.burst` case would show a long task.
- **Two queues.** An app that installs `toast` twice under two paths gets two module instances and two queues. The second toaster's warning does not catch it. "Your part" says to install once.
- **Ledger contention** with `027`, which also adds items and pages in wave 1.

## Open questions for the owner

Recommended option first. Each answer goes in the landing notes.

**Q1. Where may toasts sit?**
1. **Top end only, for now** (decision 7). It keeps clear of the composer and the phone's keyboard, matches the reading order, and a `position` prop can be added later without breaking an app.
2. Top end and bottom end, by a `position` prop. Bottom end is sonner's default, so apps coming from it keep their corner. Twice the layout tests.
3. Sonner's six positions.

**Q2. When does `toast.info` ship?**
1. **Now, in the neutral tone.** `036` gives it a colour without an interface change. Your ruling already times info out.
2. With `036`. `toast()` with no kind is neutral meanwhile, and `toast.info` arrives in 0.14.0.

**Q3. How many toasts show on a phone?**
1. **One below 640 px; three from 640 px** (decision 6). Three cover most of a 320 px screen. A toast that holds focus or the pointer is never pushed out (decision 6), so the one slot never loses the focus.
2. Three everywhere.
3. One everywhere, as Spectrum does.

**Q4. How does a toast keep clear of the focused element?** SC 2.4.11 does not accept Escape for content the person did not open, so a toast must never cover the keyboard focus. Only keyboard focus counts (`:focus-visible`): a mouse press on a button under the stack never hides the toast it raised. **The cost of options 1 and 2:** a keyboard user who presses Enter on a "Save" at the top end, directly under the stack, keeps focus there, so its result toast shows stepped aside. They see only "1 hidden" under the stack until focus moves; a screen reader still speaks it.
1. **Covering toasts step aside (hidden, paused, kept) while keyboard focus is under them; Escape outside the toasts closes nothing** (decision 15a). It meets 2.4.11 and moves nothing that is not in the way.
2. Covering toasts step aside, and Escape outside also closes them.
3. The whole stack moves to the bottom end while keyboard focus is under it, and returns when focus leaves. It hides nothing, but every toast jumps across the screen for one covered element, and the bottom holds the composer and the phone's keyboard.

**Q5. Do caution toasts time out?**
1. **No: they wait, like errors** (decision 4). Your ruling named success and info as timed; Atlassian and the memo keep warnings.
2. Yes, like info, at the same floor.

**Q6. How is the region reached?** Two answers, recorded apart. Note for both: on a Mac laptop F8 is a media key unless Fn is held, so "Press F8" alone misleads there.

**Q6a. Where is the region in the Tab order?**
1. **Right after the skip link** (decision 23). Tab from the top reaches a toast before the header, which helps where F8 is a media key. Each page with a toast gains its buttons there.
2. At the end of `body`. Only F8 and the landmark reach it; the page's own Tab order is untouched.

**Q6b. What does an action toast's spoken hint say?**
1. **"Press F8, or go to Notifications, to reach Undo."** (decision 10). It names the landmark too, so it holds on a Mac laptop without Fn.
2. "Press F8 to reach Undo." Shorter; it misleads on those laptops.
3. "Undo is in Notifications." No key named; the person finds the landmark their own way.

**Q7. What happens to a toast raised while a modal is open?** VoiceOver does not read live regions outside an `aria-modal` dialog; JAWS, NVDA and Narrator do ([w3c/aria#1854](https://github.com/w3c/aria/issues/1854), open). VoiceOver also drops speech that coincides with the focus change a modal's close makes (WebKit bug 222190).
1. **It waits until the modal closes, shows at once, and is spoken 1 s later** (decision 16). Its speech is then certain, and a dialog's own feedback stays in the dialog.
2. It shows under the modal's scrim, paused, and may go unspoken in VoiceOver.
3. It shows above the modal, as Atlassian's flags do, in the top layer. A press on it closes the modal.

**Q8. Do action and caution toasts close on a later navigation?**
1. **No: they stay until dismissed, like errors and loading toasts** (decision 17). Closest to your ruling 6: an Undo's window never ends without the person's act.
2. They close on the second navigation, as the first draft had, so an Undo does not follow the person across the app.

## Review

The specification review, [`../reviews/026-toast-spec-2026-11-15.md`](../reviews/026-toast-spec-2026-11-15.md), found 2 High, 9 Medium and 8 Low. Each is answered here.

| # | Finding | Answer |
|---|---|---|
| 1 | Escape does not answer SC 2.4.11 for a toast | Decision 15a: covering toasts step aside; Escape outside closes nothing. Tests 63, 64; Q4 re-asked; "Provides" and the changelog changed |
| 2 | Content de-duplication merges action toasts; `onclose` on an update | Decision 9: never merge a toast with an `action` or `onclose`; an update's `onclose` replaces the old, which runs as `"replaced"`. Tests 14, 16, 17, 73 |
| 3 | The info and loading edge is the 10% hairline | Decision 13 names the classes: `border-transparent` sides, `border-s-input` for info and loading; test 66 allows the solid ring |
| 4 | Focus lost on displacement, narrowing, navigation | Decision 6: displacement and a smaller `max` skip a held toast. Decision 15: "focus moves on" covers every way out. Tests 10, 11, 53, 54, 55 |
| 5 | The announcers are not coordinated | Decision 10: one schedule; a polite message beside an assertive one is written again. Tests 26, 47; S10 |
| 6 | `duration: Infinity` or `NaN` closes at once | Decision 5: Infinity and over 2³¹ − 1 keep the toast; `NaN` and negatives are ignored with a warning. Test 2; the guide |
| 7 | The mutation's expected set is unpredictable | Decision 20: the mutation strips the assertive announcer's live role; exactly S2 and S10 fail. The live-list fault is proven by test 48 |
| 8 | `app-shell` declares `live` with no test; the server path unheard | Decision 20: A1 in `app-shell.sr.ts`, on the new server-rendered view `/view/app-shell/toast/`. Decision 23 updates the preview copy. Test 77 |
| 9 | Releasing toasts as a modal closes hits VoiceOver's drop | Decision 16: speech waits `TOAST_MODAL_HOLD_MS` after the close; WebKit 222190 and w3c/aria#1854 cited. Tests 24, 62; Q7 |
| 10 | SC 2.2.1 needs the app's part | Decision 5a; "Provides" conditioned, "Your part" a must, the `result` do, the shell's comment, the changelog. The default is unchanged |
| 11 | The cost case does not fit `025` | Decision 25 refitted: a page fixture, an `interactions.ts` entry, two cases measured by response time, no `sonner` reference, estimates in `025`'s counting. Test 78; criterion 26 |
| 12 | Navigation close of action and caution toasts is an owner question | Decision 17 keeps them; Q8 asks |
| 13 | `afterNavigate` at hydration | Decision 17: `navigated()` without `navigating()` does nothing. Test 22 |
| 14 | Tests 22 and 32 are vacuous | Test 29 checks one toast, not two, after a fake `document`; test 40 checks the file list and `FILE_COUNT` |
| 15 | Specimens are `li` outside a list; dead stops | Decision 22: every specimen in an `ol` inside `inert`; `Toast` takes `as`. Tests 41, 67 |
| 16 | Forced colours lose the kind's colour | Decision 14 says so; the kind rests on the icon's shape and the hidden word. Test 68 |
| 17 | Placement: 64 vs 72 px; test 61's value; trapped `fixed` | Decision 7 states the 24 px; test 61 names 88 px; `findTrap` warns in development, test 28, "Your part" |
| 18 | The timing slope and the word count | Decision 5: 300 ms a word, citing Brysbaert 2019; `Intl.Segmenter`. Tests 1, 36 |
| 19 | Write-ins | The roadmap note corrected; six icons; the list named "Newest first"; the toaster subscribes in `onMount`; tests 44 and 74's step noted; the bits-ui reasoning and the exit fallback (decisions 8, 19; test 70) |

### The re-review, 2026-11-15

The re-review approved with changes R1 to R10. Each is applied:

| # | Finding | Answer |
|---|---|---|
| R1 | The step aside misses panel scrolls and layout shifts | Decision 15a: a check once a frame while a toast shows and keyboard focus is outside the region, replacing the `resize` and `scroll` listeners. Test 64 gains a panel-scroll case and an inserted-content case |
| R2 | The step aside hides a top-end action's own result | Decision 15a: only for focus that matches `:focus-visible`, so a pointer press never hides its toast; the count line also counts toasts aside ("1 hidden"). The remaining keyboard case is stated in decision 15a, Q4 and the Risks. Option 1 stays recommended. Test 64 gains the click and keyboard cases |
| R3 | S10 collides with `022`'s L3 | S10 declares the success's repeat as promised (L4 in place of L3, for that phrase); the reader table says the success may be heard twice |
| R4 | The mutation's expected set conflicts with `022`'s derivation | Decision 20: finer `hears` targets, `toast:assertive`, `toast:polite` and `toast:focus`, on every toast test; the patch's row in `022`'s form (file `toaster.svelte`, target `toast:assertive`, fault L1); `022` must allow `<item>:<part>` targets; the derived set is exactly S2 and S10. Test 77 |
| R5 | The new view trips `blocks.test.ts`'s guard | Decision 20: the view joins line 252's exception set with its reason, as `code-agreement` does, and stays out of `views`. Scope lists the file |
| R6 | Test 61 expects 88 px on a view with no sticky bar | Test 61: 16 px on `/view/app-shell/toast/`, as shipped; 88 px on `/view/app-shell/sidebar/`, raised through the preview copy's `window.kuiperToast` hook (decision 23) |
| R7 | Two of `025`'s criteria and `app-shell`'s budget | Decision 25: cases keyed `<item>.<case>` in `interactions.ts`; `025`'s criteria 1, 2 and 4 at 76 items, 72 fixtures, 34 entries, 72 entries plus three cases; `app-shell`'s budget raised with `raised` records and a landing-note line (`025` criteria 6, 7). Build step 8, criterion 26, test 78 |
| R8 | The same `onclose` passed again runs twice | Decision 9: the same reference is kept, with no `"replaced"`. Test 14 |
| R9 | `findTrap` misses `translate`, `rotate`, `scale`, `container-type`, `content-visibility` | Decision 7 lists them. Test 28 |
| R10 | Write-ins | The toaster passes the page's `lang` to the queue on mount and on change (`setLang`; test 36); when a modal closes on a navigation, the later hold's end wins (decisions 16, 17; test 24); the set is "one more than `022`'s", 29; Q6 split into Q6a and Q6b |

## Landing notes

**The owner's answers (the owner, 2026-11-15).** The owner accepted the recommended option for every question:

- **Q1:** top end only, for now.
- **Q2:** `toast.info` ships now, in the neutral tone. Row `036` keeps only the info colour.
- **Q3:** one toast shows below 640 px and three above. A toast that holds focus or the pointer is never pushed out.
- **Q4:** option 1. Covering toasts step aside while keyboard focus (`:focus-visible`) is under them, and Escape outside the region closes nothing. The owner accepted the stated cost: Enter on a "Save" at the top end shows only "1 hidden" until focus moves.
- **Q5:** caution toasts wait to be dismissed, like errors.
- **Q6a:** the region sits right after the skip link in Tab order.
- **Q6b:** the hint reads "Press F8, or go to Notifications, to reach Undo."
- **Q7:** a toast raised during a modal waits. It shows when the modal closes and is spoken 1 s later.
- **Q8:** action and caution toasts stay across navigations until dismissed.

The upgrade guide's address follows `020` Q4: `/changelog/0.13.0/upgrade/`. This spec's references were changed to match.

Not yet landed.
