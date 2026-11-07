# Phosphor icons and the product-icon tile

- **Status:** complete
- **Date:** 2026-11-06
- **Author:** the design lead's researcher
- **Question:** The owner chose basic Phosphor glyphs for the suite's eight product icons (Pluto Docs, Sheets, Slides, Mail, Chat, Calendar, Search, Files), with no tie to the four-dot mark. What is Phosphor, exactly? How does it reach a Svelte 5 registry item, and what would it cost here? What tile can sit around a glyph, in Deep Field's colours, with the shape and colour rules already settled? Which tiles stay legible at 16, 32 and 48 px, in both themes?
- **What it blocks:** question G's second round on `/identity`, and a later specification that adds Phosphor product icons.

## How to read this memo

Every claim carries a label.

- **EXECUTED:** we ran it and saw the result, on 2026-11-06.
- **READ:** a source says so. Every source was read on 2026-11-06 unless the claim says otherwise.
- **INFERRED:** our reasoning.

Terms of art.

- **Glyph.** The drawing inside an icon: an envelope, a folder.
- **Weight.** One of Phosphor's six drawings of each glyph: thin, light, regular, bold, fill and duotone.
- **Duotone.** A weight with two tones: the regular line, plus a filled area at 20 % opacity behind it. We call that filled area the **tone layer**.
- **Tile.** The rounded square a glyph sits on in a launcher or a dock.
- **Key cap.** A tile drawn as a keyboard key: a top **face** and, below it, a darker strip of the key's front edge, the **skirt**.
- **Hue.** One of Deep Field's four brand colours: blue, red, yellow, green.
- **Ramp.** Deep Field's eleven steps of one hue, step 0 lightest to step 10 darkest (`src/lib/identity/palettes.ts`).
- **Non-text contrast.** WCAG 2.2 success criterion 1.4.11: parts of a graphic needed to understand it reach 3:1 against what touches them.
- **Barrel import.** Importing many components from one index file (`import { X } from "pkg"`).
- **SSR.** Server-side rendering: the page's HTML is written on the server or at build time.
- **Caret range.** A version specifier such as `^3.1.1`: any 3.x release at or above 3.1.1.

## In short

- **Phosphor is MIT-licensed.** Both packages we unpacked carry the plain MIT text, "Copyright (c) 2020 Phosphor Icons" and "(c) 2023" (EXECUTED, §1.1).
- **It has 1,512 glyphs, each in six weights, on a 256-unit grid** (EXECUTED, §1.3–§1.4). Lines are 8, 12, 16 and 24 units for thin, light, regular and bold. At 16 px, regular draws a 1 px line. Its own page says it was "designed at 16 x 16px" (READ).
- **The glyph set has been still since March 2024** (EXECUTED, §1.2). `@phosphor-icons/core` 2.1.1 is its last release.
- **This repository already depends on Phosphor.** `phosphor-svelte` 3.1.1 is in `package.json` and `bun.lock`, `components.json` sets `iconLibrary: "phosphor"`, and 20 built items name `phosphor-svelte@^3.1.1` (EXECUTED, §2.3). The 2026-11-06 decision says Phosphor "becomes a named, pinned dependency … when a specification adds it". Specification `002` already did that, for interface icons. A product-icon item adds no new dependency.
- **There is no official Svelte package.** `@phosphor-icons/svelte` does not exist. `phosphor-svelte` is a community port with one maintainer (EXECUTED and READ, §2.1). Its glyph paths match core's exactly: 1,512 of 1,512 (EXECUTED, §2.2).
- **Duotone is a weak carrier of an app's colour.** The tone layer covers 2.4 % of the box for `FileText` and 45.7 % for `ChatCircleText` (EXECUTED, §6.3). Docs and Sheets would look almost colourless next to Chat.
- **At 16 px, use bold, with a 12 px glyph and no skirt** (EXECUTED, §6). Regular breaks up below a 1 px line. Table and text lines blur at an 11 px box.
- **Eight apps, four hues, two apps per hue,** arranged so that each launcher row of four shows each hue once (INFERRED, §4).
- **Five tile options** are specified in §8. **Recommended: T4, the colour key.** It is a key cap in the app's hue, with a skirt two ramp steps darker and a white glyph (an ink glyph on yellow). It reads fastest at 16 px, passes 3:1 with 4.97:1 or more in both themes, and answers the brief's "chunky keyboard" and "rainbow colors with the off white canvas".
- **Pin `phosphor-svelte` 3.1.1, specifier `^3.1.1`,** as `bun.lock` and specification `001`'s decision 4 already do (§9).

## 1. Phosphor itself

### 1.1 Licence

