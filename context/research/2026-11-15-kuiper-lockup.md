# The Kuiper lockup

- **Status:** complete; waiting on the owner's answer (the question is at the end). Once the owner answers, the answer goes in the roadmap's lockup note, and a small specification changes the header (lane S).
- **Date:** 2026-11-15
- **Author:** the design lead's researcher
- **Question:** How should the design site's bar, and Kuiper's own identity, show the Kuiper name beside the Pluto Systems mark?
- **What it blocks:** the header change the roadmap holds under 0.13.0 ("Not a spec: the Kuiper lockup mock-ups"). It also blocks the bar link's name, which stays "pluto, Kuiper Design System" until the owner approves a Kuiper lockup (`018`, `020`).
- **The exhibit:** [`2026-11-15-kuiper-lockup/index.html`](2026-11-15-kuiper-lockup/index.html). Open it from disk; it needs no server. Its PNGs are in [`2026-11-15-kuiper-lockup/png/`](2026-11-15-kuiper-lockup/png/).

## How to read this memo

Every claim carries a label.

- **EXECUTED:** run and seen on 2026-11-15, in Chromium from this repository's Playwright.
- **READ:** a source says so. The prior art was read from the screenshots captured on 2026-11-15 in [`2026-11-15-design-sites/`](2026-11-15-design-sites/).
- **INFERRED:** our reasoning.

Terms of art.

- **Lockup.** A fixed arrangement of a mark and a word. Pluto Systems' lockup is the word "pluto", bold and lowercase, with the four-dot mark risen after it like a colon. In this memo "pluto⁚" stands for it.
- **Mark.** The four dots alone: blue and red above, yellow and green below.
- **Endorsement.** A smaller credit to the parent company beside a product's own name, as in "Made by WorkOS".
- **Phone form.** An option's shape below 768 px, where the bar folds its four doors into the menu.
- **Room.** The width the bar leaves for its header once the other controls are placed.

## In short

