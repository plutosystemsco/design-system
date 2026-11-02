# How brands colour their code

- **Status:** complete; revised the same day after the owner's review (see "Revision after the owner's review")
- **Date:** 2026-11-01
- **Author:** a researcher
- **Question:** The owner has seen `007`'s highlight palette and does not like it. How do companies bring their brand into code syntax highlighting? Where do they use their brand colours, where do they deviate from them, and why? Then: one original, brand-first palette for the 21 code slots, light and dark, every text slot at 4.5:1 or better. (A second memo covers the general craft of code palettes.)
- **What it blocks:** a palette specification, once the owner chooses.

## How to read this memo

Every claim carries a label.

- **EXECUTED**: we ran it and saw the result, on 2026-11-01, macOS (Darwin 25.5.0, arm64), Bun 1.3.14 and Python 3.10. Contrast is the WCAG 2.2 relative-luminance ratio, computed by a script, not read off a tool. The slot counts ran this repository's own `highlightCode` over its 26 gallery samples. The renders used Playwright 1.64.1's Chromium from this repository's `node_modules`. Nothing was written to this repository except this memo.
- **READ**: a source says so. Each web source was read on 2026-11-01, from the theme or token file itself where one is public (GitHub raw files, npm packages through unpkg and jsDelivr, a site's own stylesheet). The local sources were read the same day: the Pluto Systems design book, version 2, cited as *the design book* with its line; version 1 of the same book, cited as *design book v1*; this repository's files.
- **INFERRED**: our reasoning.

Scratch work was done in a throwaway folder outside this repository, not kept: `dl/` (every downloaded theme and stylesheet), `slots.ts` (characters per slot over the samples), `explore.py` and `palette.py` (the arithmetic), `companies.py` (the companies' own ratios), `render.ts` with `shot-brand-light.png` and `shot-brand-dark.png`, `ts-check.ts`. The proposal's values also sit in a scratch file, `palettes/brand.json`, for the design lead.

Terms of art.

- **Slot.** One `--code-<name>` custom property, a role such as `keyword`. `007` defines 21.
- **Code ground.** The surface a code block sits on.
- **Brand colour.** A colour the brand names as its own: Pluto's ink, paper and the mark's four. A design system's **accent** is the colour its interface spends on action; often, not always, the brand colour.
- **Step.** One value of a colour scale, light to dark (Geist's 100 to 1000, Primer's 0 to 9).
- **Lifted.** A lighter form of a colour, made to pass contrast on a dark ground. This repository's `*-lifted` primitives are lifted forms of the mark's colours.
- **Tint toward paper.** A colour mixed with paper in sRGB; here 40% paper.
- **Active line.** The background band behind the current line. It is not text; its ratio to the ground should be small.
- **Hue family.** The colours that read as one hue at different lightness: navy and periwinkle are one blue family.

## In short

- **Almost nobody puts the exact brand colour on a code token in light mode** (READ, §1). GitHub's accent blue never appears in its syntax tokens. Atlassian's keywords take a blue one step darker than its brand. VS Code's and JetBrains' accents colour buttons and focus, not code. Supabase is the one brand that paints code with its brand green, and only in dark; in light that green measures 2.0:1 on white, so it falls to a dark green at 8.3:1 (EXECUTED).
- **Where the brand does reach code, it is by one of three routes** (INFERRED, §3): the brand's hue on one frequent role (Supabase's green on functions and keys; Tailwind's sky on strings); the brand in the ground (Stripe's navy, Tailwind's near-black, the design book's ink); or the brand's neutrals carrying the block while every hue is borrowed (Vercel, Carbon).
- **Every company adds hues its brand lacks** (READ). Purple appears in seven of the eight themes whose values were read; Stripe is the exception. The ones that stay recognisable keep the added hues pale, few, or one step from each other.
- **The brand's own rule already names the code ground.** The design book §03 gives ink as "All text, code grounds, the icon field" (line 405), and its own code block is ink with pale text and a grey comment, no hue (lines 166 to 167). `004` put code on `muted` instead (READ).
- **Today's palette spends more on hues the brand does not own than on its own.** Over the 26 samples, 33.8% of non-blank characters wear orange, purple, teal, cyan or brown-amber; 15.9% wear the brand blue, 9.8% green, 0.3% red (EXECUTED, §5). That is the likeliest reason it does not read as Pluto.
- **The proposal, "Dots on Ink"** (§6): code on ink in both themes (ink-raised in dark); only the mark's four hues, each at two steps; blue for the language's own words, amber for the names you write, green for the values you write, red for errors and deletions; paper for body, keys and escapes. The strong steps are the dots as they already sit on ink in this repository. **Lowest text ratio: comment, 5.80 in light and 5.16 in dark. Active line 1.12 and 1.17** (EXECUTED).
- **Revised after the owner's review: "Blue on Ink"** (see "Revision after the owner's review"). No yellow, teal or orange. Blue for the language's words, paper for your names, green for your values, red for errors. Lowest text ratio 5.57 in light and 4.96 in dark on the ground, 4.96 and 4.67 on the active line; string against invalid under deuteranopia rose from 2.8 to 12.1 (EXECUTED).
- **A side finding, outside the question:** under this repository's highlighter, an apostrophe in a TypeScript `//` comment turns the next line into a comment and leaves the rest of the block uncoloured. Stock Shiki does not (EXECUTED, §5.3). The gallery's TypeScript sample shows it.

## 1. What the companies do

### 1.1 GitHub (Primer)

- READ, `@primer/primitives` 11.10.0, `dist/css/functional/themes/light.css` and `dark.css`: the `prettylights-syntax-*` tokens. Light: keyword `#cf222e`, constant and tag `#0550ae`, entity (function) `#6639ba`, string `#0a3069`, variable `#953800`, comment `#59636e`, inserted text `#116329`, deleted text `#82071e`. Dark: keyword `#ff7b72`, constant `#79c0ff`, entity `#d2a8ff`, string `#a5d6ff`, tag `#7ee787`, variable `#ffa657`, comment `#9198a1`.
- READ, same files: the accent is `fgColor-accent` `#0969da` (light) and `#4493f8` (dark). It appears in no syntax token. Primer's colour overview gives the accent role as "Links, selected, active, and focus states, and neutral information".
- READ, `primer/github-vscode-theme`, `src/theme.js`: the roles are written as scale steps, `lightDark(scale.red[5], scale.red[3])` for `keyword`, `scale.purple[5]` for functions, `scale.blue[6]` for constants. So the syntax is the Primer scale, not the accent.
- READ: markdown code sits on `bgColor-muted`, `#f6f8fa` light and `#151b23` dark. The page's own muted surface.
- EXECUTED: on that ground the accent measures 4.88 (light); the keyword red 5.03; the constant blue 7.13. INFERRED: GitHub picks a darker blue than its accent for code, and lets its danger red mark keywords. Red keywords are GitHub's signature; they break "red means danger" knowingly.

### 1.2 Vercel (Geist)

- READ, the stylesheet `2ryj4miypvh4v.css` served by `vercel.com/geist/code-block`: `--shiki-color-background: transparent`, text `--ds-gray-1000`, comment `--ds-gray-900`, keyword `--ds-pink-900`, function `--ds-purple-900`, constant `--ds-blue-900`, string and link `--ds-green-900`, parameter `--ds-amber-900`, punctuation `--ds-gray-1000`.
- READ, `vercel.com/geist/colors`: step 900 is "Secondary text and icons"; 1000 is "Primary text and icons". Resolved in the light theme: blue-900 `#0064e2`, green-900 `#107d32`, amber-900 `#a64f00`; in dark `#50a8ff`, `#00ca52`, `#f90` (READ, `27u1fqc0zeu4m.css`).
- INFERRED: Vercel's brand is black and white. Its code keeps that: the body and punctuation are the brand's ink; every hue is borrowed from the system scale at one step, so all colours share one lightness. The ground is whatever surface the block sits on.

### 1.3 Atlassian

- READ, `@atlaskit/code` 20.0.0, `dist/es2019/code-block.compiled.css`: keyword, number, builtin, boolean and key `--ds-text-accent-blue`; string and inserted `--ds-text-accent-green`; class name, function name and property `--ds-text-accent-purple`; tag, constant, type, attribute name and variable `--ds-text-accent-teal`; comment `--ds-text-subtlest`; plain function and punctuation `--ds-text`; deleted `--ds-text-accent-red`. Keywords and keys are bolder. The ground is `--ds-background-neutral`, a translucent tint.
- READ, `@atlaskit/tokens` 20.8.2, `atlassian-light.js` and `atlassian-dark.js`: the brand is `--ds-text-brand` and `--ds-link` `#1868DB` (light), `#669DF1` (dark). The keyword's accent blue is `#1558BC` (light), `#8FB8F6` (dark).
- EXECUTED: on the code ground (`#F0F1F2` once flattened over white) the brand blue measures 4.59 and the keyword blue 5.89; in dark, 5.15 and 6.96.
- INFERRED: Atlassian invents no colour for code. Every token is an accent-text token the product already uses on labels. Keywords take the brand's family one step away from the link, so a keyword never looks like a link.

### 1.4 Supabase

- READ, `supabase/supabase` at `master`, `packages/config/code-block-variables.css`, the docs and UI theme's values. Dark: function, constant and property `#3ecf8e`; keyword `#bda4ff`; string `#ffcda1`; number, link and punctuation `#ffffff`. Light: function, constant and property `#15593b`; keyword `#5f2fc4`; string `#9a5200`; number and link the body colour. The theme file `packages/ui-patterns/src/CodeBlock/supabase-2.json` sets `editor.background` to a page surface variable.
- READ, `packages/marketing/src/go/sections/codeThemes.ts`: the marketing pair keeps the same shape (green on functions, tags, constants and properties; purple keywords) on a transparent ground, with a light string of `#f1a10d`.
- READ, `packages/ui-patterns/src/CodeBlock/CodeBlock.utils.ts`: an older highlight.js theme puts `#3ECF8E` on titles, types, built-ins and variables, and `var(--primary)` on strings, in both modes.
- READ, a search result's summary of `supabase.com/brand`: the brand green is `#3ECF8E`.
- EXECUTED: `#3ECF8E` on white measures 2.0; the light shift `#15593b` measures 8.32; the marketing light string `#f1a10d` measures 2.13; the docs' `#9a5200` 5.86.
- INFERRED: the brand is unmistakable in Supabase's code because one hue owns the names you call and read most. In dark it is the brand value itself. In light the brand gives way to contrast, though not everywhere: the older and marketing themes keep values that fail.

### 1.5 Stripe

- READ, `docs.stripe.com/api`'s stylesheet `docs.d5525e44bb3d65afed34.css`: code tabs and snippets sit on `--sail-color-blue-800`, `rgb(33, 45, 99)`, a navy; headers on `#1a2652`; the highlighted range on `#1a2147`. Text `#f5fbff`. Keyword `blue-200` `rgb(164, 205, 254)`; function `cyan-200`, weight 600; number `orange-200`; string `green-200`; CSS property `red-200`; comment `gray-200`. The navy ground holds on the light docs page.
- READ, `stripe.com/newsroom/brand-assets`: the wordmark colours are "slate, blurple, and white". The page's stylesheet holds `#635bff`.
- EXECUTED: the blurple on the navy ground measures 2.76; the keyword blue 7.86; the function cyan 7.68.
- INFERRED: Stripe brands its code through the ground. The navy is its blue family taken almost to black. The tokens are pale 200-step tints of six hues, each passing easily. The blurple itself never reaches a token.

### 1.6 Tailwind CSS (its documentation)

- READ, `tailwindlabs/tailwindcss.com` at `main`, `src/components/code-example.tsx`: every example sits in `bg-gray-950`, on the light and dark site alike; dark adds `dark:bg-white/5`. The active line is `border-sky-400 bg-sky-300/15`; added and removed lines are teal and red.
- READ, `src/components/syntax-highlighter/theme.json`: one dark theme, every colour a palette variable. Strings and CSS property names `sky-300`; keywords `violet-300`; functions `teal-200`; constants `amber-200`; tags `pink-400`; variables `rose-300`; comments and punctuation `slate-400`; body `slate-50`.
- READ, the mark SVG linked from `tailwindcss.com/brand`: `fill="#38bdf8"`, sky-400.
- INFERRED: Tailwind's brand is its palette, so its code is its palette. The mark's sky sits one step paler on strings and unchanged on the active line's edge, where it is not text. In dark the slab is lifted, not darkened, so it still reads as a surface on a dark page.

### 1.7 Microsoft VS Code, Default Dark and Light Modern

- READ, `microsoft/vscode` at `main`, `extensions/theme-defaults/themes/dark_modern.json` and `light_modern.json`: the interface accent is `#0078D4` (dark) and `#005FB8` (light) on buttons, badges and focus. The editor ground is `#1F1F1F` and `#FFFFFF`. The token colours come from `dark_vs.json`, `light_vs.json` and the "plus" files: keywords `#569cd6` and `#0000ff` (the fuller table is in the memo `a-fuller-python-palette-within-the-books-rules` §1.1).
- EXECUTED: the dark accent on the editor ground measures 3.64; the dark keyword 5.59. The light accent measures 6.31; the light keyword 8.59.
- INFERRED: the accent stays in the interface. Code takes its own blue, which in dark is the one that passes.

### 1.8 JetBrains, the New UI themes

- READ, `JetBrains/intellij-community` at `master`, `platform/platform-resources/src/themes/expUI/expUI_dark.theme.json` and `expUI_light.theme.json`: the accent `Blue4`/`Blue6` is `#3574F0`; panels are `Gray2` `#2B2D30` (dark) and `Gray13` `#F7F8FA` (light).
- READ, `expUI_darkScheme.xml` and `expUI_lightScheme.xml`: the editor ground is `#1E1F22` (dark, the darkest grey of the interface) and `#ffffff` (light, the lightest). Dark: keyword `#cf8e6d`, string `#6aab73`, number `#2aacb8`, function declaration `#56a8f5`, field and constant `#c77dbb`, metadata `#b3ae60`, comment `#7a7e85`. Light: keyword `#0033b3`, string `#067d17`, number `#1750eb`, function declaration `#00627a`, field `#871094`, comment `#8c8c8c`.
- EXECUTED: the accent on the dark editor measures 3.85, on white 4.28. The blues that code does use measure 6.53 (dark function declarations) and 9.88 (light keywords).
- INFERRED: the accent's family reaches code only as shifted steps, lighter in dark, navy in light. The editor ground is the interface's extreme grey, so code is the deepest or brightest surface on screen.

### 1.9 IBM Carbon

- READ, `carbondesignsystem.com/components/code-snippet/style/`: the snippet's text is `$text-primary` on the `$layer` token. "Carbon has defined a set of accessible syntax colors", shown in a CodePen.
- The CodePen could not be fetched: a bot check answered instead of the source. So Carbon's syntax values are not in this memo.
- INFERRED, from what was read: Carbon's component is monochrome, and colour is an optional, separate set.

### 1.10 Not read

Linear, Shopify Polaris, Sourcegraph and Apple's Xcode were in the brief. No public theme or token file for their code was found in the time given (GitHub's code search hit its rate limit; Xcode is not installed on this machine). They are left out, not guessed.

