# Blue on Ink meets GitHub

- **Status:** complete
- **Date:** 2026-11-01
- **Author:** a researcher
- **Question:** The owner likes Blue on Ink, wants a light version of it, and names GitHub's highlighting as a favourite. How does GitHub colour code, read from its own theme files: which roles take which hue, how lightness is laid out, and why it reads well? What of it fits Blue on Ink and what conflicts? And what are three distinct palettes that blend the two, each with a light and a dark version, all 21 slots, no yellow, orange or teal, red kept rare, every text slot at 4.5:1 or better, and no value copied from GitHub?
- **What it blocks:** a palette specification, once the owner chooses.

## How to read this memo

Every claim carries a label.

- **EXECUTED**: we ran it and saw the result, on 2026-11-01, macOS (Darwin 25.5.0, arm64), Python 3. Contrast ratios are WCAG 2.2 relative luminance, truncated to two decimals, never rounded up. The colour-vision figures come from the design lead's shared check script, `check.py` (imported, not changed), whose `report()` rounds where this memo truncates, so a value may differ from its printout by 0.01. Nothing was written to this repository except this memo.
- **READ**: a source says so. Each web source was fetched on 2026-11-01 and read as a file. The local sources were read the same day: the two code-palette memos of today, cited as *the brands memo* and *the craft memo*; `tokens/pluto.tokens.json`; `src/lib/registry/lib/highlighter.ts`.
- **INFERRED**: our reasoning.

