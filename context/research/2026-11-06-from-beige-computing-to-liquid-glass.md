# From beige computing to liquid glass

- **Status:** complete
- **Date:** 2026-11-06
- **Author:** the design lead's researcher
- **Question:** How should Pluto light an object and give it depth, so that it recalls early personal computing (off-white cases, chunky keyboards, the square Apple II, four colours on an off-white canvas) and reaches forward to today's liquid-glass design? Which off-white canvas does that need, measured against Deep Field's four text colours and ink? The settled choices hold: the four-dot mark in today's order, palette B3 "Deep Field", C2 (neutral product screens, four colours together only in owned moments), H1 exact (one 8 px case radius, round only for dots), D1 type, J2 motion with springs for the dots only, K3 display up to 160 px, L3 voice.
- **What it blocks:** question I's second round on `/identity`, and the canvas value in the brand specification.

## How to read this memo

Every claim carries a label.

- **EXECUTED:** we ran it and saw the result, on 2026-11-06. The measurements come from a scratch script that applies the repository's contrast rules (WCAG 2.2 formula, ratio truncated to two decimals, alpha composited in sRGB). The script lives outside the repository.
- **READ:** a source says so. Every web source was read on 2026-11-06. Where only a search summary was seen, the claim says so. Repository files are cited by path.
- **INFERRED:** our reasoning.

Terms of art.

- **Canvas.** The page's ground colour: the `--background` token. **Raised** is a surface above it, such as a card. **Sunk** is a surface below it, such as a well or a muted fill.
- **Skeuomorphism.** Drawing a digital object to look like the physical thing it replaces: stitched leather, a wooden shelf. **Flat design** is its opposite: fills and lines with no imitation of material.
- **Hard shadow.** A shadow with zero blur, offset below or beside an object, so it reads as a solid edge. A **soft shadow** has blur.
- **Keycap.** The plastic cap on a key. Its **top face** is where the finger lands. Its **skirt** is the slanted side seen below the top face. Its **dish** is the shallow hollow in the top face. Its **legend** is the printed character. A **sculpted** set changes the cap's height and angle row by row.
- **Double-shot.** A legend moulded from a second colour of plastic, so it never wears off. **Dye-sublimation** sinks ink into the plastic with heat.
- **ABS** and **PBT.** Two keycap and case plastics. ABS is smooth and yellows with age. PBT is harder, with a sandier feel.
- **Backdrop filter.** The CSS property `backdrop-filter`. It blurs or recolours whatever lies *behind* an element, so a translucent panel looks frosted.
- **Tint.** The colour, and its opacity, laid over the blurred backdrop of a glass panel.
- **Specular highlight.** The bright glint where light reflects straight off a glossy surface, usually along an edge.
- **Refraction** and **lensing.** Glass bends the light that passes through it, so what lies behind is displaced and magnified near the edges. Apple calls its version lensing.
- **SVG displacement map.** An SVG filter (`feDisplacementMap`) that shifts each pixel by an amount read from an image. It is the web's usual way to fake refraction.
- **Neo-brutalism.** A 2020s web style: thick dark borders, flat bold fills, hard offset shadows.
- **OKLCH.** A colour space in which **L** is lightness (0 to 100), **C** is chroma (colourfulness; 0 is grey) and **h** is hue in degrees. A hue near 90 reads as warm (yellowish); near 250 as cool (bluish).
- **Contrast ratio.** WCAG's measure of how far apart two colours' lightness is. Body text needs 4.5:1 (AA). A graphic or a control's boundary needs 3:1.

## In short

- **The first board never showed light on an off-white canvas** (READ, §1). All four light options were drawn on the near-black stage, in today's palette rather than Deep Field, with pill buttons and 14 px cards. The glass option floated a dark panel over four round discs of colour.
- **Early personal computing felt warm because of three things** (READ and INFERRED, §2): a light sandy-beige plastic case shaped like a home appliance; a dark, chunky keyboard with white legends set into it; and colour that appeared only on the screen and in the logo.
- **Liquid Glass is a material, not a blur** (READ, §3). It bends light, glints at its edges, and changes its tint and shadow with what lies behind it. Apple keeps it to the navigation layer and warns against glass on glass. Critics found it hard to read, and Apple added a "Tinted" setting a month after launch.
- **The web can blur, but it can barely bend** (READ, §3.5). `backdrop-filter` with blur works in every current browser. Refraction needs `backdrop-filter: url()` with an SVG filter, which works only in Chromium. WebKit's fix was still unmerged on 2026-09-05.
- **The bridges keep the case and the key, and add light** (READ and INFERRED, §4). Teenage Engineering, Playdate, Nothing and Framework each keep one early-computing trait (a coloured control, a bright case, a 1-bit screen, a swappable key) and add one modern one.
- **The canvas can warm without losing the four text colours** (EXECUTED, §5). On `#F3F0E8`, a warm off-white, Deep Field's red, green and yellow text tones measure 4.97 to 4.98, blue 6.16 and ink 16.84. A deeper beige fails: on `#E8E2D2` the three drop to 4.37 to 4.38.
- **Glass text passes when the tint is strong enough** (EXECUTED, §6.4). A light tint of `#F3F0E8` at 86% keeps ink at 12.55, secondary ink at 4.83 and blue at 4.60 over every brand colour and over ink. Red, green and yellow text never sit on glass.
- **Recommended** (INFERRED, §7): **I8, keys under glass.** A warm off-white case, flat surfaces, keycap edges on actions, and one glass panel per view with the four colours as flat keys of light behind it. Product screens stay flat. **Recommended canvas: `#F3F0E8`**, with `#FFFFFF` raised and a warm graphite `#16140F` as the dark canvas.

