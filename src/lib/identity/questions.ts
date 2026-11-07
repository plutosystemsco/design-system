/**
 * The identity exhibit's content: every question the owner answers, and its
 * options. A research exhibit, not a registry item (decisions.md, "The
 * identity is commissioned, with options"). The boards, the index and the
 * compose page all read this one list, so an option's id (A1, B3, …) is the
 * same everywhere the owner sees it.
 */

export type Option = {
  /** The question's letter and the option's number: "B3". */
  id: string;
  name: string;
  /** One line: the idea. */
  idea: string;
  /** Two or three sentences: what it is and how it behaves. */
  body: string;
  pros: string[];
  cons: string[];
  /** What it learns from. Studied, never copied. */
  learns?: string;
  recommended?: boolean;
  /** The owner's pick (decisions.md, "The identity: the owner's first answers"). */
  chosen?: boolean;
  /** An option added after the owner's first answers. */
  round?: 2;
  /** Recommended in round one; round two's options replace it. */
  superseded?: boolean;
};

export type Question = {
  letter: string;
  slug: string;
  title: string;
  /** The question, as the owner answers it. */
  question: string;
  /** Why it matters for competing with Google. */
  why: string;
  options: Option[];
  /** Set aside by the owner, with the reason, instead of a pick. */
  deferred?: string;
};