Scratch work was done in a throwaway folder outside this repository, not kept: `gh-dl/` (the fetched GitHub files, kept apart from the scripts), `ok.py` (OKLCH conversion, contrast, a tritanopia matrix beside `check.py`'s two), `gh.py` (every hex value in the fetched files), `search.py` and its runs (a random search over lightness tiers), `assemble.py` (the three palettes and every check). The palettes' values were also written to `variations.json` in the same throwaway folder, for the design lead's comparison page.

Terms of art.

- **Slot.** One `--code-<name>` custom property, a role the theme colours. There are 21 (`highlighter.ts`).
- **Ground.** The surface code sits on. **Active line**: the band behind the line the cursor is on.
- **Primer.** GitHub's design system. Its code colours are tokens named `prettylights-syntax-*`.
- **Scale step.** One value of a Primer colour ramp, numbered 0 (palest) to 9 (deepest).
- **OKLCH.** A colour space of lightness `L` (0 to 1), chroma `C` (distance from grey) and hue `h` in degrees, built so equal steps of `L` look equal.
- **Tier.** A band of lightness that several roles share.
- **Landmark** and **traffic.** A landmark is a token a reader looks for: a definition, a type, a literal. Traffic is the rest: names in use, members, operators (the craft memo).
- **CVD.** Colour-vision deficiency. **Deuteranopia** and **protanopia** lose the green or the red cone; **tritanopia** the blue cone. **CVD distance**: both colours are passed through the simulation for that deficiency at full severity, then measured in OKLab, times 100. Larger is easier to tell apart. Under about 5, thin text is hard to tell apart.
- **Mirror.** A role keeps its hue between themes and takes the step on the other side of the ground: deep on a light ground, pale on a dark one.

## In short

- **GitHub colours code with five hue families and a grey, each written as one light step and one dark step of a Primer scale** (READ, §1.1). Red for keywords, storage words and escapes; purple for function names; one blue for constants, the language's own names (`support`, `variable.language`) and property names; a deeper or paler blue for strings; orange for variables and type names; green for tags. Parameters, members and `variable.other` stay in the body colour.
- **Its lightness has three tiers, mirrored between themes** (EXECUTED, §1.3). In light, strings sit nearest the body (12.80:1 on white against the body's 15.79), functions, constants, variables and tags share a middle tier (7.34 to 7.59), and keywords sit furthest out (5.35), the most chromatic token. In dark the same order holds about the ground: strings 12.31, the middle tier 9.71 to 9.77, keywords 7.50.
- **Why it reads well** (INFERRED, §1.4). The one warm, vivid hue goes to the words that shape control flow, so the skeleton of a function shows at a glance. The longest runs of text, strings, are the quietest colour. The traffic is plain. Every hue has one nameable job.
- **What it costs** (EXECUTED, §1.5). On github.com's token set the keyword red `#cf222e` and the error red `#d1242f` are 0.5 apart: a keyword and an error look the same. Function purple and constant blue fall to 2.3 and 2.4 under deuteranopia and protanopia. The error colour measures 4.38:1 on GitHub's light active line.
- **Fits Blue on Ink**: role families, plain traffic, mirrored steps, blue for the language's own names, green, purple. **Conflicts**: red keywords (Blue on Ink keeps red for errors), orange variables and types, orange "changed", blue strings (Blue on Ink's blue is its keywords), and the ground (§1.6).
- **Three variations, each original, each passing** (EXECUTED, §3 to §5; summary in §6):
  - **Violet Calls**: Blue on Ink kept, plus GitHub's violet for functions. Paper in light, ink-raised in dark. Lowest text ratio 5.18:1 in light and 4.88 in dark, on the active line.
  - **Plum and Navy**: GitHub's role map in Pluto's colours. Plum keywords, violet functions, blue constants, navy strings, green types. Wash in light, ink in dark. Lowest 5.24 in light and 4.60 in dark.
  - **Blue Names**: the brand blue moves to functions; keywords go quiet in violet; every value is green. Paper in light, ink in dark. Lowest 5.12 in light and 4.98 in dark.
- **Every closest colour-blind pair among the eight core roles is 6.4 or more**, in all six themes and all three simulated deficiencies (EXECUTED, §6). Blue on Ink's was 5.0; GitHub's is 0.5.
- **No value equals any of the 617 distinct hex values in the fetched GitHub files**, and no value falls in a yellow, orange, brown or teal hue (EXECUTED, §7). That rules out raised `#FFFFFF` as a ground: it is GitHub's canvas too.

## 1. GitHub, read at its source

### 1.1 Where the values live (READ)

- `@primer/primitives` 11.10.0 (unpkg's current version, by its redirect), `dist/css/functional/themes/light.css` and `dark.css`. These are the `prettylights-syntax-*` tokens github.com uses. Each carries a doc comment, for example `entity`: "class names, type definitions, and declarations"; `variable`: "variables and parameters"; `keyword`: "language keywords (if, else, return)" (dark.css lines 626 to 649).
- `primer/github-vscode-theme`, `src/theme.js` at `main`, from line 332 (`tokenColors`). Every rule is `lightDark(scale.<hue>[light step], scale.<hue>[dark step])`. Its `src/colors.js` reads `@primer/primitives` 7.10.0's `dist/json/colors/*.json` (the version `package.json` pins), and overrides a few values, such as the light body `#1f2328`.
- Code on github.com sits on `bgColor-muted`: `#f6f8fa` light, `#151b23` dark (light.css and dark.css line 46). The VS Code theme sets the editor on `canvas.default`, white or `#0d1117`.

### 1.2 The role map (READ)

| Role | Scopes, in the VS Code theme | Hue family | Light step / dark step | github.com token, light / dark |
|---|---|---|---|---|
| Keyword, storage | `keyword`, `storage`, `storage.type` (lines 403, 409) | red | 5 / 3 | `keyword` `#cf222e` / `#ff7b72` |
| Escape, placeholder | `constant.character`, `constant.other.placeholder` (line 345) | red | 5 / 3 | as keyword |
| Constant, language name, property name | `constant`, `variable.language`, `entity`, `support`, `meta.property-name` (lines 358, 434, 440) | blue | 6 / 2 | `constant` `#0550ae` / `#79c0ff` |
| String, regexp | `string`, `string.regexp` (line 428) | blue | 8 / 1 | `string` `#0a3069` / `#a5d6ff` |
| Function name | `entity.name.function` (line 388) | purple | 5 / 2 | `entity` `#6639ba` / `#d2a8ff` |
| Type name, variable | `entity.name`, `variable` (lines 368, 446) | orange | 6 / 2 | `variable` `#953800` / `#ffa657` |
| Tag | `entity.name.tag`, `support.class.component` (line 397) | green | 6 / 1 | `entityTag` `#0550ae` / `#7ee787` |
| Comment | `comment` (line 336) | grey | 5 / 3 | `comment` `#59636e` / `#9198a1` |
| Traffic | `variable.parameter.function`, `meta.object.member`, `meta.block` (lines 371 to 382), `variable.other` (line 450) | body | n/a | `fgColor-default` `#1f2328` / `#f0f6fc` |
| Invalid | `invalid.*`, italic (lines 456 to 480) | red | 7 / 2 | `invalidIllegal-text` = `fgColor-danger` `#d1242f` / `#f85149` |
| Inserted, deleted, changed | `markup.*`, with a tinted background | green, red, orange | 6, 7, 6 / 1, 2, 2 | `#116329`, `#82071e`, `#953800` light |

Two details. On github.com light, tags take the constant blue, not green (`entityTag` `#0550ae`); the VS Code theme and github.com dark use green. And the diff range header is purple, bold (line 646).

### 1.3 The lightness structure (EXECUTED)

Contrast on the code ground (`bgColor-muted`) and on white or `#0d1117`, with OKLCH lightness and chroma.

| Role | Light value | L | C | on `#f6f8fa` | on white | Dark value | L | C | on `#151b23` | on `#0d1117` |
|---|---|---|---|---|---|---|---|---|---|---|
| body | `#1f2328` | 0.254 | 0.011 | 14.83 | 15.79 | `#f0f6fc` | 0.970 | 0.010 | 15.90 | 17.38 |
| string | `#0a3069` | 0.321 | 0.108 | 12.03 | 12.80 | `#a5d6ff` | 0.856 | 0.077 | 11.26 | 12.31 |
| constant | `#0550ae` | 0.451 | 0.164 | 7.13 | 7.59 | `#79c0ff` | 0.786 | 0.115 | 8.90 | 9.72 |
| function | `#6639ba` | 0.474 | 0.191 | 6.89 | 7.34 | `#d2a8ff` | 0.801 | 0.127 | 8.89 | 9.71 |
| variable, type | `#953800` | 0.466 | 0.137 | 6.93 | 7.38 | `#ffa657` | 0.799 | 0.141 | 8.94 | 9.77 |
| tag | `#116329` | 0.439 | 0.118 | 6.94 | 7.39 | `#7ee787` | 0.842 | 0.164 | 11.26 | 12.31 |
| comment | `#59636e` | 0.495 | 0.022 | 5.74 | 6.11 | `#9198a1` | 0.677 | 0.016 | 5.94 | 6.49 |
| keyword | `#cf222e` | 0.552 | 0.205 | 5.03 | 5.35 | `#ff7b72` | 0.734 | 0.163 | 6.86 | 7.50 |

- Three tiers. Strings nearest the body. A middle tier of four hues at one lightness (light L 0.44 to 0.47; dark 0.79 to 0.80, tags apart). Keywords and comments furthest out.
- Chroma follows the tiers the other way. Keywords are the most chromatic token in light (0.205), strings among the least (0.108).
- The accent `fgColor-accent` (`#0969da` / `#4493f8`) is not used by any syntax token (the brands memo, §1.1).

### 1.4 Why it reads well (INFERRED, from §1.2 and §1.3)

1. **One vivid warm hue among cool ones.** Red is the most chromatic syntax colour (C 0.205 in light) and, with orange, the only warm one. It goes to `if`, `return`, `def`, `const`. So the control-flow skeleton reads first.
2. **The longest runs are the quietest.** Strings sit one tier from the body, low in chroma. A file full of strings does not shout.
3. **Each hue has one job a reader can name.** Red: the language's words. Purple: functions. Blue: values and names the language owns. Orange: your own named things. Green: markup tags.
4. **Traffic stays plain.** Parameters, members and plain variable reads are the body colour. Colour lands on landmarks.
5. **The mirror is exact.** Light uses steps 5 to 8, dark steps 1 to 3 of the same scale. A reader who switches theme keeps every association.

### 1.5 What it costs (EXECUTED)

`check.py`'s eight core roles, with GitHub's types taken as its orange and its numbers as its constant blue.

| | Normal | Deuteranopia | Protanopia | Tritanopia |
|---|---|---|---|---|
| Light, closest pair | keyword / invalid 0.5 | keyword / invalid 0.5; function / number 2.4 | keyword / invalid 0.5; function / number 2.3 | keyword / invalid 0.5 |
| Dark, closest pair | string / number 8.0 | function / number 2.3 | function / number 3.2 | string / number 8.3 |

- On github.com a keyword and an error are the same red to the eye (0.5). INFERRED: GitHub tells errors by italics and squiggles, not colour. The VS Code theme does pick a deeper red (step 7) for `invalid`, so there the two differ by lightness.
- Purple functions and blue constants share a tier and differ only in hue. Red-green deficiency removes most of that hue.
- On github.com's light active line (`bgColor-neutral-muted` `#818b981f` over `#f6f8fa`, which resolves to `#E8EBEE`, 1.12) the error colour falls to 4.38:1. In dark (`#656c7633` over `#151b23`, `#252B34`, 1.21) it falls to 4.25. In the VS Code theme's own line highlight (`codemirror.activelineBg`) every role passes: lowest 4.84 light, 5.15 dark.

### 1.6 Against Blue on Ink (INFERRED)

Blue on Ink (the brands memo, "Revision after the owner's review"): blue for the language's words, paper for your names, green for your values, red for errors only, on ink in both themes.

**Compatible.**

- Role families, several slots per colour. Both do it.
- Plain traffic. Both leave members and parameters in the body (Blue on Ink puts keys in paper, a brighter body).
- The mirror. Blue on Ink's steps are told by lightness; GitHub's mirror is the same rule.
- Blue for the language's own names. GitHub's `support` and `variable.language` are blue; Blue on Ink's built-ins and `self` are pale blue.
- Green. GitHub's tags and inserted lines are green; Pluto's mark has a green.
- Purple. GitHub's functions are purple. The owner allows violet and plum.

**In conflict.**

- **Red keywords.** GitHub's signature. Blue on Ink keeps red for errors and deletions, and the owner asks that red stay rare. Keywords are frequent (13.2% of the gallery's characters, the craft memo §3.3). All three variations below keep red off keywords. Plum and Navy moves GitHub's warm keyword to plum instead.
- **Orange variables and types.** Banned. Each variation gives types another job: pale blue, green, or a second blue.
- **Orange "changed".** Banned. It becomes blue or violet.
- **Blue strings.** GitHub's strings are blue; Blue on Ink's blue is its keywords and its strings are green. Two variations keep green strings; Plum and Navy takes GitHub's navy strings and moves keywords off blue.
- **The ground.** Blue on Ink is ink in both themes. GitHub's light code is near-white. The owner asked for a light version, so each variation has a light ground.

## 2. How the variations were made

### 2.1 Rules (READ, the design lead's brief)

- Light on paper `#F7F7F4`, raised `#FFFFFF` or wash `#EAEAE7`; dark on ink `#14161C` or ink-raised `#1E2129` (`tokens/pluto.tokens.json`).
- No yellow, amber, gold, ochre, orange, brown, teal or cyan-green. Purple, plum, violet, blue, green, red and neutrals allowed. Red rare, errors and deletions distinguishable.
- All 21 slots in both themes. Every text slot at 4.5:1 or better on its ground and on its active line. The active line about 1.05 to 1.15 against the ground.
- CVD pairs among foreground, comment, keyword, function, type, string, number and invalid kept above about 5.
- No hex value equal to a GitHub one.

### 2.2 Method (EXECUTED; choices INFERRED)

1. Each variation's roles were grouped into families first, then each family was given a hue and a lightness tier, as the craft memo's §2 says: lightness first.
2. A family's value was found by hue and chroma at a target contrast against the ground, solved in OKLCH and brought into the sRGB gamut by lowering chroma.
3. A random search (4,000 to 8,000 draws per run, several seeds) tried tier targets, hues and chromas for the free families, and kept the set whose closest pair, across normal vision and the three deficiencies, was furthest apart. Brand primitives were held fixed where a variation's idea needs them.
4. The winners were checked for contrast on the ground and the active line, against `check.py`'s `report()`, against GitHub's hex values, and by hue.

INFERRED: the search only picks among tiers we set. The tiers themselves, and which roles share a family, are design choices, argued per slot below.

### 2.3 A note on tritanopia (EXECUTED)

`check.py` simulates deuteranopia and protanopia. This memo adds tritanopia, with the full-severity tritanopia matrix of *A Physiologically-based Model for Simulation of Color Vision Deficiency* (2009), the paper behind `check.py`'s two. The matrix was typed into the scratch script, not re-read from the paper today.

## 3. Variation 1: Violet Calls

### 3.1 The idea (INFERRED)

Blue on Ink kept almost whole, with one idea from GitHub: the functions you define and call get a hue of their own, violet, instead of plain paper. Blue still marks the language's words, green the values you write, and red only errors and deletions. It is the closest of the three to what the owner already liked.

**Grounds.** Light on paper `#F7F7F4`, the brand's page: Blue on Ink turned over. Dark on ink-raised `#1E2129`, Blue on Ink's dark slab.

### 3.2 Why each slot goes where it goes (INFERRED; values EXECUTED)

- **`foreground`**: a softened body, `#36383B` on paper and `#BDBDBC` on ink-raised. As in Blue on Ink, the body sits a step below full ink or paper, so keys can stand above it by lightness.
- **`property`** and **`escape`**: full ink `#14161C` and full paper `#F7F7F4`, Blue on Ink's "paper for your names". An escape inside a green string reads as the string interrupted.
- **`comment`**: a cool grey, `#5C636F` light; Blue on Ink's `#939495` dark, unchanged.
- **`keyword`, `constant`, `decorator`, `link`, `changed`**: the brand's own blues, `#2456E6` and `#7A9BFF` (`blue` and `blue-lifted`), unchanged from Blue on Ink. They sit at the far tier, as GitHub's keyword does: 5.51 and 6.10.
- **`builtin`, `type`, `tag`, `self`**: a second blue, navy `#253F8B` light and pale `#BCD1FF` dark. GitHub puts the language's own names (`support`, `variable.language`) in one blue step; Blue on Ink puts them in pale blue. Both agree.
- **`function`**: violet, `#641DBC` light and `#C195D3` dark. This is GitHub's idea: functions are their own hue. In dark it is a dusty orchid (C 0.100) below the body's lightness, as GitHub's dark purple sits below its body. A more vivid dark violet (C 0.115 or more) fell to about 6.1 or less against the keyword blue under protanopia, so the chroma stops there.
- **`string`, `inserted`**: green, `#056E36` light and `#59CD79` dark.
- **`number`**: green a step nearer the body, near-ink `#013414` light and near-paper `#D2EEDA` dark, as Blue on Ink's pale green.
- **`invalid`, `deleted`**: red, `#C01524` light and `#FD5A54` dark. In light the red sits at the far tier with the blue; in dark it is the darkest coloured text, below the green, so the two differ by lightness when hue is lost.
- **`active-line`**: `#F0F0ED` on paper (55% of the way to wash), Blue on Ink's `#23262D` on ink-raised.

Against Blue on Ink's dark values, five moved a little: body `#C1C1C0` to `#BDBDBC`, string `#66D795` to `#59CD79`, number `#C4E9D2` to `#D2EEDA`, the pale blue `#BFCEF9` to `#BCD1FF`, red `#F05F55` to `#FD5A54`. With violet added, these moves lifted the closest pair from 5.0 (Blue on Ink's body against strings, deuteranopia) to 6.4 (EXECUTED).

