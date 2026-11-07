# The identity options

- **Status:** complete. The owner's answers will be recorded in `decisions.md`; a newer memo will record the refinement.
- **Date:** 2026-11-01
- **Author:** the design lead
- **Question:** What are the open choices in Pluto Systems' identity, and what are three to five real options for each, shown live, so the owner can choose and refine?
- **What it blocks:** the identity's values in the token file (the brand slots of `009`); product themes; the typeface, light and motion work `009` and `010` defer.

## How to read this memo

Every claim carries a label. **EXECUTED:** run and seen on 2026-11-01. **READ:** a source says so, linked. **INFERRED:** reasoning.

The options are not in this memo. They are in the preview app, at `/identity` (run `bun run dev`), so each can be judged as it looks, in both themes and at phone width. This memo records what the exhibit holds and why the design lead recommends one set.

## The brief

- The owner's one constraint: compete with Google (READ, `decisions.md`, "The identity is commissioned, with options").
- The four-dot mark keeps a blue, a red, a yellow and a green (READ, the same).
- Pluto Systems: a workspace suite on one governed data layer built for agentic search; tagline "Work runs on data." (READ, the same).

## What the research found that shapes every option

- **Three of today's four colours are, to the eye, Google's.** Tombaugh Red is ΔE 2.3 from Google's red, Sputnik Amber 4.0, Hydra Green 3.4 (EXECUTED, the colour memo; the brands memo measured 2.7, 7.5 and 7.3 with a different reference set). About 2 is the smallest difference people notice side by side.
- **The mark's order is Google's.** Blue, red, yellow, green is the order in which Google's wordmark first shows each colour; a tight 2×2 reads as a Microsoft-style tile at small sizes (READ, the brands memo).
- **Both giants own their typeface.** Google Sans and Segoe are drawn for them; today Pluto's three faces are IBM's, Vercel's and JetBrains' (READ, the brands memo).
- **Blended four-colour light is now Google's AI look** (READ, the brands memo). Any four-colour light must keep the colours apart.
- **Four-colour product icons failed for Google** (2020) and Microsoft differentiates apps by colour (READ, the brands memo).
- **Expressive is additive, on the same tokens** (READ, the systems memo). `009` and `010` build that architecture, so any pick here fills a slot instead of forking the system.

## The fourteen questions

| | Question | Options | Recommended |
|---|---|---|---|
| A | How do Pluto and its products relate? | branded house; master suite; endorsed brands; open platform, branded suite | **A4** |
| B | Which blue, red, yellow and green? | Charon kept; Signal; Deep Field; Warm Paper; Spectral (measured, the colour memo) | **B3** |
| C | How much colour does a surface spend? | paper first; four-colour moments; colour fields; ink stage first | **C2** |
| D | What does the type look like? | kept; Plex only; round geometric; a face with character; commission Pluto Sans | **D5** |
| E | How is the name set beside the mark? | risen colon; leading mark; capitalised; two-word stack | **E1** |
| F | What grows out of the dots? | the field; orbits; quadrants; streams; the colon | **F1** |
| G | How do apps look in a launcher? | the mark's cell; one colour per tile; four-colour glyphs (shown to rule out); ink glyph, one dot | **G1** |
| H | What shape is Pluto? | exact; round actions; soft; square | **H2** |
| I | How is an object lit? | flat; bloom and rim; four lights; glass | **I3** |
| J | How does Pluto move? | one hello; answers the visitor; alive; springs | **J2** |
| K | How big may a headline get? | 64 px; 92 px; 160 px | **K2** |
| L | How does Pluto speak? | plain; bold; warm and human; open and technical | **L3** |
| M | What pictures does Pluto show? | product truth; figures; people at work; abstract data | **M2** |
| N | Do the dots keep Google's order and a tile's spacing? | kept; open colon; Pluto's order; both | **N4** |

## Why this set (INFERRED)

The set is one direction, not fourteen independent bests.

- **Own what the giants own, and nothing they own.** A drawn face (D5), colours measured at least ΔE 7 from Google and Microsoft in every hue (B3), and a mark whose order and spacing are no longer Google's or a tile (N4). These three move Pluto from "looks like Google" to "recognisably not".
- **Spend the four colours in owned moments** (C2): neutral product screens, and the four together only in the device, icons, light and data. That is how Google behaves, so the moments themselves must be Pluto's: the field (F1), the mark's cell (G1), four separate lights (I3).
- **Say the thesis without words.** The field lights dots as a search runs and a permission is checked: work running on data. Figures (M2) draw the platform the same way.
- **Confident, not loud.** 92 px display (K2), pill actions on exact fields (H2), motion only in answer to the visitor (J2). The design book's discipline survives as the productive mode; the expressive mode is where volume lives.
- **Speak to people** (L3): the founder's positioning notes ask to sell the empowerment, not the tech; the technical voice (L4) remains right for developer pages.
- **Name it like the giants** (A4): the suite compounds one brand, Pluto Docs, Pluto Sheets; the open platform keeps its own name, vfs, where developers trust it.

## What a pick changes

- **B, C, H, I, K:** values in the token file's slots (`009`), and, for light, new `light` tokens under the same utilities.
- **D:** a commission brief; meanwhile the display slot, `--font-face-display`, takes a stand-in. The other faces need the font items to change.
- **E, N:** the `four-dot` item's geometry and order, and its favicon cut.
- **A, G:** product themes and an icon set, each a future specification.
- **F, J, M:** a device component, motion tokens (springs, if J4), and an art-direction note.
- **L:** the copy rules in `decisions.md`.

## How the owner answers

On any board, name options by id ("B3, D5"), or mix them ("C2, with C4's stage for launches"). The compose page (`/identity/compose/`) shows any combination together and prints the answer line to paste.

## Limits

- Every board was checked in Chromium at 1440 and 390 px, in both themes, with no console errors (EXECUTED, by the builders and the design lead). Not checked in Firefox or Safari.
- D5's stand-in, Instrument Sans, has square dots; it shows proportion, not the round-dot idea.
- Photography (M3) is shown as art direction, not photographs.
- The colour candidates are arithmetic, checked on screen only in these boards.