- `phosphor-svelte` 3.1.1's `LICENSE` reads "MIT License / Copyright (c) 2020 Phosphor Icons", followed by the standard MIT grant and warranty disclaimer (EXECUTED: `npm pack`, then read the file).
- `@phosphor-icons/core` 2.1.1's `LICENSE` is the same text with "Copyright (c) 2023 Phosphor Icons" (EXECUTED, same method).
- The project's repository states "MIT © Phosphor Icons" (READ, [phosphor-icons/homepage](https://github.com/phosphor-icons/homepage)).
- INFERRED: MIT lets us draw glyphs from it into our own source, provided the copyright notice travels with the copy. Using the package as a dependency carries the notice inside `node_modules` already.

### 1.2 Versions and maintenance

Read with `npm view` (EXECUTED).

| Package | Latest | Published | Licence | Notes |
|---|---|---|---|---|
| `@phosphor-icons/core` | 2.1.1 | 2024-03-29 | MIT | Raw SVG files for every weight, plus a catalogue with names, tags and categories |
| `@phosphor-icons/web` | 2.1.2 | 2025-03-31 | MIT | Icon fonts and CSS, 46 MB unpacked |
| `@phosphor-icons/react` | 2.1.10 | 2025-05-22 | MIT | Official React port |
| `@phosphor-icons/vue` | 2.2.1 | 2024-04-05 | MIT | Official Vue port |
| `phosphor-svelte` | 3.1.1 | 2026-10-09 | MIT | Community Svelte port |
| `@phosphor-icons/svelte` | none | | | `npm view` returns 404 |

