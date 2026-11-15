# Syntax colours without amber or cyan: how Google, Microsoft and GitHub build code palettes, where properties belong, and four candidates on a white ground

- **Status:** complete
- **Date:** 2026-11-14
- **Author:** a researcher
- **Question:** The owner, at the code-palette workbench, asked four things. "I do not like the amber or cyan colors … create more syntax colors that are pleasing to look at? no yellow, amber, or cyan." "I think properties should be foreground, does that align with other syntax highlighting standards? Study how google, microsoft, and github develop syntax highlighting pallets." "The light mode code background color should be white, note the platinum color" (platinum is today's `wash`, `#E9E5DB`; dark mode keeps its ground, `#2C2821`). And in shell code, in `pip install x`, "install x shouldn't have syntax highlighting". How do the three companies make their palettes? Where do they put properties? Which palettes, built from Pluto's blue, red and green, meet the owner's rules?
- **What it blocks:** the specification that replaces `007`'s code palette and adopts the white light-mode ground and the shell rule. It informs, without settling, the placeholder [`2026-11-14-code-on-a-white-card-once-the-code-ground-is-white.md`](2026-11-14-code-on-a-white-card-once-the-code-ground-is-white.md).
- **Data:** [`2026-11-14-syntax-palette-candidates.json`](2026-11-14-syntax-palette-candidates.json), the four candidates in the workbench's palette format. This memo revised it (section 7).

## How to read this memo

Every claim carries a label.

- **EXECUTED:** we ran it and saw the result, on 2026-11-14. Colour arithmetic uses the workbench's own functions in `src/lib/workbench/palette.ts`. Themes were run through Shiki 4.5.0 from `node_modules`.
- **READ:** a source says so. Web sources are linked in "Sources", each read on 2026-11-14. Files of this repository are named by path.
- **INFERRED:** our reasoning from the two.

Terms used throughout:

- A **slot** is one of the workbench's 22 code roles (`keyword`, `string`, `property`). A **swatch** is a named colour with a light and a dark value. Each slot names one swatch.
- The **body colour** is the `foreground` slot: plain code text.
- The **ground** is the colour behind code. The **active line** is the band behind the caret's line. The **selection** is the colour behind selected text.
- A **scope** is the name a grammar gives a piece of code (`string.unquoted.argument.shell`). A theme colours scopes.
- **OKLCH** describes a colour as lightness L (0 to 1), chroma C (colourfulness, from 0) and hue h (degrees).
- **ΔE** is the distance between two colours in OKLab, times 100. The workbench flags two text colours under 10 as hard to tell apart.
- **CVD** is colour-vision deficiency. **Protanopia** lacks red cones, **deuteranopia** green cones, **tritanopia** blue cones. We simulate each at full severity with the Machado, Oliveira and Fernandes (2009) matrices, applied in linear RGB, as the workbench does.
- **Contrast** is WCAG 2.2's ratio, truncated to two decimals. Body text needs 4.5:1.

This memo extends three earlier ones and does not repeat them: [`how-a-code-palette-is-made`](2026-11-01-how-a-code-palette-is-made.md) (the craft, and Primer's scale steps), [`how-brands-colour-their-code`](2026-11-01-how-brands-colour-their-code.md) (brand accents versus code colours) and [`how-the-four-colours-are-tuned`](2026-11-01-how-the-four-colours-are-tuned.md) (Material's tone arithmetic).

## In short

- **GitHub plans by role and by scale step.** Each code role takes one step of a Primer colour scale: a deep step in light, a pale one in dark (READ). Its colour-blind themes swap only the hue that vanishes: red keywords turn orange, green additions turn blue (READ). Its automated contrast check does not cover the code colours, though the shipped values pass (EXECUTED).
- **Microsoft tunes each theme file on its own.** Light and dark themes choose different hues for the same role (EXECUTED). Several Light+ roles sit at the 4.5 floor, and its regular-expression punctuation is 3.53:1 even in High Contrast Light (EXECUTED). Its newest default, Light 2026, takes all twelve of its own token colours from GitHub Light Default (EXECUTED).
- **Google publishes little.** We found no code guidance in Material 3. Chrome DevTools maps each code role to a Material tone: tones 20 to 50 in light, 60 to 90 in dark (READ). It leaves properties in the body colour in light and turns them yellow in dark (READ).
- **Properties in the body colour is the standard for code, not for data.** Across our 18 specimens, GitHub's themes leave 50% of what Pluto calls `property` in the body colour: members, fields, TOML keys and shell variables (EXECUTED). They colour JSON keys, YAML keys, CSS properties and markup attributes. Microsoft's classic themes colour 97% of it, because they colour every variable (EXECUTED). Pluto should put `property` on `foreground`, as the owner proposes, and not split the slot (section 3).
- **Keys in the body colour do not leave data files bare.** JSON keeps 30% of its characters in the string colour and YAML 40% (EXECUTED). Ten of YAML's 35 lines (`jobs:`, `push:`) become wholly plain; they read by indentation (INFERRED).
- **The excluded bands are OKLCH hue 55° to 125° (amber, yellow, olive) and 185° to 245° (teal, cyan, sky blue), for any colour above chroma 0.03.** No candidate colour, ground, active line or selection falls in either (EXECUTED).
- **Four candidates, all passing every check** (EXECUTED). Every text slot is at least 6.00:1 on white, 4.77:1 on `wash` and 4.98:1 on the dark ground. Each also passes on its active line and selection in both themes. None retunes a shared role, every slot is assigned, and the workbench flags no near pair in either theme.
- **Recommended: Ink and Plum.** Navy keywords, the brand blue on functions, green strings, violet literals, deep plum types, red errors; names, keys and members in ink. It uses five hue families on an arc from blue through violet to red, plus green opposite. It colours 60% of characters and leaves 40% plain. It keeps the brand blue for the names you call (section 4).
- **The shell rule departs from both GitHub and VS Code.** Both colour `install x` as a string and `--upgrade` as a constant (EXECUTED, through Shiki's shell grammar). The proposed rule makes them plain and keeps quoted strings as strings. On the bash specimen the string colour falls from 40% of characters to 14% (EXECUTED).
- **The white ground suits all four candidates.** Their active line and selection were tuned against white. On a `wash` inset the selection nearly vanishes (1.02:1 against `wash`); on the page canvas the active line does (ΔE 1.5) (EXECUTED). That weighs on the "code on a white card" question; it does not settle it (section 6).
- **This memo revised the candidates file.** Six swatch values changed, to clear four dark-mode near pairs, a protanopia weakness and one value that matched VS Code's verbatim (section 7).

## 1. How the three companies make their palettes

### 1.1 GitHub: one scale, two steps, and a hue swap per deficiency

**How hues are chosen.**

- READ (`primer/primitives`, `src/tokens/functional/color/syntax.json5`): the code tokens live under `prettylights.syntax`. Each names a step of a base scale, such as `{base.color.red.5}` for keywords. Each carries overrides for dark and for the colour-blind themes.
- READ (same file): keywords take red; constants, tags and markup headings blue; strings a deep blue; class and function names (`entity`) purple; variables orange; regular expressions and inserted text green; comments grey.
- READ (`primer/github-vscode-theme`, `src/theme.js`): the VS Code theme writes the same plan as `lightDark(scale.red[5], scale.red[3])`, a light step and a dark step of one scale. Its header says it chooses "colors from primer/primitives". The earlier memo [`how-a-code-palette-is-made`](2026-11-01-how-a-code-palette-is-made.md) §1.4 covers this.
- INFERRED: GitHub chooses one hue per role from its general colour scales. It does not use its brand accent for code. The memo [`how-brands-colour-their-code`](2026-11-01-how-brands-colour-their-code.md) §1.1 measured that.

**How lightness and contrast are planned, and how dark derives from light.**

- READ (`syntax.json5`): light mostly takes steps 5 to 9, dark steps 0 to 3. A role keeps its hue across modes. Only its step moves.
- EXECUTED (Shiki's `github-light-default` and `github-dark-default`): the seven light accents span OKLCH L 0.32 to 0.56 and 5.04 to 12.8:1 on white. The dark accents span L 0.73 to 0.86 and 7.5 to 12.31:1 on their ground.
- EXECUTED: the legacy `github-light` theme has one accent at 3.48:1 on white, its orange. The default themes that replaced it have none under 5.04.

**How accessibility is tested.**

- READ (`contributor-docs/adrs/adr-010-color-contrast.md`): Primer requires 4.5:1 for "any text color vs. any background color it can be used on", and 7:1 in high-contrast themes.
- READ (`.github/workflows/a11y-contrast.yml`, `scripts/colorContrast.config.ts`): a pull-request workflow checks a list of named foreground and background pairs, per theme, at those ratios.
- EXECUTED (search of `colorContrast.config.ts`): the list has no `prettylights` or `syntax` entry. GitHub's code colours are outside the automated check.
- INFERRED: GitHub's code colours pass because they are drawn from scale steps that pass, not because a test holds them. Pluto's `tests/unit/contrast.test.ts` does hold every code slot. That is stricter than Primer.

**Colour-blind and high-contrast variants.**

- READ (GitHub changelog, 2022-04-19): the earlier colour-blind theme was split into a protanopia and deuteranopia theme and a tritanopia theme, both in beta.
- READ (`syntax.json5`, the overrides): under protanopia and deuteranopia, keywords, deleted text and the unmatched-bracket mark move from red to orange. Inserted text and regular expressions move from green to blue. Under tritanopia, variables and changed text move from orange to red, and inserted text and regular expressions from green to blue. In dark, tags move from green to blue under all three.
- INFERRED: the method is a hue swap at the same step. The colour that disappears for a deficiency is replaced by one that survives, and its lightness is kept.
- READ (`github-vscode-theme`, `README.md`): the VS Code themes include Light and Dark High Contrast, Light and Dark Colorblind, and Dark Dimmed.
- EXECUTED: Shiki 4.5.0 bundles GitHub's default, high-contrast and dimmed themes, but not the colour-blind ones.
- EXECUTED: `github-light-high-contrast`'s seven accents span L 0.29 to 0.46 and 8.05 to 14.49:1 on white. High contrast deepens every step; it keeps the same hues and roles.

**Which roles stay plain.**

- READ (`theme.js`): `variable.other`, `meta.object.member`, `meta.block`, `meta.tag.attributes` and `meta.jsx.children` take `color.fg.default`, the body colour.
- EXECUTED (section 2): member access, fields in use, `this.x`, Python attributes, Go and Rust fields, TOML keys and shell variables take the body colour. Parameters and class-field declarations take the orange variable colour.

### 1.2 Microsoft: themes layered by file, each mode tuned on its own

**How hues are chosen.**

- READ (`microsoft/vscode`, `extensions/theme-defaults/themes/`): each theme file names the one it extends. Light (Visual Studio) is extended by Light+, Light+ by Light Modern, Light Modern by Light 2026. The dark chain runs Dark (Visual Studio), Dark+, Dark Modern, Dark 2026.
- READ: the Modern themes change only the interface. Their token colours come from the "plus" and "vs" files.
- EXECUTED: the same role takes different hues in light and dark. Strings are a deep red in Light+ (h 28) and a salmon in Dark+ (h 43). Functions are olive-brown in light (h 83) and pale yellow in dark (h 108). Types are teal in both (h 222, then h 177).
- INFERRED: dark is not derived from light by a rule. Each file was tuned against its own ground.
- EXECUTED: VS Code's classic defaults sit heavily in the bands the owner excludes. Functions fall in the yellow band in both modes. Types and variables fall in the cyan band in dark.
- READ (VS Code 1.113 release notes): VS Code "now ships with new default themes", to "provide a fresh, modern look while maintaining the familiarity" of the old ones. The notes say nothing of code colours.
- EXECUTED: Light 2026 sets twelve token colours of its own, and all twelve are GitHub Light Default's. Dark 2026 sets fifteen, nine of them GitHub's.
- INFERRED: Microsoft's newest default converges on Primer's role plan.

**How lightness and contrast are planned.**

- EXECUTED (Light+ on white): numbers 4.60, types 4.58, attribute names 4.84. Several roles sit at the floor.
- EXECUTED: regular-expression group punctuation measures 3.53:1 on white in Light+, Light 2026 and High Contrast Light. A warning token in High Contrast Light measures 2.6.
- EXECUTED: Light+'s accents span OKLCH L 0.27 to 0.64; Dark+'s run to 0.88.

**How accessibility is tested.**

- READ (VS Code accessibility docs): for colour blindness the docs point to Marketplace themes, GitHub's first ("Accessible to most forms of color blindness and matches the themes in GitHub's settings"). VS Code ships no colour-blind theme of its own.
- READ (same page): the terminal has `terminal.integrated.minimumContrastRatio`, which moves a colour until a ratio is met. The editor has no such setting.

**High contrast.**

- EXECUTED: High Contrast Black's probed roles measure 7.12:1 or more on black.
- EXECUTED: High Contrast Light gives keywords and strings one shared navy, at 8.98:1. Numbers (6.37) and control keywords (6.60) stay under 7.
- INFERRED: Microsoft's high contrast raises contrast partly by cutting hues, not only by deepening them.

**Which roles stay plain.**

- EXECUTED: Light+ and Dark+ colour every variable, not only properties: navy in light, a pale blue in dark.
- EXECUTED: Dark+'s variable colour sits ΔE 8.0 from its body. It is nearly plain. Light+'s sits ΔE 33.7 from black, a deep navy.
- EXECUTED: Python attributes and Rust fields stay in the body colour, because those grammars do not scope them as variables.
- EXECUTED: Light 2026 leaves member access in a colour ΔE 1.5 from its body: in effect, plain. Dark 2026 lifts members ΔE 5.9 above its body.

### 1.3 Google: Material tones in DevTools, and little else published

**What Google publishes.**

- READ (search of Material 3's site and the web): we found no Material 3 guidance on code colours.
- READ (`devtools-frontend`, `docs/material3_guidelines.md`): DevTools' own Material 3 notes say only that "Syntax highlighting should use token-something colors" defined in a theme file.
- READ (`googlearchive/code-prettify`, `src/prettify.css`): Google's archived highlighter shipped one light stylesheet with seven classes. Strings are green, keywords navy, comments dark red, types and attribute names purple, literals teal and punctuation olive. It has no dark version and no contrast policy.
- INFERRED: Android Studio is built on JetBrains' IntelliJ and uses its colour schemes. We found no Google-authored scheme guidance for it. We did not study Colab.

**How DevTools chooses and plans.**

- READ (`front_end/design_system_tokens.css`): each code role is a `--sys-color-token-*` variable. Each points to a Material reference palette at a tone, such as `--ref-palette-pink40` for keywords.
- READ (same file): light uses tones 20 to 50. Dark uses tones 60 to 90.
- READ (memo [`how-the-four-colours-are-tuned`](2026-11-01-how-the-four-colours-are-tuned.md) §1.1): in Material's HCT colour space, "a difference of 50 guarantees a contrast ratio >= 4.5". Tones 20 to 50 against a ground near tone 100 meet that.
- INFERRED: Google plans code colours by tone, which is lightness. Contrast follows from the tone gap.
- READ: the hues change between modes. Strings come from the error (red) palette in light and the orange palette in dark. Types are green in light and blue in dark. Keywords are pink in light and purple in dark.
- EXECUTED (on white): DevTools' light keyword measures 6.47, string 6.53, comment 6.53, number 6.38, type 4.65.

**Which roles stay plain.**

- READ: `--sys-color-token-property` and `--sys-color-token-variable` are `--sys-color-on-surface` in light, the body colour.
- READ: in dark, variables take a light neutral and properties a yellow (`yellow70`, OKLCH h 92). Attributes are orange in light and blue in dark.
- INFERRED: like Microsoft, Google tunes each mode on its own.

### 1.4 What Pluto takes from each (INFERRED)

- **From GitHub:** one hue per role, drawn from the brand's own scales. Dark keeps the hue and moves the step. Colour-blind support means swapping the hue that vanishes, not redrawing the palette. Members stay plain.
- **From Microsoft:** a warning. Colours set at the floor, and modes tuned apart, drift into failures, and its classic defaults lean on the hues the owner dislikes. Its high-contrast variant shows that fewer hues can serve better than more.
- **From Google:** tone arithmetic. Plan lightness first, and contrast follows. Properties stay plain in light.
- **Pluto's method in this memo:** hues anchored to the brand's blue, red and green. Lightness set in tiers per role. Every text slot at 6.00:1 or more on white. Colour-blind distance judged pair by pair. Dark kept within 9° of light's hue.

## 2. Where the three put properties

### 2.1 Probes (EXECUTED)

We highlighted one-line probes with each shipped theme and compared each token's colour with the theme's body colour. Light and dark themes of one family agree, so one column covers both. High-contrast themes follow their family.

| Construct | GitHub (default, legacy, high contrast) | VS Code Light+ and Dark+ (and Modern) | VS Code Light 2026 |
|---|---|---|---|
| TS object key `{ speed: 1 }` | body | variable colour | variable colour |
| Member access `frame.payload` | body | variable colour | body |
| Method call `frame.decode()` | function colour | function colour | function colour |
| Class field declaration | variable colour (orange) | variable colour | variable colour (orange) |
| `this.speed` | body | variable colour | body |
| Python attribute, `self.x` | body | body | body |
| Go struct field and selector | body | variable colour | body |
| Rust field access | body | body | body |
| JSON key | tag colour (green); legacy: constant blue | its own blue | tag colour (green) |
| YAML key | tag colour (green) | tag colour | tag colour (green) |
| TOML key | body | variable colour | body |
| CSS property | constant colour (blue) | attribute colour | attribute colour |
| HTML and JSX attribute | constant colour (blue); legacy: purple | attribute colour | attribute colour |
| Shell variable `$HOME` | body | variable colour | body |

DevTools (READ, section 1.3): properties are the body colour in light and yellow in dark. Attributes are coloured in both.

### 2.2 Over the 18 specimens (EXECUTED)

Pluto's highlighter sends 1,374 non-space characters of the 18 specimens to the `property` slot. That slot covers attribute names, property names, object keys, members, fields, YAML and TOML keys, shell variables and CSS custom properties (READ, `src/lib/registry/lib/highlighter.ts`). For each such character we asked what colour each shipped theme gives it, and whether that is the theme's body colour (within ΔE 3).

| Language | `property` chars | GitHub Light Default | GitHub Dark Default | Light+ | Dark+ | Light 2026 | Dark 2026 |
|---|---|---|---|---|---|---|---|
| TypeScript | 226 | 86% | 86% | 0% | 0% | 72% | 0% |
| TSX | 70 | 9% | 9% | 0% | 0% | 9% | 0% |
| Python | 42 | 93% | 93% | 93% | 93% | 93% | 93% |
| Go | 39 | 100% | 100% | 0% | 0% | 100% | 0% |
| Java | 36 | 100% | 100% | 0% | 0% | 100% | 0% |
| C# | 104 | 82% | 82% | 0% | 0% | 82% | 0% |
| Ruby | 20 | 100% | 100% | 0% | 0% | 100% | 0% |
| Svelte | 121 | 22% | 22% | 0% | 0% | 22% | 0% |
| HTML | 98 | 18% | 18% | 0% | 0% | 8% | 0% |
| CSS | 106 | 0% | 0% | 0% | 0% | 0% | 0% |
| Bash | 114 | 95% | 95% | 0% | 0% | 95% | 0% |
| YAML | 158 | 0% | 0% | 0% | 0% | 0% | 0% |
| JSON | 124 | 0% | 0% | 0% | 0% | 0% | 0% |
| TOML | 116 | 100% | 100% | 0% | 0% | 100% | 0% |
| **All** | **1,374** | **50%** | **50%** | **3%** | **3%** | **47%** | **3%** |

Rust, SQL, Markdown and diff put nothing in the slot. The legacy `github-light` matches GitHub Light Default.

- INFERRED: GitHub draws the line between code and data. Names in code (members, fields, keys of an object literal) are plain. Keys in data and markup (JSON, YAML, CSS, HTML attributes) are coloured.
- INFERRED: the line follows grammar scopes, not a stated rule. TOML keys are plain and JSON keys coloured, only because the grammars name them differently.
- INFERRED: Microsoft's classic themes do not colour properties as such. They colour every variable, so a property is never plain there. In Dark+ that colour is nearly the body (ΔE 8.0).

### 2.3 Does the body colour leave JSON and YAML too plain? (EXECUTED)

Character shares under the shipped highlighter, with `property` moved to the body:

| Language | Body today | Body with keys plain | String colour | Lines wholly plain today | Lines wholly plain with keys plain |
|---|---|---|---|---|---|
| JSON | 19.4% | 55.2% | 29.8% | 3 of 15 | 4 of 15 |
| YAML | 12.8% | 44.3% | 39.7% | 0 of 35 | 10 of 35 |
| TOML | 9.7% | 39.4% | 29.9% | 0 of 20 | 0 of 20 |
| TypeScript | 25.0% | 43.7% | 4.1% | 10 of 46 | 10 of 46 |
| Svelte | 36.1% | 51.5% | 6.6% | 3 of 32 | 4 of 32 |
| Markdown | 61.4% | 61.4% | 12.2% | 7 of 16 | 7 of 16 |
| All 18 | 29.3% | 39.7% | 12.0% | | |

- The lines YAML loses are structure lines: `push:`, `schedule:`, `jobs:`.
- INFERRED: with keys plain, JSON is 55% plain, between Svelte (52%) and Markdown (61%). It stays inside the range the programming languages already show.
- INFERRED: JSON and YAML keep a clear two-colour read: ink keys, green values. The plain YAML lines are the ones indentation already explains.

### 2.4 The verdict, and the split we do not recommend

- **Verdict (INFERRED):** "properties should be foreground" matches GitHub, VS Code's newest light default and DevTools' light theme for names in code. It does not match any of them for keys in data files or attributes in markup, which all three colour.
- **Recommendation:** put `property` on `foreground` in both themes, as every candidate does. Keep the one slot.
- **The split, as a trade-off.** The workbench has one `property` slot, so a split cannot be a palette choice. It would be a change to the highlighter's mapping: route `support.type.property-name` (JSON and CSS), `entity.name.tag.yaml` and `entity.other.attribute-name` to the `tag` slot, as GitHub routes JSON and YAML keys to its tag colour.
  - What it buys: JSON and YAML keys, CSS properties and attributes regain colour; 10 YAML lines stop being plain.
  - What it costs: a second rule for "what a key is", decided by grammar scope rather than by meaning, with GitHub's TOML-versus-JSON inconsistency built in. Keys would share a colour with tag names, which in HTML sit beside them.
  - Why not now (INFERRED): section 2.3 shows data files are not left bare. The owner asked for the plain reading. A specification can revisit the split if the owner sees JSON or YAML in the workbench and finds them too plain.

## 3. The hue bands we treat as excluded

- **Warm band: OKLCH h 55° to 125°.** It holds amber (Pluto's yellow is h 70), yellow, gold, mustard and olive.
- **Cool band: OKLCH h 185° to 245°.** It holds teal, cyan, turquoise and sky blue.
- **Threshold:** a colour counts only when its chroma exceeds 0.03. Below that it reads as a grey.
- **Why these widths (INFERRED):** the workbench's own check used 65° to 115° and 190° to 240°. We widened each by 5° to 10°, so nothing sits on the edge of reading as the hue the owner dislikes.

Where nearby hues fall:

- **Orange** (h 35° to 55°) sits just below the warm band. The owner did not exclude it. Lifted for dark mode, though, an orange reads as amber: today's dark `syntax-orange` is h 51. No candidate uses orange.
- **Teal** (h 170° to 205°) straddles the cool band's lower edge. Today's `syntax-teal` is h 205, inside. Candidate greens stop at h 161.
- **Sky blue** (h 225° to 245°) is inside the cool band. Today's `syntax-cyan` is h 237. The brand blue is h 268, 23° clear of it.
- **Greys:** the dark ground (h 82, C 0.014) and the dark comment (h 86, C 0.020) are warm greys under the threshold. They belong to the graphite family the owner kept.

What today's palette puts in the bands (EXECUTED): `function` is `syntax-amber` (h 70). `type` and `tag` are `syntax-teal` (h 205). `property` is `syntax-cyan` (h 237). Those are the colours the owner named.

## 4. The four candidates

### 4.1 What every candidate shares (EXECUTED)

The grounds are the same in all four:

| Ground | Light | OKLCH L C h | against the light ground | Dark | OKLCH L C h | against the dark ground |
|---|---|---|---|---|---|---|
| `background` (`syntax-ground`) | `#FFFFFF` | 1.000 0.000 — | — | `#2C2821` | 0.279 0.014 82 | — |
| `active-line` (`syntax-line`) | `#F1F2F4` | 0.961 0.003 — | 1.12:1, ΔE 3.9 | `#22211E` | 0.248 0.006 92 | 1.09:1, ΔE 3.2 |
| `selection` (`syntax-selection`) | `#DDE2F8` | 0.916 0.030 276 | 1.28:1, ΔE 9.0 | `#1F2B51` | 0.300 0.071 269 | 1.06:1, ΔE 8.7 |

- The active line and the selection sit ΔE 5.3 apart in light and 9.2 apart in dark.
- The light active line is a near-grey on ink's own hue. The selection is a pale tint of the brand blue. In dark the selection is a deep navy: it differs from the ground by hue more than by lightness.
- Four text swatches are shared: `foreground` (ink `#0B0F17`, paper `#F3F0E8`), `syntax-comment` (a cool grey in light, a warm grey in dark), `primary` (the brand blue) and `destructive` (the brand red's text tone). `syntax-green` (strings and added lines) is in all four.
- Shared roles are used at their token values. None is retuned.
- `foreground` and `property` share ink in all four.

Every candidate passes every check (EXECUTED, through `readCandidates` on the workbench's white-ground start):

| Check | Ink and Plum | Three Dots | Four Classes | Warm Keywords |
|---|---|---|---|---|
| Parses as the workbench parses it | yes | yes | yes | yes |
| Every slot in `SLOTS` assigned in the file | yes | yes | yes | yes |
| Colours in an excluded band, grounds included | none | none | none | none |
| Shared roles retuned | none | none | none | none |
| Lowest text contrast: on white, on `wash`, on the dark ground | 6.00, 4.77, 4.98 | 6.00, 4.77, 4.98 | 6.00, 4.77, 4.98 | 6.00, 4.77, 4.98 |
| Lowest on the light active line, light selection | 5.36, 4.66 | 5.36, 4.66 | 5.36, 4.66 | 5.36, 4.66 |
| Lowest on the dark active line, dark selection | 5.47, 4.68 | 5.47, 4.68 | 5.47, 4.68 | 5.47, 4.68 |
| Pairs the workbench flags (ΔE under 10), light and dark | none, none | none, none | none, none | none, none |

The lowest figures come from the same two swatches everywhere: `destructive` in light (6.00 on white, 4.66 on the selection) and `syntax-comment` in dark (4.98 on the ground, 4.68 on the selection). Exactly one candidate, Ink and Plum, is marked recommended.

In each table below, a swatch lists the slots it colours. Contrast on white comes first and is bold; on `wash` second. "Line" is the active line.

### 4.2 Ink and Plum (`ink-and-plum`), recommended

| Swatch | Slots | Light | on white | on wash | on line | on selection | OKLCH L C h | Dark | on ground | on line | on selection | OKLCH L C h |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| foreground | `foreground`, `property` | `#0B0F17` | **19.17** | 15.24 | 17.12 | 14.89 | 0.168 0.018 264 | `#F3F0E8` | **12.87** | 14.13 | 12.11 | 0.955 0.011 90 |
| syntax-comment | `comment` (italic) | `#5C616D` | **6.20** | 4.93 | 5.53 | 4.81 | 0.493 0.020 268 | `#9C9689` | **4.98** | 5.47 | 4.68 | 0.674 0.020 86 |
| syntax-navy | `keyword`, `builtin`, `self` | `#1F3067` | **12.52** | 9.95 | 11.17 | 9.72 | 0.328 0.099 268 | `#BAD1FF` | **9.52** | 10.46 | 8.96 | 0.859 0.069 264 |
| syntax-violet | `constant`, `number`, `escape` | `#7136A3` | **7.61** | 6.05 | 6.79 | 5.91 | 0.465 0.170 306 | `#BA87D1` | **5.21** | 5.73 | 4.90 | 0.700 0.119 315 |
| syntax-green | `string`, `inserted` | `#006638` | **7.10** | 5.64 | 6.33 | 5.51 | 0.448 0.111 155 | `#85EAAB` | **10.02** | 11.00 | 9.42 | 0.859 0.131 155 |
| primary | `function`, `link`, `changed` | `#2D48D4` | **7.02** | 5.58 | 6.27 | 5.45 | 0.479 0.215 268 | `#93B0FF` | **6.90** | 7.58 | 6.49 | 0.767 0.118 268 |
| syntax-plum | `type`, `tag`, `decorator` | `#630042` | **13.04** | 10.37 | 11.65 | 10.13 | 0.331 0.139 348 | `#FAB9D1` | **9.02** | 9.90 | 8.48 | 0.852 0.081 355 |
| destructive | `invalid`, `deleted` | `#C11E31` | **6.00** | 4.77 | 5.36 | 4.66 | 0.524 0.195 22 | `#FF9491` | **6.90** | 7.58 | 6.49 | 0.779 0.129 22 |

Closest pairs of text swatches (EXECUTED, ΔE):

| | Light | Dark |
|---|---|---|
| Typical vision | comment / green 12.8; violet / blue 13.2; navy / plum 15.6 | plum / red 10.0; navy / blue 10.5; navy / plum 10.7 |
| Protanopia | green / red 5.9; navy / plum 8.0; comment / green 8.1 | comment / red 5.3; navy / plum 6.5; ink / green 8.6 |
| Deuteranopia | comment / green 7.5; violet / blue 7.7; navy / plum 8.9 | green / plum 4.7; navy / plum 7.1; green / red 7.3 |
| Tritanopia | comment / violet 6.7; green / blue 7.3; comment / green 7.8 | comment / violet 4.8; navy / green 6.4; navy / blue 10.0 |

The pairs that must stay apart, because they share a shape (light, then dark; typical / protan / deutan / tritan):

| Pair | Light | Dark |
|---|---|---|
| body / keyword | 17.9 / 18.7 / 17.6 / 16.7 | 12.5 / 11.2 / 13.2 / 11.8 |
| keyword / function | 19.1 / 20.7 / 19.5 / 17.3 | 10.5 / 10.1 / 10.9 / 10.0 |
| function / type | 27.8 / 28.6 / 24.2 / 27.3 | 16.4 / 9.9 / 15.6 / 18.8 |
| keyword / type | 15.6 / 8.0 / 8.9 / 19.0 | 10.7 / 6.5 / 7.1 / 13.7 |
| type / body | 21.4 / 10.7 / 16.9 / 22.3 | 13.2 / 13.7 / 10.1 / 13.3 |
| string / comment | 12.8 / 8.1 / 7.5 / 7.8 | 22.3 / 22.8 / 18.5 / 22.0 |
| function / number | 13.2 / 8.7 / 7.7 / 12.3 | 11.5 / 10.3 / 7.4 / 14.3 |
| inserted / deleted | 29.2 / 5.9 / 10.4 / 31.5 | 25.1 / 17.6 / 7.3 / 27.6 |
| type / invalid | 22.3 / 18.0 / 23.2 / 23.4 | 10.0 / 11.2 / 9.0 / 11.1 |

**How it relates to the brand (EXECUTED).**

- Functions, links and changed lines take the brand blue itself.
- Navy is the brand blue's hue (Δh 0) taken down to L 0.33.
- Violet sits 38° round from the blue.
- Plum sits 30° round from the red, its cool neighbour.
- Green is the brand green's hue less 8°, deepened for text (ΔE 8.4 from it).
- Errors take the red's text tone.

**What it gives up.**

- Keywords are quiet. Navy against ink is ΔE 17.9 in light: keywords read as strong ink, not as colour. In dark, the pale navy sits 12.5 from the body.
- Under protanopia in light, keywords and types (navy and plum) close to 8.0. They are told apart by lightness only a little: both sit near L 0.33.
- Dark green and dark plum close to 4.7 under deuteranopia. That is string against type, which differ in shape: strings carry quotes.
- Dark comments and violet literals close to 4.8 under tritanopia. That is a comment against a number, which also differ in shape.

**Why it is pleasing (INFERRED, from the craft in [`how-a-code-palette-is-made`](2026-11-01-how-a-code-palette-is-made.md) §2).**

- **A lightness plan in two tiers.** In light, the frequent structural words (keywords, types) sit in a deep tier at L 0.33, near ink. The things a reader looks for (calls, literals, strings, errors) sit in a mid tier at L 0.45 to 0.52. In dark the tiers mirror: navy and plum rise to L 0.85 to 0.86, blue and red sit at 0.77 to 0.78, violet at 0.70. Green breaks the mirror. It is mid in light and bright in dark, so strings read more strongly in dark.
- **Chroma follows importance.** The most vivid colour, the brand blue at C 0.215, marks functions: 6.7% of characters. The most frequent coloured role, keywords at 11.1%, takes the calmest accent, navy at C 0.099.
- **Five hue families in one arc and one complement.** Blue, violet, plum and red run round the wheel from 268° to 22°. Green sits opposite. It is an analogous scheme with a single complement, and it never touches the bands the owner dislikes.
- **The traffic stays plain.** Names, keys, members, operators and punctuation are ink. Across the specimens 39.7% of characters stay plain, against 29.3% today (EXECUTED). Comments are a grey in italic, so they read as prose.

### 4.3 Three Dots (`three-dots`)

| Swatch | Slots | Light | on white | on wash | on line | on selection | OKLCH L C h | Dark | on ground | on line | on selection | OKLCH L C h |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| foreground | `foreground`, `function` (bold), `property` | `#0B0F17` | **19.17** | 15.24 | 17.12 | 14.89 | 0.168 0.018 264 | `#F3F0E8` | **12.87** | 14.13 | 12.11 | 0.955 0.011 90 |
| syntax-comment | `comment` | `#5C616D` | **6.20** | 4.93 | 5.53 | 4.81 | 0.493 0.020 268 | `#9C9689` | **4.98** | 5.47 | 4.68 | 0.674 0.020 86 |
| primary | `keyword`, `constant`, `builtin`, `self`, `link`, `changed` | `#2D48D4` | **7.02** | 5.58 | 6.27 | 5.45 | 0.479 0.215 268 | `#93B0FF` | **6.90** | 7.58 | 6.49 | 0.767 0.118 268 |
| syntax-green | `string`, `inserted` | `#006638` | **7.10** | 5.64 | 6.33 | 5.51 | 0.448 0.111 155 | `#85EAAB` | **10.02** | 11.00 | 9.42 | 0.859 0.131 155 |
| syntax-pine | `number`, `escape` | `#00331F` | **14.06** | 11.18 | 12.55 | 10.92 | 0.283 0.063 161 | `#5BC08E` | **6.54** | 7.18 | 6.15 | 0.734 0.121 160 |
| syntax-navy | `type`, `tag`, `decorator` | `#2E407A` | **9.85** | 7.83 | 8.79 | 7.65 | 0.388 0.101 268 | `#BCCDF5` | **9.20** | 10.11 | 8.66 | 0.849 0.059 267 |
| destructive | `invalid`, `deleted` | `#C11E31` | **6.00** | 4.77 | 5.36 | 4.66 | 0.524 0.195 22 | `#FF9491` | **6.90** | 7.58 | 6.49 | 0.779 0.129 22 |

Closest pairs (EXECUTED, ΔE):

| | Light | Dark |
|---|---|---|
| Typical vision | comment / green 12.8; comment / navy 13.2; ink / pine 13.5 | blue / navy 10.1; green / pine 12.6; ink / navy 12.8 |
| Protanopia | green / red 5.9; comment / green 8.1; comment / red 10.1 | pine / red 5.1; comment / red 5.3; ink / green 8.6 |
| Deuteranopia | comment / green 7.5; green / red 10.4; comment / red 12.1 | comment / pine 5.9; pine / red 5.9; green / red 7.3 |
| Tritanopia | blue / green 7.3; comment / green 7.8; comment / blue 7.9 | blue / pine 5.6; green / navy 7.5; blue / navy 9.6 |

Its weakest must-stay-apart pair is keyword / type in dark: 10.1 / 9.4 / 10.8 / 9.6 (EXECUTED).

- **Brand (EXECUTED):** only the mark's three hues. Blue at two steps (the brand blue, and navy at Δh 0). Green at two steps (h 155 and 161). The brand red for errors.
- **Gives up:** keywords and constants share one colour. Functions are told only by weight, bold ink. The most frequent coloured role, keywords, takes the most vivid colour, against the rule that chroma follows importance. 46.4% of characters stay plain (EXECUTED).
- **Why it pleases (INFERRED):** it is the strictest expression of the brand. Three hues and one weight make the calmest page of the four, nearest the mark itself.

### 4.4 Four Classes (`four-classes`)

| Swatch | Slots | Light | on white | on wash | on line | on selection | OKLCH L C h | Dark | on ground | on line | on selection | OKLCH L C h |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| foreground | `foreground`, `keyword` (bold), `builtin`, `property`, `decorator`, `self` | `#0B0F17` | **19.17** | 15.24 | 17.12 | 14.89 | 0.168 0.018 264 | `#F3F0E8` | **12.87** | 14.13 | 12.11 | 0.955 0.011 90 |
| syntax-comment | `comment` (italic) | `#5C616D` | **6.20** | 4.93 | 5.53 | 4.81 | 0.493 0.020 268 | `#9C9689` | **4.98** | 5.47 | 4.68 | 0.674 0.020 86 |
| syntax-violet | `constant`, `number`, `escape` | `#7136A3` | **7.61** | 6.05 | 6.79 | 5.91 | 0.465 0.170 306 | `#BA87D1` | **5.21** | 5.73 | 4.90 | 0.700 0.119 315 |
| syntax-green | `string`, `inserted` | `#006638` | **7.10** | 5.64 | 6.33 | 5.51 | 0.448 0.111 155 | `#85EAAB` | **10.02** | 11.00 | 9.42 | 0.859 0.131 155 |
| primary | `function`, `link`, `changed` | `#2D48D4` | **7.02** | 5.58 | 6.27 | 5.45 | 0.479 0.215 268 | `#93B0FF` | **6.90** | 7.58 | 6.49 | 0.767 0.118 268 |
| syntax-navy | `type`, `tag` | `#1F3067` | **12.52** | 9.95 | 11.17 | 9.72 | 0.328 0.099 268 | `#BAD1FF` | **9.52** | 10.46 | 8.96 | 0.859 0.069 264 |
| destructive | `invalid`, `deleted` | `#C11E31` | **6.00** | 4.77 | 5.36 | 4.66 | 0.524 0.195 22 | `#FF9491` | **6.90** | 7.58 | 6.49 | 0.779 0.129 22 |

Closest pairs (EXECUTED, ΔE):

| | Light | Dark |
|---|---|---|
| Typical vision | comment / green 12.8; violet / blue 13.2; comment / violet 15.7 | blue / navy 10.5; violet / blue 11.5; ink / navy 12.5 |
| Protanopia | green / red 5.9; comment / green 8.1; violet / blue 8.7 | comment / red 5.3; ink / green 8.6; blue / navy 10.1 |
| Deuteranopia | comment / green 7.5; violet / blue 7.7; green / red 10.4 | green / red 7.3; violet / blue 7.4; comment / violet 10.2 |
| Tritanopia | comment / violet 6.7; green / blue 7.3; comment / green 7.8 | comment / violet 4.8; green / navy 6.4; blue / navy 10.0 |

Its weakest must-stay-apart pair is function / number under deuteranopia in dark, 7.4 (EXECUTED).

- **Brand (EXECUTED):** blue at two steps, green, red, and violet 38° from the blue.
- **Gives up:** keywords lose colour and are told by weight. Builtins, `self` and decorators are plain. 53.0% of characters stay plain (EXECUTED), the most of the four. Bold depends on the monospace face having a true medium weight.
- **Why it pleases (INFERRED):** it follows the Alabaster school the earlier memo read: colour only the landmarks a reader hunts for. It is the quietest of the four.

### 4.5 Warm Keywords (`warm-keywords`)

| Swatch | Slots | Light | on white | on wash | on line | on selection | OKLCH L C h | Dark | on ground | on line | on selection | OKLCH L C h |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| foreground | `foreground`, `property` | `#0B0F17` | **19.17** | 15.24 | 17.12 | 14.89 | 0.168 0.018 264 | `#F3F0E8` | **12.87** | 14.13 | 12.11 | 0.955 0.011 90 |
| syntax-comment | `comment` | `#5C616D` | **6.20** | 4.93 | 5.53 | 4.81 | 0.493 0.020 268 | `#9C9689` | **4.98** | 5.47 | 4.68 | 0.674 0.020 86 |
| syntax-plum | `keyword`, `self` | `#630042` | **13.04** | 10.37 | 11.65 | 10.13 | 0.331 0.139 348 | `#FAB9D1` | **9.02** | 9.90 | 8.48 | 0.852 0.081 355 |
| primary | `constant`, `number`, `escape`, `builtin`, `link`, `changed` | `#2D48D4` | **7.02** | 5.58 | 6.27 | 5.45 | 0.479 0.215 268 | `#93B0FF` | **6.90** | 7.58 | 6.49 | 0.767 0.118 268 |
| syntax-green | `string`, `inserted` | `#006638` | **7.10** | 5.64 | 6.33 | 5.51 | 0.448 0.111 155 | `#85EAAB` | **10.02** | 11.00 | 9.42 | 0.859 0.131 155 |
| syntax-violet | `function` | `#7136A3` | **7.61** | 6.05 | 6.79 | 5.91 | 0.465 0.170 306 | `#BA87D1` | **5.21** | 5.73 | 4.90 | 0.700 0.119 315 |
| syntax-navy | `type`, `tag`, `decorator` | `#1F3067` | **12.52** | 9.95 | 11.17 | 9.72 | 0.328 0.099 268 | `#BAD1FF` | **9.52** | 10.46 | 8.96 | 0.859 0.069 264 |
| destructive | `invalid`, `deleted` | `#C11E31` | **6.00** | 4.77 | 5.36 | 4.66 | 0.524 0.195 22 | `#FF9491` | **6.90** | 7.58 | 6.49 | 0.779 0.129 22 |

Closest pairs (EXECUTED, ΔE):

| | Light | Dark |
|---|---|---|
| Typical vision | comment / green 12.8; blue / violet 13.2; plum / navy 15.6 | plum / red 10.0; blue / navy 10.5; plum / navy 10.7 |
| Protanopia | green / red 5.9; plum / navy 8.0; comment / green 8.1 | comment / red 5.3; plum / navy 6.5; ink / green 8.6 |
| Deuteranopia | comment / green 7.5; blue / violet 7.7; plum / navy 8.9 | plum / green 4.7; plum / navy 7.1; green / red 7.3 |
| Tritanopia | comment / violet 6.7; blue / green 7.3; comment / green 7.8 | comment / violet 4.8; green / navy 6.4; blue / navy 10.0 |

Its weakest must-stay-apart pairs are keyword / type under protanopia in dark (6.5) and string / escape under tritanopia in light (7.3) (EXECUTED).

- **Brand (EXECUTED):** the same five families as Ink and Plum, reassigned.
- **Gives up:** it follows GitHub's role plan (warm keywords, violet functions, blue constants), so it looks most like GitHub of the four. The brand blue lands on literals rather than on names. In dark, keywords (11.1% of characters) are a soft pink, which colours the page rose. Escapes are blue inside green strings, close under tritanopia (7.3 in light).
- **Why it pleases (INFERRED):** warm keywords against cool types make the strongest temperature contrast of the four. A reader used to GitHub finds it familiar.

## 5. Shell: the proposed rule, and what GitHub and VS Code do

**The rule (READ, `src/lib/workbench/rules.server.ts`).** In shell code a command keeps its colour. Its bare arguments, flags, case patterns and the bare words of a loop list take the body colour. Quoted strings and heredocs stay strings. The workbench applies it with a second highlighting at prerender. The shipped highlighter is unchanged.

**What each does to the same words (EXECUTED, Shiki's shell grammar):**

| Word | Pluto today | Pluto, proposed rule | GitHub Light and Dark Default | Light+ and Dark+ | Light 2026 |
|---|---|---|---|---|---|
| `pip`, `curl` (command) | function | function | coloured (command) | coloured (command) | coloured |
| `install`, `requests` (bare argument) | string | body | string colour | string colour | string colour |
| `--upgrade`, `-fsSL` (flag) | string | body | coloured (constant) | coloured (constant) | coloured |
| `out.tar.gz`, `a.txt` (bare argument, loop word) | string | body | string colour | string colour | string colour |
| `start)` (case pattern) | string | body | coloured | coloured | coloured |
| `"$URL"` (quoted) | string | string | string colour | string colour | string colour |
| `echo` (builtin) | builtin | builtin | coloured | coloured | coloured |
| `$HOME` (variable) | property | property | body | variable colour | body |

- EXECUTED: both companies' themes colour a bare argument as a string and a flag as a constant. The proposed rule departs from both.
- EXECUTED (the bash specimen, 736 non-space characters): the string colour falls from 296 characters (40.2%) to 106 (14.4%). The body rises from 97 (13.2%) to 287 (39.0%). With `property` also on the body, as every candidate has it, 54.5% of the specimen is plain. GitHub Light Default leaves 21.6% plain.
- INFERRED: the grammar's string colour on `install x` says "a literal value", where the shell sees words. The shell's own string rules start at a quote. Under the rule, colour marks the two things a reader scans a command for: the command, and what was quoted.
- INFERRED: with `property` on `foreground`, shell variables become plain too. That matches GitHub. Inside quotes, `"$URL"` stays a string.
- INFERRED: these are Shiki's grammars, not GitHub.com's own highlighter. GitHub.com may scope shell differently. The themes' choice, given these scopes, is what we measured.

## 6. The white ground

**How this memo relates to the two 2026-11-14 white-ground memos.**

- [`a-white-code-ground-in-light-mode`](2026-11-14-a-white-code-ground-in-light-mode.md) found every shipped code colour passing on white. It proposed white in light, dark unchanged, and noted the active line must stop being white. The owner has since asked for white ("the light mode code background color should be white"), and the workbench starts there. All four candidates take that ground: white in light, `#2C2821` in dark.
- That memo's light active line was the page canvas. The candidates use a cool near-grey instead, `#F1F2F4` (OKLCH 0.961 0.003 264). The canvas is warm (h 90). Beside the blue selection a warm band would read faintly yellow (INFERRED).
- The candidates add code-only `syntax-ground`, `syntax-line` and `syntax-selection` swatches. They do not move `muted` or `card`, so no shared role is retuned.

**What the candidates imply for "code on a white card" (EXECUTED, then INFERRED).**

The placeholder [`code-on-a-white-card-once-the-code-ground-is-white`](2026-11-14-code-on-a-white-card-once-the-code-ground-is-white.md) lists four options. Measured with the candidates:

| Option | Lowest text contrast | Active line against that ground | Selection against that ground |
|---|---|---|---|
| 1. Keep the `wash` inset on a white card | 4.77 | 1.12:1, ΔE 4.2, but lighter than the ground | 1.02:1, ΔE 4.5 |
| 2. The page canvas `#F3F0E8` as the inset | 5.27 | 1.01:1, ΔE 1.5 | 1.13:1, ΔE 5.7 |
| 3. Flush on white, with a hairline | 6.00 | 1.12:1, ΔE 3.9 | 1.28:1, ΔE 9.0 |
| 4. Flush on white, with nothing | 6.00 | 1.12:1, ΔE 3.9 | 1.28:1, ΔE 9.0 |

- Every option keeps every text slot above 4.5:1. Colour alone does not decide the question.
- The candidates' active line and selection were tuned against white. On a `wash` inset the selection nearly vanishes, and the active line turns into a lighter band. On a canvas inset the active line vanishes.
- INFERRED: options 1 and 2 would each need a second active line and selection, a second set of grounds per block. Options 3 and 4 need none. That is a cost to weigh, not an answer: the placeholder also asks how a block's edge reads on a card, which only a render can show.
- In dark, the card (`#221F19`) sits under the code ground. The lowest text contrast on it is 5.58, so dark mode does not constrain the choice.

## 7. Revisions to the candidates file

The previous researcher's four candidates passed contrast and the bands. We judged them on their merits and changed six values. The shape of the file, the role plans, the names and the recommendation did not change.

| Swatch | Theme | Was | Now | Why (EXECUTED) |
|---|---|---|---|---|
| `syntax-line` | light | a grey equal to a value in VS Code's light themes | `#F1F2F4` | The old value appeared verbatim in `light_modern.json`, `light_vs.json` and Shiki's `light-plus`. A coincidence, but prior art is never copied. The new grey is on ink's hue. |
| `syntax-navy` | dark (Ink and Plum, Four Classes, Warm Keywords) | `#C8D7FF` | `#BAD1FF` | Keyword against body in dark rises from 10.1 to 12.5. |
| `syntax-violet` | dark | `#B89BCE` | `#BA87D1` | Literal against function in dark rises from 8.7, flagged, to 11.5. |
| `syntax-plum` | dark | `#FEA4D3` | `#FAB9D1` | Type against error in dark rises from 8.6, flagged, to 10.0. |
| `syntax-plum` | light | `#76074A` | `#630042` | Keyword against type under protanopia in light rises from 5.4 to 8.0. |
| `syntax-pine` | dark (Three Dots) | `#7CBA98` | `#5BC08E` | Comment against number in dark rises from 9.97, flagged, to 13.1. Number against error under protanopia rises from 3.9 to 5.1; number against keyword under tritanopia from 3.9 to 5.6. |

- The dark values for navy, violet and plum came from a grid search over hue, chroma and contrast target. It required every typical pair at ΔE 10 or more and maximised the weakest must-stay-apart pair under the three deficiencies. That pair moved from 6.49 to 6.54.
- What the change cost (EXECUTED): in dark, string against type under deuteranopia fell from 7.3 to 4.7, and comment against number under tritanopia from 5.9 to 4.8. Both pairs differ in shape (quotes; digits), which is why the search let them fall.
- Dark violet now sits at 5.21:1 on the ground, the lowest accent after the comment. Its hue moved from 310° to 315°, still 9° from light's 306°.
- EXECUTED: after the change, we compared the 26 hex values in the file with 1,868 hex and RGB values read from the downloaded Primer, VS Code, DevTools and code-prettify files and Shiki's bundled themes. Only white, `#FFFFFF`, appears in both; it is Pluto's own `raised` token.

## 8. Recommendation

1. **Adopt Ink and Plum** as the palette a specification builds. It meets every rule the owner set. It keeps the brand blue on the names a reader calls. It plans lightness in tiers, matches chroma to importance, uses five hue families none of which is yellow, amber or cyan, and leaves 40% of the code plain. Its weak points are named in §4.2, and all are pairs that differ in shape.
2. **Put `property` on `foreground`**, in every language, with one slot. Do not split it for data files now; the split is a highlighter-mapping question for a later specification if JSON or YAML read too plain.
3. **Adopt the shell rule** in the same specification, so bare arguments, flags, case patterns and loop words take the body colour. It departs from GitHub and VS Code on purpose.
4. **Keep the white light ground** with the cool near-grey active line and the pale blue selection. Measure the four "code on a white card" options against these grounds when the placeholder is worked.
5. **Keep the other three candidates** in the workbench as the owner's alternatives: Three Dots for the strictest brand, Four Classes for the quietest page, Warm Keywords for a GitHub-like plan.

## What this memo did not do

- It rendered nothing and looked at no page. Every figure is arithmetic on hex values, or Shiki's token output.
- It used Shiki's grammars to stand in for GitHub.com's and VS Code's own highlighting. Their products may scope some languages differently.
- It did not read GitHub's colour-blind VS Code themes' token output, because Shiki does not bundle them. Their method is read from Primer's token overrides.
- It did not test the candidates with readers who have a colour-vision deficiency. Simulation at full severity is a model, not a person.
- It changed no code, token, test or decision.

## Sources

All read on 2026-11-14.

- Primer primitives, the code tokens: <https://github.com/primer/primitives/blob/main/src/tokens/functional/color/syntax.json5>
- Primer primitives, ADR 010, colour contrast requirements: <https://github.com/primer/primitives/blob/main/contributor-docs/adrs/adr-010-color-contrast.md>
- Primer primitives, the contrast workflow: <https://github.com/primer/primitives/blob/main/.github/workflows/a11y-contrast.yml>
- Primer primitives, the contrast pairs: <https://github.com/primer/primitives/blob/main/scripts/colorContrast.config.ts>
- GitHub's VS Code themes, the theme source and README: <https://github.com/primer/github-vscode-theme/blob/main/src/theme.js>, <https://github.com/primer/github-vscode-theme/blob/main/README.md>
- GitHub changelog, "Protanopia & Deuteranopia colorblind themes (beta)", 2022-04-19: <https://github.blog/changelog/2022-04-19-protanopia-deuteranopia-colorblind-themes-beta/>
- VS Code default themes (`light_vs`, `light_plus`, `light_modern`, `2026-light`, `dark_vs`, `dark_plus`, `dark_modern`, `2026-dark`, `hc_light`, `hc_black`): <https://github.com/microsoft/vscode/tree/main/extensions/theme-defaults/themes>
- VS Code 1.113 release notes: <https://code.visualstudio.com/updates/v1_113>
- VS Code accessibility documentation: <https://code.visualstudio.com/docs/configure/accessibility/accessibility>
- Chrome DevTools design-system tokens: <https://github.com/ChromeDevTools/devtools-frontend/blob/main/front_end/design_system_tokens.css>
- Chrome DevTools code highlighter styles: <https://github.com/ChromeDevTools/devtools-frontend/blob/main/front_end/ui/components/code_highlighter/codeHighlighter.css>
- Chrome DevTools, "Material 3 for DevTools": <https://chromium.googlesource.com/devtools/devtools-frontend/+/ba76776d30e3c9ade8aa4a0ec4b5e89cf4ad22e3/docs/material3_guidelines.md>
- Google code-prettify (archived), default styles: <https://github.com/googlearchive/code-prettify/blob/master/src/prettify.css>
- Machado, G. M., Oliveira, M. M., and Fernandes, L. A. F. (2009). "A Physiologically-based Model for Simulation of Color Vision Deficiency." IEEE Transactions on Visualization and Computer Graphics 15(6). The matrices are the ones in `src/routes/(workbench)/workbench/code/+page.svelte`.
- Shiki 4.5.0 and `@shikijs/themes` 4.5.0, from this repository's `node_modules`, pinned by `bun.lock`.
