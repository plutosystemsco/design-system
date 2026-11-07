# A signature device from Pluto and space

- **Status:** complete
- **Date:** 2026-11-06
- **Author:** the design lead's researcher
- **Question:** The owner turned down all five first-round devices (F1 to F5) and asked for new ones themed on space or on Pluto itself. Which real facts about Pluto and its system can become one graphic idea that grows out of the four dots and flexes from a loader to a billboard? How does each map to "Work runs on data."? How does each work as a still, a loader, a hero and a figure, within the owner's settled choices, and can it be built accessibly?
- **What it blocks:** question F's second round on `/identity`.

## How to read this memo

Every claim carries a label.

- **EXECUTED:** we ran it and saw the result, on 2026-11-06. The contrast ratios and the geometry were computed with a throwaway Python script in a scratch folder outside this repository, using the WCAG 2.2 relative-luminance formula. Nothing was written to this repository except this memo.
- **READ:** a source says so. Every web source was read on 2026-11-06. Where only a search engine's summary was seen, and not the page, the claim says "via search summary". Local sources were read the same day: `src/lib/identity/questions.ts`, the five `src/lib/identity/specimens/device-*.svelte` files, `src/lib/identity/palettes.ts`, `src/app.css` and the memos cited by name.
- **INFERRED:** our reasoning.

No person is named except Clyde Tombaugh, who discovered Pluto and gives Tombaugh Red its name.

Terms of art.

- **Signature device.** The one graphic idea, other than the logo, that a brand owns and repeats: Google's bouncing dots, Mastercard's circles, IBM's bars.
- **Still, loader, hero, figure.** The four jobs a device must do. A *still* is the device printed, with no motion. A *loader* shows that work is under way. A *hero* is the device at billboard scale, on a launch page. A *figure* is a numbered, captioned picture of data in the "good textbook" register (question M).
- **Owned moment.** The owner's C2: product screens stay neutral and one-accent; the four colours appear together only in moments the brand owns.
- **Spring.** Motion driven by a simulated spring, which overshoots and settles. The owner's J4 allows springs for the dots and anything made of them. J2 says every other animation answers the visitor.
- **Reduce.** The system setting `prefers-reduced-motion: reduce`, which asks a page not to move.
- **Plate.** A photographic glass plate: the sky recorded on glass by a telescope.
- **Blink comparator.** A machine that shows two plates of the same sky, one after the other, in quick turns. A star that stays put looks still. Anything that moved between the two nights appears to jump.
- **Barycentre.** The point two bodies orbit together: their shared centre of mass.
- **Occultation.** One body passing in front of a star, so the star's light drops for a moment.
- **Light curve.** A plot of brightness against time. An occultation shows as a dip.
- **Chord.** In an occultation, the straight line one observer's view of the star traces across the body. Its two ends are the moments the star disappeared and came back.
- **Limb.** The edge of a world's disc as seen from space.
- **Tholin.** Reddish-brown organic matter made when sunlight breaks up simple gases such as methane and nitrogen.
- **Resonance.** Two orbits whose periods form a simple ratio, such as 3:2.
- **Flash (WCAG).** A pair of opposing changes in brightness large enough to count under WCAG 2.2 SC 2.3.1.

## In short

