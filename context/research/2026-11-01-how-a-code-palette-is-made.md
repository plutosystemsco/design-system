# How a code palette is made

- **Status:** complete
- **Date:** 2026-11-01
- **Author:** a researcher
- **Question:** The owner has seen `007`'s syntax-highlighting palette and does not like it. How is a good palette for code made: how many hues, which roles get colour and which stay plain, how lightness and chroma are balanced, how comments are treated, how a light and a dark version derive from each other, how contrast is met on the code ground, and how a reader with a colour-vision deficiency is served? What is wrong with the current palette, and what would one palette built from that craft look like, still recognisably Pluto Systems? The craft only. How companies bring their brand into code themes is another memo's question.
- **What it blocks:** a palette specification, once the owner chooses.

## How to read this memo

Every claim carries a label.

- **EXECUTED**: we ran it and saw the result, on 2026-11-01, macOS (Darwin 25.5.0, arm64), Bun 1.3.14. Contrast ratios come from this repository's own `scripts/contrast.ts` (WCAG 2.2 relative luminance, truncated to two decimals, never rounded up), imported read-only. The token counts ran this repository's `highlighter.ts` (Shiki 4.5.0, as installed) over `src/lib/preview/code-samples.ts`, read-only.
- **READ**: a source says so. Each web source was read on 2026-11-01. The local sources were read the same day; the design book's rules are cited through the two earlier palette memos and `decisions.md`, which quote it.
- **INFERRED**: our reasoning.

Scratch work was done in a throwaway folder outside this repository, not kept: `color.ts` (OKLCH, colour-vision simulation, APCA), `current.ts` (today's palette measured), `design.ts`, `design2.ts`, `opt.ts` (candidate searches), `final.ts`, `pairs.ts`, `table.ts` (the proposal's checks), `share.ts` (the token counts), and `craft.json` (the proposal as data). Nothing was written to this repository except this memo.

Terms of art.

- **Slot.** One `--code-<name>` custom property, a role the theme colours (`keyword`, `string`). There are 21.
- **Ground.** The surface code sits on. Here, the `code-block` ground: `muted`, `#EAEAE7` (wash) in light and `#2B2D32` (ink-wash) in dark.
- **Hue, lightness, chroma.** Hue is which colour (blue, green). Lightness is how light it looks. Chroma is how far from grey it is.
- **OKLCH.** A colour space whose three numbers are lightness `L` (0 to 1), chroma `C` and hue `h` in degrees, built so equal steps of `L` look like equal steps of lightness. HSL, which the `007` palette was derived in, does not have that property. **OKLab** is the same space in rectangular form.
- **ΔE.** The straight-line distance between two colours in OKLab, here multiplied by 100. Larger is easier to tell apart. Two colours a few units apart are hard to tell apart in thin text.
- **Relative luminance (Y).** WCAG's measure of how much light a colour gives off, 0 for black, 1 for white.
- **Contrast ratio.** WCAG 2.2's `(L1 + 0.05) / (L2 + 0.05)` on relative luminance. SC 1.4.3 asks 4.5:1 for normal text.
- **APCA, Lc.** The Accessible Perceptual Contrast Algorithm, a newer contrast model. Its score, Lc, is signed (positive for dark text on light, negative for light on dark) and meant to track perceived readability equally at every lightness.
- **Colour-vision deficiency (CVD).** Protanopia and deuteranopia lose red-green distinctions (the common forms); tritanopia loses blue-yellow distinctions (rare). We simulate each with published matrices.
- **Landmark.** A token a reader looks for to find their way: a definition, a type, a literal. **Traffic** is everything else: names in use, operators, punctuation.
- **Tier.** A band of lightness that a group of roles share.

## In short

- **The best-documented palettes start from lightness, not hue** (READ, §1). Solarized fixes its tones by CIELAB lightness so light and dark keep "symmetric" lightness differences; Flexoki builds its ramps in Oklab and uses one shade step for light themes and another for dark; the Alabaster essay says "Our eyes are way more sensitive to differences in lightness than in color, and we should use it, not try to negate it."
- **They colour roles, not scopes, and they leave the traffic plain** (READ, §1). Nord, Catppuccin and Rosé Pine each map their roles onto palettes of 15 to 26 named colours, with several roles per colour. Rosé Pine gives one colour to "Type annotations, language types" and "Tag names"; Catppuccin puts "Classes, interfaces, annotations, metadata, enums, types" under one. GitHub's own theme sends `variable.other`, parameters and object members to the body colour. Alabaster colours four classes and no keywords.
- **The current palette sets every accent at the contrast floor** (EXECUTED, §3). In light, all eight accents sit between 4.53 and 5.23:1 on the ground, OKLCH lightness 0.476 to 0.539, while the plain body is 15.00:1. In dark they sit between 4.52 and 7.06, and APCA scores five of them Lc 40 to 46 against the body's 98. So a coloured token is always less legible than a plain one, and accents differ almost only by hue.
- **Because they differ only by hue, they collapse for colour-blind readers** (EXECUTED, §3.2). Simulated deuteranopia puts light `number` and `function` 1.5 ΔE apart and `number` and `invalid` 1.6 apart. Tritanopia puts dark `type` and `property` 1.3 apart. Even with normal vision, light `type` and `property` are 5.6 apart.
- **It colours most of the code** (EXECUTED, §3.3). Across the 26 gallery samples, 27.3% of non-space characters stay in the body colour. Ten distinct text colours and eight hues cover the rest, including keys (7.9%), calls (4.7%) and built-ins (1.9%).
- **The proposal, "Quiet Landmarks", uses five text hues and eight text colours, sets each role at its own lightness, and leaves properties in ink** (§4). Light text ranges from 4.82 to 15.00:1 on the ground, dark from 5.57 to 12.83 (EXECUTED). Every text slot passes 4.5:1 on the ground and on the active line, in both themes. Amber is never text: it is the active line's wash.
- **What it gives up** (EXECUTED, §4.5): keywords move from the brand blue to a quiet navy, so keyword against body falls from 38.1 to 16.3 ΔE in light, by design. Two pairs get closer for rare forms of colour blindness: light `function` and `type` under tritanopia (16.8 to 4.6), and light `inserted` and `deleted` under deuteranopia (10.0 to 8.4), where the diff markers already carry the meaning.