export const QUESTIONS: Question[] = [
  {
    letter: "A",
    slug: "architecture",
    title: "Brand architecture",
    question: "How do Pluto and its products relate?",
    why: "Google's equity compounds because every product spends it: Maps, Docs and Gmail all say Google. Microsoft does the same with one master brand, Microsoft 365, over plain app names. The choice decides where recognition accumulates.",
    options: [
      {
        id: "A1",
        name: "Branded house",
        idea: "Every product is Pluto something: Pluto Docs, Pluto Sheets, Pluto Search.",
        body: "One name, one mark, one family of product icons. The product's noun is plain and descriptive; the brand does the remembering. The platform is Pluto Data and the kernel is Pluto Kernel.",
        pros: [
          "Every launch builds one brand.",
          "Plain nouns need no explaining.",
          "The closest match to how Google and Microsoft compete.",
        ],
        cons: [
          "A weak product weakens the whole brand.",
          "The open-source platform loses its own name in developer circles.",
        ],
        learns: "Google Workspace, Microsoft 365, Apple's app names.",
      },
      {
        id: "A2",
        name: "Master suite",
        idea: "One suite brand, Pluto Workspace, over apps named by plain nouns: Docs, Sheets, Mail.",
        body: "The suite carries the brand and the bill. Inside it, apps are just Docs, Sheets, Mail, Search, Agents, with their icons doing the distinguishing. Outside the suite, the apps are said with the suite: Pluto Workspace Docs. The platform sits outside the suite as Pluto Data.",
        pros: [
          "One thing to buy, one thing to remember.",
          "App names stay short in daily use.",
        ],
        cons: [
          "Two levels of name (Pluto, Workspace) before the noun.",
          "Plain nouns cannot be protected as marks.",
        ],
        learns: "Microsoft 365 over Word and Excel.",
      },
      {
        id: "A3",
        name: "Endorsed brands",
        idea: 'Each product has its own name and logo; Pluto signs it: "A Pluto Systems product".',
        body: "Today's `v0.8.0` model. A product can be born with its own personality and audience. Pluto appears in the footer and on the about page, with the four dots beside the words.",
        pros: [
          "A product can take risks without staining the parent.",
          "Already built in the shell.",
        ],
        cons: [
          "Every product starts at zero recognition.",
          "Far from how Google competes: the parent is a footnote.",
        ],
        learns: "Courtyard by Marriott; Atlassian's attribution logos.",
      },
      {
        id: "A4",
        chosen: true,
        name: "Open platform, branded suite",
        idea: "The platform keeps its open-source name, vfs; the suite is a branded house that runs on it.",
        body: 'Developers meet vfs, an open project with its own repository and its own plain name. Everyone else meets Pluto Docs, Pluto Sheets and Pluto Search. The kernel is Pluto Kernel, the one gate. The line "runs on vfs" ties them on technical pages.',
        pros: [
          "Matches the business: an open foundation under a product suite.",
          "Developer trust in the open project is not spent on marketing.",
          "The suite still compounds one brand.",
        ],
        cons: [
          "Two names to keep in sync in technical copy.",
          "Needs a rule for when a page says vfs and when it says Pluto Data.",
        ],
        learns: "Chromium under Chrome; Kubernetes under GKE.",
        recommended: true,
      },
    ],
  },
  {
    letter: "B",
    slug: "palette",
    title: "The four colours",
    question: "Which blue, red, yellow and green are Pluto's?",
    why: "Google is four colours. So is Microsoft, and Slack, and eBay. Measured, today's Tombaugh Red is ΔE 2.7 from Google's red: the same colour to most eyes (brands memo). Pluto's four have to be recognisably its own at a glance, hold up on a dark stage and on paper, and carry text where text must sit on them.",
    // The values are the colour memo's measured candidates (palettes.ts);
    // these records carry the words.
    options: [
      {
        id: "B1",
        name: "Charon, kept",
        idea: "Today's four, measured as they stand.",
        body: "Charon Blue, Tombaugh Red, Sputnik Amber, Hydra Green. Every pair passes, but the red is ΔE 2.3 from Google's, the amber 4.0 and the green 3.4: side by side, most people cannot tell them apart.",
        pros: [
          "No change to anything shipped.",
          "Every contrast pair already passes.",
        ],
        cons: [
          "Three of the four are, to the eye, Google's colours.",
          "Only Charon Blue is clearly Pluto's (ΔE 12.2 from Google's blue).",
        ],
        learns: "The design book §03.",
      },
      {
        id: "B2",
        name: "Signal",
        idea: "Bright and pure: each hue a few degrees cooler, blue, red and green in one lightness band.",
        body: "The most saturated set. An electric blue, a crimson red, a lemon yellow, a jade green. Loud on a billboard and on a stage.",
        pros: [
          "The most vivid; reads from across a room.",
          "At least ΔE 6.1 from Google, 6.9 from Microsoft.",
        ],
        cons: [
          "The lemon yellow is the purest primary of the five, so the likeliest to look childish.",
          "Yellow on paper is 1.35:1: it needs an outline wherever it marks data.",
        ],
      },
      {
        id: "B3",
        chosen: true,
        name: "Deep Field",
        idea: "Deeper, richer hues on a darker ink and stage: cobalt, carmine, saffron, emerald.",
        body: "Every hue moves deeper, and the ink and stage go darker with them. The four take white button text directly. The farthest of the five from both Google and Microsoft.",
        pros: [
          "At least ΔE 7.8 from Google and 7.3 from Microsoft in every hue.",
          "Rich and serious: a suite for work, not a toy.",
          "White text sits on every mark colour (7.02, 5.61, 4.96).",
        ],
        cons: [
          "A darker ink visibly changes dark surfaces in installed apps.",
          "Less playful than Google's brights, by design.",
        ],
        recommended: true,
      },
      {
        id: "B4",
        name: "Warm Paper",
        idea: "Cream paper, warm ink, and each hue warmer: an azure, a vermilion, a marigold, a fern.",
        body: "The warmest set, leaning on the paper ground. The red turns toward orange and the green toward olive, which pulls the four far from every competitor.",
        pros: [
          "Warm and human; nothing else in tech looks like it.",
          "At least ΔE 7.2 from Google.",
        ],
        cons: [
          'A vermilion red reads as orange: "red" is only nominal.',
          "Cream paper changes every light surface.",
        ],
      },
      {
        id: "B5",
        name: "Spectral",
        idea: "All four at one perceived lightness, so no dot shouts louder than another.",
        body: "Tuned in OKLCH to lightness 0.58. The same four dots work on every ground, paper to stage, and pass every graphic check. The yellow becomes a gold to get there.",
        pros: [
          "The only set where all 20 graphic checks pass: one mark for every ground.",
          "Perfectly balanced; text over a four-colour band stays legible.",
        ],
        cons: [
          "The yellow is a gold, and some will not read it as yellow.",
          "Red and gold sit only ΔE 3.6 apart for a red-green colour-blind reader.",
        ],
      },
    ],
  },
  {
    letter: "C",
    slug: "colour-behaviour",
    title: "How colour behaves",
    question: "How much colour does a Pluto surface spend, and where?",
    why: "The colours alone do not make the brand; their behaviour does. Google's UI is mostly white with four-colour moments. Microsoft's posters are fields of one colour. The choice sets how loud a page can get.",
    options: [
      {
        id: "C1",
        name: "Paper first, one accent",
        idea: "Paper and ink fill 88% of every surface; one colour per surface; four only in the mark.",
        body: "The design book's colour law, kept. Quiet, exact, trustworthy. The brand's colour moment is the mark itself and data figures.",
        pros: ["Already built and checked.", "Never garish; ages well."],
        cons: [
          "Reads as a well-made docs site, not a consumer brand.",
          "Recognition rests on the mark alone.",
        ],
        learns: "Braun's single accent; the design book §03.",
      },
      {
        id: "C2",
        chosen: true,
        name: "Four-colour moments",
        idea: "Neutral surfaces, with the four colours together in a few signature moments.",
        body: "Product screens stay neutral and one-accent. The four colours appear together, on purpose, in the device, in loaders and progress, in product icons, on launch heroes and in data figures. Each moment is small and owned.",
        pros: [
          "Recognisable from a fragment: four colours in Pluto's order.",
          "Product screens stay calm.",
          "Scales from an icon to a billboard.",
        ],
        cons: [
          "Needs a written list of sanctioned moments, or it sprawls.",
          "Sits close to Google's own behaviour; the device must be Pluto's.",
        ],
        learns: "How Google spends its four colours on a white field.",
        recommended: true,
      },
      {
        id: "C3",
        name: "Colour fields",
        idea: "Big flat fields of one brand colour per section; type sits on colour.",
        body: "A launch page moves through a blue section, an ink section, a yellow proof band. Each field is one colour, never a gradient. Text on the fields uses the text-safe tones.",
        pros: [
          "The loudest, most poster-like option.",
          "Instantly ownable in advertising.",
        ],
        cons: [
          "Hard to keep accessible: yellow and green fields need ink text.",
          "Product screens cannot share the look.",
        ],
        learns: "Swiss poster practice; Microsoft's colour-field campaigns.",
      },
      {
        id: "C4",
        name: "Ink stage first",
        idea: "Dark is the brand's home; colour arrives as light on a near-black stage.",
        body: "Hero sections, launches and the home page live on the stage ground. The four colours appear as lit objects and light sources, never as fields. Paper is for reading and for apps.",
        pros: [
          "Dramatic and premium; code and data glow.",
          "The product-site lab already chose a stage hero.",
        ],
        cons: [
          "Many developer brands live on black; hard to own.",
          "Splits the brand into a dark marketing face and a light product face.",
        ],
        learns: "Theatre lighting; planetarium shows.",
      },
    ],
  },
  {
    letter: "D",
    slug: "typeface",
    title: "Typeface",
    question: "What does Pluto's type look like?",
    why: "Google Sans and Segoe are owned voices: you know the brand from a single line of text. Today Pluto borrows IBM's, Vercel's and JetBrains' faces.",
    options: [
      {
        id: "D1",
        chosen: true,
        name: "Kept: Plex, Geist, JetBrains",
        idea: "IBM Plex Sans headings, Geist body, JetBrains Mono labels and code.",
        body: "Today's stack. Engineered, legible, free. The heading face is a named tribute to IBM.",
        pros: [
          "No change; every page already set.",
          "Excellent for dense product screens.",
        ],
        cons: [
          "Three borrowed voices; none says Pluto.",
          "Geist is Vercel's signature face.",
        ],
        learns: "The design book §04.",
      },
      {
        id: "D2",
        name: "One lineage: Plex",
        idea: "IBM Plex Sans for everything, IBM Plex Mono for code.",
        body: "One family, one hand, from display to code. Coherent and serious. The IBM tribute becomes the whole voice.",
        pros: [
          "The most coherent option.",
          "Plex has every weight and script.",
        ],
        cons: [
          "Reads as IBM, and IBM uses it everywhere.",
          "Less warmth than a humanist body face.",
        ],
        learns: "IBM's own system.",
      },
      {
        id: "D3",
        name: "Round, kin to the dots",
        idea: "A friendly geometric sans whose round dots rhyme with the mark: Figtree, with JetBrains Mono.",
        body: "Circles in the letters, circles in the mark. Approachable at billboard size, clean in an app. The nearest open-licence answer to Google Sans's friendliness.",
        pros: [
          "The type and the mark look like one system.",
          "Warm enough for a consumer suite.",
        ],
        cons: [
          "Geometric sans faces are common in consumer tech.",
          "Figtree is free for anyone, so it is never owned.",
        ],
        learns: "Geometric sans tradition: Futura to Product Sans.",
      },
      {
        id: "D4",
        name: "A face with character",
        idea: "A display face with a distinct hand, Funnel Display, over Funnel Sans and Geist Mono.",
        body: "A display cut with real personality for heroes, and its text sibling for reading. Few brands use it yet, so it reads as a choice.",
        pros: [
          "Distinctive at display sizes.",
          "A matched display and text pair.",
        ],
        cons: [
          "Still open licence: anyone can adopt it.",
          "Character can date faster than neutrality.",
        ],
        learns: "Studio display faces with text companions.",
      },
      {
        id: "D5",
        name: "Commission Pluto Sans",
        idea: "Draw an owned family: a grotesk whose punctuation, i and j dots are the mark's dots.",
        body: "The way Google and Microsoft own their voice. A brief, not a font yet: a sans with circular dots at the mark's proportion, a mono sibling for code, variable weight and optical size. Shown here with Instrument Sans as a stand-in; its dots are square, so the stand-in shows the proportions, not the round-dot idea.",
        pros: [
          "The only option Pluto would own outright.",
          "Every line of text becomes brand.",
        ],
        cons: [
          "Months of work and a type foundry's fee.",
          "Needs a stand-in face until it ships.",
        ],
        learns: "Google Sans (2015–), Segoe (2004–), IBM Plex (2017).",
        recommended: true,
      },
    ],
  },
  {
    letter: "E",
    slug: "wordmark",
    title: "Wordmark and lockup",
    question: "How is the name written beside the mark?",
    why: "The wordmark is the brand's signature. Google's is set in its own face; Microsoft's sits the four squares to the left of a grey word. Pluto's lifts the mark like a colon.",
    options: [
      {
        id: "E1",
        name: "Risen colon",
        idea: 'Lowercase "pluto", bold, the mark risen beside it at .38 em, like a trailing colon.',
        body: "Today's lockup. The mark reads as punctuation, the word as a statement. Tuned to the hundredth of an em.",
        pros: [
          "Already specified and built.",
          "Unusual: no one else lifts a mark this way.",
        ],
        cons: [
          "The lift is subtle at small sizes.",
          "Lowercase bold can read informal.",
        ],
        learns: "The design book §02.",
      },
      {
        id: "E2",
        name: "Leading mark",
        idea: 'The mark first, centred on the x-height, then "pluto" in medium weight.',
        body: "The mark leads like an app icon, so the lockup and the icon read as one. Medium weight is calmer and more corporate.",
        pros: [
          "Works as an app header and a launcher.",
          "Mark and icon are visibly the same.",
        ],
        cons: [
          "The most conventional layout.",
          "Close to how Microsoft sets its lockup.",
        ],
      },
      {
        id: "E3",
        name: "Capitalised name",
        idea: '"Pluto" with a capital, semibold, the mark after it at cap height.',
        body: "A proper noun, like a company name. The capital P gives the word a strong start; the mark closes it.",
        pros: [
          "Reads as an institution.",
          "Strong in a sentence and on a sign.",
        ],
        cons: [
          "Loses the lowercase warmth.",
          "A capital and four dots compete at small sizes.",
        ],
      },
      {
        id: "E4",
        name: "Two-word stack",
        idea: '"pluto" over "systems", the mark beside both lines.',
        body: "A corporate lockup for legal, investor and recruiting surfaces. The everyday lockup stays one word.",
        pros: ["Names the company in full.", "Good for formal surfaces."],
        cons: ["A second lockup to maintain.", "Too formal for products."],
      },
      {
        id: "E5",
        round: 2,
        name: "Risen colon, closer",
        idea: "E1 as it is, with the mark drawn in to the word: the space between them falls from .16 em to .10 em, E3's.",
        body: "The smallest change. The mark keeps its size and its rise above the ascender; it simply sits closer, so word and mark read as one shape.",
        pros: ["Every other measure of E1 holds.", "One number changes."],
        cons: ["The mark still rises well above the letters."],
      },
      {
        id: "E6",
        chosen: true,
        round: 2,
        name: "Risen colon, closer and lower",
        idea: "The mark at 87% of E1's size, .10 em from the word, its top .16 em above the ascender.",
        body: "Halfway to E3. The mark still rises, so it reads as a colon after the word, but it no longer towers over the l and the t.",
        pros: [
          "Keeps the rise the owner liked.",
          "Sits inside the word's silhouette more than E1.",
        ],
        cons: ["A third set of numbers to tune at favicon sizes."],
        recommended: true,
      },
      {
        id: "E7",
        round: 2,
        name: "Risen colon, on the ascender",
        idea: "E3's mark (73% of E1) and E3's spacing, its top on the ascender of the l, with lowercase \"pluto\".",
        body: "The capitalised lockup's fit with the lowercase name. The mark spans from just above the baseline to the top of the l.",
        pros: [
          "The most compact lockup.",
          "Closest to what the owner pointed to in E3.",
        ],
        cons: ["The rise is slight; the mark reads less as a colon."],
      },
    ],
  },
  {
    letter: "F",
    slug: "device",
    deferred:
      "Left out for now (owner, 2026-11-06): no device until a need names one.",
    title: "Signature device",
    question: "What grows out of the four dots?",
    why: "A brand needs one graphic idea that flexes from a loader to a billboard: Google's four-colour dots that bounce and morph, Mastercard's circles, IBM's bars. The mark is fixed; the device is how it lives.",
    options: [
      {
        id: "F1",
        superseded: true,
        name: "The field",
        idea: "A grid of small dots; data lights them in the four colours. Every dot a datum.",
        body: "At rest, a quiet dot matrix behind a section. In use, dots light as a search runs, a file indexes, a permission is checked. It literally shows work running on data.",
        pros: [
          "Says the thesis without words.",
          "Scales from a texture to a hero animation.",
          "Easy to make interactive and accessible.",
        ],
        cons: [
          "Dot grids are common as backgrounds; the lighting must be the signature.",
        ],
        recommended: true,
      },
      {
        id: "F2",
        name: "Orbits",
        idea: "Rings and paths: the dots travel orbits before they dock into the mark.",
        body: "Pluto and Charon orbit each other. The entrance already flies the dots in; the device extends that into rings that frame products and figures.",
        pros: [
          "Grows from the existing entrance.",
          "A name story: Pluto, Charon, orbit.",
        ],
        cons: [
          "Space imagery is a cliché in tech.",
          "Hard to make useful, easy to make decoration.",
        ],
      },
      {
        id: "F3",
        name: "Quadrants",
        idea: "The 2×2 becomes a layout: four panels, one colour each, for sections, icons and tiles.",
        body: "Any square can be cut into four. Product icons, feature grids and posters all use the mark's quadrant structure, with the colours in the mark's order (drawn here in question N's recommended order).",
        pros: ["Strong and graphic.", "Gives product icons a family."],
        cons: [
          "Four coloured squares sit very close to Microsoft's logo.",
          "Rigid in layouts that are not square.",
        ],
      },
      {
        id: "F4",
        name: "Streams",
        idea: "Dots flow into rows and columns: unstructured content becoming structured data.",
        body: "Scattered dots stream, sort and settle into a table. It pictures the platform: tokenizable content made searchable and governed.",
        pros: [
          "The most literal picture of the product.",
          "Great for explainers and launches.",
        ],
        cons: [
          "Motion-dependent; weak as a still.",
          "Complex to draw well everywhere.",
        ],
      },
      {
        id: "F5",
        name: "The colon",
        idea: '"::" as punctuation in type: the mark divides ideas in headlines, crumbs and lists.',
        body: '"Work :: runs on data." The mark becomes a typographic divider, so every page carries it without a logo.',
        pros: [
          "Cheap to use anywhere text goes.",
          "Ties the mark to language.",
        ],
        cons: [
          "Reads as code syntax to developers, which the design book banned.",
          "Can turn into a gimmick.",
        ],
      },
      {
        id: "F6",
        round: 2,
        name: "The blink",
        idea: "Two records of one field. Everything stays put but the one dot that moved. Pluto was found this way, in 1930.",
        body: "A plate of quiet specks and one found dot in a brand colour, a hollow ring where it used to be. Quiet form: the ring and the dot, side by side, marking what changed or what was found. Loud form: four found dots, one per colour, that spring into the mark. Search is finding the one that moved; governance is knowing what changed between two states.",
        pros: [
          "Pluto's own origin, and true: Tombaugh blinked two glass plates and saw one dot move.",
          "A verb the product does: find.",
          "A diff is a picture software readers already know.",
          "Only dots move, so the springs (J4) cover its loader.",
        ],
        cons: [
          "A speck field can read as a starfield; it must stay sparse and irregular.",
          "The story needs a caption the first time a reader meets it.",
          "It moves a dot; it never flashes.",
        ],
        learns:
          "The 1930 discovery plates; Charon found on archived plates, 1978.",
        recommended: true,
      },
      {
        id: "F7",
        round: 2,
        name: "The chord",
        idea: "Many vantage points each see one line; their measured ends draw the shape of the answer.",
        body: "In 2017, two dozen observer teams stood across a star's predicted shadow; the few who saw it dip drew the object's shape in chords. The device draws a dot as seven hairline chords, each ending in two small dots: dots measured, lines inferred. It grows into range charts.",
        pros: [
          "A specific, little-known, true method.",
          "An honest grammar for figures: dots measured, lines inferred.",
          "Pictures federated search: each source returns one slice.",
        ],
        cons: [
          "Horizontal stripes through a shape sit near IBM's eight-bar logo; the end dots must stay.",
          "Lines move, not dots, so its loader leans on J2.",
        ],
        learns: "Stellar occultations; the 2017 picket fence.",
      },
      {
        id: "F8",
        round: 2,
        name: "The barycentre",
        idea: "Two dots turn around a point that belongs to neither, marked by a small cross.",
        body: "Pluto and Charon orbit a centre that lies outside Pluto. The device draws a large dot and a half-size one around a cross between them. Every product turns around the kernel, which is neither an app nor the data.",
        pros: [
          "True and a little surprising; teachable in one line.",
          "A small, distinctive loader: the wobble.",
          "Two colours at a time, which suits C2.",
        ],
        cons: [
          "It is orbital motion, close to the rejected F2.",
          "Two dots come more naturally than four.",
          "The cross can read as add or as a crosshair.",
        ],
        learns: "The Pluto–Charon binary.",
      },
      {
        id: "F9",
        round: 2,
        name: "First light",
        idea: "A dot resolves into a world: one dot, then the mark, then 4×4, then 8×8.",
        body: "New Horizons first saw Pluto as a dot, then as a system, then the heart. The device is a ladder that doubles its detail each step, so the mark becomes the second picture of a world. It is a determinate loader for free: query, permission check, results, detail.",
        pros: [
          "Gives the kept mark a meaning: Pluto at four pixels.",
          "A determinate loader comes for free.",
          "Works with every kind of imagery chosen (M1 to M4).",
        ],
        cons: [
          "A dot halftone is a common generative look, and close to F1.",
          "The space link is invisible without a caption.",
        ],
        learns: "New Horizons' approach images, 2015.",
      },
      {
        id: "F10",
        round: 2,
        name: "The thin blue line",
        idea: "Every world wears an atmosphere: a dot with stacked Charon Blue arcs on its upper edge.",
        body: "Pluto has about twenty layers of blue haze, seen backlit at its edge. The device draws a dot with three to five fine blue arcs; its hero is a vast horizon. Governance as an atmosphere: one layer, everywhere, not a wall around each app.",
        pros: ["A natural one-colour form for C2.", "A striking horizon hero."],
        cons: [
          "Can read as Wi-Fi or radar rings.",
          "Shows a state, not an action.",
        ],
        learns: "New Horizons' backlit haze, 2015.",
      },
    ],
  },
  {
    letter: "G",
    slug: "product-icons",
    title: "Product icons",
    question: "How does each app look in a launcher and a dock?",
    why: "Google's 2020 Workspace icons and Microsoft's Fluent Office icons are how most people meet those brands every day. A suite needs icons that are clearly one family and clearly different apps.",
    options: [
      {
        id: "G1",
        superseded: true,
        name: "The mark's cell",
        idea: "Each icon is the 2×2; one dot becomes the app's glyph in that dot's colour.",
        body: "Docs and Slides take the blue dot, Mail and Chat the red, Calendar and Search the yellow, Sheets and Files the green. The other three dots stay as quiet ink. Eight apps, two per colour.",
        pros: [
          "Every icon contains the mark: unmistakably Pluto.",
          "A clear system for new apps.",
        ],
        cons: [
          "Only four colours for many apps; the glyph does the work.",
          "Small glyphs at 16 px.",
        ],
        recommended: true,
      },
      {
        id: "G2",
        name: "One colour per tile",
        idea: "A rounded tile in one brand colour with a white glyph (ink on yellow, where white fails).",
        body: "Simple, legible, conventional. The tile's colour is the app; the glyph says what it does.",
        pros: ["Instantly legible.", "Easy to produce."],
        cons: ["Generic: many suites do this.", "Says nothing about Pluto."],
        learns: "Microsoft's pre-2019 Office tiles.",
      },
      {
        id: "G3",
        name: "Four-colour glyphs",
        idea: "Every icon is drawn in all four colours.",
        body: "Each glyph is cut into four coloured parts. Shown here to rule it out: it is Google's 2020 approach, and copying it would make Pluto look like a Google product.",
        pros: ["Very recognisable as a family."],
        cons: ["Reads as Google.", "Apps blur together at small sizes."],
        learns: "Google Workspace icons, 2020. Shown as a warning.",
      },
      {
        id: "G4",
        name: "Ink glyph, one dot",
        idea: "A monochrome glyph on ink or paper with one coloured dot as its accent.",
        body: "Quiet and premium. The coloured dot sits where a notification badge would, in the app's colour.",
        pros: [
          "Calm in a dock full of colour.",
          "Elegant in monochrome contexts.",
        ],
        cons: [
          "Low recognition at a glance.",
          "The dot reads as a notification.",
        ],
      },
      {
        id: "G5",
        chosen: true,
        round: 2,
        name: "Flat colour tile",
        idea: "An 8 px tile in the app's colour with a white Phosphor glyph (ink on yellow).",
        body: "Two apps per colour: Docs and Search blue, Sheets and Chat green, Slides and Files yellow, Mail and Calendar red. Each launcher row shows every colour once. The fastest to read.",
        pros: [
          "Tells eight apps apart by colour at 16 px.",
          "Simplest to draw.",
        ],
        cons: ["Round one's G2 again: nothing in it is Pluto's."],
        learns: "Microsoft's 2018 colour per app.",
      },
      {
        id: "G6",
        round: 2,
        name: "Paper tile, duotone glyph",
        idea: "A white tile with a hairline edge; the glyph's line in ink, its tone in the app's colour.",
        body: "The calmest option, closest to a neutral product screen. Colour comes only from Phosphor's duotone layer.",
        pros: ["Calm, and at home on a neutral screen."],
        cons: [
          "Duotone covers 2% of Docs' glyph and 46% of Chat's: some apps look grey.",
          "Reads as white squares at 16 px.",
        ],
      },
      {
        id: "G7",
        round: 2,
        name: "Paper key, colour skirt",
        idea: "An off-white key cap with an ink glyph; only the key's skirt takes the app's colour.",
        body: "The chunky key itself: a white face over a coloured lower edge. Every app carries the same amount of colour.",
        pros: [
          "The off-white key of the brief.",
          "Neutral enough for any screen.",
        ],
        cons: [
          "At 32 px the colour is a 3 px line; apps are told apart mostly by glyph.",
        ],
      },
      {
        id: "G8",
        round: 2,
        name: "Colour key",
        idea: "A key cap whose face is the app's colour and whose skirt is two steps darker; white glyph, ink on yellow.",
        body: "Coloured keys on the off-white canvas: the brief's own picture. At 16 px the skirt drops and the face alone reads by colour. A mono form (white face, grey skirt, ink glyph) serves surfaces that must stay neutral.",
        pros: [
          "Reads by colour at 16 px.",
          "The skirt is the owned trait a flat tile lacks.",
          "Three flat layers, so glass can be added later.",
          "Phosphor used exactly as shipped.",
        ],
        cons: [
          "Close to a flat tile at the smallest size.",
          "Yellow carries an ink glyph, the others white.",
        ],
        recommended: true,
      },
      {
        id: "G9",
        round: 2,
        name: "Paper key, duotone glyph",
        idea: "An off-white key with a grey skirt; the glyph's tone in the app's colour.",
        body: "The most literal off-white chunky key. Every key is the same, so the family reads as one keyboard.",
        pros: ["The family reads as one keyboard."],
        cons: ["Duotone's uneven colour, as G6."],
      },
    ],
  },
  {
    letter: "H",
    slug: "shape",
    title: "Shape",
    question: "What shape is Pluto?",
    why: "Shape is felt before colour is read. Material 3 Expressive made shape a brand lever; IBM's square corners are part of its voice.",
    options: [
      {
        id: "H1",
        chosen: true,
        name: "Exact",
        idea: "One 8 px case radius for everything; round only for dot shapes.",
        body: "The design book's two radii. Precise and calm, like a well-made instrument.",
        pros: ["Already built.", "Dense screens look orderly."],
        cons: ["Neutral; adds little identity."],
      },
      {
        id: "H2",
        name: "Round actions",
        idea: "Pill buttons and chips; 14 px cards; 8 px inputs.",
        body: "What the product-site lab used. Actions are dot-derived (fully round), containers soften, fields stay exact.",
        pros: [
          "Actions feel touchable and friendly.",
          "Links shape to the round mark.",
        ],
        cons: [
          "Three radii to govern.",
          "Pills are everywhere in 2026 web design.",
        ],
        recommended: true,
      },
      {
        id: "H3",
        name: "Soft",
        idea: "Large radii everywhere: pills, 24 px cards, round icons.",
        body: "The friendliest and most consumer option. Everything echoes the dots.",
        pros: ["Warm and approachable.", "Reads as a consumer suite."],
        cons: ["Wastes space in dense tables.", "Close to Material's look."],
      },
      {
        id: "H4",
        name: "Square",
        idea: "2 px radii, crisp edges; round only in the mark.",
        body: "The round mark becomes the only round thing on the page, so it stands out.",
        pros: ["The mark gets maximum contrast.", "Technical, serious."],
        cons: ["Cold for a workspace suite.", "Reads as IBM."],
      },
    ],
  },
  {
    letter: "I",
    slug: "light",
    title: "Light and depth",
    question: "How is an object lit on a stage?",
    why: "The finished sites (Stripe, Vercel, Cloudflare) all have a way of lighting their product. Today the design book bans gradients and shadows.",
    options: [
      {
        id: "I1",
        name: "Flat",
        idea: "No light: hairlines and fills only, even on the stage; a run answers with a border change.",
        body: "Honest pixels. A stage is just a darker ground; cards are outlined.",
        pros: ["Fast, accessible, printable.", "Unusual among competitors."],
        cons: ["The stage looks unfinished next to competitors."],
      },
      {
        id: "I2",
        name: "Bloom and rim",
        idea: "A soft cool bloom behind the object; a lit rim on its edge.",
        body: "The lab's light. One cool white-blue source, one object lit. Light brightens when the visitor acts.",
        pros: ["Premium and calm.", "Already proven in the lab."],
        cons: ["Cool white light is common on dark sites."],
      },
      {
        id: "I3",
        superseded: true,
        name: "Four lights",
        idea: "The four brand colours are the light sources, from the four corners, in Pluto's order.",
        body: "Blue from top-left, red top-right, yellow bottom-left, green bottom-right: the mark's order, as light. Faint at rest; each brightens when its kind of work happens.",
        pros: [
          "Owned: no one else lights with these four in this order.",
          "Ties light to the mark and to state.",
        ],
        cons: [
          "Blended four-colour light is now Google's AI look (the gradient G, Gemini); the lights must stay apart, never mixed into one gradient.",
          "Each light must stay faint for text contrast.",
        ],
        recommended: true,
      },
      {
        id: "I4",
        name: "Glass",
        idea: "Frosted translucent panels over colour, with grain.",
        body: "Depth from layering and blur. Shown for completeness.",
        pros: ["Rich, tactile depth."],
        cons: ["Fails contrast easily.", "Costly to render.", "Very 2021."],
      },
      {
        id: "I5",
        chosen: true,
        round: 2,
        name: "Platinum, flat",
        idea: "The warm case and nothing else: flat objects on an off-white canvas, colour as flat fields.",
        body: "The canvas warms from Deep Field's cool #F4F6F8 to #F3F0E8; dark becomes warm graphite. Hairlines, no shadows, no glass. The four colours appear as flat fields in owned moments.",
        pros: [
          "Fastest; prints; every pair measured.",
          "The early machine's flat, honest case.",
        ],
        cons: ["No depth and no glass: it does not reach the present."],
        learns:
          "Beige-era computer cases, studied for their colour and plainness.",
      },
      {
        id: "I6",
        round: 2,
        name: "Keycaps",
        idea: "Actions are keys with a hard 3 px skirt that drops to 1 px when pressed; the four colours are four keys.",
        body: "The chunky keyboard, drawn flat. A key's lower edge is a solid, unblurred band; pressing moves the key down 2 px. A row of four coloured keys in the mark's order is the owned moment. Product buttons keep a 1 px skirt.",
        pros: [
          "The most direct answer to chunky keyboards.",
          "Cheap: shadows only.",
        ],
        cons: ["Close to neo-brutalism's offset shadow.", "No glass."],
      },
      {
        id: "I7",
        round: 2,
        name: "Case and screen",
        idea: "The ink stage becomes a dark screen set into the warm case; colour is light on that screen.",
        body: "The Deep Field stage, inset with a bezel, an inner shadow and a glass rim on its top edge, as a screen sat in its case. The four colours appear only on the screen.",
        pros: ["Ink keeps its role, inside a warm frame.", "No blur cost."],
        cons: [
          "A screen inside a page can read as a device mock-up.",
          "Glass only as a rim.",
        ],
      },
      {
        id: "I8",
        round: 2,
        name: "Keys under glass",
        idea: "The case and its keys from early computing, with one pane of frosted glass laid over a row of coloured keys.",
        body: "Coloured keys sit on the warm canvas; a glass panel holding the headline slides over part of them, and their colour shows through the frost as light. One glass panel per view, on expressive pages only. Glass holds ink and blue text only, and turns opaque when the visitor asks for less transparency.",
        pros: [
          "Holds every term of the brief: off-white canvas, chunky keys, colour, glass.",
          "Every text pair passes AA over every backdrop measured.",
          "Frosted, so it renders alike in Chrome, Safari and Firefox.",
        ],
        cons: [
          "Three ideas (case, key, glass) need a written list of where each may appear.",
          "Frostier than Apple's clear glass.",
        ],
        recommended: true,
      },
      {
        id: "I9",
        chosen: true,
        round: 2,
        name: "Liquid platinum",
        idea: "Liquid glass in full on the warm canvas: bent glass, a highlight that follows the pointer, glass on every expressive surface.",
        body: "I8's glass everywhere, with refraction at its edges where the browser supports it, and a rim highlight that moves only while the pointer does.",
        pros: [
          "The most current look.",
          "The moving highlight answers the visitor (J2).",
        ],
        cons: [
          "Reads as Apple's material.",
          "Refraction works in Chromium only.",
          "Invites the legibility criticism Liquid Glass drew; the highest GPU cost.",
        ],
        learns: "Liquid Glass, 2025, studied as prior art.",
      },
    ],
  },
  {
    letter: "J",
    slug: "motion",
    title: "Motion",
    question: "How does Pluto move?",
    why: "Google's dots bounce and morph while it listens. Motion is identity people remember. Today Pluto allows one hello per page.",
    options: [
      {
        id: "J1",
        name: "One hello",
        idea: "The mark assembles once; everything after is a 200 ms response.",
        body: "The design book's budget. Calm and respectful of attention.",
        pros: ["Never distracting.", "Built."],
        cons: ["Little to remember beyond the entrance."],
      },
      {
        id: "J2",
        chosen: true,
        name: "Answers the visitor",
        idea: "Motion only in reply: press, run, count. Free to be rich when the visitor acts.",
        body: "Nothing moves on its own after the hello. When the visitor runs code, the bloom brightens, meters fill, numbers count up once. Rich response, no ambient noise.",
        pros: ["Feels alive without nagging.", "Ties motion to cause."],
        cons: ["Static until touched; a hero must invite the touch."],
        recommended: true,
      },
      {
        id: "J3",
        name: "Alive",
        idea: "One slow ambient motion per page (the field breathes) plus responses.",
        body: "A page has a pulse: a slow wave across the dot field, paused when off-screen and stopped under reduced motion.",
        pros: ["Memorable; the brand feels on."],
        cons: ["Distracts readers.", "Battery and performance cost."],
      },
      {
        id: "J4",
        chosen: true,
        name: "Springs",
        idea: "Physical springs with gentle overshoot for every move.",
        body: "Dots overshoot and settle; meters and moves land with a small bounce. Colour and light never bounce. Playful and tactile.",
        pros: ["Joyful, consumer-friendly."],
        cons: [
          "Close to Material 3 Expressive.",
          "Overshoot tires quickly in a work tool.",
        ],
      },
    ],
  },
  {
    letter: "K",
    slug: "scale",
    title: "Expressive ceiling",
    question: "How big may a headline get?",
    why: "Scale is the cheapest form of confidence. Today display type stops at 44 px.",
    options: [
      {
        id: "K1",
        name: "Measured",
        idea: "Display up to 64 px; proof numbers to 72 px.",
        body: "Bigger than today, still bookish.",
        pros: ["Fits beside product imagery."],
        cons: ["Polite rather than definitive."],
      },
      {
        id: "K2",
        name: "Confident",
        idea: "Display up to 92 px, tight; proof numbers to 96 px.",
        body: "The lab's scale. A headline fills the left half of a wide screen.",
        pros: ["Proven in the lab's hero.", "Strong without shouting."],
        cons: ["Needs short headlines."],
        recommended: true,
      },
      {
        id: "K3",
        chosen: true,
        name: "Poster",
        idea: "Display up to 160 px for launch moments.",
        body: "Two or three words fill the screen. Reserved for launches and campaigns.",
        pros: ["Unmistakable."],
        cons: [
          "Only works with very short copy.",
          "Rarely suits a product page.",
        ],
      },
    ],
  },
  {
    letter: "L",
    slug: "voice",
    title: "Voice",
    question: "How does Pluto speak?",
    why: 'Google speaks plainly and helpfully; Microsoft speaks to every person and organisation. The voice carries the thesis, "Work runs on data", into every page.',
    options: [
      {
        id: "L1",
        name: "Plain and exact",
        idea: "Short sentences, one idea each; facts over adjectives.",
        body: "Today's writing rules, kept. Trust through precision.",
        pros: ["Credible; easy to keep consistent."],
        cons: ["Can feel cold in marketing."],
      },
      {
        id: "L2",
        name: "Bold and declarative",
        idea: "Few words, said with conviction; the claim first.",
        body: "Headlines of three to six words. Sentences that end hard.",
        pros: ["Memorable and quotable."],
        cons: ["Risks swagger without proof beside it."],
      },
      {
        id: "L3",
        chosen: true,
        name: "Warm and human",
        idea: "Speaks to people and what they care about; the work, not the tool.",
        body: "Empowerment, concretely: what you finish, what you get back. The founder's positioning notes in words.",
        pros: ["Widest audience.", "Fits a workspace suite."],
        cons: ["Easy to drift into fluff."],
        learns:
          "The founder's positioning notes: sell the empowerment, not the tech.",
        recommended: true,
      },
      {
        id: "L4",
        name: "Open and technical",
        idea: "Shows the verbs, the numbers and the source.",
        body: "glob, grep, search. One kernel. The proof is the copy.",
        pros: ["Developers trust it."],
        cons: ["Narrow; loses business buyers."],
      },
    ],
  },
  {
    letter: "M",
    slug: "imagery",
    title: "Imagery",
    question: "What pictures does Pluto show?",
    why: "Imagery is the largest surface on a brand page. Google mixes product UI and people; Stripe and Vercel show product and abstract light.",
    options: [
      {
        id: "M1",
        chosen: true,
        name: "Product truth",
        idea: "Real screens, real output, real data. Nothing staged.",
        body: "Every image is the product running. Crops, zooms and annotations, never mock-ups.",
        pros: ["Honest; proves the claim."],
        cons: ["Needs a finished product to show."],
      },
      {
        id: "M2",
        chosen: true,
        name: "Figures",
        idea: "Exact diagrams with captions: data, permissions and flows drawn as figures.",
        body: "In the register of a good textbook: numbered, captioned, precise. The dot device draws them.",
        pros: ["Explains the platform.", "Owned style."],
        cons: ["Intellectual; less emotional."],
        recommended: true,
      },
      {
        id: "M3",
        chosen: true,
        name: "People at work",
        idea: "Photography of real people doing real work, warm light, no posing.",
        body: "Teams and individuals mid-task. The suite is about the work people finish.",
        pros: ["Human; widest appeal."],
        cons: ["Costly to make well.", "Stock photography is a constant risk."],
      },
      {
        id: "M4",
        chosen: true,
        name: "Abstract data",
        idea: "Rendered dot fields, streams and light; the device as art.",
        body: "Large abstract images made from the device. Campaign imagery that is unmistakably Pluto.",
        pros: ["Ownable; no photography needed."],
        cons: [
          "Says little about the product on its own.",
          "A four-colour halftone carries the mark's Google and Microsoft echo to billboard size (see question N).",
        ],
      },
    ],
  },
  {
    letter: "N",
    slug: "mark",
    title: "The mark's order and spacing",
    question: "Do the four dots keep Google's order and a tile's spacing?",
    why: "Blue, red, yellow, green in reading order is the order in which Google's wordmark first shows each colour, and a tight 2×2 reads as a Microsoft-style tile at small sizes (brands memo). The dots and their four colours stay; their order and spacing are open.",
    options: [
      {
        id: "N1",
        chosen: true,
        name: "Kept",
        idea: "Blue, red / yellow, green; dot .30 em, gap .08 em.",
        body: "Today's mark, exactly. Every asset already built stays valid.",
        pros: ["No change to any shipped asset.", "Tuned and documented."],
        cons: ["A fragment can say Google before it says Pluto."],
      },
      {
        id: "N2",
        name: "Open colon",
        idea: 'Same order; the gap opens to .16 em so the mark reads as "::", two colons.',
        body: 'The dots stop touching visually and read as punctuation: a colon, the sign that something follows. Work runs on data: the mark says "here comes the data".',
        pros: [
          "Distinct from a tile.",
          "Ties the mark to language and to the device.",
        ],
        cons: [
          "Looser at 16 px; the favicon needs its own tuning.",
          "The design book corrected .16 to .08 once already.",
        ],
      },
      {
        id: "N3",
        name: "Pluto's order",
        idea: "Blue, green / yellow, red: cool on top-left to warm on bottom-right.",
        body: "The order no one else uses. Blue (act) and green (done) lead; red closes the mark. The colours keep their meanings.",
        pros: [
          "Breaks the Google order.",
          "A diagonal of warm and cool reads as a deliberate system.",
        ],
        cons: [
          "Every existing asset changes.",
          "Red in the last place can read as an alert in a status context.",
        ],
      },
      {
        id: "N4",
        name: "Pluto's order, open colon",
        idea: "Blue, green / yellow, red, with the .16 em colon gap.",
        body: "Both fixes together: the most distinct mark that still has four round dots in blue, red, yellow and green.",
        pros: [
          "The most ownable form.",
          "Reads as punctuation, not a tile or a Google echo.",
        ],
        cons: ["The largest change to the mark.", "Needs a favicon cut."],
        recommended: true,
      },
    ],
  },
];

/** A question's options, round two first, so the owner meets the new ones first. */
export function ordered(q: Question): Option[] {
  return [
    ...q.options.filter((o) => o.round),
    ...q.options.filter((o) => !o.round),
  ];
}

export function question(slug: string): Question {
  const q = QUESTIONS.find((q) => q.slug === slug);
  if (!q) throw new Error(`identity: no question "${slug}"`);
  return q;
}
