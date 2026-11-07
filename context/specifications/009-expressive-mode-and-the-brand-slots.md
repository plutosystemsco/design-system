# 009 — Expressive mode and the brand slots

- **Status:** built, reviewed and released in `v0.11.0` with `009` to `012` (2026-11-07). Its specification review is [`../reviews/009-expressive-mode-and-the-brand-slots-spec-2026-11-01.md`](../reviews/009-expressive-mode-and-the-brand-slots-spec-2026-11-01.md) (24 findings, 3 High, dispositioned below); its change review is [`../reviews/009-expressive-mode-and-the-brand-slots-pr-2026-11-01.md`](../reviews/009-expressive-mode-and-the-brand-slots-pr-2026-11-01.md) (1 High, 2 Medium, 6 Low, all fixed or answered).
- **Date:** 2026-11-01
- **Author:** the design lead
- **Kind:** a new token group and its build; new runtime variables and utilities in `pluto-theme`; a lint rule and a profile per registry item; one new `registry:lib` item, `read-token`; one change to `button`'s classes with no visible effect in productive mode; preview sections and tests.
- **Depends on:** [`008`](./008-product-identity.md), _built_ (`6fbdf99`, prepared as `v0.8.0`).
- **Research it stands on:**
  - [`../research/2026-11-01-what-a-product-site-needs-to-compete.md`](../research/2026-11-01-what-a-product-site-needs-to-compete.md) (the product-site memo: the lab's literals, the suggested layers);
  - [`../research/2026-11-01-how-systems-separate-brand-modes-and-products.md`](../research/2026-11-01-how-systems-separate-brand-modes-and-products.md) (the systems memo);
  - [`../research/2026-11-01-how-definitive-brands-are-built.md`](../research/2026-11-01-how-definitive-brands-are-built.md) (the brands memo);
  - [`../research/2026-11-01-how-the-four-colours-are-tuned.md`](../research/2026-11-01-how-the-four-colours-are-tuned.md) (the colour memo: why the brand's colours must be swappable while the palette is chosen).
- **Design calls:** `../decisions.md`, "The identity is commissioned, with options" (2026-11-01).

## Intent

The system speaks in one voice: quiet. Its rules suit an app and a docs page. They stop a home page from being loud (product-site memo).

This specification adds a second voice, **expressive mode**, on the same tokens, and turns the stage's colours and the display face into **slots**: runtime variables that a later decision fills. Nothing here chooses the identity. The identity exhibit at `/identity` holds those choices for the owner.

A productive screen looks exactly as it does in `v0.8.0` after this lands.

**Terms of art.**

- A **mode** is a set of rules for how loud a surface may be. _Productive_ is for apps, docs and dense screens. _Expressive_ is for home pages, launches and marketing sections.
- A **stage** is a full-bleed section on a ground darker than ink, where one object is lit.
- **Bloom** is soft light behind an object. A **rim** is the lit edge of a card. **Energized** is the glow of a card while it works.
- A **veil** is a translucent, blurred bar ground.
- A **brand slot** is a CSS custom property, set on `:root`, that names a brand asset. A subtree may set it again.
- A **lint profile** is the set of lint rules an item is held to.
- A **utility** is a Tailwind class. An `@utility` is one the theme defines.

**Not here:**

- Any composition (`010`).
- The identity's values. Every new value is today's palette or a measured literal from the product-site lab.
- Slots for the sans, heading and mono faces. The CLI writes each font item's literal family into the app's `@theme inline` (review finding 2), so those slots need the font items to change, which the typeface decision (exhibit question D) will do anyway.
- Product themes (exhibit question A), springs and an ambient motion utility (question J).

## Decisions

### 1. Scope

| Item or file | Change |
|---|---|
| `tokens/pluto.tokens.json` | one new group, `expressive` (decisions 3 to 7) |
| `scripts/tokens.ts` | validates it |
| `scripts/build-tokens.ts` | emits its variables into `pluto-theme`'s `css[":root"]`, the stage rules, the mode rules and the utilities |
| `scripts/contrast.ts` | the stage set and a composite row kind (decision 3) |
| `scripts/lint-literals.ts` | rule L22 and the profile from `meta.modes` (decision 9) |
| `registry.json` | `meta.modes` on every item; one new item, `read-token` |
| `button` | `rounded` becomes `rounded-[var(--radius-action,var(--radius))]` (decision 8) |
| the preview | an "Expressive mode" section on the `pluto-theme` page; a page for `read-token` |
| `package.json` | no new package |

### 2. Where every new variable lives

Every variable this specification adds is emitted in `pluto-theme`'s `css[":root"]`, beside `--mark-dot` and `--motion-micro` (READ, `scripts/build-tokens.ts`, `themeCss`).

- **Not in `cssVars`.** The CLI turns every `cssVars` colour into Tailwind utilities (`bg-stage`, `text-veil`), which L22 would not see (review finding 4).
- **Not in `@theme inline`.** Values there are inlined into utilities and are not runtime variables, so a subtree could not set them again.
- The stage colours are the same in both themes, so they need no `.dark` block.
- The preview's `src/app.css` and an installed app get the same rules, since both come from `themeCss`.

The variables, by name:

| Group | Variables |
|---|---|
| stage | `--stage`, `--stage-raised`, `--stage-wash`, `--stage-foreground`, `--stage-muted`, `--stage-line`, `--stage-line-strong`, `--stage-primary`, `--stage-mark-1` … `--stage-mark-4` |
| light | `--bloom-core`, `--bloom-edge`, `--rim-line`, `--rim-glow`, `--rim-highlight`, `--energized-line`, `--energized-glow`, `--veil` |
| display | `--font-face-display`, and per step `--type-display-size`, `--type-display-leading`, `--type-display-tracking` (and `section`, `proof`) |
| motion | `--motion-press`, `--motion-slide`, `--motion-busy`, `--motion-reveal`, `--motion-fill`, `--ease-standard`, `--press-scale` |
| shape and size | `--radius-pill`, `--radius-stage`, `--radius-action`, `--size-bar`, `--size-action`, `--size-action-small`, `--size-track`, `--size-hero-fill`, `--gutter-stage`, `--blur-veil` |

### 3. The stage

| Variable | Value | From |
|---|---|---|
| `--stage` | `#050608` | the lab's ground |
| `--stage-raised` | `#0E1014` | a card on the stage |
| `--stage-wash` | `#15171B` | an inset on the stage: a code ground, a tab strip, a meter track |
| `--stage-foreground` | paper | |
| `--stage-muted` | `#9AA0AD` | the lab's muted text |
| `--stage-line` | paper at 10% | the lab |
| `--stage-line-strong` | paper at 14% | the lab |
| `--stage-primary` | `blue-lifted` | today's dark primary |
| `--stage-mark-1` … `4` | `blue-lifted`, `red-lifted`, `amber`, `green-lifted` | the icon on ink uses lifted dots (`decisions.md`, "After the public-readiness review"); amber has no lifted primitive (review finding 15) |

**`surface-stage`,** used as `class="dark surface-stage"`, the pattern of `surface-ink` (`007` decision 8): two plain rules printed after the theme blocks, since a layered utility loses to the unlayered `.dark`. Inside it:

- `--background` → `--stage`; `--card`, `--popover`, `--secondary` → `--stage-raised`; `--muted`, `--accent` → `--stage-wash`; `--border` → `--stage-line`;
- `--foreground`, `--card-foreground`, `--popover-foreground`, `--secondary-foreground`, `--accent-foreground` → `--stage-foreground`; `--muted-foreground` → `--stage-muted`;
- `--primary`, `--ring` → `--stage-primary`; `--mark-N` → `--stage-mark-N`;
- `background-color: var(--background); color: var(--foreground)`.
- **Left at their dark values:** every fill's foreground (`--primary-foreground`, `--destructive-foreground`, `--success-foreground`, `--caution-foreground`, all ink), the fills themselves, `--destructive`, `--success`, `--input` and the code tokens other than their ground. _Why (review finding 1):_ the dark theme's fill pairs already pass (ink on lifted blue 6.85); sending every foreground to paper would put paper on lifted blue at 2.45.
- `--code-background` follows `--muted`, as it does today (`code.background: muted`), so code sits on the stage wash.

**Contrast,** measured by the design lead with the WCAG formula and truncated to two places, as the repo's rule asks (EXECUTED, 2026-11-01):

| Pair | on `stage` | on `stage-raised` | on `stage-wash` |
|---|---|---|---|
| `stage-foreground` | 18.88 | 17.74 | 16.71 |
| `stage-muted` | 7.72 | 7.25 | 6.84 |
| `stage-primary` | 7.68 | 7.21 | 6.80 |
| `input` (non-text, 3:1) | 4.87 | 4.57 | 4.31 |

Ink on `stage-primary`: 6.85.

- **`contrast.ts` gains a `stage` set** (review finding 6): its rows name variables of the `expressive` group as well as theme roles, and a new row kind, `composite`, gives a foreground over a translucent fill over a ground (`{ fg, fill, over, min }`). Every pair above, and every composite in decision 4, is a row; the build fails if one drops below its minimum.
- **The stage lines are not held to 3:1.** `stage-line-strong` measures 1.37 on `stage`. A line separates; it does not identify a control (WCAG 1.4.11). A control on a stage carries `--input`.

### 4. Light

| Variable | Value |
|---|---|
| `--bloom-core` | `#C8D4FF38` (the lab's `rgba(200,212,255,.22)`) |
| `--bloom-edge` | `#6E82D212` (`.07`) |
| `--rim-line` | `#E1E9FF47` (`.28`) |
| `--rim-glow` | `#C8D6FF1F` (`.12`) |
| `--rim-highlight` | `#FFFFFF0F` (`.06`) |
| `--energized-line` | `#7A9BFFB3` (lifted blue at 70%: 4.15 on the stage and 3.90 on the raised card, above 3:1; the lab's 55% measured 2.94, review finding 21) |
| `--energized-glow` | `#2456E640` (`.25`) |
| `--veil` | `#050608D9` (the stage at 85%) |

Utilities in `pluto-theme`, each an `@utility` unless it says otherwise:

- **`bloom`**: `position: relative; isolation: isolate`. Its `&::before` is `content: ""; position: absolute; inset: -25%; z-index: -1; pointer-events: none`, a `radial-gradient(closest-side, var(--bloom-core), var(--bloom-edge) 60%, transparent)`, opacity 0.6, with `transition: opacity var(--motion-reveal) var(--ease-standard)`. `&[data-lit]::before` has opacity 1. Tailwind 4.3.3 compiles both (EXECUTED by the reviewer).
- **`rim`**: `border: var(--line-width) solid var(--rim-line); border-radius: var(--radius-stage); box-shadow: 0 0 40px var(--rim-glow), inset 0 1px 0 var(--rim-highlight)`.
- **`energized`**: `transition: box-shadow var(--motion-busy) var(--ease-standard)`; on `&[data-busy]`, `box-shadow: 0 0 0 1px var(--energized-line), 0 0 60px var(--energized-glow)`.
- **`veil`**: `background-color: var(--veil); backdrop-filter: blur(var(--blur-veil))`. A plain rule, not an `@utility`, printed after `.surface-stage`: equal specificity, so on an element carrying `class="dark surface-stage veil"` the veil's ground wins while the stage's roles still apply inside (`010` review finding 1). L22 still matches the class token.

- **Why named utilities, not gradient literals:** light becomes a token with one sanctioned shape. Gradient literals stay banned everywhere (the universal literal rule). The systems memo §7.5 recommends this move.
- **Text over light** (review finding 11). The bloom's `::before` sits behind its element. A composition puts opaque cards inside a bloom, never text directly on it. The worst case if text meets the bloom's core is `stage-muted` on the bloom over the stage, a `composite` row: 4.79 (EXECUTED).
- **Text on the veil** (review finding 10): the veil is the stage at 85%, so its worst ground is white. `composite` rows: `stage-muted` on the veil over white 5.38, over paper 5.48; `stage-primary` 5.35 and 5.45; paper 13.16 (EXECUTED). Text on a veil uses the stage roles.
- **The design book's glassmorphism ban** is prior art now (decisions.md). The veil is the floating bar the lab needed.

### 5. Display type

| Step | Min | Preferred | Max | Line height | Tracking | Weight |
|---|---|---|---|---|---|---|
| `display` | 48 px | 6vw | 92 px | 0.95 | −0.045 em | 600 |
| `section` | 36 px | 4vw | 56 px | 1.05 | −0.035 em | 600 |
| `proof` | 56 px | 6vw | 96 px | 1 | −0.04 em | 600, tabular figures |

- Emitted as `@utility type-display`, `type-section` and `type-proof`. Each sets `font-family: var(--font-face-display)`, `font-size: var(--type-<step>-size)` (a `clamp()` in rem), line height, tracking and `font-weight: 600`; `type-proof` adds `font-variant-numeric: tabular-nums`.
- **Why `type-`, not `text-`** (review finding 3): `cn` (tailwind-merge) reads `text-<word>` as a colour, so `cn("text-display", "text-foreground")` drops the step.
- **`--font-face-display`** is emitted on `:root` with the heading family's string from the token file (`type.families.heading.family`). It is not a font item and adds no `html` rule (review finding 5). _Why its own slot:_ the display face is the brand's loudest asset; question D may give it its own cut while headings stay put. A subtree that sets `--font-face-display` changes every display line inside it.
- **Why fluid:** a stage spans a phone and a cinema display. Carbon's largest fluid display step is 92 px (systems memo §2.1).
- **The weight lives in the utility.** No `font-semibold` class is added to the token scale (review finding 22), so no productive item gains a new weight.

### 6. Motion, shape and size

| Token | Variable | Value |
|---|---|---|
| `motion.press` | `--motion-press` | 160 ms |
| `motion.slide` | `--motion-slide` | 220 ms |
| `motion.busy` | `--motion-busy` | 400 ms |
| `motion.reveal` | `--motion-reveal` | 600 ms |
| `motion.fill` | `--motion-fill` | 700 ms |
| `motion.easeStandard` | `--ease-standard` | `cubic-bezier(0.2, 0.7, 0.2, 1)` |
| `motion.pressScale` | `--press-scale` | 0.98 |
| `radius.pill` | `--radius-pill` | 9999px (review finding 16) |
| `radius.stage` | `--radius-stage` | 14 px |
| `size.bar` | `--size-bar` | 72 px |
| `size.action` | `--size-action` | 52 px |
| `size.actionSmall` | `--size-action-small` | 38 px |
| `size.track` | `--size-track` | 6 px |
| — | `--size-hero-fill` | `calc(100svh - var(--size-bar))`, so a hero under a sticky bar fills the screen (`010` review finding 10) |
| `gutter` | `--gutter-stage` | `clamp(1rem, 4vw, 3.5rem)` |
| `blur.veil` | `--blur-veil` | 10 px |

- **`action-press`**, an `@utility`: `transition: transform var(--motion-press) var(--ease-standard)`; `&:active { transform: scale(var(--press-scale)) }`. _Why not `press`:_ the word appears in prose in two shipped files, and the lint reads words (review finding 7).
- Components use the variable form (`h-(--size-bar)`), which the lint always allows.
- **Reduced motion:** the theme's catch-all already sets every transition and animation to 0.01 ms (READ, `scripts/build-tokens.ts`). The five new durations join `--motion-entrance` and `--motion-micro` at `0ms` in its `html:root` block, so a script reading them sees 0. A plain rule in the same block sets `--press-scale: 1`, so a press never scales (review finding 19).
- **A sticky bar never hides focus.** A plain rule, `html:has([data-sticky-bar]) { scroll-padding-top: var(--size-bar) }`, keeps a focused element clear of a bar that marks itself (`010`; WCAG 2.4.11).

### 7. The mode

`data-mode="expressive"` on an element sets the mode's values for its subtree; `data-mode="productive"` resets them.

```
:root, [data-mode="productive"] { --radius-action: var(--radius); }
[data-mode="expressive"]       { --radius-action: var(--radius-pill); }
```

- **`rounded-action`**, an `@utility`: `border-radius: var(--radius-action, var(--radius))`. _Why the fallback_ (review finding 18): an app that re-installs `button` but declines the theme update keeps 8 px corners.
- **Today the mode sets one value.** Question H may move more roles into it.
- **Why an attribute:** it reads as state a component can query (systems memo §7.2).
- **Why variables and no `expressive:` variant:** a variable inherits from its nearest ancestor, so a productive console inside an expressive stage is productive. A descendant variant would also match inside the nested productive island. The systems memo suggested a variant; this specification declines it for that reason.
- **Mode and surface are separate axes.** `surface-stage` picks the ground; `data-mode` picks the volume.

### 8. `button` takes the action radius

- `button`'s `rounded` becomes `rounded-[var(--radius-action,var(--radius))]`. In productive mode the computed radius is unchanged (8 px). _Why the arbitrary form, not the `rounded-action` utility_ (change review finding 1): the fallback must live in the button's own class, so an app that re-installs `button` but keeps its 0.8.0 stylesheet still gets 8 px corners; and `cn` reads the arbitrary form as a radius, so an app's own `rounded-*` merges as before. `rounded-action` stays in the theme for other items.
- In an expressive subtree the button is a pill: the lab's pill buttons are the same component at a different volume.
- `button`'s `meta.modes` is `["productive", "expressive"]`.
- **Changelog note:** the button's radius reads `--radius-action`, with an 8 px fallback; an app's own `rounded-*` on `button` merges as before (the change review's finding 2 is closed by the arbitrary form).

### 9. The lint profile

Every item gains `meta.modes`, an array of `"productive"` and `"expressive"`.

- **Visual items** today are `["productive"]`, except `button`.
- **Mode-agnostic items** (no markup: `utils`, the hooks, the libs, the font items, `pluto-theme`) are `["productive", "expressive"]` (review finding 22).
- shadcn-svelte's item schema already accepts `meta`; every item carries `meta.since` and `meta.group` (READ, `registry.json`).
- **L22, expressive volume.** These fail in any file of an item whose `meta.modes` is not exactly `["expressive"]`: the class tokens `type-display`, `type-section`, `type-proof`, `bloom`, `rim`, `energized`, `veil`, `action-press`, `surface-stage`; and the attribute text `data-mode="expressive"`. L22 matches class tokens through the lint's class tokeniser, as L1 to L18 do. The reviewer's run of the tokeniser over all 63 items finds no hit for the renamed list (the hits were `press`, review finding 7).
- **Why "exactly":** an item that supports productive mode must look right on a productive screen, so it may only grow loud through variables the mode sets.
- **Every other rule binds every profile.** Volume is added by named utilities, never by relaxing a rule.
- **A missing `meta.modes` fails the registry test.**

### 10. `read-token`

A `registry:lib` item, `read-token`, at `src/lib/registry/lib/read-token.ts`:

- `readToken(name: string, element?: Element): string` returns `getComputedStyle(element ?? document.documentElement).getPropertyValue("--" + name).trim()`; on the server, where there is no `document`, it returns `""` (review finding 20).
- `readDuration(name, element?)`: the token as milliseconds (`"600ms"` → 600, `"0ms"` → 0).
- `readEase(name, element?)`: parses a `cubic-bezier(…)` token into a function `t → eased t`, by Newton iteration on the curve's x.
- `tween(options: { from: number; to: number; duration: string; ease: string; element?: Element; onFrame: (value: number) => void }): () => void` animates a number over the named duration and easing with `requestAnimationFrame`, calls `onFrame` with the last value immediately when the duration reads 0, and returns a cancel function. _Why here:_ `010`'s count-up and meters both need it, and both take their timing from the one source.
- **No generated name list** (review finding 8). `name` is a string; the item page lists the readable names. _Why:_ a generated list collides with L19 and L21, and a misspelled name reads as `""`, which the function warns about in development.
- Its preview page draws a small canvas whose four dots are painted from `readToken("mark-N")`, on the page and inside a stage. The canvas has `role="img"` and an `aria-label`, and redraws when the theme class changes (a `MutationObserver` on `html`'s `class`).
- `meta.modes`: `["productive", "expressive"]`. Group `foundation`.

### 11. The preview

- The `pluto-theme` page gains a section, "Expressive mode": the stage with its roles; the three display steps; bloom, rim and energized on a sample card (buttons toggle `data-lit` and `data-busy`); the veil over the stage and over paper; a button in a productive and in an expressive subtree, side by side.
- `read-token` gets its page. The registry grows to 64 items.

### 12. The documents

- `CHANGELOG.md`: a 0.9.0 entry, with decision 8's note.
- `context/handoff.md` is replaced at release.

## Acceptance criteria

1. The token file validates with the `expressive` group; `bun run build:tokens` emits every variable in decision 2's table into `:root`, and none of them into `@theme inline` or `cssVars`. (unit)
2. Every custom property that `v0.8.0`'s `src/app.css` declares in `:root`, `.dark` and `@theme inline` keeps its value; a fixture extracted from `v0.8.0` proves it. (unit)
3. On every productive item page, the computed `font-family` of a heading, a paragraph and a code line, and the computed `border-radius` of a button, equal `v0.8.0`'s, in both themes. (e2e)
4. Every row of decision 3's and decision 4's tables is a row of `contrast.ts` and passes its minimum. (unit)
5. L22 fails each of its nine class tokens and the attribute in a productive item, and passes them in an expressive-only item, as unit cases. The registry lints with zero violations and zero exceptions. (unit)
6. Every item declares `meta.modes`, as decision 9 assigns. (unit)
7. `rounded-action` measures 8 px in productive mode, 9999 px under `data-mode="expressive"`, and 8 px under a nested `data-mode="productive"`. (e2e)
8. Inside `surface-stage`, `bg-background` is the stage, `text-muted-foreground` the stage muted colour, `bg-muted` the stage wash, and a default button's text is ink on lifted blue. (e2e)
9. Under emulated reduced motion, the seven motion durations read `0ms` and `--press-scale` reads `1`. (e2e)
10. At 1440 px wide, `type-display` computes to 86.4 px, `type-section` to 56 px and `type-proof` to 86.4 px; at 390 px, 48, 36 and 56 px. (e2e)
11. Setting `data-lit` gives the bloom's `::before` opacity 1; setting `data-busy` gives `energized` a box-shadow; `action-press` carries a transform transition of `--motion-press`. (e2e)
12. `readToken("mark-1")` returns the light blue on a light page and the lifted blue inside a stage; on the server it returns `""`; `tween` with a `0ms` duration calls `onFrame` once with the final value. (unit and e2e)
13. Setting `--font-face-display` on a wrapper changes the computed font of a `type-display` line inside it. (e2e)
14. The `pluto-theme` and `read-token` pages pass axe in both themes. (e2e)
15. `bun run test`, `bun run check` and `bun run lint` pass. Expectations change only where this specification changes a count or a list: the item count (63 → 64) in the registry, previews and generated tests; the item order in `tests/e2e/pages.ts` and the keyboard walk; the smoke tests that count installed theme variables. `deps.test.ts` names the identity exhibit's six font packages (decisions.md, "The identity is commissioned"). (all suites)

## Build checkpoints

1. After decisions 2, 7, 8 and 9 (the variables, the mode, the button, L22): the design lead looks at the `pluto-theme` and `button` pages in both themes before the builder goes on (review finding 24).
2. After the utilities and the preview section.

## Risks

- **Expressive leaks into productive screens.** L22 and the `meta.modes` rule are the guard.
- **The slots invite unchecked values.** A subtree can set `--stage` to anything. The token file stays the only source the registry ships.
- **The CLI's handling of `css[":root"]`.** Smoke test 4 installs `pluto-theme` into a fresh app and checks the variables arrive; the builder runs it at checkpoint 1.
- **`surface-stage` without `dark`.** The stage must be used as `class="dark surface-stage"`. Without `dark` the fills keep their light foregrounds: a default button is white on lifted blue, about 2.6:1 (build review finding 7).
- **A utility on the same element loses.** `.surface-stage` and `.veil` are unlayered rules, as `surface-ink` is. A `bg-*` or `text-*` class on the same element loses to them; set the stage's ground through `--background` instead (build review finding 7).
- **`.veil` is a global class name.** An app with its own `.veil` gets the theme's ground and blur when it updates the theme (build review finding 7).

## Review dispositions

Each finding of the specification review, by number.

1. Fixed: decision 3 leaves every fill's foreground at its dark value.
2. Fixed: font slots narrowed to the display face, emitted by the theme, not a font item; the rest wait for question D.
3. Fixed: the steps are `type-*`.
4. Fixed: decision 2 places every variable in `css[":root"]`.
5. Fixed: no `type.families.display`; the display slot is a variable.
6. Fixed: decision 3 specifies the stage set and the `composite` row.
7. Fixed: `action-press`.
8. Fixed: no generated list.
9. Answered: only the display slot is in scope; the others wait for question D.
10. Fixed: the veil is the stage at 85%; measured.
11. Fixed: bloom geometry written; text never on it; worst case measured.
12. Fixed: criterion 15 names what changes.
13. Fixed: criteria 10 and 11.
14. Fixed: figures truncated.
15. Fixed: `amber`.
16. Fixed: `radius.pill`.
17. Fixed: decision 2's table.
18. Fixed: the fallback and the changelog note.
19. Fixed: `--motion-slide` in criterion 9; `--press-scale` resets.
20. Fixed: decision 10.
21. Fixed: the ring at 70%.
22. Fixed: the attribute in L22; no `font-semibold`; mode-agnostic items.
23. Answered: the meter fill and the lit code card are `010`'s (with `tween`); the lab's 70% muted text is `--stage-muted`.
24. Fixed: two checkpoints.

## Landing notes

- **Built** in the working tree on top of `6fbdf99`, uncommitted, by the owner's ruling ("nothing goes to GitHub until the owner asks"). The version moved to 0.9.0 at the build's start (decisions.md, "After the `009` build's checkpoint"), then to 0.10.0 when `010` began; the two ship together.
- **Checkpoint 1** (the variables, the mode, the button, L22): the design lead looked at `pluto-theme` and `button` in both themes; productive screens unchanged.
- **Deviations, each sound** (change review finding 8):
  - `.surface-stage` is one plain rule, not two: the stage is the same in both themes, so `surface-ink`'s dark-page rule has no counterpart.
  - The mode rule is split into `--radius-action` on `:root` and its own `[data-mode="productive"]` rule; the CSS behaves the same.
  - `--press-scale: 1` sits in the existing reduced-motion `html:root` block.
  - Token shapes: `display.family: "heading"` names a family role; the contrast set is `{ pairs, composites }`, a composite carrying `overTheme`.
  - Criterion 3 measures every `buttonVariants` element (42 of 64 pages have no `Button`, but every page has the theme toggle).
  - An installed app's files take the productive profile, the strictest, since an app has no `registry.json`.
- **Contrast, as `contrast.ts` computes it** (these figures replace decisions 3 and 4's text where they differ): energized line 4.19 on the stage and 4.11 on the raised card; on the veil over the light card, muted 5.40, primary 5.37, paper 13.20; over the light ground, muted 5.48, primary 5.45. Every one of the 21 rows passes.
- **Change review fixes:** the button's radius is `rounded-[var(--radius-action,var(--radius))]` (finding 1; decision 8 rewritten); L22 also catches class-object keys, every form of `data-mode` set to expressive, `setAttribute("data-mode", …)` and `dataset.mode` (finding 3); `tween` honours a cancel from inside `onFrame` and treats a non-finite duration as 0 (finding 4); the `read-token` tests can fail (finding 5); the Risks section names the plain rules' edges (finding 7).
- **Tests:** unit 826 pass; e2e 1786 passed (both projects); smoke 109 pass; `check` 0 errors; `lint` clean; the literal lint 0 violations, 0 exceptions, over 321 item files. These are the full runs after `010` was built on top (`010`'s landing notes).