### 3.3 Contrast (EXECUTED)

| Slot | Light | on ground | on active line | Dark | on ground | on active line |
|---|---|---|---|---|---|---|
| `foreground` | `#36383B` | 10.95 | 10.29 | `#BDBDBC` | 8.56 | 8.05 |
| `background` | `#F7F7F4` | n/a | n/a | `#1E2129` | n/a | n/a |
| `comment` | `#5C636F` | 5.63 | 5.30 | `#939495` | 5.29 | 4.98 |
| `keyword` | `#2456E6` | 5.51 | 5.18 | `#7A9BFF` | 6.10 | 5.74 |
| `constant` | `#2456E6` | 5.51 | 5.18 | `#7A9BFF` | 6.10 | 5.74 |
| `string` | `#056E36` | 5.94 | 5.59 | `#59CD79` | 7.99 | 7.52 |
| `number` | `#013414` | 13.02 | 12.24 | `#D2EEDA` | 13.01 | 12.24 |
| `escape` | `#14161C` | 16.84 | 15.83 | `#F7F7F4` | 14.99 | 14.11 |
| `function` | `#641DBC` | 8.00 | 7.52 | `#C195D3` | 6.52 | 6.13 |
| `builtin` | `#253F8B` | 9.04 | 8.50 | `#BCD1FF` | 10.50 | 9.88 |
| `type` | `#253F8B` | 9.04 | 8.50 | `#BCD1FF` | 10.50 | 9.88 |
| `tag` | `#253F8B` | 9.04 | 8.50 | `#BCD1FF` | 10.50 | 9.88 |
| `property` | `#14161C` | 16.84 | 15.83 | `#F7F7F4` | 14.99 | 14.11 |
| `decorator` | `#2456E6` | 5.51 | 5.18 | `#7A9BFF` | 6.10 | 5.74 |
| `self` | `#253F8B` | 9.04 | 8.50 | `#BCD1FF` | 10.50 | 9.88 |
| `link` | `#2456E6` | 5.51 | 5.18 | `#7A9BFF` | 6.10 | 5.74 |
| `invalid` | `#C01524` | 5.79 | 5.45 | `#FD5A54` | 5.18 | **4.88** |
| `inserted` | `#056E36` | 5.94 | 5.59 | `#59CD79` | 7.99 | 7.52 |
| `deleted` | `#C01524` | 5.79 | 5.45 | `#FD5A54` | 5.18 | **4.88** |
| `changed` | `#2456E6` | 5.51 | 5.18 | `#7A9BFF` | 6.10 | 5.74 |
| `active-line` | `#F0F0ED` | 1.06 | n/a | `#23262D` | 1.06 | n/a |