## 1. What the well-regarded palettes do

### 1.1 Solarized: lightness first, symmetric between modes (READ)

Solarized describes itself as "a sixteen color palette (eight monotones, eight accent colors)" with "precise CIELAB lightness relationships". Its monotones have "symmetric CIELAB lightness differences", so switching between light and dark keeps the same perceived contrast. Its accents start from colour-wheel relationships and were translated into CIELAB for consistent lightness, then "adjusted within a small range to achieve the most pleasing combination of colors". It deliberately "reduces brightness contrast but, unlike many low contrast colorschemes, retains contrasting hues".

INFERRED: the useful idea is the method, a lightness plan that is mirrored between modes. Its low body contrast is a choice we cannot take below AA.

### 1.2 Flexoki: ink on paper, built in Oklab (READ)

Flexoki is "inspired by analog inks and warm shades of paper". Its colours are derived from Oklab, so lightness relationships hold at both ends of the range. It notes that strict perceptual evenness can leave a palette "washed out and difficult to parse", and balances evenness against distinctiveness. Its neutrals are mixes of black and paper; its accents each have a full ramp, because opacity would "desaturate the pigment effect". Light themes use the 600 shade of each accent for text and dark themes the 400. Comments take the faintest text tone, punctuation and operators the muted tone, errors red.

INFERRED: "one ramp per hue, one step for light and another for dark" is the cleanest derivation rule we found. Pluto's ink-and-paper brand is close kin to Flexoki's metaphor, which is a reason to study it and not to copy it.

### 1.3 Nord, Catppuccin, Rosé Pine, Tokyo Night: roles share colours (READ)

- **Nord** has sixteen colours in four groups. Its documented roles: `nord3` for comments, `nord7` for "Classes, types, and primitives", `nord8` for "Declarations, calls, and execution of functions", `nord9` for "Keywords, operators, tags, units, and punctuation", `nord12` for annotations and decorators, `nord13` for escapes and regular expressions, `nord14` for strings, `nord15` for numbers, `nord11` for errors. Variables, constants, attributes and fields share `nord4`, near the body.
- **Catppuccin**'s style guide (its editor section marked "still a work-in-progress") maps keywords to Mauve, strings to Green, escapes and regex to Pink, comments and braces to Overlay 2 (a grey), constants and numbers to Peach, functions to Blue, built-ins to Red, and "Classes, interfaces, annotations, metadata, enums, types" to Yellow. It sets no numeric contrast; it says "Legibility always comes first".
- **Rosé Pine**'s colour pages list uses per colour: Pine "Keywords, statements, control flow"; Gold "String literals"; Rose "Function calls, method names, built-ins"; Foam "Type annotations, language types" and "Tag names"; Iris "Special characters, escape sequences" and "Attribute names, properties"; Muted "Comments, documentation prose"; Love "Errors" and "Deletions".
- **Tokyo Night**'s README lists thirteen colours with their uses, for example one for "Number and Boolean constants", one for "Function names, CSS property names", one for "Comments". It says "Many UI elements are intentionally low contrast so as not to distract."

INFERRED: all four group several roles under one colour, and all four give comments a grey or a greyed blue. Their groupings agree on a few pairs: types with tags or annotations, numbers with language constants, escapes with something other than strings.

### 1.4 GitHub Primer's code colours (READ)

GitHub's VS Code theme (`src/theme.js` at `main`) writes every rule as a light and a dark step of one scale, `lightDark(scale.red[5], scale.red[3])`. Light uses the deeper step (5 to 8), dark the lighter (1 to 3). Keywords and storage take red; strings blue[8]/blue[1]; constants, `variable.language` and `support` blue[6]/blue[2]; function names purple; tags green; `variable` orange; comments gray[5]/gray[3]. `variable.other`, parameters, `meta.object.member` and `meta.block` take `color.fg.default`, the body. Inserted, deleted and changed lines get a tinted background as well as a text colour.

INFERRED: the derivation rule is the same as Flexoki's: a role keeps its hue, and its step on the ramp mirrors between modes. Members and parameters stay plain.

### 1.5 Alabaster and the essay on highlighting (READ)

The Alabaster scheme "defines just four classes": strings; "All statically known constants (numbers, symbols, keywords, boolean values)"; comments; and global definitions. It "does not highlight standard language keywords (if, else, function, etc)", as they are "usually least important and most obvious part of any program". It highlights comments rather than dimming them: if code needs an explanation, "it's that explanation we should see and read first". A background-colour variant exists because it is "easier to read when all text is black". "Alabaster Dark is just a dark version based on the same principles."

The essay *I am sorry, but everyone is getting syntax highlighting wrong* (2025-10-15) argues: "If everything is highlighted, nothing is highlighted." "Please, please don't highlight language keywords." "Comments should be highlighted, not hidden away." It warns against palettes whose colours share one lightness and chroma: "Our eyes are way more sensitive to differences in lightness than in color, and we should use it, not try to negate it." And on light themes: "By choosing a light theme, you are dooming yourself to a very limited, bad-looking, barely distinguishable set of dark colors", because "dark colors are in general less distinguishable and more muddy." Its scheme "only uses four" colours.

### 1.6 Modus: accessibility first, and CVD variants (READ)