- The catalogue tags each glyph with the release that added it. 580 came in 1.0. The last 268 came in 2.1 (EXECUTED: counted `published_in` in core's `dist/index.mjs`).
- The project's repository shows 517 open issues, 9 open pull requests and an empty releases list. Its README still says "1,248 icons and counting" (READ, [phosphor-icons/homepage](https://github.com/phosphor-icons/homepage)). The count is out of date (§1.4).
- The project lists its own ports for the web, React, Vue, Flutter and Elm, and further projects including Swift and design-tool plugins. Svelte appears only under "Community Projects" (READ, same page).
- INFERRED: the glyph set is stable rather than growing. For us that is good. A glyph we choose will not be redrawn under us. New glyphs are unlikely soon.

### 1.3 Weights, grid and stroke

- Every glyph is drawn in a `viewBox="0 0 256 256"` and filled with `currentColor` (EXECUTED: read the SVG files).
- Lines are outlined shapes, not SVG strokes. Their width shows in the rounded end caps. `minus` ends in arcs of radius 4, 6, 8 and 12 for thin, light, regular and bold. So lines are 8, 12, 16 and 24 units wide (EXECUTED: read the four `minus` files and `Acorn`'s six paths).
- Fill is a solid silhouette. Duotone is the regular line plus one or more paths marked `opacity="0.2"` (EXECUTED: read `file-text-duotone.svg`).
- "Designed at 16 x 16px to read well small and scale up big" (READ, [phosphor-icons/homepage](https://github.com/phosphor-icons/homepage)).

Line width in pixels, for a glyph drawn at a given size (EXECUTED: arithmetic, width ÷ 256 × size).

| Glyph size | thin | light | regular | bold |
|---|---|---|---|---|
| 12 px | 0.38 | 0.56 | 0.75 | 1.13 |
| 16 px | 0.50 | 0.75 | 1.00 | 1.50 |
| 18 px | 0.56 | 0.84 | 1.13 | 1.69 |
| 27 px | 0.84 | 1.27 | 1.69 | 2.53 |
| 36 px | 1.13 | 1.69 | 2.25 | 3.38 |

- INFERRED: below about 1 px a line is spread over two pixel rows and greys out. So thin and light are display weights. Regular holds from a 16 px glyph up. Bold is the small-size weight.

### 1.4 Glyph count

- `@phosphor-icons/core` 2.1.1 ships 1,512 SVG files in each of the six weight folders: 9,072 in all (EXECUTED: counted).
- `phosphor-svelte` 3.1.1 ships 1,512 icon components, plus `IconContext` (EXECUTED: counted `lib/*.svelte`, excluding the `…Icon.svelte` aliases).

### 1.5 Glyphs for the eight apps

Every name below exists in both packages (EXECUTED: checked against core's files and `phosphor-svelte/lib`). The name is the `phosphor-svelte` component; the core file is its kebab-case form, such as `file-text.svg`.

| App | Recommended glyph | Alternates | Avoid, and why |
|---|---|---|---|
| Docs | `FileText` | `Article`, `Notepad`, `File` | `FileDoc` draws the letters "DOC", and its tags read "word", "microsoft" (EXECUTED, catalogue) |
| Sheets | `Table` | `GridNine`, `GridFour`, `Rows` | `FileXls`, `FileCsv` draw file-type letters |
| Slides | `PresentationChart` | `Presentation`, `ProjectorScreenChart` | `Slideshow` is tagged "pictures", "gallery" (EXECUTED, catalogue): a photo carousel, not slides |
| Mail | `EnvelopeSimple` | `Envelope`, `PaperPlaneTilt`, `At` | `Tray` reads as an inbox, not mail |
| Chat | `ChatCircleText` | `ChatCircle`, `ChatTeardropText`, `ChatsCircle` | `ChatCircleDots` and `ChatTeardropDots` put a row of dots in the icon, a tie to the mark the owner ruled out (INFERRED) |
| Calendar | `CalendarBlank` | `Calendar`, `CalendarDots` | `Calendar` carries a small "12" that blurs at 16 px (EXECUTED, §6); `CalendarDots` adds dots (INFERRED, as Chat) |
| Search | `MagnifyingGlass` | `Binoculars` | `FileMagnifyingGlass` is "search in files", not search |
| Files | `FolderSimple` | `Folder`, `Files` | `Files` draws stacked pages and reads as Docs (INFERRED) |

- Three of the recommended glyphs already appear in this repository as interface icons: `MagnifyingGlass`, `FolderSimple` and `Folder` (EXECUTED: `grep` over `src`). INFERRED: that is acceptable. The tile, not the glyph, says "this is an app". A search field with a bare `MagnifyingGlass` and the Search app's tiled one will not be confused.
- INFERRED: no Phosphor glyph is Pluto's alone. Thousands of products use the same set. What makes the icons ownable is the tile and its colour rule, not the glyph.

## 2. Delivering it in Svelte 5

### 2.1 The packages

- **`phosphor-svelte` 3.1.1.** Peers on `svelte ^5.0.0 || ^5.0.0-next.96` and, optionally, `vite >=5`. Depends on `estree-walker` and `magic-string`, which only its Vite plugin uses. 14 MB unpacked (EXECUTED, `npm view`). It has one maintainer's account, about 280 stars and one open issue (READ, the package's repository, linked from [npm](https://www.npmjs.com/package/phosphor-svelte)). It has shipped 21 releases. 3.0.0 came on 2024-11-27, and 1.5.0 the same day as the line for Svelte 3 and 4, whose peer is `svelte >=3` (EXECUTED, `npm view`).
- **`@phosphor-icons/core` 2.1.1.** No framework code. Its SVG files are exported by path (`@phosphor-icons/core/regular/file-text.svg`), and a typed catalogue lists every glyph (EXECUTED, read `package.json` and `dist`).
- **`@phosphor-icons/web` 2.1.2.** Icon fonts and stylesheets (EXECUTED, `npm view`). INFERRED: a font loads every glyph of a weight, and it cannot take two colours. It suits neither a tile nor a registry item.
- **`@lucide/svelte` 1.70.0,** ISC, published 2026-11-06 (EXECUTED, `npm view`). Not used here (§2.4).

### 2.2 How `phosphor-svelte` works

All EXECUTED by reading the unpacked 3.1.1 package unless marked.

- **One file per glyph.** `lib/FileText.svelte` is a Svelte 5 component. It uses `$props()` and `$derived`, so it is runes-mode Svelte 5. Each glyph also has an alias file, `FileTextIcon.svelte`.
- **All six weights live in each file.** The component branches on `weight` (`{#if weight === "bold"} … {:else if …}`). So importing one glyph ships its six drawings. The eight recommended glyphs are 2.4 to 3.8 kB of source each.
- **Props.** `weight` (default `regular`), `color` (default `currentColor`), `size` (default `1em`) and `mirrored`. Any other attribute passes through to the `<svg>`. `IconContext` sets defaults for a subtree.
- **Markup.** `<svg xmlns role="img" width height fill={color} viewBox="0 0 256 256">`, a transparent 256-unit `<rect>`, then the weight's paths. A duotone tone path is `<path … opacity="0.2"/>` and inherits `fill={color}`. So the package cannot give the tone layer a second colour. Only CSS that reaches into its markup (`path[opacity]`) can.
- **Same drawings as core.** For all 1,512 glyphs, the regular paths in `phosphor-svelte` equal the paths in core's `regular/*.svg` (EXECUTED: a script compared them; 1,512 equal, 0 different).
- **Tree-shaking.** `lib/index.js` re-exports 3,025 components. The README warns that named imports from it compile more slowly, recommends `phosphor-svelte/lib/<Name>`, and ships `sveltePhosphorOptimize()`, a Vite plugin that rewrites the first form to the second (READ, the package's README; EXECUTED, read `vite/index.js`). INFERRED: with deep imports, only the imported files are compiled and bundled. Every item here already imports that way.
- **SSR.** The component reads a Svelte context and renders static markup; it touches no browser API. This repository's prerendered `build/index.html` (built 2026-11-01) contains `<svg xmlns="http://www.w3.org/2000/svg" role="img" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256" aria-hidden="true">` (EXECUTED: `grep` over `build/`). So it renders on the server here today.
- **Accessibility.** It writes `role="img"` with no name. Specification `002`'s landing notes already require `aria-hidden="true"` on a decorative icon (READ, `specifications/002-…`, note 9).

### 2.3 This repository already uses it

All EXECUTED.

- `package.json` lists `"phosphor-svelte": "^3.1.1"`. `bun.lock` resolves `phosphor-svelte@3.1.1` with its integrity hash.
- `components.json` sets `"iconLibrary": "phosphor"` (specification `001`, decision 21).
- 42 distinct glyphs are imported across `src`, all as `phosphor-svelte/lib/<Name>`.
- 20 built items under `static/r/styles/maia/` name it in their dependencies; `hero` mentions it only in a comment. The built `checkbox.json` lists `devDependencies: ["bits-ui@^2.20.2", "@internationalized/date@^3.12.4", "phosphor-svelte@^3.1.1"]`. The source `registry.json` does not name it. `shadcn-svelte registry build` detects the import and copies our `package.json` specifier (READ, specification `002` §2, "How the ranges reach the items").
- The rule for specifiers is `001`'s decision 4: a caret range at the tested version in `package.json` and in the item, with `bun.lock` holding the exact version (READ, specification `002` §2).
- INFERRED: the 2026-11-06 decision's condition, "Phosphor becomes a named, pinned dependency … when a specification adds it", was met by `002` for interface icons. The product-icon specification should say so and cite `002`, not add the package again.

### 2.4 Lucide, and what two sets would cost

- shadcn-svelte's stock blocks import `@lucide/svelte`. Its stock `ui` items carry an `IconPlaceholder` that `add` rewrites to the app's `iconLibrary` (READ, `research/2026-10-28-the-primitives-the-blocks-and-the-home-page-need.md` §2).
- No file in this repository imports Lucide (EXECUTED: `grep`).
- INFERRED: a second set would add a second dependency to every app, a second line weight and corner style beside Phosphor's, and two names for every common glyph. There is no gain. Product icons should come from the set the interface already uses.

### 2.5 How a product-icon item would carry Phosphor

INFERRED, two routes.

1. **Import (recommended).** The item's Svelte file imports the eight glyphs as `phosphor-svelte/lib/FileText` and so on. `registry build` names `phosphor-svelte@^3.1.1`. The tile is our own SVG around the component. It works for every option in §8 except the duotone ones, which need the CSS reach-in of §2.2.
2. **Vendor.** The item holds the eight glyphs' path data in its own source, with the MIT notice in a comment. It names no dependency, and the tone layer can take any colour. But it copies 1,512 glyphs' worth of upkeep into ours whenever a glyph is added, and it breaks the "one icon set, imported" rule `002` set (R15).

## 3. Prior art, studied and not copied

- **Microsoft, 2018.** "Color differentiates apps and creates personality." "Our design solution was to decouple the letter and the symbol." "Separating these into two panels also adds depth." The article states no rule on colours per icon and says nothing about small sizes (READ, [Redesigning the Office app icons](https://microsoft.design/articles/redesigning-the-office-app-icons-to-embrace-a-new-world-of-work/)).
- **Google, 2020.** Every Workspace icon took all four colours, and TechCrunch wrote that this "makes it harder to tell them apart at a glance". A 2026 report says Google is moving toward one leading colour per app (READ, in `research/2026-11-01-how-definitive-brands-are-built.md` §1.4, sources read 2026-11-01).
- **Apple, Icon Composer.** An icon is a stack of layers, organised into "a maximum of four groups". Designers are told to "remove background colors and gradients" and blurs, shadows and translucency, since the system adds Liquid Glass. Each icon is previewed in default, dark and mono appearances, and mono in clear and tinted variants (READ, [Creating your app icon using Icon Composer](https://developer.apple.com/documentation/xcode/creating-your-app-icon-using-icon-composer)). The Human Interface Guidelines page did not render for our fetcher (EXECUTED).
- **Notion.** Its original branding was "all created in black and white"; colour came later, for advertising (READ, in `research/2026-11-01-how-definitive-brands-are-built.md` §3).
- **Linear.** Its brand page calls the logomark "a concise way to refer to Linear" in tight layouts and allows the icon in chip designs "with an appropriate corner radius". It assigns the icon no colour (READ, [linear.app/brand](https://linear.app/brand)). One product, not a suite, so it says little about a family.
- **Round one's own lessons.** G2 (one colour per tile) was called "generic: many suites do this". G4 (ink glyph, one dot) had "low recognition at a glance", and its dot "reads as a notification" (READ, `src/lib/identity/questions.ts`).
- INFERRED:
  - Colour does the fast work in a suite; the glyph confirms. Every suite that tried to make the glyph do both, or all colours do both, has walked it back.
  - Apple's layer model is the bridge to "liquid glass" the owner asked for. A tile built as flat layers (skirt, face, glyph), with no baked-in effects, can be given glass later without being redrawn.
  - A flat colour tile alone is generic. It needs one owned trait.

## 4. Colours for eight apps

- **The constraint.** Deep Field has four hues. Eight apps means two apps per hue, or more colours.
- **More colours were weighed and set aside** (INFERRED). Two steps of one ramp (blue step 8 against step 10, say) would tell apart at 64 px and not at 16. A fifth or sixth hue would break B3's four and C2's rule that the four are the brand's colours.
- **C2 allows it.** C2's option text lists "product icons" among the owned moments where the four appear together (READ, `src/lib/identity/questions.ts`, option C2). INFERRED: inside one product, its header shows one icon, so one hue: the screen stays neutral.
- **The map** (INFERRED). Each hue goes to two apps that are never side by side in the default order. Each row of a four-wide launcher shows all four hues once.

| Hue | Deep Field value | Apps |
|---|---|---|
| Blue | `#2D48D4` | Docs, Search |
| Green | `#008058` | Sheets, Chat |
| Yellow | `#F19E20` | Slides, Files |
| Red | `#C92035` | Mail, Calendar |

  Default order: Docs, Sheets, Slides, Mail / Chat, Calendar, Search, Files. Row one reads blue, green, yellow, red. Row two reads green, red, blue, yellow.
- **Why these pairs** (INFERRED). Docs blue, Sheets green and Slides yellow follow the conventions most people already carry from other suites. Following a convention is studying prior art, not copying a drawing. Files yellow echoes the manila folder. Mail and Calendar share red, the hue of time-sensitive things.
- **A ninth app** (INFERRED). Ink (`#0B0F17`) with a paper glyph is a fifth tile colour that adds no hue. It suits a hub, an admin console or settings.
- **Risk: brand red beside status red** (INFERRED). In an interface, red means error. A red Mail tile with an unread badge must keep the badge's own colour and shape. The earlier memo's rule to keep brand hue apart from status colour applies (READ, `research/2026-11-01-how-definitive-brands-are-built.md` §7.1, item 7).

## 5. Shape: radius and the key cap

- **H1 sets one 8 px case radius; round only for dot shapes** (READ, `decisions.md`, 2026-11-06).
- **The problem at small sizes.** A fixed 8 px radius on a 16 px tile draws a circle. Specification `002` met this for the checkbox, which became 24 px (READ, `002`, checkbox row). On a 32 px tile, 8 px is a quarter of the side.
- **Proposed reading** (INFERRED). An icon is one drawing scaled as a whole. Draw the master at 64 px with the 8 px case radius, 12.5 % of the side, and let it scale: 6 px at 48, 4 px at 32, 2 px at 16. At its master size the icon obeys H1 exactly. The alternative, a fixed 8 px at every size, rounds small icons toward circles, which H1 keeps for dots. The design lead should record the reading chosen.
- **Key cap geometry, at the 64-unit master** (INFERRED, drawn and rendered in §6). The tile is 64 × 64 with radius 8, filled with the skirt colour. The face is 64 wide, 58 high, radius 8, aligned to the top. That leaves a 6-unit skirt at the bottom: 4.5 px at 48, 3 px at 32. At 16 px the skirt would be 1.5 px; drop it and draw the face alone.
- **Why a key** (INFERRED). The owner's brief: "early computing with the off white chunky keyboards and square apple II … rainbow colors with the off white canvas … bridge that gap from that to newer liquid glass style design" (READ, `decisions.md`, question I). A key cap is the chunky keyboard's unit, drawn flat, in two layers. It belongs to no one's logo. It can take glass later. No option here reproduces an Apple II, its rainbow stripes or another company's key.

## 6. Legibility at 16, 32 and 48 px

### 6.1 Method

EXECUTED. A script built SVG tiles from `@phosphor-icons/core` 2.1.1's files for the five options of §8 and the eight glyphs of §1.5, at 64, 48, 32 and 16 px, on paper (`#F4F6F8`) and on ink (`#0B0F17`). It screenshotted them in Chromium (Playwright's Chromium build 1248) at device pixel ratios 1 and 2, and we read the screenshots enlarged with nearest-neighbour scaling. A second sheet compared glyph sets, weights and box sizes at 16 px. The scripts lived outside the repository and are not kept. Glyph box: 36 units of the 64 master (56 %) above 16 px; 11 or 12 px at 16.

### 6.2 What we saw

- **48 px, regular.** Every glyph clean in every option. Line 1.69 px.
- **32 px, bold.** Every glyph clean. Line 1.69 px, the same as 48 px regular. Regular at 32 px (1.13 px) looks faint beside it.
- **16 px, 11 px box, bold.** `Table` becomes a solid block, and `ChatCircleText`'s inner lines merge. The others hold.
- **16 px, 12 px box, bold.** All eight hold on a coloured tile. `Table` shows its rows; `FileText`'s lines are faint but present. Line 1.13 px.
- **16 px, fill weight.** Silhouettes hold, but `MagnifyingGlass` fills into a blot and `Table` loses its rows. Fill is not a 16 px fix.
- **Simpler alternates at 16 px.** `File`, `Rows`, `Presentation` and `ChatCircle` are the cleanest at 16 px, but they say less: `File` is any file, `Rows` any list. `Calendar` with its "12" is noisy. `Binoculars` reads as a blot.
- **Colour at 16 px.** Options with a coloured tile (T1, T4) read by hue before the glyph is seen. Options with colour only in a skirt or a tone layer (T2, T3, T5) read as a row of white squares, with a 2 px coloured edge at best.

### 6.3 Duotone's colour area

EXECUTED. The script rasterised each glyph's tone paths and regular line at 256 px and measured coverage as a share of the 256 × 256 box.

| Glyph | Tone layer | Regular line |
|---|---|---|
| `FileText` | 2.4 % | 22.0 % |
| `Table` | 8.2 % | 26.3 % |
| `CalendarBlank` | 12.8 % | 22.1 % |
| `EnvelopeSimple` | 12.9 % | 21.8 % |
| `MagnifyingGlass` | 30.6 % | 14.3 % |
| `PresentationChart` | 39.8 % | 22.4 % |
| `FolderSimple` | 40.3 % | 16.1 % |
| `ChatCircleText` | 45.7 % | 19.6 % |
| `Article` | 46.8 % | 24.8 % |
| `Folder` | 3.9 % | 18.3 % |

- INFERRED: the tone layer varies twentyfold. As the carrier of an app's colour it makes Docs and Sheets nearly neutral and Chat loud. Swapping Docs to `Article` would help one app, not the rule.

### 6.4 The rule that follows

INFERRED from §1.3 and §6.2.

| Tile size | Glyph box | Weight | Line | Skirt |
|---|---|---|---|---|
| 64 px | 36 px | regular | 2.25 px | 6 px |
| 48 px | 27 px | regular | 1.69 px | 4.5 px |
| 32 px | 18 px | bold | 1.69 px | 3 px |
| 16 px | 12 px | bold | 1.13 px | none |

- The line stays between 1.1 and 2.3 px at every size.
- The same eight glyphs work at every size, so no second cut is needed. If a specification wants one, `ChatCircle` for `ChatCircleText` at 16 px is the one swap worth testing.

## 7. Contrast and dark mode

EXECUTED with the WCAG 2.2 relative-luminance formula, Deep Field values from `src/lib/identity/palettes.ts`.

| Pair | Ratio | Passes 3:1? |
|---|---|---|
| White glyph on blue `#2D48D4` | 7.03 | yes |
| White glyph on red `#C92035` | 5.61 | yes |
| White glyph on green `#008058` | 4.97 | yes |
| White glyph on yellow `#F19E20` | 2.18 | **no** |
| Ink glyph `#0B0F17` on yellow | 8.81 | yes |
| Ink glyph on blue | 2.73 | **no** |
| Ink glyph on red | 3.42 | yes |
| Ink glyph on green | 3.86 | yes |
| Ink glyph on white `#FFFFFF` | 19.18 | yes |
| Paper glyph `#F4F6F8` on ink-raised `#16181B` | 16.42 | yes |
| Blue, red, green as a glyph on white | 7.03, 5.61, 4.97 | yes |
| Yellow as a glyph on white | 2.18 | **no** |
| Yellow text value `#915B00` on white | 5.68 | yes |
| Lifted hues on ink-raised (`#93B0FF`, `#FF9491`, `#F3A023`, `#60C498`) | 8.34–8.38 | yes |
| Skirt (two ramp steps darker) against its face: blue, red, yellow, green | 1.92, 1.79, 1.85, 2.02 | not needed (see below) |
| Skirt against an ink page: blue, red, yellow, green | 1.42, 1.90, 4.78, 1.91 | not needed |

- **What must pass** (READ, [Understanding SC 1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)). Only "parts of graphics required to understand the content". Here that is the glyph against what it sits on. The tile's edge and the skirt are form, not meaning. When an icon's label is beside it, the icon is not needed to understand the content.
- **The logo exemption does not help** (READ, same page). It holds only where brand rules mandate the colours, and an icon that acts as a control should have a higher-contrast variant. INFERRED: we do not lean on it. Every option in §8 passes on the glyph.
- **Yellow is the exception in every colour-tile option.** No single glyph colour passes on all four hues: white fails on yellow, and ink fails on blue (EXECUTED, above). So the yellow tile carries an ink glyph. INFERRED: state the rule as "the glyph is white unless white fails, then ink", not as a special case.
- **Yellow as a glyph on paper fails.** A paper tile with a coloured glyph would need `#915B00` for Slides and Files, which reads as brown, not as Deep Field's yellow (INFERRED). That is why no option below draws the glyph itself in yellow on paper.
- **Dark mode** (INFERRED). A colour tile keeps the same colours in both themes, so the app's identity does not shift. The glyph-on-tile ratios are then identical. A neutral tile swaps to ink-raised with a paper glyph and lifted hues, which Deep Field already tunes to about 8.4:1 on ink-raised.
- **The skirt on ink** (EXECUTED, §6.1 screenshots). Blue's skirt measures 1.42 against the ink page and nearly vanishes, so in dark mode the key reads as a flat tile. INFERRED: acceptable, since the face carries the meaning. A specification may lift the dark skirt one step if the checkpoint wants the key to show.

## 8. The tile options

Each is drawn on a 64-unit master and scaled. Every size rule is §6.4's unless stated. Hues by app are §4's map. Colours are Deep Field's, named by their key in `palettes.ts` (`deep-field`). A specification turns them into tokens; none exist yet (§10).

### T1. Flat colour tile

- **Tile.** 64 × 64, radius 8. Fill: the app's hue.
- **Glyph.** White `#FFFFFF`; ink `#0B0F17` on yellow. Weight and box by §6.4.
- **Dark mode.** Identical.
- **16 px.** Tile 16, radius 2, glyph 12 bold.
- **Contrast.** 4.97 to 8.81 (§7).
- **Learns from.** Microsoft 2018's colour per app; round one's G2.
- **For.** Fastest to read. Simplest to draw.
- **Against.** Round one called it generic. Nothing in it is Pluto's.

### T2. Paper tile, duotone glyph

- **Tile.** 64 × 64, radius 8. Fill `raised` `#FFFFFF`, a 1 px edge in `paperSoft` `#9EA5B2`.
- **Glyph.** Duotone: the line in `ink` `#0B0F17`, the tone layer in the app's hue at full opacity. Bold line at 32 and 16 px.
- **Dark mode.** Fill `inkRaised` `#16181B`, edge `stageLineStrong` `#252629`. Line in `paper` `#F4F6F8`, tone in the lifted hue.
- **16 px.** Tile 16, radius 2, glyph 12.
- **Contrast.** The line carries the meaning: 19.18 light, 16.42 dark. The tone needs none.
- **For.** Calmest. Closest to C2's neutral screen. Glass-ready: three flat layers.
- **Against.** Colour area varies from 2.4 % to 45.7 % (§6.3), so Docs and Sheets look grey. Reads as white squares at 16 px. Needs CSS reaching into `phosphor-svelte`'s markup, or vendored paths (§2.5).

### T3. Paper key, colour skirt

- **Tile.** Key cap (§5). Skirt: the app's hue. Face: `raised` `#FFFFFF`, 58 high.
- **Glyph.** `ink` `#0B0F17`, centred on the face.
- **Dark mode.** Skirt: the lifted hue. Face: `inkWash` `#23272E`. Glyph: `paper` `#F4F6F8`.
- **16 px.** No skirt. Face 16 × 16, radius 2, with a 1 px inner edge in the hue.
- **Contrast.** Glyph 19.18 light; 13.83 on `inkWash` dark (EXECUTED, same formula as §7).
- **For.** The off-white key itself. Every app has the same amount of colour. Neutral enough for any product screen.
- **Against.** At 32 px the colour is a 3 px line; at 16 px, a hairline. Apps are told apart mostly by glyph.

### T4. Colour key (recommended)

- **Tile.** Key cap (§5). Face: the app's hue, 58 high. Skirt: two ramp steps darker than the face's nearest step.

| Hue | Face | Nearest ramp step | Skirt (ramp step) | Glyph |
|---|---|---|---|---|
| Blue | `#2D48D4` | 8 | `#121593` (10) | white `#FFFFFF` |
| Red | `#C92035` | 7 | `#860C1E` (9) | white `#FFFFFF` |
| Yellow | `#F19E20` | 4 | `#B66E16` (6) | ink `#0B0F17` |
| Green | `#008058` | 7 | `#084C33` (9) | white `#FFFFFF` |

- **Glyph.** Weight and box by §6.4, centred on the face, not the whole tile.
- **Dark mode.** Identical. The skirt fades against the ink page (§7), and that is accepted.
- **16 px.** No skirt. The face alone, 16 × 16, radius 2, glyph 12 bold. It becomes T1 at that size.
- **Mono form** (for Apple-style mono and tinted contexts, and for any surface that must stay neutral). Face `raised` `#FFFFFF`, skirt `paperSoft` `#9EA5B2`, ink glyph; dark: face `inkWash` `#23272E`, skirt `stageRaised` `#0B0D0F`, paper glyph. This is T5 without its tone layer.
- **Contrast.** Glyph on face 4.97 to 8.81, both themes (§7).
- **For.** Reads by hue at 16 px, like T1. The skirt is the owned trait T1 lacks: coloured keys on the off-white canvas, the brief's own picture. Three flat layers (skirt, face, glyph), within Apple's four groups, so glass can be added later. No tone layer, so `phosphor-svelte` is used exactly as shipped, with `weight` and `color`.
- **Against.** Close to T1 at small sizes. Yellow carries an ink glyph while the other three carry white. The key reads less as a key on the dark page.

### T5. Paper key, duotone glyph

- **Tile.** Key cap (§5). Face: `raised` `#FFFFFF` with a 1 px `paperSoft` edge. Skirt: `paperSoft` `#9EA5B2`.
- **Glyph.** As T2: ink line, tone layer in the app's hue.
- **Dark mode.** Face `inkWash` `#23272E`, skirt `stageRaised` `#0B0D0F`. Line `paper`, tone in the lifted hue.
- **16 px.** No skirt. As T2 at 16.
- **Contrast.** As T2.
- **For.** The most literal "off-white chunky key". The neutral skirt is the same for every app, so the family reads as one keyboard.
- **Against.** T2's uneven colour, and its reach into `phosphor-svelte`'s markup.

### Why T4

INFERRED, from §4 to §7.

1. **Recognition.** Only T1 and T4 tell eight apps apart by colour at 16 px. Round one and Google 2020 both show that the glyph alone is too slow.
2. **Ownership.** T1 is what round one rejected as generic. T4 adds the skirt, which comes from the owner's own brief, not from another suite.
3. **Contrast.** It passes in both themes with the same colours, with one stated rule for the glyph.
4. **The settled rules.** One radius at the master (H1). The four hues together only in a launcher or a dock, which C2 lists. Inside a product, one tile and one hue.
5. **The road to glass.** Three flat layers, no baked effects, as Apple's tool asks.
6. **No new code path.** The glyph is a stock `phosphor-svelte` component with `weight` and `color`.

## 9. The package to pin

- **`phosphor-svelte` 3.1.1,** MIT, Svelte `^5.0.0`.
- **Specifier `^3.1.1`** in `package.json` and in the item, with `bun.lock` on 3.1.1. That is the state today, and it follows `001`'s decision 4 (EXECUTED, §2.3).
- **Import path** `phosphor-svelte/lib/<Name>`, never the barrel.
- The product-icon item will name `phosphor-svelte@^3.1.1` automatically when it imports a glyph. Its specification should cite `002` as the place the dependency was first named.
- **Not** `@phosphor-icons/core`, unless a specification picks T2 or T5 and chooses to vendor paths. If it does, pin `@phosphor-icons/core` 2.1.1 as a devDependency used only to read paths at build time, and carry the MIT notice into the item.

## 10. Limits

- **One engine.** Screenshots were Chromium on macOS at ratios 1 and 2. Windows font smoothing, Safari and Firefox were not tried. The release's limits already exclude them (READ, `decisions.md`, after the public-readiness review).
- **One reader.** Legibility was judged by eye from enlarged screenshots. No one else was shown the icons, and no recognition test was run.
- **Not yet tokens.** Deep Field's values come from the identity exhibit (`palettes.ts`), not from `src/app.css`, which still holds today's mark colours. Constitution §4.3 needs every colour from a token. The specification must add the hue, ramp and skirt values as tokens before a registry item can use them.
- **The canvas may change.** The light direction (an early-computing off-white bridging to glass) is being researched separately. If `paper` or `raised` change, §7's neutral rows must be measured again. The colour-key rows do not depend on the canvas.
- **Prior art read narrowly.** Apple's Human Interface Guidelines page did not render, so Apple is cited from its Icon Composer documentation. Google's 2020 icons are cited through an earlier memo's sources, read on 2026-11-01. Linear's page says little about its icon's drawing.
- **A single maintainer.** `phosphor-svelte` rests on one community account. If it stops, its last release keeps working. The fallback is `@phosphor-icons/core`, whose paths are identical (§2.2).
- **Hue conventions.** Docs blue, Sheets green and Slides yellow follow other suites' habits. That aids recognition. It also means the colours alone do not say "Pluto"; the key cap must.