**Lowest text ratio: light 5.51 on the ground and 5.18 on the active line (the blue); dark 5.18 and 4.88 (the red).**

### 3.4 Colour-blind pairs (EXECUTED)

| Theme | Normal | Deuteranopia | Protanopia | Tritanopia |
|---|---|---|---|---|
| Light | foreground / number 9.6 | foreground / number 6.7 | foreground / number 6.5 | foreground / number 7.0 |
| Dark | foreground / type 9.3 | string / invalid 7.0 | keyword / function 6.4 | type / number 7.0 |

- INFERRED: the light weak pair is the body against the near-ink green of numbers. Digits are told from names by shape (the craft memo §2.8).
- Dark keyword against function, 6.4 under protanopia, is the one pair of the same shape near the line. Definitions are also bold.

## 4. Variation 2: Plum and Navy

### 4.1 The idea (INFERRED)

GitHub's role map, hue for hue, in colours Pluto can own. Keywords keep GitHub's warm, vivid voice, in plum, not red. Functions are violet; constants, numbers and keys share one blue; strings are a quiet navy that sits next to the body; types and tags are green. Red is left to errors, so a keyword never looks like a mistake, which fixes GitHub's 0.5 (§1.5).

**Grounds.** Light on wash `#EAEAE7`, the page's muted surface, as GitHub sets code on its own muted ground. Its active line is lighter, `#F2F2EF`, so text gains contrast on it. Dark on ink `#14161C`, the nearest Pluto ground to GitHub's near-black, with ink-raised `#1E2129` as the active line.