The Modus themes "conform with the highest standard for color contrast", WCAG AAA, 7:1. Their deuteranopia variants "do not use red and green hues for color-coding purposes, such as for diff removed and added lines", using "mostly shades of yellow and blue"; the tritanopia variants use mainly red and cyan. "If there arises an inescapable trade-off between usability and stylistic considerations, I will always opt for the former." Each theme is a palette of named colours plus semantic mappings, so syntax can be remapped without new colours.

### 1.7 Perceptual colour: OKLCH and APCA (READ)

- OKLCH's `L` "is *perceived* lightness"; HSL's is not, and "Different hues represent different "real" lightness values", which "leads to issues with contrast". Not every OKLCH triple is inside sRGB; the browser clips. The same article warns: "Developers should use APCA to detect contrast. Just OKLCH is not enough."
- APCA's guide: Lc 90 is "Preferred level for fluent text and columns of body text", Lc 75 the minimum for body text columns, Lc 60 the minimum for other content text, Lc 30 the "absolute minimum" for spot-readable text. WCAG 2 "overstates contrast for dark colors", so 4.5:1 can be poor when one colour is near black.
- WCAG 2.2 itself remains the binding test (constitution §4.4): SC 1.4.3 asks "at least 4.5:1"; SC 1.4.1 says colour "is not used as the only visual means of conveying information".

### 1.8 What studies say highlighting does (READ)

- A controlled experiment with 390 undergraduates (*Does syntax highlighting help programming novices?*, Empirical Software Engineering 23(5), 2018) found no evidence that highlighting improves novices' comprehension, and argued it spends a feedback channel the editor could use better. We read the abstract and bibliographic records, not the full text.
- An eye-tracking study (*Syntax highlighting as an influencing factor when reading and comprehending source code*, Journal of Eye Movement Research, 2015) found fixations, durations and regressions "all higher for black-and-white code" but not significantly; readers found colour easier and more pleasant.

INFERRED: highlighting is mostly a comfort and a navigation aid. That argues for colouring few things well, and for never making plain text harder to read.

## 2. The craft, distilled (INFERRED, from §1)

1. **Plan lightness first.** Give each colour role its own lightness band, then choose hues inside the bands. Lightness survives every kind of colour blindness; hue does not.
2. **Few hues.** Four to six hue families, each with a job a reader can name. The surveyed palettes hold sixteen or more colours, but every one assigns several roles to each, and the essay's own scheme uses four.
3. **Colour the landmarks, not the traffic.** Definitions, types, literals and errors earn colour. Names in use, members, operators and punctuation stay in the body colour, so the coloured things stand out. Keywords are frequent and predictable: either plain (Alabaster) or quiet.
4. **Comments are a deliberate choice.** Most palettes dim them; Alabaster brightens them. Either way they must stay readable text, at least 4.5:1 here, and look unlike code.
5. **Chroma follows importance.** Rare landmarks can be vivid; frequent roles should be low chroma, near the body.
6. **Derive dark from light, role by role.** Keep each role's hue. Mirror its lightness tier about the ground. Let dark use more vivid colour where the gamut allows (Flexoki's 600 to 400, Primer's step 6 to step 2).
7. **Contrast is a floor, not a target.** If every accent sits on the floor, every coloured token is the hardest text on the page to read.
8. **Design for CVD by pair.** Not every pair must survive simulation. Pairs of the same shape must: identifiers against identifiers (keyword, function, type, body), prose against prose (string, comment), an escape inside its string, and diff lines (which also carry `+` and `−` markers). Digits are told from identifiers by shape.

## 3. The current palette, measured

### 3.1 Contrast and lightness (EXECUTED)

On the code ground (`muted`), today's values (`tokens/pluto.tokens.json` `code` map, resolved through `src/app.css`):

| Role family | Light | ratio | APCA Lc | OKLCH L | Dark | ratio | APCA Lc | OKLCH L |
|---|---|---|---|---|---|---|---|---|
| body | `#14161C` | 15.00 | 92.2 | 0.201 | `#F7F7F4` | 12.83 | −98.0 | 0.975 |
| comment | `#4A4F5C` | 6.79 | 75.8 | 0.428 | `#A9ADB8` | 6.13 | −53.4 | 0.748 |
| keyword, constant, link, changed | `#2456E6` | 4.90 | 66.2 | 0.517 | `#7A9BFF` | 5.22 | −46.2 | 0.709 |
| string, inserted | `#136E3E` | 5.23 | 68.4 | 0.476 | `#4CC982` | 6.55 | −57.0 | 0.748 |
| number, escape | `#A44F12` | 4.70 | 65.2 | 0.525 | `#E7792A` | 4.70 | −42.2 | 0.690 |
| function | `#85600B` | 4.74 | 65.8 | 0.514 | `#F0AE12` | 7.06 | −60.8 | 0.792 |
| builtin, decorator, self | `#903ACE` | 4.73 | 65.1 | 0.539 | `#B780DF` | 4.70 | −41.8 | 0.691 |
| type, tag | `#15717A` | 4.74 | 65.6 | 0.503 | `#20A6B3` | 4.70 | −42.1 | 0.664 |
| property | `#1B709B` | 4.53 | 64.4 | 0.517 | `#269DD8` | 4.52 | −40.5 | 0.660 |
| invalid, deleted | `#C42A1F` | 4.71 | 64.2 | 0.536 | `#FF7D73` | 5.53 | −49.2 | 0.738 |

The earlier memo derived each new hue as "the lightest value (light theme) or darkest (dark theme) that passes the target on the hardest ground", at 4.7 (READ: `2026-11-01-a-fuller-python-palette-within-the-books-rules.md` §3.2).

### 3.2 Colour-vision simulation (EXECUTED)

