# 025 — Component cost

- **Status:** Ready to build after `020`: review approved with changes, all applied. The specification review, [`../reviews/025-component-cost-spec-2026-11-15.md`](../reviews/025-component-cost-spec-2026-11-15.md), found 2 High, 13 Medium and 5 Low; its re-review found R1 (High) to R8. Every finding is answered under "Review"; R7 is `026`'s to restate, and `026` has restated it. The owner answered Q1 to Q8 on 2026-11-15, each with the recommended option (see Landing notes). Ready to build after `020`.
- **Date:** 2026-11-15
- **Author:** the spec author for `025`, for the design lead
- **Kind:** test harness and published data. New files under `scripts/cost/`, new tests, one `package.json` script, one line in `scripts/site/release-check.ts`, and one `exclude` entry in `tsconfig.json`. **No interface change:** no item's source, props or files change. No new dependency: the harness uses Bun, the repository's locked `shadcn-svelte` CLI, Playwright and Prettier. The cost app's own lockfile pins only versions the repository's `bun.lock` already resolves (decision 2).
- **Lane:** E (the test harness), in new files. It shares the lane with `022`. The two share one file, `scripts/site/release-check.ts`; decision 16 says which part each owns and the landing order.
- **Depends on:** `020`, the Kuiper rename, built first. Item names are as `020` leaves them; "the theme item" means `pluto-theme` before `020` and its new name after. The smoke harness, `tests/smoke/process.ts` and the `kit3` fixture (`001` decision 25).
- **Feeds:** `026` (its fixture, its interaction and two cases, decision 10); `030` (the facts line reads decision 14's report); `037` and `042` (their large-data cases); `040` (installs by npm and pnpm; it reuses the template app).
- **Ranked by:** [`../roadmap.md`](../roadmap.md) §2, 0.13.0, row `025`, and §3 "`025`, component cost".
- **Research it stands on:** [`../research/2026-11-15-component-cost.md`](../research/2026-11-15-component-cost.md) (cited as *cost* §n), including its dated correction (*cost* §9), which re-scores Material 3 and adds the prototype's pairing, press-gap and no-op data. The scorecard: [`../research/benchmark-scorecard.md`](../research/benchmark-scorecard.md).

## Intent

An app that installs a Kuiper item pays for it in bytes and in time. Nobody measures that today, here or in the reference systems. Material Web publishes a size table and holds nothing to it. Primer and Spectrum measure, and publish nothing (*cost* §1).

This specification measures each item where the cost is paid: in a real SvelteKit app, built by the real toolchain, installed by the real CLI. It records size, hydration and, for interactive items, response time. Each figure gets a budget. A figure over its budget fails the build. A budget rises only by a recorded ruling. The figures land in one committed file, which `030` puts on each component page.

**Terms of art.**

- **The cost app**: a minimal SvelteKit app kept in `scripts/cost/app/`, from which every measured app is copied.
- **The empty app**: the cost app with nothing added.
- **The theme floor**: the cost app with the theme item and `utils` added, rendering nothing from them.
- **The floor**: the theme floor whose page also calls `cn` once (decision 1; open question 7). Every item but `liquid-glass` needs both.
- **An item app**: the floor plus one item, added by the CLI, with a page that renders it: its **fixture**, or for a block, the route the block installs.
- **Alone**: an item's figure when it is the only Kuiper item an app renders: the item app minus the floor.
- **Gzipped**: compressed with gzip at level 9 by Bun's `node:zlib`, file by file, then summed.
- **Initial** JS and CSS: the files the page's prerendered HTML loads, with their static imports. **Lazy** JS: the other JS files of the build. **Assets**: every other file of the build.
- **Hydration time**: from the page's HTML arriving (`responseEnd`) to the root layout's `onMount`. The item's figure is its app's time minus the floor's, the two measured side by side (decision 12).
- **The main interaction**: the one input that best shows an interactive item at work (decision 9).
- **Response time**: from the trusted timestamp of the event that starts the item's work to two animation frames after the expected state is seen. React Aria's suite calls this "opportunity" (*cost* §2.3). It is comparable in kind to one INP interaction, not equal to it: INP ends at the next paint after the handlers, and is a field measure over many people's interactions.
- **The no-op click**: a click on the floor's heading, which does nothing. Its response time is the harness's own floor, about 41 ms under 4× (*cost* §9.4).
- **Under 4×**: with Chromium's main thread slowed four times (`Emulation.setCPUThrottlingRate`). Lighthouse uses the same multiplier (*cost*, terms). Public text says "a 4× slower CPU" and makes no claim about devices.
- **A launch** is one browser process. **A block** is the run of trials for one item inside a launch: floor, item, floor, item, floor, item, floor (decision 11).
- **The size hash** and **the runtime hash**: SHA-256s over everything that decides an item's size figures, and its runtime figures (decision 13).
- **The release machine**: the machine named in `budgets.json`'s `machine` field, on which the tag's full run is made.

## What the research found

Figures from the prototype are approximate: it installed with the CLI's default package install, so its apps held `bits-ui` 2.21.0 and `cn` 0.5.2 where the repository's lock resolves 2.20.2 and 0.5.0 (*cost* §9.1). The first real figures are criterion 12's run.

- **No reference publishes and enforces a per-component cost.** On row 15, scored on the sites the scorecard names, every reference scores 0. Material Web's table is on a per-platform site and is older than its current release (*cost* §9.5).
- **Every reference measures the library, not an app.** Dependencies are made external or CSS is stubbed out (*cost* §2.1). For Tailwind source, only an app's build creates the CSS.
- **The in-app delta works and is deterministic.** Over the theme floor, gzipped, about: `separator` 18.3 kB JS and 0.2 kB CSS; `button` 20.9 and 0.9; `dialog` 37.8 and 1.6; `dropdown-menu` 47.0 and 1.4. Two clean builds were byte-identical. A rebuild over a stale `build/` was not (*cost* §4).
- **`cn` is about 10.9 kB of each of those figures.** The four items together cost 46% of their summed alone figures (*cost* §4).
- **Paired hydration resolves to a few milliseconds.** A/A differed by a median 0.9 ms. `button` added 31 ms; `dialog` 36; `dropdown-menu` 41 (*cost* §5).
- **Response time is mostly the harness's frame floor for small items.** A no-op click measured 41 ms; `button`'s click 43; opening `dialog` 96 to 108; `dropdown-menu` 107 to 109. Playwright's press-to-release gap was 0 ms at the median, under 5 ms at most, so which event starts the clock moves the figure by under 1 ms (*cost* §9.4).
- **A busy launch is per-trial noise, not only drift.** Pairing each item with floor trials seconds away cut `separator`'s worst launch from 14.6 to 6.2 ms; the A/A pair's worst launch stayed at 15.8. The median over launches absorbed it either way (*cost* §9.3).
- **The CLI asks the npm registry about the fonts on every `add`** and rewrites `package.json`; pointed at a dead registry address it still exits 0 (*cost* §9.2, from the review's run).

## Decisions

### 1. Measure in an app, over the floor

- Each item is added to its own copy of the floor by the CLI. Its fixture, or its route, renders it. The item app is built for production. Its figures minus the floor's are the item's **alone** figures.
- **The theme item's** figures are the theme floor minus the empty app. **`utils`'** figures are the floor minus the theme floor: what `cn` costs, once. The three **font items** are inside the theme floor: each one's row gives the gzipped bytes of its font files, which a page fetches only for the subsets it uses.
- **`cn` is in the floor.** The floor's page renders `cn("a", "b")` once. So no item's alone figure holds `cn`, and `utils`' row is the one place it is counted. *Why:* for the reason the theme is in the floor. 74 of 75 items need it, and counting it in each row charges it 74 times, about 60% of `separator`'s figure (*cost* §4). Open question 7 asks the owner to confirm. If the answer is no, the floor is the theme floor, and `utils`' row says "counted in every item's figure" instead of a number.
- *Why the floor, not the empty app* (the roadmap's "compared with an empty app's"): the theme's 6.0 kB of CSS and `cn`'s 10.9 kB of JS would be charged to every row. Both are real and are published, once, on their own rows.
- *Why alone:* it is what an app pays for its first item. It changes only when the item, or an item it pulls in, changes (`dialog` pulls `button`). It is an upper bound for an app with many items, and decision 7 says so wherever it is shown.

### 2. The cost app

- `scripts/cost/app/` is a copy of `tests/smoke/fixtures/kit3` (SvelteKit 3, adapter-static, prerendered, Tailwind 4, `#lib`), with four changes:
  1. `package.json` lists, as exact versions, every npm package any built item in `static/r/` names in its `dependencies`, its `devDependencies` or its `font.dependency`, at the version the repository's `bun.lock` resolves. Its own `bun.lock` pins them.
  2. The root `+layout.svelte` calls `performance.mark("cost:hydrated")` in `onMount`.
  3. `vite.config.ts` adds a small plugin that writes each client chunk's modules and rendered lengths to a file **outside the app** (decision 7).
  4. A `.gitignore` lists `build/`, `.svelte-kit/` and `node_modules/`, so Tailwind's source detection skips them (*cost* §4, "A trap").
- *Why its own lockfile:* constitution §4.5 pins every input. With ranges resolved at add time, a `bits-ui` patch release could fail a budget with no commit here, as the prototype's drift shows (*cost* §9.1). With the lock, a version moves only when the lock is updated, and the update is reviewed.
- *Why the repository's versions:* the cost app then pays for what the site and the tests run. A unit test holds them equal (criterion 3).
- `tsconfig.json` excludes `scripts/cost/app` and `scripts/cost/fixtures`: neither type-checks inside the repository, since the fixtures import an installed path that exists only in an item app. They are type-checked where they run (criterion 19).

### 3. How an item is installed, offline

1. The harness serves the built registry, `static/r/`, read-only, from a Bun file server on a free port. It never starts `vite dev`, and never uses port 5199.
2. **Every CLI run is offline, and fails its lookups fast.** One constant in `build.ts`, `OFFLINE_ENV`, holds every variable, and every CLI run gets all of them:
   - `BUN_CONFIG_REGISTRY` and `npm_config_registry`: `http://127.0.0.1:9/`, a closed local port, so no package lookup leaves the machine (open question 8);
   - `npm_config_fetch_retries`: `0`, so a failed lookup is not retried. Without it the lookups back off against the closed port: an offline `add` took 72.1 and 72.3 s, against 2.08 s with retries off and 0.66 s online (EXECUTED (re-review)).
   - The `add` still exits 0 and writes `"latest"` for the fonts, which step 5 then undoes (*cost* §9.2). An `add` that takes over 10 s fails the item, naming `OFFLINE_ENV` (criterion 22).
   - *Why not the CLI's hidden `--no-deps`*, which skips the lookups (0.2 s, the same files, EXECUTED (re-review)): it is undocumented, and it leaves no `package.json` change to check against the template, which is how step 5 proves criterion 3 at run time.
3. It prepares one **template** in a fresh temporary folder: copy the cost app, `bun install --frozen-lockfile` (which reads only Bun's cache; a cold cache is the one step that may need the network, and the harness says so when it fails), `svelte-kit sync`, then `shadcn-svelte add <theme item> utils -y -o --no-deps-install` with the repository's locked CLI under Bun (`tests/smoke/process.ts`'s `bin`). Built with `_floor.svelte`, the template is the floor; with `_theme-floor.svelte`, the theme floor. The cost app built with no `add` is the empty app.
4. For each item it copies the template, without `build/` or `.svelte-kit/output`, into a fresh folder, with `node_modules` linked to the template's (the review rebuilt a linked copy byte for byte, *cost* §9.2). It runs `add <item> -y -o --no-deps-install`.
5. **It checks and restores `package.json`.** It compares the item app's `package.json` with the template's. A package the template lacks fails the item, naming the package: criterion 3, proved at run time. Then it restores the template's file, so the built tree is the hashed one.
6. It writes the fixture over `src/routes/+page.svelte`, or for a block leaves the installed route as it is, and runs `vite build`.
- *Why `--no-deps-install`:* the template already holds every package at its pinned version. The smoke test, not this harness, proves the CLI's install (`001` decision 25; `040` adds npm and pnpm).
- **The registry guard.** Before anything else, the harness runs `bun run build:registry --out <a temporary folder>` and compares that folder's `r/` with `static/r/` by content. If they differ, it exits 2 and says to run `bun run build:registry`. *Why by content:* a checkout sets file times arbitrarily, and `static/r/` is committed.

### 4. What is counted

- **Initial JS and CSS:** the files the page's prerendered HTML references (its `modulepreload` links, the start script's two `import()`s, its stylesheets), with their static imports from the client manifest, `.svelte-kit/output/client/.vite/manifest.json`. Each gzipped, then summed.
- **Lazy JS:** every other `.js` file under `build/_app/`. Gzipped and summed.
- **Assets:** every other file under `build/_app/`. A compressible one (`.wasm`, `.svg`, `.json`, `.txt`, `.map` excluded from the build) is gzipped; fonts and images are counted raw. `tree-sitter-typescript.wasm` is 1,413,849 bytes raw and 132,982 gzipped (*cost* §9.6), so the raw figure would mean nothing on the wire.
- **Brotli** at quality 11 is recorded beside each gzipped figure. It is not budgeted.
- 1 kB is 1,000 bytes. A figure is stored in bytes. The report records the compressor (`process.versions.zlib`), because another zlib gives other bytes: Python's gave 0.5% fewer on the same files (*cost* §9.2).
- *Why gzip:* it is what the scorecard's row 8 and most tools speak. Brotli is 10 to 12% smaller here (*cost* §4) and is recorded for readers who serve it.

### 5. Hydration time

- Each trial loads the app in a new browser context, so no cache is warm: the cost of a person's first visit. React Aria's suite measures warm module caches instead (*cost* §2.4); the difference is deliberate.
- A trial reads the `cost:hydrated` mark minus the navigation's `responseEnd`.
- An item's launch-level figure is the median of its block's item trials minus the median of the same block's floor trials (decision 12). Its figure is the median of the 6 launch-level figures.
- **What it leaves out:** work begun at or after mount, such as highlighting, a chart's layout, an `IntersectionObserver` callback (`proof-band`), or a fetched asset. For an item whose fixture starts such work, the fixture sets a second mark, `cost:settled`, when the work is done. The time to it is recorded as `settledMs`, beside the figure, and not budgeted. The fixtures of `code-block`, `code-editor`, `stage-card`, `live-console`, `chart`, `highlighter`, `use-highlighted-code` and `proof-band` set it.
- A figure under 5 ms is stored as measured and shown as "under 5 ms". The A/A spread was ±5.6 ms (*cost* §5).
- Every measured item gets a hydration figure, interactive or not.

### 6. Response time, and Event Timing beside it

- **Each entry names the event that starts its clock** (decision 9's table): `click` for an item whose work runs on click; `pointerdown` for one that acts on the press (`bits-ui`'s menu trigger opens on `pointerdown` for a mouse, READ, `node_modules/bits-ui/dist/bits/menu/menu.svelte.js`, `DropdownMenuTriggerState`, at 2.20.2); `keydown` for a key; `pointerover` for a hover.
- The harness arms the measure before the input: a capture listener records the named event's trusted `timeStamp`, and a frame loop resolves two frames after the entry's expected state is seen. Then Playwright sends the input. The arming expression ends in a plain value, never a promise (*cost* §5's fault).
- For a click it also records the gap from `pointerdown` to `pointerup`, beside the figure. The prototype measured 0 ms at the median, under 5 ms at most (*cost* §9.4).
- The figure is the median of the 6 launch-level medians of the item's trials. It is the time a person waits, not a difference. The floor's trials in the same block make the no-op click; its figure is recorded per run as `noopMs`, beside every response time, so a reader can see the harness's own floor.
- Event Timing's largest `duration` for the interaction is recorded beside it, from an observer at `durationThreshold: 16`. It is not budgeted: it moves in 8 ms steps and hides anything under 16 ms (*cost* §2.3). A hover has no entry, and the report says so.
- Preparing the state (typing a message before Enter sends it) happens before the measure is armed.

### 7. Shared code: counted in full, and shown

- The alone figure counts every dependency the item brings beyond the floor: `bits-ui`, other Kuiper items, the part of the Svelte runtime it switches on. `cn` and the theme are in the floor (decision 1).
- Each item's row carries a **breakdown** of its initial JS by source: `own` (the item's own files), `item:<name>` (each Kuiper item it pulls), `package:<name>` (each npm package), and `runtime` (Svelte, SvelteKit and `devalue`, over the floor). The plugin's rendered lengths are taken over the floor's, and each group's share of the gzipped total is apportioned by its share of the rendered bytes. The breakdown is labelled approximate. Its groups sum to the total within 1 byte per group.
- **The catalogue** is one more app, rendering every non-block item's fixture on one page. Its initial JS and CSS are reported beside the sum of the same items' alone figures, blocks left out of both, so the two compare like with like.
- *Why not a second per-item figure* (what removing the item from the catalogue saves): about 10 more minutes per full run. Open question 5.

### 8. Fixtures and routes

- **A non-block item** has one file, `scripts/cost/fixtures/<item>.svelte`. It renders the item in its plain default form, with the fewest props that make it render (a dialog with a title and a close button; a table with three columns and five rows).
- It imports only from its own item's installed path, and from `svelte`. What else the item needs, the item pulls itself.
- It may mark its input target with `data-cost="target"` and render one `<output data-cost="state">` that its handler updates. It is the entry's `target` selector that the harness uses (decision 9), so a fixture may also leave its target unmarked and name it by role.
- **A block** has no fixture file. It is measured at the route it installs, `/<block>/`, as the CLI writes it. Its entry's `target` names an element of that route by role and name, since the route is item source that this specification does not change.
- A fixture sets a delay prop to 0 where the item waits by design (the tooltip's open delay), so the figure is the item's work, not its timer. The entry says so.
- A lib or hook fixture calls its function and renders the result. The theme item and the three fonts have no fixture: they are the theme floor.
- **The harness's own pages**, not items: `_floor.svelte` (one heading, and `cn("a", "b")` rendered once); `_theme-floor.svelte` (one heading); `_calibrate.svelte` (a button whose click handler blocks for 50 ms by the clock).
- **Counts, in general:** every registry item is a floor item (the theme item, the fonts), a block (measured at its route), or has a fixture file. At this specification's landing, 75 items: 4 floor items, 8 blocks, 63 fixture files, so 71 measured items. With `026`'s `toast`: 76 items, 64 fixture files, 72 measured.

### 9. The main interactions

`scripts/cost/interactions.ts` holds one entry per interactive item, keyed by the item's name, and one per case that has an interaction, keyed `<item>.<case>` (decision 10). Each entry has:

- `kind`: `click`, `key`, or `hover`;
- `start`: the event that starts the clock (decision 6);
- `target`: a selector that matches exactly one element of the page;
- `state`: a script expression, true once the interaction's work is done;
- `says`: the verb `costFacts` uses ("opens", "shows", "updates", "sends", "copies", "toggles", "selects", "expands", "focuses");
- `viewport`: `"1280x800"` unless stated;
- `prepare`, optionally: a script expression run before the measure is armed;
- `note`, optionally: what the figure includes that is not the item's own work.

Every field is a string: no function, number or object. So an entry's canonical serialisation, its keys sorted, is exact, and the runtime hash (decision 13) sees any change to it.

| Item | Kind, start | Target | The state that ends it | Says |
|---|---|---|---|---|
| `button` | click, `click` | `[data-cost=target]` | `[data-cost=state]` reads 1 | updates |
| `theme` | click, `click` | the toggle button | `<html>` carries the dark scheme | toggles |
| `tooltip` | hover, `pointerover` | the trigger | The tooltip's content is visible (open delay 0) | shows |
| `toggle` | click, `click` | the toggle | `aria-pressed="true"` | toggles |
| `toggle-group` | click, `click` | the second item | The second item is on | selects |
| `tabs` | click, `click` | the second tab | It is selected and its panel shown | selects |
| `collapsible` | click, `click` | the trigger | The content is present and open | expands |
| `popover` | click, `click` | the trigger | The content is open with focus inside | opens |
| `accordion` | click, `click` | the first trigger | The first item is expanded | expands |
| `alert-dialog` | click, `click` | the trigger | `role="alertdialog"` is open with focus inside | opens |
| `dialog` | click, `click` | the trigger | `role="dialog"` is open with focus inside | opens |
| `sheet` | click, `click` | the trigger | The sheet's dialog is open with focus inside | opens |
| `dropdown-menu` | click, `pointerdown` | the trigger | `role="menu"` is open with focus inside | opens |
| `error-summary` | click, `click` | the first link | The link's field is focused | focuses |
| `checkbox` | click, `click` | the checkbox | `aria-checked="true"` | toggles |
| `radio-group` | click, `click` | the second radio | It is checked | selects |
| `switch` | click, `click` | the switch | `aria-checked="true"` | toggles |
| `input-otp` | key `1`, `keydown` | the input | The first slot holds 1 | updates |
| `input-group` | click, `click` | the password group's "Show password" button | The input's `type` is `text` | toggles |
| `code-block` | click, `click` | the copy button | Its status says the code was copied | copies |
| `code-editor` | key `a`, `keydown` | the editor's content | The editor's text holds the new character | updates |
| `chart` | hover, `pointerover` | a point of the first series | The tooltip shows that point | shows |
| `sidebar` | click, `click` | the sidebar trigger | `data-state="collapsed"` | toggles |
| `composer` | key Enter, `keydown`; prepare: type "Hello" | the textarea | `[data-cost=state]` reads 1 | sends |
| `stage-card` | click, `click` | the copy button | Its status says the code was copied | copies |
| `marketing-bar` | click, `click`; viewport 390 × 844 | the menu button | The phone menu's sheet is open with focus inside | opens |
| `live-console` | click, `click` | the second tab | Its commands are shown | selects |
| `sign-in` | click, `click` | the submit button | The error summary is focused | shows |
| `sign-up` | click, `click` | the submit button | The error summary is focused | shows |
| `settings` | click, `click` | the delete action | The confirmation's `alertdialog` is open with focus inside | opens |
| `app-shell` | click, `pointerdown` | the user menu's trigger | `role="menu"` is open with focus inside | opens |
| `chat` | key Enter, `keydown`; prepare: type "Hello" | the composer's textarea | The new turn is in the log | sends |

- 32 entries at this specification's landing. The builder confirms each `start` against the item's source in build step 2; a different event is a correction to this table in the landing notes, not a new decision.
- **Notes the entries carry.** `code-block` and `stage-card`: the figure includes the browser's asynchronous clipboard write, run with the clipboard permission granted. `tooltip`: the open delay is set to 0. `marketing-bar`: its block's floor trials run at its viewport too (decision 12).
- **No main interaction** (hydration and size only), 39 items: `four-dot`, `read-token`, `liquid-glass`, `kbd`, `card`, `separator`, `item`, `table`, `avatar`, `alert`, `badge`, `empty`, `skeleton`, `spinner`, `status`, `label`, `field`, `input`, `textarea`, `native-select`, `highlighter`, `use-highlighted-code`, `code-languages`, `meter`, `breadcrumb`, `is-mobile`, `message-log`, `message`, `marker`, `stage`, `stage-hero`, `proof-band`, `name-strip`, `cta-band`, `marketing-footer`, `hero`, `page-states`, `product-home`, `utils`. Not measured on their own: the theme item and the three fonts (the theme floor).
- *Why these are left out:* each is static, native (typing into `input` is the browser's work), or moves only by pointer motion or a timer (`liquid-glass`'s lit edge, `proof-band`'s count) that no click or key starts. `message-log`'s "back to the end" button exists only after the reader scrolls away; `chat` covers the log's work.
- *Why one interaction each:* one figure fits the facts line and one budget. A case (decision 10) adds another by the same mechanism.
- **Validity.** An entry keyed `<item>` needs a registry item with an item app. An entry keyed `<item>.<case>` needs that item and `scripts/cost/fixtures/<item>.<case>.svelte`. Every entry's `target` matches exactly one element: in a fixture's built page, or in a block's prerendered route (criterion 2).

### 10. Large-data cases, and cases in general

- An item may have **cases**: more fixtures, `scripts/cost/fixtures/<item>.<case>.svelte`, each built as its own item app, with the same import rule as the item's fixture.
- A case with an `interactions.ts` entry keyed `<item>.<case>` gets a response time; a case without one is hydration only.
- A case's data is built in the fixture, deterministically, before render. Its size figure includes that data, so a case's JS and CSS are reported, not budgeted. Its hydration and response time are budgeted.
- **The report shape** of a case is an item's (decision 14): `items.<item>.cases.<case>` holds `hash`, `runtimeHash`, `run`, `size`, `hydrate` and `interaction`. Its budget is `budgets.json`'s `items.<item>.cases.<case>`.
- **This specification ships one case:** `table.1000-rows`, 1,000 rows and 5 columns, hydration only. It is a large-data case held by a budget, row 15's (d). Open question 4 lets the owner hold it for `037` instead.
- **`026` adds two**, `toast.burst` and `toast.progress`, each with an entry, and `toast` itself with an entry (`026` decision 25). With them, and this specification's 32 entries, `interactions.ts` holds 35 entries.
- `037` adds `combobox.1000-options` and `042` adds `data-table.10000-rows` (roadmap §3).

### 11. How many runs, which statistic

- **Sizes:** one build per app. Builds are deterministic for equal inputs (*cost* §4), so a size is measured once and never re-measured.
- **Runtime: 6 launches, one block per item per launch.** A launch opens with 1 discarded warm-up load of the floor. Then each item, in an order shuffled per launch by a fixed seed, runs its block: **floor, item, floor, item, floor, item, floor**, all at the item's viewport. Floor trials make the no-op click; item trials make the item's interaction.
- An item's launch-level hydration figure is the median of its block's 3 item trials minus the median of its block's 4 floor trials. Its response time's launch-level figure is the median of its 3 item trials. Each figure is the median of the 6 launch-level figures. The spread beside it is the lowest and highest launch-level figure.
- *Why blocks:* in a full launch of about 72 items, a floor measured once per launch would sit minutes from most items, and drift between them would not cancel. In a block it sits seconds away. In the prototype, pairing each item with floor trials seconds away cut `separator`'s worst launch-level difference from 14.6 to 6.2 ms, and its range from 17.7 to 7.1; `button`'s range from 19.4 to 14.5; `dialog`'s from 26.5 to 23.1. It did not cancel the A/A pair's worst launch, 15.8 ms either way: that launch's own trials were noisy (the floor read 84.6 to 118.5 within it), which no pairing removes. The median over 6 launches absorbed it: every method gave medians within 1.5 ms of each other (*cost* §9.3).
- *Why 3 item trials, not 8 launches:* the first revision's block of 2 item trials raised the noise. Re-cut from the prototype's samples and bootstrapped (*cost* §10.1), the A/A figure's standard error over 6 launches was 3.7 ms with 2 item trials, 2.8 ms with 2 item trials and 8 launches, and 2.5 ms with 3 item trials and 6 launches; the items' fell to 1.5 to 3.2 ms. The A/A figure passed ±8 ms in 99.5% of resamples with 3 item trials, against 92.9% with 2. Three item trials cost 42 loads per item, against 40 for 8 launches of the old block, and give the lower noise.
- *Why 6 launches:* in the prototype the median of the first 3, 4, 6 and 8 launches stayed within 0.5 ms for `button` and 6 ms for `dialog` (*cost* §5). 6 launches also give a usable Hodges–Lehmann interval if a later specification wants a verdict; this one uses no interval.
- **The run settings live in one hashed file,** `scripts/cost/settings.ts`: the CPU rate (4), the launches (6), the block shape (`FIFIFIF`), the warm-ups (1), the default viewport, the gzip level (9), the Brotli quality (11), the timeouts, the load wait and the instrument band. `run.ts` parses flags and holds no setting. `settings.ts` is in both hashes (decision 13).
- **A runtime figure over budget is re-measured** at once: that item alone, 6 more launches of its block.
- **The bar for the gate.** Criterion 12's second full run may hold at most one figure over budget after the re-measure. If it holds more, the item trials per block or the margins change, by a ruling in the landing notes, before budgets are written. The bootstrap puts a single item's chance of failing a first budget and then its re-measure at well under 1% (*cost* §10.1). It fails only if the second figure is also over. A size over budget fails at once.

### 12. Noise: wait, sample, check the instrument

- **Wait.** Before the runtime phase, the harness waits for the one-minute load average to fall below the core count, for at most 3 minutes, sampling every 10 s. It then starts regardless. The builds have finished by then.
- **Sample.** It reads the load at the start of every launch and records the maximum and the median for the run.
- **Check the instrument.** Two figures, measured in every run, do not depend on any item: the floor's own median hydration (`floorHydrateMs`) and the no-op click (`noopMs`). Each run's median of each must fall within ±15% of its committed value in `budgets.json`'s `instrument` field (single launches may stray further), and `_calibrate.svelte`'s response time must be at least 50 ms and at most 50 ms plus `noopMs` plus 16 ms. If any fails, the run is **noisy**.
- A noisy run's figures are written, marked with the run's `noisy: true`. The unit gate holds its sizes and hydration to their budgets as usual, and **its response times only to the 200 ms ceiling, on any machine**: holding a noisy wait to its budget would turn noise into failures for the re-measure to rescue. The release check refuses a noisy run (decision 16).
- **Who writes the instrument values, and when.** Only `bun run cost --budget instrument` writes them. It reads the newest run's `floorHydrateMs` and `noopMs`, and refuses unless that run is `--full`, on the release machine, with `_calibrate.svelte` inside its bound. (It cannot ask that the run be quiet by the instrument check, since that check is defined against the values being written.) It is run at criterion 12's first full run, and again by the builder of any specification that moves the instrument (a Playwright, Chromium or harness change), at that build, before its other budgets. The landing notes of that specification give the old and new values and the reason. Criterion 7's walk skips `instrument`; it is not a budget.
- *Why this works on a shared machine:* the prototype ran at load averages of 13 to 36 on 10 cores. The floor's run medians were 109.2, 113.0 and 122.5 ms, within +12.2% of the quietest; its single launch medians ranged 89.0 to 127.4, which is why the band applies to a run's median. The clean no-op run's launch medians stayed within 37.8 to 45 ms (*cost* §5, §9.4, §10.2). A load-average threshold alone would have refused every run that day. Measured against a quiet baseline, a run as busy as those would be flagged, which is the intent.
- **The release procedure:** the tag's full run is made on the release machine, plugged in, with nothing else running.

### 13. Two hashes, and the cache

- **The size hash** covers: the served JSON of the item and of every item in its `registryDependencies` closure, as built in `static/r/`; its fixture file, or for a block its route as served; its case files; `_floor.svelte` and `_theme-floor.svelte`; every file under `scripts/cost/app/`; `scripts/cost/build.ts`, `scripts/cost/hash.ts` and `scripts/cost/settings.ts`; the CLI's version as the repository's `bun.lock` resolves it; and the compressor's version **as the report's newest full run names it** (below).
- **The runtime hash** is the size hash plus: the item's `interactions.ts` entry, canonically serialised (keys sorted; every field a string, decision 9); `_calibrate.svelte`; `scripts/cost/runtime.ts` and `scripts/cost/stats.ts`; and Playwright's version. (`settings.ts` is already in the size hash.)
- **Bun's version is recorded, not hashed.** `package.json` does not pin Bun exactly (`packageManager` 1.3.14, `engines` `>=1.3.14`), and the machine that ran the prototype had 1.4.4. The unit gate warns, and does not fail, when the local Bun differs from the report's. The release check refuses the mismatch.
- **The compressor follows the report, not the machine.** `process.versions.zlib` comes with the local Bun's build, so hashing the local value would call every item stale on another Bun, and bring back the portability fault. So:
  - the unit gate computes every size hash with the zlib version recorded in the report's newest `full` run, and warns when the local `process.versions.zlib` differs;
  - `bun run cost` refuses a cached run when the local zlib differs from that run's, and says to use the same Bun or run `--full`; a `--full` run records its own;
  - the release check refuses a mismatch, as for Bun.
  - *Why not pin Bun exactly:* `package.json`'s `packageManager` and `engines` are a repository-wide choice outside lane E. If the owner pins Bun later, this rule still holds.
- `bun run cost` rebuilds only items whose size hash differs from the report's, and re-measures runtime for items whose runtime hash differs, each with its blocks' floor trials. `--full` ignores the cache.
- **Inputs that force a full run:** the theme item, `utils`, `_floor.svelte`, `_theme-floor.svelte`, anything under `scripts/cost/app/` (a package added or bumped changes the lock), `build.ts`, `hash.ts`, `settings.ts`, and the CLI's or zlib's version, for sizes; with `runtime.ts`, `stats.ts`, `_calibrate.svelte` and Playwright's version, for runtime. A specification that adds or bumps a package is a full run.

### 14. The report: `scripts/cost/report.json`

- Committed, generated by `bun run cost`, written in Prettier's JSON format by the repository's Prettier, never edited by hand. Its shape (`scripts/cost/report.ts` exports the types):

```jsonc
{
  "schema": 1,
  "runs": {
    "2026-…T…Z": {                                    // a run's id: its start time
      "commit": "abc1234",                            // HEAD, "+dirty" if the tree was not clean
      "full": true,
      "machine": { "model": "…", "cores": 10, "os": "…" },
      "tools": { "bun": "1.4.4", "chromium": "…", "playwright": "1.64.1",
                 "cli": "1.7.1", "zlib": "…" },
      "settings": { "cpu": 4, "launches": 6, "block": "FIFIFIF", "warmups": 1,
                    "gzipLevel": 9 },
      "load": { "median": 0, "max": 0 },
      "instrument": { "floorHydrateMs": 0, "noopMs": 0, "calibrateMs": 0 },
      "noisy": false
    }
  },
  "empty": { "js": 0, "css": 0 },
  "themeFloor": { "js": 0, "css": 0, "assets": 0,
                  "fonts": { "font-geist": 0, "font-heading-ibm-plex-sans": 0,
                             "font-jetbrains-mono": 0 } },
  "floor": { "js": 0, "css": 0, "run": "…", "hydrateMs": 0, "noopMs": 0 },
  "catalogue": { "js": 0, "css": 0, "sumOfAlone": { "js": 0, "css": 0 } },
  "items": {
    "dialog": {
      "hash": "…", "runtimeHash": "…", "run": "2026-…T…Z",
      "route": "/",
      "size": { "js": 0, "css": 0, "lazy": 0, "assets": 0,
                "brotli": { "js": 0, "css": 0 } },
      "breakdown": [ { "source": "package:bits-ui", "js": 0 }, { "source": "own", "js": 0 } ],
      "hydrate": { "ms": 0, "spread": [0, 0], "settledMs": null },
      "interaction": { "kind": "click", "start": "click", "says": "opens",
                       "ms": 0, "spread": [0, 0], "ownMs": 0, "pressGapMs": 0,
                       "eventTimingMs": 80 },
      "cases": {}
    }
  }
}
```

- `run` names the run each item's runtime figures came from, so figures from different machines are never mixed silently. A cached run adds its own entry under `runs`, and only the items it re-measured point at it.
- The theme item's page reads `themeFloor` minus `empty`; `utils`' reads `floor` minus `themeFloor`; each font's page reads its bytes in `themeFloor.fonts`.
- `ownMs` is `ms` minus the same run's `noopMs`: an estimate of the item's own work, recorded and never budgeted. Budgets hold the raw `ms`, the wait a person has, against which the 200 ms ceiling means something.
- `interaction` is `null` for an item with none. `eventTimingMs` is `null` for a hover, or when no entry reached 16 ms. `pressGapMs` is `null` for a key or a hover.
- `scripts/cost/report.ts` also exports `readCost(name)` and `costFacts(entry)`. `costFacts` returns the strings `030` shows: a size, `"39.4 kB"` (initial JS plus CSS, one decimal); `"+ 133 kB on demand"` when lazy JS plus assets is over 0; and a time: `"opens in 96 ms"` for an interactive item, from `says`; `"hydrates in 36 ms"` or `"hydrates in under 5 ms"` for the others. - **The note is `costFacts`' too,** so `030` quotes it and never copies it. `costFacts` returns it as `note`, built from the entry's `start`:
  - for an interactive entry: "Alone, gzipped. Times under a 4× slower CPU, from the {input} to the second frame after the change; an empty click measures {noopMs} ms.", where {input} is "click" for `click` and `pointerdown`, "key press" for `keydown`, and "hover" for `pointerover`;
  - for an item with no interaction: "Alone, gzipped. Hydration under a 4× slower CPU, over an empty page's."
  - `report.ts` also exports `COST_NOTE_INPUT`, the map from `start` to its word, so a page that lists several items words each note the same way.
- *Why under `scripts/cost/`:* lane E owns the folder, and site code already imports from `scripts/` on the server (`src/lib/site/foundations/contrast-rows.server.ts`). `030` reads it from `component-data.server.ts`.

### 15. Budgets: `scripts/cost/budgets.json`

- Written in Prettier's JSON format. It holds `machine` (the release machine's model string), `instrument` (the committed `floorHydrateMs` and `noopMs`), and `items`: one entry per measured item, with its cases under `cases`, holding a number for each figure it has: `js`, `css`, `lazy`, `assets` (bytes); `hydrateMs`; `interactionMs`. A case holds `hydrateMs` and `interactionMs` only.
- **A first budget** is the measured figure plus a margin, rounded up:
  - sizes (`js`, `css`, `lazy`, `assets`): plus the larger of 5% and 1,000 bytes, rounded up to 100 bytes;
  - hydration: plus the larger of 25% and 8 ms, rounded up to 1 ms;
  - response time: plus the larger of 25% and 16 ms (one frame at 60 Hz), rounded up to 1 ms.
- **A ceiling:** no response time, and no response-time budget, may exceed 200 ms, INP's "good" line, without an owner's ruling. An item measured over it is a finding to fix (constitution §4.4's rule against recorded limits).
- **Which figures a budget holds, where.** Sizes and hydration are held against their budgets on every run. A response time is held against its budget when its run's `machine.model` equals `budgets.json`'s `machine`; from any other machine, only against the 200 ms ceiling. *Why:* hydration is a paired difference and travels; a response time is the wait itself and moves with the machine (*cost* §5).
- **A budget rises only by a recorded ruling.** A raised number carries a `raised` record: the metric, the old and new numbers, the date, and `ruling`, a link to the landing notes of the specification that raised it. The landing notes say why, and name the item and the figure. One ruling may cover many items when one change moves them all (a `bits-ui` upgrade). `raised` records are append-only.
- **The rule applies to a dependency.** When an item gains a dependency (`app-shell` gains `toast` in `026`), its figures rise, and each budget they exceed is raised with a `raised` record linking that specification's landing notes. If this specification lands after `026`, `app-shell`'s first budget already includes `toast`, and no record is needed.
- **A budget may fall freely.** `bun run cost --tighten` lowers any size budget whose headroom exceeds twice its margin to the measured figure plus the margin. It lowers a runtime budget only from a `--full`, not noisy, run on the release machine. It never raises one. It never touches `instrument`.
- `bun run cost --budget <item>` writes a first budget for an item that has none, and refuses for an item that has one. A new item's first budget is set in its own specification's build, and its landing notes cite it.

### 16. Where the gate runs

- **`bun run cost`** measures, writes `report.json`, and exits 1 if any figure is over budget, naming each. `--budget` and `--tighten` also write `budgets.json`. It writes nothing else in the repository.
- **The unit tests** (`tests/unit/cost.test.ts`, inside `bun run test:unit`) check the committed report without building: every item's size hash and runtime hash equal the report's (else "stale: run `bun run cost`"), and every figure is within budget as decision 15 says. This takes seconds. So `bun run test` fails on a cost over budget, or on a change whose cost was not measured.
- **The smoke test** (`tests/smoke/cost.test.ts`, inside `bun run test:smoke`) runs the harness itself on a few items and proves it measures what it says (criteria 15 to 19). It never reads the committed report's figures, so it does not depend on the report being fresh.
- **The release check.** `scripts/cost/release.ts` checks that every item's runtime figures come from one run that is `full`, not `noisy`, on the release machine, at the commit being tagged or with equal hashes, and with the local Bun's version. `scripts/site/release-check.ts` calls it in one line, its "cost" step, placed after `022`'s matrix step. `022` owns its own step and nothing else of `025`'s; `025` owns the one line and `scripts/cost/release.ts`. Whichever lands second adds its line after the other's.
- **Gating runtime (open question 2):** with blocks (decision 11), the instrument check (decision 12) and per-entry runs (decisions 14, 15), runtime budgets fail the build: hydration everywhere, response time on the release machine. Elsewhere a response time meets only the ceiling.
- *Why the runtime gate is local for now:* the repository has no CI (roadmap §6, Q1). When the owner answers that question, `022`'s CI runs `bun run cost --full` before a tag. Open question 3.

### 17. The run, and the measurement loop

- **A full run** (`--full`): about 3 to 6 minutes of builds, four at a time, with each offline `add` about 2 s; then up to 3 minutes' wait for the load (decision 12); then the runtime phase, one page at a time: 6 launches × about 72 blocks × 7 loads, about 3,030 loads at about 0.5 s, about 25 minutes. **About 30 to 35 minutes** on the M1 Pro the prototype used (*cost* §6, §10.1). A re-measure adds about 21 s per item.
- **A cached run** after a specification that touches a few items and no package: only those items, each with its blocks. 1 to 5 minutes. A specification that touches the theme, `utils`, a package or the harness: a full run (decision 13).
- **The loop** (roadmap §4, step 1) gains one step after `bun run build`: `bun run cost`. A full run before every tag. The change review cites the report's diff for the items the specification touched.
- **The scorecard** gains row 15 when this specification lands, with *cost* §7's rubric and §9.5's scores. **Row 15 does not join the headline total**, which stays "of 56" over rows 1 to 14, so every run stays comparable with the first; the run log adds a second total, of 60, beside it. Its §8 gains the cost run.
- The builds may run four at once. Nothing else is measured, or built, during the runtime phase.

## Design

### Files

```
scripts/cost/
  app/                      the cost app (decision 2)
  fixtures/                 63 item fixtures, case fixtures, _floor, _theme-floor, _calibrate
  interactions.ts           decision 9's entries, and case entries
  run.ts                    the CLI: --full, --only <items>, --sizes-only, --tighten, --budget <item>
  build.ts                  registry guard, template, item apps, sizes, breakdown (decisions 3, 4, 7)
  runtime.ts                launches, blocks, hydration, response time, noise (decisions 5, 6, 11, 12)
  stats.ts                  median, block differences, spread, Hodges–Lehmann
  settings.ts               every run setting (decision 11), hashed
  hash.ts                   the two hashes (decision 13)
  report.ts                 types, read, write (Prettier), readCost, costFacts (decision 14)
  release.ts                the release check's cost step (decision 16)
  budgets.json              decision 15
  report.json               decision 14
tests/unit/cost.test.ts     criteria 1–11, 13, 14
tests/smoke/cost.test.ts    criteria 15–19, 22
tsconfig.json               "exclude" gains scripts/cost/app and scripts/cost/fixtures
package.json                "cost": "bun scripts/cost/run.ts" (a ledger line)
scripts/site/release-check.ts   one line: the cost step (decision 16)
```

- Scratch apps live in a fresh folder under the OS temporary directory, deleted at the end, as the smoke tests do. Nothing the harness builds lands in the repository but `report.json`, and `budgets.json` when asked.
- The harness imports `run`, `bin` and `freePort` from `tests/smoke/process.ts`.

### One block

1. For each trial: a new browser context at the entry's viewport, a new page, a CDP session, `Emulation.setCPUThrottlingRate { rate: 4 }`, an init script that installs the start listeners and the Event Timing observer.
2. Navigate; wait for `load`, then for the `cost:hydrated` mark; read it and `responseEnd`; for a fixture that sets it, wait for `cost:settled`, at most 10 s.
3. Wait 300 ms. Run any preparation. Arm the measure. Send the input: the no-op click on a floor trial, the entry's input on an item trial. Await the measure with an 8 s timeout. A timeout fails the item with its page's state in the message.
4. Read Event Timing and the press gap; close the context.

## Scope

**In:** everything above; the 63 fixtures, the 8 block entries and the harness pages; one case; the first budgets; the first report; row 15 in the scorecard at landing.

**Out:**

- Firefox and WebKit runtime. The throttle is a Chromium protocol call. Sizes do not depend on the engine.
- Network throttling. Transfer cost is the size figure; the site's own page weight is row 8.
- Memory, long-animation-frame attribution and traces. Tools to explain a figure, later.
- The facts line itself: `030`.
- Shrinking any item. Findings go to the roadmap (below).
- npm and pnpm installs: `040`.

## Tests, written first

Each is written before the code it checks and seen failing: the unit tests fail while `scripts/cost/` is empty; the smoke test fails while the harness does not exist. The landing notes record each test's first failure.

- `tests/unit/cost.test.ts`: criteria 1 to 11, 13 and 14.
- `tests/smoke/cost.test.ts`: criteria 15 to 19 and 22.
- `stats.ts` is tested on fixed inputs with known answers (criterion 9) before it is used.

## Acceptance criteria

Counts are written as rules; the numbers in brackets hold at this specification's landing and change with the registry (decision 8).

1. **Fixtures and routes.** Every item in `registry.json` is a floor item (the theme item, the fonts), a block, or has `scripts/cost/fixtures/<item>.svelte` [75 items: 4, 8, 63]. Every `<item>.<case>.svelte` names an item [1 case]. Each fixture and case file imports only from its own item's installed path and from `svelte`; a test parses every file's imports. (unit)
2. **Interactions.** `interactions.ts` holds exactly decision 9's item entries and one entry per case that has an interaction [32 entries, no case entries]. Each entry has `kind`, `start`, `target`, `state`, `says` and `viewport`; `start` is one of `click`, `pointerdown`, `keydown`, `pointerover`; `says` is one of decision 9's verbs. An entry keyed `<item>.<case>` has that case's fixture. `data-cost="target"` appears only in fixture and case files, at most once each. (unit) The smoke test checks that every entry's `target` matches exactly one element of its built page or prerendered route, for the items it builds (criterion 15). (smoke)
3. **The cost app's packages.** Its `package.json` names every package any built item in `static/r/` names in `dependencies`, `devDependencies` or `font.dependency`, each as an exact version equal to the one the repository's `bun.lock` resolves; and no package beyond those and the `kit3` fixture's. Its `bun.lock` agrees. Its `.gitignore` lists `build/`, `.svelte-kit/` and `node_modules/`. (unit)
4. **The report's shape.** `report.json` parses against `report.ts`'s types: `runs`, `empty`, `themeFloor`, `floor`, `catalogue`, and one entry per measured item [71], with its cases [1]. Every item and case with an `interactions.ts` entry has a non-null `interaction` with the entry's `start` and `says`; every other has `null`. Every `run` names a key of `runs`. (unit)
5. **Fresh.** Every item's and case's size hash and runtime hash, computed now, equal the report's. The test fails naming each stale item and the command to run. A local Bun version different from the report's newest run gives a warning, not a failure. (unit)
6. **Within budget.** Every size and hydration figure is at or under its budget. Every response time is at or under 200 ms, and at or under its budget when its run's machine is the release machine. Every item and case has a budget for each figure decision 15 gives it, and none for a figure it lacks. (unit)
7. **Rulings.** The test fails with a message when the repository is a shallow clone (`git rev-parse --is-shallow-repository` prints `true`); `022`'s CI checks out with full history. It walks `budgets.json`'s committed history (`git log --format=%H -- scripts/cost/budgets.json`, oldest first) and then the working tree against `HEAD`, skipping `machine` and `instrument`. It compares each budget number with its value in the **last earlier version in which that key existed**, so deleting a budget and adding a higher one later is still a rise. For every rise, a `raised` record holds that metric and those two numbers, and its `ruling` links to an existing specification file whose Landing notes section names the item. No `raised` record is removed or changed between versions. A `raised` record that takes an `interactionMs` budget over 200 links a Landing notes paragraph containing "the owner". (unit)
8. **The breakdown.** For every item, the breakdown's groups sum to its initial JS within one byte per group; every group's source is `own`, `runtime`, `item:<a registry item>` or `package:<a package the cost app lists>`; no group is `package:cn` (decision 1; dropped if open question 7 is answered no). (unit)
9. **Statistics.** `stats.ts` on fixed inputs: the median of `[3, 1, 2]` is 2 and of `[4, 1, 3, 2]` is 2.5; a fixed 6-launch table of blocks gives hand-computed launch-level differences and median; Hodges–Lehmann of `[1, 2, 3, 10]` is 2.5. (unit)
10. **The facts strings.** `costFacts` on four fixed entries returns: `"39.4 kB"` and `"opens in 96 ms"` for a dialog-like entry; `"hydrates in 36 ms"` for a static one; `"hydrates in under 5 ms"` for one at 1.0 ms; and, for a lazy-heavy entry, a size of initial bytes only plus `"+ 133 kB on demand"`. Its `note` reads "from the click" for a `click` or `pointerdown` entry, "from the key press" for a `keydown` entry (`code-editor`), "from the hover" for a `pointerover` entry (`tooltip`, `chart`), and the hydration wording for an entry with no interaction; no note for a key or hover entry contains "click" before "an empty click". (unit)
11. **The catalogue.** `catalogue.js` is less than `catalogue.sumOfAlone.js`, both positive, both over the same non-block items. (unit)
12. **The first full run, and its false-fail rate.** On the landing commit, on the release machine, `bun run cost --full` exits 0, writing a run with `full: true`, `noisy: false`, every figure within budget, and `budgets.json`'s `instrument` from it. Then a second `--full` run is made without changing anything. **It passes with at most one figure over budget after the re-measure**; more means a ruling changes the trials or the margins, and both runs are repeated (decision 11). The landing notes record both runs' wall times and machine lines, the empty app's, the floors' and every item's figures as a table, and the second run's count of figures over the budgets set from the first, before and after the re-measure: the measured false-fail rate per full run. (run)
13. **The gate fails.** With a copy of the report in which `button`'s `js` is 1 byte over its budget, the unit test fails and names `button` and `js`; with `dialog`'s `interaction.ms` over and its run on the release machine, it names `dialog` and `interactionMs`; with the same run on another machine and the figure under 200 ms, it passes. Shown by the test's own fixtures, not by editing the committed files. (unit)
14. **A rise without a ruling fails.** With a fixture history of `budgets.json` whose `dialog.js` rises twice, a→b then b→c, and holds a record only for a→b, criterion 7's check fails naming `dialog`, `js`, b and c. (unit)
15. **Determinism, offline.** With `OFFLINE_ENV` (decision 3.2), the smoke test builds `separator`, `button`, `dialog` and `sign-in` twice each, from fresh folders: every `add` exits 0; each item app's `package.json` after restoring equals the template's; the two builds' JS and CSS files have equal SHA-256s. The four items' entries' targets each match one element (criterion 2). The test finishes inside `test:smoke`'s 300 s timeout: 9 `add`s at about 2 s and 8 builds at 5 to 20 s; it is split into one test per item if a run comes within 60 s of it. (smoke)
16. **The initial set.** For `button`, `dialog` and `sign-in`, the JS and CSS files Chromium requested before `cost:hydrated` are exactly the harness's initial set. (smoke)
17. **A/A, the no-op and calibration.** The floor measured as an item, with the harness's own block and launches (`settings.ts`), gives a hydration figure within ±8 ms (passed by 99.5% of bootstrap resamples, *cost* §10.1). The no-op click's figure is under 60 ms. `_calibrate.svelte`'s figure is at least 50 ms and at most 50 ms plus the no-op's figure plus 16 ms. (smoke)
18. **A stale build cannot leak.** The smoke test writes, into the template's `build/` folder before an item is copied, a file containing a class name it builds at run time (`"bg-" + "fuchsia-950"`), so the site's own Tailwind never sees it; the item's CSS does not contain `fuchsia`. (smoke)
19. **The registry guard, and the fixtures type-check.** With a temporary copy of `static/r/` in which one item's JSON differs from a fresh `build:registry --out` by one byte, the guard exits 2 and says to run `bun run build:registry`. `svelte-check` in the `dialog` and `sign-in` item apps reports 0 errors. (smoke)
20. **The suites.** `bun run test:unit`, `bun run test:e2e` and `bun run test:smoke` pass; `bun run check` 0 errors, with `tsconfig.json`'s new excludes; `bun run lint` clean, including `report.json` and `budgets.json`. No expectation outside the new tests changes. (all)
21. **The scorecard.** At landing, the scorecard has row 15 with *cost* §7's rubric and §9.5's scores, Kuiper's (b) ✓, and (d) ✓ if open question 4 is answered "now"; the headline total stays of rows 1 to 14, with the total of 15 rows beside it in the run log; its §8 names `bun run cost`. (review)
22. **An offline `add` is fast.** The smoke test times one `add separator -y -o --no-deps-install` with `OFFLINE_ENV`, in a fresh copy of the template: it exits 0 in under 10 s (measured at 2.08 s, *cost* §10.3). (smoke)

## Build order

1. The unit tests against an empty `scripts/cost/`, seen failing.
2. `stats.ts`, `hash.ts`, `report.ts` to criteria 9 and 10. Confirm each entry's `start` against the item's source; record any correction.
3. The cost app; criterion 3.
4. `build.ts` and the fixtures, then `runtime.ts`; the smoke test, seen failing first, to criteria 15 to 19 and 22.
5. **Checkpoint.** The design lead reads the first `--sizes-only` report and the runtime of `button`, `dialog` and `sign-in` before budgets are written. Rulings go in the landing notes.
6. The two full runs on the release machine, the first budgets and the instrument values, the report; criteria 4 to 8, 11 to 14.
7. `package.json`'s script, `tsconfig.json`'s excludes, `release.ts` and its line in `release-check.ts`; criterion 20; the scorecard, criterion 21.

## Findings for the roadmap

- **`cn` is about 11 kB** (*cost* §4). With it in the floor, it is published once, on `utils`' row. The re-rank after landing may rank a look at it.
- **`button` hydrates 31 ms slower than `separator`** (*cost* §5). The breakdown will show which dependency; the likely ones are `tailwind-variants` and the spinner's icon.
- **A small item's response time is mostly the harness's own two frames** (41 ms of `button`'s 43, *cost* §9.4). `030`'s note says so.
- **Row 15 may move faster than the roadmap says:** (b) here, (d) here too if question 4 says so, then (a) and (c) with `030`.

## Risks

- **A busy machine.** The prototype ran at load averages of 13 to 36. Blocks, the instrument check and the re-measure contain it, and the release run is made on a quiet machine. Criterion 12 measures what is left.
- **Budgets that bind.** A dependency upgrade can move 40 budgets at once. One ruling may cover them all (decision 15), so the cost is one paragraph, not 40.
- **A long full run.** 25 to 30 minutes, before every tag and after any theme, package or harness change.
- **Tailwind scanning the harness.** Found in the prototype. Fresh folders, the `.gitignore` and criterion 18 guard it.
- **The fixtures decide the figures.** A fixture that renders more than the plain form inflates its item. Review reads every fixture against decision 8; the import check (criterion 1) catches the worst case.
- **A cold Bun cache** needs the network once, for the template's install. The harness says so when it fails.

## Open questions for the owner

Recommended option first.

**Q1. Which machine do the runtime figures stand for?**
1. **A 4× slower CPU on the release machine only.** One figure per item. Public text says "a 4× slower CPU", with no device claim.
2. 4× and unthrottled, two figures. Doubles the runtime phase, to about 50 minutes.
3. A slowdown calibrated to a benchmark of the measuring machine, as Lighthouse allows. It does not rescue figures mixed across machines, which decision 14 already prevents.

**Q2. Do runtime figures fail the build?** The design lead's call, given the review's condition: blocks (decision 11), the instrument check (decision 12) and per-entry runs (decisions 14, 15) are in. So the recommendation stays option 1.
1. **Yes:** sizes and hydration everywhere; response time against its budget on the release machine in a quiet run, and against 200 ms everywhere else; a re-measure before a runtime failure; at most one false fail per full run, or the trials rise before budgets are written (criterion 12).
2. Sizes and hydration fail; response time fails only against the 200 ms ceiling, anywhere.
3. Sizes fail; runtime is published and reported, never failing.

**Q3. Where does the runtime gate run until there is CI?** (It follows roadmap §6, Q1.)
1. **On the release machine:** `bun run cost --full` in the release check, before each tag, every runtime figure from that one run; in `bun run test`, only the hash-and-budget check of the committed report.
2. Wait for CI; until then the runtime is published and not gated.

**Q4. Add a large-data case now?**
1. **Yes: `table` at 1,000 rows,** hydration only, so the case mechanism is proven on a real case before `026` adds two, and row 15 (d) is met in 0.13.0.
2. No: the first cases are `026`'s, then `037`'s combobox and `042`'s data table. The mechanism is proven by `026`'s cases.

**Q5. Publish a second, lower size figure?**
1. **No: the alone figure, its breakdown, and the catalogue's total.** With `cn` in the floor, the alone figure no longer overstates every small item by it.
2. Yes: also what removing the item from the catalogue saves, per item. About 10 more minutes per full run.

**Q6. The margins.**
1. **As decision 15 says:** sizes +5% (at least 1 kB); hydration +25% (at least 8 ms); response time +25% (at least 16 ms); the 200 ms ceiling; runtime tightened only from a full, quiet release run.
2. Tighter sizes: +2% (at least 500 bytes). More rulings.
3. Looser everywhere: +10% (at least 2 kB) and +50%. Fewer rulings, later warnings.

**Q7. Is `cn` in the floor?**
1. **Yes:** the floor's page calls `cn` once; `utils`' row carries its 10.9 kB; no item's figure holds it. The same treatment as the theme.
2. No: every item's figure holds `cn`, and `utils`' row says so instead of a number.

**Q8. May `bun run cost` use the network?**
1. **No:** every CLI run points the npm registry at a closed port, with retries off, so each lookup fails in about 2 s. Runs are offline and identical. The template's `bun install` reads Bun's cache, which must be warm once.
2. Yes: the CLI looks the fonts up on npm on every `add`, and the harness restores `package.json` after each. Runs then need the network and depend on npm answering.

## Review

The specification review, [`../reviews/025-component-cost-spec-2026-11-15.md`](../reviews/025-component-cost-spec-2026-11-15.md), 2026-11-15. Answers, one per finding:

| # | Severity | Answer |
|---|---|---|
| 1 | High | Decision 2.1 and criterion 3 admit `font.dependency`; the test reads all three fields |
| 2 | High | Decision 11: one block per item per launch, floor–item–floor–item–floor; the prototype's same-round pairing narrowed launch 4's outliers and could not cancel its per-trial noise (*cost* §9.3); decision 17's time re-stated |
| 3 | Medium | Decision 8: 63 fixture files plus 8 blocks at their routes; decision 9: every entry has a `target` selector; criterion 2 checks `data-cost` in fixture files and targets in built pages |
| 4 | Medium | Decision 1: `cn` in the floor, `utils`' row is floor minus theme floor; Q7; "changes only when it or an item it pulls in changes" |
| 5 | Medium | Decision 6: each entry names its start event; the press gap is recorded; terms say "comparable in kind, not equal"; the no-op click measured (41 ms) and bounded in criterion 17 |
| 6 | Medium | Decision 13: a size hash and a runtime hash, the CLI and zlib versions in, Bun recorded not hashed, the full-run inputs named |
| 7 | Medium | Criterion 7 walks the file's git history and the working tree; records are append-only; "the owner" is the testable term |
| 8 | Medium | Criterion 17 at ±5 ms; criterion 12 measures the false-fail rate per full run with a second full run |
| 9 | Medium | Decision 3: offline by a closed registry port, `package.json` checked and restored after each `add`; Q8 |
| 10 | Medium | Decision 12: wait up to 3 minutes, sample per launch, an instrument check against committed values decides `noisy`; shown workable at load 13–36 |
| 11 | Medium | Decision 4: compressible assets gzipped; decision 15: `assets` budgeted; `costFacts` says "on demand" |
| 12 | Medium | Decision 14: `runs`, and a `run` per entry; decision 15: response time held to budget only from the release machine; decision 16: the release check requires one full run |
| 13 | Medium | Decision 2 and Files: `tsconfig.json` excludes; criterion 19 runs `svelte-check` in item apps; both JSON files written by Prettier, criterion 20 |
| 14 | Medium | *cost* §9.5: Material 3 scored on m3.material.io, (a) –, material-web.dev in the evidence; decision 17: row 15 stays out of the headline total, a total of 60 beside it |
| 15 | Medium | Decision 9: entries keyed by item or `<item>.<case>`, with `start` and `says`; decision 10: the case report shape; criteria 1, 2 and 4 written as rules; decision 15: a dependency's rise needs a `raised` record, or none if `026` lands first |
| 16 | Low | Decision 16: `scripts/cost/release.ts`, one line in `release-check.ts` after `022`'s step; each spec's part named |
| 17 | Low | *cost* §9.1 records the versions and the missing `--no-deps-install`; "What the research found" calls the figures approximate |
| 18 | Low | Decision 5 says what hydration leaves out; `cost:settled` recorded for eight items, not budgeted |
| 19 | Low | Decision 9: `input-group`'s password toggle added; `marketing-bar`'s block runs at its viewport; the clipboard note on `code-block` and `stage-card` |
| 20 | Low | (a) header fixed; (b) blocks in a seeded shuffle; (c) the six-launch reason rests on *cost* §5; (d) `--tighten` restricted; (e) the catalogue leaves blocks out of both; (f) the guard compares content; (g) the class built at run time; (h) `--budget` and `--tighten` write `budgets.json`; (i) *cost* §9.7; (j) no device claim; (k) cold contexts said; (l) `noisy` is the run's field |

**Re-review, 2026-11-15.** Answers, one per remaining finding:

| # | Severity | Answer |
|---|---|---|
| R1 | High | Decision 3.2: `OFFLINE_ENV` in `build.ts` adds `npm_config_fetch_retries=0` (72 s → 2.08 s per `add`, measured by the re-review); an `add` over 10 s fails the item; criterion 22 times one; criterion 15 states its time inside the 300 s timeout |
| R2 | Medium | Decision 11: 3 item trials per block (FIFIFIF), 6 launches, about 25 minutes of runtime and 30 to 35 in all (decision 17); criterion 17's A/A at ±8 ms with the harness's own block; criterion 12 passes with at most one false fail after the re-measure (*cost* §10.1) |
| R3 | Medium | Decision 13: the size hash takes the zlib version named by the report's newest full run; the unit gate warns on a local mismatch, `bun run cost` refuses a cached run on one, the release check refuses it. Bun is not pinned: that is outside lane E |
| R4 | Low | Criterion 7: each number is compared with the last earlier version in which its key existed; a shallow clone fails with a message; `machine` and `instrument` are skipped |
| R5 | Low | Decision 12: only `--budget instrument` writes the instrument values, from a full release-machine run, at criterion 12 and at any build that moves them, with landing notes; a noisy run's response times are held only to the 200 ms ceiling |
| R6 | Low | Decision 11: every run setting in `settings.ts`, in both hashes; `run.ts` holds none. Decision 9: every entry field is a string |
| R7 | Low | `026`'s to restate (below) |
| R8 | Low | *cost* §10.2: `rt2`'s 476.9 ms no-op was the probe's own fault, fixed in `rt3`; the floor's launch medians at load 25 to 36 ranged 89.0 to 127.4, and the ±15% band is for a run's median (decision 12) |

Budgets stay on the raw response time, as the re-review advises; `ownMs` (`ms` minus `noopMs`) is recorded beside it and never budgeted (decision 14).

**For `026`.** Its decision 25 fits as written, with three counts to restate: `interactions.ts` holds 35 entries with `toast` and its two cases (this specification adds `input-group`), and blocks have no fixture file, so 76 items give 64 fixture files and 72 measured items, plus three cases. Its `toast` entry needs a `start` (`click`).

## Landing notes

**The owner's answers (the owner, 2026-11-15).** The owner accepted the recommended option for every question:

- **Q1:** runtime is measured at a 4× CPU slowdown, on the release machine only.
- **Q2:** runtime figures fail the build. Sizes and hydration are gated everywhere. Response time is gated against its budget only on a quiet full run on the release machine; otherwise it is held to the 200 ms ceiling. This holds under criterion 12's bar of at most one false fail per full run.
- **Q3:** until CI exists, the full cost run gates the tag on the release machine, through the release check.
- **Q4:** a large-data case now: `table` at 1,000 rows, so row 15 (d) is met in 0.13.0.
- **Q5:** no second "saving if removed" size figure. The breakdown and the catalogue stay.
- **Q6:** the margins as stated: sizes +5% or at least 1 kB; hydration +25% or at least 8 ms; response +25% or at least 16 ms; a 200 ms ceiling.
- **Q7:** `cn` counts in the floor, not in every item.
- **Q8:** runs are offline. The registry points at a closed port, and fetch retries are off.

Not yet landed.