### 4.2 Why each slot goes where it goes (INFERRED; values EXECUTED)

- **`foreground`**: full ink `#14161C` and full paper `#F7F7F4`. GitHub's body is its strongest text.
- **`comment`**: a cool grey, `#5C6067` and `#979DA4`, as GitHub's.
- **`keyword`**, **`escape`**: plum, `#903594` light and `#C96BCD` dark (OKLCH hue 326). GitHub's keyword is its one warm, vivid hue at the far tier; plum is the warmest hue the owner allows that is not red. GitHub gives escapes the keyword's colour (`constant.character`, line 345), so escapes follow.
- **`function`**, **`decorator`**, **`changed`**: violet, deep `#580191` light and pale `#CCAAE5` dark. GitHub's functions are purple, and a decorator's name (`entity.name.function.decorator`) falls under that rule by scope prefix. "Changed" was orange at GitHub, which is banned; its diff range header is purple, so changed lines borrow the violet.
- **`constant`, `number`, `builtin`, `self`, `link`, `property`**: one blue, `#0054CC` light and `#6E97FE` dark. GitHub sends `constant`, `support`, `variable.language` and `meta.property-name` to one blue step. Here that blue sits at the far tier with the keyword (5.54 and 6.47), where GitHub's sits in the middle; the search needed the room.
- **`string`**: navy `#002564` light (12.02) and pale blue `#C8DCFE` dark (13.02), the tier nearest the body. This is GitHub's signature: strings quiet, cool and long.
- **`type`, `tag`, `inserted`**: green, `#016531` light and `#6DCA89` dark. GitHub's type names are orange, which is banned. Green is GitHub's tag colour and the mark's own, so types and tags share it, as Rosé Pine groups types with tags (the craft memo §1.3).
- **`invalid`, `deleted`**: red, `#B20303` light and `#F24F4E` dark. In light red, green and plum share the far tier and differ by hue; their closest pair is 7.3 under deuteranopia. In dark the red is the darkest coloured text.

**The cost of `property` in blue.** GitHub's VS Code theme leaves member access in the body. Our `property` slot holds keys, attributes and members together (`highlighter.ts`), so blue keys bring blue members with them, and keys alone were 7.9% of the gallery's characters (the craft memo §3.3). That is the most traffic this variation colours. Setting `property` to `foreground` gives the GitHub VS Code look for members and loses blue JSON keys; it changes no ratio.

### 4.3 Contrast (EXECUTED)