Method: the severity-1.0 matrices published for protanopia, deuteranopia and tritanopia (the CVD simulation page in Sources), applied to linear sRGB (our choice; the page does not say which), then ΔE in OKLab. The closest accent pairs today:

| | Light | Dark |
|---|---|---|
| normal vision | `type`/`property` 5.6, `number`/`function` 6.9, `number`/`invalid` 8.4 | `type`/`property` 6.9, `number`/`invalid` 8.5, `keyword`/`property` 9.4 |
| deuteranopia | `number`/`function` 1.5, `number`/`invalid` 1.6, `function`/`invalid` 3.0 | `string`/`invalid` 2.8, `builtin`/`property` 3.8 |
| protanopia | `number`/`function` 2.2, `number`/`invalid` 4.1, `string`/`function` 4.3 | `builtin`/`property` 3.9, `keyword`/`property` 5.4 |
| tritanopia | `type`/`property` 2.0, `string`/`type` 3.6 | `type`/`property` 1.3, `number`/`invalid` 2.3 |

### 3.3 How much of the code is coloured (EXECUTED)

`share.ts` ran `highlightCode` over the 26 samples and counted non-space characters by slot: 7,896 in all. Body 27.3%; keyword 13.2%; comment 13.0%; string 9.3%; type 8.3%; property 7.9%; number 4.8%; function 4.7%; tag 3.0%; constant 2.3%; builtin 1.9%; escape 1.6%; self 1.0%; decorator 0.6%; the diff and link slots 1.2% together. INFERRED caveat: the samples were written to exercise every role, so rare roles are over-represented against real code.

### 3.4 What is wrong, plainly (INFERRED, from §3.1 to §3.3 and §2)

1. **Colour makes text harder to read.** Every accent was set to the floor. In light, a coloured token is 4.5 to 5.2:1 and a plain one 15:1; in dark, APCA puts five accents at Lc 40 to 46, below its own minimum of 60 for content text. The eye reads the coloured tokens as dim, which inverts what highlighting is for.
2. **One lightness, many hues.** The light accents span 0.063 of OKLCH lightness. This is the evenly spaced palette the Alabaster essay warns against. Hue is the weakest cue, so pairs blur at small sizes and fail for colour-blind readers (§3.2).
3. **Too many hues for the job.** Eight hues and ten text colours. Teal and cyan sit 15° apart, cyan and blue 25° (READ, the fuller memo §3.2). A reader cannot name what each means.
4. **The traffic is coloured.** Keys, members and fields (7.9% of characters) take cyan; every call takes amber; built-ins take purple. Only about a quarter of the code is left plain, so nothing stands out.
5. **The brand's accent is spent on keywords.** Blue, the one accent of a Pluto surface, goes to the most frequent, least informative role.
6. **Light and dark are two palettes, not one.** `function` is a dull ochre-brown in light (`#85600B`) and the brightest accent in dark (`#F0AE12`, the brand amber the design book keeps from text). Dark values were each pushed to the floor independently, so the order of emphasis changes between themes.
7. **HSL was the wrong space to derive in.** "Same saturation, search the lightness" in HSL gives colours of unequal perceived lightness and unequal chroma, which is why ochre reads brown and purple reads loud at the same ratio.

## 4. The proposal: Quiet Landmarks

### 4.1 The idea (INFERRED)

Plain ink carries the code. Colour marks only landmarks: the names you define and call, types, literals and errors. Each colour sits at its own lightness as well as its own hue, so roles stay apart for readers with a colour-vision deficiency. Every colour clears 4.5:1, most with room to spare. The brand's blue names functions, green strings, red errors. Amber is never text: it washes the active line, like a highlighter on paper.

### 4.2 The families (EXECUTED values; INFERRED choices)

Each family was set in OKLCH: a hue, a chroma, and a lightness chosen for its tier, with chroma held inside the sRGB gamut (97% of the maximum at that lightness and hue). The grounds and the body are the brand's own: wash and ink-wash, ink and paper.

| Family | Slots | Light | OKLCH | Dark | OKLCH |
|---|---|---|---|---|---|
| body (ink) | `foreground`, `property` | `#14161C` | 0.201 0.012 271 | `#F7F7F4` | 0.975 0.004 106 |
| navy | `keyword`, `builtin`, `self` | `#1E3767` | 0.344 0.090 262 | `#C9DCFE` | 0.891 0.051 262 |
| blue | `function`, `link`, `changed` | `#103DB9` | 0.425 0.200 264 | `#8BB0FD` | 0.761 0.119 264 |
| teal | `type`, `tag`, `decorator` | `#075A5B` | 0.425 0.070 196 | `#4DCCCB` | 0.776 0.110 194 |
| green | `string`, `inserted` | `#096A29` | 0.459 0.129 148 | `#77DC89` | 0.812 0.150 148 |
| violet | `number`, `constant`, `escape` | `#8B44B7` | 0.529 0.180 310 | `#DFB8FD` | 0.840 0.103 310 |
| red | `invalid`, `deleted` | `#BD231F` | 0.518 0.190 28 | `#FD8476` | 0.746 0.150 28 |
| slate | `comment` | `#5F6574` | 0.507 0.025 268 | `#9EA5B5` | 0.721 0.025 267 |
| ground | `background` | `#EAEAE7` | 0.936 0.004 106 | `#2B2D32` | 0.297 0.009 268 |
| amber wash | `active-line` | `#FDEFD6` | 0.957 0.036 82 | `#27241E` | 0.261 0.012 85 |

Five text hues: blue (navy is the same hue at low chroma), teal, green, violet, red. Red serves only errors and deletions. Eight distinct text colours, against ten today. The amber wash takes the brand amber's hue (81°).