## 2. The comparison

| Company | Brand or accent colour | Roles that carry it | Reused unchanged | Shifted for contrast | Hues added | Code ground vs page | Light vs dark |
|---|---|---|---|---|---|---|---|
| GitHub | accent `#0969da` | none; blue family on constants, tags | none | constant one step darker (7.13 vs accent 4.88) | red keywords, purple functions, orange variables | the page's `muted` | same roles, paler steps in dark |
| Vercel | black / white | body and punctuation | gray-1000 as body | n/a | pink, purple, blue, green, amber, all step 900 | transparent: the page | same step name, values swap |
| Atlassian | `#1868DB` | links; keywords take the blue accent | link only | keyword `#1558BC`, one step darker | purple, teal, green, yellow | translucent neutral over the page | accent tokens swap |
| Supabase | `#3ECF8E` | functions, constants, properties | in dark | light `#15593b` (2.0 → 8.32) | purple keywords, peach or brown strings | a page surface or transparent | brand in dark, dark green in light |
| Stripe | blurple `#635BFF` | the ground, as a navy of its blue | none | the brand's blue taken to a navy | blue, cyan, orange, green, red, all 200-step pales | navy slab on every page | one dark theme |
| Tailwind | sky `#38bdf8` | strings (sky-300), active-line edge (sky-400) | sky-400 on a non-text edge | strings one step paler | violet, teal, amber, pink, rose | gray-950 slab on every page; dark lifts it | one dark theme |
| VS Code | `#0078D4` / `#005FB8` | none | none | keywords a different blue | purple, orange, green, teal, yellow | the editor's own ground | different blues per theme |
| JetBrains | `#3574F0` | dark: function declarations; light: keywords | none | lighter in dark, navy in light | orange, green, teal, purple, olive | the interface's extreme grey | different roles per theme |
| Carbon | IBM blue | none in the component | n/a | n/a | not read | the layer token | n/a |
| Pluto's design book | the four dots | none: its code block has no hue | ink as the ground | n/a | none | ink | the book has one theme |