| Slot | Light | on ground | on active line | Dark | on ground | on active line |
|---|---|---|---|---|---|---|
| `foreground` | `#14161C` | 15.00 | 16.12 | `#F7F7F4` | 16.84 | 14.99 |
| `background` | `#EAEAE7` | n/a | n/a | `#14161C` | n/a | n/a |
| `comment` | `#5C6067` | 5.24 | 5.63 | `#979DA4` | 6.60 | 5.88 |
| `keyword` | `#903594` | 5.57 | 5.99 | `#C96BCD` | 5.56 | 4.95 |
| `constant` | `#0054CC` | 5.54 | 5.96 | `#6E97FE` | 6.47 | 5.76 |
| `string` | `#002564` | 12.02 | 12.92 | `#C8DCFE` | 13.02 | 11.59 |
| `number` | `#0054CC` | 5.54 | 5.96 | `#6E97FE` | 6.47 | 5.76 |
| `escape` | `#903594` | 5.57 | 5.99 | `#C96BCD` | 5.56 | 4.95 |
| `function` | `#580191` | 9.52 | 10.24 | `#CCAAE5` | 8.99 | 8.00 |
| `builtin` | `#0054CC` | 5.54 | 5.96 | `#6E97FE` | 6.47 | 5.76 |
| `type` | `#016531` | 5.99 | 6.44 | `#6DCA89` | 9.00 | 8.01 |
| `tag` | `#016531` | 5.99 | 6.44 | `#6DCA89` | 9.00 | 8.01 |
| `property` | `#0054CC` | 5.54 | 5.96 | `#6E97FE` | 6.47 | 5.76 |
| `decorator` | `#580191` | 9.52 | 10.24 | `#CCAAE5` | 8.99 | 8.00 |
| `self` | `#0054CC` | 5.54 | 5.96 | `#6E97FE` | 6.47 | 5.76 |
| `link` | `#0054CC` | 5.54 | 5.96 | `#6E97FE` | 6.47 | 5.76 |
| `invalid` | `#B20303` | 5.99 | 6.43 | `#F24F4E` | 5.17 | **4.60** |
| `inserted` | `#016531` | 5.99 | 6.44 | `#6DCA89` | 9.00 | 8.01 |
| `deleted` | `#B20303` | 5.99 | 6.43 | `#F24F4E` | 5.17 | **4.60** |
| `changed` | `#580191` | 9.52 | 10.24 | `#CCAAE5` | 8.99 | 8.00 |
| `active-line` | `#F2F2EF` | 1.07 | n/a | `#1E2129` | 1.12 | n/a |

**Lowest text ratio: light 5.24 on the ground and 5.63 on the active line (the comment); dark 5.17 and 4.60 (the red).** Dark keywords measure 4.95 on the active line.

### 4.4 Colour-blind pairs (EXECUTED)

| Theme | Normal | Deuteranopia | Protanopia | Tritanopia |
|---|---|---|---|---|
| Light | comment / type 12.9 | comment / keyword 7.3; comment / type 7.3 | comment / type 8.1 | type / number 8.0 |
| Dark | foreground / string 10.1 | comment / keyword 7.8 | foreground / string 9.1 | type / number 9.1 |

- Keyword against invalid, GitHub's 0.5, is 19.3 light and 18.5 dark under normal vision, and 12.7 and 14.4 at worst under the three deficiencies (EXECUTED).
- Function against constant, GitHub's 2.3 and 2.4, is 11.7 light and 9.6 dark at worst.

## 5. Variation 3: Blue Names

### 5.1 The idea (INFERRED)

The brand blue moves from the keywords to the functions. The names a reader looks for, definitions and calls, get the brand's one accent, unchanged, in both themes. Keywords step back into a quiet violet near the body: GitHub gives keywords their own hue, the craft memo says frequent words should be quiet, and this does both. Types and built-ins take a second blue. Every value you write, strings, numbers and constants, is green. Keys and members stay plain, so colour lands on landmarks, not traffic.

**Grounds.** Light on paper `#F7F7F4`, where the brand blue measures 5.51. Dark on ink `#14161C`, where blue-lifted measures 6.85, with ink-raised `#1E2129` as the active line.

### 5.2 Why each slot goes where it goes (INFERRED; values EXECUTED)