EXECUTED: none of these values appears among the hex values quoted by the sources read for this memo or in the repository's memos and tokens, apart from the four brand values kept on purpose (`#14161C`, `#F7F7F4`, `#EAEAE7`, `#2B2D32`).

### 4.3 Why each slot goes where it goes (INFERRED)

- **`foreground`**: ink and paper, unchanged. The body is the brand's.
- **`background`**: the `muted` ground, unchanged (`004` decision 8, the design book's code ground).
- **`comment`**: slate, a cooler, lighter cousin of the brand's `ink-soft`. It is the quietest text in both themes, 4.83 and 5.57, and the only near-grey, so it reads as "not code". The Alabaster argument for bright comments was weighed; most palettes dim them, and the earlier memos and today's palette do too. §5 gives the brighter alternative.
- **`keyword`**: navy, the brand blue folded into ink. It is 13.2% of the characters, so it stays near the body (9.69 / 9.94) and low in chroma. A reader still sees it as different from ink, but it no longer shouts.
- **`builtin`** and **`self`**: navy, with the keywords. They are names the language owns. A Python editor's classic light scheme gives built-ins the keyword colour too (READ, the fuller memo §1.2).
- **`function`**: blue, the brand's accent, vivid. Definitions are bold, as today, so a definition is the strongest mark on the line. Calls share the colour; the slot does not split them.
- **`link`** and **`changed`**: blue. A link is the brand's link colour, underlined. A changed diff line is information, not good or bad.
- **`type`**, **`tag`**, **`decorator`**: teal, one family for "kinds of things". Rosé Pine groups types with tags; Catppuccin groups types with annotations. Teal is a mix of the brand's blue and green, which keeps it of the family.
- **`string`** and **`inserted`**: green, the brand's success hue, in a deeper step than `success` so it sits in its own tier (5.61 in light).
- **`number`**, **`constant`**, **`escape`**: violet. Alabaster's "statically known constants" are one class. An escape inside a string must contrast with it: violet against green is 20.2 ΔE apart under deuteranopia in light, against 8.8 today (§4.5).
- **`property`**: ink. Keys, attributes and fields are traffic. JSON keys stand out by position and by their green values; HTML attributes sit between a teal tag and a green value. GitHub's theme leaves members in the body colour too (§1.4).
- **`invalid`** and **`deleted`**: red. It keeps meaning "wrong". It sits lighter than green in light and darker in dark, so the pair also differs in lightness.
- **`active-line`**: a faint amber wash, 1.06 against the ground in light and 1.12 in dark. It is lighter than the ground in light and darker in dark, so every text slot gains contrast on it.

### 4.4 The contrast table (EXECUTED)

Every text slot against its ground, then against the active line, then its APCA Lc on the ground. Bold is the WCAG ratio on the ground. `active-line` is a background tint; its row gives its ratio to the ground.

| Slot | Light | on ground | on active line | APCA | Dark | on ground | on active line | APCA |
|---|---|---|---|---|---|---|---|---|
| `foreground` | `#14161C` | **15.00** | 15.92 | 92.2 | `#F7F7F4` | **12.83** | 14.41 | −98.0 |
| `comment` | `#5F6574` | **4.83** | 5.13 | 66.6 | `#9EA5B5` | **5.57** | 6.26 | −49.0 |
| `keyword` | `#1E3767` | **9.69** | 10.28 | 84.1 | `#C9DCFE` | **9.94** | 11.16 | −80.3 |
| `constant` | `#8B44B7` | **4.82** | 5.12 | 66.0 | `#DFB8FD` | **8.14** | 9.14 | −68.3 |
| `string` | `#096A29` | **5.61** | 5.95 | 70.2 | `#77DC89` | **8.12** | 9.12 | −68.3 |
| `number` | `#8B44B7` | **4.82** | 5.12 | 66.0 | `#DFB8FD` | **8.14** | 9.14 | −68.3 |
| `escape` | `#8B44B7` | **4.82** | 5.12 | 66.0 | `#DFB8FD` | **8.14** | 9.14 | −68.3 |
| `function` | `#103DB9` | **7.28** | 7.73 | 76.5 | `#8BB0FD` | **6.38** | 7.16 | −55.4 |
| `builtin` | `#1E3767` | **9.69** | 10.28 | 84.1 | `#C9DCFE` | **9.94** | 11.16 | −80.3 |
| `type` | `#075A5B` | **6.64** | 7.05 | 74.8 | `#4DCCCB` | **7.09** | 7.96 | −61.0 |
| `tag` | `#075A5B` | **6.64** | 7.05 | 74.8 | `#4DCCCB` | **7.09** | 7.96 | −61.0 |
| `property` | `#14161C` | **15.00** | 15.92 | 92.2 | `#F7F7F4` | **12.83** | 14.41 | −98.0 |
| `decorator` | `#075A5B` | **6.64** | 7.05 | 74.8 | `#4DCCCB` | **7.09** | 7.96 | −61.0 |
| `self` | `#1E3767` | **9.69** | 10.28 | 84.1 | `#C9DCFE` | **9.94** | 11.16 | −80.3 |
| `link` | `#103DB9` | **7.28** | 7.73 | 76.5 | `#8BB0FD` | **6.38** | 7.16 | −55.4 |
| `invalid` | `#BD231F` | **5.08** | 5.40 | 66.3 | `#FD8476` | **5.73** | 6.43 | −50.7 |
| `inserted` | `#096A29` | **5.61** | 5.95 | 70.2 | `#77DC89` | **8.12** | 9.12 | −68.3 |
| `deleted` | `#BD231F` | **5.08** | 5.40 | 66.3 | `#FD8476` | **5.73** | 6.43 | −50.7 |
| `changed` | `#103DB9` | **7.28** | 7.73 | 76.5 | `#8BB0FD` | **6.38** | 7.16 | −55.4 |
| `active-line` | `#FDEFD6` | **1.06** | | | `#27241E` | **1.12** | | |

The lowest text ratio is 4.82 in light (`number`, `constant`, `escape`) and 5.57 in dark (`comment`), against 4.53 and 4.52 today. The lowest APCA magnitude is 66.0 in light and 49.0 in dark, against 64.2 and 40.5 today. Light accents now span OKLCH lightness 0.344 to 0.529, against 0.476 to 0.539.

### 4.5 The pairs that must stay apart (EXECUTED)

ΔE in OKLab, normal / deuteranopia / protanopia / tritanopia. Today first, the proposal second.

| Pair | Light today | Light proposal | Dark today | Dark proposal |
|---|---|---|---|---|
| body / keyword | 38.1/38.0/40.8/35.4 | 16.3/15.8/17.2/15.5 | 30.8/32.5/28.8/29.5 | 10.0/10.5/9.1/9.6 |
| keyword / function | 32.7/31.8/31.2/17.9 | 13.7/13.8/14.6/10.7 | 32.2/33.3/29.6/24.3 | 14.7/15.5/13.7/14.4 |
| function / type | 16.2/14.4/13.2/16.8 | 18.5/16.8/17.2/4.6 | 27.1/25.9/19.5/26.2 | 13.2/8.9/10.5/5.7 |
| keyword / type | 19.6/18.1/18.6/5.4 | 12.0/11.2/11.9/9.0 | 14.8/11.0/11.3/4.0 | 15.4/11.7/9.2/14.4 |
| type / property | 5.6/5.3/5.4/2.0 | 23.4/22.2/24.8/24.2 | 6.9/6.6/6.6/1.3 | 22.8/20.9/16.0/23.8 |
| string / comment | 13.2/8.2/10.9/8.9 | 15.1/9.8/10.9/8.1 | 15.9/7.2/10.3/12.0 | 18.7/13.5/16.9/13.0 |
| string / escape | 19.8/8.8/4.9/24.4 | 31.3/20.2/23.6/16.2 | 25.3/9.2/16.9/32.2 | 25.1/14.7/18.2/14.5 |
| inserted / deleted | 27.8/10.0/7.0/31.6 | 28.4/8.4/7.1/30.8 | 28.1/2.8/12.8/31.5 | 26.8/5.8/17.4/29.3 |

INFERRED reading. Keywords are quieter by design: they move closer to the body. Every other must-pair is wider under deuteranopia and protanopia except light diff lines (10.0 to 8.4 under deuteranopia), which keep their `+`/`−` markers. The proposal's weakest cells are tritanopia: light `function`/`type` 4.6 and dark 5.7. The weakest pair overall is `function` against `number` under protanopia (4.2 light, 5.3 dark), which is a word against digits.

### 4.6 How dark derives from light (INFERRED, with EXECUTED values)

- **Same hue per role**, within 3° (§4.2).
- **Same role order at the ends.** The body is first and comments are last in both themes; navy is the nearest colour to the body in contrast in both.
- **The middle follows the gamut.** Blue cannot be light and vivid at once in sRGB. So dark `function` sits lower (6.38) than green and violet (8.1), which can be both light and chromatic. Flexoki and Primer meet the same limit with their shade steps.
- **Dark uses more of its room.** The dark text band is 5.57 to 12.83 on the ground, against 4.82 to 15.00 in light. The APCA scores are why: WCAG overstates dark contrast (§1.7), so dark accents carry more WCAG margin.

## 5. What it costs, and what this memo does not settle

- **The tokens (INFERRED).** The `code` map keeps its 21 slots and the highlighter keeps its scopes; only the values change. `property` becomes `foreground` (its class still exists). The five `syntax-*` pairs would be replaced by about seven: navy, a code blue, teal, a code green, violet, a code red, slate, plus the amber wash. Today `string` reuses `success` and `keyword` reuses `primary` (`004` decision 5); the proposal's deeper green and blue would need their own names.
- **Decisions it would reverse (READ, `decisions.md`).** `007`'s amber `function` and cyan `property`; `004`'s keyword as `primary`; the comment as `muted-foreground`; the active line as `card`. `007`'s lint rule L19 still applies to the new `syntax-*` names.
- **Not rendered.** This memo judged by arithmetic. The next check is a render of the gallery's 26 samples at native size and at 2×, in both themes, beside today's palette.
- **The ink surface.** `007`'s run panel puts code on ink inside a light page. Its ground was not checked here.
- **A brighter-comment variant.** If the owner wants Alabaster's view, comment can take the brand's `ink-soft` (`#4A4F5C`, 6.79 in light; `#A9ADB8`, 6.13 in dark, today's values). The order of emphasis then puts comments above strings.
- **For the owner, once the palettes are compared** (INFERRED): (a) adopt Quiet Landmarks, recommended; (b) adopt the other memo's brand-led option; (c) keep `007`'s palette and lift its accents off the floor.

## Sources

**Palettes and their reasoning**

- [Solarized](https://ethanschoonover.com/solarized/)
- [Flexoki](https://stephango.com/flexoki)
- [Nord, colors and palettes](https://www.nordtheme.com/docs/colors-and-palettes)
- [Catppuccin, style guide](https://github.com/catppuccin/catppuccin/blob/main/docs/style-guide.md)
- Rosé Pine, colour pages: [palette](https://rosepinetheme.com/palette/), [pine](https://rosepinetheme.com/palette/pine/), [gold](https://rosepinetheme.com/palette/gold/), [rose](https://rosepinetheme.com/palette/rose/), [foam](https://rosepinetheme.com/palette/foam/), [iris](https://rosepinetheme.com/palette/iris/), [muted](https://rosepinetheme.com/palette/muted/), [love](https://rosepinetheme.com/palette/love/)
- [Tokyo Night for VS Code, README](https://github.com/enkia/tokyo-night-vscode-theme)
- [GitHub's VS Code theme, `src/theme.js`](https://raw.githubusercontent.com/primer/github-vscode-theme/main/src/theme.js)
- [Alabaster, README](https://github.com/tonsky/sublime-scheme-alabaster)
- [*I am sorry, but everyone is getting syntax highlighting wrong*](https://tonsky.me/blog/syntax-highlighting/) (2025-10-15)
- [Modus themes, manual](https://protesilaos.com/emacs/modus-themes)

**Colour science and contrast**

- [OKLCH in CSS: why we quit RGB and HSL](https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl)
- [APCA in a nutshell](https://git.apcacontrast.com/documentation/APCA_in_a_Nutshell); [APCA-W3 source, constants 0.0.98G](https://raw.githubusercontent.com/Myndex/apca-w3/master/src/apca-w3.js)
- [A physiologically-based model for simulation of color vision deficiency, matrices](https://www.inf.ufrgs.br/~oliveira/pubs_files/CVD_Simulation/CVD_Simulation.html)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/), SC 1.4.1 and 1.4.3

**Studies**

- *Does syntax highlighting help programming novices?*, Empirical Software Engineering 23(5), 2795 to 2828, 2018, [doi:10.1007/s10664-017-9579-0](https://doi.org/10.1007/s10664-017-9579-0) (abstract and bibliographic records only)
- [*Syntax highlighting as an influencing factor when reading and comprehending source code*](https://bop.unibe.ch/JEMR/article/view/2429), Journal of Eye Movement Research, 2015

**Local**

- `context/constitution.md` §4.3, §4.4; `context/decisions.md` ("Syntax highlighting is a function, outside the colour budget"; "The design calls for `007`"; "The design calls for `004`")
- `context/research/2026-10-31-shiki-and-a-token-highlight-palette.md` §4; `context/research/2026-11-01-a-fuller-python-palette-within-the-books-rules.md` §1, §3
- `tokens/pluto.tokens.json` (`primitives`, `themes`, `code`, `contrast`); `src/app.css` lines 60 to 85 and 152 to 177; `src/lib/registry/lib/highlighter.ts`; `src/lib/preview/code-samples.ts`; `scripts/contrast.ts`

## 6. Revision after the owner's review

### 6.1 What the owner said (READ)

The owner saw Quiet Landmarks rendered beside the other proposals, the same day. Their words: "I don't think I like the yellow or the teal colors, can we do something without those colors." Passed on with the brief: no yellow, amber, gold, ochre or yellow-brown anywhere, the active line's amber wash included; no teal, cyan-green or blue-green anywhere; and no orange, since a dark orange reads as brown in the light theme. The principles of §2 and §4 stand. Sections 4 and 5 above are kept as the record of the first proposal.

### 6.2 What changed, per slot (INFERRED, with EXECUTED values)

The revision is named **Plum Landmarks**: its character changed, from a teal landmark to a plum one. Five text hues remain: blue (navy is the same hue at low chroma), plum, violet, green, red. No hue falls between 40° and 230° except green, which moved from 148° to 144°, away from blue-green.

| Slots | First proposal (light / dark) | Revision (light / dark) | Why |
|---|---|---|---|
| `type`, `tag`, `decorator` | teal `#075A5B` / `#4DCCCB` | plum `#992572` / `#FEA9D9`, OKLCH 0.476 0.170 345 / 0.831 0.116 345 | Teal is gone. The remaining room is red-violet. A plum at 345° sits 43° from the red of errors and 45° from violet. Tried first, a violet type with magenta numbers put `function` and `type` 2.6 ΔE apart under protanopia in light and 1.5 in dark; the plum type gives 12.0 and 6.5 |
| `number`, `constant`, `escape` | violet `#8B44B7` / `#DFB8FD`, 310° | violet `#7E4AC2` / `#D3BEFD`, 300° | Moved 10° toward blue, away from plum, so types and literals differ by hue as well as lightness |
| `keyword`, `builtin`, `self` | navy `#1E3767`, 9.69 | navy `#1B325F`, 10.44 (dark unchanged, `#C9DCFE`) | Light navy is a step darker, so it stays apart from plum under protanopia (7.2) |
| `string`, `inserted` | green `#096A29` / `#77DC89`, 148° | green `#1B6921` / `#81DA81`, 144° | Pulled toward pure green, away from blue-green |
| `comment` | slate `#5F6574` / `#9EA5B5` | light unchanged; dark `#9CA3B3` | Dark comment is a touch darker, so it stays the quietest text |
| `active-line` | amber wash `#FDEFD6` / `#27241E` | blue-grey wash `#EEF3FB` / `#22252A`, OKLCH 0.963 0.012 260 / 0.264 0.010 261 | Amber is gone. A faint tint of the brand blue's hue, lighter than the ground in light and darker in dark, as before |
| `function`, `link`, `changed`; `invalid`, `deleted`; `foreground`, `property`; `background` | | unchanged | No yellow, orange or teal among them |

EXECUTED: none of the new values appears among the hex values quoted by the sources read for this memo, or in the repository's memos and tokens.

### 6.3 The contrast table (EXECUTED)

Each slot against its ground, then against the active line, then its APCA Lc on the ground. The `active-line` row gives its ratio to the ground.

| Slot | Light | on ground | on active line | APCA | Dark | on ground | on active line | APCA |
|---|---|---|---|---|---|---|---|---|
| `foreground` | `#14161C` | **15.00** | 16.23 | 92.2 | `#F7F7F4` | **12.83** | 14.32 | −98.0 |
| `comment` | `#5F6574` | **4.83** | 5.23 | 66.6 | `#9CA3B3` | **5.44** | 6.07 | −47.9 |
| `keyword` | `#1B325F` | **10.44** | 11.29 | 85.8 | `#C9DCFE` | **9.94** | 11.09 | −80.3 |
| `constant` | `#7E4AC2` | **4.77** | 5.17 | 65.8 | `#D3BEFD` | **8.23** | 9.18 | −68.9 |
| `string` | `#1B6921` | **5.63** | 6.10 | 70.5 | `#81DA81` | **8.05** | 8.98 | −67.8 |
| `number` | `#7E4AC2` | **4.77** | 5.17 | 65.8 | `#D3BEFD` | **8.23** | 9.18 | −68.9 |
| `escape` | `#7E4AC2` | **4.77** | 5.17 | 65.8 | `#D3BEFD` | **8.23** | 9.18 | −68.9 |
| `function` | `#103DB9` | **7.28** | 7.88 | 76.5 | `#8BB0FD` | **6.38** | 7.11 | −55.4 |
| `builtin` | `#1B325F` | **10.44** | 11.29 | 85.8 | `#C9DCFE` | **9.94** | 11.09 | −80.3 |
| `type` | `#992572` | **6.08** | 6.58 | 71.8 | `#FEA9D9` | **7.80** | 8.70 | −66.0 |
| `tag` | `#992572` | **6.08** | 6.58 | 71.8 | `#FEA9D9` | **7.80** | 8.70 | −66.0 |
| `property` | `#14161C` | **15.00** | 16.23 | 92.2 | `#F7F7F4` | **12.83** | 14.32 | −98.0 |
| `decorator` | `#992572` | **6.08** | 6.58 | 71.8 | `#FEA9D9` | **7.80** | 8.70 | −66.0 |
| `self` | `#1B325F` | **10.44** | 11.29 | 85.8 | `#C9DCFE` | **9.94** | 11.09 | −80.3 |
| `link` | `#103DB9` | **7.28** | 7.88 | 76.5 | `#8BB0FD` | **6.38** | 7.11 | −55.4 |
| `invalid` | `#BD231F` | **5.08** | 5.50 | 66.3 | `#FD8476` | **5.73** | 6.39 | −50.7 |
| `inserted` | `#1B6921` | **5.63** | 6.10 | 70.5 | `#81DA81` | **8.05** | 8.98 | −67.8 |
| `deleted` | `#BD231F` | **5.08** | 5.50 | 66.3 | `#FD8476` | **5.73** | 6.39 | −50.7 |
| `changed` | `#103DB9` | **7.28** | 7.88 | 76.5 | `#8BB0FD` | **6.38** | 7.11 | −55.4 |
| `active-line` | `#EEF3FB` | **1.08** | | | `#22252A` | **1.11** | | |

The lowest text ratio is 4.77 in light (`number`, `constant`, `escape`) and 5.44 in dark (`comment`). On the active line the lowest is 5.17 and 6.07. The lowest APCA magnitude is 65.8 in light and 47.9 in dark. Today's palette: 4.53 and 4.52, APCA 64.2 and 40.5.

### 6.4 The pairs that must stay apart (EXECUTED)

ΔE in OKLab, normal / deuteranopia / protanopia / tritanopia, by the method of §3.2.

| Pair | Light today | Light revision | Dark today | Dark revision |
|---|---|---|---|---|
| body / keyword | 38.1/38.0/40.8/35.4 | 14.4/13.9/15.2/13.6 | 30.8/32.5/28.8/29.5 | 10.0/10.5/9.1/9.6 |
| keyword / function | 32.7/31.8/31.2/17.9 | 15.2/15.5/16.4/12.7 | 32.2/33.3/29.6/24.3 | 14.7/15.5/13.7/14.4 |
| function / type | 16.2/14.4/13.2/16.8 | 24.6/16.9/12.0/24.0 | 27.1/25.9/19.5/26.2 | 16.8/13.2/6.5/20.5 |
| keyword / type | 19.6/18.1/18.6/5.4 | 23.5/17.6/7.2/26.5 | 14.8/11.0/11.3/4.0 | 13.5/6.1/10.9/15.8 |
| type / property | 5.6/5.3/5.4/2.0 | 32.2/28.1/21.7/32.6 | 6.9/6.6/6.6/1.3 | 18.6/14.4/19.0/18.4 |
| string / comment | 13.2/8.2/10.9/8.9 | 15.3/10.5/11.7/8.3 | 15.9/7.2/10.3/12.0 | 19.0/14.5/17.6/12.5 |
| string / escape | 19.8/8.8/4.9/24.4 | 31.2/23.0/25.6/13.0 | 25.3/9.2/16.9/32.2 | 23.6/15.7/18.4/10.8 |
| inserted / deleted | 27.8/10.0/7.0/31.6 | 27.9/8.1/7.0/30.8 | 28.1/2.8/12.8/31.5 | 26.2/5.6/17.2/28.0 |

INFERRED reading. Against the first proposal, the revision gains on the tritanopia cells that were weakest (`function`/`type` 4.6 to 24.0 in light, 5.7 to 20.5 in dark). It loses on protanopia for `function`/`type` in dark (10.5 to 6.5) and `keyword`/`type` in light (11.9 to 7.2), both still clear of the collapses of §3.2.

The weakest pair of all is new. It is light `type` against `comment` under deuteranopia, 2.5 ΔE: there plum and slate both read as a dull blue at one lightness. That is an identifier against prose, which a comment's `#` or `//` and its position tell apart. Moving `type` to 352° raised it only to 2.8, and brought it 2.0 closer to `invalid`. Putting comments back at `ink-soft` (§5) would separate them by lightness, at the cost of comments no longer being the quietest text. Neither change was made.

The renders the owner saw are where the colours are judged by eye; this memo did not look at them.