- **Five options are drawn,** plus today's bar for comparison. Each is shown in the real bar at 1440 and 390 px, in light and dark, at 72 px, and on the eight field colours (EXECUTED).
- **The bar leaves the header 202 px at 390, 172 at 360 and 132 at 320** (EXECUTED, and the same figures follow from `bar.svelte`'s measures).
- **Only two options fit the bar at every width in one form:** B, "kuiper⁚" (120 px), and today's lockup (104 px). A's full form is 1 px too wide at 390. C's full form fits 390 by 5 px and needs two narrower forms below that. D needs a phone form. E is 7 px over at 320 (EXECUTED).
- **Most reference systems set the parent's symbol beside the system's name:** Primer, Spectrum, Atlassian, GOV.UK and Geist do. Carbon sets its name in type alone. Material and Radix have marks of their own, and Radix credits WorkOS beside its own (READ).
- **Recommended: B, "kuiper⁚" in lowercase.** It is Pluto's own form of the most common pattern. It fits everywhere in one form. Its link's name is the plainest. It keeps the mark in the bar, and the bar's doors are that mark's four dots. Its cost is real: the risen mark stops following only "pluto". That needs a written rule (below).

## 1. What binds every option

These rules come from the Brand pages and the owner's answers. An option that breaks one is shown only to rule it out.

- **The mark never changes.** Four dots in a square, blue and red above, yellow and green below. Each dot is 0.30 em, and the gap is 0.08 em (`/brand/mark/`; the owner's N1). READ.
- **The lockup's construction.** The word is lowercase and bold. The mark is set at 0.87 of the word's size, 0.10 em from it, and rises 0.36 em of its own size, so its top sits 0.90 em above the baseline (`/brand/mark/`; the owner's E6). READ. The exhibit draws it with the same CSS as `lockup.svelte` and measured the top at 0.905 em (EXECUTED).
- **Clear space:** one dot-pair height on every side of the lockup. **The smallest size:** below 20 px of lockup height, use the mark alone (`/brand/mark/`). READ.
- **Grounds.** Four colours on paper and light grounds. One colour, the field's own legend, on a colour field. Never the four colours on a field: the yellow dot measures 1.00:1 on the yellow field (`/brand/mark/`; `016`). On dark expressive pages, such as this site's, the mark lifts its four colours (`app.css`). READ.
- **Letter spacing is the font's own, 0, everywhere** (`019a` decision 1). The word "pluto" at 100 px is 245 px wide. The exhibit measured 245.0 px, so its type matches the site's (EXECUTED).
- **Depth.** Nothing inside the bar is translucent (`019a` decision 3). Any rule drawn inside the bar must be a solid colour. C's rule takes `--input`, not the 10% hairline `--border`. READ and INFERRED.
- **Architecture.** The owner chose A4: every workspace product carries Pluto's name (Pluto Docs, Pluto Sheets), and each open-source core technology keeps its own name, as `vfs` does (`decisions.md` at `beeb67e`, "A4"). Kuiper is a public product any team may adopt, under its own name (constitution §1). READ. Under A4, Kuiper sits in the second group: its own name, credited to Pluto (INFERRED).
- **The lockup word "pluto" never changes.** `020` lists it as brand that the rename must not touch. READ. No option here redraws "pluto⁚". B adds a second word in the same form beside it.

## 2. How other systems show a system's name beside the company's mark

Read from the headers captured on 2026-11-15, at 1440 and 390 (READ, `2026-11-15-design-sites/<system>-home-{1440,390}-light.png`).

| System | Company | At 1440 | At 390 | Pattern |
|---|---|---|---|---|
| Primer | GitHub | GitHub's Octocat mark, then "Primer" in semibold | the same, larger | company symbol + system name |
| Spectrum | Adobe | Adobe's "A", then "Spectrum" in bold | the "A" alone; the word drops | company symbol + system name |
| Atlassian Design | Atlassian | Atlassian's product-icon row, then "Atlassian Design" | Atlassian's triangle alone | company symbol + system name |
| GOV.UK Design System | GOV.UK | the crown and "GOV•UK" logotype, then "Design System" in a regular weight | the logotype alone, larger | company lockup + system name |
| Geist | Vercel | a dotted triangle, Vercel's triangle redrawn in dots, then "Geist Design System" | the same | derived company symbol + system name |
| Carbon | IBM | "Carbon Design System" in type; no IBM mark | the same, wrapped onto two lines | system name in type alone |
| Material | Google | its own "M" mark in the side rail; no Google logo. The page's lede names Google | its own mark | system's own mark |
| Radix | WorkOS | Radix's mark and "Radix", a vertical rule, then "Made by WorkOS" with WorkOS's mark | the same, smaller | own name, endorsed by the maker |
| Polaris | Shopify | now inside Shopify's developer docs: Shopify's bag and "dev docs"; "Polaris references" is a page title | the bag and "dev docs" | absorbed into the company's docs |

What this shows (INFERRED):

- **Five of nine put the company's symbol beside the system's name,** in one unit. It is the common way to say "this system is that company's".
- **On a phone, the systems that crowd drop a part.** Spectrum and Atlassian keep the company's symbol and drop the word. Carbon wraps. None shrinks its type below the header's size.
- **The endorsed form is rarer, and is used where the maker is a different name.** Radix credits WorkOS, which bought it. Material names Google in prose, not in the header.
- **Geist is the one system that redraws the company's mark for itself.** Vercel's triangle becomes a triangle of dots. Kuiper's equivalent would be a new arrangement of the four dots, and Kuiper's rules forbid that (§1). That is option E.

## 3. The options

The widths are the header's link box at 28 px (the bar's `text-2xl`), its 8 px padding on each side included. "Spare" is the room less that width. A negative spare pushes search, the theme switch and the menu out of the bar. All widths are EXECUTED in the exhibit's fonts.

| | Option | Full form | Spare at 1440 | Full form at 390 | Phone form: 390 / 360 / 320 |
|---|---|---|---|---|---|
| 0 | Today, "pluto⁚" | 104 | +442 | +98 | +98 / +68 / +28 |
| A | "pluto⁚ Kuiper" | 203 | +343 | **−1** | the lockup alone: +98 / +68 / +28 |
| B | "kuiper⁚" | 120 | +426 | +82 | the same form: +82 / +52 / +12 |
| C | "Kuiper │ pluto⁚" | 197 | +348 | +5 | "Kuiper │ ⁘", 144: +58 / +28 / **−12**; so "Kuiper" alone below 360: +28 |
| D | "Kuiper Design System" | 296 | +250 | **−94** | "Kuiper", 104: +98 / +68 / +28 |
| E | "kuiper····" | 139 | +407 | +64 | the same: +64 / +34 / **−7** |

Room: 545 px beside the four doors at 1440; 202 at 390; 172 at 360; 132 at 320.

### Option 0. Today (the baseline)

"pluto⁚", with the link named "pluto, Kuiper Design System". Kuiper's name is never seen in the bar. The site is called Kuiper only in the page title and the hero ("Design with Kuiper").

### Option A. The lockup, then Kuiper: "pluto⁚ Kuiper"

The company lockup, untouched. Then its clear space, one dot-pair high (17 px at 28 px). Then "Kuiper" in the heading face, regular weight.

- **The case for it.** It is GOV.UK's form: the company's lockup, then the system's name in a lighter weight. The lockup is never redrawn. The risen mark reads as a colon, "pluto: Kuiper", which is the colon idea the brand research proposed for product names (`2026-11-01-how-definitive-brands-are-built.md` §7.3). It gives every future product the same form: "pluto⁚ Docs" (INFERRED).
- **The costs.** The full form is 203 px, 1 px wider than the bar leaves at 390, and 31 px over at 360. Its phone form must drop "Kuiper", so a phone never sees the name: the same as today. It reads as A4's branded suite ("Pluto Kuiper"), the form A4 gives to workspace products, not to a public product with its own name (INFERRED).
- **The link's name:** "pluto Kuiper Design System", which contains the visible "pluto Kuiper" (WCAG 2.5.3).

### Option B. Kuiper in the lockup's form: "kuiper⁚" (recommended)

"kuiper" takes the word's place: lowercase, bold, the mark risen after it at the same size, gap and rise.

- **The case for it.** It is Pluto's form of the most common pattern: Primer and Spectrum put the company's symbol beside the system's name. Kuiper's name leads, as the site's hero does. The mark stays in the bar, and the bar's four doors are that mark's four dots ("the mark is the map", `018`). It is 120 px at every width and fits 320 with 12 px to spare, so it needs no phone form. Its link is named "Kuiper Design System", which contains the visible "kuiper". No second element and no hidden word are needed. The entrance, the mark's one hello, plays as today.
- **The costs.** The risen mark no longer follows only "pluto". A reader who sees "kuiper⁚" alone may take Kuiper for the company. Without a rule, any product might take the form, and the company's lockup would lose its meaning (INFERRED). The rule this needs: *the risen mark follows "pluto" and the names of Pluto Systems' public, own-named products (Kuiper, `vfs`); workspace products carry "pluto" itself, as A4 says.* Under that rule the mark after a name means "by Pluto Systems", as Adobe's "A" does beside "Spectrum". The site's footer already says whose Kuiper is: it carries the company lockup, named "Pluto Systems", with "Work runs on data." (READ, `src/lib/site/chrome/footer.svelte`). That stays.
- **A sub-choice:** lowercase "kuiper⁚" (recommended: the lockup's grammar) or capitalised "Kuiper⁚" (as the hero and prose set it). Both are drawn in the exhibit, under B.
- **A naming note.** Amazon's satellite network was called Project Kuiper until Amazon renamed it Amazon Leo on 13 November 2025 (READ: [The Register](https://www.theregister.com/2025/11/14/project_kuiper_amazon_leo/), [Payload](https://payloadspace.com/project-kuiper-becomes-amazon-leo/)). A standalone "kuiper" wordmark is less likely to be read as Amazon's now. No trademark search was made; that is outside this memo.

### Option C. Kuiper, endorsed by Pluto: "Kuiper │ pluto⁚"

"Kuiper" bold, a solid vertical rule, then the company lockup at 0.8 of the size (22.4 px, its top 20.3 px above the baseline, above the 20 px floor).

- **The case for it.** It is A4 as the owner wrote it: a public product keeps its own name, credited to Pluto. It is Radix's form ("Radix │ Made by WorkOS"). The company lockup appears exactly as drawn, and the word "pluto" stays in the bar.
- **The costs.** Two bold names compete in the bar. It needs three forms: the full form (197 px) fits 390 by 5 px only; below 768 the endorsement becomes the mark alone, "Kuiper │ ⁘" (144 px), which is 12 px over at 320; so below 360 "Kuiper" stands alone. That is the most code and the most tests of any option (INFERRED). The endorsement must sit outside the home link, with its own name ("by Pluto Systems"), so the link's name can stay "Kuiper Design System".
- **A variant not drawn:** "Kuiper │ by pluto⁚" spells out the endorsement. It is about 30 px wider again (INFERRED).

### Option D. Kuiper in type alone: "Kuiper Design System"

No mark in the bar. "Kuiper" bold and "Design System" regular, in the heading face, as Carbon sets its name. "Kuiper" alone below 768. The company lockup is left to the site's footer, which already carries it (`footer.svelte`).

- **The case for it.** It is how Kuiper's own app shell treats a product with no logo: its name, set as a wordmark in the heading face (`008`). The site would show itself built like any product on Kuiper. It is the simplest code and the plainest name.
- **The costs.** The mark leaves the bar, and with it the page's one entrance on every page but the home page. The bar loses the brand's one colour moment on a phone, where the doors' dots are folded away. The Brand door then teaches a lockup the site's own bar does not use (INFERRED).

### Option E. The belt: "kuiper····" (ruled out)

The four dots pulled into a row after "kuiper", for the Kuiper belt that lies beyond Pluto. It is drawn because the brief asked whether a Kuiper arrangement of the dots could work.

- **Why it is ruled out.** It breaks the mark's square, which the owner fixed (N1). Four dots in a row, blue, red, yellow, green, is the shape and order of Google's own four-dot motif, and the research already found that a fragment of this mark can read as Google's (`2026-11-01-how-definitive-brands-are-built.md` §6.1). It is also 7 px over at 320.
- **What would stay within the rules:** a belt drawn *around* an unchanged mark, such as an orbit. That is a new device. The owner set orbits aside when choosing F1, the field (`2026-11-01-the-identity-options.md`, question F). It is not drawn.

## 4. The options against what matters

| | Kuiper seen in the bar | The mark in the bar | One form at every width | A4's model | Lockup unchanged | Link's name |
|---|---|---|---|---|---|---|
| 0 | no | yes | yes | — | yes | needs the hidden "Kuiper" |
| A | at ≥ 768 only | yes | no (2) | branded suite | yes | "pluto Kuiper …" |
| **B** | **yes** | **yes** | **yes** | **own name, credited** | **yes, plus a second word in its form** | **"Kuiper Design System"** |
| C | yes | yes, from 360 | no (3) | own name, credited | yes | the link plus a separate credit |
| D | yes | no (footer only) | no (2) | own name | not used | "Kuiper Design System" |
| E | yes | broken | no | — | broken | — |

(INFERRED, from §1 to §3.)

## 5. Recommendation

**B, lowercase "kuiper⁚",** with the rule in §3 written into the Brand door's mark page and `roadmap.md`. The footer keeps the company lockup it carries today. It shows Kuiper's name at every width in one 120 px form. It keeps the mark, its entrance and its colours in the bar. It follows the commonest reference pattern in Pluto's own grammar.

If the owner wants the word "pluto" to stay in the bar, **C** is the honest second choice. It costs three forms and a busier bar.

What the small specification would change (INFERRED, to be confirmed by its own research):

- `src/lib/site/chrome/bar.svelte`: the header draws "kuiper" with the `FourDot` mark, composed in the site's code, so no registry item's interface changes. Adding a `word` prop to the `Lockup` item instead would be an interface change, which a small change may not make.
- The link's name becomes "Kuiper Design System" (`site.spec.ts` checks it; `018` criterion 23 and its landing note).
- A width fixture for "kuiper", as `tests/fixtures/lockup-word-width.json` holds "pluto"; a check that the bar fits at 320.
- The thumbnails the site layout stales (`019a` landing notes).
- The Brand door's mark page gains the rule. The footer is unchanged.

## 6. Limits

- Chromium only. Not checked in Firefox or WebKit.
- The page under each bar is a sketch of the home page's first screen, not the site. The bar itself follows `bar.svelte`'s measures: 72 px panel, 8 px top margin, the gutter `clamp(1rem, 4vw, 3.5rem)`, the gaps 8, 16 and 24 px, search 40 or 128 px, the theme switch 48 px, the menu 32 px. The glass's pointer light sits at its resting place.
- Nothing scrolls under the bar in the plates, so the blur shows nothing. `019a` measured the glass's contrast; no option changes the bar's colours.
- The widths are measured in the exhibit's copies of the site's font files (IBM Plex Sans and Geist, latin, OFL; their licences are beside them in `fonts/`).
- The prior art is one day's screenshots. Polaris's address now lands in Shopify's developer docs; its older standalone site, with its own header, was not captured.

## 7. The PNGs

In [`2026-11-15-kuiper-lockup/png/`](2026-11-15-kuiper-lockup/png/), drawn by Playwright from the exhibit (EXECUTED, no console errors):

- `{today,a,b,c,d,e}-1440-{light,dark}.png`: the bar at 1440, with the hero's sketch, at 1×.
- `{today,a,b,c,d,e}-390-{light,dark}.png`: the bar at 390, at 2×.
- `{today,a,b,c,d,e}-large.png`: each option at 72 px on paper and ink, and at 36 px on the eight fields.
- `compare-{1440,390,320}-{light,dark}.png`: every option's bar stacked, at 2×. These are the quickest way to compare.
- `widths-table.png`: the measured widths.

## Question for the owner

**Q1. How does the design site's bar show Kuiper beside the Pluto Systems mark?**

1. **(Recommended) B, "kuiper⁚":** Kuiper's name in the lockup's own form, lowercase, the mark risen after it. One 120 px form at every width. The rule "the risen mark follows 'pluto' and the names of Pluto Systems' own-named public products" is written into the Brand door; the footer keeps the company lockup. Sub-choice: lowercase (recommended) or "Kuiper⁚".
2. **C, "Kuiper │ pluto⁚":** Kuiper leads, the company lockup credits it at 0.8 size. On phones it becomes "Kuiper │ ⁘", and "Kuiper" alone below 360.
3. **A, "pluto⁚ Kuiper":** the company lockup, then Kuiper in a regular weight. On phones "Kuiper" drops and the bar shows today's lockup.
4. **D, "Kuiper Design System" in type:** no mark in the bar; "Kuiper" alone on phones; the company lockup stays only in the footer.
5. **Keep today's "pluto⁚"** and leave Kuiper to the page title and the hero.

E, the belt, is not offered: it breaks the mark's square and echoes Google's four dots in a row.

## The owner's answer (2026-11-15)

The owner, verbatim: "I think just pluto. It's not a product page so it doesn't have its own branding, it is a system for pluto. It can go in the tab header, but we shouldn't have a new Kuiper logo or word mark that is the pages logo."

So the answer is **option 0: today's "pluto⁚" lockup stays in the bar.** Kuiper has no logo or wordmark of its own. It is Pluto's system, named in text: in the browser tab (`SITE_NAME`, "Kuiper Design System", already in every page title through `pageTitle()`), the hero and prose. No header change is built, and the small spec this exhibit would have led to is not written. The proposed Brand-door rule about the mark following product names is withdrawn.