- **`foreground`**, **`property`**: full ink `#14161C` light; a cool near-white `#EFF1F5` dark. Keys, attributes and members are traffic here (GitHub's own rule for members).
- **`comment`**: grey, `#61656C` and `#8A9096`.
- **`function`**, **`link`**, **`changed`**: the brand's `blue` `#2456E6` and `blue-lifted` `#7A9BFF`, exact primitives. Definitions already take a heavier weight (`highlighter.ts`), so a definition is the strongest mark on its line.
- **`keyword`**, **`decorator`**, **`escape`**: a muted violet, `#49326D` light (9.98) and `#C0A1D4` dark (7.99). Chroma 0.10 and 0.08: it reads as coloured, not loud. Escapes follow keywords, GitHub's rule.
- **`builtin`, `type`, `tag`, `self`**: a second blue, `#1E3C9B` light and `#A9CCFE` dark. The names the language and your types own sit in the function's family, a tier nearer the body.
- **`string`, `inserted`**: green, `#1C6D31` and `#55CC84`.
- **`number`, `constant`**: green a tier nearer the body, `#003B16` and mint `#AFF3BC`. `True`, `None` and `42` are values, so they are green. GitHub groups constants with numbers too, in its blue.
- **`invalid`, `deleted`**: red, `#C80C22` and `#EB6555`, the only red.
- **`active-line`**: `#F0F0ED` on paper, ink-raised on ink.

### 5.3 Contrast (EXECUTED)

| Slot | Light | on ground | on active line | Dark | on ground | on active line |
|---|---|---|---|---|---|---|
| `foreground` | `#14161C` | 16.84 | 15.83 | `#EFF1F5` | 15.99 | 14.23 |
| `background` | `#F7F7F4` | n/a | n/a | `#14161C` | n/a | n/a |
| `comment` | `#61656C` | 5.45 | 5.12 | `#8A9096` | 5.60 | **4.98** |
| `keyword` | `#49326D` | 9.98 | 9.38 | `#C0A1D4` | 7.99 | 7.12 |
| `constant` | `#003B16` | 11.95 | 11.23 | `#AFF3BC` | 14.09 | 12.54 |
| `string` | `#1C6D31` | 5.96 | 5.60 | `#55CC84` | 8.91 | 7.93 |
| `number` | `#003B16` | 11.95 | 11.23 | `#AFF3BC` | 14.09 | 12.54 |
| `escape` | `#49326D` | 9.98 | 9.38 | `#C0A1D4` | 7.99 | 7.12 |
| `function` | `#2456E6` | 5.51 | 5.18 | `#7A9BFF` | 6.85 | 6.10 |
| `builtin` | `#1E3C9B` | 8.99 | 8.45 | `#A9CCFE` | 10.98 | 9.77 |
| `type` | `#1E3C9B` | 8.99 | 8.45 | `#A9CCFE` | 10.98 | 9.77 |
| `tag` | `#1E3C9B` | 8.99 | 8.45 | `#A9CCFE` | 10.98 | 9.77 |
| `property` | `#14161C` | 16.84 | 15.83 | `#EFF1F5` | 15.99 | 14.23 |
| `decorator` | `#49326D` | 9.98 | 9.38 | `#C0A1D4` | 7.99 | 7.12 |
| `self` | `#1E3C9B` | 8.99 | 8.45 | `#A9CCFE` | 10.98 | 9.77 |
| `link` | `#2456E6` | 5.51 | 5.18 | `#7A9BFF` | 6.85 | 6.10 |
| `invalid` | `#C80C22` | 5.54 | 5.20 | `#EB6555` | 5.61 | 5.00 |
| `inserted` | `#1C6D31` | 5.96 | 5.60 | `#55CC84` | 8.91 | 7.93 |
| `deleted` | `#C80C22` | 5.54 | 5.20 | `#EB6555` | 5.61 | 5.00 |
| `changed` | `#2456E6` | 5.51 | 5.18 | `#7A9BFF` | 6.85 | 6.10 |
| `active-line` | `#F0F0ED` | 1.06 | n/a | `#1E2129` | 1.12 | n/a |

**Lowest text ratio: light 5.45 on the ground and 5.12 on the active line (the comment); dark 5.60 and 4.98 (the comment).**

### 5.4 Colour-blind pairs (EXECUTED)

| Theme | Normal | Deuteranopia | Protanopia | Tritanopia |
|---|---|---|---|---|
| Light | keyword / type 9.7 | comment / string 7.6 | keyword / type 8.2 | type / string 7.7 |
| Dark | keyword / type 11.1 | foreground / number 7.2 | foreground / number 7.4 | type / number 7.5 |

- INFERRED: keyword against type is the pair of the same shape to watch, a violet and a blue a tier apart. It holds at 7.8 or more in every simulation.

## 6. Side by side (EXECUTED; the right column INFERRED)

| | Violet Calls | Plum and Navy | Blue Names | Blue on Ink (for reference) | GitHub (study only) |
|---|---|---|---|---|---|
| Light ground / active | paper / `#F0F0ED` | wash / `#F2F2EF` | paper / `#F0F0ED` | ink / ink-raised | `#f6f8fa` / `#E8EBEE` |
| Dark ground / active | ink-raised / `#23262D` | ink / ink-raised | ink / ink-raised | ink-raised / `#23262D` | `#151b23` / `#252B34` |
| Lowest text ratio, light (ground, active) | 5.51, 5.18 | 5.24, 5.63 | 5.45, 5.12 | 5.57, 4.96 | 4.92, 4.38 |
| Lowest text ratio, dark (ground, active) | 5.18, 4.88 | 5.17, 4.60 | 5.60, 4.98 | 4.96, 4.67 | 5.16, 4.25 |
| Closest core pair, any vision, light | 6.5 | 7.3 | 7.6 | 5.0 | 0.5 |
| Closest core pair, any vision, dark | 6.4 | 7.8 | 7.2 | 5.0 | 2.3 |
| Keywords | brand blue | plum | quiet violet | brand blue | red |
| Functions | violet | violet | brand blue | paper | purple |
| Strings | green | navy / pale blue | green | green | navy / pale blue |
| Types | second blue | green | second blue | pale blue | orange |
| Keys | full ink / paper | blue | body | paper | body (members), blue (property names) |
| Red | errors, deletions | errors, deletions | errors, deletions | errors, deletions | keywords, escapes, errors, deletions |
| Hues in text | blue, violet, green, red | plum, violet, blue, green, red | violet, blue, green, red | blue, green, red | red, purple, blue, orange, green |

GitHub's row uses its github.com tokens and active line (§1.3, §1.5). Its error on the light ground is `fgColor-danger` at 4.92.

**Extra pairs of the same shape** (EXECUTED; normal, deuteranopia, protanopia, tritanopia):

| Pair | Violet Calls, light / dark | Plum and Navy, light / dark | Blue Names, light / dark |
|---|---|---|---|
| escape / string | 30.0, 28.1, 30.9, 28.8 / 26.6, 22.3, 20.1, 24.8 | 26.3, 20.8, 14.1, 24.9 / 27.0, 22.2, 28.2, 26.7 | 23.5, 17.8, 21.3, 14.1 / 22.5, 11.3, 15.7, 15.5 |
| inserted / deleted | 29.3, 7.7, 9.4, 31.1 / 32.7, 7.0, 21.5, 37.0 | 27.9, 7.7, 10.0, 29.4 / 31.6, 10.6, 24.3, 36.6 | 29.8, 8.6, 8.7, 32.2 / 29.6, 8.5, 20.7, 34.9 |
| keyword / invalid | 36.8, 31.5, 30.5, 31.9 / 30.2, 25.7, 24.5, 34.3 | 19.3, 18.7, 21.0, 12.7 / 18.5, 18.5, 18.9, 14.4 | 27.3, 26.0, 16.1, 30.0 / 18.9, 16.4, 19.8, 20.5 |
| function / constant | 14.0, 7.9, 10.3, 13.8 / 11.3, 10.0, 6.4, 14.9 | 18.3, 11.7, 14.9, 18.9 / 14.7, 14.8, 9.6, 17.5 | 34.3, 33.1, 34.7, 23.9 / 29.3, 29.3, 28.6, 20.9 |

Inserted against deleted is the closest diff pair under deuteranopia (7.0 to 10.6). Diff lines also carry `+` and `−` (the craft memo §2.8).

## 7. Checks (EXECUTED)

- **Originality.** Every hex value in the six fetched GitHub files was collected: 11.10.0's `light.css` and `dark.css`, 7.10.0's `light.json` and `dark.json`, `theme.js`, `colors.js`. Six-digit and three-digit forms, upper-cased: 617 distinct values. Of the 126 slot values here (21 slots, two themes, three variations), none is in that set. `#FFFFFF`, Pluto's `raised`, is in it (GitHub's canvas), so no variation uses it, even as a ground.
- **Hue.** OKLCH hues used, for chroma above 0.03: blue 257 to 269, violet and plum 296 to 326, green 148 to 155, red 24 to 30. None falls in 40 to 115 (yellow, amber, orange, brown) or 165 to 215 (teal, cyan). The greys and bodies have chroma 0.021 or less. HSL hues, the brands memo's check, agree: 131 to 149 for the greens, 263 to 298 for violet and plum, 215 to 226 for the blues.
- **Primitives reused.** Ink, ink-raised, paper and wash as grounds and bodies; `blue` `#2456E6` and `blue-lifted` `#7A9BFF` as text in Violet Calls and Blue Names. Every other value is new.
- **Not done.** No render of the gallery samples in these palettes was made for this memo. The design lead's comparison page reads `variations.json`.