- **The first round failed on specificity** (INFERRED, §1). Four of the five devices were about data in general, and "Orbits" was space in general. The owner asked for space or Pluto. So each new device must rest on one true, checkable fact about Pluto's system, and that fact must carry a verb the product does: find, measure, govern, resolve.
- **Pluto's own story is a search** (READ, §2.1). Tombaugh found Pluto in February 1930 by blinking two glass plates taken six days apart and spotting the one dot that moved. He had scanned about a million and a half stars by then. Its moon Charon was found in 1978 in the same way: a bump on archived images that earlier observers had dismissed as defects (READ, §2.2).
- **The richest facts are methods, not scenery** (INFERRED, §2, §3). The blink (find the change), the occultation chords (many observers each see a slice; together they give the shape), the barycentre (two bodies turn around a point outside both), and New Horizons' approach (a dot that resolves into a world). A planet, a ring or a starfield is scenery. A method can be drawn with dots and has a job.
- **Space in branding is crowded** (READ, §3). Rockets are a stock sign for "startup". Starscapes have come to signal reach and omnipresence. What lasts in the space genre is a drawn measurement or a system, such as a pulsar's stacked pulses or a logotype, not a picture of space.
- **Contrast limits every option the same way** (EXECUTED, §4). On today's paper ground (`#F7F7F4`), Deep Field blue, red and green pass the 3:1 a graphic needs (6.55, 5.23, 4.63). Amber does not (2.03). So amber can never be the only carrier of meaning on light grounds. On the stage, all four lifted dots measure about 9.5.
- **Five candidates follow** (§6). **The blink** (recommended), **the chord**, **the barycentre**, **first light** (a dot resolving into a world) and **the thin blue line** (Pluto's layered haze). Each is drawn from round dots alone, with a still, a loader, a hero, a figure and a reduce state.
- **Why the blink** (INFERRED, §6.1). It is Pluto's origin, told as a search. It has a quiet one-colour form for product screens and a loud four-colour form for owned moments. It works as a diff, which software readers already understand. Its plates were literally glass, which bridges to the light brief's liquid glass.

## 1. What the first round taught

- **F1 the field:** a grid of dots that a search walks and lights. Blue is the query, yellow a permission check, green a file found, red a file withheld (READ, `device-field.svelte`).
- **F2 orbits:** each dot travels its own ellipse, then the four dock into the mark (READ, `device-orbits.svelte`). Its own listed cons: "Space imagery is a cliché in tech" and "Hard to make useful, easy to make decoration" (READ, `questions.ts`).
- **F3 quadrants, F4 streams, F5 the colon:** four coloured panels; dots sorting into a table; `::` as punctuation (READ, `questions.ts`).
- The owner: "None of F1 to F5 speaks to the owner. New options, themed on space or on Pluto itself" (READ, `decisions.md`, 2026-11-06).

INFERRED: four tests for the second round, drawn from that answer.

1. **Specific.** It rests on a fact about Pluto's system, not on space in general. A reader who looks it up finds it true.
2. **A verb.** The fact shows something the product does. Decoration is the failure mode F2 named.
3. **Dots.** It is built from round dots in the mark's colours, plus neutral hairlines at most. The owner's H1 keeps "round only for dot shapes".
4. **A still.** It reads with no motion. F4's weakness was that it needed motion.

## 2. Facts about Pluto and its system

Each fact is followed by what it could become (INFERRED).

### 2.1 The discovery was a search: the blink

- On 18 February 1930, Tombaugh, aged 22, was at the blink comparator at Lowell Observatory in Flagstaff, Arizona. He was working through two plates of the region near the star Delta Geminorum, taken days apart (READ, [The Planetary Society, The Discovery of a Planet, part 1](https://planetary.org/articles/pluto-discovery-1), read 2026-11-06).
- The plates were dated 23 and 29 January. A third, from 21 January, taken in a windstorm and thought "nearly worthless", confirmed the motion (READ, same source).
- The comparator switched between the plates "three times every second", so anything that changed position seemed to blink (READ, same source).
- In six days the object moved "only 3 millimeters" on the plates. That small a shift meant it lay "well beyond the orbit of Neptune" (READ, same source).
- Each plate was 14 by 17 inches and took a three-hour exposure. He blinked "tiny sliver by tiny sliver" through a microscope, nine hours a day, in half-hour spells with breaks so his attention would not lapse. By January 1930 he estimated he had scanned about a million and a half stars (READ, [The Planetary Society, part 4](https://www.planetary.org/articles/pluto-discovery-4), read 2026-11-06).
- Over his whole search, to 1943, he is said to have checked 90 million star images (READ, via search summary of a Wikipedia mirror and a [1996 Deseret News interview](https://www.deseret.com/1996/2/18/19225811/discovery-undimmed-by-years-of-stargazing/), read 2026-11-06; self-reported).
- The plates were glass. Lowell's published copies mark Pluto with arrows: "The arrows show Pluto's movement against the background stars" (READ, [Lowell Observatory collections, Pluto discovery plates](https://collectionslowellobservatory.omeka.net/items/show/1247), read 2026-11-06).

What it offers (INFERRED). The brand's founding fact is a search over captured data. The search method is a comparison of two states, which is a diff. The answer is one dot among very many that moved, and the published proof marks that dot with a small arrow. It needs nothing but dots and a mark.

### 2.2 Charon was found in the archive

- Charon was found on 22 June 1978 at the US Naval Observatory in Flagstaff, about six miles from Lowell. The astronomer was refining Pluto's orbit, not looking for a moon. He saw "a small bump on one side of Pluto". In other frames the bump moved from side to side over Pluto's 6.39-day rotation. An archive search found more images where Pluto looked elongated, and the angles matched a satellite's (READ, [NASA, Charon at 40](https://www.nasa.gov/missions/charon-at-40-four-decades-of-discovery-on-plutos-largest-moon/), read 2026-11-06).
- Plates from 1965 carried the note "Pluto image elongated", but were taken to be defective until 1978 (READ, via search summary of [Wikipedia, the discoverer's article](https://en.wikipedia.org/wiki/James_W._Christy), read 2026-11-06).

What it offers (INFERRED). A second proof for §2.1's idea. The answer was already in the archive; search found it. That is the platform's promise about enterprise data, told twice by Pluto's own history.

### 2.3 Pluto and Charon orbit a point outside both

- Charon's mass is about 12.2% of Pluto's; the mass ratio is 0.1218 to 1, against the Moon's 0.0123 to Earth. "The barycenter of the Plutonian system lies outside Pluto." The two are mutually locked: "each keeps the same face towards the other" (READ, [Wikipedia, Charon](https://en.wikipedia.org/wiki/Charon_(moon)), read 2026-11-06).
- Mean separation 19,596 km; Charon's period 6.38723 days; the barycentre lies "approximately 960 kilometres above Pluto's surface" (READ, [Wikipedia, Moons of Pluto](https://en.wikipedia.org/wiki/Moons_of_Pluto), read 2026-11-06).
- From those masses and that separation, the barycentre is 2,126 km from Pluto's centre: 938 km above a 1,188 km radius, or 1.79 Pluto radii from the centre (EXECUTED). The small gap to the page's 960 km comes from the inputs chosen (INFERRED).
- Charon "is about half the size of Pluto itself" (READ, [NASA, Pluto facts](https://science.nasa.gov/dwarf-planets/pluto/facts/), read 2026-11-06).
- New Horizons filmed the pair "actually in motion around each other" in 12 images over nearly one orbit (READ, [Universe Today](https://www.universetoday.com/articles/watch-pluto-and-charon-engage-in-their-orbital-dance), read 2026-11-06).

What it offers (INFERRED). A binary whose centre belongs to neither body. That pictures the kernel: the one gate every product turns around, which is neither an app nor the data.

### 2.4 The small moons keep a rhythm and tumble

- Five known moons: Charon, Styx, Nix, Kerberos and Hydra (READ, [NASA, Pluto facts](https://science.nasa.gov/dwarf-planets/pluto/facts/), read 2026-11-06). Nix and Hydra were found in 2005, Kerberos in 2011, Styx in 2012 (READ, [Wikipedia, Moons of Pluto](https://en.wikipedia.org/wiki/Moons_of_Pluto), read 2026-11-06).
- Their periods (20.2, 24.9, 32.2 and 38.2 days) sit near 3, 4, 5 and 6 times Charon's: a near-resonance of 1:3:4:5:6 (READ, same source).
- Nix and Hydra are in chaotic rotation, because the forces Pluto and Charon exert on them "change constantly" as the pair whirl around each other. They are "shaped like rugby balls" (READ, [ESA/Hubble, heic1512](https://esahubble.org/news/heic1512/), read 2026-11-06).

What it offers (INFERRED). A rhythm for motion (periods in 3:4:5:6), not a device. It could time a spring sequence in any of the candidates.

### 2.5 Occultations: the shape from many slices

- The 1988 occultation, recorded from the Kuiper Airborne Observatory, was the first unambiguous detection of Pluto's atmosphere. A 1985 event had only hinted at it (READ, via search summary of [the 1989 Icarus abstract](https://ui.adsabs.harvard.edu/abs/1989Icar...77..148E/abstract) and [ESO, eso0224](https://eso.org/public/news/eso0224), read 2026-11-06). The sources disagree on the date, 9 June or 9 July.
- From 1985 to 1990 Pluto and Charon passed in front of each other again and again. The first albedo maps (maps of how bright each patch of surface is) were built by inverting those light curves (READ, via search summary of [Buie, Tholen and Horne, 1992](https://ui.adsabs.harvard.edu/abs/1992Icar...97..211B/abstract), read 2026-11-06).
- On 17 July 2017, 24 teams in Argentina stood along a "picket fence" across the predicted shadow path of New Horizons' next target, about 4.5 km apart. Five recorded a brief drop in a star's light; the blackout was at most about 3 seconds (READ, [Sky & Telescope](https://skyandtelescope.org/astronomy-news/2014-mu69-fascinates-puzzles-observers/), read 2026-11-06).
- From those chords the target looked like "an extreme prolate spheroid", or a close or contact binary (READ, [NASA](https://www.nasa.gov/missions/new-horizons-next-target-just-got-a-lot-more-interesting), read 2026-11-06). The 2019 flyby showed a contact binary, Arrokoth: two lobes joined at a smooth neck, read as a gentle merger (READ, via search summary of NASA and the 2020 papers in *Science*, read 2026-11-06).

What it offers (INFERRED). Many observers, each seeing one line; most see nothing; together they give the shape, which a later visit confirms. That is federated search: several tools and sources each return a slice, and the shape of the answer is assembled from them. The ends of each chord are measured; the line between them is inferred. That is an honest way to draw data.

### 2.6 New Horizons: from a dot to a world

- In New Horizons' camera, "Pluto, which initially appeared as a small dot", grew into a system of objects. The first image showing the "heart" was taken on 7 July 2015. The sharpest images, at 77 to 85 m per pixel, were taken about 15 minutes before closest approach on 14 July (READ, via search summary of [Astronomy](https://www.astronomy.com/science/a-heart-from-pluto-as-flyby-begins/) and NASA's imaging blog, read 2026-11-06).
- High-priority data came home in the days around the flyby. The full 50-plus gigabits took 15 months; the last arrived on 25 October 2016, from over 3.1 billion miles (READ, [EarthSky](https://earthsky.org/space/new-horizons-returns-last-of-pluto-data/), read 2026-11-06).
- An ounce of Tombaugh's ashes flew aboard (READ, via search summary of [CNN](https://edition.cnn.com/2015/07/13/us/nasa-pluto-new-horizons-clyde-tombaugh-ashes), read 2026-11-06).

What it offers (INFERRED). Resolution as a story: one dot, then a few, then a world. And priority first, detail after: the order a good search returns results.

### 2.7 The heart and its convection cells

- Sputnik Planitia, about 1,400 by 1,200 km, is the western lobe of the heart-shaped Tombaugh Regio. Its nitrogen-ice surface is cut into polygons averaging about 33 km across. They are read as convection cells: ice rises at the centres and sinks at ridged troughs at the margins, where sublimation pits gather. The modelled flow is centimetres a year (READ, [Wikipedia, Sputnik Planitia](https://en.wikipedia.org/wiki/Sputnik_Planitia), read 2026-11-06).
- The basin sits near the point that always faces away from Charon, which may be no coincidence (READ, same source).

What it offers (INFERRED). A tiling of slow cells. It could picture scopes or tenants on one surface, but it does not draw from four dots, it barely moves, and it is unreadable at loader size.

### 2.8 The haze: about twenty blue layers

- Pluto's atmosphere holds "roughly 20 regularly spaced haze layers up to 150 km high" (READ, [Wikipedia, Pluto](https://en.wikipedia.org/wiki/Pluto), read 2026-11-06). A review gives about 10 km between layers, which merge and split around the limb (READ, via search summary of [a 2023 review on arXiv](https://arxiv.org/pdf/2311.17235), read 2026-11-06).
- The first colour images showed "that the hazes are blue", from sunlight scattered by "soot-like" tholin particles that "grow as they settle toward the surface" (READ, [NASA](https://www.nasa.gov/missions/new-horizons-finds-blue-skies-and-water-ice-on-pluto), read 2026-11-06).

What it offers (INFERRED). A one-colour device in Charon Blue: a dot with stacked hairline arcs at its edge. Governance as an atmosphere every product sits inside.

### 2.9 The orbit

- Eccentricity 0.2488; inclination 17.16°; period 247.94 years; perihelion 29.658 AU, aphelion 49.305 AU (READ, [Wikipedia, Pluto](https://en.wikipedia.org/wiki/Pluto), read 2026-11-06). From 1979 to 1999 "Pluto was actually closer to the Sun than Neptune" (READ, [NASA, Pluto facts](https://science.nasa.gov/dwarf-planets/pluto/facts/), read 2026-11-06).
- A 3:2 resonance and the tilt keep the two from ever meeting; they stay more than about 16 to 17 AU apart (READ, via search summary of [Astronomy](https://www.astronomy.com/science/ask-astro-will-pluto-and-neptune-ever-collide/), read 2026-11-06).

What it offers (INFERRED). Paths that cross but never collide: concurrency under one set of rules. It is still an orbit, the rejected idea, so it is set aside (§7).

### 2.10 The reclassification and the Kuiper belt

- On 24 August 2006 in Prague, the IAU defined a planet as a body that has "cleared the neighbourhood around its orbit". Pluto became a "dwarf planet" and the prototype of a new category of trans-Neptunian objects (READ, via search summary of [Universe Today](https://universetoday.com/525/plutos-out-of-the-planet-club) and the IAU resolution text, read 2026-11-06).
- Models put objects larger than 100 km between 30 and 50 AU at around 10⁵ (READ, via search summary of [a review on arXiv](https://arxiv.org/abs/astro-ph/0108428), read 2026-11-06; older estimates).

What it offers (INFERRED). "The first of a class" is a fair story, but a demotion is a joke readers already make. A belt of small bodies is a dot field, which is F1 again. Both are set aside (§7).

### 2.11 Light at Pluto

- At noon on Pluto the Sun is about 1/900 as bright as on Earth (READ, [NASA, Pluto facts](https://science.nasa.gov/dwarf-planets/pluto/facts/), read 2026-11-06). Earth's sky matches it when the Sun is about 1.5° below the horizon, a few minutes from sunrise or sunset (READ, via search summary of [Sky & Telescope](https://skyandtelescope.org/astronomy-news/pluto-time-061620155/), read 2026-11-06).

What it offers (INFERRED). A note for the separate light-direction research (a dim, warm noon), not a device.

## 3. Space in brands, briefly

Done badly.

- Stock libraries and logo blogs treat the rocket as the default startup sign: one calls it "a perfect fit for tech startups" that "screams innovation" (READ, via search summary of stock and blog pages, read 2026-11-06).
- An essay on tech advertising: "While in the early days of the internet, outer space imagery spoke of freedom and wonder, it now speaks of omnipresence." Tech imagery moved from one blue marble to "galaxies and starscapes" (READ, [Real Life, Star Power](https://reallifemag.com/star-power), read 2026-11-06).

Done well.

- **A drawn measurement.** A 1970 thesis plot from the Arecibo observatory showed "eighty successive periods" of the first pulsar, stacked. A program hid each trace's lower part behind the peak in front, which made the stack readable. It passed through *Scientific American* (1971) and an astronomy encyclopedia (1977) to a 1979 album cover (READ, [Scientific American](https://www.scientificamerican.com/blog/sa-visual/pop-culture-pulsar-origin-story-of-joy-division-s-unknown-pleasures-album-cover-video/), read 2026-11-06).
- **A system, not a picture.** NASA's 1975 "worm" logotype, retired in 1992, returned in 2020 as a secondary mark (READ, via search summary of [Wikipedia, NASA insignia](https://en.wikipedia.org/wiki/NASA_insignia), read 2026-11-06). Its graphics standards manual was reissued after a 2015 crowd-funding (READ, same).
- **A diagram that carries data.** The Pioneer plaque's pulsar map encodes 14 pulsars' periods in binary along radiating lines, with deliberate redundancy (READ, via search summary of [Wikipedia, Pioneer plaque](https://en.wikipedia.org/wiki/Pioneer_plaque), read 2026-11-06).

INFERRED: the rule for Pluto. Draw the method, never the scenery. No starfields as wallpaper, no rendered planets, no rockets, no swooshes, no rings for their own sake, no nebula gradients (blended colour is also Google's AI look, per `research/2026-11-01-how-definitive-brands-are-built.md` §1.5). Prior art is studied, never copied: no candidate traces a NASA or Lowell image; each is drawn from our own dots.

## 4. The constraints every candidate meets

From the owner's settled answers (READ, `decisions.md`, 2026-11-06) and our measurements.

- **C2.** A candidate needs a quiet form, neutral plus one accent, for product screens, and a loud four-colour form for owned moments only.
- **J4 and J2.** Dots may spring on their own. Lines, arcs and panels move only in answer to the visitor. INFERRED: a loader answers the visitor's own request, so a dot loader is in bounds; a line loader is weaker ground.
- **H1.** Round only for dot shapes; one 8 px case radius. So hairlines end square, and a plate or card uses the 8 px radius.
- **K3.** Display type up to 160 px: a hero can set the device beside a 160 px line.
- **N1.** The mark is kept as it is. A device may sit beside or around the mark, never inside it.
- **Contrast** (EXECUTED; Deep Field values from `palettes.ts`; grounds from `src/app.css`).

  | Dot | On paper `#F7F7F4` | On white `#FFFFFF` | On muted `#EAEAE7` | Lifted, on stage `#050608` |
  |---|---|---|---|---|
  | Blue `#2D48D4` | 6.55 | 7.03 | 5.83 | 9.55 (`#93B0FF`) |
  | Red `#C92035` | 5.23 | 5.61 | 4.66 | 9.55 (`#FF9491`) |
  | Amber `#F19E20` | **2.03** | **2.18** | **1.81** | 9.52 (`#F3A023`) |
  | Green `#008058` | 4.63 | 4.97 | 4.12 | 9.50 (`#60C498`) |

  A neutral speck at `#9AA0AD` measures 2.44 on paper and `#4A4F5C` measures 7.63 (EXECUTED). INFERRED: decorative specks need no contrast; any dot that carries meaning needs 3:1. Amber on light grounds needs an outline or a label, as the colour memo already found (READ, `research/2026-11-01-how-the-four-colours-are-tuned.md`).
- **Flashing.** WCAG 2.2 SC 2.3.1: nothing may flash "more than three times in any one second period", unless it is under the area threshold. A flash is a pair of opposing luminance changes of at least 10% (READ, [W3C, Understanding 2.3.1](https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html), read 2026-11-06). Tombaugh's comparator ran at three a second (§2.1). Ours must run far slower, and move a dot rather than switch a field's brightness.
- **Pause.** WCAG 2.2 SC 2.2.2: moving content that starts on its own, lasts more than five seconds and sits beside other content needs a way to pause it. A preload animation "can be considered essential" when its absence would make a page seem frozen (READ, [W3C, Understanding 2.2.2](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html), read 2026-11-06). INFERRED: loaders are fine; a hero that loops needs a pause control or must stop.

## 5. The candidates against the tests

INFERRED, scored strong (●), fair (◐) or weak (○).

| | Specific | Verb | Still | Loader | Hero | Figure | Quiet form | Cliché risk |
|---|---|---|---|---|---|---|---|---|
| The blink (§2.1–2.2) | ● | ● find | ● | ● | ● | ● diff | ● | ◐ starfield |
| The chord (§2.5) | ● | ● measure | ● | ◐ | ● | ● range | ◐ | ◐ IBM's bars |
| The barycentre (§2.3) | ● | ◐ govern | ◐ | ● | ◐ | ◐ | ● | ○ orbit |
| First light (§2.6) | ◐ | ● resolve | ● | ● | ● | ◐ | ◐ | ◐ halftone, F1 |
| The thin blue line (§2.8) | ● | ○ a state | ● | ◐ | ● | ◐ | ● | ◐ Wi-Fi rings |
| The heart's cells (§2.7) | ● | ○ | ◐ | ○ | ◐ | ○ | ◐ | ◐ generative |
| The belt (§2.10) | ◐ | ○ | ◐ | ◐ | ◐ | ◐ | ◐ | ● it is F1 |

## 6. Recommended device candidates

Each is drawn from round dots and, at most, square-ended neutral hairlines. "R" is the dot's radius. The mark's own proportion (dot .30 em, gap .08 em) is kept wherever the mark appears.

### 6.1 The blink (recommended)

**Idea.** Two records of the same field. Everything stays put except the one dot that changed. Search is finding it. Governance is knowing what changed and when.

**The fact.** Tombaugh's two glass plates, six days apart, blinked three times a second, and the one dot that moved 3 mm (§2.1). Charon, found later as a bump on archived plates (§2.2).

**Still.**

- A *plate*: a rectangle at 3:2 (`viewBox 0 0 360 240`), 8 px radius, a 1 px neutral edge, on paper. Inside, 30 to 60 neutral specks, round, radius 1 to 3, placed by a seeded random function: never a grid, which would be F1.
- One *found* dot, radius 6, in one brand colour. Beside it, its *ghost*: a 1 px ring of the same radius at the earlier position, offset by about 3% of the plate's width.
- Two short square-ended hairline ticks pointing at the found dot from two sides, as Lowell's copies mark Pluto with arrows (§2.1).
- *Quiet form* (product screens, one accent): the ghost ring and the found dot side by side, `○●`, about 1.5 em wide. It marks "changed", "new result" or "found here".
- *Loud form* (owned moments): four found dots on one plate, one in each colour, each with its ghost.

**Motion.**

- *Loader:* one small plate (48 × 32 px). The specks never change. The found dot springs (J4) between its ghost and its place, one move every 600 to 800 ms. INFERRED: that is at most 1.7 changes a second, of one dot of a few pixels, far under SC 2.3.1's area threshold, with no field-wide change in brightness.
- *Hero:* a plate fills the stage beside "Work runs on data." at up to 160 px. Each step of the visitor's scroll is one blink (J2). At each, one more dot is found and takes its colour. After the fourth, the four found dots spring into the mark beside the line: the owned four-colour moment.
- *Reduce:* the composed end: every found dot in place, every ghost ring showing where it was. The still is the reduce state, so nothing is lost.

**Figure.** A before-and-after figure. Specks are records; found dots are the records that changed between two versions, two permission states or two indexes. Caption in the textbook register, such as "Fig. 3. Two snapshots of one workspace. Three files changed." Tombaugh's own count gives a warm, human line for copy: one dot among a million and a half.

**Fit to the thesis.** Search is the act of finding the one that moved. Governance is the record of change between two states. Data is the plate: the discovery was made in data already captured. Charon adds that the answer was already in the archive.

**Fit to the light brief.** The plates were glass (§2.1). Two translucent panes over an off-white canvas, sliding together, bridge the early-computing machine to liquid glass (INFERRED; the light direction is researched separately).

**Pros.**

- Pluto's own origin, and it is true.
- A verb the product does: find.
- A diff is a picture software readers already know.
- Strong as a still; the reduce state is the still.
- A quiet one-accent form (C2) and a loud four-colour form.
- Only dots move, so J4 covers its loader.

**Cons.**

- A speck field can read as a generic starfield, or as F1's field. Keep it sparse and irregular; never light many specks at once.
- The story needs one caption the first time a reader meets it.
- "Blink" invites real blinking. Every build must move a dot, not toggle brightness, and stay well under three changes a second.
- An amber found dot on light grounds fails 3:1 (2.03). It needs a 1 px ink ring, or amber is never the only found dot.

### 6.2 The chord

**Idea.** Many vantage points each see one line. Most see nothing. The measured ends of the lines draw the shape of the answer.

**The fact.** The 2017 picket fence: 24 teams 4.5 km apart, five chords, a shape inferred before the flyby confirmed it (§2.5). The 1988 light curve that found Pluto's air.

**Still.**

- One dot of radius R drawn as 7 horizontal hairline chords at equal spacing, centred at heights (i + 0.5) / 7 of the diameter. Their lengths, as a multiple of R: 1.03, 1.64, 1.92, 2.00, 1.92, 1.64, 1.03 (EXECUTED).
- Each chord ends in two small solid dots, radius about R/12: the measured disappearance and reappearance. The chords end square (H1).
- Optional *fence posts*: one or two faint full-width hairlines above and below the shape, with no end dots. They are the observers who saw nothing.
- *Quiet form:* one dot in chords, in one colour, as a section marker or a "partial result" sign.
- *Loud form:* the four mark dots side by side at hero scale, each in its colour, each built of chords.
- Below 24 px the chords merge; the device becomes a plain dot.

**Motion.**

- *Loader:* the chords' end dots spring into place one row at a time, top to bottom (J4); each chord's line appears with its dots. After the seventh row, the solid dot fades in. Determinate when the steps are known.
- *Indeterminate loader:* a flat hairline light curve with a short dip that travels along it.
- *Hero:* each step of the visitor's scroll adds one chord across all four dots (J2).
- *Reduce:* the finished chord drawing, end dots in place.

**Figure.** Chords are range bars. The device grows into a dot-and-line range chart ("from–to" per row), a natural chart family for timings and spans. The rule "dots measured, lines inferred" becomes a house style for honest charts.

**Fit to the thesis.** Federated search: grep, glob, search and each product return one slice; the shape of the answer comes from all of them. It also says how many sources saw nothing, which is honest about partial results.

**Pros.**

- A specific, little-known, true method.
- Dots as data, lines as inference: an honest grammar for figures.
- Horizontal raster lines echo early computer screens, which the owner's light brief invokes (INFERRED).
- The stacked-pulse precedent (§3) shows drawn data can become an icon.

**Cons.**

- Horizontal stripes through a shape sit near IBM's 8-bar logo. The end dots and the empty fence posts must stay, or it reads as IBM.
- Occultation is unfamiliar; it needs a caption.
- The lines are not dots, so their motion leans on the "a loader answers the visitor" reading of J2.
- Hairlines must keep 3:1. On paper that rules out amber chords and asks for full-strength blue, red and green.

### 6.3 The barycentre

**Idea.** Two dots turn around a point that belongs to neither. The point is marked. Every product turns around the kernel, which is neither an app nor the data.

**The fact.** Pluto and Charon's centre of mass lies outside Pluto, about 1.8 Pluto radii from its centre (§2.3, EXECUTED).

**Still.**

- A large dot (R) and a small one (0.5 R, as Charon is about half Pluto's size).
- A small cross of two 1 px hairlines, 0.6 R long, at the barycentre, set 1.8 R from the large dot's centre, so it sits outside the large dot, between the two.
- The two dots on a line through the cross, the small one farther out. The true ratio puts the small dot about 15 R away; the drawing compresses that to 4 R and keeps the one truth that matters: the centre lies outside both.
- *Quiet form:* the pair and cross at 16 to 24 px, one colour plus neutral.
- *Loud form:* two pairs, blue with red and amber with green (the mark's two rows), turning around one shared cross.

**Motion.**

- *Loader:* the two dots revolve around the cross with one period and opposite phases. The large dot wobbles in a small circle; the small one sweeps a large one. Springs start and stop it (J4).
- *Hero:* two product tiles, each led by a dot, turn around a cross labelled "the kernel"; the visitor's scroll turns them (J2).
- *Reduce:* the still, with the cross shown.

**Figure.** Relationship figures: two parties and the point they share. Weighted pairs, where dot size is the weight and the cross falls where the weights balance.

**Fit to the thesis.** Governance. The gate is outside every product and every product turns around it. Integrations: two products locked face to face, as Pluto and Charon are.

**Pros.**

- True, specific and a little surprising; teachable in one line.
- A small, distinctive loader: the wobble.
- Uses two colours at a time, which suits C2.

**Cons.**

- It is orbital motion. The owner turned down "Orbits", and this may read as more of the same.
- It shows two dots more naturally than four.
- The cross can read as "add" or as a crosshair.
- Without the cross the idea vanishes, and the cross is the least "Pluto" part.

### 6.4 First light

**Idea.** A dot resolves into a world. The answer comes first, the detail after. The mark is the second step: Pluto at four pixels.

**The fact.** New Horizons first saw Pluto as a small dot, then a system, then the heart, then 77 m per pixel (§2.6). The high-priority data came first; the rest took 15 months.

**Still.**

- A *ladder* of four equal frames: one dot; the 2×2 mark; a 4×4 of dots; an 8×8 of dots. Each step halves the dot radius and doubles the count per side, so every step fills the same square.
- At 4×4 and 8×8, a subject emerges from dot size (a halftone, a pattern of dots whose size makes an image): a product glyph, a figure's number, a face.
- Circles only, never squares: a 2×2 of squares is Microsoft's.
- *Quiet form:* frames one and two only, in one colour, as a "summary first" sign.
- *Loud form:* the full ladder, with the four colours at the 2×2 step.

**Motion.**

- *Loader:* determinate by doubling: 1, 4, 16, 64 dots, each step a spring (J4). Each step can stand for one stage of a search: query, permission check, results, detail.
- *Hero:* a large image (product truth, people at work, an abstract figure; question M) as a dot halftone that resolves step by step as it loads or as the visitor scrolls.
- *Reduce:* the final frame, or the ladder as a still.

**Figure.** Small multiples (a row of the same chart at rising detail) and zoom figures: whole, then part, then record.

**Fit to the thesis.** Search answers coarse to fine. Agents read a summary before the record. The priority downlink is how the platform should return results.

**Pros.**

- It gives the kept mark a meaning: the first picture of a world.
- A determinate loader comes for free.
- Works with every sanctioned kind of imagery.

**Cons.**

- A dot halftone is a common generative look, and a resting 4×4 or 8×8 of dots is close to F1's field.
- The space link is invisible without a caption.
- A 4×4 grid of four colours drifts toward Google and Microsoft. Keep the four colours to the 2×2 step.

### 6.5 The thin blue line

**Idea.** Every world wears an atmosphere. Every product sits inside the same governed layer.

**The fact.** About 20 haze layers, about 10 km apart, up to 150 km and more, blue from scattered light, seen backlit at the limb (§2.8).

**Still.**

- A dot of radius R, neutral or one brand colour.
- Three to five concentric hairline arcs over 120° of its upper edge, spaced 0.15 R apart, in Charon Blue, each fainter outward. Arcs end square.
- *Quiet form:* a dot with one blue arc, as a "governed" or "inside the kernel" badge.
- *Loud form:* the hero below. The four colours have no natural role here; the owned moment is the mark set on the horizon.

**Motion.**

- *Loader:* arcs appear outward one at a time, then fade. They are not dots, so this leans on J2's loader reading.
- *Hero:* a huge horizon arc across the top of a stage or the off-white canvas, layered in blue, with the 160 px line beneath. Scroll lifts the horizon (J2).
- *Reduce:* the still.

**Figure.** Layer diagrams: storage, index, kernel and apps drawn as arcs over one world.

**Fit to the thesis.** Governance as an atmosphere: one layer, everywhere, not a wall around each app.

**Pros.**

- A striking, true and specifically Plutonian hero.
- Naturally one colour, so it is C2's quiet form by birth.
- Charon Blue is the one hue the colour research found clearly Pluto's own (READ, `research/2026-11-01-how-the-four-colours-are-tuned.md`).

**Cons.**

- Concentric arcs read as Wi-Fi, radar or broadcast, and sit near F2's rings.
- It shows a state, not an action; it is weak at "verb".
- The four colours have no role, so the owned moment must be supplied by the mark.

## 7. Set aside

INFERRED, with the reason for each.

- **The heart's cells** (§2.7): a tiling that does not grow from four dots, barely moves and is unreadable at loader size. It may serve as abstract imagery (M4), not as the device.
- **The heart's outline:** a photograph's silhouette and a valentine. Borrowed from NASA's image and cute rather than useful.
- **The 3:2 resonance** (§2.9) and the moons' tumble (§2.4): orbital motion again. Their 3:4:5:6 periods remain a fine timing source for any candidate's springs.
- **The belt** (§2.10): a field of small bodies is F1.
- **The reclassification** (§2.10): a demotion and a running joke.
- **The spacecraft:** hardware imagery is the rocket cliché (§3).
- **Tombaugh's ashes** (§2.6): a family's memorial, not the brand's to use.
- **Pluto Time** (§2.11): handed to the light-direction research.
- **Arrokoth's gentle merger** (§2.5): a fair picture of "merge" for one figure, but a lumpy shape, not dots.

## Limits

- **No candidate was drawn or run.** Every judgement of a still, a loader or a hero is reasoning. The specimens on `/identity` will be the test.
- **Several facts were seen only through a search summary**, each marked "via search summary". The 1988 occultation's date differs between sources (9 June or 9 July). The 90-million figure is self-reported. The New Horizons approach sequence and Arrokoth's shape rest on summaries of NASA pages and papers.
- **Contrast was measured on today's paper ground**, `#F7F7F4`. The new off-white canvas is being researched separately. Each ratio must be measured again on the canvas chosen.
- **Brand clash was not searched.** We did not search for marks or devices that already use a blink, chords, a barycentre cross, a dot halftone ladder or layered arcs. A clearance search is needed before the owner's pick becomes a specification.
- **The cliché evidence in §3 is light**: one essay, stock pages seen through a summary, and three precedents. It supports a rule of thumb, not a measurement.
- **The J2 reading for loaders is ours.** That a loader "answers the visitor" is INFERRED; the owner has not ruled on it. It matters for the chord and the thin blue line, whose loaders move lines, not dots.
- **Screen readers and browsers other than Chromium** were not considered, as the release's recorded limits already say.