## 1. What the first board drew

- The light board renders one `StageHero` per option, with `look({ light })` (READ, `src/routes/(identity)/identity/light/+page.svelte`).
- `look()` starts from `RECOMMENDED_LOOK`. That look sets shape `H2` (actions `999px`, cards `14px`) and palette `TODAY`, not Deep Field (READ, `src/lib/identity/look.ts`).
- The hero's ground is the stage unless the behaviour is "paper". On paper the light is forced to `"flat"` (READ, `src/lib/identity/specimens/stage-hero.svelte`, the `ground` and `light` derivations). So every lit option was seen on near-black, and none on an off-white canvas.
- I4 "Glass" drew four discs (`border-radius: 50%`) of the four colours behind cards of `rgb(16 18 24 / 0.6)`, blurred 22 px and saturated 1.5×, with an 18% white border, a 12% white top line and an 18% grain (READ, same file). The board's own copy called it "Very 2021" and "Shown for completeness" (READ, `src/lib/identity/questions.ts`, question I).
- I3, the recommended option, lit the cards from four coloured corners on the stage (READ, same files).
- INFERRED. The owner's "not how the boards draw them" has three likely causes. The round shapes came from H2 and the discs, and H1 has since replaced H2. The dark stage hid the off-white canvas the owner now asks for. And the glass was dark glass over glowing orbs, the 2021 "glassmorphism" look, not a material with edges and weight.

## 2. Early personal computing's material language

### 2.1 The Apple II, 1977