## 8. What the owner chooses

Which variation becomes the palette specification?

1. **Violet Calls** (recommended). It keeps everything the owner approved in Blue on Ink, adds GitHub's most distinctive idea that is not red, and keeps the brand blue on keywords, where the design book spends its one accent. Its light version is the plainest mirror of the dark.
2. **Plum and Navy**, if GitHub's feel matters most. It is GitHub's map with the two flaws of §1.5 fixed. It colours keys and members blue, and its keywords are plum, the boldest colour of the three.
3. **Blue Names**, if colour should mark landmarks only. It has the quietest keywords and the plainest traffic, and puts the brand blue on what a reader looks for. It is the furthest from both Blue on Ink and GitHub in character.
4. A mix: any variation's slot families can move to another, re-checked by the same scripts.

## Sources

All web sources fetched on 2026-11-01. Local sources read the same day.

**GitHub**

- [`@primer/primitives` 11.10.0, light theme CSS](https://unpkg.com/@primer/primitives@11.10.0/dist/css/functional/themes/light.css) and [dark theme CSS](https://unpkg.com/@primer/primitives@11.10.0/dist/css/functional/themes/dark.css): the `prettylights-syntax-*` tokens, `bgColor-muted`, `fgColor-default`, `fgColor-danger`, `fgColor-accent`, `bgColor-neutral-muted`, `codeMirror-activeline-bgColor`
- [`primer/github-vscode-theme`, `src/theme.js`](https://raw.githubusercontent.com/primer/github-vscode-theme/main/src/theme.js), lines 171 to 176 and 332 to 660; [`src/colors.js`](https://raw.githubusercontent.com/primer/github-vscode-theme/main/src/colors.js); [`package.json`](https://raw.githubusercontent.com/primer/github-vscode-theme/main/package.json) (version 6.3.5, `@primer/primitives` 7.10.0)
- [`@primer/primitives` 7.10.0, `dist/json/colors/light.json`](https://unpkg.com/@primer/primitives@7.10.0/dist/json/colors/light.json) and [`dark.json`](https://unpkg.com/@primer/primitives@7.10.0/dist/json/colors/dark.json): the scales the VS Code theme's steps index

**Colour science**

- *A Physiologically-based Model for Simulation of Color Vision Deficiency*, IEEE Transactions on Visualization and Computer Graphics, 2009: the simulation matrices (deuteranopia and protanopia through `check.py`; tritanopia typed into the scratch script)
- [WCAG 2.2, Success Criterion 1.4.3, Contrast (Minimum)](https://www.w3.org/TR/WCAG22/#contrast-minimum)

**This repository**

- `context/research/2026-11-01-how-brands-colour-their-code.md`: §1.1 (GitHub), "Revision after the owner's review" (Blue on Ink, its ratios and pairs)
- `context/research/2026-11-01-how-a-code-palette-is-made.md`: §1.3, §1.4, §2, §3.3
- `tokens/pluto.tokens.json`: lines 3 to 21 (ink, paper, raised, blue, red, green, wash, ink-raised, ink-wash, blue-lifted)
- `src/lib/registry/lib/highlighter.ts`: the 21 slots and the scopes each takes