## 3. What they teach

**Where the brand goes.** INFERRED from §1.

1. **On one high-frequency role, if the brand hue can pass there.** Supabase's green owns functions and keys. Tailwind's sky owns strings. The reader sees that hue on every line, and the block looks like the brand.
2. **On the ground.** Stripe and Tailwind give code a dark slab on every page. Pluto's own design book does the same with ink. The slab is the brand before a token is read.
3. **On links, as the brand token, unchanged.** Atlassian's code links are the brand. Nothing else in its code is.
4. **In the neutrals.** Vercel's code is mostly its black; Carbon's is entirely its text colour.

**Where they deviate, and why.**

1. **Contrast.** A brand colour tuned for fills and logos rarely passes 4.5:1 as text on a light ground. Supabase's green measures 2.0 on white; JetBrains' accent 4.28; VS Code's dark accent 3.64 (EXECUTED). So each shifts a step, darker in light and lighter in dark.
2. **Meaning.** A token in the link colour reads as a link. Atlassian and GitHub keep their keywords a step away from the link blue.
3. **Range.** No brand has enough hues for an editor's dozen roles. Every theme read adds hues; purple most often. The recognisable ones add them with discipline: one step for all (Vercel's 900, Stripe's 200), or one hue owning many roles (Supabase).
4. **Red.** Most keep red for deletion and error (Atlassian, Supabase, VS Code, Tailwind's removed lines). GitHub alone spends it on keywords.

**How light and dark differ.** Two shapes. Either the roles hold and each value swaps for its pair (GitHub, Vercel, Atlassian, Supabase), or the company ships one dark theme and puts it on a dark slab in both page themes (Stripe, Tailwind). The second makes the brand's code look the same everywhere.

## 4. What the brand's own book says about code

- READ, the design book §03, line 405: Ink, "All text, code grounds, the icon field. Not pure black."
- READ, lines 166 to 167 and 343: the book's code block is `background: var(--ink)`, text `#D7DAE2`, comment `#8A90A0`, no other colour. EXECUTED: 12.93 and 5.66 on ink.
- READ, line 430: "blue acts, red stops, amber cautions, green confirms." Line 389: blue is "Links, primary actions, focus". Line 397: amber is "Caution, highlights, open questions. Never body text — contrast fails."
- READ, lines 422 and 440: paper and ink at least 88% of a surface; "No new hues."
- READ, line 439: "No color dots on dark grounds — on ink, everything goes paper-white." `decisions.md` ("After the public-readiness review") later put the mark's coloured dots on ink in their lifted forms for the icon.
- READ, line 312 and line 653: the `::` of the mark is "never presented as code syntax".
- READ, design book v1: the four primaries "behave like syntax highlighting, not paint", and its terminal figure is captioned "ink ground, ANSI-adjacent accents".
- READ, `decisions.md`, "Syntax highlighting is a function, outside the colour budget": the owner ruled that code colour is functional and may use the hues an editor needs.
- INFERRED: the owner's ruling allows new hues; it does not require them. The book's own picture of code is ink with the brand's colours used as accents. That is the brief for a brand-first palette.

## 5. The state here

### 5.1 Today's palette

READ, `tokens/pluto.tokens.json` `code` and `src/app.css`. The ground is `muted` (`#EAEAE7` light, `#2B2D32` dark). Keywords, constants, links and changes are `primary` (`#2456E6` / `#7A9BFF`). Strings and insertions are `success` (`#136E3E` / `#4CC982`). Comments are `muted-foreground`. Five added families: orange numbers and escapes, brown-amber functions (`#85600B` in light), purple built-ins, decorators and `self`, teal types and tags, cyan properties. Red only on invalid and deleted. The `.surface-ink` class already sets the code ground to ink.

READ, `src/lib/registry/lib/highlighter.ts`: operators, punctuation and plain names stay `foreground`; a definition is bold; links are underlined.

### 5.2 Where the colour lands

EXECUTED, `slots.ts`: 7,896 non-blank characters over the 26 samples. By slot: foreground 27.3%, keyword 13.2%, comment 13.0%, string 9.3%, type 8.3%, property 7.9%, number 4.8%, function 4.7%, tag 3.0%, constant 2.3%, builtin 1.9%, escape 1.6%, self 1.0%, decorator 0.6%, inserted 0.5%, link 0.4%, deleted 0.3%.

Under today's map, 33.8% of characters wear the five added families, 15.9% the brand blue, 9.8% green and 0.3% red (EXECUTED, arithmetic on those counts). INFERRED: the added hues outnumber the brand's blue two to one, and the brand's amber appears only as a brown. The palette is close to a stock editor theme. That fits the owner's reaction.

### 5.3 A highlighter fault seen on the way

EXECUTED, `ts-check.ts`: under `highlightCode`, the TypeScript lines `// a run's result` then `interface RunResult {` come back with the second line as a comment and the next lines uncoloured. Without the apostrophe the same lines tokenise correctly. Stock Shiki's `codeToTokens` with a stock theme tokenises the apostrophe version correctly. The gallery's TypeScript sample starts with such a comment. INFERRED: the cause is likely the JavaScript regex engine on the TypeScript grammar's comment rule. It deserves its own finding in the next review; this memo does not chase it.

## 6. The proposal: Dots on Ink

### 6.1 The idea

Code sits on ink in both themes, as the design book already says. It is coloured only with the mark's four hues, in the forms the dots already take on ink. The language's own words are blue. The names you write are amber. The values you write are green. Red is kept for errors and deletions. Paper carries the rest.

Each company lesson it uses (INFERRED):

- **The brand in the ground** (Stripe, Tailwind, the design book): ink slab on the paper page.
- **Dark lifts the slab** (Tailwind's `white/5`, this repository's `.dark .surface-ink`): ink-raised on the ink page.
- **The brand hue on frequent roles** (Supabase): blue keywords are 13% of characters; with built-ins, `self` and tags, blue is 21.8%.
- **Brand values reused unchanged where they pass, shifted where they do not** (Supabase dark, Atlassian): amber passes on ink unchanged; blue, green and red take their existing lifted forms.
- **Added range by steps, not hues** (Vercel, Stripe): each hue has a strong step and a pale step, the pale one 40% toward paper.
- **Red means stop** (Atlassian, Supabase, VS Code): no ordinary token is red.

And where it deviates from them: no added hue at all, because the book says "No new hues" and the mark's four are enough when each has two steps. Keywords share the link's blue, unlike Atlassian; links are told by their underline, and blue "acts" in this brand.

### 6.2 Values, reasoning, contrast

Grounds: light `#14161C` (ink, the brand's own value); dark `#1E2129` (ink-raised, the existing card step). Text values are the same in both themes. Ratios are each slot against its theme's ground (EXECUTED, `palette.py`).

| Slot | Value | Light ratio | Dark ratio | Reasoning |
|---|---|---|---|---|
| `foreground` | `#D7D8D6` | 12.64 | 11.25 | Paper 86% over ink: the body is paper, softened so keys can be brighter. |
| `background` | `#14161C` / `#1E2129` | n/a | n/a | Ink is "code grounds" (§4). Dark lifts one step so the slab reads on the ink page. |
| `comment` | `#919293` | **5.80** | **5.16** | Paper 55% over ink: a neutral grey, the book's own comment idea, warm not blue. The lowest text slot in both themes. |
| `keyword` | `#7A9BFF` | 6.85 | 6.10 | Blue acts. The brand blue as it already sits on ink (`blue-lifted`, the icon's dot on ink). |
| `constant` | `#7A9BFF` | 6.85 | 6.10 | `None`, `true`, `null` are the language's words, so keyword blue, as in VS Code and JetBrains. |
| `string` | `#4CC982` | 8.60 | 7.65 | Green confirms: the values you write. The brand green as it sits on ink (`green-lifted`). |
| `number` | `#90DBB0` | 11.15 | 9.92 | A value, so the green family; the pale step tells it from a string. |
| `escape` | `#F7F7F4` | 16.85 | 15.00 | Paper, the brand's own value: the escape steps out of the green string into paper. |
| `function` | `#F0AE12` | 9.27 | 8.25 | Amber marks highlights: the names you write and call. The brand amber, unchanged; on ink it passes, so it needs no shift. |
| `builtin` | `#ACC0FB` | 10.06 | 8.96 | `print`, `len`: the language's own names, so blue; pale, because they are names, not keywords. Tells a built-in from your function by hue. |
| `type` | `#F3CB6C` | 11.69 | 10.40 | A name you write (a class) or read (a type), so amber; pale, so a type is told from a call. |
| `tag` | `#ACC0FB` | 10.06 | 8.96 | Markup's vocabulary is the language's own words: pale blue. Its attributes are paper, so the two always differ. |
| `property` | `#F7F7F4` | 16.85 | 15.00 | Keys and fields in full paper, brighter than the body: structure is ink and paper's job. |
| `decorator` | `#F3CB6C` | 11.69 | 10.40 | A decorator is a name applied to a definition: the pale amber of types. |
| `self` | `#ACC0FB` | 10.06 | 8.96 | `self`, `this`: the language's word, pale blue with built-ins. |
| `link` | `#7A9BFF` | 6.85 | 6.10 | The brand's link colour on ink, underlined by the highlighter, as links are everywhere in the system. |
| `invalid` | `#FF7D73` | 7.26 | 6.46 | Red stops. The brand red as it sits on ink (`red-lifted`). |
| `inserted` | `#4CC982` | 8.60 | 7.65 | Green confirms: the string green. |
| `deleted` | `#FF7D73` | 7.26 | 6.46 | Red stops. |
| `changed` | `#7A9BFF` | 6.85 | 6.10 | Blue acts. |
| `active-line` | `#1E2129` / `#2B2D32` | 1.12 | 1.17 | One existing step above the ground: ink-raised in light, ink-wash in dark. Subtle, as asked. |

**Lowest text ratio: 5.80 in light, 5.16 in dark, both the comment** (EXECUTED). Every text slot passes 4.5:1. No value equals a hex read from any company's file (EXECUTED: a set intersection with every six-digit hex in the downloads, empty). Every value is a Pluto primitive or a mix of two of them.

### 6.3 What the arithmetic and the render say

- **Shares, under this map** (EXECUTED): paper (body, keys, escapes) 36.7%, comment 13.0%, blue 21.8%, green 14.6%, amber 13.6%, red 0.3%. Every coloured character is one of the mark's hues.
- **Near pairs, light** (EXECUTED, ratio between the two text colours): keyword and built-in 1.47; function and type 1.26; string and number 1.30; foreground and property 1.33; foreground and comment 2.18. WCAG sets no minimum between two text colours. These are luminance ratios; each strong and pale pair also differs in saturation.
- **Render** (EXECUTED, `render.ts`; six samples at 13.5 px, 2×, `shot-brand-light.png` and `shot-brand-dark.png`): the ink slab on paper reads as the brand's code block. Blue keywords, gold calls, pale-gold types, green strings and paper keys are told apart at a glance in Python, JSON, HTML, CSS and Rust. The weakest pair by eye is function and type, two ambers; the bold weight on definitions helps where they meet. Keys in paper against the body is a quiet difference, by design.
- INFERRED: the 88% rule binds a surface's area. On an ink slab most of the area is ink, so the block keeps the budget even though a third of its glyphs are coloured. This was not measured in pixels.

### 6.4 What it costs, and what the owner would be choosing

INFERRED, for the specification to weigh.

- **It reverses `004`'s ground.** `004` decision 8 put code on `muted`. This puts it on ink, which `.surface-ink` already does. The code slots' `background` and `active-line` move to ink and ink-raised, ink-raised and ink-wash.
- **The light theme's code values become the dark ones.** In the token file, `code` would name dark-theme semantics in both themes, or name primitives directly. That breaks `004` decision 5's rule that a code value names a semantic colour unless the specification amends it.
- **Five `syntax-*` colours fall out of use**, and with them lint rule L19's reason. Two new pale steps per hue (three new primitives: pale blue, pale amber, pale green) and two neutrals (body, comment) come in.
- **The editor (`code-editor`) would be an ink slab too.** An app may want a light editor. A paper variant of the same role map (each strong step darkened to pass on paper) is possible and is not computed here.
- **The design book's line 439** ("no color dots on dark grounds") is already set aside for the icon by a decision; code on ink would extend that, and the book's next revision would say so.

## 7. What this memo does not settle

- Whether the owner wants code on ink in the light theme. That is the proposal's central bet.
- Carbon's, Linear's, Polaris', Sourcegraph's and Xcode's values (§1.10).
- Perceptual spacing in OKLCH. The tints are sRGB mixes, to keep the tokens' arithmetic.
- The TypeScript comment fault (§5.3).

## Revision after the owner's review

### R.1 What was asked

- READ, the owner, after seeing Dots on Ink beside the other proposals: "I don't think I like the yellow or the teal colors, can we do something without those colors."
- READ, the design lead's brief for this revision: no yellow, amber, gold, ochre or yellow-brown; no teal, cyan-green or blue-green; no orange. Keep code on ink and the mark's remaining hues. Every text slot at 4.5:1 or better on its ground **and on the active line**; Dots on Ink's dark active line failed that (the comment measured 4.42 on it). Improve string against invalid, which measured 2.8 under deuteranopia.
- Terms. **CVD**, colour-vision deficiency. **Deuteranopia**, **protanopia**, **tritanopia**: the absence of the green, red or blue cone. **CVD distance**: the two colours are passed through Machado's 2009 simulation at full severity, then measured in OKLab, times 100. It is the same metric as the design lead's shared check script; a smaller number means the pair is harder to tell apart.

### R.2 The revision: Blue on Ink

The character changed, so the name did. Amber's roles had to go somewhere. With only blue, green and red left, and red kept for stopping, the names you write move to paper. Paper is the brand's own other colour, and Supabase already shows one colour owning function, property and constant (§1.4). Three of the mark's four dots remain in code.

- **Blue for the language's words.** Keyword, constant, decorator, link, changed at the strong step; type, built-in, `self` and tag at the pale step. Types move from amber to pale blue: in Python `str`, `int` and `float` are the language's own names anyway.
- **Paper for the names you write.** Function and property in full paper. Escapes stay in paper. The body steps down to paper 76% over ink, so the names stand above it by lightness.
- **Green for the values you write.** String and inserted at a lighter green than before; number at a paler step.
- **Red for errors and deletions only**, now a deeper red than `red-lifted`, so it differs from the green by lightness as well as hue.

EXECUTED, `palette2.py`. Grounds as before: ink `#14161C` in light, ink-raised `#1E2129` in dark.

| Slot | Was (Dots on Ink) | Now | Light, on ground | Light, on active line | Dark, on ground | Dark, on active line | Why it changed |
|---|---|---|---|---|---|---|---|
| `foreground` | `#D7D8D6` | `#C1C1C0` | 10.04 | 8.93 | 8.93 | 8.41 | Stepped down so paper names stand above the body. |
| `comment` | `#919293` | `#939495` | 5.95 | 5.30 | 5.30 | 4.98 | Lifted a little so it passes on the dark active line. |
| `keyword` | `#7A9BFF` | `#7A9BFF` | 6.85 | 6.10 | 6.10 | 5.74 | Unchanged. |
| `constant` | `#7A9BFF` | `#7A9BFF` | 6.85 | 6.10 | 6.10 | 5.74 | Unchanged. |
| `string` | `#4CC982` | `#66D795` | 10.09 | 8.98 | 8.98 | 8.45 | Lighter, to stand apart from red without hue. |
| `number` | `#90DBB0` | `#C4E9D2` | 13.72 | 12.21 | 12.21 | 11.49 | Paler, to stand apart from the body under CVD. |
| `escape` | `#F7F7F4` | `#F7F7F4` | 16.85 | 15.00 | 15.00 | 14.11 | Unchanged. |
| `function` | `#F0AE12` (amber) | `#F7F7F4` | 16.85 | 15.00 | 15.00 | 14.11 | Amber removed; names you write are paper. Definitions stay bold. |
| `builtin` | `#ACC0FB` | `#BFCEF9` | 11.55 | 10.28 | 10.28 | 9.67 | Pale blue one step paler, further from the strong blue. |
| `type` | `#F3CB6C` (pale amber) | `#BFCEF9` | 11.55 | 10.28 | 10.28 | 9.67 | Amber removed; types join the language's words in pale blue. |
| `tag` | `#ACC0FB` | `#BFCEF9` | 11.55 | 10.28 | 10.28 | 9.67 | As `builtin`. |
| `property` | `#F7F7F4` | `#F7F7F4` | 16.85 | 15.00 | 15.00 | 14.11 | Unchanged; now shared with functions. |
| `decorator` | `#F3CB6C` (pale amber) | `#7A9BFF` | 6.85 | 6.10 | 6.10 | 5.74 | Amber removed; an annotation reads as syntax, so strong blue. |
| `self` | `#ACC0FB` | `#BFCEF9` | 11.55 | 10.28 | 10.28 | 9.67 | As `builtin`. |
| `link` | `#7A9BFF` | `#7A9BFF` | 6.85 | 6.10 | 6.10 | 5.74 | Unchanged, underlined. |
| `invalid` | `#FF7D73` | `#F05F55` | 5.57 | 4.96 | 4.96 | **4.67** | Deeper red: separation from green by lightness. |
| `inserted` | `#4CC982` | `#66D795` | 10.09 | 8.98 | 8.98 | 8.45 | As `string`. |
| `deleted` | `#FF7D73` | `#F05F55` | 5.57 | 4.96 | 4.96 | **4.67** | As `invalid`. |
| `changed` | `#7A9BFF` | `#7A9BFF` | 6.85 | 6.10 | 6.10 | 5.74 | Unchanged. |
| `active-line` | `#1E2129` / `#2B2D32` | `#1E2129` / `#23262D` | 1.12 | n/a | 1.06 | n/a | Dark is now 40% of the way from ink-raised to ink-wash, so every slot passes on it. |

**Lowest text ratio on the ground: 5.57 in light and 4.96 in dark, both `invalid` and `deleted`. Lowest on the active line: 4.96 in light and 4.67 in dark, the same two** (EXECUTED). Every text slot passes 4.5:1 on its ground and on its active line, in both themes.

Hue check (EXECUTED, HSL hue): blue 225°, pale blue 224°, green 145°, pale green 143°, red 4°; the body and comment are neutral greys (saturation 0.01). No value falls in yellow, amber, orange, teal or cyan. No value matches a company's hex (EXECUTED, the same set intersection as §6.2, empty). New values against today's primitives: the body, the comment, the lighter green, the pale green, the pale blue and the deeper red; ink, ink-raised, paper and blue-lifted are reused.

### R.3 The CVD pairs

EXECUTED, the shared check script and `palette2.py`, over the eight roles foreground, comment, keyword, function, type, string, number and invalid. The values are CVD distances; higher is easier.

| Pair | Dots on Ink, normal / deutan / protan | Blue on Ink, normal / deutan / protan |
|---|---|---|
| string / invalid | 28.1 / **2.8** / 12.8 | 31.6 / **12.1** / 25.0 |
| closest pair, normal vision | function / type 7.8 | foreground / type 7.7 |
| closest pair, deuteranopia | string / invalid 2.8 | foreground / string 5.0 |
| closest pair, protanopia | comment / invalid 5.0 | function / number 6.4 |
| closest pair, tritanopia (`palette2.py`) | n/a | type / number 5.1 |

- String against invalid: under deuteranopia the WCAG luminance ratio between them rose from 1.01 to 1.50, so the two now differ by lightness when hue is lost (EXECUTED).
- The new weakest pairs are a body token against a coloured one: the body against strings (deuteranopia) and against types (normal vision). INFERRED: those meet often but seldom stand for each other; a plain name next to a string is still told by its quotes. A sweep of the body's lightness and the pale steps (`sweep.py`) found no setting whose worst pair beat about 5.2 without dimming the body below 7.6:1 on the active line, so these steps were kept.

### R.4 The render

EXECUTED, `render.ts` again, `shot-brand-v2-light.png` and `shot-brand-v2-dark.png`. The block now reads as ink and paper with blue: keywords and decorators in blue, types and built-ins in a pale periwinkle, calls and keys in bright paper above a softer body, strings in green, numbers a near-white green. It is quieter than Dots on Ink. The pale steps are told from the body mainly by lightness, which is the point of R.3, and that is the trade the owner should look at.

### R.5 What the revision costs

INFERRED, adding to §6.4. Amber leaves code entirely, so the mark's four dots no longer all appear in code. That fits the design book's law 2: blue is "first choice when a surface spends its one color" (line 389). Functions lose their colour and are told by paper brightness and the bold weight on definitions. The red is a new step, deeper than `red-lifted`, kept for code alone; an error badge elsewhere keeps `red-lifted`.

## Sources

All web sources read on 2026-11-01. Local sources read the same day.

**GitHub**

- [`@primer/primitives`, light theme CSS](https://unpkg.com/@primer/primitives/dist/css/functional/themes/light.css) and [dark theme CSS](https://unpkg.com/@primer/primitives/dist/css/functional/themes/dark.css) (11.10.0)
- [`primer/github-vscode-theme`, `src/theme.js`](https://github.com/primer/github-vscode-theme/blob/main/src/theme.js)
- [Primer, colour overview](https://primer.style/foundations/color/overview)

**Vercel**

- [Geist, code block](https://vercel.com/geist/code-block) and its stylesheets `2ryj4miypvh4v.css` and `27u1fqc0zeu4m.css`
- [Geist, colours](https://vercel.com/geist/colors)

**Atlassian**

- [`@atlaskit/code` 20.0.0, `code-block.compiled.css`](https://cdn.jsdelivr.net/npm/@atlaskit/code@20.0.0/dist/es2019/code-block.compiled.css)
- [`@atlaskit/tokens` 20.8.2, `atlassian-light.js`](https://cdn.jsdelivr.net/npm/@atlaskit/tokens@20.8.2/dist/es2019/artifacts/themes/atlassian-light.js) and [`atlassian-dark.js`](https://cdn.jsdelivr.net/npm/@atlaskit/tokens@20.8.2/dist/es2019/artifacts/themes/atlassian-dark.js)

**Supabase**

- [`packages/config/code-block-variables.css`](https://github.com/supabase/supabase/blob/master/packages/config/code-block-variables.css)
- [`packages/ui-patterns/src/CodeBlock/supabase-2.json`](https://github.com/supabase/supabase/blob/master/packages/ui-patterns/src/CodeBlock/supabase-2.json), [`CodeBlock.highlight.ts`](https://github.com/supabase/supabase/blob/master/packages/ui-patterns/src/CodeBlock/CodeBlock.highlight.ts), [`CodeBlock.utils.ts`](https://github.com/supabase/supabase/blob/master/packages/ui-patterns/src/CodeBlock/CodeBlock.utils.ts)
- [`packages/marketing/src/go/sections/codeThemes.ts`](https://github.com/supabase/supabase/blob/master/packages/marketing/src/go/sections/codeThemes.ts)
- [Supabase, brand guidelines](https://supabase.com/brand) (through a search result's summary)

**Stripe**

- [Stripe API reference](https://docs.stripe.com/api) and its stylesheet `docs.d5525e44bb3d65afed34.css`
- [Stripe, brand assets](https://stripe.com/newsroom/brand-assets)

**Tailwind CSS**

- [`src/components/code-example.tsx`](https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/components/code-example.tsx) and [`src/components/syntax-highlighter/theme.json`](https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/components/syntax-highlighter/theme.json)
- [Tailwind CSS, brand](https://tailwindcss.com/brand) and its mark SVG

**Microsoft and JetBrains**

- [`microsoft/vscode`, `extensions/theme-defaults/themes/`](https://github.com/microsoft/vscode/tree/main/extensions/theme-defaults/themes): `dark_modern.json`, `light_modern.json`, `dark_vs.json`, `light_vs.json`, `dark_plus.json`, `light_plus.json`
- [`JetBrains/intellij-community`, `platform/platform-resources/src/themes/expUI/`](https://github.com/JetBrains/intellij-community/tree/master/platform/platform-resources/src/themes/expUI): `expUI_dark.theme.json`, `expUI_light.theme.json`, `expUI_darkScheme.xml`, `expUI_lightScheme.xml`

**IBM**

- [Carbon, code snippet, style](https://carbondesignsystem.com/components/code-snippet/style/); its [CodePen](https://codepen.io/team/carbon/full/eKMBLw/) could not be fetched

**Design book**

- The Pluto Systems design book, version 2: lines 166 to 167 and 343 (its code block), 266 (one accent per surface), 312 and 653 (`::` is never code), 389, 397 and 405 (blue, amber, ink), 422, 430, 439 and 440 (budget, roles, refusals)
- The Pluto Systems design book, version 1: the proportion note and the terminal figure

**Local**

- `context/constitution.md`; `context/decisions.md` ("Syntax highlighting is a function, outside the colour budget"; "After the public-readiness review"; "The design calls for `004`, code and data")
- `context/research/2026-10-31-shiki-and-a-token-highlight-palette.md`; `context/research/2026-11-01-a-fuller-python-palette-within-the-books-rules.md` §1.1, §3
- `tokens/pluto.tokens.json` (`primitives`, `themes`, `code`, `contrast`); `src/app.css`; `src/lib/registry/lib/highlighter.ts`; `src/lib/preview/code-samples.ts`