- It went on sale on 10 June 1977 (READ, [Wikipedia, Apple II](https://en.wikipedia.org/wiki/Apple_II)).
- Its case is injection-moulded ABS, produced in Pantone 453, "a light sandy beige". The keyboard is brown with white lettering. The underside is brown plastic (READ, [V&A, Apple II](https://collections.vam.ac.uk/item/O1461690/)).
- The look was meant to sell to a general audience, after kitchen appliances such as a food processor sold in a department store (READ, same source). The case was "designed to look more like a home appliance" (READ, [Wikipedia, Apple II](https://en.wikipedia.org/wiki/Apple_II)).
- Hobby machines of the time were sheet-metal boxes. A plastic case was rare and seen as an expense (READ, via search summary of [apple2history.org](https://www.apple2history.org/) and [landsnail.com](https://landsnail.com/apple/local/design/apple2.html)).
- It is described as the first commercially released microcomputer with a plastic case. Its industrial designer chose beige partly to fit late-1970s offices, which "heavily featured earth tones" (READ, [Wikipedia, Beige box](https://en.wikipedia.org/wiki/Beige_box)).
- The keyboard is built into the case (READ, [Wikipedia, Apple II](https://en.wikipedia.org/wiki/Apple_II)). It had colour graphics, but its text mode was monochrome, 40 columns by 24 lines (READ, same source).
- EXECUTED: we found no published sRGB value for Pantone 453 that we could trust. Pantone's own finder shows a screen simulation only. We do not quote a hex for it.

### 2.2 The beige era

- The IBM PC (August 1981) was beige throughout: system unit, keyboard and monitor. Its neutral colour was chosen to "blend inconspicuously into corporate and home environments". Beige also hid dust. Some countries mandated neutral office colours to reduce eye strain. Purchasing managers wanted cheap standardisation over "visual disarray" (READ, [Wikipedia, Beige box](https://en.wikipedia.org/wiki/Beige_box)).
- A black Apple II Plus flopped, and Apple went back to beige for the Lisa and the Macintosh. The iMac G3 (August 1998) is credited with ending the beige box (READ, same source).
- Retro beige PC cases have returned since 2020, from several makers, as limited or novelty runs (READ, same source).
- The IBM PC's steel chassis had a plastic front. Its Model F keyboard had 83 keys, "positive tactile keys" and flip-up feet (READ, [Wikipedia, IBM Personal Computer](https://en.wikipedia.org/wiki/IBM_Personal_Computer)). The 1985 Model M used buckling springs with "tactile and auditory feedback", PBT caps, and dye-sublimated legends on white or grey caps (READ, [Wikipedia, IBM Model M](https://en.wikipedia.org/wiki/IBM_Model_M_keyboard)).
- The original Commodore 64 is described as a deeper brown and the 1986 C64C as beige. Owners disagree, and plastic batches seem to have varied (READ, via search summary of [Wikipedia, Beige box](https://en.wikipedia.org/wiki/Beige_box) and [rubenerd.com](https://rubenerd.com/what-colour-is-the-commodore-64)).
- ABS yellows under ultraviolet light or heat, by photo-oxidation (READ, [Wikipedia, Retrobright](https://en.wikipedia.org/wiki/Retrobright)). INFERRED: the "beige" people remember is partly age. Today's memory of the colour is warmer than the factory colour.

### 2.3 Snow White and Platinum

- Apple used the Snow White design language from 1984 to 1990, developed by an outside design firm (READ, [Wikipedia, Snow White design language](https://en.wikipedia.org/wiki/Snow_White_design_language)).
- Its traits: a light off-white or light grey finish with little texture; shallow lines 2 mm wide and deep, 10 mm apart, some of them vents; uniform wall thickness; corners of 3 mm at the rear and 2 mm at the front; an inlaid logo (READ, same source).
- Its colours: "Fog", a creamy off-white, from the IIc; then "Platinum", a warm grey lighter than the earlier beige "Putty", across the line from 1987 (READ, same source).
- Mac OS 8's default look was also named Platinum. It used "various shades of grey" (READ, [Wikipedia, Appearance Manager](https://en.wikipedia.org/wiki/Appearance_Manager)).
- INFERRED. "Fog", "Platinum" and "Putty" are Apple's names. Pluto must not reuse them for its tokens.
- INFERRED. Snow White's small radii (2 to 3 mm on a large case) are the physical cousin of H1's single 8 px radius on a screen. The era was not round.

### 2.4 The Macintosh, 1984

- Released 24 January 1984: an all-in-one beige case with an integrated handle and a 9-inch monochrome screen (READ, [Wikipedia, Macintosh 128K](https://en.wikipedia.org/wiki/Macintosh_128K)).
- Its keyboard had no arrow keys, no numeric keypad and no function keys. The team's signatures were moulded inside the case (READ, same source).
- INFERRED. The Macintosh's face is a beige case with a dark glass screen inset into it. That screen is the period's only "glass".

### 2.5 Related: Olivetti and Braun

- The Olivetti Valentine typewriter (1969) had a glossy red body of colour-impregnated ABS. Red was chosen to convey casual creativity rather than office monotony. Its ribbon caps were orange (READ, [Wikipedia, Olivetti Valentine](https://en.wikipedia.org/wiki/Olivetti_Valentine)).
- The Braun ET66 calculator (1987) is a black rectangle with convex, circular buttons, cited as the clearest expression of "less but better" (READ, via search summary of [V&A](https://collections.vam.ac.uk/) and a design shop listing). A claim that its equals key is yellow could not be confirmed (READ, same summary).
- INFERRED. Both show colour used as a function: one body colour for a whole object, or one coloured key that matters most.

### 2.6 The six-colour logo, 1977 to 1998

- The Apple II's logo used rainbow stripes "to reflect the colour capability", and it stayed in the corporate logo until early 1998 (READ, [Wikipedia, Apple II](https://en.wikipedia.org/wiki/Apple_II)).
- The stripes ran green, yellow, orange, red, purple, blue, top to bottom, deliberately out of spectral order. The designer said the colour bars on the monitor inspired them. The only direction given was "don't make it cute". The colours are said to have made the computer look user-friendly to schools and children (READ, via search summary of [Creative Review](https://www.creativereview.co.uk/apple-logo/) and [AppleInsider](https://appleinsider.com/articles/22/03/29/how-apples-logo-started-out-as-the-most-expensive-and-became-the-most-iconic); both pages refused our fetch).
- INFERRED. It read as warm and human for four reasons. It was the only colour on a beige object. Its colours were the screen's colours, so it promised what the machine could do. Its stripes were flat and separate, never blended. And it sat on a fruit, a natural shape, not a geometric one.
- INFERRED. Pluto may learn the *behaviour*: four flat colours, apart, as the only colour on a warm neutral object, standing for what the product does. Pluto must not reproduce the *form*: no horizontal stripes inside a shape, no six colours, no rainbow order, no fruit.

### 2.7 What makes a keyboard feel "chunky"

- Profiles are the side shape of each row. A sculpted profile changes from row to row. Tops are cylindrical, flat or spherical (READ, [Wikipedia, Keycap](https://en.wikipedia.org/wiki/Keycap)).
- Double-shot legends were common in the 1970s and 1980s and never wear off. Dye-sublimation works only on PBT. Pad printing is cheapest (READ, same source).
- ABS feels slick and yellows. PBT feels sandier and yellows less (READ, same source).
- Apple's later Extended Keyboard is said to use PBT caps with dye-sublimated legends and an ABS case and space bar (READ, via search summary of [Deskthority](https://deskthority.net/wiki/Apple_Extended_Keyboard) and iFixit).
- INFERRED. On screen, "chunky" comes from five visible cues:
  1. **A tall skirt.** The cap's side shows below its top face, darker than the face. This is a hard shadow, not a blur.
  2. **A lit top edge.** Light from above catches the top face's front edge.
  3. **Travel.** Pressing moves the face down and shortens the skirt.
  4. **Two tones.** Letter keys are light; modifier keys are darker. The Apple II reversed this: dark keys on a light case.
  5. **Bold, small legends,** set near a corner or centred, in a plain sans.
  Texture (a faint grain) helps a little; sculpting by row is invisible on a flat screen and is left out.

## 3. Liquid Glass

### 3.1 What Apple says it is

- Announced 9 June 2025. A "new material" that "is translucent and behaves like glass in the real world". It "reflects and refracts its surroundings", "uses real-time rendering and dynamically reacts to movement with specular highlights", and "intelligently adapts between light and dark environments". It is "inspired by the depth and dimensionality of visionOS" (READ, [Apple Newsroom](https://www.apple.com/newsroom/2025/06/apple-introduces-a-delightful-and-elegant-new-software-design/)).
- "The primary way Liquid Glass visually defines itself is through something called Lensing." Earlier materials scattered light; this one "bends, shapes, and concentrates light in real time" (READ, [WWDC25 session 219, Meet Liquid Glass](https://developer.apple.com/videos/play/wwdc2025/219/)).
- Larger elements simulate thicker glass, with "deeper, richer shadows", more lensing and "a softer scattering of light" (READ, same source).
- Light sources shine on it, "producing highlights that respond to geometry". In some cases "the lighting responds to device motion" (READ, same source).
- Its shadow is adaptive: more opaque over text, lighter over a plain light background (READ, same source).
- A tint "generates a range of tones that are mapped to content brightness underneath". "Tinting should only be used to bring emphasis to primary elements and actions." "Avoid tinting all your elements" (READ, same source).
- When touched, "the material illuminates from within", the glow spreading from the fingertip to nearby glass (READ, same source).

### 3.2 Apple's own limits

- Two variants, never mixed. **Regular** works at any size over any content. **Clear** is permanently more transparent, and is used only over media-rich content, with bold, bright content on top, and only where a dimming layer will not hurt. Without that dimming layer, "legibility gets noticeably worse" (READ, same source).
- It is "best reserved for the navigation layer that floats above the content". A table view made of glass "would … muddy the hierarchy", so it stays in the content layer (READ, same source).
- "Always avoid glass on glass." Elements on glass use fills, transparency and vibrancy instead (READ, same source).
- Small elements flip between light and dark with the background. Large ones adapt but do not flip (READ, same source).

### 3.3 The criticism

- A usability firm's October 2025 review found text over busy backgrounds "illegible", contrast "often too low", and motion "distraction with a side of nausea". Floating controls "obscure the page content" (READ, [Nielsen Norman Group, 10 October 2025](https://www.nngroup.com/articles/liquid-glass/)).
- Developers and users reported legibility problems at the iOS 26 launch (READ, via search summary of [MacRumors](https://www.macrumors.com/2025/09/17/ios-26-liquid-glass-critiques/) and [9to5Mac](https://9to5mac.com/2025/09/15/ios-26-officially-launches-today-but-some-developers-arent-sure-it-should/)).

### 3.4 The settings Apple added

- System settings change it automatically. Reduce Transparency "makes Liquid Glass frostier and obscures more of the content behind it". Increase Contrast makes elements "predominantly black or white" with "a contrasting border". Reduce Motion "decreases the intensity of some effects and disables any elastic properties" (READ, [WWDC25 session 219](https://developer.apple.com/videos/play/wwdc2025/219/)).
- iOS 26.1 beta 4 (October 2025) added Settings → Display & Brightness → Liquid Glass: Clear (the default) or Tinted, which "increases opacity and adds more contrast". Reports differ on how much of the system it reaches (READ, via search summary of [MacRumors](https://www.macrumors.com/2025/10/20/ios-26-1-liquid-glass-toggle/), [9to5Mac](https://9to5mac.com/2025/10/20/ios-26-1-beta-4-adds-new-setting-to-tone-down-liquid-glass-transparency/) and [Engadget](https://www.engadget.com/mobile/smartphones/how-to-adjust-the-liquid-glass-effect-in-ios-261-203634681.html)).
- INFERRED. Apple shipped the material, then a way to make it more opaque. Pluto can start where Apple ended: opaque enough to read by default.

### 3.5 On the web

- `backdrop-filter` "lets you apply graphical effects such as blurring or color shifting to the area behind an element". It is Baseline 2024, working across current browsers since September 2024 (READ, [MDN, backdrop-filter](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter)). Its syntax allows an SVG filter by `url()` (READ, same source).
- Using an SVG filter as the backdrop works only in Chromium. Safari and Firefox limit `backdrop-filter` to built-in functions such as `blur()` (READ, [LogRocket](https://blog.logrocket.com/how-create-liquid-glass-effects-css-and-svg/); [an open-source liquid-glass library's README](https://github.com/rizroze/liquid-glass), which falls back to `blur(12px)`).
- WebKit bug 245510, "backdrop-filter: url(#some-svg-filter) doesn't work with SVG filters like feDisplacementMap", opened 2022-09-21, is still NEW. Patches were posted in July 2026 and re-uploaded on 2026-09-05 after a GPU-process crash; none had landed (READ, [WebKit Bugzilla 245510](https://bugs.webkit.org/show_bug.cgi?id=245510)).
- The usual web recipe for refraction is `feImage` (a displacement map), `feDisplacementMap` (the bend), `feColorMatrix` (saturation) and `feComposite` (a rim mask) (READ, [LogRocket](https://blog.logrocket.com/how-create-liquid-glass-effects-css-and-svg/)).
- Cost. Each SVG backdrop filter reserves GPU and compositing resources; large or many elements drop frames on scroll; the advice is a few floating elements only (READ, same source). One library warns that elements wider than 800 px "may cause GPU jank" (READ, [README](https://github.com/rizroze/liquid-glass)). Blogs repeat that blur cost grows with area and radius and suggest radii under 20 px, without a benchmark we could find (READ, via search summary of several developer blogs).
- `prefers-reduced-transparency` detects a device's reduce-transparency setting, with values `no-preference` and `reduce`. It is experimental and not Baseline (READ, [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-transparency)).
- INFERRED. On the web today, Pluto can ship frosted glass everywhere and bent glass only in Chromium. Anything that depends on bending must degrade to frost, and frost must degrade to opaque.

## 4. Bridges between the two

| Prior art | Keeps from early computing | Adds | Source |
|---|---|---|---|
| Skeuomorphism to flat | Real materials as metaphor | Then dropped them: Apple's iOS 7 (2013) was called the "death of skeuomorphism" | READ, [Wikipedia, Skeuomorph](https://en.wikipedia.org/wiki/Skeuomorph) |
| Neo-brutalism | Hard edges, flat bold colour, offset solid shadows like a printed key | Thick dark borders, oversized type | READ, [NN/g, 11 April 2025](https://www.nngroup.com/articles/neobrutalism/) |
| Teenage Engineering | The device as a friendly appliance; "a clever colour scheme" on its synthesiser; pocket devices that evoke calculators and handheld games | Graphic displays, minimal cases | READ, [Wikipedia, Teenage Engineering](https://en.wikipedia.org/wiki/Teenage_Engineering) |
| Playdate | A square, bright, single-colour case; a 1-bit black-and-white screen with no backlight | A crank; a modern indie-games service | READ, [Wikipedia, Playdate](https://en.wikipedia.org/wiki/Playdate_(console)) |
| Nothing | Hardware shown as hardware | Transparent backs; LED light on the back as an interface | READ, [Wikipedia, Nothing](https://en.wikipedia.org/wiki/Nothing_(company)) |
| Framework | The keyboard as a module you can lift out | Hot-swappable input modules, spacers in colours, a 12-inch model in several colours | READ, via search summary of [Framework](https://frame.work/blog/introducing-the-framework-laptop-16) and its community forum |
| Beige case revival, 2020 to 2025 | The beige box itself | Modern parts inside | READ, [Wikipedia, Beige box](https://en.wikipedia.org/wiki/Beige_box) |
| "Soft plastic" 3D renders | Moulded plastic, rounded and glossy | Studio lighting, ambient occlusion | INFERRED; no source read |

- NN/g notes neo-brutalism's risks: vivid pairs "can fail readability and contrast standards", and without shadows interactive elements may be harder to recognise (READ, [NN/g](https://www.nngroup.com/articles/neobrutalism/)).
- INFERRED. Three bridges stand out for Pluto. Teenage Engineering and Playdate show colour as a *control*, not a decoration. Nothing shows light *behind* a transparent surface, which is the honest form of glass for hardware. Framework shows the key as a modular unit, which suits a suite of products.
- INFERRED. "Soft plastic" 3D is round by nature. It fails H1 and the owner's dislike of round drawing, so no option uses it.

## 5. The canvas, measured

Deep Field's paper is `#F4F6F8`: OKLCH hue 248, cool (EXECUTED). Its option text says "ink, not paper, is the default ground of expressive pages" (READ, `src/lib/identity/palettes.ts`, id `deep-field`). The owner now asks for an off-white canvas with the rainbow colours on it (READ, `decisions.md`, 2026-11-06).

EXECUTED. Each candidate canvas, with Deep Field's text tones, ink, secondary ink (`inkSoft`) and the four mark colours on it. AA text needs 4.5; a graphic needs 3.

| Canvas | Hex | OKLCH | blue text | red text | green text | yellow text | ink | inkSoft | white card vs canvas |
|---|---|---|---|---|---|---|---|---|---|
| Deep Field paper | `#F4F6F8` | L 97.2 C .003 h 248 | 6.48 | 5.23 | 5.22 | 5.23 | 17.70 | 6.81 | 1.08 |
| Today's token | `#F7F7F4` | L 97.5 C .004 h 106 | 6.54 | 5.28 | 5.27 | 5.28 | 17.86 | 6.87 | 1.07 |
| W1 bone | `#F6F4EE` | L 96.7 C .008 h 91 | 6.38 | 5.15 | 5.14 | 5.15 | 17.43 | 6.71 | 1.09 |
| **W2 warm off-white** | **`#F3F0E8`** | L 95.5 C .011 h 90 | **6.16** | **4.98** | **4.97** | **4.98** | **16.84** | **6.48** | 1.13 |
| W3 warm grey ("platinum-like") | `#ECE9E1` | L 93.4 C .011 h 90 | 5.79 | 4.67 | 4.66 | 4.67 | 15.80 | 6.08 | 1.21 |
| W4 sand ("beige") | `#E8E2D2` | L 91.3 C .022 h 90 | 5.43 | 4.38 | 4.37 | 4.38 | 14.83 | 5.70 | 1.29 |
| W5 putty-like | `#DED6C2` | L 87.7 C .028 h 89 | 4.85 | 3.91 | 3.90 | 3.91 | 13.24 | 5.09 | 1.44 |

The four mark colours on W2 (EXECUTED): blue 6.16, red 4.92, green 4.36, yellow 1.91. Yellow is also 2.00 on Deep Field's own paper and 2.17 on white. The yellow dot has never met 3:1 on a light ground.

INFERRED.

- **W2 `#F3F0E8` is the warmest canvas that keeps every Deep Field text tone.** Its chroma, 0.011, is still a neutral, so C2's "neutral product screens" holds. Its hue moves from cool (248) to warm (90).
- W3 passes, but red, green and yellow text keep only 0.16 to 0.17 of margin. Any grain or tint under text would break it.
- W4 and W5 read most like a period case. They fail AA for three text tones. Using them would reopen B3's text tones, which the owner settled.
- A beige as deep as the Apple II's case belongs to *objects* on the canvas, not to the canvas: a sunk well, a key's skirt, the case colour of an illustration. See §6.1.

**How this resolves the tension with Deep Field.** The hues stay. Only the paper changes, from `#F4F6F8` to `#F3F0E8`. Ink stops being the default ground of expressive pages. It becomes the *screen*: an ink panel set into the warm case, as the Macintosh's screen sat in its beige case (§2.4). The night ground keeps its meaning, the deep field seen through a window, and gains a frame.

## 6. Depth recipes, measured

### 6.1 Surfaces and edges, light theme, on W2 (EXECUTED)

| Role | Hex | vs canvas | ink on it | inkSoft on it | blue text on it | yellow text on it |
|---|---|---|---|---|---|---|
| canvas | `#F3F0E8` | — | 16.84 | 6.48 | 6.16 | 4.98 |
| raised (white) | `#FFFFFF` | 1.13 | 19.17 | 7.38 | 7.02 | 5.67 |
| raised (warm white) | `#FBFAF6` | 1.09 | 18.36 | 7.06 | 6.72 | 5.43 |
| sunk | `#E9E5DB` | 1.10 | 15.24 | 5.86 | 5.58 | 4.51 |
| hairline | `#D9D3C6` | 1.30 | — | — | — | — |
| key skirt | `#CFC8B8` | 1.46 | 11.51 | 4.43 | 4.21 | 3.40 |
| input edge | `#857E70` | 3.53 (3.85 on warm white, 4.02 on white) | — | — | — | — |

INFERRED. A raised surface on W2 is only 1.09 to 1.13 from the canvas. It needs a hairline or a skirt to be seen. A control that has no text label needs the input edge (3:1 or more) for its boundary. Text never sits on a key skirt.

### 6.2 Keycaps in the four colours (EXECUTED)

| Fill | Legend | Contrast | Skirt (ink 30% over fill) |
|---|---|---|---|
| blue `#2D48D4` | white | 7.02 | `#23379B` |
| red `#C92035` | white | 5.61 | `#901B2C` |
| yellow `#F19E20` | ink | 8.81 | `#AC731D` |
| green `#008058` | white | 4.96 | `#035E45` |

On the dark canvas, the lifted fills (`#93B0FF`, `#FF9491`, `#F3A023`, `#60C498`) take graphite `#16140F` legends at 8.62 to 8.67, and stand 8.62 to 8.67 from the canvas (EXECUTED).

INFERRED. Four keys in a row, blue, red, yellow, green, is the mark's reading order laid out as keys. It must not be a 2×2 of squares (Microsoft's structure), touching stripes (Apple's logo), or a blend (Google's AI look).

### 6.3 Grain (EXECUTED)

A grain tile that darkens W2 by 3% at its darkest gives `#ECE9E1`. Red, green and yellow text drop to 4.66 to 4.67. At 5% they drop to 4.45 to 4.46 and fail. INFERRED: grain stays at 3% or less, and never under text on a productive screen.

### 6.4 Glass (EXECUTED)

The worst case for text on glass is a large solid region behind the panel, wider than the blur. We composited the tint over each colour at full strength. Blur only mixes the backdrop toward its neighbours, which helps.

Light glass: tint `#F3F0E8`. Lowest alpha for each text, over the four mark colours and ink:

- ink at 4.5: 48%. ink at 7: 63%. inkSoft at 4.5: 83%. blue text at 4.5: 86%.

At **86%** (`rgb(243 240 232 / 0.86)`), over every backdrop measured:

| Text | canvas | blue | red | yellow | green | ink | white | lowest |
|---|---|---|---|---|---|---|---|---|
| ink | 16.84 | 13.55 | 13.53 | 15.42 | 13.99 | 12.55 | 17.15 | **12.55** |
| inkSoft | 6.48 | 5.21 | 5.20 | 5.93 | 5.38 | 4.83 | 6.60 | **4.83** |
| blue text | 6.16 | 4.96 | 4.95 | 5.65 | 5.12 | 4.60 | 6.28 | **4.60** |
| red, green, yellow text | 4.97–4.98 | 3.99–4.01 | 3.99–4.00 | 4.55–4.56 | 4.13–4.14 | 3.70–3.71 | 5.06–5.07 | **3.70** |

At 86% the colour behind still shows: blue becomes `#D7D8E5`, red `#EDD3CF`, yellow `#F3E5CC`, green `#D1E0D4`.

Dark glass: tint graphite `#16140F` at **84%** (`rgb(22 20 15 / 0.84)`), over the lifted four, the mark blue and yellow, and graphite: canvas text `#F3F0E8` lowest 12.09; muted `#A39D90` lowest 5.10; lifted colours as text lowest 6.45. Over a light backdrop (`#F3F0E8`), muted drops to 4.40.

Highlights: a white rim on W2 is 1.13 from the canvas, so a light-theme rim shows only on glass or on a tinted face. A 14% white rim on graphite is 1.50 from it (EXECUTED).

INFERRED.

- Glass carries ink, inkSoft and blue text only. Red, green and yellow are status colours in an app; they never sit on glass.
- Dark glass never floats over a light panel.
- `saturate()` in the backdrop filter pushes the backdrop toward pure colour. We measured without it. The options use none.

### 6.5 Dark grounds (EXECUTED)

| Ground | Hex | OKLCH | lifted four | text `#F3F0E8` | muted `#A39D90` | mark blue |
|---|---|---|---|---|---|---|
| Deep Field ink | `#0B0F17` | L 16.8 C .018 h 264 | 8.99–9.03 | 16.84 | 7.10 | 2.73 |
| Deep Field stage | `#030407` | L 10.7 C .011 h 267 | 9.61–9.66 | 18.00 | 7.59 | 2.91 |
| D1 warm graphite | `#16140F` | L 19.2 C .010 h 89 | 8.62–8.67 | 16.16 | 6.82 | 2.61 |
| D2 keyboard brown | `#1C1813` | L 21.2 C .011 h 73 | 8.27–8.32 | 15.50 | 6.54 | 2.51 |

A dark key `#2A2620` on D1 takes `#F3F0E8` legends at 13.20. Its edge `#7A7366` stands 3.91 from D1 and 3.20 from the key (EXECUTED).

Dark raised `#221F19`: text 14.42, muted 6.08, lifted blue and red 7.74, 1.12 from D1. Dark sunk `#0F0E0B`: text 16.94, muted 7.15, lifted blue and red 9.09, 1.04 from D1 (EXECUTED).

INFERRED. D1 is the dark mirror of W2: the same warm hue, a neutral chroma. D2 is closer to the Apple II's brown keyboard (READ, §2.1) but loses 0.28 to 0.66 on every pair for little visible gain. Dark raised and sunk surfaces sit very close to D1, so in dark they need the hairline `#36322A` to be seen. The mark's blue dot on any dark ground fails 3:1, as the 2026-11-01 decision already found; the lifted dots apply there.

## 7. Options for question I, second round

Every option keeps these rules (INFERRED, from §2 to §6 and the settled choices):

- **Radius:** 8 px for every case, key, card and panel (H1). Round only for the dots. No discs of light, no pills.
- **Colour:** the four together only in owned moments (C2). Flat and apart, never blended. Never a 2×2 of squares, never touching stripes.
- **Motion:** a key moves only when the visitor presses or hovers (J2). Only the dots spring.
- **Accessibility:** under `prefers-reduced-transparency: reduce`, `forced-colors: active`, or no `backdrop-filter` support, glass becomes its opaque raised colour. Under `prefers-reduced-motion`, a key's travel becomes a colour change.
- **Tokens:** every value below is a token, in both themes (constitution §4.3). Names are suggestions for the specification.
- **What stays flat everywhere:** product screens. Tables, documents, sheets, forms, menus and dialogs take canvas, raised, sunk, hairline and input edge only, with one accent. No glass, no grain, no coloured keys.

### I5. Platinum, flat

**Idea.** The warm case and nothing else: flat objects on an off-white canvas, colour as flat fields.

| Token | Light | Dark |
|---|---|---|
| canvas | `#F3F0E8` | `#16140F` |
| raised | `#FFFFFF` | `#221F19` |
| sunk | `#E9E5DB` | `#0F0E0B` |
| hairline | `#D9D3C6` | `#36322A` |
| shadow | none | none |
| edge / highlight | 1 px hairline only | 1 px hairline only |
| glass | none | none |

- **Where the four appear:** as flat fields of one colour in owned moments, such as a proof band or a launch tile, with the §6.2 legends.
- **Pros:** fastest; prints; every pair already measured. Closest to the Apple II's flat, honest case.
- **Cons:** no depth and no glass, so it does not bridge to the present. It is I1 on a warmer ground.

### I6. Keycaps

**Idea.** The chunky keyboard: actions are keys with a hard skirt, and the four colours are four keys.

| Token | Light | Dark |
|---|---|---|
| canvas, raised, sunk, hairline | as I5 | as I5 |
| key face | `#FBFAF6` | `#2A2620` |
| key skirt | `#CFC8B8` | `#0A0907` |
| shadow-key | `0 3px 0 0 var(--key-skirt)`, 1 px hairline border | same, plus `inset 0 1px 0 rgb(255 255 255 / 0.10)` |
| shadow-key-pressed | `0 1px 0 0 var(--key-skirt)`, `translateY(2px)` | same |
| edge-highlight | `inset 0 1px 0 #FFFFFF` on the key face | as above |
| coloured key | fill, legend and skirt from §6.2 | lifted fill, graphite legend, skirt ink 35% over fill |
| glass | none | none |

- **Where the four appear:** a row of four keys in the mark's order: the hero's call to action, a launcher, a loader that presses each key as a step completes.
- **Productive screens:** buttons keep a 1 px skirt (`0 1px 0 0`) and no more.
- **Pros:** the most direct answer to "chunky keyboards". Tactile, and ownable as a key row. Cheap: shadows only.
- **Cons:** close to neo-brutalism's offset shadow, though tinted rather than black (§4). No glass.

### I7. Case and screen

**Idea.** The beige case with a dark screen set into it: the ink stage becomes an inset window, and colour is light on that screen.

| Token | Light | Dark |
|---|---|---|
| canvas, raised, sunk, hairline | as I5 | as I5 |
| screen | `#030407` (Deep Field stage) | `#030407` |
| screen bezel | 8 px of sunk `#E9E5DB` around the screen, 1 px hairline | 8 px of `#0F0E0B`, 1 px `#36322A` |
| screen-inset | `inset 0 2px 6px rgb(0 0 0 / 0.5)` | same |
| screen-glass | `inset 0 1px 0 rgb(255 255 255 / 0.14)` rim, top edge only | same |
| shadow | none outside the screen | none |
| glass (blur) | none | none |

- **Where the four appear:** only on the screen, as the lifted four (9.61 to 9.66 on the stage): the run console, data figures, the dots.
- **Pros:** resolves B3's tension most literally: ink keeps its role, inside a warm frame. The screen is the period's glass. No blur cost.
- **Cons:** a screen inside a page can read as a device mock-up, not as the product. Glass appears only as a rim.

### I8. Keys under glass (recommended)

**Idea.** The case and its keys from early computing, with one pane of modern glass laid over a row of coloured keys, so the colours become light seen through the glass.

| Token | Light | Dark |
|---|---|---|
| canvas | `#F3F0E8` | `#16140F` |
| raised | `#FFFFFF` | `#221F19` |
| sunk | `#E9E5DB` | `#0F0E0B` |
| hairline | `#D9D3C6` | `#36322A` |
| input edge | `#857E70` (3.53 on canvas) | `#7A7366` (3.91 on canvas) |
| key face / skirt | `#FBFAF6` / `#CFC8B8` | `#2A2620` / `#0A0907` |
| shadow-key | `0 3px 0 0 var(--key-skirt)` | same, plus `inset 0 1px 0 rgb(255 255 255 / 0.10)` |
| shadow-key-pressed | `0 1px 0 0 var(--key-skirt)`, `translateY(2px)` | same |
| glass-tint | `rgb(243 240 232 / 0.86)` | `rgb(22 20 15 / 0.84)` |
| glass-blur | `blur(16px)`, no `saturate()` | same |
| glass-rim (specular) | `inset 0 1px 0 rgb(255 255 255 / 0.8)` | `inset 0 1px 0 rgb(255 255 255 / 0.12)` |
| glass-edge | `1px solid rgb(11 15 23 / 0.08)` | `1px solid rgb(255 255 255 / 0.08)` |
| glass-shadow | `0 1px 0 rgb(11 15 23 / 0.06), 0 16px 32px -16px rgb(11 15 23 / 0.28)` | `0 16px 40px -16px rgb(0 0 0 / 0.7)` |
| glass-fallback | `#FBFAF6` opaque | `#221F19` opaque |
| key row (light behind glass) | four flat 8 px keys, the four mark colours, gaps of at least one key's height, never touching | the lifted four |

- **Where the four appear:** behind glass, as the key row. A hero shows the row; a glass panel holding the headline and the call to action slides over part of it. The keys light, in order, when the visitor runs something: the panel's tint shows each colour pass beneath it. In the screen of I7, when a page needs one, the lifted four appear as light.
- **Glass rules:** at most one glass panel per view, on expressive pages only (Apple's "no glass on glass", §3.2). Glass holds ink, inkSoft and blue text only (§6.4). No refraction in the first release; an SVG displacement may be added later as a Chromium-only enhancement, over a frosted fallback that already passes.
- **Productive screens:** flat. Canvas `#F3F0E8`, raised `#FFFFFF`, a 1 px key edge on buttons. Nothing else changes.
- **Pros:** bridges both ends in one composition: the case, the key and the colour from 1977, the glass and its light from 2025. Every text pair passes AA over every backdrop measured. Glass is frosted, so it renders the same in Chrome, Safari and Firefox. The key row is a Pluto form: the mark's order, laid out as keys.
- **Cons:** three ideas (case, key, glass) need a written list of where each may appear, or they sprawl. The 86% tint is frostier than Apple's Clear glass; the light behind reads as colour through frost, not through clear glass. Blur costs GPU time; one panel per view keeps it small.

### I9. Liquid platinum

**Idea.** Liquid glass in full on a warm canvas: bent glass, moving highlights and adaptive tint on every expressive surface.

| Token | Light | Dark |
|---|---|---|
| canvas, raised, sunk | as I8 | as I8 |
| glass-tint | `rgb(243 240 232 / 0.86)` at rest; `0.94` over text-heavy backdrops | `rgb(22 20 15 / 0.84)`; `0.92` |
| glass-blur | `blur(16px)` | same |
| glass-lens | `backdrop-filter: url(#pluto-lens)` with `feDisplacementMap`, Chromium only, over the frosted fallback | same |
| glass-specular | a rim highlight whose position follows the pointer, only while the pointer moves (J2) | same |
| glass-rim, glass-edge, glass-shadow | as I8 | as I8 |
| key row | as I8, refracted at the glass's edge | as I8 |

- **Where the four appear:** as light behind and through every expressive glass surface.
- **Pros:** the most current look. The pointer-led highlight answers the visitor, which is J2.
- **Cons:** reads as Apple's material, which is prior art to study, not to wear. Refraction works only in Chromium; Safari's fix is unmerged (§3.5). It invites the legibility criticism Liquid Glass drew (§3.3). The highest GPU cost. The most to govern.

## 8. Recommendation

- **Option: I8, keys under glass** (INFERRED). It is the only option that holds every term of the owner's brief: off-white canvas, chunky keys, the four colours on the canvas, and glass. It keeps product screens flat (C2), keeps every corner at 8 px (H1), and passes AA for every text pair measured, in both themes (constitution §4.4).
- **Canvas: `#F3F0E8`** (EXECUTED, §5). Warm (OKLCH hue 90) and still neutral (chroma 0.011). Ink 16.84, blue text 6.16, red, green and yellow text 4.97 to 4.98, inkSoft 6.48. Raised stays `#FFFFFF` (1.13 from the canvas). The dark canvas is warm graphite `#16140F`: the lifted four 8.62 to 8.67, text 16.16, muted 6.82.
- **Deep Field changes in one value** (INFERRED). Its paper `#F4F6F8` becomes `#F3F0E8`. Its hues, text tones, lifted tones, ink and stage stay. Ink stops being the expressive pages' default ground and becomes the screen inside the case, when a page needs one.
- **Names** (INFERRED). Apple's case colours were "Fog", "Platinum" and "Putty" (READ, §2.3). Pluto's canvas takes a name from Pluto's own set, alongside Charon Blue and Tombaugh Red, not one of Apple's.

## Limits

- **No visual test.** Nothing was drawn. The options are token recipes; the `/identity` board must show them before the owner judges.
- **Glass contrast is modelled, not rendered.** We composited the tint over solid colour in sRGB. A real blur mixes neighbours, which helps, and a browser may composite differently. Grain, `saturate()` and refraction were not measured on glass.
- **Pantone 453 has no trusted sRGB value** here. The canvas candidates are judged by contrast and OKLCH, not by match to any period case.
- **Some sources were seen only as search summaries:** the striped logo's history, Apple's iOS 26.1 setting, the Commodore colour, the Braun calculator, Framework, and the cost of blur. Two pages refused our fetch. Apple's Human Interface Guidelines page on materials returned no body text.
- **Browser support moves.** WebKit's `backdrop-filter: url()` patches may land after 2026-09-05. `prefers-reduced-transparency` is experimental. This release checks neither in Safari or Firefox (decisions, 2026-11-01).
- **The yellow mark dot fails 3:1** on every light ground measured (1.91 on the recommended canvas). It already did on Deep Field's paper. That is a property of the settled mark, not of this memo's options.
- **"Soft plastic" 3D was not researched** from sources; it is ruled out by H1 alone.
- **WCAG 2.2 AA is the only measure applied.** Perceptual contrast (APCA) and colour-vision simulation were not run.
